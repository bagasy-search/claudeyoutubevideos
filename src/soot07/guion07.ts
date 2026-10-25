// Director de soot07 «Why Nobody Walked Through Ancient Rome at Night»: datos puros (sin React) para que el mismo
// archivo maneje el video y las cues de sonido (scripts: esbuild → node → cues.json).
// Cada momento se ancla a la PALABRA exacta de los captions con at("frase") — cursor secuencial, en orden de guion.
import CAPS from "./captions07.json";

type W = { text: string; startMs: number; endMs: number };
const PAL = (CAPS as W[]).map((w) => ({ w: w.text.toLowerCase().replace(/[^a-z0-9]/g, ""), t: w.startMs / 1000, e: w.endMs / 1000 }));
let cursor = 0;
export const at = (frase: string, d = 0) => {
  const ks = frase.toLowerCase().split(/\s+/).map((k) => k.replace(/[^a-z0-9]/g, "")).filter(Boolean);
  for (let i = cursor; i < PAL.length; i++) {
    if (ks.every((k, j) => PAL[i + j] && PAL[i + j].w === k)) { cursor = i + 1; return PAL[i].t + d; }
  }
  if (typeof process !== "undefined" && process.env && process.env.AT_LOG) { console.error(`NO «${frase}» @${PAL[cursor]?.t}`); return PAL[cursor].t; }
  throw new Error(`at(): no encuentro «${frase}» después de ${PAL[cursor]?.t}`);
};
// ah(): mira sin mover el cursor (desde la última palabra encontrada) — para t1 y repeticiones
export const ah = (frase: string, d = 0) => {
  const c = cursor; cursor = Math.max(0, cursor - 1);
  try { return at(frase, d); } finally { cursor = c; }
};
export const VOZ_FIN = PAL[PAL.length - 1].e;
export const DUR = Math.ceil((VOZ_FIN + 1.2) * 30);

// ── tipos de pieza en pantalla
export type Slot = "tl" | "tl2" | "tr" | "tr2" | "bc" | "tc";
export type Beat =
  | { k: "chip"; t: number; txt: string; slot: Slot; col?: string; tinta?: string; t1?: number }
  | { k: "big"; t: number; txt: string; y?: number; x?: number; col?: string; size?: number; t1?: number; golpe?: boolean }
  | { k: "trap"; t: number; n: number; name: string }
  | { k: "ico"; t: number; ico: string; x: number; y: number; s?: number; t1?: number; tacha?: number; label?: string }
  | { k: "cuenta"; t: number; t1: number; de: number; a: number; x: number; y: number; size?: number; suf?: string; pre?: string; col?: string; fin?: number };
export const B: Beat[] = [];
export type Cue = [number, string, number | null, Record<string, number>?];
export const SFX: Cue[] = [];
const s = (t: number, pool: string, g: number | null = null, o?: Record<string, number>) => { SFX.push(o ? [t, pool, g, o] : [t, pool, g]); return t; };
const R = "#e8344a", A = "#ffb020", T = "#2ec4d6", V = "#5b2bb5", RO = "#ff6f91", O = "#f7c548", L = "#9be15d", N = "#1b1240";
const ch = (t: number, txt: string, slot: Slot = "tl", col = V, tinta?: string, t1?: number) => { B.push({ k: "chip", t, txt, slot, col, tinta, t1 }); return t; };
const bg = (t: number, txt: string, o: Partial<{ y: number; x: number; col: string; size: number; t1: number; golpe: boolean }> = {}) => { B.push({ k: "big", t, txt, ...o }); return t; };
const ic = (t: number, ico: string, x: number, y: number, o: Partial<{ s: number; t1: number; tacha: number; label: string }> = {}) => { B.push({ k: "ico", t, ico, x, y, ...o }); return t; };
const cu = (t: number, t1: number, de: number, a: number, x: number, y: number, o: Partial<{ size: number; suf: string; pre: string; col: string; fin: number }> = {}) => { B.push({ k: "cuenta", t, t1, de, a, x, y, ...o }); return t; };
const tr = (t: number, n: number, name: string) => { B.push({ k: "trap", t, n, name }); return t; };
// fila de íconos que entran uno por palabra (lista)
const fila = (items: [number, string, string][], y = 860, s0 = 1, pool = "pop") => items.forEach(([t, ico, label], i) => { ic(t, ico, 960 + (i - (items.length - 1) / 2) * 300, y, { s: s0, label, t1: items[items.length - 1][0] + 2.6 }); s(t, pool, pool === "pop" ? 0 : -4, pool === "pop" ? { pitch: i } : undefined); });

// ── cámara y caminata (keyframes; la cámara sigue al protagonista con un desvío dx)
// v = velocidad de caminata (u/s); plano = [t, dx, y, z] (y = centro vertical de cámara en el mundo; suelo y = 0)
export const VEL: [number, number][] = [];
export const PLANOS: [number, number, number, number, number][] = []; // t, dx, y, z, duración de la transición
export const OSC: [number, number][] = []; // oscuridad 0-1
export const FUEGO: [number, number][] = [[0, 0]]; // tinte naranja del cielo
export const SALTOS: [number, number][] = []; // teletransportes de X (sólo con la cámara en el cielo)
const v = (t: number, vel: number) => VEL.push([t, vel]);
const pl = (t: number, dx: number, y: number, z: number, d = 1.1) => PLANOS.push([t, dx, y, z, d]);
const os = (t: number, a: number) => OSC.push([t, a]);
const BASE = { dx: 200, y: -330, z: 1 };
const pb = (t: number, d = 1.1) => pl(t, BASE.dx, BASE.y, BASE.z, d);

// ── momentos de las piezas grandes (los usa Noche.tsx)
export const M: Record<string, number> = {};

// ═══════════════ GANCHO 0-56 s ═══════════════
v(0, 0); os(0, 0.42); pl(0, 80, -1010, 1.32, 0.01);
M.olla = 0.25; s(0.05, "slam", -2); s(0.25, "wood_hit", -3); s(0.4, "whoosh_big", -2);
ch(at("midnight", -0.9), "MIDNIGHT", "tl", V); ch(at("rome", -0.3), "ROME · AD 90", "tl2", R);
pl(0.5, 70, -380, 1.06, 4.2); s(0.9, "riser", -2, { dur: 4 });
[4, 3, 2, 1].forEach((p, i) => s(0.9 + i * 0.95, "tick", 0));
bg(at("fifth floor"), "5TH FLOOR", { y: 170, col: A, size: 110, t1: ah("you have about") - 0.2 });
M.congela = at("you have about"); s(M.congela, "flash", -2); s(M.congela + 0.05, "heart", -4, { dur: 2.5 });
cu(M.congela + 0.1, M.congela + 1.4, 2, 2, 1500, 330, { size: 220, suf: ".0 s", col: R });
M.negro = at("you cannot see it"); os(M.negro - 0.05, 0.42); os(M.negro + 0.15, 0.9); s(M.negro, "drone", -4, { dur: 4 });
ch(at("single streetlight"), "STREET LIGHTS: 0", "tr", R);
cu(at("one million", -0.2), ah("one million", 1.1), 0, 1000000, 960, 210, { size: 120, suf: " PEOPLE", col: "#fff3d6" });
s(ah("one million", -0.2), "roll", -2, { dur: 1.2 });
M.abogado = at("a roman lawyer"); s(M.abogado, "pop", 0); s(M.abogado + 0.2, "spring", -2);
ch(M.abogado + 0.3, "ROMAN LAWYER", "tr2", T, N);
M.precio = at("your skull"); s(M.precio, "coin", -2); s(M.abogado + 1.0, "write", -4, { dur: 1.2 });
M.cae = at("was worth", 0.5); s(M.cae - 0.05, "shatter", 0); s(M.cae, "boom", -6); s(M.cae + 0.1, "gasp", -2);
os(M.cae, 0.55); pl(M.cae, 160, -600, 0.78, 1.6);
M.martes = at("normal tuesday"); v(M.martes - 0.6, 0);
ch(M.martes, "A NORMAL TUESDAY", "tc", A, N); ch(at("capital of the world"), "CAPITAL OF THE WORLD", "bc", R);
M.ventanas0 = M.martes; [0.2, 0.9, 1.5, 2.1].forEach((d) => s(M.ventanas0 + d, d > 1 ? "shatter" : "splash", -9));
M.juv1 = at("the roman poet"); s(M.juv1, "slam", -6); s(M.juv1 + 0.1, "wood_hit", -6); pl(M.juv1, 380, -820, 1.12, 1.2);
ch(at("juvenal"), "JUVENAL · POET", "tl", V);
M.testa = at("write your will"); s(M.testa - 0.4, "unroll", -2); ch(M.testa, "WRITE YOUR WILL FIRST", "bc", R);
s(M.testa + 0.6, "write", -2, { dur: 1.5 }); s(at("he was joking"), "stamp", -2);
ch(at("mostly"), "...MOSTLY", "tr", A, N);
M.sol = at("the sun went"); s(M.sol, "whoosh", -4); pl(M.sol, 260, -420, 0.72, 2.0); v(M.sol, 60);
M.obst = at("obstacle course"); bg(M.obst, "OBSTACLE COURSE", { y: 160, col: "#fff3d6", size: 120, t1: ah("so tonight") - 0.3 });
ch(at("designed by nobody"), "DESIGNED BY NOBODY", "tl", R); ch(at("maintained"), "MAINTAINED BY NO ONE", "tl2", V);
[0, 0.5, 1.0, 1.5, 2.0].forEach((d) => s(M.obst + 0.2 + d * 0.8, "pop", -1, { pitch: d * 2 }));
// subida al cielo: el mapa del camino
M.cielo = at("so tonight"); pl(M.cielo, 200, -3600, 1, 2.2); s(M.cielo, "whoosh_big", -2); s(M.cielo + 0.6, "riser", -4, { dur: 2.2 });
M.ruta = at("one mile"); s(M.ruta, "write", -2, { dur: 3 });
ch(M.ruta, "1 MILE HOME", "tl", T, N);
M.trampas = at("count every single"); M.siete = at("seven of them"); bg(M.siete, "7 TRAPS", { y: 150, col: R, size: 150, golpe: true });
for (let i = 0; i < 7; i++) s(M.trampas + 0.35 + i * 0.5, "pop", 0, { pitch: i });
M.casaQ = at("the most dangerous"); s(M.casaQ, "suspense", -3, { dur: 3 }); ch(at("not the street"), "NOT THE STREET?!", "tr", R);
M.antorcha = at("grab a torch"); s(M.antorcha, "flame", -3, { dur: 1.2 }); s(M.antorcha + 0.1, "whoosh_big", -1);
SALTOS.push([M.antorcha - 0.5, 600]);
M.baja = at("lets go"); pl(M.antorcha + 0.25, 260, -330, 1.18, 1.5); s(M.baja, "zoom", -2); os(M.cielo, 0); os(M.baja, 0.12);

