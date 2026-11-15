// gary14a · «Power Station or Generator?» — componentes propios, PURO CSS/DOM (sin SVG, sin blur grande, sin grano ni viñeta).
// Mundo: la pelea de 10 rounds en el taller de Gary (roble, concreto de garaje, acero cepillado, papel, cinta). Registro: D:/rtmp/gary14_COMPONENTES.md
// m = cuadros (relativos al plano) en que se dice cada palabra ancla; dur = cuadros del plano.
// r2 (EVALUADOR ronda 1): actores con material real (generador con bastidor/tapa/arranque, bidón con asas y pico, radiador de aceite,
// caldera con persiana, casa+medidor+poste con liniero, usina con chimenea, balde galvanizado, toma de 12 V, campanilla, turnero),
// fondos de concreto/roble/acero en vez de grises planos, textos que nunca se salen de su caja.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "./Piezas";

const { SERIF, SANS, HAND } = FONTS;
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cl = (v: number) => Math.max(0, Math.min(1, v));
const ou = (t: number) => Easing.out(Easing.cubic)(cl(t));
const io = (t: number) => Easing.inOut(Easing.cubic)(cl(t));
const k = (f: number, a: number, len = 12) => ou((f - a) / len);
const sp = (f: number, a: number) => { const x = Math.max(0, (f - a) / 30) * 9; return x <= 0 ? 0 : 1 - Math.exp(-x) * Math.cos(x * 1.7); };
const M = (m: number[], i: number, d: number) => (m[i] ?? d);
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
type P = { dur: number; m: number[]; a: string[] };
type CSS = React.CSSProperties;

const OAK = "#8a5a33", OAK2 = "#6e4526", STEEL = "#9aa3ab", STEEL2 = "#5d666e", ST = "#2f7d6d" /* station verde azulado */, GN = "#c0392b" /* generador rojo */, CREAM = "#f3ecdc", INK = "#1d2430", YEL = "#f2c230";
const BRUSH = "repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 1px, rgba(0,0,0,.05) 1px 3px)";
const CHROME = "linear-gradient(90deg,#6d757b,#e9edf0 30%,#a9b1b7 55%,#5d666e)";

// ---------- fondos: roble (mesada), concreto (piso del garaje), acero cepillado
const Oak: React.FC<{ children?: React.ReactNode; tone?: number }> = ({ children, tone = 0 }) => (
  <AbsoluteFill style={{ background: `repeating-linear-gradient(${92 + tone}deg, ${OAK} 0 38px, ${OAK2} 38px 41px, #93633b 41px 96px, ${OAK2} 96px 98px)` }}>
    <AbsoluteFill style={{ background: "linear-gradient(115deg, rgba(220,232,255,.22) 0%, rgba(220,232,255,0) 45%, rgba(0,0,0,.25) 100%)" }} />
    {children}
  </AbsoluteFill>
);
const Concrete: React.FC<{ children?: React.ReactNode; tone?: string }> = ({ children, tone = "#8f8b84" }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 22% 30%, rgba(0,0,0,.07) 0 70px, transparent 71px), radial-gradient(circle at 71% 64%, rgba(0,0,0,.06) 0 110px, transparent 111px), radial-gradient(circle at 47% 84%, rgba(255,255,255,.05) 0 80px, transparent 81px), radial-gradient(circle at 88% 18%, rgba(0,0,0,.05) 0 50px, transparent 51px), linear-gradient(170deg, ${tone}, #6c6862)` }}>
    <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 0 958px, rgba(0,0,0,.2) 958px 962px, transparent 962px), linear-gradient(0deg, transparent 0 718px, rgba(0,0,0,.16) 718px 722px, transparent 722px)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(115deg, rgba(220,232,255,.16) 0%, rgba(220,232,255,0) 45%, rgba(0,0,0,.2) 100%)" }} />
    {children}
  </AbsoluteFill>
);
// papel apoyado (sombra dura, nada de blur grande)
const Paper: React.FC<{ x: number; y: number; w: number; h: number | "auto"; rot?: number; e?: number; bg?: string; children?: React.ReactNode; style?: CSS }> = ({ x, y, w, h, rot = 0, e = 1, bg = CREAM, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: bg, transform: `translateY(${(1 - e) * 80}px) rotate(${rot}deg)`, opacity: cl(e * 1.4),
    boxShadow: "6px 10px 0 rgba(0,0,0,.28)", borderRadius: 4, ...style }}>{children}</div>
);
// letra a mano que se escribe (revela por recorte)
const Hand: React.FC<{ text: string; at: number; f: number; len?: number; size?: number; col?: string; style?: CSS }> = ({ text, at, f, len = 16, size = 58, col = INK, style }) => {
  const p = cl((f - at) / len); if (p <= 0) return null;
  return <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, whiteSpace: "nowrap", clipPath: `inset(-30% ${100 - p * 100}% -30% 0)`, ...style }}>{text}</div>;
};
const Lbl: React.FC<{ children: React.ReactNode; size?: number; col?: string; style?: CSS }> = ({ children, size = 34, col = INK, style }) =>
  <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: size, color: col, letterSpacing: 2, ...style }}>{children}</div>;
const Src: React.FC<{ text: string; f: number; at: number }> = ({ text, f, at }) =>
  <div style={{ position: "absolute", right: 70, bottom: 46, fontFamily: SANS, fontWeight: 600, fontSize: 26, color: "#fff", background: "rgba(20,24,30,.78)", padding: "8px 18px", borderRadius: 4, opacity: k(f, at, 10) }}>SOURCE · {text}</div>;
const Screw: React.FC<{ x: number; y: number; r?: number; rot?: number }> = ({ x, y, r = 14, rot = 30 }) =>
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #f4f4f4, #8a8f94 60%, #50555a)", boxShadow: "1px 2px 0 rgba(0,0,0,.35)" }}>
    <div style={{ position: "absolute", left: "15%", right: "15%", top: "50%", height: Math.max(2, r * 0.22), marginTop: -Math.max(1, r * 0.11), background: "#4a4f54", transform: `rotate(${rot}deg)` }} /></div>;

// ---------- ACTORES (todos en CSS, con material)
const Station: React.FC<{ s?: number; lit?: number }> = ({ s = 1, lit = 1 }) => (
  <div style={{ width: 300 * s, height: 220 * s, borderRadius: 18 * s, background: "linear-gradient(#4a5560,#2c343c)", position: "relative", boxShadow: `0 ${10 * s}px 0 rgba(0,0,0,.35)` }}>
    <div style={{ position: "absolute", left: 30 * s, right: 30 * s, top: -26 * s, height: 30 * s, border: `${10 * s}px solid #3a434b`, borderBottom: "none", borderRadius: `${14 * s}px ${14 * s}px 0 0` }} />
    <div style={{ position: "absolute", left: 24 * s, top: 34 * s, width: 110 * s, height: 64 * s, background: `rgba(120,230,200,${0.25 + 0.6 * lit})`, borderRadius: 6 * s }} />
    <div style={{ position: "absolute", right: 24 * s, top: 34 * s, width: 110 * s, height: 64 * s, background: "repeating-linear-gradient(90deg,#1f252b 0 6px,#39434c 6px 10px)", borderRadius: 6 * s }} />
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: (24 + i * 44) * s, top: 130 * s, width: 30 * s, height: 40 * s, background: "#1a1f24", borderRadius: 5 * s, boxShadow: `inset 0 0 0 ${3 * s}px #59636c` }} />)}
    <div style={{ position: "absolute", right: 28 * s, top: 138 * s, width: 34 * s, height: 34 * s, borderRadius: "50%", background: "radial-gradient(#7de0c4 0 35%, #1a1f24 40%)" }} />
  </div>
);
// generador inverter/abierto: bastidor tubular, tanque rojo con tapa y visor, bloque con aletas, arranque de tirón, panel con tomas
const Gen: React.FC<{ s?: number; run?: number }> = ({ s = 1, run = 0 }) => {
  const f = useCurrentFrame(); const j = run ? Math.sin(f * 2.1) * 1.4 * run : 0; const u = (n: number) => n * s;
  return (
    <div style={{ width: u(360), height: u(270), position: "relative", transform: `translateY(${j}px)` }}>
      <div style={{ position: "absolute", left: u(4), right: u(4), bottom: 0, height: u(16), background: "linear-gradient(#3d3d3d,#0e0e0e)", borderRadius: u(8) }} />
      <div style={{ position: "absolute", left: u(30), right: u(30), top: u(30), height: u(92), background: "linear-gradient(#e2553f 0%,#c0392b 45%,#8a2216 100%)", borderRadius: `${u(28)}px ${u(28)}px ${u(8)}px ${u(8)}px`, boxShadow: `inset 0 ${u(5)}px 0 rgba(255,255,255,.2)` }}>
        <div style={{ position: "absolute", left: u(26), top: u(14), width: u(160), height: u(9), background: "rgba(255,255,255,.28)", borderRadius: u(5) }} />
        <div style={{ position: "absolute", left: u(34), top: u(40), width: u(120), height: u(32), background: "#1b1b1b", borderRadius: u(4), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: u(20), color: YEL, letterSpacing: u(2) }}>3000</div>
        <div style={{ position: "absolute", left: u(180), top: u(34), width: u(34), height: u(34), borderRadius: "50%", background: "radial-gradient(#fff 0 20%, #d8d8d8 22% 55%, #444 58%)" }} />
      </div>
      <div style={{ position: "absolute", left: u(222), top: u(14), width: u(58), height: u(26), borderRadius: u(9), background: "repeating-linear-gradient(90deg,#1c1c1c 0 5px,#4a4a4a 5px 9px)", boxShadow: `0 ${u(3)}px 0 #0b0b0b` }} />
      <div style={{ position: "absolute", left: u(30), top: u(128), width: u(176), height: u(108), background: "linear-gradient(#61676c,#2c3034)", borderRadius: u(8) }}>
        <div style={{ position: "absolute", left: u(10), top: u(12), width: u(62), height: u(84), background: "repeating-linear-gradient(0deg,#3a3f44 0 5px,#767c82 5px 9px)", borderRadius: u(4) }} />
        <div style={{ position: "absolute", left: u(86), top: u(16), width: u(78), height: u(78), borderRadius: "50%", background: "radial-gradient(#26292c 0 36%, #575e63 38% 66%, #1f2225 68%)" }} />
        <div style={{ position: "absolute", left: u(122), top: u(-8), width: u(4), height: u(30), background: "#bbb" }} />
        <div style={{ position: "absolute", left: u(98), top: u(-18), width: u(52), height: u(14), background: "linear-gradient(#333,#0c0c0c)", borderRadius: u(7) }} />
      </div>
      <div style={{ position: "absolute", right: u(30), top: u(128), width: u(110), height: u(108), background: "linear-gradient(#2c2f32,#18191b)", borderRadius: u(6), border: `${u(3)}px solid #43484c` }}>
        {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: u(10 + i * 48), top: u(14), width: u(38), height: u(46), background: "#e9e4d6", borderRadius: u(6) }}>
          <div style={{ position: "absolute", left: u(9), top: u(10), width: u(5), height: u(14), background: "#222" }} /><div style={{ position: "absolute", right: u(9), top: u(10), width: u(5), height: u(14), background: "#222" }} />
          <div style={{ position: "absolute", left: u(15), top: u(30), width: u(8), height: u(8), borderRadius: "50%", background: "#222" }} /></div>)}
        <div style={{ position: "absolute", left: u(12), top: u(72), width: u(26), height: u(22), borderRadius: u(4), background: "#111", boxShadow: `inset 0 0 0 ${u(3)}px #666` }} />
        <div style={{ position: "absolute", left: u(52), top: u(76), width: u(14), height: u(14), borderRadius: "50%", background: run ? "#7dffb0" : "#2d4a3a" }} />
      </div>
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", [i ? "right" : "left"]: u(6), top: u(16), bottom: u(10), width: u(16), background: "linear-gradient(90deg,#0f0f0f,#4d4d4d 45%,#141414)", borderRadius: u(8) } as CSS} />)}
      <div style={{ position: "absolute", left: u(6), right: u(6), top: u(8), height: u(16), background: "linear-gradient(#505050,#121212)", borderRadius: u(8) }} />
      <div style={{ position: "absolute", left: u(-8), bottom: u(-8), width: u(58), height: u(58), borderRadius: "50%", background: "radial-gradient(#9a9a9a 0 20%, #1b1b1b 23% 100%)" }} />
    </div>
  );
};
// bidón de nafta de 5 galones: tres asas, cuerpo con costillas en X, pico amarillo, etiqueta
const JerryCan: React.FC<{ s?: number; label?: string }> = ({ s = 1, label = "GASOLINE" }) => {
  const u = (n: number) => n * s; const RED = "linear-gradient(90deg,#8e2318,#d94a37 32%,#c0392b 62%,#8a2216)";
  const X = "linear-gradient(50deg, transparent 47%, rgba(255,255,255,.22) 47% 49.5%, rgba(0,0,0,.3) 49.5% 52%, transparent 52%), linear-gradient(-50deg, transparent 47%, rgba(255,255,255,.22) 47% 49.5%, rgba(0,0,0,.3) 49.5% 52%, transparent 52%)";
  return <div style={{ width: u(300), height: u(390), position: "relative" }}>
    <div style={{ position: "absolute", left: u(24), top: 0, width: u(170), height: u(18), background: RED, borderRadius: u(9) }} />
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: u(24 + i * 77), top: u(4), width: u(16), height: u(70), background: RED, borderRadius: u(6) }} />)}
    <div style={{ position: "absolute", left: u(236), top: u(-34), width: u(26), height: u(96), background: "linear-gradient(90deg,#b38b14,#f2c230 45%,#a07c10)", borderRadius: u(9), transform: "rotate(32deg)", transformOrigin: "50% 100%" }} />
    <div style={{ position: "absolute", left: u(222), top: u(42), width: u(50), height: u(32), background: "linear-gradient(#2a2a2a,#0c0c0c)", borderRadius: u(6) }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: u(66), bottom: 0, background: RED, borderRadius: u(20), boxShadow: `${u(8)}px ${u(10)}px 0 rgba(0,0,0,.3)` }}>
      <div style={{ position: "absolute", inset: u(24), background: X, borderRadius: u(10), boxShadow: `inset 0 0 0 ${u(4)}px rgba(0,0,0,.16), inset ${u(3)}px ${u(3)}px 0 ${u(4)}px rgba(255,255,255,.08)` }} />
      {label && <div style={{ position: "absolute", left: u(44), right: u(44), bottom: u(36), padding: `${u(8)}px 0`, background: CREAM, borderRadius: u(4), textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: u(28), color: GN, letterSpacing: u(2) }}>{label}</div>}
    </div>
  </div>;
};

