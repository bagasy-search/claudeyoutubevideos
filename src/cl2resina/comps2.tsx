// cl2resina · componentes del punto a las capas (los tres puntos, la gota, el reposo, los tres vasitos, la etiqueta, la madera,
// la primera mano, la piel que atrapa, las horas, la pasada, el brillo, la lija al agua, el color).
import React from "react";
import { C, FONT, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Big, Cross, Draw, FxP, Pop, Svg, Tick, Txt, glass, num, shake } from "./kit";
import { Vaso, Telgo } from "./comps1";

// palito con chorro: visc 0 = hilo fino y rápido, 0.5 = cinta que se dobla, 1 = bola que no cae
const Chorro: React.FC<{ t: number; x: number; v: number; o: number }> = ({ t, x, v, o }) => {
  const len = v < 0.9 ? lerp(380, 260, v) : 40, w = lerp(4, 22, v), fold = v > 0.3 && v < 0.9;
  return (
    <g opacity={o}>
      <rect x={x - 14} y={150} width={28} height={230} rx={8} fill="#d9c08f" stroke="#7a5b2a" strokeWidth={3} />
      {v >= 0.9 ? <ellipse cx={x} cy={392} rx={40} ry={34 + 4 * Math.sin(t * 2)} fill="rgba(240,169,58,.9)" /> : <path d={`M${x},380 L${x},${380 + len}`} stroke="rgba(240,169,58,.85)" strokeWidth={w} strokeLinecap="round" />}
      {fold && Array.from({ length: 4 }, (_, i) => <path key={i} d={`M${x - 30},${380 + len + i * 12 - ((t * 20) % 12)} q 30,${-14} 60,0`} stroke="rgba(240,169,58,.85)" strokeWidth={w * 0.8} fill="none" />)}
      {!fold && v < 0.3 && <ellipse cx={x} cy={380 + len + 6} rx={50} ry={8} fill="rgba(240,169,58,.4)" />}
    </g>
  );
};

// 21 · los tres puntos: tres palitos, tres chorros distintos; debajo, para qué sirve cada uno
export const TresChorros: React.FC<FxP> = ({ t, a, m }) => {
  const P3 = [{ x: 420, at: m.ace, v: 0.05, lab: "aceite", uso: "barniz" }, { x: 960, at: m.miel, v: 0.55, lab: "miel", uso: "brillo" }, { x: 1500, at: m.dulce, v: 1, lab: "dulce de leche", uso: "pegamento" }];
  return (
    <>
      <Svg>{P3.map((q, i) => <Chorro key={i} t={t} x={q.x} v={q.v} o={cl((t - Math.min(q.at, a + 0.4 + i * 0.4)) * 3)} />)}</Svg>
      {P3.map((q, i) => <Lbl key={i} t={t} at={Math.min(q.at, a + 0.5 + i * 0.4)} text={q.lab} x={q.x} y={860} col={i === 1 ? C.honey : C.cream} size={60} />)}
      {P3.map((q, i) => <Lbl key={"u" + i} t={t} at={q.at + 1.2} text={q.uso} x={q.x} y={950} col={C.ok} size={46} />)}
    </>
  );
};