// ═══════════════ TRAMPA 1 · LA OSCURIDAD ═══════════════
export const TEMAS: [number, string][] = [[0, "insulas"], [44, "villa"], [72, "callejon"]];
M.t1 = tr(at("trap number one"), 1, "THE DARK"); s(M.t1, "boom", -4); s(M.t1 + 0.1, "slam", -2);
pb(M.t1 + 1.6); v(M.t1, 0);
ch(at("the year 90"), "AD 90", "tl", R); M.domiciano = at("domitian"); s(M.domiciano, "coin", -3); ch(M.domiciano, "EMPEROR DOMITIAN", "tl2", V);
M.liron = at("stuffed dormouse"); s(M.liron, "squeak", -4); ic(M.liron, "liron", 1450, 300, { s: 1.1, label: "STUFFED DORMOUSE", t1: M.liron + 3.4 });
M.vino = at("too much wine"); s(M.vino, "pop", -2); ic(M.vino, "copa", 1700, 520, { s: 0.9, t1: M.vino + 2.6 }); s(M.vino + 0.8, "spring", -6);
M.adios = at("saying goodbye"); s(M.adios, "door", -6); pl(M.adios, 120, -360, 1.25, 1.4);
M.puerta = at("step outside"); s(M.puerta + 0.3, "door", -2); M.ojos = at("disappears"); s(M.ojos, "slam", -2);
os(M.puerta + 0.2, 0.12); os(M.ojos, 0.985); s(M.ojos + 0.1, "drone", -4, { dur: 3 });
v(M.ojos + 0.4, 0); pb(M.ojos, 0.5); // en la negrura sólo parpadean sus ojos
M.sinluz = at("rome has no streetlights"); os(M.sinluz + 0.4, 0.8); v(M.sinluz + 0.4, 100);
M.ninguna = at("none"); ic(at("not one public lamp"), "farol", 1450, 470, { s: 1.4, tacha: ah("not one public lamp", 1.1), t1: ah("lighting the streets") + 1 });
s(ah("not one public lamp", 1.1), "fail", -2); ch(M.ninguna, "NONE.", "tr", R);
ch(at("lighting the streets"), "NOT THE CITY'S JOB", "tl", V);
M.tablas = at("shuttered with wooden"); s(M.tablas, "wood_hit", -4); s(M.tablas + 0.4, "wood_hit", -6); s(M.tablas + 0.8, "wood_hit", -8);
ch(M.tablas, "SHOPS: BOARDED UP", "tl", A, N); M.cerradas = at("the windows are closed"); s(M.cerradas, "slam", -6); ch(M.cerradas, "WINDOWS: SHUT", "tl2", V);
M.nube = at("no moon"); s(M.nube, "wind", -4, { dur: 2.5 }); os(M.nube + 1.5, 0.97); v(M.nube, 0);
M.mano = at("see your own hand"); s(M.mano, "suspense", -4, { dur: 2 }); ch(M.mano + 0.6, "YOUR OWN HAND?", "tr", R); pl(M.nube + 1, 120, -380, 1.45, 1.8);
M.rico = at("the rich solved"); pb(M.rico, 1.4); s(M.rico, "fanfare", -8, { dur: 1.6 }); os(M.rico, 0.86);
ch(at("with people"), "WITH PEOPLE.", "tr", O, N);
M.esclavos = at("slaves going ahead"); s(M.esclavos, "flame", -8, { dur: 1 }); s(M.esclavos, "step", -4);
M.laterna = at("laternarius"); bg(M.laterna, "LATERNARIUS", { y: 170, col: A, size: 120, t1: M.laterna + 3.8 }); s(M.laterna, "ding", -2);
ch(at("the lantern man"), "= THE LANTERN MAN", "bc", T, N);
M.carrera = at("his entire career"); M.hoyo = at("fall into a hole"); s(M.hoyo - 0.3, "whoosh", -6); s(M.hoyo, "fall", -2); s(M.hoyo + 0.1, "sad", -6, { dur: 1.6 });
ch(M.carrera, "WHOLE CAREER: WALK IN FRONT", "tl", V);
M.notienes = at("you do not have a"); os(M.notienes + 0.4, 0.95); s(M.notienes, "fail", -4); ch(M.notienes, "YOU: NO LANTERN MAN", "tr", R);
M.lampara = at("small clay oil lamp"); s(M.lampara, "flash", -6); s(M.lampara + 0.2, "flame", -6, { dur: 0.8 }); os(M.lampara + 0.3, 0.9);
M.vela = at("birthday candle"); ic(M.vela, "vela", 1500, 330, { s: 1.2, label: "= 1 BIRTHDAY CANDLE", t1: M.vela + 3 }); s(M.vela, "sparkle", -4);
M.viento = at("wind blows"); s(M.viento - 0.4, "wind", -2, { dur: 1.6 }); s(M.viento + 0.2, "blowout", -2); s(M.viento + 1.3, "flash", -8);
M.piso = at("and what are you walking on"); pl(M.piso, 180, -60, 1.5, 1.4); v(M.piso, 120); os(M.piso, 0.72);
ch(at("polygonal stones"), "MAIN ROADS: STONE", "tl", T, N); ch(at("packed earth"), "SIDE STREETS: MUD", "tl2", A, N);
fila([[at("animal dung"), "bosta", "DUNG"], [at("broken pottery"), "tiesto", "POTTERY"], [at("rotting vegetables"), "verdura", "ROTTING VEG"], [at("the deep ruts"), "surco", "RUTS"]], 300, 0.95);
 
