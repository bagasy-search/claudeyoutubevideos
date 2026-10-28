// componentes únicos de al28b · C: minutos 21-33 (extractor y ventana, aislación, filtración, comentarios, el techo blanco).
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Ceil, Drop, Mold, rnd } from "./heroesA";

// ---- 21:22 · EL PLANO DE LA CASA: el vapor de la ducha como humo azul; con la puerta abierta llena la casa y llega al ropero; con la ventana abierta se va ----
export const HPlan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const bad = cl((tt - 0.8) / 2.6), sw = eio(tt, 3.6, 4.4), good = cl((tt - 4.4) / 2.2);
  const room = (x: number, y: number, w: number, hh: number, l: string) => <div style={{ position: "absolute", left: x, top: y, width: w, height: hh, boxShadow: "inset 0 0 0 5px rgba(255,255,255,.55)", borderRadius: 4 }}><div style={{ position: "absolute", left: 18, top: 12, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: DIM }}>{l}</div></div>;
  const vap = (k: number, toX: number, toY: number, seed: number, n: number) => Array.from({ length: n }, (_, i) => { const q = cl(k * 1.3 - rnd(i + seed) * 0.3), x = 470 + (toX - 470) * q + (rnd(i + seed + 1) - 0.5) * 200 * q, y = 420 + (toY - 420) * q + (rnd(i + seed + 2) - 0.5) * 200 * q;
    return <div key={`${seed}${i}`} style={{ position: "absolute", left: x - 50, top: y - 40, width: 100, height: 80, borderRadius: "50%", background: "rgba(150,200,240,.4)", filter: "blur(14px)", opacity: q > 0 ? 0.9 : 0 }} />; });
  return <>
    <Head tt={tt} kick="CUANDO TE BAÑAS" title="PUERTA CERRADA, VENTANA ABIERTA" />
    <div style={{ position: "absolute", left: 300, top: 250 }}>
      {room(0, 0, 420, 360, "BAÑO")}{room(420, 0, 600, 360, "PASILLO")}{room(1020, 0, 360, 360, "DORMITORIO")}{room(0, 360, 1380, 330, "LIVING Y COCINA")}
      {/* puerta del baño: abierta → cerrada */}
      <div style={{ position: "absolute", left: 410, top: 140, width: 20, height: 120, background: sw > 0.5 ? AMB : "transparent", boxShadow: sw > 0.5 ? `0 0 20px ${AMB}` : "none" }} />
      {/* ventana del baño */}
      <div style={{ position: "absolute", left: 60, top: -12, width: 140, height: 24, background: sw > 0.5 ? GRN : "rgba(255,255,255,.55)", borderRadius: 4 }} />
      {/* ropero */}
      <div style={{ position: "absolute", left: 1250, top: 60, width: 100, height: 260, background: "#5a4330", borderRadius: 6 }}>{bad > 0.7 && sw < 0.5 && <Mold n={30} cx={50} cy={130} rx={40} ry={110} p={cl((bad - 0.7) * 3)} sz={9} seed={4} />}</div>
    </div>
    <div style={{ position: "absolute", left: 300, top: 250, opacity: 1 - sw }}>{vap(bad, 1200, 200, 1, 26).map((e) => e)}{vap(bad, 700, 520, 60, 18)}</div>
    <div style={{ position: "absolute", left: 300, top: 250, opacity: sw }}>{vap(good, 130, -260, 90, 26)}</div>
    <Tag tt={tt} at={2.2} x={1380} y={1012} txt="EN UNA SEMANA: MOHO EN EL ROPERO" col={RED} size={34} />
    <Tag tt={tt} at={5.0} x={600} y={1012} txt="EL VAPOR SALE PARA AFUERA" col={GRN} size={40} />
  </>;
}}</Stage>;

