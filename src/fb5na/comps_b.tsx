// fb5na · componentes 13-25 (Doña Elsa y la canaleta, la medianera, el vecino, materiales, los errores, raspar, salitre)
import React from "react";
import { C, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Big, Cross, Draw, FxP, Pop, Svg, Tick, num, shake } from "./kit";
import { Ampollas, Casa, Corte, H2O, Mancha, Muro, Nube, Reloj, Salitre, LAD, LAD2 } from "./pared";

// 13 · Doña Elsa: la pared verde se cubre de azulejos fila por fila hasta arriba; detrás sigue el verde y los azulejos
// empiezan a caer de a uno, con su tic, dejando ver la pared mojada
export const AzulejosCaen: React.FC<FxP> = ({ t, a, m }) => {
  const COL = 7, FIL = 6, W = 140, X0 = 960 - (COL * W) / 2, Y0 = 220, verde = e(t, m.verde, m.verde + 1.2), pone = e(t, m.azul - 1.2, m.azul + 0.4);
  const caen = [[2, 3], [5, 1], [1, 4], [4, 4], [3, 0], [6, 2], [0, 1]];
  return (
    <>
      <Svg>
        <rect x={X0} y={Y0} width={COL * W} height={FIL * W} fill={`rgb(${lerp(226, 98, verde)},${lerp(220, 128, verde)},${lerp(204, 92, verde)})`} />
        {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={X0 + COL * W * hash(i, 91)} cy={Y0 + FIL * W * hash(i, 92)} r={10 + 30 * hash(i, 93)} fill="rgba(40,70,40,.35)" opacity={verde} />)}
        {Array.from({ length: COL * FIL }, (_, k) => {
          const c = k % COL, r = FIL - 1 - Math.floor(k / COL), at0 = m.azul - 1.2 + k * 0.035; if (t < at0) return null;
          const ci = caen.findIndex(([cc, rr]) => cc === c && rr === r), tc = ci < 0 ? 1e9 : m.azul + 1.6 + ci * 0.7, u = cl((t - tc) / 0.9);
          return <g key={k} transform={`translate(${X0 + c * W + W / 2 + u * 40 * (hash(k, 3) - 0.5)},${Y0 + r * W + W / 2 + 900 * u * u}) rotate(${u * 140 * (hash(k, 4) - 0.5)})`} opacity={1 - cl((t - tc - 0.7) * 4) * 0}>
            <rect x={-W / 2 + 3} y={-W / 2 + 3} width={W - 6} height={W - 6} fill="#eef3f4" stroke="#b9c3c6" strokeWidth={3} />
            <path d={`M${-W / 2 + 14},${-W / 2 + 14} L${-W / 2 + 50},${-W / 2 + 14}`} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
          </g>;
        })}
      </Svg>
      <Lbl t={t} at={m.verde + 0.4} out={m.azul - 0.2} text="la pared estaba verde" x={960} y={140} col={C.moss} size={70} />
      <Lbl t={t} at={m.azul + 0.4} out={m.azul + 1.5} text="azulejos hasta arriba" x={960} y={140} col={C.cream} size={66} />
      <Lbl t={t} at={m.azul + 1.8} text="y se caían solos" x={960} y={140} col={C.red} size={74} />
    </>
  );
};

// 14 · dos caminos: corte con el muro. Izquierda (la de libro): excavar afuera + membrana + drenaje, con la etiqueta
// de precio que crece; derecha: cortar el agua desde adentro + la canaleta arriba. La balanza de costo se inclina
export const DosCaminos: React.FC<FxP> = ({ t, a, m }) => {
  const exc = e(t, a + 0.6, m.caro), ins = e(t, m.adentro, m.adentro + 1.4), can = e(t, m.canal, m.canal + 1.2);
  return (
    <>
      <Svg>
        {/* camino 1 */}
        <g opacity={1 - 0.55 * ins}>
          <rect x={160} y={560} width={720} height={340} fill="#6d4a2c" />
          <path d={`M520,560 L520,${560 + 320 * exc} L700,${560 + 320 * exc} L760,560 Z`} fill="#2d2014" />
          <rect x={480} y={300} width={40} height={600} fill={LAD2} />
          <rect x={518} y={560} width={10} height={320 * exc} fill="#202326" />
          <circle cx={610} cy={560 + 300 * exc} r={26 * exc} fill="#3f4a52" stroke="#9aa4ab" strokeWidth={4} />
          <rect x={200} y={300} width={280} height={260} fill="#e9dfca" />
          <g transform="translate(700,260)">
            {t > m.caro && <g transform={`scale(${spr(t, m.caro)}) rotate(-8)`}><rect x={-120} y={-56} width={240} height={112} rx={14} fill="#f6f1e6" stroke={C.red} strokeWidth={6} /><text x={0} y={22} textAnchor="middle" fontSize={64} fontWeight={800} fill={C.red} fontFamily="Barlow Condensed">$$$$</text></g>}
          </g>
        </g>
        {/* camino 2 */}
        <g opacity={e(t, m.adentro - 0.4, m.adentro + 0.3)}>
          <path d="M1060,560 L1060,560 C 1260,540 1500,500 1780,470 L1780,900 L1060,900 Z" fill="#6d4a2c" />
          <Corte t={t} x={1000} y={300} w={110} h={600} agua={0.8} cris={ins} poros={false} />
          <rect x={860} y={300} width={140} height={600} fill="rgba(233,223,202,.9)" />
          {can > 0 && <path d={`M1112,${548} q 80,${40 * can} 170,${-8}`} fill="none" stroke="#bdb6aa" strokeWidth={22 * can} strokeLinecap="round" />}
          {can > 0.4 && Array.from({ length: 5 }, (_, i) => { const u = ((t - m.canal) * 0.7 + i / 5) % 1; return <circle key={i} cx={lerp(1290, 1760, u)} cy={530 - 60 * u} r={8} fill={H2O} />; })}
        </g>
        <line x1={960} y1={180} x2={960} y2={940} stroke="rgba(255,236,200,.25)" strokeWidth={3} strokeDasharray="10 12" />
      </Svg>
      <Lbl t={t} at={a + 0.5} text="la de libro" x={520} y={190} col={C.cream} size={64} />
      <Lbl t={t} at={m.caro + 0.5} text="cara, y a veces imposible" x={520} y={970} col={C.red} size={50} />
      <Lbl t={t} at={m.adentro + 0.2} text="desde adentro" x={1400} y={190} col={C.solv} size={64} />
      <Lbl t={t} at={m.canal + 0.6} text="+ canaleta arriba" x={1400} y={970} col={C.honey} size={56} />
    </>
  );
};

