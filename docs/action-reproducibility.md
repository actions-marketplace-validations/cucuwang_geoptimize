# Action reproducibility decision

The v0.10 trust-hardening review retained the composite Action and left bundle
evaluation to [issue #20](https://github.com/cucuwang/geoptimize/issues/20).
Both Action metadata paths now pin setup-node v7.0.0 to its verified upstream
commit. setup-node v7 runs on the Node 24 Action runtime; self-hosted runners
must be at least `2.327.1`. The default package-spec remains the exact published
geoptimize version. The scan's runtime behavior and package-spec override remain
unchanged.

The Node 24 runtime requirement applies to the Action runner that loads
setup-node. It is separate from the `node-version` input used to select the
project's Node 22 or Node 24 toolchain.

The copyable sample workflow now uses the same verified checkout commit and
sets `persist-credentials: false`. This is a sample-only consistency follow-up
for the mutable `actions/checkout@v4` line already present at the fixed base; it
was not introduced by PR #28.

| Dimension | A: runtime npm install | B: checked-in bundled JS |
| --- | --- | --- |
| Reproducibility | Top-level version fixed; transitive semver resolution varies. A dedicated action lock and isolated npm ci could improve this. | Fixed dependency bytes with Action commit; needs reproducible bundle verification. |
| Package size | Small checkout; dependency downloads on each fresh runner. | Larger repository artifact; quantify a prototype before choosing. |
| Maintenance | Existing release and package-spec testing paths. Dedicated lock adds synchronization work. | Bundler, license notices, build verification and binary/runtime compatibility checks. |
| Updates | npm version release; transitive resolution may change independently. | Every dependency update needs a rebuilt, reviewed bundle and new Action release. |
| Security surface | Registry and install lifecycle scripts on every run. | Removes most install-time resolution; bundled vulnerabilities persist until updated. |
| Marketplace | Current composite Action already works. | JavaScript Actions are supported; Node runtime and inputs/outputs need revalidation. |

The public `package-spec` input deliberately permits test tarballs/alternate specs.
Always running a fixed bundle would ignore that input; retaining an installer fallback
preserves much of the current surface. Puppeteer-core/browser paths, ESM dependencies,
and dynamic imports need bundle testing even though the Action's normal scan is local.
A broad runtime rewrite remains outside this decision.

## Verification boundary

Local verification covers the pinned references, YAML parsing, and the existing
Action-contract checks in this checkout. Those checks do not prove that a hosted
runner executed the updated Actions. Before claiming hosted compatibility, read back
a Node 24 hosted run covering the Action contract and release artifacts, including
the self-hosted runner requirement when that environment is used.

Follow-up acceptance: prototype size and cold-run timing; build the bundle twice from
npm ci and compare hashes; preserve both metadata paths, package-spec semantics,
advisory/blocking behavior and outputs; inspect included licenses and optional browser
code; add a stale-bundle CI check and an explicit dependency update workflow. Do not
claim Option A has a fully locked consumer dependency tree.