// ================= SERIE: EL MARCADOR DE 10 ROUNDS (round:N) — tablero de madera con persianas numeradas
const ROUNDS = ["AIR", "POWER", "HOURS", "FUEL", "COLD", "FURNACE", "NOISE & THEFT", "UPKEEP", "MONEY", "LIFE"];
const Round: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const n = +a[0];
  return <Oak tone={4}>
    <div style={{ position: "absolute", left: 160, top: 120, width: 1600, height: 640, background: "#23201c", borderRadius: 10, boxShadow: "0 14px 0 rgba(0,0,0,.35)", padding: "30px 30px 100px", display: "flex", gap: 14, perspective: 900, boxSizing: "border-box" }}>
      {ROUNDS.map((r, i) => {
        const on = i + 1 === n, past = i + 1 < n, t = on ? k(f, 4, 14) : 1;
        return <div key={i} style={{ flex: 1, position: "relative", background: "#141210", borderRadius: 6, overflow: "hidden" }}>
          {on || past ? <div style={{ position: "absolute", inset: 8, background: on ? YEL : "#5a5246", transformOrigin: "50% 0", transform: `rotateX(${(1 - t) * -88}deg)`, borderRadius: 4,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: on ? INK : "#cfc6b6" }}>{i + 1}</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: r.length > 8 ? 16 : 21, letterSpacing: 1, color: on ? INK : "#cfc6b6", textAlign: "center", padding: "0 6px" }}>{r}</div>
          </div> : <div style={{ position: "absolute", inset: 8, background: "#1c1916", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: "#3b352d" }}>{i + 1}</div>}
        </div>;
      })}
      <div style={{ position: "absolute", right: 40, bottom: 18, fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: YEL, opacity: k(f, 18) }}>{n} / 10</div>
      <div style={{ position: "absolute", left: 40, bottom: 30, fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: "#9c907c" }}>STATION vs GENERATOR · KITCHEN TABLE BOUT</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", opacity: k(f, 10), transform: `translateY(${(1 - k(f, 10)) * 30}px)` }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: CREAM, letterSpacing: 6 }}>ROUND {n} <span style={{ color: YEL }}>· {ROUNDS[n - 1]}</span></div>
    </div>
  </Oak>;
};

// ================= SERIE: LA TARJETA DEL JUEZ (win:N:station|gen) — se anota el round en la columna del ganador
const WINS: Record<number, string> = { 1: "station", 2: "gen", 3: "gen", 4: "gen", 5: "tie", 6: "gen", 7: "station", 8: "station", 9: "gen", 10: "tie" };
const Judge: React.FC<P> = ({ m, a }) => {
  const f = useCurrentFrame(); const n = +a[0]; const final = a[0] === "final";
  const upto = final ? 10 : n;
  const tally = (who: string, lim: number) => Object.entries(WINS).filter(([r, w]) => +r <= lim && w === who).length;
  return <Oak>
    <Paper x={400} y={60} w={1120} h={960} rot={-1.5} e={k(f, 0, 14)}>
      <div style={{ padding: "34px 50px" }}>
        <Lbl size={30} col="#7a6a50">OFFICIAL SCORECARD · KITCHEN TABLE BOUT</Lbl>
        <div style={{ display: "flex", marginTop: 22, borderBottom: `4px solid ${INK}`, paddingBottom: 10 }}>
          <div style={{ width: 280, fontFamily: SERIF, fontWeight: 900, fontSize: 34 }}>ROUND</div>
          <div style={{ flex: 1, fontFamily: SERIF, fontWeight: 900, fontSize: 34, color: ST }}>POWER STATION</div>
          <div style={{ flex: 1, fontFamily: SERIF, fontWeight: 900, fontSize: 34, color: GN }}>GENERATOR</div>
        </div>
        {ROUNDS.map((r, i) => {
          const rd = i + 1, w = WINS[rd]; if (rd > upto) return <div key={i} style={{ height: 62, borderBottom: "2px solid rgba(29,36,48,.18)" }} />;
          const cur = rd === upto && !final, at = cur ? M(m, 0, 8) : -99;
          return <div key={i} style={{ display: "flex", alignItems: "center", height: 62, borderBottom: "2px solid rgba(29,36,48,.18)", background: cur ? "rgba(242,194,48,.28)" : "none" }}>
            <div style={{ width: 280, fontFamily: SANS, fontWeight: 700, fontSize: 25, whiteSpace: "nowrap" }}>{rd} {r}</div>
            <div style={{ flex: 1 }}>{(w === "station" || w === "tie") && <Hand text={w === "tie" ? "tie" : "10 ✓"} at={at} f={f} size={48} col={ST} />}</div>
            <div style={{ flex: 1 }}>{(w === "gen" || w === "tie") && <Hand text={w === "tie" ? "tie" : "10 ✓"} at={at} f={f} size={48} col={GN} />}</div>
          </div>;
        })}
        <div style={{ display: "flex", marginTop: 16, fontFamily: SERIF, fontWeight: 900, fontSize: 44 }}>
          <div style={{ width: 280 }}>WON</div>
          <div style={{ flex: 1, color: ST }}>{tally("station", upto)}</div>
          <div style={{ flex: 1, color: GN }}>{tally("gen", upto)}</div>
        </div>
      </div>
    </Paper>
  </Oak>;
};

// ================= ring (013): las dos máquinas entran desde las esquinas y se plantan en la raya de cinta
const Ring: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const a = sp(f, 4), b = sp(f, 12), v = k(f, M(m, 0, 40), 10);
  return <Concrete tone="#7d7972">
    <div style={{ position: "absolute", left: 955, top: 120, width: 10, height: 860, background: YEL, transform: `scaleY(${k(f, 0, 18)})`, transformOrigin: "50% 0", boxShadow: "0 0 0 3px #b8901a" }} />
    <div style={{ position: "absolute", left: 360 + (1 - a) * -700, top: 470, display: "flex", flexDirection: "column", alignItems: "center" }}><Station s={1.5} /><Lbl col={CREAM} size={44} style={{ marginTop: 40, background: ST, padding: "6px 24px", borderRadius: 6 }}>POWER STATION</Lbl></div>
    <div style={{ position: "absolute", right: 320 + (1 - b) * -700, top: 400, display: "flex", flexDirection: "column", alignItems: "center" }}><Gen s={1.45} /><Lbl col={CREAM} size={44} style={{ marginTop: 40, background: GN, padding: "6px 24px", borderRadius: 6 }}>GENERATOR</Lbl></div>
    <div style={{ position: "absolute", left: 960, top: 170, transform: `translate(-50%,0) scale(${0.6 + 0.4 * v})`, opacity: v, fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: INK, background: CREAM, padding: "0 36px", boxShadow: "6px 10px 0 rgba(0,0,0,.3)", whiteSpace: "nowrap" }}>10 ROUNDS</div>
  </Concrete>;
};

// ================= carousel (015) y recap: diez tarjetas de round sobre una bandeja giratoria (lazy susan)
const Susan: React.FC<P & { order?: boolean; pick?: number }> = ({ m, order, pick }) => {
  const f = useCurrentFrame();
  const rot = order ? -((pick ?? 1) - 1) * 36 + (1 - io(f / 22)) * 36 : -f * 0.55;
  return <Oak tone={-3}>
    <div style={{ position: "absolute", left: 960, top: 640, width: 0, height: 0, perspective: 1600 }}>
      <div style={{ position: "absolute", left: -560, top: -170, width: 1120, height: 340, borderRadius: "50%", background: "radial-gradient(#b07a4a,#7a4f2c)", transform: "rotateX(72deg)", boxShadow: "0 30px 0 rgba(0,0,0,.3)" }} />
      <div style={{ transformStyle: "preserve-3d", transform: `rotateX(-8deg) rotateY(${rot}deg)` }}>
        {ROUNDS.map((r, i) => {
          const at = order ? (i + 1 === pick ? 0 : -99) : M(m, i, 6 + i * 20), t = order ? 1 : k(f, at, 10), hl = order && i + 1 === pick;
          const eff = (((i * 36 + rot) % 360) + 540) % 360 - 180, vis = cl((Math.cos(eff * Math.PI / 180) - 0.45) / 0.22);
          if (vis <= 0) return null;
          const w = WINS[i + 1];
          return <div key={i} style={{ position: "absolute", left: -120, top: -340, width: 240, height: 310, transform: `rotateY(${i * 36}deg) translateZ(520px) rotateY(${(1 - t) * 180}deg)`, backfaceVisibility: "hidden", opacity: vis,
            background: hl ? YEL : CREAM, borderRadius: 10, boxShadow: "0 8px 0 rgba(0,0,0,.3)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 12px", boxSizing: "border-box" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: INK, lineHeight: 1 }}>{i + 1}</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: r.length > 8 ? 20 : 26, color: INK, letterSpacing: 1, textAlign: "center", whiteSpace: "nowrap", marginTop: 8 }}>{r}</div>
            {order && <div style={{ marginTop: 12, fontFamily: HAND, fontSize: 38, fontWeight: 700, color: w === "gen" ? GN : w === "station" ? ST : "#7a6a50" }}>{w === "gen" ? "generator" : w === "station" ? "station" : "tie"}</div>}
          </div>;
        })}
      </div>
    </div>
  </Oak>;
};

// ================= map:<pueblo> — el mapa de rutas del condado; el alfiler cae y cuelga la orden de trabajo con el año
const TOWNS: Record<string, { x: number; y: number; yr: string; job: string }> = {
  orrville: { x: 1080, y: 360, yr: "2014", job: "ICE STORM · GEN IN THE GARAGE" }, wooster: { x: 900, y: 470, yr: "2019", job: "MRS. DALE · 1,000 Wh STATION" },
  ashland: { x: 520, y: 440, yr: "2022", job: "ICE STORM · GAS STATIONS DARK" }, millersburg: { x: 1010, y: 800, yr: "2017", job: "GENERATOR STOLEN" },
};
const CountyMap: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const t = TOWNS[a[0]]; const unf = io(f / 16), pin = sp(f, 14), tag = k(f, 26, 12);
  const roads = [[0, 380, 1920, 330, 7], [0, 520, 1920, 600, 9], [700, 0, 760, 1080, 8], [1150, 0, 980, 1080, 6], [300, 0, 1500, 1080, 4], [0, 820, 1920, 760, 5]];
  const nx = Math.min(t.x + 50, 1780 - 600), ny = Math.min(t.y + 70, 1010 - 190);
  return <Oak>
    <div style={{ position: "absolute", left: 140, top: 70, width: 1640, height: 940, perspective: 2000 }}>
      <div style={{ position: "absolute", inset: 0, background: "#efe6cf", transformOrigin: "0 50%", transform: `rotateY(${(1 - unf) * -70}deg)`, boxShadow: "8px 12px 0 rgba(0,0,0,.3)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, transparent 0 409px, rgba(0,0,0,.08) 409px 411px)" }} />
        {roads.map(([x1, y1, x2, y2, w], i) => { const L = Math.hypot(x2 - x1, y2 - y1), ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
          return <div key={i} style={{ position: "absolute", left: x1 - 140, top: y1 - 70, width: L, height: w, background: i < 2 ? "#c9453a" : "#7c8a94", transform: `rotate(${ang}deg)`, transformOrigin: "0 50%" }} />; })}
        {Object.entries(TOWNS).map(([n, p]) => <div key={n} style={{ position: "absolute", left: p.x - 140 + 30, top: p.y - 70 - 52, fontFamily: SERIF, fontWeight: 700, fontSize: 30, color: n === a[0] ? INK : "#8a8273", textTransform: "uppercase", background: "#efe6cf", padding: "0 8px" }}>{n}</div>)}
        <div style={{ position: "absolute", left: 24, bottom: 18, fontFamily: SANS, fontWeight: 700, fontSize: 24, color: "#8a8273", letterSpacing: 3, background: "#efe6cf", padding: "6px 14px", border: "2px solid #c9bea4" }}>WAYNE · ASHLAND · HOLMES COUNTIES, OHIO</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: t.x - 14, top: t.y - 14 - (1 - pin) * 200, width: 28, height: 28, borderRadius: "50%", background: "#d23b2f", boxShadow: "4px 6px 0 rgba(0,0,0,.35)", opacity: cl(pin * 3) }} />
    <Paper x={nx} y={ny} w={600} h={170} rot={3} e={tag} bg="#fff8e2">
      <div style={{ padding: "18px 26px" }}><Lbl size={22} col="#9a6a2a">WORK ORDER · {t.yr}</Lbl><Hand text={t.job} at={30} f={f} size={36} style={{ marginTop: 8 }} /></div>
    </Paper>
  </Oak>;
};

// ================= exhaust (040): bidón → generador en marcha → bocanadas «CO» que salen del escape
const Exhaust: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const co = M(m, 0, 40); const gx = 760, gy = 430;
  return <Concrete>
    <div style={{ position: "absolute", left: 170, top: 470, opacity: k(f, 0) }}><JerryCan s={0.9} /></div>
    <div style={{ position: "absolute", left: 440, top: 540, width: (gx + 60 - 440) * k(f, 6, 16), height: 16, background: "linear-gradient(#3a3a3a,#0e0e0e)", borderRadius: 8 }} />
    <div style={{ position: "absolute", left: gx, top: gy, opacity: k(f, 4) }}><Gen s={1.5} run={1} /></div>
    <div style={{ position: "absolute", left: gx + 520, top: gy + 230, width: 90, height: 40, background: CHROME, borderRadius: "6px 20px 20px 6px" }} />
    {Array.from({ length: 14 }).map((_, i) => { const t = (f - co - i * 7) / 60; if (t < 0) return null; const y = gy + 230 - t * 520, x = gx + 640 + t * 140 + Math.sin(t * 5 + i) * (30 + i * 4);
      if (y < 60) return null;
      return <div key={i} style={{ position: "absolute", left: x - 50, top: y - 50, width: 100, height: 100, borderRadius: "50%", background: "rgba(62,66,72,.82)", opacity: cl(1.15 - t), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 36, color: "#fff" }}>CO</div>; })}
    <Lbl size={58} col={CREAM} style={{ position: "absolute", left: 170, top: 930, opacity: k(f, co), background: "rgba(24,26,30,.85)", padding: "8px 26px", borderRadius: 6 }}>CARBON MONOXIDE · <span style={{ color: "#ff8a6a" }}>NO SMELL, NO COLOR</span></Lbl>
  </Concrete>;
};

