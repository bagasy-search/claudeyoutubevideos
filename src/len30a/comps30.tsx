// len30a · componentes ÚNICOS del video (uno por hueco de b-roll, anclados a la palabra). Paleta de la miniatura: azulejo
// turquesa, porcelana blanca, bolsa negra, cinta verde. Lenguaje premium: panel oscuro, filo fino, entra con peso, sale fundido.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FONT, P, e } from "./lib";
import { HAND } from "./hkit";

export type H = { k: string; at: number; out: number; [x: string]: any };
const cl = (x: number) => Math.max(0, Math.min(1, x));
const eIn = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return c * c * c; };
export const phys = (t: number, a: number, w = 7, z = 0.45) => {
  const x = t - a; if (x <= 0) return 0;
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + (z * w / wd) * Math.sin(wd * x));
};
export const C = { bg0: "#071012", bg1: "#0d2226", tur: "#47c9bf", tur2: "#9fe7e0", tape: "#6fe05a", red: "#ff5a4a", amb: "#ffb257", ink: "#f6f3ec", dim: "rgba(246,243,236,.6)", line: "rgba(255,255,255,.12)", por: "#f4f6f5" };
const img = (id: string) => staticFile("img/" + P + id + ".jpg");

// ---------- escenario común: fondo azulejo oscuro con luz que respira; todo el componente entra/sale con peso ----------
export const Tiles: React.FC<{ t: number }> = ({ t }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="cg" cx="50%" cy="42%" r="75%"><stop offset="0" stopColor={C.bg1} /><stop offset="1" stopColor={C.bg0} /></radialGradient>
      <pattern id="tl" width="120" height="120" patternUnits="userSpaceOnUse"><rect width="120" height="120" fill="none" stroke="rgba(71,201,191,.06)" strokeWidth="2" /></pattern>
      <radialGradient id="lt" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="rgba(159,231,224,.10)" /><stop offset="1" stopColor="rgba(159,231,224,0)" /></radialGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#cg)" />
    <rect width="1920" height="1080" fill="url(#tl)" transform={`translate(${(t * 6) % 120 - 60} 0)`} />
    <ellipse cx={960 + Math.sin(t * 0.3) * 240} cy={420} rx={900} ry={520} fill="url(#lt)" />
  </svg>
);
const Stage: React.FC<{ t: number; h: H; children: (tt: number) => React.ReactNode }> = ({ t, h, children }) => {
  const tt = t - h.at, op = e(t, h.at, h.at + 0.3) * (1 - e(t, h.out - 0.35, h.out));
  if (op <= 0.001) return null;
  const z = 1.06 - 0.06 * phys(t, h.at, 5, 0.6) + 0.04 * eIn(t, h.out - 0.4, h.out);
  return <AbsoluteFill style={{ opacity: op }}>
    <Tiles t={t} />
    <AbsoluteFill style={{ transform: `scale(${z})`, filter: op < 0.95 ? `blur(${(1 - op) * 8}px)` : undefined }}>{children(tt)}</AbsoluteFill>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)" }} />
  </AbsoluteFill>;
};
const Kick: React.FC<{ tt: number; txt: string; col?: string; y?: number; x?: number; anchor?: "c" | "l" }> = ({ tt, txt, col = C.tur, y = 120, x = 960, anchor = "c" }) => {
  const p = phys(tt, 0.1, 7, 0.5);
  return <div style={{ position: "absolute", top: y, left: anchor === "c" ? 0 : x, width: anchor === "c" ? 1920 : undefined, textAlign: anchor === "c" ? "center" : "left", fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 8, color: C.dim, opacity: cl(p), transform: `translateY(${(1 - p) * 30}px)` }}>
    <span style={{ display: "inline-block", width: 44, height: 4, background: col, borderRadius: 2, verticalAlign: "middle", marginRight: 18 }} />{txt}
  </div>;
};
const Big: React.FC<{ tt: number; at: number; txt: string; y: number; size?: number; col?: string; x?: number; w?: number; anchor?: "c" | "l" }> = ({ tt, at, txt, y, size = 110, col = C.ink, x = 0, w = 1920, anchor = "c" }) => {
  const p = phys(tt, at, 6.5, 0.48);
  return <div style={{ position: "absolute", top: y, left: x, width: w, textAlign: anchor === "c" ? "center" : "left", fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.02, color: col, letterSpacing: -1,
    opacity: cl(p * 1.3), transform: `perspective(1200px) translateY(${(1 - p) * 60}px) rotateX(${(1 - p) * 30}deg)`, filter: p < 0.7 ? `blur(${(0.7 - p) * 10}px)` : undefined, textShadow: "0 10px 40px rgba(0,0,0,.6)" }}>{txt}</div>;
};
const Panel: React.FC<{ x: number; y: number; w: number; h: number; tt: number; at: number; children?: React.ReactNode; col?: string }> = ({ x, y, w, h, tt, at, children, col = C.line }) => {
  const p = phys(tt, at, 6, 0.5);
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 28, background: "linear-gradient(180deg, rgba(20,34,37,.92), rgba(9,17,19,.92))", border: `1.5px solid ${col}`,
    boxShadow: "0 40px 90px rgba(0,0,0,.6)", opacity: cl(p * 1.4), transform: `perspective(1400px) translateY(${(1 - p) * 70}px) rotateX(${(1 - p) * 18}deg) scale(${0.94 + 0.06 * p})`, fontFamily: FONT, color: C.ink, overflow: "hidden" }}>{children}</div>;
};
const Check: React.FC<{ p: number; col?: string; x?: boolean }> = ({ p, col = C.tape, x }) => (
  <svg width={56} height={56} viewBox="0 0 56 56"><circle cx={28} cy={28} r={24} fill="none" stroke={col} strokeWidth={4} opacity={0.35 + 0.65 * cl(p)} />
    {x ? <path d="M18 18 L38 38 M38 18 L18 38" stroke={col} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cl(p * 1.5 - 0.3)} />
      : <path d="M16 29 L25 38 L41 19" fill="none" stroke={col} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cl(p * 1.5 - 0.3)} />}
  </svg>
);
// filas que entran de a una (anclada cada una a su palabra)
const Rows: React.FC<{ tt: number; h: H; rows: { at: number; txt: string }[]; x: number; y: number; w: number; gap?: number; x_?: boolean; col?: string; size?: number; num?: boolean }> = ({ tt, h, rows, x, y, w, gap = 104, x_, col, size = 46, num }) => <>
  {rows.map((r, i) => { const a = Math.max(0.25 + i * 0.35, r.at - h.at); const p = phys(tt, a, 7, 0.5); return (
    <div key={i} style={{ position: "absolute", left: x, top: y + i * gap, width: w, display: "flex", alignItems: "center", gap: 26, opacity: cl(p * 1.5), transform: `translateX(${(1 - p) * -80}px)`, fontFamily: FONT, fontWeight: 800, fontSize: size, color: C.ink }}>
      {num ? <div style={{ width: 56, height: 56, borderRadius: 28, background: col ?? C.tur, color: C.bg0, fontWeight: 900, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{i + 1}</div> : <Check p={(tt - a) * 1.6} x={x_} col={col ?? (x_ ? C.red : C.tape)} />}
      <span style={{ textDecoration: x_ && tt - a > 0.7 ? "line-through" : undefined, textDecorationColor: C.red, textDecorationThickness: 5 }}>{r.txt}</span>
    </div>); })}
</>;

// ===================== cuadro 0: la miniatura (sin el texto) que cobra vida y empuja al gancho =====================
export const Thumb0: React.FC<{ t: number }> = ({ t }) => {
  // la miniatura ENCUADRADA sin el texto (el texto vive en la franja de arriba: el encuadre arranca debajo) → se acerca al inodoro y funde al gancho
  if (t > 1.25) return null;
  const z = 1.232 + 0.1 * e(t, 0, 1.2), op = 1 - e(t, 0.75, 1.2);
  return <AbsoluteFill style={{ opacity: op, overflow: "hidden", background: "#000" }}>
    <Img src={staticFile(P + "mini.png")} style={{ position: "absolute", width: 1920, height: 1080, objectFit: "cover", transformOrigin: "83.6% 100%", transform: `scale(${z})` }} />
    <AbsoluteFill style={{ background: `linear-gradient(115deg, rgba(255,255,255,0) ${30 + t * 60}%, rgba(255,255,255,.16) ${36 + t * 60}%, rgba(255,255,255,0) ${42 + t * 60}%)` }} />
  </AbsoluteFill>;
};

// ===================== componentes =====================
// 1 · el agua entra por un caño y se va por OTRO (corte de la casa)
const TwoPipes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const a1 = Math.max(0.6, h.inAt - h.at), a2 = Math.max(a1 + 1.4, h.outAt - h.at), f1 = cl((tt - a1) / 2), f2 = cl((tt - a2) / 2.2);
  return <>
    <Kick tt={tt} txt="DOES YOUR DRAIN STILL WORK?" />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d="M560 300 L1360 300 L1360 820 L560 820 Z" fill="rgba(255,255,255,.03)" stroke={C.line} strokeWidth={3} />
      <path d="M520 300 L960 140 L1400 300" fill="none" stroke={C.line} strokeWidth={3} />
      <line x1={120} y1={900} x2={1800} y2={900} stroke="rgba(255,255,255,.18)" strokeWidth={3} strokeDasharray="14 12" />
      {/* entra: caño fino de cobre */}
      <path d="M140 960 L700 960 L700 560 L900 560" fill="none" stroke="#c98b52" strokeWidth={14} strokeLinecap="round" opacity={0.35} />
      <path d="M140 960 L700 960 L700 560 L900 560" fill="none" stroke="#e7a466" strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - f1} />
      {/* sale: caño grueso de hierro */}
      <path d="M1080 600 L1180 600 L1180 980 L1800 980" fill="none" stroke="#3b4247" strokeWidth={46} strokeLinecap="round" />
      <path d="M1080 600 L1180 600 L1180 980 L1800 980" fill="none" stroke={C.tur} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - f2} opacity={0.9} />
      {/* inodoro esquemático */}
      <path d="M930 520 h140 v60 q0 70 -70 70 q-70 0 -70 -70z" fill={C.por} opacity={0.92} />
      <rect x={950} y={430} width={100} height={90} rx={10} fill={C.por} opacity={0.92} />
    </svg>
    <div style={{ position: "absolute", left: 150, top: 820, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "#e7a466", opacity: cl((tt - a1) * 2) }}>WATER COMES IN · thin supply pipe</div>
    <div style={{ position: "absolute", left: 1220, top: 1010 - 120, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.tur2, opacity: cl((tt - a2) * 2) }}>LEAVES · a different, big pipe</div>
  </>; }}</Stage>;

