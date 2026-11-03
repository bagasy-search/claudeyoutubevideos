// cl2alisar · componentes del puente a Don Tito (el dedo que deja hilito, una de ligante y tres de agua, paño por paño,
// uno-uno-dos en baldes, la piedrita que raya, los tres papeles de la mezcla, el orden del balde, el punto manteca, la llana
// que se abre como un ala, el aire atrapado que la pasada cruzada tapa, la mano que más gasta, la esquina con tabla, el marco
// al ras, el gris que aclara, el raspado entre manos, cinco paredes mal, la mezcla de una hora, la linterna de metal).
import React from "react";
import { C, FONT, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Big, Cross, Draw, FxP, Pop, Svg, Tick, shake } from "./kit";
import { Balde, Espatula, Llana, Muro, mk } from "./comps1";

// 26 · el dedo y el hilito: el puente pegajoso se estira cuando el dedo se levanta; el seco, no
export const DedoHilito: React.FC<FxP> = ({ t, a, m }) => {
  const k = mk(m, "dedo", a + 1.2), up = e(t, k + 0.4, k + 1.6), hil = up * (1 - e(t, k + 1.6, k + 2));
  return (
    <>
      <Svg>
        <rect x={560} y={620} width={800} height={260} fill={C.lad} /><rect x={560} y={600} width={800} height={30} fill={C.puente} />
        <g transform={`translate(960,${600 - 220 * up})`} opacity={e(t, k - 0.3, k)}><rect x={-50} y={-260} width={100} height={260} rx={50} fill="#d9a07a" /><ellipse cx={0} cy={0} rx={50} ry={16} fill={C.puente} opacity={up} /></g>
        {hil > 0.01 && <path d={`M960,604 C${940},${600 - 110 * up} ${980},${600 - 120 * up} 960,${600 - 220 * up}`} stroke={C.puente} strokeWidth={8 * (1 - up * 0.6)} fill="none" />}
      </Svg>
      <Lbl t={t} at={k + 1} text="deja hilito" x={1500} y={420} size={54} col={C.ok} />
      <Lbl t={t} at={k + 2.2} text="es el momento" x={1500} y={540} size={46} col={C.ink} />
    </>
  );
};

// 27 · una de ligante, tres de agua, y el cemento que entra de a poco hasta pintura espesa
export const LiganteTresAgua: React.FC<FxP> = ({ t, a, m }) => {
  const ce = mk(m, "cemento", a + 3);
  return (
    <>
      <Svg>
        {[0, 1, 2, 3].map((i) => <g key={i} opacity={e(t, a + 0.4 + i * 0.5, a + 0.8 + i * 0.5)} transform={`translate(${360 + i * 170},${560 - (1 - spr(t, a + 0.4 + i * 0.5)) * 80})`}><rect x={-60} y={-90} width={120} height={180} rx={14} fill={i === 0 ? C.puente : "rgba(124,200,255,.55)"} stroke={i === 0 ? "#bdb6a5" : "#4a8ab8"} strokeWidth={4} /></g>)}
        <Balde x={1300} y={820} w={360} h={380} lv={0.6} col={`rgb(${Math.round(lerp(200, 170, e(t, ce, ce + 3)))},${Math.round(lerp(220, 166, e(t, ce, ce + 3)))},${Math.round(lerp(235, 156, e(t, ce, ce + 3)))})`} />
        {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={1300 + (hash(i, 1) - 0.5) * 120} cy={lerp(300, 600, ((t - ce) * 0.9 + hash(i, 2)) % 1)} r={6} fill={C.mort} opacity={t > ce && t < ce + 3 ? 0.9 : 0} />)}
      </Svg>
      <Lbl t={t} at={a + 0.6} text="1 ligante" x={360} y={760} size={44} col={C.puente} />
      <Lbl t={t} at={a + 1.6} text="3 de agua" x={700} y={760} size={44} col={C.agua} />
      <Lbl t={t} at={ce + 1} text="pintura espesa" x={1300} y={950} size={48} col={C.honey} />
    </>
  );
};

