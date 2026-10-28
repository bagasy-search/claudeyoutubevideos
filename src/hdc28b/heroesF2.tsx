// componentes únicos de hdc28b · segunda mitad (riego, humedad, brotes, trasplante, estolones, cuidados).
import React from "react";
import { AMB, DIM, GRN, H, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { ACH, Arrow, BERRY, Berry, Big, LEAF, LEAF2, Ok, Pot, SOIL, SOIL2, Seed, Sprout, Tray, Trifol, X } from "./heroesF";

const rnd = (i: number) => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const Drop: React.FC<{ x: number; y: number; s?: number; op?: number }> = ({ x, y, s = 1, op = 1 }) => (
  <div style={{ position: "absolute", left: x - 7 * s, top: y - 10 * s, width: 14 * s, height: 20 * s, borderRadius: "50% 50% 50% 50% / 30% 30% 70% 70%", background: "radial-gradient(circle at 35% 35%, #ffffff, #8fd0ff 60%, #3d8fd0)", opacity: op }} />
);
// planta adulta de fresa: corona + hojas de tres + (opcional) fresas colgando
const Plant: React.FC<{ x: number; y: number; s?: number; p?: number; berries?: number; sway?: number; leaves?: number }> = ({ x, y, s = 1, p = 1, berries = 0, sway = 0, leaves = 7 }) => <>
  {Array.from({ length: leaves }, (_, i) => <Trifol key={i} x={x + (i - (leaves - 1) / 2) * 34 * s} y={y} s={0.85 * s} p={p} rot={(i - (leaves - 1) / 2) * 17 + sway * Math.sin(i)} />)}
  <div style={{ position: "absolute", left: x - 26 * s, top: y - 16 * s, width: 52 * s, height: 30 * s, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #c49a5c, #6d4a24)", opacity: cl(p * 2) }} />
  {Array.from({ length: berries }, (_, i) => { const d = i % 2 ? 1 : -1, bx = x + d * (175 + (i >> 1) * 46) * s, by = y + (40 + (i >> 1) * 34) * s;
    return <React.Fragment key={i}><svg style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, overflow: "visible" }}><path d={`M${x + d * 30 * s} ${y - 6 * s} Q ${x + d * 150 * s} ${y - 40 * s} ${bx} ${by - 40 * s}`} stroke="#5d8f3a" strokeWidth={4 * s} fill="none" opacity={cl(p * 2)} /></svg><Berry x={bx} y={by} s={0.3 * s * p} rot={d * 14} /></React.Fragment>; })}
</>;

// ---- 11:55 · EL CHORRO Y EL RINCÓN: con regadera las semillas se van al rincón; desde abajo, quietas ----
export const HCorner: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const fl = eio(tt, 0.9, 2.6), up = eio(tt, 1.6, 4.0);
  return <>
    <Head tt={tt} kick="EL RIEGO" title="NUNCA CON LA REGADERA" col={ICE} />
    <Tray x={540} y={560} w={620}>{null}</Tray>
    {Array.from({ length: 16 }, (_, i) => { const x0 = 280 + (i % 8) * 70, x = x0 + (820 - x0) * fl * (0.7 + rnd(i) * 0.3); return <Seed key={i} x={x} y={578 + Math.floor(i / 8) * 8} s={1.3} />; })}
    {fl > 0 && fl < 1 && Array.from({ length: 10 }, (_, i) => <Drop key={i} x={260 + ((tt * 600 + i * 80) % 500)} y={380 + ((tt * 500 + i * 37) % 170)} s={1.3} />)}
    <svg viewBox="0 0 300 200" style={{ position: "absolute", left: 90, top: 250, width: 300, height: 200, overflow: "visible", transform: `rotate(${18 + 6 * Math.sin(tt * 3) * fl}deg)` }}>
      <path d="M40 60 h130 l10 110 h-150 Z" fill="#4f8fbf" /><path d="M40 60 h130 l2 20 h-134 Z" fill="#79b4de" />
      <path d="M60 60 Q105 -10 150 60" stroke="#3a6f96" strokeWidth={14} fill="none" />
      <path d="M175 140 L280 70" stroke="#4f8fbf" strokeWidth={18} strokeLinecap="round" /><ellipse cx={285} cy={66} rx={18} ry={24} fill="#3a6f96" transform="rotate(-34 285 66)" />
    </svg>
    <X x={540} y={460} p={cl((tt - 2.7) / 0.5)} s={150} />
    <Tag tt={tt} at={1.4} x={540} y={790} txt="TODAS AL RINCÓN" col={RED} size={40} />
    <div style={{ position: "absolute", left: 1080, top: 640, width: 640, height: 90, borderRadius: 10, background: "rgba(120,190,255,.35)", border: "3px solid rgba(255,255,255,.3)" }} />
    <Tray x={1400} y={550} w={560} wet={up}>{null}</Tray>
    {Array.from({ length: 8 }, (_, i) => <Seed key={i} x={1170 + i * 66} y={568} s={1.3} />)}
    {Array.from({ length: 5 }, (_, i) => <Arrow key={i} x1={1180 + i * 110} y1={700} x2={1180 + i * 110} y2={640 - 40 * up} p={cl(up * 2 - i * 0.1)} col={ICE} />)}
    <Big x={1400} y={420} txt="10 MIN" s={phys(tt, 2.4, 6, 0.5)} col={ICE} size={90} />
    <Tag tt={tt} at={2.0} x={1400} y={790} txt="DESDE ABAJO, UN DEDO DE AGUA" col={GRN} size={40} />
  </>;
}}</Stage>;

// ---- 12:30 · UNA SOLA OPORTUNIDAD: la semilla abre su raicita; un mediodía seco y se arruga ----
export const HOneChance: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const r = eio(tt, 0.6, 2.2), dry = eio(tt, 2.6, 3.8), hum = 1 - dry * 0.85;
  return <>
    <Head tt={tt} kick="LA HUMEDAD" title="SE SECA UNA VEZ Y SE MUERE" col={RED} />
    <div style={{ position: "absolute", left: 260, top: 640, width: 1000, height: 260, borderRadius: 14, background: `linear-gradient(180deg, rgb(${Math.round(70 + 90 * dry)},${Math.round(48 + 60 * dry)},${Math.round(32 + 40 * dry)}), ${SOIL2})` }} />
    <Seed x={760} y={632} s={6} col={dry > 0.5 ? "#b49a6a" : ACH} />
    <div style={{ position: "absolute", left: 778, top: 640, width: 10, height: 120 * r * (1 - 0.5 * dry), borderRadius: 5, background: dry > 0.5 ? "#a58a63" : "#f4f0e2", transform: `rotate(${-20 + 70 * dry}deg)`, transformOrigin: "50% 0" }} />
    <div style={{ position: "absolute", left: 1000, top: 200, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, #fff3b0, #ffb340 60%, transparent 70%)", opacity: dry }} />
    <div style={{ position: "absolute", left: 1450, top: 260, width: 70, height: 500, borderRadius: 35, background: "rgba(255,255,255,.08)", border: "4px solid rgba(255,255,255,.3)" }}>
      <div style={{ position: "absolute", left: 12, right: 12, bottom: 12, height: `${hum * 92}%`, borderRadius: 20, background: hum > 0.4 ? ICE : RED }} />
    </div>
    <div style={{ position: "absolute", left: 1400, top: 790, fontWeight: 900, fontSize: 34, color: DIM }}>HUMEDAD</div>
    <Tag tt={tt} at={4.0} x={760} y={860} txt="NO HAY SEGUNDA OPORTUNIDAD" col={RED} size={46} />
  </>;
}}</Stage>;