// ---- 22:27 · UN LITRO: la ropa colgada adentro gotea vapor y una jarra de un litro se llena… y la jarra se vacía en el techo ----
export const HLiter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const fill = eio(tt, 0.8, 4.0), pour = eio(tt, 4.4, 5.6);
  return <>
    <Head tt={tt} kick="UNA TANDA DE ROPA MOJADA" title="MÁS DE UN LITRO AL AIRE" col={ICE} />
    <div style={{ position: "absolute", left: 220, top: 300, width: 680, height: 8, background: "#9aa2ab" }} />
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 250 + i * 160, top: 308, width: 130, height: 220 + (i % 2) * 60, borderRadius: "6px 6px 20px 20px", background: ["#b85c4a", "#4a78b8", "#e0c060", "#5a9a6a"][i], boxShadow: "inset -14px 0 20px rgba(0,0,0,.25), 0 20px 30px rgba(0,0,0,.4)", transform: `rotate(${Math.sin(tt * 0.8 + i) * 2}deg)`, transformOrigin: "50% 0" }} />)}
    {Array.from({ length: 24 }, (_, i) => { const ph = (tt * 0.35 + rnd(i)) % 1, x0 = 260 + rnd(i + 2) * 620; return <div key={i} style={{ position: "absolute", left: x0 + ph * 400 * (x0 > 600 ? 1 : 0.6), top: 520 - ph * 300 - (x0 - 260) * 0.1, width: 70, height: 56, borderRadius: "50%", background: "rgba(200,225,245,.38)", filter: "blur(12px)", opacity: Math.sin(ph * 3.14) * (1 - pour) }} />; })}
    {/* jarra */}
    <div style={{ position: "absolute", left: 1320, top: 380, width: 300, height: 420, transform: `rotate(${-120 * pour}deg) translate(${-pour * 60}px, ${-pour * 160}px)`, transformOrigin: "50% 0" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "20px 20px 40px 40px", background: "rgba(255,255,255,.08)", boxShadow: "inset 0 0 0 5px rgba(255,255,255,.45)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * (1 - pour) * 88}%`, background: "linear-gradient(180deg, rgba(140,200,240,.75), rgba(80,150,210,.85))" }} />
        {[0.25, 0.5, 0.75].map((y, i) => <div key={i} style={{ position: "absolute", right: 0, top: `${y * 100}%`, width: 50, height: 4, background: "rgba(255,255,255,.5)" }} />)}
      </div>
      <div style={{ position: "absolute", right: -70, top: 80, width: 90, height: 200, borderRadius: "0 60px 60px 0", boxShadow: "inset -10px 0 0 rgba(255,255,255,.45)" }} />
    </div>
    <div style={{ position: "absolute", left: 1500, top: 830, fontWeight: 900, fontSize: 90, color: ICE, transform: "translateX(-50%)", opacity: cl(fill * 3) * (1 - pour) }}>{(fill * 1.1).toFixed(1).replace(".", ",")} L</div>
    {pour > 0.2 && Array.from({ length: 14 }, (_, i) => <Drop key={i} x={1180 + rnd(i) * 300} y={230 + rnd(i + 3) * 40} s={16 * cl((pour - 0.2) * 3)} />)}
    {pour > 0.2 && <div style={{ position: "absolute", left: 1000, top: 190, width: 700, height: 40, background: "#eef0ee", boxShadow: "0 10px 30px rgba(0,0,0,.4)" }} />}
    <Tag tt={tt} at={5.2} x={1350} y={130 + 0} txt="VA A PARAR A TU TECHO" col={RED} size={44} />
  </>;
}}</Stage>;

