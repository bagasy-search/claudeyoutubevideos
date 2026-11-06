// fb5nb · componentes 30-44 (sellado, seguridad, la cuenta, errores, mantenimiento, los casos, Don Aldo, preguntas,
// la rutina y las tres pruebas). f(t) + marcas de la voz.
import React from "react";
import { C, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Cross, Draw, FxP, Svg, Tick, shake } from "./kit";
import { Brillo, Capas, CONT, Gotita, Losa, Moneda, quad, YESO } from "./piso";

const Silla2: React.FC<{ x: number; y: number; s?: number; fel?: number }> = ({ x, y, s = 1, fel = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-110} y={-30} width={220} height={26} rx={6} fill="#9a6233" />
    <rect x={-110} y={-260} width={24} height={240} fill="#7c4a22" /><rect x={-104} y={-6} width={18} height={150} fill="#7c4a22" /><rect x={86} y={-6} width={18} height={150} fill="#7c4a22" />
    <rect x={-110} y={-260} width={120} height={24} fill="#9a6233" /><rect x={-110} y={-190} width={120} height={22} fill="#9a6233" />
    <rect x={-108} y={140} width={24} height={12 * fel} rx={4} fill="#5c7a3a" /><rect x={84} y={140} width={24} height={12 * fel} rx={4} fill="#5c7a3a" />
  </g>
);

// 30 · los poros: el yeso al microscopio con sus poros abiertos; una gota de café entra y mancha; el sellador se mete en
// los poros (se llenan de ámbar) y la segunda gota queda arriba
export const PorosCafe: React.FC<FxP> = ({ t, a, m }) => {
  const c1 = e(t, m.cafe, m.cafe + 1.4), sl = e(t, m.sell, m.sell + 1.6), c2 = e(t, m.sell + 2, m.sell + 2.6);
  return (
    <>
      <Svg>
        <rect x={240} y={480} width={1440} height={380} fill={YESO} />
        {Array.from({ length: 26 }, (_, i) => { const x = 280 + i * 54, h = 50 + 80 * hash(i, 5); return <g key={i}><rect x={x} y={480} width={16} height={h} rx={8} fill="#a59c8a" /><rect x={x} y={480} width={16} height={h * sl} rx={8} fill="#f0b45a" /></g>; })}
        <rect x={240} y={466} width={1440} height={14 * sl} fill="#ffe9b8" opacity={0.7} />
        <ellipse cx={620} cy={500} rx={180 * c1} ry={60 * c1} fill="#5a3416" opacity={0.75 * (1 - sl * 0.2)} />
        {t > m.cafe - 0.6 && t < m.cafe + 0.4 && <circle cx={620} cy={lerp(160, 470, e(t, m.cafe - 0.6, m.cafe))} r={36} fill="#5a3416" />}
        {t > m.sell + 1.4 && <g transform={`translate(1240,${lerp(160, 420, c2)})`}><circle r={46 * (1 - c2)} fill="#5a3416" /></g>}
        {c2 > 0.95 && <ellipse cx={1240} cy={440} rx={70} ry={30} fill="#5a3416" opacity={0.9} />}
      </Svg>
      <Lbl t={t} at={m.cafe + 0.4} text="sin sellar: el café entra" x={620} y={300} col={C.red} size={54} />
      <Lbl t={t} at={m.sell + 2.4} text="sellado: queda arriba" x={1240} y={300} col={C.ok} size={54} />
    </>
  );
};

// 31 · las tres manos: el corte crece capa por capa — la 1ª diluida se HUNDE en el yeso, lija suave, la 2ª hace capa y la
// 3ª va cruzada (las flechas de dirección giran 90°) y prende el brillo final
export const TresManos: React.FC<FxP> = ({ t, a, m }) => {
  const h1 = e(t, a + 0.4, a + 2), s2 = e(t, m.seg, m.seg + 1), s3 = e(t, m.ter, m.ter + 1), lj = t > m.lija && t < m.lija + 2;
  return (
    <>
      <Svg>
        <Capas x={300} y={880} w={1000} capas={[{ h: 240, k: 1, tipo: "yeso" }, { h: 22, k: s2, tipo: "sell", col: "#f6d58f" }, { h: 22, k: s3, tipo: "sell", col: "#ffe3a3" }]} />
        <rect x={300} y={640} width={1000} height={80} fill="#f0b45a" opacity={0.45 * h1} />
        <Brillo id="tm" pts="300,596 1300,596 1300,640 300,640" k={e(t, m.ter + 1, m.ter + 2.6)} o={0.95} />
        {lj && <rect x={lerp(300, 1150, ((t - m.lija) * 0.6) % 1)} y={560} width={150} height={60} rx={10} fill="#dba868" />}
        <g transform="translate(1560,560)">
          <rect x={-170} y={-170} width={340} height={340} rx={20} fill="rgba(255,236,200,.08)" stroke="rgba(255,236,200,.35)" strokeWidth={4} />
          {[-80, 0, 80].map((y) => <path key={y} d={`M-110,${y} L100,${y} M80,${y - 20} L110,${y} L80,${y + 20}`} stroke={C.honey} strokeWidth={8} fill="none" opacity={t < m.ter ? 1 : 0.25} />)}
          {[-80, 0, 80].map((x) => <path key={x} d={`M${x},110 L${x},-100 M${x - 20},-80 L${x},-110 L${x + 20},-80`} stroke={C.ok} strokeWidth={8} fill="none" opacity={s3} />)}
        </g>
      </Svg>
      <Lbl t={t} at={a + 0.5} out={m.seg} text="1ª diluida: entra en el poro" x={800} y={300} col={C.honey} size={58} />
      <Lbl t={t} at={m.seg + 0.2} out={m.ter} text="2ª: hace capa" x={800} y={300} col={C.cream} size={58} />
      <Lbl t={t} at={m.ter + 0.2} text="3ª: cruzada" x={800} y={300} col={C.ok} size={66} />
    </>
  );
};

