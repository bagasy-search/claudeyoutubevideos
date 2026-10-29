// rosa29e · componentes únicos 12-21. Todo en código, ninguna familia de rosa29a-d.
import React from "react";
import { Stage, cl, eio, AMB, TX, RED } from "./hkit";
import { Big, Steam, Table } from "./rkit";
import { P, sp, pos, PotSide, PotTop, KITCHEN } from "./he1";

// 12 · «Parece mucho, pero se reduce a nada, y es la mitad del sabor»: una montaña de cebolla picada en la olla (vista de costado, en corte) baja y baja hasta una capa fina dorada; la marca de nivel sigue al ras
export const Shrink: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg={KITCHEN}>{(tt) => {
  const r = eio(tt, 0.8, 4.2), hh = 380 - 330 * r;
  return <>
    <div style={pos(960, 640, "", { width: 760, height: 460, borderRadius: "0 0 90px 90px", background: "linear-gradient(90deg,#1c1c1e,#3a3a3e 50%,#1c1c1e)", border: "18px solid #4a4a50", borderTop: "none", overflow: "hidden" })}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: hh, background: `repeating-linear-gradient(${20}deg, hsla(${48 - 14 * r},${30 + 50 * r}%,${90 - 40 * r}%,1) 0 18px, hsla(${46 - 14 * r},${26 + 50 * r}%,${80 - 36 * r}%,1) 18px 30px)`, borderRadius: "40% 40% 0 0 / 30px 30px 0 0" }} />
    </div>
    <div style={pos(960, 640 + 230 - 380, "", { width: 700, height: 0, borderTop: "6px dashed rgba(255,214,150,.75)" })} />
    <Big tt={tt} at={1.0} x={1480} y={640 + 230 - 380} txt="antes" size={56} col={AMB} hand />
    <Big tt={tt} at={2.6} x={960} y={190} txt="SE REDUCE A NADA" size={88} col={TX} />
  </>;
}}</Stage>;

// 13 · «Mi primer guiso tenía un gusto amargo que yo no sabía de dónde venía»: una lengua dibujada en tiza sobre pizarra; la zona de atrás (la del amargo) se enciende verde oscura y la cara de la boca se frunce
export const Tongue: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg,#22302a,#141c18)">{(tt) => {
  const draw = eio(tt, 0.2, 1.6), bit = eio(tt, 1.8, 2.8), q = sp(tt, 3.2, 6, 0.4);
  return <>
    <svg width={900} height={700} style={{ position: "absolute", left: 510, top: 220, overflow: "visible" }}>
      <path d="M 450 640 C 160 640 120 360 170 200 C 210 70 330 20 450 20 C 570 20 690 70 730 200 C 780 360 740 640 450 640 Z" fill="none" stroke="rgba(240,240,230,.9)" strokeWidth={10} pathLength={1} strokeDasharray={`${draw} 1`} strokeLinecap="round" />
      <path d="M 450 80 L 450 560" stroke="rgba(240,240,230,.5)" strokeWidth={6} pathLength={1} strokeDasharray={`${draw} 1`} />
      <ellipse cx={450} cy={150} rx={250 * bit} ry={110 * bit} fill={`rgba(90,140,60,${0.7 * bit})`} style={{ filter: "blur(6px)" }} />
    </svg>
    <div style={pos(960, 370, `scale(${q})`, { fontFamily: "inherit", fontWeight: 900, fontSize: 130, color: "#b8e07a", textShadow: "0 0 30px rgba(140,200,80,.6)" })}>?</div>
    <Big tt={tt} at={2.0} x={960} y={160} txt="AMARGO" size={110} col="#c8e89a" hand />
  </>;
}}</Stage>;

