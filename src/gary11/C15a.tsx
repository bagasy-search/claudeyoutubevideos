// scr15a · «Heat Accumulator From an Old Brake Drum» — componentes propios, PURO CSS/DOM (sin SVG, sin blur grande, sin grano ni viñeta).
// Mundo: el garage de Scrap en enero — hierro fundido, óxido, arena, papel de taller, ámbar de vela, tiza.
// Regla del EVALUADOR (lección gary): foto REAL a sangre + UNA línea grande de texto (≥30 px), nada arriba a la izquierda.
// m = cuadros (relativos al plano) en que se dice cada palabra ancla; dur = cuadros del plano. Registro: D:/rtmp/scr14_COMPONENTES.md
import React from "react";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONTS } from "./Piezas";

const { SERIF, SANS, HAND } = FONTS;
const cl = (v: number) => Math.max(0, Math.min(1, v));
const ou = (t: number) => Easing.out(Easing.cubic)(cl(t));
const k = (f: number, a: number, len = 12) => ou((f - a) / len);
const M = (m: number[], i: number, d: number) => (m[i] ?? d);
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
type P = { dur: number; m: number[]; a: string[] };
type CSS = React.CSSProperties;

const IRON = "#1b1a18", RUST = "#b0562c", CREAM = "#f1e8d4", AMBER = "#f4a83a", RED = "#c8321f", CHALK = "#f4f1ea", KRAFT = "#c9a46a", INK = "#1f1c18";
const IMG = (n: string) => `url(${staticFile(`scr15a/g/${n}.png`)})`;

// fondo: foto real a sangre bajo un degradé que oscurece abajo (para la línea grande)
const Plate: React.FC<{ src: string; d?: number; pos?: string; children?: React.ReactNode; zoom?: boolean }> = ({ src, d = 0.5, pos = "50% 50%", children, zoom = true }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ overflow: "hidden", background: IRON }}>
    <AbsoluteFill style={{ backgroundImage: IMG(src), backgroundSize: "cover", backgroundPosition: pos, transform: zoom ? `scale(${1.03 + f * 0.00035})` : undefined }} />
    <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(14,12,10,${d * 0.35}) 0%, rgba(14,12,10,${d * 0.55}) 50%, rgba(14,12,10,${Math.min(0.94, d + 0.3)}) 100%)` }} />
    {children}
  </AbsoluteFill>;
};
// la línea grande de abajo (una sola por escena)
const Big: React.FC<{ children: React.ReactNode; e: number; size?: number; col?: string; y?: number; style?: CSS }> = ({ children, e, size = 92, col = CHALK, y = 120, style }) => (
  <div style={{ position: "absolute", left: 90, right: 90, bottom: y, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: size, lineHeight: 1.04, color: col,
    textShadow: "0 4px 0 rgba(0,0,0,.45)", opacity: cl(e * 1.4), transform: `translateY(${(1 - e) * 40}px)`, ...style }}>{children}</div>
);
const Lbl: React.FC<{ children: React.ReactNode; size?: number; col?: string; style?: CSS }> = ({ children, size = 34, col = CHALK, style }) => (
  <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: 2, color: col, whiteSpace: "nowrap", ...style }}>{children}</div>
);
// copia en papel fotográfico apoyada en el banco (sombra dura, leve giro)
const Print: React.FC<{ src: string; w: number; h: number; x: number; y: number; rot?: number; e?: number; cap?: string; style?: CSS; children?: React.ReactNode }> =
  ({ src, w, h, x, y, rot = 0, e = 1, cap, style, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, padding: 12, paddingBottom: cap ? 66 : 12, background: "#f7f3ea", transform: `translateY(${(1 - e) * 90}px) rotate(${rot}deg)`, opacity: cl(e * 1.6),
    boxShadow: "0 20px 26px rgba(0,0,0,.5), 0 3px 0 rgba(0,0,0,.25)", ...style }}>
    <div style={{ width: w, height: h, backgroundImage: IMG(src), backgroundSize: "cover", backgroundPosition: "50% 50%", position: "relative" }}>{children}</div>
    {cap && <div style={{ position: "absolute", left: 12, right: 12, bottom: 10, height: 50, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 32, letterSpacing: 1, color: INK, whiteSpace: "nowrap" }}>{cap}</div>}
  </div>
);
// tiza que se escribe (revela por recorte)
const Chalk: React.FC<{ text: string; at: number; f: number; len?: number; size?: number; col?: string; style?: CSS }> = ({ text, at, f, len = 18, size = 64, col = CHALK, style }) => {
  const p = cl((f - at) / len); if (p <= 0) return null;
  return <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, whiteSpace: "nowrap", paddingRight: 14, clipPath: p >= 1 ? "none" : `inset(-30% ${100 - p * 100}% -30% -5%)`, ...style }}>{text}</div>;
};
// una vela de té en CSS (vaso de aluminio + llama que titila)
const Tealight: React.FC<{ s?: number; on?: number; seed?: number }> = ({ s = 1, on = 1, seed = 0 }) => {
  const f = useCurrentFrame(); const fl = 1 + Math.sin(f / 3.1 + seed) * 0.06 + Math.sin(f / 1.7 + seed * 2) * 0.04;
  return <div style={{ position: "relative", width: 120 * s, height: 150 * s }}>
    <div style={{ position: "absolute", left: 50 * s, bottom: 52 * s, width: 20 * s, height: 56 * s * on * fl, borderRadius: "50% 50% 40% 40% / 70% 70% 30% 30%", background: `radial-gradient(ellipse at 50% 80%, #fff6c8 0%, ${AMBER} 45%, rgba(230,90,20,.0) 75%)`, opacity: on, transformOrigin: "50% 100%" }} />
    <div style={{ position: "absolute", left: 0, bottom: 0, width: 120 * s, height: 50 * s, borderRadius: `${8 * s}px ${8 * s}px ${14 * s}px ${14 * s}px`, background: "linear-gradient(90deg,#8d9399,#e6e9ec 35%,#b4b9be 60%,#7a8086)" }} />
    <div style={{ position: "absolute", left: 6 * s, bottom: 40 * s, width: 108 * s, height: 16 * s, borderRadius: "50%", background: "#f3efe6" }} />
  </div>;
};

