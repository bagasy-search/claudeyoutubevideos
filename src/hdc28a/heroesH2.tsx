// componentes únicos de hdc28a · B: minutos 3-12 (elegir el ajo, el frío, separar los dientes, el vaso, la maceta).
import React from "react";
import { AMB, DIM, GRN, H, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Arrow, Bar, Big, Bulb, Clove, LEAF, Leaf, Pot, SOIL, SOIL2, X } from "./heroesH";

// ---- 3:25 · SÚPER vs FERIA: la cabeza en malla roja de plástico contra la de papel de la feria; el brote sólo en una ----
export const HTwoHeads: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const a = phys(tt, 0.4, 6, 0.5), b = phys(tt, 0.9, 6, 0.5), sp = eio(tt, 3, 5);
  return <>
    <Head tt={tt} kick="LAS DOS PARECEN IGUALES" title="UNA BROTA, LA OTRA NO" />
    <div style={{ position: "absolute", left: 960, top: 260, width: 4, height: 700, background: "rgba(255,255,255,.15)" }} />
    <Bulb x={560} y={560} s={1.2 * a + 0.01} />
    <svg viewBox="0 0 300 360" style={{ position: "absolute", left: 410, top: 360, width: 300, height: 360, opacity: a }}>
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${i * 26} 0 L${i * 26 + 120} 360`} stroke="#d8322e" strokeWidth={4} />)}
      {Array.from({ length: 12 }, (_, i) => <path key={"b" + i} d={`M${i * 26 + 120} 0 L${i * 26} 360`} stroke="#d8322e" strokeWidth={4} />)}
    </svg>
    <Bulb x={1360} y={560} s={1.2 * b + 0.01} pur />
    <Leaf x={1360} y={390} len={130 * sp} rot={4} w={16} />
    <Tag tt={tt} at={1.4} x={560} y={830} txt="SUPERMERCADO" col={DIM} size={40} />
    <Tag tt={tt} at={1.8} x={1360} y={830} txt="FERIA · DE LA ZONA" col={GRN} size={40} />
    <Tag tt={tt} at={4.6} x={560} y={900} txt="3-4 SEMANAS · NADA" col={RED} size={32} />
  </>;
}}</Stage>;

// ---- 3:58 · EL AJO DORMIDO: viaja semanas (barco → camión → estante) y el diente se queda con los ojos cerrados ----
export const HSleep: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const p = eio(tt, 0.5, 4.2), wk = Math.round(p * 6);
  return <>
    <Head tt={tt} kick="EL QUE VIENE DE LEJOS" title="LO TRATAN PARA QUE NO BROTE" col={ICE} />
    <div style={{ position: "absolute", left: 220, top: 640, width: 1480, height: 6, borderTop: "6px dashed rgba(255,255,255,.25)" }} />
    {["BARCO", "CAMIÓN", "CÁMARA DE FRÍO", "ESTANTE"].map((s, i) => <Tag key={i} tt={tt} at={0.5 + i * 0.9} x={300 + i * 440} y={700} txt={s} col={DIM} size={28} />)}
    {[0, 1, 2, 3].map((i) => { const a = phys(tt, 0.4 + i * 0.9, 6, 0.5), on = cl((p * 1400 - i * 440 + 120) / 120); return <div key={i} style={{ position: "absolute", left: 300 + i * 440 - 90, top: 780, width: 180, height: 120, opacity: cl(a * 2), transform: `translateY(${(1 - a) * 40}px) scale(${0.9 + 0.1 * on})`, filter: `drop-shadow(0 0 ${18 * on}px ${ICE})` }}>
      {i === 0 && <><div style={{ position: "absolute", left: 10, top: 60, width: 160, height: 40, background: "#5a6b7a", clipPath: "polygon(0 0,100% 0,85% 100%,15% 100%)" }} />{[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 40 + k * 36, top: 30, width: 32, height: 30, background: ["#c0563f", "#3f7fc0", "#d8b04a"][k], borderRadius: 3 }} />)}</>}
      {i === 1 && <><div style={{ position: "absolute", left: 10, top: 30, width: 110, height: 60, background: "#d9dde0", borderRadius: 6 }} /><div style={{ position: "absolute", left: 120, top: 50, width: 50, height: 40, background: "#c0563f", borderRadius: "6px 14px 6px 6px" }} />{[40, 140].map((x) => <div key={x} style={{ position: "absolute", left: x - 14, top: 84, width: 28, height: 28, borderRadius: "50%", background: "#222", border: "5px solid #888" }} />)}</>}
      {i === 2 && <><div style={{ position: "absolute", left: 30, top: 10, width: 120, height: 100, background: "linear-gradient(180deg,#e8f3fb,#a9c6db)", borderRadius: 8 }} /><div style={{ position: "absolute", left: 130, top: 45, width: 8, height: 34, background: "#6c8394", borderRadius: 4 }} /><div style={{ position: "absolute", left: 52, top: 30, fontSize: 44, fontWeight: 900, color: "#3a7fb0" }}>-2°</div></>}
      {i === 3 && <><div style={{ position: "absolute", left: 10, top: 70, width: 160, height: 12, background: "#8d6b52" }} />{[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 30 + k * 44, top: 34, width: 36, height: 36, borderRadius: "50%", background: "radial-gradient(#fff,#ddd6c6)" }} />)}</>}
    </div>; })}
    <div style={{ position: "absolute", left: 220 + 1400 * p, top: 470 + 10 * Math.sin(tt * 3) }}><Clove x={0} y={60} s={1.1} /></div>
    <Big x={1500} y={300} txt={`${wk} SEMANAS`} s={phys(tt, 0.6, 5, 0.6)} col={ICE} size={64} />
    <div style={{ position: "absolute", left: 1640, top: 380, fontWeight: 900, fontSize: 56, color: ICE, opacity: cl(tt - 4.2), transform: `translateY(${-14 * Math.sin(tt * 2)}px)` }}>z z z</div>
    <Tag tt={tt} at={4.8} x={960} y={990} txt="DESPIERTA TARDE Y FLOJO · O NUNCA" col={RED} size={38} />
  </>;
}}</Stage>;

// ---- 4:40 · EL TAMAÑO MANDA: tres dientes de distinto tamaño, cada uno arma su cabeza proporcional ----
export const HSize: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const S = [1.35, 1, 0.62];
  return <>
    <Head tt={tt} kick="LA REGLA DEL DIENTE" title="DIENTE GRANDE, CABEZA GRANDE" />
    {S.map((s, i) => { const a = phys(tt, 0.5 + i * 0.3, 6, 0.5), b = phys(tt, 2.2 + i * 0.3, 5, 0.5); return <React.Fragment key={i}>
      <Clove x={420 + i * 540} y={420} s={s * a + 0.01} />
      <Arrow x1={420 + i * 540} y1={540} x2={420 + i * 540} y2={640} p={cl((tt - 1.8 - i * 0.3) * 2)} col={i === 0 ? GRN : i === 2 ? RED : AMB} />
      <Bulb x={420 + i * 540} y={820} s={0.85 * s * b + 0.01} />
    </React.Fragment>; })}
    <Tag tt={tt} at={3.6} x={420} y={1010} txt="A LA TIERRA" col={GRN} size={34} />
    <Tag tt={tt} at={3.9} x={1500} y={1010} txt="A LA OLLA" col={RED} size={34} />
  </>;
}}</Stage>;

// ---- 5:02 · LA PRUEBA DEL APRETÓN: dos dedos aprietan; la firme no cede, la blanda se hunde y aparece la mancha ----
export const HSqueeze: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const sq = Math.max(0, Math.sin(Math.max(0, tt - 1) * 2.2)), soft = cl(tt - 2.8);
  return <>
    <Head tt={tt} kick="EN EL CAJÓN" title="APRETÁS: NO TIENE QUE CEDER" />
    {[0, 1].map((i) => { const dent = i === 1 ? sq * 18 * soft : 0; return <React.Fragment key={i}>
      <div style={{ transform: `scaleX(${1 + dent / 400}) scaleY(${1 - dent / 300})`, transformOrigin: `${560 + i * 800}px 650px` }}><Bulb x={560 + i * 800} y={520} s={1.25} /></div>
      {[-1, 1].map((d) => <div key={d} style={{ position: "absolute", left: 560 + i * 800 + d * (150 - sq * (i ? 30 : 6)) - 40, top: 470, width: 80, height: 120, borderRadius: 40, background: "linear-gradient(90deg,#d9a27e,#f0c2a0,#d9a27e)", boxShadow: "0 10px 20px rgba(0,0,0,.4)" }} />)}
      {i === 1 && <div style={{ position: "absolute", left: 1330, top: 560, width: 60, height: 40, borderRadius: "50%", background: "radial-gradient(#2c2a22, #5b5a3f 60%, transparent 70%)", opacity: soft }} />}
    </React.Fragment>; })}
    <Tag tt={tt} at={2} x={560} y={830} txt="FIRME · SIRVE" col={GRN} size={40} />
    <Tag tt={tt} at={3.2} x={1360} y={830} txt="BLANDA · PODRIDA ADENTRO" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- 5:35 · TRES VARIEDADES: blanco, morado, colorado, en vitrinas con su rasgo ----
export const HVarieties: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const V: [string, string, string, boolean][] = [["BLANCO", "GUARDA MUCHOS MESES", "#f3eee2", false], ["MORADO", "BROTA RÁPIDO · MI FAVORITO", "#c78ab8", true], ["COLORADO", "AGUANTA GUARDADO", "#e8b0a4", false]];
  return <>
    <Head tt={tt} kick="PARA LA MACETA" title="CUALQUIERA SIRVE" />
    {V.map(([n, d, c, pur], i) => { const p = phys(tt, 0.5 + i * 0.5, 6, 0.5), hi = i === 1 ? cl(tt - 3.6) : 0; return <div key={i} style={{ position: "absolute", left: 270 + i * 480, top: 290, width: 420, height: 600, borderRadius: 30, background: `linear-gradient(180deg, ${c}22, rgba(255,255,255,.03))`, border: `3px solid ${hi ? AMB : "rgba(255,255,255,.14)"}`, boxShadow: hi ? `0 0 50px ${AMB}55` : "none", opacity: cl(p * 2), transform: `translateY(${(1 - p) * 80}px) scale(${1 + 0.05 * hi})` }}>
      <Bulb x={210} y={250} s={1.1} pur={pur} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", fontWeight: 900, fontSize: 50 }}>{n}</div>
      <div style={{ position: "absolute", left: 20, right: 20, top: 510, textAlign: "center", fontWeight: 800, fontSize: 24, color: DIM }}>{d}</div>
    </div>; })}
    <Tag tt={tt} at={4.4} x={960} y={960} txt="LO QUE IMPORTA: DE LA ZONA Y VIVO" col={GRN} size={38} />
  </>;
}}</Stage>;

// ---- 6:20 · EL FRÍO ES UNA SEÑAL: termómetro baja; con frío el diente se divide en dientes, sin frío queda redondo ----
export const HCold: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const c = eio(tt, 0.4, 2.4), d = phys(tt, 2.8, 5, 0.6);
  return <>
    <Head tt={tt} kick="EL INVIERNO" title="EL FRÍO LE DICE QUE SE DIVIDA" col={ICE} />
    <div style={{ position: "absolute", left: 220, top: 260, width: 70, height: 560, borderRadius: 35, background: "rgba(255,255,255,.1)", border: "4px solid rgba(255,255,255,.4)" }}>
      <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, height: `${85 - 60 * c}%`, borderRadius: 20, background: `linear-gradient(180deg, ${c > 0.6 ? ICE : AMB}, #5aa9ff)` }} />
    </div>
    <div style={{ position: "absolute", left: 310, top: 290 + 400 * c, fontWeight: 900, fontSize: 40, color: ICE }}>{Math.round(18 - 14 * c)}°</div>
    <Bulb x={820} y={540} s={1.25 * d + 0.01} />
    <Tag tt={tt} at={3.4} x={820} y={820} txt="CON FRÍO: DIENTES" col={GRN} size={38} />
    <div style={{ position: "absolute", left: 1270, top: 400, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff, #efe6cf 60%, #cdbf9b)", opacity: cl((tt - 3.6) * 2), boxShadow: "0 30px 40px rgba(0,0,0,.5)" }} />
    <Tag tt={tt} at={4} x={1400} y={820} txt="SIN FRÍO: UNA BOLITA" col={RED} size={38} />
  </>;
}}</Stage>;

// ---- 6:48 · DOS MITADES DEL MAPA: sur de marzo a mayo, norte de septiembre a noviembre (rueda del año partida) ----
export const HHemis: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const M = "EFMAMJJASOND".split(""), r = 250;
  return <>
    <Head tt={tt} kick="LA FECHA BUENA" title="EL OTOÑO, DONDE VIVAS" />
    {[0, 1].map((k) => { const cx = 600 + k * 720, cy = 600, on = k === 0 ? [2, 3, 4] : [8, 9, 10], p = phys(tt, 0.5 + k * 1.2, 5, 0.6); return <div key={k} style={{ opacity: cl(p * 2) }}>
      {M.map((m, i) => { const a = (i / 12) * Math.PI * 2 - Math.PI / 2, hit = on.includes(i) && tt > 1.4 + k * 1.2 + on.indexOf(i) * 0.25; return <div key={i} style={{ position: "absolute", left: cx + Math.cos(a) * r - 42, top: cy + Math.sin(a) * r - 42, width: 84, height: 84, borderRadius: "50%", background: hit ? AMB : "rgba(255,255,255,.07)", color: hit ? "#2a1d0a" : DIM, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 36, transform: `scale(${hit ? 1.12 : 1})`, boxShadow: hit ? `0 0 30px ${AMB}` : "none" }}>{m}</div>; })}
      <div style={{ position: "absolute", left: cx - 150, top: cy - 60, width: 300, textAlign: "center" }}><div style={{ fontWeight: 900, fontSize: 56 }}>{k ? "NORTE" : "SUR"}</div><div style={{ fontWeight: 800, fontSize: 28, color: AMB }}>{k ? "SEP → NOV" : "MAR → MAY"}</div></div>
    </div>; })}
  </>;
}}</Stage>;