ch(at("was not a road"), "NOT A ROAD", "tr", R); M.pies = at("feel with your feet"); ch(M.pies, "A TRAP YOU FEEL", "tr2", V); s(M.pies, "suspense", -6, { dur: 1.5 });
M.sinnombre = at("no names"); pb(M.sinnombre - 0.4, 1.2); ic(M.sinnombre, "cartel", 1450, 330, { s: 1.2, t1: ah("if you asked") });
s(M.sinnombre, "pop", 0); ch(at("no street signs"), "NO SIGNS", "tl", R); M.numeros = at("no house numbers"); ch(M.numeros, "NO NUMBERS", "tl2", R); s(M.numeros, "fail", -6);
M.vecino = at("if you asked for directions"); v(M.vecino, 0); s(M.vecino, "pop", -2);
fila([[at("old fig tree"), "higuera", "OLD FIG TREE"], [at("shrine of the crossroads"), "santuario", "CROSSROADS SHRINE"], [at("fullers shop"), "batan", "FULLER'S SHOP"]], 240, 1);
 
ch(at("perfect advice"), "PERFECT ADVICE", "tr", L, N); M.dia = at("in daylight"); s(M.dia, "sparkle", -4); s(M.dia + 0.9, "drone", -6, { dur: 1.5 });
M.igual = at("every alley"); v(M.igual, 140); ch(M.igual, "EVERY ALLEY = THE SAME", "tc", V);
M.mal = at("wrong one"); s(M.mal, "fail", -2); bg(M.mal, "WRONG WAY", { y: 200, col: R, size: 110, t1: M.mal + 2.4 });
M.hora = at("check the time"); pl(M.hora, 200, -900, 0.9, 1.6); s(M.hora, "whoosh", -4); v(M.hora, 70);
M.doce = at("12 hours"); bg(M.doce, "12 NIGHT HOURS", { y: 160, col: "#fff3d6", size: 100, t1: ah("the army divided") - 0.2 }); s(M.doce, "tick", -2);
M.invierno = at("in winter"); ch(M.invierno, "WINTER HOUR: LONG", "tl", T, N); ch(at("in summer"), "SUMMER HOUR: SHORT", "tl2", A, N);
M.guardias = at("four watches"); s(M.guardias, "warhorn", -4, { dur: 1.8 }); ch(M.guardias, "ARMY: 4 WATCHES", "tr", R);
M.civil = at("you a civilian"); pb(M.civil, 1.2); ch(at("have nothing"), "YOU: NOTHING", "tr2", V);
fila([[at("no clock"), "reloj", "NO CLOCK"], [at("no watch"), "trompeta", "NO WATCH"]], 280, 1);
 
ch(at("second hour"), "2ND HOUR? 7TH?", "tc", A, N); M.tarde = at("left earlier"); s(M.tarde, "drop", -2);

// ═══════════════ TRAMPA 2 · LOS CARROS ═══════════════
TEMAS.push([ah("trap number two", -6), "via"]);
M.t2 = tr(at("trap number two"), 2, "THE CARTS"); s(M.t2, "boom", -4); s(M.t2 + 0.1, "slam", -2); v(M.t2, 0); pb(M.t2 + 0.5);
M.rumor = at("a rumble"); s(M.rumor - 0.4, "rumble", 0, { dur: 3 }); ch(M.rumor, "RUMBLE...", "tl", A, N);
M.gritos = at("then the shouting"); s(M.gritos, "crowd_angry", -6, { dur: 1.6 }); s(M.gritos + 0.3, "moo", -8);
ch(at("most people do not know"), "MOST PEOPLE DON'T KNOW", "tc", V);
M.ley = at("a traffic law"); s(M.ley, "stamp", 0); bg(at("it was brutal"), "BRUTAL", { y: 860, col: R, size: 110, t1: ah("around 45") });
ch(at("around 45"), "45 BC", "tl", R); M.cesar = at("julius caesar"); s(M.cesar, "fanfare", -8, { dur: 1.4 }); ch(M.cesar, "JULIUS CAESAR'S LAW", "tl2", V);
M.prohibe = at("banned most wheeled"); s(M.prohibe, "stamp", -2); s(M.prohibe + 0.2, "fail", -6);
M.franja = at("from sunrise"); s(M.franja, "write", -2, { dur: 2.2 }); ch(at("10th hour"), "SUNRISE → 10TH HOUR", "tl", A, N);
ch(at("no carts"), "NO CARTS", "tr", R);
M.excep = at("a few exceptions"); s(M.excep + 0.6, "ding", -4); ch(at("stone for temples"), "TEMPLE STONE: OK", "tl2", L, N);
M.espera = at("everything else waited"); s(M.espera, "tick", -6); s(M.espera + 0.4, "tick", -6);
M.lista = at("think about what"); pl(M.lista, 200, -380, 0.92, 1.2); v(M.lista, 60);
ch(at("a million people"), "1,000,000 MOUTHS", "tl", T, N);
fila([[at("food"), "pan", "FOOD"], [at("wine"), "anfora", "WINE"], [at("firewood"), "lena", "FIREWOOD"], [at("bricks"), "ladrillo", "BRICKS"], [at("marble"), "marmol", "MARBLE"], [at("timber"), "tronco", "TIMBER"]], 250, 0.85);
 
ch(at("every single day"), "EVERY SINGLE DAY", "tr", R);
M.ruedas = at("came in on wheels"); s(M.ruedas, "roll", -6, { dur: 0.8 }); M.denoche = at("came in at night"); bg(M.denoche + 0.3, "AT NIGHT", { y: 870, col: A, size: 130, golpe: true, t1: M.denoche + 2.6 });
M.carros = at("stumbling home in the dark"); pb(M.carros); v(M.carros, 0);
M.carro1 = at("supply chain"); s(M.carro1 - 0.5, "rumble", -2, { dur: 4 }); s(M.carro1, "hoof", -6, { dur: 3 }); ch(M.carro1, "THE EMPIRE'S SUPPLY CHAIN", "tc", V);
M.pesados = at("heavy wagons"); s(M.pesados, "moo", -6); ch(at("oxen and mules"), "OXEN · MULES", "tl", A, N); ch(at("amphorae"), "SACKS · AMPHORAE · STONE", "tl2", T, N);
M.ancho = at("barely wider"); s(M.ancho, "tick", -2); pl(M.ancho, 150, -420, 0.88, 1);
M.ciego = at("the drivers cannot see you"); s(M.ciego, "gasp", -6); ch(M.ciego, "DRIVER: CAN'T SEE YOU", "tr", R);
ch(at("they are tired"), "TIRED", "tl", V); ch(at("they are late"), "LATE", "tl2", A, N); M.gritan = at("shouting at their"); s(M.gritan, "crowd_angry", -8, { dur: 1.4 }); s(M.gritan + 0.4, "moo", -6);
M.juv2 = at("juvenal describes exactly"); s(M.juv2, "slam", -6); s(M.juv2 + 0.1, "wood_hit", -6); ch(M.juv2, "JUVENAL AGAIN", "tl", V);
M.abeto = at("giant fur log"); s(M.abeto, "creak", -4); ch(M.abeto, "A GIANT FIR LOG", "tr", A, N); M.pino = at("pine tree"); s(M.pino, "creak", -4); ch(M.pino, "A WHOLE PINE TREE", "tr2", L, N);
M.balancea = at("swaying"); pl(M.balancea, 200, -620, 0.82, 1.4);
M.marmolC = at("the worst one", 0) ; ch(at("marble from liguria"), "MARBLE FROM LIGURIA", "tl", "#d8d0c4", N);
M.eje = at("the axle breaks"); s(M.eje, "wood_hit", 0); s(M.eje + 0.25, "collapse", 0); s(M.eje + 0.3, "boom", -2); pl(M.eje, 200, -400, 0.95, 0.3);
M.queda = at("what is left of their bodies"); ch(M.queda, "WHAT IS LEFT?", "tr", V); M.nada = at("nothing"); bg(M.nada, "NOTHING.", { y: 200, col: "#fff3d6", size: 140, t1: M.nada + 2.2 }); s(M.nada, "slam", -2);
M.almas = at("just like their souls"); s(M.almas, "sparkle", -6); s(M.almas, "sad", -10, { dur: 1.4 });
M.dormir = at("will not let you sleep"); pl(M.dormir, 120, -820, 1.15, 1.6); s(M.dormir + 0.5, "snore", -6, { dur: 1.2 });
M.enfermos = at("most of the sick"); s(M.enfermos, "fail", -6); ch(M.enfermos, "DIED FROM: NO SLEEP", "tl", R); s(at("lack of sleep"), "rumble", -8, { dur: 2 });
ch(at("the drovers cursing"), "DROVERS CURSING", "tl2", A, N); s(ah("the drovers cursing"), "crowd_angry", -10, { dur: 1.2 });
M.foca = at("wake up a seal"); s(M.foca, "spring", -2); s(M.foca + 0.2, "gasp", -6); ic(M.foca, "foca", 1500, 330, { s: 1.2, label: "A SEAL", t1: ah("claudius", 1.5) });
M.claudio = at("emperor claudius"); s(M.claudio, "snore", -6, { dur: 1 }); s(M.claudio + 1.4, "gasp", -4); ic(M.claudio, "claudio", 450, 330, { s: 1.1, label: "CLAUDIUS", t1: M.claudio + 4.2 });
M.pared = at("flat against a wall"); pb(M.pared - 0.5, 1); s(M.pared, "stomp", -4); s(M.pared + 0.3, "rumble", -2, { dur: 3 }); s(M.pared + 0.6, "hoof", -4, { dur: 2.4 });
M.dedos = at("this far from your toes"); s(M.dedos, "whoosh", -2); pl(M.dedos - 0.4, 80, -150, 1.7, 0.8); bg(M.dedos + 0.4, "2 CM", { y: 220, col: R, size: 130, t1: M.dedos + 2.4 });
M.sigue2 = at("you keep walking"); pb(M.sigue2, 1); v(M.sigue2, 150);

