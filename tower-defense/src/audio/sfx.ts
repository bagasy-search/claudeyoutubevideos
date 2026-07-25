/**
 * Efectos de sonido sintetizados con WebAudio.
 *
 * Cero archivos: todo se genera con osciladores y ruido. Es la contraparte
 * sonora del arte procedural, con una diferencia importante — en audio el techo
 * es MUCHO mas alto. Un disparo, un impacto o un golpe seco son ruido filtrado
 * con una envolvente, y eso sintetizado suena bien de verdad. Nadie extraña un
 * .wav para un blip.
 *
 * Reglas que hacen que no moleste:
 *  - Limite de voces simultaneas: con 30 torres disparando, sin tope satura y
 *    se convierte en un zumbido.
 *  - Un mismo evento repetido muy seguido se descarta (debounce por tipo).
 *  - Cada disparo varia de tono un poco: dos sonidos identicos seguidos se
 *    perciben como un glitch, no como dos disparos.
 */

const MAX_VOICES = 14
/** Un mismo tipo de evento no suena dos veces en menos de esto. */
const DEBOUNCE_MS = 28

export class Sfx {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private noiseBuffer: AudioBuffer | null = null
  private voices = 0
  private lastAt = new Map<string, number>()

  enabled = true
  volume = 0.35

  /**
   * Los navegadores no dejan sonar nada antes de una interaccion del usuario,
   * asi que el contexto se crea perezosamente en el primer evento real.
   */
  private ensure(): boolean {
    if (!this.enabled) return false
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return false
      this.ctx = new Ctor()
      this.master = this.ctx.createGain()
      this.master.gain.value = this.volume
      this.master.connect(this.ctx.destination)
      this.noiseBuffer = this.makeNoise(this.ctx)
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
    return this.ctx.state !== 'closed'
  }

  private makeNoise(ctx: AudioContext): AudioBuffer {
    const len = Math.floor(ctx.sampleRate * 0.6)
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    return buf
  }

  private canPlay(key: string): boolean {
    if (!this.ensure()) return false
    if (this.voices >= MAX_VOICES) return false
    const now = performance.now()
    const last = this.lastAt.get(key) ?? -Infinity
    if (now - last < DEBOUNCE_MS) return false
    this.lastAt.set(key, now)
    return true
  }

  private hold(seconds: number): void {
    this.voices++
    window.setTimeout(() => this.voices--, seconds * 1000 + 40)
  }

