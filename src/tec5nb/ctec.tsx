// c5b.tsx · componentes ÚNICOS de tec5nb (sesE, «el relé del refri»). Ninguno repite tec5na (c5a), tec29, rm6na, dur5na ni ap6na.
// Objetos dibujados en código (compresor, relé, rejilla, multímetro); los 3D son CSS 3D real. Cada animación dura ~4,4 s de tt (Stage comprime).
import React from "react";
import { BR, cl, DIM, eio, H, HAND, lerp, MZ, phys, RED, rnd, Stage, Tag, TX, VER } from "./ckit";

type C = React.FC<{ t: number; h: H }>;
const q = (h: H) => (h.q ?? {}) as Record<string, any>;
const ab = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });
const e1 = (tt: number, a: number, d = 0.4) => cl((tt - a) / d);
const COBRE = "linear-gradient(180deg,#7a3e1c,#e3995f 40%,#b8652f 60%,#6e3517)";
const AZ = "#5fc4ff";
const MONO = "ui-monospace, 'DejaVu Sans Mono', monospace";
const SVG: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>{children}</svg>;
const along = (pts: number[][], k: number) => { const s = pts.length - 1, f = cl(k) * s, i = Math.min(s - 1, Math.floor(f)), r = f - i; return [lerp(pts[i][0], pts[i + 1][0], r), lerp(pts[i][1], pts[i + 1][1], r)]; };
const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+$)/g, ",");
const Txt: React.FC<{ x: number; y: number; w?: number; size?: number; col?: string; o?: number; children: React.ReactNode; weight?: number; font?: string }> = ({ x, y, w = 600, size = 56, col = TX, o = 1, children, weight = 900, font }) => (
  <div style={ab(x - w / 2, y, { width: w, textAlign: "center", fontSize: size, fontWeight: weight, color: col, opacity: o, lineHeight: 1.1, textShadow: "0 5px 18px rgba(0,0,0,.65)", fontFamily: font })}>{children}</div>
);

// compresor: la bola negra pesada con sus patas
const Comp: React.FC<{ x: number; y: number; w?: number; glow?: string }> = ({ x, y, w = 420, glow }) => (
  <div style={ab(x - w / 2, y - w * 0.4, { width: w, height: w * 0.8 })}>
    <div style={ab(w * 0.12, w * 0.68, { width: w * 0.16, height: w * 0.1, borderRadius: 8, background: "#141414" })} />
    <div style={ab(w * 0.72, w * 0.68, { width: w * 0.16, height: w * 0.1, borderRadius: 8, background: "#141414" })} />
    <div style={ab(0, 0, { width: w, height: w * 0.72, borderRadius: "48% 48% 38% 38% / 62% 62% 38% 38%", background: glow ?? "radial-gradient(circle at 34% 28%,#6f757e,#20242a 55%,#08090a)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" })} />
    <div style={ab(w * 0.03, w * 0.36, { width: w * 0.94, height: Math.max(6, w * 0.024), borderRadius: 5, background: "rgba(0,0,0,.5)" })} />
  </div>
);
// relé: la piecita negra con sus dos agujeros
const Rele: React.FC<{ x: number; y: number; s?: number; burn?: number; rot?: number }> = ({ x, y, s = 1, burn = 0, rot = 0 }) => (
  <div style={ab(x, y, { width: 220, height: 250, transform: `translate(-50%,-50%) scale(${s}) rotate(${rot}deg)`, borderRadius: 20, background: "linear-gradient(160deg,#42454a,#1a1b1e 60%,#0c0c0d)", boxShadow: "0 24px 50px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.18)" })}>
    {[26, 62, 98].map((y) => <div key={y} style={ab(24, y, { width: 172, height: 14, borderRadius: 7, background: "rgba(0,0,0,.45)", boxShadow: "0 2px 0 rgba(255,255,255,.1)" })} />)}
    <div style={ab(52, 160, { width: 32, height: 32, borderRadius: "50%", background: "#000", boxShadow: "0 0 0 4px #33353a" })} />
    <div style={ab(136, 160, { width: 32, height: 32, borderRadius: "50%", background: "#000", boxShadow: "0 0 0 4px #33353a" })} />
    <div style={ab(-34, 120, { width: 40, height: 16, borderRadius: 3, background: "linear-gradient(#e7ebee,#8b9298)" })} />
    <div style={ab(214, 120, { width: 40, height: 16, borderRadius: 3, background: "linear-gradient(#e7ebee,#8b9298)" })} />
    {burn > 0 && <div style={ab(100, -14, { width: 160, height: 150, borderRadius: "50%", background: "radial-gradient(circle,#6a3410 0,#2a1406 45%,transparent 70%)", opacity: burn })} />}
  </div>
);
const Cyl: React.FC<{ r: number; hgt: number; n?: number; face: (i: number) => React.CSSProperties }> = ({ r, hgt, n = 28, face }) => {
  const w = 2 * r * Math.tan(Math.PI / n) + 1.5;
  return <>{Array.from({ length: n }, (_, i) => <div key={i} style={{ position: "absolute", left: -w / 2, top: -hgt / 2, width: w, height: hgt, transform: `rotateY(${(360 / n) * i}deg) translateZ(${r}px)`, ...face(i) }} />)}</>;
};
const Disc: React.FC<{ r: number; y: number; bg: string }> = ({ r, y, bg }) => <div style={{ position: "absolute", left: -r, top: -r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: bg, transform: `translateY(${y}px) rotateX(90deg)` }} />;
const Scene: React.FC<{ x?: number; y?: number; rx: number; ry: number; s?: number; children: React.ReactNode }> = ({ x = 960, y = 540, rx, ry, s = 1, children }) => (
  <div style={ab(x, y, { perspective: 1600, perspectiveOrigin: "50% 40%" })}><div style={{ transformStyle: "preserve-3d", transform: `scale(${s}) rotateX(${rx}deg) rotateY(${ry}deg)` }}>{children}</div></div>
);

// 1 · la onda del ruido: clic, zumbido, tres minutos de silencio, clic
const OndaClic: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#0e1a22" mesa={false}>{(tt) => {
  const N = 110, ph = eio(tt, 0.2, 4.0) * N;
  const amp = (i: number) => (i === 14 || i === 15 || i === 88 || i === 89) ? 1 : (i > 15 && i < 30) ? 0.3 + 0.13 * Math.sin(i * 2.3) : i === 31 ? 0.9 : 0.03 + 0.02 * rnd(i);
  return <>
    <div style={ab(160, 280, { width: 1600, height: 520, borderRadius: 24, background: "rgba(6,14,20,.78)", border: "2px solid rgba(95,196,255,.28)" })} />
    {Array.from({ length: N }, (_, i) => { const on = i < ph, a = amp(i) * 220; return <div key={i} style={ab(190 + i * 14, 540 - a, { width: 8, height: 2 * a + 4, borderRadius: 4, background: on ? (a > 150 ? MZ : AZ) : "rgba(95,196,255,.14)" })} />; })}
    <div style={ab(190 + ph * 14, 296, { width: 4, height: 488, background: "#fff", opacity: 0.85, boxShadow: "0 0 18px #fff" })} />
    <Tag tt={tt} at={0.7} x={400} y={210} txt="CLIC" col={MZ} size={72} />
    <Tag tt={tt} at={1.3} x={510} y={870} txt="ZUMBIDO" col={AZ} size={60} />
    <div style={ab(190 + 34 * 14, 820, { width: 53 * 14, height: 4, background: DIM, opacity: e1(tt, 2.3) })} />
    <Tag tt={tt} at={2.5} x={1030} y={880} txt="3 MINUTOS" col={TX} size={60} />
    <Tag tt={tt} at={3.7} x={1436} y={210} txt="CLIC" col={MZ} size={72} />
  </>;
}}</Stage>;

// 2 · el refri en corte: el calor sale de la comida, baja al compresor y se va por la rejilla de atrás
const FlujoCalor: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#14222c" mesa={false}>{(tt) => {
  const P = [[600, 340], [600, 620], [790, 620], [790, 900], [1010, 900], [1010, 260], [1070, 260]];
  return <>
    <div style={ab(360, 120, { width: 560, height: 860, borderRadius: 26, background: "linear-gradient(#f4f6f7,#cfd6da)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" })}>
      <div style={ab(34, 34, { width: 492, height: 240, borderRadius: 12, background: "linear-gradient(#b9e2f7,#7fc0e6)" })} />
      <div style={ab(34, 296, { width: 492, height: 400, borderRadius: 12, background: "linear-gradient(#dcf0fb,#a8d6ee)" })} />
      {[0, 1].map((i) => <div key={i} style={ab(34, 420 + i * 130, { width: 492, height: 8, background: "rgba(255,255,255,.9)" })} />)}
      <div style={ab(90, 350, { width: 150, height: 68, borderRadius: 10, background: "#c8553d" })} />
      <div style={ab(290, 320, { width: 80, height: 98, borderRadius: 8, background: "#f7f2e4" })} />
      <div style={ab(120, 478, { width: 230, height: 72, borderRadius: 40, background: "#7fa650" })} />
      <div style={ab(0, 716, { width: 560, height: 144, borderRadius: "0 0 26px 26px", background: "#2a3036" })} />
    </div>
    <Comp x={790} y={900} w={190} />
    <div style={ab(975, 200, { width: 76, height: 700, background: "repeating-linear-gradient(0deg,#9aa1a8 0 9px,transparent 9px 36px)", borderLeft: "7px solid #9aa1a8", borderRight: "7px solid #9aa1a8" })} />
    {Array.from({ length: 20 }, (_, i) => { const k = (tt * 0.27 + i / 20) % 1, [x, y] = along(P, k); return <div key={i} style={ab(x - 11, y - 11, { width: 22, height: 22, borderRadius: "50%", background: "radial-gradient(circle,#ffd27a,#f14536 70%)", boxShadow: "0 0 18px #f14536", opacity: e1(tt, 0.5) })} />; })}
    {Array.from({ length: 5 }, (_, i) => { const k = (tt * 0.5 + i / 5) % 1; return <div key={i} style={ab(1090 + k * 420, 300 + i * 120, { width: 90, height: 140, borderRight: "9px solid rgba(241,69,54,.75)", borderRadius: "50%", opacity: e1(tt, 2.0) * (1 - k) })} />; })}
    <Tag tt={tt} at={0.8} x={640} y={72} txt="CALOR" col={RED} size={66} />
    <Tag tt={tt} at={2.4} x={1460} y={210} txt="AFUERA" col={MZ} size={74} />
    <Tag tt={tt} at={3.5} x={1460} y={890} txt="NO HACE FRÍO" col={TX} size={62} />
  </>;
}}</Stage>;