// ═══════════════ TRAMPA 3 · LAS VENTANAS ═══════════════
TEMAS.push([ah("trap number three", -4), "insulas"]);
M.t3 = tr(at("trap number three"), 3, "THE WINDOWS"); s(M.t3, "boom", -4); s(M.t3 + 0.1, "slam", -2);
M.mira = at("now look up"); pl(M.mira, 200, -1150, 0.85, 0.9); s(M.mira, "whoosh", -2); v(M.mira, 40);
M.nomira = at("actually do not"); pb(M.nomira + 0.2, 0.45); s(M.nomira + 0.2, "whoosh", -2); s(M.nomira + 0.5, "slam", -6);
M.rapido = at("just walk faster"); v(M.rapido, 260); s(M.rapido, "step", -2); ch(M.rapido, "WALK FASTER", "tc", R);
v(at("most romans did not"), 120); ch(at("did not live in houses"), "NOT IN HOUSES", "tl", R);
M.insulae = at("they lived in insulae"); pl(M.insulae, 220, -720, 0.62, 1.6); bg(M.insulae, "INSULAE", { y: 140, col: A, size: 130, t1: M.insulae + 3.2 }); s(M.insulae, "slam", -2);
M.pisos = at("four five"); [0, 0.5, 1.0].forEach((d, i) => s(M.pisos + d, "pop", 0, { pitch: i * 2 }));
M.manos = at("shake hands"); s(M.manos, "pop", -2); ch(M.manos, "NEIGHBOURS: HANDSHAKE DISTANCE", "bc", T, N);
M.sinagua = at("no running water"); pb(M.sinagua, 1.3); fila([[M.sinagua, "grifo", "NO WATER"], [at("no toilets"), "letrina", "NO TOILET"]], 280, 1.05);
s(M.sinagua + 0.5, "fail", -6);
M.basura = at("so what happened"); ch(at("get rid of"), "SO WHERE DID IT GO?", "tc", V);
fila([[at("broken pots"), "tiesto", "BROKEN POTS"], [at("old food"), "verdura", "OLD FOOD"], [at("chamber pot"), "orinal", "THE CHAMBER POT"]], 250, 1);
 
M.tira = at("out the window"); pl(M.tira, 200, -640, 0.78, 1); [0, 0.5, 1.1, 1.6, 2.2].forEach((d) => { s(M.tira + d, "whoosh", -10); s(M.tira + d + 0.9, d % 1 ? "splash" : "shatter", -6); });
M.juv3 = at("again"); s(M.juv3, "slam", -6); ch(M.juv3, "JUVENAL AGAIN (x3)", "tl", V);
M.altura = at("height of the roofs"); pl(M.altura, 200, -1000, 0.8, 1.6); [0.6, 1.5, 2.4, 3.3].forEach((d) => s(M.altura + d + 1.0, "shatter", -4));
M.descuido = at("count yourself careless"); pb(M.descuido); ch(M.descuido, "NO WILL? CARELESS.", "tr", R);
M.muertes = at("as many deaths"); s(M.muertes, "suspense", -6, { dur: 2 }); pl(M.muertes, 200, -760, 0.7, 1.4);
M.abiertas = at("open windows"); cu(M.abiertas - 0.3, M.abiertas + 2.2, 0, 23, 1500, 230, { size: 140, pre: "", suf: " DEATHS", col: R });
for (let i = 0; i < 12; i++) s(M.abiertas + i * 0.2, "wood_hit", -12);
M.cuenco = at("empty a basin"); pb(M.cuenco - 1.4, 1); v(M.cuenco - 1.4, 0); s(M.cuenco - 0.2, "whoosh", -4); s(M.cuenco + 0.35, "splash", 0); s(M.cuenco + 0.45, "sad", -6, { dur: 1.6 });
M.sopa = M.cuenco + 0.35; // desde acá el protagonista queda sucio de sopa (continuidad)
ch(M.cuenco + 0.6, "BEST CASE.", "tr", A, N);
M.increible = at("here is the incredible"); s(M.increible, "riser", -6, { dur: 1.5 });
M.accion = at("special legal action"); s(M.accion, "stamp", 0); ch(M.accion, "A SPECIAL LAWSUIT", "tl", V);
M.latin = at("poured or thrown"); bg(at("in latin"), "DE EFFUSIS VEL DEIECTIS", { y: 150, col: O, size: 84, t1: ah("if something was thrown") }); s(ah("in latin"), "slam", -2);
M.paga = at("the person living there"); s(M.paga, "ding", -4); ch(M.paga, "THE TENANT PAYS", "tl", R); ch(at("meant it or not"), "ON PURPOSE OR NOT", "tl2", A, N);
M.ropa = at("damage to your clothes"); ic(M.ropa, "tunica", 1450, 360, { s: 1.1, t1: M.ropa + 3 }); M.doble = at("paid double"); bg(M.doble, "×2", { x: 1650, y: 300, col: A, size: 160, t1: M.doble + 1.8 }); s(M.doble, "coin", -2);
M.cincuenta = at("free person was killed"); M.oro = at("50 gold coins"); s(M.oro, "coin_rain", -2); cu(M.oro, ah("50 gold coins", 1.3), 0, 50, 960, 230, { size: 170, suf: " GOLD COINS", col: O });
M.cicatriz = at("no price for the scars"); ch(M.cicatriz, "SCARS: NO PRICE", "tl", T, N); s(M.cicatriz, "pop", -2);
M.jurista = at("a roman jurist"); s(M.jurista, "pop", -2); ch(M.jurista, "A ROMAN JURIST", "tr", V);
M.cita = at("the body of a free man"); s(M.cita, "sparkle", -4); s(at("which is beautiful"), "ding", -6);
M.sopaYo = at("wearing the soup"); s(M.sopaYo, "drop", -2); ch(M.sopaYo, "YOU: WEARING THE SOUP", "bc", A, N);
M.regla2 = at("a second rule"); ch(M.regla2, "RULE #2", "tl", R); s(M.regla2, "stamp", -2); pl(M.regla2, 200, -760, 0.88, 1.4);
M.maceta = at("like a flowerpot"); s(M.maceta, "creak", -2); s(M.maceta + 1.2, "creak", -4);
M.cualquiera = at("anyone at all"); ch(M.cualquiera, "ANYONE COULD SUE", "tr", V); s(M.cualquiera, "popcluster", -4);
M.leymaceta = at("law against dangerous"); bg(M.leymaceta + 0.2, "ANTI-FLOWERPOT LAW", { y: 160, col: L, size: 96, t1: ah("you wipe your face") }); s(M.leymaceta + 0.2, "slam", -2);
M.cayo = at("landed on somebody"); s(M.cayo - 0.6, "whoosh", -4); s(M.cayo, "wood_hit", 0); s(M.cayo + 0.1, "spring", -2); s(M.cayo + 0.3, "sparkle", -8);
M.limpia = at("you wipe your face"); pb(M.limpia, 1); s(M.limpia, "cloth", -2); v(at("you keep walking"), 150);

