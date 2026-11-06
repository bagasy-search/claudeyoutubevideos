// fb5na · componentes 1-12 (gancho, los tres tipos, las dos pruebas, el diario, el barranco). Cada uno es f(t) y sigue
// la voz por sus marcas (m.*). Nada se repite con la tanda cl2nov (cl2nov_COMPONENTES.md).
import React from "react";
import { C, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Big, Cross, Draw, FxP, Pop, Svg, Tick, num, shake } from "./kit";
import { Ampollas, Casa, Corte, H2O, Mancha, Muro, Nube, Reloj, Salitre, LAD } from "./pared";

// 1 · la mancha vuelve: tres capas caen sobre la pared (antihumedad, enduido, la pintura cara) y cada vez la mancha
// atraviesa la capa nueva; el calendario pasa tres meses y vuelve al mismo lugar exacto (un aro lo marca)
export const ManchaVuelve: React.FC<FxP> = ({ t, a, m }) => {
  const capas = [a + 0.6, m.enduido, m.cara], cols = ["#e9f0f4", "#f3eee2", "#fbf4e6"], nom = ["antihumedad", "enduido", "la pintura cara"];
  const ult = capas.filter((c) => t > c).length, back = e(t, m.meses + 0.6, m.meses + 2.6);
  const k = ult === 0 ? 1 : (t - capas[ult - 1] < 1.4 ? 1 - e(t, capas[ult - 1], capas[ult - 1] + 0.5) : 0) + (ult === 3 ? back : 0);
  return (
    <>
      <Svg>
        <Muro x={360} y={200} w={900} h={640}>
          {capas.map((c, i) => t > c && <rect key={i} x={360} y={200 + 640 * (1 - e(t, c, c + 0.6))} width={900} height={640 * e(t, c, c + 0.6) - 46} fill={cols[i]} />)}
          <Mancha cx={1080} cy={560} rx={260} ry={230} k={cl(k)} seed={4} />
          <Salitre x={880} y={794} w={360} k={cl(k)} />
          {t > m.meses + 2 && <circle cx={1080} cy={560} r={290 * spr(t, m.meses + 2)} fill="none" stroke={C.red} strokeWidth={8} strokeDasharray="20 12" />}
        </Muro>
        {/* calendario que pasa las hojas */}
        <g transform="translate(1560,420)">
          <rect x={-130} y={-150} width={260} height={300} rx={18} fill="#f6f1e6" stroke="#5e5547" strokeWidth={5} />
          <rect x={-130} y={-150} width={260} height={70} rx={18} fill={C.red} />
          <text x={0} y={60} textAnchor="middle" fontSize={130} fontWeight={800} fill="#2b241b" fontFamily="Barlow Condensed">{Math.min(3, Math.floor(e(t, m.meses, m.meses + 1.6) * 3.99))}</text>
          <text x={0} y={120} textAnchor="middle" fontSize={34} fontWeight={700} fill="#5e5547" fontFamily="Barlow">MESES</text>
        </g>
      </Svg>
      {capas.map((c, i) => <Lbl key={i} t={t} at={c + 0.3} out={(capas[i + 1] ?? m.meses) - 0.1} text={nom[i]} x={810} y={940} col={C.cream} size={64} />)}
      <Lbl t={t} at={m.meses + 2.2} text="el mismo lugar" x={810} y={1010} col={C.red} size={76} />
    </>
  );
};