// 22 · la gota que no se expande: de costado sobre un vidrio; la primera se abre chata, la buena queda alta; la serie sube
export const GotaExpande: React.FC<FxP> = ({ t, a, m }) => {
  const drop = (x: number, h: number, w: number, o: number, col = "rgba(240,169,58,.8)") => <path d={`M${x - w},600 C ${x - w},${600 - h} ${x + w},${600 - h} ${x + w},600 Z`} fill={col} opacity={o} />;
  const ab = e(t, m.abre, m.abre + 1), rd = spr(t, m.redonda, 0.9), se = m.serie;
  return (
    <>
      <Svg>
        <rect x={180} y={600} width={1560} height={26} rx={6} fill="rgba(220,240,255,.25)" stroke={C.edge} strokeWidth={3} />
        <g opacity={cl((t - a) * 3) * (t < se ? 1 : 0.35)}>
          {drop(560, lerp(110, 26, ab), lerp(60, 200, ab), 1, "rgba(240,190,110,.6)")}
          {t > m.redonda - 0.2 && drop(1300, 130 * rd, 90, 1)}
        </g>
        {t >= se && [0, 1, 2, 3, 4, 5].map((i) => drop(330 + i * 255, lerp(22, 130, i / 5) * spr(t, se + i * 0.35, 1.2), lerp(190, 90, i / 5), 1))}
      </Svg>
      {t < se && <Cross t={t} at={m.abre + 1} x={560} y={400} r={46} />}
      {t < se && <Tick t={t} at={m.redonda + 0.7} x={1300} y={380} r={46} />}
      <Lbl t={t} at={m.abre + 0.4} out={se} text="se abre: le falta" x={560} y={760} col={C.red} size={52} />
      <Lbl t={t} at={m.redonda + 0.5} out={se} text="redonda: llegaste" x={1300} y={760} col={C.ok} size={52} />
      <Lbl t={t} at={se + 0.6} text="cada vez más paradita" x={960} y={780} col={C.honey} size={60} />
      <Lbl t={t} at={a + 0.3} text="la gota en un vidrio" x={960} y={220} col={C.cream} size={56} />
    </>
  );
};

// 23 · por qué sale blanca: las burbujas suben y el frasco se aclara de abajo para arriba; el almanaque pasa tres días
export const BurbujasSuben: React.FC<FxP> = ({ t, a, m }) => {
  const cl3 = e(t, m.dias, m.dias + 3), d = Math.min(3, Math.floor(e(t, m.dias, m.dias + 3) * 3.99));
  return (
    <>
      <Svg>
        <defs><linearGradient id="lech" x1="0" y1="1" x2="0" y2="0"><stop offset={0} stopColor="#ece8de" stopOpacity={0} /><stop offset={cl(cl3)} stopColor="#ece8de" stopOpacity={0} /><stop offset={cl(cl3 + 0.1)} stopColor="#ece8de" stopOpacity={0.9} /><stop offset={1} stopColor="#ece8de" stopOpacity={0.9} /></linearGradient></defs>
        <Vaso x={760} y={880} w={420} h={560} lv={0.75} liq="rgba(240,169,58,.55)" lid />
        <rect x={550} y={460} width={420} height={420} fill="url(#lech)" />
        {Array.from({ length: 36 }, (_, i) => { const u = ((t - a) * (0.1 + 0.15 * hash(i, 1)) + hash(i, 2)) % 1; return <circle key={i} cx={570 + hash(i, 3) * 380} cy={870 - u * 400} r={2 + 4 * hash(i, 4)} fill="#fff" opacity={(1 - u) * (1 - cl3 * 0.7)} />; })}
        <g transform="translate(1400,560)" opacity={cl((t - m.dias) * 3)}><rect x={-150} y={-170} width={300} height={320} rx={16} fill="#f2e3bf" /><rect x={-150} y={-170} width={300} height={70} rx={16} fill={C.red} /><text y={90} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={180} fill="#3a2a16">{d}</text></g>
      </Svg>
      <Lbl t={t} at={m.aire} text="es aire, no falla" x={760} y={300} col={C.milk} size={58} />
      <Lbl t={t} at={m.dias + 0.3} text="días de reposo" x={1400} y={820} col={C.honey} size={52} />
      <Lbl t={t} at={m.bolsa} text="15 días: cristal" x={1400} y={930} col={C.ok} size={52} />
    </>
  );
};