// ---- 23:05 · EL EXTRACTOR CON TEMPORIZADOR: el ventilador gira, la perilla marca 15-20 min y el aire sale por la pared hacia afuera (no al cielo raso) ----
export const HFan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const on = phys(tt, 0.8, 4, 0.6), dial = eio(tt, 1.2, 2.6), bad = cl((tt - 4.0) / 0.8);
  return <>
    <Head tt={tt} kick="SE PRENDE CON LA LUZ Y SIGUE SOLO" title="EL EXTRACTOR CON TEMPORIZADOR" />
    {/* pared con el extractor */}
    <div style={{ position: "absolute", left: 300, top: 250, width: 120, height: 640, background: "linear-gradient(90deg,#b9b2a5,#d8d1c4)", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 360, top: 470, width: 300, height: 300, marginLeft: -150, marginTop: -150, borderRadius: 30, background: "#f2f2ee", boxShadow: "0 30px 70px rgba(0,0,0,.55)" }}>
      <div style={{ position: "absolute", inset: 24, borderRadius: "50%", background: "#1b1b1f", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, transform: `rotate(${tt * 900 * cl(on)}deg)` }}>{Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", left: 120, top: 20, width: 32, height: 110, borderRadius: "50% 50% 20% 20%", background: "#c9cdd2", transformOrigin: "16px 106px", transform: `rotate(${i * 72}deg)`, opacity: 0.9 }} />)}</div>
        <div style={{ position: "absolute", left: 108, top: 108, width: 36, height: 36, borderRadius: 18, background: "#e9e9e6" }} />
      </div>
    </div>
    {/* aire hacia afuera */}
    {Array.from({ length: 18 }, (_, i) => { const ph = (tt * 0.6 + rnd(i)) % 1; return <div key={i} style={{ position: "absolute", left: 1000 - ph * 900, top: 430 + (rnd(i + 2) - 0.5) * 140, width: 120, height: 10, borderRadius: 5, background: "rgba(170,210,240,.6)", opacity: cl(on) * Math.sin(ph * 3.14) * (1 - bad * 0.6) }} />; })}
    <Tag tt={tt} at={1.4} x={360} y={228} txt="AFUERA" col={GRN} size={40} />
    {/* temporizador */}
    <div style={{ position: "absolute", left: 1350, top: 420, width: 300, height: 300, marginLeft: -150, marginTop: -150, borderRadius: "50%", background: "#24242a", boxShadow: "0 0 0 10px #3a3a42, 0 40px 90px rgba(0,0,0,.6)" }}>
      <svg width={300} height={300} style={{ position: "absolute", inset: 0 }}><path d={`M150 150 L150 30 A120 120 0 0 1 ${150 + 120 * Math.sin(dial * 2.1)} ${150 - 120 * Math.cos(dial * 2.1)} Z`} fill="rgba(255,178,87,.4)" /></svg>
      <div style={{ position: "absolute", left: 140, top: 40, width: 20, height: 110, borderRadius: 10, background: AMB, transformOrigin: "10px 110px", transform: `rotate(${dial * 120}deg)` }} />
    </div>
    <Tag tt={tt} at={2.2} x={1350} y={640} txt="15-20 MIN DESPUÉS" col={AMB} size={44} />
    <div style={{ position: "absolute", left: 1150, top: 760, width: 560, padding: "18px 26px", borderRadius: 16, background: "rgba(255,90,74,.14)", boxShadow: `inset 0 0 0 3px ${RED}`, opacity: bad, fontWeight: 900, fontSize: 34, color: TX }}>SI LO TIRA AL CIELO RASO<br /><span style={{ color: RED }}>SÓLO MUDASTE EL MOHO</span></div>
  </>;
}}</Stage>;

