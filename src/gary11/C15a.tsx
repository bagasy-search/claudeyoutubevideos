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
const Chalk: React.FC<{ text: React.ReactNode; at: number; f: number; len?: number; size?: number; col?: string; style?: CSS }> = ({ text, at, f, len = 18, size = 64, col = CHALK, style }) => {
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
  return <Plate src="g0470" d={0.72}>
    {L.map(([s, c, x, y, r], i) => <Print key={i} src={s} w={360} h={300} x={x} y={y} rot={r} e={k(f, M(m, i, 6 + i * 14), 12)} cap={c} />)}
    <Big e={k(f, 4, 14)} y={110}>Not magic. Iron, fire and air.</Big>
  </Plate>;
};

// ================= carousel (015) + recap/rc:n: la tira de 12 chapas de acero estampadas y remachadas en una planchuela
const STEPS = ["CANDLE MATH", "THE DRUM", "CLEAN IT WET", "PAN + SAND", "3 LEGS · 1 INCH", "4 CANDLES", "POT ON TOP", "LIGHT + MEASURE", "40 MIN TAIL", "ADD MASS", "WHERE · NEVER", "SNUFF + RELOAD"];
const Tags: React.FC<P & { pick?: number; recap?: boolean }> = ({ m, pick, recap }) => {
  const f = useCurrentFrame();
  if (pick !== undefined) return <RecapPick n={pick} />;
  if (recap) { const x = -f * 34;
    return <Plate src="g2100" d={0.8}>
      {STEP_IMG.map((src, i) => <Print key={i} src={src} w={440} h={330} x={240 + i * 520 + x} y={250} rot={[-2, 1.5, -1, 2][i % 4]} e={k(f, i * 3, 8)}>
        <div style={{ position: "absolute", left: -14, top: -14, width: 84, height: 84, background: AMBER, color: INK, fontFamily: SERIF, fontWeight: 900, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 0 rgba(0,0,0,.4)" }}>{i + 1}</div></Print>)}
      <Big e={k(f, 2, 14)} y={110} size={80}>Twelve steps, one bench.</Big>
    </Plate>; }
  return <Plate src={recap ? "g3740" : "g1600"} d={0.7}>
    <div style={{ position: "absolute", left: 70, right: 70, top: 150, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 24 }}>
      {STEPS.map((s, i) => {
        const a = recap ? (pick !== undefined ? (i < pick - 1 ? -99 : i === pick - 1 ? 2 : 999) : 2 + i * 3) : M(m, 0, 4) + i * 4;
        const e = k(f, a, 8); const on = recap ? (pick !== undefined ? i <= pick - 1 : true) : true; const cur = pick !== undefined && i === pick - 1;
        return <div key={i} style={{ height: 240, borderRadius: 10, background: cur ? `linear-gradient(135deg,#e7b35a,${AMBER})` : "linear-gradient(135deg,#d7dadd,#9ba1a6)", border: "4px solid #6c7277",
          boxShadow: cur ? "0 0 0 6px rgba(244,168,58,.35), 0 14px 18px rgba(0,0,0,.5)" : "0 12px 16px rgba(0,0,0,.5)", opacity: on ? cl(e * 1.5) : 0.35,
          transform: `translateY(${(1 - e) * -60}px) scale(${cur ? 1.06 : 1})`, position: "relative", padding: "20px 16px", boxSizing: "border-box" }}>
          <div style={{ position: "absolute", left: 14, top: 14, width: 18, height: 18, borderRadius: "50%", background: "radial-gradient(#f4f4f4,#666)" }} />
          <div style={{ position: "absolute", right: 14, top: 14, width: 18, height: 18, borderRadius: "50%", background: "radial-gradient(#f4f4f4,#666)" }} />
          <div style={{ height: 120, marginTop: 30, backgroundImage: IMG(STEP_IMG[i]), backgroundSize: "cover", backgroundPosition: "50% 50%", border: "3px solid #4a5055", position: "relative" }}>
            <div style={{ position: "absolute", left: -6, top: -26, width: 62, height: 62, borderRadius: 8, background: "#33383d", color: CHALK, fontFamily: SERIF, fontWeight: 900, fontSize: 46, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div></div>
          <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 24, color: "#2b2f33", textAlign: "center", lineHeight: 1.1, marginTop: 14, whiteSpace: "nowrap", letterSpacing: 0 }}>{s}</div>
        </div>; })}
    </div>
    <Big e={k(f, 2, 14)} y={90} size={84}>{recap ? "Twelve steps, one bench." : "12 steps. None skipped."}</Big>
  </Plate>;
};
// rc:n — un solo paso: la copia grande en la mesa y la chapa con el número que cae y rebota
const RecapPick: React.FC<{ n: number }> = ({ n }) => {
  const f = useCurrentFrame(); const e = k(f, 0, 14); const drop = interpolate(f, [8, 20], [-700, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.bounce) });
  return <AbsoluteFill style={{ background: "linear-gradient(180deg,#2a2622,#141210)" }}>
    <Print src={STEP_IMG[n - 1]} w={1180} h={700} x={560} y={150} rot={1.5} e={e} />
    <div style={{ position: "absolute", left: 120, top: 330, width: 340, height: 380, borderRadius: 14, background: `linear-gradient(135deg,#e7b35a,${AMBER})`, border: "6px solid #6c7277", transform: `translateY(${drop}px) rotate(-4deg)`, boxShadow: "0 22px 26px rgba(0,0,0,.55)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <Lbl size={36} col="#3a2a14" style={{ letterSpacing: 8 }}>STEP</Lbl>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 220, lineHeight: 0.95, color: "#2b2f33", textShadow: "-3px -3px 0 rgba(0,0,0,.3), 3px 3px 0 rgba(255,255,255,.5)" }}>{n}</div>
    </div>
  </AbsoluteFill>;
};
const RecapBonus: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <Plate src="g3800" d={0.6}><Big e={k(f, 2, 14)} y={120} col={CHALK}>Bonus: a hot brick in a flannel shirt.</Big></Plate>;
};

// ================= step:n (apertura de capítulo): la copia del paso entra a la mesa y cae la chapa «STEP n / 12»
const STEP_IMG = ["g0250", "g0130", "g0850", "g1081", "g1370", "g1480", "g1770", "g1950", "g2440", "g2570", "g2780", "g3061"];
const Step: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const n = +a[0]; const e = k(f, 0, 16), s = k(f, 10, 10);
  const hit = cl(1 - (f - 18) / 8);
  return <AbsoluteFill style={{ background: `linear-gradient(180deg,#2a2622,#141210)` }}>
    <AbsoluteFill style={{ backgroundImage: IMG(STEP_IMG[n - 1]), backgroundSize: "cover", backgroundPosition: "50% 50%", opacity: 0.28, transform: "scale(1.1)" }} />
    <Print src={STEP_IMG[n - 1]} w={1000} h={600} x={n % 2 ? 820 + (1 - e) * 900 : 90 - (1 - e) * 900} y={180} rot={n % 2 ? 2.5 - e * 1.5 : -2.5 + e * 1.5} e={1} />
    <div style={{ position: "absolute", left: n % 2 ? 110 : 1180, top: 300, transform: `scale(${1 + 0.12 * hit})`, transformOrigin: "0 50%", opacity: cl(s * 2) }}>
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
  if (a[0] === "nfpa") return <Plate src="g2920" d={0.75}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", justifyContent: "center", gap: 70 }}>
      {[0, 1, 2].map((i) => { const on = i === 1; const ei = k(f, 2 + i * 8, 10); return <div key={i} style={{ width: 420, height: 420, background: on ? "linear-gradient(170deg,#3a2a18,#22180e)" : "linear-gradient(170deg,#2a3138,#171c21)", border: `10px solid ${on ? AMBER : "#5d6770"}`, boxShadow: on ? "0 0 60px rgba(244,168,58,.45), 0 22px 30px rgba(0,0,0,.55)" : "0 22px 30px rgba(0,0,0,.55)", position: "relative", opacity: ei, transform: `translateY(${(1 - ei) * 80}px)` }}>
        <div style={{ position: "absolute", left: 50, right: 50, bottom: 60, height: 110, borderRadius: 10, background: on ? "#6a4a2a" : "#3d4650" }} />
        <div style={{ position: "absolute", left: 50, bottom: 170, width: 120, height: 50, borderRadius: 10, background: on ? "#e8dcc0" : "#7d8790" }} />
        {on && <div style={{ position: "absolute", right: 60, bottom: 170 }}><Tealight s={0.9} on={k(f, 26, 8)} /></div>}
        <Lbl size={30} col={on ? AMBER : "#aeb6bd"} style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center" }}>BEDROOM</Lbl></div>; })}
    </div>
    <Big e={k(f, 34, 12)} y={110} size={74}>1 in 3 candle fires starts in a bedroom.</Big>
    <Lbl size={28} col="#d8cdb8" style={{ position: "absolute", right: 90, bottom: 60 }}>SOURCE · NFPA</Lbl>
  </Plate>;
  return <Plate src={src} d={0.55}>
    <div style={{ position: "absolute", left: 1180, top: 0, width: 4, height: 150 * e, background: "#e8dcc0" }} />
    <div style={{ position: "absolute", left: 960, top: 140, width: 480, height: 640, transformOrigin: "222px 10px", transform: `translateY(${(1 - e) * -500}px) rotate(${sw - 3}deg)`,
      background: `linear-gradient(160deg,#d6b47a,${KRAFT})`, clipPath: "polygon(22% 0,78% 0,100% 14%,100% 100%,0 100%,0 14%)", boxShadow: "0 20px 26px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 200, top: 34, width: 44, height: 44, borderRadius: "50%", background: "#7a5c34", boxShadow: "inset 0 0 0 8px #e8d2a6" }} />
      <div style={{ position: "absolute", left: 30, right: 30, top: 150, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: big.length > 6 ? 72 : big.length > 4 ? 100 : 120, color: INK, lineHeight: 1, whiteSpace: "nowrap" }}>{big}</div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 300, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 34, color: INK, lineHeight: 1.15, textWrap: "balance" } as CSS}>{lab}</div>
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
      <Chalk text={<>× 46 <span style={{ fontFamily: SANS, fontWeight: 800 }}>kJ</span> per gram</>} at={M(m, 1, 30)} f={f} size={78} style={{ marginTop: 18 }} />
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
  return <Plate src="g0370" d={0.8}>
    <div style={{ position: "absolute", left: 300, right: 300, top: 400, height: 70, background: "repeating-linear-gradient(90deg,#8a5a32 0 90px,#7a4e2a 90px 96px,#94643a 96px 200px)", borderRadius: 6, boxShadow: "0 24px 30px rgba(0,0,0,.6), inset 0 6px 0 rgba(255,220,170,.18)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 262, display: "flex", justifyContent: "center", gap: 90 }}>{lit.map((l, i) => <Tealight key={i} s={1.5} on={l} seed={i * 2} />)}</div>
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

// ================= gap (136): el borde del tambor sobre la vela, y la cota de una pulgada entre la punta de la llama y el hierro
const Gap: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const a0 = M(m, 0, 8); const e = k(f, a0, 16); const dr = k(f, 2, 14);
  return <Plate src="g1390" d={0.8}>
    <div style={{ position: "absolute", left: 520, top: 150 - (1 - dr) * 500, width: 880, height: 360, borderRadius: "0 0 30px 30px", background: "linear-gradient(90deg,#3a2a20,#7a4a2c 30%,#5a3a26 55%,#2a1e18)", boxShadow: "0 24px 30px rgba(0,0,0,.6), inset 0 -18px 0 rgba(0,0,0,.35)" }}>
      {Array.from({ length: 7 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 60 + i * 120, top: 40, width: 40, height: 260, background: "rgba(176,86,44,.35)", borderRadius: 20 }} />)}
    </div>
    <div style={{ position: "absolute", left: 864, top: 533 }}><Tealight s={1.6} on={1} seed={3} /></div>
    <div style={{ position: "absolute", left: 1150, top: 510, width: 8, height: 90 * e, background: AMBER, boxShadow: "0 3px 0 rgba(0,0,0,.5)" }} />
    {[510, 600].map((y) => <div key={y} style={{ position: "absolute", left: 1120, top: y - 4, width: 68, height: 8, background: AMBER, opacity: cl(e * 3) }} />)}
    <div style={{ position: "absolute", left: 1000, top: 506, width: 120, height: 4, background: "rgba(244,168,58,.6)", opacity: cl(e * 3) }} />
    <div style={{ position: "absolute", left: 1000, top: 598, width: 120, height: 4, background: "rgba(244,168,58,.6)", opacity: cl(e * 3) }} />
    <div style={{ position: "absolute", left: 1220, top: 470, opacity: k(f, a0 + 12, 10), fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: AMBER, textShadow: "0 6px 0 rgba(0,0,0,.5)", whiteSpace: "nowrap" }}>1 inch</div>
    <Big e={k(f, a0 + 16, 12)} y={70} size={70}>Air between the flame tip and the iron.</Big>
  </Plate>;
};

// ================= rule (165): la regla grabada a golpe de punzón en una planchuela, letra por letra
const Rule: React.FC<P> = () => {
  const f = useCurrentFrame(); const T1 = "AN INCH APART", T2 = "AN INCH OF AIR ABOVE";
  const punch = (t: string, at: number) => t.split("").map((c, i) => { const v = f - at - i * 1.4; return <span key={i} style={{ opacity: v > 0 ? 1 : 0, display: "inline-block", whiteSpace: "pre", transform: `scale(${v > 0 && v < 3 ? 1.25 : 1})` }}>{c}</span>; });
  return <Plate src="g1270" d={0.75}>
    <div style={{ position: "absolute", left: 210, top: 260, width: 1500, height: 420, transform: "perspective(1600px) rotateX(16deg)", background: "linear-gradient(135deg,#d9dcdf,#8f969c)", border: "6px solid #5f666c", borderRadius: 10, boxShadow: "0 22px 30px rgba(0,0,0,.55)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 30 }}>
      {[0, 1].map((r) => <div key={r} style={{ fontFamily: SANS, fontWeight: 900, fontSize: 104, letterSpacing: 6, color: "#3a4046", textShadow: "-2px -2px 0 rgba(0,0,0,.4), 2px 2px 0 rgba(255,255,255,.6)", whiteSpace: "nowrap" }}>{punch(r ? T2 : T1, r ? 26 : 4)}</div>)}
    </div>
  </Plate>;
};

// ================= pot (179): dos tambores frente a frente — el agujero abierto deja escapar el calor, la maceta encima lo guarda
const Pot: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const a0 = M(m, 0, 10); const r = k(f, a0, 14);
  const flow = (x: number, keep: boolean, i: number) => { const t = ((f + i * 11) % 40) / 40; const y = keep ? 560 - Math.min(t, 0.55) * 360 : 560 - t * 520;
    return <div key={`${x}${i}`} style={{ position: "absolute", left: x + i * 70, top: y, width: 16, height: 90, borderRadius: 8, background: keep ? AMBER : "#d8482c", opacity: keep ? (t < 0.55 ? 0.95 : 0.95 - (t - 0.55) * 2) : 1 - t, boxShadow: "0 3px 0 rgba(0,0,0,.35)" }} />; };
  return <AbsoluteFill style={{ background: IRON }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 955, bottom: 0, backgroundImage: IMG("g1690"), backgroundSize: "cover", backgroundPosition: "50% 50%" }} />
    <div style={{ position: "absolute", left: 965, top: 0, right: 0, bottom: 0, backgroundImage: IMG("g3740"), backgroundSize: "cover", backgroundPosition: "50% 50%", clipPath: `inset(0 0 0 ${100 - r * 100}%)` }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,.1) 55%,rgba(14,12,10,.88))" }} />
    <div style={{ position: "absolute", left: 952, top: 0, bottom: 250, width: 16, background: CHALK }} />
    {[0, 1, 2].map((i) => flow(380, false, i))}
    {r > 0.6 && [0, 1, 2].map((i) => flow(1360, true, i))}
    <Lbl size={44} col="#ffb39f" style={{ position: "absolute", left: 0, width: 955, top: 70, textAlign: "center", textShadow: "0 3px 0 rgba(0,0,0,.6)" }}>OPEN HOLE · HEAT LEAVES</Lbl>
    <Lbl size={44} col={AMBER} style={{ position: "absolute", left: 965, right: 0, top: 70, textAlign: "center", opacity: r, textShadow: "0 3px 0 rgba(0,0,0,.6)" }}>POT ON · HEAT STAYS</Lbl>
    <Big e={k(f, M(m, 3, a0 + 30), 12)} y={90} size={76}>Two masses: iron below, clay above.</Big>
  </AbsoluteFill>;
};

// ================= lineup (188): la receta en fila — cada pieza cae sobre su tramo de la regla de carpintero, abajo de todo
const Lineup: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const IT: [string, string][] = [["A PAN", "g0131"], ["SAND", "g1110"], ["4 CANDLES", "g0250"], ["3 LEGS", "g1270"], ["THE DRUM", "g0530"], ["A POT", "g3740"]];
  return <Plate src="g2100" d={0.75}>
    <div style={{ position: "absolute", left: 90, right: 90, top: 820, height: 130, display: "flex" }}>
      {IT.map(([t], i) => <div key={i} style={{ flex: 1, background: i % 2 ? "#e9d9a8" : "#f2e4b8", border: "3px solid #8a7444", position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 14, boxShadow: "0 14px 18px rgba(0,0,0,.45)" }}>
        {Array.from({ length: 8 }).map((_, j) => <div key={j} style={{ position: "absolute", top: 0, left: `${j * 12.5}%`, width: 3, height: j % 2 ? 18 : 32, background: "#5a4a2a" }} />)}
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 38, color: INK, whiteSpace: "nowrap" }}>{t}</div></div>)}
    </div>
    {IT.map(([, src], i) => { const e = k(f, M(m, i, 4 + i * 8), 10); return <Print key={i} src={src} w={236} h={300} x={110 + i * 290} y={430} rot={[-3, 2, -1.5, 3, -2, 1.5][i]} e={e} />; })}
  </Plate>;
};

// ================= therm:N (199/202/205): el termómetro infrarrojo — pantalla LCD que cuenta hasta la lectura
const THERM: Record<string, [string, string, number]> = { "38": ["g1980", "GARAGE THIS MORNING", 38], "110": ["g2000", "SIDE OF THE DRUM · 20 MIN", 110], "150": ["g2030", "SIDE OF THE DRUM", 150] };
const Therm: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const [src, lab, v] = THERM[a[0]]; const from = v === 38 ? 20 : v === 110 ? 80 : 110;
  const n = interpolate(f, [6, 40], [from, v], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return <Plate src={src} d={0.45}>
    <div style={{ position: "absolute", right: 90, top: 470, width: 620, height: 470, background: "linear-gradient(160deg,#d63a26,#9c2414)", borderRadius: "40px 40px 30px 30px", boxShadow: "0 22px 30px rgba(0,0,0,.55)", transformOrigin: "100% 100%", transform: `translateY(${(1 - k(f, 0, 12)) * 500}px) scale(.82)` }}>
      <div style={{ position: "absolute", left: 50, right: 50, top: 50, height: 260, background: "#b9c7a6", borderRadius: 12, boxShadow: "inset 0 0 0 10px #262626", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 190, color: "#1e2618" }}>{Math.round(n)}<span style={{ fontSize: 90 }}>°F</span></div></div>
      <Lbl size={34} col="#fff" style={{ position: "absolute", left: 50, top: 340, whiteSpace: "normal", width: 520 }}>{lab}</Lbl>
    </div>
  </Plate>;
};

// ================= subq (218): la pregunta escrita con marcador en un cartón pegado con cinta + el botón rojo de chapa que se aprieta
const SubQ: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const a1 = M(m, 1, 60); const press = cl((f - M(m, 0, 10) - 10) / 6); const down = Math.sin(press * Math.PI);
  return <Plate src="g0630" d={0.6}>
    <div style={{ position: "absolute", right: 120, top: 110, width: 360, padding: "30px 0 24px", borderRadius: 18, background: "linear-gradient(135deg,#d9dcdf,#8f969c)", border: "5px solid #5f666c", boxShadow: "0 18px 24px rgba(0,0,0,.5)", display: "flex", flexDirection: "column", alignItems: "center", opacity: k(f, M(m, 0, 4), 10) }}>
      <div style={{ width: 170, height: 170, borderRadius: "50%", background: "#3a3f44", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 140, height: 140, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%,#ff6a56,${RED} 60%,#7c1408)`, transform: `translateY(${down * 8}px) scale(${1 - 0.06 * down})`, boxShadow: `0 ${12 - down * 10}px 0 #6a1006` }} /></div>
      <Lbl size={40} col="#2b2f33" style={{ marginTop: 18, letterSpacing: 4 }}>SUBSCRIBE</Lbl>
    </div>
    <div style={{ position: "absolute", left: 120, bottom: 110, width: 1060, padding: "46px 60px", background: "linear-gradient(170deg,#c8a36a,#b58d55)", transform: `rotate(-1.5deg) translateY(${(1 - k(f, a1, 14)) * 700}px)`, boxShadow: "0 22px 28px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 420, top: -24, width: 200, height: 52, background: "rgba(235,228,205,.85)", transform: "rotate(3deg)" }} />
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 80, lineHeight: 1.06, color: "#1b1712" }}>What's the heaviest piece of scrap iron in your garage?</div>
    </div>
  </Plate>;
};

// ================= heatmath (229): la sumadora de mostrador imprime la cuenta y la cinta sube renglón por renglón
const HeatMath: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const R: [string, string][] = [["DRUM", "5,500 g"], ["× CAST IRON", "0.46"], ["× ABOVE ROOM", "40 °C"], ["= STORED", "≈ 100,000 J"], ["", "≈ 28 Wh"]];
  const at = R.map((_, i) => M(m, i, 6 + i * 22)); const shown = at.filter((a) => f >= a).length; const hit = shown ? cl(1 - (f - at[shown - 1]) / 5) : 0;
  const H = 110 + R.slice(0, shown).reduce((s, _, i) => s + (i === 4 ? 120 : 92), 0);
  return <Plate src="g2100" d={0.78}>
    <div style={{ position: "absolute", left: 620, top: 780 - H, width: 680, height: H, background: "#fbfaf4", boxShadow: "0 0 0 2px #ddd8c8, 0 22px 30px rgba(0,0,0,.4)", padding: "40px 46px 0", boxSizing: "border-box", fontFamily: "monospace", clipPath: "polygon(0 14px,4% 0,8% 14px,12% 0,16% 14px,20% 0,24% 14px,28% 0,32% 14px,36% 0,40% 14px,44% 0,48% 14px,52% 0,56% 14px,60% 0,64% 14px,68% 0,72% 14px,76% 0,80% 14px,84% 0,88% 14px,92% 0,96% 14px,100% 0,100% 100%,0 100%)" }}>
      {R.slice(0, shown).map(([l, v], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: i === 4 ? 76 : 42, height: i === 4 ? 120 : 92, alignItems: "center", fontWeight: 900, color: i === 4 ? RED : INK, whiteSpace: "nowrap", gap: 24, borderTop: i === 3 ? "4px solid #222" : undefined }}><span>{l}</span><span>{v}</span></div>)}
    </div>
    <div style={{ position: "absolute", left: 560, top: 770, width: 800, height: 260, borderRadius: "26px 26px 10px 10px", background: "linear-gradient(180deg,#5b6066,#2f3337)", boxShadow: "0 24px 30px rgba(0,0,0,.6)", transform: `translateY(${hit * 6}px)` }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: -14, height: 28, borderRadius: 14, background: "#1b1d20" }} />
      <div style={{ position: "absolute", left: 60, top: 60, display: "grid", gridTemplateColumns: "repeat(8, 70px)", gap: 14 }}>
        {Array.from({ length: 16 }).map((_, i) => <div key={i} style={{ height: 56, borderRadius: 10, background: i === 15 ? RED : "#d9d4c6", boxShadow: "0 5px 0 rgba(0,0,0,.45)" }} />)}</div>
    </div>
  </Plate>;
};

// ================= cooldown (238): las velas se apagan y la columna del termómetro de taller baja de 140 a 100 en 45 minutos
const Cooldown: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const a0 = M(m, 0, 6); const t = k(f, a0 + 16, 60); const temp = 140 - 40 * t; const mins = Math.round(45 * t);
  const yOf = (v: number) => 760 - ((v - 60) / 100) * 560;
  return <Plate src="g2440" d={0.82}>
    <div style={{ position: "absolute", left: 270, top: 700, width: 700, height: 70, borderRadius: 10, background: "linear-gradient(180deg,#d9d2c0,#a99f88)", border: "6px solid #8d9399", boxShadow: "0 22px 26px rgba(0,0,0,.55)" }} />
    <div style={{ position: "absolute", left: 300, top: 560, display: "flex", gap: 40 }}>{[0, 1, 2, 3].map((i) => <Tealight key={i} s={1.1} on={1 - k(f, a0 + i * 4, 6)} seed={i} />)}</div>
    <div style={{ position: "absolute", left: 1180, top: 160, width: 110, height: 640, borderRadius: 55, background: "linear-gradient(90deg,#d9dcdf,#fdfdfd 45%,#b8bec4)", boxShadow: "0 22px 30px rgba(0,0,0,.55)" }} />
    <div style={{ position: "absolute", left: 1215, top: yOf(temp), width: 40, height: 800 - yOf(temp), borderRadius: 20, background: `linear-gradient(90deg,#a3220f,${RED} 50%,#e4573c)` }} />
    <div style={{ position: "absolute", left: 1165, top: 760, width: 140, height: 140, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%,#e4573c,${RED} 60%,#7c1408)`, boxShadow: "0 18px 24px rgba(0,0,0,.5)" }} />
    {[140, 120, 100, 80].map((v) => <div key={v} style={{ position: "absolute", left: 1300, top: yOf(v) - 22, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 40, height: 6, background: CHALK }} /><Lbl size={40} col={v === 100 || v === 140 ? AMBER : CHALK}>{v}°F</Lbl></div>)}
    <div style={{ position: "absolute", left: 1520, top: 330, fontFamily: "monospace", fontWeight: 900, fontSize: 110, color: CHALK, textShadow: "0 5px 0 rgba(0,0,0,.5)", whiteSpace: "nowrap" }}>{mins}<span style={{ fontSize: 50 }}> MIN</span></div>
    <Big e={k(f, M(m, 1, 60), 12)} y={60} size={66} style={{ left: 90, right: 760, textAlign: "left" }}>Candles out. Still warm at 45 minutes.</Big>
  </Plate>;
};

// ================= mass (260): la balanza de plataforma — caen tres ladrillos sobre el plato y la aguja sube con cada uno
const Mass: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const a0 = M(m, 0, 10); const br = [0, 1, 2].map((i) => interpolate(f, [a0 + i * 9, a0 + i * 9 + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }));
  const lb = 12 + br.reduce((s, x) => s + (x >= 1 ? 14 / 3 : 0), 0) + 0.0001; const ang = -120 + (lb / 40) * 240;
  return <Plate src="g2510" d={0.62}>
    <div style={{ position: "absolute", left: 1080, top: 960, width: 760, height: 50, borderRadius: "50%", background: "rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 1100, top: 900, width: 720, height: 60, borderRadius: 8, background: "linear-gradient(180deg,#9aa1a6,#4f555a)" }} />
    <div style={{ position: "absolute", left: 1430, top: 610, width: 60, height: 300, background: "linear-gradient(90deg,#4f555a,#9aa1a6,#4f555a)" }} />
    {br.map((b, i) => <div key={i} style={{ position: "absolute", left: 1130 + (i % 2) * 20, top: 836 - i * 64 - (1 - b) * 900, width: 270, height: 64, borderRadius: 6, background: "linear-gradient(160deg,#c4532f,#8e3018)", border: "2px solid #6a2410", boxShadow: "0 6px 0 rgba(0,0,0,.35)", opacity: b > 0 ? 1 : 0 }} />)}
    <div style={{ position: "absolute", left: 1250, top: 150, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(#f6f2e6 60%,#d8d0bc)", border: "16px solid #3b3f43", boxShadow: "0 22px 30px rgba(0,0,0,.55)" }}>
      {[0, 10, 20, 30, 40].map((v) => { const a = (-120 + v * 6) * Math.PI / 180; return <div key={v} style={{ position: "absolute", left: 194 + Math.sin(a) * 135 - 40, top: 194 - Math.cos(a) * 135 - 22, width: 80, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 32, color: INK }}>{v}</div>; })}
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 10, height: 170, marginLeft: -5, marginTop: -170, background: RED, transformOrigin: "50% 100%", transform: `rotate(${ang}deg)`, borderRadius: 5 }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 36, height: 36, margin: -18, borderRadius: "50%", background: "#333" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 66, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 44, color: INK }}>{Math.round(lb)} LB</div>
    </div>
    <Big e={k(f, a0 + 30, 12)} y={90} size={74} style={{ left: 90, right: 900, textAlign: "left" }}>Three bricks: almost a second drum.</Big>
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

// ================= room (281): plano de la casa visto desde arriba — los cuartos fríos en azul, solo el cuarto chico con la vela se pinta de ámbar
const Room: React.FC<P> = () => {
  const f = useCurrentFrame(); const e = k(f, 10, 20);
  const rm = (x: number, y: number, w: number, h: number, lab: string, warm?: boolean) => <div style={{ position: "absolute", left: x, top: y, width: w, height: h, border: "8px solid #2a2622", background: warm ? `rgba(244,168,58,${0.2 + 0.7 * e})` : "rgba(160,190,215,.9)", boxSizing: "border-box" }}>
    <Lbl size={34} col={warm ? INK : "#23384a"} style={{ position: "absolute", left: 0, right: 0, top: 18, textAlign: "center" }}>{lab}</Lbl>
    {warm && <div style={{ position: "absolute", left: "50%", top: 90, marginLeft: -60 }}><Tealight s={1} on={k(f, 4, 8)} /></div>}</div>;
  return <Plate src="g2790" d={0.72}>
    <div style={{ position: "absolute", left: 360, top: 140, width: 1200, height: 660, background: "#efe4c8", boxShadow: "0 22px 30px rgba(0,0,0,.5)" }}>
      {rm(0, 0, 600, 380, "LIVING ROOM")}{rm(600, 0, 600, 380, "KITCHEN")}{rm(0, 380, 400, 280, "BEDROOM")}{rm(400, 380, 380, 280, "SMALL ROOM", true)}{rm(780, 380, 420, 280, "BATH")}
    </div>
    <Big e={k(f, 26, 12)} y={90} size={72}>The smaller the room, the more 150 W counts.</Big>
  </Plate>;
};

// ================= hundred (313): la bolsa de 100 velas — cuatro bloques de 25 que se encienden, cada bloque son 25 horas
const Hundred: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <Plate src="g3120" d={0.74}>
    <div style={{ position: "absolute", left: 300, top: 150, display: "flex", gap: 120 }}>
      {[0, 1, 2, 3].map((b) => <div key={b} style={{ width: 240 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 40px)", gap: 10 }}>
          {Array.from({ length: 25 }).map((_, i) => { const on = f > 4 + (b * 25 + i) * 0.5; return <div key={i} style={{ width: 40, height: 40, borderRadius: "50%", background: on ? "radial-gradient(#fff4c4,#f4a83a 55%,#a8622a)" : "rgba(255,255,255,.14)" }} />; })}</div>
        <div style={{ textAlign: "center", marginTop: 20, fontFamily: SANS, fontWeight: 900, fontSize: 46, color: AMBER, opacity: k(f, 8 + b * 13, 8), whiteSpace: "nowrap" }}>25 h</div>
      </div>)}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 170, color: CHALK, whiteSpace: "nowrap", textShadow: "0 6px 0 rgba(0,0,0,.5)", opacity: k(f, 60, 12) }}>100 HOURS</div>
  </Plate>;
};

// ================= mistakes (315) + mist:n — la lista: chapa roja con el número y la regla correcta escrita debajo
const MIST: [string, string, string][] = [["g3180", "DRUM FLAT ON THE CANDLES", "Legs. One inch above the flame."], ["g3260", "TOO MANY, TOO CLOSE", "Four candles, one inch apart."], ["g3320", "STRAIGHT ON THE WOOD", "Full pan of sand, on a brick or tile."],
  ["g3380", "PAINT AND GREASE", "Bare iron, cleaned."], ["g3430", "WALKING AWAY", "It's a personal heater."]];
const Mistakes: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <Plate src="g2100" d={0.75}>
    {MIST.map(([src], i) => <Print key={i} src={src} w={290} h={230} x={110 + i * 350} y={150} rot={[-3, 2, -1.5, 3, -2][i]} e={k(f, 2 + i * 6, 10)}>
      <div style={{ position: "absolute", left: -12, top: -12, width: 70, height: 70, background: RED, color: "#fff", fontFamily: SERIF, fontWeight: 900, fontSize: 52, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div></Print>)}
    <Big e={k(f, 34, 14)} y={210} size={170} col={CHALK}>5 MISTAKES</Big><Big e={k(f, 46, 12)} y={120} size={56} col={AMBER}>Number three is mine.</Big>
  </Plate>;
};
const Mist: React.FC<P> = ({ a, m }) => {
  const f = useCurrentFrame(); const n = +a[0]; const [src, bad] = MIST[n - 1]; const e = k(f, 0, 10);
  return <Plate src={src} d={0.5}>
    <div style={{ position: "absolute", right: 0, top: 120, display: "flex", alignItems: "stretch", transform: `translateX(${(1 - e) * 1400}px)` }}>
      <div style={{ width: 200, background: RED, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: "#fff" }}>{n}</div>
      <div style={{ padding: "22px 60px 22px 44px", background: "rgba(20,18,16,.92)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Lbl size={34} col={AMBER} style={{ letterSpacing: 6 }}>MISTAKE</Lbl>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 68, color: CHALK, whiteSpace: "nowrap" }}>{bad}</div></div>
    </div>
  </Plate>;
};

// ================= asked (347) + ask:n — tarjetas de comentario escritas a mano clavadas con chinche en la madera del taller
const ASK: [string, string][] = [["g3500", "Is this real or is this AI?"], ["g3590", "Can a candle really heat anything?"], ["g3630", "What about stuck in the car?"], ["g3740", "Clay pot or brake drum?"]];
const Asked: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <Plate src="g3590" d={0.72}>
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

// ================= versus (370): la maceta y el tambor cara a cara — cada veredicto cae como sello bajo su copia
const Versus: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const R: [string, string][] = [["SAME HEAT", "SAME HEAT"], ["LIGHT", "HEAVY"], ["CRACKS", "DOESN'T CRACK"], ["A FEW $", "FREE"]];
  const chip = (t: string, i: number, good: boolean) => <div key={t + i} style={{ marginTop: 14, padding: "8px 22px", border: `5px solid ${good ? "#3f8a4a" : "#8a8278"}`, color: good ? "#bfe8c4" : CHALK, fontFamily: SANS, fontWeight: 900, fontSize: 40, whiteSpace: "nowrap", background: "rgba(20,18,16,.75)", opacity: k(f, M(m, i, 10 + i * 12), 6), transform: `scale(${1 + 0.3 * cl(1 - (f - M(m, i, 10 + i * 12)) / 5)})` }}>{t}</div>;
  return <Plate src="g2100" d={0.78}>
    <Print src="g0380" w={620} h={420} x={170} y={90} rot={-2.5} e={k(f, 0, 12)} cap="CLAY POT" />
    <Print src="g0530" w={620} h={420} x={1110} y={90} rot={2.5} e={k(f, 4, 12)} cap="BRAKE DRUM" />
    <div style={{ position: "absolute", left: 900, top: 270, width: 120, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: AMBER, textShadow: "0 5px 0 rgba(0,0,0,.5)" }}>vs</div>
    <div style={{ position: "absolute", left: 180, top: 600, width: 640, display: "flex", flexDirection: "column", alignItems: "center" }}>{R.map(([p], i) => chip(p, i, i === 1 || i === 0))}</div>
    <div style={{ position: "absolute", left: 1120, top: 600, width: 640, display: "flex", flexDirection: "column", alignItems: "center" }}>{R.map(([, d], i) => chip(d, i, i !== 1))}</div>
  </Plate>;
};

// ================= memory (377): la foto vieja de la granja de la abuela, bordes dentados y fecha escrita atrás que se da vuelta
const Memory: React.FC<P> = () => {
  const f = useCurrentFrame(); const flip = interpolate(f, [90, 110], [0, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return <Plate src="g3790" d={0.75}>
    <div style={{ position: "absolute", left: 560, top: 120, width: 800, height: 640, perspective: 2000 }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${flip}deg) rotate(-3deg) translateY(${(1 - k(f, 0, 14)) * 600}px)` }}>
        <div style={{ position: "absolute", inset: 0, background: "#efe6d0", padding: 26, boxSizing: "border-box", backfaceVisibility: "hidden", boxShadow: "0 22px 30px rgba(0,0,0,.5)" }}>
          <div style={{ width: "100%", height: "100%", backgroundImage: IMG("g3780"), backgroundSize: "cover", filter: "sepia(.45) saturate(.8)" }} /></div>
        <div style={{ position: "absolute", inset: 0, background: "#efe6d0", transform: "rotateY(180deg)", backfaceVisibility: "hidden", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 22px 30px rgba(0,0,0,.5)" }}>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 84, color: "#1d3d78", textAlign: "center", lineHeight: 1.1, transform: "rotate(-4deg)" }}>Grandma's farm<br />winter, '86</div></div>
      </div>
    </div>
    <Big e={k(f, 116, 12)} y={90} size={74}>The trick: my grandmother's.</Big>
  </Plate>;
};

// ================= next (430): el próximo video — la lata de café con la puerta cortada, el quemador adentro y la olla que humea arriba
const Next: React.FC<P> = () => {
  const f = useCurrentFrame(); const e = k(f, 4, 14); const fire = k(f, 20, 10);
  return <Plate src="g1310" d={0.84}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", opacity: e, transform: `scale(${0.94 + 0.06 * e})` }}>
      <Lbl size={40} col={AMBER} style={{ letterSpacing: 8 }}>NEXT VIDEO</Lbl>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 128, color: CHALK, lineHeight: 1.02, marginTop: 14, whiteSpace: "nowrap" }}>The Doomsday Burner</div>
    </div>
    <div style={{ position: "absolute", left: 760, top: 450, width: 400, height: 470 }}>
      {[0, 1, 2].map((i) => { const t = ((f + i * 14) % 42) / 42; return <div key={i} style={{ position: "absolute", left: 150 + i * 40 + Math.sin(t * 6 + i) * 14, top: -40 - t * 160, width: 30, height: 80, borderRadius: 15, background: "rgba(240,240,240,.6)", opacity: fire * (1 - t) }} />; })}
      <div style={{ position: "absolute", left: 60, top: 10, width: 280, height: 70, borderRadius: "10px 10px 30px 30px", background: "linear-gradient(90deg,#3a3f44,#8a9096 40%,#4a5056)" }} />
      <div style={{ position: "absolute", left: 30, top: 80, width: 340, height: 360, borderRadius: 10, background: "linear-gradient(90deg,#6d747a,#d6dbe0 35%,#a3aab0 60%,#5c6268)", boxShadow: "0 24px 30px rgba(0,0,0,.6)" }}>
        {Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 30 + i * 66, height: 6, background: "rgba(0,0,0,.18)" }} />)}
        <div style={{ position: "absolute", left: 90, bottom: 0, width: 160, height: 150, background: "#14100c", borderRadius: "10px 10px 0 0", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 20, bottom: -6 }}><Tealight s={1} on={fire} seed={5} /></div></div>
      </div>
    </div>
    <Lbl size={44} style={{ position: "absolute", right: 120, bottom: 150, opacity: k(f, 26, 10) }}>5 MINUTES TO BUILD</Lbl>
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