// 14 · «El pimentón es un polvo fino, y se quema en dos segundos»: una mecha de pólvora roja (el pimentón en línea) arde de punta a punta en 2 segundos exactos y deja una raya negra
export const Fuse: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="linear-gradient(180deg,#1a1210,#070505)">{(tt) => {
  const fall = eio(tt, 0.4, 1.0), b = cl((tt - 1.2) / 2.0);
  return <>
    <div style={pos(960, 620, "", { width: 820, height: 820, borderRadius: "50%", background: "radial-gradient(circle,#2a2a2d 55%,#111 70%,#3a3a3e 72%,#0a0a0a 76%)", transform: "translate(-50%,-50%) scaleY(.42)" })} />
    <div style={pos(960, 620, "", { width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,200,90,.35),rgba(200,120,30,.15) 60%,transparent 70%)", transform: "translate(-50%,-50%) scaleY(.42)" })} />
    {Array.from({ length: 34 }, (_, i) => { const a = i * 2.39, r = 10 + (i * 29) % 130, burn = cl(b * 1.5 - (1 - r / 140) * 0.5);
      return <div key={i} style={pos(960 + Math.cos(a) * r, 620 - 300 * (1 - fall) + Math.sin(a) * r * 0.42, "", { width: 30, height: 18, borderRadius: "50%",
        background: `radial-gradient(circle, hsl(${10 - 10 * burn},${80 - 70 * burn}%,${45 - 37 * burn}%), hsl(${8 - 8 * burn},${70 - 60 * burn}%,${30 - 24 * burn}%))`, opacity: cl(fall * 3) })} />; })}
    {Array.from({ length: 8 }, (_, i) => { const ph = (tt * 0.6 + i * 0.13) % 1;
      return <div key={"s" + i} style={pos(900 + i * 16 + Math.sin(tt * 2 + i) * 40 * ph, 600 - 360 * ph, "", { width: 60 + 80 * ph, height: 60 + 80 * ph, borderRadius: "50%", background: "rgba(70,64,62,.55)", filter: "blur(14px)", opacity: cl(b * 2) * (1 - ph) })} />; })}
    <div style={pos(960, 900, "", { fontWeight: 900, fontSize: 130, color: b >= 1 ? RED : TX, fontVariantNumeric: "tabular-nums", textShadow: "0 10px 30px rgba(0,0,0,.6)" })}>{(2 * b).toFixed(1)} s</div>
    <Big tt={tt} at={0.3} x={960} y={170} txt="SE QUEMA EN 2 SEGUNDOS" size={76} col={AMB} />
  </>;
}}</Stage>;

// 15 · «Apartas la olla, cuentas hasta diez, y recién ahí echas el pimentón»: la llama azul de la hornalla se achica y se apaga; alrededor de la hornalla se encienden diez puntitos de a uno; al décimo cae la nube roja
export const BurnerDots: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(circle at 50% 55%, #2a2622, #0a0908 70%)">{(tt) => {
  const off = eio(tt, 0.2, 0.9), n = Math.floor(cl((tt - 1.0) / 3.0) * 10.99), puff = eio(tt, 4.1, 4.9);
  return <>
    <div style={pos(960, 600, "", { width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,#3a3a3e 0 30%,#1a1a1c 32% 48%,#2e2e32 50% 62%,#141416 64%)" })} />
    {Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return <div key={i} style={pos(960 + Math.cos(a) * 120, 600 + Math.sin(a) * 120, `rotate(${a}rad)`, { width: 60 * (1 - off) + 2, height: 22 * (1 - off), borderRadius: "50%", background: "radial-gradient(ellipse,#d8f0ff,#3a7aff 60%,transparent)", opacity: 1 - off })} />; })}
    {Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + (i / 10) * Math.PI * 2, on = i < n;
      return <div key={i} style={pos(960 + Math.cos(a) * 340, 600 + Math.sin(a) * 340, `scale(${on ? 1 : 0.6})`, { width: 54, height: 54, borderRadius: "50%", background: on ? AMB : "rgba(255,255,255,.12)", boxShadow: on ? `0 0 24px ${AMB}` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 26, color: "#2a1a08" })}>{on ? i + 1 : ""}</div>; })}
    <div style={pos(960, 600, `scale(${0.3 + puff})`, { width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(220,50,30,.9), rgba(180,30,20,.3) 55%, transparent 70%)", opacity: puff * (1 - 0.3 * puff), filter: "blur(8px)" })} />
    <Big tt={tt} at={0.8} x={960} y={150} txt="CUENTA HASTA DIEZ" size={84} col={TX} />
  </>;
}}</Stage>;

// 16 · «El aceite se pone rojo brillante, y huele dulce, ahumado»: vista cenital de la olla: el pimentón cae sobre el aceite y se abre en vetas rojas como mármol que giran hasta teñirlo todo
export const Marble: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg={KITCHEN}>{(tt) => {
  const s = eio(tt, 0.5, 4.2), rot = 40 * tt;
  return <>
    <div style={pos(960, 560)}><PotTop d={680} fill="radial-gradient(circle,#e8c98a,#c89a4a)">
      <div style={{ position: "absolute", inset: -100, transform: `rotate(${rot}deg)`, background: `conic-gradient(from 0deg, rgba(210,40,20,${0.2 + 0.8 * s}) 0 ${20 + 70 * s}deg, transparent ${20 + 70 * s}deg 120deg, rgba(220,60,25,${0.2 + 0.8 * s}) 120deg ${140 + 70 * s}deg, transparent ${140 + 70 * s}deg 240deg, rgba(200,30,20,${0.2 + 0.8 * s}) 240deg ${260 + 70 * s}deg, transparent 0)`, filter: `blur(${18 - 8 * s}px)` }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,.35), transparent 30%)" }} />
    </PotTop></div>
    <Big tt={tt} at={2.4} x={960} y={140} txt="ROJO BRILLANTE" size={92} col="#ff6a4a" />
  </>;
}}</Stage>;

