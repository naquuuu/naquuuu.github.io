/**
 * naquuuu@pm — Interactive Client Scripts, Scroll-Spy, Immediate Audio Autoplay & Seamless Looping
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Code Block Copy Buttons
  document.querySelectorAll('pre code').forEach(codeBlock => {
    const pre = codeBlock.parentNode;
    if (pre.classList.contains('no-copy')) return;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-code-btn';
    copyBtn.textContent = 'copy';
    copyBtn.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: #1F2637;
      color: #94A3B8;
      border: 1px solid #2D374D;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 0.7rem;
      padding: 2px 8px;
      cursor: pointer;
      transition: all 0.2s;
    `;

    pre.style.position = 'relative';
    pre.appendChild(copyBtn);

    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeBlock.innerText).then(() => {
        copyBtn.textContent = 'copied!';
        copyBtn.style.color = '#34D399';
        setTimeout(() => {
          copyBtn.textContent = 'copy';
          copyBtn.style.color = '#94A3B8';
        }, 2000);
      });
    });
  });

  // 2. Scroll-Spy: Synchronize Header Nav Highlights (About, Thinking Loop, Soundroom, Experience, Essays)
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function updateScrollSpy() {
    let currentId = '';
    const scrollPos = window.scrollY + 140; // offset for sticky navbar

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentId = section.getAttribute('data-nav-parent') || section.getAttribute('id');
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

  // Instant active feedback when clicking anchor nav items
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      link.addEventListener('click', () => {
        navLinks.forEach(l => {
          if (l.getAttribute('href') && l.getAttribute('href').startsWith('#')) {
            l.classList.remove('active');
          }
        });
        link.classList.add('active');
      });
    }
  });

  // 3. Scroll-triggered Reveal Animations (IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // 4. Audio Player Logic for Hukum Murphy (Kafin Sulthan) - Synced Header & Console Player
  const audioEl = document.getElementById('hukum-murphy-audio');
  const playBtn = document.getElementById('play-toggle-btn');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const eqBars = document.getElementById('equalizer-bars');
  const progressFill = document.getElementById('player-progress-fill');
  const progressBar = document.getElementById('player-progress-bar');
  const currentTimeEl = document.getElementById('player-current-time');
  const durationEl = document.getElementById('player-duration');
  const playerHint = document.getElementById('player-hint');

  // Sticky Header Audio Elements
  const navAudioBtn = document.getElementById('nav-audio-btn');
  const navPlayIcon = document.getElementById('nav-play-icon');
  const navPauseIcon = document.getElementById('nav-pause-icon');

  function setHint(text) {
    if (playerHint) playerHint.textContent = text;
  }
  const DEFAULT_HINT = 'Continuous loop \u2022 Tap to start';

  // Flag to track intentional user pauses vs OS/browser audio interruptions
  let isUserInitiatedPause = false;

  function updatePlayerUI(isPlaying) {
    // Soundroom Console Controls
    if (playIcon) playIcon.style.display = isPlaying ? 'none' : 'block';
    if (pauseIcon) pauseIcon.style.display = isPlaying ? 'block' : 'none';
    if (eqBars) eqBars.classList.toggle('active', isPlaying);
    if (playBtn) playBtn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');

    // Sticky Header Controls
    if (navPlayIcon) navPlayIcon.style.display = isPlaying ? 'none' : 'block';
    if (navPauseIcon) navPauseIcon.style.display = isPlaying ? 'block' : 'none';
    if (navAudioBtn) {
      navAudioBtn.classList.toggle('playing', isPlaying);
      navAudioBtn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    }
  }

  // Toggle audio on user interaction
  function toggleAudio() {
    if (!audioEl) return;
    if (audioEl.paused) {
      isUserInitiatedPause = false;
      audioEl.play().catch(err => {
        console.log('Playback request handled:', err);
      });
    } else {
      isUserInitiatedPause = true;
      audioEl.pause();
    }
  }

  if (playBtn) playBtn.addEventListener('click', toggleAudio);
  if (navAudioBtn) navAudioBtn.addEventListener('click', toggleAudio);

  // 5. Subtle Terminal Typewriter for Hero Tagline (inspired by bhanuharya@sec)
  const taglineEl = document.querySelector('.hero-tagline');
  if (taglineEl) {
    const originalText = taglineEl.textContent.trim();
    taglineEl.textContent = '';
    let charIdx = 0;
    function typeTagline() {
      if (charIdx < originalText.length) {
        taglineEl.textContent += originalText.charAt(charIdx);
        charIdx++;
        setTimeout(typeTagline, 24);
      }
    }
    setTimeout(typeTagline, 250);
  }

  if (audioEl) {
    // 1. Single Looping Mechanism: Never use loop attribute or timeupdate seek.
    // Listen exclusively to 'ended' event per Blog Reliability Standard.
    audioEl.loop = false;
    audioEl.preload = 'metadata';

    // 2. Event-driven UI: Synchronize UI with actual hardware audio state
    audioEl.addEventListener('play', () => {
      updatePlayerUI(true);
    });

    audioEl.addEventListener('pause', () => {
      updatePlayerUI(false);
      // Interruption resilience: If paused by browser/OS without user click, attempt resume once
      if (!isUserInitiatedPause) {
        setTimeout(() => {
          if (!isUserInitiatedPause && audioEl.paused) {
            audioEl.play().catch(() => {});
          }
        }, 300);
      }
    });

    // 3. Visibility Change: Resume if tab becomes visible and wasn't intentionally paused
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && !isUserInitiatedPause && audioEl.paused) {
        audioEl.play().catch(() => {});
      }
    });

    // 4. Single Loop Event Handler (Ended -> Reset & Play)
    audioEl.addEventListener('ended', () => {
      audioEl.currentTime = 0;
      audioEl.play().catch(err => {
        console.warn('Seamless loop restart caught:', err);
      });
    });

    // 5. Autoplay Triggers: ONLY valid mobile gestures (NO scroll, NO mousemove)
    const validInteractionEvents = ['pointerdown', 'touchstart', 'click', 'keydown'];

    const triggerPlayOnGesture = () => {
      if (audioEl.paused && !isUserInitiatedPause) {
        audioEl.play().then(() => {
          setHint(DEFAULT_HINT);
          cleanupAutoplayTriggers();
        }).catch(() => {});
      } else {
        setHint(DEFAULT_HINT);
        cleanupAutoplayTriggers();
      }
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

    // 6. Dynamic Duration: Render duration strictly from loadedmetadata (never hardcoded)
    audioEl.addEventListener('loadedmetadata', () => {
      if (!isNaN(audioEl.duration) && audioEl.duration > 0) {
        if (durationEl) durationEl.textContent = formatTime(audioEl.duration);
      }
    });

    // 7. Timeupdate for progress bar display ONLY (zero seek logic)
    audioEl.addEventListener('timeupdate', () => {
      if (!isNaN(audioEl.duration) && audioEl.duration > 0) {
        const pct = (audioEl.currentTime / audioEl.duration) * 100;
        if (progressFill) progressFill.style.width = pct + '%';
        if (currentTimeEl) currentTimeEl.textContent = formatTime(audioEl.currentTime);
        if (durationEl && durationEl.textContent === '--:--') durationEl.textContent = formatTime(audioEl.duration);
      }
    });

    // Seek via progress bar click
    if (progressBar) {
      progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        if (rect.width <= 0) return;
        const clickPos = (e.clientX - rect.left) / rect.width;
        if (!isNaN(audioEl.duration) && audioEl.duration > 0) {
          audioEl.currentTime = Math.max(0, Math.min(1, clickPos)) * audioEl.duration;
        }
      });
    }
  }
});

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}
