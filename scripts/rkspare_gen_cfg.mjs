// Generates _v3/rkspare_cfg.mjs and _v3/rkspare_prompts.mjs from the approved image list.
import fs from 'fs';
const W = 'D:/wt/rkspare/';
const I = (x) => `img/rkspare_${x}.jpg`;
const N3 = [
  { label: 'Check it tonight · pick up the rock', cost: '$0', img: I('r18_steps_thinking') },
  { label: 'Long screws · lockbox on a post', cost: '~$25', img: I('o17_short_vs_long') },
  { label: 'Keypad deadbolt', cost: '~$60', img: I('o20_keypad_deadbolt') },
];
const SC = (p, props, dur) => ({ p, ...(dur ? { dur } : {}), comp: 'SceneCallout', props });

// ---------- sections over the 61 paragraphs of rkspare_GUION.txt ----------
const SECCIONES = [
  { sec: 'S1', rol: 'hook', p0: 1, p1: 3 },
  { sec: 'S2', rol: 'explica', p0: 4, p1: 4 },
  { sec: 'S3', rol: 'prueba', p0: 5, p1: 7 },
  { sec: 'S4', rol: 'receta', p0: 8, p1: 13 },
  { sec: 'S5', rol: 'receta', p0: 14, p1: 18 },
  { sec: 'S6', rol: 'receta', p0: 19, p1: 23 },
  { sec: 'S7', rol: 'receta', p0: 24, p1: 28 },
  { sec: 'S8', rol: 'receta', p0: 29, p1: 33 },
  { sec: 'S9', rol: 'receta', p0: 34, p1: 38 },
  { sec: 'S10', rol: 'receta', p0: 39, p1: 43 },
  { sec: 'S11', rol: 'explica', p0: 44, p1: 47 },
  { sec: 'S12', rol: 'explica', p0: 48, p1: 51 },
  { sec: 'S13', rol: 'prueba', p0: 52, p1: 53 },
  { sec: 'S14', rol: 'receta', p0: 54, p1: 56 },
  { sec: 'S15', rol: 'cierre', p0: 57, p1: 61 },
];

// ---------- image pool: id, section, place, Ray (c=1) ----------
const POOL = [
  ['r01_fakerock','S1','porch',1,'close'],['o01_rock_open','S1','bench',0,'close'],['r18_steps_thinking','S1','porch',1,'medium'],['o42_rock_halves','S1','yard',0,'close'],
  ['r37_porch_bench','S2','porch',1,'medium'],['o28_front_door_dawn','S2','porch',0,'wide'],
  ['r47_dawn_knock','S3','porch',1,'medium'],['r43_doorway_glance','S3','hall',1,'medium'],['o44_door_gap','S3','hall',0,'close'],
  ['o02_rock_real','S4','yard',0,'wide'],['r26_bed_trowel','S4','yard',1,'medium'],['r49_rock_back','S4','yard',1,'close'],
  ['r02_mat','S5','porch',1,'medium'],['o03_mat_step','S5','porch',0,'close'],['o04_mat_checked','S5','porch',0,'wide'],
  ['r03_porchlight','S6','porch',1,'medium'],['o05_fixture_dust','S6','porch',0,'close'],['o06_fixture_bracket','S6','porch',0,'close'],['r23_camera_eave','S6','porch',1,'medium'],
  ['r38_grill_bag','S7','yard',1,'medium'],['o07_grill_shelf','S7','yard',0,'close'],['r04_grill','S7','yard',1,'medium'],
  ['r05_planter','S8','porch',1,'medium'],['o09_planter_soil','S8','porch',0,'close'],['o10_planter_clean','S8','porch',0,'wide'],['o43_fern_lean','S8','porch',0,'close'],['r48_planter_flash','S8','porch',1,'medium'],
  ['r06_mailbox','S9','street',1,'medium'],['o11_mailbox_open','S9','street',0,'close'],['o12_mailbox_inside','S9','street',0,'close'],['r39_street_talk','S9','street',1,'wide'],['o45_neighbor_drive','S9','street',0,'wide'],
  ['r07_backsteps','S10','porch',1,'medium'],['o13_step_loose','S10','porch',0,'close'],['o14_step_bag','S10','porch',0,'close'],['o36_pot_step','S10','porch',0,'wide'],
  ['r12_lockbox_mount','S11','garage',1,'medium'],['r13_keypad','S11','hall',1,'medium'],['o21_keypad_close','S11','hall',0,'close'],['o17_short_vs_long','S11','garage',0,'close'],['r14_neighbor_key','S11','street',1,'wide'],
  ['r15_insurance_folder','S12','kitchen',1,'medium'],['o23_policy_folder','S12','kitchen',0,'close'],['r45_envelope_numbers','S12','kitchen',1,'medium'],['o24_notepad_dates','S12','kitchen',0,'close'],['r27_counter_list','S12','kitchen',1,'wide'],
  ['r30_hall_check','S13','hall',1,'medium'],['r46_yard_walk','S13','yard',1,'wide'],
  ['r16_police_report','S14','street',1,'medium'],['o26_police_card','S14','kitchen',0,'close'],['o27_patrol_curb','S14','street',0,'wide'],['r20_garage_side','S14','garage',1,'medium'],
  ['r50_van_wave','S15','street',1,'wide'],['r33_van_tools','S15','garage',1,'medium'],['r35_key_ring','S15','kitchen',1,'medium'],['o39_checklist','S15','porch',0,'close'],['o35_spare_key','S15','kitchen',0,'close'],
];
const BAD_IDS = new Set(['o08_grill_lid','o15_jamb_dent','o18_lockbox_wall','o19_lockbox_close','o22_long_screws','o25_insurance_letter','o41_cylinder','r04_grill','r31_pegboard']);
const CAMERA = { close: 'Seen close up from about arm length, ', medium: 'Seen from a few steps back, ', wide: 'Seen from across the space in a wide view, ' };
const ITEMS = POOL.map(([id, sec, lugar, c, enc]) => ({
  id, sec, lugar, c, enc, mo: 'the light in the place shifts slightly',
  prompt: `${CAMERA[enc]}${id.replace(/^[a-z]\d+_/, '').replace(/_/g, ' ')} at an ordinary US suburban house, the only person in the frame is the homeowner or Ray when Ray is shown.`,
}));