// 28 · paño por paño: la pared dividida en metros; cada paño se pinta de puente y enseguida recibe la mano encima
export const PanoPorPano: React.FC<FxP> = ({ t, a, b }) => {
  const n = 5, u = e(t, a + 0.5, b - 1) * n;
  return (
    <>
      <Svg>
        <Muro x={260} y={200} w={1400} h={600} moja={0.4} seed={28} />
        {Array.from({ length: n }, (_, i) => {
          const x = 260 + i * 280, pu = cl(u - i), pm = cl((u - i - 0.45) * 1.8);
          return <g key={i}><rect x={x} y={200} width={280} height={600 * pu} fill={C.puente} opacity={0.75} /><rect x={x} y={200} width={280} height={600 * pm} fill={C.prim} /><line x1={x} x2={x} y1={190} y2={810} stroke={C.honey} strokeWidth={3} strokeDasharray="10 10" /></g>;
        })}
      </Svg>
      <Lbl t={t} at={a + 0.6} text="un metro por vez" x={960} y={890} size={50} col={C.honey} />
    </>
  );
};

// 29 · uno, uno, dos: el balde de pintura como medida; cal, cemento y dos de arena caen a la batea
export const UnoUnoDos: React.FC<FxP> = ({ t, a, m }) => {
  const bs = [["cal", C.end, "cal"], ["cemento", C.mort, "cem"], ["arena", "#cdb486", "ar1"], ["arena", "#cdb486", "ar2"]] as const;
  return (
    <>
      <Svg>
        <path d="M400,900 L520,780 L1400,780 L1520,900 Z" fill="#4c5157" />
        {bs.map(([, col, k], i) => {
          const at = mk(m, k, a + 0.6 + i * 1.1), p = e(t, at, at + 0.7), x = 520 + i * 290;
          return <g key={k}>
            <g transform={`translate(${x},${lerp(560, 360, p)}) rotate(${lerp(0, 120, p)})`} opacity={1 - e(t, at + 1, at + 1.3)}><Balde x={0} y={110} w={150} h={170} lv={1 - p * 0.9} col={col} /></g>
            <ellipse cx={x + 60} cy={820} rx={110 * p} ry={30 * p} fill={col} />
          </g>;
        })}
      </Svg>
      {bs.map(([w, col, k], i) => <Lbl key={k} t={t} at={mk(m, k, a + 0.6 + i * 1.1) + 0.4} text={i === 3 ? "+ 1" : w} x={580 + i * 290} y={960} size={46} col={col} />)}
      <Pop t={t} at={a + 5.4} x={1660} y={300}><Big size={120} col={C.honey} style={{ whiteSpace: "nowrap" }}>1 · 1 · 2</Big></Pop>
    </>
  );
};

// 30 · la piedrita que raya: un grano grueso queda atrapado bajo la llana y deja un surco en todo el paño
export const PiedritaRaya: React.FC<FxP> = ({ t, a, m }) => {
  const k = mk(m, "raya", a + 1), u = e(t, k, k + 2.4), ta = mk(m, "tamiz", a + 4);
  return (
    <>
      <Svg>
        <rect x={300} y={200} width={1000} height={680} fill={C.prim} />
        <Draw d="M460,860 C520,640 560,420 620,220" p={u} col={C.prim2} w={14} />
        <circle cx={lerp(460, 620, u)} cy={lerp(860, 220, u)} r={12} fill="#6f6250" />
        <Llana x={lerp(460, 620, u) + 20} y={lerp(860, 220, u) - 50} rot={-15} s={0.75} />
        <g opacity={e(t, ta, ta + 0.6)} transform="translate(1560,540)"><rect x={-160} y={-160} width={320} height={320} rx={20} fill="none" stroke={C.alu} strokeWidth={10} />{Array.from({ length: 13 }, (_, i) => <g key={i}><line x1={-150 + i * 25} x2={-150 + i * 25} y1={-150} y2={150} stroke={C.alu2} strokeWidth={2} /><line y1={-150 + i * 25} y2={-150 + i * 25} x1={-150} x2={150} stroke={C.alu2} strokeWidth={2} /></g>)}</g>
      </Svg>
      <Lbl t={t} at={k + 1.6} text="una raya larga" x={800} y={960} size={50} col={C.red} />
      <Lbl t={t} at={ta + 0.6} text="arena tamizada" x={1560} y={800} size={46} col={C.ok} />
    </>
  );
};

