// _v3/rkremote_cfg.mjs — configuración del video `rkremote` para el camino compartido `rksafe`.
//   "Your Old Garage Remote Still Opens Your House — Reset It In 2 Minutes" · canal Ray Kessler (EN/US)
//
// ⛔⛔ AVATAR POR VENTANAS, A PANTALLA COMPLETA (RayAvatarWin full, nunca PiP). Fuera de las ventanas
//    el fondo es NEGRO → la cobertura se exige al 100 %. Objetivo del brief: avatar ≈25-30 %.
export const AVATAR_MODO = 'ventanas';
export const AVATAR_WIN_MIN = 1.6;
export const AVATAR_WIN_MAX = 10.0;
export const AVATAR_CAND_MAX = 8.6;
export const AVATAR_OBJ = 0.24;
export const REAL_BONUS = 1.0;
// ⭐ transiciones con MOVIMIENTO entre planos de la capa base (empuje, máscara, zoom), no sólo cortes.
export const TRANSICIONES = true;

export const SECCIONES = [
  { sec: 'S1',  rol: 'hook',    p0: 1,  p1: 4 },   // el control gris · lo que no me dio · la puerta · la promesa
  { sec: 'S2',  rol: 'explica', p0: 5,  p1: 7 },   // quién soy · el agujero de 16 pies · encuadre defensivo
  { sec: 'S3',  rol: 'explica', p0: 8,  p1: 12 },  // el motor tiene memoria · quién está en la lista
  { sec: 'S4',  rol: 'receta',  p0: 13, p1: 15 },  // fix 1: contarlos
  { sec: 'S5',  rol: 'prueba',  p0: 16, p1: 22 },  // fix 2: el botón LEARN
  { sec: 'S6',  rol: 'explica', p0: 23, p1: 27 },  // fix 3: teclado y app
  { sec: 'S7',  rol: 'prueba',  p0: 28, p1: 33 },  // fix 4: el auto
  { sec: 'S8',  rol: 'prueba',  p0: 34, p1: 39 },  // fix 5: la última puerta + tornillos
  { sec: 'S9',  rol: 'explica', p0: 40, p1: 42 },  // fix 6: cerrojo
  { sec: 'S10', rol: 'explica', p0: 43, p1: 45 },  // bloqueo de vacaciones + cuerda roja
  { sec: 'S11', rol: 'prueba',  p0: 46, p1: 50 },  // fix 7: código fijo vs rotativo
  { sec: 'S12', rol: 'receta',  p0: 51, p1: 55 },  // el repaso y la idea
  { sec: 'S13', rol: 'cierre',  p0: 56, p1: 59 },  // CTA y cierre
];

// ⛔ PACING NO METRÓNOMO. 4.033 y 8.067 = clip de agnes (2 s a 0,5×); el resto, fotos o metraje real.
export const ESCALERA = {
  hook:    [3.0, 4.033, 7.2, 8.067, 3.6, 6.4, 4.033, 7.8, 2.9, 5.6, 8.0, 4.033],
  prueba:  [4.033, 7.4, 3.2, 8.067, 6.6, 4.033, 3.5, 7.8, 2.8, 8.0, 6.0, 4.033],
  explica: [4.033, 7.6, 3.4, 8.067, 6.2, 2.9, 7.9, 4.033, 3.6, 6.8, 8.0, 4.6],
  receta:  [3.2, 7.4, 4.033, 8.067, 3.0, 6.6, 7.8, 4.033, 5.2, 8.0, 3.4, 6.4],
  cierre:  [4.033, 7.8, 3.3, 7.6, 4.033, 6.2, 3.8, 8.067, 7.0, 3.1, 4.033, 6.6],
};

export const CAM_DATE = '';
export const CLOCK0 = 0;
export const CAM = {};

