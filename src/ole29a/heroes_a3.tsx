// ole29a · componentes únicos 25-33 (la mañana del pozo, la cocina de casa y la mesa larga)
import React from "react";
import { AMB, DIM, H, HAND, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// 25 · 16:27 · LA PALA CON CUIDADO: corte de tierra; la pala baja despacio, se frena a un dedo del papel y la escoba barre la tapa
export const ABrush: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="linear-gradient(180deg,#0d1522 0%,#1a2232 30%,#3a281b 31%,#1a120c 100%)">{(tt) => {
  const dig = eio(tt, 0.4, 2.0), stop = tt > 2.0, sweep = eio(tt, 2.6, 4.6);
  return <>
    {/* capas de tierra con piedras */}
    {Array.from({ length: 26 }, (_, i) => <div key={i} style={{ position: "absolute", left: 200 + rnd(i, 1) * 1520, top: 380 + rnd(i, 2) * 620, width: 20 + rnd(i, 3) * 40, height: 14 + rnd(i, 4) * 26, borderRadius: "45%", background: "#5a4636", opacity: 0.6 }} />)}
    {/* papel encerado y la tapa */}
    <div style={{ position: "absolute", left: 960 - 260, top: 720, width: 520, height: 36, background: "linear-gradient(180deg,#e8dcc0,#bfae88)", borderRadius: 6 }} />
    <div style={{ position: "absolute", left: 960 - 240, top: 756, width: 480, height: 240, borderRadius: "10px 10px 70px 70px", background: "linear-gradient(90deg,#111,#36363a,#111)" }} />
    {/* tierra suelta que va desapareciendo de arriba del papel */}
    <div style={{ position: "absolute", left: 960 - 260, top: 690 - 180 * (1 - dig), width: 520, height: 30 + 180 * (1 - dig) * (1 - sweep), background: "#4a3828", borderRadius: "40% 40% 0 0", opacity: 1 - sweep }} />
    {/* la pala que se frena */}
    <div style={{ position: "absolute", left: 1080, top: 330 + 330 * dig, transform: `rotate(${-14 + (stop ? 2 * Math.sin(tt * 6) * cl(2.4 - tt) : 0)}deg)`, opacity: 1 - eio(tt, 2.4, 2.9) }}>
      <div style={{ width: 22, height: 320, background: "linear-gradient(90deg,#6a4a26,#9a7040)", marginLeft: 69 }} />
      <div style={{ width: 160, height: 140, borderRadius: "10px 10px 70px 70px", background: "linear-gradient(180deg,#a8aeb6,#5a6068)" }} />
    </div>
    {/* la escoba de ramitas barre */}
    <div style={{ position: "absolute", left: 640 + 560 * sweep, top: 560, opacity: cl((tt - 2.5) * 3) * (1 - eio(tt, 4.6, 5.4)), transform: `rotate(${20 * Math.sin(tt * 4)}deg)`, transformOrigin: "50% 0" }}>
      <div style={{ width: 14, height: 140, background: "#8a6236", marginLeft: 43 }} />
      <div style={{ width: 100, height: 60, background: "repeating-linear-gradient(90deg,#c8a060 0 4px,#8a6a3a 4px 8px)", borderRadius: "0 0 30px 30px" }} />
    </div>
    <Tag tt={tt} at={1.8} x={1300} y={260} txt="STOP AT THE PAPER" col={RED} size={44} anchor="l" />
    <Tag tt={tt} at={3.6} x={1300} y={340} txt="SWEEP THE LID" col={AMB} size={40} anchor="l" />
  </>;
}}</Stage>;

// 26 · 17:01 · EL OLOR QUE SUBE: la tapa se levanta y dos cintas de vapor (melaza dulce, humo de leña) se enroscan hacia arriba
export const AAroma: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 50% 70%, #2a1a0e, #050403 72%)">{(tt) => {
  const lid = eio(tt, 0.4, 1.4), rise = eio(tt, 1.0, 4.0);
  const ribbon = (side: number, col: string) => { let d = `M ${960 + side * 40} 640`; for (let i = 1; i <= 14; i++) { const y = 640 - i * 40 * rise; d += ` L ${960 + side * (40 + i * 22) + Math.sin(i * 0.8 + tt * 1.1 + side) * 60} ${y}`; } return <path d={d} stroke={col} strokeWidth={34} fill="none" strokeLinecap="round" opacity={0.55} style={{ filter: "blur(6px)" }} />; };
  return <>
    <div style={{ position: "absolute", left: 960 - 280, top: 660, width: 560, height: 300, borderRadius: "16px 16px 90px 90px", background: "linear-gradient(90deg,#111,#36363a,#111)" }} />
    <div style={{ position: "absolute", left: 960 - 250, top: 650, width: 500, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse, #8a4a1a, #4a2208)" }} />
    <div style={{ position: "absolute", left: 960 - 290, top: 630, width: 580, height: 60, borderRadius: "50%", background: "#1d1d20", transformOrigin: "100% 50%", transform: `translate(${200 * lid}px, ${-160 * lid}px) rotate(${28 * lid}deg)` }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{ribbon(-1, "#e8962a")}{ribbon(1, "#b8b0a4")}</svg>
    <Tag tt={tt} at={2.6} x={560} y={260} txt="SWEET MOLASSES" col={AMB} size={50} />
    <Tag tt={tt} at={3.4} x={1360} y={260} txt="SMOKY HARDWOOD" col={TX} size={50} />
  </>;
}}</Stage>;

// 27 · 18:54 · LA TARDE EN UN RELOJ: el sol cruza la ventana; marcas en la esfera para leña, escurrir a las 3, hervor y fuego lento
export const ADay: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const p = eio(tt, 0.4, 11.5), hr = 12 + 6 * p; // de 12 a 18 h
  const marks = [[13, "FEED THE FIRE"], [15, "DRAIN · 3 O'CLOCK"], [15.6, "HARD BOIL 10 MIN"], [16.6, "SIMMER"]] as [number, string][];
  const ang = (x: number) => ((x % 12) / 12) * 360 - 90;
  return <>
    {/* el sol que cruza */}
    <div style={{ position: "absolute", left: 300 + 1320 * p, top: 220 + 160 * Math.pow(p - 0.2, 2), width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, #ffe7a8, #ffb64a 60%, transparent 70%)", opacity: 0.9 - 0.4 * p }} />
    <div style={{ position: "absolute", left: 960, top: 600, transform: `translate(-50%,-50%) scale(${phys(tt, 0, 5, 0.6)})` }}>
      <svg width={620} height={620} viewBox="-310 -310 620 620">
        <circle r={290} fill="#f4ecd8" stroke="#6a4a26" strokeWidth={20} />
        {Array.from({ length: 12 }, (_, i) => <text key={i} x={240 * Math.cos(((i + 1) / 12) * 2 * Math.PI - Math.PI / 2)} y={240 * Math.sin(((i + 1) / 12) * 2 * Math.PI - Math.PI / 2) + 14} textAnchor="middle" fontSize={40} fontWeight={800} fill="#3a2a1c">{i + 1}</text>)}
        {/* el arco de la tarde que se va pintando */}
        <path d={`M 0 -200 A 200 200 0 ${hr - 12 > 6 ? 1 : 0} 1 ${200 * Math.cos((ang(hr) * Math.PI) / 180)} ${200 * Math.sin((ang(hr) * Math.PI) / 180)}`} stroke={AMB} strokeWidth={26} fill="none" opacity={0.6} />
        {marks.map(([x], i) => <circle key={i} cx={200 * Math.cos((ang(x) * Math.PI) / 180)} cy={200 * Math.sin((ang(x) * Math.PI) / 180)} r={hr >= x ? 18 : 10} fill={hr >= x ? RED : "#a89878"} />)}
        <g transform={`rotate(${ang(hr) + 90})`}><path d="M -9 20 L 0 -170 L 9 20 Z" fill="#1b1b1b" /></g>
        <g transform={`rotate(${((hr % 1) * 360)})`}><path d="M -5 20 L 0 -230 L 5 20 Z" fill="#3a2a1c" /></g>
        <circle r={16} fill="#1b1b1b" />
      </svg>
    </div>
    {marks.map(([x, s], i) => <Tag key={i} tt={tt} at={((x - 12) / 6) * 11.1 + 0.4} x={i % 2 ? 1340 : 160} y={380 + i * 110} txt={s} col={i === 1 ? AMB : TX} size={36} anchor="l" />)}
  </>;
}}</Stage>;

// 28 · 20:21 · EL CUADERNO DE NELS: hoja a lápiz que se escribe sola; la regla subrayada y un dibujito de la melaza que se hunde
export const ANotebook: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const L = ["Never put molasses in dry.", "Stir it into the hot", "bean water first."];
  const sink = eio(tt, 7.6, 10.4);
  return <>
    <div style={{ position: "absolute", left: 960, top: 560, width: 1180, height: 760, transform: `translate(-50%,-50%) rotate(-2deg) scale(${phys(tt, 0, 5, 0.55)})`, background: "repeating-linear-gradient(180deg, #f3ead2 0 62px, #a8c0d8 62px 64px)", borderRadius: 8, boxShadow: "0 40px 100px rgba(0,0,0,.7)" }}>
      <div style={{ position: "absolute", left: 110, top: 0, bottom: 0, width: 3, background: "#d88a8a" }} />
      <div style={{ position: "absolute", left: 150, top: 40, fontFamily: HAND, fontSize: 40, color: "#6a5a46" }}>Nels · cook shack, 1931</div>
      {L.map((s, i) => { const a = 1.0 + i * 1.8, n = Math.floor(s.length * eio(tt, a, a + 1.6));
        return <div key={i} style={{ position: "absolute", left: 150, top: 150 + i * 64, fontFamily: HAND, fontSize: 56, color: "#22324a" }}>{s.slice(0, n)}</div>; })}
      {/* el subrayado */}
      <svg width={1180} height={760} style={{ position: "absolute", inset: 0 }}>
        <path d="M 150 222 C 400 232, 700 214, 820 226" stroke="#22324a" strokeWidth={6} fill="none" pathLength={1} strokeDasharray={`${eio(tt, 6.4, 7.2)} 1`} />
        {/* el dibujito: la olla con la melaza que baja al fondo y se quema */}
        <g transform="translate(860 520)" opacity={cl((tt - 7.2) * 3)}>
          <path d="M -120 -60 L -120 90 Q 0 140 120 90 L 120 -60" stroke="#22324a" strokeWidth={6} fill="none" />
          <ellipse cx={0} cy={-80 + 170 * sink} rx={40} ry={20} fill="#3a1a08" />
          {sink > 0.9 && <path d="M -60 120 q 10 -30 20 0 q 10 -30 20 0 q 10 -30 20 0" stroke={RED} strokeWidth={6} fill="none" />}
        </g>
      </svg>
    </div>
    <Tag tt={tt} at={10.6} x={560} y={950} txt="OR IT SINKS AND BURNS" col={RED} size={44} />
  </>;
}}</Stage>;

