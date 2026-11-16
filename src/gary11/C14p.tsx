// scr14a · «3-in-1 Pellet Stove From Scrap» — componentes propios, PURO CSS/DOM (sin SVG, sin blur grande, sin grano ni viñeta).
// Mundo: acero negro, óxido, crema de papel de taller, naranja brasa de pellet. Distinto de scr15a (chapa remachada, tiza) y scr15b (hojalata, corrugado, cera).
// Regla del EVALUADOR: foto REAL a sangre + UNA línea grande, nada arriba a la izquierda. m = cuadros de las palabras ancla.
import React from "react";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONTS } from "./Piezas";

const { SERIF, SANS, HAND } = FONTS;
const cl = (v: number) => Math.max(0, Math.min(1, v));
const ou = (t: number) => Easing.out(Easing.cubic)(cl(t));
const k = (f: number, a: number, len = 12) => ou((f - a) / len);
const M = (m: number[], i: number, d: number) => (m[i] ?? d);
const lin = (f: number, a: number, b: number, v0: number, v1: number) => interpolate(f, [a, b], [v0, v1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
type P = { dur: number; m: number[]; a: string[] };
type CSS = React.CSSProperties;

const IRON = "#16171a", STEEL = "#8d949b", RUST = "#9a4a22", CREAM = "#efe6d2", EMBER = "#ff7a1a", HOT = "#ffb347", INK = "#1b1a18", WHITE = "#f6f2ea", RED = "#c62f1c", WATER = "#3f86d6", GREEN = "#3f8f4a";
const IMG = (n: string) => `url(${staticFile(`scr14a/${n[0] === "y" ? "y" : "g"}/${n}.png`)})`;
const STEELG = "linear-gradient(90deg,#5c6168,#b7bdc3 30%,#8d949b 55%,#4f545a)";
const PANEL = "rgba(18,18,20,.88)";

const Plate: React.FC<{ src: string; d?: number; pos?: string; children?: React.ReactNode }> = ({ src, d = 0.5, pos = "50% 50%", children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ overflow: "hidden", background: IRON }}>
    <AbsoluteFill style={{ backgroundImage: IMG(src), backgroundSize: "cover", backgroundPosition: pos, transform: `scale(${1.03 + f * 0.00035})` }} />
    <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(14,13,12,${d * 0.4}) 0%, rgba(14,13,12,${d * 0.6}) 55%, rgba(14,13,12,${Math.min(0.94, d + 0.3)}) 100%)` }} />
    {children}
  </AbsoluteFill>;
};
const Big: React.FC<{ children: React.ReactNode; e: number; size?: number; col?: string; y?: number; style?: CSS }> = ({ children, e, size = 84, col = WHITE, y = 90, style }) => (
  <div style={{ position: "absolute", left: 90, right: 90, bottom: y, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: size, lineHeight: 1.05, color: col,
    textShadow: "0 4px 0 rgba(0,0,0,.55)", opacity: cl(e * 1.4), transform: `translateY(${(1 - e) * 40}px)`, ...style }}>{children}</div>
);
const Lbl: React.FC<{ children: React.ReactNode; size?: number; col?: string; style?: CSS; box?: boolean }> = ({ children, size = 36, col = WHITE, style, box }) => (
  <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: 2, color: col, whiteSpace: "nowrap", ...(box ? { background: PANEL, padding: "8px 22px", borderRadius: 8 } : {}), ...style }}>{children}</div>
);
// copia de foto con borde de papel de taller crema
const Print: React.FC<{ src: string; w: number; h: number; x: number; y: number; rot?: number; e?: number; cap?: string; style?: CSS }> = ({ src, w, h, x, y, rot = 0, e = 1, cap, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, padding: 12, paddingBottom: cap ? 62 : 12, background: CREAM, transform: `translateY(${(1 - e) * 80}px) rotate(${rot}deg)`, opacity: cl(e * 1.6), boxShadow: "0 18px 24px rgba(0,0,0,.55)", ...style }}>
    <div style={{ width: w, height: h, backgroundImage: IMG(src), backgroundSize: "cover", backgroundPosition: "50% 50%" }} />
    {cap && <div style={{ position: "absolute", left: 12, right: 12, bottom: 10, height: 46, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: w < 330 ? 24 : 30, color: INK, whiteSpace: "nowrap" }}>{cap}</div>}
  </div>
);
// llama de pellet (CSS)
const Flame: React.FC<{ s?: number; seed?: number; on?: number }> = ({ s = 1, seed = 0, on = 1 }) => {
  const f = useCurrentFrame(); const fl = 1 + Math.sin(f / 3 + seed) * 0.08 + Math.sin(f / 1.7 + seed * 2) * 0.05;
  return <div style={{ width: 34 * s, height: 90 * s * fl * on, borderRadius: "50% 50% 40% 40% / 70% 70% 30% 30%", opacity: on,
    background: `radial-gradient(ellipse at 50% 90%, #fff4c8 0%, ${HOT} 30%, ${EMBER} 58%, rgba(200,60,10,0) 80%)` }} />;
};
// pellet (cilindrito marrón)
const Pel: React.FC<{ x: number; y: number; r?: number; s?: number; c?: string }> = ({ x, y, r = 0, s = 1, c }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 26 * s, height: 11 * s, borderRadius: 6 * s, background: c || "linear-gradient(180deg,#c99a5c,#8a5d2e)", transform: `rotate(${r}deg)`, boxShadow: "0 2px 0 rgba(0,0,0,.35)" }} />
);
// dial redondo con aguja (termómetros, manómetro)
const Dial: React.FC<{ x: number; y: number; d: number; ang: number; ring?: string; face?: string; children?: React.ReactNode; red?: [number, number] }> = ({ x, y, d, ang, ring = "#2b2d30", face = "#fbf8f0", children, red }) => (
  <div style={{ position: "absolute", left: x, top: y, width: d, height: d, borderRadius: "50%", background: ring, padding: d * 0.05, boxSizing: "border-box", boxShadow: "0 20px 28px rgba(0,0,0,.55)" }}>
    <div style={{ width: "100%", height: "100%", borderRadius: "50%", position: "relative", overflow: "hidden",
      background: red ? `conic-gradient(from ${red[0]}deg, rgba(198,47,28,.85) 0deg ${red[1] - red[0]}deg, ${face} ${red[1] - red[0]}deg 360deg)` : face }}>
      {red && <div style={{ position: "absolute", inset: d * 0.09, borderRadius: "50%", background: face }} />}
      {Array.from({ length: 24 }).map((_, i) => <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: 4, height: i % 2 ? d * 0.04 : d * 0.07, marginLeft: -2, background: INK, transformOrigin: `50% ${d * 0.43}px`, transform: `translateY(${-d * 0.43}px) rotate(${i * 15}deg)` }} />)}
      {children}
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 10, height: d * 0.36, marginLeft: -5, marginTop: -d * 0.36, background: RED, borderRadius: 5, transformOrigin: "50% 100%", transform: `rotate(${ang}deg)` }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 30, height: 30, margin: -15, borderRadius: "50%", background: INK }} />
    </div>
  </div>
);
// corte de la garrafa (vista de costado, parada)
const TankCut: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode; style?: CSS }> = ({ x, y, w, h, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: `${w * 0.28}px ${w * 0.28}px ${w * 0.22}px ${w * 0.22}px`, border: "14px solid #6a6f75", background: "rgba(10,10,12,.82)", overflow: "hidden", boxShadow: "0 22px 30px rgba(0,0,0,.55), inset 0 0 0 4px #9aa0a6", ...style }}>{children}</div>
);

// ================= jobs (001) / jobs:go (191) / jobs:done (241): tres trabajos, un fuego
const JOBS: [string, string, string][] = [["HEAT", "g1940", "+19 °F"], ["COOK", "g2250", "5 MIN"], ["BOIL", "y2380", "22 MIN"]];
const Jobs: React.FC<P> = ({ m, a }) => {
  const f = useCurrentFrame(); const mode = a[0] || "";
  return <Plate src="g0050" d={0.88}>
    <div style={{ position: "absolute", left: 140, right: 140, top: 130, display: "flex", gap: 50 }}>
      {JOBS.map(([t, src, v], i) => { const e = k(f, M(m, i, 6 + i * 20), 12); const glow = mode === "go" ? 0.3 : e;
        return <div key={t} style={{ flex: 1, opacity: cl(e * 2), transform: `translateY(${(1 - e) * 120}px)` }}>
          <div style={{ height: 420, backgroundImage: IMG(src), backgroundSize: "cover", backgroundPosition: "50% 50%", border: `8px solid ${glow > 0.5 ? EMBER : "#3a3c40"}`, boxShadow: `0 0 ${50 * glow}px rgba(255,122,26,${0.7 * glow}), 0 20px 26px rgba(0,0,0,.5)` }} />
          <div style={{ marginTop: 22, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 84, color: WHITE }}>{i + 1}. {t}</div>
            {mode === "done" && <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 54, color: EMBER, opacity: k(f, 20 + i * 14, 8) }}>✓ {v}</div>}
            {mode === "go" && <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 60, color: HOT, opacity: k(f, 20 + i * 14, 8) }}>?</div>}
          </div></div>; })}
    </div>
    <Big e={k(f, mode ? 50 : M(m, 2, 46) + 16, 12)} y={70} size={76}>{mode === "done" ? "All three, from one little fire." : mode === "go" ? "Real numbers. Thermometer and stopwatch." : "One fire. Three jobs."}</Big>
  </Plate>;
};

// ================= nope (004): FAN · AUGER · CIRCUIT BOARD — cada placa se parte en dos con un corte de amoladora
const Nope: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const W = ["FAN", "AUGER", "CIRCUIT BOARD"];
  return <Plate src="g0050" d={0.86}>
    {W.map((t, i) => { const a0 = M(m, i, 4 + i * 16); const cut = k(f, a0 + 8, 10); const sp = f > a0 + 4 && f < a0 + 14;
      const half = (top: boolean) => <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#3b3e43,#24262a)", border: "6px solid #55595f", display: "flex", alignItems: "center", justifyContent: "center",
        clipPath: top ? "polygon(0 0,100% 0,100% 38%,0 62%)" : "polygon(0 62%,100% 38%,100% 100%,0 100%)", transform: `translate(${(top ? -1 : 1) * cut * 18}px,${(top ? -1 : 1) * cut * 26}px) rotate(${(top ? -1 : 1) * cut * 3}deg)` }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: t.length > 6 ? 58 : 84, color: WHITE, letterSpacing: 3 }}>{t}</div></div>;
      return <div key={t} style={{ position: "absolute", left: 130 + i * 580, top: 230, width: 500, height: 330, opacity: k(f, a0 - 6, 8) }}>
        {half(true)}{half(false)}
        {sp && Array.from({ length: 10 }).map((_, j) => <div key={j} style={{ position: "absolute", left: 250 + Math.cos(j * 0.7 + f) * (30 + (f - a0) * 14), top: 165 + Math.sin(j * 0.9) * 20 - (f - a0) * 3, width: 26, height: 4, borderRadius: 2, background: HOT, transform: `rotate(${j * 36}deg)` }} />)}
      </div>; })}
    <Big e={k(f, M(m, 2, 40) + 18, 12)} y={120} size={92} col={HOT}>Just gravity.</Big>
  </Plate>;
};

