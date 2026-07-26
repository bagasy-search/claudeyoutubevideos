import { Graphics, Rectangle, Sprite, Texture, type Renderer as PixiRenderer } from 'pixi.js'
import { ENEMIES } from '../sim/balance/enemies'
import { TOWERS } from '../sim/balance/towers'
import { makeGrainFilter } from './grain'
import { GROUND, SEMANTIC, darken, ink, inkLit, lighten, shade, tint } from './palette'

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
 * Las criaturas se dibujan de FRENTE a camara y simetricas. El sprite no rota
 * con el camino: solo se inclina un poco hacia donde va. Por eso alcanza con
 * hornear un unico ciclo por criatura.
 */

export const WALK_FRAMES = 12

/** Radio de dibujo de las torres. Lo usa el render para colocar el cañón. */
export const TOWER_R = 24

/** Radio de la plataforma de construccion vacia. */
export const SLOT_ART_R = 30

/**
 * El grano se instancia una vez y se comparte: crear un filtro por sprite seria
 * absurdo, y ademas el horneado es secuencial.
 */
const grain = makeGrainFilter()

/**
 * Bounding box fijo por frame: sin esto el recorte varia y el sprite tiembla.
 *
 * @param textured aplica el ruido de superficie. Se apaga para las utilidades
 * (barra de vida, punto suave, sombra), donde el grano solo ensuciaria.
 */
function bake(renderer: PixiRenderer, g: Graphics, half: number, resolution = 3, textured = true): Texture {
  const frame = new Rectangle(-half, -half, half * 2, half * 2)
  const base = renderer.generateTexture({ target: g, resolution, frame })
  g.destroy()
  if (!textured) return base

  /*
   * El grano va en una SEGUNDA pasada, sobre la textura ya recortada.
   *
   * Aplicar el filtro directamente en el generateTexture con `frame` devuelve
   * texturas vacias: el recorte explicito y el area del filtro no se llevan
   * bien. Horneando primero la forma y filtrando ese resultado, el segundo
   * pase no necesita recorte — los limites del sprite ya son los correctos.
   */
  const sprite = new Sprite(base)
  sprite.filters = [grain]
  const out = renderer.generateTexture({ target: sprite, resolution })
  sprite.destroy()
  base.destroy(true)
  return out
}

// --------------------------------------------------------------- criaturas

interface CreatureSpec {
  color: number
  /** Todo se expresa en múltiplos del radio de colisión. */
  headR: number
  bodyW: number
  bodyH: number
  legW: number
  legH: number
  armW: number
  arms: boolean
  /** Orejas barridas hacia atrás. */
  ears: number
  /** Hombreras. */
  shoulders: number
  /** Corona de cuernos: el rasgo del boss. */
  crown: number
  eyeR: number
  /** Inclinación de la ceja. 0 = neutro, 1 = furioso. */
  brow: number
}

/**
 * Proporción chibi: la cabeza ocupa ~45% de la altura y la cara es el 60% de la
 * lectura del personaje. Es lo contrario de la versión cenital anterior — acá
 * las criaturas miran a la cámara y no rotan, solo se inclinan hacia donde van.
 */
const CREATURES: Record<string, Partial<CreatureSpec>> = {
  grunt: { headR: 0.72, bodyW: 0.9, bodyH: 0.7, eyeR: 0.24, brow: 0.3 },
  runner: { headR: 0.62, bodyW: 0.7, bodyH: 0.6, legW: 0.2, legH: 0.62, ears: 0.9, eyeR: 0.2, brow: 0.6 },
  swarm: { headR: 0.82, bodyW: 0.6, bodyH: 0.42, legW: 0.2, legH: 0.34, arms: false, eyeR: 0.3, brow: 0 },
  brute: { headR: 0.66, bodyW: 1.12, bodyH: 0.82, legW: 0.34, armW: 0.3, shoulders: 0.5, eyeR: 0.19, brow: 0.8 },
  juggernaut: { headR: 0.6, bodyW: 1.2, bodyH: 0.9, legW: 0.36, armW: 0.32, shoulders: 0.58, crown: 0.3, eyeR: 0.16, brow: 1 },
}