// ⛔ Los planos que NO pueden perderse: el generador los coloca primero en su sección.
export const ORDEN_FORZADO = {
  S1:  ['rkremote_s1_02', 'rkremote_s1_06', 'rkremote_s1_10'],
  S3:  ['rkremote_s3_01'],
  S4:  ['rkremote_s4_03'],
  S5:  ['rkremote_s5_03', 'rkremote_s5_08'],
  S6:  ['rkremote_s6_05'],
  S7:  ['rkremote_s7_02', 'rkremote_s7_09'],
  S8:  ['rkremote_s8_07', 'rkremote_s8_09'],
  S9:  ['rkremote_s9_03'],
  S10: ['rkremote_s10_05'],
  S11: ['rkremote_s11_02'],
};

// ⛔ El CTA es OVERLAY: va ENCIMA y no cuenta como cobertura de la capa base.
export const OVERLAY = ['RayCta'];

export const IMPORTS = {
  BigStat: '../rksafe/BigStat',
  CheckCard: '../rksafe/CheckCard',
  MythTruth: '../rksafe/MythTruth',
  ProcessChips: '../rksafe/ProcessChips',
  PullQuote: '../rksafe/PullQuote',
  RayChecklist: '../rksafe/RayChecklist',
  RayCta: '../rksafe/RayCta',
  RouteFlow: '../rksafe/RouteFlow',
  ScrewHero: '../rksafe/ScrewHero',
  SplitVs: '../rksafe/SplitVs',
  // ── NUEVOS de este video (motion design dibujado por código, cuadro a cuadro) ──
  RemoteTally: '../rksafe/RemoteTally',
  LearnButtonWipe: '../rksafe/LearnButtonWipe',
  LastDoorCutaway: '../rksafe/LastDoorCutaway',
  RollingCodeWaves: '../rksafe/RollingCodeWaves',
  DipSwitchReveal: '../rksafe/DipSwitchReveal',
  HomeLinkClear: '../rksafe/HomeLinkClear',
  VideoRefCard: '../rksafe/VideoRefCard',
};