// ================= stat:cdc (042): números pintados con plantilla en la pared de madera del garaje, con la fuente
const Stencil: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame();
  const rows = [["400+", "DIE EVERY YEAR", "non-fire carbon monoxide"], ["100,000+", "ER VISITS", "every year"]];
  return <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg,#c9b08a 0 180px,#b99d76 180px 184px)" }}>
    {rows.map(([n, l, s], i) => { const at = M(m, i, 10 + i * 90), t = k(f, at, 8);
      return <div key={i} style={{ position: "absolute", left: 150, top: 220 + i * 320, display: "flex", alignItems: "baseline", gap: 40, opacity: t }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 210, color: i === 0 ? "#9b1d14" : INK, letterSpacing: 4, clipPath: `inset(0 ${100 - t * 100}% 0 0)` }}>{n}</div>
        <div><Lbl size={56}>{l}</Lbl><Lbl size={32} col="#5b4a33" style={{ fontWeight: 600 }}>{s}</Lbl></div>
      </div>; })}
    <Src text="CDC — Carbon Monoxide Poisoning Prevention" f={f} at={20} />
  </AbsoluteFill>;
};

// ================= twenty (045): la cinta métrica sale de la pared de la casa hasta el generador, 20 FT
const Tape20: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const t = io((f - 10) / 50), ft = Math.round(t * 20), L = 1220;
  return <AbsoluteFill style={{ background: "linear-gradient(#b9c6d3 0 58%, #eef2f5 58%)" }}>
    <div style={{ position: "absolute", left: 0, top: 120, width: 270, height: 680, background: "repeating-linear-gradient(0deg,#e8dfcf 0 46px,#cbbfa9 46px 50px)", boxShadow: "8px 0 0 rgba(0,0,0,.15)" }}>
      <div style={{ position: "absolute", left: 70, top: 120, width: 130, height: 150, background: "linear-gradient(135deg,#9fc0dc,#6f93b3)", border: "10px solid #fff" }} />
      <div style={{ position: "absolute", left: 60, top: 420, width: 150, height: 260, background: "#7a5236", border: "8px solid #fff" }} /></div>
    <div style={{ position: "absolute", left: 270, top: 700, width: L * t, height: 70, background: YEL, borderTop: "4px solid #b8901a", borderBottom: "4px solid #b8901a", overflow: "hidden" }}>
      {Array.from({ length: 21 }).map((_, i) => <div key={i} style={{ position: "absolute", left: i * (L / 20), top: 0, width: 4, height: i % 5 ? 26 : 46, background: INK }}>{i % 5 === 0 && <span style={{ position: "absolute", top: 40, left: 8, fontFamily: SANS, fontWeight: 800, fontSize: 18 }}>{i}</span>}</div>)}
    </div>
    <div style={{ position: "absolute", left: 270 + L * t - 40, top: 680, width: 84, height: 110, background: "linear-gradient(#444,#1a1a1a)", borderRadius: 14 }}><div style={{ margin: "30px 18px", height: 40, borderRadius: 20, background: YEL }} /></div>
    <div style={{ position: "absolute", left: 1560, top: 530, opacity: k(f, 55) }}><Gen s={0.85} run={1} /></div>
    <Lbl size={26} col={CREAM} style={{ position: "absolute", left: 1600, top: 470, opacity: k(f, M(m, 0, 120)), background: GN, padding: "4px 14px", borderRadius: 4 }}>EXHAUST →</Lbl>
    <div style={{ position: "absolute", left: 700, top: 330, fontFamily: SERIF, fontWeight: 900, fontSize: 170, color: INK }}>{ft} FT</div>
    <Lbl size={36} col={CREAM} style={{ position: "absolute", left: 270, top: 860, opacity: k(f, M(m, 0, 120)), background: "rgba(29,36,48,.88)", padding: "10px 24px", borderRadius: 6 }}>EXHAUST POINTED AWAY FROM DOORS, WINDOWS & VENTS</Lbl>
  </AbsoluteFill>;
};

// ================= SERIE hose:* — la analogía: tanque de acrílico con marco de acero, manguera de goma con pico de bronce
const Hose: React.FC<P> = ({ a, m }) => {
  const f = useCurrentFrame(); const v = a[0];
  const cfg: Record<string, [number, number, string, string]> = { // ancho manguera, nivel tanque, rótulo izq, rótulo der
    watts: [64, 0.7, "WATTS = HOW HARD IT PUSHES", "WATT-HOURS = HOW LONG"], wide: [104, 0.7, "WATTS = HOSE WIDTH", "WATT-HOURS = WATER IN THE TANK"],
    gen: [40, 1, "GENERATOR · SMALL HOSE", "HUGE TANK (YOUR GAS CANS)"], station: [104, 0.32, "POWER STATION · WIDE HOSE", "SMALL TANK · ~1,000 Wh"], half: [104, 0.32, "1,800 W FLAT OUT", "EMPTY IN ~30 MIN"] };
  const [w, lvl0, L1, L2] = cfg[v]; const drain = v === "half" ? interpolate(f, [8, 80], [lvl0, 0.02], CL) : lvl0;
  const hy = 770, he = 700 + 920 * k(f, 2, 14), flowing = drain > 0.03;
  return <Concrete>
    <div style={{ position: "absolute", left: 180, top: 180, width: 520, height: 660 }}>
      <div style={{ position: "absolute", left: 18, right: 18, top: 0, bottom: 18, background: "linear-gradient(90deg, rgba(210,228,240,.42), rgba(240,248,252,.6) 30%, rgba(200,220,235,.38))", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${drain * 100}%`, background: "linear-gradient(#5aa3d8,#2f74ad)", borderTop: "6px solid #8cc6ee" }} />
        <div style={{ position: "absolute", left: 40, top: 30, bottom: 30, width: 16, background: "rgba(255,255,255,.35)", borderRadius: 8 }} />
      </div>
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", [i ? "right" : "left"]: 0, top: -10, bottom: 0, width: 26, background: `${BRUSH}, ${CHROME}`, borderRadius: 4 } as CSS}>{[60, 300, 560].map((y) => <Screw key={y} x={13} y={y} r={8} />)}</div>)}
      <div style={{ position: "absolute", left: -10, right: -10, top: -18, height: 26, background: `${BRUSH}, linear-gradient(#e9edf0,#8d959b)`, borderRadius: 6 }} />
      <div style={{ position: "absolute", left: -14, right: -14, bottom: -6, height: 30, background: `${BRUSH}, linear-gradient(#a9b1b7,#5d666e)`, borderRadius: 6 }} />
    </div>
    <div style={{ position: "absolute", left: 690, top: hy - w / 2 - 14, width: 50, height: w + 28, background: "linear-gradient(#e9c46a,#b8862b)", borderRadius: 8 }} />
    <div style={{ position: "absolute", left: 736, top: hy - w / 2, width: Math.max(0, he - 736), height: w, background: "repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 4px, transparent 4px 16px), linear-gradient(#3f6b43,#1d3b20 55%,#2f5a32)", borderRadius: w / 2 }} />
    <div style={{ position: "absolute", left: he - 10, top: hy - w * 0.42, width: 90, height: w * 0.84, background: "linear-gradient(#f0cf78,#b8862b 60%,#8d6418)", borderRadius: "8px 30px 30px 8px" }} />
    {flowing && Array.from({ length: Math.round(w / 8) }).map((_, i) => { const p = ((f * (v === "gen" ? 2 : 5) + i * 37) % 120) / 120; const x = he + 80 + p * 260, y = hy + (i % 5 - 2) * w * 0.12 + p * p * 160;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 18, height: 12, borderRadius: 8, background: "#5aa3d8", opacity: 1 - p }} />; })}
    <div style={{ position: "absolute", left: 790, top: 250, background: "rgba(24,26,30,.86)", padding: "22px 34px", borderRadius: 8, opacity: k(f, M(m, 0, 4)) }}>
      <Lbl size={46} col={CREAM}>{L1}</Lbl>
      <Lbl size={46} col="#8cc6ee" style={{ marginTop: 14, opacity: k(f, M(m, 1, 30)) }}>{L2}</Lbl>
    </div>
  </Concrete>;
};

// ================= sticker (087): la chapa de datos de la heladera (aluminio remachado), el 6 A resaltado con marcador
const Sticker: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const hl = k(f, M(m, 0, 40), 14);
  const rows: [string, string, boolean?][] = [["MODEL", "RF-21 · TOP FREEZER"], ["SERIAL", "0419 23 77 · MADE 2019"], ["SUPPLY", "115 V ~ 60 Hz · 1 PH"], ["RATED", "6.0 A", true], ["DEFROST HEATER", "450 W"], ["REFRIGERANT", "R-600a · 2.1 oz"]];
  const emb: CSS = { color: "#3e454b", textShadow: "-1px -1px 0 rgba(0,0,0,.25), 1px 1px 0 rgba(255,255,255,.7)" };
  return <AbsoluteFill style={{ background: "linear-gradient(90deg,#d9dcdd,#f4f5f5 40%,#e3e5e6)" }}>
    <div style={{ position: "absolute", left: 120, top: 0, bottom: 0, width: 20, background: "linear-gradient(90deg,#9ea3a6,#cfd2d4)" }} />
    <div style={{ position: "absolute", left: 360, top: 130, width: 1200, height: 800, background: `repeating-linear-gradient(90deg, rgba(255,255,255,.08) 0 2px, rgba(0,0,0,.04) 2px 4px), linear-gradient(135deg,#e8ebed,#aab1b6)`, border: "4px solid #858d93", borderRadius: 10, boxShadow: "6px 10px 0 rgba(0,0,0,.18)", transform: `translateY(${(1 - k(f, 0)) * 60}px)`, opacity: k(f, 0) }}>
      {[[30, 30], [1170, 30], [30, 770], [1170, 770]].map(([x, y], i) => <Screw key={i} x={x} y={y} r={14} rot={i * 40} />)}
      <div style={{ padding: "50px 80px" }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 58, letterSpacing: 6, ...emb }}>REFRIGERATOR / FREEZER</div>
        <div style={{ height: 4, background: "#7d858b", margin: "18px 0 10px" }} />
        {rows.map(([l, v, hot], i) => <div key={i} style={{ display: "flex", alignItems: "center", height: 92, borderBottom: "2px solid rgba(62,69,75,.25)", position: "relative" }}>
          {hot && <div style={{ position: "absolute", left: -16, right: 260, top: 14, bottom: 14, background: YEL, opacity: 0.85, transform: `scaleX(${hl})`, transformOrigin: "0 50%" }} />}
          <div style={{ position: "relative", width: 420, fontFamily: SANS, fontWeight: 800, fontSize: 36, letterSpacing: 3, ...emb }}>{l}</div>
          <div style={{ position: "relative", fontFamily: "monospace", fontWeight: 900, fontSize: hot ? 64 : 44, ...emb }}>{v}</div>
        </div>)}
      </div>
    </div>
  </AbsoluteFill>;
};

// ================= fridgehours (094): la batería como un reloj de arena horizontal; la heladera la vacía en 10-12 h
const Hourglass: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const t = io(f / dur), h = Math.round(t * 11), left = 1 - t * 0.95;
  return <Oak>
    <div style={{ position: "absolute", left: 220, top: 300, width: 1100, height: 300, background: "linear-gradient(#3a444d,#232a30)", borderRadius: 30, padding: 24, boxShadow: "0 12px 0 rgba(0,0,0,.35)", boxSizing: "border-box" }}>
      <div style={{ width: `${left * 100}%`, height: "100%", background: `linear-gradient(90deg, ${ST}, #6fd1b8)`, borderRadius: 16 }} />
      <div style={{ position: "absolute", right: 40, top: 0, bottom: 0, display: "flex", alignItems: "center", fontFamily: "monospace", fontWeight: 900, fontSize: 80, color: left < 0.2 ? "#ff8a6a" : "#bfe8d8" }}>{Math.round(left * 100)}%</div></div>
    <div style={{ position: "absolute", left: 1320, top: 390, width: 44, height: 120, background: "#2c343c", borderRadius: 8 }} />
    <div style={{ position: "absolute", left: 1440, top: 270, textAlign: "center" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 170, color: CREAM, lineHeight: 1 }}>{h}<span style={{ fontSize: 80 }}> h</span></div>
      <Lbl size={30} col={CREAM}>RUNNING</Lbl></div>
    <Lbl size={40} col={CREAM} style={{ position: "absolute", left: 220, top: 680 }}>1,000 Wh BATTERY · FRIDGE ONLY · DOOR SHUT</Lbl>
    <Lbl size={46} col={YEL} style={{ position: "absolute", left: 220, top: 750, opacity: k(f, dur * 0.5) }}>≈ 10–12 HOURS TO EMPTY</Lbl>
  </Oak>;
};

