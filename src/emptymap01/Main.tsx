import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { FPS, ACC, RED } from "./common";
import { GeoShot, Cam, El } from "./Geo";
import { Photo, Clip, Callout, Chapter, Bars, Quote, Pill } from "./kit";
import FR from "./frases.json";
import CLIPS from "./clips.json";
import PD from "./pd.json";

export const TOTAL_S = 636.2;
const S = (i: number) => (FR as number[][])[i][0];
const E = (i: number) => (FR as number[][])[i][1];
const mid = (i: number) => (S(i) + E(i)) / 2;

// pilas de rásters: el detalle encima de lo general, así el zoom nunca muestra un borde
const DAY = [{ id: "world" }, { id: "africa" }, { id: "basin" }, { id: "day" }];
const NIGHT = [{ id: "nightw" }, { id: "night" }];

type Shot = { a: number; v: any };
const geo = (cams: Cam[], els: El[] = [], layers: any[] = DAY, extra: any = {}) => ({ geo: { cams, els, layers, ...extra } });
const ph = (name: string) => ({ photo: name });

// ====== LÍNEA DE TIEMPO (a mano, frase por frase) ======
const SHOTS: Shot[] = [
  // HOOK — Egipto de noche desde el espacio
  { a: 0, v: geo([[0, 30.6, 26.8, 15.5], [4.4, 30.4, 26.8, 14.5], [12.4, 29.6, 26.6, 12.5], [18.6, 31.4, 28.6, 7.2], [23.2, 30.7, 26.9, 14.5]],
      [{ k: "river", r: "nile", t: 18.7, color: "#ffe9a8", w: 3, dur: 1.4, out: 22.4 }, { k: "area", lon: 31.6, lat: 27.0, label: "THE NILE", t: 18.8, out: 22.6, size: 48 },
       { k: "border", c: "EGY", t: 20.4, color: "rgba(255,255,255,0.8)", w: 2.5 }],
      [...DAY, { id: "nightw", op: [[3.6, 0], [5.0, 1]] }, { id: "night", op: [[3.6, 0], [5.0, 1]] }]) },
  { a: S(8), v: ph("strip_hill") },
  { a: mid(8) + 0.6, v: ph("strip_cane") },
  { a: S(9), v: ph("dune_ripples") },
  { a: S(10), v: ph("deep_pipe") },
  { a: mid(10) + 0.4, v: ph("gravel_plain") },
  { a: S(11), v: geo([[S(11), 31.2, 26.5, 15], [S(11) + 4.2, 34.2, 13.5, 22]],
      [{ k: "border", c: "EGY", t: S(11), w: 2.5 }, { k: "river", r: "nile", t: S(11), dur: 0.1 }, { k: "river", r: "blue", t: S(11) + 2.2, color: "#4fc3ff", dur: 1.6 },
       { k: "pin", lon: 35.09, lat: 11.21, label: "THE SWITCH", t: S(11) + 4.0, color: RED, big: true }, { k: "ring", lon: 35.09, lat: 11.21, t: S(11) + 4.0 }]) },
  { a: E(11) - 3.0, v: ph("eth_high") },
  { a: S(12), v: geo([[S(12), 30.8, 26.6, 16], [S(12) + 3.5, 30.8, 26.8, 14]], [{ k: "border", c: "EGY", t: S(12), w: 3 }], [...DAY, { id: "lights", op: [[0, 0.0], [S(12) + 1, 0], [S(12) + 2.2, 0.85]], blend: "screen" }]) },
  { a: S(12) + 3.6, v: ph("desert_road") },
  { a: S(12) + 7.4, v: ph("karnak") },
  { a: S(13), v: ph("sandsea") },

  // 1 — QUÉ TAN VACÍO
  { a: S(14), v: geo([[S(14), 30.4, 26.8, 22], [S(15), 30.2, 26.8, 17], [S(17), 30.2, 26.8, 17], [S(18) + 1, 31.6, 24.8, 6.5], [E(18), 31.4, 28.3, 6.2], [S(19) + 1.2, 31.1, 30.75, 3.0], [E(19), 31.1, 30.7, 3.1], [S(20) + 1.5, 30.6, 26.9, 15.5]],
      [{ k: "border", c: "EGY", t: S(14) + 0.3, w: 4, out: S(20) + 1.2 },
       { k: "us", t: S(16), out: S(17) - 0.2 },
       { k: "river", r: "nile", t: S(18) + 0.2, color: "#7fe0ff", w: 4, dur: 6 },
       { k: "pin", lon: 31.24, lat: 30.04, label: "CAIRO", t: S(18) + 6.2, side: "l", out: S(20) },
       { k: "line", pts: [[32.6, 22.0], [33.4, 23.6], [33.3, 25.6], [32.6, 27.2], [31.8, 29.2], [31.6, 30.0]], t: S(18) + 1.0, dur: 5.0, dash: true, color: ACC, label: "≈1,500 KM", out: S(19) },
       { k: "poly", pts: [[31.2, 30.1], [29.95, 31.3], [32.35, 31.3]], t: S(19) + 1.2, out: E(19) + 0.5 },
       { k: "line", pts: [[29.95, 31.45], [32.35, 31.45]], t: S(19) + 6.0, label: "240 KM", out: E(19) + 0.5 },
       { k: "border", c: "EGY", t: S(20) + 1.0, w: 3, color: "rgba(255,255,255,0.7)" }],
      [...DAY, { id: "modis", op: [[S(19), 0], [S(19) + 1.0, 1], [E(19), 1], [E(19) + 1, 0]] }, { id: "lights", op: [[S(20), 0], [S(20) + 1.5, 0.9]], blend: "screen" }],
      { dim: [[S(20), 0], [S(20) + 1.5, 0.15]] }) },
  { a: S(21), v: ph("alex_coast") },
  { a: S(21) + 2.2, v: ph("suez_ship") },
  { a: S(21) + 4.3, v: ph("redsea_resort") },
  { a: S(21) + 6.4, v: ph("oasis_palms") },
  { a: S(22), v: ph("white_desert") },
  { a: S(23), v: geo([[S(23), 30.8, 27.6, 12], [S(24) + 2, 31.2, 30.4, 3.6]], [{ k: "area", lon: 31.1, lat: 30.75, label: "2,000+ PEOPLE / KM²", t: S(24) + 2.6, size: 44 }], NIGHT) },
  { a: S(24) + 3.4, v: ph("cairo_roofs") },
  { a: S(24) + 7.2, v: ph("delta_village") },
  { a: S(25), v: { bars: { photo: "cairo_street", title: "People per km²", rows: [{ label: "Egypt's Nile strip (est.)", v: 2500, txt: "≈2,500" }, { label: "Bangladesh", v: 1150, txt: "≈1,150", color: "#9fd8ff" }, { label: "Egypt, whole country", v: 107, txt: "≈107", color: "#bbb" }] } } },
  { a: S(26), v: { pdOr: ["iss_day", "gravel_plain"] } },
  { a: S(27), v: ph("cairo_sprawl") },
  { a: S(28), v: ph("wadi_dry") },
  { a: S(29), v: ph("sky_clear") },
  { a: S(30), v: ph("cairo_haze") },
  { a: S(31), v: ph("london_rain") },
  { a: S(32), v: ph("aswan_dry") },
  { a: S(33), v: ph("black_desert") },

  // 2 — POR QUÉ
  { a: S(34), v: geo([[S(34), 30.6, 26.8, 16], [S(36), 45, 18, 70], [S(37), 70, 8, 150], [E(41) - 2.5, 70, 8, 150], [E(41), 30.6, 26.8, 22]],
      [{ k: "band", lat1: 22, lat2: 31, t: S(36) + 0.6, out: E(41) - 1.5 }, { k: "hadley", t: S(37), out: S(39) + 0.5 },
       { k: "area", lon: 8, lat: 26, label: "SAHARA", t: S(39) + 1.2, out: E(41) - 1.5, size: 46 }, { k: "area", lon: 50, lat: 16.5, label: "ARABIAN DESERT", t: S(39) + 2.4, out: E(41) - 1.5, size: 40 },
       { k: "area", lon: 128, lat: -24, label: "AUSTRALIA", t: S(39) + 3.6, out: E(41) - 1.5, size: 40 }, { k: "band", lat1: -31, lat2: -22, t: S(39) + 3.4, out: E(41) - 1.5, labels: false }]) },
  { a: S(42), v: geo([[S(42), 30.6, 26.8, 16], [E(42), 28.8, 26.5, 14]], [{ k: "poly", pts: [[25, 31.6], [29.2, 30.9], [30.9, 29.4], [31.0, 26.0], [32.3, 24.0], [32.6, 22.0], [25, 22.0]], t: S(42) + 0.3, fill: "rgba(255,180,60,0.22)" }, { k: "area", lon: 27.4, lat: 26.2, label: "WESTERN DESERT", sub: "≈ 2/3 OF EGYPT", t: S(42) + 1.0, size: 50 }]) },
  { a: S(43), v: ph("sand_sea2") },
  { a: S(44), v: geo([[S(44), 28.5, 28.0, 9], [S(44) + 3, 27.6, 29.6, 5]], [{ k: "poly", pts: [[25.9, 29.6], [26.8, 30.2], [28.3, 30.4], [29.3, 29.9], [29.2, 29.4], [27.8, 29.0], [26.4, 29.0]], t: S(44) + 1.2, fill: "rgba(255,74,61,0.25)", color: RED },
      { k: "area", lon: 27.6, lat: 29.55, label: "QATTARA DEPRESSION", sub: "−133 M", t: S(44) + 1.8, size: 40 }], [{ id: "world" }, { id: "africa" }, { id: "relief" }]) },
  { a: S(44) + 5.6, v: ph("qattara") },
  { a: S(45), v: geo([[S(45), 28.0, 30.0, 6], [E(45), 28.2, 30.1, 5]], [{ k: "poly", pts: [[25.9, 29.6], [26.8, 30.2], [28.3, 30.4], [29.3, 29.9], [29.2, 29.4], [27.8, 29.0], [26.4, 29.0]], t: S(45) - 0.5, fill: "rgba(255,74,61,0.18)", color: RED },
      { k: "line", pts: [[28.95, 30.9], [28.7, 30.6], [28.4, 30.3]], t: S(45) + 1.5, color: "#4fc3ff", w: 7, label: "CANAL PLAN, 1970s" }, { k: "ring", lon: 28.6, lat: 30.5, t: S(45) + 5, color: ACC, r: 120 }], [{ id: "world" }, { id: "africa" }, { id: "day" }]) },
  { a: S(46), v: ph("qattara_cliff") },
  { a: S(48), v: ph("east_mtn") },
  { a: S(49), v: ph("sinai") },
  { a: S(51), v: ph("ruins_sand") },

  // 3 — EL SAHARA VERDE
  { a: S(52), v: geo([[S(52), 20, 20, 60], [E(54), 22, 22, 45]], [{ k: "area", lon: 15, lat: 21, label: "11,000 – 5,000 YEARS AGO", t: S(54) + 0.5, size: 50, color: "#c8ff9e" }], DAY,
      { tint: { color: "#3f8f2a", op: [[S(53), 0], [S(54) + 1, 0.75]], box: [-12, 10, 36, 33] } }) },
  { a: S(55), v: ph("green_sahara") },
  { a: mid(55) + 0.5, v: ph("herders") },
  { a: S(56), v: geo([[S(56), 29, 26, 14], [S(56) + 4, 25.6, 23.6, 6]], [{ k: "border", c: "EGY", t: S(56) - 0.5, w: 2.5 }, { k: "pin", lon: 25.9, lat: 23.4, label: "GILF KEBIR", t: S(56) + 2.6 }, { k: "pin", lon: 25.3, lat: 23.75, label: "CAVE OF SWIMMERS", t: S(56) + 5.0, side: "l", color: RED }]) },
  { a: S(57), v: { pdOr: ["swimmers", "rock_art2"] } },
  { a: S(58), v: ph("gilf") },
  { a: S(59), v: ph("dry_lake") },
  { a: S(60) + 2.6, v: ph("migration") },
  { a: S(62), v: geo([[S(62), 29.5, 26.5, 15], [E(62) + 0.5, 30.8, 26.8, 13]], [{ k: "line", pts: [[25.5, 25.5], [29.2, 26.0], [31.4, 26.4]], t: S(62), color: ACC, w: 5 }, { k: "line", pts: [[26.5, 22.8], [30.0, 24.0], [32.6, 24.6]], t: S(62) + 0.3, color: ACC, w: 5 }, { k: "line", pts: [[34.6, 26.0], [33.2, 26.3], [32.5, 26.2]], t: S(62) + 0.5, color: ACC, w: 5 }, { k: "river", r: "nile", t: S(62), dur: 0.1, w: 6 }]) },
  { a: S(63), v: ph("karnak2") },
  { a: S(64), v: ph("valley_cart") },
  { a: S(65), v: { quote: { photo: "herodotus", text: "Egypt is the gift of the river", who: "Herodotus, c. 440 BC" } } },
  { a: S(66), v: geo([[S(66), 33, 18, 22], [E(66), 32, 20, 26]], [{ k: "flow", r: "blue", t: S(66), color: "#c08a4a" }, { k: "flow", r: "atbara", t: S(66), color: "#c08a4a" }, { k: "flow", r: "nile", t: S(66) + 0.6, color: "#c08a4a" }, { k: "area", lon: 38.5, lat: 10.0, label: "SUMMER RAINS", t: S(66) + 0.3, size: 40, color: "#9fd8ff" }]) },
  { a: S(67), v: ph("flood_fields") },
  { a: S(68), v: ph("black_mud") },
  { a: S(69), v: { label: { photo: "two_lands", l: "KEMET · THE BLACK LAND", r: "DESHRET · THE RED LAND" } } },
  { a: S(70), v: ph("strip_cane2") },
  { a: S(71), v: ph("nile_high") },
  { a: S(72), v: { pdOr: ["nilometer", "nilometer_ai"] } },
  { a: S(73), v: ph("famine_field") },
  { a: S(74), v: ph("flood_village") },

  // 4 — LA REPRESA
  { a: S(75), v: geo([[S(75), 31.0, 27.0, 14], [E(76), 32.9, 23.9, 3.2]], [{ k: "river", r: "nile", t: S(75), dur: 0.1, w: 3 }, { k: "pin", lon: 32.88, lat: 23.97, label: "ASWAN HIGH DAM · 1970", t: S(76), big: true }]) },
  { a: S(77), v: geo([[S(77), 32.9, 23.4, 4.5], [S(77) + 3, 32.0, 22.4, 7]], [{ k: "lake", t: S(77) }, { k: "line", pts: [[32.9, 23.9], [32.3, 22.9], [31.6, 22.2], [31.1, 21.3]], t: S(77) + 1.5, label: "≈550 KM", dash: true }, { k: "border", c: "SDN", t: S(77) + 2, color: "rgba(255,255,255,0.6)", w: 2 }]) },
  { a: S(77) + 3.8, v: { pdOr: ["nasser_iss", "lake_nasser"] } },
  { a: S(78), v: ph("dam_wall") },
  { a: mid(79) - 1.2, v: ph("harvest") },
  { a: mid(79) + 1.8, v: ph("dam_turbines") },
  { a: S(80), v: ph("silt") },
  { a: S(81) + 1.4, v: { pdOr: ["aswan_dam", "lake_nasser2"] } },
  { a: S(82), v: ph("fertiliser") },
  { a: S(82) + 3.6, v: ph("coast_erosion") },
  { a: S(83), v: geo([[S(83), 31.0, 31.0, 3.2], [E(83), 31.0, 31.2, 2.6]], [{ k: "line", pts: [[30.2, 31.47], [30.37, 31.52], [30.6, 31.48]], t: S(83) + 0.6, color: RED, w: 6, label: "ERODING COAST" }], [...DAY, { id: "modis" }]) },
  { a: S(84), v: ph("crowd_market") },
  { a: S(85), v: { counter: { geoNight: true } } },
  { a: S(87), v: { pdOr: ["cairo_pd", "cairo_wide"] } },
  { a: S(88), v: ph("brick_road") },
  { a: S(88) + 4.0, v: ph("city_edge") },
  { a: S(89), v: ph("brick_new") },
  { a: S(90), v: ph("brick_fields") },
  { a: S(91) + 1.2, v: ph("brick_aerial") },
  { a: S(91) + 5.5, v: ph("brick_plot") },

  // 5 — ESCAPAR DEL RÍO
  { a: S(92), v: ph("desert_road2") },
  { a: S(94), v: ph("pivot2") },
  { a: S(95), v: ph("sandstone") },
  { a: S(96), v: geo([[S(96), 28, 25, 22], [E(99), 27, 24, 26]], [{ k: "poly", pts: [[19, 31], [25, 32], [29, 31.4], [30.8, 29.8], [31.3, 26], [33, 22], [33.5, 18], [31, 14], [25, 14.5], [21, 16], [18, 19], [17, 24], [18, 28]], t: S(96) + 0.4, fill: "rgba(79,195,255,0.28)", color: "#4fc3ff", dash: true },
      { k: "area", lon: 25.5, lat: 22.5, label: "NUBIAN SANDSTONE AQUIFER", sub: "approximate extent", t: S(96) + 1.2, size: 38, out: S(97) },
      { k: "area", lon: 22.5, lat: 27.5, label: "LIBYA", t: S(96) + 3.5, size: 30, out: S(97) }, { k: "area", lon: 29.5, lat: 27.5, label: "EGYPT", t: S(96) + 3.9, size: 30, out: S(97) }, { k: "area", lon: 29.5, lat: 17.5, label: "SUDAN", t: S(96) + 4.3, size: 30, out: S(97) }, { k: "area", lon: 21.0, lat: 17.0, label: "CHAD", t: S(96) + 4.7, size: 30, out: S(97) },
      { k: "area", lon: 25.5, lat: 23.5, label: "≈150,000 KM³", sub: "of groundwater", t: S(97) + 2.5, size: 70, out: S(99) },
      { k: "pin", lon: 25.52, lat: 29.2, label: "SIWA", t: S(99) + 1.5 }, { k: "pin", lon: 29.0, lat: 25.5, label: "DAKHLA", t: S(99) + 2.4, side: "l" }, { k: "pin", lon: 30.55, lat: 25.44, label: "KHARGA", t: S(99) + 3.1 }]) },
  { a: S(98), v: { bars: { photo: "lake_nasser", title: "Water volume", rows: [{ label: "Nubian aquifer (est.)", v: 150000, txt: "≈150,000 km³", color: "#4fc3ff" }, { label: "Nile flow, 1,000 years", v: 84000, txt: "≈84,000 km³" }] } } },
  { a: S(99), v: geo([[S(99), 28, 26.5, 12], [E(99) - 3.5, 28, 27, 10]], [{ k: "pin", lon: 25.52, lat: 29.2, label: "SIWA", t: S(99) + 0.5 }, { k: "pin", lon: 29.0, lat: 25.5, label: "DAKHLA", t: S(99) + 1.4, side: "l" }, { k: "pin", lon: 30.55, lat: 25.44, label: "KHARGA", t: S(99) + 2.1 }, { k: "border", c: "EGY", t: S(99) - 1, w: 2.5 }]) },
  { a: E(99) - 3.4, v: ph("siwa") },
  { a: E(99) - 1.6, v: ph("dakhla") },
  { a: S(100), v: ph("pump_old") },
  { a: S(101), v: { card: { photo: "sandstone2", big: "FOSSIL WATER", sub: "rain from thousands to hundreds of thousands of years ago" } } },
  { a: S(102), v: ph("well_dry") },
  { a: S(103), v: ph("power_lines") },
  { a: S(103) + 3.6, v: ph("lonely_farm") },
  { a: S(104), v: ph("pivot") },
  { a: S(105), v: ph("abandoned_farm") },
  { a: S(106), v: geo([[S(106), 32.0, 23.4, 6], [S(106) + 4, 31.4, 22.8, 3.6]], [{ k: "lake", t: S(106) - 1 }, { k: "pin", lon: 31.85, lat: 22.62, label: "TOSHKA · 1997", t: S(106) + 1.0, big: true }, { k: "line", pts: [[31.85, 22.62], [31.3, 22.55], [30.8, 22.6], [30.4, 22.7]], t: S(106) + 2.6, color: "#4fc3ff", w: 6, label: "CANAL" }]) },
  { a: S(106) + 5.6, v: ph("toshka_pump") },
  { a: S(107), v: ph("desert_canal") },
  { a: S(108), v: { pdOr: ["toshka_nasa", "toshka_fields"] } },
  { a: S(109), v: geo([[S(109), 31, 29.5, 7], [E(109), 30.8, 30.1, 4]], [{ k: "pin", lon: 31.75, lat: 30.02, label: "NEW CAPITAL", t: S(109) + 0.3 }, { k: "pin", lon: 29.9, lat: 30.45, label: "NEW DELTA", t: S(109) + 1.3, side: "l" }, { k: "pin", lon: 31.24, lat: 30.04, label: "CAIRO", t: S(109) + 0.8, color: "#fff" }]) },
  { a: S(110), v: ph("new_capital") },
  { a: S(110) + 4.8, v: ph("new_capital_st") },
  { a: S(111), v: ph("new_channel") },
  { a: S(112), v: ph("canal_water") },
  { a: S(114), v: geo([[S(114), 30.8, 27, 13], [E(115), 31.0, 27.5, 11]], [{ k: "river", r: "nile", t: S(114), color: "#7fe0ff", w: 5, dur: 1.2 }], [...NIGHT]) },

  // 6 — EL INTERRUPTOR
  { a: S(116), v: geo([[S(116), 31, 26.5, 14], [S(117) + 1, 33, 18, 26], [E(118), 35, 13, 18]],
      [{ k: "river", r: "nile", t: S(116), dur: 0.1, w: 4 }, { k: "river", r: "white", t: S(117), color: "#cfe8ff", w: 3 }, { k: "river", r: "blue", t: S(118), color: "#4fc3ff", w: 7 }, { k: "river", r: "atbara", t: S(118) + 0.3, color: "#4fc3ff", w: 5 }, { k: "river", r: "sobat", t: S(118) + 0.5, color: "#4fc3ff", w: 5 },
       { k: "border", c: "ETH", t: S(118), color: ACC, w: 3 }, { k: "area", lon: 39, lat: 9, label: "≈85%", sub: "of the Nile's water", t: S(118) + 1.5, size: 90 }]) },
  { a: S(119), v: ph("blue_nile_falls") },
  { a: S(119) + 4.2, v: { pdOr: ["nile_ships", "nile_cairo_boats"] } },
  { a: S(121), v: { bars: { photo: "dry_canal", title: "Fresh water per person per year", max: 1200, rows: [{ label: "Nile share ÷ population", v: 505, txt: "≈505 m³", color: RED }], lines: [{ v: 1000, label: "Water scarcity: 1,000", color: ACC }, { v: 500, label: "Absolute scarcity: 500", color: RED }] } } },
  { a: S(125), v: geo([[S(125), 33, 16, 18], [S(125) + 5, 35.1, 11.3, 4]], [{ k: "river", r: "blue", t: S(125), dur: 0.1, w: 6 }, { k: "border", c: "ETH", t: S(125), w: 2.5 }, { k: "pin", lon: 35.09, lat: 11.21, label: "GERD · ETHIOPIA", t: S(125) + 2.5, color: RED, big: true }, { k: "ring", lon: 35.09, lat: 11.21, t: S(125) + 2.5 }]) },
  { a: S(125) + 6.6, v: ph("gerd") },
  { a: S(125) + 10.6, v: ph("spillway") },
  { a: S(126), v: { bars: { photo: "eth_high2", title: "Billion cubic metres", rows: [{ label: "GERD reservoir capacity", v: 74, txt: "≈74", color: RED }, { label: "Egypt's yearly Nile share", v: 55.5, txt: "55.5" }] } } },
  { a: S(127), v: { pdOr: ["gerd_pd", "eth_power"] } },
  { a: S(128), v: ph("nile_dusk") },
  { a: S(129), v: geo([[S(129), 34, 15, 26], [E(129), 32, 20, 30]], [{ k: "river", r: "nile", t: S(129), dur: 0.1, w: 5 }, { k: "river", r: "blue", t: S(129), dur: 0.1, w: 5 }, { k: "border", c: "EGY", t: S(129), w: 3 }, { k: "border", c: "ETH", t: S(129) + 0.3, w: 3, color: RED }, { k: "ring", lon: 35.09, lat: 11.21, t: S(129) + 1 }]) },

  // CIERRE
  { a: S(130), v: geo([[S(130), 30.6, 26.8, 13], [E(133), 30.6, 26.8, 15]], [{ k: "border", c: "EGY", t: S(130), w: 2.5, color: "rgba(255,255,255,0.7)" }], NIGHT) },
  { a: S(133), v: ph("felucca_aswan") },
  { a: S(134), v: geo([[S(134), 30.6, 26.8, 15], [E(135), 31.0, 27.5, 10]], [{ k: "border", c: "EGY", t: S(134) - 1, w: 3 }], [...DAY, { id: "lights", op: [[S(135), 0], [S(135) + 1.2, 0.9]], blend: "screen" }], { dim: [[S(135), 0], [S(135) + 1.2, 0.25]] }) },
  { a: S(136), v: ph("riyadh") },
  { a: S(136) + 5.5, v: geo([[S(136) + 5.5, 40, 24, 30], [TOTAL_S, 45, 24, 22]], [{ k: "border", c: "SAU", t: S(136) + 6, w: 4, color: ACC }, { k: "area", lon: 45, lat: 23.5, label: "0 RIVERS", t: S(136) + 7, size: 90, color: "#fff" }]) },
];

