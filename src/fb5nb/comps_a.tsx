// fb5nb · componentes 1-16 (gancho, premio, qué es, dónde sí / dónde nunca, nylon, preparación, imprimación). Cada uno es
// f(t) y sigue la voz por sus marcas (m.*). Ninguno se repite con cl2nov ni con fb5na.
import React from "react";
import { C, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Cross, Draw, FxP, Pop, Svg, Tick, shake } from "./kit";
import { Balde, Bidon, Bolsa, Brillo, Capas, CONT, Gotita, Losa, Moneda, quad, Regla, YESO } from "./piso";

const Silla: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-60} y={-20} width={120} height={18} rx={4} fill="#9a6233" />
    <rect x={-60} y={-130} width={16} height={130} fill="#7c4a22" /><rect x={-56} y={-2} width={12} height={90} fill="#7c4a22" /><rect x={44} y={-2} width={12} height={90} fill="#7c4a22" />
    <rect x={-60} y={-130} width={70} height={16} fill="#9a6233" /><rect x={-60} y={-90} width={70} height={14} fill="#9a6233" />
  </g>
);

// 1 · los nudillos: el piso terminado con la luz de la ventana corriendo; el puño golpea dos veces (ondas sobre el piso),
// MACIZO; cuatro materiales que NO es se tachan uno por uno y cae la bolsa de yeso
export const NudilloMacizo: React.FC<FxP> = ({ t, a, m }) => {
  const hits = [m.golpe + 0.35, m.golpe + 0.75], d = Math.min(...hits.map((h) => Math.abs(t - h)));
  const fy = 470 - 110 * cl(d / 0.22), no = ["porcelanato", "cerámica", "cemento", "vinílico"], out = e(t, m.yeso - 0.2, m.yeso + 0.3);
  return (
    <>
      <Svg>
        <g transform={`translate(0,${shake(t, hits[0], 6) + shake(t, hits[1], 6)})`}>
          <Losa cx={960} y={420} w={1500} d={480} h={50} top="#e7dfcf" side="#a99f8c">
            {(f) => <Brillo id="nud" pts={quad(f, 0, 0, 1, 1)} k={e(t, a, a + 4)} o={0.75} w={320} />}
          </Losa>
          {hits.map((h, i) => t > h && t < h + 0.9 && <ellipse key={i} cx={960} cy={640} rx={(t - h) * 700} ry={(t - h) * 190} fill="none" stroke="#fff6e0" strokeWidth={6} opacity={1 - (t - h) / 0.9} />)}
          <g transform={`translate(960,${fy})`} opacity={1 - out}>
            <rect x={-95} y={-150} width={190} height={170} rx={50} fill="#d9a27a" />
            {[-60, -20, 20, 60].map((x) => <circle key={x} cx={x} cy={14} r={24} fill="#c98e66" />)}
            <rect x={-80} y={-260} width={160} height={130} rx={30} fill="#3b4f6b" />
          </g>
        </g>
        {no.map((w, i) => t > m.no + i * 0.45 && (
          <g key={w} transform={`translate(${300 + i * 440},170) scale(${spr(t, m.no + i * 0.45)})`}>
            <rect x={-190} y={-56} width={380} height={112} rx={16} fill="rgba(30,20,10,.82)" stroke="rgba(255,236,200,.4)" strokeWidth={3} />
            <text y={16} textAnchor="middle" fontSize={50} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">{w.toUpperCase()}</text>
            <line x1={-170} y1={0} x2={-170 + 340 * e(t, m.no + i * 0.45 + 0.25, m.no + i * 0.45 + 0.5)} y2={0} stroke={C.red} strokeWidth={10} />
          </g>
        ))}
        {t > m.yeso && <g transform={`translate(960,${lerp(-200, 560, spr(t, m.yeso, 0.9))})`}><Bolsa x={0} y={0} s={1.1} /></g>}
      </Svg>
      <Lbl t={t} at={m.maci} out={m.no} text="suena macizo" x={960} y={950} col={C.cream} size={84} />
      <Lbl t={t} at={m.nom} text="yesonato" x={960} y={960} col={C.honey} size={120} />
    </>
  );
};

