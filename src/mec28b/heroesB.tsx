// componentes únicos de mec28b · primera mitad (la flechita, las 8 funciones, el librito, el premio, la reserva, la bomba, la computadora,
// el parcial, el cuadernito, la llavecita del service, la aguja lenta, la ruedita del brillo). Un objeto por pieza, resorte y cámara curva.
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Arrow, Big, Mark, rnd } from "./mkit";
import { BLUE, CarTop, Dial, FuelDial, LCOL, Lamp, Screen, WIcon } from "./dkit";

// ---- 0:10 · ¿DE QUÉ LADO? el auto entre los dos surtidores, la tapa parpadea de un lado y del otro, y la flechita lo resuelve ----
export const HSide: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const doubt = tt < 3.6 ? (Math.sin(tt * 5) > 0 ? -1 : 1) : -1, sol = eio(tt, 3.6, 4.4);
  return <>
    <Head tt={tt} kick="EN LA ESTACIÓN DE SERVICIO" title="¿DE QUÉ LADO ESTÁ LA TAPA?" col={AMB} />
    {[-1, 1].map((sd) => <div key={sd} style={{ position: "absolute", left: 960 + sd * 330 - 60, top: 380, width: 120, height: 300, borderRadius: 18, background: "linear-gradient(180deg,#c8312a,#7a1a16)", boxShadow: "0 30px 60px rgba(0,0,0,.5)", opacity: cl(phys(tt, 0.3, 6, 0.5) * 2) }}><WIcon k="pump" x={60} y={110} s={1.1} col={TX} /></div>)}
    <CarTop x={960} y={560} s={0.95 * phys(tt, 0.5, 6, 0.5)} side={doubt} door={1} />
    {tt < 3.6 && <Tag tt={tt} at={1.2} x={960} y={300} txt="?" col={AMB} size={120} />}
    <div style={{ position: "absolute", left: 1450, top: 520, opacity: sol, transform: `scale(${0.6 + 0.4 * sol})` }}><FuelDial x={0} y={0} r={190} v={0.12} side={-1} ring={eio(tt, 4.3, 5.2)} /></div>
    <Arrow x1={1300} y1={640} x2={1060} y2={690} p={eio(tt, 5.0, 5.8)} col={RED} curve={0.2} />
  </>;
}}</Stage>;

// ---- 0:40 · LAS 8: ocho testigos que se reparten como cartas ----
export const HEight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const K: [string, string, string][] = [["tri", "amber", "LA FLECHITA"], ["wrench", "blue", "LA COMPUTADORA"], ["sun", "amber", "LA LUZ"], ["tpms", "amber", "NEUMÁTICOS"], ["lim", "green", "LIMITADOR"], ["snow", "blue", "HIELO"], ["leaf", "green", "MODO ECO"], ["engine", "red", "LOS COLORES"]];
  return <>
    <Head tt={tt} kick="LO QUE LA AGENCIA NO TE EXPLICA" title="8 COSAS DE TU TABLERO" col={AMB} />
    {K.map(([k, c, l], i) => { const s = phys(tt, 0.6 + i * 0.32, 7, 0.5), col = i % 4, row = Math.floor(i / 4);
      return s <= 0.01 ? null : <div key={i} style={{ position: "absolute", left: 330 + col * 420, top: 420 + row * 330, transform: `translate(${(1 - s) * (960 - 330 - col * 420)}px, ${(1 - s) * 300}px) rotate(${(1 - s) * (rnd(i) - 0.5) * 50}deg)`, opacity: cl(s * 2) }}>
        <Lamp k={k} x={0} y={0} col={LCOL[c]} on={cl((tt - 1 - i * 0.32) * 2)} s={0.9} label={`${i + 1} · ${l}`} />
      </div>; })}
    <div style={{ position: "absolute", left: 1460, top: 700, width: 170, height: 170, borderRadius: 30, border: `5px solid ${RED}`, opacity: eio(tt, 4.4, 5.0) * (0.6 + 0.4 * Math.sin(tt * 6)) }} />
    <Tag tt={tt} at={5.0} x={1545} y={1010} txt="LA MÁS IMPORTANTE" col={RED} size={30} />
  </>;
}}</Stage>;