// 2 · de costado: la casa en corte; la flecha de agua llega desde la casa del vecino y desde el barranco, atraviesa la
// medianera; el contador de manos de pintura gira hasta 1000 y la mancha sigue
export const DeCostado: React.FC<FxP> = ({ t, a, m }) => {
  const vec = e(t, m.vecino - 0.2, m.vecino + 0.8), bar = e(t, m.barranco, m.barranco + 1), mil = e(t, m.mil, m.mil + 2.5);
  return (
    <>
      <Svg>
        <Casa x={700} y={860} s={1.2}>
          <rect x={196} y={-300} width={40} height={300} fill={LAD} />
          <Mancha cx={170} cy={-130} rx={60} ry={90} k={0.4 + 0.6 * vec} seed={8} />
        </Casa>
        {/* la casa del vecino, con su jardinera */}
        <g opacity={vec}><Casa x={1290} y={860} s={1.0}><rect x={-220} y={-80} width={90} height={80} fill="#7a5a3a" /><circle cx={-190} cy={-96} r={20} fill="#d84a6a" /><circle cx={-160} cy={-100} r={18} fill="#e46a8a" /></Casa></g>
        {vec > 0 && Array.from({ length: 6 }, (_, i) => { const u = ((t - m.vecino) * 0.5 + i / 6) % 1; return <circle key={i} cx={lerp(1080, 930, u)} cy={720 + 30 * Math.sin(i)} r={10} fill={H2O} />; })}
        {/* barranco detrás */}
        <g opacity={bar}><path d="M150,860 L150,640 C 250,600 330,620 440,650 L440,860 Z" fill="#6d4a2c" />{Array.from({ length: 5 }, (_, i) => { const u = ((t - m.barranco) * 0.5 + i / 5) % 1; return <circle key={i} cx={lerp(400, 470, u)} cy={760 + 18 * i - 40} r={9} fill={H2O} />; })}</g>
        <rect x={100} y={860} width={1720} height={20} fill="#4a3624" />
      </Svg>
      <Lbl t={t} at={a + 0.5} out={m.vecino - 0.2} text="no es tuya" x={960} y={180} col={C.red} size={88} />
      <Lbl t={t} at={m.vecino + 0.2} out={m.mil - 0.2} text="viene de al lado" x={960} y={180} col={H2O} size={80} />
      {t > m.mil && <Pop t={t} at={m.mil} x={1580} y={300}><Big size={150} col={C.honey}>×{Math.round(1 + 999 * mil)}</Big></Pop>}
      <Lbl t={t} at={m.mil + 0.6} text="manos de pintura" x={1580} y={420} col={C.cream} size={46} />
    </>
  );
};

// 3 · no existe «la humedad»: tres paredes iguales que, al nombrarlas, muestran tres firmas distintas
export const TresHumedades: React.FC<FxP> = ({ t, a, m }) => {
  const nom = ["condensación", "capilar", "lateral"], X = [380, 960, 1540];
  return (
    <>
      <Svg>
        {X.map((x, i) => { const at0 = a + 1 + i * 1.3, k = e(t, at0, at0 + 1.2); return (
          <g key={i} transform={`translate(${x - 230},${300 + (1 - spr(t, a + 0.2 + i * 0.25)) * 300})`}>
            <rect x={0} y={0} width={460} height={480} fill="#ece6d8" stroke="#8d887e" strokeWidth={3} />
            {i === 0 && Array.from({ length: 22 }, (_, j) => <circle key={j} cx={20 + 140 * hash(j, 1) + (j % 2 ? 300 : 0)} cy={20 + 120 * hash(j, 2)} r={3 + 6 * hash(j, 3)} fill="#2c2c2a" opacity={k} />)}
            {i === 1 && <><rect x={0} y={480 - 200 * k} width={460} height={200 * k} fill="rgba(58,74,82,.5)" /><line x1={0} y1={480 - 200 * k} x2={460} y2={480 - 200 * k} stroke={C.honey} strokeWidth={5} strokeDasharray="14 10" /></>}
            {i === 2 && <Mancha cx={330} cy={240} rx={120} ry={160} k={k} seed={21} />}
          </g>); })}
      </Svg>
      {X.map((x, i) => <Lbl key={i} t={t} at={a + 1.2 + i * 1.3} text={nom[i]} x={x} y={860} col={i === 2 ? C.honey : C.cream} size={56} />)}
      <Lbl t={t} at={m.tir} text="tres remedios distintos" x={960} y={200} col={C.sun} size={70} />
    </>
  );
};

