import type { Rng } from '../../core/rng'
import type { SimHooks } from '../hooks'
import type { World } from '../world'

/**
 * Targeting + disparo.
 *
 * Politica de targeting: "first" (el que va mas adelante en el camino). Como
 * los enemigos guardan `dist`, es simplemente el maximo dist dentro del rango —
 * gratis, sin ordenar nada. Cambiar a last/strongest/closest es una linea.
 */
export function towerSystem(world: World, dt: number, rng: Rng, hooks: SimHooks): void {
  const e = world.enemies

  for (const t of world.towers) {
    t.prevAngle = t.angle
    if (t.recoil > 0) t.recoil = Math.max(0, t.recoil - dt * 8)
    t.cooldown -= dt

    // Buscar objetivo aunque no pueda disparar: la torre igual apunta (se ve vivo).
    let best = -1
    let bestDist = -1
    const r2 = t.stats.range * t.stats.range
    world.grid.query(t.x, t.y, t.stats.range, (i) => {
      if (!e.alive[i]) return
      const dx = e.x[i] - t.x
      const dy = e.y[i] - t.y
      if (dx * dx + dy * dy > r2) return
      if (e.dist[i] > bestDist) {
        bestDist = e.dist[i]
        best = i
      }
    })

    if (best < 0) continue

    const targetAngle = Math.atan2(e.y[best] - t.y, e.x[best] - t.x)
    t.angle = rotateToward(t.angle, targetAngle, dt * 10)

    if (t.cooldown > 0) continue
    t.cooldown = 1 / t.stats.fireRate
    t.recoil = 1
    hooks.onFire(t)
    fire(world, t, best, rng)
  }
}

function rotateToward(from: number, to: number, maxStep: number): number {
  let diff = ((to - from + Math.PI * 3) % (Math.PI * 2)) - Math.PI
  if (Math.abs(diff) <= maxStep) return to
  diff = Math.sign(diff) * maxStep
  return from + diff
}

function fire(world: World, t: World['towers'][number], targetIdx: number, rng: Rng): void {
  const p = world.projectiles
  const e = world.enemies
  const s = t.stats
  const kindByShot = { bolt: 0, shell: 1, shard: 2 } as const

  const baseAngle = Math.atan2(e.y[targetIdx] - t.y, e.x[targetIdx] - t.x)
  const spread = 0.13

  for (let k = 0; k < s.projectiles; k++) {
    const idx = p.alloc()
    if (idx < 0) return

    // El critico se decide al disparar, no al impactar: asi el proyectil ya
    // sale con su color y el feedback visual es honesto.
    const crit = rng.chance(s.critChance)
    const offset = s.projectiles === 1 ? 0 : (k - (s.projectiles - 1) / 2) * spread
    const a = baseAngle + offset

    p.x[idx] = t.x + Math.cos(a) * 14
    p.y[idx] = t.y + Math.sin(a) * 14
    p.prevX[idx] = p.x[idx]
    p.prevY[idx] = p.y[idx]
    p.speed[idx] = s.projectileSpeed
    p.vx[idx] = Math.cos(a) * s.projectileSpeed
    p.vy[idx] = Math.sin(a) * s.projectileSpeed
    p.damage[idx] = s.damage * (crit ? s.critMult : 1)
    p.crit[idx] = crit ? 1 : 0
    p.splash[idx] = s.splashRadius
    p.pierce[idx] = s.pierce
    p.slowP[idx] = s.slowPower
    p.slowT[idx] = s.slowDuration
    p.burnDps[idx] = s.burnDps
    p.burnT[idx] = s.burnDuration
    p.armorPen[idx] = s.armorPen
    p.targetIdx[idx] = targetIdx
    p.targetGen[idx] = e.gen[targetIdx]
    p.life[idx] = 2.5
    p.color[idx] = t.color
    p.kind[idx] = kindByShot[t.shot]
  }
}