// ═══════════════ TRAMPA 4 · LOS LADRONES ═══════════════
TEMAS.push([ah("trap number four", -4), "cruce"]);
M.t4 = tr(at("trap number four"), 4, "THE THIEVES"); s(M.t4, "boom", -4); s(M.t4 + 0.1, "slam", -2); os(M.t4, 0.62);
M.ojosOsc = at("not alone"); s(M.ojosOsc, "suspense", -4, { dur: 2 }); os(M.ojosOsc, 0.8);
M.pasos = at("footsteps stop"); v(M.pasos - 1.2, 120); v(M.pasos - 0.2, 0); v(M.pasos + 0.6, 120); v(M.pasos + 1.3, 0); v(M.pasos + 2.0, 0);
[-1.0, -0.6, 0.7, 1.1].forEach((d) => { s(M.pasos + d, "step", -4); s(M.pasos + d + 0.22, "step", -9); });
ch(M.pasos, "...THEY STOP TOO", "tr", R); s(at("yours stop"), "heart", -6, { dur: 2 });
M.policia = at("no police"); v(M.policia, 100); ic(M.policia, "escudo", 1500, 320, { s: 1.1, tacha: M.policia + 0.6, label: "POLICE", t1: ah("no patrol", 1.5) }); s(M.policia + 0.6, "fail", -4);
ch(at("no number to call"), "NO NUMBER TO CALL", "tl", V); ch(at("no patrol"), "NO PATROL", "tl2", R);
M.dueno = at("belonged to whoever"); ch(M.dueno, "THE NIGHT BELONGS TO WHOEVER'S OUT", "bc", A, N);
M.ladron1 = at("burglars broke"); s(M.ladron1, "wood_hit", -2); s(M.ladron1 + 0.5, "wood_hit", -4); ch(M.ladron1, "BURGLARS", "tl", R);
M.bolsa = at("cut purses"); s(M.bolsa, "swish", -2); s(M.bolsa + 0.3, "coin", -4); ch(M.bolsa, "PURSE CUTTERS", "tl2", V); M.capa = at("stole cloaks"); s(M.capa, "cloth", -2); ch(M.capa, "CLOAK THIEVES", "tr", A, N);
M.peores = at("the worst ones"); s(M.peores, "suspense", -4, { dur: 1.5 });
M.ricos = at("rich young men"); s(M.ricos, "glass", -6); s(M.ricos + 1, "crowd_laugh", -10, { dur: 1.5 }); fila([[at("drunk"), "copa", "DRUNK"], [at("bored"), "bostezo", "BORED"], [at("looking for a fight"), "puno", "WANTS A FIGHT"]], 250, 0.95);
 
M.juv4 = at("juvenal describes this"); s(M.juv4, "slam", -6); ch(M.juv4, "JUVENAL AGAIN (x4)", "tl", V);
M.matón = at("a drunken bully"); pl(M.matón, 230, -400, 1.25, 1.2); v(M.matón, 0); s(M.matón, "stomp", -2);
M.bloquea = at("blocks your way"); s(M.bloquea, "stomp", -4); ch(at("who you are"), "WHO ARE YOU?", "tr", R); ch(at("where you have been"), "WHERE HAVE YOU BEEN?", "tr2", A, N);
M.habas = at("beans and vinegar"); s(M.habas, "pop", 0); ic(M.habas, "habas", 1520, 520, { s: 1, label: "BEANS + VINEGAR", t1: M.habas + 3 });
M.igual2 = at("the result is the same"); ch(M.igual2, "ANSWER = SILENCE = SAME", "tl", V);
M.golpe = at("he hits you"); s(M.golpe, "punch", 0); s(M.golpe + 0.1, "sparkle", -6); pl(M.golpe, 200, -360, 1.35, 0.2);
M.denuncia = at("files a complaint"); s(M.denuncia, "stamp", 0); ch(M.denuncia + 0.3, "...AND SUES YOU", "tr", R);
M.dientes = at("a few teeth left"); s(M.dientes, "drop", -2); ch(M.dientes, "FREEDOM = KEEPING A FEW TEETH", "bc", A, N); pb(M.dientes, 1.2);
// Nerón en el teatro de sombras: la lámpara proyecta la historia sobre un muro largo
M.sombras = at("the most famous night"); v(M.sombras, 0); pl(M.sombras, 520, -520, 0.9, 1.8); s(M.sombras, "whoosh", -4); s(M.sombras + 0.3, "suspense", -4, { dur: 2.5 });
M.emperador = at("the emperor himself", 0); s(M.emperador, "boom", -4); bg(M.emperador + 0.3, "THE EMPEROR", { y: 150, col: R, size: 120, t1: ah("according to the historian") });
M.suetonio = at("according to the historian"); ch(M.suetonio, "SUETONIUS · NERO 26", "tl", V);
M.disfraz = at("a cap or a wig"); s(M.disfraz, "cloth", -2); s(M.disfraz + 0.6, "spring", -6);
M.amigos = at("roam the streets"); s(M.amigos, "step", -4); s(M.amigos + 0.5, "crowd_laugh", -10, { dur: 1.4 });
M.ataca = at("he would attack"); s(M.ataca, "punch", -2); M.apuñala = at("stab the ones"); s(M.apuñala, "swish", -2); M.cloacaN = at("into the sewers"); s(M.cloacaN, "splash", -2);
M.tiendas = at("broke into shops"); s(M.tiendas, "wood_hit", -2); M.palacio = at("inside the palace"); s(M.palacio, "coin", -2); ch(M.palacio, "SOLD THE LOOT AT THE PALACE", "tr", O, N);
M.montano = at("julius montanus"); ch(M.montano, "SENATOR JULIUS MONTANUS", "tl", T, N); M.pega = at("fought back hard"); s(M.pega, "punch", 0); s(M.pega + 0.25, "punch", -2);
M.sabe = at("he realized who"); s(M.sabe, "gasp", -4); M.perdon = at("he apologized"); s(M.perdon, "pop", -2);
M.error = at("that was his mistake"); s(M.error, "fail", -2); ch(at("an apology meant"), "SORRY = HE KNEW", "tr", R);
M.vida = at("take his own life"); s(M.vida, "blowout", -2); s(M.vida + 0.3, "sad", -8, { dur: 2 });
M.eleccion = at("a very difficult choice"); pb(M.eleccion - 1, 1.2); v(M.eleccion - 1, 0); s(M.eleccion, "suspense", -6, { dur: 1.5 });
M.pelea = at("fight back and maybe"); s(M.pelea, "slam", -2); M.nopelea = at("do not fight back"); s(M.nopelea, "slam", -2);
M.doce12 = at("one rule in your favor"); s(M.doce12, "ding", -2); v(M.doce12, 60);
M.tablas12 = at("the twelve tables"); s(M.tablas12, "stamp", 0); bg(M.tablas12, "THE TWELVE TABLES", { y: 150, col: O, size: 100, t1: ah("during the day", -0.3) });
M.matar = at("kill him on the spot"); s(M.matar, "sword", -4); ch(M.matar, "THIEF AT NIGHT: LEGAL TO KILL", "bc", R);
M.dia2 = at("during the day you could"); s(M.dia2, "sparkle", -6); ch(at("with a weapon"), "BY DAY: ONLY IF ARMED", "bc", A, N);
M.peor = at("assumed the worst"); bg(M.peor, "ASSUME THE WORST", { y: 160, col: "#fff3d6", size: 100, t1: ah("trap number five") - 0.4 }); s(M.peor, "boom", -6);