// 2 · la cuenta del gancho: un metro cuadrado de piso; los precios caen de 40 a 20 y se tachan; queda el 3 que late
export const TresDolares: React.FC<FxP> = ({ t, a, m }) => {
  const ps: [string, number, string][] = [["40", m.cuarenta, C.red], ["20", m.veinte, C.red], ["3", m.tres, C.ok]];
  return (
    <>
      <Svg>
        <Losa cx={960} y={640} w={620} d={260} h={40} top="#e5dccb" side="#a39885">
          {(f) => <><Brillo id="tres" pts={quad(f, 0, 0, 1, 1)} k={e(t, a + 0.5, a + 3)} o={0.6} />
            <text x={f(0.5, 0.55)[0]} y={f(0.5, 0.55)[1]} textAnchor="middle" fontSize={60} fontWeight={800} fill="rgba(80,60,40,.45)" fontFamily="Barlow Condensed">1 m²</text></>}
        </Losa>
        {ps.map(([n, at, col], i) => t > at && (
          <g key={n} transform={`translate(${420 + i * 540},${330 + shake(t, at, 10)}) scale(${(i === 2 ? 1.35 : 1) * spr(t, at, 1.1) * (i === 2 ? 1 + 0.05 * Math.sin((t - at) * 5) : 1)})`}>
            <text textAnchor="middle" fontSize={210} fontWeight={800} fill={i === 2 ? C.ok : C.ink} fontFamily="Barlow Condensed" opacity={i < 2 && t > ps[i + 1][1] ? 0.45 : 1}>US${n}</text>
            {i < 2 && t > ps[i + 1][1] && <line x1={-190} y1={-70} x2={-190 + 380 * e(t, ps[i + 1][1], ps[i + 1][1] + 0.3)} y2={-70} stroke={col} strokeWidth={16} />}
          </g>
        ))}
      </Svg>
      <Lbl t={t} at={m.tres + 0.4} text="el metro cuadrado" x={960} y={980} col={C.cream} size={64} />
    </>
  );
};

// 3 · el premio: la moneda raya el yeso solo (surco blanco); después las dos llaves del piso duro — lo que va EN el agua
// (cola al balde) y lo que va ENCIMA (la capa de sellador) — y abajo las tres pruebas del final
export const MonedaRaya: React.FC<FxP> = ({ t, a, m }) => {
  const ra = e(t, m.moneda + 0.2, m.moneda + 1.8), cx = lerp(560, 1360, ra), f1 = 1 - e(t, m.agua - 0.3, m.agua + 0.2);
  return (
    <>
      <Svg>
        <g opacity={f1}>
          <rect x={460} y={520} width={1000} height={220} rx={8} fill={YESO} />
          <rect x={460} y={740} width={1000} height={40} fill="#c9c1b1" />
          <Draw d={`M560,610 Q760,600 960,616 T1360,606`} p={ra} col="#ffffff" w={14} />
          <Draw d={`M560,616 Q760,606 960,622 T1360,612`} p={ra} col="#b9b0a0" w={4} />
          {t > m.moneda && <Moneda x={cx} y={560} r={80} rot={-70} />}
          {Array.from({ length: 14 }, (_, i) => ra > i / 14 && <circle key={i} cx={560 + 800 * (i / 14) + 20 * hash(i, 2)} cy={640 + 30 * hash(i, 3) + 60 * cl(ra - i / 14)} r={4} fill="#fff" opacity={1 - cl((ra - i / 14) * 3)} />)}
        </g>
        {t > m.agua && <g transform={`translate(0,${(1 - spr(t, m.agua)) * 80})`} opacity={cl((t - m.agua) * 4)}>
          <Balde x={520} y={720} s={1} lvl={0.6} liq="#e9eef0" />
          <g transform={`translate(380,${360 + 30 * Math.sin((t - m.agua) * 3)}) rotate(${lerp(0, 55, e(t, m.agua, m.agua + 0.8))})`}><Bidon x={0} y={0} s={0.8} /></g>
          {t > m.agua + 0.8 && <path d="M470,420 Q500,500 510,560" stroke={C.milk} strokeWidth={14} fill="none" opacity={0.9} />}
        </g>}
        {t > m.encima && <g opacity={cl((t - m.encima) * 4)}>
          <Capas x={1150} y={720} w={560} capas={[{ h: 200, k: 1, tipo: "yeso" }, { h: 26, k: e(t, m.encima + 0.2, m.encima + 1.4), tipo: "sell" }]} />
          <Brillo id="enc" pts="1150,494 1710,494 1710,520 1150,520" k={e(t, m.encima + 1.2, m.encima + 2.6)} o={0.9} w={160} />
        </g>}
        {t > m.pruebas && [0, 1, 2].map((i) => <g key={i} transform={`translate(${620 + i * 340},900) scale(${spr(t, m.pruebas + i * 0.3)})`}>
          {i === 0 ? <Moneda x={0} y={0} r={56} /> : i === 1 ? <Gotita x={0} y={10} r={46} /> : <Silla x={0} y={20} s={0.6} />}
        </g>)}
      </Svg>
      <Lbl t={t} at={m.moneda} out={m.agua - 0.2} text="el yeso solo es blando" x={960} y={410} col={C.cream} size={70} />
      <Lbl t={t} at={m.agua + 0.3} text="en el agua" x={520} y={820} col={C.solv} size={56} />
      <Lbl t={t} at={m.encima + 0.3} text="encima" x={1430} y={820} col={C.honey} size={56} />
    </>
  );
};