// ================= drain750 (098): radiador de aceite de 750 W y la aguja de combustible que cae en 1 h 15
const Heater: React.FC<{ glow: number }> = ({ glow }) => {
  const f = useCurrentFrame();
  return <div style={{ position: "relative", width: 520, height: 470 }}>
    {Array.from({ length: 8 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 20 + i * 54, top: 20, width: 44, height: 360, borderRadius: 22, background: "linear-gradient(90deg,#9ea3a7,#f2f4f5 40%,#c4c8cb 70%,#868b8f)" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: `rgba(255,120,40,${glow * (0.12 + 0.08 * Math.sin(f / 9 + i))})` }} /></div>)}
    <div style={{ position: "absolute", left: 30, right: 80, top: 60, height: 14, background: "#8d9296" }} />
    <div style={{ position: "absolute", left: 30, right: 80, top: 330, height: 14, background: "#8d9296" }} />
    <div style={{ position: "absolute", right: 0, top: 70, width: 80, height: 200, background: "linear-gradient(90deg,#d9dcde,#a3a8ac)", borderRadius: 10 }}>
      <div style={{ margin: "26px auto 0", width: 50, height: 50, borderRadius: "50%", background: "conic-gradient(#333 0 8deg,#e9e9e9 8deg 352deg,#333 352deg)", border: "4px solid #777" }} />
      <div style={{ margin: "26px auto 0", width: 18, height: 18, borderRadius: "50%", background: glow > 0.2 ? "#ff7a2a" : "#5a3a2a" }} />
      <div style={{ textAlign: "center", marginTop: 12, fontFamily: SANS, fontWeight: 800, fontSize: 16, color: "#444" }}>750 W</div></div>
    {[60, 380].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 384, width: 90, height: 60, background: "linear-gradient(#444,#1a1a1a)", borderRadius: "10px 10px 30px 30px" }} />)}
  </div>;
};
const Drain: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const t = io(f / dur), ang = -60 + 120 * (1 - t);
  return <Oak>
    <div style={{ position: "absolute", left: 220, top: 200, width: 600, height: 600, borderRadius: "50%", background: "conic-gradient(#6d757b,#e9edf0,#8d959b,#d9dee2,#5d666e,#c9ced3,#6d757b)", boxShadow: "8px 12px 0 rgba(0,0,0,.3)" }}>
      <div style={{ position: "absolute", inset: 26, borderRadius: "50%", background: CREAM }}>
        {Array.from({ length: 9 }).map((_, i) => { const a = -60 + i * 15; return <div key={i} style={{ position: "absolute", left: 270, top: 30, width: i % 2 ? 4 : 8, height: i % 2 ? 30 : 50, marginLeft: i % 2 ? -2 : -4, background: i < 2 ? GN : INK, transformOrigin: "50% 244px", transform: `rotate(${a}deg)` }} />; })}
        <div style={{ position: "absolute", left: 70, top: 300, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: GN }}>E</div>
        <div style={{ position: "absolute", right: 70, top: 300, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: INK }}>F</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 26, color: "#7a6a50", letterSpacing: 3 }}>FUEL</div>
        <div style={{ position: "absolute", left: 269, top: 64, width: 10, height: 210, background: GN, transformOrigin: "50% 210px", transform: `rotate(${ang}deg)`, borderRadius: 5 }} />
        <div style={{ position: "absolute", left: 250, top: 250, width: 48, height: 48, borderRadius: "50%", background: "radial-gradient(#777,#222)" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 1000, top: 250 }}><Heater glow={1} /></div>
    <Lbl size={46} col={CREAM} style={{ position: "absolute", left: 1010, top: 760 }}>750 W SPACE HEATER</Lbl>
    <Lbl size={72} col={YEL} style={{ position: "absolute", left: 220, top: 860 }}>{`${Math.floor(t * 75 / 60)}:${String(Math.round(t * 75) % 60).padStart(2, "0")}`} h → EMPTY</Lbl>
  </Oak>;
};

// ================= fridgelist (102): la lista con imán en la puerta de la heladera
const FridgeList: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const items = ["the fridge", "furnace blower", "internet", "lights", "phones"];
  return <AbsoluteFill style={{ background: "linear-gradient(90deg,#e9eef0,#cdd4d8)" }}>
    <div style={{ position: "absolute", left: 1540, top: 0, width: 26, height: 1080, background: "#b8c0c5" }} />
    <div style={{ position: "absolute", left: 1600, top: 380, width: 40, height: 320, borderRadius: 20, background: CHROME }} />
    <Paper x={520} y={70} w={860} h={940} rot={2} e={k(f, 0)} bg="#fffdf4">
      <div style={{ position: "absolute", left: 380, top: -26, width: 100, height: 60, borderRadius: 10, background: "#d23b2f", boxShadow: "3px 5px 0 rgba(0,0,0,.3)" }} />
      <div style={{ padding: "70px 60px" }}>
        <Hand text="BATTERY RUNS:" at={4} f={f} size={64} col="#1f4f8f" />
        {items.map((s, i) => <Hand key={i} text={`• ${s}`} at={M(m, i, 20 + i * 24)} f={f} size={60} style={{ marginTop: 18 }} />)}
        <Hand text="HEAT NEVER TOUCHES" at={M(m, 5, 150)} f={f} size={60} col={GN} style={{ marginTop: 36 }} />
        <Hand text="THE BATTERY." at={M(m, 5, 150) + 12} f={f} size={60} col={GN} />
      </div>
    </Paper>
  </AbsoluteFill>;
};

// ================= SERIE napkin:0-6 — la cuenta en la servilleta, renglón por renglón
const NAP = ["Wh × 0.85 ÷ watts = hours", "2,000 Wh × 0.85 = 1,700", "fridge ≈ 75 W", "furnace blower ≈ 130 W avg", "internet, lights, phones ≈ 40 W", "total ≈ 250 W", "1,700 ÷ 250 ≈ 6.8 h"];
const Napkin: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const n = +a[0];
  return <Oak>
    <div style={{ position: "absolute", left: 440, top: 60, width: 1040, height: 960, background: "#fbfbf7", transform: "rotate(-2deg)", boxShadow: "6px 10px 0 rgba(0,0,0,.25)",
      backgroundImage: "repeating-linear-gradient(45deg, rgba(0,0,0,.025) 0 6px, transparent 6px 12px)", clipPath: "polygon(0 2%,3% 0,97% 1%,100% 3%,99% 97%,96% 100%,2% 99%,0 96%)" }}>
      <div style={{ padding: "60px 80px" }}>
        {NAP.slice(0, n + 1).map((s, i) => { const last = i === 6 && n === 6;
          const line = <Hand text={s} at={i === n ? 4 : -99} f={f} len={22} size={last ? 84 : 62} col={i === n ? "#1f4f8f" : "#555"} />;
          return <div key={i} style={{ position: "relative", marginBottom: last ? 0 : 30, display: "inline-block", width: "100%" }}>
            {line}
            {last && <div style={{ position: "absolute", left: -34, top: -18, width: 790, bottom: -18, border: `6px solid ${GN}`, borderRadius: "50%", transform: `scale(${k(f, 30, 10)}) rotate(-2deg)`, opacity: k(f, 30, 10) }} />}
          </div>; })}
      </div>
    </div>
  </Oak>;
};

// ================= cans3 (150): bidones de 5 galones que caen sobre el piso del garaje: 1 día, 2, 3 = 15 galones
const Cans: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const at = [M(m, 0, 30), M(m, 1, 80), M(m, 2, 130)];
  return <Concrete>
    <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center" }}>
      <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: INK, background: CREAM, padding: "0 40px", boxShadow: "6px 10px 0 rgba(0,0,0,.25)" }}>{f < at[1] ? 5 : f < at[2] ? 10 : 15} GALLONS</span></div>
    {at.map((t, i) => <div key={i} style={{ position: "absolute", left: 345 + i * 470, top: 360 - (1 - sp(f, t)) * 500, opacity: cl(sp(f, t) * 3), display: "flex", flexDirection: "column", alignItems: "center" }}>
      <JerryCan s={0.95} label="5 GAL" />
      <Lbl size={44} col={CREAM} style={{ marginTop: 26, background: "rgba(24,26,30,.85)", padding: "4px 22px", borderRadius: 6 }}>DAY {i + 1}</Lbl></div>)}
  </Concrete>;
};

// ================= datetape (158): la cinta de pintor sobre el costado del bidón y la fecha con marcador
const DateTape: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "linear-gradient(90deg,#8e2318,#d94a37 35%,#c0392b 65%,#8a2216)" }}>
    <AbsoluteFill style={{ background: "linear-gradient(32deg, transparent 47%, rgba(255,255,255,.18) 47% 48.5%, rgba(0,0,0,.25) 48.5% 50%, transparent 50%), linear-gradient(-32deg, transparent 47%, rgba(255,255,255,.18) 47% 48.5%, rgba(0,0,0,.25) 48.5% 50%, transparent 50%)" }} />
    <div style={{ position: "absolute", left: 110, right: 110, top: 70, bottom: 70, borderRadius: 30, boxShadow: "inset 0 0 0 10px rgba(0,0,0,.14), inset 6px 6px 0 10px rgba(255,255,255,.06)" }} />
    <div style={{ position: "absolute", left: 1560, top: -60, width: 70, height: 240, background: "linear-gradient(90deg,#b38b14,#f2c230 45%,#a07c10)", borderRadius: 18, transform: "rotate(30deg)" }} />
    <div style={{ position: "absolute", left: 1490, top: 0, width: 160, height: 70, background: "linear-gradient(#2a2a2a,#0c0c0c)", borderRadius: "0 0 14px 14px" }} />
    <div style={{ position: "absolute", left: 300, top: 400, width: 1320 * k(f, 2, 14), height: 220, background: "#e8d9a8", transform: "rotate(-3deg)", boxShadow: "0 6px 0 rgba(0,0,0,.2)", overflow: "hidden" }}>
      <Hand text="FILLED 11 / 03 · STABILIZER ✓" at={14} f={f} len={26} size={96} style={{ padding: "50px 60px" }} /></div>
  </AbsoluteFill>;
};

// ================= refill3 (165): tres cables que llegan a las tomas de la power station: generador, camioneta, panel
const Truck: React.FC = () => <div style={{ position: "relative", width: 320, height: 150 }}>
  <div style={{ position: "absolute", left: 0, top: 50, width: 190, height: 62, background: "linear-gradient(#4a6c9e,#2e4a73)", borderRadius: "6px 0 0 6px" }} />
  <div style={{ position: "absolute", left: 186, top: 14, width: 130, height: 98, background: "linear-gradient(#4a6c9e,#2e4a73)", borderRadius: "34px 14px 6px 0" }}>
    <div style={{ position: "absolute", left: 20, top: 14, width: 76, height: 38, background: "linear-gradient(135deg,#cfe3f2,#7fa4c4)", borderRadius: "22px 6px 2px 2px" }} /></div>
  <div style={{ position: "absolute", left: 300, top: 76, width: 22, height: 16, background: "#f2e6a0", borderRadius: 4 }} />
  {[44, 230].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 88, width: 62, height: 62, borderRadius: "50%", background: "radial-gradient(#b5b5b5 0 22%, #1a1a1a 25%)" }} />)}
</div>;
const MiniPanel: React.FC = () => <div style={{ position: "relative", width: 280, height: 170 }}>
  <div style={{ position: "absolute", left: 20, top: 0, width: 240, height: 120, background: "repeating-linear-gradient(90deg,#1d3557 0 38px,#9fb4c8 38px 41px), #1d3557", border: "6px solid #c9ced3", transform: "skewX(-14deg)" }}>
    <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent 0 36px, #9fb4c8 36px 39px)" }} /></div>
  {[60, 200].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 124, width: 8, height: 46, background: "#7d858c" }} />)}
</div>;
const Refill: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const SX = 1300, SY = 380, SS = 1.4;
  const src: { el: React.ReactNode; l: string; x: number; y: number; ox: number; oy: number }[] = [
    { el: <Gen s={0.55} />, l: "GENERATOR", x: 180, y: 170, ox: 380, oy: 250 },
    { el: <Truck />, l: "YOUR VEHICLE", x: 150, y: 470, ox: 470, oy: 560 },
    { el: <MiniPanel />, l: "SOLAR PANEL", x: 170, y: 760, ox: 440, oy: 830 }];
  return <Oak>
    <Lbl size={44} col={CREAM} style={{ position: "absolute", left: 180, top: 60 }}>GRID DOWN · ONLY 3 WAYS TO REFILL</Lbl>
    <div style={{ position: "absolute", left: SX, top: SY }}><Station s={SS} /></div>
    {src.map((s, i) => { const at = M(m, i, 10 + i * 50), t = k(f, at, 18);
      const px = SX + (24 + i * 44 + 15) * SS, py = SY + 150 * SS, L = Math.hypot(px - s.ox, py - s.oy), ang = Math.atan2(py - s.oy, px - s.ox) * 180 / Math.PI;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: s.x, top: s.y, opacity: cl(t * 2) }}>{s.el}<Lbl size={28} col={CREAM} style={{ marginTop: 10, background: "rgba(24,26,30,.8)", padding: "2px 14px", borderRadius: 4, display: "inline-block" }}>{s.l}</Lbl></div>
        <div style={{ position: "absolute", left: s.ox, top: s.oy - 8, width: L * t, height: 16, background: "linear-gradient(#3a3a3a,#0e0e0e)", borderRadius: 8, transform: `rotate(${ang}deg)`, transformOrigin: "0 50%" }} />
        {t > 0.98 && <div style={{ position: "absolute", left: px - 15, top: py - 22, width: 30, height: 44, background: "linear-gradient(#f2c230,#b8901a)", borderRadius: 5, boxShadow: "0 0 0 3px #1a1a1a" }} />}
      </React.Fragment>; })}
  </Oak>;
};

