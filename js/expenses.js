(() => {
  const { D, peso, ic, hero, CATS, parseMoney, addExpense, expRow, save, toast, spentWeek, render } = SW;
  let selCat = 'Food';

  SW.page({
    auth: true,
    nav: 'expenses',
    render() {
      const d = D();
      return `
        ${hero({ title: 'Expenses', sub: 'Total logged: ' + peso(spentWeek()) + ' this week', brand: true, img: 'images/expenses-pig.png' })}
        <div class="body">
          <form class="card s6" data-form="expense" novalidate>
            <b>How much?</b>
            <input class="amount" name="amt" inputmode="decimal" placeholder="₱0.00" autocomplete="off" />
            <b style="display:block;margin:8px 0">Category</b>
            <div class="cats" id="cats">${CATS.map((c) => `<button type="button" class="cat ${c.n === selCat ? 'on' : ''}" data-act="cat" data-arg="${c.n}">${ic(c.i, 16)}${c.n}</button>`).join('')}</div>
            <label class="lbl">Note (optional)</label>
            <input class="input" name="note" maxlength="40" autocomplete="off" />
            <label class="lbl">Payment method</label>
            <select class="select input" name="pay"><option>Cash</option><option>GCash</option><option>Maya</option><option>Card</option><option>Other</option></select>
            <button class="btn" style="margin-top:18px" type="submit">Add expense</button>
          </form>
          <div class="blk s6">
            <h2 class="section-title">History</h2>
            <section class="card tight noh">
              ${d.expenses.length ? d.expenses.slice(0, 40).map((e) => expRow(e, true)).join('') : '<div class="empty">Nothing logged yet.</div>'}
            </section>
          </div>
        </div>`;
    },
    actions: {
      cat(a, el) {
        selCat = a;
        document.querySelectorAll('#cats .cat').forEach((b) => b.classList.toggle('on', b === el));
      },
      delexp(id) {
        D().expenses = D().expenses.filter((e) => e.id !== id);
        save(); render(); toast('Expense deleted');
      },
    },
    forms: {
      expense(f) {
        const amt = parseMoney(f.amt.value);
        if (!amt) return toast('Enter how much you spent');
        addExpense(amt, selCat, f.note.value.trim(), f.pay.value);
        render(); toast(peso(amt) + ' added');
      },
    },
  });
})();
