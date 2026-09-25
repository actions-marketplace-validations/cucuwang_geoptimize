# geoptimize 續辦交接

本輪以公開 main `8e9dc073ae7d994906556035952642544dff695f` 建立隔離本機分支 `codex/follow-through-20260913`。這份交接供維護者決定下一步遠端操作，驗證細節見 [驗證紀錄](follow-through-validation-2026-09-13.md)。

兩個 Node runtime 的完整候選驗證均通過 275 項測試，產出的 tarball SHA-256 相同；兩次 PTY 各 8 組情境也通過。

## 已完成的本機工作

- 整合三筆既有安裝說明與曝光紀錄提交，並移除 README 未佐證的 hosted pricing 數字。
- 完成 [互動式 CLI](interactive-cli.md)，從目標選擇到產生新的 HTML 報告；現有子指令、JSON 與非 TTY 用法保留。
- 更新 Puppeteer Core 25.10.0、Chalk 6.0.0、Commander 15.0.0 與 Vitest 5.0.0，保留 Node 24 型別。
- 更新四份技能的外部內容處理規則及 [投稿快照](distribution-follow-up-2026-09-13.md)。平台既有安全警示仍須在公開更新後重新讀回。
- 整理 Action 完整 SHA、相容入口與版本文件，修正發版後 npm 尚未可見時的重試及精確 release source 驗證流程。

## PR 處理建議

| 既有 PR | 本輪處理 | 遠端下一步 |
| --- | --- | --- |
| #21 | 一行價格文案修正已整合 | 候選合併後將原 PR 標為已由新變更涵蓋 |
| #23、#25、#26、#27 | 四項升級已組合驗證 | 候選 push 後核對整合 CI，再合併並收尾原 PR |
| #28 | 補齊 Action pins、相容入口及文件 | 先跑新版 workflow 的 GitHub CI，包含 Action 契約與 release artifacts |
| #24 | 暫緩型別 major 升級 | 保留 `@types/node` 24；加入 Node 26 驗證範圍時再評估 |
| #14 | 舊 v0.6.3 準備已過時且與現行線衝突 | 建議關閉，不將舊版本準備併入現行線 |

#14 的關閉說明草稿可用下列文字。

> Superseded by the published geoptimize releases and the current release workflow. Closing this older v0.6.3 preparation PR to keep the release queue current.

## 發布前的決策

本機仍使用 `0.10.0` 並將新功能標為 Unreleased。既有 npm `0.10.0` 保持不可變；下一版建議依新增功能採 `0.11.0`，版本更新與正式發版另作一批操作。

推送目標為 `cucuwang/geoptimize` 的本機同名工作分支。先開可審閱 PR 並讀回新 head SHA 的 CI；合併與發版再分開進行。本輪沒有向 GitHub 發送 review、推送、合併或關閉 PR。

第三方收錄等待清單沿用原申請。MCP Market 三份失敗項目與 AgenticSkills 原收據 404 均需先確認原件，再沿用已授權的目標續辦；新條款、權限或付費條件出現時另行確認。未建立排程或重複投稿。

## 回復

工作以分段本機 commit 保存。必要時只 revert 對應 commit，保留既有文件提交與原工作目錄；GitHub 的既有 main、tag、release 與第三方申請仍維持本輪操作前的狀態。
