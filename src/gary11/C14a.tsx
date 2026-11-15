// gary14a · «Power Station or Generator?» — componentes propios, PURO CSS/DOM (sin SVG, sin blur grande, sin grano ni viñeta).
// Mundo: la pelea de 10 rounds en el taller de Gary (roble, concreto de garaje, acero cepillado, papel, cinta). Registro: D:/rtmp/gary14_COMPONENTES.md
// m = cuadros (relativos al plano) en que se dice cada palabra ancla; dur = cuadros del plano.
// r2 (EVALUADOR ronda 1): actores con material real (generador con bastidor/tapa/arranque, bidón con asas y pico, radiador de aceite,
// caldera con persiana, casa+medidor+poste con liniero, usina con chimenea, balde galvanizado, toma de 12 V, campanilla, turnero),
// fondos de concreto/roble/acero en vez de grises planos, textos que nunca se salen de su caja.
import React from "react";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
// r3 (EVALUADOR ronda 2): fondos = fotos REALES del video bajo un degradé que oscurece; actores = copias en papel fotográfico de esas fotos
// con sombra real (cada foto en ≤2 escenas). Se quitaron las rayas «roble», el concreto en baldosas y los aparatos dibujados.
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

// ---------- fondos: una foto real del video, cubriendo todo, bajo un degradé suave que oscurece (nada de blur)
const IMG = (n: string) => `url(${staticFile(`gary14a/g/${n}.png`)})`;
const Plate: React.FC<{ src: string; d?: number; pos?: string; children?: React.ReactNode }> = ({ src, d = 0.62, pos = "50% 50%", children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <AbsoluteFill style={{ backgroundImage: IMG(src), backgroundSize: "cover", backgroundPosition: pos, transform: `scale(${1.04 + f * 0.0004})` }} />
    <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(12,14,18,${d - 0.08}) 0%, rgba(12,14,18,${d}) 55%, rgba(12,14,18,${Math.min(0.92, d + 0.14)}) 100%)` }} />
    {children}
  </AbsoluteFill>;
};
const Oak: React.FC<{ children?: React.ReactNode; src?: string; d?: number }> = ({ children, src = "g1900", d }) => <Plate src={src} d={d}>{children}</Plate>;
const Concrete: React.FC<{ children?: React.ReactNode; src?: string; d?: number }> = ({ children, src = "g0460", d }) => <Plate src={src} d={d}>{children}</Plate>;
// copia en papel fotográfico: borde crema, sombra de contacto + sombra proyectada, leve giro
const Print: React.FC<{ src: string; w: number; h: number; x?: number; y?: number; rot?: number; e?: number; pos?: string; zoom?: number; cap?: string; capCol?: string; style?: CSS; children?: React.ReactNode }> =
  ({ src, w, h, x, y, rot = 0, e = 1, pos = "50% 50%", zoom = 1, cap, capCol = INK, style, children }) => (
  <div style={{ position: x === undefined ? "relative" : "absolute", left: x, top: y, width: w, height: h, padding: 14, paddingBottom: cap ? 64 + 14 : 14, background: "#f6f2e8", boxSizing: "content-box",
    transform: `translateY(${(1 - e) * 70}px) rotate(${rot}deg)`, opacity: cl(e * 1.6), boxShadow: "0 22px 30px rgba(0,0,0,.45), 0 4px 0 rgba(0,0,0,.25)", ...style }}>
    <div style={{ width: w, height: h, backgroundImage: IMG(src), backgroundSize: zoom === 1 ? "cover" : `${zoom * 100}% auto`, backgroundPosition: pos, position: "relative", overflow: "hidden" }}>{children}</div>
    {cap && <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, height: 64, display: "flex", alignItems: "center", fontFamily: SANS, fontWeight: 800, fontSize: 32, letterSpacing: 2, color: capCol, whiteSpace: "nowrap", overflow: "hidden" }}>{cap}</div>}
  </div>
);
// papel apoyado (sombra dura, nada de blur grande)
const Paper: React.FC<{ x: number; y: number; w: number; h: number | "auto"; rot?: number; e?: number; bg?: string; children?: React.ReactNode; style?: CSS }> = ({ x, y, w, h, rot = 0, e = 1, bg = CREAM, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: bg, transform: `translateY(${(1 - e) * 80}px) rotate(${rot}deg)`, opacity: cl(e * 1.4),
    boxShadow: "0 20px 28px rgba(0,0,0,.42), 0 3px 0 rgba(0,0,0,.2)", borderRadius: 4, ...style }}>{children}</div>
);
// letra a mano que se escribe (revela por recorte)
const Hand: React.FC<{ text: string; at: number; f: number; len?: number; size?: number; col?: string; style?: CSS }> = ({ text, at, f, len = 16, size = 58, col = INK, style }) => {
  const p = cl((f - at) / len); if (p <= 0) return null;
  // r4: revelado terminado = sin recorte (el último trazo de la letra a mano sobresale de la caja y se cortaba)
  return <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, whiteSpace: "nowrap", paddingRight: 12, clipPath: p >= 1 ? "none" : `inset(-30% ${100 - p * 100}% -30% -5%)`, ...style }}>{text}</div>;
};
const Lbl: React.FC<{ children: React.ReactNode; size?: number; col?: string; style?: CSS }> = ({ children, size = 34, col = INK, style }) =>
  <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: size, color: col, letterSpacing: 2, ...style }}>{children}</div>;
const Src: React.FC<{ text: string; f: number; at: number }> = ({ text, f, at }) =>
  <div style={{ position: "absolute", right: 70, bottom: 46, fontFamily: SANS, fontWeight: 700, fontSize: 32, color: "#fff", background: "rgba(20,24,30,.78)", padding: "8px 18px", borderRadius: 4, opacity: k(f, at, 10) }}>SOURCE · {text}</div>;
const Screw: React.FC<{ x: number; y: number; r?: number; rot?: number }> = ({ x, y, r = 14, rot = 30 }) =>
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #f4f4f4, #8a8f94 60%, #50555a)", boxShadow: "1px 2px 0 rgba(0,0,0,.35)" }}>
    <div style={{ position: "absolute", left: "15%", right: "15%", top: "50%", height: Math.max(2, r * 0.22), marginTop: -Math.max(1, r * 0.11), background: "#4a4f54", transform: `rotate(${rot}deg)` }} /></div>;

// ---------- ACTORES: copias de las fotos reales del video (misma huella que los actores dibujados de r2)
const Station: React.FC<{ s?: number; lit?: number; src?: string; pos?: string }> = ({ s = 1, src = "y1930", pos = "45% 55%" }) => <Print src={src} w={300 * s} h={220 * s} pos={pos} />;
const Gen: React.FC<{ s?: number; run?: number; src?: string; pos?: string }> = ({ s = 1, run = 0, src = "y2570", pos = "55% 55%" }) => {
  const f = useCurrentFrame(); const j = run ? Math.sin(f * 2.1) * 1.2 * run : 0;
  return <div style={{ transform: `translateY(${j}px)` }}><Print src={src} w={360 * s} h={270 * s} pos={pos} /></div>;
};
const JerryCan: React.FC<{ s?: number; label?: string; src?: string; pos?: string; rot?: number }> = ({ s = 1, label, src = "y1530", pos = "50% 50%", rot = 0 }) =>
  <Print src={src} w={300 * s} h={330 * s} pos={pos} rot={rot} cap={label} capCol={GN} />;

// ================= SERIE: EL MARCADOR DE 10 ROUNDS (round:N) — tablero de madera con persianas numeradas
const ROUNDS = ["AIR", "POWER", "HOURS", "FUEL", "COLD", "FURNACE", "NOISE & THEFT", "UPKEEP", "MONEY", "LIFE"];
const Round: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const n = +a[0];
  return <Oak src="y1560" d={0.68}>
    <div style={{ position: "absolute", left: 80, top: 110, width: 1760, height: 660, background: "#23201c", borderRadius: 10, boxShadow: "0 14px 0 rgba(0,0,0,.35)", padding: "30px 30px 100px", display: "flex", gap: 14, perspective: 900, boxSizing: "border-box" }}>
      {ROUNDS.map((r, i) => {
        const on = i + 1 === n, past = i + 1 < n, t = on ? k(f, 4, 14) : 1;
        return <div key={i} style={{ flex: 1, position: "relative", background: "#141210", borderRadius: 6, overflow: "hidden" }}>
          {on || past ? <div style={{ position: "absolute", inset: 8, background: on ? YEL : "#5a5246", transformOrigin: "50% 0", transform: `rotateX(${(1 - t) * -88}deg)`, borderRadius: 4,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: on ? INK : "#cfc6b6" }}>{i + 1}</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 26, letterSpacing: 0, lineHeight: 1.1, color: on ? INK : "#cfc6b6", textAlign: "center", padding: "0 4px" }}>{r}</div>
          </div> : <div style={{ position: "absolute", inset: 8, background: "#2a251f", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: "#6f6455" }}>{i + 1}</div>}
        </div>;
      })}
      <div style={{ position: "absolute", right: 40, bottom: 18, fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: YEL, opacity: k(f, 18) }}>{n} / 10</div>
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
  return <Oak src={final ? "y4110" : "y2590"} d={0.7}>
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
            <div style={{ width: 280, fontFamily: SANS, fontWeight: 700, fontSize: 28, whiteSpace: "nowrap" }}>{rd} {r}</div>
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
  return <Concrete src="g0460" d={0.66}>
    <div style={{ position: "absolute", left: 955, top: 120, width: 10, height: 860, background: YEL, transform: `scaleY(${k(f, 0, 18)})`, transformOrigin: "50% 0", boxShadow: "0 0 0 3px #b8901a" }} />
    <div style={{ position: "absolute", left: 110 + (1 - a) * -900, top: 345, display: "flex", flexDirection: "column", alignItems: "center", transform: "rotate(-2deg)" }}><Station s={2.45} /><Lbl col={CREAM} size={48} style={{ marginTop: 34, background: ST, padding: "6px 24px", borderRadius: 6 }}>POWER STATION</Lbl></div>
    <div style={{ position: "absolute", right: 110 + (1 - b) * -900, top: 345, display: "flex", flexDirection: "column", alignItems: "center", transform: "rotate(2deg)" }}><Gen s={2.05} /><Lbl col={CREAM} size={48} style={{ marginTop: 34, background: GN, padding: "6px 24px", borderRadius: 6 }}>GENERATOR</Lbl></div>
    <div style={{ position: "absolute", left: 960, top: 170, transform: `translate(-50%,0) scale(${0.6 + 0.4 * v})`, opacity: v, fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: INK, background: CREAM, padding: "0 36px", boxShadow: "6px 10px 0 rgba(0,0,0,.3)", whiteSpace: "nowrap" }}>10 ROUNDS</div>
  </Concrete>;
};

// ================= carousel (015) y recap: diez tarjetas de round sobre una bandeja giratoria (lazy susan)
const Susan: React.FC<P & { order?: boolean; pick?: number }> = ({ m, order, pick }) => {
  const f = useCurrentFrame();
  const rot = order ? -((pick ?? 1) - 1) * 36 + (1 - io(f / 22)) * 36 : -f * 0.55;
  return <Oak src={order ? "y1560" : "g1900"} d={0.66}>
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
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 26, color: INK, letterSpacing: 0, textAlign: "center", lineHeight: 1.05, marginTop: 8 }}>{r}</div>
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
  return <Oak src={a[0] === "wooster" ? "y0430" : "y2680"} d={0.7}>
    <div style={{ position: "absolute", left: 140, top: 70, width: 1640, height: 940, perspective: 2000 }}>
      <div style={{ position: "absolute", inset: 0, background: "#efe6cf", transformOrigin: "0 50%", transform: `rotateY(${(1 - unf) * -70}deg)`, boxShadow: "8px 12px 0 rgba(0,0,0,.3)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, transparent 0 409px, rgba(0,0,0,.08) 409px 411px)" }} />
        {roads.map(([x1, y1, x2, y2, w], i) => { const L = Math.hypot(x2 - x1, y2 - y1), ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
          return <div key={i} style={{ position: "absolute", left: x1 - 140, top: y1 - 70, width: L, height: w, background: i < 2 ? "#c9453a" : "#7c8a94", transform: `rotate(${ang}deg)`, transformOrigin: "0 50%" }} />; })}
        {Object.entries(TOWNS).map(([n, p]) => <div key={n} style={{ position: "absolute", left: p.x - 140, top: p.y - 70 - 66, transform: "translateX(-50%)", whiteSpace: "nowrap", border: "2px solid #c9bea4", fontFamily: SERIF, fontWeight: 700, fontSize: 30, color: n === a[0] ? INK : "#8a8273", textTransform: "uppercase", background: "#efe6cf", padding: "0 8px" }}>{n}</div>)}
        <div style={{ position: "absolute", left: 24, bottom: 18, fontFamily: SANS, fontWeight: 700, fontSize: 26, color: "#8a8273", letterSpacing: 3, background: "#efe6cf", padding: "6px 14px", border: "2px solid #c9bea4" }}>WAYNE · ASHLAND · HOLMES COUNTIES, OHIO</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: t.x - 14, top: t.y - 14 - (1 - pin) * 200, width: 28, height: 28, borderRadius: "50%", background: "#d23b2f", boxShadow: "4px 6px 0 rgba(0,0,0,.35)", opacity: cl(pin * 3) }} />
    <Paper x={nx} y={ny} w={600} h={170} rot={3} e={tag} bg="#fff8e2">
      <div style={{ padding: "18px 26px" }}><Lbl size={26} col="#9a6a2a">WORK ORDER · {t.yr}</Lbl><Hand text={t.job} at={30} f={f} size={36} style={{ marginTop: 8 }} /></div>
    </Paper>
  </Oak>;
};

// ================= exhaust (040): bidón → generador en marcha → bocanadas «CO» que salen del escape
const Exhaust: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const co = M(m, 0, 40);
  return <Plate src="y2660" d={0.6}>
    <Print src="y1090" x={80} y={300} w={640} h={460} rot={-2} e={k(f, 0)} cap="FUEL GOES IN THE TANK CAP" capCol={GN} />
    <Print src="y0410" x={860} y={250} w={900} h={560} rot={1.5} e={k(f, 4)} cap="RUNNING · EXHAUST OUT THE SIDE" />
    <Lbl size={54} col={CREAM} style={{ position: "absolute", left: 80, top: 930, opacity: k(f, co), background: "rgba(24,26,30,.85)", padding: "8px 26px", borderRadius: 6, whiteSpace: "nowrap" }}>CARBON MONOXIDE · <span style={{ color: "#ff8a6a" }}>NO SMELL, NO COLOR</span></Lbl>
  </Plate>;
};
// ================= stat:cdc (042): números pintados con plantilla en la pared de madera del garaje, con la fuente
const Stencil: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame();
  const rows = [["400+", "DIE EVERY YEAR", "non-fire carbon monoxide"], ["100,000+", "ER VISITS", "every year"]];
  return <Plate src="g0290" d={0.72}>
    {rows.map(([n, l, s], i) => { const at = M(m, i, 10 + i * 90), t = k(f, at, 8);
      return <div key={i} style={{ position: "absolute", left: 110, top: 110 + i * 420, opacity: t }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 200, lineHeight: 1, color: i === 0 ? "#ff6a55" : CREAM, letterSpacing: 4, clipPath: `inset(-10% ${100 - t * 100}% -10% 0)` }}>{n}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginTop: 14 }}><Lbl size={56} col={CREAM}>{l}</Lbl><Lbl size={34} col="#d9cdb5" style={{ fontWeight: 600 }}>{s}</Lbl></div>
      </div>; })}
    <Print src="y0360" x={1200} y={130} w={600} h={700} rot={2} e={k(f, 4)} pos="50% 40%" cap="CO CHECK IN A HOUSE" />
    <Src text="CDC — Carbon Monoxide Poisoning Prevention" f={f} at={20} />
  </Plate>;
};
// ================= twenty (045): la cinta métrica sale de la pared de la casa hasta el generador, 20 FT
const Tape20: React.FC<P> = ({ m }) => {
  // r4: sin cinta dibujada; las dos copias reales y el contador de pies entre ellas
  const f = useCurrentFrame(); const t = io((f - 10) / 50), ft = Math.round(t * 20);
  return <Plate src="y0430" d={0.58}>
    <Print src="g1810" x={60} y={250} w={420} h={480} rot={-2} cap="THE HOUSE" />
    <Print src="y0080" x={1390} y={250} w={440} h={480} rot={2} e={k(f, 50)} cap="GENERATOR" capCol={GN} />
    <div style={{ position: "absolute", left: 540, top: 330, width: 820, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 220, color: CREAM, lineHeight: 1, whiteSpace: "nowrap" }}>{ft} FT</div>
    <Lbl size={44} col={YEL} style={{ position: "absolute", left: 540, top: 590, width: 820, textAlign: "center", whiteSpace: "nowrap" }}>AT LEAST 20 FEET OUT</Lbl>
    <Lbl size={40} col={CREAM} style={{ position: "absolute", left: 60, top: 900, opacity: k(f, M(m, 0, 120)), background: "rgba(29,36,48,.88)", padding: "10px 24px", borderRadius: 6, whiteSpace: "nowrap" }}>EXHAUST POINTED AWAY FROM DOORS, WINDOWS & VENTS</Lbl>
  </Plate>;
};
// ================= SERIE hose:* — la analogía: tanque de acrílico con marco de acero, manguera de goma con pico de bronce
const Hose: React.FC<P> = ({ a, m }) => {
  const f = useCurrentFrame(); const v = a[0];
  const cfg: Record<string, [number, number, string, string]> = { // ancho manguera, nivel tanque, rótulo izq, rótulo der
    watts: [64, 0.7, "WATTS = HOW HARD IT PUSHES", "WATT-HOURS = HOW LONG"], wide: [104, 0.7, "WATTS = HOSE WIDTH", "WATT-HOURS = WATER IN THE TANK"],
    gen: [40, 1, "GENERATOR · SMALL HOSE", "HUGE TANK (YOUR GAS CANS)"], station: [104, 0.32, "POWER STATION · WIDE HOSE", "SMALL TANK · ~1,000 Wh"], half: [104, 0.32, "1,800 W FLAT OUT", "EMPTY IN ~30 MIN"] };
  // r4: sin tanque ni manguera dibujados; la foto real de la manguera y las dos ideas en texto (y en «half» el % que cae)
  const [, lvl0, L1, L2] = cfg[v]; const pct = Math.round((v === "half" ? interpolate(f, [8, 80], [1, 0], CL) : lvl0) * 100);
  return <Plate src="y0740" d={0.5}>
    <div style={{ position: "absolute", left: 110, bottom: 110, background: "rgba(24,26,30,.88)", padding: "30px 44px", borderRadius: 8, opacity: k(f, M(m, 0, 4)) }}>
      <Lbl size={60} col={CREAM} style={{ whiteSpace: "nowrap" }}>{L1}</Lbl>
      <Lbl size={60} col="#8cc6ee" style={{ marginTop: 18, opacity: k(f, M(m, 1, 30)), whiteSpace: "nowrap" }}>{L2}</Lbl>
    </div>
    {v === "half" && <div style={{ position: "absolute", right: 120, top: 110, fontFamily: SERIF, fontWeight: 900, fontSize: 220, lineHeight: 1, color: pct < 20 ? "#ff8a6a" : CREAM }}>{pct}%</div>}
  </Plate>;
};

// ================= sticker (087): la chapa de datos de la heladera (aluminio remachado), el 6 A resaltado con marcador
const Sticker: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const hl = k(f, M(m, 0, 40), 14);
  const rows: [string, string, boolean?][] = [["MODEL", "RF-21 · TOP FREEZER"], ["SERIAL", "0419 23 77 · MADE 2019"], ["SUPPLY", "115 V ~ 60 Hz · 1 PH"], ["RATED", "6.0 A", true], ["DEFROST HEATER", "450 W"], ["REFRIGERANT", "R-600a · 2.1 oz"]];
  // r4: tarjeta lisa oscura (sin aluminio cepillado ni tornillos), el 6 A con marcador
  const emb: CSS = { color: CREAM };
  return <Plate src="y0910" d={0.62}>
    <div style={{ position: "absolute", left: 300, top: 110, width: 1320, height: 840, background: "rgba(20,24,30,.9)", borderRadius: 10, boxShadow: "0 22px 30px rgba(0,0,0,.45)", transform: `translateY(${(1 - k(f, 0)) * 60}px)`, opacity: k(f, 0) }}>
      <div style={{ padding: "50px 90px" }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 60, letterSpacing: 6, ...emb }}>REFRIGERATOR / FREEZER</div>
        <div style={{ height: 4, background: "rgba(243,236,220,.4)", margin: "18px 0 10px" }} />
        {rows.map(([l, v, hot], i) => <div key={i} style={{ display: "flex", alignItems: "center", height: 96, borderBottom: "2px solid rgba(243,236,220,.18)", position: "relative" }}>
          {hot && <div style={{ position: "absolute", left: -16, right: 300, top: 14, bottom: 14, background: YEL, transform: `scaleX(${hl})`, transformOrigin: "0 50%" }} />}
          <div style={{ position: "relative", width: 460, fontFamily: SANS, fontWeight: 800, fontSize: 38, letterSpacing: 3, ...emb, color: hot && hl > 0.5 ? INK : CREAM }}>{l}</div>
          <div style={{ position: "relative", fontFamily: SANS, fontWeight: 900, fontSize: hot ? 66 : 46, ...emb, color: hot && hl > 0.5 ? INK : CREAM }}>{v}</div>
        </div>)}
      </div>
    </div>
  </Plate>;
};
// ================= fridgehours (094): la batería como un reloj de arena horizontal; la heladera la vacía en 10-12 h
const Hourglass: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const t = io(f / dur), h = Math.round(t * 11), left = 1 - t * 0.95;
  return <Plate src="y3720" d={0.68}>
    <div style={{ position: "absolute", left: 110, top: 110, width: 1640, height: 250, background: "linear-gradient(#3a444d,#232a30)", borderRadius: 30, padding: 24, boxShadow: "0 22px 30px rgba(0,0,0,.45)", boxSizing: "border-box" }}>
      <div style={{ width: `${left * 100}%`, height: "100%", background: `linear-gradient(90deg, ${ST}, #6fd1b8)`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 24, boxSizing: "border-box" }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 84, color: "#0f2a24" }}>{left > 0.2 ? `${Math.round(left * 100)}%` : ""}</div></div>
      {left <= 0.2 && <div style={{ position: "absolute", left: `${left * 100 + 4}%`, top: 0, bottom: 0, display: "flex", alignItems: "center", fontFamily: SANS, fontWeight: 900, fontSize: 84, color: "#ff8a6a" }}>{Math.round(left * 100)}%</div>}
    </div>
    <div style={{ position: "absolute", left: 1750, top: 180, width: 40, height: 110, background: "#2c343c", borderRadius: 8 }} />
    <Print src="y1340" x={110} y={440} w={620} h={440} rot={-2} cap="FRIDGE ONLY · DOOR SHUT" />
    <div style={{ position: "absolute", left: 860, top: 440 }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 220, color: CREAM, lineHeight: 1 }}>{h}<span style={{ fontSize: 100 }}> h</span></div>
      <Lbl size={40} col={CREAM} style={{ marginTop: 6 }}>RUNNING ON A 1,000 Wh BATTERY</Lbl>
      <Lbl size={56} col={YEL} style={{ marginTop: 30, opacity: k(f, dur * 0.5) }}>≈ 10–12 HOURS TO EMPTY</Lbl>
    </div>
  </Plate>;
};
// ================= drain750 (098): radiador de aceite de 750 W y la aguja de combustible que cae en 1 h 15
const Drain: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const t = io(f / (dur * 0.8)), ang = -60 + 120 * (1 - t);
  return <Plate src="g2550" d={0.68}>
    <div style={{ position: "absolute", left: 130, top: 170, width: 600, height: 600, borderRadius: "50%", background: "conic-gradient(#6d757b,#e9edf0,#8d959b,#d9dee2,#5d666e,#c9ced3,#6d757b)", boxShadow: "0 22px 30px rgba(0,0,0,.45)" }}>
      <div style={{ position: "absolute", inset: 26, borderRadius: "50%", background: CREAM }}>
        {Array.from({ length: 9 }).map((_, i) => { const a = -60 + i * 15; return <div key={i} style={{ position: "absolute", left: 274, top: 30, width: i % 2 ? 4 : 8, height: i % 2 ? 30 : 50, marginLeft: i % 2 ? -2 : -4, background: i < 2 ? GN : INK, transformOrigin: `50% 244px`, transform: `rotate(${a}deg)` }} />; })}
        <div style={{ position: "absolute", left: 40, top: 110, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: GN }}>E</div>
        <div style={{ position: "absolute", right: 44, top: 110, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: INK }}>F</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#7a6a50", letterSpacing: 3 }}>FUEL</div>
        <div style={{ position: "absolute", left: 269, top: 64, width: 10, height: 210, background: GN, transformOrigin: "50% 210px", transform: `rotate(${ang}deg)`, borderRadius: 5 }} />
        <div style={{ position: "absolute", left: 250, top: 250, width: 48, height: 48, borderRadius: "50%", background: "radial-gradient(#777,#222)" }} />
      </div>
    </div>
    <Print src="g0960" x={860} y={150} w={940} h={620} rot={1.5} e={k(f, 2)} cap="750 W SPACE HEATER ON THE STATION" />
    <Lbl size={76} col={YEL} style={{ position: "absolute", left: 130, top: 860, whiteSpace: "nowrap" }}>{`${Math.floor(t * 75 / 60)}:${String(Math.round(t * 75) % 60).padStart(2, "0")}`} h → EMPTY</Lbl>
  </Plate>;
};
// ================= fridgelist (102): la lista con imán en la puerta de la heladera
const FridgeList: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const items = ["the fridge", "furnace blower", "internet", "lights", "phones"];
  return <Plate src="y1340" d={0.5}>
    <Paper x={520} y={70} w={860} h={940} rot={2} e={k(f, 0)} bg="#fffdf4" style={{ boxShadow: "0 22px 30px rgba(0,0,0,.45), 0 4px 0 rgba(0,0,0,.2)" }}>
      <div style={{ position: "absolute", left: 380, top: -26, width: 100, height: 60, borderRadius: 10, background: "#d23b2f", boxShadow: "3px 5px 0 rgba(0,0,0,.3)" }} />
      <div style={{ padding: "70px 60px" }}>
        <Hand text="BATTERY RUNS:" at={4} f={f} size={64} col="#1f4f8f" />
        {items.map((s, i) => <Hand key={i} text={`• ${s}`} at={M(m, i, 20 + i * 24)} f={f} size={60} style={{ marginTop: 18 }} />)}
        <Hand text="HEAT NEVER TOUCHES" at={M(m, 5, 150)} f={f} size={60} col={GN} style={{ marginTop: 36 }} />
        <Hand text="THE BATTERY." at={M(m, 5, 150) + 12} f={f} size={60} col={GN} />
      </div>
    </Paper>
  </Plate>;
};
// ================= SERIE napkin:0-6 — la cuenta en la servilleta, renglón por renglón
const NAP = ["Wh × 0.85 ÷ watts = hours", "2,000 Wh × 0.85 = 1,700", "fridge ≈ 75 W", "furnace blower ≈ 130 W avg", "internet, lights, phones ≈ 40 W", "total ≈ 250 W", "1,700 ÷ 250 ≈ 6.8 h"];
const Napkin: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const n = +a[0];
  return <Oak src="g4000" d={0.66}>
    <div style={{ position: "absolute", left: 440, top: 60, width: 1040, height: 960, background: "#fbfbf7", transform: "rotate(-2deg)", boxShadow: "6px 10px 0 rgba(0,0,0,.25)",
      clipPath: "polygon(0 2%,3% 0,97% 1%,100% 3%,99% 97%,96% 100%,2% 99%,0 96%)" }}>
      <div style={{ padding: "60px 80px" }}>
        {NAP.slice(0, n + 1).map((s, i) => { const last = i === 6 && n === 6;
          const line = <Hand text={s} at={i === n ? 4 : -99} f={f} len={22} size={last ? 84 : 62} col={i === n ? "#1f4f8f" : "#555"} />;
          return <div key={i} style={{ position: "relative", marginBottom: last ? 0 : 30, display: "inline-block", width: "100%" }}>
            {line}
            {last && <div style={{ position: "absolute", left: -46, top: -26, width: 860, bottom: -26, border: `6px solid ${GN}`, borderRadius: "50%", transform: `scale(${k(f, 30, 10)}) rotate(-2deg)`, opacity: k(f, 30, 10) }} />}
          </div>; })}
      </div>
    </div>
  </Oak>;
};

