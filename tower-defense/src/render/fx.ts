import { Container, Graphics, Sprite, Text, Texture } from 'pixi.js'
import { SEMANTIC, jitterHue, shade } from './palette'

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
/** Ventana de agregacion de los numeros de dano, en segundos. */
const AGGREGATE_WINDOW = 0.18
const MAX_FLASHES = 24

interface Particle {
  sprite: Sprite
  vx: number
  vy: number
  life: number
  maxLife: number
  drag: number
  spin: number
  grow: number
  /** Por particula: el humo sube, las chispas caen. */
  gravity: number
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
  private numbers: { text: Text; vy: number; life: number; maxLife: number; pop: number }[] = []
  private nFree: number[] = []
  /**
   * Los anillos se redibujan por frame en vez de escalar una textura. Escalar
   * una textura escala tambien su trazo: el anillo empieza como un pelo de
   * 0.9px y termina en 6.5px. Un contorno tiene que medir lo mismo siempre.
   */
  private ringGfx = new Graphics()
  private rings: { x: number; y: number; color: number; life: number; maxLife: number; target: number }[] = []
  private corpses: Corpse[] = []
  private cFree: number[] = []
  /** Capa aditiva: fogonazos y nucleos brillantes. */
  readonly addContainer = new Container()
  private flashes: { sprite: Sprite; life: number; maxLife: number; radius: number }[] = []
  private flashPool: Sprite[] = []

  /**
   * Screenshake como RESORTE con impulso direccional.
   *
   * La version anterior sorteaba una posicion nueva cada frame. Eiserloh lo
   * señala explicitamente: `random()` por frame es discontinuo y se percibe
   * como zumbido, no como sacudida. Un resorte amortiguado da un movimiento
   * continuo, y como el impulso apunta en sentido contrario al impacto, la
   * camara ademas comunica DE DONDE vino el golpe.
   */
  private shakeVx = 0
  private shakeVy = 0
  shakeX = 0
  shakeY = 0
  /** 0..1. A 0 la camara no se mueve nunca — es un ajuste de accesibilidad. */
  shakeIntensity = 1