function specFor(id: string, color: number): CreatureSpec {
  return {
    color,
    headR: 0.7,
    bodyW: 0.9,
    bodyH: 0.7,
    legW: 0.26,
    legH: 0.5,
    armW: 0.24,
    arms: true,
    ears: 0,
    shoulders: 0,
    crown: 0,
    eyeR: 0.22,
    brow: 0.4,
    ...CREATURES[id],
  }
}

/** Contorno base: el lado que se aleja de la luz. */
const INK = 0x2b1a12
const SCLERA = 0xfff6e6

// -------------------------------------------------- luz, contorno y oclusion

/**
 * Direccion de la luz, en radianes de pantalla (la Y crece hacia abajo).
 * -135° = arriba a la izquierda. Es la misma direccion que asumen `shade()` y
 * `tint()` en la paleta, y la misma que usa la sombra de contacto. Que las tres
 * coincidan es lo que hace que el conjunto se lea como una escena y no como un
 * monton de sprites con efectos.
 */
const LIGHT = -Math.PI * 0.75
/** Semiapertura del tramo de contorno iluminado, en radianes. */
const RIM_SPAN = 1.2

/**
 * Tramo iluminado del contorno de un circulo.
 *
 * Va POR DENTRO del trazo de tinta (de ahi el `- lw * 0.3`): sobrescribe la
 * mitad interior de la linea oscura y deja la mitad exterior intacta. Asi la
 * silueta contra el fondo sigue siendo negra — que es lo que sostiene la
 * legibilidad a 30 px — y lo que cambia es la lectura de volumen.
 */
function rimArc(g: Graphics, cx: number, cy: number, r: number, lw: number, color: number): void {
  const a0 = LIGHT - RIM_SPAN
  const rr = r - lw * 0.3
  g.moveTo(cx + Math.cos(a0) * rr, cy + Math.sin(a0) * rr)
    .arc(cx, cy, rr, a0, LIGHT + RIM_SPAN)
    .stroke({ width: lw * 0.75, color, cap: 'round' })
}

/** Lo mismo para un borde recto: el canto superior de una forma con esquinas. */
function rimEdge(g: Graphics, x0: number, x1: number, y: number, lw: number, color: number): void {
  g.moveTo(x0, y).lineTo(x1, y).stroke({ width: lw * 0.7, color, cap: 'round' })
}

/**
 * Oclusion ambiental: la banda oscura que aparece donde dos formas se juntan.
 *
 * Sin esto las partes se leen apiladas — un muñeco de recortes — porque nada
 * indica que una este metida dentro de la otra. Es probablemente el detalle mas
 * barato de todos los que separan "formas juntas" de "un cuerpo".
 *
 * Graphics no tiene degradados, asi que la caida se aproxima con elipses
 * concentricas de alfa baja: se acumulan hacia el centro, que es exactamente el
 * perfil que se busca (mas oscuro en el contacto). El coste es de horneado, no
 * de ejecucion.
 */
function ao(g: Graphics, x: number, y: number, rx: number, ry: number, color: number, alpha = 0.5): void {
  const steps = 3
  for (let i = steps; i >= 1; i--) {
    const k = i / steps
    g.ellipse(x, y, rx * k, ry * k).fill({ color, alpha: alpha / steps })
  }
}

/**
 * Un paso de verdad, no un pataleo.
 *
 * Devuelve el desplazamiento horizontal y la altura del pie para una fase.
 * Durante el APOYO el pie retrocede pegado al suelo mientras el cuerpo avanza;
 * durante el VUELO despega y va hacia adelante. Sin la componente horizontal
 * las piernas suben y bajan en el lugar y el personaje hace moonwalk — que es
 * exactamente como se veia antes.
 *
 * El apoyo ocupa mas del ciclo que el vuelo (60/40), como en una caminata real.
 */
const STANCE = 0.6

function footCycle(phase: number, reach: number, lift: number): { x: number; y: number } {
  const t = (((phase / (Math.PI * 2)) % 1) + 1) % 1
  if (t < STANCE) {
    // Apoyo: de adelante hacia atras, a ras del suelo.
    const u = t / STANCE
    return { x: reach * (1 - 2 * u), y: 0 }
  }
  // Vuelo: vuelve adelante describiendo un arco.
  const u = (t - STANCE) / (1 - STANCE)
  const eased = u * u * (3 - 2 * u)
  return { x: reach * (-1 + 2 * eased), y: -Math.sin(Math.PI * u) * lift }
}