// 17 · «Éste es el secreto de doña Carmen. El que no está en ningún libro»: una biblioteca de lomos de libros de cocina; un hueco en el medio, y en el hueco se enciende una fichita escrita a mano
export const BookGap: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg,#2a1a10,#120a06)">{(tt) => {
  const s = eio(tt, 0.2, 1.4), card = sp(tt, 1.8, 6, 0.45);
  const cols = ["#7a2a1c", "#2a4a6a", "#5a6a2a", "#8a6418", "#4a2a5a", "#2a5a4a", "#6a3a1a"];
  return <>
    <div style={pos(960, 760, "", { width: 1500, height: 30, background: "linear-gradient(180deg,#6a4428,#3a2414)" })} />
    {Array.from({ length: 22 }, (_, i) => { if (i === 11) return null; const w = 52 + (i * 17) % 28, x = 300 + i * 62, hh = 330 + (i * 41) % 90;
      return <div key={i} style={{ position: "absolute", left: x, top: 745 - hh * s, width: w, height: hh * s, background: `linear-gradient(90deg, ${cols[i % 7]}, #000 220%)`, borderRadius: 3, boxShadow: "inset -4px 0 0 rgba(0,0,0,.3)" }}>
        <div style={{ position: "absolute", left: 6, right: 6, top: 40, height: 6, background: "rgba(230,200,120,.6)" }} />
      </div>; })}
    <div style={pos(300 + 11 * 62 + 30, 560, `scale(${card}) rotate(${-4 + 4 * card}deg)`, { width: 230, height: 300, background: "linear-gradient(180deg,#fbf3dc,#e9dcb8)", borderRadius: 6, boxShadow: `0 0 ${60 * card}px rgba(255,210,120,.8)`, padding: 16, fontFamily: "Caveat, cursive" })}>
      {[0, 1, 2, 3, 4, 5].map((k) => <div key={k} style={{ height: 4, margin: "26px 0", background: "rgba(80,50,30,.5)", width: `${90 - (k * 13) % 40}%` }} />)}
    </div>
    <Big tt={tt} at={2.4} x={960} y={190} txt="NO ESTÁ EN NINGÚN LIBRO" size={76} col={AMB} />
  </>;
}}</Stage>;