// ═══════════════ TRAMPA 5 · EL AGUA ═══════════════
TEMAS.push([ah("trap number five", -3), "valle"]);
M.t5 = tr(at("trap number five"), 5, "THE WATER"); s(M.t5, "boom", -4); s(M.t5 + 0.1, "slam", -2); v(M.t5, 130); os(M.t5, 0.7);
ch(at("lost the thief"), "THIEF: LOST ✓", "tl", L, N); ch(at("lost the road"), "ROAD: LOST ✗", "tl2", R);
M.huele = at("smell the river"); s(M.huele, "drop", -6); s(M.huele + 0.3, "bubbles", -8, { dur: 1 });
M.mapa2 = at("rome was built on hills"); pl(M.mapa2, 200, -3600, 1, 1.6); s(M.mapa2, "whoosh_big", -2); os(M.mapa2, 0.1);
M.pantanos = at("used to be marshes"); s(M.pantanos, "bubbles", -6, { dur: 1.4 });
M.cloaca = at("cloaca maxima"); s(M.cloaca, "slam", -2); bg(M.cloaca, "CLOACA MAXIMA", { y: 150, col: T, size: 110, t1: ah("in places the drains") - 0.3 });
M.hoy = at("still exists today"); s(M.hoy, "ding", -2); ch(M.hoy, "STILL THERE TODAY", "bc", L, N);
M.bajada = at("in places the drains"); pl(M.bajada, 200, -150, 1.1, 1.8); s(M.bajada, "whoosh_big", -2); os(M.bajada + 1, 0.72);
ch(at("were covered"), "COVERED", "tl", T, N); ch(at("they were not"), "...OR NOT", "tl2", R);
M.agujero = at("looks exactly like the ground"); s(M.agujero + 0.8, "whoosh", -6); s(M.agujero + 1.2, "splash", 0); s(M.agujero + 1.4, "sad", -6, { dur: 1.4 });
M.inunda = at("flooded the low parts"); pl(M.inunda, 200, -400, 0.8, 1.4); s(M.inunda, "bubbles", -2, { dur: 2.5 }); ch(at("again and again"), "AGAIN AND AGAIN", "tr", T, N);
M.reversa = at("came up through the drains"); s(M.reversa, "splash", -4); s(M.reversa + 0.6, "splash", -6); bg(at("backwards"), "BACKWARDS", { y: 160, col: T, size: 120, t1: ah("backwards", 2.2) });
M.curadores = at("special officials"); s(M.curadores, "pop", 0); ch(M.curadores, "CURATORS OF THE TIBER", "tl", V);
M.nopudo = at("still could not stop it"); s(M.nopudo, "fail", -4);
M.sandal = at("might be mud"); pb(M.sandal - 0.5, 1.2); fila([[M.sandal, "barro", "MUD?"], [at("might be sewer"), "cloaca", "SEWER?"], [at("might be river"), "olas", "RIVER?"]], 260, 1);
  M.sandalias = at("in sandals"); s(M.sandalias, "spring", -4); ch(M.sandalias, "IN SANDALS", "tr", A, N);
TEMAS.push([M.sandalias + 1, "rio"]);
M.apaga = at("your lamp has gone out"); s(M.apaga + 0.2, "blowout", 0); os(M.apaga + 0.4, 0.95); s(M.apaga + 0.5, "drone", -6, { dur: 2 });
ch(at("frankly having a bad night"), "A BAD NIGHT", "tl", V); M.facil = at("the easy part"); bg(M.facil, "THAT WAS THE EASY PART", { y: 860, col: A, size: 90, t1: M.facil + 2.8 }); s(M.facil, "slam", -2);
M.naranja = at("turning orange"); FUEGO.push([M.naranja - 2.5, 0], [M.naranja + 1.5, 0.75]); os(M.naranja - 2, 0.95); os(M.naranja + 2, 0.4); s(M.naranja, "riser", -2, { dur: 3 }); pl(M.naranja - 1.5, 200, -900, 0.82, 2);

// ═══════════════ TRAMPA 6 · EL FUEGO ═══════════════
TEMAS.push([ah("trap number six", -1), "fuego"]);
M.t6 = tr(at("trap number six"), 6, "THE FIRE"); s(M.t6, "boom", -2); s(M.t6 + 0.1, "flame", -2, { dur: 1.4 }); pb(M.t6 + 0.8, 1.2); v(M.t6, 100); os(M.t6, 0.3);
FUEGO.push([M.t6, 1]);
M.rey = at("true king"); s(M.rey, "fanfare", -8, { dur: 1.5 }); ch(M.rey, "KING OF THE NIGHT", "tl", R);
M.madera = at("what an insula was made of"); pl(M.madera, 380, -560, 0.8, 1.3); v(M.madera, 0); s(M.madera, "whoosh", -4);
fila([[at("wooden floors"), "tabla", "FLOORS: WOOD"], [at("wooden beams"), "viga", "BEAMS: WOOD"], [at("wooden stairs"), "escalera", "STAIRS: WOOD"]], 230, 0.95);
 
ch(at("timber frame"), "WALLS: TIMBER + RUBBLE", "tl", A, N);
M.llamas = at("lit by open flames"); s(M.llamas, "flame", -6, { dur: 0.8 });
fila([[at("oil lamps"), "lampara", "OIL LAMPS"], [at("candles"), "vela", "CANDLES"], [at("charcoal braziers"), "brasero", "BRAZIERS"]], 250, 0.95);
 
M.miles = at("thousands of tiny fires"); pl(M.miles, 300, -700, 0.55, 2.4); cu(M.miles, M.miles + 2, 0, 10000, 960, 200, { size: 120, suf: "+ FLAMES", col: A }); s(M.miles, "roll", -4, { dur: 2 });
ch(at("wooden boxes"), "IN WOODEN BOXES", "tl", R); ch(at("all night long"), "ALL NIGHT LONG", "tl2", V);
M.augusto = at("augustus limited"); pl(M.augusto, 350, -700, 0.68, 1.4); s(M.augusto, "fanfare", -8, { dur: 1.2 });
M.setenta = at("70 roman feet"); s(M.setenta, "roll", -4, { dur: 0.8 }); bg(M.setenta, "70 FT ≈ 20 M", { x: 1500, y: 200, col: O, size: 100, t1: ah("trajan") }); ch(M.setenta, "AUGUSTUS: MAX HEIGHT", "tl", V);
M.trajano = at("trajan cut it"); s(M.trajano, "slam", -2); bg(M.trajano + 0.6, "60 FT", { x: 1500, y: 200, col: A, size: 120, t1: M.trajano + 2.4 });
ch(at("it did not matter"), "DIDN'T MATTER", "tr", R);
M.planta = at("started on the ground floor"); pl(M.planta, 250, -650, 0.66, 1.2); s(M.planta, "flame", -2, { dur: 1.6 });
M.ultimo = at("last to find out"); s(M.ultimo, "snore", -6, { dur: 1.4 }); ch(M.ultimo, "TOP FLOOR: LAST TO KNOW", "tl", A, N);
M.juv5 = at("says your neighbor"); s(M.juv5 - 0.6, "slam", -6); ch(M.juv5 - 0.6, "JUVENAL AGAIN (x5)", "tl", V); M.agua = at("shouting for water"); s(M.agua, "crowd_angry", -8, { dur: 1.3 }); ch(M.agua, "\"WATER!\"", "tr", T, N);
M.tercero = at("third floor is already"); s(M.tercero, "flame", -6, { dur: 1 }); ch(M.tercero, "3RD FLOOR: SMOKING", "tr2", R);
M.nosabes = at("you do not even know"); s(M.nosabes, "snore", -6, { dur: 1.2 });
pl(at("the last one to burn"), 200, -1180, 1.05, 1.4); M.palomas = at("gentle doves"); s(M.palomas, "pigeon", -4, { dur: 1.6 });
M.comunes = at("fires were so common"); pb(M.comunes, 1.4); v(M.comunes, 0); M.craso = at("marcus crassus"); s(M.craso, "coin_rain", -6); bg(M.craso, "MARCUS CRASSUS", { y: 150, col: O, size: 110, t1: ah("richest man", 1.5) });
ch(at("richest man"), "RICHEST MAN IN ROME", "tl", O, N); M.plutarco = at("according to plutarch"); ch(M.plutarco, "PLUTARCH · CRASSUS 2", "tl", V);
M.quinientos = at("500 slaves"); cu(M.quinientos, M.quinientos + 1.2, 0, 500, 1450, 230, { size: 130, suf: "+ BUILDERS", col: A }); s(M.quinientos, "roll", -2, { dur: 1.2 }); s(M.quinientos + 1.3, "ding", -4);
M.oferta = at("would show up"); s(M.oferta, "pop", -2); M.barato = at("for almost nothing"); s(M.barato, "coin", -2); ch(M.barato, "\"I'LL BUY IT. CHEAP.\"", "tr", O, N); s(at("while they were burning"), "flame", -4, { dur: 1 });
M.vendieron = at("the frightened owners sold"); s(M.vendieron, "stamp", -2); M.reconstruye = at("crassus rebuilt"); s(M.reconstruye, "wood_hit", -4); s(M.reconstruye + 0.4, "wood_hit", -4);
M.duenio = at("most of rome"); bg(M.duenio, "OWNER OF MOST OF ROME", { y: 860, col: O, size: 84, t1: M.duenio + 3 }); s(M.duenio, "coin_rain", -4);
M.grande = at("then came the big one"); s(M.grande, "boom", -2); pl(M.grande, 200, -3600, 1, 1.8); s(M.grande + 0.2, "whoosh_big", -2);
ch(at("the year 64"), "AD 64", "tl", R); M.circo = at("circus maximus"); ch(M.circo, "STARTS: CIRCUS MAXIMUS", "tl2", A, N); s(M.circo, "flame", -2, { dur: 2 });
M.seis = at("raged for six days"); cu(M.seis, M.seis + 1.2, 1, 6, 1500, 230, { size: 150, suf: " DAYS", col: R }); s(M.seis, "roll", -4, { dur: 1.2 }); s(at("broke out again"), "flame", -2, { dur: 1.2 });
M.distritos = at("of the 14 districts"); s(M.distritos, "pop", -2); M.tres = at("three were completely"); s(M.tres, "boom", -6); M.siete7 = at("seven were left"); s(M.siete7, "slam", -4); M.cuatro = at("only four survived"); s(M.cuatro, "ding", -2);
M.huye = at("you do not run toward it"); pl(M.huye, -150, -380, 0.95, 1.6); s(M.huye, "whoosh_big", -2); os(M.huye, 0.3); ch(M.huye + 0.2, "DON'T RUN TOWARD IT", "tc", R);
M.corre = at("you run away from it"); v(M.corre, 0); v(M.corre + 0.6, 420); pl(M.corre + 0.5, 320, -360, 0.9, 1.2); s(M.corre + 0.6, "step", -2); s(M.corre + 0.9, "step", -2); s(M.corre + 1.2, "step", -2);
fila([[at("the carts"), "rueda", "CARTS"], [at("the windows", 0), "orinal", "WINDOWS"], [at("the thieves", 0), "daga", "THIEVES"], [at("the sewers"), "cloaca", "SEWERS"]], 250, 0.9);
 