// ====== CAPA DE GRÁFICOS ENCIMA (cifras, capítulos) ======
type Ov = { a: number; b: number; node: React.ReactNode };
const OV: Ov[] = [
  { a: S(7), b: E(7) + 0.4, node: <Callout big="95%" sub="of Egypt is empty" dur={E(7) + 0.4 - S(7)} pos="c" /> },
  { a: S(8) + 0.5, b: E(8) - 4, node: <Callout big="" count={[0, 110, (n) => `~${Math.round(n)} MILLION`]} sub="people on one river" dur={E(8) - 4.5 - S(8)} /> },
  { a: S(13) + 1.5, b: E(13), node: <Pill text="SUBSCRIBE" dur={E(13) - S(13) - 1.5} /> },
  { a: S(14), b: S(15) + 1.5, node: <Chapter n="CHAPTER 1" title="How empty is empty?" dur={S(15) + 1.5 - S(14)} /> },
  { a: S(15), b: E(15) + 0.3, node: <Callout big="" count={[0, 1000000, (n) => Math.round(n).toLocaleString("en-US")]} sub="square kilometres" dur={E(15) + 0.3 - S(15)} pos="tr" /> },
  { a: S(20) + 1.2, b: E(20) + 0.3, node: <Callout big="≈4%" sub="valley + delta" dur={E(20) - S(20) - 0.9} pos="tr" /> },
  { a: S(21) + 6.4, b: E(21), node: <Callout big="5–6%" sub="everything inhabited" dur={E(21) - S(21) - 6.4} pos="br" /> },
  { a: S(30) + 0.6, b: E(30), node: <Callout big="25 MM" sub="of rain a year in Cairo" dur={E(30) - S(30) - 0.6} /> },
  { a: S(31) + 0.3, b: E(31), node: <Callout big="> 25 MM" sub="London, in a typical month" dur={E(31) - S(31) - 0.3} color="#9fd8ff" /> },
  { a: S(32) + 1.0, b: E(32), node: <Callout big="≈1 MM" sub="Aswan, per year" dur={E(32) - S(32) - 1.0} /> },
  { a: S(34), b: S(35) + 1, node: <Chapter n="CHAPTER 2" title="Why is it like this?" dur={S(35) + 1 - S(34)} /> },
  { a: S(43) + 0.5, b: E(43), node: <Callout big="≈70,000 KM²" sub="of sand dunes" dur={E(43) - S(43) - 0.5} /> },
  { a: S(52), b: S(53) + 1.5, node: <Chapter n="CHAPTER 3" title="The Green Sahara" dur={S(53) + 1.5 - S(52)} /> },
  { a: S(75), b: S(76), node: <Chapter n="CHAPTER 4" title="Taming the river" dur={S(76) - S(75)} /> },
  { a: S(79) + 0.3, b: mid(79) - 1.2, node: <Callout big="2–3" sub="harvests a year" dur={mid(79) - 1.5 - S(79)} /> },
  { a: S(92), b: S(94), node: <Chapter n="CHAPTER 5" title="Escaping the river" dur={S(94) - S(92)} /> },
  { a: S(107) + 0.2, b: E(107), node: <Pill text="PLANNED: MILLIONS OF RESIDENTS" dur={E(107) - S(107) - 0.2} color="#333" /> },
  { a: S(116), b: S(117) + 1, node: <Chapter n="CHAPTER 6" title="The switch" dur={S(117) + 1 - S(116)} /> },
  { a: S(119) + 0.5, b: S(119) + 4.2, node: <Callout big="55.5 BILLION M³" sub="Egypt's yearly share (1959)" dur={3.7} /> },
  { a: S(125) + 6.8, b: S(125) + 10.4, node: <Callout big="SEPT 2025" sub="inaugurated" dur={3.6} color={RED} /> },
  { a: S(128), b: E(128), node: <Pill text="“EXISTENTIAL THREAT”" dur={E(128) - S(128)} /> },
  { a: S(134) + 0.2, b: E(134), node: <Callout big="95%" sub="empty" dur={E(134) - S(134) - 0.2} pos="c" /> },
  { a: S(135) + 0.3, b: E(135) + 0.4, node: <Callout big="5%" sub="kept alive by one river" dur={E(135) + 0.1 - S(135)} pos="c" color="#9fffb0" /> },
];