// ---- 13:15 · EL INVERNADERO CHIQUITO: el agua sube, se pega al plástico y vuelve a caer (ciclo cerrado) ----
export const HDome: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const lid = phys(tt, 0.4, 6, 0.55);
  return <>
    <Head tt={tt} kick="UN PLÁSTICO O UNA TAPA" title="UN INVERNADERO CHIQUITO" col={GRN} />
    <Tray x={960} y={640} w={900} h={140}>{null}</Tray>
    {Array.from({ length: 12 }, (_, i) => <Seed key={i} x={570 + i * 70} y={662} s={1.4} />)}
    <div style={{ position: "absolute", left: 500, top: 640 - 360 * lid, width: 920, height: 360, borderRadius: "200px 200px 8px 8px", border: "5px solid rgba(220,240,255,.55)", background: "linear-gradient(180deg, rgba(220,240,255,.14), rgba(220,240,255,.04))", opacity: cl(lid * 2) }} />
    {lid > 0.9 && Array.from({ length: 10 }, (_, i) => { const ph = ((tt * 0.45 + i * 0.1) % 1), x = 600 + i * 80, up = ph < 0.5; const y = up ? 640 - ph * 2 * 300 : 340 + (ph - 0.5) * 2 * 300;
      return <React.Fragment key={i}>{up ? <div style={{ position: "absolute", left: x, top: y, width: 18, height: 18, borderRadius: "50%", background: "rgba(220,240,255,.25)", filter: "blur(4px)" }} /> : <Drop x={x} y={y} s={1.2} op={0.9} />}</React.Fragment>; })}
    {Array.from({ length: 26 }, (_, i) => <Drop key={i} x={560 + rnd(i) * 800} y={320 + rnd(i + 5) * 60 + Math.abs(rnd(i) - 0.5) * 120} s={0.8} op={cl((tt - 1.6 - i * 0.05) / 0.5) * 0.85} />)}
    <Tag tt={tt} at={2.0} x={420} y={430} txt="SE EVAPORA" col={DIM} size={30} />
    <Tag tt={tt} at={2.6} x={1530} y={430} txt="SE PEGA Y CAE" col={ICE} size={30} />
    <Tag tt={tt} at={3.6} x={960} y={880} txt="4-5 DÍAS SIN REGAR" col={GRN} size={46} />
  </>;
}}</Stage>;

// ---- 13:45 · EL HORNO: al sol directo el termómetro de adentro sube a 45 °C; junto a la ventana sin sol, 22 °C ----
export const HOven: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const hot = eio(tt, 0.8, 3.4);
  return <>
    <Head tt={tt} kick="LUZ SÍ, SOL DIRECTO NO" title="TAPADA AL SOL = UN HORNO" col={RED} />
    {[0, 1].map((b) => {
      const x = b ? 1380 : 540, T = b ? 22 : Math.round(22 + 23 * hot);
      return <div key={b}>
        {!b && <div style={{ position: "absolute", left: x - 70, top: 170, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, #fff6c0, #ffb02e 60%, transparent 72%)" }} />}
        {!b && Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", left: x - 140 + i * 70, top: 300, width: 8, height: 160 * hot, background: "linear-gradient(180deg, rgba(255,200,80,.6), transparent)", transform: `rotate(${(i - 2) * 6}deg)` }} />)}
        {b === 1 && <div style={{ position: "absolute", left: x - 200, top: 200, width: 400, height: 260, border: "14px solid #d8cdb8", background: "linear-gradient(180deg, rgba(180,220,255,.3), rgba(180,220,255,.08))" }} />}
        <Tray x={x} y={620} w={460}>{null}</Tray>
        <div style={{ position: "absolute", left: x - 240, top: 470, width: 480, height: 160, borderRadius: "120px 120px 6px 6px", border: "4px solid rgba(220,240,255,.5)", background: !b ? `rgba(255,120,60,${0.25 * hot})` : "rgba(220,240,255,.06)" }} />
        <Big x={x} y={545} txt={`${T}°C`} s={1} col={!b && T > 30 ? RED : GRN} size={80} />
        <Tag tt={tt} at={1 + b * 0.8} x={x} y={830} txt={b ? "AL LADO DE LA VENTANA" : "AL SOL DIRECTO"} col={b ? GRN : RED} size={40} />
        {b ? <Ok x={x + 230} y={700} p={cl((tt - 3.6) / 0.5)} /> : <X x={x} y={720} p={cl((tt - 3.4) / 0.5)} s={120} />}
      </div>;
    })}
    <Tag tt={tt} at={4.2} x={960} y={930} txt="ENTRE 18 Y 24 GRADOS" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 14:15 · EL AIRE QUIETO: la tapa se abre 5 minutos, entra aire fresco en remolino y se llevan las esporas ----
export const HAir: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const open = eio(tt, 1.0, 2.0) * (1 - eio(tt, 4.6, 5.4)), clock = cl((tt - 1.0) / 3.6);
  return <>
    <Head tt={tt} kick="UNA VEZ POR DÍA" title="ABRE 5 MINUTOS" col={ICE} />
    <Tray x={820} y={640} w={760}>{null}</Tray>
    {Array.from({ length: 10 }, (_, i) => <Seed key={i} x={500 + i * 70} y={660} s={1.4} />)}
    <div style={{ position: "absolute", left: 430, top: 380, width: 780, height: 260, borderRadius: "120px 120px 6px 6px", border: "5px solid rgba(220,240,255,.5)", background: "rgba(220,240,255,.06)", transform: `rotate(${-28 * open}deg)`, transformOrigin: "0 100%" }} />
    {Array.from({ length: 30 }, (_, i) => { const k = ((tt * 0.6 + rnd(i)) % 1); return <div key={i} style={{ position: "absolute", left: 560 + rnd(i + 2) * 520 + k * 300 * open, top: 600 - k * 400 * open + 20 * Math.sin(tt * 3 + i), width: 7, height: 7, borderRadius: "50%", background: "rgba(240,240,240,.7)", opacity: (1 - open) * 0.6 + open * (1 - k) }} />; })}
    {open > 0.1 && Array.from({ length: 4 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1150 - i * 40, top: 300 + i * 50, width: 260, height: 70, borderRadius: "50%", border: "4px solid rgba(160,220,255,.5)", borderLeftColor: "transparent", borderBottomColor: "transparent", transform: `rotate(${tt * 60 + i * 30}deg)`, opacity: open }} />)}
    <div style={{ position: "absolute", left: 1400, top: 320, width: 300, height: 300, borderRadius: "50%", background: `conic-gradient(${ICE} ${clock * 360}deg, rgba(255,255,255,.08) 0)` }}>
      <div style={{ position: "absolute", inset: 26, borderRadius: "50%", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 80, color: TX }}>{Math.round(clock * 5)}'</div>
    </div>
    <Tag tt={tt} at={2.2} x={1550} y={700} txt="AIRE QUIETO = HONGO" col={RED} size={34} />
  </>;
}}</Stage>;

// ---- 14:40 · LA PELUCITA BLANCA: algodón sobre la tierra; cae la canela y se apaga ----
export const HFuzz: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const fz = eio(tt, 0.4, 1.8) * (1 - eio(tt, 3.2, 4.8)), cin = cl((tt - 2.0) / 1.6);
  return <>
    <Head tt={tt} kick="SI UN DÍA LA VES" title="UNA PIZCA DE CANELA" col={AMB} />
    <div style={{ position: "absolute", left: 300, top: 560, width: 1320, height: 260, borderRadius: 14, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})` }} />
    {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 420 + i * 130 + rnd(i) * 40, top: 520 + rnd(i + 3) * 40, width: 140 + rnd(i) * 80, height: 70, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,.85), rgba(255,255,255,.3) 50%, transparent 70%)", filter: "blur(3px)", opacity: fz, transform: `scale(${0.6 + 0.4 * fz})` }} />)}
    <div style={{ position: "absolute", left: 830, top: 180 + 40 * Math.sin(tt * 4) * cl(cin * 3), width: 120, height: 200, borderRadius: "20px 20px 30px 30px", background: "linear-gradient(90deg, #a0562a, #d08a52 50%, #a0562a)", transform: `rotate(${150 * cl(cin * 3)}deg)`, opacity: cl(tt - 1.6) }}>
      <div style={{ position: "absolute", left: 10, right: 10, top: 50, height: 70, background: "#f2e6d0", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 22, color: "#7a3d1a" }}>CANELA</div>
    </div>
    {cin > 0.3 && Array.from({ length: 50 }, (_, i) => { const k = ((tt * 0.9 + rnd(i)) % 1); return <div key={i} style={{ position: "absolute", left: 780 + rnd(i + 1) * 300 + (k - 0.5) * 200 * rnd(i + 7), top: 360 + k * 220, width: 6, height: 6, borderRadius: "50%", background: "#b8692f", opacity: 1 - k }} />; })}
    <Tag tt={tt} at={3.6} x={960} y={880} txt="ANTIHONGO SUAVE DE LA COCINA · MÁS AIRE" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 15:05 · EL BROTE EN CÁMARA LENTA: puntita blanca, gancho, se endereza, dos hojitas redondas ----
export const HGerm: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const S = ["PUNTITA BLANCA", "SE DOBLA", "SE ENDEREZA", "DOS HOJITAS"];
  return <>
    <Head tt={tt} kick="EL DÍA QUE VALE TODO" title="ASÍ SALE LA PRIMERA" col={GRN} />
    <div style={{ position: "absolute", left: 160, top: 640, width: 1600, height: 200, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})`, borderRadius: 10 }} />
    {S.map((n, i) => {
      const x = 340 + i * 420, k = phys(tt, 0.4 + i * 0.9, 6, 0.55), g = cl(k);
      return <div key={i} style={{ opacity: cl(k * 2) }}>
        <Seed x={x} y={636} s={3.4} />
        {i === 0 && <div style={{ position: "absolute", left: x + 4, top: 640, width: 8, height: 50 * g, borderRadius: 4, background: "#f6f2e6" }} />}
        {i === 1 && <svg viewBox="0 0 100 120" style={{ position: "absolute", left: x - 50, top: 520, width: 100, height: 120, overflow: "visible" }}><path d="M50 120 L50 40 Q50 10 25 25" stroke="#e6ecc8" strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray={140} strokeDashoffset={140 * (1 - g)} /></svg>}
        {i === 2 && <Sprout x={x} y={640} p={0.34 * g} s={2.2} />}
        {i === 3 && <Sprout x={x} y={640} p={g} s={2.2} />}
        <Tag tt={tt} at={0.8 + i * 0.9} x={x} y={880} txt={n} col={i === 3 ? GRN : TX} size={34} />
        {i < 3 && <Arrow x1={x + 110} y1={560} x2={x + 300} y2={560} p={cl((tt - 1.0 - i * 0.9) * 2)} col="rgba(255,255,255,.35)" />}
      </div>;
    })}
  </>;
}}</Stage>;