// ---- 7:20 · LAS DOS MACETAS: la grande de otoño (cabezas) y la chica de la ventana (hojas, siempre) ----
export const HTwoPots: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const a = phys(tt, 0.4, 5, 0.55), b = phys(tt, 1.4, 5, 0.55), g = eio(tt, 2, 5);
  return <>
    <Head tt={tt} kick="EN ESTE VIDEO" title="HACEMOS LAS DOS COSAS" />
    <div style={{ opacity: cl(a * 2), transform: `translateY(${(1 - a) * 80}px)` }}>
      <Pot x={620} y={520} w={520} h={380}>{[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 70 + i * 130, top: 150 }}><Bulb x={0} y={0} s={0.35 + 0.3 * g} /></div>)}</Pot>
      {[0, 1, 2].map((i) => <Leaf key={i} x={470 + i * 150} y={530} len={140 + 60 * g} rot={(i - 1) * 6} w={16} />)}
    </div>
    <div style={{ opacity: cl(b * 2), transform: `translateY(${(1 - b) * 80}px)` }}>
      <Pot x={1380} y={640} w={300} h={220}>{null}</Pot>
      {Array.from({ length: 12 }, (_, i) => <Leaf key={i} x={1280 + i * 18} y={650} len={120 + 30 * Math.sin(i + tt)} rot={(i - 5.5) * 3} w={10} />)}
    </div>
    <Tag tt={tt} at={1} x={620} y={950} txt="GRANDE · OTOÑO · CABEZAS" col={AMB} size={34} />
    <Tag tt={tt} at={2} x={1380} y={950} txt="CHICA · SIEMPRE · HOJAS" col={GRN} size={34} />
  </>;
}}</Stage>;