// ================= steps (012) / recap (364) / rc:n — diez etiquetas colgadas en un tablero perforado; el número de paso pintado a mano
const STEPS = ["SCRAP LIST + COST", "MAKE THE TANK SAFE", "CUT THE BODY", "THE GRAVITY HOPPER", "GRATE + AIR", "THE COOKTOP", "CHIMNEY + WATER", "FIRST FIRE OUTSIDE", "THE THREE TESTS", "RUN IT ALL NIGHT"];
const STEP_IMG = ["g0220", "g0540", "g0680", "g0980", "g1220", "g1350", "g1620", "g1780", "g2250", "g2620"];
const PEG = `radial-gradient(circle at 18px 18px, #1d1813 5px, transparent 6px) 0 0 / 36px 36px, linear-gradient(180deg,#8a6a45,#76583a)`;
const Board: React.FC<P & { pick?: number; recap?: boolean }> = ({ pick, recap }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: PEG }}>
    <AbsoluteFill style={{ background: "linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.4))" }} />
    {STEP_IMG.map((src, i) => { const e = k(f, i * 3, 10); const sw = Math.sin((f - i * 3) / 5) * 9 * Math.exp(-(f - i * 3) / 22) * (f > i * 3 ? 1 : 0);
      const on = pick === undefined || pick === i + 1; const big = pick === i + 1 ? k(f, 10, 14) : 0;
      const x = 70 + (i % 5) * 362, y = i < 5 ? 70 : 520;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 330, transformOrigin: "50% -20px", opacity: cl(e * 2) * (on ? 1 : 0.35), zIndex: big > 0 ? 5 : 1,
        transform: `rotate(${sw}deg) translateY(${(1 - e) * -200}px) scale(${1 + big * 0.35})` }}>
        <div style={{ position: "absolute", left: 151, top: -34, width: 28, height: 44, border: "6px solid #c9ced3", borderBottom: "none", borderRadius: "14px 14px 0 0" }} />
        <div style={{ background: CREAM, padding: 12, boxShadow: "0 16px 20px rgba(0,0,0,.5)" }}>
          <div style={{ height: 210, backgroundImage: IMG(src), backgroundSize: "cover", backgroundPosition: "50% 50%" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10, height: 70 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: RUST, width: 70, textAlign: "center" }}>{i + 1}</div>
            <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 25, color: INK, lineHeight: 1.1 }}>{STEPS[i]}</div></div>
        </div></div>; })}
    {pick === undefined && <Big e={k(f, 30, 12)} y={30} size={60} style={{ background: PANEL, left: 520, right: 520, padding: "10px 0", borderRadius: 12 }}>{recap ? "The whole build." : "Ten steps."}</Big>}
  </AbsoluteFill>;
};

// ================= step:n — chapa negra: «STEP n» se escribe con tiza de jabón (borde con chispa), a la derecha la copia del paso abulonada
const Step: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const n = +a[0]; const w = k(f, 2, 22); const e = k(f, 6, 14);
  return <Plate src={STEP_IMG[n - 1]} d={0.9}>
    <div style={{ position: "absolute", left: 90, top: 180, width: 820, height: 600, background: "linear-gradient(160deg,#2a2c30,#141517)", border: "4px solid #3f4247", boxShadow: "0 22px 30px rgba(0,0,0,.55)" }}>
      <div style={{ position: "absolute", left: 60, top: 40, clipPath: `inset(0 ${100 - w * 100}% 0 0)` }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 90, color: "#e9e6de", letterSpacing: 6 }}>STEP</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 300, lineHeight: 0.9, color: "#f2efe6" }}>{n}<span style={{ fontSize: 110, color: "#a9a59b" }}> of 10</span></div>
      </div>
      {w < 0.98 && <div style={{ position: "absolute", left: 60 + w * 640, top: 200, width: 24, height: 24, borderRadius: "50%", background: "#fff6d8", boxShadow: `0 0 30px 12px ${HOT}` }} />}
      <div style={{ position: "absolute", left: 60, bottom: 50, padding: "12px 26px", background: EMBER, fontFamily: SANS, fontWeight: 900, fontSize: 48, color: INK, opacity: k(f, 22, 10), whiteSpace: "nowrap" }}>{STEPS[n - 1]}</div>
    </div>
    <div style={{ position: "absolute", left: 1000, top: 220, width: 820, height: 540, backgroundImage: IMG(STEP_IMG[n - 1]), backgroundSize: "cover", border: "16px solid #2b2d31", boxShadow: "0 22px 30px rgba(0,0,0,.55)", transform: `translateX(${(1 - e) * 900}px)` }}>
      {[[-6, -6], [774, -6], [-6, 494], [774, 494]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 26, height: 26, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#d7dbdf,#6d7279)" }} />)}
    </div>
  </Plate>;
};

// ================= prize (014): la puerta de la estufa se cierra sobre el truco de la noche — «AL FINAL»
const Prize: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const shut = lin(f, dur - 40, dur - 22, 0, 1);
  return <Plate src="g2620" d={0.6}>
    <div style={{ position: "absolute", left: 460, top: 150, width: 1000, height: 560, overflow: "hidden", border: "18px solid #2b2d31", background: "rgba(10,10,12,.55)", boxShadow: "0 22px 30px rgba(0,0,0,.55)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", opacity: k(f, 4, 12) }}>
        <Lbl size={44} col={HOT} style={{ letterSpacing: 10 }}>STEP 10</Lbl>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 104, color: WHITE, lineHeight: 1.05, marginTop: 14 }}>All night<br />on one load</div></div>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "50%", background: "linear-gradient(90deg,#3a3d42,#55595f)", transform: `translateX(${(shut - 1) * 100}%)`, borderRight: "6px solid #1d1f22" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "50%", background: "linear-gradient(270deg,#3a3d42,#55595f)", transform: `translateX(${(1 - shut) * 100}%)` }} />
    </div>
    <Big e={k(f, 20, 12)} y={90} size={70} col={HOT}>Saved for the end.</Big>
  </Plate>;
};

// ================= parts (035): vista explotada — la estufa al centro y sus piezas alrededor con línea guía
const PARTS: [string, string, number, number][] = [["PROPANE TANK", "g0220", 80, 90], ["4\" SQUARE TUBE", "g0260", 80, 600], ["¼\" PLATE", "g0300", 1480, 90], ["GRILL GRATE", "g0320", 1480, 600], ["STEEL BUCKET", "g0340", 780, 690]];
const Parts: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <Plate src="g0050" d={0.9}>
    <div style={{ position: "absolute", left: 700, top: 90, width: 520, height: 520, borderRadius: "50%", backgroundImage: IMG("g0050"), backgroundSize: "cover", border: `10px solid ${EMBER}`, boxShadow: "0 22px 30px rgba(0,0,0,.6)", opacity: k(f, 0, 12) }} />
    {PARTS.map(([t, src, x, y], i) => { const e = k(f, 8 + i * 9, 10); const cx = x + 180, cy = y + 140; const dx = 960 - cx, dy = 350 - cy; const L = Math.hypot(dx, dy) - 280;
      return <React.Fragment key={t}>
        <div style={{ position: "absolute", left: cx, top: cy, width: L * e, borderTop: "5px dashed rgba(246,242,234,.8)", transformOrigin: "0 0", transform: `rotate(${Math.atan2(dy, dx)}rad)` }} />
        <Print src={src} w={340} h={220} x={x} y={y} e={e} cap={t} rot={[-2, 1.5, 2, -1.5, 1][i]} />
      </React.Fragment>; })}
  </Plate>;
};

// ================= receipt (036): ticket de ferretería que sale impreso renglón a renglón
const RCPT: [string, string][] = [["PROPANE TANK", "FREE"], ["4\" SQ TUBE · DROP", "$4.00"], ["¼\" PLATE (MY PILE)", "$12.00"], ["GRILL GRATE", "FREE"], ["STEEL BUCKET", "FREE"], ["HOSE BIB", "FREE"]];
const Receipt: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const n = Math.floor(lin(f, 6, Math.max(40, dur - 30), 0, RCPT.length + 0.99));
  return <Plate src="g0270" d={0.78}>
    <div style={{ position: "absolute", left: 640, top: 60, width: 640, height: 40, background: "#2b2d31", borderRadius: 8 }} />
    <div style={{ position: "absolute", left: 670, top: 80, width: 580, background: "#fdfcf8", boxShadow: "0 22px 30px rgba(0,0,0,.5)", padding: "40px 40px 30px", boxSizing: "border-box", fontFamily: "monospace", fontWeight: 900, color: INK }}>
      <div style={{ fontSize: 36, textAlign: "center", letterSpacing: 4, marginBottom: 24 }}>SCRAP RUN</div>
      {RCPT.slice(0, n).map(([l, v]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 34, marginBottom: 18, whiteSpace: "nowrap" }}><span>{l}</span><span style={{ color: v === "FREE" ? GREEN : INK }}>{v}</span></div>)}
      <div style={{ borderTop: "4px dashed #333", marginTop: 10, height: 10 }} />
    </div>
    <Big e={k(f, dur - 30, 12)} y={70} size={74} col={HOT}>Most of it was free.</Big>
  </Plate>;
};

