// fb5nb · componentes 16-29 (la mezcla, el volcado por paños, el fragüe, el secado, el lijado). f(t) + marcas de la voz.
import React from "react";
import { C, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Cross, Draw, FxP, Svg, Tick, shake } from "./kit";
import { Balde, Bidon, Brillo, Capas, CONT, Lija, Llana, Losa, quad, Regla, YESO } from "./piso";

// 16 · el 10 %: la jarra de un litro y el chorro de cola que llena la marca de 100 cc (medio vaso al lado); revuelto,
// el agua se pone lechosa
export const DiezPorCiento: React.FC<FxP> = ({ t, a, m }) => {
  const ch = e(t, m.cien, m.cien + 1.6), lec = e(t, m.cien + 1.8, m.cien + 3);
  return (
    <>
      <Svg>
        <g transform="translate(700,560)">
          <path d="M-170,-300 L170,-300 L150,300 L-150,300 Z" fill="rgba(230,240,250,.18)" stroke="#fff" strokeWidth={6} />
          <path d={`M-160,${-240 + 0} L160,-240 L150,300 L-150,300 Z`} fill={`rgba(${Math.round(lerp(124, 236, lec))},${Math.round(lerp(200, 236, lec))},${Math.round(lerp(255, 232, lec))},.92)`} />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => <line key={i} x1={130} y1={300 - i * 54} x2={i % 5 ? 160 : 180} y2={300 - i * 54} stroke="#2b241b" strokeWidth={4} />)}
          <rect x={-150} y={-240 - 54 * ch} width={300} height={54 * ch} fill={C.milk} opacity={1 - lec} />
          {t > m.cien && t < m.cien + 1.7 && <path d="M-40,-520 Q-20,-400 -10,-250" stroke={C.milk} strokeWidth={18} fill="none" />}
          <text x={210} y={-280} fontSize={46} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">+100 cc</text>
        </g>
        {t > m.cien && <g transform={`translate(560,${lerp(120, 200, e(t, m.cien, m.cien + 0.4))}) rotate(${lerp(0, -110, e(t, m.cien, m.cien + 0.5))})`}><Bidon x={0} y={0} s={0.8} /></g>}
        {t > m.vaso && <g transform={`translate(1300,${640 - 40 * spr(t, m.vaso)})`} opacity={cl((t - m.vaso) * 4)}>
          <path d="M-90,-150 L90,-150 L70,150 L-70,150 Z" fill="rgba(230,240,250,.2)" stroke="#fff" strokeWidth={5} />
          <path d="M-80,0 L80,0 L70,150 L-70,150 Z" fill={C.milk} />
        </g>}
      </Svg>
      <Lbl t={t} at={m.litro} text="1 litro de agua" x={700} y={960} col={C.solv} size={60} />
      <Lbl t={t} at={m.vaso + 0.3} text="= medio vaso" x={1300} y={880} col={C.milk} size={56} />
      <Lbl t={t} at={m.cien + 0.5} text="10 % de cola" x={1450} y={300} col={C.honey} size={90} />
    </>
  );
};