// ---- 7:55 · EL PLATITO: zoom al diente; la base dura se ilumina y de ahí bajan las raíces; si se rompe, nada ----
export const HPlate: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const z = eio(tt, 0.3, 2), r = eio(tt, 2.2, 4.4);
  return <>
    <Head tt={tt} kick="LO QUE NO SE ROMPE" title="EL PLATITO DE ABAJO" />
    <Clove x={760} y={430} s={2.8 + 0.4 * z} plate={cl((tt - 1.4) * 2) * (0.6 + 0.4 * Math.sin(tt * 4))} />
    {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 690 + i * 18, top: 690, width: 5, height: 220 * r * (0.6 + 0.4 * Math.sin(i * 1.9) ** 2), background: "#f4ecd8", borderRadius: 3, transformOrigin: "50% 0", transform: `rotate(${(i - 4) * 7}deg)` }} />)}
    <Clove x={1440} y={460} s={1.6} op={cl(tt - 3.4)} />
    <div style={{ position: "absolute", left: 1370, top: 560, width: 140, height: 40, background: "#2a2018", clipPath: "polygon(0 0, 30% 60%, 55% 10%, 80% 70%, 100% 0, 100% 100%, 0 100%)", opacity: cl(tt - 3.6) }} />
    <Tag tt={tt} at={2.4} x={760} y={970} txt="DE ACÁ SALEN LAS RAÍCES" col={AMB} size={36} />
    <Tag tt={tt} at={4} x={1440} y={720} txt="ROTO = NO ARRANCA" col={RED} size={34} />
  </>;
}}</Stage>;