// 32 · los solventes: la casa con las ventanas de par en par, el vapor que sale; la llama, la estufa y el cigarrillo se
// tachan; guantes y barbijo; los chicos y el perro afuera; el trapo extendido sí, el bollo en el tacho no
export const SeguridadSolvente: React.FC<FxP> = ({ t, a, m }) => {
  const ve = e(t, a + 0.4, a + 1.2), fu = ["llama", "estufa", "cigarrillo"];
  return (
    <>
      <Svg>
        <rect x={240} y={260} width={760} height={560} fill="#3a2c1d" stroke="#f6f1e6" strokeWidth={10} />
        <path d="M220,270 L620,90 L1020,270" fill="none" stroke="#f6f1e6" strokeWidth={10} />
        {[340, 760].map((x) => <g key={x}><rect x={x} y={360} width={140} height={160} fill="#ffe6b0" opacity={0.4} /><rect x={x} y={360} width={70 * (1 - ve)} height={160} fill="#9fb6cc" /><rect x={x + 140 - 70 * (1 - ve)} y={360} width={70 * (1 - ve)} height={160} fill="#9fb6cc" /></g>)}
        {Array.from({ length: 10 }, (_, i) => { const u = ((t - a) * 0.4 + i * 0.1) % 1; return <path key={i} d={`M${410 + (i % 2) * 420 + 80 * u},${440 - 200 * u} q30,-20 60,0`} stroke="#c9e2a0" strokeWidth={8} fill="none" opacity={ve * (1 - u)} />; })}
        {fu.map((w, i) => t > m.fuego + i * 0.35 && <g key={w} transform={`translate(${1180 + i * 220},360) scale(${spr(t, m.fuego + i * 0.35)})`}>
          {i === 0 ? <path d="M0,60 Q-50,0 -10,-60 Q0,-20 20,-40 Q50,10 0,60 Z" fill="#ff8a3a" /> : i === 1 ? <g><rect x={-60} y={-50} width={120} height={110} rx={10} fill="#5f666e" />{[-30, 0, 30].map((x) => <rect key={x} x={x - 8} y={-30} width={16} height={60} fill="#ff6a2a" />)}</g> : <g><rect x={-70} y={-10} width={140} height={22} rx={6} fill="#f6f1e6" /><rect x={50} y={-10} width={20} height={22} fill="#ff6a2a" /></g>}
        </g>)}
        {fu.map((w, i) => <Cross key={w} t={t} at={m.fuego + i * 0.35 + 0.25} x={1180 + i * 220} y={360} r={60} />)}
        {t > m.guan && <g transform={`translate(1300,640) scale(${spr(t, m.guan)})`}><path d="M-80,60 L-80,-40 Q-80,-70 -60,-70 L-60,-110 Q-45,-125 -30,-110 L-30,-120 Q-15,-135 0,-120 L0,-115 Q15,-130 30,-115 L30,-80 Q45,-90 55,-75 L40,60 Z" fill="#2f7fbf" /><path d="M120,-20 Q200,60 280,-20 L280,20 Q200,110 120,20 Z" fill="#f6f5ef" stroke="#5e5547" strokeWidth={4} /></g>}
        {t > m.chicos && <g opacity={cl((t - m.chicos) * 3)} transform={`translate(${lerp(1060, 1240, e(t, m.chicos, m.chicos + 1.5))},960)`}><circle cy={-120} r={30} fill="#d9a27a" /><rect x={-26} y={-90} width={52} height={90} rx={20} fill="#d8352a" /><ellipse cx={90} cy={-30} rx={50} ry={26} fill="#b98d5a" /><circle cx={140} cy={-50} r={20} fill="#b98d5a" /></g>}
        {t > m.trapos && <g transform="translate(1660,960)" opacity={cl((t - m.trapos) * 3)}>
          <line x1={-160} y1={-140} x2={160} y2={-140} stroke="#f6f1e6" strokeWidth={4} /><rect x={-120} y={-140} width={120} height={90} fill="#e2c48a" />
          <rect x={60} y={-60} width={90} height={120} rx={8} fill="#5f666e" /><circle cx={105} cy={-70} r={34} fill="#e2c48a" />
        </g>}
        {t > m.trapos && <><Tick t={t} at={m.trapos + 0.4} x={1600} y={740} r={34} /><Cross t={t} at={m.trapos + 0.8} x={1765} y={800} r={34} /></>}
      </Svg>
      <Lbl t={t} at={a + 0.6} text="ventanas de par en par" x={620} y={900} col={C.cream} size={56} />
      <Lbl t={t} at={m.fuego + 0.2} text="nada de fuego" x={1400} y={220} col={C.red} size={56} />
      <Lbl t={t} at={m.guan + 0.2} text="guantes y barbijo con filtro" x={1400} y={500} col={C.honey} size={46} />
    </>
  );
};