// ================= sunarc (172): el sol bajo de invierno cruza en arco y el contador de Wh sube; panel con patas y nieve
const SunArc: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const t = io(f / dur), ang = Math.PI * (1 - t);
  const pts = Array.from({ length: 41 }).map((_, i) => `${i * 2.5}% ${i % 2 ? 30 + ((i * 37) % 40) : 100}%`).join(",");
  return <AbsoluteFill style={{ background: "linear-gradient(#8fa8bf, #dfe6ec 70%, #f5f7f9 70%)" }}>
    <div style={{ position: "absolute", left: 960 + Math.cos(ang) * 700 - 60, top: 700 - Math.sin(ang) * 300 - 60, width: 120, height: 120, borderRadius: "50%", background: "#ffd86a", boxShadow: "0 0 0 18px rgba(255,216,106,.35)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 690, height: 70, background: "#2f3d33", clipPath: `polygon(0 100%, ${pts}, 100% 100%)` }} />
    <div style={{ position: "absolute", left: 1460, top: 668, width: 120, height: 90, background: "#8a2b22", clipPath: "polygon(0 35%,50% 0,100% 35%,100% 100%,0 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, height: 10, background: "repeating-linear-gradient(90deg,#7a5a3c 0 14px, transparent 14px 120px)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 828, height: 8, background: "#8a6a4a" }} />
    {[760, 1040].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 790, width: 12, height: 150, background: "#6d757b" }} />)}
    <div style={{ position: "absolute", left: 700, top: 620, width: 440, height: 220, background: "repeating-linear-gradient(90deg,#1d3557 0 68px,#9fb4c8 68px 72px)", transform: "skewX(-18deg)", border: "8px solid #c9ced3" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent 0 50px, #9fb4c8 50px 53px)" }} />
      <div style={{ position: "absolute", left: -8, right: -8, top: -14, height: 14, background: "#fff", borderRadius: 7 }} /></div>
    <div style={{ position: "absolute", left: 1130, top: 880, width: 200, height: 10, background: "#1a1a1a", borderRadius: 5 }} />
    <div style={{ position: "absolute", left: 1320, top: 800 }}><Station s={0.6} /></div>
    <div style={{ position: "absolute", left: 120, top: 110, background: CREAM, padding: "16px 34px", boxShadow: "6px 10px 0 rgba(0,0,0,.2)" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: INK, lineHeight: 1 }}>{fmt(t * 700)} Wh</div>
      <Lbl size={30} col="#3d4a57" style={{ marginTop: 10 }}>400 W PANEL · CLEAR DECEMBER DAY · BY SUNDOWN</Lbl></div>
  </AbsoluteFill>;
};

// ================= lock32 (191): el termómetro baja a 32°F y un candado se cierra sobre la batería
const Lock32: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const deg = Math.round(interpolate(f, [0, dur * 0.6], [45, 32], CL)), lk = k(f, dur * 0.6, 8);
  const TH = 640, y = (d: number) => TH - 30 - (d / 100) * (TH - 80);
  return <Concrete tone="#9aa3a8">
    <div style={{ position: "absolute", left: 240, top: 170, width: 110, height: TH, background: "#fafafa", borderRadius: 55, border: "6px solid #8a9095" }}>
      <div style={{ position: "absolute", left: 38, width: 22, top: y(deg), bottom: 50, background: deg <= 35 ? "#2f74ad" : GN, borderRadius: 11 }} />
      <div style={{ position: "absolute", left: 22, bottom: 14, width: 54, height: 54, borderRadius: "50%", background: deg <= 35 ? "#2f74ad" : GN }} />
      {[0, 20, 32, 50, 80, 100].map((d) => <div key={d} style={{ position: "absolute", left: 104, top: y(d) - 2, width: d === 32 ? 60 : 30, height: d === 32 ? 6 : 4, background: d === 32 ? "#2f74ad" : "#444" }}>
        <span style={{ position: "absolute", left: d === 32 ? 70 : 40, top: -18, fontFamily: SANS, fontWeight: 800, fontSize: d === 32 ? 34 : 26, color: d === 32 ? "#1f4f8f" : INK, whiteSpace: "nowrap" }}>{d}°</span></div>)}
    </div>
    <div style={{ position: "absolute", left: 560, top: 180, fontFamily: SERIF, fontWeight: 900, fontSize: 140, color: INK }}>{deg}°F</div>
    <div style={{ position: "absolute", left: 1000, top: 400 }}><Station s={1.4} lit={0.2} /></div>
    <div style={{ position: "absolute", left: 1150, top: 300, opacity: lk, transform: `translateY(${(1 - lk) * -120}px)` }}>
      <div style={{ width: 110, height: 100, border: "22px solid #9aa1a6", borderBottom: "none", borderRadius: "60px 60px 0 0", marginLeft: 25, boxSizing: "border-box" }} />
      <div style={{ width: 160, height: 130, background: "linear-gradient(135deg,#e2b54a,#a8791d)", borderRadius: 12, position: "relative" }}><div style={{ position: "absolute", left: 66, top: 40, width: 28, height: 50, borderRadius: "14px 14px 4px 4px", background: "#3a2a10" }} /></div></div>
    <Lbl size={44} col={CREAM} style={{ position: "absolute", left: 1000, top: 790, opacity: lk, background: "rgba(29,36,48,.88)", padding: "10px 24px", borderRadius: 6 }}>LITHIUM WON'T CHARGE BELOW 32°F</Lbl>
  </Concrete>;
};

// ================= furnaceparts (215): la caldera de gas con persiana y mirilla; cada parte sale en su palabra como cajón
const Drawers: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const parts = ["IGNITER", "CONTROL BOARD", "INDUCER FAN", "BLOWER"];
  return <Concrete tone="#85817a">
    <Lbl size={54} col={CREAM} style={{ position: "absolute", left: 120, top: 60, background: "rgba(29,36,48,.88)", padding: "10px 28px", borderRadius: 6 }}>A GAS FURNACE STILL NEEDS ELECTRICITY</Lbl>
    <div style={{ position: "absolute", left: 220, top: 190, width: 560, height: 830, background: "linear-gradient(90deg,#c9cdd1,#e6e9eb 40%,#a9aeb3)", borderRadius: 8, boxShadow: "10px 0 0 rgba(0,0,0,.2)" }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 30, height: 150, background: "repeating-linear-gradient(0deg,#8b9196 0 6px,#d9dcde 6px 18px)", borderRadius: 4 }} />
      <div style={{ position: "absolute", left: 230, top: 196, width: 100, height: 60, background: "radial-gradient(ellipse at 50% 80%, #7fc4ff 0 22%, #2a5fa8 40%, #111 70%)", border: "6px solid #6f767c", borderRadius: 6 }} />
      <div style={{ position: "absolute", left: 40, top: 200, width: 150, height: 50, background: "#f5f1e4", border: "2px solid #999", fontFamily: SANS, fontWeight: 800, fontSize: 16, color: "#555", padding: 6, boxSizing: "border-box" }}>80% AFUE · GAS</div>
      {parts.map((p, i) => { const t = k(f, M(m, i, 8 + i * 40), 14);
        return <div key={i} style={{ position: "absolute", left: 30, top: 290 + i * 128, width: 500, height: 112, background: "linear-gradient(#eef0f1,#d3d7da)", border: "4px solid #8b9196", borderRadius: 6, transform: `translateX(${t * 560}px)`, boxShadow: `${t * 14}px 10px 0 rgba(0,0,0,.25)`, display: "flex", alignItems: "center", paddingLeft: 30, boxSizing: "border-box" }}>
          <div style={{ width: 70, height: 16, background: "#8b9196", borderRadius: 8, marginRight: 26, flexShrink: 0 }} /><Lbl size={40} style={{ opacity: t, whiteSpace: "nowrap" }}>{p}</Lbl></div>; })}
    </div>
    <div style={{ position: "absolute", left: 120, top: 640, width: 100, height: 22, background: "linear-gradient(#3b3b3b,#111)" }} />
    <div style={{ position: "absolute", left: 132, top: 610, width: 30, height: 80, background: YEL, borderRadius: 6 }} />
    <div style={{ position: "absolute", left: 1400, top: 280, width: 120, height: 180, background: "#ece6d8", borderRadius: 10, border: "4px solid #b9b3a5" }}>
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 30, top: 24 + i * 76, width: 60, height: 58, background: "#f8f4ea", borderRadius: 8, border: "2px solid #c9c2b2" }} />)}</div>
    <div style={{ position: "absolute", left: 1456, top: 340, width: 10, height: 620, background: "#1a1a1a" }} />
    <Lbl size={30} col={CREAM} style={{ position: "absolute", left: 1350, top: 220 }}>120 V OUTLET</Lbl>
  </Concrete>;
};

// ================= sine (219): la onda dibujada con cuentas (puntos DOM): pura vs escalonada
const Sine: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const n = 90;
  return <AbsoluteFill style={{ background: "#0f1a14" }}>
    <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(120,255,170,.12) 0 2px, transparent 2px 90px), repeating-linear-gradient(90deg, rgba(120,255,170,.12) 0 2px, transparent 2px 90px)" }} />
    {Array.from({ length: n }).map((_, i) => { const x = 160 + i * 18, ph = i / 9 + f / 10; const vis = i < (f / dur) * n * 1.8;
      const y1 = 330 - Math.sin(ph) * 150, y2 = 760 - Math.sign(Math.sin(ph)) * (Math.abs(Math.sin(ph)) > 0.5 ? 150 : 70);
      return vis ? <React.Fragment key={i}><div style={{ position: "absolute", left: x, top: y1, width: 12, height: 12, borderRadius: 6, background: "#7dffb0" }} /><div style={{ position: "absolute", left: x, top: y2, width: 12, height: 12, borderRadius: 6, background: "#ff8a6a" }} /></React.Fragment> : null; })}
    <Lbl size={40} col="#7dffb0" style={{ position: "absolute", left: 160, top: 100 }}>PURE SINE WAVE ✓</Lbl>
    <Lbl size={40} col="#ff8a6a" style={{ position: "absolute", left: 160, top: 960 }}>CHOPPY POWER ✗ (FURNACE BOARDS HATE IT)</Lbl>
  </AbsoluteFill>;
};

// ================= backfeedline (235): la corriente sale por el medidor de la casa, sube al transformador del poste y al liniero
const Backfeed: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const t = io((f - 4) / (dur * 0.7)), hv = k(f, M(m, 0, dur * 0.7), 8);
  const pts = [[575, 690], [575, 540], [1470, 286]];
  const seg = pts.slice(1).map((p, i) => [pts[i], p]); const tot = seg.length;
  return <AbsoluteFill style={{ background: "linear-gradient(#9fb1c3, #dde4ea 75%, #f4f6f8 75%)" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 286, height: 3, background: "#333" }} />
    <div style={{ position: "absolute", left: 1400, right: 0, top: 230, height: 3, background: "#333" }} />
    <div style={{ position: "absolute", left: 60, top: 400, width: 600, height: 150, background: "repeating-linear-gradient(0deg,#4a3a30 0 14px,#3b2e26 14px 17px)", clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />
    <div style={{ position: "absolute", left: 90, top: 550, width: 540, height: 260, background: "repeating-linear-gradient(0deg,#e3dccb 0 22px,#c4bba6 22px 25px)" }}>
      <div style={{ position: "absolute", left: 50, top: 50, width: 130, height: 120, background: "linear-gradient(135deg,#a9c6de,#6f93b3)", border: "10px solid #fff" }}>
        <div style={{ position: "absolute", left: 55, top: 0, bottom: 0, width: 6, background: "#fff" }} /><div style={{ position: "absolute", top: 50, left: 0, right: 0, height: 6, background: "#fff" }} /></div>
      <div style={{ position: "absolute", left: 260, top: 80, width: 100, height: 180, background: "#6b4a32", border: "6px solid #fff" }} /></div>
    <div style={{ position: "absolute", left: 540, top: 650, width: 70, height: 104, background: "linear-gradient(90deg,#8d959b,#c9ced3,#7d858c)", borderRadius: 8 }}>
      <div style={{ position: "absolute", left: 4, top: 10, width: 62, height: 62, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,.95) 0 10%, #c9d8e2 26%, #8a9aa6 72%)", border: "3px solid #6d757b" }} /></div>
    <div style={{ position: "absolute", left: 1490, top: 150, width: 36, height: 670, background: "linear-gradient(90deg,#5a3c26,#8a6040 50%,#5a3c26)" }} />
    <div style={{ position: "absolute", left: 1380, top: 210, width: 260, height: 22, background: "linear-gradient(#8a6040,#5a3c26)" }} />
    {[1400, 1500, 1610].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 186, width: 18, height: 26, background: "linear-gradient(90deg,#9db8a6,#e1efe6,#8aa694)", borderRadius: 4 }} />)}
    <div style={{ position: "absolute", left: 1430, top: 250, width: 76, height: 130, background: "linear-gradient(90deg,#6d757b,#d2d7db 40%,#8d959b)", borderRadius: "16px 16px 8px 8px", boxShadow: hv > 0 ? `0 0 0 ${14 * hv}px rgba(255,90,40,.35)` : "none" }}>
      <div style={{ position: "absolute", left: 30, top: -20, width: 16, height: 24, background: "#c9d8cf", borderRadius: 4 }} /></div>
    <div style={{ position: "absolute", left: 1530, top: 430 }}>
      <div style={{ width: 52, height: 28, background: YEL, borderRadius: "26px 26px 4px 4px", marginLeft: 2 }} />
      <div style={{ width: 34, height: 30, background: "#d8a888", borderRadius: "0 0 14px 14px", marginLeft: 10 }} />
      <div style={{ width: 56, height: 96, background: "#2e4a73", borderRadius: 10 }} />
      <div style={{ position: "absolute", left: -40, top: 66, width: 60, height: 16, background: "#2e4a73", borderRadius: 8, transform: "rotate(-24deg)" }} />
      <div style={{ position: "absolute", left: -34, top: 94, width: 90, height: 8, background: "#5a3c1a" }} />
      <div style={{ display: "flex", gap: 6 }}><div style={{ width: 22, height: 90, background: "#3b3b3b", borderRadius: 6 }} /><div style={{ width: 22, height: 90, background: "#3b3b3b", borderRadius: 6, transform: "rotate(-12deg)" }} /></div>
    </div>
    <Lbl size={26} col={CREAM} style={{ position: "absolute", left: 1610, top: 470, background: "rgba(29,36,48,.88)", padding: "4px 12px", borderRadius: 4 }}>LINEMAN</Lbl>
    {seg.map(([a, b], i) => { const p = cl(t * tot - i), L = Math.hypot(b[0] - a[0], b[1] - a[1]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
      return <div key={i} style={{ position: "absolute", left: a[0], top: a[1] - 6, width: L * p, height: 12, background: GN, transform: `rotate(${ang}deg)`, transformOrigin: "0 50%", borderRadius: 6 }} />; })}
    <Lbl size={36} style={{ position: "absolute", left: 100, top: 80 }}>BACKFEEDING · NO INTERLOCK</Lbl>
    <Lbl size={78} col="#9b1d14" style={{ position: "absolute", left: 100, top: 150, fontFamily: SERIF, opacity: hv, transform: `scale(${0.7 + 0.3 * hv})`, transformOrigin: "0 50%" }}>THOUSANDS OF VOLTS</Lbl>
    <Lbl size={36} style={{ position: "absolute", left: 100, top: 260, opacity: hv }}>ON THE LINE A LINEMAN IS HOLDING</Lbl>
  </AbsoluteFill>;
};