// ================= cans3 (150): bidones de 5 galones que caen sobre el piso del garaje: 1 día, 2, 3 = 15 galones
const Cans: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const at = [M(m, 0, 30), M(m, 1, 80), M(m, 2, 130)]; const SRC = ["y1530", "y1590", "g1610"];
  return <Plate src="g2320" d={0.66}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center" }}>
      <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: INK, background: CREAM, padding: "0 40px", boxShadow: "0 18px 26px rgba(0,0,0,.4)" }}>{f < at[1] ? 5 : f < at[2] ? 10 : 15} GALLONS</span></div>
    {at.map((t, i) => <div key={i} style={{ position: "absolute", left: 170 + i * 560, top: 300 - (1 - sp(f, t)) * 500, opacity: cl(sp(f, t) * 3), display: "flex", flexDirection: "column", alignItems: "center" }}>
      <JerryCan s={1.6} src={SRC[i]} label="5 GAL" rot={i === 1 ? 1.5 : -1.5} />
      <Lbl size={46} col={CREAM} style={{ marginTop: 26, background: "rgba(24,26,30,.85)", padding: "4px 22px", borderRadius: 6 }}>DAY {i + 1}</Lbl></div>)}
  </Plate>;
};
// ================= datetape (158): la cinta de pintor sobre el costado del bidón y la fecha con marcador
const DateTape: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <Plate src="g1550" d={0.38}>
    <div style={{ position: "absolute", left: 240, top: 420, width: 1440 * k(f, 2, 14), height: 230, background: "#e8d9a8", transform: "rotate(-3deg)", boxShadow: "0 14px 20px rgba(0,0,0,.4)", overflow: "hidden" }}>
      <Hand text="FILLED 11 / 03 · STABILIZER ✓" at={14} f={f} len={26} size={100} style={{ padding: "50px 60px" }} /></div>
  </Plate>;
};
// ================= refill3 (165): tres cables que llegan a las tomas de la power station: generador, camioneta, panel
const Refill: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame();
  const src: [string, string, string, number][] = [["y3110", "1 · GENERATOR", "fast · a few hours", -1.5], ["y3750", "2 · YOUR VEHICLE", "slow · 120–180 W", 1], ["g1740", "3 · SOLAR PANEL", "only if the sun shows", -1]];
  return <Plate src="y1430" d={0.72}>
    <Lbl size={52} col={CREAM} style={{ position: "absolute", left: 80, top: 70 }}>GRID DOWN · ONLY 3 WAYS TO REFILL THE STATION</Lbl>
    {src.map(([s, l, sub, r], i) => { const t = k(f, M(m, i, 10 + i * 50), 14);
      return <React.Fragment key={i}>
        <Print src={s} x={80 + i * 600} y={210} w={520} h={580} rot={r} e={t} cap={l} capCol={i === 0 ? GN : i === 1 ? "#2e4a73" : ST} />
        <Lbl size={34} col={CREAM} style={{ position: "absolute", left: 94 + i * 600, top: 920, opacity: t, whiteSpace: "nowrap" }}>{sub}</Lbl>
      </React.Fragment>; })}
  </Plate>;
};
// ================= sunarc (172): el sol bajo de invierno cruza en arco y el contador de Wh sube; panel con patas y nieve
const SunArc: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const t = io(f / dur);
  return <Plate src="g1710" d={0.42}>
    <Print src="y1680" x={820} y={140} w={980} h={660} rot={1.5} e={k(f, 0)} cap="400 W PANEL · AFTER YOU CLEAR THE SNOW" />
    <div style={{ position: "absolute", left: 100, top: 180, width: 620, background: CREAM, padding: "26px 36px", boxSizing: "border-box", boxShadow: "0 22px 30px rgba(0,0,0,.45)" }}>
      <Lbl size={30} col="#3d4a57">INTO THE BATTERY</Lbl>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 130, color: INK, lineHeight: 1.05 }}>{fmt(t * 700)} Wh</div>
      <Lbl size={30} col="#3d4a57" style={{ marginTop: 8 }}>BY SUNDOWN</Lbl></div>
    <div style={{ position: "absolute", left: 100, top: 560, width: 620 }}>
      <div style={{ height: 34, background: "rgba(255,255,255,.25)", borderRadius: 17, position: "relative" }}>
        <div style={{ width: `${t * 100}%`, height: "100%", background: "linear-gradient(90deg,#f2c230,#ffd86a)", borderRadius: 17 }} />
        <div style={{ position: "absolute", left: `calc(${t * 100}% - 28px)`, top: -11, width: 56, height: 56, borderRadius: "50%", background: "#ffd86a", boxShadow: "0 0 0 8px rgba(255,216,106,.35)" }} /></div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22 }}><Lbl size={32} col={CREAM}>8 AM</Lbl><Lbl size={32} col={CREAM}>4:30 PM</Lbl></div>
    </div>
    <Lbl size={36} col={CREAM} style={{ position: "absolute", left: 100, top: 920, whiteSpace: "nowrap" }}>LOW WINTER SUN · ABOUT A THIRD OF A SUMMER DAY</Lbl>
  </Plate>;
};
// ================= lock32 (191): el termómetro baja a 32°F y un candado se cierra sobre la batería
const Lock32: React.FC<P> = ({ dur }) => {
  // r4: sin termómetro ni candado dibujados; la foto real de la pantalla de la estación de fondo y el número que baja
  const f = useCurrentFrame(); const deg = Math.round(interpolate(f, [0, dur * 0.6], [45, 32], CL)), lk = k(f, dur * 0.6, 8);
  return <Plate src="g1920" d={0.5} pos="70% 50%">
    <div style={{ position: "absolute", left: 120, top: 150, fontFamily: SERIF, fontWeight: 900, fontSize: 260, lineHeight: 1, color: deg <= 32 ? "#7fc4ff" : CREAM }}>{deg}°F</div>
    <Lbl size={44} col={CREAM} style={{ position: "absolute", left: 130, top: 430, whiteSpace: "nowrap" }}>IN AN UNHEATED GARAGE</Lbl>
    <Lbl size={46} col={CREAM} style={{ position: "absolute", left: 120, top: 900, opacity: lk, background: "rgba(29,36,48,.88)", padding: "10px 26px", borderRadius: 6, whiteSpace: "nowrap" }}>LITHIUM WON'T CHARGE BELOW 32°F</Lbl>
  </Plate>;
};
// ================= furnaceparts (215): la caldera de gas con persiana y mirilla; cada parte sale en su palabra como cajón
const Drawers: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const parts: [string, string][] = [["IGNITER", "lights the gas"], ["CONTROL BOARD", "runs the whole sequence"], ["INDUCER FAN", "pushes the exhaust out"], ["BLOWER", "moves the warm air"]];
  const PX = 100 + 700 + 28;
  return <Plate src="g2180" d={0.76}>
    <Lbl size={50} col={CREAM} style={{ position: "absolute", left: 100, top: 46, whiteSpace: "nowrap" }}>A GAS FURNACE STILL NEEDS ELECTRICITY</Lbl>
    <Print src="y2120" x={100} y={150} w={700} h={760} rot={-1} cap="MY BASEMENT FURNACE" />
    {parts.map(([p, s], i) => { const t = k(f, M(m, i, 8 + i * 40), 12), cy = 250 + i * 200;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: PX - 8, top: cy - 8, width: 16, height: 16, borderRadius: "50%", background: YEL, opacity: t }} />
        <div style={{ position: "absolute", left: PX, top: cy - 3, width: 150, height: 6, background: YEL, transform: `scaleX(${t})`, transformOrigin: "0 50%" }} />
        <div style={{ position: "absolute", left: 1000, top: cy - 75, width: 800, height: 150, background: CREAM, borderRadius: 8, boxShadow: "0 18px 26px rgba(0,0,0,.4)", display: "flex", alignItems: "center", gap: 28, padding: "0 34px", boxSizing: "border-box", opacity: t, transform: `translateX(${(1 - t) * 80}px)` }}>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: INK, color: CREAM, fontFamily: SERIF, fontWeight: 900, fontSize: 46, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
          <div><Lbl size={50} style={{ whiteSpace: "nowrap" }}>{p}</Lbl><Lbl size={30} col="#6a5a40" style={{ fontWeight: 600, letterSpacing: 1 }}>{s}</Lbl></div>
        </div>
      </React.Fragment>; })}
  </Plate>;
};
// ================= sine (219): la onda dibujada con cuentas (puntos DOM): pura vs escalonada
const Sine: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const n = 400;
  return <AbsoluteFill style={{ background: "#0f1a14" }}>
    <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(120,255,170,.12) 0 2px, transparent 2px 90px), repeating-linear-gradient(90deg, rgba(120,255,170,.12) 0 2px, transparent 2px 90px)" }} />
    {Array.from({ length: n }).map((_, i) => { const x = 160 + i * 4, ph = i / 40 + f / 10; const vis = i < (f / dur) * n * 1.8;
      const y1 = 330 - Math.sin(ph) * 150, s = Math.sin(ph), y2 = 760 - Math.sign(s) * (Math.abs(s) > 0.5 ? 150 : 70);
      return vis ? <React.Fragment key={i}><div style={{ position: "absolute", left: x, top: y1 - 6, width: 10, height: 12, borderRadius: 5, background: "#7dffb0" }} /><div style={{ position: "absolute", left: x, top: y2 - 6, width: 10, height: 12, borderRadius: 2, background: "#ff8a6a" }} /></React.Fragment> : null; })}
    <Lbl size={44} col="#7dffb0" style={{ position: "absolute", left: 160, top: 90 }}>PURE SINE WAVE ✓</Lbl>
    <Lbl size={44} col="#ff8a6a" style={{ position: "absolute", left: 160, top: 950 }}>CHOPPY POWER ✗ (FURNACE BOARDS HATE IT)</Lbl>
  </AbsoluteFill>;
};
// ================= backfeedline (235): la corriente sale por el medidor de la casa, sube al transformador del poste y al liniero
const Backfeed: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const hv = k(f, M(m, 0, dur * 0.7), 8); const t = io((f - 4) / (dur * 0.7));
  const hops = ["YOUR PANEL", "TRANSFORMER", "THE LINE"];
  return <Plate src="g0040" d={0.72}>
    <Lbl size={40} col={CREAM} style={{ position: "absolute", left: 80, top: 50 }}>BACKFEEDING · NO INTERLOCK</Lbl>
    <Lbl size={88} col="#ff6a55" style={{ position: "absolute", left: 80, top: 100, fontFamily: SERIF, opacity: hv, transform: `scale(${0.7 + 0.3 * hv})`, transformOrigin: "0 50%", whiteSpace: "nowrap" }}>THOUSANDS OF VOLTS</Lbl>
    <Lbl size={40} col={CREAM} style={{ position: "absolute", left: 80, top: 215, opacity: hv, whiteSpace: "nowrap" }}>ON THE LINE A LINEMAN IS HOLDING</Lbl>
    <Print src="y2330" x={80} y={330} w={620} h={500} rot={-2} cap="THE DRYER OUTLET" capCol={GN} />
    {hops.map((h, i) => { const p = cl(t * 3 - i);
      return <div key={i} style={{ position: "absolute", left: 762, top: 400 + i * 150, width: 300, height: 96, background: "rgba(24,26,30,.9)", borderLeft: `10px solid ${GN}`, borderRadius: 6, display: "flex", alignItems: "center", paddingLeft: 18, boxSizing: "border-box", opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
        <Lbl size={30} col={CREAM} style={{ whiteSpace: "nowrap", letterSpacing: 1 }}>→ {h}</Lbl></div>; })}
    <Print src="y2360" x={1110} y={300} w={720} h={580} rot={1.5} cap="LINEMAN ON THE POLE" />
  </Plate>;
};
// ================= sequence (240): el tablero con la placa del interlock de acero; las palancas en orden, la lista se tilda al costado
const Interlock: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const steps = ["GENERATOR ON ITS CORD", "INTERLOCK SLID", "MAIN BREAKER OFF", "GENERATOR BREAKER ON", "FURNACE BREAKER ON"];
  return <Plate src="y0111" d={0.74}>
    <Print src="y2291" x={90} y={110} w={820} h={760} rot={-1.5} cap="THE INTERLOCK PLATE ON MY PANEL" />
    <div style={{ position: "absolute", left: 1020, top: 130 }}>
      {steps.map((s, i) => { const on = f >= M(m, i, 10 + i * 40);
        return <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, height: 160, opacity: on ? 1 : 0.45 }}>
          <div style={{ width: 76, height: 76, borderRadius: 10, background: on ? ST : "rgba(255,255,255,.18)", color: "#fff", fontFamily: SERIF, fontWeight: 900, fontSize: 48, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{on ? "✓" : i + 1}</div>
          <Lbl size={42} col={CREAM} style={{ background: on ? "rgba(29,36,48,.9)" : "transparent", padding: "8px 18px", borderRadius: 6, whiteSpace: "nowrap" }}>{s}</Lbl></div>; })}
    </div>
  </Plate>;
};
// ================= heatjob (246): «HEAT IS THE JOB» con marcador sobre el filtro plisado de la caldera
const HeatJob: React.FC<P> = () => {
  const f = useCurrentFrame();
  // r4: sin filtro de rayas; la foto real del blower y la frase
  return <Plate src="y2170" d={0.6}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 190, color: CREAM, whiteSpace: "nowrap", opacity: k(f, 2, 14), transform: `translateY(${(1 - k(f, 2, 14)) * 40}px)` }}>HEAT IS <span style={{ color: YEL }}>THE JOB.</span></div></div>
  </Plate>;
};
// ================= decibels (258): el decibelímetro de aguja en caja de baquelita; escala con cosas de la casa en una tarjeta
const Decibel: React.FC<P> = () => {
  const f = useCurrentFrame(); const v = interpolate(f, [6, 40], [30, 57], CL);
  const marks: [number, string][] = [[40, "fridge hum"], [57, "inverter gen @ 23 ft"], [60, "conversation"], [75, "vacuum"], [90, "open-frame, up close"]];
  // r4: sin decibelímetro dibujado; el generador real queda a la vista (foto con poca sombra) y la escala va en una tarjeta al costado
  return <Plate src="y3190" d={0.35} pos="30% 50%">
    <div style={{ position: "absolute", right: 70, top: 90, width: 720, background: "rgba(20,24,30,.9)", borderRadius: 10, padding: "34px 40px", boxSizing: "border-box", boxShadow: "0 22px 30px rgba(0,0,0,.45)" }}>
      <div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 130, color: "#bfe8b0", lineHeight: 1 }}>{Math.round(v)} dB</div>
      <Lbl size={34} col={CREAM} style={{ marginTop: 12 }}>HOW LOUD IS IT?</Lbl>
      {marks.map(([d, l], i) => <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 22, marginTop: 18, background: i === 1 ? YEL : "none", padding: "4px 12px", borderRadius: 4 }}>
        <div style={{ width: 90, fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: i === 1 ? INK : CREAM }}>{d}</div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 38, color: i === 1 ? INK : CREAM, whiteSpace: "nowrap" }}>{l}</div></div>)}
    </div>
  </Plate>;
};