// ================= tools (037): pared de herramientas con siluetas pintadas que se llenan
const TOOLS: [string, number, number, number, number][] = [["ANGLE GRINDER", 140, 130, 520, 200], ["WELDER", 720, 130, 460, 300], ["DRILL + STEP BIT", 1240, 130, 520, 200], ["TAPE", 140, 420, 260, 170], ["SOAPSTONE", 440, 420, 220, 170], ["FACE SHIELD", 1240, 420, 520, 200], ["FIRE EXTINGUISHER", 720, 520, 460, 200]];
const Tools: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "linear-gradient(180deg,#c4a77d,#a98a5f)" }}>
    <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, rgba(0,0,0,.05) 0 2px, transparent 2px 160px)" }} />
    {TOOLS.map(([t, x, y, w, h], i) => { const on = k(f, 6 + i * Math.max(6, (dur - 60) / 7), 8);
      return <div key={t} style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 26, border: `8px solid ${EMBER}`, background: `rgba(27,26,24,${0.2 + on * 0.7})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: w < 300 ? 34 : 44, color: on > 0.5 ? WHITE : "rgba(27,26,24,.5)", textAlign: "center", lineHeight: 1.1 }}>{on > 0.5 ? "✓ " : ""}{t}</div></div>; })}
    <Big e={k(f, dur - 40, 12)} y={70} size={70} col={INK} style={{ textShadow: "none" }}>Extinguisher within reach.</Big>
  </AbsoluteFill>;
};

// ================= vapor (045): la garrafa acostada en corte — el vapor pesado en el fondo y la chispa que se acerca
const Vapor: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const sx = lin(f, 30, dur - 30, 1700, 1300); const boom = f > dur - 30 ? Math.sin((f - dur + 30) * 0.9) * 0.5 + 0.5 : 0;
  return <Plate src="g0440" d={0.9}>
    <TankCut x={420} y={300} w={880} h={420} style={{ borderRadius: 200 }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 150 * k(f, 6, 30), background: `repeating-linear-gradient(${f * 2}deg, rgba(255,190,90,.55) 0 18px, rgba(255,150,60,.35) 18px 36px)` }} />
    </TankCut>
    <Lbl size={44} col={HOT} box style={{ position: "absolute", left: 560, top: 740, opacity: k(f, 20, 10) }}>PROPANE VAPOR · HEAVIER THAN AIR</Lbl>
    <div style={{ position: "absolute", left: sx, top: 620, width: 34, height: 34, borderRadius: "50%", background: "#fff6d8", boxShadow: `0 0 40px 18px ${HOT}`, opacity: k(f, 30, 8) }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", opacity: boom }}><Lbl size={72} col={WHITE} style={{ background: RED, padding: "14px 40px", borderRadius: 12 }}>SPARK + VAPOR = A BOMB</Lbl></div>
    <Big e={k(f, 12, 12)} y={60} size={68}>Empty is never empty.</Big>
  </Plate>;
};

// ================= fill (056): la garrafa parada en corte — el agua sube y empuja el vapor afuera por el agujero
const Fill: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const lv = lin(f, 6, dur - 20, 0.05, 1);
  return <Plate src="g0540" d={0.88}>
    <div style={{ position: "absolute", left: 875, top: 120, width: 170, height: 70, background: "#6a6f75", borderRadius: 10 }} />
    <TankCut x={700} y={170} w={520} h={680}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lv * 100}%`, background: `linear-gradient(180deg,#7fb6f0,${WATER})` }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: `${lv * 100}%`, height: 70 * (1 - lv * 0.9), background: "repeating-linear-gradient(20deg, rgba(255,190,90,.6) 0 14px, rgba(255,150,60,.35) 14px 28px)" }} />
    </TankCut>
    {[0, 1, 2].map((i) => { const t = ((f + i * 12) % 36) / 36; return <div key={i} style={{ position: "absolute", left: 930 + (i - 1) * 40, top: 110 - t * 120, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,180,90,.45)", opacity: (1 - t) * (1 - lv * 0.7) }} />; })}
    <Lbl size={46} box col="#bfe0ff" style={{ position: "absolute", left: 1290, top: 560 }}>WATER IN</Lbl>
    <Lbl size={46} box col={HOT} style={{ position: "absolute", left: 1290, top: 140 }}>VAPOR OUT</Lbl>
    <Big e={k(f, 10, 12)} y={60} size={72}>Fill it to the brim. Dump. Fill again.</Big>
  </Plate>;
};

// ================= stat:x — chapa de identificación de bronce remachada, con un brillo que la cruza
const STAT: Record<string, [string, string, string, string]> = {
  mercaptan: ["y0610", "ETHYL MERCAPTAN", "THE ROTTEN-EGG SMELL ADDED TO PROPANE", "NFPA 58 · LP-GAS CODE"],
  btu: ["y0100", "≈ 8,000 BTU / LB", "HEAT IN ONE POUND OF WOOD PELLETS", "US DOE · PELLET FUELS INSTITUTE"],
  cdc: ["y2700", "TENS OF THOUSANDS", "ER VISITS A YEAR FROM CARBON MONOXIDE", "CDC"],
  nfpa: ["g3080", "36 INCHES", "UNLISTED STOVE TO ANYTHING THAT CAN BURN", "NFPA 211"] };
const Stat: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const [src, big, lab, so] = STAT[a[0]] || STAT.btu; const e = k(f, 2, 14); const sh = lin(f, 14, 44, -40, 140);
  return <Plate src={src} d={0.55}>
    <div style={{ position: "absolute", left: 260, right: 260, bottom: 90, padding: "34px 60px", borderRadius: 14, background: "linear-gradient(160deg,#e9cf8a,#b88c3e 55%,#d9b867)", border: "6px solid #7d5a20", boxShadow: "0 22px 30px rgba(0,0,0,.55)", textAlign: "center", overflow: "hidden", transform: `translateY(${(1 - e) * 420}px)` }}>
      {[[16, 16], [16, -1], [-1, 16], [-1, -1]].map(([l, t], i) => <div key={i} style={{ position: "absolute", left: l >= 0 ? l : undefined, right: l < 0 ? 16 : undefined, top: t >= 0 ? t : undefined, bottom: t < 0 ? 16 : undefined, width: 26, height: 26, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#fff1c2,#8a6526)" }} />)}
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: big.length > 12 ? 92 : 112, color: "#3a2a0e", lineHeight: 1, whiteSpace: "nowrap", textShadow: "0 2px 0 rgba(255,240,200,.6)" }}>{big}</div>
      <Lbl size={36} col="#3a2a0e" style={{ marginTop: 12 }}>{lab}</Lbl>
      <Lbl size={28} col="#5a4115" style={{ marginTop: 12 }}>SOURCE · {so}</Lbl>
      <div style={{ position: "absolute", top: -40, bottom: -40, left: `${sh}%`, width: 120, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent)", transform: "skewX(-20deg)" }} />
    </div>
  </Plate>;
};

// ================= cuts (069): las marcas de tiza en la garrafa — la puerta 5×4 y el agujero de 6"
const Cuts: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const d1 = k(f, M(m, 0, 6), 20), d2 = k(f, M(m, 1, 50), 20);
  const dash = "6px dashed #f2efe6";
  return <Plate src="g0680" d={0.9}>
    <div style={{ position: "absolute", left: 660, top: 170, width: 600, height: 700, borderRadius: "170px 170px 120px 120px", background: "linear-gradient(90deg,#6d7278,#c3c8cd 35%,#9aa0a6 60%,#5c6167)", boxShadow: "0 22px 30px rgba(0,0,0,.55)" }}>
      <div style={{ position: "absolute", left: 175, top: 430, width: 250 * d1, height: 200, borderTop: dash, borderBottom: d1 > 0.98 ? dash : "none" }} />
      <div style={{ position: "absolute", left: 175, top: 430, width: 250, height: 200 * d1, borderLeft: dash, borderRight: d1 > 0.98 ? dash : "none", boxSizing: "border-box" }} />
      <div style={{ position: "absolute", left: 150, top: -20, width: 300, height: 60, borderRadius: "50%", border: dash, opacity: d2, transform: `scale(${0.6 + 0.4 * d2})` }} />
    </div>
    <Lbl size={44} box style={{ position: "absolute", left: 1290, top: 590, opacity: d1 }}>DOOR · 5" × 4"</Lbl>
    <Lbl size={36} box style={{ position: "absolute", left: 1290, top: 680, opacity: d1 }}>2" ABOVE THE BOTTOM SEAM</Lbl>
    <Lbl size={44} box col={HOT} style={{ position: "absolute", left: 1290, top: 150, opacity: d2 }}>TOP · 6" ROUND HOLE</Lbl>
    <Big e={k(f, 8, 12)} y={40} size={62}>Two cuts, with the tank full of water.</Big>
  </Plate>;
};

// ================= three (080): cuatro patas se hamacan en el piso desparejo, tres no
const Three: React.FC<P> = () => {
  const f = useCurrentFrame(); const rock = Math.sin(f / 5) * 3;
  const stove = (x: number, legs: number, r: number, lab: string, col: string) => <div style={{ position: "absolute", left: x, top: 250, width: 520 }}>
    <div style={{ transform: `rotate(${r}deg)`, transformOrigin: "50% 100%" }}>
      <div style={{ margin: "0 auto", width: 300, height: 340, borderRadius: "90px 90px 60px 60px", background: STEELG }} />
      <div style={{ display: "flex", justifyContent: "space-between", width: 320, margin: "0 auto" }}>{Array.from({ length: legs }).map((_, i) => <div key={i} style={{ width: 22, height: 90, background: "#3a3d42" }} />)}</div></div>
    <div style={{ height: 24, background: "repeating-linear-gradient(90deg,#8b8478 0 60px,#7b7468 60px 130px)", borderRadius: 6 }} />
    <Lbl size={46} col={col} box style={{ marginTop: 26, textAlign: "center" }}>{lab}</Lbl></div>;
  return <Plate src="g0760" d={0.88}>
    {stove(260, 4, rock, "4 LEGS · ROCKS", "#ff9a8a")}{stove(1140, 3, 0, "3 LEGS · NEVER ROCKS", HOT)}
    <Big e={k(f, 20, 12)} y={70} size={70}>A stove full of fire should never rock.</Big>
  </Plate>;
};

// ================= auger (085): la estufa de tienda — el tornillo gira con el enchufe; se corta la luz y se para
const Auger: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const cut = M(m, 1, Math.floor(dur * 0.55)); const on = f < cut ? 1 : 0;
  return <Plate src="g0840" d={0.88}>
    <div style={{ position: "absolute", left: 300, top: 260, width: 1000, height: 120, borderRadius: 60, background: "#2b2d31", border: "8px solid #55595f", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(60deg, #9aa0a6 0 20px, #4a4e54 20px 44px)`, backgroundPositionX: on ? f * 6 : cut * 6 }} /></div>
    <Lbl size={40} box style={{ position: "absolute", left: 300, top: 190 }}>AUGER · NEEDS A MOTOR</Lbl>
    <div style={{ position: "absolute", left: 1330, top: 230, width: 180, height: 180, borderRadius: 24, background: on ? "#ffe9b0" : "#3a3c40", boxShadow: on ? `0 0 60px 10px ${HOT}` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 40, color: INK }}>{on ? "POWER" : ""}</div>
    <div style={{ position: "absolute", left: 1420, top: 410, width: 12, height: 220, background: "#111" }} />
    <div style={{ position: "absolute", left: 1385, top: 630 + (1 - on) * 60, width: 80, height: 60, borderRadius: 10, background: "#222", transform: `rotate(${(1 - on) * 25}deg)` }} />
    {!on && <Lbl size={66} col={WHITE} style={{ position: "absolute", left: 300, top: 470, background: RED, padding: "12px 36px", borderRadius: 12 }}>POWER OUT = COLD STOVE</Lbl>}
    <Big e={k(f, 6, 12)} y={70} size={70}>Exactly when you need it most.</Big>
  </Plate>;
};

// ================= gravity (088): pellets que bajan solos por el caño a 45° hacia la brasa
const Gravity: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <Plate src="y0890" d={0.88}>
    <div style={{ position: "absolute", left: 360, top: 160, width: 900, height: 150, transformOrigin: "0 50%", transform: "rotate(35deg)", background: "rgba(40,42,46,.92)", border: "10px solid #8d949b", overflow: "hidden" }}>
      {Array.from({ length: 30 }).map((_, i) => { const t = ((i / 30) + f / 160) % 1; return <Pel key={i} x={t * 880} y={20 + (i * 37) % 100} r={(i * 47) % 180} s={1.5} />; })}
    </div>
    <div style={{ position: "absolute", left: 1050, top: 640, display: "flex", gap: 6 }}>{[0, 1, 2, 3, 4].map((i) => <Flame key={i} s={1.5} seed={i} />)}</div>
    <Lbl size={50} col={HOT} box style={{ position: "absolute", left: 1220, top: 520 }}>FIRE EATS · PELLETS SLIDE IN</Lbl>
    <Big e={k(f, 10, 12)} y={70} size={84}>It feeds itself.</Big>
  </Plate>;
};

// ================= angle (092): el transportador — el montón de pellets se planta a 30–35°, el caño va a 45°
const Angle: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const t = lin(f, M(m, 0, 6), M(m, 0, 6) + 50, 15, 45); const ok = t > 36;
  const O = { x: 560, y: 820 };
  return <Plate src="y0960" d={0.9}>
    <div style={{ position: "absolute", left: O.x - 520, top: O.y - 520, width: 1040, height: 1040, borderRadius: "50%", background: `conic-gradient(from 0deg, rgba(198,47,28,.0) 0deg 55deg, rgba(198,47,28,.35) 55deg 60deg, rgba(198,47,28,.0) 60deg)`, clipPath: "inset(0 0 50% 50%)" }} />
    <div style={{ position: "absolute", left: O.x - 520, top: O.y - 520, width: 1040, height: 1040, borderRadius: "50%", border: "6px solid rgba(246,242,234,.6)", clipPath: "inset(0 0 50% 50%)" }} />
    <div style={{ position: "absolute", left: O.x, top: O.y, width: 700, height: 260, background: "linear-gradient(180deg,#c99a5c,#8a5d2e)", clipPath: "polygon(0 100%,100% 100%,0 25%)", transform: "translateY(-260px)", opacity: k(f, 4, 12) }} />
    <div style={{ position: "absolute", left: O.x, top: O.y - 7, width: 900, height: 14, background: ok ? EMBER : "#ff9a8a", transformOrigin: "0 50%", transform: `rotate(${-t}deg)`, borderRadius: 7 }} />
    <div style={{ position: "absolute", left: O.x - 40, top: O.y - 40, width: 80, height: 80, borderRadius: "50%", background: CREAM }} />
    <Lbl size={46} box col="#e8c79a" style={{ position: "absolute", left: 1290, top: 690 }}>PELLETS STOP AT 30–35°</Lbl>
    <div style={{ position: "absolute", left: 1290, top: 360, fontFamily: SERIF, fontWeight: 700, fontSize: 170, color: ok ? EMBER : WHITE, textShadow: "0 5px 0 rgba(0,0,0,.6)" }}>{Math.round(t)}°</div>
    <Big e={k(f, M(m, 1, 60), 12)} y={60} size={70}>Steeper than the pile. I go 45.</Big>
  </Plate>;
};

// ================= finder (099): inclinómetro magnético analógico que llega a 45
const Finder: React.FC<P> = () => {
  const f = useCurrentFrame(); const v = lin(f, 6, 40, 0, 45) + (f > 40 && f < 52 ? Math.sin(f) * 0.6 : 0);
  return <Plate src="g0980" d={0.7}>
    <Dial x={1240} y={170} d={560} ang={-90 + v * 2} ring="#d94a1c">
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 84, color: INK }}>{v.toFixed(1)}°</div>
    </Dial>
    <Big e={k(f, 46, 12)} y={90} size={86} col={HOT} style={{ right: 760 }}>Forty five on the nose.</Big>
  </Plate>;
};

// ================= slope (102) / slope:back (256): el corte — el caño termina en la pared, la pila hace su pendiente, el fuego come el frente
const Slope: React.FC<P> = ({ a, m }) => {
  const f = useCurrentFrame(); const back = a[0] === "back"; const e1 = k(f, M(m, 0, 6), 14), e2 = k(f, M(m, 1, 40), 14);
  return <Plate src="g1040" d={0.9}>
    <TankCut x={780} y={150} w={760} h={720}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, height: 14, background: "repeating-linear-gradient(90deg,#9aa0a6 0 20px,transparent 20px 34px)" }} />
      <div style={{ position: "absolute", left: 0, bottom: 164, width: 380, height: 220, background: "linear-gradient(180deg,#c99a5c,#8a5d2e)", clipPath: "polygon(0 0,0 100%,100% 100%)", opacity: e1 }} />
      <div style={{ position: "absolute", left: 230, bottom: 164, display: "flex", gap: 2, transform: "rotate(-30deg)", transformOrigin: "0 100%", opacity: e2 }}>{[0, 1, 2, 3, 4].map((i) => <Flame key={i} s={1.2} seed={i} />)}</div>
    </TankCut>
    <div style={{ position: "absolute", left: 300, top: 120, width: 560, height: 150, transformOrigin: "100% 100%", transform: "rotate(45deg) translate(-20px,0)", background: "rgba(40,42,46,.95)", border: "10px solid #8d949b" }}>
      {Array.from({ length: 14 }).map((_, i) => <Pel key={i} x={20 + (i % 7) * 76} y={20 + Math.floor(i / 7) * 50} r={(i * 40) % 180} s={1.6} />)}</div>
    <Lbl size={42} box col={HOT} style={{ position: "absolute", left: 120, top: 620, opacity: e1 }}>TUBE STOPS AT THE WALL</Lbl>
    <Lbl size={42} box style={{ position: "absolute", left: 120, top: 700, opacity: e2 }}>FIRE BURNS THE FRONT OF THE PILE</Lbl>
    {back && <><div style={{ position: "absolute", left: 830, top: 650, width: 230, height: 8, background: HOT, opacity: k(f, 30, 10) }} />
      <Lbl size={56} col={HOT} box style={{ position: "absolute", left: 860, top: 560, opacity: k(f, 30, 10) }}>~4 IN</Lbl></>}
    <Big e={k(f, 10, 12)} y={40} size={62}>{back ? "The heat has to swim upstream." : "The tube stays out of the hottest part."}</Big>
  </Plate>;
};

