import type { SimHooks } from '../hooks'
import type { World } from '../world'

/**
 * Movimiento de proyectiles, colision, dano, splash y estados.
 *
 * Los proyectiles son teledirigidos suaves: giran hacia el objetivo en vez de
 * teletransportarse a el. Si el objetivo muere antes del impacto, siguen recto
 * (y con pierce todavia pueden pegarle a otro) — mucho mejor que evaporarse.
 */
export function projectileSystem(world: World, dt: number, hooks: SimHooks): void {
  const p = world.projectiles
  const e = world.enemies
  const n = p.capacityUsed

  for (let i = 0; i < n; i++) {
    if (!p.alive[i]) continue

    p.life[i] -= dt
    if (p.life[i] <= 0) {
      p.release(i)
      continue
    }

    // Homing: solo si el handle (idx, gen) sigue siendo valido.
    const ti = p.targetIdx[i]
    if (ti >= 0 && e.alive[ti] && e.gen[ti] === p.targetGen[i]) {
      const dx = e.x[ti] - p.x[i]
      const dy = e.y[ti] - p.y[i]
      const d = Math.hypot(dx, dy) || 1
      const desiredX = (dx / d) * p.speed[i]
      const desiredY = (dy / d) * p.speed[i]
      const turn = Math.min(1, dt * 9)
      p.vx[i] += (desiredX - p.vx[i]) * turn
      p.vy[i] += (desiredY - p.vy[i]) * turn
    } else {
      p.targetIdx[i] = -1
    }

    p.prevX[i] = p.x[i]
    p.prevY[i] = p.y[i]
    p.x[i] += p.vx[i] * dt
    p.y[i] += p.vy[i] * dt

    if (p.x[i] < -50 || p.y[i] < -50 || p.x[i] > world.width + 50 || p.y[i] > world.height + 50) {
      p.release(i)
      continue
    }

    // Colision: query al grid en vez de recorrer todos los enemigos.
    let consumed = false
    const hits = p.hitList[i]
    world.grid.query(p.x[i], p.y[i], 24, (j) => {
      if (consumed || !e.alive[j]) return
      if (hits.includes(j)) return
      const dx = e.x[j] - p.x[i]
      const dy = e.y[j] - p.y[i]
      const rr = e.radius[j] + 4
      if (dx * dx + dy * dy > rr * rr) return

      hits.push(j)
      impact(world, i, j, hooks)

      if (p.splash[i] > 0) {
        splash(world, i, p.x[i], p.y[i], hooks)
        consumed = true
        return
      }
      if (p.pierce[i] > 0) p.pierce[i]--
      else consumed = true
    })

    if (consumed) p.release(i)
  }
}

function impact(world: World, pi: number, ei: number, hooks: SimHooks): void {
  const p = world.projectiles
  applyDamage(world, ei, p.damage[pi], p.armorPen[pi], p.crit[pi] === 1, hooks)
  applyStatus(world, ei, p.slowP[pi], p.slowT[pi], p.burnDps[pi], p.burnT[pi])
}

function splash(world: World, pi: number, x: number, y: number, hooks: SimHooks): void {
  const p = world.projectiles
  const e = world.enemies
  const r = p.splash[pi]
  const r2 = r * r
  hooks.onSplash(x, y, r, p.color[pi])
  world.grid.query(x, y, r, (j) => {
    if (!e.alive[j]) return
    const dx = e.x[j] - x
    const dy = e.y[j] - y
    const d2 = dx * dx + dy * dy
    if (d2 > r2) return
    // Falloff lineal: 100% en el centro, 40% en el borde.
    const falloff = 1 - 0.6 * Math.sqrt(d2 / r2)
    applyDamage(world, j, p.damage[pi] * falloff, p.armorPen[pi], false, hooks)
    applyStatus(world, j, p.slowP[pi], p.slowT[pi], p.burnDps[pi], p.burnT[pi])
  })
}

/** Armadura como reduccion plana, con piso de 1 para que nada sea inmune. */
export function applyDamage(
  world: World,
  ei: number,
  raw: number,
  armorPen: number,
  crit: boolean,
  hooks: SimHooks,
): void {
  const e = world.enemies
  if (!e.alive[ei]) return
  const armor = Math.max(0, e.armor[ei] - armorPen)
  const dmg = Math.max(1, raw - armor)
  e.hp[ei] -= dmg
  e.flash[ei] = 1
  hooks.onHit(e.x[ei], e.y[ei], dmg, crit)
  if (e.hp[ei] <= 0) {
    hooks.onKill(ei, e.bounty[ei], e.x[ei], e.y[ei], e.elite[ei] === 1)
    e.kill(ei)
  }
}

function applyStatus(
  world: World,
  ei: number,
  slowP: number,
  slowT: number,
  burnDps: number,
  burnT: number,
): void {
  const e = world.enemies
  if (!e.alive[ei]) return
  // Los estados no se acumulan: se queda el mas fuerte y se refresca la duracion.
  if (slowP > 0 && slowT > 0) {
    if (slowP >= e.slowP[ei]) e.slowP[ei] = slowP
    e.slowT[ei] = Math.max(e.slowT[ei], slowT)
  }
  if (burnDps > 0 && burnT > 0) {
    if (burnDps >= e.burnDps[ei]) e.burnDps[ei] = burnDps
    e.burnT[ei] = Math.max(e.burnT[ei], burnT)
  }
}