// 17 · la islita: el yeso cae como harina sobre el agua del balde, se hunde, el nivel de polvo sube hasta asomar y queda
// una isla que ya no se hunde; el reloj de un minuto y recién ahí la paleta
export const IslitaYeso: React.FC<FxP> = ({ t, a, m }) => {
  const sube = e(t, a + 0.4, m.isla), isla = e(t, m.isla, m.isla + 0.8), rel = e(t, m.min, m.min + 2), rev = e(t, m.min + 2.2, m.min + 3.2);
  return (
    <>
      <Svg>
        <Balde x={960} y={920} s={1.7} lvl={0.7} liq="#e7e9e6" crema={rev}>
          <rect x={960 - 220} y={920 - 400 * sube} width={440} height={400 * sube} fill={YESO} opacity={0.9 * (1 - rev)} />
          {isla > 0 && <ellipse cx={960} cy={920 - 1.7 * 340 * 0.92 * 0.7 - 6} rx={120 * isla} ry={30 * isla} fill={YESO} opacity={1 - rev} />}
        </Balde>
        {t < m.isla + 0.6 && Array.from({ length: 40 }, (_, i) => { const u = ((t - a) * 1.4 + hash(i, 1)) % 1; return <circle key={i} cx={900 + 120 * hash(i, 2) + 20 * Math.sin(u * 6)} cy={120 + u * 300} r={5} fill={YESO} opacity={0.9} />; })}
        {t > m.min && <g transform="translate(1520,360)"><circle r={100} fill="#f6f1e6" stroke="#5e5547" strokeWidth={8} /><line x1={0} y1={0} x2={80 * Math.sin(rel * 6.283)} y2={-80 * Math.cos(rel * 6.283)} stroke={C.red} strokeWidth={10} strokeLinecap="round" /><text y={170} textAnchor="middle" fontSize={50} fontWeight={800} fill={C.ink} fontFamily="Barlow Condensed">1 MINUTO</text></g>}
      </Svg>
      <Lbl t={t} at={a + 0.4} out={m.isla} text="como harina, sin revolver" x={960} y={140} col={C.cream} size={60} />
      <Lbl t={t} at={m.isla + 0.3} text="la islita: ahí parás" x={960} y={140} col={C.honey} size={66} />
    </>
  );
};

// 18 · el color: las cucharadas de óxido caen en el agua de cola, las muestras en cartón con su número de cucharadas
// y la libreta donde se anota
export const PigmentoCarton: React.FC<FxP> = ({ t, a, m }) => {
  const tonos = ["#e8ded0", "#dac6a6", "#c9a77c", "#b28659"];
  return (
    <>
      <Svg>
        <Balde x={420} y={860} s={1.1} lvl={0.6} liq={tonos[Math.min(3, Math.floor(e(t, m.cuch, m.cuch + 2) * 3.99))]} />
        {[0, 1, 2].map((i) => { const at = m.cuch + i * 0.6, k = e(t, at, at + 0.5); return t > at && <g key={i} transform={`translate(${lerp(260, 420, k)},${lerp(260, 470, k)}) rotate(${-40 + 120 * k})`} opacity={1 - e(t, at + 0.5, at + 0.7)}><ellipse rx={40} ry={24} fill="#cfd5da" /><ellipse rx={30} ry={16} fill="#a5532a" /><rect x={30} y={-6} width={120} height={12} fill="#cfd5da" /></g>; })}
        {tonos.map((c, i) => t > m.carton + i * 0.35 && <g key={i} transform={`translate(${820 + i * 260},${520 - 30 * spr(t, m.carton + i * 0.35)}) rotate(${(i - 1.5) * 3})`}>
          <rect x={-110} y={-130} width={220} height={260} rx={6} fill="#b98d5a" />
          <rect x={-90} y={-110} width={180} height={150} rx={4} fill={c} />
          <text y={110} textAnchor="middle" fontSize={50} fontWeight={800} fill="#2b1a0c" fontFamily="Barlow Condensed">{i} cdas</text>
        </g>)}
        {t > m.anota && <g transform={`translate(1240,${860 - 20 * spr(t, m.anota)})`}>
          <rect x={-260} y={-110} width={520} height={220} rx={10} fill="#f6f1e6" />
          {[0, 1, 2].map((i) => <line key={i} x1={-230} y1={-50 + i * 55} x2={230} y2={-50 + i * 55} stroke="#9fb6cc" strokeWidth={3} />)}
          <Draw d="M-210,-60 L-80,-60 M-210,-6 L60,-6 M-210,50 L-20,50" p={e(t, m.anota + 0.3, m.anota + 1.6)} col="#2b3f73" w={6} />
        </g>}
      </Svg>
      <Lbl t={t} at={m.cuch} text="el óxido va en el agua" x={420} y={180} col={C.cream} size={56} />
      <Lbl t={t} at={m.carton + 0.3} text="prueba en cartón" x={1210} y={300} col={C.honey} size={60} />
      <Lbl t={t} at={m.anota + 0.3} text="mismo color cada balde" x={1240} y={1010} col={C.cream} size={52} />
    </>
  );
};

