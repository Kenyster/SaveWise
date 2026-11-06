(() => {
  const { ic, pig, db, save, hash, $ } = SW;

  SW.page({
    guest: true,
    render() {
      return `<main class="auth-split">
        <section class="auth-hero">
          <div class="brand"><img src="images/logo-white.png" alt="SaveWise" /></div>
          <h1>Small savings.<br>Better future.</h1>
          ${pig('pig')}
        </section>
        <div class="auth-side">
          <form class="sheet-card" data-form="login" autocomplete="on" novalidate>
            <div><h2>Welcome back</h2></div>
            <p class="s">Log in to see how savings are growing</p>
            <label class="field">${ic('mail')}<input name="email" type="email" placeholder="Email" autocomplete="email" required /></label>
            <label class="field">${ic('lock')}<input name="password" id="pw" type="password" placeholder="Password" autocomplete="current-password" required />
              <button type="button" data-act="togglepw" aria-label="Show password">${ic('eye')}</button></label>
            <div class="err" id="err"></div>
            <button class="btn" type="submit">Log in</button>
            <div class="center">New here? <a class="link" href="signup.html">Create an account</a></div>
          </form>
        </div>
      </main>`;
    },
    forms: {
      async login(f) {
        const email = f.email.value.trim().toLowerCase();
        const pw = f.password.value;
        const err = $('#err');
        const u = db.users[email];
        if (!email || !pw) { err.textContent = 'Enter your email and password.'; return; }
        if (!u || u.pass !== (await hash(u.salt + pw))) { err.textContent = 'Wrong email or password.'; return; }
        db.session = email; save(); location.href = 'home.html';
      },
    },
  });
})();
