/**
 * naquuuu — Personal Product Architecture & Systems Engine
 * Dual-Mode Dynamic Architecture:
 *   - [ ⚡ Systems & Matter ]: Swiss Technical Architectural Paper (#FBFBFA)
 *   - [ ✦ Culture & Taste ]: Deep Velvet Crimson & Dark Maroon Palette (#120305)
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
  // 2. Dual-Mode Perspective & Dynamic Theme Switcher: Systems vs. Culture
  // ===========================================================================
  const btnModeSystems = document.getElementById('tab-mode-systems');
  const btnModeCulture = document.getElementById('tab-mode-culture');
  const viewSystems = document.getElementById('view-systems');
  const viewCulture = document.getElementById('view-culture');
  const modeStatusLabel = document.getElementById('mode-status-label');
  const heroSubIdentity = document.getElementById('hero-sub-identity');
  const heroPortraitImg = document.getElementById('hero-portrait-img');
  const heroPortraitMeta = document.getElementById('hero-portrait-meta');

  function switchMode(mode) {
    if (mode === 'culture') {
      document.body.setAttribute('data-mode', 'culture');
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
      if (heroSubIdentity) heroSubIdentity.textContent = 'exploring sound, silhouette, and human taste';

      // Animate single hero portrait change
      if (heroPortraitImg && heroPortraitMeta) {
        heroPortraitImg.style.opacity = '0';
        setTimeout(() => {
          heroPortraitImg.src = './assets/img/krishna-culture-portrait.jpeg?v=20260911';
          heroPortraitMeta.innerHTML = '<span>SHIBUYA-KEI</span><span>[ SONIC ROTATIONS ]</span><span>TASTE VECTORS</span>';
          heroPortraitImg.style.opacity = '1';
        }, 180);
      }

      localStorage.setItem('naquuuu_mode', 'culture');
    } else {
      document.body.setAttribute('data-mode', 'systems');
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
      if (heroSubIdentity) heroSubIdentity.textContent = 'working across physical matter, code, and culture';

      // Animate single hero portrait change
      if (heroPortraitImg && heroPortraitMeta) {
        heroPortraitImg.style.opacity = '0';
        setTimeout(() => {
          heroPortraitImg.src = './assets/img/naquuuu-studio-bw.jpeg?v=20260911';
          heroPortraitMeta.innerHTML = '<span>LOC: 6°12\'S 106°49\'E</span><span>[ WIB / UTC+7 ]</span><span>MATTER + CODE</span>';
          heroPortraitImg.style.opacity = '1';
        }, 180);
      }

      localStorage.setItem('naquuuu_mode', 'systems');
    }
  }

  // Restore saved perspective mode if previously selected
  const savedMode = localStorage.getItem('naquuuu_mode') || 'systems';
  if (savedMode === 'culture') {
    switchMode('culture');
  }

  if (btnModeSystems && btnModeCulture) {
    btnModeSystems.addEventListener('click', () => switchMode('systems'));
    btnModeCulture.addEventListener('click', () => switchMode('culture'));
  }

  // Dual-mode in-page navigation: keep user in their active perspective
  const navSectionMap = {
    '#philosophy': { systems: '#philosophy', culture: '#culture-philosophy' },
    '#artifacts': { systems: '#artifacts', culture: '#culture-artifacts' },
    '#notes': { systems: '#notes', culture: '#culture-notes' },
    '#inquiries': { systems: '#inquiries', culture: '#inquiries' }
  };

  document.querySelectorAll('.nav-links a.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (navSectionMap[href]) {
      link.addEventListener('click', (e) => {
        const currentMode = document.body.getAttribute('data-mode') || 'systems';
        const targetSelector = navSectionMap[href][currentMode] || href;
        const targetEl = document.querySelector(targetSelector);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
          history.replaceState(null, '', href);
        }
      });
    }
  });

  // ===========================================================================
  // 3. Audio Telemetry Engine: Hukum Murphy by Kafin Sulthan (Gate 4 Standard)
  //    + Bidirectional Spotify Embed Coordination
  // ===========================================================================
  const audioEl = document.getElementById('hukum-murphy-audio');
  const navAudioBtn = document.getElementById('nav-audio-pill');
  const navAudioStatus = document.getElementById('nav-audio-status');

  let isUserInitiatedPause = false;
  let pausedBySpotify = false;

  function updateAudioUI(isPlaying) {
    if (navAudioBtn) {
      navAudioBtn.classList.toggle('playing', isPlaying);
      navAudioBtn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    }
    if (navAudioStatus) {
      navAudioStatus.textContent = isPlaying ? '[ PAUSE ]' : '[ PLAY ]';
    }
  }

  function pauseMainAudioForSpotify() {
    if (audioEl && !audioEl.paused) {
      pausedBySpotify = true;
      audioEl.pause();
    }
  }

  function resumeMainAudioFromSpotify() {
    if (audioEl && pausedBySpotify && !isUserInitiatedPause) {
      pausedBySpotify = false;
      audioEl.play().catch(() => {});
    }
  }

  function toggleAudio() {
    if (!audioEl) return;
    if (audioEl.paused) {
      isUserInitiatedPause = false;
      pausedBySpotify = false;
      audioEl.play().catch(err => {
        console.log('Audio playback request handled:', err);
      });
    } else {
      isUserInitiatedPause = true;
      pausedBySpotify = false;
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
      // Auto-resume resilience: recover from OS/browser interruptions only when not Spotify-paused
      if (!isUserInitiatedPause && !pausedBySpotify) {
        setTimeout(() => {
          if (!isUserInitiatedPause && !pausedBySpotify && audioEl.paused) {
            audioEl.play().catch(() => {});
          }
        }, 300);
      }
    });

    // 3. Tab visibility resilience
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && !isUserInitiatedPause && !pausedBySpotify && audioEl.paused) {
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
      if (audioEl.paused && !isUserInitiatedPause && !pausedBySpotify) {
        audioEl.play().catch(() => {});
      }
      cleanupAutoplayTriggers();
    };

    const cleanupAutoplayTriggers = () => {
      validInteractionEvents.forEach(evt => {
        document.removeEventListener(evt, triggerPlayOnGesture);
      });
    };

    validInteractionEvents.forEach(evt => {
      document.addEventListener(evt, triggerPlayOnGesture, { once: true, passive: true });
    });
  }

  // ===========================================================================
  // 4. Spotify Embed Coordination (Halts Main Audio when Spotify Plays)
  // ===========================================================================
  window.onSpotifyIframeApiReady = (IFrameAPI) => {
    const rootEl = document.getElementById('spotify-embed-root');
    if (!rootEl) return;
    const options = {
      uri: 'spotify:playlist:37i9dQZF1DXdbXrPNafg9d',
      width: '100%',
      height: 352
    };
    const callback = (EmbedController) => {
      EmbedController.addListener('playback_update', e => {
        if (!e.data.isPaused) {
          pauseMainAudioForSpotify();
        } else {
          resumeMainAudioFromSpotify();
        }
      });
    };
    IFrameAPI.createController(rootEl, options, callback);
  };

  // PostMessage fallback for Spotify iframe events
  window.addEventListener('message', (event) => {
    if (typeof event.data === 'string' && event.data.includes('playback_update')) {
      try {
        const payload = JSON.parse(event.data);
        if (payload && payload.data) {
          if (payload.data.isPaused === false) {
            pauseMainAudioForSpotify();
          } else if (payload.data.isPaused === true) {
            resumeMainAudioFromSpotify();
          }
        }
      } catch (err) {}
    }
  });
});
