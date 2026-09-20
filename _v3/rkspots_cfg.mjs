// _v3/rkspots_cfg.mjs — configuración del video `rkspots` para el camino compartido `rksafe`.
//   "10 Hiding Spots Burglars Always Look First (A Locksmith's List)" · canal Ray Kessler (EN/US)
//
// ⛔⛔ AVATAR POR VENTANAS: el avatar lo genero yo en RunPod y sólo existe donde el plan lo deja
//    asomar. Fuera de esas ventanas el fondo es NEGRO → la cobertura se exige al 100 %.
//    El componente es `RayAvatarWin` (panel 960x540 = 1:1 con el reel → upscale REAL 1,154x),
//    NUNCA `RayAvatar`: a pantalla completa el 832x464 del endpoint público se estira 2,31x y el
//    creador lo rechazó en `rkspare` ("el avatar es muy poco real").
export const AVATAR_MODO = 'ventanas';
export const AVATAR_WIN_MIN = 1.6;
export const AVATAR_OBJ = 0.20;
// ⛔ PESO DEL METRAJE REAL EN EL DESEMPATE. Con los 215 clips de agnes en disco compitiendo por los
//    mismos slots, el default (0,6) dejaba el metraje real en 21,7 % — por debajo del piso de 25 %.
//    Barrido medido acá: 0,6 -> 21,7 % · 1,0 -> 23,1 % · 1,5 -> 27,7 % · 2,5 -> 29,3 %. Se toma 1,5:
//    cumple el piso sin forzar el puntaje de sustantivos (el contexto se mide aparte).
export const REAL_BONUS = 1.5;


export const SECCIONES = [
  { sec: 'S1',  rol: 'hook',    p0: 1,  p1: 9 },   // los once minutos · el cajón · quién soy · la promesa
  { sec: 'S2',  rol: 'explica', p0: 10, p1: 17 },  // no busca, CHEQUEA · la ruta · tu casa no es original
  { sec: 'S3',  rol: 'prueba',  p0: 18, p1: 23 },  // 10 · el freezer y la lata trucha
  { sec: 'S4',  rol: 'prueba',  p0: 24, p1: 28 },  // 9 · el baño (ya está parado ahí)
  { sec: 'S5',  rol: 'explica', p0: 29, p1: 34 },  // 8 · el libro hueco
  { sec: 'S6',  rol: 'explica', p0: 35, p1: 39 },  // 7 · el escritorio y el papel
  { sec: 'S7',  rol: 'explica', p0: 40, p1: 44 },  // 6 · el cuarto del chico
  { sec: 'S8',  rol: 'prueba',  p0: 45, p1: 49 },  // 5 · el colchón (geometría)
  { sec: 'S9',  rol: 'explica', p0: 50, p1: 54 },  // 4 · el placard
  { sec: 'S10', rol: 'prueba',  p0: 55, p1: 59 },  // 3 · la mesa de luz
  { sec: 'S11', rol: 'explica', p0: 60, p1: 65 },  // 2 · la caja fuerte suelta
  { sec: 'S12', rol: 'prueba',  p0: 66, p1: 73 },  // 1 · la cómoda
  { sec: 'S13', rol: 'receta',  p0: 74, p1: 81 },  // las tres reglas + el inventario
  { sec: 'S14', rol: 'cierre',  p0: 82, p1: 87 },  // la puerta + el CTA
  { sec: 'S15', rol: 'cierre',  p0: 88, p1: 91 },  // cierre
];

// ⛔ PACING NO METRÓNOMO. 4.033 y 8.067 son los únicos valores que acepta un CLIP de agnes
//    (2 s a 0,5× = 4,033 s @30 CFR); el resto son FOTOS o metraje REAL (que entra en cualquier
//    slot de 3,4 a 9,4 s porque se reproduce a 1× y se corta, no se congela).
export const ESCALERA = {
  hook:    [3.0, 4.033, 5.6, 8.067, 3.6, 4.033, 6.8, 2.9, 4.033, 5.2, 3.4, 7.0],
  prueba:  [4.033, 6.4, 3.2, 8.067, 4.033, 5.0, 3.5, 7.2, 2.8, 4.033, 6.0, 3.8],
  explica: [4.033, 3.4, 7.0, 4.033, 5.8, 2.9, 8.067, 6.4, 3.6, 4.033, 5.2, 4.6],
  receta:  [3.2, 4.033, 5.4, 8.067, 3.0, 4.033, 6.6, 4.6, 7.4, 3.4, 4.033, 5.0],
  cierre:  [4.033, 5.8, 3.3, 7.6, 4.033, 6.2, 3.8, 8.067, 5.0, 3.1, 4.033, 6.6],
};