// 2 · capítulo (número grande + nombre)
const Chapter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const p = phys(tt, 0.15, 5.5, 0.5);
  return <>
    <div style={{ position: "absolute", left: 0, width: 1920, top: 210, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 380, color: "transparent", WebkitTextStroke: `4px ${C.tur}`, opacity: 0.55 * cl(p), transform: `scale(${0.8 + 0.2 * p})` }}>{h.n}</div>
    <Big tt={tt} at={0.4} txt={h.name} y={470} size={150} />
    <Big tt={tt} at={0.8} txt={h.sub} y={660} size={52} col={C.tur2} />
    <div style={{ position: "absolute", left: 960 - 260 * cl((tt - 0.6) * 1.5), width: 520 * cl((tt - 0.6) * 1.5), top: 640, height: 6, background: C.tape, borderRadius: 3 }} />
  </>; }}</Stage>;

// 3 · el sifón: el agua entra rápido, llena la curva y TIRA
const Siphon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const fa = Math.max(0.5, h.fastAt - h.at), pa = Math.max(fa + 2.5, h.pullAt - h.at);
  const pour = cl((tt - fa) / 1.2), fill = cl((tt - fa - 0.8) / 2.4), pull = cl((tt - pa) / 2.2);
  const lvl = 560 - 90 * fill + 160 * pull;
  return <>
    <Kick tt={tt} txt="IT'S NOT HOW MUCH. IT'S HOW FAST." col={C.amb} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <defs><clipPath id="bowl"><path d="M560 420 Q560 760 860 780 L980 780 Q1140 760 1140 420 Z" /></clipPath></defs>
      <path d="M560 420 Q560 760 860 780 L980 780 Q1140 760 1140 420" fill="rgba(255,255,255,.04)" stroke={C.por} strokeWidth={10} />
      <rect x={540} y={lvl} width={620} height={600} fill={C.tur} opacity={0.55} clipPath="url(#bowl)" />
      {/* la curva (trampa) */}
      <path d="M940 780 Q960 880 1080 880 Q1200 880 1200 760 Q1200 640 1320 640 Q1440 640 1440 780 L1440 960" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth={60} strokeLinecap="round" />
      <path d="M940 780 Q960 880 1080 880 Q1200 880 1200 760 Q1200 640 1320 640 Q1440 640 1440 780 L1440 960" fill="none" stroke={C.tur} strokeWidth={40} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(fill, 0.55) - 0.45 * pull} />
      {/* el balde que vuelca */}
      <g transform={`translate(${760 - 60 * pour} ${150}) rotate(${-70 * pour} 120 120)`}><path d="M40 40 L200 40 L180 230 L60 230 Z" fill="#dfe3e2" /><rect x={30} y={30} width={180} height={18} rx={6} fill="#c9cecd" /></g>
      {pour > 0.2 && pour < 1 && <path d={`M${720 - 40 * pour} 260 Q760 360 820 ${520 - 90 * fill}`} stroke={C.tur2} strokeWidth={34 * (1 - Math.abs(pour - 0.6))} fill="none" strokeLinecap="round" opacity={0.9} />}
      {pull > 0 && [0, 1, 2, 3, 4].map((i) => <circle key={i} cx={1440} cy={780 + ((tt * 260 + i * 60) % 200)} r={10} fill={C.tur2} opacity={pull} />)}
    </svg>
    <div style={{ position: "absolute", left: 1270, top: 520, fontFamily: HAND, fontWeight: 700, fontSize: 54, color: C.amb, opacity: cl((tt - pa) * 2) }}>…and it PULLS</div>
  </>; }}</Stage>;

