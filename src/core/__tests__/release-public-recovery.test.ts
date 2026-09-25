import { spawn, spawnSync } from 'node:child_process';
import { chmod, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const repositoryRoot = resolve(import.meta.dirname, '../../..');
const publicVerifierSource = join(repositoryRoot, 'scripts/verify-release-public.sh');
const expectedVersion = '0.10.0';
const expectedPackageHash = 'b'.repeat(64);

interface CommandResult {
  code: number | null;
  stdout: string;
  stderr: string;
}

interface Fixture {
  testRoot: string;
  repositoryRoot: string;
  mockBin: string;
  expectedCommit: string;
  expectedPackageHash: string;
  curlCountPath: string;
  sleepLogPath: string;
  verifierCountPath: string;
  verifierLogPath: string;
}

const activeFixtures: string[] = [];

afterEach(async () => {
  await Promise.all(activeFixtures.splice(0).map((path) => rm(path, { recursive: true, force: true })));
});

function runGit(repositoryPath: string, args: string[]): void {
  const result = spawnSync('git', args, { cwd: repositoryPath, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${result.stderr}`);
  }
}

async function writeExecutable(path: string, contents: string): Promise<void> {
  await writeFile(path, `#!/usr/bin/env bash\n${contents}`, 'utf8');
  await chmod(path, 0o755);
}

async function readText(path: string): Promise<string> {
  return existsSync(path) ? readFile(path, 'utf8') : '';
}

async function createFixture(scenario: string): Promise<Fixture> {
  const testRoot = await mkdtemp(join(tmpdir(), 'geoptimize-release-public-recovery-'));
  activeFixtures.push(testRoot);
  const fixtureRepository = join(testRoot, 'repo');
  const mockBin = join(testRoot, 'bin');
  await mkdir(join(fixtureRepository, 'scripts'), { recursive: true });
  await mkdir(mockBin);

  const packageManifest = {
    name: 'geoptimize',
    version: expectedVersion,
    private: true,
  };
  const archiveLock = {
    name: 'geoptimize',
    version: expectedVersion,
    lockfileVersion: 3,
    marker: 'archive-lock',
  };
  const workingLock = {
    ...archiveLock,
    marker: 'working-lock',
  };
  await writeFile(join(fixtureRepository, 'package.json'), `${JSON.stringify(packageManifest)}\n`, 'utf8');
  await writeFile(join(fixtureRepository, 'package-lock.json'), `${JSON.stringify(archiveLock)}\n`, 'utf8');
  await writeFile(join(fixtureRepository, 'scripts/verify-release-public.sh'), await readFile(publicVerifierSource, 'utf8'), 'utf8');
  await chmod(join(fixtureRepository, 'scripts/verify-release-public.sh'), 0o755);
  await writeFile(join(fixtureRepository, 'scripts/prepare-release-consumer.mjs'), '// Archived consumer fixture\n', 'utf8');
  await writeExecutable(join(fixtureRepository, 'scripts/verify-release-v0.8.sh'), `
set -u
count=$(cat "$MOCK_VERIFIER_COUNT" 2>/dev/null || echo 0)
count=$((count + 1))
printf '%s' "$count" > "$MOCK_VERIFIER_COUNT"
printf 'commit=%s\\nhash=%s\\narchive-lock=%s\\n' "$1" "$2" "$(cat package-lock.json)" >> "$MOCK_VERIFIER_LOG"
exit \"\${MOCK_VERIFIER_EXIT:-0}\"
`);

  const curlCountPath = join(testRoot, 'curl-count.txt');
  const curlLogPath = join(testRoot, 'curl.log');
  const sleepLogPath = join(testRoot, 'sleep.log');
  const verifierCountPath = join(testRoot, 'verifier-count.txt');
  const verifierLogPath = join(testRoot, 'verifier.log');

  await writeExecutable(join(mockBin, 'curl'), `
set -euo pipefail
output_file=
url=
while [ "$#" -gt 0 ]; do
  case "$1" in
    -o) output_file=$2; shift 2 ;;
    -w) shift 2 ;;
    -*) shift ;;
    *) url=$1; shift ;;
  esac
done
count=$(cat "$MOCK_CURL_COUNT" 2>/dev/null || echo 0)
count=$((count + 1))
printf '%s' "$count" > "$MOCK_CURL_COUNT"
printf '%s\\n' "$url" >> "$MOCK_CURL_LOG"
status=200
body='{}'
case "$MOCK_CURL_SCENARIO:$count" in
  ready-sequence:1|exhausted:*)
    status=404
    body='{}'
    ;;
  ready-sequence:2)
    status=200
    body=$(printf '{"versions":{},"dist-tags":{"latest":"%s"}}' "$MOCK_EXPECTED_VERSION")
    ;;
  ready-sequence:3|verifier-failure:1)
    status=200
    body=$(printf '{"versions":{"%s":{"marker":"published"}},"dist-tags":{"latest":"%s"}}' "$MOCK_EXPECTED_VERSION" "$MOCK_EXPECTED_VERSION")
    ;;
  latest-mismatch:1)
    status=200
    body=$(printf '{"versions":{"%s":{"marker":"published"}},"dist-tags":{"latest":"0.0.0"}}' "$MOCK_EXPECTED_VERSION")
    ;;
  unauthorized:1)
    status=401
    body='{"error":"unauthorized"}'
    ;;
esac
printf '%s' "$body" > "$output_file"
printf '%s' "$status"
`);
  await writeExecutable(join(mockBin, 'sleep'), `
printf '%s\\n' "$*" >> "$MOCK_SLEEP_LOG"
`);

  runGit(fixtureRepository, ['init', '--quiet']);
  runGit(fixtureRepository, ['config', 'user.email', 'release-public-recovery@example.invalid']);
  runGit(fixtureRepository, ['config', 'user.name', 'Release Public Recovery Test']);
  runGit(fixtureRepository, ['add', 'package.json', 'package-lock.json', 'scripts']);
  runGit(fixtureRepository, ['commit', '--quiet', '-m', 'fixture release']);
  const expectedCommitResult = spawnSync('git', ['rev-parse', 'HEAD'], {
    cwd: fixtureRepository,
    encoding: 'utf8',
  });
  if (expectedCommitResult.status !== 0) throw new Error(expectedCommitResult.stderr);
  const expectedCommit = expectedCommitResult.stdout.trim();
  if (!/^[0-9a-f]{40}$/.test(expectedCommit)) throw new Error(`unexpected fixture commit: ${expectedCommit}`);

  await writeFile(join(fixtureRepository, 'package-lock.json'), `${JSON.stringify(workingLock)}\n`, 'utf8');
  await writeFile(join(testRoot, 'scenario.txt'), scenario, 'utf8');

  return {
    testRoot,
    repositoryRoot: fixtureRepository,
    mockBin,
    expectedCommit,
    expectedPackageHash,
    curlCountPath,
    sleepLogPath,
    verifierCountPath,
    verifierLogPath,
  };
}

function runPublicVerifier(fixture: Fixture, scenario: string, verifierExit = 0): Promise<CommandResult> {
  return new Promise((resolveResult, reject) => {
    const child = spawn('bash', [join(fixture.repositoryRoot, 'scripts/verify-release-public.sh'), fixture.expectedCommit, fixture.expectedPackageHash], {
      cwd: fixture.repositoryRoot,
      env: {
        ...process.env,
        PATH: `${fixture.mockBin}:${process.env.PATH ?? ''}`,
        MOCK_CURL_COUNT: fixture.curlCountPath,
        MOCK_CURL_LOG: join(fixture.testRoot, 'curl.log'),
        MOCK_CURL_SCENARIO: scenario,
        MOCK_EXPECTED_VERSION: expectedVersion,
        MOCK_SLEEP_LOG: fixture.sleepLogPath,
        MOCK_VERIFIER_COUNT: fixture.verifierCountPath,
        MOCK_VERIFIER_LOG: fixture.verifierLogPath,
        MOCK_VERIFIER_EXIT: String(verifierExit),
        RELEASE_PUBLIC_VERIFY_INITIAL_DELAY_SECONDS: '0',
        RELEASE_PUBLIC_VERIFY_MAX_ATTEMPTS: '3',
        RELEASE_PUBLIC_VERIFY_MAX_DELAY_SECONDS: '0',
      },
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    child.on('error', reject);
    child.on('close', (code) => resolveResult({ code, stdout, stderr }));
  });
}

describe('public release visibility recovery', () => {
  it('recovers from 404 and missing-version visibility states, then runs the archived verifier once', async () => {
    const fixture = await createFixture('ready-sequence');
    const result = await runPublicVerifier(fixture, 'ready-sequence');
    const verifierLog = await readText(fixture.verifierLogPath);
    const sleepLog = await readText(fixture.sleepLogPath);

    expect(result.code, result.stderr).toBe(0);
    expect(await readText(fixture.curlCountPath)).toBe('3');
    expect(await readText(fixture.verifierCountPath)).toBe('1');
    expect(verifierLog).toContain(`commit=${fixture.expectedCommit}`);
    expect(verifierLog).toContain(`hash=${fixture.expectedPackageHash}`);
    expect(verifierLog).toContain('archive-lock');
    expect(verifierLog).not.toContain('working-lock');
    expect(sleepLog.trim().split('\n')).toEqual(['0', '0']);
  });

  it('fails nonzero after bounded 404 retries without invoking the archived verifier', async () => {
    const fixture = await createFixture('exhausted');
    const result = await runPublicVerifier(fixture, 'exhausted');

    expect(result.code).not.toBe(0);
    expect(await readText(fixture.curlCountPath)).toBe('3');
    expect(existsSync(fixture.verifierCountPath)).toBe(false);
    expect((await readText(fixture.sleepLogPath)).trim().split('\n')).toEqual(['0', '0']);
  });

  it('does not retry a 200 packument whose latest tag mismatches the archived version', async () => {
    const fixture = await createFixture('latest-mismatch');
    const result = await runPublicVerifier(fixture, 'latest-mismatch');

    expect(result.code).not.toBe(0);
    expect(result.stderr).toContain('npm latest is 0.0.0');
    expect(await readText(fixture.curlCountPath)).toBe('1');
    expect(existsSync(fixture.sleepLogPath)).toBe(false);
    expect(existsSync(fixture.verifierCountPath)).toBe(false);
  });

  it('does not retry a non-transient 401 packument response', async () => {
    const fixture = await createFixture('unauthorized');
    const result = await runPublicVerifier(fixture, 'unauthorized');

    expect(result.code).not.toBe(0);
    expect(result.stderr).toContain('HTTP 401');
    expect(await readText(fixture.curlCountPath)).toBe('1');
    expect(existsSync(fixture.sleepLogPath)).toBe(false);
    expect(existsSync(fixture.verifierCountPath)).toBe(false);
  });

  it('returns an archived verifier/hash failure unchanged and does not retry', async () => {
    const fixture = await createFixture('verifier-failure');
    const result = await runPublicVerifier(fixture, 'verifier-failure', 1);
    const verifierLog = await readText(fixture.verifierLogPath);

    expect(result.code).toBe(1);
    expect(await readText(fixture.curlCountPath)).toBe('1');
    expect(await readText(fixture.verifierCountPath)).toBe('1');
    expect(verifierLog).toContain(`commit=${fixture.expectedCommit}`);
    expect(verifierLog).toContain(`hash=${fixture.expectedPackageHash}`);
    expect(verifierLog).toContain('archive-lock');
    expect(verifierLog).not.toContain('working-lock');
    expect(existsSync(fixture.sleepLogPath)).toBe(false);
  });
});