// 3 · el corazón: el compresor gira en 3D y el gas corre por los tubos de cobre
const Compresor3D: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#1b2229">{(tt) => {
  const ry = 16 + tt * 14, beat = 1 + 0.018 * Math.max(0, Math.sin(tt * 7));
  return <>
    <div style={ab(1130, 560, { width: 640, height: 34, borderRadius: 17, background: COBRE, boxShadow: "0 14px 24px rgba(0,0,0,.5)" })} />
    <div style={ab(140, 660, { width: 640, height: 34, borderRadius: 17, background: COBRE, boxShadow: "0 14px 24px rgba(0,0,0,.5)" })} />
    <Scene x={960} y={560} rx={-13} ry={ry} s={beat * 1.32}>
      {Array.from({ length: 19 }, (_, j) => { const y = -200 + j * 20, R = y < 0 ? 215 * Math.sqrt(Math.max(0.02, 1 - (y / 206) ** 2)) : 215 * (1 - 0.1 * (y / 170) ** 2), v = 1 - (j / 18) * 0.65;
        return <div key={j} style={{ position: "absolute", transformStyle: "preserve-3d", transform: `translateY(${y}px)` }}><Cyl r={R} hgt={22} n={24} face={(i) => ({ background: `hsl(214,7%,${(j === 10 ? 4 : 7) + 40 * v * Math.max(0, Math.cos(((i / 24) * 360 + ry - 32) * Math.PI / 180)) ** 2}%)` })} /></div>; })}
      <div style={{ position: "absolute", left: -70, top: 10, width: 140, height: 150, borderRadius: 14, background: "linear-gradient(#34373c,#111214)", boxShadow: "inset 0 2px 0 rgba(255,255,255,.2)", transform: "translateZ(222px)" }}>
        {[20, 58, 96].map((y) => <div key={y} style={ab(20, y, { width: 100, height: 12, borderRadius: 6, background: "rgba(255,255,255,.14)" })} />)}
      </div>
    </Scene>
    {Array.from({ length: 7 }, (_, i) => { const k = (tt * 0.42 + i / 7) % 1; return <div key={i} style={ab(1160 + k * 560, 563, { width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderLeft: `26px solid ${AZ}`, opacity: Math.sin(k * Math.PI) })} />; })}
    {Array.from({ length: 7 }, (_, i) => { const k = (tt * 0.42 + i / 7) % 1; return <div key={i} style={ab(170 + k * 560, 663, { width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderLeft: "26px solid #ffb35c", opacity: Math.sin(k * Math.PI) })} />; })}
    <Tag tt={tt} at={1.0} x={960} y={150} txt="EL CORAZÓN" col={MZ} size={78} />
    <Tag tt={tt} at={2.8} x={960} y={950} txt="COMPRESOR" col={TX} size={66} />
  </>;
}}</Stage>;

