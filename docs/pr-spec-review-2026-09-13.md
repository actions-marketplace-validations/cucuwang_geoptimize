# PR Spec and Compatibility Review

固定基準 `8e9dc073ae7d994906556035952642544dff695f`；逐一讀取 `git diff BASE...review/prN`、`git log BASE..review/prN --oneline`、PR title/body、`CONTRIBUTING.md` 與 CLI、JSON、Action、release tests。遠端 checks 綠燈只作輸入，不視為語意完整。

實際可重跑 proof 只有 PR23：worktree `/private/tmp/geoptimize-pr-spec-20260913`（`1a0671a`），證據目錄 `/private/tmp/geoptimize-pr-spec-evidence-20260913/`。`pr23-node24-check.log` 是 `node --version`＋`npm run check`；`pr23-node22-check.log` 是 Node 22.12.0 執行 Vitest 與 tsc，兩者各為 263 tests/build 通過。`pr24-typescript-5.4.5.log` 是 TypeScript 5.4.5 compiler probe，目標仍是該 PR23 worktree 的 `tsconfig.json`。PR24–27 沒有保存各自可重跑的 runtime logs，以下四項是靜態相容性判斷，最終以 root 的整合 worktree 驗證為準。

| PR | 建議 | Spec / compatibility 判定 |
| --- | --- | --- |
| #14 | 暫緩，僅留歷史 closure | merge-base `5d8b90a`；`review/pr14` 是舊 `aeoptimize` v0.6.3 lineage 的 16 檔 release/docs patch，舊 branch 本來就是舊產品線，不能描述成把現行 package 改回舊名稱。固定基準已是 `geoptimize` v0.10.0；body 稱未改 Action inputs，diff 卻改 `package-spec` default，規格連續性不足。 |
| #21 | 可整合 | `README.md:174` 移除無來源的 `Typically $95+/mo`，改為 `Varies by vendor`；符合 hosted pricing 限定，沒有 runtime、scoring 或 JSON 變更。 |
| #23 | Chrome smoke 後整合 | lock 將 `puppeteer-core` 25.7.0→25.10.0。PR23 的 Node 22.12.0/24 tests 與 build 已保存並通過；實際 Chrome launch 先前在受管環境 `Code:null`、stderr 空，不能作成功證據。root 應以 `/private/tmp/geoptimize-pr-spec-evidence-20260913/browser-smoke.mjs` 做 scoped escalation，確認 scanner 的 fallback 路徑。 |
| #24 | 暫緩 | `@types/node` 26.5.0 且 `typeScriptVersion` 5.6，超前於 `engines.node >=22.12.0` 及 Node 22/24 runtime contract。現有型別可編譯不代表未來不會誤用 Node 26 API；改用 Node 24 types，或明載超前型別政策後再併。 |
| #25 | 可整合，須由 root 整合測試收口 | Chalk 6 官方最低 Node 22；現有 CLI 已是 ESM default import，靜態使用方式相容。 |
| #26 | 可整合，須由 root 整合測試收口 | Commander 15 官方 ESM-only、要求 Node >=22.12；專案 `type: module` 且 `src/cli/index.ts:3` 直接 ESM import，未用 CommonJS 或已移除的 `commander/esm.mjs`。 |
| #27 | 可整合，須由 root 整合測試收口 | Vitest 5 要求 Node >=22.12、Vite >=6.4；lock 的 Vite 8.2.2 符合，現有測試只用仍支援的 describe/it/expect/vi APIs。 |
| #28 | 暫緩，先修 metadata/compat pin | merge-base 是 `80ef694`，不是 fixed base。新 pins 對應官方 tags，YAML parse、diff check、既有 inputs 靜態保留；但 `action/action.yml:37` 仍 pin setup-node v4.4.0（Node20），root `action.yml:38` 已是 v7（Node24），CodeQL/Scorecard 留 `# v3` comments，`docs/action-pins.md:8-15` 仍列舊 SHAs。補齊 compatibility action、comments、pin inventory，並在 Node24 runner（>=2.327.1）跑 hosted action-contract/release artifact gate。 |

必要整合測試：root candidate worktree 以專用 cache 執行 Node 22.12.0 與 Node 24 的 `npm run check`、CLI `--version`/JSON scan；#23 執行上述 Chrome smoke；#28 執行兩條 Action 路徑、artifact/attestation/release contract 與 hosted workflow。PR23 外的 263 tests/build 不可移植成各 PR 已驗證。

官方一手版本資料：[Node 22.12.0](https://nodejs.org/en/blog/release/v22.12.0)、[Puppeteer Core 25.10.0](https://github.com/puppeteer/puppeteer/releases/tag/puppeteer-core-v25.10.0)、[Chalk 6.0.0](https://github.com/chalk/chalk/releases/tag/v6.0.0)、[Commander 15.0.0](https://github.com/tj/commander.js/releases/tag/v15.0.0)、[Vitest 5.0.0](https://github.com/vitest-dev/vitest/releases/tag/v5.0.0)、[@types/node 26.5.0](https://www.npmjs.com/package/%40types/node/v/26.5.0)、[setup-node 7.0.0](https://github.com/actions/setup-node/releases/tag/v7.0.0)、[checkout 7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1)、[upload-artifact 7.0.1](https://github.com/actions/upload-artifact/releases/tag/v7.0.1)、[download-artifact 8.0.1](https://github.com/actions/download-artifact/releases/tag/v8.0.1)、[CodeQL Action 4.37.9](https://github.com/github/codeql-action/releases/tag/v4.37.9)、[attest-build-provenance 4.2.2](https://github.com/actions/attest-build-provenance/releases/tag/v4.2.2)、[Scorecard Action 2.4.4](https://github.com/ossf/scorecard-action/releases/tag/v2.4.4)。
