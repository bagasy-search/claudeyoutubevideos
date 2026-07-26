/**
 * Paleta y modelo de color.
 *
 * Tres decisiones que separan esto de "oscurecer y aclarar":
 *
 * 1. **Las mezclas van en luz lineal, no en sRGB.** Interpolar bytes sRGB
 *    atraviesa la curva gamma y ensucia los medios tonos: un rojo saturado
 *    oscurecido asi se va a marron en vez de quedarse rojo.
 *
 * 2. **El sombreado se calcula en OKLCH**, que es perceptualmente uniforme. La
 *    L de HSL no lo es: un paso del 10% parece enorme en un color oscuro y casi
 *    nada en uno claro, y un amarillo con L=50 se ve muchisimo mas claro que un
 *    azul con L=50. Por eso las rampas hechas en HSL salen una embarrada y otra
 *    quemada. OKLCH ademas no arrastra los azules hacia el violeta al cambiar
 *    la luminosidad.
 *
 * 3. **Las sombras cambian de tono, no solo de valor.** Una sombra real recibe
 *    luz ambiente del cielo, asi que se enfria; una luz directa se acerca al
 *    color de la fuente. Bajar el brillo sin mover el tono es la causa numero
 *    uno de que un dibujo se vea plano y de plastico.
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

/** Luminosidad, croma y tono. L en 0..1, C en 0..~0.4 dentro de sRGB, H en grados. */
export interface Oklch {
  l: number
  c: number
  h: number
}

function linearToOklab(r: number, g: number, b: number): [number, number, number] {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

function oklabToLinear(L: number, A: number, B: number): [number, number, number] {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

export function toOklch(color: number): Oklch {
  const [r8, g8, b8] = unpack(color)
  const [L, A, B] = linearToOklab(srgbToLinear(r8), srgbToLinear(g8), srgbToLinear(b8))
  return { l: L, c: Math.hypot(A, B), h: (Math.atan2(B, A) * 180) / Math.PI }
}

export function fromOklch({ l, c, h }: Oklch): number {
  const rad = (h * Math.PI) / 180
  const chroma = Math.max(0, c)
  const [r, g, b] = oklabToLinear(
    Math.min(1, Math.max(0, l)),
    chroma * Math.cos(rad),
    chroma * Math.sin(rad),
  )
  return pack(linearToSrgb(r), linearToSrgb(g), linearToSrgb(b))
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

// --------------------------------------------------------------- sombreado

/** Tono de la luz ambiente que cae en las sombras, en OKLCH. Azul de cielo. */
const AMBIENT_HUE = 264
/** Tono de la luz directa. Calido. */
const KEY_HUE = 95
/** Rotacion maxima de tono, en grados. Las fuentes coinciden en 15-25. */
const MAX_ROTATION = 22

function rotateToward(hue: number, target: number, amount: number): number {
  const diff = ((target - hue + 540) % 360) - 180
  return hue + Math.sign(diff) * Math.min(Math.abs(diff), MAX_ROTATION * amount)
}

/**
 * Sombra: mas oscura, MAS FRIA y con el croma en curva.
 *
 * Lo del croma es lo contraintuitivo y es lo que hace que se vea pintado en vez
 * de apagado. En el medio tono la sombra GANA saturacion — es el "terminador",
 * el borde entre luz y sombra, donde el color es mas intenso — y solo la pierde
 * muy abajo, donde ya domina la luz ambiente. Una curva, no una recta.
 */
export function shade(color: number, amount: number): number {
  const t = Math.min(1, Math.max(0, amount))
  const o = toOklch(color)
  const chroma = o.c * (1 + Math.sin(Math.min(1, t / 0.45) * Math.PI * 0.5) * 0.18 - t * t * 0.42)
  return fromOklch({
    l: o.l * (1 - t * 0.72),
    c: Math.max(0, chroma),
    h: rotateToward(o.h, AMBIENT_HUE, t),
  })
}

/**
 * Luz: mas clara, mas CALIDA y con algo menos de croma.
 *
 * Mezclar hacia blanco puro desatura de golpe y deja el aspecto de plastico
 * lavado. Subir L en OKLCH conservando la mayor parte del croma mantiene el
 * color vivo.
 */
export function tint(color: number, amount: number): number {
  const t = Math.min(1, Math.max(0, amount))
  const o = toOklch(color)
  return fromOklch({
    l: o.l + (1 - o.l) * t * 0.7,
    c: o.c * (1 - t * 0.22),
    h: rotateToward(o.h, KEY_HUE, t * 0.8),
  })
}

/** Aliases historicos. Se mantienen para no tocar cada llamada. */
export const darken = shade
export const lighten = tint

/**
 * Contorno de tinta: muy oscuro y frio, pero conservando algo del croma del
 * objeto para que no se lea como un agujero negro recortado.
 */
export function ink(color: number, amount = 0.62): number {
  const o = toOklch(color)
  return fromOklch({
    l: o.l * (1 - amount) * 0.42,
    c: o.c * 0.55,
    h: rotateToward(o.h, AMBIENT_HUE, 0.9),
  })
}

/**
 * Contorno del lado ILUMINADO.
 *
 * Un contorno de un solo color es lo que delata al dibujo hecho por programa.
 * En el arte de personajes el contorno no es una linea: es la parte de la forma
 * que se curva y se aleja de la camara, asi que RECIBE LUZ igual que el resto.
 * Donde la superficie mira a la fuente, el contorno se aclara y se calienta;
 * donde se aleja, se hunde en `ink()`.
 *
 * El limite duro en 0.72 de luminosidad no es decorativo: si el contorno del
 * lado iluminado se acerca demasiado al blanco, la silueta se abre y la figura
 * deja de recortarse contra el fondo, que es lo unico que no se puede perder.
 */
export function inkLit(color: number, amount = 0.5): number {
  const o = toOklch(color)
  return fromOklch({
    l: Math.min(0.72, o.l * (1 - amount) + 0.2),
    c: o.c * 0.72,
    h: rotateToward(o.h, KEY_HUE, 0.7),
  })
}

/**
 * Varia una instancia sin sacarla de su familia de color.
 *
 * El tono y el croma se mueven con holgura; la LUMINOSIDAD casi nada. Es la que
 * cuesta legibilidad: variar el valor arruina el contraste contra el fondo, que
 * es lo unico que no se puede negociar.
 */
export function jitterHue(color: number, variant: number, degrees = 10): number {
  const o = toOklch(color)
  return fromOklch({
    l: o.l * (0.97 + variant * 0.06),
    c: o.c * (0.9 + variant * 0.2),
    h: o.h + (variant * 2 - 1) * degrees,
  })
}

// ----------------------------------------------------------------- tokens

/**
 * Terreno. La primera version tenia 4.6 grados de rango de tono en todo el
 * campo: no eran nueve colores, era uno con nueve luminosidades. Ahora los
 * valores oscuros se van a frio (sombra ambiente) y los claros a calido (sol),
 * que es lo que le da temperatura al tablero y contraste contra las torres.
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
