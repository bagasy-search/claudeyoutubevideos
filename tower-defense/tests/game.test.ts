import { describe, expect, it } from 'vitest'
import { Game } from '../src/sim/game'

/**
 * Busca posiciones validas cerca del camino, en vez de hardcodear coordenadas
 * que se rompen apenas se toca el trazado del mapa.
 */
function findSpots(game: Game, n: number, type = 'arrow'): [number, number][] {
  const out: [number, number][] = []
  for (let y = 30; y < game.world.height - 30 && out.length < n; y += 20) {
    for (let x = 30; x < game.world.width - 30 && out.length < n; x += 20) {
      const d = game.world.path.distanceToPoint(x, y)
      if (d < 32 || d > 100) continue
      if (!game.canPlace(x, y, type).ok) continue
      if (out.some(([ox, oy]) => Math.hypot(ox - x, oy - y) < 40)) continue
      out.push([x, y])
    }
  }
  return out
}

/** Corre la sim headless hasta que cambie de fase o se agote el limite de tics. */
function runUntilPhaseChange(game: Game, maxTicks = 60 * 240): number {
  const start = game.phase
  let ticks = 0
  while (game.phase === start && ticks < maxTicks) {
    game.tick()
    ticks++
  }
  return ticks
}

describe('ciclo de juego', () => {
  it('arranca en build y pasa a combat al iniciar oleada', () => {
    const g = new Game({ seed: 'test' })
    expect(g.phase).toBe('build')
    g.startWave()
    expect(g.phase).toBe('combat')
    expect(g.wave).toBe(1)
  })

  it('una oleada sin torres termina drenando vidas', () => {
    const g = new Game({ seed: 'test', startLives: 3 })
    g.startWave()
    runUntilPhaseChange(g)
    expect(g.phase).toBe('gameover')
    expect(g.lives).toBe(0)
  })

  it('con torres suficientes la oleada 1 se limpia y abre el draft', () => {
    const g = new Game({ seed: 'test', startGold: 5000 })
    for (const [x, y] of findSpots(g, 6)) {
      expect(g.placeTower(x, y, 'arrow')).not.toBeNull()
    }
    g.startWave()
    runUntilPhaseChange(g)
    expect(g.phase).toBe('draft')
    expect(g.offer.length).toBe(3)
    expect(g.lives).toBe(20)
  })

  it('elegir una mejora aplica los modificadores y recalcula stats', () => {
    const g = new Game({ seed: 'test', startGold: 5000 })
    const [spot] = findSpots(g, 1)
    g.placeTower(spot[0], spot[1], 'arrow')
    const before = g.world.towers[0].stats.damage

    g.mods.push({ stat: 'damage', op: 'inc', value: 1 })
    g.recomputeAllStats()
    expect(g.world.towers[0].stats.damage).toBeCloseTo(before * 2)
  })

  it('el draft entrega la mejora elegida y devuelve el control al jugador', () => {
    const g = new Game({ seed: 'test', startGold: 5000 })
    for (const [x, y] of findSpots(g, 6)) g.placeTower(x, y, 'arrow')
    g.startWave()
    runUntilPhaseChange(g)
    expect(g.phase).toBe('draft')

    const chosen = g.offer[0]
    const goldBefore = g.gold
    expect(g.pickUpgrade(chosen.id)).toBe(true)
    expect(g.phase).toBe('build')
    expect(g.picks[chosen.id]).toBe(1)
    if (chosen.modifiers) expect(g.mods.length).toBe(chosen.modifiers.length)
    if (chosen.effect?.gold) expect(g.gold).toBe(goldBefore + chosen.effect.gold)
  })

  it('el reroll consume el cargo y cambia la oferta', () => {
    const g = new Game({ seed: 'test', startGold: 5000 })
    for (const [x, y] of findSpots(g, 6)) g.placeTower(x, y, 'arrow')
    g.startWave()
    runUntilPhaseChange(g)

    const first = g.offer.map((o) => o.id)
    expect(g.reroll()).toBe(true)
    expect(g.rerolls).toBe(0)
    expect(g.offer.length).toBe(3)
    expect(g.offer.map((o) => o.id)).not.toEqual(first)
    expect(g.reroll()).toBe(false)
  })

  it('no deja construir sobre el camino ni sin oro', () => {
    const g = new Game({ seed: 'test', startGold: 60 })
    const onPath = g.canPlace(g.world.path.xs[10], g.world.path.ys[10], 'arrow')
    expect(onPath.ok).toBe(false)
    expect(onPath.reason).toBe('sobre el camino')

    const [spot] = findSpots(g, 1)
    expect(g.canPlace(spot[0], spot[1], 'cannon').ok).toBe(false) // cuesta 110
    expect(g.canPlace(spot[0], spot[1], 'arrow').ok).toBe(true)
  })

  it('no deja apilar torres en el mismo lugar', () => {
    const g = new Game({ seed: 'test', startGold: 5000 })
    const [spot] = findSpots(g, 1)
    g.placeTower(spot[0], spot[1], 'arrow')
    expect(g.canPlace(spot[0] + 5, spot[1] + 2, 'arrow').ok).toBe(false)
  })

  it('la simulacion es determinista con la misma seed', () => {
    const run = () => {
      const g = new Game({ seed: 'determinismo', startGold: 5000 })
      for (const [x, y] of findSpots(g, 3)) g.placeTower(x, y, 'arrow')
      g.startWave()
      for (let i = 0; i < 60 * 30; i++) g.tick()
      return { gold: g.gold, lives: g.lives, kills: g.stats.kills, phase: g.phase }
    }
    expect(run()).toEqual(run())
  })

  it('el pool de proyectiles no se fuga entre oleadas', () => {
    const g = new Game({ seed: 'test', startGold: 5000 })
    const spots = findSpots(g, 4)
    g.placeTower(spots[0][0], spots[0][1], 'arrow')
    g.placeTower(spots[1][0], spots[1][1], 'cannon')
    g.startWave()
    runUntilPhaseChange(g)
    expect(g.world.projectiles.count).toBe(0)
  })
})
