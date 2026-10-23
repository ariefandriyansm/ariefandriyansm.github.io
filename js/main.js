/**
 * ARIEF ANDRIYAN — PORTFOLIO CLIENT LOGIC
 * High-performance Vanilla JS: Interactive Canvas, CLI Terminal, 3D Tilt, Theme & Filter
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCanvas();
  initSpotlight();
  initHeaderScroll();
  initMobileMenu();
  initStatsCounter();
  initStackFilter();
  initTerminal();
  initTiltEffect();
  initClipboard();
  initSmoothScroll();
});

/* ==========================================================================
   THEME SWITCHER
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('theme', nextTheme);
    });
  }
}

/* ==========================================================================
   INTERACTIVE CANVAS (PARTICLE CONSTELLATION)
   ========================================================================== */
function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 75);
  const mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.size = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse repulsion/interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2.5;
          this.y -= (dy / dist) * force * 2.5;
        }
      }
    }

    draw() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      ctx.fillStyle = isLight ? 'rgba(2, 132, 199, 0.4)' : 'rgba(56, 189, 248, 0.6)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const strokeColor = isLight ? '2, 132, 199' : '56, 189, 248';

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          const opacity = (1 - distance / 110) * 0.22;
          ctx.strokeStyle = `rgba(${strokeColor}, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   DYNAMIC MOUSE SPOTLIGHT
   ========================================================================== */
function initSpotlight() {
  const spotlight = document.querySelector('.cursor-spotlight');
  if (!spotlight) return;

  window.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
  });
}

/* ==========================================================================
   HEADER SCROLL & ACTIVE SPY
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Scroll spy
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   MOBILE MENU
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

/* ==========================================================================
   ANIMATED STATS COUNTER
   ========================================================================== */
function initStatsCounter() {
  const statElements = document.querySelectorAll('.stat-num[data-target]');
  if (!statElements.length) return;

  let started = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          statElements.forEach((el) => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1500;
            const start = 0;
            const startTime = performance.now();

            function updateCounter(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out quart
              const ease = 1 - Math.pow(1 - progress, 4);
              const currentVal = Math.floor(ease * (target - start) + start);
              el.innerHTML = `${currentVal}<span>${suffix}</span>`;

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                el.innerHTML = `${target}<span>${suffix}</span>`;
              }
            }
            requestAnimationFrame(updateCounter);
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) observer.observe(heroStats);
}

/* ==========================================================================
   TECH STACK FILTER TABS
   ========================================================================== */
function initStackFilter() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const techCards = document.querySelectorAll('.tech-card');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      techCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.25s ease';
          }, 10);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   INTERACTIVE DEVELOPER TERMINAL
   ========================================================================== */
function initTerminal() {
  const terminalInput = document.getElementById('term-input');
  const terminalBody = document.getElementById('term-body');
  const terminalHistory = document.getElementById('term-history');
  const hintSpans = document.querySelectorAll('.terminal-hint span');

  if (!terminalInput || !terminalBody || !terminalHistory) return;

  const commandDb = {
    help: `Available commands:
  • <span style="color:#38bdf8;">about</span>     : High-level overview of Arief Andriyan
  • <span style="color:#38bdf8;">skills</span>    : Core competencies & tech stack
  • <span style="color:#38bdf8;">projects</span>  : Featured architectural systems delivered
  • <span style="color:#38bdf8;">arch</span>      : Engineering philosophy & standards
  • <span style="color:#38bdf8;">contact</span>   : Get in touch & direct channels
  • <span style="color:#38bdf8;">sudo hire</span> : Execute priority hire protocol
  • <span style="color:#38bdf8;">clear</span>     : Wipe terminal output`,

    about: `Arief Andriyan — Senior Full-Stack Engineer & Solutions Architect.
Specializing in resilient distributed backends, .NET Core, cloud architectures (Azure/GCP/AWS),
and dynamic web/mobile frontends (React, React Native, TypeScript).
Based in Indonesia (GMT+7) with global enterprise-grade development experience.`,

    skills: `Backend    : .NET / C#, ASP.NET Core, Node.js, TypeScript, Laravel / PHP, Python, Go