// 31 · los tres papeles: la cal la hace cremosa, el cemento la endurece, el ligante la pega
export const TresPapeles: React.FC<FxP> = ({ t, a, m }) => {
  const ps = [["cal", "cremosa", "cal", C.end], ["cemento", "dura", "cem", C.mort], ["ligante", "pega", "lig", C.puente]] as const;
  return (
    <>
      <Svg>
        {ps.map(([, , k, col], i) => {
          const at = mk(m, k, a + 0.6 + i * 1.8), x = 400 + i * 560, p = spr(t, at);
          return <g key={k} opacity={cl((t - at) * 4)} transform={`translate(${x},${500 + (1 - p) * 90})`}>
            <circle r={170} fill="rgba(24,22,20,.86)" stroke={col} strokeWidth={6} />
            {i === 0 && <path d={`M-100,40 Q-50,${-40 - 20 * Math.sin(t * 2)} 0,20 Q50,${-50 + 20 * Math.sin(t * 2)} 100,30 L100,90 L-100,90 Z`} fill={col} />}
            {i === 1 && <g transform={`translate(0,${shake(t, at + 0.8, 8)})`}><rect x={-80} y={-60} width={160} height={120} fill={col} /><path d="M-130,-140 L-60,-60" stroke={C.alu} strokeWidth={14} /><circle cx={-140} cy={-150} r={26} fill={"#7a7d82"} /></g>}
            {i === 2 && <g><rect x={-110} y={-20} width={100} height={70} fill={C.lad} /><rect x={10} y={-20} width={100} height={70} fill={C.prim} /><path d={`M-10,15 L10,15`} stroke={col} strokeWidth={30 * e(t, at + 0.5, at + 1.2)} /></g>}
          </g>;
        })}
      </Svg>
      {ps.map(([w, q, k, col], i) => <Lbl key={k} t={t} at={mk(m, k, a + 0.6 + i * 1.8) + 0.4} text={`${w}: ${q}`} x={400 + i * 560} y={780} size={46} col={col} />)}
    </>
  );
};

// 32 · el orden del balde: agua con ligante, cal, cemento, arena; las capas se apilan y el batidor las une
export const OrdenDelBalde: React.FC<FxP> = ({ t, a, m }) => {
  const cs = [["agua + ligante", C.agua, "o1"], ["cal", C.end, "o2"], ["cemento", C.mort, "o3"], ["arena", "#cdb486", "o4"]] as const, bat = mk(m, "bate", a + 6), mix = e(t, bat, bat + 2);
  return (
    <>
      <Svg>
        <defs><clipPath id="ob_c"><path d="M640,360 L700,860 L1020,860 L1080,360 Z" /></clipPath></defs>
        <g clipPath="url(#ob_c)">
          {cs.map(([, col, k], i) => { const at = mk(m, k, a + 0.6 + i * 1.2), h = 110 * e(t, at, at + 0.8); return <rect key={k} x={600} y={860 - 110 * i - h} width={520} height={h} fill={col} opacity={1 - mix * 0.9} />; })}
          <rect x={600} y={420} width={520} height={440} fill={C.prim} opacity={mix} />
        </g>
        <path d="M640,360 L700,860 L1020,860 L1080,360" fill="none" stroke="#7d98ac" strokeWidth={8} />
        <g opacity={e(t, bat - 0.3, bat)} transform={`translate(860,${300 + 20 * Math.sin(t * 9)}) rotate(${(t * 900) % 360 * 0 + 6 * Math.sin(t * 20)})`}><rect x={-10} y={-240} width={20} height={460} fill={C.alu2} /><path d="M-60,220 L60,220 L40,280 L-40,280 Z" fill="none" stroke={C.alu} strokeWidth={8} /></g>
      </Svg>
      {cs.map(([w, col, k], i) => <Lbl key={k} t={t} at={mk(m, k, a + 0.6 + i * 1.2) + 0.3} text={`${i + 1}. ${w}`} x={1220} y={800 - i * 110} size={44} col={col} align="left" />)}
    </>
  );
};