// 15 · la canaleta paso a paso: franja de hilo de 40 cm, la tierra baja 15 cm, el pisón la compacta, la manguera de
// nivel con el agua a la misma altura en las dos puntas (1 cm por metro), la media caña de cemento y el chanfle
export const CanaletaNivel: React.FC<FxP> = ({ t, a, m }) => {
  const hilo = e(t, a + 0.4, a + 1.6), sac = e(t, m.tierra, m.tierra + 1.4), pis = t > m.tierra + 1.4 && t < m.pend, ang = e(t, m.pend, m.pend + 1) * 3.2;
  const man = e(t, m.mang, m.mang + 1), cana = e(t, m.caña, m.caña + 1.4), chan = e(t, m.chanfle, m.chanfle + 0.8);
  const Y = 640, L = 320, R = 1600, yL = (x: number) => Y + 115 * sac + (x - L) * Math.tan((ang * Math.PI) / 180) * 0.25;
  return (
    <>
      <Svg>
        <rect x={L - 60} y={360} width={60} height={540} fill={LAD2} />
        <path d={`M${L},${Y} L${R},${Y} L${R},900 L${L},900 Z`} fill="#6d4a2c" />
        <path d={`M${L},${yL(L)} L${R},${yL(R)} L${R},${Y} L${L},${Y} Z`} fill="#2d2014" opacity={sac} />
        <line x1={L} y1={Y - 6} x2={R} y2={Y - 6} stroke="#f6f1e6" strokeWidth={3} opacity={hilo} strokeDasharray={`${(R - L) * hilo} 9999`} />
        {pis && <g transform={`translate(${lerp(L + 100, R - 100, ((t - m.tierra) * 0.45) % 1)},${yL(900) - 140 + 40 * Math.abs(Math.sin(t * 7))})`}><rect x={-14} y={-170} width={28} height={170} fill="#8a5a33" /><rect x={-70} y={0} width={140} height={40} rx={6} fill="#5e3a1c" /></g>}
        {man > 0 && <g opacity={man * (1 - cana)}>
          <path d={`M${L + 40},${yL(L + 40) - 220} L${L + 40},${yL(L + 40) - 20} Q ${(L + R) / 2},${yL(900) + 60} ${R - 40},${yL(R - 40) - 20} L${R - 40},${yL(R - 40) - 220}`} fill="none" stroke="rgba(220,240,255,.75)" strokeWidth={18} />
          {[L + 40, R - 40].map((x, i) => <rect key={i} x={x - 9} y={Y - 180} width={18} height={yL(x) - 20 - (Y - 180)} fill={H2O} opacity={0.85} />)}
          <line x1={L - 10} y1={Y - 180} x2={R + 10} y2={Y - 180} stroke={C.sun} strokeWidth={4} strokeDasharray="14 10" />
        </g>}
        {cana > 0 && <path d={`M${L},${yL(L) - 70 * cana} Q ${(L + R) / 2},${yL(900) - 10} ${R},${yL(R) - 50 * cana} L${R},${yL(R)} L${L},${yL(L)} Z`} fill="#bdb6aa" stroke="#8d887e" strokeWidth={3} />}
        {chan > 0 && <path d={`M${L},${yL(L) - 70 - 80 * chan} L${L},${yL(L) - 70} L${L + 90 * chan},${yL(L) - 70} Z`} fill="#a8a196" />}
      </Svg>
      <Lbl t={t} at={a + 0.6} out={m.tierra} text="franja de 40 cm" x={960} y={220} col={C.cream} size={64} />
      <Lbl t={t} at={m.tierra + 0.3} out={m.pend} text="sacás 15 cm y compactás" x={960} y={220} col={C.cream} size={60} />
      <Lbl t={t} at={m.pend + 0.3} out={m.mang} text="1 cm por metro" x={960} y={220} col={C.honey} size={72} />
      <Lbl t={t} at={m.mang + 0.4} out={m.caña} text="el agua busca su altura" x={960} y={220} col={H2O} size={60} />
      <Lbl t={t} at={m.caña + 0.4} out={m.chanfle} text="media caña de 7 cm" x={960} y={220} col={C.cream} size={60} />
      <Lbl t={t} at={m.chanfle + 0.3} text="chanfle contra la pared" x={960} y={220} col={C.sun} size={60} />
    </>
  );
};