/**
 * Reglas del registro chibi:
 *  - Contorno uniforme y grueso en TODO. Es lo que sostiene la lectura.
 *  - La cara es el rasgo principal: ojos grandes, ceja que da caracter.
 *  - Un accesorio de silueta por criatura (orejas, hombreras, corona).
 *  - Vista frontal: el sprite no rota con el camino, solo se inclina.
 *  - Volumen constante: lo que se aplasta a lo alto se ensancha a lo ancho.
 */
function drawCreature(g: Graphics, r: number, s: CreatureSpec, phase: number): void {
  const lw = Math.max(1.6, r * 0.13)
  const outline = { width: lw, color: INK } as const
  const body = s.color
  const leg = shade(s.color, 0.34)
  // Los brazos NO pueden ser del mismo valor que las piernas: si lo son, los
  // cuatro miembros se funden en un solo bloque en la silueta.
  const arm = shade(s.color, 0.16)
  const face = tint(s.color, 0.2)
  // Contorno del lado iluminado, uno por material: el contorno de una pierna en
  // sombra no puede aclararse tanto como el de la cara.
  const rimBody = inkLit(body)
  const rimLeg = inkLit(leg, 0.62)
  const rimArm = inkLit(arm, 0.58)
  const rimFace = inkLit(face, 0.44)
  // La oclusion se tiñe con el color del objeto, no con negro: el negro plano
  // en las juntas se lee como suciedad.
  const occ = shade(s.color, 0.62)

  const swing = Math.sin(phase)
  // El cuerpo baja en cada pisada: dos veces por ciclo.
  const bobNorm = -Math.abs(Math.cos(phase))
  const bob = bobNorm * r * 0.09
  const sway = swing * r * 0.045

  // Squash y stretch a volumen constante: al caer se achata y se ensancha.
  const squash = 1 + bobNorm * 0.07
  const stretch = 1 / squash

  const feetY = r * 1.02
  const bodyY = r * 0.3 + bob
  // La cabeza arrastra: llega un poco despues que el cuerpo. Es la diferencia
  // entre un muñeco rigido y algo con peso.
  const headBob = -Math.abs(Math.cos(phase - 0.55)) * r * 0.11
  const headY = -r * 0.52 + headBob

  const reach = r * 0.2
  const lift = r * 0.19

  // Piernas.
  const legX: number[] = []
  for (const side of [-1, 1]) {
    const ph = side > 0 ? phase : phase + Math.PI
    const step = footCycle(ph, reach, lift)
    const lx = side * r * s.bodyW * 0.34 + step.x + sway
    const ly = feetY - r * s.legH + step.y
    legX.push(lx)
    g.roundRect(lx - (r * s.legW) / 2, ly, r * s.legW, r * s.legH, r * s.legW * 0.45)
      .fill({ color: leg })
      .stroke(outline)
    rimEdge(g, lx - r * s.legW * 0.3, lx + r * s.legW * 0.2, ly + lw * 0.35, lw, rimLeg)
  }

  // Brazos, en contrafase con las piernas.
  const armAnchor: { x: number; y: number }[] = []
  if (s.arms) {
    for (const side of [-1, 1]) {
      const sw = -swing * side * r * 0.16
      const ax = side * (r * s.bodyW * 0.5) + sway
      const ay = bodyY - r * 0.16 + sw
      armAnchor.push({ x: ax, y: ay })
      g.roundRect(ax - (r * s.armW) / 2, ay, r * s.armW, r * 0.5, r * s.armW * 0.5)
        .fill({ color: arm })
        .stroke(outline)
      rimEdge(g, ax - r * s.armW * 0.28, ax + r * s.armW * 0.2, ay + lw * 0.35, lw, rimArm)
    }
  }

  // Cuerpo, con el squash aplicado.
  const bw = r * s.bodyW * stretch
  const bh = r * s.bodyH * squash
  g.roundRect(-bw * 0.5 + sway, bodyY - bh * 0.5, bw, bh, r * 0.3)
    .fill({ color: body })
    .stroke(outline)
  rimEdge(g, sway - bw * 0.28, sway + bw * 0.3, bodyY - bh * 0.5 + lw * 0.4, lw, rimBody)

  /*
   * Oclusion en cada junta. El cuerpo se dibuja DESPUES de los miembros, asi
   * que la sombra que los miembros proyectan sobre el torso hay que ponerla
   * aca: si se pusiera antes, el relleno del cuerpo la taparia.
   */
  // Cuello.
  ao(g, sway, bodyY - bh * 0.42, bw * 0.34, bh * 0.2, occ, 0.6)
  // Donde salen los brazos.
  for (const a of armAnchor) {
    ao(g, a.x - Math.sign(a.x - sway || 1) * bw * 0.06, a.y + r * 0.06, r * s.armW * 0.6, r * 0.2, occ, 0.5)
  }
  // Donde salen las piernas: banda a lo ancho de la base del torso.
  for (const lx of legX) {
    ao(g, lx * 0.72 + sway * 0.28, bodyY + bh * 0.44, r * s.legW * 0.85, bh * 0.16, occ, 0.45)
  }

  // Hombreras: como se lee "blindado" de un vistazo.
  if (s.shoulders > 0) {
    for (const side of [-1, 1]) {
      const sx = side * bw * 0.46 + sway
      const sy = bodyY - bh * 0.26
      const srx = r * s.shoulders * 0.42
      const sry = r * s.shoulders * 0.34
      // La sombra que la hombrera tira sobre el torso, antes de dibujarla.
      ao(g, sx - side * srx * 0.25, sy + sry * 0.7, srx * 0.9, sry * 0.55, occ, 0.55)
      const plate = tint(s.color, 0.34)
      g.ellipse(sx, sy, srx, sry).fill({ color: plate }).stroke(outline)
      rimArc(g, sx, sy, Math.min(srx, sry), lw, inkLit(plate, 0.42))
    }
  }

  // Orejas barridas: el rasgo de velocidad. Van detras de la cabeza y arrastran.
  if (s.ears > 0) {
    const lag = Math.sin(phase - 1.1) * r * 0.1
    for (const side of [-1, 1]) {
      g.poly([
        sway, headY,
        sway - side * r * s.ears * 1.05 + lag, headY - r * s.ears * 0.62,
        sway - side * r * s.ears * 0.34, headY + r * 0.28,
      ])
        .fill({ color: leg })
        .stroke(outline)
    }
  }

  // Corona de cuernos: el rasgo del boss. Las puntas se aclaran.
  if (s.crown > 0) {
    for (const t of [-1, 0, 1]) {
      const cx = sway + t * r * s.headR * 0.62
      const h = r * s.crown * (t === 0 ? 1 : 0.66)
      g.poly([cx - r * 0.15, headY - r * s.headR * 0.75, cx, headY - r * s.headR * 0.75 - h, cx + r * 0.15, headY - r * s.headR * 0.75])
        .fill({ color: 0xf0e2c0 })
        .stroke(outline)
      g.poly([cx - r * 0.05, headY - r * s.headR * 0.75 - h * 0.55, cx, headY - r * s.headR * 0.75 - h, cx + r * 0.05, headY - r * s.headR * 0.75 - h * 0.55])
        .fill({ color: 0xfff8e0, alpha: 0.55 })
    }
  }

  // Cabeza: lo mas grande del personaje.
  const hr = r * s.headR
  g.circle(sway, headY, hr).fill({ color: face }).stroke(outline)
  // Sombra de la mitad inferior: da volumen sin degradado.
  g.ellipse(sway, headY + hr * 0.42, hr * 0.82, hr * 0.42)
    .fill({ color: shade(s.color, 0.22), alpha: 0.35 })
  // Luz de borde arriba: separa la cabeza del fondo.
  g.ellipse(sway - hr * 0.26, headY - hr * 0.5, hr * 0.38, hr * 0.14)
    .fill({ color: tint(s.color, 0.5), alpha: 0.38 })
  // Contorno iluminado: el tramo de arriba a la izquierda deja de ser tinta.
  rimArc(g, sway, headY, hr, lw, rimFace)
  // Y la oclusion de lo que se apoya sobre la cabeza, que se dibujo antes que
  // ella y por lo tanto quedo tapado.
  if (s.crown > 0) {
    for (const t of [-1, 0, 1]) {
      ao(g, sway + t * r * s.headR * 0.62, headY - hr * 0.7, r * 0.2, r * 0.12, occ, 0.5)
    }
  }
  if (s.ears > 0) {
    for (const side of [-1, 1]) {
      ao(g, sway - side * hr * 0.82, headY - hr * 0.1, hr * 0.3, hr * 0.4, occ, 0.45)
    }
  }

  // Cara. Los ojos son el 60% de la lectura del personaje.
  const eyeX = hr * 0.42
  const eyeY = headY + hr * 0.12
  const eyeR = r * s.eyeR
  for (const side of [-1, 1]) {
    /*
     * La cuenca: los ojos estan HUNDIDOS en el craneo, no pegados encima.
     *
     * Tiene que quedar mas chica que la separacion entre los ojos. Con el radio
     * generoso que probe primero las dos cuencas se tocaban en el puente de la
     * nariz y el conjunto se leia como un antifaz, no como dos hoyos.
     */
    ao(g, sway + side * eyeX, eyeY - eyeR * 0.3, eyeR * 0.95, eyeR * 1.15, occ, 0.22)
    g.ellipse(sway + side * eyeX, eyeY, eyeR * 0.78, eyeR)
      .fill({ color: SCLERA })
      .stroke({ width: lw * 0.7, color: INK })
    g.circle(sway + side * eyeX + side * eyeR * 0.16, eyeY + eyeR * 0.16, eyeR * 0.46).fill({ color: INK })
    g.circle(sway + side * eyeX - side * eyeR * 0.24, eyeY - eyeR * 0.34, eyeR * 0.26).fill({ color: 0xffffff, alpha: 0.95 })
  }

  /*
   * Cejas. Antes eran dos trazos con un desnivel de ~2px sobre una linea de
   * 2.5px de grosor: el rango entero de neutro a furioso no llegaba a
   * distinguirse. Ahora son poligonos solidos, mas largos y con mas caida, que
   * es lo unico que sobrevive a 20 px de alto.
   */
  if (s.brow > 0) {
    const bl = eyeR * 1.25
    const bt = Math.max(1.6, eyeR * 0.5)
    const drop = eyeR * s.brow * 1.15
    for (const side of [-1, 1]) {
      const bx = sway + side * eyeX
      const by = eyeY - eyeR * 1.15
      g.poly([
        bx - side * bl, by + drop,
        bx + side * bl, by - drop * 0.5,
        bx + side * bl, by - drop * 0.5 + bt,
        bx - side * bl, by + drop + bt,
      ]).fill({ color: INK })
    }
  }
}

