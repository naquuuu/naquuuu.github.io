/* Command palette (ctrl+k / cmd+k): jump to any page, section or contact.
   Static list, no network calls. Paths are root-relative so it works on every page. */
(function () {
  'use strict';

  var ITEMS = [
    { group: 'sections', label: 'philosophy', hint: 'home', href: '/#philosophy' },
    { group: 'sections', label: 'how i think about systems', hint: 'home', href: '/#operating-philosophy' },
    { group: 'sections', label: 'selected work', hint: 'home', href: '/#artifacts' },
    { group: 'sections', label: 'notes & technical toolkit', hint: 'home', href: '/#notes' },
    { group: 'sections', label: 'culture as fuel', hint: 'culture lens', href: '/#culture-philosophy' },
    { group: 'sections', label: 'hands, ears, closet', hint: 'culture lens', href: '/#culture-artifacts' },
    { group: 'sections', label: 'notes: music, clothes', hint: 'culture lens', href: '/#culture-notes' },
    { group: 'sections', label: 'contact', hint: 'home', href: '/#inquiries' },
    { group: 'work', label: 'mapclub: product operations workspace', hint: 'senior product owner', href: '/experience/mapclub/' },
    { group: 'work', label: 'traveloka: flight refund engine', hint: 'product manager', href: '/experience/traveloka/' },
    { group: 'work', label: 'bcg: techno-commercial tenders', hint: 'project specialist', href: '/experience/bcg/' },
    { group: 'work', label: '3m phb bio-mask', hint: 'competition', href: '/portfolio/3m-bio-mask/' },
    { group: 'work', label: 'hotsand clean thermal microgrid', hint: 'competition', href: '/portfolio/schneider-hotsand/' },
    { group: 'work', label: 'all work experience', hint: 'overview', href: '/experience/' },
    { group: 'notes', label: 'relay recovery: prove the check can run', hint: 'systems notebook', href: '/performance/recovery/' },
    { group: 'notes', label: 'reverse-engineering client binaries', hint: 'architecture', href: '/blog/reverse-engineering-client-binaries/' },
    { group: 'notes', label: 'building a product operating system', hint: 'systems', href: '/blog/building-an-autonomous-product-operating-system/' },
    { group: 'notes', label: 'the geometry of shibuya-kei', hint: 'culture', href: '/blog/the-geometry-of-shibuya-kei/' },
    { group: 'notes', label: 'smart tailoring for everyday life', hint: 'culture', href: '/blog/smart-tailoring-as-kinetic-infrastructure/' },
    { group: 'notes', label: 'all essays & notes', hint: 'archive', href: '/blog/' },
    { group: 'contact', label: 'open cv (pdf)', hint: 'download', href: '/assets/Krishna_CV_2026.pdf', external: true },
    { group: 'contact', label: 'email', hint: 'rbkrishnamurti@gmail.com', href: 'mailto:rbkrishnamurti@gmail.com' },
    { group: 'contact', label: 'whatsapp', hint: 'chat', href: 'https://wa.me/6282112255009', external: true },
    { group: 'contact', label: 'linkedin', hint: 'profile', href: 'https://www.linkedin.com/in/rbkrishnamurti/', external: true },
    { group: 'contact', label: 'instagram', hint: '@naquuuu_', href: 'https://www.instagram.com/naquuuu_/', external: true },
    { group: 'contact', label: 'spotify', hint: 'listening', href: 'https://open.spotify.com/user/1j69whrwxcopwxxto9n74zcdf', external: true },
    { group: 'contact', label: 'github', hint: 'naquuuu', href: 'https://github.com/naquuuu', external: true }
  ];

  var root, input, list, results = [], active = 0, lastFocus = null;

  function build() {
    root = document.createElement('div');
    root.className = 'cmdk';
    root.hidden = true;
    root.innerHTML =
      '<div class="cmdk-backdrop" data-cmdk-close></div>' +
      '<div class="cmdk-panel" role="dialog" aria-modal="true" aria-label="search this site">' +
      '  <div class="cmdk-search">' +
      '    <span class="cmdk-prompt" aria-hidden="true">&gt;</span>' +
      '    <input class="cmdk-input" type="text" placeholder="search pages, work, notes, contact" aria-label="search this site" aria-controls="cmdk-list" autocomplete="off" spellcheck="false">' +
      '    <kbd class="cmdk-kbd">esc</kbd>' +
      '  </div>' +
      '  <ul class="cmdk-list" id="cmdk-list" role="listbox"></ul>' +
      '  <div class="cmdk-foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>enter</kbd> open</span></div>' +
      '</div>';
    document.body.appendChild(root);
    input = root.querySelector('.cmdk-input');
    list = root.querySelector('.cmdk-list');
    root.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-cmdk-close')) close();
    });
    input.addEventListener('input', render);
    root.addEventListener('keydown', onKey);
    list.addEventListener('mousemove', function (e) {
      var li = e.target.closest('[data-i]');
      if (li) setActive(+li.getAttribute('data-i'));
    });
    list.addEventListener('click', function (e) {
      var li = e.target.closest('[data-i]');
      if (li) go(+li.getAttribute('data-i'));
    });
  }

  function render() {
    var q = input.value.trim().toLowerCase();
    results = ITEMS.filter(function (it) {
      if (!q) return true;
      return (it.label + ' ' + it.hint + ' ' + it.group).toLowerCase().indexOf(q) !== -1;
    });
    active = 0;
    var html = '', group = '';
    results.forEach(function (it, i) {
      if (it.group !== group) {
        group = it.group;
        html += '<li class="cmdk-group" role="presentation">' + group + '</li>';
      }
      html += '<li class="cmdk-item" role="option" id="cmdk-opt-' + i + '" data-i="' + i + '">' +
        '<span class="cmdk-label">' + it.label + '</span><span class="cmdk-hint">' + it.hint + (it.external ? ' ↗' : '') + '</span></li>';
    });
    if (!results.length) html = '<li class="cmdk-empty" role="presentation">nothing matches. try "cv", "refund" or "shibuya".</li>';
    list.innerHTML = html;
    setActive(0);
  }

  function setActive(i) {
    if (!results.length) return;
    active = Math.max(0, Math.min(results.length - 1, i));
    list.querySelectorAll('.cmdk-item').forEach(function (el) {
      var on = +el.getAttribute('data-i') === active;
      el.classList.toggle('is-active', on);
      el.setAttribute('aria-selected', on ? 'true' : 'false');
      if (on) el.scrollIntoView({ block: 'nearest' });
    });
    input.setAttribute('aria-activedescendant', 'cmdk-opt-' + active);
  }

  function go(i) {
    var it = results[i];
    if (!it) return;
    if (it.external && it.href.indexOf('mailto:') !== 0) {
      close();
      window.open(it.href, '_blank', 'noopener');
    } else if (!jumpInPage(it.href)) {
      close();
      window.location.href = it.href;
    }
  }

  // Homepage sections live in two lens panels; open the target's lens before scrolling to it.
  function jumpInPage(href) {
    var hashAt = href.indexOf('#');
    if (hashAt === -1 || (href.slice(0, hashAt) || '/') !== '/') return false;
    var here = window.location.pathname;
    if (here !== '/' && here !== '/index.html') return false;
    var id = href.slice(hashAt + 1);
    var el = document.getElementById(id);
    if (!el) return false;
    close(false);
    var panel = el.closest('.view-panel');
    if (panel && !panel.classList.contains('active')) {
      var tab = document.getElementById(panel.id === 'view-culture' ? 'tab-mode-culture' : 'tab-mode-systems');
      if (tab) tab.click();
    }
    if (history.pushState) history.pushState(null, '', '#' + id);
    el.scrollIntoView({ block: 'start' });
    // move focus to the section instead of back to the trigger
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
    return true;
  }

  function onKey(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); go(active); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'Tab') { e.preventDefault(); }
  }

  function open() {
    if (!root) build();
    lastFocus = document.activeElement;
    root.hidden = false;
    document.documentElement.classList.add('cmdk-open');
    input.value = '';
    render();
    input.focus();
  }

  function close(restoreFocus) {
    if (!root || root.hidden) return;
    root.hidden = true;
    document.documentElement.classList.remove('cmdk-open');
    if (restoreFocus !== false && lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (root && !root.hidden) close(); else open();
    }
  });

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-cmdk-open]');
    if (t) { e.preventDefault(); open(); }
  });

  // Show the platform's shortcut on trigger buttons.
  var mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  document.querySelectorAll('[data-cmdk-key]').forEach(function (el) {
    el.textContent = mac ? '⌘ k' : 'ctrl k';
  });
})();