// 16 · dónde termina: vista desde arriba del terreno; el agua corre por la canaleta y se prueban tres finales —
// en la tierra al lado de la casa (vuelve, cruz), al desagüe / cuneta (tilde), o a 3 m con la cinta métrica
export const CanaletaSalida: React.FC<FxP> = ({ t, a, m }) => {
  const f = t < a + 2.6 ? 0 : t < m.tres - 0.3 ? 1 : 2;
  const x1 = [980, 1500, 1560][f];
  return (
    <>
      <Svg>
        <rect x={260} y={200} width={560} height={680} fill="#e9dfca" stroke="#6b5a44" strokeWidth={6} />
        <text x={540} y={560} textAnchor="middle" fontSize={56} fontWeight={800} fill="#6b5a44" fontFamily="Barlow Condensed">TU CASA</text>
        <rect x={820} y={200} width={1000} height={680} fill="#7c5a36" />
        <rect x={830} y={200} width={60} height={680} fill="#bdb6aa" />
        {Array.from({ length: 9 }, (_, i) => { const u = ((t - a) * 0.5 + i / 9) % 1; const yy = lerp(220, 840, u); return <circle key={i} cx={860} cy={yy} r={10} fill={H2O} />; })}
        <Draw d={`M860,840 C 900,880 ${x1 - 200},880 ${x1},${f === 0 ? 720 : 860}`} p={e(t, f === 0 ? a + 0.8 : f === 1 ? a + 2.7 : m.tres, (f === 0 ? a + 0.8 : f === 1 ? a + 2.7 : m.tres) + 1)} col={H2O} w={14} />
        {f === 0 && <><ellipse cx={980} cy={720} rx={120 * e(t, a + 1.6, a + 2.4)} ry={60 * e(t, a + 1.6, a + 2.4)} fill="rgba(58,74,82,.6)" /><path d="M900,720 C 860,700 860,600 840,560" fill="none" stroke={H2O} strokeWidth={8} strokeDasharray="12 10" opacity={e(t, a + 1.9, a + 2.3)} /></>}
        {f === 1 && <><rect x={1440} y={830} width={120} height={60} fill="#3a3f44" />{[0, 1, 2, 3].map((k) => <line key={k} x1={1452 + k * 30} y1={834} x2={1452 + k * 30} y2={886} stroke="#7d848a" strokeWidth={6} />)}</>}
        {f === 2 && <g opacity={e(t, m.tres + 0.4, m.tres + 1)}><line x1={890} y1={940} x2={1560} y2={940} stroke="#f2d14a" strokeWidth={22} />{[0, 1, 2, 3].map((k) => <line key={k} x1={890 + k * 223} y1={926} x2={890 + k * 223} y2={954} stroke="#2b241b" strokeWidth={4} />)}</g>}
        {f === 0 && <Cross t={t} at={a + 2.2} x={1160} y={640} r={44} />}
        {f === 1 && <Tick t={t} at={a + 3.6} x={1640} y={760} r={44} />}
        {f === 2 && <Tick t={t} at={m.tres + 1.2} x={1660} y={780} r={44} />}
      </Svg>
      <Lbl t={t} at={a + 1} out={a + 2.6} text="nunca en la tierra de al lado" x={1320} y={140} col={C.red} size={56} />
      <Lbl t={t} at={a + 2.9} out={m.tres - 0.3} text="a un desagüe o cuneta" x={1320} y={140} col={C.ok} size={60} />
      <Lbl t={t} at={m.tres + 0.4} text="o a 3 m de la casa" x={1320} y={140} col={C.sun} size={64} />
    </>
  );
};

// 17 · La Matanza: el dormitorio de frente con la mancha de un metro de ancho del piso al techo; la pared se vuelve
// transparente, del otro lado la jardinera de malvones con su regadera; las cotas de los dos anchos coinciden
export const JardineraAncho: React.FC<FxP> = ({ t, a, m }) => {
  const trans = e(t, m.jard, m.jard + 1.2), cota = e(t, m.ancho, m.ancho + 1), riego = t > m.jard + 1;
  return (
    <>
      <Svg>
        <Muro x={300} y={160} w={1320} h={720}>
          <rect x={900} y={190} width={320} height={644} fill="rgba(58,74,82,.5)" />
          <Mancha cx={1060} cy={500} rx={170} ry={340} k={1} seed={101} />
        </Muro>
        <g opacity={trans}>
          <rect x={300} y={160} width={1320} height={720} fill="rgba(18,14,9,.55)" />
          <rect x={900} y={700} width={320} height={180} fill="#9b4b2c" stroke="#5e3a1c" strokeWidth={5} />
          <rect x={906} y={690} width={308} height={26} fill="#4a3220" />
          {Array.from({ length: 6 }, (_, i) => <g key={i}><line x1={930 + i * 52} y1={690} x2={930 + i * 52} y2={600 - 30 * hash(i, 5)} stroke="#4c8a3c" strokeWidth={8} /><circle cx={930 + i * 52} cy={590 - 30 * hash(i, 5)} r={24} fill={i % 2 ? "#e05a7a" : "#d8354a"} /></g>)}
          {riego && <g transform={`translate(1360,${520 + 10 * Math.sin(t * 3)}) rotate(-24)`}><rect x={-80} y={-40} width={160} height={110} rx={20} fill="#3f7fb2" /><rect x={-200} y={-20} width={140} height={18} fill="#3f7fb2" transform="rotate(14)" />{Array.from({ length: 6 }, (_, i) => { const u = ((t * 1.3 + i / 6) % 1); return <circle key={i} cx={-210 - 30 * u} cy={20 + 160 * u} r={6} fill={H2O} opacity={1 - u} />; })}</g>}
        </g>
        {cota > 0 && <g opacity={cota}>
          {[160, 930].map((y, i) => <g key={i}><line x1={900} y1={y + (i ? 0 : -30)} x2={900 + 320 * cota} y2={y + (i ? 0 : -30)} stroke={C.sun} strokeWidth={6} /><line x1={900} y1={y - 50 + (i ? 30 : 0)} x2={900} y2={y + 10 + (i ? 30 : -30)} stroke={C.sun} strokeWidth={5} /><line x1={1220} y1={y - 50 + (i ? 30 : 0)} x2={1220} y2={y + 10 + (i ? 30 : -30)} stroke={C.sun} strokeWidth={5} /></g>)}
        </g>}
      </Svg>
      <Lbl t={t} at={a + 0.5} out={m.jard} text="un metro de ancho" x={1060} y={100} col={C.cream} size={60} />
      <Lbl t={t} at={m.jard + 0.6} out={m.ancho} text="del otro lado: malvones" x={1060} y={100} col={C.cream} size={60} />
      <Lbl t={t} at={m.ancho + 0.6} text="el mismo ancho" x={1060} y={1000} col={C.sun} size={70} />
    </>
  );
};

