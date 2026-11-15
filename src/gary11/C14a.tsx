// gary14a · «Power Station or Generator?» — componentes propios, PURO CSS/DOM (sin SVG, sin blur grande, sin grano ni viñeta).
// Mundo: la pelea de 10 rounds sobre la mesada de roble de Gary (madera, papel, acero, cinta). Registro: D:/rtmp/gary14_COMPONENTES.md
// m = cuadros (relativos al plano) en que se dice cada palabra ancla; dur = cuadros del plano.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, FONTS } from "./Piezas";

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

const OAK = "#8a5a33", OAK2 = "#6e4526", STEEL = "#9aa3ab", STEEL2 = "#5d666e", ST = "#2f7d6d" /* station verde azulado */, GN = "#c0392b" /* generador rojo */, CREAM = "#f3ecdc", INK = "#1d2430", YEL = "#f2c230";

// ---------- base: la mesada de roble vista de arriba, con luz de ventana de invierno
const Oak: React.FC<{ children?: React.ReactNode; tone?: number }> = ({ children, tone = 0 }) => (
  <AbsoluteFill style={{ background: `repeating-linear-gradient(${92 + tone}deg, ${OAK} 0 38px, ${OAK2} 38px 41px, #93633b 41px 96px, ${OAK2} 96px 98px)` }}>
    <AbsoluteFill style={{ background: "linear-gradient(115deg, rgba(220,232,255,.22) 0%, rgba(220,232,255,0) 45%, rgba(0,0,0,.25) 100%)" }} />
    {children}
  </AbsoluteFill>
);
// papel apoyado en la mesada (sombra dura, nada de blur grande)
const Paper: React.FC<{ x: number; y: number; w: number; h: number; rot?: number; e?: number; bg?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, rot = 0, e = 1, bg = CREAM, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: bg, transform: `translateY(${(1 - e) * 80}px) rotate(${rot}deg)`, opacity: cl(e * 1.4),
    boxShadow: "6px 10px 0 rgba(0,0,0,.28)", borderRadius: 4, ...style }}>{children}</div>
);
// letra a mano que se escribe (revela por recorte)
const Hand: React.FC<{ text: string; at: number; f: number; len?: number; size?: number; col?: string; style?: React.CSSProperties }> = ({ text, at, f, len = 16, size = 58, col = INK, style }) => {
  const p = cl((f - at) / len); if (p <= 0) return null;
  return <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, whiteSpace: "nowrap", clipPath: `inset(-30% ${100 - p * 100}% -30% 0)`, ...style }}>{text}</div>;
};
const Lbl: React.FC<{ children: React.ReactNode; size?: number; col?: string; style?: React.CSSProperties }> = ({ children, size = 34, col = INK, style }) =>
  <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: size, color: col, letterSpacing: 2, ...style }}>{children}</div>;
const Src: React.FC<{ text: string; f: number; at: number }> = ({ text, f, at }) =>
  <div style={{ position: "absolute", right: 70, bottom: 46, fontFamily: SANS, fontWeight: 600, fontSize: 26, color: "#fff", background: "rgba(20,24,30,.78)", padding: "8px 18px", borderRadius: 4, opacity: k(f, at, 10) }}>SOURCE · {text}</div>;

// ---------- las dos máquinas dibujadas en CSS (se reutilizan dentro de los componentes como «actores»)
const Station: React.FC<{ s?: number; lit?: number }> = ({ s = 1, lit = 1 }) => (
  <div style={{ width: 300 * s, height: 220 * s, borderRadius: 18 * s, background: "linear-gradient(#4a5560,#2c343c)", position: "relative", boxShadow: `0 ${10 * s}px 0 rgba(0,0,0,.35)` }}>
    <div style={{ position: "absolute", left: 30 * s, right: 30 * s, top: -26 * s, height: 30 * s, border: `${10 * s}px solid #3a434b`, borderBottom: "none", borderRadius: `${14 * s}px ${14 * s}px 0 0` }} />
    <div style={{ position: "absolute", left: 24 * s, top: 34 * s, width: 110 * s, height: 64 * s, background: `rgba(120,230,200,${0.25 + 0.6 * lit})`, borderRadius: 6 * s }} />
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: (24 + i * 44) * s, top: 130 * s, width: 30 * s, height: 40 * s, background: "#1a1f24", borderRadius: 5 * s }} />)}
  </div>
);
const Gen: React.FC<{ s?: number; run?: number }> = ({ s = 1, run = 0 }) => {
  const f = useCurrentFrame(); const j = run ? Math.sin(f * 2.1) * 1.6 * run : 0;
  return (
    <div style={{ width: 330 * s, height: 230 * s, position: "relative", transform: `translateY(${j}px)` }}>
      <div style={{ position: "absolute", inset: 0, border: `${12 * s}px solid #2a2a2a`, borderRadius: 16 * s }} />
      <div style={{ position: "absolute", left: 26 * s, right: 26 * s, top: 22 * s, height: 96 * s, background: GN, borderRadius: 10 * s }} />
      <div style={{ position: "absolute", left: 40 * s, top: 128 * s, width: 140 * s, height: 80 * s, background: "#3b3b3b", borderRadius: 8 * s }} />
      <div style={{ position: "absolute", right: 36 * s, top: 132 * s, width: 70 * s, height: 70 * s, borderRadius: "50%", background: "repeating-radial-gradient(#555 0 4px,#333 4px 8px)" }} />
    </div>
  );
};

// ================= SERIE: EL MARCADOR DE 10 ROUNDS (round:N) — tablero de madera con persianas numeradas
const ROUNDS = ["AIR", "POWER", "HOURS", "FUEL", "COLD", "FURNACE", "NOISE & THEFT", "UPKEEP", "MONEY", "LIFE"];
const Round: React.FC<P> = ({ m, a, dur }) => {
  const f = useCurrentFrame(); const n = +a[0];
  return <Oak tone={4}>
    <div style={{ position: "absolute", left: 160, top: 150, width: 1600, height: 560, background: "#23201c", borderRadius: 10, boxShadow: "0 14px 0 rgba(0,0,0,.35)", display: "flex", gap: 14, padding: 30, perspective: 900 }}>
      {ROUNDS.map((r, i) => {
        const on = i + 1 === n, past = i + 1 < n, t = on ? k(f, 4, 14) : past ? 1 : 0;
        return <div key={i} style={{ flex: 1, position: "relative", background: "#141210", borderRadius: 6, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 8, background: on ? YEL : past ? "#5a5246" : "#2e2a25", transformOrigin: "50% 0", transform: `rotateX(${(1 - t) * -88}deg)`, borderRadius: 4,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: on ? INK : "#cfc6b6" }}>{i + 1}</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 21, letterSpacing: 2, color: on ? INK : "#cfc6b6" }}>{r}</div>
          </div>
        </div>;
      })}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 770, textAlign: "center", opacity: k(f, 10), transform: `translateY(${(1 - k(f, 10)) * 30}px)` }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: CREAM, letterSpacing: 6 }}>ROUND {n} <span style={{ color: YEL }}>· {ROUNDS[n - 1]}</span></div>
    </div>
    <div style={{ position: "absolute", left: 160, top: 770, fontFamily: SANS, fontWeight: 700, fontSize: 30, color: "#e9dcc4", opacity: k(f, 18) }}>{n} / 10</div>
  </Oak>;
};