// ---- 23:52 · LA HELADERA: la losa sola con la terraza arriba, termómetro de colores: el hormigón azul de frío toca el aire tibio y gotea igual ----
export const HFridge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse at 50% 40%, #13263d, #05080d 80%)">{(tt) => {
  const cold = eio(tt, 0.6, 2.4), drops = cl((tt - 2.6) / 2.4);
  return <>
    <Head tt={tt} kick="LA LOSA CON LA TERRAZA ARRIBA, SIN NADA" title="ES COMO TOCAR UNA HELADERA" col={ICE} />
    {Array.from({ length: 24 }, (_, i) => <div key={i} style={{ position: "absolute", left: 200 + rnd(i) * 1500, top: 220 + rnd(i + 3) * 90 + ((tt * 40 + i * 30) % 80), width: 6, height: 6, borderRadius: 3, background: "#fff", opacity: 0.6 }} />)}
    <div style={{ position: "absolute", left: 200, top: 340, width: 1520, height: 180, background: `linear-gradient(180deg, rgb(${120 - 60 * cold},${150 - 20 * cold},${190 + 40 * cold}), rgb(${110 - 50 * cold},${140},${200 + 30 * cold}))`, boxShadow: `0 0 ${80 * cold}px rgba(90,160,240,.6)` }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,.18) 2px, transparent 3px)", backgroundSize: "30px 26px" }} />
      <div style={{ position: "absolute", left: 40, top: 60, fontWeight: 900, fontSize: 46, color: "#fff", opacity: cold }}>2 °C</div>
    </div>
    <div style={{ position: "absolute", left: 200, top: 520, width: 1520, height: 400, background: "linear-gradient(0deg, rgba(255,150,80,.35), rgba(255,180,120,.08))" }}>
      <div style={{ position: "absolute", right: 40, bottom: 40, fontWeight: 900, fontSize: 46, color: AMB }}>22 °C</div>
    </div>
    {Array.from({ length: 40 }, (_, i) => { const k = cl(drops * 2 - rnd(i)), fall = i % 6 === 0 ? cl((tt - 4.2 - rnd(i)) * 1.2) * 300 : 0; return <Drop key={i} x={230 + rnd(i + 5) * 1460} y={530 + fall} s={(10 + rnd(i + 2) * 14) * k} />; })}
    <Tag tt={tt} at={3.6} x={960} y={980} txt="POR MÁS QUE VENTILES, CONDENSA" col={TX} size={42} />
  </>;
}}</Stage>;

// ---- 24:48 · LOS DOS CAMINOS: la losa en corte; la placa aislante entra por arriba (terraza) o por abajo (techo) y el azul del frío deja de llegar al baño ----
export const HInsul: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const top = phys(tt, 0.8, 5, 0.55), bot = phys(tt, 2.6, 5, 0.55);
  const cut = (x: number, k: number, up: boolean, l: string, n: string, col: string) => <div style={{ position: "absolute", left: x, top: 280, width: 700, height: 620 }}>
    <div style={{ position: "absolute", left: 0, top: 160, width: 700, height: 170, background: `linear-gradient(180deg, ${k > 0.5 ? "#8a9096" : "#5a86c0"}, #7d8388)` }} />
    <div style={{ position: "absolute", left: 0, top: up ? 160 - 70 * cl(k) : 330, width: 700, height: 70 * cl(k), background: "repeating-linear-gradient(90deg,#f0e7a8 0 30px,#e6db92 30px 60px)", boxShadow: "0 6px 16px rgba(0,0,0,.35)" }} />
    <div style={{ position: "absolute", left: 0, top: up ? 0 : 0, width: 700, height: 90, background: "linear-gradient(180deg, rgba(90,150,230,.4), transparent)" }} />
    <div style={{ position: "absolute", left: 0, top: 420, width: 700, height: 200, background: "linear-gradient(0deg, rgba(255,150,80,.3), transparent)" }} />
    {Array.from({ length: 10 }, (_, i) => <Drop key={i} x={40 + i * 65} y={up ? 340 : 410} s={14 * (1 - cl(k))} />)}
    <div style={{ position: "absolute", left: 0, right: 0, top: -60, textAlign: "center", fontWeight: 900, fontSize: 46, color: col }}>{l}</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontWeight: 800, fontSize: 30, color: DIM }}>{n}</div>
  </div>;
  return <>
    <Head tt={tt} kick="CUANDO NI CON VENTILACIÓN ALCANZA" title="AISLAR LA LOSA" />
    {cut(180, top, true, "POR ARRIBA · LA TERRAZA", "MÁS EFICIENTE · LO HACE UN EXPERTO", GRN)}
    {cut(1040, bot, false, "POR ABAJO · EL TECHO", "MENOS EFICIENTE · UN FIN DE SEMANA", AMB)}
  </>;
}}</Stage>;