// 4 · gorgoteo → el gran trago (onda de sonido + nivel que cae)
const Swallow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const g = Math.max(0.3, h.gAt - h.at), s = Math.max(g + 1.0, h.sAt - h.at);
  const amp = (x: number) => 30 * cl((tt - g) * 2) * (0.6 + 0.4 * Math.sin(x * 0.07 + tt * 9)) + 150 * cl((tt - s) * 1.5) * Math.exp(-Math.pow((x - 960 - (tt - s) * 400) / 220, 2));
  const pts = Array.from({ length: 97 }, (_, i) => { const x = 120 + i * 17.5; return `${x},${520 + amp(x) * Math.sin(x * 0.11 + tt * 14)}`; }).join(" ");
  return <>
    <Kick tt={tt} txt="LISTEN FOR IT" />
    <svg width={1920} height={1080} style={{ position: "absolute" }}><polyline points={pts} fill="none" stroke={C.tur} strokeWidth={6} strokeLinejoin="round" /></svg>
    <Big tt={tt} at={g} txt="gurgle…" y={260} size={90} col={C.tur2} />
    <Big tt={tt} at={s} txt="THE BIG SWALLOW" y={700} size={130} col={C.ink} />
  </>; }}</Stage>;

// 5 · balde tras balde ✗ vs un solo vuelco ✓
const OnePour: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => <>
  <Kick tt={tt} txt="IF IT DOESN'T GRAB" col={C.red} />
  <Panel x={220} y={250} w={680} h={600} tt={tt} at={0.2} col="rgba(255,90,74,.5)">
    <div style={{ padding: 50, fontWeight: 900, fontSize: 64, color: C.red }}>✗</div>
    <div style={{ padding: "0 50px", fontWeight: 900, fontSize: 58, lineHeight: 1.1 }}>Bucket after bucket into a full bowl</div>
    <div style={{ padding: "30px 50px", fontWeight: 700, fontSize: 36, color: C.dim }}>→ over the rim, on the floor</div>
  </Panel>
  <Panel x={1020} y={250} w={680} h={600} tt={tt} at={1.0} col="rgba(111,224,90,.5)">
    <div style={{ padding: 50, fontWeight: 900, fontSize: 64, color: C.tape }}>✓</div>
    <div style={{ padding: "0 50px", fontWeight: 900, fontSize: 58, lineHeight: 1.1 }}>Wait. Then one steady pour</div>
    <div style={{ padding: "30px 50px", fontWeight: 700, fontSize: 36, color: C.dim }}>from your waist, at the hole</div>
  </Panel>
</>}</Stage>;

// 6 · bolsa doble en corte: la de adentro sale, la de afuera queda
const DoubleBag: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const ia = Math.max(0.8, h.innerAt - h.at), up = e(tt, ia, ia + 1.6);
  return <>
    <Kick tt={tt} txt="TWO BAGS · ONE CHANGES" col={C.tape} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d="M620 380 Q620 820 960 840 Q1300 820 1300 380 Z" fill={C.por} />
      <path d="M650 390 Q650 790 960 805 Q1270 790 1270 390 Z" fill="#141617" />
      <rect x={600} y={360} width={720} height={40} rx={20} fill={C.tape} />
      <g transform={`translate(0 ${-260 * up})`} opacity={1 - 0.3 * up}>
        <path d="M690 400 Q690 760 960 772 Q1230 760 1230 400 Z" fill="#2a2d2f" stroke="#4a4f52" strokeWidth={4} />
      </g>
    </svg>
    <div style={{ position: "absolute", left: 1350, top: 400 - 260 * up, fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.ink, opacity: cl((tt - ia) * 2) }}>inside bag: lifts out</div>
    <div style={{ position: "absolute", left: 1350, top: 640, fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.tape, opacity: cl((tt - 0.6) * 2) }}>outside bag + tape: stays</div>
  </>; }}</Stage>;