// ================= SERIE: LA TARJETA DEL JUEZ (win:N:station|gen) — se anota el round en la columna del ganador
const WINS: Record<number, string> = { 1: "station", 2: "gen", 3: "gen", 4: "gen", 5: "tie", 6: "gen", 7: "station", 8: "station", 9: "gen", 10: "tie" };
const Judge: React.FC<P> = ({ m, a, dur }) => {
  const f = useCurrentFrame(); const n = +a[0]; const final = a[0] === "final";
  const upto = final ? 10 : n;
  const tally = (who: string, lim: number) => Object.entries(WINS).filter(([r, w]) => +r <= lim && w === who).length;
  return <Oak>
    <Paper x={430} y={60} w={1060} h={960} rot={-1.5} e={k(f, 0, 14)}>
      <div style={{ padding: "34px 50px" }}>
        <Lbl size={30} col="#7a6a50">OFFICIAL SCORECARD · KITCHEN TABLE BOUT</Lbl>
        <div style={{ display: "flex", marginTop: 22, borderBottom: `4px solid ${INK}`, paddingBottom: 10 }}>
          <div style={{ width: 150, fontFamily: SERIF, fontWeight: 900, fontSize: 34 }}>RD</div>
          <div style={{ flex: 1, fontFamily: SERIF, fontWeight: 900, fontSize: 34, color: ST }}>POWER STATION</div>
          <div style={{ flex: 1, fontFamily: SERIF, fontWeight: 900, fontSize: 34, color: GN }}>GENERATOR</div>
        </div>
        {ROUNDS.map((r, i) => {
          const rd = i + 1, w = WINS[rd]; if (rd > upto) return <div key={i} style={{ height: 62, borderBottom: "2px solid rgba(29,36,48,.18)" }} />;
          const cur = rd === upto && !final, at = cur ? M(m, 0, 8) : -99;
          return <div key={i} style={{ display: "flex", alignItems: "center", height: 62, borderBottom: "2px solid rgba(29,36,48,.18)", background: cur ? "rgba(242,194,48,.28)" : "none" }}>
            <div style={{ width: 150, fontFamily: SANS, fontWeight: 700, fontSize: 26 }}>{rd} {r}</div>
            <div style={{ flex: 1 }}>{(w === "station" || w === "tie") && <Hand text={w === "tie" ? "tie" : "10 ✓"} at={at} f={f} size={48} col={ST} />}</div>
            <div style={{ flex: 1 }}>{(w === "gen" || w === "tie") && <Hand text={w === "tie" ? "tie" : "10 ✓"} at={at} f={f} size={48} col={GN} />}</div>
          </div>;
        })}
        <div style={{ display: "flex", marginTop: 16, fontFamily: SERIF, fontWeight: 900, fontSize: 44 }}>
          <div style={{ width: 150 }}>WON</div>
          <div style={{ flex: 1, color: ST }}>{tally("station", upto)}</div>
          <div style={{ flex: 1, color: GN }}>{tally("gen", upto)}</div>
        </div>
      </div>
    </Paper>
  </Oak>;
};

// ================= ring (013): las dos máquinas entran desde las esquinas y se plantan en la raya de cinta
const Ring: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = sp(f, 4), b = sp(f, 12), v = k(f, M(m, 0, 40), 10);
  return <AbsoluteFill style={{ background: "#2a2622" }}>
    <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg,#3a342d 0 160px,#342f29 160px 162px)" }} />
    <div style={{ position: "absolute", left: 955, top: 120, width: 10, height: 820, background: YEL, transform: `scaleY(${k(f, 0, 18)})`, transformOrigin: "50% 0" }} />
    <div style={{ position: "absolute", left: 180 + (1 - a) * -600, top: 420 }}><Station s={1.5} /><Lbl col={ST} size={44} style={{ marginTop: 40, textAlign: "center" }}>POWER STATION</Lbl></div>
    <div style={{ position: "absolute", right: 160 + (1 - b) * -600, top: 400 }}><Gen s={1.5} /><Lbl col={GN} size={44} style={{ marginTop: 40, textAlign: "center" }}>GENERATOR</Lbl></div>
    <div style={{ position: "absolute", left: 960, top: 200, transform: `translate(-50%,0) scale(${0.6 + 0.4 * v})`, opacity: v, fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: CREAM, background: "#2a2622", padding: "0 30px" }}>10 ROUNDS</div>
  </AbsoluteFill>;
};

// ================= carousel (015): diez tarjetas de round sobre una bandeja giratoria (lazy susan); cada una se da vuelta en su palabra
const Susan: React.FC<P & { order?: boolean; pick?: number }> = ({ m, dur, order, pick }) => {
  const f = useCurrentFrame();
  const rot = order ? -((pick ?? 1) - 1) * 36 + (1 - io(f / 22)) * 36 : -f * 0.55;
  return <Oak tone={-3}>
    <div style={{ position: "absolute", left: 960, top: 600, width: 0, height: 0, perspective: 1600 }}>
      <div style={{ position: "absolute", left: -560, top: -170, width: 1120, height: 340, borderRadius: "50%", background: "radial-gradient(#b07a4a,#7a4f2c)", transform: "rotateX(72deg)", boxShadow: "0 30px 0 rgba(0,0,0,.3)" }} />
      <div style={{ transformStyle: "preserve-3d", transform: `rotateX(-8deg) rotateY(${rot}deg)` }}>
        {ROUNDS.map((r, i) => {
          const at = order ? (i + 1 === pick ? 0 : -99) : M(m, i, 6 + i * 20), t = order ? 1 : k(f, at, 10), hl = order && i + 1 === pick;
          return <div key={i} style={{ position: "absolute", left: -110, top: -330, width: 220, height: 300, transform: `rotateY(${i * 36}deg) translateZ(520px) rotateY(${(1 - t) * 180}deg)`, backfaceVisibility: "hidden",
            background: hl ? YEL : CREAM, borderRadius: 10, boxShadow: "0 8px 0 rgba(0,0,0,.3)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: INK }}>{i + 1}</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 26, color: INK, letterSpacing: 2 }}>{r}</div>
            {order && <div style={{ marginTop: 10, fontFamily: HAND, fontSize: 40, fontWeight: 700, color: WINS[i + 1] === "gen" ? GN : WINS[i + 1] === "station" ? ST : "#7a6a50" }}>{WINS[i + 1] === "gen" ? "generator" : WINS[i + 1] === "station" ? "station" : "tie"}</div>}
          </div>;
        })}
      </div>
    </div>
  </Oak>;
};

// ================= map:<pueblo> — el mapa de rutas del condado, plegado en la mesa; el alfiler cae y cuelga la orden de trabajo con el año
const TOWNS: Record<string, { x: number; y: number; yr: string; job: string }> = {
  orrville: { x: 1080, y: 360, yr: "2014", job: "ICE STORM · GEN IN THE GARAGE" }, wooster: { x: 900, y: 470, yr: "2019", job: "MRS. DALE · 1,000 Wh STATION" },
  ashland: { x: 520, y: 440, yr: "2022", job: "ICE STORM · GAS STATIONS DARK" }, millersburg: { x: 1010, y: 800, yr: "2017", job: "GENERATOR STOLEN" },
};
const CountyMap: React.FC<P> = ({ a, dur }) => {
  const f = useCurrentFrame(); const t = TOWNS[a[0]]; const unf = io(f / 16), pin = sp(f, 14), tag = k(f, 26, 12);
  const roads = [[0, 380, 1920, 330, 7], [0, 520, 1920, 600, 9], [700, 0, 760, 1080, 8], [1150, 0, 980, 1080, 6], [300, 0, 1500, 1080, 4], [0, 820, 1920, 760, 5]];
  return <Oak>
    <div style={{ position: "absolute", left: 140, top: 70, width: 1640, height: 940, perspective: 2000 }}>
      <div style={{ position: "absolute", inset: 0, background: "#efe6cf", transformOrigin: "0 50%", transform: `rotateY(${(1 - unf) * -70}deg)`, boxShadow: "8px 12px 0 rgba(0,0,0,.3)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, transparent 0 409px, rgba(0,0,0,.08) 409px 411px)" }} />
        {roads.map(([x1, y1, x2, y2, w], i) => { const L = Math.hypot(x2 - x1, y2 - y1), ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
          return <div key={i} style={{ position: "absolute", left: x1 - 140, top: y1 - 70, width: L, height: w, background: i < 2 ? "#c9453a" : "#7c8a94", transform: `rotate(${ang}deg)`, transformOrigin: "0 50%" }} />; })}
        {Object.entries(TOWNS).map(([n, p]) => <div key={n} style={{ position: "absolute", left: p.x - 140 + 18, top: p.y - 70 - 18, fontFamily: SERIF, fontWeight: 700, fontSize: 30, color: n === a[0] ? INK : "#8a8273", textTransform: "uppercase" }}>{n}</div>)}
        <div style={{ position: "absolute", left: 30, bottom: 24, fontFamily: SANS, fontWeight: 700, fontSize: 24, color: "#8a8273", letterSpacing: 3 }}>WAYNE · ASHLAND · HOLMES COUNTIES, OHIO</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: t.x - 14, top: t.y - 14 - (1 - pin) * 200, width: 28, height: 28, borderRadius: "50%", background: "#d23b2f", boxShadow: "4px 6px 0 rgba(0,0,0,.35)", opacity: cl(pin * 3) }} />
    <Paper x={t.x + 40} y={t.y + 30} w={430} h={190} rot={4} e={tag} bg="#fff8e2">
      <div style={{ padding: "18px 24px" }}><Lbl size={22} col="#9a6a2a">WORK ORDER · {t.yr}</Lbl><Hand text={t.job} at={30} f={f} size={40} /></div>
    </Paper>
  </Oak>;
};

