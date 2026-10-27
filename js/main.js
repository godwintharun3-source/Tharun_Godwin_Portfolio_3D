/**
 * THARUN GODWIN .C - PORTFOLIO INTERACTION ENGINE
 * Features:
 * - 3-Way Theme Switcher (Auto, Dark, Light)
 * - Opening Cyber Boot Sequence Animation
 * - 3D Interactive Cyber Playing Cards Deck (Fan, Stack, Grid, Deal, Shuffle, Flip, 3D Gyro Tilt, Holographic Foil)
 * - Web Audio API Synthetic Cyber Haptics
 * - Dynamic Background Canvas Particles
 * - Certificate & Event Photo Lightbox
 * - Skill Filter Matrix & Interactive Elements
 * - Clipboard Copy & Contact Handling
 * - Scroll Reveal Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initBootSequence();
  initThemeEngine();
  initAudioEngine();
  initPlayingCardsDeck();
  initCyberCanvas();
  initLightboxModal();
  initSkillsFilter();
  initContactAndClipboard();
  initNavigation();
  initScrollAnimations();
  initHeroGateways();
  initFloatingRobotCompanion();
  initGlobeDossier();
});

/* ==========================================================================
   1. OPENING CYBER BOOT SEQUENCE
   ========================================================================== */
function initBootSequence() {
  const bootScreen = document.getElementById('boot-screen');
  const skipBtn = document.getElementById('btn-skip-boot');
  if (!bootScreen) return;

  function dismissBoot() {
    bootScreen.classList.add('fade-out');
    setTimeout(() => {
      bootScreen.style.display = 'none';
      if (window.playSynthSound) window.playSynthSound('blip', 800, 0.15);
    }, 450);
  }

  // If user navigated directly to an anchor hash, dismiss immediately
  if (window.location.hash) {
    bootScreen.style.display = 'none';
    return;
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', dismissBoot);
  }

  bootScreen.addEventListener('click', dismissBoot);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') dismissBoot();
  });

  setTimeout(dismissBoot, 1800);
}

/* ==========================================================================
   2. 3-WAY THEME CONTROLLER (Auto, Dark, Light)
   ========================================================================== */
