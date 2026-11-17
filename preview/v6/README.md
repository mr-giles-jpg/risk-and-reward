# Risk & Reward V6.0 · refined development preview

## Preview and classroom deployment
- Preview homepage: https://mr-giles-jpg.github.io/risk-and-reward/preview/v6/
- The root GitHub Pages site retains V5.9: https://mr-giles-jpg.github.io/risk-and-reward/
- Both preview HTML files run as static local HTML in a permissive browser, or via GitHub Pages.
- This is a development preview for testing, not a final classroom release.
- Browser storage key uses `_v60_stage2` so progress does not overwrite the original V5.9 game or the Stage 1 preview. Export JSON for any preview progress worth keeping.

## 17 November 2026 interface refinement
- Three-column investment layout on desktop: narrower asset selection, price graph with price-swings label, and separate trading controls
- Restored coloured risk labels on investment list rows
- Consistent dark-navy, teal, amber and pastel pop-up styling based on the original welcome introduction, including news, cycle review and Finish Trading confirmation
- First-cycle decision reasoning moved from before buying to the top of the Year 1 Cycle 1 review. Students can trade without answering it first, and then record a reason for the worksheet
- "After the game" section constrained to the width of the other home content
- Purchase/sale, return and volatility simulation code unchanged
- Static checks: all five inline JavaScript blocks in both Part 1 and Part 2 pass syntax parsing. Visual browser regression testing is still recommended before replacing V5.9

## Interface revisions
- 40% compact investment list / 60% trading panel with risk, income yield and cycle movement on every unlocked row
- Buy and Sell buttons above the extended history chart, persistent trading timer and Finish Trading action in the header
- Custom Finish Trading check with a contextual concentration/diversification/cash observation; no new compulsory question
- Brighter, shorter investment unlocks, consistent help guides, and side-by-side possible upside / possible downside in the news
- Visible interest rates for savings, term deposits, bond coupons, ETF dividends and property distributions
- Amount shortcuts including +$100 and maximum savings/term deposit selections
- Cycle result explanation with value-weighted percentage movement of currently held investments, dollar change since trading opened, and market/news factors
- Compact worksheet-first Performance view, end-of-year annual checkpoints at the top, historical net worth, holdings, final summary, and separate Learn view from the in-game home page
- Student PDF report still requires explicit browser Print / Save as PDF; JSON is downloaded separately, and the report preview opens after Finish Game / Save Report

## Recalibrated market model
- News effect is applied 30% before trading, 70% during settlement. Economic headlines remain common across students.
- Event strength increases for important sector and economy shocks, with an 18% absolute limit on an individual asset's direct news contribution per cycle.
- Random volatility is scaled relative to asset type, preserving different student outcomes and higher company-specific volatility for shares.
- Tech company's expected price drift adjusted to 7% p.a.; Property Fund modelled price drift 2.5% p.a., distribution yield 4.5% p.a., and interest-rate sensitivity modestly adjusted.
- Technology competitive pressure and broad downturn effects strengthened without scripting a guaranteed company crash.
- All investment returns remain uncertain. Income, portfolio concentration and defensive investment features are now shown more clearly.

## Automated verification completed
- Chromium at 1366×768 and 1024×768: startup, news, trading, first-purchase reasoning, custom finish confirmation, cycle results, Performance and no horizontal overflow
- A complete Part 1 Year 1–5 and Part 2 Year 6–10 campaign including JSON export and Part 1→Part 2 import
- PDF preview print for both completed reports
- Monte Carlo review of 1,000 seeded market paths: no engine exceptions; risk assets retain large possible losses and gains
- Theoretical buy-and-hold total-return test accounts for income payouts, showing that price-only comparisons are misleading

## Notes
- Only the published game files are present in the public repository; student names and JSON/PDF responses remain in each student's browser/files, not GitHub
- A hosting URL does not guarantee the school browser allows downloads or local storage. Test on a student laptop
- The fictional property and investment pricing parameters are teaching simplifications, not financial forecasts
