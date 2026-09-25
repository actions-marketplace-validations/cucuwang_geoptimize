# 續辦驗證紀錄

查核日期為 2026-09-13。公開發版與本機候選分開記錄。

## 來源與驗證範圍

公開 main 為 `8e9dc073ae7d994906556035952642544dff695f`。三筆既有文件提交整合後，基準在 Node 24.11.1 與 Node 22.12.0 各通過 263 項測試和 TypeScript build。

新程式及 Action 修正完成於 `756bd41`，完整候選驗證使用乾淨的 `249c517`。後續交接與本驗證紀錄的更新不改動封裝內容。所有以下結果均由實際命令讀回。

## 完整候選驗證

| 環境 | 結果 |
| --- | --- |
| Node 24.11.1、npm 11.19.0、Vitest 5.0.0 | `npm run release:check` 通過，21 個測試檔、275 項測試、TypeScript build、Action 契約與依賴稽核全部通過 |
| Node 22.12.0、npm 10.9.0、Vitest 5.0.0 | 同一套 `npm run release:check` 全部通過，同樣為 21 個測試檔、275 項測試 |

兩次 gate 都建立實際 tarball，再將同一份 tarball 安裝到乾淨 consumer，檢查三個 CLI 名稱、audit、JSON、SEO ledger 與 HTML report。依賴稽核為 0 個漏洞。

兩個 runtime 的 manifest 逐欄相同，且重新計算兩份檔案的 SHA-256 也相同。

| 候選欄位 | 讀回 |
| --- | --- |
| package version | `0.10.0`，本機 Unreleased 候選 |
| tarball | `geoptimize-0.10.0.tgz` |
| files | 109 |
| unpacked bytes | 1,866,588 |
| SHA-256 | `d5dd7ad8e515e406ef72a085ec8c984e34fdb0169b103998a4e0f0a763e78e7b` |

候選仍保留現行 package version 以便本輪整合，沒有發布或覆寫既有 npm 0.10.0。發版前須另作新版本準備。

## CLI、瀏覽器與文件

- Node 24.11.1 與 Node 22.12.0 各通過 8 組實際 PTY 驗證，包括本機檔案與目錄報告、返回、EOF、提示時 Ctrl-C、既有檔案保護、受控延遲掃描中的 Ctrl-C，以及非 TTY help／version／JSON。兩次受控中斷均由 SIGINT 結束，沒有寫出報告。
- Puppeteer Core 25.10.0 在兩個 Node runtime 都成功啟動 Chrome 153.0.8010.36，使用獨立暫時 profile 導向離線 HTML、執行 JavaScript 並讀回 `rendered:5`。這項測試涵蓋瀏覽器 API，不擴大為任意公開 SPA 網站的驗收。
- 8 份 YAML 可解析，25 個第三方 Action 使用完整 commit SHA；更新的 pin 已逐一對到官方 release tag。現有 Action 契約通過。`actionlint` 未安裝，未列為通過。
- 四份技能通過 `skill-creator/scripts/quick_validate.py`。變更後 Markdown 的 146 個本機相對連結均存在，`git diff --check` 通過。

## 發版恢復工具

新增五個子程序測試驗證實際退出碼與副作用。涵蓋 404 後恢復、重試耗盡、latest 不符、HTTP 401，以及下游 artifact verifier 失敗；並確認使用 release archive 的 lock 而非後續工作副本的 lock。真實 hash／identity／tag 驗證失敗不重試。

新入口也以原始 release commit `01ac0f19e2a7f8f8854b3304ecd0193a6a9d2b63` 與公開 tarball SHA-256 `dbe2d0702020875a1cbef60a52c82cf3415c5f75ee2b44ff88dacb021e023d7c` 實際執行。npm 版本與 repository、tarball hash、三個 CLI 名稱、tag 與 GitHub Release 全部通過。詳見 [復原紀錄](release-verification-recovery-2026-09-13.md)。

## 證據檔與尚待遠端驗證

本輪獨立驗證工具、兩個 release-check logs、manifest 與候選 tarball 保留於 `/private/tmp/geoptimize-follow-through-qa`。Chrome 測試腳本位於 `/private/tmp/geoptimize-pr-spec-evidence-20260913/browser-smoke.mjs`。資料均來自公開 fixture 或本專案的本機候選。

新候選未經 push 或 GitHub hosted CI。第三方技能平台的重新稽核、投稿核准、PR 合併及新版本發布仍以各自遠端結果為準。本輪沒有執行這些外部操作。