// ⛔ ≤12 palabras por componente; el piso de lectura lo calcula el plan desde el TEXTO, y `dur` pide
//    más tiempo SÓLO cuando la animación lo necesita (cuenta regresiva, borrado, ondas).
const SLOTS5 = [{ text: 'Remote' }, { text: 'Remote' }, { text: 'Keypad' }, { text: 'Car' }, { text: '???' }];
export const COMPONENTES = [
  { p: 2, dur: 8, comp: 'RemoteTally', props: {
    kicker: 'WHAT HE KEPT', title: '',
    items: [{ text: 'Two more remotes' }, { text: 'The keypad code' }, { text: 'His old car' }] } },
  { p: 3, dur: 7, comp: 'LastDoorCutaway', props: { stage: 'unlocked', kicker: 'THE LAST DOOR', title: 'Garage to kitchen', caption: '' } },
  { p: 4, comp: 'RayChecklist', props: {
    kicker: 'TODAY', title: 'Today',
    items: [{ text: 'Old remotes: dead' }, { text: 'The door nobody locks' }, { text: 'The car you sold' }] } },

  { p: 6, comp: 'BigStat', props: { value: '16 ft', unit: 'hole in the house', tone: 'danger', caption: 'Open for the right little box.' } },
  { p: 7, comp: 'MythTruth', props: { kicker: 'THE RULES HERE', myth: 'How anybody gets in', truth: 'How you shut it' } },

  { p: 9, dur: 7, comp: 'LearnButtonWipe', props: {
    mode: 'list', kicker: 'THE MOTOR REMEMBERS', title: 'Every remote, ever', seconds: 6, color: 'purple', slots: SLOTS5 } },
  { p: 10, comp: 'RouteFlow', props: {
    kicker: 'NEVER CLEARS', title: 'Still on the list',
    steps: [{ label: 'House sold' }, { label: 'Lockbox changed' }, { label: 'New family' }] } },
  { p: 11, dur: 8, comp: 'RemoteTally', props: {
    kicker: "WHO'S ON IT", title: '', final: '?',
    items: [{ text: 'Family before' }, { text: 'Dog walker' }, { text: 'Contractor' }, { text: 'Neighbor' }, { text: 'Old car' }] } },

  { p: 13, dur: 6, comp: 'ProcessChips', props: {
    kicker: 'SEVEN FIXES', title: 'Cheapest first',
    steps: [{ title: 'Count' }, { title: 'Erase' }, { title: 'Keypad' }, { title: 'Car' }, { title: 'Screws' }, { title: 'Deadbolt' }, { title: 'Opener' }] } },
  { p: 14, comp: 'RayChecklist', props: {
    kicker: 'FIX 1 · FREE', title: 'Count them',
    items: [{ text: 'Visors' }, { text: 'Drawer' }, { text: 'Keypad' }, { text: 'Car button' }, { text: 'Phone app' }] } },

  { p: 16, comp: 'BigStat', props: { value: '2 min', unit: '$0', tone: 'brass', caption: 'The fix in the title.' } },
  { p: 17, dur: 8, comp: 'LearnButtonWipe', props: { mode: 'find', kicker: 'FIX 2 · FREE', title: 'Find the learn button', seconds: 6, color: 'purple', slots: SLOTS5 } },
  { p: 18, dur: 10, comp: 'LearnButtonWipe', props: { mode: 'wipe', kicker: 'HOLD ~6 SECONDS', title: 'The list is gone', seconds: 6, color: 'purple', slots: SLOTS5 } },
  { p: 19, comp: 'CheckCard', props: {
    kicker: 'BRANDS DIFFER', title: 'Where to look',
    items: [{ text: 'Motor sticker' }, { text: 'The manual' }, { text: 'Model number online' }] } },
  { p: 20, comp: 'ProcessChips', props: {
    kicker: 'TEACH IT BACK', title: 'Keepers only',
    steps: [{ title: 'Tap LEARN' }, { title: '30 seconds' }, { title: 'Press remote' }] } },
  { p: 21, comp: 'MythTruth', props: { kicker: 'THE OLD GRAY ONE', myth: 'Still opens the garage', truth: 'Just plastic now' } },

  { p: 24, comp: 'CheckCard', props: {
    kicker: 'FIX 3', title: 'New keypad code',
    items: [{ text: 'Not your house number' }, { text: 'Not a birthday' }] } },
  { p: 26, comp: 'SplitVs', props: {
    leftLabel: 'Worn shiny', leftValue: '4 keys', rightLabel: 'Like new', rightValue: 'the rest', verdict: 'That is a hint.' } },
  { p: 27, comp: 'RayChecklist', props: {
    kicker: 'THE PHONE APP', title: 'Who has access?',
    items: [{ text: 'Remove old owner' }, { text: 'Reset the hub' }] } },

  { p: 29, dur: 8, comp: 'HomeLinkClear', props: { mode: 'risk', kicker: 'FIX 4 · THE CAR', title: 'It still knows your garage' } },
  { p: 30, dur: 9, comp: 'HomeLinkClear', props: { mode: 'clear', kicker: 'BEFORE YOU SELL IT', title: 'Clear the buttons' } },
  { p: 31, comp: 'PullQuote', props: { quote: 'The car forgot nothing. Your garage forgot the car.', attrib: '— Ray' } },
  { p: 32, comp: 'RouteFlow', props: {
    kicker: 'THE CAR OUTSIDE', title: 'A labeled key',
    steps: [{ label: 'Visor remote' }, { label: 'Glovebox address' }] } },
  { p: 33, dur: 6, comp: 'VideoRefCard', props: {
    kicker: 'WATCH NEXT', title: 'Your Car Key Is Talking All Night', sub: 'Same idea' } },

  { p: 34, comp: 'BigStat', props: { value: '$3', unit: 'the last door', tone: 'brass', caption: 'Between the garage and the house.' } },
  { p: 36, dur: 8, comp: 'LastDoorCutaway', props: { stage: 'knob', kicker: 'FIX 5 · $3', title: 'The last door', caption: '' } },
  { p: 38, dur: 6, comp: 'ScrewHero', props: {
    kicker: 'THE THREE DOLLAR PART', title: '$3', sub: 'Three-inch screws, into the stud.',
    pieces: [{ kind: 'bolt', x: 20, scale: 0.86, rot: -14 }, { kind: 'stubby', x: 39, scale: 0.9, rot: 8 },
             { kind: 'wood', x: 58, scale: 1.05, rot: -6, hero: true }, { kind: 'nail', x: 79, scale: 0.82, rot: 18 }] } },
  { p: 38, dur: 8, comp: 'LastDoorCutaway', props: { stage: 'screws', kicker: 'LONG SCREWS', title: 'Into the stud', caption: '' } },

  { p: 40, comp: 'SplitVs', props: {
    leftLabel: 'Knob lock', leftValue: 'convenience', rightLabel: 'Deadbolt', rightValue: '$25–40', verdict: 'Steel in the frame.' } },
  { p: 41, dur: 8, comp: 'LastDoorCutaway', props: { stage: 'deadbolt', kicker: 'FIX 6', title: 'Want the bolt', caption: '' } },

  { p: 44, comp: 'RayChecklist', props: {
    kicker: 'GOING AWAY', title: 'Remotes off',
    items: [{ text: 'Vacation lock switch' }, { text: 'Or unplug the motor' }] } },
  { p: 45, comp: 'CheckCard', props: {
    kicker: 'THE RED CORD', title: 'Emergency release',
    items: [{ text: 'Pulled from inside' }, { text: 'About $5 shield' }] } },

  { p: 47, dur: 8, comp: 'DipSwitchReveal', props: { kicker: 'FIX 7', title: 'Tiny switches inside?', tag: 'FIXED CODE', sub: 'Same code, every click', switches: 10 } },
  { p: 48, dur: 8, comp: 'RollingCodeWaves', props: { mode: 'fixed', kicker: 'FIXED CODE', verdict: 'Same every time. Repeatable.', clicks: 4 } },
  { p: 49, dur: 9, comp: 'RollingCodeWaves', props: { mode: 'both', kicker: 'NEWER OPENERS', verdict: "Yesterday's click is worthless.", clicks: 4 } },

  { p: 51, dur: 7, comp: 'RayChecklist', props: {
    kicker: 'THE LIST', title: 'Recap',
    items: [{ text: 'Count' }, { text: 'Erase' }, { text: 'Keypad, app' }, { text: 'Car' }, { text: 'Screws' }, { text: 'Deadbolt' }, { text: 'Switches' }] } },
  { p: 53, comp: 'PullQuote', props: { quote: 'Not a break-in. An invitation you forgot you sent.', attrib: '— Ray' } },
  { p: 54, comp: 'SplitVs', props: {
    leftLabel: 'The bunker', leftValue: '$20,000', rightLabel: 'The fix', rightValue: '$3', verdict: 'Plus six seconds.' } },
  { p: 55, dur: 7, comp: 'LearnButtonWipe', props: {
    mode: 'wipe', kicker: 'THE LIGHT GOES OUT', title: 'Sleep better', seconds: 6, color: 'purple',
    slots: [{ text: 'Old owner' }, { text: 'Old car' }, { text: '???' }] } },

  { p: 56, dur: 34, comp: 'RayCta', props: {
    eyebrow: 'THE THOUSAND DOLLAR AFTERNOON',
    title: 'Three guides, one afternoon',
    sub: 'The door, the late-night call, fixes that cost nothing. $27 · 30-day refund.',
    domain: 'raykessler.vercel.app',
    qr: 'img/rkremote_qr.png', showQr: true } },
];
