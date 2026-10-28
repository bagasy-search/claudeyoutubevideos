// componentes únicos de mec28a · primera mitad (la falla chica, la cuenta del taller, las dos cajas, la tapa-mapa, la pinza, el contraluz, los colores).
// Cada uno es UN objeto que se entiende sin leer, con física de resorte, cámara curva (Stage) y sin translateZ/rotateY.
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Arrow, Big, Coin, DashBar, FCOL, Fuse, Icon, Mark, METAL, rnd } from "./mkit";

// ---- 0:05 · DE UN DÍA PARA EL OTRO: cuatro cosas del tablero se apagan de a una ----
export const HDead: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const K = [["radio", "LA RADIO"], ["usb", "EL CARGADOR"], ["bulb", "LA LUZ DE ADENTRO"], ["wiper", "EL LIMPIA"]];
  return <>
    <Head tt={tt} kick="DE UN DÍA PARA EL OTRO" title="DEJA DE ANDAR UNA COSA" col={RED} />
    <DashBar y={560} />
    {K.map(([k, l], i) => { const off = cl((tt - 1.4 - i * 0.8) / 0.25), s = phys(tt, 0.4 + i * 0.15, 6, 0.5); const flick = off > 0 && off < 1 ? (Math.sin(tt * 60) > 0 ? 1 : 0.3) : 1;
      return <div key={k} style={{ position: "absolute", left: 300 + i * 360, top: 640, width: 240, height: 240, borderRadius: 30, background: "rgba(0,0,0,.45)", border: `2px solid ${off >= 1 ? "rgba(255,90,74,.5)" : "rgba(130,200,255,.4)"}`, transform: `scale(${0.6 + 0.4 * s})`, opacity: cl(s * 2) }}>
        <Icon k={k} x={120} y={110} s={1.7} col={off >= 1 ? "rgba(255,255,255,.18)" : ICE} op={flick} w={5} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 188, textAlign: "center", fontWeight: 900, fontSize: 24, letterSpacing: 2, color: off >= 1 ? RED : TX }}>{l}</div>
      </div>; })}
    <Tag tt={tt} at={4.8} x={960} y={420} txt="¿Y SI ES UNA PIEZA DE 50 CENTAVOS?" col={AMB} size={50} />
  </>;
}}</Stage>;

// ---- 0:22 · LA CUENTA DEL TALLER vs 50 CENTAVOS: balanza que se va al piso ----
export const HBill: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const L = [["DIAGNÓSTICO", 1.0], ["1 H DE MANO DE OBRA", 1.6], ["UN REPUESTO", 2.2], ["2 DÍAS SIN AUTO", 2.8]];
  const tilt = 14 * eio(tt, 3.6, 4.6);
  return <>
    <Head tt={tt} kick="«ES ELÉCTRICO, DÉJAMELO 2 DÍAS»" title="LO QUE PAGAS vs LO QUE ERA" col={RED} />
    <div style={{ position: "absolute", left: 960, top: 300, width: 0, height: 0, transform: `rotate(${-tilt}deg)` }}>
      <div style={{ position: "absolute", left: -560, top: -8, width: 1120, height: 16, borderRadius: 8, background: METAL }} />
      <div style={{ position: "absolute", left: -560, top: 8, width: 420, height: 420 + tilt * 6 }}>
        {L.map(([l, a], i) => { const s = phys(tt, a as number, 7, 0.5); return s <= 0.01 ? null : <div key={i} style={{ position: "absolute", left: 20, top: 300 - i * 80 - (1 - s) * 200, width: 400, height: 70, borderRadius: 10, background: "#f4efe4", color: "#3a2a1a", fontWeight: 900, fontSize: 25, whiteSpace: "nowrap", padding: "18px 20px", boxSizing: "border-box", boxShadow: "0 12px 26px rgba(0,0,0,.45)", transform: `rotate(${(rnd(i) - 0.5) * 6 + tilt}deg)`, opacity: cl(s * 2) }}>{l}</div>; })}
      </div>
      <div style={{ position: "absolute", left: 160, top: 8, width: 400, height: 300 }}>
        <div style={{ transform: `rotate(${tilt}deg)` }}><Fuse x={200} y={170} s={1.1} amp="15" /></div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 930, top: 300, width: 60, height: 560, background: "linear-gradient(90deg,#4a4d52,#8a9096,#4a4d52)", borderRadius: 10 }} />
    <Big x={1500} y={860} txt="50 ¢" s={phys(tt, 4.4, 6, 0.5)} col={GRN} size={140} sub="LO QUE MUCHAS VECES ERA" />
  </>;
}}</Stage>;

