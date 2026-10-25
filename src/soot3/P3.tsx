import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, fontFamily, ent, prog, Escena, Cielo, Estrellas, Astro, Colinas, Chip, Grande, MapaPuntos, Tienda, Zzz, Particulas, Rayos, Frente, Emote, cabeza } from "./kit";
import { Gladius, Escudo, Pilum, Casco, Armadura, Item, Mula, Fuerte, Muro, Arco, Soldadito, Ciudad, Trampas, Calor } from "./kit2";
import { Cuenta } from "./P1";

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
// íconos de los enemigos verdaderos
const Icono: React.FC<{ k: "calor" | "ampolla" | "tobillo" | "agua"; t: number }> = ({ k, t }) => (
  <svg width={260} height={260} viewBox="-130 -130 260 260">
    {k === "calor" && <g><circle r={70} fill="#ffb020" />{Array.from({ length: 12 }, (_, i) => <rect key={i} x={-8} y={-120} width={16} height={36} rx={8} fill="#ff7a3d" transform={`rotate(${i * 30 + t * 30})`} />)}<path d="M -30 -10 Q -20 -20 -10 -10 M 10 -10 Q 20 -20 30 -10 M -26 26 Q 0 10 26 26" stroke="#7a3a14" strokeWidth={8} fill="none" strokeLinecap="round" /></g>}
    {k === "ampolla" && <g><path d="M -70 -110 L -10 -110 L -10 40 Q 60 40 90 70 Q 100 100 60 104 L -70 104 Z" fill="#f2b48a" stroke="#c9805a" strokeWidth={8} /><ellipse cx={30} cy={70} rx={30 + Math.sin(t * 5) * 4} ry={24} fill="#ffd6c8" stroke={C.rojo} strokeWidth={8} /></g>}
    {k === "tobillo" && <g><path d="M -40 -110 L 20 -110 L 20 20 Q 90 30 100 80 L -40 90 Z" fill="#f2b48a" stroke="#c9805a" strokeWidth={8} /><path d="M -60 -10 L -20 10 L -50 30 L 0 60" stroke={C.rojo} strokeWidth={12} fill="none" strokeLinejoin="round" strokeLinecap="round" /><circle cx={0} cy={20} r={60} fill="none" stroke={C.rojo} strokeWidth={6} strokeDasharray="10 12" transform={`rotate(${t * 90})`} /></g>}
    {k === "agua" && <g><path d="M -70 -60 L 70 -60 L 56 100 L -56 100 Z" fill="#c9773a" /><ellipse cx={0} cy={-60} rx={70} ry={18} fill="#7a8a3a" />{[0, 1, 2].map((i) => <circle key={i} cx={Math.cos(t * 4 + i * 2) * 60} cy={-100 + Math.sin(t * 5 + i) * 20} r={8} fill="#2a1530" />)}</g>}
  </svg>
);
const Carta: React.FC<{ t: number; t0: number; x: number; y: number; k: "calor" | "ampolla" | "tobillo" | "agua"; label: string; rot?: number }> = ({ t, t0, x, y, k, label, rot = 0 }) => {
  if (t < t0) return null;
  const e = ent(t, t0);
  return (
    <div style={{ position: "absolute", left: x - 170, top: y - 210, width: 340, height: 420, borderRadius: 30, background: "#fff8ec", border: "8px solid #2a1530", boxShadow: "14px 16px 0 rgba(20,8,40,.35)", transform: `scale(${e}) rotate(${rot + (1 - e) * 20}deg)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
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
  const sube = (t * 0.6) % 1;
  return (
    <svg style={{ position: "absolute", left: x - 300, top: y - 700, overflow: "visible" }} width={600} height={700}>
      <path d="M 120 700 L 300 60 L 480 700" stroke="#8a5a2a" strokeWidth={26} fill="none" />
      <line x1={300} y1={60} x2={560} y2={140} stroke="#8a5a2a" strokeWidth={20} />
      <line x1={540} y1={140} x2={540} y2={640 - sube * 380} stroke="#e8d8b8" strokeWidth={6} />
      <rect x={480} y={640 - sube * 380} width={120} height={80} rx={6} fill="#c9b8a0" stroke="#8a7a64" strokeWidth={6} />
      <circle cx={300} cy={520} r={70} fill="none" stroke="#6b3a1f" strokeWidth={16} transform={`rotate(${t * 120} 300 520)`} strokeDasharray="30 20" />
    </svg>
  );
};

export const P3: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* 068 · trampa tres: la marcha */}
    <Escena t={t} t0={253.76} t1={256.14} entra="corte" golpes={[254.04, 255.24]}>
      <AbsoluteFill style={{ background: C.ambar }} />
      <Rayos t={t} x={960} y={430} color="#fff" op={0.16} />
      <Grande t={t} t0={254.04} text="TRAP #3" y={400} size={260} color="#fff" borde="#7a3d14" />
      <Grande t={t} t0={255.24} text="THE MARCH" y={650} size={130} color={C.rojo} borde="#fff" />
      <Trampas t={t} t0={253.8} n={3} y={850} on="#2a1530" />
    </Escena>

    {/* 069 · ¿qué llevás encima? */}
    <Escena t={t} t0={256.14} t1={257.96} entra="zoom" golpes={[257.56]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #9b7bf0, #2d1b69 70%)" }} />
      <Persona x={960} y={pp(1050, 560)} h={1050} t={t} seed={1} expr="sorpresa" mira={-0.4} />
      <Emote t={t} t0={256.3} tipo="preg" {...L(960, pp(1050, 560), 1050)} s={2} />
      <Chip t={t} t0={256.84} text="WHAT ARE YOU CARRYING?" color={C.ambar} tinta={C.noche} x={960} y={980} centro size={64} />
    </Escena>

    {/* 070-072 · casco, armadura (9 kg de hierro), escudo alto como tu torso, dos jabalinas, espada y daga */}
    <Escena t={t} t0={257.96} t1={268.66} zoom={0.05} entra="barrido" golpes={[258.48, 260.26, 263.62, 265.9, 267.04, 267.94]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #2d1b69, #7a2f8f)" }} />
      <Estrellas t={t} n={50} seed={80} alto={700} />
      <Rayos t={t} x={760} y={480} op={0.06} />
      {(() => {
        const h = 760, x = 720, y = pp(h, 520), c = L(x, y, h), s = c.s;
        const kg = [[258.48, 2], [259.32, 9], [263.62, 8], [265.9, 4], [267.04, 1.5], [267.94, 0.8]].reduce((a, [tt, k]) => a + (t > tt ? k * prog(t, tt, tt + 0.35) : 0), 0);
        const vuela = (t0: number, fx: number, fy: number, tx: number, ty: number) => { const k = prog(t, t0 - 0.35, t0); return { x: interpolate(k, [0, 1], [fx, tx]), y: interpolate(k, [0, 1], [fy, ty]) }; };
        const casco = vuela(258.48, 760, -300, c.x, c.y - 60 * s);
        const esc = vuela(263.62, -300, 600, x - 170 * s, c.y + 330 * s);
        const p1 = vuela(265.9, 2200, 200, x + 190 * s, c.y + 120 * s);
        const gl = vuela(267.04, 2200, 900, x + 120 * s, c.y + 440 * s);
        return <>
          <Persona x={x} y={y + kg * 2} h={h} t={t} seed={1} casco={t > 258.48 ? "legion" : "no"} expr={kg > 18 ? "miedo" : kg > 8 ? "neutro" : "orgullo"} inclina={kg * 0.25} bD={40} cD={30} />
          {t > 258.1 && t < 258.48 && <Casco x={casco.x} y={casco.y} s={0.8} />}
          {t > 259.0 && <Armadura x={1180} y={420} s={0.9} t={t} t0={259.32} t1={262.9} />}
          {t > 263.27 && <Escudo x={esc.x} y={esc.y} s={0.95 * s} rot={-4} />}
          {t > 265.55 && [0, 1].map((i) => <Pilum key={i} x={p1.x + i * 24} y={p1.y + i * 20} s={0.85} rot={-74} />)}
          {t > 266.69 && <Gladius x={gl.x} y={gl.y} s={0.55} rot={170} />}
          {t > 267.94 && <Gladius x={x + 60 * s} y={c.y + 470 * s} s={0.32} rot={190} t={t} t0={267.94} />}
          <Peso t={t} kg={kg} x={1700} y={400} />
          <Emote t={t} t0={265.0} tipo="sudor" {...c} s={1.3} />
        </>;
      })()}
      <Chip t={t} t0={258.48} text="HELMET" color={C.ambar} tinta={C.noche} x={1180} y={140} size={56} t1={259.2} />
      <Chip t={t} t0={259.32} text="ARMOR" color={C.teal} tinta={C.noche} x={1180} y={140} size={56} t1={263.5} />
      <Chip t={t} t0={260.26} text="9 KG OF IRON STRIPS" color={C.rojo} x={1000} y={700} size={50} t1={263.5} />
      <Chip t={t} t0={263.62} text="SHIELD = TALL AS YOUR TORSO" color={C.violeta} x={1000} y={140} size={48} t1={265.8} />
      <Chip t={t} t0={265.9} text="2 JAVELINS" color={C.rojo} x={1180} y={140} size={56} t1={267.0} />
      <Chip t={t} t0={267.04} text="SWORD" color={C.ambar} tinta={C.noche} x={1180} y={140} size={56} t1={267.9} />
      <Chip t={t} t0={267.94} text="+ DAGGER" color={C.ambar} tinta={C.noche} x={1180} y={140} size={56} />
    </Escena>

    {/* 073 · y eso es sólo la parte de pelear */}
    <Escena t={t} t0={268.66} t1={270.3} entra="corte" golpes={[269.5]}>
      <AbsoluteFill style={{ background: C.rojo }} />
      <Rayos t={t} x={960} y={540} color="#fff" op={0.12} />
      <Grande t={t} t0={269.04} text="JUST THE" y={360} size={130} color="#fff" />
      <Grande t={t} t0={269.5} text="FIGHTING PART" y={560} size={170} color={C.oro} />
    </Escena>

    {/* 074-075 · en un palo al hombro: olla, sierra, cesta, pico, hoz, bolso de ropa */}
    <Escena t={t} t0={270.3} t1={279.76} zoom={0.04} entra="sube" golpes={[270.8, 273.54, 274.46, 275.2, 276.82, 277.72, 278.72]}>
      <Cielo tipo="polvo" />
      <Colinas capas={["#b9844a", "#9a6a34"]} base={640} seed={81} alto={60} />
      <Suelo y={880} />
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
      <Cielo tipo="atardecer" />
      <Rayos t={t} x={1500} y={360} op={0.1} />
      <Astro x={1500} y={360} r={90} />
      <Colinas capas={["#8a3a7a", "#6a2a6a"]} base={660} seed={83} alto={60} />
      <Suelo y={880} a="#a8622c" b="#5a2a10" />
      {(() => {
        const x = 960, y = 1060, h = 520, c = L(x, y, h), s = c.s;
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
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #ff9a4d, #8c1d34 70%)" }} />
      <Rayos t={t} x={960} y={420} op={0.1} />
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
      <Cielo tipo="dia" />
      <Colinas capas={["#7fb06a", "#5a9050"]} base={660} seed={84} alto={60} dx={(t - 289) * 60} />
      <Suelo y={880} />
      <Mula x={1300} y={780} s={1.1} t={t} camina={1.4} carga />
      <Persona x={560} y={1010} h={540} t={t} seed={1} casco="legion" expr={t > 292.06 ? "triste" : "neutro"} camina={1.4} inclina={6} />
      <Item k="saco" x={420} y={600} s={0.8} />
      <Item k="olla" x={700} y={590} s={0.6} />
      <Chip t={t} t0={289.86} text="THEIR NICKNAME" color={C.violeta} x={160} y={140} size={56} />
      <Grande t={t} t0={291.42} text="MARIUS'S MULES" y={300} size={130} color="#fff" borde={C.rojo} />
    </Escena>

    {/* 079 · seis horas, en julio, en una ruta de Siria */}
    <Escena t={t} t0={292.38} t1={297.34} zoom={0.05} entra="iris" ix={1500} iy={250} golpes={[294.22, 295.28, 296.66]}>
      <Cielo tipo="polvo" />
      <Rayos t={t} x={1500} y={250} color="#fff3c4" op={0.2} n={20} />
      <Astro x={1500} y={250} r={150} />
      <Colinas capas={["#d9a060", "#c08040"]} base={680} seed={85} alto={50} dx={(t - 292) * 90} />
      <Suelo y={880} a="#e0a868" b="#b07838" />
      <Calor t={t} y={560} op={0.4} />
      {Array.from({ length: 6 }, (_, i) => <Soldadito key={i} x={200 + i * 180} y={920 + (i % 2) * 14} s={1.4} t={t} seed={50 + i} avanza={1} />)}
      <Chip t={t} t0={294.22} text="6 HOURS" color={C.rojo} x={160} y={140} size={60} />
      <Chip t={t} t0={295.28} text="JULY" color={C.ambar} tinta={C.noche} x={160} y={260} size={60} />
      <Chip t={t} t0={296.66} text="SYRIA" color={C.violeta} x={160} y={380} size={60} />
      <Particulas t={t} tipo="polvo" n={40} seed={86} />
    </Escena>

    {/* 080 · el enemigo real no era un bárbaro con hacha */}
    <Escena t={t} t0={297.34} t1={301.04} entra="corte" golpes={[299.54, 300.38]}>
      <Cielo tipo="sangre" />
      <Colinas capas={["#3a0f2a", "#2a0a1e"]} base={720} seed={87} alto={60} />
      <Soldadito x={960} y={980} s={3.6} t={t} seed={7} enemigo />
      {t > 300.38 && <svg style={{ position: "absolute", left: 560, top: 180 }} width={800} height={800}><path d="M 80 80 L 720 720 M 720 80 L 80 720" stroke={C.rojo} strokeWidth={70} strokeLinecap="round" strokeDasharray={910} strokeDashoffset={910 * (1 - prog(t, 300.38, 300.62))} /></svg>}
      <Chip t={t} t0={297.62} text="THE REAL ENEMY?" color={C.violeta} x={160} y={140} size={58} />
      <Chip t={t} t0={299.54} text="NOT A BARBARIAN" color={C.rojo} x={1060} y={300} size={58} />
    </Escena>

    {/* 081 · calor, ampollas, tobillo torcido y agua sucia */}
    <Escena t={t} t0={301.04} t1={306.78} zoom={0.04} entra="sube" banda={C.ambar} golpes={[301.3, 301.98, 303.08, 304.18]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #ff7a3d, #c2386a)" }} />
      <Rayos t={t} x={960} y={540} op={0.08} />
      <Carta t={t} t0={301.3} x={300} y={520} k="calor" label="HEAT" rot={-4} />
      <Carta t={t} t0={301.98} x={740} y={540} k="ampolla" label="BLISTERS" rot={3} />
      <Carta t={t} t0={303.08} x={1180} y={520} k="tobillo" label="TWISTED ANKLE" rot={-2} />
      <Carta t={t} t0={304.18} x={1620} y={540} k="agua" label="DIRTY WATER" rot={4} />
      <Chip t={t} t0={305.48} text="TOO THIRSTY TO CARE" color={C.violeta} x={960} y={960} centro size={58} />
    </Escena>

    {/* 082 · y cuando por fin parás, ¿descansás? */}
    <Escena t={t} t0={306.78} t1={309.3} entra="barrido" golpes={[308.66]}>
      <Cielo tipo="atardecer" />
      <Astro x={1500} y={620} r={110} />
      <Colinas capas={["#7a3a6a", "#5a2a5a"]} base={720} seed={88} alto={50} />
      <Suelo y={880} />
      <Persona x={900} y={1010} h={560} t={t} seed={1} casco="legion" expr={t > 308.2 ? "feliz" : "triste"} inclina={-4} bD={20} bI={20} />
      <Emote t={t} t0={307.4} tipo="sudor" {...L(900, 1010, 560)} />
      <Emote t={t} t0={308.66} tipo="preg" {...L(900, 1010, 560)} s={1.3} />
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
      {t < 312.9 && <Persona x={960} y={1010} h={600} t={t} seed={1} casco="legion" expr={t > 309.4 ? "miedo" : "triste"} bD={20} bI={20} inclina={6} />}
      {t < 312.9 && <Emote t={t} t0={309.4} tipo="susto" {...L(960, 1010, 600)} s={1.3} />}
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
            <div key={i} style={{ position: "absolute", left: 1150 + i * 40, top: interpolate(k, [0, 1], [200, 760 - muro * 210 - 120 + Math.abs(i - 3.5) * 14]), width: 26, height: 150, background: "#c9a46a", border: "5px solid #6b3a1f", clipPath: "polygon(0 12%, 50% 0, 100% 12%, 100% 100%, 0 100%)" }} />
          ))}
          <Persona x={t < 317.2 ? 880 : 1300} y={t < 317.2 ? 760 + zanja * 200 + 40 : 760 - muro * 230 + 40} h={340} t={t} seed={1} casco="legion" expr="enojado" bD={110 + Math.sin(t * 10) * 40} cD={60} />
          <Pala x={t < 317.2 ? 1000 : 1420} y={t < 317.2 ? 760 + zanja * 200 - 140 : 760 - muro * 230 - 140} s={0.4} rot={-30 + Math.sin(t * 10) * 30} />
        </>;
      })()}
      <Particulas t={t} tipo="polvo" n={30} seed={93} />
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
        <Persona key={i} x={160 + i * 130} y={1040} h={300} t={t} seed={i ? 140 + i : 1} casco="legion" expr={i ? "neutro" : "triste"} aparece={i === 0 ? 323.1 : 326.6 + i * 0.12} />
      ))}
      <Mula x={1560} y={900} s={0.8} t={t} t0={328.08} />
      <Chip t={t} t0={323.68} text="ONLY THEN" color={C.violeta} x={160} y={140} size={56} />
      <Chip t={t} t0={325.46} text="LEATHER TENT" color={C.tierra} x={960} y={140} size={56} />
      <Chip t={t} t0={326.6} text="+ 7 MEN" color={C.rojo} x={1400} y={260} size={60} />
      <Chip t={t} t0={328.08} text="+ 1 MULE" color={C.ambar} tinta={C.noche} x={1400} y={380} size={60} />
    </Escena>

    {/* 088 · ocho soldados en una carpa, todas las noches, 25 años */}
    <Escena t={t} t0={328.94} t1={333.06} entra="zoom" golpes={[329.92, 331.6]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 60%, #a8622c, #3a1a0a 75%)" }} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><path d="M 160 1080 L 960 120 L 1760 1080 Z" fill="#c98f4a" opacity={0.35} /></svg>
      {Array.from({ length: 8 }, (_, i) => {
        const r = Math.floor(i / 4), x = 470 + (i % 4) * 300 + r * 150, y = 560 + r * 280;
        return <div key={i} style={{ position: "absolute", left: x - 90, top: y - 80, width: 180, height: 150, transform: `rotate(${(i % 2 ? -1 : 1) * 8 + Math.sin(t * 2 + i) * 3}deg)` }}><Persona x={90} y={560} h={460} t={t} seed={i ? 140 + i : 1} casco="no" expr="dormido" /></div>;
      })}
      <Zzz x={1300} y={420} t={t} />
      <Zzz x={620} y={460} t={t + 0.7} />
      <Grande t={t} t0={329.08} text="8 IN ONE TENT" y={160} size={120} color="#fff" />
      <Cuenta t={t} t0={331.6} t1={332.2} de={1} a={25} x={1420} y={330} size={140} color={C.oro} suf=" YRS" />
    </Escena>

    {/* 089 · a la mañana desarmás todo y lo hacés de nuevo */}
    <Escena t={t} t0={333.06} t1={336.88} zoom={0.04} entra="barrido" golpes={[334.82, 336.34]}>
      <Cielo tipo="atardecer" />
      <Astro x={1500} y={interpolate(t, [333, 336.9], [700, 380])} r={100} />
      <Colinas capas={["#8a3a7a", "#6a2a6a"]} base={660} seed={95} alto={60} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, bottom: 0, background: "#6b3a1f" }} />
      <div style={{ position: "absolute", inset: 0, transform: `scaleY(${1 - prog(t, 334.1, 335.2)})`, transformOrigin: "50% 860px" }}><Fuerte x={960} y={650} s={0.85} w={1700} /></div>
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
      <Persona x={760} y={1000} h={560} t={t} seed={1} casco="legion" expr={t > 339.26 ? "triste" : "feliz"} bD={t > 339.26 ? 10 : 150} bI={t > 339.26 ? 10 : 150} cD={20} cI={20} salta={337.8} />
      <Emote t={t} t0={337.8} t1={339.1} tipo="brillos" {...L(760, 1000, 560)} />
      <Pala x={1200} y={interpolate(prog(t, 339.1, 339.4), [0, 1], [-400, 680])} s={0.7} rot={10} />
      <Chip t={t} t0={337.72} text="NO WAR" color={C.lima} tinta={C.noche} x={160} y={140} size={60} />
      <Chip t={t} t0={339.26} text="STILL NO REST" color={C.rojo} x={1300} y={260} size={60} />
    </Escena>

    {/* 091 · Roma usaba sus legiones como la constructora más grande del mundo antiguo */}
    <Escena t={t} t0={340.06} t1={344.5} zoom={0.05} entra="corte" golpes={[341.98]}>
      <Cielo tipo="atardecer" />
      <Rayos t={t} x={960} y={380} op={0.1} />
      <Ciudad x={1300} y={640} s={1.2} seed={7} luz />
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
          <div key={txt} style={{ position: "absolute", left: x, top: y, width: 960, height: 540, overflow: "hidden", background: col, clipPath: `circle(${ent(t, t0) * 80}% at 50% 50%)` }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "scale(0.5)", transformOrigin: "0 0" }}>
              {i === 0 && <><div style={{ position: "absolute", left: 0, right: 0, top: 760, bottom: 0, background: "#2f86b0" }} /><Arco x={960} y={620} n={4} alto={260} /></>}
              {i === 1 && <><div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: "#7fb06a" }} /><div style={{ position: "absolute", left: -100, top: 420, width: 2200, height: 240, background: "#2f86b0", transform: "rotate(-8deg)", border: "26px solid #b5a48a" }} /></>}
              {i === 2 && <Fuerte x={960} y={620} s={0.9} w={1500} piedra />}
              {i === 3 && <Arco x={960} y={560} n={7} alto={520} />}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", top: 40, fontFamily, fontWeight: 700, fontSize: 60, color: "#fff", WebkitTextStroke: "7px #2a1530", paintOrder: "stroke fill" }}>{txt}</div>
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
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #ffd27a, #e2557a 55%, #2d1b69)" }} />
      <Rayos t={t} x={760} y={480} op={0.12} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${ent(t, 357.0)}) rotate(${Math.sin(t * 2) * 3}deg)`, transformOrigin: "760px 540px" }}><Pala x={760} y={500} s={1.1} rot={-20} /></div>
      <div style={{ position: "absolute", left: 1180, top: 260, opacity: t > 358.8 ? 1 : 0 }}>
        <div style={{ position: "relative", width: 400, height: 500 }}>
          <Gladius x={200} y={250} s={1} rot={20} />
          {t > 359.28 && <svg style={{ position: "absolute", inset: 0 }} width={400} height={500}><path d="M 40 60 L 360 440 M 360 60 L 40 440" stroke={C.rojo} strokeWidth={40} strokeLinecap="round" strokeDasharray={500} strokeDashoffset={500 * (1 - prog(t, 359.28, 359.5))} /></svg>}
        </div>
      </div>
      <Chip t={t} t0={357.68} text="ISSUED ON DAY ONE" color={C.violeta} x={160} y={140} size={56} />
      <Chip t={t} t0={359.28} text="NOT A WEAPON" color={C.rojo} x={1200} y={860} size={60} t1={360.2} />
      <Grande t={t} t0={360.62} text="YOUR REAL JOB" y={920} size={130} color="#fff" borde={C.rojo} />
    </Escena>
  </>
);