// 24 · los tres vasitos: alcohol, aguarrás y thinner para poliuretano; el mismo pedacito hace tres cosas distintas
export const TresVasitos: React.FC<FxP> = ({ t, a, m }) => {
  const V = [{ x: 480, lab: "alcohol", at: m.alc, res: m.nada }, { x: 960, lab: "aguarrás", at: m.agu, res: m.gom }, { x: 1440, lab: "thinner poliuretano", at: m.thin, res: m.des }];
  const drop = e(t, m.mete, m.mete + 0.8);
  return (
    <>
      <Svg>
        {V.map((q, i) => {
          const r = e(t, q.res, q.res + 1);
          return (
            <g key={i} opacity={cl((t - Math.min(q.at, a + 0.3 + i * 0.3)) * 3)}>
              <Vaso x={q.x} y={820} w={240} h={320} lv={0.6} liq={["rgba(230,240,255,.25)", "rgba(240,220,170,.35)", "rgba(143,211,255,.35)"][i]} />
              {i === 0 && <Telgo x={q.x} y={lerp(440, 620 + 4 * Math.sin(t * 3), drop)} s={70} rot={6 * Math.sin(t * 2)} />}
              {i === 1 && <Telgo x={q.x} y={lerp(440, 640, drop)} s={70 * (1 + 0.25 * r)} sq={1 - 0.3 * r} o={1 - 0.15 * r} />}
              {i === 2 && <Telgo x={q.x} y={lerp(440, 660, drop)} s={70 * (1 - r)} o={1 - r} />}
              {i === 2 && r > 0 && Array.from({ length: 10 }, (_, j) => { const u = ((t - q.res) * 0.8 + hash(j, 1)) % 1; return <circle key={j} cx={q.x - 80 + hash(j, 2) * 160} cy={800 - u * 190} r={3 + 3 * hash(j, 3)} fill="#fff" opacity={1 - u} />; })}
            </g>
          );
        })}
      </Svg>
      {V.map((q, i) => <Lbl key={i} t={t} at={Math.min(q.at, a + 0.4 + i * 0.3)} text={q.lab} x={q.x} y={900} col={C.cream} size={i === 2 ? 42 : 50} />)}
      <Cross t={t} at={m.nada + 0.6} x={480} y={330} r={46} />
      <Lbl t={t} at={m.gom + 0.6} text="gomoso" x={960} y={330} col={C.red} size={56} />
      <Tick t={t} at={m.des + 0.8} x={1440} y={330} r={52} />
    </>
  );
};

// 25 · la palabra: la etiqueta se aclara y aparecen las tres que sirven; abajo, las dos alternativas
export const PalabraEtiqueta: React.FC<FxP> = ({ t, a, m }) => {
  const W3 = ["poliuretano", "universal", "para lacas"];
  return (
    <>
      <Svg><rect x={240} y={200} width={820} height={640} rx={26} fill="#d8cdb3" stroke="#5e584d" strokeWidth={5} opacity={cl(spr(t, a, 1) * 2)} /></Svg>
      <Lbl t={t} at={a + 0.2} text="thinner" x={650} y={290} col="#5e3a1c" size={90} />
      {W3.map((w, i) => <Lbl key={w} t={t} at={a + 0.9 + i * 0.6} text={w} x={650} y={440 + i * 120} col={C.ink} size={70} plate={i === 0 ? C.red : "rgba(94,58,28,.85)"} />)}
      <Pop t={t} at={m.acet} x={1480} y={420}><div style={{ ...glass(), padding: "22px 34px" }}><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 60, color: C.honey, textTransform: "uppercase" }}>acetona pura</div><Txt size={30}>sin aceites</Txt></div></Pop>
      <Pop t={t} at={m.xil} x={1480} y={700}><div style={{ ...glass(), padding: "22px 34px" }}><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 60, color: C.honey, textTransform: "uppercase" }}>xilol</div><Txt size={30}>ferretería de barrio</Txt></div></Pop>
    </>
  );
};

