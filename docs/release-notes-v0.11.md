# geoptimize 0.11.0

## Guided interactive CLI

- Run `geoptimize`, `geo`, or `geo-cli` without arguments in a TTY to open a guided flow for scanning a website URL, local HTML or Markdown file, or local directory.
- The flow runs a detailed scan and writes the same self-contained offline HTML report used by `geoptimize report`.
- Existing output files are preserved. Cancel, EOF, Ctrl-C at a prompt, scan errors, and empty scans do not create a report.
- Explicit commands, JSON output, `--help`, `--version`, and non-TTY invocation keep their existing behavior.

## Compatibility and maintenance

- Supports Node.js 22.12 and newer, with Node 24 type definitions retained.
- Updates Puppeteer Core, Chalk, Commander, and Vitest within the supported runtime range.
- Adds bounded retry for temporary npm visibility delays and verifies packages against their exact release source.
- Keeps the deterministic readiness score, existing audit JSON contracts, and composite Action scoring contracts unchanged.
- Clarifies how bundled skills handle untrusted page content, repositories, and scan reports within the approved task scope.

## Install

```bash
npm install --save-dev geoptimize@0.11.0
npx geoptimize
```

To use the Action in a workflow:

```yaml
- uses: cucuwang/geoptimize@v0.11.0
  with:
    path: dist
```
