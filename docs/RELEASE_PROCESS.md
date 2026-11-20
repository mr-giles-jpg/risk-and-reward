# Risk & Reward: Development and release process

## Current development baseline
- **Latest consolidated preview:** `preview/v6.2-consolidated/index.html`
- **Production game:** `index.html`; do not replace it without explicit approval
- **Reference class market code:** `9HASS-A`
- **Game:** 10 years, 3 cycles/year, 30 cycles, 16 investments
- **Preview save key:** `riskreward_v62_consolidated_qa`
- **Development rule:** All changes build on the latest consolidated preview, never a previous production file or an isolated experiment

## Interface acceptance checklist (approved)
- [ ] Savings amount input with +$100 and -$100 beside it; Deposit Max and Withdraw Max below
- [ ] No redundant 'Max available cash' control in the savings account
- [ ] Fixed-term deposit amount input, +/- $100 and maximum shortcut above both deposit choice cards; two Open buttons remain in the cards
- [ ] Concentration strip shows largest holding, second-largest holding and Other investments, with coherent colour key
- [ ] Portfolio Check heading to the left of the concentration bar, adjacent accessible information control
- [ ] Unlock cards separate modelled price growth from income yield/distribution
- [ ] Results place investment income directly below holdings and distinguish bank interest and super investment change in separate cards
- [ ] Trading confirmation, news modal, market navigation, reports and Help/Learn continue to work

## Market-engine acceptance checklist
- [ ] Preserve all four economic storyline sets and branch probabilities unless expressly approved otherwise
- [ ] Identical class market codes generate identical full price histories; different classroom codes can vary
- [ ] No future branches, surprise factors or exact future returns revealed in student news
- [ ] News significance responds to expected vs unexpected economic developments; no automatic directional guarantee
- [ ] Direct and indirect exposures affect relevant assets; unrelated price movements are explained as such
- [ ] Established and speculative shares remain distinct in volatility and company-event behaviour
- [ ] Bonds, ETFs, shares and commodities retain different risk and income characteristics
- [ ] Company-specific events and market explanations stay consistent with the actual generated price tape
- [ ] No silent change to ledger, settlement, wages, savings interest or superannuation rules

## Required checks before calling a preview validated
1. Extract and compile every embedded script (syntax check)
2. Run 30-cycle simulations over multiple class codes; test identical-code repeatability
3. Compare annualised returns, volatility, drawdowns, extreme moves and event relevance before versus after
4. Test browser interactions at 390, 768, 1024 and 1366 px
5. Test savings and fixed-term shortcuts, open/close trading, news, results and all unlock milestones
6. Test export/import and persistence, especially isolation from production game progress
7. Verify the deployed GitHub Pages URL and check for browser errors
8. Review changes against this checklist before inviting approval for production

## Source-control safeguards
- Never build from `index.html` merely because it is at the repository root; identify the latest approved consolidated preview first
- Treat isolated previews as experiments, not as a new canonical baseline
- Make each preview in a separate path and give it a distinct browser storage key
- Record in each release summary: source build, changed files, preserved features, test evidence, known limitations, class seed/code and commit SHA
- Prefer small targeted changes to a copy of the approved baseline; do not silently omit previous fixes
- Before production publication, compare the proposed file against the current production build and obtain explicit approval
- Keep a known-good preview and commit for rollback

## Release status
V6.2 consolidated is **QA preview only**, not a validated student release. Source-level syntax and basic deterministic market checks passed. Browser interaction, layout and save/load regression checks remain outstanding.