// 18 · el mate con el vecino: dos sillas, el mate pasa de mano en mano (tres vueltas), y aparecen las tres cosas que
// le podés pedir: correr la jardinera 10 cm, un nylon atrás, una pendiente chiquita
export const MateVecino: React.FC<FxP> = ({ t, a, m }) => {
  const u = ((t - m.mate) * 0.35) % 1, mx = t > m.mate ? lerp(760, 1160, 0.5 - 0.5 * Math.cos(u * Math.PI * 2)) : 760;
  const pedir = [["correr la jardinera 10 cm", m.corra], ["un nylon contra el muro", m.nylon], ["pendiente para el otro lado", m.pend]] as [string, number][];
  return (
    <>
      <Svg>
        {[700, 1220].map((x, i) => <g key={i} transform={`translate(${x},640)`}>
          <rect x={-90} y={60} width={180} height={20} fill={C.wood} /><rect x={-80} y={80} width={14} height={140} fill={C.wood2} /><rect x={66} y={80} width={14} height={140} fill={C.wood2} />
          <rect x={i ? 70 : -90} y={-120} width={20} height={190} fill={C.wood2} />
          <circle cx={0} cy={-150} r={50} fill={i ? "#c9936a" : "#d7a77a"} />
          <path d="M-70,60 C -70,-70 70,-70 70,60 Z" fill={i ? "#5c7a52" : "#6a7d8e"} />
        </g>)}
        <g transform={`translate(${mx},${560 - 40 * Math.sin(u * Math.PI)})`} opacity={e(t, m.mate - 0.3, m.mate + 0.3)}>
          <path d="M-30,-10 C -40,50 40,50 30,-10 Z" fill="#8a6a3a" stroke="#5e3a1c" strokeWidth={4} /><ellipse cx={0} cy={-10} rx={30} ry={8} fill="#6f8f3a" /><rect x={8} y={-70} width={6} height={64} fill="#c9c2b2" transform="rotate(14)" />
        </g>
        {/* termo */}
        <g transform="translate(960,820)"><rect x={-24} y={-120} width={48} height={120} rx={12} fill="#2d5a8a" /><rect x={-16} y={-136} width={32} height={20} rx={6} fill="#1d3a5a" /></g>
        {pedir.map(([, at0], i) => t > at0 && <g key={i} transform={`translate(${380 + i * 580},250) scale(${spr(t, at0)})`}>
          <rect x={-240} y={-70} width={480} height={140} rx={24} fill="rgba(40,30,18,.75)" stroke="rgba(255,236,200,.4)" strokeWidth={2} />
          {i === 0 && <g><rect x={-200} y={-40} width={60} height={80} fill={LAD2} /><rect x={-110 + 30 * e(t, at0, at0 + 0.8)} y={-30} width={70} height={60} fill="#9b4b2c" /><circle cx={-75 + 30 * e(t, at0, at0 + 0.8)} cy={-42} r={14} fill="#e05a7a" /></g>}
          {i === 1 && <g><rect x={-200} y={-40} width={60} height={80} fill={LAD2} /><rect x={-138} y={-40} width={10} height={80 * e(t, at0, at0 + 0.8)} fill="#e8eef0" opacity={0.9} /><rect x={-126} y={-30} width={80} height={70} fill="#6d4a2c" /></g>}
          {i === 2 && <g><rect x={-200} y={-40} width={30} height={80} fill={LAD2} /><path d={`M-170,${30 - 20 * e(t, at0, at0 + 0.8)} L-40,30 L-40,40 L-170,40 Z`} fill="#9c968c" /></g>}
        </g>)}
      </Svg>
      <Lbl t={t} at={a + 0.4} out={m.mate} text="no con reclamo" x={960} y={950} col={C.red} size={62} />
      <Lbl t={t} at={m.mate + 0.4} out={m.corra - 0.2} text="con mate" x={960} y={950} col={C.moss} size={80} />
      {pedir.map(([txt, at0], i) => <Lbl key={i} t={t} at={at0 + 0.3} text={txt} x={430 + i * 560} y={360} col={C.cream} size={36} />)}
    </>
  );
};

