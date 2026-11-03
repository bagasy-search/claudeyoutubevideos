// cl2hongos · componentes de los errores al cierre (cinco grietas, enchufada, esponja seca, el cuellito, la lata de duraznos,
// la firma, alcalino, el fondo, las dos pinturas, lunares, barniz, variantes, la frase de Don Ramón, cuentas, el mapa, la próxima).
import React from "react";
import { C, FONT, BODY, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Big, Cross, Draw, FxP, Pop, Svg, Tick, glass, num } from "./kit";
import { Seta } from "./comps1";

// 29 · cinco grietas: cinco hongos grises en un estante; cada error nombrado le hace su daño y le pone su número
export const CincoGrietas: React.FC<FxP> = ({ t, m }) => {
  const E5 = [["agua de más", m.e1], ["desmoldar a las 6 h", m.e2], ["secar al sol", m.e3], ["pintar al otro día", m.e4], ["pegar seco con fresco", m.e5]] as [string, number][];
  return (
    <>
      <Svg>
        <rect x={140} y={700} width={1640} height={22} rx={8} fill="#7a5233" />
        {E5.map(([, at], i) => {
          const x = 300 + i * 330, d = e(t, at + 0.3, at + 1.2), p = spr(t, at - 0.5, 1);
          return (
            <g key={i} opacity={cl(p * 2)}>
              <Seta x={x} y={700} s={110} cap={i === 3 ? C.cap : C.cem} stem={C.cem} rot={i === 4 ? -d * 14 : 0} />
              {i === 0 && Array.from({ length: 16 }, (_, j) => <circle key={j} cx={x - 80 + hash(j, 2) * 160} cy={540 + hash(j, 3) * 30} r={4} fill="#fff" opacity={d} />)}
              {i === 1 && <path d={`M${x - 120},612 l -26,40`} stroke={C.cem} strokeWidth={26} opacity={1 - d} />}
              {(i === 1 || i === 2) && <Draw d={`M${x - 10},540 l 14,30 l -12,24 l 16,26`} p={d} col="#1c1813" w={5} />}
              {i === 3 && [0, 1, 2].map((j) => <path key={j} d={`M${x - 60 + j * 50},${560} q 10,-16 22,0`} stroke={C.cem} strokeWidth={10} fill="none" opacity={d} />)}
              {i === 4 && <line x1={x - 40} y1={612} x2={x + 40} y2={612} stroke={C.red} strokeWidth={5} strokeDasharray="8 6" opacity={d} />}
              <circle cx={x} cy={800} r={34} fill={t > at ? C.red : "rgba(255,255,255,.1)"} /><text x={x} y={815} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={42} fill="#fff">{i + 1}</text>
            </g>
          );
        })}
      </Svg>
      {E5.map(([w, at], i) => <Lbl key={i} t={t} at={at + 0.2} text={w} x={300 + i * 330} y={i % 2 ? 940 : 880} col={C.cream} size={36} />)}
    </>
  );
};

// 30 · apoyada o enchufada: un bloque apoyado se resbala con un empujón; el enchufado, atravesado por el alambre, ni se mueve
export const Enchufada: React.FC<FxP> = ({ t, a, m }) => {
  const push = e(t, a + 1, a + 1.6), pas = spr(t, m.pasa, 1);
  return (
    <>
      <Svg>
        <rect x={420} y={560} width={120} height={300} fill={C.cem2} />
        <g transform={`translate(${push * 180},${push * push * 160}) rotate(${push * 30} 480 560)`}><path d="M300,560 C 300,400 660,400 660,560 Z" fill={C.cem} /></g>
        <rect x={1320} y={560} width={120} height={300} fill={C.cem2} />
        <g transform={`translate(${Math.sin(t * 30) * 4 * push * (1 - e(t, a + 1.6, a + 2))},0)`}><path d="M1200,560 C 1200,400 1560,400 1560,560 Z" fill={C.cem} /><rect x={1340} y={470} width={80} height={90} fill="#3b352c" /></g>
        <line x1={1380} y1={850} x2={1380} y2={470} stroke={C.red} strokeWidth={8} />
        {pas > 0.01 && <g opacity={pas}><line x1={1250} y1={510} x2={1510} y2={510} stroke={C.sun} strokeWidth={6} strokeDasharray="10 6" /><path d="M1510,510 q 30,0 30,30" stroke="#b9bfc4" strokeWidth={8} fill="none" /></g>}
        {[480, 1380].map((x, i) => <path key={i} d={`M${x - 260},470 l 70,0 m -18,-14 l 18,14 l -18,14`} stroke={C.ink} strokeWidth={6} fill="none" opacity={e(t, a + 0.7, a + 1)} />)}
      </Svg>
      <Lbl t={t} at={a + 1.4} text="apoyada: se va" x={480} y={950} col={C.red} size={56} />
      <Lbl t={t} at={a + 1.8} text="enchufada: ni se mueve" x={1380} y={950} col={C.ok} size={56} />
      <Lbl t={t} at={m.pasa + 0.4} text="y un pasador" x={1500} y={330} col={C.sun} size={52} />
    </>
  );
};