// 19 · el reloj del yeso: un aro de 0 a 30 min con la franja 15-25 en rojo; el termómetro sube y la franja se corre
// hacia antes (con calor, más rápido)
export const RelojFrague: React.FC<FxP> = ({ t, a, m }) => {
  const cal = e(t, m.calor, m.calor + 1.4), s0 = 15 - 5 * cal, s1 = 25 - 7 * cal, ag = ((t - a) * 2.2) % 30;
  const arc = (m0: number, m1: number, r: number) => { const A = (x: number) => (x / 30) * 6.283 - 1.571; return `M${960 + r * Math.cos(A(m0))},${540 + r * Math.sin(A(m0))} A${r},${r} 0 ${m1 - m0 > 15 ? 1 : 0},1 ${960 + r * Math.cos(A(m1))},${540 + r * Math.sin(A(m1))}`; };
  return (
    <>
      <Svg>
        <circle cx={960} cy={540} r={330} fill="#f6f1e6" stroke="#5e5547" strokeWidth={10} />
        {Array.from({ length: 30 }, (_, i) => { const A = (i / 30) * 6.283 - 1.571; return <line key={i} x1={960 + 300 * Math.cos(A)} y1={540 + 300 * Math.sin(A)} x2={960 + (i % 5 ? 285 : 265) * Math.cos(A)} y2={540 + (i % 5 ? 285 : 265) * Math.sin(A)} stroke="#2b241b" strokeWidth={i % 5 ? 3 : 6} />; })}
        {t > m.min && <path d={arc(s0, s1, 240)} stroke={C.red} strokeWidth={56} fill="none" opacity={e(t, m.min, m.min + 0.5)} />}
        <line x1={960} y1={540} x2={960 + 250 * Math.cos((ag / 30) * 6.283 - 1.571)} y2={540 + 250 * Math.sin((ag / 30) * 6.283 - 1.571)} stroke="#2b241b" strokeWidth={12} strokeLinecap="round" />
        <circle cx={960} cy={540} r={22} fill="#2b241b" />
        <g transform="translate(1560,560)" opacity={cl((t - m.calor) * 4)}>
          <rect x={-26} y={-260} width={52} height={420} rx={26} fill="#f6f1e6" stroke="#5e5547" strokeWidth={6} />
          <rect x={-14} y={140 - 360 * (0.3 + 0.6 * cal)} width={28} height={360 * (0.3 + 0.6 * cal)} fill={C.red} />
          <circle cy={170} r={46} fill={C.red} />
        </g>
      </Svg>
      <Lbl t={t} at={m.min + 0.3} text={cal > 0.5 ? "con calor: antes" : "15 a 25 minutos"} x={960} y={980} col={cal > 0.5 ? C.red : C.cream} size={70} />
    </>
  );
};

// 20 · los paños: la planta del ambiente se divide con tiras de aluminio de 6 mm; abajo, el corte de una tira con la regla
// apoyada en dos guías y el espesor que queda parejo
export const GuiasPanos: React.FC<FxP> = ({ t, a, m }) => {
  const tiras = [[0.25, 0, 0.25, 1], [0.5, 0, 0.5, 1], [0.75, 0, 0.75, 1], [0, 0.5, 1, 0.5]];
  return (
    <>
      <Svg>
        <Losa cx={760} y={260} w={1000} d={420} h={40}>
          {(f) => tiras.map(([u0, v0, u1, v1], i) => { const k = e(t, a + 0.4 + i * 0.5, a + 0.9 + i * 0.5), p0 = f(u0, v0), p1 = f(lerp(u0, u1, k), lerp(v0, v1, k)); return <line key={i} x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke="#e6ebef" strokeWidth={10} />; })}
        </Losa>
        <g transform="translate(1180,700) scale(1.15)" opacity={cl((t - m.tiras) * 3)}>
          <rect x={0} y={60} width={520} height={80} fill={CONT} />
          <rect x={20} y={20} width={22} height={40} fill="#cfd5da" /><rect x={478} y={20} width={22} height={40} fill="#cfd5da" />
          <rect x={42} y={24} width={436} height={36} fill={YESO} opacity={e(t, m.tiras + 0.8, m.tiras + 1.6)} />
          <Regla x={260} y={6} l={540} />
          <line x1={540} y1={20} x2={540} y2={60} stroke={C.honey} strokeWidth={4} />
          <text x={560} y={50} fontSize={40} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">6 mm</text>
        </g>
      </Svg>
      <Lbl t={t} at={a + 0.5} text="paños de 1 a 2 m²" x={760} y={760} col={C.cream} size={64} />
      <Lbl t={t} at={m.tiras + 0.4} text="las tiras son tus guías" x={1480} y={940} col={C.honey} size={52} />
    </>
  );
};

