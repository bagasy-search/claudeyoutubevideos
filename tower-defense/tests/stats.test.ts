import { describe, expect, it } from 'vitest'
import { computeStats, dpsOf, emptyStats, type Modifier } from '../src/sim/stats'

const target = { type: 'arrow', tags: ['physical', 'fast'] }

function base() {
  return { ...emptyStats(), damage: 10, fireRate: 1, range: 100 }
}

describe('orden de aplicacion de modificadores', () => {
  it('flat suma antes que los porcentajes', () => {
    const mods: Modifier[] = [
      { stat: 'damage', op: 'flat', value: 10 },
      { stat: 'damage', op: 'inc', value: 1 },
    ]
    // (10 + 10) * (1 + 1) = 40
    expect(computeStats(base(), target, mods).damage).toBe(40)
  })

  it('los inc se suman entre si, los more se multiplican', () => {
    const incs: Modifier[] = [
      { stat: 'damage', op: 'inc', value: 0.5 },
      { stat: 'damage', op: 'inc', value: 0.5 },
    ]
    const mores: Modifier[] = [
      { stat: 'damage', op: 'more', value: 0.5 },
      { stat: 'damage', op: 'more', value: 0.5 },
    ]
    expect(computeStats(base(), target, incs).damage).toBe(20) // 10 * (1 + 1)
    expect(computeStats(base(), target, mores).damage).toBeCloseTo(22.5) // 10 * 1.5 * 1.5
  })

  it('recalcular desde base es idempotente (no muta el base)', () => {
    const b = base()
    const mods: Modifier[] = [{ stat: 'damage', op: 'inc', value: 0.5 }]
    computeStats(b, target, mods)
    computeStats(b, target, mods)
    expect(b.damage).toBe(10)
    expect(computeStats(b, target, mods).damage).toBe(15)
  })
})

describe('scopes', () => {
  it('respeta el scope por tipo de torre', () => {
    const mods: Modifier[] = [{ stat: 'damage', op: 'inc', value: 1, scope: { tower: 'cannon' } }]
    expect(computeStats(base(), target, mods).damage).toBe(10)
    expect(computeStats(base(), { type: 'cannon', tags: [] }, mods).damage).toBe(20)
  })

  it('respeta el scope por tag', () => {
    const mods: Modifier[] = [{ stat: 'damage', op: 'inc', value: 1, scope: { tag: 'physical' } }]
    expect(computeStats(base(), target, mods).damage).toBe(20)
    expect(computeStats(base(), { type: 'frost', tags: ['elemental'] }, mods).damage).toBe(10)
  })
})

describe('clamps', () => {
  it('el critico no pasa de 100% y la ralentizacion no llega a detener', () => {
    const s = computeStats(base(), target, [
      { stat: 'critChance', op: 'flat', value: 5 },
      { stat: 'slowPower', op: 'flat', value: 5 },
    ])
    expect(s.critChance).toBe(1)
    expect(s.slowPower).toBe(0.85)
  })

  it('los proyectiles siempre son enteros >= 1', () => {
    const s = computeStats(base(), target, [{ stat: 'projectiles', op: 'inc', value: 0.4 }])
    expect(Number.isInteger(s.projectiles)).toBe(true)
    expect(s.projectiles).toBeGreaterThanOrEqual(1)
  })
})

describe('dps', () => {
  it('sube con cadencia, dano, crit y proyectiles', () => {
    const b = base()
    const plain = dpsOf(computeStats(b, target, []))
    const better = dpsOf(
      computeStats(b, target, [
        { stat: 'fireRate', op: 'inc', value: 1 },
        { stat: 'critChance', op: 'flat', value: 0.5 },
      ]),
    )
    expect(better).toBeGreaterThan(plain)
  })
})
