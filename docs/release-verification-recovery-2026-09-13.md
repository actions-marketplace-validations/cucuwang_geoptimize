# v0.10.0 公開驗證失敗復原紀錄

查核日期為 2026-09-13。

## 事件範圍

GitHub Actions workflow run [34567150571](https://github.com/cucuwang/geoptimize/actions/runs/34567150571) 在 `publish` job 的最後一步失敗。這筆歷史 run、v0.10.0 的 immutable GitHub Release、signed tag 與 npm 版本都保留原狀。本輪沒有重跑 workflow、npm publish、tag 或 Release 操作。

透過 GitHub connector 讀取 run jobs 與 publish job log 後，前置步驟均已完成。`Verify source, signed tag, candidate and unpublished version`、attestation、draft release、npm publish、Release finalize 都成功，只有 `Verify public npm, GitHub and tag alignment` 失敗。

## 原始失敗證據

publish job 使用的 source ref 是 `01ac0f19e2a7f8f8854b3304ecd0193a6a9d2b63`，環境中的 `RELEASE_TAG` 是 `v0.10.0`。

在 `2026-09-11T05:46:10.5885764Z`，npm publish 已回報以下結果。

```text
npm notice Your package is being processed and may take a few minutes to become available.
+ geoptimize@0.10.0
```

在約一秒後的 `2026-09-11T05:46:11.7914722Z`，同一 job 執行原有 public verifier，得到以下結果。

```text
FAIL: npm latest is 0.9.0; expected 0.10.0
FAIL: npm does not contain exact version 0.10.0
PASS: v0.10.0 points to 01ac0f19e2a7f8f8854b3304ecd0193a6a9d2b63
PASS: GitHub Release is published for v0.10.0
2 release verification check(s) failed.
```

這些 log 證明最後核對當下讀到的 npm packument 尚未呈現新版本，並且明確記錄 npm 自己的處理中訊息。它們沒有揭露 registry 內部處理機制，因此本紀錄把根因定義為「publish 成功與公開 packument 核對之間存在未處理的可見性窗口」，不把 registry propagation 的內部狀態寫成已直接觀測的事實。

runbook 的後續公開讀回記載 v0.10.0 在 `05:49:19Z` 已可見；這只作為時間序列的既有紀錄，不能改寫歷史 run 的 failure conclusion。

## immutable release 證據

GitHub API 公開 readback 取得下列資料。

| 證據 | 值 |
| --- | --- |
| signed tag | `v0.10.0` |
| tag object | `6513ebc3e6f9cdbac9cb37b981bea3fdf406a8c2` |
| tag source commit | `01ac0f19e2a7f8f8854b3304ecd0193a6a9d2b63` |
| tag verification | `verified: true`, `reason: valid` |
| GitHub Release | [geoptimize 0.10.0](https://github.com/cucuwang/geoptimize/releases/tag/v0.10.0)，`draft: false`，`prerelease: false`，`immutable: true` |
| release tarball | `geoptimize-0.10.0.tgz` |
| release tarball SHA-256 | `dbe2d0702020875a1cbef60a52c82cf3415c5f75ee2b44ff88dacb021e023d7c` |
| npm dist-tag | `latest: 0.10.0` |

GitHub release asset API 的 tarball digest 也是
`sha256:dbe2d0702020875a1cbef60a52c82cf3415c5f75ee2b44ff88dacb021e023d7c`。直接下載 release tarball 後計算的 SHA-256 與 `SHA256SUMS` 的 tarball 行相同。

## 復原入口

新增的唯讀入口如下。

```bash
bash scripts/verify-release-public.sh \
  01ac0f19e2a7f8f8854b3304ecd0193a6a9d2b63 \
  dbe2d0702020875a1cbef60a52c82cf3415c5f75ee2b44ff88dacb021e023d7c
```

這個 wrapper 先驗證 40 字元 commit SHA 與 64 字元 SHA-256，接著在自己的暫存目錄以 `git archive` 取得指定 commit 的 `package.json`、`package-lock.json` 與當時的 `scripts/verify-release-v0.8.sh`。因此後續 consumer 與 package contract 會以 immutable release source 為準，不會拿本輪後來加入的依賴 lock 去檢驗舊 tarball。

wrapper 先輪詢 npm packument。HTTP 404、429、5xx，以及 HTTP 200 但指定版本尚未出現在 packument 的狀態，才進入 bounded retry。預設最多 10 次，第一次等待 15 秒，之後以 30 秒為上限，預設重試間隔合計 255 秒，即 4 分 15 秒；每次 HTTP 探測另設 5 秒連線與 10 秒總逾時。只有同時看到指定版本存在且 `latest` 等於該版本時，才從 archive source 呼叫原有 v0.8 verifier 一次。

HTTP 200 但版本已存在而 `latest` 不符、JSON 形狀錯誤、其他 HTTP 狀態、探測沒有 HTTP status，以及原有 verifier 回報的 repository identity、tarball、hash、tag、Release、CLI alias 或 consumer mismatch，都直接 fail closed，不進入 retry。這條界線保留真正 artifact mismatch 的可見性。

Release workflow 的最後 public check 已改呼叫這個入口。本項修復保留 publish、attestation、draft staging 與 Release finalize 步驟。Action pins 由同輪的 #28 切片另外更新。

## 現行公開唯讀核對

root 已用同一組 release commit 與 tarball SHA 執行 wrapper，結果為 exit 0。公開 npm、GitHub tag、GitHub Release 與 release asset 都是同一份 v0.10.0 證據。

```text
PASS: npm latest is 0.10.0
PASS: npm contains exact version 0.10.0
INFO: npm does not expose gitHead; tarball SHA-256 remains the artifact identity gate
PASS: npm repository identity matches cucuwang/geoptimize
PASS: npm tarball SHA-256 matches the verified candidate
PASS: geoptimize resolves to 0.10.0 from the public package
PASS: geo resolves to 0.10.0 from the public package
PASS: geo-cli resolves to 0.10.0 from the public package
PASS: v0.10.0 points to 01ac0f19e2a7f8f8854b3304ecd0193a6a9d2b63
PASS: GitHub Release is published for v0.10.0
All public release checks passed.
```

這次 exit 0 是目前公開 artifact 的新 readback。歷史 run 34567150571 的 failure 保留，immutable v0.10.0 未重新發布。wrapper 的用途是讓之後的發版在 npm 短暫不可見時有界等待，並提供不觸發 publish job 的獨立核對命令。

## 限制與操作邊界

- v0.10.0 已存在且 immutable，不得重發、覆寫 tarball、重建 tag、修改 Release 或用 rerun 取代 recovery readback。
- wrapper 的 archive source 必須在本機 Git object database 中可取得；缺少 exact commit 時會停止，不會自行 fetch 或改寫遠端狀態。
- 直接從後續 main checkout 執行舊 verifier，可能把後來變更的 package-lock 與歷史 tarball 比較而失敗。wrapper 固定使用指定 commit 的 archive source 來消除這個範圍混淆。
- npm 的 `gitHead` 目前未公開，因此 tarball SHA-256、signed tag source、Release asset 與三個 CLI alias 共同構成可讀回的 artifact identity evidence。