// 19 · cuánto rinde: la pared con la mancha + 30 cm por lado se cuadricula en metros (3 m²); de la bolsa de 10 kg
// salen montoncitos: 1 kg por m² por mano → dos manos = 6 kg y sobra para la tercera en lo más mojado
export const KiloPorMetro: React.FC<FxP> = ({ t, a, m }) => {
  const grid = e(t, a + 0.4, a + 1.6), manos = t < m.dos ? 1 : 2, sobra = e(t, m.tres, m.tres + 1.2), bolsa = e(t, m.bolsa, m.bolsa + 1);
  const usados = Math.min(10, (t > a + 1.6 ? 3 : 0) + (t > m.dos ? 3 : 0) + (t > m.tres ? 1.5 : 0));
  return (
    <>
      <Svg>
        <Muro x={260} y={260} w={780} h={520}>
          <Mancha cx={650} cy={520} rx={250} ry={180} k={1} seed={111} />
          {[0, 1, 2].map((c) => <rect key={c} x={290 + c * 240} y={300} width={240} height={420} fill="none" stroke={C.sun} strokeWidth={4} strokeDasharray="12 8" opacity={grid} />)}
          {[0, 1, 2].map((c) => <text key={c} x={410 + c * 240} y={530} textAnchor="middle" fontSize={56} fontWeight={800} fill={C.sun} fontFamily="Barlow Condensed" opacity={grid}>1 m²</text>)}
          {sobra > 0 && <rect x={530} y={420} width={240} height={200} fill="rgba(255,210,122,.25)" stroke={C.sun} strokeWidth={5} opacity={sobra} />}
        </Muro>
        <g transform={`translate(1440,${600 + shake(t, m.bolsa, 10)})`}>
          <path d="M-170,-220 L170,-220 L190,200 L-190,200 Z" fill="#d9d2c3" stroke="#8d887e" strokeWidth={4} />
          <rect x={-120} y={-120} width={240} height={110} rx={10} fill={C.solv} opacity={0.85} />
          <text x={0} y={-40} textAnchor="middle" fontSize={80} fontWeight={800} fill="#14202a" fontFamily="Barlow Condensed">10 kg</text>
          <rect x={-150} y={40} width={300} height={24} rx={12} fill="rgba(0,0,0,.25)" /><rect x={-150} y={40} width={300 * (usados / 10)} height={24} rx={12} fill={C.honey} />
        </g>
        {bolsa > 0 && <Tick t={t} at={m.bolsa + 0.4} x={1620} y={400} r={46} />}
      </Svg>
      <Pop t={t} at={a + 1.2} x={650} y={160}><Big size={92} col={C.ink}>1 kg × m² × mano</Big></Pop>
      <Lbl t={t} at={m.dos + 0.2} text={`${manos} manos = ${3 * manos} kg`} x={1440} y={900} col={C.honey} size={60} />
      <Lbl t={t} at={m.tres + 0.4} text="tercera en lo más mojado" x={650} y={900} col={C.sun} size={52} />
    </>
  );
};

// 20 · lo de veinte minutos: el reloj de 20 min corre sobre un balde; cuatro kilos se mezclan con la paleta; un balde
// con la bolsa entera se endurece (se agrieta, la paleta queda clavada) y va a la basura
export const BaldeVeinte: React.FC<FxP> = ({ t, a, m }) => {
  const rel = e(t, a + 0.4, m.endu + 2), duro = e(t, m.endu, m.endu + 1.4), rot = t * 600;
  return (
    <>
      <Svg>
        {[640, 1280].map((x, i) => <g key={i} transform={`translate(${x},${640 + (i ? shake(t, m.endu + 1.2, 8) : 0)})`} opacity={i ? e(t, m.endu - 0.5, m.endu) : 1}>
          <path d="M-180,-200 L180,-200 L150,200 L-150,200 Z" fill={i ? "#7f8a90" : "#4b78a8"} stroke="#2b3a46" strokeWidth={5} />
          <ellipse cx={0} cy={-200} rx={180} ry={40} fill={i ? `rgb(${lerp(190, 150, duro)},${lerp(185, 146, duro)},${lerp(175, 140, duro)})` : "#bfb8aa"} stroke="#2b3a46" strokeWidth={4} />
          {i === 0 && <g transform="translate(0,-230)"><rect x={-8} y={-260} width={16} height={240} fill="#5a5f66" /><g transform={`rotate(${t > m.cuatro ? rot : 0})`}><rect x={-60} y={-30} width={120} height={20} fill="#9aa4ab" transform="scale(1,.4)" /></g><rect x={-60} y={-360} width={120} height={110} rx={18} fill="#2c6fb0" /></g>}
          {i === 1 && duro > 0.3 && <><path d="M-120,-210 L-40,-190 L10,-215 L90,-185" fill="none" stroke="#3a3632" strokeWidth={5} opacity={duro} /><rect x={-6} y={-420} width={12} height={220} fill="#5a5f66" transform="rotate(12)" /></>}
          {i === 1 && duro > 0.6 && <Cross t={t} at={m.endu + 1} x={0} y={0} r={60} />}
        </g>)}
        <Reloj x={960} y={330} r={130} k={rel} />
      </Svg>
      <Lbl t={t} at={a + 0.6} out={m.cuatro} text="lo que usás en 20 min" x={960} y={560} col={C.cream} size={56} />
      <Lbl t={t} at={m.cuatro + 0.3} text="3 o 4 kg por vez" x={640} y={930} col={C.honey} size={60} />
      <Lbl t={t} at={m.endu + 0.6} text="se endurece en el balde" x={1280} y={930} col={C.red} size={54} />
    </>
  );
};

