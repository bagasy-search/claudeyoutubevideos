// heroes.tsx · kit PinCableado (sesD, pin5na «7 errores de cableado»): 35 componentes PROPIOS, uno por idea, dibujados como el
// OBJETO que la idea es (térmica, cable en corte, borne, caja de paso, buscapolo, pinza, casa en corte…). Escenario = Stage de ckit
// (foto del momento desenfocada + mesa + cámara curva). Física con resorte (phys), rótulos cortos. Datos = los del guion.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { cl, eio, H, HAND, img, phys, Stage } from "./ckit";
import { FONT } from "./lib";

type C = React.FC<{ t: number; h: H }>;
const RED = "#e8432e", GRN = "#5fc7a0", CU_ = "#d9873e", CUL = "#f4b26b", INK = "#f3f6f8", NAVY = "#0f1b2a", AMB = "#ffc23a", BLU = "#5aa9e6", BRN = "#7b4a2a";
const P = (tt: number, a: number, w = 7, z = 0.5) => phys(tt, a, w, z);
const lp = (a: number, b: number, k: number) => a + (b - a) * k;
const W = (tt: number, a: number, b: number) => eio(tt, a, b);

const Lbl: React.FC<{ tt: number; at: number; x: number; y: number; tx: string; col?: string; bg?: string; size?: number; hand?: boolean }> = ({ tt, at, x, y, tx, col = NAVY, bg = INK, size = 46, hand }) => {
  const s = P(tt, at, 8, 0.5); if (s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - s) * -50}px) rotate(${(1 - s) * -4}deg)`, opacity: cl(s * 2.2),
    padding: hand ? "4px 18px" : "10px 26px", borderRadius: 14, background: bg, color: col, fontFamily: hand ? HAND : FONT, fontWeight: 900, fontSize: hand ? size * 1.3 : size,
    letterSpacing: hand ? 0 : 1.5, whiteSpace: "nowrap", boxShadow: hand ? "none" : "0 14px 34px rgba(0,0,0,.45)", textShadow: hand ? "0 6px 18px rgba(0,0,0,.7)" : "none" }}>{tx}</div>;
};
const Big: React.FC<{ tt: number; at: number; x: number; y: number; tx: string; col?: string; size?: number }> = ({ tt, at, x, y, tx, col = AMB, size = 200 }) => {
  const s = P(tt, at, 7, 0.42); if (s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * s})`, opacity: cl(s * 2), fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, WebkitTextStroke: "6px #1b1206", textShadow: "0 18px 40px rgba(0,0,0,.6)", lineHeight: 1, whiteSpace: "nowrap" } as React.CSSProperties}>{tx}</div>;
};
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>{children}</svg>;
const Defs = () => <defs>
  <radialGradient id="cu" cx=".35" cy=".35"><stop offset="0" stopColor="#ffd9a8" /><stop offset=".5" stopColor={CU_} /><stop offset="1" stopColor="#7a3d12" /></radialGradient>
  <linearGradient id="cuL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd9a8" /><stop offset=".5" stopColor={CU_} /><stop offset="1" stopColor="#7a3d12" /></linearGradient>
  <linearGradient id="hot" x1="0" x2="1"><stop offset="0" stopColor="#ffdd55" /><stop offset=".5" stopColor="#ff6a1a" /><stop offset="1" stopColor="#c21d0a" /></linearGradient>
  <pattern id="vy" width="60" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="30" height="40" fill="#3fa34d" /><rect x="30" width="30" height="40" fill="#f2d21b" /></pattern>
  <filter id="glow"><feGaussianBlur stdDeviation="10" /></filter>
</defs>;
const Breaker: React.FC<{ x: number; y: number; s?: number; on: number; amp: string; glow?: number }> = ({ x, y, s = 1, on, amp, glow = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-70} y={-170} width={140} height={340} rx={14} fill="#f4f4f2" stroke="#9aa3ab" strokeWidth={4} />
    <rect x={-70} y={-170} width={140} height={46} rx={10} fill="#d8dde2" />
    <rect x={-40} y={-80} width={80} height={130} rx={10} fill="#2b3640" />
    <rect x={-30} y={lp(30, -70, on)} width={60} height={46} rx={8} fill={on > 0.5 ? GRN : RED} />
    <text x={0} y={120} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={NAVY}>{amp}</text>
    {glow > 0 && <rect x={-90} y={-190} width={180} height={380} rx={24} fill="none" stroke={RED} strokeWidth={10} opacity={glow} />}
  </g>
);
const CableCut: React.FC<{ r: number; col: string }> = ({ r, col }) => <g><circle r={r * 1.9} fill={col} stroke="rgba(0,0,0,.35)" strokeWidth={4} /><circle r={r} fill="url(#cu)" /></g>;
const Wire: React.FC<{ x1: number; x2: number; y: number; col: string; th?: number; bare?: number; dir?: 1 | -1; hot?: number }> = ({ x1, x2, y, col, th = 34, bare = 0, dir = 1, hot = 0 }) => {
  const a = Math.min(x1, x2), w = Math.abs(x2 - x1), tip = dir === 1 ? Math.max(x1, x2) : a;
  return <g>
    <rect x={a} y={y - th / 2} width={w} height={th} rx={th / 2} fill={hot > 0 ? "url(#hot)" : col} />
    <rect x={a} y={y - th / 2 + 4} width={w} height={th * 0.22} rx={4} fill="rgba(255,255,255,.28)" />
    {bare > 0 && <rect x={dir === 1 ? tip : tip - bare} y={y - th * 0.22} width={bare} height={th * 0.44} rx={4} fill="url(#cuL)" />}
  </g>;
};
const Socket: React.FC<{ x: number; y: number; s?: number; tint?: number }> = ({ x, y, s = 1, tint = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-150} y={-190} width={300} height={380} rx={26} fill={`rgb(${246 - 30 * tint},${244 - 60 * tint},${236 - 130 * tint})`} stroke="#b9b3a6" strokeWidth={5} />
    <rect x={-100} y={-120} width={200} height={240} rx={30} fill={`rgb(${236 - 30 * tint},${235 - 60 * tint},${228 - 130 * tint})`} stroke="#c9c4b8" strokeWidth={4} />
    <rect x={-58} y={-40} width={16} height={50} rx={4} transform="rotate(30 -50 -15)" fill="#2b2b2b" />
    <rect x={42} y={-40} width={16} height={50} rx={4} transform="rotate(-30 50 -15)" fill="#2b2b2b" />
    <rect x={-8} y={30} width={16} height={56} rx={4} fill="#2b2b2b" />
  </g>
);
const Clamp: React.FC<{ x: number; y: number; s?: number; val: string }> = ({ x, y, s = 1, val }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M -90 -150 A 95 95 0 1 1 90 -150" fill="none" stroke="#f2c21b" strokeWidth={44} strokeLinecap="round" />
    <rect x={-110} y={-120} width={220} height={380} rx={40} fill="#f2c21b" stroke="#a88208" strokeWidth={5} />
    <rect x={-80} y={-80} width={160} height={100} rx={12} fill="#c9d6c1" stroke="#555" strokeWidth={4} />
    <text x={70} y={-12} textAnchor="end" fontFamily="monospace" fontWeight={900} fontSize={64} fill={NAVY}>{val}</text>
    <circle cx={0} cy={120} r={52} fill="#222" /><circle cx={0} cy={120} r={10} fill="#888" />
  </g>
);
const Box: React.FC<{ x: number; y: number; w?: number; h?: number; lid?: number; children?: React.ReactNode; metal?: boolean }> = ({ x, y, w = 560, h = 420, lid = 0, children, metal }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={metal ? 8 : 26} fill={metal ? "#7d868f" : "#e9e6dc"} stroke={metal ? "#4b535a" : "#b5ae9e"} strokeWidth={8} />
    <rect x={-w / 2 + 26} y={-h / 2 + 26} width={w - 52} height={h - 52} rx={metal ? 4 : 16} fill={metal ? "#3a4148" : "#5a554b"} />
    {children}
    {lid < 0.99 && <g transform={`translate(0,${-h / 2}) scale(1,${1 - lid}) translate(0,${h / 2})`}><rect x={-w / 2 - 6} y={-h / 2 - 6} width={w + 12} height={h + 12} rx={metal ? 10 : 30} fill={metal ? "#9aa3ab" : "#f3f1ea"} stroke="#b5ae9e" strokeWidth={6} /></g>}
  </g>
);
const Photo: React.FC<{ id?: string; x: number; y: number; w: number; h: number; tt: number; at?: number; rot?: number }> = ({ id, x, y, w, h, tt, at = 0, rot = -2 }) => {
  const s = P(tt, at, 6.5, 0.55); if (!id || s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, padding: 12, background: "#f6f2e8", borderRadius: 6, boxShadow: "0 30px 70px rgba(0,0,0,.5)", transform: `translateY(${(1 - s) * 600}px) rotate(${rot * s}deg)`, opacity: cl(s * 2) }}>
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}><Img src={img(id)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.11 + 0.05 * W(tt, at, at + 6)})` }} /></div>
  </div>;
};

// 1 · el empalme con costra: la foto real cae y una lupa con calor late sobre la costra
const Costra: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const pulse = 0.5 + 0.5 * Math.sin(tt * 4), s = P(tt, 1.0);
  return <AbsoluteFill>
    <Photo id={h.imgs?.[0]} x={860} y={520} w={1180} h={700} tt={tt} at={0.05} rot={-1.5} />
    {h.imgs?.[0] && <div style={{ position: "absolute", left: 1290, top: 300, width: 380, height: 380, borderRadius: "50%", border: "14px solid #2b2b2b", boxShadow: `0 0 ${40 + 40 * pulse}px rgba(255,90,30,${0.4 + 0.3 * pulse}), 0 30px 60px rgba(0,0,0,.5)`, overflow: "hidden", transform: `scale(${s})`, background: "#111" }}>
      <Img src={img(h.imgs[0])} style={{ position: "absolute", width: "300%", height: "300%", objectFit: "cover", left: "-100%", top: "-100%" }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle, rgba(255,90,20,${0.25 * pulse}), transparent 70%)` }} />
    </div>}
    <Lbl tt={tt} at={2.0} x={1480} y={760} tx="CINTA DERRETIDA" bg={RED} col={INK} />
  </AbsoluteFill>;
}}</Stage>;

