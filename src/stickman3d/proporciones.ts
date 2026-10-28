// Proporciones de «Blanquito», medidas en píxeles sobre ref_stickman.jpg (1376×768).
// Unidad = diámetro de cabeza. En la ref la cabeza mide 166 px (x 582→748), así que 1 u = 166 px.
// Piso = y 700 px. Cálculo de cada valor al lado.
export const PX_POR_U = 166;

export const PROPORCIONES = {
  cabeza: {
    radio: 0.5, // 166 px / 2 / 166
    achatadoY: 0.97, // la ref se ve apenas más ancha que alta (166 × 161 px)
    hundida: 0.035, // el torso entra ~6 px en la cabeza (sin cuello)
  },
  alturaTotal: 3.55, // 115 px (coronilla) → 705 px (planta) = 590 px / 166
  torso: {
    largo: 1.26, // mentón 282 px → cadera 462 px = 180 px / 166
    radio: 0.11, // 34 px de ancho / 2 / 166
    hombroBajoMenton: 0.14, // los brazos nacen ~18 px debajo del mentón
  },
  brazo: {
    radio: 0.086, // 28 px / 2 / 166
    superior: 0.745, // hombro (675,300) → codo (590,385) = 120 px
    antebrazo: 0.725, // codo → muñeca (558,478) = 112 px (+ la mano)
    separacionHombros: 0.0,
    afina: 0.14, // conicidad hacia la muñeca
  },
  pierna: {
    radio: 0.1, // 32 px / 2 / 166
    muslo: 0.77, // cadera (690,465) → rodilla (610,585) = 144 px = 0,87 en pantalla, ~0,72 real con la pierna girada
    canilla: 0.7, // rodilla → tobillo (632,672) = 88 px en pantalla (escorzo) ; 0,66 real
    separacionCadera: 0.024,
    afina: 0.22, // conicidad hacia el tobillo // las dos piernas nacen del mismo punto: 6-7 px entre ejes
  },
  cadera: { altura: 1.47 }, // y de la pelvis parado relajado (rodillas apenas flexionadas)
  mano: {
    // mitón: bolita ovalada apenas más ancha que el brazo (36 px vs 28 px) + pulgar como nubecita (≈ 15 px)
    ancho: 0.108, largo: 0.14, grosor: 0.088,
    pulgarRadio: 0.05,
  },
  pie: {
    largo: 0.34, // pie izquierdo de la ref: 590→648 px = 58 px (escorzo) ; real ≈ 0,34
    radio: 0.083, // alto del pie 27 px / 2 / 166
    aplaste: 0.98, // «pantufla»: achatado verticalmente
    tobilloAlto: 0.125,
  },
  cara: {
    // feliz (la de la ref): ojos «^ ^» 15 px sobre el ecuador, separados 64 px, arcos de 36 px; boca 17 px bajo el ecuador, 37 px de ancho
    ojoY: 0.105, ojoSep: 0.365, ojoAncho: 0.175,
    bocaY: -0.09, bocaAncho: 0.17,
    trazo: 0.043, // 7 px
  },
} as const;

export type Proporciones = typeof PROPORCIONES;
