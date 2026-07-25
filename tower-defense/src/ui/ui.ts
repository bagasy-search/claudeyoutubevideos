import { RARITY_COLOR } from '../sim/balance/upgrades'
import type { Game } from '../sim/game'
import type { UpgradeDef } from '../sim/types'

/**
 * HUD y pantalla de draft en DOM.
 *
 * La UI va en DOM y no en el canvas a proposito: CSS te da layout, animaciones
 * y accesibilidad gratis, y el canvas queda libre para lo que importa.
 */
export class Ui {
  selectedTower: string | null = null
  onStartWave: () => void = () => {}
  onPick: (id: string) => void = () => {}
  onReroll: () => void = () => {}
  onRestart: () => void = () => {}

  private el = {
    wave: byId('hud-wave'),
    gold: byId('hud-gold'),
    lives: byId('hud-lives'),
    enemies: byId('hud-enemies'),
    seed: byId('hud-seed'),
    towerBar: byId('tower-bar'),
    start: byId('btn-start') as HTMLButtonElement,
    draft: byId('draft'),
    draftWave: byId('draft-wave'),
    cards: byId('draft-cards'),
    reroll: byId('btn-reroll') as HTMLButtonElement,
    rerollCount: byId('reroll-count'),
    gameover: byId('gameover'),
    goSummary: byId('go-summary'),
    restart: byId('btn-restart') as HTMLButtonElement,
    tip: byId('tip-msg'),
  }

  private towerButtons = new Map<string, HTMLButtonElement>()
  private tipTimer = 0

  constructor(private game: Game) {
    this.buildTowerBar()
    this.el.start.addEventListener('click', () => this.onStartWave())
    this.el.reroll.addEventListener('click', () => this.onReroll())
    this.el.restart.addEventListener('click', () => this.onRestart())
    this.el.seed.textContent = `seed ${game.seed}`

    game.events.on('draft', ({ options }) => this.showDraft(options))
    game.events.on('phase', ({ phase }) => {
      if (phase !== 'draft') this.el.draft.classList.add('hidden')
      this.el.gameover.classList.toggle('hidden', phase !== 'gameover')
      if (phase === 'gameover') {
        const s = game.stats
        this.el.goSummary.textContent = `Oleada ${game.wave} · ${s.kills} bajas · ${s.goldEarned} de oro · ${Object.values(game.picks).reduce((a, b) => a + b, 0)} mejoras`
      }
    })
  }

  setGame(game: Game): void {
    this.game = game
  }

  private buildTowerBar(): void {
    this.el.towerBar.innerHTML = ''
    this.towerButtons.clear()
    this.game.towerDefs.forEach((def, i) => {
      const btn = document.createElement('button')
      btn.className = 'tower-btn'
      btn.innerHTML = `
        <span class="row"><span class="swatch" style="background:#${def.color.toString(16).padStart(6, '0')}"></span>${def.name} <kbd>${i + 1}</kbd></span>
        <span class="cost">${def.cost} de oro</span>`
      btn.title = def.desc
      btn.addEventListener('click', () => this.selectTower(def.id))
      this.el.towerBar.appendChild(btn)
      this.towerButtons.set(def.id, btn)
    })
  }

  selectTower(id: string | null): void {
    this.selectedTower = this.selectedTower === id ? null : id
    for (const [key, btn] of this.towerButtons) {
      btn.classList.toggle('selected', key === this.selectedTower)
    }
  }

  selectByIndex(i: number): void {
    const def = this.game.towerDefs[i]
    if (def) this.selectTower(def.id)
  }

  tip(msg: string): void {
    this.el.tip.textContent = msg
    this.tipTimer = 1.6
  }

  /** Se llama cada frame; solo escribe en el DOM cuando el valor cambio. */
  sync(dt: number): void {
    const g = this.game
    setText(this.el.wave, String(g.wave))
    setText(this.el.gold, String(Math.floor(g.gold)))
    setText(this.el.lives, String(g.lives))
    setText(this.el.enemies, String(g.world.enemies.count))
    this.el.start.disabled = g.phase !== 'build'
    setText(this.el.rerollCount, String(g.rerolls))
    this.el.reroll.disabled = g.rerolls <= 0

    for (const [id, btn] of this.towerButtons) {
      const def = g.towerDefs.find((d) => d.id === id)!
      btn.disabled = g.gold < def.cost
    }

    if (this.tipTimer > 0) {
      this.tipTimer -= dt
      if (this.tipTimer <= 0) this.el.tip.textContent = ''
    }
  }

  private showDraft(options: UpgradeDef[]): void {
    const g = this.game
    this.el.draft.classList.remove('hidden')
    setText(this.el.draftWave, String(g.wave))
    this.el.cards.innerHTML = ''

    options.forEach((def, i) => {
      const card = document.createElement('div')
      card.className = `card ${def.rarity}`
      card.style.setProperty('--rarity', RARITY_COLOR[def.rarity])
      card.style.setProperty('--delay', `${i * 80}ms`)

      const { before, after } = g.previewUpgrade(def)
      const stacks = g.picks[def.id] ?? 0
      const stackTxt =
        def.maxStacks === Infinity ? '' : `${stacks}/${def.maxStacks} tomadas`

      card.innerHTML = `
        <div class="rarity">${def.rarity}</div>
        <div class="name">${def.name}</div>
        <div class="desc">${def.desc}</div>
        <div class="delta">${deltaHtml(before, after)}</div>
        <div class="stacks">${stackTxt}</div>`

      card.addEventListener('click', () => this.onPick(def.id))
      this.el.cards.appendChild(card)
    })
  }
}

/** "DPS 340 → 512 (+51%)" — el preview que hace que la eleccion se sienta informada. */
function deltaHtml(before: number, after: number): string {
  if (before <= 0 || Math.abs(after - before) < 0.01) {
    return `<span>DPS ${fmt(before)}</span><span class="stacks">sin cambio directo</span>`
  }
  const pct = ((after - before) / before) * 100
  const cls = pct >= 0 ? 'up' : 'down'
  const sign = pct >= 0 ? '+' : ''
  return `<span>DPS ${fmt(before)} → ${fmt(after)}</span><span class="${cls}">${sign}${pct.toFixed(0)}%</span>`
}

function fmt(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(1)}k`
  return n.toFixed(0)
}

function setText(el: HTMLElement, value: string): void {
  if (el.textContent !== value) el.textContent = value
}

function byId(id: string): HTMLElement {
  const el = document.getElementById(id)
  if (!el) throw new Error(`falta #${id} en el HTML`)
  return el
}