// 2 · ducha + secador + estufita al mismo empalme: los tres caen sobre el cable y la barra llega a casi 20 A
const Amperes: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const ap = [["DUCHA", 0.4], ["SECADOR", 1.6], ["ESTUFITA", 2.8]] as const;
  const k = cl(ap.reduce((a, [, at]) => a + cl(P(tt, at, 7, 0.6)) / 3, 0)) * 0.98;
  return <AbsoluteFill><Svg><Defs />
    {ap.map(([n, at], i) => { const s = P(tt, at, 7, 0.55); return <g key={n} transform={`translate(${380 + i * 340},${lp(-200, 340, s)})`} opacity={cl(s * 2)}>
      <rect x={-140} y={-70} width={280} height={140} rx={22} fill="#1d2b3a" stroke={AMB} strokeWidth={5} />
      <text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={INK}>{n}</text>
      <line x1={0} y1={70} x2={0} y2={lp(70, 250, cl(s))} stroke={AMB} strokeWidth={8} strokeDasharray="14 10" />
    </g>; })}
    <Wire x1={200} x2={1300} y={640} col={BRN} th={46} hot={k > 0.85 ? 1 : 0} />
    <rect x={200} y={720} width={1100} height={40} rx={20} fill="#26323d" />
    <rect x={200} y={720} width={1100 * k} height={40} rx={20} fill={k > 0.85 ? RED : AMB} />
  </Svg>
    <Big tt={tt} at={0.3} x={1600} y={560} tx={`${Math.round(k * 20)} A`} col={k > 0.85 ? RED : AMB} size={190} />
    <Lbl tt={tt} at={4.0} x={1600} y={770} tx="UN SOLO EMPALME" />
  </AbsoluteFill>;
}}</Stage>;

// 3 · el juego: siete tomas en fila esperando tu cuenta
const Contar: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => <AbsoluteFill><Svg><Defs />
  {Array.from({ length: 7 }, (_, i) => { const s = P(tt, 0.3 + i * 0.22, 8, 0.5); return <g key={i} opacity={cl(s * 2)} transform={`translate(0,${(1 - s) * 200})`}>
    <Socket x={240 + i * 240} y={480} s={0.55} />
    <text x={240 + i * 240} y={660} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={i < 3 ? AMB : "rgba(243,246,248,.5)"}>{i + 1}</text>
  </g>; })}
  {[0, 1, 2].map((i) => { const s = P(tt, 3.2 + i * 0.5, 9, 0.4); return <circle key={i} cx={240 + i * 240} cy={480} r={130 * s} fill="none" stroke={AMB} strokeWidth={10} opacity={cl(s)} />; })}
</Svg><Lbl tt={tt} at={2.4} x={960} y={840} tx="ANDÁ CONTANDO" hand bg="transparent" col={INK} size={64} /></AbsoluteFill>}</Stage>;

// 4 · la regla de oro: baja la térmica general y el buscapolo confirma, sin luz
const Regla: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const off = W(tt, 0.8, 1.6), tip = W(tt, 2.6, 3.6);
  return <AbsoluteFill><Svg><Defs />
    <Breaker x={560} y={520} s={1.4} on={1 - off} amp="GRAL" />
    <Socket x={1300} y={600} s={0.75} />
    <g transform={`translate(${lp(1700, 1340, tip)},${lp(260, 520, tip)}) rotate(-35)`}>
      <rect x={-20} y={-260} width={40} height={300} rx={14} fill="#2a6fd6" /><rect x={-8} y={40} width={16} height={90} fill="#c8ccd0" />
      <rect x={-14} y={-200} width={28} height={70} rx={8} fill="#5a2a22" />
    </g>
  </Svg>
    <Lbl tt={tt} at={1.4} x={560} y={900} tx="1 · BAJÁS" bg={AMB} />
    <Lbl tt={tt} at={3.8} x={1300} y={900} tx="2 · VERIFICÁS" bg={GRN} />
  </AbsoluteFill>;
}}</Stage>;