// 33 · la cuenta: el ticket se imprime renglón por renglón (yeso 1,60 · cola 0,45 · sellador 1,00) y el total suma 3,05
export const CuentaMetro: React.FC<FxP> = ({ t, a, m }) => {
  const R: [string, string, number][] = [["yeso · 8 kg", "1,60", m.bolsa + 1], ["cola · 150 cc", "0,45", m.cola + 1.5], ["sellador · ¼ L", "1,00", m.sell + 1.5]];
  const tot = (R.filter(([, , at]) => t > at).reduce((s, [, v]) => s + parseFloat(v.replace(",", ".")), 0)).toFixed(2).replace(".", ",");
  const lg = e(t, a + 0.3, a + 1) * 0.2 + R.reduce((q, [, , at]) => q + 0.14 * e(t, at, at + 0.5), 0) + e(t, m.suma, m.suma + 0.6) * 0.38;
  return (
    <>
      <Svg>
        <g transform="translate(960,140)">
          <path d={`M-360,0 L360,0 L360,${780 * lg} ${Array.from({ length: 18 }, (_, i) => `L${360 - (i + 0.5) * 40},${780 * lg + (i % 2 ? 0 : 18)}`).join(" ")} L-360,${780 * lg} Z`} fill="#f6f1e6" />
          <text y={80} textAnchor="middle" fontSize={56} fontWeight={800} fill="#2b241b" fontFamily="Barlow Condensed">1 m² · 6 mm</text>
          {R.map(([n, v, at], i) => t > at && <g key={n} opacity={cl((t - at) * 4)}>
            <text x={-310} y={200 + i * 110} fontSize={52} fontWeight={700} fill="#2b241b" fontFamily="Barlow">{n}</text>
            <text x={310} y={200 + i * 110} textAnchor="end" fontSize={60} fontWeight={800} fill="#2b241b" fontFamily="Barlow Condensed">US$ {v}</text>
          </g>)}
          {t > m.suma && <><line x1={-320} y1={540} x2={320} y2={540} stroke="#2b241b" strokeWidth={5} strokeDasharray="14 10" />
            <text x={-310} y={650} fontSize={64} fontWeight={800} fill="#2b241b" fontFamily="Barlow Condensed">TOTAL</text>
            <text x={310} y={660} textAnchor="end" fontSize={110} fontWeight={800} fill="#3f7a1e" fontFamily="Barlow Condensed" transform={`translate(0,${shake(t, m.suma + 0.6, 8)})`}>US$ {tot}</text></>}
        </g>
      </Svg>
      <Lbl t={t} at={m.bolsa} out={m.cola} text="bolsa de 40 kg: US$ 8" x={360} y={480} col={C.cream} size={44} />
      <Lbl t={t} at={m.cola} out={m.sell} text="bidón de 4 L: US$ 12" x={360} y={480} col={C.cream} size={44} />
      <Lbl t={t} at={m.sell} out={m.suma} text="1 L de sellador: US$ 4" x={360} y={480} col={C.cream} size={44} />
    </>
  );
};

