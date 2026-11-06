(() => {
  const { D, U, peso, ic, esc, pig, CHALLENGES, dayKey, leftWeek, totalSaved, spentToday, expRow, challengeCard } = SW;

  SW.page({
    auth: true,
    nav: 'home',
    render() {
      const d = D();
      const lf = leftWeek();
      const pct = d.allowance > 0 ? Math.max(0, Math.min(1, lf / d.allowance)) : 0;
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      const first = esc(U().name.split(' ')[0]);
      const k = dayKey(new Date());
      const ch = CHALLENGES.find((c) => (d.ch.prog[c.id] || {}).last !== k) || CHALLENGES[0];
      const recent = d.expenses.slice(0, 3);
      return `
        <header class="hero tall">
          <div class="small">${today}</div>
          <h1 class="hello">Hi, ${first}</h1>
          <div class="small" style="margin-top:10px">${lf < 0 ? 'Over your allowance by' : 'Left this week'}</div>
          <div class="big" data-count="${Math.abs(lf)}" ${lf < 0 ? 'data-neg="1"' : ''}>${lf < 0 ? '-' : ''}${peso(Math.abs(lf))}</div>
          <div class="hbar"><i style="width:${pct * 100}%"></i></div>
          <div class="small">of ${peso(d.allowance)} weekly allowance</div>
          ${pig('mascot')}
        </header>
        <div class="body">
          <section class="card s6">
            <div class="stats">
              <div class="stat"><small>Total saved</small><b data-count="${totalSaved()}">${peso(totalSaved())}</b></div>
              <div class="stat"><small>Spent today</small><b data-count="${spentToday()}">${peso(spentToday())}</b></div>
            </div>
          </section>
          <section class="card s6">
            <div class="cashrow">
              <div><small>Wallet balance</small><b>${peso(d.balance)}</b></div>
              <button class="btn auto" data-act="cashin">+ Cash in</button>
            </div>
            ${d.balance === 0 && !d.tx.length ? '<p class="hint">Your wallet starts at ₱0. Tap Cash in to add what you saved, then move it into a goal.</p>' : ''}
          </section>
          <section class="card quick">
            <a href="needwant.html"><span class="circ">${ic('shield', 26)}</span>Need or want</a>
            <a href="later.html"><span class="circ">${ic('clock', 26)}</span>Buy later</a>
            <a href="challenges.html"><span class="circ">${ic('trophy', 26)}</span>Challenges</a>
            <a href="reports.html"><span class="circ">${ic('chart', 26)}</span>Reports</a>
          </section>
          <div class="blk s6">
            <h2 class="section-title">Today's challenge</h2>
            ${challengeCard(ch)}
          </div>
          <div class="blk s6">
            <h2 class="section-title">Recent</h2>
            <section class="card tight noh">
              ${recent.length ? recent.map((e) => expRow(e)).join('') : '<div class="empty">No expenses yet. Tap + to add your first one.</div>'}
            </section>
          </div>
        </div>`;
    },
  });
})();