// ================= exhaust (040): bidón → caño de escape de acero → burbujas «CO» que suben
const Exhaust: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const co = M(m, 0, 40);
  return <AbsoluteFill style={{ background: "#d9dde0" }}>
    <div style={{ position: "absolute", left: 160, top: 520, width: 260, height: 320, background: GN, borderRadius: "20px 60px 14px 14px", boxShadow: "8px 10px 0 rgba(0,0,0,.25)", opacity: k(f, 0) }}><Lbl col="#fff" size={40} style={{ padding: 30 }}>GASOLINE</Lbl></div>
    <div style={{ position: "absolute", left: 420, top: 640, height: 70, width: 900 * k(f, 8, 20), background: `linear-gradient(${STEEL},${STEEL2})`, borderRadius: 35 }} />
    <div style={{ position: "absolute", left: 1260, top: 380, width: 70, height: 330 * k(f, 20, 14), background: `linear-gradient(90deg,${STEEL},${STEEL2})`, borderRadius: 35, transformOrigin: "50% 100%", bottom: 370 }} />
    {Array.from({ length: 14 }).map((_, i) => { const t = (f - co - i * 7) / 60; if (t < 0) return null; const y = 360 - t * 420, x = 1295 + Math.sin(t * 5 + i) * (40 + i * 6);
      return <div key={i} style={{ position: "absolute", left: x - 45, top: y - 45, width: 90, height: 90, borderRadius: "50%", background: "rgba(70,74,80,.85)", opacity: cl(1.4 - t), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 34, color: "#fff" }}>CO</div>; })}
    <Lbl size={60} style={{ position: "absolute", left: 160, top: 120, opacity: k(f, co) }}>CARBON MONOXIDE · <span style={{ color: GN }}>NO SMELL, NO COLOR</span></Lbl>
  </AbsoluteFill>;
};

// ================= stat:cdc (042): números pintados con plantilla en la pared de madera del garaje, con la fuente
const Stencil: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame();
  const rows = [["400+", "DIE EVERY YEAR", "non-fire carbon monoxide"], ["100,000+", "ER VISITS", "every year"]];
  return <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg,#c9b08a 0 180px,#b99d76 180px 184px)" }}>
    {rows.map(([n, l, s], i) => { const at = M(m, i, 10 + i * 90), t = k(f, at, 8);
      return <div key={i} style={{ position: "absolute", left: 150, top: 120 + i * 290, display: "flex", alignItems: "baseline", gap: 40, opacity: t }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 200, color: i === 0 ? "#9b1d14" : INK, letterSpacing: 4, clipPath: `inset(0 ${100 - t * 100}% 0 0)` }}>{n}</div>
        <div><Lbl size={52}>{l}</Lbl><Lbl size={30} col="#5b4a33" style={{ fontWeight: 600 }}>{s}</Lbl></div>
      </div>; })}
    <Src text="CDC — Carbon Monoxide Poisoning Prevention" f={f} at={20} />
  </AbsoluteFill>;
};

// ================= twenty (045): la cinta métrica sale de la pared de la casa hasta el generador, 20 FT
const Tape20: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const t = io((f - 10) / 50), ft = Math.round(t * 20);
  return <AbsoluteFill style={{ background: "linear-gradient(#cfd8e2 0 55%, #f4f7fa 55%)" }}>
    <div style={{ position: "absolute", left: 0, top: 160, width: 260, height: 640, background: "repeating-linear-gradient(0deg,#e8dfcf 0 46px,#cbbfa9 46px 50px)" }}>
      <div style={{ position: "absolute", left: 70, top: 120, width: 130, height: 150, background: "#7fa4c4", border: "10px solid #fff" }} /></div>
    <div style={{ position: "absolute", left: 260, top: 700, width: 1300 * t, height: 70, background: YEL, borderTop: "4px solid #b8901a", borderBottom: "4px solid #b8901a", overflow: "hidden" }}>
      {Array.from({ length: 21 }).map((_, i) => <div key={i} style={{ position: "absolute", left: i * 65, top: 0, width: 4, height: i % 5 ? 26 : 46, background: INK }}>{i % 5 === 0 && <span style={{ position: "absolute", top: 44, left: 6, fontFamily: SANS, fontWeight: 800, fontSize: 18 }}>{i}</span>}</div>)}
    </div>
    <div style={{ position: "absolute", left: 260 + 1300 * t - 40, top: 680, width: 80, height: 110, background: "#333", borderRadius: 12 }} />
    <div style={{ position: "absolute", left: 1600, top: 520, transform: "scale(.8)", opacity: k(f, 55) }}><Gen run={1} /></div>
    <div style={{ position: "absolute", left: 1850, top: 560, width: 60 * k(f, M(m, 0, 120), 14), height: 16, background: "#555" }} />
    <div style={{ position: "absolute", left: 700, top: 360, fontFamily: SERIF, fontWeight: 900, fontSize: 170, color: INK }}>{ft} FT</div>
    <Lbl size={34} col="#4a5560" style={{ position: "absolute", left: 710, top: 560, opacity: k(f, M(m, 0, 120)) }}>EXHAUST POINTED AWAY FROM DOORS, WINDOWS & VENTS</Lbl>
  </AbsoluteFill>;
};