// 5 · ayudante en Lanús: el rollo gira y el cable entra por el caño
const Ayudante: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const k = W(tt, 0.6, 5.5);
  return <AbsoluteFill><Svg><Defs />
    <g transform={`translate(420,560) rotate(${-k * 720})`}><circle r={210} fill={BRN} stroke="#3b2414" strokeWidth={10} />{Array.from({ length: 9 }, (_, i) => <circle key={i} r={190 - i * 16} fill="none" stroke="rgba(0,0,0,.25)" strokeWidth={3} />)}<circle r={60} fill="#3b2414" /><rect x={-8} y={-200} width={16} height={140} fill="#3b2414" /></g>
    <rect x={640} y={520} width={1100} height={80} rx={40} fill="#cfd5da" opacity={0.35} />
    <Wire x1={620} x2={620 + 1100 * k} y={560} col={BRN} th={30} bare={30} />
  </Svg>
    <Lbl tt={tt} at={1.2} x={1250} y={380} tx="AYUDANTE EN LANÚS" />
    <Lbl tt={tt} at={2.6} x={1250} y={780} tx="30 AÑOS" bg={AMB} size={60} />
  </AbsoluteFill>;
}}</Stage>;

// 6 · pava y microondas juntos: entran los dos y la térmica de la cocina salta
const Pava: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const a = P(tt, 0.5), b = P(tt, 1.8), trip = W(tt, 3.0, 3.25);
  return <AbsoluteFill><Svg><Defs />
    <Socket x={760} y={540} s={1.1} />
    <g transform={`translate(${lp(-100, 420, a)},380)`}><rect x={-120} y={-60} width={240} height={120} rx={20} fill="#e6e6e6" /><text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={NAVY}>PAVA</text><line x1={120} y1={0} x2={240} y2={120} stroke="#2b2b2b" strokeWidth={10} /></g>
    <g transform={`translate(${lp(-100, 420, b)},720)`}><rect x={-140} y={-60} width={280} height={120} rx={20} fill="#e6e6e6" /><text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={NAVY}>MICROONDAS</text><line x1={140} y1={0} x2={240} y2={-120} stroke="#2b2b2b" strokeWidth={10} /></g>
    <Breaker x={1460} y={540} s={1.2} on={1 - trip} amp="10 A" glow={trip} />
  </Svg>
    <Lbl tt={tt} at={3.2} x={1460} y={880} tx="¡SALTA!" bg={RED} col={INK} size={56} />
  </AbsoluteFill>;
}}</Stage>;

// 7 · el cambio prohibido: sale la de 10, entra la de 20 y el cable se pone rojo
const Swap: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const out = W(tt, 0.6, 1.6), inn = P(tt, 1.8, 7, 0.55), hot = W(tt, 3.2, 6.5);
  return <AbsoluteFill><Svg><Defs />
    <g opacity={1 - out} transform={`translate(${-500 * out},0)`}><Breaker x={600} y={480} s={1.2} on={1} amp="10 A" /></g>
    <g opacity={cl(inn * 2)} transform={`translate(0,${(1 - inn) * -500})`}><Breaker x={600} y={480} s={1.2} on={1} amp="20 A" /></g>
    <Wire x1={760} x2={1760} y={540} col={BRN} th={40} hot={hot > 0.3 ? 1 : 0} />
    <rect x={760} y={515} width={1000} height={50} rx={25} fill={RED} opacity={hot * 0.55} filter="url(#glow)" />
  </Svg>
    <Lbl tt={tt} at={3.2} x={1260} y={720} tx="YA NO SALTA" bg={AMB} />
    <Lbl tt={tt} at={4.4} x={1260} y={840} tx="¡Y EL CABLE SE QUEMA!" bg={RED} col={INK} />
    <Lbl tt={tt} at={5.2} x={1260} y={880} tx="EL CABLE SE COCINA" bg={RED} col={INK} />
  </AbsoluteFill>;
}}</Stage>;

// 8 · capacidad: el 1,5 aguanta 10-15 A; la pinza marca 16 y la barra pasa la raya
const Capacidad: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = W(tt, 0.5, 3.2) * 16, X = (a: number) => 760 + 980 * a / 20;
  return <AbsoluteFill><Svg><Defs />
    <Clamp x={420} y={500} s={1.05} val={k.toFixed(0)} />
    <rect x={760} y={430} width={980} height={110} rx={20} fill="#26323d" />
    <rect x={X(10)} y={430} width={X(15) - X(10)} height={110} fill={AMB} opacity={0.25} />
    <rect x={760} y={430} width={X(k) - 760} height={110} rx={20} fill={k > 15 ? RED : GRN} />
    <line x1={X(15)} y1={400} x2={X(15)} y2={570} stroke={AMB} strokeWidth={6} strokeDasharray="12 8" />
    <text x={X(12.5)} y={385} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={AMB}>1,5 mm²: 10-15 A</text>
  </Svg>
    <Big tt={tt} at={0.4} x={1250} y={720} tx={`${k.toFixed(0)} A`} col={k > 15 ? RED : INK} size={150} />
  </AbsoluteFill>;
}}</Stage>;

// 9 · la regla de las secciones: tres cables en corte que crecen (1,5 · 2,5 · 4)
const Secciones: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const L = [["1,5", "LUZ", 22, 0.3, BLU], ["2,5", "TOMAS", 30, 1.6, BRN], ["4+", "HORNO · TERMO", 40, 3.0, "#c23a2a"]] as const;
  return <AbsoluteFill><Svg><Defs />
    {L.map(([mm, use, r, at, c]) => { const s = P(tt, at, 7, 0.5), i = L.findIndex((x) => x[0] === mm); return <g key={mm} opacity={cl(s * 2)} transform={`translate(${430 + i * 530},450) scale(${0.4 + 0.6 * s})`}>
      <CableCut r={r * 2.2} col={c} />
      <text y={250} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={84} fill={AMB}>{mm}</text>
      <text y={320} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={INK}>{use}</text>
    </g>; })}
  </Svg></AbsoluteFill>;
}}</Stage>;

// 10 · la térmica cuida el cable: un escudo sobre el cable; el aparato queda afuera
const Guardia: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = P(tt, 1.0, 6, 0.55), x = W(tt, 2.6, 3.4);
  return <AbsoluteFill><Svg><Defs />
    <Breaker x={420} y={520} s={1.2} on={1} amp="10 A" />
    <Wire x1={560} x2={1400} y={540} col={BRN} th={40} />
    <path d="M 980 330 l 140 50 v 120 c 0 90 -70 150 -140 180 c -70 -30 -140 -90 -140 -180 v -120 z" fill={GRN} opacity={0.9 * cl(s)} transform={`translate(0,${(1 - s) * -200})`} stroke="#1d5a45" strokeWidth={6} />
    <g opacity={1 - 0.6 * x}><rect x={1480} y={440} width={260} height={200} rx={24} fill="#e6e6e6" /><text x={1610} y={555} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={NAVY}>APARATO</text></g>
    <line x1={1460} y1={420} x2={1760} y2={660} stroke={RED} strokeWidth={14 * x} strokeLinecap="round" />
  </Svg>
    <Lbl tt={tt} at={1.4} x={980} y={820} tx="CUIDA EL CABLE" bg={GRN} />
  </AbsoluteFill>;
}}</Stage>;

