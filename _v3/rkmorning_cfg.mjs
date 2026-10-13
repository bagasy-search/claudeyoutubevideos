// _v3/rkmorning_cfg.mjs — "The Morning After" (rkma2) · 53 parrafos · tomado a mano por el director (13-oct)
// ⛔⛔ AVATAR PAGADO con _v3/rkmorning_plan.pagado.json: NO correr rksafe_plan otra vez (mueve las ventanas). Cambios de props → editar el plan.json directo.
export const AVATAR_MODO = 'ventanas';
export const AVATAR_WIN_MIN = 1.6;
export const AVATAR_WIN_MAX = 10.0;
export const AVATAR_CAND_MAX = 8.6;
export const AVATAR_OBJ = 0.225;
export const REAL_BONUS = 3;
export const TRANSICIONES = true;

export const SECCIONES = [
  { sec: 'S1',  rol: 'hook',    p0: 1,  p1: 4 },
  { sec: 'S2',  rol: 'explica', p0: 5,  p1: 6 },
  { sec: 'S3',  rol: 'receta',  p0: 7,  p1: 11 },
  { sec: 'S4',  rol: 'receta',  p0: 12, p1: 16 },
  { sec: 'S5',  rol: 'receta',  p0: 17, p1: 21 },
  { sec: 'S6',  rol: 'receta',  p0: 22, p1: 26 },
  { sec: 'S7',  rol: 'receta',  p0: 27, p1: 31 },
  { sec: 'S8',  rol: 'receta',  p0: 32, p1: 36 },
  { sec: 'S9',  rol: 'receta',  p0: 37, p1: 41 },
  { sec: 'S10', rol: 'prueba',  p0: 42, p1: 46 },
  { sec: 'S11', rol: 'cierre',  p0: 47, p1: 53 },
];

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
export const ORDEN_FORZADO = { S1: ['rkmorning_o01', 'rkmorning_r01'] };
export const OVERLAY = ['RayCta'];

export const IMPORTS = {
  PullQuote: '../rksafe/PullQuote',
  SplitVs: '../rksafe/SplitVs',
  MythTruth: '../rksafe/MythTruth',
  RayCta: '../rksafe/RayCta',
  VideoRefCard: '../rksafe/VideoRefCard',
  FixCostLadder: '../rksafe/FixCostLadder',
  SceneCallout: '../rksafe/SceneCallout',
  BigStat: '../rksafe/BigStat',
};

const I = (x) => `img/rkmorning_${x}.jpg`;
const N3 = [
  { label: 'Turn the deadbolt all the way', cost: '$0', img: I('x16b') },
  { label: 'Three-inch screws in the strike', cost: 'under $10', img: I('o07b') },
  { label: 'Frame reinforcement kit', cost: '~$30-60', img: I('o08') },
];
const SC = (p, props, dur) => ({ p, ...(dur ? { dur } : {}), comp: 'SceneCallout', props });
const CTA = {
  eyebrow: 'THE THOUSAND DOLLAR AFTERNOON',
  title: 'Three guides + two bonus files',
  sub: 'Door by door, window by window, for less than one locksmith visit.',
  domain: 'raykessler.vercel.app/morning',
  qr: 'img/rkmorning_qr.png', showQr: true, shot: 'img/rkmorning_landing.png' };

