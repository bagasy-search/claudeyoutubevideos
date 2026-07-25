import { Graphics, Rectangle, Texture, type Renderer as PixiRenderer } from 'pixi.js'
import { ENEMIES } from '../sim/balance/enemies'
import { TOWERS } from '../sim/balance/towers'
import { GROUND, SEMANTIC, darken, ink, lighten } from './palette'

/**
 * Fabrica de sprites procedural.
 *
 * Todo el arte de unidades se dibuja con Graphics y se hornea a Texture una sola
 * vez al arrancar. Es el mismo pipeline que describe docs/ART.md ("animar y
 * hornear a atlas"), solo que acá el atlas lo genera codigo en vez de un
 * artista: con hasta 180 unidades en pantalla no se puede redibujar geometria
 * vectorial por frame, pero cambiar `Texture` sobre un sprite pooleado es
 * gratis.
 *
 * Las criaturas se dibujan mirando a +x y el sprite se rota segun el angulo del
 * camino, asi alcanza con hornear una sola direccion en vez de ocho.
 */

export const WALK_FRAMES = 12

/** Bounding box fijo por frame: sin esto el recorte varia y el sprite tiembla. */
function bake(renderer: PixiRenderer, g: Graphics, half: number, resolution = 3): Texture {
  const tex = renderer.generateTexture({
    target: g,
    resolution,
    frame: new Rectangle(-half, -half, half * 2, half * 2),
  })
  g.destroy()
  return tex
}

// --------------------------------------------------------------- criaturas

interface CreatureSpec {
  color: number
  accent: number
  /** Cuerpo, en múltiplos del radio de juego. */
  bodyRx: number
  bodyRy: number
  /** Cuánto se estira el morro hacia adelante. Da dirección a la silueta. */
  tip: number
  legs: number
  legLen: number
  legW: number
  legSpread: number
  legSwing: number
  /** Hombreras al frente. Es como se lee "blindado" a 28 px. */
  shoulders: number
  /** Cresta longitudinal sobre el lomo. */
  ridge: number
  /** Cuernos hacia adelante. */
  horns: number
  /** Púas barridas hacia atrás. */
  crest: number
  eye: number
  /** Cuánto se hunde el cuerpo en el paso. */
  bob: number
}

/**
 * Cada criatura tiene UN rasgo de silueta que la vuelve nombrable, y nada más.
 * A 18 px no entran dos ideas.
 */
const CREATURES: Record<string, Partial<CreatureSpec>> = {
  // Gota lisa con cuatro patas: la forma base contra la que se leen las demás.
  grunt: { bodyRx: 0.84, bodyRy: 0.72, tip: 0.55, legs: 4, legLen: 0.78, legW: 0.15, legSpread: 1.08, legSwing: 0.4, ridge: 0.42, eye: 0.11, bob: 0.09 },
  // Rasgo: largo, patas larguísimas y púas barridas hacia atrás. Grita velocidad.
  runner: { bodyRx: 1.15, bodyRy: 0.44, tip: 0.85, legs: 4, legLen: 0.95, legW: 0.12, legSpread: 1.5, legSwing: 0.9, crest: 0.75, eye: 0.1, bob: 0.14 },
  // Rasgo: seis patas radiales sobre un cuerpo diminuto. Se lee como bicho, no como soldado.
  swarm: { bodyRx: 0.72, bodyRy: 0.66, tip: 0.3, legs: 6, legLen: 0.95, legW: 0.13, legSpread: 1.35, legSwing: 0.65, eye: 0.17, bob: 0.16 },
  // Rasgo: dos hombreras al frente. La armadura se ve antes de que la explique un número.
  brute: { bodyRx: 0.92, bodyRy: 0.9, tip: 0.4, legs: 4, legLen: 0.86, legW: 0.17, legSpread: 1.14, legSwing: 0.28, shoulders: 0.52, eye: 0.08, bob: 0.06 },
  // Rasgo: cuernos hacia adelante y escala rota. Se ve que es un boss sin leer nada.
  juggernaut: { bodyRx: 1.0, bodyRy: 1.0, tip: 0.35, legs: 6, legLen: 0.82, legW: 0.18, legSpread: 1.18, legSwing: 0.22, shoulders: 0.42, horns: 0.95, eye: 0.07, bob: 0.04 },
}