// 29 · 20:45 · LA HERRADURA QUE FLOTA: la herradura cae al balde de salmuera, se hunde un poco y vuelve a subir y queda flotando
export const AShoe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const drop = phys(tt, 0.4, 6, 0.32), y = 300 + 290 * drop, splash = cl(1 - Math.abs(tt - 0.95) * 4);
  return <>
    <div style={{ position: "absolute", left: 960 - 360, top: 560, width: 720, height: 420, borderRadius: "10px 10px 40px 40px", background: "linear-gradient(90deg,#4a3420,#7a5636,#4a3420)", boxShadow: "0 40px 90px rgba(0,0,0,.7)" }}>
      {[60, 210, 360].map((yy, i) => <div key={i} style={{ position: "absolute", left: -10, right: -10, top: yy, height: 22, background: "#2a2a2c" }} />)}
    </div>
    <div style={{ position: "absolute", left: 960 - 330, top: 580, width: 660, height: 60, background: "linear-gradient(180deg,rgba(230,236,240,.85),rgba(190,200,206,.6))", borderRadius: "50%" }} />
    {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 960 + (rnd(i, 1) - 0.5) * 300 * splash, top: 590 - 160 * splash * rnd(i, 2), width: 16, height: 16, borderRadius: "50%", background: "rgba(230,240,250,.8)", opacity: splash }} />)}
    {/* la herradura */}
    <svg width={260} height={260} viewBox="-130 -130 260 260" style={{ position: "absolute", left: 960 - 130, top: y - 130, transform: `rotate(${10 * Math.sin(tt * 1.2)}deg)` }}>
      <path d="M -80 90 L -80 -10 A 80 80 0 0 1 80 -10 L 80 90" stroke="#6a6e74" strokeWidth={40} fill="none" strokeLinecap="round" />
      {[-60, -10, 40].map((a, i) => <circle key={i} cx={-80 * Math.cos(0) + 0} cy={0} r={0} />)}
    </svg>
    <Tag tt={tt} at={2.4} x={1420} y={460} txt="IT FLOATS" col={AMB} size={60} anchor="l" />
    <Tag tt={tt} at={3.2} x={1420} y={540} txt="= BRINE IS RIGHT" col={TX} size={36} anchor="l" />
  </>;
}}</Stage>;