// ---------- components (kit props only, no brand names, no technique) ----------
const COMPONENTES = [
  SC(1, { bg: I('r01_fakerock'), at: [55, 60], kicker: 'NUMBER ONE · 1 OF 7', label: 'A fake rock by the steps', color: 'danger' }, 9),
  SC(2, { bg: I('o42_rock_halves'), at: [50, 50], kicker: 'THE MORNING AFTER', label: 'It was never you', color: 'brass' }, 8),
  { p: 4, dur: 30, comp: 'RayCta', props: {
    eyebrow: 'THE THOUSAND DOLLAR AFTERNOON',
    title: 'Three guides, two bonus files',
    sub: 'Every door, window and lock fix. Less than one locksmith visit.',
    domain: 'raykessler.vercel.app/morning',
    qr: 'img/rkspare_qr.jpg', showQr: true } },
  SC(10, { bg: I('o01_rock_open'), at: [50, 50], kicker: 'WHAT PEOPLE BELIEVE', label: 'A hollow rock is invisible', color: 'danger' }, 8),
  { p: 12, comp: 'MythTruth', props: { kicker: 'TO BE FAIR', myth: 'A rock hides the key', truth: 'Real rocks differ. A fake one stands out.' } },
  SC(13, { bg: I('r49_rock_back'), at: [50, 45], kicker: 'NUMBER ONE · FIX', label: 'Take the key off the rock', color: 'ok', sub: 'Costs zero' }, 6),
  { p: 16, dur: 5, comp: 'FixCostLadder', props: { items: N3, active: 0, kicker: 'THE FIX · TIERS' } },
  SC(17, { bg: I('r02_mat'), at: [50, 55], kicker: 'NUMBER TWO · 2 OF 7', label: 'Lift your mat tonight', color: 'danger' }, 8),
  SC(19, { bg: I('r03_porchlight'), at: [50, 40], kicker: 'NUMBER THREE · 3 OF 7', label: 'The top of the light fixture', color: 'danger' }, 8),
  { p: 21, comp: 'SplitVs', props: { leftLabel: 'Hidden high up', leftValue: 'Looks safe', rightLabel: 'Visible to a passerby', rightValue: 'Stands out at night', verdict: 'High is not hidden.' } },
  SC(24, { bg: I('o07_grill_shelf'), at: [55, 50], kicker: 'NUMBER FOUR · 4 OF 7', label: 'The shelf you trust', color: 'danger' }, 8),
  SC(31, { bg: I('o09_planter_soil'), at: [50, 55], kicker: 'NUMBER FIVE · 5 OF 7', label: 'Soil that has been smoothed', color: 'danger' }, 8),
  SC(36, { bg: I('o11_mailbox_open'), at: [50, 45], kicker: 'NUMBER SIX · 6 OF 7', label: 'A box that is not yours', color: 'danger' }, 8),
  SC(41, { bg: I('o13_step_loose'), at: [50, 60], kicker: 'NUMBER SEVEN · 7 OF 7', label: 'Under the bottom step', color: 'danger' }, 8),
  { p: 44, dur: 6, comp: 'FixCostLadder', props: { items: N3, active: 1, kicker: 'WHAT ACTUALLY WORKS' } },
  SC(46, { bg: I('o17_short_vs_long'), at: [50, 50], kicker: 'LOCKBOX', label: 'Long screws into the framing', sub: 'Not the short screws in the package', color: 'ok' }, 9),
  SC(47, { bg: I('r13_keypad'), at: [50, 45], kicker: 'KEYPAD DEADBOLT', label: 'Nothing to hide', color: 'ok' }, 8),
  { p: 49, comp: 'MythTruth', props: { kicker: 'THIS CHANNEL DOES ARITHMETIC', myth: 'Hiding it well keeps it safe', truth: 'Burglars check the obvious places first.' } },
  SC(50, { bg: I('o23_policy_folder'), at: [55, 50], kicker: 'THE ARITHMETIC', label: 'Call two locksmiths', sub: 'Write both numbers on an envelope', color: 'brass' }, 9),
  { p: 54, comp: 'PullQuote', props: { quote: 'It was never you. It was the shortcut.', attrib: '— Ray' } },
  SC(55, { bg: I('o26_police_card'), at: [50, 50], kicker: 'IF YOU COME HOME', label: 'Step back, then call the police', color: 'danger' }, 8),
  SC(57, { bg: I('r20_garage_side'), at: [50, 50], kicker: 'ANOTHER VIDEO', label: 'Your Car Key Is Talking All Night', color: 'brass' }, 8),
  { p: 58, dur: 8, comp: 'VideoRefCard', props: { kicker: 'EARLIER ON THIS CHANNEL', title: 'Your Car Key Is Talking All Night', sub: 'The key you leave somewhere convenient' } },
  SC(59, { bg: I('r45_envelope_numbers'), at: [50, 50], kicker: 'COMMENTS', label: 'Which spot made you flinch?', color: 'brass' }, 7),
  { p: 60, dur: 8, comp: 'VideoRefCard', props: { kicker: 'NEXT VIDEO', title: 'Every Floor Safe I Opened After a Burglary Had the Same Problem', sub: 'and It Wasn\'t the Lock' } },
  { p: 61, dur: 30, comp: 'RayCta', props: {
    eyebrow: 'THE THOUSAND DOLLAR AFTERNOON',
    title: 'The code is on your screen',
    sub: 'Every item in this video, written out.',
    domain: 'raykessler.vercel.app/morning',
    qr: 'img/rkspare_qr.jpg', showQr: true } },
];

