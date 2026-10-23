// clducha · EL RESTO (107,9-937,4 s): la lista de planos en segundos globales (= tiempo de la voz).
// A = avatar (ventanas de avwin.json, exactas) · W = el mundo 3D (pose de entrada → pose de salida) · S = toma real (LTX o cuadro clave)
// V = el mundo con el avatar en videollamada (CTA2). Un plano termina donde empieza el siguiente.
type V3 = [number, number, number];
export type Pose = { p: V3; l: V3; fov: number };
export const POSE: Record<string, Pose> = {
  wide: { p: [0.6, 0.95, 0.9], l: [-0.2, 0.45, -0.9], fov: 40 },
  wide2: { p: [0.85, 1.25, 1.1], l: [-0.25, 0.7, -0.9], fov: 42 },
  low: { p: [0.05, 0.4, -0.35], l: [-0.25, 0.25, -1], fov: 34 },
  low2: { p: [-0.45, 0.36, -0.4], l: [-0.4, 0.24, -1], fov: 34 },
  macro: { p: [-0.08, 0.27, -0.62], l: [-0.2, 0.215, -1], fov: 30 },
  macro2: { p: [-0.5, 0.3, -0.6], l: [-0.45, 0.22, -1], fov: 30 },
  wipe: { p: [-0.25, 0.42, -0.3], l: [-0.3, 0.3, -1], fov: 38 },
  bowl: { p: [0.8, 0.38, 0.8], l: [0.45, 0.08, 0.4], fov: 34 },
  bowl2: { p: [0.62, 0.3, 0.64], l: [0.45, 0.08, 0.4], fov: 30 },
  window: { p: [0.3, 1.3, 0.4], l: [-1, 1.8, -0.3], fov: 40 },
  corner: { p: [-0.5, 0.35, -0.45], l: [-0.98, 0.08, -0.98], fov: 34 },
  corner2: { p: [-0.3, 0.3, -0.62], l: [-0.98, 0.07, -0.98], fov: 30 },
  drain: { p: [0.25, 0.55, 0.25], l: [-0.22, 0.06, -0.22], fov: 36 },
  cityHigh: { p: [13.8, 1.0, 4.0], l: [12.2, -0.1, 1.0], fov: 40 },
  cityTop: { p: [14.2, 2.6, 3.6], l: [12.0, -0.1, 0.6], fov: 42 },
  cityMid: { p: [13.2, 0.7, 3.4], l: [12.2, -0.1, 1.0], fov: 40 },
  cityRoot: { p: [12.95, 0.15, 2.25], l: [12.58, -0.07, 1.62], fov: 34 },
  cityRoot2: { p: [12.3, 0.35, 2.7], l: [11.42, -0.06, 1.62], fov: 36 },
  cityFront: { p: [12.0, 0.05, 3.4], l: [12.0, -0.08, 1.62], fov: 42 },
  street: { p: [12.95, 0.28, 1.75], l: [12.58, 0, 1.27], fov: 32 },
  streetLow: { p: [12.85, 0.12, 1.6], l: [12.58, -0.01, 1.27], fov: 30 },
  tileTop: { p: [12.3, 0.45, 1.9], l: [12.0, 0, 1.1], fov: 36 },
  bookIn: { p: [2.8, 1.8, 2.4], l: [3.3, 0.95, 0.3], fov: 38 },
  book: { p: [3.25, 1.46, 0.8], l: [3.18, 0.965, 0.3], fov: 33 },
};
export type Seg = { a: number; b: number; k: "A" | "W" | "S" | "V"; c?: string; pa?: string; pb?: string };
export const REST_START = 107.88, FULL_END = 937.4;
const raw: [number, Seg["k"], string?, string?][] = [
  [107.88, "W", "", "low"], [110.89, "A"],
  [114.32, "W", "cityTop", "cityMid"], [120.66, "W", "cityMid", "tileTop"], [125.88, "A"],
  [131.69, "W", "street", "streetLow"], [134.08, "W", "streetLow", "tileTop"], [138.86, "W", "tileTop", "street"], [140.1, "W", "wide", "wide2"], [143.61, "A"],
  [148.68, "W", "cityHigh", "cityMid"], [153.96, "W", "cityMid", "cityRoot"], [159.11, "A"],
  [164.56, "W", "cityTop", "cityFront"], [170.0, "W", "cityFront", "cityRoot"], [176.68, "A"],
  [181.1, "W", "cityMid", "cityRoot"], [191.6, "A"],
  [196.87, "W", "cityRoot2", "cityMid"], [204.7, "S", "k_vuelve"], [208.57, "A"],
  [212.71, "S", "k_blanca"], [216.68, "W", "low", "low2"], [224.58, "A"],
  [229.29, "S", "k_cloro"], [232.3, "W", "wide", "low"], [239.66, "A"],
  [243.76, "S", "p_gota"], [249.5, "W", "street", "streetLow"], [257.36, "A"],
  [263.36, "W", "macro", "macro2"], [268.04, "S", "p_palillo"], [274.58, "A"],
  [279.02, "W", "macro2", "wide"], [289.15, "A"],
  [294.48, "S", "p_gastada"], [298.14, "W", "wide2", "wide"], [301.52, "S", "m_mesa"], [308.38, "A"],
  [313.4, "W", "bowl", "bowl2"], [324.82, "A"],
  [330.93, "W", "low", "window"], [344.01, "A"],
  [347.4, "S", "s1_enjuague"], [355.4, "W", "wide", "low"], [359.66, "A"],
  [365.23, "S", "s2_bicarbonato"], [369.6, "S", "s2_oxigenada"], [374.29, "A"],
  [379.17, "W", "bowl2", "bowl"], [392.29, "A"],
  [397.61, "W", "cityHigh", "tileTop"], [410.48, "A"],
  [414.25, "W", "cityFront", "cityRoot"], [419.7, "S", "s4_burbujas"], [424.51, "A"],
  [429.82, "W", "bowl", "drain"], [442.53, "A"],
  [447.71, "S", "s3_aplicar"], [455.71, "W", "low", "low2"], [458.88, "A"],
  [464.18, "W", "wide", "macro"], [477.18, "A"],
  [481.32, "W", "wide2", "low"], [488.56, "W", "cityFront", "cityRoot"], [494.4, "A"],
  [499.68, "W", "cityRoot", "cityRoot2"], [502.3, "W", "macro", "macro2"], [510.47, "A"],
  [514.7, "S", "s5_frotar"], [522.7, "W", "macro2", "macro"], [526.54, "A"],
  [529.83, "W", "low", "wipe"], [541.85, "A"],
  [547.12, "S", "s6_esponja_b"], [553.0, "W", "wipe", "low"], [556.05, "A"],
  [559.89, "S", "c_gerente"], [565.9, "W", "macro", "low"], [572.67, "A"],
  [576.59, "S", "s6_balde"], [582.6, "W", "low", "wide"], [587.81, "A"],
  [594.12, "W", "wide", "wide2"], [597.3, "S", "s7_toalla"], [604.54, "A"],
  [609.02, "S", "s7_nube"], [615.0, "W", "wide2", "low"], [621.81, "A"],
  [625.89, "W", "low2", "macro"], [636.42, "A"],
  [641.06, "S", "z_silicona"], [646.1, "W", "corner", "wide"], [654.83, "A"],
  [660.72, "W", "street", "streetLow"], [672.71, "A"],
  [677.15, "W", "cityFront", "cityMid"], [686.39, "A"],
  [689.78, "S", "e_vinagre"], [695.8, "W", "tileTop", "street"], [702.54, "A"],
  [707.98, "W", "wide", "low"], [712.3, "W", "bowl", "bowl2"], [719.73, "A"],
  [725.59, "S", "e_botellas"], [731.0, "W", "wide", "window"], [737.1, "A"],
  [741.58, "S", "e_trapeador"], [747.6, "W", "low", "macro"], [754.36, "A"],
  [760.35, "W", "wide", "low"], [764.75, "W", "street", "streetLow"], [771.5, "A"],
  [776.06, "S", "s8_sellador"], [784.06, "W", "cityHigh", "cityMid"], [788.48, "A"],
  [793.52, "W", "street", "streetLow"], [800.25, "S", "p_perla"], [805.24, "A"],
  [809.59, "W", "wide", "wide2"], [812.0, "S", "r_secador"], [816.6, "S", "r_rociar"], [819.85, "A"],
  [824.51, "W", "low", "corner"], [826.9, "S", "r_extractor"], [831.9, "W", "cityFront", "cityRoot"], [837.31, "A"],
  [842.63, "W", "wide2", "wide"], [854.38, "A"],
  [859.22, "W", "bowl", "bowl2"], [865.07, "W", "wide2", "book"], [872.11, "V", "book", "book"],
  [876.25, "W", "book", "book"], [889.36, "V", "book", "book"],
  [895.2, "W", "corner", "corner2"], [903.6, "S", "h_linterna_c"], [906.65, "A"],
  [911.84, "S", "z_manana"], [919.8, "S", "z_listo"], [925.07, "A"],
  [930.81, "W", "macro", "low"],
];
export const SEG: Seg[] = raw.map(([a, k, x, y], i) => {
  const b = i + 1 < raw.length ? raw[i + 1][0] : FULL_END;
  return k === "S" ? { a, b, k, c: x } : k === "A" ? { a, b, k } : { a, b, k, pa: x || undefined, pb: y };
});
// llaves de cámara del resto: entrada y salida de cada plano de mundo (+ el vuelo al libro del CTA2)
const K = (t: number, n: string) => ({ t, ...POSE[n] });
export const REST_KEYS = (() => {
  const o: { t: number; p: V3; l: V3; fov: number }[] = [];
  for (const s of SEG) if (s.k === "W" || s.k === "V") {
    if (s.pa) o.push(K(s.a, s.pa));
    if (s.a === 865.07) { o.push(K(866.4, "wide2")); o.push(K(867.8, "bookIn")); }
    o.push(K(s.b, s.pb!));
  }
  return o;
})();
// largo de cada toma LTX (segundos pedidos): más allá se congela el último cuadro
export const LEN: Record<string, number> = {
  k_vuelve: 6, k_blanca: 6, k_cloro: 6, p_gota: 6, p_palillo: 6, p_gastada: 5, m_mesa: 6, s1_enjuague: 8, s2_bicarbonato: 6, s2_oxigenada: 6,
  s4_burbujas: 8, s3_aplicar: 8, s5_frotar: 8, s6_esponja_b: 6, c_gerente: 6, s6_balde: 6, s7_toalla: 6, s7_nube: 6, z_silicona: 5,
  e_vinagre: 6, e_botellas: 5, e_trapeador: 6, s8_sellador: 8, p_perla: 5, r_secador: 6, r_rociar: 5, r_extractor: 5, h_linterna_c: 12, z_manana: 8, z_listo: 6,
};
