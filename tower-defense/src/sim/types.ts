import type { Modifier, Stats } from './stats'

export interface TowerDef {
  id: string
  name: string
  cost: number
  /** Los tags son la moneda de las sinergias: los upgrades apuntan a tags. */
  tags: readonly string[]
  color: number
  base: Stats
  /** Como se ve/comporta el proyectil. */
  shot: 'bolt' | 'shell' | 'shard'
  /**
   * Si es false, la torre no tiene cañon giratorio: es un personaje entero que
   * se anima solo. El apuntado se comunica con el fogonazo, no con la rotacion.
   */
  turret?: boolean
  /** Cuadros por segundo de la animacion de reposo. */
  fps?: number
  desc: string
}

export interface EnemyDef {
  id: string
  name: string
  /** Costo en el presupuesto de la oleada. Define cuantos entran. */
  cost: number
  hp: number
  /** px por segundo */
  speed: number
  armor: number
  radius: number
  bounty: number
  color: number
  tags: readonly string[]
  /** Vidas que saca si llega al final. */
  leak: number
}

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface UpgradeContext {
  wave: number
  towerCounts: Record<string, number>
  tagCounts: Record<string, number>
  picks: Record<string, number>
  gold: number
}

export interface UpgradeDef {
  id: string
  name: string
  desc: string
  rarity: Rarity
  /** Cuantas veces se puede tomar. Infinity para los "stackeables" de relleno. */
  maxStacks: number
  /** Peso relativo DENTRO de su rareza. La rareza se sortea antes. */
  weight: number
  /** Tags de la carta, para la garantia de sinergia del draft. */
  synergyTags?: readonly string[]
  /** Prerequisito. Si no se cumple, la carta no entra al pool. */
  requires?: (ctx: UpgradeContext) => boolean
  /** No ofrecer junto a estas cartas en la misma tirada. */
  excludes?: readonly string[]
  modifiers?: readonly Modifier[]
  /** Efectos que no son stats (oro, vidas, torre gratis...). */
  effect?: UpgradeEffect
}

export interface UpgradeEffect {
  gold?: number
  lives?: number
  goldPerWave?: number
  /** Multiplicador de oro por kill. */
  goldMult?: number
  interest?: number
}
