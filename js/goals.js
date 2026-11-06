(() => {
  const { D, peso, ic, esc, hero, shortDate, parseMoney, money2, uid, save, toast, render, askAmount, closeModal, addTx, inGoals } = SW;

  const goalCard = (g) => {
    const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
    return `<section class="card goal">
      <div class="top">
        <div class="ico lg">${ic(g.icon || 'target')}</div>
        <div class="nm"><b>${esc(g.name)}</b><small>${peso(g.saved)} of ${peso(g.target)}</small></div>
        <div class="pct">${pct}%</div>
      </div>
      <div class="bar"><i style="width:${pct}%"></i></div>
      <button class="btn soft" data-act="addsave" data-arg="${g.id}">${pct >= 100 ? 'Goal reached! Add more' : 'Add savings'}</button>
      <button class="textbtn" style="padding:8px 0 0" data-act="delgoal" data-arg="${g.id}">Delete goal</button>
    </section>`;
  };

  SW.page({
    auth: true,
    nav: 'goals',
    render() {
      const d = D();
      return `
        ${hero({ title: 'Savings<br>goals', sub: 'Small savings add up.', brand: true, img: 'images/goals-pig.png' })}
        <div class="body">
          <section class="card">
            <div class="stats">
              <div class="stat"><small>Wallet balance</small><b>${peso(d.balance)}</b></div>
              <div class="stat"><small>In goals</small><b>${peso(inGoals())}</b></div>
            </div>
            <button class="btn soft sm" style="margin-top:14px" data-act="cashin">+ Cash in to wallet</button>
          </section>
          <div class="gl">
            ${d.goals.length ? d.goals.map(goalCard).join('') : '<section class="card"><div class="empty">No goals yet. Create your first one below. It can be as small as ₱1!</div></section>'}
          </div>
          <div class="blk s6">
            <h2 class="section-title">New goal</h2>
            <form class="card" data-form="goal" novalidate>
              <label class="lbl first">What are you saving for?</label>
              <input class="input" name="name" maxlength="30" placeholder="e.g. New phone" autocomplete="off" />
              <label class="lbl">Target amount</label>
              <input class="input" name="target" inputmode="decimal" placeholder="₱0" autocomplete="off" />
              <button class="btn" style="margin-top:18px" type="submit">Create goal</button>
            </form>
          </div>
          <div class="blk s6">
            <h2 class="section-title">Savings history</h2>
            <section class="card tight noh">
              ${d.tx.length ? d.tx.slice(0, 30).map((t) => `<div class="row">
                <div class="ico">${ic(t.type === 'in' ? 'cash' : 'target')}</div>
                <div class="t"><b style="font-size:16px">${esc(t.note)}</b><small>${shortDate(t.date)}</small></div>
                <div class="amt" style="color:${t.type === 'in' ? '#1c7a34' : 'var(--ink)'}">${t.type === 'in' ? '+' : ''}${peso(t.amt)}</div></div>`).join('')
                : '<div class="empty">Your cash-ins and goal savings will show up here.</div>'}
            </section>
          </div>
        </div>`;
    },
    actions: {
      addsave(id) {
        const g = D().goals.find((x) => x.id === id);
        if (!g) return;
        if (D().balance <= 0) { toast('Your wallet is empty. Cash in first!'); return; }
        askAmount({
          title: 'Add to ' + esc(g.name), sub: `Wallet balance: ${peso(D().balance)}`, cta: 'Add savings', max: D().balance,
          quick: [20, 50, 100, 500].filter((q) => q <= D().balance),
          onOk(amt) {
            g.saved = money2(g.saved + amt);
            D().balance = money2(D().balance - amt);
            addTx('goal', amt, 'Saved to ' + g.name);
            save(); closeModal(); render();
            toast(g.saved >= g.target ? 'Goal reached! 🎉' : peso(amt) + ' saved');
          },
        });
      },
      delgoal(id) {
        const g = D().goals.find((x) => x.id === id);
        if (!g) return;
        if (!confirm(`Delete "${g.name}"? ${peso(g.saved)} will go back to your wallet.`)) return;
        D().balance = money2(D().balance + g.saved);
        D().goals = D().goals.filter((x) => x.id !== id);
        save(); render(); toast('Goal deleted');
      },
    },
    forms: {
      goal(f) {
        const name = f.name.value.trim();
        const target = parseMoney(f.target.value);
        if (!name) return toast('What are you saving for?');
        if (!target) return toast('Enter a target amount');
        D().goals.unshift({ id: uid(), name, target, saved: 0, icon: 'target' });
        save(); render(); toast('Goal created!');
      },
    },
  });
})();
