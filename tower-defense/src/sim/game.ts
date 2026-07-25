import { Emitter } from '../core/events'
import { Rng, seedFromString } from '../core/rng'
import { TICK_S } from '../core/loop'
import { commitOffer, newDraftMemory, rollDraft, type DraftMemory } from '../draft/draft'
import { ENEMIES } from './balance/enemies'
import { TOWERS, TOWER_BY_ID } from './balance/towers'
import { UPGRADE_BY_ID } from './balance/upgrades'
import type { SimHooks } from './hooks'
import { Path, type PathPoint } from './path'
import { computeStats, dpsOf, type Modifier } from './stats'
import { movementSystem } from './systems/movement'
import { projectileSystem } from './systems/projectiles'
import { towerSystem } from './systems/towers'
import { planWave, type WavePlan } from './systems/waves'
import type { UpgradeContext, UpgradeDef } from './types'
import { EnemyPool, ProjectilePool, SpatialGrid, type Tower, type World } from './world'

export type Phase = 'build' | 'combat' | 'draft' | 'gameover'

export interface GameEvents {
  hit: { x: number; y: number; damage: number; crit: boolean }
  kill: { x: number; y: number; bounty: number; elite: boolean }
  leak: { x: number; y: number; lives: number }
  splash: { x: number; y: number; radius: number; color: number }
  fire: { tower: Tower }
  phase: { phase: Phase }
  draft: { options: UpgradeDef[] }
  changed: undefined
}

export const FIELD_W = 960
export const FIELD_H = 600

const DEFAULT_PATH: PathPoint[] = [
  { x: -30, y: 120 },
  { x: 180, y: 120 },
  { x: 300, y: 250 },
  { x: 170, y: 400 },
  { x: 330, y: 520 },
  { x: 560, y: 470 },
  { x: 620, y: 260 },
  { x: 790, y: 180 },
  { x: 860, y: 380 },
  { x: 700, y: 545 },
  { x: 990, y: 560 },
]

export interface GameOptions {
  seed?: string | number
  startGold?: number
  startLives?: number
}

export class Game {
  readonly events = new Emitter<GameEvents>()
  readonly world: World
  readonly simRng: Rng
  readonly draftRng: Rng
  readonly seed: number

  phase: Phase = 'build'
  wave = 0
  gold: number
  lives: number

  /** Lista global de modificadores. Fuente de verdad de todos los stats. */
  mods: Modifier[] = []
  picks: Record<string, number> = {}

  goldMult = 0
  goldPerWave = 0
  interest = 0

  plan: WavePlan | null = null
  waveTime = 0
  spawnCursor = 0

  draftMemory: DraftMemory = newDraftMemory()
  offer: UpgradeDef[] = []
  rerolls = 1

  /** Estadisticas de la run, para la pantalla de fin. */
  stats = { kills: 0, goldEarned: 0, leaked: 0 }

  private nextTowerId = 1
  private hooks: SimHooks

  constructor(opts: GameOptions = {}) {
    this.seed = typeof opts.seed === 'string' ? seedFromString(opts.seed) : (opts.seed ?? 12345) >>> 0
    this.simRng = new Rng(this.seed)
    // Stream separado para el draft: asi construir mas o menos torres no
    // desplaza las cartas que te tocan. Reproducibilidad limpia.
    this.draftRng = new Rng((this.seed ^ 0x5bf03635) >>> 0)

    this.gold = opts.startGold ?? 260
    this.lives = opts.startLives ?? 20

    const path = new Path(DEFAULT_PATH)
    this.world = {
      path,
      enemies: new EnemyPool(),
      projectiles: new ProjectilePool(),
      towers: [],
      grid: new SpatialGrid(FIELD_W, FIELD_H, 64),
      width: FIELD_W,
      height: FIELD_H,
    }

    this.hooks = {
      onKill: (_i, bounty, x, y, elite) => {
        const g = Math.round(bounty * (1 + this.goldMult))
        this.gold += g
        this.stats.kills++
        this.stats.goldEarned += g
        this.events.emit('kill', { x, y, bounty: g, elite })
      },
      onLeak: (_i, leak, x, y) => {
        this.lives -= leak
        this.stats.leaked++
        this.events.emit('leak', { x, y, lives: this.lives })
        if (this.lives <= 0) {
          this.lives = 0
          this.setPhase('gameover')
        }
      },
      onHit: (x, y, damage, crit) => this.events.emit('hit', { x, y, damage, crit }),
      onSplash: (x, y, radius, color) => this.events.emit('splash', { x, y, radius, color }),
      onFire: (tower) => this.events.emit('fire', { tower }),
    }
  }

