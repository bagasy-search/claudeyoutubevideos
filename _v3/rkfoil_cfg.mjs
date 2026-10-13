// _v3/rkfoil_cfg.mjs — "Foil on the doorknob" (rkma) · 28 parrafos largos · tomado a mano por el director (13-oct)
// `q` = frase exacta del guion donde entra el componente (parche local de rksafe_plan); `p` = su parrafo.
// ⛔ El avatar YA ESTA PAGADO (14 ventanas largas): el plan sale SIN avatar y despues
//    `rkfoil_avatar_fijo.py` abre sub-ventanas de avatar sólo dentro de los tramos pagados.
export const AVATAR_MODO = 'ventanas';
export const AVATAR_WIN_MIN = 1.6;
export const AVATAR_WIN_MAX = 10.0;
export const AVATAR_CAND_MAX = 8.6;
export const AVATAR_OBJ = 0.0;
export const REAL_BONUS = 3;
export const TRANSICIONES = true;

export const SECCIONES = [
  { sec: 'S1',  rol: 'hook',    p0: 1,  p1: 5 },
  { sec: 'S2',  rol: 'explica', p0: 6,  p1: 7 },
  { sec: 'S3',  rol: 'prueba',  p0: 8,  p1: 8 },
  { sec: 'S4',  rol: 'receta',  p0: 9,  p1: 9 },
  { sec: 'S5',  rol: 'receta',  p0: 10, p1: 11 },
  { sec: 'S6',  rol: 'receta',  p0: 12, p1: 13 },
  { sec: 'S7',  rol: 'receta',  p0: 14, p1: 14 },
  { sec: 'S8',  rol: 'receta',  p0: 15, p1: 16 },
  { sec: 'S9',  rol: 'receta',  p0: 17, p1: 18 },
  { sec: 'S10', rol: 'receta',  p0: 19, p1: 21 },
  { sec: 'S11', rol: 'prueba',  p0: 22, p1: 24 },
  { sec: 'S12', rol: 'cierre',  p0: 25, p1: 28 },
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
export const ORDEN_FORZADO = { S1: ['rkfoil_h_knob_foil', 'rkfoil_h_frame_split'] };
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

const I = (x) => `img/rkfoil_${x}.jpg`;
const N3 = [
  { label: 'Three-inch strike screws', cost: 'under $10', img: I('n1_screws_compare') },
  { label: 'Deadbolt with a one-inch bolt', cost: '~$40-60', img: I('n4_ruler_bolt') },
  { label: 'Reinforcement strike plate', cost: '~$30-60', img: I('x_ray_reinforce') },
];
const SC = (p, q, props, dur) => ({ p, q, ...(dur ? { dur } : {}), comp: 'SceneCallout', props });
const CTA = {
  eyebrow: 'THE THOUSAND DOLLAR AFTERNOON',
  title: 'Three guides + two bonus files',
  sub: 'Door by door, window by window, for less than one locksmith visit.',
  domain: 'raykessler.vercel.app/morning',
  qr: 'img/rkfoil_qr.png', showQr: true, shot: 'img/rkfoil_landing.png' };

export const COMPONENTES = [
  // HOOK
  SC(1, 'That brass doorknob', { bg: I('h_knob_foil'), at: [50, 50], kicker: 'THE FOIL TRICK', label: 'Foil on the knob. A split frame beside it.', color: 'danger' }, 9),
  SC(4, "I'll tell you where my notes come from", { bg: I('m_invoice_paper'), at: [50, 50], kicker: 'MY NOTES', label: 'Three lines on every morning-after call' }, 8),
  { p: 5, q: 'So here is the promise', dur: 8, comp: 'FixCostLadder', props: { items: N3, caption: 'All three for less than one locksmith visit', active: 0, kicker: 'SEVEN THINGS · FOIL FIXES NONE' } },
  { p: 6, comp: 'PullQuote', props: { quote: 'I never caught a burglar. I just fixed the doors they came through.', attrib: '— Ray' } },
  { p: 7, dur: 18, comp: 'RayCta', props: CTA },

  // THE FOIL, FAIRLY
  SC(8, 'First, the foil', { bg: I('x_ray_foil_roll'), at: [50, 50], kicker: 'TO BE FAIR', label: 'Foil keeps paint off the brass', color: 'ok' }, 7),
  { p: 8, q: 'The idea people share', comp: 'MythTruth', props: { kicker: 'WHAT PEOPLE SHARE', myth: 'A torn wrapper tells you someone tried', truth: 'No evidence it keeps anyone out' } },

  // 1 · STRIKE PLATE
  SC(9, 'Number one. The strike plate.', { bg: I('n1_strike_short'), at: [50, 50], kicker: 'NUMBER ONE · 1 OF 7', label: 'The strike plate', color: 'danger' }, 7),
  { p: 9, q: 'The screws were the short ones', comp: 'SplitVs', props: { leftLabel: 'Box screws', leftValue: 'Half an inch, in the trim', rightLabel: 'Three-inch screws', rightValue: 'Into the stud', verdict: 'A firm kick tears the trim right off.' } },
  { p: 9, q: 'The fix is to swap those short screws', dur: 8, comp: 'FixCostLadder', props: { items: N3, caption: 'All three for less than one locksmith visit', active: 1, kicker: 'FIX · THREE-INCH SCREWS' } },

  // 2 · DEADBOLT
  SC(10, 'Number two. The deadbolt.', { bg: I('n2_bolt_gap'), at: [55, 50], kicker: 'NUMBER TWO · 2 OF 7', label: 'The deadbolt', color: 'danger' }, 7),
  { p: 10, q: 'That little spring latch', comp: 'MythTruth', props: { kicker: 'MOST PEOPLE BELIEVE', myth: 'The click means it is locked', truth: 'The click is the latch. The deadbolt is the lock.' } },
  SC(10, 'So here\'s your check. Go to the front door', { bg: I('n2_ray_check_bolt'), at: [50, 50], kicker: 'CHECK IT TONIGHT', label: 'Turn it. Feel where it stops.', color: 'ok' }, 7),

  // 3 · FRAME
  SC(12, 'Number three. The frame.', { bg: I('n3_paint_crack'), at: [50, 50], kicker: 'NUMBER THREE · 3 OF 7', label: 'The frame', color: 'danger' }, 7),
  SC(12, 'The homeowner had painted over it', { bg: I('n3_split_jamb_top'), at: [50, 45], kicker: 'WHAT I SAW', label: 'Split top to bottom, painted over' }, 8),
  { p: 12, q: 'The fix is a reinforcement strike plate', dur: 8, comp: 'FixCostLadder', props: { items: N3, caption: 'All three for less than one locksmith visit', active: 3, kicker: 'FIX · REINFORCEMENT PLATE' } },

  // 4 · THROW
  SC(14, "Number four. The deadbolt's throw.", { bg: I('n4_ruler_bolt'), at: [50, 50], kicker: 'NUMBER FOUR · 4 OF 7', label: "The deadbolt's throw", color: 'danger' }, 7),
  SC(14, 'So measure it.', { bg: I('n4_ray_ruler'), at: [50, 50], kicker: 'CHECK IT TONIGHT', label: 'Under one inch is a short throw', color: 'ok' }, 7),
  { p: 14, q: 'The fix is a deadbolt with a one-inch bolt', dur: 8, comp: 'FixCostLadder', props: { items: N3, caption: 'All three for less than one locksmith visit', active: 2, kicker: 'FIX · ONE-INCH BOLT' } },

  // 5 · SIDE DOOR
  SC(15, 'Number five. The side door.', { bg: I('n5_side_handle'), at: [50, 50], kicker: 'NUMBER FIVE · 5 OF 7', label: 'The side door', color: 'danger' }, 7),
  SC(15, 'So here\'s your check for tonight. Walk the whole house', { bg: I('n5_ray_side_door'), at: [50, 50], kicker: 'CHECK IT TONIGHT', label: 'Try every handle, garage door too', color: 'ok' }, 7),

  // 6 · GLASS
  SC(17, 'Number six. The glass near the lock.', { bg: I('n6_glass_broken'), at: [50, 50], kicker: 'NUMBER SIX · 6 OF 7', label: 'The glass near the lock', color: 'danger' }, 6),
  { p: 18, q: 'Police crime-prevention guides say that when there is glass', comp: 'SplitVs', props: { leftLabel: 'Thumb-turn inside', leftValue: 'Reachable through the glass', rightLabel: 'Double cylinder or film', rightValue: 'Key stays close for fire', verdict: 'Glass within about forty inches is part of the lock.' } },

  // 7 · DARK SIDE
  SC(19, 'Number seven. The dark side of the house.', { bg: I('n7_side_yard_dark'), at: [50, 50], kicker: 'NUMBER SEVEN · 7 OF 7', label: 'The dark side of the house', color: 'danger' }, 6),
  { p: 20, q: 'About eighty-three percent', dur: 9, comp: 'BigStat', props: { unit: '', value: '~83%', caption: 'checked for an alarm first · UNC Charlotte, 422 offenders (partly funded by the alarm industry)', tone: 'brass' } },
  SC(20, 'The morning after this one, the front porch light', { bg: I('n7_porch_bulb'), at: [50, 50], kicker: 'WHAT I SAW', label: 'Porch light out for a month', sub: 'Hedges tall enough to hide the door.' }, 8),
  { p: 21, comp: 'PullQuote', props: { quote: 'A sign is a claim, and a dog is a noise.', attrib: '— Ray' } },

  // ARITHMETIC
  { p: 22, dur: 8, comp: 'FixCostLadder', props: { items: N3, caption: 'All three for less than one locksmith visit', active: 0, picks: [1, 2, 3], kicker: 'THE SEVEN, IN THREE FIXES' } },
  { p: 23, comp: 'PullQuote', props: { quote: "This channel doesn't do villains, it does arithmetic.", attrib: '— Ray' } },
  { p: 24, comp: 'SplitVs', props: { leftLabel: 'One afternoon now', leftValue: 'A few fixes', rightLabel: 'The morning after', rightValue: 'A whole day gone', verdict: "I'll take the afternoon every time." } },

  // CLOSE
  SC(25, "Here's your homework", { bg: I('m_nurse_homework'), at: [50, 50], kicker: 'HOMEWORK', label: 'Strike screws + deadbolt, tonight', color: 'ok' }, 7),
  { p: 26, dur: 6, comp: 'VideoRefCard', props: { kicker: 'ALSO ON THIS CHANNEL', title: 'Your Car Key Is Talking All Night', sub: 'Watch it next' } },
  { p: 28, dur: 14, comp: 'RayCta', props: CTA },
];