// 31 · la esponja seca: el cemento viejo le chupa el agua al fresco (gotas que bajan) y el fresco se desgrana; mojado, no
export const EsponjaSeca: React.FC<FxP> = ({ t, a, m }) => {
  const ch = e(t, a + 0.6, a + 3), mo = e(t, m.sumerg, m.sumerg + 1.2);
  return (
    <>
      <Svg>
        <rect x={360} y={560} width={500} height={240} fill={C.cem} /><rect x={360} y={480} width={500} height={80} fill={C.cem2} />
        {Array.from({ length: 14 }, (_, i) => { const u = ((t - a) * 0.8 + hash(i, 2)) % 1; return <ellipse key={i} cx={390 + hash(i, 3) * 440} cy={lerp(500, 700, u)} rx={6} ry={10} fill={C.water} opacity={ch * (1 - u)} />; })}
        {Array.from({ length: 18 }, (_, i) => <circle key={i} cx={380 + hash(i, 5) * 460} cy={490 + hash(i, 6) * 60 + ch * 60 * hash(i, 7)} r={6} fill={C.cem2} opacity={ch} />)}
        <g opacity={mo}><rect x={1060} y={560} width={500} height={240} fill="#7f7a70" /><rect x={1060} y={480} width={500} height={80} fill={C.cem2} /><rect x={1040} y={460} width={540} height={360} rx={20} fill={C.water} opacity={0.14} /></g>
      </Svg>
      <Lbl t={t} at={a + 0.4} text="seco: chupa el agua" x={610} y={900} col={C.red} size={54} />
      <Lbl t={t} at={m.sumerg + 0.5} text="una hora en el balde" x={1310} y={360} col={C.water} size={54} />
      <Lbl t={t} at={m.humedo + 0.2} text="húmedo, sin charcos" x={1310} y={900} col={C.ok} size={54} />
    </>
  );
};

// 32 · el cuellito: la llave a medio llenar de lechada; el tallo entra girando y lo que sobra sale haciendo un cuellito
export const Cuellito: React.FC<FxP> = ({ t, a, m }) => {
  const en = e(t, m.mete, m.mete + 1.6), cu = e(t, m.cuello, m.cuello + 1), dd = spr(t, m.dos, 1);
  return (
    <>
      <Svg>
        <path d="M560,520 C 560,800 1360,800 1360,520 Q 960,500 560,520 Z" fill={C.cem} />
        <rect x={900} y={510} width={120} height={150} fill="#231d15" />
        <rect x={904} y={590} width={112} height={70} fill="#9c968a" />
        <g transform={`translate(0,${lerp(-320, 0, en)}) rotate(${Math.sin(en * Math.PI * 3) * 4 * (1 - en)} 960 300)`}>
          <path d="M910,520 L 910,250 Q 960,230 1010,250 L 1010,520 Z" fill={C.cem2} /><line x1={960} y1={250} x2={960} y2={650} stroke={C.red} strokeWidth={8} />
        </g>
        <path d={`M${900 - 40 * cu},515 Q 960,${515 - 40 * cu} ${1020 + 40 * cu},515`} stroke="#9c968a" strokeWidth={22 * cu} fill="none" strokeLinecap="round" />
      </Svg>
      <Lbl t={t} at={a + 0.4} text="lechada casi pura" x={1540} y={680} col={C.cream} size={52} />
      <Lbl t={t} at={m.mete + 0.3} text="entra girando" x={1450} y={260} col={C.sun} size={56} />
      <Lbl t={t} at={m.cuello + 0.4} text="el cuellito" x={500} y={300} col={C.ok} size={64} />
      <Pop t={t} at={m.dos} x={400} y={800}><Big size={100} col={C.water}>{dd > 0.5 ? "48 h" : ""}</Big></Pop>
    </>
  );
};

