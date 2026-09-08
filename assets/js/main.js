/**
 * naquuuu@pm — Interactive Client Scripts, Scroll-Spy, Audio Looping & Scroll Reveal
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

  // 2. Scroll-Spy: Synchronize Header Nav Highlights with Current Scroll Position
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function updateScrollSpy() {
    let currentId = '';
    const scrollPos = window.scrollY + 130; // offset for sticky navbar

    sections.forEach(section => {
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
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // 4. Audio Player & Continuous Autoplay Logic for Hukum Murphy (Kafin Sulthan)
  const audioEl = document.getElementById('hukum-murphy-audio');
  const playBtn = document.getElementById('play-toggle-btn');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const eqBars = document.getElementById('equalizer-bars');
  const progressFill = document.getElementById('player-progress-fill');
  const progressBar = document.getElementById('player-progress-bar');
  const currentTimeEl = document.getElementById('player-current-time');
  const durationEl = document.getElementById('player-duration');

  // Floating Player Elements
  const floatingBar = document.getElementById('floating-music-bar');
  const floatingPlayBtn = document.getElementById('floating-play-btn');
  const floatingPlayIcon = document.getElementById('floating-play-icon');
  const floatingPauseIcon = document.getElementById('floating-pause-icon');

  function updatePlayerUI(isPlaying) {
    if (isPlaying) {
      if (playIcon) playIcon.style.display = 'none';
      if (pauseIcon) pauseIcon.style.display = 'block';
      if (eqBars) eqBars.classList.add('active');

      if (floatingPlayIcon) floatingPlayIcon.style.display = 'none';
      if (floatingPauseIcon) floatingPauseIcon.style.display = 'block';
      if (floatingBar) floatingBar.classList.add('playing');
    } else {
      if (playIcon) playIcon.style.display = 'block';
      if (pauseIcon) pauseIcon.style.display = 'none';
      if (eqBars) eqBars.classList.remove('active');

      if (floatingPlayIcon) floatingPlayIcon.style.display = 'block';
      if (floatingPauseIcon) floatingPauseIcon.style.display = 'none';
      if (floatingBar) floatingBar.classList.remove('playing');
    }
  }

  function toggleAudio() {
    if (!audioEl) return;
    if (audioEl.paused) {
      audioEl.play().then(() => {
        updatePlayerUI(true);
      }).catch(err => {
        console.log('User interaction required to play audio:', err);
      });
    } else {
      audioEl.pause();
      updatePlayerUI(false);
    }
  }

  if (playBtn) {
    playBtn.addEventListener('click', toggleAudio);
  }

  if (floatingPlayBtn) {
    floatingPlayBtn.addEventListener('click', toggleAudio);
  }

  // Autoplay and Seamless Continuous Playback
  if (audioEl) {
    audioEl.loop = true;

    const tryAutoplay = () => {
      audioEl.play().then(() => {
        updatePlayerUI(true);
        cleanupAutoplayTriggers();
      }).catch(() => {
        // Autoplay policy prevented immediate playback; waiting for user interaction
      });
    };

    const onFirstUserInteraction = () => {
      if (audioEl.paused) {
        audioEl.play().then(() => {
          updatePlayerUI(true);
        }).catch(() => {});
      }
      cleanupAutoplayTriggers();
    };

    function cleanupAutoplayTriggers() {
      window.removeEventListener('click', onFirstUserInteraction);
      window.removeEventListener('scroll', onFirstUserInteraction);
      window.removeEventListener('touchstart', onFirstUserInteraction);
      window.removeEventListener('keydown', onFirstUserInteraction);
    }

    tryAutoplay();

    // Fallback: start on first user interaction
    window.addEventListener('click', onFirstUserInteraction, { once: true, passive: true });
    window.addEventListener('scroll', onFirstUserInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', onFirstUserInteraction, { once: true, passive: true });
    window.addEventListener('keydown', onFirstUserInteraction, { once: true, passive: true });

    audioEl.addEventListener('loadedmetadata', () => {
      if (!isNaN(audioEl.duration) && audioEl.duration > 0) {
        if (durationEl) durationEl.textContent = formatTime(audioEl.duration);
      }
    });

    audioEl.addEventListener('timeupdate', () => {
      if (!isNaN(audioEl.duration) && audioEl.duration > 0) {
        const pct = (audioEl.currentTime / audioEl.duration) * 100;
        if (progressFill) progressFill.style.width = pct + '%';
        if (currentTimeEl) currentTimeEl.textContent = formatTime(audioEl.currentTime);
        if (durationEl) durationEl.textContent = formatTime(audioEl.duration);
      }
    });

    // Seamless looping: don't stop, smoothly restart
    audioEl.addEventListener('ended', () => {
      audioEl.currentTime = 0;
      audioEl.play().catch(() => {});
    });

    if (progressBar) {
      progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickPos = (e.clientX - rect.left) / rect.width;
        if (!isNaN(audioEl.duration)) {
          audioEl.currentTime = clickPos * audioEl.duration;
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
