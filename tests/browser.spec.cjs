const { test, expect } = require('@playwright/test');

test('the development game loads without script errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:4173/');
  await expect(page.locator('body')).toContainText('RISK');
  expect(errors).toEqual([]);
});

test('savings and term-deposit controls retain the approved order', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/');
  const result = await page.evaluate(() => {
    const root = document.createElement('div');
    root.innerHTML = window.eval('savings(findTeam())');
    const entry = root.querySelector('.rr61-term-entry');
    const choices = root.querySelector('.v61-term-grid');
    const bank = root.querySelector('.rr61-savings-amount-row');
    const shortcuts = entry?.querySelector('.v6-bank-extras');
    const termButtons = choices ? [...choices.querySelectorAll('button')] : [];
    return {
      termEntryBeforeCards: !!(entry && choices && entry.compareDocumentPosition(choices) & Node.DOCUMENT_POSITION_FOLLOWING),
      termAmountInEntry: !!entry?.querySelector('#term-amount'),
      termShortcuts: shortcuts ? [...shortcuts.querySelectorAll('button')].length : 0,
      termOpenButtons: termButtons.filter(b => b.textContent.trim() === 'Open').length,
      bankAmountBesideShortcuts: !!(bank?.querySelector('#bank-amount') && bank.querySelectorAll('button').length >= 2),
      redundantCashControl: !!root.querySelector('.savings-grid > div:first-child .v6-bank-extras'),
    };
  });
  expect(result).toMatchObject({
    termEntryBeforeCards: true,
    termAmountInEntry: true,
    termShortcuts: 3,
    termOpenButtons: 2,
    bankAmountBesideShortcuts: true,
    redundantCashControl: false,
  });
});

test('the landing screen has no horizontal overflow at supported widths', async ({ page }) => {
  for (const width of [390, 768, 1024, 1366]) {
    await page.setViewportSize({ width, height: 768 });
    await page.goto('http://127.0.0.1:4173/');
    const widthInfo = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(widthInfo.scroll, 'Overflow at width ' + width).toBeLessThanOrEqual(widthInfo.client + 2);
  }
});