// 34 · contra el porcelanato: dos columnas que crecen — 3 contra 25-30 — y la de porcelanato se desglosa en sus cuatro
// partes (pieza, pegamento, pastina, colocador)
export const VsPorcelanato: React.FC<FxP> = ({ t, a }) => {
  const g = e(t, a + 0.4, a + 2.2), parts: [string, number, string][] = [["porcelanato", 12, "#c9cbcc"], ["pegamento", 4, "#9aa0a6"], ["pastina", 2, "#7d848c"], ["colocador", 10, "#5f666e"]];
  let acc = 0;
  return (
    <>
      <Svg>
        <line x1={300} y1={880} x2={1620} y2={880} stroke="rgba(255,236,200,.5)" strokeWidth={4} />
        <rect x={500} y={880 - 3 * 22 * g} width={280} height={3 * 22 * g} rx={10} fill={C.ok} />
        {parts.map(([n, v, c]) => { const h = v * 22 * g, y = 880 - acc - h; acc += h; return <g key={n}><rect x={1140} y={y} width={280} height={h} fill={c} stroke="#2b241b" strokeWidth={2} /><text x={1440} y={y + h / 2 + 14} fontSize={36} fontWeight={700} fill={C.cream} fontFamily="Barlow" opacity={g}>{n}</text></g>; })}
      </Svg>
      <Lbl t={t} at={a + 1.4} text="US$ 3" x={640} y={760} col={C.ok} size={90} />
      <Lbl t={t} at={a + 2} text="US$ 25-30" x={1280} y={200} col={C.red} size={90} />
      <Lbl t={t} at={a + 0.4} text="yesonato" x={640} y={950} col={C.cream} size={52} />
      <Lbl t={t} at={a + 0.4} text="porcelanato colocado" x={1280} y={950} col={C.cream} size={52} />
    </>
  );
};

// 35 · los cinco errores: cinco baldosas en fila; cada una se da vuelta al nombrarla y muestra su pictograma en rojo
export const ErroresBaldosa: React.FC<FxP> = ({ t, a, m }) => {
  const E: [string, number][] = [["donde hay agua", m.e1], ["sin imprimar", m.e2], ["re-amasar", m.e3], ["sellar antes", m.e4], ["sin cola", m.e5]];
  return (
    <>
      <Svg>
        {E.map(([n, at], i) => { const f = e(t, at, at + 0.5), sx = Math.abs(Math.cos(f * Math.PI)), fr = f > 0.5; const x = 240 + i * 360; return (
          <g key={n} transform={`translate(${x},520) scale(${sx},1)`}>
            <rect x={-150} y={-190} width={300} height={380} rx={18} fill={fr ? "#2a1c12" : "#e7dfcf"} stroke={fr ? C.red : "#a99f8c"} strokeWidth={6} />
            {!fr && <text y={30} textAnchor="middle" fontSize={140} fontWeight={800} fill="#a99f8c" fontFamily="Barlow Condensed">{i + 1}</text>}
            {fr && (i === 0 ? <g>{[0, 1, 2].map((j) => <path key={j} d={`M${-50 + j * 50},-60 Q${-70 + j * 50},-10 ${-50 + j * 50},10 Q${-30 + j * 50},-10 ${-50 + j * 50},-60`} fill={C.water} />)}</g>
              : i === 1 ? <g><rect x={-100} y={-30} width={200} height={40} fill={YESO} /><rect x={-100} y={10} width={200} height={14} fill="#e9e0cc" /><rect x={-100} y={24} width={200} height={50} fill={CONT} /></g>
              : i === 2 ? <g><rect x={-70} y={-60} width={140} height={110} rx={10} fill={YESO} /><path d="M0,-130 Q-14,-100 0,-80 Q14,-100 0,-130" fill={C.water} /></g>
              : i === 3 ? <g><circle r={70} fill="#f6f1e6" /><line x1={0} y1={0} x2={0} y2={-50} stroke="#2b241b" strokeWidth={8} /><line x1={0} y1={0} x2={36} y2={0} stroke="#2b241b" strokeWidth={8} /></g>
              : <g><rect x={-60} y={-80} width={120} height={150} rx={10} fill="#f8f6f0" /><rect x={-40} y={-30} width={80} height={40} fill="#f0a93a" /></g>)}
          </g>); })}
        {E.map(([n, at], i) => <Cross key={n} t={t} at={at + 0.7} x={240 + i * 360} y={640} r={36} />)}
      </Svg>
      {E.map(([n, at], i) => <Lbl key={n} t={t} at={at + 0.5} text={n} x={240 + i * 360} y={800} col={C.cream} size={40} />)}
    </>
  );
};