// ----------------------------------------------------------------- torres

/**
 * Torres en vista frontal, igual que las criaturas: pedestal, cuerpo y almenas.
 * La camara tiene que ser una sola — mezclar cenital con frontal es lo que hace
 * que un juego parezca armado con piezas de dos juegos distintos.
 */
function drawTowerBase(g: Graphics, r: number, color: number): void {
  const lw = Math.max(1.8, r * 0.13)
  const outline = { width: lw, color: INK } as const
  const stone = 0x8a7a5e

  // Sombra de contacto: pega la torre al suelo.
  g.ellipse(0, r * 0.98, r * 0.92, r * 0.3).fill({ color: INK, alpha: 0.22 })

  // Pedestal de piedra, mas ancho abajo.
  g.poly([-r * 0.86, r * 1.02, -r * 0.62, r * 0.42, r * 0.62, r * 0.42, r * 0.86, r * 1.02])
    .fill({ color: stone })
    .stroke(outline)
  rimEdge(g, -r * 0.7, -r * 0.2, r * 0.46, lw, inkLit(stone, 0.5))
  g.ellipse(0, r * 0.42, r * 0.62, r * 0.2).fill({ color: lighten(stone, 0.2) }).stroke(outline)

  const occ = shade(color, 0.6)

  // Cuerpo de la torre.
  g.roundRect(-r * 0.5, -r * 0.55, r, r * 1.02, r * 0.22)
    .fill({ color })
    .stroke(outline)
  // Donde el cuerpo se mete en el pedestal.
  ao(g, 0, r * 0.44, r * 0.5, r * 0.13, occ, 0.55)
  rimEdge(g, -r * 0.32, r * 0.06, -r * 0.52, lw, inkLit(color, 0.46))
  // Tronera: hundida, con su propia oclusion arriba.
  g.roundRect(-r * 0.32, -r * 0.34, r * 0.64, r * 0.42, r * 0.16)
    .fill({ color: darken(color, 0.28) })
    .stroke({ width: lw * 0.7, color: INK })
  ao(g, 0, -r * 0.3, r * 0.3, r * 0.12, occ, 0.5)

  // Almenas.
  for (const t of [-1, 0, 1]) {
    // La sombra que cada almena tira sobre la coronacion del cuerpo.
    ao(g, t * r * 0.34 + r * 0.06, -r * 0.46, r * 0.16, r * 0.07, occ, 0.5)
    const cap = lighten(color, 0.18)
    g.roundRect(t * r * 0.34 - r * 0.14, -r * 0.8, r * 0.28, r * 0.32, r * 0.07)
      .fill({ color: cap })
      .stroke(outline)
    rimEdge(g, t * r * 0.34 - r * 0.1, t * r * 0.34 + r * 0.04, -r * 0.77, lw, inkLit(cap, 0.42))
  }
}

