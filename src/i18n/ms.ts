import type { Dictionary } from './en'

const ms: Dictionary = {
  appName: 'MolMate',
  tagline: 'Rakan konsep mol anda',

  nav: {
    home: 'Utama',
    calculator: 'Kalkulator',
    notes: 'Nota',
    formulas: 'Formula',
    units: 'Unit',
    periodicTable: 'Jadual Berkala',
    menu: 'Menu',
  },

  toggle: {
    language: 'Bahasa',
    themeToLight: 'Tukar ke mod cerah',
    themeToDark: 'Tukar ke mod gelap',
  },

  home: {
    heroTitle: 'Kuasai konsep mol',
    heroText:
      'Tukar antara bilangan mol, bilangan zarah, jisim dan isi padu gas, dengan jalan kerja langkah demi langkah, nota dan jadual berkala.',
    start: 'Mula kira',
    diagramTitle: 'Hubung kait antara kuantiti',
    diagramText: 'Bilangan mol menjadi perantaraan bagi semua kuantiti lain. Tekan kotak untuk membuka kalkulatornya.',
    featuresTitle: 'Semua di satu tempat',
  },

  quantity: {
    mass: 'Jisim (g)',
    mole: 'Bilangan mol',
    particles: 'Bilangan zarah',
    volume: 'Isi padu gas',
  },

  op: {
    timesMolarMass: '× jisim molar',
    divMolarMass: '÷ jisim molar',
    timesNA: '× N_A',
    divNA: '÷ N_A',
    timesMolarVolume: '× isi padu molar',
    divMolarVolume: '÷ isi padu molar',
  },

  features: {
    calculator: 'Mol ⇄ zarah, jisim dan isi padu gas, dengan jalan kerja penuh.',
    notes: 'Definisi JAR, JMR, JFR, mol dan pemalar Avogadro.',
    formulas: 'Semua formula dalam satu helaian yang boleh dicetak.',
    units: 'Tukar g, kg, cm³, dm³ dan mol dengan mudah.',
    periodicTable: 'JAR dan bilangan elektron bagi setiap unsur.',
  },

  calc: {
    title: 'Kalkulator',
    subtitle: 'Pilih hubungan, pilih apa yang hendak dicari, kemudian masukkan nilai yang diketahui.',
    tabs: {
      particles: 'Mol ⇄ Zarah',
      mass: 'Mol ⇄ Jisim',
      volume: 'Mol ⇄ Isi padu gas',
    },
    find: 'Cari',
    given: 'Diberi',
    vars: {
      n: 'Bilangan mol',
      N: 'Bilangan zarah',
      NA: 'Pemalar Avogadro',
      m: 'Jisim',
      M: 'Jisim molar',
      V: 'Isi padu gas',
      Vm: 'Isi padu molar',
    },
    particleType: 'Jenis zarah',
    particle: {
      particles: 'zarah',
      atoms: 'atom',
      molecules: 'molekul',
      ions: 'ion',
    },
    condition: 'Keadaan',
    room: 'Keadaan bilik',
    stp: 'STP',
    constant: 'Pemalar tetap',
    working: 'Jalan kerja',
    convertUnits: 'Tukar unit',
    formula: 'Formula',
    substitute: 'Gantikan nilai',
    answer: 'Jawapan',
    copy: 'Salin jawapan',
    copied: 'Disalin!',
    example: 'Cuba contoh',
    clear: 'Kosongkan',
    empty: 'Masukkan nilai di atas untuk melihat jawapan dan jalan kerja penuh.',
    sciTip: 'Taip nombor dan kuasa sepuluhnya, cth. 1.204 × 10^24.',
    errors: {
      invalid: 'Masukkan nombor, cth. 0.5 atau 6.02e23',
      notPositive: 'Masukkan nilai lebih besar daripada sifar',
    },
    gasOnly: 'Isi padu molar hanya digunakan untuk gas.',
  },

  comingSoon: 'Akan datang',
  comingSoonText: 'Bahagian ini sedang dibina. Sila kembali sebentar lagi!',

  notFound: {
    title: 'Halaman tidak dijumpai',
    text: 'Kami tidak dapat mencari halaman itu.',
    back: 'Kembali ke laman utama',
  },

  footer: {
    credit: 'Dibina oleh [Nama Anda] · [Nama Sekolah]',
    text: 'Dibina untuk Kimia KSSM Tingkatan 4 — Bab 3: Konsep Mol.',
  },
}

export default ms