// 36 · limpiar: el trapo se retuerce y caen las gotas (casi seco); el balde volcado al piso, la lavandina y el amoníaco
// se tachan
export const LimpiezaNeutra: React.FC<FxP> = ({ t, a, m }) => {
  const tw = e(t, m.trapo, m.trapo + 1.4);
  return (
    <>
      <Svg>
        <g transform="translate(560,420) scale(1.5)">
          <path d={`M-200,0 Q${-100},${-40 * tw} 0,0 T200,0 L200,${120 - 70 * tw} Q100,${160 - 70 * tw} 0,${120 - 70 * tw} T-200,${120 - 70 * tw} Z`} fill="#c9d6c0" />
          {Array.from({ length: 7 }, (_, i) => { const u = ((t - m.trapo) * 1.2 + i * 0.14) % 1; return t > m.trapo && <circle key={i} cx={-120 + i * 40} cy={140 + u * 380} r={10} fill={C.water} opacity={(1 - tw * 0.7) * (1 - u)} />; })}
        </g>
        {t > m.balde && <g transform={`translate(1240,560) rotate(${lerp(0, 100, e(t, m.balde, m.balde + 0.6))})`}><path d="M-110,-130 L110,-130 L90,130 L-90,130 Z" fill="#5f8fbf" /><ellipse cy={-130} rx={110} ry={20} fill="#7cc8ff" /></g>}
        {t > m.lav && ["LAVANDINA", "AMONÍACO"].map((w, i) => <g key={w} transform={`translate(${1440 + i * 200},760) scale(${spr(t, m.lav + i * 0.4)})`}><rect x={-60} y={-130} width={120} height={230} rx={20} fill={i ? "#9fd3ff" : "#f6f5ef"} /><rect x={-24} y={-170} width={48} height={44} rx={6} fill="#d8352a" /><text y={20} textAnchor="middle" fontSize={22} fontWeight={800} fill="#2b241b" fontFamily="Barlow Condensed">{w}</text></g>)}
      </Svg>
      <Cross t={t} at={m.balde + 0.6} x={1240} y={560} r={60} />
      {[0, 1].map((i) => <Cross key={i} t={t} at={m.lav + 0.4 + i * 0.4} x={1440 + i * 200} y={760} r={44} />)}
      <Lbl t={t} at={m.trapo + 0.4} text="trapo casi seco" x={560} y={960} col={C.ok} size={60} />
    </>
  );
};

// 37 · el quincho de Don Ramón: la planta con la parrilla aparte (cerámica) y el resto en yesonato arena que brilla;
// el contador de años corre de 2014 a hoy y la franja de delante de la mesa se renueva a los 2 años
export const QuinchoRamon: React.FC<FxP> = ({ t, a, m }) => {
  const yr = Math.round(lerp(2014, 2026, e(t, m.nietos, m.nietos + 4))), ar = e(t, m.arena, m.arena + 1), rn = e(t, m.ren, m.ren + 1);
  return (
    <>
      <Svg>
        <Losa cx={900} y={300} w={1300} d={520} top={CONT} side="#5e574c">
          {(f) => <g>
            <polygon points={quad(f, 0.72, 0, 1, 0.45)} fill="#9b4b2c" opacity={e(t, m.parr, m.parr + 0.6)} />
            {[0.8, 0.9].map((u) => <line key={u} x1={f(u, 0)[0]} y1={f(u, 0)[1]} x2={f(u, 0.45)[0]} y2={f(u, 0.45)[1]} stroke="#4a3220" strokeWidth={4} opacity={e(t, m.parr, m.parr + 0.6)} />)}
            <polygon points={quad(f, 0, 0, 0.72, 1)} fill="#d8c193" opacity={ar} />
            <polygon points={quad(f, 0.72, 0.45, 1, 1)} fill="#d8c193" opacity={ar} />
            <polygon points={quad(f, 0.2, 0.55, 0.6, 0.75)} fill="#fff1c8" opacity={0.5 * rn} />
            <Brillo id="qr" pts={quad(f, 0, 0, 0.72, 1)} k={((t - m.arena) * 0.25) % 1.3} o={0.6 * ar} />
            <rect x={f(0.3, 0.35)[0]} y={f(0, 0.35)[1]} width={260} height={80} rx={10} fill="#7c4a22" opacity={ar} />
            {t > m.nietos && [0, 1].map((i) => { const u = ((t - m.nietos) * 0.18 + i * 0.5) % 1, p = f(0.1 + 0.55 * u, 0.85 - 0.2 * i); return <circle key={i} cx={p[0]} cy={p[1] - 40} r={24} fill={i ? "#d8352a" : "#2f7fbf"} />; })}
          </g>}
        </Losa>
        <g transform="translate(1660,300)" opacity={cl((t - m.nietos) * 3)}><rect x={-150} y={-70} width={300} height={140} rx={16} fill="rgba(30,20,10,.85)" /><text y={30} textAnchor="middle" fontSize={90} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">{yr}</text></g>
      </Svg>
      <Lbl t={t} at={m.parr + 0.3} text="la parrilla: cerámica" x={1500} y={200} col={C.cream} size={46} />
      <Lbl t={t} at={m.diez + 0.2} text="10 días de secado: era invierno" x={900} y={960} col={C.solv} size={52} />
      <Lbl t={t} at={m.ren + 0.3} text="sellador nuevo a los 2 años" x={900} y={960} col={C.honey} size={52} />
    </>
  );
};

