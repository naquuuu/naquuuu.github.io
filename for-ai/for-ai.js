/* for-ai/for-ai.js
   Browser-safe, dependency-free. Renders everything from content.js using
   textContent and element creation only. No user input ever reaches HTML. */

import {
  config,
  passwords,
  landing,
  bookletGate,
  kitchenGate,
  photos,
  playlist,
  booklet,
  kitchen,
} from './content.js?v=20261024secret';

/* ------------------------------------------------------------------ storage */

function createStore(kind) {
  const mem = new Map();
  let ok = true;
  try {
    const probe = '__fa_probe__';
    window[kind].setItem(probe, '1');
    window[kind].removeItem(probe);
  } catch (err) {
    ok = false;
  }
  return {
    get(key) {
      if (ok) {
        try {
          return window[kind].getItem(key);
        } catch (err) {
          ok = false;
        }
      }
      return mem.has(key) ? mem.get(key) : null;
    },
    set(key, value) {
      const text = String(value);
      mem.set(key, text);
      if (ok) {
        try {
          window[kind].setItem(key, text);
        } catch (err) {
          ok = false;
        }
      }
    },
    remove(key) {
      mem.delete(key);
      if (ok) {
        try {
          window[kind].removeItem(key);
        } catch (err) {
          ok = false;
        }
      }
    },
  };
}

const stores = { local: createStore('localStorage'), session: createStore('sessionStorage') };

/* ------------------------------------------------------------------- helpers */

function el(tag, props, children) {
  const node = document.createElement(tag);
  if (props) {
    for (const key of Object.keys(props)) {
      const value = props[key];
      if (value === null || value === undefined || value === false) continue;
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else if (key === 'dataset') Object.assign(node.dataset, value);
      else if (key === 'on') {
        for (const name of Object.keys(value)) node.addEventListener(name, value[name]);
      } else {
        node.setAttribute(key, value === true ? '' : String(value));
      }
    }
  }
  const kids = children || [];
  for (const child of kids) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return node;
}

function photoImg(photo, options) {
  const opts = options || {};
  return el('img', {
    src: opts.small ? photo.small : photo.src,
    alt: photo.alt,
    width: photo.w,
    height: photo.h,
    loading: opts.loading || 'lazy',
    decoding: 'async',
  });
}

function reducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function playlistBlock() {
  const frame = el('iframe', {
    class: 'fa-iframe',
    src: playlist.embed,
    title: playlist.title,
    height: playlist.height,
    loading: 'lazy',
    allow: 'clipboard-write; encrypted-media; fullscreen; picture-in-picture',
    frameborder: '0',
  });
  const open = el('a', {
    class: 'fa-link',
    href: playlist.open,
    target: '_blank',
    rel: 'noopener noreferrer',
    'aria-label': playlist.openAria,
    text: playlist.openLabel,
  });
  return el('div', { class: 'fa-playlist' }, [frame, open]);
}

/* -------------------------------------------------------------------- dialogs */

const dialogState = new WeakMap();

function openDialog(dialog, focusSelector, trigger) {
  if (!dialog || dialog.open) return;
  const opener = trigger || document.activeElement;
  const remember = window.scrollY;
  dialogState.set(dialog, { opener: opener, y: remember });
  document.documentElement.classList.add('fa-dialog-open');
  dialog.showModal();
  const target =
    (focusSelector && dialog.querySelector(focusSelector)) ||
    dialog.querySelector('[data-fa-initial]') ||
    dialog.querySelector('button, a[href], input');
  if (target) target.focus();
  else dialog.focus();
}

function wireDialog(dialog) {
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('fa-dialog-open');
    const saved = dialogState.get(dialog);
    if (!saved) return;
    window.scrollTo({ top: saved.y, behavior: 'instant' });
    if (saved.opener && saved.opener.isConnected && typeof saved.opener.focus === 'function') {
      saved.opener.focus({ preventScroll: true });
    }
    dialogState.delete(dialog);
  });
}

function closeButton(label, className) {
  const btn = el('button', {
    type: 'button',
    class: className || 'fa-dialog-close',
    'aria-label': label,
    text: 'close ×',
  });
  btn.addEventListener('click', () => {
    const dialog = btn.closest('dialog');
    if (dialog) dialog.close();
  });
  return btn;
}

/* ---------------------------------------------------------------------- theme */

