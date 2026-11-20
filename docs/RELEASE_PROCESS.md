# Risk & Reward: Development and release process

## Current canonical builds
- **Production:** `main/index.html`, the student-facing live game
- **Development source of truth:** `develop/index.html`, initially consolidated V6.2
- **Stable development preview (generated copy):** `main/preview/develop/index.html`
- **GitHub Pages preview:** https://mr-giles-jpg.github.io/risk-and-reward/preview/develop/
- **Reference classroom economy:** `9HASS-A`
- **Current structure:** 10 years, 3 cycles per year, 16 investments
- **Development save key:** `riskreward_v62_consolidated_qa` (separate from the production save)
- Old `preview/v6.2-consolidated/` and earlier preview folders are historical snapshots, not the current source of truth.

## Development rules
1. Start new work from the current `develop` branch, **not** `main/index.html`, an old `preview/vX/` file or a chat attachment.
2. For substantial work, make a short-lived feature branch from `develop`. Integrate it into `develop` after reviewing the diff and running checks.
3. Preserve previously approved features unless a specific change or removal has been agreed.
4. Every `develop` update must be cumulative. Never overwrite it with a separately developed full HTML build.
5. The stable preview is generated from `develop/index.html` after the validation workflow succeeds. **Do not edit the generated preview independently.**
6. Keep production `main/index.html` unchanged until explicit approval. Production releases are controlled promotions from a tested development commit.
7. Give each major release a tag (e.g. `v6.2.0`) after approval. Keep older release tags to support rollback.
8. Record the tested commit SHA, features changed, class code, known limitations and test evidence in each release summary.

## Automated validation
Workflow: `develop/.github/workflows/develop-ci.yml`.

On a push to `develop`, or a PR to `develop` or `main`, the workflow:
- Compiles each embedded JavaScript block
- Checks all previously approved UI-refinement code is present
- Tests 30 cycles and 16 assets, class-code repeatability, and `9HASS-A` branches
- Checks asset risk differences and an unrelated Gold/news attribution example
- Runs Chromium smoke tests including savings/term-deposit order and screen widths of 390, 768, 1024 and 1366 px
- Only after a successful `develop` push, copies that *tested commit* to `main/preview/develop/index.html`
- Skips publishing older builds when a newer `develop` commit exists

**Important:** CI execution and GitHub Pages refresh must be confirmed in GitHub Actions. A committed workflow alone does not prove a run succeeded. GitHub may need Actions enabled and GITHUB_TOKEN write access to publish the preview. If deployment fails, leave production unchanged and check the Actions logs.

## Approved UI checklist
- [ ] Savings amount has +$100 and -$100 alongside; Deposit Max and Withdraw Max remain below
- [ ] No redundant Max available cash on savings
- [ ] Fixed-term amount and ±$100/max shortcuts appear **above** the two term-deposit cards
- [ ] Concentration bar shows largest holding, second-largest holding and Other investments
- [ ] Portfolio Check label and accessible information control are correctly positioned
- [ ] Unlock cards separate annual price-growth target from income yield
- [ ] Results show investment income below holdings, plus bank interest and super investment change as distinct cards
- [ ] Save/load, news, trading, finish confirmation, investments and Learn pages still work

## Market acceptance checklist
- [ ] Preserve the four economic storyline families and their A–D outcome probabilities unless explicitly agreed otherwise
- [ ] Same class code yields the same 30-cycle market price history
- [ ] No future outcomes, private branches, or exact future prices are shown to students
- [ ] Adaptive significance, expectations and surprise act on relevant asset exposures
- [ ] Business maturity and occasional company events affect share risks without guaranteeing a rebound
- [ ] Bonds, ETFs, individual shares and commodities keep appropriate differences
- [ ] Report attribution separates news from ordinary and company-specific price movements
- [ ] No silent changes to wages, ledgers, interest, dividends, superannuation or settlement

## Release procedure
1. Update the `develop` branch; confirm code and browser checks are green
2. Review the stable development preview and compare outcomes across several classroom codes
3. If a feature is rejected, fix it on `develop`; do not fork an older snapshot
4. Once approved, make a release PR or equivalent reviewed change from `develop` into `main`
5. Before merging, explicitly compare the intended `index.html` against production and confirm saved-game migration behaviour
6. Publish and verify the live game at the main GitHub Pages URL; tag the release and note its SHA
7. Do not assume previous save files are compatible without checking import/export

## Current release status
- `develop/index.html` starts from V6.2 Consolidated
- `main/index.html` remains the current live release
- Automated checks have been configured; their successful execution and automatic preview publishing must be independently confirmed
- Full gameplay and save/load regression checks remain outstanding