// 26 · lijar a favor de la veta: la lija va y viene sobre las vetas (bien) y después en redondo deja rayas (mal)
export const LijaVeta: React.FC<FxP> = ({ t, a, m }) => {
  const r = e(t, m.red, m.red + 0.4), lx = 960 + 380 * Math.sin((t - a) * 3) * (1 - r), ang = (t - m.red) * 5;
  return (
    <>
      <Svg>
        <rect x={220} y={320} width={1480} height={440} rx={14} fill="#c08a52" />
        {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M220,${340 + i * 30} C 700,${330 + i * 31} 1200,${352 + i * 29} 1700,${340 + i * 30}`} stroke="#8d5a2c" strokeWidth={3} fill="none" opacity={0.6} />)}
        {r > 0 && Array.from({ length: 9 }, (_, i) => <circle key={i} cx={1300 + 20 * Math.cos(i)} cy={540 + 14 * Math.sin(i)} r={40 + i * 9} stroke="rgba(60,30,10,.5)" strokeWidth={2} fill="none" opacity={e(t, m.red + 0.3 + i * 0.1, m.red + 0.5 + i * 0.1)} />)}
        <g transform={r < 0.5 ? `translate(${lx},540)` : `translate(${1300 + 90 * Math.cos(ang)},${540 + 60 * Math.sin(ang)})`}><rect x={-110} y={-60} width={220} height={120} rx={14} fill="#3a7bd5" stroke="#173a6a" strokeWidth={4} /></g>
      </Svg>
      <Lbl t={t} at={a + 0.4} text="a favor de la veta" x={700} y={860} col={C.ok} size={56} />
      <Lbl t={t} at={m.grano} text="mediana, después fina" x={700} y={230} col={C.cream} size={50} align="center" />
      <Lbl t={t} at={m.red + 0.5} text="nunca en redondo" x={1300} y={860} col={C.red} size={56} />
    </>
  );
};

// 27 · el pelito: a la lupa, las fibras de la madera se paran con el agua; con el trapo con disolvente quedan acostadas
export const PelitoLevanta: React.FC<FxP> = ({ t, a, m }) => {
  const up = e(t, a + 0.8, a + 2.2), sv = e(t, m.solv, m.solv + 1.2);
  const fibras = (x: number, k: number) => Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${x - 280 + i * 36},640 q ${10 - 20 * hash(i, 1)},${-20 - 70 * k} ${20 - 40 * hash(i, 2)},${-30 - 110 * k}`} stroke="#8d5a2c" strokeWidth={6} fill="none" strokeLinecap="round" />);
  return (
    <>
      <Svg>
        <circle cx={560} cy={560} r={330} fill="#c08a52" stroke="#e9e2d2" strokeWidth={14} />{fibras(560, up)}
        <ellipse cx={560} cy={660} rx={260} ry={20} fill={C.water} opacity={0.45 * up} />
        <g opacity={cl(sv * 2)}><circle cx={1360} cy={560} r={330} fill="#c08a52" stroke="#e9e2d2" strokeWidth={14} />{fibras(1360, 0.04)}</g>
      </Svg>
      <Lbl t={t} at={a + 1.4} text="con agua: se para" x={560} y={960} col={C.red} size={52} />
      <Lbl t={t} at={m.solv + 0.6} text="con disolvente: acostado" x={1360} y={960} col={C.ok} size={50} />
    </>
  );
};

// 28 · la primera mano se mete en los poros: corte de la madera con sus canales; la laca baja y los sella desde adentro
export const PorosSella: React.FC<FxP> = ({ t, a, m }) => {
  const k = e(t, m.pinc, m.pinc + 2.4);
  return (
    <>
      <Svg>
        <rect x={260} y={420} width={1400} height={420} rx={12} fill="#b07a46" />
        {Array.from({ length: 12 }, (_, i) => { const x = 330 + i * 115, d = 160 + 160 * hash(i, 1); return <g key={i}><rect x={x} y={420} width={22} height={d} rx={11} fill="#4b2a10" /><rect x={x} y={420} width={22} height={d * k} rx={11} fill="rgba(240,169,58,.9)" /></g>; })}
        <rect x={260} y={402} width={1400} height={18 * cl(k * 3)} rx={6} fill="rgba(240,169,58,.75)" />
        <g transform={`translate(${lerp(260, 1660, e(t, m.pinc, m.pinc + 1.6))},340)`} opacity={e(t, m.pinc - 0.2, m.pinc) * (1 - e(t, m.pinc + 1.6, m.pinc + 1.9))}><rect x={-30} y={-120} width={60} height={100} rx={8} fill="#7a5b2a" /><path d="M-40,-20 L40,-20 L30,60 L-30,60 Z" fill="#3a2a16" /></g>
      </Svg>
      <Lbl t={t} at={a + 0.4} text="no es para brillo" x={960} y={220} col={C.cream} size={58} />
      <Lbl t={t} at={m.pinc + 1.8} text="sella desde adentro" x={960} y={940} col={C.honey} size={58} />
    </>
  );
};