// 38 · la cerámica de los 80: las baldosas marrones con dibujo; dos flojas saltan y se rellenan; el yeso las tapa pero las
// juntas reaparecen como sombras; con 6 mm se borran y queda gris claro continuo
export const JuntasSombra: React.FC<FxP> = ({ t, a, m }) => {
  const fl = e(t, m.flojas, m.flojas + 0.8), ye = e(t, m.flojas + 1.6, m.juntas), so = e(t, m.juntas, m.juntas + 0.8) * (1 - e(t, m.seis, m.seis + 1.2)), gr = e(t, m.gris, m.gris + 1);
  return (
    <>
      <Svg>
        <Losa cx={960} y={300} w={1400} d={540} top="#7a4a2a" side="#4a2c18">
          {(f) => <g>
            {Array.from({ length: 6 * 4 }, (_, i) => { const c = i % 6, r = Math.floor(i / 6), fx = (i === 8 || i === 15) ? fl : 0; const [x, y] = f((c + 0.5) / 6, (r + 0.5) / 4); return <g key={i} transform={`translate(0,${-60 * fx})`} opacity={1 - 0.6 * fx}><circle cx={x} cy={y} r={20} fill="none" stroke="#c98e5a" strokeWidth={4} /><path d={`M${x - 24},${y} L${x},${y - 14} L${x + 24},${y} L${x},${y + 14} Z`} fill="#5a3416" /></g>; })}
            {[1, 2, 3, 4, 5].map((c) => <line key={c} x1={f(c / 6, 0)[0]} y1={f(c / 6, 0)[1]} x2={f(c / 6, 1)[0]} y2={f(c / 6, 1)[1]} stroke="#3a2010" strokeWidth={5} />)}
            {[1, 2, 3].map((r) => <line key={r} x1={f(0, r / 4)[0]} y1={f(0, r / 4)[1]} x2={f(1, r / 4)[0]} y2={f(1, r / 4)[1]} stroke="#3a2010" strokeWidth={5} />)}
            <polygon points={quad(f, 0, 0, 1, 1)} fill={gr > 0.5 ? "#d4d6d6" : YESO} opacity={ye} />
            {[1, 2, 3, 4, 5].map((c) => <line key={`s${c}`} x1={f(c / 6, 0)[0]} y1={f(c / 6, 0)[1]} x2={f(c / 6, 1)[0]} y2={f(c / 6, 1)[1]} stroke="#9a9184" strokeWidth={10} opacity={0.5 * so} />)}
            {[1, 2, 3].map((r) => <line key={`r${r}`} x1={f(0, r / 4)[0]} y1={f(0, r / 4)[1]} x2={f(1, r / 4)[0]} y2={f(1, r / 4)[1]} stroke="#9a9184" strokeWidth={10} opacity={0.5 * so} />)}
            <Brillo id="js" pts={quad(f, 0, 0, 1, 1)} k={e(t, m.gris, m.gris + 3)} o={0.6 * gr} />
          </g>}
        </Losa>
      </Svg>
      <Lbl t={t} at={a + 0.4} out={m.juntas} text="cerámica de los 80" x={960} y={180} col={C.cream} size={60} />
      <Lbl t={t} at={m.juntas + 0.3} out={m.seis} text="las juntas se marcan" x={960} y={180} col={C.red} size={60} />
      <Lbl t={t} at={m.seis + 0.2} text="sobre cerámica: mínimo 6 mm" x={960} y={180} col={C.ok} size={60} />
    </>
  );
};

// 39 · la libreta de Don Aldo: hoja cuadriculada; cada «nunca» se escribe a mano con su dibujito al margen
export const CuatroNuncas: React.FC<FxP> = ({ t, a, m }) => {
  const L: [string, number][] = [["sin la prueba del nylon", a + 0.3], ["mezclar de más", m.mez], ["apurar un secado", m.apu], ["irse sin barrer", m.barr]];
  return (
    <>
      <Svg>
        <g transform="translate(960,540) rotate(-2)">
          <rect x={-560} y={-400} width={1120} height={800} rx={10} fill="#f4eedf" />
          {Array.from({ length: 15 }, (_, i) => <line key={i} x1={-540} y1={-330 + i * 52} x2={540} y2={-330 + i * 52} stroke="#b7c9da" strokeWidth={2} />)}
          <line x1={-420} y1={-400} x2={-420} y2={400} stroke="#e08a8a" strokeWidth={3} />
          <text x={-380} y={-300} fontSize={64} fontWeight={800} fill="#2b3f73" fontFamily="Barlow Condensed">DON ALDO · NUNCA…</text>
          {L.map(([w, at], i) => <g key={w}>
            <text x={-380} y={-170 + i * 150} fontSize={58} fontWeight={700} fill="#2b3f73" fontFamily="Barlow" opacity={e(t, at, at + 0.4)} style={{ clipPath: `inset(0 ${100 - 100 * e(t, at, at + 1.2)}% 0 0)` }}>{`${i + 1}. ${w}`}</text>
            <circle cx={-480} cy={-190 + i * 150} r={26} fill="none" stroke={C.red} strokeWidth={5} opacity={e(t, at + 1, at + 1.3)} />
          </g>)}
        </g>
      </Svg>
    </>
  );
};

