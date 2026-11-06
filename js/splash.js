/* index.html: short splash, then go to the right page */
(() => {
  SW.page({
    render() {
      return `<div class="splash"><div class="logo"><img src="images/logo-white.png" alt="SaveWise" /></div></div>`;
    },
    init() {
      const go = SW.logged() ? 'home.html' : SW.db.intro ? 'login.html' : 'intro.html';
      setTimeout(() => location.replace(go), 1300);
    },
  });
})();