// 4 · qué es: el piso en corte, ZOOM. Sobre el contrapiso sube la capa de yeso con su regla de milímetros (5-8 mm marcados),
// pasa la regla de aluminio (nivela), la superficie áspera se alisa (lija) y aparece la capa de sellador que brilla
export const MilimetrosYeso: React.FC<FxP> = ({ t, a, m }) => {
  const yk = e(t, a + 0.3, a + 1.6), lis = e(t, m.lija, m.lija + 1.6), rx = lerp(300, 1500, e(t, m.nivela, m.nivela + 1.6));
  const amp = 10 * (1 - lis), top = 640;
  const ola = Array.from({ length: 41 }, (_, i) => `${i ? "L" : "M"}${260 + i * 35},${top + amp * Math.sin(i * 1.7) * hash(i, 4)}`).join(" ");
  return (
    <>
      <Svg>
        <Capas x={260} y={900} w={1400} capas={[{ h: 160, k: 1, tipo: "cont" }]} />
        <path d={`${ola} L1660,740 L260,740 Z`} fill={YESO} opacity={yk} transform={`translate(0,${(1 - yk) * 100})`} />
        <rect x={260} y={top - 22} width={1400} height={22 * e(t, m.sella, m.sella + 1.4)} fill="#ffe9b8" opacity={0.6} />
        <Brillo id="cf" pts={`260,${top - 22} 1660,${top - 22} 1660,${top} 260,${top}`} k={e(t, m.sella + 1, m.sella + 2.6)} o={0.95} w={200} />
        {t > m.nivela && t < m.nivela + 2 && <Regla x={rx} y={top - 40} l={420} rot={0} />}
        {/* regla de milímetros */}
        <g transform="translate(1720,0)" opacity={cl((t - m.mm) * 4)}>
          <rect x={0} y={560} width={70} height={200} fill="#f0d27a" stroke="#8a6a2c" strokeWidth={3} />
          {Array.from({ length: 11 }, (_, i) => <line key={i} x1={0} y1={740 - i * 10 * 1.8} x2={i % 5 ? 22 : 40} y2={740 - i * 10 * 1.8} stroke="#2b1a0c" strokeWidth={3} />)}
          <rect x={-8} y={740 - 8 * 18} width={86} height={3 * 18} fill="rgba(169,230,108,.5)" opacity={e(t, m.mm + 0.4, m.mm + 0.8)} />
        </g>
      </Svg>
      <Lbl t={t} at={m.mm + 0.5} text="5 a 8 mm" x={1755} y={500} col={C.ok} size={60} />
      <Lbl t={t} at={a + 0.6} out={m.nivela} text="yeso sobre contrapiso" x={960} y={970} col={C.cream} size={62} />
      <Lbl t={t} at={m.nivela} out={m.lija} text="se nivela" x={960} y={970} col={C.cream} size={62} />
      <Lbl t={t} at={m.lija} out={m.sella} text="se lija" x={960} y={970} col={C.cream} size={62} />
      <Lbl t={t} at={m.sella} text="se sella" x={960} y={970} col={C.honey} size={70} />
    </>
  );
};

// 5 · los tonos: tres baldosas grandes del mismo piso (blanco hueso, gris, arena) que entran de a una; el brillo del
// sellador corre por las tres a la vez
export const TresTonos: React.FC<FxP> = ({ t, a, m }) => {
  const ts: [string, string, number][] = [["blanco hueso", "#efe8da", m.blanco], ["gris", "#b9bcbc", m.gris], ["arena", "#d8c193", m.arena]];
  const pre = e(t, a + 0.2, a + 1) * (1 - e(t, m.blanco - 0.4, m.blanco));
  return (
    <>
      <Svg>
        {pre > 0.01 && <g opacity={pre}>
          <Losa cx={960} y={400} w={1300} d={460} h={50} top="#ece5d6" side="#a99f8c">
            {(f) => <Brillo id="tt-pre" pts={quad(f, 0, 0, 1, 1)} k={e(t, a + 0.8, a + 4)} o={0.8} w={300} />}
          </Losa>
          <g transform="translate(960,230)"><rect x={-300} y={-60} width={600} height={120} rx={14} fill="#f7f5ee" /><rect x={-300} y={-60} width={600} height={120} rx={14} fill="none" stroke="#cfc8b8" strokeWidth={4} />{Array.from({ length: 30 }, (_, i) => <circle key={i} cx={-280 + 560 * hash(i, 51)} cy={70 + 120 * hash(i, 52) * e(t, a + 1, a + 4)} r={4} fill="#f2efe6" />)}</g>
        </g>}
        {ts.map(([n, col, at0], i) => { const at = at0 + i * 0.35; return t > at && (
          <g key={n} transform={`translate(0,${(1 - spr(t, at, 0.9)) * 200})`} opacity={cl((t - at) * 4)}>
            <Losa cx={420 + i * 540} y={430} w={460} d={330} h={44} top={col} side="#857c6c">
              {(f) => <Brillo id={`tt${i}`} pts={quad(f, 0, 0, 1, 1)} k={e(t, m.brillo + i * 0.25, m.brillo + 2 + i * 0.25)} o={0.85} w={180} />}
            </Losa>
          </g>
        ); })}
      </Svg>
      <Lbl t={t} at={a + 0.6} out={m.blanco - 0.3} text="no es el yeso del cielorraso" x={960} y={960} col={C.cream} size={62} />
      {ts.map(([n, , at], i) => <Lbl key={n} t={t} at={at + 0.3 + i * 0.35} text={n} x={420 + i * 540} y={880} col={C.cream} size={56} />)}
      <Lbl t={t} at={m.brillo + 0.5} text="el brillo lo da el sellador" x={960} y={980} col={C.honey} size={60} />
    </>
  );
};

