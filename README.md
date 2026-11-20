# Risk & Reward

**Year 9 Economics financial literacy simulation** | Perth, WA | Fictional investments and classroom market scenarios.

## Play and preview
- **Live student game:** https://mr-giles-jpg.github.io/risk-and-reward/
- **Latest development preview:** https://mr-giles-jpg.github.io/risk-and-reward/preview/develop/
- **Source of live game:** `main/index.html`
- **Source of development game:** `develop/index.html`
- **Reference shared class market code:** `9HASS-A`

> The development preview is for testing. It is not the approved live student version. Existing student saves should be backed up before any major version changes.

## Versions
| Version | Status | Purpose |
|---|---|---|
| V6.1 | Current live baseline | Unified ten-year student game |
| V6.2 | In development | Consolidated interface, adaptive market news and individual company risk |
| V6.0 / V5.x | Historical | Earlier classroom versions available through prior commits and backup branches |

The game's ten-year sequence contains three trading cycles per year. The V6.2 development engine models 16 investments and four multi-year economic storylines with four outcome branches each.

## Where files belong
| Path | Purpose | Change policy |
|---|---|---|
| `index.html` on `main` | Live student site | Update only after approved release |
| `index.html` on `develop` | Canonical cumulative development game | Every new development change builds on this |
| `preview/develop/index.html` on `main` | Published development preview | Generated from a tested `develop` commit |
| `preview/v6.2-consolidated/`, `preview/v6.2-market-behaviour/` etc | Historical previews | Retain temporarily for comparison; never use as current source |
| `part1.html`, `part2.html` | Legacy two-part release | Keep while linked from the live game or historical pages |
| `v6-*.css`, `v6-*.js` | Dependencies of legacy parts | Do not delete independently |
| `tests/` | Automated market and browser checks | Maintain with code changes |
| `.github/workflows/` | Continuous integration and preview publishing | Review before changing |
| `docs/` | Release process and audit notes | Keep current |

See [Repository file inventory](docs/REPOSITORY_INVENTORY.md) and [Development and release process](docs/RELEASE_PROCESS.md).

## Contributing and releases
1. Work from `develop`, or create a short-lived feature branch based on `develop`
2. Preserve approved features and run the regression checks
3. Review changes in the development preview
4. Promote a tested version to `main` only with explicit approval
5. Record the release SHA and a version tag; do not treat copied previews as independent development baselines

A failed GitHub Actions check means the build is **not yet verified**. It does not necessarily mean the live website is broken.

## Important notes
- The repository contains the game code and fictional market model, not submitted student work
- Student progress uses browser storage and downloadable JSON saves
- Historical preview URLs may remain publicly reachable, so removing old files can break previously shared links