const PhotoOrPd: React.FC<{ names: string[]; dur: number; seed: number }> = ({ names, dur, seed }) => {
  const p = (PD as any)[names[0]];
  if (p) return <Photo src={p.file} dur={dur} seed={seed} credit={p.credit} fit={p.fit} shift={p.shift} />;
  return <Media name={names[1]} dur={dur} seed={seed} />;
};
const Media: React.FC<{ name: string; dur: number; seed: number }> = ({ name, dur, seed }) => {
  const c = (CLIPS as any)[name];
  // el clip sólo si cubre el plano entero (estirado hasta 1,6x); si no, la foto con Ken Burns
  if (c && c.dur * 1.6 >= dur) return <Clip src={c.file} dur={dur} seed={seed} rate={Math.min(1, c.dur / dur)} />;
  return <Photo src={`img/${name}.jpg`} dur={dur} seed={seed} />;
};

const render = (v: any, from: number, dur: number, seed: number) => {
  if (v.geo) return <GeoShot from={from} {...v.geo} />;
  if (v.photo) return <Media name={v.photo} dur={dur} seed={seed} />;
  if (v.pdOr) return <PhotoOrPd names={v.pdOr} dur={dur} seed={seed} />;
  if (v.bars) return <AbsoluteFill><Media name={v.bars.photo} dur={dur} seed={seed} /><Bars {...v.bars} dur={dur} /></AbsoluteFill>;
  if (v.quote) return <AbsoluteFill><PhotoOrPd names={[v.quote.photo, "karnak"]} dur={dur} seed={seed} /><Quote text={v.quote.text} who={v.quote.who} dur={dur} /></AbsoluteFill>;
  if (v.card) return <AbsoluteFill><Media name={v.card.photo} dur={dur} seed={seed} /><AbsoluteFill style={{ background: "rgba(0,0,0,0.45)" }} /><Callout big={v.card.big} sub={v.card.sub} dur={dur} pos="c" /></AbsoluteFill>;
  if (v.label) return <AbsoluteFill><Media name={v.label.photo} dur={dur} seed={seed} />
    <Callout big="KEMET" sub="the black land" dur={dur} pos="bl" color="#fff" /><Callout big="DESHRET" sub="the red land" dur={dur} pos="br" color="#ff9a6b" /></AbsoluteFill>;
  if (v.counter) return <AbsoluteFill>
    <GeoShot from={from} cams={[[from, 31.0, 28.5, 8], [from + dur, 31.1, 30.3, 3.4]]} layers={NIGHT} />
    <Callout big="" count={[35, 110, (n) => `${Math.round(n)} MILLION`]} sub={"1970 → today"} dur={4.4} pos="tl" />
    <Sequence from={Math.round(4.7 * FPS)}><Callout big="≈2,000,000" sub="births every year" dur={dur - 4.7} pos="tl" /></Sequence>
  </AbsoluteFill>;
  return null;
};

export const Main: React.FC = () => {
  const shots = SHOTS.filter((s) => s.v);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {shots.map((s, i) => {
        const b = i + 1 < shots.length ? shots[i + 1].a : TOTAL_S;
        const from = Math.round(s.a * FPS), to = Math.round(b * FPS);
        if (to <= from) return null;
        return <Sequence key={i} from={from} durationInFrames={to - from}>{render(s.v, from / FPS, (to - from) / FPS, i * 7 + 3)}</Sequence>;
      })}
      {OV.map((o, i) => {
        const from = Math.round(o.a * FPS), to = Math.round(o.b * FPS);
        if (to <= from) return null;
        return <Sequence key={"o" + i} from={from} durationInFrames={to - from}>{o.node}</Sequence>;
      })}
    </AbsoluteFill>
  );
};
