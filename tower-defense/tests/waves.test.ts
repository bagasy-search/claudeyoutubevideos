import { describe, expect, it } from 'vitest'
import { Rng } from '../src/core/rng'
import { ENEMIES, UNLOCK_WAVE } from '../src/sim/balance/enemies'
import { MAX_SPAWNS, planWave, waveBudget, waveHpMul } from '../src/sim/systems/waves'

describe('generador de oleadas por presupuesto', () => {
  it('el presupuesto y el hp crecen monotonamente', () => {
    for (let w = 1; w < 40; w++) {
      expect(waveBudget(w + 1)).toBeGreaterThan(waveBudget(w))
      expect(waveHpMul(w + 1)).toBeGreaterThan(waveHpMul(w))
    }
  })

  it('nunca mete enemigos que todavia no se desbloquearon', () => {
    for (let w = 1; w <= 9; w++) {
      const plan = planWave(new Rng(w), w)
      for (const e of plan.entries) {
        const def = ENEMIES[e.defIdx]
        expect(UNLOCK_WAVE[def.id] ?? 1).toBeLessThanOrEqual(w)
      }
    }
  })

  it('las oleadas multiplo de 10 traen boss', () => {
    const plan = planWave(new Rng(1), 10)
    expect(plan.isBoss).toBe(true)
    expect(plan.entries.some((e) => ENEMIES[e.defIdx].tags.includes('boss'))).toBe(true)
  })

  it('los spawns estan ordenados en el tiempo y nunca pasan el tope', () => {
    for (let w = 1; w <= 60; w++) {
      const plan = planWave(new Rng(w * 31), w)
      expect(plan.entries.length).toBeGreaterThan(0)
      expect(plan.entries.length).toBeLessThanOrEqual(MAX_SPAWNS + 4) // +boss
      for (let i = 1; i < plan.entries.length; i++) {
        expect(plan.entries[i].time).toBeGreaterThanOrEqual(plan.entries[i - 1].time)
      }
      expect(Number.isFinite(plan.duration)).toBe(true)
    }
  })

  it('al tocar el tope, el presupuesto sobrante se convierte en HP', () => {
    const early = planWave(new Rng(11), 5)
    const late = planWave(new Rng(11), 45)
    expect(early.densityMul).toBeCloseTo(1, 1)
    expect(late.densityMul).toBeGreaterThan(1.5)
    expect(late.entries[0].hpMul).toBeGreaterThan(early.entries[0].hpMul)
  })

  it('la misma seed da la misma oleada', () => {
    const a = planWave(new Rng(4242), 14)
    const b = planWave(new Rng(4242), 14)
    expect(a.entries).toEqual(b.entries)
  })

  it('mas oleada, mas enemigos', () => {
    const small = planWave(new Rng(3), 2).entries.length
    const big = planWave(new Rng(3), 18).entries.length
    expect(big).toBeGreaterThan(small)
  })
})