// ---- 15:45 · NO SON HOJAS DE FRESA TODAVÍA: cotiledones (merienda) contra la hoja verdadera dentada que sale del centro ----
export const HTrueLeaf: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const tl = eio(tt, 1.6, 3.8);
  return <>
    <Head tt={tt} kick="OJO CON ESTO" title="LA HOJA DE VERDAD SALE DESPUÉS" col={GRN} />
    <div style={{ position: "absolute", left: 560, top: 760, width: 800, height: 120, borderRadius: 12, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})` }} />
    <Sprout x={960} y={765} p={1} s={5} />
    <Trifol x={960} y={460} s={1.4} p={tl} />
    <div style={{ position: "absolute", left: 960, top: 430, width: 4, height: 330 * tl, background: "#7fae4f", transform: "translateX(-2px)" }} />
    <Arrow x1={520} y1={500} x2={760} y2={640} p={cl((tt - 0.8) * 2)} col={AMB} />
    <Tag tt={tt} at={0.9} x={380} y={470} txt="COTILEDONES" col={AMB} size={40} />
    <Tag tt={tt} at={1.2} x={380} y={520} txt="LA MERIENDA DE LA SEMILLA" col={DIM} size={26} />
    <Arrow x1={1440} y1={360} x2={1140} y2={360} p={cl((tt - 3.0) * 2)} col={GRN} />
    <Tag tt={tt} at={3.2} x={1600} y={340} txt="HOJA DENTADA" col={GRN} size={40} />
    <Tag tt={tt} at={3.5} x={1600} y={390} txt="2-3 SEMANAS · YA ES PLANTA" col={DIM} size={26} />
  </>;
}}</Stage>;

// ---- 16:30 · EL HONGO DEL SEMILLERO: las plantitas se doblan en la base, una tras otra, en una noche ----
export const HDamp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const night = eio(tt, 0.6, 1.6);
  return <>
    <div style={{ position: "absolute", inset: 0, background: `rgba(10,20,60,${0.35 * night})` }} />
    <Head tt={tt} kick="PLÁSTICO PUESTO DE MÁS" title="SE CAEN TODAS EN UNA NOCHE" col={RED} />
    <div style={{ position: "absolute", left: 1500, top: 180, width: 110, height: 110, borderRadius: "50%", boxShadow: "-26px 10px 0 0 #f2f0d8", opacity: night }} />
    <Tray x={900} y={640} w={1100} h={140}>{null}</Tray>
    {Array.from({ length: 16 }, (_, i) => { const f = eio(tt, 1.8 + i * 0.16, 2.4 + i * 0.16), x = 400 + i * 66; return <React.Fragment key={i}>
      <div style={{ position: "absolute", left: x - 8, top: 650, width: 16, height: 10, borderRadius: "50%", background: "rgba(140,110,60,.9)", opacity: f }} />
      <Sprout x={x} y={656} p={1} s={1.5} lean={f * (i % 2 ? 84 : -84)} />
    </React.Fragment>; })}
    <Tag tt={tt} at={3.2} x={900} y={850} txt="DOBLADAS EN LA BASE, COMO CORTADAS" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- 17:00 · TALLO LARGO Y PÁLIDO: se estiran hacia la ventana; un cuarto de vuelta cada día las endereza ----
export const HStretch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const lean = eio(tt, 0.6, 2.2), turn = eio(tt, 2.8, 3.8), fix = eio(tt, 3.8, 5.0);
  return <>
    <Head tt={tt} kick="LES FALTA LUZ" title="UN CUARTO DE VUELTA POR DÍA" col={AMB} />
    <div style={{ position: "absolute", left: 1500, top: 220, width: 300, height: 480, border: "16px solid #d8cdb8", background: "linear-gradient(180deg, rgba(255,240,190,.35), rgba(255,240,190,.08))" }} />
    {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1480 - i * 120, top: 300 + i * 40, width: 160, height: 14, background: "linear-gradient(90deg, rgba(255,240,190,.35), transparent)", transform: "rotate(14deg)" }} />)}
    <div style={{ transform: `scaleX(${1 - 2 * Math.sin(turn * Math.PI / 2) * (1 - fix)})`, transformOrigin: "760px 600px" }}>
      <Tray x={760} y={620} w={700}>{null}</Tray>
      {Array.from({ length: 9 }, (_, i) => <Sprout key={i} x={480 + i * 70} y={640} p={1} s={1.4} tall={1 + 1.2 * lean} pale={lean * (1 - fix)} lean={(48 * lean) * (1 - fix) * (1 - 2 * turn * (1 - fix))} />)}
    </div>
    <svg viewBox="0 0 200 200" style={{ position: "absolute", left: 660, top: 760, width: 200, height: 200, opacity: turn }}><path d="M40 100 A60 60 0 0 1 160 100" stroke={AMB} strokeWidth={10} fill="none" /><path d="M160 100 l-22 -6 l14 22 Z" fill={AMB} /></svg>
    <Tag tt={tt} at={1.2} x={760} y={300} txt="TORCIDAS Y PÁLIDAS" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- 17:35 · EL RALEO: seis amontonadas en un centímetro; la tijerita corta las débiles; queda una cada 2 cm ----
export const HThin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const cut = (i: number) => cl((tt - 1.4 - i * 0.35) / 0.3), keep = [0, 3, 6, 9, 12];
  return <>
    <Head tt={tt} kick="DUELE, PERO HAY QUE HACERLO" title="UNA CADA 2 CENTÍMETROS" col={GRN} />
    <Tray x={960} y={620} w={1100}>{null}</Tray>
    {Array.from({ length: 13 }, (_, i) => { const kp = keep.includes(i), c = kp ? 0 : cut(keep.filter((k) => k < i).length * 2 + (i % 3)); const x = 480 + i * 80;
      return <div key={i} style={{ opacity: 1 - c, transform: `translateY(${c * 40}px)` }}><Sprout x={x} y={640} p={1} s={kp ? 1.9 : 1.2} tall={kp ? 1.3 : 0.9} /></div>; })}
    {(() => { const k = cl((tt - 1.2) / 3.4), x = 520 + k * 920; return <svg viewBox="0 0 120 80" style={{ position: "absolute", left: x - 60, top: 470, width: 120, height: 80, overflow: "visible" }}>
      <path d={`M60 40 L120 ${30 - 10 * Math.abs(Math.sin(tt * 9))}`} stroke="#d7d7de" strokeWidth={8} strokeLinecap="round" /><path d={`M60 40 L120 ${50 + 10 * Math.abs(Math.sin(tt * 9))}`} stroke="#bdbdc6" strokeWidth={8} strokeLinecap="round" />
      <circle cx={34} cy={28} r={18} fill="none" stroke={RED} strokeWidth={7} /><circle cx={34} cy={54} r={18} fill="none" stroke={RED} strokeWidth={7} />
    </svg>; })()}
    {keep.slice(0, 4).map((k, i) => <div key={i} style={{ position: "absolute", left: 480 + k * 80, top: 760, width: 240, height: 4, background: AMB, opacity: cl((tt - 4.4) * 2) }} />)}
    <Tag tt={tt} at={4.6} x={960} y={830} txt="SE CORTAN AL RAS · NO SE ARRANCAN" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 18:20 · EL RINCÓN LEJOS DE LA VENTANA: las clarita están del lado oscuro; girando la bandeja se emparejan ----
export const HCornerLight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const days = eio(tt, 2.0, 4.6), N = 7;
  return <>
    <Head tt={tt} kick="LO QUE LE PASÓ A MI BANDEJA" title="NO ESTABAN ENFERMAS: LES FALTABA LUZ" col={AMB} />
    <div style={{ position: "absolute", left: 1560, top: 240, width: 220, height: 560, border: "14px solid #d8cdb8", background: "linear-gradient(90deg, rgba(255,240,190,.08), rgba(255,240,190,.4))" }} />
    <div style={{ position: "absolute", left: 360, top: 300, width: 1100, height: 520, borderRadius: 16, background: `linear-gradient(90deg, ${SOIL2}, ${SOIL})`, transform: `rotate(${days * 360 * 0}deg)` }} />
    <div style={{ position: "absolute", left: 360, top: 300, width: 1100, height: 520, borderRadius: 16, background: `linear-gradient(90deg, rgba(0,0,0,${0.45 * (1 - days)}), transparent 60%)` }} />
    {Array.from({ length: N * 4 }, (_, i) => { const c = i % N, r = Math.floor(i / N), far = 1 - c / (N - 1); const pale = far * (1 - days);
      return <Sprout key={i} x={460 + c * 150} y={390 + r * 120} p={1} s={1.4} pale={pale} lean={8 * (1 - days) * (1 - far * 0.2)} />; })}
    <div style={{ position: "absolute", left: 360, top: 850, fontWeight: 900, fontSize: 40, color: TX }}>DÍA {Math.round(15 + 7 * days)}</div>
    <Tag tt={tt} at={2.2} x={1100} y={870} txt="GIRÉ LA BANDEJA CADA DÍA" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 19:25 · LISTA PARA LA MACETA: contador de hojas dentadas 1-2-3-4 y semanas 4-6 ----
export const HReady: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const n = Math.min(4, Math.floor(cl((tt - 0.6) / 3.0) * 4.999));
  return <>
    <Head tt={tt} kick="PASO 6 · ¿CUÁNDO?" title="CON 3 O 4 HOJAS DENTADAS" col={GRN} />
    <div style={{ position: "absolute", left: 560, top: 720, width: 500, height: 100, borderRadius: 12, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})` }} />
    {Array.from({ length: 4 }, (_, i) => <Trifol key={i} x={810 + (i - 1.5) * 70} y={725} s={1.1} p={i < n ? phys(tt, 0.6 + i * 0.75, 7, 0.5) : 0} rot={(i - 1.5) * 26} />)}
    <div style={{ position: "absolute", left: 1220, top: 330, display: "flex", gap: 20 }}>{[1, 2, 3, 4].map((k) => <div key={k} style={{ width: 90, height: 120, borderRadius: 14, background: k <= n ? (k >= 3 ? GRN : "rgba(111,227,154,.3)") : "rgba(255,255,255,.06)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 64, color: k <= n ? "#0b0b0b" : DIM }}>{k}</div>)}</div>
    <Big x={1430} y={620} txt="4-6 SEMANAS" s={phys(tt, 3.6, 6, 0.6)} col={AMB} size={70} />
    <Tag tt={tt} at={4.2} x={1430} y={720} txt="YA NO ENTRA EN LA BANDEJA" col={DIM} size={32} />
  </>;
}}</Stage>;

// ---- 19:50 · LA MACETA ENORME: en corte, la tierra mojada que la raíz no toma se queda mojada (pudre); en la chica, justa ----
export const HBigPot: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const w = eio(tt, 0.8, 2.6);
  return <>
    <Head tt={tt} kick="PRIMERO UNA CHICA" title="NO A LA MACETA GRANDE TODAVÍA" col={AMB} />
    <Pot x={600} y={360} w={620} h={480}><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${70 * w}%`, background: "rgba(80,140,220,.32)" }} /></Pot>
    <Trifol x={570} y={385} s={0.6} p={1} rot={-14} /><Trifol x={630} y={385} s={0.6} p={1} rot={14} />
    <div style={{ position: "absolute", left: 560, top: 380, width: 80, height: 70, borderRadius: "0 0 40px 40px", border: "3px solid rgba(240,230,200,.6)", borderTop: "none" }} />
    <X x={600} y={650} p={cl((tt - 3.0) / 0.5)} s={150} />
    <Tag tt={tt} at={1.6} x={600} y={900} txt="TIERRA MOJADA ALREDEDOR · SE PUDRE" col={RED} size={32} />
    <Pot x={1380} y={520} w={230} h={190}><div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 30%, rgba(240,230,200,.35), transparent 70%)" }} /></Pot>
    <Trifol x={1350} y={545} s={0.6} p={1} rot={-14} /><Trifol x={1410} y={545} s={0.6} p={1} rot={14} />
    <Ok x={1380} y={420} p={cl((tt - 3.6) / 0.5)} />
    <Tag tt={tt} at={2.4} x={1380} y={900} txt="8-10 CM · MITAD Y MITAD" col={GRN} size={36} />
  </>;
}}</Stage>;

// ---- 20:05 · CÓMO SE AGARRA: pinza en la hoja (sí), pinza en el tallo (se aplasta, no) ----
export const HHold: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const a = eio(tt, 0.6, 1.6), b = eio(tt, 2.4, 3.4), sq = cl((tt - 3.4) / 0.4);
  const Pinch: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => <>
    <div style={{ position: "absolute", left: x - 110 + 40 * k, top: y - 30, width: 90, height: 40, borderRadius: 20, background: "linear-gradient(180deg, #e7b897, #c48d6b)" }} />
    <div style={{ position: "absolute", left: x + 20 - 40 * k, top: y - 10, width: 90, height: 40, borderRadius: 20, background: "linear-gradient(180deg, #e7b897, #b37e5f)" }} />
  </>;
  return <>
    <Head tt={tt} kick="CON UN PALITO DE HELADO" title="NUNCA POR EL TALLO" col={RED} />
    {[0, 1].map((s) => { const x = s ? 1380 : 540; return <React.Fragment key={s}>
      <div style={{ position: "absolute", left: x - 70, top: 700, width: 140, height: 90, borderRadius: "50% 50% 40% 40%", background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})` }} />
      <div style={{ position: "absolute", left: x - 4 + (s ? 3 * sq : 0), top: 520, width: s ? 8 - 5 * sq : 8, height: 190, background: s && sq > 0.5 ? "#8a7a4a" : "#7fae4f", borderRadius: 4 }} />
      <Trifol x={x} y={540} s={1} p={1} rot={s ? 30 * sq : 0} />
    </React.Fragment>; })}
    <Pinch x={480} y={430} k={a} />
    <Pinch x={1380} y={620} k={b} />
    <Ok x={540} y={300} p={cl((tt - 1.8) / 0.5)} />
    <X x={1380} y={620} p={cl((tt - 3.8) / 0.5)} s={170} />
    <Tag tt={tt} at={1.8} x={540} y={880} txt="POR LA HOJA: SALE OTRA" col={GRN} size={36} />
    <Tag tt={tt} at={3.8} x={1380} y={880} txt="EL TALLO SE APLASTA Y SE MUERE" col={RED} size={36} />
  </>;
}}</Stage>;

