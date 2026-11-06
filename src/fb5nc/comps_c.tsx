// fb5nc · componentes 33-49 (la cuenta, el ejemplo de 30 m², herramientas, heladas, fisuras, terminación, errores, casos,
// Don Aldo, preguntas, rutina, el año del patio y las tres pruebas). f(t) con sus marcas (m.*). Sin repetir cl2nov/fb5na/fb5nb.
import React from "react";
import { C, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Cross, FxP, Svg, Tick, shake } from "./kit";
import { Balde, Bolsa, Brillo, Camioneta, Capas, CLARA, Copo, Juntas, Llana, Losa, MAD, Pala, Pison, quad, Regadera, Regla, SC, Sol, Tarja } from "./piso";

const Persona: React.FC<{ x: number; y: number; s?: number; col?: string; ropa?: string }> = ({ x, y, s = 1, col = "#e9d3b0", ropa = "#3b6a8a" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle cy={-170} r={26} fill={col} /><rect x={-24} y={-140} width={48} height={80} rx={18} fill={ropa} />
    <rect x={-22} y={-64} width={18} height={64} rx={8} fill="#2a3640" /><rect x={4} y={-64} width={18} height={64} rx={8} fill="#2a3640" />
  </g>
);

// 33 · la cuenta: el bloque de 1 m² × 10 cm se llena (0,1 m³); 130 litros de tierra en baldes; 16 litros de cemento que
// pesan 22 kg = media bolsa; la bolsa de US$ 9 se corta al medio y el ticket suma 4 a 4,5
export const CuentaLitros: React.FC<FxP> = ({ t, m }) => {
  const blo = e(t, m.m2, m.m2 + 1.5), l130 = e(t, m.l130, m.l130 + 1.6), l16 = e(t, m.l16, m.l16 + 1), kg = e(t, m.kg, m.kg + 1), bol = spr(t, m.bol), med = e(t, m.med, m.med + 1), ent = spr(t, m.ent);
  return (
    <>
      <Svg>
        <g transform="translate(520,560)" opacity={1 - e(t, m.bol - 0.4, m.bol) * 0.6}>
          <polygon points="-260,0 160,0 260,-100 -160,-100" fill="rgba(255,236,200,.12)" stroke="rgba(255,236,200,.5)" strokeWidth={4} />
          <polygon points={`-260,0 160,0 160,${60 * blo} -260,${60 * blo}`} fill={SC} /><polygon points={`160,0 260,-100 260,${-100 + 60 * blo} 160,${60 * blo}`} fill="#8f8473" />
          <text x={0} y={140} textAnchor="middle" fontSize={48} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed" opacity={e(t, m.dec, m.dec + 0.6)}>1 M² × 10 CM = 0,1 M³</text>
        </g>
        {l130 > 0.02 && <g opacity={1 - e(t, m.bol - 0.4, m.bol) * 0.6}>{Array.from({ length: 7 }, (_, i) => cl(l130 * 7 - i) > 0 && <g key={i} transform={`translate(${1000 + (i % 4) * 140},${520 + Math.floor(i / 4) * 170}) scale(${0.36 * cl(l130 * 7 - i)})`}><Balde x={0} y={0} lvl={i === 6 ? 0.5 : 0.9} liq={CLARA} /></g>)}
          <text x={1210} y={300} textAnchor="middle" fontSize={64} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">130 L DE TIERRA</text></g>}
        {l16 > 0.02 && <g transform="translate(1620,560)" opacity={1 - e(t, m.bol - 0.4, m.bol) * 0.6}><g transform={`scale(${0.5 * l16})`}><Balde x={0} y={0} lvl={0.9} liq="#c9cbcc" /></g>
          <text y={60} textAnchor="middle" fontSize={56} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">16 L</text>
          {kg > 0.02 && <text y={130} textAnchor="middle" fontSize={56} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed" opacity={kg}>≈ 22 KG</text>}</g>}
        {t > m.bol && <g transform={`translate(960,${lerp(1300, 560, bol)})`}>
          <g transform={`translate(${-60 * med},0)`}><clipPath id="bolL"><rect x={-200} y={-260} width={200} height={480} /></clipPath><g clipPath="url(#bolL)"><Bolsa x={0} y={0} s={1.1} /></g></g>
          <g transform={`translate(${60 * med},${30 * med}) rotate(${12 * med})`} opacity={1 - med * 0.6}><clipPath id="bolR"><rect x={0} y={-260} width={200} height={480} /></clipPath><g clipPath="url(#bolR)"><Bolsa x={0} y={0} s={1.1} /></g></g>
          <text y={-260} textAnchor="middle" fontSize={64} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">US$ 9 LA BOLSA</text></g>}
        {t > m.ent && <g transform={`translate(1500,${lerp(1300, 700, ent)}) rotate(${4 - 4 * ent})`}>
          <rect x={-200} y={-150} width={400} height={300} rx={14} fill="#f2e3bf" stroke="#9c7a45" strokeWidth={5} />
          <text y={-70} textAnchor="middle" fontSize={40} fontWeight={800} fill="#6c5a3c" fontFamily="Barlow Condensed">EL METRO CUADRADO</text>
          <text y={40} textAnchor="middle" fontSize={110} fontWeight={800} fill="#2b1a0c" fontFamily="Barlow Condensed">US$ 4-4,5</text></g>}
      </Svg>
      <Lbl t={t} at={m.med} out={m.ent} text="media bolsa por m²" x={960} y={180} col={C.honey} size={74} />
    </>
  );
};

// 34 · comparar: tres columnas que crecen; suelo cemento chiquita, hormigón 3-4 veces, y la baldosa apilada (carpeta +
// pegamento + baldosa) que también se va arriba
export const TresVecesMas: React.FC<FxP> = ({ t, a, m }) => {
  const s = e(t, a, a + 1), h = e(t, m.hor, m.hor + 1.4), b = e(t, m.bal, m.bal + 1.4), bu = e(t, m.buena, m.buena + 0.8);
  const base = 880;
  return (
    <>
      <Svg>
        <rect x={420} y={base - 140 * s} width={260} height={140 * s} rx={10} fill={SC} />
        <text x={550} y={base + 60} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.ok} fontFamily="Barlow Condensed">SUELO CEMENTO</text>
        <rect x={830} y={base - 490 * h} width={260} height={490 * h} rx={10} fill="#8b8f92" />
        {h > 0.9 && <text x={960} y={base - 520} textAnchor="middle" fontSize={64} fontWeight={800} fill={C.red} fontFamily="Barlow Condensed">× 3-4</text>}
        <text x={960} y={base + 60} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">HORMIGÓN</text>
        {[["carpeta", "#8d887e", 0.45], ["pegamento", "#d8d0c0", 0.2], ["baldosa", "#b26a45", 0.35]].reduce<{ y: number; els: React.ReactNode[] }>((acc, [w, col, f], i) => { const hh = 470 * (f as number) * cl(b * 3 - i); acc.els.push(<g key={w as string}><rect x={1240} y={acc.y - hh} width={260} height={hh} fill={col as string} />{hh > 30 && <text x={1520} y={acc.y - hh / 2 + 14} fontSize={36} fontWeight={700} fill={C.cream} fontFamily="Barlow">{w as string}</text>}</g>); acc.y -= hh; return acc; }, { y: base, els: [] }).els}
        <text x={1370} y={base + 60} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">BALDOSA</text>
        {bu > 0.02 && <circle cx={550} cy={base - 70} r={180 * bu} fill="none" stroke={C.ok} strokeWidth={8} opacity={bu} />}
      </Svg>
      <Lbl t={t} at={m.buena} text="patios grandes y entradas" x={960} y={200} col={C.honey} size={66} />
    </>
  );
};

// 35 · el fondo de 6 × 5 en plano: cotas, seis paños de 2 × 2,5, y la lista de compras que se arma al costado (bolsas
// que se apilan contando kilos, tosca, listones, nylon) y el reloj del fin de semana
export const FondoSeisCinco: React.FC<FxP> = ({ t, m }) => {
  const sup = e(t, m.sup, m.sup + 1), pan = e(t, m.pan, m.pan + 2), cem = e(t, m.cem, m.cat), cat = spr(t, m.cat);
  const bolsas = Math.min(14, Math.floor(cem * 13.4) + (t > m.cat ? 1 : 0));
  const lista: [string, number][] = [["14 bolsas", m.cat], ["tosca si falta tierra", m.tos], ["15 m de listón", m.lis], ["35 m² de nylon", m.nyl], ["2 personas · 1 finde", m.tie2]];
  return (
    <>
      <Svg>
        <g transform="translate(140,240)" opacity={sup}>
          <rect x={0} y={0} width={720} height={600} fill={SC} stroke="#4b4238" strokeWidth={6} />
          {[240, 480].map((x) => <line key={x} x1={x} y1={0} x2={x} y2={600 * pan} stroke="#4b4238" strokeWidth={8} />)}
          <line x1={0} y1={300} x2={720 * pan} y2={300} stroke="#4b4238" strokeWidth={8} />
          <text x={360} y={-24} textAnchor="middle" fontSize={50} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">6 M</text>
          <text x={-24} y={320} textAnchor="end" fontSize={50} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">5 M</text>
          {pan > 0.9 && Array.from({ length: 6 }, (_, i) => <text key={i} x={120 + (i % 3) * 240} y={160 + Math.floor(i / 3) * 300} textAnchor="middle" fontSize={34} fontWeight={700} fill="rgba(60,50,40,.7)" fontFamily="Barlow">2 × 2,5</text>)}
          <text x={360} y={670} textAnchor="middle" fontSize={50} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">30 M² · 6 PAÑOS</text>
        </g>
        {t > m.cem && <g>{Array.from({ length: bolsas }, (_, i) => <g key={i} transform={`translate(${1010 + (i % 7) * 70},${470 - Math.floor(i / 7) * 120}) scale(0.32)`}><Bolsa x={0} y={0} /></g>)}
          <text x={1220} y={250} textAnchor="middle" fontSize={56} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">{Math.round(22 * 30 * cl(cem))} KG</text></g>}
        {lista.map(([w, at], i) => t > at && <g key={w} transform={`translate(${1470},${600 + i * 82}) scale(${spr(t, at)})`}>
          <rect x={-260} y={-34} width={520} height={68} rx={12} fill="rgba(30,20,10,.85)" stroke="rgba(255,236,200,.35)" strokeWidth={2} />
          <text x={-230} y={14} fontSize={38} fontWeight={800} fill={i === 0 ? C.honey : C.cream} fontFamily="Barlow Condensed">✓ {w.toUpperCase()}</text></g>)}
        {t > m.cat && t < m.tos && <circle cx={1220} cy={420} r={0} opacity={cat} />}
      </Svg>
    </>
  );
};

// 36 · el tablero de herramientas: siluetas pintadas en una pared de fenólico; cada herramienta entra a su silueta al
// nombrarla; después el duelo pisón (brazos rojos) contra la placa alquilada; y el EPP en una fila
export const TableroHerramientas: React.FC<FxP> = ({ t, m }) => {
  const duel = e(t, m.pis - 0.3, m.pis + 0.3), prot = e(t, m.prot, m.prot + 0.6);
  const H: [string, number, number, number, React.ReactNode][] = [
    ["pala", m.pala, 300, 470, <Pala x={0} y={200} s={0.9} />],
    ["carretilla", m.carr, 560, 520, <g><path d="M-110,-60 L110,-60 L80,20 L-80,20 Z" fill="#5c7a8c" /><circle cy={50} r={30} fill="#222" /><line x1={80} y1={-20} x2={170} y2={30} stroke="#5e3a1c" strokeWidth={10} /></g>],
    ["rastrillo", m.ras, 780, 470, <g><rect x={-6} y={-260} width={12} height={300} fill="#b98a55" /><rect x={-90} y={40} width={180} height={18} fill="#6c7378" />{Array.from({ length: 9 }, (_, i) => <rect key={i} x={-86 + i * 20} y={56} width={6} height={36} fill="#6c7378" />)}</g>],
    ["regla 2 m", m.reg, 1080, 330, <Regla x={0} y={0} l={440} />],
    ["nivel", m.niv, 1080, 450, <g><rect x={-200} y={-24} width={400} height={48} rx={8} fill="#e0b53a" /><rect x={-40} y={-14} width={80} height={28} rx={14} fill="#bfe8a8" /><circle cx={6} r={9} fill="#fff" /></g>],
    ["hilo y estacas", m.hil, 1080, 600, <g>{[-120, 120].map((x) => <rect key={x} x={x - 10} y={-60} width={20} height={120} fill={MAD} />)}<line x1={-120} x2={120} y1={-40} y2={-40} stroke="#ffd27a" strokeWidth={5} /></g>],
    ["malla", m.mal, 1400, 380, <g><rect x={-130} y={-90} width={260} height={180} fill="none" stroke="#9aa4ac" strokeWidth={8} />{Array.from({ length: 6 }, (_, i) => <line key={i} x1={-130 + i * 52} x2={-130 + i * 52} y1={-90} y2={90} stroke="#b9c2c9" strokeWidth={2} />)}</g>],
    ["regadera", m.rega, 1450, 640, <Regadera x={0} y={0} s={0.7} />],
  ];
  return (
    <>
      <Svg>
        <g opacity={1 - duel}>
          <rect x={160} y={140} width={1600} height={780} rx={20} fill="#b79a72" />
          {Array.from({ length: 300 }, (_, i) => <circle key={i} cx={190 + (i % 30) * 52} cy={170 + Math.floor(i / 30) * 76} r={5} fill="#8a6f4c" />)}
          {H.map(([w, at, x, y, el]) => (<g key={w}>
            <g transform={`translate(${x},${y})`} opacity={0.18}>{el}</g>
            {t > at && <g transform={`translate(${x},${lerp(y + 300, y, spr(t, at))}) rotate(${(1 - spr(t, at)) * 20})`}>{el}</g>}
            {t > at && <text x={x} y={y + 180} textAnchor="middle" fontSize={34} fontWeight={800} fill="#2b1a0c" fontFamily="Barlow Condensed" opacity={e(t, at + 0.2, at + 0.5)}>{w.toUpperCase()}</text>}
          </g>))}
        </g>
        {duel > 0.02 && <g opacity={duel * (1 - prot)}>
          <g transform="translate(560,800)"><rect x={-280} y={0} width={560} height={50} rx={8} fill="#8a6f4c" /><Pison x={0} y={0} s={1.1} lift={Math.abs(Math.sin(t * 3)) * 0.4} />{[-1, 1].map((sg) => { const ph = (t * 1.5) % 1; return <ellipse key={sg} cx={sg * (110 + 90 * ph)} cy={-10 - 20 * ph} rx={40 + 30 * ph} ry={16 + 8 * ph} fill="#d9c7a6" opacity={(1 - ph) * 0.7} />; })}
            <text y={90} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">HASTA 20 M²</text></g>
          {t > m.placa && <g transform={`translate(${1360 + 6 * Math.sin(t * 40)},760) scale(${spr(t, m.placa) * 1.5})`}><rect x={-150} y={-30} width={300} height={40} rx={6} fill="#d8a23a" /><rect x={-80} y={-110} width={160} height={80} rx={14} fill="#c9781f" /><line x1={60} y1={-100} x2={180} y2={-260} stroke="#3a3a3a" strokeWidth={14} />
            <text y={110} textAnchor="middle" fontSize={34} fontWeight={800} fill={C.ok} fontFamily="Barlow Condensed">ALQUILADA 1 DÍA</text></g>}</g>}
        {prot > 0.02 && <g opacity={prot}>{["guantes largos", "antiparras", "botas de goma", "barbijo", "auditivo"].map((w, i) => <g key={w} transform={`translate(${320 + i * 320},560) scale(${spr(t, m.prot + i * 0.3)})`}>
          <circle r={110} fill={i % 2 ? C.honey : C.ok} /><text y={180} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">{w.toUpperCase()}</text></g>)}</g>}
      </Svg>
    </>
  );
};

// 37 · la helada en macro: un poro con agua; baja el termómetro, el agua se vuelve hielo y crece, y la superficie salta en
// escamas; después las tres razones como tres sellos sobre la losa; y el calendario: otoño tarde no, primavera sí
export const PoroHelado: React.FC<FxP> = ({ t, m }) => {
  const hin = e(t, m.hin, m.hin + 1.5), rev = e(t, m.rev, m.rev + 1.2), tres = e(t, m.tres - 0.3, m.tres + 0.3), oto = e(t, m.oto - 0.3, m.oto + 0.3);
  return (
    <>
      <Svg>
        <g opacity={1 - tres}>
          <rect x={360} y={420} width={1200} height={460} fill={SC} />
          <path d={`M860,420 Q860,${560 + 30 * hin} 960,${600 + 30 * hin} Q1060,${560 + 30 * hin} 1060,420 Z`} fill={hin > 0.5 ? "#dff2ff" : "#5d84a0"} />
          {hin > 0.3 && Array.from({ length: 8 }, (_, i) => <line key={i} x1={960} y1={520} x2={960 + 110 * hin * Math.cos(i * 0.8)} y2={520 + 80 * hin * Math.sin(i * 0.8)} stroke="#fff" strokeWidth={4} />)}
          {rev > 0.02 && Array.from({ length: 7 }, (_, i) => <polygon key={i} points="-40,0 40,-6 30,18 -30,14" fill={SC} transform={`translate(${880 + i * 28},${420 - 200 * rev * hash(i, 1)}) rotate(${rev * 200 * (hash(i, 2) - 0.5)})`} />)}
          <g transform="translate(1660,520)"><rect x={-20} y={-200} width={40} height={300} rx={20} fill="rgba(255,255,255,.2)" stroke="#e9e1cf" strokeWidth={4} /><rect x={-10} y={-190 + 280 * e(t, m.agua, m.hin)} width={20} height={280 - 280 * e(t, m.agua, m.hin)} fill={C.red} /><circle cy={110} r={34} fill={hin > 0.5 ? "#7cc8ff" : C.red} /></g>
          {hin > 0.4 && <Copo x={1660} y={260} r={44} rot={t * 20} />}
        </g>
        {tres > 0.02 && <g opacity={tres * (1 - oto)}>
          <Losa cx={960} y={300} w={1200} d={420} h={46}>{(f) => <Juntas f={f} nu={3} nv={2} k={1} col="#7d7263" />}</Losa>
          {[["compactado", m.com, "pocos poros"], ["curado", m.cur, "fraguó todo"], ["pendiente", m.pen, "el agua se va"]].map(([w, at, sub], i) => t > (at as number) && <g key={w as string} transform={`translate(${520 + i * 440},560) rotate(${-8 + i * 8}) scale(${spr(t, at as number)})`}>
            <circle r={130} fill="none" stroke={C.ok} strokeWidth={12} /><text y={0} textAnchor="middle" fontSize={50} fontWeight={800} fill={C.ok} fontFamily="Barlow Condensed">{(w as string).toUpperCase()}</text>
            <text y={50} textAnchor="middle" fontSize={34} fontWeight={700} fill={C.cream} fontFamily="Barlow">{sub as string}</text></g>)}
        </g>}
        {oto > 0.02 && <g opacity={oto}>{[["otoño tarde", false, m.oto], ["primavera", true, m.pri], ["principio de otoño", true, m.pri + 0.6]].map(([w, ok, at], i) => t > (at as number) && <g key={w as string} transform={`translate(${440 + i * 520},540) scale(${spr(t, at as number)})`}>
          <rect x={-210} y={-170} width={420} height={340} rx={24} fill="rgba(30,20,10,.85)" stroke="rgba(255,236,200,.35)" strokeWidth={3} />
          {ok ? <Sol x={0} y={-30} r={60} rot={t * 10} /> : <Copo x={0} y={-30} r={70} rot={t * 10} />}
          <text y={120} textAnchor="middle" fontSize={46} fontWeight={800} fill={ok ? C.ok : C.red} fontFamily="Barlow Condensed">{(w as string).toUpperCase()}</text></g>)}</g>}
      </Svg>
      <Lbl t={t} at={m.agua} out={m.tres} text="el problema es el agua" x={960} y={200} col={C.cream} size={74} />
      <Lbl t={t} at={m.tres} out={m.oto} text="tres razones" x={960} y={200} col={C.honey} size={80} />
    </>
  );
};

// 38 · tres fisuras en la lupa: la de un pelo (se deja), la de 2 mm (pincel, agua, lechada con espátula) y el paño
// hundido (se rompe ESE paño y se rehace; los otros cinco ni se tocan)
export const FisuraTresCasos: React.FC<FxP> = ({ t, m }) => {
  const abi = e(t, m.abi - 0.3, m.abi + 0.3), lech = e(t, m.lech, m.lech + 2), hun = e(t, m.hun - 0.3, m.hun + 0.3), pan = e(t, m.pan, m.pan + 1.5);
  return (
    <>
      <Svg>
        <g opacity={1 - hun}>
          <g transform="translate(560,540)" opacity={e(t, m.pelo - 0.3, m.pelo + 0.3)}><circle r={260} fill={SC} stroke="#e9e1cf" strokeWidth={18} /><path d="M-200,-40 l80,20 l60,-10 l80,30 l90,-20" stroke="#4b4238" strokeWidth={3} fill="none" />
            <text y={330} textAnchor="middle" fontSize={50} fontWeight={800} fill={C.ok} fontFamily="Barlow Condensed">UN PELO: NADA</text></g>
          {abi > 0.02 && <g transform="translate(1360,540)" opacity={abi}><circle r={260} fill={SC} stroke="#e9e1cf" strokeWidth={18} />
            <path d="M-200,-30 l80,20 l60,-10 l80,30 l90,-20" stroke="#2b221a" strokeWidth={18} fill="none" />
            <path d="M-200,-30 l80,20 l60,-10 l80,30 l90,-20" stroke="#cfc8ba" strokeWidth={14} fill="none" strokeDasharray="420" strokeDashoffset={420 * (1 - lech)} />
            {lech > 0.02 && lech < 0.99 && <g transform={`translate(${lerp(-200, 200, lech)},-40) rotate(-30)`}><rect x={-60} y={-12} width={120} height={20} fill="#cfd5da" /><rect x={-14} y={-80} width={28} height={70} rx={8} fill={MAD} /></g>}
            <text y={330} textAnchor="middle" fontSize={50} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">2 MM: LECHADA 1 : 1</text></g>}
        </g>
        {hun > 0.02 && <g opacity={hun}>
          <Losa cx={960} y={280} w={1300} d={500} h={50}>{(f) => <>
            <Juntas f={f} nu={3} nv={2} k={1} col="#4b4238" w={9} />
            <polygon points={quad(f, 1 / 3, 0.5, 2 / 3, 1)} fill={pan > 0.5 ? "#9f927d" : "#6f6556"} />
            {pan < 0.5 && Array.from({ length: 6 }, (_, i) => { const [x, y] = f(0.36 + 0.28 * hash(i, 1), 0.55 + 0.4 * hash(i, 2)); return <path key={i} d={`M${x},${y} l${30 - 60 * hash(i, 3)},${20} l${20},${-14}`} stroke="#2b221a" strokeWidth={5} fill="none" />; })}
            <polygon points={quad(f, 1 / 3, 0.5, 2 / 3, 1)} fill="none" stroke={C.honey} strokeWidth={8} opacity={0.5 + 0.5 * Math.sin(t * 4)} /></>}
          </Losa>
          {t > m.hun + 1 && pan < 0.9 && <Pison x={960 + 60 * Math.sin(t * 3)} y={700} s={0.8} lift={Math.abs(Math.sin(t * 6)) * 0.5} />}
        </g>}
      </Svg>
      <Lbl t={t} at={m.hun} out={m.pan} text="se hundió: se rehace ese paño" x={960} y={960} col={C.red} size={60} />
      <Lbl t={t} at={m.pan} text="2,5 m, no el patio entero" x={960} y={960} col={C.ok} size={66} />
    </>
  );
};

// 39 · tres terminaciones sobre el mismo paño, partido en tres: natural mate terroso (no resbala), lechada espolvoreada
// como harina y frotada con la llana (con el rayado de escoba encima), y sellador acrílico que oscurece y hace perlar el agua
export const TresTerminaciones: React.FC<FxP> = ({ t, m }) => {
  const lech = e(t, m.har, m.har + 2), lla = e(t, m.har + 1.5, m.ojo), esc = e(t, m.esc, m.esc + 2), pin = e(t, m.pint, m.pint + 2);
  return (
    <>
      <Svg>
        <Losa cx={960} y={260} w={1500} d={520} h={56} top="#c3b49a">
          {(f) => <>
            {t > m.lech && <polygon points={quad(f, 1 / 3, 0, 2 / 3, 1)} fill="#d8d2c4" opacity={0.3 + 0.6 * lla} />}
            {lech > 0.02 && Array.from({ length: 80 }, (_, i) => { const [x, y] = f(1 / 3 + hash(i, 1) / 3, hash(i, 2) * lech); return <circle key={i} cx={x} cy={y} r={3} fill="#eef0f2" opacity={1 - lla} />; })}
            {esc > 0.02 && Array.from({ length: 26 }, (_, i) => { const [x0, y0] = f(1 / 3 + 0.01, (i + 0.5) / 26), [x1, y1] = f(1 / 3 + 0.01 + esc * 0.32, (i + 0.5) / 26); return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke="rgba(80,70,60,.35)" strokeWidth={2} />; })}
            {pin > 0.02 && <polygon points={quad(f, 2 / 3, 0, 2 / 3 + pin / 3, 1)} fill="#8a7b63" />}
            {pin > 0.6 && [0.75, 0.85, 0.8].map((u, i) => { const [x, y] = f(u, 0.3 + i * 0.25); return <g key={i}><ellipse cx={x} cy={y} rx={26} ry={16} fill="rgba(140,205,255,.8)" /><ellipse cx={x - 8} cy={y - 6} rx={8} ry={4} fill="#fff" /></g>; })}
            {pin > 0.6 && <Brillo id="ttb" pts={quad(f, 2 / 3, 0, 1, 1)} k={((t * 0.2) % 1.4)} o={0.35} />}
            {[1 / 3, 2 / 3].map((u) => <line key={u} x1={f(u, 0)[0]} y1={f(u, 0)[1]} x2={f(u, 1)[0]} y2={f(u, 1)[1]} stroke="#4b4238" strokeWidth={8} />)}
          </>}
        </Losa>
        {lla > 0.02 && lla < 0.99 && <Llana x={960 + 120 * Math.sin(t * 4)} y={lerp(300, 760, lla)} s={0.9} />}
        {[["natural", m.nat, 470], ["lechada", m.lech, 960], ["sellador", m.pint, 1450]].map(([w, at, x]) => t > (at as number) && <g key={w as string}><Tarja x={x as number} y={930} w={340} txt={w as string} k={spr(t, at as number)} col={C.cream} /></g>)}
      </Svg>
      <Lbl t={t} at={m.res} out={m.lech} text="mate y no resbala" x={470} y={170} col={C.ok} size={58} />
      <Lbl t={t} at={m.har} out={m.ojo} text="como harina" x={960} y={170} col={C.cream} size={62} />
      <Lbl t={t} at={m.ojo} out={m.esc} text="muy liso resbala" x={960} y={170} col={C.red} size={62} />
      <Lbl t={t} at={m.esc} out={m.pint} text="escoba: antideslizante" x={960} y={170} col={C.ok} size={62} />
      <Lbl t={t} at={m.ano} text="cada 2 o 3 años" x={1450} y={170} col={C.honey} size={62} />
    </>
  );
};

// 40 · seis errores como seis estacas clavadas en fila; cada una cae con su objeto culpable y se tiñe de rojo
export const SeisErroresPatio: React.FC<FxP> = ({ t, m }) => {
  const E: [string, string][] = [["tierra negra", "e1"], ["agua de más", "e2"], ["una capa gruesa", "e3"], ["sin juntas", "e4"], ["sin curar", "e5"], ["sin pendiente", "e6"]];
  return (
    <>
      <Svg>
        <rect x={0} y={760} width={1920} height={320} fill={CLARA} opacity={0.5} />
        {E.map(([w, k], i) => { const at = m[k] ?? 1e9, p = spr(t, at), x = 230 + i * 292; return t > at - 0.1 && (
          <g key={k} transform={`translate(${x},${lerp(-400, 760, p) + shake(t, at + 0.25, 10)})`}>
            <polygon points="-80,-560 80,-560 80,-60 0,20 -80,-60" fill={MAD} stroke="#5e3a1c" strokeWidth={4} />
            <rect x={-80} y={-560} width={160} height={500} fill={C.red} opacity={0.55 * e(t, at + 0.5, at + 1)} />
            <text x={0} y={-470} textAnchor="middle" fontSize={64} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">{i + 1}</text>
            <text transform="translate(14,-300) rotate(-90)" textAnchor="middle" fontSize={44} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">{w.toUpperCase()}</text>
          </g>); })}
      </Svg>
      <Lbl t={t} at={m.e4 + 1.5} out={m.e5} text="no es si: es cuándo" x={960} y={140} col={C.red} size={72} />
    </>
  );
};

// 41 · el fondo de Doña Elsa: los cartones en el barro hasta la soga de la ropa; el presupuesto de hormigón = cuatro
// meses de jubilación; el fin de semana en dos hojas (sábado / domingo); diez gotas de riego; dos años después, la bici
// dando vueltas sobre los seis paños
export const FondoDeElsa: React.FC<FxP> = ({ t, m }) => {
  const pre = e(t, m.pre, m.pre + 1), fin = e(t, m.sab - 0.3, m.sab + 0.3), dos = e(t, m.dos - 0.3, m.dos + 0.5), bici = t > m.bici ? (t - m.bici) * 1.2 : 0;
  return (
    <>
      <Svg>
        <g opacity={1 - fin}>
          <rect x={200} y={600} width={1520} height={360} fill="#5b4029" />
          {Array.from({ length: 6 }, (_, i) => t > m.car + i * 0.3 && <rect key={i} x={300 + i * 210} y={760 + 30 * hash(i, 1)} width={170} height={100} fill="#c49a5e" transform={`rotate(${-8 + 16 * hash(i, 2)} ${385 + i * 210} 810)`} />)}
          <line x1={240} x2={1680} y1={330} y2={300} stroke="#e9e1cf" strokeWidth={4} />
          {[400, 640, 880, 1120].map((x, i) => <rect key={x} x={x} y={322 - i * 5} width={120} height={140} fill={["#d8352a", "#e9e1cf", "#3b6a8a", "#f0a93a"][i]} />)}
          {pre > 0.02 && <g transform={`translate(1400,${lerp(1300, 520, spr(t, m.pre))})`}><rect x={-230} y={-150} width={460} height={300} rx={14} fill="#f2e3bf" /><text y={-60} textAnchor="middle" fontSize={40} fontWeight={800} fill="#6c5a3c" fontFamily="Barlow Condensed">PRESUPUESTO HORMIGÓN</text>
            <text y={40} textAnchor="middle" fontSize={64} fontWeight={800} fill={C.red} fontFamily="Barlow Condensed">= 4 MESES</text><text y={100} textAnchor="middle" fontSize={34} fontWeight={700} fill="#6c5a3c" fontFamily="Barlow">de jubilación</text></g>}
        </g>
        {fin > 0.02 && <g opacity={fin * (1 - dos)}>
          {[["sábado", m.sab, "tierra negra · frasco · listones · telgopor"], ["domingo", m.dom, "mezcla y pisón · 6 paños"]].map(([w, at, sub], i) => t > (at as number) && <g key={w as string} transform={`translate(${560 + i * 800},520) rotate(${-3 + 6 * i}) scale(${spr(t, at as number)})`}>
            <rect x={-340} y={-260} width={680} height={520} rx={20} fill="#f2e3bf" /><rect x={-340} y={-260} width={680} height={90} rx={20} fill={C.red} />
            <text y={-196} textAnchor="middle" fontSize={56} fontWeight={800} fill="#fff" fontFamily="Barlow Condensed">{(w as string).toUpperCase()}</text>
            {(sub as string).split(" · ").map((s, j) => <text key={s} y={-60 + j * 80} textAnchor="middle" fontSize={44} fontWeight={800} fill="#2b1a0c" fontFamily="Barlow Condensed" opacity={e(t, (at as number) + 0.6 + j * 0.6, (at as number) + 1 + j * 0.6)}>{s.toUpperCase()}</text>)}</g>)}
          {t > m.diez && <g>{Array.from({ length: 10 }, (_, i) => <circle key={i} cx={510 + i * 100} cy={920} r={22} fill="#7cc8ff" opacity={spr(t, m.diez + i * 0.15)} />)}<text x={960} y={1000} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">10 DÍAS DE RIEGO</text></g>}
        </g>}
        {dos > 0.02 && <g opacity={dos}>
          <Losa cx={960} y={360} w={1300} d={500} h={50}>{(f) => <><Juntas f={f} nu={3} nv={2} k={1} col="#7d7263" />
            {[[0.18, 0.3], [0.85, 0.25]].map(([u, v], i) => { const [x, y] = f(u, v); return <g key={i}><path d={`M${x - 50},${y} L${x + 50},${y} L${x + 36},${y + 80} L${x - 36},${y + 80} Z`} fill="#b4552f" /><circle cx={x} cy={y - 30} r={50} fill="#5c9a36" /></g>; })}
            {(() => { const [x, y] = f(0.5 + 0.25 * Math.cos(bici), 0.6 + 0.25 * Math.sin(bici)); return <g transform={`translate(${x},${y})`}><circle cx={-40} r={30} fill="none" stroke="#2a3640" strokeWidth={6} /><circle cx={40} r={30} fill="none" stroke="#2a3640" strokeWidth={6} /><path d="M-40,0 L0,-40 L40,0" stroke={C.red} strokeWidth={6} fill="none" /><circle cy={-90} r={18} fill="#e9d3b0" /><rect x={-14} y={-72} width={28} height={36} rx={8} fill="#f0a93a" /></g>; })()}</>}
          </Losa>
        </g>}
      </Svg>
      <Lbl t={t} at={m.car} out={m.pre} text="cartones para tender" x={960} y={180} col={C.cream} size={70} />
      <Lbl t={t} at={m.dos} text="ni una grieta fuera de las juntas" x={960} y={180} col={C.ok} size={58} />
    </>
  );
};

// 42 · la entrada del galpón de Nacho: el pantano con la huella profunda; la receta reforzada en tres fichas (15 cm en
// tres capas de 5, 1 : 6, paños de 2 × 2), catorce días; la camioneta con fardos cruza y la huella no aparece
export const EntradaNacho: React.FC<FxP> = ({ t, m }) => {
  const rec = e(t, m.qui - 0.3, m.qui + 0.3), pas = e(t, m.pas - 0.3, m.pas + 0.3), cx = lerp(-500, 2400, e(t, m.pas + 0.3, m.pas + 5));
  return (
    <>
      <Svg>
        <rect x={1180} y={220} width={460} height={400} fill="#7a6a58" /><polygon points="1160,230 1410,110 1660,230" fill="#5d4a36" /><rect x={1290} y={380} width={240} height={240} fill="#3a2c1e" />
        <rect x={0} y={620} width={1920} height={460} fill="#5b4029" opacity={1 - pas} />
        <g opacity={1 - rec}>
          {[680, 780].map((y) => <path key={y} d={`M0,${y} Q960,${y + 30} 1920,${y - 20}`} stroke="#33220f" strokeWidth={46} fill="none" />)}
          <Charcos2 t={t} />
        </g>
        {rec > 0.02 && <g opacity={rec * (1 - pas)}>{[["15 cm · 3 capas de 5", m.qui], ["1 : 6", m.seis], ["paños de 2 × 2", m.pan2], ["14 días", m.cat]].map(([w, at], i) => t > (at as number) && <g key={w as string} transform={`translate(${400 + i * 380},820) scale(${spr(t, at as number)})`}>
          <rect x={-175} y={-100} width={350} height={200} rx={24} fill="rgba(30,20,10,.88)" stroke="rgba(255,236,200,.4)" strokeWidth={3} />
          {(w as string).split(" · ").map((ln, j, arr) => <text key={j} y={16 + (j - (arr.length - 1) / 2) * 52} textAnchor="middle" fontSize={46} fontWeight={800} fill={i === 3 ? C.honey : C.cream} fontFamily="Barlow Condensed">{ln.toUpperCase()}</text>)}</g>)}</g>}
        {pas > 0.02 && <g opacity={pas}>
          <polygon points="0,640 1920,640 1920,1080 0,1080" fill={SC} />
          {[480, 960, 1440].map((x) => <line key={x} x1={x} y1={640} x2={x} y2={1080} stroke="#7d7263" strokeWidth={7} />)}<line x1={0} x2={1920} y1={860} y2={860} stroke="#7d7263" strokeWidth={7} />
          <Camioneta x={cx} y={820} s={0.9} fardos giro={cx} />
        </g>}
      </Svg>
      <Lbl t={t} at={m.pan} out={m.qui} text="un pantano cada invierno" x={760} y={200} col={C.cream} size={66} />
      <Lbl t={t} at={m.pas + 4} text="ni la marca de la cubierta" x={760} y={200} col={C.ok} size={66} />
    </>
  );
};
const Charcos2: React.FC<{ t: number }> = ({ t }) => <g>{[[400, 720], [900, 760], [1400, 720]].map(([x, y], i) => <g key={i}><ellipse cx={x} cy={y} rx={160} ry={30} fill="#6d8192" /><ellipse cx={x - 40} cy={y - 6} rx={60} ry={6} fill="#c9dbe6" opacity={0.4 + 0.2 * Math.sin(t * 2 + i)} /></g>)}</g>;

// 43 · la libreta de Don Aldo: una libreta de tapa dura que se abre; cuatro páginas pasan con sus «nunca», cada una con
// su dibujito a lápiz; la última frase queda sola
export const AldoLibreta: React.FC<FxP> = ({ t, m }) => {
  const N: [string, string, number][] = [["sin la prueba de la tierra", "n1", 0], ["más de lo que coloca en una hora", "n2", 1], ["con viento fuerte o helada", "n3", 2], ["sin explicar el riego", "n4", 3]];
  const cur = N.reduce((c, [, k], i) => (t > (m[k] ?? 1e9) ? i : c), -1), rie = e(t, m.rie, m.rie + 0.8);
  const dib = (i: number) => i === 0 ? <g><rect x={-40} y={-80} width={80} height={130} rx={14} fill="none" stroke="#4a3a2a" strokeWidth={4} /><line x1={-34} x2={34} y1={10} y2={10} stroke="#4a3a2a" strokeWidth={3} /><line x1={-34} x2={34} y1={-20} y2={-20} stroke="#4a3a2a" strokeWidth={3} /></g>
    : i === 1 ? <g><circle r={60} fill="none" stroke="#4a3a2a" strokeWidth={4} /><line y2={-44} stroke="#4a3a2a" strokeWidth={4} /><line x2={34} stroke="#4a3a2a" strokeWidth={4} /></g>
    : i === 2 ? <g>{[0, 1, 2].map((j) => <path key={j} d={`M-70,${-30 + j * 30} q30,-20 60,0 t60,0`} stroke="#4a3a2a" strokeWidth={4} fill="none" />)}</g>
    : <g><path d="M-60,40 L60,40 L44,-30 L-44,-30 Z" fill="none" stroke="#4a3a2a" strokeWidth={4} />{[-30, 0, 30].map((x) => <line key={x} x1={x} x2={x} y1={50} y2={80} stroke="#4a3a2a" strokeWidth={3} strokeDasharray="4 6" />)}</g>;
  return (
    <>
      <Svg>
        <g transform="translate(960,560)" opacity={1 - rie * 0.85}>
          <rect x={-620} y={-360} width={1240} height={720} rx={22} fill="#5e3a1c" />
          <rect x={-600} y={-340} width={590} height={680} fill="#efe4c8" /><rect x={10} y={-340} width={590} height={680} fill="#f4ebd3" />
          <line x1={0} x2={0} y1={-340} y2={340} stroke="#b9a97f" strokeWidth={6} />
          {Array.from({ length: 12 }, (_, i) => <line key={i} x1={40} x2={570} y1={-260 + i * 52} y2={-260 + i * 52} stroke="#d9cba6" strokeWidth={2} />)}
          <text x={-305} y={-230} textAnchor="middle" fontSize={44} fontWeight={800} fill="#4a3a2a" fontFamily="Barlow Condensed">DON ALDO · NUNCA</text>
          {cur >= 0 && <g transform="translate(-305,40)">{dib(cur)}</g>}
          {N.map(([w, k], i) => i <= cur && <text key={k} x={60} y={-200 + i * 130} fontSize={40} fontWeight={800} fill={i === cur ? "#2b1a0c" : "#8a7a5a"} fontFamily="Barlow Condensed" opacity={e(t, m[k], m[k] + 0.5)}>{`${i + 1}. ${w.toUpperCase()}`}</text>)}
          {cur >= 0 && <g transform={`translate(${-305 + 600 * e(t, m[N[cur][1]], m[N[cur][1]] + 0.5) * 0},0)`} />}
        </g>
      </Svg>
      <Lbl t={t} at={m.rie} text="lo termina el que lo riega" x={960} y={560} col={C.honey} size={84} />
    </>
  );
};

// 44 · las preguntas de los comentarios como fichas de chat que suben; cada respuesta sale de la burbuja de Claudio con un
// objeto: la bolsa de cal tachada, el contrapiso roto que se saca, el escombro que pasa la malla, y el camino de 50 años
export const CuatroPreguntas: React.FC<FxP> = ({ t, m }) => {
  const Q: [string, string, string][] = [["¿y si le pongo cal?", "q1", "tarda y queda blanda: cemento"], ["¿sobre un contrapiso roto?", "q2", "no: primero se saca"], ["¿y si tiene escombro?", "q3", "chico, < 2 cm: ayuda"], ["¿cuánto dura?", "q4", "años: caminos de 50"]];
  const cur = Q.reduce((c, [, k], i) => (t > (m[k] ?? 1e9) ? i : c), -1);
  return (
    <>
      <Svg>
        {Q.map(([q, k, r], i) => { const at = m[k] ?? 1e9; if (t < at) return null; const y = 330 + i * 165, act = i === cur; return (
          <g key={k} transform={`translate(${(1 - spr(t, at)) * -300},${y})`} opacity={act ? 1 : 0.45}>
            <g transform="translate(470,0)"><rect x={-280} y={-55} width={560} height={110} rx={50} fill="#e9e1cf" /><circle cx={-330} cy={0} r={40} fill="#8a9aa8" />
              <text y={14} textAnchor="middle" fontSize={40} fontWeight={800} fill="#2b1a0c" fontFamily="Barlow Condensed">{q.toUpperCase()}</text></g>
            {t > at + 1.2 && <g transform={`translate(${1170 + (1 - spr(t, at + 1.2)) * 200},0)`} opacity={e(t, at + 1.2, at + 1.6)}><rect x={-330} y={-55} width={660} height={110} rx={50} fill={act ? C.honey : "#b58a3a"} />
              <text y={14} textAnchor="middle" fontSize={40} fontWeight={800} fill="#2b1a0c" fontFamily="Barlow Condensed">{r.toUpperCase()}</text></g>}
          </g>); })}
        {cur >= 0 && <g transform={`translate(1690,${330 + cur * 165}) scale(0.55)`}>
          {cur === 0 && <g><Bolsa x={0} y={0} s={0.8} txt="CAL" col="#f2efe6" /><Cross t={t} at={m.q1 + 1.6} x={110} y={-150} r={50} /></g>}
          {cur === 1 && <g>{Array.from({ length: 5 }, (_, i) => <polygon key={i} points="-60,-20 50,-30 60,20 -40,30" fill="#8d887e" transform={`translate(${(i - 2) * 70 + 40 * e(t, m.q2 + 1.5, m.q2 + 2.5) * (i - 2)},${-160 * e(t, m.q2 + 1.5, m.q2 + 2.5) * hash(i, 1)}) rotate(${i * 30})`} />)}</g>}
          {cur === 2 && <g>{Array.from({ length: 10 }, (_, i) => <rect key={i} x={-120 + (i % 5) * 50} y={-40 + Math.floor(i / 5) * 50 + ((t * 0.8 + hash(i, 2)) % 1) * 120} width={24} height={18} fill="#b4552f" />)}<rect x={-160} y={-80} width={320} height={20} fill="#9aa4ac" /></g>}
          {cur === 3 && <g><polygon points="-60,-140 60,-140 200,100 -200,100" fill={SC} /><text y={40} textAnchor="middle" fontSize={110} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed" opacity={e(t, m.cin, m.cin + 0.6)}>50</text></g>}
        </g>}
      </Svg>
    </>
  );
};

// 45 · la rutina en seis baldosas-escalón que se van pisando de izquierda a derecha (una huella sobre cada una)
export const RutinaSeisPasos: React.FC<FxP> = ({ t, m }) => {
  const R: [string, string][] = [["frasco y puño", "r1"], ["marcar, sacar, pendiente", "r2"], ["encofrado, listones, telgopor", "r3"], ["tamizar, 1 : 8, agua", "r4"], ["2 capas, regla, alisar", "r5"], ["nailon y riego, 7 días", "r6"]];
  return (
    <>
      <Svg>
        {R.map(([w, k], i) => { const at = m[k] ?? 1e9, on = t > at, x = 300 + i * 264, y = 800 - i * 75; return (
          <g key={k} transform={`translate(${x},${y})`}>
            <polygon points="-110,-40 110,-40 125,40 -125,40" fill={on ? SC : "rgba(255,236,200,.15)"} stroke="rgba(255,236,200,.4)" strokeWidth={3} />
            <rect x={-125} y={40} width={250} height={30} fill={on ? "#8f8473" : "rgba(255,236,200,.08)"} />
            <text y={14} textAnchor="middle" fontSize={56} fontWeight={800} fill={on ? "#2b1a0c" : C.dim} fontFamily="Barlow Condensed">{i + 1}</text>
            {on && w.split(", ").map((ln, j, arr) => <text key={j} y={-70 - (arr.length - 1 - j) * 38} textAnchor="middle" fontSize={34} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed" opacity={spr(t, at + j * 0.15)}>{ln.toUpperCase()}</text>)}
            {on && t < (m[R[i + 1]?.[1]] ?? 1e9) && <ellipse cx={0} cy={-10} rx={30} ry={14} fill="#2a3640" opacity={0.6} transform={`translate(0,${-40 * (1 - spr(t, at))})`} />}
          </g>); })}
      </Svg>
    </>
  );
};

// 46 · el año del patio en una tira de cuatro ventanitas que se encienden: el mes uno con polvo al barrer, la lluvia de
// 50 mm que se va en diez minutos, la escarcha de las once noches con las dos rayitas en las juntas, y el verano con el
// telgopor apretado contra la pared de la cocina
export const PatioMesAMes: React.FC<FxP> = ({ t, m }) => {
  const W: [number, string, string][] = [[m.m1, "mes 1", "polvo fino"], [m.llu, "mes 3", "50 mm · 10 min"], [m.inv, "invierno", "11 noches bajo cero"], [m.ver, "verano", "40° · la tira trabajó"]];
  const cur = W.reduce((c, [at], i) => (t > at ? i : c), -1);
  return (
    <>
      <Svg>
        {W.map(([at, w, sub], i) => { const on = t > at, act = i === cur, x = 300 + i * 440; return (
          <g key={w} transform={`translate(${x},${act ? 500 : 540}) scale(${on ? (act ? 1.08 : 0.92) : 0.85})`} opacity={on ? 1 : 0.3}>
            <rect x={-200} y={-240} width={400} height={420} rx={24} fill="rgba(30,20,10,.85)" stroke={act ? C.honey : "rgba(255,236,200,.3)"} strokeWidth={act ? 6 : 3} />
            <clipPath id={`mm${i}`}><rect x={-180} y={-220} width={360} height={260} rx={14} /></clipPath>
            <g clipPath={`url(#mm${i})`}>
              <rect x={-180} y={-220} width={360} height={260} fill={i === 2 ? "#e8eef2" : SC} />
              {i === 0 && on && Array.from({ length: 20 }, (_, j) => <circle key={j} cx={-150 + 300 * hash(j, 1) + ((t * 30) % 40)} cy={-40 - 60 * ((t * 0.6 + hash(j, 2)) % 1)} r={4} fill="#efe9dc" opacity={act && t < m.m2 ? 0.8 : 0} />)}
              {i === 1 && on && <g>{Array.from({ length: 16 }, (_, j) => { const ph = (t * 1.5 + hash(j, 3)) % 1; return <line key={j} x1={-160 + 320 * hash(j, 4)} y1={-220 + ph * 260} x2={-164 + 320 * hash(j, 4)} y2={-204 + ph * 260} stroke="#a9dcff" strokeWidth={3} opacity={t < m.diez ? 1 : 0} />; })}
                <ellipse cx={0} cy={-40} rx={140 * (1 - e(t, m.diez, m.diez + 1.5))} ry={20} fill="#7cc8ff" opacity={0.6} /></g>}
              {i === 2 && on && <><line x1={0} x2={0} y1={-220} y2={40} stroke="#7d7263" strokeWidth={6} /><line x1={-6} x2={6} y1={-120} y2={-60} stroke="#2b221a" strokeWidth={2} opacity={e(t, m.jun, m.jun + 0.8)} /></>}
              {i === 3 && on && <><rect x={-180} y={-220} width={60} height={260} fill="#a89377" /><rect x={-120} y={-220} width={12 - 4 * Math.abs(Math.sin(t))} height={260} fill="#f6f5ef" /></>}
            </g>
            <text y={100} textAnchor="middle" fontSize={50} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">{w.toUpperCase()}</text>
            <text y={150} textAnchor="middle" fontSize={32} fontWeight={700} fill={C.cream} fontFamily="Barlow">{sub}</text>
          </g>); })}
      </Svg>
      <Lbl t={t} at={m.jun} out={m.ver} text="se marcaron justo en el listón" x={960} y={930} col={C.ok} size={56} />
    </>
  );
};

// 47 · prueba 1, el baldazo: el balde se vuelca sobre el patio, la lámina de agua corre hacia el borde por la pendiente y
// el patio queda mojado pero firme (la mano lo toca)
export const PruebaBaldazo: React.FC<FxP> = ({ t, a, m }) => {
  const v = e(t, a + 0.6, a + 1.6), corre = e(t, a + 1.4, a + 6), mano = e(t, m.mano, m.mano + 0.8);
  return (
    <>
      <Svg>
        <Losa cx={960} y={360} w={1400} d={480} h={56}>{(f) => <><Juntas f={f} nu={3} nv={2} k={1} col="#7d7263" />
          {v > 0.3 && <polygon points={quad(f, 0.3 + 0.7 * corre * 0.3, 0.2, Math.min(1, 0.7 + corre * 0.3), 0.7 + 0.3 * corre)} fill="rgba(124,200,255,.45)" />}
          {v > 0.3 && <polygon points={quad(f, 0, 0, 1, 1)} fill="#5f5548" opacity={0.25 * corre} />}</>}
        </Losa>
        <g transform={`translate(860,${300 - 30 * v}) rotate(${110 * v})`}><Balde x={0} y={0} s={0.7} lvl={0.9 * (1 - v)} liq="#7cc8ff" /></g>
        {v > 0.2 && v < 0.99 && Array.from({ length: 20 }, (_, i) => <circle key={i} cx={980 + 120 * hash(i, 1)} cy={340 + 260 * ((t * 2 + hash(i, 2)) % 1)} r={10} fill="#7cc8ff" />)}
        {t > a + 3 && <path d="M1500,700 L1720,780" stroke={C.honey} strokeWidth={10} strokeLinecap="round" opacity={e(t, a + 3, a + 3.5)} />}
        {mano > 0.02 && <g transform={`translate(1100,${lerp(300, 640, mano)})`}><path d="M-80,0 Q-90,-40 -60,-50 L60,-50 Q90,-40 80,0 Q40,40 -40,40 Z" fill="#d9a27a" />{[-50, -20, 10, 40].map((x) => <rect key={x} x={x - 10} y={-100} width={22} height={60} rx={10} fill="#d9a27a" />)}</g>}
        <Tick t={t} at={m.mano + 1} x={1300} y={520} r={44} />
      </Svg>
      <Lbl t={t} at={a + 2} out={m.mano} text="corre y no se hace barro" x={960} y={180} col={C.cream} size={66} />
      <Lbl t={t} at={m.mano} text="mojado, pero firme" x={960} y={180} col={C.ok} size={76} />
    </>
  );
};

// 48 · prueba 2, el destornillador: macro de la superficie; la punta aprieta y raya; queda una línea finita y ni un grano
// suelto (la lupa lo confirma)
export const PruebaRaya: React.FC<FxP> = ({ t, a, m }) => {
  const ray = e(t, a + 1.2, a + 3.4), lup = e(t, m.nada, m.nada + 1);
  return (
    <>
      <Svg>
        <rect x={200} y={300} width={1520} height={600} rx={30} fill={SC} />
        {Array.from({ length: 220 }, (_, i) => <circle key={i} cx={220 + 1480 * hash(i, 1)} cy={320 + 560 * hash(i, 2)} r={2 + 4 * hash(i, 3)} fill={hash(i, 4) < 0.5 ? "#a39782" : "#d6ccbb"} />)}
        <line x1={420} y1={600} x2={lerp(420, 1500, ray)} y2={600 - 40 * ray} stroke="#8a7f6c" strokeWidth={3} />
        <g transform={`translate(${lerp(420, 1500, ray)},${600 - 40 * ray}) rotate(-38)`}><rect x={-8} y={-300} width={16} height={300} rx={4} fill="#c8ccd0" /><rect x={-34} y={-520} width={68} height={230} rx={26} fill={C.red} /></g>
        {lup > 0.02 && <g transform="translate(960,590)" opacity={lup}><circle r={190} fill="rgba(220,240,255,.14)" stroke="#e9e1cf" strokeWidth={16} /><line x1={-160} x2={160} y1={6} y2={-6} stroke="#8a7f6c" strokeWidth={8} /><line x1={140} y1={140} x2={260} y2={260} stroke={MAD} strokeWidth={30} strokeLinecap="round" /></g>}
        <Tick t={t} at={m.nada + 1} x={1260} y={420} r={46} />
      </Svg>
      <Lbl t={t} at={m.nada} text="no sale tierra" x={960} y={980} col={C.ok} size={80} />
    </>
  );
};

// 49 · prueba 3, la camioneta: pasa en primera de punta a punta sobre el patio (vista de costado con las juntas en el
// suelo); se baja, la lupa recorre: ni una marca, sólo las juntas rectas
export const PruebaCamioneta: React.FC<FxP> = ({ t, a, m }) => {
  const t0 = m.mir - 0.1, cx = lerp(-500, 960, e(t, t0, t0 + 2.4)) + lerp(0, 1500, e(t, t0 + 3.4, t0 + 5.2)), mir = e(t, t0 + 5.3, t0 + 7.8); void a;
  return (
    <>
      <Svg>
        <polygon points="0,700 1920,700 1920,1080 0,1080" fill={SC} />
        <polygon points="0,700 1920,700 1920,720 0,720" fill="#8f8473" />
        {[480, 960, 1440].map((x) => <line key={x} x1={x} y1={720} x2={x - 120} y2={1080} stroke="#7d7263" strokeWidth={8} />)}
        <line x1={0} x2={1920} y1={880} y2={880} stroke="#7d7263" strokeWidth={7} />
        <Camioneta x={cx} y={760} s={1.0} giro={cx * 0.6} />
        {mir > 0.02 && mir < 0.99 && <g transform={`translate(${lerp(300, 1600, mir)},${900})`}><circle r={110} fill="rgba(220,240,255,.14)" stroke="#e9e1cf" strokeWidth={12} /><line x1={80} y1={80} x2={160} y2={160} stroke={MAD} strokeWidth={22} strokeLinecap="round" /></g>}
        <Tick t={t} at={t0 + 7.8} x={1700} y={560} r={50} />
      </Svg>
      <Lbl t={t} at={t0 + 5.3} text="ni una marca" x={960} y={300} col={C.ok} size={96} />
    </>
  );
};
// sin usar a propósito (los dejo importados para próximas vueltas del ojo)
void [Brillo, Capas, Copo, Llana, Pala, Regla, Regadera, CLARA, Tarja, Camioneta, Persona];
