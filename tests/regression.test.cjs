'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1]).filter(Boolean);
const findScript = phrase => {
  const script = scripts.find(text => text.includes(phrase));
  assert.ok(script, 'Missing script: ' + phrase);
  return script;
};
const dataScript = findScript('window.RR61_DATA=').trim();
const dataText = dataScript.slice(dataScript.indexOf('window.RR61_DATA=') + 'window.RR61_DATA='.length).replace(/;\s*$/, '');
const data = JSON.parse(dataText);
const sandbox = {};
vm.runInNewContext(findScript("const VERSION='v6.1-stage2-candidate-1'"), sandbox, { timeout: 5000 });
const { createEngine } = sandbox.RRStage2Engine;
const unlockUpdates = { PROP: 2, GOLD: 2, RENEW: 6 };
for (const a of data.stage1.assets) if (unlockUpdates[a.id]) a.unlock_year = unlockUpdates[a.id];
const engine = createEngine(data.stage1, data.stage2, data.calibration.config);

test('every embedded JavaScript block parses', () => {
  assert.ok(scripts.length >= 18, 'Some scripts were lost');
  scripts.forEach((source, index) => {
    assert.doesNotThrow(() => new vm.Script(source, { filename: 'embedded-' + index + '.js' }));
  });
});

test('approved interface modules remain integrated', () => {
  for (const [feature, token] of Object.entries({
    'Fixed-term controls above cards': 'rr61-deposit-order-refinement',
    'Savings shortcuts beside amount': 'rr61-ui-arrangement-script-20261119',
    'Top-two concentration breakdown': 'rr61-pc-legend-three',
    'Portfolio Check information': 'rr61-pc-tip-live',
    'Separated price growth': 'Price growth target',
    'Cycle income and interest cards': 'rr61-cycle-money-script',
    'Adaptive news': 'newsSignificance',
    'Established / speculative profiles': "const profiles={TECH:",
    'Student market explanations': 'Your holdings, explained:',
    'News expectation guidance': 'Think beyond the headline',
  })) {
    assert.ok(html.includes(token), 'Missing approved feature: ' + feature);
  }
});

test('development save key is isolated from production', () => {
  assert.match(html, /STORE='riskreward_v62_consolidated_qa'/);
  assert.doesNotMatch(html, /STORE='riskreward_v61_student_preview'/);
});

test('full market is deterministic for the same class code', () => {
  const first = engine.buildTape('9HASS-A');
  const second = engine.buildTape('9HASS-A');
  assert.equal(first.tape.length, 30);
  assert.equal(first.assets.length, 16);
  assert.equal(JSON.stringify(first.tape.map(cycle => cycle.close)), JSON.stringify(second.tape.map(cycle => cycle.close)));
  assert.equal(JSON.stringify(first.branches), JSON.stringify(second.branches));
});

test('reference economy retains the same four storyline branches', () => {
  const tape = engine.buildTape('9HASS-A');
  assert.equal(tape.branches.growth, 'C');
  assert.equal(tape.branches.rates, 'D');
  assert.equal(tape.branches.supply, 'D');
  assert.equal(tape.branches.downturn, 'A');
  assert.match(tape.tape[7].review.development, /Higher costs emerge before planned sales arrive/);
});

test('different classroom codes do not all have identical outcomes', () => {
  const a = engine.buildTape('9HASS-A');
  const b = engine.buildTape('9HASS-B');
  assert.notEqual(JSON.stringify(a.branches), JSON.stringify(b.branches));
  assert.notEqual(JSON.stringify(a.tape.map(cycle => cycle.close)), JSON.stringify(b.tape.map(cycle => cycle.close)));
});

test('prices remain positive and finite after each asset unlock', () => {
  for (const classCode of ['9HASS-A','9HASS-B','9HASS-C','DEMO-CLASS']) {
    const tape = engine.buildTape(classCode);
    for (let i = 0; i < tape.tape.length; i++) {
      for (const asset of data.stage1.assets) {
        const close = tape.tape[i].close[asset.id];
        if (i < (asset.unlock_year - 1) * 3) assert.equal(close, null);
        else assert.ok(Number.isFinite(close) && close > 0, classCode + ': ' + asset.id + ' cycle ' + (i + 1));
      }
    }
  }
});

test('the unrelated Year 3 Gold movement is not attributed to consumer news', () => {
  const d = engine.buildTape('9HASS-A').tape[7].decomposition.GOLD;
  assert.equal(d.forecastLogPct, 0);
  assert.equal(d.surpriseLogPct, 0);
  assert.ok(Number.isFinite(d.ordinaryLogPct));
});

test('the 16-asset model retains different asset risk profiles', () => {
  const a = Object.fromEntries(data.stage1.assets.map(x => [x.id, x]));
  assert.ok(a.TECH.annual_price_volatility_target_pct > a.ORBIT.annual_price_volatility_target_pct);
  assert.ok(a.RENEW.annual_price_volatility_target_pct > a.ENERGY.annual_price_volatility_target_pct);
  assert.ok(a.BOND.annual_price_volatility_target_pct < a.AUS.annual_price_volatility_target_pct);
  assert.equal(a.GOLD.income_yield_pa_pct, 0);
  assert.ok(a.BOND.income_yield_pa_pct > 0);
});
