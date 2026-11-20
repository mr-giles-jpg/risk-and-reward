# Risk & Reward: Development and release process

## Current canonical builds
- **Production:** `main/index.html`, the student-facing live game
- **Development source of truth:** `develop/index.html`, initially consolidated V6.2
- **Stable development preview (deployed artifact):** `/preview/develop/index.html` in the Pages website, assembled from `develop/index.html`
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
5. After successful development CI, `.github/workflows/pages.yml` assembles the existing `main` production game and `develop` preview in one Pages artifact. **Do not edit the generated preview independently.**
6. Keep production `main/index.html` unchanged until explicit approval. Production releases are controlled promotions from a tested development commit.
7. Give each major release a tag (e.g. `v6.2.0`) after approval. Keep older release tags to support rollback.
8. Record the tested commit SHA, features changed, class code, known limitations and test evidence in each release summary.

## Automated validation and Pages deployment
- `.github/workflows/develop-ci.yml` tests every `develop` push and PR to `develop` or `main`. It runs Node market checks and Chromium browser checks on Ubuntu 24.04.
- `.github/workflows/pages.yml` runs on `main` pushes or after **successful push-triggered** development checks. It fetches `main` and `develop`, serves production from `main`, adds `develop/index.html` at `/preview/develop/index.html` and publishes the combined static site through `actions/deploy-pages`.
- The Pages workflow no longer writes preview commits onto `main`. It skips outdated development results.
- **One-time repository setting required:** Settings → Pages → Build and deployment → Source: **GitHub Actions**. Until this is configured, the deployment may fail; keep the existing live game and preview untouched.
- A green CI check does not itself prove that Pages deployed. Verify the `Publish Risk & Reward website` workflow and both URLs after switching source.
- Use `9HASS-A` for regression testing and retain the 16-asset, 30-cycle checks.

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
