import { describe, expect, it } from 'vitest'
import { Rng, seedFromString } from '../src/core/rng'

describe('rng semillado', () => {
  it('la misma seed da la misma secuencia', () => {
    const a = new Rng(1234)
    const b = new Rng(1234)
    const seqA = Array.from({ length: 50 }, () => a.next())
    const seqB = Array.from({ length: 50 }, () => b.next())
    expect(seqA).toEqual(seqB)
  })

  it('seeds distintas divergen', () => {
    const a = new Rng(1)
    const b = new Rng(2)
    expect(a.next()).not.toBe(b.next())
  })

  it('guardar y restaurar el estado reproduce la secuencia', () => {
    const r = new Rng(99)
    r.next()
    r.next()
    const saved = r.state
    const expected = [r.next(), r.next(), r.next()]
    r.state = saved
    expect([r.next(), r.next(), r.next()]).toEqual(expected)
  })

  it('los valores caen en [0,1)', () => {
    const r = new Rng(7)
    for (let i = 0; i < 2000; i++) {
      const v = r.next()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })

  it('la distribucion no esta sesgada groseramente', () => {
    const r = new Rng(42)
    let sum = 0
    const n = 20000
    for (let i = 0; i < n; i++) sum += r.next()
    expect(sum / n).toBeGreaterThan(0.47)
    expect(sum / n).toBeLessThan(0.53)
  })

  it('weighted respeta los pesos', () => {
    const r = new Rng(5)
    const items = ['a', 'b']
    let countA = 0
    for (let i = 0; i < 10000; i++) {
      if (r.weighted(items, (x) => (x === 'a' ? 9 : 1)) === 'a') countA++
    }
    expect(countA / 10000).toBeGreaterThan(0.86)
    expect(countA / 10000).toBeLessThan(0.94)
  })

  it('weighted devuelve null si todos los pesos son cero', () => {
    expect(new Rng(1).weighted(['a', 'b'], () => 0)).toBeNull()
  })

  it('seedFromString es estable', () => {
    expect(seedFromString('run-1')).toBe(seedFromString('run-1'))
    expect(seedFromString('run-1')).not.toBe(seedFromString('run-2'))
  })
})