// ================= parts (005): las cuatro piezas caen al banco una por una (copias apoyadas)
const Parts: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame();
  const L: [string, string, number, number, number][] = [["g0530", "10 LB CAST IRON", 120, 150, -4], ["g0250", "4 TEA LIGHTS", 560, 210, 3], ["g0131", "PAN + SAND", 1000, 140, -2], ["g0391", "A LITTLE PHYSICS", 1440, 200, 4]];
  return <Plate src="g0020" d={0.72}>
    {L.map(([s, c, x, y, r], i) => <Print key={i} src={s} w={360} h={300} x={x} y={y} rot={r} e={k(f, M(m, i, 6 + i * 14), 12)} cap={c} />)}
    <Big e={k(f, 4, 14)} y={110}>Not magic. Iron, fire and air.</Big>
  </Plate>;
};

// ================= carousel (015) + recap/rc:n: la tira de 12 chapas de acero estampadas y remachadas en una planchuela
const STEPS = ["CANDLE MATH", "THE DRUM", "CLEAN IT WET", "PAN + SAND", "3 LEGS · 1 INCH", "4 CANDLES", "POT ON TOP", "LIGHT + MEASURE", "40 MIN TAIL", "ADD MASS", "WHERE · NEVER", "SNUFF + RELOAD"];
const Tags: React.FC<P & { pick?: number; recap?: boolean }> = ({ m, pick, recap }) => {
  const f = useCurrentFrame();
  return <Plate src={recap ? "g3740" : "g0450"} d={0.66}>
    <div style={{ position: "absolute", left: 70, right: 70, top: 150, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 24 }}>
      {STEPS.map((s, i) => {
        const a = recap ? (pick !== undefined ? (i < pick - 1 ? -99 : i === pick - 1 ? 2 : 999) : 2 + i * 3) : M(m, 0, 4) + i * 4;
        const e = k(f, a, 8); const on = recap ? (pick !== undefined ? i <= pick - 1 : true) : true; const cur = pick !== undefined && i === pick - 1;
        return <div key={i} style={{ height: 240, borderRadius: 10, background: cur ? `linear-gradient(135deg,#e7b35a,${AMBER})` : "linear-gradient(135deg,#d7dadd,#9ba1a6)", border: "4px solid #6c7277",
          boxShadow: cur ? "0 0 0 6px rgba(244,168,58,.35), 0 14px 18px rgba(0,0,0,.5)" : "0 12px 16px rgba(0,0,0,.5)", opacity: on ? cl(e * 1.5) : 0.35,
          transform: `translateY(${(1 - e) * -60}px) scale(${cur ? 1.06 : 1})`, position: "relative", padding: "20px 16px", boxSizing: "border-box" }}>
          <div style={{ position: "absolute", left: 14, top: 14, width: 18, height: 18, borderRadius: "50%", background: "radial-gradient(#f4f4f4,#666)" }} />
          <div style={{ position: "absolute", right: 14, top: 14, width: 18, height: 18, borderRadius: "50%", background: "radial-gradient(#f4f4f4,#666)" }} />
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: "#33383d", textAlign: "center", lineHeight: 1.1, marginTop: 16, textShadow: "-2px -2px 0 rgba(0,0,0,.35), 2px 2px 0 rgba(255,255,255,.55)" }}>{i + 1}</div>
          <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 30, color: "#2b2f33", textAlign: "center", lineHeight: 1.1 }}>{s}</div>
        </div>; })}
    </div>
    <Big e={k(f, 2, 14)} y={90} size={84}>{recap ? (pick !== undefined ? `STEP ${pick}: ${STEPS[pick - 1]}` : "From the top.") : "12 steps. None skipped."}</Big>
  </Plate>;
};
const RecapBonus: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <Plate src="g3810" d={0.55}><Big e={k(f, 2, 14)} y={120} col={AMBER}>BONUS: the brick in the flannel shirt</Big></Plate>;
};

