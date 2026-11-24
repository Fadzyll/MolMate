import { useEffect, useRef } from 'react'

/**
 * Interactive 3D Bohr model drawn on a canvas: a nucleus of protons and
 * neutrons with electrons orbiting in tilted shells. Drag to rotate.
 * No 3D library — a small perspective projection keeps the bundle light.
 */

interface Props {
  protons: number
  neutrons: number
  shells: number[]
  /** Accessible description of the model. */
  label: string
}

type Vec = [number, number, number]

/** Camera distance for the perspective projection (bigger = flatter). */
const CAMERA = 4

const COLORS = {
  proton: ['#fda4af', '#e11d48', '#4c0519'],
  neutron: ['#e2e8f0', '#64748b', '#0f172a'],
  electron: '#22d3ee',
}

/** A shaded sphere drawn once, then stamped with drawImage each frame. */
function makeSphere([light, mid, dark]: string[]): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(22, 22, 4, 32, 32, 32)
  grad.addColorStop(0, light)
  grad.addColorStop(0.55, mid)
  grad.addColorStop(1, dark)
  g.fillStyle = grad
  g.beginPath()
  g.arc(32, 32, 31, 0, Math.PI * 2)
  g.fill()
  return c
}

function makeGlow(color: string): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, '#ffffff')
  grad.addColorStop(0.18, color)
  grad.addColorStop(0.45, color + '66')
  grad.addColorStop(1, color + '00')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  return c
}

