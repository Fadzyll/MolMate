# MolMate

Your mole concept companion: a frontend-only study tool for KSSM Form 4 Chemistry, Chapter 3 (The Mole Concept / Konsep Mol). Available in English (default) and Bahasa Melayu.

See [PLAN.md](PLAN.md) for the full feature plan and milestones.

## Run locally

```bash
npm install
```

```bash
npm run dev
```

Other scripts: `npm run build` (production build into `dist/`), `npm test` (unit tests), `npm run lint`.

## Deploy to Vercel

Import the GitHub repo in Vercel. It detects Vite automatically (build `npm run build`, output `dist`). `vercel.json` rewrites every path to `index.html` so routes like `/calculator` work on refresh.

## Project layout

- `src/pages/` — one component per page
- `src/components/` — shared UI (navbar, layout, Rajah 3.9 diagram)
- `src/i18n/` — English and Malay text (`en.ts`, `ms.ts`)
- `src/lib/` — pure logic (calculations, formula parser, formatting)
- `src/data/` — static data such as the periodic table
