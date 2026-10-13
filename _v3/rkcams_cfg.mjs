// _v3/rkcams_cfg.mjs — "They Spent $40,000 on Cameras. The Burglar Walked In Through the Door Nobody Filmed"
// Guion rkcams_GUION.txt: 60 parrafos, voz 20:55 (align 99,02 %). Secciones por PARRAFO (1-based).
// Tiempos de referencia (words json): hook 0:00 · intro 1:32 · CTA 1:59 · item1 2:22 · item2 4:45 · item3 6:42
// · item4 8:52 · item5 10:58 · item6 12:50 · item7 15:58 · dinero 17:13 · chain 19:15 · cierre 20:36.
export const AVATAR_MODO = 'ventanas';
export const AVATAR_WIN_MIN = 1.6;
export const AVATAR_WIN_MAX = 10.0;
export const AVATAR_CAND_MAX = 8.6;
export const AVATAR_OBJ = 0.20;
export const REAL_BONUS = 3;
export const TRANSICIONES = true;

export const SECCIONES = [
  { sec: 'S1',  rol: 'hook',    p0: 1,  p1: 5 },
  { sec: 'S2',  rol: 'explica', p0: 6,  p1: 7 },
  { sec: 'S3',  rol: 'receta',  p0: 8,  p1: 14 },
  { sec: 'S4',  rol: 'receta',  p0: 15, p1: 19 },
  { sec: 'S5',  rol: 'receta',  p0: 20, p1: 25 },
  { sec: 'S6',  rol: 'receta',  p0: 26, p1: 31 },
  { sec: 'S7',  rol: 'receta',  p0: 32, p1: 37 },
  { sec: 'S8',  rol: 'receta',  p0: 38, p1: 45 },
  { sec: 'S9',  rol: 'receta',  p0: 46, p1: 49 },
  { sec: 'S10', rol: 'explica', p0: 50, p1: 54 },
  { sec: 'S11', rol: 'prueba',  p0: 55, p1: 55 },
  { sec: 'S12', rol: 'cierre',  p0: 56, p1: 58 },
  { sec: 'S13', rol: 'cierre',  p0: 59, p1: 60 },
];

export const ESCALERA = {
  hook:    [3.0, 4.033, 7.2, 8.067, 3.6, 6.4, 4.033, 7.8, 2.9, 5.6, 8.0, 4.033],
  explica: [4.033, 7.6, 3.4, 8.067, 6.2, 2.9, 7.9, 4.033, 3.6, 6.8, 8.0, 4.6],
  receta:  [3.2, 7.4, 4.033, 8.067, 3.0, 6.6, 7.8, 4.033, 5.2, 8.0, 3.4, 6.4],
  prueba:  [4.033, 7.4, 3.2, 8.067, 6.6, 4.033, 3.5, 7.8, 2.8, 8.0, 6.0, 4.033],
  cierre:  [4.033, 7.8, 3.3, 7.6, 4.033, 6.2, 3.8, 8.067, 7.0, 3.1, 4.033, 6.6],
};

export const CAM_DATE = '';
export const CLOCK0 = 0;
export const CAM = {
  rkcams_n14_back_threshold: { label: 'BACK DOOR · CAM 2', off: 0 },
  rkcams_n08_camera_eave: { label: 'DRIVEWAY · CAM 1', off: 40 },
  rkcams_r20_front_camera: { label: 'FRONT DOOR · CAM 1', off: 90 },
  rkcams_r21_side_camera_view: { label: 'SIDE YARD · CAM 3', off: 150 },
  rkcams_n30_camera_angle: { label: 'DRIVEWAY · CAM 1', off: 210 },
  rkcams_m08_cam_eave: { label: 'GARAGE · CAM 4', off: 270 },
  rkcams_n40_garage_side: { label: 'SIDE WALL · CAM 3', off: 330 },
  rkcams_n21_garage_gap: { label: 'GARAGE · CAM 4', off: 390 },
};
// Foto de apertura del hook (miniatura real) y el primer cue del item 1 deben ir primero.
export const ORDEN_FORZADO = { S1: ['rkcams_h01_thumb_open'] };
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
  RaySecurityCam: '../rksafe/RaySecurityCam',
};

const I = (x) => `img/rkcams_${x}.jpg`;
const N3 = [
  { label: 'Replace the short screws', cost: '$0', img: I('r15_front_plate') },
  { label: 'Three inch screws into the stud', cost: '~$25', img: I('n02_short_screw') },
  { label: 'Solid strike and deadbolt', cost: '~$60', img: I('n18_plate_proud') },
];
const SC = (p, props, dur) => ({ p, ...(dur ? { dur } : {}), comp: 'SceneCallout', props });
const COUNT = (n) => `NUMBER ${n} OF 7`;