// 11 · la llave tiene que cortar la fase: la llave salta al neutro y el portalámpara queda con tensión
const Llave: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const bad = W(tt, 3.6, 4.4), live = 0.5 + 0.5 * Math.sin(tt * 6);
  return <AbsoluteFill><Svg><Defs />
    <line x1={200} y1={380} x2={1500} y2={380} stroke="#8a4b20" strokeWidth={22} strokeLinecap="round" />
    <line x1={200} y1={700} x2={1500} y2={700} stroke={BLU} strokeWidth={22} strokeLinecap="round" />
    <line x1={1500} y1={380} x2={1600} y2={450} stroke="#8a4b20" strokeWidth={22} /><line x1={1500} y1={700} x2={1600} y2={630} stroke={BLU} strokeWidth={22} />
    <text x={200} y={340} fontFamily={FONT} fontWeight={900} fontSize={42} fill={CUL}>FASE</text>
    <text x={200} y={770} fontFamily={FONT} fontWeight={900} fontSize={42} fill={BLU}>NEUTRO</text>
    <g transform={`translate(1000,${lp(380, 700, bad)})`}><rect x={-70} y={-46} width={140} height={92} rx={14} fill={INK} stroke={NAVY} strokeWidth={4} /><line x1={-44} y1={10} x2={40} y2={-26} stroke={NAVY} strokeWidth={10} /></g>
    <g transform="translate(1640,540)"><circle r={110} fill="#2b3640" stroke={bad > 0.5 ? RED : "#9aa3ab"} strokeWidth={12} /><circle r={60} fill={bad > 0.5 ? `rgba(232,67,46,${0.4 + 0.5 * live})` : "#3b4652"} /></g>
  </Svg>
    <Lbl tt={tt} at={1.2} x={1000} y={240} tx="LA LLAVE CORTA LA FASE" bg={GRN} />
    <Lbl tt={tt} at={4.6} x={1600} y={780} tx="SIGUE CON TENSIÓN" bg={RED} col={INK} />
  </AbsoluteFill>;
}}</Stage>;

// 12 · llave apagada + punta del buscapolo en el portalámpara: si prende, están cambiados
const Buscapolo: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const tip = W(tt, 0.8, 2.2), on = tt > 2.4 ? 0.6 + 0.4 * Math.sin(tt * 12) : 0;
  return <AbsoluteFill><Svg><Defs />
    <g transform="translate(760,360)"><rect x={-120} y={-60} width={240} height={90} rx={10} fill="#e8e3d6" /><path d="M -90 30 h 180 l -30 220 h -120 z" fill="#d8d2c2" stroke="#a49d8c" strokeWidth={5} />
      {Array.from({ length: 6 }, (_, i) => <line key={i} x1={-70} y1={70 + i * 30} x2={70} y2={80 + i * 30} stroke="#8d8676" strokeWidth={6} />)}</g>
    <g transform={`translate(${lp(1500, 860, tip)},${lp(760, 600, tip)}) rotate(-58)`}>
      <rect x={-24} y={-300} width={48} height={320} rx={16} fill="#2a6fd6" /><rect x={-9} y={20} width={18} height={110} fill="#c8ccd0" />
      <rect x={-16} y={-230} width={32} height={80} rx={8} fill={on ? `rgba(255,80,40,${on})` : "#5a2a22"} />
      {on > 0 && <circle cx={0} cy={-190} r={70} fill="#ff5a2a" opacity={on * 0.45} filter="url(#glow)" />}
    </g>
    <g transform="translate(1500,300)"><rect x={-70} y={-50} width={140} height={100} rx={14} fill={INK} /><line x1={-40} y1={10} x2={40} y2={10} stroke={RED} strokeWidth={10} /></g>
  </Svg>
    <Lbl tt={tt} at={0.6} x={1500} y={420} tx="LLAVE APAGADA" size={36} />
    <Lbl tt={tt} at={2.8} x={760} y={900} tx="SI PRENDE: CAMBIADOS" bg={RED} col={INK} />
  </AbsoluteFill>;
}}</Stage>;

// 13 · los colores: salen tres cables del rollo con su nombre
const Colores: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const L = [["FASE", BRN, 0.4], ["NEUTRO", BLU, 1.4], ["TIERRA", "url(#vy)", 2.4]] as const;
  return <AbsoluteFill><Svg><Defs />
    {L.map(([n, c, at], i) => { const k = W(tt, at, at + 1.4); return <g key={n}>
      <Wire x1={300} x2={300 + 1100 * k} y={340 + i * 200} col={c} th={56} bare={k > 0.98 ? 40 : 0} />
      <text x={300 + 1100 * k + 70} y={358 + i * 200} fontFamily={FONT} fontWeight={900} fontSize={54} fill={INK} opacity={cl(k * 3 - 2)}>{n}</text>
    </g>; })}
  </Svg>
    <Lbl tt={tt} at={4.4} x={960} y={950} tx="CADA UNO, SU COLOR" bg={AMB} />
  </AbsoluteFill>;
}}</Stage>;

// 14 · el cobre es blando: calor y frío, el cobre se aplasta y el tornillo queda flojo
const Tornillo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const cyc = Math.sin(tt * 2.2), up = W(tt, 0.5, 6.5) * 40, heat = cl(cyc);
  return <AbsoluteFill><Svg><Defs />
    <rect x={560} y={560} width={800} height={160} rx={20} fill="#c9a24a" stroke="#7a5a1a" strokeWidth={8} />
    <Wire x1={200} x2={900} y={640} col={BRN} th={60} />
    <rect x={820} y={622 + up * 0.15} width={360} height={36 - up * 0.3} rx={10} fill="url(#cuL)" />
    <g transform={`translate(1000,${470 - up})`}><rect x={-40} y={30} width={80} height={110 + up} fill="#7d868f" /><rect x={-70} y={-30} width={140} height={60} rx={10} fill="#9aa3ab" /><line x1={-50} y1={0} x2={50} y2={0} stroke="#4b535a" strokeWidth={10} /></g>
    <rect x={560} y={560} width={800} height={160} rx={20} fill={RED} opacity={heat * 0.35} filter="url(#glow)" />
  </Svg>
    <Lbl tt={tt} at={1.0} x={1500} y={330} tx={cyc > 0 ? "CALOR" : "FRÍO"} bg={cyc > 0 ? RED : BLU} col={INK} />
    <Lbl tt={tt} at={3.4} x={960} y={880} tx="EL TORNILLO QUEDA FLOJO" />
  </AbsoluteFill>;
}}</Stage>;

