// SmartBuy AI site. Real results from SmartBuy checks on AliExpress listings, run 22 Oct 2026.
(function () {
  'use strict';

  const RESULTS = [
    { img: 'smartwatch', key: ['kids smartwatch', 'smartwatch', 'watch', 'smart watch'],
      title: '2026 Series 10 GPS Smart Watch, Bluetooth Call, Heart Rate, NFC',
      stars: 5.0, reviews: 693, trust: 28, risk: 'High', verdict: 'Proceed with Caution', tone: 'warn',
      flag: 'A perfect 5.0 across 693 reviews, with no criticism at all, is statistically unlikely.' },
    { img: 'phonecase', key: ['phone case', 'case', 'iphone case', 'cover'],
      title: 'Silicone Soft Phone Case for iPhone 16 / 15 / 14, Candy Color',
      stars: 4.8, reviews: 144, trust: 62, risk: 'Medium', verdict: 'Proceed with Caution', tone: 'mid',
      flag: 'Generic praise and only one critical review among 144.' },
    { img: 'dress', key: ['summer dress', 'dress', 'polka dot dress'],
      title: 'Polka Dot Halter Summer Dress, Retro Pin-Up Style',
      stars: 4.8, reviews: 61, trust: 72, risk: 'Medium', verdict: 'Recommended', tone: 'mid',
      flag: 'Buyers say it runs long and may need trimming.' },
    { img: 'earbuds', key: ['wireless earbuds', 'earbuds', 'headphones', 'earphones'],
      title: 'Air Pro True Wireless Bluetooth Earbuds, ANC, Low Latency',
      stars: 4.3, reviews: 593, trust: 42, risk: 'High', verdict: 'Proceed with Caution', tone: 'warn',
      flag: 'One buyer reports the battery died after 10 minutes of use.' },
    { img: 'ledstrip', key: ['led strip lights', 'led strip', 'led', 'lights', 'strip'],
      title: '5 m USB LED Strip Light, 5 V, Warm and Cool White',
      stars: 5.0, reviews: 91, trust: 45, risk: 'High', verdict: 'Proceed with Caution', tone: 'warn',
      flag: 'All 91 reviews are five stars with near-identical wording.' }
  ];

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---------- hero reel: scroll moves the strip through the sentence ----------
  const track = document.getElementById('reel-track');
  const hero = document.querySelector('.hero');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (track && hero && !reduceMotion) {
    const frames = track.children.length;
    const onScroll = () => {
      if (innerWidth <= 720) { track.style.transform = ''; return; }
      const total = hero.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / Math.max(1, total)));
      const frame = track.firstElementChild;
      const step = frame.offsetHeight + 24;
      track.style.transform = `translateY(${-p * step * (frames - 1)}px)`;
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    onScroll();
  }

  // ---------- showcase: the typed headline ----------
  const input = document.getElementById('query');
  const answer = document.getElementById('answer');
  function find(q) {
    q = q.trim().toLowerCase();
    if (!q) return null;
    return RESULTS.find((r) => r.key.some((k) => q.includes(k) || k.includes(q))) || null;
  }
  function render() {
    const r = find(input.value);
    if (r) {
      answer.innerHTML = `
        <div class="answer-row tone-${r.tone}">
          <figure class="answer-shot"><img src="assets/shots/panel-${r.img}.webp" width="760" height="2100" alt="SmartBuy panel for this product: ${esc(r.verdict)}, trust ${r.trust}"></figure>
          <div class="answer-copy">
          <p class="answer-title">${esc(r.title)}</p>
          <p class="answer-line"><span>AliExpress says <strong>${r.stars.toFixed(1)} stars</strong></span><span>SmartBuy says <strong>trust ${r.trust}/100</strong></span><span>Fake-review risk <strong>${esc(r.risk)}</strong></span></p>
          <p class="answer-verdict">${esc(r.verdict)}. ${esc(r.flag)}</p>
          </div>
        </div>`;
    } else {
      answer.innerHTML = `<div class="answer-row"><p class="answer-title">We have not checked that one here.</p><p class="answer-verdict">Install SmartBuy AI, open the product on AliExpress and press “Check reviews”. It takes about ten seconds.</p></div>`;
    }
  }
  if (input && answer) {
    input.addEventListener('input', render);
    document.querySelectorAll('.examples button').forEach((b) =>
      b.addEventListener('click', () => { input.value = b.dataset.q; render(); input.focus(); })
    );
    render();
  }

  // ---------- how it works: the slider ----------
  const STAGES = [
    { clause: 'Open a product page.', note: 'Any listing on aliexpress.com. Nothing to sign up for.', ui: () => `
        <div class="mock-page"><p class="mock-title">2026 Series 10 GPS Smart Watch</p><p class="mock-stars">5.0 stars · 693 reviews</p><p class="mock-note">Bluetooth call · Heart rate · NFC</p></div>` },
    { clause: 'Press “Check reviews”.', note: 'The button sits at the bottom right of the product page.', ui: () => `
        <div class="mock-page"><p class="mock-title">2026 Series 10 GPS Smart Watch</p><p class="mock-stars">5.0 stars · 693 reviews</p><img class="mock-launch is-pressed" src="assets/shots/launcher.webp" width="320" height="88" alt="The SmartBuy “Check reviews” button"></div>` },
    { clause: 'It reads twenty reviews.', note: 'The newest ones, translated, with their stars.', ui: () => `
        <ul class="mock-reviews">
          <li><span>5 stars</span> “Very beautiful clock. I arrived super fast…”</li>
          <li><span>5 stars</span> “Very good quality for the price of the product…”</li>
          <li><span>5 stars</span> “I recently received my smartwatch from AliExpress…”</li>
          <li><span>5 stars</span> “A real madness. The clock is perfect…”</li>
        </ul>` },
    { clause: 'You get the verdict.', note: 'Trust score, fake-review risk, pros, cons and red flags.', ui: () => `<figure class="stage-shot"><img src="assets/shots/panel-smartwatch.webp" width="760" height="2186" alt="SmartBuy verdict panel: Proceed with Caution, trust score 28"></figure>` }
  ];
  const range = document.getElementById('stage');
  const clause = document.getElementById('how-title');
  const note = document.getElementById('how-note');
  const stageUi = document.getElementById('stage-ui');
  const names = document.querySelectorAll('.stage-names li');
  function setStage(i) {
    const s = STAGES[i];
    [clause, note, stageUi].forEach((el) => el.classList.add('is-swapping'));
    setTimeout(() => {
      clause.textContent = s.clause; note.textContent = s.note; stageUi.innerHTML = s.ui();
      [clause, note, stageUi].forEach((el) => el.classList.remove('is-swapping'));
    }, 120);
    names.forEach((n) => n.classList.toggle('is-on', +n.dataset.s === i));
    range.parentElement.style.setProperty('--p', i / 3);
  }
  if (range) {
    range.addEventListener('input', () => setStage(+range.value));
    names.forEach((n) => n.addEventListener('click', () => { range.value = n.dataset.s; setStage(+n.dataset.s); }));
    stageUi.innerHTML = STAGES[0].ui();
    setStage(0);
  }

  // ---------- section entrances ----------
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.querySelectorAll('[data-rise]').forEach((el, i) => {
          el.style.transitionDelay = i * 80 + 'ms';
          el.classList.add('is-in');
        });
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('main > section, .foot').forEach((sec) => {
      sec.querySelectorAll('h2:not(.vh), h3, p, .typeline, .answer, .examples, .stage-ui, .how-slider, .faq-a, .btn, .foot-links').forEach((el) => el.setAttribute('data-rise', ''));
      io.observe(sec);
    });
  } else {
    document.querySelectorAll('[data-rise]').forEach((el) => el.classList.add('is-in'));
  }
})();