// 6 · cemento ≠ yeso: dos bloques bajo la misma gotera; el cemento se pone más duro y oscuro, el yeso se ablanda y se cae
export const CementoNoYeso: React.FC<FxP> = ({ t, a, m }) => {
  const ab = e(t, m.yeso, m.yeso + 2.4), dr = (x: number, i: number) => { const u = ((t - a) * 1.6 + i * 0.33) % 1; return <circle key={i} cx={x} cy={200 + u * 330} r={10} fill={C.water} opacity={t > a + 0.4 ? 1 : 0} />; };
  return (
    <>
      <Svg>
        {[0, 1, 2].map((i) => dr(580, i))}{[0, 1, 2].map((i) => dr(1340, i))}
        <rect x={380} y={540} width={400} height={300} rx={10} fill={CONT} />
        <rect x={380} y={540} width={400} height={300} rx={10} fill="#3c3a36" opacity={0.3 * e(t, m.cem, m.cem + 1.5)} />
        <path d={`M1140,${540 + 40 * ab} Q1240,${540 + 120 * ab} 1340,${540 + 60 * ab} T1540,${540 + 80 * ab} L1540,840 L1140,840 Z`} fill={YESO} />
        <path d={`M1140,${560 + 40 * ab} Q1340,${600 + 120 * ab} 1540,${570 + 80 * ab}`} stroke="#9aa6b0" strokeWidth={14} fill="none" opacity={0.6 * ab} />
        {Array.from({ length: 10 }, (_, i) => ab > 0.3 && <circle key={i} cx={1160 + 360 * hash(i, 5)} cy={850 + 60 * cl((ab - 0.3) * 2) * hash(i, 6)} r={6 + 6 * hash(i, 7)} fill={YESO} />)}
      </Svg>
      <Lbl t={t} at={a + 0.3} text="cemento" x={580} y={450} col={C.ink} size={64} />
      <Lbl t={t} at={a + 0.5} text="yeso" x={1340} y={450} col={C.ink} size={64} />
      <Lbl t={t} at={m.cem + 0.4} text="con agua: más duro" x={580} y={920} col={C.ok} size={50} />
      <Lbl t={t} at={m.yeso + 0.4} text="con agua: se ablanda" x={1340} y={920} col={C.red} size={50} />
    </>
  );
};

// 7 · dónde sí / dónde nunca: la planta de la casa; cada ambiente se pinta verde o rojo cuando lo nombra
export const DondeSiNunca: React.FC<FxP> = ({ t, a, m }) => {
  const R: [string, number, number, number, number, number, boolean][] = [
    ["living", 360, 220, 560, 380, m.living, true], ["dormitorio", 920, 220, 320, 260, m.dorm, true], ["dormitorio", 1240, 220, 320, 260, m.dorm + 0.3, true],
    ["baño", 920, 480, 220, 220, m.nunca, false], ["lavadero", 1140, 480, 200, 220, m.lav, false], ["cocina", 360, 600, 560, 260, m.coc, false],
    ["garaje", 1340, 480, 220, 380, m.gar, false], ["patio", 920, 700, 420, 160, m.ext, false],
  ];
  return (
    <>
      <Svg>
        <rect x={340} y={200} width={1240} height={680} fill="#2a2016" stroke="#f6f1e6" strokeWidth={12} />
        {R.map(([n, x, y, w, h, at, ok], i) => {
          const k = e(t, at, at + 0.4);
          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} fill={n === "patio" ? "#3f5a2c" : "#e9dfcb"} stroke="#f6f1e6" strokeWidth={8} />
              <rect x={x} y={y} width={w} height={h} fill={ok ? C.ok : C.red} opacity={0.55 * k} />
              <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fontSize={40} fontWeight={800} fill="#2b241b" fontFamily="Barlow Condensed">{n.toUpperCase()}</text>
            </g>
          );
        })}
      </Svg>
      {R.map(([n, x, y, w, h, at, ok], i) => ok ? <Tick key={i} t={t} at={at + 0.2} x={x + w / 2} y={y + h / 2 - 60} r={34} /> : <Cross key={i} t={t} at={at + 0.2} x={x + w / 2} y={y + h / 2 - 60} r={30} />)}
      <Lbl t={t} at={m.living} out={m.nunca} text="dónde sí: lo seco" x={960} y={980} col={C.ok} size={64} />
      <Lbl t={t} at={m.nunca} text="dónde nunca: donde hay agua" x={960} y={980} col={C.red} size={64} />
    </>
  );
};