// 30 · 21:11 · EL TABLÓN DE PREGUNTAS: papelitos clavados en la puerta del galpón; el de los porotos de lata se suelta y gira al frente
export const AComments: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="repeating-linear-gradient(90deg,#3a281b 0 120px,#2e2016 120px 124px)">{(tt) => {
  const Q = ["Can I use my oven?", "What about pintos?", "How deep in clay?", "Cast iron or enamel?", "Can I use canned beans?", "Salt pork or bacon?"];
  const pick = eio(tt, 4.6, 6.4);
  return <>
    {Q.map((q, i) => { const hero = i === 4, s = phys(tt, 0.3 + i * 0.35, 8, 0.45);
      const x = 300 + (i % 3) * 500, y = 260 + Math.floor(i / 3) * 360, r = (rnd(i, 1) - 0.5) * 10;
      const X = hero ? x + (960 - x) * pick : x, Y = hero ? y + (540 - y) * pick : y, S = hero ? 1 + 0.6 * pick : 1 - 0.2 * pick;
      return <div key={i} style={{ position: "absolute", left: X, top: Y, width: 420, transform: `translate(-50%,-50%) rotate(${hero ? r * (1 - pick) : r}deg) scale(${S * cl(s)})`, padding: "40px 30px 30px", background: "#f4ecd8", boxShadow: "0 20px 40px rgba(0,0,0,.55)", fontFamily: HAND, fontSize: 44, color: "#2a2018", opacity: hero ? 1 : 1 - 0.5 * pick, zIndex: hero ? 2 : 1 }}>
        <div style={{ position: "absolute", left: 200, top: 10, width: 20, height: 20, borderRadius: "50%", background: "#8a8e94" }} />{q}</div>; })}
  </>;
}}</Stage>;