// ================= SERIE hose:* — la analogía de la manguera y el tanque (acero + agua)
const Hose: React.FC<P> = ({ a, m }) => {
  const f = useCurrentFrame(); const v = a[0];
  const cfg: Record<string, [number, number, string, string]> = { // ancho manguera, nivel tanque, rótulo izq, rótulo der
    watts: [70, 0.7, "WATTS = HOW HARD IT PUSHES", "WATT-HOURS = HOW LONG"], wide: [140, 0.7, "WATTS = HOSE WIDTH", "WATT-HOURS = WATER IN THE TANK"],
    gen: [46, 1, "GENERATOR · SMALL HOSE", "HUGE TANK (YOUR GAS CANS)"], station: [150, 0.32, "POWER STATION · WIDE HOSE", "SMALL TANK · ~1,000 Wh"], half: [150, 0.32, "1,800 W FLAT OUT", "EMPTY IN ~30 MIN"] };
  const [w, lvl0, L1, L2] = cfg[v]; const drain = v === "half" ? interpolate(f, [8, 80], [lvl0, 0.02], CL) : lvl0;
  const flow = (f * (v === "gen" ? 6 : 14)) % 80;
  return <AbsoluteFill style={{ background: "#e6e9ec" }}>
    <div style={{ position: "absolute", left: 180, top: 160, width: 520, height: 700, border: `16px solid ${STEEL2}`, borderTop: "none", borderRadius: "0 0 30px 30px", background: "rgba(255,255,255,.4)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${drain * 100}%`, background: "linear-gradient(#5aa3d8,#2f74ad)" }} />
    </div>
    <div style={{ position: "absolute", left: 700, top: 760 - w / 2, width: 1100 * k(f, 2, 14), height: w, background: `repeating-linear-gradient(90deg,#2f74ad ${flow}px,#5aa3d8 ${flow + 40}px,#2f74ad ${flow + 80}px)`, borderRadius: w / 2, border: "6px solid #2b5a33" }} />
    <Lbl size={46} style={{ position: "absolute", left: 760, top: 300, opacity: k(f, M(m, 0, 4)) }}>{L1}</Lbl>
    <Lbl size={46} col="#2f74ad" style={{ position: "absolute", left: 760, top: 380, opacity: k(f, M(m, 1, 30)) }}>{L2}</Lbl>
  </AbsoluteFill>;
};

// ================= sticker (087): la etiqueta de la heladera, el 6 A resaltado con marcador amarillo
const Sticker: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const hl = k(f, M(m, 0, 40), 14);
  return <AbsoluteFill style={{ background: "linear-gradient(#f2f4f5,#d7dadc)" }}>
    <Paper x={460} y={190} w={1000} h={640} rot={-1} e={k(f, 0)} bg="#fafafa" style={{ border: "3px solid #bbb" }}>
      <div style={{ padding: 50, fontFamily: SANS, fontWeight: 700, fontSize: 52, color: "#333", lineHeight: 1.6 }}>
        <div>REFRIGERATOR</div><div>115 V ~ 60 Hz</div>
        <div style={{ position: "relative", display: "inline-block" }}><div style={{ position: "absolute", left: -10, right: -10, top: 18, height: 56, background: YEL, transform: `scaleX(${hl})`, transformOrigin: "0 50%", opacity: .8 }} /><span style={{ position: "relative" }}>RATED 6.0 A</span></div>
        
      </div>
    </Paper>
  </AbsoluteFill>;
};

// ================= fridgehours (094): la batería como un reloj de arena horizontal; la heladera la vacía en 10-12 h
const Hourglass: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const t = io(f / dur), h = Math.round(t * 11);
  return <Oak>
    <div style={{ position: "absolute", left: 260, top: 330, width: 1100, height: 300, background: "#2c343c", borderRadius: 30, padding: 24, boxShadow: "0 12px 0 rgba(0,0,0,.35)" }}>
      <div style={{ width: `${(1 - t * 0.95) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${ST}, #6fd1b8)`, borderRadius: 16 }} /></div>
    <div style={{ position: "absolute", left: 1380, top: 420, width: 40, height: 120, background: "#2c343c", borderRadius: 8 }} />
    <div style={{ position: "absolute", left: 1500, top: 300, fontFamily: SERIF, fontWeight: 900, fontSize: 160, color: CREAM }}>{h}<span style={{ fontSize: 70 }}> h</span></div>
    <Lbl size={40} col={CREAM} style={{ position: "absolute", left: 260, top: 700 }}>1,000 Wh BATTERY · FRIDGE ONLY · DOOR SHUT</Lbl>
    <Lbl size={34} col={YEL} style={{ position: "absolute", left: 260, top: 770, opacity: k(f, dur * 0.5) }}>≈ 10–12 HOURS</Lbl>
  </Oak>;
};

// ================= drain750 (098): un calefactor de 750 W y la aguja de combustible que cae en 1 h 15
const Drain: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const t = io(f / dur), ang = -60 + 120 * (1 - t);
  return <AbsoluteFill style={{ background: "#1e2329" }}>
    <div style={{ position: "absolute", left: 300, top: 260, width: 560, height: 560, borderRadius: "50%", background: "#f3ecdc", border: "18px solid #444" }}>
      <div style={{ position: "absolute", left: 30, top: 230, fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: GN }}>E</div>
      <div style={{ position: "absolute", right: 30, top: 230, fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: INK }}>F</div>
      <div style={{ position: "absolute", left: 270, top: 80, width: 10, height: 200, background: GN, transformOrigin: "50% 100%", transform: `rotate(${ang}deg)` }} />
    </div>
    <div style={{ position: "absolute", left: 1000, top: 300, width: 380, height: 420, background: "#ddd", borderRadius: 16, padding: 40 }}>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ height: 30, marginBottom: 40, borderRadius: 15, background: `rgba(255,${120 - i * 10},40,${0.5 + 0.5 * Math.abs(Math.sin(f / 8 + i))})` }} />)}
    </div>
    <Lbl size={50} col="#fff" style={{ position: "absolute", left: 1000, top: 760 }}>750 W HEATER</Lbl>
    <Lbl size={70} col={YEL} style={{ position: "absolute", left: 300, top: 870 }}>{`${Math.floor(t * 75 / 60)}:${String(Math.round(t * 75) % 60).padStart(2, "0")}`} h → EMPTY</Lbl>
  </AbsoluteFill>;
};

// ================= fridgelist (102): la lista con imán en la puerta de la heladera
const FridgeList: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const items = ["the fridge", "furnace blower", "internet", "lights", "phones"];
  return <AbsoluteFill style={{ background: "linear-gradient(90deg,#e9eef0,#cdd4d8)" }}>
    <div style={{ position: "absolute", left: 1500, top: 0, width: 26, height: 1080, background: "#b8c0c5" }} />
    <Paper x={560} y={110} w={760} h={860} rot={2} e={k(f, 0)} bg="#fffdf4">
      <div style={{ position: "absolute", left: 330, top: -26, width: 100, height: 60, borderRadius: 10, background: "#d23b2f", boxShadow: "3px 5px 0 rgba(0,0,0,.3)" }} />
      <div style={{ padding: "70px 60px" }}>
        <Hand text="BATTERY RUNS:" at={4} f={f} size={64} col="#1f4f8f" />
        {items.map((s, i) => <Hand key={i} text={`• ${s}`} at={M(m, i, 20 + i * 24)} f={f} size={62} style={{ marginTop: 22 }} />)}
        <Hand text="HEAT NEVER TOUCHES THE BATTERY." at={M(m, 5, 150)} f={f} size={58} col={GN} style={{ marginTop: 40 }} />
      </div>
    </Paper>
  </AbsoluteFill>;
};

// ================= SERIE napkin:0-6 — la cuenta en la servilleta, renglón por renglón
const NAP = ["Wh × 0.85 ÷ watts = hours", "2,000 Wh × 0.85 = 1,700", "fridge ≈ 75 W", "furnace blower ≈ 130 W avg", "internet, lights, phones ≈ 40 W", "total ≈ 250 W", "1,700 ÷ 250 ≈ 6.8 h"];
const Napkin: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const n = +a[0];
  return <Oak>
    <div style={{ position: "absolute", left: 440, top: 70, width: 1040, height: 940, background: "#fbfbf7", transform: "rotate(-2deg)", boxShadow: "6px 10px 0 rgba(0,0,0,.25)",
      backgroundImage: "repeating-linear-gradient(45deg, rgba(0,0,0,.025) 0 6px, transparent 6px 12px)", clipPath: "polygon(0 2%,3% 0,97% 1%,100% 3%,99% 97%,96% 100%,2% 99%,0 96%)" }}>
      <div style={{ padding: "70px 80px" }}>
        {NAP.slice(0, n + 1).map((s, i) => <Hand key={i} text={s} at={i === n ? 4 : -99} f={f} len={22} size={i === 6 && n === 6 ? 88 : 66} col={i === n ? "#1f4f8f" : "#555"} style={{ marginBottom: 34 }} />)}
        {n === 6 && <div style={{ position: "absolute", left: 60, top: 70 + 6 * 108 - 14, width: 760, height: 130, border: `6px solid ${GN}`, borderRadius: "50%", transform: `scale(${k(f, 30, 10)})`, opacity: k(f, 30, 10) }} />}
      </div>
    </div>
  </Oak>;
};

// ================= cans3 (150): bidones de 5 galones que se alinean: 1 día, 2, 3 = 15 galones
const Cans: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const at = [M(m, 0, 30), M(m, 1, 80), M(m, 2, 130)];
  return <AbsoluteFill style={{ background: "linear-gradient(#bfc5c9 0 70%, #8d8f8c 70%)" }}>
    {at.map((t, i) => <div key={i} style={{ position: "absolute", left: 300 + i * 470, top: 400 - (1 - sp(f, t)) * 500, opacity: cl(sp(f, t) * 3) }}>
      <div style={{ width: 300, height: 360, background: GN, borderRadius: "16px 70px 16px 16px", boxShadow: "8px 10px 0 rgba(0,0,0,.3)" }}><Lbl col="#fff" size={44} style={{ padding: "120px 0 0 40px" }}>5 GAL</Lbl></div>
      <Lbl size={40} style={{ marginTop: 20 }}>DAY {i + 1}</Lbl></div>)}
    <Lbl size={80} style={{ position: "absolute", left: 300, top: 130 }}>{f < at[1] ? 5 : f < at[2] ? 10 : 15} GALLONS</Lbl>
  </AbsoluteFill>;
};