// 8 · la humedad que sube: corte del suelo, el agua sube por la tierra y el contrapiso (flechas), el yeso la chupa como
// esponja (se oscurece) y arriba aparecen manchas y se desgrana
export const EsponjaCimiento: React.FC<FxP> = ({ t, a, m }) => {
  const s = e(t, m.sube, m.sube + 2), j = e(t, m.esp, m.esp + 2.4), mn = e(t, m.man, m.man + 1.4);
  return (
    <>
      <Svg>
        <Capas x={260} y={980} w={1400} capas={[{ h: 260, k: 1, tipo: "tierra" }, { h: 150, k: 1, tipo: "cont" }, { h: 70, k: 1, tipo: "yeso", moj: j }]} />
        {Array.from({ length: 9 }, (_, i) => { const u = ((t - m.sube) * 0.6 + i * 0.11) % 1; return t > m.sube && <g key={i} opacity={s * (1 - u)}><path d={`M${360 + i * 150},${960 - u * 420} l-16,26 l32,0 Z`} fill={C.water} /><line x1={360 + i * 150} y1={986 - u * 420} x2={360 + i * 150} y2={1020 - u * 420} stroke={C.water} strokeWidth={8} /></g>; })}
        {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={420 + i * 230} cy={500} rx={70 * mn} ry={14 * mn} fill="#4f5a62" opacity={0.7} />)}
        {Array.from({ length: 12 }, (_, i) => mn > 0.2 && <circle key={i} cx={400 + 1100 * hash(i, 8)} cy={480 - 40 * mn * hash(i, 9)} r={5} fill={YESO} />)}
      </Svg>
      <Lbl t={t} at={m.sube} text="el agua sube de abajo" x={960} y={180} col={C.solv} size={64} />
      <Lbl t={t} at={m.esp + 0.3} text="el yeso la chupa" x={960} y={300} col={C.red} size={64} />
    </>
  );
};

// 9 · la prueba del nylon: el cuadrado se apoya, las cuatro cintas se pegan de a una, el reloj da las 24 h; debajo:
// gotitas y mancha oscura = NO; después seco = SÍ
export const NylonCuadro: React.FC<FxP> = ({ t, a, m }) => {
  const sq = spr(t, a + 0.3, 0.9), rel = e(t, m.h24, m.h24 + 2.2), got = e(t, m.got, m.got + 1) * (1 - e(t, m.seco, m.seco + 0.8));
  const tapes = [[640, 260, 640, 24], [640, 800, 640, 24], [640, 260, 24, 564], [1256, 260, 24, 564]];
  return (
    <>
      <Svg>
        <rect x={300} y={140} width={1320} height={840} fill={CONT} />
        {Array.from({ length: 140 }, (_, i) => <circle key={i} cx={300 + 1320 * hash(i, 1)} cy={140 + 840 * hash(i, 2)} r={2 + 3 * hash(i, 3)} fill="#6c675e" />)}
        <rect x={660} y={280} width={600} height={540} fill="#3f4448" opacity={0.55 * got} />
        <g transform={`translate(960,550) scale(${sq}) translate(-960,-550)`}>
          <rect x={660} y={280} width={600} height={540} fill="rgba(225,238,248,.30)" stroke="rgba(255,255,255,.6)" strokeWidth={3} />
          <path d="M700,320 L900,300 L1200,360" stroke="#fff" strokeWidth={6} opacity={0.5} fill="none" />
        </g>
        {tapes.map(([x, y, w, h], i) => { const k = e(t, m.cinta + i * 0.35, m.cinta + i * 0.35 + 0.3); return <rect key={i} x={x} y={y} width={w > h ? w * k : w} height={h > w ? h * k : h} fill="#d9b860" opacity={0.92} />; })}
        {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={690 + 540 * hash(i, 21)} cy={310 + 480 * hash(i, 22)} r={(5 + 9 * hash(i, 23)) * got} fill="rgba(200,230,255,.85)" />)}
        <g transform="translate(1500,300)" opacity={cl((t - m.h24) * 4)}>
          <circle r={110} fill="#f6f1e6" stroke="#5e5547" strokeWidth={8} />
          <path d={`M0,0 L0,-110 A110,110 0 ${rel > 0.5 ? 1 : 0},1 ${110 * Math.sin(rel * 6.283)},${-110 * Math.cos(rel * 6.283)} Z`} fill={C.honey} opacity={0.75} />
          <text y={18} textAnchor="middle" fontSize={60} fontWeight={800} fill="#2b241b" fontFamily="Barlow Condensed">24 H</text>
        </g>
      </Svg>
      <Lbl t={t} at={m.got + 0.3} out={m.seco} text="gotitas: no va yeso" x={960} y={920} col={C.red} size={66} />
      <Lbl t={t} at={m.seco + 0.3} text="seco: avanzamos" x={960} y={920} col={C.ok} size={66} />
      {t > m.seco + 0.5 && <Tick t={t} at={m.seco + 0.5} x={960} y={550} r={70} />}
    </>
  );
};