// 4 · condensación: el vapor de la casa (pava, ducha, respiración) viaja a la pared más fría y se vuelve gotas;
// los puntitos negros aparecen en las esquinas de arriba; al final, la ventana abierta y la estufa lo resuelven
export const CondensaAire: React.FC<FxP> = ({ t, a, m }) => {
  const neg = e(t, m.negras, m.negras + 2), arr = e(t, m.arr, m.arr + 1.2);
  return (
    <>
      <Svg>
        <Muro x={1100} y={180} w={520} h={680} pint="#e4ecef">
          {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={1120 + 480 * hash(i, 4)} cy={220 + 600 * hash(i, 5)} r={4 + 5 * hash(i, 6)} fill="rgba(160,210,240,.9)" opacity={e(t, m.resp + i * 0.08, m.resp + 1 + i * 0.08) * (1 - arr * 0.9)} />)}
          {Array.from({ length: 26 }, (_, i) => <circle key={"n" + i} cx={(i % 2 ? 1130 : 1500) + 110 * hash(i, 7)} cy={200 + 130 * hash(i, 8)} r={3 + 7 * hash(i, 9)} fill="#252523" opacity={neg * (1 - arr * 0.8)} />)}
        </Muro>
        {/* fuentes de vapor */}
        {[[360, 760, "pava"], [600, 760, "ducha"], [840, 760, "gente"]].map(([x, y], i) => <g key={i} opacity={e(t, m.resp + i * 0.4, m.resp + i * 0.4 + 0.5)}>
          {i === 0 && <g transform={`translate(${x},${y})`}><ellipse cx={0} cy={0} rx={80} ry={60} fill="#b9bec4" /><rect x={60} y={-30} width={60} height={14} rx={7} fill="#b9bec4" transform="rotate(-30 60 -30)" /></g>}
          {i === 1 && <g transform={`translate(${x},${(y as number) - 200})`}><circle r={44} fill="#c9ccd0" />{Array.from({ length: 6 }, (_, j) => <line key={j} x1={-30 + 12 * j} y1={40} x2={-40 + 14 * j} y2={200} stroke={H2O} strokeWidth={4} opacity={0.6} />)}</g>}
          {i === 2 && <g transform={`translate(${x},${y})`}><circle cx={0} cy={-170} r={46} fill="#d7a77a" /><path d="M-70,0 C -70,-90 70,-90 70,0 Z" fill="#6a7d8e" /></g>}
          {Array.from({ length: 5 }, (_, j) => { const u = ((t - m.resp) * 0.4 + j / 5 + i * 0.13) % 1; return <circle key={j} cx={lerp(x as number, 1110, u)} cy={lerp((y as number) - 140, 300 + 400 * hash(j, i), u)} r={14 + 16 * u} fill="rgba(235,245,255,.5)" opacity={(1 - u) * (1 - arr)} />; })}
        </g>)}
      </Svg>
      <Lbl t={t} at={a + 0.6} out={m.negras - 0.2} text="viene del aire de adentro" x={640} y={180} col={C.solv} size={62} />
      <Lbl t={t} at={m.negras + 0.4} out={m.arr - 0.2} text="puntitos negros arriba" x={640} y={180} col={C.cream} size={62} />
      <Lbl t={t} at={m.arr + 0.3} text="ventilación y calor" x={640} y={180} col={C.ok} size={70} />
      {arr > 0.5 && <Cross t={t} at={m.arr + 1.4} x={1360} y={980} r={36} />}
      <Lbl t={t} at={m.arr + 1.4} text="impermeabilizante" x={1360} y={900} col={C.red} size={44} />
    </>
  );
};