// ---- 1:30 · EL LIBRITO DE LA GUANTERA: el manual se abre en «INSTRUMENTOS» con el dibujo numerado ----
export const HManual: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const o = eio(tt, 1.0, 2.2), s = phys(tt, 0.3, 6, 0.5);
  return <>
    <Head tt={tt} kick="SI NO LO ENCUENTRAS" title="EL MANUAL DEL AUTO" col={ICE} />
    <div style={{ position: "absolute", left: 960, top: 600, width: 0, height: 0, transform: `scale(${0.7 + 0.3 * s}) rotate(${-4 + 4 * o}deg)`, opacity: cl(s * 2) }}>
      <div style={{ position: "absolute", left: -520 * o, top: -300, width: 520, height: 600, borderRadius: "16px 4px 4px 16px", background: o > 0.5 ? "#f2eee4" : "linear-gradient(135deg,#2b3a52,#18212f)", boxShadow: "0 40px 90px rgba(0,0,0,.6)", transformOrigin: "100% 50%", transform: `scaleX(${o > 0.5 ? 1 : 1 - 2 * o})` }}>
        {o > 0.5 && <div style={{ padding: 40, color: "#2a2620", fontWeight: 900, fontSize: 40 }}>INSTRUMENTOS<div style={{ fontSize: 22, color: "#6a6258", marginTop: 8 }}>Y TABLERO · PÁG. 112</div></div>}
      </div>
      <div style={{ position: "absolute", left: 0, top: -300, width: 520, height: 600, borderRadius: "4px 16px 16px 4px", background: "#f6f2e8", boxShadow: "0 40px 90px rgba(0,0,0,.6)", opacity: cl(o * 3) }}>
        <svg viewBox="0 0 520 600" style={{ position: "absolute", inset: 0 }}>
          <rect x={40} y={140} width={440} height={180} rx={70} fill="none" stroke="#2a2620" strokeWidth={5} />
          <circle cx={150} cy={230} r={60} fill="none" stroke="#2a2620" strokeWidth={4} /><circle cx={370} cy={230} r={60} fill="none" stroke="#2a2620" strokeWidth={4} />
          {[1, 2, 3, 4, 5, 6].map((n, i) => { const k = eio(tt, 2.4 + i * 0.35, 2.8 + i * 0.35); const px = 70 + i * 76, py = 330 + 50 * (i % 2);
            return <g key={n} opacity={k}><line x1={px} y1={300} x2={px} y2={py + 40} stroke="#b0402a" strokeWidth={3} /><circle cx={px} cy={py + 60} r={20} fill="#b0402a" /><text x={px} y={py + 68} fill="#fff" fontSize={22} fontWeight={900} textAnchor="middle" fontFamily="sans-serif">{n}</text></g>; })}
        </svg>
      </div>
    </div>
    <Tag tt={tt} at={4.6} x={960} y={1000} txt="CADA AUTO TIENE SU DIBUJO" col={AMB} size={38} />
  </>;
}}</Stage>;

