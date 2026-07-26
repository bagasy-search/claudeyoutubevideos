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
  hit: { enemyIdx: number; x: number; y: number; damage: number; crit: boolean }
  kill: { enemyIdx: number; x: number; y: number; bounty: number; elite: boolean; color: number }
  leak: { x: number; y: number; lives: number }
  splash: { x: number; y: number; radius: number; color: number }
  fire: { tower: Tower }
  phase: { phase: Phase }
  draft: { options: UpgradeDef[] }
  changed: undefined
}

/**
 * Campo en 9:16. El juego es para telefono: en vertical el pulgar llega a todo
 * y no hay que rotar nada. La imagen de fondo va a 1080x1920, o sea exactamente
 * el doble — que es el devicePixelRatio de casi cualquier telefono actual.
 */
export const FIELD_W = 540
export const FIELD_H = 960

/**
 * El camino entra por arriba y sale por abajo, serpenteando.
 *
 * Estos numeros NO estan escritos a mano: salen de medir el tablero pintado con
 * `tools/fit_map.py`, que traza el eje de la calzada dibujada. Si se cambia la
 * imagen del mapa hay que volver a correrlo — si no, los enemigos caminan por
 * el pasto al lado de la ruta.
 */
const DEFAULT_PATH: PathPoint[] = [
  { x: 270, y: -43 },
  { x: 244, y: 139 },
  { x: 122, y: 232 },
  { x: 157, y: 369 },
  { x: 310, y: 380 },
  { x: 438, y: 407 },
  { x: 380, y: 537 },
  { x: 231, y: 580 },
  { x: 114, y: 667 },
  { x: 168, y: 802 },
  { x: 321, y: 835 },
  { x: 390, y: 957 },
]

/**
 * Plataformas de construccion, al estilo Kingdom Rush.
 *
 * La decision de fondo: el jugador elige QUE poner, no DONDE. Con colocacion
 * libre la partida se gana amontonando torres en el codo mas cerrado del
 * camino, y a partir de ahi el mapa deja de importar — cualquier trazado se
 * juega igual. Con plataformas fijas el mapa ES el problema a resolver: esta
 * cubre dos tramos pero llega tarde, aquella solo uno pero pega desde el
 * principio. Y de paso el fondo puede tener las plataformas PINTADAS, que es lo
 * que hace que el tablero se lea como un lugar y no como una grilla.
 *
 * Igual que el camino, estas posiciones estan MEDIDAS sobre la imagen: son los
 * centroides de las catorce losas pintadas, detectadas por area y redondez.
 */
export const BUILD_SLOTS: readonly PathPoint[] = [
  { x: 174, y: 89 },
  { x: 375, y: 94 },
  { x: 292, y: 203 },
  { x: 190, y: 280 },
  { x: 441, y: 289 },
  { x: 111, y: 427 },
  { x: 365, y: 436 },
  { x: 239, y: 467 },
  { x: 438, y: 593 },
  { x: 325, y: 635 },
  { x: 209, y: 669 },
  { x: 297, y: 752 },
  { x: 73, y: 825 },
  { x: 188, y: 885 },
]

/** Radio de captura del toque. Generoso: es un juego para dedos, no para mouse. */
export const SLOT_R = 38

/**
 * Segundos entre oleadas. No hay boton de "iniciar": la oleada llega sola.
 *
 * Es la diferencia entre un juego de turnos y uno de tiempo real. Con boton, el
 * jugador se toma los minutos que quiera para optimizar y la unica tension esta
 * dentro de la oleada; con reloj, decidir rapido es parte de jugar y una oleada
 * te puede agarrar a medio armar.
 *
 * La primera es mas larga porque es la unica que se juega sin nada construido.
 */
