// _v3/rkclaim_cfg.mjs — DRAFT (13-oct) "No Sign of Forced Entry" (rkma4). Secciones por PÁRRAFO de la voz (1-based = bloque+1).
// Estado: borrador para R2. Componentes, escalera y tratamiento de cámara quedan por cerrar cuando agnes vuelva
// (AGNES_PAUSA.md). Nada de esto se paga ni se renderiza hasta el veredicto de R2.
export const AVATAR_MODO = 'ventanas';
export const AVATAR_WIN_MIN = 1.6;
export const AVATAR_WIN_MAX = 10.0;
export const AVATAR_CAND_MAX = 8.6;
export const AVATAR_OBJ = 0.25;
export const REAL_BONUS = 3;
export const TRANSICIONES = true;

// Mapa de secciones (1-based, paragraph = block+1; 75 bloques).
export const SECCIONES = [
  { sec: 'S1',  rol: 'hook',    p0: 1,  p1: 2 },   // gancho: carta CLAIM DENIED + "It was never you" + promesa de 7 (1-2)
  { sec: 'S2',  rol: 'explica', p0: 3,  p1: 3 },   // intro Ray (3)
  { sec: 'S3',  rol: 'cta',     p0: 4,  p1: 4 },   // CTA nueva + QR + landing (4)
  { sec: 'S4',  rol: 'receta',  p0: 5,  p1: 13 },  // ITEM 1 frase de la carta (5-13, incluye "uncomfortable part")
  { sec: 'S5',  rol: 'receta',  p0: 14, p1: 20 },  // ITEM 2 renters vs owners
  { sec: 'S6',  rol: 'receta',  p0: 21, p1: 28 },  // ITEM 3 fotos antes de limpiar
  { sec: 'S7',  rol: 'receta',  p0: 29, p1: 35 },  // ITEM 4 número de reporte
  { sec: 'S8',  rol: 'receta',  p0: 36, p1: 42 },  // ITEM 5 recibos y serie
  { sec: 'S9',  rol: 'receta',  p0: 43, p1: 49 },  // ITEM 6 nada roto
  { sec: 'S10', rol: 'receta',  p0: 50, p1: 55 },  // ITEM 7 tornillos strike plate
  { sec: 'S11', rol: 'explica', p0: 56, p1: 60 },  // MYTH/MONEY
  { sec: 'S12', rol: 'cierre',  p0: 61, p1: 66 },  // CLOSE
];

// Escalera de planos (segundos) por rol — a completar con el juez de cobertura.
export const ESCALERA = {
  hook:    [3.0, 4.033, 7.2, 8.067, 3.6, 6.4, 4.033, 7.8, 2.9, 5.6, 8.0, 4.033],
  receta:  [3.2, 7.4, 4.033, 8.067, 3.0, 6.6, 7.8, 4.033, 5.2, 8.0, 3.4, 6.4],
  explica: [4.033, 7.6, 3.4, 8.067, 6.2, 2.9, 7.9, 4.033, 3.6, 6.8, 8.0, 4.6],
  cta:     [4.033, 7.8, 3.3, 7.6, 4.033, 6.2],
  cierre:  [4.033, 7.8, 3.3, 7.6, 4.033, 6.2, 3.8, 8.067, 7.0, 3.1, 4.033, 6.6],
};

export const CAM_DATE = '';
export const CLOCK0 = 0;
export const CAM = {};
export const ORDEN_FORZADO = { S1: ['rkclaim_s1_01'] };
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