// ---- 20:40 · LA CORONA: tres cortes de maceta: enterrada (pudre), en el aire (se seca), al ras (sí) ----
export const HCrown: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <>
  <Head tt={tt} kick="EL DETALLE DE TODA LA VIDA" title="LA CORONA, JUSTO AL RAS" col={RED} />
  {[["ENTERRADA", 70, "SE PUDRE"], ["MUY ARRIBA", -70, "RAÍCES SECAS"], ["AL RAS", 0, "ASÍ"]].map(([n, dy, why], i) => {
    const x = 420 + i * 540, k = phys(tt, 0.4 + i * 0.8, 6, 0.5), ok = i === 2, soil = 560;
    return <div key={i} style={{ opacity: cl(k * 2) }}>
      <div style={{ position: "absolute", left: x - 200, top: soil, width: 400, height: 280, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})`, borderRadius: "0 0 20px 20px" }} />
      <div style={{ position: "absolute", left: x - 230, top: soil - 3, width: 460, height: 6, background: AMB, opacity: 0.7 }} />
      {Array.from({ length: 7 }, (_, j) => <div key={j} style={{ position: "absolute", left: x - 30 + j * 10, top: soil + (dy as number) + 14, width: 4, height: 90 + rnd(j) * 50, background: "#e8dcc0", transform: `rotate(${(j - 3) * 9}deg)`, transformOrigin: "50% 0", opacity: i === 1 ? 0.45 : 0.85 }} />)}
      <div style={{ position: "absolute", left: x - 34, top: soil + (dy as number) - 16, width: 68, height: 36, borderRadius: "50%", background: i === 0 ? "radial-gradient(circle, #5a4a2a, #2a2010)" : "radial-gradient(circle at 40% 35%, #c49a5c, #6d4a24)", boxShadow: ok ? `0 0 26px ${GRN}` : undefined }} />
      {[-1, 0, 1].map((d) => <Trifol key={d} x={x + d * 40} y={soil + (dy as number) - 10} s={0.62} p={1} rot={d * 24} col={i === 0 ? "#6f8f4a" : undefined} />)}
      <Tag tt={tt} at={0.8 + i * 0.8} x={x} y={880} txt={n as string} col={ok ? GRN : RED} size={38} />
      <Tag tt={tt} at={1.2 + i * 0.8} x={x} y={930} txt={why as string} col={DIM} size={28} />
      {ok ? <Ok x={x} y={300} p={cl((tt - 3.4) / 0.5)} /> : <X x={x} y={soil + (dy as number)} p={cl((tt - 2.6 - i * 0.4) / 0.5)} s={110} />}
    </div>;
  })}
</>}</Stage>;

// ---- 21:20 · LAS MACETAS DE LA VIDA: bandeja → vasito 8-10 cm → definitiva 20×20 cm (o jardinera, una cada 25 cm) ----
export const HPotSizes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const S = [["BANDEJA", 0.35], ["8-10 CM", 0.6], ["20 × 20 CM", 1]] as const;
  return <>
    <Head tt={tt} kick="CUANDO LAS RAÍCES ASOMAN" title="A LA DEFINITIVA, CON 6 HORAS DE SOL" col={AMB} />
    {S.map(([n, sc], i) => { const x = 360 + i * 560, k = phys(tt, 0.4 + i * 1.0, 6, 0.5);
      return <div key={i} style={{ opacity: cl(k * 2), transform: `translateY(${(1 - k) * 60}px)` }}>
        {i === 0 ? <Tray x={x} y={680} w={260} h={80}>{null}</Tray> : <Pot x={x} y={800 - 330 * sc} w={340 * sc} h={330 * sc}>{null}</Pot>}
        <Plant x={x} y={i === 0 ? 690 : 812 - 330 * sc} s={0.45 + 0.6 * (sc as number)} leaves={3 + i * 2} berries={i === 2 ? 3 : 0} />
        <Tag tt={tt} at={0.8 + i} x={x} y={870} txt={n} col={i === 2 ? GRN : TX} size={40} />
        {i < 2 && <Arrow x1={x + 170} y1={560} x2={x + 380} y2={560} p={cl((tt - 1.2 - i) * 2)} col="rgba(255,255,255,.35)" />}
      </div>; })}
    <div style={{ position: "absolute", left: 1520, top: 220, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, #fff3b0, #ffb340 60%, transparent 72%)", opacity: cl((tt - 3.2) * 2) }} />
  </>;
}}</Stage>;

// ---- 22:05 · COMO LOS HIJOS: la fresa del súper es un cruce; sus hijas salen distintas (más chica, más dulce, más ácida) ----
export const HHybrid: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const kids = [[0.7, 0.85, "MÁS CHICA"], [1, 1, "PARECIDA"], [0.85, 0.7, "MÁS ÁCIDA"], [0.95, 1, "MÁS DULCE"], [0.6, 0.9, "OTRA FORMA"]] as const;
  return <>
    <Head tt={tt} kick="UNA VERDAD MÁS" title="SE PARECEN, PERO NINGUNA ES IGUAL" col={RED} />
    <Berry x={960} y={330} s={0.85 * phys(tt, 0.3, 6, 0.5)} />
    <Tag tt={tt} at={0.6} x={960} y={490} txt="LA DEL SÚPER (HÍBRIDO)" col={AMB} size={30} />
    {kids.map(([s, rp, n], i) => { const x = 360 + i * 300, k = phys(tt, 1.2 + i * 0.45, 6, 0.5);
      return <React.Fragment key={i}>
        <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}><path d={`M960 510 C 960 600 ${x} 560 ${x} 640`} stroke="rgba(255,255,255,.25)" strokeWidth={4} fill="none" strokeDasharray={600} strokeDashoffset={600 * (1 - cl(k))} /></svg>
        <Berry x={x} y={740} s={0.5 * (s as number) * k} ripe={rp as number} rot={(i - 2) * 8} />
        <Tag tt={tt} at={1.5 + i * 0.45} x={x} y={900} txt={n as string} col={TX} size={28} />
      </React.Fragment>; })}
  </>;
}}</Stage>;

// ---- 22:55 · LOS ESTOLONES: de la corona salen brazos finitos; en la punta, a 20-30 cm, una plantita con raíces esperando ----
export const HRunners: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const r = eio(tt, 0.8, 3.0), d = cl((tt - 2.6) / 1.2);
  return <>
    <Head tt={tt} kick="PASO 7" title="LA PLANTA QUE TE REGALA PLANTAS" col={GRN} />
    <div style={{ position: "absolute", left: 160, top: 700, width: 1600, height: 160, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})`, borderRadius: 10 }} />
    <Plant x={960} y={700} s={1.1} leaves={7} berries={2} sway={4} />
    {[-1, 1].map((s) => { const ex = 960 + s * 620 * r; return <React.Fragment key={s}>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}><path d={`M960 690 Q ${960 + s * 310} ${560} ${ex} ${690}`} stroke="#b0472f" strokeWidth={7} fill="none" /></svg>
      {d > 0 && <><Trifol x={ex - 26} y={690} s={0.55 * d} p={1} rot={-20} /><Trifol x={ex + 26} y={690} s={0.55 * d} p={1} rot={20} />
        {Array.from({ length: 4 }, (_, j) => <div key={j} style={{ position: "absolute", left: ex - 15 + j * 10, top: 694, width: 6, height: 22 * d, borderRadius: 3, background: "#ede1c3" }} />)}</>}
    </React.Fragment>; })}
    <div style={{ position: "absolute", left: 960, top: 900, width: 620 * r, height: 4, background: AMB }} />
    <Tag tt={tt} at={3.0} x={1270} y={950} txt="20-30 CM · UNA COPIA EXACTA DE LA MADRE" col={AMB} size={34} />
  </>;
}}</Stage>;