// 7 · la bolsa en 5 pasos
const BagSteps: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => <>
  <Kick tt={tt} txt="THE BAG · 5 STEPS" col={C.tape} />
  <Rows tt={tt} h={h} num col={C.tape} x={440} y={250} w={1100} gap={130} size={52} rows={[
    { at: h.at + 0.4, txt: "Rags in a bag — plug the hole, tie it off" }, { at: h.at + 1.2, txt: "3-mil contractor bag in the bowl" },
    { at: h.at + 2.0, txt: "Double it" }, { at: h.at + 2.8, txt: "Painter's tape outside the rim" }, { at: h.at + 3.6, txt: "A handful of kitty litter" }]} />
</>}</Stage>;

// 8 · lo que NUNCA va al inodoro
const NeverFlush: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const ca = Math.max(4, h.canAt - h.at);
  return <>
    <Kick tt={tt} txt="NEVER IN THE TOILET · WATER OR NO WATER" col={C.red} />
    <Rows tt={tt} h={h} x_ x={300} y={250} w={900} gap={118} size={54} rows={h.rows.map((r: any, i: number) => ({ at: h.at + 0.3 + i * 0.45, txt: r.txt }))} />
    <Panel x={1260} y={330} w={420} h={430} tt={tt} at={ca}>
      <svg width={420} height={330}><rect x={130} y={110} width={160} height={190} rx={18} fill="#c9cecd" /><rect x={115} y={86} width={190} height={34} rx={12} fill="#e6e9e8" transform={`rotate(${-18 * cl((tt - ca) * 1.5)} 115 100)`} /></svg>
      <div style={{ textAlign: "center", fontWeight: 800, fontSize: 36 }}>a little can with a lid</div>
    </Panel>
  </>; }}</Stage>;

// 9 · 2014: la semana en el calendario
const Days: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const all = ["TUE", "WED", "THU", "FRI", "SAT"];
  const on = (d: string) => h.rows.find((r: any) => r.d === d);
  return <>
    <Kick tt={tt} txt="MY HOUSE · JANUARY 2014" />
    {all.map((d, i) => { const r = on(d); const a = r ? Math.max(0.3 + i * 0.2, r.at - h.at) : 0.3 + i * 0.2; const p = phys(tt, 0.2 + i * 0.12, 7, 0.5), hl = r ? cl((tt - a) * 2) : 0;
      return <div key={d} style={{ position: "absolute", left: 210 + i * 310, top: 300, width: 270, height: 420, borderRadius: 24, background: hl ? "rgba(71,201,191,.16)" : "rgba(255,255,255,.04)", border: `2px solid ${hl ? C.tur : C.line}`,
        opacity: cl(p * 1.4), transform: `translateY(${(1 - p) * 60}px)`, fontFamily: FONT, color: C.ink, textAlign: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 64, marginTop: 40, color: hl ? C.tur2 : C.dim }}>{d}</div>
        {r && <div style={{ fontWeight: 800, fontSize: 36, padding: "40px 22px", opacity: hl, transform: `translateY(${(1 - hl) * 20}px)` }}>{r.txt}</div>}
      </div>; })}
    {h.part === 2 && h.wb && <div style={{ position: "absolute", left: 210 + 4 * 310, top: 760, width: 270, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 48, color: C.tape, opacity: cl((tt - 6) * 1.5) }}>water back</div>}
  </>; }}</Stage>;

// 10 · ¿el vecino también? → la calle, esperá
const Neighbor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const a = Math.max(0.6, h.theirsAt - h.at);
  const House = ({ x, lit, lab }: { x: number; lit: number; lab: string }) => <g transform={`translate(${x} 0)`}><path d="M0 560 L170 420 L340 560 L340 800 L0 800 Z" fill="rgba(255,255,255,.05)" stroke={C.line} strokeWidth={3} />
    <rect x={130} y={640} width={80} height={160} fill={lit ? C.red : "rgba(255,255,255,.08)"} opacity={0.3 + 0.5 * lit} /><text x={170} y={870} textAnchor="middle" fill={C.dim} fontFamily={FONT} fontWeight={800} fontSize={34}>{lab}</text></g>;
  return <>
    <Kick tt={tt} txt="KNOCK ON THE NEIGHBOR'S DOOR" />
    <svg width={1920} height={1080} style={{ position: "absolute" }}><House x={480} lit={1} lab="YOU" /><House x={1100} lit={cl((tt - a) * 2)} lab="NEXT DOOR" />
      <line x1={300} y1={980} x2={1620} y2={980} stroke={C.red} strokeWidth={12} opacity={cl((tt - a - 1) * 2)} strokeLinecap="round" /></svg>
    <Big tt={tt} at={a + 1.2} txt="Off too? It's the street. Wait it out." y={240} size={70} col={C.ink} />
  </>; }}</Stage>;

// 11 · dónde se congela una casa de Chicago
const FreezeMap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const P0 = [[560, 520], [760, 840], [1240, 620]];
  return <>
    <Kick tt={tt} txt="WHERE IT FREEZES FIRST" col={C.tur2} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d="M460 420 L960 200 L1460 420 L1460 900 L460 900 Z" fill="rgba(255,255,255,.03)" stroke={C.line} strokeWidth={4} />
      <line x1={460} y1={760} x2={1460} y2={760} stroke={C.line} strokeWidth={3} />
      <path d="M300 940 L520 940 L520 520 L1300 520" fill="none" stroke="#e7a466" strokeWidth={10} opacity={0.6} />
      {h.pins.map((p: any, i: number) => { const a = Math.max(0.4 + i * 0.4, p.at - h.at), q = phys(tt, a, 8, 0.4); const [x, y] = P0[i];
        return <g key={i} opacity={cl(q * 1.5)}><circle cx={x} cy={y} r={20 + 40 * q + 6 * Math.sin(tt * 4)} fill="none" stroke={C.tur2} strokeWidth={4} opacity={0.6} /><circle cx={x} cy={y} r={14} fill={C.tur2} />
          <text x={x + 40} y={y - 30} fill={C.ink} fontFamily={FONT} fontWeight={800} fontSize={40}>❄ {p.txt}</text></g>; })}
    </svg>
  </>; }}</Stage>;

