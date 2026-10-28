// componentes únicos de hdc28a · D: minutos 23-31 (la flor, la cosecha, el curado y la cuenta del ajo para siempre).
import React from "react";
import { AMB, DIM, GRN, H, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Arrow, Big, Bulb, Clove, Leaf, SOIL, SOIL2, X } from "./heroesH";

// ---- 23:35 · EL RULO: el tallo sube derecho, se enrosca como cola de cerdito y en la punta la gota cerrada ----
export const HCurl: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const g = eio(tt, 0.4, 4.2), cap = cl((tt - 3.6) * 2);
  return <>
    <Head tt={tt} kick="LA VARA FLORAL" title="EL LADRÓN DE TU CABEZA" col={RED} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 900, bottom: 0, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})` }} />
    {Array.from({ length: 6 }, (_, i) => <Leaf key={i} x={900 + i * 24} y={900} len={300 + 60 * Math.sin(i)} rot={(i - 2.5) * 14} w={18} />)}
    <svg viewBox="0 0 600 800" style={{ position: "absolute", left: 660, top: 100, width: 600, height: 800, overflow: "visible" }}>
      <path d="M300 800 C300 600 300 470 300 360 C300 200 470 200 450 320 C430 430 280 400 300 270 C310 190 340 140 360 110" stroke="#9cc56b" strokeWidth={14} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - g} />
      <path d="M360 110 C330 80 340 30 372 10 C400 30 400 80 360 110 Z" fill="#d7e6a4" opacity={cap} />
    </svg>
    <Tag tt={tt} at={2.6} x={1450} y={330} txt="HACE UN RULO" col={AMB} size={40} anchor="l" />
    <Tag tt={tt} at={3.8} x={1450} y={180} txt="LA GOTA CERRADA" col={DIM} size={34} anchor="l" />
  </>;
}}</Stage>;

// ---- 24:00 · A DÓNDE VA LA FUERZA: una corriente de luz sale de las hojas; con la flor se va arriba y la cabeza se achica ----
export const HEnergy: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const up = eio(tt, 2.4, 4.4), flow = (tt * 0.6) % 1;
  return <>
    <Head tt={tt} kick="LA ENERGÍA DE LA PLANTA" title="ARRIBA O ABAJO" />
    <div style={{ position: "absolute", left: 0, right: 0, top: 620, bottom: 0, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})` }} />
    {Array.from({ length: 6 }, (_, i) => <Leaf key={i} x={900 + i * 24} y={620} len={300} rot={(i - 2.5) * 14} w={18} />)}
    <div style={{ position: "absolute", left: 952, top: 180, width: 14, height: 440, background: "#9cc56b", opacity: up }} />
    <div style={{ position: "absolute", left: 930, top: 140, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(#f4f0d8, #c9d58e)", opacity: up, transform: `scale(${0.6 + 0.6 * up})` }} />
    {Array.from({ length: 8 }, (_, i) => { const f = (flow + i / 8) % 1, toUp = i < Math.round(8 * (0.2 + 0.6 * up)); return <div key={i} style={{ position: "absolute", left: 950, top: toUp ? 600 - 440 * f : 620 + 160 * f, width: 18, height: 18, borderRadius: "50%", background: AMB, boxShadow: `0 0 20px ${AMB}` }} />; })}
    <Bulb x={960} y={850} s={0.75 - 0.3 * up} />
    <Tag tt={tt} at={1} x={1400} y={850} txt="ABAJO: DIENTES GORDOS" col={GRN} size={36} anchor="l" />
    <Tag tt={tt} at={2.8} x={1100} y={170} txt="ARRIBA: LA FLOR" col={RED} size={36} anchor="l" />
    <Tag tt={tt} at={4.4} x={1400} y={940} txt="UN TERCIO MÁS CHICA · O LA MITAD" col={RED} size={30} anchor="l" />
  </>;
}}</Stage>;

// ---- 24:35 · LA VENTANA DEL CORTE: tres tallos (apenas asoma · con rulo · duro y derecho); el del medio se ilumina y la tijera corta ----
export const HWindow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const S: [string, string, string][] = [["APENAS ASOMA", "VUELVE A SALIR", DIM], ["CON EL RULO", "EL PUNTO", GRN], ["DURO Y DERECHO", "YA SE LLEVÓ TODO", RED]];
  const cut = eio(tt, 3.6, 4.2);
  return <>
    <Head tt={tt} kick="CUÁNDO SE CORTA" title="CON EL RULO HECHO" col={GRN} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, bottom: 0, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})` }} />
    {S.map(([a, b, c], i) => { const x = 420 + i * 540, p = phys(tt, 0.4 + i * 0.6, 6, 0.5); return <div key={i} style={{ opacity: cl(p * 2) }}>
      <svg viewBox="0 0 300 600" style={{ position: "absolute", left: x - 150, top: 260, width: 300, height: 600, overflow: "visible", transform: i === 1 ? `translateY(${-30 * cut}px) rotate(${-8 * cut}deg)` : undefined }}>
        <path d={i === 0 ? "M150 600 C150 520 150 470 150 440" : i === 1 ? "M150 600 C150 380 150 320 150 260 C150 140 260 140 250 220 C240 300 140 280 150 180 C155 130 165 90 175 60" : "M150 600 C150 400 150 200 150 40"} stroke="#9cc56b" strokeWidth={13} fill="none" strokeLinecap="round" />
        <path d={i === 0 ? "M150 440 C140 420 145 400 152 390 C160 400 162 420 150 440 Z" : i === 1 ? "M175 60 C160 40 165 15 180 0 C195 15 195 40 175 60 Z" : "M150 40 C120 30 120 -10 150 -30 C180 -10 180 30 150 40 Z"} fill={i === 2 ? "#f0f0e0" : "#d7e6a4"} />
      </svg>
      {i === 1 && <div style={{ position: "absolute", left: x - 140, top: 830, width: 280, height: 8, borderTop: `8px dashed ${GRN}`, opacity: cl((tt - 3) * 2) }} />}
      <Tag tt={tt} at={1 + i * 0.6} x={x} y={200} txt={a} col={TX} size={34} />
      <Tag tt={tt} at={2.4 + i * 0.4} x={x} y={960} txt={b} col={c} size={30} />
    </div>; })}
  </>;
}}</Stage>;

// ---- 25:10 · DE REGALO A LA SARTÉN: el tallo se corta en pedacitos de 3-4 cm que caen a la sartén; reloj de 2-3 minutos ----
export const HPan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const c = eio(tt, 2, 4.6);
  return <>
    <Head tt={tt} kick="NO SE TIRA" title="SALTEADO, 2-3 MINUTOS" />
    <div style={{ position: "absolute", left: 560, top: 520, width: 680, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, #3a3a3e, #1c1c1f 70%)", boxShadow: "0 40px 70px rgba(0,0,0,.6), inset 0 0 0 18px #2b2b2f" }} />
    <div style={{ position: "absolute", left: 1220, top: 690, width: 420, height: 50, borderRadius: 25, background: "linear-gradient(180deg,#5a4030,#3a281c)" }} />
    {Array.from({ length: 12 }, (_, i) => { const p = phys(tt, 0.4 + i * 0.12, 7, 0.45); return <div key={i} style={{ position: "absolute", left: 680 + (i % 4) * 110 + 20 * Math.sin(i), top: 620 + Math.floor(i / 4) * 80 - (1 - p) * 500, width: 90, height: 22, borderRadius: 11, background: `rgb(${140 + 20 * c},${190 - 40 * c},${90 - 30 * c})`, transform: `rotate(${(i * 47) % 60 - 30}deg)`, opacity: cl(p * 3), boxShadow: `0 0 ${10 * c}px rgba(255,200,120,.4)` }} />; })}
    <div style={{ position: "absolute", left: 1380, top: 330, width: 200, height: 200, borderRadius: "50%", background: `conic-gradient(${AMB} ${c * 360}deg, rgba(255,255,255,.08) 0)` }} />
    <div style={{ position: "absolute", left: 1380, top: 330, width: 200, height: 200, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 52 }}>{(c * 3).toFixed(1)}′</div>
    <Tag tt={tt} at={1.2} x={420} y={420} txt="PEDACITOS DE 3-4 CM" col={TX} size={34} />
    <Tag tt={tt} at={4.6} x={900} y={1000} txt="ACEITE Y SAL · HASTA QUE CAMBIA DE COLOR" col={GRN} size={32} />
  </>;
}}</Stage>;

// ---- 26:35 · LOS BULBILLOS: de la cápsula salen granitos; año 1 una bolita, año 2 la cabeza con dientes ----
export const HBulbils: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const a = phys(tt, 0.4, 6, 0.5), y1 = phys(tt, 2.2, 6, 0.5), y2 = phys(tt, 3.6, 6, 0.5);
  return <>
    <Head tt={tt} kick="EL CAMINO LENTO" title="DOS AÑOS POR CABEZA" col={ICE} />
    <div style={{ opacity: cl(a * 2) }}>{Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: 300 + (i % 5) * 46 + 10 * Math.sin(i), top: 480 + Math.floor(i / 5) * 46, width: 34, height: 40, borderRadius: "50% 50% 46% 46%", background: "radial-gradient(circle at 35% 30%, #fff, #e8d7c0 60%, #b68f8a)", boxShadow: "0 8px 10px rgba(0,0,0,.45)" }} />)}</div>
    <Tag tt={tt} at={0.8} x={410} y={700} txt="GRANO DE ARROZ" col={DIM} size={30} />
    <Arrow x1={620} y1={540} x2={780} y2={540} p={cl((tt - 1.6) * 2)} />
    <div style={{ position: "absolute", left: 830, top: 420, width: 220 * y1, height: 220 * y1, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff, #efe6cf 60%, #cdbf9b)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" }} />
    <Tag tt={tt} at={2.6} x={940} y={720} txt="AÑO 1 · UN SOLO DIENTE" col={TX} size={30} />
    <Arrow x1={1110} y1={540} x2={1270} y2={540} p={cl((tt - 3.2) * 2)} />
    <Bulb x={1500} y={520} s={1.05 * y2 + 0.01} />
    <Tag tt={tt} at={4} x={1500} y={760} txt="AÑO 2 · LA CABEZA" col={GRN} size={30} />
  </>;
}}</Stage>;

// ---- 27:10 · CADA HOJA ES UNA PIEL: las hojas de la planta se unen con líneas a las capas de la cabeza; mitad seca = listo ----
export const HLeafSkin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const dry = eio(tt, 2.6, 4.6);
  return <>
    <Head tt={tt} kick="CÓMO SABES QUE ESTÁ LISTA" title="LA MITAD DE LAS HOJAS SECAS" col={AMB} />
    {Array.from({ length: 8 }, (_, i) => { const d = i < 4 ? dry : 0; return <React.Fragment key={i}>
      <Leaf x={500 + i * 20} y={900} len={220 + i * 45} rot={(i - 3.5) * 9} w={16} col={`rgb(${125 + 70 * d},${191 - 60 * d},${99 - 40 * d})`} />
    </React.Fragment>; })}
    <div style={{ position: "absolute", left: 1150, top: 300 }}>{Array.from({ length: 8 }, (_, i) => { const p = cl((tt - 0.6 - i * 0.2) * 2), d = i < 4 ? dry : 0; return <div key={i} style={{ position: "absolute", left: -i * 28, top: -i * 34, width: 300 + i * 56, height: 360 + i * 68, borderRadius: "50% 50% 46% 46%", border: `5px solid rgba(${240 - 60 * d},${225 - 90 * d},${190 - 110 * d},${0.8 * p})` }} />; })}</div>
    <Arrow x1={720} y1={600} x2={1040} y2={600} p={cl((tt - 1.6) * 2)} />
    <Tag tt={tt} at={1.8} x={880} y={540} txt="1 HOJA = 1 PIEL" col={TX} size={34} />
    <Tag tt={tt} at={4.4} x={960} y={1010} txt="NO ESPERES QUE SE SEQUE TODA" col={RED} size={34} />
  </>;
}}</Stage>;

// ---- 27:50 · LA PRUEBA DE ESCARBAR: la mano aparta la tierra; dientes marcados = lista; redonda y lisa = una semana más ----
export const HDig: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const op = eio(tt, 0.5, 2);
  return <>
    <Head tt={tt} kick="ANTES DE SACARLAS TODAS" title="ESCARBAS Y MIRAS" />
    {[0, 1].map((k) => <React.Fragment key={k}>
      <div style={{ position: "absolute", left: 300 + k * 760, top: 380, width: 560, height: 560, borderRadius: 20, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})` }} />
      <div style={{ position: "absolute", left: 360 + k * 760, top: 420, width: 440, height: 480, borderRadius: "50%", background: "radial-gradient(#2a1c12, transparent 70%)", opacity: op }} />
      <Bulb x={580 + k * 760} y={660} s={1.1} round={k === 1} op={op} />
      <Tag tt={tt} at={2.2 + k * 0.8} x={580 + k * 760} y={980} txt={k ? "LISA, REDONDA · UNA SEMANA MÁS" : "DIENTES MARCADOS · LISTA"} col={k ? AMB : GRN} size={32} />
    </React.Fragment>)}
  </>;
}}</Stage>;