// 18 · «Lo raspan con agua en el fregadero… Y ahí se va todo el sabor»: la pileta vista desde arriba; el agua arrastra las escamas doradas en espiral hacia el desagüe y desaparecen
export const Drain: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="linear-gradient(180deg,#c9d0d6,#8e979f)">{(tt) => {
  const g = eio(tt, 0.6, 4.4);
  return <>
    <div style={pos(960, 580, "", { width: 900, height: 620, borderRadius: 60, background: "linear-gradient(135deg,#e8edf0,#a8b0b6)", boxShadow: "inset 0 20px 60px rgba(0,0,0,.35)" })} />
    <div style={pos(960, 600, "", { width: 110, height: 110, borderRadius: "50%", background: "repeating-radial-gradient(circle,#2a2a2d 0 6px,#6a6a70 6px 10px)" })} />
    {Array.from({ length: 26 }, (_, i) => { const a0 = i * 2.39, r0 = 300 - (i * 9) % 120, k = cl(g * 1.3 - i * 0.012), r = r0 * (1 - k), a = a0 + k * 9;
      return <div key={i} style={pos(960 + Math.cos(a) * r * 1.3, 600 + Math.sin(a) * r * 0.9, `rotate(${a}rad) scale(${1 - k * 0.8})`, { width: 34, height: 18, borderRadius: 6, background: "linear-gradient(135deg,#e2a85a,#8a4a1a)", opacity: 1 - eio(k, 0.85, 1) })} />; })}
    <div style={pos(960, 600, `rotate(${tt * 120}deg)`, { width: 560, height: 400, borderRadius: "50%", border: "3px dashed rgba(90,140,200,.4)" })} />
    <Big tt={tt} at={2.6} x={960} y={150} txt="AHÍ SE VA EL SABOR" size={84} col="#7a1a10" />
  </>;
}}</Stage>;

// 19 · «Echas un chorrito de líquido… y con la cuchara de madera raspas»: la olla en corte: la capa café pegada al fondo se levanta en escamas que suben y oscurecen el líquido
export const Lift: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg={KITCHEN}>{(tt) => {
  const pour = eio(tt, 0.3, 1.2), up = eio(tt, 1.4, 4.6);
  return <>
    <div style={pos(960, 640, "", { width: 900, height: 420, borderRadius: "0 0 80px 80px", background: "linear-gradient(90deg,#1c1c1e,#3a3a3e 50%,#1c1c1e)", border: "20px solid #4a4a50", borderTop: "none", overflow: "hidden" })}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 160 * pour, background: `linear-gradient(180deg, rgba(${200 - 110 * up},${170 - 110 * up},${130 - 100 * up},.85), rgba(${150 - 90 * up},${100 - 70 * up},${60 - 50 * up},.95))` }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 26 * (1 - up), background: "linear-gradient(180deg,#a8662a,#5a2a0a)" }} />
      {Array.from({ length: 30 }, (_, i) => { const k = cl(up * 1.4 - (i % 10) * 0.04), x = 30 + (i * 53) % 820, y = 400 - 26 - k * (60 + (i * 31) % 110);
        return <div key={i} style={{ position: "absolute", left: x + 10 * Math.sin(tt * 2 + i), top: y, width: 22, height: 10, borderRadius: 4, background: "#b8742e", opacity: k > 0 ? 1 - k * 0.6 : 0, transform: `rotate(${i * 40 + tt * 60}deg)` }} />; })}
    </div>
    <div style={pos(700 + 300 * Math.sin(tt * 1.6), 620, `rotate(${25 + 10 * Math.sin(tt * 1.6)}deg)`, { width: 40, height: 520, borderRadius: 20, background: "linear-gradient(90deg,#a87a4a,#d8b080,#a87a4a)", opacity: cl(up * 4) })} />
    <div style={pos(1260, 380 - 60 * (1 - pour), "rotate(-35deg)", { width: 120, height: 150, borderRadius: "10px 10px 40px 40px", background: "linear-gradient(90deg,#c9d2da,#fbfdff,#b9c3cc)", opacity: 1 - eio(tt, 1.2, 1.6) })} />
    <Big tt={tt} at={1.8} x={960} y={170} txt="SE DESPEGA SOLA" size={88} col={AMB} />
  </>;
}}</Stage>;