// 21 · el regleado: vista de arriba, el rincón más lejos de la puerta; la mezcla cae, la regla zigzaguea hacia la puerta
// empujando el sobrante (el lomo de yeso adelante) que rellena lo que falta
export const ReglaZigzag: React.FC<FxP> = ({ t, a, m }) => {
  const r = e(t, m.regla, m.regla + 4), ry = lerp(260, 820, r), zz = 40 * Math.sin((t - m.regla) * 7) * (r > 0 && r < 1 ? 1 : 0), vu = e(t, m.vuelca, m.vuelca + 1);
  return (
    <>
      <Svg>
        <rect x={400} y={200} width={1120} height={720} fill={CONT} />
        <rect x={1380} y={900} width={140} height={20} fill="#9a6233" />
        <path d="M1520,920 A140,140 0 0,0 1380,780" stroke="#f6f1e6" strokeWidth={4} fill="none" strokeDasharray="10 8" />
        <rect x={420} y={220} width={1080} height={Math.max(0, ry - 220)} fill={YESO} />
        {vu > 0 && r < 0.05 && <ellipse cx={960} cy={300} rx={420 * vu} ry={70 * vu} fill={YESO} />}
        {r > 0 && r < 1 && <ellipse cx={960 + zz * 0.5} cy={ry + 30} rx={500} ry={22} fill="#e6dfd1" />}
        {t > m.regla && <Regla x={960 + zz} y={ry} l={1120} rot={zz * 0.04} />}
        <circle cx={460} cy={260} r={40 * e(t, m.rinc, m.rinc + 0.5)} fill="none" stroke={C.honey} strokeWidth={8} />
      </Svg>
      <Lbl t={t} at={m.rinc} out={m.regla} text="del rincón hacia la puerta" x={960} y={140} col={C.honey} size={60} />
      <Lbl t={t} at={m.regla + 0.3} text="regla en zigzag" x={960} y={140} col={C.cream} size={60} />
    </>
  );
};