// ═══════════════ TRAMPA 7 · LOS VIGILES ═══════════════
TEMAS.push([ah("trap number seven", -1), "vigiles"]);
M.t7 = tr(at("trap number seven"), 7, "THE VIGILES"); s(M.t7, "boom", -4); s(M.t7 + 0.1, "slam", -2); v(M.t7, 60); pb(M.t7 + 0.5); FUEGO.push([M.t7, 0.8]);
M.botas = at("boots shouting"); s(M.botas, "march", -2, { dur: 3 }); M.baldes = at("clatter of buckets"); s(M.baldes, "metal", -2); s(M.baldes + 0.3, "metal", -4); v(M.botas, 0);
M.vienen = at("the vigils are coming"); bg(M.vienen, "THE VIGILES", { y: 150, col: R, size: 130, t1: ah("after a run") }); s(M.vienen, "warhorn", -6, { dur: 1.4 });
M.aug2 = at("augustus created them"); ch(M.aug2, "AUGUSTUS · AD 6", "tl", V); s(M.aug2, "fanfare", -8, { dur: 1.2 });
M.cohortes = at("seven cohorts"); pl(M.cohortes, 200, -3600, 1, 1.5); s(M.cohortes, "whoosh_big", -2); s(M.cohortes + 1, "march", -6, { dur: 2 });
M.siete000 = at("around 7000"); cu(M.siete000, M.siete000 + 1.2, 0, 7000, 960, 860, { size: 110, suf: " MEN", col: "#fff3d6" }); s(M.siete000, "roll", -4, { dur: 1.2 });
M.dosde14 = at("covering two of"); for (let i = 0; i < 7; i++) s(M.dosde14 + i * 0.28, "pop", -1, { pitch: i });
M.libertos = at("freed slaves"); pb(M.libertos - 0.8, 1.6); ic(M.libertos, "cadena", 1450, 330, { s: 1.2, label: "FREED SLAVES", t1: M.libertos + 2.8 }); s(M.libertos, "metal_fall", -4);
ch(at("firefighters"), "FIREFIGHTERS", "tl", R); M.guardia = at("night watch"); ch(M.guardia, "+ NIGHT WATCH", "tl2", V); s(M.guardia, "ding", -4);
M.equipo = at("they patrolled the streets"); v(M.equipo, 0);
fila([[at("with buckets"), "cubo", "BUCKETS"], [at("axes"), "hacha", "AXES"], [at("ropes"), "soga", "ROPES"], [at("poles"), "vara", "POLES"], [at("blankets soaked"), "manta", "WET BLANKETS"]], 240, 0.85);
 
M.bomba = at("they had pumps"); s(M.bomba, "splash", -2); s(M.bomba + 0.6, "splash", -4, { dur: 2 }); ch(M.bomba, "SIPHO · WATER PUMP", "tr", T, N); pl(M.bomba, 300, -520, 0.82, 1.2);
M.rescate = at("sounds like rescue"); ch(M.rescate, "RESCUE!", "tl", L, N); s(M.rescate, "ding", -4);
M.cubos = at("fire with buckets"); s(M.cubos, "metal", -4); ch(M.cubos, "BUCKETS vs 6 FLOORS", "tr", R);
M.nopuedes = at("cannot put out"); s(M.nopuedes, "fail", -4); M.esparcir = at("stop it from spreading"); ch(M.esparcir, "ONLY STOP IT SPREADING", "tl", A, N);
M.derriba = at("tear down the buildings"); s(M.derriba, "wood_hit", -2); s(M.derriba + 0.6, "wood_hit", -2); s(M.derriba + 1.2, "creak", 0); pl(M.derriba, 350, -560, 0.72, 1.4);
M.tuya = at("might include yours"); s(M.tuya - 0.5, "collapse", 0); s(M.tuya - 0.4, "boom", -2); bg(M.tuya + 0.3, "...INCLUDING YOURS", { y: 860, col: R, size: 100, t1: M.tuya + 2.6 });
M.noayuda = at("not only there to help"); pb(M.noayuda, 1.2); s(M.noayuda, "suspense", -6, { dur: 1.5 });
M.prefecto = at("prefect of the watch"); s(M.prefecto, "fanfare", -8, { dur: 1.2 }); ch(M.prefecto, "PRAEFECTUS VIGILUM", "tl", R);
fila([[at("burglars"), "palanca", "BURGLARS"], [at("housebreakers"), "puerta", "HOUSEBREAKERS"], [at("and thieves"), "daga", "THIEVES"]], 250, 0.95);
 
M.descuidoF = at("through carelessness"); M.palos = at("beaten with sticks"); s(M.palos, "wood_hit", -2); s(M.palos + 0.3, "wood_hit", -4); s(at("flogged"), "whip", -2); ch(M.descuidoF, "CARELESS WITH FIRE?", "tr", R);
M.avisa = at("warn every tenant"); s(M.avisa, "pop", -2); ch(M.avisa, "KEEP WATER IN YOUR ROOM", "bc", T, N);
M.imagina = at("so picture it"); pl(M.imagina, 220, -400, 1.2, 1.2); s(M.imagina, "riser", -6, { dur: 2 });
fila([[at("covered in soup"), "olla", "SOUP"], [at("like the sewer"), "cloaca", "SEWER SMELL"], [at("burning neighborhood"), "llama", "FIRE ZONE"], [at("no light"), "lampara", "NO LIGHT"], [at("no witnesses"), "ojo", "NO WITNESS"]], 250, 0.8);
 
M.victima = at("do not look like a victim"); ch(M.victima, "VICTIM?", "tr", L, N);
M.sospechoso = at("look like a suspect"); bg(M.sospechoso + 0.2, "SUSPECT", { y: 520, col: R, size: 190, golpe: true, t1: M.sospechoso + 1.5 }); s(M.sospechoso + 0.2, "stamp", 0); s(M.sospechoso + 0.25, "boom", -4);
M.sonrie = at("you smile"); s(M.sonrie, "sparkle", -6); M.senala = at("you point at the fire"); s(M.senala, "pop", -2);
M.huir = at("you run"); v(M.huir, 0); v(M.huir + 0.3, 480); s(M.huir + 0.3, "whoosh", -2); [0.4, 0.65, 0.9, 1.15].forEach((d) => s(M.huir + d, "step", -2));
FUEGO.push([M.huir + 1.2, 0.8], [M.huir + 5, 0]);

