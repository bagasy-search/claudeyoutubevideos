// componentes únicos de hdc28a · el ajo de una cabeza (1 por minuto, ninguno repetido). Cada uno dibuja SU objeto
// (cabeza, diente, maceta en corte, vaso, tallo con rulo) en código; nada de plantillas ni íconos.
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

export const SKIN = "#f3eee2", FLESH = "#efe2b4", PUR = "#9a5a8e", SOIL = "#5b3f2b", SOIL2 = "#3e2a1c", LEAF = "#7dbf63", LEAF2 = "#4f8f3f", TERRA = "#b8653f";

// ===== piezas de dibujo =====
export const Bulb: React.FC<{ x: number; y: number; s?: number; pur?: boolean; round?: boolean; op?: number; rot?: number }> = ({ x, y, s = 1, pur, round, op = 1, rot = 0 }) => (
  <svg viewBox="0 0 240 300" style={{ position: "absolute", left: x - 120 * s, top: y - 150 * s, width: 240 * s, height: 300 * s, opacity: op, overflow: "visible", transform: `rotate(${rot}deg)`, filter: "drop-shadow(0 26px 30px rgba(0,0,0,.55))" }}>
    <path d="M110 30 C108 70 40 110 36 175 C32 240 80 272 120 272 C160 272 208 240 204 175 C200 110 132 70 130 30 Z" fill={SKIN} />
    {pur && <path d="M60 140 C70 200 90 250 112 270 M180 140 C170 200 150 250 128 270 M95 100 C92 170 100 230 118 270" stroke={PUR} strokeWidth={9} fill="none" opacity={0.7} />}
    {!round && <path d="M120 64 C78 120 66 200 98 268 M120 64 C162 120 174 200 142 268 M120 64 C116 150 118 220 120 272" stroke="rgba(120,100,70,.45)" strokeWidth={4} fill="none" />}
    <path d="M70 130 C60 170 62 220 88 250" stroke="rgba(255,255,255,.8)" strokeWidth={7} fill="none" strokeLinecap="round" />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M${100 + i * 7} 272 q${(i - 3) * 6} 14 ${(i - 3) * 9} 22`} stroke="#cdb994" strokeWidth={3} fill="none" />)}
  </svg>
);
export const Clove: React.FC<{ x: number; y: number; s?: number; rot?: number; peeled?: boolean; op?: number; plate?: number }> = ({ x, y, s = 1, rot = 0, peeled, op = 1, plate = 0 }) => (
  <svg viewBox="0 0 120 170" style={{ position: "absolute", left: x - 60 * s, top: y - 85 * s, width: 120 * s, height: 170 * s, opacity: op, overflow: "visible", transform: `rotate(${rot}deg)`, filter: "drop-shadow(0 14px 16px rgba(0,0,0,.5))" }}>
    <path d="M60 8 C40 50 16 100 20 138 C24 166 96 166 100 138 C104 100 80 50 60 8 Z" fill={peeled ? "#f0e6b2" : SKIN} />
    {!peeled && <path d="M60 14 C52 60 40 110 44 150 M60 14 C68 60 80 110 76 150" stroke="rgba(170,120,110,.35)" strokeWidth={3} fill="none" />}
    <path d="M36 70 C28 100 28 125 36 140" stroke="rgba(255,255,255,.8)" strokeWidth={5} fill="none" strokeLinecap="round" />
    <rect x={30} y={150} width={60} height={14} rx={6} fill="#c7aa76" />
    {plate > 0 && <rect x={24} y={146} width={72} height={22} rx={10} fill="none" stroke={AMB} strokeWidth={5} opacity={plate} />}
  </svg>
);
// maceta en corte: tierra, piso de piedritas opcional
export const Pot: React.FC<{ x: number; y: number; w: number; h: number; stones?: boolean; col?: string; children?: React.ReactNode }> = ({ x, y, w, h, stones, col = TERRA, children }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: h }}>
    <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 0, 100% 0, 91% 100%, 9% 100%)", background: `linear-gradient(90deg, ${col}, #d98a5e 45%, ${col})` }} />
    <div style={{ position: "absolute", left: "4%", right: "4%", top: 18, bottom: 14, clipPath: "polygon(0 0, 100% 0, 92% 100%, 8% 100%)", background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})` }}>
      {stones && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 46, background: "radial-gradient(circle at 20% 60%, #9a9285 0 9px, transparent 10px), radial-gradient(circle at 60% 40%, #b5ad9f 0 11px, transparent 12px), radial-gradient(circle at 85% 70%, #8b8478 0 8px, transparent 9px), #6d665c", backgroundSize: "60px 46px" }} />}
      {children}
    </div>
    <div style={{ position: "absolute", left: -10, right: -10, top: 0, height: 22, borderRadius: 6, background: "#c97650" }} />
  </div>
);
export const Leaf: React.FC<{ x: number; y: number; len: number; rot: number; w?: number; col?: string }> = ({ x, y, len, rot, w = 14, col = LEAF }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - len, width: w, height: Math.max(0, len), borderRadius: `${w}px ${w}px 4px 4px`, background: `linear-gradient(90deg, ${LEAF2}, ${col} 50%, ${LEAF2})`, transformOrigin: "50% 100%", transform: `rotate(${rot}deg)` }} />
);
export const Big: React.FC<{ x: number; y: number; txt: string; s: number; col?: string; size?: number }> = ({ x, y, txt, s, col = TX, size = 120 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * s})`, opacity: cl(s * 1.8), fontWeight: 900, fontSize: size, color: col, whiteSpace: "nowrap", textShadow: "0 10px 40px rgba(0,0,0,.6)" }}>{txt}</div>
);
export const Bar: React.FC<{ x: number; y: number; w: number; p: number; col: string; h?: number }> = ({ x, y, w, p, col, h = 26 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: h / 2, background: "rgba(255,255,255,.1)" }}><div style={{ width: `${cl(p) * 100}%`, height: "100%", borderRadius: h / 2, background: col }} /></div>
);
export const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; p: number; col?: string }> = ({ x1, y1, x2, y2, p, col = AMB }) => {
  const L = Math.hypot(x2 - x1, y2 - y1), a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  return <div style={{ position: "absolute", left: x1, top: y1 - 5, width: L * cl(p), height: 10, borderRadius: 5, background: col, transformOrigin: "0 50%", transform: `rotate(${a}deg)`, boxShadow: `0 0 18px ${col}` }}>
    {p > 0.95 && <div style={{ position: "absolute", right: -14, top: -12, width: 0, height: 0, borderLeft: `30px solid ${col}`, borderTop: "17px solid transparent", borderBottom: "17px solid transparent" }} />}
  </div>;
};
export const X: React.FC<{ x: number; y: number; p: number; s?: number }> = ({ x, y, p, s = 160 }) => p <= 0 ? null : <>
  {[45, -45].map((r, i) => <div key={i} style={{ position: "absolute", left: x - s / 2, top: y - 7, width: s * cl(p * 2 - i), height: 14, borderRadius: 7, background: RED, transform: `rotate(${r}deg)`, transformOrigin: "50% 50%", boxShadow: `0 0 20px ${RED}` }} />)}