export const COMPONENTES = [
  // HOOK (0-50 s): la miniatura abre; luego el objeto del gancho
  SC(2, { bg: I('n14_back_threshold'), at: [55, 50], kicker: 'THE BACK DOOR', label: 'Open four inches', sub: 'Cameras pointed at the driveway.', color: 'danger' }, 7),
  SC(3, { bg: I('n08_camera_eave'), at: [50, 40], kicker: 'WHAT THE CAMERA SAW', label: 'The driveway. Not the door.' }, 7),
  SC(4, { bg: I('n19_trim_screws'), at: [50, 50], kicker: 'CHECK THIS FIRST', label: 'The one to check first', color: 'danger' }, 6),

  // INTRO + CTA (1:32-2:22): RayCta con QR y captura del landing (la captura real llega a R3)
  { p: 7, dur: 23, comp: 'RayCta', props: {
    eyebrow: 'THE THOUSAND DOLLAR AFTERNOON',
    title: 'Three guides, two bonus files',
    sub: 'Door by door, window by window. The link is below.',
    domain: 'raykessler.vercel.app/morning',
    qr: 'img/rkcams_qr.png', showQr: true, landing: 'img/rkcams_landing.png' } },

  // ITEM 1 - side door (2:22-4:45)
  SC(8, { bg: I('r02_side_kneel'), at: [50, 50], kicker: COUNT(1) + ' · THE SIDE DOOR', label: 'Frame first, lock second' }, 8),
  SC(9, { bg: I('n01_split_jamb'), at: [55, 50], kicker: COUNT(1), label: 'A split jamb', sub: 'Wood cracked along the grain.', color: 'danger' }, 8),
  { p: 10, comp: 'SplitVs', props: { leftLabel: 'Factory screws', leftValue: '3/4 inch in trim', rightLabel: 'Three-inch screws', rightValue: 'Into the stud', verdict: 'The frame holds the lock.' } },
  SC(12, { bg: I('r04_side_flash'), at: [50, 45], kicker: COUNT(1) + ' · CHECK TONIGHT', label: 'Flashlight on the gap', sub: 'Look at the latch side.' }, 7),
  { p: 13, dur: 6, comp: 'FixCostLadder', props: { items: N3, active: 0, kicker: 'THREE FIXES · $0 · ~$25 · ~$60' } },
  SC(14, { bg: I('r05_side_tighten'), at: [50, 50], kicker: COUNT(1) + ' · THE LINE', label: 'A short screw is a $3 problem', color: 'brass' }, 6),

  // ITEM 2 - garage to house (4:45-6:42)
  SC(15, { bg: I('n09_hollow_door'), at: [50, 50], kicker: COUNT(2) + ' · GARAGE TO HOUSE', label: 'The door nobody watches', color: 'danger' }, 8),
  SC(17, { bg: I('n09_hollow_door'), at: [60, 50], kicker: COUNT(2), label: 'The camera saw the driveway', sub: 'The dent was at knee height.' }, 8),
  SC(19, { bg: I('r14_back_tape'), at: [50, 50], kicker: COUNT(2) + ' · TAPE TRICK', label: 'Tape across the top edge', color: 'ok' }, 7),

  // ITEM 3 - sliding patio (6:42-8:52)
  SC(20, { bg: I('n03_patio_track'), at: [50, 50], kicker: COUNT(3) + ' · THE SLIDING DOOR', label: 'Two jobs, one bar', sub: 'Lock holds the glass sideways only.' }, 8),
  SC(22, { bg: I('n23_sliding_bar_short'), at: [50, 45], kicker: COUNT(3), label: 'A bar that does not reach', color: 'danger' }, 8),
  SC(24, { bg: I('r10_patio_bar'), at: [50, 50], kicker: COUNT(3) + ' · CHECK TONIGHT', label: 'Lift the door gently', sub: 'Any clunk means the track has play.' }, 7),
  { p: 25, dur: 6, comp: 'FixCostLadder', props: { items: N3, active: 1, kicker: COUNT(3) + ' · $0 · ~$25 · ~$60' } },

  // ITEM 4 - back door + window (8:52-10:58)
  SC(26, { bg: I('r12_back_window'), at: [50, 50], kicker: COUNT(4) + ' · BACK DOOR', label: 'The window beside the knob', color: 'danger' }, 8),
  SC(28, { bg: I('n07_latch_window'), at: [55, 50], kicker: COUNT(4), label: 'Painted-over latch', sub: 'Older than the family.' }, 7),
  SC(30, { bg: I('r13_back_dowel'), at: [50, 50], kicker: COUNT(4) + ' · STOP THE SLIDE', label: 'A dowel in the track', color: 'ok' }, 7),
  SC(31, { bg: I('m06_latch_old'), at: [50, 50], kicker: COUNT(4) + ' · GLASS FILM', label: 'Film on the lowest pane', color: 'brass' }, 6),

  // ITEM 5 - garage bottom seal (10:58-12:50)
  SC(32, { bg: I('blue_garage_door'), at: [50, 50], kicker: COUNT(5) + ' · THE GARAGE DOOR', label: 'Look at the bottom corner', sub: 'Photo: CC BY (credit on screen).' }, 8),
  SC(34, { bg: I('n21_garage_gap'), at: [50, 50], kicker: COUNT(5), label: 'A sliver of daylight', sub: 'Lie down. A camera records nothing.', color: 'danger' }, 8),
  SC(36, { bg: I('r07_garage_seal'), at: [50, 50], kicker: COUNT(5) + ' · CHECK TONIGHT', label: 'Flashlight from outside' }, 7),
  { p: 37, dur: 6, comp: 'FixCostLadder', props: { items: N3, active: 2, kicker: COUNT(5) + ' · $0 · ~$25 · ~$60' } },

  // ITEM 6 - front strike plate (12:50-15:58)
  SC(38, { bg: I('deadbolt_door_lock'), at: [50, 50], kicker: COUNT(6) + ' · THE FRONT DOOR', label: 'The lock is fine', sub: 'Photo: CC BY (credit on screen).' }, 8),
  SC(40, { bg: I('n06_strike_loose'), at: [55, 50], kicker: COUNT(6), label: 'The plate moved a quarter inch', color: 'danger' }, 8),
  SC(41, { bg: I('n19_trim_screws'), at: [50, 50], kicker: COUNT(6), label: 'Screws in the trim', sub: 'Not the wood under it.', color: 'danger' }, 7),
  SC(43, { bg: I('r16_front_push'), at: [50, 50], kicker: COUNT(6) + ' · CHECK TONIGHT', label: 'Push toward the frame', sub: 'Does the plate move?' }, 7),
  { p: 44, dur: 6, comp: 'FixCostLadder', props: { items: N3, active: 0, kicker: COUNT(6) + ' · $0 · ~$25 · ~$60' } },
  SC(45, { bg: I('n18_plate_proud'), at: [50, 50], kicker: COUNT(6) + ' · THE LINE', label: 'The lock keeps the bolt in. The plate keeps the door shut.', color: 'brass' }, 7),

  // ITEM 7 - cameras are a record (15:58-17:13): la lista de puertas fuera de cámara
  SC(46, { bg: I('r20_front_camera'), at: [50, 50], kicker: COUNT(7) + ' · CAMERAS', label: 'A record, not a lock', sub: 'It tells you afterward.' }, 7),
  SC(48, { bg: I('m09_package_box'), at: [50, 50], kicker: COUNT(7) + ' · THE LIST', label: 'Doors and windows NOT on camera', color: 'danger' }, 7),
  SC(49, { bg: I('r01_porch_keys'), at: [50, 50], kicker: COUNT(7) + ' · WALK THE LIST', label: 'Paper, pencil, one walk tonight', color: 'ok' }, 6),

  // MONEY (17:13-19:16): BigStat con la fuente en pantalla (BJS, 2003-2007)
  { p: 51, dur: 9, comp: 'BigStat', props: { value: '1 in 3', unit: 'completed burglaries used force', caption: 'Source: Bureau of Justice Statistics, household burglary data 2003-2007', tone: 'danger' } },
  SC(53, { bg: I('n10_insurance'), at: [50, 50], kicker: 'THE REPORT', label: 'No forced entry means a different claim', sub: 'Read your policy tonight.' }, 7),
  SC(54, { bg: I('r23_side_letter'), at: [50, 50], kicker: 'INSURANCE', label: 'Many policies have a theft section', sub: 'Read yours tonight.' }, 6),

  // CHAIN (19:15): VideoRefCard obligatorio
  { p: 55, dur: 8, comp: 'VideoRefCard', props: { kicker: 'ALSO ON THIS CHANNEL', title: 'Your Car Key Is Talking All Night', sub: 'The door your car opens, the same lesson.' } },

  // CIERRE (19:36-20:55): homework, siguiente video, QR otra vez
  SC(56, { bg: I('r19_van_invoice'), at: [50, 50], kicker: 'HOMEWORK', label: 'Check two things tonight' }, 6),
  { p: 58, dur: 6, comp: 'VideoRefCard', props: { kicker: 'NEXT ON THIS CHANNEL', title: 'Burglars Don\'t Come at Night', sub: 'The Hour I Got the Most Calls Will Surprise You' } },
  { p: 59, dur: 12, comp: 'RayCta', props: {
    eyebrow: 'THE THOUSAND DOLLAR AFTERNOON',
    title: 'The code is on your screen',
    sub: 'Every door, window and lock fix in one walkthrough.',
    domain: 'raykessler.vercel.app/morning',
    qr: 'img/rkcams_qr.png', showQr: true, landing: 'img/rkcams_landing.png' } },
];