// ---- 2:10 · EL PREMIO: tres testigos con signo de pregunta; uno dice «seguí», otro «PARÁ YA» ----
export const HTeaser: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="radial-gradient(ellipse 70% 60% at 50% 50%, #2a0e0a, #070708 72%)">{(tt) => {
  const C: [string, string][] = [["green", "SEGUÍS"], ["amber", "REVISAR"], ["red", "PARÁS YA"]];
  return <>
    <Head tt={tt} kick="LA 8 · AL FINAL" title="EL COLOR TE DICE QUÉ HACER" col={RED} />
    {C.map(([c, l], i) => { const s = phys(tt, 0.6 + i * 0.5, 7, 0.45), rev = eio(tt, 3.2 + i * 0.6, 3.6 + i * 0.6);
      return <div key={c} style={{ position: "absolute", left: 560 + i * 400, top: 600, transform: `scale(${0.6 + 0.4 * s})`, opacity: cl(s * 2) }}>
        <div style={{ position: "absolute", left: -120, top: -120, width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, ${LCOL[c]}, ${LCOL[c]}55 60%, #0a0a0a)`, boxShadow: `0 0 ${80 + 40 * Math.sin(tt * 3 + i)}px ${LCOL[c]}88` }} />
        <div style={{ position: "absolute", left: -100, top: -70, width: 200, textAlign: "center", fontWeight: 900, fontSize: 120, color: "rgba(0,0,0,.55)", opacity: 1 - rev }}>?</div>
        <div style={{ position: "absolute", left: -160, top: 150, width: 320, textAlign: "center", fontWeight: 900, fontSize: 40, color: LCOL[c], opacity: rev }}>{l}</div>
      </div>; })}
  </>;
}}</Stage>;

// ---- 3:40 · LA FLECHITA: el medidor grande; la flecha gira y la tapa del auto cambia de lado ----
export const HArrowDial: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const side = tt < 3.8 ? -1 : 1, flip = eio(tt, 3.5, 4.1);
  return <>
    <Head tt={tt} kick="FUNCIÓN 1" title="LA FLECHITA DEL TANQUE" col={AMB} />
    <FuelDial x={620} y={600} r={250} v={0.3} side={side} ring={eio(tt, 0.8, 1.8)} />
    <CarTop x={1380} y={600} s={1.05} side={side} door={1} rot={0} />
    <div style={{ position: "absolute", left: 1220, top: 860, width: 320, textAlign: "center", fontWeight: 900, fontSize: 34, color: AMB, transform: `scale(${1 - 0.2 * Math.sin(Math.PI * flip)})` }}>{side < 0 ? "TAPA A LA IZQUIERDA" : "TAPA A LA DERECHA"}</div>
    <Arrow x1={870} y1={700} x2={1200} y2={650} p={eio(tt, 1.6, 2.4)} col={AMB} curve={-0.15} />
  </>;
}}</Stage>;

// ---- 4:10 · LA VUELTA: el auto entra del lado equivocado, da la vuelta y queda atrás de la fila de camiones; el reloj suma 20 minutos ----
export const HQueue: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const p = eio(tt, 0.6, 3.6), x = 420 + 500 * Math.min(1, p * 1.6) + (p > 0.62 ? 360 * eio(tt, 2.8, 3.6) : 0), y = 700 - (p > 0.4 ? 260 * Math.sin(Math.PI * cl((p - 0.4) / 0.6)) : 0);
  const mins = Math.round(20 * eio(tt, 3.6, 5.6));
  return <>
    <Head tt={tt} kick="UN CLIENTE · 72 AÑOS" title="ENTRÓ DEL LADO EQUIVOCADO" col={RED} />
    <div style={{ position: "absolute", left: 640, top: 520, width: 640, height: 80, borderRadius: 14, background: "#3a3d42" }} />
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 1320 + i * 150, top: 320, width: 120, height: 220, borderRadius: 12, background: ["#c25a2a", "#2a6ac2", "#7a7f86"][i], opacity: cl(phys(tt, 1.6 + i * 0.3, 6, 0.5) * 2), boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}><div style={{ position: "absolute", left: 14, top: 14, right: 14, height: 60, borderRadius: 8, background: "#1d232a" }} /></div>)}
    <CarTop x={x} y={y} s={0.42} side={1} rot={90 - 180 * cl((p - 0.4) / 0.6)} />
    <Dial x={460} y={330} r={120} v={eio(tt, 3.6, 5.6) * 0.33} n={6} col={AMB} />
    <Big x={460} y={510} txt={`+${mins} MIN`} s={phys(tt, 3.6, 6, 0.5)} col={AMB} size={60} />
  </>;
}}</Stage>;

