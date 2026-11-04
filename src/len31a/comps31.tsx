// len31a · componentes ÚNICOS del video (uno por hueco de b-roll, anclados a la palabra). Paleta de la miniatura: porcelana blanca,
// válvula gris, círculo rojo ✗ / verde ✓. Lenguaje premium: panel oscuro, filo fino, entra con peso, sale fundido.
// Un tanque en corte (Tank) es el escenario común de los componentes técnicos: cada uno ilumina SU pieza.
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
export const C = { bg0: "#0a0f12", bg1: "#162127", grey: "#9aa3a8", grey2: "#cfd5d8", tur: "#5cc8e0", tur2: "#a9e6f3", ok: "#3fd16b", red: "#ff4d3d", amb: "#ffb257", ink: "#f6f3ec", dim: "rgba(246,243,236,.6)", line: "rgba(255,255,255,.12)", por: "#f4f6f5", water: "#5cc8e0" };
const img = (id: string) => staticFile("img/" + P + id + ".jpg");
const at = (h: H, k: string, min: number) => Math.max(min, (h[k] ?? h.at + min) - h.at);

// ---------- escenario común: fondo azulejo oscuro con luz que respira ----------
export const Tiles: React.FC<{ t: number }> = ({ t }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="cg" cx="50%" cy="42%" r="75%"><stop offset="0" stopColor={C.bg1} /><stop offset="1" stopColor={C.bg0} /></radialGradient>
      <pattern id="tl" width="96" height="96" patternUnits="userSpaceOnUse"><rect width="96" height="96" fill="none" stroke="rgba(255,255,255,.045)" strokeWidth="2" /></pattern>
      <radialGradient id="lt" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="rgba(169,230,243,.10)" /><stop offset="1" stopColor="rgba(169,230,243,0)" /></radialGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#cg)" />
    <rect width="1920" height="1080" fill="url(#tl)" transform={`translate(${(t * 5) % 96 - 48} 0)`} />
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
const Kick: React.FC<{ tt: number; txt: string; col?: string; y?: number }> = ({ tt, txt, col = C.tur, y = 110 }) => {
  const p = phys(tt, 0.1, 7, 0.5);
  return <div style={{ position: "absolute", top: y, left: 0, width: 1920, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 8, color: C.dim, opacity: cl(p), transform: `translateY(${(1 - p) * 30}px)` }}>
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
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 28, background: "linear-gradient(180deg, rgba(24,34,40,.94), rgba(10,15,18,.94))", border: `1.5px solid ${col}`,
    boxShadow: "0 40px 90px rgba(0,0,0,.6)", opacity: cl(p * 1.4), transform: `perspective(1400px) translateY(${(1 - p) * 70}px) rotateX(${(1 - p) * 18}deg) scale(${0.94 + 0.06 * p})`, fontFamily: FONT, color: C.ink, overflow: "hidden" }}>{children}</div>;
};
// círculo ✗ / ✓ como en la miniatura (relleno sólido, trazo negro que se dibuja)
const Badge: React.FC<{ p: number; ok?: boolean; size?: number }> = ({ p, ok, size = 120 }) => {
  const s = phys(p, 0, 7, 0.45);
  return <svg width={size} height={size} viewBox="0 0 120 120" style={{ transform: `scale(${0.4 + 0.6 * cl(s)})`, opacity: cl(p * 3) }}>
    <circle cx={60} cy={60} r={56} fill={ok ? C.ok : C.red} />
    {ok ? <path d="M32 62 L52 82 L90 40" fill="none" stroke="#111" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cl(p * 2 - 0.3)} />
      : <path d="M38 38 L82 82 M82 38 L38 82" stroke="#111" strokeWidth={13} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cl(p * 2 - 0.3)} />}
  </svg>;
};
const Check: React.FC<{ p: number; col?: string; x?: boolean }> = ({ p, col = C.ok, x }) => (
  <svg width={56} height={56} viewBox="0 0 56 56"><circle cx={28} cy={28} r={24} fill="none" stroke={col} strokeWidth={4} opacity={0.35 + 0.65 * cl(p)} />
    {x ? <path d="M18 18 L38 38 M38 18 L18 38" stroke={col} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cl(p * 1.5 - 0.3)} />
      : <path d="M16 29 L25 38 L41 19" fill="none" stroke={col} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cl(p * 1.5 - 0.3)} />}
  </svg>
);
const Rows: React.FC<{ tt: number; h: H; rows: { at: number; txt: string }[]; x: number; y: number; w: number; gap?: number; x_?: boolean; col?: string; size?: number; num?: boolean }> = ({ tt, h, rows, x, y, w, gap = 104, x_, col, size = 46, num }) => <>
  {rows.map((r, i) => { const a = Math.max(0.25 + i * 0.35, r.at - h.at); const p = phys(tt, a, 7, 0.5); return (
    <div key={i} style={{ position: "absolute", left: x, top: y + i * gap, width: w, display: "flex", alignItems: "center", gap: 26, opacity: cl(p * 1.5), transform: `translateX(${(1 - p) * -80}px)`, fontFamily: FONT, fontWeight: 800, fontSize: size, color: C.ink }}>
      {num ? <div style={{ width: 56, height: 56, borderRadius: 28, background: col ?? C.tur, color: C.bg0, fontWeight: 900, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{i + 1}</div> : <Check p={(tt - a) * 1.6} x={x_} col={col ?? (x_ ? C.red : C.ok)} />}
      <span style={{ textDecoration: x_ && tt - a > 0.7 ? "line-through" : undefined, textDecorationColor: C.red, textDecorationThickness: 5 }}>{r.txt}</span>
    </div>); })}
</>;
const Label: React.FC<{ tt: number; a: number; x: number; y: number; txt: string; col?: string; size?: number; anchor?: "l" | "r" | "c" }> = ({ tt, a, x, y, txt, col = C.ink, size = 38, anchor = "l" }) => {
  const p = phys(tt, a, 7, 0.5);
  return <div style={{ position: "absolute", left: anchor === "l" ? x : anchor === "c" ? x - 400 : x - 800, width: anchor === "l" ? 800 : 800, top: y, textAlign: anchor === "l" ? "left" : anchor === "c" ? "center" : "right", fontFamily: FONT, fontWeight: 800, fontSize: size, color: col, opacity: cl(p * 1.5), transform: `translateY(${(1 - p) * 24}px)`, textShadow: "0 6px 24px rgba(0,0,0,.7)" }}>{txt}</div>;
};

// ===================== el tanque en corte (pulgada = 60 px) =====================
// tanque x 520..1400, y 250..900 · rebosadero x 1080, tope y 520 · válvula x 720, tope y 340 (3" sobre el rebosadero) · C.L. y 460 (1")
const TK = { x0: 520, x1: 1400, y0: 250, y1: 900, ovx: 1080, ovTop: 520, fvx: 720, fvTop: 340, cl: 460, lvl: 550 };
type TankP = { hi?: string; level?: number; fvTop?: number; spill?: number; tube?: "ok" | "down" | "none"; leak?: number; floatY?: number; dye?: number; dim?: number };
const Tank: React.FC<TankP & { tt: number }> = ({ tt, hi, level = TK.lvl, fvTop = TK.fvTop, spill = 0, tube = "ok", leak = 0, floatY, dye = 0, dim = 0 }) => {
  const g = (k: string) => (hi && hi !== k ? 0.28 : 1) * (1 - dim * 0.6);
  const fy = floatY ?? level - 20;
  const wcol = dye > 0 ? `rgb(${92 - 60 * dye},${200 - 80 * dye},${224 - 10 * dye})` : C.water;
  return <svg width={1920} height={1080} style={{ position: "absolute" }}>
    <defs><linearGradient id="wt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={wcol} stopOpacity={0.55} /><stop offset="1" stopColor={wcol} stopOpacity={0.25} /></linearGradient>
      <clipPath id="tkc"><rect x={TK.x0 + 14} y={TK.y0} width={TK.x1 - TK.x0 - 28} height={TK.y1 - TK.y0 - 14} /></clipPath></defs>
    {/* porcelana */}
    <path d={`M${TK.x0} ${TK.y0} L${TK.x0} ${TK.y1 - 30} Q${TK.x0} ${TK.y1} ${TK.x0 + 30} ${TK.y1} L${TK.x1 - 30} ${TK.y1} Q${TK.x1} ${TK.y1} ${TK.x1} ${TK.y1 - 30} L${TK.x1} ${TK.y0}`} fill="rgba(244,246,245,.05)" stroke={C.por} strokeWidth={14} strokeLinecap="round" opacity={0.9 * (1 - dim * 0.5)} />
    {/* agua */}
    <g clipPath="url(#tkc)"><rect x={TK.x0} y={level + Math.sin(tt * 3) * 2} width={TK.x1 - TK.x0} height={TK.y1 - level} fill="url(#wt)" />
      <path d={`M${TK.x0} ${level} ${Array.from({ length: 23 }, (_, i) => `L${TK.x0 + i * 40} ${level + Math.sin(tt * 3 + i * 0.9) * 3}`).join(" ")}`} fill="none" stroke={C.tur2} strokeWidth={3} opacity={0.7} /></g>
    {/* rebosadero */}
    <g opacity={g("overflow")}><rect x={TK.ovx - 26} y={TK.ovTop} width={52} height={TK.y1 - 60 - TK.ovTop} fill="#2c3438" stroke={C.grey2} strokeWidth={4} />
      <ellipse cx={TK.ovx} cy={TK.ovTop} rx={26} ry={8} fill="#111" stroke={C.grey2} strokeWidth={4} />
      {spill > 0 && <path d={`M${TK.ovx - 20} ${TK.ovTop} q20 ${40 + 20 * Math.sin(tt * 9)} 0 ${200}`} stroke={C.tur2} strokeWidth={8 * spill} fill="none" opacity={0.85} strokeDasharray="14 10" strokeDashoffset={-tt * 120} />}</g>
    {/* tapón (flapper) + cadena */}
    <g opacity={g("flapper")}><rect x={TK.ovx - 120} y={TK.y1 - 70} width={260} height={30} rx={6} fill="#2c3438" />
      <path d={`M${TK.ovx + 30} ${TK.y1 - 76} q50 -34 100 0`} fill="#d0392b" stroke="#7a1b12" strokeWidth={4} />
      <path d={`M${TK.ovx + 80} ${TK.y1 - 92} L${TK.ovx + 120} ${TK.y0 + 80}`} stroke={C.grey} strokeWidth={4} strokeDasharray="6 6" />
      {leak > 0 && Array.from({ length: 6 }, (_, i) => { const k = ((tt * 1.4 + i / 6) % 1); return <circle key={i} cx={TK.ovx + 80 + Math.sin(i * 2) * 30} cy={TK.y1 - 70 + k * 60} r={6 * leak} fill={C.tur2} opacity={(1 - k) * leak} />; })}</g>
    {/* válvula de llenado */}
    <g opacity={g("fv")}><rect x={TK.fvx - 30} y={fvTop + 40} width={60} height={TK.y1 - fvTop - 40} fill="#8b959a" stroke={C.grey2} strokeWidth={3} />
      <rect x={TK.fvx - 52} y={fvTop} width={104} height={56} rx={14} fill="#3a4246" stroke={C.grey2} strokeWidth={4} />
      <rect x={TK.fvx - 40} y={TK.y1 - 230} width={80} height={14} rx={4} fill="#5d676c" />
      <text x={TK.fvx + 40} y={fvTop + 128} fontFamily={FONT} fontWeight={900} fontSize={22} fill="#1b1f21">C.L.</text>
      <line x1={TK.fvx + 30} y1={fvTop + 120} x2={TK.fvx + 36} y2={fvTop + 120} stroke="#1b1f21" strokeWidth={3} /></g>
    {/* flotador */}
    <g opacity={g("float")}><rect x={TK.fvx - 46} y={fy - 40} width={92} height={80} rx={14} fill="#1f2528" stroke={C.grey2} strokeWidth={4} /></g>
    {/* manguerita de rellenado */}
    <g opacity={g("tube")}>{tube === "ok" && <path d={`M${TK.fvx + 52} ${fvTop + 20} Q${(TK.fvx + TK.ovx) / 2} ${fvTop - 70} ${TK.ovx - 6} ${TK.ovTop - 10}`} fill="none" stroke="#111" strokeWidth={14} strokeLinecap="round" />}
      {tube === "down" && <path d={`M${TK.fvx + 52} ${fvTop + 20} Q${(TK.fvx + TK.ovx) / 2} ${fvTop - 70} ${TK.ovx} ${TK.ovTop} L${TK.ovx} ${TK.ovTop + 220}`} fill="none" stroke="#111" strokeWidth={14} strokeLinecap="round" />}
      {tube === "ok" && <rect x={TK.ovx - 20} y={TK.ovTop - 22} width={40} height={26} rx={6} fill="#3a4246" />}</g>
  </svg>;
};

// ===================== cuadro 0: la miniatura (sin el texto de abajo) que se acerca a Lenny y funde al gancho =====================
export const Thumb0: React.FC<{ t: number }> = ({ t }) => {
  if (t > 1.25) return null;
  const z = 1.36 + 0.1 * e(t, 0, 1.2), op = 1 - e(t, 0.75, 1.2);
  return <AbsoluteFill style={{ opacity: op, overflow: "hidden", background: "#000" }}>
    <Img src={staticFile(P + "mini.png")} style={{ position: "absolute", width: 1920, height: 1080, objectFit: "cover", transformOrigin: "62% 0%", transform: `scale(${z})` }} />
    <AbsoluteFill style={{ background: `linear-gradient(115deg, rgba(255,255,255,0) ${30 + t * 60}%, rgba(255,255,255,.16) ${36 + t * 60}%, rgba(255,255,255,0) ${42 + t * 60}%)` }} />
  </AbsoluteFill>;
};

// ===================== componentes =====================
// 1 · 200 galones por día: el medidor que gira
const Gallons: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const a = at(h, "galAt", 0.4), n = Math.round(200 * e(tt, a, a + 2.2));
  return <>
    <Kick tt={tt} txt="A TOILET THAT RUNS ALL NIGHT" col={C.red} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <circle cx={960} cy={470} r={230} fill="#11181b" stroke={C.grey2} strokeWidth={8} />
      {Array.from({ length: 40 }, (_, i) => { const an = (i / 40) * Math.PI * 2; return <line key={i} x1={960 + 210 * Math.cos(an)} y1={470 + 210 * Math.sin(an)} x2={960 + (i % 5 ? 195 : 180) * Math.cos(an)} y2={470 + (i % 5 ? 195 : 180) * Math.sin(an)} stroke={C.dim} strokeWidth={i % 5 ? 3 : 6} />; })}
      <g transform={`rotate(${tt * 260} 960 470)`}><path d="M960 470 L960 280" stroke={C.red} strokeWidth={10} strokeLinecap="round" /><circle cx={960} cy={470} r={18} fill={C.red} /></g>
    </svg>
    <div style={{ position: "absolute", left: 0, width: 1920, top: 420, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.dim, letterSpacing: 6 }}>WATER METER</div>
    <Big tt={tt} at={a} txt={`UP TO ${n} GALLONS`} y={760} size={104} col={C.ink} />
    <Big tt={tt} at={a + 1.2} txt="a day · on your next bill" y={890} size={50} col={C.amb} />
  </>; }}</Stage>;