// ---- 0:40 · MÁS CHICO QUE LA UÑA: el fusible al lado de una moneda y una regla ----
export const HTiny: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const z = 1 + 1.4 * eio(tt, 2.6, 4.4);
  return <>
    <Head tt={tt} kick="LA PIEZA" title="UN FUSIBLE DE CUCHILLA" col={AMB} />
    <div style={{ position: "absolute", left: 960, top: 600, width: 0, height: 0, transform: `scale(${z})` }}>
      <div style={{ position: "absolute", left: -380, top: 150, width: 760, height: 60, background: "linear-gradient(180deg,#e8d9a8,#c9b67a)", borderRadius: 6, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
        {Array.from({ length: 39 }, (_, i) => <div key={i} style={{ position: "absolute", left: 10 + i * 19.4, top: 0, width: 2, height: i % 5 ? 16 : 30, background: "#4a3a1a" }} />)}
      </div>
      <Fuse x={-60} y={40} s={0.55 * phys(tt, 0.5, 7, 0.45)} amp="10" />
      <Coin x={150} y={70} s={0.75 * phys(tt, 1.0, 7, 0.45)} />
    </div>
    <Tag tt={tt} at={1.6} x={760} y={900} txt="2 CM" col={TX} size={46} />
    <Tag tt={tt} at={4.5} x={1500} y={300} txt="DOS PATITAS · UN PUENTECITO" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 1:12 · EL 90 % HONESTO: la torta de los problemas del auto y la porción eléctrica chica ----
export const HPie: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const p = eio(tt, 0.6, 2.0), cut = eio(tt, 2.6, 3.6), q = eio(tt, 4.0, 5.2);
  const arc = (a0: number, a1: number, r: number) => { const x0 = Math.cos(a0) * r, y0 = Math.sin(a0) * r, x1 = Math.cos(a1) * r, y1 = Math.sin(a1) * r; return `M0 0 L${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1} ${y1} Z`; };
  const A = -Math.PI / 2, S = 0.28 * Math.PI * 2;
  return <>
    <Head tt={tt} kick="TE LO DIGO DE FRENTE" title="NO ES EL 90 % DE TODO" col={AMB} />
    <svg viewBox="-300 -300 600 600" style={{ position: "absolute", left: 300, top: 260, width: 600, height: 600, overflow: "visible" }}>
      <path d={arc(A + S, A + S + (Math.PI * 2 - S) * p, 260)} fill="#3a3530" stroke="#1a1714" strokeWidth={4} />
      <g transform={`translate(${60 * cut} ${-30 * cut})`}><path d={arc(A, A + S * p, 260)} fill={AMB} stroke="#1a1714" strokeWidth={4} /></g>
    </svg>
    <Tag tt={tt} at={1.4} x={560} y={900} txt="MOTOR · CAJA · FRENOS · SUSPENSIÓN" col={DIM} size={30} />
    <div style={{ position: "absolute", left: 1050, top: 340, width: 700, opacity: cl(cut * 2) }}>
      <div style={{ fontWeight: 900, fontSize: 40, color: AMB }}>LAS FALLAS ELÉCTRICAS CHICAS</div>
      {[["radio", "La radio"], ["usb", "El USB y el encendedor"], ["bulb", "Una luz"], ["wiper", "El limpia"], ["window", "Los vidrios"]].map(([k, l], i) => { const s = phys(tt, 3.0 + i * 0.2, 7, 0.5); return <div key={k} style={{ position: "relative", height: 74, marginTop: 10, opacity: cl(s * 2), transform: `translateX(${(1 - s) * 60}px)` }}>
        <Icon k={k} x={36} y={36} s={0.8} col={TX} /><div style={{ position: "absolute", left: 90, top: 16, fontSize: 36, fontWeight: 800 }}>{l}</div></div>; })}
    </div>
    <Big x={1400} y={930} txt="90 %" s={q} col={GRN} size={110} sub="DE ESAS · FUSIBLE O RELÉ" />
  </>;
}}</Stage>;

