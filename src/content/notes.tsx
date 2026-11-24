import type { ReactNode } from 'react'
import { Formula } from '../components/ui/Formula'
import { Sym } from '../components/ui/Num'
import type { Language } from '../i18n/useLanguage'

/**
 * Notes page content (English and Malay). Edit text here — each note has a
 * definition, optional key points, and an example. Worked examples follow.
 */

export interface Note {
  id: string
  title: string
  /** Short tag shown on the card, e.g. "RAM" / "JAR". */
  tag?: string
  definition: ReactNode
  points?: ReactNode[]
  example?: ReactNode
}

export interface WorkedExample {
  id: string
  question: ReactNode
  steps: ReactNode[]
  answer: ReactNode
  /** Calculator tab that solves this kind of question. */
  tab: 'particles' | 'mass' | 'volume' | 'chain'
}

/** The Avogadro constant symbol, N with subscript A. */
const na = <Sym s="N_A" />
const sci = (a: string, n: number) => (
  <span className="whitespace-nowrap">
    {a} × 10<sup>{n}</sup>
  </span>
)

export function getNotes(lang: Language): Note[] {
  const L = <T extends ReactNode>(en: T, ms: T): T => (lang === 'ms' ? ms : en)

  return [
    {
      id: 'mole',
      title: L('Mole (mol)', 'Mol'),
      tag: 'mol',
      definition: L(
        <>
          One <strong>mole</strong> is the amount of substance that contains as many particles as there are atoms in
          exactly <strong>12 g of carbon-12</strong>.
        </>,
        <>
          Satu <strong>mol</strong> ialah kuantiti bahan yang mengandungi bilangan zarah yang sama dengan bilangan atom
          dalam <strong>12 g karbon-12</strong>.
        </>,
      ),
      points: [
        L(
          <>The unit of the amount of substance is the mole (mol).</>,
          <>Unit bagi kuantiti bahan ialah mol.</>,
        ),
        L(
          <>
            1 mol of any substance always contains {sci('6.02', 23)} particles.
          </>,
          <>
            1 mol sebarang bahan sentiasa mengandungi {sci('6.02', 23)} zarah.
          </>,
        ),
      ],
      example: L(
        <>
          1 mol of sodium contains {sci('6.02', 23)} sodium atoms. 2 mol of water contains 2 × {sci('6.02', 23)} ={' '}
          {sci('1.204', 24)} water molecules.
        </>,
        <>
          1 mol natrium mengandungi {sci('6.02', 23)} atom natrium. 2 mol air mengandungi 2 × {sci('6.02', 23)} ={' '}
          {sci('1.204', 24)} molekul air.
        </>,
      ),
    },
    {
      id: 'avogadro',
      title: L('Avogadro constant', 'Pemalar Avogadro'),
      tag: 'N_A',
      definition: L(
        <>
          The <strong>Avogadro constant</strong>, {na}, is the number of particles in one mole of a substance:{' '}
          <strong>
            {na} = {sci('6.02', 23)} mol<sup>−1</sup>
          </strong>
          .
        </>,
        <>
          <strong>Pemalar Avogadro</strong>, {na}, ialah bilangan zarah dalam satu mol bahan:{' '}
          <strong>
            {na} = {sci('6.02', 23)} mol<sup>−1</sup>
          </strong>
          .
        </>,
      ),
      points: [
        L(
          <>
            Moles → particles: multiply by {na}. Particles → moles: divide by {na}.
          </>,
          <>
            Mol → zarah: darab dengan {na}. Zarah → mol: bahagi dengan {na}.
          </>,
        ),
      ],
      example: L(
        <>
          Number of atoms in 0.5 mol of magnesium = 0.5 × {sci('6.02', 23)} = {sci('3.01', 23)} atoms.
        </>,
        <>
          Bilangan atom dalam 0.5 mol magnesium = 0.5 × {sci('6.02', 23)} = {sci('3.01', 23)} atom.
        </>,
      ),
    },
    {
      id: 'particles',
      title: L('Number of particles', 'Bilangan zarah'),
      definition: L(
        <>
          A <strong>particle</strong> can be an <strong>atom</strong>, a <strong>molecule</strong> or an{' '}
          <strong>ion</strong>. Always check which one the question asks for.
        </>,
        <>
          <strong>Zarah</strong> boleh jadi <strong>atom</strong>, <strong>molekul</strong> atau <strong>ion</strong>.
          Sentiasa semak zarah yang ditanya dalam soalan.
        </>,
      ),
      points: [
        L(
          <>
            <strong>Atoms:</strong> metals (Na, Cu, Fe), noble gases (He, Ne, Ar) and carbon.
          </>,
          <>
            <strong>Atom:</strong> logam (Na, Cu, Fe), gas adi (He, Ne, Ar) dan karbon.
          </>,
        ),
        L(
          <>
            <strong>Molecules:</strong> non-metal elements such as <Formula text="H2" />, <Formula text="O2" />,{' '}
            <Formula text="N2" />, <Formula text="Cl2" />, and covalent compounds such as <Formula text="H2O" />,{' '}
            <Formula text="CO2" />, <Formula text="NH3" />.
          </>,
          <>
            <strong>Molekul:</strong> unsur bukan logam seperti <Formula text="H2" />, <Formula text="O2" />,{' '}
            <Formula text="N2" />, <Formula text="Cl2" />, dan sebatian kovalen seperti <Formula text="H2O" />,{' '}
            <Formula text="CO2" />, <Formula text="NH3" />.
          </>,
        ),
        L(
          <>
            <strong>Ions:</strong> ionic compounds such as <Formula text="NaCl" /> (made of Na<sup>+</sup> and Cl
            <sup>−</sup> ions) and <Formula text="MgO" />.
          </>,
          <>
            <strong>Ion:</strong> sebatian ion seperti <Formula text="NaCl" /> (terdiri daripada ion Na<sup>+</sup> dan
            Cl<sup>−</sup>) dan <Formula text="MgO" />.
          </>,
        ),
      ],
      example: L(
        <>
          1 mol of <Formula text="O2" /> contains {sci('6.02', 23)} molecules but 2 × {sci('6.02', 23)} ={' '}
          {sci('1.204', 24)} oxygen <em>atoms</em>, because each molecule has 2 atoms.
        </>,
        <>
          1 mol <Formula text="O2" /> mengandungi {sci('6.02', 23)} molekul tetapi 2 × {sci('6.02', 23)} ={' '}
          {sci('1.204', 24)} <em>atom</em> oksigen, kerana setiap molekul ada 2 atom.
        </>,
      ),
    },
    {
      id: 'jar',
      title: L('Relative atomic mass', 'Jisim atom relatif'),
      tag: L('RAM', 'JAR'),
      definition: L(
        <>
          The <strong>relative atomic mass (RAM)</strong> of an element is the average mass of one atom of the element
          compared with <strong>1/12 of the mass of one carbon-12 atom</strong>.
        </>,
        <>
          <strong>Jisim atom relatif (JAR)</strong> suatu unsur ialah jisim purata satu atom unsur itu berbanding dengan{' '}
          <strong>1/12 jisim satu atom karbon-12</strong>.
        </>,
      ),
      points: [
        L(<>RAM has no unit, because it is a comparison.</>, <>JAR tiada unit kerana ia suatu perbandingan.</>),
        L(
          <>
            Carbon-12 is used as the standard because it is a solid at room temperature and easy to handle.
          </>,
          <>Karbon-12 digunakan sebagai piawai kerana ia pepejal pada suhu bilik dan mudah dikendalikan.</>,
        ),
      ],
      example: L(
        <>
          RAM of magnesium = 24. One magnesium atom is 24 times heavier than 1/12 of a carbon-12 atom, or 24 ÷ 12 = 2
          times heavier than one carbon-12 atom.
        </>,
        <>
          JAR magnesium = 24. Satu atom magnesium 24 kali lebih berat daripada 1/12 atom karbon-12, atau 24 ÷ 12 = 2 kali
          lebih berat daripada satu atom karbon-12.
        </>,
      ),
    },
    {
      id: 'jmr',
      title: L('Relative molecular mass', 'Jisim molekul relatif'),
      tag: L('RMM', 'JMR'),
      definition: L(
        <>
          The <strong>relative molecular mass (RMM)</strong> of a substance is the average mass of one molecule
          compared with 1/12 of the mass of one carbon-12 atom. It equals the{' '}
          <strong>sum of the RAM of all the atoms in the molecule</strong>.
        </>,
        <>
          <strong>Jisim molekul relatif (JMR)</strong> suatu bahan ialah jisim purata satu molekul bahan itu berbanding
          dengan 1/12 jisim satu atom karbon-12. Nilainya sama dengan{' '}
          <strong>hasil tambah JAR semua atom dalam molekul itu</strong>.
        </>,
      ),
      points: [L(<>Used for molecular (covalent) substances.</>, <>Digunakan untuk bahan molekul (kovalen).</>)],
      example: (
        <>
          <Formula text="H2O" /> = 2(1) + 16 = 18 · <Formula text="CO2" /> = 12 + 2(16) = 44 ·{' '}
          <Formula text="C6H12O6" /> = 6(12) + 12(1) + 6(16) = 180
        </>
      ),
    },
    {
      id: 'jfr',
      title: L('Relative formula mass', 'Jisim formula relatif'),
      tag: L('RFM', 'JFR'),
      definition: L(
        <>
          The <strong>relative formula mass (RFM)</strong> of an ionic compound is the{' '}
          <strong>sum of the RAM of all the atoms in its formula</strong>.
        </>,
        <>
          <strong>Jisim formula relatif (JFR)</strong> suatu sebatian ion ialah{' '}
          <strong>hasil tambah JAR semua atom dalam formulanya</strong>.
        </>,
      ),
      points: [
        L(
          <>
            Ionic compounds are not made of molecules, so we say RFM instead of RMM.
          </>,
          <>Sebatian ion tidak terdiri daripada molekul, jadi kita guna JFR, bukan JMR.</>,
        ),
        L(
          <>
            Brackets multiply everything inside: <Formula text="Ca(OH)2" /> has 2 O and 2 H.
          </>,
          <>
            Kurungan mendarab semua di dalamnya: <Formula text="Ca(OH)2" /> ada 2 O dan 2 H.
          </>,
        ),
      ],
      example: (
        <>
          <Formula text="NaCl" /> = 23 + 35.5 = 58.5 · <Formula text="Ca(OH)2" /> = 40 + 2(16 + 1) = 74 ·{' '}
          <Formula text="CuSO4·5H2O" /> = 64 + 32 + 4(16) + 5[2(1) + 16] = 250
        </>
      ),
    },
    {
      id: 'molar-mass',
      title: L('Molar mass', 'Jisim molar'),
      tag: 'M',
      definition: L(
        <>
          The <strong>molar mass</strong> is the mass of one mole of a substance, in{' '}
          <strong>
            g mol<sup>−1</sup>
          </strong>
          . It has the same number as the RAM, RMM or RFM.
        </>,
        <>
          <strong>Jisim molar</strong> ialah jisim satu mol bahan, dalam unit{' '}
          <strong>
            g mol<sup>−1</sup>
          </strong>
          . Nilainya sama dengan JAR, JMR atau JFR.
        </>,
      ),
      example: L(
        <>
          RMM of <Formula text="CO2" /> = 44, so its molar mass is 44 g mol<sup>−1</sup>: 1 mol of{' '}
          <Formula text="CO2" /> has a mass of 44 g.
        </>,
        <>
          JMR <Formula text="CO2" /> = 44, maka jisim molarnya 44 g mol<sup>−1</sup>: 1 mol <Formula text="CO2" /> berjisim
          44 g.
        </>,
      ),
    },
    {
      id: 'molar-volume',
      title: L('Molar volume of gas', 'Isi padu molar gas'),
      tag: 'V_m',
      definition: L(
        <>
          The <strong>molar volume</strong> is the volume occupied by one mole of <strong>any gas</strong>:{' '}
          <strong>
            24 dm<sup>3</sup> mol<sup>−1</sup>
          </strong>{' '}
          at room conditions, or{' '}
          <strong>
            22.4 dm<sup>3</sup> mol<sup>−1</sup>
          </strong>{' '}
          at STP.
        </>,
        <>
          <strong>Isi padu molar</strong> ialah isi padu yang dipenuhi oleh satu mol <strong>sebarang gas</strong>:{' '}
          <strong>
            24 dm<sup>3</sup> mol<sup>−1</sup>
          </strong>{' '}
          pada keadaan bilik, atau{' '}
          <strong>
            22.4 dm<sup>3</sup> mol<sup>−1</sup>
          </strong>{' '}
          pada STP.
        </>,
      ),
      points: [
        L(<>Only for gases — never for solids or liquids.</>, <>Hanya untuk gas — bukan untuk pepejal atau cecair.</>),
        L(
          <>
            STP = standard temperature and pressure (0 °C, 1 atm). Room conditions = 25 °C, 1 atm.
          </>,
          <>STP = suhu dan tekanan piawai (0 °C, 1 atm). Keadaan bilik = 25 °C, 1 atm.</>,
        ),
      ],
      example: L(
        <>
          At room conditions, 1 mol of <Formula text="O2" /> and 1 mol of <Formula text="CO2" /> both occupy 24 dm
          <sup>3</sup>, even though their masses are different.
        </>,
        <>
          Pada keadaan bilik, 1 mol <Formula text="O2" /> dan 1 mol <Formula text="CO2" /> masing-masing memenuhi 24 dm
          <sup>3</sup>, walaupun jisimnya berbeza.
        </>,
      ),
    },
  ]
}

