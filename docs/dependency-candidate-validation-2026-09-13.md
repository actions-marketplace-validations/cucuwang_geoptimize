# Dependency Candidate Validation 2026-09-13

## Candidate and scope

The candidate is an isolated clone at
`/private/tmp/geoptimize-dependency-candidate-20260913`, created from the follow-through
worktree and fixed at `652b0344ba64409490151f148eed81606f60133c`. The source worktree,
its package files, and its `node_modules` were not modified. No commit, push, merge,
release, or external publication was performed.

This candidate combines the exact target versions from #23, #25, #26, and #27 while
leaving the package version at `0.10.0` and preserving all other package metadata:

| Package | package.json spec | lockfile resolution |
| --- | --- | --- |
| `puppeteer-core` | `^25.10.0` | 25.10.0 |
| `chalk` | `^6.0.0` | 6.0.0 |
| `commander` | `^15.0.0` | 15.0.0 |
| `vitest` | `^5.0.0` | 5.0.0 |
| `@types/node` | `^24.0.0` | 24.13.3, unchanged baseline |
| `undici-types` | transitive | 7.18.2, unchanged baseline |

The direct package specs were edited in the candidate, then the lock was regenerated
with npm 11.19.0 using `--package-lock-only --ignore-scripts` and the dedicated cache
`/private/tmp/geoptimize-follow-through-npm-cache`. The regenerated lock resolves the
four requested targets and preserves integrity values. Current registry ranges also
refreshed 45 lock package paths, including Vitest/Vite, Rolldown, and related transitive
entries. This is disclosed scope from lock regeneration; no source or test was changed.

Candidate file SHA-256 values:

| File | SHA-256 |
| --- | --- |
| `package.json` | `5213c547637ad0f093225d0c4191745c29b762827a3b5103ad6a7baffac05f06` |
| `package-lock.json` | `d6f68d41756d6e1b74dd0772f02992a1937f3179316f60a45dc3bfa5120c35b1` |

`npm ls --depth=0 --omit=optional` read back the four target versions, baseline
`@types/node@24.13.3`, and package `geoptimize@0.10.0`. Both CLI runtime checks returned
`0.10.0`.

## Verification results

| Runtime | npm | `npm ci` | `npm run check` | Action contract | Audit | Pack preview |
| --- | --- | --- | --- | --- | --- | --- |
| Node 24.11.1 | 11.19.0 | PASS, 103 packages | PASS, 19 files and 263 tests plus `tsc` | PASS | PASS, 0 vulnerabilities | PASS |
| Node 22.12.0 | 10.9.0 | PASS, 103 packages | PASS, 19 files and 263 tests plus `tsc` | PASS | PASS, 0 vulnerabilities | PASS |

The Node 22.12.0 Darwin arm64 runtime came from the official Node distribution. Its
tarball SHA-256 `293dcc6c2408da21562d135b0412525e381bb6fe150d688edb58fe850d0f3e13`
matched the official `SHASUMS256.txt`. The Node 24.11.1 runtime was already available
locally and was read back directly.

Both pack previews produced the same metadata:

- `geoptimize-0.10.0.tgz`
- packed size 1,169,636 bytes
- unpacked size 1,829,039 bytes
- preview shasum `634c2d4f68a3d0f3b84028d2130f92e439799518`
- preview integrity `sha512-fK7Zb6J2o50wuzP4kMVXeXdE9Ns/Kf6M1dCG/8w7qA8PXvCS/LG4BNACoI9AC1ICul55iSO9m9bmNrzS0hexOw==`

The preview was run with `--dry-run`; no release tarball was created. The main agent subsequently verified Puppeteer 25.10.0 against Chrome 153.0.8010.36 on Node 24.11.1 and Node 22.12.0 using an isolated temporary browser profile and an offline JavaScript fixture. Both returned `rendered:5`. This exercises browser launch, navigation, DOM execution and close; it does not prove behavior against arbitrary public SPA sites. The script is `/private/tmp/geoptimize-pr-spec-evidence-20260913/browser-smoke.mjs`.

## Commands

```text
cd /private/tmp/geoptimize-dependency-candidate-20260913
npm install --package-lock-only --ignore-scripts --no-audit --no-fund --cache /private/tmp/geoptimize-follow-through-npm-cache
npm ci --ignore-scripts --no-audit --no-fund --cache /private/tmp/geoptimize-follow-through-npm-cache
npm run check
bash action/test-contract.sh
npm audit --audit-level=high --cache /private/tmp/geoptimize-follow-through-npm-cache
npm pack --dry-run --ignore-scripts --cache /private/tmp/geoptimize-follow-through-npm-cache --json
PATH=/private/tmp/geoptimize-node22.12.0/node-v22.12.0-darwin-arm64/bin:$PATH npm ci --ignore-scripts --no-audit --no-fund --cache /private/tmp/geoptimize-follow-through-npm-cache
PATH=/private/tmp/geoptimize-node22.12.0/node-v22.12.0-darwin-arm64/bin:$PATH npm run check
PATH=/private/tmp/geoptimize-node22.12.0/node-v22.12.0-darwin-arm64/bin:$PATH bash action/test-contract.sh
PATH=/private/tmp/geoptimize-node22.12.0/node-v22.12.0-darwin-arm64/bin:$PATH npm audit --audit-level=high --cache /private/tmp/geoptimize-follow-through-npm-cache
PATH=/private/tmp/geoptimize-node22.12.0/node-v22.12.0-darwin-arm64/bin:$PATH npm pack --dry-run --ignore-scripts --cache /private/tmp/geoptimize-follow-through-npm-cache --json
```