// 5 · capilar: el terrón de azúcar apoyado en el café se tiñe de abajo hacia arriba; se convierte en la pared y la
// línea pareja frena cerca del metro; abajo, el salitre
export const TerronCafe: React.FC<FxP> = ({ t, a, m }) => {
  const caf = e(t, m.cafe + 0.4, m.cafe + 3), muro = e(t, m.linea - 0.4, m.linea + 0.6), sube = e(t, m.linea, m.metro + 1);
  return (
    <>
      <Svg>
        <g opacity={1 - muro}>
          <ellipse cx={960} cy={760} rx={300} ry={70} fill="#efe9dc" /><path d="M700,620 L760,760 L1160,760 L1220,620 Z" fill="#f4efe4" stroke="#a49d8e" strokeWidth={4} />
          <ellipse cx={960} cy={620} rx={260} ry={54} fill="#4a2a14" />
          <g transform="translate(960,560)"><rect x={-90} y={-180} width={180} height={180} fill="#fbf8f0" stroke="#d8d2c4" strokeWidth={3} /><rect x={-90} y={-180 * caf} width={180} height={180 * caf} fill="#7a4a24" opacity={0.85} />{Array.from({ length: 30 }, (_, i) => <rect key={i} x={-86 + 166 * hash(i, 1)} y={-176 + 166 * hash(i, 2)} width={10} height={10} fill="rgba(255,255,255,.5)" />)}</g>
        </g>
        <g opacity={muro}>
          <Muro x={420} y={200} w={1080} h={640}>
            <rect x={420} y={840 - 46 - 300 * sube} width={1080} height={300 * sube} fill="rgba(58,74,82,.5)" />
            <line x1={420} y1={794 - 300 * sube} x2={1500} y2={794 - 300 * sube} stroke={C.honey} strokeWidth={6} strokeDasharray="18 10" />
            <Salitre x={430} y={792} w={1060} k={e(t, m.sal, m.sal + 1.2)} />
          </Muro>
          {/* regla */}
          <g transform="translate(1640,794)"><rect x={-16} y={-560} width={32} height={560} fill="#f2d14a" stroke="#6b5a1a" strokeWidth={3} />{[0, 1, 2].map((k) => <g key={k}><line x1={-16} y1={-k * 250} x2={30} y2={-k * 250} stroke="#2b241b" strokeWidth={4} /><text x={44} y={-k * 250 + 12} fontSize={34} fontWeight={800} fill={C.ink} fontFamily="Barlow Condensed">{k} m</text></g>)}</g>
        </g>
      </Svg>
      <Lbl t={t} at={m.cafe + 0.3} out={m.linea - 0.4} text="sube por los poros" x={960} y={200} col={C.honey} size={70} />
      <Lbl t={t} at={m.metro} out={m.sal - 0.1} text="pareja, hasta 1,20 m" x={960} y={130} col={C.honey} size={66} />
      <Lbl t={t} at={m.sal + 0.3} text="salitre en el zócalo" x={960} y={130} col={C.cream} size={66} />
    </>
  );
};

// 6 · lateral: el muro en corte; del otro lado aparecen, de a uno, la tierra, la jardinera, la canaleta y el patio alto;
// cada uno empuja agua de costado que cruza el ladrillo
export const LateralEntra: React.FC<FxP> = ({ t, a, m }) => {
  const src = [["tierra", m.tierra], ["jard", m.jard], ["canal", m.canal], ["patio", m.patio]] as [string, number][];
  const act = src.filter(([, v]) => t > v).length;
  return (
    <>
      <Svg>
        <Corte t={t} x={620} y={220} w={420} h={620} agua={cl(act / 2)} />
        <rect x={240} y={220} width={380} height={620} fill="rgba(255,236,200,.06)" />
        {t > m.tierra && <path d={`M1040,${840 - 360 * e(t, m.tierra, m.tierra + 0.6)} C 1200,${800 - 360 * e(t, m.tierra, m.tierra + 0.6)} 1500,${830 - 380 * e(t, m.tierra, m.tierra + 0.6)} 1760,${820 - 400 * e(t, m.tierra, m.tierra + 0.6)} L1760,840 L1040,840 Z`} fill="#6d4a2c" opacity={t < m.jard ? 1 : 0.35} />}
        {t > m.jard && t < m.canal + 0.2 && <g transform={`translate(1240,${840 - 200 * spr(t, m.jard)})`}><rect x={-160} y={0} width={320} height={200} fill="#9b4b2c" /><rect x={-150} y={-10} width={300} height={30} fill="#5b3c24" />{[-90, 0, 90].map((x) => <g key={x}><line x1={x} y1={-10} x2={x} y2={-90} stroke="#4c8a3c" strokeWidth={8} /><circle cx={x} cy={-100} r={26} fill="#e05a7a" /></g>)}</g>}
        {t > m.canal && t < m.patio + 0.2 && <g transform={`translate(1300,${320 + 60 * (1 - spr(t, m.canal))})`}><rect x={-200} y={-20} width={400} height={40} rx={10} fill="#8f969c" /><rect x={-210} y={0} width={30} height={420} fill="#8f969c" />{Array.from({ length: 6 }, (_, i) => { const u = ((t - m.canal) * 1.2 + i / 6) % 1; return <circle key={i} cx={-195} cy={420 + 60 * u} r={9} fill={H2O} opacity={1 - u} />; })}</g>}
        {t > m.patio && <g transform={`translate(0,${80 * (1 - spr(t, m.patio))})`}><rect x={1040} y={560} width={720} height={280} fill="#9c968c" /><rect x={1040} y={560} width={720} height={20} fill="#c3bdb2" /><ellipse cx={1250} cy={575} rx={140} ry={12} fill={H2O} opacity={0.7} /></g>}
        <rect x={160} y={840} width={1640} height={16} fill="#4a3624" />
      </Svg>
      <Lbl t={t} at={a + 0.4} out={m.tierra - 0.1} text="entra de costado" x={960} y={140} col={C.honey} size={76} />
      {src.map(([k, v], i) => <Lbl key={k} t={t} at={v + 0.2} out={(src[i + 1]?.[1] ?? 1e9) - 0.1} text={["la tierra del barranco", "la jardinera del vecino", "su canaleta", "su patio más alto"][i]} x={1400} y={140} col={C.cream} size={58} />)}
      <Lbl t={t} at={a + 0.8} text="tu cuarto" x={430} y={950} col={C.dim} size={46} />
    </>
  );
};