// ================= step:n (apertura de capítulo): la copia del paso entra a la mesa y cae la chapa «STEP n / 12»
const STEP_IMG = ["g0250", "g0130", "g0850", "g1081", "g1370", "g1480", "g1770", "g1950", "g2440", "g2570", "g2780", "g3061"];
const Step: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const n = +a[0]; const e = k(f, 0, 16), s = k(f, 10, 10);
  const hit = cl(1 - (f - 18) / 8);
  return <AbsoluteFill style={{ background: `linear-gradient(180deg,#2a2622,#141210)` }}>
    <AbsoluteFill style={{ backgroundImage: IMG(STEP_IMG[n - 1]), backgroundSize: "cover", backgroundPosition: "50% 50%", opacity: 0.28, transform: "scale(1.1)" }} />
    <Print src={STEP_IMG[n - 1]} w={1000} h={600} x={820 + (1 - e) * 900} y={180} rot={2.5 - e * 1.5} e={1} />
    <div style={{ position: "absolute", left: 110, top: 300, transform: `scale(${1 + 0.12 * hit})`, transformOrigin: "0 50%", opacity: cl(s * 2) }}>
      <Lbl size={40} col={AMBER} style={{ letterSpacing: 8 }}>STEP</Lbl>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 300, lineHeight: 0.95, color: CHALK, textShadow: "0 6px 0 rgba(0,0,0,.5)" }}>{n}<span style={{ fontSize: 110, color: "#9a9188" }}> / 12</span></div>
      <div style={{ marginTop: 18, fontFamily: SANS, fontWeight: 900, fontSize: 54, color: CHALK, letterSpacing: 2, maxWidth: 640 }}>{STEPS[n - 1]}</div>
    </div>
  </AbsoluteFill>;
};

// ================= stat:x — etiqueta de envío de cartón (kraft) colgada de un hilo, con el número y la fuente
const STAT: Record<string, [string, string, string, string]> = {
  paraffin: ["g0250", "46 MJ/kg", "ENERGY IN PARAFFIN WAX", "ENGINEERING TOOLBOX"],
  epa: ["g0850", "WET ONLY", "BRAKE DUST: NO AIR HOSE, NO DRY BRUSH", "U.S. EPA · BRAKE WORK GUIDANCE"],
  iron: ["g0530", "0.46", "J PER GRAM PER °C · CAST IRON", "ENGINEERING TABLES"],
  nfpa: ["g2920", "1 IN 3", "CANDLE HOME FIRES START IN THE BEDROOM", "NFPA"],
  cdc: ["g1240", "CO ALARM", "BATTERY BACKUP · IN THE ROOM", "CDC · POWER OUTAGES"] };
const Stat: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const [src, big, lab, so] = STAT[a[0]]; const e = k(f, 2, 14); const sw = Math.sin(f / 20) * 2 * e;
  return <Plate src={src} d={0.55}>
    <div style={{ position: "absolute", left: 1180, top: 0, width: 4, height: 150 * e, background: "#e8dcc0" }} />
    <div style={{ position: "absolute", left: 960, top: 140, width: 480, height: 640, transformOrigin: "222px 10px", transform: `translateY(${(1 - e) * -500}px) rotate(${sw - 3}deg)`,
      background: `linear-gradient(160deg,#d6b47a,${KRAFT})`, clipPath: "polygon(22% 0,78% 0,100% 14%,100% 100%,0 100%,0 14%)", boxShadow: "0 20px 26px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 200, top: 34, width: 44, height: 44, borderRadius: "50%", background: "#7a5c34", boxShadow: "inset 0 0 0 8px #e8d2a6" }} />
      <div style={{ position: "absolute", left: 30, right: 30, top: 150, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: big.length > 6 ? 92 : 120, color: INK, lineHeight: 1 }}>{big}</div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 330, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 36, color: INK, lineHeight: 1.15 }}>{lab}</div>
      <div style={{ position: "absolute", left: 40, right: 40, bottom: 40, borderTop: "3px dashed #7a5c34", paddingTop: 16, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 30, color: "#4d3a20" }}>SOURCE · {so}</div>
    </div>
  </Plate>;
};

// ================= math (029): la cuenta de la vela escrita en tiza sobre la tapa de una caja de herramientas pintada de negro
const CandleMath: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame();
  return <Plate src="g0250" d={0.8}>
    <div style={{ position: "absolute", left: 260, top: 130, width: 1400, height: 700, background: "linear-gradient(170deg,#2b2d2b,#1d1f1d)", borderRadius: 14, border: "14px solid #5a4632", boxShadow: "0 22px 30px rgba(0,0,0,.55)", padding: "50px 70px", boxSizing: "border-box" }}>
      <Chalk text="12 g of wax" at={M(m, 0, 6)} f={f} size={78} />
      <Chalk text="× 46 kJ per gram" at={M(m, 1, 30)} f={f} size={78} style={{ marginTop: 18 }} />
      <Chalk text="÷ 4 hours" at={M(m, 2, 54)} f={f} size={78} style={{ marginTop: 18 }} />
      <div style={{ marginTop: 26, height: 6, width: 900 * k(f, M(m, 3, 74), 12), background: CHALK, borderRadius: 3 }} />
      <Chalk text="≈ 35 – 40 W per candle" at={M(m, 3, 78)} f={f} size={96} col={AMBER} style={{ marginTop: 20 }} />
    </div>
  </Plate>;
};