export const BUILD_TIME = 12
export const FIRST_BUILD_TIME = 25

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

  /** Segundos hasta que arranque la proxima oleada sola. */
  buildTimer = FIRST_BUILD_TIME

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
      onKill: (enemyIdx, bounty, x, y, elite) => {
        const g = Math.round(bounty * (1 + this.goldMult))
        this.gold += g
        this.stats.kills++
        this.stats.goldEarned += g
        const color = ENEMIES[this.world.enemies.defIdx[enemyIdx]]?.color ?? 0xffffff
        this.events.emit('kill', { enemyIdx, x, y, bounty: g, elite, color })
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
      onHit: (enemyIdx, x, y, damage, crit) => this.events.emit('hit', { enemyIdx, x, y, damage, crit }),
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

  /**
   * @param called true si la llamo el jugador antes de tiempo. Adelantar paga:
   * es el bucle de riesgo/recompensa que hace que el reloj sea una decision y
   * no solo una espera.
   */
  startWave(called = false): void {
    if (this.phase !== 'build') return
    if (called && this.buildTimer > 0) {
      const bonus = Math.round(this.buildTimer * 2)
      this.gold += bonus
      this.stats.goldEarned += bonus
    }
    this.buildTimer = 0
    this.wave++
    this.plan = planWave(this.simRng, this.wave)
    this.waveTime = 0
    this.spawnCursor = 0
    this.setPhase('combat')
  }

  /** Un tic de simulacion. dt siempre es TICK_S — nunca el dt del frame. */
  tick(): void {
    if (this.phase === 'build') {
      // La cuenta atras corre en la sim y no en el render: asi la pausa por
      // hit-stop la afecta igual que a todo lo demas, y una run con la misma
      // seed sigue siendo reproducible tic a tic.
      this.buildTimer -= TICK_S
      if (this.buildTimer <= 0) this.startWave()
      return
    }
    if (this.phase !== 'combat') return
    const dt = TICK_S
    this.waveTime += dt

    const plan = this.plan
    if (plan) {
      while (this.spawnCursor < plan.entries.length && plan.entries[this.spawnCursor].time <= this.waveTime) {
        const entry = plan.entries[this.spawnCursor++]
        // La variacion sale del RNG de la sim para que sea reproducible.
        this.world.enemies.spawn(entry.defIdx, entry.hpMul, entry.elite, this.simRng.next())
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
    const clearBonus = 15 + this.wave * 4
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
      this.buildTimer = BUILD_TIME
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
    this.buildTimer = BUILD_TIME
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

  /** Indice de la plataforma bajo el punto, o -1. La mas cercana gana. */
  slotAt(x: number, y: number): number {
    let best = -1
    let bestD = SLOT_R
    for (let i = 0; i < BUILD_SLOTS.length; i++) {
      const d = Math.hypot(BUILD_SLOTS[i].x - x, BUILD_SLOTS[i].y - y)
      if (d < bestD) {
        bestD = d
        best = i
      }
    }
    return best
  }

  /** La torre que ocupa una plataforma, si hay. */
  towerOnSlot(slot: number): Tower | undefined {
    return this.world.towers.find((t) => t.slot === slot)
  }

  canPlace(x: number, y: number, type: string): { ok: boolean; reason?: string; slot?: number } {
    const def = TOWER_BY_ID.get(type)
    if (!def) return { ok: false, reason: 'tipo desconocido' }
    const slot = this.slotAt(x, y)
    if (slot < 0) return { ok: false, reason: 'no hay plataforma acá' }
    if (this.towerOnSlot(slot)) return { ok: false, reason: 'plataforma ocupada' }
    // El oro se chequea AL FINAL a proposito: si el jugador toca una plataforma
    // libre pero no le alcanza, el mensaje util es "sin oro", no "no hay
    // plataforma". El motivo mas especifico primero.
    if (this.gold < def.cost) return { ok: false, reason: 'sin oro', slot }
    return { ok: true, slot }
  }

  placeTower(x: number, y: number, type: string): Tower | null {
    const check = this.canPlace(x, y, type)
    if (!check.ok || check.slot === undefined) return null
    const def = TOWER_BY_ID.get(type)!
    this.gold -= def.cost
    // La torre se planta en el centro de la plataforma, no donde cayo el dedo.
    const at = BUILD_SLOTS[check.slot]
    const tower: Tower = {
      id: this.nextTowerId++,
      type: def.id,
      tags: def.tags,
      slot: check.slot,
      x: at.x,
      y: at.y,
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