// Este video no tiene tratamiento de cámara de seguridad (el de `rkknock` era el golpe en la puerta).
export const CAM_DATE = '10 / 22 / 2018';
export const CLOCK0 = 51120;
export const CAM = {};

// ⛔ Los planos que NO pueden perderse: el generador los coloca primero en su sección.
export const ORDEN_FORZADO = {
  S1:  ['rkspots_s1_05', 'rkspots_s1_06', 'rkspots_s1_09', 'rkspots_s1_03'],
  S2:  ['rkspots_s2_01', 'rkspots_s2_11'],
  S3:  ['rkspots_s3_01', 'rkspots_s3_10'],
  S4:  ['rkspots_s4_01', 'rkspots_s4_04'],
  S5:  ['rkspots_s5_01', 'rkspots_s5_03'],
  S6:  ['rkspots_s6_01', 'rkspots_s6_03'],
  S7:  ['rkspots_s7_01', 'rkspots_s7_05'],
  S8:  ['rkspots_s8_01', 'rkspots_s8_03'],
  S9:  ['rkspots_s9_01', 'rkspots_s9_05'],
  S10: ['rkspots_s10_01', 'rkspots_s10_02'],
  S11: ['rkspots_s11_01', 'rkspots_s11_08'],
  S12: ['rkspots_s12_01', 'rkspots_s12_02', 'rkspots_s12_08'],
  S13: ['rkspots_s13_02', 'rkspots_s13_13'],
  S14: ['rkspots_s14_01', 'rkspots_s14_08'],
  S15: ['rkspots_s15_05'],
};

// ⛔ El CTA es OVERLAY: va ENCIMA y no cuenta como cobertura de la capa base.
export const OVERLAY = ['RayCta'];

export const IMPORTS = {
  BigStat: '../rksafe/BigStat',
  CheckCard: '../rksafe/CheckCard',
  CrossSection: '../rksafe/CrossSection',
  MythTruth: '../rksafe/MythTruth',
  ProcessChips: '../rksafe/ProcessChips',
  PullQuote: '../rksafe/PullQuote',
  RayChecklist: '../rksafe/RayChecklist',
  RayCta: '../rksafe/RayCta',
  RaySecurityCam: '../rksafe/RaySecurityCam',
  RouteFlow: '../rksafe/RouteFlow',
  ScrewHero: '../rksafe/ScrewHero',
  SplitVs: '../rksafe/SplitVs',
  WorstSpots: '../rksafe/WorstSpots',
};