  /** Tono con envolvente. `bend` desliza la frecuencia, que es lo que da caracter. */
  private tone(opts: {
    freq: number
    bend?: number
    type?: OscillatorType
    attack?: number
    decay: number
    gain?: number
  }): void {
    const ctx = this.ctx!
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const env = ctx.createGain()
    osc.type = opts.type ?? 'square'
    osc.frequency.setValueAtTime(opts.freq, t)
    if (opts.bend) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(30, opts.freq * opts.bend), t + opts.decay)
    }
    const peak = opts.gain ?? 0.3
    const attack = opts.attack ?? 0.005
    env.gain.setValueAtTime(0.0001, t)
    env.gain.exponentialRampToValueAtTime(peak, t + attack)
    env.gain.exponentialRampToValueAtTime(0.0001, t + opts.decay)
    osc.connect(env).connect(this.master!)
    osc.start(t)
    osc.stop(t + opts.decay + 0.02)
    this.hold(opts.decay)
  }

  /** Ruido filtrado: la base de impactos, explosiones y pasos. */
  private noise(opts: { decay: number; freq: number; q?: number; gain?: number; type?: BiquadFilterType }): void {
    const ctx = this.ctx!
    const t = ctx.currentTime
    const src = ctx.createBufferSource()
    src.buffer = this.noiseBuffer!
    const filter = ctx.createBiquadFilter()
    filter.type = opts.type ?? 'bandpass'
    filter.frequency.setValueAtTime(opts.freq, t)
    filter.Q.value = opts.q ?? 1
    const env = ctx.createGain()
    env.gain.setValueAtTime(opts.gain ?? 0.3, t)
    env.gain.exponentialRampToValueAtTime(0.0001, t + opts.decay)
    src.connect(filter).connect(env).connect(this.master!)
    src.start(t)
    src.stop(t + opts.decay + 0.02)
    this.hold(opts.decay)
  }

  private vary(base: number, amount = 0.08): number {
    return base * (1 + (Math.random() * 2 - 1) * amount)
  }

  // ------------------------------------------------------------- eventos

  shoot(kind: 'bolt' | 'shell' | 'shard'): void {
    if (!this.canPlay(`shoot:${kind}`)) return
    if (kind === 'shell') {
      this.tone({ freq: this.vary(150), bend: 0.4, type: 'triangle', decay: 0.14, gain: 0.32 })
      this.noise({ freq: this.vary(700), decay: 0.1, q: 0.7, gain: 0.18 })
    } else if (kind === 'shard') {
      this.tone({ freq: this.vary(1300), bend: 1.5, type: 'sine', decay: 0.11, gain: 0.16 })
    } else {
      this.tone({ freq: this.vary(560), bend: 0.55, type: 'square', decay: 0.07, gain: 0.14 })
    }
  }

  hit(crit: boolean): void {
    if (!this.canPlay(crit ? 'crit' : 'hit')) return
    if (crit) {
      this.tone({ freq: this.vary(880), bend: 1.9, type: 'sine', decay: 0.16, gain: 0.26 })
      this.noise({ freq: 2600, decay: 0.1, q: 1.4, gain: 0.16 })
    } else {
      this.noise({ freq: this.vary(1500), decay: 0.05, q: 1.2, gain: 0.1 })
    }
  }

  death(elite: boolean): void {
    if (!this.canPlay(elite ? 'deathElite' : 'death')) return
    this.noise({ freq: elite ? 300 : 520, decay: elite ? 0.36 : 0.16, q: 0.6, gain: elite ? 0.34 : 0.18 })
    this.tone({ freq: this.vary(elite ? 180 : 300), bend: 0.35, type: 'sawtooth', decay: elite ? 0.3 : 0.13, gain: 0.14 })
  }

  splash(): void {
    if (!this.canPlay('splash')) return
    this.noise({ freq: 380, decay: 0.28, q: 0.5, gain: 0.3, type: 'lowpass' })
    this.tone({ freq: 90, bend: 0.4, type: 'sine', decay: 0.26, gain: 0.3 })
  }

  /** Una fuga tiene que doler al oido, no solo a la barra de vidas. */
  leak(): void {
    if (!this.canPlay('leak')) return
    this.tone({ freq: 320, bend: 0.45, type: 'sawtooth', decay: 0.5, gain: 0.34 })
    this.noise({ freq: 220, decay: 0.4, q: 0.4, gain: 0.22, type: 'lowpass' })
  }

  build(): void {
    if (!this.canPlay('build')) return
    this.tone({ freq: 320, bend: 1.6, type: 'triangle', decay: 0.14, gain: 0.26 })
  }

  sell(): void {
    if (!this.canPlay('sell')) return
    this.tone({ freq: 520, bend: 0.5, type: 'triangle', decay: 0.16, gain: 0.22 })
  }

  denied(): void {
    if (!this.canPlay('denied')) return
    this.tone({ freq: 180, type: 'square', decay: 0.1, gain: 0.18 })
  }

  waveStart(): void {
    if (!this.canPlay('wave')) return
    // Dos notas ascendentes: senal clara de "arranca", sin melodia.
    this.tone({ freq: 330, type: 'triangle', decay: 0.16, gain: 0.24 })
    window.setTimeout(() => {
      if (this.ensure()) this.tone({ freq: 495, type: 'triangle', decay: 0.22, gain: 0.24 })
    }, 110)
  }

  waveClear(): void {
    if (!this.canPlay('clear')) return
    const notes = [523, 659, 784]
    notes.forEach((f, i) => {
      window.setTimeout(() => {
        if (this.ensure()) this.tone({ freq: f, type: 'triangle', decay: 0.26, gain: 0.2 })
      }, i * 90)
    })
  }

  cardPick(): void {
    if (!this.canPlay('card')) return
    this.tone({ freq: 700, bend: 1.5, type: 'sine', decay: 0.2, gain: 0.24 })
  }

  gameOver(): void {
    if (!this.canPlay('over')) return
    const notes = [392, 330, 262]
    notes.forEach((f, i) => {
      window.setTimeout(() => {
        if (this.ensure()) this.tone({ freq: f, type: 'sawtooth', decay: 0.45, gain: 0.22 })
      }, i * 160)
    })
  }

  setEnabled(on: boolean): void {
    this.enabled = on
    if (this.master) this.master.gain.value = on ? this.volume : 0
  }
}

export const sfx = new Sfx()