function specFor(id: string, color: number): CreatureSpec {
  return {
    color,
    accent: darken(color, 0.4),
    bodyRx: 1,
    bodyRy: 0.8,
    tip: 0.5,
    legs: 4,
    legLen: 0.6,
    legW: 0.18,
    legSpread: 1.05,
    legSwing: 0.45,
    shoulders: 0,
    ridge: 0,
    horns: 0,
    crest: 0,
    eye: 0.12,
    bob: 0.1,
    ...CREATURES[id],
  }
}

/**
 * Cuerpo en gota, mirando a +x. Una sola forma cerrada en vez de cuerpo + cabeza
 * suelta: a este tamaño dos círculos separados se leen como una burbuja pegada
 * al costado, no como una criatura.
 */
function bodyPath(g: Graphics, rx: number, ry: number, tip: number, cy: number): void {
  const nose = rx * (1 + tip)
  g.moveTo(nose, cy)
  g.quadraticCurveTo(rx * 0.75, cy - ry * 1.02, -rx * 0.25, cy - ry)
  g.quadraticCurveTo(-rx * 1.12, cy - ry * 0.7, -rx * 1.02, cy)
  g.quadraticCurveTo(-rx * 1.12, cy + ry * 0.7, -rx * 0.25, cy + ry)
  g.quadraticCurveTo(rx * 0.75, cy + ry * 1.02, nose, cy)
  g.closePath()
}

/**
 * Reglas de dibujo, todas heredadas del tamaño real en pantalla (12–40 px):
 *  - Las patas van FUERA de la silueta del cuerpo, o directamente no existen.
 *  - Nada dibujado en tono oscuro se ve: el suelo también es oscuro. Los
 *    detalles secundarios van en tono medio, no en sombra.
 *  - Un solo rasgo distintivo por criatura. Dos ya es ruido.
 *  - El ojo es el único punto claro. Chico, o se roba toda la atención.
 */