  // ---------------------------------------------------------------- fases

  private setPhase(p: Phase): void {
    if (this.phase === p) return
    this.phase = p
    this.events.emit('phase', { phase: p })
    this.events.emit('changed', undefined)
  }

  startWave(): void {
    if (this.phase !== 'build') return
    this.wave++
    this.plan = planWave(this.simRng, this.wave)
    this.waveTime = 0
    this.spawnCursor = 0
    this.setPhase('combat')
  }

  /** Un tic de simulacion. dt siempre es TICK_S — nunca el dt del frame. */
  tick(): void {
    if (this.phase !== 'combat') return
    const dt = TICK_S
    this.waveTime += dt

    const plan = this.plan
    if (plan) {
      while (this.spawnCursor < plan.entries.length && plan.entries[this.spawnCursor].time <= this.waveTime) {
        const entry = plan.entries[this.spawnCursor++]
        this.world.enemies.spawn(entry.defIdx, entry.hpMul, entry.elite)
      }
    }

    this.world.grid.rebuild(this.world.enemies)
    movementSystem(this.world, dt, this.hooks)
    this.world.grid.rebuild(this.world.enemies)
    towerSystem(this.world, dt, this.simRng, this.hooks)
    projectileSystem(this.world, dt, this.hooks)

    if (this.phase !== 'combat') return
    const done = plan !== null && this.spawnCursor >= plan.entries.length && this.world.enemies.count === 0
    if (done) this.endWave()
  }

  private endWave(): void {
    const clearBonus = 20 + this.wave * 6
    const interestGold = Math.floor(this.gold * this.interest)
    const total = clearBonus + this.goldPerWave + interestGold
    this.gold += total
    this.stats.goldEarned += total
    this.world.projectiles.clear()
    this.rerolls = Math.max(this.rerolls, 1)
    this.openDraft()
  }

  // --------------------------------------------------------------- draft

  private openDraft(): void {
    const res = rollDraft(this.draftRng, this.buildUpgradeContext(), this.draftMemory)
    this.offer = res.options
    if (this.offer.length === 0) {
      // Pool agotado: saltear el draft en vez de trabarse.
      this.setPhase('build')
      return
    }
    this.setPhase('draft')
    this.events.emit('draft', { options: this.offer })
  }

  reroll(): boolean {
    if (this.phase !== 'draft' || this.rerolls <= 0) return false
    this.rerolls--
    commitOffer(this.draftMemory, this.offer, null)
    const res = rollDraft(this.draftRng, this.buildUpgradeContext(), this.draftMemory)
    this.offer = res.options
    this.events.emit('draft', { options: this.offer })
    this.events.emit('changed', undefined)
    return true
  }

  pickUpgrade(id: string): boolean {
    if (this.phase !== 'draft') return false
    const def = this.offer.find((u) => u.id === id)
    if (!def) return false

    this.picks[def.id] = (this.picks[def.id] ?? 0) + 1
    if (def.modifiers) this.mods.push(...def.modifiers)
    const fx = def.effect
    if (fx) {
      if (fx.gold) this.gold += fx.gold
      if (fx.lives) this.lives += fx.lives
      if (fx.goldPerWave) this.goldPerWave += fx.goldPerWave
      if (fx.goldMult) this.goldMult += fx.goldMult
      if (fx.interest) this.interest += fx.interest
    }

    commitOffer(this.draftMemory, this.offer, def)
    this.offer = []
    this.recomputeAllStats()
    this.setPhase('build')
    return true
  }

