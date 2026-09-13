# geoptimize 曝光續辦紀錄

查核日期為 2026-09-11。維護者要求繼續推進可行投稿，將未成功與尚缺條件的項目留在專案，日後有更新再續辦。本文是工作紀錄，送件成功、審核通過與公開上架分開記錄。

前十個技能目錄的安裝驗證與收件證據見 [第一批紀錄](skill-directory-submissions-2026-09-11.md)。重用文案見 [submission copy](skill-directory-submission-copy.json)。

> 最新讀回（2026-09-13 20:03 Asia/Taipei）已移至 [2026-09-13 續辦快照](distribution-follow-up-2026-09-13.md)。本檔保留 9/11 的收件與歷史狀態，更新判斷以該快照為準。

## 已送件與更新

| 管道 | 操作與證據 | 當前結果與續辦條件 |
| --- | --- | --- |
| SerpApi Awesome SEO Tools | 依 [投稿規則](https://github.com/serpapi/awesome-seo-tools#contributing)，先查 README 與兩個產品名稱的既有 issue，確認沒有重複後新增 [issue #353](https://github.com/serpapi/awesome-seo-tools/issues/353)。建議放在 Technical SEO，內文提供可直接採用的一行介紹與 MIT、Node.js、CI 使用範圍。 | GitHub 讀回為 open，作者 cucuwang。已送件，等待維護者審核；尚未加入清單。 |
| DevHunt 舊申請 | 更新 [issue #240](https://github.com/MarsX-dev/devhunt/issues/240) 的標題與內文，將 aeoptimize 0.6.2 改為 geoptimize 0.10.0，同步 repo、npm、CLI、Action、四份 skills 與目前截圖連結。保留同一張申請及其編輯歷史。 | GitHub 讀回為 open，更新時間 `2026-09-11T10:32:01Z`，內文逐字吻合送出的版本。已更新舊件；未建立重複申請，尚無公開 tool listing 證據。 |
| Context7 | 維護者接受服務條款與附加條款並授權 GitHub 基本登入後，提交 `https://github.com/cucuwang/geoptimize` 一次。[處理佇列](https://context7.com/tasklist) 出現 `/cucuwang/geoptimize`、`Parse` 與 `Submitted by you`。 | 已完成建立，[文件頁](https://context7.com/cucuwang/geoptimize) 可開啟，顯示 337 snippets 與 MIT；已讀取技能安裝、scan、audit-site 等文件片段。首次排隊時的 404 已解除。原始索引也包含部分歷史發版與展示文件，範圍調整另行確認。 |
| Console.dev | 依 [官方工具投稿入口](https://console.dev/selection-criteria) 準備郵件草稿，讀回收件人、主旨、回覆地址與全文一致，再經維護者明確核准寄至 `hello@console.dev`。 | Gmail 讀回為 `SENT`，已寄出。主旨為 `Tool submission: geoptimize, content-readiness checks for CI`。尚無編輯回覆或刊登證據。 |
| Screpy Awesome SEO Tools | 建立 [PR #4](https://github.com/screpylabs/awesome-seo-tools/pull/4)，只改 README，在 technical audits、on-page content 與 validators 三個相關表格加入 geoptimize，核對免費 MIT 與官方連結。 | PR 為 open、non-draft、可合併，尚未合併。已核對遠端 diff 僅一檔，7 行新增、4 行刪除，包含三筆條目與受影響計數。 |
| Awesome CLI Apps in a CSV | 依 [投稿規則](https://github.com/toolleeo/awesome-cli-apps-in-a-csv/blob/master/CONTRIBUTING.md) 先去重，再以 name、homepage、git URL 與 description 建立 [issue #415](https://github.com/toolleeo/awesome-cli-apps-in-a-csv/issues/415)，建議分類為 webdev。 | GitHub 讀回為 open、作者 cucuwang。已送件，等待維護者審核，尚未加入 CSV 或生成的清單。 |
| 既有 GitHub Discussion | 更新 [Discussion #12](https://github.com/cucuwang/geoptimize/discussions/12) 的產品名稱、安裝指令、Action `v0.10.0` 與 methodology 連結。明示下方數值來自舊版測試，保留 2026-08-26 的 Dogfood 段落。 | 已保存並讀回。歷史段落在編輯前後逐字一致，81/100、83/100、96/100 仍標為 aeoptimize 0.6.2 的結果；沒有產生第二篇重複討論。 |

第三方 repo 的 issue 寫入曾收到 GitHub integration 403，隨後透過既有 GitHub 網頁登入完成相同、已授權的操作。清單 fork 的 branch、README commit 與 PR 可由 connector 完成。未修改 connector 權限；最終結果以上表的遠端讀回為準。

## 已存在的公開入口

| 管道 | 本輪讀回 | 後續處理 |
| --- | --- | --- |
| npm、npm 搜尋與 package page | [registry latest](https://registry.npmjs.org/geoptimize/latest) 為 geoptimize `0.10.0`，repository 指向 cucuwang/geoptimize。 | 沿用現有 [套件頁](https://www.npmjs.com/package/geoptimize)。npm 網頁讀取曾回 403，版本以 registry metadata 核對。搜尋排序未驗證。 |
| GitHub Marketplace、Action 搜尋 | [geoptimize Content Readiness Check](https://github.com/marketplace/actions/geoptimize-content-readiness-check) 公開頁可讀取。 | 沿用現有 Action 條目；未建立第二個條目，搜尋排名未驗證。 |
| GitHub Release feed | [v0.10.0](https://github.com/cucuwang/geoptimize/releases/tag/v0.10.0) 已公開，發佈時間 `2026-09-11T05:46:11Z`。 | 沿用 release feed；本輪沒有發版。 |
| GitHub Topics / Explore | [公開 repo](https://github.com/cucuwang/geoptimize) 已有 `claude-code-skill`、`seo`、`content-linter`、`github-actions` 等相關 topics。 | 已具備自動技能目錄所需的 topic；Explore 是否推薦本專案為 Unverified。 |

最新讀回的公開 `main` 為 `8e9dc073ae7d994906556035952642544dff695f`，對應 code-scanning remediation PR #32；npm latest 仍為 `0.10.0`。先前查核點為 `e4580129e746110cdacf3b4644757c9575c56a93`。本次投稿以已公開的 0.10.0 功能為準，geoptimize 的文件分支仍只在本機；第三方清單投稿使用獨立 fork 與 PR，未修改 geoptimize 正式程式碼或另發版本。

## 尚未完成的入口與具體阻礙

| 管道與官方入口 | 已確認的條件或阻礙 | 續辦動作 |
| --- | --- | --- |
| [Claude Community Plugin Marketplace](https://platform.claude.com/plugins/submit) | 公開 repo 已有 `.claude-plugin/plugin.json` 與 `marketplace.json`，根目錄是一個包含四份 skills 的 geoptimize plugin。兩份 manifest 均通過 `claude plugin validate`。官方 community catalog 未找到本產品；Console 表單目前停在登入頁，繼續會同意 Anthropic Commercial Terms。 | 使用已登入、獲授權的 Console 帳號，提交 root repo 一次。[官方流程](https://code.claude.com/docs/en/plugins#submit-your-plugin-to-the-community-marketplace) 區分個人 Console 與 Team / Enterprise 組織表單。通過後再讀回 catalog；本輪未送件。 |
| [ClawHub.ai](https://clawhub.ai/) | 必須登入並分別發布四份 skills。官方 [skill format](https://docs.openclaw.ai/clawhub/skill-format) 規定公開 skill 使用 MIT-0，與目前 repo 的 MIT 不同。官方精確 slug 搜尋未找到四個技能及兩個產品名稱，其他 slug 的轉載為 Unverified。 | 維護者先決定是否接受這四份 skill 的 MIT-0 發布條件，再處理登入與逐份發布。此輪沒有重授權或發布。 |
| [SkillsLLM](https://skillsllm.com/submit) | 標準表單與 [About](https://skillsllm.com/about) 都要求至少 100 GitHub stars，另需 public repo、有效 skill / topic 與 OSS license。當前專案為 37 stars；相同產品 slug 顯示 Skill Not Found。 | 真實使用成長到符合門檻，或平台更新收錄規則時，再確認自動索引；仍未出現才送出 root repo 一次。此輪未送件。 |
| [Uneed](https://www.uneed.best/submit-a-tool) | 官方 [llms.txt](https://www.uneed.best/llms.txt) 明示新產品免費隊列已關閉；現行 [方案](https://www.uneed.best/pricing) 為付費快速排程。未找到 geoptimize / aeoptimize 的公開條目。 | 免費隊列重新開放時續辦，或由維護者另外決定付費預算。此輪未送件、未付款。 |
| [AlternativeTo](https://alternativeto.net/faq/) | 必須帳號與已驗證 email。一般 backlog 可免費送件。舊草案僅投稿帳號可見，本輪未登入，草案狀態為 Unverified；公開搜尋未找到產品不能證明不存在。 | 在原帳號讀取待審投稿及舊草案，先更新已存在的內容，再判斷是否需要送件。此輪未新建申請。 |
| [SaaSHub](https://www.saashub.com/services/submit) | 維護者已接受服務條款並授權免費收錄。輸入 root repo URL、按 Continue 後，平台回覆 `No more submissions from github.com are allowed.`，沒有建立投稿。 | 等平台重新接受 GitHub 網域，或正式產品網站完成後再依正常流程提交。此輪已實際嘗試但遭平台拒收；未使用其他網址繞過限制、未付款。 |
| [OpenAlternative](https://openalternative.co/submit) | [官方規則](https://github.com/piotrkulpinski/open-source-alternatives/blob/main/CONTRIBUTING.md) 指定網站表單。需要登入，目錄主題是開源工具取代專有軟體。目前尚未建立 geoptimize 可支持的具體替代對象。 | 先確認功能範圍相符的專有產品與差異，再登入送審。不要將 readiness lint 填成排名監控的完整替代品。本輪未送件。 |
| [DevHunt 現行 launch form](https://devhunt.org/account/tools/new) | [官方表單原始碼](https://github.com/MarsX-dev/devhunt/blob/main/app/account/tools/new/page.tsx) 需要帳號、logo、名稱、slogan、網址、介紹、pricing、launch week 及至少一張 screenshot。滿額週會要求付費。 | #240 已更新，先等待回應；日後改走網站 launch form 時，讀回可用免費檔期並提及既有申請。未登入網站、未安排付費檔期。 |
| [Product Hunt](https://www.producthunt.com/posts/new) | 投稿入口導向登入頁，需建立正式 launch 素材與產品發布日期。 | 完成作者帳號、thumbnail、可執行 demo、gallery 與作者親自陳述的 maker comment，再安排發布。此輪未登入或發文。 |
| [Peerlist Launchpad](https://peerlist.io/launchpad) | 公開頁提供 Launch，顯示每週名額有限；本輪沒有建立作者 profile 或 launch。 | 取得可用帳號後確認 project 與 launch 欄位，先建立真實產品展示，再決定日期。未送件，完整表單要求仍為 Unverified。 |
| [BetaList](https://betalist.com/submit) | 投稿入口導向登入頁。產品與該站早期新創定位的適配性尚未確認。 | 先確認接受 OSS CLI 類型及當期免費方案，再處理帳號與投稿。此輪未送件。 |
| [skillsdir.dev](https://skillsdir.dev/add) | 額外查到的 skill 目錄要求透過 GitHub issue template 投稿，但其按鈕指向的 `brunogalvao/claude-skills-directory` repo 與 template URL 均回 404。 | 官方修復投稿連結後續辦。沒有向其他 repo 代投。 |

## Context7 索引範圍查核

已確認可透過該條目的 Admin 設定管理索引，不需修改 GitHub repo 或建立新的 ownership key。公開結果混入 `docs/release-v*.md` 的發版維運指令、`docs/superpowers` 舊規格、展示資料及測試 fixture。

準備的精簡方案為納入 `docs` 與 `skills`，根目錄 Markdown 依 [官方規則](https://context7.com/docs/library-owners) 仍會包含；另排除 `docs/superpowers`、`docs/assets`，以及 `release-v0.6.md`、`release-v0.7.md`、`release-v0.8.md`、`release-v0.9.md`、`release-v0.10.md`。既有 32 個資料夾排除值與 9 個檔案排除值保留，最新 release notes 與 migration guide 保留。

保存設定遭自動核准審查拒絕，原因是投稿授權尚未涵蓋持久公開索引配置變更。已另行詢問維護者是否授權此方案與一次重新解析，目前尚未取得回覆，設定維持原值。已重新載入 Admin，讀回 32 個資料夾排除、9 個檔案排除及停用的 Save changes，沒有留下未保存編輯。回復方案是清空新增的 include 範圍、移除本次新增排除項目，再重新解析。

## 電子報入口與郵件規則

| 管道 | 目前狀態 | 續辦條件 |
| --- | --- | --- |
| [Cooper Press](https://cooperpress.com/submit/) 的 JavaScript Weekly / Node Weekly 共用入口 | 官方頁仍提供投稿，但內嵌 Airtable 拒絕載入。直接開啟該頁實際引用的分享表單後，顯示 `This private share link is no longer available.`。未送件。 | 官方修復或提供有效投稿表單後再續辦。不要猜測其他私人表單 ID。 |
| [Changelog News](https://changelog.com/news/submit) | 官方接受自家開源作品的消息，需登入，提供 URL、Title 與說明欄位。尚未登入或投稿。 | 使用可用且獲授權的作者帳號，以開源 release / 工具用途投稿，避免使用本站不接受的 how-to 或 commercial promotion 路線。 |

Console.dev 信件先依維護者核准的草稿寄出。維護者隨後提醒套用禮貌郵件 skill，因此已讀取 `courteous-vendor-inquiry` 及其 email patterns，並檢查寄出內容。此信只有一個主請求，讓編輯決定是否收錄，沒有要求分析報告、承諾刊登或額外商業工作。後續投稿信在寄出前先套用相同語氣原則。

這是個人 OSS 專案投稿，沿用已核准的 Project maintainer 身分；供應商型號、公司抬頭、詢價與公司電話欄位不適用本次投稿。寄件帳號與回覆地址依本次確認值處理，不寫入可公開的重用模板。未為了語氣檢查重寄同一封信。

## Awesome 清單的適配限制

| 清單 | 本輪判斷與後續 |
| --- | --- |
| [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills/blob/main/CONTRIBUTING.md) | 投稿規則禁止 AI 協助生成或提交 PR。列為需維護者親自處理；本輪未準備或提交該 PR。 |
| [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills/blob/main/CONTRIBUTING.md) | 要求可證明的 community usage 與成熟技能。現有安裝驗證僅證明套件可取得，外部採用證據尚未整理。取得真實使用案例後，再按每項不超過 10 words 的格式提 PR。 |
| [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills/blob/master/CONTRIBUTING.md) | 要求實際使用案例、範例、技能執行驗證，並在 upstream 新增 skill folder 與 README。這屬需要移植與驗證的投稿，尚未做完整 agent 執行驗收；先保留候選，不只貼一個宣傳連結。 |
| 其他 Awesome AI Tools、SEO Tools、CLI Apps、Open Source、Developer Tools 與 GitHub Awesome PR | SerpApi issue、Screpy PR 與 toolleeo CLI 清單 issue 已完成投稿。其他類別仍先核對相關性與投稿規則；`agarrharr/awesome-cli-apps` 明確不接受 AI-generated PR，列為需作者自行處理。 |

## 其餘曝光佇列

下表保留原始清單中需按情境準備的管道。已完成子項見上方回條，其餘仍待準備或選定具體目標，不能算成投稿失敗。

| 管道 | 可續辦的具體內容 |
| --- | --- |
| Hacker News / Show HN | 先前 Show HN 受到平台投稿限制且沒有建立 item。沿用停止重試決定，只有帳號限制獲平台解除才重看。HN 的 [guidelines](https://news.ycombinator.com/newsguidelines.html) 禁止生成或 AI 編輯留言，討論內容由作者親自撰寫。此列的帳號限制來自 2026-08-26 紀錄，本輪沒有重試或驗證解除狀態。 |
| Reddit r/opensource、r/SideProject、r/webdev、r/SEO | 分別準備開源交付、side project demo、建置檢查與 SEO 方法的具體案例；每個社群先查當期自推規則及可用帳號。 |
| Reddit r/ClaudeAI、r/ChatGPTCoding、r/LocalLLaMA | 以四份技能的實際 agent 工作流程為主，LocalLLaMA 僅在有本地 agent 使用情境時投稿。 |
| Reddit r/programming、r/javascript、r/node、r/commandline | 以可重現 CLI 範例、Node.js integration 或工程設計取捨為內容，逐站核對自推限制。 |
| DEV / Dev.to 與 opensource、seo、ai、webdev tags | 一篇可執行教學，展示 static build 掃描、JSON findings 與 CI；挑選最相關標籤後從作者帳號發布。 |
| Hashnode、Medium | 先有完整教學與選定的原始發布站，再處理 cross-post 與 canonical URL。 |
| Indie Hackers、Lobsters、HackerNoon | 依各站格式與作者／帳號要求準備具體工程或使用經驗，避免把目錄短介當成文章。 |
| StackShare | 先確認現有軟體條目、作者帳號與 CLI 類型適配，再建立 tool 資料。 |
| GitHub Discussions | 自己 repo 的 [Discussion #12](https://github.com/cucuwang/geoptimize/discussions/12) 已更新安裝資訊，收件證據見上表。其他專案仍需選定接受 showcase 的具體分類與真實使用案例。 |
| Discord Claude Code / AI coding / OSS / SEO practitioner communities | 待指定伺服器與可投稿頻道，先讀頻道自推規則，再以相符案例分享。 |
| X、LinkedIn、Bluesky、Mastodon | 待選定作者帳號與各站文字格式，用現有公開 report 圖與 CLI demo；Mastodon 另需確定 instance。 |
| YouTube | 先製作與當前公開版本相符的 CLI / agent 操作影片、字幕、thumbnail 及說明，再確認發布帳號。 |
| OSS、JavaScript、Node.js、SEO、AI developer newsletters | Console.dev 已寄出，結果見上表。Cooper Press 與 Changelog 的目前阻礙見電子報入口與郵件規則；其餘刊物尚未選定具體投稿入口。 |
| Product Hunt newsletters / ecosystem | 先完成 Product Hunt 產品 launch，之後按各刊物的獨立編輯流程處理。 |
| personal website / lvsota.com | 先決定是否在個人作品集或品牌頁呈現及其讀者用途。修改與部署屬另一步網站工作，目前未執行。 |
| geoptimize 專屬文件站、GitHub Pages | 先確認網域、hosting 與維護方式，再建立可讀文件站。現有 README/docs 已可作為投稿 source；本輪未建立或部署網站。 |
| npm README | 第一批已完成本機安裝文件修正。要更新 npm 套件頁需走後續 release 流程，本輪沒有為了曝光另發版本。 |
| 自動索引 public SKILL.md / GitHub 的目錄 | 已有四份公開技能、有效 metadata 與相關 topic。SkillsMP、skills.sh 等沿用原紀錄，等待正常索引，不製造重複安裝數。 |

## 續辦規則

1. 每次先讀原收件 URL 與公開 repo 狀態，再決定是否需要操作。已在審核中的項目保持同一份申請。
2. 登入修復、平台條件更新、真實採用證據增加或維護者明確接受相關條款後，才重新處理對應阻礙。日期經過本身不構成授權。
3. 更新本表時保留上次結果、這次動作、收件 URL 與可驗證狀態。沒有成功回條就記為未確認，不重送來猜測結果。
4. 這份檔案是人工續辦依據，沒有建立自動排程、監控或提醒。

## 本機驗證與回復

`claude plugin validate .` 通過 marketplace manifest 驗證；`claude plugin validate .claude-plugin/plugin.json` 通過 plugin manifest 驗證。這些檢查證明 metadata 格式有效，agent 實際執行驗收仍分開處理。

本次 geoptimize repository 修改僅更新此紀錄，既有主工作目錄保持原狀，指定文件以本機 commit 保存。需要撤回文件時可針對該 commit revert。外部 issue / discussion 可利用 GitHub 編輯歷史回復；Screpy 投稿分支保留於 `cucuwang/awesome-seo-tools` 的 `codex/add-geoptimize`，commit `b4eb1dcda147100b4f9baed4ced5964e8ec7f970`，作為 PR #4 的來源。

互動式 CLI 選單仍是獨立待實作工作。本輪所有投稿都以已公開的 `0.10.0` 功能為準。
