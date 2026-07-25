/**
 * Paleta única del juego, en una sola fuente de verdad.
 *
 * Regla dura, de docs/ART.md: las tres bandas no se pisan nunca.
 *  - Terreno: desaturado, valores bajos. Nunca compite con las unidades.
 *  - Invasores: mitad cálida del círculo cromático.
 *  - Defensa: mitad fría.
 *  - Semántica (vida, crítico, estados): reservada, jamás decorativa.
 */

export const GROUND = {
  deep: 0x1d1710,
  base: 0x463823,
  lit: 0x51422a,
  /*
   * Tablero cálido y claro, al reves que la version anterior. El estilo chibi
   * lee por contorno oscuro sobre fondo claro; si el suelo es oscuro, el
   * contorno desaparece y con el la silueta.
   */
  path: 0x6b5638,
  pathEdge: 0x806844,
  pathInner: 0x7a6240,
  grid: 0x4d3e28,
  prop: 0x5c4a30,
  propInk: 0x241c12,
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

/** Oscurece un color hacia el negro tinta. Es el contorno de todo. */
export function ink(color: number, amount = 0.62): number {
  return mix(color, SEMANTIC.ink, amount)
}

export function lighten(color: number, amount: number): number {
  return mix(color, 0xffffff, amount)
}

export function darken(color: number, amount: number): number {
  return mix(color, 0x000000, amount)
}

export function mix(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 0xff
  const ag = (a >> 8) & 0xff
  const ab = a & 0xff
  const br = (b >> 16) & 0xff
  const bg = (b >> 8) & 0xff
  const bb = b & 0xff
  return (
    (Math.round(ar + (br - ar) * t) << 16) |
    (Math.round(ag + (bg - ag) * t) << 8) |
    Math.round(ab + (bb - ab) * t)
  )
}

/** Convierte a la cadena CSS que usa la UI en DOM. */
export function css(color: number): string {
  return `#${color.toString(16).padStart(6, '0')}`
}