// 2 · el mapa del video: 4 errores en 4 cartas
const Four: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const a = at(h, "fourAt", 0.4);
  const L = ["Wrong part", "Mixed parts", "Wrong height", "The wrench"];
  return <>
    <Kick tt={tt} txt="IN HUNDREDS OF BATHROOMS" col={C.red} />
    <Big tt={tt} at={a} txt="SAME 4 MISTAKES" y={190} size={120} />
    {L.map((l, i) => { const p = phys(tt, a + 0.6 + i * 0.3, 6, 0.5);
      return <div key={i} style={{ position: "absolute", left: 210 + i * 390, top: 430, width: 330, height: 400, borderRadius: 24, background: "linear-gradient(180deg,#1d262b,#0e1417)", border: `2px solid ${C.red}55`, opacity: cl(p * 1.5),
        transform: `perspective(1400px) translateY(${(1 - p) * 120}px) rotateY(${(1 - p) * -40}deg)`, fontFamily: FONT, color: C.ink, textAlign: "center", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
        <div style={{ fontWeight: 900, fontSize: 170, color: C.red, marginTop: 40, lineHeight: 1 }}>{i + 1}</div>
        <div style={{ fontWeight: 800, fontSize: 42, marginTop: 40, padding: "0 20px" }}>{l}</div>
      </div>; })}
  </>; }}</Stage>;