// ---- 26:00 · EL AGUA CAMINA: el corte de la losa larga; la gota entra por la fisura de la terraza, viaja por adentro y aparece lejos, en la cocina ----
export const HTravel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const p = eio(tt, 1.0, 4.6), stain = cl((tt - 4.4) / 1.0);
  const px = 400 + p * 1000, py = 420 + Math.sin(p * 3.14) * 40 + p * 60;
  return <>
    <Head tt={tt} kick="LO QUE CASI NADIE SABE" title="EL AGUA CAMINA ANTES DE BAJAR" col={RED} />
    <div style={{ position: "absolute", left: 160, top: 330, width: 1600, height: 40, background: "repeating-linear-gradient(90deg,#b5573a 0 120px,#a64c31 120px 240px)" }} />
    <div style={{ position: "absolute", left: 160, top: 370, width: 1600, height: 200, background: "linear-gradient(180deg,#8d9196,#6f7378)" }} />
    <div style={{ position: "absolute", left: 160, top: 570, width: 1600, height: 30, background: "#efeee8" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d="M400 330 L410 345 L398 360 L406 372" stroke="#1d1d1d" strokeWidth={4} fill="none" />
      <path d={`M405 372 Q700 ${470} 1000 450 T 1400 520 L1400 570`} stroke="rgba(110,180,235,.9)" strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={1300} strokeDashoffset={1300 * (1 - p)} />
    </svg>
    {Array.from({ length: 10 }, (_, i) => <Drop key={i} x={300 + i * 30} y={300 + ((tt * 140 + i * 30) % 30)} s={14} o={cl(1.2 - tt * 0.25)} />)}
    <Drop x={px} y={py} s={30} o={p > 0 && p < 1 ? 1 : 0} />
    <svg width={500} height={160} style={{ position: "absolute", left: 1150, top: 600 }}>{[0, 1, 2].map((i) => <ellipse key={i} cx={250} cy={30} rx={(80 + i * 60) * stain} ry={(20 + i * 14) * stain} fill={i === 0 ? "rgba(190,150,90,.4)" : "none"} stroke="#8d6433" strokeWidth={6 - i} />)}</svg>
    <Tag tt={tt} at={1.2} x={400} y={260} txt="FISURA EN LA TERRAZA" col={TX} size={36} />
    <Tag tt={tt} at={4.8} x={1400} y={780} txt="LA MANCHA, LEJOS" col={RED} size={44} />
    <Tag tt={tt} at={5.6} x={900} y={900} txt="SELLAR JUSTO ARRIBA NO SIRVE" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 26:22 · EL EMBUDO TAPADO: el desagüe de la terraza visto de arriba se llena de hojas; el agua sube; se destapa y baja girando ----
export const HDrain: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const leaves = cl((tt - 0.6) / 1.4), pool = cl((tt - 1.6) / 1.6) * (1 - eio(tt, 4.0, 5.4)), unclog = eio(tt, 3.6, 4.2);
  return <>
    <Head tt={tt} kick="CASI LA MITAD DE LAS GOTERAS DE LOSA" title="UN EMBUDO TAPADO CON HOJAS" />
    <div style={{ position: "absolute", left: 900, top: 615, width: 900, height: 900, marginLeft: -450, marginTop: -450, transform: "scale(0.76)", borderRadius: 30, background: "repeating-linear-gradient(0deg,#b5573a 0 110px,#9f4a30 110px 114px), repeating-linear-gradient(90deg, transparent 0 110px, rgba(0,0,0,.2) 110px 114px)", boxShadow: "0 40px 90px rgba(0,0,0,.6)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 450 - 420 * pool, top: 450 - 380 * pool, width: 840 * pool, height: 760 * pool, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(110,170,210,.65), rgba(80,140,190,.35) 70%, transparent)" }} />
      <div style={{ position: "absolute", left: 370, top: 370, width: 160, height: 160, borderRadius: "50%", background: "#1a1a1a", boxShadow: "inset 0 0 0 10px #555", transform: `rotate(${unclog * 720}deg)` }}>
        {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 76, top: 8, width: 8, height: 144, background: "#777", transform: `rotate(${i * 30}deg)` }} />)}
      </div>
      {Array.from({ length: 22 }, (_, i) => { const k = cl(leaves * 1.5 - rnd(i) * 0.5), away = unclog; const a = rnd(i + 3) * 6.283, d = 30 + rnd(i + 6) * 90;
        return <div key={i} style={{ position: "absolute", left: 450 + Math.cos(a) * d * (1 + away * 6) - 40, top: 450 + Math.sin(a) * d * (1 + away * 6) - 22, width: 80, height: 44, borderRadius: "50% 0", background: ["#8a5a2a", "#6e7a2a", "#a0702e"][i % 3], transform: `rotate(${a * 57 + (1 - k) * 90}deg) scale(${k})`, opacity: 1 - away }} />; })}
    </div>
    <div style={{ position: "absolute", left: 1600, top: 380, fontWeight: 900, fontSize: 150, color: RED, transform: "translateX(-50%)", opacity: cl((tt - 1.2) * 2) }}>~50%</div>
    <Tag tt={tt} at={4.4} x={1600} y={640} txt="DESTAPADO" col={GRN} size={48} />
  </>;
}}</Stage>;