// ---- 28:45 · EL CURADO: rejilla a la sombra con aire que corre; el cuello pasa de verde blando a seco y duro (2-4 semanas) ----
export const HCure: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const c = eio(tt, 1, 5), wk = Math.max(1, Math.round(1 + 3 * c));
  return <>
    <Head tt={tt} kick="A LA SOMBRA, CON AIRE" title="EL CURADO" col={AMB} />
    <div style={{ position: "absolute", left: 260, top: 300, width: 900, height: 120, background: "linear-gradient(180deg,#5b4a3a,#3a2e24)", borderRadius: 8 }} />
    {Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", left: 300 + i * 180, top: 420 }}>
      {Array.from({ length: 4 }, (_, j) => <div key={j} style={{ position: "absolute", left: j * 10, top: 0, width: 8, height: 260, borderRadius: 4, background: `rgb(${125 + 70 * c},${191 - 70 * c},${99 - 40 * c})`, transform: `rotate(${(j - 1.5) * 3}deg)` }} />)}
      <Bulb x={20} y={330} s={0.45} />
    </div>)}
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: (tt * 260 + i * 400) % 1300 + 150, top: 760 + i * 40, width: 160, height: 4, borderRadius: 2, background: "rgba(220,235,255,.35)" }} />)}
    <Big x={1500} y={420} txt={`SEMANA ${wk}`} s={phys(tt, 0.8, 6, 0.5)} col={TX} size={80} />
    <Tag tt={tt} at={2.4} x={1500} y={540} txt="NUNCA AL SOL · NUNCA HÚMEDO" col={RED} size={30} />
    <Tag tt={tt} at={4.4} x={1500} y={640} txt="CUELLO SECO Y DURO = CURADO" col={GRN} size={32} />
  </>;
}}</Stage>;