// 3 · anatomía: cada pieza se ilumina cuando la nombro
const Anatomy: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const ks = ["fv", "float", "overflow", "flapper"], L = ["FILL VALVE", "FLOAT", "OVERFLOW TUBE", "FLAPPER"];
  const ts = [at(h, "fvAt", 0.4), at(h, "floatAt", 1.4), at(h, "ovAt", 2.4), at(h, "flAt", 3.4)];
  const cur = ts.reduce((c, x, i) => (tt >= x ? i : c), -1);
  const pos = [[TK.x0 - 40, TK.fvTop - 40, "r"], [TK.x0 - 40, TK.lvl - 40, "r"], [TK.ovx + 60, TK.ovTop - 20, "l"], [TK.ovx + 160, TK.y1 - 110, "l"]] as const;
  return <>
    <Tank tt={tt} hi={cur >= 0 ? ks[cur] : undefined} />
    {L.map((l, i) => <Label key={i} tt={tt} a={ts[i]} x={pos[i][0]} y={pos[i][1]} txt={l} anchor={pos[i][2] as any} col={i === cur ? C.tur2 : C.dim} size={i === cur ? 46 : 34} />)}
  </>; }}</Stage>;

// 4 · dos maneras de que corra: entra y no para / sale y se repone
const TwoWays: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const a1 = at(h, "inAt", 0.4), a2 = at(h, "outAt", 2.0);
  return <>
    <Kick tt={tt} txt="A RUNNING TOILET IS ONE OF TWO THINGS" />
    <Panel x={220} y={250} w={700} h={600} tt={tt} at={a1} col={C.tur}>
      <div style={{ padding: 50 }}><div style={{ fontSize: 34, fontWeight: 800, color: C.dim, letterSpacing: 4 }}>WATER GETS IN · WON'T STOP</div>
        <svg width={600} height={300} style={{ marginTop: 20 }}><path d="M60 40 L300 40 L300 260" stroke={C.tur} strokeWidth={22} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cl((tt - a1) / 1.2)} />
          <path d="M270 200 L300 260 L330 200" stroke={C.tur} strokeWidth={14} fill="none" strokeLinecap="round" opacity={cl((tt - a1 - 1) * 3)} /></svg>
        <div style={{ fontSize: 76, fontWeight: 900, color: C.ink }}>FILL VALVE</div></div>
    </Panel>
    <Panel x={1000} y={250} w={700} h={600} tt={tt} at={a2} col={C.red}>
      <div style={{ padding: 50 }}><div style={{ fontSize: 34, fontWeight: 800, color: C.dim, letterSpacing: 4 }}>WATER GETS OUT · VALVE REFILLS</div>
        <svg width={600} height={300} style={{ marginTop: 20 }}><path d="M300 40 L300 260 L560 260" stroke={C.red} strokeWidth={22} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cl((tt - a2) / 1.2)} />
          <path d="M500 230 L560 260 L500 290" stroke={C.red} strokeWidth={14} fill="none" strokeLinecap="round" opacity={cl((tt - a2 - 1) * 3)} /></svg>
        <div style={{ fontSize: 76, fontWeight: 900, color: C.ink }}>FLAPPER</div></div>
    </Panel>
  </>; }}</Stage>;

// 5 · cartel de error (número + qué + cuánto cuesta)
const Mistake: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const p = phys(tt, 0.15, 5.5, 0.5);
  return <>
    <div style={{ position: "absolute", left: 0, width: 1920, top: 150, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 60, letterSpacing: 14, color: C.red, opacity: cl(p) }}>MISTAKE</div>
    <div style={{ position: "absolute", left: 0, width: 1920, top: 200, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 340, color: "transparent", WebkitTextStroke: `5px ${C.red}`, opacity: 0.8 * cl(p), transform: `scale(${0.8 + 0.2 * p})` }}>#{h.n}</div>
    <Big tt={tt} at={0.5} txt={h.name} y={600} size={110} />
    <Big tt={tt} at={0.9} txt={h.sub} y={760} size={50} col={C.amb} />
    <div style={{ position: "absolute", right: 260, top: 250, transform: `rotate(-8deg)` }}><Badge p={tt - 0.7} /></div>
  </>; }}</Stage>;

// 6 · la prueba del colorante: 10 gotas, 20 minutos, la taza dice quién es
const Dye: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const d = at(h, "dropAt", 0.5), w = at(h, "waitAt", d + 1.5), dye = e(tt, d, d + 1.6);
  const drops = Math.min(10, Math.floor((tt - d) * 6));
  const mins = Math.round(20 * e(tt, w, w + 2));
  return <>
    <Kick tt={tt} txt="THE FOOD COLORING TEST · COSTS NOTHING" col={C.ok} />
    <Tank tt={tt} dye={dye} dim={0.2} />
    {Array.from({ length: Math.max(0, drops) }, (_, i) => { const k = cl((tt - d - i / 6) * 2); return <div key={i} style={{ position: "absolute", left: 900 + (i % 3) * 30, top: 260 + k * 280, width: 18, height: 26, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#2a7de1", opacity: 1 - k }} />; })}
    <Label tt={tt} a={d} x={1440} y={300} txt={`${Math.max(0, drops)} DROPS`} col={C.tur2} size={54} />
    <Label tt={tt} a={w} x={1440} y={400} txt={`${mins} MIN`} col={C.amb} size={90} />
    <Label tt={tt} a={w + 0.4} x={1440} y={510} txt="don't flush" col={C.dim} size={38} />
  </>; }}</Stage>;

// 7 · la lectura: taza limpia = válvula · taza con color = tapón de $6
const DyeRead: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const a1 = at(h, "clearAt", 0.3), a2 = at(h, "colorAt", 1.6);
  const Bowl = ({ col, x }: { col: string; x: number }) => <svg width={520} height={360} style={{ position: "absolute", left: x, top: 300 }}>
    <ellipse cx={260} cy={110} rx={230} ry={80} fill="#e9eceb" /><ellipse cx={260} cy={120} rx={180} ry={56} fill={col} /><path d="M40 120 Q60 330 260 340 Q460 330 480 120" fill="#e9eceb" opacity={0.85} /></svg>;
  return <>
    <Kick tt={tt} txt="COME BACK AND LOOK IN THE BOWL" />
    <div style={{ opacity: cl(phys(tt, a1, 6, 0.5) * 1.4) }}><Bowl x={280} col="rgba(170,220,235,.8)" /></div>
    <div style={{ opacity: cl(phys(tt, a2, 6, 0.5) * 1.4) }}><Bowl x={1120} col="rgba(40,120,220,.9)" /></div>
    <Label tt={tt} a={a1 + 0.4} x={540} y={700} txt="CLEAR" anchor="c" size={70} col={C.ink} />
    <Label tt={tt} a={a1 + 0.7} x={540} y={790} txt="→ the fill valve" anchor="c" size={46} col={C.tur2} />
    <Label tt={tt} a={a2 + 0.4} x={1380} y={700} txt="COLOR" anchor="c" size={70} col={C.ink} />
    <Label tt={tt} a={a2 + 0.7} x={1380} y={790} txt="→ a $6 flapper" anchor="c" size={46} col={C.amb} />
  </>; }}</Stage>;

// 8 · el agua entra al rebosadero: el flotador está muy alto → bajarlo
const Spill: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const d = at(h, "downAt", 2.0), lv = TK.ovTop - 8 + 50 * e(tt, d, d + 1.4), sp = 1 - e(tt, d, d + 1);
  return <>
    <Kick tt={tt} txt="WATER SPILLING INTO THE OVERFLOW?" col={C.amb} />
    <Tank tt={tt} hi="float" level={lv} spill={sp} floatY={lv - 20} />
    <Label tt={tt} a={0.6} x={TK.x1 + 50} y={TK.ovTop - 30} txt="float set too high" col={C.amb} size={40} />
    <Label tt={tt} a={d} x={TK.fvx - 80} y={TK.lvl - 10} txt="TURN IT DOWN" col={C.ok} anchor="r" size={52} />
    <Big tt={tt} at={d + 0.6} txt="5 minutes · no parts" y={940} size={50} col={C.ink} />
  </>; }}</Stage>;