// 12 · la cuenta del domingo (ticket que se imprime)
const Bill: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const grow = cl(tt / 1.2);
  return <>
    <Kick tt={tt} txt="WHAT THAT SUNDAY COSTS" col={C.red} />
    <div style={{ position: "absolute", left: 660, top: 220, width: 600, height: (210 + h.rows.length * 82 + 70) * grow, overflow: "hidden", background: "#f3f0e7", borderRadius: "6px 6px 0 0", boxShadow: "0 40px 90px rgba(0,0,0,.6)", fontFamily: "Courier New, monospace", color: "#1d1d1d" }}>
      <div style={{ padding: "40px 46px 10px", fontWeight: 900, fontSize: 40, textAlign: "center" }}>PLUMBING · INVOICE</div>
      <div style={{ borderTop: "3px dashed #999", margin: "10px 40px" }} />
      {h.rows.map((r: any, i: number) => { const a = Math.max(0.5 + i * 0.4, r.at - h.at), o = cl((tt - a) * 2.5);
        return <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "20px 46px", fontSize: 34, fontWeight: 700, opacity: o }}><span>{r.item}</span><span>{r.v}</span></div>; })}
      <div style={{ padding: "10px 46px", fontSize: 30, fontWeight: 700, color: "#c0281c", opacity: cl((tt - (h.rows[2].at - h.at) - 0.6) * 2) }}>…just to walk in the door</div>
    </div>
  </>; }}</Stage>;

// 12b · si alquilás: avisale al dueño POR ESCRITO (un mensaje alcanza) y hacé lo mismo igual
const Renter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const ta = Math.max(0.6, h.textAt - h.at), na = Math.max(ta + 1.5, h.noDmgAt - h.at), typed = "Water's been off since 6 am. Please send someone.";
  const n = Math.round(typed.length * cl((tt - ta) / 1.6)), sent = cl((tt - ta - 1.8) * 3);
  return <>
    <Kick tt={tt} txt="IF YOU RENT" />
    <Panel x={300} y={210} w={560} h={760} tt={tt} at={0.2}>
      <div style={{ padding: "40px 40px 20px", fontSize: 30, fontWeight: 800, color: C.dim, borderBottom: `1px solid ${C.line}` }}>Landlord</div>
      <div style={{ position: "absolute", right: 30, top: 160, maxWidth: 420, padding: "22px 26px", borderRadius: 26, background: sent ? "#2f7cf6" : "rgba(255,255,255,.08)", fontSize: 34, fontWeight: 700, lineHeight: 1.25, opacity: cl((tt - ta) * 3), transform: `translateY(${(1 - sent) * 380}px)` }}>{typed.slice(0, n)}</div>
      <div style={{ position: "absolute", right: 34, top: 330, fontSize: 24, color: C.dim, opacity: sent }}>Delivered · 6:12 AM</div>
    </Panel>
    <Big tt={tt} at={ta + 0.4} txt="In writing." x={940} w={900} anchor="l" y={330} size={100} />
    <Big tt={tt} at={ta + 0.9} txt="A text is fine." x={940} w={900} anchor="l" y={450} size={60} col={C.tur2} />
    <Big tt={tt} at={na} txt="Bag + bucket: no damage." x={940} w={960} anchor="l" y={640} size={58} col={C.tape} />
  </>; }}</Stage>;

// 13 · la mayoría de esas llamadas NO son caños
const NotPipes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const a = Math.max(0.4, h.atTxt - h.at), f = Math.max(a + 1.5, h.fixAt - h.at);
  return <>
    {tt < a - 0.2 && <><Big tt={tt} at={0.2} txt="$600" y={250} size={240} col={C.red} /><Big tt={tt} at={0.6} txt="just to walk in the door" y={560} size={70} col={C.ink} /></>}
    {tt >= a - 0.2 && <><Kick tt={tt - a + 0.4} txt="MOST SUNDAY CALLS" />
    <Big tt={tt} at={a} txt="aren't pipes." y={300} size={150} col={C.ink} /></>}
    <Big tt={tt} at={a + 1.2} txt="The toilet that won't stop running." y={520} size={64} col={C.tur2} />
    <div style={{ position: "absolute", left: 0, width: 1920, top: 700, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 64, color: C.tape, opacity: cl((tt - f) * 2), transform: `rotate(-2deg) scale(${0.9 + 0.1 * phys(tt, f)})` }}>a 5-minute fix you can do yourself</div>
  </>; }}</Stage>;

// 14 · el agua vuelve: el orden
const STEPS5 = ["Pull the plug out of the toilet", "Run the bathtub till it's clear", "Open the toilet valve slowly", "Watch the float · flush the cap", "Old valve drips? ⅛ turn"];
const Comeback: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => <>
  <Kick tt={tt} txt="WHEN THE WATER COMES BACK · IN THIS ORDER" col={C.amb} />
  <Rows tt={tt} h={h} num col={C.amb} x={420} y={250} w={1200} gap={130} size={54} rows={STEPS5.map((s, i) => ({ at: h.at + 0.3 + i * 0.5, txt: s }))} />
</>}</Stage>;

// 15 · la bañera corre hasta que sale clara (marrón → claro)
const RunClear: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const c = cl((tt - Math.max(0.5, h.clearAt - h.at)) / 1.8);
  const col = `rgb(${Math.round(150 - 80 * c)},${Math.round(98 + 110 * c)},${Math.round(60 + 140 * c)})`;
  return <>
    <Kick tt={tt} txt="RUN THE TUB FIRST" />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d="M560 560 L1360 560 Q1360 820 1200 840 L720 840 Q560 820 560 560 Z" fill={C.por} />
      <rect x={900} y={300} width={60} height={160} rx={10} fill="#cfd4d3" /><path d="M900 300 h180 v50 h-120" fill="#cfd4d3" />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={1050} y={350 + ((tt * 600 + i * 70) % 210)} width={22} height={50} rx={11} fill={col} />)}
      <ellipse cx={960} cy={620} rx={360} ry={40} fill={col} opacity={0.85} />
    </svg>
    <Big tt={tt} at={0.4} txt={c > 0.5 ? "…until it runs clear" : "rust · grit · air"} y={880} size={70} col={c > 0.5 ? C.tur2 : C.amb} />
  </>; }}</Stage>;

