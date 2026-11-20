# Repository inventory and clean-up plan

Last reviewed: 20 November 2026.

## Keep in active development
- `develop/index.html` is the **only** working game source. It combines the approved V6.1 interface refinements with the experimental V6.2 market engine
- `tests/regression.test.cjs` validates code structure, four storyline branches, same-code market determinism, and asset settings
- `tests/browser.spec.cjs` covers smoke tests and banking layout; the draft V6.2 PR passed the workflow on 20 November 2026
- `.github/workflows/develop-ci.yml` runs read-only regression and browser checks; `.github/workflows/pages.yml` deploys the live game and tested preview together as a GitHub Pages artifact
- `docs/RELEASE_PROCESS.md` explains releases

## Keep in production
- `main/index.html` is the site launched by the root GitHub Pages URL
- `main/preview/develop/index.html` is a historical snapshot; after switching Pages to **GitHub Actions**, the Pages artifact publishes `develop/index.html` at the same URL
- `README.md` and `docs/` contain project information

## Legacy: retain until links and functionality are tested
| File group | Dependency/evidence | Later action |
|---|---|---|
| `part1.html` and `part2.html` | The live `index.html` references `part2.html`; earlier two-part versions used these files | Remove only in a deliberately approved breaking-link clean-up |
| `v6-classroom-enhancements.css/js` | Referenced by `part1.html` and `part2.html` | Retain while legacy pages exist |
| `v6-layout-refinements.css/js` | Referenced by `part1.html` and `part2.html` | Retain while legacy pages exist |
| `v6.1-preview.html` | Historical preview URL that may have been shared | Prefer an archive notice or redirect before removal |
| `preview/v6/`, `preview/combined-ui-refinements/`, `preview/v6.2-market-behaviour/`, `preview/v6.2-consolidated/` | Earlier review checkpoints and potential bookmarked links | Preserve as historical snapshots; no feature development from these paths |

## Branches
- Active: `main` (production) and `develop` (working)
- Historical backups found: `backup/v5.8-before-v5.9`, `backup/v5.9-live-before-v6-2026-11-17`, `backup/v6-before-classroom-refinements-2026-11-17`, `backup/v6-before-layout-refresh-2026-11-17`, `backup/v6-before-v61-pages-2026-11-18`, `backup/v6-stage1-before-stage2`, `backup/v61-before-final-entry-2026-11-19`, `backup/v61-before-portfolio-check-2026-11-19`
- No release tags had been created when reviewed. Keep backup branches until each historical version has a verified tag and a restoration plan
- A branch being 'ahead' or 'behind' another is normal when administrative preview commits are published on `main`. It is not by itself evidence that features were lost

## Deletion policy
**No confirmed-safe deletions identified in this audit.** Do not delete files merely because they are old; GitHub Pages may still serve their exact URLs. Use a later, separately reviewed clean-up PR when the legacy routes have been tested and release tags exist.

## Known issue requiring attention
The earlier failed run was caused by Playwright 1.55 running on an unsupported Ubuntu 26.04 image. Pinning CI to Ubuntu 24.04 fixed the problem. The PR-triggered **Validate development game** regression and Chromium browser checks passed on 20 November 2026. Full gameplay and save/load scenarios remain outside this smoke suite.

## Avoiding renewed divergence and unsafe releases
The current Pages workflow builds a combined artifact from `main` production and `develop` preview. It no longer makes bot commits to `main`. To enable automated deployment, set **Settings → Pages → Source: GitHub Actions**, run the **Publish Risk & Reward website** workflow, and verify both the live and preview URLs.
