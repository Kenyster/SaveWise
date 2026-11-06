(() => {
  const { D, peso, ic, esc, hero, save, toast, render, addExpense } = SW;
  const q = new URLSearchParams(location.search).get('f');
  let filter = ['all', 'waiting', 'bought', 'skipped'].includes(q) ? q : 'all';
  const hoursLeft = (it) => Math.ceil(24 - (Date.now() - new Date(it.created).getTime()) / 3600000);

  SW.page({
    auth: true,
    nav: 'later',
    render() {
      const d = D();
      const skipped = d.later.filter((i) => i.status === 'skipped').reduce((a, i) => a + i.price, 0);
      const list = d.later.filter((i) => filter === 'all' || i.status === filter);
      const tabs = [['all', 'All'], ['waiting', 'Waiting'], ['bought', 'Bought'], ['skipped', 'Skipped']];
      return `
        ${hero({
          title: 'Buy later', back: true, img: 'images/later-pig.png',
          extra: `<div class="small" style="margin-top:10px">Skipped so far</div><div class="big md" data-count="${skipped}">${peso(skipped)}</div>
            <div class="filters">${tabs.map(([k, n]) => `<button data-act="lfilter" data-arg="${k}" class="${filter === k ? 'on' : ''}">${n}</button>`).join('')}</div>`,
        })}
        <div class="body" style="margin-top:-36px">
          <div class="latergrid">
          ${list.length ? list.map((it) => {
            const h = hoursLeft(it);
            const chip = it.status === 'waiting' ? (h > 0 ? `${h} hour${h === 1 ? '' : 's'} to think` : 'Time is up - decide now') : it.status === 'bought' ? 'Bought' : 'Decided not to buy';
            return `<section class="card">
              <div class="row" style="padding:0"><div class="ico lg">${ic('clock')}</div>
                <div class="t"><b>${esc(it.name)}</b><span class="chip">${chip}</span></div><div class="amt">${peso(it.price)}</div></div>
              ${it.status === 'waiting' ? `<div class="later-actions"><button class="btn soft" data-act="lbought" data-arg="${it.id}">I bought it</button><button class="btn" data-act="lskip" data-arg="${it.id}">Skip it</button></div>` : ''}
            </section>`;
          }).join('') : '<section class="card"><div class="empty">Nothing here yet. Use <a class="link" href="needwant.html">Need or want?</a> and pick Buy later.</div></section>'}
          </div>
        </div>`;
    },
    actions: {
      lfilter(a) { filter = a; render(); },
      lbought(id) {
        const it = D().later.find((x) => x.id === id);
        if (!it) return;
        it.status = 'bought';
        addExpense(it.price, 'Shopping', it.name, 'Cash');
        save(); render(); toast('Added to your expenses');
      },
      lskip(id) {
        const it = D().later.find((x) => x.id === id);
        if (!it) return;
        it.status = 'skipped'; save(); render(); toast('Nice! You kept ' + peso(it.price));
      },
    },
  });
})();