// 15 · el pelado justo: tres puntas sobre una regla; pasa sólo la de 1 cm
const Pelado: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const L = [[2.0, "✗", RED, 0.3, "2 cm"], [0.2, "✗", RED, 1.3, "poco"], [1.0, "✓", GRN, 2.5, "1 cm"]] as const;
  return <AbsoluteFill><Svg><Defs />
    <rect x={300} y={840} width={1320} height={90} fill="#f2d21b" stroke="#a88208" strokeWidth={4} />
    {Array.from({ length: 27 }, (_, i) => <line key={i} x1={300 + i * 50} y1={840} x2={300 + i * 50} y2={i % 2 ? 870 : 895} stroke="#3b2a05" strokeWidth={4} />)}
    {L.map(([cm, m, c, at, lb], i) => { const s = P(tt, at, 7, 0.55); return <g key={i} opacity={cl(s * 2)} transform={`translate(0,${(1 - s) * -300})`}>
      <Wire x1={300} x2={1000} y={330 + i * 170} col={BRN} th={52} bare={cm * 200} />
      <text x={1560} y={360 + i * 170} fontFamily={FONT} fontWeight={900} fontSize={90} fill={c}>{m}</text>
      <text x={1030 + cm * 200} y={348 + i * 170} fontFamily={FONT} fontWeight={900} fontSize={44} fill={INK}>{lb}</text>
    </g>; })}
  </Svg></AbsoluteFill>;
}}</Stage>;

// 16 · los empalmes escondidos: casa en corte, cuatro puntos rojos que laten
const Escondidos: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const pts = [[560, 600, "PARED", 0.8], [960, 380, "CIELORRASO", 2.0], [1340, 600, "PLACARD", 3.2], [1620, 790, "MACETA", 4.4]] as const;
  return <AbsoluteFill><Svg><Defs />
    <path d="M 300 340 L 960 120 L 1620 340 V 900 H 300 Z" fill="#26323d" stroke="#9aa3ab" strokeWidth={8} />
    <line x1={300} y1={340} x2={1620} y2={340} stroke="#9aa3ab" strokeWidth={6} /><line x1={960} y1={340} x2={960} y2={900} stroke="#9aa3ab" strokeWidth={6} />
    <rect x={1240} y={420} width={200} height={420} fill="#3b2a1d" stroke="#9aa3ab" strokeWidth={4} />
    <path d="M 1560 800 h 120 l -20 100 h -80 z" fill="#8a4b20" />
    {pts.map(([x, y, n, at]) => { const s = P(tt, at, 8, 0.45), pu = 0.5 + 0.5 * Math.sin(tt * 5 + x); return <g key={n} opacity={cl(s * 2)}>
      <circle cx={x} cy={y} r={30 + 30 * pu} fill={RED} opacity={0.35} /><circle cx={x} cy={y} r={22} fill={RED} />
      <text x={x} y={y - 56} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={INK}>{n}</text>
    </g>; })}
  </Svg></AbsoluteFill>;
}}</Stage>;

// 17 · todo empalme va en caja con tapa: se abre la tapa y adentro, dos bornes prolijos
const CajaTapa: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const lid = W(tt, 1.0, 2.4);
  return <AbsoluteFill><Svg><Defs />
    <Box x={960} y={500} lid={lid}>
      <Wire x1={-250} x2={-40} y={-40} col={BRN} th={26} /><Wire x1={40} x2={250} y={-40} col={BRN} th={26} />
      <Wire x1={-250} x2={-40} y={60} col={BLU} th={26} /><Wire x1={40} x2={250} y={60} col={BLU} th={26} />
      <rect x={-50} y={-70} width={100} height={60} rx={10} fill="rgba(255,255,255,.75)" /><rect x={-50} y={30} width={100} height={60} rx={10} fill="rgba(255,255,255,.75)" />
    </Box>
  </Svg>
    <Lbl tt={tt} at={2.6} x={960} y={870} tx="CON TAPA · A LA VISTA" bg={GRN} />
  </AbsoluteFill>;
}}</Stage>;

// 18 · el nido: la tapa se levanta y doce cables saltan como resorte
const Nido: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const lid = W(tt, 0.8, 1.4), sp = P(tt, 1.3, 6, 0.3);
  const cols = [BRN, BLU, "#2b2b2b", "#c23a2a", "#3fa34d", BRN, BLU, "#2b2b2b", "#c23a2a", BRN, BLU, "#f2d21b"];
  return <AbsoluteFill><Svg><Defs />
    <Box x={900} y={620} lid={lid} metal>
      {cols.map((c, i) => { const a = -170 + i * 30; return <path key={i} d={`M ${-220 + i * 40} 120 C ${-200 + i * 30} 0, ${a * sp} ${-120 - 160 * sp}, ${a * 1.8 * sp} ${-200 - 240 * sp}`} fill="none" stroke={c} strokeWidth={22} strokeLinecap="round" />; })}
    </Box>
  </Svg>
    <Big tt={tt} at={2.0} x={1600} y={380} tx="12" col={RED} size={190} />
    <Lbl tt={tt} at={2.4} x={1600} y={560} tx="CABLES EN UNA CAJA" />
  </AbsoluteFill>;
}}</Stage>;

// 19 · el calor se pasa al de al lado: mapa térmico que se contagia del centro a los costados
const Fiebre: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = W(tt, 0.6, 5.0);
  return <AbsoluteFill><Svg><Defs />
    {Array.from({ length: 10 }, (_, i) => { const d = Math.abs(i - 4.5) / 5, heat = cl(k * 1.6 - d); return <g key={i}>
      <rect x={520 + i * 90} y={300} width={60} height={480} rx={30} fill={`rgb(${lp(70, 255, heat)},${lp(110, 80, heat)},${lp(160, 30, heat)})`} />
      <circle cx={550 + i * 90} cy={540} r={46} fill={`rgba(255,90,20,${heat * 0.5})`} filter="url(#glow)" />
    </g>; })}
  </Svg>
    <Lbl tt={tt} at={2.4} x={960} y={880} tx="SE CONTAGIA EL CALOR" bg={RED} col={INK} />
  </AbsoluteFill>;
}}</Stage>;

// 20 · el cable a tierra se lleva la falla: con tierra el disyuntor salta; sin tierra, la carcasa espera
const Tierra: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = W(tt, 0.8, 3.0), no = W(tt, 4.4, 5.4), dot = (tt * 0.7) % 1;
  return <AbsoluteFill><Svg><Defs />
    <rect x={500} y={300} width={420} height={480} rx={30} fill="#e9eef2" stroke="#9aa3ab" strokeWidth={8} /><circle cx={710} cy={540} r={140} fill="#9fb3c2" stroke="#6b7e8c" strokeWidth={14} />
    <path d="M 920 700 H 1300 V 900 H 1700" fill="none" stroke="url(#vy)" strokeWidth={22} opacity={1 - no} />
    {no < 0.5 && <circle cx={dot < 0.5 ? lp(920, 1300, dot * 2) : lp(1300, 1700, dot * 2 - 1)} cy={dot < 0.5 ? 700 : 900} r={18} fill={AMB} opacity={k} />}
    <g transform="translate(1500,460)" opacity={1 - no}><Breaker x={0} y={0} s={0.8} on={k > 0.9 ? 0 : 1} amp="ID" /></g>
    <circle cx={710} cy={540} r={240} fill={RED} opacity={no * (0.25 + 0.15 * Math.sin(tt * 8))} filter="url(#glow)" />
  </Svg>
    <Lbl tt={tt} at={2.2} x={1500} y={720} tx="SALTA EL DISYUNTOR" bg={GRN} />
    <Lbl tt={tt} at={5.4} x={710} y={880} tx="SIN TIERRA: ESPERA" bg={RED} col={INK} />
  </AbsoluteFill>;
}}</Stage>;