// ================= hourbook (279): la planilla de horas del generador, renglonada; se anotan los services
const HourBook: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const rows = [["5 h", "FIRST OIL CHANGE", "11/04"], ["50 h", "oil change", "01/12"], ["100 h", "oil + spark plug check", "03/02"]];
  return <Oak src="y2810" d={0.68}>
    <Paper x={240} y={110} w={1440} h={840} rot={1} e={k(f, 0)} bg="#f6f0de" style={{ boxShadow: "0 22px 30px rgba(0,0,0,.45), 0 4px 0 rgba(0,0,0,.2)" }}>
      <div style={{ padding: "50px 70px" }}>
        <Lbl size={44} col="#7a6a50">GENERATOR HOUR LOG · 3,000 W</Lbl>
        <div style={{ display: "flex", marginTop: 30, borderBottom: `4px solid ${INK}`, paddingBottom: 8, fontFamily: SANS, fontWeight: 800, fontSize: 30, color: INK, letterSpacing: 2 }}>
          <div style={{ width: 260 }}>HOURS</div><div style={{ flex: 1 }}>SERVICE</div><div style={{ width: 220 }}>DATE</div></div>
        {rows.map(([h, t, d], i) => { const at = M(m, i, 8 + i * 40);
          return <div key={i} style={{ display: "flex", alignItems: "center", height: 150, borderBottom: "2px solid rgba(31,79,143,.3)" }}>
            <div style={{ width: 260 }}><Hand text={h} at={at} f={f} size={80} col="#1f4f8f" /></div>
            <div style={{ flex: 1 }}><Hand text={t} at={at + 6} f={f} size={68} /></div>
            <div style={{ width: 220 }}><Hand text={d} at={at + 12} f={f} size={60} col="#555" /></div></div>; })}
        <Hand text="(check your manual)" at={M(m, 3, 150)} f={f} size={54} col="#7a6a50" style={{ marginTop: 34 }} />
      </div>
    </Paper>
  </Oak>;
};
// ================= storeband (288): el indicador de carga con la franja 50-80 % y el almanaque «cada 3 meses»
const StoreBand: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const b = k(f, M(m, 0, 10), 16), cal = k(f, M(m, 1, 100), 14);
  return <Oak src="y1130" d={0.72}>
    <div style={{ position: "absolute", left: 210, top: 180, width: 1500, height: 170, background: "linear-gradient(#3a444d,#232a30)", borderRadius: 24, padding: 16, boxSizing: "border-box", boxShadow: "0 22px 30px rgba(0,0,0,.45)" }}>
      <div style={{ width: "65%", height: "100%", background: `linear-gradient(90deg, ${ST}, #6fd1b8)`, borderRadius: 14 }} />
      <div style={{ position: "absolute", left: 16 + 0.5 * 1468, top: -30, width: 0.3 * 1468 * b, height: 230, border: `8px solid ${YEL}`, borderRadius: 14, boxSizing: "border-box" }} />
    </div>
    {[0, 50, 80, 100].map((p) => <Lbl key={p} size={34} col={p === 50 || p === 80 ? YEL : CREAM} style={{ position: "absolute", left: 210 + 16 + (p / 100) * 1468 - 60, width: 120, textAlign: "center", top: 396 }}>{p}%</Lbl>)}
    <Lbl size={52} col={CREAM} style={{ position: "absolute", left: 210 + 0.5 * 1500, top: 456, opacity: b, background: "rgba(29,36,48,.85)", padding: "6px 22px", borderRadius: 6 }}>STORE AT 50–80 %</Lbl>
    <div style={{ position: "absolute", left: 0, right: 0, top: 590, display: "flex", justifyContent: "center", gap: 50, opacity: cal }}>{["JAN", "APR", "JUL", "OCT"].map((s, i) => <div key={i} style={{ width: 320, height: 360, background: "#fbf7ec", borderTop: `64px solid ${GN}`, boxShadow: "0 18px 26px rgba(0,0,0,.45)", position: "relative", transform: `rotate(${[-2.5, 1.5, -1, 2.2][i]}deg)` }}>
      <div style={{ position: "absolute", top: -54, left: 0, right: 0, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 40, color: "#fff", letterSpacing: 4 }}>{s}</div>
      <Hand text="top up ✓" at={M(m, 1, 100) + i * 8} f={f} size={60} col="#1f4f8f" style={{ padding: "100px 0 0 34px" }} /></div>)}</div>
  </Oak>;
};
// ================= SERIE shelf:gen|station — la góndola de la ferretería (pared de fenólico perforado); el cartel de precio voltea
const Shelf: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const g = a[0] === "gen"; const t = k(f, 10, 14);
  return <Plate src={g ? "y3910" : "y3030"} d={0.7}>
    <div style={{ position: "absolute", left: 960 - 330, top: 150 }}><Print src={g ? "y1110" : "y0570"} w={660} h={470} rot={g ? -1 : 1} /></div>
    <div style={{ position: "absolute", left: 600, top: 712, width: 720, height: 220, perspective: 800 }}>
      <div style={{ width: "100%", height: "100%", background: YEL, transformOrigin: "50% 0", transform: `rotateX(${(1 - t) * 90}deg)`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", boxShadow: "0 12px 18px rgba(0,0,0,.4)" }}>
        <Lbl size={34}>{g ? "3,000 W INVERTER GENERATOR" : "~1,000 Wh LiFePO4 STATION"}</Lbl>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: INK }}>{g ? "$800–1,500" : "$400–800"}</div>
      </div></div>
    <Lbl size={32} col="#e9e4d8" style={{ position: "absolute", left: 0, right: 0, top: 970, textAlign: "center" }}>PRICE RANGE WHERE I SHOP</Lbl>
  </Plate>;
};
// ================= pump (307): las ruedas numéricas del surtidor: galones y dólares por día
const Pump: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const t = io(f / (dur * 0.6));
  const Wheel = ({ v, l, c }: { v: string; l: string; c: string }) => <div style={{ marginBottom: 40 }}><Lbl size={32} col="#ccc">{l}</Lbl><div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 150, color: c, background: "#111", padding: "0 40px", borderRadius: 8, letterSpacing: 10, textAlign: "right", width: 880, boxSizing: "border-box", boxShadow: "inset 0 0 0 6px #333" }}>{v}</div></div>;
  return <Plate src="y1450" d={0.6}>
    <div style={{ position: "absolute", left: 420, top: 110, width: 1080, background: "linear-gradient(#333,#1f1f1f)", borderRadius: 20, padding: "50px 100px", boxSizing: "border-box", boxShadow: "0 22px 30px rgba(0,0,0,.5)" }}>
      <Wheel v={(5 * t).toFixed(1)} l="GALLONS / DAY (LIGHT LOAD)" c="#7dffb0" />
      <Wheel v={"$" + (16.5 * t).toFixed(2)} l="PER DAY @ ~$3.30/GAL" c={YEL} />
      <Lbl size={44} col="#fff" style={{ opacity: k(f, dur * 0.65) }}>A WEEK OUT ≈ $105–125 IN GAS</Lbl>
    </div>
  </Plate>;
};
// ================= SERIE plantbucket:1|2 y bucket — la usina (edificio + chimenea + torre) contra el balde galvanizado bajo la canilla
const Bucket: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const which = a[0] || "2"; const plant = which === "1"; const e = k(f, 0, 14);
  return <Plate src={plant ? "y1730" : "g0480"} d={0.74}>
    <Lbl size={68} col={CREAM} style={{ position: "absolute", left: 110, top: 70, fontFamily: SERIF, whiteSpace: "nowrap" }}>{plant ? "THE GENERATOR MAKES POWER." : "THE BATTERY HOLDS IT."}</Lbl>
    <div style={{ position: "absolute", left: 100, top: 220, opacity: plant ? 1 : 0.42, transform: `scale(${plant ? 1 + 0.03 * e : 0.94})`, transformOrigin: "50% 100%" }}>
      <Print src="y2220" w={780} h={600} rot={-1.5} cap="GENERATOR = A SMALL POWER PLANT" capCol={GN} /></div>
    <div style={{ position: "absolute", left: 1010, top: 220, opacity: plant ? 0.42 : 1, transform: `scale(${!plant ? 1 + 0.03 * e : 0.94})`, transformOrigin: "50% 100%" }}>
      <Print src="y2900" w={780} h={600} rot={1.5} cap="BATTERY = A BUCKET OF POWER" capCol={ST} /></div>
  </Plate>;
};
// ================= cycles (322): el cuentaciclos llega a 3.000 y la línea de capacidad baja a 80 %
const Cycles: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const t = io(f / (dur * 0.7)), cyc = Math.round(t * 3000), cap = 100 - 20 * t;
  return <Plate src="y3250" d={0.74}>
    <Print src="y1870" x={90} y={140} w={760} h={660} rot={-1.5} cap="LiFePO4 CELLS INSIDE THE PACK" />
    <div style={{ position: "absolute", left: 960, top: 140, fontFamily: "monospace", fontWeight: 900, fontSize: 190, color: "#7dffb0", background: "#000", padding: "0 40px", borderRadius: 10, boxShadow: "0 18px 26px rgba(0,0,0,.45)" }}>{String(cyc).padStart(4, "0")}</div>
    <Lbl size={40} col={CREAM} style={{ position: "absolute", left: 960, top: 380 }}>FULL CYCLES</Lbl>
    <div style={{ position: "absolute", left: 960, top: 500, width: 840, height: 120, border: "8px solid #9aa3ab", borderRadius: 16, padding: 10, boxSizing: "border-box", background: "rgba(0,0,0,.5)" }}>
      <div style={{ width: `${cap}%`, height: "100%", background: ST, borderRadius: 8 }} /></div>
    <div style={{ position: "absolute", left: 960, top: 650, display: "flex", alignItems: "baseline", gap: 24 }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: YEL, lineHeight: 1 }}>{Math.round(cap)}%</div>
      <Lbl size={40} col={CREAM}>CAPACITY LEFT</Lbl></div>
    <Lbl size={32} col="#cfd6da" style={{ position: "absolute", left: 90, top: 930, opacity: k(f, dur * 0.7), whiteSpace: "nowrap" }}>≈ 8 YEARS OF DAILY USE · SOURCE: MAKER SPEC SHEETS</Lbl>
  </Plate>;
};
// ================= letters (326): LiFePO4 punzonado letra por letra en una chapa de acero cepillado atornillada
const Punch: React.FC<P> = () => {
  // r4: tarjeta lisa oscura (sin chapa cepillada ni tornillos); las letras aparecen de a una
  const f = useCurrentFrame(); const Lt = "LiFePO4".split("");
  return <Plate src="g3640" d={0.7}>
    <div style={{ position: "absolute", left: 160, top: 240, width: 1600, height: 480, background: "rgba(20,24,30,.9)", borderRadius: 12, boxShadow: "0 22px 30px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
      {Lt.map((c, i) => { const at = 6 + i * 9, t = f >= at ? 1 : 0, hit = cl(1 - (f - at) / 5);
        return <div key={i} style={{ fontFamily: SANS, fontWeight: 900, fontSize: 250, color: YEL, opacity: t, transform: `scale(${1 + 0.15 * hit})` }}>{c}</div>; })}
    </div>
    <Lbl size={48} col="#e9eef2" style={{ position: "absolute", left: 160, top: 790 }}>LOOK FOR THESE LETTERS ON THE LABEL</Lbl>
  </Plate>;
};
// ================= schedule (345): el reloj de 24 h de la cocina: generador mañana y tarde, estación de tarde y de noche
const Dial24: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const t = io(f / dur);
  const arcs = [[7, 10, GN], [10, 17, ST], [17, 20, GN], [20, 31, ST]];
  return <Oak src="g1010" d={0.68}>
    <div style={{ position: "absolute", left: 1000, top: 140, width: 800, height: 800, borderRadius: "50%", background: CREAM, border: "18px solid #3b3b3b", overflow: "hidden", boxShadow: "8px 12px 0 rgba(0,0,0,.3)" }}>
      {arcs.map(([a, b, c], i) => { const p = cl(t * 4 - i); return Array.from({ length: Math.round((+b - +a) * 4 * p) }).map((_, j) => { const h = +a + j / 4, ang = (h / 24) * 360;
        return <div key={i + "_" + j} style={{ position: "absolute", left: 400 - 8, top: 30, width: 16, height: 120, background: c as string, transformOrigin: "50% 370px", transform: `rotate(${ang}deg)` }} />; }); })}
      {[0, 6, 12, 18].map((h) => <div key={h} style={{ position: "absolute", left: 400 + Math.sin(h / 24 * 2 * Math.PI) * 190 - 40, top: 400 - Math.cos(h / 24 * 2 * Math.PI) * 190 - 30, fontFamily: SERIF, fontWeight: 900, fontSize: 50 }}>{h === 0 ? 24 : h}</div>)}
    </div>
    <Paper x={90} y={300} w={860} h={420} rot={-1.5}>
      <div style={{ padding: "40px 46px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}><div style={{ width: 44, height: 44, background: GN, borderRadius: 6 }} /><Lbl size={46} col={GN}>GENERATOR</Lbl></div>
        <Hand text="morning & evening · ~3 h each" at={-99} f={f} size={46} style={{ marginLeft: 64, marginTop: 6 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 40 }}><div style={{ width: 44, height: 44, background: ST, borderRadius: 6 }} /><Lbl size={46} col={ST}>POWER STATION</Lbl></div>
        <Hand text="afternoon & overnight" at={-99} f={f} size={46} style={{ marginLeft: 64, marginTop: 6 }} />
      </div>
    </Paper>
  </Oak>;
};

// ================= counter (353): «FROM THE COUNTER» — la campanita de mostrador y lo que hay sobre el mostrador
const Counter: React.FC<P> = () => {
  // r4: sin campanita, mostrador ni cajas dibujadas; la foto real de la ferretería y el título
  const f = useCurrentFrame(); const t = k(f, 2, 14);
  return <Plate src="y0530" d={0.5}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", flexDirection: "column", alignItems: "center", opacity: t, transform: `translateY(${(1 - t) * 40}px)` }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: CREAM, whiteSpace: "nowrap" }}>FROM THE COUNTER</div>
      <Lbl size={46} col={YEL} style={{ marginTop: 10 }}>YOUR QUESTIONS, ANSWERED</Lbl>
    </div>
  </Plate>;
};
// ================= SERIE checklist:0-5 — etiquetas de cartón ensartadas en un aro de acero
const REQ = ["LiFePO4 battery", "1,000+ Wh (2,000 if you can)", "1,500 W continuous · pure sine", "fast AC charging (2–3 h)", "expandable battery = plus"];
const KeyRing: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const n = +a[0];
  return <Oak src="y3270" d={0.72}>
    <Lbl size={58} col={CREAM} style={{ position: "absolute", left: 300, top: 110, fontFamily: SERIF }}>MY STATION CHECKLIST</Lbl>
    {REQ.slice(0, n).map((r, i) => { const nw = i === n - 1, t = nw ? sp(f, 4) : 1;
      return <div key={i} style={{ position: "absolute", left: 300, top: 280 + i * 150, transform: `translateY(${(1 - t) * -80}px)`, opacity: cl(t * 3) }}>
        <div style={{ width: 1300, height: 118, background: "#f1e3c2", borderRadius: 12, display: "flex", alignItems: "center", paddingLeft: 50, boxShadow: "0 14px 20px rgba(0,0,0,.4)", position: "relative", boxSizing: "border-box" }}>
          <Hand text={`${i + 1}. ${r}`} at={nw ? 8 : -99} f={f} size={62} /></div></div>; })}
  </Oak>;
};
// ================= SERIE q:N — el turnero rojo de mostrador: sale el papelito con el número de pregunta
const Ticket: React.FC<P> = ({ a }) => {
  // r4: sin turnero dibujado; foto real y el número de pregunta grande
  const f = useCurrentFrame(); const n = +a[0]; const t = k(f, 2, 14);
  return <Plate src="y1011" d={0.55}>
    <div style={{ position: "absolute", left: 140, top: 250, opacity: t, transform: `translateX(${(1 - t) * -60}px)` }}>
      <Lbl size={64} col={YEL} style={{ letterSpacing: 8 }}>QUESTION</Lbl>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 420, color: CREAM, lineHeight: 0.95 }}>{n}</div>
    </div>
  </Plate>;
};
// ================= fuse (369): la toma de 12 V del tablero de la camioneta y el fusible de cuchilla de 15 A
const Fuse: React.FC<P> = () => {
  // r4: sin fusible dibujado; la copia real y el dato en grande
  const f = useCurrentFrame(); const t = k(f, 4, 14);
  return <Plate src="y3730" d={0.72}>
    <Print src="g3710" x={90} y={130} w={920} h={660} rot={-1.5} cap="STATION ON THE DASH SOCKET" />
    <div style={{ position: "absolute", left: 1160, top: 220, opacity: t, transform: `translateY(${(1 - t) * 40}px)` }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 260, color: YEL, lineHeight: 1 }}>15 A</div>
      <Lbl size={48} col={CREAM} style={{ marginTop: 10 }}>BLADE FUSE</Lbl>
    </div>
    <Lbl size={46} col="#fff" style={{ position: "absolute", left: 90, top: 940, whiteSpace: "nowrap" }}>12 V SOCKET · 10–15 A FUSE ≈ 120–180 W</Lbl>
  </Plate>;
};
// ================= surge (396): la pinza amperométrica abrazando el cable: pico de arranque del compresor y se asienta
const Surge: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const a0 = M(m, 0, 20);
  const W = (fr: number) => { const x = fr - a0; return x < 0 ? 75 : x < 6 ? 75 + 1025 * (x / 6) : x < 26 ? 1100 - (x - 6) * 51 : 78 + Math.sin(fr / 4) * 3; };
  const w = W(f), peaked = f - a0 >= 6, N = 44;
  return <Plate src="g0060" d={0.7}>
    <Print src="y3720" x={90} y={150} w={700} h={660} rot={-1.5} cap="FRIDGE COMPRESSOR KICKS ON" />
    <div style={{ position: "absolute", left: 930, top: 120, width: 880, height: 760, background: "linear-gradient(#f2c230,#d9a514)", borderRadius: 40, boxShadow: "0 22px 30px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 50, right: 50, top: 40, height: 210, background: "#2d3a2c", borderRadius: 10, boxShadow: "inset 0 0 0 8px #1b1b1b" }}>
        <div style={{ position: "absolute", left: 30, top: 22, fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#bfe8b0" }}>WATTS</div>
        {peaked && <div style={{ position: "absolute", left: 30, bottom: 22, fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#ffb08a" }}>PEAK 1,100</div>}
        <div style={{ position: "absolute", right: 34, top: 20, fontFamily: "monospace", fontWeight: 900, fontSize: 150, color: "#bfe8b0", lineHeight: 1.1 }}>{fmt(Math.max(0, w))}</div></div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 290, height: 380, background: "#1d241c", borderRadius: 10, boxShadow: "inset 0 0 0 8px #141414", padding: "24px 28px", boxSizing: "border-box", display: "flex", alignItems: "flex-end", gap: 4 }}>
        {Array.from({ length: N }).map((_, j) => { const fr = f - (N - 1 - j) * 2; const v = W(fr); return <div key={j} style={{ flex: 1, height: `${(v / 1150) * 100}%`, background: v > 400 ? "#ff8a6a" : "#7dffb0", borderRadius: 2 }} />; })}
      </div>
      <Lbl size={30} col={INK} style={{ position: "absolute", left: 60, top: 690 }}>LAST 3 SECONDS</Lbl>
    </div>
    <Lbl size={44} col={CREAM} style={{ position: "absolute", left: 90, top: 960, whiteSpace: "nowrap" }}>A 1-SECOND SURGE, THEN IT SETTLES TO ~75 W</Lbl>
  </Plate>;
};
// ================= prize (413): «THE PRIZE» — el sobre se abre y la tarjeta sale de adentro del bolsillo
const Prize: React.FC<P> = () => {
  // r4: sin sobre dibujado; foto real y título
  const f = useCurrentFrame(); const t = k(f, 4, 14);
  return <Plate src="g4030" d={0.55}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", flexDirection: "column", alignItems: "center", opacity: t, transform: `scale(${0.92 + 0.08 * t})` }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 190, color: CREAM, whiteSpace: "nowrap" }}>WHAT I'D BUY</div>
      <Lbl size={64} col={YEL} style={{ marginTop: 6 }}>WITH $1,000 · WITH $2,500</Lbl>
    </div>
  </Plate>;
};

// ================= SERIE cart:1000:0-2 / cart:2500 — el ticket de la caja registradora sale y se suma
const BUY: Record<string, [string, number][]> = {
  "1000": [["3,000 W inverter generator", 800], ["2 gas cans + stabilizer", 50], ["heavy cord + chain", 100], ["2 battery CO detectors", 45]],
  "2500": [["3,000 W inverter generator", 800], ["2,000 Wh LiFePO4 station", 1200], ["inlet + interlock + permit", 500]] };
const Register: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const key = a[0]; const step = a[1] === undefined ? 3 : +a[1]; const items = BUY[key];
  const show = key === "1000" ? (step === 0 ? 1 : step === 1 ? 3 : 4) : 3;
  const tot = items.slice(0, show).reduce((s, [, p]) => s + p, 0);
  return <Oak src={key === "2500" ? "g0710" : "g4020"} d={0.7}>
    <div style={{ position: "absolute", left: 400, top: 70, width: 1120, background: "#fbfaf5", boxShadow: "0 22px 30px rgba(0,0,0,.45), 0 4px 0 rgba(0,0,0,.2)", fontFamily: "monospace", padding: "50px 70px", boxSizing: "border-box", clipPath: `inset(0 0 ${100 - 100 * k(f, 0, 18)}% 0)` }}>
      <div style={{ fontSize: 62, fontWeight: 900, textAlign: "center" }}>BUDGET · ${fmt(+key)}</div>
      <div style={{ borderTop: "3px dashed #999", margin: "24px 0" }} />
      {items.slice(0, show).map(([n, p], i) => { const nw = i >= (key === "1000" ? [0, 1, 3][step] ?? 0 : 0); const t = nw ? k(f, 8 + (i - (key === "1000" ? [0, 1, 3][step] : 0)) * 12, 8) : 1;
        return <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 20, fontSize: 50, fontWeight: 700, marginBottom: 30, opacity: t }}><span>{n}</span><span style={{ whiteSpace: "nowrap" }}>~${fmt(p)}</span></div>; })}
      <div style={{ borderTop: "3px dashed #999", margin: "24px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 76, fontWeight: 900 }}><span>TOTAL</span><span style={{ color: tot > +key ? GN : INK }}>~${fmt(tot)}</span></div>
      <div style={{ fontSize: 36, fontWeight: 700, color: "#555", marginTop: 20 }}>RANGES WHERE I SHOP · YOURS WILL VARY</div>
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
