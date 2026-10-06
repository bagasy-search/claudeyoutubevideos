// DISEÑO DE SONIDO del canal Rhonda con la biblioteca común video2/public/sfx_pro (Mixkit + Freesound CC0, ver LICENCIAS.md).
// ⛔ Reemplaza a sfx_gen.mjs y a public/sfx del video 1: nada de eso se usa. Sin música (canal EN): ambiente + foley + diseño.
//   ambiente POR ESCENA (baño azulejado + ventilador, cocina/casa tranquila de Ohio, exterior de barrio, lavadero) sin huecos;
//   foley sincronizado a lo que SE VE en cada toma (por nombre/prompt de la toma); diseño en cada componente; ≥1 efecto por corte
//   del minuto 1 (whoosh rotando si la toma no trae foley). Devuelve { sfx: [{from, dur, src, vol, bus}], amb: [{from, dur, src}] }.
import fs from "node:fs";
export const LIB = "sfx_pro/";
const FPS = 30, F = (s) => Math.round(s * FPS);
const has = (pub, p) => fs.existsSync(pub + LIB + p);

// ── ambiente por escena (regex sobre nombre + prompt de la toma)
const AMB = [
  ["amb/amb_suburb_birds.flac", /ohio|street|porch|front door|steps|apartment building|suburb|house for sale|for-sale|backyard/i],
  ["amb/amb_house_birds_fridge.flac", /kitchen|coffee|table|phone|living room|sunroom|hallway|teapot|kettle|dishes|drugstore|pharmacy/i],
  ["amb/amb_laundry.flac", /laundry|washer|washing machine|dryer/i],
  ["amb/amb_bath_fan.flac", /fan|steam|ceiling/i],
];
const AMB_DEFAULT = "amb/amb_bath_tile.flac";
export function ambOf(c, prompt = "") { const t = (c.name || "") + " " + prompt; for (const [f, re] of AMB) if (re.test(t)) return f; return AMB_DEFAULT; }

// ── foley por lo que se ve (primera coincidencia gana); [archivo, vol, dur máx s, offset s]
const FOLEY = [
  [/squeegee/i, ["foley/squeegee_glass_a.flac", "foley/squeegee_glass_b.flac"], 0.5, 3, 0.15],
  [/spray|mist/i, ["foley/spray_trigger_a.flac", "foley/spray_trigger_b.flac", "foley/spray_trigger_c.flac"], 0.45, 1.6, 0.1],
  [/fizz|foam|bubbl|root beer/i, ["foley/fizz_tablet_a.flac", "foley/fizz_hydrophone.flac", "foley/fizz_tablet_b.flac", "foley/fizz_gentle.flac"], 0.42, 4, 0.05],
  [/toothbrush|grout brush|scrub|brush/i, ["foley/scrub_toothbrush.flac", "foley/scrub_floor.flac", "foley/scrub_pad.flac"], 0.38, 3, 0.1],
  [/pumice/i, ["foley/pumice_griddle.flac", "foley/sand_paper_a.flac"], 0.4, 3, 0.1],
  [/cutter|utility knife|box cutter/i, ["foley/cutter_extend.flac", "foley/cutter_cut.flac"], 0.45, 2, 0.1],
  [/paper towel|strip/i, ["foley/paper_towel_wet.flac", "foley/paper_towel_various.flac"], 0.4, 2.5, 0.1],
  [/plastic wrap|wrap/i, ["foley/plastic_wrapper.flac"], 0.35, 2, 0.1],
  [/glove/i, ["foley/glove_pull.flac", "foley/rubber_stretch.flac"], 0.4, 1.5, 0.1],
  [/rinse|shower head|handheld shower|water running|water streaming|water pouring|faucet|sink/i, ["foley/water_shower.flac", "foley/water_sink_run.flac"], 0.32, 3.5, 0],
  [/pour|glug|fills up/i, ["foley/water_pour_stream.flac", "foley/water_pour_short.flac"], 0.38, 3, 0.05],
  [/drip|drop|puddle|beaded/i, ["foley/drip_sink.flac", "foley/water_bubble.flac"], 0.32, 2.5, 0.2],
  [/towel|wipe|wiping|cloth|dry it|dries/i, ["foley/towel_wipe_hands.flac"], 0.4, 2, 0.1],
  [/valve/i, ["foley/cap_unscrew_jar.flac"], 0.42, 1.2, 0.1],
  [/plunger|scoop|bucket/i, ["foley/water_pour_short.flac", "foley/water_bubble.flac"], 0.38, 2, 0.05],
  [/switch|flips/i, ["foley/light_pull_switch.flac"], 0.45, 1, 0.15],
  [/washer|washing machine/i, ["foley/washer_running.flac", "foley/washer_spin_drain.flac"], 0.35, 4, 0],
  [/flush/i, ["foley/flush_bathroom.flac", "foley/flush_hard.flac"], 0.4, 4, 0.1],
  [/lid|cover pop|pulls the fan cover/i, ["foley/lid_toilet_heavy.flac", "foley/cap_open.flac"], 0.4, 1.2, 0.15],
  [/sets down|set down|bottle on|lifts the shampoo|sprayer onto|screwing/i, ["foley/cap_unscrew_jar.flac", "foley/cap_open.flac"], 0.38, 1.2, 0.1],
  [/curtain|liner/i, ["foley/shower_door_slide.flac", "foley/plastic_wrapper.flac"], 0.32, 1.5, 0.1],
  [/cabinet|closet/i, ["foley/cabinet_door_slide.flac"], 0.38, 1.2, 0.1],
  [/pen|marker|circled/i, ["design/pen_write.flac"], 0.38, 1.5, 0.15],
];
export function foleyOf(c, prompt, i) {
  const t = (c.name || "") + " " + (prompt || "");
  for (const [re, files, vol, dmax, off] of FOLEY) if (re.test(t)) return { src: files[i % files.length], vol, dmax, off };
  return null;
}
const WH = ["design/whoosh_air.flac", "design/whoosh_quick.flac", "design/whoosh_air_quick.flac", "design/whoosh_sweep_small.flac", "design/whoosh_cine_wind.flac", "design/whoosh_fast_trans.flac", "design/whoosh_air_deep.flac", "design/whoosh_cine_fast.flac"];