Frontend   : React, React Native, Vite, Blazor, Next.js, Modern CSS, WebSockets
Cloud & Ops: Docker, Kubernetes, CI/CD, Azure, GCP, Nginx, Microservices, S3, Linux
Databases  : PostgreSQL, SQL Server, MySQL, Redis, Spanner, BigQuery, SQLite`,

    projects: `1. Enterprise GRC & Risk Treatment System (.NET, React, SQL Server, Docker)
2. Real-time Telematics & Fleet Tracking Hub (Node.js, WebSockets, Traccar, OSRM)
3. Disaster Management & Field Tracker (React Native, Offline Sync, Cloud Storage)
4. AI & MCP Tooling Integration Microservices (Node.js, Python, MCP Protocol)`,

    arch: `1. Clean Architecture & Domain-Driven Design (DDD)
2. Resilience: Circuit breakers, idempotency, automated health checks
3. 100/100 Lighthouse Performance & responsive accessibility
4. Containerized reproducibility (Docker everywhere)`,

    contact: `Email    : ariefandriyansm@gmail.com
GitHub   : https://github.com/ariefandriyansm
Status   : Open to exciting challenges, engineering leadership & high-impact contracts.`,

    'sudo hire': `<span style="color:#10b981;font-weight:bold;">[SUCCESS]</span> Authorization granted!
Welcome aboard! Let's build impactful software together.
Dropping an email to <a href="mailto:ariefandriyansm@gmail.com" style="color:#38bdf8;text-decoration:underline;">ariefandriyansm@gmail.com</a> now...`,

    matrix: `<span style="color:#10b981;">Wake up, Neo... Follow the white rabbit. 01000001 01010010 01001001 01000101 01000110</span>`,

    whoami: `guest@github.pages [role: explorer, permissions: read-only]`,

    date: new Date().toUTCString(),
  };

  function executeCmd(cmdText) {
    const trimmed = cmdText.trim().toLowerCase();
    if (!trimmed) return;

    if (trimmed === 'clear') {
      terminalHistory.innerHTML = '';
      terminalInput.value = '';
      return;
    }

    // Add command line
    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-command-line';
    cmdLine.innerHTML = `<span class="terminal-prompt">arief@portfolio:~$</span> <span class="terminal-command">${escapeHtml(cmdText)}</span>`;
    terminalHistory.appendChild(cmdLine);

    // Add response
    const responseLine = document.createElement('div');
    responseLine.className = 'terminal-response';

    if (commandDb[trimmed]) {
      responseLine.innerHTML = commandDb[trimmed].replace(/\n/g, '<br>');
    } else {
      responseLine.innerHTML = `command not found: <span style="color:#ef4444;">${escapeHtml(trimmed)}</span>. Type <span style="color:#38bdf8;">help</span> for list of commands.`;
    }

    terminalHistory.appendChild(responseLine);
    terminalInput.value = '';
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCmd(terminalInput.value);
    }
  });

  hintSpans.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        terminalInput.value = cmd;
        executeCmd(cmd);
      }
    });
  });

  // Focus terminal when clicking body
  terminalBody.addEventListener('click', () => {
    terminalInput.focus();
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ==========================================================================
   3D TILT EFFECT FOR AVATAR CARD
   ========================================================================== */
function initTiltEffect() {
  const card = document.querySelector('.avatar-card');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  });
}

/* ==========================================================================
   CLIPBOARD & TOAST
   ========================================================================== */
function initClipboard() {
  const copyBtns = document.querySelectorAll('[data-copy]');
  const toast = document.getElementById('toast');

  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied ${textToCopy} to clipboard!`);
      }).catch(() => {
        // Fallback
        showToast(`Selected ${textToCopy}`);
      });
    });
  });

  function showToast(msg) {
    if (!toast) return;
    const msgEl = toast.querySelector('.toast-msg');
    if (msgEl) msgEl.textContent = msg;

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
}

/* ==========================================================================
   SMOOTH SCROLLING & BACK TO TOP
   ========================================================================== */
function initSmoothScroll() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
