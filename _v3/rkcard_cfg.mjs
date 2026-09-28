// _v3/rkcard_cfg.mjs — configuración del video `rkcard` para el camino compartido `rksafe`.
//   "How Burglars Break In Using a Plastic Card — and How a Locksmith Stops It" · Ray Kessler (EN/US)
//
// ⛔⛔ AVATAR POR VENTANAS A PANTALLA COMPLETA (RayAvatarWin full, nunca PiP). Fuera de las ventanas
//    el fondo es NEGRO -> cobertura 100 %. Objetivo del brief: avatar ≈ 25-30 %.
// ⛔ ENCUADRE DEFENSIVO: los componentes explican POR QUÉ cede el pestillo y CÓMO frenarlo; ninguno
//    muestra pasos para entrar.
export const AVATAR_MODO = 'ventanas';
export const AVATAR_WIN_MIN = 1.6;
export const AVATAR_WIN_MAX = 9.0;
export const AVATAR_OBJ = 0.27;
// el video ABRE con Ray hablando: primer plano de b-roll recién en "And on a lot of front doors" (7,5 s)
export const APERTURA_MIN = 7.5;
export const REAL_BONUS = 1.5;
// piso de duración de un plano de metraje real (ver rksafe_plan.mjs)
export const REAL_MIN_DUR = [5.4, 8.1];
// ⭐ transiciones con movimiento (RayEntrance): ~40 % de los cortes, 9 cuadros, el anterior se estira debajo
export const TRANSICIONES = { pct: 0.4, frames: 9, kinds: ['slide', 'wipe', 'zoom', 'iris'] };

export const SECCIONES = [
  { sec: 'S1',  rol: 'hook',    p0: 1,  p1: 3 },   // la tarjeta · quién soy (defensivo) · el loop: la pieza que no trabaja
  { sec: 'S2',  rol: 'explica', p0: 4,  p1: 7 },   // qué sostiene la puerta: el pestillo de resorte
  { sec: 'S3',  rol: 'explica', p0: 8,  p1: 11 },  // por qué cede · el pomo trabado no traba el pestillo · salvedades
  { sec: 'S4',  rol: 'prueba',  p0: 12, p1: 14 },  // la botella · sin marcas · latched is not locked
  { sec: 'S5',  rol: 'prueba',  p0: 15, p1: 18 },  // el test: contar metales · el émbolo deadlatch
  { sec: 'S6',  rol: 'explica', p0: 19, p1: 21 },  // la holgura: la puerta se corre y el émbolo cae al hueco
  { sec: 'S7',  rol: 'receta',  p0: 22, p1: 24 },  // los 10 segundos · la guía
  { sec: 'S8',  rol: 'receta',  p0: 25, p1: 28 },  // arreglo 1: usar el cerrojo que ya tenés
  { sec: 'S9',  rol: 'receta',  p0: 29, p1: 32 },  // arreglo 2: tornillo de 3" en la bisagra de arriba
  { sec: 'S10', rol: 'receta',  p0: 33, p1: 34 },  // arreglo 3: el cerradero
  { sec: 'S11', rol: 'prueba',  p0: 35, p1: 36 },  // arreglo 4: pomo con deadlatch
  { sec: 'S12', rol: 'prueba',  p0: 37, p1: 38 },  // arreglo 5: latch guard
  { sec: 'S13', rol: 'explica', p0: 39, p1: 42 },  // arreglo 6: cerrojo de 1" · tornillos largos · barra genérica
  { sec: 'S14', rol: 'cierre',  p0: 43, p1: 47 },  // el orden · sin búnker · las otras puertas
  { sec: 'S15', rol: 'cierre',  p0: 48, p1: 51 },  // vuelta al principio · CTA
];

// ⛔ PACING NO METRÓNOMO. 4.033 y 8.067 son los únicos valores de un CLIP de agnes; el resto son
//    fotos o metraje REAL (3,4-9,4 s, a 1x).
export const ESCALERA = {
  hook:    [3.0, 4.033, 5.6, 8.067, 3.6, 4.033, 6.8, 2.9, 4.033, 5.2, 3.4, 7.0],
  prueba:  [4.033, 6.4, 3.2, 8.067, 4.033, 5.0, 3.5, 7.2, 2.8, 4.033, 6.0, 3.8],
  explica: [4.033, 3.4, 7.0, 4.033, 5.8, 2.9, 8.067, 6.4, 3.6, 4.033, 5.2, 4.6],
  receta:  [3.2, 4.033, 5.4, 8.067, 3.0, 4.033, 6.6, 4.6, 7.4, 3.4, 4.033, 5.0],
  cierre:  [4.033, 5.8, 3.3, 7.6, 4.033, 6.2, 3.8, 8.067, 5.0, 3.1, 4.033, 6.6],
};