// ---- 5:25 · LA RESERVA: el tanque en corte; lo que queda cuando prende la luz = 5 a 8 litros = 50 a 100 km ----
export const HReserve: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const lvl = 1 - 0.86 * eio(tt, 0.5, 2.6), on = tt > 2.6 ? 1 : 0;
  return <>
    <Head tt={tt} kick="LA LUZ DE RESERVA" title="¿CUÁNTO TE QUEDA?" col={AMB} />
    <div style={{ position: "absolute", left: 380, top: 380, width: 640, height: 400, borderRadius: "60px 60px 90px 90px", background: "rgba(255,255,255,.05)", border: "6px solid #8a9198", overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lvl * 100}%`, background: "linear-gradient(180deg,#e8b84a,#a8741a)", opacity: 0.85 }} />
    </div>
    <Lamp k="pump" x={1200} y={460} col={LCOL.amber} on={on} s={1} label="RESERVA" />
    <Big x={1500} y={460} txt="5-8 L" s={phys(tt, 3.0, 6, 0.5)} col={AMB} size={90} />
    <Big x={1400} y={760} txt="50-100 KM" s={phys(tt, 3.8, 6, 0.5)} col={TX} size={90} sub="SEGÚN EL AUTO" />
  </>;
}}</Stage>;

// ---- 5:45 · LA BOMBA QUE SE CALIENTA: sumergida en nafta está fresca; con el tanque vacío se pone roja ----
export const HPumpHeat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const lvl = 0.8 - 0.7 * eio(tt, 1.5, 3.8), heat = cl((0.4 - lvl) / 0.3);
  return <>
    <Head tt={tt} kick="POR QUÉ NO ANDAR EN RESERVA" title="LA BOMBA SE ENFRÍA CON LA NAFTA" col={ICE} />
    <div style={{ position: "absolute", left: 560, top: 360, width: 800, height: 520, borderRadius: "70px 70px 110px 110px", border: "6px solid #8a9198", overflow: "hidden", background: "rgba(255,255,255,.04)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lvl * 100}%`, background: "linear-gradient(180deg,rgba(232,184,74,.8),rgba(168,116,26,.9))" }} />
      <div style={{ position: "absolute", left: 340, top: 230, width: 120, height: 240, borderRadius: 30, background: `linear-gradient(90deg, #4a4f55, ${heat > 0.05 ? `rgb(${120 + 135 * heat},${80 - 40 * heat},40)` : "#9aa1a8"}, #4a4f55)`, boxShadow: heat > 0.05 ? `0 0 ${90 * heat}px rgba(255,80,30,${0.6 * heat})` : "none" }} />
      {Array.from({ length: 10 }, (_, i) => { const ph = (tt * 0.6 + rnd(i)) % 1; return <div key={i} style={{ position: "absolute", left: 360 + rnd(i, 2) * 80, top: 220 - ph * 150, width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,.6)", opacity: (1 - heat) * (1 - ph) * cl(lvl * 3) }} />; })}
    </div>
    <Tag tt={tt} at={1.0} x={760} y={320} txt="FRESCA" col={ICE} size={36} />
    <Tag tt={tt} at={4.2} x={1560} y={600} txt="CALIENTE" col={RED} size={48} />
  </>;
}}</Stage>;

// ---- 6:05 · A UN CUARTO, CARGAS: la aguja baja y se clava en 1/4 con la marca ----
export const HQuarter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const v = 0.85 - 0.6 * eio(tt, 0.6, 2.6);
  return <>
    <Head tt={tt} kick="LA REGLA DEL TALLER" title="A UN CUARTO, CARGAS" col={GRN} />
    <FuelDial x={960} y={600} r={300} v={v} side={-1} />
    <Mark x={600} y={430} p={eio(tt, 2.8, 3.4)} ok s={150} />
    <Tag tt={tt} at={3.6} x={960} y={1000} txt="ES LA MISMA PLATA · LA BOMBA TE LO AGRADECE" col={TX} size={36} />
  </>;
}}</Stage>;

