/**
 * naquuuu@pm — Client Script, Audio Player & Interactive Cyber-Physical Workstation
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Code block copy button
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

  // 2. Interactive Terminal Command Parser (for homepage terminal)
  const termInput = document.getElementById('term-cmd-input');
  const termHistory = document.getElementById('term-cmd-history');

  if (termInput && termHistory) {
    const commands = {
      help: 'Available commands: whoami, mission, hardware, music, art, arsenal, experience, proof_points, contact, brother, clear',
      whoami: 'Krishna (Ramadhana Bhanuharya Krishnamurti) — Resilient Cyber-Physical Product Lead & Systems Architect (Bits + Atoms).',
      mission: 'National Archipelago Resilience: Engineering rugged, decentralized, failure-proof hardware & telemetry that survives Indonesia\'s 3T regions and 18-hour offline maritime transit.',
      hardware: 'Focus areas: TinyML on ESP32, edge sensor telemetry, battery-free thermal storage, tactile non-screen physical interfaces.',
      music: 'Monthly telemetry: 2,733 mins listened (862% > Indonesia avg). Heavy rotation: Hukum Murphy (Kafin Sulthan), Attention 250 (NewJeans), Wesley\'s Theory (Kendrick Lamar), Oddie Agam. Plays guitar.',
      art: 'Canvas painter in acrylic/oil: Exploring textural friction between painterly organic chaos and deterministic engineering systems.',
      arsenal: 'Gunners faithful: Tactical appreciation of positional play, high-press counter-transitions, and defensive rest-structures.',
      experience: 'PO @ MAPCLUB Digital Asia | PM @ Traveloka (Rp10Bn net revenue engine) | Project Specialist @ BCG ($400M industrial EPC pipeline).',
      proof_points: '1) Cold-Chain IoT Node | 2) Tactile Spotify Wearable | 3) Disruption Engine | 4) 3M PHB Bio-Mask (Award Winner) | 5) Schneider HotSand (Award Winner).',
      contact: 'Email: rbkrishnamurti@gmail.com | LinkedIn: https://www.linkedin.com/in/rbkrishnamurti/ | Spotify: @1j69whrwxcopwxxto9n74zcdf',
      brother: 'Twin brother: Wishnumurti / Harya (@bhanuharya — Security & Infrastructure Engineer). Check out his blog at https://bhanuharya.github.io/',
      clear: 'CLEAR'
    };

    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = termInput.value.trim().toLowerCase();
        termInput.value = '';

        if (cmd === 'clear') {
          termHistory.innerHTML = '';
          return;
        }

        const line = document.createElement('div');
        line.className = 'term-line';
        line.innerHTML = `<span class="term-prompt">visitor@naquuuu:~$</span> <span class="term-cmd">${escapeHtml(cmd)}</span>`;

        const out = document.createElement('div');
        out.className = 'term-out';

        if (commands[cmd]) {
          out.textContent = commands[cmd];
        } else if (cmd === '') {
          // empty
        } else {
          out.innerHTML = `command not found: <code>${escapeHtml(cmd)}</code>. Type <code style="color:var(--accent-crimson)">help</code> for command list.`;
        }

        termHistory.appendChild(line);
        if (cmd !== '') termHistory.appendChild(out);
      }
    });
  }

  // 3. Interactive Portfolio Proof Points Tab Filter
  const filterBtns = document.querySelectorAll('.portfolio-tab-btn');
  const proofCards = document.querySelectorAll('.proof-card');

  if (filterBtns.length > 0 && proofCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        proofCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter || category.includes(filter)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 4. Interactive Systems Architecture Flowchart Inspector
  const flowchartNodes = document.querySelectorAll('.flowchart-node');
  const mobileStageBtns = document.querySelectorAll('.flowchart-stage-btn');
  const inspectorBox = document.getElementById('flowchart-inspector');

  const nodeDescriptions = {
    'node-sensor': {
      title: '01 / PHYSICAL SENSOR NODE (ATOMS)',
      desc: 'Ruggedized IP67 edge unit with DHT22/PT100 temperature probes, multi-axis accelerometer, and shock sensors designed for high-humidity, marine tropical environments. Operates on solar-boosted LiFePO4 battery pack with ultra-low sleep draw (<15µA).'
    },
    'node-tinyml': {
      title: '02 / EDGE TINYML & OFFLINE STATE MACHINE (FIRMWARE)',
      desc: 'Runs quantized TensorFlow Lite Micro / TinyML anomaly detection on an ESP32 dual-core MCU. Detects thermal runway and shock degradation locally without cloud ping. Buffers time-series telemetry in circular SPI flash across 18+ hour offline maritime transit.'
    },
    'node-sync': {
      title: '03 / ARCHIPELAGO LOW-BANDWIDTH SYNC (BITS)',
      desc: 'Opportunistic delta synchronizer utilizing CBOR binary serialization over intermittent 2G/LoRa/eSIM connections. Automatically establishes cryptographic HMAC integrity when vessel enters port coverage, draining buffered telemetry in seconds.'
    },
    'node-interface': {
      title: '04 / TACTILE HUMAN INTERFACE (COGNITIVE RESILIENCE)',
      desc: 'Physical, high-contrast LED status arrays and tactile rotary dials for non-screen field operation. Fishermen, dock workers, and cold-storage operators receive immediate haptic/optical threshold validation without needing smartphones or app downloads.'
    }
  };

  function updateFlowchartNode(nodeId) {
    flowchartNodes.forEach(n => {
      if (n.getAttribute('data-node') === nodeId) {
        n.classList.add('active');
      } else {
        n.classList.remove('active');
      }
    });

    mobileStageBtns.forEach(b => {
      if (b.getAttribute('data-node') === nodeId) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    if (inspectorBox && nodeDescriptions[nodeId]) {
      inspectorBox.innerHTML = `
        <div class="inspector-title">> ${nodeDescriptions[nodeId].title}</div>
        <div>${nodeDescriptions[nodeId].desc}</div>
      `;
    }
  }

  if (flowchartNodes.length > 0) {
    flowchartNodes.forEach(node => {
      node.addEventListener('click', () => {
        const nodeId = node.getAttribute('data-node');
        updateFlowchartNode(nodeId);
      });
    });
  }

  if (mobileStageBtns.length > 0) {
    mobileStageBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const nodeId = btn.getAttribute('data-node');
        updateFlowchartNode(nodeId);
      });
    });
  }

  // 5. Interactive Spotify Soundroom Track Selector
  const trackTiles = document.querySelectorAll('.track-tile');
  const nowPlayingDisplay = document.getElementById('soundroom-now-playing');

  if (trackTiles.length > 0 && nowPlayingDisplay) {
    trackTiles.forEach(tile => {
      tile.addEventListener('click', () => {
        trackTiles.forEach(t => t.classList.remove('playing'));
        tile.classList.add('playing');

        const title = tile.getAttribute('data-title');
        const artist = tile.getAttribute('data-artist');
        const plays = tile.getAttribute('data-plays');

        nowPlayingDisplay.innerHTML = `
          <div style="font-size:0.72rem; color:var(--text-muted); font-family:var(--font-mono);">[CURRENT ROTATION]</div>
          <div style="font-size:1.05rem; font-weight:800; color:#1DB954; margin-top:2px;">${escapeHtml(title)}</div>
          <div style="font-size:0.82rem; color:var(--text-secondary);">${escapeHtml(artist)} • <span style="color:var(--term-cyan); font-family:var(--font-mono);">${escapeHtml(plays)}</span></div>
        `;
      });
    });
  }

  // 6. Real Audio Playback: Kafin Sulthan — Hukum Murphy
  const audioEl = document.getElementById('hukum-murphy-audio');
  const playBtn = document.getElementById('play-toggle-btn');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const eqBars = document.getElementById('equalizer-bars');
  const progressFill = document.getElementById('player-progress-fill');
  const progressBar = document.getElementById('player-progress-bar');
  const currentTimeEl = document.getElementById('player-current-time');
  const durationEl = document.getElementById('player-duration');

  if (audioEl && playBtn) {
    playBtn.addEventListener('click', () => {
      if (audioEl.paused) {
        audioEl.play().then(() => {
          if (playIcon) playIcon.style.display = 'none';
          if (pauseIcon) pauseIcon.style.display = 'block';
          if (eqBars) eqBars.classList.add('active');
        }).catch(err => {
          console.warn('Playback error:', err);
        });
      } else {
        audioEl.pause();
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
        if (eqBars) eqBars.classList.remove('active');
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

    audioEl.addEventListener('ended', () => {
      if (playIcon) playIcon.style.display = 'block';
      if (pauseIcon) pauseIcon.style.display = 'none';
      if (eqBars) eqBars.classList.remove('active');
      if (progressFill) progressFill.style.width = '0%';
      if (currentTimeEl) currentTimeEl.textContent = '0:00';
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

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}
