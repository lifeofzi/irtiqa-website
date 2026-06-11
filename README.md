# irtiqa-website

**This is a Next.js app.** The real website code lives in:

- `components/HomeClient.tsx` — the entire site UI (nav, sections, player, animations)
- `app/globals.css` — all styles
- `app/page.tsx` — Next.js entry point
- `public/` — static assets (images, audio, video, blog HTML)
- `public/blog/` — standalone visual journey pages (static HTML, served at `/blog/`)

The `index.html` and `styles.css` in the root are **legacy static files — do not edit them.** They are not used by the deployed site.

## Local Development

```sh
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Deploy

Deployed on Vercel. Push to `main` to deploy automatically.

## How Conductor Uses This Project

Conductor creates each workspace as its own git worktree and branch. The checked-in `conductor.json` tells Conductor how to prepare and run this starter app:

```json
{
  "scripts": {
    "setup": "true",
    "run": "open index.html"
  }
}
```

When you create a workspace, setup succeeds immediately. When you click Run on macOS, Conductor opens the HTML file in your default browser.

## Local Development

Open the app directly:

```sh
open index.html
```

Edit `index.html`, then refresh the browser.

## Project Structure

- `index.html` contains the UI, styling, and interaction logic.
- `public/` contains static assets used by the page.
- `conductor.json` contains the shared Conductor workspace scripts.
- `.context/` is available in Conductor workspaces for gitignored notes and handoff files between agents.

## Learn More

- [Conductor docs](https://conductor.build/docs)