// ================= air3 (115): perilla de aire — POCO / JUSTO / MUCHO, cada uno con su resultado
const AIR: [string, string, string][] = [["TOO LITTLE", "SMOKE · SOOT · CO", "#ff9a8a"], ["JUST RIGHT", "CLEAN, STEADY FIRE", HOT], ["TOO MUCH", "A BAG IN AN AFTERNOON", "#ff9a8a"]];
const Air3: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const t = lin(f, 6, dur - 20, 0, 2.99); const i = t < 1 ? 0 : t < 2 ? 2 : 1; const ang = [-60, 60, 0][i];
  return <Plate src="y1160" d={0.85}>
    <div style={{ position: "absolute", left: 220, top: 200, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#6a6f75,#24262a)", boxShadow: "0 22px 30px rgba(0,0,0,.6)", transform: `rotate(${ang}deg)`, transition: "none" }}>
      <div style={{ position: "absolute", left: 210, top: 20, width: 60, height: 200, borderRadius: 30, background: CREAM }} /></div>
    {AIR.map(([t1, t2, col], j) => <div key={j} style={{ position: "absolute", left: 860, top: 200 + j * 190, opacity: i === j ? 1 : 0.25 }}>
      <Lbl size={66} col={col}>{t1}</Lbl><Lbl size={42} style={{ marginTop: 6 }}>{t2}</Lbl></div>)}
    <Big e={k(f, 8, 12)} y={70} size={70}>With pellets, you manage the air.</Big>
  </Plate>;
};

// ================= airflow (123): flechitas de aire — primario por abajo de la parrilla, secundario arriba atrás que quema el humo
const Chevs: React.FC<{ x: number; y: number; rot: number; n: number; col: string; len: number }> = ({ x, y, rot, n, col, len }) => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", left: x, top: y, width: len, height: 60, transform: `rotate(${rot}deg)`, transformOrigin: "0 50%", overflow: "hidden" }}>
    {Array.from({ length: n }).map((_, i) => <div key={i} style={{ position: "absolute", left: ((i / n) * len + f * 4) % len, top: 10, width: 34, height: 34, borderTop: `10px solid ${col}`, borderRight: `10px solid ${col}`, transform: "rotate(45deg)" }} />)}
  </div>;
};
const Airflow: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const e2 = k(f, M(m, 1, 60), 12);
  return <Plate src="g1220" d={0.9}>
    <TankCut x={640} y={140} w={640} h={720}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 170, height: 12, background: "repeating-linear-gradient(90deg,#9aa0a6 0 20px,transparent 20px 34px)" }} />
      <div style={{ position: "absolute", left: 120, bottom: 182, display: "flex", gap: 10 }}>{[0, 1, 2, 3, 4, 5].map((i) => <Flame key={i} s={1.5} seed={i} />)}</div>
      <div style={{ position: "absolute", left: 120, right: 60, top: 40, height: 220, background: `linear-gradient(180deg, rgba(150,150,150,${0.5 * (1 - e2)}), rgba(120,120,120,${0.6 * (1 - e2)}))`, borderRadius: 40 }} />
    </TankCut>
    <Chevs x={360} y={700} rot={0} n={5} col="#9cc8ff" len={420} />
    <Chevs x={1600} y={300} rot={180} n={4} col="#9cc8ff" len={300} />
    <Lbl size={44} box col="#bfe0ff" style={{ position: "absolute", left: 140, top: 780 }}>PRIMARY · UNDER THE PELLETS</Lbl>
    <Lbl size={44} box col="#bfe0ff" style={{ position: "absolute", left: 1330, top: 380, opacity: k(f, M(m, 1, 60) - 10, 10) }}>SECONDARY · BURNS THE SMOKE</Lbl>
    <Big e={k(f, 10, 12)} y={40} size={62}>Air from below. A little more up high.</Big>
  </Plate>;
};

