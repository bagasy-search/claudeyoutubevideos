// fb5nc · componentes 17-32 (proporción, tamiz, seguridad, mezcla, agua, tiempo, compactación, juntas, curado). f(t) con
// sus marcas (m.*). Ninguno se repite con cl2nov ni con fb5na/fb5nb.
import React from "react";
import { C, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Cross, FxP, Svg, Tick, shake } from "./kit";
import { Balde, Bolsa, Brillo, Capas, CLARA, Copo, Juntas, Ladrillo, Llana, Losa, MAD, NEGRA, Pala, Pison, quad, Regadera, Regla, SC, SCM, Sol, Tarja } from "./piso";

const Fila: React.FC<{ x: number; y: number; n: number; k: number; col: string; s?: number; gap?: number }> = ({ x, y, n, k, col, s = 0.42, gap = 150 }) => (
  <g>{Array.from({ length: n }, (_, i) => { const q = cl(k * n - i); return q > 0 && <g key={i} transform={`translate(${x + i * gap},${y - (1 - q) * 120})`} opacity={q}><Balde x={0} y={0} s={s} lvl={0.88} liq={col} /></g>; })}</g>
);

// 17 · dos recetas en filas de baldes: patio = 1 de cemento cada 8 de tierra; entrada de auto = 1 cada 6 (la fila se achica)
export const DosRecetas: React.FC<FxP> = ({ t, a, m }) => {
  const p0 = Math.min(m.pat, a + 0.3), p = e(t, p0, p0 + 2.4), au = e(t, m.aut, m.aut + 1.8);
  return (
    <>
      <Svg>
        <text x={190} y={470} textAnchor="end" fontSize={60} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed" opacity={p}>PATIO</text>
        <Fila x={300} y={520} n={8} k={p} col={CLARA} />
        <Fila x={1540} y={520} n={1} k={e(t, p0 + 2.2, p0 + 2.7)} col="#c9cbcc" />
        <text x={1660} y={600} fontSize={72} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed" opacity={p}>1 : 8</text>
        {au > 0.02 && <g opacity={au}>
          <text x={190} y={840} textAnchor="end" fontSize={52} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">AUTO</text>
          <Fila x={300} y={890} n={6} k={au} col={CLARA} />
          <Fila x={1240} y={890} n={1} k={e(t, m.aut + 1.4, m.aut + 1.9)} col="#c9cbcc" />
          <text x={1360} y={970} fontSize={72} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">1 : 6</text></g>}
        {t > m.vol && <g transform={`translate(960,${lerp(-200, 170, spr(t, m.vol))})`}><Tarja x={0} y={0} w={460} txt="en volumen, no en peso" col={C.honey} size={50} /></g>}
      </Svg>
    </>
  );
};

// 18 · la zaranda: malla de 1 cm apoyada en dos ladrillos; la pala tira tierra, lo fino cae del otro lado y quedan arriba
// las piedras, los terrones y una raíz; al final la bolsa común de 50 kg, «nada especial»
export const ZarandaLadrillos: React.FC<FxP> = ({ t, a, m }) => {
  const m0 = Math.min(m.mal, a + 0.3), l0 = Math.min(m.lad, a + 0.9);
  const mal = e(t, m0, m0 + 1), lad = spr(t, l0), tir = t > m.pie - 1.5 ? ((t - m.pie + 1.5) * 0.6) % 1 : -1, pie = e(t, m.pie, m.pie + 1.2), com = spr(t, m.com);
  return (
    <>
      <Svg>
        <g opacity={1 - e(t, m.com - 0.3, m.com + 0.2) * 0.6}>
          {t > l0 && <g opacity={lad}><Ladrillo x={600} y={900} w={110} h={150} /><Ladrillo x={1300} y={900} w={110} h={150} /></g>}
          <g transform={`translate(950,${640 + (1 - mal) * -500}) rotate(-12)`} opacity={mal}>
            <rect x={-420} y={-220} width={840} height={440} fill="none" stroke="#9aa4ac" strokeWidth={14} />
            {Array.from({ length: 15 }, (_, i) => <line key={"a" + i} x1={-420 + i * 60} y1={-220} x2={-420 + i * 60} y2={220} stroke="#b9c2c9" strokeWidth={3} />)}
            {Array.from({ length: 8 }, (_, i) => <line key={"b" + i} x1={-420} y1={-220 + i * 60} x2={420} y2={-220 + i * 60} stroke="#b9c2c9" strokeWidth={3} />)}
            {pie > 0.02 && Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx={-300 + 600 * hash(i, 1)} cy={-150 + 260 * hash(i, 2)} rx={24 + 20 * hash(i, 3)} ry={18 + 10 * hash(i, 4)} fill={i % 4 === 0 ? "#6a4a2c" : "#8b8f92"} opacity={pie} />)}
            {pie > 0.02 && <path d="M-200,40 q60,-40 120,0 t120,10 t90,-20" stroke="#c8a873" strokeWidth={8} fill="none" opacity={pie} />}
          </g>
          {tir >= 0 && <g>{Array.from({ length: 40 }, (_, i) => { const ph = (tir + hash(i, 7)) % 1; return <circle key={i} cx={760 + 400 * hash(i, 8)} cy={720 + ph * 260} r={4} fill={CLARA} opacity={1 - ph} />; })}</g>}
          <path d={`M640,980 Q960,${980 - 120 * e(t, m.mal + 1, m.com)} 1280,980 Z`} fill={CLARA} />
        </g>
        {t > m.com && <g transform={`translate(1600,${lerp(1300, 680, com)})`}><Bolsa x={0} y={0} s={1.15} /></g>}
      </Svg>
      <Lbl t={t} at={m0} out={m.pie} text="malla de 1 cm" x={960} y={210} col={C.cream} size={76} />
      <Lbl t={t} at={m.pie} out={m.com} text="piedras, terrones, raíces" x={960} y={210} col={C.red} size={66} />
      <Lbl t={t} at={m.com} text="el común de bolsa" x={760} y={210} col={C.cream} size={70} />
    </>
  );
};