// 33 · la lata de duraznos: su única medida — tres latas de arena, una de cemento — y sus «nunca», que se tachan en rojo
export const LataDuraznos: React.FC<FxP> = ({ t, a, m }) => {
  const N = [["mezclar a ojo", a + 0.3], ["arena sin tamizar", m.tamiz], ["dejar al sol", m.sol], ["pintar antes de 2 semanas", m.pinta]] as [string, number][];
  return (
    <>
      <Svg>
        {[0, 1, 2, 3].map((i) => { const p = spr(t, m.lata + i * 0.25, 1.2), x = 260 + i * 140; return <g key={i} transform={`translate(${x},${lerp(-200, 440, p)})`} opacity={cl(p * 2)}><rect x={-56} y={-70} width={112} height={140} rx={8} fill={i < 3 ? "#e7a33e" : C.cem2} stroke="#5a3b10" strokeWidth={3} /><ellipse cx={0} cy={-70} rx={56} ry={13} fill="#d7d3c9" /><text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill="#2a2016">{i < 3 ? "ARENA" : "CEM."}</text></g>; })}
      </Svg>
      <Lbl t={t} at={m.lata + 1.2} text="siempre la misma lata" x={470} y={620} col={C.sun} size={50} />
      {N.map(([w, at], i) => (
        <Pop key={i} t={t} at={at} x={1360} y={300 + i * 150} k={1.2}>
          <div style={{ position: "relative", fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.cream, textTransform: "uppercase", whiteSpace: "nowrap" }}>
            nunca: {w}
            <div style={{ position: "absolute", left: 0, top: "52%", height: 6, background: C.red, width: `${100 * e(t, at + 0.4, at + 0.9)}%`, borderRadius: 3 }} />
          </div>
        </Pop>
      ))}
    </>
  );
};

// 34 · la firma: la base del tallo vista de abajo; un clavo raya «CM» y el año
export const FirmaCM: React.FC<FxP> = ({ t, a, m }) => {
  const k = e(t, a + 0.4, a + 3), cm = spr(t, m.cm, 1);
  const L = ["M760,640 L760,440 L860,440", "M760,640 L860,640", "M920,640 L920,440 L990,540 L1060,440 L1060,640", "M1120,560 L1180,560", "M1240,470 Q1300,420 1340,470 Q1360,520 1240,640 L1360,640"];
  return (
    <>
      <Svg>
        <circle cx={1000} cy={540} r={380} fill={C.cem} />
        <circle cx={1000} cy={540} r={380} fill="none" stroke="rgba(0,0,0,.2)" strokeWidth={10} />
        {L.map((d, i) => <Draw key={i} d={d} p={cl(k * L.length - i)} col="#4d483f" w={14} />)}
        <g transform={`translate(${lerp(760, 1360, k)},${440 + 120 * Math.sin(k * 20)}) rotate(35)`} opacity={1 - e(t, a + 3, a + 3.4)}><rect x={-6} y={-200} width={12} height={200} fill="#b9bfc4" /><rect x={-22} y={-214} width={44} height={16} rx={4} fill="#8a9096" /></g>
      </Svg>
      <Lbl t={t} at={a + 0.6} text="firmaba cada pieza" x={1000} y={980} out={m.cm - 0.2} col={C.sun} size={54} />
      <Lbl t={t} at={m.cm + 0.2} text="dentro de veinte años" x={1000} y={980} col={C.cream} size={52} />
      <Pop t={t} at={m.cm} x={1640} y={300}><div style={{ transform: `rotate(${(1 - cm) * 20}deg)`, fontFamily: FONT, fontWeight: 800, fontSize: 60, color: C.ok }}>✓ firmado</div></Pop>
    </>
  );
};