// ================= datetape (158): la cinta de pintor sobre el bidón y la fecha escrita con marcador
const DateTape: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: GN }}>
    <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,.06) 0 60px, transparent 60px 120px)" }} />
    <div style={{ position: "absolute", left: 300, top: 400, width: 1320 * k(f, 2, 14), height: 220, background: "#e8d9a8", transform: "rotate(-3deg)", boxShadow: "0 6px 0 rgba(0,0,0,.2)" }}>
      <Hand text="FILLED 11 / 03 · STABILIZER ✓" at={14} f={f} len={26} size={96} style={{ padding: "50px 60px" }} /></div>
  </AbsoluteFill>;
};

// ================= refill3 (165): tres cables que entran a la power station: generador, camioneta, sol
const Refill: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const src = [["GENERATOR", GN], ["YOUR VEHICLE", "#3c5a8a"], ["SOLAR PANEL", "#c79a1c"]];
  return <Oak>
    <div style={{ position: "absolute", left: 1300, top: 400 }}><Station s={1.4} /></div>
    {src.map(([l, c], i) => { const at = M(m, i, 10 + i * 50), t = k(f, at, 18);
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: 200, top: 250 + i * 260, width: 380, height: 140, background: c as string, borderRadius: 14, opacity: cl(t * 2), display: "flex", alignItems: "center", justifyContent: "center" }}><Lbl col="#fff" size={34}>{l}</Lbl></div>
        <div style={{ position: "absolute", left: 580, top: 312 + i * 260, width: 720 * t, height: 16, background: "#1b1b1b", borderRadius: 8, transform: `rotate(${(1 - i) * -12}deg)`, transformOrigin: "0 50%" }} />
      </React.Fragment>; })}
    <Lbl size={44} col={CREAM} style={{ position: "absolute", left: 200, top: 90 }}>GRID DOWN · ONLY 3 WAYS TO REFILL</Lbl>
  </Oak>;
};

// ================= sunarc (172): el sol bajo de invierno cruza en arco y el contador de Wh sube a 600-800
const SunArc: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const t = io(f / dur), ang = Math.PI * (1 - t);
  return <AbsoluteFill style={{ background: "linear-gradient(#9fb4c8, #dfe6ec 70%, #f5f7f9 70%)" }}>
    <div style={{ position: "absolute", left: 960 + Math.cos(ang) * 700 - 60, top: 760 - Math.sin(ang) * 260 - 60, width: 120, height: 120, borderRadius: "50%", background: "#ffd86a", boxShadow: "0 0 0 18px rgba(255,216,106,.35)" }} />
    <div style={{ position: "absolute", left: 760, top: 650, width: 400, height: 220, background: "repeating-linear-gradient(90deg,#1d3557 0 64px,#9fb4c8 64px 68px)", transform: "skewX(-18deg)", border: "8px solid #bbb" }} />
    <Lbl size={110} style={{ position: "absolute", left: 120, top: 120, fontFamily: SERIF }}>{fmt(t * 700)} Wh</Lbl>
    <Lbl size={34} col="#3d4a57" style={{ position: "absolute", left: 120, top: 260 }}>400 W PANEL · CLEAR DECEMBER DAY · BY SUNDOWN</Lbl>
  </AbsoluteFill>;
};

// ================= lock32 (191): el termómetro baja a 32°F y un candado se cierra sobre la batería
const Lock32: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const deg = Math.round(interpolate(f, [0, dur * 0.6], [45, 32], CL)), lk = k(f, dur * 0.6, 8);
  return <AbsoluteFill style={{ background: "#dfe8ef" }}>
    <div style={{ position: "absolute", left: 300, top: 160, width: 90, height: 700, background: "#fff", borderRadius: 45, border: "6px solid #999" }}>
      <div style={{ position: "absolute", left: 18, right: 18, bottom: 18, height: (deg - 0) * 12, background: "#c0392b", borderRadius: 30 }} /></div>
    <Lbl size={120} style={{ position: "absolute", left: 460, top: 200, fontFamily: SERIF }}>{deg}°F</Lbl>
    <div style={{ position: "absolute", left: 900, top: 460 }}><Station s={1.4} lit={0.2} /></div>
    <div style={{ position: "absolute", left: 1080, top: 380, opacity: lk, transform: `translateY(${(1 - lk) * -120}px)` }}>
      <div style={{ width: 120, height: 110, border: "22px solid #777", borderBottom: "none", borderRadius: "60px 60px 0 0", marginLeft: 20 }} />
      <div style={{ width: 160, height: 130, background: "#b88a2a", borderRadius: 12 }} /></div>
    <Lbl size={40} col={GN} style={{ position: "absolute", left: 460, top: 760, opacity: lk }}>LITHIUM WON'T CHARGE BELOW 32°F</Lbl>
  </AbsoluteFill>;
};

// ================= furnaceparts (215): la caldera como un mueble de cajones; cada parte sale en su palabra
const Drawers: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const parts = ["IGNITER", "CONTROL BOARD", "INDUCER FAN", "BLOWER"];
  return <AbsoluteFill style={{ background: "#3a3f45" }}>
    <div style={{ position: "absolute", left: 560, top: 90, width: 640, height: 900, background: "linear-gradient(90deg,#c9cdd1,#a9aeb3)", borderRadius: 10 }}>
      {parts.map((p, i) => { const t = k(f, M(m, i, 8 + i * 40), 14);
        return <div key={i} style={{ position: "absolute", left: 30, top: 40 + i * 215, width: 580, height: 185, background: "#e7e9eb", border: "4px solid #8b9196", borderRadius: 6, transform: `translateX(${t * 520}px)`, boxShadow: `${t * 14}px 10px 0 rgba(0,0,0,.25)`, display: "flex", alignItems: "center", paddingLeft: 40 }}>
          <div style={{ width: 80, height: 18, background: "#8b9196", borderRadius: 9, marginRight: 30 }} /><Lbl size={42} style={{ opacity: t }}>{p}</Lbl></div>; })}
    </div>
    <Lbl size={36} col="#fff" style={{ position: "absolute", left: 120, top: 120 }}>A GAS FURNACE<br />STILL NEEDS ELECTRICITY</Lbl>
  </AbsoluteFill>;
};

// ================= sine (219): la onda dibujada con cuentas de acero (puntos DOM): pura vs escalonada
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

// ================= backfeedline (235): la corriente sale por el medidor al poste y sube a miles de voltios
const Backfeed: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const t = io((f - 4) / (dur * 0.7)), hv = k(f, M(m, 0, dur * 0.7), 8);
  const pts = [[260, 760], [620, 760], [620, 420], [1240, 300], [1520, 300]];
  const seg = pts.slice(1).map((p, i) => [pts[i], p]); const tot = seg.length;
  return <AbsoluteFill style={{ background: "linear-gradient(#aebccb, #e3e8ed 75%, #f5f5f5 75%)" }}>
    <div style={{ position: "absolute", left: 80, top: 560, width: 420, height: 300, background: "#d9c9a7", borderTop: "60px solid #6b4a32" }} />
    <div style={{ position: "absolute", left: 590, top: 720, width: 70, height: 90, background: "#999", borderRadius: "50%" }} />
    <div style={{ position: "absolute", left: 1500, top: 180, width: 30, height: 760, background: "#6b4a32" }} />
    <div style={{ position: "absolute", left: 1450, top: 260, width: 130, height: 150, background: "#7d8790", borderRadius: 14 }} />
    {seg.map(([a, b], i) => { const p = cl(t * tot - i), L = Math.hypot(b[0] - a[0], b[1] - a[1]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
      return <div key={i} style={{ position: "absolute", left: a[0], top: a[1], width: L * p, height: 12, background: GN, transform: `rotate(${ang}deg)`, transformOrigin: "0 50%" }} />; })}
    <Lbl size={74} col="#9b1d14" style={{ position: "absolute", left: 700, top: 480, fontFamily: SERIF, opacity: hv, transform: `scale(${0.7 + 0.3 * hv})` }}>THOUSANDS OF VOLTS</Lbl>
    <Lbl size={36} style={{ position: "absolute", left: 700, top: 590, opacity: hv }}>ON THE LINE A LINEMAN IS HOLDING</Lbl>
    <Lbl size={36} style={{ position: "absolute", left: 100, top: 120 }}>BACKFEEDING · NO INTERLOCK</Lbl>
  </AbsoluteFill>;
};