// 9 · la manguerita: metida en el caño ✗ / sujeta arriba ✓
const Tube: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const f = at(h, "fixAt", 2.2), ok = tt > f;
  return <>
    <Kick tt={tt} txt="THE REFILL TUBE" />
    <Tank tt={tt} hi="tube" tube={ok ? "ok" : "down"} level={ok ? TK.lvl : TK.lvl + 60 + 30 * Math.sin(tt * 2)} />
    <div style={{ position: "absolute", left: 1450, top: 330 }}><Badge p={ok ? tt - f : tt - 0.4} ok={ok} size={150} /></div>
    <Label tt={tt} a={ok ? f + 0.2 : 0.6} x={1450} y={510} txt={ok ? "clipped above the water" : "shoved down the pipe"} col={ok ? C.ok : C.red} size={36} />
    {!ok && <Label tt={tt} a={1.1} x={1450} y={570} txt="siphons the tank" col={C.dim} size={36} />}
  </>; }}</Stage>;

// 10 · la factura de Logan Square: +$40, dos segundos
const Coffee: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const a = at(h, "billAt", 0.4), b = at(h, "secAt", a + 1.5);
  return <>
    <Kick tt={tt} txt="A TWO-FLAT IN LOGAN SQUARE" col={C.amb} />
    <Panel x={560} y={240} w={800} h={420} tt={tt} at={a}>
      <div style={{ padding: "40px 56px", fontFamily: "Courier New, monospace", color: C.ink }}><div style={{ fontSize: 34, color: C.dim }}>WATER BILL</div>
        <div style={{ fontSize: 150, fontWeight: 900, color: C.red, marginTop: 20 }}>+$40</div>
        <div style={{ fontSize: 34, color: C.dim }}>this month</div></div>
    </Panel>
    <Big tt={tt} at={b} txt="THE FIX: 2 SECONDS" y={730} size={96} col={C.ok} />
    <div style={{ position: "absolute", left: 0, width: 1920, top: 870, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 60, color: C.amb, opacity: cl((tt - b - 0.8) * 2) }}>they bought me a coffee</div>
  </>; }}</Stage>;

// 11 · el grano de arena bajo el sello (zoom)
const Grit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const z = e(tt, 0.3, 2.2), a = at(h, "costAt", 2.6);
  return <>
    <Kick tt={tt} txt="9 TIMES OUT OF 10 IT ISN'T BROKEN" col={C.ok} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <g transform={`translate(960 470) scale(${1 + 1.4 * z}) translate(-960 -470)`}>
        <ellipse cx={960} cy={470} rx={230} ry={70} fill="#151515" stroke="#333" strokeWidth={6} />
        <ellipse cx={960} cy={460} rx={150} ry={40} fill="#262626" />
        <path d="M948 448 l14 -8 l12 6 l-4 12 l-16 4 z" fill="#a8743f" stroke="#6b4824" strokeWidth={2} />
        <path d="M1010 470 l8 -6 l9 4 l-3 8 z" fill="#8a5a30" />
      </g>
      <circle cx={960} cy={470} r={90 + 40 * z} fill="none" stroke={C.amb} strokeWidth={4} opacity={z * (0.6 + 0.4 * Math.sin(tt * 5))} />
    </svg>
    <Label tt={tt} a={1.6} x={1240} y={300} txt="one grain of sand" col={C.amb} size={50} />
    <Label tt={tt} a={a} x={480} y={790} txt="NEW VALVE ≈ $12" col={C.dim} size={56} anchor="c" />
    <Label tt={tt} a={a + 0.6} x={1440} y={790} txt="CLEANING IT: $0" col={C.ok} size={56} anchor="c" />
  </>; }}</Stage>;

// 12 · lo que necesitás: vaso, trapo, cepillo
const Kit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => <>
  <Kick tt={tt} txt="WHAT YOU NEED" col={C.ok} />
  <Rows tt={tt} h={h} x={620} y={300} w={900} gap={150} size={70} rows={[{ at: h.at + 0.3, txt: "A plastic cup" }, { at: h.at + 0.8, txt: "An old towel" }, { at: h.at + 1.3, txt: "A soft toothbrush" }]} />
  <Big tt={tt} at={2.0} txt="That's it." y={800} size={80} col={C.amb} />
</>}</Stage>;

// 13 · la llave de paso: a la derecha, despacio, con la mano
const Shutoff: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const a = at(h, "turnAt", 0.6), r = 300 * e(tt, a, a + 1.8);
  return <>
    <Kick tt={tt} txt="FIRST · WATER OFF" />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <rect x={560} y={540} width={300} height={70} rx={10} fill="#b9b2a3" /><rect x={860} y={510} width={160} height={130} rx={18} fill="#c9c2b2" />
      <path d="M940 640 L940 900" stroke="#cfd5d8" strokeWidth={30} />
      <g transform={`rotate(${r} 940 450)`}><ellipse cx={940} cy={450} rx={110} ry={46} fill="#e3ddd0" stroke="#8d8676" strokeWidth={6} /></g>
      <path d="M1120 330 A200 200 0 0 1 1180 560" fill="none" stroke={C.ok} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - e(tt, a, a + 1.2)} />
      <path d="M1150 540 L1180 570 L1205 530" fill="none" stroke={C.ok} strokeWidth={10} strokeLinecap="round" opacity={e(tt, a + 1, a + 1.3)} />
    </svg>
    <Label tt={tt} a={a} x={1240} y={420} txt="CLOCKWISE" col={C.ok} size={64} />
    <Label tt={tt} a={a + 0.5} x={1240} y={500} txt="till it stops · by hand" col={C.dim} size={40} />
  </>; }}</Stage>;

// 14 · la tapa: ⅛ de vuelta a la izquierda
const Eighth: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const a = at(h, "twistAt", 0.8), r = -45 * e(tt, a, a + 1.2);
  return <>
    <Kick tt={tt} txt="THE CAP · NO TOOLS" />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d={`M960 520 L960 220 A300 300 0 0 0 ${960 + 300 * Math.cos(-Math.PI / 2 - Math.PI / 4 * e(tt, a, a + 1.2))} ${520 + 300 * Math.sin(-Math.PI / 2 - Math.PI / 4 * e(tt, a, a + 1.2))} Z`} fill={C.amb} opacity={0.28} />
      <circle cx={960} cy={520} r={300} fill="none" stroke={C.line} strokeWidth={3} />
      {Array.from({ length: 8 }, (_, i) => <line key={i} x1={960 + 300 * Math.cos(i * Math.PI / 4)} y1={520 + 300 * Math.sin(i * Math.PI / 4)} x2={960 + 268 * Math.cos(i * Math.PI / 4)} y2={520 + 268 * Math.sin(i * Math.PI / 4)} stroke={C.dim} strokeWidth={6} />)}
      <g transform={`rotate(${r} 960 520)`}><circle cx={960} cy={520} r={170} fill="#2f3639" stroke={C.grey2} strokeWidth={6} /><rect x={950} y={330} width={20} height={190} rx={10} fill={C.grey2} />
        <rect x={960} y={505} width={320} height={30} rx={12} fill="#5d676c" /></g>
    </svg>
    <Big tt={tt} at={a + 0.3} txt="⅛ turn · counterclockwise" y={880} size={70} col={C.amb} />
  </>; }}</Stage>;