// ================= four (031): las cuatro velas se prenden de a una y el contador de watts sube
const Four: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a0 = M(m, 0, 6);
  const lit = [0, 1, 2, 3].map((i) => k(f, a0 + i * 9, 6)); const w = lit.reduce((s, x) => s + x * 37.5, 0);
  return <Plate src="g0330" d={0.78}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", justifyContent: "center", gap: 90 }}>{lit.map((l, i) => <Tealight key={i} s={1.5} on={l} seed={i * 2} />)}</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 190, color: AMBER, textShadow: "0 6px 0 rgba(0,0,0,.5)" }}>{fmt(w)} W</div>
    <Big e={k(f, a0 + 40, 12)} y={70} size={64}>About one person sitting in a chair.</Big>
  </Plate>;
};

// ================= plume (043): dos copias lado a lado; en la vela suelta el calor se va por arriba, en el tambor sale de costado
const Plume: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const a1 = M(m, 1, 50);
  const arrow = (x: number, y: number, rot: number, e: number, col: string) => <div style={{ position: "absolute", left: x, top: y, width: 150 * e, height: 22, background: col, transformOrigin: "0 50%", transform: `rotate(${rot}deg)`, borderRadius: 11, boxShadow: "0 4px 0 rgba(0,0,0,.4)" }}>
    <div style={{ position: "absolute", right: -26, top: -17, width: 0, height: 0, borderLeft: `40px solid ${col}`, borderTop: "28px solid transparent", borderBottom: "28px solid transparent", opacity: e > 0.6 ? 1 : 0 }} /></div>;
  const up = k(f, M(m, 0, 6), 18), side = k(f, a1, 18);
  return <Plate src="g0380" d={0.82}>
    <Print src="y0040" w={720} h={520} x={130} y={150} rot={-2} e={k(f, 2, 12)} cap="BARE CANDLE" />
    <Print src="g0450" w={720} h={520} x={1030} y={150} rot={2} e={k(f, a1 - 10, 12)} cap="SAME CANDLES, UNDER IRON" />
    {arrow(480, 330, -90, up, "#9fb6c8")}
    {arrow(1250, 420, 180, side, AMBER)}{arrow(1640, 420, 0, side, AMBER)}
    <Big e={k(f, a1, 12)} y={70} size={70}>Same 150 W. It lands on you, not the ceiling.</Big>
  </Plate>;
};

// ================= gap (136): una cinta métrica amarilla se estira entre la punta de la llama y el hierro
const Gap: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const e = k(f, M(m, 0, 8), 20);
  return <Plate src="g1370" d={0.55}>
    <div style={{ position: "absolute", left: 1460, top: 300, width: 110, height: 420 * e, background: "linear-gradient(90deg,#e7b417,#f7d24a 40%,#d6a10c)", borderRadius: 6, boxShadow: "0 12px 16px rgba(0,0,0,.45)", overflow: "hidden" }}>
      {Array.from({ length: 22 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 0, top: i * 19, width: i % 4 === 0 ? 60 : 30, height: 4, background: "#1b1b1b" }} />)}
    </div>
    <div style={{ position: "absolute", left: 1420, top: 290, width: 190, height: 26, background: "#c9cdd1", borderRadius: 4, opacity: cl(e * 2) }} />
    <div style={{ position: "absolute", left: 1600, top: 440, opacity: k(f, M(m, 0, 8) + 18, 10) }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: AMBER, textShadow: "0 6px 0 rgba(0,0,0,.5)" }}>1"</div></div>
    <Big e={k(f, M(m, 0, 8) + 10, 12)} y={90} size={76}>One inch of air above the tip of the flame.</Big>
  </Plate>;
};