// ================= sequence (240): la placa del interlock se desliza y las palancas bajan en orden
const Interlock: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const steps = ["GEN ON CORD", "INTERLOCK SLID", "MAIN OFF", "GEN BREAKER ON", "FURNACE ON"];
  const sl = k(f, M(m, 1, 50), 14);
  const H = (x: number, on: number, lab: string) => <div style={{ position: "absolute", left: x, top: 380, width: 160, height: 300, background: "#222", borderRadius: 10 }}>
    <div style={{ position: "absolute", left: 40, top: 40 + (1 - on) * 140, width: 80, height: 80, background: on > 0.5 ? "#e0e0e0" : "#777", borderRadius: 8 }} /><Lbl size={22} col="#fff" style={{ position: "absolute", top: 310, width: 220 }}>{lab}</Lbl></div>;
  return <AbsoluteFill style={{ background: "#9aa1a8" }}>
    <div style={{ position: "absolute", left: 420, top: 230, width: 1080, height: 640, background: "#c5cacf", border: "10px solid #6f767c", borderRadius: 8 }} />
    {H(560, 1 - k(f, M(m, 2, 90), 8), "MAIN")}
    {H(860, k(f, M(m, 3, 130), 8), "GENERATOR")}
    {H(1160, k(f, M(m, 4, 170), 8), "FURNACE")}
    <div style={{ position: "absolute", left: 720 - sl * 0, top: 330 + (1 - sl) * -120, width: 200, height: 240, background: "rgba(200,40,30,.85)", border: "6px solid #7a1a12", borderRadius: 6, opacity: cl(sl * 2) }}><Lbl col="#fff" size={22} style={{ padding: 14 }}>INTERLOCK</Lbl></div>
    <div style={{ position: "absolute", left: 100, top: 920, display: "flex", gap: 22 }}>{steps.map((s, i) => <Lbl key={i} size={26} col={f >= M(m, i, 10 + i * 40) ? INK : "rgba(29,36,48,.3)"}>{i + 1}. {s}</Lbl>)}</div>
  </AbsoluteFill>;
};

// ================= heatjob (246): «HEAT IS THE JOB» rotulado con marcador en el cartón del filtro de la caldera
const HeatJob: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#c8a979" }}>
    <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, rgba(0,0,0,.05) 0 10px, transparent 10px 20px)" }} />
    <div style={{ position: "absolute", left: 260, top: 230, width: 1400, height: 620, border: "26px solid #e8e2d4", background: "repeating-linear-gradient(45deg,#f2efe6 0 18px,#ddd6c6 18px 36px)" }} />
    <Hand text="HEAT IS THE JOB." at={2} f={f} len={22} size={190} col={GN} style={{ position: "absolute", left: 340, top: 410 }} />
  </AbsoluteFill>;
};

// ================= decibels (258): el decibelímetro de aguja; escala con cosas de la casa
const Decibel: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const v = interpolate(f, [6, 40], [30, 58], CL) + Math.sin(f / 3) * 1.2;
  const marks = [[40, "fridge hum"], [55, "INVERTER GEN @ 23 FT"], [60, "conversation"], [75, "vacuum"], [90, "open-frame gen up close"]];
  return <AbsoluteFill style={{ background: "#2b2f33" }}>
    <div style={{ position: "absolute", left: 360, top: 160, width: 1200, height: 600, borderRadius: "600px 600px 0 0", background: "#f3ecdc", overflow: "hidden" }}>
      {marks.map(([d, l], i) => { const a = -90 + ((+d - 30) / 70) * 180; return <div key={i} style={{ position: "absolute", left: 600, top: 600, width: 560, height: 4, background: "#999", transformOrigin: "0 50%", transform: `rotate(${a - 90}deg)` }}><span style={{ position: "absolute", left: 300, top: -40, fontFamily: SANS, fontWeight: 700, fontSize: 24, color: i === 1 ? GN : INK, whiteSpace: "nowrap" }}>{d} dB {l}</span></div>; })}
      <div style={{ position: "absolute", left: 594, top: 60, width: 12, height: 540, background: GN, transformOrigin: "50% 100%", transform: `rotate(${-90 + ((v - 30) / 70) * 180}deg)` }} />
    </div>
    <Lbl size={90} col={YEL} style={{ position: "absolute", left: 360, top: 820, fontFamily: SERIF }}>{Math.round(v)} dB</Lbl>
  </AbsoluteFill>;
};

// ================= hourbook (279): el libro de horas del generador; se anotan los cambios de aceite
const HourBook: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const rows = [["5 h", "FIRST OIL CHANGE"], ["50 h", "oil change"], ["100 h", "oil + spark plug check"]];
  return <Oak>
    <Paper x={300} y={100} w={1320} h={880} rot={1} e={k(f, 0)} bg="#f6f0de">
      <div style={{ position: "absolute", left: 650, top: 0, bottom: 0, width: 8, background: "rgba(0,0,0,.12)" }} />
      <div style={{ padding: "50px 70px" }}><Lbl size={36} col="#7a6a50">GENERATOR HOUR LOG</Lbl>
        {rows.map(([h, t], i) => <div key={i} style={{ display: "flex", gap: 60, marginTop: 70 }}><Hand text={h} at={M(m, i, 8 + i * 40)} f={f} size={72} col="#1f4f8f" /><Hand text={t} at={M(m, i, 8 + i * 40) + 6} f={f} size={64} /></div>)}
        <Hand text="(check your manual)" at={M(m, 3, 150)} f={f} size={44} col="#7a6a50" style={{ marginTop: 60 }} /></div>
    </Paper>
  </Oak>;
};

// ================= storeband (288): el indicador de carga con la franja 50-80 % y el almanaque «cada 3 meses»
const StoreBand: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const b = k(f, M(m, 0, 10), 16), cal = k(f, M(m, 1, 100), 14);
  return <AbsoluteFill style={{ background: "#e9ecef" }}>
    <div style={{ position: "absolute", left: 200, top: 300, width: 1500, height: 160, background: "#2c343c", borderRadius: 24, padding: 16 }}>
      <div style={{ width: "65%", height: "100%", background: ST, borderRadius: 14 }} />
      <div style={{ position: "absolute", left: 16 + 0.5 * 1468, top: -30, width: 0.3 * 1468 * b, height: 220, border: `8px solid ${YEL}`, borderRadius: 14 }} />
    </div>
    <Lbl size={48} style={{ position: "absolute", left: 200 + 0.5 * 1500, top: 500, opacity: b }}>STORE AT 50–80 %</Lbl>
    <div style={{ position: "absolute", left: 200, top: 640, display: "flex", gap: 30, opacity: cal }}>{["JAN", "APR", "JUL", "OCT"].map((s, i) => <div key={i} style={{ width: 220, height: 220, background: "#fff", border: "4px solid #ccc", borderTop: `40px solid ${GN}` }}><Hand text="top up ✓" at={M(m, 1, 100) + i * 8} f={f} size={44} style={{ padding: 30 }} /><Lbl size={28} style={{ padding: "0 30px" }}>{s}</Lbl></div>)}</div>
  </AbsoluteFill>;
};

// ================= SERIE shelf:gen|station — la góndola de la ferretería; el cartel de precio voltea
const Shelf: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const g = a[0] === "gen"; const t = k(f, 10, 14);
  return <AbsoluteFill style={{ background: "#dfe3e6" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 60, background: "#c9ccce", borderTop: "8px solid #f0f0f0" }} />
    <div style={{ position: "absolute", left: 680, top: 330 }}>{g ? <Gen s={1.2} /> : <Station s={1.2} />}</div>
    <div style={{ position: "absolute", left: 640, top: 700, width: 640, height: 200, perspective: 800 }}>
      <div style={{ width: "100%", height: "100%", background: YEL, transformOrigin: "50% 0", transform: `rotateX(${(1 - t) * 90}deg)`, display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 40, boxShadow: "0 8px 0 rgba(0,0,0,.2)" }}>
        <Lbl size={30}>{g ? "3,000 W INVERTER GENERATOR" : "~1,000 Wh LiFePO4 STATION"}</Lbl>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: INK }}>{g ? "$800–1,500" : "$400–800"}</div>
      </div></div>
    <Lbl size={26} col="#666" style={{ position: "absolute", left: 640, top: 930 }}>PRICE RANGE WHERE I SHOP</Lbl>
  </AbsoluteFill>;
};

