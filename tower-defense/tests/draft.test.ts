import { describe, expect, it } from 'vitest'
import { Rng } from '../src/core/rng'
import {
  DRAFT_SIZE,
  PITY_THRESHOLD,
  commitOffer,
  newDraftMemory,
  playerSynergyTags,
  rollDraft,
} from '../src/draft/draft'
import { UPGRADES } from '../src/sim/balance/upgrades'
import type { UpgradeContext, UpgradeDef } from '../src/sim/types'

function ctx(over: Partial<UpgradeContext> = {}): UpgradeContext {
  return {
    wave: 5,
    towerCounts: { arrow: 2 },
    tagCounts: { physical: 2, single: 2, fast: 2 },
    picks: {},
    gold: 200,
    ...over,
  }
}

describe('reglas basicas del draft', () => {
  it('ofrece exactamente 3 cartas distintas', () => {
    for (let seed = 0; seed < 60; seed++) {
      const res = rollDraft(new Rng(seed), ctx(), newDraftMemory())
      expect(res.options).toHaveLength(DRAFT_SIZE)
      expect(new Set(res.options.map((o) => o.id)).size).toBe(DRAFT_SIZE)
    }
  })

  it('nunca ofrece una carta que llego a su maximo de stacks', () => {
    const picks: Record<string, number> = {}
    for (const u of UPGRADES) if (u.maxStacks !== Infinity) picks[u.id] = u.maxStacks
    for (let seed = 0; seed < 40; seed++) {
      const res = rollDraft(new Rng(seed), ctx({ picks }), newDraftMemory())
      for (const o of res.options) expect(o.maxStacks).toBe(Infinity)
    }
  })

  it('no ofrece cartas cuyo prerequisito no se cumple', () => {
    // Sin torres construidas: nada que dependa de tener torres puede salir.
    const c = ctx({ wave: 1, towerCounts: {}, tagCounts: {} })
    for (let seed = 0; seed < 80; seed++) {
      const res = rollDraft(new Rng(seed), c, newDraftMemory())
      for (const o of res.options) {
        if (o.requires) expect(o.requires(c)).toBe(true)
      }
    }
  })

  it('respeta las exclusiones mutuas dentro de la misma oferta', () => {
    for (let seed = 0; seed < 200; seed++) {
      const res = rollDraft(new Rng(seed), ctx({ wave: 20 }), newDraftMemory())
      const ids = new Set(res.options.map((o) => o.id))
      for (const o of res.options) {
        for (const ex of o.excludes ?? []) expect(ids.has(ex)).toBe(false)
      }
    }
  })
})

describe('escalado de rareza por oleada', () => {
  it('las legendarias no aparecen en la oleada 1 y si aparecen tarde', () => {
    const early = countRarity(1, 300)
    const late = countRarity(25, 300)
    expect(early.legendary).toBe(0)
    expect(late.legendary).toBeGreaterThan(0)
    expect(late.common).toBeLessThan(early.common)
  })
})

function countRarity(wave: number, runs: number) {
  const acc: Record<string, number> = { common: 0, rare: 0, epic: 0, legendary: 0 }
  for (let seed = 0; seed < runs; seed++) {
    // Contexto rico para que ninguna carta quede filtrada por prerequisitos.
    const c = ctx({
      wave,
      towerCounts: { arrow: 3, cannon: 3, frost: 3 },
      tagCounts: { physical: 6, fast: 3, frost: 3, splash: 3, control: 3, elemental: 3, single: 3, slow: 3 },
      picks: { keen_eye: 1 },
    })
    for (const o of rollDraft(new Rng(seed * 7919 + 13), c, newDraftMemory()).options) {
      acc[o.rarity]++
    }
  }
  return acc
}

describe('pity timer', () => {
  it('fuerza epica o legendaria cuando se acumulan oleadas secas', () => {
    const mem = newDraftMemory()
    mem.dryStreak = PITY_THRESHOLD
    let forced = 0
    for (let seed = 0; seed < 100; seed++) {
      const m = { ...newDraftMemory(), dryStreak: PITY_THRESHOLD }
      const res = rollDraft(new Rng(seed), ctx({ wave: 6 }), m)
      const best = res.options.some((o) => o.rarity === 'epic' || o.rarity === 'legendary')
      if (best) forced++
    }
    expect(forced).toBe(100)
  })

  it('commitOffer resetea la racha al elegir epica+ y la sube si no', () => {
    const mem = newDraftMemory()
    mem.dryStreak = 3
    const epic = UPGRADES.find((u) => u.rarity === 'epic')!
    commitOffer(mem, [epic], epic)
    expect(mem.dryStreak).toBe(0)

    const common = UPGRADES.find((u) => u.rarity === 'common')!
    commitOffer(mem, [common], common)
    expect(mem.dryStreak).toBe(1)
  })
})

describe('anti-repeticion', () => {
  it('lo ofrecido y descartado aparece menos en las tiradas siguientes', () => {
    const c = ctx({ wave: 12 })
    let repeats = 0
    let baseline = 0
    for (let seed = 0; seed < 400; seed++) {
      const rng = new Rng(seed)
      const mem = newDraftMemory()
      const first = rollDraft(rng, c, mem)
      commitOffer(mem, first.options, null)
      const second = rollDraft(rng, c, mem)
      repeats += second.options.filter((o) => first.options.some((f) => f.id === o.id)).length

      const rng2 = new Rng(seed)
      const memFresh = newDraftMemory()
      const a = rollDraft(rng2, c, memFresh)
      const b = rollDraft(rng2, c, newDraftMemory())
      baseline += b.options.filter((o) => a.options.some((f) => f.id === o.id)).length
    }
    expect(repeats).toBeLessThan(baseline)
  })
})

describe('garantia de sinergia', () => {
  it('al menos una opcion toca algo que el jugador ya tiene', () => {
    const c = ctx({
      wave: 9,
      towerCounts: { frost: 3 },
      tagCounts: { frost: 3, elemental: 3, control: 3 },
      picks: { cold_snap: 2 },
    })
    const mine = playerSynergyTags(c)
    let ok = 0
    const runs = 150
    for (let seed = 0; seed < runs; seed++) {
      const res = rollDraft(new Rng(seed), c, newDraftMemory())
      if (res.options.some((o: UpgradeDef) => (o.synergyTags ?? []).some((t) => mine.has(t)))) ok++
    }
    expect(ok).toBe(runs)
  })
})

describe('determinismo', () => {
  it('la misma seed produce la misma oferta', () => {
    const a = rollDraft(new Rng(777), ctx(), newDraftMemory())
    const b = rollDraft(new Rng(777), ctx(), newDraftMemory())
    expect(a.options.map((o) => o.id)).toEqual(b.options.map((o) => o.id))
  })
})