// ⛔ ≤12 palabras por componente y el piso de lectura lo calcula el plan desde el TEXTO.
// ⛔⛔ `RayCta.eyebrow` se PISA: su default es "Free walkthrough" y este guion NO promete nada
//    gratis (dice textual "they are not free"). La landing entrega 3 guías / 99 páginas / $27.
export const COMPONENTES = [
  { p: 6, comp: 'BigStat', props: {
    value: '4,000', unit: 'doors', tone: 'brass',
    caption: 'Thirty-five years. Not one burglar caught.' } },

  { p: 11, comp: 'MythTruth', props: {
    kicker: 'THE WHOLE VIDEO', myth: 'He searches your house', truth: 'He checks a list' } },

  { p: 14, comp: 'BigStat', props: {
    value: '5–10', unit: 'minutes inside', tone: 'danger',
    caption: 'Not a lot of minutes to be creative in.' } },

  { p: 16, comp: 'RouteFlow', props: {
    kicker: 'THE ROUTE', title: 'Three stops, then out',
    steps: [{ label: 'The main bedroom' }, { label: 'The office' }, { label: 'The way out' }] } },

  { p: 22, comp: 'CheckCard', props: {
    kicker: 'NUMBER TEN', title: 'Why the freezer fails',
    items: [{ text: 'Everybody has heard the joke' }, { text: 'It costs him four seconds' },
            { text: 'Foil is not food' }] } },

  { p: 28, comp: 'PullQuote', props: {
    quote: 'It is not how good the hiding place is. It is whether he is already standing there.',
    attrib: '— Ray' } },

  { p: 33, comp: 'BigStat', props: {
    value: '1 in 4', unit: 'start in the office', tone: 'brass',
    caption: 'UNC Charlotte, 422 convicted burglars.' } },

  { p: 38, comp: 'CheckCard', props: {
    kicker: 'NUMBER SEVEN', title: 'The desk is not about cash',
    items: [{ text: 'The chequebook' }, { text: 'The passport folder' },
            { text: 'The one marked IMPORTANT' }] } },

  { p: 42, comp: 'MythTruth', props: {
    kicker: 'NUMBER SIX', myth: 'Nobody looks in the kids room', truth: 'It is a thirty-second room' } },

  { p: 47, comp: 'SplitVs', props: {
    leftLabel: 'You slept on it', leftValue: '4 years',
    rightLabel: 'He lifts the corner', rightValue: '2 seconds',
    verdict: 'And the mattress keeps the shape.' } },

  { p: 52, comp: 'CrossSection', props: {
    title: 'The closet is a room of containers',
    caption: 'Somebody else already packed them',
    labels: [{ text: 'Shoeboxes on the floor' }, { text: 'The out-of-reach shelf' },
             { text: 'And the suitcases' }] } },

  { p: 56, comp: 'RayChecklist', props: {
    kicker: 'NUMBER THREE', title: 'Three things live in a nightstand',
    items: [{ text: 'A watch' }, { text: 'Some cash' }, { text: 'And often a handgun' }] } },

  { p: 61, comp: 'MythTruth', props: {
    kicker: 'NUMBER TWO', myth: 'The safe protects it', truth: 'The safe packs it for him' } },

  { p: 65, comp: 'SplitVs', props: {
    leftLabel: 'Bolted to a joist', leftValue: '$150',
    rightLabel: 'Sitting on a shelf', rightValue: '$600',
    verdict: 'The bolts are the product.' } },

  { p: 68, comp: 'WorstSpots', props: {
    kicker: 'THE TOP OF THE LIST', title: 'Where he goes first',
    spots: [{ label: 'The dresser top drawer' }, { label: 'The closet shelf' },
            { label: 'The nightstand' }, { label: 'Under the mattress' },
            { label: 'The unbolted safe' }] } },

  { p: 73, comp: 'BigStat', props: {
    value: 'No. 1', unit: 'the sock drawer', tone: 'danger',
    caption: 'The most common line in eleven years of notes.' } },

  { p: 75, comp: 'ProcessChips', props: {
    kicker: 'WHAT TO DO INSTEAD', title: 'Three rules',
    steps: [{ title: 'Anchor it or do not own it' }, { title: 'Split it into three' },
            { title: 'Boring beats clever' }] } },

  { p: 79, comp: 'RayChecklist', props: {
    kicker: 'TEN MINUTES TONIGHT', title: 'The part nobody prepares for',
    items: [{ text: 'Photograph every piece' }, { text: 'Write down the serial numbers' },
            { text: 'Keep the list out of the house' }] } },

  { p: 85, comp: 'RayCta', props: {
    eyebrow: 'BEFORE YOU FORGET',
    title: 'The Thousand Dollar Afternoon',
    sub: 'Three guides, 99 pages, $27. The door, the phone call, and 37 fixes that cost nothing.',
    domain: 'raykessler.vercel.app',
    qr: 'img/rkspots_qr.png', showQr: true } },

  { p: 90, comp: 'PullQuote', props: {
    quote: 'You only have to stop being right about one of them.', attrib: '— Ray Kessler' } },
];