// ---- 23:25 · EL CLIP: la hija se apoya en una maceta nueva y se sujeta; 2-3 semanas tirando de la madre; tijera ----
export const HPinClip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const pin = phys(tt, 0.8, 7, 0.5), wk = cl((tt - 1.8) / 2.0), cut = cl((tt - 4.2) / 0.4), roots = wk;
  return <>
    <Head tt={tt} kick="NO LO CORTES TODAVÍA" title="SE SUJETA CON UN CLIP" col={AMB} />
    <Pot x={560} y={520} w={380} h={300}>{null}</Pot>
    <Plant x={560} y={538} s={0.9} leaves={5} />
    <Pot x={1360} y={600} w={260} h={220}>{Array.from({ length: 6 }, (_, j) => <div key={j} style={{ position: "absolute", left: 104 + j * 8, top: 6, width: 4, height: 110 * roots, background: "#ede1c3", transform: `rotate(${(j - 2.5) * 10}deg)`, transformOrigin: "50% 0" }} />)}</Pot>
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}>
      <path d="M600 530 Q 980 380 1180 600" stroke="#b0472f" strokeWidth={7} fill="none" strokeDasharray="1000" strokeDashoffset={0} />
      {cut > 0 && <path d="M1180 600 Q 1260 640 1340 615" stroke="#b0472f" strokeWidth={7} fill="none" opacity={1 - cut} />}
      {!cut && <path d="M1180 600 Q 1260 640 1340 615" stroke="#b0472f" strokeWidth={7} fill="none" />}
    </svg>
    <Trifol x={1340} y={615} s={0.5} p={1} rot={-14} /><Trifol x={1380} y={615} s={0.5} p={1} rot={14} />
    <div style={{ position: "absolute", left: 1340, top: 560 + (1 - pin) * -120, width: 60, height: 80, border: "7px solid #c9ccd6", borderBottom: "none", borderRadius: "30px 30px 0 0", opacity: cl(pin * 2) }} />
    <Big x={960} y={330} txt={`${Math.round(wk * 3)} SEM`} s={phys(tt, 1.8, 6, 0.6)} col={GRN} size={90} />
    {cut > 0 && <X x={1260} y={630} p={cut} s={80} />}
    <Tag tt={tt} at={4.4} x={960} y={900} txt="SI RESISTE AL TIRAR: SE CORTA" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 24:15 · POR ESO CIENTOS: 1 planta → 10 hijas → 100 en el verano siguiente (árbol que se abre) ----
