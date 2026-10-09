// DISEÑO DE SONIDO del canal Claudio el Conserje con la biblioteca común public/sfx_pro (junction a D:/Proyectos/sfx_pro: Mixkit +
// Freesound CC0, ver LICENCIAS.md). ⛔ Reemplaza a los SFX de public/sfx del video 1 (clborde): nada de eso se usa. Sin música.
//   AMBIENTE por escena (baño azulejado, pasillo del hotel, lobby, oficina, cocina/casa, patio, lavadero; Claudio a cámara = taller de
//   mantenimiento) sin huecos · FOLEY sincronizado a lo que SE VE en cada toma (por nombre + prompt) · DISEÑO en cada componente y
//   overlay · ≥1 efecto por corte del minuto 1 (whoosh rotando si la toma no trae foley) · golpe grave en las revelaciones (opts.rev).
// Devuelve { sfx: [{from, dur, src, vol, bus}], amb: [{from, dur, src}], warn }.
import fs from "node:fs";
export const LIB = "sfx_pro/";
const FPS = 30, F = (s) => Math.round(s * FPS);
// "car/x" = foley propio del canal Old Mechanic en public/sfx_car (ElevenLabs, sfx_car_gen.mjs); el resto, la biblioteca común
export const PATH = (p) => (p.startsWith("car/") ? "sfx_car/" + p.slice(4) : LIB + p);
const has = (pub, p) => fs.existsSync(pub + PATH(p));

