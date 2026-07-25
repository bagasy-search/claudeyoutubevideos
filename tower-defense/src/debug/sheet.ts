import 'pixi.js/browser'
import { Container, Sprite, Text, Ticker, WebGLRenderer } from 'pixi.js'
import { ENEMIES } from '../sim/balance/enemies'
import { TOWERS } from '../sim/balance/towers'
import { GROUND, SEMANTIC } from '../render/palette'
import { WALK_FRAMES, buildAtlas } from '../render/sprites'

/**
 * Hoja de turnaround para iterar el arte sin tener que jugar una oleada.
 *
 * Es la herramienta que pide docs/ART.md: sirve para correr el test de silueta
 * (fila 3) y para ver los ciclos de caminata a tamaño real y ampliados, que es
 * donde se detectan los problemas de legibilidad.
 */

const W = 1100
const H = 700

const renderer = new WebGLRenderer()
await renderer.init({
  width: W,
  height: H,
  background: GROUND.base,
  antialias: true,
  resolution: 2,
  autoDensity: true,
  skipExtensionImports: true,
})
document.getElementById('sheet')!.appendChild(renderer.canvas)

const atlas = buildAtlas(renderer)
const stage = new Container()

function label(text: string, x: number, y: number, dim = false): void {
  const t = new Text({
    text,
    style: { fontFamily: 'ui-sans-serif, system-ui, sans-serif', fontSize: 11, fill: dim ? 0x8b98ab : 0xe6ecf5 },
  })
  t.position.set(x, y)
  stage.addChild(t)
}

interface Anim {
  sprite: Sprite
  defIdx: number
  speed: number
}

const anims: Anim[] = []

function creatureRow(y: number, scale: number, title: string, silhouette: boolean): void {
  label(title, 20, y - 34, true)
  ENEMIES.forEach((def, i) => {
    const x = 90 + i * 190
    const s = new Sprite(atlas.enemy[i][0])
    s.anchor.set(0.5)
    s.position.set(x, y)
    s.scale.set(scale)
    if (silhouette) s.tint = 0x000000
    stage.addChild(s)
    anims.push({ sprite: s, defIdx: i, speed: def.speed })
    if (!silhouette) label(`${def.name}  r${def.radius}`, x - 40, y + 34 * scale + 8, true)
  })
}

// Fila 1: tamaño real. Es como se ve de verdad en el juego.
creatureRow(70, 1, 'Tamaño de juego (radio real)', false)

// Fila 2: ampliado, para juzgar el dibujo.
creatureRow(220, 3.2, 'Ampliado ×3.2 — evaluación de dibujo', false)

// Fila 3: el test que manda.
label('Test de silueta a tamaño de juego — si no podés nombrarlas, no está terminado', 20, 366, true)
ENEMIES.forEach((def, i) => {
  const x = 90 + i * 190
  const s = new Sprite(atlas.enemy[i][0])
  s.anchor.set(0.5)
  s.position.set(x, 400)
  s.tint = 0x000000
  stage.addChild(s)
  anims.push({ sprite: s, defIdx: i, speed: def.speed })
  label(def.name, x - 30, 424, true)
})

// Fila 4: torres, base + cañón, a tamaño real y ampliado.
label('Torres — tamaño real y ×2.6', 20, 466, true)
TOWERS.forEach((def, i) => {
  const x = 80 + i * 150
  for (const [sc, yy] of [
    [1, 505],
    [2.6, 590],
  ] as const) {
    const base = new Sprite(atlas.towerBase.get(def.id)?.[0])
    base.anchor.set(0.5)
    base.position.set(x, yy)
    base.scale.set(sc)
    const turret = new Sprite(atlas.towerTurret.get(def.id))
    turret.anchor.set(0.42, 0.5)
    turret.position.set(x, yy)
    turret.scale.set(sc)
    stage.addChild(base, turret)
  }
  label(def.name, x - 30, 640, true)
})

// Fila 5: proyectiles y escenario.
label('Proyectiles ×3 · portal · núcleo', 640, 466, true)
atlas.projectile.forEach((tex, i) => {
  const s = new Sprite(tex)
  s.anchor.set(0.5)
  s.position.set(680 + i * 50, 505)
  s.scale.set(3)
  s.tint = [0x6fbf73, 0x4f7fa8, 0x7fd4e8][i]
  stage.addChild(s)
})
const crit = new Sprite(atlas.projectile[0])
crit.anchor.set(0.5)
crit.position.set(830, 505)
crit.scale.set(3)
crit.tint = SEMANTIC.crit
stage.addChild(crit)

const portal = new Sprite(atlas.portal)
portal.anchor.set(0.5)
portal.position.set(700, 600)
const core = new Sprite(atlas.core)
core.anchor.set(0.5)
core.position.set(800, 600)
stage.addChild(portal, core)

let t = 0
const ticker = new Ticker()
ticker.add((tk) => {
  t += tk.deltaMS / 1000
  for (const a of anims) {
    // Mismo criterio que el juego: el frame avanza con la distancia recorrida.
    const def = ENEMIES[a.defIdx]
    const stride = Math.max(6, def.radius * 1.15)
    const frame = Math.floor(((t * a.speed) / stride) * WALK_FRAMES) % WALK_FRAMES
    a.sprite.texture = atlas.enemy[a.defIdx][frame]
  }
  portal.rotation += tk.deltaMS / 1000
  renderer.render(stage)
})
ticker.start()
