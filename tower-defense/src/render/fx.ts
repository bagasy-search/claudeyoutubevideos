import { Container, Sprite, Text, Texture } from 'pixi.js'

/**
 * Juice: particulas, numeros de dano, ondas de explosion y screen shake.
 *
 * Todo esta pooleado. Crear/destruir Sprites y Texts por frame es el camino
 * mas corto a que el GC te coma los 60fps.
 */

const MAX_PARTICLES = 600
const MAX_NUMBERS = 48
const MAX_RINGS = 32

interface Particle {
  sprite: Sprite
  vx: number
  vy: number
  life: number
  maxLife: number
  drag: number
}

export class FxLayer {
  readonly container = new Container()
  private particles: Particle[] = []
  private pFree: number[] = []
  private numbers: { text: Text; vy: number; life: number }[] = []
  private nFree: number[] = []
  private rings: { sprite: Sprite; life: number; maxLife: number; target: number }[] = []
  private rFree: number[] = []

  shakeAmount = 0
  shakeX = 0
  shakeY = 0

  private t = 0

  constructor(
    private dot: Texture,
    private ring: Texture,
  ) {
    this.container.eventMode = 'none'

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const s = new Sprite(this.dot)
      s.anchor.set(0.5)
      s.visible = false
      this.container.addChild(s)
      this.particles.push({ sprite: s, vx: 0, vy: 0, life: 0, maxLife: 1, drag: 3 })
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
        style: { fontFamily: 'monospace', fontSize: 14, fill: 0xffffff, fontWeight: '700' },
      })
      t.anchor.set(0.5)
      t.visible = false
      this.container.addChild(t)
      this.numbers.push({ text: t, vy: 0, life: 0 })
      this.nFree.push(i)
    }
  }

  burst(x: number, y: number, color: number, count = 6, power = 90): void {
    for (let k = 0; k < count; k++) {
      const i = this.pFree.pop()
      if (i === undefined) return
      const p = this.particles[i]
      const a = Math.random() * Math.PI * 2
      const sp = power * (0.4 + Math.random() * 0.8)
      p.vx = Math.cos(a) * sp
      p.vy = Math.sin(a) * sp
      p.maxLife = 0.25 + Math.random() * 0.3
      p.life = p.maxLife
      p.drag = 4
      p.sprite.visible = true
      p.sprite.position.set(x, y)
      p.sprite.tint = color
      p.sprite.scale.set(0.5 + Math.random() * 0.5)
      p.sprite.alpha = 1
    }
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
    n.text.style.fill = crit ? 0xffd166 : 0xffffff
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
    this.t += dt

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
      p.vy = p.vy * k + 160 * dt
      p.sprite.x += p.vx * dt
      p.sprite.y += p.vy * dt
      p.sprite.alpha = p.life / p.maxLife
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