function initTheme() {
  const button = document.querySelector('[data-fa-theme]');
  if (!button) return;
  const label = button.querySelector('[data-fa-theme-label]');
  let mode = 'systems';
  const stored = stores.local.get(config.themeKey);
  if (stored === 'culture' || stored === 'systems') mode = stored;

  function apply() {
    document.body.setAttribute('data-mode', mode);
    const next = mode === 'culture' ? 'systems' : 'culture';
    button.setAttribute('aria-label', 'colour theme: ' + mode + '. switch to ' + next + '.');
    if (label) label.textContent = mode;
  }

  apply();

  button.addEventListener('click', () => {
    mode = mode === 'culture' ? 'systems' : 'culture';
    apply();
    stores.local.set(config.themeKey, mode);
  });
}

/* ----------------------------------------------------------------------- gate */

function wireGate(options) {
  const root = options.root;
  const form = root.querySelector('form');
  if (!form) return;

  const label = root.querySelector('[data-fa-gate-label]');
  const title = root.querySelector('[data-fa-gate-title]');
  const sub = root.querySelector('[data-fa-gate-sub]');
  const field = root.querySelector('[data-fa-gate-field]');
  const submit = root.querySelector('[data-fa-gate-submit]');
  const input = root.querySelector('[data-fa-input]');
  const error = root.querySelector('[data-fa-error]');
  const expected = options.password.trim().toLowerCase();
  let done = false;

  if (label) label.textContent = options.copy.label;
  if (title) title.textContent = options.copy.title;
  if (sub) sub.textContent = options.copy.sub;
  if (field) field.textContent = options.copy.field;
  if (submit) submit.textContent = options.copy.cta;

  function unlock(fromForm) {
    if (done) return;
    done = true;
    stores.session.set(options.sessionKey, '1');
    document.documentElement.setAttribute('data-fa-unlocked', '1');
    options.onUnlock({ focus: fromForm === true });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = (input && input.value ? input.value : '').trim().toLowerCase();
    if (value && value === expected) {
      error.textContent = '';
      input.removeAttribute('aria-invalid');
      unlock(true);
      return;
    }
    error.textContent = options.copy.error;
    if (input) {
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      input.select();
    }
  });

  if (input) {
    input.addEventListener('input', () => {
      if (!error.textContent) return;
      error.textContent = '';
      input.removeAttribute('aria-invalid');
    });
  }

  if (stores.session.get(options.sessionKey) === '1') {
    unlock(false);
  } else {
    document.documentElement.removeAttribute('data-fa-unlocked');
  }
}

/* -------------------------------------------------------------------- landing */

function initLanding() {
  const host = document.querySelector('[data-fa-landing]');
  if (!host) return;

  const label = host.querySelector('[data-fa-label]');
  const title = host.querySelector('[data-fa-title]');
  const date = host.querySelector('[data-fa-date]');
  const supporting = host.querySelector('[data-fa-supporting]');
  const entries = host.querySelector('[data-fa-entries]');

  if (label) label.textContent = landing.label;
  if (title) {
    title.textContent = '';
    title.append(el('span', { class: 'fa-title-line', text: landing.titleLines[0] }),
      el('span', { class: 'fa-title-line', text: landing.titleLines[1] }),
      el('em', { class: 'fa-title-dedication', text: landing.titleLines[2] }));
    title.setAttribute('aria-label', landing.title);
  }
  if (date) date.textContent = landing.date;
  if (supporting) supporting.textContent = landing.supporting;

  for (const [index, entry] of landing.entries.entries()) {
    const titleId = 'fa-entry-' + entry.key + '-title';
    const card = el('a', {
      class: 'fa-entry',
      href: entry.href,
      'aria-labelledby': titleId,
    }, [
      el('span', { class: 'fa-entry-number', 'aria-hidden': 'true', text: '0' + (index + 1) }),
      el('h2', { class: 'fa-entry-title', id: titleId, text: entry.title }),
      el('p', { class: 'fa-entry-text', text: entry.description }),
      el('span', { class: 'fa-entry-cta', text: entry.cta }),
    ]);
    entries.append(card);
  }
  host.append(el('div', {class: 'fa-colophon'}, [
    ...landing.footer.map(text => el('span', {text})),
  ]));
}

/* -------------------------------------------------------------------- booklet */

