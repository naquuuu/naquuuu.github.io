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
  // 2. Interactive "The Resilient Loop" Schematic State Machine
  // ===========================================================================
  const loopStages = [
    {
      id: '01',
      tag: 'STAGE 01 // INPUT & ENVIRONMENT',
      title: 'Environment / Input',
      desc: 'Real operating terrain across 17,000 islands: tropical humidity, intermittent mobile networks over open water, and un-airconditioned physical environments. Products are architected assuming hostile, noisy conditions rather than clean cloud lab defaults.'
    },
    {
      id: '02',
      tag: 'STAGE 02 // LOGIC & PHYSICAL MATTER',
      title: 'Logic & Matter',
      desc: 'Deterministic finite-state machine routing, bio-based biopolymer mechanical seal geometry, and local silica sand thermal beds. Systems ground software abstractions in physical constraints.'
    },
    {
      id: '03',
      tag: 'STAGE 03 // ENTROPY & BREAKDOWN',
      title: 'The Breakdown',
      desc: 'Cascading flight schedule collapses, inventory database locks, supply chain bottlenecks during medical emergencies, and thermal degradation of imported chemical batteries in tropical heat. The guaranteed moment of failure.'
    },
    {
      id: '04',
      tag: 'STAGE 04 // ADAPTIVE RECOVERY',
      title: 'Adaptive Recovery',
      desc: 'Automated policy state-machine rollbacks and instant refund execution, 90-day organic biopolymer soil decomposition, and passive thermal microgrid discharge without lithium fire risks. The system absorbs the shock and restores equilibrium.'
    }
  ];

  const stageButtons = document.querySelectorAll('.loop-stage-btn');
  const stageTagEl = document.getElementById('loop-detail-tag');
  const stageTextEl = document.getElementById('loop-detail-text');

  function setLoopStage(index) {
    const stage = loopStages[index];
    if (!stage) return;

    stageButtons.forEach((btn, idx) => {
      const isActive = idx === index;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (stageTagEl) stageTagEl.textContent = stage.tag;
    if (stageTextEl) stageTextEl.textContent = stage.desc;
  }

  stageButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => setLoopStage(idx));
    btn.addEventListener('mouseenter', () => setLoopStage(idx));
  });

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
