import { describe, expect, it } from 'vitest'
import { BUILD_SLOTS, BUILD_TIME, FIRST_BUILD_TIME, Game } from '../src/sim/game'

/**
 * Plataformas libres, en orden. Antes esto barria una grilla buscando huecos
 * validos; con plataformas fijas la lista ES la respuesta, y ademas no puede
 * devolver dos puntos que caigan en la misma plataforma — que es como se
 * rompia el barrido, porque el radio de captura es mas grande que el paso.
 */
function findSpots(game: Game, n: number, type = 'arrow'): [number, number][] {
  const out: [number, number][] = []
  for (let i = 0; i < BUILD_SLOTS.length && out.length < n; i++) {
    const s = BUILD_SLOTS[i]
    if (!game.canPlace(s.x, s.y, type).ok) continue
    out.push([s.x, s.y])
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

  it('solo deja construir en plataformas y con oro suficiente', () => {
    const g = new Game({ seed: 'test', startGold: 60 })
    const onPath = g.canPlace(g.world.path.xs[10], g.world.path.ys[10], 'arrow')
    expect(onPath.ok).toBe(false)
    expect(onPath.reason).toBe('no hay plataforma acá')

    const [spot] = findSpots(g, 1)
    expect(g.canPlace(spot[0], spot[1], 'cannon').ok).toBe(false) // cuesta 110
    expect(g.canPlace(spot[0], spot[1], 'arrow').ok).toBe(true)
  })

  it('no deja apilar torres en la misma plataforma', () => {
    const g = new Game({ seed: 'test', startGold: 5000 })
    const [spot] = findSpots(g, 1)
    g.placeTower(spot[0], spot[1], 'arrow')
    const again = g.canPlace(spot[0] + 5, spot[1] + 2, 'arrow')
    expect(again.ok).toBe(false)
    expect(again.reason).toBe('plataforma ocupada')
  })

  it('la oleada arranca sola cuando se acaba el reloj', () => {
    const g = new Game({ seed: 'reloj' })
    expect(g.phase).toBe('build')
    // Faltando dos tics sigue en construccion...
    for (let i = 0; i < 60 * FIRST_BUILD_TIME - 2; i++) g.tick()
    expect(g.phase).toBe('build')
    // ...y unos pocos tics despues arranca sola. El margen no es pereza: restar
    // 1/60 mil quinientas veces no da cero exacto en punto flotante, y clavar
    // el tic exacto seria un test que falla por el redondeo y no por el juego.
    for (let i = 0; i < 4; i++) g.tick()
    expect(g.phase).toBe('combat')
    expect(g.wave).toBe(1)
  })

  it('adelantar la oleada paga el tiempo que sobraba', () => {
    const g = new Game({ seed: 'reloj' })
    const before = g.gold
    g.startWave(true)
    expect(g.phase).toBe('combat')
    expect(g.gold).toBe(before + Math.round(FIRST_BUILD_TIME * 2))
  })

  it('entre oleadas el reloj es mas corto que el de la primera', () => {
    const g = new Game({ seed: 'reloj', startGold: 5000 })
    for (const [x, y] of findSpots(g, 6)) g.placeTower(x, y, 'arrow')
    g.startWave()
    let guard = 0
    while (g.phase === 'combat' && guard++ < 60 * 300) g.tick()
    expect(g.phase).toBe('draft')
    g.pickUpgrade(g.offer[0].id)
    expect(g.phase).toBe('build')
    expect(g.buildTimer).toBe(BUILD_TIME)
    expect(BUILD_TIME).toBeLessThan(FIRST_BUILD_TIME)
  })

  it('vender libera la plataforma', () => {
    const g = new Game({ seed: 'test', startGold: 5000 })
    const [spot] = findSpots(g, 1)
    const t = g.placeTower(spot[0], spot[1], 'arrow')!
    expect(g.canPlace(spot[0], spot[1], 'arrow').ok).toBe(false)
    g.sellTower(t.id)
    expect(g.canPlace(spot[0], spot[1], 'arrow').ok).toBe(true)
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