function buildBooklet(host) {
  const cover = booklet.cover;
  const article = el('article', { class: 'fa-booklet' });

  article.append(
    el('header', { class: 'fa-cover' }, [
      el('p', { class: 'fa-label', text: cover.label }),
      el('h1', {
        class: 'fa-display',
        'data-fa-focus': '',
        tabindex: '-1',
        text: cover.title,
      }),
      el('p', { class: 'fa-date', text: cover.date }),
      el('figure', { class: 'fa-cover-photo' }, [
        photoImg(photos[cover.photo], { loading: 'eager' }),
      ]),
      el('p', { class: 'fa-dedication', text: cover.dedication }),
      el('p', { class: 'fa-lede', text: cover.intro }),
      el('a', { class: 'fa-turn', href: '#fa-moments', text: cover.turn }),
    ])
  );

  const lightbox = makeLightbox();

  const gallery = el('ul', { class: 'fa-gallery' });
  for (const id of booklet.moments.photos) {
    const photo = photos[id];
    const shot = el('button', { type: 'button', class: 'fa-shot', 'aria-label': 'open ' + photo.alt }, [
      photoImg(photo, { small: true }),
    ]);
    shot.addEventListener('click', () => lightbox.open(photo, shot));
    gallery.append(el('li', null, [shot]));
  }

  article.append(
    el('section', { class: 'fa-section', id: 'fa-moments', 'aria-labelledby': 'fa-moments-title' }, [
      el('p', { class: 'fa-label', text: booklet.moments.label }),
      el('h2', { class: 'fa-h2', id: 'fa-moments-title', text: booklet.moments.title }),
      gallery,
    ])
  );

  article.append(
    el('section', { class: 'fa-section fa-section--songs', 'aria-labelledby': 'fa-songs-title' }, [
      el('p', { class: 'fa-label', text: booklet.songs.label }),
      el('h2', { class: 'fa-h2 fa-caption', id: 'fa-songs-title', text: booklet.songs.caption }),
      playlistBlock(),
    ])
  );

  for (const chapter of booklet.chapters) {
    article.append(buildChapter(chapter, lightbox));
  }

  const letterDialog = buildLetter();
  article.append(
    el('footer', { class: 'fa-foot' }, [
      el('p', { class: 'fa-label', text: 'for ayii, from na.' }),
      el('a', { class: 'fa-link', href: '/for-ai/', text: 'back to the little edition' }),
    ])
  );

  host.append(article, letterDialog, lightbox.dialog);

  const secret = article.querySelector('[data-fa-secret]');
  if (secret) {
    secret.addEventListener('click', () => openDialog(letterDialog, '.fa-dialog-close', secret));
  }
}

function buildChapter(chapter, lightbox) {
  const section = el('section', {
    class: 'fa-section fa-chapter',
    id: 'fa-chapter-' + chapter.number,
    'aria-labelledby': 'fa-chapter-' + chapter.number + '-title',
  });

  section.append(
    el('p', { class: 'fa-label', text: chapter.label }),
    el('h2', { class: 'fa-display fa-display--chapter', id: 'fa-chapter-' + chapter.number + '-title', text: chapter.title }),
    el('p', { class: 'fa-date', text: chapter.subtitle })
  );

  if (chapter.photoBefore) {
    const photo = photos[chapter.photoBefore];
    const button = el('button', { type: 'button', class: 'fa-wide-shot', 'aria-label': 'open ' + photo.alt }, [
      photoImg(photo),
    ]);
    button.addEventListener('click', () => lightbox.open(photo, button));
    section.append(el('figure', { class: 'fa-wide-photo' }, [button]));
  }

  if (chapter.text) {
    section.append(el('p', { class: 'fa-lede', text: chapter.text }));
  }

  if (chapter.items) {
    const list = el('div', { class: 'fa-itinerary' });
    for (const item of chapter.items) {
      list.append(
        el('div', { class: 'fa-stop' }, [
          el('h3', { class: 'fa-stop-title', text: item.title }),
          el('p', { class: 'fa-stop-text', text: item.text }),
        ])
      );
    }
    section.append(list);
  }

  if (chapter.button) {
    const secret = el('button', {
      type: 'button',
      class: 'fa-secret',
      'aria-haspopup': 'dialog',
      'data-fa-secret': '',
      text: chapter.button,
    });
    section.append(el('div', { class: 'fa-secret-wrap' }, [secret]));
  }

  return section;
}