export const IDLE_FRAMES = 8

/**
 * Torre-personaje: una criatura de pie con un arma, en el mismo registro chibi
 * que los enemigos. Respira en reposo en vez de rotar.
 *
 * Es el reemplazo procedural para una torre que se va a cubrir con arte real:
 * asi el tipo de torre existe y se puede jugar antes de que el arte llegue.
 */
function drawCharacterTower(g: Graphics, r: number, color: number, phase: number): void {
  const lw = Math.max(1.6, r * 0.11)
  const outline = { width: lw, color: INK } as const
  const breathe = Math.sin(phase) * r * 0.05
  const face = lighten(color, 0.16)
  const limb = darken(color, 0.2)
  const metal = 0x8a7a5e

  const occ = shade(color, 0.6)

  g.ellipse(0, r * 0.95, r * 0.7, r * 0.2).fill({ color: INK, alpha: 0.22 })

  for (const side of [-1, 1]) {
    g.roundRect(side * r * 0.26 - r * 0.13, r * 0.5, r * 0.26, r * 0.42, r * 0.12)
      .fill({ color: limb })
      .stroke(outline)
    rimEdge(g, side * r * 0.26 - r * 0.1, side * r * 0.26 + r * 0.02, r * 0.53, lw, inkLit(limb, 0.6))
  }

  // Cuerpo.
  g.roundRect(-r * 0.42, r * 0.02 + breathe, r * 0.84, r * 0.6, r * 0.22)
    .fill({ color })
    .stroke(outline)
  rimEdge(g, -r * 0.26, r * 0.06, r * 0.05 + breathe, lw, inkLit(color, 0.46))
  // Donde salen las piernas.
  for (const side of [-1, 1]) {
    ao(g, side * r * 0.26, r * 0.55 + breathe, r * 0.15, r * 0.1, occ, 0.5)
  }

  // Arma cruzada al frente: es lo que dice "esto dispara".
  // Primero la sombra que tira sobre el pecho, despues el arma.
  ao(g, r * 0.1, r * 0.26 + breathe, r * 0.32, r * 0.09, occ, 0.5)
  g.roundRect(-r * 0.1, r * 0.28 + breathe, r * 1.05, r * 0.24, r * 0.1)
    .fill({ color: metal })
    .stroke(outline)
  rimEdge(g, r * 0.0, r * 0.72, r * 0.31 + breathe, lw, inkLit(metal, 0.5))
  g.ellipse(r * 0.95, r * 0.4 + breathe, r * 0.1, r * 0.16)
    .fill({ color: darken(metal, 0.5) })
    .stroke(outline)

  // Cabeza y cara.
  const hy = -r * 0.42 + breathe
  g.circle(0, hy, r * 0.46).fill({ color: face }).stroke(outline)
  rimArc(g, 0, hy, r * 0.46, lw, inkLit(face, 0.44))
  // Sombra de la cresta sobre el craneo, que se dibuja despues.
  for (const t of [-1, 0, 1]) {
    ao(g, t * r * 0.2 + r * 0.03, hy - r * 0.33, r * 0.1, r * 0.06, occ, 0.45)
  }
  for (const side of [-1, 1]) {
    ao(g, side * r * 0.18, hy + r * 0.02, r * 0.16, r * 0.19, occ, 0.4)
    g.ellipse(side * r * 0.18, hy + r * 0.04, r * 0.11, r * 0.14)
      .fill({ color: SCLERA })
      .stroke({ width: lw * 0.7, color: INK })
    g.circle(side * r * 0.2, hy + r * 0.07, r * 0.06).fill({ color: INK })
  }
  // Cresta.
  for (const t of [-1, 0, 1]) {
    g.poly([t * r * 0.2 - r * 0.09, hy - r * 0.36, t * r * 0.2, hy - r * 0.66, t * r * 0.2 + r * 0.09, hy - r * 0.36])
      .fill({ color: darken(color, 0.25) })
      .stroke(outline)
  }
}