// 10 · lo de abajo manda: el corte con bultos en el contrapiso; la capa fina de yeso los COPIA arriba; después la
// espátula los raspa de izquierda a derecha y la aspiradora se lleva el polvo
export const AbajoManda: React.FC<FxP> = ({ t, a, m }) => {
  const sx = lerp(220, 1720, e(t, m.esp, Math.max(m.esp + 3, m.asp - 1))), yo = 1 - e(t, m.esp - 0.6, m.esp), xs = [420, 700, 1010, 1300, 1560];
  const bump = (x: number) => xs.reduce((s, c, i) => s + (x < sx ? 0 : 1) * (50 + 20 * hash(i, 3)) * Math.exp(-(((x - c) / 46) ** 2)), 0);
  const prof = (off: number) => Array.from({ length: 81 }, (_, i) => { const x = 220 + i * 18.75; return `${i ? "L" : "M"}${x},${620 - off - bump(x)}`; }).join(" ");
  return (
    <>
      <Svg>
        <path d={`${prof(0)} L1720,900 L220,900 Z`} fill={CONT} />
        <path d={`${prof(60)} L1720,${620} L220,${620} Z`} fill={YESO} opacity={yo * e(t, a + 0.4, a + 1.2)} />
        {t > m.esp && t < Math.max(m.esp + 3.2, m.asp - 0.8) && <g transform={`translate(${sx},${600 - bump(sx + 1) - 20}) rotate(-30)`}><rect x={-10} y={-120} width={20} height={120} fill="#9a6233" /><rect x={-60} y={0} width={120} height={14} fill="#cfd5da" /></g>}
        {Array.from({ length: 30 }, (_, i) => { const u = e(t, m.asp + hash(i, 4) * 0.8, m.asp + hash(i, 4) * 0.8 + 0.8), x0 = 260 + 1400 * hash(i, 5); return <circle key={i} cx={lerp(x0, 1650, u)} cy={lerp(600 - 10 * hash(i, 6), 360, u)} r={5} fill="#d6d0c4" opacity={(t > m.esp + 1 ? 1 : 0) * (1 - u)} />; })}
        {t > m.asp && <g transform="translate(1660,350)"><rect x={-20} y={-300} width={40} height={300} fill="#5e5547" /><rect x={-70} y={-10} width={140} height={34} rx={10} fill="#d8352a" /></g>}
      </Svg>
      <Lbl t={t} at={a + 1} out={m.esp} text="lo de abajo se copia arriba" x={960} y={220} col={C.red} size={66} />
      <Lbl t={t} at={m.esp + 0.3} out={m.asp} text="lo que sobresale, se saca" x={960} y={220} col={C.cream} size={66} />
      <Lbl t={t} at={m.asp + 0.3} text="y se aspira el polvo" x={960} y={220} col={C.honey} size={66} />
    </>
  );
};

// 11 · las grietas: la de un pelo pasa (tilde); la ancha se mide (2 mm), se abre en V y se rellena con mortero
export const GrietaAncha: React.FC<FxP> = ({ t, a, m }) => {
  const d = "M300,420 L520,470 L640,440 L820,560 L980,520 L1150,640 L1340,600 L1620,700";
  const w = lerp(3, 26, e(t, m.ancha, m.ancha + 0.8)) * (1 + 0.6 * e(t, m.abr, m.abr + 0.8));
  return (
    <>
      <Svg>
        <rect x={240} y={200} width={1440} height={720} fill={CONT} />
        {Array.from({ length: 120 }, (_, i) => <circle key={i} cx={240 + 1440 * hash(i, 31)} cy={200 + 720 * hash(i, 32)} r={2 + 3 * hash(i, 33)} fill="#6c675e" />)}
        <Draw d={d} p={e(t, a, a + 1)} col="#2a2622" w={w} />
        <Draw d={d} p={e(t, m.rell, m.rell + 2)} col="#b7b1a6" w={w + 2} />
        {t > m.ancha + 0.6 && <g transform="translate(820,560)"><line x1={-60} y1={-70} x2={60} y2={-70} stroke={C.honey} strokeWidth={5} /><line x1={-60} y1={-90} x2={-60} y2={-50} stroke={C.honey} strokeWidth={5} /><line x1={60} y1={-90} x2={60} y2={-50} stroke={C.honey} strokeWidth={5} /></g>}
      </Svg>
      <Lbl t={t} at={m.pelo} out={m.ancha} text="de un pelo: no pasa nada" x={960} y={990} col={C.ok} size={60} />
      <Lbl t={t} at={m.ancha + 0.7} text="+2 mm" x={820} y={430} col={C.honey} size={56} />
      <Lbl t={t} at={m.ancha} out={m.rell} text="la ancha se abre y se limpia" x={960} y={990} col={C.cream} size={60} />
      <Lbl t={t} at={m.rell} text="mortero + chorrito de cola" x={960} y={990} col={C.honey} size={60} />
    </>
  );
};