function buildLetter() {
  const letter = booklet.letter;
  const dialog = el('dialog', {
    class: 'fa-dialog fa-letter',
    'aria-labelledby': 'fa-letter-title',
    tabindex: '-1',
  });

  const inner = el('div', { class: 'fa-dialog-inner fa-letter-inner' });
  function renderLetter() {
  inner.replaceChildren();
  inner.append(
    closeButton(letter.close, 'fa-dialog-close'),
    el('p', { class: 'fa-label', text: letter.label }),
    el('h2', { class: 'fa-sr', id: 'fa-letter-title', text: letter.label }),
    el('p', { class: 'fa-letter-date' }, [el('em', { text: letter.date })])
  );

  if (letter.photo) {
    inner.append(
      el('figure', { class: 'fa-letter-photo' }, [photoImg(photos[letter.photo], { loading: 'eager' })])
    );
  }

  letter.paragraphs.forEach((text, index) => {
    const isSign = index === letter.paragraphs.length - 1;
    const isQuestion = text === letter.question;
    inner.append(
      el('p', { class: isSign ? 'fa-letter-sign' : isQuestion ? 'fa-letter-p fa-letter-question' : 'fa-letter-p' },
        [isSign || isQuestion ? el('strong', { text }) : text])
    );
  });

  const back = el('button', {
    type: 'button',
    class: 'fa-btn fa-btn--ghost',
    'data-fa-letter-close': '',
    text: letter.back,
  });
  back.addEventListener('click', () => dialog.close());
  inner.append(el('div', { class: 'fa-actions fa-actions--start' }, [back]));
  }

  if (stores.session.get(config.letterSessionKey) === '1') {
    renderLetter();
  } else {
    const input = el('input', {
      id: 'fa-letter-code', type: 'password', autocomplete: 'off',
      autocapitalize: 'none', spellcheck: 'false', required: true,
      'aria-describedby': 'fa-letter-error',
    });
    const error = el('p', { class: 'fa-error', id: 'fa-letter-error', role: 'alert' });
    const form = el('form', { class: 'fa-letter-gate' }, [
      el('div', { class: 'fa-field' }, [
        el('label', { for: 'fa-letter-code', text: letter.gate.field }), input,
      ]),
      error,
      el('button', { class: 'fa-btn fa-btn--primary', type: 'submit', text: letter.gate.button }),
    ]);
    inner.append(
      closeButton(letter.close),
      el('p', { class: 'fa-label', text: letter.label }),
      el('h2', { class: 'fa-dialog-title', id: 'fa-letter-title', text: letter.gate.title }),
      el('p', { class: 'fa-note', text: letter.gate.description }), form,
    );
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (input.value.trim().toLowerCase() !== passwords.letter.toLowerCase()) {
        error.textContent = letter.gate.error;
        input.setAttribute('aria-invalid', 'true');
        input.focus();
        input.select();
        return;
      }
      stores.session.set(config.letterSessionKey, '1');
      renderLetter();
      dialog.scrollTop = 0;
      inner.querySelector('.fa-dialog-close').focus({ preventScroll: true });
    });
    input.addEventListener('input', () => {
      error.textContent = '';
      input.removeAttribute('aria-invalid');
    });
  }
  dialog.append(inner);
  wireDialog(dialog);
  return dialog;
}

function makeLightbox() {
  const image = el('img', { alt: '', decoding: 'async' });
  const dialog = el('dialog', {
    class: 'fa-dialog fa-lightbox',
    'aria-label': 'photograph',
    tabindex: '-1',
  }, [closeButton('close the photograph', 'fa-dialog-close fa-dialog-close--light'), image]);
  wireDialog(dialog);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  return {
    dialog: dialog,
    open(photo, trigger) {
      image.src = photo.src;
      image.alt = photo.alt;
      image.width = photo.w;
      image.height = photo.h;
      openDialog(dialog, '[data-fa-initial]', trigger);
    },
  };
}