// 4 · la patadita: osciloscopio con el pico de corriente; el relé se aparta
const Patada: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#0f1a16" mesa={false}>{(tt) => {
  const rev = eio(tt, 0.3, 3.5), X = (x: number) => 210 + x * 1500, Y = (i: number) => 850 - i * 560;
  const I = (x: number) => x < 0.1 ? 0 : x < 0.14 ? (x - 0.1) / 0.04 : x < 0.36 ? 0.26 + 0.74 * Math.exp(-(x - 0.14) * 14) : 0.26 + 0.012 * Math.sin(x * 90);
  let d = ""; for (let k = 0; k <= 300; k++) { const x = (k / 300) * rev; d += `${k ? "L" : "M"}${X(x).toFixed(1)},${Y(I(x)).toFixed(1)} `; }
  const ang = -36 * e1(tt, 2.3, 0.35);
  return <>
    <div style={ab(210, 240, { width: 1500, height: 640, borderRadius: 18, background: "repeating-linear-gradient(0deg,rgba(127,224,168,.14) 0 2px,transparent 2px 80px),repeating-linear-gradient(90deg,rgba(127,224,168,.14) 0 2px,transparent 2px 100px),#07120d", border: "3px solid rgba(127,224,168,.4)" })} />
    <SVG><path d={d} fill="none" stroke={MZ} strokeWidth={9} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 12px ${MZ})` }} /></SVG>
    <div style={ab(1270, 300, { width: 400, height: 170, borderRadius: 16, background: "rgba(0,0,0,.6)", border: "2px solid rgba(255,255,255,.2)" })}>
      <div style={ab(60, 96, { width: 26, height: 26, borderRadius: "50%", background: "#d9dee2" })} />
      <div style={ab(310, 96, { width: 26, height: 26, borderRadius: "50%", background: "#d9dee2" })} />
      <div style={ab(72, 104, { width: 252, height: 10, borderRadius: 5, background: ang < -4 ? RED : VER, transformOrigin: "0 50%", transform: `rotate(${ang}deg)` })} />
    </div>
    <Tag tt={tt} at={0.95} x={520} y={190} txt="PATADITA" col={MZ} size={72} />
    <Tag tt={tt} at={1.7} x={640} y={940} txt="1 O 2 SEG" col={TX} size={62} />
    <Tag tt={tt} at={2.7} x={1470} y={540} txt="SE APARTA" col={VER} size={62} />
  </>;
}}</Stage>;

// 5 · cuántas veces arranca: tres contadores que corren
const Arranques: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#201a10">{(tt) => {
  const rows: [string, number][] = [["AL DÍA", 20], ["AL AÑO", 7300], ["EN 10 AÑOS", 73000]];
  return <>{rows.map(([l, n], i) => { const k = eio(tt, 0.3 + i * 1.05, 1.4 + i * 1.05), v = n * k, y = 170 + i * 250, on = e1(tt, 0.1 + i * 1.05);
    return <div key={i} style={{ opacity: on }}>
      <div style={ab(220, y + 30, { width: 620, fontSize: 70, fontWeight: 900, color: TX, textShadow: "0 5px 18px rgba(0,0,0,.6)" })}>{l}</div>
      <div style={ab(830, y, { width: 870, height: 130, borderRadius: 18, background: "linear-gradient(#0e0e0e,#2b2b2b 50%,#0e0e0e)", boxShadow: "inset 0 8px 16px #000, 0 18px 30px rgba(0,0,0,.5)", fontFamily: MONO, fontSize: 104, fontWeight: 900, color: i === 2 ? RED : "#f2efe6", textAlign: "right", lineHeight: "130px", paddingRight: 34, boxSizing: "border-box" })}>{fmt(v)}</div>
      <div style={ab(830, y + 146, { width: 870 * (Math.log10(1 + v) / Math.log10(73001)), height: 12, borderRadius: 6, background: i === 2 ? RED : MZ })} />
    </div>; })}
    <Tag tt={tt} at={3.7} x={960} y={960} txt="ARRANQUES" col={MZ} size={72} />
  </>;
}}</Stage>;

// 6 · el protector térmico: la temperatura sube, la lámina se dobla y corta; se enfría y vuelve
const Termico: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#231411" mesa={false}>{(tt) => {
  const temp = tt < 2.2 ? lerp(0.15, 0.96, eio(tt, 0.3, 2.05)) : lerp(0.96, 0.42, eio(tt, 2.4, 3.8));
  const open = e1(tt, 2.0, 0.28) - e1(tt, 3.6, 0.28), ang = -30 * cl(open), cerrado = ang > -4, H0 = 640;
  const spark = tt > 2.0 && tt < 2.35;
  return <>
    <div style={ab(250, 190, { width: 96, height: H0 + 40, borderRadius: 48, background: "rgba(255,255,255,.14)", border: "5px solid rgba(255,255,255,.55)" })} />
    <div style={ab(274, 210 + H0 * (1 - temp), { width: 48, height: H0 * temp, borderRadius: 24, background: `linear-gradient(#ffb04a,${RED})`, boxShadow: `0 0 26px ${RED}` })} />
    <div style={ab(224, 210 + H0 * 0.14, { width: 150, height: 6, background: MZ })} />
    <Txt x={298} y={880} w={380} size={46} col={DIM}>{Math.round(lerp(30, 118, temp))} °C</Txt>
    <div style={ab(620, 560, { width: 390, height: 12, background: "#b9702f" })} />
    <div style={ab(1370, 560, { width: 390, height: 12, background: "#b9702f" })} />
    <div style={ab(978, 536, { width: 58, height: 58, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#eceff1,#7d858c)" })} />
    <div style={ab(1340, 536, { width: 58, height: 58, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#eceff1,#7d858c)" })} />
    <div style={ab(1006, 554, { width: 362, height: 24, borderRadius: 12, background: `linear-gradient(90deg,${RED},#d9dee2)`, transformOrigin: "0 50%", transform: `rotate(${ang}deg)`, boxShadow: "0 12px 20px rgba(0,0,0,.5)" })} />
    {spark && <div style={ab(1300, 480, { width: 130, height: 130, background: "radial-gradient(circle,#fff 0,#ffe27a 30%,transparent 68%)" })} />}
    {cerrado && Array.from({ length: 12 }, (_, i) => { const k = (tt * 0.8 + i / 12) % 1; return <div key={i} style={ab(620 + k * 1130, 558, { width: 16, height: 16, borderRadius: "50%", background: MZ, boxShadow: `0 0 12px ${MZ}` })} />; })}
    <Tag tt={tt} at={0.5} x={1190} y={250} txt="EL GUARDIA" col={TX} size={72} />
    {tt < 3.6 && <Tag tt={tt} at={2.1} x={1190} y={820} txt="CORTA" col={RED} size={92} />}
    <Tag tt={tt} at={3.75} x={1190} y={960} txt="SE ENFRÍA" col={AZ} size={60} />
  </>;
}}</Stage>;

// 7 · el círculo vicioso: intenta, zumba, se calienta, corta, espera… y otra vez
const Ciclo: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#161a26" mesa={false}>{(tt) => {
  const L = ["INTENTA", "ZUMBA", "SE CALIENTA", "CLIC: CORTA", "ESPERA"], R = 345, cx = 960, cy = 560, n = L.length, a = tt * 2.5;
  const cur = Math.floor((a / (2 * Math.PI)) * n) % n, vuelta = Math.floor(a / (2 * Math.PI)) + 1, pos = (i: number) => { const g = (i / n) * 2 * Math.PI - Math.PI / 2; return [cx + R * Math.cos(g), cy + R * Math.sin(g)]; };
  const dx = cx + R * Math.cos(a - Math.PI / 2), dy = cy + R * Math.sin(a - Math.PI / 2);
  return <>
    <SVG><circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,.2)" strokeWidth={14} strokeDasharray="30 22" /></SVG>
    {L.map((l, i) => { const [x, y] = pos(i), on = i === cur; return <div key={i} style={ab(x - 112, y - 112, { width: 224, height: 224, borderRadius: "50%", background: on ? (i === 3 ? RED : MZ) : "rgba(26,30,42,.95)", border: `6px solid ${on ? "#fff" : "rgba(255,255,255,.35)"}`, color: on ? "#14110b" : TX, fontSize: 38, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", lineHeight: 1.05, transform: `scale(${on ? 1.1 : 1})` })}>{l}</div>; })}
    <div style={ab(dx - 22, dy - 22, { width: 44, height: 44, borderRadius: "50%", background: "#fff", boxShadow: "0 0 26px #fff" })} />
    <Txt x={cx} y={cy - 70} w={420} size={52} col={DIM}>VUELTA</Txt>
    <Txt x={cx} y={cy - 12} w={420} size={120} col={MZ}>{vuelta}</Txt>
  </>;
}}</Stage>;

// 8 · la llamada con don Ernesto: tres preguntas en burbujas
const Chat: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#10201c" mesa={false}>{(tt) => {
  const P: [string, string][] = q(h).pairs ?? [["¿La luz de adentro prende?", "Sí, prende"], ["¿Oye un clic atrás, abajo?", "Sí, un tac… y nada"], ["¿Atrás está frío o tibio?", "Fría, completamente"]];
  return <>
    <div style={ab(490, 40, { width: 940, height: 1000, borderRadius: 54, background: "#0d1417", border: "10px solid #2a3338", boxShadow: "0 40px 90px rgba(0,0,0,.7)" })}>
      <div style={ab(0, 0, { width: 920, height: 120, borderRadius: "44px 44px 0 0", background: "#1a2b2a", display: "flex", alignItems: "center", paddingLeft: 40, fontSize: 48, fontWeight: 900, color: TX })}>{q(h).title ?? "Don Ernesto · Puebla"}</div>
      {P.flatMap(([a, b], i) => [[a, 0, i * 2], [b, 1, i * 2 + 1]] as [string, number, number][]).map(([txt, side, k]) => { const at = 0.35 + k * 0.62, s = phys(tt, at, 8, 0.55), y = 150 + k * 138;
        return <div key={k} style={ab(side ? 40 : 300, y, { maxWidth: 590, padding: "22px 34px", borderRadius: 30, fontSize: 44, fontWeight: 800, background: side ? "#f4f1e7" : "#1f6f5c", color: side ? "#1b1b18" : "#f4f1e7", opacity: cl(s * 2), transform: `translateY(${(1 - s) * 34}px) scale(${0.9 + 0.1 * s})`, transformOrigin: side ? "0 0" : "100% 0", whiteSpace: "nowrap" })}>{txt}</div>; })}
    </div>
    <Tag tt={tt} at={4.0} x={1700} y={520} txt="EL RELÉ" col={MZ} size={62} />
  </>;
}}</Stage>;

// 9 · la balanza: 15 mil de refri nuevo contra 200 pesos de relé
const Balanza: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1a1a22">{(tt) => {
  const a = (12 * Math.PI / 180) * phys(tt, 1.0, 5, 0.34), L = 540, cx = 960, cy = 300;
  const lx = cx - L * Math.cos(a), ly = cy + L * Math.sin(a), rx = cx + L * Math.cos(a), ry = cy - L * Math.sin(a), Dr = 240;
  const Pan: React.FC<{ x: number; y: number; children: React.ReactNode }> = ({ x, y, children }) => <>
    <div style={ab(x - 2, y, { width: 4, height: Dr, background: "#a9b0b5" })} />
    <div style={ab(x - 190, y + Dr, { width: 380, height: 30, borderRadius: "0 0 190px 190px", background: "linear-gradient(#d8c07a,#8f7433)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" })} />
    {children}
  </>;
  return <>
    <div style={ab(cx - 18, cy, { width: 36, height: 690, background: "linear-gradient(90deg,#8f7433,#e2c98a,#8f7433)" })} />
    <div style={ab(cx - 170, 970, { width: 340, height: 40, borderRadius: 12, background: "linear-gradient(#8f7433,#574515)" })} />
    <div style={ab(cx - L, cy - 11, { width: 2 * L, height: 22, borderRadius: 11, background: "linear-gradient(#e2c98a,#8f7433)", transform: `rotate(${-a * 180 / Math.PI}deg)` })} />
    <div style={ab(cx - 30, cy - 30, { width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#f1dda4,#8f7433)" })} />
    <Pan x={lx} y={ly}><div style={ab(lx - 72, ly + Dr - 190, { width: 144, height: 190, borderRadius: 12, background: "linear-gradient(#f4f6f7,#c9d0d4)" })}><div style={ab(0, 60, { width: 144, height: 5, background: "#8b9298" })} /></div><Txt x={lx} y={ly + Dr + 44} w={380} size={60} col={RED}>$15,000</Txt></Pan>
    <Pan x={rx} y={ry}><Rele x={rx} y={ry + Dr - 42} s={0.34} burn={0.8} /><Txt x={rx} y={ry + Dr + 44} w={380} size={60} col={VER}>$200</Txt></Pan>
    <Tag tt={tt} at={3.3} x={960} y={100} txt="UNA PIEZA" col={MZ} size={72} />
  </>;
}}</Stage>;

// 10 · antes del relé: cuatro interruptores que se van pasando a verde
const Interruptores: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#1a1d1f" mesa={false}>{(tt) => {
  const L: string[] = q(h).items ?? ["ENCHUFE", "TERMOSTATO", "REJILLA", "VENTILADOR"];
  return <>{L.map((l, i) => { const x = 330 + i * 420, at = 0.55 + i * 0.85, f = eio(tt, at, at + 0.3), on = f > 0.5;
    return <div key={i}>
      <Txt x={x} y={150} w={400} size={120} col={on ? VER : DIM}>{i + 1}</Txt>
      <div style={ab(x - 150, 300, { width: 300, height: 420, borderRadius: 26, background: "linear-gradient(#f2efe6,#c8c3b4)", boxShadow: on ? `0 0 0 8px ${VER}, 0 30px 50px rgba(0,0,0,.6)` : "0 30px 50px rgba(0,0,0,.6)" })}>
        <div style={ab(100, 60, { width: 100, height: 300, borderRadius: 16, background: "#3a3a36", boxShadow: "inset 0 6px 12px #000" })} />
        <div style={ab(112, lerp(190, 74, f), { width: 76, height: 96, borderRadius: 14, background: on ? `linear-gradient(#a9e8bf,${VER})` : "linear-gradient(#f4f4f0,#b5b5ad)", boxShadow: "0 8px 12px rgba(0,0,0,.5)" })} />
      </div>
      <Txt x={x} y={760} w={410} size={46}>{l}</Txt>
    </div>; })}
    <Tag tt={tt} at={3.9} x={960} y={930} txt="LO SIMPLE" col={MZ} size={70} />
  </>;
}}</Stage>;

// 11 · la rejilla tapada: un cepillo barre el polvo y el calor por fin sale
const Rejilla: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#20201c">{(tt) => {
  const bx = lerp(250, 1670, eio(tt, 1.0, 3.3)), W = 1420;
  return <>
    <div style={ab(250, 170, { width: W, height: 640, borderRadius: 14, overflow: "hidden", background: "#24272b", boxShadow: "0 40px 70px rgba(0,0,0,.6)" })}>
      {Array.from({ length: 8 }, (_, i) => <div key={i} style={ab(0, 30 + i * 78, { width: W, height: 24, borderRadius: 12, background: "linear-gradient(#c5cbd1,#6a7178 60%,#99a0a7)" })} />)}
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg,#858c93 0 6px,transparent 6px 40px)" }} />
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${bx - 250}px)` }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(146,136,118,.92)" }} />
        {Array.from({ length: 110 }, (_, i) => <div key={i} style={ab(rnd(i) * W, rnd(i + 5) * 640, { width: 40 + rnd(i + 2) * 110, height: 5 + rnd(i + 1) * 9, borderRadius: 8, background: i % 3 ? "#6c6455" : "#b3a990", transform: `rotate(${rnd(i + 8) * 170}deg)` })} />)}
      </div>
    </div>
    <div style={ab(bx - 40, 130, { width: 80, height: 720, borderRadius: 16, background: "repeating-linear-gradient(0deg,#3c2b1b 0 7px,#7c5b36 7px 12px)", boxShadow: "0 20px 40px rgba(0,0,0,.6)" })} />
    <div style={ab(bx - 20, 840, { width: 40, height: 240, borderRadius: 14, background: "linear-gradient(90deg,#a8452c,#e0755a,#a8452c)" })} />
    {tt > 3.0 && Array.from({ length: 9 }, (_, i) => { const k = ((tt - 3.0) * 0.8 + i / 9) % 1; return <div key={i} style={ab(330 + i * 150, 760 - k * 660, { width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle,rgba(241,120,54,.55),transparent 70%)", opacity: 1 - k })} />; })}
    <Tag tt={tt} at={0.4} x={1500} y={100} txt="TAPADO" col={RED} size={74} />
    <Tag tt={tt} at={3.5} x={500} y={100} txt="YA RESPIRA" col={VER} size={72} />
  </>;
}}</Stage>;

// 12 · cámara térmica sobre el compresor: sube la temperatura
const Termografia: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#14081f" mesa={false}>{(tt) => {
  const k = eio(tt, 0.3, 3.0), mix = (a: number[], b: number[], z: number) => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], z))).join(",")})`;
  const c1 = k < 0.5 ? mix([70, 60, 200], [255, 210, 40], k * 2) : mix([255, 210, 40], [255, 250, 235], (k - 0.5) * 2), c2 = k < 0.5 ? mix([30, 20, 120], [240, 90, 30], k * 2) : mix([240, 90, 30], [235, 30, 30], (k - 0.5) * 2), c3 = k < 0.5 ? mix([20, 10, 70], [110, 20, 120], k * 2) : mix([110, 20, 120], [150, 20, 60], (k - 0.5) * 2);
  return <>
    <div style={ab(200, 110, { width: 1520, height: 860, borderRadius: 14, background: "radial-gradient(ellipse at 50% 60%,#2a0e4d,#0c0420 75%)" })} />
    <Comp x={880} y={570} w={720} glow={`radial-gradient(circle at 45% 42%,${c1},${c2} 42%,${c3} 82%)`} />
    {[[230, 140, "0 0"], [1630, 140, "90deg"], [230, 880, "-90deg"], [1630, 880, "180deg"]].map(([x, y, r], i) => <div key={i} style={ab(x as number, y as number, { width: 60, height: 60, borderTop: "7px solid #fff", borderLeft: "7px solid #fff", transform: `rotate(${r === "0 0" ? "0deg" : r})` })} />)}
    <div style={ab(860, 300, { width: 40, height: 4, background: "#fff" })} /><div style={ab(878, 282, { width: 4, height: 40, background: "#fff" })} />
    <div style={ab(1320, 180, { width: 300, height: 110, borderRadius: 10, background: "rgba(0,0,0,.65)", color: k > 0.6 ? "#ffdf6e" : "#fff", fontFamily: MONO, fontWeight: 900, fontSize: 80, textAlign: "center", lineHeight: "110px" })}>{Math.round(lerp(26, 92, k))}°C</div>
    <div style={ab(1560, 340, { width: 40, height: 500, borderRadius: 8, background: "linear-gradient(#fff6e0,#ffd22a,#f05a1e,#6e1478,#1e146e)" })} />
    <div style={ab(1540, lerp(820, 345, k), { width: 80, height: 6, background: "#fff" })} />
    <Tag tt={tt} at={3.1} x={880} y={960} txt="NO AGUANTAS" col={MZ} size={66} />
  </>;
}}</Stage>;

// 13 · los tres pernitos: el relé sale derecho; la palanca, jamás
const Pernos3D: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1a2026" mesa={false}>{(tt) => {
  const sale = eio(tt, 0.5, 1.7), mala = e1(tt, 2.5, 0.35), gas = e1(tt, 3.2, 0.4);
  const pin = [[810, 450], [1110, 450], [960, 650]];
  return <>
    <div style={ab(560, 170, { width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle at 36% 30%,#555b63,#191c20 60%,#08090a)", boxShadow: "0 40px 90px rgba(0,0,0,.7)" })} />
    <div style={ab(720, 330, { width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,#9aa1a7,#5c636a)", boxShadow: "inset 0 10px 24px rgba(0,0,0,.6)" })} />
    {pin.map(([x, y], i) => <div key={i} style={ab(x - 44, y - 44, { width: 88, height: 88, borderRadius: "50%", background: "radial-gradient(circle at 38% 30%,#fff,#b4bbc1 45%,#5b6167)", boxShadow: "0 12px 18px rgba(0,0,0,.6)" })} />)}
    {sale < 1 && <div style={{ opacity: 1 - cl((sale - 0.62) / 0.38) }}><Rele x={960} y={lerp(560, 520, sale)} s={lerp(1.6, 3.6, sale)} /></div>}
    {sale >= 1 && mala > 0 && <div style={{ opacity: mala }}>
      <div style={ab(330, 760, { width: 660, height: 34, borderRadius: 12, background: "linear-gradient(#d9dee2,#7b838a)", transformOrigin: "100% 50%", transform: "rotate(14deg)" })} />
      <div style={ab(130, 760, { width: 240, height: 66, borderRadius: 20, background: "linear-gradient(#e0755a,#a8452c)", transform: "rotate(14deg)", transformOrigin: "100% 50%" })} />
      <div style={ab(1150, 330, { width: 360, height: 360, transform: `scale(${phys(tt, 2.75, 7, 0.5)})` })}>
        <div style={ab(150, -30, { width: 60, height: 420, borderRadius: 30, background: RED, transform: "rotate(45deg)" })} />
        <div style={ab(150, -30, { width: 60, height: 420, borderRadius: 30, background: RED, transform: "rotate(-45deg)" })} />
      </div>
      {Array.from({ length: 8 }, (_, i) => { const k = ((tt - 3.2) * 0.7 + i / 8) % 1; return <div key={i} style={ab(1010 + k * 200 + i * 6, 620 - k * 200 - i * 8, { width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle,rgba(190,230,255,.75),transparent 70%)", opacity: gas * (1 - k) })} />; })}
    </div>}
    <Tag tt={tt} at={1.1} x={1560} y={250} txt="DERECHO" col={VER} size={80} />
    <Tag tt={tt} at={2.7} x={500} y={250} txt="SIN PALANCA" col={RED} size={70} />
    <Tag tt={tt} at={3.5} x={1560} y={850} txt="GAS" col={AZ} size={84} />
  </>;
}}</Stage>;

// 14 · la foto que te salva: visor, dos disparos, de lejos y de cerca
const Visor: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#202025">{(tt) => {
  const zoom = 1 + 0.75 * eio(tt, 1.9, 2.7), f1 = Math.max(0, 1 - Math.abs(tt - 1.55) / 0.18), f2 = Math.max(0, 1 - Math.abs(tt - 3.0) / 0.18), brk = lerp(1.5, 1, eio(tt, 0.3, 1.0));
  return <>
    <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "1020px 560px" }}>
      <Comp x={760} y={600} w={700} />
      <Rele x={1100} y={590} s={0.9} burn={0.5} />
      <SVG>
        <path d="M1090 460 C1160 300,1400 290,1720 240" fill="none" stroke="#d83a2f" strokeWidth={15} strokeLinecap="round" />
        <path d="M1130 480 C1240 420,1440 420,1720 390" fill="none" stroke="#2f7bd8" strokeWidth={15} strokeLinecap="round" />
        <path d="M1160 600 C1320 640,1460 620,1720 610" fill="none" stroke="#efeae0" strokeWidth={15} strokeLinecap="round" />
      </SVG>
    </div>
    <div style={{ position: "absolute", inset: 0, transform: `scale(${brk})` }}>
      {[[300, 170, 0], [1560, 170, 90], [1560, 850, 180], [300, 850, 270]].map(([x, y, r], i) => <div key={i} style={ab(x, y, { width: 90, height: 90, borderTop: "9px solid #fff", borderLeft: "9px solid #fff", transform: `rotate(${r}deg)` })} />)}
    </div>
    <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(f1, f2) * 0.95 }} />
    {[["LEJOS", 1.6, 250], ["CERCA", 3.05, 620]].map(([l, at, x], i) => { const s = phys(tt, at as number, 7, 0.55); return <div key={i} style={ab(x as number, 830, { width: 330, height: 210, borderRadius: 10, background: i ? "linear-gradient(135deg,#2a2d31,#121316)" : "linear-gradient(135deg,#3c4046,#1c1e22)", border: "9px solid #f4f1e7", color: TX, fontWeight: 900, fontSize: 56, display: "flex", alignItems: "center", justifyContent: "center", opacity: cl(s * 2), transform: `translateY(${(1 - s) * 60}px) rotate(${i ? 3 : -3}deg)`, boxShadow: "0 20px 34px rgba(0,0,0,.6)" })}>{l as string}</div>; })}
    <Tag tt={tt} at={3.7} x={1490} y={930} txt="TE SALVA" col={MZ} size={76} />
  </>;
}}</Stage>;

// 15 · la prueba de un minuto: mirar, oler y agitar, con reloj
const Sentidos: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1f1712" mesa={false}>{(tt) => {
  const L = ["MÍRALO", "HUÉLELO", "AGÍTALO"], sg = Math.max(0, Math.round(60 * (1 - eio(tt, 0.2, 4.1))));
  const Icon = (i: number, on: number) => i === 0
    ? <><div style={ab(70, 110, { width: 300, height: 160, borderRadius: "50%", background: "#f4f1e7", boxShadow: "inset 0 -10px 18px rgba(0,0,0,.25)" })} /><div style={ab(170, 130, { width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#6aa4c8,#1c3b52)" })} /><div style={ab(204, 164, { width: 52, height: 52, borderRadius: "50%", background: "#0a0a0b" })} /></>
    : i === 1
    ? <SVG><path d="M220 60 C210 150,160 210,150 250 C146 290,190 300,220 286 C250 300,296 290,290 250 C280 210,230 150,220 60 Z" fill="#d9a074" stroke="#8f5f3a" strokeWidth={7} />{[0, 1, 2].map((k) => <path key={k} d={`M${160 + k * 60} ${90 - 30 * ((tt * 0.8 + k * 0.3) % 1)} q18 -22 0 -44 q-18 -22 0 -44`} fill="none" stroke="#cfd3d6" strokeWidth={8} opacity={on * 0.75} />)}</SVG>
    : <div style={ab(220, 180, { transform: `rotate(${on * 18 * Math.sin(tt * 26)}deg)` })}><Rele x={0} y={0} s={0.9} burn={0.7} /></div>;
  return <>
    <div style={ab(790, 40, { width: 340, height: 130, borderRadius: 22, background: "#0d0d0d", border: "5px solid #3a3a36", color: sg < 12 ? RED : MZ, fontFamily: MONO, fontWeight: 900, fontSize: 96, textAlign: "center", lineHeight: "120px" })}>{Math.floor(sg / 60)}:{String(sg % 60).padStart(2, "0")}</div>
    {L.map((l, i) => { const at = 0.35 + i * 1.15, f = eio(tt, at, at + 0.5), on = tt > at + 0.4 ? 1 : 0, x = 110 + i * 590; return <div key={i} style={ab(x, 240, { width: 520, height: 700, perspective: 1200 })}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: "linear-gradient(#2d2a24,#16140f)", border: `5px solid ${on ? MZ : "rgba(255,255,255,.2)"}`, boxShadow: "0 30px 60px rgba(0,0,0,.6)", transform: `rotateY(${(1 - f) * 90}deg)`, opacity: cl(f * 3) }}>
        <div style={ab(40, 80, { width: 440, height: 380 })}>{Icon(i, on)}</div>
        <Txt x={260} y={510} w={500} size={78} col={MZ}>{l}</Txt>
        <Txt x={260} y={600} w={500} size={60} col={DIM}>{i + 1}</Txt>
      </div></div>; })}
  </>;
}}</Stage>;

// 16 · la maraca: relé sano con su pastilla entera y relé quemado con la pastilla en pedazos
const Maraca: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#1d1a14">{(tt) => {
  const shk = tt > 1.3 ? 12 * Math.sin(tt * 30) : 0;
  const Body: React.FC<{ x: number; rot: number; children: React.ReactNode }> = ({ x, rot, children }) => <div style={ab(x - 230, 200, { width: 460, height: 600, borderRadius: 44, background: "linear-gradient(160deg,#42454a,#17181b 60%)", boxShadow: "0 40px 70px rgba(0,0,0,.6)", transform: `rotate(${rot}deg)` })}>
    <div style={ab(70, 110, { width: 320, height: 370, borderRadius: 28, background: "linear-gradient(#e0dfd6,#a9a79c)", boxShadow: "inset 0 10px 22px rgba(0,0,0,.45)" })}>{children}</div>
  </div>;
  return <>
    <Body x={540} rot={0}><div style={ab(70, 95, { width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#d7c7a1,#94815a)", boxShadow: "0 8px 12px rgba(0,0,0,.4)" })} /></Body>
    <Body x={1380} rot={shk}>{Array.from({ length: 9 }, (_, i) => { const b = tt > 1.3 ? Math.abs(Math.sin(tt * 16 + i * 1.4)) : 0; return <div key={i} style={ab(30 + rnd(i) * 220, 300 - b * (100 + rnd(i + 3) * 180) - rnd(i + 1) * 30, { width: 34 + rnd(i + 2) * 44, height: 28 + rnd(i + 6) * 34, background: "linear-gradient(#d7c7a1,#7e6d49)", clipPath: "polygon(10% 0,100% 18%,80% 100%,0 72%)", transform: `rotate(${i * 70 + b * 120}deg)` })} />; })}</Body>
    {tt > 1.3 && [0, 1, 2].map((i) => { const k = (tt * 2.2 + i / 3) % 1; return <div key={i} style={ab(1720 + k * 60, 330 + i * 130, { width: 44, height: 70, borderRight: `7px solid ${MZ}`, borderRadius: "50%", opacity: 1 - k })} />; })}
    <Tag tt={tt} at={0.5} x={540} y={890} txt="ENTERA" col={VER} size={72} />
    <Tag tt={tt} at={1.5} x={1380} y={890} txt="ROTA" col={RED} size={80} />
    <Tag tt={tt} at={2.8} x={1380} y={130} txt="MARACA" col={MZ} size={84} />
  </>;
}}</Stage>;

// 17 · el multímetro: marca bajito y bien, o abierto y muerto
const Multimetro: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#141a22">{(tt) => {
  const mal = tt > 2.6, val = 8.2 * eio(tt, 0.6, 1.5), flash = mal ? 0.5 + 0.5 * Math.sin(tt * 12) : 0;
  return <>
    <div style={ab(440, 90, { width: 620, height: 900, borderRadius: 56, background: "linear-gradient(#f2c230,#c2901a)", boxShadow: "0 40px 80px rgba(0,0,0,.65)" })}>
      <div style={ab(60, 60, { width: 500, height: 240, borderRadius: 18, background: mal ? `rgba(120,20,20,${0.55 + 0.4 * flash})` : "#b9c7a7", boxShadow: "inset 0 8px 16px rgba(0,0,0,.5)", color: mal ? "#ffd7cf" : "#1a2312", fontFamily: MONO, fontWeight: 900, fontSize: 130, display: "flex", alignItems: "center", justifyContent: "center" })}>{mal ? "OL" : `${val.toFixed(1)} Ω`}</div>
      <div style={ab(150, 370, { width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#55575c,#191a1d 70%)", boxShadow: "0 16px 26px rgba(0,0,0,.5)" })}><div style={ab(150, 16, { width: 20, height: 150, borderRadius: 10, background: "#f4f1e7" })} /></div>
      <div style={ab(292, 340, { fontSize: 44, fontWeight: 900, color: "#20180a", width: 40, textAlign: "center" })}>Ω</div>
      <div style={ab(120, 780, { width: 62, height: 62, borderRadius: "50%", background: "#d83a2f", boxShadow: "inset 0 6px 10px rgba(0,0,0,.5)" })} />
      <div style={ab(430, 780, { width: 62, height: 62, borderRadius: "50%", background: "#17181b", boxShadow: "inset 0 6px 10px rgba(0,0,0,.5)" })} />
    </div>
    <SVG>
      <path d="M592 900 C640 1040,1100 1030,1380 720" fill="none" stroke="#d83a2f" strokeWidth={13} strokeLinecap="round" />
      <path d="M902 900 C960 1000,1330 1000,1540 720" fill="none" stroke="#17181b" strokeWidth={13} strokeLinecap="round" />
    </SVG>
    <Rele x={1460} y={520} s={1.4} burn={mal ? 0.85 : 0} />
    <Tag tt={tt} at={1.4} x={1500} y={150} txt="3 A 15 Ω" col={VER} size={80} />
    <Tag tt={tt} at={2.85} x={1500} y={940} txt="MUERTO" col={RED} size={84} />
  </>;
}}</Stage>;

// 18 · los tres pernitos medidos: los dos chicos suman el grande
const Triangulo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#10181e" mesa={false}>{(tt) => {
  const N: Record<string, number[]> = { C: [960, 210], S: [520, 780], R: [1400, 780] }, E: [string, string, number, number, number][] = [["C", "R", 4, 1250, 450], ["C", "S", 6, 610, 450], ["S", "R", 10, 960, 860]];
  const eq = e1(tt, 3.0, 0.4);
  return <>
    <SVG>{E.map(([a, b], i) => { const k = eio(tt, 0.4 + i * 0.8, 1.0 + i * 0.8), [x1, y1] = N[a], [x2, y2] = N[b]; return <line key={i} x1={x1} y1={y1} x2={lerp(x1, x2, k)} y2={lerp(y1, y2, k)} stroke={i === 2 ? MZ : AZ} strokeWidth={12} strokeLinecap="round" />; })}</SVG>
    {Object.entries(N).map(([l, [x, y]]) => <div key={l} style={ab(x - 88, y - 88, { width: 176, height: 176, borderRadius: "50%", background: "radial-gradient(circle at 38% 30%,#fff,#b4bbc1 45%,#5b6167)", color: "#14171a", fontSize: 88, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 30px rgba(0,0,0,.6)" })}>{l}</div>)}
    {E.map(([, , v, x, y], i) => <Txt key={i} x={x} y={y - 36} w={300} size={92} col={i === 2 ? MZ : AZ} o={e1(tt, 1.0 + i * 0.8)}>{v} Ω</Txt>)}
    <div style={ab(600, 570, { width: 720, height: 150, borderRadius: 22, background: "rgba(12,14,16,.92)", border: `5px solid ${VER}`, color: TX, fontWeight: 900, fontSize: 96, textAlign: "center", lineHeight: "150px", opacity: eq, transform: `scale(${0.8 + 0.2 * eq})` })}>4 + 6 = 10</div>
    <Tag tt={tt} at={3.7} x={960} y={1000} txt="MOTOR SANO" col={VER} size={66} />
  </>;
}}</Stage>;

// 19 · corto a tierra: si marca algo contra el cobre, alto total
const Tierra: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#201412">{(tt) => {
  const mal = tt > 1.9, alto = phys(tt, 2.7, 7, 0.5);
  return <>
    <Comp x={560} y={590} w={760} />
    <div style={ab(780, 300, { width: 1000, height: 54, borderRadius: 27, background: COBRE, boxShadow: "0 16px 26px rgba(0,0,0,.5)" })} />
    <SVG>
      <path d="M500 500 C520 780,860 980,1160 900" fill="none" stroke="#d83a2f" strokeWidth={13} strokeLinecap="round" />
      <path d="M1320 346 C1370 560,1330 800,1290 860" fill="none" stroke="#9aa1a8" strokeWidth={13} strokeLinecap="round" />
    </SVG>
    <div style={ab(480, 450, { width: 40, height: 90, borderRadius: 8, background: "#d83a2f" })} />
    <div style={ab(1300, 320, { width: 40, height: 90, borderRadius: 8, background: "#17181b", border: "3px solid #565b60" })} />
    <div style={ab(1100, 840, { width: 340, height: 170, borderRadius: 22, background: "linear-gradient(#f2c230,#c2901a)", boxShadow: "0 20px 34px rgba(0,0,0,.6)" })}><div style={ab(26, 22, { width: 288, height: 126, borderRadius: 10, background: mal ? "#7d1717" : "#b9c7a7", color: mal ? "#ffd7cf" : "#1a2312", fontFamily: MONO, fontWeight: 900, fontSize: 80, textAlign: "center", lineHeight: "126px" })}>{mal ? "4.2M" : "OL"}</div></div>
    {!mal && <Tag tt={tt} at={0.7} x={1620} y={480} txt="NO MARCA" col={VER} size={72} />}
    {mal && <Tag tt={tt} at={2.0} x={1630} y={620} txt="EN CORTO" col={RED} size={78} />}
    {alto > 0.01 && <div style={ab(620, 170, { width: 680, height: 680, background: "#c9201c", clipPath: "polygon(29% 0,71% 0,100% 29%,100% 71%,71% 100%,29% 100%,0 71%,0 29%)", color: "#fff", fontWeight: 900, fontSize: 210, textAlign: "center", lineHeight: "680px", transform: `scale(${alto})` })}>ALTO</div>}
    <Tag tt={tt} at={3.65} x={760} y={950} txt="TÉCNICO" col={TX} size={80} />
  </>;
}}</Stage>;

// 20 · la lupa sobre la etiqueta del compresor
const Lupa: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#1c1f22">{(tt) => {
  const lx = lerp(660, 1010, eio(tt, 0.7, 3.2)), ly = 470 + 110 * Math.sin(tt * 1.15), LX = 500, LY = 300, W = 900, Hh = 430, R = 215, Z = 1.9;
  const Etq = () => <div style={{ width: W, height: Hh, background: "#f4f1e7", borderRadius: 12, padding: "24px 40px", boxSizing: "border-box", color: "#20232a", fontFamily: MONO, fontWeight: 800, fontSize: 76, lineHeight: 1.22, boxShadow: "0 14px 24px rgba(0,0,0,.5)" }}>
    <div>COMPRESOR</div><div>MOD. HK-140</div><div>115 V  60 Hz</div><div>1/5 HP</div></div>;
  return <>
    <Comp x={960} y={560} w={1500} />
    <div style={ab(LX, LY, {})}><Etq /></div>
    <div style={ab(lx - R, ly - R, { width: 2 * R, height: 2 * R, borderRadius: "50%", overflow: "hidden", background: "#f4f1e7", boxShadow: "0 0 0 16px #4f4131, 0 30px 50px rgba(0,0,0,.6)" })}>
      <div style={ab(LX - (lx - R), LY - (ly - R), { transformOrigin: `${lx - LX}px ${ly - LY}px`, transform: `scale(${Z})` })}><Etq /></div>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 30% 24%,rgba(255,255,255,.45),transparent 42%)" }} />
    </div>
    <div style={ab(lx + R * 0.68, ly + R * 0.68, { width: 42, height: 300, borderRadius: 20, background: "linear-gradient(90deg,#3a2d20,#7a5f42,#3a2d20)", transformOrigin: "50% 0", transform: "rotate(-45deg)" })} />
    <Tag tt={tt} at={3.5} x={960} y={960} txt="ESE MODELO" col={MZ} size={78} />
  </>;
}}</Stage>;

// 21 · paciencia: las dos curvas de temperatura en horas
const Enfriado: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#0f1c26" mesa={false}>{(tt) => {
  const r = eio(tt, 0.3, 3.4), X = (h: number) => 300 + (h / 8) * 1320, Y = (T: number) => 200 + ((24 - T) / 44) * 680;
  const curve = (T0: number, Tf: number, tau: number) => { let d = ""; for (let k = 0; k <= 160; k++) { const hr = 8 * r * (k / 160); d += `${k ? "L" : "M"}${X(hr).toFixed(1)},${Y(Tf + (T0 - Tf) * Math.exp(-hr / tau)).toFixed(1)} `; } return d; };
  return <>
    <div style={ab(300, 880, { width: 1320, height: 5, background: DIM })} /><div style={ab(298, 200, { width: 5, height: 685, background: DIM })} />
    {[0, 2, 4, 6, 8].map((v) => <Txt key={v} x={X(v)} y={900} w={140} size={46} col={DIM}>{v}h</Txt>)}
    {[20, 4, -18].map((v) => <div key={v} style={ab(150, Y(v) - 26, { width: 130, textAlign: "right", fontSize: 44, fontWeight: 800, color: DIM })}>{v}°</div>)}
    <SVG>
      <path d={curve(22, -19, 0.8)} fill="none" stroke={AZ} strokeWidth={11} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${AZ})` }} />
      <path d={curve(22, 3, 2.4)} fill="none" stroke={VER} strokeWidth={11} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${VER})` }} />
    </SVG>
    <Tag tt={tt} at={1.7} x={1010} y={745} txt="CONGELADOR" col={AZ} size={64} />
    <Tag tt={tt} at={3.2} x={1400} y={480} txt="EL REFRI" col={VER} size={66} />
    <Tag tt={tt} at={3.8} x={960} y={1000} txt="PACIENCIA" col={MZ} size={66} />
  </>;
}}</Stage>;

