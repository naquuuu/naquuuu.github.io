# naquuuu: a personal journal

A static personal journal by Krishna, exploring systems & matter and culture & taste.

Live site: [naquuuu.github.io](https://naquuuu.github.io/).

## Structure

- `index.html`: editorial homepage, selected writing, projects, portrait, and listening corner.
- `blog/`: essay archive and published articles.
- `portfolio/`, `experience/`, `performance/`: existing case studies and notebooks; their URLs remain stable.
- `assets/css/style.css`: existing component styles used by published pages.
- `assets/css/journal.css`: shared paper-and-ink visual system, reading typography, archive and homepage layouts. Loaded after `style.css`.
- `assets/js/journal.js`: optional homepage navigation enhancement. All homepage content and links work without JavaScript.
- `assets/js/main.js`: existing article and archive interactions, including theme filtering and code-copy controls.

The homepage uses local artwork and photography. Its record illustration is CSS. It does not load social embeds, remote fonts, or background audio. Spotify is an explicit external link.

## Local preview

From this repository, run `python -m http.server 8000` and open `http://localhost:8000/`. There is no package install or build step.

## Verification and publishing

Run `python scripts/verify_blog_qa.py` from this repository. Run workspace sanitization and multi-repo gates from the parent hub before committing or pushing. Review desktop and mobile layouts, keyboard navigation, article tables, archive filters, and no-JavaScript behavior in a browser.

Asset version: `20260929a`. Keep HTML references and `CURRENT_ASSET_VERSION` in the QA script aligned when updating shared assets. The visual revamp is pending full QA and deployment; implementation alone does not certify publishing readiness.

The existing GitHub Pages publishing configuration is retained. Do not initialize another repository or replace the remote.