  buildUpgradeContext(): UpgradeContext {
    const towerCounts: Record<string, number> = {}
    const tagCounts: Record<string, number> = {}
    for (const t of this.world.towers) {
      towerCounts[t.type] = (towerCounts[t.type] ?? 0) + 1
      for (const tag of t.tags) tagCounts[tag] = (tagCounts[tag] ?? 0) + 1
    }
    return { wave: this.wave, towerCounts, tagCounts, picks: this.picks, gold: this.gold }
  }

  /**
   * Preview del delta real para la carta: "DPS 340 → 512".
   * Es lo que hace que la decision se sienta informada en vez de a ciegas.
   */
  previewUpgrade(def: UpgradeDef): { before: number; after: number } {
    const before = this.totalDps(this.mods)
    const after = def.modifiers ? this.totalDps([...this.mods, ...def.modifiers]) : before
    return { before, after }
  }

  private totalDps(mods: readonly Modifier[]): number {
    let sum = 0
    for (const t of this.world.towers) {
      const def = TOWER_BY_ID.get(t.type)
      if (!def) continue
      sum += dpsOf(computeStats(def.base, { type: def.id, tags: def.tags }, mods))
    }
    return sum
  }

  // --------------------------------------------------------------- torres

  canPlace(x: number, y: number, type: string): { ok: boolean; reason?: string } {
    const def = TOWER_BY_ID.get(type)
    if (!def) return { ok: false, reason: 'tipo desconocido' }
    if (this.gold < def.cost) return { ok: false, reason: 'sin oro' }
    if (x < 18 || y < 18 || x > FIELD_W - 18 || y > FIELD_H - 18) return { ok: false, reason: 'fuera del mapa' }
    if (this.world.path.distanceToPoint(x, y) < 30) return { ok: false, reason: 'sobre el camino' }
    for (const t of this.world.towers) {
      if (Math.hypot(t.x - x, t.y - y) < 32) return { ok: false, reason: 'muy cerca de otra torre' }
    }
    return { ok: true }
  }

  placeTower(x: number, y: number, type: string): Tower | null {
    const check = this.canPlace(x, y, type)
    if (!check.ok) return null
    const def = TOWER_BY_ID.get(type)!
    this.gold -= def.cost
    const tower: Tower = {
      id: this.nextTowerId++,
      type: def.id,
      tags: def.tags,
      x,
      y,
      cooldown: 0,
      angle: 0,
      prevAngle: 0,
      stats: computeStats(def.base, { type: def.id, tags: def.tags }, this.mods),
      color: def.color,
      shot: def.shot,
      kills: 0,
      damageDealt: 0,
      recoil: 0,
    }
    this.world.towers.push(tower)
    this.events.emit('changed', undefined)
    return tower
  }

  sellTower(id: number): void {
    const i = this.world.towers.findIndex((t) => t.id === id)
    if (i < 0) return
    const t = this.world.towers[i]
    const def = TOWER_BY_ID.get(t.type)
    this.gold += Math.floor((def?.cost ?? 0) * 0.6)
    this.world.towers.splice(i, 1)
    this.events.emit('changed', undefined)
  }

  /** Unico lugar donde se recalculan stats. Se llama al cambiar la lista de mods. */
  recomputeAllStats(): void {
    for (const t of this.world.towers) {
      const def = TOWER_BY_ID.get(t.type)
      if (!def) continue
      t.stats = computeStats(def.base, { type: def.id, tags: def.tags }, this.mods)
    }
  }

  get towerDefs() {
    return TOWERS
  }

  get enemyDefs() {
    return ENEMIES
  }

  upgradeName(id: string): string {
    return UPGRADE_BY_ID.get(id)?.name ?? id
  }
}