// 18b · seguridad: el brazo sin guante, con el reloj que avanza una hora, se pone rojo; el guante largo de goma lo cubre;
// la cara con antiparras frena una gota; si salpica, el chorro de agua limpia
export const QuemaALaHora: React.FC<FxP> = ({ t, m }) => {
  const hora = e(t, m.hora, m.hora + 1.6), guan = e(t, m.guan, m.guan + 0.8) * (1 - e(t, m.que - 0.3, m.que)) + e(t, m.ojo - 0.3, m.ojo) * 1, anti = e(t, m.anti, m.anti + 0.8), ojo = e(t, m.ojo, m.ojo + 1.2), ag = e(t, m.agua, m.agua + 0.6);
  return (
    <>
      <Svg>
        <g transform="translate(560,560)">
          <g transform="translate(-60,-20)">
            <rect x={-300} y={-70} width={380} height={140} rx={60} fill={`rgb(${lerp(217, 214, hora)},${lerp(162, 90, hora)},${lerp(122, 80, hora)})`} />
            <ellipse cx={130} cy={0} rx={95} ry={85} fill={`rgb(${lerp(217, 214, hora)},${lerp(162, 90, hora)},${lerp(122, 80, hora)})`} />
            {[-54, -18, 18, 54].map((fy) => <rect key={fy} x={190} y={fy - 16} width={90} height={32} rx={16} fill={`rgb(${lerp(217, 214, hora)},${lerp(162, 90, hora)},${lerp(122, 80, hora)})`} />)}
            <rect x={90} y={-120} width={36} height={80} rx={18} transform="rotate(-30 108 -80)" fill={`rgb(${lerp(217, 214, hora)},${lerp(162, 90, hora)},${lerp(122, 80, hora)})`} />
            {hora > 0.3 && Array.from({ length: 6 }, (_, i) => <circle key={i} cx={-220 + 70 * i} cy={-20 + 40 * hash(i, 1)} r={14 + 8 * hash(i, 2)} fill="#c0392b" opacity={0.6 * hora} />)}
            {guan > 0.02 && <g opacity={guan}>
              <rect x={-320} y={-84} width={410} height={168} rx={70} fill="#e2b33a" stroke="#b0861e" strokeWidth={5} />
              <rect x={-330} y={-96} width={70} height={192} rx={20} fill="#c99a26" />
              <ellipse cx={130} cy={0} rx={105} ry={95} fill="#e2b33a" stroke="#b0861e" strokeWidth={5} />
              {[-56, -19, 18, 55].map((fy) => <rect key={fy} x={190} y={fy - 19} width={102} height={38} rx={19} fill="#e2b33a" stroke="#b0861e" strokeWidth={4} />)}
            </g>}
          </g>
          {t > m.que && t < m.ojo && <g transform="translate(150,-340)"><circle r={90} fill="rgba(30,20,10,.85)" stroke="rgba(255,236,200,.45)" strokeWidth={5} /><line x2={0} y2={-64} stroke={C.honey} strokeWidth={8} strokeLinecap="round" transform={`rotate(${360 * e(t, m.hora - 0.4, m.hora + 1.6)})`} /><text y={140} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">1 HORA</text></g>}
        </g>
        <g transform="translate(1340,520)">
          <ellipse rx={230} ry={260} fill="#d9a27a" />
          <ellipse cx={-80} cy={-30} rx={44} ry={28} fill="#fff" /><circle cx={-80} cy={-30} r={16} fill="#3b2a1a" /><ellipse cx={80} cy={-30} rx={44} ry={28} fill="#fff" /><circle cx={80} cy={-30} r={16} fill="#3b2a1a" />
          {anti > 0.02 && <g opacity={anti}><rect x={-190} y={-90} width={380} height={120} rx={50} fill="rgba(180,220,240,.45)" stroke="#2a3640" strokeWidth={12} /><rect x={-230} y={-50} width={40} height={30} fill="#2a3640" /><rect x={190} y={-50} width={40} height={30} fill="#2a3640" /></g>}
          {ojo > 0.02 && ojo < 0.99 && <circle cx={lerp(-260, -80, ojo)} cy={lerp(-300, -60, ojo)} r={16} fill="#c9cbcc" />}
          {ag > 0.02 && Array.from({ length: 18 }, (_, i) => { const ph = (t * 2 + hash(i, 3)) % 1; return <line key={i} x1={-300 + ph * 200} y1={-260 + ph * 220 + 20 * hash(i, 4)} x2={-290 + ph * 200} y2={-250 + ph * 220 + 20 * hash(i, 4)} stroke="#7cc8ff" strokeWidth={6} opacity={ag} />; })}
        </g>
      </Svg>
      <Lbl t={t} at={m.guan} out={m.que} text="guantes largos de goma" x={560} y={960} col={C.cream} size={60} />
      <Lbl t={t} at={m.que} out={m.ojo} text="quema a la hora" x={560} y={960} col={C.red} size={70} />
      <Lbl t={t} at={m.anti} text="antiparras" x={1340} y={960} col={C.honey} size={70} />
      <Lbl t={t} at={m.agua} text="agua limpia, mucha" x={960} y={170} col={C.ok} size={70} />
    </>
  );
};

// 19 · el volcán en seco visto desde arriba: el montón de tierra, el cráter, el balde de cemento adentro; la pala da tres
// vueltas (contador) y las vetas grises y marrones se funden en un gris clarito parejo
export const VolcanSeco: React.FC<FxP> = ({ t, m }) => {
  const vol = e(t, m.vol, m.vol + 1.2), cem = e(t, m.cem, m.cem + 1), mix = e(t, m.tres - 1, m.par + 1), vuelta = Math.min(3, Math.floor(e(t, m.tres - 1, m.par) * 3.99));
  const par = e(t, m.par, m.par + 1.5), man = e(t, m.man, m.man + 0.6) * (1 - e(t, m.man + 2, m.man + 3));
  const col = `rgb(${lerp(168, 190, par)},${lerp(132, 180, par)},${lerp(86, 160, par)})`;
  return (
    <>
      <Svg>
        <g transform={`translate(960,560) rotate(${mix * 360 * 1.5})`}>
          <ellipse rx={520} ry={360} fill={col} />
          {par < 0.99 && Array.from({ length: 26 }, (_, i) => <path key={i} d={`M${-400 + 800 * hash(i, 1)},${-260 + 520 * hash(i, 2)} q${80 * hash(i, 3)},${-40} ${160},0`} stroke={i % 2 ? "#d4d6d8" : "#7a5a35"} strokeWidth={22} strokeLinecap="round" fill="none" opacity={cl(mix * 2) * (1 - par) + man} />)}
          {vol > 0.02 && mix < 0.15 && <ellipse rx={200 * vol} ry={130 * vol} fill="#7d5f3b" opacity={0.9} />}
          {cem > 0.02 && mix < 0.15 && <ellipse rx={170 * cem} ry={110 * cem} fill="#c9cbcc" />}
        </g>
        {t > m.cem - 1 && t < m.cem + 0.6 && <g transform={`translate(${lerp(1500, 1080, e(t, m.cem - 1, m.cem))},${300}) rotate(${-80 * e(t, m.cem - 0.4, m.cem + 0.3)})`} ><g transform="scale(0.5)"><Balde x={0} y={0} lvl={0.8} liq="#c9cbcc" /></g></g>}
        {t > m.tres - 1 && t < m.par + 1 && <g transform={`translate(${960 + 420 * Math.cos(t * 2.4)},${560 + 260 * Math.sin(t * 2.4)}) rotate(${t * 140})`}><Pala x={0} y={0} s={0.7} carga={0.6} col={col} /></g>}
        {t > m.tres && <g transform="translate(1660,250)"><circle r={90} fill="rgba(30,20,10,.85)" stroke="rgba(255,236,200,.45)" strokeWidth={5} /><text y={36} textAnchor="middle" fontSize={110} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">{vuelta}</text><text y={140} textAnchor="middle" fontSize={36} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">VUELTAS</text></g>}
      </Svg>
      <Lbl t={t} at={m.seco} out={m.vol} text="primero, en seco" x={960} y={980} col={C.cream} size={76} />
      <Lbl t={t} at={m.vol} out={m.tres} text="como un volcán" x={960} y={980} col={C.honey} size={76} />
      <Lbl t={t} at={m.par} out={m.man} text="gris clarito, parejo" x={960} y={980} col={C.ok} size={72} />
      <Lbl t={t} at={m.man} text="manchones: seguí" x={960} y={980} col={C.red} size={72} />
    </>
  );
};

// 20 · el agua: la manguera a chorro abre un pozo (cruz); la regadera da lluvia fina; el contador «rociás · mezclás»;
// dos muestras: tierra húmeda (bien) y barro brillante (te pasaste)
export const RegaderaNoManguera: React.FC<FxP> = ({ t, m }) => {
  const man = e(t, m.agua, m.agua + 0.6) * (1 - e(t, m.reg, m.reg + 0.4)), reg = e(t, m.reg, m.reg + 0.6), ciclo = t > m.rm ? Math.floor((t - m.rm) / 0.9) : -1, mues = e(t, m.hum - 0.3, m.hum + 0.6);
  return (
    <>
      <Svg>
        <g opacity={1 - mues}>
          <ellipse cx={960} cy={760} rx={520} ry={150} fill={CLARA} />
          {man > 0.02 && <g opacity={man}><path d="M1500,260 Q1250,260 1100,420" stroke="#3a7d3a" strokeWidth={30} fill="none" strokeLinecap="round" />
            {Array.from({ length: 20 }, (_, i) => { const ph = (t * 3 + hash(i, 1)) % 1; return <line key={i} x1={1100 - ph * 140} y1={420 + ph * 320} x2={1094 - ph * 140} y2={440 + ph * 320} stroke="#7cc8ff" strokeWidth={10} />; })}
            <ellipse cx={940} cy={760} rx={90} ry={34} fill="#5d4129" /><Cross t={t} at={m.agua + 0.6} x={1300} y={500} r={46} /></g>}
          {reg > 0.02 && <g opacity={reg}><Regadera x={720} y={360} rot={22 + 8 * Math.sin(t * 2)} o={ciclo % 2 === 0 || ciclo < 0 ? 1 : 0.15} t={t} s={1.1} /><Tick t={t} at={m.reg + 0.8} x={1300} y={500} r={46} /></g>}
          {ciclo >= 0 && <text x={960} y={980} textAnchor="middle" fontSize={64} fontWeight={800} fill={ciclo % 2 ? C.honey : "#7cc8ff"} fontFamily="Barlow Condensed">{ciclo % 2 ? "MEZCLÁS" : "ROCIÁS"}</text>}
        </g>
        {mues > 0.02 && <g opacity={mues}>
          <g transform="translate(600,560)"><ellipse rx={300} ry={190} fill="#9a774c" />{Array.from({ length: 50 }, (_, i) => <circle key={i} cx={-260 + 520 * hash(i, 3)} cy={-150 + 300 * hash(i, 4)} r={6 + 6 * hash(i, 5)} fill="#7d5f3b" />)}
            <text y={270} textAnchor="middle" fontSize={56} fontWeight={800} fill={C.ok} fontFamily="Barlow Condensed">TIERRA HÚMEDA</text></g>
          <Tick t={t} at={m.hum + 0.6} x={830} y={400} r={40} />
          {t > m.barro && <g transform={`translate(1320,560) scale(${spr(t, m.barro)})`}><ellipse rx={300} ry={190} fill="#5d4129" /><ellipse cx={-80} cy={-60} rx={140} ry={30} fill="#fff" opacity={0.25} />
            <text y={270} textAnchor="middle" fontSize={56} fontWeight={800} fill={C.red} fontFamily="Barlow Condensed">BARRO: TE PASASTE</text></g>}
          <Cross t={t} at={m.barro + 0.6} x={1550} y={400} r={40} />
        </g>}
      </Svg>
      <Lbl t={t} at={m.pun} out={m.hum - 0.3} text="y la prueba del puño" x={960} y={180} col={C.cream} size={66} />
    </>
  );
};

// 21 · la regla de oro: un reloj de 90 minutos que se llena en un anillo; al final los puentes se cortan (chispa roja);
// una sola montaña grande se reemplaza por varias tandas chicas que entran a tiempo
export const HoraYMedia: React.FC<FxP> = ({ t, m }) => {
  const ring = e(t, m.hora, m.rom), rom = e(t, m.rom, m.rom + 1), tan = e(t, m.tan, m.tan + 1.4);
  const arc = (k: number) => { const ang = -Math.PI / 2 + k * Math.PI * 2 * 0.999, x = 960 + 300 * Math.cos(ang), y = 520 + 300 * Math.sin(ang); return `M960,220 A300,300 0 ${k > 0.5 ? 1 : 0} 1 ${x},${y}`; };
  return (
    <>
      <Svg>
        <g opacity={1 - tan}>
          <circle cx={960} cy={520} r={300} fill="rgba(30,20,10,.85)" stroke="rgba(255,236,200,.25)" strokeWidth={34} />
          {ring > 0.005 && <path d={arc(ring)} stroke={ring > 0.85 ? C.red : C.honey} strokeWidth={34} fill="none" strokeLinecap="round" />}
          <text x={960} y={560} textAnchor="middle" fontSize={140} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">{Math.round(90 * ring)}′</text>
          {rom > 0.02 && Array.from({ length: 5 }, (_, i) => <g key={i} transform={`translate(${760 + i * 100},${880})`}><circle cx={-30} r={22} fill={CLARA} /><circle cx={30} r={22} fill={CLARA} /><line x1={-8} x2={-8 + 16 * (1 - rom)} stroke="#c9cbcc" strokeWidth={8} /><line x1={8 - 16 * (1 - rom)} x2={8} stroke="#c9cbcc" strokeWidth={8} /></g>)}
        </g>
        {tan > 0.02 && <g opacity={tan}>
          <g transform="translate(520,640)"><path d="M-260,160 Q0,-260 260,160 Z" fill={CLARA} /><Cross t={t} at={m.tan + 0.6} x={0} y={-200} r={50} /></g>
          {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${1100 + i * 190},${720}) scale(${spr(t, m.tan + 0.4 + i * 0.25)})`}><path d="M-80,80 Q0,-60 80,80 Z" fill={SC} /></g>)}
          <Tick t={t} at={m.tan + 1.6} x={1380} y={520} r={50} />
        </g>}
      </Svg>
      <Lbl t={t} at={m.oro} out={m.tan} text="compactado en 1 h 30" x={960} y={950} col={C.honey} size={70} />
      <Lbl t={t} at={m.tan} text="por tandas" x={960} y={950} col={C.ok} size={84} />
    </>
  );
};

// 22 · dos capas de siete: el corte de 14 cm de una sola vez (los puntos de densidad se aprietan arriba y quedan sueltos
// abajo) contra dos capas de 7 compactadas (apretadas parejo)
export const DosDeSiete: React.FC<FxP> = ({ t, m }) => {
  const dos = e(t, m.dos, m.dos + 1), jun = e(t, m.jun, m.jun + 1.4);
  const Dens: React.FC<{ x: number; y: number; h: number; f: (v: number) => number; n?: number }> = ({ x, y, h, f, n = 160 }) => <g>{Array.from({ length: n }, (_, i) => { const v = hash(i, 1); if (hash(i, 2) > f(v)) return null; return <circle key={i} cx={x + 20 + 520 * hash(i, 3)} cy={y - h + v * h} r={5} fill="#5f5548" />; })}</g>;
  return (
    <>
      <Svg>
        <g transform={`translate(${-300 * dos},0)`} opacity={1 - 0.3 * dos}>
          <Capas x={340} y={880} w={560} capas={[{ h: 260, k: e(t, m.vol, m.vol + 1), tipo: "sc" }]} />
          {jun > 0.02 && <Dens x={340} y={880} h={260} f={(v) => (1 - v) * jun} />}
          {jun > 0.02 && <><text x={620} y={590} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.ok} fontFamily="Barlow Condensed" opacity={jun}>DURO</text><text x={620} y={860} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.red} fontFamily="Barlow Condensed" opacity={jun}>FLOJO</text></>}
          <text x={620} y={960} textAnchor="middle" fontSize={56} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">14 DE UNA</text>
          <Cross t={t} at={m.jun + 1.4} x={860} y={560} r={42} />
        </g>
        {dos > 0.02 && <g opacity={dos} transform={`translate(${lerp(600, 0, dos)},0)`}>
          <Capas x={1060} y={880} w={560} capas={[{ h: 130, k: 1, tipo: "sc" }, { h: 130, k: e(t, m.dos + 0.6, m.dos + 1.4), tipo: "sc", moj: 0.3 }]} />
          <line x1={1060} x2={1620} y1={750} y2={750} stroke="#4b4238" strokeWidth={4} strokeDasharray="12 8" />
          <Dens x={1060} y={880} h={260} f={() => 0.85 * dos} />
          <text x={1340} y={960} textAnchor="middle" fontSize={56} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">7 + 7</text>
          <Tick t={t} at={m.dos + 1.6} x={1580} y={560} r={42} /></g>}
      </Svg>
      <Lbl t={t} at={m.dos} text="dos capas de siete" x={960} y={220} col={C.honey} size={80} />
    </>
  );
};

// 23 · golpe al lado de golpe: vista de arriba, el taco de 20×20 deja huellas superpuestas fila por fila, después la
// pasada cruzada; la onda del sonido pasa de «sorda» a «seca» y la zapatilla no se hunde
export const GolpeAlLado: React.FC<FxP> = ({ t, m }) => {
  const N = 30, k1 = e(t, m.gol, m.cru), k2 = e(t, m.cru, m.cru + 3), seco = e(t, m.seco, m.seco + 0.5), zap = e(t, m.zap, m.zap + 1.2);
  const idx = Math.floor(k1 * N), cur = k1 < 1 ? idx : Math.floor(k2 * N);
  const pos = (i: number, cruz: boolean) => { const r = Math.floor(i / 6), c = i % 6; return cruz ? [520 + r * 180, 280 + c * 100] : [520 + c * 150, 280 + r * 120]; };
  const [hx, hy] = k1 < 1 ? pos(idx, false) : pos(cur, true);
  return (
    <>
      <Svg>
        <g opacity={1 - zap * 0.75}>
          <rect x={430} y={200} width={1060} height={680} rx={20} fill={SC} /><rect x={430} y={200} width={1060} height={680} rx={20} fill="#5f5548" opacity={0.35 * (1 - k2)} />
          {Array.from({ length: Math.min(N, idx) }, (_, i) => { const [x, y] = pos(i, false); return <rect key={i} x={x - 82} y={y - 66} width={164} height={132} rx={6} fill="rgba(60,50,40,.28)" stroke="rgba(60,50,40,.35)" strokeWidth={2} />; })}
          {k1 >= 1 && Array.from({ length: Math.min(N, cur) }, (_, i) => { const [x, y] = pos(i, true); return <rect key={"c" + i} x={x - 66} y={y - 82} width={132} height={164} rx={6} fill="rgba(60,50,40,.18)" />; })}
          {t > m.gol && k2 < 1 && <g transform={`translate(${hx},${hy}) scale(${0.9 + 0.12 * Math.abs(Math.sin(t * 9))})`}><rect x={-80} y={-80} width={160} height={160} rx={10} fill={MAD} stroke="#5e3a1c" strokeWidth={5} /><circle r={18} fill="#b98a55" /></g>}
        </g>
        {t > m.pis && t < m.gol && <g transform="translate(1660,820)" opacity={e(t, m.pis, m.pis + 0.5)}><Pison x={0} y={0} s={1.2} lift={Math.abs(Math.sin(t * 4)) * 0.4} /></g>}
        {t > m.taco && t < m.gol && <text x={1660} y={330} textAnchor="middle" fontSize={56} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">20 × 20</text>}
        {t > m.seco && <g transform="translate(960,560)" opacity={1 - zap}>
          <path d={Array.from({ length: 60 }, (_, i) => `${i ? "L" : "M"}${-500 + i * 17},${(Math.sin(i * 0.9 + t * 10) * (seco < 1 ? 60 : 140) * Math.exp(-i / (seco < 1 ? 40 : 10)))}`).join(" ")} stroke={C.honey} strokeWidth={8} fill="none" />
          <text y={140} textAnchor="middle" fontSize={60} fontWeight={800} fill={C.ok} fontFamily="Barlow Condensed" opacity={seco}>SECO, NO SORDO</text></g>}
        {zap > 0.02 && <g opacity={zap} transform="translate(960,620)"><path d="M-170,0 Q-180,-80 -100,-90 L120,-110 Q190,-110 190,-50 L190,0 Z" fill="#e9e1cf" /><rect x={-180} y={0} width={380} height={30} rx={12} fill="#2a3640" /><line x1={-260} x2={300} y1={34} y2={34} stroke="#8f8473" strokeWidth={6} />
          <Tick t={t} at={m.zap + 1} x={300} y={-120} r={42} /></g>}
      </Svg>
      <Lbl t={t} at={m.pri} out={m.gol} text="primera capa: 7 cm" x={960} y={980} col={C.cream} size={70} />
      <Lbl t={t} at={m.gol} out={m.cru} text="golpe al lado de golpe" x={960} y={980} col={C.honey} size={70} />
      <Lbl t={t} at={m.cru} out={m.seco} text="y pasada cruzada" x={960} y={980} col={C.honey} size={70} />
      <Lbl t={t} at={m.zap} text="no se hunde" x={960} y={980} col={C.ok} size={80} />
    </>
  );
};

// 24 · terminar: el rastrillo raya la primera capa (líneas en el corte), cae la segunda; vista de arriba la regla corre
// en zigzag sobre las tablas, un bajo se rellena; la llana cierra y el brillo corre
export const RastrilloRegla: React.FC<FxP> = ({ t, m }) => {
  const ray = e(t, m.ray, m.ray + 1.5), seg = e(t, m.seg, m.seg + 1.2), vista = e(t, m.reg - 0.4, m.reg + 0.3), zz = e(t, m.reg, m.fal), fal = e(t, m.fal, m.fal + 1.5), lla = e(t, m.lla, m.lla + 2.5);
  return (
    <>
      <Svg>
        <g opacity={1 - vista} transform={`translate(0,${420 * vista})`}>
          <Capas x={360} y={880} w={1200} capas={[{ h: 120, k: 1, tipo: "clara" }, { h: 120, k: 1, tipo: "sc" }, { h: 120, k: seg, tipo: "sc", moj: 0.4 }]} />
          {ray > 0.02 && Array.from({ length: 24 }, (_, i) => <path key={i} d={`M${380 + i * 50},640 l14,14 l14,-14`} stroke="#4b4238" strokeWidth={5} fill="none" opacity={cl(ray * 24 - i)} />)}
          {ray > 0.02 && ray < 0.99 && <g transform={`translate(${380 + 1150 * ray},560)`}><rect x={-6} y={-300} width={12} height={300} fill="#b98a55" /><rect x={-90} y={-10} width={180} height={18} fill="#6c7378" />{Array.from({ length: 9 }, (_, i) => <rect key={i} x={-86 + i * 20} y={6} width={6} height={36} fill="#6c7378" />)}</g>}
        </g>
        {vista > 0.02 && <g opacity={vista} transform={`translate(0,${-380 * (1 - vista)})`}>
          <Losa cx={960} y={300} w={1300} d={560} h={50} top="#9f927d">
            {(f) => <>
              {fal > 0.02 && <ellipse cx={f(0.62, 0.55)[0]} cy={f(0.62, 0.55)[1]} rx={130} ry={50} fill="#6f6556" opacity={1 - fal} />}
              {lla > 0.02 && <polygon points={quad(f, 0, 0, lla, 1)} fill="#b9ad97" />}
              {lla > 0.02 && <Brillo id="rr" pts={quad(f, 0, 0, lla, 1)} k={e(t, m.lla + 0.5, m.lla + 3)} o={0.5} />}
              <polygon points={quad(f, 0, 0, 1, 1)} fill="none" stroke={MAD} strokeWidth={16} />
            </>}
          </Losa>
          {zz > 0.01 && zz < 0.99 && <Regla x={960 + 140 * Math.sin(zz * Math.PI * 8)} y={lerp(330, 820, zz)} l={1150 + 200 * zz} rot={6 * Math.sin(zz * Math.PI * 8)} />}
          {lla > 0.02 && lla < 0.99 && <Llana x={lerp(380, 1600, lla)} y={560 + 40 * Math.sin(t * 5)} s={1.1} />}
        </g>}
      </Svg>
      <Lbl t={t} at={m.ray} out={m.seg} text="rayás la primera" x={960} y={220} col={C.cream} size={72} />
      <Lbl t={t} at={m.reg} out={m.lla} text="regla en zigzag" x={960} y={980} col={C.cream} size={72} />
      <Lbl t={t} at={m.lla} text="llana: cerrar la superficie" x={960} y={980} col={C.honey} size={66} />
    </>
  );
};

// 25 · la losa entera respira: sol y luna se turnan, la losa de 6 × 6 se estira y se achica; las tensiones se juntan
// en flechas y aparece la grieta en diagonal, cruzando el patio en el peor lugar
export const LosaRespira: React.FC<FxP> = ({ t, m }) => {
  const enc = e(t, m.enc, m.enc + 1), ciclo = t > m.cal ? Math.sin((t - m.cal) * 1.6) : 0, sc = 1 + 0.025 * ciclo * enc - 0.02 * enc, rom = e(t, m.diag - 0.3, m.diag + 1.5);
  return (
    <>
      <Svg>
        {t > m.cal && <><Sol x={300} y={220} r={60} o={cl(ciclo)} rot={t * 10} /><g opacity={cl(-ciclo)}><circle cx={1620} cy={220} r={56} fill="#e6e2d6" /><circle cx={1644} cy={204} r={50} fill={C.night} /></g></>}
        <g transform={`translate(960,600) scale(${sc},${sc})`}>
          <Losa cx={0} y={-260} w={1100} d={520} h={50}>
            {(f) => <>
              {t > m.seis && <text x={f(0.5, 0.5)[0]} y={f(0.5, 0.5)[1] + 20} textAnchor="middle" fontSize={84} fontWeight={800} fill="rgba(60,50,40,.45)" fontFamily="Barlow Condensed" opacity={spr(t, m.seis)}>6 × 6 M</text>}
              {t > m.rom && [[0.1, 0.1], [0.9, 0.1], [0.1, 0.9], [0.9, 0.9]].map(([u, v], i) => { const [x, y] = f(u, v), [cx, cy] = f(0.5, 0.5); const k = e(t, m.rom, m.rom + 1.2); return <line key={i} x1={x} y1={y} x2={lerp(x, cx, 0.4 * k)} y2={lerp(y, cy, 0.4 * k)} stroke={C.red} strokeWidth={8} opacity={0.7} />; })}
              {rom > 0.02 && <path d={(() => { const pts = Array.from({ length: 9 }, (_, i) => { const [x, y] = f(0.05 + i * 0.11, 0.08 + i * 0.105); return [x + 26 * (hash(i, 7) - 0.5), y]; }); return pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" "); })()} stroke="#2b221a" strokeWidth={9} fill="none" strokeDasharray="2000" strokeDashoffset={2000 * (1 - rom)} />}
            </>}
          </Losa>
        </g>
      </Svg>
      <Lbl t={t} at={m.enc} out={m.cal} text="se encoge al fraguar" x={960} y={980} col={C.cream} size={70} />
      <Lbl t={t} at={m.cal} out={m.rom} text="calor estira · frío achica" x={960} y={980} col={C.honey} size={66} />
      <Lbl t={t} at={m.diag} text="se rompe donde quiere" x={960} y={980} col={C.red} size={72} />
    </>
  );
};

// 26 · decirle dónde: la misma losa se corta en paños (líneas que se dibujan); la grieta llega y se mete justo en la
// junta; la regla de 2,5 × 2,5 con su cota; un paño largo de 2 × 6 se parte al medio
export const DecirleDonde: React.FC<FxP> = ({ t, m }) => {
  const cor = e(t, m.cor, m.cor + 1.6), jun = e(t, m.jun, m.jun + 1), reg = e(t, m.regla - 0.3, m.regla + 0.4), lar = e(t, m.lar, m.lar + 0.6), lr = e(t, m.lar + 1.4, m.lar + 2.4);
  return (
    <>
      <Svg>
        <g opacity={1 - reg} transform={`translate(0,${-40 * reg})`}>
          <Losa cx={960} y={320} w={1100} d={520} h={50}>
            {(f) => <><Juntas f={f} nu={3} nv={3} k={cor} col="#4b4238" w={9} />
              {jun > 0.02 && <line x1={f(2 / 3, 0)[0]} y1={f(2 / 3, 0)[1]} x2={f(2 / 3, jun * 0.66)[0]} y2={f(2 / 3, jun * 0.66)[1]} stroke="#1b1610" strokeWidth={5} />}</>}
          </Losa>
        </g>
        {reg > 0.02 && <g opacity={reg * (1 - lar * 0.3)}>
          <rect x={460} y={300} width={460} height={460} fill={SC} stroke="#4b4238" strokeWidth={8} />
          <text x={690} y={280} textAnchor="middle" fontSize={56} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">2,5 M</text>
          <text x={430} y={540} textAnchor="end" fontSize={56} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">2,5 M</text>
          <Tick t={t} at={m.regla + 1.2} x={690} y={530} r={60} /></g>}
        {lar > 0.02 && <g opacity={lar} transform={`translate(${lerp(400, 0, lar)},0)`}>
          <rect x={1140} y={180} width={200} height={640} fill={SC} stroke="#4b4238" strokeWidth={8} />
          <path d={`M1140,${500} l40,-10 l40,20 l40,-16 l40,12 l40,-6`} stroke="#1b1610" strokeWidth={7} fill="none" strokeDasharray="300" strokeDashoffset={300 * (1 - lr)} />
          <text x={1240} y={880} textAnchor="middle" fontSize={50} fontWeight={800} fill={C.red} fontFamily="Barlow Condensed">2 × 6</text>
          <Cross t={t} at={m.lar + 2.4} x={1420} y={260} r={44} /></g>}
      </Svg>
      <Lbl t={t} at={m.sec} out={m.cor} text="decirle dónde romperse" x={960} y={980} col={C.honey} size={70} />
      <Lbl t={t} at={m.jun} out={m.regla} text="la grieta va a la junta" x={960} y={980} col={C.ok} size={70} />
      <Lbl t={t} at={m.regla} out={m.lar} text="como máximo, cuadrados" x={690} y={900} col={C.cream} size={58} />
    </>
  );
};

// 27 · dos formas de juntas: a la izquierda listones de madera clavados al ras que a los tres días salen y la ranura se
// llena de arena; a la derecha, la amoladora corta un tercio del espesor en el corte, con chispas y polvo (y EPP)
export const ListonOAmoladora: React.FC<FxP> = ({ t, m }) => {
  const lis = e(t, m.lis, m.lis + 1.2), saca = e(t, m.saca, m.saca + 1.5), cor = e(t, m.cor, m.cor + 0.8), ter = e(t, m.ter, m.ter + 1.6), epp = e(t, m.epp, m.epp + 0.8);
  return (
    <>
      <Svg>
        <g opacity={lis} transform={`translate(${440 * (1 - e(t, m.cor - 1, m.cor))},0)`}>
          <rect x={160} y={260} width={720} height={560} rx={14} fill="#5b4029" />
          <rect x={160} y={260 + 560 * (1 - e(t, m.lis + 1.5, m.lis + 9))} width={720} height={560 * e(t, m.lis + 1.5, m.lis + 9)} rx={14} fill={SC} />
          {t > m.lis + 1.5 && t < m.lis + 9 && <g transform={`translate(${lerp(240, 800, ((t - m.lis) * 0.25) % 1)},${260 + 560 * (1 - e(t, m.lis + 1.5, m.lis + 9)) - 30})`}><Llana x={0} y={0} s={0.8} /></g>}
          {[400, 640].map((x) => <rect key={x} x={x - 12} y={260 - 40 * saca} width={24} height={560} fill={saca > 0.6 ? "#e3c88f" : MAD} opacity={1} />)}
          {saca > 0.3 && saca < 0.95 && [400, 640].map((x) => <rect key={"s" + x} x={x - 12} y={160 - 400 * saca} width={24} height={300} fill={MAD} />)}
          <text x={520} y={880} textAnchor="middle" fontSize={50} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">{saca > 0.6 ? "3 DÍAS: ARENA FINA" : "LISTONES DE 1″ AL RAS"}</text>
        </g>
        {cor > 0.02 && <g opacity={cor}>
          <Capas x={1060} y={760} w={700} capas={[{ h: 210, k: 1, tipo: "sc" }]} />
          <rect x={1404} y={550} width={12} height={70 * ter} fill={C.night} />
          <g transform={`translate(1410,${540 + 20 * ter})`}><circle r={130} fill="#9aa4ac" opacity={0.85} transform={`rotate(${t * 900})`} /><rect x={-40} y={-260} width={80} height={140} rx={10} fill="#2f5f8a" /><rect x={30} y={-220} width={220} height={50} rx={20} fill="#2a3640" /></g>
          {Array.from({ length: 22 }, (_, i) => { const ph = (t * 2.4 + hash(i, 1)) % 1; return <circle key={i} cx={1410 + ph * (200 + 180 * hash(i, 2))} cy={560 - ph * 200 * hash(i, 3)} r={4 + 10 * ph} fill="#d8d0c0" opacity={(1 - ph) * 0.8} />; })}
          <line x1={1700} x2={1700} y1={550} y2={760} stroke="rgba(255,236,200,.4)" strokeWidth={4} /><line x1={1680} x2={1720} y1={620} y2={620} stroke={C.honey} strokeWidth={6} />
          <text x={1740} y={600} fontSize={46} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed" opacity={ter}>⅓</text>
          {t > m.h24 && <text x={1410} y={880} textAnchor="middle" fontSize={50} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">A LAS 24-48 H</text>}
          {epp > 0.02 && <g opacity={epp} transform="translate(1410,220)">{["antiparras", "auditivo", "barbijo"].map((w, i) => <g key={w} transform={`translate(${(i - 1) * 200},0) scale(${spr(t, m.epp + i * 0.25)})`}><circle r={56} fill={C.honey} /><text y={100} textAnchor="middle" fontSize={34} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">{w.toUpperCase()}</text></g>)}</g>}
        </g>}
      </Svg>
      <Lbl t={t} at={m.dos} out={m.lis + 1} text="dos formas" x={960} y={170} col={C.honey} size={80} />
    </>
  );
};

// 28 · la junta del borde: la pared de la casa y el patio de costado; con el sol el patio se estira y empuja: la pared
// se raja; con la tira de telgopor en el medio, la tira se aprieta y la pared queda sana
export const TelgoporPared: React.FC<FxP> = ({ t, m }) => {
  const tel = e(t, m.tel, m.tel + 1), est = t > m.est ? 0.5 - 0.5 * Math.cos((t - m.est) * 2) : 0, sin = e(t, m.sin, m.sin + 0.6);
  const Escena: React.FC<{ y: number; con: boolean; k: number }> = ({ y, con, k }) => (
    <g transform={`translate(0,${y})`}>
      <rect x={200} y={-220} width={300} height={340} fill="#a5694a" />
      {Array.from({ length: 6 }, (_, r) => <g key={r}><line x1={200} x2={500} y1={-220 + r * 55} y2={-220 + r * 55} stroke="#7d4c33" strokeWidth={4} />{[0, 1, 2].map((c) => <line key={c} x1={240 + c * 100 + (r % 2) * 50} x2={240 + c * 100 + (r % 2) * 50} y1={-220 + r * 55} y2={-165 + r * 55} stroke="#7d4c33" strokeWidth={4} />)}</g>)}
      <rect x={200} y={120} width={1560} height={60} fill="#5b4029" />
      {con && <rect x={500} y={0} width={30 - 18 * k} height={120} fill="#f6f5ef" stroke="#cfcac0" strokeWidth={2} />}
      <rect x={con ? 530 - 18 * k : 500 - 8 * k} y={0} width={1200} height={120} fill={SC} />
      {!con && k > 0.4 && <path d="M490,-210 l-26,60 l34,50 l-30,70 l24,60 l-20,50" stroke="#2b221a" strokeWidth={8} fill="none" opacity={(k - 0.4) / 0.6} />}
      {[0, 1, 2].map((i) => <polygon key={i} points={`${1580 - k * 70 - i * 340},60 ${1520 - k * 70 - i * 340},30 ${1520 - k * 70 - i * 340},90`} fill={C.honey} opacity={k} />)}
    </g>
  );
  return (
    <>
      <Svg>
        <Sol x={1620} y={160} r={56} o={cl(est * 2)} rot={t * 10} />
        <g opacity={tel > 0.02 ? 1 : e(t, m.bor, m.bor + 0.6)}><Escena y={lerp(460, 300, sin)} con={tel > 0.02} k={est} /></g>
        {sin > 0.02 && <g opacity={sin}><Escena y={760} con={false} k={est} /><Cross t={t} at={m.sin + 0.8} x={1640} y={600} r={44} /></g>}
      </Svg>
      <Lbl t={t} at={m.tel} out={m.sin} text="tira de telgopor de 1 cm" x={1100} y={200} col={C.cream} size={62} />
      <Lbl t={t} at={m.sin} text="sin tira: se raja pegado a la casa" x={1100} y={1010} col={C.red} size={56} />
    </>
  );
};

// 29 · fraguar no es secar: el agua y los granos de cemento arman cristales (agujas que crecen); el sol y el viento se
// roban el agua y las agujas se cortan a la mitad: polvo
export const FraguaNoSeca: React.FC<FxP> = ({ t, m }) => {
  const qui = e(t, m.qui, m.qui + 3), sol = e(t, m.sol, m.sol + 1), mit = e(t, m.mit, m.mit + 1), deb = e(t, m.deb, m.deb + 1);
  const grow = qui * (1 - 0.5 * mit);
  return (
    <>
      <Svg>
        <rect x={440} y={240} width={1040} height={600} rx={40} fill="rgba(124,200,255,.08)" stroke="rgba(255,236,200,.25)" strokeWidth={3} />
        <rect x={450} y={250 + 580 * sol * 0.8} width={1020} height={580 * (1 - sol * 0.8)} rx={36} fill="#5d84a0" opacity={0.35} />
        {Array.from({ length: 18 }, (_, i) => { const x = 540 + (i % 6) * 170, y = 360 + Math.floor(i / 6) * 180; return (
          <g key={i}>
            <circle cx={x} cy={y} r={34} fill="#c9cbcc" />
            {Array.from({ length: 6 }, (_, j) => { const ang = (j / 6) * Math.PI * 2 + i; const L = 80 * cl(grow * 1.4 - j * 0.08); return <line key={j} x1={x} y1={y} x2={x + L * Math.cos(ang)} y2={y + L * Math.sin(ang)} stroke="#eef2f5" strokeWidth={5} strokeLinecap="round" />; })}
          </g>); })}
        {sol > 0.02 && <><Sol x={1640} y={220} r={70} o={sol} rot={t * 10} />{Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${200 + ((t * 300 + i * 200) % 1500)},${300 + i * 120} q60,-30 120,0 t120,0`} stroke="#e9e1cf" strokeWidth={5} fill="none" opacity={0.6 * sol} />)}</>}
        {deb > 0.02 && Array.from({ length: 40 }, (_, i) => <circle key={i} cx={500 + 920 * hash(i, 1)} cy={260 + 60 * hash(i, 2) - 80 * deb * hash(i, 3)} r={4 + 4 * hash(i, 4)} fill="#d8d0c0" opacity={deb} />)}
      </Svg>
      <Lbl t={t} at={m.nos} out={m.qui} text="el cemento no se seca" x={960} y={970} col={C.cream} size={74} />
      <Lbl t={t} at={m.qui} out={m.sol} text="fragua: necesita agua" x={960} y={970} col={C.ok} size={74} />
      <Lbl t={t} at={m.mit} text="se corta a la mitad" x={960} y={970} col={C.red} size={74} />
    </>
  );
};