// 12 · el mapa del golpe: el mango del martillo recorre el piso en cuadrícula; cada golpe deja un punto verde (firme) o
// rojo (hueco); la zona hueca se marca y se recorta
export const MartilloMapa: React.FC<FxP> = ({ t, a, m }) => {
  const COLS = 8, ROWS = 5, N = COLS * ROWS, t0 = a + 0.5, t1 = Math.max(a + 3, m.hueco - 0.2), hueco = (i: number) => { const c = i % COLS, r = Math.floor(i / COLS); return c >= 4 && c <= 6 && r >= 1 && r <= 3; };
  const k = Math.floor(e(t, t0, t1) * N), cut = e(t, m.rompe, m.rompe + 1);
  const hc = Math.min(N - 1, k), hx = 380 + (hc % COLS) * 165, hy = 290 + Math.floor(hc / COLS) * 125;
  return (
    <>
      <Svg>
        <rect x={300} y={220} width={1320} height={640} fill={CONT} />
        {Array.from({ length: N }, (_, i) => {
          const x = 380 + (i % COLS) * 165, y = 290 + Math.floor(i / COLS) * 125, h = hueco(i);
          return i < k && <circle key={i} cx={x} cy={y + (h ? 120 * cut : 0)} r={h ? 26 + 4 * Math.sin((t - m.hueco) * 6) * (t > m.hueco ? 1 : 0) : 20} fill={h ? C.red : C.ok} opacity={h ? 1 - 0.6 * cut : 1} />;
        })}
        {t > m.hueco && <rect x={1000} y={330} width={500} height={410} fill="none" stroke={C.red} strokeWidth={8} strokeDasharray="22 12" opacity={e(t, m.hueco, m.hueco + 0.4)} />}
        {t > m.rompe && <rect x={1004} y={334} width={492} height={402} fill="#1a140e" opacity={0.6 * cut} />}
        {k < N && <g transform={`translate(${hx + 40},${hy - 60 - 30 * Math.abs(Math.sin((t - t0) * N / (t1 - t0) * Math.PI))}) rotate(-35)`}><rect x={-14} y={-200} width={28} height={200} rx={8} fill="#9a6233" /><rect x={-50} y={-240} width={100} height={46} rx={6} fill="#5f666e" /></g>}
      </Svg>
      <Lbl t={t} at={a + 0.6} out={m.hueco} text="golpe por todos lados" x={960} y={960} col={C.cream} size={62} />
      <Lbl t={t} at={m.hueco + 0.2} out={m.rompe} text="suena hueco = despegado" x={960} y={960} col={C.red} size={62} />
      <Lbl t={t} at={m.rompe + 0.2} text="se rompe y se rehace" x={960} y={960} col={C.honey} size={62} />
    </>
  );
};

// 13 · cerámica vieja: al microscopio, el yeso resbala sobre el esmalte liso; la lija lo raya, el puente de adherencia
// se pinta, y el yeso se agarra con dientes
export const CeramicaVieja: React.FC<FxP> = ({ t, a, m }) => {
  const lj = e(t, m.lija, m.lija + 1.4), pu = e(t, m.puente, m.puente + 1), ag = e(t, m.puente + 1.2, m.puente + 2.2), sl = (1 - ag) * 60 * Math.sin((t - a) * 2.2);
  const raya = Array.from({ length: 49 }, (_, i) => `${i ? "L" : "M"}${260 + i * 29},${560 + (i % 2 ? 14 : 0) * lj}`).join(" ");
  return (
    <>
      <Svg>
        <rect x={260} y={560} width={1400} height={300} fill="#8a4b2a" />
        <rect x={260} y={548} width={1400} height={14} fill="#c78a5a" opacity={1 - lj * 0.7} />
        <path d={`${raya} L1660,575 L260,575 Z`} fill="#6e3a1f" opacity={lj} />
        <rect x={260} y={540} width={1400 * pu} height={12} fill="#f0a93a" opacity={0.85} />
        <g transform={`translate(${sl},${-10 * (1 - ag)})`}>
          <path d={`M560,540 L560,380 Q960,340 1360,380 L1360,540 Z`} fill={YESO} />
          {ag > 0.05 && Array.from({ length: 20 }, (_, i) => <path key={i} d={`M${580 + i * 40},540 l10,${22 * ag} l10,${-22 * ag}`} fill={YESO} />)}
        </g>
      </Svg>
      <Lbl t={t} at={a + 0.6} out={m.lija} text="sin poro: el yeso no agarra" x={960} y={240} col={C.red} size={62} />
      <Lbl t={t} at={m.lija + 0.2} out={m.puente} text="lija gruesa al esmalte" x={960} y={240} col={C.cream} size={62} />
      <Lbl t={t} at={m.puente + 0.2} text="puente de adherencia" x={960} y={240} col={C.honey} size={62} />
    </>
  );
};