// 22 · la hielera: lo delicado cae adentro primero
const Hielera: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#10212b">{(tt) => {
  const L = q(h).items ?? [["CARNE", "#c8553d"], ["POLLO", "#e7c295"], ["PESCADO", "#9fb6c4"], ["LECHE", "#f5f2e6"], ["QUESO", "#f0d982"], ["CREMA", "#eee3cf"]];
  return <>
    <div style={ab(560, 250, { width: 800, height: 270, borderRadius: "40px 40px 8px 8px", background: "linear-gradient(#3b8fce,#1c5f92)", boxShadow: "inset 0 -10px 22px rgba(0,0,0,.35)" })} />
    <div style={ab(575, 505, { width: 770, height: 90, borderRadius: 10, background: "#0f3a5c" })} />
    {L.map(([l, col]: [string, string], i: number) => { const at = 0.3 + i * 0.5, k = eio(tt, at, at + 0.5), x = 610 + (i % 3) * 245, y = lerp(-140, i < 3 ? 368 : 470, k);
      return <div key={i} style={ab(x, y, { width: 210, height: 130, borderRadius: 16, background: col, color: "#1b1712", fontWeight: 900, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 22px rgba(0,0,0,.4)", transform: `rotate(${(i % 2 ? 1 : -1) * 3}deg)` })}>{l}</div>; })}
    {Array.from({ length: 14 }, (_, i) => <div key={i} style={ab(590 + rnd(i) * 690, 548 + rnd(i + 3) * 22, { width: 58, height: 58, borderRadius: 10, background: "linear-gradient(135deg,rgba(255,255,255,.95),rgba(170,220,250,.7))", transform: `rotate(${rnd(i + 5) * 45}deg)` })} />)}
    <div style={ab(560, 590, { width: 800, height: 390, borderRadius: "10px 10px 60px 60px", background: "linear-gradient(#2978b5,#16527f)", boxShadow: "0 40px 70px rgba(0,0,0,.6)" })}><div style={ab(0, 60, { width: 800, height: 16, background: "rgba(255,255,255,.3)" })} /></div>
    <Txt x={260} y={520} w={420} size={62} col={DIM} font={HAND} weight={700}>las verduras y las salsas aguantan</Txt>
    <Tag tt={tt} at={3.5} x={1620} y={520} txt="A LA HIELERA" col={AZ} size={58} />
  </>;
}}</Stage>;

// 23 · el truco de la moneda sobre el vaso congelado
const Moneda: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#172430">{(tt) => {
  const der = eio(tt, 0.9, 2.0), hun = eio(tt, 1.7, 2.7), reh = eio(tt, 3.0, 3.6), c = Math.max(0, der - reh);
  const col = `rgba(${Math.round(lerp(208, 130, c))},${Math.round(lerp(232, 190, c))},${Math.round(lerp(248, 230, c))},${lerp(0.95, 0.65, c)})`, y = lerp(250, 770, hun);
  return <>
    <div style={ab(700, 180, { width: 520, height: 740, borderRadius: "22px 22px 64px 64px", border: "12px solid rgba(235,245,250,.8)", overflow: "hidden", background: "rgba(255,255,255,.06)", boxShadow: "0 40px 70px rgba(0,0,0,.5)" })}>
      <div style={ab(0, 90, { width: 520, height: 650, background: col })} />
      {c < 0.4 && Array.from({ length: 22 }, (_, i) => <div key={i} style={ab(rnd(i) * 470, 110 + rnd(i + 2) * 600, { width: 60 + rnd(i + 3) * 80, height: 3, background: "rgba(255,255,255,.65)", transform: `rotate(${rnd(i + 5) * 170}deg)`, opacity: 1 - c * 2.5 })} />)}
    </div>
    <div style={ab(860, y, { width: 200, height: 42, borderRadius: "50%", background: "linear-gradient(#f3d27a,#a57a22)", boxShadow: "0 8px 12px rgba(0,0,0,.45), inset 0 -8px 10px rgba(120,80,20,.6)" })} />
    <Tag tt={tt} at={0.3} x={1500} y={280} txt="ARRIBA: BIEN" col={VER} size={60} />
    <Tag tt={tt} at={2.5} x={1500} y={620} txt="SE DERRITIÓ" col={AZ} size={60} />
    <Tag tt={tt} at={3.6} x={410} y={820} txt="HUBO APAGÓN" col={RED} size={62} />
  </>;
}}</Stage>;

// 24 · dos arranques: el de golpe con relé y el suave del inverter, sin relé
const Rampa: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#141820" mesa={false}>{(tt) => {
  const r = eio(tt, 0.4, 3.0), box = (x: number) => ab(x, 250, { width: 760, height: 560, borderRadius: 22, background: "rgba(8,12,18,.9)", border: "3px solid rgba(255,255,255,.2)" });
  const path = (x0: number, f: (k: number) => number) => { let d = ""; for (let k = 0; k <= 120; k++) { const u = (k / 120) * r; d += `${k ? "L" : "M"}${(x0 + 40 + u * 680).toFixed(1)},${(760 - f(u) * 440).toFixed(1)} `; } return d; };
  const golpe = (k: number) => k < 0.15 ? 0 : k < 0.2 ? 1 : 0.5 + 0.5 * Math.exp(-(k - 0.2) * 16), suave = (k: number) => 0.5 * (1 - Math.exp(-k * 3.5)) / 0.97;
  return <>
    <div style={box(130)} /><div style={box(1030)} />
    <Txt x={510} y={150} w={700} size={66}>CON RELÉ</Txt>
    <Txt x={1410} y={150} w={700} size={66} col={AZ}>INVERTER</Txt>
    <SVG>
      <path d={path(130, golpe)} fill="none" stroke={RED} strokeWidth={11} strokeLinejoin="round" />
      <path d={path(1030, suave)} fill="none" stroke={AZ} strokeWidth={11} strokeLinejoin="round" />
    </SVG>
    <Tag tt={tt} at={1.2} x={600} y={870} txt="DE GOLPE" col={RED} size={68} />
    <Tag tt={tt} at={2.3} x={1410} y={870} txt="SUAVECITO" col={AZ} size={68} />
    <Tag tt={tt} at={3.5} x={1410} y={990} txt="SIN RELÉ" col={MZ} size={66} />
  </>;
}}</Stage>;