</>;

// ---- 0:02 · 50 CENTAVOS = UNA MACETA: la moneda cae, se vuelve cabeza, la cabeza se abre en una maceta llena de hojas ----
export const HCoin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const c = phys(tt, 0.4, 6, 0.4), b = phys(tt, 1.8, 6, 0.5), m = phys(tt, 3.4, 5, 0.6);
  return <>
    <Head tt={tt} kick="EN EL MERCADO" title="UNA SOLA CABEZA" />
    <div style={{ position: "absolute", left: 360, top: 330 + (1 - c) * -300, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff1b8, #d6a43a 60%, #9b6f1c)", boxShadow: "0 30px 50px rgba(0,0,0,.5), inset 0 0 0 10px rgba(150,100,20,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 80, color: "#6b4a10", opacity: cl(c * 2) }}>50¢</div>
    <Arrow x1={620} y1={440} x2={780} y2={440} p={cl((tt - 1.4) * 2)} />
    <Bulb x={960} y={450} s={0.9 * b + 0.01} pur />
    <Arrow x1={1130} y1={440} x2={1290} y2={440} p={cl((tt - 3) * 2)} />
    <div style={{ opacity: cl(m * 2), transform: `scale(${0.7 + 0.3 * m})`, transformOrigin: "1550px 700px" }}>
      <Pot x={1550} y={520} w={340} h={260}>{null}</Pot>
      {Array.from({ length: 14 }, (_, i) => <Leaf key={i} x={1430 + i * 18} y={530} len={(180 + (i * 37) % 120) * m} rot={(i - 6.5) * 4 + 2 * Math.sin(tt * 1.3 + i)} w={12} />)}
    </div>
    <Tag tt={tt} at={4.4} x={960} y={900} txt="DE UNA CABEZA, UNA MACETA ENTERA" col={AMB} size={44} />
  </>;
}}</Stage>;