// 31 · 21:47 · LOS FRASCOS: cinco frascos de vidrio en un estante; se encienden los buenos y el de porotos negros se apaga y se va
export const AJars: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const J = [["NAVY", "#f2ead6", true], ["YELLOW EYE", "#efe2c0", true], ["GREAT NORTHERN", "#f6f0e2", true], ["PINTO · SOFTER", "#c89a72", true], ["BLACK", "#1e1a1c", false]] as [string, string, boolean][];
  const out = eio(tt, 8.0, 9.4);
  return <>
    <div style={{ position: "absolute", left: 140, right: 140, top: 760, height: 40, background: "linear-gradient(180deg,#8a6236,#5a3e22)", boxShadow: "0 20px 40px rgba(0,0,0,.6)" }} />
    {J.map(([n, c, ok], i) => { const x = 330 + i * 315, s = phys(tt, 0.3 + i * 0.3, 8, 0.45), lit = ok ? cl((tt - 2.2 - i * 0.9) * 2) : 0;
      return <div key={i} style={{ position: "absolute", left: x, top: 760, transform: `translate(-50%,-100%) translateX(${ok ? 0 : 500 * out}px) scale(${cl(s)})`, opacity: ok ? 1 : 1 - out }}>
        <div style={{ width: 220, height: 380, borderRadius: "30px 30px 40px 40px", background: `radial-gradient(circle at 30% 30%, ${c} 14%, transparent 15%) 0 0/30px 24px, ${c}`, boxShadow: `inset 0 0 0 10px rgba(220,240,255,.35), 0 0 ${80 * lit}px rgba(255,190,90,.6)`, position: "relative", filter: ok ? `brightness(${0.75 + 0.35 * lit})` : `brightness(${0.7 - 0.3 * out})` }}>
          <div style={{ position: "absolute", left: 20, right: 20, top: -40, height: 50, borderRadius: 10, background: "#8a8e94" }} />
          <div style={{ position: "absolute", left: 30, right: 30, top: 150, padding: "10px 0", background: "#f4ecd8", fontFamily: HAND, fontSize: 30, textAlign: "center", color: "#2a2018" }}>{n}</div>
        </div>
      </div>; })}
    <Tag tt={tt} at={8.4} x={1500} y={260} txt="SKIP BLACK BEANS" col={RED} size={46} />
  </>;
}}</Stage>;