// 25 · la rueda de sospechosos: los cuatro culpables de que se queme
const Culpables: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1b1c20" mesa={false}>{(tt) => {
  const L = ["EL CALOR", "APAGONES", "LA PUERTA", "LA EDAD"];
  const Obj = (i: number) => i === 0
    ? <div style={ab(50, 30, { width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,#ffe08a,#f07a2c 60%,#b83a1a)", boxShadow: "0 0 60px #f07a2c" })} />
    : i === 1 ? <div style={ab(60, 10, { width: 180, height: 240, background: "#ffd23f", clipPath: "polygon(58% 0,18% 56%,48% 56%,28% 100%,86% 40%,54% 40%)" })} />
    : i === 2 ? <div style={ab(70, 20, { width: 170, height: 230, borderRadius: 8, background: "linear-gradient(#f4f6f7,#c9d0d4)", transformOrigin: "0 50%", transform: `perspective(700px) rotateY(${-30 - 22 * Math.sin(tt * 2)}deg)` })} />
    : <div style={ab(60, 20, { width: 180, height: 220, borderRadius: 10, background: "#f2efe6", color: "#c9201c", fontSize: 112, fontWeight: 900, textAlign: "center", lineHeight: "220px" })}>10</div>;
  return <>
    <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,rgba(255,255,255,.14) 0 4px,transparent 4px 96px)" }} />
    {L.map((l, i) => { const at = 0.3 + i * 0.85, k = phys(tt, at, 7, 0.6), x = 110 + i * 440; return <div key={i} style={ab(x + (1 - k) * 700, 180, { width: 400, height: 760, opacity: cl(k * 3) })}>
      <div style={ab(50, 80, { width: 300, height: 260 })}>{Obj(i)}</div>
      <div style={ab(0, 440, { width: 400, height: 260, borderRadius: 14, background: "#101114", border: "5px solid rgba(255,255,255,.55)", textAlign: "center", boxShadow: "0 24px 40px rgba(0,0,0,.6)" })}>
        <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 92, color: MZ, lineHeight: "130px" }}>{i + 1}</div>
        <div style={{ fontWeight: 900, fontSize: 54, color: TX }}>{l}</div></div>
    </div>; })}
  </>;
}}</Stage>;

