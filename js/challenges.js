(() => {
  const { D, hero, CHALLENGES, challengeCard } = SW;
  SW.page({
    auth: true,
    nav: 'challenges',
    render() {
      const pts = D().ch.points;
      return `
        ${hero({ title: 'Challenges', back: true, img: 'images/challenges-pig.png', extra: `<div class="small" style="margin-top:14px">Your points</div><div class="big md" data-count="${pts}">${pts}</div>` })}
        <div class="body"><div class="chgrid">${CHALLENGES.map((c) => challengeCard(c)).join('')}</div></div>`;
    },
  });
})();