/**
 * Pieza superior que si rota hacia el objetivo. Es chica a proposito: con la
 * torre en vista frontal, rotar el cuerpo entero romperia la camara, pero sin
 * nada que apunte no se entiende a quien le esta pegando.
 */
function drawTurret(g: Graphics, r: number, color: number, kind: string): void {
  const lw = Math.max(1.6, r * 0.12)
  const outline = { width: lw, color: INK } as const
  const lit = lighten(color, 0.3)

  if (kind === 'arrow') {
    for (const side of [-1, 1]) {
      g.poly([r * 0.05, side * r * 0.1, r * 0.72, side * r * 0.44, r * 0.8, side * r * 0.26, r * 0.15, 0])
        .fill({ color: lit })
        .stroke(outline)
    }
    g.roundRect(0, -r * 0.09, r * 0.82, r * 0.18, r * 0.09).fill({ color: darken(color, 0.2) }).stroke(outline)
  } else if (kind === 'shell') {
    g.roundRect(-r * 0.1, -r * 0.22, r * 0.92, r * 0.44, r * 0.2).fill({ color: lit }).stroke(outline)
    g.ellipse(r * 0.78, 0, r * 0.11, r * 0.24).fill({ color: darken(color, 0.55) }).stroke(outline)
  } else {
    g.poly([r * 0.85, 0, r * 0.4, -r * 0.36, r * 0.02, 0, r * 0.4, r * 0.36])
      .fill({ color: lit })
      .stroke(outline)
    g.circle(r * 0.5, 0, r * 0.12).fill({ color: SEMANTIC.crit })
  }
  g.circle(0, 0, r * 0.2).fill({ color: darken(color, 0.35) }).stroke(outline)
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

/**
 * Plataforma de construccion vacia.
 *
 * Tiene que gritar "acá va algo" sin competir con nada. La forma es un octogono
 * de piedra hundido en el suelo: hundido y no apoyado, porque una plataforma que
 * sobresale se lee como un obstaculo y una hundida se lee como un hueco a
 * llenar. El aro punteado de adentro es la señal de "vacio" — cuando entra la
 * torre lo tapa entero y la lectura cambia sola.
 */
function drawSlot(g: Graphics, r: number): void {
  const stone = 0x6a5c48
  const lw = Math.max(1.6, r * 0.1)

  const oct = (rad: number, squash: number): number[] => {
    const p: number[] = []
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + Math.PI / 8
      p.push(Math.cos(a) * rad, Math.sin(a) * rad * squash)
    }
    return p
  }

  // Hueco: el borde exterior es mas oscuro que el suelo, el interior mas claro.
  // Ese orden — oscuro afuera, claro adentro — es lo que lee como hundido. Al
  // reves seria un pedestal.
  g.poly(oct(r, 0.62)).fill({ color: shade(stone, 0.55) })
  g.poly(oct(r * 0.9, 0.62)).fill({ color: stone }).stroke({ width: lw, color: ink(stone, 0.5) })
  g.poly(oct(r * 0.78, 0.62)).fill({ color: tint(stone, 0.16) })
  // Luz en el canto de arriba, del lado de la fuente.
  rimArc(g, 0, 0, r * 0.86, lw, inkLit(stone, 0.5))

  // Aro punteado: la señal de plataforma libre.
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2
    g.circle(Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5 * 0.62, lw * 0.75)
      .fill({ color: tint(stone, 0.55), alpha: 0.75 })
  }
}

