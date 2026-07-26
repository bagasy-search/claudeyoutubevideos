import { describe, expect, it } from 'vitest'
import { BUILD_SLOTS, Game } from '../src/sim/game'

/**
 * Sonda de balance: juega runs enteras headless con una estrategia fija y mide
 * hasta donde llegan. No busca un numero exacto — es una red de contencion para
 * que un cambio de economia o de escalado de oleadas no rompa la curva sin que
 * nadie se entere.
 *
 * La estrategia de la sonda es deliberadamente MALA: ocho torres rotando tipos
 * sin criterio, siempre la primera carta, nunca vender. Es un piso, no una
 * referencia de lo que puede hacer alguien jugando bien.
 *
 * Medido al escribir esto: muere entre la oleada 20 y 21, con las 20 vidas
 * intactas hasta la oleada 5 y el primer mordisco en el jefe de la 10.
 */

const MAX_WAVE = 40
const TOWER_CAP = 8

function freeSpots(g: Game, type: string, limit: number): [number, number][] {
  const out: [number, number][] = []
  for (const s of BUILD_SLOTS) {
    if (out.length >= limit) break
    if (g.canPlace(s.x, s.y, type).ok) out.push([s.x, s.y])
  }
  return out
}

function playRun(seed: string) {
  const g = new Game({ seed })
  const types = ['arrow', 'cannon', 'frost']
  let ti = 0

  while (g.phase !== 'gameover' && g.wave < MAX_WAVE) {
    let bought = true
    while (bought && g.world.towers.length < TOWER_CAP) {
      bought = false
      const type = types[ti % types.length]
      for (const [x, y] of freeSpots(g, type, 20)) {
        if (g.placeTower(x, y, type)) {
          bought = true
          ti++
          break
        }
      }
    }
    g.startWave()
    let guard = 0
    while (g.phase === 'combat' && guard++ < 60 * 300) g.tick()
    if (g.phase === 'draft') g.pickUpgrade(g.offer[0].id)
  }
  return g
}

describe('curva de dificultad', () => {
  it('una build acotada aguanta bastantes oleadas pero no es inmortal', () => {
    for (const seed of ['a', 'b']) {
      const g = playRun(seed)
      // Piso: si esto baja, se rompio la economia o el escalado de mejoras.
      expect(g.wave).toBeGreaterThanOrEqual(14)
      // Techo REAL, no el limite del test: con una estrategia mala la run tiene
      // que morir. Si llega a 40 es que el juego dejo de tener dificultad, que
      // es exactamente el agujero que este numero vigila.
      expect(g.wave).toBeLessThan(32)
      expect(g.stats.kills).toBeGreaterThan(300)
    }
  }, 120000)

  it('sin construir nada, la run se pierde rapido', () => {
    const g = new Game({ seed: 'vacio' })
    while (g.phase !== 'gameover' && g.wave < 10) {
      g.startWave()
      let guard = 0
      while (g.phase === 'combat' && guard++ < 60 * 300) g.tick()
      if (g.phase === 'draft') g.pickUpgrade(g.offer[0].id)
    }
    expect(g.phase).toBe('gameover')
    expect(g.wave).toBeLessThanOrEqual(2)
  })
})
