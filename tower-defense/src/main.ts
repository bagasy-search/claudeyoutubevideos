import { FixedLoop } from './core/loop'
import { Renderer } from './render/renderer'
import { Game } from './sim/game'
import { Ui } from './ui/ui'

const params = new URLSearchParams(location.search)
const seed = params.get('seed') ?? String((Math.random() * 1e9) | 0)

const game = new Game({ seed })
const renderer = new Renderer()
await renderer.init(game, document.getElementById('stage')!)

const ui = new Ui(game)
ui.onStartWave = () => game.startWave()
ui.onPick = (id) => game.pickUpgrade(id)
ui.onReroll = () => game.reroll()
ui.onRestart = () => {
  const url = new URL(location.href)
  url.searchParams.set('seed', String((Math.random() * 1e9) | 0))
  location.href = url.toString()
}

// ------------------------------------------------------------------ input

const canvas = renderer.app.canvas
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
    return
  }
  game.placeTower(p.x, p.y, ui.selectedTower)
})

canvas.addEventListener('contextmenu', (ev) => {
  ev.preventDefault()
  const p = toField(ev)
  const t = towerAt(p.x, p.y)
  if (t) game.sellTower(t.id)
})

window.addEventListener('keydown', (ev) => {
  if (ev.code === 'Space') {
    ev.preventDefault()
    if (game.phase === 'build') game.startWave()
    return
  }
  if (ev.key === 'Escape') ui.selectTower(null)
  if (ev.key === 'r' || ev.key === 'R') {
    if (game.phase === 'draft') game.reroll()
  }
  const n = Number(ev.key)
  if (n >= 1 && n <= game.towerDefs.length) ui.selectByIndex(n - 1)
})

// ------------------------------------------------------------------- loop

const loop = new FixedLoop()

renderer.app.ticker.add((ticker) => {
  const dtMs = ticker.deltaMS
  // La sim avanza SIEMPRE en tics de 1/60s; alpha interpola el sobrante.
  const alpha = loop.update(dtMs, () => game.tick())
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