// 21 · térmica y disyuntor no son lo mismo: uno cuida el cable, el otro a las personas
const Guardianes: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const a = P(tt, 0.4), b = P(tt, 1.8), test = W(tt, 4, 4.4);
  return <AbsoluteFill><Svg><Defs />
    <g opacity={cl(a * 2)} transform={`translate(0,${(1 - a) * 300})`}><Breaker x={560} y={460} s={1.25} on={1} amp="10 A" /><text x={560} y={800} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={AMB}>EL CABLE</text></g>
    <g opacity={cl(b * 2)} transform={`translate(0,${(1 - b) * 300})`}>
      <rect x={1180} y={250} width={300} height={420} rx={16} fill="#f4f4f2" stroke="#9aa3ab" strokeWidth={4} />
      <circle cx={1330} cy={330} r={34} fill={test ? "#c8ccd0" : "#2a6fd6"} /><text x={1330} y={343} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={INK}>T</text>
      <rect x={1290} y={lp(420, 520, test)} width={80} height={60} rx={8} fill={test > 0.5 ? RED : GRN} />
      <text x={1330} y={800} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={GRN}>LAS PERSONAS</text>
    </g>
  </Svg>
    <Lbl tt={tt} at={4.6} x={1330} y={920} tx="BOTÓN T · 1 VEZ POR MES" bg={AMB} size={40} />
  </AbsoluteFill>;
}}</Stage>;

// 22 · el puente tierra-neutro: un cablecito une las dos patas y se tacha
const Puente: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const j = W(tt, 0.8, 2.2), x = W(tt, 3.2, 3.9);
  const T = [["F", 760, BRN], ["N", 960, BLU], ["T", 1160, "url(#vy)"]] as const;
  return <AbsoluteFill><Svg><Defs />
    <rect x={620} y={240} width={680} height={600} rx={30} fill="#3a3f45" stroke="#9aa3ab" strokeWidth={8} />
    {T.map(([n, x0, c]) => <g key={n}><line x1={x0} y1={470} x2={x0} y2={820} stroke={c} strokeWidth={30} /><circle cx={x0} cy={420} r={50} fill="#c9a24a" /><text x={x0} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={INK}>{n}</text></g>)}
    <path d={`M 1160 420 C 1100 ${420 - 140 * j}, 1020 ${420 - 140 * j}, 960 420`} fill="none" stroke={CUL} strokeWidth={14} />
    <line x1={600} y1={220} x2={1320} y2={860} stroke={RED} strokeWidth={30 * x} strokeLinecap="round" /><line x1={1320} y1={220} x2={600} y2={860} stroke={RED} strokeWidth={30 * x} strokeLinecap="round" />
  </Svg>
    <Lbl tt={tt} at={3.9} x={960} y={950} tx="ESO NO ES TIERRA" bg={RED} col={INK} />
  </AbsoluteFill>;
}}</Stage>;

// 23 · la cadena del calor: cuatro eslabones en rueda que se va poniendo roja
const Cadena: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const L = ["POCOS PUNTOS", "CALOR", "SE DILATA", "SE AFLOJA"], rot = tt * 22, heat = cl(tt / 8);
  return <AbsoluteFill><Svg><Defs />
    <circle cx={960} cy={520} r={300} fill="none" stroke={`rgb(255,${lp(190, 70, heat)},40)`} strokeWidth={14} strokeDasharray="30 22" transform={`rotate(${rot} 960 520)`} />
    <circle cx={960} cy={520} r={120} fill="url(#hot)" opacity={0.25 + 0.6 * heat} filter="url(#glow)" />
    {L.map((n, i) => { const a = (i / 4) * Math.PI * 2 - Math.PI / 2, s = P(tt, 0.4 + i * 0.9, 8, 0.5); return <g key={n} opacity={cl(s * 2)} transform={`translate(${960 + 330 * Math.cos(a)},${520 + 330 * Math.sin(a)}) scale(${0.5 + 0.5 * s})`}>
      <rect x={-180} y={-50} width={360} height={100} rx={50} fill={i === 1 ? RED : "#1d2b3a"} stroke={AMB} strokeWidth={5} />
      <text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={INK}>{n}</text>
    </g>; })}
  </Svg></AbsoluteFill>;
}}</Stage>;

// 24 · el borne de palanca: entra el cable y la palanquita baja
const Palanca: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const S = [[0, W(tt, 0.5, 1.6), W(tt, 1.8, 2.3)], [1, W(tt, 2.6, 3.6), W(tt, 3.8, 4.3)]];
  return <AbsoluteFill><Svg><Defs />
    {S.map(([i, k]) => <Wire key={"w" + i} x1={lp(-300, 300, k)} x2={lp(200, 840, k)} y={480 + i * 130} col={BRN} th={40} bare={60} />)}
    <rect x={760} y={380} width={420} height={340} rx={30} fill="rgba(220,235,245,.55)" stroke="#cfe0ea" strokeWidth={6} />
    {S.map(([i, , lv]) => <rect key={"p" + i} x={900} y={420 + i * 130} width={240} height={46} rx={14} fill="#ff8a1a" transform={`rotate(${-38 * (1 - lv)} 900 ${443 + i * 130})`} />)}
  </Svg>
    <Lbl tt={tt} at={4.5} x={960} y={850} tx="APRIETA SOLO" bg={GRN} />
  </AbsoluteFill>;
}}</Stage>;

// 25 · el test de cinco minutos: los cinco pasos se encienden en orden
const Test5: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const L = ["DORSO DE LA MANO", "MARCAS NEGRAS", "OLOR A QUEMADO", "LUZ QUE TITILA", "BOTÓN DEL DISYUNTOR"];
  return <AbsoluteFill><Svg><Defs />
    {L.map((n, i) => { const s = P(tt, 0.4 + i * 1.0, 8, 0.5); return <g key={n} opacity={cl(s * 2)} transform={`translate(${(1 - s) * -400},0)`}>
      <circle cx={480} cy={260 + i * 130} r={46} fill={AMB} /><text x={480} y={278 + i * 130} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={NAVY}>{i + 1}</text>
      <text x={560} y={278 + i * 130} fontFamily={FONT} fontWeight={900} fontSize={54} fill={INK}>{n}</text>
    </g>; })}
  </Svg><Lbl tt={tt} at={5.6} x={1580} y={180} tx="SIN ABRIR NADA" hand bg="transparent" col={AMB} size={60} /></AbsoluteFill>;
}}</Stage>;

