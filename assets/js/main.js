/**
 * krishna@pm — Client Script & Interactive Workstation
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
        copyBtn.style.color = '#27C93F';
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
      help: 'Available commands: whoami, focus, experience, skills, contact, brother, clear',
      whoami: 'Krishna (Ramadhana Bhanuharya Krishnamurti) — Technical Product Manager & Systems Architect.',
      focus: 'Bridging AI agentic workflows, revenue-generating e-commerce platforms, and zero-slop technical requirements.',
      experience: 'Product Manager @ MAPCLUB (2026-Present) | Product Manager @ Traveloka (2024-2026) | Project Specialist @ BCG (2023-2024).',
      skills: 'SQL, Python, LLM Workflows, RPA, System Architecture, MoSCoW Prioritization, Techno-Commercial Strategy.',
      contact: 'Email: rbkrishnamurti@gmail.com | LinkedIn: https://www.linkedin.com/in/rbkrishnamurti/',
      brother: 'Twin brother: Wishnumurti / Harya (@bhanuharya — Security Engineer). Check out his blog at https://bhanuharya.github.io/',
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
        line.innerHTML = `<span class="term-prompt">visitor@krishna:~$</span> <span class="term-cmd">${cmd}</span>`;

        const out = document.createElement('div');
        out.className = 'term-out';

        if (commands[cmd]) {
          out.textContent = commands[cmd];
        } else if (cmd === '') {
          // empty
        } else {
          out.innerHTML = `command not found: <code>${cmd}</code>. Type <code style="color:var(--accent-crimson)">help</code> for available commands.`;
        }

        termHistory.appendChild(line);
        if (cmd !== '') termHistory.appendChild(out);
      }
    });
  }
});