// ---- 29:40 · LAS QUE NO SE TOCAN: 10 cabezas en fila; las 3 mejores suben a una bolsa de red con su etiqueta "OTOÑO" ----
export const HKeep: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const S = [0.9, 1.15, 0.85, 0.95, 1.2, 0.8, 0.9, 1.1, 0.85, 0.9], best = [1, 4, 7], up = eio(tt, 2.4, 3.6);
  return <>
    <Head tt={tt} kick="ANTES DE COMERTE NINGUNA" title="DE CADA 10, SEPARAS 3" col={GRN} />
    {S.map((s, i) => { const b = best.includes(i), p = phys(tt, 0.3 + i * 0.1, 7, 0.5), bi = best.indexOf(i); return <div key={i} style={{ opacity: b ? 1 : 1 - 0.55 * up }}>
      <Bulb x={b ? 220 + i * 160 + ((1360 + bi * 130) - (220 + i * 160)) * up : 220 + i * 160} y={b ? 760 - 360 * up : 760} s={0.62 * s * p + 0.01} />
    </div>; })}
    <div style={{ position: "absolute", left: 1270, top: 220, width: 460, height: 420, borderRadius: "30px 30px 120px 120px", background: "repeating-linear-gradient(45deg, rgba(220,90,60,.55) 0 4px, transparent 4px 22px), repeating-linear-gradient(-45deg, rgba(220,90,60,.55) 0 4px, transparent 4px 22px)", opacity: up }} />
    <div style={{ position: "absolute", left: 1640, top: 210, padding: "8px 18px", borderRadius: 8, background: "#e9d6b0", color: "#3b2a18", fontWeight: 900, fontSize: 30, transform: `rotate(8deg) scale(${up})` }}>OTOÑO</div>
    <Tag tt={tt} at={4} x={700} y={960} txt="LAS MÁS GRANDES, FIRMES Y SANAS" col={TX} size={34} />
  </>;
}}</Stage>;