// ================= slider (124): la planchuela con cinco agujeros corre sobre los cinco de la garrafa
const Slider: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const off = lin(f, dur * 0.45, dur * 0.45 + 16, 0, 1); const full = off < 0.5;
  const holes = (y: number, x0: number, col: string) => <div style={{ position: "absolute", left: x0, top: y, display: "flex", gap: 90 }}>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ width: 70, height: 70, borderRadius: "50%", background: col }} />)}</div>;
  return <Plate src="g1220" d={0.75}>
    <div style={{ position: "absolute", left: 300, top: 330, width: 1320, height: 230, background: "linear-gradient(180deg,#4b5056,#2c2f33)", boxShadow: "0 22px 30px rgba(0,0,0,.5)" }}>
      {holes(80, 170, "#0b0b0c")}</div>
    <div style={{ position: "absolute", left: 300 + off * 80, top: 370, width: 1320, height: 150, background: STEELG, boxShadow: "0 14px 18px rgba(0,0,0,.5)", WebkitMaskImage: "none" }}>
      {holes(40, 170, full ? "rgba(255,122,26,.85)" : "rgba(255,122,26,.0)")}
      {[260, 1020].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 55, width: 80, height: 40, borderRadius: 20, background: "#1d1f22" }} />)}</div>
    {!full && [0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 470 + i * 160, top: 410, width: 70 - 80 * 0.5, height: 70, borderRadius: "35px 0 0 35px", background: "rgba(255,122,26,.85)" }} />)}
    <Lbl size={80} col={full ? HOT : "#bfe0ff"} style={{ position: "absolute", left: 0, right: 0, top: 160, textAlign: "center" }}>{full ? "FULL AIR" : "LOW AIR"}</Lbl>
    <Big e={k(f, 10, 12)} y={110} size={84}>That slider is your thermostat.</Big>
  </Plate>;
};

// ================= warp (139): la chapa soldada entera se arquea como una papa frita; la de tres separadores queda plana
const Warp: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const w = k(f, M(m, 0, 10), 30);
  const plate = (x: number, bend: number) => <div style={{ position: "absolute", left: x, top: 380, width: 640, height: 40, display: "flex" }}>
    {Array.from({ length: 16 }).map((_, i) => { const u = (i + 0.5) / 16 - 0.5; return <div key={i} style={{ width: 40, height: 40, background: "linear-gradient(180deg,#b7bdc3,#5c6168)", transform: `translateY(${-(0.25 - u * u) * 4 * bend * 140}px)` }} />; })}</div>;
  return <Plate src="g1350" d={0.9}>
    {plate(180, w)}{plate(1100, 0)}
    {[1150, 1390, 1630].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 420, width: 46, height: 30, background: "#7b8086", clipPath: "polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)" }} />)}
    <Lbl size={46} box col="#ff9a8a" style={{ position: "absolute", left: 180, top: 560 }}>WELDED ALL AROUND · WARPS</Lbl>
    <Lbl size={46} box col={HOT} style={{ position: "absolute", left: 1100, top: 560 }}>3 SPACERS · 3 TACKS · FLAT</Lbl>
    <Big e={k(f, 20, 12)} y={90} size={74}>Steel grows when it gets hot. Let it move.</Big>
  </Plate>;
};

// ================= season (142): la amoladora de lija pasa: óxido → metal brillante → curado negro con aceite
const Season: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const a = lin(f, 6, dur * 0.45, 0, 100), b = lin(f, dur * 0.5, dur - 16, 0, 100);
  const lay = (filter: string, clip: number) => <AbsoluteFill style={{ backgroundImage: IMG("g0300"), backgroundSize: "cover", filter, clipPath: `inset(0 ${100 - clip}% 0 0)` }} />;
  return <AbsoluteFill style={{ background: IRON }}>
    {lay("none", 100)}{lay("grayscale(1) brightness(1.5) contrast(1.1)", a)}{lay("grayscale(1) brightness(.35) contrast(1.3)", b)}
    <div style={{ position: "absolute", top: 0, bottom: 0, left: `${(b > 0 ? b : a)}%`, width: 10, background: HOT, boxShadow: `0 0 30px 8px ${HOT}`, opacity: (a > 0 && a < 100) || (b > 0 && b < 100) ? 1 : 0 }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, display: "flex", justifyContent: "center", gap: 30 }}>
      {["RUST", "BRIGHT METAL", "SEASONED"].map((t, i) => <Lbl key={t} size={54} box col={[0, a > 98 ? 1 : 0, b > 98 ? 1 : 0][i] || i === 0 ? HOT : "#777"}>{i ? "→ " : ""}{t}</Lbl>)}</div>
  </AbsoluteFill>;
};

// ================= pressure (158): manómetro que entra en rojo sobre el tanque cerrado
const Pressure: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const v = lin(f, 6, dur - 20, -120, 110) + (f > dur - 30 ? Math.sin(f * 2) * 4 : 0);
  return <Plate src="g1570" d={0.75}>
    <Dial x={190} y={150} d={620} ang={v} red={[60, 130]}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 52, color: INK }}>CLOSED TANK</div></Dial>
    <div style={{ position: "absolute", left: 960, top: 260, width: 800 }}>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 110, color: WHITE, lineHeight: 1.05, textShadow: "0 5px 0 rgba(0,0,0,.6)" }}>Steam doesn't<br />ask permission.</div>
      <Lbl size={52} col={WHITE} style={{ marginTop: 40, display: "inline-block", background: RED, padding: "12px 30px", borderRadius: 10, opacity: k(f, dur - 30, 8) }}>NEVER A CLOSED TANK</Lbl></div>
  </Plate>;
};

// ================= bucket (163): corte del balde «dona» — el caño caliente al medio, agua a los dos lados, vapor libre arriba
const Bucket: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const heat = lin(f, 6, dur - 10, 0, 1);
  return <Plate src="g1620" d={0.9}>
    <div style={{ position: "absolute", left: 900, top: 60, width: 120, height: 900, background: `linear-gradient(90deg,#2a2b2e,rgba(255,${160 - heat * 60},40,${0.5 + heat * 0.4}) 50%,#2a2b2e)` }} />
    <div style={{ position: "absolute", left: 600, top: 330, width: 720, height: 460, borderLeft: "14px solid #9aa0a6", borderRight: "14px solid #9aa0a6", borderBottom: "14px solid #9aa0a6", borderRadius: "0 0 30px 30px" }}>
      <div style={{ position: "absolute", left: 0, top: 60, width: 286, bottom: 0, background: `linear-gradient(180deg,#7fb6f0,${WATER})` }} />
      <div style={{ position: "absolute", right: 0, top: 60, width: 286, bottom: 0, background: `linear-gradient(180deg,#7fb6f0,${WATER})` }} />
      <div style={{ position: "absolute", right: -70, bottom: 30, width: 70, height: 34, background: "#c7a24a", borderRadius: "0 10px 10px 0" }} /></div>
    {[0, 1, 2, 3, 4, 5].map((i) => { const t = ((f + i * 9) % 50) / 50; return <div key={i} style={{ position: "absolute", left: 650 + (i % 3) * 90 + (i > 2 ? 400 : 0), top: 360 - t * 280, width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,.4)", opacity: (1 - t) * heat }} />; })}
    <Lbl size={50} box col={HOT} style={{ position: "absolute", left: 1360, top: 220 }}>OPEN TOP</Lbl>
    <Lbl size={44} box style={{ position: "absolute", left: 1360, top: 620 }}>HOSE BIB</Lbl>
    <Big e={k(f, 10, 12)} y={50} size={70}>It can never build pressure.</Big>
  </Plate>;
};

// ================= subq (186): el interruptor del taller — se prenden los tubos y el cartel SUBSCRIBE
const SubQ: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const t0 = M(m, 0, 12); const on = f > t0 ? 1 : 0; const fl = f > t0 && f < t0 + 8 ? (f % 2) : on;
  return <Plate src="g1940" d={on ? 0.55 : 0.88}>
    <div style={{ position: "absolute", left: 200, top: 300, width: 160, height: 260, borderRadius: 18, background: CREAM, boxShadow: "0 16px 22px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 60, height: 130, borderRadius: 10, background: "#d8d0bd", position: "relative" }}><div style={{ position: "absolute", left: 6, right: 6, top: on ? 6 : 64, height: 60, borderRadius: 8, background: "#fff" }} /></div></div>
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 560 + i * 400, top: 90, width: 340, height: 34, borderRadius: 17, background: fl ? "#fffbe8" : "#5a5c60", boxShadow: fl ? "0 0 50px 14px rgba(255,248,220,.6)" : "none" }} />)}
    <div style={{ position: "absolute", left: 640, top: 330, padding: "30px 70px", borderRadius: 20, border: `10px solid ${fl ? RED : "#5a3a34"}`, background: "rgba(18,18,20,.85)", fontFamily: SANS, fontWeight: 900, fontSize: 130, color: fl ? WHITE : "#6c6c6c", letterSpacing: 6, textShadow: fl ? `0 0 26px ${RED}` : "none" }}>SUBSCRIBE</div>
    <Big e={k(f, t0 + 20, 12)} y={110} size={64}>It costs nothing. It keeps these coming.</Big>
  </Plate>;
};

// ================= wall:34 (196): el termómetro de dial de la pared del garage
const Wall: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const t = +(a[0] || 34); const v = lin(f, 4, 30, 0, t);
  return <Plate src="g1940" d={0.7}>
    <Dial x={660} y={110} d={600} ang={-135 + v * 2.25} ring="#b9bec3">
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 90, color: INK }}>{Math.round(v)}°F</div></Dial>
    <Big e={k(f, 20, 12)} y={70} size={70}>Inside the shop. 7 a.m.</Big>
  </Plate>;
};