// 29 · la piel que atrapa: capa gruesa en corte; el disolvente sale, arriba se forma una piel y lo de abajo queda preso
export const PielAtrapa: React.FC<FxP> = ({ t, a, m }) => {
  const pi = e(t, m.piel, m.piel + 1.2), hu = spr(t, m.huella, 1), dent = e(t, m.huella, m.huella + 0.6);
  return (
    <>
      <Svg>
        <rect x={300} y={760} width={1320} height={60} rx={8} fill={C.wood} />
        <path d={`M300,760 L300,520 L${900},520 Q 960,${520 + 60 * dent} 1020,520 L1620,520 L1620,760 Z`} fill="rgba(240,169,58,.55)" />
        <path d={`M300,520 L900,520 Q 960,${520 + 60 * dent} 1020,520 L1620,520`} stroke="#c9781f" strokeWidth={4 + 14 * pi} fill="none" />
        {Array.from({ length: 30 }, (_, i) => { const u = ((t - a) * 0.5 + hash(i, 1)) % 1, x = 340 + hash(i, 2) * 1240, top = 540; const y = 740 - u * 260; const esc = pi < 0.5; return <circle key={i} cx={x + 6 * Math.sin(t * 3 + i)} cy={esc ? y : Math.max(top, y)} r={9} fill={C.solv} opacity={esc ? 1 - u * 0.5 : y < top + 20 ? 1 : 0.85} />; })}
        {hu > 0.01 && <ellipse cx={960} cy={lerp(300, 470 + 50 * dent, cl(hu))} rx={70} ry={48} fill="#e2b48f" stroke="#7a4b2f" strokeWidth={3} />}
      </Svg>
      <Lbl t={t} at={a + 0.4} text="capa gruesa" x={1500} y={430} col={C.cream} size={56} />
      <Lbl t={t} at={m.piel + 0.4} text="arriba, una piel" x={600} y={420} col={C.honey} size={56} />
      <Lbl t={t} at={m.tapa + 0.2} text="abajo, atrapado" x={960} y={920} col={C.red} size={60} />
    </>
  );
};

// 30 · las horas entre capas: un reloj da la vuelta por cada capa fina; verano corto, invierno al otro día; la uña manda
export const RelojCapas: React.FC<FxP> = ({ t, a, m }) => {
  const h = 8 * e(t, m.seis, m.seis + 2.5), une = spr(t, m.una, 1);
  return (
    <>
      <Svg>
        <g transform="translate(620,520)" opacity={cl((t - a) * 3)}>
          <circle r={230} fill="rgba(255,240,214,.08)" stroke={C.honey} strokeWidth={8} />
          <path d={`M0,0 L0,-230 A230,230 0 ${h > 6 ? 1 : 0} 1 ${230 * Math.sin((h / 12) * Math.PI * 2)},${-230 * Math.cos((h / 12) * Math.PI * 2)} Z`} fill="rgba(240,169,58,.35)" />
          <line x1={0} y1={0} x2={150 * Math.sin((h / 12) * Math.PI * 2)} y2={-150 * Math.cos((h / 12) * Math.PI * 2)} stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
        </g>
        {[0, 1, 2].map((i) => <rect key={i} x={1180} y={760 - i * 46} width={480} height={30} rx={6} fill={`rgba(240,169,58,${0.4 + 0.15 * i})`} opacity={e(t, a + 0.6 + i * 0.5, a + 0.9 + i * 0.5)} />)}
        <rect x={1180} y={790} width={480} height={40} rx={6} fill={C.wood} />
        {une > 0.01 && <g transform={`translate(1420,${lerp(400, 600, cl(une))})`}><rect x={-34} y={-90} width={68} height={110} rx={30} fill="#e2b48f" stroke="#7a4b2f" strokeWidth={3} /><rect x={-24} y={-10} width={48} height={26} rx={10} fill="#f6e7d6" /></g>}
      </Svg>
      <Pop t={t} at={m.seis} x={620} y={860}><Big size={96} col={C.honey}>6 a 8 h</Big></Pop>
      <Lbl t={t} at={m.ver} text="verano: 4 h" x={1420} y={260} col={C.sun} size={52} />
      <Lbl t={t} at={m.inv} text="invierno: al otro día" x={1420} y={360} col={C.solv} size={48} />
      <Lbl t={t} at={m.una + 0.5} text="si marca, esperá" x={1420} y={930} col={C.red} size={54} />
    </>
  );
};