// ---- 30:20 · LA CUENTA: 1 cabeza → 6 → 40 → 400 dientes; los puntos se multiplican y llenan la pantalla ----
export const HMath: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const ST: [string, number][] = [["1 CABEZA", 1], ["6 CABEZAS", 6], ["40 CABEZAS", 40], ["400 DIENTES", 400]];
  const k = Math.min(3, Math.floor(Math.max(0, tt - 0.4) / 1.3)), n = ST[k][1], g = phys(tt, 0.4 + k * 1.3, 6, 0.5);
  return <>
    <Head tt={tt} kick="UNA SOLA COMPRA" title="AJO PARA SIEMPRE" col={GRN} />
    {Array.from({ length: Math.min(n, 400) }, (_, i) => { const cols = n === 1 ? 1 : n <= 6 ? 6 : n <= 40 ? 10 : 25, sz = n === 1 ? 260 : n <= 6 ? 120 : n <= 40 ? 60 : 26, gap = sz * 1.25, rows = Math.ceil(n / cols);
      const x = 960 - (cols - 1) * gap / 2 + (i % cols) * gap, y = 600 - (rows - 1) * gap / 2 + Math.floor(i / cols) * gap;
      return <div key={i} style={{ position: "absolute", left: x - sz / 2, top: y - sz / 2, width: sz, height: sz * 1.1, borderRadius: "50% 50% 46% 46%", background: "radial-gradient(circle at 35% 30%, #fff, #efe6cf 60%, #c4b48c)", transform: `scale(${cl(g * 1.2 - (i / Math.max(1, n)) * 0.2)})` }} />; })}
    <div style={{ position: "absolute", left: 0, right: 0, top: 930, textAlign: "center", fontWeight: 900, fontSize: 70, color: k === 3 ? GRN : TX }}>{ST[k][0]}</div>
    <div style={{ position: "absolute", right: 120, top: 100, fontWeight: 900, fontSize: 40, color: AMB }}>{["HOY", "AÑO 1", "AÑO 2", "AÑO 3"][k]}</div>
  </>;
}}</Stage>;
