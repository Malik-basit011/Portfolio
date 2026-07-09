'use strict';

/* ============================================================
   TYPED TEXT
   ============================================================ */
(function initTyped() {
  const el = document.getElementById('typedText');
  if (!el) return;
  const phrases = ['AI / ML Developer','Deep Learning Engineer','NLP Enthusiast','BSAI Student','Generative AI Explorer'];
  let pi = 0, ci = 0, deleting = false, paused = false;
  function type() {
    if (paused) { paused = false; setTimeout(type, 1400); return; }
    const cur = phrases[pi];
    if (!deleting) {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { paused = true; deleting = true; setTimeout(type, 0); return; }
    } else {
      el.textContent = cur.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(type, deleting ? 45 : 85);
  }
  type();
})();

/* ============================================================
   READING PROGRESS BAR
   ============================================================ */
(function initProgress() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / total * 100) + '%';
  }, { passive: true });
})();

/* ============================================================
   NAVBAR — scroll style + active link
   ============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links  = document.querySelectorAll('.nav-link');
  const secs   = document.querySelectorAll('section[id]');
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    let cur = '';
    secs.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ============================================================
   MOBILE NAV
   ============================================================ */
(function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (!toggle || !menu) return;
  function close() { menu.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); }
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', close));
  document.addEventListener('click', e => { if (!toggle.contains(e.target) && !menu.contains(e.target)) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ============================================================
   BACK TO TOP
   ============================================================ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 500), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ============================================================
   THEME TOGGLE
   ============================================================ */
(function initTheme() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const saved = localStorage.getItem('theme');
  if (saved === 'light') document.body.classList.add('light-mode');
  btn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
  });
})();

/* ============================================================
   INTERSECTION OBSERVER — scroll reveal
   ============================================================ */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const sibs = entry.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      sibs.forEach((s, i) => { if (s === entry.target) delay = i * 80; });
      setTimeout(() => entry.target.classList.add('visible'), delay);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(i => obs.observe(i));
})();

/* ============================================================
   SKILL BARS
   ============================================================ */
(function initSkillBars() {
  const fills = document.querySelectorAll('.bar-fill');
  if (!fills.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.style.width = e.target.dataset.width + '%';
      obs.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  fills.forEach(f => obs.observe(f));
})();

/* ============================================================
   COUNTER ANIMATION — about stats
   ============================================================ */
(function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el      = entry.target;
      const target  = parseFloat(el.dataset.count);
      const decimal = parseInt(el.dataset.decimal || 0);
      const dur     = 1500;
      const step    = 16;
      const inc     = target / (dur / step);
      let cur = 0;
      const timer = setInterval(() => {
        cur += inc;
        if (cur >= target) { cur = target; clearInterval(timer); }
        el.textContent = decimal ? cur.toFixed(decimal) : Math.floor(cur);
      }, step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(e => obs.observe(e));
})();

/* ============================================================
   PARTICLE CANVAS
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.a  = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '110,231,247' : '167,139,250';
  }

  Particle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.a})`;
    ctx.fill();
  };

  function initP() {
    particles = [];
    const count = Math.floor((W * H) / 12000);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(110,231,247,${0.12 * (1 - dist/120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); initP(); }, { passive: true });
  resize(); initP(); loop();
})();

/* ============================================================
   PROJECT CARD TILT (desktop only)
   ============================================================ */
(function initTilt() {
  if (window.matchMedia('(max-width:768px)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  document.querySelectorAll('.project-card,.strength-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const rx = ((y - r.height/2) / r.height) * -8;
      const ry = ((x - r.width/2)  / r.width)  *  8;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
(function initScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ============================================================
   CONTACT FORM — Formspree
   ============================================================ */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const note = document.getElementById('formNote');
  function showNote(msg, type) { note.textContent = msg; note.className = 'form-note ' + type; }
  function validate(n, e, m) {
    if (!n.trim()) return 'Please enter your name.';
    if (!e.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return 'Please enter a valid email.';
    if (!m.trim() || m.trim().length < 10) return 'Message must be at least 10 characters.';
    return null;
  }
  form.addEventListener('submit', e => {
    e.preventDefault();
    const n = form.name.value, em = form.email.value, m = form.message.value;
    const err = validate(n, em, m);
    if (err) { showNote(err, 'error'); return; }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Sending…'; showNote('','');
    fetch('https://formspree.io/f/mnjkoqkw', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: n, email: em, message: m }),
    })
    .then(r => r.ok ? (showNote('Message sent! I\'ll get back to you soon.', 'success'), form.reset())
                    : r.json().then(d => showNote(d.errors?.[0]?.message || 'Something went wrong.','error')))
    .catch(() => showNote('Network error. Please try again.','error'))
    .finally(() => { btn.disabled = false; btn.textContent = 'Send Message'; });
  });
  ['name','email','message'].forEach(f => form[f]?.addEventListener('input', () => { if (note.classList.contains('error')) showNote('',''); }));
})();

/* ============================================================
   FOOTER YEAR
   ============================================================ */
(function() { const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear(); })();