// 32 · 22:55 · EL HORNO DE CASA: la perilla gira a 300 °F, el termómetro de vidrio sube y las horas se apilan como rodajas de leña
export const ADial: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const knob = eio(tt, 0.4, 1.8), merc = eio(tt, 1.4, 3.4), hrs = Math.floor(eio(tt, 3.6, 8.6) * 8.99);
  return <>
    {/* perilla */}
    <div style={{ position: "absolute", left: 420, top: 520, transform: `translate(-50%,-50%) scale(${phys(tt, 0, 5, 0.6)})` }}>
      <div style={{ width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #f0f2f4, #9aa0a8 70%)", boxShadow: "0 30px 70px rgba(0,0,0,.7)", transform: `rotate(${-120 + 200 * knob}deg)` }}>
        <div style={{ position: "absolute", left: 175, top: 20, width: 30, height: 120, borderRadius: 15, background: "#1b1b1b" }} /></div>
      <div style={{ marginTop: 20, textAlign: "center", fontWeight: 900, fontSize: 80, color: AMB }}>{Math.round(150 + 150 * knob)}°F</div>
    </div>
    {/* termómetro de vidrio */}
    <div style={{ position: "absolute", left: 900, top: 220, width: 70, height: 620, borderRadius: 35, background: "rgba(220,236,250,.18)", boxShadow: "inset 0 0 0 6px rgba(220,236,250,.5)" }}>
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 40, height: 520 * (0.2 + 0.8 * merc), borderRadius: 15, background: "linear-gradient(180deg,#ff6a4a,#c0201a)" }} />
      <div style={{ position: "absolute", left: -15, bottom: -40, width: 100, height: 100, borderRadius: "50%", background: "#c0201a" }} />
    </div>
    {/* las horas, rodajas de leña apiladas */}
    {Array.from({ length: 8 }, (_, i) => { const on = i < hrs, s = phys(tt, 3.6 + i * 0.62, 9, 0.4);
      return <div key={i} style={{ position: "absolute", left: 1220 + (i % 2) * 230, top: 820 - Math.floor(i / 2) * 150, width: 200, height: 130, borderRadius: "50%", background: "radial-gradient(circle, #e8c890 0 12%, #c89a5a 13% 30%, #e0b878 31% 45%, #b8864a 46% 62%, #6a4424 63%)", transform: `scale(${on ? cl(s) : 0})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 42, color: "#2a1a0c" }}>{i + 1}h</div>; })}
    <Tag tt={tt} at={4.0} x={1450} y={170} txt="LOW AND SLOW · 6-8 H" col={TX} size={40} />
  </>;
}}</Stage>;

// 33 · 24:21 · LA MESA LARGA DESDE ARRIBA: 40 platos de lata aparecen por la mesa en ola; un cartel tallado «NO TALKING»
export const ATable: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="repeating-linear-gradient(0deg,#2a1d12 0 90px,#22170e 90px 93px)">{(tt) => {
  const wave = eio(tt, 0.4, 4.6) * 24;
  return <>
    <div style={{ position: "absolute", left: 120, right: 120, top: 330, height: 420, background: "repeating-linear-gradient(90deg,#8a6236 0 180px,#7a5430 180px 184px)", boxShadow: "0 30px 70px rgba(0,0,0,.7)", borderRadius: 8 }} />
    {Array.from({ length: 40 }, (_, i) => { const col = i % 20, row = Math.floor(i / 20), k = Math.abs(col - 9.5), on = cl(wave - k);
      return <div key={i} style={{ position: "absolute", left: 180 + col * 82, top: row ? 640 : 360, width: 70, height: 70, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #eef1f4, #8b9299)", boxShadow: "inset 0 0 0 7px #b8bec5, 0 8px 14px rgba(0,0,0,.5)", transform: `scale(${phys(on * 2, 0.2, 9, 0.45) * (on > 0 ? 1 : 0)})` }}>
        <div style={{ position: "absolute", left: 15, top: 15, width: 40, height: 40, borderRadius: "50%", background: "#8a3e16", opacity: cl(on * 2 - 1) }} /></div>; })}
    {/* bancos */}
    <div style={{ position: "absolute", left: 160, right: 160, top: 250, height: 50, background: "#5a3e22" }} />
    <div style={{ position: "absolute", left: 160, right: 160, top: 780, height: 50, background: "#5a3e22" }} />
    {/* el cartel tallado */}
    <div style={{ position: "absolute", left: 960, top: 130, transform: `translate(-50%,-50%) rotate(-1.5deg) scale(${phys(tt, 4.8, 7, 0.45)})`, padding: "18px 56px", background: "linear-gradient(180deg,#a07840,#6a4a26)", border: "6px solid #3a2414", fontWeight: 900, fontSize: 64, letterSpacing: 8, color: "#2a1608", textShadow: "0 2px 0 rgba(255,220,160,.4)" }}>NO TALKING</div>
    <Tag tt={tt} at={2.4} x={960} y={950} txt="40 MEN · ONE POT" col={AMB} size={44} />
  </>;
}}</Stage>;

// 24 · 15:16 · LAS HUELLAS DE ARVID: de noche, huellas de bota aparecen una a una en la nieve desde la puerta hasta el pozo; el farol se balancea
export const AArvid: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#05080f 0%,#0b1220 38%,#c9d4e2 39%,#8a98ac 100%)">{(tt) => {
  const n = Math.floor(eio(tt, 0.4, 4.4) * 14.99), p = n / 14;
  const path = (k: number) => [300 + k * 100, 980 - k * 34 + Math.sin(k * 0.7) * 30] as [number, number];
  const [lx, ly] = path(p * 14);
  return <>
    {/* puerta del galpón con luz y el montículo del pozo */}
    <div style={{ position: "absolute", left: 140, top: 300, width: 220, height: 160, background: "#2a1d12" }}><div style={{ margin: "30px 70px", width: 80, height: 130, background: "linear-gradient(180deg,#ffcf7a,#c8781e)" }} /></div>
    <div style={{ position: "absolute", left: 1700 - 200, top: 520, width: 400, height: 90, borderRadius: "50% 50% 0 0", background: "radial-gradient(ellipse at 50% 30%, #6a5040, #3a281b 70%)" }} />
    {Array.from({ length: 14 }, (_, k) => { const [x, y] = path(k), s = 0.6 + 0.4 * (k / 14) * 0;
      return <div key={k} style={{ position: "absolute", left: x + (k % 2 ? 24 : -24), top: y, width: 34 * (1 - k * 0.03), height: 60 * (1 - k * 0.03), borderRadius: "45% 45% 40% 40%", background: "rgba(70,86,110,.7)", transform: `rotate(${-20}deg) scale(${k < n ? cl(phys(tt, 0.4 + k * 0.285, 9, 0.5)) * s / 0.6 : 0})` }} />; })}
    {/* el farol */}
    <div style={{ position: "absolute", left: lx, top: ly - 220, transform: `rotate(${14 * Math.sin(tt * 2.2)}deg)`, transformOrigin: "50% 0" }}>
      <div style={{ width: 4, height: 60, background: "#555", margin: "0 auto" }} />
      <div style={{ width: 54, height: 80, borderRadius: 10, background: "radial-gradient(circle, #fff3c8, #ffb04a 50%, #6a3a10)", boxShadow: "0 0 160px 60px rgba(255,180,80,.35)" }} />
    </div>
    <Tag tt={tt} at={1.0} x={960} y={160} txt="BOOTS · LANTERN · SHOVEL" col={AMB} size={46} />
  </>;
}}</Stage>;
