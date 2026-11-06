(() => {
  const { D, peso, ic, esc, hero, parseMoney, uid, save, toast, render, leftWeek, addExpense, $ } = SW;
  let nw = { name: '', price: '', type: 'want', why: '' };
  const reset = () => { nw = { name: '', price: '', type: 'want', why: '' }; };

  SW.page({
    auth: true,
    nav: 'needwant',
    render() {
      const after = leftWeek() - (parseMoney(nw.price) || 0);
      return `
        ${hero({ title: 'Need or<br>want?', back: true, img: 'images/needwant-pig.png', cls: 'nw' })}
        <div class="body">
          <section class="card s7 noh">
            <label class="lbl first">What is it?</label>
            <input class="input" id="nw-name" placeholder="e.g. Sneakers" value="${esc(nw.name)}" maxlength="40" autocomplete="off" />
            <label class="lbl">Price</label>
            <input class="input" id="nw-price" inputmode="decimal" placeholder="₱0" value="${esc(nw.price)}" autocomplete="off" />
            <label class="lbl">This is a</label>
            <div class="toggle2">
              <button type="button" data-act="nwtype" data-arg="need" class="${nw.type === 'need' ? 'on' : ''}">${ic('shield', 26)}Need</button>
              <button type="button" data-act="nwtype" data-arg="want" class="${nw.type === 'want' ? 'on' : ''}">${ic('bag', 26)}Want</button>
            </div>
            <label class="lbl">Why do you want it?</label>
            <textarea class="input" id="nw-why" placeholder="Be honest with yourself.">${esc(nw.why)}</textarea>
          </section>
          <div class="stack s5">
            <section class="card noh">
              <div class="sumrow"><span>Allowance left now</span><b>${peso(leftWeek())}</b></div>
              <div class="sumrow big"><span>After buying</span><b id="after" style="color:${after < 0 ? 'var(--red)' : 'inherit'}">${after < 0 ? '-' : ''}${peso(Math.abs(after))}</b></div>
            </section>
            ${nw.type === 'want'
              ? '<div class="warn">Pause for a second. Will you still want this tomorrow?</div>'
              : '<div class="warn good">Needs come first. If it is truly necessary, go ahead.</div>'}
            <button class="btn" data-act="nwlater">Buy later (wait 24 hours)</button>
            <button class="btn pink" data-act="nwbuy">Buy it now</button>
          </div>
        </div>`;
    },
    input(e) {
      const id = e.target.id;
      if (id === 'nw-name') nw.name = e.target.value;
      else if (id === 'nw-why') nw.why = e.target.value;
      else if (id === 'nw-price') {
        nw.price = e.target.value;
        const after = leftWeek() - (parseMoney(nw.price) || 0);
        const el = $('#after');
        if (el) { el.textContent = (after < 0 ? '-' : '') + peso(Math.abs(after)); el.style.color = after < 0 ? 'var(--red)' : 'inherit'; }
      }
    },
    actions: {
      nwtype(a) { nw.type = a; render(); },
      nwlater() {
        const price = parseMoney(nw.price);
        if (!nw.name.trim() || !price) return toast('Enter what it is and the price');
        D().later.unshift({ id: uid(), name: nw.name.trim(), price, type: nw.type, why: nw.why, created: new Date().toISOString(), status: 'waiting' });
        save(); reset();
        location.href = 'later.html?f=waiting';
      },
      nwbuy() {
        const price = parseMoney(nw.price);
        if (!nw.name.trim() || !price) return toast('Enter what it is and the price');
        addExpense(price, 'Shopping', nw.name.trim(), 'Cash');
        reset();
        location.href = 'home.html';
      },
    },
  });
})();