export const CAM_DATE = '09 / 27 / 2026';
export const CLOCK0 = 51120;
export const CAM = {};

export const ORDEN_FORZADO = {
  S1: ['rkcard_s1_01', 'rkcard_s1_02'],
};

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
  WorstSpots: '../rksafe/WorstSpots',
  // ── NUEVOS de rkcard (motion design de la cerradura, dibujados cuadro a cuadro) ──
  LatchCutaway: '../rksafe/LatchCutaway',
  GapScanTest: '../rksafe/GapScanTest',
  DoorEdgeCount: '../rksafe/DoorEdgeCount',
  BoltMorph: '../rksafe/BoltMorph',
  HingeScrewPull: '../rksafe/HingeScrewPull',
  LatchGuardInstall: '../rksafe/LatchGuardInstall',
  FixLadder: '../rksafe/FixLadder',
};

// ⛔ ≤12 palabras por componente. `dur` = piso de duración para los que ANIMAN un mecanismo (el
//    plan toma max(lectura del texto, dur)); sin él, un corte de 4 fases quedaría en 2,8 s.
// ⛔ Datos con salvedad: precios como rango ("around"), nada de estadísticas inventadas.
export const COMPONENTES = [
  // S1 · hook
  { p: 1, comp: 'BigStat', props: { value: '1 card', unit: 'is all it takes', tone: 'danger', caption: 'On a lot of front doors.' } },
  { p: 2, comp: 'MythTruth', props: { kicker: 'THIS VIDEO', myth: 'How it is done', truth: 'Why it works, and how to stop it' } },
  // S2 · el pestillo
  { p: 5, comp: 'DoorEdgeCount', dur: 6.5, props: { mode: 'anatomy' } },
  { p: 6, comp: 'LatchCutaway', dur: 7.5, props: { mode: 'close' } },
  { p: 7, comp: 'PullQuote', props: { quote: 'Built to keep a door closed. Never to keep it locked.', attrib: '— Ray Kessler' } },
  // S3 · por qué cede
  { p: 8, comp: 'LatchCutaway', dur: 7.5, props: { mode: 'spring' } },
  { p: 9, comp: 'SplitVs', props: { leftLabel: 'Lock the knob', leftValue: 'Knob stops', rightLabel: 'The latch', rightValue: 'Still moves', verdict: 'A knob lock stops a hand.' } },
  // S4 · la prueba
  { p: 12, comp: 'MythTruth', props: { kicker: 'LIKE THE WATER BOTTLE', myth: 'The trick is the problem', truth: 'It finds the problem' } },
  { p: 13, comp: 'CheckCard', props: { kicker: 'NOBODY HEARS IT', title: 'No sign of forced entry', items: [{ text: 'No broken glass' }, { text: 'No splintered frame' }, { text: 'Often no mark' }] } },
  { p: 14, comp: 'MythTruth', props: { kicker: 'REMEMBER THIS', myth: 'Latched means locked', truth: 'Latched is not locked' } },
  // S5 · el test
  { p: 15, comp: 'ProcessChips', props: { kicker: 'THE TEN SECOND TEST', title: 'Door closed, stand inside', steps: [{ title: 'Look at the edge' }, { title: 'Count the metal' }, { title: 'Find the plunger' }] } },
  { p: 16, comp: 'DoorEdgeCount', dur: 6.5, props: { mode: 'count' } },
  { p: 17, comp: 'DoorEdgeCount', dur: 6.5, props: { mode: 'plunger' } },
  { p: 18, comp: 'LatchCutaway', dur: 7.5, props: { mode: 'deadlatch' } },
  // S6 · la holgura
  { p: 19, comp: 'CheckCard', props: { kicker: 'IT ONLY WORKS IF', title: 'The plunger stays pressed', items: [{ text: 'The door closes tight' }, { text: 'It lands on the plate' }, { text: 'Not in the hole' }] } },
  { p: 20, comp: 'RouteFlow', props: { kicker: 'OVER THE YEARS', title: 'How a door drifts', steps: [{ label: 'The house settles' }, { label: 'Hinge screws loosen' }, { label: 'The door sags' }, { label: 'An eighth of an inch' }] } },
  { p: 21, comp: 'LatchCutaway', dur: 7.5, props: { mode: 'slack' } },
  // S7 · los 10 segundos + la guía
  { p: 22, comp: 'GapScanTest', dur: 7.5, props: { mode: 'loose' } },
  { p: 23, comp: 'GapScanTest', dur: 6.5, props: { mode: 'tight' } },
  { p: 24, comp: 'FixLadder', dur: 8.0, props: { highlight: 2 } },
  // S8 · arreglo 1
  { p: 26, comp: 'MythTruth', props: { kicker: 'FIX 1 · COSTS NOTHING', myth: 'The click means locked', truth: 'The click is the latch' } },
  { p: 27, comp: 'BoltMorph', dur: 7.5, props: { mode: 'morph' } },
  { p: 28, comp: 'RayChecklist', props: { kicker: 'FIX 1', title: 'Throw the deadbolt', items: [{ text: 'Every time you leave' }, { text: 'Every night' }, { text: 'Like checking the stove' }] } },
  // S9 · arreglo 2
  { p: 30, comp: 'HingeScrewPull', dur: 8.0, props: {} },
  { p: 31, comp: 'ScrewHero', dur: 6.0, props: { kicker: 'FIX 2 · ABOUT $3', title: '$3', sub: 'One three-inch screw in the top hinge.',
    pieces: [{ kind: 'stubby', x: 22, scale: 0.86, rot: -12 }, { kind: 'wood', x: 50, scale: 1.08, rot: -4, hero: true }, { kind: 'nail', x: 78, scale: 0.84, rot: 16 }] } },
  { p: 32, comp: 'SplitVs', props: { leftLabel: 'A sagging door', leftValue: 'Misses', rightLabel: 'After one screw', rightValue: 'Lands', verdict: 'The deadlatch works again.' } },
  // S10 · arreglo 3
  { p: 33, comp: 'ProcessChips', props: { kicker: 'FIX 3 · THE STRIKE', title: 'Line up the plate', steps: [{ title: 'A little up' }, { title: 'A little down' }, { title: 'Toward the stop' }] } },
  // S11 · arreglo 4
  { p: 35, comp: 'BigStat', props: { value: '$20–40', unit: 'entry knob', tone: 'brass', caption: 'Same holes. A screwdriver.' } },
  { p: 36, comp: 'RayChecklist', props: { kicker: 'AT THE STORE', title: 'Turn the box over', items: [{ text: 'A second little plunger' }, { text: 'Grade 1 or grade 2' }, { text: 'No plunger? Put it back' }] } },
  // S12 · arreglo 5
  { p: 37, comp: 'LatchGuardInstall', dur: 8.0, props: {} },
  { p: 38, comp: 'CheckCard', props: { kicker: 'LATCH GUARDS', title: 'Before you buy one', items: [{ text: 'Around $15 to $30' }, { text: 'Best on outswing doors' }, { text: 'Renting? Ask first' }] } },
  // S13 · arreglo 6
  { p: 40, comp: 'BoltMorph', dur: 7.5, props: { mode: 'throw' } },
  { p: 41, comp: 'SplitVs', props: { leftLabel: 'Box screws', leftValue: '3/4 in', rightLabel: 'Into the framing', rightValue: '3 in', verdict: 'Next he tries his shoulder.' } },
  { p: 42, comp: 'SplitVs', props: { leftLabel: 'Brand name bar', leftValue: '$125', rightLabel: 'Generic bar', rightValue: '$25', verdict: 'It is a bar. It pushes on the floor.' } },
  // S14 · el orden
  { p: 43, comp: 'FixLadder', dur: 9.0, props: { highlight: 6 } },
  { p: 45, comp: 'WorstSpots', props: { kicker: 'NOT JUST THE FRONT', title: 'The doors that worry me', spots: [{ label: 'Garage into the house' }, { label: 'Back door off the kitchen' }, { label: 'Side doors' }] } },
  // S15 · cierre
  { p: 50, comp: 'RayCta', dur: 34, props: {
    eyebrow: 'THE WHOLE DOOR, IN ORDER',
    title: 'The Thousand Dollar Afternoon',
    sub: 'Three guides, $27. The One Afternoon Door, the phone call, 37 free fixes.',
    domain: 'raykessler.vercel.app',
    qr: 'img/rkcard_qr.png', showQr: true } },
];