// ================= climb (200): termómetro de vidrio — el rojo sube con las etiquetas de hora
const CLIMB: [string, number][] = [["7:00", 34], ["8:00", 45], ["9:00", 53]];
const Climb: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const ts = [6, M(m, 0, dur * 0.4), M(m, 1, dur * 0.7)];
  const cur = ts.reduce((acc, t, i) => f >= t ? i : acc, 0); const tv = lin(f, ts[cur], ts[cur] + 16, cur ? CLIMB[cur - 1][1] : 20, CLIMB[cur][1]);
  const y = (v: number) => 800 - ((v - 20) / 40) * 600;
  return <Plate src="g1940" d={0.88}>
    <div style={{ position: "absolute", left: 780, top: 150, width: 90, height: 690, borderRadius: 45, background: "rgba(240,240,240,.9)", boxShadow: "0 18px 24px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 800, top: y(tv), width: 50, height: 840 - y(tv), borderRadius: 25, background: RED }} />
    <div style={{ position: "absolute", left: 760, top: 800, width: 130, height: 130, borderRadius: "50%", background: RED }} />
    {CLIMB.map(([h, v], i) => <div key={h} style={{ position: "absolute", left: 930, top: y(v) - 40, display: "flex", gap: 24, alignItems: "center", opacity: k(f, ts[i], 10) }}>
      <div style={{ width: 70, height: 8, background: CREAM }} /><Lbl size={56} box>{h} · <span style={{ color: HOT }}>{v}°F</span></Lbl></div>)}
    <Big e={k(f, ts[2] + 20, 12)} y={70} size={84} col={HOT} style={{ left: 100, right: 1100, textAlign: "left" }}>+19°F<br />in 2 hours</Big>
  </Plate>;
};

// ================= btu (212): 16.000 BTU/h entran; se reparten — chimenea, agua, y la mitad al taller
const Btu: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const e0 = k(f, 6, 20), e1 = k(f, dur * 0.35, 16), e2 = k(f, dur * 0.7, 14);
  return <Plate src="y2100" d={0.9}>
    <div style={{ position: "absolute", left: 160, top: 150 }}><Lbl size={40} box>FUEL IN · 2 LB/H × 8,000</Lbl>
      <div style={{ marginTop: 14, width: 1600 * e0, height: 110, background: `linear-gradient(90deg,#8a5d2e,${EMBER})`, borderRadius: 10, display: "flex", alignItems: "center", paddingLeft: 30, boxSizing: "border-box", fontFamily: SANS, fontWeight: 900, fontSize: 66, color: WHITE, whiteSpace: "nowrap" }}>16,000 BTU/H</div></div>
    <div style={{ position: "absolute", left: 160, top: 420, display: "flex", gap: 20, opacity: cl(e1 * 1.5) }}>
      <div style={{ width: 800 * e1, height: 110, background: HOT, borderRadius: 10, display: "flex", alignItems: "center", paddingLeft: 30, boxSizing: "border-box", fontFamily: SANS, fontWeight: 900, fontSize: 52, color: INK, whiteSpace: "nowrap" }}>~8,000 INTO THE SHOP</div>
      <div style={{ width: 440 * e1, height: 110, background: "#6d7278", borderRadius: 10, display: "flex", alignItems: "center", paddingLeft: 26, boxSizing: "border-box", fontFamily: SANS, fontWeight: 900, fontSize: 44, color: WHITE, whiteSpace: "nowrap" }}>CHIMNEY</div>
      <div style={{ width: 340 * e1, height: 110, background: WATER, borderRadius: 10, display: "flex", alignItems: "center", paddingLeft: 26, boxSizing: "border-box", fontFamily: SANS, fontWeight: 900, fontSize: 44, color: WHITE, whiteSpace: "nowrap" }}>WATER</div></div>
    <Big e={e2} y={110} size={76}>About two small space heaters on high.</Big>
  </Plate>;
};

// ================= zones (220): la chapa vista de arriba — centro 450–500 °F, esquinas ~250 °F; la olla se corre
const Zones: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const px = lin(f, dur * 0.5, dur * 0.5 + 30, 0, 1);
  return <Plate src="g2220" d={0.85}>
    <div style={{ position: "absolute", left: 560, top: 110, width: 800, height: 800, background: `radial-gradient(circle at 50% 50%, rgba(255,110,30,.85) 0%, rgba(255,150,60,.55) 30%, rgba(80,80,86,.95) 70%), linear-gradient(135deg,#3a3d42,#24262a)`, boxShadow: "0 22px 30px rgba(0,0,0,.55)", border: "14px solid #55595f" }}>
      <div style={{ position: "absolute", left: 230, top: 230, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle,#2b2c2e 60%,#141516 62%,#3a3b3d)", boxShadow: "0 10px 16px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 560 - px * 60, top: 560 - px * 60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,#8b2f12 55%,#5c6167 58%,#9aa0a6)", boxShadow: "0 10px 16px rgba(0,0,0,.6)" }} /></div>
    <Lbl size={50} box col={HOT} style={{ position: "absolute", left: 100, top: 420 }}>CENTER · 450–500°F</Lbl>
    <Lbl size={50} box col="#e8c79a" style={{ position: "absolute", left: 1390, top: 720 }}>CORNER · ~250°F</Lbl>
    <Big e={k(f, dur * 0.5, 12)} y={50} size={70}>You don't turn a knob. You slide the pot.</Big>
  </Plate>;
};

// ================= boil (237): termómetro de punzón con las tres lecturas del agua
const BOIL: [string, number][] = [["START", 48], ["10 MIN", 120], ["22 MIN", 210]];
const Boil: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const ts = [4, dur * 0.3, dur * 0.6]; const cur = ts.reduce((acc, t, i) => f >= t ? i : acc, 0);
  const v = lin(f, ts[cur], ts[cur] + 14, cur ? BOIL[cur - 1][1] : 40, BOIL[cur][1]);
  return <Plate src="g2330" d={0.85}>
    <Dial x={180} y={170} d={560} ang={-135 + (v / 220) * 270} ring="#9aa0a6">
      <div style={{ position: "absolute", left: 0, right: 0, top: 340, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 80, color: INK }}>{Math.round(v)}°F</div></Dial>
    <div style={{ position: "absolute", left: 730, top: 430, width: 600, height: 26, background: STEELG, borderRadius: 13 }} />
    <div style={{ position: "absolute", left: 980, top: 180 }}>
      {BOIL.map(([t, val], i) => <div key={t} style={{ display: "flex", alignItems: "baseline", gap: 30, marginBottom: 30, opacity: cur >= i ? 1 : 0.2 }}>
        <Lbl size={52} style={{ width: 240 }}>{t}</Lbl><div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 110, color: i === 2 ? EMBER : WHITE }}>{val}°</div></div>)}</div>
    <Big e={k(f, ts[2] + 16, 12)} y={70} size={74}>One gallon, rolling, in 22 minutes.</Big>
  </Plate>;
};

// ================= battery (244): cuánto calor guarda cada uno por grado — tanque de acero vs 5 galones de agua
const Battery: React.FC<P> = () => {
  const f = useCurrentFrame(); const e0 = k(f, 6, 14), e1 = k(f, 26, 30);
  return <Plate src="y2450" d={0.9}>
    <div style={{ position: "absolute", left: 300, right: 300, bottom: 300, height: 520, display: "flex", alignItems: "flex-end", justifyContent: "space-around" }}>
      <div style={{ textAlign: "center" }}><div style={{ width: 260, height: 25 * e0, background: STEELG, margin: "0 auto" }} /><Lbl size={42} box style={{ marginTop: 16 }}>STEEL TANK · ~2</Lbl></div>
      <div style={{ textAlign: "center" }}><div style={{ width: 260, height: 480 * e1, background: `linear-gradient(180deg,#7fb6f0,${WATER})`, margin: "0 auto" }} /><Lbl size={42} box col="#bfe0ff" style={{ marginTop: 16 }}>5 GAL WATER · ~42</Lbl></div></div>
    <Lbl size={34} style={{ position: "absolute", left: 0, right: 0, textAlign: "center", top: 70 }}>BTU STORED PER °F</Lbl>
    <Big e={k(f, 50, 12)} y={90} size={76} col={HOT}>A heat battery on the chimney.</Big>
  </Plate>;
};

