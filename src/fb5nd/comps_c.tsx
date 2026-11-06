// fb5nd · componentes 32-46 (sellador, la cuenta, herramientas, clima, cuidado, errores, Don Aldo, Facu, dudas, rutina,
// repaso). Cada uno f(t), sigue la voz por sus marcas.
import React from "react";
import { C, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Cross, FxP, Svg, Tick, num } from "./kit";
import { Balde, MAD, quad, Copo, Sol } from "./piso";
import { Colador, Cuarto, CONTRA, Fratas, LlanaAcero, MangueraU, Piso, Suela } from "./cem";

// 32 · corte del poro: piso abierto donde el café y el aceite se meten y manchan; el sellador cierra el poro con una
// película y la gota queda arriba; si se sella húmedo, la película se pone blanca y se levanta
export const PoroAbiertoPoroCerrado: React.FC<FxP> = ({ t, m }) => {
  const caf = e(t, m.cafe, m.cafe + 2), ace = e(t, m.ace, m.ace + 2), cie = e(t, m.cie, m.cie + 2), hum = e(t, m.hum, m.hum + 2);
  const Lado: React.FC<{ x: number; sell: number }> = ({ x, sell }) => (
    <g transform={`translate(${x},620)`}>
      <rect x={-330} y={0} width={660} height={300} fill="#a9a295" />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-300 + i * 55},0 q8,40 -4,${80 + 40 * hash(i, 2)}`} stroke="#3a342c" strokeWidth={10} fill="none" />)}
      {sell < 0.5 && Array.from({ length: 12 }, (_, i) => <path key={"c" + i} d={`M${-300 + i * 55},0 q8,40 -4,${(80 + 40 * hash(i, 2)) * (i < 6 ? caf : ace)}`} stroke={i < 6 ? "#5a3418" : "#c9a33a"} strokeWidth={10} fill="none" />)}
      {sell > 0.02 && <rect x={-330} y={-10} width={660 * sell} height={14} rx={6} fill={hum > 0.5 && x > 960 ? "#f4f1e8" : "rgba(214,240,255,.7)"} transform={hum > 0.5 && x > 960 ? `rotate(${-4 * hum}) translate(0,${-20 * hum})` : undefined} />}
      {sell > 0.5 && <ellipse cx={-120} cy={-34} rx={60} ry={30} fill="#5a3418" opacity={caf} />}
      {sell > 0.5 && <ellipse cx={140} cy={-30} rx={54} ry={26} fill="#c9a33a" opacity={ace} />}
      {sell < 0.5 && <ellipse cx={-120} cy={-8} rx={60} ry={10} fill="#5a3418" opacity={caf * 0.8} />}
    </g>
  );
  return (
    <>
      <Svg>
        <Lado x={560} sell={0} />
        <Lado x={1360} sell={cie} />
      </Svg>
      <Lbl t={t} at={m.cla} text="poro abierto" x={560} y={420} col={C.red} size={64} />
      <Lbl t={t} at={m.cie} out={m.hum} text="poro cerrado" x={1360} y={420} col={C.ok} size={64} />
      <Lbl t={t} at={m.hum} text="sellado húmedo: se pone blanco" x={1360} y={420} col={C.red} size={46} />
    </>
  );
};

// 33 · dos latas lado a lado (acrílico al agua / poliuretánico) con barras de olor, duración y precio que crecen; el
// rodillo de pelo corto pasa tres manos finitas; fuego y calefón tachados; la ventana se abre
export const AcrilicoOPoliuretano: React.FC<FxP> = ({ t, m }) => {
  const L: [string, string, number, number[]][] = [["ACRÍLICO", "#3a7bd5", m.acr, [0.3, 0.5, 0.35]], ["POLIURETÁNICO", "#c9781f", m.pol, [0.9, 0.95, 0.8]]];
  const fin = e(t, m.fin, m.fin + 3), ven = e(t, m.ven, m.ven + 1.6);
  return (
    <>
      <Svg>
        {t < m.rod && L.map(([n, col, at, v], i) => t > at && <g key={n} transform={`translate(${560 + i * 800},${lerp(1200, 560, spr(t, at, 0.8))})`}>
          <rect x={-120} y={-160} width={240} height={300} rx={20} fill="#d0d5da" stroke="#6f7780" strokeWidth={5} /><rect x={-120} y={-80} width={240} height={110} fill={col} />
          <text y={-12} textAnchor="middle" fontSize={34} fontWeight={800} fill="#fff" fontFamily="Barlow Condensed">{n}</text>
          {["olor", "dura", "precio"].map((w, j) => <g key={w} transform={`translate(160,${-120 + j * 90})`}><rect x={0} y={-16} width={220} height={32} rx={16} fill="rgba(255,255,255,.12)" /><rect x={0} y={-16} width={220 * v[j] * e(t, at + 0.5 + j * 0.4, at + 1.2 + j * 0.4)} height={32} rx={16} fill={col} /><text x={0} y={-26} fontSize={26} fontWeight={700} fill={C.dim} fontFamily="Barlow">{w}</text></g>)}
        </g>)}
        {t > m.rod && t < m.fue && <g>
          <Piso cx={960} y={420} w={1500} d={500} brillo={0.3 + 0.2 * fin} t={t}>{(f) => <>{[0, 1, 2].map((i) => <polygon key={i} points={quad(f, 0, 0, cl(fin * 3 - i), 1)} fill="rgba(214,240,255,.12)" />)}</>}</Piso>
          <g transform={`translate(${lerp(300, 1600, (fin * 3) % 1)},640)`}><rect x={-10} y={-300} width={20} height={260} fill="#555" /><rect x={-120} y={-40} width={240} height={70} rx={34} fill="#e7e2d8" /></g>
          {[0, 1, 2].map((i) => <circle key={i} cx={1660 + 0} cy={200 + i * 90} r={30} fill={fin * 3 > i + 0.9 ? C.ok : "rgba(255,236,200,.2)"} />)}
        </g>}
        {t > m.fue && <>
          <g transform="translate(560,560)"><path d="M0,80 Q-70,0 -20,-80 Q0,-30 20,-60 Q80,0 0,80 Z" fill="#ff8a3a" /><path d="M0,70 Q-30,20 0,-20 Q30,20 0,70 Z" fill={C.sun} /></g>
          <g transform="translate(960,540)"><rect x={-90} y={-150} width={180} height={300} rx={20} fill="#e9e1cf" stroke="#999" strokeWidth={5} /><circle cx={0} cy={100} r={22} fill="#ff8a3a" opacity={t > m.cal ? 1 : 0} /></g>
          <g transform="translate(1440,520)" opacity={e(t, m.ven - 0.5, m.ven)}><rect x={-160} y={-130} width={320} height={260} fill="#dfeeff" stroke="#f2ede3" strokeWidth={14} /><rect x={-160} y={-130} width={160 * (1 - ven)} height={260} fill="#9fb3c4" stroke="#f2ede3" strokeWidth={10} />{[0, 1, 2].map((i) => <path key={i} d={`M${-140 + ((t * 200 + i * 90) % 280)},${-60 + i * 50} q30,-14 60,0`} stroke="#fff" strokeWidth={5} fill="none" opacity={ven} />)}</g>
        </>}
      </Svg>
      {t > m.fue && <Cross t={t} at={m.fue + 0.5} x={560} y={560} r={90} />}
      {t > m.cal && <Cross t={t} at={m.cal + 0.5} x={960} y={540} r={90} />}
      <Lbl t={t} at={m.fin} out={m.fue} text="3 manos finitas" x={960} y={1010} col={C.ok} size={60} />
      <Lbl t={t} at={m.ven} text="ventilá bien" x={1440} y={860} col={C.water} size={56} />
    </>
  );
};

// 34 · el cuarto de 12 m² en planta (3 × 4) y una columna de materiales que se apila al nombrarse: 300 litros, 5½ bolsas,
// ⅓ m³ de arena, cemento extra, cola, sellador
export const CuartoDeDoceMetros: React.FC<FxP> = ({ t, a, m }) => {
  const R: [string, string, number][] = [["300 L de mezcla", C.cream, m.lit], ["5 ½ bolsas de cemento", C.cream, m.bol], ["⅓ m³ de arena", "#c6a675", m.are], ["+ cemento: puente y polvo", C.cream, m.pue], ["1 L de cola vinílica", "#a9d4ff", m.cola], ["sellador acrílico", C.honey, m.sel]];
  const pl = spr(t, a + 0.2, 0.8);
  return (
    <>
      <Svg>
        <g transform={`translate(560,560) scale(${pl}) rotate(${-4 + 4 * pl})`}>
          <rect x={-300} y={-400} width={600} height={800} fill="#a49c8e" stroke="#e9e1cf" strokeWidth={18} />
          {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-300 + (i % 3) * 200} y={-400 + Math.floor(i / 3) * 200} width={200} height={200} fill="none" stroke="rgba(0,0,0,.15)" strokeWidth={2} />)}
          <text x={0} y={470} textAnchor="middle" fontSize={50} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">3 m × 4 m = 12 m²</text>
        </g>
        {R.map(([w, col, at], i) => t > at && <g key={w} transform={`translate(${1000 + (1 - spr(t, at)) * 200},${200 + i * 130})`} opacity={cl((t - at) * 5)}>
          <rect x={0} y={-48} width={820} height={96} rx={18} fill="rgba(30,20,10,.85)" stroke="rgba(255,236,200,.35)" strokeWidth={3} />
          <circle cx={56} cy={0} r={28} fill={col} />
          <text x={110} y={16} fontSize={46} fontWeight={800} fill={C.ink} fontFamily="Barlow Condensed">{w.toUpperCase()}</text>
        </g>)}
      </Svg>
    </>
  );
};

// 35 · el total: una alcancía con US$ 60 que baja a US$ 5/m²; tres pilas de billetes comparan: alisado (5) < cerámica (×3)
// < resina (×10) que crece hasta salir de cuadro
export const SesentaContraTodo: React.FC<FxP> = ({ t, m }) => {
  const B: [string, number, string, number][] = [["ALISADO", 1, C.ok, m.cin], ["CERÁMICA", 3, C.honey, m.cer], ["RESINA", 10, C.red, m.res]];
  return (
    <>
      <Svg>
        <g transform={`translate(400,${lerp(1200, 520, spr(t, m.ses, 0.8))})`}>
          <rect x={-200} y={-140} width={400} height={280} rx={30} fill="rgba(30,20,10,.88)" stroke={C.honey} strokeWidth={6} />
          <text y={-30} textAnchor="middle" fontSize={110} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">{t < m.met ? `US$ ${num(t, m.ses, m.ses + 1, 0, 60)}` : "US$ 60"}</text>
          <text y={70} textAnchor="middle" fontSize={56} fontWeight={800} fill={C.ok} fontFamily="Barlow Condensed" opacity={e(t, m.met, m.met + 0.6)}>= US$ 5 / m²</text>
        </g>
        {B.map(([n, k, col, at], i) => { const h = 60 * k * e(t, at, at + 1.4); return t > at && <g key={n} transform={`translate(${900 + i * 330},960)`}>
          {Array.from({ length: Math.ceil(h / 22) }, (_, j) => <rect key={j} x={-110} y={-22 - j * 22} width={220} height={18} rx={4} fill="#5e9a4a" stroke="#2f5a26" strokeWidth={2} />)}
          <text y={60} textAnchor="middle" fontSize={44} fontWeight={800} fill={col} fontFamily="Barlow Condensed">{n}</text>
          <text y={-h - 40} textAnchor="middle" fontSize={50} fontWeight={800} fill={col} fontFamily="Barlow Condensed">{k === 1 ? "×1" : `×${k}`}</text>
        </g>; })}
      </Svg>
    </>
  );
};

// 36 · un tablero de herramientas en la pared: se cuelga cada herramienta al nombrarla (regla, llana de madera, llana de
// acero, manguera, balde + colador); al final un ticket que las compara con una cena afuera
export const SeisHerramientas: React.FC<FxP> = ({ t, m }) => {
  const H: [number, React.ReactNode][] = [
    [m.reg, <rect x={-300} y={-14} width={600} height={28} rx={4} fill="#c8ccd0" stroke="#7d848c" strokeWidth={3} />],
    [m.mad, <Fratas x={0} y={0} s={0.8} />],
    [m.ace, <LlanaAcero x={0} y={0} s={0.8} />],
    [m.man, <path d="M-200,-40 Q-200,80 0,80 Q200,80 200,-40" stroke="rgba(214,240,255,.6)" strokeWidth={22} fill="none" />],
    [m.bal, <><Balde x={-120} y={30} s={0.7} lvl={0} /><Colador x={130} y={0} t={0} k={0} s={0.6} /></>],
  ];
  return (
    <>
      <Svg>
        <rect x={160} y={120} width={1180} height={840} rx={20} fill="#6d4a2b" />
        {Array.from({ length: 140 }, (_, i) => <circle key={i} cx={200 + (i % 14) * 80} cy={160 + Math.floor(i / 14) * 80} r={6} fill="#4a321c" />)}
        {H.map(([at, node], i) => t > at - 0.2 && <g key={i} transform={`translate(${i < 3 ? 750 : i === 3 ? 520 : 1000},${i < 3 ? 240 + i * 180 : 800}) translate(0,${(1 - spr(t, at - 0.2, 0.9)) * -300})`}>{node}</g>)}
        {t > m.cena && <g transform={`translate(1600,${lerp(1300, 560, spr(t, m.cena, 0.8))}) rotate(4)`}>
          <path d="M-150,-260 L150,-260 L150,260 L120,240 L90,260 L60,240 L30,260 L0,240 L-30,260 L-60,240 L-90,260 L-120,240 L-150,260 Z" fill="#f4f1e8" />
          <text y={-180} textAnchor="middle" fontSize={40} fontWeight={800} fill="#2b1a0c" fontFamily="Barlow Condensed">HERRAMIENTAS</text>
          <line x1={-120} y1={-150} x2={120} y2={-150} stroke="#999" strokeWidth={3} strokeDasharray="8 6" />
          <text y={-40} textAnchor="middle" fontSize={44} fontWeight={800} fill="#2b1a0c" fontFamily="Barlow Condensed">= UNA CENA</text>
          <text y={20} textAnchor="middle" fontSize={44} fontWeight={800} fill="#2b1a0c" fontFamily="Barlow Condensed">AFUERA</text>
          <text y={140} textAnchor="middle" fontSize={36} fontWeight={700} fill={C.amber} fontFamily="Barlow">para siempre</text>
        </g>}
      </Svg>
    </>
  );
};

// 37 · tres climas en un dial que gira: calor (30°, reloj de 40 min, costra → empezar temprano), frío (<10°, helada que
// cubre con nylon y frazada), lluvia (techo, doble de tiempo); al final el pie que manda
export const TresClimas: React.FC<FxP> = ({ t, m }) => {
  const fase = t < m.frio ? 0 : t < m.llu ? 1 : 2, rot = -120 * (e(t, m.frio - 1, m.frio) + e(t, m.llu - 1, m.llu));
  const pie = e(t, m.man, m.man + 1.5);
  return (
    <>
      <Svg>
        <g transform={`translate(560,560) rotate(${rot})`}>
          <circle r={320} fill="rgba(30,20,10,.85)" stroke={C.cream} strokeWidth={6} />
          {[0, 1, 2].map((i) => <g key={i} transform={`rotate(${i * 120}) translate(0,-210) rotate(${-i * 120 - rot})`}>
            {i === 0 ? <Sol x={0} y={0} r={60} rot={t * 20} /> : i === 1 ? <Copo x={0} y={0} r={60} rot={t * 15} /> : <g>{Array.from({ length: 10 }, (_, j) => { const ph = (t * 1.5 + hash(j, 3)) % 1; return <line key={j} x1={-50 + j * 11} y1={-50 + ph * 100} x2={-54 + j * 11} y2={-34 + ph * 100} stroke="#a9dcff" strokeWidth={5} />; })}</g>}
          </g>)}
        </g>
        <path d="M560,190 l-24,-40 h48 z" fill={C.honey} />
        <g transform="translate(1340,520)">
          {fase === 0 && <g>
            <text y={-200} textAnchor="middle" fontSize={120} fontWeight={800} fill={C.red} fontFamily="Barlow Condensed">30°</text>
            <circle cx={0} cy={0} r={110} fill="none" stroke={C.cream} strokeWidth={8} /><path d={`M0,0 L0,-110 A110,110 0 ${e(t, m.cua, m.cua + 3) > 0.5 ? 1 : 0} 1 ${110 * Math.sin(e(t, m.cua, m.cua + 3) * 4.2)},${-110 * Math.cos(e(t, m.cua, m.cua + 3) * 4.2)} Z`} fill={C.red} opacity={0.6} />
            <text y={190} textAnchor="middle" fontSize={56} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed" opacity={e(t, m.cua, m.cua + 0.6)}>40 MIN</text>
            {t > m.tem && <text y={280} textAnchor="middle" fontSize={50} fontWeight={800} fill={C.ok} fontFamily="Barlow Condensed">BIEN TEMPRANO</text>}
          </g>}
          {fase === 1 && <g>
            <text y={-200} textAnchor="middle" fontSize={120} fontWeight={800} fill={C.water} fontFamily="Barlow Condensed">&lt; 10°</text>
            <rect x={-260} y={-60} width={520} height={160} rx={10} fill="#a49c8e" />
            {t > m.hie && <><rect x={-270} y={-80 + 60 * (1 - e(t, m.hie + 1, m.hie + 2.4))} width={540} height={40} rx={8} fill="rgba(28,32,36,.8)" /><rect x={-270} y={-110 + 60 * (1 - e(t, m.hie + 2, m.hie + 3.4))} width={540} height={36} rx={14} fill="#a33a4a" /></>}
            {Array.from({ length: 12 }, (_, i) => <Copo key={i} x={-240 + i * 44} y={-150 + ((t * 40 + i * 30) % 120)} r={10} rot={t * 30} />)}
          </g>}
          {fase === 2 && <g>
            <path d="M-300,-160 L0,-260 L300,-160 Z" fill="#6d4a2b" />
            <rect x={-260} y={-60} width={520} height={160} rx={10} fill="#4f4a42" />
            <text y={220} textAnchor="middle" fontSize={64} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed" opacity={e(t, m.dob, m.dob + 0.6)}>EL DOBLE DE TIEMPO</text>
          </g>}
        </g>
        {pie > 0.02 && <g transform={`translate(960,${lerp(1300, 820, pie)})`}><Suela x={0} y={0} s={1.3} col="#e7e2d8" /></g>}
      </Svg>
      <Lbl t={t} at={m.man} text="manda la prueba del pie" x={960} y={1010} col={C.ok} size={58} />
    </>
  );
};

// 38 · limpieza: el trapo con unas gotas de detergente neutro (✓); lavandina pura y ácido tachados (el ácido come una
// mordida del borde); la pata de la silla con fieltro no raya y la de metal deja dos rayas
export const TrapoYFieltro: React.FC<FxP> = ({ t, m }) => {
  const ac = e(t, m.aci, m.aci + 2), ray = e(t, m.ray, m.ray + 1.5);
  return (
    <>
      <Svg>
        <g transform={`translate(400,${lerp(1200, 520, spr(t, m.det - 0.3, 0.8))})`}>
          <rect x={-60} y={-150} width={120} height={240} rx={30} fill="#7ad0a3" /><rect x={-24} y={-200} width={48} height={60} fill="#ddd" />
          <text y={0} textAnchor="middle" fontSize={30} fontWeight={800} fill="#1e4a32" fontFamily="Barlow Condensed">NEUTRO</text>
        </g>
        {t > m.det && <Tick t={t} at={m.det + 0.4} x={400} y={300} r={44} />}
        {[["LAVANDINA", "#f4f1e8", m.lav, 760], ["ÁCIDO", "#ffd84a", m.aci, 1060]].map(([n, col, at, x]) => t > (at as number) && <g key={n as string} transform={`translate(${x},${lerp(1200, 520, spr(t, at as number, 0.8))})`}>
          <rect x={-60} y={-150} width={120} height={240} rx={20} fill={col as string} stroke="#999" strokeWidth={4} /><text y={0} textAnchor="middle" fontSize={26} fontWeight={800} fill="#333" fontFamily="Barlow Condensed">{n as string}</text>
        </g>)}
        {t > m.lav && <Cross t={t} at={m.lav + 0.5} x={760} y={300} r={44} />}
        {t > m.aci && <Cross t={t} at={m.aci + 0.5} x={1060} y={300} r={44} />}
        <rect x={260} y={820} width={900} height={120} fill="#a49c8e" />
        {ac > 0.02 && <path d={`M960,820 q50,${60 * ac} 140,0`} fill={C.night} />}
        <g transform="translate(1500,600)">
          <rect x={-240} y={220} width={480} height={160} fill="#c9c4ba" />
          {t > m.fie && <><rect x={-140} y={-200} width={30} height={420} fill={MAD} /><rect x={-150} y={212} width={50} height={14} rx={4} fill="#5a8a4a" /></>}
          {t > m.ray && <><rect x={110} y={-200} width={20} height={420} fill="#888" /><line x1={100} y1={250} x2={100 - 200 * ray} y2={250} stroke="#5a544a" strokeWidth={4} /><line x1={140} y1={262} x2={140 - 200 * ray} y2={262} stroke="#5a544a" strokeWidth={4} /></>}
        </g>
      </Svg>
      <Lbl t={t} at={m.fie} text="fieltro" x={1360} y={1010} col={C.ok} size={52} />
      <Lbl t={t} at={m.ray} text="dos rayas" x={1640} y={1010} col={C.red} size={52} />
    </>
  );
};

// 39 · el test de la gota: sobre el sellado nuevo la gota queda redonda; dos o tres años después se aplana y entra; una
// mano finita de rodillo la vuelve a parar; fisura como un pelo (normal) vs una de más de 1 mm (a mirar con cuidado)
export const LaGotaQueAvisa: React.FC<FxP> = ({ t, m }) => {
  const vie = e(t, m.dos, m.gota + 1.5), man = e(t, m.mano, m.mano + 2), sq = cl(vie - man);
  return (
    <>
      <Svg>
        <rect x={260} y={560} width={1400} height={160} fill="#a9a295" />
        <rect x={260} y={548} width={1400} height={12} fill="rgba(214,240,255,.6)" opacity={1 - sq * 0.9} />
        {[560, 960, 1360].map((x, i) => <g key={x} transform={`translate(${x},${548})`}>
          <ellipse cx={0} cy={-40 + 34 * sq} rx={50 + 40 * sq} ry={42 - 34 * sq} fill={C.water} opacity={0.85} />
          <ellipse cx={-14} cy={-58 + 34 * sq} rx={12} ry={8} fill="#fff" opacity={0.7 * (1 - sq)} />
          {sq > 0.5 && <path d={`M-20,12 q10,30 0,${50 * sq}`} stroke={C.water} strokeWidth={8} fill="none" />}
        </g>)}
        {t > m.dos && t < m.mano + 2 && <g transform="translate(1700,250)"><rect x={-80} y={-60} width={160} height={120} rx={10} fill="rgba(30,20,10,.85)" stroke={C.cream} strokeWidth={4} /><text y={16} textAnchor="middle" fontSize={48} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">2-3 AÑOS</text></g>}
        {t > m.mano && t < m.pelo && <g transform={`translate(${lerp(300, 1600, man)},460)`}><rect x={-10} y={-260} width={20} height={240} fill="#555" /><rect x={-110} y={-30} width={220} height={60} rx={30} fill="#e7e2d8" /></g>}
        {t > m.pelo && <g>
          <path d="M360,880 l60,6 l50,-8 l70,10 l60,-6" stroke="#3a342c" strokeWidth={2} fill="none" />
          <text x={500} y={960} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.ok} fontFamily="Barlow Condensed">COMO UN PELO: NORMAL</text>
          {t > m.mil && <><path d="M1260,880 l60,6 l50,-8 l70,10 l60,-6" stroke="#3a342c" strokeWidth={12} fill="none" /><text x={1400} y={960} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.red} fontFamily="Barlow Condensed">&gt; 1 mm: OJO</text></>}
        </g>}
      </Svg>
      <Lbl t={t} at={m.gota} out={m.mano} text="ya no forma gotitas" x={960} y={300} col={C.red} size={60} />
      <Lbl t={t} at={m.mano} out={m.pelo} text="una mano finita" x={960} y={300} col={C.ok} size={60} />
    </>
  );
};

// 40 · cinco tarjetas de piso arruinado, cada una cae y se rompe a su manera (cáscaras, fisuras de borde, telaraña,
// surcos/escamas, polvo); al final quedan las cinco y la última late
export const CincoPisosArruinados: React.FC<FxP> = ({ t, m }) => {
  const E: [string, number][] = [["lechada sola", m.e1], ["contrapiso seco", m.e2], ["mezcla aguada", m.e3], ["fuera de tiempo", m.e4], ["no curar", m.e5]];
  return (
    <>
      <Svg>
        {E.map(([n, at], i) => { const p = spr(t, at, 0.8), dam = e(t, at + 0.8, at + 2.6), x = 260 + i * 350; const beat = i === 4 ? 1 + 0.04 * Math.sin(t * 6) * e(t, at + 3, at + 4) : 1; return t > at && <g key={n} transform={`translate(${x},${lerp(-300, 540, p)}) scale(${beat})`}>
          <rect x={-150} y={-180} width={300} height={360} rx={18} fill="#a49c8e" stroke={C.cream} strokeWidth={4} />
          <text y={-210} textAnchor="middle" fontSize={34} fontWeight={800} fill={C.red} fontFamily="Barlow Condensed">{`ERROR ${i + 1}`}</text>
          {i === 0 && Array.from({ length: 6 }, (_, j) => <polygon key={j} transform={`translate(${-90 + (j % 3) * 90},${-100 + Math.floor(j / 3) * 120 - dam * 40 * hash(j, 1)}) rotate(${dam * 30 * (hash(j, 2) - 0.5)})`} points="-36,-10 20,-30 40,10 -10,30" fill="#d0c9bb" stroke="#6e6658" strokeWidth={3} />)}
          {i === 1 && <path d="M-150,-120 L-80,-100 L-60,-40 M150,90 L80,110 L70,160 M-150,100 L-90,80" stroke="#3a342c" strokeWidth={5} fill="none" pathLength={1} strokeDasharray={`${dam} 1`} />}
          {i === 2 && Array.from({ length: 6 }, (_, j) => <path key={j} d={`M0,0 L${Math.cos(j) * 140},${Math.sin(j * 1.4) * 170}`} stroke="#3a342c" strokeWidth={4} pathLength={1} strokeDasharray={`${dam} 1`} />)}
          {i === 3 && Array.from({ length: 5 }, (_, j) => <path key={j} d={`M-130,${-120 + j * 60} q65,-20 130,0 t130,0`} stroke="#3a342c" strokeWidth={9} fill="none" pathLength={1} strokeDasharray={`${dam} 1`} />)}
          {i === 4 && Array.from({ length: 30 }, (_, j) => { const ph = (t * 0.4 + hash(j, 3)) % 1; return <circle key={j} cx={-130 + hash(j, 4) * 260} cy={150 - ph * 300} r={4} fill="#e6dccb" opacity={dam * (1 - ph)} />; })}
          <text y={240} textAnchor="middle" fontSize={34} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">{n.toUpperCase()}</text>
        </g>; })}
      </Svg>
      <Lbl t={t} at={m.e5 + 3} text="el más común" x={1660} y={140} col={C.red} size={52} />
    </>
  );
};

// 41 · el taller de Don Aldo en Morón: portón de chapa que se abre, virutas de hierro y aceite que caen en el piso viejo;
// la paciencia como un reloj de arena; la noche hasta las 2; el contador de años de 0 a 40 y la lupa: ni una fisura
export const TallerDeMoron: React.FC<FxP> = ({ t, m }) => {
  const por = e(t, m.por, m.por + 2), vir = e(t, m.vir, m.vir + 4), pac = e(t, m.pac, m.pac + 6), dos = e(t, m.dos, m.dos + 3), cua = e(t, m.cua, m.cua + 3);
  const nuevo = t > m.pac;
  return (
    <>
      <Svg>
        <rect x={0} y={0} width={1920} height={1080} fill="#0b1022" opacity={Math.sin(dos * Math.PI) * 0.5} />
        <rect x={360} y={120} width={1200} height={460} fill="#4a4f55" />
        {Array.from({ length: 12 }, (_, i) => <rect key={i} x={360 + i * 100} y={120 - por * 380} width={96} height={460} fill="#7d858c" stroke="#5d646b" strokeWidth={3} />)}
        <rect x={360} y={120 - por * 380} width={1200} height={20} fill="#5d646b" />
        <Piso cx={960} y={580} w={1500} d={400} rug={nuevo ? 0 : 1} brillo={nuevo ? 0.6 * cl((t - m.pac) / 6) : 0} t={t}>
          {(f) => <>
            {!nuevo && vir > 0.02 && Array.from({ length: 50 }, (_, i) => { const [x, y] = f(hash(i, 3), hash(i, 4)); return <path key={i} d={`M${x},${y} q8,-10 16,0 q8,10 16,0`} stroke="#9aa2a9" strokeWidth={3} fill="none" opacity={cl(vir * 2 - hash(i, 5))} />; })}
            {!nuevo && vir > 0.4 && [0.3, 0.6, 0.8].map((u, i) => <ellipse key={i} cx={f(u, 0.5)[0]} cy={f(u, 0.5)[1]} rx={70} ry={26} fill="#1d1a16" opacity={0.6} />)}
          </>}
        </Piso>
        {pac > 0.02 && pac < 0.99 && <g transform="translate(1700,300)"><path d="M-50,-80 L50,-80 L8,0 L50,80 L-50,80 L-8,0 Z" fill="rgba(214,240,255,.18)" stroke={C.cream} strokeWidth={6} /><path d={`M${-36 * (1 - pac)},-66 L${36 * (1 - pac)},-66 L0,-6 Z`} fill={C.sun} /><path d={`M-36,70 L36,70 L${20 * pac},${70 - 56 * pac} L${-20 * pac},${70 - 56 * pac} Z`} fill={C.sun} /></g>}
        {t > m.dos && t < m.cua && <g transform="translate(260,240)"><circle r={80} fill="rgba(30,20,10,.85)" stroke={C.cream} strokeWidth={5} /><line x1={0} y1={0} x2={0} y2={-60} stroke={C.ink} strokeWidth={8} transform={`rotate(${60})`} /><line x1={0} y1={0} x2={0} y2={-40} stroke={C.ink} strokeWidth={10} transform={`rotate(${30 + dos * 30})`} /><text y={130} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">2 AM</text></g>}
        {t > m.cua && <g transform="translate(960,280)"><rect x={-220} y={-90} width={440} height={180} rx={20} fill="rgba(30,20,10,.88)" stroke={C.honey} strokeWidth={5} /><text y={40} textAnchor="middle" fontSize={120} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">{`${num(t, m.cua, m.cua + 2.5, 0, 40)} AÑOS`}</text></g>}
        {cua > 0.4 && <g transform={`translate(${lerp(600, 1300, cua)},760)`}><circle r={80} fill="rgba(220,240,255,.18)" stroke="#e9e1cf" strokeWidth={10} /><line x1={56} y1={56} x2={120} y2={120} stroke={MAD} strokeWidth={22} strokeLinecap="round" /></g>}
      </Svg>
      <Lbl t={t} at={m.por} out={m.vir} text="Morón, taller de herrería" x={960} y={1010} col={C.cream} size={56} />
      <Lbl t={t} at={m.pac} out={m.dos} text="le puse paciencia" x={960} y={1010} col={C.honey} size={60} />
      <Lbl t={t} at={m.cua} text="ni una fisura" x={960} y={1010} col={C.ok} size={66} />
    </>
  );
};

// 42 · el cuarto de Facu en planta, con el contrapiso pelado; un sábado en el calendario; tres paños se van llenando y
// cada uno muestra su nota (marcas → mejor → mejor que el mío); dos años después, el cuarto con el piso brillante y sin polvo
export const TresPanosDeFacu: React.FC<FxP> = ({ t, m }) => {
  const P3 = [m.p1, m.p2 + 0.3, m.p3 + 0.8], dos = e(t, m.dos, m.dos + 2.5);
  const nota = ["con marcas", "ya mejor", "mejor que el mío"];
  return (
    <>
      <Svg>
        {dos < 0.98 && <g opacity={1 - dos}>
          <rect x={360} y={200} width={1200} height={680} fill={CONTRA} stroke="#e9e1cf" strokeWidth={20} />
          {Array.from({ length: 90 }, (_, i) => <circle key={i} cx={380 + hash(i, 2) * 1160} cy={220 + hash(i, 3) * 640} r={5} fill="#a3927a" />)}
          {P3.map((at, i) => { const k = e(t, at, at + 1.6); return <g key={i}>
            <rect x={380 + i * 390} y={220} width={380} height={640 * k} fill={i === 0 ? "#958d80" : i === 1 ? "#a49c8e" : "#b3ab9e"} />
            {i === 0 && k > 0.5 && Array.from({ length: 5 }, (_, j) => <path key={j} d={`M${420 + j * 60},${400 + j * 70} q30,-14 60,0`} stroke="#6f685d" strokeWidth={5} fill="none" />)}
            {i === 2 && k > 0.6 && <polygon points={`${480 + i * 390},300 ${620 + i * 390},300 ${600 + i * 390},500 ${500 + i * 390},500`} fill="#eaf3ff" opacity={0.35} />}
            {k > 0.5 && <text x={570 + i * 390} y={920} textAnchor="middle" fontSize={40} fontWeight={800} fill={i === 2 ? C.ok : C.cream} fontFamily="Barlow Condensed">{nota[i].toUpperCase()}</text>}
          </g>; })}
          {t > m.sab && <g transform={`translate(1700,240) scale(${spr(t, m.sab)})`}><rect x={-100} y={-90} width={200} height={180} rx={14} fill="#f2e3bf" /><rect x={-100} y={-90} width={200} height={50} rx={14} fill={C.red} /><text y={40} textAnchor="middle" fontSize={48} fontWeight={800} fill="#2b1a0c" fontFamily="Barlow Condensed">SÁB</text></g>}
        </g>}
        {dos > 0.02 && <g opacity={dos}>
          <Cuarto luz={1} />
          <Piso cx={960} y={450} w={1500} d={520} brillo={0.85} t={t} />
          <text x={960} y={240} textAnchor="middle" fontSize={64} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">+2 AÑOS</text>
        </g>}
      </Svg>
      <Lbl t={t} at={m.pie} out={m.sab} text="el contrapiso pelado" x={960} y={130} col={C.cream} size={58} />
      <Lbl t={t} at={m.dos + 1} text="ni polvo en los muebles" x={960} y={1020} col={C.ok} size={56} />
    </>
  );
};

// 43 · la libreta de Don Aldo: tres renglones que se escriben solos con su dibujo al lado (manguera, balde con gota
// tachada, nylon que no se levanta)
export const LibretaDeAldo: React.FC<FxP> = ({ t, a, m }) => {
  const R: [string, number][] = [["nunca sin la manguera", m.n1], ["nunca agua a una mezcla vieja", m.n2], ["nunca destapar antes de 7 días", m.n3]];
  const ab = spr(t, a, 0.7);
  return (
    <>
      <Svg>
        <g transform={`translate(960,560) rotate(${-3 + 3 * ab}) scale(${ab})`}>
          <rect x={-700} y={-420} width={1400} height={840} rx={20} fill="#f2e8cf" stroke="#9c7a45" strokeWidth={6} />
          {Array.from({ length: 12 }, (_, i) => <line key={i} x1={-660} y1={-320 + i * 64} x2={660} y2={-320 + i * 64} stroke="#bcd0e0" strokeWidth={2} />)}
          <line x1={-560} y1={-420} x2={-560} y2={420} stroke="#e08a8a" strokeWidth={3} />
          <text x={-520} y={-340} fontSize={52} fontWeight={800} fill="#2b1a0c" fontFamily="Barlow Condensed">DON ALDO · NUNCA</text>
          {R.map(([w, at], i) => { const k = e(t, at, at + 2); return <g key={i} transform={`translate(-520,${-180 + i * 220})`}>
            <text x={0} y={0} fontSize={58} fontWeight={700} fill="#2b3a6a" fontFamily="Barlow" style={{ clipPath: `inset(0 ${100 - k * 100}% 0 0)` }}>{`${i + 1}. ${w}`}</text>
            {k > 0.9 && <g transform="translate(1050,-20)">
              {i === 0 && <MangueraU x0={-60} x1={60} y={40} h0={80} h1={80} lvl={-10} k={1} />}
              {i === 1 && <><Balde x={0} y={20} s={0.5} lvl={0.6} liq="#5f5a52" /><path d="M-60,-60 L60,60 M60,-60 L-60,60" stroke={C.red} strokeWidth={10} /></>}
              {i === 2 && <><rect x={-90} y={-30} width={180} height={60} fill="rgba(28,32,36,.85)" /><text y={80} textAnchor="middle" fontSize={40} fontWeight={800} fill={C.red} fontFamily="Barlow Condensed">7 DÍAS</text></>}
            </g>}
          </g>; })}
        </g>
      </Svg>
    </>
  );
};

// 44 · cuatro dudas, cuatro pisos: sobre cerámica (rayado + puente), con color (ferrite en polvo que tiñe), afuera
// (antideslizante, sin llana de acero), en el baño (sí en el piso, nunca en la ducha)
export const CuatroPisosDistintos: React.FC<FxP> = ({ t, m }) => {
  const D: [string, number][] = [["sobre cerámica", m.cer], ["con color", m.col], ["afuera", m.afu], ["en el baño", m.ban]];
  const cur = t < m.col ? 0 : t < m.afu ? 1 : t < m.ban ? 2 : 3;
  return (
    <>
      <Svg>
        {D.map(([n, at], i) => { const act = i === cur, p = spr(t, at, 0.8), s = act ? 1.2 : 0.5, x = act ? 960 : 300 + i * 440, y = act ? 500 : 900;
          return t > at - 0.2 && <g key={n} transform={`translate(${x},${y}) scale(${s * Math.min(1, p)})`} opacity={act ? 1 : 0.45}>
            <rect x={-260} y={-170} width={520} height={340} rx={20} fill={i === 1 ? "#b06a4a" : i === 2 ? "#9d958a" : "#a49c8e"} stroke={C.cream} strokeWidth={4} />
            {i === 0 && Array.from({ length: 12 }, (_, j) => <rect key={j} x={-250 + (j % 4) * 125} y={-160 + Math.floor(j / 4) * 110} width={120} height={104} fill="#c47a52" opacity={1 - e(t, at + 3, at + 6)} />)}
            {i === 0 && Array.from({ length: 8 }, (_, j) => <line key={j} x1={-240 + j * 60} y1={-160} x2={-200 + j * 60} y2={160} stroke="#5a3a2a" strokeWidth={3} opacity={e(t, at + 1.5, at + 3)} />)}
            {i === 1 && Array.from({ length: 30 }, (_, j) => <circle key={j} cx={-240 + hash(j, 5) * 480} cy={-150 + hash(j, 6) * 300} r={6} fill="#7a2e1a" />)}
            {i === 2 && Array.from({ length: 10 }, (_, j) => <line key={j} x1={-250} y1={-150 + j * 32} x2={250} y2={-150 + j * 32} stroke="#6f685d" strokeWidth={6} />)}
            {i === 3 && <><rect x={60} y={-170} width={200} height={340} fill="#8fc7e8" opacity={0.5} /><path d="M80,-150 L240,150 M240,-150 L80,150" stroke={C.red} strokeWidth={12} opacity={e(t, at + 4, at + 5)} /></>}
            <text y={230} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">{n.toUpperCase()}</text>
          </g>; })}
      </Svg>
      <Lbl t={t} at={m.ban + 4} text="nunca en la ducha" x={960} y={140} col={C.red} size={60} />
    </>
  );
};

// 45 · la rutina como una tira de siete casillas que se encienden con su ícono (lupa, manguera, balde, paños, reloj,
// llana, calendario); un punto avanza por la tira con la voz
export const SieteCasillas: React.FC<FxP> = ({ t, m }) => {
  const R: [string, number][] = [["diagnóstico", m.d1], ["el día anterior", m.ant], ["el día del piso", m.dia], ["esperar", m.esp], ["paño por paño", m.pan], ["a las horas", m.hor], ["una semana más", m.sem]];
  const ord = [...R].sort((x, y) => x[1] - y[1]);
  const idx = ord.reduce((k, [, at], i) => (t >= at ? i : k), 0);
  return (
    <>
      <Svg>
        <line x1={180} y1={540} x2={1740} y2={540} stroke="rgba(255,236,200,.3)" strokeWidth={8} />
        {ord.map(([n, at], i) => { const x = 180 + i * 260, on = t >= at, p = spr(t, at); return <g key={n} transform={`translate(${x},540)`}>
          <circle r={70 + (on ? 10 * Math.min(p, 1) : 0)} fill={on ? (i === idx ? C.honey : "#6e5634") : "rgba(30,20,10,.85)"} stroke={C.cream} strokeWidth={5} />
          <text y={22} textAnchor="middle" fontSize={64} fontWeight={800} fill={on ? "#2b1a0c" : C.dim} fontFamily="Barlow Condensed">{i + 1}</text>
          <text y={i % 2 ? -120 : 150} textAnchor="middle" fontSize={40} fontWeight={800} fill={on ? C.ink : C.dim} fontFamily="Barlow Condensed" opacity={on ? 1 : 0.4}>{n.toUpperCase()}</text>
        </g>; })}
        <circle cx={180 + idx * 260} cy={540} r={18} fill={C.ok} style={{ filter: `drop-shadow(0 0 12px ${C.ok})` }} />
      </Svg>
    </>
  );
};

// 46 · repaso en el cuarto: el piso se arma capa por capa de abajo hacia arriba mientras se nombran los pasos (puente,
// carpeta, pisada, espolvoreado, llana, curado, sellador) y termina con el reflejo de la ventana y US$ 5 el metro
export const RepasoEnElCuarto: React.FC<FxP> = ({ t, m }) => {
  const R: [string, number][] = [["puente con cola", m.pue], ["carpeta 1:3", m.car], ["prueba de la pisada", m.pis], ["espolvoreado finito", m.esp], ["llana de acero", m.lla], ["7 días de curado", m.sie], ["sellador fino", m.sel]];
  const br = e(t, m.lla, m.sel + 2), fin = e(t, m.cin, m.cin + 1);
  return (
    <>
      <Svg>
        <Cuarto x={620} w={1100} luz={0.5 + 0.5 * br} />
        <Piso cx={620} y={450} w={1100} d={480} rug={1 - e(t, m.car, m.car + 1.5)} moj={e(t, m.car, m.car + 1) * (1 - e(t, m.esp, m.esp + 2))} brillo={br} t={t} />
        {t > m.cin && <g transform={`translate(620,820) scale(${spr(t, m.cin)})`}><rect x={-200} y={-60} width={400} height={120} rx={20} fill="rgba(30,20,10,.88)" stroke={C.honey} strokeWidth={5} /><text y={24} textAnchor="middle" fontSize={70} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">US$ 5 / m²</text></g>}
        {R.map(([w, at], i) => t > at && <g key={w} transform={`translate(${1260 + (1 - spr(t, at)) * 200},${180 + i * 110})`} opacity={cl((t - at) * 5) * (1 - fin * 0)}>
          <rect x={0} y={-40} width={580} height={80} rx={16} fill="rgba(30,20,10,.85)" stroke="rgba(255,236,200,.35)" strokeWidth={3} />
          <text x={30} y={16} fontSize={44} fontWeight={800} fill={C.ink} fontFamily="Barlow Condensed">{`✓ ${w.toUpperCase()}`}</text>
        </g>)}
      </Svg>
    </>
  );
};