function initBookletProgress() {
  const bar = document.querySelector('[data-fa-progress]');
  if (!bar) return;
  let queued = 0;
  function paint() {
    queued = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar.style.setProperty('--fa-progress', ratio.toFixed(4));
  }
  function schedule() {
    if (queued) return;
    queued = window.requestAnimationFrame(paint);
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  paint();
}

function initBooklet() {
  const gate = document.querySelector('[data-fa-gate]');
  const content = document.querySelector('[data-fa-content]');
  if (!gate || !content) return;
  let built = false;

  function unlock(result) {
    if (!built) {
      buildBooklet(content);
      built = true;
    }
    gate.hidden = true;
    content.hidden = false;
    initBookletProgress();
    if (result.focus) {
      const heading = content.querySelector('[data-fa-focus]');
      if (heading) heading.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
  }

  wireGate({
    root: gate,
    copy: bookletGate,
    password: passwords.booklet,
    sessionKey: config.bookletSessionKey,
    onUnlock: unlock,
  });
}

/* -------------------------------------------------------------------- kitchen */

const KITCHEN_SCREENS = ['welcome', 'menu', 'roles', 'ingredients', 'cooking', 'done'];

function defaultKitchenState() {
  return {
    v: config.kitchenStateVersion,
    screen: 'welcome',
    step: 0,
    checked: [],
    prompts: [],
  };
}

function normaliseState(raw) {
  const base = defaultKitchenState();
  if (!raw || typeof raw !== 'object') return base;
  if (raw.v !== config.kitchenStateVersion) return base;
  const state = base;
  if (KITCHEN_SCREENS.indexOf(raw.screen) >= 0) state.screen = raw.screen;
  const step = Number(raw.step);
  if (Number.isInteger(step) && step >= 0 && step < kitchen.steps.length) state.step = step;
  if (Array.isArray(raw.checked)) {
    state.checked = raw.checked.filter((id) => typeof id === 'string');
  }
  if (Array.isArray(raw.prompts)) {
    state.prompts = raw.prompts.filter((n) => Number.isInteger(n));
  }
  return state;
}

function buildKitchen(host) {
  const store = stores.local;
  let state = normaliseState(readSavedState());

  function readSavedState() {
    const raw = store.get(config.kitchenStateKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  function save() {
    store.set(config.kitchenStateKey, JSON.stringify(state));
  }

  const live = el('p', { class: 'fa-sr', role: 'status', 'aria-live': 'polite' });
  const kitchenRoot = el('div', { class: 'fa-kitchen' }, [live]);
  const screens = {};

  function makeScreen(name, titleId) {
    const section = el('section', {
      class: 'fa-screen',
      'data-fa-screen': name,
      hidden: true,
      'aria-labelledby': titleId,
    });
    screens[name] = section;
    kitchenRoot.append(section);
    return section;
  }

  function primary(text, onClick) {
    const button = el('button', { type: 'button', class: 'fa-btn fa-btn--primary fa-btn--lg', text: text });
    button.addEventListener('click', onClick);
    return button;
  }

  function soundtrackPanel(text) {
    const details = el('details', { class: 'fa-panel' }, [
      el('summary', { class: 'fa-panel-summary', text: text }),
    ]);
    const body = el('div', { class: 'fa-panel-body' });
    details.append(body);
    let mounted = false;
    details.addEventListener('toggle', () => {
      if (!details.open || mounted) return;
      mounted = true;
      body.append(playlistBlock());
    });
    return details;
  }

  /* welcome */
  const welcome = makeScreen('welcome', 'fa-welcome-title');
  welcome.append(
    el('p', { class: 'fa-label', text: kitchen.welcome.label }),
    el('h1', {
      class: 'fa-display',
      id: 'fa-welcome-title',
      'data-fa-screen-title': '',
      tabindex: '-1',
      text: kitchen.welcome.title,
    }),
    el('p', { class: 'fa-date', text: kitchen.welcome.subtitle }),
    el('figure', { class: 'fa-welcome-photo' }, [
      photoImg(photos[kitchen.welcome.photo], { small: true }),
    ]),
    el('p', { class: 'fa-lede', text: kitchen.welcome.message }),
    soundtrackPanel(kitchen.welcome.soundtrack),
    el('div', { class: 'fa-actions' }, [
      primary(kitchen.welcome.cta, () => go('menu', { focus: true, announce: 'the menu' })),
    ])
  );

  /* menu */
  const menu = makeScreen('menu', 'fa-menu-title');
  const courses = el('div', { class: 'fa-courses' });
  for (const course of kitchen.menu.courses) {
    courses.append(
      el('div', { class: 'fa-course' }, [
        el('p', { class: 'fa-label', text: course.label }),
        el('h3', { class: 'fa-course-name', text: course.name }),
        el('p', { class: 'fa-course-text', text: course.description }),
      ])
    );
  }
  menu.append(
    el('p', { class: 'fa-label', text: kitchen.menu.label }),
    el('h2', { class: 'fa-display fa-display--mid', id: 'fa-menu-title', 'data-fa-screen-title': '', tabindex: '-1', text: kitchen.menu.title }),
    courses,
    el('p', { class: 'fa-note', text: kitchen.menu.note }),
    el('div', { class: 'fa-actions' }, [
      primary(kitchen.menu.cta, () => go('roles', { focus: true, announce: 'meet the chefs' })),
    ])
  );

  /* chefs */
  const roles = makeScreen('roles', 'fa-roles-title');
  const cards = el('div', { class: 'fa-chef-grid' });
  for (const chef of kitchen.chefs.cards) {
    const duties = el('ul', { class: 'fa-duties' });
    for (const duty of chef.duties) duties.append(el('li', { text: duty }));
    cards.append(
      el('article', { class: 'fa-chef' }, [
        el('p', { class: 'fa-label', text: chef.role }),
        el('h3', { class: 'fa-chef-name', text: chef.name }),
        duties,
      ])
    );
  }
  roles.append(
    el('p', { class: 'fa-label', text: kitchen.chefs.label }),
    el('h2', { class: 'fa-display fa-display--mid', id: 'fa-roles-title', 'data-fa-screen-title': '', tabindex: '-1', text: kitchen.chefs.title }),
    cards,
    el('p', { class: 'fa-playful', text: kitchen.chefs.playful }),
    el('p', { class: 'fa-note', text: kitchen.chefs.note }),
    el('div', { class: 'fa-actions' }, [
      primary(kitchen.chefs.cta, () => go('ingredients', { focus: true, announce: 'the ingredients' })),
    ])
  );

  /* ingredients */
  const ingredients = makeScreen('ingredients', 'fa-ingredients-title');
  const counter = el('p', { class: 'fa-count', role: 'status', 'aria-live': 'polite' });
  const checkboxes = [];
  const groups = el('div', { class: 'fa-ing-groups' });

  for (const group of kitchen.ingredients.groups) {
    const list = el('ul', { class: 'fa-ing-list' });
    for (const item of group.items) {
      const inputId = 'fa-ing-' + item.id;
      const box = el('input', { type: 'checkbox', id: inputId, value: item.id });
      box.addEventListener('change', () => {
        const set = new Set(state.checked);
        if (box.checked) set.add(item.id);
        else set.delete(item.id);
        state.checked = Array.from(set);
        save();
        updateCount();
      });
      checkboxes.push({ box: box, id: item.id });
      list.append(
        el('li', { class: 'fa-ing-item' }, [
          el('label', { class: 'fa-check', for: inputId }, [
            box,
            el('span', { class: 'fa-check-text', text: item.text }),
          ]),
        ])
      );
    }
    groups.append(
      el('section', { class: 'fa-ing-group', 'aria-labelledby': 'fa-ing-' + group.id + '-title' }, [
        el('h3', { class: 'fa-ing-title', id: 'fa-ing-' + group.id + '-title', text: group.title }),
        list,
      ])
    );
  }

  function updateCount() {
    const total = checkboxes.length;
    const done = checkboxes.filter((entry) => entry.box.checked).length;
    counter.textContent = done + ' of ' + total + ' ' + kitchen.ingredients.counter;
    counter.setAttribute('data-complete', done === total ? 'true' : 'false');
  }

  ingredients.append(
    el('p', { class: 'fa-label', text: kitchen.ingredients.label }),
    el('h2', { class: 'fa-display fa-display--mid', id: 'fa-ingredients-title', 'data-fa-screen-title': '', tabindex: '-1', text: kitchen.ingredients.title }),
    el('p', { class: 'fa-note', text: kitchen.ingredients.subtitle }),
    counter,
    groups,
    el('div', { class: 'fa-actions' }, [
      primary(kitchen.ingredients.cta, () => {
        go('cooking', { focus: true });
        announceStep();
      }),
    ])
  );

  /* cooking */
  const cooking = makeScreen('cooking', 'fa-step-title');
  const stepCounter = el('p', { class: 'fa-label', 'data-fa-step-counter': '' });
  const ticks = el('div', { class: 'fa-ticks', 'aria-hidden': 'true' });
  const tickNodes = kitchen.steps.map(() => el('span', { class: 'fa-tick' }));
  for (const tick of tickNodes) ticks.append(tick);

  const stepRole = el('span', { class: 'fa-role' });
  const stepTitle = el('h2', { class: 'fa-step-title', id: 'fa-step-title', 'data-fa-screen-title': '', tabindex: '-1' });
  const stepDuration = el('p', { class: 'fa-duration' });
  const stepLines = el('ul', { class: 'fa-lines' });
  const stepBig = el('p', { class: 'fa-big' });
  const stepTip = el('p', { class: 'fa-tip' });
  const promptText = el('p', { class: 'fa-prompt-text' });
  const promptBox = el('aside', { class: 'fa-prompt' }, [promptText]);
  const promptSkip = el('button', { type: 'button', class: 'fa-quiet', text: kitchen.stepLabels.skipPrompt });
  promptBox.append(promptSkip);

  const prevButton = el('button', { type: 'button', class: 'fa-btn', text: kitchen.stepLabels.previous });
  const nextButton = el('button', { type: 'button', class: 'fa-btn fa-btn--primary', text: kitchen.stepLabels.next });

  promptSkip.addEventListener('click', () => {
    if (state.prompts.indexOf(state.step) < 0) state.prompts.push(state.step);
    save();
    promptBox.hidden = true;
    live.textContent = 'prompt skipped';
  });

  cooking.append(
    el('div', { class: 'fa-step-head' }, [stepCounter, ticks]),
    el('article', { class: 'fa-step-card' }, [
      el('p', { class: 'fa-step-role' }, [stepRole]),
      stepTitle,
      stepDuration,
      stepLines,
      stepBig,
      stepTip,
      promptBox,
    ]),
    el('div', { class: 'fa-actions fa-actions--split' }, [prevButton, nextButton]),
    el('p', { class: 'fa-hint', text: 'the arrow keys move between steps' })
  );

  function announceStep() {
    const step = kitchen.steps[state.step];
    live.textContent =
      'step ' + (state.step + 1) + ' of ' + kitchen.steps.length + '. ' + step.title + '. role: ' + step.role + '.';
  }

  function syncStep(scroll) {
    const index = state.step;
    const step = kitchen.steps[index];
    stepCounter.textContent = 'step ' + (index + 1) + ' of ' + kitchen.steps.length;
    stepRole.textContent = 'role: ' + step.role;
    stepTitle.textContent = step.title;
    stepLines.replaceChildren();
    for (const line of step.lines) stepLines.append(el('li', { text: line }));

    if (step.duration) {
      stepDuration.textContent = step.duration;
      stepDuration.hidden = false;
    } else {
      stepDuration.textContent = '';
      stepDuration.hidden = true;
    }

    if (step.big) {
      stepBig.textContent = step.big;
      stepBig.hidden = false;
    } else {
      stepBig.textContent = '';
      stepBig.hidden = true;
    }

    if (step.tip) {
      stepTip.textContent = step.tip;
      stepTip.hidden = false;
    } else {
      stepTip.textContent = '';
      stepTip.hidden = true;
    }

    if (step.prompt && state.prompts.indexOf(index) < 0) {
      promptText.textContent = step.prompt;
      promptBox.hidden = false;
    } else {
      promptBox.hidden = true;
    }

    tickNodes.forEach((tick, i) => {
      tick.setAttribute('data-state', i < index ? 'done' : i === index ? 'current' : 'todo');
    });

    prevButton.disabled = index === 0;
    nextButton.textContent = index === kitchen.steps.length - 1
      ? kitchen.steps[index].next || kitchen.stepLabels.next
      : kitchen.stepLabels.next;

    if (scroll) {
      const target = cooking.querySelector('.fa-step-card');
      if (target) {
        target.scrollIntoView({ block: 'start', behavior: reducedMotion() ? 'auto' : 'smooth' });
      }
    }
  }

  function stepForward() {
    if (state.step < kitchen.steps.length - 1) {
      state.step += 1;
      save();
      syncStep(true);
      announceStep();
    } else {
      state.screen = 'done';
      save();
      go('done', { focus: true, announce: 'dinner is served' });
    }
  }

  function stepBack() {
    if (state.step <= 0) return;
    state.step -= 1;
    save();
    syncStep(true);
    announceStep();
  }

  prevButton.addEventListener('click', stepBack);
  nextButton.addEventListener('click', stepForward);

  document.addEventListener('keydown', (event) => {
    if (state.screen !== 'cooking') return;
    if (document.documentElement.classList.contains('fa-dialog-open')) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (target && target.closest && target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      stepForward();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      stepBack();
    }
  });

  /* completion */
  const done = makeScreen('done', 'fa-done-title');
  const dishes = el('ul', { class: 'fa-dishes' });
  for (const dish of kitchen.completion.dishes) dishes.append(el('li', { text: dish }));

  const restart = el('button', {
    type: 'button',
    class: 'fa-quiet',
    text: kitchen.completion.restart,
  });

  done.append(
    el('p', { class: 'fa-label', text: kitchen.completion.label }),
    el('h2', { class: 'fa-display', id: 'fa-done-title', 'data-fa-screen-title': '', tabindex: '-1', text: kitchen.completion.title }),
    el('p', { class: 'fa-date', text: kitchen.completion.subtitle }),
    dishes,
    el('p', { class: 'fa-note', text: kitchen.completion.note }),
    el('p', { class: 'fa-foot-line', text: kitchen.completion.footer }),
    soundtrackPanel(kitchen.completion.soundtrack),
    el('div', { class: 'fa-actions' }, [restart])
  );

  /* reset confirmation */
  const resetDialog = el('dialog', {
    class: 'fa-dialog fa-confirm',
    'aria-labelledby': 'fa-reset-title',
    tabindex: '-1',
  });
  const keep = el('button', {
    type: 'button',
    class: 'fa-btn',
    'data-fa-initial': '',
    text: kitchen.reset.cancel,
  });
  const confirm = el('button', { type: 'button', class: 'fa-btn fa-btn--primary', text: kitchen.reset.confirm });
  keep.addEventListener('click', () => resetDialog.close());
  confirm.addEventListener('click', () => {
    state = defaultKitchenState();
    store.remove(config.kitchenStateKey);
    save();
    dialogState.delete(resetDialog);
    resetDialog.close();
    syncIngredients();
    syncStep(false);
    go('welcome', { focus: true, announce: 'the workshop is reset' });
  });
  resetDialog.append(
    el('div', { class: 'fa-dialog-inner' }, [
      closeButton('close the confirmation'),
      el('h2', { class: 'fa-dialog-title', id: 'fa-reset-title', text: kitchen.reset.title }),
      el('p', { class: 'fa-note', text: kitchen.reset.text }),
      el('div', { class: 'fa-actions fa-actions--split' }, [keep, confirm]),
    ])
  );
  wireDialog(resetDialog);
  restart.addEventListener('click', () => openDialog(resetDialog, '[data-fa-initial]', restart));

  kitchenRoot.append(resetDialog);
  host.append(kitchenRoot);

  function syncIngredients() {
    const set = new Set(state.checked);
    for (const entry of checkboxes) entry.box.checked = set.has(entry.id);
    updateCount();
  }

  function go(name, options) {
    const opts = options || {};
    if (KITCHEN_SCREENS.indexOf(name) < 0) name = 'welcome';
    state.screen = name;
    save();
    for (const key of KITCHEN_SCREENS) {
      if (screens[key]) screens[key].hidden = key !== name;
    }
    if (name === 'ingredients') syncIngredients();
    if (name === 'cooking') syncStep(false);
    const node = screens[name];
    if (node) {
      node.scrollIntoView({ block: 'start' });
      if (opts.focus) {
        const heading = node.querySelector('[data-fa-screen-title]');
        if (heading) heading.focus({ preventScroll: true });
      }
    }
    if (opts.announce) live.textContent = opts.announce;
  }

  function start(options) {
    syncIngredients();
    syncStep(false);
    go(state.screen, { focus: options && options.focus });
  }

  return { start: start };
}

function initKitchen() {
  const gate = document.querySelector('[data-fa-gate]');
  const content = document.querySelector('[data-fa-content]');
  if (!gate || !content) return;
  let app = null;

  function unlock(result) {
    if (!app) {
      app = buildKitchen(content);
    }
    gate.hidden = true;
    content.hidden = false;
    app.start({ focus: result.focus });
  }

  wireGate({
    root: gate,
    copy: kitchenGate,
    password: passwords.kitchen,
    sessionKey: config.kitchenSessionKey,
    onUnlock: unlock,
  });
}

/* ----------------------------------------------------------------------- boot */

initTheme();

const page = document.body ? document.body.getAttribute('data-fa-page') : null;
if (page === 'landing') initLanding();
else if (page === 'booklet') initBooklet();
else if (page === 'kitchen') initKitchen();