// 21 · error 1, pintar encima: corte del muro; la pintura plástica se cierra como una bolsa de nylon (brilla, film);
// el vapor que sale queda atrapado, empuja y hace ampollas; el revoque de abajo se oscurece (se pudre)
export const BolsaNylon: React.FC<FxP> = ({ t, a, m }) => {
  const film = e(t, m.bolsa - 0.6, m.bolsa + 0.6), amp = e(t, m.amp, m.amp + 1.6), pud = e(t, m.pudre, m.pudre + 1.4);
  return (
    <>
      <Svg>
        <Corte t={t} x={860} y={220} w={560} h={640} agua={0.9} />
        <rect x={860} y={220} width={90} height={640} fill={`rgba(70,52,30,${0.55 * pud})`} />
        <path d={`M${850 - 40 * amp},220 ${Array.from({ length: 9 }, (_, i) => { const y = 220 + (i + 0.5) * 71, b = 30 * amp * hash(i, 121); return `Q ${850 - b * 2.4},${y} 850,${220 + (i + 1) * 71}`; }).join(" ")}`} fill="rgba(235,240,255,.18)" stroke="rgba(235,245,255,.9)" strokeWidth={6 * film} />
        {Array.from({ length: 12 }, (_, i) => { const u = ((t * 0.4 + i / 12) % 1), x = lerp(940, 860, u); return <circle key={i} cx={x} cy={260 + 560 * hash(i, 122)} r={10 + 4 * u} fill="rgba(235,245,255,.6)" opacity={film * (1 - 0.3 * u)} />; })}
        <Ampollas x={700} y={260} w={150} h={560} k={amp} />
      </Svg>
      <Lbl t={t} at={a + 0.4} text="error 1" x={480} y={300} col={C.red} size={80} />
      <Lbl t={t} at={m.bolsa + 0.2} out={m.amp} text="una bolsa de nylon" x={480} y={460} col={C.cream} size={60} />
      <Lbl t={t} at={m.amp + 0.3} out={m.pudre} text="empuja y hace ampollas" x={480} y={460} col={C.cream} size={56} />
      <Lbl t={t} at={m.pudre + 0.3} text="pudre el revoque" x={480} y={460} col={C.honey} size={60} />
    </>
  );
};

// 22 · errores 2 a 4: tres láminas que caen: cerámica que tapa (se cae), el picado innecesario (revoque nuevo y la
// mancha vuelve), y la membrana de techo — se infla como piel; la flecha muestra que sirve para el agua de ARRIBA
export const PielTecho: React.FC<FxP> = ({ t, a, m }) => {
  const infl = e(t, m.infla, m.infla + 1.4), arr = e(t, m.arriba, m.arriba + 1);
  const L = [a + 0.2, a + 0.2 + (m.infla - a) * 0.33, a + 0.2 + (m.infla - a) * 0.62];
  return (
    <>
      <Svg>
        {/* 2: cerámica */}
        <g transform={`translate(380,${560 + (1 - spr(t, L[0])) * 400})`}><rect x={-200} y={-260} width={400} height={520} fill="#62805c" />{Array.from({ length: 12 }, (_, i) => { const c = i % 3, r = Math.floor(i / 3), f = i === 4 ? e(t, L[0] + 1.6, L[0] + 2.4) : 0; return <rect key={i} x={-190 + c * 130} y={-250 + r * 128 + 600 * f * f} width={120} height={118} fill="#eef3f4" stroke="#b9c3c6" strokeWidth={3} transform={`rotate(${50 * f} ${-130 + c * 130} ${-190 + r * 128})`} />; })}</g>
        {/* 3: picar todo */}
        <g transform={`translate(960,${560 + (1 - spr(t, L[1])) * 400})`}><rect x={-200} y={-260} width={400} height={520} fill={LAD} />{Array.from({ length: 8 }, (_, r) => <line key={r} x1={-200} y1={-260 + r * 65} x2={200} y2={-260 + r * 65} stroke={LAD2} strokeWidth={6} />)}<rect x={-200} y={-260} width={400} height={520 * e(t, L[1] + 1, L[1] + 2)} fill="#ece6d8" /><Mancha cx={40} cy={120} rx={130} ry={110} k={e(t, L[1] + 2.4, L[1] + 3.4)} seed={131} /></g>
        {/* 4: membrana */}
        <g transform={`translate(1540,${560 + (1 - spr(t, L[2])) * 400})`}>
          <rect x={-200} y={-260} width={400} height={520} fill="#e9dfca" />
          <path d={`M-200,-260 L200,-260 L200,260 L-200,260 Z`} fill="#c7c9cc" opacity={0.9} />
          {Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx={-140 + 70 * i} cy={-140 + 280 * hash(i, 141)} rx={60 * infl} ry={44 * infl} fill="#d8dadd" stroke="#8f9297" strokeWidth={3} />)}
          {Array.from({ length: 6 }, (_, i) => { const u = ((t * 0.6 + i / 6) % 1); return <path key={i} d={`M${260 - 60 * u},${-200 + 70 * i} l -24,0`} stroke={H2O} strokeWidth={8} strokeLinecap="round" opacity={infl * (1 - u)} />; })}
          {arr > 0 && <g opacity={arr}><path d={`M0,-480 L0,${-480 + 180 * arr}`} stroke={H2O} strokeWidth={14} /><path d={`M-26,${-320 + 20 * arr} L0,${-290 + 20 * arr} L26,${-320 + 20 * arr}`} fill="none" stroke={H2O} strokeWidth={12} /></g>}
        </g>
      </Svg>
      {["tapar con cerámica", "picar sin necesidad", "membrana de techo"].map((s, i) => <Lbl key={i} t={t} at={L[i] + 0.3} text={s} x={[380, 960, 1540][i]} y={900} col={C.cream} size={46} />)}
      {["2", "3", "4"].map((s, i) => <Pop key={i} t={t} at={L[i] + 0.2} x={[380, 960, 1540][i]} y={240}><Big size={90} col={C.red}>{s}</Big></Pop>)}
      <Lbl t={t} at={m.infla + 0.4} out={m.arriba} text="se infla y se despega" x={1540} y={980} col={C.red} size={40} />
      <Lbl t={t} at={m.arriba + 0.4} text="es para el agua de arriba" x={1540} y={980} col={H2O} size={40} />
    </>
  );
};