export const HTree: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const a = eio(tt, 0.8, 2.2), b = eio(tt, 2.4, 4.4);
  return <>
    <Head tt={tt} kick="DE TUS MEJORES PLANTAS" title="POR ESO TE DIGO CIENTOS" col={RED} />
    <div style={{ position: "absolute", left: 140, top: 520 }}><Berry x={0} y={0} s={0.5} /></div>
    <Big x={140} y={680} txt="1" s={1} col={TX} size={80} />
    {Array.from({ length: 10 }, (_, i) => { const y = 250 + i * 64, k = cl(a * 1.6 - i * 0.06);
      return <React.Fragment key={i}>
        <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}><path d={`M200 520 C 400 520 400 ${y} 560 ${y}`} stroke="rgba(176,71,47,.7)" strokeWidth={4} fill="none" strokeDasharray={500} strokeDashoffset={500 * (1 - k)} /></svg>
        <div style={{ position: "absolute", left: 560, top: y - 18, width: 36, height: 36, borderRadius: "50%", background: GRN, transform: `scale(${k})` }} />
        {Array.from({ length: 10 }, (_, j) => { const kk = cl(b * 2.2 - (i + j) * 0.06); return <div key={j} style={{ position: "absolute", left: 700 + j * 90 + 6 * Math.sin(tt + i + j), top: y - 12, width: 24, height: 24, borderRadius: "50%", background: "#5fae4a", transform: `scale(${kk})`, opacity: kk }} />; })}
      </React.Fragment>; })}
    <Big x={580} y={940} txt="10" s={a} col={GRN} size={70} />
    <Big x={1150} y={940} txt={`${Math.round(100 * b)}`} s={b} col={RED} size={90} />
  </>;
}}</Stage>;

// ---- 24:45 · FRUTA O PLANTAS: la fuerza de la madre se reparte; con 10 estolones, menos fresas ----
export const HSplit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const n = Math.round(10 * eio(tt, 0.8, 3.0)), fr = 1 - n / 14;
  return <>
    <Head tt={tt} kick="EL ERROR MÁS COMÚN" title="CADA ESTOLÓN LE SACA FUERZA" col={RED} />
    <Plant x={960} y={620} s={1.2} leaves={7} />
    {Array.from({ length: n }, (_, i) => { const a = -Math.PI + (i + 0.5) * Math.PI / 10, ex = 960 + Math.cos(a) * 520, ey = 620 + Math.sin(a) * -1 * 0 + 120 + Math.abs(Math.sin(a)) * -60;
      return <svg key={i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}><path d={`M960 640 Q ${(960 + ex) / 2} ${560} ${ex} ${ey}`} stroke="#b0472f" strokeWidth={5} fill="none" /><circle cx={ex} cy={ey} r={14} fill="#5fae4a" /></svg>; })}
    {Array.from({ length: 6 }, (_, i) => <Berry key={i} x={760 + i * 80} y={780} s={0.32 * cl(fr * 1.4 - i * 0.12)} rot={-10 + i * 5} />)}
    <div style={{ position: "absolute", left: 1500, top: 260, width: 60, height: 420, borderRadius: 30, background: "rgba(255,255,255,.08)" }}><div style={{ position: "absolute", left: 10, right: 10, bottom: 10, height: `${fr * 95}%`, borderRadius: 20, background: fr > 0.5 ? GRN : RED }} /></div>
    <div style={{ position: "absolute", left: 1460, top: 700, fontWeight: 900, fontSize: 30, color: DIM }}>FUERZA</div>
    <Tag tt={tt} at={3.4} x={960} y={930} txt="PARA COMER: CORTAS · PARA HACER PLANTAS: LOS DEJAS" col={AMB} size={34} />
  </>;
}}</Stage>;

// ---- 25:30 · EL AGUA DE PLÁTANO: cáscaras en un frasco, 2 días; el potasio sube y la fresa se pone roja y dulce ----
export const HBanana: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const steep = eio(tt, 0.8, 2.8), red = eio(tt, 3.0, 4.6);
  return <>
    <Head tt={tt} kick="UNA VEZ AL MES" title="AGUA DE CÁSCARAS DE PLÁTANO" col={AMB} />
    <div style={{ position: "absolute", left: 360, top: 300, width: 340, height: 480, borderRadius: "40px 40px 30px 30px", background: "rgba(220,240,255,.12)", border: "4px solid rgba(255,255,255,.35)" }}>
      <div style={{ position: "absolute", left: 6, right: 6, bottom: 6, height: "78%", borderRadius: 24, background: `rgba(${Math.round(200 - 60 * steep)},${Math.round(220 - 90 * steep)},${Math.round(240 - 170 * steep)},.5)` }} />
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 50 + i * 70, top: 170 + i * 60, width: 200, height: 50, borderRadius: "50% 50% 40% 40%", background: `linear-gradient(180deg, ${steep > 0.5 ? "#8a6a2a" : "#f2d24a"}, #b08a2a)`, transform: `rotate(${30 - i * 25}deg)` }} />)}
    </div>
    <div style={{ position: "absolute", left: 420, top: 820, fontWeight: 900, fontSize: 40, color: AMB }}>1 LITRO · 2 DÍAS</div>
    <Arrow x1={760} y1={540} x2={1020} y2={540} p={cl((tt - 2.6) * 2)} />
    <Big x={890} y={470} txt="K" s={phys(tt, 2.8, 6, 0.5)} col={AMB} size={80} />
    <Berry x={1350} y={540} s={1.4} ripe={0.3 + 0.7 * red} glow={red * 0.4} />
    <Tag tt={tt} at={4.0} x={1350} y={830} txt="DULCE Y CON COLOR" col={RED} size={44} />
  </>;
}}</Stage>;

