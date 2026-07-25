import { Container, Sprite, Text, Texture } from 'pixi.js'
import { SEMANTIC } from './palette'

/**
 * Juice: partículas, números de daño, ondas de explosión, cadáveres y shake.
 *
 * Todo está pooleado. Crear y destruir Sprites y Texts por frame es el camino
 * más corto a que el GC te coma los 60fps.
 */

const MAX_PARTICLES = 700
const MAX_NUMBERS = 48
const MAX_RINGS = 40
const MAX_CORPSES = 64

interface Particle {
  sprite: Sprite
  vx: number
  vy: number
  life: number
  maxLife: number
  drag: number
  spin: number
  grow: number
}

interface Corpse {
  sprite: Sprite
  life: number
  maxLife: number
  vx: number
  vy: number
  baseScale: number
}

export class FxLayer {
  readonly container = new Container()
  /** Los cadáveres van debajo de las unidades vivas. */
  readonly backContainer = new Container()

  private particles: Particle[] = []
  private pFree: number[] = []
  private numbers: { text: Text; vy: number; life: number }[] = []
  private nFree: number[] = []
  private rings: { sprite: Sprite; life: number; maxLife: number; target: number }[] = []
  private rFree: number[] = []
  private corpses: Corpse[] = []
  private cFree: number[] = []

  shakeAmount = 0
  shakeX = 0
  shakeY = 0

