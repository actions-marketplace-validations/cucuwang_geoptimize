# PR Standards Review 2026-09-13

## Scope and evidence

Review target is fixed base `8e9dc073ae7d994906556035952642544dff695f` and the fresh
`review/pr14`, `review/pr21`, `review/pr23`, `review/pr24`, `review/pr25`,
`review/pr26`, `review/pr27`, and `review/pr28` refs. Normative sources are
`CONTRIBUTING.md`, `.github/pull_request_template.md`, `docs/action-pins.md`,
`docs/action-reproducibility.md`, and the v0.10 release contract in
`docs/release-v0.10.md`. Tool-detectable style findings are excluded. Fowler smells
were used only as a heuristic; no smell is reported without a concrete contract or
maintenance consequence.

This worker did not modify any worktree file except this report; unrelated parallel
worker changes were preserved. No tests, package install, GitHub approval, or external
mutation was performed by this read-only review. The non-CodeQL updated Action SHAs in
#28 matched their official upstream release tag refs. The CodeQL `cdf488f...` object
is a verified commit in the v4 line, and its action metadata uses the Node 24 action
runtime, consistent with [GitHub's CodeQL v4 runtime note](https://github.blog/changelog/2025-10-28-upcoming-deprecation-of-codeql-action-v3/).

## Decision matrix

| PR | Head SHA | Merge base with fixed base | Standards result | Next step |
| --- | --- | --- | --- | --- |
| #14 | `72a3bdcbd1a192bdd695a8cc18b3bf440d8b0d30` | `5d8b90a67b4527c4d9baaf30b65d579663e7460e` | **HOLD. Hard findings below.** | Supersede or rebase from fixed base; retain v0.10 identity and security/release contract, then rerun every release gate. |
| #21 | `ffbd108603b797bbe4de179ae18d7313c0a9296e` | `d381c552e844c82b0ad0921f60e6c3f30a25d60c` | **0 hard findings.** | Rebase onto fixed base and rerun the focused README evidence check. |
| #23 | `1a0671ae3312b28b50e975aa82212aa49a34f39a` | fixed base | **0 hard findings.** | Run Node 22/24 `npm run check`, pack preview, high/critical audit, and the browser dependent checks before integration. |
| #24 | `10f688ca3fef1640a9f543630c53c70d082f802c` | fixed base | **0 hard findings.** | Run the same checks; the type-only major update still needs TypeScript/build readback. |
| #25 | `47016861df1d34067b3eaebae277ffda59e6d31b` | fixed base | **0 hard findings.** | Run CLI output and Node 22/24 checks for the Chalk major update. |
| #26 | `d42ca35e4eaf7b8c8d5e82f7a34a37d8927b683a` | fixed base | **0 hard findings.** | Run CLI, JSON, Action contract, and Node 22/24 checks for Commander 15. |
| #27 | `e81a3cf9b727653d5cbcfcf61452636156ba22c9` | fixed base | **0 hard findings.** | Run the full test/build matrix for Vitest 5; combine overlapping lockfile updates in one regenerated lock. |
| #28 | `d1d1354d9e57c2d65f3579369fac3c87ea1418b8` | `80ef694b3d30ca1728f0b054ca5a47133e52ce22` | **HOLD. Hard pin metadata gap below.** | Rebase from fixed base, correct pin metadata, optionally pin the existing sample gap, then run all required CI and release-contract checks. |

The five npm dependency PRs retain registry `resolved` URLs and integrity values. Their
engine boundaries fit the declared Node support: Puppeteer 25.10 and Commander 15
require Node 22.12 or newer, Chalk 6 requires Node 22 or newer, Vitest 5 accepts the
Node 22.12 and 24 lines, and the Node 26 type package is development-only. No
contract, supply-chain, or Fowler-smell blocker is established for #23–#27 from the
static diffs alone. They share the same base and overlap in `package-lock.json`, so
integration must regenerate and test one combined lock state.

## Findings

### #14: stale release tree and security regression

**Hard rule.** The branch is based on `5d8b90a...`, predates the fixed v0.10 base, and
its three-dot patch prepares the old package identity and release surface.
`review/pr14:package.json:2-3` declares `aeoptimize` `0.6.3`, with the old repository
identity at lines 57–60, while the fixed release contract is `geoptimize` 0.10.0. Its
root Action also points at `aeoptimize@0.6.3` in `review/pr14:action.yml:1,24`.
`git merge-tree BASE review/pr14` reports content conflicts in all 16 files touched by
the three-dot patch, including package metadata, Action metadata, CI, README,
changelog, release guide, sample, and release tests. The v0.6.3 preparation is also
superseded by the published v0.10 contract at `BASE:docs/release-v0.10.md:3-25` and
its recovery rules at lines 114–124. Hold until the patch is recreated or rebased on
the fixed base; the divergent two-dot tree is used only as merge-risk evidence, not as
a claim that a normal PR merge would delete the intervening files.

**Hard rule.** The branch's CI uses mutable third-party refs and has no least-privilege
workflow permission declaration, for example `review/pr14:.github/workflows/ci.yml:17-18,25,35`;
the Action uses `actions/setup-node@v4` at `review/pr14:action.yml:38`. This conflicts
with `BASE:docs/action-pins.md:17-27` and would reintroduce the supply-chain boundary
that v0.10 documents.

### #21: copy and evidence standard

**Hard findings: 0. Judgment.** `review/pr21:README.md:174` removes the uncited
`$95+/mo` statistic and says `Varies by vendor`. That follows
`CONTRIBUTING.md:34`'s prohibition on fabricated statistics and does not alter score,
CLI, JSON, or Action behavior. The head is still based on v0.9 (`d381c55...`), so
rebase before merging and rerun the focused README test. No Fowler smell is present.

### #28: Action pin documentation and sample drift

**Hard rule.** The changed CodeQL pins at
`review/pr28:.github/workflows/codeql.yml:26,30` point to the v4.37.9 lineage, while
the inline comments still say `v3 (2026-09-09)`. `review/pr28:docs/action-pins.md:8-15`
also records every pre-update SHA and still calls CodeQL v3. The formal pin procedure
requires the table, upstream release, and workflow refs to agree
(`docs/action-pins.md:17-20`). Update the table, major/version comments, and date
after a fresh official tag/release-note readback.

**Existing gap, optional consistency follow-up.** The shipped copyable sample still
executes mutable `actions/checkout@v4` at
`review/pr28:examples/github-action-sample/.github/workflows/geoptimize.yml:14`.
This line is unchanged from the fixed base and is not introduced by #28. If the
supply-chain scope includes shipped samples, pin it in a separate focused change and
keep the sample documentation aligned; it is not a #28 hard finding here.

**Permissions and runtime judgment.** #28 preserves the documented boundaries:
ordinary CI has `contents: read` at `review/pr28:.github/workflows/ci.yml:10-11`,
CodeQL adds `security-events: write` at
`review/pr28:.github/workflows/codeql.yml:15-17`, Scorecard keeps
`security-events: write` and `id-token: write` at
`review/pr28:.github/workflows/scorecard.yml:12-15`, and only the gated release job
keeps `contents: write`, `id-token: write`, and `attestations: write` at
`review/pr28:.github/workflows/release.yml:40-43`. No `pull_request_target` or
write-token job was introduced. The nested compatibility metadata retains a valid
older full SHA at `review/pr28:action/action.yml:37`; synchronize it with the root
Action only if both paths are intended to move together. Add a changelog note if the
maintainer classifies this major Action/runtime update as a security or compatibility
change, per `CONTRIBUTING.md:41`.

## Exact review commands

```text
git log 8e9dc073ae7d994906556035952642544dff695f..review/pr14 --oneline
git diff 8e9dc073ae7d994906556035952642544dff695f...review/pr14
git log 8e9dc073ae7d994906556035952642544dff695f..review/pr21 --oneline
git diff 8e9dc073ae7d994906556035952642544dff695f...review/pr21
git log 8e9dc073ae7d994906556035952642544dff695f..review/pr23 --oneline
git diff 8e9dc073ae7d994906556035952642544dff695f...review/pr23
git log 8e9dc073ae7d994906556035952642544dff695f..review/pr24 --oneline
git diff 8e9dc073ae7d994906556035952642544dff695f...review/pr24
git log 8e9dc073ae7d994906556035952642544dff695f..review/pr25 --oneline
git diff 8e9dc073ae7d994906556035952642544dff695f...review/pr25
git log 8e9dc073ae7d994906556035952642544dff695f..review/pr26 --oneline
git diff 8e9dc073ae7d994906556035952642544dff695f...review/pr26
git log 8e9dc073ae7d994906556035952642544dff695f..review/pr27 --oneline
git diff 8e9dc073ae7d994906556035952642544dff695f...review/pr27
git log 8e9dc073ae7d994906556035952642544dff695f..review/pr28 --oneline
git diff 8e9dc073ae7d994906556035952642544dff695f...review/pr28
```
