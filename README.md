# Asad Ali's Portfolio

![GitHub deployments](https://img.shields.io/github/deployments/twoos123/asadali-portfolio/github-pages?label=deployment&style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/twoos123/asadali-portfolio?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/twoos123/asadali-portfolio?style=flat-square)

My personal portfolio, live at **[asadbinali.com](https://asadbinali.com)**: projects with case studies, experience, skills and resume, set in an ocean you sink deeper into as you scroll.

## Demo

A quick tour of the on-site editor: every section of the site edited in place, with changes held until they're reviewed and published.

https://github.com/user-attachments/assets/d1c79ecf-d6dc-454b-81fe-6ae09bac4f1e

## Highlights

- **A living ocean.** Hand-drawn SVG sea life (schools of fish, jellyfish, an anglerfish, a kraken) that swims, turns, flees the cursor and comes to feed when you click. The water darkens with depth, marine snow drifts past, and the deep end has a flashlight that follows the cursor. All motion runs on one shared animation loop, pauses off screen, freezes in place with the footer's pause button, and respects the system's reduce-motion setting.
- **Editable from the site itself.** Every word, image, link and list (skills, projects, case studies, experience, social links) can be changed in place from [/admin](https://asadbinali.com/admin). Changes are reviewed as a diff, then published as one commit to `main`, which redeploys the site.
- **Locked down.** Editing needs a password *and* an authenticator code. Failed logins are rate-limited and lock out, every login sends an email alert, and the site ships a Content-Security-Policy. Saves are validated on the server against the content's known structure.

## Tech

React 18 + Vite, Tailwind CSS, Framer Motion and React Router, served by GitHub Pages. A small Express backend on Render handles the contact form (Resend) and the editor API (commits through the GitHub API).

```
asadali-portfolio/
├─ src/
│  ├─ content/          site text, links and images as JSON (what the editor edits)
│  ├─ components/ocean/ the ocean: sea life simulation, seabed, waves, depth
│  ├─ editor/           on-site editor and admin console
│  └─ pages/, components/
├─ public/              static assets, uploads from the editor
└─ backend/             Express API: contact form, editor login and saves
.github/workflows/deploy.yml   builds and deploys the site on every push to main
```

## Run it locally

```bash
cd asadali-portfolio
npm run setup   # install the site and the backend
npm run dev     # site on http://localhost:3000, backend on http://localhost:5000
```

The backend reads `asadali-portfolio/backend/.env`; copy `.env.example` to start. For the editor, set `EDITOR_DRY_RUN=true` so saves write to the local files instead of committing to GitHub.

## Deploying

- **Site:** automatic. Every push to `main` (including publishes from the editor) runs the deploy workflow, which builds and publishes to the `gh-pages` branch. It's live a minute or two later.
- **Backend:** Render deploys `asadali-portfolio/backend` from `main`. Its environment needs `NODE_ENV=production`, `RESEND_API_KEY`, `RECIPIENT_EMAIL`, `GITHUB_TOKEN` (fine-grained, this repo only: Contents read/write, Actions read) and the three editor login values below.
- **Editor login:** in `asadali-portfolio/backend`, run `npm run setup-editor`. It asks for a password, shows a QR code for your authenticator app, and prints `EDITOR_PASSWORD_HASH`, `EDITOR_TOTP_SECRET` and `EDITOR_SESSION_SECRET` for Render. Running it again resets the login and signs every session out.

If you change the *structure* of the content in code (new fields or lists), run `npm run content-shape` in the backend so the editor's server-side checks accept it.