  constructor(
    private soft: Texture,
    private ring: Texture,
  ) {
    this.container.eventMode = 'none'
    this.backContainer.eventMode = 'none'

    for (let i = 0; i < MAX_CORPSES; i++) {
      const s = new Sprite()
      s.anchor.set(0.5)
      s.visible = false
      this.backContainer.addChild(s)
      this.corpses.push({ sprite: s, life: 0, maxLife: 1, vx: 0, vy: 0, baseScale: 1 })
      this.cFree.push(i)
    }
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const s = new Sprite(this.soft)
      s.anchor.set(0.5)
      s.visible = false
      this.container.addChild(s)
      this.particles.push({ sprite: s, vx: 0, vy: 0, life: 0, maxLife: 1, drag: 3, spin: 0, grow: 0 })
      this.pFree.push(i)
    }
    for (let i = 0; i < MAX_RINGS; i++) {
      const s = new Sprite(this.ring)
      s.anchor.set(0.5)
      s.visible = false
      this.container.addChild(s)
      this.rings.push({ sprite: s, life: 0, maxLife: 0.35, target: 40 })
      this.rFree.push(i)
    }
    for (let i = 0; i < MAX_NUMBERS; i++) {
      const t = new Text({
        text: '',
        style: {
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 13,
          fill: 0xffffff,
          fontWeight: '700',
        },
      })
      t.anchor.set(0.5)
      t.visible = false
      this.container.addChild(t)
      this.numbers.push({ text: t, vy: 0, life: 0 })
      this.nFree.push(i)
    }
  }

  burst(x: number, y: number, color: number, count = 6, power = 90, size = 1): void {
    for (let k = 0; k < count; k++) {
      const i = this.pFree.pop()
      if (i === undefined) return
      const p = this.particles[i]
      const a = Math.random() * Math.PI * 2
      const sp = power * (0.35 + Math.random() * 0.9)
      p.vx = Math.cos(a) * sp
      p.vy = Math.sin(a) * sp
      p.maxLife = 0.24 + Math.random() * 0.34
      p.life = p.maxLife
      p.drag = 4.5
      p.spin = 0
      p.grow = -0.7
      p.sprite.visible = true
      p.sprite.position.set(x, y)
      p.sprite.tint = color
      p.sprite.scale.set((size * (0.22 + Math.random() * 0.28)))
      p.sprite.alpha = 1
    }
  }

  /** Humo lento, para muertes y explosiones. Crece en vez de encogerse. */
  smoke(x: number, y: number, color: number, count = 5): void {
    for (let k = 0; k < count; k++) {
      const i = this.pFree.pop()
      if (i === undefined) return
      const p = this.particles[i]
      const a = Math.random() * Math.PI * 2
      const sp = 18 + Math.random() * 26
      p.vx = Math.cos(a) * sp
      p.vy = Math.sin(a) * sp - 12
      p.maxLife = 0.5 + Math.random() * 0.5
      p.life = p.maxLife
      p.drag = 2.2
      p.spin = 0
      p.grow = 0.9
      p.sprite.visible = true
      p.sprite.position.set(x, y)
      p.sprite.tint = color
      p.sprite.scale.set(0.25 + Math.random() * 0.2)
      p.sprite.alpha = 0.55
    }
  }

  corpse(texture: Texture, x: number, y: number, rotation: number, scale: number, tint: number): void {
    const i = this.cFree.pop()
    if (i === undefined) return
    const c = this.corpses[i]
    c.sprite.texture = texture
    c.sprite.visible = true
    c.sprite.position.set(x, y)
    c.sprite.rotation = rotation
    c.sprite.tint = tint
    c.sprite.alpha = 1
    c.baseScale = scale
    c.maxLife = 0.55
    c.life = c.maxLife
    c.vx = (Math.random() - 0.5) * 26
    c.vy = (Math.random() - 0.5) * 26
  }

  ringAt(x: number, y: number, radius: number, color: number): void {
    const i = this.rFree.pop()
    if (i === undefined) return
    const r = this.rings[i]
    r.life = 0.35
    r.maxLife = 0.35
    r.target = radius
    r.sprite.visible = true
    r.sprite.position.set(x, y)
    r.sprite.tint = color
    r.sprite.alpha = 0.9
    r.sprite.scale.set(0.15)
  }

  number(x: number, y: number, value: number, crit: boolean): void {
    const i = this.nFree.pop()
    if (i === undefined) return
    const n = this.numbers[i]
    n.text.text = crit ? `${Math.round(value)}!` : `${Math.round(value)}`
    n.text.style.fontSize = crit ? 19 : 13
    n.text.style.fill = crit ? SEMANTIC.crit : 0xe8e0cc
    n.text.visible = true
    n.text.alpha = 1
    n.text.position.set(x + (Math.random() - 0.5) * 10, y - 8)
    n.vy = -34
    n.life = 0.6
  }

  shake(amount: number): void {
    this.shakeAmount = Math.min(14, this.shakeAmount + amount)
  }

  update(dt: number): void {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i]
      if (p.life <= 0) continue
      p.life -= dt
      if (p.life <= 0) {
        p.sprite.visible = false
        this.pFree.push(i)
        continue
      }
      const k = 1 - p.drag * dt
      p.vx *= k
      p.vy = p.vy * k + 120 * dt
      p.sprite.x += p.vx * dt
      p.sprite.y += p.vy * dt
      const t = p.life / p.maxLife
      p.sprite.alpha = t * (p.grow > 0 ? 0.55 : 1)
      if (p.grow !== 0) {
        const s = p.sprite.scale.x * (1 + p.grow * dt)
        p.sprite.scale.set(Math.max(0.02, s))
      }
    }

    for (let i = 0; i < this.corpses.length; i++) {
      const c = this.corpses[i]
      if (c.life <= 0) continue
      c.life -= dt
      if (c.life <= 0) {
        c.sprite.visible = false
        this.cFree.push(i)
        continue
      }
      const t = 1 - c.life / c.maxLife
      c.vx *= 1 - 3 * dt
      c.vy *= 1 - 3 * dt
      c.sprite.x += c.vx * dt
      c.sprite.y += c.vy * dt
      // Se aplasta contra el suelo y se desvanece.
      c.sprite.scale.set(c.baseScale * (1 + t * 0.35), c.baseScale * (1 - t * 0.75))
      c.sprite.alpha = 1 - t
    }

    for (let i = 0; i < this.rings.length; i++) {
      const r = this.rings[i]
      if (r.life <= 0) continue
      r.life -= dt
      if (r.life <= 0) {
        r.sprite.visible = false
        this.rFree.push(i)
        continue
      }
      const t = 1 - r.life / r.maxLife
      const eased = 1 - Math.pow(1 - t, 3)
      // La textura del anillo mide 64px de radio.
      r.sprite.scale.set((r.target * eased) / 64)
      r.sprite.alpha = 0.9 * (1 - t)
    }

    for (let i = 0; i < this.numbers.length; i++) {
      const n = this.numbers[i]
      if (n.life <= 0) continue
      n.life -= dt
      if (n.life <= 0) {
        n.text.visible = false
        this.nFree.push(i)
        continue
      }
      n.vy += 60 * dt
      n.text.y += n.vy * dt
      n.text.alpha = Math.min(1, n.life * 3)
    }

    if (this.shakeAmount > 0) {
      this.shakeAmount = Math.max(0, this.shakeAmount - dt * 34)
      this.shakeX = (Math.random() - 0.5) * 2 * this.shakeAmount
      this.shakeY = (Math.random() - 0.5) * 2 * this.shakeAmount
    } else {
      this.shakeX = 0
      this.shakeY = 0
    }
  }
}
