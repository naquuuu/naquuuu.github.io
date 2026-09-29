/* Progressive enhancements. The journal remains readable without JavaScript. */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // ---- 1. Dual-Mode Perspective Switcher ----
  const DEFAULT_MODE = 'systems';
  const urlParams = new URLSearchParams(window.location.search);
  const paramMode = urlParams.get('mode');
  let savedMode = DEFAULT_MODE;

  try {
    savedMode = paramMode || localStorage.getItem('naquuuu_mode') || DEFAULT_MODE;
  } catch (e) {
    savedMode = DEFAULT_MODE;
  }

  function setMode(mode) {
    const targetMode = mode === 'culture' ? 'culture' : 'systems';
    document.body.setAttribute('data-mode', targetMode);

    try {
      localStorage.setItem('naquuuu_mode', targetMode);
    } catch (e) {}

    const lensButtons = document.querySelectorAll('[data-lens-tab]');
    lensButtons.forEach(btn => {
      const isTarget = btn.getAttribute('data-lens-tab') === targetMode;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    const eyebrow = document.querySelector('.journal-notes .journal-eyebrow');
    if (eyebrow) {
      eyebrow.textContent = targetMode === 'culture'
        ? '01 / the journal • culture & taste'
        : '01 / the journal • systems & matter';
    }
  }

  setMode(savedMode);

  document.querySelectorAll('[data-lens-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const mode = btn.getAttribute('data-lens-tab');
      setMode(mode);
    });
  });

  // ---- 2. Audio Telemetry Controller (Hukum Murphy) ----
  const audio = document.getElementById('hukum-murphy-audio');
  const audioPill = document.getElementById('nav-audio-pill');
  const audioStatus = document.getElementById('nav-audio-status');

  if (audio && audioPill) {
    audioPill.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().then(() => {
          audioPill.classList.add('playing');
          if (audioStatus) audioStatus.textContent = '[ playing ]';
        }).catch(() => {});
      } else {
        audio.pause();
        audioPill.classList.remove('playing');
        if (audioStatus) audioStatus.textContent = '[ sound ]';
      }
    });

    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    });

    audio.addEventListener('pause', () => {
      audioPill.classList.remove('playing');
      if (audioStatus) audioStatus.textContent = '[ sound ]';
    });

    audio.addEventListener('play', () => {
      audioPill.classList.add('playing');
      if (audioStatus) audioStatus.textContent = '[ playing ]';
    });
  }

  // ---- 3. Active Section Scrollspy ----
  const links = Array.from(document.querySelectorAll('.journal-nav a[href^="#"]'));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });

    links.forEach(link => {
      const section = document.querySelector(link.hash);
      if (section) observer.observe(section);
    });
  }
});
