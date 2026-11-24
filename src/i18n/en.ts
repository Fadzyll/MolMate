const en = {
  appName: 'MolMate',
  tagline: 'Your mole concept companion',

  nav: {
    home: 'Home',
    calculator: 'Calculator',
    notes: 'Notes',
    formulas: 'Formulas',
    units: 'Units',
    periodicTable: 'Periodic Table',
    menu: 'Menu',
  },

  toggle: {
    language: 'Language',
    themeToLight: 'Switch to light mode',
    themeToDark: 'Switch to dark mode',
  },

  home: {
    heroTitle: 'Master the mole concept',
    heroText:
      'Convert between moles, number of particles, mass and gas volume, with step-by-step working, notes and a periodic table.',
    start: 'Start calculating',
    diagramTitle: 'How the quantities link together',
    diagramText: 'The number of moles is the bridge between every other quantity. Tap a box to open its calculator.',
    featuresTitle: 'Everything in one place',
  },

  quantity: {
    mass: 'Mass (g)',
    mole: 'Number of moles',
    particles: 'Number of particles',
    volume: 'Volume of gas',
  },

  op: {
    timesMolarMass: '× molar mass',
    divMolarMass: '÷ molar mass',
    timesNA: '× N_A',
    divNA: '÷ N_A',
    timesMolarVolume: '× molar volume',
    divMolarVolume: '÷ molar volume',
  },

  features: {
    calculator: 'Moles ⇄ particles, mass and gas volume, with full working.',
    notes: 'Definitions of RAM, RMM, RFM, mole and the Avogadro constant.',
    formulas: 'Every formula on one printable sheet.',
    units: 'Convert g, kg, cm³, dm³ and mol in a click.',
    periodicTable: 'RAM and number of electrons for every element.',
  },

  comingSoon: 'Coming soon',
  comingSoonText: 'This section is being built. Check back shortly!',

  notFound: {
    title: 'Page not found',
    text: "We couldn't find that page.",
    back: 'Back to home',
  },

  footer: {
    credit: 'Made by [Your Name] · [School Name]',
    text: 'Built for KSSM Form 4 Chemistry — Chapter 3: The Mole Concept.',
  },
}

export default en

// The shape every translation must follow, with string leaves.
type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> }
export type Dictionary = Widen<typeof en>
