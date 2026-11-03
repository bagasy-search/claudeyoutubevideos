// cl2resina · componentes del gancho al disolver (precio, gota que perla, usos, intrigas, seguridad, telgopor, disolvente,
// frasco, lugar, guantes, cuánto traga). Cada uno es f(t) puro; las marcas (m.*) salen de fx.json, ancladas a la voz.
import React from "react";
import { C, FONT, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Big, Cross, Draw, FxP, Pop, Svg, Tick, Txt, glass, num, shake } from "./kit";

// vasito/frasco plano 2D: (x, y = base), ancho w, alto h; nivel 0..1, color del líquido
export const Vaso: React.FC<{ x: number; y: number; w: number; h: number; lv: number; liq?: string; lid?: boolean; o?: number }> = ({ x, y, w, h, lv, liq = "rgba(143,211,255,.3)", lid, o = 1 }) => (
  <g opacity={o}>
    <rect x={x - w / 2} y={y - h * lv} width={w} height={h * lv} rx={8} fill={liq} />
    <path d={`M${x - w / 2},${y - h} L${x - w / 2},${y - 10} Q${x - w / 2},${y} ${x - w / 2 + 10},${y} L${x + w / 2 - 10},${y} Q${x + w / 2},${y} ${x + w / 2},${y - 10} L${x + w / 2},${y - h}`} fill="none" stroke={C.edge} strokeWidth={4} />
    <rect x={x - w / 2 + 10} y={y - h * 0.9} width={8} height={h * 0.7} rx={4} fill="rgba(255,255,255,.3)" />
    {lid && <rect x={x - w / 2 - 6} y={y - h - 22} width={w + 12} height={24} rx={6} fill="#b9b2a3" stroke="#5e584d" strokeWidth={2} />}
  </g>
);
// pedacito de telgopor (bolitas)
export const Telgo: React.FC<{ x: number; y: number; s: number; o?: number; rot?: number; sq?: number }> = ({ x, y, s, o = 1, rot = 0, sq = 1 }) => (
  <g opacity={o} transform={`rotate(${rot} ${x} ${y})`}>
    <rect x={x - s / 2} y={y - (s * sq) / 2} width={s} height={s * sq} rx={s * 0.18} fill={C.styro} stroke="rgba(0,0,0,.2)" strokeWidth={2} />
    {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={x - s * 0.33 + (i % 3) * s * 0.33} cy={y - s * sq * 0.3 + Math.floor(i / 3) * s * sq * 0.3} r={s * 0.11} fill="none" stroke="rgba(0,0,0,.08)" strokeWidth={1.5} />)}
  </g>
);

// 1 · el bidón de epoxi con su precio, tachado; entran las dos cosas de tu casa
export const EpoxiTachada: React.FC<FxP> = ({ t, a, m }) => {
  const p = spr(t, a + 0.1, 0.9), x = e(t, m.dos - 0.6, m.dos);
  return (
    <>
      <Svg>
        <g opacity={cl(p * 2) * (1 - 0.55 * x)} transform={`translate(560,${560 + (1 - p) * 100})`}>
          <path d="M-150,-200 L120,-200 Q150,-200 150,-170 L150,230 Q150,260 120,260 L-120,260 Q-150,260 -150,230 Z" fill="#eceae4" stroke="#8d887e" strokeWidth={4} />
          <rect x={-60} y={-250} width={90} height={50} rx={10} fill="#d5d1c7" stroke="#8d887e" strokeWidth={3} />
          <rect x={-120} y={-80} width={240} height={150} rx={10} fill="#2c6ea8" />
          <text x={0} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={58} fill="#fff">EPOXI</text>
          <text x={0} y={52} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#cfe4f7">A + B</text>
        </g>
        <Draw d="M380,330 L760,830" p={x} col={C.red} w={16} />
        <g opacity={x}>
          <Telgo x={1260} y={560} s={190} rot={-8} />
          <rect x={1460} y={420} width={170} height={260} rx={18} fill="#c7b89a" stroke="#5e584d" strokeWidth={4} />
          <rect x={1490} y={480} width={110} height={120} rx={8} fill="#f2e3bf" />
          <text x={1545} y={548} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#5e3a1c">THINNER</text>
        </g>
      </Svg>
      <Pop t={t} at={a + 0.4} out={m.dos} x={560} y={180}><Big size={130} col={C.red}>US$ 80</Big></Pop>
      <Lbl t={t} at={m.dos} text="dos cosas de tu casa" x={1400} y={820} col={C.honey} size={60} />
    </>
  );
};

