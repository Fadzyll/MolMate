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

  calc: {
    title: 'Calculator',
    subtitle: 'Pick a relationship, choose what to find, then enter the values you know.',
    tabs: {
      particles: 'Moles ⇄ Particles',
      mass: 'Moles ⇄ Mass',
      volume: 'Moles ⇄ Gas volume',
    },
    find: 'Find',
    given: 'Given',
    vars: {
      n: 'Number of moles',
      N: 'Number of particles',
      NA: 'Avogadro constant',
      m: 'Mass',
      M: 'Molar mass',
      V: 'Volume of gas',
      Vm: 'Molar volume',
    },
    particleType: 'Type of particle',
    particle: {
      particles: 'particles',
      atoms: 'atoms',
      molecules: 'molecules',
      ions: 'ions',
    },
    condition: 'Conditions',
    room: 'Room conditions',
    stp: 'STP',
    constant: 'Fixed constant',
    working: 'Working',
    convertUnits: 'Convert units',
    formula: 'Formula',
    substitute: 'Substitute',
    answer: 'Answer',
    copy: 'Copy answer',
    copied: 'Copied!',
    example: 'Try an example',
    clear: 'Clear',
    empty: 'Enter the values above to see the answer and full working.',
    sciTip: 'Type the number and its power of ten, e.g. 1.204 × 10^24.',
    errors: {
      invalid: 'Enter a number, e.g. 0.5 or 6.02e23',
      notPositive: 'Enter a value greater than zero',
    },
    gasOnly: 'Molar volume only applies to gases.',
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