// 15 · el atajo del plomero: todo lo de abajo se queda donde está
const Stays: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const rows = [at(h, "r1", 0.4), at(h, "r2", 1.0), at(h, "r3", 1.6)], sc = at(h, "shortAt", 2.4);
  return <>
    <Tank tt={tt} hi="fv" level={TK.y1 - 60} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <rect x={TK.fvx - 70} y={TK.fvTop - 16} width={140} height={86} rx={16} fill="none" stroke={C.ok} strokeWidth={6} strokeDasharray="12 8" opacity={e(tt, sc, sc + 0.4)} />
      <rect x={TK.x0 - 40} y={TK.y1 - 10} width={500} height={130} rx={16} fill="rgba(255,77,61,.08)" stroke={C.red} strokeWidth={3} opacity={e(tt, rows[0], rows[0] + 0.4)} />
    </svg>
    <Rows tt={tt} h={h} x_ x={1440} y={330} w={460} gap={90} size={34} col={C.red} rows={[{ at: h.at + rows[0], txt: "Valve out" }, { at: h.at + rows[1], txt: "Nut under the tank" }, { at: h.at + rows[2], txt: "Water line" }]} />
    <Big tt={tt} at={sc} txt="THE PLUMBER'S SHORTCUT" y={110} size={70} col={C.ok} />
    <Label tt={tt} a={sc + 0.5} x={1440} y={640} txt="the problem is up here" col={C.ok} size={40} />
  </>; }}</Stage>;

// 16 · el sello: liso y plano ✓ / con el anillo marcado ✗
const Seal: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const a1 = at(h, "goodAt", 0.4), a2 = at(h, "wornAt", 1.6);
  const S = ({ x, worn, a }: { x: number; worn?: boolean; a: number }) => { const p = phys(tt, a, 6, 0.5);
    return <svg width={520} height={420} style={{ position: "absolute", left: x, top: 300, opacity: cl(p * 1.4), transform: `perspective(1200px) rotateX(${(1 - p) * 50 + 30}deg)` }}>
      <circle cx={260} cy={210} r={190} fill="#4a5056" stroke="#8a949c" strokeWidth={5} /><circle cx={260} cy={210} r={150} fill="#5a6168" />
      {worn && <circle cx={260} cy={210} r={92} fill="none" stroke="#2a2e32" strokeWidth={22} />}{worn && <circle cx={260} cy={210} r={92} fill="none" stroke="#ff4d3d" strokeWidth={4} />}
      <circle cx={260} cy={210} r={40} fill="#0e1418" stroke="#8a949c" strokeWidth={3} /></svg>; };
  return <>
    <Kick tt={tt} txt="THE RUBBER SEAL INSIDE THE CAP" />
    <S x={300} a={a1} /><S x={1100} a={a2} worn />
    <div style={{ position: "absolute", left: 480, top: 280 }}><Badge p={tt - a1 - 0.4} ok size={100} /></div>
    <div style={{ position: "absolute", left: 1280, top: 280 }}><Badge p={tt - a2 - 0.4} size={100} /></div>
    <Label tt={tt} a={a1 + 0.5} x={560} y={780} txt="smooth and flat" anchor="c" size={50} col={C.ok} />
    <Label tt={tt} a={a2 + 0.5} x={1360} y={780} txt="a ring pressed in" anchor="c" size={50} col={C.red} />
  </>; }}</Stage>;

// 17 · el truco del vaso: 5 segundos, dos veces
const Cup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const b1 = at(h, "b1", 0.8), b2 = at(h, "b2", b1 + 2.5), burst = Math.max(cl((tt - b1) / 0.3) * (1 - cl((tt - b1 - 1.6) / 0.4)), cl((tt - b2) / 0.3) * (1 - cl((tt - b2 - 1.6) / 0.4)));
  const n = tt > b2 ? 2 : tt > b1 ? 1 : 0, dirty = tt < b2;
  return <>
    <Kick tt={tt} txt="THE CUP TRICK" col={C.ok} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <rect x={900} y={640} width={120} height={300} fill="#8b959a" /><rect x={880} y={600} width={160} height={60} rx={12} fill="#5d676c" />
      {burst > 0 && Array.from({ length: 26 }, (_, i) => { const k = ((tt * 2.2 + i / 26) % 1); const x = 960 + Math.sin(i * 7.3) * 90 * k; return <circle key={i} cx={x} cy={600 - k * 330} r={dirty && i % 3 === 0 ? 7 : 5} fill={dirty && i % 3 === 0 ? "#8a5a30" : C.tur2} opacity={burst * (1 - k * 0.6)} />; })}
      <path d="M800 230 L1120 230 L1080 560 L840 560 Z" fill="rgba(220,240,250,.12)" stroke="rgba(230,245,255,.75)" strokeWidth={5} />
    </svg>
    <Label tt={tt} a={b1} x={1240} y={360} txt={`BURST ${n} of 2`} col={C.tur2} size={64} />
    <Label tt={tt} a={b1 + 0.3} x={1240} y={450} txt="5 seconds" col={C.dim} size={44} />
    <Label tt={tt} a={b1 + 0.8} x={1240} y={560} txt={n === 2 ? "the pipe runs clean" : "carries the sand out"} col={n === 2 ? C.ok : C.amb} size={42} />
  </>; }}</Stage>;

// 18 · techo mojado: nunca abrir del todo sin el vaso
const Fountain: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const f = e(tt, 0.4, 1.0);
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <rect x={300} y={120} width={1320} height={40} fill="#2a3338" /><ellipse cx={960} cy={170} rx={260 * f} ry={40 * f} fill="rgba(92,200,224,.35)" />
      <rect x={900} y={720} width={120} height={260} fill="#8b959a" />
      {Array.from({ length: 30 }, (_, i) => { const k = ((tt * 2.6 + i / 30) % 1); return <circle key={i} cx={960 + Math.sin(i * 5.1) * 70 * k} cy={720 - k * 560} r={6} fill={C.tur2} opacity={f * (1 - k * 0.5)} />; })}
    </svg>
    <div style={{ position: "absolute", left: 1350, top: 400 }}><Badge p={tt - 0.8} size={150} /></div>
    <Label tt={tt} a={1.0} x={1300} y={590} txt="all the way · no cup" col={C.red} size={46} />
    <Label tt={tt} a={1.6} x={1300} y={660} txt="I've seen ceilings." col={C.dim} size={40} />
  </>; }}</Stage>;

// 19 · ¿sello o válvula entera? el árbol de decisión
const Decide: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const a1 = at(h, "sealAt", 0.5), a2 = at(h, "valveAt", 2.5);
  return <>
    <Kick tt={tt} txt="STILL RUNS AFTER CLEANING?" col={C.amb} />
    <Panel x={200} y={240} w={720} h={640} tt={tt} at={a1} col={C.tur}>
      <div style={{ padding: 50 }}><div style={{ fontSize: 30, fontWeight: 800, color: C.dim, letterSpacing: 4 }}>DENT IN THE SEAL · FLOAT WON'T DROP</div>
        <div style={{ fontSize: 96, fontWeight: 900, marginTop: 40 }}>NEW SEAL</div><div style={{ fontSize: 44, fontWeight: 800, color: C.tur2, marginTop: 10 }}>a few dollars</div>
        <div style={{ fontSize: 34, color: C.dim, marginTop: 70 }}>same cap · same ⅛ turn</div></div>
    </Panel>
    <Panel x={1000} y={240} w={720} h={640} tt={tt} at={a2} col={C.amb}>
      <div style={{ padding: 50 }}><div style={{ fontSize: 30, fontWeight: 800, color: C.dim, letterSpacing: 4 }}>CRACKED · BRITTLE · OLD BRASS BALL</div>
        <div style={{ fontSize: 96, fontWeight: 900, marginTop: 40 }}>NEW VALVE</div><div style={{ fontSize: 44, fontWeight: 800, color: C.amb, marginTop: 10 }}>about $12</div>
        <div style={{ fontSize: 34, color: C.dim, marginTop: 70 }}>everything in the box</div></div>
    </Panel>
  </>; }}</Stage>;