export function getMistakes(lang: Language): ReactNode[] {
  const L = (en: ReactNode, ms: ReactNode) => (lang === 'ms' ? ms : en)
  return [
    L(
      <>
        Using molar volume for a solid or liquid. It is for gases only.
      </>,
      <>Menggunakan isi padu molar untuk pepejal atau cecair. Ia hanya untuk gas.</>,
    ),
    L(
      <>
        Forgetting to change cm<sup>3</sup> to dm<sup>3</sup> (÷ 1000) before dividing by 24.
      </>,
      <>
        Lupa menukar cm<sup>3</sup> kepada dm<sup>3</sup> (÷ 1000) sebelum membahagi dengan 24.
      </>,
    ),
    L(
      <>
        Mixing up molecules and atoms: 1 mol of <Formula text="H2O" /> has 3 × {na} atoms.
      </>,
      <>
        Keliru antara molekul dan atom: 1 mol <Formula text="H2O" /> ada 3 × {na} atom.
      </>,
    ),
    L(
      <>
        Forgetting the number outside brackets: <Formula text="Al2(SO4)3" /> has 12 oxygen atoms, not 4.
      </>,
      <>
        Lupa nombor di luar kurungan: <Formula text="Al2(SO4)3" /> ada 12 atom oksigen, bukan 4.
      </>,
    ),
  ]
}