// ================= burnback (251): el fuego trepa por el caño lleno de pellets y sale humo arriba
const Burnback: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const up = lin(f, 10, dur - 20, 0, 1);
  return <Plate src="y2530" d={0.9}>
    <div style={{ position: "absolute", left: 420, top: 820, width: 1100, height: 150, transformOrigin: "0 50%", transform: "rotate(-35deg)", background: "rgba(40,42,46,.95)", border: "10px solid #8d949b", overflow: "hidden" }}>
      {Array.from({ length: 28 }).map((_, i) => <Pel key={i} x={10 + (i % 14) * 76} y={20 + Math.floor(i / 14) * 56} r={(i * 40) % 180} s={1.7} c={(i % 14) / 14 < up ? "linear-gradient(180deg,#ffb347,#c4361a)" : undefined} />)}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${up * 100}%`, background: "linear-gradient(90deg,rgba(255,90,20,.55),rgba(255,180,70,.25))" }} /></div>
    {[0, 1, 2, 3].map((i) => { const t = ((f + i * 10) % 40) / 40; return <div key={i} style={{ position: "absolute", left: 1290 + i * 20, top: 160 - t * 140, width: 110, height: 110, borderRadius: "50%", background: "rgba(120,120,120,.6)", opacity: (1 - t) * up }} />; })}
    <Lbl size={70} col={WHITE} style={{ position: "absolute", left: 160, top: 160, background: RED, padding: "10px 36px", borderRadius: 12 }}>BURNBACK</Lbl>
    <Big e={k(f, 20, 12)} y={70} size={70}>The fire climbs into the hopper.</Big>
  </Plate>;
};

// ================= guards (254): tres tuercas gigantes — PENDIENTE · TAPA · CORREDERA
const Guards: React.FC<P> = () => {
  const f = useCurrentFrame(); const G = ["THE SLOPE", "THE LID", "THE SLIDER"];
  return <Plate src="g2620" d={0.85}>
    {G.map((t, i) => { const e = k(f, 6 + i * 12, 10); return <div key={t} style={{ position: "absolute", left: 210 + i * 540, top: 200, width: 420, textAlign: "center", opacity: cl(e * 2), transform: `rotate(${(1 - e) * -90}deg) scale(${0.6 + 0.4 * e})` }}>
      <div style={{ width: 360, height: 360, margin: "0 auto", background: "linear-gradient(140deg,#d7dbdf,#6d7279)", clipPath: "polygon(25% 3%,75% 3%,100% 50%,75% 97%,25% 97%,0 50%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 170, height: 170, borderRadius: "50%", background: IRON, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 120, color: HOT }}>{i + 1}</div></div>
      <Lbl size={52} style={{ marginTop: 26 }}>{t}</Lbl></div>; })}
    <Big e={k(f, 44, 12)} y={90} size={76}>You need all three.</Big>
  </Plate>;
};

// ================= deadend (263): el tiraje entra por adelante y sube la chimenea; el caño con tapa queda «sin salida»
const DeadEnd: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <Plate src="g2620" d={0.9}>
    <TankCut x={760} y={250} w={520} h={620} />
    <div style={{ position: "absolute", left: 1160, top: 60, width: 90, height: 260, background: "#2b2d31", border: "6px solid #6a6f75" }} />
    <div style={{ position: "absolute", left: 340, top: 120, width: 520, height: 130, transformOrigin: "100% 100%", transform: "rotate(40deg)", background: "rgba(40,42,46,.95)", border: "10px solid #8d949b" }}>
      <div style={{ position: "absolute", left: -30, top: -26, width: 40, height: 182, background: CREAM }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 52, color: "#ff9a8a", letterSpacing: 4 }}>DEAD END</div></div>
    <Chevs x={520} y={760} rot={0} n={4} col="#9cc8ff" len={260} />
    <Chevs x={1205} y={330} rot={-90} n={4} col="#9cc8ff" len={300} />
    <Lbl size={44} box col={HOT} style={{ position: "absolute", left: 1330, top: 160 }}>CHIMNEY PULLS FROM THE FRONT</Lbl>
    <Big e={k(f, 14, 12)} y={50} size={70}>Lid down. Never run it open.</Big>
  </Plate>;
};

// ================= hours (273): la tolva de 7 lb se vacía — alto 2 lb/h vs bajo 1 lb/h
const Hours: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const t = lin(f, 10, dur - 20, 0, 7);
  const col = (x: number, rate: number, lab: string, end: string, c: string) => { const left = Math.max(0, 7 - t * rate * 0.5 * 2 / 2 * (rate === 2 ? 2 : 1)); const h = Math.max(0, 7 - t * (rate === 2 ? 2 : 1));
    return <div style={{ position: "absolute", left: x, top: 150, width: 640, textAlign: "center" }}>
      <div style={{ width: 200, height: 560, margin: "0 auto", border: "10px solid #8d949b", position: "relative", background: "rgba(20,20,22,.8)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${(h / 7) * 100}%`, background: "repeating-linear-gradient(170deg,#c99a5c 0 14px,#8a5d2e 14px 22px)" }} /></div>
      <Lbl size={46} col={c} style={{ marginTop: 20 }}>{lab}</Lbl><Lbl size={60} style={{ marginTop: 6 }}>{h <= 0.01 || left < 0 ? end : end}</Lbl></div>; };
  return <Plate src="g2900" d={0.9}>
    {col(260, 2, "HIGH · 2 LB/H", "3½ HOURS", "#ff9a8a")}{col(1020, 1, "LOW · 1 LB/H", "6–7 HOURS", HOT)}
    <Lbl size={40} box style={{ position: "absolute", left: 0, right: 0, margin: "0 auto", width: 380, textAlign: "center", top: 80 }}>FULL HOPPER · 7 LB</Lbl>
  </Plate>;
};

// ================= night (276): el reloj corre de las 10 de la noche a las 5:30; afuera 19 °F, adentro 46 °F
const Night: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const h = lin(f, 8, dur - 30, 22, 29.5); const hh = Math.floor(h) % 24; const mm = Math.round((h % 1) * 60 / 30) * 30 % 60;
  return <Plate src="g2690" d={0.9}>
    <div style={{ position: "absolute", left: 200, top: 170, width: 560, height: 560, borderRadius: "50%", background: "#fbf8f0", border: "26px solid #2b2d31", boxShadow: "0 22px 30px rgba(0,0,0,.55)" }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 16, height: 150, marginLeft: -8, marginTop: -150, background: INK, borderRadius: 8, transformOrigin: "50% 100%", transform: `rotate(${(h % 12) * 30}deg)` }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 10, height: 220, marginLeft: -5, marginTop: -220, background: RED, borderRadius: 5, transformOrigin: "50% 100%", transform: `rotate(${(h % 1) * 360}deg)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 66, color: INK }}>{((hh + 11) % 12) + 1}:{mm ? "30" : "00"} {hh >= 12 && hh < 24 ? "PM" : "AM"}</div></div>
    <div style={{ position: "absolute", left: 960, top: 220, opacity: k(f, dur - 40, 12) }}>
      <Lbl size={52} col="#bfe0ff">OUTSIDE · 19°F</Lbl>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 170, color: HOT, lineHeight: 1.1 }}>46°F</div>
      <Lbl size={52}>IN THE SHOP AT 5:30 A.M.</Lbl></div>
    <Big e={k(f, dur - 26, 10)} y={70} size={66}>No burnback. Never touched it.</Big>
  </Plate>;
};

// ================= co (279): detector de monóxido a pilas en la pared, con su luz que titila
const Co: React.FC<P> = () => {
  const f = useCurrentFrame(); const led = Math.floor(f / 15) % 2;
  return <Plate src="g3300" d={0.6}>
    <div style={{ position: "absolute", left: 1160, top: 210, width: 420, height: 420, borderRadius: 60, background: "linear-gradient(160deg,#ffffff,#d9dbdd)", boxShadow: "0 22px 30px rgba(0,0,0,.55)", transform: `translateY(${(1 - k(f, 2, 14)) * -500}px)` }}>
      <div style={{ position: "absolute", left: 60, top: 60, right: 60, height: 160, display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 10 }}>{Array.from({ length: 32 }).map((_, i) => <div key={i} style={{ borderRadius: "50%", background: "#b8bcc0" }} />)}</div>
      <div style={{ position: "absolute", left: 60, bottom: 70, width: 30, height: 30, borderRadius: "50%", background: led ? "#3ad15a" : "#1f5a2b", boxShadow: led ? "0 0 18px 6px rgba(58,209,90,.7)" : "none" }} />
      <div style={{ position: "absolute", right: 60, bottom: 60, fontFamily: SANS, fontWeight: 900, fontSize: 56, color: "#555" }}>CO</div></div>
    <div style={{ position: "absolute", left: 160, top: 300 }}>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 160, color: HOT, lineHeight: 1 }}>$20</div>
      <Lbl size={52} style={{ marginTop: 14 }}>BATTERY · HEAD HEIGHT</Lbl></div>
    <Big e={k(f, 18, 12)} y={90} size={72}>Every single time.</Big>
  </Plate>;
};

// ================= mistakes (283) + mist:n — el número recortado con soplete: borde naranja que se enfría a rojo oscuro
const MIST: [string, string][] = [["y0470", "CUTTING IT BEFORE IT'S FULL OF WATER"], ["g2900", "A HOPPER THAT'S TOO FLAT"], ["y2960", "BARBECUE PELLETS"], ["g3050", "WELDING THE COOKTOP SOLID"], ["g3080", "TOO CLOSE TO THE WALL"]];
const hotTxt = (cool: number) => `0 0 ${18 * (1 - cool) + 4}px rgba(255,${140 - cool * 80},${40 - cool * 30},${1 - cool * 0.5})`;
const Mistakes: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <Plate src="g3080" d={0.85}>
    {MIST.map(([src], i) => <Print key={i} src={src} w={300} h={230} x={90 + i * 360} y={170} rot={[-2, 1.5, -1, 2, -1.5][i]} e={k(f, 4 + i * 6, 10)} />)}
    {MIST.map((_, i) => <div key={"n" + i} style={{ position: "absolute", left: 210 + i * 360, top: 410, fontFamily: SERIF, fontWeight: 700, fontSize: 110, color: "#2a1a12", WebkitTextStroke: "4px #ff8a3a", textShadow: hotTxt(cl((f - 10 - i * 6) / 40)), opacity: k(f, 6 + i * 6, 8) }}>{i + 1}</div>)}
    <Big e={k(f, 36, 14)} y={170} size={150}>5 MISTAKES</Big><Big e={k(f, 48, 12)} y={90} size={56} col={HOT}>Two of them were mine.</Big>
  </Plate>;
};
const Mist: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const n = +a[0]; const [src, bad] = MIST[n - 1]; const cool = cl((f - 6) / 40);
  return <Plate src={src} d={0.6}>
    <div style={{ position: "absolute", left: 120, bottom: 120, display: "flex", alignItems: "center", gap: 40, opacity: k(f, 0, 8) }}>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 260, lineHeight: 0.9, color: "#22150e", WebkitTextStroke: "6px #ff8a3a", textShadow: hotTxt(cool) }}>{n}</div>
      <div><Lbl size={36} col={HOT} style={{ letterSpacing: 8 }}>MISTAKE</Lbl><div style={{ fontFamily: SANS, fontWeight: 900, fontSize: bad.length > 28 ? 58 : 70, color: WHITE, textShadow: "0 4px 0 rgba(0,0,0,.6)", whiteSpace: "nowrap", marginTop: 6 }}>{bad}</div></div></div>
  </Plate>;
};

// ================= clear (311): vista de arriba — un aro de 36" empuja todo lo que se quema afuera
const Clear: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const r = lin(f, 6, dur * 0.5, 120, 400); const IT = ["PLYWOOD WALL", "SHELF", "GAS CAN", "RAG PILE"];
  return <Plate src="g3130" d={0.88}>
    <div style={{ position: "absolute", left: 960 - r, top: 520 - r, width: r * 2, height: r * 2, borderRadius: "50%", border: `10px dashed ${HOT}`, boxSizing: "border-box" }} />
    <div style={{ position: "absolute", left: 900, top: 460, width: 120, height: 120, borderRadius: "50%", background: STEELG, boxShadow: `0 0 40px 10px rgba(255,122,26,.5)` }} />
    {IT.map((t, i) => { const ang = -2.4 + i * 1.6; const d = Math.max(r + 120, 260); return <Lbl key={t} size={40} box col="#ff9a8a" style={{ position: "absolute", left: 960 + Math.cos(ang) * d * 1.4 - 150, top: 520 + Math.sin(ang) * d - 30 }}>{t}</Lbl>; })}
    <Lbl size={70} col={HOT} style={{ position: "absolute", left: 1300, top: 860 }}>36"</Lbl>
    <Big e={k(f, dur * 0.55, 12)} y={40} size={64}>Three feet from anything that can burn.</Big>
  </Plate>;
};

// ================= asked (316) + ask:n + ask:cta — cinta rotuladora negra con letras blancas en relieve
const ASK: [string, string][] = [["y3200", "WHY PELLETS, NOT WOOD?"], ["g3300", "CAN I USE IT IN MY HOUSE?"], ["y3240", "HOW LONG DOES A BAG LAST?"], ["g3460", "DOESN'T THE HOPPER GET HOT?"]];
const Dymo: React.FC<{ t: string; size?: number; e?: number; style?: CSS }> = ({ t, size = 64, e = 1, style }) => (
  <div style={{ display: "inline-block", padding: `${size * 0.28}px ${size * 0.6}px`, background: "linear-gradient(180deg,#232427,#0e0f10)", borderRadius: 6, boxShadow: "0 10px 14px rgba(0,0,0,.55)",
    clipPath: `inset(0 ${100 - e * 100}% 0 0)`, ...style }}>
    <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: size, color: "#f4f4f4", letterSpacing: size * 0.08, whiteSpace: "nowrap", textShadow: "0 -2px 0 rgba(0,0,0,.6), 0 2px 0 rgba(255,255,255,.25)" }}>{t}</div></div>
);
const Asked: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <Plate src="g3300" d={0.85}>
    <div style={{ position: "absolute", left: 160, top: 130 }}>{ASK.map(([, q], i) => <div key={i} style={{ marginBottom: 46, transform: `rotate(${[-1.5, 1, -0.5, 1.5][i]}deg)` }}><Dymo t={q} size={60} e={k(f, 4 + i * 8, 14)} /></div>)}</div>
    <Big e={k(f, 44, 12)} y={80} size={78} col={HOT}>You asked.</Big>
  </Plate>;
};
const Ask: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const cta = a[0] === "cta"; const n = +a[0];
  const [src, q] = cta ? ["g3870", "WHAT WOULD YOU COOK FIRST?"] : ASK[n - 1];
  return <Plate src={src} d={0.55}>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, textAlign: "center" }}>
      <Lbl size={40} col={HOT} style={{ marginBottom: 20 }}>{cta ? "TELL ME IN THE COMMENTS" : `QUESTION ${n} OF 4`}</Lbl>
      <Dymo t={q} size={q.length > 24 ? 74 : 86} e={k(f, 2, 16)} /></div>
  </Plate>;
};

// ================= bag (335): bolsa de 40 lb con etiqueta de precio — lo que cuesta la hora
const Bag: React.FC<P> = () => {
  const f = useCurrentFrame(); const e = k(f, 4, 14);
  return <Plate src="g3400" d={0.8}>
    <div style={{ position: "absolute", left: 220, top: 160, width: 520, height: 700, borderRadius: "30px 30px 50px 50px", background: "linear-gradient(90deg,#c9b38a,#efe2c4 40%,#bca478)", boxShadow: "0 22px 30px rgba(0,0,0,.55)", transform: `translateY(${(1 - e) * 600}px)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 260, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 150, color: "#3d2d18" }}>40 LB</div>
      <div style={{ position: "absolute", right: -60, top: 60, padding: "16px 30px", background: EMBER, borderRadius: 10, transform: `rotate(8deg) scale(${k(f, 18, 8)})`, fontFamily: SANS, fontWeight: 900, fontSize: 60, color: INK }}>$5–7</div></div>
    <div style={{ position: "absolute", left: 900, top: 230 }}>
      {[["HIGH", "≈ 20 HOURS", 26], ["LOW", "≈ 40 HOURS", 42]].map(([t, v, a0]) => <div key={t as string} style={{ marginBottom: 40, opacity: k(f, a0 as number, 10) }}><Lbl size={46} col={HOT}>{t}</Lbl><div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 120, color: WHITE }}>{v}</div></div>)}</div>
    <Big e={k(f, 60, 12)} y={70} size={72}>About 30 cents an hour, on high.</Big>
  </Plate>;
};