// ================= pump (307): las ruedas numéricas del surtidor: galones y dólares por día
const Pump: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const t = io(f / (dur * 0.6));
  const Wheel = ({ v, l, c }: { v: string; l: string; c: string }) => <div style={{ marginBottom: 40 }}><Lbl size={30} col="#ccc">{l}</Lbl><div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 150, color: c, background: "#111", padding: "0 30px", borderRadius: 8, letterSpacing: 10 }}>{v}</div></div>;
  return <AbsoluteFill style={{ background: "#7a1e17" }}>
    <div style={{ position: "absolute", left: 460, top: 120, width: 1000, height: 840, background: "#2a2a2a", borderRadius: 20, padding: 60 }}>
      <Wheel v={(5 * t).toFixed(1).padStart(5, "0")} l="GALLONS / DAY (LIGHT LOAD)" c="#7dffb0" />
      <Wheel v={"$" + (16.5 * t).toFixed(2)} l="PER DAY @ ~$3.30/GAL" c={YEL} />
      <Lbl size={36} col="#fff" style={{ opacity: k(f, dur * 0.65) }}>A WEEK OUT ≈ $105–125 IN GAS</Lbl>
    </div>
  </AbsoluteFill>;
};

// ================= SERIE plantbucket:1|2 y bucket — la usina contra el balde (el balde se llena de una canilla)
const Bucket: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const which = a[0] || "2"; const plant = which === "1";
  return <AbsoluteFill style={{ background: "#d5dbe0" }}>
    <div style={{ position: "absolute", left: 300, top: 260, opacity: plant ? 1 : 0.35, transform: `scale(${plant ? 1 + 0.05 * k(f, 0) : 0.9})` }}>
      <div style={{ width: 160, height: 420, background: "#9aa3ab", marginLeft: 80, borderRadius: "40px 40px 0 0" }} /><div style={{ width: 380, height: 180, background: "#7d868e" }} /><Lbl size={40} style={{ marginTop: 20 }}>POWER PLANT</Lbl></div>
    <div style={{ position: "absolute", left: 1150, top: 380, opacity: plant ? 0.35 : 1, transform: `scale(${!plant ? 1 + 0.05 * k(f, 0) : 0.9})` }}>
      <div style={{ width: 400, height: 380, background: "linear-gradient(90deg,#b8c0c6,#8d969d)", clipPath: "polygon(0 0,100% 0,88% 100%,12% 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${(plant ? 30 : 30 + 40 * k(f, 0, 40))}%`, background: "#4f93c9" }} /></div>
      <Lbl size={40} style={{ marginTop: 20 }}>BUCKET</Lbl></div>
    <Lbl size={64} style={{ position: "absolute", left: 300, top: 110, fontFamily: SERIF }}>{plant ? "THE GENERATOR MAKES POWER." : "THE BATTERY HOLDS IT."}</Lbl>
  </AbsoluteFill>;
};

// ================= cycles (322): el cuentaciclos llega a 3.000 y la línea de capacidad baja a 80 %
const Cycles: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const t = io(f / (dur * 0.7)), cyc = Math.round(t * 3000), cap = 100 - 20 * t;
  return <AbsoluteFill style={{ background: "#141a20" }}>
    <div style={{ position: "absolute", left: 200, top: 180, fontFamily: "monospace", fontWeight: 900, fontSize: 200, color: "#7dffb0", background: "#000", padding: "0 40px", borderRadius: 10 }}>{String(cyc).padStart(4, "0")}</div>
    <Lbl size={36} col="#9aa" style={{ position: "absolute", left: 200, top: 440 }}>FULL CYCLES (LiFePO4)</Lbl>
    <div style={{ position: "absolute", left: 1100, top: 180, width: 220, height: 640, border: "10px solid #9aa3ab", borderRadius: 16, padding: 14 }}>
      <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, height: `${cap - 4}%`, background: ST, borderRadius: 8 }} /></div>
    <Lbl size={90} col={YEL} style={{ position: "absolute", left: 1380, top: 420, fontFamily: SERIF }}>{Math.round(cap)}%</Lbl>
    <Lbl size={30} col="#9aa" style={{ position: "absolute", left: 200, top: 900, opacity: k(f, dur * 0.7) }}>≈ 8 YEARS OF DAILY USE · SOURCE: MAKER SPEC SHEETS</Lbl>
  </AbsoluteFill>;
};

// ================= letters (326): LiFePO4 punzonado letra por letra en una chapa de acero
const Punch: React.FC<P> = () => {
  const f = useCurrentFrame(); const L = "LiFePO4".split("");
  return <AbsoluteFill style={{ background: "#4a4f55" }}>
    <div style={{ position: "absolute", left: 260, top: 330, width: 1400, height: 420, background: `linear-gradient(135deg,#c9ced3,#8e959b)`, borderRadius: 12, boxShadow: "0 12px 0 rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
      {L.map((c, i) => { const at = 6 + i * 9, t = f >= at ? 1 : 0, hit = cl(1 - (f - at) / 5);
        return <div key={i} style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 210, color: "#5a6168", textShadow: "-3px -3px 0 rgba(0,0,0,.45), 3px 3px 0 rgba(255,255,255,.55)", opacity: t, transform: `scale(${1 + 0.15 * hit})` }}>{c}</div>; })}
    </div>
    <Lbl size={40} col="#e9eef2" style={{ position: "absolute", left: 260, top: 820 }}>LOOK FOR THESE LETTERS ON THE SPEC SHEET</Lbl>
  </AbsoluteFill>;
};

// ================= schedule (345): el reloj de 24 h de la cocina: generador mañana y tarde, estación de noche
const Dial24: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const t = io(f / dur);
  const arcs = [[7, 10, GN, "GEN"], [10, 17, ST, "STATION"], [17, 20, GN, "GEN"], [20, 31, ST, "STATION"]];
  return <Oak>
    <div style={{ position: "absolute", left: 560, top: 140, width: 800, height: 800, borderRadius: "50%", background: CREAM, border: "18px solid #3b3b3b", overflow: "hidden" }}>
      {arcs.map(([a, b, c, l], i) => { const p = cl(t * 4 - i); return Array.from({ length: Math.round((+b - +a) * 4 * p) }).map((_, j) => { const h = +a + j / 4, ang = (h / 24) * 360;
        return <div key={i + "_" + j} style={{ position: "absolute", left: 400 - 8, top: 30, width: 16, height: 120, background: c as string, transformOrigin: "50% 370px", transform: `rotate(${ang}deg)` }} />; }); })}
      {[0, 6, 12, 18].map((h) => <div key={h} style={{ position: "absolute", left: 400 + Math.sin(h / 24 * 2 * Math.PI) * 220 - 40, top: 400 - Math.cos(h / 24 * 2 * Math.PI) * 220 - 30, fontFamily: SERIF, fontWeight: 900, fontSize: 50 }}>{h === 0 ? 24 : h}</div>)}
    </div>
    <Lbl size={36} col={GN} style={{ position: "absolute", left: 120, top: 400 }}>■ GENERATOR · MORNING & EVENING, ~3 H</Lbl>
    <Lbl size={36} col="#7fe0c8" style={{ position: "absolute", left: 120, top: 470 }}>■ STATION · AFTERNOON & OVERNIGHT</Lbl>
  </Oak>;
};

