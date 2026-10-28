/* Command palette (ctrl+k / cmd+k): jump to any page, section or contact.
   Static list, no network calls. Paths are root-relative so it works on every page. */
(function () {
  'use strict';

  // Email and whatsapp are stored reversed + base64 and only assembled in the
  // browser, so the raw html carries no address or number for scrapers. Pages
  // are also robots noindex; this keeps the contacts out of harvested lists.
  function unpack(s) { return atob(s).split('').reverse().join(''); }
  var CONTACT = {
    mail: 'mailto:' + unpack('bW9jLmxpYW1nQGl0cnVtYW5oc2lya2Jy'),
    wa: 'https://wa.me/' + unpack('OTAwNTUyMjExMjgyNg==')
  };
  function wireContacts() {
    var links = document.querySelectorAll('a[data-contact]');
    for (var i = 0; i < links.length; i++) {
      var href = CONTACT[links[i].getAttribute('data-contact')];
      if (href) links[i].href = href;
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireContacts);
  else wireContacts();

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
    { group: 'contact', label: 'request cv', hint: 'email', href: CONTACT.mail },
    { group: 'contact', label: 'email', hint: 'inbox', href: CONTACT.mail },
    { group: 'contact', label: 'whatsapp', hint: 'chat', href: CONTACT.wa, external: true },
    { group: 'contact', label: 'linkedin', hint: 'profile', href: 'https://www.linkedin.com/in/rbkrishnamurti/', external: true },
    { group: 'contact', label: 'instagram', hint: '@naquuuu_', href: 'https://www.instagram.com/naquuuu_/', external: true },
    { group: 'contact', label: 'spotify', hint: 'listening', href: 'https://open.spotify.com/user/1j69whrwxcopwxxto9n74zcdf', external: true },
    { group: 'contact', label: 'github', hint: 'naquuuu', href: 'https://github.com/naquuuu', external: true },
  { label: "murphy's law for people who build with ai", hint: "13-slide presentation · reliability and human checks", group: "notes", href: "/blog/murphys-law-for-building-with-ai/" },

  ];

  var root, input, list, closeButton, results = [], active = 0, lastFocus = null, closeTimer = null;

  function build() {
    root = document.createElement('div');
    root.className = 'cmdk';
    root.hidden = true;
    root.innerHTML =
      '<div class="cmdk-backdrop" data-cmdk-close></div>' +
      '<div class="cmdk-panel" role="dialog" aria-modal="true" aria-label="search this site">' +
      '  <div class="cmdk-search">' +
      '    <span class="cmdk-prompt" aria-hidden="true">&gt;</span>' +
      '    <input class="cmdk-input" type="text" role="combobox" aria-expanded="false" aria-autocomplete="list" aria-haspopup="listbox" placeholder="search pages, work, notes, contact" aria-label="search this site" aria-controls="cmdk-list" autocomplete="off" spellcheck="false">' +
      '    <button class="cmdk-close" type="button" aria-label="close search"><span aria-hidden="true">×</span></button>' +
      '  </div>' +
      '  <ul class="cmdk-list" id="cmdk-list" role="listbox" aria-label="search results" aria-live="polite"></ul>' +
      '  <div class="cmdk-foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>enter</kbd> open</span></div>' +
      '</div>';
    document.body.appendChild(root);
    input = root.querySelector('.cmdk-input');
    list = root.querySelector('.cmdk-list');
    closeButton = root.querySelector('.cmdk-close');
    root.addEventListener('click', function (e) {
      if (e.target.closest('.cmdk-close') || e.target.hasAttribute('data-cmdk-close')) close();
    });
    input.addEventListener('input', render);
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
    if (!results.length) html = '<li class="cmdk-empty" role="status">nothing matches. try "cv", "refund" or "shibuya".</li>';
    list.innerHTML = html;
    setActive(0);
  }

  function setActive(i) {
    if (!results.length) { input.removeAttribute('aria-activedescendant'); return; }
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

  function open() {
    if (!root) build();
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    lastFocus = document.activeElement;
    syncViewport();
    root.hidden = false;
    root.classList.remove('cmdk-open');
    document.documentElement.classList.add('cmdk-open');
    input.setAttribute('aria-expanded', 'true');
    input.value = '';
    render();
    input.focus();
    // one frame at the start state, then animate in (2026-10-15 motion kit)
    requestAnimationFrame(function () { root.classList.add('cmdk-open'); });
  }

  function close(restoreFocus) {
    if (!root || root.hidden) return;
    root.classList.remove('cmdk-open');
    input.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('cmdk-open');
    if (restoreFocus !== false && lastFocus && lastFocus.focus && lastFocus.isConnected && !lastFocus.closest('[hidden],[aria-hidden="true"]')) lastFocus.focus();
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(function () {
      closeTimer = null;
      root.hidden = true;
    }, 80);
  }

  document.addEventListener('keydown', function (e) {
    var shortcut = (e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K');
    if (shortcut) {
      e.preventDefault(); e.stopPropagation();
      if (root && !root.hidden) close(); else open();
      return;
    }
    if (!root || root.hidden) return;
    e.stopPropagation();
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) { if (document.activeElement === input) closeButton.focus(); else input.focus(); }
      else { if (document.activeElement === closeButton) input.focus(); else closeButton.focus(); }
    } else if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); if (document.activeElement === closeButton) close(); else go(active); }
  }, true);


  function injectArchiveTrigger() {
    var nav = document.querySelector('.site-header .nav[data-cmdk-mobile-search]');
    if (!nav || nav.querySelector('[data-cmdk-open]')) return;
    var button = document.createElement('button');
    button.type = 'button'; button.className = 'cmdk-mobile-trigger'; button.setAttribute('data-cmdk-open', '');
    button.setAttribute('aria-label', 'search this site'); button.title = 'search this site';
    button.innerHTML = '<svg aria-hidden="true" focusable="false" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/></svg>';
    var links = nav.querySelector('.nav-links');
    if (links) links.insertAdjacentElement('afterend', button); else nav.appendChild(button);
  }
  injectArchiveTrigger();

  function syncViewport() {
    var vv = window.visualViewport, html = document.documentElement;
    html.style.setProperty('--cmdk-viewport-height', Math.max(0, vv ? vv.height : window.innerHeight) + 'px');
    html.style.setProperty('--cmdk-viewport-top', Math.max(0, vv ? vv.offsetTop : 0) + 'px');
  }
  syncViewport();
  window.addEventListener('resize', syncViewport);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', syncViewport);
    window.visualViewport.addEventListener('scroll', syncViewport);
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-cmdk-open]');
    if (t) { e.preventDefault(); open(); }
  });

  var currentScript = document.currentScript;
  if (currentScript && !document.querySelector('link[href*="/assets/css/palette.css"]')) {
    var cssHref = currentScript.src.replace(/\/assets\/js\/palette\.js(?:\?.*)?$/, '/assets/css/palette.css?v=20261022ui');
    var styleLink = document.createElement('link'); styleLink.rel = 'stylesheet'; styleLink.href = cssHref;
    document.head.appendChild(styleLink);
  }

  // Show the platform's shortcut on trigger buttons.
  var mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  document.querySelectorAll('[data-cmdk-key]').forEach(function (el) {
    el.textContent = mac ? '⌘ k' : 'ctrl k';
  });
})();
