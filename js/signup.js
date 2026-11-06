(() => {
  const { ic, pig, db, save, hash, uid, newData, $ } = SW;

  SW.page({
    guest: true,
    render() {
      return `<main class="auth-split">
        <section class="auth-hero signup-hero">
          <div class="brand"><img src="images/logo-white.png" alt="SaveWise" /></div>
          <h1>Start with<br>one peso.</h1>
          ${pig('pig')}
        </section>
        <div class="auth-side signup">
          <div class="wrapform">
            <div class="topbar"><a class="round" href="login.html" aria-label="Back">${ic('back')}</a><b><img src="images/logo-red.png" alt="SaveWise" /></b></div>
            <div class="hd"><h1><span>Start with</span><em>one peso.</em></h1>${pig('')}</div>
            <h2 class="only-d">Create your <em>account</em></h2>
            <p class="sub">Takes less than a minute.</p>
            <form data-form="signup" novalidate>
              <label class="lbl">Name</label>
              <label class="field white">${ic('user')}<input name="name" placeholder="Your name" autocomplete="name" required /></label>
              <label class="lbl">Email</label>
              <label class="field white">${ic('mail')}<input name="email" type="email" placeholder="you@gmail.com" autocomplete="email" required /></label>
              <label class="lbl">Password</label>
              <label class="field white">${ic('lock')}<input name="password" type="password" placeholder="At least 8 characters" autocomplete="new-password" required /></label>
              <label class="lbl">Confirm password</label>
              <label class="field white">${ic('lock')}<input name="confirm" type="password" placeholder="Repeat password" autocomplete="new-password" required /></label>
              <div class="err" id="err"></div>
              <button class="btn" type="submit">Create account</button>
              <p class="center note">Your first goal can be as small as ₱1</p>
              <p class="center note">Already have an account? <a class="link" href="login.html">Log in</a></p>
            </form>
          </div>
        </div>
      </main>`;
    },
    forms: {
      async signup(f) {
        const name = f.name.value.trim();
        const email = f.email.value.trim().toLowerCase();
        const pw = f.password.value;
        const err = $('#err');
        if (!name) return (err.textContent = 'Please enter your name.');
        if (!/^\S+@\S+\.\S+$/.test(email)) return (err.textContent = 'Enter a valid email.');
        if (pw.length < 8) return (err.textContent = 'Password needs at least 8 characters.');
        if (pw !== f.confirm.value) return (err.textContent = 'Passwords do not match.');
        if (db.users[email]) return (err.textContent = 'That email already has an account. Try logging in.');
        const salt = uid();
        db.users[email] = { name, salt, pass: await hash(salt + pw), data: newData() };
        db.session = email; db.intro = true; save();
        location.href = 'home.html';
      },
    },
  });
})();
