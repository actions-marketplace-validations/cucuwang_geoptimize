# Skill directory submissions

Verified on 2026-09-11. This receipt covers the first ten directories requested by the maintainer. Submission acceptance, review approval, and public listing are tracked separately.

## Published source

- Repository: https://github.com/cucuwang/geoptimize
- Source inspected: `e4580129e746110cdacf3b4644757c9575c56a93` on `main`
- Package and plugin metadata: `0.10.0`
- License: MIT
- Skills: `geo-scan`, `geo-generate`, `geo-transform`, `seo-experiment-ledger`
- Submission copy: [skill-directory-submission-copy.json](skill-directory-submission-copy.json)

## Installation verification

The official `skills@1.5.25` CLI discovered all four skills from the public repository. All four also passed `skill-creator/scripts/quick_validate.py`.

One real project-scoped installation into an isolated consumer directory completed successfully, using `--agent codex --skill '*' --copy --yes`. Telemetry was enabled for that installation, following the [skills.sh listing process](https://www.skills.sh/docs/faq). No global agent installation was performed. The project lock contained all four skill names, and installed files matched the inspected public source byte for byte.

| Skill | Installed SKILL.md SHA-256 |
| --- | --- |
| geo-scan | `8e6c7c2b5c96aa334627723ea3d10daf9da9fec8aa1b6f566f30e2ba78f67917` |
| geo-generate | `274f6ae5f5a76b4bfb2c12d45b675fb642736dcd5618fbea4a4e7852c414f567` |
| geo-transform | `cd49f2c8318feeb2ea330a39e184fde9e6f397d50edc54d56c9072ab4e5b2c2d` |
| seo-experiment-ledger | `ab16ec65de37efd11f0a36eadd989cbee8c25ac156cd629f033c87a47b66c8c1` |

This checks distribution and file integrity. It does not certify agent behavior or close findings in the separate repository audit.

## Directory status

| Directory | Action and verified result | Remaining work |
| --- | --- | --- |
| [skills.sh](https://www.skills.sh/docs/faq) | Completed one real installation with the official CLI and telemetry enabled. | The `geo-scan` public page still returned the site's 404 screen on readback. Listing remains unverified; do not repeat installs to inflate counts. |
| [agentskill.sh](https://agentskill.sh/submit) | Confirmed that its form can import every SKILL.md in a repository. The in-app browser could not open the submission page, reporting `ERR_BLOCKED_BY_CLIENT`. | No submission was made. Open the normal submission page manually and submit the repository once. |
| [Skillstore](https://skillstore.io/zh-hant/submissions/5b633b01-2ee1-4847-9bed-2f4e31288346) | Repository submission accepted. ID `5b633b01-2ee1-4847-9bed-2f4e31288346`; the page explicitly identified four expected skills and subsequently linked [review PR #3392](https://github.com/aiskillstore/marketplace/pull/3392). | Maintainer approval and public listing remain pending. [Processing workflow](https://github.com/aiskillstore/marketplace/actions/runs/34585757725). Do not submit the four directories again. |
| [Skills Directory](https://www.skillsdirectory.com/submit) | Confirmed that submission requires GitHub sign-in. The owner authorized basic authentication as `cucuwang`. | Sign-in did not advance from either the submission page or its normal login page. No submission was made. |
| [MCP Market](https://mcpmarket.com/zh/submit?type=skill) | Selected Agent Skill and Free Queue. `geo-scan` received the success message confirming entry into the free queue. | Separate submissions of `geo-generate`, `geo-transform`, and `seo-experiment-ledger` each returned `Failed to submit skill`. Their acceptance is unverified. The page quoted a 4–6 week free-queue wait; no payment was made. |
| [ClaudePluginHub](https://www.claudepluginhub.com/plugins/dexuwang627-cloud-aeoptimize) | Existing listing found under the legacy slug, already named geoptimize and linked to cucuwang. Submitted the repository through its refresh form; received `Submitted plugin cucuwang/geoptimize for processing`. | Validation and index refresh remain pending. Do not create a duplicate listing. |
| [SkillsMP](https://skillsmp.com/docs/faq) | Confirmed its documented prerequisites: public GitHub repository, valid SKILL.md frontmatter, and `claude-skills` or `claude-code-skill` topic. The repository already meets them. | Await its daily sync and verify results against the exact repository. No manual submission system is available according to its FAQ. |
| [SkillHub](https://www.skillhub.club/app/skills) | Logged in, uploaded all four skills, selected public visibility, and submitted each for publication. All four read back as `PUBLIC` and under security review. | Public-search visibility remains pending its artifact review. Item receipts are listed below. |
| [AgenticSkills](https://github.com/Korona7x17/agenticskills/issues/182) | Submitted the geoptimize collection in SEO & Growth. The success page linked review issue #182. | Review approval and publication remain pending. |
| [Skillz Directory](https://www.skillz.directory/submit/success) | Submitted the geoptimize collection under Other. The browser reached `Skill Submitted!` and the success URL. | Review approval and publication remain pending. This generic success page is not an individual public listing. |

## SkillHub item receipts

These are owner-management URLs, not public listing URLs.

| Skill | Current submitted version | Management page |
| --- | --- | --- |
| geo-scan | v1 | [3918ba33](https://www.skillhub.club/app/skills/3918ba33-569f-46df-abaa-1b348d6b2fa8) |
| geo-generate | v2 | [32bf765e](https://www.skillhub.club/app/skills/32bf765e-4f6c-4926-b359-3646257730d8) |
| geo-transform | v1 | [54cef5b5](https://www.skillhub.club/app/skills/54cef5b5-cd55-4099-b579-c4fc7ad40729) |
| seo-experiment-ledger | v1 | [85a9fa2b](https://www.skillhub.club/app/skills/85a9fa2b-e7d0-45c5-870e-730b434b1457) |

SkillHub's multiple-file input combines files into one skill. An attempted three-skill batch created an incomplete private geo-generate draft. It was repaired with a new version containing only the correct SKILL.md before requesting publication. After navigating away and back, the saved 1,257-character content matched the source exactly. The other skills were imported separately. No incomplete draft remains as the current version; the earlier failed version remains in that item's history.

## Notification readback

At the maintainer's request, both `Weekly digest` and `Ecosystem digest` email notifications were disabled in [ClaudePluginHub notification settings](https://www.claudepluginhub.com/settings/notifications). Both controls remained off after a page reload. In-app notifications and unrelated email settings were preserved.

## Installation documentation change

The English README and eight translated READMEs now include the missing second Claude Code step:

```bash
claude plugin marketplace add cucuwang/geoptimize
claude plugin install geoptimize@geoptimize
```

The cross-agent installation remains a separate alternative:

```bash
npx skills add cucuwang/geoptimize
```

[Claude Code documentation](https://code.claude.com/docs/en/discover-plugins) confirms that registering a marketplace only adds its catalog; a plugin installation is a separate action. These documentation edits are local until separately pushed and merged.

## Continuation boundaries

The maintainer authorized the named directory submissions and supplied the contact address for those forms. Basic GitHub sign-in was separately authorized for Skills Directory, ClaudePluginHub, and SkillHub. Terms acceptance for the latter two was explicitly confirmed. ClaudePluginHub's additional read-only organization/team access was also separately approved; no broader repository access was granted. Do not pay for placement, enable webhooks, or subscribe to promotional mail without permission.

The interactive geoptimize CLI remains a separate implementation task. Its proposed menu must not be advertised as a shipped feature in these submissions.