function drawCreature(g: Graphics, r: number, s: CreatureSpec, phase: number): void {
  const lw = Math.max(1.2, r * 0.18)
  const inkC = ink(s.color, 0.7)
  const bob = Math.cos(phase * 2) * r * s.bob
  const rx = r * s.bodyRx
  const ry = r * s.bodyRy
  const nose = rx * (1 + s.tip)

  const pairs = Math.max(1, s.legs >> 1)
  const legLen = r * s.legLen
  const legW = Math.max(1.1, r * s.legW)
  const spreadY = ry * s.legSpread
  // Tono medio: contra suelo oscuro, una pata en sombra es una pata invisible.
  const legColor = darken(s.color, 0.22)

  for (let p = 0; p < pairs; p++) {
    const px = ((p - (pairs - 1) / 2) / Math.max(1, pairs)) * rx * 1.5
    const ph = phase + p * 0.9
    for (const side of [-1, 1]) {
      const sw = Math.sin(ph + (side > 0 ? Math.PI : 0)) * r * s.legSwing
      // La pata arranca dentro del cuerpo y termina afuera: así se ve el nudillo.
      g.roundRect(px + sw - legLen * 0.5, side * spreadY - legW, legLen, legW * 2, legW)
        .fill({ color: legColor })
        .stroke({ width: lw * 0.55, color: inkC })
    }
  }

  // Púas barridas hacia atrás, antes del cuerpo para que asomen por detrás.
  if (s.crest > 0) {
    for (let i = 0; i < 3; i++) {
      const t = i / 2 - 0.5
      const cx = -rx * 0.1 + t * rx * 0.7
      const len = r * s.crest * (1 - Math.abs(t) * 0.45)
      for (const side of [-1, 1]) {
        g.poly([
          cx, bob + side * ry * 0.2,
          cx - len, bob + side * (ry * 0.55 + len * 0.55),
          cx + r * 0.16, bob + side * ry * 0.75,
        ])
          .fill({ color: darken(s.color, 0.3) })
          .stroke({ width: lw * 0.5, color: inkC })
      }
    }
  }

  // Cuernos hacia adelante: el rasgo del boss.
  if (s.horns > 0) {
    for (const side of [-1, 1]) {
      g.poly([
        rx * 0.35, bob + side * ry * 0.55,
        nose + r * s.horns * 0.75, bob + side * ry * 0.95,
        rx * 0.55, bob + side * ry * 0.15,
      ])
        .fill({ color: 0xd9c9a8 })
        .stroke({ width: lw * 0.6, color: inkC })
    }
  }

  // Cuerpo: una sola forma cerrada, relleno plano, contorno de tinta grueso.
  bodyPath(g, rx, ry, s.tip, bob)
  g.fill({ color: s.color }).stroke({ width: lw, color: inkC })

  // Hombreras al frente: como se lee "blindado" a tamaño de juego.
  if (s.shoulders > 0) {
    for (const side of [-1, 1]) {
      g.ellipse(rx * 0.22, bob + side * ry * 0.6, rx * s.shoulders * 0.5, ry * s.shoulders * 0.44)
        .fill({ color: lighten(s.color, 0.16) })
        .stroke({ width: lw * 0.65, color: inkC })
    }
  }

  // Cresta longitudinal: una sola forma, no rayas de melón.
  if (s.ridge > 0) {
    g.ellipse(-rx * 0.15, bob, rx * 0.5, ry * s.ridge * 0.34)
      .fill({ color: lighten(s.color, 0.14), alpha: 0.85 })
      .stroke({ width: lw * 0.4, color: inkC, alpha: 0.5 })
  }

  // Realce del morro: da volumen y refuerza hacia dónde mira.
  g.ellipse(rx * 0.5, bob - ry * 0.22, rx * 0.22, ry * 0.18)
    .fill({ color: lighten(s.color, 0.36), alpha: 0.5 })

  // El ojo es lo último y lo único brillante.
  g.circle(nose - rx * 0.28, bob, Math.max(0.9, r * s.eye)).fill({ color: SEMANTIC.crit, alpha: 0.95 })
}

// ----------------------------------------------------------------- torres

function drawTowerBase(g: Graphics, r: number, color: number): void {
  const inkC = ink(color, 0.72)
  const lw = Math.max(1.3, r * 0.14)

  // Plataforma octogonal: angular y simetrica. Construido por humanos.
  const pts: number[] = []
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8
    pts.push(Math.cos(a) * r, Math.sin(a) * r)
  }
  g.poly(pts).fill({ color: darken(color, 0.55) }).stroke({ width: lw, color: inkC })

  const inner: number[] = []
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8
    inner.push(Math.cos(a) * r * 0.74, Math.sin(a) * r * 0.74)
  }
  g.poly(inner).fill({ color: darken(color, 0.28) }).stroke({ width: lw * 0.6, color: inkC, alpha: 0.7 })

  // Remaches: dan escala y peso.
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4
    g.circle(Math.cos(a) * r * 0.86, Math.sin(a) * r * 0.86, r * 0.09).fill({ color: inkC, alpha: 0.85 })
  }
  g.circle(0, 0, r * 0.42).fill({ color: darken(color, 0.12) }).stroke({ width: lw * 0.7, color: inkC })
}