// ---- 26:00 · MUCHO NITRÓGENO: estiércol fresco = hojas enormes, fresas poquitas; compost = equilibrio ----
export const HNitro: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const g = eio(tt, 0.6, 2.8);
  return <>
    <Head tt={tt} kick="LO QUE NO LE DAS" title="ESTIÉRCOL FRESCO: TODO HOJA" col={RED} />
    {[0, 1].map((b) => { const x = b ? 1380 : 540; return <React.Fragment key={b}>
      <Pot x={x} y={600} w={360} h={260}>{null}</Pot>
      <Plant x={x} y={618} s={b ? 1.0 : 1.0 + 0.9 * g} leaves={b ? 7 : 9} berries={b ? Math.round(5 * g) : 1} />
      <Tag tt={tt} at={0.9 + b * 0.6} x={x} y={920} txt={b ? "COMPOST: FRESAS" : "ESTIÉRCOL FRESCO: HOJAS"} col={b ? GRN : RED} size={36} />
      {b ? <Ok x={x + 220} y={330} p={cl((tt - 3.4) / 0.5)} /> : <X x={x} y={420} p={cl((tt - 3.0) / 0.5)} s={150} />}
    </React.Fragment>; })}
  </>;
}}</Stage>;

// ---- 26:25 · LA CAMA DE PAJA: la fresa apoyada en tierra mojada se pudre; sobre paja, limpia ----
export const HStraw: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const rot = eio(tt, 1.0, 3.0), st = phys(tt, 2.2, 6, 0.5);
  return <>
    <Head tt={tt} kick="«STRAWBERRY»" title="LA FRUTA DE LA PAJA" col={AMB} />
    {[0, 1].map((b) => { const x = b ? 1380 : 540; return <React.Fragment key={b}>
      <div style={{ position: "absolute", left: x - 300, top: 640, width: 600, height: 200, background: `linear-gradient(180deg, ${b ? SOIL : "#3a2818"}, ${SOIL2})`, borderRadius: 10 }} />
      {b === 1 && Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: x - 280 + rnd(i) * 560, top: 612 + rnd(i + 3) * 30 + (1 - st) * -200, width: 90, height: 6, borderRadius: 3, background: rnd(i + 1) > 0.5 ? "#e6c66e" : "#c9a24c", transform: `rotate(${(rnd(i + 7) - 0.5) * 50}deg)`, opacity: cl(st * 2) }} />)}
      <Berry x={x} y={560} s={0.6} rot={84} />
      {b === 0 && <div style={{ position: "absolute", left: x - 70, top: 590, width: 140, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(70,60,40,.9), rgba(120,110,80,.6) 50%, transparent 70%)", opacity: rot }} />}
      <Tag tt={tt} at={1.2 + b * 1.0} x={x} y={900} txt={b ? "SOBRE PAJA SECA, 2-3 DEDOS" : "EN TIERRA MOJADA: SE PUDRE"} col={b ? GRN : RED} size={34} />
    </React.Fragment>; })}
  </>;
}}</Stage>;

// ---- 27:05 · LAS VISITAS: el caracol avanza de noche y frena en el anillo de cáscara de huevo; la red y el disco para los pájaros ----
export const HVisitors: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const sx = 200 + Math.min(eio(tt, 0.4, 2.4), 1) * 300, net = phys(tt, 2.8, 6, 0.55), disc = tt * 2.4;
  return <>
    <Head tt={tt} kick="CARACOLES Y PÁJAROS" title="SIN VENENO" col={GRN} />
    <Pot x={960} y={520} w={420} h={320}>{null}</Pot>
    <Plant x={960} y={538} s={1} leaves={7} berries={3} />
    <div style={{ position: "absolute", left: 640, top: 830, width: 640, height: 40, borderRadius: "50%", background: "repeating-radial-gradient(circle, #f2ecdc 0 4px, #d9cfb8 4px 8px)", opacity: cl((tt - 0.6) * 2) }} />
    <div style={{ position: "absolute", left: sx, top: 800 }}>
      <div style={{ position: "absolute", left: 0, top: 30, width: 130, height: 34, borderRadius: "20px 40px 10px 10px", background: "#c9a98a" }} />
      <div style={{ position: "absolute", left: 20, top: -20, width: 80, height: 70, borderRadius: "50%", background: "repeating-radial-gradient(circle at 45% 55%, #8a5a2a 0 8px, #b07a40 8px 16px)" }} />
      <div style={{ position: "absolute", left: 120, top: 10, width: 4, height: 26, background: "#c9a98a", transform: "rotate(20deg)" }} />
    </div>
    {tt > 2.4 && <X x={sx + 150} y={830} p={cl((tt - 2.4) / 0.4)} s={70} />}
    <svg viewBox="0 0 600 340" style={{ position: "absolute", left: 660, top: 220 + (1 - net) * -300, width: 600, height: 340, opacity: cl(net * 2) }}><path d="M0 340 Q300 -60 600 340" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth={3} />{Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${i * 40} 340 Q300 ${-60 + i * 2} ${600 - i * 40} 340`} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth={2} />)}</svg>
    <div style={{ position: "absolute", left: 1459, top: 280, width: 3, height: 140, background: "#888", opacity: cl((tt - 3.6) * 2) }} />
    <div style={{ position: "absolute", left: 1400, top: 410, width: 120, height: 120, borderRadius: "50%", background: `conic-gradient(from ${disc * 60}deg, #c0c8ff, #ffd6f0, #c8ffe8, #fff0b8, #c0c8ff)`, transform: `scaleX(${Math.cos(disc)})`, boxShadow: `0 0 ${30 * Math.abs(Math.sin(disc))}px rgba(255,255,255,.7)`, opacity: cl((tt - 3.6) * 2) }} />
    <Tag tt={tt} at={1.4} x={400} y={940} txt="CÁSCARA DE HUEVO MOLIDA" col={GRN} size={30} />
    <Tag tt={tt} at={3.2} x={960} y={170} txt="RED FINA SOBRE PALITOS" col={ICE} size={30} />
    <Tag tt={tt} at={4.0} x={1460} y={600} txt="ALGO QUE BRILLE" col={AMB} size={30} />
  </>;
}}</Stage>;