/**
 * Viñeta: el pase de color global, hecho con una sola textura y sin shader.
 *
 * Se dibuja sobre todo el campo en modo `multiply`, asi que lo blanco no toca
 * nada y lo oscuro apaga. Dos razones para que sea una textura y no un filtro:
 * un filtro de pantalla completa obliga a un cambio de framebuffer por frame, y
 * esto se hornea una vez y despues es un sprite mas.
 *
 * El color de las esquinas no es gris: es un violeta frio. Apagar con gris
 * neutro solo baja el brillo; apagar con el tono de la sombra ambiente hace que
 * los bordes se lean como distancia y deja el centro del tablero — que es donde
 * pasa el juego — mas calido por contraste.
 */
const VIGNETTE_R = 160

function drawVignette(g: Graphics): void {
  const corner = 0x6d6478
  g.rect(-VIGNETTE_R, -VIGNETTE_R, VIGNETTE_R * 2, VIGNETTE_R * 2).fill({ color: corner })
  /*
   * Discos de blanco a alfa baja, de afuera hacia adentro. El alfa se acumula,
   * asi que la caida sale exponencial y suave.
   *
   * Muchos pasos con poco alfa, no pocos con mucho: con 30 discos al 11% cada
   * salto es visible y la viñeta se lee como una diana. El coste de subir a 64
   * es de horneado, o sea ninguno.
   */
  const steps = 64
  for (let i = 0; i < steps; i++) {
    const k = i / steps
    g.circle(0, 0, VIGNETTE_R * 1.34 * (1 - k * 0.72)).fill({ color: 0xffffff, alpha: 0.055 })
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
  /** Frames de la base. Las torres estaticas traen uno solo. */
  towerBase: Map<string, Texture[]>
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
  /** Pase de color global. Va en `multiply` sobre todo el campo. */
  vignette: Texture
  /** Plataforma de construccion vacia. */
  slot: Texture
}

export function buildAtlas(renderer: PixiRenderer): Atlas {
  const enemy: Texture[][] = ENEMIES.map((def) => {
    const spec = specFor(def.id, def.color)
    const half = def.radius * 2.3
    const frames: Texture[] = []
    for (let f = 0; f < WALK_FRAMES; f++) {
      const g = new Graphics()
      drawCreature(g, def.radius, spec, (f / WALK_FRAMES) * Math.PI * 2)
      frames.push(bake(renderer, g, half))
    }
    return frames
  })

  const towerBase = new Map<string, Texture[]>()
  const towerTurret = new Map<string, Texture>()
  for (const def of TOWERS) {
    if (def.turret === false) {
      // Torre-personaje: se hornea un ciclo de reposo procedural, que sirve de
      // reemplazo hasta que entre el arte real por el manifiesto.
      const frames: Texture[] = []
      for (let f = 0; f < IDLE_FRAMES; f++) {
        const g = new Graphics()
        drawCharacterTower(g, TOWER_R, def.color, (f / IDLE_FRAMES) * Math.PI * 2)
        frames.push(bake(renderer, g, TOWER_R * 1.5, 3))
      }
      towerBase.set(def.id, frames)
      continue
    }

    const gb = new Graphics()
    drawTowerBase(gb, TOWER_R, def.color)
    towerBase.set(def.id, [bake(renderer, gb, TOWER_R * 1.4, 3)])

    const gt = new Graphics()
    drawTurret(gt, TOWER_R, def.color, def.shot === 'bolt' ? 'arrow' : def.shot)
    towerTurret.set(def.id, bake(renderer, gt, TOWER_R * 1.6, 3))
  }

  const projectile: Texture[] = [0, 1, 2].map((kind) => {
    const g = new Graphics()
    drawProjectile(g, kind)
    return bake(renderer, g, 10, 4, false)
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

  const vignetteG = new Graphics()
  drawVignette(vignetteG)

  const slotG = new Graphics()
  drawSlot(slotG, SLOT_ART_R)

  const auraG = new Graphics()
  for (let i = 6; i >= 1; i--) {
    auraG.circle(0, 0, (i / 6) * 30).fill({ color: 0xffffff, alpha: 0.07 })
  }

  return {
    enemy,
    towerBase,
    towerTurret,
    projectile,
    shadow: bake(renderer, shadowG, 18, 2, false),
    dot: bake(renderer, dotG, 17, 2, false),
    soft: bake(renderer, softG, 17, 2, false),
    ring: bake(renderer, ringG, 68, 2, false),
    bar: renderer.generateTexture({ target: barG, resolution: 2 }),
    portal: bake(renderer, portalG, 34, 2),
    core: bake(renderer, coreG, 34, 2),
    aura: bake(renderer, auraG, 32, 2, false),
    vignette: bake(renderer, vignetteG, VIGNETTE_R, 1, false),
    slot: bake(renderer, slotG, SLOT_ART_R * 1.15, 3),
  }
}
