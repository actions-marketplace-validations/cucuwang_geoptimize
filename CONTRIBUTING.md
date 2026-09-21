# Contributing

Contributions that make `geoptimize` more reproducible, explainable, or easier to adopt are welcome.

## Development setup

Use Node.js 22.12 or newer. Node 24 LTS is the recommended development version.

```bash
npm ci
npm run check
npm pack --dry-run
npm audit --audit-level=high
```

Do not commit `node_modules`, `dist`, package tarballs, credentials, or reports containing private URLs.

## First contributions

Start from an issue labeled `good first issue`. Comment on the issue before opening a pull request if the scope is unclear.

For scoring-rule work, follow [docs/methodology.md](docs/methodology.md): every rule change needs an evidence class plus positive, negative, and false-positive fixtures. Pull requests that claim ranking, citation, or AI-visibility outcomes will not be merged.

### Adding a scoring rule

Before changing scoring behavior, read [docs/methodology.md](docs/methodology.md) and choose the applicable documented A–D evidence class. Record a current primary source for evidence-backed behavior or an explicit heuristic rationale for a content heuristic, including the rule's scope and known false positives. Class D experiments are informational only and earn no readiness points; do not add zero-weight Class D experiments to the scored fixture corpus.

Create a stable rule ID in [`src/core/rules.ts`](src/core/rules.ts), implement the rule there, and register it in the exported `allRules` array. In [`fixtures/v0.6/rule-corpus.ts`](fixtures/v0.6/rule-corpus.ts), add cases under the matching ID: `positive`, `negative`, and `boundary` for the false-positive boundary. Give each case a purpose and expected `score`, `issues`, and `suggestions`; the [release-contract tests](src/core/__tests__/release-contract.test.ts) cover every scored rule and enforce these expectations through the parser boundary.

Record expected JSON/output changes, score-contract compatibility, and any migration impact in the pull request. Keep claims within the documented scope and do not present a rule or score as evidence of ranking, citation, indexing, or adoption outcomes.

## Pull requests

Keep each pull request focused. Include:

- the problem and user workflow;
- tests or fixtures that fail before the change and pass after it;
- JSON/output compatibility notes;
- documentation updates for user-visible behavior;
- the source and evidence class for any scoring-rule change.

Rule proposals must follow [docs/methodology.md](docs/methodology.md). Unsupported ranking, citation, adoption, or performance claims will not be accepted. Do not add fabricated statistics to examples or fixtures.

## Commit and review expectations

- Run `npm run check`, `npm pack --dry-run`, and `npm audit --audit-level=high`.
- Preserve deterministic output unless the pull request explicitly versions the methodology change.
- Treat generated JSON-LD and crawler policy as reviewable candidates, never universal defaults.
- Add a changelog entry for behavior, compatibility, security, or methodology changes.

Opening an issue before a large change is recommended so scope and compatibility can be agreed first.