// 26 · el protector de voltaje: regresa la luz y hace esperar al refri
const Retardo: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#101520" mesa={false}>{(tt) => {
  const fuera = tt > 0.9 && tt < 1.6, izq = !fuera, cd = eio(tt, 1.7, 3.5), der = tt >= 3.5 || tt < 0.9, sg = Math.ceil(180 * (1 - cd)), mm = Math.floor(sg / 60), ss = sg % 60;
  const Linea = (x: number, w: number, on: boolean) => <div style={ab(x, 533, { width: w, height: 16, borderRadius: 8, background: on ? MZ : "#3a3f48", boxShadow: on ? `0 0 26px ${MZ}` : "none" })} />;
  return <>
    <div style={ab(170, 410, { width: 190, height: 260, borderRadius: 18, background: "linear-gradient(#efeade,#c7c2b1)", boxShadow: "0 24px 40px rgba(0,0,0,.6)" })}>{[60, 150].map((y) => <div key={y} style={ab(55, y, { width: 80, height: 54, borderRadius: 14, background: "#2b2d30" })} />)}</div>
    {Linea(360, 340, izq)}
    <div style={ab(700, 370, { width: 520, height: 340, borderRadius: 32, background: "linear-gradient(#3a4250,#191d25)", border: "5px solid #6a7382", boxShadow: "0 30px 50px rgba(0,0,0,.6)" })}><div style={ab(60, 60, { width: 400, height: 170, borderRadius: 14, background: "#071210", color: tt >= 3.5 ? VER : MZ, fontFamily: MONO, fontWeight: 900, fontSize: 124, textAlign: "center", lineHeight: "170px" })}>{tt < 1.7 ? "--:--" : `${mm}:${String(ss).padStart(2, "0")}`}</div></div>
    {Linea(1220, 300, der)}
    <div style={ab(1520, 240, { width: 300, height: 600, borderRadius: 22, background: "linear-gradient(#f4f6f7,#cbd2d6)", boxShadow: `0 30px 60px rgba(0,0,0,.6)${tt >= 3.5 ? `, 0 0 60px ${AZ}` : ""}` })}><div style={ab(0, 190, { width: 300, height: 7, background: "#8b9298" })} /></div>
    {tt < 1.75 && <Tag tt={tt} at={0.95} x={490} y={300} txt="SE VA" col={RED} size={78} />}
    <Tag tt={tt} at={1.8} x={960} y={800} txt="ESPERA" col={MZ} size={80} />
    <Tag tt={tt} at={3.6} x={1610} y={920} txt="AHORA SÍ" col={VER} size={68} />
  </>;
}}</Stage>;