// 33 · el punto manteca: la llana cargada se pone de costado; la sopa chorrea, la arena se desgrana, la manteca se queda
export const PuntoManteca: React.FC<FxP> = ({ t, a, m }) => {
  const ps = [["sopa", "so", C.red], ["manteca", "ma", C.ok], ["arena húmeda", "ar", C.red]] as const;
  return (
    <>
      <Svg>
        {ps.map(([, k, ], i) => {
          const at = mk(m, k, a + 0.6 + i * 1.8), r = lerp(0, -80, e(t, at, at + 0.8)), x = 380 + i * 580, dr = e(t, at + 0.8, at + 2);
          return <g key={k} opacity={e(t, at - 0.3, at)}>
            <g transform={`translate(${x},520) rotate(${r})`}><rect x={-150} y={-20} width={300} height={40} rx={8} fill={C.alu} /><rect x={-110} y={-70} width={220} height={52} rx={18} fill={C.prim} opacity={i === 0 ? 1 - dr * 0.7 : i === 2 ? 1 - dr * 0.5 : 1} /></g>
            {i === 0 && Array.from({ length: 4 }, (_, q) => <path key={q} d={`M${x - 30 + q * 20},560 l0,${180 * dr}`} stroke={C.prim} strokeWidth={10} strokeLinecap="round" />)}
            {i === 2 && Array.from({ length: 14 }, (_, q) => <circle key={q} cx={x - 60 + hash(q, 1) * 120} cy={560 + 260 * dr * hash(q, 2)} r={7} fill={C.prim2} opacity={dr} />)}
            {i === 1 && <Tick t={t} at={at + 1.4} x={x} y={330} r={40} />}
          </g>;
        })}
      </Svg>
      {ps.map(([w, k, col], i) => <Lbl key={k} t={t} at={mk(m, k, a + 0.6 + i * 1.8) + 0.6} text={w} x={380 + i * 580} y={880} size={50} col={col} />)}
    </>
  );
};

// 34 · la llana como un ala: cargada en el tercio de abajo, inclinada, sube apretando y deja la mezcla en la pared
export const LlanaInclinada: React.FC<FxP> = ({ t, a, m }) => {
  const k = mk(m, "sube", a + 1.6), u = e(t, k, k + 2.2), ang = lerp(0, 24, e(t, a + 0.6, k));
  return (
    <>
      <Svg>
        <rect x={500} y={140} width={180} height={800} fill={C.lad} />
        <rect x={680} y={lerp(860, 200, u)} width={26} height={lerp(0, 660, u)} fill={C.prim} />
        <g transform={`translate(${740},${lerp(840, 220, u)}) rotate(${-90 + ang})`}><Llana x={0} y={0} carga={1 - u * 0.8} s={0.85} /></g>
        <Draw d="M820,860 L820,240" p={u} col={C.honey} w={5} dash="16 12" />
      </Svg>
      <Lbl t={t} at={a + 0.8} text="tercio de abajo" x={1300} y={700} size={48} col={C.ink} />
      <Lbl t={t} at={a + 1.6} text="inclinada, como un ala" x={1300} y={560} size={46} col={C.honey} />
      <Lbl t={t} at={k + 1.2} text="sube apretando" x={1300} y={420} size={48} col={C.ok} />
    </>
  );
};

