(() => {
  const { D, peso, ic, CATS, inWeek, leftWeek } = SW;

  SW.page({
    auth: true,
    nav: 'reports',
    render() {
      const wk = D().expenses.filter(inWeek);
      const total = wk.reduce((a, e) => a + e.amt, 0);
      const days = [0, 0, 0, 0, 0, 0, 0];
      wk.forEach((e) => { days[(new Date(e.date).getDay() + 6) % 7] += e.amt; });
      const max = Math.max(...days, 1);
      const todayIdx = (new Date().getDay() + 6) % 7;
      const names = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
      const by = CATS.map((c) => ({ ...c, v: wk.filter((e) => e.cat === c.n).reduce((a, e) => a + e.amt, 0) }));
      let acc = 0;
      const stops = total
        ? by.filter((c) => c.v > 0).map((c) => { const s = acc; acc += (c.v / total) * 100; return `${c.c} ${s}% ${acc}%`; }).join(',')
        : '#F4C3C5 0 100%';
      const top = [...by].sort((a, b) => b.v - a.v)[0];
      const insight = !total
        ? 'No spending yet this week. Great start!'
        : `${top.n} is ${Math.round((top.v / total) * 100)}% of your week.${top.n === 'Food' ? ' Pack baon?' : ''}`;
      const allow = D().allowance;
      return `
        <div class="rhead"><a class="round-btn" href="home.html" aria-label="Back">${ic('back')}</a>
          <div class="t"><b>This week</b><small>Mon - Sun</small></div><div class="round-btn" style="background:var(--red);color:#fff">${ic('chart')}</div></div>
        <div class="body flat">
          <div class="ticket">
            <div style="font-size:13px;opacity:.9">Total spent</div>
            <div class="big" data-count="${total}">${peso(total)}</div>
            <div class="bar"><i style="width:${allow ? Math.min(100, (total / allow) * 100) : 0}%"></i></div>
            <div class="two"><span>${peso(Math.max(0, leftWeek()))} left of ${peso(allow)}</span></div>
          </div>
          <div class="blk s6">
            <h2 class="section-title">By day</h2>
            <section class="card noh"><div class="bars">
              ${days.map((v, i) => `<div class="col ${i === todayIdx ? 'today' : ''}"><i style="height:${Math.max(4, (v / max) * 100)}%" title="${peso(v)}"></i>${names[i]}</div>`).join('')}
            </div></section>
          </div>
          <div class="blk s6">
            <h2 class="section-title">By category</h2>
            <section class="card noh"><div class="donutwrap">
              <div class="donut" style="background:conic-gradient(${stops})"><span><div>${peso(total)}<br><small>total</small></div></span></div>
              <div class="legend">${by.map((c) => `<div><i style="background:${c.c}"></i>${c.n}<b>${peso(c.v)}</b></div>`).join('')}</div>
            </div></section>
          </div>
          <div class="insight">${ic('spark')}${insight}</div>
        </div>`;
    },
  });
})();