// 7 · no respeta alturas: regla de 2 m; la capilar dibuja su línea a 1,20 m; la lateral aparece como manchas a 40 cm
// y a 1,80 m. Al final, de las cuatro paredes del cuarto (planta), sólo la medianera está manchada
export const SinAlturas: React.FC<FxP> = ({ t, a, m }) => {
  const plano = e(t, m.pista - 1.6, m.pista - 0.6), y0 = 860, px = (cm: number) => y0 - cm * 3.1;
  return (
    <>
      <Svg>
        <g opacity={1 - plano}>
          <Muro x={420} y={220} w={980} h={640} pint="#efe9dc">
            <line x1={420} y1={px(120)} x2={1400} y2={px(120)} stroke={C.honey} strokeWidth={5} strokeDasharray="16 10" opacity={0.6} />
            <Mancha cx={640} cy={px(40)} rx={110} ry={80} k={e(t, m.cuarenta, m.cuarenta + 0.8)} seed={31} />
            <Mancha cx={1150} cy={px(180)} rx={130} ry={90} k={e(t, m.cuarenta + 1, m.cuarenta + 1.8)} seed={33} />
          </Muro>
          <g transform={`translate(1520,${y0})`}><rect x={-16} y={-620} width={32} height={620} fill="#f2d14a" stroke="#6b5a1a" strokeWidth={3} />{[40, 120, 180].map((cm) => <g key={cm}><line x1={-16} y1={-cm * 3.1} x2={36} y2={-cm * 3.1} stroke="#2b241b" strokeWidth={4} /><text x={48} y={-cm * 3.1 + 12} fontSize={34} fontWeight={800} fill={C.ink} fontFamily="Barlow Condensed">{cm} cm</text></g>)}</g>
        </g>
        {plano > 0 && <g opacity={plano} transform={`translate(960,560) scale(${0.9 + 0.1 * plano})`}>
          <rect x={-320} y={-260} width={640} height={520} fill="#e8e0cf" stroke="#5e5547" strokeWidth={22} />
          <line x1={320} y1={-260} x2={320} y2={260} stroke={C.red} strokeWidth={30} />
          <rect x={340} y={-260} width={260} height={520} fill="rgba(110,140,90,.35)" />
          <text x={470} y={10} textAnchor="middle" fontSize={40} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">VECINO</text>
        </g>}
      </Svg>
      <Lbl t={t} at={m.cuarenta + 0.3} out={m.mancha - 0.1} text="a 40 cm o a 1,80 m" x={910} y={130} col={C.cream} size={64} />
      <Lbl t={t} at={m.mancha + 0.2} out={m.pista - 1.6} text="mancha, no línea" x={910} y={130} col={C.honey} size={70} />
      <Lbl t={t} at={m.pista - 0.4} text="sólo la medianera" x={960} y={930} col={C.red} size={70} />
    </>
  );
};

