import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, fontFamily, ent, prog, Escena, Cielo, Estrellas, Astro, Colinas, Chip, Grande, MapaPuntos, Tienda, Zzz, Particulas, Rayos, Frente, Emote, cabeza } from "./kit";
import { Gladius, Escudo, Pilum, Casco, Armadura, Item, Mula, Fuerte, Muro, Arco, Soldadito, Ciudad, Trampas, Calor } from "./kit2";
import { Cuenta } from "./P1";
import { Campamento, Ruta, Tablero, pose } from "./kit3";

// Parte 3 (253,76-361,98 s): trampa 3, la marcha, el campamento de cada noche y la constructora más grande del mundo antiguo.
const pp = (h: number, cy: number) => cy + 450 * (h / 560);
const L = (x: number, y: number, h: number) => cabeza(x, y, h);
const Suelo: React.FC<{ y?: number; a?: string; b?: string }> = ({ y = 860, a = "#c9773a", b = "#7a4a20" }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, bottom: 0, background: `linear-gradient(180deg, ${a}, ${b})` }} />
);
// medidor de peso que se llena (kg)
const Peso: React.FC<{ t: number; kg: number; x: number; y: number; max?: number }> = ({ t, kg, x, y, max = 35 }) => {
  const h = 560, f = Math.min(1, kg / max);
  return (
    <div style={{ position: "absolute", left: x - 60, top: y - h / 2, width: 120, height: h }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 60, background: "rgba(255,255,255,.15)", border: "8px solid #fff", overflow: "hidden" }}><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${f * 100}%`, background: f > 0.7 ? C.rojo : f > 0.4 ? C.ambar : C.lima }} /></div>
      <div style={{ position: "absolute", left: -80, right: -80, top: h + 10, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 56, color: "#fff", WebkitTextStroke: "6px #2a1530", paintOrder: "stroke fill" }}>{Math.round(kg)} KG</div>
    </div>
  );
};
// balanza de equipaje colgante: la aguja suma pieza por pieza
const Balanza: React.FC<{ kg: number; x: number; y: number }> = ({ kg, x, y }) => {
  const a = -130 + Math.min(kg, 30) / 30 * 260;
  return (
    <svg style={{ position: "absolute", left: x - 170, top: y - 260, overflow: "visible" }} width={340} height={560}>
      <line x1={170} y1={-300} x2={170} y2={40} stroke="#6b3a1f" strokeWidth={10} />
      <path d="M 150 40 Q 170 10 190 40 L 190 60 L 150 60 Z" fill="#7d8796" />
      <circle cx={170} cy={200} r={150} fill="#fff8ec" stroke="#2a1530" strokeWidth={14} />
      {Array.from({ length: 7 }, (_, i) => { const r = ((-130 + i * 260 / 6) - 90) * Math.PI / 180; return <g key={i}><line x1={170 + Math.cos(r) * 120} y1={200 + Math.sin(r) * 120} x2={170 + Math.cos(r) * 138} y2={200 + Math.sin(r) * 138} stroke="#2a1530" strokeWidth={8} /><text x={170 + Math.cos(r) * 92} y={212 + Math.sin(r) * 92} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={26} fill="#2a1530">{i * 5}</text></g>; })}
      <line x1={170} y1={200} x2={170 + Math.cos((a - 90) * Math.PI / 180) * 118} y2={200 + Math.sin((a - 90) * Math.PI / 180) * 118} stroke={C.rojo} strokeWidth={12} strokeLinecap="round" />
      <circle cx={170} cy={200} r={18} fill="#2a1530" />
      <path d="M 170 350 L 170 400 Q 170 440 130 430" stroke="#7d8796" strokeWidth={14} fill="none" strokeLinecap="round" />
      <rect x={60} y={450} width={220} height={84} rx={18} fill="#2a1530" />
      <text x={170} y={510} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={56} fill="#fff">{kg.toFixed(1)} KG</text>
    </svg>
  );
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

export const P3: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* 068 · trampa tres: la marcha */}
    <Escena t={t} t0={253.76} t1={256.14} entra="corte" golpes={[254.04, 255.24]}>
      <Tablero t={t} t0={253.4} en={2} de={1} tAvanza={253.9} marca={255.0} hecho={2} />
      <Chip t={t} t0={254.04} text="TRAP 3 OF 7" color={C.rojo} x={760} y={170} centro size={64} />
      <Grande t={t} t0={255.24} text="THE MARCH" x={900} y={400} size={130} />
    </Escena>

    {/* 069 · ¿qué llevás encima? — el equipo entero tirado a sus pies */}
    <Escena t={t} t0={256.14} t1={257.96} entra="zoom" golpes={[257.56]}>
      <Campamento t={t} tropa={false} />
      <Persona x={760} y={1030} h={700} t={t} seed={1} expr="sorpresa" mira={0.5} miraY={0.4} bD={30} cD={60} />
      <Emote t={t} t0={256.3} tipo="preg" {...L(760, 1030, 700)} s={1.6} />
      {([["Casco", 1120, 980], ["Escudo", 1330, 930], ["Pilum", 1560, 990], ["Gladius", 1200, 1040]] as const).map(([k, x, y], i) => {
        const e = ent(t, 256.3 + i * 0.25);
        if (e <= 0) return null;
        return <div key={k} style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - e) * -500}px)` }}>
          {k === "Casco" && <Casco x={x} y={y} s={0.7} />}
          {k === "Escudo" && <Escudo x={x} y={y} s={0.6} rot={80} />}
          {k === "Pilum" && <Pilum x={x} y={y} s={0.7} rot={-8} />}
          {k === "Gladius" && <Gladius x={x} y={y} s={0.45} rot={95} />}
        </div>;
      })}
      <Chip t={t} t0={256.84} text="WHAT ARE YOU CARRYING?" color={C.ambar} tinta={C.noche} x={160} y={150} size={64} />
    </Escena>

    {/* 070-072 · casco, armadura (9 kg de hierro), escudo alto como tu torso, dos jabalinas, espada y daga */}
    <Escena t={t} t0={257.96} t1={268.66} zoom={0.05} entra="barrido" golpes={[258.48, 260.26, 263.62, 265.9, 267.04, 267.94]}>
      <Campamento t={t} tropa={false} dx={(t - 258) * 12} />
      {(() => {
        const h = 700, x = 720, y = 1030, c = L(x, y, h), s = c.s;
        const kg = [[258.48, 2], [259.32, 9], [263.62, 8], [265.9, 4], [267.04, 1.5], [267.94, 0.8]].reduce((a, [tt, k]) => a + (t > tt ? k * prog(t, tt, tt + 0.35) : 0), 0);
        const vuela = (t0: number, fx: number, fy: number, tx: number, ty: number) => { const k = prog(t, t0 - 0.35, t0); return { x: interpolate(k, [0, 1], [fx, tx]), y: interpolate(k, [0, 1], [fy, ty]) }; };
        const casco = vuela(258.48, 760, -300, c.x, c.y - 60 * s);
        const esc = vuela(263.62, -300, 600, x - 170 * s, c.y + 330 * s);
        const p1 = vuela(265.9, 2200, 200, x + 190 * s, c.y + 120 * s);
        const gl = vuela(267.04, 2200, 900, x + 120 * s, c.y + 440 * s);
        return <>
          <Persona x={x} y={y + kg * 2} h={h} t={t} seed={1} casco={t > 258.48 ? "legion" : "no"} expr={kg > 18 ? "miedo" : kg > 8 ? "neutro" : "orgullo"} inclina={kg * 0.25} bD={40} cD={30} />
          {t > 258.1 && t < 258.48 && <Casco x={casco.x} y={casco.y} s={0.8} />}
          {t > 259.0 && (() => { const k = prog(t, 259.0, 259.32); return <Armadura x={interpolate(k, [0, 1], [1300, c.x])} y={interpolate(k, [0, 1], [-200, c.y + 200 * s])} s={interpolate(k, [0, 1], [0.9, 0.42 * s])} />; })()}
          {t > 263.27 && <Escudo x={esc.x} y={esc.y} s={0.95 * s} rot={-4} />}
          {t > 265.55 && [0, 1].map((i) => <Pilum key={i} x={p1.x + i * 24} y={p1.y + i * 20} s={0.85} rot={-74} />)}
          {t > 266.69 && <Gladius x={gl.x} y={gl.y} s={0.55} rot={170} />}
          {t > 267.94 && <Gladius x={x + 60 * s} y={c.y + 470 * s} s={0.32} rot={190} t={t} t0={267.94} />}
          <Balanza kg={kg} x={1560} y={300} />
          <Emote t={t} t0={265.0} tipo="sudor" {...c} s={1.3} />
        </>;
      })()}
      <Chip t={t} t0={258.48} text="HELMET" color={C.ambar} tinta={C.noche} x={160} y={150} size={56} t1={259.2} />
      <Chip t={t} t0={259.32} text="ARMOR" color={C.teal} tinta={C.noche} x={160} y={150} size={56} t1={263.5} />
      <Chip t={t} t0={260.26} text="ARMOR ALONE: 9 KG" color={C.rojo} x={1100} y={700} size={50} t1={263.5} />
      <Chip t={t} t0={263.62} text="SHIELD = TALL AS YOUR TORSO" color={C.violeta} x={160} y={150} size={48} t1={265.8} />
      <Chip t={t} t0={265.9} text="2 JAVELINS" color={C.rojo} x={160} y={150} size={56} t1={267.0} />
      <Chip t={t} t0={267.04} text="SWORD" color={C.ambar} tinta={C.noche} x={160} y={150} size={56} t1={267.9} />
      <Chip t={t} t0={267.94} text="+ DAGGER" color={C.ambar} tinta={C.noche} x={160} y={150} size={56} />
    </Escena>

    {/* 073 · y eso es sólo la parte de pelear */}
    <Escena t={t} t0={268.66} t1={270.3} entra="corte" golpes={[269.5]}>
      <Campamento t={t} tropa={false} dx={(t - 268.6) * 40} />
      {/* ya cargado con todo lo de pelear; al lado aparece la segunda carga: la furca */}
      <Persona x={640} y={1030} h={680} t={t} seed={1} casco="legion" expr={t > 269.5 ? "miedo" : "orgullo"} inclina={4} bD={20} cD={30} />
      <Escudo x={500} y={880} s={0.55} rot={-4} />
      <Pilum x={790} y={720} s={0.7} rot={-80} />
      {(() => {
        const k = ent(t, 269.4), x = 1300;
        return <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - k) * 700}px)` }}>
          <div style={{ position: "absolute", left: x - 12, top: 330, width: 24, height: 700, borderRadius: 12, background: "#8a5a2a", transform: "rotate(8deg)", transformOrigin: "50% 100%" }} />
          <div style={{ position: "absolute", left: x - 150, top: 360, width: 300, height: 22, borderRadius: 11, background: "#6b3a1f" }} />
          <Item k="saco" x={x - 90} y={470} s={0.7} />
          <Item k="olla" x={x + 90} y={470} s={0.6} />
        </div>;
      })()}
      <Grande t={t} t0={269.04} text="JUST THE FIGHTING PART" x={960} y={170} size={96} color="#fff" borde={C.rojo} />
      <Chip t={t} t0={269.5} text="+ THE OTHER LOAD" color={C.ambar} tinta={C.noche} x={1460} y={600} size={54} />
    </Escena>

    {/* 074-075 · en un palo al hombro: olla, sierra, cesta, pico, hoz, bolso de ropa */}
    <Escena t={t} t0={270.3} t1={279.76} zoom={0.04} entra="sube" golpes={[270.8, 273.54, 274.46, 275.2, 276.82, 277.72, 278.72]}>
      <Ruta t={t} hora="dia" verde={false} />
      {(() => {
        const items: [number, "olla" | "sierra" | "cesta" | "pico" | "hoz" | "saco"][] = [[273.54, "olla"], [274.46, "sierra"], [275.2, "cesta"], [276.82, "pico"], [277.72, "hoz"], [278.72, "saco"]];
        const n = items.filter(([tt]) => t > tt).length;
        const h = 640, x = 560, y = 1010 + n * 6, c = L(x, y, h), s = c.s;
        const palo = prog(t, 270.5, 270.9);
        const px0 = c.x - 60 * s, py0 = c.y + 150 * s;
        return <>
          <Persona x={x} y={y} h={h} t={t} seed={1} casco="legion" expr={n > 3 ? "miedo" : n > 0 ? "neutro" : "orgullo"} inclina={n * 2.2} bD={150} cD={70} />
          <div style={{ position: "absolute", left: px0, top: py0 - 12, width: 1250 * palo, height: 24, borderRadius: 12, background: "#8a5a2a", transform: `rotate(${-6 + n * 1.4}deg)`, transformOrigin: "0 50%" }} />
          {items.map(([t0, k], i) => {
            if (t < t0 - 0.3) return null;
            const cae = prog(t, t0 - 0.3, t0);
            const ix = px0 + 230 + i * 175, iy = py0 + (i * 175 + 230) * Math.tan(((-6 + n * 1.4) * Math.PI) / 180) + 110;
            const sw = Math.sin((t - t0) * 6 + i) * 6 * Math.exp(-Math.max(0, t - t0) * 0.8);
            return <Item key={k} k={k} x={ix} y={interpolate(cae, [0, 1], [-200, iy])} s={0.75} rot={sw} />;
          })}
          <Emote t={t} t0={277.0} tipo="sudor" {...c} s={1.2} />
        </>;
      })()}
      <Particulas t={t} tipo="polvo" n={24} seed={82} />
      <Chip t={t} t0={270.8} text="WOODEN POLE" color={C.tierra} x={160} y={140} size={56} t1={273.4} />
      {([[273.54, "COOKING POT"], [274.46, "SAW"], [275.2, "BASKET"], [276.82, "PICKAXE"], [277.72, "SICKLE"], [278.72, "BAG OF CLOTHES"]] as const).map(([t0, txt], i, a) => (
        <Chip key={txt} t={t} t0={t0} t1={a[i + 1] ? a[i + 1][0] - 0.05 : undefined} text={txt} color={C.violeta} x={160} y={140} size={60} />
      ))}
    </Escena>

    {/* 076 · cadena, dos estacas y varios días de grano: el burro humano completo */}
    <Escena t={t} t0={279.76} t1={284.34} zoom={0.05} entra="diag" golpes={[280.22, 281.54, 283.32]}>
      <Ruta t={t} hora="tarde" verde={false} />
      {(() => {
        const x = 960, y = 1040, h = 660, c = L(x, y, h), s = c.s;
        const pila: ["olla" | "sierra" | "cesta" | "pico" | "hoz" | "saco" | "cadena" | "estaca" | "grano", number, number, number][] = [
          ["saco", -90, -60, 0], ["cesta", 90, -60, 0], ["olla", -70, -120, 0], ["sierra", 80, -125, 0], ["pico", -20, -175, 0], ["hoz", 70, -190, 0],
          ["cadena", -80, -220, 280.22], ["estaca", 50, -250, 281.54], ["grano", -10, -290, 283.32],
        ];
        return <>
          {pila.map(([k, dx, dy, t0]) => {
            if (t0 && t < t0 - 0.3) return null;
            const cae = t0 ? prog(t, t0 - 0.3, t0) : 1;
            return <Item key={k} k={k} x={c.x + dx * s} y={interpolate(cae, [0, 1], [-300, c.y + dy * s])} s={0.85 * s} rot={dx / 20} />;
          })}
          <Persona x={x} y={y + (t > 283.32 ? 14 : 0)} h={h} t={t} seed={1} casco="legion" expr="miedo" inclina={t > 283.32 ? 10 : 4} bD={170} bI={170} cD={40} cI={40} />
          <Emote t={t} t0={280.4} tipo="sudor" {...c} s={1.2} />
          <Emote t={t} t0={283.4} tipo="susto" {...c} s={1.2} />
        </>;
      })()}
      <Chip t={t} t0={280.22} text="CHAIN" color={C.violeta} x={160} y={140} size={60} t1={281.4} />
      <Chip t={t} t0={281.54} text="2 WOODEN STAKES" color={C.violeta} x={160} y={140} size={60} t1={283.2} />
      <Chip t={t} t0={283.32} text="+ DAYS OF GRAIN" color={C.rojo} x={160} y={140} size={60} />
    </Escena>

    {/* 077 · fácil 30 kilos, quizás más */}
    <Escena t={t} t0={284.34} t1={289.1} zoom={0.05} entra="corte" golpes={[286.78, 287.98]}>
      <Campamento t={t} hora="tarde" tropa={false} />
      <Persona x={230} y={1030} h={600} t={t} seed={1} casco="legion" expr={t > 287.98 ? "miedo" : "sorpresa"} mira={0.6} />
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

    {/* 078 · los soldados se decían «las mulas de Mario» */}
    <Escena t={t} t0={289.1} t1={292.38} entra="barrido" golpes={[291.42, 292.06]}>
      <Ruta t={t} avance={(t - 289) * 260} />
      <Mula x={1300} y={780} s={1.1} t={t} camina={1.4} carga />
      <Persona x={560} y={1010} h={540} t={t} seed={1} casco="legion" expr={t > 292.06 ? "triste" : "neutro"} camina={1.4} inclina={6} />
      <Item k="saco" x={470} y={620} s={0.7} rot={Math.sin(t * 9) * 4} />
      <Item k="olla" x={680} y={610} s={0.55} rot={Math.sin(t * 9 + 1) * 5} />
      <Chip t={t} t0={289.86} text="THEIR NICKNAME" color={C.violeta} x={160} y={140} size={56} />
      <Grande t={t} t0={291.42} text="MARIUS'S MULES" y={300} size={130} color="#fff" borde={C.rojo} />
    </Escena>

    {/* 079 · seis horas, en julio, en una ruta de Siria */}
    <Escena t={t} t0={292.38} t1={297.34} zoom={0.05} entra="iris" ix={1500} iy={250} golpes={[294.22, 295.28, 296.66]}>
      <Ruta t={t} verde={false} avance={(t - 292) * 220} />
      <Astro x={1500} y={250} r={150} />
      <Calor t={t} y={560} op={0.4} />
      {Array.from({ length: 6 }, (_, i) => <Soldadito key={i} x={200 + i * 180} y={920 + (i % 2) * 14} s={1.4} t={t} seed={50 + i} avanza={1} />)}
      <Chip t={t} t0={294.22} text="6 HOURS" color={C.rojo} x={160} y={140} size={60} />
      <Chip t={t} t0={295.28} text="JULY" color={C.ambar} tinta={C.noche} x={160} y={260} size={60} />
      <Chip t={t} t0={296.66} text="SYRIA" color={C.violeta} x={160} y={380} size={60} />
      <Particulas t={t} tipo="polvo" n={40} seed={86} />
    </Escena>

    {/* 080 · el enemigo real no era un bárbaro con hacha */}
    <Escena t={t} t0={297.34} t1={301.04} entra="corte" golpes={[299.54, 300.38]}>
      <Ruta t={t} verde={false} avance={(t - 297) * 200} />
      <Calor t={t} y={560} op={0.35} />
      <Persona x={560} y={1030} h={680} t={t} seed={1} casco="legion" expr="neutro" camina={1.3} inclina={5} />
      <Soldadito x={1320} y={980} s={2.6} t={t} seed={7} enemigo />
      {t > 300.38 && <svg style={{ position: "absolute", left: 1060, top: 420 }} width={520} height={520}><path d="M 60 60 L 460 460 M 460 60 L 60 460" stroke={C.rojo} strokeWidth={56} strokeLinecap="round" strokeDasharray={1140} strokeDashoffset={1140 * (1 - prog(t, 300.38, 300.62))} /></svg>}
      <Chip t={t} t0={297.62} text="THE REAL ENEMY?" color={C.violeta} x={160} y={140} size={58} />
      <Chip t={t} t0={299.54} text="NOT A BARBARIAN" color={C.rojo} x={1080} y={300} size={58} />
    </Escena>

    {/* 081 · calor, ampollas, tobillo torcido y agua sucia */}
    <Escena t={t} t0={301.04} t1={306.78} zoom={0.04} entra="sube" banda={C.ambar} golpes={[301.3, 301.98, 303.08, 304.18]}>
      <Ruta t={t} verde={false} avance={Math.min(t, 303.08) * 200} />
      <Astro x={1180} y={180} r={120} />
      <Calor t={t} y={560} op={0.4} />
      {(() => {
        const tropieza = t > 303.08 && t < 304.18, bebe = t > 304.18;
        const y = 1030 + (tropieza ? 14 : 0) + (bebe ? 70 * prog(t, 304.18, 304.6) : 0);
        return <>
          {t > 304.0 && <div style={{ position: "absolute", left: 790, top: 990, width: 300 * ent(t, 304.0), height: 60, marginLeft: -150 * ent(t, 304.0) + 150, borderRadius: "50%", background: "radial-gradient(ellipse, #8a9a3a, #5a6a20)" }} />}
          <Persona x={600} y={y} h={680} t={t} seed={1} casco="legion" expr={bebe ? "triste" : tropieza ? "miedo" : "neutro"} camina={t < 303.08 ? 1.3 : 0} inclina={bebe ? 38 : tropieza ? 16 : 6} bD={bebe ? 120 : tropieza ? 70 : undefined} bI={tropieza ? 70 : undefined} cD={bebe ? 60 : undefined} />
          <Emote t={t} t0={301.4} tipo="sudor" {...L(600, 1030, 680)} s={1.3} />
          {tropieza && <Emote t={t} t0={303.1} tipo="susto" {...L(600, 1030, 680)} s={1.3} />}
        </>;
      })()}
      {/* termómetro que sube */}
      <div style={{ position: "absolute", left: 1010, top: 330, width: 60, height: 360, borderRadius: 30, background: "#fff", border: "8px solid #2a1530", overflow: "hidden" }}><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${30 + 70 * prog(t, 301.3, 302.2)}%`, background: C.rojo }} /></div>
      <div style={{ position: "absolute", left: 1000, top: 680, width: 80, height: 80, borderRadius: 40, background: C.rojo, border: "8px solid #2a1530" }} />
      <Carta t={t} t0={301.3} x={1440} y={330} k="calor" label="HEAT" rot={-4} s={0.6} />
      <Carta t={t} t0={301.98} x={1720} y={330} k="ampolla" label="BLISTERS" rot={3} s={0.6} />
      <Carta t={t} t0={303.08} x={1440} y={640} k="tobillo" label="ANKLE" rot={-2} s={0.6} />
      <Carta t={t} t0={304.18} x={1720} y={640} k="agua" label="DIRTY WATER" rot={4} s={0.6} />
      <Chip t={t} t0={305.48} text="TOO THIRSTY TO CARE" color={C.violeta} x={160} y={150} size={58} />
    </Escena>

    {/* 082 · y cuando por fin parás, ¿descansás? */}
    <Escena t={t} t0={306.78} t1={309.3} entra="barrido" golpes={[308.66]}>
      <Ruta t={t} hora="tarde" verde={false} />
      <Persona x={900} y={1030} h={660} t={t} seed={1} casco="legion" expr={t > 308.2 ? "feliz" : "triste"} inclina={-4} bD={20} bI={20} />
      <Emote t={t} t0={307.4} tipo="sudor" {...L(900, 1030, 660)} />
      <Emote t={t} t0={308.66} tipo="preg" {...L(900, 1030, 660)} s={1.3} />
      <Chip t={t} t0={307.66} text="YOU FINALLY STOP" color={C.teal} tinta={C.noche} x={160} y={140} size={56} />
      <Chip t={t} t0={308.66} text="REST?" color={C.ambar} tinta={C.noche} x={1300} y={300} size={70} />
    </Escena>

    {/* 083 · claro que no: cada noche la legión construye un campamento fortificado de la nada */}
    <Escena t={t} t0={309.3} t1={315.24} zoom={0.05} entra="corte" golpes={[309.76, 312.92, 314.5]}>
      <Cielo tipo="noche" />
      <Estrellas t={t} n={80} seed={89} alto={600} />
      <Astro x={260} y={180} r={70} luna />
      <Colinas capas={["#3a2a6a", "#2a1d5a"]} base={660} seed={90} alto={60} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, bottom: 0, background: "#3a2a1a" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scaleY(${prog(t, 312.6, 314.4)})`, transformOrigin: "50% 860px" }}>
        <Fuerte x={960} y={650} s={0.85} w={1700} />
      </div>
      {t < 312.9 && (() => {
        // intenta sentarse y el centurión le pone la pala en la mano antes de tocar el suelo
        const baja = prog(t, 309.4, 310.2) * (1 - prog(t, 310.9, 311.2));
        const cx = interpolate(prog(t, 310.0, 310.8), [0, 1], [2200, 1260]);
        const pala = prog(t, 310.8, 311.2);
        return <>
          <Persona x={800} y={1040 + baja * 70} h={600} t={t} seed={1} casco="legion" expr={t > 310.9 ? "miedo" : "feliz"} inclina={baja * 14} bD={t > 311.2 ? 60 : 20} cD={t > 311.2 ? 50 : 0} bI={20} />
          <Persona x={cx} y={1040} h={620} t={t} seed={7} casco="centurion" expr="enojado" flip camina={t < 310.8 ? 1.4 : 0} bI={t > 310.6 && t < 311.4 ? 80 : 10} />
          {t > 310.5 && <Pala x={interpolate(pala, [0, 1], [1140, 930])} y={interpolate(pala, [0, 1], [640, 700])} s={0.5} rot={interpolate(pala, [0, 1], [-20, 10])} />}
          <Emote t={t} t0={311.2} tipo="susto" {...L(800, 1040, 600)} s={1.3} />
        </>;
      })()}
      <Particulas t={t} tipo="brasas" n={30} seed={91} />
      <Grande t={t} t0={309.5} text="OF COURSE NOT" y={180} size={110} color="#fff" borde={C.rojo} />
      <Chip t={t} t0={310.44} text="EVERY SINGLE NIGHT" color={C.violeta} x={160} y={330} size={54} />
      <Chip t={t} t0={314.5} text="FROM NOTHING" color={C.rojo} x={1300} y={330} size={58} />
    </Escena>

    {/* 084-086 · zanja, tierra arriba en muro, y las dos estacas clavadas arriba */}
    <Escena t={t} t0={315.24} t1={323.02} zoom={0.04} entra="diag" golpes={[315.66, 318.44, 319.88, 322.32]}>
      <Cielo tipo="noche" />
      <Estrellas t={t} n={50} seed={92} alto={500} />
      {(() => {
        const zanja = prog(t, 315.3, 316.8), muro = prog(t, 317.26, 318.6);
        const estacas = Array.from({ length: 8 }, (_, i) => prog(t, 319.3 + i * 0.32, 319.55 + i * 0.32));
        const tierra = `M 0 760 L 700 760 L ${760} ${760 + zanja * 200} L ${1000} ${760 + zanja * 200} L 1060 760 L 1920 760 L 1920 1080 L 0 1080 Z`;
        return <>
          <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
            <path d={`M 1080 760 Q 1300 ${760 - muro * 260} 1520 760 Z`} fill="#8a5a2a" />
            <path d={tierra} fill="#6b3a1f" />
            <path d="M 0 760 L 700 760" stroke="#5a8a3a" strokeWidth={16} />
            <path d="M 1520 760 L 1920 760" stroke="#5a8a3a" strokeWidth={16} />
          </svg>
          {estacas.map((k, i) => k > 0 && (
            <div key={i} style={{ position: "absolute", left: 1150 + i * 40, top: interpolate(k, [0, 1], [200, 760 - muro * 130 - 140 + Math.abs(i - 3.5) * 14]), width: 26, height: 150, background: "#c9a46a", border: "5px solid #6b3a1f", clipPath: "polygon(0 12%, 50% 0, 100% 12%, 100% 100%, 0 100%)" }} />
          ))}
          <Persona x={t < 317.2 ? 880 : 1300} y={t < 317.2 ? 760 + zanja * 200 + 40 : 760 - muro * 130 + 20} h={460} t={t} seed={1} casco="legion" expr="enojado" {...pose("cavar", t, 1.4)} />
          <Pala x={t < 317.2 ? 1000 : 1420} y={t < 317.2 ? 760 + zanja * 200 - 140 : 760 - muro * 130 - 160} s={0.5} rot={-30 + Math.sin(t * 8.8) * 30} />
        </>;
      })()}
      <Particulas t={t} tipo="polvo" n={30} seed={93} />
      <div style={{ position: "absolute", left: 1380, top: 120, padding: "10px 26px", borderRadius: 18, background: "#2a1530", fontFamily, fontWeight: 700, fontSize: 50, color: "#fff" }}>SHOVELFULS: {Math.max(0, Math.floor((t - 315.3) * 3.2))}</div>
      <Chip t={t} t0={315.66} text="DIG A DITCH" color={C.ambar} tinta={C.noche} x={160} y={140} size={58} />
      <Chip t={t} t0={317.66} text="EARTH → WALL" color={C.tierra} x={160} y={260} size={58} />
      <Chip t={t} t0={319.88} text="PLANT YOUR 2 STAKES" color={C.rojo} x={160} y={380} size={58} />
    </Escena>

    {/* 087 · recién ahí, la carpa de cuero con siete hombres más y una mula */}
    <Escena t={t} t0={323.02} t1={328.94} zoom={0.04} entra="iris" ix={960} iy={600} golpes={[325.74, 326.6, 328.08]}>
      <Cielo tipo="noche" />
      <Estrellas t={t} n={60} seed={94} alto={500} />
      <Astro x={1640} y={180} r={60} luna />
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, bottom: 0, background: "#3a2a1a" }} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${ent(t, 325.3)})`, transformOrigin: "760px 820px" }}><Tienda x={760} y={640} s={2.2} /></div>
      {Array.from({ length: 8 }, (_, i) => (
        <Persona key={i} x={170 + i * 140} y={1040} h={390} t={t} seed={i ? 140 + i : 1} casco="legion" expr={i ? "neutro" : "triste"} aparece={i === 0 ? 323.1 : 326.6 + i * 0.12} />
      ))}
      <Mula x={1560} y={900} s={0.8} t={t} t0={328.08} />
      <Chip t={t} t0={323.68} text="ONLY THEN" color={C.violeta} x={160} y={140} size={56} />
      <Chip t={t} t0={325.46} text="LEATHER TENT" color={C.tierra} x={960} y={140} size={56} />
      <Chip t={t} t0={326.6} text="+ 7 MEN" color={C.rojo} x={1400} y={260} size={60} />
      <Chip t={t} t0={328.08} text="+ 1 MULE" color={C.ambar} tinta={C.noche} x={1400} y={380} size={60} />
    </Escena>

    {/* 088 · ocho soldados en una carpa, todas las noches, 25 años */}
    <Escena t={t} t0={328.94} t1={333.06} entra="zoom" golpes={[329.92, 331.6]}>
      <Campamento t={t} hora="noche" tropa={false} />
      {/* corte de la carpa de cuero: 8 acostados como sardinas; uno se da vuelta y los otros 7 giran en cadena */}
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <path d="M 260 1000 L 960 300 L 1660 1000 Z" fill="#c98f4a" stroke="#6b3a1f" strokeWidth={16} />
        <path d="M 330 990 L 960 360 L 1590 990 Z" fill="#7a4a22" />
        <rect x={330} y={960} width={1260} height={40} fill="#4a2a12" />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 960px 760px, rgba(255,190,110,.25), transparent 40%)" }} />
      {Array.from({ length: 8 }, (_, i) => {
        const y = 600 + i * 44, x = 1190;
        const gira = t > 330.4 + i * 0.16;
        return <div key={i} style={{ position: "absolute", inset: 0, transform: `rotate(-90deg)`, transformOrigin: `${x}px ${y}px` }}><Persona x={x} y={y} h={380} t={t} seed={i ? 140 + i : 1} casco="no" expr="dormido" flip={gira} /></div>;
      })}
      <Mula x={1560} y={930} s={0.7} t={t} t0={331.6} />
      <Zzz x={1300} y={420} t={t} />
      <Zzz x={620} y={460} t={t + 0.7} />
      <Chip t={t} t0={331.6} text="x 9,125 NIGHTS" color={C.violeta} x={160} y={300} size={54} />
      <Grande t={t} t0={329.08} text="8 IN ONE TENT" y={160} size={120} color="#fff" />
      <Cuenta t={t} t0={331.6} t1={332.2} de={1} a={25} x={1420} y={330} size={140} color={C.oro} suf=" YRS" />
    </Escena>

    {/* 089 · a la mañana desarmás todo y lo hacés de nuevo */}
    <Escena t={t} t0={333.06} t1={336.88} zoom={0.04} entra="barrido" golpes={[334.82, 336.34]}>
      {(() => {
        // timelapse: 3 días; el sol sale y se pone, el fuerte se levanta y se desarma cada vez
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
          <div style={{ position: "absolute", left: 1500, top: 120, padding: "10px 30px", borderRadius: 18, background: "#2a1530", fontFamily, fontWeight: 700, fontSize: 60, color: "#fff" }}>DAY {dia}</div>
        </>;
      })()}
      {t > 336.0 && <svg width={400} height={400} style={{ position: "absolute", left: 760, top: 340, transform: `rotate(${(t - 336) * 400}deg) scale(${ent(t, 336.0)})` }}>
        <path d="M 200 40 A 160 160 0 1 1 60 120" stroke="#fff" strokeWidth={36} fill="none" strokeLinecap="round" />
        <path d="M 20 60 L 70 150 L 120 70 Z" fill="#fff" />
      </svg>}
      {Array.from({ length: 6 }, (_, i) => <Soldadito key={i} x={interpolate(t, [333, 336.9], [300, 1500]) + i * 150 - 400} y={940} s={1.3} t={t} seed={90 + i} avanza={1} />)}
      <Chip t={t} t0={333.14} text="TOMORROW MORNING" color={C.violeta} x={160} y={140} size={56} />
      <Chip t={t} t0={334.1} text="TEAR IT ALL DOWN" color={C.rojo} x={160} y={260} size={56} />
      <Chip t={t} t0={336.34} text="AGAIN" color={C.ambar} tinta={C.noche} x={960} y={860} centro size={80} />
    </Escena>

    {/* 090 · y sin guerra tampoco descansás */}
    <Escena t={t} t0={336.88} t1={340.06} entra="sube" banda={C.teal} golpes={[337.72, 339.26]}>
      <Cielo tipo="dia" />
      <Astro x={1500} y={220} r={90} />
      <Colinas capas={["#7fb06a", "#5a9050"]} base={680} seed={96} alto={60} />
      <Suelo y={880} a="#8aba6a" b="#5a8a3a" />
      <Persona x={760} y={1030} h={680} t={t} seed={1} casco="legion" expr={t > 339.26 ? "triste" : "feliz"} bD={t > 339.26 ? 50 : 150} bI={t > 339.26 ? 10 : 150} cD={20} cI={20} salta={337.8} />
      <Emote t={t} t0={337.8} t1={339.1} tipo="brillos" {...L(760, 1030, 680)} />
      <Pala x={890} y={interpolate(prog(t, 339.1, 339.4), [0, 1], [-400, 700])} s={0.6} rot={12} />
      <Chip t={t} t0={337.72} text="NO WAR" color={C.lima} tinta={C.noche} x={160} y={140} size={60} />
      <Chip t={t} t0={339.26} text="STILL NO REST" color={C.rojo} x={1300} y={260} size={60} />
    </Escena>

    {/* 091 · Roma usaba sus legiones como la constructora más grande del mundo antiguo */}
    <Escena t={t} t0={340.06} t1={344.5} zoom={0.05} entra="corte" golpes={[341.98]}>
      <Cielo tipo="atardecer" />
      <Colinas capas={["#8a3a7a", "#6a2a6a"]} base={640} seed={99} alto={50} />
      <Fuerte x={1300} y={660} s={0.8} w={1000} piedra />
      <Grua t={t} x={560} y={880} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 870, bottom: 0, background: "#6b3a1f" }} />
      {Array.from({ length: 5 }, (_, i) => <Soldadito key={i} x={260 + i * 300} y={960} s={1.2} t={t} seed={60 + i} avanza={1} />)}
      <Chip t={t} t0={340.38} text="ROME USED ITS LEGIONS AS..." color={C.violeta} x={160} y={140} size={50} t1={341.9} />
      <Grande t={t} t0={341.98} text="ROME CONSTRUCTION CO." y={200} size={100} color="#fff" borde={C.rojo} />
    </Escena>

    {/* 092 · los soldados construían las rutas por las que marchaban */}
    <Escena t={t} t0={344.5} t1={346.72} entra="barrido" golpes={[345.22]}>
      <Cielo tipo="dia" />
      <Colinas capas={["#7fb06a", "#5a9050"]} base={640} seed={97} alto={60} />
      <Suelo y={820} a="#8aba6a" b="#5a8a3a" />
      {Array.from({ length: 14 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: i * 140, top: 860, width: 132, height: 100, borderRadius: 10, background: i % 2 ? "#b5ad9e" : "#9a9284", transform: `scale(${ent(t, 344.6 + i * 0.1)})` }} />
      ))}
      {Array.from({ length: 5 }, (_, i) => <Soldadito key={i} x={interpolate(t, [344.5, 346.72], [-200, 900]) + i * 200} y={910} s={1.4} t={t} seed={70 + i} avanza={1} />)}
      <Chip t={t} t0={345.22} text="THEY BUILT THE ROADS" color={C.violeta} x={160} y={140} size={58} />
    </Escena>

    {/* 093 · puentes, canales, fuertes y acueductos */}
    <Escena t={t} t0={346.72} t1={350.16} entra="iris" ix={960} iy={540} golpes={[346.8, 347.9, 348.82, 349.08]}>
      <AbsoluteFill style={{ background: "#1b1240" }} />
      {([[346.8, "BRIDGES", "#4fb3e8", 0], [347.9, "CANALS", "#2ec4d6", 1], [348.82, "FORTS", "#c9773a", 2], [349.08, "AQUEDUCTS", "#9b7bf0", 3]] as const).map(([t0, txt, col, i]) => {
        if (t < t0) return null;
        const x = (i % 2) * 960, y = Math.floor(i / 2) * 540;
        return (
          <div key={txt} style={{ position: "absolute", left: x, top: y, width: 960, height: 540, overflow: "hidden", background: "linear-gradient(180deg,#5fb4ec,#cfeefa)", border: `6px solid ${col}`, boxSizing: "border-box", clipPath: `circle(${ent(t, t0) * 80}% at 50% 50%)` }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "scale(0.5)", transformOrigin: "0 0" }}>
              {i === 0 && <><div style={{ position: "absolute", left: 0, right: 0, top: 760, bottom: 0, background: "#2f86b0" }} /><Arco x={960} y={620} n={4} alto={260} /></>}
              {i === 1 && <><div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: "#7fb06a" }} /><div style={{ position: "absolute", left: -100, top: 420, width: 2200, height: 240, background: "#2f86b0", transform: "rotate(-8deg)", border: "26px solid #b5a48a" }} /></>}
              {i === 2 && <Fuerte x={960} y={620} s={0.9} w={1500} piedra />}
              {i === 3 && <Arco x={960} y={560} n={7} alto={520} />}
              {[0, 1, 2].map((k) => <Soldadito key={k} x={300 + k * 640 + Math.sin(t * 2 + k + i) * 30} y={1000} s={2.4} t={t} seed={i * 5 + k + 20} avanza={k === 1 ? 1 : 0} />)}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", top: 190, fontFamily, fontWeight: 700, fontSize: 60, color: "#fff", WebkitTextStroke: "7px #2a1530", paintOrder: "stroke fill" }}>{txt}</div>
          </div>
        );
      })}
    </Escena>

    {/* 094-095 · la Muralla de Adriano, 73 millas de piedra, hecha por legionarios */}
    <Escena t={t} t0={350.16} t1={356.74} zoom={0.04} entra="corte" golpes={[350.64, 351.32, 355.4]}>
      {t < 352.6
        ? <MapaPuntos t={t} pulsa={["BRITAIN"]} t0Pulsa={350.64} vuela={{ n: "BRITAIN", z: 2.4, t: [350.2, 351.8] }} />
        : <>
          <Cielo tipo="dia" />
          <Colinas capas={["#7fb06a", "#5a9050", "#3a7040"]} base={560} seed={98} alto={110} />
          <Muro x={-40} y={760} w={2000} h={200} t={t} t0={352.7} d={2.2} />
          {Array.from({ length: 6 }, (_, i) => <Soldadito key={i} x={200 + i * 300} y={900} s={1.3} t={t} seed={80 + i} />)}
        </>}
      <Chip t={t} t0={350.64} text="HADRIAN'S WALL" color={C.violeta} x={160} y={140} size={62} />
      <Cuenta t={t} t0={351.32} t1={351.9} de={0} a={73} x={1240} y={320} size={170} color="#fff" suf=" MILES" />
      <Chip t={t} t0={355.4} text="BUILT BY LEGIONARIES" color={C.rojo} x={960} y={1000} centro size={60} />
    </Escena>

    {/* 096-097 · la pala del primer día no es un arma: es tu trabajo real */}
    <Escena t={t} t0={356.74} t1={361.98} zoom={0.05} entra="sube" golpes={[357.02, 359.66, 360.92]}>
      <Campamento t={t} tropa={false} />
      {(() => {
        // el intendente le da la pala al recluta y le saca la espada; la pala brilla como un arma épica
        const da = prog(t, 357.0, 357.6), saca = prog(t, 358.6, 359.1);
        const px = interpolate(da, [0, 1], [1200, 880]), gx = interpolate(saca, [0, 1], [880, 1220]);
        return <>
          <Persona x={700} y={1030} h={700} t={t} seed={1} casco="legion" expr={t > 359.3 ? "triste" : t > 357.6 ? "sorpresa" : "neutro"} bD={60} cD={40} mira={t > 357.6 ? 0.6 : 0.2} />
          <Persona x={1330} y={1030} h={720} t={t} seed={9} casco="legion" viejo flip expr="neutro" bI={da < 1 || (saca > 0 && saca < 1) ? 70 : 15} />
          {da > 0.95 && <div style={{ position: "absolute", left: px - 220, top: 380, width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,230,140,.85), rgba(255,200,80,0) 70%)", transform: `scale(${0.9 + Math.sin(t * 6) * 0.08})` }} />}
          <Pala x={px} y={640} s={0.62} rot={-14 + Math.sin(t * 2) * 3} />
          {t < 359.6 && <Gladius x={gx} y={820} s={0.5} rot={20} />}
          {t > 359.28 && t < 359.6 && <svg style={{ position: "absolute", left: gx - 140, top: 680 }} width={280} height={280}><path d="M 30 30 L 250 250 M 250 30 L 30 250" stroke={C.rojo} strokeWidth={30} strokeLinecap="round" strokeDasharray={320} strokeDashoffset={320 * (1 - prog(t, 359.28, 359.45))} /></svg>}
        </>;
      })()}
      <Chip t={t} t0={357.68} text="ISSUED ON DAY ONE" color={C.violeta} x={160} y={150} size={56} t1={360.5} />
      <Chip t={t} t0={359.28} text="NOT A WEAPON" color={C.rojo} x={1200} y={300} size={60} t1={360.2} />
      <Grande t={t} t0={360.62} text="YOUR REAL JOB" y={170} size={120} color="#fff" borde={C.rojo} />
    </Escena>
  </>
);