// 40 · madera ≠ yeso: las tablas del piso se dilatan y contraen (respiran) y el yeso encima se raja en las juntas
export const MaderaSeMueve: React.FC<FxP> = ({ t, a }) => {
  const mv = Math.sin((t - a) * 2.2) * cl((t - a - 0.5) * 2), rj = e(t, a + 2, a + 3.5);
  return (
    <>
      <Svg>
        {Array.from({ length: 6 }, (_, i) => <rect key={i} x={260 + i * 236 + mv * 8 * (i - 2.5)} y={600} width={220} height={140} fill={i % 2 ? "#9a6233" : "#a86d3a"} stroke="#5e3a1c" strokeWidth={4} />)}
        <rect x={260} y={540} width={1416} height={60} fill={YESO} />
        {[1, 2, 3, 4, 5].map((i) => <Draw key={i} d={`M${260 + i * 236},600 l-8,-18 l12,-14 l-6,-28`} p={rj} col="#2b241b" w={6} />)}
        {[0, 1].map((s) => <path key={s} d={s ? "M1700,670 l60,0 m-20,-20 l20,20 l-20,20" : "M220,670 l-60,0 m20,-20 l-20,20 l20,20"} stroke={C.honey} strokeWidth={8} fill="none" opacity={Math.abs(mv)} />)}
      </Svg>
      <Lbl t={t} at={a + 0.4} text="la madera se mueve" x={960} y={300} col={C.cream} size={70} />
      <Lbl t={t} at={a + 2.2} text="el yeso no: se raja" x={960} y={900} col={C.red} size={70} />
    </>
  );
};

// 41 · la rutina en barras: un diagrama de días 1→15 (+7) con una barra por tarea que se estira al nombrarla
export const RutinaGantt: React.FC<FxP> = ({ t, a, m }) => {
  const R: [string, number, number, number, string][] = [["nylon 24 h", 1, 1, a + 0.3, C.solv], ["limpiar y reparar", 2, 2, m.d2, C.cream], ["imprimación", 3, 3, m.d3, C.milk], ["guías y volcado", 4, 4, m.d4, "#f1ebdf"], ["secado", 5, 11, m.d5, C.water], ["lijado 80·150·220", 12, 12, m.d12, "#dba868"], ["3 manos de sellador", 13, 15, m.d13, C.honey], ["muebles con fieltro", 22, 22, m.sem, C.ok]];
  const X = (d: number) => 420 + (d - 1) * 62;
  return (
    <>
      <Svg>
        {Array.from({ length: 22 }, (_, i) => <g key={i}><line x1={X(i + 1)} y1={170} x2={X(i + 1)} y2={930} stroke="rgba(255,236,200,.12)" strokeWidth={2} /><text x={X(i + 1) + 31} y={160} textAnchor="middle" fontSize={26} fontWeight={700} fill="rgba(255,236,200,.55)" fontFamily="Barlow">{i + 1}</text></g>)}
        {R.map(([n, d0, d1, at, c], i) => <g key={n}>
          <rect x={X(d0) + 4} y={200 + i * 90} width={(X(d1 + 1) - X(d0) - 8) * e(t, at, at + 0.6)} height={60} rx={12} fill={c} />
          <text x={400} y={242 + i * 90} textAnchor="end" fontSize={34} fontWeight={700} fill={C.cream} fontFamily="Barlow" opacity={e(t, at, at + 0.3)}>{n}</text>
        </g>)}
      </Svg>
    </>
  );
};