// ---- 0:15 · CADA 15 DÍAS VUELVE: reloj de 15 días; la hoja crece, la tijera corta, vuelve a crecer (3 vueltas) ----
export const HRegrow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const cyc = 2.1, k = Math.max(0, tt - 0.8), ph = (k % cyc) / cyc, n = Math.floor(k / cyc), grow = ph < 0.8 ? eio(ph, 0, 0.8) : 1 - eio(ph, 0.8, 0.86) * 0.85;
  return <>
    <Head tt={tt} kick="SE CORTA Y VUELVE" title="CADA DOS SEMANAS" col={GRN} />
    <Pot x={760} y={640} w={420} h={300}>{null}</Pot>
    {Array.from({ length: 11 }, (_, i) => <Leaf key={i} x={600 + i * 32} y={655} len={60 + 300 * grow * (0.8 + 0.2 * Math.sin(i * 2.1))} rot={(i - 5) * 3.5} w={13} />)}
    <div style={{ position: "absolute", left: 600, top: 585, width: 330, height: 4, borderTop: "4px dashed rgba(255,255,255,.5)", opacity: ph > 0.75 && ph < 0.95 ? 1 : 0.25 }} />
    <div style={{ position: "absolute", left: 1270, top: 330, width: 380, height: 380, borderRadius: "50%", border: "10px solid rgba(255,255,255,.12)", background: `conic-gradient(${GRN} ${ph * 360}deg, transparent 0)`, WebkitMaskImage: "radial-gradient(circle, transparent 140px, #000 141px)", maskImage: "radial-gradient(circle, transparent 140px, #000 141px)" } as React.CSSProperties} />
    <div style={{ position: "absolute", left: 1270, top: 330, width: 380, height: 380, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontWeight: 900, fontSize: 120 }}>{Math.min(15, Math.round(ph * 15))}</div><div style={{ fontWeight: 800, fontSize: 28, color: DIM, letterSpacing: 4 }}>DÍAS</div>
    </div>
    <Tag tt={tt} at={1.2} x={1460} y={790} txt={`CORTE N.º ${Math.min(3, n + 1)}`} col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 0:40 · LA CADENA: 1 diente → 1 cabeza de 10 → 1 maceta (se arma de izquierda a derecha con peso) ----