// ================= rule (165): la regla grabada a golpe de punzón en una planchuela, letra por letra
const Rule: React.FC<P> = () => {
  const f = useCurrentFrame(); const T1 = "AN INCH APART", T2 = "AN INCH OF AIR ABOVE";
  const punch = (t: string, at: number) => t.split("").map((c, i) => { const v = f - at - i * 1.4; return <span key={i} style={{ opacity: v > 0 ? 1 : 0, display: "inline-block", transform: `scale(${v > 0 && v < 3 ? 1.25 : 1})` }}>{c}</span>; });
  return <Plate src="g1480" d={0.7}>
    <div style={{ position: "absolute", left: 210, top: 300, width: 1500, height: 420, background: "linear-gradient(135deg,#d9dcdf,#8f969c)", border: "6px solid #5f666c", borderRadius: 10, boxShadow: "0 22px 30px rgba(0,0,0,.55)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 30 }}>
      {[0, 1].map((r) => <div key={r} style={{ fontFamily: SANS, fontWeight: 900, fontSize: 104, letterSpacing: 6, color: "#3a4046", textShadow: "-2px -2px 0 rgba(0,0,0,.4), 2px 2px 0 rgba(255,255,255,.6)", whiteSpace: "nowrap" }}>{punch(r ? T2 : T1, r ? 26 : 4)}</div>)}
    </div>
  </Plate>;
};

// ================= pot (179): antes / después con barrido — el agujero abierto vs la maceta encima
const Pot: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const w = interpolate(f, [M(m, 0, 20), M(m, 0, 20) + 40], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return <AbsoluteFill style={{ background: IRON }}>
    <AbsoluteFill style={{ backgroundImage: IMG("g1770"), backgroundSize: "cover" }} />
    <AbsoluteFill style={{ backgroundImage: IMG("g1690"), backgroundSize: "cover", clipPath: `inset(0 ${100 - w}% 0 0)` }} />
    <div style={{ position: "absolute", top: 0, bottom: 0, left: `${w}%`, width: 10, marginLeft: -5, background: CHALK, boxShadow: "0 0 0 3px rgba(0,0,0,.35)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(14,12,10,.85))" }} />
    <Big e={1} y={110} size={84}>{w > 50 ? "Wide open: the heat leaves." : "A clay pot: slow it, don't stop it."}</Big>
  </AbsoluteFill>;
};

// ================= lineup (188): toda la receta en fila sobre una regla de carpintero que se despliega
const Lineup: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const IT = ["A PAN", "SAND", "4 CANDLES", "3 LEGS", "THE DRUM", "A POT"];
  return <Plate src="g3740" d={0.62}>
    <div style={{ position: "absolute", left: 110, right: 110, top: 360, display: "flex", gap: 0 }}>
      {IT.map((t, i) => { const e = k(f, M(m, i, 4 + i * 8), 8);
        return <div key={i} style={{ flex: 1, height: 170, background: i % 2 ? "#e9d9a8" : "#f2e4b8", border: "3px solid #8a7444", transformOrigin: "0 50%", transform: `rotateY(${(1 - e) * 85}deg)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", boxShadow: "0 14px 18px rgba(0,0,0,.45)" }}>
          {Array.from({ length: 8 }).map((_, j) => <div key={j} style={{ position: "absolute", top: 0, left: `${j * 12.5}%`, width: 3, height: j % 2 ? 18 : 32, background: "#5a4a2a" }} />)}
          <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 40, color: INK, marginTop: 30, whiteSpace: "nowrap" }}>{t}</div></div>; })}
    </div>
    <Big e={k(f, M(m, 5, 50), 12)} y={140}>That's the whole build.</Big>
  </Plate>;
};

// ================= therm:N (199/202/205): el termómetro infrarrojo — pantalla LCD que cuenta hasta la lectura
const THERM: Record<string, [string, string, number]> = { "38": ["g1980", "GARAGE THIS MORNING", 38], "110": ["g2000", "SIDE OF THE DRUM · 20 MIN", 110], "150": ["g2030", "THE IRON · 45 MIN", 150] };
const Therm: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const [src, lab, v] = THERM[a[0]]; const from = v === 38 ? 20 : v === 110 ? 80 : 110;
  const n = interpolate(f, [6, 40], [from, v], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return <Plate src={src} d={0.45}>
    <div style={{ position: "absolute", right: 140, top: 210, width: 620, height: 470, background: "linear-gradient(160deg,#d63a26,#9c2414)", borderRadius: "40px 40px 30px 30px", boxShadow: "0 22px 30px rgba(0,0,0,.55)", transform: `translateY(${(1 - k(f, 0, 12)) * 500}px)` }}>
      <div style={{ position: "absolute", left: 50, right: 50, top: 50, height: 260, background: "#b9c7a6", borderRadius: 12, boxShadow: "inset 0 0 0 10px #262626", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 190, color: "#1e2618" }}>{Math.round(n)}<span style={{ fontSize: 90 }}>°F</span></div></div>
      <Lbl size={34} col="#fff" style={{ position: "absolute", left: 50, top: 340, whiteSpace: "normal", width: 520 }}>{lab}</Lbl>
    </div>
  </Plate>;
};

// ================= subq (218): suscripción + la pregunta, escrita con marcador en un trozo de cartón pegado con cinta
const SubQ: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const a1 = M(m, 1, 60); const press = cl((f - M(m, 0, 10) - 10) / 6);
  return <Plate src="g2170" d={0.62}>
    <div style={{ position: "absolute", left: 140, top: 200, transform: `scale(${1 - 0.06 * Math.sin(press * Math.PI)})`, opacity: k(f, M(m, 0, 4), 10) }}>
      <div style={{ padding: "34px 70px", background: press > 0.5 ? "#4a4a4a" : RED, borderRadius: 18, fontFamily: SANS, fontWeight: 900, fontSize: 80, color: "#fff", letterSpacing: 2, boxShadow: "0 16px 22px rgba(0,0,0,.5)" }}>{press > 0.5 ? "SUBSCRIBED" : "SUBSCRIBE"}</div>
    </div>
    <div style={{ position: "absolute", left: 820, top: 330, width: 960, padding: "50px 60px", background: "linear-gradient(170deg,#c8a36a,#b58d55)", transform: `rotate(-2deg) translateY(${(1 - k(f, a1, 14)) * 700}px)`, boxShadow: "0 22px 28px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 380, top: -24, width: 200, height: 52, background: "rgba(235,228,205,.85)", transform: "rotate(3deg)" }} />
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 76, lineHeight: 1.08, color: "#1b1712" }}>What's the heaviest piece of scrap iron in your garage?</div>
      <Lbl size={34} col="#3a2a14" style={{ marginTop: 20 }}>TELL ME IN THE COMMENTS</Lbl>
    </div>
  </Plate>;
};

// ================= heatmath (229): la cinta de la sumadora sale renglón por renglón
const HeatMath: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const R: [string, string][] = [["DRUM", "5,500 g"], ["× CAST IRON", "0.46"], ["× ABOVE ROOM", "40 °C"], ["= STORED", "≈ 100,000 J"], ["", "≈ 28 Wh"]];
  const shown = R.filter((_, i) => f >= M(m, i, 6 + i * 22)).length;
  return <Plate src="g2280" d={0.72}>
    <div style={{ position: "absolute", left: 640, top: 0, width: 640, minHeight: 120 + shown * 130, background: "#fbfaf4", boxShadow: "0 22px 30px rgba(0,0,0,.5)", padding: "70px 50px 30px", boxSizing: "border-box", fontFamily: "monospace" }}>
      {R.slice(0, shown).map(([l, v], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: i === 4 ? 78 : 50, fontWeight: 900, color: i === 4 ? RED : INK, marginBottom: 46, borderTop: i === 3 ? "4px solid #222" : undefined, paddingTop: i === 3 ? 20 : 0 }}><span>{l}</span><span>{v}</span></div>)}
    </div>
  </Plate>;
};

// ================= cooldown (238): la curva de enfriamiento como una fila de clavos de distinto alto hundidos en una tabla
const Cooldown: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const pts = [140, 128, 117, 108, 100, 94, 89, 85, 81, 78]; const L = ["0", "", "", "", "30", "", "", "45", "", "60 MIN"];
  return <Plate src="g2440" d={0.75}>
    <div style={{ position: "absolute", left: 220, right: 220, top: 170, height: 600, display: "flex", alignItems: "flex-end", gap: 34, borderBottom: "8px solid #6b5338" }}>
      {pts.map((p, i) => { const e = k(f, M(m, 0, 6) + i * 4, 10); const hot = p > 98;
        return <div key={i} style={{ flex: 1, height: `${((p - 60) / 90) * 100 * e}%`, background: hot ? `linear-gradient(${AMBER},#c46a1c)` : "linear-gradient(#b9a184,#7d6a52)", borderRadius: "8px 8px 0 0", position: "relative" }}>
          <div style={{ position: "absolute", top: -54, left: -20, right: -20, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 32, color: CHALK, opacity: e }}>{p}°</div>
          <div style={{ position: "absolute", bottom: -58, left: -30, right: -30, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#d8cdb8", whiteSpace: "nowrap" }}>{L[i]}</div></div>; })}
    </div>
    <Big e={k(f, M(m, 1, 60), 12)} y={60} size={70}>Candles out. Still warm at 45 minutes.</Big>
  </Plate>;
};

// ================= mass (260): la balanza de plataforma — cada agregado suma peso y la aguja gira
const Mass: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const add = [12, 14]; const e1 = k(f, M(m, 0, 10), 16);
  const lb = 12 + 14 * e1; const ang = -120 + (lb / 40) * 240;
  return <Plate src="g2570" d={0.6}>
    <div style={{ position: "absolute", right: 170, top: 170, width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(#f6f2e6 60%,#d8d0bc)", border: "18px solid #3b3f43", boxShadow: "0 22px 30px rgba(0,0,0,.55)" }}>
      {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: 4, height: 240, marginLeft: -2, transformOrigin: "50% 0", transform: `rotate(${180 - 120 + i * 30}deg)` }}><div style={{ position: "absolute", bottom: 0, width: 6, height: 30, background: "#333" }} /></div>)}
      {[0, 10, 20, 30, 40].map((v, i) => { const a = (-120 + v * 6) * Math.PI / 180; return <div key={v} style={{ position: "absolute", left: 262 + Math.sin(a) * 175 - 40, top: 262 - Math.cos(a) * 175 - 24, width: 80, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 36, color: INK }}>{v}</div>; })}
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 10, height: 230, marginLeft: -5, marginTop: -230, background: RED, transformOrigin: "50% 100%", transform: `rotate(${ang}deg)`, borderRadius: 5 }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 40, height: 40, margin: -20, borderRadius: "50%", background: "#333" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 52, color: INK }}>{Math.round(lb)} LB</div>
    </div>
    <Big e={k(f, M(m, 0, 10) + 20, 12)} y={90} size={74} style={{ left: 90, right: 820, textAlign: "left" }}>Three bricks: almost a second drum.</Big>
  </Plate>;
};

// ================= flow (273): regla de aire — sello de goma «NEVER COVER IT» que cae sobre la foto del error
const Flow: React.FC<P> = () => {
  const f = useCurrentFrame(); const hit = cl((f - 8) / 4); const sh = f > 8 && f < 14 ? Math.sin(f * 3) * 6 : 0;
  return <Plate src="g2710" d={0.45}>
    <div style={{ position: "absolute", left: 560, top: 330, transform: `translate(${sh}px,${sh}px) rotate(-8deg) scale(${2.2 - 1.2 * hit})`, opacity: hit, border: `14px solid ${RED}`, borderRadius: 18, padding: "20px 50px", fontFamily: SANS, fontWeight: 900, fontSize: 120, color: RED, letterSpacing: 6, background: "rgba(255,240,230,.12)" }}>NEVER COVER IT</div>
    <Big e={k(f, 20, 12)} y={110} size={72}>Air in at the bottom. Out at the top. Always.</Big>
  </Plate>;
};

// ================= room (281): plano de la casa visto desde arriba — solo el cuarto chico se pinta de ámbar
const Room: React.FC<P> = () => {
  const f = useCurrentFrame(); const e = k(f, 10, 20);
  const rm = (x: number, y: number, w: number, h: number, lab: string, warm?: boolean) => <div style={{ position: "absolute", left: x, top: y, width: w, height: h, border: "8px solid #2a2622", background: warm ? `rgba(244,168,58,${0.15 + 0.65 * e})` : "rgba(241,232,212,.9)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 36, color: INK, boxSizing: "border-box" }}>{lab}</div>;
  return <Plate src="g2790" d={0.72}>
    <div style={{ position: "absolute", left: 360, top: 150, width: 1200, height: 640, background: "#efe4c8", boxShadow: "0 22px 30px rgba(0,0,0,.5)" }}>
      {rm(0, 0, 600, 380, "LIVING ROOM")}{rm(600, 0, 600, 380, "KITCHEN")}{rm(0, 380, 400, 260, "BEDROOM")}{rm(400, 380, 380, 260, "SMALL ROOM · DOOR SHUT", true)}{rm(780, 380, 420, 260, "BATH")}
    </div>
    <Big e={k(f, 26, 12)} y={90} size={72}>The smaller the room, the more 150 W counts.</Big>
  </Plate>;
};

// ================= hundred (313): la bolsa de 100 velas se reparte en 25 cargas (grilla de puntos que se llena)
const Hundred: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <Plate src="g3120" d={0.7}>
    <div style={{ position: "absolute", left: 210, top: 150, display: "grid", gridTemplateColumns: "repeat(25, 46px)", gap: 14 }}>
      {Array.from({ length: 100 }).map((_, i) => { const on = f > 4 + i * 0.6; return <div key={i} style={{ width: 46, height: 46, borderRadius: "50%", background: on ? "radial-gradient(#fff4c4,#f4a83a 55%,#a8622a)" : "rgba(255,255,255,.12)", border: (i % 4 === 3) ? "3px solid #f1e8d4" : "3px solid transparent", boxSizing: "border-box" }} />; })}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 130, color: CHALK, opacity: k(f, 66, 12) }}>100 candles · 25 fills · 100 hours</div>
  </Plate>;
};

// ================= mistakes (315) + mist:n — la lista: chapa roja con el número y la regla correcta escrita debajo
const MIST: [string, string, string][] = [["g3180", "DRUM FLAT ON THE CANDLES", "Legs. One inch above the flame."], ["g3260", "TOO MANY, TOO CLOSE", "Four candles, one inch apart."], ["g3320", "STRAIGHT ON THE WOOD", "Full pan of sand, on a brick or tile."],
  ["g3380", "PAINT AND GREASE", "Bare iron, cleaned."], ["g3430", "WALKING AWAY", "It's a personal heater."]];
const Mistakes: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <Plate src="g3320" d={0.6}><Big e={k(f, 2, 14)} y={380} size={190} col={CHALK}>5 MISTAKES</Big><Big e={k(f, 16, 12)} y={260} size={56} col={AMBER}>Number three is mine.</Big></Plate>;
};
const Mist: React.FC<P> = ({ a, m }) => {
  const f = useCurrentFrame(); const n = +a[0]; const [src, bad] = MIST[n - 1]; const e = k(f, 0, 10);
  return <Plate src={src} d={0.5}>
    <div style={{ position: "absolute", left: 0, bottom: 150, display: "flex", alignItems: "stretch", transform: `translateX(${(1 - e) * -1200}px)` }}>
      <div style={{ width: 230, background: RED, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 170, color: "#fff" }}>{n}</div>
      <div style={{ padding: "24px 50px", background: "rgba(20,18,16,.92)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Lbl size={36} col={AMBER} style={{ letterSpacing: 6 }}>MISTAKE</Lbl>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 76, color: CHALK, whiteSpace: "nowrap" }}>{bad}</div></div>
    </div>
  </Plate>;
};

// ================= asked (347) + ask:n — tarjetas de comentario escritas a mano clavadas con chinche en la madera del taller
const ASK: [string, string][] = [["g3500", "Is this real or is this AI?"], ["g3590", "Can a candle really heat anything?"], ["g3630", "What about stuck in the car?"], ["g3740", "Clay pot or brake drum?"]];
const Asked: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <Plate src="g3520" d={0.7}>
    {ASK.map(([, q], i) => <div key={i} style={{ position: "absolute", left: 150 + (i % 2) * 830, top: 150 + Math.floor(i / 2) * 330, width: 760, padding: "40px 46px", background: "#fbf6e6", transform: `rotate(${[-2, 2, 1.5, -1.5][i]}deg) translateY(${(1 - k(f, 4 + i * 8, 10)) * 900}px)`, boxShadow: "0 16px 22px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 360, top: -12, width: 34, height: 34, borderRadius: "50%", background: "radial-gradient(#ff7a6a,#9e1d10)" }} />
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: "#1d3d78", lineHeight: 1.05 }}>{q}</div></div>)}
    <Big e={k(f, 40, 12)} y={60} size={70}>You asked me.</Big>
  </Plate>;
};
const Ask: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const n = +a[0]; const [src, q] = ASK[n - 1]; const e = k(f, 0, 12);
  return <Plate src={src} d={0.55}>
    <div style={{ position: "absolute", left: 160, right: 160, bottom: 130, padding: "36px 50px", background: "#fbf6e6", transform: `rotate(-1.5deg) translateY(${(1 - e) * 600}px)`, boxShadow: "0 16px 22px rgba(0,0,0,.5)" }}>
      <Lbl size={32} col="#7a6a4a">QUESTION {n} OF 4</Lbl>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 88, color: "#1d3d78", lineHeight: 1.05, marginTop: 8 }}>{q}</div></div>
  </Plate>;
};

// ================= versus (370): pot vs drum — tabla de dos columnas pintada en una tabla de pino
const Versus: React.FC<P> = () => {
  const f = useCurrentFrame(); const R: [string, string, string][] = [["HEAT", "same", "same"], ["WEIGHT", "light", "heavy"], ["IF YOU KNOCK IT", "cracks", "nothing"], ["COST", "a few $", "free"]];
  return <Plate src="g3740" d={0.72}>
    <div style={{ position: "absolute", left: 260, right: 260, top: 130, background: "linear-gradient(180deg,#d9b98a,#c8a06a)", padding: "40px 60px", boxShadow: "0 22px 30px rgba(0,0,0,.5)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", fontFamily: SANS, fontWeight: 900, fontSize: 52, color: INK, borderBottom: "5px solid #4d3a20", paddingBottom: 14 }}><span /><span>CLAY POT</span><span>DRUM</span></div>
      {R.map(([l, p, d], i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", fontFamily: SANS, fontWeight: 800, fontSize: 48, color: INK, padding: "20px 0", borderBottom: "3px dashed #8a6a3a", opacity: k(f, 8 + i * 12, 8) }}>
        <span style={{ fontSize: 38 }}>{l}</span><span style={{ fontFamily: HAND, fontSize: 60 }}>{p}</span><span style={{ fontFamily: HAND, fontSize: 60, color: i ? "#1d5a2a" : INK }}>{d}</span></div>)}
    </div>
    <Big e={k(f, 60, 12)} y={70} size={66}>I use both. Drum on the bottom, pot on top.</Big>
  </Plate>;
};

// ================= memory (377): la foto vieja de la granja de la abuela, bordes dentados y fecha escrita atrás que se da vuelta
const Memory: React.FC<P> = () => {
  const f = useCurrentFrame(); const flip = interpolate(f, [50, 70], [0, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return <Plate src="g3790" d={0.75}>
    <div style={{ position: "absolute", left: 560, top: 120, width: 800, height: 640, perspective: 2000 }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${flip}deg) rotate(-3deg) translateY(${(1 - k(f, 0, 14)) * 600}px)` }}>
        <div style={{ position: "absolute", inset: 0, background: "#efe6d0", padding: 26, boxSizing: "border-box", backfaceVisibility: "hidden", boxShadow: "0 22px 30px rgba(0,0,0,.5)" }}>
          <div style={{ width: "100%", height: "100%", backgroundImage: IMG("g3780"), backgroundSize: "cover", filter: "sepia(.45) saturate(.8)" }} /></div>
        <div style={{ position: "absolute", inset: 0, background: "#efe6d0", transform: "rotateY(180deg)", backfaceVisibility: "hidden", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 22px 30px rgba(0,0,0,.5)" }}>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 84, color: "#1d3d78", textAlign: "center", lineHeight: 1.1, transform: "rotate(-4deg)" }}>Grandma's farm<br />winter, '86</div></div>
      </div>
    </div>
    <Big e={k(f, 76, 12)} y={90} size={74}>The trick: my grandmother's.</Big>
  </Plate>;
};

// ================= next (430): el próximo video — la lata que se abre y asoma la llama (CSS, sin dibujo sobre foto)
const Next: React.FC<P> = () => {
  const f = useCurrentFrame(); const e = k(f, 4, 14);
  return <Plate src="g1310" d={0.8}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 220, textAlign: "center", opacity: e, transform: `scale(${0.94 + 0.06 * e})` }}>
      <Lbl size={44} col={AMBER} style={{ letterSpacing: 10 }}>NEXT TIME ON THE SCRAP WORKSHOP</Lbl>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 170, color: CHALK, lineHeight: 1.02, marginTop: 20 }}>The Doomsday Burner</div>
      <Lbl size={46} style={{ marginTop: 26 }}>A SCRAP CAN · COOKS · BOILS WATER · 5 MINUTES</Lbl>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, display: "flex", justifyContent: "center" }}><Tealight s={1.6} on={k(f, 20, 10)} /></div>
  </Plate>;
};

// ---------- dispatcher
export const CompC15a: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  const [c, ...a] = String(s.comp).split(":"); const m: number[] = s.m || [];
  const T: Record<string, React.FC<P>> = { parts: Parts, step: Step, stat: Stat, math: CandleMath, four: Four, plume: Plume, gap: Gap, rule: Rule, pot: Pot, lineup: Lineup,
    therm: Therm, subq: SubQ, heatmath: HeatMath, cooldown: Cooldown, mass: Mass, flow: Flow, room: Room, hundred: Hundred, mistakes: Mistakes, mist: Mist, asked: Asked, ask: Ask,
    versus: Versus, memory: Memory, next: Next };
  if (c === "carousel") return <Tags m={m} dur={dur} a={a} />;
  if (c === "recap") return <Tags m={m} dur={dur} a={a} recap />;
  if (c === "rc") return a[0] === "bonus" ? <RecapBonus m={m} dur={dur} a={a} /> : <Tags m={m} dur={dur} a={a} recap pick={+a[0]} />;
  const X = T[c]; return X ? <X m={m} dur={dur} a={a} /> : <AbsoluteFill style={{ background: "#f0f" }} />;
};