// 35 · el aire atrapado: una pasada deja burbujas en los poros; la cruzada entra desde el costado y las tapa
export const AireAtrapado: React.FC<FxP> = ({ t, a, m }) => {
  const p1 = mk(m, "una", a + 0.8), p2 = mk(m, "cruza", a + 4), u1 = e(t, p1, p1 + 1.6), u2 = e(t, p2, p2 + 1.6);
  return (
    <>
      <Svg>
        <rect x={360} y={240} width={1200} height={600} fill={C.lad} />
        {Array.from({ length: 24 }, (_, i) => <circle key={i} cx={420 + (i % 8) * 150} cy={320 + Math.floor(i / 8) * 190} r={22} fill="#1c1410" />)}
        <rect x={360} y={840 - 600 * u1} width={1200} height={600 * u1} fill={C.prim} opacity={0.92} />
        {Array.from({ length: 24 }, (_, i) => { const x = 420 + (i % 8) * 150, show = u1 > 0.99 && hash(i, 3) < 0.55, gone = u2 * 1200 > x - 360; return show && !gone ? <circle key={"b" + i} cx={x} cy={320 + Math.floor(i / 8) * 190} r={16} fill="none" stroke="#fff" strokeWidth={3} opacity={0.8} /> : null; })}
        {u2 > 0.01 && <rect x={360} y={240} width={1200 * u2} height={600} fill={C.prim} opacity={0.4} />}
        <Draw d="M360,900 L1560,900" p={u2} col={C.honey} w={6} />
        <Draw d="M300,840 L300,240" p={u1} col={C.honey} w={6} />
      </Svg>
      <Lbl t={t} at={p1 + 1.8} text="queda aire" x={960} y={170} size={50} col={C.red} out={p2 + 1.4} />
      <Lbl t={t} at={p2 + 1.6} text="la cruzada lo tapa" x={960} y={170} size={50} col={C.ok} />
    </>
  );
};

// 36 · la mano que más gasta: tres barras de material por mano; la primera se come el balde
export const LaQueMasGasta: React.FC<FxP> = ({ t, a }) => {
  const bs = [["1ª mano", 1, C.prim], ["2ª", 0.32, C.end], ["3ª", 0.22, C.end]] as const;
  return (
    <>
      <Svg>
        <line x1={360} x2={1560} y1={860} y2={860} stroke="rgba(255,236,200,.4)" strokeWidth={3} />
        {bs.map(([, v, col], i) => { const at = a + 0.6 + i * 1.2, h = 560 * v * e(t, at, at + 1.2); return <rect key={i} x={460 + i * 380} y={860 - h} width={220} height={h} rx={10} fill={col} />; })}
      </Svg>
      {bs.map(([w, , col], i) => <Lbl key={w} t={t} at={a + 0.8 + i * 1.2} text={w} x={570 + i * 380} y={920} size={46} col={col} />)}
      <Lbl t={t} at={a + 2} text="rellena todo" x={570} y={240} size={46} col={C.honey} />
    </>
  );
};