export const COMPONENTES = [
  // HOOK
  SC(1, { bg: I('o01'), at: [45, 60], kicker: 'THE MORNING AFTER', label: 'A strike plate on the porch', sub: 'I knew how they got in before I reached the door.', color: 'danger' }, 9),
  SC(2, { bg: I('x15'), at: [50, 50], kicker: '7:00 AM', label: 'We were asleep. Nobody heard a thing.' }, 8),
  { p: 4, dur: 8, comp: 'FixCostLadder', props: { items: N3, caption: 'All three for less than one locksmith visit', active: 0, kicker: 'SEVEN SIGNS · BEFORE THE DOOR' } },
  { p: 5, comp: 'PullQuote', props: { quote: 'I never once caught a burglar. I just fixed the doors they came through.', attrib: '— Ray' } },
  { p: 6, dur: 14, comp: 'RayCta', props: CTA },

  // 1 · SIDE GATE
  SC(7, { bg: I('o05'), at: [55, 45], kicker: 'NUMBER ONE · 1 OF 7', label: 'The side gate', color: 'danger' }, 7),
  { p: 8, comp: 'MythTruth', props: { kicker: 'MOST PEOPLE BELIEVE', myth: 'A closed gate is a closed gate', truth: 'If a hand reaches the latch, it opens' } },
  SC(10, { bg: I('r03'), at: [50, 50], kicker: 'CHECK IT TONIGHT', label: 'Flashlight on the wood by the latch', color: 'ok' }, 7),

  // 2 · LAWN PATH
  SC(12, { bg: I('o06'), at: [50, 50], kicker: 'NUMBER TWO · 2 OF 7', label: 'The path across the lawn', color: 'danger' }, 7),
  { p: 13, comp: 'MythTruth', props: { kicker: 'MOST PEOPLE BELIEVE', myth: 'They come up the driveway', truth: 'They come from the corner nobody walks' } },
  SC(16, { bg: I('x14'), at: [50, 50], kicker: 'THE FIX', label: 'Trim it. Light it.', color: 'ok' }, 7),

  // 3 · SCREEN
  SC(17, { bg: I('r08'), at: [50, 55], kicker: 'NUMBER THREE · 3 OF 7', label: 'The window screen', color: 'danger' }, 7),
  { p: 18, comp: 'MythTruth', props: { kicker: 'MOST PEOPLE BELIEVE', myth: 'Screens are decoration', truth: 'Every screen is a door with no lock' } },
  SC(21, { bg: I('r20'), at: [50, 50], kicker: 'THE FIX', label: 'A screw through each clip', color: 'ok' }, 7),

  // 4 · BOOT PRINT
  SC(22, { bg: I('o02'), at: [55, 60], kicker: 'NUMBER FOUR · 4 OF 7', label: 'The boot print on the door', color: 'danger' }, 7),
  SC(24, { bg: I('o24'), at: [50, 50], kicker: 'WHAT GAVE', label: 'The frame, not the door', sub: 'The lock is only as strong as the wood.' }, 8),
  { p: 26, dur: 8, comp: 'FixCostLadder', props: { items: N3, caption: 'All three for less than one locksmith visit', active: 3, kicker: 'FIX · REINFORCEMENT KIT' } },

  // 5 · DOOR GAP
  SC(27, { bg: I('o09'), at: [50, 50], kicker: 'NUMBER FIVE · 5 OF 7', label: 'The gap at the door edge', color: 'danger' }, 7),
  SC(30, { bg: I('x04'), at: [50, 50], kicker: 'CHECK IT TONIGHT', label: 'Slide a card down the gap', color: 'ok' }, 7),

  // 6 · STRIKE PLATE
  SC(32, { bg: I('r26'), at: [50, 50], kicker: 'NUMBER SIX · 6 OF 7', label: 'The strike plate', color: 'danger' }, 7),
  { p: 34, comp: 'SplitVs', props: { leftLabel: 'Factory screws', leftValue: 'Hold the trim', rightLabel: 'Three-inch screws', rightValue: 'Hold the house', verdict: 'The plate is only as strong as its screws.' } },
  { p: 36, dur: 8, comp: 'FixCostLadder', props: { items: N3, caption: 'All three for less than one locksmith visit', active: 2, kicker: 'FIX · THREE-INCH SCREWS' } },

  // 7 · DEADBOLT
  SC(37, { bg: I('o11'), at: [50, 50], kicker: 'NUMBER SEVEN · 7 OF 7', label: 'The deadbolt', color: 'danger' }, 7),
  { p: 39, comp: 'MythTruth', props: { kicker: 'MOST PEOPLE BELIEVE', myth: 'One lock means the door is locked', truth: 'Two locks. Two separate actions.' } },
  SC(40, { bg: I('x16b'), at: [50, 50], kicker: 'TEN SECONDS', label: 'Feel for the full stop', color: 'ok' }, 7),

  // ARITHMETIC
  { p: 42, comp: 'PullQuote', props: { quote: "This channel doesn't do villains, it does arithmetic.", attrib: '— Ray' } },
  { p: 43, dur: 9, comp: 'BigStat', props: { unit: '', value: '~3 in 10', caption: 'household burglaries were forcible entries · Bureau of Justice Statistics, 2003-2007', tone: 'brass' } },
  { p: 45, dur: 9, comp: 'BigStat', props: { unit: '', value: '~8 in 10', caption: 'checked for an alarm before choosing a house · UNC Charlotte, 2012 (422 offenders)', tone: 'danger' } },
  SC(46, { bg: I('x09'), at: [50, 50], kicker: 'INSURANCE', label: 'Some policies want visible force', sub: 'Read the wording before you need it.' }, 8),

  // CLOSE
  { p: 47, dur: 8, comp: 'FixCostLadder', props: { items: N3, caption: 'All three for less than one locksmith visit', active: 0, picks: [1, 2, 3], kicker: 'THE WHOLE LIST' } },
  { p: 48, comp: 'SplitVs', props: { leftLabel: 'Camera on the eave', leftValue: 'Records it', rightLabel: 'Screws in the frame', rightValue: 'Stops it', verdict: 'Fix the wood first.' } },
  { p: 49, dur: 6, comp: 'VideoRefCard', props: { kicker: 'ALSO ON THIS CHANNEL', title: 'Your Car Key Is Talking All Night', sub: 'Same idea, different door' } },
  { p: 53, dur: 16, comp: 'RayCta', props: CTA },
];
