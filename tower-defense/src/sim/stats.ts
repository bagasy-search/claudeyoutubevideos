/**
 * Sistema de stats derivados.
 *
 * Regla de oro: los stats base de una torre son INMUTABLES. Todo lo que hace un
 * upgrade es agregar modificadores a una lista; el stat final se recalcula desde
 * cero cuando esa lista cambia (dirty flag). Nunca `tower.damage += 5`.
 *
 * Orden de aplicacion (estilo Path of Exile):
 *     final = (base + Σflat) * (1 + Σinc) * Π(1 + more)
 *
 * - `flat`: suma plana. Fuerte al principio, se diluye despues.
 * - `inc`:  % aditivo entre si. Es el relleno comun; 10 upgrades de +20% dan +200%.
 * - `more`: % multiplicativo. Es lo raro/legendario, lo que rompe el juego de
 *           forma divertida. Mantener pocos y caros.
 */

export type StatKey =
  | 'damage'
  | 'fireRate'
  | 'range'
  | 'projectiles'
  | 'projectileSpeed'
  | 'splashRadius'
  | 'critChance'
  | 'critMult'
  | 'pierce'
  | 'slowPower'
  | 'slowDuration'
  | 'burnDps'
  | 'burnDuration'
  | 'armorPen'

export type Op = 'flat' | 'inc' | 'more'

export interface Scope {
  /** Solo aplica a este tipo de torre (id). */
  tower?: string
  /** Solo aplica a torres que tengan este tag. */
  tag?: string
}

export interface Modifier {
  stat: StatKey
  op: Op
  value: number
  scope?: Scope
}

export interface Stats {
  damage: number
  /** disparos por segundo */
  fireRate: number
  range: number
  projectiles: number
  projectileSpeed: number
  splashRadius: number
  critChance: number
  critMult: number
  pierce: number
  /** 0..0.85 — fraccion de velocidad que se le quita al enemigo */
  slowPower: number
  slowDuration: number
  burnDps: number
  burnDuration: number
  armorPen: number
}

export interface StatTarget {
  type: string
  tags: readonly string[]
}

const KEYS: readonly StatKey[] = [
  'damage',
  'fireRate',
  'range',
  'projectiles',
  'projectileSpeed',
  'splashRadius',
  'critChance',
  'critMult',
  'pierce',
  'slowPower',
  'slowDuration',
  'burnDps',
  'burnDuration',
  'armorPen',
]

export function emptyStats(): Stats {
  return {
    damage: 0,
    fireRate: 0,
    range: 0,
    projectiles: 1,
    projectileSpeed: 0,
    splashRadius: 0,
    critChance: 0,
    critMult: 1.5,
    pierce: 0,
    slowPower: 0,
    slowDuration: 0,
    burnDps: 0,
    burnDuration: 0,
    armorPen: 0,
  }
}

export function appliesTo(mod: Modifier, target: StatTarget): boolean {
  const s = mod.scope
  if (!s) return true
  if (s.tower && s.tower !== target.type) return false
  if (s.tag && !target.tags.includes(s.tag)) return false
  return true
}

/** Recalcula todos los stats de una torre desde su base + la lista global de mods. */
export function computeStats(
  base: Stats,
  target: StatTarget,
  mods: readonly Modifier[],
): Stats {
  const flat: Record<string, number> = {}
  const inc: Record<string, number> = {}
  const more: Record<string, number> = {}

  for (const m of mods) {
    if (!appliesTo(m, target)) continue
    if (m.op === 'flat') flat[m.stat] = (flat[m.stat] ?? 0) + m.value
    else if (m.op === 'inc') inc[m.stat] = (inc[m.stat] ?? 0) + m.value
    else more[m.stat] = ((more[m.stat] ?? 1) * (1 + m.value))
  }

  const out = { ...base }
  for (const k of KEYS) {
    const v = (base[k] + (flat[k] ?? 0)) * (1 + (inc[k] ?? 0)) * (more[k] ?? 1)
    out[k] = v
  }

  // Clamps y redondeos: sin esto el juego se rompe de la forma no divertida.
  out.projectiles = Math.max(1, Math.round(out.projectiles))
  out.pierce = Math.max(0, Math.round(out.pierce))
  out.critChance = Math.min(1, Math.max(0, out.critChance))
  out.slowPower = Math.min(0.85, Math.max(0, out.slowPower))
  out.fireRate = Math.max(0.05, out.fireRate)
  out.range = Math.max(16, out.range)
  return out
}

/** Para el preview de la carta: "DPS 340 → 512". */
export function dpsOf(s: Stats): number {
  const critAvg = 1 + s.critChance * (s.critMult - 1)
  const hitsPerShot = s.projectiles * (1 + s.pierce)
  return s.damage * s.fireRate * critAvg * hitsPerShot + s.burnDps
}
