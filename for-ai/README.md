# for-ai

A private little edition for 24–25 October 2026, and a small cooking workshop.
Three static routes, no framework or application dependencies. GitHub Pages
processes the Jekyll front matter during its normal site build.

- `/for-ai/` landing
- `/for-ai/booklet/` the date booklet
- `/for-ai/kitchen/` the cooking workshop

Every page carries `noindex, nofollow`, and every HTML file has `sitemap: false`
front matter so the sitemap plugin skips it. Nothing links here from the public
site.

## Where to edit

Everything is in **`content.js`**. That is the only file you need to touch for copy.

| What | In `content.js` |
| --- | --- |
| All three passwords | `passwords.booklet`, `passwords.kitchen`, `passwords.letter` |
| Landing copy | `landing` |
| Password screen copy | `bookletGate`, `kitchenGate` |
| Cover, dedication, intro | `booklet.cover` |
| Photo collection heading and which photos appear | `booklet.moments` |
| Playlist URL, caption, open-in-Spotify link | `playlist`, `booklet.songs` |
| Saturday and Sunday itineraries | `booklet.chapters` |
| Confession letter | `booklet.letter.paragraphs` |
| Menu, chefs, ingredients, nine steps, completion menu, reset copy | `kitchen` |
| Photo paths, aspect ratios, alt text | `photos` |
| Storage keys and state version | `config` |

The letter is `booklet.letter.paragraphs`: one string per paragraph, last string
styled as the signature. Add, remove or rewrite lines freely.

Photos live at `/for-ai/images/photo-01.webp` through `photo-09.webp`, with
`photo-NN-small.webp` versions for the gallery. The `w`/`h` numbers in `photos`
encode each original aspect ratio; keep them in step with the files so nothing is
cropped. Edit `alt` when you want the descriptions to be personal.

## Access and progress

Two independent session unlocks, both `sessionStorage`:

- booklet: `naquuuu_fa_booklet`
- kitchen: `naquuuu_fa_kitchen`
- confession letter: `naquuuu_fa_letter` (separate from booklet access)

Unlocking one never unlocks the other. Passwords are compared after trimming
spaces and ignoring case. If `sessionStorage` is unavailable, the page keeps the
unlock only in memory for that page view; it degrades, it does not break.

The workshop keeps its own progress in `localStorage`, versioned:

- key `naquuuu_fa_kitchen_state`
- version `1` (`config.kitchenStateVersion`)

Persisted: current screen (welcome, menu, roles, ingredients, cooking, done),
current step, checked ingredient ids, skipped prompts. Navigation state is
separate from access: a new browsing session asks for the kitchen password again,
then resumes the saved screen and step. "start the workshop again" on the
completion screen asks for confirmation and clears this key.

Theme choice is stored in `naquuuu_mode`, the same key the main site uses. The
booklet and kitchen read it on load and write it when the toggle is used, so the
lens follows you between pages. Nothing from `main.js` is loaded.

## Deliberately not private

The password check runs in the browser and the passwords are in `content.js`.
Anyone who opens the source can read both. This is a sentimental gate, not
authentication, and the pages are public files on a static host. There is no
backend, no accounts, no server check. Treat the URLs as the real secret.

## Serving and building

Jekyll serves the pages, so front matter is required and `sitemap: false` must
stay. Plain local previews that ignore front matter will show the `---` block;
serve through Jekyll (or the deploy host) to see the real output.

For a quick local check of the pages without Jekyll:

```
python -m http.server 8000
```

then open `http://localhost:8000/for-ai/`. ES modules need a real HTTP server;
`file://` will not work. Absolute asset paths assume the site root.

`README.md` is not part of the deployed experience. The site config explicitly
excludes `for-ai/README.md` from the published build.

## Behaviour notes

- Photos are created only after unlock. The landing page has no images and no
  Open Graph image tags.
- Gallery and itinerary photos open in an accessible full-size dialog; the
  letter is a separate dialog with explicit close, Escape, focus restore and
  scroll restore. Opening the letter does not rebuild the playlist iframe.
- The Spotify embed is lazy, fixed at 352px high, width from the stylesheet,
  and never autoplays. If the frame fails to load, the open-in-Spotify link
  still works and the rest of the page is unaffected.
- Scroll progress on the booklet is a 2px rule. No snap scrolling, no carousel,
  no decorative animation.
- Theme toggle, progress and dialogs respect `prefers-reduced-motion`.
- Everything is scoped under `.fa`/`.fa-*` in `for-ai.css`; shared site CSS is
  referenced but never modified.
