/**
 * Paleta y modelo de color.
 *
 * Dos decisiones que separan esto de "oscurecer y aclarar":
 *
 * 1. **Las mezclas van en luz lineal, no en sRGB.** Interpolar bytes sRGB
 *    directamente atraviesa la curva gamma y ensucia los medios tonos: un rojo
 *    saturado oscurecido asi se va a marron en vez de quedarse rojo. Se
 *    convierte a lineal, se mezcla, y se vuelve.
 *
 * 2. **Las sombras cambian de tono, no solo de valor.** Una sombra real recibe
 *    luz ambiente del cielo, asi que se enfria y gana saturacion; una luz
 *    directa se acerca al color de la fuente y pierde un poco de croma. Bajar
 *    el brillo sin mover el tono es la causa numero uno de que un dibujo se vea
 *    plano y de plastico.
 */

// ------------------------------------------------------------ conversiones

function srgbToLinear(c: number): number {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

function linearToSrgb(v: number): number {
  const c = v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055
  return Math.min(255, Math.max(0, Math.round(c * 255)))
}

function unpack(color: number): [number, number, number] {
  return [(color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff]
}

function pack(r: number, g: number, b: number): number {
  return (r << 16) | (g << 8) | b
}

export interface Hsl {
  h: number
  s: number
  l: number
}

export function toHsl(color: number): Hsl {
  const [r8, g8, b8] = unpack(color)
  const r = r8 / 255
  const g = g8 / 255
  const b = b8 / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h: number
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60
  else if (max === g) h = ((b - r) / d + 2) * 60
  else h = ((r - g) / d + 4) * 60
  return { h, s, l }
}

export function fromHsl({ h, s, l }: Hsl): number {
  const hue = ((h % 360) + 360) % 360
  const sat = Math.min(1, Math.max(0, s))
  const lit = Math.min(1, Math.max(0, l))
  if (sat === 0) {
    const v = Math.round(lit * 255)
    return pack(v, v, v)
  }
  const q = lit < 0.5 ? lit * (1 + sat) : lit + sat - lit * sat
  const p = 2 * lit - q
  const channel = (t: number): number => {
    let x = t
    if (x < 0) x += 1
    if (x > 1) x -= 1
    if (x < 1 / 6) return p + (q - p) * 6 * x
    if (x < 1 / 2) return q
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6
    return p
  }
  const hk = hue / 360
  return pack(
    Math.round(channel(hk + 1 / 3) * 255),
    Math.round(channel(hk) * 255),
    Math.round(channel(hk - 1 / 3) * 255),
  )
}

// ------------------------------------------------------------------ mezcla

/** Interpolacion en luz lineal. Es la mezcla correcta, no la de bytes sRGB. */
export function mix(a: number, b: number, t: number): number {
  const [ar, ag, ab] = unpack(a)
  const [br, bg, bb] = unpack(b)
  const k = Math.min(1, Math.max(0, t))
  return pack(
    linearToSrgb(srgbToLinear(ar) + (srgbToLinear(br) - srgbToLinear(ar)) * k),
    linearToSrgb(srgbToLinear(ag) + (srgbToLinear(bg) - srgbToLinear(ag)) * k),
    linearToSrgb(srgbToLinear(ab) + (srgbToLinear(bb) - srgbToLinear(ab)) * k),
  )
}

/** Tono de la luz ambiente que cae en las sombras. Azul frio de cielo. */
const AMBIENT_HUE = 235
/** Tono de la luz directa. Calido. */
const KEY_HUE = 45

function rotateToward(hue: number, target: number, amount: number): number {
  let diff = ((target - hue + 540) % 360) - 180
  return hue + diff * amount
}

/**
 * Sombra: mas oscura, MAS FRIA y MAS saturada.
 *
 * Lo de la saturacion es contraintuitivo pero es lo que hace que un personaje
 * se vea pintado y no apagado: en los medios tonos la sombra gana croma, y solo
 * la pierde muy abajo, donde ya domina el ambiente.
 */
export function shade(color: number, amount: number): number {
  const t = Math.min(1, Math.max(0, amount))
  const hsl = toHsl(color)
  return fromHsl({
    h: rotateToward(hsl.h, AMBIENT_HUE, t * 0.16),
    s: Math.min(1, hsl.s * (1 + t * 0.35)),
    l: hsl.l * (1 - t * 0.8),
  })
}

/**
 * Luz: mas clara, mas CALIDA y algo menos saturada.
 *
 * Mezclar hacia blanco puro —que es lo que hacia la version anterior— desatura
 * de golpe y deja ese aspecto de plastico lavado. Subir la luminosidad
 * conservando croma mantiene el color vivo.
 */
export function tint(color: number, amount: number): number {
  const t = Math.min(1, Math.max(0, amount))
  const hsl = toHsl(color)
  return fromHsl({
    h: rotateToward(hsl.h, KEY_HUE, t * 0.22),
    s: hsl.s * (1 - t * 0.28),
    l: hsl.l + (1 - hsl.l) * t * 0.75,
  })
}

/** Aliases historicos. Se mantienen para no tocar cada llamada. */
export const darken = shade
export const lighten = tint

/**
 * Contorno de tinta: muy oscuro y frio, pero conservando algo del tono del
 * objeto para que no se vea como un agujero negro recortado.
 */
export function ink(color: number, amount = 0.62): number {
  const hsl = toHsl(color)
  return fromHsl({
    h: rotateToward(hsl.h, AMBIENT_HUE, 0.25),
    s: Math.min(1, hsl.s * 0.75 + 0.1),
    l: hsl.l * (1 - amount) * 0.35,
  })
}

/** Varia el tono de una instancia sin sacarla de su familia de color. */
export function jitterHue(color: number, variant: number, degrees = 10): number {
  const hsl = toHsl(color)
  return fromHsl({
    h: hsl.h + (variant * 2 - 1) * degrees,
    s: Math.min(1, hsl.s * (0.92 + variant * 0.16)),
    l: Math.min(1, hsl.l * (0.94 + variant * 0.12)),
  })
}

// ----------------------------------------------------------------- tokens

/**
 * Terreno. La version anterior tenia 4.6 grados de rango de tono en todo el
 * campo: no eran nueve colores, era uno con nueve luminosidades. Ahora los
 * valores oscuros se van a frio (sombra ambiente) y los claros a calido (sol),
 * que es lo que le da temperatura al tablero y contraste contra las torres
 * frias.
 */
export const GROUND = {
  deep: 0x17141b,
  base: 0x3b3226,
  lit: 0x55432a,
  path: 0x6f5535,
  pathEdge: 0x91744a,
  pathInner: 0x7d6440,
  grid: 0x2f2a20,
  prop: 0x5e4a2e,
}

export const SEMANTIC = {
  hpFull: 0xd4c07a,
  hpMid: 0xd99a3f,
  hpLow: 0xe34b3f,
  crit: 0xfff0c2,
  slow: 0xa8e6ff,
  burn: 0xff8c3a,
  leak: 0xff2f2f,
  ink: 0x0d0b07,
}

/** Convierte a la cadena CSS que usa la UI en DOM. */
export function css(color: number): string {
  return `#${color.toString(16).padStart(6, '0')}`
}