// 37 · la esquina con tabla: una tabla derecha de un lado, se llena hasta su borde; se pasa al otro lado
export const EsquinaConTabla: React.FC<FxP> = ({ t, a, m }) => {
  const l1 = mk(m, "tabla", a + 1), l2 = mk(m, "otro", a + 4.5), f1 = e(t, l1 + 0.6, l1 + 2), f2 = e(t, l2 + 0.6, l2 + 2);
  return (
    <>
      <Svg>
        <path d="M960,200 L560,380 L560,900 L960,720 Z" fill={C.lad} /><path d="M960,200 L1360,380 L1360,900 L960,720 Z" fill={C.lad2} />
        <path d={`M960,200 L${lerp(960, 560, f1)},${lerp(200, 380, f1)} L${lerp(960, 560, f1)},${lerp(720, 900, f1)} L960,720 Z`} fill={C.prim} />
        <path d={`M960,200 L${lerp(960, 1360, f2)},${lerp(200, 380, f2)} L${lerp(960, 1360, f2)},${lerp(720, 900, f2)} L960,720 Z`} fill={C.prim2} />
        <g opacity={e(t, l1, l1 + 0.3) * (1 - e(t, l2 - 0.4, l2))}><path d="M968,196 L1300,345 L1300,375 L968,226 Z" fill={C.wood} /><path d="M968,196 L968,720 L992,730 L992,206 Z" fill="#7a4d24" /></g>
        <g opacity={e(t, l2, l2 + 0.3)}><path d="M952,196 L620,345 L620,375 L952,226 Z" fill={C.wood} /><path d="M952,196 L952,720 L928,730 L928,206 Z" fill="#7a4d24" /></g>
        <line x1={960} x2={960} y1={200} y2={720} stroke={C.ok} strokeWidth={4} opacity={e(t, l2 + 2, l2 + 2.6)} />
      </Svg>
      <Lbl t={t} at={l1 + 0.4} text="una tabla derecha" x={1600} y={300} size={46} col={C.honey} />
      <Lbl t={t} at={l2 + 2.2} text="cortada con cuchillo" x={1600} y={420} size={46} col={C.ok} />
    </>
  );
};

// 38 · el marco al ras: la mezcla llega hasta el aluminio, no encima; el trapo húmedo saca la mancha en el momento
export const MarcoAlRas: React.FC<FxP> = ({ t, a, m }) => {
  const k = mk(m, "trapo", a + 2), u = e(t, k, k + 1.6);
  return (
    <>
      <Svg>
        <rect x={300} y={160} width={1320} height={760} fill={C.prim} />
        <rect x={700} y={280} width={520} height={520} fill="none" stroke={C.alu} strokeWidth={34} /><rect x={717} y={297} width={486} height={486} fill="rgba(160,210,255,.25)" />
        {Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx={760 + i * 100} cy={280} rx={30} ry={10} fill={C.prim2} opacity={1 - e(t, k + i * 0.25, k + 0.4 + i * 0.25)} />)}
        <g opacity={cl((t - k) * 4) * (1 - e(t, k + 1.6, k + 2))} transform={`translate(${lerp(740, 1180, u)},270)`}><path d="M-60,-40 Q0,-60 60,-40 L50,30 Q0,50 -50,30 Z" fill="#e7e1d3" /></g>
      </Svg>
      <Lbl t={t} at={a + 0.6} text="al ras, no encima" x={960} y={980} size={50} col={C.honey} />
      <Lbl t={t} at={k + 1.8} text="limpio en el momento" x={960} y={140} size={46} col={C.ok} />
    </>
  );
};

// 39 · el gris que aclara: la pared recién pasada, gris oscura, se aclara en manchas; donde queda oscuro, falta
export const GrisQueAclara: React.FC<FxP> = ({ t, a, b }) => {
  const u = e(t, a + 0.6, b - 1.5);
  return (
    <>
      <Svg>
        <defs><clipPath id="ga_c"><rect x={360} y={180} width={1200} height={680} /></clipPath></defs>
        <rect x={360} y={180} width={1200} height={680} fill={C.prim2} />
        <g clipPath="url(#ga_c)">{Array.from({ length: 34 }, (_, i) => { const cx = 380 + hash(i, 1) * 1160, cy = 200 + hash(i, 2) * 640, late = hash(i, 3) > 0.8; return <circle key={i} cx={cx} cy={cy} r={60 + 140 * u * (late ? 0.4 : 1)} fill={C.prim} opacity={0.9} />; })}</g>
        {Array.from({ length: 6 }, (_, i) => <circle key={"d" + i} cx={420 + hash(i + 50, 1) * 1080} cy={240 + hash(i + 50, 2) * 560} r={50} fill={C.mort2} opacity={0.75 * (1 - u * 0.4)} />)}
      </Svg>
      <Lbl t={t} at={a + 0.6} text="gris oscuro: húmeda" x={760} y={950} size={46} col={C.dim} />
      <Lbl t={t} at={a + 3} text="gris claro: lista" x={1240} y={950} size={46} col={C.ok} />
    </>
  );
};

