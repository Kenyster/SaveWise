(() => {
  const { U, D, db, peso, ic, esc, parseMoney, newData, save, toast, render, spentWeek } = SW;

  SW.page({
    auth: true,
    nav: 'profile',
    render() {
      const u = U(), d = D();
      const sp = spentWeek();
      const pct = d.allowance ? Math.min(100, (sp / d.allowance) * 100) : 0;
      return `
        <div class="pt-title"><h1>Profile</h1><button class="round-btn only-m" data-act="logout" aria-label="Log out">${ic('logout')}</button></div>
        <div class="avatar-row"><div class="avatar">${esc(u.name.charAt(0).toUpperCase())}</div>
          <div><b>${esc(u.name)}</b><small>${esc(db.session)}</small></div></div>
        <div class="body flat" style="margin-top:16px">
          <div class="ticket s6">
            <div style="font-size:13px;opacity:.9">Weekly allowance</div>
            <div class="big">${peso(d.allowance)}</div>
            <div class="bar"><i style="width:${pct}%"></i></div>
            <div class="two"><span>${peso(sp)} spent</span><span>${peso(Math.max(0, d.allowance - sp))} left</span></div>
          </div>
          <form class="stack s6" data-form="profile" novalidate>
            <section class="card noh">
              <label class="lbl first">Name</label>
              <label class="field">${ic('user')}<input name="name" value="${esc(u.name)}" maxlength="40" /></label>
              <label class="lbl">Email</label>
              <label class="field">${ic('mail')}<input value="${esc(db.session)}" readonly /></label>
              <label class="lbl">Weekly allowance</label>
              <label class="field">${ic('peso')}<input name="allowance" inputmode="decimal" value="${d.allowance}" /></label>
            </section>
            <button class="btn" type="submit">Save changes</button>
            <button type="button" class="textbtn" data-act="reset">Reset all my data</button>
          </form>
        </div>`;
    },
    actions: {
      reset() {
        if (!confirm('This deletes all your expenses, goals and savings on this device. Continue?')) return;
        U().data = newData(); save(); render(); toast('Data reset');
      },
    },
    forms: {
      profile(f) {
        const name = f.name.value.trim();
        const allowance = parseMoney(f.allowance.value);
        if (!name) return toast('Name cannot be empty');
        if (!allowance) return toast('Enter a weekly allowance');
        U().name = name; D().allowance = allowance; save(); render(); toast('Changes saved');
      },
    },
  });
})();