// ---- 6:50 · EL BOTÓN QUE PASA LAS PANTALLAS: el palito se aprieta y la pantalla va cambiando ----
export const HScreens: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const P: [string, string][] = [["TOTAL", "184.302 km"], ["TRIP A", "312,4 km"], ["CONSUMO", "7,8 L/100"], ["PROMEDIO", "46 km/h"], ["AUTONOMÍA", "420 km"]];
  const i = Math.min(P.length - 1, Math.floor(Math.max(0, tt - 0.8) / 1.15)), press = Math.max(0, 1 - ((tt - 0.8) % 1.15) * 6);
  return <>
    <Head tt={tt} kick="FUNCIÓN 2" title="LA COMPUTADORA DE A BORDO" col={ICE} />
    <Screen x={860} y={560} w={720} h={340} title={P[i][0]} val={P[i][1]} />
    <div style={{ position: "absolute", left: 1330, top: 520, width: 160, height: 40, borderRadius: 20, background: "linear-gradient(180deg,#3a3d42,#1e2023)", transform: `translateX(${-24 * press}px)`, boxShadow: "0 10px 30px rgba(0,0,0,.5)" }} />
    <Tag tt={tt} at={0.6} x={1410} y={460} txt="EL PALITO" col={AMB} size={30} />
    <div style={{ position: "absolute", left: 500, top: 780, display: "flex", gap: 18 }}>{P.map((_, k) => <div key={k} style={{ width: 120, height: 10, borderRadius: 5, background: k <= i ? ICE : "rgba(255,255,255,.15)" }} />)}</div>
  </>;
}}</Stage>;

// ---- 7:40 · EL PARCIAL A CERO: anillo que se llena mientras dejás apretado y el número cae a 0,0 ----
export const HTripReset: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const hold = eio(tt, 1.0, 3.6), z = tt > 3.6;
  return <>
    <Head tt={tt} kick="EL TRUCO" title="DEJAS APRETADO 2 O 3 SEGUNDOS" col={AMB} />
    <Screen x={760} y={560} w={640} h={300} title="TRIP A" val={z ? "0,0 km" : `${(312.4 * (1 - 0.0 * hold)).toFixed(1).replace(".", ",")} km`} glow={z ? 1.4 : 1} />
    <svg viewBox="-110 -110 220 220" style={{ position: "absolute", left: 1260, top: 420, width: 280, height: 280 }}>
      <circle r={90} fill="#1a1c20" stroke="#2c3036" strokeWidth={14} />
      <circle r={90} fill="none" stroke={z ? GRN : AMB} strokeWidth={14} strokeDasharray={565} strokeDashoffset={565 * (1 - hold)} transform="rotate(-90)" strokeLinecap="round" />
      <circle r={50 - 6 * (tt > 1 && !z ? 1 : 0)} fill="#3a3d42" />
      <text y={14} fill={TX} fontSize={40} fontWeight={900} textAnchor="middle" fontFamily="sans-serif">{z ? "0" : Math.min(3, Math.floor(hold * 3) + 1)}</text>
    </svg>
    <Tag tt={tt} at={4.0} x={760} y={830} txt="DESDE ACÁ SABES CUÁNTO HICISTE CON ESE TANQUE" col={GRN} size={34} />
  </>;
}}</Stage>;

// ---- 8:00 · LA CUENTA: kilómetros del parcial ÷ litros que entraron = tu consumo real ----
export const HDivide: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const a = phys(tt, 0.5, 6, 0.5), b = phys(tt, 1.6, 6, 0.5), c = phys(tt, 3.0, 6, 0.45);
  return <>
    <Head tt={tt} kick="CARGAS LLENO Y DIVIDES" title="TU CONSUMO DE VERDAD" col={GRN} />
    <Big x={460} y={560} txt="612 km" s={a} col={ICE} size={110} sub="EL PARCIAL" />
    <Big x={830} y={560} txt="÷" s={b} col={DIM} size={130} />
    <Big x={1150} y={560} txt="48 L" s={b} col={AMB} size={110} sub="LO QUE ENTRÓ" />
    <Big x={1450} y={560} txt="=" s={c} col={DIM} size={130} />
    <Big x={1640} y={560} txt="12,7" s={c} col={GRN} size={120} sub="KM POR LITRO" />
  </>;
}}</Stage>;