// 20 · nunca mezclar: tapa nueva + cuerpo viejo ✗ · todo de la misma caja ✓
const NoMix: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const a = at(h, "boxAt", 2.4);
  const V = ({ x, topC, botC, p }: { x: number; topC: string; botC: string; p: number }) => <svg width={300} height={560} style={{ position: "absolute", left: x, top: 260, opacity: cl(p * 1.4), transform: `translateY(${(1 - p) * 60}px)` }}>
    <rect x={95} y={130} width={110} height={400} rx={8} fill={botC} /><rect x={60} y={40} width={180} height={100} rx={20} fill={topC} /></svg>;
  return <>
    <Kick tt={tt} txt="TOP AND BOTTOM · SAME BOX" />
    <V x={420} topC="#e8edef" botC="#7a6f5d" p={phys(tt, 0.3, 6, 0.5)} />
    <div style={{ position: "absolute", left: 640, top: 250 }}><Badge p={tt - 0.9} size={120} /></div>
    <Label tt={tt} a={1.0} x={570} y={850} txt="new cap · old body" anchor="c" col={C.red} size={44} />
    <V x={1200} topC="#e8edef" botC="#9aa3a8" p={phys(tt, a, 6, 0.5)} />
    <div style={{ position: "absolute", left: 1420, top: 250 }}><Badge p={tt - a - 0.4} ok size={120} /></div>
    <Label tt={tt} a={a + 0.4} x={1350} y={850} txt="the whole thing, new" anchor="c" col={C.ok} size={44} />
  </>; }}</Stage>;

// 21 · sacar la vieja: esponja, tuerca, tuerca
const Out: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => <>
  <Kick tt={tt} txt={h.kick} />
  <Rows tt={tt} h={h} num x={520} y={260} w={1100} gap={150} size={56} rows={h.rows} />
</>}</Stage>;

// 22 · la regla de las 3 pulgadas: el tope 3" sobre el rebosadero · C.L. 1" sobre el rebosadero · código
const Height: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const a = at(h, "threeAt", 0.8), c = at(h, "clAt", a + 1.5), k = at(h, "codeAt", c + 1.5);
  const top = TK.fvTop + 120 * (1 - e(tt, a - 0.6, a + 0.6));
  const dimL = (y1: number, y2: number, x: number, p: number, col: string) => <g opacity={p}><line x1={x} y1={y1} x2={x} y2={y1 + (y2 - y1) * p} stroke={col} strokeWidth={5} /><line x1={x - 18} y1={y1} x2={x + 18} y2={y1} stroke={col} strokeWidth={5} /><line x1={x - 18} y1={y2} x2={x + 18} y2={y2} stroke={col} strokeWidth={5} opacity={p} /></g>;
  return <>
    <Tank tt={tt} hi="fv" fvTop={top} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <line x1={TK.x0 - 40} y1={TK.ovTop} x2={TK.x1 + 40} y2={TK.ovTop} stroke={C.dim} strokeWidth={2} strokeDasharray="10 10" opacity={e(tt, 0.3, 0.8)} />
      {dimL(TK.ovTop, top, TK.fvx - 120, e(tt, a, a + 0.6), C.ok)}
      <line x1={TK.fvx + 30} y1={TK.cl} x2={TK.x1 + 40} y2={TK.cl} stroke={C.amb} strokeWidth={3} strokeDasharray="8 8" opacity={e(tt, c, c + 0.5)} />
      {dimL(TK.ovTop, TK.cl, TK.ovx + 120, e(tt, c, c + 0.6), C.amb)}
    </svg>
    <Label tt={tt} a={a} x={TK.x0 - 40} y={TK.ovTop - 130} txt='3"' col={C.ok} size={90} anchor="r" />
    <Label tt={tt} a={a + 0.3} x={TK.x0 - 40} y={TK.ovTop - 30} txt="above the overflow" col={C.dim} size={34} anchor="r" />
    <Label tt={tt} a={c} x={TK.ovx + 160} y={TK.cl - 30} txt='C.L. mark · 1" above' col={C.amb} size={44} />
    <Label tt={tt} a={k} x={TK.ovx + 160} y={TK.cl + 40} txt="PLUMBING CODE" col={C.ink} size={56} />
    <Label tt={tt} a={k + 0.5} x={TK.ovx + 160} y={TK.cl + 110} txt="keeps tank water out of your drinking water" col={C.dim} size={30} />
  </>; }}</Stage>;

// 23 · ¿quién dijo que la vieja estaba bien? la válvula corta: el agua para 2" abajo
const Short: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const lv = TK.lvl + 120;
  return <>
    <Kick tt={tt} txt="SAME HEIGHT AS THE OLD ONE?" col={C.red} />
    <Tank tt={tt} hi="fv" fvTop={TK.fvTop + 170} level={lv} floatY={lv - 20} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}><line x1={TK.x0} y1={TK.lvl} x2={TK.x1} y2={TK.lvl} stroke={C.ok} strokeWidth={3} strokeDasharray="10 8" opacity={e(tt, 0.8, 1.2)} />
      <line x1={TK.x1 + 60} y1={TK.lvl} x2={TK.x1 + 60} y2={TK.lvl + 120 * e(tt, 1.2, 1.8)} stroke={C.red} strokeWidth={6} /></svg>
    <Label tt={tt} a={1.3} x={TK.x1 + 90} y={TK.lvl + 20} txt={'2" LOW'} col={C.red} size={70} />
    <Label tt={tt} a={2.0} x={TK.x1 + 90} y={TK.lvl + 110} txt="the screw won't fix it" col={C.dim} size={34} />
  </>; }}</Stage>;

// 24 · girar el caño: izquierda más alta / derecha más baja · el anillo, ni tocarlo
const Twist: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const a = at(h, "leftAt", 0.6), rg = at(h, "ringAt", 3.0), grow = 60 * Math.sin(Math.min(1, e(tt, a, a + 1.6)) * Math.PI);
  return <>
    <Kick tt={tt} txt="SETTING THE HEIGHT" />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <rect x={890} y={220 - grow} width={140} height={110} rx={22} fill="#3a4246" stroke={C.grey2} strokeWidth={4} />
      <rect x={920} y={320 - grow} width={80} height={260 + grow} fill="#9aa3a8" />
      <rect x={905} y={560} width={110} height={34} rx={8} fill={tt > rg ? C.amb : "#6c767b"} stroke={tt > rg ? "#fff" : "none"} strokeWidth={3} />
      <rect x={925} y={594} width={70} height={300} fill="#7d878c" />
      <path d="M800 760 A170 60 0 0 0 1120 760" fill="none" stroke={C.ok} strokeWidth={8} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - e(tt, a, a + 1)} />
    </svg>
    <Label tt={tt} a={a} x={760} y={700} txt="⟲ LEFT = TALLER" col={C.ok} size={48} anchor="r" />
    <Label tt={tt} a={a + 0.8} x={1160} y={700} txt="RIGHT = SHORTER ⟳" col={C.dim} size={48} />
    <Label tt={tt} a={a + 1.4} x={960} y={950} txt="click · click · click" col={C.dim} size={36} anchor="c" />
    <Label tt={tt} a={rg} x={1080} y={548} txt="LOCK RING · LEAVE IT ALONE" col={C.amb} size={40} />
  </>; }}</Stage>;