// 16 · la tuerca del prensaestopas: ⅛ de vuelta
const NutDial: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const rot = -45 * e(tt, 3.2, 4.4);
  return <>
    <Kick tt={tt} txt="THE OLD OVAL-HANDLE VALVE" />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <circle cx={960} cy={560} r={300} fill="none" stroke={C.line} strokeWidth={3} />
      {Array.from({ length: 8 }, (_, i) => <line key={i} x1={960 + 300 * Math.cos(i * Math.PI / 4)} y1={560 + 300 * Math.sin(i * Math.PI / 4)} x2={960 + 270 * Math.cos(i * Math.PI / 4)} y2={560 + 270 * Math.sin(i * Math.PI / 4)} stroke={C.dim} strokeWidth={6} />)}
      <path d={`M960 560 L${960 + 300 * Math.cos(-Math.PI / 2)} ${560 + 300 * Math.sin(-Math.PI / 2)} A300 300 0 0 0 ${960 + 300 * Math.cos(-Math.PI / 2 - Math.PI / 4 * e(tt, 3.2, 4.4))} ${560 + 300 * Math.sin(-Math.PI / 2 - Math.PI / 4 * e(tt, 3.2, 4.4))} Z`} fill={C.amb} opacity={0.35} />
      <g transform={`rotate(${rot} 960 560)`}><polygon points={Array.from({ length: 6 }, (_, i) => `${960 + 150 * Math.cos(i * Math.PI / 3)},${560 + 150 * Math.sin(i * Math.PI / 3)}`).join(" ")} fill="#b8a46a" stroke="#e6d494" strokeWidth={6} />
        <circle cx={960} cy={560} r={60} fill="#7f7148" /></g>
    </svg>
    <Big tt={tt} at={3.4} txt="⅛ turn. Snug, not tight." y={890} size={76} col={C.amb} />
  </>; }}</Stage>;

// 17 · el aire en los caños: burbujas que empujan y la canilla escupe
const AirPipe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const b = Math.max(1, h.bangAt - h.at), shake = tt > b && tt < b + 0.5 ? Math.sin(tt * 90) * 10 * (1 - (tt - b) / 0.5) : 0;
  return <>
    <Kick tt={tt} txt="5 · THE AIR" col={C.tur2} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}><g transform={`translate(${shake} 0)`}>
      <rect x={200} y={520} width={1400} height={70} rx={35} fill="rgba(255,255,255,.08)" stroke={C.line} strokeWidth={3} />
      <rect x={200} y={528} width={1400} height={54} rx={27} fill={C.tur} opacity={0.45} />
      {Array.from({ length: 9 }, (_, i) => { const x = 200 + ((tt * 260 + i * 160) % 1400); return <ellipse key={i} cx={x} cy={555} rx={40 + 10 * Math.sin(i)} ry={18} fill="rgba(255,255,255,.75)" />; })}
      <path d="M1600 520 h90 v170" fill="none" stroke="#cfd4d3" strokeWidth={46} strokeLinecap="round" />
      {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={1690 + Math.sin(tt * 30 + i) * 14} cy={720 + ((tt * 500 + i * 40) % 260)} r={10 + (i % 3) * 5} fill={i % 2 ? C.tur2 : "rgba(255,255,255,.8)"} />)}
    </g></svg>
    <Big tt={tt} at={b} txt="BANG" y={260} size={160} col={C.amb} />
    <Big tt={tt} at={b + 1.5} txt="open every faucet · let it spit" y={760} size={60} col={C.ink} />
  </>; }}</Stage>;

// 18 · preguntas de los comentarios (tarjeta de comentario)
const QA: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => <>
  <Kick tt={tt} txt="YOU ASKED" />
  <Panel x={360} y={330} w={1200} h={330} tt={tt} at={0.2}>
    <div style={{ display: "flex", gap: 30, padding: 50 }}>
      <div style={{ width: 90, height: 90, borderRadius: 45, background: C.tur, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, fontWeight: 900, color: C.bg0 }}>?</div>
      <div><div style={{ fontSize: 30, fontWeight: 700, color: C.dim }}>{h.who}</div><div style={{ fontSize: 62, fontWeight: 900, lineHeight: 1.12, marginTop: 10 }}>{h.q}</div></div>
    </div>
  </Panel>
</>}</Stage>;

// 19 · el estante del sótano (cada cosa se apoya en el estante)
const Shelf: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => <>
  <Kick tt={tt} txt="THE SHELF BY MY BASEMENT STAIRS" col={C.tape} />
  <div style={{ position: "absolute", left: 260, top: 860, width: 1400, height: 30, borderRadius: 6, background: "linear-gradient(#6b5136,#3d2c1c)", boxShadow: "0 20px 40px rgba(0,0,0,.6)" }} />
  <Rows tt={tt} h={h} col={C.tape} x={360} y={220} w={1200} gap={112} size={50} rows={h.rows.map((r: any, i: number) => ({ at: h.at + 0.3 + i * 0.5, txt: r.txt }))} />
  <div style={{ position: "absolute", right: 260, top: 900, fontFamily: HAND, fontWeight: 700, fontSize: 56, color: C.amb, opacity: cl((tt - 3) * 2) }}>≈ $25, all of it</div>
</>}</Stage>;