// 8 · la prueba del aluminio: el cuadrado brilla, la cinta lo sella por los cuatro lados, un reloj da dos vueltas
// (48 h), el aluminio se despega y gira: la cara de afuera con gotas = condensación; la de adentro mojada = el muro
export const AluminioDosCaras: React.FC<FxP> = ({ t, a, m }) => {
  const cinta = e(t, m.cinta, m.cinta + 1.6), rel = e(t, m.olvidas, m.olvidas + 3), des = e(t, m.despega, m.despega + 1.2);
  const fase = t < m.afuera ? 0 : t < m.adentro ? 1 : t < m.dos ? 2 : 3;
  const flip = fase === 2 ? e(t, m.adentro, m.adentro + 0.8) : 0, sx = Math.cos(Math.PI * flip);
  const gotas = (n: number, s: number) => Array.from({ length: n }, (_, i) => <circle key={i} cx={-150 + 300 * hash(i, s)} cy={-150 + 300 * hash(i, s + 1)} r={6 + 8 * hash(i, s + 2)} fill="rgba(170,215,245,.95)" stroke="#fff" strokeWidth={2} />);
  return (
    <>
      <Svg>
        <Muro x={300} y={160} w={820} h={720}><Mancha cx={700} cy={500} rx={260} ry={220} k={0.9} seed={41} /></Muro>
        <g transform={`translate(${lerp(700, 1300, des)},${lerp(500, 520, des)}) rotate(${-8 * des}) scale(${(fase >= 1 ? sx : 1) * (1 + 0.15 * des)},${1 + 0.15 * des})`}>
          <rect x={-170} y={-170} width={340} height={340} fill={fase === 2 && sx < 0 ? "#b7c0c6" : "#d6dde2"} stroke="#9aa4ab" strokeWidth={3} />
          {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${-170 + i * 45},-170 L${-130 + i * 45},170`} stroke="rgba(255,255,255,.35)" strokeWidth={6} />)}
          {cinta > 0 && des < 0.2 && [0, 1, 2, 3].map((k) => <rect key={k} x={-190} y={-200} width={380 * cl(cinta * 4 - k)} height={50} fill="rgba(214,170,90,.75)" transform={`rotate(${k * 90})`} />)}
          {fase === 1 && gotas(16, 3)}
          {fase === 2 && sx < 0 && <g transform="scale(-1,1)"><rect x={-170} y={-170} width={340} height={340} fill="rgba(58,74,82,.45)" />{gotas(10, 7)}</g>}
          {fase === 3 && <>{gotas(12, 9)}<rect x={-170} y={-170} width={340} height={340} fill="rgba(58,74,82,.25)" /></>}
        </g>
        {rel > 0 && des < 0.5 && <g opacity={1 - des * 2}><Reloj x={1450} y={420} r={150} k={2 * rel} /></g>}
      </Svg>
      <Lbl t={t} at={m.olvidas + 0.3} out={m.despega} text="48 horas" x={1450} y={660} col={C.honey} size={80} />
      <Lbl t={t} at={m.afuera + 0.4} out={m.adentro - 0.1} text="afuera: condensación" x={1300} y={880} col={C.solv} size={62} />
      <Lbl t={t} at={m.adentro + 0.8} out={m.dos - 0.1} text="adentro: viene del muro" x={1300} y={880} col={C.honey} size={62} />
      <Lbl t={t} at={m.dos + 0.3} text="las dos: las dos cosas" x={1300} y={880} col={C.cream} size={62} />
    </>
  );
};

// 9 · Ituzaingó: dos impermeabilizaciones tachadas (dos facturas), el aluminio empapado por afuera y el culpable:
// el calefactor sin salida que llena el cuarto de vapor
export const CalefactorCulpa: React.FC<FxP> = ({ t, a, m }) => {
  const cal = e(t, m.calef, m.calef + 1);
  return (
    <>
      <Svg>
        {[0, 1].map((i) => <g key={i} transform={`translate(${380 + i * 70},${360 + i * 40}) rotate(${-6 + i * 8})`} opacity={1 - cal * 0.7}><rect x={-150} y={-190} width={300} height={380} fill="#f6f1e6" stroke="#8d887e" strokeWidth={3} />{[0, 1, 2, 3, 4].map((k) => <rect key={k} x={-110} y={-140 + k * 50} width={220 * (0.5 + 0.5 * hash(k, i))} height={14} fill="#c9c2b2" />)}<text x={0} y={150} textAnchor="middle" fontSize={56} fontWeight={800} fill="#2b241b" fontFamily="Barlow Condensed">$$$</text></g>)}
        <Cross t={t} at={a + 1.2} x={420} y={380} r={60} />
        <g transform={`translate(960,${520 + 30 * (1 - spr(t, m.emp))})`} opacity={e(t, m.emp, m.emp + 0.4) * (1 - cal * 0.6)}>
          <rect x={-150} y={-150} width={300} height={300} fill="#d6dde2" stroke="#9aa4ab" strokeWidth={3} />
          {Array.from({ length: 20 }, (_, i) => <circle key={i} cx={-130 + 260 * hash(i, 51)} cy={-130 + 260 * hash(i, 52)} r={7 + 7 * hash(i, 53)} fill="rgba(170,215,245,.95)" />)}
        </g>
        <g transform={`translate(1460,${600 + 200 * (1 - spr(t, m.calef))})`} opacity={cal}>
          <rect x={-160} y={-200} width={320} height={300} rx={20} fill="#7b7f86" stroke="#34373b" strokeWidth={5} />
          {[0, 1, 2, 3].map((k) => <rect key={k} x={-130} y={-170 + k * 60} width={260} height={30} rx={15} fill="#ff6a2a" opacity={0.7 + 0.3 * Math.sin(t * 5 + k)} />)}
          {Array.from({ length: 8 }, (_, i) => { const u = ((t - m.calef) * 0.35 + i / 8) % 1; return <circle key={i} cx={-100 + 200 * hash(i, 61) - 300 * u} cy={-220 - 260 * u} r={20 + 40 * u} fill="rgba(230,240,250,.5)" opacity={1 - u} />; })}
        </g>
      </Svg>
      <Lbl t={t} at={a + 1.4} out={m.calef} text="dos impermeabilizaciones" x={560} y={830} col={C.red} size={54} />
      <Lbl t={t} at={m.emp + 0.5} out={m.calef} text="empapada por afuera" x={960} y={180} col={C.solv} size={64} />
      <Lbl t={t} at={m.calef + 0.6} text="calefactor sin salida" x={1460} y={880} col={C.honey} size={60} />
      <Lbl t={t} at={m.calef + 1.6} text="no era el vecino" x={760} y={180} col={C.ok} size={70} />
    </>
  );
};

// 10 · la prueba de la línea: el lápiz marca un punto cada 50 cm; los puntos se unen. Primero una pared capilar
// (línea derecha → regla), después la del vecino (curva que sube en la esquina → foco en ese punto)
export const LineaPuntos: React.FC<FxP> = ({ t, a, m }) => {
  const n = 9, X = (i: number) => 380 + i * 145;
  const hor = t > m.hor && t < m.irr, irr = t >= m.irr;
  const Y = (i: number) => irr ? 720 - 260 * Math.exp(-Math.pow((i - 6.5) / 1.6, 2)) - 40 * hash(i, 71) : 560 + 10 * Math.sin(i * 1.7);
  const pts = Array.from({ length: n }, (_, i) => [X(i), Y(i)]), unir = e(t, irr ? m.irr + 0.4 : m.unis, (irr ? m.irr + 0.4 : m.unis) + 1.6);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  return (
    <>
      <Svg>
        <Muro x={300} y={200} w={1320} h={660}>
          {irr && <Mancha cx={X(6.5)} cy={600} rx={200} ry={200} k={e(t, m.irr, m.irr + 1)} seed={73} />}
          {hor && <rect x={300} y={560} width={1320} height={254} fill="rgba(58,74,82,.42)" />}
          {pts.map(([x, y], i) => { const at0 = (irr ? m.irr : a + 0.5) + i * 0.18; return t > at0 ? <circle key={i} cx={x} cy={y} r={11 * spr(t, at0, 1.4)} fill="#2b241b" /> : null; })}
          <Draw d={d} p={unir} col={irr ? C.red : C.honey} w={7} glow />
        </Muro>
        {hor && <Tick t={t} at={m.hor + 1} x={1520} y={470} r={42} />}
        {irr && <circle cx={X(6.5)} cy={460} r={120 * spr(t, m.irr + 2.2)} fill="none" stroke={C.sun} strokeWidth={6} />}
      </Svg>
      <Lbl t={t} at={a + 0.4} out={m.unis} text="un punto cada 50 cm" x={960} y={130} col={C.cream} size={62} />
      <Lbl t={t} at={m.hor + 0.4} out={m.irr} text="pareja: capilar" x={960} y={130} col={C.honey} size={72} />
      <Lbl t={t} at={m.irr + 1.8} text="irregular: lateral" x={960} y={130} col={C.red} size={72} />
    </>
  );
};

// 11 · el diario de la mancha: catorce días en tira; tres lluvias caen y dos o tres días después la barra de la mancha
// sube; la capilar (línea gris) queda igual todo el tiempo
export const DiarioLluvia: React.FC<FxP> = ({ t, a, m }) => {
  const L = [2, 8, 11], N = 14, X = (i: number) => 330 + i * 92;
  const val = (i: number) => { let v = 0.25; for (const l of L) { const d = i - l; if (d >= 1 && d <= 5) v += 0.6 * Math.exp(-Math.pow(d - 2.5, 2) / 2); } return Math.min(1, v); };
  const k = e(t, a + 0.6, m.anota + 4);
  return (
    <>
      <Svg>
        <rect x={290} y={260} width={1340} height={600} rx={24} fill="#f6f1e6" stroke="#8d887e" strokeWidth={3} />
        {Array.from({ length: N }, (_, i) => { const on = k * N > i; return <g key={i}>
          <text x={X(i)} y={830} textAnchor="middle" fontSize={30} fontWeight={700} fill="#5e5547" fontFamily="Barlow">{i + 1}</text>
          {on && <rect x={X(i) - 30} y={790 - 420 * val(i) * spr(t, a + 0.6 + i * 0.25)} width={60} height={420 * val(i) * spr(t, a + 0.6 + i * 0.25)} rx={8} fill={val(i) > 0.5 ? "#4f6a78" : "#8aa0ab"} />}
          {on && L.includes(i) && <Nube t={t} x={X(i)} y={330} s={0.38} k={1} />}
        </g>; })}
        <line x1={300} y1={790 - 420 * 0.3} x2={1620} y2={790 - 420 * 0.3} stroke="#9a9488" strokeWidth={5} strokeDasharray="14 10" opacity={e(t, m.lat - 1, m.lat)} />
      </Svg>
      <Lbl t={t} at={m.lat + 0.3} text="2 o 3 días después de llover" x={960} y={170} col={C.honey} size={60} />
      <Lbl t={t} at={m.anota + 0.3} text="dos semanas, en un papel" x={960} y={960} col={C.cream} size={56} />
    </>
  );
};

// 12 · la pared enterrada: corte de la casa en la ladera; la tierra mojada empuja contra la cocina y la mancha del
// lado de adentro llega exactamente a la altura de la tierra (una línea punteada une las dos)
export const ParedEnterrada: React.FC<FxP> = ({ t, a, m }) => {
  const nivel = 560, tierra = e(t, a + 0.4, a + 1.6), moj = e(t, m.esponja, m.esponja + 2), lin = e(t, m.altura, m.altura + 1);
  return (
    <>
      <Svg>
        <path d={`M1000,${900} L1000,${lerp(900, nivel, tierra)} C 1250,${lerp(900, nivel - 60, tierra)} 1500,${lerp(900, nivel - 160, tierra)} 1800,${lerp(900, nivel - 220, tierra)} L1800,900 Z`} fill={moj > 0 ? `rgb(${lerp(109, 70, moj)},${lerp(74, 62, moj)},${lerp(44, 48, moj)})` : "#6d4a2c"} />
        {moj > 0 && Array.from({ length: 14 }, (_, i) => { const u = ((t - m.esponja) * 0.4 + i / 14) % 1; return <circle key={i} cx={lerp(1500, 1010, u)} cy={nivel + 30 + 300 * hash(i, 81)} r={8} fill={H2O} opacity={0.9} />; })}
        <rect x={960} y={300} width={40} height={600} fill="#8e4626" />
        <rect x={420} y={300} width={540} height={600} fill="#e9dfca" stroke="#6b5a44" strokeWidth={5} />
        <path d="M380,300 L700,140 L1040,300" fill="none" stroke="#8e4626" strokeWidth={22} />
        <rect x={430} y={nivel} width={530} height={340} fill="rgba(58,74,82,.5)" opacity={moj} />
        <line x1={420} y1={nivel} x2={1300} y2={nivel} stroke={C.sun} strokeWidth={5} strokeDasharray="16 10" opacity={lin} />
        <rect x={360} y={900} width={1460} height={14} fill="#4a3624" />
      </Svg>
      <Lbl t={t} at={a + 0.6} out={m.esponja} text="del otro lado: tierra" x={1400} y={260} col={C.cream} size={58} />
      <Lbl t={t} at={m.esponja + 0.3} out={m.altura} text="la atraviesa como esponja" x={960} y={140} col={H2O} size={62} />
      <Lbl t={t} at={m.altura + 0.6} text="la misma altura" x={960} y={140} col={C.sun} size={72} />
    </>
  );
};