// 26 · la revisión del sábado: plano de la casa, la ruta 1-5 se dibuja
const Sabado: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const pts = [[520, 320, "TABLERO"], [880, 320, "TOMAS"], [1300, 320, "CAJAS"], [1300, 720, "LLAVES"], [700, 720, "DISYUNTOR"]] as const;
  const k = W(tt, 0.6, 6.0);
  const path = pts.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
  return <AbsoluteFill><Svg><Defs />
    <rect x={380} y={180} width={1160} height={680} fill="rgba(238,241,243,.12)" stroke="#9aa3ab" strokeWidth={6} />
    <line x1={1080} y1={180} x2={1080} y2={860} stroke="#9aa3ab" strokeWidth={4} /><line x1={380} y1={520} x2={1540} y2={520} stroke="#9aa3ab" strokeWidth={4} />
    <path d={path} fill="none" stroke={AMB} strokeWidth={10} strokeDasharray="1700" strokeDashoffset={1700 * (1 - k)} strokeLinecap="round" />
    {pts.map(([x, y, n], i) => { const s = cl(k * 4 - i + 0.6); return <g key={n} opacity={s}><circle cx={x} cy={y} r={40} fill={AMB} /><text x={x} y={y + 16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={NAVY}>{i + 1}</text><text x={x} y={y + 90} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={INK}>{n}</text></g>; })}
  </Svg></AbsoluteFill>;
}}</Stage>;

// 27 · las tres reglas de Don Héctor escritas en su libreta, renglón por renglón
const Hector: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const L = ["1. Térmica bajada no alcanza", "2. Ningún empalme sin caja", "3. Una sola mano"];
  const s = P(tt, 0.1, 6, 0.6);
  return <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: 1200, height: 700, background: "repeating-linear-gradient(#f7f1df 0 118px, #b8cfe0 118px 120px)", borderRadius: 10, boxShadow: "0 40px 90px rgba(0,0,0,.55)", transform: `translateY(${(1 - s) * 700}px) rotate(${-2 + 2 * (1 - s)}deg)`, padding: "50px 80px 0 110px", position: "relative", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", left: 80, top: 0, bottom: 0, width: 4, background: "#e08b8b" }} />
      <div style={{ fontFamily: HAND, fontSize: 64, color: "#7a2a1a", fontWeight: 700, height: 120 }}>Don Héctor</div>
      {L.map((l, i) => { const k = cl((tt - 1.0 - i * 1.6) / 1.4); return <div key={i} style={{ fontFamily: HAND, fontSize: 70, color: "#1b2a4a", fontWeight: 700, height: 120, overflow: "hidden", whiteSpace: "nowrap", width: `${k * 100}%` }}>{l}</div>; })}
    </div>
  </AbsoluteFill>;
}}</Stage>;

// 28 · una mano o dos: con dos, la corriente cruza el pecho; con una, no
const UnaMano: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const one = W(tt, 3.6, 4.4), dot = (tt * 0.9) % 1;
  const body = (x: number, right: boolean) => <g transform={`translate(${x},0)`}><circle cx={0} cy={300} r={70} fill="#2b3640" /><rect x={-90} y={380} width={180} height={300} rx={60} fill="#2b3640" />
    <path d="M -90 420 L -260 520" stroke="#2b3640" strokeWidth={50} strokeLinecap="round" />{right ? <path d="M 90 420 L 150 560 L 110 640" stroke="#2b3640" strokeWidth={50} fill="none" strokeLinecap="round" /> : <path d="M 90 420 L 260 520" stroke="#2b3640" strokeWidth={50} strokeLinecap="round" />}
    <path d="M -10 470 c -30 -40 -70 0 0 50 c 70 -50 30 -90 0 -50" fill={RED} /></g>;
  return <AbsoluteFill><Svg><Defs />
    {body(560, false)}<g opacity={0.3 + 0.7 * one}>{body(1360, true)}</g>
    <path d="M 300 520 L 470 450 L 650 450 L 820 520" fill="none" stroke={AMB} strokeWidth={10} strokeDasharray="20 14" />
    <circle cx={lp(300, 820, dot)} cy={dot < 0.33 ? lp(520, 450, dot * 3) : dot < 0.66 ? 450 : lp(450, 520, (dot - 0.66) * 3)} r={18} fill={AMB} />
  </Svg>
    <Lbl tt={tt} at={1.4} x={560} y={830} tx="DOS MANOS: EL CORAZÓN" bg={RED} col={INK} size={40} />
    <Lbl tt={tt} at={4.4} x={1360} y={830} tx="UNA SOLA MANO" bg={GRN} />
  </AbsoluteFill>;
}}</Stage>;

// 29 · tres cosas que dicen en las casas: tres frases y el sello MENTIRA
const Mitos: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const L = ["«Nunca pasó nada»", "«Si no salta, aguanta»", "«220 no te mata»"];
  return <AbsoluteFill>{L.map((l, i) => { const s = P(tt, 0.3 + i * 1.6, 8, 0.5), st = P(tt, 1.0 + i * 1.6, 10, 0.35); return <div key={i} style={{ position: "absolute", left: 300, top: 220 + i * 230, opacity: cl(s * 2), transform: `translateX(${(1 - s) * -300}px)` }}>
    <div style={{ fontFamily: HAND, fontSize: 84, fontWeight: 700, color: INK, textShadow: "0 8px 20px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{l}</div>
    <div style={{ position: "absolute", left: 900, top: 0, padding: "6px 24px", border: `8px solid ${RED}`, color: RED, background: "rgba(255,255,255,.85)", fontFamily: FONT, fontWeight: 900, fontSize: 64, transform: `rotate(-8deg) scale(${2.2 - 1.2 * st})`, opacity: cl(st * 2), borderRadius: 10 }}>MENTIRA</div>
  </div>; })}</AbsoluteFill>;
}}</Stage>;

// 30 · la cinta aísla, no sostiene: el empalme con cinta se separa cuando tiran
const Cinta: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const pull = W(tt, 2.6, 4.0) * 160;
  return <AbsoluteFill><Svg><Defs />
    <Wire x1={300} x2={960 - pull} y={420} col={BRN} th={46} bare={50} /><Wire x1={960 + pull} x2={1500} y={420} col={BRN} th={46} bare={50} dir={-1} />
    <rect x={880 - pull * 0.5} y={385} width={160} height={70} rx={10} fill="#1d1d1d" opacity={1 - cl(pull / 160) * 0.5} />
    <Wire x1={300} x2={1500} y={720} col={BRN} th={46} />
    <rect x={900} y={685} width={120} height={70} rx={10} fill="#1d1d1d" />
  </Svg>
    <Lbl tt={tt} at={1.0} x={1700} y={720} tx="AÍSLA ✓" bg={GRN} />
    <Lbl tt={tt} at={4.0} x={1700} y={420} tx="SOSTIENE ✗" bg={RED} col={INK} />
  </AbsoluteFill>;
}}</Stage>;

