import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, spring, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Fredoka";
import { at, rnd, clamp } from "../soot/lib";
import { CamaraMano } from "../kits/camara/CamaraMano";
import SHOTS from "./shots.json";

// Soot and Sandals v2 (25-oct): estilo vector plano saturado (vara del creador = el short de los zombies).
// Una ilustración por plano (~3,7 s), Ken Burns sorteado por plano, chapitas, títulos de trampa y la grilla
// de 100 reclutas que se van perdiendo trampa a trampa (la mitad nunca cobra el retiro).
const { fontFamily } = loadFont("normal", { weights: ["600", "700"] });
export const FPS = 30;
export const VOZ = 940.55;
export const DUR = Math.ceil((VOZ + 0.55) * FPS);

const VIOLETA = "#5b2bb5", TEAL = "#2ec4d6", LIMA = "#9be15d", ROJO = "#e8344a", AMBAR = "#ffb020", NOCHE = "#1b1240";

// ── plano: ilustración a pantalla completa con Ken Burns (sentido, amplitud y foco sorteados por plano)
const Plano: React.FC<{ n: string; t0: number; t1: number; t: number }> = ({ n, t0, t1, t }) => {
  const r = rnd(Math.round(t0 * 1000) + 7);
  const dur = Math.max(1, t1 - t0);
  const vel = 0.018 + r() * 0.022; // 1,8-4 %/s
  const amp = Math.min(0.2, vel * dur);
  const zoomIn = r() < 0.5;
  const ox = 35 + r() * 30, oy = 35 + r() * 30;
  const ang = r() * Math.PI * 2;
  const u = interpolate(t, [t0, t1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const k = zoomIn ? u : 1 - u;
  const z = 1.06 + amp * k;
  const tx = Math.cos(ang) * 2 * k, ty = Math.sin(ang) * 1.2 * k;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: NOCHE }}>
      <Img src={staticFile(`soot2/${n}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: `${ox}% ${oy}%`, transform: `translate(${tx}%, ${ty}%) scale(${z})` }} />
    </AbsoluteFill>
  );
};

// ── chapita (como "CORNELL · 2015" de la referencia): entra con resorte, se va encogiendo
const Chip: React.FC<{ t: number; t0: number; t1: number; text: string; color?: string; x: number; y: number; size?: number }> = ({ t, t0, t1, text, color = VIOLETA, x, y, size = 66 }) => {
  if (t < t0 || t > t1 + 0.3) return null;
  const f = Math.round((t - t0) * FPS);
  const s = spring({ frame: f, fps: FPS, config: { damping: 11, stiffness: 170 } });
  const out = interpolate(t, [t1, t1 + 0.3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `scale(${s * out})`, transformOrigin: "left center", fontFamily, fontWeight: 700, fontSize: size, color: "#fff", background: color, padding: `${size * 0.18}px ${size * 0.45}px`, borderRadius: size * 0.3, boxShadow: "0 8px 0 rgba(20,10,50,.35)", letterSpacing: 1, whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

// ── la grilla de 100 reclutas: vivos en teal, perdidos en gris (se apagan uno por uno)
const Figura: React.FC<{ c: string }> = ({ c }) => (
  <svg width={26} height={34} viewBox="0 0 26 34"><circle cx={13} cy={7} r={6} fill={c} /><rect x={4} y={15} width={18} height={18} rx={8} fill={c} /></svg>
);
const Grilla: React.FC<{ t: number; t0: number; t1: number; de: number; a: number; x?: number; y?: number }> = ({ t, t0, t1, de, a, x = 1180, y = 150 }) => {
  if (t < t0 || t > t1 + 0.35) return null;
  const s = spring({ frame: Math.round((t - t0) * FPS), fps: FPS, config: { damping: 13, stiffness: 160 } });
  const out = interpolate(t, [t1, t1 + 0.35], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const muertos = Math.round(interpolate(t, [t0 + 0.5, Math.min(t1 - 0.3, t0 + 2.2)], [de, a], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const orden = React.useMemo(() => { const r = rnd(99); return Array.from({ length: 100 }, (_, i) => i).sort(() => r() - 0.5); }, []);
  const muerto = new Set(orden.slice(0, muertos));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `scale(${s * out})`, transformOrigin: "center top", background: "rgba(27,18,64,.88)", borderRadius: 28, padding: "22px 24px 18px", boxShadow: "0 12px 0 rgba(10,5,30,.4)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(20, 26px)", gap: "6px 4px" }}>
        {Array.from({ length: 100 }, (_, i) => <Figura key={i} c={muerto.has(i) ? "#5d5a7a" : TEAL} />)}
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 14, fontFamily, fontWeight: 700, fontSize: 30 }}>
        <span style={{ background: TEAL, color: NOCHE, padding: "4px 16px", borderRadius: 10 }}>ALIVE {100 - muertos}</span>
        <span style={{ background: "#5d5a7a", color: "#fff", padding: "4px 16px", borderRadius: 10 }}>LOST {muertos}</span>
      </div>
    </div>
  );
};

// ── título de trampa: número chico + nombre grande, al centro arriba
const Trampa: React.FC<{ t: number; t0: number; n: number; nombre: string }> = ({ t, t0, n, nombre }) => {
  const t1 = t0 + 2.6;
  if (t < t0 || t > t1 + 0.3) return null;
  const f = Math.round((t - t0) * FPS);
  const a = spring({ frame: f, fps: FPS, config: { damping: 10, stiffness: 180 } });
  const b = spring({ frame: f - 5, fps: FPS, config: { damping: 10, stiffness: 160 } });
  const out = interpolate(t, [t1, t1 + 0.3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 110, top: 120, fontFamily, fontWeight: 700, opacity: out }}>
      <div style={{ display: "inline-block", transform: `scale(${a})`, transformOrigin: "left center", background: ROJO, color: "#fff", fontSize: 58, padding: "6px 22px", borderRadius: 14, boxShadow: "0 6px 0 rgba(20,10,50,.35)" }}>TRAP {n} OF 7</div>
      <div style={{ transform: `scale(${b})`, transformOrigin: "left center", marginTop: 14, color: "#fff", fontSize: 150, lineHeight: 1, textShadow: "0 8px 0 rgba(27,18,64,.8), 0 0 2px #1b1240", WebkitTextStroke: "3px #1b1240" }}>{nombre}</div>
    </div>
  );
};

type C = { f: string; text: string; color?: string; x?: number; y?: number; d?: number; desde?: number };
// chapitas: aparecen con la palabra exacta que las nombra
const CHIPS: C[] = [
  { f: "25 years of service", text: "25 YEARS", color: ROJO },
  { f: "no wife", text: "NO WIFE", color: VIOLETA, x: 120, y: 230 },
  { f: "roughly half", text: "≈ 1 IN 2 NEVER COLLECTED", color: ROJO },
  { f: "the year 110", text: "YEAR 110 AD", color: VIOLETA },
  { f: "18 years old", text: "AGE 18", color: TEAL },
  { f: "Gaul or Spain", text: "GAUL · SPAIN", color: VIOLETA, x: 120, y: 230 },
  { f: "Vigetius", text: "VEGETIUS · 4TH CENTURY", color: VIOLETA },
  { f: "the sacramentum", text: "SACRAMENTUM", color: AMBAR },
  { f: "not legally allowed to marry", text: "NO MARRIAGE · 25 YEARS", color: ROJO },
  { f: "Emperor Domitian", text: "DOMITIAN · 81–96 AD", color: VIOLETA },
  { f: "300 silver denarii", text: "300 DENARII / YEAR", color: AMBAR },
  { f: "Roman fort in Egypt", text: "PAY RECORD · EGYPT", color: VIOLETA },
  { f: "burial club", text: "− BURIAL CLUB", color: ROJO, x: 120, y: 230 },
  { f: "a tyro", text: "TYRO = RECRUIT", color: TEAL },
  { f: "twice as much", text: "× 2 WEIGHT", color: ROJO },
  { f: "the pilum", text: "PILUM", color: VIOLETA },
  { f: "20 Roman miles in", text: "20 MILES · 5 HOURS", color: AMBAR },
  { f: "35 kilometers before lunch", text: "≈ 35 KM BEFORE LUNCH", color: ROJO },
  { f: "wheat to barley", text: "WHEAT → BARLEY", color: AMBAR },
  { f: "Josephus watched", text: "JOSEPHUS · 1ST CENTURY", color: VIOLETA },
  { f: "about 9 kilos", text: "ARMOR ≈ 9 KG", color: VIOLETA },
  { f: "easily 30 kilos", text: "30+ KG", color: ROJO },
  { f: "Marius's mules", text: "\"MARIUS'S MULES\"", color: AMBAR },
  { f: "in July", text: "JULY · SYRIA", color: ROJO },
  { f: "seven other men and one mule", text: "8 MEN + 1 MULE", color: VIOLETA },
  { f: "73 miles of stone", text: "HADRIAN'S WALL · 73 MILES", color: VIOLETA },
  { f: "He commands 80 soldiers", text: "80 SOLDIERS", color: VIOLETA },
  { f: "Tacitus tells us", text: "TACITUS · ANNALS I", color: VIOLETA },
  { f: "Cito alterum", text: "\"CEDO ALTERAM!\"", color: ROJO },
  { f: "the Fustuarium", text: "FUSTUARIUM", color: ROJO },
  { f: "decimation", text: "DECIMATION · 1 IN 10", color: ROJO },
  { f: "71 before christ", text: "71 BC · CRASSUS", color: VIOLETA },
  { f: "to the dung", text: "\"TO THE DUNG\"", color: AMBAR },
  { f: "men called immunes", text: "IMMUNES", color: TEAL },
  { f: "At Vindolanda", text: "VINDOLANDA · BRITAIN", color: VIOLETA },
  { f: "two pairs of underpants", text: "SOCKS · SANDALS · UNDERPANTS", color: TEAL },
  { f: "You are 26", text: "AGE 26", color: TEAL },
  { f: "from the town where you were born", text: "2,000 KM FROM HOME", color: VIOLETA },
  { f: "it was a fever", text: "#1 KILLER: DISEASE", color: ROJO },
  { f: "the year 165", text: "165 AD", color: VIOLETA },
  { f: "Antonine Plague", text: "ANTONINE PLAGUE", color: ROJO },
  { f: "the medici", text: "MEDICI", color: TEAL },
  { f: "a drink called", text: "POSCA = SOUR WINE + WATER", color: AMBAR, d: 5 },
  { f: "the gladius", text: "GLADIUS", color: VIOLETA },
  { f: "In 216 before Christ", text: "216 BC · CANNAE", color: VIOLETA },
  { f: "By the ancient accounts", text: "≈ 50,000 DEAD", color: ROJO },
  { f: "In the year 9", text: "9 AD · TEUTOBURG", color: VIOLETA },
  { f: "The 17th, 18th, and 19th", text: "XVII · XVIII · XIX", color: ROJO },
  { f: "Somewhere between", text: "15,000–20,000 MEN", color: ROJO },
  { f: "Six years later", text: "15 AD", color: VIOLETA },
  { f: "years are over", text: "AGE 43", color: TEAL },
  { f: "Under Augustus", text: "3,000 DENARII", color: AMBAR },
  { f: "more than 10 years of pay", text: "> 10 YEARS OF PAY", color: AMBAR, x: 120, y: 230 },
  { f: "the year 14", text: "14 AD · MUTINY", color: VIOLETA },
  { f: "for 30, even 40 years", text: "30–40 YEARS", color: ROJO },
  { f: "Cologne, York, Vienna", text: "COLOGNE · YORK · VIENNA", color: TEAL, d: 4.5 },
];

const TRAMPAS: [string, number, string][] = [
  ["Trap number one", 1, "THE CONTRACT"],
  ["Trap number two", 2, "THE TRAINING"],
  ["Trap number three", 3, "THE MARCH"],
  ["Trap number four", 4, "THE CENTURION"],
  ["Trap number five", 5, "THE CAMP"],
  ["Trap number six", 6, "THE BATTLE"],
  ["Trap number seven", 7, "THE RETIREMENT"],
];
// reclutas perdidos al ENTRAR a cada trampa (acumulado): la mitad nunca llega
const PERDIDOS = [0, 2, 6, 11, 16, 33, 45];

export const Soot2: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const sh = SHOTS as { t: number; n: string }[];
  let i = 0;
  while (i + 1 < sh.length && sh[i + 1].t <= t) i++;
  const p = sh[i], t1 = i + 1 < sh.length ? sh[i + 1].t : VOZ + 0.55;
  const tr = TRAMPAS.map(([f, n, nom], k) => ({ t0: at(f) - 0.08, n, nom, de: k ? PERDIDOS[k - 1] : 0, a: PERDIDOS[k] }));
  const half = at("roughly half"), fin = at("roughly half", 870);
  return (
    <AbsoluteFill style={{ backgroundColor: NOCHE }}>
      <CamaraMano intensidad={0.8}>
        <Plano n={p.n} t0={p.t} t1={t1} t={t} />
      </CamaraMano>
      {CHIPS.map((c, k) => {
        const t0 = at(c.f, c.desde || 0);
        return <Chip key={k} t={t} t0={t0} t1={t0 + (c.d || 3)} text={c.text} color={c.color} x={c.x ?? 110} y={c.y ?? 110} />;
      })}
      {tr.map((x) => <Trampa key={x.n} t={t} t0={x.t0} n={x.n} nombre={x.nom} />)}
      {tr.map((x) => x.n > 1 && <Grilla key={"g" + x.n} t={t} t0={x.t0 + 0.4} t1={x.t0 + 3.6} de={x.de} a={x.a} />)}
      <Grilla t={t} t0={half} t1={half + 5.4} de={0} a={50} />
      <Grilla t={t} t0={fin} t1={fin + 8} de={45} a={50} />
    </AbsoluteFill>
  );
};