// ── ambiente por escena (regex sobre nombre + prompt de la toma), primera coincidencia gana
const AMB = [
  ["car/amb_car_interior.mp3", /driver's seat|dashboard|steering wheel|inside (a|the) car|car interior|glove ?box|headrest|sun visor|dome light|rear seat|back seat|fuel gauge|windshield from inside|grab handle/i],
  ["car/amb_shop.mp3", /repair shop|auto shop|lift|tool chest|workbench|pegboard|parts store|service counter/i],
  ["car/amb_driveway.mp3", /driveway|garage|suburban|porch|trunk|spare tire|bumper|gas station|pump|tire|wheel/i],
  ["amb/amb_fridge_hum.flac", /night|dark kitchen|flashlight|refrigerator|fridge|compressor/i],
  ["amb/amb_hotel_lobby.flac", /lobby|reception|checking in/i],
  ["amb/amb_hotel_hallway.flac", /corridor|hallway|cart|storeroom|guest-room door|room numbers|door numbered|service hallway/i],
  ["amb/amb_indoor_generic.flac", /office|desk|calendar|notebook|printed/i],
  ["amb/amb_suburb_birds.flac", /backyard|lawn|septic|cabins|resort/i],
  ["amb/amb_laundry.flac", /laundry|washer|washing machine|dryer/i],
  ["amb/amb_house_birds_fridge.flac", /kitchen|kettle|soda|cola|supermarket|store shelf|cider|glass at a kitchen/i],
  ["amb/amb_bath_fan.flac", /shower head|steam|fan/i],
  ["amb/amb_bath_tile.flac", /bathroom|shower|tiles/i],
];
const AMB_BATH = "car/amb_driveway.mp3", AMB_SHOP = "car/amb_shop.mp3";
export function ambOf(c, prompt = "") { const t = (c.name || "") + " " + prompt; for (const [f, re] of AMB) if (re.test(t)) return f; return AMB_BATH; }

// ── foley por lo que se ve (primera coincidencia gana): [regex, archivos, vol, dur máx s, offset s]
const FOLEY = [
  // ── mecánico (el auto de Doris)
  [/engine (start|turn|idl)|starts the (car|engine)|turns the key/i, ["car/engine_start.mp3"], 0.4, 3.5, 0.1],
  [/key fob|remote (lock|button)|presses (the )?(lock|unlock)/i, ["car/fob_chirp.mp3"], 0.42, 1.6, 0.1],
  [/trunk (lid|latch|open|pops|release)|opens the trunk|glow.?in.?the.?dark handle/i, ["car/trunk_pop.mp3"], 0.42, 2.2, 0.1],
  [/hood/i, ["car/hood_close.mp3"], 0.38, 1.6, 0.1],
  [/car door|door (closes|opens)|opens the (rear |back |driver's )?door/i, ["car/car_door_open.mp3", "car/car_door_close.mp3"], 0.4, 1.6, 0.1],
  [/headrest/i, ["car/seat_click.mp3"], 0.42, 1.2, 0.1],
  [/glove ?box/i, ["car/glovebox.mp3"], 0.42, 1.6, 0.1],
  [/gas cap|fuel cap/i, ["car/gas_cap.mp3"], 0.42, 2, 0.1],
  [/tire (gauge|pressure)|pressure gauge|air (hose|pump|machine)|inflat/i, ["car/tire_air.mp3"], 0.38, 2.6, 0.1],
  [/socket|ratchet|wrench|lug nut|wheel lock/i, ["car/ratchet.mp3"], 0.42, 1.6, 0.1],
  [/code reader|obd|plugs? (it )?in/i, ["car/obd_beep.mp3"], 0.42, 1.6, 0.1],
  [/rain|wiper|fogged|foggy windshield/i, ["car/wiper_rain.mp3"], 0.3, 4, 0],
  [/hook|clip|folds? down|compartment (opens|drops)/i, ["car/plastic_clip.mp3"], 0.42, 1, 0.1],
  [/turn signal|blinker|changing lanes/i, ["car/turn_signal.mp3"], 0.3, 3, 0],
  // ── fumigador (casa de los Ramírez)
  [/flashlight|switches on|switching it on/i, ["design/click_slide.flac", "foley/light_pull_switch.flac"], 0.42, 1, 0.05],
  [/(pull|push)\w* .*refrigerator|refrigerator .*(pulled|pushed) /i, ["foley/ceramic_scrape.flac", "foley/scrub_floor.flac"], 0.42, 2.5, 0.1],
  [/kibble|dog eat/i, ["foley/powder_pour.flac", "foley/stir_ceramic.flac"], 0.3, 1.6, 0.1],
  [/aerosol|insecticide can/i, ["foley/spray_liquid.flac"], 0.4, 1.8, 0.05],
  // ── albañil (casa de Doña Marta)
  [/aluminum foil|foil/i, ["foley/paper_crinkle.flac", "foley/paper_wrinkle.flac"], 0.4, 2, 0.05],
  [/packing tape/i, ["foley/plastic_wrapper.flac", "foley/paper_crinkle.flac"], 0.42, 1.6, 0.05],
  [/wardrobe.*(mov|push|slid|scrap)|(push|slid).*wardrobe|scraping across/i, ["foley/ceramic_scrape.flac", "foley/scrub_floor.flac"], 0.4, 2.5, 0.1],
  [/trowel|mortar|putty knife/i, ["foley/ceramic_scrape.flac", "foley/sand_paper_b.flac"], 0.4, 2.2, 0.1],
  [/roller|painting|paints the/i, ["foley/scrub_floor.flac", "foley/bucket_pour.flac"], 0.3, 2.4, 0.1],
  [/valve|shut-off/i, ["foley/valve_squeak.flac", "foley/valve_squeak.flac"], 0.42, 2.2, 0.1],
  [/cling film|plastic wrap/i, ["foley/plastic_wrapper.flac"], 0.38, 2.2, 0.1],
  [/tearing|toilet paper from a roll|roll of toilet/i, ["foley/tp_tear_a.flac", "foley/tp_tear_a.flac", "foley/tp_roll.flac"], 0.42, 2.2, 0.1],
  [/strip/i, ["foley/paper_towel_wet.flac", "foley/paper_towel_various.flac"], 0.4, 2.2, 0.1],
  [/pumice|stone/i, ["foley/pumice_griddle.flac", "foley/chalk_eraser.flac", "foley/sand_paper_b.flac", "foley/ceramic_scrape.flac"], 0.4, 2.8, 0.1],
  [/stir|spoon/i, ["foley/stir_ceramic.flac", "foley/stir_ceramic.flac", "foley/stir_ceramic.flac"], 0.38, 2.5, 0.05],
  [/baking soda|powder/i, ["foley/powder_pour.flac"], 0.38, 2, 0.05],
  [/paste|smear|sponge/i, ["foley/scrub_floor.flac", "foley/bucket_pour.flac"], 0.36, 2.2, 0.1],
  [/scoop|cup of water|bucket/i, ["foley/ladle_pour.flac", "foley/bucket_pour.flac", "foley/bucket_pour.flac"], 0.38, 2.5, 0.05],
  [/vinegar|pour|pouring/i, ["foley/water_pour_stream.flac", "foley/water_pour_short.flac"], 0.38, 2.6, 0.05],
  [/spray|squeez/i, ["foley/spray_trigger_a.flac", "foley/spray_trigger_a.flac"], 0.42, 1.6, 0.1],
  [/fizz|foam|bubbl/i, ["foley/fizz_tablet_a.flac", "foley/fizz_tablet_a.flac", "foley/fizz_hydrophone.flac"], 0.4, 3.5, 0.05],
  [/brush|scrub/i, ["foley/scrub_toilet.flac", "foley/scrub_floor.flac", "foley/scrub_floor.flac"], 0.38, 2.8, 0.1],
  [/flush|drains away|rushing/i, ["foley/flush_bathroom.flac", "foley/flush_hard.flac"], 0.4, 3.5, 0.1],
  [/lid/i, ["foley/lid_close_a.flac", "foley/lid_close_b.flac", "foley/seat_toilet_close.flac"], 0.42, 1.2, 0.15],
  [/keys|key ring/i, ["foley/keys_jingle.flac", "foley/keys_pickup.flac", "foley/keys_moving.flac"], 0.42, 2, 0.1],
  [/notebook|writing|pen /i, ["design/pencil_paper.flac", "design/pencil_strokes.flac"], 0.38, 2, 0.1],
  [/glove/i, ["foley/glove_pull.flac", "foley/rubber_stretch.flac"], 0.4, 1.5, 0.1],
  [/window/i, ["foley/cabinet_door_slide.flac"], 0.32, 1.2, 0.1],
  [/tap water|faucet|sink|running water|under running water/i, ["foley/water_sink_run.flac", "foley/water_shower.flac"], 0.32, 3, 0],
  [/drop|drip|droplet|beading/i, ["foley/water_bubble.flac", "foley/water_bubble.flac"], 0.32, 2.5, 0.2],
  [/fingernail|finger.*across|scraping/i, ["foley/ceramic_scrape.flac", "foley/chalk_eraser.flac"], 0.36, 1.6, 0.1],
  [/wip(e|ing)|cloth|towel/i, ["foley/towel_wipe_hands.flac"], 0.38, 2, 0.1],
  [/dolly|unbolted|wrench|plumber|installing/i, ["foley/cabinet_door_slide.flac", "foley/cap_open.flac"], 0.3, 1.2, 0.1],
  [/washing machine|washer/i, ["foley/washer_door_open.flac", "foley/washer_running.flac"], 0.35, 2.5, 0],
  [/cockroach|roaches|scatter|skitter/i, ["foley/paper_wrinkle.flac", "foley/paper_crinkle.flac"], 0.18, 1.6, 0.1],
];
export function foleyOf(c, prompt, i) {
  const t = (c.name || "") + " " + (prompt || "");
  for (const [re, files, vol, dmax, off] of FOLEY) if (re.test(t)) return { src: files[i % files.length], vol, dmax, off };
  return null;
}
const WH = ["design/whoosh_air.flac", "design/whoosh_quick.flac", "design/whoosh_air_quick.flac", "design/whoosh_sweep_small.flac", "design/whoosh_cine_wind.flac", "design/whoosh_fast_trans.flac", "design/whoosh_air_deep.flac", "design/whoosh_cine_fast.flac", "design/whoosh_windy.flac"];

// ── diseño por componente: [archivo, vol, cuándo (s desde el inicio de la toma), dur s]
function compFx(n, c, durS) {
  const P = c.props || {}, out = [];
  const add = (src, vol, at, dur) => out.push({ src, vol, at, dur });
  if (n === "ClChapter") { add("design/whoosh_sweep_long.flac", 0.32, -0.15, 1.6); add("foley/cutter_cut.flac", 0.34, 0.12, 1.2); add(P.alert ? "design/impact_echo.flac" : "design/impact_drum_subtle.flac", P.alert ? 0.2 : 0.4, 0.35, 1.8); }
  if (n === "ClHidden50") { add("foley/paper_wrinkle.flac", 0.2, durS * 0.3, 2.4); add("design/swell_suspense.flac", 0.26, durS * 0.28, 3); add("design/impact_drum_subtle.flac", 0.36, durS * 0.62, 1.4); }
  if (n === "ClFridgeBack") { add("foley/ceramic_scrape.flac", 0.3, 0.2, 1.4); [0.15, 0.35, 0.55, 0.73].forEach((k) => add("design/tick_single.flac", 0.34, durS * k, 0.6)); }
  if (n === "ClPeroxide") { add("foley/spray_trigger_a.flac", 0.38, 0.3, 0.8); add("foley/fizz_tablet_a.flac", 0.3, 0.8, Math.min(durS - 1, 4)); }
  if (n === "ClTrailMap") { add(P.mode === "erase" ? "foley/spray_trigger_a.flac" : "design/pencil_strokes.flac", 0.32, 0.4, 1.8); if (P.mode === "bait") add("design/stamp_rubber.flac", 0.3, 0.6, 0.8); }
  if (n === "ClFeatureTag") { add("design/paper_slide.flac", 0.4, 0.05, 1); add("design/impact_drum_subtle.flac", 0.3, 0.4, 1.2); }
  if (n === "ClGasArrow") { add("design/swell_suspense.flac", 0.2, 0.3, 2.2); add("design/click_interface.flac", 0.35, durS * 0.5, 0.6); }
  if (n === "ClCarMap") { add("design/click_slide.flac", 0.3, 0.4, 0.6); }
  if (n === "ClOBDScan") { add("car/obd_beep.mp3", 0.45, durS * 0.3, 1.2); }
  if (n === "ClFobHold") { add("design/click_interface.flac", 0.35, durS * 0.18, 0.5); add("design/swell_suspense.flac", 0.18, durS * 0.2, durS * 0.42); add("car/fob_chirp.mp3", 0.5, durS * 0.62, 1.2); }
  if (n === "ClCoinCell") { add("car/plastic_clip.mp3", 0.4, 0.15, 0.8); add("design/click_interface.flac", 0.3, durS * 0.2, 0.5); add("design/click_interface.flac", 0.3, durS * 0.32, 0.5); add("design/click_interface.flac", 0.3, durS * 0.44, 0.5); add("design/impact_drum_subtle.flac", 0.3, durS * 0.62, 1.2); }
  if (n === "ClOdoRace") { add("design/swell_suspense.flac", 0.2, 0.2, durS * 0.6); add("design/impact_drum_subtle.flac", 0.32, durS * 0.5, 1.2); add("design/impact_drum_subtle.flac", 0.3, durS * 0.75, 1.2); }
  if (n === "ClOilDrop") { add("foley/water_bubble.flac", 0.3, 0.6, 1); add("design/swell_suspense.flac", 0.18, 0.7, durS * 0.4); if (P.mode !== "drop") add("foley/scrub_floor.flac", 0.3, durS * 0.45, 1.4); }
  if (n === "ClDipLevel") { add("design/swell_suspense.flac", 0.2, 0.3, durS * 0.45); add("design/impact_drum_subtle.flac", 0.34, durS * 0.5, 1.2); }
  if (n === "ClCrankFoam") { add("design/swell_wind.flac", 0.22, 0, Math.min(durS, 5)); if (P.mode !== "ok") add("foley/water_bubble.flac", 0.3, durS * 0.3, Math.min(3, durS * 0.5)); }
  if (n === "ClResetSeq") { const k = (P.steps || []).length || 2; for (let i = 0; i < k; i++) { add("design/click_interface.flac", 0.36, 0.33 + i * (durS * 0.82 - 0.33) / k, 0.5); add("design/tick_single.flac", 0.3, 0.33 + (i + 0.78) * (durS * 0.82 - 0.33) / k, 0.5); } }
  if (n === "ClBrainMemory") { add("design/swell_suspense.flac", 0.2, 0.3, durS * 0.5); if (P.mode === "erase") add("design/impact_drum_subtle.flac", 0.34, durS * 0.55, 1.2); else add("design/click_slide.flac", 0.3, 0.4, 0.6); }
  if (n === "ClYesNo") { add("design/pencil_strokes.flac", 0.3, 0.3, 1.6); add("design/stamp_rubber.flac", 0.34, durS * 0.42 + 1.4, 0.8); }
  if (n === "ClFluidClock") { add("design/click_slide.flac", 0.3, 0.3, 0.6); add("design/click_interface.flac", 0.3, durS * 0.3, 0.5); add("design/click_interface.flac", 0.3, durS * 0.5, 0.5); }
  if (n === "ClDoorGap") { add("design/swell_suspense.flac", 0.22, 0.3, 2.4); if (P.mode === "sealed") { add("foley/rubber_stretch.flac", 0.34, durS * 0.22, 1); add("design/impact_drum_subtle.flac", 0.34, durS * 0.45, 1.2); } }
  if (n === "ClBarrierLine") { if (P.mode === "line") add("foley/chalk_eraser.flac", 0.34, 0.3, Math.min(durS * 0.3, 2.4)); if (P.mode === "herbs") [0.35, 0.6, 0.85, 1.1, 1.35].forEach((t) => add("design/tick_single.flac", 0.3, t, 0.5)); if (P.mode === "dog") add("design/stamp_rubber.flac", 0.3, durS * 0.62, 0.8); }
  if (n === "ClPerimeter30") { add("design/pencil_strokes.flac", 0.28, 0.3, 1.6); if (P.mode === "clean") add("foley/ceramic_scrape.flac", 0.26, durS * 0.22, 1.4); }
  if (n === "ClFoilTest") { add("foley/paper_crinkle.flac", 0.36, 0.4, 1.4); add("foley/paper_wrinkle.flac", 0.34, Math.min(durS - 1, 1.9), 1.4); }
  if (n === "ClTapeTest") { add("foley/plastic_wrapper.flac", 0.34, 0.3, 1); add("foley/ceramic_scrape.flac", 0.26, 0.8, 0.6); add("design/impact_drum_subtle.flac", 0.36, 1.47, 1.2); }
  if (n === "ClHouseMap") { add("design/pencil_strokes.flac", 0.32, 0.3, 1.8); }
  if (n === "ClWardrobeGap") { add("foley/ceramic_scrape.flac", 0.36, durS * 0.42, 1.6); }
  if (/3D$/.test(n)) add("design/swell_wind.flac", 0.24, 0, Math.min(durS, 5));
  if (n === "ClBowl3D") {
    if (P.mode === "layers") { const k = 6; for (let i = 0; i < k; i++) add("foley/water_bubble.flac", 0.26, 0.4 + i * (durS * 0.75) / k, 1.2); add("design/impact_heartbeat.flac", 0.36, durS * 0.72, 2.2); }
    if (P.mode === "brush") add("foley/scrub_toilet.flac", 0.4, 0.3, Math.min(3.5, durS - 0.4));
    if (P.mode === "lower") { add("foley/flush_bathroom.flac", 0.36, 0.2, 3.5); add("foley/water_tub_empty.flac", 0.26, 1.2, Math.min(3, durS - 1.3)); }
    if (P.mode === "paste") { add("foley/scrub_floor.flac", 0.32, 0.15, 1.2); add("foley/fizz_tablet_a.flac", 0.4, durS * 0.3, durS * 0.6); }
    if (P.mode === "vinegar") { add("foley/paper_towel_wet.flac", 0.36, 0.15, 1.6); add("design/texture_suspense.flac", 0.2, 0.6, durS - 0.8); add("design/ding_oven.flac", 0.3, durS * 0.78, 1.5); }
  }
  if (n === "ClValve3D") { add("foley/valve_squeak.flac", 0.45, 0.5, Math.min(2.6, durS * 0.45)); add("design/tick_single.flac", 0.4, durS * 0.47, 0.6); if (P.drain !== false) add("foley/flush_hard.flac", 0.36, durS * 0.62, 3); }
  if (n === "ClPumiceTest") { if (P.only !== "wet") add("foley/sand_paper_b.flac", 0.42, 0.25, Math.min(3, durS - 0.4)); if (P.only !== "dry") add("foley/pumice_griddle.flac", 0.36, P.only === "wet" ? 0.25 : 0.6, Math.min(3, durS - 0.6)); add("design/impact_echo.flac", 0.16, durS * 0.4, 1); }
  if (n === "ClPasteRecipe") { const a = P.a || 3, b = P.b || 1, per = Math.max(0.35, durS * 0.42 / (a + b)); for (let i = 0; i < a; i++) add("foley/powder_pour.flac", 0.38, 0.35 + i * per + per * 0.5, 0.7); for (let i = 0; i < b; i++) add("foley/water_pour_short.flac", 0.36, 0.35 + (a + i) * per + per * 0.5, 0.8); add("foley/stir_ceramic.flac", 0.4, 0.35 + (a + b) * per, Math.min(2.5, durS * 0.3)); }
  if (n === "ClNotebook") { const k = (P.rows || []).length || 3; if (P.strike) { for (let i = 0; i < k; i++) add("design/pencil_strokes.flac", 0.4, 0.4 + i * durS * 0.5 / k, 0.9); add("design/impact_drum_subtle.flac", 0.36, durS * 0.62, 1.6); } else { add("design/page_stiff.flac", 0.3, 0.05, 0.8); for (let i = 0; i < k; i++) add("design/pencil_paper.flac", 0.4, 0.35 + i * durS * 0.65 / k, 1.1); } }
  if (n === "ClVideoRef") { add("design/camera_shutter.flac", 0.36, 0.1, 0.6); add("design/click_interface.flac", 0.32, 0.55, 0.5); if (P.next) add("design/riser_fast.flac", 0.26, durS - 1.6, 1.6); }
  if (n === "ClWasher3D") {
    if (P.mode === "peel" || P.mode === "spray") { add("foley/rubber_stretch.flac", 0.42, 0.3, 1.5); add("foley/rubber_squeak.flac", 0.3, 0.9, 0.9); }
    if (P.mode === "spray") { add("foley/spray_trigger_a.flac", 0.42, durS * 0.12, 1.2); add("foley/fizz_tablet_a.flac", 0.36, durS * 0.3, durS * 0.55); }
    if (P.mode === "cycle") { add("foley/washer_door_close.flac", 0.4, 0.05, 1.2); add("foley/washer_running.flac", 0.38, 0.4, durS - 0.5); }
    if (P.mode === "ajar") { add("foley/washer_door_open.flac", 0.4, 0.1, 1.4); add("design/whoosh_slow_sweep.flac", 0.22, durS * 0.3, 2); }
    if (P.mode === "filter") { add("foley/cap_open.flac", 0.4, 0.4, 1); add("foley/washer_drain_water.flac", 0.38, durS * 0.35, durS * 0.55); }
  }
  if (n === "ClFilterFind") { const k = (P.items || []).length || 5, per = Math.max(0.35, durS * 0.7 / k); for (let i = 0; i < k; i++) add(i === k - 1 ? "design/impact_drum_subtle.flac" : "foley/water_bubble.flac", i === k - 1 ? 0.4 : 0.3, 0.3 + i * per + 0.3, 1); add("design/pop_soap_bubble.flac", 0.3, 0.3 + (k - 1) * per + 0.45, 0.6); }
  if (n === "ClDoseCap") { add("foley/water_pour_short.flac", 0.36, 0.3, Math.min(2, durS * 0.3)); add("foley/water_pour_stream.flac", 0.34, durS * 0.45, Math.min(2, durS * 0.3)); add("design/impact_echo.flac", 0.26, durS * 0.62, 1.2); }
  if (n === "ClSmellTest") { const k = (P.spots || []).length || 3, per = Math.max(0.35, durS * 0.55 / k); for (let i = 0; i < k; i++) add("design/tick_single.flac", 0.3, 0.3 + i * per, 0.5); add("design/stamp_rubber.flac", 0.38, 0.3 + k * per + 0.15, 0.8); }
  if (n === "ClPores3D") {
    if (P.mode === "roots") add("design/texture_suspense.flac", 0.22, 0.2, durS - 0.3);
    if (P.mode === "bleach") { add("foley/spray_trigger_a.flac", 0.4, 0.3, 1); add("design/impact_heartbeat.flac", 0.42, durS * 0.75, 2.2); }
    if (P.mode === "peroxide") { add("foley/spray_trigger_a.flac", 0.4, 0.2, 1); add("foley/fizz_hydrophone.flac", 0.4, durS * 0.3, durS * 0.6); }
    if (P.mode === "spores") { add("foley/scrub_floor.flac", 0.4, 0.3, Math.min(3, durS - 0.4)); add("design/swell_suspense.flac", 0.24, durS * 0.3, durS * 0.6); }
  }
  if (n === "ClSwab") { add("design/paper_slide.flac", 0.3, 0.1, 0.8); add("foley/fizz_tablet_a.flac", 0.38, 0.9, durS * 0.5); add("design/impact_echo.flac", 0.22, durS * 0.55, 1.2); }
  if (n === "ClSpores") { add("foley/scrub_floor.flac", 0.36, 0.1, 1.6); add("design/swell_suspense.flac", 0.28, 0.4, durS - 0.6); add("design/stamp_rubber.flac", 0.34, durS * 0.5, 0.8); }
  if (n === "ClFlashlight") { add("foley/light_pull_switch.flac", 0.42, 0.15, 0.8); add("design/whoosh_slow_sweep.flac", 0.24, 0.5, durS - 0.8); }
  if (n === "ClWallLeak") { add("foley/water_bubble.flac", 0.36, 0.3, durS - 0.4); add("design/impact_heartbeat.flac", 0.36, durS * 0.6, 2); }
  if (n === "ClHygrometer") { add("design/tick_clock_close.flac", 0.24, 0.2, durS * 0.5); add("foley/cabinet_door_slide.flac", 0.3, durS * 0.55, 1.2); }
  if (n === "ClTray3D") {
    if (P.mode === "layers") { const k = 7; for (let i = 0; i < k; i++) add("design/tick_single.flac", 0.26, 0.4 + i * (durS * 0.75) / k, 0.5); add("foley/ding_oven.flac".replace("foley", "design"), 0.32, durS * 0.8, 1.4); }
    if (P.mode === "detergent") { add("foley/water_sink_run.flac", 0.3, 0.2, durS - 0.4); add("foley/water_bubble.flac", 0.3, durS * 0.5, 1.5); }
    if (P.mode === "paste") { add("foley/powder_pour.flac", 0.36, 0.15, 1.4); add("foley/fizz_tablet_a.flac", 0.38, durS * 0.35, durS * 0.55); }
    if (P.mode === "flake") { add("foley/scrub_floor.flac", 0.4, 0.2, durS * 0.6); add("foley/paper_crinkle.flac", 0.34, durS * 0.35, durS * 0.5); }
  }
  if (n === "ClPasteCheck") { add("foley/scrub_floor.flac", 0.3, 0.35, 0.8); add("foley/scrub_floor.flac", 0.3, 1.0, 0.8); add("design/impact_drum_subtle.flac", 0.34, 1.6, 1.2); add("foley/scrub_floor.flac", 0.3, 1.7, 0.8); }
  if (n === "ClCoating") { add("foley/sand_paper_b.flac", 0.4, 0.25, Math.min(3, durS * 0.5)); add("foley/scrub_floor.flac", 0.32, 0.6, Math.min(3, durS * 0.5)); }
  if (n === "ClTally") { add("design/pencil_strokes.flac", 0.34, 0.3, durS * 0.45); add("design/stamp_rubber.flac", 0.38, durS * 0.7, 0.8); }
  if (n === "ClReceipt") { add("design/paper_slide.flac", 0.34, 0.2, Math.min(3, durS * 0.5)); add("design/ding_oven.flac", 0.34, durS * 0.65, 1.4); }
  if (n === "ClCaulk3D") {
    if (P.mode === "inside") add("design/texture_suspense.flac", 0.22, 0.2, durS - 0.3);
    if (P.mode === "spray") { add("foley/spray_trigger_a.flac", 0.42, 0.3, 1); add("foley/water_bubble.flac", 0.32, 1.2, durS - 1.4); }
    if (P.mode === "strips" || P.mode === "under") { add("foley/paper_towel_wet.flac", 0.38, 0.15, 1.6); add("foley/plastic_wrapper.flac", 0.36, 1.0, 1.6); add("design/ding_oven.flac", 0.3, durS * 0.85, 1.4); }
    if (P.mode === "seal") { add("foley/cutter_cut.flac", 0.36, 0.2, 1); add("design/impact_heartbeat.flac", 0.4, durS * 0.6, 2.2); }
  }
  if (n === "ClFilmWrap") { const k = P.n || 6, per = Math.max(0.2, durS * 0.45 / k); for (let i = 0; i < k; i++) add("foley/paper_towel_wet.flac", 0.3, 0.3 + i * per, 0.7); add("foley/plastic_wrapper.flac", 0.42, 0.3 + k * per, 1.8); }
  if (n === "ClTubMap") { add("design/tick_clock_close.flac", 0.24, 0.3, durS * 0.6); add("design/ding_oven.flac", 0.36, durS * 0.72, 1.4); add("design/stamp_rubber.flac", 0.36, durS * 0.8, 0.8); }
  if (n === "ClCaulkGun") { add("foley/tp_roll.flac", 0.32, 0.2, 1); add("foley/cap_open.flac", 0.3, durS * 0.22, 0.8); add("foley/scrub_floor.flac", 0.3, durS * 0.5, 1.2); add("foley/tp_tear_a.flac", 0.32, durS * 0.72, 0.9); }
  if (n === "ClTimer30") { add("design/tick_clock_close.flac", 0.26, 0.1, Math.max(0.6, durS - 0.9)); add(P.overnight ? "design/ding_oven.flac" : "design/ding_oven.flac", 0.4, Math.max(0.5, durS - (P.fast ? 0.2 : 0.65)), 1.6); }
  if (n === "ClNeverMix") { if (P.chart) add("design/page_turn_big.flac", 0.34, 0.1, 1); else if (P.soft) { add("design/pop_soap_bubble.flac", 0.34, durS * 0.4, 0.7); add("design/stamp_rubber.flac", 0.38, durS * 0.42, 0.8); } else { add("design/alarm_warning_buzzer.flac", P.short ? 0.12 : 0.18, durS * 0.38, 0.9); add("design/stamp_rubber.flac", 0.45, durS * 0.42, 1); } }
  if (n === "ClBookPage") { add("design/page_turn_big.flac", 0.34, 0.05, 1); add("design/stamp_rubber.flac", 0.42, 0.95, 0.9); }
  if (n === "ClQRCard") { add("design/paper_slide.flac", 0.32, 0.1, 0.8); add("design/click_interface.flac", 0.3, 0.6, 0.5); }
  if (n === "ClCheck") { const k2 = (P.items || []).length; for (let k = 0; k < k2; k++) add("design/pen_write.flac", 0.3, 0.55 + k * Math.max(0.27, Math.min(1.33, (durS - 1) / k2)), 0.6); }
  if (n === "ClDoDont") { add("design/paper_slide.flac", 0.3, 0.1, 0.8); add("design/click_slide.flac", 0.3, 1.0, 0.5); }
  if (n === "ClPins") { const k3 = (P.pins || []).length || 3; for (let k = 0; k < k3; k++) add("design/pop_soap_bubble.flac", 0.34, 0.4 + k * 0.6, 0.6); }
  if (n === "ClColorCode") { add("design/paper_slide.flac", 0.3, 0.05, 0.8); add("design/click_slide.flac", 0.32, 0.2, 0.5); }
  if (n === "ClSplit") { add("design/whoosh_slow_sweep.flac", 0.3, 0.1, 1.4); add("design/impact_drum_subtle.flac", 0.3, 0.6, 1.4); }
  if (n === "ClBeforeAfter") { add("design/riser_fast.flac", 0.3, durS * 0.18 - 1.2, 1.4); add("design/whoosh_cine_fast.flac", 0.34, durS * 0.2, 1.2); add("design/impact_drum_deep.flac", 0.4, durS * 0.62, 2); }
  if (n === "ClHallway3D") { add("design/tick_single.flac", 0.3, 0.2, 0.5); add("foley/keys_jingle.flac", 0.3, durS * 0.6, 1.4); }
  if (n === "ClBottle3D") add("foley/cap_unscrew_jar.flac", 0.4, 0.2, 1.2);
  if (n === "ClMeasureCup") add("foley/water_pour_short.flac", 0.4, 0.3, 1.6);
  if (n === "ClRimJets") add(P.mode === "spray" ? "foley/spray_trigger_a.flac" : "foley/fizz_tablet_c.flac", 0.36, 0.2, 2);
  if (n === "ClMicroscope3D") add("design/swell_suspense.flac", 0.26, 0.2, Math.min(durS, 4));
  return out;
}
const ovFx = (o) => (o.name === "ClStampOv" ? [["design/stamp_rubber.flac", 0.45, 0.2, 1], ["design/impact_blow.flac", 0.3, 0.18, 0.8]] : o.name === "ClNameTag" ? [["design/click_slide.flac", 0.3, 0.15, 0.5]] : o.name === "ClAsk" ? [["design/pop_soap_bubble.flac", 0.32, 0.3, 0.6]] : [["design/click_interface.flac", 0.28, 0.1, 0.5]]);

// cues = TL de gen_timeline (cuadros) · shots = tomas del director (prompt) · ovs = overlays
export function design(cues, shots, pub, ovs = []) {
  const sfx = [], amb = [], warn = [];
  const S = (atS, src, vol, durS, bus) => { if (!has(pub, src)) { warn.push("falta " + src); return; } sfx.push({ from: Math.max(0, F(atS)), dur: Math.max(3, F(durS)), src: PATH(src), vol, bus }); };
  const promptOf = (c) => { const s = shots.find((x) => x.name === c.name && x.name); return s ? ((s.prompt || "") + " " + (s.d1 || "") + " " + (s.d2 || "") + " " + (s.anim || "")).split(" One ordinary frame")[0] : ""; };
  let wi = 0, fi = 0;
  cues.forEach((c, i) => {
    const t = c.from / FPS, durS = c.dur / FPS, n = c.name || "";
    if (c.k === "comp") { for (const e of compFx(n, c, durS)) S(t + e.at, e.src, e.vol, e.dur, "design"); if (t < 60 && i > 0) S(t - 0.1, WH[wi++ % WH.length], 0.16, 1.0, "design"); }
    else if (c.k !== "av" && c.k !== "vl") {
      const fo = foleyOf(c, promptOf(c), fi);
      if (fo) { fi++; S(t + fo.off, fo.src, fo.vol, Math.min(fo.dmax, durS), "foley"); }
      if (t < 60 && i > 0 && !fo) S(t - 0.12, WH[wi++ % WH.length], 0.22, 1.2, "design");
      else if (t < 60 && i > 0) S(t - 0.08, WH[wi++ % WH.length], 0.13, 0.9, "design");
    }
    // minuto 1: TODO corte lleva su efecto (también los que vuelven a Claudio)
    if (t < 60 && i > 0 && (c.k === "av" || c.k === "vl")) S(t - 0.1, WH[wi++ % WH.length], 0.18, 1.0, "design");
  });
  for (const o of ovs) for (const [src, vol, at, d] of ovFx(o)) S(o.from / FPS + at, src, vol, d, "design");
  // ambiente: tramos contiguos del mismo lugar (componentes heredan el lugar de la toma anterior; Claudio a cámara = su taller)
  let cur = null, last = AMB_BATH;
  cues.forEach((c) => {
    const a = c.k === "av" || c.k === "vl" ? AMB_SHOP : c.k === "comp" ? last : ambOf(c, promptOf(c));
    if (c.k !== "av" && c.k !== "vl") last = a; const src = PATH(a);
    if (!has(pub, a)) warn.push("falta amb " + a);
    if (cur && cur.src === src) cur.dur += c.dur; else { cur = { from: c.from, dur: c.dur, src }; amb.push(cur); }
  });
  cues.forEach((c) => { if (c.rev) S(c.from / FPS + 0.05, "design/impact_heartbeat.flac", 0.42, 2.4, "design"); });
  return { sfx, amb, warn };
}