function initThemeEngine() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeLabel = document.getElementById('theme-toggle-label');
  const themeIcon = document.getElementById('theme-toggle-icon');

  let currentThemeMode = localStorage.getItem('tg_theme_mode') || 'auto';

  function applyTheme(mode) {
    currentThemeMode = mode;
    localStorage.setItem('tg_theme_mode', mode);

    let effectiveTheme = mode;
    if (mode === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-theme', effectiveTheme);

    if (themeLabel) {
      themeLabel.textContent = mode.toUpperCase();
    }

    if (themeIcon) {
      if (mode === 'auto') {
        themeIcon.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        `;
      } else if (mode === 'dark') {
        themeIcon.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        `;
      } else {
        themeIcon.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        `;
      }
    }
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (currentThemeMode === 'auto') {
      applyTheme('auto');
    }
  });

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const cycle = { 'auto': 'dark', 'dark': 'light', 'light': 'auto' };
      const nextMode = cycle[currentThemeMode] || 'dark';
      applyTheme(nextMode);
      if (window.playSynthSound) window.playSynthSound('blip', 750, 0.08);
      if (window.showToast) window.showToast(`Theme switched to ${nextMode.toUpperCase()} mode`);
    });
  }

  applyTheme(currentThemeMode);
}

/* ==========================================================================
   3. WEB AUDIO API SYNTHESIZER
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudioEngine() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (!audioBtn) return;

  const savedState = localStorage.getItem('tg_sound_enabled');
  if (savedState !== null) {
    soundEnabled = savedState === 'true';
  }
  updateAudioBtnUI(audioBtn);

  audioBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('tg_sound_enabled', soundEnabled);
    updateAudioBtnUI(audioBtn);
    if (soundEnabled) {
      ensureAudioContext();
      playSynthSound('blip', 600, 0.08);
      showToast('Cyber Audio Feedback Enabled');
    } else {
      showToast('Audio Muted');
    }
  });
}

function updateAudioBtnUI(btn) {
  if (soundEnabled) {
    btn.classList.add('active');
    btn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      </svg>
      <span>SFX: ON</span>
    `;
  } else {
    btn.classList.remove('active');
    btn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
      </svg>
      <span>SFX: OFF</span>
    `;
  }
}

function ensureAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSynthSound(type, freq = 440, duration = 0.1) {
  if (!soundEnabled) return;
  try {
    ensureAudioContext();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'deal') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.14);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (type === 'flip') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.setValueAtTime(1200, now + 0.03);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'shuffle') {
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          if (!soundEnabled || !audioCtx) return;
          const subOsc = audioCtx.createOscillator();
          const subGain = audioCtx.createGain();
          const t = audioCtx.currentTime;
          subOsc.type = 'sawtooth';
          subOsc.frequency.setValueAtTime(180 + Math.random() * 80, t);
          subGain.gain.setValueAtTime(0.06, t);
          subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
          subOsc.connect(subGain);
          subGain.connect(audioCtx.destination);
          subOsc.start(t);
          subOsc.stop(t + 0.05);
        }, i * 65);
      }
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.start(now);
      osc.stop(now + duration);
    }
  } catch (e) {}
}

window.playSynthSound = playSynthSound;

/* ==========================================================================
   4. INTERACTIVE 3D PLAYING CARDS DECK CONTROLLER
   ========================================================================== */
function initPlayingCardsDeck() {
  const arena = document.getElementById('cards-arena');
  const deckContainer = document.getElementById('deck-container');
  if (!arena || !deckContainer) return;

  const viewBtns = document.querySelectorAll('[data-deck-view]');
  const shuffleBtn = document.getElementById('btn-shuffle-deck');
  const dealBtn = document.getElementById('btn-deal-card');
  const flipAllBtn = document.getElementById('btn-flip-all');

  let currentMode = 'fan';
  let cards = Array.from(deckContainer.querySelectorAll('.playing-card'));

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.deckView;
      if (mode === currentMode) return;
      
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      arena.classList.remove(`mode-${currentMode}`);
      currentMode = mode;
      arena.classList.add(`mode-${currentMode}`);
      
      playSynthSound('blip', 520, 0.1);
      resetCardTransforms();
    });
  });

  cards.forEach(card => {
    const foil = card.querySelector('.card-holo-foil');

    card.addEventListener('mousemove', (e) => {
      if (currentMode === 'stack' && card !== getTopCard()) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      if (foil) {
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        foil.style.backgroundPosition = `${percentX}% ${percentY}%`;
      }

      if (currentMode === 'grid') {
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if (currentMode === 'grid') {
        card.style.transform = '';
      }
    });

    const flipTriggers = card.querySelectorAll('.card-flip-action, .card-back');
    flipTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.toggle('is-flipped');
        playSynthSound('flip');
      });
    });

    card.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      card.classList.toggle('is-flipped');
      playSynthSound('flip');
    });

    card.addEventListener('click', () => {
      if (currentMode === 'stack' && card === getTopCard()) {
        dealTopCard();
      }
    });
  });

  function getTopCard() {
    return deckContainer.firstElementChild;
  }

  function dealTopCard() {
    const topCard = getTopCard();
    if (!topCard || topCard.classList.contains('is-dealing')) return;

    playSynthSound('deal');
    topCard.classList.add('is-dealing');

    setTimeout(() => {
      topCard.classList.remove('is-dealing');
      deckContainer.appendChild(topCard);
      reorderStackIndices();
    }, 650);
  }

  if (dealBtn) {
    dealBtn.addEventListener('click', () => {
      if (currentMode !== 'stack') {
        const stackBtn = document.querySelector('[data-deck-view="stack"]');
        if (stackBtn) stackBtn.click();
      }
      setTimeout(dealTopCard, 100);
    });
  }

  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      if (arena.classList.contains('is-shuffling')) return;

      arena.classList.add('is-shuffling');
      playSynthSound('shuffle');

      setTimeout(() => {
        const shuffled = Array.from(deckContainer.children).sort(() => Math.random() - 0.5);
        shuffled.forEach(c => deckContainer.appendChild(c));
        cards = shuffled;
        reorderStackIndices();
      }, 300);

      setTimeout(() => {
        arena.classList.remove('is-shuffling');
        showToast('Deck Shuffled');
      }, 700);
    });
  }

  let allFlipped = false;
  if (flipAllBtn) {
    flipAllBtn.addEventListener('click', () => {
      allFlipped = !allFlipped;
      cards.forEach((c, idx) => {
        setTimeout(() => {
          c.classList.toggle('is-flipped', allFlipped);
          playSynthSound('flip');
        }, idx * 70);
      });
    });
  }

  function reorderStackIndices() {
    Array.from(deckContainer.children).forEach((child, index) => {
      child.style.zIndex = (10 - index).toString();
    });
  }

  function resetCardTransforms() {
    cards.forEach(card => {
      card.style.transform = '';
    });
    reorderStackIndices();
  }
}

/* ==========================================================================
   5. CYBER CANVAS PARTICLES
   ========================================================================== */
function initCyberCanvas() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 45;
  const connectionDistance = 140;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.8 + 0.8;
      this.color = Math.random() > 0.5 ? 'rgba(6, 182, 212, ' : 'rgba(139, 92, 246, ';
      this.alpha = Math.random() * 0.6 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let mouse = { x: -1000, y: -1000 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  let isVisible = true;
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  function animate() {
    if (isVisible) {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   6. LIGHTBOX MODAL
   ========================================================================== */
function initLightboxModal() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!modal || !modalImg) return;

  function openModal(src, title, desc) {
    modalImg.src = src;
    modalImg.alt = title;
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc || 'Verified Credential // Tharun Godwin';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    playSynthSound('blip', 680, 0.08);
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-cert-view]').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.certSrc;
      const title = item.dataset.certTitle;
      const desc = item.dataset.certDesc;
      if (src) openModal(src, title, desc);
    });
  });

  document.querySelectorAll('[data-event-view]').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.eventSrc;
      const title = item.dataset.eventTitle;
      const desc = item.dataset.eventDesc;
      if (src) openModal(src, title, desc);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   7. SKILLS FILTER & NAVIGATION
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('[data-skill-filter]');
  const skillCards = document.querySelectorAll('[data-skill-category]');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.skillFilter;
      playSynthSound('blip', 480, 0.07);

      skillCards.forEach(card => {
        if (filter === 'all' || card.dataset.skillCategory === filter) {
          card.style.display = 'block';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease';
            card.style.opacity = '1';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function initContactAndClipboard() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const textToCopy = btn.dataset.copy;
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        playSynthSound('blip', 880, 0.1);
        showToast(`Copied to Clipboard: ${textToCopy}`);
      }).catch(() => {
        showToast(`Copied: ${textToCopy}`);
      });
    });
  });

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name')?.value || '';
      const email = document.getElementById('form-email')?.value || '';
      const message = document.getElementById('form-message')?.value || '';

      playSynthSound('blip', 750, 0.15);
      showToast('Opening Mail Client...');

      const mailtoLink = `mailto:godwintharun3@gmail.com?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + email)}`;
      window.location.href = mailtoLink;
    });
  }
}

function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNavDrawer.classList.toggle('active');
      playSynthSound('blip', 600, 0.08);
    });

    mobileNavDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('active');
      });
    });
  }

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const sectionHeight = sec.offsetHeight;
      const sectionTop = sec.offsetTop - 140;
      const sectionId = sec.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll(`.nav-link[href*="${sectionId}"]`).forEach(l => {
          navLinks.forEach(item => item.classList.remove('active'));
          l.classList.add('active');
        });
      }
    });

    if (scrollTopBtn) {
      if (scrollY > 600) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.pointerEvents = 'auto';
      } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.pointerEvents = 'none';
      }
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playSynthSound('blip', 800, 0.08);
    });
  }
}

/* ==========================================================================
   8. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
   ========================================================================== */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
      el.classList.add('revealed');
    }
  });

  window.addEventListener('hashchange', () => {
    setTimeout(() => {
      document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
          el.classList.add('revealed');
        }
      });
    }, 150);
  });
}

/* ==========================================================================
   TOAST NOTIFICATION UTILITY
   ========================================================================== */
let toastTimeout;
function showToast(message) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

window.showToast = showToast;

/* ==========================================================================
   HERO GATEWAYS & CHROME LIVE ALERTS
   ========================================================================== */
function initHeroGateways() {
  const officerLoginBtn = document.getElementById('btn-officer-login');
  const exploreGuestBtn = document.getElementById('btn-gateway-guest');
  const chromeAlertBtn = document.getElementById('btn-trigger-chrome-alert');

  if (officerLoginBtn) {
    officerLoginBtn.addEventListener('click', () => {
      const authBtn = document.getElementById('btn-biometric-auth');
      if (authBtn) authBtn.click();
      if (window.playSynthSound) window.playSynthSound('blip', 650, 0.08);
    });
  }

  if (exploreGuestBtn) {
    exploreGuestBtn.addEventListener('click', () => {
      const chatBtn = document.getElementById('btn-open-bot-chat');
      if (chatBtn) chatBtn.click();
      if (window.playSynthSound) window.playSynthSound('blip', 600, 0.08);
    });
  }

  if (chromeAlertBtn) {
    chromeAlertBtn.addEventListener('click', async () => {
      if (window.playSynthSound) window.playSynthSound('flip', 850, 0.12);
      
      const alertTitle = "🚨 MPLAD AI Sovereign Audit Flag";
      const alertBody = "Amritsar, Punjab (#80673): +100% Cost Escalation Anomaly Flagged by Isolation Forest ML Engine (₹5.0L → ₹10.0L).";

      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          try {
            new Notification(alertTitle, {
              body: alertBody,
              icon: "assets/images/sih_logo.png"
            });
          } catch (e) {
            console.log("Desktop notification fallback:", e);
          }
        } else if (Notification.permission !== "denied") {
          const perm = await Notification.requestPermission();
          if (perm === "granted") {
            try {
              new Notification(alertTitle, {
                body: alertBody,
                icon: "assets/images/sih_logo.png"
              });
            } catch (e) {}
          }
        }
      }

      showToast("🚨 Dispatched Chrome Live Audit Notification: Project #80673 Flagged");
    });
  }
}

/* ==========================================================================
   FLOATING AI COMPANION ROBOT (MATCHING IMAGE 1 & IMAGE 2)
   ========================================================================== */
function initFloatingRobotCompanion() {
  const ROBOT_TIPS = [
    {
      tag: "3D GEOSPATIAL AUDIT",
      title: "Earth & India Globe",
      text: "Scroll down to transition smoothly from the global Earth sphere directly into the high-resolution forensic map of India."
    },
    {
      tag: "BICAMERAL PARLIAMENT",
      title: "Lok Sabha & Rajya Sabha",
      text: "Auditing 543 Lok Sabha and 231 Rajya Sabha allocations across all 36 States & Union Territories with real MP directories."
    },
    {
      tag: "ANOMALY DETECTOR",
      title: "Flagged Project #80673",
      text: "Active critical audit detected in Punjab: +100% cost escalation flagged by our Isolation Forest AI engine."
    },
    {
      tag: "SPACE PARTICLES",
      title: "Interactive Stardust",
      text: "Move your cursor across the screen to watch cosmic particles part and disperse with realistic physics."
    }
  ];

  let currentTipIndex = 0;
  const bubble = document.getElementById('robot-hint-bubble');
  const tagEl = document.getElementById('robot-bubble-tag');
  const titleEl = document.getElementById('robot-bubble-title');
  const descEl = document.getElementById('robot-bubble-desc');
  const robotWrap = document.getElementById('robot-avatar-wrap');
  const armLeft = document.getElementById('robot-arm-left');
  const eyeLeft = document.getElementById('robot-eye-left');
  const pupilLeft = document.getElementById('robot-pupil-left');
  const eyeRight = document.getElementById('robot-eye-right');
  const pupilRight = document.getElementById('robot-pupil-right');

  function updateTip(index) {
    currentTipIndex = (index + ROBOT_TIPS.length) % ROBOT_TIPS.length;
    const item = ROBOT_TIPS[currentTipIndex];
    if (tagEl) tagEl.textContent = item.tag;
    if (titleEl) titleEl.textContent = item.title;
    if (descEl) descEl.textContent = item.text;
  }

  const nextBtn = document.getElementById('btn-robot-next');
  const nextHintBtn = document.getElementById('btn-robot-next-hint');
  const prevBtn = document.getElementById('btn-robot-prev');
  const closeBtn = document.getElementById('btn-robot-close-bubble');
  const dashBtn = document.getElementById('btn-robot-dash');
  const askAiBtn = document.getElementById('btn-robot-ask-ai');
  const chatLinkBtn = document.getElementById('btn-robot-chat-link');

  if (nextBtn) nextBtn.addEventListener('click', () => { updateTip(currentTipIndex + 1); if (window.playSynthSound) window.playSynthSound('blip', 600, 0.05); });
  if (nextHintBtn) nextHintBtn.addEventListener('click', () => { updateTip(currentTipIndex + 1); if (window.playSynthSound) window.playSynthSound('blip', 600, 0.05); });
  if (prevBtn) prevBtn.addEventListener('click', () => { updateTip(currentTipIndex - 1); if (window.playSynthSound) window.playSynthSound('blip', 550, 0.05); });

  if (closeBtn && bubble) {
    closeBtn.addEventListener('click', () => {
      bubble.classList.add('hidden');
    });
  }

  function triggerRobotDash() {
    if (!robotWrap || robotWrap.classList.contains('robot-crazy-dash')) return;
    robotWrap.classList.add('robot-crazy-dash');
    if (window.playSynthSound) window.playSynthSound('shuffle', 400, 0.4);
    showToast('⚡ Robot AI Sprinting across screen!');
    setTimeout(() => {
      robotWrap.classList.remove('robot-crazy-dash');
    }, 2850);
  }

  if (dashBtn) {
    dashBtn.addEventListener('click', triggerRobotDash);
  }

  function openBotChat() {
    const drawer = document.getElementById('bot-chat-drawer');
    if (drawer) drawer.classList.add('active');
    if (window.TGBot) {
      window.TGBot.setExpression('happy');
      window.TGBot.wave();
    }
    if (window.playSynthSound) window.playSynthSound('blip', 750, 0.08);
  }

  if (askAiBtn) askAiBtn.addEventListener('click', openBotChat);
  if (chatLinkBtn) chatLinkBtn.addEventListener('click', openBotChat);

  if (robotWrap) {
    robotWrap.addEventListener('click', () => {
      if (bubble && bubble.classList.contains('hidden')) {
        bubble.classList.remove('hidden');
      } else {
        updateTip(currentTipIndex + 1);
      }
      if (armLeft) {
        armLeft.classList.add('robot-arm-waving');
        setTimeout(() => armLeft.classList.remove('robot-arm-waving'), 1200);
      }
      if (window.playSynthSound) window.playSynthSound('blip', 680, 0.08);
    });

    robotWrap.addEventListener('dblclick', triggerRobotDash);
  }

  window.addEventListener('mousemove', (e) => {
    if (!eyeLeft || !eyeRight) return;
    const nx = (e.clientX / window.innerWidth - 0.5) * 3;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    if (pupilLeft) {
      pupilLeft.setAttribute('cx', (40.2 + nx).toFixed(1));
      pupilLeft.setAttribute('cy', (37.5 + ny).toFixed(1));
    }
    if (pupilRight) {
      pupilRight.setAttribute('cx', (62.2 + nx).toFixed(1));
      pupilRight.setAttribute('cy', (37.5 + ny).toFixed(1));
    }
  }, { passive: true });

  setInterval(() => {
    if (!eyeLeft || !eyeRight) return;
    eyeLeft.setAttribute('ry', '0.6');
    eyeRight.setAttribute('ry', '0.6');
    setTimeout(() => {
      eyeLeft.setAttribute('ry', '5.5');
      eyeRight.setAttribute('ry', '5.5');
    }, 180);
  }, 4200);
}

/* ==========================================================================
   GLOBE DOSSIER STATE CHIPS INTERACTION
   ========================================================================== */
function initGlobeDossier() {
  const chips = document.querySelectorAll('.dossier-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const state = chip.dataset.state;
      if (window.TGGlobe && window.TGGlobe.focusState) {
        window.TGGlobe.focusState(state);
      }
    });
  });

  const portalBtn = document.getElementById('btn-focus-tn-portal');
  if (portalBtn) {
    portalBtn.addEventListener('click', () => {
      if (window.TGGlobe && window.TGGlobe.focusTamilNadu) {
        window.TGGlobe.focusTamilNadu();
      }
    });
  }
}
