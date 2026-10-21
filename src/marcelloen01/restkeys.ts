// marcelloen01 · el RESTO del video (76 s → final) en el MISMO mundo y con la MISMA cámara: capítulos clavados a la voz,
// lugares de la cocina de la nonna por donde pasa la cámara, y lo que hay en la olla en cada cena.
import { at } from "./lib";

const ZK = -30;
const k = (z: number) => z + ZK;
type V3 = [number, number, number];
export type RKey = { t: number; p: V3; l: V3; fov?: number; arc?: number };

// ---------------- capítulos (inicio de cada uno, por frase) ----------------
export const CH = {
  intro: at("you know me"),
  stone: at("her kitchen was made of stone"),
  spanish: at("over on my spanish channel"),
  cta: at("quick before we start"),
  d1: at("dinner number one"),
  d2: at("dinner number 2"),
  d3: at("dinner number three"),
  d4: at("dinner number four"),
  d5: at("dinner number five"),
  d6: at("number 6"),
  d7: at("dinner number seven"),
  arith: at("let me stop for one moment"),
  d8: at("dinner number 8", 556),
  d9: at("dinner number nine"),
  d10: at("dinner number ten"),
  trouble: at("now let me be honest"),
  pantry: at("and one more thing because people"),
  homework: at("so here is your homework"),
  comment: at("tell me something in the comments", 870),
  next: at("and next week"),
  ciao: at("ciao"),
};
export const END = 921.4; // 1 s después de la última palabra (encfin exige audio ≥ EDL - 0,3 s)

// ---------------- lugares de la cocina (cámara) ----------------
export const SPOT: Record<string, { p: V3; l: V3; fov: number }> = {
  stove: { p: [-1.85, 1.5, k(0.9)], l: [-2.6, 1.05, k(-2.15)], fov: 34 },
  potTop: { p: [-2.0, 2.55, k(-0.6)], l: [-2.75, 1.05, k(-2.15)], fov: 42 },
  potLow: { p: [-1.3, 1.6, k(0.0)], l: [-2.7, 1.1, k(-2.15)], fov: 38 },
  table: { p: [1.25, 1.55, k(1.75)], l: [0.85, 0.82, k(0.2)], fov: 36 },
  tableLow: { p: [2.35, 1.05, k(0.95)], l: [0.3, 0.9, k(0.2)], fov: 34 },
  wide: { p: [1.7, 2.2, k(2.7)], l: [-0.6, 1.1, k(-1.2)], fov: 52 },
  wideL: { p: [-3.3, 2.1, k(2.6)], l: [0.5, 1.0, k(-1.0)], fov: 50 },
  shelf: { p: [2.9, 1.75, k(0.9)], l: [4.45, 1.75, k(-0.8)], fov: 36 },
  window: { p: [1.55, 1.95, k(-0.6)], l: [2.6, 1.95, k(-2.84)], fov: 36 },
  cupboard: { p: [-2.75, 1.65, k(1.9)], l: [-4.35, 1.35, k(0.6)], fov: 38 },
  garlic: { p: [-0.2, 2.05, k(-0.4)], l: [-0.9, 2.1, k(-2.78)], fov: 42 },
  copper: { p: [0.75, 2.4, k(-1.3)], l: [0.6, 2.4, k(-2.7)], fov: 38 },
};

