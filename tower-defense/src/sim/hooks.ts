import type { Tower } from './world'

/**
 * Puente sim → resto del juego. La simulacion no conoce Pixi ni el DOM: avisa
 * por aca y quien quiera (render, UI, audio) reacciona.
 */
export interface SimHooks {
  onKill(enemyIdx: number, bounty: number, x: number, y: number, elite: boolean): void
  onLeak(enemyIdx: number, leak: number, x: number, y: number): void
  onHit(enemyIdx: number, x: number, y: number, damage: number, crit: boolean): void
  onSplash(x: number, y: number, radius: number, color: number): void
  onFire(tower: Tower): void
}

export const NOOP_HOOKS: SimHooks = {
  onKill: () => {},
  onLeak: () => {},
  onHit: () => {},
  onSplash: () => {},
  onFire: () => {},
}