// 31 · cada cuánto: calendario del botón (1 por mes) y la revisión completa (10 años)
const Calendario: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = P(tt, 0.2, 7, 0.55), m = Math.floor(cl((tt - 1.2) / 3) * 12);
  return <AbsoluteFill><Svg><Defs />
    <g transform={`translate(0,${(1 - s) * -600})`}>
      <rect x={360} y={240} width={640} height={600} rx={20} fill="#f6f2e8" /><rect x={360} y={240} width={640} height={110} rx={20} fill={RED} />
      {Array.from({ length: 12 }, (_, i) => <g key={i}><rect x={400 + (i % 4) * 150} y={390 + Math.floor(i / 4) * 140} width={120} height={110} rx={12} fill={i < m ? GRN : "#e2dccc"} /><text x={460 + (i % 4) * 150} y={460 + Math.floor(i / 4) * 140} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={NAVY}>T</text></g>)}
    </g>
  </Svg>
    <Lbl tt={tt} at={1.4} x={680} y={295} tx="1 VEZ POR MES" bg="transparent" col={INK} />
    <Big tt={tt} at={3.8} x={1420} y={480} tx="10" size={260} />
    <Lbl tt={tt} at={4.2} x={1420} y={680} tx="AÑOS · ELECTRICISTA" />
  </AbsoluteFill>;
}}</Stage>;

// 32 · el semáforo de lo que podés hacer vos
const Semaforo: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const L = [[GRN, "MIRAR · OLER · BOTÓN", 0.5], [AMB, "TOMAS: SI SABÉS", 2.2], [RED, "TABLERO: MATRICULADO", 3.9]] as const;
  return <AbsoluteFill><Svg><Defs />
    <rect x={420} y={180} width={260} height={720} rx={60} fill="#1b232b" stroke="#4b535a" strokeWidth={8} />
    {L.map(([c, n, at], i) => { const on = W(tt, at, at + 0.5); return <g key={i}>
      <circle cx={550} cy={300 + i * 240} r={90} fill={c} opacity={0.18 + 0.82 * on} />{on > 0 && <circle cx={550} cy={300 + i * 240} r={120} fill={c} opacity={on * 0.3} filter="url(#glow)" />}
      <text x={760} y={318 + i * 240} fontFamily={FONT} fontWeight={900} fontSize={54} fill={INK} opacity={on}>{n}</text>
    </g>; })}
  </Svg></AbsoluteFill>;
}}</Stage>;

// 33 · tibio o caliente: termómetro al lado del toma
const Tibio: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = tt < 3.5 ? W(tt, 0.6, 2.4) * 0.45 : 0.45 + W(tt, 3.6, 5.0) * 0.5;
  return <AbsoluteFill><Svg><Defs />
    <Socket x={640} y={540} s={1.1} tint={k} />
    <rect x={1240} y={220} width={90} height={600} rx={45} fill="#e9eef2" /><circle cx={1285} cy={860} r={80} fill={k > 0.6 ? RED : AMB} />
    <rect x={1262} y={820 - 580 * k} width={46} height={580 * k} rx={23} fill={k > 0.6 ? RED : AMB} />
    <rect x={1350} y={560} width={30} height={260} fill={GRN} opacity={0.7} /><rect x={1350} y={240} width={30} height={300} fill={RED} opacity={0.7} />
  </Svg>
    <Lbl tt={tt} at={1.6} x={1620} y={700} tx="TIBIO: OJO" bg={AMB} />
    <Lbl tt={tt} at={4.6} x={1620} y={380} tx="CALIENTE: CAMBIAR" bg={RED} col={INK} />
  </AbsoluteFill>;
}}</Stage>;

// 34 · el multímetro entre fase y tierra: 220 = la tierra está; 0 = no está conectada
const Multimetro: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const v = tt < 4.6 ? Math.round(W(tt, 0.8, 1.8) * 220) : Math.round((1 - W(tt, 4.6, 5.2)) * 220);
  return <AbsoluteFill><Svg><Defs />
    <Socket x={1260} y={540} s={1.15} />
    <rect x={340} y={240} width={420} height={640} rx={50} fill="#f2c21b" stroke="#a88208" strokeWidth={6} />
    <rect x={390} y={300} width={320} height={160} rx={16} fill="#c9d6c1" stroke="#555" strokeWidth={4} />
    <text x={690} y={420} textAnchor="end" fontFamily="monospace" fontWeight={900} fontSize={110} fill={NAVY}>{v}</text>
    <circle cx={550} cy={640} r={110} fill="#2b2b2b" />
    <path d="M 470 820 C 700 900, 1000 480, 1210 500" fill="none" stroke={RED} strokeWidth={14} />
    <path d="M 630 820 C 800 960, 1100 720, 1260 620" fill="none" stroke="#2b2b2b" strokeWidth={14} />
  </Svg>
    <Lbl tt={tt} at={1.0} x={960} y={150} tx="FASE · TIERRA" bg={GRN} />
    <Lbl tt={tt} at={2.4} x={550} y={960} tx="220 = HAY TIERRA" bg={GRN} size={40} />
    <Lbl tt={tt} at={5.4} x={1260} y={900} tx="0 = NO HAY" bg={RED} col={INK} size={40} />
  </AbsoluteFill>;
}}</Stage>;

// 35 · el repaso: siete fichas que se dan vuelta una por una
const Repaso: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const L = ["CABLE FINO", "FASE Y NEUTRO", "BORNES FLOJOS", "EMPALME SIN CAJA", "CAJA REVENTADA", "SIN TIERRA", "EMPALME CON CINTA"];
  return <AbsoluteFill>{L.map((l, i) => { const f = W(tt, 0.4 + i * 0.9, 0.9 + i * 0.9), col = i === 6 ? RED : "#1d2b3a"; return <div key={i} style={{ position: "absolute", left: (i < 4 ? 230 : 420) + (i % 4) * 380, top: 230 + Math.floor(i / 4) * 330, width: 330, height: 270, perspective: 1200 }}>
    <div style={{ width: "100%", height: "100%", borderRadius: 22, background: f > 0.5 ? col : "#f3f6f8", transform: `rotateY(${180 - 180 * f}deg)`, boxShadow: "0 24px 50px rgba(0,0,0,.45)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `5px solid ${AMB}` }}>
      {f > 0.5 && <><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 90, color: AMB, lineHeight: 1 }}>{i + 1}</div><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, color: INK, textAlign: "center", padding: "0 14px" }}>{l}</div></>}
    </div></div>; })}</AbsoluteFill>;
}}</Stage>;

export const MAP: Record<string, C> = {
  costra: Costra, amperes: Amperes, contar: Contar, regla: Regla, ayudante: Ayudante, pava: Pava, swap: Swap, capacidad: Capacidad, secciones: Secciones,
  guardia: Guardia, llave: Llave, buscapolo: Buscapolo, colores: Colores, tornillo: Tornillo, pelado: Pelado, escondidos: Escondidos, cajatapa: CajaTapa,
  nido: Nido, fiebre: Fiebre, tierra: Tierra, guardianes: Guardianes, puente: Puente, cadena: Cadena, palanca: Palanca, test5: Test5, sabado: Sabado,
  hector: Hector, unamano: UnaMano, mitos: Mitos, cinta: Cinta, calendario: Calendario, semaforo: Semaforo, tibio: Tibio, multimetro: Multimetro, repaso: Repaso,
};