// ================= sequence (240): el tablero con la placa del interlock de acero; las palancas en orden, la lista se tilda al costado
const Interlock: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const steps = ["GENERATOR ON ITS CORD", "INTERLOCK SLID", "MAIN BREAKER OFF", "GENERATOR BREAKER ON", "FURNACE BREAKER ON"];
  const mainOff = k(f, M(m, 1, 50), 8), sl = k(f, M(m, 1, 50) + 8, 12), genOn = k(f, M(m, 3, 130), 8), furn = k(f, M(m, 4, 170), 8);
  const Br: React.FC<{ y: number; on: number; lab: string; big?: boolean }> = ({ y, on, lab, big }) => <div style={{ position: "absolute", left: 90, top: y, width: big ? 300 : 260, height: big ? 140 : 76, background: "linear-gradient(#2b2b2b,#141414)", borderRadius: 6 }}>
    <div style={{ position: "absolute", top: "50%", marginTop: big ? -26 : -18, left: 30 + on * (big ? 150 : 120), width: big ? 90 : 76, height: big ? 52 : 36, background: "linear-gradient(#f1f1f1,#bdbdbd)", borderRadius: 6 }} />
    <div style={{ position: "absolute", right: big ? -170 : -150, top: "50%", marginTop: -17, fontFamily: SANS, fontWeight: 800, fontSize: big ? 30 : 24, color: INK, whiteSpace: "nowrap" }}>{lab} · {on > 0.5 ? "ON" : "OFF"}</div></div>;
  return <Concrete tone="#8a867f">
    <div style={{ position: "absolute", left: 200, top: 80, width: 760, height: 920, background: "#7d858b", borderRadius: 10, boxShadow: "10px 12px 0 rgba(0,0,0,.25)" }}>
      <div style={{ position: "absolute", inset: 22, background: `${BRUSH}, linear-gradient(135deg,#dfe3e6,#b9bfc4)`, borderRadius: 6 }}>
        {[[18, 18], [700, 18], [18, 858], [700, 858]].map(([x, y], i) => <Screw key={i} x={x} y={y} r={10} rot={i * 50} />)}
        <Br y={60} on={1 - mainOff} lab="MAIN 200 A" big />
        <Br y={250} on={genOn} lab="GENERATOR 30 A" big />
        <div style={{ position: "absolute", left: 230, top: 40 + (1 - sl) * 190, width: 120, height: 190, background: `${BRUSH}, linear-gradient(90deg,#8d959b,#e9edf0 40%,#a3abb2)`, border: "4px solid #5d666e", borderRadius: 6, boxShadow: "4px 6px 0 rgba(0,0,0,.3)" }}>
          <div style={{ position: "absolute", left: 50, top: 30, width: 16, height: 120, borderRadius: 8, background: "#4a5157" }} />
          <Screw x={30} y={170} r={9} /><Screw x={90} y={170} r={9} />
          <div style={{ position: "absolute", left: -6, right: -6, top: -40, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 20, color: GN, letterSpacing: 2 }}>INTERLOCK</div></div>
        {["KITCHEN", "FURNACE", "FRIDGE", "LIGHTS"].map((l, i) => <Br key={l} y={470 + i * 96} on={l === "FURNACE" ? furn : 0} lab={l} />)}
      </div>
    </div>
    <div style={{ position: "absolute", left: 1080, top: 150 }}>
      {steps.map((s, i) => { const on = f >= M(m, i, 10 + i * 40);
        return <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, height: 150, opacity: on ? 1 : 0.4 }}>
          <div style={{ width: 70, height: 70, borderRadius: 10, background: on ? ST : "rgba(29,36,48,.35)", color: "#fff", fontFamily: SERIF, fontWeight: 900, fontSize: 46, display: "flex", alignItems: "center", justifyContent: "center" }}>{on ? "✓" : i + 1}</div>
          <Lbl size={40} col={on ? CREAM : "#e9e4d8"} style={{ background: on ? "rgba(29,36,48,.88)" : "transparent", padding: "8px 18px", borderRadius: 6, whiteSpace: "nowrap" }}>{s}</Lbl></div>; })}
    </div>
  </Concrete>;
};

// ================= heatjob (246): «HEAT IS THE JOB» con marcador sobre el filtro plisado de la caldera
const HeatJob: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#c8a979" }}>
    <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, rgba(0,0,0,.05) 0 10px, transparent 10px 20px)" }} />
    <div style={{ position: "absolute", left: 240, top: 230, width: 1440, height: 620, border: "28px solid #e8e2d4", background: "repeating-linear-gradient(90deg,#f4f1e8 0 30px,#e3dccb 30px 34px)", boxShadow: "8px 12px 0 rgba(0,0,0,.2)" }} />
    <Lbl size={26} col="#7a6a50" style={{ position: "absolute", left: 300, top: 270 }}>16 × 25 × 1 · AIR FLOW →</Lbl>
    <Hand text="HEAT IS THE JOB." at={2} f={f} len={22} size={170} col={GN} style={{ position: "absolute", left: 330, top: 420 }} />
  </AbsoluteFill>;
};

// ================= decibels (258): el decibelímetro de aguja en caja de baquelita; escala con cosas de la casa en una tarjeta
const Decibel: React.FC<P> = () => {
  const f = useCurrentFrame(); const v = interpolate(f, [6, 40], [30, 58], CL) + Math.sin(f / 3) * 0.4;
  const marks: [number, string][] = [[40, "fridge hum"], [57, "inverter gen @ 23 ft"], [60, "conversation"], [75, "vacuum"], [90, "open-frame gen, up close"]];
  const R = 490, cx = 490, cy = 490, th = (d: number) => 180 - ((d - 30) / 70) * 180;
  return <Oak>
    <div style={{ position: "absolute", left: 120, top: 150, width: 1080, height: 700, background: "linear-gradient(#2a2a2a,#121212)", borderRadius: 40, boxShadow: "10px 14px 0 rgba(0,0,0,.35)" }}>
      <div style={{ position: "absolute", left: 50, top: 50, width: 980, height: 490, borderRadius: "490px 490px 0 0", background: CREAM, overflow: "hidden" }}>
        {Array.from({ length: 15 }).map((_, i) => { const d = 30 + i * 5, maj = d % 10 === 0, L = maj ? 46 : 26;
          return <div key={d} style={{ position: "absolute", left: cx, top: cy - (maj ? 3 : 2), width: L, height: maj ? 6 : 4, background: INK, transformOrigin: "0 50%", transform: `rotate(${-th(d)}deg) translateX(${R - L - 10}px)` }} />; })}
        {[30, 40, 50, 60, 70, 80, 90, 100].map((d) => { const a = th(d) * Math.PI / 180, r = R - 100;
          return <div key={d} style={{ position: "absolute", left: cx + Math.cos(a) * r, top: cy - Math.sin(a) * r, transform: "translate(-50%,-50%)", fontFamily: SERIF, fontWeight: 900, fontSize: 34, color: INK }}>{d}</div>; })}
        {(() => { const a = th(57); return <div style={{ position: "absolute", left: cx, top: cy - 9, width: 60, height: 18, background: GN, transformOrigin: "0 50%", transform: `rotate(${-a}deg) translateX(${R - 72}px)`, borderRadius: 4 }} />; })()}
        <div style={{ position: "absolute", left: cx - 6, top: cy - 430, width: 12, height: 430, background: GN, transformOrigin: "50% 100%", transform: `rotate(${90 - th(v)}deg)`, borderRadius: 6 }} />
        <div style={{ position: "absolute", left: cx - 40, top: cy - 40, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(#666,#111)" }} />
      </div>
      <div style={{ position: "absolute", left: 380, top: 570, width: 320, height: 100, background: "#2d3a2c", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontWeight: 900, fontSize: 70, color: "#bfe8b0" }}>{Math.round(v)} dB</div>
      <Screw x={60} y={640} r={12} /><Screw x={1020} y={640} r={12} rot={70} />
    </div>
    <Paper x={1270} y={170} w={560} h={660} rot={1.5}>
      <div style={{ padding: "34px 34px" }}><Lbl size={26} col="#7a6a50">HOW LOUD IS IT?</Lbl>
        {marks.map(([d, l], i) => <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 26, background: i === 1 ? "rgba(242,194,48,.45)" : "none", padding: "4px 8px" }}>
          <div style={{ width: 90, fontFamily: SERIF, fontWeight: 900, fontSize: 48, color: i === 1 ? GN : INK }}>{d}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 36, color: INK, whiteSpace: "nowrap" }}>{l}</div></div>)}
      </div>
    </Paper>
  </Oak>;
};

// ================= hourbook (279): la planilla de horas del generador, renglonada; se anotan los services
const HourBook: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const rows = [["5 h", "FIRST OIL CHANGE", "11/04"], ["50 h", "oil change", "01/12"], ["100 h", "oil + spark plug check", "03/02"]];
  return <Oak>
    <Paper x={260} y={90} w={1400} h={900} rot={1} e={k(f, 0)} bg="#f6f0de">
      <div style={{ padding: "50px 70px" }}>
        <Lbl size={40} col="#7a6a50">GENERATOR HOUR LOG · 3,000 W</Lbl>
        <div style={{ display: "flex", marginTop: 30, borderBottom: `4px solid ${INK}`, paddingBottom: 8, fontFamily: SANS, fontWeight: 800, fontSize: 28, color: INK, letterSpacing: 2 }}>
          <div style={{ width: 240 }}>HOURS</div><div style={{ flex: 1 }}>SERVICE</div><div style={{ width: 220 }}>DATE</div></div>
        {rows.map(([h, t, d], i) => { const at = M(m, i, 8 + i * 40);
          return <div key={i} style={{ display: "flex", alignItems: "center", height: 140, borderBottom: "2px solid rgba(31,79,143,.3)" }}>
            <div style={{ width: 240 }}><Hand text={h} at={at} f={f} size={72} col="#1f4f8f" /></div>
            <div style={{ flex: 1 }}><Hand text={t} at={at + 6} f={f} size={62} /></div>
            <div style={{ width: 220 }}><Hand text={d} at={at + 12} f={f} size={56} col="#555" /></div></div>; })}
        {[0, 1].map((i) => <div key={i} style={{ height: 100, borderBottom: "2px solid rgba(31,79,143,.3)" }} />)}
        <Hand text="(check your manual)" at={M(m, 3, 150)} f={f} size={46} col="#7a6a50" style={{ marginTop: 30 }} />
      </div>
    </Paper>
  </Oak>;
};

// ================= storeband (288): el indicador de carga con la franja 50-80 % y el almanaque «cada 3 meses»
const StoreBand: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const b = k(f, M(m, 0, 10), 16), cal = k(f, M(m, 1, 100), 14);
  return <Oak>
    <div style={{ position: "absolute", left: 210, top: 210, width: 1500, height: 170, background: "linear-gradient(#3a444d,#232a30)", borderRadius: 24, padding: 16, boxSizing: "border-box", boxShadow: "0 10px 0 rgba(0,0,0,.3)" }}>
      <div style={{ width: "65%", height: "100%", background: `linear-gradient(90deg, ${ST}, #6fd1b8)`, borderRadius: 14 }} />
      <div style={{ position: "absolute", left: 16 + 0.5 * 1468, top: -30, width: 0.3 * 1468 * b, height: 230, border: `8px solid ${YEL}`, borderRadius: 14, boxSizing: "border-box" }} />
    </div>
    <Lbl size={52} col={CREAM} style={{ position: "absolute", left: 210 + 0.5 * 1500, top: 430, opacity: b, background: "rgba(29,36,48,.85)", padding: "6px 22px", borderRadius: 6 }}>STORE AT 50–80 %</Lbl>
    <div style={{ position: "absolute", left: 0, right: 0, top: 580, display: "flex", justifyContent: "center", gap: 40, opacity: cal }}>{["JAN", "APR", "JUL", "OCT"].map((s, i) => <div key={i} style={{ width: 280, height: 300, background: "#fff", border: "4px solid #ccc", borderTop: `56px solid ${GN}`, boxShadow: "6px 10px 0 rgba(0,0,0,.25)", position: "relative" }}>
      <div style={{ position: "absolute", top: -48, left: 0, right: 0, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 36, color: "#fff", letterSpacing: 4 }}>{s}</div>
      <Hand text="top up ✓" at={M(m, 1, 100) + i * 8} f={f} size={52} col="#1f4f8f" style={{ padding: "80px 0 0 34px" }} /></div>)}</div>
  </Oak>;
};

// ================= SERIE shelf:gen|station — la góndola de la ferretería (pared de fenólico perforado); el cartel de precio voltea
const Shelf: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const g = a[0] === "gen"; const t = k(f, 10, 14);
  return <AbsoluteFill style={{ background: "radial-gradient(circle, #6b5a45 0 4px, transparent 5px) 0 0 / 44px 44px, linear-gradient(#cdb995,#b9a47e)" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 60, background: `${BRUSH}, linear-gradient(#e9edf0,#9aa3ab)`, borderBottom: "8px solid #5d666e" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 708, bottom: 0, background: "linear-gradient(#3b3b3b,#222)" }} />
    <div style={{ position: "absolute", left: g ? 960 - 216 : 960 - 210, top: g ? 316 : 330 }}>{g ? <Gen s={1.2} /> : <Station s={1.4} />}</div>
    <div style={{ position: "absolute", left: 640, top: 700, width: 640, height: 210, perspective: 800 }}>
      <div style={{ width: "100%", height: "100%", background: YEL, transformOrigin: "50% 0", transform: `rotateX(${(1 - t) * 90}deg)`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", boxShadow: "0 8px 0 rgba(0,0,0,.3)" }}>
        <Lbl size={30}>{g ? "3,000 W INVERTER GENERATOR" : "~1,000 Wh LiFePO4 STATION"}</Lbl>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: INK }}>{g ? "$800–1,500" : "$400–800"}</div>
      </div></div>
    <Lbl size={28} col="#e9e4d8" style={{ position: "absolute", left: 0, right: 0, top: 950, textAlign: "center" }}>PRICE RANGE WHERE I SHOP</Lbl>
  </AbsoluteFill>;
};