export const HChain: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const a = phys(tt, 0.5, 6, 0.45), b = phys(tt, 1.8, 6, 0.45), c = phys(tt, 3.2, 6, 0.45);
  return <>
    <Head tt={tt} kick="LA CUENTA DEL AJO" title="DE UN DIENTE, UNA CABEZA" />
    <Clove x={380} y={520} s={1.3 * a + 0.01} />
    <Tag tt={tt} at={0.9} x={380} y={720} txt="1 DIENTE" size={36} />
    <Arrow x1={520} y1={520} x2={700} y2={520} p={cl((tt - 1.3) * 2)} />
    <Bulb x={920} y={500} s={1.05 * b + 0.01} />
    <Tag tt={tt} at={2.3} x={920} y={720} txt="8 · 10 · 12 DIENTES" col={AMB} size={36} />
    <Arrow x1={1110} y1={520} x2={1290} y2={520} p={cl((tt - 2.7) * 2)} />
    <div style={{ opacity: cl(c * 2) }}>
      {Array.from({ length: 10 }, (_, i) => <Clove key={i} x={1430 + (i % 5) * 70} y={430 + Math.floor(i / 5) * 150 + (1 - c) * -80} s={0.62} rot={(i % 5 - 2) * 8} />)}
    </div>
    <Tag tt={tt} at={3.8} x={1570} y={720} txt="1 MACETA" size={36} />
  </>;
}}</Stage>;

// ---- 1:05 · EL HUMO vs LA VERDAD: "1 semana, cientos" se tacha; "7-8 meses" crece en una barra de calendario ----
export const HMyth: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const x = cl((tt - 1.6) * 1.5), m = eio(tt, 2.6, 5.2);
  return <>
    <Head tt={tt} kick="LO QUE DICEN LOS VIDEOS" title="NO ES ASÍ" col={RED} />
    <div style={{ position: "absolute", left: 300, top: 300, width: 640, height: 300, borderRadius: 28, background: "rgba(255,255,255,.06)", border: "2px solid rgba(255,255,255,.15)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 70, fontWeight: 900, color: DIM }}>1 SEMANA</div><div style={{ fontSize: 40, fontWeight: 800, color: DIM }}>= CIENTOS DE AJOS</div>
    </div>
    <X x={620} y={450} p={x} s={520} />
    <div style={{ position: "absolute", left: 300, top: 720, display: "flex", gap: 10 }}>
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ width: 100, height: 120, borderRadius: 12, background: i < 8 ? `rgba(111,227,154,${0.15 + 0.6 * cl(m * 8 - i)})` : "rgba(255,255,255,.06)", border: "2px solid rgba(255,255,255,.12)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 10, fontWeight: 800, fontSize: 24, color: DIM }}>{"MAMJJASONDEF"[i]}</div>)}
    </div>
    <Big x={1400} y={450} txt="7-8 MESES" s={phys(tt, 2.4, 6, 0.5)} col={GRN} size={110} />
    <Tag tt={tt} at={3.2} x={1400} y={560} txt="UNA CABEZA DE VERDAD" col={TX} size={36} />
  </>;
}}</Stage>;

// ---- 1:22 · ARRIBA Y ABAJO: corte de la tierra; arriba hojas que se cortan todo el año, abajo la cabeza que engorda ----
export const HAboveBelow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const g = eio(tt, 0.6, 5.5), cut = Math.sin(tt * 2.4) > 0.6;
  return <>
    <Head tt={tt} kick="AL MISMO TIEMPO" title="ARRIBA HOJAS · ABAJO CABEZA" col={GRN} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, bottom: 0, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 552, height: 14, background: "#6e5038" }} />
    {Array.from({ length: 9 }, (_, i) => <Leaf key={i} x={880 + i * 20} y={560} len={cut && i % 2 ? 120 : 200 + 120 * Math.sin(i * 1.7) ** 2} rot={(i - 4) * 7} w={14} />)}
    <Bulb x={960} y={760} s={0.25 + 0.75 * g} />
    <Tag tt={tt} at={1} x={420} y={380} txt="ARRIBA: AJO TIERNO" col={GRN} size={42} />
    <Tag tt={tt} at={1.3} x={420} y={440} txt="CASI TODO EL AÑO" col={DIM} size={30} />
    <Tag tt={tt} at={2.2} x={1500} y={760} txt="ABAJO: LA CABEZA" col={AMB} size={42} />
    <Tag tt={tt} at={2.5} x={1500} y={820} txt={`MES ${Math.max(1, Math.round(1 + g * 7))} DE 8`} col={DIM} size={30} />
  </>;
}}</Stage>;

