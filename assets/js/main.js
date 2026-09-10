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
  const stickyBtnSystems = document.getElementById('sticky-tab-mode-systems');
  const stickyBtnCulture = document.getElementById('sticky-tab-mode-culture');
  const stickyPerspectiveBar = document.getElementById('sticky-perspective-bar');
  const heroModeBar = document.querySelector('.mode-switch-wrap');
  const ctaPrimary = document.getElementById('hero-cta-primary');
  const ctaSecondary = document.getElementById('hero-cta-secondary');

  const viewSystems = document.getElementById('view-systems');
  const viewCulture = document.getElementById('view-culture');
  const modeStatusLabel = document.getElementById('mode-status-label');
  const heroSubIdentity = document.getElementById('hero-sub-identity');
  const heroPortraitImg = document.getElementById('hero-portrait-img');
  const heroPortraitMeta = document.getElementById('hero-portrait-meta');

  // Dynamic navbar link mapping per active perspective
  const navSectionMap = {
    philosophy: { systems: '#philosophy', culture: '#philosophy' },
    artifacts: { systems: '#artifacts', culture: '#culture-artifacts' },
    notes: { systems: '#notes', culture: '#culture-notes' },
    inquiries: { systems: '#inquiries', culture: '#inquiries' }
  };

  const navLinks = {
    philosophy: document.querySelector('.nav-links a[href*="philosophy"]'),
    artifacts: document.querySelector('.nav-links a[href*="artifacts"]'),
    notes: document.querySelector('.nav-links a[href*="notes"]'),
    inquiries: document.querySelector('.nav-links a[href*="inquiries"]')
  };

  function updateNavHrefs(activeMode) {
    Object.keys(navSectionMap).forEach(key => {
      const targetId = navSectionMap[key][activeMode] || navSectionMap[key].systems;
      const topLink = navLinks[key];
      if (topLink) topLink.setAttribute('href', targetId);

      const dockLink = document.querySelector(`.mobile-bottom-dock a[data-nav="${key}"]`);
      if (dockLink) dockLink.setAttribute('href', targetId);
    });
  }

  function switchMode(mode) {
    if (mode === 'culture') {
      document.body.setAttribute('data-mode', 'culture');

      // Primary Hero Switcher
      if (btnModeSystems) {
        btnModeSystems.classList.remove('active');
        btnModeSystems.setAttribute('aria-selected', 'false');
      }
      if (btnModeCulture) {
        btnModeCulture.classList.add('active');
        btnModeCulture.setAttribute('aria-selected', 'true');
      }

      // Secondary Sticky Switcher
      if (stickyBtnSystems) {
        stickyBtnSystems.classList.remove('active');
        stickyBtnSystems.setAttribute('aria-selected', 'false');
      }
      if (stickyBtnCulture) {
        stickyBtnCulture.classList.add('active');
        stickyBtnCulture.setAttribute('aria-selected', 'true');
      }

      if (viewSystems) viewSystems.classList.remove('active');
      if (viewCulture) viewCulture.classList.add('active');
      if (modeStatusLabel) modeStatusLabel.textContent = 'PERSPECTIVE: CREATIVE SANDBOX';
      if (heroSubIdentity) heroSubIdentity.textContent = 'exploring sound, silhouette, and human taste';

      // Update CTA buttons for Culture perspective
      if (ctaPrimary) {
        ctaPrimary.setAttribute('href', '#culture-artifacts');
        const lbl = ctaPrimary.querySelector('.hero-cta-label');
        if (lbl) lbl.textContent = '[ Explore Sonic & Aesthetic Archives ↓ ]';
      }
      if (ctaSecondary) {
        ctaSecondary.setAttribute('href', '#culture-philosophy');
        const lbl = ctaSecondary.querySelector('.hero-cta-label');
        if (lbl) lbl.textContent = '[ Aesthetic Axioms ↓ ]';
      }

      updateNavHrefs('culture');

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

      // Primary Hero Switcher
      if (btnModeCulture) {
        btnModeCulture.classList.remove('active');
        btnModeCulture.setAttribute('aria-selected', 'false');
      }
      if (btnModeSystems) {
        btnModeSystems.classList.add('active');
        btnModeSystems.setAttribute('aria-selected', 'true');
      }

      // Secondary Sticky Switcher
      if (stickyBtnCulture) {
        stickyBtnCulture.classList.remove('active');
        stickyBtnCulture.setAttribute('aria-selected', 'false');
      }
      if (stickyBtnSystems) {
        stickyBtnSystems.classList.add('active');
        stickyBtnSystems.setAttribute('aria-selected', 'true');
      }

      if (viewCulture) viewCulture.classList.remove('active');
      if (viewSystems) viewSystems.classList.add('active');
      if (modeStatusLabel) modeStatusLabel.textContent = 'PERSPECTIVE: TECHNICAL PROOF';
      if (heroSubIdentity) heroSubIdentity.textContent = 'working across physical matter, code, and culture';

      // Update CTA buttons for Systems perspective
      if (ctaPrimary) {
        ctaPrimary.setAttribute('href', '#artifacts');
        const lbl = ctaPrimary.querySelector('.hero-cta-label');
        if (lbl) lbl.textContent = '[ Explore Systems Proof ↓ ]';
      }
      if (ctaSecondary) {
        ctaSecondary.setAttribute('href', '#operating-philosophy');
        const lbl = ctaSecondary.querySelector('.hero-cta-label');
        if (lbl) lbl.textContent = '[ Operating Framework ↓ ]';
      }

      updateNavHrefs('systems');

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
  } else {
    updateNavHrefs('systems');
  }

  // Bind click listeners for hero switcher
  if (btnModeSystems && btnModeCulture) {
    btnModeSystems.addEventListener('click', () => switchMode('systems'));
    btnModeCulture.addEventListener('click', () => switchMode('culture'));
  }

  // Bind click listeners for sticky secondary switcher
  if (stickyBtnSystems && stickyBtnCulture) {
    stickyBtnSystems.addEventListener('click', () => switchMode('systems'));
    stickyBtnCulture.addEventListener('click', () => switchMode('culture'));
  }

  // IntersectionObserver: Float in sticky perspective bar when hero switcher scrolls out
  if (heroModeBar && stickyPerspectiveBar) {
    const stickyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          stickyPerspectiveBar.classList.add('visible');
          stickyPerspectiveBar.setAttribute('aria-hidden', 'false');
        } else {
          stickyPerspectiveBar.classList.remove('visible');
          stickyPerspectiveBar.setAttribute('aria-hidden', 'true');
        }
      });
    }, {
      threshold: 0,
      rootMargin: '-52px 0px 0px 0px'
    });
    stickyObserver.observe(heroModeBar);
  }

  // Smooth scroll handler targeting active perspective's sections
  let isNavClickScrolling = false;
  let navScrollTimeout = null;

  document.querySelectorAll('.nav-links a.nav-link, .mobile-bottom-dock a.mobile-dock-link, .hero-cta-btn').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // If it's a mobile dock link, immediately enforce strictly single active highlight
      if (link.classList.contains('mobile-dock-link')) {
        document.querySelectorAll('.mobile-bottom-dock a.mobile-dock-link').forEach(l => {
          l.classList.remove('active');
        });
        link.classList.add('active');
        link.blur();

        isNavClickScrolling = true;
        clearTimeout(navScrollTimeout);
        navScrollTimeout = setTimeout(() => {
          isNavClickScrolling = false;
          updateActiveNavOnScroll();
        }, 750);
      }

      if (href === '#philosophy') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        history.replaceState(null, '', href);
        return;
      }
      if (href && href.startsWith('#')) {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
          history.replaceState(null, '', href);
        }
      }
    });
  });

  // Nav brand logo smoothly scrolls to top if clicked on home page
  const navBrand = document.querySelector('.nav-brand');
  if (navBrand) {
    navBrand.addEventListener('click', (e) => {
      const href = navBrand.getAttribute('href');
      if (href === './' || href === '/') {
        if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname === '') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          history.replaceState(null, '', window.location.pathname);
        }
      }
    });
  }

  // Active section scroll spy for mobile dock
  const sectionIds = ['philosophy', 'operating-philosophy', 'culture-philosophy', 'artifacts', 'culture-artifacts', 'notes', 'culture-notes', 'inquiries'];
  function updateActiveNavOnScroll() {
    if (isNavClickScrolling) return;

    const scrollPos = window.scrollY + 140;
    let currentActive = 'philosophy';

    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const sec = document.getElementById(sectionIds[i]);
      // Skip hidden sections inside inactive perspective tab
      if (!sec || sec.offsetParent === null) continue;

      if (sec.offsetTop <= scrollPos) {
        const id = sec.id;
        if (id.includes('philosophy')) currentActive = 'philosophy';
        else if (id.includes('artifacts')) currentActive = 'artifacts';
        else if (id.includes('notes')) currentActive = 'notes';
        else if (id.includes('inquiries')) currentActive = 'inquiries';
        break;
      }
    }

    const dockLinks = document.querySelectorAll('.mobile-bottom-dock a.mobile-dock-link');
    dockLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-nav') === currentActive);
    });
  }

  window.addEventListener('scroll', updateActiveNavOnScroll, { passive: true });

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
  //    Custom Playlist: 2HWdPGCLLFI87mBu806kip
  // ===========================================================================
  const spotifyIframe = document.getElementById('spotify-embed-iframe');
  function syncSpotifyEmbedResponsive() {
    if (!spotifyIframe) return;
    const isMobile = window.innerWidth <= 768;
    const desktopSrc = 'https://open.spotify.com/embed/playlist/2HWdPGCLLFI87mBu806kip?utm_source=generator&theme=0&si=da6288fc6fc7457a';
    const mobileSrc = 'https://open.spotify.com/embed/playlist/2HWdPGCLLFI87mBu806kip?utm_source=generator&si=6ce925a120964aa9';
    const targetSrc = isMobile ? mobileSrc : desktopSrc;

    const currentSrc = spotifyIframe.getAttribute('src');
    if (currentSrc && !currentSrc.includes(isMobile ? 'si=6ce925a120964aa9' : 'theme=0')) {
      spotifyIframe.setAttribute('src', targetSrc);
    }
  }

  syncSpotifyEmbedResponsive();
  window.addEventListener('resize', syncSpotifyEmbedResponsive, { passive: true });

  window.onSpotifyIframeApiReady = (IFrameAPI) => {
    const rootEl = document.getElementById('spotify-embed-root');
    if (!rootEl) return;
    const isMobile = window.innerWidth <= 768;
    const options = {
      uri: 'spotify:playlist:2HWdPGCLLFI87mBu806kip',
      width: '100%',
      height: 152
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