// 22 · mate o brillo: la superficie recién volcada refleja la ventana; con el tiempo el reflejo se apaga (mate) y la
// barra de tiempo marca la ventana justa para la llana: antes sube agua, tarde deja marcas
export const MateBrillo: React.FC<FxP> = ({ t, a, m }) => {
  const mate = e(t, a + 0.6, a + 3), u = e(t, a + 0.6, Math.max(a + 4, m.tarde + 1.5));
  return (
    <>
      <Svg>
        <Losa cx={760} y={300} w={1080} d={440} top={YESO} side="#b7ae9c">
          {(f) => <g>
            <polygon points={quad(f, 0.45, 0.15, 0.7, 0.5)} fill="#fff6dc" opacity={0.75 * (1 - mate)} />
            <polygon points={quad(f, 0, 0, 1, 1)} fill="#8b97a3" opacity={0.3 * (1 - mate)} />
            {t > m.tarde && Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${f(0.15 + i * 0.12, 0.6)[0]},${f(0, 0.6)[1]} q30,-20 60,0`} stroke="#a59c8a" strokeWidth={5} fill="none" opacity={e(t, m.tarde, m.tarde + 0.5)} />)}
          </g>}
        </Losa>
        <g transform="translate(1340,600)">
          <rect x={0} y={0} width={480} height={40} rx={20} fill="rgba(255,236,200,.18)" />
          <rect x={150} y={0} width={180} height={40} fill={C.ok} opacity={0.75} />
          <rect x={0} y={0} width={150} height={40} rx={20} fill={C.solv} opacity={0.5 * e(t, m.antes, m.antes + 0.4)} />
          <rect x={330} y={0} width={150} height={40} rx={20} fill={C.red} opacity={0.6 * e(t, m.tarde, m.tarde + 0.4)} />
          <rect x={480 * u - 5} y={-20} width={10} height={80} fill={C.ink} />
        </g>
        {t > a + 2.4 && <Llana x={760} y={560} rot={-8} s={1.1} />}
      </Svg>
      <Lbl t={t} at={a + 0.6} out={a + 2.6} text="brilla: tiene agua" x={760} y={960} col={C.solv} size={60} />
      <Lbl t={t} at={a + 2.6} text="se pone mate: ahora la llana" x={760} y={960} col={C.ok} size={60} />
      <Lbl t={t} at={m.antes + 0.2} text="antes: sube agua" x={1580} y={520} col={C.solv} size={42} />
      <Lbl t={t} at={m.tarde + 0.2} text="tarde: marcas" x={1580} y={720} col={C.red} size={42} />
    </>
  );
};

// 23 · la piedra que vuelve: piedra de yeso → horno → polvo → agua → agujas de cristal que se traban; la barra de estados
// crema · manteca · dura
export const PiedraCocida: React.FC<FxP> = ({ t, a, m }) => {
  const hor = e(t, a + 0.6, a + 1.8), pol = e(t, a + 1.8, a + 2.6), crs = e(t, m.crist, m.crist + 2.5);
  const est = t > m.manteca + 1.2 ? 2 : t > m.manteca ? 1 : 0;
  return (
    <>
      <Svg>
        <g transform="translate(360,480)">
          <path d="M-120,40 L-80,-80 L40,-110 L130,-30 L100,80 L-40,100 Z" fill="#e2dccd" opacity={1 - pol} transform={`scale(${1 - 0.4 * pol})`} />
          <rect x={-150} y={140} width={300} height={70} rx={10} fill="#3b2a1a" opacity={hor * (1 - pol)} />
          {[0, 1, 2].map((i) => <path key={i} d={`M${-80 + i * 80},140 q-20,-40 0,-80 q20,-30 0,-60`} stroke="#ff8a3a" strokeWidth={10} fill="none" opacity={hor * (1 - pol) * (0.6 + 0.4 * Math.sin(t * 8 + i))} />)}
          {Array.from({ length: 50 }, (_, i) => <circle key={i} cx={-130 + 260 * hash(i, 61)} cy={60 + 60 * hash(i, 62)} r={5} fill={YESO} opacity={pol} />)}
        </g>
        <path d="M560,480 L700,480" stroke={C.honey} strokeWidth={8} opacity={pol} /><path d="M690,460 L720,480 L690,500" stroke={C.honey} strokeWidth={8} fill="none" opacity={pol} />
        <g transform="translate(1180,480)" opacity={e(t, m.agua, m.agua + 0.5)}>
          <circle r={260} fill="rgba(124,200,255,.16)" stroke="rgba(214,240,255,.5)" strokeWidth={4} />
          {Array.from({ length: 40 }, (_, i) => { const A = hash(i, 63) * 6.283, L = 60 + 160 * hash(i, 64); const k = cl(crs * 1.4 - hash(i, 65) * 0.4); return <line key={i} x1={Math.cos(A) * 30 * hash(i, 66)} y1={Math.sin(A) * 30 * hash(i, 66)} x2={Math.cos(A) * L * k} y2={Math.sin(A) * L * k} stroke="#f6f5ef" strokeWidth={6} strokeLinecap="round" />; })}
        </g>
        <g transform="translate(560,860)">
          {["crema", "manteca", "dura"].map((w, i) => <g key={w}><rect x={i * 280} y={0} width={270} height={70} rx={12} fill={i === est && t > m.manteca - 3 ? (i === 0 ? C.ok : i === 1 ? C.honey : C.red) : "rgba(255,236,200,.15)"} /><text x={i * 280 + 135} y={48} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.ink} fontFamily="Barlow Condensed">{w.toUpperCase()}</text></g>)}
        </g>
      </Svg>
      <Lbl t={t} at={a + 0.4} out={m.agua} text="piedra cocinada" x={360} y={260} col={C.cream} size={56} />
      <Lbl t={t} at={m.crist + 0.3} text="cristales que se traban" x={1180} y={180} col={C.honey} size={58} />
    </>
  );
};

// 24 · el balde sucio: un resto de yeso duro pegado al fondo hace de semilla; los cristales nuevos crecen desde ahí y el
// reloj corre al doble; balde enjuagado = reloj normal
export const BaldeSemilla: React.FC<FxP> = ({ t, a, m }) => {
  const sm = e(t, m.semilla, m.semilla + 2), ha = (t - a) * (t > m.mitad ? 2 : 1);
  return (
    <>
      <Svg>
        <Balde x={660} y={880} s={1.5} lvl={0.7} liq="#ece6d8">
          <path d="M520,880 L560,820 L640,840 L700,800 L780,880 Z" fill="#cfc6b2" />
          {Array.from({ length: 30 }, (_, i) => { const A = -Math.PI * hash(i, 71), L = 300 * sm * (0.4 + 0.6 * hash(i, 72)); return <line key={i} x1={650} y1={840} x2={650 + Math.cos(A) * L} y2={840 + Math.sin(A) * L * 0.9} stroke="#fff" strokeWidth={5} opacity={0.9} />; })}
        </Balde>
        <g transform="translate(1360,480)">
          <circle r={180} fill="#f6f1e6" stroke="#5e5547" strokeWidth={8} />
          <line x1={0} y1={0} x2={150 * Math.sin(ha * 0.9)} y2={-150 * Math.cos(ha * 0.9)} stroke={t > m.mitad ? C.red : "#2b241b"} strokeWidth={12} strokeLinecap="round" />
          <circle r={18} fill="#2b241b" />
        </g>
      </Svg>
      <Lbl t={t} at={m.semilla} text="el yeso viejo es semilla" x={660} y={160} col={C.honey} size={60} />
      <Lbl t={t} at={m.mitad + 0.3} text="fragua en la mitad" x={1360} y={760} col={C.red} size={60} />
      <Lbl t={t} at={m.mitad + 1.6} text="enjuagá entre baldes" x={1360} y={850} col={C.ok} size={50} />
    </>
  );
};

// 25 · fraguar ≠ secar: dos medidores — dureza (llena en minutos) y agua adentro (baja en días); si se sella antes, la
// tapa del sellador encierra el agua y salen burbujas y manchas lechosas
export const FraguarSecar: React.FC<FxP> = ({ t, a, m }) => {
  const du = e(t, m.frag, m.frag + 1), ag = 1 - 0.85 * e(t, m.sec, m.sec + 3), le = e(t, m.lech, m.lech + 1.2);
  return (
    <>
      <Svg>
        {[["dureza", du, C.honey, 560], ["agua adentro", ag, C.water, 960]].map(([n, k, c, x]) => <g key={n as string} transform={`translate(${x},250)`}>
          <rect x={-70} y={0} width={140} height={500} rx={20} fill="rgba(255,236,200,.12)" stroke="rgba(255,236,200,.4)" strokeWidth={4} />
          <rect x={-60} y={490 - 480 * (k as number)} width={120} height={480 * (k as number)} rx={14} fill={c as string} />
        </g>)}
        <g transform="translate(1440,600)" opacity={e(t, m.lech - 0.4, m.lech)}>
          <Capas x={-280} y={160} w={560} capas={[{ h: 160, k: 1, tipo: "yeso", moj: 0.8 }, { h: 20, k: 1, tipo: "sell" }]} />
          {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={-250 + 500 * hash(i, 81)} cy={-30 + 160 * hash(i, 82) * (1 - le)} r={10 + 10 * hash(i, 83)} fill="rgba(140,205,255,.7)" />)}
          {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={-220 + i * 90} cy={-10} rx={40 * le} ry={10 * le} fill="#fbfbf6" />)}
        </g>
      </Svg>
      <Lbl t={t} at={m.frag} text="fragua en minutos" x={560} y={820} col={C.honey} size={50} />
      <Lbl t={t} at={m.sec} text="seca en días" x={960} y={820} col={C.solv} size={50} />
      <Lbl t={t} at={m.lech + 0.3} text="sellado antes: manchas" x={1440} y={420} col={C.red} size={52} />
    </>
  );
};

// 26 · la caja que deja mancha: durante el secado alguien apoya una caja; al levantarla queda su huella oscura
export const ManchaMueble: React.FC<FxP> = ({ t, a, b }) => {
  const ap = e(t, a + 0.3, a + 0.9), se = e(t, a + 1, a + 4), lv = e(t, a + 4.2, a + 5);
  return (
    <>
      <Svg>
        <Losa cx={960} y={330} w={1300} d={500} top={YESO} side="#b7ae9c">
          {(f) => <g>
            <polygon points={quad(f, 0, 0, 1, 1)} fill="#7d8a96" opacity={0.4 * (1 - se)} />
            <polygon points={quad(f, 0.38, 0.3, 0.62, 0.7)} fill="#6d7a86" opacity={0.6 * lv} />
          </g>}
        </Losa>
        <g transform={`translate(0,${lerp(-500, 0, ap) - 260 * lv})`} opacity={1 - e(t, a + 4.6, a + 5.2)}>
          <polygon points="790,480 1130,480 1160,700 760,700" fill="#b98d5a" />
          <polygon points="760,700 1160,700 1160,780 760,780" fill="#8a6338" />
          <line x1={960} y1={480} x2={960} y2={700} stroke="#d9b860" strokeWidth={10} />
        </g>
      </Svg>
      <Lbl t={t} at={a + 1.2} out={a + 4.2} text="se seca alrededor..." x={960} y={960} col={C.cream} size={60} />
      <Lbl t={t} at={a + 4.4} text="...y abajo no" x={960} y={960} col={C.red} size={70} />
    </>
  );
};

// 27 · los tres granos: el perfil de la superficie al microscopio — de serrucho a casi recto — con la lija de cada grano
export const TresGranos: React.FC<FxP> = ({ t, a, m }) => {
  const g = t > m.g220 ? 3 : t > m.g150 ? 2 : t > m.g80 ? 1 : 0, amp = [46, 22, 8, 1.5][g], k = e(t, [m.g80, m.g150, m.g220][Math.max(0, g - 1)], [m.g80, m.g150, m.g220][Math.max(0, g - 1)] + 0.8);
  const am = g === 0 ? amp : lerp([46, 22, 8, 1.5][g - 1], amp, k);
  const prof = Array.from({ length: 97 }, (_, i) => `${i ? "L" : "M"}${200 + i * 15},${560 + am * (Math.sin(i * 1.9) * 0.6 + (hash(i, 9) - 0.5))}`).join(" ");
  return (
    <>
      <Svg>
        <path d={`${prof} L1640,820 L200,820 Z`} fill={YESO} />
        {[80, 150, 220].map((gr, i) => t > [m.g80, m.g150, m.g220][i] && <g key={gr} transform={`translate(${520 + i * 440},${260 - 20 * spr(t, [m.g80, m.g150, m.g220][i])}) rotate(${(i - 1) * 4})`}><Lija x={0} y={0} g={gr} col={["#b5703a", "#c7884a", "#dba868"][i]} /></g>)}
        {g > 0 && <rect x={lerp(200, 1500, ((t - [m.g80, m.g150, m.g220][g - 1]) * 0.6) % 1)} y={460} width={140} height={60} rx={10} fill="#5e3a1c" opacity={0.85} />}
      </Svg>
      <Lbl t={t} at={m.g220 + 0.6} text="liso como vidrio esmerilado" x={960} y={940} col={C.honey} size={62} />
    </>
  );
};

// 28 · el polvo encerrado: el cuarto en corte con la nube de yeso; la puerta con nylon la frena, la ventana abierta la
// saca; barbijo y antiparras se ponen al nombrarlos
export const PolvoCerrado: React.FC<FxP> = ({ t, a, m }) => {
  const ny = e(t, m.nylon, m.nylon + 0.8), nb = e(t, a + 0.3, a + 1.6);
  return (
    <>
      <Svg>
        <rect x={260} y={220} width={1100} height={640} fill="#3a2c1d" stroke="#f6f1e6" strokeWidth={10} />
        <rect x={1340} y={420} width={40} height={440} fill="#9a6233" />
        <rect x={1336} y={420} width={48} height={440} fill="rgba(230,240,250,.55)" opacity={ny} />
        <rect x={500} y={210} width={300} height={20} fill="#ffe6b0" />
        {Array.from({ length: 70 }, (_, i) => { const x0 = 300 + 1000 * hash(i, 91), y0 = 400 + 440 * hash(i, 92), dx = 30 * Math.sin(t * 0.8 + i), esc = ny > 0.5 ? 0 : 1; return <circle key={i} cx={Math.min(1330 + 300 * esc, x0 + dx + (hash(i, 93) > 0.7 ? 400 * (1 - ny) * cl(t - a - 1) : 0))} cy={y0 - (hash(i, 94) > 0.75 ? 260 * cl((t - m.nylon) * 0.3) : 0)} r={10 + 16 * hash(i, 95)} fill="rgba(240,236,226,.5)" opacity={nb} />; })}
        <g transform="translate(1640,420)" opacity={cl((t - m.barb) * 4)}>
          <circle r={130} fill="#d9a27a" />
          <path d="M-90,10 Q0,110 90,10 L90,50 Q0,150 -90,50 Z" fill="#f6f5ef" />
          <rect x={-110} y={-60} width={220} height={60} rx={28} fill="rgba(170,220,255,.6)" stroke="#2b3f73" strokeWidth={6} opacity={e(t, m.barb + 0.5, m.barb + 0.9)} />
        </g>
      </Svg>
      <Lbl t={t} at={m.barb + 0.2} text="barbijo y antiparras" x={1640} y={640} col={C.honey} size={48} />
      <Lbl t={t} at={m.nylon + 0.3} text="la puerta con nylon" x={810} y={940} col={C.cream} size={58} />
    </>
  );
};

// 29 · la luz rasante: el cuarto a oscuras, la linterna apoyada en el piso de costado; las ondas aparecen como sombras
// largas y el lápiz las marca
export const LuzRasante: React.FC<FxP> = ({ t, a, b }) => {
  const os = e(t, a + 0.2, a + 1), on = e(t, a + 1.2, a + 1.6), mk = e(t, a + 3, a + 5);
  return (
    <>
      <Svg>
        <rect x={0} y={0} width={1920} height={1080} fill="#000" opacity={0.6 * os} />
        <Losa cx={960} y={360} w={1500} d={540} top={lerp(0, 1, 1 - os) > 0.5 ? YESO : "#5b574f"} side="#2b2620">
          {(f) => <g>
            <polygon points={`${f(0, 0.95)[0]},${f(0, 0.95)[1]} ${f(1, 0)[0]},${f(1, 0)[1]} ${f(1, 0.6)[0]},${f(1, 0.6)[1]} ${f(0, 1)[0]},${f(0, 1)[1]}`} fill="#fff1c8" opacity={0.35 * on} />
            {[0.25, 0.45, 0.62, 0.8].map((v, i) => <ellipse key={i} cx={f(0.3 + 0.15 * i, v)[0]} cy={f(0, v)[1]} rx={160} ry={14} fill="#1a140e" opacity={0.65 * on} />)}
            {[0.25, 0.45, 0.62, 0.8].map((v, i) => <Draw key={`l${i}`} d={`M${f(0.3 + 0.15 * i, v)[0] - 170},${f(0, v)[1] + 26} l340,0`} p={cl(mk * 4 - i)} col={C.red} w={6} />)}
          </g>}
        </Losa>
        <g transform="translate(240,850) rotate(-8)" opacity={os}><rect x={-80} y={-30} width={190} height={60} rx={14} fill="#2f3438" /><rect x={110} y={-38} width={30} height={76} rx={6} fill="#d8d8d8" /><circle cx={150} r={22} fill="#fff7d6" opacity={on} /></g>
      </Svg>
      <Lbl t={t} at={a + 1.6} text="luz de costado: se ve todo" x={960} y={200} col={C.honey} size={62} />
    </>
  );
};