/** Deterministic shuffle so the same element always looks the same. */
function seededShuffle<T>(items: T[], seed: number): T[] {
  const a = [...items]
  let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function rotate([x, y, z]: Vec, yaw: number, pitch: number): Vec {
  const cy = Math.cos(yaw)
  const sy = Math.sin(yaw)
  const x1 = x * cy + z * sy
  const z1 = -x * sy + z * cy
  const cp = Math.cos(pitch)
  const sp = Math.sin(pitch)
  return [x1, y * cp - z1 * sp, y * sp + z1 * cp]
}

/** Each shell gets its own tilt so the orbits cross like the classic atom icon. */
const TILT_X = [0.5, 1.25, 0.85, 1.45, 0.65, 1.1, 0.35]
const TILT_Y = [0, 1.15, 2.3, 0.6, 1.75, 2.85, 1.0]

function shellPoint(radius: number, angle: number, shell: number): Vec {
  const tiltX = TILT_X[shell % 7]
  const tiltY = TILT_Y[shell % 7]
  const p: Vec = [radius * Math.cos(angle), radius * Math.sin(angle), 0]
  const y = p[1] * Math.cos(tiltX)
  const z = p[1] * Math.sin(tiltX)
  return [p[0] * Math.cos(tiltY) + z * Math.sin(tiltY), y, -p[0] * Math.sin(tiltY) + z * Math.cos(tiltY)]
}

export default function AtomModel({ protons, neutrons, shells, label }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // A string key so a new array with the same shells doesn't restart the animation.
  const shellKey = shells.join('.')

  useEffect(() => {
    const shellList = shellKey.split('.').map(Number)
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const protonImg = makeSphere(COLORS.proton)
    const neutronImg = makeSphere(COLORS.neutron)
    const electronImg = makeGlow(COLORS.electron)

    // ----- nucleus layout: nucleons packed in a ball (Fibonacci spiral) -----
    const total = protons + neutrons
    const nucleusR = 0.06 + 0.028 * Math.cbrt(total)
    const nucleonR = total === 1 ? 0.07 : (nucleusR / Math.cbrt(total)) * 1.25
    const kinds = seededShuffle(
      [...Array(protons).fill('p'), ...Array(neutrons).fill('n')] as ('p' | 'n')[],
      protons * 7 + neutrons,
    )
    const golden = Math.PI * (3 - Math.sqrt(5))
    const nucleons = kinds.map((kind, i): { pos: Vec; kind: 'p' | 'n' } => {
      if (total === 1) return { pos: [0, 0, 0], kind }
      const r = (nucleusR - nucleonR * 0.6) * Math.cbrt((i + 0.5) / total)
      const y = 1 - (2 * (i + 0.5)) / total
      const ring = Math.sqrt(1 - y * y)
      const theta = golden * i
      return { pos: [r * ring * Math.cos(theta), r * y, r * ring * Math.sin(theta)], kind }
    })

    // ----- shells -----
    const inner = nucleusR + 0.14
    const outer = 0.8
    const radii = shellList.map((_, i) => (shellList.length === 1 ? (inner + outer) / 2.2 : inner + ((outer - inner) * i) / (shellList.length - 1)))
    const SEGMENTS = 72

    // ----- interaction -----
    let yaw = 0.6
    let pitch = 0.45
    let dragging = false
    let lastX = 0
    let lastY = 0
    let velocity = reduceMotion ? 0 : 0.35 // radians per second of auto-spin

    const onDown = (e: PointerEvent) => {
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
      canvas.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      yaw += dx * 0.01
      pitch = Math.max(-1.3, Math.min(1.3, pitch + dy * 0.01))
      velocity = reduceMotion ? 0 : Math.max(-3, Math.min(3, dx * 0.15)) || 0.35
    }
    const onUp = () => {
      dragging = false
    }
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)

    // ----- sizing -----
    let size = 0
    let dpr = 1
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      size = canvas.clientWidth
      canvas.width = Math.round(size * dpr)
      canvas.height = Math.round(size * dpr)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    // ----- render loop -----
    type Item = { z: number; draw: () => void }
    let raf = 0
    let last = performance.now()
    let time = 0

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!reduceMotion) time += dt
      if (!dragging) {
        yaw += velocity * dt
        velocity += (Math.sign(velocity || 1) * 0.35 - velocity) * Math.min(1, dt * 1.5) // ease back to gentle spin
        if (reduceMotion) velocity = 0
      }

      const half = (size * dpr) / 2
      const scaleBase = half * 0.98
      const project = (p: Vec) => {
        const [x, y, z] = rotate(p, yaw, pitch)
        const persp = CAMERA / (CAMERA - z)
        return { x: half + x * scaleBase * persp, y: half - y * scaleBase * persp, z, persp }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const items: Item[] = []

      // orbit segments
      radii.forEach((r, s) => {
        let prev = project(shellPoint(r, 0, s))
        for (let k = 1; k <= SEGMENTS; k++) {
          const cur = project(shellPoint(r, (k / SEGMENTS) * Math.PI * 2, s))
          const a = prev
          const b = cur
          const z = (a.z + b.z) / 2
          items.push({
            z,
            draw: () => {
              ctx.strokeStyle = `rgba(148, 197, 255, ${0.16 + 0.3 * ((z + 1) / 2)})`
              ctx.lineWidth = 1.2 * dpr
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.stroke()
            },
          })
          prev = cur
        }
      })

      // electrons
      shellList.forEach((count, s) => {
        const speed = 1.4 / (1 + s * 0.45)
        for (let k = 0; k < count; k++) {
          const angle = (k / count) * Math.PI * 2 + time * speed + s * 0.7
          const p = project(shellPoint(radii[s], angle, s))
          const d = 0.075 * scaleBase * p.persp
          items.push({ z: p.z + 0.001, draw: () => ctx.drawImage(electronImg, p.x - d / 2, p.y - d / 2, d, d) })
        }
      })

      // nucleons
      for (const n of nucleons) {
        const p = project(n.pos)
        const d = nucleonR * 2 * scaleBase * p.persp
        const img = n.kind === 'p' ? protonImg : neutronImg
        items.push({ z: p.z, draw: () => ctx.drawImage(img, p.x - d / 2, p.y - d / 2, d, d) })
      }

      items.sort((a, b) => a.z - b.z)
      for (const it of items) it.draw()

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
    }
  }, [protons, neutrons, shellKey])

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className="aspect-square w-full cursor-grab touch-none active:cursor-grabbing"
    />
  )
}
