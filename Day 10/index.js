

tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        fontFamily: {
          display: ['Syne', 'sans-serif'],
          body: ['Inter', 'sans-serif'],
          mono: ['JetBrains Mono', 'monospace'],
        },
        colors: {
          space: { 950: '#040710', 900: '#080B14', 800: '#0D1220', 700: '#0F1628', 600: '#131C35' },
          purple: { 400: '#A78BFA', 500: '#8B5CF6', 600: '#7C3AED' },
          cyan: { 400: '#22D3EE', 500: '#06B6D4', 600: '#0891B2' },
        },
        animation: {
          'fade-up': 'fadeUp 0.7s ease forwards',
          'blink': 'blink 1s step-end infinite',
          'float': 'float 6s ease-in-out infinite',
          'shimmer': 'shimmer 2.5s linear infinite',
          'spin-slow': 'spin 8s linear infinite',
        },
        keyframes: {
          fadeUp: { '0%': { opacity: '0', transform: 'translateY(30px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
          blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
          float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
          shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        },
      }
    }
  }

// ===== THEME TOGGLE =====
  const html = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const iconMoon = document.getElementById('icon-moon');
  const iconSun = document.getElementById('icon-sun');

  function setTheme(dark) {
    if (dark) {
      html.classList.add('dark');
      html.classList.remove('light');
      iconMoon.classList.remove('hidden');
      iconSun.classList.add('hidden');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
      iconMoon.classList.add('hidden');
      iconSun.classList.remove('hidden');
    }
  }

  themeBtn.addEventListener('click', () => {
    const isDark = html.classList.contains('dark');
    setTheme(!isDark);
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  });

  const saved = localStorage.getItem('theme');
  setTheme(saved !== 'light');

  // ===== MOBILE MENU =====
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  // ===== PARTICLE CANVAS =====
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };
  let animId;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.15;
      this.color = Math.random() > 0.5 ? '139,92,246' : '6,182,212';
    }
    update() {
      if (mouse.x) {
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          this.vx += dx / dist * 0.06;
          this.vy += dy / dist * 0.06;
        }
      }
      this.x += this.vx; this.y += this.vy;
      this.vx *= 0.99; this.vy *= 0.99;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          const alpha = (1 - dist / 100) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139,92,246,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); initParticles(); });
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  resize();
  initParticles();
  animate();

  // ===== TYPING ANIMATION =====
  const phrases = [
    'Python Developer',
    'Data Analyst',
    'GenAI Learner',
    'ML Enthusiast',
    'Flask Developer',
    'Problem Solver',
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;
  const typedEl = document.getElementById('typed-text');

  function type() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      typedEl.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
    }
    setTimeout(type, deleting ? 45 : 80);
  }
  setTimeout(type, 600);

  // ===== SCROLL REVEAL =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    // Stagger siblings
    const siblings = el.parentElement.querySelectorAll('.reveal');
    let idx = Array.from(siblings).indexOf(el);
    el.dataset.delay = idx * 80;
    observer.observe(el);
  });

  // ===== PROGRESS BAR ANIMATION =====
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.progress-fill').forEach(bar => {
          bar.style.width = bar.dataset.target + '%';
        });
        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.glass').forEach(el => {
    if (el.querySelector('.progress-fill')) progressObserver.observe(el);
  });

  // Trigger hero reveals immediately
  document.querySelectorAll('#hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 120);
  });