// ================= hopper (344): el caño en corte con su gradiente — 180 °F abajo, 90 °F arriba
const Hopper: React.FC<P> = () => {
  const f = useCurrentFrame(); const e = k(f, 4, 30);
  return <Plate src="g3460" d={0.85}>
    <div style={{ position: "absolute", left: 600, top: 120, width: 220, height: 800, border: "12px solid #8d949b", background: `linear-gradient(0deg, rgba(255,110,30,${0.9 * e}) 0%, rgba(255,180,90,${0.6 * e}) 45%, rgba(239,230,210,${0.4 * e}) 100%)` }} />
    <Lbl size={60} box col={EMBER} style={{ position: "absolute", left: 900, top: 760, opacity: e }}>BOTTOM · 180°F</Lbl>
    <Lbl size={60} box col={CREAM} style={{ position: "absolute", left: 900, top: 160, opacity: e }}>TOP · 90°F</Lbl>
    <Big e={k(f, 30, 12)} y={90} size={74} style={{ left: 880, textAlign: "left", right: 80 }}>Warm. Glove to lift the lid.</Big>
  </Plate>;
};

// ================= cost (348): etiquetas de pistola de precios caen sobre cada pieza; el total corre
const COST: [string, string, string][] = [["g0220", "TANK", "FREE"], ["g0260", "TUBE", "$4"], ["g0300", "PLATE", "$12"], ["g0320", "GRATE", "FREE"], ["g0340", "BUCKET", "FREE"], ["g0340", "HOSE BIB", "FREE"], ["g1840", "STOVE PAINT", "$9"], ["g1510", "PIPE (NEW)", "$20"]];
const Cost: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const step = Math.max(8, (dur - 80) / COST.length);
  return <Plate src="g1840" d={0.9}>
    {COST.map(([src, t, v], i) => { const a0 = 6 + i * step; const e = k(f, a0, 8); const x = 90 + (i % 4) * 445, y = i < 4 ? 70 : 430;
      return <div key={i} style={{ position: "absolute", left: x, top: y, opacity: cl(e * 2) }}>
        <Print src={src} w={360} h={230} x={0} y={0} cap={t} e={e} />
        <div style={{ position: "absolute", left: 250, top: -16, padding: "8px 18px", background: v === "FREE" ? "#e9f3d8" : EMBER, borderRadius: 8, transform: `rotate(${6 - (i % 3) * 4}deg) scale(${k(f, a0 + 4, 6)})`, fontFamily: SANS, fontWeight: 900, fontSize: 40, color: INK, boxShadow: "0 6px 0 rgba(0,0,0,.35)" }}>{v}</div></div>; })}
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 50, display: "flex", justifyContent: "center", gap: 40, opacity: k(f, dur - 60, 10) }}>
      <Lbl size={54} box>BUY IT ALL · <span style={{ color: HOT }}>~$50</span></Lbl><Lbl size={54} box>FROM YOUR SCRAP · <span style={{ color: HOT }}>&lt; $20</span></Lbl></div>
  </Plate>;
};

// ================= pie (361): las cuatro horas — la mayor parte, hacer segura la garrafa
const Pie: React.FC<P> = () => {
  const f = useCurrentFrame(); const e = k(f, 4, 30);
  return <Plate src="g0540" d={0.85}>
    <div style={{ position: "absolute", left: 220, top: 170, width: 620, height: 620, borderRadius: "50%", background: `conic-gradient(${EMBER} 0deg ${200 * e}deg, #55595f ${200 * e}deg ${360 * e}deg, transparent ${360 * e}deg)`, boxShadow: "0 22px 30px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", inset: 150, borderRadius: "50%", background: IRON, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 120, color: WHITE }}>4 h</div></div>
    <div style={{ position: "absolute", left: 960, top: 300 }}>
      <Lbl size={58} col={EMBER}>■ MAKING THE TANK SAFE</Lbl><Lbl size={58} col="#aab0b6" style={{ marginTop: 30 }}>■ CUT, WELD, FIRST FIRE</Lbl></div>
    <Big e={k(f, 40, 12)} y={90} size={76}>Don't rush the tank.</Big>
  </Plate>;
};

// ================= next (389): el próximo video
const Next: React.FC<P> = () => {
  const f = useCurrentFrame(); const e = k(f, 4, 14);
  return <Plate src="n_burner" d={0.7}>
    <div style={{ position: "absolute", left: 160, right: 160, top: 80, padding: "26px 0 34px", background: PANEL, borderRadius: 18, textAlign: "center", opacity: e, transform: `scale(${0.94 + 0.06 * e})` }}>
      <Lbl size={40} col={HOT} style={{ letterSpacing: 8 }}>NEXT WEEK</Lbl>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 120, color: WHITE, lineHeight: 1.02, marginTop: 14, whiteSpace: "nowrap" }}>The Doomsday Burner</div></div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, display: "flex", justifyContent: "center", gap: 40 }}>
      {["ONE SCRAP CAN", "BOILS WATER", "5 MINUTES TO MAKE"].map((t, i) => <div key={t} style={{ padding: "14px 34px", background: CREAM, fontFamily: SANS, fontWeight: 900, fontSize: 46, color: INK, opacity: k(f, 20 + i * 8, 8), transform: `translateY(${(1 - k(f, 20 + i * 8, 8)) * 80}px)` }}>{t}</div>)}</div>
  </Plate>;
};

// ---------- dispatcher
export const CompC14p: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  const [c, ...a] = String(s.comp).split(":"); const m: number[] = s.m || [];
  const T: Record<string, React.FC<P>> = { jobs: Jobs, nope: Nope, step: Step, prize: Prize, parts: Parts, receipt: Receipt, tools: Tools, vapor: Vapor, fill: Fill, stat: Stat, cuts: Cuts, three: Three,
    auger: Auger, gravity: Gravity, angle: Angle, finder: Finder, slope: Slope, air3: Air3, airflow: Airflow, slider: Slider, warp: Warp, season: Season, pressure: Pressure, bucket: Bucket, subq: SubQ,
    wall: Wall, climb: Climb, btu: Btu, zones: Zones, boil: Boil, battery: Battery, burnback: Burnback, guards: Guards, deadend: DeadEnd, hours: Hours, night: Night, co: Co, mistakes: Mistakes, mist: Mist,
    clear: Clear, asked: Asked, ask: Ask, bag: Bag, hopper: Hopper, cost: Cost, pie: Pie, next: Next };
  if (c === "steps") return <Board m={m} dur={dur} a={a} />;
  if (c === "recap") return <Board m={m} dur={dur} a={a} recap />;
  if (c === "rc") return <Board m={m} dur={dur} a={a} recap pick={+a[0]} />;
  const X = T[c]; return X ? <X m={m} dur={dur} a={a} /> : <AbsoluteFill style={{ background: "#f0f" }} />;
};