// ---- 27:55 · CORTAR LAS PRIMERAS FLORES: un mes de paciencia; la planta engorda y después da el doble ----
export const HFlowers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const snip = cl((tt - 1.2) / 0.6), grow = eio(tt, 2.2, 4.0), fr = eio(tt, 3.6, 5.0);
  const Flower: React.FC<{ x: number; y: number; s: number; op: number }> = ({ x, y, s, op }) => <div style={{ position: "absolute", left: x, top: y, opacity: op, transform: `scale(${s})` }}>{[0, 72, 144, 216, 288].map((a) => <div key={a} style={{ position: "absolute", left: -18, top: -38, width: 36, height: 40, borderRadius: "50%", background: "#fbfbf6", transform: `rotate(${a}deg)`, transformOrigin: "50% 95%" }} />)}<div style={{ position: "absolute", left: -12, top: -12, width: 24, height: 24, borderRadius: "50%", background: "#f2c230" }} /></div>;
  return <>
    <Head tt={tt} kick="PARECE UNA LOCURA" title="LAS PRIMERAS FLORES SE CORTAN" col={AMB} />
    <Pot x={700} y={600} w={380} h={280}>{null}</Pot>
    <Plant x={700} y={618} s={0.9 + 0.5 * grow} leaves={5 + Math.round(4 * grow)} />
    {[0, 1, 2].map((i) => <Flower key={i} x={600 + i * 100} y={470 - i * 20} s={1} op={1 - cl(snip * 3 - i)} />)}
    <div style={{ position: "absolute", left: 1110, top: 260, width: 640, height: 560, borderRadius: 24, background: "rgba(255,255,255,.05)", border: "2px solid rgba(255,255,255,.12)" }} />
    <div style={{ position: "absolute", left: 1150, top: 740, width: 560, height: 4, background: "rgba(255,255,255,.4)" }} />
    <div style={{ position: "absolute", left: 1150, top: 300, width: 600, height: 440 }}>
      {[["CON FLORES YA", 0.35, RED], ["UN MES SIN FLORES", 1, GRN]].map(([n, v, c], i) => <div key={i} style={{ position: "absolute", left: i * 300, bottom: 0, width: 220 }}>
        <div style={{ height: 360 * (v as number) * (i ? fr : cl(tt - 2.6)), background: c as string, borderRadius: 12, opacity: 0.85 }} />
        <div style={{ marginTop: 14, fontWeight: 900, fontSize: 34, color: TX, lineHeight: 1.05 }}>{n as string}</div>
      </div>)}
    </div>
    <Tag tt={tt} at={4.4} x={1450} y={880} txt="MÁS FRESAS Y MÁS GRANDES" col={GRN} size={36} />
  </>;
}}</Stage>;

// ---- 28:35 · EL INVIERNO: la planta pierde hojas, le cortas las secas, paja sobre la corona; en primavera vuelve con más fuerza ----
export const HWinter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const w = eio(tt, 0.4, 1.6) * (1 - eio(tt, 3.8, 4.8)), straw = phys(tt, 2.2, 6, 0.5) * (1 - eio(tt, 3.8, 4.4)), spring = eio(tt, 4.0, 5.4);
  return <>
    <Head tt={tt} kick="NO SE MUERE" title="DESCANSA" col={ICE} />
    <div style={{ position: "absolute", inset: 0, background: `rgba(160,200,255,${0.1 * w})` }} />
    {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * 1920, top: (rnd(i + 2) * 1080 + tt * 80 * (0.5 + rnd(i + 4))) % 1080, width: 8, height: 8, borderRadius: "50%", background: "#eef7ff", opacity: w * 0.7 }} />)}
    <Pot x={960} y={600} w={420} h={300}>{null}</Pot>
    <Plant x={960} y={618} s={1.1} p={1} leaves={Math.round(3 + 6 * (1 - w) * (0.4 + 0.6 * spring))} berries={Math.round(3 * spring)} />
    {Array.from({ length: 18 }, (_, i) => <div key={i} style={{ position: "absolute", left: 880 + rnd(i) * 160, top: 590 + rnd(i + 1) * 20 - (1 - straw) * 200, width: 70, height: 6, background: "#e6c66e", transform: `rotate(${(rnd(i + 5) - 0.5) * 60}deg)`, opacity: cl(straw * 2) }} />)}
    <Tag tt={tt} at={1.0} x={480} y={420} txt="HOJAS SECAS: SE CORTAN" col={ICE} size={32} />
    <Tag tt={tt} at={2.4} x={480} y={480} txt="PAJA SOBRE LA CORONA" col={AMB} size={32} />
    <Tag tt={tt} at={2.8} x={480} y={540} txt="RIEGO MUY POCO" col={DIM} size={32} />
    <Tag tt={tt} at={4.4} x={1450} y={420} txt="PRIMAVERA: MÁS FUERTE" col={GRN} size={40} />
    <Big x={1450} y={560} txt="3-4 AÑOS" s={phys(tt, 4.8, 6, 0.6)} col={GRN} size={70} />
  </>;
}}</Stage>;

// ---- 29:40 · ¿CONGELADAS?: el hielo crece dentro de la semilla y la parte por dentro ----
export const HFrozen: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const ice = eio(tt, 0.6, 2.8), crack = cl((tt - 2.8) / 0.6);
  return <>
    <Head tt={tt} kick="LA PREGUNTA QUE MÁS ME LLEGA" title="¿FUNCIONA CON CONGELADAS?" col={ICE} />
    <div style={{ position: "absolute", left: 760, top: 300, width: 400, height: 520, borderRadius: "50% 50% 46% 46% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 30%, #fff3b8, #e9c35a 55%, #a7782a)", boxShadow: "0 30px 60px rgba(0,0,0,.5)", overflow: "hidden" }}>
      {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: 200, top: 260, width: 220 * ice, height: 6, background: "linear-gradient(90deg, #ffffff, #bfe6ff)", transform: `rotate(${i * 51}deg)`, transformOrigin: "0 50%", boxShadow: "0 0 10px #bfe6ff" }} />)}
      <div style={{ position: "absolute", left: 200 - 110 * ice, top: 260 - 110 * ice, width: 220 * ice, height: 220 * ice, borderRadius: "50%", background: "radial-gradient(circle, rgba(220,245,255,.7), transparent 70%)" }} />
    </div>
    <svg viewBox="0 0 400 520" style={{ position: "absolute", left: 760, top: 300, width: 400, height: 520, overflow: "visible" }}><path d="M200 0 L230 120 L180 220 L240 330 L190 520" stroke="#2a1a08" strokeWidth={8} fill="none" strokeDasharray={600} strokeDashoffset={600 * (1 - crack)} /></svg>
    <Big x={420} y={560} txt="−18°" s={phys(tt, 0.6, 6, 0.5)} col={ICE} size={110} />
    <Berry x={1480} y={520} s={0.7} ripe={0.85} rot={8} />
    <div style={{ position: "absolute", left: 1450, top: 480, width: 60, height: 60, borderRadius: "50%", border: `5px solid ${ICE}` }} />
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, overflow: "visible" }}><path d="M1450 510 L1160 520" stroke={ICE} strokeWidth={4} strokeDasharray="10 10" /></svg>
    <Tag tt={tt} at={0.9} x={1480} y={760} txt="UNA SEMILLA, AUMENTADA" col={ICE} size={30} />
    <Tag tt={tt} at={3.4} x={960} y={900} txt="CASI NUNCA · FRESCA Y MADURA" col={RED} size={44} />
  </>;
}}</Stage>;

// ---- 30:10 · EL BALCÓN: 10 macetas × medio a un kilo = fresas para el postre todo el verano ----
export const HYield: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const k = eio(tt, 0.6, 3.4), kg = 5 + 5 * eio(tt, 2.0, 4.4);
  return <>
    <Head tt={tt} kick="CUÁNTO DA" title="10 PLANTAS EN UN BALCÓN" col={RED} />
    <div style={{ position: "absolute", left: 160, top: 760, width: 1600, height: 14, background: "#8b8b93" }}>{Array.from({ length: 30 }, (_, j) => <div key={j} style={{ position: "absolute", left: j * 54, top: -140, width: 8, height: 140, background: "#8b8b93" }} />)}</div>
    {Array.from({ length: 10 }, (_, i) => { const x = 260 + i * 156, p = cl(k * 1.8 - i * 0.08); return <div key={i} style={{ opacity: cl(p * 2) }}>
      <Pot x={x} y={620} w={130} h={120}>{null}</Pot>
      <Plant x={x} y={630} s={0.45} leaves={5} berries={p > 0.9 ? 3 : 0} />
    </div>; })}
    <Big x={960} y={330} txt={`${kg.toFixed(0)} KG`} s={phys(tt, 2.0, 6, 0.6)} col={RED} size={130} />
    <Tag tt={tt} at={3.0} x={960} y={440} txt="½ A 1 KG POR PLANTA · REPARTIDO EN SEMANAS" col={AMB} size={34} />
    <Tag tt={tt} at={4.4} x={960} y={900} txt="FRESAS PARA EL POSTRE TODO EL VERANO" col={GRN} size={42} />
  </>;
}}</Stage>;