// 40 · el raspado entre manos: la espátula acostada baja y las piedritas saltan de la pared
export const RaspadoEntreManos: React.FC<FxP> = ({ t, a, m }) => {
  const k = mk(m, "raspa", a + 0.8), u = e(t, k, k + 3);
  return (
    <>
      <Svg>
        <rect x={400} y={160} width={900} height={760} fill={C.prim} />
        {Array.from({ length: 40 }, (_, i) => { const x = 440 + hash(i, 1) * 820, y = 200 + hash(i, 2) * 680, hit = 160 + 760 * u > y, f = cl((t - k - (y - 160) / 760 * 3) * 2); return <circle key={i} cx={x + (hit ? 260 * f * hash(i, 3) : 0)} cy={y + (hit ? -80 * f + 300 * f * f : 0)} r={6} fill="#6f6250" opacity={hit ? 1 - f : 1} />; })}
        <g transform={`translate(850,${160 + 760 * u}) rotate(180)`}><Espatula x={0} y={0} w={520} /></g>
      </Svg>
      <Lbl t={t} at={k + 1} text="escuchá las piedritas" x={1600} y={500} size={44} col={C.honey} />
    </>
  );
};

// 41 · las paredes mal: cada error marcado con su pared (los que no tienen marca no se dibujan); manchada, cuarteada, rajada alrededor, mezcla tirada, cuarteada arriba
export const CincoParedesMal: React.FC<FxP> = ({ t, a, m }) => {
  const es = [["sin probar", "e1"], ["sin mojar", "e2"], ["gruesa para enderezar", "e3"], ["mezcla de golpe", "e4"], ["apurar manos", "e5"]] as const;
  return (
    <>
      <Svg>
        {es.map(([, k], i) => {
          if (m[k] === undefined) return null;
          const at = m[k], x = 230 + i * 365, p = spr(t, at);
          return <g key={k} opacity={cl((t - at) * 5)} transform={`translate(0,${(1 - p) * 100})`}>
            <rect x={x - 140} y={380} width={280} height={360} rx={8} fill={C.end2} />
            {i === 0 && <path d={`M${x - 140},740 Q${x - 60},600 ${x},650 Q${x + 80},580 ${x + 140},740 Z`} fill={C.hum} opacity={0.7} />}
            {i === 1 && Array.from({ length: 12 }, (_, q) => <polyline key={q} points={`${x - 120 + hash(q, 1) * 240},${400 + hash(q, 2) * 320} l${20 - 40 * hash(q, 3)},18 l${-20 + 40 * hash(q, 4)},20`} fill="none" stroke="#3a3632" strokeWidth={3} />)}
            {i === 2 && <g><ellipse cx={x} cy={560} rx={70} ry={90} fill={C.prim2} /><ellipse cx={x} cy={560} rx={90} ry={110} fill="none" stroke="#1a1714" strokeWidth={4} strokeDasharray="30 10" /></g>}
            {i === 3 && <g><Balde x={x} y={720} w={180} h={200} lv={0.7} col={C.prim2} /><text x={x} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={60} fill={C.red}>2 h</text></g>}
            {i === 4 && <g><rect x={x - 140} y={380} width={280} height={180} fill={C.end} />{Array.from({ length: 8 }, (_, q) => <polyline key={q} points={`${x - 120 + q * 34},400 l10,40 l-12,40 l8,50`} fill="none" stroke="#3a3632" strokeWidth={3} />)}</g>}
            <Cross t={t} at={at + 0.8} x={x} y={320} r={34} />
          </g>;
        })}
      </Svg>
      {es.map(([w, k], i) => m[k] !== undefined && <Lbl key={k} t={t} at={m[k] + 0.3} text={w} x={230 + i * 365} y={820} size={34} col={i === 4 ? C.red : C.ink} />)}
    </>
  );
};

