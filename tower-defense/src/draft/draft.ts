import type { Rng } from '../core/rng'
import { RARITY_ORDER, UPGRADES, rarityWeights } from '../sim/balance/upgrades'
import type { Rarity, UpgradeContext, UpgradeDef } from '../sim/types'

/**
 * El sorteo de las 3 opciones.
 *
 * Un draft "random puro" se siente injusto, no emocionante. Las cuatro reglas
 * que separan un roguelite bueno de uno frustrante:
 *
 *  1. La rareza se sortea ANTES que la carta, con una tabla que escala por oleada.
 *  2. Pity timer: si pasaron N oleadas sin epica+, se fuerza una.
 *  3. Anti-repeticion: baja el peso de lo que se ofrecio y NO se eligio.
 *  4. Garantia de sinergia: al menos 1 de las 3 toca algo que el jugador ya tiene.
 *     Sin esto las builds nunca cuajan y todo se siente aleatorio en el mal sentido.
 */

export const DRAFT_SIZE = 3
/** Oleadas sin epica+ antes de forzar una. */
export const PITY_THRESHOLD = 4
/** Cuantas ofertas atras mira el anti-repeticion. */
export const RECENT_WINDOW = 2
/** Multiplicador de peso para una carta ofrecida-y-descartada hace poco. */
export const RECENT_PENALTY = 0.3

export interface DraftMemory {
  /** Ofertas recientes (ids), la mas nueva primero. */
  recentOffers: string[][]
  /** Oleadas seguidas sin ver epica o legendaria. */
  dryStreak: number
}

export function newDraftMemory(): DraftMemory {
  return { recentOffers: [], dryStreak: 0 }
}

export interface DraftResult {
  options: UpgradeDef[]
  /** Para debug / telemetria de balance. */
  forcedPity: boolean
  forcedSynergy: boolean
}

const RARITY_RANK: Record<Rarity, number> = { common: 0, rare: 1, epic: 2, legendary: 3 }

/** Tags que el jugador "ya tiene": de sus torres y de lo que fue eligiendo. */
export function playerSynergyTags(ctx: UpgradeContext): Set<string> {
  const tags = new Set<string>()
  for (const [id, n] of Object.entries(ctx.towerCounts)) if (n > 0) tags.add(id)
  for (const [tag, n] of Object.entries(ctx.tagCounts)) if (n > 0) tags.add(tag)
  for (const [id, n] of Object.entries(ctx.picks)) {
    if (n <= 0) continue
    const def = UPGRADES.find((u) => u.id === id)
    for (const t of def?.synergyTags ?? []) tags.add(t)
  }
  return tags
}

function isEligible(u: UpgradeDef, ctx: UpgradeContext): boolean {
  if ((ctx.picks[u.id] ?? 0) >= u.maxStacks) return false
  if (u.requires && !u.requires(ctx)) return false
  return true
}

function recentPenalty(id: string, mem: DraftMemory): number {
  const window = mem.recentOffers.slice(0, RECENT_WINDOW)
  return window.some((offer) => offer.includes(id)) ? RECENT_PENALTY : 1
}

function rollRarity(rng: Rng, wave: number, minRank = 0): Rarity {
  const w = rarityWeights(wave)
  const pool = RARITY_ORDER.filter((r) => RARITY_RANK[r] >= minRank)
  return rng.weighted(pool, (r) => w[r]) ?? pool[pool.length - 1]
}

/** Candidatos de una rareza; si no hay, se abre a rarezas vecinas. */
function candidatesFor(
  rarity: Rarity,
  eligible: readonly UpgradeDef[],
  taken: Set<string>,
  excluded: Set<string>,
): UpgradeDef[] {
  const free = eligible.filter((u) => !taken.has(u.id) && !excluded.has(u.id))
  const exact = free.filter((u) => u.rarity === rarity)
  if (exact.length > 0) return exact
  // Fallback: la rareza mas cercana que tenga stock.
  const target = RARITY_RANK[rarity]
  return free
    .slice()
    .sort((a, b) => Math.abs(RARITY_RANK[a.rarity] - target) - Math.abs(RARITY_RANK[b.rarity] - target))
    .filter((u, _i, arr) => Math.abs(RARITY_RANK[u.rarity] - target) === Math.abs(RARITY_RANK[arr[0].rarity] - target))
}

export function rollDraft(
  rng: Rng,
  ctx: UpgradeContext,
  mem: DraftMemory,
  size = DRAFT_SIZE,
  pool: readonly UpgradeDef[] = UPGRADES,
): DraftResult {
  const eligible = pool.filter((u) => isEligible(u, ctx))
  const taken = new Set<string>()
  const excluded = new Set<string>()
  const options: UpgradeDef[] = []

  const pityDue = mem.dryStreak >= PITY_THRESHOLD
  let forcedPity = false

  for (let slot = 0; slot < size; slot++) {
    // Regla 2: el primer slot se fuerza a epica+ si el pity vencio.
    const minRank = slot === 0 && pityDue ? RARITY_RANK.epic : 0
    const rarity = rollRarity(rng, ctx.wave, minRank)
    const cands = candidatesFor(rarity, eligible, taken, excluded)
    if (cands.length === 0) break

    // Regla 3: el anti-repeticion entra como multiplicador de peso, no como veto.
    const chosen = rng.weighted(cands, (u) => u.weight * recentPenalty(u.id, mem))
    if (!chosen) break

    options.push(chosen)
    taken.add(chosen.id)
    for (const ex of chosen.excludes ?? []) excluded.add(ex)
    if (slot === 0 && pityDue && RARITY_RANK[chosen.rarity] >= RARITY_RANK.epic) forcedPity = true
  }

  // Regla 4: garantia de sinergia.
  const myTags = playerSynergyTags(ctx)
  const hasSynergy = options.some((u) => (u.synergyTags ?? []).some((t) => myTags.has(t)))
  let forcedSynergy = false
  if (!hasSynergy && options.length > 0 && myTags.size > 0) {
    const replaceIdx = options.length - 1
    const removed = options[replaceIdx]
    const takenWithout = new Set(taken)
    takenWithout.delete(removed.id)
    const synergyCands = eligible.filter(
      (u) =>
        !takenWithout.has(u.id) &&
        !excluded.has(u.id) &&
        (u.synergyTags ?? []).some((t) => myTags.has(t)),
    )
    // El swap tiene que respetar la curva de rarezas: si entra "a mano",
    // se cuelan legendarias en la oleada 1 (donde su peso deberia ser 0).
    const rw = rarityWeights(ctx.wave)
    const swap = rng.weighted(
      synergyCands,
      (u) => u.weight * rw[u.rarity] * recentPenalty(u.id, mem),
    )
    if (swap) {
      options[replaceIdx] = swap
      forcedSynergy = true
    }
  }

  return { options, forcedPity, forcedSynergy }
}

/** Se llama al cerrar el draft, con la carta elegida (o null si hubo reroll). */
export function commitOffer(mem: DraftMemory, offered: readonly UpgradeDef[], picked: UpgradeDef | null): void {
  mem.recentOffers.unshift(offered.map((u) => u.id))
  if (mem.recentOffers.length > 6) mem.recentOffers.length = 6
  if (picked && RARITY_RANK[picked.rarity] >= RARITY_RANK.epic) mem.dryStreak = 0
  else mem.dryStreak++
}