function drawTurret(g: Graphics, r: number, color: number, kind: string): void {
  const inkC = ink(color, 0.72)
  const lw = Math.max(1.2, r * 0.13)
  const lit = lighten(color, 0.18)

  if (kind === 'arrow') {
    // Ballesta: dos brazos y un virote cargado.
    g.ellipse(0, 0, r * 0.42, r * 0.38).fill({ color: lit }).stroke({ width: lw, color: inkC })
    for (const side of [-1, 1]) {
      g.poly([r * 0.1, side * r * 0.14, r * 1.05, side * r * 0.5, r * 1.12, side * r * 0.34, r * 0.2, side * r * 0.02])
        .fill({ color })
        .stroke({ width: lw * 0.7, color: inkC })
    }
    g.roundRect(r * 0.2, -r * 0.09, r * 1.05, r * 0.18, r * 0.08)
      .fill({ color: darken(color, 0.2) })
      .stroke({ width: lw * 0.7, color: inkC })
    g.poly([r * 1.25, 0, r * 1.05, -r * 0.16, r * 1.05, r * 0.16]).fill({ color: SEMANTIC.crit })
  } else if (kind === 'shell') {
    // Mortero: caño grueso con anillos.
    g.roundRect(-r * 0.2, -r * 0.3, r * 1.3, r * 0.6, r * 0.16)
      .fill({ color })
      .stroke({ width: lw, color: inkC })
    for (let i = 0; i < 3; i++) {
      const x = r * (0.12 + i * 0.32)
      g.roundRect(x, -r * 0.36, r * 0.1, r * 0.72, r * 0.05)
        .fill({ color: darken(color, 0.3) })
        .stroke({ width: lw * 0.5, color: inkC, alpha: 0.8 })
    }
    g.ellipse(r * 1.08, 0, r * 0.12, r * 0.32).fill({ color: darken(color, 0.62) }).stroke({ width: lw * 0.6, color: inkC })
    g.circle(-r * 0.1, 0, r * 0.34).fill({ color: lit }).stroke({ width: lw, color: inkC })
  } else {
    // Prisma: cristales, sin caño. Comunica "esto no dispara balas".
    g.circle(0, 0, r * 0.4).fill({ color: darken(color, 0.3) }).stroke({ width: lw, color: inkC })
    const shards: [number, number, number][] = [
      [0.95, 0, 0.42],
      [0.5, -0.5, 0.3],
      [0.5, 0.5, 0.3],
    ]
    for (const [cx, cy, sz] of shards) {
      g.poly([
        r * (cx + sz), r * cy,
        r * cx, r * (cy - sz),
        r * (cx - sz), r * cy,
        r * cx, r * (cy + sz),
      ])
        .fill({ color: lit, alpha: 0.95 })
        .stroke({ width: lw * 0.7, color: inkC })
    }
    g.circle(r * 0.95, 0, r * 0.13).fill({ color: SEMANTIC.crit, alpha: 0.9 })
  }
}

// ----------------------------------------------------------------- varios

function drawProjectile(g: Graphics, kind: number): void {
  const c = 0xffffff
  if (kind === 1) {
    // Obús: cuerpo redondo con aletas.
    g.circle(0, 0, 5).fill({ color: c })
    g.poly([-5, -4.5, -9, 0, -5, 4.5]).fill({ color: c, alpha: 0.75 })
  } else if (kind === 2) {
    // Esquirla: cristal alargado.
    g.poly([7, 0, 0, -3.4, -7, 0, 0, 3.4]).fill({ color: c })
  } else {
    // Virote: punta en flecha, astil fino y plumas atrás.
    g.poly([9, 0, 1, -3, -3, -1.6, -3, 1.6, 1, 3]).fill({ color: c })
    g.rect(-7.5, -0.8, 5, 1.6).fill({ color: c, alpha: 0.75 })
  }
}

/** Punto suave para partículas: un disco con caída de alfa hacia el borde. */
function drawSoft(g: Graphics): void {
  for (let i = 10; i >= 1; i--) {
    g.circle(0, 0, (i / 10) * 16).fill({ color: 0xffffff, alpha: 0.05 })
  }
  g.circle(0, 0, 5).fill({ color: 0xffffff, alpha: 0.6 })
}

// ------------------------------------------------------------------ atlas

export interface Atlas {
  /** [defIdx][frame] del ciclo de caminata. */
  enemy: Texture[][]
  towerBase: Map<string, Texture>
  towerTurret: Map<string, Texture>
  projectile: Texture[]
  shadow: Texture
  dot: Texture
  soft: Texture
  ring: Texture
  bar: Texture
  portal: Texture
  core: Texture
  aura: Texture
}

