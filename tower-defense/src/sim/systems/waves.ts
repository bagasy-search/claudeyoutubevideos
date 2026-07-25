import type { Rng } from '../../core/rng'
import { ENEMIES, UNLOCK_WAVE } from '../balance/enemies'

/**
 * Generador de oleadas por presupuesto.
 *
 * Nada de listas fijas por oleada: cada oleada tiene un budget que crece y se
 * "gasta" comprando enemigos de un catalogo con costos. Escala solo hasta el
 * infinito y se balancea tocando dos numeros.
 */

export interface SpawnEntry {
  defIdx: number
  /** segundos desde el inicio de la oleada */
  time: number
  elite: boolean
  hpMul: number
}

export interface WavePlan {
  wave: number
  entries: SpawnEntry[]
  duration: number
  budget: number
  isBoss: boolean
  /** Multiplicador extra de HP cuando el presupuesto no entra en MAX_SPAWNS. */
  densityMul: number
}

/**
 * Tope de enemigos por oleada. Sin esto, el presupuesto exponencial termina
 * escupiendo 600+ bichos baratos: se muere el framerate y encima se juega peor.
 * El presupuesto que no entra se convierte en HP — la oleada se vuelve mas dura
 * en vez de mas larga.
 */
export const MAX_SPAWNS = 180

export function waveBudget(wave: number): number {
  return 10 * Math.pow(1.18, wave - 1)
}

/** HP superlineal: al principio suave, despues empieza a doler. */
export function waveHpMul(wave: number): number {
  const w = wave - 1
  return 1 + 0.09 * w + 0.004 * w * w
}

export function planWave(rng: Rng, wave: number): WavePlan {
  const budget = waveBudget(wave)
  const hpMul = waveHpMul(wave)
  const isBoss = wave % 10 === 0
  const eliteWave = wave % 5 === 0 && !isBoss

  const available = ENEMIES.map((e, i) => ({ e, i })).filter(
    ({ e }) => (UNLOCK_WAVE[e.id] ?? 1) <= wave && !e.tags.includes('boss'),
  )

  const bought: { defIdx: number; elite: boolean }[] = []
  let left = budget

  if (isBoss) {
    const boss = ENEMIES.findIndex((e) => e.id === 'juggernaut')
    if (boss >= 0) {
      const n = 1 + Math.floor((wave - 10) / 20)
      for (let k = 0; k < n; k++) bought.push({ defIdx: boss, elite: false })
      left -= ENEMIES[boss].cost * n
    }
  }

  const cheapest = Math.min(...available.map(({ e }) => e.cost))
  while (left >= cheapest && bought.length < MAX_SPAWNS) {
    // Sesgo hacia enemigos que "rinden" en la oleada actual, pero con ruido.
    const pickable = available.filter(({ e }) => e.cost <= left)
    const choice = rng.weighted(pickable, ({ e }) => 1 / Math.sqrt(e.cost))
    if (!choice) break
    const elite = eliteWave && rng.chance(0.18)
    bought.push({ defIdx: choice.i, elite })
    left -= choice.e.cost * (elite ? 2 : 1)
  }

  // Lo que no se pudo gastar en cantidad se gasta en calidad.
  const spent = Math.max(1, budget - left)
  const densityMul = budget / spent

  // Agrupar por tipo para que entren en tandas legibles, no en pure noise.
  bought.sort((a, b) => a.defIdx - b.defIdx)
  const entries: SpawnEntry[] = []
  let t = 0
  let lastDef = -1
  for (const b of bought) {
    const def = ENEMIES[b.defIdx]
    if (b.defIdx !== lastDef && lastDef !== -1) t += 1.1
    lastDef = b.defIdx
    /*
     * El hueco se calcula en distancia, no en tiempo: un enemigo lento y gordo
     * necesita mas segundos que uno rapido y flaco para dejar el mismo espacio.
     * Con un hueco fijo los peones salen encimados y se leen como una oruga.
     */
    const spacing = def.radius * 2.8
    const gap = Math.min(1.2, Math.max(0.12, spacing / def.speed))
    t += gap * rng.range(0.85, 1.15)
    entries.push({
      defIdx: b.defIdx,
      time: t,
      elite: b.elite,
      hpMul: hpMul * densityMul * (b.elite ? 4 : 1),
    })
  }
  entries.sort((a, b) => a.time - b.time)

  return { wave, entries, duration: t, budget, isBoss, densityMul }
}