export function getWorkedExamples(lang: Language): WorkedExample[] {
  const L = (en: ReactNode, ms: ReactNode) => (lang === 'ms' ? ms : en)
  const n = <Sym s="n" />
  return [
    {
      id: 'ex1',
      tab: 'particles',
      question: L(
        <>How many atoms are there in 0.25 mol of magnesium?</>,
        <>Berapakah bilangan atom dalam 0.25 mol magnesium?</>,
      ),
      steps: [
        <>
          <Sym s="N" /> = {n} × {na}
        </>,
        <>
          <Sym s="N" /> = 0.25 × {sci('6.02', 23)}
        </>,
      ],
      answer: L(<>{sci('1.505', 23)} atoms</>, <>{sci('1.505', 23)} atom</>),
    },
    {
      id: 'ex2',
      tab: 'mass',
      question: L(
        <>Find the number of moles in 13 g of zinc. [RAM: Zn = 65]</>,
        <>Hitung bilangan mol dalam 13 g zink. [JAR: Zn = 65]</>,
      ),
      steps: [
        <>
          {n} = <Sym s="m" /> ÷ <Sym s="M" />
        </>,
        <>
          {n} = 13 g ÷ 65 g mol<sup>−1</sup>
        </>,
      ],
      answer: <>0.2 mol</>,
    },
    {
      id: 'ex3',
      tab: 'volume',
      question: L(
        <>
          What is the volume of 0.4 mol of <Formula text="CO2" /> gas at room conditions?
        </>,
        <>
          Berapakah isi padu 0.4 mol gas <Formula text="CO2" /> pada keadaan bilik?
        </>,
      ),
      steps: [
        <>
          <Sym s="V" /> = {n} × <Sym s="V_m" />
        </>,
        <>
          <Sym s="V" /> = 0.4 mol × 24 dm<sup>3</sup> mol<sup>−1</sup>
        </>,
      ],
      answer: (
        <>
          9.6 dm<sup>3</sup> (9600 cm<sup>3</sup>)
        </>
      ),
    },
    {
      id: 'ex4',
      tab: 'chain',
      question: L(
        <>
          How many oxygen atoms are there in 8.8 g of <Formula text="CO2" />? [RAM: C = 12, O = 16]
        </>,
        <>
          Berapakah bilangan atom oksigen dalam 8.8 g <Formula text="CO2" />? [JAR: C = 12, O = 16]
        </>,
      ),
      steps: [
        <>
          <Sym s="M" />(<Formula text="CO2" />) = 12 + 2(16) = 44 g mol<sup>−1</sup>
        </>,
        <>
          {n} = 8.8 ÷ 44 = 0.2 mol
        </>,
        L(
          <>
            Molecules = 0.2 × {sci('6.02', 23)} = {sci('1.204', 23)}
          </>,
          <>
            Molekul = 0.2 × {sci('6.02', 23)} = {sci('1.204', 23)}
          </>,
        ),
        L(
          <>
            Each <Formula text="CO2" /> molecule has 2 O atoms: 2 × {sci('1.204', 23)}
          </>,
          <>
            Setiap molekul <Formula text="CO2" /> ada 2 atom O: 2 × {sci('1.204', 23)}
          </>,
        ),
      ],
      answer: L(<>{sci('2.408', 23)} oxygen atoms</>, <>{sci('2.408', 23)} atom oksigen</>),
    },
    {
      id: 'ex5',
      tab: 'chain',
      question: L(
        <>
          Find the mass of 3.6 dm<sup>3</sup> of ammonia gas, <Formula text="NH3" />, at room conditions. [RAM: N = 14,
          H = 1]
        </>,
        <>
          Hitung jisim 3.6 dm<sup>3</sup> gas ammonia, <Formula text="NH3" />, pada keadaan bilik. [JAR: N = 14, H = 1]
        </>,
      ),
      steps: [
        <>
          {n} = <Sym s="V" /> ÷ <Sym s="V_m" /> = 3.6 ÷ 24 = 0.15 mol
        </>,
        <>
          <Sym s="M" />(<Formula text="NH3" />) = 14 + 3(1) = 17 g mol<sup>−1</sup>
        </>,
        <>
          <Sym s="m" /> = {n} × <Sym s="M" /> = 0.15 × 17
        </>,
      ],
      answer: <>2.55 g</>,
    },
  ]
}