// Componentes: VACÍOS en el borrador. Se llenan cuando las imágenes estén aprobadas (contador "N OF 7" obligatorio).
const I = (x) => `img/rkclaim_${x}.jpg`;
const SC = (p, props, dur) => ({ p, ...(dur ? { dur } : {}), comp: 'SceneCallout', props });
const N_COST = [
  { label: 'Read the page', cost: '$0', img: I('det_policy_theft_highlight') },
  { label: 'Longer screws', cost: 'about $25', img: I('det_screw_pile') },
  { label: 'Reinforcement kit', cost: 'about $60', img: I('det_reinforce') },
];
export const COMPONENTES = [
  { p: 4, dur: 8, comp: 'SceneCallout', props: { bg: 'img/rkclaim_landing.png', at: [50, 40], kicker: 'THE COMPLETE EDITION', label: 'Three guides and two bonus files', sub: 'The link is below' } },
  { p: 65, dur: 8, comp: 'VideoRefCard', props: { kicker: 'EARLIER VIDEO', title: 'Your Car Key Is Talking All Night', sub: 'Same rule, different car' } },
  SC(5,  { bg: I('det_letter_denied'), at: [50, 45], kicker: 'NUMBER 1 OF 7', label: 'Five words on the letter', color: 'danger' }, 8),
  { p: 7, comp: 'MythTruth', props: { kicker: 'NUMBER 1 OF 7 · TO BE FAIR', myth: 'No damage means no burglary', truth: 'It means nobody has written the reasons yet' } },
  { p: 9, dur: 6, comp: 'FixCostLadder', props: { items: [N_COST[0]], active: 0, kicker: 'NUMBER 1 OF 7 · FIX' } },
  SC(15, { bg: I('det_decl_page'), at: [50, 45], kicker: 'NUMBER 2 OF 7', label: 'The declarations page' }, 8),
  { p: 17, comp: 'SplitVs', props: { leftLabel: 'Owner form', leftValue: 'Check the theft words', rightLabel: 'Renters form', rightValue: 'Check the endorsement', verdict: 'Read the one you actually have.' } },
  SC(22, { bg: I('det_phone_door_photo'), at: [50, 45], kicker: 'NUMBER 3 OF 7', label: 'Photograph it first', sub: 'Before anything is cleaned.' }, 8),
  SC(25, { bg: I('det_strike_close'), at: [50, 50], kicker: 'NUMBER 3 OF 7', label: 'Frame, plate, latch', color: 'danger' }, 8),
  SC(30, { bg: I('det_police_form'), at: [50, 45], kicker: 'NUMBER 4 OF 7', label: 'Get the report number' }, 8),
  SC(33, { bg: I('det_report_note_fridge'), at: [50, 45], kicker: 'NUMBER 4 OF 7', label: 'Write it where you will see it' }, 7),
  SC(37, { bg: I('det_receipts_table'), at: [50, 45], kicker: 'NUMBER 5 OF 7', label: 'Receipts first', sub: 'Then the card statement.' }, 8),
  SC(40, { bg: I('det_serial_back'), at: [50, 50], kicker: 'NUMBER 5 OF 7', label: 'Serial number on the back' }, 8),
  SC(44, { bg: I('det_sash_hinge'), at: [50, 45], kicker: 'NUMBER 6 OF 7', label: 'Nothing was broken', color: 'danger' }, 8),
  { p: 48, comp: 'BigStat', props: { value: '60%', unit: 'of 422 offenders', caption: 'would look for another house if there was an alarm. UNC Charlotte, 2012.', tone: 'brass' } },
  SC(51, { bg: I('det_strike_short_vs_long'), at: [50, 50], kicker: 'NUMBER 7 OF 7', label: 'Short screws vs three inch', color: 'danger' }, 8),
  { p: 53, dur: 7, comp: 'FixCostLadder', props: { items: N_COST, active: 1, kicker: 'NUMBER 7 OF 7 · FIX TIERS' } },
  SC(58, { bg: I('det_kitchen_table_policy'), at: [50, 45], kicker: 'THE MYTH', label: 'A denial is not the end', sub: 'Ask for the reasons in writing.' }, 8),
  { p: 4, dur: 14, comp: 'RayCta', props: { title: 'The Thousand Dollar Afternoon', sub: 'Three guides and two bonus files', eyebrow: 'SCAN THE CODE', qr: 'img/rkclaim_qr.png', showQr: true } },
  { p: 64, dur: 10, comp: 'RayCta', props: { title: 'Scan the code again', eyebrow: 'THE COMPLETE EDITION', qr: 'img/rkclaim_qr.png', showQr: true } },
];