// 35 · alcalino: una barra de pH que corre al violeta; la pintura encima hace ampollas y en la helada se cae en cáscaras
export const Alcalino: React.FC<FxP> = ({ t, a, m }) => {
  const ph = e(t, a + 0.3, m.lav + 0.6), amp = e(t, m.amp, m.amp + 1.2), cae = e(t, m.amp + 1.6, m.amp + 2.6), dos = spr(t, m.dos, 1);
  return (
    <>
      <Svg>
        <defs><linearGradient id="ph" x1="0" x2="1"><stop offset="0" stopColor="#e94c3a" /><stop offset=".3" stopColor="#f2c84b" /><stop offset=".5" stopColor="#7bc96f" /><stop offset=".75" stopColor="#3a7bd5" /><stop offset="1" stopColor="#7a3fb8" /></linearGradient></defs>
        <rect x={260} y={200} width={1400} height={40} rx={20} fill="url(#ph)" />
        <g transform={`translate(${lerp(960, 1560, ph)},220)`}><path d="M0,-50 L-18,-80 L18,-80 Z" fill={C.ink} /><circle r={30} fill="none" stroke={C.ink} strokeWidth={5} /></g>
        <rect x={460} y={560} width={1000} height={260} fill={C.cem} />
        <rect x={460} y={530} width={1000} height={30} fill={C.cap} opacity={1} />
        {Array.from({ length: 12 }, (_, i) => { const x = 500 + i * 82, r = (14 + 10 * hash(i, 2)) * amp; return <g key={i} transform={`translate(${cae * (hash(i, 3) - 0.5) * 120},${cae * (60 + 160 * hash(i, 4))}) rotate(${cae * 90 * (hash(i, 5) - 0.5)} ${x} 530)`}><ellipse cx={x} cy={530 - r * 0.4} rx={r * 1.4} ry={r} fill={C.cap} stroke="#8e1f17" strokeWidth={2} /></g>; })}
        {dos > 0.01 && <g transform={`translate(1600,700) scale(${dos})`}><rect x={-120} y={-120} width={240} height={240} rx={20} fill="#f4efe4" /><rect x={-120} y={-120} width={240} height={50} rx={20} fill={C.cap} />{Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${-90 + (i % 7) * 30},${-40 + Math.floor(i / 7) * 60} l 18,18 m 0,-18 l -18,18`} stroke={C.red} strokeWidth={4} opacity={e(t, m.dos + 0.3 + i * 0.08, m.dos + 0.4 + i * 0.08)} />)}</g>}
      </Svg>
      <Lbl t={t} at={m.lav} text="como lavandina adentro" x={960} y={320} col={C.dim} size={52} />
      <Lbl t={t} at={m.amp + 0.3} text="se ampolla y se pela" x={960} y={920} col={C.red} size={58} />
      <Lbl t={t} at={m.dos + 0.5} text="dos semanas" x={1600} y={900} col={C.ok} size={52} />
    </>
  );
};

// 36 · el fondo: los poros del cemento en corte; la primera mano aguada entra en los poros; la pintura de arriba se engancha
export const PorosFondo: React.FC<FxP> = ({ t, a, m }) => {
  const f = e(t, a + 0.6, a + 2.4), top = e(t, m.verdad, m.verdad + 1.2), ag = spr(t, m.aguada, 1);
  return (
    <>
      <Svg>
        <path d={`M200,600 ${Array.from({ length: 30 }, (_, i) => `L${200 + i * 52 + 13},${600 + (i % 2 ? 70 : 0)} L${200 + i * 52 + 39},${600 + (i % 2 ? 70 : 0)} L${200 + (i + 1) * 52},600`).join(" ")} L1760,900 L200,900 Z`} fill={C.cem} />
        {Array.from({ length: 15 }, (_, i) => <rect key={i} x={200 + (2 * i + 1) * 52 + 13} y={600} width={26} height={70 * f} fill={C.sun} opacity={0.7} />)}
        <rect x={200} y={600 - 40 * top} width={1560} height={40 * top} fill={C.cap} />
        {top > 0 && Array.from({ length: 15 }, (_, i) => <rect key={i} x={200 + (2 * i + 1) * 52 + 17} y={600} width={18} height={60 * top} fill={C.cap} />)}
      </Svg>
      <Lbl t={t} at={a + 0.6} text="entra en los poritos" x={960} y={300} col={C.sun} size={60} />
      <Pop t={t} at={m.aguada} x={1550} y={430}><div style={{ ...glass(), padding: "20px 30px", transform: `scale(${0.9 + 0.1 * ag})`, fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.cream, textTransform: "uppercase" }}>látex + agua · mitad</div></Pop>
      <Lbl t={t} at={m.verdad + 0.4} text="y la pintura agarra" x={960} y={980} col={C.ok} size={56} />
    </>
  );
};

// 37 · dos latas: látex de exterior o esmalte de rejas; dos manos de cada una, con un reloj de secado entre medio
export const DosLatas: React.FC<FxP> = ({ t, a, m }) => {
  const lata = (x: number, at: number, col: string, txt: string) => { const p = spr(t, at, 1); return <g transform={`translate(${x},${lerp(900, 520, p)})`} opacity={cl(p * 2)}><rect x={-150} y={-180} width={300} height={360} rx={16} fill="#d9d4ca" stroke="#5c574e" strokeWidth={4} /><rect x={-150} y={-60} width={300} height={140} fill={col} /><ellipse cx={0} cy={-180} rx={150} ry={30} fill="#bdb7ac" /><text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#fff">{txt}</text></g>; };
  const manos = Math.min(2, Math.floor(cl((t - m.manos) / 3) * 3));
  return (
    <>
      <Svg>{lata(620, a + 0.4, "#5a7d9a", "LÁTEX EXT.")}{lata(1300, m.esmalte, C.cap, "ESMALTE")}</Svg>
      <Lbl t={t} at={a + 0.8} text="paredes de afuera" x={620} y={860} col={C.cream} size={50} />
      <Lbl t={t} at={m.esmalte + 0.4} text="brilla como de cuento" x={1300} y={860} col={C.sun} size={50} />
      <Pop t={t} at={m.manos} x={960} y={200}><Big size={110}>{manos || 1} / 2 manos</Big></Pop>
    </>
  );
};

// 38 · lunares: el sombrero visto de arriba; corcho, tapita e hisopo estampan grandes al centro y chiquitos al borde; la fila se tacha
export const Lunares: React.FC<FxP> = ({ t, a, m }) => {
  const D = Array.from({ length: 26 }, (_, i) => { const r = i < 7 ? 0.25 + 0.2 * hash(i, 2) : i < 17 ? 0.5 + 0.2 * hash(i, 3) : 0.72 + 0.18 * hash(i, 4); const an = hash(i, 5) * Math.PI * 2; return { x: 760 + Math.cos(an) * 340 * r, y: 540 + Math.sin(an) * 340 * r, s: i < 7 ? 34 : i < 17 ? 20 : 10, at: i < 7 ? a + 0.8 + i * 0.35 : i < 17 ? m.tapita + (i - 7) * 0.25 : m.hisopo + (i - 17) * 0.2 }; });
  const fila = spr(t, m.regla, 1);
  return (
    <>
      <Svg>
        <circle cx={760} cy={540} r={360} fill={C.cap} /><circle cx={760} cy={540} r={360} fill="none" stroke="rgba(0,0,0,.25)" strokeWidth={8} />
        {D.map((d, i) => { const p = spr(t, d.at, 1.6); return p > 0.01 ? <circle key={i} cx={d.x} cy={d.y} r={d.s * Math.min(1.1, p)} fill="#fbf3e2" /> : null; })}
        {fila > 0.01 && <g opacity={cl(fila * 2)}><circle cx={1500} cy={540} r={170} fill={C.cap} />{[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={1380 + i * 60} cy={540} r={22} fill="#fbf3e2" />)}<Cross t={t} at={m.regla + 0.5} x={1500} y={540} r={90} /></g>}
      </Svg>
      <Lbl t={t} at={a + 0.6} text="un corcho de vino" x={1480} y={220} col={C.cream} size={56} />
      <Lbl t={t} at={m.regla + 0.6} text="nunca en fila" x={1500} y={820} col={C.red} size={58} />
      <Lbl t={t} at={m.hisopo + 0.4} text="chiquitos al borde" x={760} y={980} col={C.sun} size={52} />
    </>
  );
};

// 39 · barniz con apuro: el pincel de barniz pasa sobre pintura fresca y arrastra el rojo sobre el blanco; con un día de espera, no
export const BarnizApuro: React.FC<FxP> = ({ t, a, m }) => {
  const pas = e(t, a + 0.5, a + 2), esp = spr(t, m.espera, 1);
  return (
    <>
      <Svg>
        <rect x={360} y={300} width={500} height={480} rx={20} fill="#f6efe0" /><rect x={360} y={300} width={500} height={150} rx={20} fill={C.cap} />
        <rect x={360} y={450} width={500 * pas} height={330} fill="#e9a3a0" opacity={0.75} />
        <g transform={`translate(${lerp(360, 860, pas)},400)`}><rect x={-20} y={-160} width={40} height={140} fill="#a8783f" /><rect x={-30} y={-24} width={60} height={70} fill="#d4c8a8" /></g>
        <g opacity={cl(esp * 2)} transform={`translate(${(1 - esp) * 200},0)`}><rect x={1060} y={300} width={500} height={480} rx={20} fill="#f6efe0" /><rect x={1060} y={300} width={500} height={150} rx={20} fill={C.cap} /><rect x={1060} y={300} width={500} height={480} rx={20} fill="rgba(255,255,255,.18)" /></g>
        <Tick t={t} at={m.espera + 0.5} x={1310} y={600} r={60} /><Cross t={t} at={a + 1.8} x={610} y={600} r={60} />
      </Svg>
      <Lbl t={t} at={a + 1.6} text="rosado: barniz apurado" x={610} y={900} col={C.red} size={50} />
      <Lbl t={t} at={m.espera + 0.4} text="un día entre medio" x={1310} y={900} col={C.ok} size={50} />
    </>
  );
};

// 40 · tres variantes: tres tarjetas — de bosque (esponja), de colores (los nietos), de tronco (estantes en escalera)
export const TresVariantes: React.FC<FxP> = ({ t, a, m }) => {
  const V = [{ at: a + 0.3, lab: "de bosque" }, { at: m.col, lab: "de colores" }, { at: m.tronco, lab: "en el tronco" }];
  return (
    <>
      {V.map((q, i) => (
        <Pop key={i} t={t} at={q.at} x={380 + i * 580} y={500}>
          <div style={{ ...glass(), width: 500, height: 560, position: "relative" }}>
            <svg width={500} height={560} style={{ position: "absolute", inset: 0 }}>
              {i === 0 && <><Seta x={250} y={470} s={160} cap="#b68a5c" stem="#e7d9bb" />{Array.from({ length: 22 }, (_, j) => <circle key={j} cx={150 + hash(j, 2) * 200} cy={250 + hash(j, 3) * 60} r={8 + 6 * hash(j, 4)} fill="#6e4a2a" opacity={0.5 * e(t, q.at + 0.4 + j * 0.05, q.at + 0.6 + j * 0.05)} />)}</>}
              {i === 1 && [["#f2c84b", "#e8772e", 140], ["#8fd0f0", "#fff", 260], ["#a07cd6", "#f4e7ff", 370]].map(([c1, c2, x], j) => <Seta key={j} x={x as number} y={470} s={(80 + 20 * (j % 2)) * spr(t, q.at + 0.3 + j * 0.3, 1.2)} cap={c1 as string} stem="#f2e3bf" dots={5} />)}
              {i === 2 && <><rect x={60} y={120} width={130} height={400} rx={20} fill="#7a5233" />{[0, 1, 2, 3].map((j) => { const p = spr(t, q.at + 0.4 + j * 0.3, 1.2); return <path key={j} d={`M190,${170 + j * 90} q ${160 * p},-10 ${200 * p},40 q -100,20 -${200 * p},10 Z`} fill="#c9a77a" stroke="#6e4a2a" strokeWidth={3} />; })}</>}
            </svg>
          </div>
          <div style={{ textAlign: "center", marginTop: 18, fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.cream, textTransform: "uppercase" }}>{q.lab}</div>
        </Pop>
      ))}
    </>
  );
};

// 41 · la frase de Don Ramón: «no perdona el apuro» cae pesada; «perdona todo lo demás» se levanta, palabra por palabra
export const NoPerdona: React.FC<FxP> = ({ t, a, m }) => {
  const A = ["el", "cemento", "no", "perdona", "el", "apuro"], B = ["pero", "perdona", "todo", "lo", "demás"];
  const fila = (w: string[], at: number, y: number, col: string, sz: number) => (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 26 }}>
      {w.map((x, i) => { const p = spr(t, at + i * 0.16, 1.1); return <span key={i} style={{ fontFamily: FONT, fontWeight: 800, fontSize: sz, color: col, textTransform: "uppercase", opacity: cl(p * 2), transform: `translateY(${(1 - p) * -80}px)`, display: "inline-block", textShadow: "0 8px 30px rgba(0,0,0,.6)" }}>{x}</span>; })}
    </div>
  );
  return (
    <>
      {fila(A, a + 0.2, 330, C.cream, 108)}
      {fila(B, m.todo, 560, C.ok, 96)}
      <Lbl t={t} at={m.todo + 1.6} text="Don Ramón" x={1500} y={850} col={C.dim} size={46} />
    </>
  );
};

// 42 · las cuentas: renglones que se llenan con «ya lo tenía»; el total cae en una taza de café; la etiqueta de la feria: «?»
export const CuentasHongo: React.FC<FxP> = ({ t, a, m }) => {
  const R = [["1/4 bolsa de cemento", "poco"], ["un balde de arena", "poco"], ["pintura de las rejas", "ya la tenía"], ["fondito de barniz", "ya lo tenía"], ["bol, taza, huevito", "ya los tenía"]];
  const caf = spr(t, m.cafe, 1), fer = spr(t, m.feria, 1);
  return (
    <>
      {R.map(([w, v], i) => (
        <Pop key={i} t={t} at={a + 0.4 + i * 0.6} x={760} y={400 + i * 105} from={30}>
          <div style={{ width: 860, display: "flex", justifyContent: "space-between", fontFamily: BODY, fontWeight: 700, fontSize: 44, color: C.ink, borderBottom: "2px dashed rgba(255,240,214,.3)", paddingBottom: 6 }}><span>{w}</span><span style={{ color: i > 1 ? C.ok : C.sun }}>{v}</span></div>
        </Pop>
      ))}
      <Svg>
        {caf > 0.01 && <g transform={`translate(1500,860) scale(${caf})`}><path d="M-90,-70 L90,-70 L70,60 Q0,90 -70,60 Z" fill="#f4efe4" /><path d="M90,-40 q 50,0 40,40 q -10,30 -50,24" stroke="#f4efe4" strokeWidth={14} fill="none" /><ellipse cx={0} cy={-70} rx={90} ry={18} fill="#5b3c24" />{[0, 1, 2].map((i) => <path key={i} d={`M${-30 + i * 30},-110 q 10,-20 0,-40`} stroke="rgba(255,255,255,.5)" strokeWidth={5} fill="none" />)}</g>}
        {fer > 0.01 && <g transform={`translate(1500,400) rotate(${-8 + 4 * Math.sin(t * 2)}) scale(${fer})`}><path d="M-150,-90 L120,-90 L180,0 L120,90 L-150,90 Z" fill="#f2c84b" stroke="#8a6a12" strokeWidth={4} /><circle cx={110} cy={0} r={14} fill={C.night} /><text x={-20} y={34} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={110} fill="#2a2016">?</text></g>}
      </Svg>
      <Lbl t={t} at={m.cafe + 0.4} text="lo que sale un café" x={960} y={990} col={C.sun} size={56} />
      <Lbl t={t} at={m.feria + 0.4} text="preguntá en la feria" x={1500} y={600} col={C.cream} size={52} />
    </>
  );
};

// 43 · el mapa de las preguntas: un mapa simple de América y Canarias; cada pregunta enciende su punto con un globito
export const MapaPreguntas: React.FC<FxP> = ({ t, a, m }) => {
  const P = [["Lima", 520, 690, m.lima], ["Colombia", 540, 560, m.col], ["Chile", 560, 860, m.chile], ["Dallas", 450, 330, m.dallas], ["Uruguay", 700, 820, m.uru], ["Canarias", 1260, 380, m.can]] as [string, number, number, number][];
  return (
    <>
      <Svg>
        <g transform="translate(260,0)">
        <path d="M300,160 C 420,120 560,170 600,260 C 640,330 520,380 500,440 C 560,480 640,520 700,600 C 760,680 720,760 650,840 C 610,900 590,960 560,990 C 520,900 500,780 480,680 C 450,600 420,520 380,460 C 320,380 260,260 300,160 Z" fill="rgba(169,212,108,.16)" stroke="rgba(169,212,108,.5)" strokeWidth={3} opacity={e(t, a, a + 1)} />
        <path d="M1180,180 C 1280,140 1420,180 1460,300 C 1480,420 1400,520 1330,500 C 1260,470 1200,380 1180,180 Z" fill="rgba(169,212,108,.12)" stroke="rgba(169,212,108,.4)" strokeWidth={3} opacity={e(t, a, a + 1)} />
        <path d="M800,620 C 950,560 1100,480 1250,390" stroke="rgba(255,240,214,.25)" strokeWidth={3} strokeDasharray="10 10" fill="none" opacity={e(t, m.can, m.can + 1)} />
        {P.map(([, x, y, at], i) => { const p = spr(t, at, 1.3); return p > 0.01 ? <g key={i}><circle cx={x} cy={y} r={30 * p} fill={C.sun} opacity={0.25} /><circle cx={x} cy={y} r={11} fill={C.sun} /></g> : null; })}
        </g>
      </Svg>
      {P.map(([n, x, y, at], i) => <Lbl key={i} t={t} at={at + 0.1} text={n} x={x + 260 + (x > 1000 ? -140 : 150)} y={y - 30} col={C.cream} size={42} align={x > 1000 ? "right" : "left"} />)}
      <Lbl t={t} at={a + 0.4} text="las preguntas, con país" x={1480} y={880} col={C.sun} size={52} />
    </>
  );
};

// 44 · cuánto pesa el grande: una balanza de cocina que oscila y se clava entre 3 y 4 kilos
export const Balanza: React.FC<FxP> = ({ t, a }) => {
  const k = spr(t, a + 0.3, 0.7), kg = 3.5 * k;
  return (
    <>
      <Svg>
        <rect x={700} y={640} width={520} height={200} rx={30} fill="#d9d4ca" /><rect x={760} y={600} width={400} height={40} rx={12} fill="#b9b3a8" />
        <g transform={`translate(0,${-6 * k})`}><Seta x={960} y={600} s={230} cap={C.cap} stem={C.cream} dots={7} /></g>
        <rect x={860} y={680} width={200} height={110} rx={12} fill="#1e2a20" />
      </Svg>
      <div style={{ position: "absolute", left: 960, top: 735, transform: "translate(-50%,-50%)", fontFamily: FONT, fontWeight: 800, fontSize: 76, color: C.ok }}>{kg.toFixed(1).replace(".", ",")}</div>
      <Lbl t={t} at={a + 1.2} text="tres o cuatro kilos" x={1520} y={420} col={C.cream} size={56} />
    </>
  );
};

// 45 · la próxima figura: ranita, caracol y tortuga en siluetas; las barras de votos crecen y se cruzan
export const ProximaFigura: React.FC<FxP> = ({ t, a }) => {
  const F = ["ranita", "caracol", "tortuga"], v = (i: number) => cl((t - a - 0.6) / 4) * (0.55 + 0.35 * Math.sin(t * 1.3 + i * 2.1));
  const sil = ["M-90,40 Q-100,-40 -40,-50 Q-30,-90 0,-70 Q30,-90 40,-50 Q100,-40 90,40 Z", "M-100,40 L60,40 Q100,40 90,0 Q80,-80 0,-80 Q-80,-80 -80,0 Q-80,30 -40,30 M-100,40 L-120,-10", "M-110,30 Q-100,-70 0,-70 Q100,-70 110,30 Z M110,10 L150,-10 L150,20 Z"];
  return (
    <>
      <Svg>
        {F.map((_, i) => { const x = 480 + i * 480, p = spr(t, a + 0.2 + i * 0.25, 1.1); return <g key={i} transform={`translate(${x},${380 + (1 - p) * 100})`} opacity={cl(p * 2)}><path d={sil[i]} fill={C.cem} stroke={C.edge} strokeWidth={3} transform="scale(1.4)" /><rect x={-140} y={250} width={280} height={30} rx={15} fill="rgba(255,240,214,.12)" /><rect x={-140} y={250} width={280 * v(i)} height={30} rx={15} fill={C.sun} /></g>; })}
      </Svg>
      {F.map((w, i) => <Lbl key={i} t={t} at={a + 0.5 + i * 0.25} text={w} x={480 + i * 480} y={600} col={C.cream} size={56} />)}
      <Lbl t={t} at={a + 1.4} text="votá en los comentarios" x={960} y={900} col={C.ok} size={60} />
    </>
  );
};
