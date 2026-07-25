/**
 * RNG semillado (mulberry32). Toda la aleatoriedad de la simulacion y del draft
 * pasa por aca: la seed va en el save, asi que una run es 100% reproducible.
 * Nunca usar Math.random() dentro de /sim ni de /draft.
 */
export class Rng {
  private s: number

  constructor(seed: number) {
    this.s = seed >>> 0
  }

  /** [0, 1) */
  next(): number {
    this.s = (this.s + 0x6d2b79f5) >>> 0
    let t = this.s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  /** entero en [0, maxExcl) */
  int(maxExcl: number): number {
    return Math.floor(this.next() * maxExcl)
  }

  /** float en [a, b) */
  range(a: number, b: number): number {
    return a + this.next() * (b - a)
  }

  chance(p: number): boolean {
    return this.next() < p
  }

  pick<T>(arr: readonly T[]): T {
    return arr[this.int(arr.length)]
  }

  /** Sorteo por peso. Devuelve null si todos los pesos son 0 o el array esta vacio. */
  weighted<T>(items: readonly T[], weightOf: (item: T) => number): T | null {
    let total = 0
    for (const it of items) total += Math.max(0, weightOf(it))
    if (total <= 0) return null
    let roll = this.next() * total
    // `last` es el ultimo item con peso > 0: el fallback por error de coma
    // flotante NUNCA debe devolver algo de peso 0 (si no, aparecen legendarias
    // en la oleada 1, donde su peso es exactamente 0).
    let last: T | null = null
    for (const it of items) {
      const w = Math.max(0, weightOf(it))
      if (w > 0) last = it
      roll -= w
      if (roll < 0 && w > 0) return it
    }
    return last
  }

  /** Serializacion para el save / replays. */
  get state(): number {
    return this.s
  }

  set state(v: number) {
    this.s = v >>> 0
  }

  fork(salt: number): Rng {
    return new Rng((this.s ^ Math.imul(salt, 0x9e3779b9)) >>> 0)
  }
}

export function seedFromString(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