// 23 · la prueba del golpe: el mango del destornillador recorre la pared por la zona de la mancha; donde suena firme
// aparece una onda chica y verde; donde suena hueco, la onda es grande y el corte muestra el revoque despegado
export const GolpeHueco: React.FC<FxP> = ({ t, a, m }) => {
  const pts = [[620, 420, 0], [900, 380, 0], [1180, 460, 0], [760, 640, 1], [1000, 620, 1], [1240, 680, 0]] as [number, number, number][];
  const T0 = a + 0.5, dt = (m.hueco + 2 - T0) / pts.length;
  const corte = e(t, m.hueco + 0.8, m.hueco + 1.8);
  return (
    <>
      <Svg>
        <Muro x={400} y={240} w={1000} h={600}><Mancha cx={920} cy={540} rx={360} ry={240} k={0.7} seed={151} /></Muro>
        {pts.map(([x, y, h], i) => { const at0 = T0 + i * dt, u = cl((t - at0) / 0.9); return t > at0 ? <g key={i}>
          <circle cx={x} cy={y} r={(h ? 90 : 40) * u} fill="none" stroke={h ? C.red : C.ok} strokeWidth={6 * (1 - u) + 1} opacity={1 - u * 0.6} />
          <circle cx={x} cy={y} r={10} fill={h ? C.red : C.ok} />
        </g> : null; })}
        {(() => { const i = Math.min(pts.length - 1, Math.max(0, Math.floor((t - T0) / dt))), [x, y] = pts[i], k = cl(((t - T0) % dt) / dt); const ang = -30 + 40 * Math.max(0, Math.sin(k * Math.PI * 2)); return <g transform={`translate(${x + 30},${y - 20}) rotate(${ang})`}><rect x={0} y={-22} width={160} height={44} rx={20} fill="#e2b93a" stroke="#6b5a1a" strokeWidth={3} /><rect x={160} y={-7} width={180} height={14} fill="#9aa4ab" /></g>; })()}
        {corte > 0 && <g opacity={corte} transform="translate(1560,600)">
          <rect x={-100} y={-220} width={120} height={440} fill={LAD} />
          <path d={`M20,-220 L60,-220 L${60 + 30 * corte},-40 L${60 + 30 * corte},120 L60,220 L20,220 Z`} fill="#ece6d8" stroke="#8d887e" strokeWidth={3} />
          <path d={`M22,-120 L${50 + 30 * corte},-40 L${50 + 30 * corte},120 L22,180 Z`} fill="#1a140d" />
        </g>}
      </Svg>
      <Lbl t={t} at={m.firme + 0.2} out={m.hueco} text="firme: revoque sano" x={900} y={150} col={C.ok} size={64} />
      <Lbl t={t} at={m.hueco + 0.3} text="hueco: está despegado" x={900} y={150} col={C.red} size={64} />
      <Lbl t={t} at={m.hueco + 2} text="ese tramo sí se rehace" x={1560} y={900} col={C.cream} size={44} />
    </>
  );
};