// 31 · una sola pasada: vista desde arriba; la buena es una línea de punta a punta; la mala va y vuelve y deja surcos
export const UnaPasada: React.FC<FxP> = ({ t, a, m }) => {
  const k = e(t, m.centro, m.centro + 1.6), bad = e(t, m.atras, m.atras + 1.6);
  return (
    <>
      <Svg>
        <rect x={240} y={240} width={1440} height={260} rx={16} fill="#b07a46" />
        <circle cx={960} cy={370} r={46 * e(t, m.centro - 0.4, m.centro)} fill="rgba(240,169,58,.85)" />
        <rect x={960 - 700 * k} y={330} width={1400 * k} height={80} rx={40} fill="rgba(240,169,58,.6)" />
        <rect x={240} y={580} width={1440} height={260} rx={16} fill="#b07a46" opacity={cl(bad * 3)} />
        <Draw d="M300,710 L700,690 L420,730 L900,700 L600,740 L1100,690 L800,720 L1300,700 L1600,710" p={bad} col="rgba(240,169,58,.75)" w={60} />
        {bad > 0.8 && Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${360 + i * 140},680 q 30,30 60,0`} stroke="#6b3d14" strokeWidth={4} fill="none" />)}
      </Svg>
      <Tick t={t} at={m.centro + 1.7} x={1760} y={370} r={46} />
      <Cross t={t} at={m.atras + 1.7} x={1760} y={710} r={46} />
      <Lbl t={t} at={m.centro + 0.4} text="una pasada, y la dejás" x={960} y={170} col={C.ok} size={54} />
      <Lbl t={t} at={m.atras + 1} text="volver atrás: marcas" x={960} y={930} col={C.red} size={54} />
    </>
  );
};

// 32 · cinco capas de brillo: un medidor que sube capa a capa y la ventana reflejada que se vuelve nítida
export const BrilloCincoCapas: React.FC<FxP> = ({ t, a, m }) => {
  const k = e(t, a, m.c5 + 1), n = Math.min(5, 1 + Math.floor(k * 4.99));
  return (
    <>
      <Svg>
        <rect x={300} y={300} width={760} height={460} rx={16} fill={C.wood} />
        <g opacity={0.15 + 0.85 * k} style={{ filter: `blur(${(1 - k) * 18}px)` }}><rect x={420} y={360} width={220} height={300} fill="rgba(200,240,190,.6)" /><line x1={530} y1={360} x2={530} y2={660} stroke="rgba(60,40,20,.8)" strokeWidth={8} /><line x1={420} y1={510} x2={640} y2={510} stroke="rgba(60,40,20,.8)" strokeWidth={8} /></g>
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={1260} y={760 - i * 100} width={300} height={80} rx={12} fill={i < n ? `rgba(240,169,58,${0.45 + i * 0.11})` : "rgba(255,240,214,.08)"} stroke={C.edge} strokeWidth={2} />)}
      </Svg>
      <Pop t={t} at={a + 0.3} x={1410} y={200}><Big size={110} col={C.honey}>capa {n}</Big></Pop>
      <Lbl t={t} at={m.c3} text="parece mojado" x={680} y={860} col={C.solv} size={54} out={m.c5} />
      <Lbl t={t} at={m.c5 + 0.3} text="te ves reflejado" x={680} y={860} col={C.ok} size={54} />
      <Lbl t={t} at={m.diez} text="10 minutos por día" x={1410} y={940} col={C.cream} size={48} />
    </>
  );
};

// 33 · la lija al agua: el perfil con granitos de polvo; la lija los corta (queda mate) y la última capa deja un espejo
export const LijaAgua: React.FC<FxP> = ({ t, a, m }) => {
  const s = e(t, a + 0.8, m.mate + 0.6), u = e(t, m.ult, m.ult + 1.2);
  const perfil = Array.from({ length: 49 }, (_, i) => { const x = 260 + i * 29, bump = [6, 14, 23, 31, 40].includes(i) ? 34 : 6 * Math.sin(i * 1.7); return `${i ? "L" : "M"}${x},${560 - bump * (1 - s)}`; }).join(" ");
  return (
    <>
      <Svg>
        <rect x={260} y={560} width={1400} height={160} fill={C.wood} />
        <path d={`${perfil} L1652,720 L260,720 Z`} fill="rgba(240,169,58,.6)" />
        <path d={perfil} stroke={s > 0.9 && u < 0.1 ? "#d8cdb3" : "rgba(255,255,255,.7)"} strokeWidth={6} fill="none" />
        {u > 0 && <rect x={260} y={560 - 30 * u} width={1400} height={30 * u} fill="rgba(240,169,58,.75)" />}
        {u > 0.8 && <rect x={260} y={526} width={1400} height={6} fill="rgba(255,255,255,.85)" />}
        <g transform={`translate(${lerp(300, 1600, (t - a) * 0.4 % 1)},${520 - 30 * (1 - s)})`} opacity={s < 1 ? 1 : 1 - e(t, m.ult - 0.4, m.ult)}><rect x={-90} y={-60} width={180} height={60} rx={8} fill="#2b2b2b" /></g>
      </Svg>
      <Lbl t={t} at={a + 0.4} text="polvo y pelitos" x={960} y={330} col={C.cream} size={56} out={m.mate} />
      <Lbl t={t} at={m.mate + 0.3} text="mate: no lo arruinaste" x={960} y={330} col={C.sun} size={56} out={m.ult} />
      <Lbl t={t} at={m.ult + 0.8} text="sin una mota" x={960} y={330} col={C.ok} size={62} />
    </>
  );
};

// 34 · el color: lo que no va (al agua) y lo que sí (al solvente); el tinte va abajo y las capas claras arriba
export const ColorCapas: React.FC<FxP> = ({ t, a, m }) => {
  const NO = ["témpera", "acrílico al agua", "colorante de torta"], SI = ["tinte al solvente", "pintura sintética", "mica"];
  const ab = e(t, m.abajo, m.abajo + 1.4), sm = e(t, m.suma, m.suma + 1.4);
  const bajo = t >= m.suma;
  return (
    <>
      {!bajo && NO.map((w, i) => <Lbl key={w} t={t} at={m.nada + i * 0.35} text={w} x={520} y={360 + i * 120} col={C.red} size={52} />)}
      {!bajo && SI.map((w, i) => <Lbl key={w} t={t} at={m.lleva + i * 0.5} text={w} x={1400} y={360 + i * 120} col={C.ok} size={52} />)}
      {!bajo && <Lbl t={t} at={a + 0.3} text="¿se le da color?" x={960} y={850} col={C.honey} size={62} />}
      {bajo && <Svg>
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={260 + i * 150} y={360} width={120} height={360} rx={10} fill={`rgba(110,52,10,${0.15 + 0.17 * i * sm})`} stroke={C.edge} strokeWidth={2} />)}
        <rect x={1100} y={760} width={560} height={50} rx={6} fill={C.wood} />
        <rect x={1100} y={720} width={560} height={40} rx={6} fill="rgba(110,52,10,.75)" opacity={ab} />
        {[0, 1, 2].map((i) => <rect key={i} x={1100} y={680 - i * 40} width={560} height={36} rx={6} fill="rgba(255,240,214,.18)" stroke="rgba(255,255,255,.4)" strokeWidth={2} opacity={e(t, m.abajo + 0.6 + i * 0.4, m.abajo + 0.9 + i * 0.4)} />)}
      </Svg>}
      {bajo && <Lbl t={t} at={m.suma + 0.4} text="se suma capa a capa" x={600} y={820} col={C.red} size={52} />}
      {bajo && <Lbl t={t} at={m.abajo + 0.5} text="color abajo, vidrio arriba" x={1380} y={420} col={C.ok} size={50} />}
      {bajo && <Lbl t={t} at={m.tanda} text="todo de una vez" x={1380} y={920} col={C.honey} size={54} />}
    </>
  );
};