// 20 · un comentario de verdad (el más votado del molde): la cinta llega tarde
const Comment: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => <>
  <Panel x={300} y={300} w={1320} h={380} tt={tt} at={0.15}>
    <div style={{ padding: "54px 60px 0", fontSize: 30, fontWeight: 700, color: C.dim }}>💬 somebody wrote to me</div>
    <div style={{ padding: "18px 60px", fontSize: 66, fontWeight: 900, lineHeight: 1.12 }}>“{h.q}”</div>
  </Panel>
  <div style={{ position: "absolute", left: 0, width: 1920, top: 760, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 70, color: C.tape, opacity: cl((tt - 3.2) * 2), transform: `rotate(-2deg)` }}>He's right. Have it ready.</div>
</>}</Stage>;

// 3b · la regla de la casa de su madre: tres usos, un balde
const Mellow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const ra = Math.max(0.3, h.ruleAt - h.at), ca = Math.max(ra + 1.5, h.countAt - h.at), ba = Math.max(ca + 1.2, h.bucketAt - h.at), la = Math.max(ba + 1, h.lidAt - h.at);
  return <>
    <Kick tt={tt} txt="THE OLD RULE · MY MOTHER'S HOUSE" col={C.amb} />
    <div style={{ position: "absolute", top: 220, width: 1920, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 104, color: C.ink, opacity: cl((tt - ra) * 2), transform: `rotate(-1.5deg) scale(${0.92 + 0.08 * cl((tt - ra) * 2)})` }}>“If it's yellow, let it mellow.”</div>
    {[0, 1, 2].map((i) => { const p = phys(tt, ca + i * 0.35, 8, 0.45);
      return <div key={i} style={{ position: "absolute", left: 470 + i * 200, top: 560, width: 150, height: 150, borderRadius: 75, border: `3px solid ${C.amb}`, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: FONT, fontWeight: 900, fontSize: 76, color: C.amb, opacity: cl(p * 1.5), transform: `scale(${0.6 + 0.4 * cl(p)})` }}>{i + 1}</div>; })}
    <div style={{ position: "absolute", left: 1080, top: 590, fontFamily: FONT, fontWeight: 900, fontSize: 80, color: C.dim, opacity: cl((tt - ba + 0.3) * 3) }}>→</div>
    {(() => { const p = phys(tt, ba, 7, 0.45); return <div style={{ position: "absolute", left: 1170, top: 545, width: 360, height: 180, borderRadius: 26, border: `3px solid ${C.tur}`, background: "rgba(71,201,191,.08)",
      fontFamily: FONT, textAlign: "center", color: C.tur, opacity: cl(p * 1.5), transform: `translateY(${(1 - cl(p)) * 40}px)` }}>
      <div style={{ fontWeight: 900, fontSize: 64, marginTop: 30 }}>1 bucket</div><div style={{ fontWeight: 700, fontSize: 30, color: C.ink }}>one good pour</div></div>; })()}
    <div style={{ position: "absolute", top: 860, width: 1920, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.ink, opacity: cl((tt - la) * 2.5) }}>Lid down · fine for a day</div>
  </>; }}</Stage>;

// 20b · la noche es sólo el medio: casi todo lo que sale mal pasa ANTES y DESPUÉS (y eso está escrito)
const NightLine: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const ca = Math.max(0.2, h.coldAt - h.at), na = Math.max(ca + 1.2, h.nightAt - h.at), ba = Math.max(na + 1.2, h.baAt - h.at), da = Math.max(ba + 1.2, h.downAt - h.at);
  const B = [{ x: 180, w: 520, t: "BEFORE", s: "frozen pipe · the valve · the shutoff", a: ba, col: C.amb }, { x: 735, w: 450, t: "THE NIGHT", s: "bag + bucket", a: na, col: C.tape }, { x: 1220, w: 520, t: "AFTER", s: "fill valve · grit · air · the bill", a: ba + 0.35, col: C.amb }];
  return <>
    {tt < na - 0.2 && <><Big tt={tt} at={ca} txt="−4°F" y={260} size={220} col={C.tur2} /><Big tt={tt} at={ca + 0.6} txt="not standing in the hardware store line" y={560} size={58} /></>}
    {tt >= na - 0.2 && <>
      <svg width={1920} height={1080} style={{ position: "absolute" }}><line x1={180} y1={620} x2={180 + 1560 * cl((tt - na + 0.2) / 0.8)} y2={620} stroke={C.line} strokeWidth={6} strokeLinecap="round" /></svg>
      {B.map((b, i) => { const on = cl((tt - b.a) * 2.5), p = phys(tt, i === 1 ? na : b.a - 0.2, 7, 0.5);
        return <div key={i} style={{ position: "absolute", left: b.x, top: 420, width: b.w, height: 400, borderRadius: 26, border: `2px solid ${on ? b.col : C.line}`, background: on ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.02)",
          opacity: 0.25 + 0.75 * cl(p * 1.4), transform: `translateY(${(1 - cl(p)) * 50}px) scale(${1 + 0.04 * on})`, fontFamily: FONT, textAlign: "center", color: C.ink }}>
          <div style={{ fontWeight: 900, fontSize: 64, marginTop: 70, color: on ? b.col : C.dim }}>{b.t}</div>
          <div style={{ fontWeight: 700, fontSize: 34, marginTop: 30, padding: "0 30px", opacity: on }}>{b.s}</div>
        </div>; })}
      <Big tt={tt} at={ba + 0.6} txt="Most of what goes wrong is before and after." y={220} size={60} />
      <div style={{ position: "absolute", left: 0, width: 1920, top: 880, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 64, color: C.amb, opacity: cl((tt - da) * 2), transform: "rotate(-2deg)" }}>…and that part I wrote down</div>
    </>}
  </>; }}</Stage>;