  constructor(private soft: Texture) {
    this.container.eventMode = 'none'
    this.backContainer.eventMode = 'none'
    this.addContainer.eventMode = 'none'
    this.addContainer.blendMode = 'add'

    for (let i = 0; i < MAX_FLASHES; i++) {
      const s = new Sprite(this.soft)
      s.anchor.set(0.5)
      s.visible = false
      this.addContainer.addChild(s)
      this.flashPool.push(s)
    }

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
      this.particles.push({ sprite: s, vx: 0, vy: 0, life: 0, maxLife: 1, drag: 3, spin: 0, grow: 0, gravity: 0 })
      this.pFree.push(i)
    }
    this.container.addChild(this.ringGfx)
    for (let i = 0; i < MAX_NUMBERS; i++) {
      const t = new Text({
        text: '',
        style: {
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 13,
          fill: 0xffffff,
          fontWeight: '700',
          // Sin contorno, un numero claro desaparece encima de las particulas
          // claras de la propia explosion que lo genero.
          stroke: { color: 0x120c06, width: 3.5, join: 'round' },
        },
      })
      t.anchor.set(0.5)
      t.visible = false
      this.container.addChild(t)
      this.numbers.push({ text: t, vy: 0, life: 0, maxLife: 0.6, pop: 1 })
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
      p.spin = (Math.random() - 0.5) * 14
      p.grow = -0.7
      p.gravity = 170
      p.sprite.visible = true
      p.sprite.position.set(x, y)
      // Cada particula se desvia un poco del color de la rafaga. Un puñado de
      // puntos exactamente del mismo tono se lee como papel picado.
      p.sprite.tint = jitterHue(color, Math.random(), 14)
      p.sprite.rotation = Math.random() * Math.PI
      p.sprite.scale.set(size * (0.22 + Math.random() * 0.28))
      p.sprite.alpha = 1
    }
  }

  /**
   * Rafaga en CONO, con direccion. Un impacto no esparce chispas en 360 grados:
   * salen rebotadas hacia un lado. El cono es lo que distingue un efecto de un
   * puñado de papel picado.
   */
  cone(x: number, y: number, angle: number, spread: number, color: number, count = 5, power = 110, size = 1): void {
    for (let k = 0; k < count; k++) {
      const i = this.pFree.pop()
      if (i === undefined) return
      const p = this.particles[i]
      const a = angle + (Math.random() - 0.5) * spread
      const sp = power * (0.5 + Math.random() * 0.8)
      p.vx = Math.cos(a) * sp
      p.vy = Math.sin(a) * sp
      p.maxLife = 0.1 + Math.random() * 0.14
      p.life = p.maxLife
      p.drag = 7
      p.spin = 0
      p.grow = -1.4
      p.gravity = 40
      p.sprite.visible = true
      p.sprite.position.set(x, y)
      p.sprite.tint = jitterHue(color, Math.random(), 10)
      p.sprite.rotation = a
      p.sprite.scale.set(size * (0.18 + Math.random() * 0.2))
      p.sprite.alpha = 1
    }
  }

  /**
   * Destello aditivo instantaneo. Es la forma barata de "brillo": un sprite
   * sumado cuesta un batch, un filtro de bloom cuesta un framebuffer por objeto.
   */
  flashAt(x: number, y: number, color: number, radius: number): void {
    if (this.flashes.length >= MAX_FLASHES) this.flashes.shift()
    const s = this.flashPool.pop()
    if (!s) return
    s.visible = true
    s.position.set(x, y)
    s.tint = color
    s.alpha = 0.9
    s.scale.set(radius / 16)
    this.flashes.push({ sprite: s, life: 0.09, maxLife: 0.09, radius })
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
      p.spin = (Math.random() - 0.5) * 2
      p.grow = 0.9
      // El humo SUBE. Antes recibia la misma gravedad que las chispas y
      // terminaba cayendo, que es exactamente lo que el humo no hace.
      p.gravity = -34
      p.sprite.visible = true
      p.sprite.position.set(x, y)
      p.sprite.tint = jitterHue(color, Math.random(), 8)
      p.sprite.rotation = Math.random() * Math.PI
      p.sprite.scale.set(0.25 + Math.random() * 0.2)
      p.sprite.alpha = 0.55
    }
  }

  corpse(texture: Texture, x: number, y: number, scale: number): void {
    const i = this.cFree.pop()
    if (i === undefined) return
    const c = this.corpses[i]
    c.sprite.texture = texture
    c.sprite.visible = true
    c.sprite.position.set(x, y)
    c.sprite.rotation = 0
    // Sin tintar: aplicar un tono al sprite entero aplasta contorno, ojos y
    // cara en una sola silueta de un color.
    c.sprite.tint = 0xffffff
    c.sprite.alpha = 1
    c.baseScale = scale
    c.maxLife = 0.55
    c.life = c.maxLife
    c.vx = (Math.random() - 0.5) * 26
    c.vy = (Math.random() - 0.5) * 26
  }

  ringAt(x: number, y: number, radius: number, color: number): void {
    if (this.rings.length >= MAX_RINGS) this.rings.shift()
    this.rings.push({ x, y, color, life: 0.36, maxLife: 0.36, target: radius })
  }

  /**
   * Acumulador de dano por enemigo. Con veinte torres disparando salen cientos
   * de numeros por segundo y la pantalla se vuelve ilegible; se juntan los
   * golpes de una ventana corta y sale UN numero con la suma.
   */
  private pending = new Map<number, { value: number; x: number; y: number; crit: boolean; t: number }>()

  /** Suma un golpe al acumulador del enemigo `id`. */
  damage(id: number, x: number, y: number, value: number, crit: boolean): void {
    const cur = this.pending.get(id)
    if (cur) {
      cur.value += value
      cur.x = x
      cur.y = y
      cur.crit = cur.crit || crit
      return
    }
    this.pending.set(id, { value, x, y, crit, t: AGGREGATE_WINDOW })
  }

  /** Vuelca de inmediato lo acumulado de un enemigo (por ejemplo, al morir). */
  flushDamage(id: number): void {
    const cur = this.pending.get(id)
    if (!cur) return
    this.pending.delete(id)
    this.number(cur.x, cur.y, cur.value, cur.crit)
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
    n.text.position.set(x + (Math.random() - 0.5) * 14, y - 8)
    n.vy = crit ? -52 : -34
    n.maxLife = crit ? 0.75 : 0.6
    n.life = n.maxLife
    n.pop = crit ? 1.5 : 1.25
    n.text.scale.set(0.3)
  }

  /** Impulso sin direccion preferida. Para explosiones y sucesos globales. */
  shake(power: number): void {
    const a = Math.random() * Math.PI * 2
    this.shakeFrom(Math.cos(a), Math.sin(a), power)
  }

  /**
   * Impulso en la direccion (dx, dy), que debe apuntar DESDE el impacto HACIA
   * afuera. Se combina por maximo con lo que ya haya en curso.
   */
  shakeFrom(dx: number, dy: number, power: number): void {
    if (this.shakeIntensity <= 0) return
    const len = Math.hypot(dx, dy) || 1
    const p = power * this.shakeIntensity
    const vx = (dx / len) * p * 60
    const vy = (dy / len) * p * 60
    if (Math.hypot(this.shakeVx, this.shakeVy) > Math.hypot(vx, vy)) return
    this.shakeVx = vx
    this.shakeVy = vy
  }

  update(dt: number): void {
    for (const [id, acc] of this.pending) {
      acc.t -= dt
      if (acc.t <= 0) {
        this.pending.delete(id)
        this.number(acc.x, acc.y, acc.value, acc.crit)
      }
    }

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
      p.vy = p.vy * k + p.gravity * dt
      p.sprite.x += p.vx * dt
      p.sprite.y += p.vy * dt
      p.sprite.rotation += p.spin * dt
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

    this.ringGfx.clear()
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i]
      r.life -= dt
      if (r.life <= 0) {
        this.rings.splice(i, 1)
        continue
      }
      const t = 1 - r.life / r.maxLife
      const eased = 1 - Math.pow(1 - t, 3)
      const radius = Math.max(1, r.target * eased)
      // Grosor constante en pantalla, alfa que se apaga.
      this.ringGfx
        .circle(r.x, r.y, radius)
        .stroke({ width: 3, color: r.color, alpha: 0.9 * (1 - t) })
      this.ringGfx
        .circle(r.x, r.y, radius * 0.82)
        .stroke({ width: 1.5, color: shade(r.color, 0.3), alpha: 0.5 * (1 - t) })
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
      // Entra de golpe y se asienta: sin este pop el numero aparece plano.
      const age = 1 - n.life / n.maxLife
      const grow = age < 0.25 ? age / 0.25 : 1
      const overshoot = 1 - Math.pow(1 - grow, 3)
      n.text.scale.set(0.3 + (n.pop - 0.3) * overshoot * (1 - age * 0.2))
      n.text.alpha = Math.min(1, n.life * 4)
    }

    for (let i = this.flashes.length - 1; i >= 0; i--) {
      const f = this.flashes[i]
      f.life -= dt
      if (f.life <= 0) {
        f.sprite.visible = false
        this.flashPool.push(f.sprite)
        this.flashes.splice(i, 1)
        continue
      }
      const t = f.life / f.maxLife
      f.sprite.alpha = 0.9 * t
      f.sprite.scale.set((f.radius * (1 + (1 - t) * 0.7)) / 16)
    }

    // Resorte amortiguado: acelera de vuelta al origen y pierde energia.
    const STIFFNESS = 260
    const DAMPING = 15
    this.shakeVx += (-this.shakeX * STIFFNESS - this.shakeVx * DAMPING) * dt
    this.shakeVy += (-this.shakeY * STIFFNESS - this.shakeVy * DAMPING) * dt
    this.shakeX += this.shakeVx * dt
    this.shakeY += this.shakeVy * dt
    if (Math.abs(this.shakeX) < 0.05 && Math.abs(this.shakeVx) < 0.5) {
      this.shakeX = 0
      this.shakeVx = 0
    }
    if (Math.abs(this.shakeY) < 0.05 && Math.abs(this.shakeVy) < 0.5) {
      this.shakeY = 0
      this.shakeVy = 0
    }
  }
}