// 2 · la gota que perla: cae sobre la tabla con brillo, queda redonda (ángulo alto), se inclina la tabla y resbala
export const GotaPerla: React.FC<FxP> = ({ t, a, m }) => {
  const fall = cl((t - a - 0.3) / 0.6), y = lerp(120, 560, fall * fall), tilt = e(t, m.res - 0.4, m.res + 0.6), sl = e(t, m.res, m.res + 1.4);
  const ang = lerp(0, 140, e(t, a + 1, a + 1.8));
  return (
    <>
      <Svg>
        <g transform={`rotate(${-6 * tilt} 960 640)`}>
          <rect x={260} y={640} width={1400} height={70} rx={10} fill={C.wood} />
          <rect x={260} y={628} width={1400} height={14} rx={6} fill="rgba(255,236,200,.55)" />
          {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M270,${652 + i * 8} C 700,${648 + i * 9} 1200,${660 + i * 7} 1650,${652 + i * 8}`} stroke={C.wood2} strokeWidth={2} fill="none" opacity={0.5} />)}
          {fall < 1 ? <ellipse cx={960} cy={y} rx={26} ry={34} fill="rgba(143,211,255,.75)" stroke="#fff" strokeWidth={2} />
            : <g transform={`translate(${960 + sl * 700},0)`}>
              <path d="M-60,628 C -60,560 60,560 60,628 Z" fill="rgba(143,211,255,.7)" stroke="#fff" strokeWidth={3} />
              <ellipse cx={-18} cy={585} rx={12} ry={7} fill="rgba(255,255,255,.85)" />
            </g>}
          {fall >= 1 && sl < 0.05 && <g>
            <Draw d="M820,628 L1100,628" p={e(t, a + 1, a + 1.4)} col={C.sun} w={3} dash="10 8" />
            <Draw d={`M900,628 L${900 + 80 * Math.cos((ang * Math.PI) / 180)},${628 - 80 * Math.sin((ang * Math.PI) / 180)}`} p={1} col={C.sun} w={4} />
          </g>}
        </g>
      </Svg>
      <Lbl t={t} at={a + 1.3} text="no entra, queda redonda" x={1300} y={420} col={C.solv} size={58} />
      <Lbl t={t} at={m.res + 0.2} text="y resbala" x={1350} y={860} col={C.ok} size={64} />
    </>
  );
};

// 3 · un frasco, tres usos: rayos que salen del frasco hacia ventana, teja y pieza
export const TresUsosFrasco: React.FC<FxP> = ({ t, a, m }) => {
  const U = [{ at: m.vent, x: 420, y: 330, lab: "ventanas", d: "M-90,-110 h180 v220 h-180 Z M0,-110 v220 M-90,0 h180" }, { at: m.teja, x: 1500, y: 330, lab: "rajaduras", d: "M-140,60 Q0,-80 140,60 L120,90 Q0,-40 -120,90 Z" }, { at: m.pieza, x: 960, y: 260, lab: "piezas con brillo", d: "M0,-100 C 60,-100 70,-20 40,10 L60,100 L-60,100 L-40,10 C -70,-20 -60,-100 0,-100 Z" }];
  return (
    <>
      <Svg>
        <g transform={`translate(960,${700 + (1 - spr(t, a, 1)) * 80})`}>
          <rect x={-90} y={-170} width={180} height={230} rx={22} fill="rgba(240,169,58,.5)" stroke={C.edge} strokeWidth={4} />
          <rect x={-96} y={-196} width={192} height={30} rx={8} fill="#b9b2a3" />
        </g>
        {U.map((q, i) => (
          <g key={i}>
            <Draw d={`M960,560 L${q.x},${q.y + 140}`} p={e(t, q.at, q.at + 0.5)} col={C.honey} w={4} dash={undefined} />
            <g transform={`translate(${q.x},${q.y}) scale(${spr(t, q.at + 0.3, 1.1)})`}><path d={q.d} fill="rgba(240,169,58,.25)" stroke={C.honey} strokeWidth={5} /></g>
          </g>
        ))}
      </Svg>
      {U.map((q, i) => <Lbl key={i} t={t} at={q.at + 0.5} text={q.lab} x={q.x} y={q.y + 190} col={C.cream} size={50} />)}
      <Lbl t={t} at={a + 0.3} text="lo que sale un café" x={960} y={950} col={C.honey} size={56} />
    </>
  );
};

// 4 · vidrio o chicle: a la izquierda la superficie refleja la ventana; a la derecha un dedo levanta un hilo pegajoso
export const VidrioChicle: React.FC<FxP> = ({ t, a, m }) => {
  const g = spr(t, m.chicle, 1), str = e(t, m.chicle + 0.3, m.chicle + 1.5);
  return (
    <>
      <Svg>
        <g opacity={cl(spr(t, a, 1) * 2)}>
          <rect x={220} y={420} width={640} height={300} rx={20} fill={C.wood} />
          <rect x={220} y={420} width={640} height={300} rx={20} fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.4)" strokeWidth={3} />
          <rect x={320} y={460} width={150} height={190} fill="rgba(200,240,190,.45)" /><line x1={395} y1={460} x2={395} y2={650} stroke="rgba(60,40,20,.7)" strokeWidth={6} />
          <Draw d="M560,450 L820,690" p={e(t, a + 0.4, a + 1)} col="rgba(255,255,255,.5)" w={10} />
        </g>
        <g opacity={cl(g * 2)}>
          <rect x={1060} y={520} width={640} height={200} rx={20} fill={C.wood} />
          <rect x={1060} y={520} width={640} height={200} rx={20} fill="rgba(240,169,58,.35)" />
          <path d={`M1340,${520 - 10} C 1330,${520 - 160 * str} 1390,${520 - 160 * str} 1380,${520 - 10} Z`} fill="rgba(240,169,58,.7)" />
          <ellipse cx={1360} cy={520 - 190 * str} rx={46} ry={30} fill="#e2b48f" stroke="#7a4b2f" strokeWidth={3} />
        </g>
      </Svg>
      <Lbl t={t} at={a + 0.5} text="como vidrio" x={540} y={820} col={C.ok} size={62} />
      <Lbl t={t} at={m.chicle + 0.3} text="no como chicle" x={1380} y={820} col={C.red} size={62} />
    </>
  );
};

// 5 · tres sobres cerrados: cada uno muestra una pista (la etiqueta, el dedo pegado, el tacho) y queda sellado
export const TresSobres: React.FC<FxP> = ({ t, a, m }) => {
  const S = [{ at: m.e1, x: 420, ico: "M-60,-30 h120 v70 h-120 Z M-40,-10 h80", lab: "una palabra" }, { at: m.e2, x: 960, ico: "M-20,40 v-70 q0,-20 20,-20 q20,0 20,20 v70 M-40,40 h80", lab: "por qué pega" }, { at: m.e3, x: 1500, ico: "M-50,-40 h100 l-12,90 h-76 Z M-60,-40 h120", lab: "lo que tirás" }];
  return (
    <>
      <Svg>
        {S.map((q, i) => {
          const p = spr(t, Math.min(q.at, a + 0.4 + i * 0.3), 1), open = e(t, q.at, q.at + 0.6) * (1 - e(t, q.at + 2.4, q.at + 3));
          return (
            <g key={i} opacity={cl(p * 2)} transform={`translate(${q.x},${560 + (1 - p) * 120})`}>
              <rect x={-190} y={-130} width={380} height={260} rx={16} fill="#e9dcc0" stroke="#7a6a4d" strokeWidth={4} />
              <path d={`M-190,-130 L0,${-130 + 150 * (1 - open) - 120 * open} L190,-130`} fill="#d9caa9" stroke="#7a6a4d" strokeWidth={4} />
              <g opacity={open} transform="translate(0,-170)"><path d={q.ico} fill="none" stroke={C.honey} strokeWidth={8} strokeLinecap="round" /></g>
              <text x={0} y={70} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={90} fill="#7a6a4d">{i + 1}</text>
            </g>
          );
        })}
      </Svg>
      {S.map((q, i) => <Lbl key={i} t={t} at={q.at + 0.4} text={q.lab} x={q.x} y={820} col={C.honey} size={52} />)}
      <Lbl t={t} at={m.fin} text="al final del video" x={960} y={950} col={C.cream} size={52} />
    </>
  );
};

// 6 · a la mitad no le sale: una torta de 2 millones que se parte; la mitad roja dice «nunca me funciona»
export const MitadNoSale: React.FC<FxP> = ({ t, a, m }) => {
  const g = e(t, m.mitad, m.mitad + 1.2), sep = 40 * e(t, m.mitad + 1, m.mitad + 1.6);
  const arc = (k: number) => { const an = Math.PI * 2 * k - Math.PI / 2; return `${700 + 260 * Math.cos(an)},${540 + 260 * Math.sin(an)}`; };
  return (
    <>
      <Svg>
        <circle cx={700} cy={540} r={260} fill="rgba(169,230,108,.25)" stroke={C.ok} strokeWidth={5} opacity={cl(spr(t, a, 1) * 2)} />
        {g > 0.01 && <path d={`M${700 + sep},540 L${700 + sep},280 A260,260 0 ${g > 0.5 ? 1 : 0} 1 ${arc(g * 0.5).split(",").map((v, i) => +v + (i ? 0 : sep)).join(",")} Z`} fill="rgba(255,85,70,.55)" stroke={C.red} strokeWidth={5} />}
      </Svg>
      <Pop t={t} at={a + 0.2} x={700} y={540}><Big size={110}>{num(t, a + 0.2, a + 1.4, 0, 2, 0)} M</Big></Pop>
      <Lbl t={t} at={m.mitad + 1} text="no le sale" x={1350} y={430} col={C.red} size={70} />
      <Lbl t={t} at={m.sec} text="hay un secreto" x={1350} y={620} col={C.honey} size={64} />
    </>
  );
};

// 7 · vapores: salen de la lata, viajan hacia una llama y se prenden; se abren ventana y puerta y los vapores salen por ahí
export const VaporFuego: React.FC<FxP> = ({ t, a, m }) => {
  const ab = e(t, m.abiertas, m.abiertas + 1), boom = spr(t, a + 1.6, 1.4) * (1 - ab);
  return (
    <>
      <Svg>
        <rect x={360} y={560} width={150} height={220} rx={14} fill="#c7b89a" stroke="#5e584d" strokeWidth={4} />
        {Array.from({ length: 10 }, (_, i) => { const u = ((t - a) * 0.35 + i / 10) % 1, tx = lerp(430, ab > 0.5 ? 1700 : 1180, u), ty = 540 - 200 * Math.sin(u * Math.PI) * 0.6 - (ab > 0.5 ? 180 * u : 0); return <path key={i} d={`M${tx - 30},${ty} q 15,-20 30,0 t 30,0`} stroke="rgba(190,220,255,.6)" strokeWidth={5} fill="none" opacity={(1 - u) * cl((t - a) * 2)} />; })}
        <g opacity={1 - ab} transform="translate(1200,620)">
          <path d="M0,40 C -40,0 -10,-50 0,-80 C 10,-50 40,0 0,40 Z" fill="#ffb03a" />
          <circle r={140 * boom} fill="rgba(255,120,40,.25)" stroke="#ff7a2a" strokeWidth={4} opacity={1 - e(t, a + 2.4, a + 3)} />
        </g>
        <g opacity={ab}>
          <rect x={1580} y={260} width={240} height={300} fill="rgba(200,240,190,.25)" stroke={C.cream} strokeWidth={6} />
          <path d={`M1580,260 L${1580 - 120 * ab},300 L${1580 - 120 * ab},520 L1580,560`} fill="rgba(255,255,255,.12)" stroke={C.cream} strokeWidth={5} />
        </g>
        {[["M-40,-30 h80 v60 h-80 Z", m.horn], ["M-60,0 h120", m.horn + 0.5], ["M-40,-40 h80 v80 h-80 Z M-20,-20 h40", m.horn + 1]].map(([d, at], i) => (
          <g key={i} transform={`translate(${760 + i * 210},880)`} opacity={cl((t - (at as number)) * 4)}><path d={d as string} stroke={C.cream} strokeWidth={8} fill="none" strokeLinecap="round" /></g>
        ))}
        {[0, 1, 2].map((i) => <Cross key={i} t={t} at={m.horn + 0.3 + i * 0.5} x={760 + i * 210} y={880} r={52} />)}
      </Svg>
      <Lbl t={t} at={a + 0.4} text="vapores que se prenden" x={960} y={200} col={C.red} size={62} out={m.abiertas} />
      <Lbl t={t} at={m.abiertas + 0.3} text="todo abierto" x={1700} y={640} col={C.ok} size={58} />
    </>
  );
};

// 8 · reacciona o se evapora: A+B chocan y se vuelven bloque; la laca suelta moléculas hacia arriba y queda una lámina
export const ReaccionVsEvapora: React.FC<FxP> = ({ t, a, m }) => {
  const j = e(t, a + 0.6, a + 1.6), bl = e(t, a + 1.6, a + 2.2), ev = e(t, m.evap, m.evap + 3);
  return (
    <>
      <Svg>
        <g opacity={cl(spr(t, a, 1) * 2)}>
          {bl < 0.5 ? <>
            <circle cx={lerp(300, 450, j)} cy={520} r={70} fill="rgba(240,240,255,.6)" /><circle cx={lerp(700, 550, j)} cy={520} r={70} fill="rgba(240,169,58,.7)" />
            <text x={lerp(300, 450, j)} y={538} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={54} fill="#2a2016">A</text>
            <text x={lerp(700, 550, j)} y={538} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={54} fill="#2a2016">B</text>
          </> : <rect x={360} y={400} width={280} height={260} rx={20} fill="rgba(240,200,120,.85)" stroke="#fff" strokeWidth={4} transform={`translate(${shake(t, a + 1.7, 10)},0)`} />}
        </g>
        <g opacity={e(t, m.otra, m.otra + 0.6)}>
          <rect x={1160} y={640} width={560} height={lerp(150, 26, ev)} rx={10} fill="rgba(240,169,58,.6)" transform={`translate(0,${lerp(0, 124, ev)})`} />
          <rect x={1160} y={790} width={560} height={40} rx={8} fill={C.wood} />
          {Array.from({ length: 16 }, (_, i) => { const u = ((t - m.evap) * 0.4 + hash(i, 2)) % 1; return t > m.evap ? <circle key={i} cx={1190 + hash(i, 3) * 500} cy={720 - u * 400} r={7} fill={C.solv} opacity={(1 - u) * (1 - ev * 0.6)} /> : null; })}
        </g>
      </Svg>
      <Lbl t={t} at={a + 0.4} text="epoxi: reacciona" x={500} y={800} col={C.solv} size={58} />
      <Lbl t={t} at={m.evap + 0.3} text="esta: se evapora" x={1440} y={270} col={C.honey} size={58} />
      <Lbl t={t} at={m.molde} text="no llena moldes" x={500} y={920} col={C.red} size={54} />
    </>
  );
};

// 9 · el mismo blanco, seis nombres: el bloque gira y cada cara muestra cómo le dicen en otro país
export const NombresPais: React.FC<FxP> = ({ t, a }) => {
  const N = [["telgopor", "Argentina"], ["unicel", "México"], ["icopor", "Colombia"], ["poliespán", "Uruguay"], ["isopor", "Brasil"], ["duroport", "Guatemala"]];
  return (
    <>
      <Svg><Telgo x={960} y={560} s={260} rot={8 * Math.sin((t - a) * 1.5)} /></Svg>
      {N.map(([w, p], i) => { const an = (i / 6) * Math.PI * 2 - Math.PI / 2, at = a + 0.3 + i * 0.55; return (
        <Pop key={w} t={t} at={at} x={960 + 560 * Math.cos(an)} y={540 + 330 * Math.sin(an)} k={1.2}>
          <div style={{ ...glass(), padding: "14px 28px", textAlign: "center" }}><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.ink, textTransform: "uppercase" }}>{w}</div><Txt size={28}>{p}</Txt></div>
        </Pop>); })}
    </>
  );
};

// 10 · limpio o sucio: dos pedazos caen a dos frascos; el limpio se vuelve claro, el sucio turbio con grumos
export const LimpioSucio: React.FC<FxP> = ({ t, a, m }) => {
  const d1 = e(t, a + 0.8, a + 2.2), d2 = e(t, m.turbia - 0.6, m.turbia + 0.6);
  return (
    <>
      <Svg>
        <Vaso x={620} y={820} w={300} h={400} lv={0.6} liq="rgba(240,190,110,.45)" />
        <Vaso x={1300} y={820} w={300} h={400} lv={0.6} liq={`rgba(${lerp(240, 140, d2)},${lerp(190, 130, d2)},${lerp(110, 100, d2)},${lerp(0.45, 0.85, d2)})`} />
        <Telgo x={620} y={lerp(300, 640, d1)} s={110 * (1 - 0.9 * d1)} o={1 - d1} />
        <g opacity={1 - d2 * 0.5}><Telgo x={1300} y={lerp(300, 640, d2)} s={110 * (1 - 0.7 * d2)} />{[0, 1, 2, 3].map((i) => <circle key={i} cx={1270 + i * 22} cy={lerp(280, 620, d2) + hash(i, 1) * 30} r={9} fill="#5b3c24" />)}</g>
        {d2 > 0.6 && [0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={1200 + hash(i, 4) * 200} cy={600 + hash(i, 5) * 180} r={8 + 6 * hash(i, 6)} fill="#6e5a3a" opacity={0.8} />)}
      </Svg>
      <Lbl t={t} at={a + 0.4} text="limpio y seco" x={620} y={260} col={C.ok} size={58} />
      <Lbl t={t} at={m.turbia - 0.4} text="con tierra o mojado" x={1300} y={260} col={C.red} size={54} />
      <Lbl t={t} at={m.turbia + 0.6} text="turbia y con grumos" x={1300} y={900} col={C.red} size={50} />
      <Tick t={t} at={a + 2.2} x={620} y={930} r={40} />
    </>
  );
};

// 11 · casi todo aire: una caja de zapatos llena de bolitas se desinfla en dos cucharadas
export const CasiTodoAire: React.FC<FxP> = ({ t, a, m }) => {
  const k = e(t, m.aire, m.aire + 1.6), w = lerp(560, 120, k), h = lerp(300, 60, k);
  return (
    <>
      <Svg>
        <rect x={700 - w / 2} y={720 - h} width={w} height={h} rx={10} fill="rgba(246,245,239,.85)" stroke="#a49f93" strokeWidth={4} />
        {k < 0.9 && Array.from({ length: 40 }, (_, i) => <circle key={i} cx={700 - w / 2 + 20 + hash(i, 1) * (w - 40)} cy={720 - h + 20 + hash(i, 2) * (h - 40)} r={12 * (1 - k)} fill="none" stroke="rgba(0,0,0,.12)" strokeWidth={2} />)}
        {[0, 1].map((i) => <g key={i} opacity={e(t, m.cuch, m.cuch + 0.5)} transform={`translate(${1260 + i * 220},640)`}><ellipse rx={80} ry={36} fill="rgba(240,169,58,.7)" stroke="#fff" strokeWidth={3} /><rect x={70} y={-10} width={160} height={18} rx={9} fill="#cfcac0" /></g>)}
      </Svg>
      <Pop t={t} at={m.aire} x={700} y={300}><Big size={140} col={C.solv}>{num(t, m.aire, m.aire + 1.4, 0, 98)}% aire</Big></Pop>
      <Lbl t={t} at={a + 0.3} text="una caja de zapatos" x={700} y={820} col={C.cream} size={54} />
      <Lbl t={t} at={m.cuch + 0.3} text="dos cucharadas" x={1370} y={800} col={C.honey} size={58} />
    </>
  );
};

// 12 · la masa gomosa: el thinner cualquiera no disuelve; el telgopor se hincha, se pega al fondo y queda ahí
export const MasaGomosa: React.FC<FxP> = ({ t, a, m }) => {
  const g = e(t, m.gom, m.gom + 1.5);
  return (
    <>
      <Svg>
        <Vaso x={960} y={860} w={420} h={520} lv={0.55} liq="rgba(200,220,240,.3)" />
        <path d={`M${830 - 30 * g},860 C ${830 - 40 * g},${780 - 60 * g} ${1090 + 40 * g},${780 - 60 * g} ${1090 + 30 * g},860 Z`} fill="rgba(246,245,239,.9)" stroke="#a49f93" strokeWidth={3} opacity={g} />
        <Telgo x={960} y={lerp(560, 760, e(t, a + 0.3, m.gom))} s={160} o={1 - g} />
        <Draw d={`M960,560 C 950,${660} 990,${720} 960,${800}`} p={e(t, m.gom + 0.8, m.gom + 1.8)} col="rgba(246,245,239,.8)" w={8} />
      </Svg>
      <Lbl t={t} at={a + 0.4} text="«dame thinner»" x={1500} y={380} col={C.cream} size={58} />
      <Lbl t={t} at={m.gom + 0.3} text="gomoso, no se disuelve" x={1500} y={560} col={C.red} size={52} />
      <Lbl t={t} at={m.nof} text="no es la receta" x={1500} y={740} col={C.honey} size={58} />
    </>
  );
};

// 13 · la lupa sobre la etiqueta: una palabra borrosa que se resiste; la intriga queda abierta
export const LupaEtiqueta: React.FC<FxP> = ({ t, a, m }) => {
  const lx = lerp(620, 1120, e(t, a + 0.4, a + 2.2)), tipos = spr(t, m.tipos, 1);
  return (
    <>
      <Svg>
        <rect x={560} y={240} width={800} height={600} rx={24} fill="#d8cdb3" stroke="#5e584d" strokeWidth={5} />
        <text x={960} y={360} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={96} fill="#5e3a1c">THINNER</text>
        {[0, 1, 2, 3].map((i) => <rect key={i} x={640} y={520 + i * 60} width={640 - i * 80} height={18} rx={9} fill="rgba(94,58,28,.35)" />)}
        <rect x={720} y={420} width={480} height={56} rx={10} fill="rgba(94,58,28,.55)" style={{ filter: "blur(6px)" }} />
        <g transform={`translate(${lx},450)`}><circle r={120} fill="rgba(220,240,255,.15)" stroke="#e9e2d2" strokeWidth={12} /><rect x={80} y={80} width={40} height={150} rx={20} fill="#5e3a1c" transform="rotate(-45 100 100)" /><text y={22} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={72} fill={C.honey}>???</text></g>
        {[0, 1, 2].map((i) => <g key={i} opacity={cl(tipos * 2)} transform={`translate(${1560},${330 + i * 190}) scale(${spr(t, m.tipos + i * 0.3, 1.2)})`}><rect x={-70} y={-80} width={140} height={160} rx={14} fill={["#d9d0b8", "#c7b89a", "#e5dcc6"][i]} stroke="#5e584d" strokeWidth={3} /></g>)}
      </Svg>
      <Lbl t={t} at={a + 0.8} text="la palabra en la etiqueta" x={960} y={950} col={C.honey} size={56} />
      <Lbl t={t} at={m.tipos + 0.5} text="no todos iguales" x={1560} y={940} col={C.cream} size={48} />
    </>
  );
};

// 14 · vidrio sí, plástico no: el vaso de plástico se derrite y gotea; el de vidrio con tapa de metal queda entero
export const FrascoAgujereado: React.FC<FxP> = ({ t, a, m }) => {
  const d = e(t, m.aguj, m.aguj + 2), tp = spr(t, m.tapa, 1);
  return (
    <>
      <Svg>
        <path d={`M440,${400 + 120 * d} Q${420 - 30 * d},${620} ${470 + 20 * d},820 L${730 - 20 * d},820 Q${780 + 30 * d},${620} ${760},${400 + 160 * d} Z`} fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.7)" strokeWidth={4} />
        <ellipse cx={600} cy={840} rx={60 + 260 * d} ry={10 + 24 * d} fill="rgba(143,211,255,.45)" opacity={d} />
        {d > 0.2 && [0, 1, 2].map((i) => <ellipse key={i} cx={560 + i * 40} cy={820 + ((t * 120 + i * 50) % 60)} rx={7} ry={12} fill="rgba(143,211,255,.8)" />)}
        <Vaso x={1320} y={820} w={300} h={400} lv={0.55} liq="rgba(143,211,255,.3)" lid={tp > 0.5} />
      </Svg>
      <Cross t={t} at={m.aguj + 0.8} x={600} y={300} r={60} />
      <Tick t={t} at={a + 1} x={1320} y={300} r={60} />
      <Lbl t={t} at={m.aguj + 0.4} text="el plástico se derrite" x={600} y={940} col={C.red} size={52} />
      <Lbl t={t} at={m.tapa + 0.2} text="vidrio, tapa de metal" x={1320} y={940} col={C.ok} size={52} />
    </>
  );
};

// 15 · una gotita de agua: cae en el frasco claro y una nube blanca se abre desde el punto de impacto
export const GotitaLechosa: React.FC<FxP> = ({ t, a, m }) => {
  const f = cl((t - a - 0.4) / 0.7), nub = e(t, a + 1.1, m.lech + 0.8);
  return (
    <>
      <Svg>
        <Vaso x={960} y={860} w={460} h={560} lv={0.62} liq="rgba(240,180,90,.45)" />
        <ellipse cx={960} cy={lerp(160, 520, f * f)} rx={18} ry={24} fill={C.water} opacity={f < 1 ? 1 : 0} />
        {Array.from({ length: 14 }, (_, i) => { const an = hash(i, 1) * Math.PI * 2, r = 220 * nub * (0.4 + 0.6 * hash(i, 2)); return <circle key={i} cx={960 + Math.cos(an) * r * 0.8} cy={600 + Math.abs(Math.sin(an)) * r * 0.7} r={60 * nub + 10} fill="rgba(236,232,222,.35)" />; })}
      </Svg>
      <Lbl t={t} at={a + 0.5} text="una sola gotita" x={1500} y={360} col={C.water} size={58} />
      <Lbl t={t} at={m.lech} text="se pone lechosa" x={1500} y={560} col={C.milk} size={62} />
    </>
  );
};

// 16 · corriente cruzada: el taller visto desde arriba; el aire entra por la ventana y sale por la puerta del fondo
export const CorrienteCruzada: React.FC<FxP> = ({ t, a, m }) => {
  const pu = e(t, m.puerta, m.puerta + 0.8);
  return (
    <>
      <Svg>
        <g opacity={cl(spr(t, a, 1) * 2)}>
          <rect x={460} y={240} width={1000} height={620} fill="rgba(154,98,51,.25)" stroke={C.cream} strokeWidth={10} />
          <rect x={430} y={420} width={60} height={240} fill="rgba(200,240,190,.6)" />
          <rect x={1430} y={580 - 200 * 0} width={60} height={180} fill={pu > 0.1 ? "rgba(200,240,190,.6)" : C.wood} />
          <rect x={820} y={480} width={300} height={140} rx={10} fill={C.wood} />
        </g>
        {Array.from({ length: 6 }, (_, i) => { const u = ((t - a) * 0.4 + i / 6) % 1, y0 = 470 + (i % 3) * 70, x = lerp(300, pu > 0.5 ? 1620 : 900, u), y = pu > 0.5 ? lerp(y0, 640 + (i % 3) * 30, u) : y0; return <path key={i} d={`M${x - 70},${y} l 70,0 l -20,-14 M${x},${y} l -20,14`} stroke={C.solv} strokeWidth={6} fill="none" strokeLinecap="round" opacity={(1 - Math.abs(u - 0.5) * 2) * (pu > 0.5 ? 1 : 0.6)} />; })}
      </Svg>
      <Lbl t={t} at={a + 0.5} text="ventana abierta" x={460} y={940} col={C.ok} size={56} />
      <Lbl t={t} at={m.puerta + 0.3} text="y la puerta del fondo" x={1440} y={940} col={C.solv} size={56} />
      <Lbl t={t} at={m.afuera} text="mejor: afuera" x={960} y={170} col={C.honey} size={60} />
    </>
  );
};

// 17 · nitrilo o látex: el guante de látex se ablanda y se cae; el azul aguanta; llega el barbijo con filtros
export const GuanteNitrilo: React.FC<FxP> = ({ t, a, m }) => {
  const sag = e(t, m.latex, m.latex + 1.6), bb = spr(t, m.barb, 1);
  const guante = (x: number, col: string, k: number) => (
    <g transform={`translate(${x},640) skewX(${k * 18}) scale(1,${1 - 0.35 * k})`}>
      <path d="M-90,180 L-90,-20 L-110,-140 Q-112,-170 -88,-168 L-62,-60 L-60,-200 Q-58,-230 -30,-228 L-24,-60 L-10,-230 Q-6,-255 22,-250 L30,-60 L46,-210 Q52,-236 78,-228 L80,-40 L90,180 Z" fill={col} stroke="rgba(0,0,0,.3)" strokeWidth={3} />
    </g>
  );
  return (
    <>
      <Svg>
        {guante(560, "#f1e6c8", sag)}
        {guante(1000, "#2f6fd6", 0)}
        {bb > 0.01 && <g transform={`translate(1500,560) scale(${bb})`}><path d="M-150,-30 Q0,-110 150,-30 L130,80 Q0,140 -130,80 Z" fill="#5d6168" stroke="#2c2f33" strokeWidth={4} /><circle cx={-110} cy={60} r={56} fill="#d58a2a" stroke="#2c2f33" strokeWidth={4} /><circle cx={110} cy={60} r={56} fill="#d58a2a" stroke="#2c2f33" strokeWidth={4} /></g>}
      </Svg>
      <Cross t={t} at={m.latex + 1.2} x={560} y={300} r={50} />
      <Tick t={t} at={a + 0.9} x={1000} y={300} r={50} />
      <Lbl t={t} at={m.latex + 0.4} text="látex: se ablanda" x={560} y={940} col={C.red} size={52} />
      <Lbl t={t} at={a + 0.5} text="nitrilo, los azules" x={1000} y={940} col={C.ok} size={52} />
      <Lbl t={t} at={m.barb + 0.4} text="filtro para vapores" x={1500} y={820} col={C.honey} size={50} />
    </>
  );
};

// 18 · medio vaso: el frasco se llena hasta la mitad y el número sube hasta 100 ml; al lado, el vaso de cocina igual
export const MedioVaso: React.FC<FxP> = ({ t, a, m }) => {
  const f = e(t, a + 0.4, a + 2.2), v = e(t, m.vaso, m.vaso + 1);
  return (
    <>
      <Svg>
        <Vaso x={760} y={860} w={360} h={500} lv={0.5 * f} liq="rgba(143,211,255,.35)" lid={false} />
        <path d={`M740,${300} L740,${360 + 0 * f}`} stroke={C.solv} strokeWidth={14 * (1 - e(t, a + 2, a + 2.3))} strokeLinecap="round" />
        <Draw d="M560,610 L960,610" p={e(t, a + 2, a + 2.4)} col={C.sun} w={4} dash="12 10" />
        <g opacity={v}><Vaso x={1300} y={860} w={220} h={360} lv={0.5} liq="rgba(143,211,255,.35)" /></g>
      </Svg>
      <Pop t={t} at={a + 0.6} x={760} y={200}><Big size={130} col={C.solv}>{num(t, a + 0.6, a + 2.2, 0, 100)} ml</Big></Pop>
      <Lbl t={t} at={a + 2.3} text="hasta la mitad" x={760} y={950} col={C.cream} size={54} />
      <Lbl t={t} at={m.vaso + 0.3} text="medio vaso" x={1300} y={950} col={C.honey} size={54} />
    </>
  );
};

// 19 · el frasco traga: la silueta de una caja de zapatos se va vaciando adentro del frasco; el contador de pedazos sube
export const FrascoTraga: React.FC<FxP> = ({ t, a, m }) => {
  const k = e(t, a + 0.3, m.caja + 2), n = Math.floor(k * 60);
  return (
    <>
      <Svg>
        <rect x={250} y={320} width={620 * (1 - k)} height={330 * (1 - k)} rx={8} fill="rgba(246,245,239,.8)" stroke="#a49f93" strokeWidth={4} />
        {Array.from({ length: 8 }, (_, i) => { const u = ((t - a) * 1.2 + i / 8) % 1; return k < 0.98 ? <Telgo key={i} x={lerp(560, 1300, u)} y={lerp(480, 520, u) - 160 * Math.sin(u * Math.PI)} s={50} rot={u * 200} o={1 - u * 0.4} /> : null; })}
        <Vaso x={1300} y={880} w={380} h={500} lv={0.5 + 0.08 * k} liq={`rgba(236,${lerp(200, 225, k)},${lerp(140, 200, k)},.6)`} />
      </Svg>
      <Pop t={t} at={a + 0.4} x={1300} y={240}><Big size={110}>{n} pedazos</Big></Pop>
      <Lbl t={t} at={m.caja} text="más que una caja" x={560} y={760} col={C.honey} size={56} />
      <Lbl t={t} at={m.mas} text="y todavía acepta" x={1300} y={980} col={C.ok} size={50} />
    </>
  );
};

// 20 · el burlete de nylon: con la tapa floja el vapor se escapa (y con él, monedas); el nylon cierra y se corta la fuga
export const BurleteNylon: React.FC<FxP> = ({ t, a, m }) => {
  const ny = e(t, m.nylon, m.nylon + 1.2), leak = 1 - ny;
  return (
    <>
      <Svg>
        <Vaso x={960} y={880} w={380} h={460} lv={0.55} liq="rgba(240,190,110,.45)" />
        <rect x={760} y={360 - 30 * leak} width={400} height={30} rx={8} fill="#b9b2a3" stroke="#5e584d" strokeWidth={3} transform={`rotate(${-6 * leak} 960 390)`} />
        <path d={`M760,${410 - 6 * ny} Q960,${380} 1160,${410 - 6 * ny}`} stroke="rgba(255,255,255,.7)" strokeWidth={8 * ny} fill="none" />
        {Array.from({ length: 8 }, (_, i) => { const u = ((t - a) * 0.5 + i / 8) % 1; return <g key={i} opacity={(1 - u) * leak}><path d={`M${1100 + u * 120},${380 - u * 240} q 12,-16 24,0 t 24,0`} stroke={C.solv} strokeWidth={5} fill="none" />{i % 3 === 0 && <circle cx={1180 + u * 260} cy={360 - u * 200} r={18} fill="#e8c35a" stroke="#8a6a1a" strokeWidth={3} />}</g>; })}
      </Svg>
      <Lbl t={t} at={m.plata} text="se va tu plata" x={1500} y={300} col={C.red} size={60} />
      <Lbl t={t} at={m.nylon + 0.4} text="nylon como burlete" x={960} y={970} col={C.ok} size={56} />
      <Lbl t={t} at={a + 0.4} text="tapá siempre" x={460} y={620} col={C.honey} size={60} />
    </>
  );
};
