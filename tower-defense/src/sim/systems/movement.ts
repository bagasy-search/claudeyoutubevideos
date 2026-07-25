import { ENEMIES } from '../balance/enemies'
import type { SimHooks } from '../hooks'
import type { World } from '../world'

const tmp = { x: 0, y: 0 }

/**
 * Avance de enemigos sobre el camino + resolucion de estados (slow, burn).
 * Guarda prevX/prevY antes de mover: el render interpola entre prev y actual.
 */
export function movementSystem(world: World, dt: number, hooks: SimHooks): void {
  const e = world.enemies
  const n = e.capacityUsed
  const pathLen = world.path.length

  for (let i = 0; i < n; i++) {
    if (!e.alive[i]) continue

    e.prevX[i] = e.x[i]
    e.prevY[i] = e.y[i]
    e.prevDist[i] = e.dist[i]

    // Quemadura: dano por tiempo, ignora armadura a proposito (es lo que la hace buena).
    if (e.burnT[i] > 0) {
      e.burnT[i] -= dt
      e.hp[i] -= e.burnDps[i] * dt
      if (e.hp[i] <= 0) {
        hooks.onKill(i, e.bounty[i], e.x[i], e.y[i], e.elite[i] === 1)
        e.kill(i)
        continue
      }
    }

    let speed = e.speed[i]
    if (e.slowT[i] > 0) {
      e.slowT[i] -= dt
      speed *= 1 - e.slowP[i]
      if (e.slowT[i] <= 0) e.slowP[i] = 0
    }

    e.dist[i] += speed * dt
    if (e.dist[i] >= pathLen) {
      const def = ENEMIES[e.defIdx[i]]
      world.path.posAt(pathLen, tmp)
      hooks.onLeak(i, def.leak * (e.elite[i] ? 2 : 1), tmp.x, tmp.y)
      e.kill(i)
      continue
    }

    world.path.posAt(e.dist[i], tmp)
    e.x[i] = tmp.x
    e.y[i] = tmp.y

    if (e.flash[i] > 0) e.flash[i] = Math.max(0, e.flash[i] - dt * 6)
  }
}