// 21 · la colección: 5 tapas reales en abanico
const COVERS = ["cov_ln_toilet", "cov_ln_drain", "cov_ln_leak", "cov_ln_shower", "cov_ln_call"];
const Books: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const a = Math.max(0.3, h.setAt - h.at);
  return <>
    <Kick tt={tt} txt="I WROTE IT DOWN" col={C.amb} />
    <div style={{ position: "absolute", inset: 0, perspective: 1800 }}>
      {COVERS.map((c, i) => { const p = phys(tt, a + i * 0.18, 6, 0.5), k = i - 2;
        return <Img key={c} src={img(c)} style={{ position: "absolute", left: 960 - 170 + k * 250 * p, top: 250 + Math.abs(k) * 26 * p, width: 340, height: 440, objectFit: "cover", borderRadius: 8,
          boxShadow: "0 40px 70px rgba(0,0,0,.7)", opacity: cl(p * 1.5), transform: `rotateY(${-k * 14 * p}deg) rotateZ(${k * 3 * p}deg) translateZ(${-Math.abs(k) * 60}px)` }} />; })}
    </div>
    <Big tt={tt} at={a + 1.4} txt="THE $10 PLUMBER" y={760} size={96} col={C.amb} />
    <Big tt={tt} at={a + 2.2} txt="5 books · 200 fixes · every one under $10 in parts" y={880} size={44} col={C.ink} />
  </>; }}</Stage>;

// 22 · páginas reales del libro: cada una entra cuando la nombro
const Pages: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const n = h.imgs.length, W0 = n === 3 ? 470 : 560, gap = n === 3 ? 60 : 110, x0 = 960 - (n * W0 + (n - 1) * gap) / 2;
  return <>{h.imgs.map((id: string, i: number) => { const a = Math.max(0.2 + i * 0.6, h.tAt[i] - h.at), p = phys(tt, a, 6, 0.5);
    return <div key={id} style={{ position: "absolute", left: x0 + i * (W0 + gap), top: 120, width: W0, opacity: cl(p * 1.5), transform: `perspective(1600px) translateY(${(1 - p) * 120}px) rotateX(${(1 - p) * 30}deg) rotateZ(${(i - (n - 1) / 2) * 1.5}deg)` }}>
      <Img src={img(id)} style={{ width: W0, height: W0 * 1.294, objectFit: "cover", borderRadius: 6, boxShadow: "0 40px 80px rgba(0,0,0,.7)" }} />
      <div style={{ marginTop: 26, fontFamily: FONT, fontWeight: 800, fontSize: n === 3 ? 30 : 34, color: C.ink, textAlign: "center", lineHeight: 1.15 }}>{h.tags[i]}</div>
    </div>; })}</>; }}</Stage>;

// 23 · repaso en 5 tramos (cada tramo = lo que dice en ese tramo), filas que se tildan
const REC: Record<number, { k: string; col: string; rows: string[] }> = {
  2: { k: "WATER OFF · DRAIN WORKS", col: C.tape, rows: ["Close the toilet valve, clockwise, gently", "Fill the tub if you see it coming", "1½ gallons, from your waist, one pour", "Never boiling water"] },
  3: { k: "DRAIN BLOCKED · THE BAG", col: C.tape, rows: ["Scoop the bowl dry", "Rags in a bag, tied to the holder", "Contractor bag, doubled", "Painter's tape outside the rim"] },
  4: { k: "WATER BACK · IN THIS ORDER", col: C.amb, rows: ["Two bags · lidded can outside", "Pull the plug out first", "Run the tub till it's clear", "Open the valve slow, ¼ at a time"] },
  5: { k: "WATER BACK · IN THIS ORDER", col: C.amb, rows: ["Watch the float · flush the grit out", "Old valve drips? ⅛ turn on the nut", "Open every faucet · let the air out"] },
};
const Recap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  if (h.part === 1) return <><Kick tt={tt} txt="BEFORE YOU GO" col={C.tape} /><Big tt={tt} at={0.3} txt="ONE MORE TIME," y={360} size={130} /><Big tt={tt} at={0.8} txt="FAST." y={520} size={170} col={C.tape} /></>;
  const r = REC[h.part]; const n = r.rows.length, step = Math.min(2.4, (h.out - h.at - 1.5) / n);
  return <><Kick tt={tt} txt={"THE WHOLE THING · " + r.k} col={r.col} />
    <Rows tt={tt} h={h} col={r.col} x={400} y={260} w={1200} gap={140} size={56} rows={r.rows.map((x, i) => ({ at: h.at + 0.3 + i * step, txt: x }))} /></>; }}</Stage>;

// 24 · el domingo de $400, tachado
const Sunday: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const s = Math.max(1.2, h.strikeAt - h.at), k = e(tt, s, s + 0.6);
  return <>
    <Big tt={tt} at={0.2} txt="$400" y={300} size={280} col={C.red} />
    <Big tt={tt} at={0.5} txt="SUNDAY" y={590} size={100} col={C.ink} />
    {k > 0.01 && <svg width={1920} height={1080} style={{ position: "absolute" }}><line x1={620} y1={560} x2={620 + 680 * k} y2={380} stroke={C.tape} strokeWidth={26} strokeLinecap="round" /></svg>}
    <div style={{ position: "absolute", left: 0, width: 1920, top: 780, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 64, color: C.tape, opacity: cl((tt - s - 0.3) * 2) }}>a bag, a roll of tape, a bucket</div>
  </>; }}</Stage>;

// 25 · la pregunta para los comentarios
const Ask: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => <>
  <Kick tt={tt} txt="TELL ME IN THE COMMENTS" col={C.tur} />
  {h.q.map((l: string, i: number) => <Big key={i} tt={tt} at={0.3 + i * 0.35} txt={l} y={320 + i * 140} size={i === 1 ? 70 : 90} col={i === 2 ? C.tur2 : C.ink} />)}
</>}</Stage>;

export const HC: Record<string, React.FC<{ t: number; h: H }>> = {
  twopipes: TwoPipes, chapter: Chapter, mellow: Mellow, siphon: Siphon, swallow: Swallow, onepour: OnePour, doublebag: DoubleBag, bagsteps: BagSteps, neverflush: NeverFlush,
  days: Days, neighbor: Neighbor, freezemap: FreezeMap, bill: Bill, renter: Renter, notpipes: NotPipes, comeback: Comeback, runclear: RunClear, nutdial: NutDial, airpipe: AirPipe,
  qa: QA, shelf: Shelf, comment: Comment, nightline: NightLine, books: Books, pages: Pages, recap: Recap, sunday: Sunday, ask: Ask,
};