export function buildAtlas(renderer: PixiRenderer): Atlas {
  const enemy: Texture[][] = ENEMIES.map((def) => {
    const spec = specFor(def.id, def.color)
    const half = def.radius * 2.8
    const frames: Texture[] = []
    for (let f = 0; f < WALK_FRAMES; f++) {
      const g = new Graphics()
      drawCreature(g, def.radius, spec, (f / WALK_FRAMES) * Math.PI * 2)
      frames.push(bake(renderer, g, half))
    }
    return frames
  })

  const towerBase = new Map<string, Texture>()
  const towerTurret = new Map<string, Texture>()
  const TOWER_R = 15
  for (const def of TOWERS) {
    const gb = new Graphics()
    drawTowerBase(gb, TOWER_R, def.color)
    towerBase.set(def.id, bake(renderer, gb, TOWER_R * 1.3, 3))

    const gt = new Graphics()
    drawTurret(gt, TOWER_R, def.color, def.shot === 'bolt' ? 'arrow' : def.shot)
    towerTurret.set(def.id, bake(renderer, gt, TOWER_R * 1.6, 3))
  }

  const projectile: Texture[] = [0, 1, 2].map((kind) => {
    const g = new Graphics()
    drawProjectile(g, kind)
    return bake(renderer, g, 10, 4)
  })

  const shadowG = new Graphics()
  for (let i = 8; i >= 1; i--) {
    shadowG.ellipse(0, 0, (i / 8) * 16, (i / 8) * 9).fill({ color: 0x000000, alpha: 0.06 })
  }

  const dotG = new Graphics().circle(0, 0, 16).fill(0xffffff)
  const softG = new Graphics()
  drawSoft(softG)
  const ringG = new Graphics().circle(0, 0, 64).stroke({ width: 6, color: 0xffffff, alignment: 0.5 })
  const barG = new Graphics().rect(0, 0, 16, 4).fill(0xffffff)

  // Portal de entrada: anillo roto, girado por el render.
  const portalG = new Graphics()
  portalG.circle(0, 0, 26).fill({ color: GROUND.deep, alpha: 0.9 }).stroke({ width: 3, color: SEMANTIC.leak, alpha: 0.5 })
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    portalG
      .poly([
        Math.cos(a) * 20, Math.sin(a) * 20,
        Math.cos(a + 0.22) * 31, Math.sin(a + 0.22) * 31,
        Math.cos(a + 0.44) * 20, Math.sin(a + 0.44) * 20,
      ])
      .fill({ color: 0xc8442f, alpha: 0.55 })
  }
  portalG.circle(0, 0, 13).fill({ color: 0x000000, alpha: 0.85 })

  // El núcleo que defendés: sin esto los enemigos desaparecen en la nada.
  const coreG = new Graphics()
  coreG.circle(0, 0, 30).fill({ color: GROUND.lit }).stroke({ width: 3, color: ink(GROUND.pathEdge, 0.4) })
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2
    coreG.circle(Math.cos(a) * 22, Math.sin(a) * 22, 5).fill({ color: GROUND.pathEdge })
  }
  coreG
    .poly([0, -19, 16, 0, 0, 19, -16, 0])
    .fill({ color: SEMANTIC.hpFull })
    .stroke({ width: 2.5, color: ink(SEMANTIC.hpFull, 0.5) })
  coreG.poly([0, -11, 8, 0, 0, 11, -8, 0]).fill({ color: SEMANTIC.crit, alpha: 0.9 })

  const auraG = new Graphics()
  for (let i = 6; i >= 1; i--) {
    auraG.circle(0, 0, (i / 6) * 30).fill({ color: 0xffffff, alpha: 0.07 })
  }

  return {
    enemy,
    towerBase,
    towerTurret,
    projectile,
    shadow: bake(renderer, shadowG, 18, 2),
    dot: bake(renderer, dotG, 17, 2),
    soft: bake(renderer, softG, 17, 2),
    ring: bake(renderer, ringG, 68, 2),
    bar: renderer.generateTexture({ target: barG, resolution: 2 }),
    portal: bake(renderer, portalG, 34, 2),
    core: bake(renderer, coreG, 34, 2),
    aura: bake(renderer, auraG, 32, 2),
  }
}