// recorrido: [frase o segundo, lugar] — la cámara llega a ese lugar en esa palabra y se queda respirando hasta el próximo
const ROUTE: [number, string][] = [
  [at("a little boy sitting"), "tableLow"],
  [CH.stone, "wideL"],
  [at("garlic and wood smoke"), "garlic"],
  [CH.spanish, "copper"],
  [at("here in this kitchen"), "stove"],
  [CH.cta + 1.5, "wide"],
  [at("tell me in the comments", 100), "table"],
  // 1 · pasta e fagioli
  [CH.d1, "potTop"],
  [at("you drain it"), "window"],
  [at("all the starch"), "potLow"],
  [at("nonnas trick"), "stove"],
  [at("one can of beans"), "potTop"],
  [at("the rind of the parmesan"), "shelf"],
  [at("when it boils you put in"), "potLow"],
  [at("on the plate my friend"), "table"],
  // 2 · pastina
  [CH.d2, "tableLow"],
  [at("people think broth"), "stove"],
  [at("you take the pot off the fire"), "potLow"],
  [at("off the fire the egg becomes silk"), "potTop"],
  [at("and it heals you"), "table"],
  // 3 · polenta
  [CH.d3, "wideL"],
  [at("cold water everybody"), "potTop"],
  [at("for one person one cup of cold water"), "potLow"],
  [at("when it bubbles you put the lid"), "stove"],
  [at("you brown one sausage"), "potTop"],
  [at("cold water no lumps"), "wide"],
  // 4 · gnocchi
  [CH.d4, "copper"],
  [at("at home alone no"), "stove"],
  [at("raw directly into the sauce"), "potTop"],
  [at("then you tear one ball"), "potLow"],
  [at("look at this"), "table"],
  // 5 · beans & greens
  [CH.d5, "garlic"],
  [at("they heat the oil"), "potLow"],
  [at("nonna put the garlic in the cold oil"), "potTop"],
  [at("you put in the greens"), "stove"],
  [at("the old bread"), "table"],
  // 6 · risi e bisi
  [CH.d6, "window"],
  [at("you think risotto"), "wideL"],
  [at("you toast the rice first"), "potTop"],
  [at("then one and a quarter"), "potLow"],
  [at("toast the rice and the rice"), "table"],
  // 7 · spaghetti
  [CH.d7, "stove"],
  [at("in a wide pan"), "potTop"],
  [at("and now the measure"), "potLow"],
  [at("the starch from the pasta and"), "potTop"],
  [at("only the water the pasta"), "tableLow"],
  // la cuenta
  [CH.arith, "wide"],
  [at("every night for a week"), "table"],
  [at("on sunday"), "stove"],
  [at("tuesdays beans"), "wideL"],
  // 8 · ribollita
  [CH.d8, "cupboard"],
  [at("yesterdays soup boiled again"), "potTop"],
  [at("you tear one slice"), "potLow"],
  [at("nonna said the soup"), "window"],
  // 9 · uova in purgatorio
  [CH.d9, "wideL"],
  [at("half a can of crushed tomatoes", 610), "potTop"],
  [at("with the back of a spoon"), "potLow"],
  [at("then lid on"), "stove"],
  [at("a little cheese and one piece"), "table"],
  // 10 · lenticchie
  [CH.d10, "window"],
  [at("people soak lentils"), "shelf"],
  [at("nonna put the salt at the end"), "potTop"],
  [at("in italy they say"), "copper"],
  // problemas y arreglos
  [CH.trouble, "wide"],
  [at("the beans were old"), "shelf"],
  [at("one can is two dinners"), "cupboard"],
  [at("and when you warm up"), "stove"],
  [at("if your polenta is too thick"), "potTop"],
  [at("cooking for one is not about"), "tableLow"],
  // la alacena para uno
  [CH.pantry, "shelf"],
  [at("so this is the shelf"), "cupboard"],
  [at("bread the cheap loaf"), "table"],
  [at("in nonnas house there was"), "window"],
  // tarea, comentario, próxima semana
  [CH.homework, "potTop"],
  [at("and see how you feel"), "tableLow"],
  [CH.comment, "wide"],
  [CH.next, "copper"],
  [at("three ingredients"), "table"],
  [at("nonna rosa used to say"), "wideL"],
  [CH.ciao, "wide"],
  [END, "wide"],
];

// cada tramo: viaje de ~1,6 s al lugar (con arco si es largo) y después un empuje lento ("respira") hasta el próximo
export const REST_KEYS: RKey[] = (() => {
  const out: RKey[] = [];
  for (let i = 0; i < ROUTE.length; i++) {
    const [t, name] = ROUTE[i];
    const sp = SPOT[name];
    const next = ROUTE[i + 1]?.[0] ?? t + 4;
    const travel = Math.min(1.6, Math.max(0.6, (next - t) * 0.3));
    const push = (q: V3, l: V3, f: number): V3 => [q[0] + (l[0] - q[0]) * f, q[1] + (l[1] - q[1]) * f, q[2] + (l[2] - q[2]) * f];
    out.push({ t: t + travel, p: sp.p, l: sp.l, fov: sp.fov, arc: 0.12 });
    if (next - t > travel + 1) out.push({ t: next - 0.05, p: push(sp.p, sp.l, 0.12), l: sp.l, fov: sp.fov - 2 });
  }
  return out;
})();

// ---------------- lo que hay en la olla (color de la superficie + extras) ----------------
export type PotLook = { col: string; eggs?: boolean; pasta?: boolean; greens?: boolean; gnocchi?: boolean; red?: boolean };
const LOOK: [number, PotLook][] = [
  [0, { col: "#7a3f1e" }],
  [CH.d1, { col: "#8a5530", pasta: true }],
  [CH.d2, { col: "#d9b25a", pasta: true }],
  [CH.d3, { col: "#e8c04a" }],
  [CH.d4, { col: "#b8321e", gnocchi: true, red: true }],
  [CH.d5, { col: "#6d6a2a", greens: true }],
  [CH.d6, { col: "#cdbf7a", greens: true }],
  [CH.d7, { col: "#c23b22", pasta: true, red: true }],
  [CH.d8, { col: "#7d5a2e", greens: true }],
  [CH.d9, { col: "#b52d1a", eggs: true, red: true }],
  [CH.d10, { col: "#5a3a22" }],
  [CH.trouble, { col: "#8a5530", pasta: true }],
];
export const potLook = (t: number): PotLook => { let r = LOOK[0][1]; for (const [s, l] of LOOK) if (t >= s) r = l; return r; };