// 27 · resumen: un tubo de cobre con siete válvulas que se abren
const Tuberia: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#1c1812" mesa={false}>{(tt) => {
  const L: string[] = q(h).items ?? ["Clic y no enfría", "Descarta lo simple", "Desenchufa", "Foto y sácalo derecho", "Míralo, huélelo, agítalo", "Multímetro y tierra", "El correcto y paciencia"];
  const pts = [[260, 300], [640, 300], [1020, 300], [1400, 300], [1660, 300], [1660, 730], [1400, 730], [960, 730], [520, 730]];
  const nodos = [0, 1, 2, 3, 6, 7, 8].map((i) => pts[i]);
  return <>
    <SVG><polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="#6e3517" strokeWidth={40} strokeLinejoin="round" /><polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="#d98f53" strokeWidth={13} strokeLinejoin="round" /></SVG>
    {nodos.map(([x, y], i) => { const at = 0.25 + i * 0.55, s = phys(tt, at, 8, 0.5), on = tt > at + 0.1; return <div key={i}>
      <div style={ab(x - 72, y - 72, { width: 144, height: 144, borderRadius: "50%", background: on ? `radial-gradient(circle at 40% 35%,#c2f1cf,${VER})` : "radial-gradient(circle at 40% 35%,#62666b,#24262a)", border: "7px solid #f0e6cf", color: "#14110b", fontSize: 72, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.75 + 0.25 * s})`, boxShadow: "0 14px 24px rgba(0,0,0,.6)" })}>{i + 1}</div>
      <Txt x={x} y={y + 92} w={370} size={42} o={cl(s * 2)}>{L[i]}</Txt>
    </div>; })}
  </>;
}}</Stage>;

// 28 · tres sellos de goma caen sobre una orden de servicio: lo que este video promete
const Sellos: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1e1a14" mesa={false}>{(tt) => {
  const L: [string, number, number, number][] = [["EN TU CASA", 330, 300, -7], ["SIN GAS", 980, 470, 5], ["SIN HERRAMIENTAS RARAS", 400, 690, -3]];
  return <>
    <div style={ab(230, 90, { width: 1460, height: 900, borderRadius: 8, background: "linear-gradient(#f3ecda,#e0d6bd)", boxShadow: "0 40px 80px rgba(0,0,0,.65)" })}>
      {Array.from({ length: 14 }, (_, i) => <div key={i} style={ab(70, 170 + i * 50, { width: 1320, height: 3, background: "rgba(70,90,130,.3)" })} />)}
      <div style={ab(70, 50, { fontSize: 66, fontWeight: 900, color: "#3a3226" })}>ORDEN DE SERVICIO</div>
    </div>
    {L.map(([l, x, y, r], i) => { const at = 0.5 + i * 1.05, k = cl((tt - at) / 0.16), sh = Math.max(0, 1 - (tt - at - 0.16) / 0.25); return <div key={i} style={ab(x, y, { padding: "26px 54px", border: "12px solid #b3261e", borderRadius: 14, color: "#b3261e", fontWeight: 900, fontSize: i === 2 ? 74 : 104, whiteSpace: "nowrap", opacity: k, transform: `rotate(${r}deg) scale(${lerp(2.6, 1, k) + sh * 0.03})`, mixBlendMode: "multiply" })}>{l}</div>; })}
  </>;
}}</Stage>;

// 29 · la huella digital del relé: las crestas son el patrón clic–zumbido–clic
const Huella: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#101418" mesa={false}>{(tt) => {
  const scan = eio(tt, 0.3, 2.6), cx = 620, cy = 540, y0 = 170 + scan * 740;
  return <>
    <SVG>{Array.from({ length: 13 }, (_, i) => { const rx = 50 + i * 27, ry = 75 + i * 33, gap = 18 + 11 * Math.sin(i * 1.9); return <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={MZ} strokeWidth={11} strokeLinecap="round" strokeDasharray={`${150 + 40 * rnd(i)} ${gap}`} transform={`rotate(${i * 11} ${cx} ${cy})`} opacity={0.3 + 0.7 * cl(scan * 1.4 - i * 0.04)} />; })}</SVG>
    <div style={ab(190, y0, { width: 860, height: 7, background: AZ, boxShadow: `0 0 34px 8px ${AZ}`, opacity: tt < 2.8 ? 1 : 0 })} />
    {(["CLIC", "ZUMBIDO", "CLIC", "SILENCIO"] as string[]).map((l, i) => { const at = 2.2 + i * 0.5, s = phys(tt, at, 8, 0.55); return <div key={i} style={ab(1160, 210 + i * 170, { width: 580, height: 140, borderRadius: 16, background: "rgba(14,20,26,.92)", borderLeft: `14px solid ${i === 3 ? DIM : MZ}`, color: TX, fontWeight: 900, fontSize: 74, lineHeight: "140px", paddingLeft: 40, boxSizing: "border-box", opacity: cl(s * 2), transform: `translateX(${(1 - s) * 90}px)` })}>{l}</div>; })}
  </>;
}}</Stage>;

// 30 · el tablero de herramientas: cada silueta se llena cuando la nombra
const Tablero: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#22180f" mesa={false}>{(tt) => {
  const T: [string, number, number, number, number, string][] = [["PLANO", 210, 190, 54, 470, "linear-gradient(90deg,#a8452c,#e0755a,#a8452c)"], ["CRUZ", 400, 190, 54, 470, "linear-gradient(90deg,#d9a21f,#f5d36a,#d9a21f)"], ["LINTERNA", 620, 220, 140, 400, "linear-gradient(90deg,#26282c,#6a6f76,#26282c)"], ["CELULAR", 900, 230, 210, 380, "linear-gradient(135deg,#2a2d31,#0d0e10)"], ["TRAPO", 1230, 230, 260, 170, "repeating-linear-gradient(45deg,#c7b48c 0 14px,#a8946b 14px 28px)"], ["MULTÍMETRO", 1560, 200, 200, 400, "linear-gradient(#f2c230,#c2901a)"], ["GUANTES", 1230, 560, 260, 150, "linear-gradient(#6f8fb0,#3f5a75)"]];
  return <>
    <div style={{ position: "absolute", inset: 0, backgroundColor: "#6f5235", backgroundImage: "radial-gradient(circle,#2a1d10 7px,transparent 8px)", backgroundSize: "62px 62px" }} />
    {T.map(([l, x, y, w, hh, bg], i) => { const at = 0.35 + i * 0.52, s = phys(tt, at, 8, 0.55), rd = i < 2 ? 22 : 18; return <div key={i}>
      <div style={ab(x, y, { width: w, height: hh, borderRadius: rd, border: "6px dashed rgba(244,241,231,.55)", boxSizing: "border-box" })} />
      <div style={ab(x, y, { width: w, height: hh, borderRadius: rd, opacity: cl(s * 3), transform: `translateY(${(1 - s) * -80}px)`, filter: "drop-shadow(0 22px 18px rgba(0,0,0,.55))" })}>
        {i < 2 ? <>
          <div style={ab(0, 0, { width: w, height: 190, borderRadius: 22, background: bg })} />
          <div style={ab(w / 2 - 8, 186, { width: 16, height: hh - 186 - (i ? 0 : 24), background: "linear-gradient(90deg,#8b9298,#eef1f3,#8b9298)" })} />
          {i === 0 && <div style={ab(w / 2 - 19, hh - 28, { width: 38, height: 28, background: "linear-gradient(90deg,#8b9298,#eef1f3,#8b9298)", clipPath: "polygon(0 0,100% 0,84% 100%,16% 100%)" })} />}
          {i === 1 && <div style={ab(w / 2 - 14, hh - 34, { width: 28, height: 34, background: "#c6ccd1", clipPath: "polygon(36% 0,64% 0,64% 34%,100% 34%,64% 56%,50% 100%,36% 56%,0 34%,36% 34%)" })} />}
        </> : <div style={{ position: "absolute", inset: 0, borderRadius: rd, background: bg }}>
          {i === 2 && <div style={ab(-18, 0, { width: w + 36, height: 76, borderRadius: "16px 16px 6px 6px", background: "linear-gradient(90deg,#858c93,#eef1f3,#858c93)" })}><div style={ab(16, 12, { width: w + 4, height: 30, borderRadius: 15, background: "#fff6c8" })} /></div>}
          {i === 3 && <div style={ab(12, 12, { width: w - 24, height: hh - 24, borderRadius: 10, background: "linear-gradient(135deg,#27496b,#6a9cc4 55%,#27496b)" })} />}
          {i === 5 && <><div style={ab(20, 26, { width: w - 40, height: 96, borderRadius: 8, background: "#b9c7a7" })} /><div style={ab(w / 2 - 54, 170, { width: 108, height: 108, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#55575c,#191a1d 70%)" })} /><div style={ab(36, 330, { width: 34, height: 34, borderRadius: "50%", background: "#d83a2f" })} /><div style={ab(130, 330, { width: 34, height: 34, borderRadius: "50%", background: "#17181b" })} /></>}
          {i === 6 && [0, 1, 2, 3].map((k) => <div key={k} style={ab(14 + k * 62, -46, { width: 46, height: 76, borderRadius: 23, background: "#6f8fb0" })} />)}
        </div>}
      </div>
      <Txt x={x + w / 2} y={y + hh + 26} w={340} size={i === 5 ? 44 : 50} o={cl(s * 3)}>{l}</Txt>
    </div>; })}
  </>;
}}</Stage>;

// 31 · circuito sellado: candado sobre el anillo de cobre y el manómetro a presión
const Sellado: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#14191f" mesa={false}>{(tt) => {
  const lock = phys(tt, 1.7, 7, 0.45), ang = lerp(-120, 62, eio(tt, 0.4, 1.8)) + 3 * Math.sin(tt * 9), cierre = lerp(-54, 0, e1(tt, 2.0, 0.3));
  const P = [[400, 230], [960, 230], [1130, 400], [1130, 680], [960, 850], [400, 850], [230, 680], [230, 400], [400, 230]];
  return <>
    <SVG><rect x={230} y={230} width={900} height={620} rx={170} fill="none" stroke="#6e3517" strokeWidth={62} /><rect x={230} y={230} width={900} height={620} rx={170} fill="none" stroke="#d98f53" strokeWidth={22} /></SVG>
    {Array.from({ length: 16 }, (_, i) => { const k = (tt * 0.22 + i / 16) % 1, [x, y] = along(P, k); return <div key={i} style={ab(x - 12, y - 12, { width: 24, height: 24, borderRadius: "50%", background: AZ, boxShadow: `0 0 14px ${AZ}` })} />; })}
    <div style={ab(1250, 240, { width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,#f4f1e7 62%,#a9b0b5 64%,#6c7379)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" })}>
      {Array.from({ length: 11 }, (_, i) => <div key={i} style={ab(236, 26, { width: 8, height: 46, background: i > 7 ? RED : "#2b2d30", transformOrigin: "4px 214px", transform: `rotate(${-125 + i * 25}deg)` })} />)}
      <div style={ab(232, 60, { width: 16, height: 190, borderRadius: 8, background: RED, transformOrigin: "8px 180px", transform: `rotate(${ang}deg)` })} />
      <div style={ab(205, 205, { width: 70, height: 70, borderRadius: "50%", background: "#26282c" })} />
    </div>
    <div style={ab(540, 330, { width: 280, height: 420, transform: `scale(${lock})` })}>
      <div style={ab(50, cierre, { width: 180, height: 220, borderRadius: "90px 90px 0 0", border: "36px solid #c5ccd2", borderBottom: "none", boxSizing: "border-box" })} />
      <div style={ab(0, 170, { width: 280, height: 230, borderRadius: 26, background: "linear-gradient(#ecc65a,#a47d22)", boxShadow: "0 24px 40px rgba(0,0,0,.6)" })}><div style={ab(115, 70, { width: 50, height: 90, borderRadius: 24, background: "#1b1712" })} /></div>
    </div>
    <Tag tt={tt} at={2.3} x={680} y={150} txt="SELLADO" col={MZ} size={78} />
    <Tag tt={tt} at={1.5} x={1490} y={780} txt="A PRESIÓN" col={RED} size={66} />
    <Tag tt={tt} at={3.5} x={1490} y={930} txt="TÉCNICO" col={TX} size={74} />
  </>;
}}</Stage>;

export const TEC: Record<string, C> = {
  ondaclic: OndaClic, flujocalor: FlujoCalor, compresor3d: Compresor3D, patada: Patada, arranques: Arranques, termico: Termico, ciclo: Ciclo, chat: Chat, balanza: Balanza,
  interruptores: Interruptores, rejilla: Rejilla, termografia: Termografia, pernos3d: Pernos3D, visor: Visor, sentidos: Sentidos, maraca: Maraca, multimetro: Multimetro,
  triangulo: Triangulo, tierra: Tierra, lupa: Lupa, enfriado: Enfriado, hielera: Hielera, moneda: Moneda, rampa: Rampa, culpables: Culpables, retardo: Retardo, tuberia: Tuberia,
  sellos: Sellos, huella: Huella, pegboard: Tablero, sellado: Sellado,
};