// 42 · la prueba de la moneda: a la izquierda yeso sin cola ni sellador (la moneda deja raya blanca al toque); a la derecha
// el yesonato (nada; la marquita se va con el dedo)
export const PruebaMoneda: React.FC<FxP> = ({ t, a, b }) => {
  const r1 = e(t, a + 0.6, a + 2), r2 = e(t, a + 2.4, a + 3.8), dd = e(t, a + 4.2, a + 5.2);
  return (
    <>
      <Svg>
        <rect x={200} y={460} width={700} height={300} fill="#ece6d8" />
        <rect x={1020} y={460} width={700} height={300} fill="#e9e1cf" />
        <rect x={1020} y={460} width={700} height={14} fill="#ffe9b8" opacity={0.8} />
        <Draw d="M260,600 Q550,580 840,610" p={r1} col="#fff" w={16} />
        <Draw d="M1080,600 Q1370,580 1660,610" p={r2} col="#d9cdb4" w={4 * (1 - dd)} />
        {r1 > 0 && r1 < 1 && <Moneda x={lerp(260, 840, r1)} y={540} r={70} rot={-70} />}
        {r2 > 0 && r2 < 1 && <Moneda x={lerp(1080, 1660, r2)} y={540} r={70} rot={-70} />}
        {dd > 0 && dd < 1 && <ellipse cx={lerp(1100, 1640, dd)} cy={600} rx={50} ry={30} fill="#d9a27a" />}
      </Svg>
      <Lbl t={t} at={a + 0.3} text="yeso solo" x={550} y={380} col={C.red} size={56} />
      <Lbl t={t} at={a + 0.3} text="yesonato" x={1370} y={380} col={C.ok} size={56} />
      <Cross t={t} at={a + 2} x={550} y={860} r={44} />
      <Tick t={t} at={a + 5.2} x={1370} y={860} r={48} />
    </>
  );
};

// 43 · la prueba del agua: la gota cae y queda en bolita; el reloj marca 10 min (no una noche); el trapo la seca y no
// queda aureola
export const PruebaAgua: React.FC<FxP> = ({ t, a, m }) => {
  const ca = e(t, a + 0.3, a + 0.9), rl = e(t, m.bol, m.bol + 2.4), tr = e(t, m.seca, m.seca + 1.2);
  return (
    <>
      <Svg>
        <Losa cx={860} y={420} w={1200} d={440} top="#e9e1cf" side="#a99f8c">
          {(f) => <Brillo id="pa" pts={quad(f, 0, 0, 1, 1)} k={((t - a) * 0.2) % 1.2} o={0.5} />}
        </Losa>
        {ca < 1 && <circle cx={860} cy={lerp(120, 640, ca)} r={30} fill="rgba(140,205,255,.85)" />}
        {ca >= 1 && tr < 0.6 && <Gotita x={860} y={660} r={70} />}
        {t > m.seca && <g transform={`translate(${lerp(500, 1200, tr)},630)`}><path d="M-120,-30 Q0,-70 120,-30 L110,40 Q0,0 -110,40 Z" fill="#c9d6c0" /></g>}
        <g transform="translate(1620,380)" opacity={cl((t - m.bol) * 3)}><circle r={120} fill="#f6f1e6" stroke="#5e5547" strokeWidth={8} /><path d={`M0,0 L0,-120 A120,120 0 0,1 ${120 * Math.sin(rl * 2.1)},${-120 * Math.cos(rl * 2.1)} Z`} fill={C.solv} opacity={0.8} /><text y={200} textAnchor="middle" fontSize={56} fontWeight={800} fill={C.ink} fontFamily="Barlow Condensed">10 MIN</text></g>
      </Svg>
      <Lbl t={t} at={m.bol + 0.3} text="queda en bolita" x={860} y={300} col={C.solv} size={62} />
      <Lbl t={t} at={m.seca + 1.2} text="sin mancha, sin aureola" x={860} y={960} col={C.ok} size={60} />
    </>
  );
};

// 44 · la prueba de la silla: la silla se arrastra hacia atrás; sin fieltro deja una raya fina en el sellador; con fieltro
// se desliza y no deja nada
export const PruebaSilla: React.FC<FxP> = ({ t, a, m }) => {
  const d1 = e(t, m.sin + 0.3, m.sin + 1.6), d2 = e(t, m.con + 0.4, m.con + 1.7), fase2 = t > m.con;
  const x = fase2 ? lerp(700, 1300, d2) : lerp(700, 1300, d1);
  return (
    <>
      <Svg>
        <Losa cx={960} y={600} w={1700} d={360} top="#e9e1cf" side="#a99f8c">
          {(f) => <Brillo id="ps" pts={quad(f, 0, 0, 1, 1)} k={((t - a) * 0.2) % 1.2} o={0.45} />}
        </Losa>
        <line x1={700} y1={850} x2={lerp(700, 1300, d1)} y2={850} stroke="#b1a68f" strokeWidth={4} opacity={fase2 ? 0.5 : 1} />
        <Silla2 x={x - 100} y={700} s={1} fel={fase2 ? e(t, m.con, m.con + 0.4) : 0} />
        <circle cx={x - 100} cy={420} r={50} fill="#d9a27a" /><rect x={x - 160} y={470} width={120} height={180} rx={30} fill="#3b4f6b" />
      </Svg>
      <Lbl t={t} at={m.sin + 0.3} out={m.con} text="sin fieltros: raya fina" x={960} y={220} col={C.red} size={62} />
      <Lbl t={t} at={m.con + 0.3} text="con fieltros: nada" x={960} y={220} col={C.ok} size={62} />
    </>
  );
};