// ---- 8:35 · EL CUADERNITO: tanque por tanque, y los tres últimos suben en rojo ----
export const HNotebook: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const R = ["7,2", "7,1", "7,3", "7,2", "8,1", "8,6", "9,2"];
  return <>
    <Head tt={tt} kick="UNA ENFERMERA · SU CUADERNITO" title="«HACE 3 TANQUES QUE GASTO MÁS»" col={RED} />
    <div style={{ position: "absolute", left: 620, top: 270, width: 680, height: 720, borderRadius: 14, background: "repeating-linear-gradient(180deg,#f4f0e2 0 66px,#b8c8d8 66px 68px)", boxShadow: "0 40px 90px rgba(0,0,0,.55)", transform: `rotate(${-2 + 2 * phys(tt, 0.2, 5, 0.6)}deg)` }}>
      <div style={{ position: "absolute", left: 80, top: 0, bottom: 0, width: 3, background: "#d27a6a" }} />
      {R.map((r, i) => { const s = cl((tt - 0.6 - i * 0.45) * 3), bad = i >= 4;
        return <div key={i} style={{ position: "absolute", left: 120, top: 76 + i * 68, fontFamily: HAND, fontSize: 52, fontWeight: 700, color: bad ? "#c0302a" : "#2a3a5a", opacity: s, whiteSpace: "nowrap" }}>tanque {i + 1} ·  {r} L/100{bad && s > 0.9 ? "  ↑" : ""}</div>; })}
    </div>
    <Tag tt={tt} at={4.4} x={1600} y={480} txt="UNA RUEDA BAJA" col={AMB} size={36} />
    <Tag tt={tt} at={5.0} x={1600} y={560} txt="+ FILTRO TAPADO" col={AMB} size={36} />
  </>;
}}</Stage>;

// ---- 10:00 · LA LLAVECITA DEL SERVICE: cambiaste el aceite pero nadie puso el contador en cero ----
export const HService: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const on = tt > 2.6 ? (Math.sin(tt * 5) > -0.3 ? 1 : 0.4) : 0;
  return <>
    <Head tt={tt} kick="EL AVISO DE MANTENIMIENTO" title="NADIE LO PUSO EN CERO" col={AMB} />
    <div style={{ position: "absolute", left: 300, top: 400, width: 420, height: 420, borderRadius: 30, background: "linear-gradient(180deg,#e9d7a0,#c8a650)", boxShadow: "0 30px 70px rgba(0,0,0,.5)", transform: `scale(${phys(tt, 0.4, 6, 0.5)})`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#3a2a0a", fontWeight: 900, fontSize: 44 }}>ACEITE NUEVO<div style={{ fontSize: 30, marginTop: 10 }}>HOY · 184.302 KM</div></div>
    <Screen x={1260} y={520} w={560} h={260} title="SERVICIO" val={tt > 2.6 ? "0 km" : "300 km"} glow={1} />
    <Lamp k="wrench" x={1260} y={800} col={LCOL.amber} on={on} s={0.9} />
    <Tag tt={tt} at={3.4} x={1260} y={960} txt="NO ES UNA FALLA · NADIE LO RESETEÓ" col={AMB} size={34} />
  </>;
}}</Stage>;

// ---- 10:55 · LA AGUJA LENTA: la nafta se mueve en la curva y la aguja ni se inmuta, a propósito ----
export const HSlow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const slosh = Math.sin(tt * 2.6) * 18 * (1 - eio(tt, 4.5, 6)), v = 0.15 + 0.5 * eio(tt, 1.5, 6.5);
  return <>
    <Head tt={tt} kick="CARGASTE Y NO SUBE" title="EL MEDIDOR ES LENTO A PROPÓSITO" col={ICE} />
    <div style={{ position: "absolute", left: 300, top: 420, width: 640, height: 380, borderRadius: "60px 60px 90px 90px", border: "6px solid #8a9198", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -100, right: -100, bottom: -60, height: `${(0.2 + 0.6 * eio(tt, 0.5, 2)) * 100}%`, background: "linear-gradient(180deg,rgba(232,184,74,.85),rgba(168,116,26,.95))", transform: `rotate(${slosh}deg)` }} />
    </div>
    <FuelDial x={1400} y={600} r={240} v={v} side={-1} />
    <Tag tt={tt} at={4.0} x={1400} y={930} txt="ESPERA UNOS MINUTOS DE MANEJO" col={GRN} size={34} />
  </>;
}}</Stage>;

