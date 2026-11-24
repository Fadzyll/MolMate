# MolMate — Implementation Plan

A frontend-only study tool for the **Konsep Mol** chapter (KSSM Kimia Tingkatan 4, Bab 3).
No login, no backend: the user opens the site and lands directly on the home page. Hosted on Vercel.

---

## 1. Goals

MolMate centres on **Rajah 3.9**: the number of moles sits in the middle and links three quantities.

```
                 Jisim (g)
          × jisim molar ↑ ↓ ÷ jisim molar
Bilangan zarah ⇄  BILANGAN MOL  ⇄  Isi padu gas
   × N_A / ÷ N_A            × isi padu molar / ÷ isi padu molar
```

The app must cover:

1. Mol ⇄ bilangan zarah (mol, bilangan zarah, pemalar Avogadro)
2. Mol ⇄ jisim (mol, jisim, jisim molar)
3. Mol ⇄ isi padu gas (mol, isi padu gas, isi padu molar)
4. Notes: definitions of JAR, JMR, JFR, mol, bilangan zarah, pemalar Avogadro
5. Formula sheet
6. Unit conversion (g, mol, cm³, dm³)
7. Periodic table with JAR and number of electrons for each element

---

## 2. Tech stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **React + Vite + TypeScript** | Fast, simple static build, deploys to Vercel with zero config |
| Styling | **Tailwind CSS** | Quick to build responsive layouts, easy dark mode |
| i18n | Small built-in dictionary (`src/i18n/en.ts`, `ms.ts`) | English default + Bahasa Melayu toggle, choice remembered in the browser; no library needed |
| Routing | **React Router** | Separate pages; `vercel.json` rewrite sends every path to `index.html` |
| Maths | Plain TS + a small number formatter | Scientific notation (e.g. `1.204 × 10²⁴`) needs no heavy library |
| Testing | **Vitest** | Unit tests for the calculation and formula-parser logic |
| Hosting | **Vercel** (static) | Build command `npm run build`, output `dist/` |

No database, no API, no environment variables. All data (elements, notes) ships as static TS/JSON files.

---

## 3. Pages and features

### 3.1 Laman Utama (Landing) `/`
- Hero: “MolMate — Rakan Konsep Mol anda”, short tagline, button **Mula Kira**.
- An interactive version of Rajah 3.9: click any box/arrow to jump to that calculator.
- Cards linking to every section below.

### 3.2 Kalkulator `/calculator`
Three tabs, one per relationship. Each tab:
- Lets the user pick **what to find** (e.g. find mol, find mass, or find molar mass).
- Inputs with unit dropdowns (e.g. volume in cm³ or dm³, mass in g or kg).
- Shows the **answer plus step-by-step working** in the textbook style:
  `Bilangan mol = Jisim ÷ Jisim molar = 8.8 g ÷ 44 g mol⁻¹ = 0.2 mol`
- A **Salin** (copy) button for the answer.

| Tab | Formula | Can solve for |
|---|---|---|
| Mol ⇄ Zarah | `n = N ÷ N_A` | n, N |
| Mol ⇄ Jisim | `n = m ÷ M` | n, m, M |
| Mol ⇄ Isi padu gas | `n = V ÷ V_m` | n, V, V_m |

Extras:
- **Particle type selector** (atom / molekul / ion) so the working uses the right word.
- **Molar volume toggle:** 24 dm³ mol⁻¹ (keadaan bilik) or 22.4 dm³ mol⁻¹ (STP).
- **Jisim molar helper:** type a formula such as `H2O`, `CO2`, `Ca(OH)2` or `CuSO4·5H2O` and MolMate works out the JMR/JFR from the periodic table data, showing the sum (e.g. `2(1) + 16 = 18`).
- **Penukar Berantai (chain mode):** convert across two arrows of Rajah 3.9 through mol, e.g. jisim → mol → bilangan zarah, or isi padu gas → mol → jisim. This mirrors Contoh 12 and 13 in the textbook.

### 3.3 Nota `/notes`
Short, clear definition cards (EN/BM), each with an example:
- **JAR** (Jisim Atom Relatif): average mass of one atom of the element compared with 1/12 of the mass of one carbon-12 atom.
- **JMR** (Jisim Molekul Relatif): for molecular substances, the sum of the JAR of the atoms in the molecule (e.g. H₂O = 18).
- **JFR** (Jisim Formula Relatif): for ionic compounds, the sum of the JAR of the atoms in the formula (e.g. NaCl = 58.5).
- **Mol:** the amount of substance that contains as many particles as there are atoms in exactly 12 g of carbon-12.
- **Bilangan zarah:** atoms, molecules or ions; how to tell which one a substance has.
- **Pemalar Avogadro (N_A):** 6.02 × 10²³ mol⁻¹.
- **Jisim molar** and **isi padu molar**, with units.

### 3.4 Formula `/formulas`
A one-page formula sheet: the Rajah 3.9 diagram plus a formula card for each relationship, the constants (N_A, 24 / 22.4 dm³ mol⁻¹) and a “remember” box (e.g. molar volume applies to gases only). Print-friendly CSS so students can print it.

