import { sfx } from './audio/sfx'
import { HITSTOP, Hitstop } from './core/hitstop'
import { FixedLoop } from './core/loop'
import { Renderer } from './render/renderer'
import { Game } from './sim/game'
import { Ui } from './ui/ui'

const params = new URLSearchParams(location.search)
const seed = params.get('seed') ?? String((Math.random() * 1e9) | 0)

const game = new Game({ seed })
const renderer = new Renderer()
await renderer.init(game, document.getElementById('stage')!)

// Solo en dev: engancha el juego a window para poder inspeccionarlo desde la
// consola o desde un script de pruebas. No entra en el build de produccion.
if (import.meta.env.DEV) {
  ;(window as unknown as { game: Game }).game = game
}

const ui = new Ui(game)
ui.onStartWave = () => game.startWave()
ui.onPick = (id) => {
  sfx.cardPick()
  game.pickUpgrade(id)
}
ui.onToggleSound = () => {
  const on = !sfx.enabled
  sfx.setEnabled(on)
  return on
}
ui.onReroll = () => game.reroll()
ui.onRestart = () => {
  const url = new URL(location.href)
  url.searchParams.set('seed', String((Math.random() * 1e9) | 0))
  location.href = url.toString()
}

// ------------------------------------------------------------------ audio

// El sonido escucha los mismos eventos que el render. La simulacion no sabe que
// existe, igual que no sabe que existe Pixi.
game.events.on('fire', ({ tower }) => sfx.shoot(tower.shot))
game.events.on('hit', ({ crit }) => sfx.hit(crit))
game.events.on('kill', ({ elite }) => sfx.death(elite))
game.events.on('splash', () => sfx.splash())
game.events.on('leak', () => sfx.leak())

// Hit-stop. Solo en sucesos que importan: si cada impacto congelase el juego,
// con veinte torres disparando quedaria en camara lenta permanente.
const hitstop = new Hitstop()
game.events.on('hit', ({ crit }) => {
  if (crit) hitstop.request(HITSTOP.crit)
})
game.events.on('kill', ({ elite }) => hitstop.request(elite ? HITSTOP.elite : HITSTOP.death))
game.events.on('leak', () => hitstop.request(HITSTOP.leak))
game.events.on('phase', ({ phase }) => {
  if (phase === 'combat') sfx.waveStart()
  else if (phase === 'draft') sfx.waveClear()
  else if (phase === 'gameover') sfx.gameOver()
})

// ------------------------------------------------------------------ input

const canvas = renderer.canvas
let mouseX = -999
let mouseY = -999

function toField(ev: PointerEvent | MouseEvent): { x: number; y: number } {
  const r = canvas.getBoundingClientRect()
  return {
    x: ((ev.clientX - r.left) / r.width) * game.world.width,
    y: ((ev.clientY - r.top) / r.height) * game.world.height,
  }
}

function towerAt(x: number, y: number) {
  return game.world.towers.find((t) => Math.hypot(t.x - x, t.y - y) < 18)
}

canvas.addEventListener('pointermove', (ev) => {
  const p = toField(ev)
  mouseX = p.x
  mouseY = p.y
})

canvas.addEventListener('pointerleave', () => {
  mouseX = -999
  mouseY = -999
})

canvas.addEventListener('pointerdown', (ev) => {
  if (ev.button !== 0) return
  const p = toField(ev)
  if (!ui.selectedTower) return
  const check = game.canPlace(p.x, p.y, ui.selectedTower)
  if (!check.ok) {
    ui.tip(check.reason ?? 'no se puede construir ahi')
    sfx.denied()
    return
  }
  game.placeTower(p.x, p.y, ui.selectedTower)
  sfx.build()
})

canvas.addEventListener('contextmenu', (ev) => {
  ev.preventDefault()
  const p = toField(ev)
  const t = towerAt(p.x, p.y)
  if (t) {
    game.sellTower(t.id)
    sfx.sell()
  }
})

window.addEventListener('keydown', (ev) => {
  if (ev.code === 'Space') {
    ev.preventDefault()
    if (game.phase === 'build') game.startWave()
    return
  }
  if (ev.key === 'Escape') ui.selectTower(null)
  if (ev.key === 'm' || ev.key === 'M') ui.toggleSound()
  if (ev.key === 'r' || ev.key === 'R') {
    if (game.phase === 'draft') game.reroll()
  }
  const n = Number(ev.key)
  if (n >= 1 && n <= game.towerDefs.length) ui.selectByIndex(n - 1)
})

// ------------------------------------------------------------------- loop

const loop = new FixedLoop()

renderer.ticker.add((ticker) => {
  const dtMs = ticker.deltaMS
  /*
   * El hit-stop escala el tiempo de la SIMULACION, nunca el del render ni el de
   * la entrada. El juego se frena; la interfaz y el mouse siguen respondiendo.
   */
  const scale = hitstop.update(dtMs / 1000)
  const alpha = loop.update(dtMs * scale, () => game.tick())
  renderer.draw(game, alpha, dtMs)

  if (mouseX > -900) {
    if (ui.selectedTower) {
      renderer.showGhost(game, mouseX, mouseY, ui.selectedTower)
    } else {
      const t = towerAt(mouseX, mouseY)
      if (t) renderer.hoverRange(t.x, t.y, t.stats.range, t.color)
      else renderer.clearOverlays()
    }
  } else {
    renderer.clearOverlays()
  }

  ui.sync(dtMs / 1000)
})