// 30 · siete días bajo nylon: siete casilleros; en cada día el sol de la mañana y la luna de la tarde dejan su gota;
// con calor, una tercera; el nylon negro con ladrillos tapa la losa; o la arpillera mojada
export const SieteNoUno: React.FC<FxP> = ({ t, m }) => {
  const tap = e(t, m.tap, m.tap + 1), lad = e(t, m.lad, m.lad + 0.8), dias = e(t, m.man, m.cal), cal = e(t, m.cal, m.cal + 1), arp = e(t, m.arp, m.arp + 0.8);
  return (
    <>
      <Svg>
        <g transform="translate(0,-40)">
          <Losa cx={960} y={180} w={1000} d={300} h={40}>
            {(f) => <>{tap > 0.02 && <polygon points={quad(f, 0, 0, tap, 1)} fill={arp > 0.5 ? "#b08d5a" : "rgba(28,32,36,.85)"} />}
              {lad > 0.02 && [0.06, 0.5, 0.94].map((u) => [0.05, 0.95].map((v) => { const [x, y] = f(u, v); return <rect key={u + "" + v} x={x - 34} y={y - 16} width={68} height={28} rx={3} fill="#b4552f" opacity={lad} />; }))}</>}
          </Losa>
        </g>
        {Array.from({ length: 7 }, (_, i) => { const k = cl(dias * 7 - i), x = 330 + i * 210; return (
          <g key={i} transform={`translate(${x},720)`} opacity={t > m.sie ? 1 : 0}>
            <rect x={-90} y={-90} width={180} height={220} rx={16} fill={k > 0.99 ? "rgba(124,200,255,.22)" : "rgba(30,20,10,.82)"} stroke="rgba(255,236,200,.35)" strokeWidth={3} />
            <text y={-36} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">DÍA {i + 1}</text>
            {k > 0.3 && <Sol x={-40} y={40} r={20} />}{k > 0.7 && <g><circle cx={40} cy={40} r={20} fill="#e6e2d6" /><circle cx={50} cy={32} r={18} fill="#2a2016" /></g>}
            {k > 0.3 && <circle cx={-40} cy={100} r={10} fill="#7cc8ff" />}{k > 0.7 && <circle cx={40} cy={100} r={10} fill="#7cc8ff" />}
            {cal > 0.02 && <circle cx={0} cy={100} r={10} fill={C.red} opacity={cal} />}
          </g>); })}
      </Svg>
      <Lbl t={t} at={m.sie} out={m.tap} text="siete días. no uno." x={960} y={990} col={C.honey} size={80} />
      <Lbl t={t} at={m.man} out={m.cal} text="mañana y tarde" x={960} y={990} col={"#7cc8ff"} size={76} />
      <Lbl t={t} at={m.cal} out={m.arp} text="con calor: tres veces" x={960} y={990} col={C.red} size={72} />
      <Lbl t={t} at={m.arp} text="o arpillera mojada" x={960} y={990} col={C.cream} size={72} />
    </>
  );
};