// ---- 11:45 · LA RUEDITA QUE ALGUIEN TOCÓ: el rodillo baja y el tablero se apaga hasta el negro ----
export const HDimmer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 60% 60% at 50% 45%, #10141c, #030304 70%)">{(tt) => {
  const d = eio(tt, 1.0, 3.2), back = eio(tt, 4.6, 5.8), g = 1 - d + back;
  return <>
    <Head tt={tt} kick="FUNCIÓN 3" title="«SE ME QUEMÓ EL TABLERO»" col={ICE} />
    <Dial x={720} y={580} r={230} v={0.35} n={6} labels={["0", "40", "80", "120", "160", "200", "240"]} glow={g} />
    <Dial x={1260} y={580} r={180} v={0.2} n={4} labels={["0", "2", "4", "6", "8"]} glow={g} />
    <div style={{ position: "absolute", left: 300, top: 440, width: 70, height: 240, borderRadius: 35, background: "linear-gradient(90deg,#1b1c1f,#3a3d42,#1b1c1f)", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,.6)" }}>
      {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: 6, right: 6, top: ((i * 22 + (d - back) * 140) % 300) - 20, height: 6, borderRadius: 3, background: "#55595f" }} />)}
    </div>
    <WIcon k="sun" x={335} y={390} s={0.7} col={AMB} />
    <Tag tt={tt} at={3.4} x={960} y={930} txt="NO SE QUEMÓ NADA · BAJARON EL BRILLO" col={AMB} size={36} />
  </>;
}}</Stage>;

// ---- 12:20 · DÓNDE ESTÁ: el rodillo, el más/menos y el menú, los tres con el solcito ----
export const HSunPlaces: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const K: [string, React.ReactNode][] = [
    ["EL RODILLO", <div style={{ width: 60, height: 200, borderRadius: 30, background: "repeating-linear-gradient(180deg,#2a2c30 0 12px,#4a4e54 12px 16px)" }} />],
    ["EL + Y EL −", <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{["+", "−"].map((c) => <div key={c} style={{ width: 110, height: 90, borderRadius: 16, background: "#2a2c30", color: TX, fontWeight: 900, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>{c}</div>)}</div>],
    ["EN LA PANTALLA", <div style={{ width: 240, height: 150, borderRadius: 14, background: "#0d141c", border: "3px solid #22303d", color: "#9fd8ff", fontWeight: 800, fontSize: 26, padding: 18, boxSizing: "border-box" }}>BRILLO<div style={{ marginTop: 16, height: 14, borderRadius: 7, background: `linear-gradient(90deg,#9fd8ff ${50 + 30 * Math.sin(tt)}%, #22303d 0)` }} /></div>],
  ];
  return <>
    <Head tt={tt} kick="BUSCA EL SOLCITO" title="TRES FORMAS, EL MISMO DIBUJITO" col={AMB} />
    {K.map(([l, el], i) => { const s = phys(tt, 0.6 + i * 0.6, 7, 0.5);
      return <div key={i} style={{ position: "absolute", left: 420 + i * 540, top: 600, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * s})`, opacity: cl(s * 2), display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <WIcon k="sun" x={0} y={0} s={0.9} col={AMB} />
        <div style={{ marginTop: 70 }}>{el}</div>
        <div style={{ fontWeight: 900, fontSize: 34, color: TX, whiteSpace: "nowrap" }}>{l}</div>
      </div>; })}
    <Tag tt={tt} at={4.4} x={960} y={1000} txt="A VECES LA TOCAS CON LA RODILLA AL SUBIR" col={DIM} size={30} />
  </>;
}}</Stage>;
export { BLUE };