// ---- 27:00 · LA PRUEBA DE LA MANGUERA: la terraza en zonas; la manguera moja de a una (10 min) y abajo el reloj espera la gota ----
export const HHose: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const z = Math.min(3, Math.floor(cl((tt - 0.8) / 4.4) * 4)), hit = z === 3 && tt > 4.4;
  return <>
    <Head tt={tt} kick="SI EL DESAGÜE ESTÁ BIEN" title="LA PRUEBA DE LA MANGUERA" />
    <div style={{ position: "absolute", left: 300, top: 260, width: 1000, height: 300, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, transform: "perspective(1200px) rotateX(45deg)", transformOrigin: "50% 100%" }}>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ background: i < z ? "rgba(90,150,200,.55)" : i === z ? "rgba(110,180,235,.8)" : "#a65033", borderRadius: 8, boxShadow: i === z ? "0 0 40px rgba(110,180,235,.8)" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 60, color: "#fff" }}>{i + 1}</div>)}
    </div>
    <div style={{ position: "absolute", left: 300, top: 600, width: 1000, height: 40, background: "linear-gradient(180deg,#8d9196,#6f7378)" }} />
    <div style={{ position: "absolute", left: 300, top: 640, width: 1000, height: 26, background: "#efeee8" }} />
    {hit && <Drop x={300 + 875} y={680 + cl((tt - 4.6) * 0.8) * 200} s={34} />}
    <div style={{ position: "absolute", left: 1550, top: 420, fontWeight: 900, fontSize: 120, color: TX, fontVariantNumeric: "tabular-nums", transform: "translateX(-50%)" }}>{String(Math.floor(Math.max(0, (tt - 0.8) * 9) % 10)).padStart(2, "0")}:00</div>
    <Tag tt={tt} at={1.0} x={1550} y={600} txt="10 MIN POR ZONA" col={AMB} size={40} />
    <Tag tt={tt} at={4.8} x={1550} y={740} txt="APARECE LA GOTA = TU ZONA" col={GRN} size={40} />
    <Tag tt={tt} at={1.6} x={800} y={950} txt="DE ABAJO HACIA ARRIBA · UNO MIRA ADENTRO" col={DIM} size={30} />
  </>;
}}</Stage>;

