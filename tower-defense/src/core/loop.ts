/**
 * Loop de paso fijo con acumulador.
 * La simulacion siempre avanza en tics de 1/60s (determinista); el render
 * interpola con el `alpha` que devuelve update(). Si el frame cae a 30fps el
 * juego no cambia de velocidad, solo se dibujan menos frames.
 */
export const TICK_RATE = 60
export const TICK_MS = 1000 / TICK_RATE
export const TICK_S = 1 / TICK_RATE

/** Tope de tics por frame: evita la "espiral de la muerte" tras un stutter largo. */
const MAX_STEPS = 5

export class FixedLoop {
  private acc = 0

  /** Corre los tics que correspondan y devuelve alpha en [0,1) para interpolar. */
  update(dtMs: number, step: () => void): number {
    this.acc += Math.min(dtMs, MAX_STEPS * TICK_MS)
    let steps = 0
    while (this.acc >= TICK_MS && steps < MAX_STEPS) {
      step()
      this.acc -= TICK_MS
      steps++
    }
    return this.acc / TICK_MS
  }

  reset(): void {
    this.acc = 0
  }
}