// 24 · treinta más: la espátula levanta la pintura inflada en tiras; el cepillo de alambre pasa en cruz; el borde de la
// zona tratada se agranda 30 cm por cada lado más allá de la mancha (cotas que se estiran)
export const TreintaMas: React.FC<FxP> = ({ t, a, m }) => {
  const esp = e(t, a + 0.4, m.cepi), cep = e(t, m.cepi, m.mas), mas = e(t, m.mas, m.mas + 1.2);
  const X = 620, Y = 360, W = 680, H = 400, pad = 90 * mas;
  return (
    <>
      <Svg>
        <Muro x={300} y={180} w={1320} h={720} pint="#f0e9da">
          <rect x={X - pad} y={Y - pad} width={W + 2 * pad} height={H + 2 * pad} fill="#d9d2c3" opacity={mas} />
          <rect x={X} y={Y} width={W} height={H} fill="#d9d2c3" />
          {Array.from({ length: 8 }, (_, i) => { const up = cl(esp * 8 - i); return <path key={i} d={`M${X + i * 85},${Y} L${X + i * 85 + 85},${Y} L${X + i * 85 + 85},${Y + H * (1 - up)} L${X + i * 85},${Y + H * (1 - up)} Z`} fill="#f4eee2" stroke="#c9c1ae" strokeWidth={2} />; })}
          <Mancha cx={X + W / 2} cy={Y + H / 2} rx={W * 0.42} ry={H * 0.42} k={0.6} seed={161} />
          {cep > 0 && Array.from({ length: 30 }, (_, i) => <line key={i} x1={X + W * hash(i, 1)} y1={Y + H * hash(i, 2)} x2={X + W * hash(i, 1) + (i % 2 ? 60 : -60)} y2={Y + H * hash(i, 2) + 40} stroke="rgba(120,110,90,.45)" strokeWidth={3} opacity={cl(cep * 30 - i)} />)}
          {mas > 0 && <rect x={X - pad} y={Y - pad} width={W + 2 * pad} height={H + 2 * pad} fill="none" stroke={C.sun} strokeWidth={6} strokeDasharray="20 12" />}
        </Muro>
        {esp > 0 && esp < 1 && <g transform={`translate(${X + W * esp},${Y + H * 0.5 + 20 * Math.sin(t * 9)}) rotate(-35)`}><rect x={-8} y={-160} width={30} height={130} rx={10} fill="#3b2a1a" /><path d="M-60,-30 L80,-30 L70,30 L-50,30 Z" fill="#b9c0c6" stroke="#6d757c" strokeWidth={3} /></g>}
        {cep > 0 && cep < 1 && <g transform={`translate(${X + W * (0.5 + 0.45 * Math.sin(t * 6))},${Y + H * (0.5 + 0.4 * Math.cos(t * 4.4))}) rotate(${30 * Math.sin(t * 5)})`}><rect x={-110} y={-30} width={220} height={60} rx={12} fill="#a46a3a" />{Array.from({ length: 10 }, (_, i) => <line key={i} x1={-100 + i * 22} y1={30} x2={-100 + i * 22} y2={60} stroke="#8f969c" strokeWidth={4} />)}</g>}
      </Svg>
      <Lbl t={t} at={a + 0.6} out={m.cepi} text="espátula: lo que se levanta" x={960} y={110} col={C.cream} size={56} />
      <Lbl t={t} at={m.cepi + 0.3} out={m.mas} text="alambre en todas direcciones" x={960} y={110} col={C.cream} size={56} />
      <Lbl t={t} at={m.mas + 0.4} text="+30 cm por cada lado" x={960} y={970} col={C.sun} size={64} />
    </>
  );
};

// 25 · el salitre viaja: corte del muro; el agua disuelve las sales (cubitos blancos) y las arrastra a la cara; al
// evaporarse quedan como escarcha. Si se cepilla en seco caen al piso; si se moja, vuelven a disolverse y entran
export const SalitreViaja: React.FC<FxP> = ({ t, a, m }) => {
  const seco = t > m.seco && t < m.moja, moja = t >= m.moja, k = e(t, a + 0.4, m.seco);
  return (
    <>
      <Svg>
        <Corte t={t} x={980} y={220} w={560} h={640} agua={0.85} poros={false} />
        {Array.from({ length: 20 }, (_, i) => {
          const u = (t * 0.25 + hash(i, 171)) % 1, y = 260 + 560 * hash(i, 172);
          const xx = moja ? lerp(990, 1200, e(t, m.moja + hash(i, 3) * 0.6, m.moja + 1.2 + hash(i, 3) * 0.6)) : lerp(1440, 990, Math.min(1, u * 1.6 * k + 0.0));
          return <rect key={i} x={xx - 7} y={y - 7} width={14} height={14} fill="#f6f4ee" transform={`rotate(${45 * hash(i, 4)} ${xx} ${y})`} opacity={moja ? 1 - e(t, m.moja + 1.2, m.moja + 2) * 0.4 : 1} />;
        })}
        <Salitre x={920} y={860} w={60} k={k} />
        {Array.from({ length: 40 }, (_, i) => { const yy = 240 + 600 * hash(i, 181), fall = seco ? e(t, m.seco + 0.4 + hash(i, 2) * 1.2, m.seco + 1.4 + hash(i, 2) * 1.2) : 0; return <circle key={i} cx={968 - 6 * hash(i, 182) - 60 * fall} cy={yy + (880 - yy) * fall * fall} r={3 + 4 * hash(i, 183)} fill="#fbfaf6" opacity={k * (moja ? 1 - e(t, m.moja, m.moja + 1) : 1)} />; })}
        {seco && <g transform={`translate(900,${560 + 280 * Math.sin((t - m.seco) * 2.2)})`}><rect x={-60} y={-110} width={50} height={220} rx={12} fill="#a46a3a" />{Array.from({ length: 10 }, (_, i) => <line key={i} x1={-10} y1={-100 + i * 22} x2={40} y2={-100 + i * 22} stroke="#2b241b" strokeWidth={5} />)}</g>}
        {moja && Array.from({ length: 10 }, (_, i) => { const u = ((t - m.moja) * 1.2 + i / 10) % 1; return <circle key={i} cx={lerp(700, 970, u)} cy={300 + 500 * hash(i, 191)} r={8} fill={H2O} />; })}
        {moja && <Cross t={t} at={m.moja + 1.4} x={700} y={300} r={48} />}
        {seco && <Tick t={t} at={m.seco + 1.6} x={700} y={300} r={48} />}
      </Svg>
      <Lbl t={t} at={a + 0.6} out={m.seco} text="sales que el agua trae" x={500} y={560} col={C.cream} size={56} />
      <Lbl t={t} at={m.seco + 0.3} out={m.moja} text="primero en seco" x={500} y={560} col={C.ok} size={64} />
      <Lbl t={t} at={m.moja + 0.4} text="mojado, se vuelve a meter" x={500} y={560} col={C.red} size={52} />
    </>
  );
};