// ---- 1:55 · EL MAPA DE LOS SIETE: siete estacas de huerto clavadas en fila, cada una con su paso ----
export const HSeven: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const L = ["ELEGIR", "SEPARAR", "MACETA", "PLANTAR", "RIEGO Y SOL", "LA FLOR", "COSECHAR"];
  return <>
    <Head tt={tt} kick="EL CAMINO DE HOY" title="SIETE PASOS" />
    <div style={{ position: "absolute", left: 0, right: 0, top: 760, bottom: 0, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})` }} />
    {L.map((s, i) => { const p = phys(tt, 0.4 + i * 0.45, 7, 0.45); return <div key={i} style={{ position: "absolute", left: 190 + i * 230, top: 360 + (1 - p) * -420, width: 190, opacity: cl(p * 3) }}>
      <div style={{ height: 150, borderRadius: 10, background: i === 5 ? "linear-gradient(180deg,#ffd27a,#e0a440)" : "linear-gradient(180deg,#e9d6b0,#c9ad7d)", color: "#3b2a18", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 30px rgba(0,0,0,.45)" }}>
        <div style={{ fontWeight: 900, fontSize: 60 }}>{i + 1}</div><div style={{ fontWeight: 800, fontSize: 22, textAlign: "center" }}>{s}</div>
      </div>
      <div style={{ margin: "0 auto", width: 22, height: 300, background: "linear-gradient(90deg,#8c6a42,#b48a5a,#8c6a42)" }} />
    </div>; })}
    <Tag tt={tt} at={4} x={1575} y={300} txt="EL QUE HACE LA CABEZA GRANDE" col={AMB} size={30} />
  </>;
}}</Stage>;

// ---- 2:40 · 30 AÑOS: tres lugares (quinta, patio, balcón) se encienden con su contador ----
export const HYears30: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const L: [string, string][] = [["QUINTAS", ""], ["PATIOS", ""], ["BALCONES", ""]];
  const n = Math.round(30 * eio(tt, 0.4, 2.6));
  return <>
    <Head tt={tt} kick="CLAUDIO" title="CON LAS MANOS EN LA TIERRA" />
    <Big x={960} y={380} txt={`${n} AÑOS`} s={phys(tt, 0.3, 6, 0.5)} col={AMB} size={150} />
    {L.map(([s], i) => { const p = phys(tt, 2.4 + i * 0.5, 6, 0.5); return <div key={i} style={{ position: "absolute", left: 360 + i * 420, top: 580, width: 360, height: 300, borderRadius: 26, background: "rgba(255,255,255,.06)", border: "2px solid rgba(255,255,255,.14)", opacity: cl(p * 2), transform: `translateY(${(1 - p) * 60}px)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 90, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})` }} />
      {i === 0 && Array.from({ length: 6 }, (_, k) => <Leaf key={k} x={50 + k * 52} y={212} len={90} rot={(k % 2 ? 6 : -6)} w={12} />)}
      {i === 1 && <><Pot x={120} y={120} w={120} h={90}>{null}</Pot><Pot x={250} y={140} w={100} h={70}>{null}</Pot></>}
      {i === 2 && <><div style={{ position: "absolute", left: 30, right: 30, top: 150, height: 8, background: "#cfd6dc" }} />{[0, 1, 2, 3, 4, 5, 6].map((k) => <div key={k} style={{ position: "absolute", left: 40 + k * 46, top: 150, width: 6, height: 70, background: "#cfd6dc" }} />)}<Pot x={180} y={70} w={110} h={80}>{null}</Pot></>}
      <div style={{ position: "absolute", left: 0, right: 0, top: 20, textAlign: "center", fontWeight: 900, fontSize: 34 }}>{s}</div>
    </div>; })}
  </>;
}}</Stage>;
