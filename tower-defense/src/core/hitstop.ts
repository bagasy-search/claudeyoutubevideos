/**
 * Hit-stop: la pausa brevisima al conectar un golpe.
 *
 * Es lo mas rentable de toda la lista de juice — cuesta casi nada y es lo que
 * convierte un impacto en un GOLPE. Pero no es una pausa binaria: el modelo del
 * original ("Juice it or lose it") es una envolvente de cuatro fases sobre la
 * escala de tiempo.
 *
 *     entrada -> sostenido (a velocidad reducida) -> salida -> normal
 *
 * Congelar de golpe y soltar de golpe se siente como un tiron de framerate. La
 * rampa es lo que le da peso.
 *
 * Dos reglas que importan en un tower defense:
 *
 *  - Los pedidos se COMBINAN POR MAXIMO, nunca se suman. Con veinte torres
 *    disparando, sumar deja el juego en cámara lenta permanente.
 *  - Solo se frena la SIMULACION. La entrada del jugador nunca se congela.
 */

export interface HitstopRequest {
  /** Cuanto dura el sostenido, en segundos. */
  duration: number
  /** 0 = congelado del todo; 0.1-0.3 = camara lenta. */
  speed: number
  fadeIn?: number
  fadeOut?: number
}

/** Valores medidos, del mas leve al mas contundente. */
export const HITSTOP = {
  crit: { duration: 0.09, speed: 0, fadeOut: 0.06 },
  death: { duration: 0.055, speed: 0, fadeOut: 0.04 },
  elite: { duration: 0.16, speed: 0.05, fadeIn: 0.02, fadeOut: 0.1 },
  leak: { duration: 0.09, speed: 0, fadeOut: 0.05 },
} as const satisfies Record<string, HitstopRequest>

export class Hitstop {
  private t = 0
  private req: Required<HitstopRequest> | null = null

  /** Intensidad global, 0..1. A 0 el efecto queda desactivado del todo. */
  intensity = 1

  request(r: HitstopRequest): void {
    if (this.intensity <= 0) return
    const next: Required<HitstopRequest> = {
      duration: r.duration * this.intensity,
      speed: r.speed,
      fadeIn: (r.fadeIn ?? 0) * this.intensity,
      fadeOut: (r.fadeOut ?? 0) * this.intensity,
    }
    // Por maximo, no acumulando: si ya hay uno mas fuerte en curso, se respeta.
    if (this.req && this.total(this.req) - this.t > this.total(next)) return
    this.req = next
    this.t = 0
  }

  private total(r: Required<HitstopRequest>): number {
    return r.fadeIn + r.duration + r.fadeOut
  }

  /**
   * Avanza la envolvente y devuelve la escala de tiempo para este frame.
   * @param dt segundos reales transcurridos
   */
  update(dt: number): number {
    const r = this.req
    if (!r) return 1
    this.t += dt
    let t = this.t
    if (t < r.fadeIn) return lerp(1, r.speed, t / r.fadeIn)
    t -= r.fadeIn
    if (t < r.duration) return r.speed
    t -= r.duration
    if (t < r.fadeOut) return lerp(r.speed, 1, t / r.fadeOut)
    this.req = null
    return 1
  }

  get active(): boolean {
    return this.req !== null
  }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}