const CFG = `// _v3/rkspare_cfg.mjs — generated by scripts/rkspare_gen_cfg.mjs (13-oct)
export const AVATAR_MODO = 'ventanas';
export const AVATAR_WIN_MIN = 1.6;
export const AVATAR_WIN_MAX = 10.0;
export const AVATAR_CAND_MAX = 8.6;
export const AVATAR_OBJ = 0.25;
export const REAL_BONUS = 0;
export const TRANSICIONES = true;
export const SECCIONES = ${JSON.stringify(SECCIONES, null, 1)};
export const ESCALERA = {
  hook: [3.0, 4.033, 7.2, 8.067, 3.6, 6.4, 4.033, 7.8, 2.9, 5.6, 8.0, 4.033],
  prueba: [4.033, 7.4, 3.2, 8.067, 6.6, 4.033, 3.5, 7.8, 2.8, 8.0, 6.0, 4.033],
  explica: [4.033, 7.6, 3.4, 8.067, 6.2, 2.9, 7.9, 4.033, 3.6, 6.8, 8.0, 4.6],
  receta: [3.2, 7.4, 4.033, 8.067, 3.0, 6.6, 7.8, 4.033, 5.2, 8.0, 3.4, 6.4],
  cierre: [4.033, 7.8, 3.3, 7.6, 4.033, 6.2, 3.8, 8.067, 7.0, 3.1, 4.033, 6.6],
};
export const CAM_DATE = '';
export const CLOCK0 = 0;
export const CAM = {};
export const ORDEN_FORZADO = {};
export const OVERLAY = ['RayCta'];
export const IMPORTS = {
  PullQuote: '../rksafe/PullQuote', SplitVs: '../rksafe/SplitVs', MythTruth: '../rksafe/MythTruth',
  RayCta: '../rksafe/RayCta', VideoRefCard: '../rksafe/VideoRefCard', FixCostLadder: '../rksafe/FixCostLadder',
  SceneCallout: '../rksafe/SceneCallout',
};
export const COMPONENTES = ${JSON.stringify(COMPONENTES, null, 1)};
`;
const PROMPTS = `// _v3/rkspare_prompts.mjs — generated (13-oct)\nexport const ITEMS = ${JSON.stringify(ITEMS.filter(x => !BAD_IDS.has(x.id)), null, 1)};\n`;
fs.writeFileSync(W + '_v3/rkspare_cfg.mjs', CFG, { encoding: 'utf8' });
fs.writeFileSync(W + '_v3/rkspare_prompts.mjs', PROMPTS, { encoding: 'utf8' });
console.log('items', ITEMS.filter(x => !BAD_IDS.has(x.id)).length, 'componentes', COMPONENTES.length, 'secciones', SECCIONES.length);
const missing = ITEMS.filter(x => !BAD_IDS.has(x.id) && !fs.existsSync(W + 'public/img/' + x.id + '.jpg')).map(x => x.id);
console.log('missing jpg', missing);
