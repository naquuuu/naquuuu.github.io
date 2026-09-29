# naquuuu@pm — Personal Product & AI Systems Blog

A public thought-leadership and engineering workstation by **Ramadhana Bhanuharya Krishnamurti (Krishna / naquuuu)**.
Bridging AI agentic workflows, high-precision technical product management, and systems architecture.

- Live URL: [https://naquuuu.github.io/](https://naquuuu.github.io/)

---

## 1. Structure
```
blog/
├── index.html                   # Workstation Homepage (Terminal, whoami, focus, latest essays)
├── about/
│   └── index.html               # About Me (ITB, BCG, Traveloka, MAPCLUB, Tanoto Scholar, Hobbies)
├── blog/
│   ├── index.html               # Essays Archive
│   └── building-an-autonomous-product-operating-system/
│       └── index.html           # Foundational Post #1 (8 min read)
├── assets/
│   ├── css/style.css            # Dark Crimson Workstation Design System (IDE Theme)
│   └── js/main.js               # Interactive CLI parser & code copy utilities
└── drafts/                      # Automated drafts staging area
```

---

## 2. Deploying to GitHub Pages (`naquuuu.github.io`)
To host this directly under your personal GitHub Pages handle:
1. Create a public repository named `naquuuu.github.io` on GitHub under your account `naquuuu`.
2. In this `blog` folder, run:
   ```bash
   git init
   git add .
   git commit -m "feat: initial release of naquuuu@pm blog"
   git branch -M main
   git remote add origin https://github.com/naquuuu/naquuuu.github.io.git
   git push -u origin main
   ```
3. Enable GitHub Pages in repository **Settings** $\rightarrow$ **Pages** $\rightarrow$ **Deploy from a branch (`main` / `/root`)**.

---

## 3. Automated Weekly Publishing Engine
To generate a new draft from workspace changes on demand:
```bash
python scripts/generate_blog_post.py --topic "Your Topic Here"
```
To publish a reviewed draft:
```bash
python scripts/generate_blog_post.py --publish [slug]
```
Weekly autonomous synthesis runs automatically every **Saturday morning at 11:00 AM JKT (+7)**, emailing draft notifications to `rbkrishnamurti@gmail.com`.