// 25 · la llave grande: tuerca rota, tanque rajado, inodoro nuevo
const Wrench: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const c = at(h, "crackAt", 1.0), m = at(h, "moneyAt", c + 1.5), k = e(tt, c, c + 0.5);
  return <>
    <Kick tt={tt} txt="MISTAKE #4 · THE EXPENSIVE ONE" col={C.red} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <rect x={660} y={240} width={600} height={420} rx={30} fill="rgba(244,246,245,.08)" stroke={C.por} strokeWidth={12} />
      <path d={`M900 250 l30 60 l-24 40 l40 70 l-20 50 l30 80`} fill="none" stroke={C.red} strokeWidth={7} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
      <g transform={`rotate(${-20 + 25 * e(tt, 0.3, c)} 960 760)`}><rect x={620} y={735} width={420} height={50} rx={14} fill="#8d969b" /><path d="M1040 700 h70 v40 h-30 v40 h30 v40 h-70z" fill="#8d969b" /></g>
    </svg>
    <Label tt={tt} a={m} x={480} y={880} txt="$12 VALVE" col={C.dim} size={60} anchor="c" />
    <Label tt={tt} a={m + 0.6} x={1440} y={880} txt="→ A NEW TOILET" col={C.red} size={60} anchor="c" />
  </>; }}</Stage>;

// 26 · a mano: nada de llave
const HandTight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => <>
  <Kick tt={tt} txt="WHAT THE MAKER SAYS IN THE BOX" col={C.ok} />
  <Big tt={tt} at={0.3} txt="HAND TIGHT" y={300} size={200} col={C.ok} />
  <Big tt={tt} at={0.9} txt="do not over tighten" y={540} size={64} col={C.ink} />
  <Rows tt={tt} h={h} x={640} y={700} w={800} gap={100} size={44} rows={[{ at: h.at + 1.6, txt: "Lock nut · by hand" }, { at: h.at + 2.2, txt: "Water line nut · by hand" }]} />
</>}</Stage>;

// 27 · el nivel del agua: ½" debajo del rebosadero · 8 vueltas = ½"
const Level: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const a = at(h, "halfAt", 0.5), s = at(h, "eightAt", 3.0), turns = Math.min(8, Math.floor(e(tt, s, s + 2.4) * 8.99));
  const lv = TK.ovTop + 30 + 30 * (1 - e(tt, s, s + 2.4));
  return <>
    <Tank tt={tt} hi="float" level={lv} floatY={lv - 20} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}><line x1={TK.x1 + 40} y1={TK.ovTop} x2={TK.x1 + 40} y2={TK.ovTop + 30} stroke={C.ok} strokeWidth={6} opacity={e(tt, a, a + 0.5)} /></svg>
    <Label tt={tt} a={a} x={TK.x1 + 70} y={TK.ovTop - 40} txt={'½" BELOW'} col={C.ok} size={64} />
    <Label tt={tt} a={a + 0.4} x={TK.x1 + 70} y={TK.ovTop + 40} txt="the overflow" col={C.dim} size={36} />
    <Label tt={tt} a={s} x={TK.x0 - 60} y={300} txt={`${turns} TURNS`} col={C.amb} size={56} anchor="r" />
    <Label tt={tt} a={s + 0.4} x={TK.x0 - 60} y={380} txt={'of the screw = ½" lower'} col={C.dim} size={38} anchor="r" />
  </>; }}</Stage>;

// 28 · la manguera de la pared: plástico viejo ✗ · trenzada $8 ✓ (con lo que se pide en la ferretería)
const Hose: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const a = at(h, "braidAt", 1.8), sp = at(h, "askAt", a + 1.6);
  return <>
    <Kick tt={tt} txt="THE WATER LINE · WHILE THE WATER'S OFF" />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d="M260 420 Q560 330 860 420" stroke="#e9e4d6" strokeWidth={30} fill="none" strokeLinecap="round" opacity={cl(phys(tt, 0.3, 6, 0.5) * 1.4)} />
      <path d="M1060 420 Q1360 330 1660 420" stroke="#c9d0d4" strokeWidth={30} fill="none" strokeLinecap="round" opacity={cl(phys(tt, a, 6, 0.5) * 1.4)} />
      <path d="M1060 420 Q1360 330 1660 420" stroke="#7d878c" strokeWidth={30} fill="none" strokeDasharray="4 6" opacity={0.8 * cl(phys(tt, a, 6, 0.5))} />
    </svg>
    <div style={{ position: "absolute", left: 500, top: 200 }}><Badge p={tt - 0.8} size={110} /></div>
    <div style={{ position: "absolute", left: 1300, top: 200 }}><Badge p={tt - a - 0.4} ok size={110} /></div>
    <Label tt={tt} a={0.9} x={560} y={500} txt="old plastic · over 5 years" anchor="c" col={C.red} size={42} />
    <Label tt={tt} a={a + 0.3} x={1360} y={500} txt="braided steel · about $8" anchor="c" col={C.ok} size={42} />
    <Panel x={460} y={640} w={1000} h={250} tt={tt} at={sp} col={C.amb}>
      <div style={{ padding: "34px 50px", fontFamily: HAND, fontSize: 50, color: C.amb, lineHeight: 1.2 }}>"Braided toilet supply line,<br />⅜ compression × ⅞, 12 inches"</div>
    </Panel>
  </>; }}</Stage>;

// 29 · la llave de la pared que gotea en la perilla: ⅛ de vuelta en la tuerca chica
const Packing: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const a = at(h, "nutAt", 1.5), r = 45 * e(tt, a, a + 1.2), drip = 1 - e(tt, a + 1.2, a + 2);
  return <>
    <Kick tt={tt} txt="DRIPS AROUND THE KNOB?" col={C.amb} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <rect x={640} y={560} width={320} height={80} rx={10} fill="#b9b2a3" /><rect x={880} y={520} width={180} height={150} rx={20} fill="#c9c2b2" />
      <g transform={`rotate(${r} 970 470)`}><polygon points={Array.from({ length: 6 }, (_, i) => `${970 + 44 * Math.cos(i * Math.PI / 3)},${470 + 44 * Math.sin(i * Math.PI / 3)}`).join(" ")} fill={C.amb} stroke="#fff" strokeWidth={3} /></g>
      <rect x={960} y={300} width={20} height={150} fill="#a39c8c" /><ellipse cx={970} cy={290} rx={110} ry={40} fill="#e3ddd0" stroke="#8d8676" strokeWidth={6} />
      {Array.from({ length: 3 }, (_, i) => { const k = ((tt * 0.9 + i / 3) % 1); return <ellipse key={i} cx={1010} cy={500 + k * 260} rx={9} ry={13} fill={C.tur2} opacity={drip * (1 - k)} />; })}
    </svg>
    <Label tt={tt} a={0.6} x={1100} y={440} txt="the little nut under the handle" col={C.amb} size={42} />
    <Label tt={tt} a={a} x={1100} y={510} txt="⅛ turn to the right" col={C.ok} size={54} />
    <Label tt={tt} a={a + 1.4} x={1100} y={590} txt="still dripping? one more ⅛ · stop" col={C.dim} size={34} />
  </>; }}</Stage>;

// 30 · la que no gira: nada de pinza · la llave general del sótano
const Stuck: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const m = at(h, "mainAt", 2.0);
  return <>
    <Kick tt={tt} txt="WON'T TURN?" col={C.red} />
    <Rows tt={tt} h={h} x_ x={560} y={260} w={900} gap={120} size={52} rows={[{ at: h.at + 0.4, txt: "Pliers or a big wrench" }]} />
    <Rows tt={tt} h={h} x={560} y={400} w={900} gap={120} size={52} rows={[{ at: h.at + 0.9, txt: "A dry rag · rock it by hand" }, { at: h.at + m, txt: "Won't move? Close the MAIN" }]} />
    <Big tt={tt} at={m + 0.6} txt="in the basement" y={720} size={70} col={C.amb} />
  </>; }}</Stage>;

// 31 · historias: tres casas, una tarjeta por caso
const Story: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const a = at(h, "keyAt", 1.0);
  return <>
    <Kick tt={tt} txt={h.kick} col={C.amb} />
    <Big tt={tt} at={0.3} txt={h.big} y={330} size={h.size ?? 150} col={C.ink} />
    <Big tt={tt} at={0.7} txt={h.sub} y={560} size={52} col={C.dim} />
    <div style={{ position: "absolute", left: 0, width: 1920, top: 720, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 70, color: C.ok, opacity: cl((tt - a) * 2), transform: `rotate(-2deg)` }}>{h.key}</div>
  </>; }}</Stage>;