// ================= pump (307): las ruedas numéricas del surtidor: galones y dólares por día
const Pump: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const t = io(f / (dur * 0.6));
  const Wheel = ({ v, l, c }: { v: string; l: string; c: string }) => <div style={{ marginBottom: 40 }}><Lbl size={30} col="#ccc">{l}</Lbl><div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 150, color: c, background: "#111", padding: "0 40px", borderRadius: 8, letterSpacing: 10, textAlign: "right", width: 760, boxSizing: "border-box", boxShadow: "inset 0 0 0 6px #333" }}>{v}</div></div>;
  return <AbsoluteFill style={{ background: "linear-gradient(#8a2419,#6a1a12)" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 70, background: "repeating-linear-gradient(90deg,#f3ecdc 0 80px,#c0392b 80px 160px)" }} />
    <div style={{ position: "absolute", left: 460, top: 150, width: 1000, background: "linear-gradient(#333,#1f1f1f)", borderRadius: 20, padding: "50px 120px", boxSizing: "border-box", boxShadow: "10px 14px 0 rgba(0,0,0,.35)" }}>
      <Wheel v={(5 * t).toFixed(1)} l="GALLONS / DAY (LIGHT LOAD)" c="#7dffb0" />
      <Wheel v={"$" + (16.5 * t).toFixed(2)} l="PER DAY @ ~$3.30/GAL" c={YEL} />
      <Lbl size={40} col="#fff" style={{ opacity: k(f, dur * 0.65) }}>A WEEK OUT ≈ $105–125 IN GAS</Lbl>
    </div>
  </AbsoluteFill>;
};

// ================= SERIE plantbucket:1|2 y bucket — la usina (edificio + chimenea + torre) contra el balde galvanizado bajo la canilla
const Bucket: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const which = a[0] || "2"; const plant = which === "1"; const fill = plant ? 0.35 : 0.35 + 0.6 * k(f, 0, 40);
  return <Concrete>
    <Lbl size={66} col={CREAM} style={{ position: "absolute", left: 160, top: 80, fontFamily: SERIF, background: "rgba(29,36,48,.88)", padding: "8px 30px", borderRadius: 6 }}>{plant ? "THE GENERATOR MAKES POWER." : "THE BATTERY HOLDS IT."}</Lbl>
    <div style={{ position: "absolute", left: 160, top: 250, width: 760, height: 640, opacity: plant ? 1 : 0.4, transform: `scale(${plant ? 1 + 0.04 * k(f, 0) : 0.92})`, transformOrigin: "50% 100%" }}>
      {Array.from({ length: 4 }).map((_, i) => { const t = ((f + i * 22) % 90) / 90; return <div key={i} style={{ position: "absolute", left: 470 + t * 120, top: 20 - t * 160, width: 90 + t * 60, height: 90 + t * 60, borderRadius: "50%", background: "#e9ecee", opacity: 0.9 * (1 - t) }} />; })}
      <div style={{ position: "absolute", left: 460, top: 60, width: 90, height: 380, background: "repeating-linear-gradient(0deg,#e5e5e5 0 56px,#c0392b 56px 112px)" }} />
      <div style={{ position: "absolute", left: 20, top: 200, width: 260, height: 240, background: "linear-gradient(90deg,#9ea5aa,#d5d9dc 45%,#8d959b)", clipPath: "polygon(12% 0, 88% 0, 76% 50%, 100% 100%, 0 100%, 24% 50%)" }} />
      <div style={{ position: "absolute", left: 220, top: 340, width: 520, height: 210, background: "repeating-linear-gradient(0deg,#9a4a35 0 26px,#c9b8a0 26px 29px)" }}>
        {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 30 + i * 80, top: 50, width: 46, height: 64, background: i % 2 ? "#f2d27a" : "#2a2a2a", border: "4px solid #e5ddd0" }} />)}</div>
      <Lbl size={40} col={CREAM} style={{ position: "absolute", left: 300, top: 580 }}>POWER PLANT</Lbl>
    </div>
    <div style={{ position: "absolute", left: 1120, top: 220, width: 560, height: 680, opacity: plant ? 0.4 : 1, transform: `scale(${!plant ? 1 + 0.04 * k(f, 0) : 0.92})`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", left: 230, top: 0, width: 160, height: 40, background: "linear-gradient(#f0cf78,#b8862b)", borderRadius: "10px 30px 10px 10px" }} />
      <div style={{ position: "absolute", left: 340, top: 30, width: 34, height: 60, background: "linear-gradient(90deg,#b8862b,#f0cf78)", borderRadius: "0 0 10px 10px" }} />
      {!plant && <div style={{ position: "absolute", left: 345, top: 90, width: 24, height: 170, background: "linear-gradient(90deg,#4f93c9,#9cd0f2,#4f93c9)", borderRadius: 12 }} />}
      <div style={{ position: "absolute", left: 80, top: 120, width: 420, height: 240, border: "8px solid #5d666e", borderBottom: "none", borderRadius: "210px 210px 0 0", boxSizing: "border-box" }} />
      <div style={{ position: "absolute", left: 80, top: 250, width: 420, height: 360, background: "repeating-linear-gradient(0deg, rgba(0,0,0,.1) 0 4px, transparent 4px 70px), linear-gradient(90deg,#7a8389,#e1e5e8 35%,#a9b1b7 65%,#6d757b)", clipPath: "polygon(0 0,100% 0,88% 100%,12% 100%)" }} />
      <div style={{ position: "absolute", left: 70, top: 226, width: 440, height: 56, borderRadius: "50%", background: "linear-gradient(#e9edf0,#9aa3ab)", padding: 10, boxSizing: "border-box" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: `radial-gradient(ellipse, ${fill > 0.6 ? "#4f93c9" : "#5d666e"} 0 ${Math.round(40 + fill * 55)}%, #4a5157 ${Math.round(42 + fill * 55)}%)` }} /></div>
      <Lbl size={40} col={CREAM} style={{ position: "absolute", left: 210, top: 630 }}>BUCKET</Lbl>
    </div>
  </Concrete>;
};

// ================= cycles (322): el cuentaciclos llega a 3.000 y la línea de capacidad baja a 80 %
const Cycles: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const t = io(f / (dur * 0.7)), cyc = Math.round(t * 3000), cap = 100 - 20 * t;
  return <AbsoluteFill style={{ background: "#141a20" }}>
    <div style={{ position: "absolute", left: 200, top: 180, fontFamily: "monospace", fontWeight: 900, fontSize: 200, color: "#7dffb0", background: "#000", padding: "0 40px", borderRadius: 10 }}>{String(cyc).padStart(4, "0")}</div>
    <Lbl size={36} col="#9aa" style={{ position: "absolute", left: 200, top: 440 }}>FULL CYCLES (LiFePO4)</Lbl>
    <div style={{ position: "absolute", left: 1100, top: 180, width: 220, height: 640, border: "10px solid #9aa3ab", borderRadius: 16, padding: 14 }}>
      <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, height: `${cap - 4}%`, background: ST, borderRadius: 8 }} /></div>
    <div style={{ position: "absolute", left: 1380, top: 400 }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: YEL, lineHeight: 1 }}>{Math.round(cap)}%</div>
      <Lbl size={34} col="#e9eef2" style={{ marginTop: 10 }}>CAPACITY LEFT</Lbl></div>
    <Lbl size={30} col="#9aa" style={{ position: "absolute", left: 200, top: 900, opacity: k(f, dur * 0.7) }}>≈ 8 YEARS OF DAILY USE · SOURCE: MAKER SPEC SHEETS</Lbl>
  </AbsoluteFill>;
};

// ================= letters (326): LiFePO4 punzonado letra por letra en una chapa de acero cepillado atornillada
const Punch: React.FC<P> = () => {
  const f = useCurrentFrame(); const L = "LiFePO4".split("");
  return <AbsoluteFill style={{ background: `${BRUSH}, linear-gradient(135deg,#5a6066,#3a3f44)` }}>
    <div style={{ position: "absolute", left: 260, top: 300, width: 1400, height: 460, background: `repeating-linear-gradient(90deg, rgba(255,255,255,.07) 0 2px, rgba(0,0,0,.05) 2px 5px), linear-gradient(135deg,#d6dade,#8e959b)`, borderRadius: 12, boxShadow: "0 12px 0 rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
      {[[34, 34], [1366, 34], [34, 426], [1366, 426]].map(([x, y], i) => <Screw key={i} x={x} y={y} r={18} rot={20 + i * 35} />)}
      {L.map((c, i) => { const at = 6 + i * 9, t = f >= at ? 1 : 0, hit = cl(1 - (f - at) / 5);
        return <div key={i} style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 210, color: "#5a6168", textShadow: "-3px -3px 0 rgba(0,0,0,.45), 3px 3px 0 rgba(255,255,255,.55)", opacity: t, transform: `scale(${1 + 0.15 * hit})` }}>{c}</div>; })}
    </div>
    <Lbl size={40} col="#e9eef2" style={{ position: "absolute", left: 260, top: 830 }}>LOOK FOR THESE LETTERS ON THE SPEC SHEET</Lbl>
  </AbsoluteFill>;
};