// ── diseño por componente: [archivo, vol, cuándo (s desde el inicio o fracción si <1 y frac), dur s]
function compFx(n, c, durS) {
  const P = c.props || {}, out = [];
  const add = (src, vol, at, dur) => out.push({ src, vol, at, dur });
  if (n === "RhChapter") { add("design/whoosh_sweep_long.flac", 0.34, -0.15, 1.6); add(P.alert ? "design/alarm_short.flac" : "design/impact_drum_subtle.flac", P.alert ? 0.22 : 0.42, 0.35, 1.8); if (P.alert) add("design/impact_drum_deep.flac", 0.4, 0.4, 2); }
  if (/3D$/.test(n)) { add("design/swell_wind.flac", 0.26, 0, Math.min(durS, 5)); }
  if (n === "RhGroutPore3D") {
    if (P.mode === "peroxide") add("foley/fizz_hydrophone.flac", 0.4, durS * 0.3, durS * 0.65);
    if (P.mode === "bleach" || P.mode === "paint") add("design/impact_heartbeat.flac", 0.45, durS * 0.55, 2.5);
    if (P.mode === "roots") add("design/texture_suspense.flac", 0.22, 0.2, durS - 0.2);
    if (P.mode === "scratch") add("foley/sand_paper_b.flac", 0.4, 0.4, 1.5);
    if (P.mode === "pores" || P.mode === "dry") add("foley/drip_sink.flac", 0.3, durS * 0.35, 2);
  }
  if (n === "RhMoldCalendar") {
    if (P.mode === "split") { add("design/camera_shutter.flac", 0.4, 0.05, 0.6); add("design/camera_shutter.flac", 0.4, 0.25, 0.6); add("design/impact_drum_subtle.flac", 0.35, 0.3, 1.5); }
    else if (P.mode === "days") { const n2 = (P.steps || []).length || 4; for (let k = 0; k < n2; k++) add("design/pen_write.flac", 0.36, 0.3 + k * (durS - 0.7) / n2, 0.9); add("design/impact_heartbeat.flac", 0.4, durS * 0.8, 2); }
    else if (P.mode === "months") { for (let k = 0; k < 4; k++) add("design/page_stiff.flac", 0.32, 0.15 + k * (durS - 0.5) / 4, 0.8); }
    else { add("design/pen_write.flac", 0.34, 0.4, 1.4); add("design/click_slide.flac", 0.3, 0.9, 0.5); }
  }
  if (n === "RhSwabTest") { add("design/paper_slide.flac", 0.34, 0.05, 0.8); if (P.mode === "top") add("foley/fizz_gentle.flac", 0.36, 0.5, durS - 0.5); if (P.mode === "under") add("design/impact_blow.flac", 0.3, durS * 0.5, 0.8); add("design/stamp_rubber.flac", 0.4, durS * 0.5, 0.8); }
  if (n === "RhWipeReveal") { add("design/riser_fast.flac", 0.34, -1.3, 1.6); add("foley/squeegee_glass_a.flac", 0.55, 0.1, Math.min(2.6, durS)); add("design/impact_drum_deep.flac", 0.42, durS * 0.55, 2.2); }
  if (n === "RhFogMirror") { const L = (P.lines || []).length || 1; for (let k = 0; k < L; k++) add("foley/rubber_squeak.flac", 0.3, 0.2 + k * durS * 0.7 / L, 0.9); add("foley/drip_sink.flac", 0.28, durS * 0.6, 1.8); }
  if (n === "RhPatchMeter") { add("design/click_slide.flac", 0.3, 0.2, 0.5); add("foley/paper_crinkle.flac", 0.32, 0.3, 1.2); add("design/stamp_traditional.flac", 0.42, durS * 0.5, 1); }
  if (n === "RhWetMap") { add("foley/water_shower.flac", 0.26, 0, Math.min(durS * 0.6, 3)); add("foley/drip_sink.flac", 0.3, durS * 0.55, 2); }
  if (n === "RhStrengthMeter") { add("foley/fizz_tablet_c.flac", 0.4, 0.4, durS - 0.5); add("design/impact_blow.flac", 0.26, durS * 0.65, 0.7); }
  if (n === "RhTimer30") { add("design/tick_timer.flac", 0.26, 0.1, Math.max(0.6, durS - 0.9)); add("design/ding_oven.flac", 0.4, Math.max(0.5, durS - (P.fast ? 0.2 : 0.65)), 1.6); }
  if (n === "RhNeverMix") { if (P.chart) add("design/page_turn_big.flac", 0.34, 0.1, 1); else { add("design/alarm_warning_buzzer.flac", P.soft ? 0.12 : 0.18, durS * 0.38, 0.9); add("design/stamp_es.flac", 0.45, durS * 0.42, 1); } }
  if (n === "RhBookPage") { add("design/page_turn_big.flac", 0.34, 0.05, 1); add("design/stamp_rubber.flac", 0.42, 0.75, 0.9); }
  if (n === "RhQRCard") { add("design/paper_slide.flac", 0.32, 0.1, 0.8); add("design/click_interface.flac", 0.3, 0.6, 0.5); }
  if (n === "RhCheck") { const k2 = (P.items || []).length; for (let k = 0; k < k2; k++) add("design/pen_write.flac", 0.3, 0.55 + k * Math.max(0.27, Math.min(1.33, (durS - 1) / k2)), 0.6); }
  if (n === "RhDoDont") { add("design/paper_slide.flac", 0.3, 0.1, 0.8); add("design/click_slide.flac", 0.3, 1.0, 0.5); }
  if (n === "RhBowlSection3D") {
    if (P.mode === "grow") { for (let k = 0; k < 4; k++) add("foley/drip_sink.flac", 0.26, 0.4 + k * durS / 4.5, 1.2); add("design/texture_suspense.flac", 0.2, 0.2, durS - 0.3); }
    if (P.mode === "paste") add("foley/fizz_tablet_a.flac", 0.4, durS * 0.25, durS * 0.65);
    if (P.mode === "pumice") add("foley/pumice_griddle.flac", 0.42, durS * 0.15, durS * 0.7);
    if (P.mode === "dry") { add("foley/sand_paper_a.flac", 0.45, durS * 0.15, durS * 0.7); add("design/impact_heartbeat.flac", 0.42, durS * 0.5, 2.2); }
    if (P.mode === "layers") add("design/impact_drum_subtle.flac", 0.38, durS * 0.3, 1.8);
    if (P.mode === "glaze") add("design/click_slide.flac", 0.3, 0.6, 0.5);
  }
  if (n === "RhPasteMix") { for (let k = 0; k < 4; k++) add(k < 3 ? "foley/paper_crinkle.flac" : "foley/water_pour_short.flac", 0.3, 0.25 + k * durS * 0.55 / 4, 0.8); add("foley/scrub_pad.flac", 0.3, durS * 0.62, durS * 0.3); }
  if (n === "RhWaterLevel") { add("foley/cap_unscrew_jar.flac", 0.4, 0.1, 1); add("foley/flush_bathroom.flac", 0.38, durS * 0.25, 3); add("foley/water_pour_short.flac", 0.36, durS * 0.55, 1.5); }
  if (n === "RhPumiceWetDry") { add("foley/pumice_griddle.flac", 0.38, 0.3, durS * 0.7); add("foley/sand_paper_b.flac", 0.4, 0.3, durS * 0.7); add("design/impact_blow.flac", 0.3, durS * 0.65, 0.8); }
  if (n === "RhHardWater") { for (let k = 0; k < 3; k++) add("design/camera_shutter.flac", 0.36, 0.15 + k * 0.27, 0.6); add("design/stamp_rubber.flac", 0.36, durS * 0.58, 0.9); }
  if (n === "RhRingColors") { add("design/paper_slide.flac", 0.34, 0.05, 0.9); if ((P.pick ?? -1) >= 0) add("design/click_interface.flac", 0.32, 0.35, 0.5); }
  if (n === "RhPins") add("design/pop_soap_bubble.flac", 0.36, 0.3, 0.6);
  if (n === "RhBottle3D") add("foley/cap_unscrew_jar.flac", 0.4, 0.2, 1.2);
  if (n === "RhMeasureCup") add("foley/water_pour_short.flac", 0.4, 0.3, 1.6);
  return out;
}