// 32 · la factura del plomero por esto
const Bill: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const grow = cl(tt / 1.2), last = h.rows[h.rows.length - 1].at - h.at;
  return <>
    <Kick tt={tt} txt="WHAT A PLUMBER CHARGES FOR THIS" col={C.red} />
    <div style={{ position: "absolute", left: 640, top: 210, width: 640, height: (200 + h.rows.length * 84 + 90) * grow, overflow: "hidden", background: "#f3f0e7", borderRadius: "6px 6px 0 0", boxShadow: "0 40px 90px rgba(0,0,0,.6)", fontFamily: "Courier New, monospace", color: "#1d1d1d" }}>
      <div style={{ padding: "40px 46px 10px", fontWeight: 900, fontSize: 40, textAlign: "center" }}>PLUMBING · INVOICE</div>
      <div style={{ borderTop: "3px dashed #999", margin: "10px 40px" }} />
      {h.rows.map((r: any, i: number) => { const a = Math.max(0.5 + i * 0.4, r.at - h.at), o = cl((tt - a) * 2.5);
        return <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "20px 46px", fontSize: 32, fontWeight: 700, opacity: o }}><span>{r.item}</span><span>{r.v}</span></div>; })}
      <div style={{ padding: "16px 46px", fontSize: 30, fontWeight: 700, color: "#c0281c", opacity: cl((tt - last - 0.8) * 2) }}>…for a grain of sand · 7 minutes</div>
    </div>
  </>; }}</Stage>;

// 33 · capítulo (número grande + nombre)
const Chapter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const p = phys(tt, 0.15, 5.5, 0.5);
  return <>
    <div style={{ position: "absolute", left: 0, width: 1920, top: 40, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 340, color: "transparent", WebkitTextStroke: `4px ${C.tur}`, opacity: 0.35 * cl(p), transform: `scale(${0.8 + 0.2 * p})` }}>{h.n}</div>
    <Big tt={tt} at={0.4} txt={h.name} y={470} size={140} />
    <Big tt={tt} at={0.8} txt={h.sub} y={660} size={52} col={C.tur2} />
    <div style={{ position: "absolute", left: 960 - 260 * cl((tt - 0.6) * 1.5), width: 520 * cl((tt - 0.6) * 1.5), top: 640, height: 6, background: C.ok, borderRadius: 3 }} />
  </>; }}</Stage>;

// 34 · repaso: tramos con filas que se tildan
const REC: Record<number, { k: string; col: string; rows: string[] }> = {
  1: { k: "BEFORE YOU BUY ANYTHING", col: C.ok, rows: ["Dye test · 10 drops, 20 min or overnight", "Colored bowl = the flapper", "Spilling into the overflow = float down", "Refill tube clipped, not shoved down"] },
  2: { k: "CLEAN IT FIRST", col: C.ok, rows: ["Water off · flush", "⅛ turn on the cap", "Rinse the seal", "The cup · 5 seconds · twice"] },
  3: { k: "THE 4 MISTAKES", col: C.red, rows: ["Buying a valve when it was the flapper", "New cap on the old body", 'Height: 3" over the overflow · C.L. 1"', "The wrench: hand tight"] },
  4: { k: "THE LAST ADJUSTMENTS", col: C.amb, rows: ["Refill tube clipped above the water", 'Water ½" below the overflow', '8 turns of the screw = ½"', "A pencil line so you remember"] },
  5: { k: "SEAL OR VALVE", col: C.tur, rows: ["Seal worn → a new seal", "Still running → a whole new valve", "Top and bottom from the same box"] },
  6: { k: "WHILE YOU'RE DOWN THERE", col: C.amb, rows: ["Old plastic hose → braided, about $8", "Knob drips → ⅛ turn on the little nut", "Won't turn → don't force it"] },
};
const Recap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const r = REC[h.part]; const n = r.rows.length, step = Math.min(2.4, (h.out - h.at - 1.5) / n);
  return <><Kick tt={tt} txt={"THE ORDER I USE · " + r.k} col={r.col} />
    <Rows tt={tt} h={h} col={r.col} x={360} y={260} w={1300} gap={140} size={54} rows={r.rows.map((x, i) => ({ at: h.at + 0.3 + i * step, txt: x }))} /></>; }}</Stage>;

// 35 · la colección: 5 tapas reales en abanico
const COVERS = ["cov_ln_toilet", "cov_ln_drain", "cov_ln_leak", "cov_ln_shower", "cov_ln_call"];
const Books: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const a = at(h, "setAt", 0.3);
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

// 36 · páginas reales del libro: cada una entra cuando la nombro
const Pages: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const n = h.imgs.length, W0 = n === 3 ? 470 : n === 4 ? 380 : 560, gap = n >= 3 ? 50 : 110, x0 = 960 - (n * W0 + (n - 1) * gap) / 2;
  return <>{h.imgs.map((id: string, i: number) => { const a = Math.max(0.2 + i * 0.5, h.tAt[i] - h.at), p = phys(tt, a, 6, 0.5);
    return <div key={id} style={{ position: "absolute", left: x0 + i * (W0 + gap), top: n === 4 ? 180 : 120, width: W0, opacity: cl(p * 1.5), transform: `perspective(1600px) translateY(${(1 - p) * 120}px) rotateX(${(1 - p) * 30}deg) rotateZ(${(i - (n - 1) / 2) * 1.5}deg)` }}>
      <Img src={img(id)} style={{ width: W0, height: W0 * 1.294, objectFit: "cover", borderRadius: 6, boxShadow: "0 40px 80px rgba(0,0,0,.7)" }} />
      <div style={{ marginTop: 26, fontFamily: FONT, fontWeight: 800, fontSize: n >= 3 ? 28 : 34, color: C.ink, textAlign: "center", lineHeight: 1.15 }}>{h.tags[i]}</div>
    </div>; })}</>; }}</Stage>;

// 37 · cierre: arena, vaso, 5 segundos · 3 pulgadas y una tuerca a mano
const Close: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => {
  const b = at(h, "valveAt", 2.5);
  return <>
    <Big tt={tt} at={0.2} txt="A grain of sand." y={260} size={96} />
    <Big tt={tt} at={0.8} txt="A plastic cup." y={390} size={96} />
    <Big tt={tt} at={1.4} txt="5 seconds of water." y={520} size={96} col={C.tur2} />
    <Big tt={tt} at={b} txt={'And when it is the valve: 3" and a hand-tight nut.'} y={740} size={52} col={C.amb} />
  </>; }}</Stage>;

// 38 · la pregunta para los comentarios
const Ask: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h}>{(tt) => <>
  <Kick tt={tt} txt="TELL ME IN THE COMMENTS" col={C.tur} />
  {h.q.map((l: string, i: number) => <Big key={i} tt={tt} at={0.3 + i * 0.35} txt={l} y={320 + i * 140} size={i === 1 ? 70 : 90} col={i === 2 ? C.tur2 : C.ink} />)}
</>}</Stage>;

export const HC: Record<string, React.FC<{ t: number; h: H }>> = {
  gallons: Gallons, four: Four, anatomy: Anatomy, twoways: TwoWays, mistake: Mistake, dye: Dye, dyeread: DyeRead, spill: Spill, tube: Tube, coffee: Coffee,
  grit: Grit, kit: Kit, shutoff: Shutoff, eighth: Eighth, stays: Stays, seal: Seal, cup: Cup, fountain: Fountain, decide: Decide, nomix: NoMix, out: Out,
  height: Height, short: Short, twist: Twist, wrench: Wrench, handtight: HandTight, level: Level, hose: Hose, packing: Packing, stuck: Stuck, story: Story,
  bill: Bill, chapter: Chapter, recap: Recap, books: Books, pages: Pages, close: Close, ask: Ask,
};
