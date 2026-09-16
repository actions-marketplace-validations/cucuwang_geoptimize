# geoptimize 預覽影片來源備註

資料來源固定為 GitHub `main` 在 2026-09-16 讀取到的 commit `8872148f444a51177af75cb03ee861b8326f1787`。提交 API 與每個固定 commit 的 raw 連結都列在 `source-data.json`。

兩份 HTML 報表與 `scripts/prepare-metrics-demo.mjs` 都明示這是合成示範。腳本只模擬 `https://demo.example` 的三個頁面：`/`、`/guide`、`/contact`，攔截 fetch，沒有對外網路請求或外部量測。site audit 的範圍是 response HTML、三個已爬頁面、上限 20，佇列完成。畫面應標示「合成三頁示範」。

可安全上鏡的文案：

- 「檢查五個內容就緒面向：結構、可引用性、結構化資料、AI Metadata、內容密度。」
- 「合成三頁示範的內容就緒分數：53 分到 97 分。」
- 「這次合成掃描顯示的 canonical 遺漏：3 到 0；重複 title 群組：1 到 0。」
- 「掃描可輸出 JSON，README 將 `--json` 列為穩定自動化介面。」
- 「可在本機、CI 或 pre-commit 使用。」

示範中可具體點出的掃描發現：首頁少 H1、部分頁面沒有 headings 或 meta description、contact 頁有 `noindex`、三個頁面缺 canonical 且共用 `Demo` title。修正版報表的 scoring findings 為 0。

README 將分數定義為同一專案內捕捉回歸的版本化 heuristic。它不預測搜尋排名、索引、rich results、流量、轉換或任何 AI 系統的引用。影片避免宣稱排名提升、被 AI 引用或實際網站成效。`audit-site` 也只覆蓋受限爬取，不能代表整個已索引網站。

README 已確認的功能：`scan`、單頁 `audit`、受限 `audit-site`、離線 HTML `report`、`metrics` 比較、`audit-build`；常用穩定自動化命令為 `npx geoptimize scan ./dist --dir --json`。README 要求 Node.js 22.12 以上。