// ---- 2:40 · EL TEASER DEL PUNTO 8: fusible más grande, el cable que se pone al rojo ----
export const HTeaser: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="radial-gradient(ellipse 70% 60% at 50% 50%, #2a0e0a, #070708 72%)">{(tt) => {
  const heat = eio(tt, 1.6, 4.6);
  return <>
    <Head tt={tt} kick="EL PUNTO 8" title="EL QUE PUEDE PRENDER FUEGO" col={RED} />
    <Fuse x={520} y={560} s={1.5 * phys(tt, 0.4, 7, 0.45)} amp="30" />
    <Tag tt={tt} at={0.9} x={520} y={820} txt="UNO DE 30" col={GRN} size={40} />
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
      <path d="M640 560 C 900 440, 1100 700, 1720 560" stroke={`rgb(${120 + 135 * heat},${60 + 40 * heat * (1 - heat)},${40 - 30 * heat})`} strokeWidth={22} fill="none" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 ${40 * heat}px rgba(255,90,30,${heat}))` }} />
      {Array.from({ length: 10 }, (_, i) => { const k = ((tt * 0.5 + rnd(i)) % 1); return heat < 0.6 ? null : <circle key={i} cx={1000 + rnd(i, 2) * 500} cy={560 - k * 300} r={20 + k * 40} fill={`rgba(90,90,90,${(heat - 0.6) * (1 - k)})`} />; })}
    </svg>
    <Tag tt={tt} at={2.2} x={1180} y={760} txt="EL CABLE ES PARA 15" col={RED} size={44} />
  </>;
}}</Stage>;

// ---- 3:45 · LAS DOS CAJAS: el auto visto desde arriba, dos cajas que se prenden ----
export const HTwoBoxes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const a = phys(tt, 1.0, 6, 0.5), b = phys(tt, 2.4, 6, 0.5);
  return <>
    <Head tt={tt} kick="PUNTO 1" title="SON DOS · NO UNA" col={AMB} />
    <div style={{ position: "absolute", left: 560, top: 230, width: 800, height: 760, transform: "rotate(90deg)" }}>
      <div style={{ position: "absolute", left: 120, top: 0, width: 560, height: 760, borderRadius: "180px 180px 120px 120px", background: "linear-gradient(90deg,#8e959c,#d4d9de 50%,#8e959c)", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 170, top: 250, width: 460, height: 120, borderRadius: 30, background: "#24303a" }} />
      <div style={{ position: "absolute", left: 180, top: 380, width: 440, height: 250, borderRadius: 20, background: "#3a3f45" }} />
    </div>
    <div style={{ position: "absolute", left: 1150, top: 470, width: 150, height: 110, borderRadius: 12, background: "#111", border: `4px solid ${AMB}`, boxShadow: `0 0 ${60 * a}px ${AMB}`, transform: `scale(${a})` }} />
    <div style={{ position: "absolute", left: 760, top: 610, width: 120, height: 80, borderRadius: 10, background: "#111", border: `4px solid ${ICE}`, boxShadow: `0 0 ${60 * b}px ${ICE}`, transform: `scale(${b})` }} />
    <Tag tt={tt} at={1.4} x={1460} y={420} txt="EN EL MOTOR" col={AMB} size={40} anchor="l" />
    <Tag tt={tt} at={2.8} x={960} y={950} txt="ADENTRO · DONDE VAS SENTADO" col={ICE} size={40} />
  </>;
}}</Stage>;

// ---- 4:00 · QUÉ PROTEGE CADA UNA: los íconos vuelan a su caja ----
export const HSort: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const IN = ["radio", "bulb", "usb", "window", "lock", "horn"], OUT = ["fan", "bulb", "plug", "defrost", "fan", "horn"];
  const OL = ["VENTILADOR", "LUCES DE ADELANTE", "ARRANQUE", "DESEMPAÑADOR", "AIRE", "BOMBA"];
  const IL = ["RADIO", "LUCES DE ADENTRO", "USB", "VIDRIOS", "CIERRE", "BOCINA"];
  return <>
    <Head tt={tt} kick="QUÉ CUIDA CADA CAJA" title="LO CHICO ADENTRO · LO GRANDE AFUERA" col={AMB} />
    {[0, 1].map((c) => <div key={c} style={{ position: "absolute", left: c ? 1030 : 170, top: 230, width: 720, height: 760, borderRadius: 30, background: "rgba(0,0,0,.4)", border: `2px solid ${c ? AMB : ICE}55` }}>
      <div style={{ textAlign: "center", marginTop: 20, fontWeight: 900, fontSize: 38, color: c ? AMB : ICE }}>{c ? "LA DEL MOTOR" : "LA DE ADENTRO"}</div></div>)}
    {IN.map((k, i) => { const s = phys(tt, 0.6 + i * 0.3, 7, 0.5); return s <= 0.01 ? null : <div key={"i" + i}><Icon k={k} x={260 + (i % 2) * 320} y={380 + Math.floor(i / 2) * 200 - (1 - s) * 300} s={1.1} col={ICE} op={cl(s * 2)} />
      <div style={{ position: "absolute", left: 320 + (i % 2) * 320, top: 362 + Math.floor(i / 2) * 200, fontWeight: 800, fontSize: 24, opacity: cl(s * 2) }}>{IL[i]}</div></div>; })}
    {OUT.map((k, i) => { const s = phys(tt, 2.6 + i * 0.3, 7, 0.5); return s <= 0.01 ? null : <div key={"o" + i}><Icon k={k} x={1120 + (i % 2) * 320} y={380 + Math.floor(i / 2) * 200 - (1 - s) * 300} s={1.1} col={AMB} op={cl(s * 2)} />
      <div style={{ position: "absolute", left: 1180 + (i % 2) * 320, top: 362 + Math.floor(i / 2) * 200, fontWeight: 800, fontSize: 24, opacity: cl(s * 2) }}>{OL[i]}</div></div>; })}
  </>;
}}</Stage>;

// ---- 4:35 · LOS 3 LUGARES: el costado del tablero con tres pines que caen ----
export const HPlaces: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const P = [[520, 820, "ABAJO DEL VOLANTE · CERCA DE LAS RODILLAS"], [260, 560, "EL COSTADO DEL TABLERO · PUERTA ABIERTA"], [1300, 700, "DETRÁS DE LA GUANTERA"]];
  return <>
    <Head tt={tt} kick="LA CAJA DE ADENTRO" title="LOS 3 LUGARES MÁS COMUNES" col={ICE} />
    <DashBar y={480} />
    <div style={{ position: "absolute", left: 440, top: 420, width: 260, height: 260, borderRadius: "50%", border: "26px solid #2a2b2f", boxShadow: "0 20px 40px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 1180, top: 640, width: 380, height: 150, borderRadius: 16, background: "#202125", border: "2px solid rgba(255,255,255,.08)" }} />
    {P.map(([x, y, l], i) => { const s = phys(tt, 1.0 + i * 1.1, 7, 0.4); return s <= 0.01 ? null : <div key={i}>
      <div style={{ position: "absolute", left: (x as number) - 40, top: (y as number) - 110 - (1 - s) * 260, width: 80, height: 80, borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", background: AMB, boxShadow: "0 10px 30px rgba(0,0,0,.6)", opacity: cl(s * 2), display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ transform: "rotate(45deg)", fontWeight: 900, fontSize: 40, color: "#1a1408" }}>{i + 1}</div></div>
      <div style={{ position: "absolute", left: 140, top: 1000 - (2 - i) * 0, width: 0 }} />
    </div>; })}
    {P.map(([, , l], i) => <Tag key={i} tt={tt} at={1.3 + i * 1.1} x={160} y={240 + i * 60} txt={`${i + 1}. ${l}`} col={i === 2 ? AMB : TX} size={32} anchor="l" />)}
  </>;
}}</Stage>;

// ---- 6:20 · LA TAPA ES EL MAPA: la tapa se da vuelta (volteo en Y por escala) y aparece la grilla con íconos ----
export const HLid: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const f = eio(tt, 0.8, 1.8), sy = Math.abs(1 - 2 * f), back = f > 0.5;
  const IC = ["radio", "bulb", "wiper", "horn", "usb", "window", "fan", "defrost", "lock", "brake", "plug", "bulb"];
  const AM = ["10", "10", "20", "15", "15", "20", "25", "30", "15", "10", "15", "7.5"];
  const hi = cl((tt - 3.2) / 0.3);
  return <>
    <Head tt={tt} kick="PUNTO 2" title="LA TAPA ES EL MAPA" col={AMB} />
    <div style={{ position: "absolute", left: 460, top: 260, width: 1000, height: 640, transform: `scaleY(${0.2 + 0.8 * sy})`, borderRadius: 26, background: back ? "#16171a" : "linear-gradient(160deg,#2c2d31,#121316)", boxShadow: "0 40px 90px rgba(0,0,0,.7)", border: "3px solid #2e3035" }}>
      {!back && <div style={{ position: "absolute", left: 0, right: 0, top: 280, textAlign: "center", fontWeight: 900, fontSize: 40, color: "rgba(255,255,255,.25)", letterSpacing: 8 }}>FUSIBLES</div>}
      {back && IC.map((k, i) => { const c = i % 4, r = Math.floor(i / 4), s = phys(tt, 1.9 + i * 0.08, 7, 0.5), on = i === 4 ? hi : 0; return <div key={i} style={{ position: "absolute", left: 40 + c * 240, top: 40 + r * 196, width: 210, height: 170, borderRadius: 14, border: `2px solid ${on ? AMB : "rgba(255,255,255,.18)"}`, background: on ? "rgba(242,180,60,.18)" : "transparent", opacity: cl(s * 2), transform: `scale(${(0.8 + 0.2 * s) * (1 + 0.08 * on)})` }}>
        <div style={{ position: "absolute", left: 10, top: 8, fontWeight: 900, fontSize: 26, color: DIM }}>{i + 1}</div>
        <Icon k={k} x={105} y={74} s={1} col={on ? AMB : TX} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 124, textAlign: "center", fontWeight: 900, fontSize: 26, color: FCOL[AM[i]] === "#e8e8e8" ? TX : FCOL[AM[i]] }}>{AM[i]} A</div></div>; })}
    </div>
    <Tag tt={tt} at={3.4} x={960} y={960} txt="NÚMERO · DIBUJITO · AMPERES" col={AMB} size={44} />
  </>;
}}</Stage>;

// ---- 7:25 · CONTAR HASTA EL 12: el dedo recorre la caja en el mismo orden que el dibujo ----
export const HCount12: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const n = Math.min(12, Math.floor(cl((tt - 1.0) / 3.2) * 12) + (tt > 1 ? 1 : 0));
  const AM = ["10", "15", "10", "20", "7.5", "15", "10", "5", "20", "15", "10", "15", "25", "10", "20", "7.5"];
  return <>
    <Head tt={tt} kick="EL ENCENDEDOR NO ANDA" title="LA TAPA DICE: Nº 12 · 15 A" col={AMB} />
    <div style={{ position: "absolute", left: 460, top: 250, width: 1000, height: 660, borderRadius: 26, background: "#141518", border: "3px solid #2c2e33", boxShadow: "0 40px 90px rgba(0,0,0,.7)" }} />
    {AM.map((a, i) => { const c = i % 8, r = Math.floor(i / 8), on = i + 1 === n, past = i + 1 < n, fin = i === 11 && n === 12;
      return <div key={i}><Fuse x={560 + c * 115} y={430 + r * 280} s={0.82 * (on || fin ? 1.12 : 1)} amp={a} glow={fin ? 0.8 : 0} op={past && !fin ? 0.45 : 1} />
        <div style={{ position: "absolute", left: 530 + c * 115, top: 330 + r * 280, width: 60, textAlign: "center", fontWeight: 900, fontSize: 26, color: fin ? AMB : on ? TX : DIM }}>{i + 1}</div></div>; })}
    <Big x={1650} y={560} txt={String(n)} s={phys(tt, 1.0, 6, 0.6)} col={n === 12 ? AMB : TX} size={180} sub={n === 12 ? "AHÍ ESTÁ" : "CONTANDO"} />
  </>;
}}</Stage>;

// ---- 7:52 · EL DIBUJO AL REVÉS: la tapa y la caja se alinean por el relé cuadrado ----
export const HMirror: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const r = eio(tt, 1.6, 3.2), slide = eio(tt, 3.4, 4.4);
  const Grid: React.FC<{ x: number; rot: number; lid?: boolean }> = ({ x, rot, lid }) => <div style={{ position: "absolute", left: x, top: 330, width: 560, height: 420, borderRadius: 20, background: lid ? "#1c1d21" : "#121316", border: `3px solid ${lid ? AMB : "#34363c"}`, transform: `rotate(${rot}deg)` }}>
    {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + (i % 5) * 70, top: 40 + Math.floor(i / 5) * 170, width: 46, height: 120, borderRadius: 8, background: lid ? "transparent" : "rgba(80,120,220,.5)", border: lid ? "2px solid rgba(255,255,255,.3)" : undefined }} />)}
    <div style={{ position: "absolute", left: 410, top: 60, width: 110, height: 110, borderRadius: 10, background: lid ? "transparent" : "#2a2c30", border: `3px solid ${GRN}` }} />
    <div style={{ position: "absolute", left: 410, top: 240, width: 110, height: 110, borderRadius: 10, border: "3px dashed rgba(255,255,255,.3)" }} />
  </div>;
  return <>
    <Head tt={tt} kick="UN TRUCO PARA NO PERDERTE" title="UBICA EL DIBUJO CON UNA FORMA" col={GRN} />
    <Grid x={300} rot={0} />
    <Grid x={1060 - 420 * slide} rot={180 * (1 - r)} lid />
    <Tag tt={tt} at={1.0} x={580} y={820} txt="LA CAJA" col={TX} size={36} />
    <Tag tt={tt} at={1.0} x={1340} y={820} txt="LA TAPA · AL REVÉS" col={AMB} size={36} />
    <Tag tt={tt} at={3.6} x={960} y={930} txt="EL RELÉ CUADRADO = TU GUÍA" col={GRN} size={44} />
  </>;
}}</Stage>;

// ---- 8:30 · LA PINZA: abre como tijerita, agarra y tira derecho ----
export const HPuller: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const open = eio(tt, 0.8, 1.4) * (1 - eio(tt, 2.0, 2.4)), down = eio(tt, 1.2, 2.0), pull = phys(tt, 2.6, 6, 0.6);
  const y = 260 + 200 * down - 220 * pull;
  return <>
    <Head tt={tt} kick="PUNTO 3" title="LA PINZA QUE YA VIENE EN TU AUTO" col={AMB} />
    <div style={{ position: "absolute", left: 620, top: 640, width: 680, height: 300, borderRadius: 20, background: "#121316", border: "3px solid #2c2e33" }} />
    {[0, 1, 2, 4, 5].map((i) => <Fuse key={i} x={700 + i * 104} y={720} s={0.7} amp={["10", "15", "20", "", "7.5", "10"][i]} />)}
    <Fuse x={1012} y={720 - 220 * pull} s={0.7} amp="15" />
    {[-1, 1].map((d) => <div key={d} style={{ position: "absolute", left: 1004 + d * (14 + 40 * open), top: y, width: 18, height: 380, borderRadius: 8, background: "linear-gradient(90deg,#f2f2ee,#cfcfc8)", transformOrigin: "50% 0", transform: `rotate(${-d * 6 * open}deg)`, boxShadow: "0 20px 30px rgba(0,0,0,.4)" }} />)}
    <div style={{ position: "absolute", left: 960, top: y - 40, width: 100, height: 60, borderRadius: 14, background: "#efeee8" }} />
    <Arrow x1={1220} y1={600} x2={1220} y2={360} p={cl((tt - 2.6) / 0.5)} col={GRN} />
    <Tag tt={tt} at={3.0} x={1300} y={300} txt="DERECHO PARA AFUERA" col={GRN} size={40} anchor="l" />
  </>;
}}</Stage>;

// ---- 9:20 · NUNCA CON DESTORNILLADOR: palanca, crack y la patita que se dobla ----
export const HPry: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse 70% 60% at 50% 50%, #241310, #070708 72%)">{(tt) => {
  const lev = eio(tt, 0.8, 2.0), crack = cl((tt - 1.9) / 0.3), x = cl((tt - 3.0) / 0.5);
  return <>
    <Head tt={tt} kick="LO QUE NO HAGAS" title="SACARLO HACIENDO PALANCA" col={RED} />
    <Fuse x={860} y={580} s={1.7} amp="15" rot={8 * lev} />
    <div style={{ position: "absolute", left: 980, top: 600, width: 700, height: 26, borderRadius: 6, background: METAL, transformOrigin: "0 50%", transform: `rotate(${-14 - 10 * lev}deg)` }}>
      <div style={{ position: "absolute", left: 360, top: -22, width: 340, height: 70, borderRadius: 20, background: "linear-gradient(180deg,#e0b020,#a07a10)" }} />
    </div>
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}><path d="M820 470 l20 30 l-14 18 l24 34 l-10 22" stroke="#fff" strokeWidth={5} fill="none" strokeDasharray={160} strokeDashoffset={160 * (1 - crack)} /></svg>
    <Mark x={600} y={420} p={x} s={220} />
    <Tag tt={tt} at={2.2} x={960} y={900} txt="SE ROMPE · SE DOBLA LA PATITA · QUEDA FLOJO" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- 10:00 · A CONTRALUZ: la luz detrás del fusible; entero vs cortado ----
export const HBacklight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 60% 60% at 50% 45%, #2b2a24, #050506 70%)">{(tt) => {
  const L = eio(tt, 0.6, 1.6), b = eio(tt, 2.6, 3.4);
  return <>
    <Head tt={tt} kick="PUNTO 4" title="PONLO A CONTRALUZ" col={AMB} />
    <div style={{ position: "absolute", left: 360, top: 200, width: 1200, height: 160, borderRadius: 80, background: `rgba(255,255,240,${0.85 * L})`, boxShadow: `0 0 ${220 * L}px rgba(255,250,220,${0.8 * L})` }} />
    <Fuse x={720} y={600} s={2.0} amp="10" glow={L} />
    <Fuse x={1200} y={600} s={2.0} amp="10" glow={L} blown={b} />
    <Mark x={720} y={900} p={cl((tt - 3.6) / 0.4)} ok s={130} />
    <Mark x={1200} y={900} p={cl((tt - 3.9) / 0.4)} s={130} />
    <Tag tt={tt} at={1.8} x={720} y={1010} txt="ENTERO" col={GRN} size={40} />
    <Tag tt={tt} at={3.2} x={1200} y={1010} txt="CORTADO" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- 11:00 · LOS COLORES: barras de colores, la altura es el amperaje ----
export const HColors: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const A = ["5", "7.5", "10", "15", "20", "25", "30"], N = ["BEIGE", "MARRÓN", "ROJO", "AZUL", "AMARILLO", "BLANCO", "VERDE"];
  return <>
    <Head tt={tt} kick="IGUAL EN CASI TODOS LOS AUTOS" title="EL COLOR TE DICE EL AMPERAJE" col={AMB} />
    {A.map((a, i) => { const s = phys(tt, 0.6 + i * 0.32, 6.5, 0.5), H0 = 60 + parseFloat(a) * 16;
      return <div key={a}>
        <div style={{ position: "absolute", left: 240 + i * 210, top: 900 - H0 * cl(s), width: 130, height: H0 * cl(s), borderRadius: "16px 16px 4px 4px", background: `linear-gradient(90deg,${FCOL[a]}cc,${FCOL[a]},${FCOL[a]}aa)`, boxShadow: `0 0 40px ${FCOL[a]}44` }} />
        <div style={{ position: "absolute", left: 220 + i * 210, top: 860 - H0 * cl(s) - 70, width: 170, textAlign: "center", fontWeight: 900, fontSize: 52, opacity: cl(s * 2) }}>{a}</div>
        <div style={{ position: "absolute", left: 200 + i * 210, top: 920, width: 210, textAlign: "center", fontWeight: 800, fontSize: 24, letterSpacing: 1, color: DIM, opacity: cl(s * 2) }}>{N[i]}</div>
      </div>; })}
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: cl((tt - 3.6) / 0.4) }}><rect x={630} y={480} width={640} height={540} rx={20} fill="none" stroke={AMB} strokeWidth={5} strokeDasharray="20 14" /></svg>
    <Tag tt={tt} at={3.8} x={950} y={1040} txt="ROJO · AZUL · AMARILLO = LOS QUE MÁS VAS A VER" col={AMB} size={34} />
  </>;
}}</Stage>;

// ---- 11:35 · TRES TAMAÑOS: mini, normal y maxi que caen en escala ----
export const HSizes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <>
  <Head tt={tt} kick="Y OTRA COSA" title="MISMO COLOR · TRES TAMAÑOS" col={ICE} />
  {[["MINI", 0.9, 520], ["NORMAL", 1.3, 900], ["MAXI", 2.1, 1400]].map(([l, s, x], i) => { const q = phys(tt, 0.7 + i * 0.6, 7, 0.42); return <div key={i}>
    <Fuse x={x as number} y={620 - (1 - q) * 300} s={(s as number) * cl(q)} amp="20" />
    <Tag tt={tt} at={1.0 + i * 0.6} x={x as number} y={930} txt={l as string} col={i === 2 ? AMB : TX} size={44} />
  </div>; })}
  <Tag tt={tt} at={3.4} x={960} y={300} txt="LLEVA EL QUEMADO EN EL BOLSILLO Y COMPARA" col={GRN} size={40} />
</>}</Stage>;