// 31 · quién pisa cuándo: una regla de 14 días; en el 3 se suma la persona, en el 7 la mesa y la maceta y el auto, en el
// 14 la camioneta de la entrada; un candado tapa todo antes de cada día
export const QuienPisaCuando: React.FC<FxP> = ({ t, m }) => {
  const x = (d: number) => 260 + d * 100, line = e(t, m.nad, m.d14 + 1);
  const hitos: [number, number, string][] = [[3, m.d3, "caminar"], [7, m.d7, "mesas, macetas, autos"], [14, m.d14, "camioneta"]];
  return (
    <>
      <Svg>
        <line x1={x(0)} x2={x(14)} y1={720} y2={720} stroke="rgba(255,236,200,.3)" strokeWidth={10} strokeLinecap="round" />
        <line x1={x(0)} x2={lerp(x(0), x(14), line)} y1={720} y2={720} stroke={C.honey} strokeWidth={10} strokeLinecap="round" />
        {Array.from({ length: 15 }, (_, d) => <g key={d}><line x1={x(d)} x2={x(d)} y1={700} y2={740} stroke="rgba(255,236,200,.5)" strokeWidth={3} /><text x={x(d)} y={790} textAnchor="middle" fontSize={30} fontWeight={700} fill={C.dim} fontFamily="Barlow">{d}</text></g>)}
        {hitos.map(([d, at, w], i) => t > at && <g key={d} transform={`translate(${x(d)},${600}) scale(${spr(t, at)})`}>
          <circle r={70} fill={i === 2 ? C.red : C.ok} /><text y={22} textAnchor="middle" fontSize={64} fontWeight={800} fill="#1b1610" fontFamily="Barlow Condensed">{d}</text>
          <text y={-100} textAnchor="middle" fontSize={40} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">{w.toUpperCase()}</text></g>)}
        {t > m.nad && t < m.d3 && <g transform={`translate(${x(1.5)},560)`}><rect x={-50} y={-30} width={100} height={80} rx={10} fill="#9aa4ac" /><path d="M-30,-30 v-30 a30,30 0 0 1 60,0 v30" stroke="#9aa4ac" strokeWidth={14} fill="none" /></g>}
      </Svg>
      <Lbl t={t} at={m.nad} out={m.d3} text="nada pesado" x={960} y={300} col={C.red} size={76} />
    </>
  );
};

