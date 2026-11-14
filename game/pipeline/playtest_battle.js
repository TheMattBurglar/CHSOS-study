// Headless phone-size playthrough of game/web/battle/ (bot guesses answers at random).
// Needs a server: (cd game/web && python3 -m http.server 8765), then:
//   NODE_PATH=<dir containing playwright> node game/pipeline/playtest_battle.js <screenshot dir>
// Prints which screen it ended on, story screens seen, and page errors.
const { chromium } = require('playwright');
(async () => {
  const SP = process.argv[2];
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/battle/index.html#fast');
  let shotM = 0, shotB = 0;
  const stories = [];
  const screen = () => p.evaluate(() => ['screen-story', 'screen-battle', 'screen-summary'].find(id => !document.getElementById(id).hidden));
  for (let i = 0; i < 3000; i++) {
    const vis = await screen();
    if (vis === 'screen-summary') break;
    if (vis === 'screen-story') { stories.push(await p.textContent('#story-place')); await p.click('#story-next'); await p.waitForTimeout(50); continue; }
    if (!(await p.isHidden('#sheet'))) {
      if (await p.isHidden('#q-result')) {
        const n = await p.$$eval('.opt', o => o.length);
        await p.click(`.opt >> nth=${Math.floor(Math.random() * n)}`);
      } else await p.click('#q-continue');
      await p.waitForTimeout(30); continue;
    }
    const busy = await p.$eval('#panel', el => el.children.length === 0);
    if (busy) { await p.waitForTimeout(60); continue; }
    const place = await p.textContent('#b-place');
    if (place.includes('MOULAGE') && !shotM++) await p.screenshot({ path: SP + '/shots/m.png' });
    if (place.includes('SERVER') && shotB++ === 8) await p.screenshot({ path: SP + '/shots/boss.png' });
    const all = await p.$('[data-allout]'); if (all) { await all.click(); continue; }
    const tgts = await p.$$('.targetable');
    if (tgts.length) {
      // What type is the pending action? Read it from the panel title.
      const title = await p.textContent('#panel .p-title');
      const type = /Re-route/.test(title) ? 'Tech' : /Make It Real/.test(title) ? 'Craft'
        : (title.match(/\((\w+)\)/) || [])[1] || null;
      const scores = await p.$$eval('.targetable', (els, type) => els.map(e => {
        if (!e.classList.contains('enemy')) return 0;
        const chip = type && [...e.querySelectorAll('.tk')].find(c => c.textContent.startsWith(type));
        const k = chip ? chip.className : '';
        return /absorb/.test(k) ? -10 : /resist/.test(k) ? -2 : /weak/.test(k) ? (e.classList.contains('down') ? 2 : 5) : 1;
      }), type);
      const best = scores.indexOf(Math.max(...scores));
      await tgts[best].click(); continue;
    }
    const ty = await p.$('[data-type]');
    if (ty) {
      const t = await p.$$eval('.enemy:not(.dead) .tk.weak', els => els.map(e => e.textContent.replace('WEAK', '').trim().toLowerCase())[0]);
      await p.click(t ? `[data-type=${t}]` : '[data-type]'); continue;
    }
    const acts = await p.$$('.act:not([disabled])');
    if (acts.length) { await acts[0].click(); continue; }
    await p.click('[data-endturn]');
  }
  const vis = await screen();
  await p.screenshot({ path: SP + '/shots/end.png', fullPage: true });
  console.log('end screen:', vis, 'stories:', stories, 'errors:', errs);
  await b.close();
})();