// 42 · la mezcla de una hora: un reloj que corre sobre el balde; la mezcla se pone dura, no se revive con agua
export const MezclaUnaHora: React.FC<FxP> = ({ t, a, m }) => {
  const k = mk(m, "dura", a + 3), ag = mk(m, "agua", a + 5.5), h = e(t, a + 0.5, k + 1), g = 1 - h * 0.5;
  return (
    <>
      <Svg>
        <Balde x={760} y={860} w={420} h={440} lv={0.75} col={`rgb(${Math.round(201 * g + 80 * (1 - g))},${Math.round(196 * g + 76 * (1 - g))},${Math.round(184 * g + 70 * (1 - g))})`} />
        {h > 0.6 && Array.from({ length: 7 }, (_, i) => <polyline key={i} points={`${640 + i * 40},${560} l12,20 l-10,18`} fill="none" stroke="#3a3632" strokeWidth={3} opacity={e(t, k, k + 1)} />)}
        <g transform="translate(1340,420)"><circle r={170} fill="rgba(24,22,20,.86)" stroke={C.honey} strokeWidth={6} /><path d={`M0,0 L0,-150 A150,150 0 ${h > 0.5 ? 1 : 0} 1 ${150 * Math.sin(h * Math.PI * 2)},${-150 * Math.cos(h * Math.PI * 2)} Z`} fill={C.honey} opacity={0.35} /><line x1={0} y1={0} x2={120 * Math.sin(h * Math.PI * 2)} y2={-120 * Math.cos(h * Math.PI * 2)} stroke={C.ink} strokeWidth={8} strokeLinecap="round" /></g>
        <g opacity={e(t, ag, ag + 0.4)}><path d="M760,260 l-30,80 q30,30 60,0 Z" fill={C.agua} /><Cross t={t} at={ag + 0.6} x={900} y={300} r={34} /></g>
      </Svg>
      <Lbl t={t} at={a + 1} text="una a dos horas" x={1340} y={680} size={46} col={C.honey} />
      <Lbl t={t} at={ag + 1} text="no se revive" x={1340} y={800} size={50} col={C.red} />
    </>
  );
};

// 43 · la linterna de metal de Don Tito: de pilas grandes, apoyada contra la pared; la pared perfecta se llena de sombras
export const LinternaDeMetal: React.FC<FxP> = ({ t, a, m }) => {
  const k = mk(m, "prende", a + 2), on = e(t, k, k + 0.8);
  return (
    <>
      <Svg>
        <rect x={500} y={160} width={1100} height={760} fill={C.end} />
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M500,${220 + i * 100} Q${800 + 120 * hash(i, 1)},${190 + i * 100 + 40 * hash(i, 2)} 1600,${230 + i * 100}`} stroke="rgba(30,24,16,.55)" strokeWidth={26} fill="none" opacity={on} />)}
        <path d="M470,520 L1600,180 L1600,860 Z" fill={C.luz} opacity={0.18 * on} />
        <g transform="translate(400,540) rotate(0)"><rect x={-150} y={-46} width={220} height={92} rx={16} fill="#6e7276" stroke="#3f4245" strokeWidth={4} /><path d="M70,-60 L130,-80 L130,80 L70,60 Z" fill="#8a8f94" stroke="#3f4245" strokeWidth={4} /><circle cx={130} cy={0} r={52} fill={on > 0.1 ? "#fff4cf" : "#5f6366"} /><rect x={-100} y={-70} width={60} height={30} rx={6} fill="#3f4245" /></g>
      </Svg>
      <Lbl t={t} at={a + 0.6} text="de pilas grandes" x={330} y={650} size={42} col={C.dim} />
      <Lbl t={t} at={k + 1} text="olas, pozos, lomitas" x={1050} y={980} size={50} col={C.luz} />
    </>
  );
};
export const _k2 = [Draw, Pop, Big, Tick];