// ================= counter (353): «FROM THE COUNTER» — la campanita y el letrero de la ferretería
const Counter: React.FC<P> = () => {
  const f = useCurrentFrame(); const ring = Math.sin(f * 1.6) * 6 * cl(1 - f / 20);
  return <AbsoluteFill style={{ background: "#6b4a32" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 600, height: 480, background: "repeating-linear-gradient(90deg,#8a6040 0 120px,#7a5236 120px 124px)" }} />
    <div style={{ position: "absolute", left: 860, top: 470, transform: `rotate(${ring}deg)`, transformOrigin: "50% 100%" }}>
      <div style={{ width: 200, height: 110, background: "linear-gradient(#e7c66a,#b48d2c)", borderRadius: "100px 100px 10px 10px" }} /><div style={{ width: 240, height: 24, background: "#333", marginLeft: -20, borderRadius: 6 }} /></div>
    <div style={{ position: "absolute", left: 460, top: 140, width: 1000, height: 220, background: CREAM, border: "10px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${Math.sin(f / 14) * 1.2}deg)` }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 100, color: INK }}>FROM THE COUNTER</div></div>
  </AbsoluteFill>;
};

// ================= SERIE checklist:0-5 — las etiquetas de cartón que se suman a un aro de llavero
const REQ = ["LiFePO4 battery", "1,000+ Wh (2,000 if you can)", "1,500 W continuous · pure sine", "fast AC charging (2–3 h)", "expandable battery = plus"];
const KeyRing: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const n = +a[0];
  return <Oak>
    <div style={{ position: "absolute", left: 220, top: 120, width: 180, height: 180, borderRadius: "50%", border: "16px solid #b9bec3" }} />
    <Lbl size={50} col={CREAM} style={{ position: "absolute", left: 460, top: 160, fontFamily: SERIF }}>MY STATION CHECKLIST</Lbl>
    {REQ.slice(0, n).map((r, i) => { const nw = i === n - 1, t = nw ? sp(f, 4) : 1;
      return <div key={i} style={{ position: "absolute", left: 300 + i * 40, top: 310 + i * 140, transform: `rotate(${(i % 2 ? 3 : -2) * t}deg) translateY(${(1 - t) * -80}px)`, opacity: cl(t * 3), transformOrigin: "0 0" }}>
        <div style={{ width: 1100, height: 116, background: "#f1e3c2", borderRadius: "60px 10px 10px 60px", display: "flex", alignItems: "center", paddingLeft: 90, boxShadow: "5px 8px 0 rgba(0,0,0,.3)", position: "relative" }}>
          <div style={{ position: "absolute", left: 30, top: 40, width: 36, height: 36, borderRadius: "50%", background: OAK2 }} />
          <Hand text={`${i + 1}. ${r}`} at={nw ? 8 : -99} f={f} size={58} /></div></div>; })}
  </Oak>;
};

// ================= SERIE q:N — el turnero de mostrador: sale el papelito con el número de pregunta
const Ticket: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const n = +a[0]; const t = k(f, 2, 16);
  return <AbsoluteFill style={{ background: "#7a5236" }}>
    <div style={{ position: "absolute", left: 700, top: 120, width: 520, height: 360, background: "#c0392b", borderRadius: "30px 30px 10px 10px" }}><Lbl col="#fff" size={40} style={{ padding: 40 }}>TAKE A NUMBER</Lbl></div>
    <div style={{ position: "absolute", left: 780, top: 440, width: 360, height: 420 * t, background: "#fff4d6", overflow: "hidden", borderBottom: "6px dashed #c9b88f", boxShadow: "4px 8px 0 rgba(0,0,0,.25)" }}>
      <div style={{ padding: 30, textAlign: "center" }}><Lbl size={30} col="#9a6a2a">QUESTION</Lbl><div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 220, color: INK, lineHeight: 1 }}>{n}</div></div></div>
  </AbsoluteFill>;
};

// ================= fuse (369): el fusible de cuchilla 10-15 A al lado del enchufe de la camioneta
const Fuse: React.FC<P> = () => {
  const f = useCurrentFrame(); const t = k(f, 4, 14);
  return <AbsoluteFill style={{ background: "#26292c" }}>
    <div style={{ position: "absolute", left: 360, top: 300, width: 300, height: 300, borderRadius: "50%", background: "#111", border: "26px solid #555" }} />
    <div style={{ position: "absolute", left: 1000, top: 220 + (1 - t) * 200, opacity: t }}>
      <div style={{ width: 300, height: 260, background: "rgba(240,190,40,.85)", borderRadius: 18 }}><div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 130, textAlign: "center", paddingTop: 50 }}>15</div></div>
      <div style={{ display: "flex", gap: 80, marginLeft: 70 }}><div style={{ width: 40, height: 170, background: "#ccc" }} /><div style={{ width: 40, height: 170, background: "#ccc" }} /></div></div>
    <Lbl size={44} col="#fff" style={{ position: "absolute", left: 360, top: 760 }}>12 V SOCKET · 10–15 A FUSE ≈ 120–180 W</Lbl>
  </AbsoluteFill>;
};

// ================= surge (396): el amperímetro de pinza: pico de arranque del compresor y se asienta
const Surge: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const a0 = M(m, 0, 20); const x = f - a0;
  const w = x < 0 ? 0 : x < 8 ? 1100 * (x / 8) : x < 30 ? 1100 - (x - 8) * 43 : 150 + Math.sin(f / 4) * 6;
  return <AbsoluteFill style={{ background: "#e3e6e8" }}>
    <div style={{ position: "absolute", left: 640, top: 140, width: 640, height: 800, background: "#e9b21c", borderRadius: "40px 40px 60px 60px" }}>
      <div style={{ margin: 70, height: 260, background: "#2d3a2c", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 30 }}>
        <div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 140, color: "#bfe8b0" }}>{Math.round(Math.max(0, w))}</div></div>
      <Lbl size={48} style={{ textAlign: "center" }}>WATTS</Lbl></div>
    <Lbl size={36} style={{ position: "absolute", left: 120, top: 860 }}>COMPRESSOR START: A 1-SECOND SURGE, THEN IT SETTLES</Lbl>
  </AbsoluteFill>;
};

// ================= prize (413): «THE PRIZE» — el sobre de premio se abre y sale la tarjeta
const Prize: React.FC<P> = () => {
  const f = useCurrentFrame(); const o = k(f, 6, 16), c = k(f, 18, 14);
  return <Oak>
    <div style={{ position: "absolute", left: 560, top: 380, width: 800, height: 460, background: "#d9c08a", boxShadow: "8px 12px 0 rgba(0,0,0,.3)", perspective: 1000 }}>
      <div style={{ position: "absolute", left: 80, right: 80, top: 40 - c * 300, height: 380, background: CREAM, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: INK, textAlign: "center" }}>WHAT I'D<br />BUY</div></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 0, borderLeft: "400px solid transparent", borderRight: "400px solid transparent", borderTop: "260px solid #c9ad72", transformOrigin: "50% 0", transform: `rotateX(${o * 180}deg)` }} />
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
  return <AbsoluteFill style={{ background: "#2b2f33" }}>
    <div style={{ position: "absolute", left: 620, top: 40, width: 680, height: 980, background: "#fbfaf5", boxShadow: "6px 10px 0 rgba(0,0,0,.4)", fontFamily: "monospace", padding: "50px 50px", clipPath: `inset(0 0 ${100 - 100 * k(f, 0, 18)}% 0)` }}>
      <div style={{ fontSize: 40, fontWeight: 900, textAlign: "center" }}>BUDGET · ${fmt(+key)}</div>
      <div style={{ borderTop: "3px dashed #999", margin: "24px 0" }} />
      {items.slice(0, show).map(([n, p], i) => { const nw = i >= (key === "1000" ? [0, 1, 3][step] ?? 0 : 0); const t = nw ? k(f, 8 + (i - (key === "1000" ? [0, 1, 3][step] : 0)) * 12, 8) : 1;
        return <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 34, fontWeight: 700, marginBottom: 26, opacity: t }}><span>{n}</span><span>~${fmt(p)}</span></div>; })}
      <div style={{ borderTop: "3px dashed #999", margin: "24px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 50, fontWeight: 900 }}><span>TOTAL</span><span style={{ color: tot > +key ? GN : INK }}>~${fmt(tot)}</span></div>
      <div style={{ fontSize: 24, color: "#777", marginTop: 20 }}>RANGES WHERE I SHOP · YOURS WILL VARY</div>
    </div>
  </AbsoluteFill>;
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