// 20 · «El vapor sube, la cocina huele a domingo, y me acuerdo de doña Carmen»: el vapor de la olla sube y, arriba, se arma la silueta de una señora con rodete y delantal, que se desvanece suave
export const SteamGhost: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 60% at 50% 70%, #3a2a1c, #0a0705 75%)">{(tt) => {
  const f = eio(tt, 1.2, 3.4) * (1 - eio(tt, 5.0, 6.4));
  return <>
    <Table y={860} />
    <div style={pos(960, 830)}><PotSide w={460} /></div>
    <Steam tt={tt} x={960} y={720} w={300} h={360} o={0.8} />
    <svg width={500} height={560} style={{ position: "absolute", left: 710, top: 110, opacity: f * 0.75, filter: "blur(5px)" }}>
      <circle cx={250} cy={60} r={38} fill="rgba(255,255,255,.7)" />
      <circle cx={250} cy={140} r={70} fill="rgba(255,255,255,.75)" />
      <path d="M 170 220 Q 250 180 330 220 L 380 520 Q 250 560 120 520 Z" fill="rgba(255,255,255,.6)" />
      <path d="M 200 300 L 300 300 L 320 500 L 180 500 Z" fill="rgba(255,255,255,.35)" />
    </svg>
    <Big tt={tt} at={2.6} x={1460} y={420} txt="HUELE A DOMINGO" size={66} col="#fff3dc" hand />
  </>;
}}</Stage>;

// 21 · «Y el lomo, en el guiso, quedó seco, duro, como aserrín»: una tajada de lomo se seca y se resquebraja; se deshace en viruta de aserrín que cae de una sierra de carpintero
export const Sawdust: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="linear-gradient(180deg,#d8c4a0,#a8885a)">{(tt) => {
  const dry = eio(tt, 0.4, 2.0), saw = eio(tt, 2.2, 4.8);
  return <>
    <div style={pos(960, 560, "", { width: 640, height: 260, borderRadius: 60, background: `linear-gradient(135deg, hsl(${8 + 20 * dry},${55 - 30 * dry}%,${42 + 10 * dry}%), hsl(${10 + 20 * dry},${50 - 30 * dry}%,${30 + 12 * dry}%))`, clipPath: `inset(0 0 0 ${saw * 70}%)`, boxShadow: "0 30px 50px rgba(0,0,0,.35)" })}>
      {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + i * 66, top: 30 + (i * 37) % 120, width: 60 * dry, height: 4, background: "rgba(60,30,10,.6)", transform: `rotate(${(i * 47) % 70 - 35}deg)` }} />)}
    </div>
    <div style={pos(640 + 450 * saw, 430 + 20 * Math.sin(tt * 18), "rotate(8deg)", { width: 420, height: 120, background: "linear-gradient(180deg,#d8dde0,#9aa2a8)", clipPath: "polygon(0 0,100% 0,100% 70%,96% 100%,92% 70%,88% 100%,84% 70%,80% 100%,76% 70%,72% 100%,68% 70%,64% 100%,60% 70%,56% 100%,52% 70%,48% 100%,44% 70%,40% 100%,36% 70%,32% 100%,28% 70%,24% 100%,20% 70%,16% 100%,12% 70%,8% 100%,4% 70%,0 100%)", opacity: cl(saw * 5) })} />
    {Array.from({ length: 40 }, (_, i) => { const k = cl((tt - 2.3 - i * 0.06) * 0.9); if (k <= 0) return null;
      return <div key={i} style={pos(660 + saw * 440 - (i % 7) * 20, 640 + k * 300 + (i % 5) * 8, `rotate(${i * 50}deg)`, { width: 14, height: 6, background: "#e2c088", borderRadius: 2 })} />; })}
    <Big tt={tt} at={2.0} x={960} y={170} txt="COMO ASERRÍN" size={96} col="#5a2a10" hand />
  </>;
}}</Stage>;
