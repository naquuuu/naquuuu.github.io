/**
 * naquuuu: personal product architecture & systems engine
 * Operating with strict MECE boundaries & dual-mode aesthetic:
 *   - [ systems & matter ]: Swiss Technical Architectural Paper (#FBFBFA)
 *   - [ culture & taste ]: Deep Velvet Crimson & Dark Maroon Palette (#120305)
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
  const badgeModeSystems = document.getElementById('badge-mode-systems');
  const badgeModeCulture = document.getElementById('badge-mode-culture');
  const stickyBtnSystems = document.getElementById('sticky-tab-mode-systems');
  const stickyBtnCulture = document.getElementById('sticky-tab-mode-culture');
  const stickyBadgeSystems = document.getElementById('sticky-badge-mode-systems');
  const stickyBadgeCulture = document.getElementById('sticky-badge-mode-culture');
  const stickyPerspectiveBar = document.getElementById('sticky-perspective-bar');
  const heroModeBar = document.querySelector('.mode-switch-wrap');

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

  function syncPerspectiveSwitchers(activeMode) {
    const isCulture = activeMode === 'culture';

    // Query all systems and culture buttons and badges across all switchers (hero, sticky, etc.)
    const systemsButtons = document.querySelectorAll('#tab-mode-systems, #sticky-tab-mode-systems, [data-mode-tab="systems"]');
    const cultureButtons = document.querySelectorAll('#tab-mode-culture, #sticky-tab-mode-culture, [data-mode-tab="culture"]');
    const systemsBadges = document.querySelectorAll('#badge-mode-systems, #sticky-badge-mode-systems, [data-mode-badge="systems"]');
    const cultureBadges = document.querySelectorAll('#badge-mode-culture, #sticky-badge-mode-culture, [data-mode-badge="culture"]');

    // Systems buttons & badges
    systemsButtons.forEach(btn => {
      btn.classList.toggle('active', !isCulture);
      btn.setAttribute('aria-selected', !isCulture ? 'true' : 'false');
    });
    systemsBadges.forEach(badge => {
      if (isCulture) {
        badge.textContent = '← switch';
        badge.classList.add('active');
      } else {
        badge.textContent = '';
        badge.classList.remove('active');
      }
    });

    // Culture buttons & badges
    cultureButtons.forEach(btn => {
      btn.classList.toggle('active', isCulture);
      btn.setAttribute('aria-selected', isCulture ? 'true' : 'false');
    });
    cultureBadges.forEach(badge => {
      if (!isCulture) {
        badge.textContent = 'switch →';
        badge.classList.add('active');
      } else {
        badge.textContent = '';
        badge.classList.remove('active');
      }
    });
  }

  function switchMode(mode) {
    const targetMode = mode === 'culture' ? 'culture' : 'systems';
    document.body.setAttribute('data-mode', targetMode);

    syncPerspectiveSwitchers(targetMode);

    if (targetMode === 'culture') {
      if (viewSystems) viewSystems.classList.remove('active');
      if (viewCulture) viewCulture.classList.add('active');
      if (modeStatusLabel) modeStatusLabel.textContent = 'active: culture & taste (tap tab to switch)';
      if (heroSubIdentity) heroSubIdentity.textContent = 'sound, tailoring, and visual art';

      // Animate single hero portrait change
      if (heroPortraitImg && heroPortraitMeta) {
        heroPortraitImg.style.opacity = '0';
        setTimeout(() => {
          heroPortraitImg.src = './assets/img/krishna-culture-portrait.jpeg?v=20260911';
          heroPortraitMeta.innerHTML = '<span>jakarta, indonesia</span><span>culture &amp; taste</span>';
          heroPortraitImg.style.opacity = '1';
        }, 180);
      }
    } else {
      if (viewCulture) viewCulture.classList.remove('active');
      if (viewSystems) viewSystems.classList.add('active');
      if (modeStatusLabel) modeStatusLabel.textContent = 'active: systems & matter (tap tab to switch)';
      if (heroSubIdentity) heroSubIdentity.textContent = 'product manager • industrial engineering, itb';

      // Animate single hero portrait change
      if (heroPortraitImg && heroPortraitMeta) {
        heroPortraitImg.style.opacity = '0';
        setTimeout(() => {
          heroPortraitImg.src = './assets/img/naquuuu-studio-bw.jpeg?v=20260911';
          heroPortraitMeta.innerHTML = '<span>jakarta, indonesia</span><span>matter + code</span>';
          heroPortraitImg.style.opacity = '1';
        }, 180);
      }
    }

    updateNavHrefs(targetMode);
    localStorage.setItem('naquuuu_mode', targetMode);
  }

  // Restore saved perspective mode if previously selected (always run on load!)
  const savedMode = localStorage.getItem('naquuuu_mode') || 'systems';
  switchMode(savedMode);

  // Bind click listeners for all perspective switch buttons (hero & sticky secondary bars)
  document.querySelectorAll('.mode-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isSystems = btn.id === 'tab-mode-systems' ||
                        btn.id === 'sticky-tab-mode-systems' ||
                        btn.getAttribute('data-mode-tab') === 'systems';
      switchMode(isSystems ? 'systems' : 'culture');
    });
  });

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

  // Tactile animation when clicking a nav link while already at that section
  function triggerAlreadyHereAnimation(targetEl, linkEl) {
    if (!targetEl) return;
    const contentToShake = targetEl.querySelector('.hero-headline, .section-label-bar, .inquiry-headline, .loop-cards-header') || targetEl;
    contentToShake.classList.remove('already-here-shake');
    void contentToShake.offsetWidth;
    contentToShake.classList.add('already-here-shake');

    if (linkEl) {
      linkEl.classList.remove('nav-click-feedback');
      void linkEl.offsetWidth;
      linkEl.classList.add('nav-click-feedback');
    }

    setTimeout(() => {
      contentToShake.classList.remove('already-here-shake');
      if (linkEl) linkEl.classList.remove('nav-click-feedback');
    }, 600);
  }

  // Smooth scroll handler targeting active perspective's sections
  let isNavClickScrolling = false;
  let navScrollTimeout = null;

  document.querySelectorAll('.nav-links a.nav-link, .mobile-bottom-dock a.mobile-dock-link').forEach(link => {
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
        const isAtTop = window.scrollY <= 45;
        if (isAtTop) {
          triggerAlreadyHereAnimation(document.getElementById('philosophy'), link);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        history.replaceState(null, '', href);
        return;
      }
      if (href && href.startsWith('#')) {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          const rect = targetEl.getBoundingClientRect();
          const isAlreadyAtSection = Math.abs(rect.top - 56) < 45 || Math.abs(rect.top) < 45;
          if (isAlreadyAtSection) {
            triggerAlreadyHereAnimation(targetEl, link);
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
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
  //    + Bidirectional Spotify Embed Coordination (Strict Single-Source Mutex)
  // ===========================================================================
  const audioEl = document.getElementById('hukum-murphy-audio');
  const navAudioBtn = document.getElementById('nav-audio-pill');
  const navAudioStatus = document.getElementById('nav-audio-status');

  // Hard clamp volume to 50% max so visitors on high device volume don't get startled
  const MAX_AUDIO_VOLUME = 0.5;

  let isUserInitiatedPause = false;
  let pausedBySpotify = false;
  let isSpotifyPlaying = false;

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
    isSpotifyPlaying = true;
    pausedBySpotify = true;
    if (audioEl && !audioEl.paused) {
      audioEl.pause();
    }
  }

  function resumeMainAudioFromSpotify() {
    isSpotifyPlaying = false;
    // Resume loop only if previously paused by Spotify and user hasn't explicitly clicked [PAUSE]
    if (audioEl && pausedBySpotify && !isUserInitiatedPause) {
      pausedBySpotify = false;
      audioEl.volume = MAX_AUDIO_VOLUME;
      audioEl.play().catch(() => {});
    } else {
      pausedBySpotify = false;
    }
  }

  function toggleAudio() {
    if (!audioEl) return;
    if (audioEl.paused) {
      isUserInitiatedPause = false;
      pausedBySpotify = false;
      isSpotifyPlaying = false;

      // If Spotify controller is available, pause Spotify to prevent simultaneous playback
      if (window.spotifyEmbedController) {
        try {
          window.spotifyEmbedController.pause();
        } catch (err) {}
      }

      audioEl.volume = MAX_AUDIO_VOLUME;
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
    audioEl.volume = MAX_AUDIO_VOLUME;

    // Enforce 50% volume ceiling
    audioEl.addEventListener('volumechange', () => {
      if (audioEl.volume > MAX_AUDIO_VOLUME) {
        audioEl.volume = MAX_AUDIO_VOLUME;
      }
    });

    // 2. Hardware event-driven UI synchronization & Mutual Exclusion
    audioEl.addEventListener('play', () => {
      if (audioEl.volume > MAX_AUDIO_VOLUME) {
        audioEl.volume = MAX_AUDIO_VOLUME;
      }
      // Never allow main audio to play if Spotify is active
      if (pausedBySpotify || isSpotifyPlaying) {
        audioEl.pause();
        updateAudioUI(false);
        return;
      }
      updateAudioUI(true);
    });

    audioEl.addEventListener('pause', () => {
      updateAudioUI(false);
      // Auto-resume resilience: recover from OS/browser interruptions only when not Spotify-paused and not user-paused
      if (!isUserInitiatedPause && !pausedBySpotify && !isSpotifyPlaying) {
        setTimeout(() => {
          if (!isUserInitiatedPause && !pausedBySpotify && !isSpotifyPlaying && audioEl.paused) {
            audioEl.volume = MAX_AUDIO_VOLUME;
            audioEl.play().catch(() => {});
          }
        }, 300);
      }
    });

    // 3. Tab visibility resilience
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && !isUserInitiatedPause && !pausedBySpotify && !isSpotifyPlaying && audioEl.paused) {
        audioEl.volume = MAX_AUDIO_VOLUME;
        audioEl.play().catch(() => {});
      }
    });

    // 4. Single deterministic loop restart
    audioEl.addEventListener('ended', () => {
      audioEl.currentTime = 0;
      if (!isUserInitiatedPause && !pausedBySpotify && !isSpotifyPlaying) {
        audioEl.volume = MAX_AUDIO_VOLUME;
        audioEl.play().catch(err => {
          console.warn('Seamless loop restart caught:', err);
        });
      }
    });

    // 5. Valid gestures only (NO scroll, NO mousemove)
    const validInteractionEvents = ['pointerdown', 'touchstart', 'click', 'keydown'];

    const triggerPlayOnGesture = () => {
      if (audioEl.paused && !isUserInitiatedPause && !pausedBySpotify && !isSpotifyPlaying) {
        audioEl.volume = MAX_AUDIO_VOLUME;
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

  // Immediate Click / Focus Handshake for Spotify Iframe (Native 450px Player)
  if (spotifyIframe) {
    window.addEventListener('blur', () => {
      setTimeout(() => {
        if (document.activeElement === spotifyIframe) {
          // User clicked into Spotify player; pause background audio immediately
          pauseMainAudioForSpotify();
        }
      }, 50);
    });
  }

  // Cross-Origin PostMessage fallback for Spotify iframe events (handles both Object and String)
  function handleSpotifyMessagePayload(data) {
    if (!data) return;
    let payload = data;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (err) {
        return;
      }
    }
    if (typeof payload !== 'object' || payload === null) return;

    const eventType = payload.type || payload.event;
    if (eventType && (eventType.includes('playback_update') || eventType.includes('playback_state') || eventType.includes('track_update'))) {
      const stateData = payload.data || payload.body || payload;
      if (typeof stateData.isPaused === 'boolean') {
        if (!stateData.isPaused) {
          pauseMainAudioForSpotify();
        } else {
          resumeMainAudioFromSpotify();
        }
      } else if (typeof stateData.isPlaying === 'boolean') {
        if (stateData.isPlaying) {
          pauseMainAudioForSpotify();
        } else {
          resumeMainAudioFromSpotify();
        }
      }
    }
  }

  window.addEventListener('message', (event) => {
    if (event.origin && event.origin.includes('spotify.com')) {
      handleSpotifyMessagePayload(event.data);
    } else if (typeof event.data === 'string' && event.data.includes('playback')) {
      handleSpotifyMessagePayload(event.data);
    } else if (typeof event.data === 'object' && event.data && event.data.type && event.data.type.includes('playback')) {
      handleSpotifyMessagePayload(event.data);
    }
  });

  // ===========================================================================
  // 5. Blog Essays Archive Theme Filter (Systems / White vs Culture / Red)
  // ===========================================================================
  const essayFilterBtns = document.querySelectorAll('.essay-filter-btn');
  const essayCards = document.querySelectorAll('.essay-card');

  if (essayFilterBtns.length && essayCards.length) {
    essayFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterVal = btn.dataset.filter;

        essayFilterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        essayCards.forEach(card => {
          const cardTheme = card.dataset.theme;
          if (filterVal === 'all' || cardTheme === filterVal) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ===========================================================================
  // 6. Interactive System Model & Simulation Toggles (3M Mask & Schneider)
  // ===========================================================================
  const simBoxes = document.querySelectorAll('.sim-system-box');
  if (simBoxes.length) {
    simBoxes.forEach(box => {
      const modeBtns = box.querySelectorAll('.sim-mode-btn');
      const views = box.querySelectorAll('.sim-canvas-view');
      const telemetryPanels = box.querySelectorAll('.sim-telemetry-grid');

      modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetMode = btn.dataset.simMode;

          modeBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');

          views.forEach(v => {
            if (v.dataset.view === targetMode) {
              v.classList.add('active');
            } else {
              v.classList.remove('active');
            }
          });

          telemetryPanels.forEach(tp => {
            if (tp.dataset.telemetry === targetMode) {
              tp.style.display = 'grid';
            } else {
              tp.style.display = 'none';
            }
          });
        });
      });
    });
  }
});