// cues = TL de gen_timeline (cuadros) · shots = tomas del director (prompt) · revelaciones = tiempos (s) con golpe grave
export function design(cues, shots, pub) {
  const sfx = [], amb = [], warn = [];
  const S = (atS, src, vol, durS, bus) => { if (!has(pub, src)) { warn.push("falta " + src); return; } sfx.push({ from: Math.max(0, F(atS)), dur: Math.max(3, F(durS)), src: LIB + src, vol, bus }); };
  const promptOf = (c) => { const s = shots.find((x) => x.name === c.name && x.name); return s ? ((s.prompt || "") + " " + (s.d1 || "") + " " + (s.d2 || "") + " " + (s.anim || "")).split(" One ordinary frame")[0] : ""; };
  let wi = 0, fi = 0;
  cues.forEach((c, i) => {
    const t = c.from / FPS, durS = c.dur / FPS, n = c.name || "";
    if (c.k === "comp") { for (const e of compFx(n, c, durS)) S(t + e.at, e.src, e.vol, e.dur, "design"); }
    else if (c.k !== "av" && c.k !== "vl") {
      const fo = foleyOf(c, promptOf(c), fi);
      if (fo) { fi++; S(t + fo.off, fo.src, fo.vol, Math.min(fo.dmax, durS), "foley"); }
      else if (t < 60 && i > 0) S(t - 0.12, WH[wi++ % WH.length], 0.22, 1.2, "design");
    }
    // minuto 1: TODO corte lleva su efecto (también los que van a Rhonda / avatar)
    if (t < 60 && i > 0 && (c.k === "av" || c.k === "vl")) S(t - 0.1, WH[wi++ % WH.length], 0.18, 1.0, "design");
  });
  // ambiente: tramos contiguos del mismo lugar (componentes heredan el lugar de la toma anterior; Rhonda habla en el baño)
  let cur = null, last = AMB_DEFAULT;
  cues.forEach((c) => {
    const a = c.k === "av" || c.k === "vl" ? AMB_DEFAULT : c.k === "comp" ? last : ambOf(c, promptOf(c));
    last = a; const src = LIB + a;
    if (cur && cur.src === src) cur.dur += c.dur; else { cur = { from: c.from, dur: c.dur, src }; amb.push(cur); }
  });
  // revelaciones marcadas en el director (opts.rev): golpe grave debajo de la palabra
  cues.forEach((c) => { if (c.rev) S(c.from / FPS + 0.05, "design/impact_heartbeat.flac", 0.42, 2.4, "design"); });
  return { sfx, amb, warn };
}
