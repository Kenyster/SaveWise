/* Used by intro.html, intro2.html and intro3.html (body has data-slide="1|2|3") */
(() => {
  const { pig, db, save } = SW;
  const SLIDES = [
    {
      cls: 'a1', h: 'Every peso', em: 'has a story.',
      p: 'Log what you spend in seconds and see where your allowance goes.',
      art: `<img src="images/intro-1.png" alt="" />`,
    },
    {
      cls: 'a2', h: 'Small goals,', em: 'big wins.',
      p: 'Save toward what matters, one peso at a time. Watch the piggy fill up.',
      art: `<img src="images/intro-2.png" alt="" />`,
    },
    {
      cls: 'a3', h: 'See your week', em: 'at a glance.',
      p: 'Clear charts show what you spend most on, so saving gets easier.',
      art: `<img src="images/intro-3.png" alt="" />`,
    },
  ];
  const idx = Math.max(0, Math.min(2, (Number(document.body.dataset.slide) || 1) - 1));
  const s = SLIDES[idx];
  const next = idx < 2 ? `intro${idx + 2}.html` : 'signup.html';

  SW.page({
    guest: true,
    render() {
      return `<main class="intro">
        <div class="top"><b><img src="images/logo-dark.png" alt="SaveWise" /></b><a href="signup.html" data-act="skipintro">Skip</a></div>
        <div class="art img ${s.cls}">${s.art}</div>
        <div class="copy">
          <div class="dots">${SLIDES.map((_, i) => `<i class="${i === idx ? 'on' : ''}"></i>`).join('')}</div>
          <h1>${s.h}<em>${s.em}</em></h1>
          <p>${s.p}</p>
          <div class="spacer"></div>
          <a class="btn" href="${next}" ${idx === 2 ? 'data-act="skipintro"' : ''}>${idx === 2 ? 'Get started' : 'Next'}</a>
          <a class="textbtn" href="signup.html" data-act="skipintro">Skip it for now</a>
        </div>
      </main>`;
    },
    actions: {
      skipintro() { db.intro = true; save(); },
    },
  });
})();
