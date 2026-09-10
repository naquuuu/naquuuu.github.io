/**
 * naquuuu — Swiss Technical Editorial Script Engine
 * Working across physical matter, code, and culture.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ===========================================================================
  // 1. Live Jakarta Clock (WIB / UTC+7)
  // ===========================================================================
  const clockEl = document.getElementById('live-clock');

  function updateJakartaClock() {
    if (!clockEl) return;
    const now = new Date();
    // UTC+7 offset for Western Indonesia Time (WIB)
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const wibDate = new Date(utc + (3600000 * 7));

    const hours = String(wibDate.getHours()).padStart(2, '0');
    const minutes = String(wibDate.getMinutes()).padStart(2, '0');
    const seconds = String(wibDate.getSeconds()).padStart(2, '0');

    clockEl.textContent = `JAKARTA [WIB / UTC+7] ${hours}:${minutes}:${seconds}`;
  }

  updateJakartaClock();
  setInterval(updateJakartaClock, 1000);

  // ===========================================================================
  // 2. Dual-Mode Perspective Switcher: Systems & Matter vs. Culture & Taste
  // ===========================================================================
  const btnModeSystems = document.getElementById('tab-mode-systems');
  const btnModeCulture = document.getElementById('tab-mode-culture');
  const viewSystems = document.getElementById('view-systems');
  const viewCulture = document.getElementById('view-culture');
  const modeStatusLabel = document.getElementById('mode-status-label');

  function switchMode(mode) {
    if (mode === 'culture') {
      if (btnModeSystems) {
        btnModeSystems.classList.remove('active');
        btnModeSystems.setAttribute('aria-selected', 'false');
      }
      if (btnModeCulture) {
        btnModeCulture.classList.add('active');
        btnModeCulture.setAttribute('aria-selected', 'true');
      }
      if (viewSystems) viewSystems.classList.remove('active');
      if (viewCulture) viewCulture.classList.add('active');
      if (modeStatusLabel) modeStatusLabel.textContent = 'PERSPECTIVE: CREATIVE SANDBOX';
    } else {
      if (btnModeCulture) {
        btnModeCulture.classList.remove('active');
        btnModeCulture.setAttribute('aria-selected', 'false');
      }
      if (btnModeSystems) {
        btnModeSystems.classList.add('active');
        btnModeSystems.setAttribute('aria-selected', 'true');
      }
      if (viewCulture) viewCulture.classList.remove('active');
      if (viewSystems) viewSystems.classList.add('active');
      if (modeStatusLabel) modeStatusLabel.textContent = 'PERSPECTIVE: TECHNICAL PROOF';
    }
  }

  if (btnModeSystems && btnModeCulture) {
    btnModeSystems.addEventListener('click', () => switchMode('systems'));
    btnModeCulture.addEventListener('click', () => switchMode('culture'));
  }

  // Ensure clicking [ Works ] or [ The Loop ] reveals View A if View B was active
  const navWorksLink = document.querySelector('a[href="#works"]');
  const navLoopLink = document.querySelector('a[href="#loop"]');
  if (navWorksLink) {
    navWorksLink.addEventListener('click', () => switchMode('systems'));
  }
  if (navLoopLink) {
    navLoopLink.addEventListener('click', () => switchMode('systems'));
  }

  // ===========================================================================
  // 3. Audio Telemetry Engine: Hukum Murphy by Kafin Sulthan (Blog Reliability Standard)
  // ===========================================================================
  const audioEl = document.getElementById('hukum-murphy-audio');
  const navAudioBtn = document.getElementById('nav-audio-pill');
  const navAudioStatus = document.getElementById('nav-audio-status');

  let isUserInitiatedPause = false;

  function updateAudioUI(isPlaying) {
    if (navAudioBtn) {
      navAudioBtn.classList.toggle('playing', isPlaying);
      navAudioBtn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    }
    if (navAudioStatus) {
      navAudioStatus.textContent = isPlaying ? '[ PAUSE ]' : '[ PLAY ]';
    }
  }

  function toggleAudio() {
    if (!audioEl) return;
    if (audioEl.paused) {
      isUserInitiatedPause = false;
      audioEl.play().catch(err => {
        console.log('Audio playback request handled:', err);
      });
    } else {
      isUserInitiatedPause = true;
      audioEl.pause();
    }
  }

  if (navAudioBtn) {
    navAudioBtn.addEventListener('click', toggleAudio);
  }

  if (audioEl) {
    // 1. Single Looping Mechanism via 'ended' event only (no loop attribute)
    audioEl.loop = false;
    audioEl.preload = 'metadata';

    // 2. Hardware event-driven UI synchronization
    audioEl.addEventListener('play', () => updateAudioUI(true));
    audioEl.addEventListener('pause', () => {
      updateAudioUI(false);
      // Auto-resume resilience: recover from OS/browser interruptions
      if (!isUserInitiatedPause) {
        setTimeout(() => {
          if (!isUserInitiatedPause && audioEl.paused) {
            audioEl.play().catch(() => {});
          }
        }, 300);
      }
    });

    // 3. Tab visibility resilience
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && !isUserInitiatedPause && audioEl.paused) {
        audioEl.play().catch(() => {});
      }
    });

    // 4. Single deterministic loop restart
    audioEl.addEventListener('ended', () => {
      audioEl.currentTime = 0;
      audioEl.play().catch(err => {
        console.warn('Seamless loop restart caught:', err);
      });
    });

    // 5. Valid gestures only (NO scroll, NO mousemove)
    const validInteractionEvents = ['pointerdown', 'touchstart', 'click', 'keydown'];

    const triggerPlayOnGesture = () => {
      if (audioEl.paused && !isUserInitiatedPause) {
        audioEl.play().catch(() => {});
      }
      cleanupAutoplayTriggers();
    };

    function cleanupAutoplayTriggers() {
      validInteractionEvents.forEach(evt => {
        window.removeEventListener(evt, triggerPlayOnGesture);
        document.removeEventListener(evt, triggerPlayOnGesture);
      });
    }

    validInteractionEvents.forEach(evt => {
      window.addEventListener(evt, triggerPlayOnGesture, { once: true, passive: true });
      document.addEventListener(evt, triggerPlayOnGesture, { once: true, passive: true });
    });
  }

  // ===========================================================================
  // 4. Scroll-Spy for Single-Row Monospace Links
  // ===========================================================================
  const navLinks = document.querySelectorAll('.nav-link');
  const trackedSections = document.querySelectorAll('section[id]');

  function updateScrollSpy() {
    let currentId = '';
    const scrollPos = window.scrollY + 100;

    trackedSections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentId}`) {
          link.classList.add('active');
        } else if (href && href.startsWith('#')) {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateScrollSpy, { passive: true });
  updateScrollSpy();
});
