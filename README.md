# MolMate

Your mole concept companion: a study tool for KSSM Form 4 Chemistry, Chapter 3 (The Mole Concept, Chemical Formula and Equation / Konsep Mol, Formula dan Persamaan Kimia). Available in English (default) and Bahasa Melayu.

Made by Farah Hazirah · UPSI. Live at <https://mol-mate.vercel.app>.

## Features

- **Calculator:** moles ⇄ particles, mass and gas volume, solving for any quantity, with step-by-step working, unit conversion and room/STP molar volume
- **Molar mass from a formula:** type `H2O`, `Ca(OH)2` or `CuSO4·5H2O` to get the RMM/RFM with a breakdown
- **Chain conversion:** for example mass → moles → particles in one go
- **Notes:** definitions (mole, Avogadro constant, RAM, RMM, RFM, molar mass, molar volume), common mistakes and worked examples
- **Formula sheet:** every formula on one printable page
- **Unit converter:** g, kg, mg, cm³, dm³, m³, L, mL, mol, mmol
- **Periodic table:** 118 elements with SPM-rounded RAM, number of electrons, electron arrangement and an interactive 3D atom model

Frontend only: no login, no backend, no environment variables.

## Run locally

```bash
npm install
```

```bash
npm run dev
```

Other scripts: `npm run build` (production build into `dist/`), `npm test` (unit tests), `npm run lint`.

## Deploy to Vercel

Import the GitHub repository in Vercel. It detects Vite automatically (build `npm run build`, output `dist`). `vercel.json` sends every route to `index.html`, so links like `/calculator` work on refresh. It also caches the hashed files in `/assets` long-term.

## Editing content

- **Text in both languages:** `src/i18n/en.ts` and `src/i18n/ms.ts`
- **Notes page and worked examples:** `src/content/notes.tsx`
- **Element data (RAM values, Malay names):** `src/data/elements.ts`

## Project layout

- `src/pages/`: one component per page
- `src/components/`: shared UI (navbar, calculator parts, periodic table, 3D atom)
- `src/lib/`: pure logic (mole conversions, formula parser, units, number formatting), with tests next to each file
- `src/data/`: periodic table data
- `public/`: icons, link-preview image, robots.txt, sitemap