// ═══════════════ GIRO ═══════════════
TEMAS.push([ah("why did nobody walk", -1), "casa"]);
M.pregunta = at("why did nobody walk"); v(M.pregunta + 1, 0); pl(M.pregunta, 200, -400, 1.05, 1.3); os(M.pregunta, 0.45); bg(M.pregunta + 0.5, "WHY DID NOBODY WALK AT NIGHT?", { y: 170, col: "#fff3d6", size: 70, t1: ah("here is the twist") });
M.giro = at("here is the twist"); s(M.giro, "boom", -2); s(M.giro + 0.05, "whoosh_big", -2); bg(M.giro, "THE TWIST", { y: 180, col: R, size: 140, t1: ah("they did") });
M.lohacian = at("they did"); bg(M.lohacian, "THEY DID.", { y: 180, col: L, size: 160, golpe: true, t1: ah("all the time", 1.5) }); s(M.lohacian, "slam", 0);
M.multitud = at("all the time"); pl(M.multitud, 250, -520, 0.62, 2); v(M.multitud, 90); s(M.multitud, "street", -2, { dur: 4, fade: 1.5 });
M.nunca = at("never actually slept"); ch(M.nunca, "ROME NEVER SLEPT", "tl", V);
M.turno = at("the busiest shift"); ch(M.turno, "NIGHT = THE BUSIEST SHIFT", "tr", A, N); s(M.turno, "ding", -4);
fila([[at("wagons"), "rueda", "WAGONS"], [at("bakers"), "pan", "BAKERS"], [at("slaves carrying lanterns"), "lampara", "LANTERNS"], [at("the vigils on patrol"), "cubo", "VIGILES"], [at("thousands of people"), "gente", "DINER GUESTS"]], 250, 0.82);
 
ch(at("exactly like you"), "EXACTLY LIKE YOU", "bc", T, N);
ch(at("the streets were dark"), "DARK, NOT EMPTY", "tl", V); M.noVacio = at("not empty");
M.oscuro = at("the darker part"); s(M.oscuro, "drone", -4, { dur: 2 });
M.casaPeligro = at("home was not safe"); pl(M.casaPeligro, 380, -620, 0.72, 1.6); v(M.casaPeligro - 1, 0); bg(M.casaPeligro, "HOME WASN'T SAFE EITHER", { y: 150, col: R, size: 84, t1: ah("the great orator") });
M.ciceron = at("the great orator cicero"); s(M.ciceron, "fanfare", -8, { dur: 1.2 }); ch(M.ciceron + 0.4, "CICERO · LANDLORD", "tl", V); s(at("wrote to a friend"), "write", -4, { dur: 1.4 });
M.cayeron = at("had fallen down"); s(M.cayeron, "collapse", -2); s(M.cayeron + 0.2, "boom", -6); ch(M.cayeron, "2 SHOPS: COLLAPSED", "tr", R);
M.grietas = at("cracking"); s(M.grietas, "creak", 0); ch(M.grietas, "THE REST: CRACKING", "tr2", A, N);
M.ratones = at("even the mice"); [0, 0.25, 0.5, 0.8, 1.1, 1.4].forEach((d) => s(M.ratones + 0.5 + d, "squeak", -4)); bg(at("had moved out"), "EVEN THE MICE LEFT", { y: 860, col: "#fff3d6", size: 84, t1: ah("juvenal said that rome") });
M.juv6 = at("juvenal said that rome"); s(M.juv6, "slam", -6); ch(M.juv6, "JUVENAL AGAIN (x6)", "tl", V); M.puntales = at("thin props"); s(M.puntales, "creak", -2); ch(M.puntales, "ROME ON THIN PROPS", "tr", R);
M.parche = at("patch a crack"); s(M.parche, "write", -4, { dur: 1 }); ch(at("sleep peacefully"), "\"SLEEP WELL!\"", "tr2", L, N);
M.alquiler = at("what one year"); s(M.alquiler, "coin", -2); pl(M.alquiler, 200, -480, 1, 1.4);
M.balanza = at("an entire house"); s(M.balanza, "slam", -4); s(M.balanza + 1.6, "ding", -4);
M.tejas = at("sleep under the tiles"); fila([[at("fall down"), "derrumbe", "FALL DOWN"], [at("catch fire"), "llama", "CATCH FIRE"], [at("or both"), "craneo", "BOTH"]], 250, 1);
 
ch(at("before breakfast"), "BEFORE BREAKFAST", "tc", A, N);
M.eleccion2 = at("not a choice between danger"); pb(M.eleccion2, 1.2); s(M.eleccion2, "suspense", -6, { dur: 1.5 });
M.ollaFuera = at("the falling pot outside"); s(M.ollaFuera, "slam", -2); M.techoDentro = at("the falling ceiling inside"); s(M.techoDentro, "slam", -2); s(M.techoDentro + 0.4, "boom", -6);
// subida final: 5 pisos (espejo del gancho: allá la cámara caía 5 pisos con la olla)
M.puertaCasa = at("you finally reach your door"); s(M.puertaCasa, "door", -2); v(M.puertaCasa - 1.5, 90); v(M.puertaCasa + 0.2, 0); pl(M.puertaCasa, 120, -380, 1.1, 1);
M.sube = at("you climb five floors"); os(M.sube, 0.86); pl(M.sube + 0.3, 120, -1180, 1.12, 2.6); [0, 0.55, 1.1, 1.65, 2.2].forEach((d) => { s(M.sube + 0.3 + d, "creak", -8); s(M.sube + 0.3 + d, "tick", -2); });
M.colchon = at("lie down on your mattress"); s(M.colchon, "fall", -4); s(M.colchon + 0.4, "pigeon", -6, { dur: 1.6 }); s(M.colchon + 1.6, "snore", -8, { dur: 1.2 });
M.carroFin = at("the first wagon"); pl(M.carroFin - 0.3, 200, -420, 0.74, 2); s(M.carroFin, "rumble", -2, { dur: 3.5 }); s(M.carroFin + 0.5, "hoof", -6, { dur: 3 }); os(M.carroFin, 0.6);
M.bienvenido = at("welcome home"); bg(M.bienvenido, "WELCOME HOME.", { y: 200, col: "#fff3d6", size: 140, golpe: true, t1: ah("if you survived") }); s(M.bienvenido, "boom", -4);
M.cta = at("if you survived"); pl(M.cta, 200, -3600, 1, 1.8); s(M.cta, "whoosh_big", -2); os(M.cta, 0);
M.suscribe = at("subscribe"); s(M.suscribe, "pop", 0); M.campana = at("hit the bell"); s(M.campana, "ding", 0); s(M.campana + 0.3, "ding", -4);
M.proximo = at("victorian"); s(M.proximo, "whoosh", -2); s(M.proximo + 0.4, "metal", -4); s(M.proximo + 0.9, "metal", -6);
M.turnoLargo = at("a very long shift"); s(M.turnoLargo, "tick", -2);
M.comenta = at("tell me in the comments"); s(M.comenta, "pop", -1); M.cual = at("which one of these"); for (let i = 0; i < 7; i++) s(M.cual + 0.2 + i * 0.22, "pop", -2, { pitch: i });
M.fin = VOZ_FIN; s(VOZ_FIN - 0.2, "boom", -8);

// caminata y oscuridad, ordenadas
VEL.sort((a, b) => a[0] - b[0]); OSC.sort((a, b) => a[0] - b[0]); FUEGO.sort((a, b) => a[0] - b[0]); PLANOS.sort((a, b) => a[0] - b[0]);

// SFX automáticos de las piezas: chip = pop, texto grande = golpe, ícono = pop, contador = rodillo, título de trampa ya va a mano
B.forEach((b, i) => {
  if (b.k === "chip") s(b.t, "pop", -2, { pitch: ((i * 7) % 5) - 2 });
  if (b.k === "big") s(b.t, "slam", b.golpe ? 0 : -3);
  if (b.k === "ico") { if (b.tacha) s(b.tacha, "swish", -4); }
  if (b.k === "cuenta") s(b.t1, "ding", -4);
});