### 3.5 Penukar Unit `/units`
- Mass: g ⇄ kg (and mg)
- Volume: cm³ ⇄ dm³ ⇄ m³ (1 dm³ = 1000 cm³; also note 1 dm³ = 1 L)
- Amount: mol ⇄ mmol
- Each conversion shows the factor used.

### 3.6 Jadual Berkala `/periodic-table`
- A full, colour-coded periodic table grid (groups 1–18, periods 1–7, lanthanides and actinides).
- Each tile: symbol, proton number, JAR.
- Click a tile to open a detail panel: name (BM + English), proton number, **number of electrons** (= proton number for a neutral atom), JAR, group, period, and **susunan elektron** (e.g. 2.8.1) for elements 1–20, as used in SPM.
- Search by name or symbol, and a **list view** (sortable table) as the alternative to the grid on phones.
- Button **Use in calculator / Guna dalam kalkulator** that sends the element’s JAR to the jisim molar helper.

---

## 4. Data and accuracy decisions

- **JAR values:** use the **rounded values used in SPM** (H = 1, C = 12, O = 16, Na = 23, Cl = 35.5, Cu = 64, …), not full IUPAC decimals, so answers match the textbook and exam marking schemes. Stored once in `src/data/elements.ts`.
- **Constants:** N_A = 6.02 × 10²³ mol⁻¹; V_m = 24 dm³ mol⁻¹ (room) / 22.4 dm³ mol⁻¹ (STP).
- **Number display:** values ≥ 10⁴ or < 10⁻³ shown in scientific notation as `a × 10ⁿ`; significant figures adjustable (default 3, matching textbook answers).
- **Input validation:** no negative or zero values where they make no sense; clear BM error messages (e.g. “Sila masukkan nilai positif”). Formula parser reports unknown symbols (e.g. “Unsur ‘Xy’ tidak dijumpai”).

---

## 5. Project structure

```
molmate/
├─ public/              favicon, og-image
├─ src/
│  ├─ components/       Navbar, Footer, Card, NumberInput, UnitSelect,
│  │                    WorkingSteps, RajahDiagram, ElementTile, ElementModal
│  ├─ pages/            Home, Calculator, Notes, Formulas, Units, PeriodicTable, NotFound
│  ├─ lib/
│  │  ├─ mole.ts        pure conversion functions (n↔N, n↔m, n↔V, chains)
│  │  ├─ formula.ts     chemical-formula parser → JMR/JFR with breakdown
│  │  ├─ units.ts       unit conversion factors
│  │  └─ format.ts      scientific notation and significant figures
│  ├─ data/
│  │  ├─ elements.ts    118 elements: symbol, names, Z, JAR, group, period, category
│  │  └─ notes.ts       note/definition content
│  ├─ App.tsx, main.tsx, index.css
├─ tests/               Vitest tests for lib/*
├─ vercel.json          SPA rewrite
└─ README.md
```

The logic in `lib/` stays separate from the UI so it can be tested on its own.

---

## 6. Design

- Mobile first: most students will open it on a phone.
- Colours follow Rajah 3.9 so the diagram and the calculators match: **teal** for jisim, **green** for bilangan zarah, **brown/peach** for bilangan mol, **olive/yellow** for isi padu gas.
- Light and dark mode.
- Language: **English by default**, with an **EN / BM** toggle in the navbar. Malay text uses the textbook terms (JAR, JMR, JFR, bilangan zarah…); English uses RAM, RMM, RFM. Every string lives in `src/i18n/en.ts` and `src/i18n/ms.ts`.

---

## 7. Milestones

| # | Milestone | Deliverable |
|---|---|---|
| 1 ✅ | Setup | Vite + React + TS + Tailwind + Router, layout (navbar/footer), deployed placeholder on Vercel |
| 2 | Core logic | `mole.ts`, `units.ts`, `format.ts`, `elements.ts` data + unit tests |
| 3 | Calculator | 3 tabs with step-by-step working, molar volume toggle |
| 4 | Formula parser | `formula.ts` + jisim molar helper + chain mode |
| 5 | Periodic table | Grid, detail panel, search, list view |
| 6 | Content pages | Landing with interactive Rajah 3.9, Nota, Formula, Penukar Unit |
| 7 | Polish | Responsive check, dark mode, accessibility, SEO meta/OG image, final Vercel deploy |

---

## 8. Deploying to Vercel

1. Push the repo to GitHub.
2. In Vercel: **Add New → Project → Import** the repo. Vercel detects Vite automatically (build `npm run build`, output `dist`).
3. `vercel.json`:
   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
   ```
   so refreshing `/calculator` or `/periodic-table` does not return 404.
4. Every push to the main branch redeploys; other branches get preview URLs.

---

## 9. Possible later additions (out of scope for v1)

- Latihan / kuiz mode with random questions and marking
- Installable PWA for offline use
- Save calculation history in the browser