// ---- 8:20 · LA PIEL ES UN ESCUDO: diente con piel (gotas rebotan) vs pelado (la mancha de hongo avanza) ----
export const HSkin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const rot = eio(tt, 2.4, 5);
  return <>
    <Head tt={tt} kick="NO LO PELES" title="NUNCA" col={RED} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, bottom: 0, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})` }} />
    <Clove x={620} y={560} s={1.8} />
    <div style={{ position: "absolute", left: 470, top: 360, width: 300, height: 400, borderRadius: "50% 50% 40% 40%", border: `5px solid ${GRN}`, boxShadow: `0 0 40px ${GRN}66`, opacity: cl(tt - 1) * (0.6 + 0.4 * Math.sin(tt * 3)) }} />
    <Clove x={1300} y={560} s={1.8} peeled />
    <div style={{ position: "absolute", left: 1220, top: 560 - 120 * rot, width: 160, height: 160 * rot + 40, borderRadius: "40%", background: "radial-gradient(circle, rgba(70,90,60,.85), rgba(60,70,40,.4) 60%, transparent 72%)", opacity: rot }} />
    <Tag tt={tt} at={1.4} x={620} y={860} txt="CON PIEL: PROTEGIDO" col={GRN} size={38} />
    <Tag tt={tt} at={2.6} x={1300} y={860} txt="PELADO: SE PUDRE" col={RED} size={38} />
  </>;
}}</Stage>;

// ---- 8:50 · LA FILA: 12 dientes se ordenan del más grande al más chico y se parten en dos destinos ----
export const HRow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const S = [1.25, 1.2, 1.15, 1.1, 1.05, 1.0, 0.8, 0.72, 0.66, 0.6, 0.55, 0.5], srt = eio(tt, 0.6, 2.2), sp = eio(tt, 2.8, 3.8);
  const mess = [5, 0, 9, 3, 11, 7, 1, 10, 4, 8, 2, 6];
  return <>
    <Head tt={tt} kick="DE UNA CABEZA" title="LOS GRANDES A LA TIERRA" />
    {S.map((s, i) => { const from = mess.indexOf(i), x0 = 220 + from * 135, x1 = 220 + i * 135 + (i >= 6 ? 120 * sp : -60 * sp); return <Clove key={i} x={x0 + (x1 - x0) * srt} y={520 + 50 * Math.sin(from * 2.3) * (1 - srt)} s={s} rot={(i % 3 - 1) * 8 * (1 - srt)} />; })}
    <div style={{ position: "absolute", left: 1015, top: 380, width: 6, height: 300, background: "rgba(255,255,255,.4)", opacity: sp }} />
    <Tag tt={tt} at={3.2} x={520} y={760} txt="AFUERA · GRANDES → CABEZAS" col={GRN} size={34} />
    <Tag tt={tt} at={3.6} x={1450} y={760} txt="CENTRO · CHICOS → HOJAS U OLLA" col={AMB} size={34} />
  </>;
}}</Stage>;

// ---- 9:35 · EL TRUCO DEL FRÍO: cajón de verduras en corte, bolsa de papel adentro, semanas que pasan; congelador y fruta tachados ----
export const HFridge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const op = phys(tt, 0.4, 5, 0.6), w = Math.round(4 + 2 * eio(tt, 1.6, 4));
  return <>
    <Head tt={tt} kick="DONDE NO HAY INVIERNO" title="EL CAJÓN DE LAS VERDURAS" col={ICE} />
    <div style={{ position: "absolute", left: 300, top: 250, width: 620, height: 760, borderRadius: 30, background: "linear-gradient(180deg,#eef3f5,#cfd8dc)", boxShadow: "0 40px 80px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 30, right: 30, top: 30, height: 160, borderRadius: 14, background: "#b9dff0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 30, color: "#5a7a8a" }}>CONGELADOR</div>
      <div style={{ position: "absolute", left: 30, right: 30, top: 520, height: 210, borderRadius: 14, background: "rgba(200,235,250,.6)", border: "4px solid #a9c7d3", transform: `translateY(${op * 40}px)` }}>
        <div style={{ position: "absolute", left: 180, top: 30, width: 200, height: 160, background: "linear-gradient(180deg,#c9a272,#a8814f)", clipPath: "polygon(8% 0, 92% 0, 100% 100%, 0 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 24, color: "#4a3420" }}>PAPEL</div>
      </div>
    </div>
    <X x={610} y={360} p={cl((tt - 3.4) * 2)} s={220} />
    <Big x={1420} y={450} txt={`${w} SEMANAS`} s={phys(tt, 1.4, 5, 0.6)} col={ICE} size={100} />
    <Tag tt={tt} at={2.2} x={1420} y={560} txt="EN BOLSA DE PAPEL, SOLOS" col={TX} size={36} />
    <Tag tt={tt} at={3.8} x={1420} y={700} txt="NI CONGELADOR NI FRUTA AL LADO" col={RED} size={32} />
  </>;
}}</Stage>;

// ---- 10:05 · LA PRUEBA DEL VASO: el agua toca sólo la base; contador de días: raíces (3-4), punta verde (7), nada a los 10 = dormido ----
export const HGlass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const d = Math.min(10, Math.floor(eio(tt, 0.8, 5.2) * 10.99)), r = cl((d - 2) / 3), g = cl((d - 6) / 2);
  return <>
    <Head tt={tt} kick="LA PRUEBA MÁS BARATA DEL MUNDO" title="UN DEDO DE AGUA" col={ICE} />
    <div style={{ position: "absolute", left: 640, top: 360, width: 300, height: 480, borderRadius: "10px 10px 40px 40px", border: "6px solid rgba(220,240,255,.7)", background: "rgba(220,240,255,.08)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120, background: "linear-gradient(180deg, rgba(140,200,240,.55), rgba(90,160,220,.6))" }} />
      {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 120 + i * 8, top: 350, width: 4, height: 110 * r * (0.6 + 0.4 * Math.sin(i * 2.3) ** 2), background: "#fbf6e8", transformOrigin: "50% 0", transform: `rotate(${(i - 3.5) * 9}deg)` }} />)}
    </div>
    <Clove x={790} y={600 - 40} s={1.6} plate={cl(tt - 1) * 0.8} />
    <Leaf x={790} y={440} len={150 * g} rot={3} w={14} />
    <div style={{ position: "absolute", left: 1150, top: 380, fontWeight: 900, fontSize: 160 }}>{d}</div>
    <div style={{ position: "absolute", left: 1150, top: 560, fontWeight: 800, fontSize: 34, color: DIM, letterSpacing: 4 }}>DÍAS</div>
    <Tag tt={tt} at={2.6} x={1380} y={680} txt="3-4 DÍAS · RAÍCES" col={TX} size={34} anchor="l" />
    <Tag tt={tt} at={3.8} x={1380} y={740} txt="7 DÍAS · PUNTA VERDE" col={GRN} size={34} anchor="l" />
    <Tag tt={tt} at={5.4} x={1380} y={800} txt="10 DÍAS NADA · DORMIDO" col={RED} size={34} anchor="l" />
  </>;
}}</Stage>;

// ---- 11:20 · LA PROFUNDIDAD DE LA MACETA: regla al costado; en 20-30 cm las raíces bajan, en la baja chocan y se dan vuelta ----
export const HDepth: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const r = eio(tt, 0.8, 4);
  return <>
    <Head tt={tt} kick="PARA LAS CABEZAS" title="20 CM DE HONDO, MEJOR 30" />
    <Pot x={620} y={300} w={460} h={640}>{Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: 160 + i * 14, top: 120, width: 4, height: 440 * r, background: "#f1e8d2", transformOrigin: "50% 0", transform: `rotate(${(i - 3) * 6}deg)` }} />)}<div style={{ position: "absolute", left: 120, top: 40 }}><Bulb x={80} y={60} s={0.45} /></div></Pot>
    {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: 300, top: 318 + i * 100, width: 40, height: 3, background: "rgba(255,255,255,.6)" }}><div style={{ position: "absolute", left: -70, top: -18, fontWeight: 800, fontSize: 26, color: DIM }}>{i * 5}</div></div>)}
    <Pot x={1380} y={620} w={460} h={260}>{Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: 160 + i * 14, top: 90, width: 4, height: 130 * r, background: "#f1e8d2", borderRadius: 3, transformOrigin: "50% 0", transform: `rotate(${(i - 3) * 6}deg)` }} />)}{Array.from({ length: 7 }, (_, i) => <div key={"c" + i} style={{ position: "absolute", left: 120 + i * 30, top: 200, width: 40, height: 4, background: "#f1e8d2", opacity: cl(r * 3 - 2) }} />)}</Pot>
    <Tag tt={tt} at={2.6} x={1380} y={560} txt="BAJA: LA RAÍZ SE DA VUELTA" col={RED} size={32} />
  </>;
}}</Stage>;
