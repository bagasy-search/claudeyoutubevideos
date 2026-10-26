import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona, CENTURION } from "./persona";
import { C, fontFamily, ent, prog, Escena, Cielo, Estrellas, Astro, Colinas, Chip, Grande, MapaPuntos, Tienda, Zzz, Particulas, Emote, cabeza } from "./kit";
import { Gladius, Escudo, Pilum, Casco, Armadura, Item, Mula, Fuerte, Muro, Arco, Soldadito, Calor } from "./kit2";
import { Cuenta } from "./P1";
import { Campamento, Ruta, Tablero, pose, PlazaArmas, CarpaInterior, Multitud, EnMano } from "./kit3";
import { EspadaMano, PalaMano, MazoMano, HachaMano, BARBARO, Fogonazo, Marcador, Banco } from "./P2";

// Parte 3 (253,76-361,98 s): trampa 3, la marcha, el campamento de cada noche y la constructora más grande del mundo antiguo.
const L = (x: number, y: number, h: number) => cabeza(x, y, h);
// intendente: viejo, sin casco, túnica verde (no se confunde con Lucius)
const INTENDENTE = { tunica: "#5c8f3e", tunica2: "#3a6224", cinto: "#5a3418", piel: "#f2b48a", piel2: "#d98d66", pelo: "#8a8580" };
const Suelo: React.FC<{ y?: number; a?: string; b?: string }> = ({ y = 860, a = "#c9773a", b = "#7a4a20" }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, bottom: 0, background: `linear-gradient(180deg, ${a}, ${b})` }} />
);
// balanza de equipaje colgante: la aguja suma pieza por pieza
const Balanza: React.FC<{ kg: number; x: number; y: number; lab?: string }> = ({ kg, x, y, lab }) => {
  const a = -130 + Math.min(kg, 30) / 30 * 260;
  return (<>
    <svg style={{ position: "absolute", left: x - 170, top: y - 260, overflow: "visible" }} width={340} height={560}>
      <line x1={170} y1={-300} x2={170} y2={40} stroke="#6b3a1f" strokeWidth={10} />
      <path d="M 150 40 Q 170 10 190 40 L 190 60 L 150 60 Z" fill="#7d8796" />
      <circle cx={170} cy={200} r={150} fill="#fff8ec" stroke="#2a1530" strokeWidth={14} />
      {Array.from({ length: 7 }, (_, i) => { const r = ((-130 + i * 260 / 6) - 90) * Math.PI / 180; return <g key={i}><line x1={170 + Math.cos(r) * 120} y1={200 + Math.sin(r) * 120} x2={170 + Math.cos(r) * 138} y2={200 + Math.sin(r) * 138} stroke="#2a1530" strokeWidth={8} /><text x={170 + Math.cos(r) * 92} y={212 + Math.sin(r) * 92} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={26} fill="#2a1530">{i * 5}</text></g>; })}
      <line x1={170} y1={200} x2={170 + Math.cos((a - 90) * Math.PI / 180) * 118} y2={200 + Math.sin((a - 90) * Math.PI / 180) * 118} stroke={C.rojo} strokeWidth={12} strokeLinecap="round" />
      <circle cx={170} cy={200} r={18} fill="#2a1530" />
    </svg>
    <div style={{ position: "absolute", left: x, top: y + 150, transform: "translateX(-50%)", padding: "6px 26px", borderRadius: 18, background: "#2a1530", border: "5px solid #fff", fontFamily, fontWeight: 700, fontSize: 48, color: "#fff", whiteSpace: "nowrap", textAlign: "center", lineHeight: 1.1 }}>
      {lab && <div style={{ fontSize: 34, color: C.ambar }}>{lab}</div>}{kg.toFixed(1)} KG
    </div>
  </>);
};
// íconos de los enemigos verdaderos
const Icono: React.FC<{ k: "calor" | "ampolla" | "tobillo" | "agua"; t: number }> = ({ k, t }) => (
  <svg width={260} height={260} viewBox="-130 -130 260 260">
    {k === "calor" && <g><circle r={70} fill="#ffb020" />{Array.from({ length: 12 }, (_, i) => <rect key={i} x={-8} y={-120} width={16} height={36} rx={8} fill="#ff7a3d" transform={`rotate(${i * 30 + t * 30})`} />)}<path d="M -30 -10 Q -20 -20 -10 -10 M 10 -10 Q 20 -20 30 -10 M -26 26 Q 0 10 26 26" stroke="#7a3a14" strokeWidth={8} fill="none" strokeLinecap="round" /></g>}
    {k === "ampolla" && <g><path d="M -70 -110 L -10 -110 L -10 40 Q 60 40 90 70 Q 100 100 60 104 L -70 104 Z" fill="#f2b48a" stroke="#c9805a" strokeWidth={8} /><ellipse cx={30} cy={70} rx={30 + Math.sin(t * 5) * 4} ry={24} fill="#ffd6c8" stroke={C.rojo} strokeWidth={8} /></g>}
    {k === "tobillo" && <g><path d="M -40 -110 L 20 -110 L 20 20 Q 90 30 100 80 L -40 90 Z" fill="#f2b48a" stroke="#c9805a" strokeWidth={8} /><path d="M -60 -10 L -20 10 L -50 30 L 0 60" stroke={C.rojo} strokeWidth={12} fill="none" strokeLinejoin="round" strokeLinecap="round" /><circle cx={0} cy={20} r={60} fill="none" stroke={C.rojo} strokeWidth={6} strokeDasharray="10 12" transform={`rotate(${t * 90})`} /></g>}
    {k === "agua" && <g><path d="M -70 -60 L 70 -60 L 56 100 L -56 100 Z" fill="#c9773a" /><ellipse cx={0} cy={-60} rx={70} ry={18} fill="#7a8a3a" />{[0, 1, 2].map((i) => <circle key={i} cx={Math.cos(t * 4 + i * 2) * 60} cy={-100 + Math.sin(t * 5 + i) * 20} r={8} fill="#2a1530" />)}</g>}
  </svg>
);
const Carta: React.FC<{ t: number; t0: number; x: number; y: number; k: "calor" | "ampolla" | "tobillo" | "agua"; label: string; rot?: number; s?: number }> = ({ t, t0, x, y, k, label, rot = 0, s = 1 }) => {
  if (t < t0) return null;
  const e = ent(t, t0);
  return (
    <div style={{ position: "absolute", left: x - 170, top: y - 210, width: 340, height: 420, borderRadius: 30, background: "#fff8ec", border: "8px solid #2a1530", boxShadow: "14px 16px 0 rgba(20,8,40,.35)", transform: `scale(${e * s}) rotate(${rot + (1 - e) * 20}deg)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <Icono k={k} t={t} />
      <div style={{ fontFamily, fontWeight: 700, fontSize: 40, color: C.rojo, marginTop: 6 }}>{label}</div>
    </div>
  );
};
export const Pala: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <svg style={{ position: "absolute", left: x - 100 * s, top: y - 400 * s, overflow: "visible", transform: `rotate(${rot}deg)` }} width={200 * s} height={800 * s} viewBox="-100 -400 200 800">
    <rect x={-14} y={-390} width={28} height={520} rx={12} fill="#8a5a2a" />
    <rect x={-50} y={-400} width={100} height={30} rx={14} fill="#6b3a1f" />
    <path d="M -90 120 L 90 120 L 80 300 Q 0 400 -80 300 Z" fill="#8a93a3" stroke="#5d6577" strokeWidth={10} />
    <path d="M -60 160 Q -64 260 -30 320" stroke="#fff" strokeOpacity={0.5} strokeWidth={12} fill="none" strokeLinecap="round" />
  </svg>
);
const Grua: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => {
  const sube = (t * 0.35) % 1;
  return (
    <>
      <svg style={{ position: "absolute", left: x - 300, top: y - 700, overflow: "visible" }} width={600} height={700}>
        <path d="M 140 700 L 300 60 L 460 700" stroke="#8a5a2a" strokeWidth={26} fill="none" strokeLinejoin="round" />
        <line x1={210} y1={420} x2={390} y2={420} stroke="#7a4a22" strokeWidth={16} />
        <line x1={300} y1={60} x2={600} y2={0} stroke="#8a5a2a" strokeWidth={22} />
        <line x1={590} y1={4} x2={590} y2={560 - sube * 400} stroke="#e8d8b8" strokeWidth={6} />
        <rect x={520} y={560 - sube * 400} width={140} height={90} rx={4} fill="#c9b8a0" stroke="#8a7a64" strokeWidth={6} />
        <line x1={540} y1={590 - sube * 400} x2={640} y2={590 - sube * 400} stroke="#8a7a64" strokeWidth={4} />
        <circle cx={300} cy={560} r={150} fill="none" stroke="#6b3a1f" strokeWidth={22} />
        {Array.from({ length: 10 }, (_, i) => { const a = i * 36 + t * 70; return <line key={i} x1={300} y1={560} x2={300 + Math.cos(a * Math.PI / 180) * 150} y2={560 + Math.sin(a * Math.PI / 180) * 150} stroke="#8a5a2a" strokeWidth={10} />; })}
        <circle cx={300} cy={560} r={22} fill="#4a2a12" />
      </svg>
      <Persona x={x} y={y - 20} h={240} t={t} seed={3} casco="legion" camina={1.6} inclina={10} />
    </>
  );
};
// la columna sigue de largo al fondo mientras él se sienta
const FilaLejanaRuta: React.FC<{ t: number }> = ({ t }) => <>{Array.from({ length: 6 }, (_, i) => <Soldadito key={i} x={1180 + i * 130 + (t - 306.8) * 90} y={880} s={1.0} t={t + i * 0.3} seed={170 + i} avanza={1} />)}</>;
// bloque de piedra en las manos (brazo levantado: el bloque queda sobre la cabeza)
const PiedraMano: React.FC = () => <g><rect x={-110} y={10} width={220} height={110} rx={14} fill="#c9b8a0" stroke="#8a7a64" strokeWidth={9} /><line x1={-60} y1={40} x2={20} y2={40} stroke="#a8967c" strokeWidth={7} /></g>;

// ── FURCA: el palo al hombro con cada cosa colgando de una cuerda y su etiqueta (las cosas caen del cielo y se balancean)
type Carga = React.ComponentProps<typeof Item>["k"];
const FURCA: [number, Carga, string][] = [
  [273.54, "olla", "POT"], [274.46, "sierra", "SAW"], [275.2, "cesta", "BASKET"], [276.82, "pico", "PICKAXE"], [277.72, "hoz", "SICKLE"],
  [278.72, "saco", "CLOTHES"], [280.22, "cadena", "CHAIN"], [281.54, "estaca", "2 STAKES"], [283.32, "grano", "GRAIN"],
];
const Furca: React.FC<{ t: number; x0: number; y0: number; ang: number; len: number; items: [number, Carga, string][]; paso?: number; s?: number; d0?: number; etiquetas?: boolean }> = ({ t, x0, y0, ang, len, items, paso = 145, s = 0.6, d0 = 260, etiquetas }) => {
  const a = (ang * Math.PI) / 180;
  return (
    <>
      <div style={{ position: "absolute", left: x0, top: y0 - 12, width: len, height: 24, borderRadius: 12, background: "#8a5a2a", boxShadow: "0 5px 0 #5a3418", transform: `rotate(${ang}deg)`, transformOrigin: "0 50%" }} />
      {items.map(([t0, k, lab], i) => {
        if (t < t0 - 0.3) return null;
        const cae = prog(t, t0 - 0.3, t0);
        const d = d0 + i * paso;
        const px = x0 + d * Math.cos(a), py = y0 + d * Math.sin(a);
        if (cae < 1) return <Item key={k} k={k} x={px} y={interpolate(cae, [0, 1], [-260, py + 88])} s={s} />;
        const sw = Math.sin((t - t0) * 7 + i) * 10 * Math.exp(-(t - t0) * 0.9) + Math.sin(t * 4 + i) * 2;
        return (
          <div key={k} style={{ position: "absolute", inset: 0, transform: `rotate(${sw}deg)`, transformOrigin: `${px}px ${py}px` }}>
            <div style={{ position: "absolute", left: px - 3, top: py, width: 6, height: 30, background: "#5a3418" }} />
            <Item k={k} x={px} y={py + 88} s={s} />
            {etiquetas && <div style={{ position: "absolute", left: px - 110, width: 220, top: py + 150 + (i % 2) * 46, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 34, color: "#fff", WebkitTextStroke: "7px #2a1530", paintOrder: "stroke fill" }}>{lab}</div>}
          </div>
        );
      })}
    </>
  );
};
// medidor horizontal de carga
const Carga: React.FC<{ f: number; x: number; y: number; txt?: string }> = ({ f, x, y, txt = "LOAD" }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 560, height: 70, display: "flex", alignItems: "center", gap: 14, fontFamily, fontWeight: 700 }}>
    <div style={{ fontSize: 44, color: "#fff", WebkitTextStroke: "7px #2a1530", paintOrder: "stroke fill" }}>{txt}</div>
    <div style={{ position: "relative", flex: 1, height: 52, borderRadius: 26, background: "rgba(42,21,48,.85)", border: "6px solid #fff", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.min(1, f) * 100}%`, background: f > 0.8 ? C.rojo : f > 0.5 ? C.ambar : C.lima }} />
    </div>
  </div>
);
// persona con el palo al hombro (coordenadas del palo derivadas de la cabeza)
const ConFurca: React.FC<{ t: number; x: number; y: number; h: number; n: number; items: [number, Carga, string][]; len: number; paso?: number; d0?: number; s?: number; etiquetas?: boolean; expr?: React.ComponentProps<typeof Persona>["expr"]; camina?: number; inclina?: number; seed?: number }> = ({ t, x, y, h, n, items, len, paso, d0, s, etiquetas, expr = "neutro", camina = 0, inclina = 0, seed = 1 }) => {
  const S = h / 560;
  const x0 = x - 10 * S, y0 = y - 318 * S + n * 4;
  return <>
    <Persona x={x} y={y + n * 4} h={h} t={t} seed={seed} casco="legion" giro="34" expr={expr} camina={camina} inclina={inclina} bD={115} cD={85} />
    <Furca t={t} x0={x0} y0={y0} ang={-7 + n * 1.1} len={len} items={items} paso={paso} d0={d0} s={s} etiquetas={etiquetas} />
  </>;
};

export const P3: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* 068 · trampa tres: la marcha */}
    <Escena t={t} t0={253.76} t1={256.14} entra="corte" golpes={[254.04, 255.24]}>
      <Tablero t={t} t0={253.4} en={2} de={1} tAvanza={253.9} marca={255.0} hecho={2} />
      <Chip t={t} t0={254.04} text="TRAP 3 OF 7" color={C.rojo} x={760} y={170} centro size={64} />
      <Grande t={t} t0={255.24} text="THE MARCH" x={900} y={400} size={130} />
    </Escena>

    {/* 069 · ¿qué llevás encima? — el equipo entero cae a sus pies */}
    <Escena t={t} t0={256.14} t1={257.96} entra="zoom" golpes={[257.56]}>
      <PlazaArmas t={t} />
      <Persona x={700} y={1000} h={680} t={t} seed={1} expr="sorpresa" mira={0.5} miraY={0.4} bD={30} cD={60} reaccion="ojos" reaccionT0={257.1} />
      <Emote t={t} t0={256.3} tipo="preg" {...L(700, 1000, 680)} s={1.5} />
      {([["Casco", 1100, 960], ["Escudo", 1310, 910], ["Pilum", 1300, 990], ["Gladius", 1180, 1010]] as const).map(([k, x, y], i) => {
        const e = ent(t, 256.2 + i * 0.22);
        if (e <= 0) return null;
        return <div key={k} style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - e) * -500}px)` }}>
          {k === "Casco" && <Casco x={x} y={y} s={0.7} />}
          {k === "Escudo" && <Escudo x={x} y={y} s={0.6} rot={80} />}
          {k === "Pilum" && <Pilum x={x} y={y} s={0.7} rot={-8} />}
          {k === "Gladius" && <Gladius x={x} y={y} s={0.45} rot={95} />}
        </div>;
      })}
      <Chip t={t} t0={256.3} text="WHAT ARE YOU CARRYING?" color={C.ambar} tinta={C.noche} x={1000} y={300} centro size={58} />
    </Escena>

    {/* 070-072 · el intendente pesa cada pieza (la balanza marca SÓLO esa pieza: armadura = 9 kg) y se la tira; cada una queda PUESTA */}
    <Escena t={t} t0={257.96} t1={268.66} zoom={0.04} entra="barrido" golpes={[258.48, 260.26, 263.62, 265.9, 267.04, 267.94]}>
      <PlazaArmas t={t} dx={(t - 258) * 12} />
      {(() => {
        const h = 680, x = 560, y = 1000, c = L(x, y, h), s = c.s;
        const PZ: [number, number, string][] = [[258.48, 2, "HELMET"], [259.32, 9, "ARMOR ALONE"], [263.62, 8, "SHIELD"], [265.9, 4, "2 JAVELINS"], [267.04, 1.5, "SWORD"], [267.94, 0.8, "DAGGER"]];
        const T = PZ.map((p) => p[0]);
        let iz = -1;
        PZ.forEach(([tt], i) => { if (t > tt - 0.35) iz = i; });
        const prev = iz > 0 ? PZ[iz - 1][1] : 0;
        const kgP = iz < 0 ? 0 : prev + (PZ[iz][1] - prev) * prog(t, PZ[iz][0] - 0.35, PZ[iz][0]);
        const total = PZ.reduce((a, [tt, k]) => a + (t > tt ? k : 0), 0);
        const ox = 1330, oy = 560;
        const vuela = (t0: number, tx: number, ty: number) => { const k = prog(t, t0 - 0.35, t0); return { x: interpolate(k, [0, 1], [ox, tx]), y: interpolate(k, [0, 1], [oy, ty]) - Math.sin(k * Math.PI) * 160 }; };
        const tiro = T.find((tt) => t > tt - 0.85 && t < tt + 0.3);
        const casco = vuela(258.48, c.x, c.y - 60 * s);
        const esc = vuela(263.62, x - 170 * s, c.y + 330 * s);
        const p1 = vuela(265.9, x + 190 * s, c.y + 120 * s);
        const gl = vuela(267.04, x + 120 * s, c.y + 440 * s);
        const golpe = T.reduce((a, tt) => a + (t > tt ? Math.exp(-(t - tt) * 8) : 0), 0);
        const conEsc = t > 263.62, conPila = t > 265.9;
        return <>
          <Persona x={1440} y={980} h={600} t={t} seed={9} ropa={INTENDENTE} casco="no" viejo flip giro="34" expr="orgullo" {...(tiro ? pose("lanzar", t - (tiro - 0.85)) : { bD: 20, bI: 15 })} />
          <Persona x={x} y={y + total * 1.2 + golpe * 10} h={h} t={t} seed={1} casco={t > 259.32 ? "legion" : "no"} expr={total > 18 ? "miedo" : total > 8 ? "neutro" : "orgullo"}
            reaccion={t > 260.26 && t < 263.0 ? "ojos" : undefined} reaccionT0={260.26} inclina={total * 0.3}
            bD={conPila ? 30 : 40 - Math.min(total, 20)} cD={conPila ? 60 : 40} bI={conEsc ? 35 : 40} cI={conEsc ? 50 : 30}
            agarraI={conEsc ? <EnMano.escudo /> : undefined} agarraAngI={0} agarra={conPila ? <EnMano.lanza /> : undefined} agarraAng={-80} />
          {t > 258.13 && t < 259.32 && <Casco x={casco.x} y={casco.y} s={0.8} />}
          {t > 258.97 && t < 259.32 && (() => { const k = prog(t, 258.97, 259.32); return <Armadura x={interpolate(k, [0, 1], [ox, c.x])} y={interpolate(k, [0, 1], [oy, c.y + 200 * s]) - Math.sin(k * Math.PI) * 160} s={interpolate(k, [0, 1], [0.6, 0.42 * s])} />; })()}
          {t > 263.27 && !conEsc && <Escudo x={esc.x} y={esc.y - 60} s={0.75 * s} rot={-4} />}
          {t > 265.55 && !conPila && [0, 1].map((i) => <Pilum key={i} x={p1.x + i * 24} y={p1.y + i * 20} s={0.85} rot={-74} />)}
          {t > 266.69 && <Gladius x={gl.x} y={gl.y} s={0.55} rot={170} />}
          {t > 267.94 && <Gladius x={x + 60 * s} y={c.y + 470 * s} s={0.32} rot={190} t={t} t0={267.94} />}
          {golpe > 0.3 && <Fogonazo x={c.x + 40} y={c.y + 220 * s} k={1 - golpe} s={0.8} />}
          <Balanza kg={kgP} x={1000} y={330} lab={iz >= 0 ? PZ[iz][2] : "EMPTY"} />
          {t > 265.9 && <Marcador x={1000} y={640} txt={`TOTAL: ${total.toFixed(1)} KG`} color={C.rojo} size={44} />}
          <Emote t={t} t0={265.0} tipo="sudor" {...c} s={1.3} />
        </>;
      })()}
      <Chip t={t} t0={258.48} t1={259.1} text="HELMET" color={C.ambar} tinta={C.noche} x={160} y={140} size={56} />
      <Chip t={t} t0={259.32} t1={263.3} text="ARMOR" color={C.teal} tinta={C.noche} x={160} y={140} size={56} />
      <Chip t={t} t0={263.62} t1={265.6} text="SHIELD = TALL AS YOUR TORSO" color={C.violeta} x={160} y={140} size={46} />
      <Chip t={t} t0={265.9} t1={266.75} text="2 JAVELINS" color={C.rojo} x={160} y={140} size={56} />
      <Chip t={t} t0={267.04} t1={267.65} text="SWORD" color={C.ambar} tinta={C.noche} x={160} y={140} size={56} />
      <Chip t={t} t0={267.94} text="+ DAGGER" color={C.ambar} tinta={C.noche} x={160} y={140} size={56} />
    </Escena>

    {/* 073 · y eso es sólo la parte de pelear: le cae el palo de la furca sobre el hombro y se dobla */}
    <Escena t={t} t0={268.66} t1={270.3} entra="corte" golpes={[269.5]}>
      <PlazaArmas t={t} dx={(t - 268.6) * 40} />
      {(() => {
        const k = prog(t, 269.25, 269.5), x = 560, y = 1000, h = 660, S = h / 560;
        const golpe = t > 269.5 ? Math.exp(-(t - 269.5) * 6) : 0;
        const x0 = x - 30 * S, y0 = y - 318 * S;
        return <>
          <Escudo x={x - 150} y={880} s={0.55} rot={-4} />
          <Persona x={x} y={y + golpe * 24} h={h} t={t} seed={1} casco="legion" expr={t > 269.5 ? "miedo" : "orgullo"} inclina={4 + (t > 269.5 ? 6 : 0) + golpe * 6} bD={t > 269.5 ? 115 : 20} cD={t > 269.5 ? 85 : 30} />
          <Pilum x={x + 230} y={720} s={0.7} rot={-80} />
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${(k - 1) * 700}px)` }}>
            <Furca t={t} x0={x0} y0={y0} ang={-7} len={760} items={[[0, "saco", ""], [0, "olla", ""]]} d0={560} paso={150} />
          </div>
          {golpe > 0.2 && <Fogonazo x={x0 + 40} y={y0} k={1 - golpe} s={0.7} />}
        </>;
      })()}
      <Grande t={t} t0={269.04} text="JUST THE FIGHTING PART" x={960} y={160} size={80} color="#fff" borde={C.rojo} />
      <Chip t={t} t0={269.5} text="+ THE OTHER LOAD" color={C.ambar} tinta={C.noche} x={1360} y={300} centro size={52} />
    </Escena>

    {/* 074-075 · en el palo al hombro: olla, sierra, cesta, pico, hoz, bolso de ropa — cada cosa cae con su etiqueta */}
    <Escena t={t} t0={270.3} t1={279.76} zoom={0.03} entra="corte" golpes={[270.8, 273.54, 274.46, 275.2, 276.82, 277.72, 278.72]}>
      <Ruta t={t} hora="dia" verde={false} avance={(t - 270) * 70} />
      {(() => {
        const n = FURCA.filter(([tt]) => t > tt).length;
        return <>
          <ConFurca t={t} x={420} y={975} h={580} paso={100} d0={190} s={0.5} n={n} items={FURCA.slice(0, 6)} len={1130} etiquetas expr={n > 3 ? "miedo" : n > 0 ? "neutro" : "orgullo"} camina={0.7} inclina={3 + n * 1.1} />
          <Emote t={t} t0={277.0} tipo="sudor" {...L(420, 975, 580)} s={1.1} />
          <Carga f={n / 9} x={1220} y={110} />
        </>;
      })()}
      <Chip t={t} t0={270.8} t1={273.2} text="ON A WOODEN POLE" color={C.tierra} x={160} y={140} size={54} />
      {([[273.54, "COOKING POT"], [274.46, "SAW"], [275.2, "BASKET"], [276.82, "PICKAXE"], [277.72, "SICKLE"], [278.72, "BAG OF CLOTHES"]] as const).map(([t0, txt], i, a) => (
        <Chip key={txt} t={t} t0={t0} t1={a[i + 1] ? a[i + 1][0] - 0.32 : undefined} text={txt} color={C.violeta} x={160} y={140} size={56} />
      ))}
    </Escena>

    {/* 076 · cadena, dos estacas y varios días de grano: el palo se comba, la carga llega al rojo */}
    <Escena t={t} t0={279.76} t1={284.34} zoom={0.04} entra="corte" golpes={[280.22, 281.54, 283.32]}>
      <Ruta t={t} hora="tarde" verde={false} avance={(t - 270) * 70} />
      {(() => {
        const n = FURCA.filter(([tt]) => t > tt).length;
        return <>
          <ConFurca t={t} x={420} y={975} h={580} paso={100} d0={190} s={0.5} n={n} items={FURCA} len={1130} etiquetas expr="miedo" camina={0.5} inclina={3 + n * 1.1} />
          <Emote t={t} t0={280.4} tipo="sudor" {...L(420, 1010, 580)} s={1.1} />
          {t > 283.32 && <Emote t={t} t0={283.4} tipo="susto" {...L(420, 1011, 580)} s={1.1} />}
          <Carga f={n / 9} x={1220} y={110} txt={n >= 9 ? "FULL" : "LOAD"} />
        </>;
      })()}
      <Chip t={t} t0={280.22} t1={281.2} text="CHAIN" color={C.violeta} x={160} y={140} size={60} />
      <Chip t={t} t0={281.54} t1={283.0} text="2 WOODEN STAKES" color={C.violeta} x={160} y={140} size={60} />
      <Chip t={t} t0={283.32} text="+ DAYS OF GRAIN" color={C.rojo} x={160} y={140} size={60} />
    </Escena>

    {/* 077 · fácil 30 kilos, quizás más */}
    <Escena t={t} t0={284.34} t1={289.1} zoom={0.05} entra="corte" golpes={[286.78, 287.98]}>
      <Campamento t={t} hora="tarde" tropa={false} />
      <Persona x={250} y={1020} h={600} t={t} seed={1} casco="legion" expr={t > 287.98 ? "miedo" : "sorpresa"} mira={0.6} {...(t > 287.98 ? pose("temblar", t) : {})} />
      <svg style={{ position: "absolute", left: 360, top: 520 }} width={1200} height={500}>
        <rect x={580} y={60} width={40} height={420} fill="#5a3418" />
        <g transform={`rotate(${-12 * prog(t, 286.4, 287.0) - (t > 287.98 ? 4 : 0)} 600 60)`}>
          <rect x={60} y={44} width={1080} height={30} rx={14} fill="#8a5a2a" />
          <path d="M 120 74 L 60 220 L 300 220 L 240 74" fill="none" stroke="#c9a46a" strokeWidth={6} />
          <path d="M 960 74 L 900 220 L 1140 220 L 1080 74" fill="none" stroke="#c9a46a" strokeWidth={6} />
          <rect x={50} y={210} width={260} height={30} rx={10} fill="#e9a92a" />
          <rect x={890} y={210} width={260} height={30} rx={10} fill="#e9a92a" />
        </g>
        <rect x={460} y={470} width={280} height={30} rx={10} fill="#3a2010" />
      </svg>
      <Item k="saco" x={540} y={interpolate(prog(t, 286.4, 287.0), [0, 1], [640, 700])} s={1.1} />
      <Item k="olla" x={460} y={interpolate(prog(t, 286.4, 287.0), [0, 1], [640, 700])} s={0.8} />
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 1290 + i * 34, top: interpolate(prog(t, 286.4, 287.0), [0, 1], [610, 530]) - i * 54, width: 160 - i * 30, height: 54, borderRadius: 8, background: "#5d6577", border: "5px solid #3d4452", fontFamily, fontWeight: 700, fontSize: 30, color: "#fff", textAlign: "center", lineHeight: "44px" }}>10</div>)}
      <Chip t={t} t0={284.66} text="HISTORIANS ARGUE..." color={C.violeta} x={160} y={140} size={54} />
      <Cuenta t={t} t0={286.78} t1={287.3} de={0} a={30} x={960} y={300} size={260} color="#fff" suf=" KG" />
      <Chip t={t} t0={287.98} text="MAYBE MORE" color={C.rojo} x={1300} y={440} size={60} />
    </Escena>

    {/* 078 · los soldados se decían «las mulas de Mario»: él y la mula, cargados igual, caminan al mismo paso */}
    <Escena t={t} t0={289.1} t1={292.38} entra="corte" golpes={[291.42, 292.06]}>
      <Ruta t={t} avance={(t - 289) * 260} />
      <Mula x={1300} y={800} s={1.1} t={t} camina={1.4} carga />
      <ConFurca t={t} x={500} y={1010} h={560} n={2} items={[[0, "saco", ""], [0, "olla", ""], [0, "cesta", ""]]} len={520} d0={240} paso={120} s={0.55} expr={t > 292.06 ? "triste" : "neutro"} camina={1.4} inclina={8} />
      <Chip t={t} t0={289.4} text="THEIR NICKNAME:" color={C.violeta} x={160} y={140} size={56} />
      <Grande t={t} t0={289.86} text="MARIUS'S MULES" y={330} size={120} color="#fff" borde={C.rojo} />
    </Escena>

    {/* 079 · seis horas, en julio, en una ruta de Siria */}
    <Escena t={t} t0={292.38} t1={297.34} zoom={0.05} entra="corte" golpes={[294.22, 295.28, 296.66]}>
      <Ruta t={t} verde={false} avance={(t - 292) * 220} />
      <Astro x={1500} y={250} r={150} />
      <Calor t={t} y={560} op={0.4} />
      {Array.from({ length: 5 }, (_, i) => <Soldadito key={i} x={1000 + i * 170} y={920 + (i % 2) * 14} s={1.3} t={t} seed={50 + i} avanza={1} />)}
      <ConFurca t={t} x={640} y={1010} h={560} n={3} items={[[0, "saco", ""], [0, "olla", ""], [0, "cesta", ""]]} len={520} d0={240} paso={120} s={0.55} expr="triste" camina={1.2} inclina={9} />
      <Emote t={t} t0={293.0} tipo="sudor" {...L(640, 1022, 560)} />
      <Marcador x={1500} y={480} txt={`${Math.min(6, 1 + Math.floor(prog(t, 292.6, 296.9) * 6))} / 6 HOURS`} color={C.rojo} size={44} />
      <Chip t={t} t0={294.22} text="6 HOURS" color={C.rojo} x={160} y={140} size={56} />
      <Chip t={t} t0={295.28} text="JULY" color={C.ambar} tinta={C.noche} x={160} y={250} size={56} />
      <Chip t={t} t0={296.66} text="SYRIA" color={C.violeta} x={160} y={360} size={56} />
      <Particulas t={t} tipo="polvo" n={30} seed={86} />
    </Escena>

    {/* 080 · el enemigo real no era un bárbaro con hacha */}
    <Escena t={t} t0={297.34} t1={301.04} entra="corte" golpes={[299.54, 300.38]}>
      <Ruta t={t} verde={false} avance={(t - 297) * 200} />
      <Astro x={1000} y={200} r={120} />
      <Calor t={t} y={560} op={0.35} />
      <ConFurca t={t} x={500} y={1010} h={600} n={3} items={[[0, "saco", ""], [0, "olla", ""], [0, "cesta", ""]]} len={540} d0={240} paso={125} s={0.58} expr="neutro" camina={1.2} inclina={8} />
      <Persona x={1400} y={985} h={600} t={t} seed={79} ropa={BARBARO} flip giro="34" expr="enojado" bD={150 + Math.sin(t * 6) * 15} cD={30} bI={30} agarra={<EnMano.garrote />} agarraAng={-70}
        reaccion={t > 299.8 ? "derrite" : undefined} reaccionT0={299.8} opacity={1 - 0.45 * prog(t, 299.9, 300.6)} />
      {t > 299.54 && <svg style={{ position: "absolute", left: 1150, top: 420 }} width={500} height={500}><path d="M 50 50 L 450 450 M 450 50 L 50 450" stroke={C.rojo} strokeWidth={52} strokeLinecap="round" strokeDasharray={1140} strokeDashoffset={1140 * (1 - prog(t, 299.54, 299.85))} /></svg>}
      <Chip t={t} t0={297.62} text="THE REAL ENEMY?" color={C.violeta} x={160} y={140} size={58} />
      <Chip t={t} t0={299.54} text="NOT A BARBARIAN" color={C.rojo} x={1400} y={300} centro size={54} />
    </Escena>

    {/* 081 · calor, ampollas, tobillo torcido y agua sucia */}
    <Escena t={t} t0={301.04} t1={306.78} zoom={0.04} entra="sube" banda={C.ambar} golpes={[301.3, 301.98, 303.08, 304.18]}>
      <Ruta t={t} verde={false} avance={Math.min(t, 303.08) * 200} />
      <Astro x={1180} y={180} r={120} />
      <Calor t={t} y={560} op={0.4} />
      {(() => {
        const tropieza = t > 303.08 && t < 304.18, bebe = t > 304.18;
        const y = 1020 + (tropieza ? 14 : 0) + (bebe ? 60 * prog(t, 304.18, 304.6) : 0);
        return <>
          {t > 304.0 && <div style={{ position: "absolute", left: 790, top: 990, width: 300 * ent(t, 304.0), height: 60, marginLeft: -150 * ent(t, 304.0) + 150, borderRadius: "50%", background: "radial-gradient(ellipse, #8a9a3a, #5a6a20)" }} />}
          <Persona x={600} y={Math.min(y, 1040)} h={660} t={t} seed={1} casco="legion" expr={bebe ? "triste" : tropieza ? "miedo" : "neutro"} camina={t < 303.08 ? 1.3 : 0} inclina={bebe ? 36 : tropieza ? 16 : 6} bD={bebe ? 120 : tropieza ? 70 : undefined} bI={tropieza ? 70 : undefined} cD={bebe ? 60 : undefined} />
          <Emote t={t} t0={301.4} tipo="sudor" {...L(600, 1020, 660)} s={1.3} />
          {tropieza && <Emote t={t} t0={303.1} tipo="susto" {...L(600, 1020, 660)} s={1.3} />}
        </>;
      })()}
      <div style={{ position: "absolute", left: 1010, top: 330, width: 60, height: 360, borderRadius: 30, background: "#fff", border: "8px solid #2a1530", overflow: "hidden" }}><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${30 + 70 * prog(t, 301.3, 302.2)}%`, background: C.rojo }} /></div>
      <div style={{ position: "absolute", left: 1000, top: 680, width: 80, height: 80, borderRadius: 40, background: C.rojo, border: "8px solid #2a1530" }} />
      <Carta t={t} t0={301.3} x={1440} y={330} k="calor" label="HEAT" rot={-4} s={0.6} />
      <Carta t={t} t0={301.98} x={1720} y={330} k="ampolla" label="BLISTERS" rot={3} s={0.6} />
      <Carta t={t} t0={303.08} x={1440} y={640} k="tobillo" label="ANKLE" rot={-2} s={0.6} />
      <Carta t={t} t0={304.18} x={1720} y={640} k="agua" label="DIRTY WATER" rot={4} s={0.6} />
      <Chip t={t} t0={305.48} text="TOO THIRSTY TO CARE" color={C.violeta} x={160} y={140} size={56} />
    </Escena>

    {/* 082 · y cuando por fin parás, ¿descansás? */}
    <Escena t={t} t0={306.78} t1={309.3} entra="barrido" golpes={[308.66]}>
      <Ruta t={t} hora="tarde" verde={false} />
      <FilaLejanaRuta t={t} />
      <Banco x={900} y={1000} w={240} piedra />
      {(() => { const sienta = t > 307.7; const x = interpolate(prog(t, 306.78, 307.7), [0, 1], [560, 900]);
        return <>
          <Persona x={x} y={1000} h={620} t={t} seed={1} casco="legion" giro={sienta ? "frente" : "34"} postura={sienta ? "sentado" : "parado"} camina={sienta ? 0 : 1.2} expr={t > 308.2 ? "feliz" : "triste"} inclina={sienta ? -6 : 8} bD={20} bI={20}
            reaccion={sienta && t < 308.6 ? "derrite" : undefined} reaccionT0={307.7} />
          <Emote t={t} t0={307.0} t1={307.7} tipo="sudor" {...L(x, 1000, 620)} />
          <Emote t={t} t0={308.66} tipo="preg" {...L(900, 1068, 620)} s={1.3} />
        </>; })()}
      <Chip t={t} t0={307.66} text="YOU FINALLY STOP" color={C.teal} tinta={C.noche} x={160} y={140} size={56} />
      <Chip t={t} t0={308.66} text="REST?" color={C.ambar} tinta={C.noche} x={1300} y={300} size={70} />
    </Escena>

    {/* 083 · claro que no: se sienta en una piedra, el centurión llega con la pala y se la planta en la mano; el campamento se levanta de la nada */}
    <Escena t={t} t0={309.3} t1={315.24} zoom={0.03} entra="corte" golpes={[309.76, 312.92, 314.5]}>
      <Cielo tipo="noche" />
      <Estrellas t={t} n={80} seed={89} alto={600} />
      <Astro x={260} y={180} r={70} luna />
      <Colinas capas={["#3a2a6a", "#2a1d5a"]} base={660} seed={90} alto={60} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, bottom: 0, background: "#3a2a1a" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scaleY(${prog(t, 312.6, 314.4)})`, transformOrigin: "50% 860px" }}>
        <Fuerte x={960} y={650} s={0.85} w={1700} />
      </div>
      {(() => {
        const llega = prog(t, 309.3, 309.75);
        const sentado = t > 309.75 && t < 311.05;
        const px = interpolate(llega, [0, 1], [520, 700]);
        const cx = interpolate(prog(t, 309.8, 310.8), [0, 1], [1700, 1060]);
        const tiene = t > 311.05, cava = t > 312.0;
        const P = cava ? pose("cavar", t, 1.4) : tiene ? { bD: 60, cD: 50, bI: 20, cI: 20, inclina: 0 } : { bD: 20, cD: 10, bI: 20, cI: 10, inclina: 0 };
        return <>
          <Banco x={720} y={985} w={230} piedra />
          <Persona x={px} y={985} h={540} t={t} seed={1} casco="legion" giro="34" postura={sentado ? "sentado" : "parado"} expr={cava ? "triste" : sentado ? "feliz" : "neutro"} camina={llega < 1 ? 1.4 : 0}
            reaccion={tiene && !cava ? "mandibula" : undefined} reaccionT0={311.05} {...P}
            agarra={tiene ? <EnMano.pala /> : undefined} agarraAng={cava ? 75 + Math.sin(t * Math.PI * 2 * 1.4) * 20 : 95} />
          {sentado && <Zzz x={820} y={520} t={t} />}
          <Persona x={cx} y={985} h={600} t={t} seed={7} ropa={CENTURION} casco="centurion" giro="34" flip expr="enojado" camina={t > 309.8 && t < 310.8 ? 1.5 : 0}
            bD={t > 310.7 && t < 311.1 ? 85 : t > 311.1 ? 100 : 30} cD={t > 311.1 ? 10 : 50} bI={30} cI={40}
            agarra={t < 311.05 ? <EnMano.pala /> : undefined} agarraAng={t > 310.7 ? 70 : -80} />
          {t > 311.05 && t < 311.4 && <Fogonazo x={880} y={760} k={prog(t, 311.05, 311.4)} s={0.6} />}
        </>;
      })()}
      <Particulas t={t} tipo="brasas" n={24} seed={91} />
      <Grande t={t} t0={309.5} text="OF COURSE NOT" y={140} size={96} color="#fff" borde={C.rojo} />
      <Chip t={t} t0={310.44} text="EVERY SINGLE NIGHT" color={C.violeta} x={960} y={270} centro size={48} />
      <Chip t={t} t0={314.5} text="FROM NOTHING" color={C.rojo} x={1500} y={380} centro size={54} />
    </Escena>

    {/* 084-086 · cava la zanja (la tierra vuela al muro), sube al muro y clava las dos estacas */}
    <Escena t={t} t0={315.24} t1={323.02} zoom={0.04} entra="corte" golpes={[315.66, 318.44, 319.88, 322.32]}>
      <Cielo tipo="noche" />
      <Estrellas t={t} n={50} seed={92} alto={500} />
      <Astro x={1700} y={160} r={50} luna />
      {(() => {
        const zanja = 0.25 + 0.75 * prog(t, 315.24, 317.2), muro = 0.25 + 0.75 * prog(t, 316.0, 319.0);
        const arriba = t > 319.06;
        const estacas = Array.from({ length: 7 }, (_, i) => prog(t, 319.5 + i * 0.4, 319.7 + i * 0.4));
        const tierra = `M 0 760 L 640 760 L 700 ${760 + zanja * 200} L 1000 ${760 + zanja * 200} L 1060 760 L 1920 760 L 1920 1080 L 0 1080 Z`;
        const wy = (x: number) => 760 - muro * 150 * Math.max(0, 1 - ((x - 1300) / 240) ** 2);
        const vel = 1.4, k = ((t - 315.24) * vel) % 1;
        return <>
          <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
            <path d={`M 1060 760 Q 1300 ${760 - muro * 300} 1540 760 Z`} fill="#8a5a2a" />
            <path d={tierra} fill="#6b3a1f" />
            <path d="M 0 760 L 640 760" stroke="#5a8a3a" strokeWidth={16} />
            <path d="M 1540 760 L 1920 760" stroke="#5a8a3a" strokeWidth={16} />
          </svg>
          {/* otros legionarios cavando el mismo foso más allá */}
          <Persona x={330} y={770} h={360} t={t} seed={141} casco="legion" expr="triste" {...pose("cavar", t + 0.3, 1.3)} manoD={<PalaMano />} />
          {estacas.map((e, i) => e > 0 && (
            <div key={i} style={{ position: "absolute", left: 1330 + i * 26, top: interpolate(e, [0, 1], [-200, wy(1343 + i * 26) - 120]), width: 22, height: 140, background: "#c9a46a", border: "5px solid #6b3a1f", clipPath: "polygon(0 12%, 50% 0, 100% 12%, 100% 100%, 0 100%)" }} />
          ))}
          {!arriba && <>
            <Persona x={850} y={760 + zanja * 200 + 10} h={470} t={t} seed={1} casco="legion" expr="enojado" {...pose("cavar", t, vel)} manoD={<PalaMano />} />
            {[0, 1].map((j) => { const q = (k + j * 0.5) % 1; const x = interpolate(q, [0, 1], [960, 1300]), y = interpolate(q, [0, 1], [760 + zanja * 120, wy(1300) - 20]) - Math.sin(q * Math.PI) * 260; return <div key={j} style={{ position: "absolute", left: x - 26, top: y - 20, width: 52, height: 40, borderRadius: "45%", background: "#7a4a22", opacity: q < 0.95 ? 1 : 0 }} />; })}
          </>}
          {arriba && <>
            <Persona x={1210} y={wy(1210) + 6} h={470} t={t} seed={1} casco="legion" expr="enojado" {...pose("martillar", t, 1.6)} manoD={<MazoMano />} />
            {((t * 1.6) % 1) > 0.2 && ((t * 1.6) % 1) < 0.32 && <Fogonazo x={1330} y={wy(1330) - 110} k={(((t * 1.6) % 1) - 0.2) / 0.12} s={0.6} />}
          </>}
        </>;
      })()}
      <Particulas t={t} tipo="polvo" n={24} seed={93} />
      <Marcador x={1620} y={150} txt={`SHOVELFULS: ${Math.max(0, Math.floor((t - 315.3) * 1.4 * 2))}`} size={44} />
      <Chip t={t} t0={315.66} t1={317.3} text="DIG A DITCH" color={C.ambar} tinta={C.noche} x={160} y={140} size={56} />
      <Chip t={t} t0={317.66} t1={319.5} text="EARTH → WALL" color={C.tierra} x={160} y={140} size={56} />
      <Chip t={t} t0={319.88} text="PLANT YOUR 2 STAKES" color={C.rojo} x={160} y={140} size={56} />
    </Escena>

    {/* 087 · recién ahí clava la estaca de la carpa de cuero, con siete hombres más y una mula */}
    <Escena t={t} t0={323.02} t1={328.94} zoom={0.04} entra="corte" golpes={[325.74, 326.6, 328.08]}>
      <Cielo tipo="noche" />
      <Estrellas t={t} n={60} seed={94} alto={500} />
      <Astro x={1640} y={180} r={60} luna />
      <div style={{ position: "absolute", inset: 0, opacity: 0.55 }}><Fuerte x={960} y={640} s={0.6} w={1900} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, bottom: 0, background: "#3a2a1a" }} />
      {t < 326.5 && [[1500, 900], [1650, 930]].map(([x, y], i) => <Persona key={i} x={x} y={y} h={300} t={t} seed={150 + i} casco="legion" expr="triste" {...pose("martillar", t + i * 0.3, 1.5)} manoD={<MazoMano />} />)}
      <div style={{ position: "absolute", inset: 0, transform: `scaleY(${0.14 + 0.86 * prog(t, 323.9, 325.5)})`, transformOrigin: "1000px 820px" }}><Tienda x={1000} y={600} s={2.8} /></div>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><line x1={600} y1={690} x2={430} y2={985} stroke="#e8d8b8" strokeWidth={6} opacity={prog(t, 323.9, 325.5)} /><rect x={420} y={950 + Math.min(1, (t - 323.02) * 0.6) * 25} width={22} height={60} fill="#c9a46a" stroke="#6b3a1f" strokeWidth={5} /></svg>
      <Persona x={330} y={1010} h={460} t={t} seed={1} casco="legion" expr={t > 325.6 ? "orgullo" : "enojado"} {...(t < 325.6 ? pose("martillar", t, 1.6) : { bD: 10 })} manoD={t < 325.6 ? <MazoMano /> : undefined} />
      <Multitud t={t} n={7} filas={2} x0={640} x1={1380} y={1000} h={360} seed={87} aparece={326.6} expr="triste" poses={["quieto", "brazos", "cadera"]} />
      <Mula x={1480} y={840} s={0.8} t={t} t0={328.08} />
      <Chip t={t} t0={323.68} text="ONLY THEN" color={C.violeta} x={160} y={140} size={56} />
      <Chip t={t} t0={325.46} text="LEATHER TENT" color={C.tierra} x={1100} y={260} size={56} />
      <Chip t={t} t0={326.6} text="+ 7 MEN" color={C.rojo} x={1300} y={380} size={60} />
      <Chip t={t} t0={328.08} text="+ 1 MULE" color={C.ambar} tinta={C.noche} x={1300} y={500} size={60} />
    </Escena>

    {/* 088 · ocho soldados en una carpa, todas las noches, 25 años: por dentro, sentados codo a codo y dormidos; uno cabecea y arrastra a todos */}
    <Escena t={t} t0={328.94} t1={333.06} entra="zoom" golpes={[329.92, 331.6]}>
      <CarpaInterior t={t} />
      <Banco x={960} y={975} w={1380} />
      {Array.from({ length: 8 }, (_, i) => {
        const x = 400 + i * 160, yo = i === 3;
        const domino = prog(t, 331.7 + Math.abs(i - 3) * 0.09, 331.95 + Math.abs(i - 3) * 0.09);
        const lado = i < 3 ? -1 : 1;
        return <Persona key={i} x={x} y={975} h={430} t={t + i * 0.4} seed={yo ? 1 : 140 + i} casco={yo ? "legion" : "no"} postura="sentado" giro={i % 3 === 1 ? "34" : "frente"} flip={i > 3}
          expr={yo && t > 331.7 ? "sorpresa" : "dormido"} ladea={(i % 2 ? 9 : -9) + domino * 26 * lado} inclina={domino * 8 * lado} bI={10} bD={10} />;
      })}
      <Zzz x={1300} y={520} t={t} />
      <Zzz x={560} y={540} t={t + 0.7} />
      <Grande t={t} t0={329.08} text="8 IN ONE TENT" y={150} size={110} color="#fff" />
      <Chip t={t} t0={331.6} text="x 9,125 NIGHTS" color={C.violeta} x={160} y={280} size={54} />
      <Cuenta t={t} t0={331.6} t1={332.2} de={1} a={25} x={1560} y={320} size={120} color={C.oro} suf=" YRS" />
    </Escena>

    {/* 089 · a la mañana desarmás todo y lo hacés de nuevo (timelapse de 3 días) */}
    <Escena t={t} t0={333.06} t1={336.88} zoom={0.04} entra="corte" golpes={[334.82, 336.34]}>
      {(() => {
        const f = (t - 333.06) / 1.27, ph = f - Math.floor(f), dia = Math.min(3, Math.floor(f) + 1);
        const arma = ph < 0.5 ? prog(ph, 0.05, 0.4) : 1 - prog(ph, 0.6, 0.95);
        const sol = Math.sin(ph * Math.PI);
        return <>
          <Cielo tipo="atardecer" />
          <AbsoluteFill style={{ background: "linear-gradient(180deg,#5fb4ec,#bfe6fa)", opacity: sol }} />
          <Astro x={300 + ph * 1320} y={700 - sol * 520} r={90} />
          <Colinas capas={["#7fb06a", "#5a9050"]} base={660} seed={95} alto={60} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 860, bottom: 0, background: "#6b3a1f" }} />
          <div style={{ position: "absolute", inset: 0, transform: `scaleY(${arma})`, transformOrigin: "50% 860px" }}><Fuerte x={960} y={650} s={0.85} w={1700} /></div>
          <AbsoluteFill style={{ background: "#0e0a2a", opacity: (1 - sol) * 0.45 }} />
          <Marcador x={1640} y={150} txt={`DAY ${dia}`} size={56} />
        </>;
      })()}
      {Array.from({ length: 5 }, (_, i) => <Soldadito key={i} x={interpolate(t, [333, 336.9], [700, 1400]) + i * 150 - 300} y={950} s={1.3} t={t} seed={90 + i} avanza={1} />)}
      <Persona x={330} y={1010} h={500} t={t} seed={1} casco="legion" expr="triste" {...pose("cavar", t, 1.8)} manoD={<PalaMano />} />
      {t > 336.0 && <svg width={400} height={400} style={{ position: "absolute", left: 760, top: 300, transform: `rotate(${(t - 336) * 400}deg) scale(${ent(t, 336.0)})` }}>
        <path d="M 200 40 A 160 160 0 1 1 60 120" stroke="#fff" strokeWidth={36} fill="none" strokeLinecap="round" />
        <path d="M 20 60 L 70 150 L 120 70 Z" fill="#fff" />
      </svg>}
      <Chip t={t} t0={333.14} text="TOMORROW MORNING" color={C.violeta} x={160} y={140} size={54} />
      <Chip t={t} t0={334.1} text="TEAR IT ALL DOWN" color={C.rojo} x={160} y={250} size={54} />
      <Chip t={t} t0={336.34} text="AGAIN" color={C.ambar} tinta={C.noche} x={960} y={500} centro size={56} />
    </Escena>

    {/* 090 · y sin guerra tampoco descansás: festeja, le cae la pala, a cavar */}
    <Escena t={t} t0={336.88} t1={340.06} entra="corte" golpes={[337.72, 339.26]}>
      <Cielo tipo="dia" />
      <Astro x={1500} y={220} r={90} />
      <Colinas capas={["#7fb06a", "#5a9050"]} base={680} seed={96} alto={60} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scaleY(${0.45 + 0.55 * prog(t, 336.9, 340.0)})`, transformOrigin: "50% 760px" }}>
        <Fuerte x={1380} y={560} s={0.7} w={1100} piedra />
      </div>
      <Suelo y={760} a="#8aba6a" b="#5a8a3a" />
      <Grua t={t} x={1700} y={880} />
      <Multitud t={t} n={4} filas={1} x0={1000} x1={1500} y={820} h={230} seed={90} accion="martillar" vel={1.4} giro="34" />
      {(() => {
        const tiene = t > 339.4;
        return <>
          <Persona x={600} y={960} h={600} t={t} seed={1} casco="legion" giro={tiene ? "34" : "frente"} expr={t > 339.26 ? "triste" : "feliz"} {...(tiene ? pose("cavar", t, 1.4) : pose("festejar", t, 1.6))} salta={337.8}
            reaccion={t > 339.4 && t < 339.9 ? "ojos" : undefined} reaccionT0={339.4} agarra={tiene ? <EnMano.pala /> : undefined} agarraAng={75 + Math.sin(t * Math.PI * 2 * 1.4) * 20} />
          <Emote t={t} t0={337.8} t1={339.1} tipo="brillos" {...L(700, 985, 560)} />
          {!tiene && t > 338.9 && <Pala x={760} y={interpolate(prog(t, 338.9, 339.4), [0, 1], [-400, 600])} s={0.55} rot={12} />}
        </>;
      })()}
      <Chip t={t} t0={337.72} text="NO WAR" color={C.lima} tinta={C.noche} x={160} y={140} size={60} />
      <Chip t={t} t0={339.26} text="STILL NO REST" color={C.rojo} x={160} y={250} size={60} />
    </Escena>

    {/* 091 · Roma usaba sus legiones como la constructora más grande del mundo antiguo */}
    <Escena t={t} t0={340.06} t1={344.5} zoom={0.05} entra="corte" golpes={[341.98]}>
      <Cielo tipo="atardecer" />
      <Colinas capas={["#8a3a7a", "#6a2a6a"]} base={640} seed={99} alto={50} />
      <Fuerte x={1320} y={660} s={0.8} w={1000} piedra />
      <Grua t={t} x={500} y={880} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 870, bottom: 0, background: "#6b3a1f" }} />
      {Array.from({ length: 3 }, (_, i) => <Soldadito key={i} x={1300 + i * 170} y={950} s={1.1} t={t} seed={60 + i} avanza={1} />)}
      <Persona x={interpolate(t, [340.06, 344.5], [820, 1060])} y={1010} h={500} t={t} seed={1} casco="legion" expr="triste" camina={1.2} bD={172} bI={172} cD={10} cI={10} manoD={<PiedraMano />} />
      <Chip t={t} t0={340.38} t1={341.6} text="ROME USED ITS LEGIONS AS..." color={C.violeta} x={160} y={140} size={48} />
      <Grande t={t} t0={341.98} text="ROME CONSTRUCTION CO." y={160} size={78} color="#fff" borde={C.rojo} />
    </Escena>

    {/* 092 · los soldados construían las rutas por las que marchaban: pone cada adoquín */}
    <Escena t={t} t0={344.5} t1={346.72} entra="corte" golpes={[345.22]}>
      <Cielo tipo="dia" />
      <Colinas capas={["#7fb06a", "#5a9050"]} base={640} seed={97} alto={60} />
      <Suelo y={820} a="#8aba6a" b="#5a8a3a" />
      {Array.from({ length: 14 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: i * 140, top: 860, width: 132, height: 100, borderRadius: 10, background: i % 2 ? "#b5ad9e" : "#9a9284", transform: `scale(${i < 6 ? 1 : ent(t, 344.6 + (i - 6) * 0.22)})` }} />
      ))}
      {Array.from({ length: 4 }, (_, i) => <Soldadito key={i} x={interpolate(t, [344.5, 346.72], [100, 500]) + i * 170} y={890} s={1.3} t={t} seed={70 + i} avanza={1} />)}
      <Persona x={interpolate(t, [344.5, 346.72], [1000, 1300])} y={900} h={480} t={t} seed={1} casco="legion" expr="enojado" {...pose("martillar", t, 1.8)} manoD={<MazoMano />} />
      <Chip t={t} t0={345.22} text="THEY BUILT THE ROADS" color={C.violeta} x={160} y={140} size={58} />
    </Escena>

    {/* 093 · puentes, canales, fuertes y acueductos: cuatro obras, en cada una un legionario trabajando */}
    <Escena t={t} t0={346.72} t1={350.16} entra="corte" golpes={[346.8, 347.9, 348.82, 349.08]}>
      <AbsoluteFill style={{ background: "#1b1240" }} />
      {([[346.8, "BRIDGES", "#4fb3e8", 0], [347.9, "CANALS", "#2ec4d6", 1], [348.82, "FORTS", "#c9773a", 2], [349.08, "AQUEDUCTS", "#9b7bf0", 3]] as const).map(([t0, txt, col, i]) => {
        const x = (i % 2) * 960, y = Math.floor(i / 2) * 540;
        const on = t >= t0, e = on ? ent(t, t0) : 0;
        return (
          <div key={txt} style={{ position: "absolute", left: x, top: y, width: 960, height: 540, overflow: "hidden", background: "linear-gradient(180deg,#5fb4ec,#cfeefa)", border: `8px solid ${on ? col : "#2a1530"}`, boxSizing: "border-box" }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "scale(0.5)", transformOrigin: "0 0" }}>
              {i === 0 && <><div style={{ position: "absolute", left: 0, right: 0, top: 1000, bottom: 0, background: "#2f86b0" }} /><Arco x={960} y={1060} n={4} alto={260} />
                <Persona x={1000} y={880} h={620} t={t} seed={1} casco="legion" giro="34" postura="agachado" expr="enojado" {...pose("martillar", t, 1.6)} agarra={<EnMano.martillo />} agarraAng={-40 + Math.max(0, Math.sin(t * Math.PI * 2 * 1.6)) * 90} /></>}
              {i === 1 && <><div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: "#7fb06a" }} /><div style={{ position: "absolute", left: -100, top: 420, width: 2200, height: 240, background: "#2f86b0", transform: "rotate(-8deg)", border: "26px solid #b5a48a" }} />
                <Persona x={760} y={1040} h={700} t={t} seed={1} casco="legion" giro="34" flip expr="triste" {...pose("cavar", t, 1.4)} agarra={<EnMano.pala />} agarraAng={75 + Math.sin(t * Math.PI * 2 * 1.4) * 20} /></>}
              {i === 2 && <><Fuerte x={1100} y={720} s={0.9} w={1500} piedra /><div style={{ position: "absolute", left: 0, right: 0, top: 820, bottom: 0, background: "#c9a060" }} />
                <Persona x={560} y={1050} h={600} t={t} seed={1} casco="legion" giro="perfil" expr="miedo" camina={1.2} bD={172} bI={172} cD={10} cI={10} manoD={<PiedraMano />} /></>}
              {i === 3 && <><Arco x={1100} y={560} n={5} alto={520} /><div style={{ position: "absolute", left: 0, right: 0, top: 850, bottom: 0, background: "#8aba6a" }} />
                <Persona x={560} y={1040} h={700} t={t} seed={1} casco="legion" giro="perfil" expr="enojado" {...pose("empujar", t, 1)} />
                <div style={{ position: "absolute", left: 790 + Math.sin(t * 2) * 10, top: 820, width: 300, height: 220, background: "#c9b8a0", border: "11px solid #8a7a64", borderRadius: 14 }} /></>}
            </div>
            {!on && <AbsoluteFill style={{ background: "rgba(27,18,64,.72)" }} />}
            {on && <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", top: 40, fontFamily, fontWeight: 700, fontSize: 64, color: "#fff", WebkitTextStroke: "8px #2a1530", paintOrder: "stroke fill", transform: `scale(${e})` }}>{txt}</div>}
          </div>
        );
      })}
    </Escena>

    {/* 094-095 · la Muralla de Adriano, 73 millas de piedra, hecha por legionarios */}
    <Escena t={t} t0={350.16} t1={356.74} zoom={0.04} entra="corte" golpes={[350.64, 351.32, 355.4]}>
      {t < 352.6
        ? <><MapaPuntos t={t} pulsa={["BRITAIN"]} t0Pulsa={350.64} vuela={{ n: "BRITAIN", z: 2.4, t: [350.2, 351.8] }} />
          <Persona x={330} y={1000} h={470} t={t} seed={1} casco="legion" expr="miedo" bD={115} cD={20} mira={0.6} miraY={-0.3} /></>
        : <>
          <Cielo tipo="dia" />
          <Colinas capas={["#7fb06a", "#5a9050", "#3a7040"]} base={560} seed={98} alto={110} />
          <Muro x={-40} y={760} w={2000} h={200} t={t} t0={352.7} d={2.2} />
          {Array.from({ length: 4 }, (_, i) => <Soldadito key={i} x={900 + i * 260} y={900} s={1.3} t={t} seed={80 + i} />)}
          <Persona x={interpolate(t, [352.6, 356.7], [300, 560])} y={1000} h={520} t={t} seed={1} casco="legion" expr="enojado" camina={1.1} bD={172} bI={172} cD={10} cI={10} manoD={<PiedraMano />} />
        </>}
      <Chip t={t} t0={350.64} text="HADRIAN'S WALL" color={C.violeta} x={160} y={140} size={62} />
      <Cuenta t={t} t0={351.32} t1={351.9} de={0} a={73} x={1240} y={320} size={170} color="#fff" suf=" MILES" />
      <Chip t={t} t0={355.4} text="BUILT BY LEGIONARIES" color={C.rojo} x={1240} y={480} centro size={56} />
    </Escena>

    {/* 096-097 · el intendente le da la pala y le saca la espada; la levanta como un arma épica... no: es tu trabajo real */}
    <Escena t={t} t0={356.74} t1={361.98} zoom={0.05} entra="corte" golpes={[357.02, 359.66, 360.92]}>
      <Campamento t={t} tropa={false} />
      {(() => {
        const suya = t > 357.4, epica = t > 357.7 && t < 359.66, cava = t > 360.3;
        const brilla = epica ? prog(t, 357.7, 358.0) : 0;
        const baja = prog(t, 359.66, 360.0);
        const pP = cava ? pose("cavar", t, 1.4) : epica ? { bD: 140, cD: 10, bI: 20, cI: 10, inclina: -3 } : { bD: suya ? 140 - baja * 100 : 30, cD: 20, bI: 15, cI: 10, inclina: 0 };
        return <>
          <Persona x={640} y={1010} h={600} t={t} seed={1} casco="legion" expr={cava ? "triste" : epica ? "orgullo" : t > 359.66 ? "sorpresa" : "neutro"} {...pP} manoD={suya ? <PalaMano brilla={brilla} /> : undefined} />
          {epica && <Emote t={t} t0={357.8} t1={359.6} tipo="brillos" {...L(640, 1010, 600)} />}
          <Persona x={1360} y={1000} h={620} t={t} seed={9} ropa={INTENDENTE} casco="no" viejo flip expr="neutro" bD={!suya ? 75 : t > 358.6 ? 30 : 15} cD={20} manoD={!suya ? <PalaMano /> : t > 358.6 ? <EspadaMano /> : undefined} />
          {t > 358.5 && t < 358.9 && <Fogonazo x={1200} y={700} k={prog(t, 358.5, 358.9)} s={0.6} />}
          {cava && <div style={{ position: "absolute", left: 900, top: 960, width: 240, height: 70, borderRadius: "50% 50% 10% 10%", background: "#8a5a2a" }} />}
        </>;
      })()}
      <Chip t={t} t0={357.68} t1={359.3} text="ISSUED ON DAY ONE" color={C.violeta} x={160} y={140} size={54} />
      <Chip t={t} t0={359.66} t1={360.2} text="NOT A WEAPON" color={C.rojo} x={160} y={140} size={60} />
      <Grande t={t} t0={360.62} text="YOUR REAL JOB" y={150} size={110} color="#fff" borde={C.rojo} />
    </Escena>
  </>
);