// ================= schedule (345): el reloj de 24 h de la cocina: generador mañana y tarde, estación de tarde y de noche
const Dial24: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const t = io(f / dur);
  const arcs = [[7, 10, GN], [10, 17, ST], [17, 20, GN], [20, 31, ST]];
  return <Oak>
    <div style={{ position: "absolute", left: 1000, top: 140, width: 800, height: 800, borderRadius: "50%", background: CREAM, border: "18px solid #3b3b3b", overflow: "hidden", boxShadow: "8px 12px 0 rgba(0,0,0,.3)" }}>
      {arcs.map(([a, b, c], i) => { const p = cl(t * 4 - i); return Array.from({ length: Math.round((+b - +a) * 4 * p) }).map((_, j) => { const h = +a + j / 4, ang = (h / 24) * 360;
        return <div key={i + "_" + j} style={{ position: "absolute", left: 400 - 8, top: 30, width: 16, height: 120, background: c as string, transformOrigin: "50% 370px", transform: `rotate(${ang}deg)` }} />; }); })}
      {[0, 6, 12, 18].map((h) => <div key={h} style={{ position: "absolute", left: 400 + Math.sin(h / 24 * 2 * Math.PI) * 220 - 40, top: 400 - Math.cos(h / 24 * 2 * Math.PI) * 220 - 30, fontFamily: SERIF, fontWeight: 900, fontSize: 50 }}>{h === 0 ? 24 : h}</div>)}
    </div>
    <Paper x={110} y={300} w={800} h={420} rot={-1.5}>
      <div style={{ padding: "40px 46px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}><div style={{ width: 44, height: 44, background: GN, borderRadius: 6 }} /><Lbl size={46} col={GN}>GENERATOR</Lbl></div>
        <Hand text="morning & evening, ~3 h" at={-99} f={f} size={50} style={{ marginLeft: 64, marginTop: 6 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 40 }}><div style={{ width: 44, height: 44, background: ST, borderRadius: 6 }} /><Lbl size={46} col={ST}>POWER STATION</Lbl></div>
        <Hand text="afternoon & overnight" at={-99} f={f} size={50} style={{ marginLeft: 64, marginTop: 6 }} />
      </div>
    </Paper>
  </Oak>;
};

// ================= counter (353): «FROM THE COUNTER» — la campanita de mostrador y lo que hay sobre el mostrador
const Bell: React.FC<{ ring: number }> = ({ ring }) => <div style={{ position: "relative", width: 300, height: 220, transform: `rotate(${ring}deg)`, transformOrigin: "50% 100%" }}>
  <div style={{ position: "absolute", left: 140, top: 0, width: 20, height: 34, background: CHROME, borderRadius: 4 }} />
  <div style={{ position: "absolute", left: 128, top: -18, width: 44, height: 26, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff, #9aa3ab 60%, #5d666e)" }} />
  <div style={{ position: "absolute", left: 20, top: 30, width: 260, height: 150, borderRadius: "130px 130px 14px 14px", background: "radial-gradient(circle at 34% 26%, #fff6d0 0 7%, #ecc967 20%, #b48d2c 58%, #6e5214 100%)" }} />
  <div style={{ position: "absolute", left: 0, top: 176, width: 300, height: 40, borderRadius: 20, background: "linear-gradient(#3a3a3a,#0e0e0e)" }} />
</div>;
const Counter: React.FC<P> = () => {
  const f = useCurrentFrame(); const ring = Math.sin(f * 1.6) * 5 * cl(1 - f / 20);
  return <AbsoluteFill style={{ background: "radial-gradient(circle, #6b5a45 0 4px, transparent 5px) 0 0 / 44px 44px, linear-gradient(#cdb995,#b9a47e)" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 690, height: 120, background: "linear-gradient(#a8784e,#8a6040)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 810, bottom: 0, background: "repeating-linear-gradient(90deg,#7a5236 0 160px,#6b4a32 160px 164px)" }} />
    <div style={{ position: "absolute", left: 460, top: 120, width: 1000, height: 220, background: CREAM, border: "10px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${Math.sin(f / 14) * 1.2}deg)`, boxShadow: "8px 12px 0 rgba(0,0,0,.3)" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: INK, whiteSpace: "nowrap" }}>FROM THE COUNTER</div></div>
    {[700, 1220].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 0, width: 6, height: 128, background: "#333" }} />)}
    <div style={{ position: "absolute", left: 810, top: 540 }}><Bell ring={ring} /></div>
    <div style={{ position: "absolute", left: 300, top: 600, width: 220, height: 150, background: "linear-gradient(90deg,#3a3a3a,#5a5a5a 50%,#2a2a2a)", borderRadius: 8 }}>
      <div style={{ position: "absolute", left: 20, right: 20, top: 16, bottom: 16, background: "repeating-linear-gradient(90deg,#f2c230 0 10px,#c79a1c 10px 13px)" }} /></div>
    <Lbl size={24} col={CREAM} style={{ position: "absolute", left: 330, top: 760 }}>12 AWG · 50 FT</Lbl>
    <div style={{ position: "absolute", left: 1300, top: 620, width: 260, height: 130, background: "linear-gradient(#d9b98a,#b8935e)", borderRadius: 4, boxShadow: "6px 6px 0 rgba(0,0,0,.25)" }}>
      <div style={{ margin: "24px 22px", padding: "10px 14px", background: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 28, color: GN, letterSpacing: 2 }}>BLADE FUSES</div></div>
    <div style={{ position: "absolute", left: 1600, top: 720, width: 200, height: 16, background: "linear-gradient(#f2c230,#b8901a)", borderRadius: 8, transform: "rotate(-8deg)" }} />
  </AbsoluteFill>;
};

// ================= SERIE checklist:0-5 — etiquetas de cartón ensartadas en un aro de acero
const REQ = ["LiFePO4 battery", "1,000+ Wh (2,000 if you can)", "1,500 W continuous · pure sine", "fast AC charging (2–3 h)", "expandable battery = plus"];
const KeyRing: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const n = +a[0];
  return <Oak>
    <Lbl size={54} col={CREAM} style={{ position: "absolute", left: 300, top: 120, fontFamily: SERIF }}>MY STATION CHECKLIST</Lbl>
    <div style={{ position: "absolute", left: 334, top: 250, width: 30, height: n ? 110 + (n - 1) * 140 : 0, borderRadius: 15, background: CHROME, boxShadow: "4px 6px 0 rgba(0,0,0,.3)" }} />
    {REQ.slice(0, n).map((r, i) => { const nw = i === n - 1, t = nw ? sp(f, 4) : 1;
      return <div key={i} style={{ position: "absolute", left: 300, top: 280 + i * 140, transform: `rotate(${(i % 2 ? 1 : -1) * t}deg) translateY(${(1 - t) * -80}px)`, opacity: cl(t * 3), transformOrigin: "50px 50%" }}>
        <div style={{ width: 1180, height: 108, background: "#f1e3c2", borderRadius: "54px 10px 10px 54px", display: "flex", alignItems: "center", paddingLeft: 110, boxShadow: "5px 8px 0 rgba(0,0,0,.3)", position: "relative", boxSizing: "border-box" }}>
          <div style={{ position: "absolute", left: 30, top: 34, width: 40, height: 40, borderRadius: "50%", background: OAK2, boxShadow: "inset 0 0 0 6px #c9b88f" }} />
          <div style={{ position: "absolute", left: 34, top: 30, width: 30, height: 48, borderRadius: 15, background: CHROME }} />
          <Hand text={`${i + 1}. ${r}`} at={nw ? 8 : -99} f={f} size={58} /></div></div>; })}
  </Oak>;
};

// ================= SERIE q:N — el turnero rojo de mostrador: sale el papelito con el número de pregunta
const Ticket: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const n = +a[0]; const t = k(f, 2, 16);
  return <AbsoluteFill style={{ background: "radial-gradient(circle, #6b5a45 0 4px, transparent 5px) 0 0 / 44px 44px, linear-gradient(#cdb995,#b9a47e)" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 900, bottom: 0, background: "linear-gradient(#a8784e,#7a5236)" }} />
    <div style={{ position: "absolute", left: 945, top: 400, width: 30, height: 500, background: CHROME }} />
    <div style={{ position: "absolute", left: 680, top: 90, width: 560, height: 360, background: "radial-gradient(circle at 35% 25%, #ef6a55, #c0392b 45%, #7a1c12)", borderRadius: "180px 180px 60px 60px", boxShadow: "8px 12px 0 rgba(0,0,0,.3)" }}>
      <div style={{ position: "absolute", left: 110, right: 110, top: 90, height: 120, background: CREAM, borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Lbl size={26} col={GN}>PLEASE</Lbl><Lbl size={40} col={INK}>TAKE A NUMBER</Lbl></div>
      <div style={{ position: "absolute", left: 160, right: 160, top: 290, height: 22, background: "#1a0a07", borderRadius: 11 }} />
    </div>
    <div style={{ position: "absolute", left: 790, top: 392, width: 340, height: 470 * t, overflow: "hidden", transform: "rotate(3deg)", transformOrigin: "50% 0" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 470, background: "#fff4d6", borderBottomRightRadius: 46, boxShadow: "inset -10px -10px 0 rgba(0,0,0,.06)", textAlign: "center", borderTop: "4px dashed #c9b88f" }}>
        <Lbl size={32} col="#9a6a2a" style={{ marginTop: 60 }}>QUESTION</Lbl><div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 240, color: INK, lineHeight: 1 }}>{n}</div></div></div>
  </AbsoluteFill>;
};

// ================= fuse (369): la toma de 12 V del tablero de la camioneta y el fusible de cuchilla de 15 A
const Fuse: React.FC<P> = () => {
  const f = useCurrentFrame(); const t = k(f, 4, 14);
  return <AbsoluteFill style={{ background: "repeating-linear-gradient(45deg, rgba(255,255,255,.025) 0 2px, transparent 2px 5px), linear-gradient(#2c2f33,#17191b)" }}>
    <div style={{ position: "absolute", left: 300, top: 250, width: 400, height: 400, borderRadius: "50%", background: "conic-gradient(#7d858c,#f2f4f5,#8d959b,#e1e5e8,#6d757b,#d0d5d9,#7d858c)", boxShadow: "8px 12px 0 rgba(0,0,0,.4)" }}>
      <div style={{ position: "absolute", inset: 60, borderRadius: "50%", background: "radial-gradient(#2a2a2a 0 30%, #0a0a0a 62%, #222 100%)" }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 60, height: 60, margin: -30, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #fff2c0, #c9a24a 55%, #6e5214)" }} />
        {[0, 1].map((i) => <div key={i} style={{ position: "absolute", [i ? "right" : "left"]: 20, top: "50%", marginTop: -40, width: 16, height: 80, background: "linear-gradient(90deg,#9aa3ab,#e9edf0,#7d858c)", borderRadius: 4 } as CSS} />)}
      </div></div>
    <div style={{ position: "absolute", left: 760, top: 320, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(#3a3a3a,#111)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 40, color: "#bbb" }}>12V</div>
    <div style={{ position: "absolute", left: 690, top: 390, width: 80, height: 14, background: "#111", borderRadius: 7 }} />
    <div style={{ position: "absolute", left: 1150, top: 200 + (1 - t) * 200, opacity: t }}>
      <div style={{ width: 300, height: 260, background: "linear-gradient(135deg, rgba(250,210,80,.95), rgba(220,160,20,.9))", borderRadius: 18, boxShadow: "inset 0 0 0 8px rgba(255,255,255,.25)" }}><div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 130, textAlign: "center", paddingTop: 50 }}>15</div></div>
      <div style={{ display: "flex", gap: 80, marginLeft: 70 }}><div style={{ width: 40, height: 170, background: CHROME }} /><div style={{ width: 40, height: 170, background: CHROME }} /></div></div>
    <Lbl size={44} col="#fff" style={{ position: "absolute", left: 300, top: 790 }}>12 V SOCKET · 10–15 A FUSE ≈ 120–180 W</Lbl>
  </AbsoluteFill>;
};

// ================= surge (396): la pinza amperométrica abrazando el cable: pico de arranque del compresor y se asienta
const Surge: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const a0 = M(m, 0, 20); const x = f - a0;
  const w = x < 0 ? 0 : x < 8 ? 1100 * (x / 8) : x < 30 ? 1100 - (x - 8) * 43 : 150 + Math.sin(f / 4) * 6;
  return <Oak>
    <div style={{ position: "absolute", left: 952, top: 0, width: 18, height: 300, background: "linear-gradient(90deg,#111,#3a3a3a,#111)" }} />
    <div style={{ position: "absolute", left: 780, top: 50, width: 360, height: 300, borderRadius: "50%", border: "46px solid #262626", boxSizing: "border-box", clipPath: "polygon(0 0, 44% 0, 50% 22%, 56% 0, 100% 0, 100% 100%, 0 100%)" }} />
    <div style={{ position: "absolute", left: 680, top: 300, width: 560, height: 560, background: "linear-gradient(#f2c230,#d9a514)", borderRadius: "60px 60px 80px 80px", boxShadow: "10px 14px 0 rgba(0,0,0,.3)" }}>
      <div style={{ position: "absolute", left: 50, right: 50, top: 40, height: 190, background: "#2d3a2c", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 30, boxShadow: "inset 0 0 0 8px #1b1b1b" }}>
        <div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 130, color: "#bfe8b0" }}>{Math.round(Math.max(0, w))}</div>
        <div style={{ position: "absolute", left: 24, top: 18, fontFamily: SANS, fontWeight: 800, fontSize: 26, color: "#bfe8b0" }}>WATTS</div></div>
      <div style={{ position: "absolute", left: 60, top: 270, width: 200, height: 200, borderRadius: "50%", background: "conic-gradient(#333 0 6deg, #1f1f1f 6deg 354deg, #333 354deg)", boxShadow: "0 0 0 10px #2a2a2a" }}>
        <div style={{ position: "absolute", left: 92, top: 10, width: 16, height: 90, background: "#f2c230", borderRadius: 8, transformOrigin: "50% 90px", transform: "rotate(40deg)" }} /></div>
      {[["#1a1a1a", 330], ["#c0392b", 430]].map(([c, xx]) => <div key={xx as number} style={{ position: "absolute", left: xx as number, top: 340, width: 70, height: 70, borderRadius: "50%", background: `radial-gradient(#000 0 30%, ${c} 34%)` }} />)}
    </div>
    <Lbl size={40} col={CREAM} style={{ position: "absolute", left: 0, right: 0, top: 920, textAlign: "center" }}>COMPRESSOR START: A 1-SECOND SURGE, THEN IT SETTLES</Lbl>
  </Oak>;
};

// ================= prize (413): «THE PRIZE» — el sobre se abre y la tarjeta sale de adentro del bolsillo
const Prize: React.FC<P> = () => {
  const f = useCurrentFrame(); const o = k(f, 6, 16), c = k(f, 18, 14);
  return <Oak>
    <div style={{ position: "absolute", left: 560, top: 440, width: 800, height: 460, perspective: 1000 }}>
      <div style={{ position: "absolute", inset: 0, background: "#b99c63", boxShadow: "8px 12px 0 rgba(0,0,0,.3)", zIndex: 1 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 0, borderLeft: "400px solid transparent", borderRight: "400px solid transparent", borderTop: "260px solid #c9ad72", transformOrigin: "50% 0", transform: `rotateX(${o * 180}deg)`, zIndex: o < 0.5 ? 5 : 2 }} />
      <div style={{ position: "absolute", left: 70, right: 70, top: 30 - c * 300, height: 380, zIndex: 3, background: CREAM, display: "flex", alignItems: "flex-start", justifyContent: "center", boxShadow: "0 -4px 0 rgba(0,0,0,.1)" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 86, color: INK, textAlign: "center", marginTop: 40, lineHeight: 1.05 }}>WHAT I'D<br />BUY</div></div>
      <div style={{ position: "absolute", inset: 0, background: "#d9c08a", zIndex: 4, clipPath: "polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)" }} />
    </div>
  </Oak>;
};

// ================= SERIE cart:1000:0-2 / cart:2500 — el ticket de la caja registradora sale y se suma
const BUY: Record<string, [string, number][]> = {
  "1000": [["3,000 W inverter generator", 800], ["2 five-gal cans + stabilizer", 50], ["heavy cord + chain", 100], ["2 battery CO detectors", 45]],
  "2500": [["3,000 W inverter generator", 800], ["2,000 Wh LiFePO4 station", 1200], ["inlet + interlock, permit (electrician)", 500]] };
const Register: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const key = a[0]; const step = a[1] === undefined ? 3 : +a[1]; const items = BUY[key];
  const show = key === "1000" ? (step === 0 ? 1 : step === 1 ? 3 : 4) : 3;
  const tot = items.slice(0, show).reduce((s, [, p]) => s + p, 0);
  return <Oak>
    <div style={{ position: "absolute", left: 560, top: 150, width: 800, background: "#fbfaf5", boxShadow: "6px 10px 0 rgba(0,0,0,.4)", fontFamily: "monospace", padding: "50px 54px", boxSizing: "border-box", clipPath: `inset(0 0 ${100 - 100 * k(f, 0, 18)}% 0)` }}>
      <div style={{ fontSize: 46, fontWeight: 900, textAlign: "center" }}>BUDGET · ${fmt(+key)}</div>
      <div style={{ borderTop: "3px dashed #999", margin: "24px 0" }} />
      {items.slice(0, show).map(([n, p], i) => { const nw = i >= (key === "1000" ? [0, 1, 3][step] ?? 0 : 0); const t = nw ? k(f, 8 + (i - (key === "1000" ? [0, 1, 3][step] : 0)) * 12, 8) : 1;
        return <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 20, fontSize: 36, fontWeight: 700, marginBottom: 26, opacity: t }}><span>{n}</span><span style={{ whiteSpace: "nowrap" }}>~${fmt(p)}</span></div>; })}
      <div style={{ borderTop: "3px dashed #999", margin: "24px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 56, fontWeight: 900 }}><span>TOTAL</span><span style={{ color: tot > +key ? GN : INK }}>~${fmt(tot)}</span></div>
      <div style={{ fontSize: 24, color: "#777", marginTop: 20 }}>RANGES WHERE I SHOP · YOURS WILL VARY</div>
    </div>
  </Oak>;
};

// ---------- dispatcher
export const CompC14a: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  const [c, ...a] = String(s.comp).split(":"); const m: number[] = s.m || [];
  const T: Record<string, React.FC<P>> = { ring: Ring, carousel: Susan, round: Round, win: Judge, map: CountyMap, exhaust: Exhaust, stat: Stencil, twenty: Tape20, hose: Hose, sticker: Sticker,
    fridgehours: Hourglass, drain750: Drain, fridgelist: FridgeList, napkin: Napkin, cans3: Cans, datetape: DateTape, refill3: Refill, sunarc: SunArc, lock32: Lock32, furnaceparts: Drawers,
    sine: Sine, backfeedline: Backfeed, sequence: Interlock, heatjob: HeatJob, decibels: Decibel, hourbook: HourBook, storeband: StoreBand, shelf: Shelf, pump: Pump, bucket: Bucket, plantbucket: Bucket,
    cycles: Cycles, letters: Punch, schedule: Dial24, counter: Counter, checklist: KeyRing, q: Ticket, fuse: Fuse, surge: Surge, prize: Prize, cart: Register };
  if (c === "final") return <Judge m={m} dur={dur} a={["final"]} />;
  if (c === "recap") return <Susan m={m} dur={dur} a={a} order pick={+a[0]} />;
  const X = T[c]; return X ? <X m={m} dur={dur} a={a} /> : <AbsoluteFill style={{ background: "#f0f" }} />;
};