// ---- 29:40 · USTEDES ME ESCRIBEN: tres preguntas entran como notas en el celular y Claudio contesta cada una con un sello ----
export const HAsk3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const Q = [{ q: "No tengo ventana en el baño", a: "EXTRACTOR", c: AMB, at: 0.8 }, { q: "¿Sirve el vinagre de manzana?", a: "EL BLANCO", c: ICE, at: 2.4 }, { q: "Limpié con vinagre y volvió", a: "¿CORTASTE LA CAUSA?", c: RED, at: 4.0 }];
  return <>
    <Head tt={tt} kick="EN EL VIDEO DEL MOHO DE LAS PAREDES" title="LO QUE ME PREGUNTARON" />
    {Q.map((o, i) => { const s = phys(tt, o.at, 5.5, 0.5), st = cl((tt - o.at - 0.8) / 0.4);
      return <div key={i} style={{ position: "absolute", left: 260, top: 270 + i * 230, width: 1400, height: 190, transform: `translateX(${(1 - cl(s)) * -900}px)`, opacity: cl(s * 3) }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 900, height: 170, borderRadius: 30, background: "#1d1d22", boxShadow: "0 30px 60px rgba(0,0,0,.5)", display: "flex", alignItems: "center", gap: 24, padding: "0 30px" }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, background: ["#e57a44", "#5aa0e6", "#8fcf6a"][i], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 38 }}>{["M", "R", "J"][i]}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: TX }}>{o.q}</div>
        </div>
        <div style={{ position: "absolute", left: 960, top: 30, transform: `rotate(-5deg) scale(${2 - st})`, opacity: st, padding: "14px 30px", border: `6px solid ${o.c}`, borderRadius: 14, color: o.c, fontWeight: 900, fontSize: 48, whiteSpace: "nowrap" }}>{o.a}</div>
      </div>; })}
  </>;
}}</Stage>;

// ---- 31:57 · EL TECHO BLANCO: antes y después con cortina que barre; el reloj de los meses fríos pasa y la esquina sigue blanca ----
export const HWhite: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const sw = eio(tt, 1.2, 3.4), months = Math.min(4, Math.floor(cl((tt - 3.6) / 3) * 5));
  return <>
    <Head tt={tt} kick="EL BAÑO DE DOÑA MARTA" title="HOY EL TECHO ESTÁ BLANCO" col={GRN} />
    <Ceil x={260} y={240} w={1400} h={640}>
      <Mold n={220} cx={1150} cy={110} rx={620} ry={420} p={1} sz={12} seed={33} />
      <div style={{ position: "absolute", left: 0, top: 0, width: `${sw * 100}%`, height: "100%", background: "linear-gradient(120deg, rgba(255,252,240,.4), transparent 40%), #f7f8f6", boxShadow: sw > 0 && sw < 1 ? "10px 0 30px rgba(0,0,0,.25)" : "none" }}>
        <div style={{ position: "absolute", right: 0, top: 0, width: 10, height: "100%", background: sw < 1 ? AMB : "transparent", boxShadow: sw < 1 ? `0 0 30px ${AMB}` : "none" }} />
      </div>
      <div style={{ position: "absolute", left: 30, top: 24, fontWeight: 900, fontSize: 34, color: "rgba(40,40,40,.6)", opacity: sw }}>DESPUÉS</div>
    </Ceil>
    <div style={{ position: "absolute", left: 260, top: 920, display: "flex", gap: 20 }}>{["MAYO", "JUNIO", "JULIO", "AGOSTO"].map((m, i) => <div key={i} style={{ padding: "12px 26px", borderRadius: 14, background: i < months ? "rgba(111,227,154,.18)" : "rgba(255,255,255,.06)", boxShadow: i < months ? `inset 0 0 0 3px ${GRN}` : "none", fontWeight: 900, fontSize: 30, color: i < months ? TX : DIM }}>{m}</div>)}</div>
    <Tag tt={tt} at={4.6} x={1450} y={950} txt="Y SIGUE BLANCO" col={GRN} size={48} />
  </>;
}}</Stage>;
