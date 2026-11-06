/* SaveWise core - shared by every page.
   Each page file calls SW.page({...}) with its own render() function. */
(() => {
  'use strict';

  /* ---------- helpers ---------- */
  const $ = (s) => document.querySelector(s);
  const app = $('#app');
  const overlay = $('#overlay');
  const toastEl = $('#toast');

  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
  const peso = (n) => {
    n = Number(n) || 0;
    return '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
  };
  const parseMoney = (v) => {
    const n = parseFloat(String(v).replace(/,/g, ''));
    if (!isFinite(n) || n <= 0 || n > 10000000) return 0;
    return Math.round(n * 100) / 100;
  };
  const money2 = (n) => Math.round(n * 100) / 100;
  const sod = (d) => { d = new Date(d); d.setHours(0, 0, 0, 0); return d; };
  const dayKey = (d) => { d = new Date(d); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
  const shortDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const weekStart = () => { const d = sod(new Date()); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d; };

  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
  }

  /* ---------- icons + mascot ---------- */
  const P = {
    home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    trophy: '<path d="M8 4h8v6a4 4 0 0 1-8 0zM8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 14v4M8 21h8"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
    cup: '<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h2a2 2 0 0 1 0 4h-2"/>',
    bus: '<rect x="4" y="4" width="16" height="13" rx="2"/><path d="M4 11h16M8 21v-4M16 21v-4"/>',
    book: '<path d="M5 4h14v17H7a2 2 0 0 1-2-2zM9 8h6"/>',
    bag: '<path d="M5 8h14l-1 12H6zM9 8a3 3 0 0 1 6 0"/>',
    dots: '<path d="M5 12h.01M12 12h.01M19 12h.01"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    logout: '<path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    cash: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
    spark: '<path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z"/>',
    peso: '<path d="M8 20V4h5a4 4 0 0 1 0 8H8M5 8h10M5 11h10"/>',
  };
  const ic = (n, s = 22) =>
    `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;

  const pig = (cls = '') =>
    `<svg class="${cls}" viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M26 80 q-22 -6 -12 -30" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/>
      <ellipse cx="108" cy="92" rx="78" ry="54" fill="#fff"/>
      <polygon points="140,50 172,34 162,70" fill="#FF9EA1"/>
      <rect x="170" y="78" width="38" height="28" rx="14" fill="#FF9EA1"/>
      <circle cx="182" cy="92" r="3.5" fill="#8B0F1B"/><circle cx="196" cy="92" r="3.5" fill="#8B0F1B"/>
      <circle cx="152" cy="76" r="5" fill="#8B0F1B"/>
      <rect x="86" y="50" width="42" height="7" rx="3.5" fill="#8B0F1B"/>
      <circle cx="106" cy="26" r="16" fill="#FF9EA1" stroke="#fff" stroke-width="3"/>
      <text x="106" y="32" font-size="17" font-weight="800" text-anchor="middle" fill="#8B0F1B" font-family="Arial">₱</text>
      <rect x="62" y="132" width="24" height="24" rx="12" fill="#fff"/><rect x="128" y="132" width="24" height="24" rx="12" fill="#fff"/>
    </svg>`;

  const CATS = [
    { n: 'Food', i: 'cup', c: '#E0262F' },
    { n: 'Transport', i: 'bus', c: '#8B0F1B' },
    { n: 'School', i: 'book', c: '#FF9EA1' },
    { n: 'Shopping', i: 'bag', c: '#FF8A4C' },
    { n: 'Others', i: 'dots', c: '#F4C3C5' },
  ];
  const catIcon = (n) => (CATS.find((c) => c.n === n) || CATS[4]).i;

  const CHALLENGES = [
    { id: 'save20', title: 'Save ₱20 today', desc: 'Put a little aside, every day.', pts: 10, days: 1, icon: 'target', type: 'save' },
    { id: 'nospend3', title: 'No spending for 3 days', desc: 'Skip everything non-essential.', pts: 30, days: 3, icon: 'clock', type: 'nospend' },
    { id: 'nojunk7', title: 'No junk food for 7 days', desc: 'Water and home food only.', pts: 40, days: 7, icon: 'cup', type: 'honor' },
  ];

  /* ---------- storage (this device only) ---------- */
  const KEY = 'savewise_v1';
  const blank = () => ({ users: {}, session: null, intro: false });
  const load = () => {
    try { return Object.assign(blank(), JSON.parse(localStorage.getItem(KEY))); } catch (e) { return blank(); }
  };
  const db = load();
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { toast('Could not save - storage is full or blocked'); }
  };
  const newData = () => ({ allowance: 500, balance: 0, goals: [], expenses: [], later: [], tx: [], ch: { points: 0, prog: {} } });
  const logged = () => !!(db.session && db.users[db.session]);
  const U = () => db.users[db.session];
  const D = () => U().data;

  async function hash(str) {
    try {
      if (window.crypto && crypto.subtle) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
        return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
      }
    } catch (e) { /* fall through */ }
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    return 'x' + (h >>> 0).toString(16);
  }

  /* ---------- money calculations ---------- */
  const inWeek = (e) => new Date(e.date) >= weekStart();
  const isToday = (e) => dayKey(e.date) === dayKey(new Date());
  const spentWeek = () => D().expenses.filter(inWeek).reduce((a, e) => a + e.amt, 0);
  const spentToday = () => D().expenses.filter(isToday).reduce((a, e) => a + e.amt, 0);
  const leftWeek = () => D().allowance - spentWeek();
  const inGoals = () => D().goals.reduce((a, g) => a + g.saved, 0);
  const totalSaved = () => D().balance + inGoals();

  function addExpense(amt, cat, note, pay) {
    D().expenses.unshift({ id: uid(), amt, cat, note: note || cat, pay: pay || 'Cash', date: new Date().toISOString() });
    save();
  }
  function addTx(type, amt, note) {
    D().tx.unshift({ id: uid(), type, amt, note, date: new Date().toISOString() });
  }

  /* ---------- shared UI pieces ---------- */
  const hero = ({ title, sub = '', back = false, brand = false, mascot = true, img = '', extra = '', cls = '' }) => `
    <header class="hero ${cls}">
      ${back ? `<a class="back" href="home.html" aria-label="Back">${ic('back')}</a>` : ''}
      ${brand ? '<div class="brand"><img src="images/logo-white.png" alt="SaveWise" /></div>' : ''}
      <h1>${title}</h1>
      ${sub ? `<div class="sub">${sub}</div>` : ''}
      ${extra}
      ${mascot ? (img ? `<img class="mascot" src="${img}" alt="" />` : pig('mascot')) : ''}
    </header>`;

  const SIDE = [
    ['home', 'home.html', 'home', 'Home'],
    ['expenses', 'expenses.html', 'list', 'Expenses'],
    ['goals', 'goals.html', 'target', 'Savings goals'],
    ['needwant', 'needwant.html', 'shield', 'Need or want'],
    ['later', 'later.html', 'clock', 'Buy later'],
    ['challenges', 'challenges.html', 'trophy', 'Challenges'],
    ['reports', 'reports.html', 'chart', 'Reports'],
    ['profile', 'profile.html', 'user', 'Profile'],
  ];

  function shell(active, inner) {
    const u = U();
    const side = `<aside class="side" aria-label="Sidebar">
      <a class="logo" href="home.html">SaveWise<i class="dot"></i></a>
      ${SIDE.map(([k, href, icon, label], i) => `${i === 3 ? '<div class="sep"></div>' : ''}<a class="item ${k === active ? 'on' : ''}" href="${href}">${ic(icon)}${label}</a>`).join('')}
      <div class="grow"></div>
      <button class="btn sm" data-act="plus">+ Quick add</button>
      <div class="me"><div class="avatar sm">${esc(u.name.charAt(0).toUpperCase())}</div>
        <div class="who"><b>${esc(u.name)}</b><small>${esc(db.session)}</small></div>
        <button data-act="logout" aria-label="Log out">${ic('logout', 20)}</button></div>
    </aside>`;
    const bottom = `<nav class="nav" aria-label="Main">
      <a href="home.html" class="${active === 'home' ? 'on' : ''}">${ic('home')}Home</a>
      <a href="expenses.html" class="${active === 'expenses' ? 'on' : ''}">${ic('list')}Expenses</a>
      <button class="fab" data-act="plus" aria-label="Quick add">${ic('plus', 26)}</button>
      <a href="goals.html" class="${active === 'goals' ? 'on' : ''}">${ic('target')}Goals</a>
      <a href="profile.html" class="${active === 'profile' ? 'on' : ''}">${ic('user')}Profile</a>
    </nav>`;
    /* the nav is a sibling of the content (never inside an animated element) so it never jitters on scroll */
    return `<div class="shell">${side}<main class="content screen">${inner}</main></div>${bottom}`;
  }

  function expRow(e, withDel = false) {
    return `<div class="row">
      <div class="ico">${ic(catIcon(e.cat))}</div>
      <div class="t"><b>${esc(e.note)}</b><small>${esc(e.cat)}, ${shortDate(e.date)}${e.pay && e.pay !== 'Cash' ? ' · ' + esc(e.pay) : ''}</small></div>
      <div class="amt">${peso(e.amt)}</div>
      ${withDel ? `<button class="x" data-act="delexp" data-arg="${e.id}" aria-label="Delete">${ic('trash', 18)}</button>` : ''}
    </div>`;
  }

  function challengeCard(c) {
    const pr = D().ch.prog[c.id] || { days: 0, last: null };
    const doneToday = pr.last === dayKey(new Date());
    let label = c.days === 1 ? 'Do it now' : pr.days ? `Check in today (${pr.days}/${c.days})` : 'Start today';
    if (doneToday) label = c.days === 1 ? 'Done today ✓' : `Checked in ✓ (${pr.days}/${c.days})`;
    return `<section class="card">
      <div class="ch-head"><div class="ico lg" style="width:52px;height:52px">${ic(c.icon)}</div>
        <div class="t"><b>${c.title}</b><small>${c.desc}</small></div><span class="chip">+${c.pts}</span></div>
      ${c.days > 1 ? `<div class="bar" style="margin-bottom:12px"><i style="width:${(pr.days / c.days) * 100}%"></i></div>` : ''}
      <button class="btn" data-act="chdo" data-arg="${c.id}" ${doneToday ? 'disabled' : ''}>${label}</button>
    </section>`;
  }

  /* ---------- modal ---------- */
  let pendingAmount = null;
  function openModal(html) {
    overlay.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
    overlay.classList.remove('hidden');
    const f = overlay.querySelector('input');
    if (f && !f.readOnly) setTimeout(() => f.focus({ preventScroll: true }), 80);
  }
  function closeModal() {
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
    pendingAmount = null;
  }
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  function askAmount({ title, sub, quick = [50, 100, 200, 500], cta = 'Confirm', max, onOk }) {
    pendingAmount = { max, onOk };
    openModal(`<h3>${title}</h3>${sub ? `<p>${sub}</p>` : ''}
      <form data-form="amount" novalidate>
        <input class="amount" name="amt" inputmode="decimal" placeholder="₱0" autocomplete="off" />
        <div class="quickamts" style="margin:6px 0 14px">${quick.map((q) => `<button type="button" data-act="quickamt" data-arg="${q}">+${q}</button>`).join('')}</div>
        <button class="btn" type="submit">${cta}</button>
      </form>
      <button class="textbtn" data-act="closemodal">Cancel</button>`);
  }

  /* ---------- render engine ---------- */
  let current = null;
  let first = true;

  function render() {
    closeModal();
    const y = first ? 0 : window.scrollY;
    const inner = current.render();
    app.innerHTML = current.auth ? shell(current.nav, inner) : inner;
    window.scrollTo(0, y);
    first = false;
  }

  /* ---------- global actions ---------- */
  const actions = {
    closemodal: closeModal,
    togglepw() { const p = $('#pw'); if (p) p.type = p.type === 'password' ? 'text' : 'password'; },
    logout() { db.session = null; save(); location.href = 'login.html'; },

    plus() {
      openModal(`<h3>Quick add</h3>
        <a class="menuitem" href="expenses.html"><span class="ico">${ic('list')}</span><span>Add an expense<small>Log what you just spent</small></span></a>
        <button class="menuitem" data-act="m-cash"><span class="ico">${ic('cash')}</span><span>Cash in<small>Add money to your wallet</small></span></button>
        <a class="menuitem" href="needwant.html"><span class="ico">${ic('shield')}</span><span>Need or want?<small>Think before you buy</small></span></a>
        <button class="textbtn" data-act="closemodal">Close</button>`);
    },
    'm-cash': () => { closeModal(); actions.cashin(); },
    quickamt(a) {
      const i = overlay.querySelector('input[name="amt"]');
      if (i) i.value = money2((parseMoney(i.value) || 0) + Number(a));
    },

    cashin() {
      askAmount({
        title: 'Cash in', sub: 'How much are you adding to your wallet?', cta: 'Add to wallet',
        onOk(amt) {
          D().balance = money2(D().balance + amt);
          addTx('in', amt, 'Cash in');
          save(); closeModal(); render(); toast(peso(amt) + ' added to your wallet');
        },
      });
    },

    chdo(id) {
      const c = CHALLENGES.find((x) => x.id === id);
      const ch = D().ch;
      const today = dayKey(new Date());
      const pr = ch.prog[id] || { days: 0, last: null };
      if (pr.last === today) return;
      if (pr.last && pr.lastDate) {
        const gap = Math.round((sod(new Date()) - sod(new Date(pr.lastDate))) / 86400000);
        if (gap > 1) pr.days = 0;
      }
      const finish = () => {
        pr.days += 1; pr.last = today; pr.lastDate = new Date().toISOString();
        if (pr.days >= c.days) {
          ch.points += c.pts;
          if (c.days > 1) { delete ch.prog[id]; toast(`Challenge complete! +${c.pts} points 🎉`); }
          else { ch.prog[id] = { days: 0, last: today, lastDate: pr.lastDate }; toast(`+${c.pts} points!`); }
        } else { ch.prog[id] = pr; toast(`Day ${pr.days} done. Keep going!`); }
        save(); render();
      };
      if (c.type === 'nospend') {
        if (spentToday() > 0) return toast('You already spent today, so this day does not count');
        finish();
      } else if (c.type === 'save') {
        askAmount({
          title: 'Save ₱20 today', sub: 'This adds ₱20 to your wallet. Did you really set it aside?', quick: [], cta: 'Yes, I saved ₱20',
          onOk() {
            D().balance = money2(D().balance + 20); addTx('in', 20, 'Daily challenge');
            closeModal(); finish();
          },
        });
        const i = overlay.querySelector('input[name="amt"]');
        if (i) { i.value = 20; i.readOnly = true; }
      } else finish();
    },
  };
  const forms = {
    amount(f) {
      const amt = parseMoney(f.amt.value);
      if (!amt) return toast('Enter an amount');
      if (pendingAmount && pendingAmount.max && amt > pendingAmount.max) return toast('Not enough in your wallet');
      if (pendingAmount) pendingAmount.onOk(amt);
    },
  };

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-act]');
    if (!t) return;
    const fn = actions[t.dataset.act];
    if (fn) fn(t.dataset.arg, t, e);
  });
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('form[data-form]');
    if (!f) return;
    e.preventDefault();
    const fn = forms[f.dataset.form];
    if (fn) fn(f);
  });
  document.addEventListener('input', (e) => { if (current && current.input) current.input(e); });

  /* ---------- page start ---------- */
  function page(def) {
    if (def.auth && !logged()) { location.replace(db.intro ? 'login.html' : 'intro.html'); return; }
    if (def.guest && logged()) { location.replace('home.html'); return; }
    Object.assign(actions, def.actions || {});
    Object.assign(forms, def.forms || {});
    current = def;
    render();
    if (def.init) def.init();
  }

  window.SW = {
    $, esc, uid, peso, parseMoney, money2, sod, dayKey, shortDate, weekStart, toast, ic, pig, CATS, catIcon, CHALLENGES,
    db, save, newData, logged, U, D, hash, inWeek, isToday, spentWeek, spentToday, leftWeek, inGoals, totalSaved,
    addExpense, addTx, hero, expRow, challengeCard, openModal, closeModal, askAmount, render, page,
  };

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