// 14 · el contrapiso chupa: corte con poros; el agua del yeso fresco se va hacia abajo en gotas, y en la unión queda una
// capa de polvo (punteada) que suena hueco y se abre
export const ChupaAgua: React.FC<FxP> = ({ t, a, m }) => {
  const r = e(t, m.roba, m.roba + 2.5), pv = e(t, m.polvo, m.polvo + 1), gap = e(t, m.polvo + 1.4, m.polvo + 2.4);
  return (
    <>
      <Svg>
        <Capas x={260} y={940} w={1400} capas={[{ h: 300, k: 1, tipo: "cont" }]} />
        {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={300 + 1320 * hash(i, 41)} cy={680 + 220 * hash(i, 42)} r={10 + 10 * hash(i, 43)} fill="#4e4a44" />)}
        <g transform={`translate(0,${-24 * gap})`}>
          <rect x={260} y={440} width={1400} height={200} fill={YESO} />
          <rect x={260} y={440} width={1400} height={200} fill="#7c8a96" opacity={0.4 * (1 - r)} />
          <rect x={260} y={600} width={1400} height={40} fill="#e9e0cc" opacity={pv} />
          {Array.from({ length: 70 }, (_, i) => <circle key={i} cx={270 + 1380 * hash(i, 44)} cy={604 + 32 * hash(i, 45)} r={3} fill="#b7ad98" opacity={pv} />)}
        </g>
        {Array.from({ length: 16 }, (_, i) => { const u = ((t - m.roba) * 0.8 + i * 0.07) % 1; return t > m.roba && <circle key={i} cx={320 + i * 85} cy={480 + u * 340} r={11} fill={C.water} opacity={(1 - r * 0.5) * (1 - u)} />; })}
      </Svg>
      <Lbl t={t} at={m.roba} out={m.polvo} text="el contrapiso le roba el agua" x={960} y={280} col={C.solv} size={64} />
      <Lbl t={t} at={m.polvo + 0.2} text="capa de polvo: suena hueco" x={960} y={280} col={C.red} size={64} />
    </>
  );
};

// 15 · 1 + 4: un vaso de cola y cuatro de agua caen al balde de a uno, el agua se pone lechosa; el rodillo pasa
export const ColaUnoCuatro: React.FC<FxP> = ({ t, a, b }) => {
  const cups = [0, 1, 2, 3, 4], lv = e(t, a + 0.6, a + 3.6), lec = e(t, a + 3.4, a + 4.4), rod = e(t, a + 4.6, Math.min(b, a + 8));
  return (
    <>
      <Svg>
        {cups.map((i) => { const at = a + 0.5 + i * 0.6, k = e(t, at, at + 0.5); return (
          <g key={i} transform={`translate(${lerp(260 + i * 150, 760, k)},${lerp(300, 480, k)}) rotate(${110 * k})`} opacity={1 - e(t, at + 0.5, at + 0.7)}>
            <rect x={-45} y={-70} width={90} height={140} rx={10} fill="rgba(230,240,250,.35)" stroke="#fff" strokeWidth={4} />
            <rect x={-40} y={-20} width={80} height={86} rx={8} fill={i === 0 ? C.milk : C.water} />
          </g>); })}
        <Balde x={760} y={880} s={1.1} lvl={0.15 + 0.6 * lv} liq={lec > 0.5 ? "#e7e9e6" : `rgba(${Math.round(lerp(124, 231, lec))},${Math.round(lerp(200, 233, lec))},${Math.round(lerp(255, 230, lec))},1)`} />
        <rect x={1100} y={600} width={600} height={300} fill={CONT} />
        <rect x={1100} y={600} width={600 * rod} height={300} fill="#f3efe4" opacity={0.6} /><rect x={1100} y={600} width={600 * rod} height={18} fill="#fffaf0" opacity={0.7} />
        {rod > 0 && rod < 1 && <g transform={`translate(${1100 + 600 * rod},640)`}><rect x={-30} y={-20} width={60} height={240} rx={26} fill="#f0d9a6" /><line x1={0} y1={-20} x2={70} y2={-140} stroke="#5e5547" strokeWidth={10} /></g>}
      </Svg>
      <Lbl t={t} at={a + 0.6} text="1 de cola" x={300} y={200} col={C.milk} size={58} />
      <Lbl t={t} at={a + 1.2} text="+ 4 de agua" x={690} y={200} col={C.solv} size={58} />
      <Lbl t={t} at={a + 4.6} text="sin charcos" x={1400} y={980} col={C.honey} size={58} />
    </>
  );
};
