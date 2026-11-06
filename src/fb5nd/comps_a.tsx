// fb5nd · componentes 1-16 (gancho, premio, contrapiso, diagnóstico, preparación). Cada uno es f(t) y sigue la voz por sus
// marcas (m.*). Ninguno se repite con cl2nov ni con fb5na/fb5nb/fb5nc.
import React from "react";
import { C, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Cross, FxP, Svg, Tick, shake } from "./kit";
import { Balde, Bolsa, MAD, quad, Tarja } from "./piso";
import { Colador, Cuarto, CONTRA, Fratas, LlanaAcero, MangueraU, Mano, Piso } from "./cem";

// 1 · el piso partido al medio: a la izquierda contrapiso con piedritas que raspa la mano; a la derecha, liso, y aparece
// la ventana reflejada
export const RaspaVsReflejo: React.FC<FxP> = ({ t, m }) => {
  const mx = lerp(300, 820, e(t, m.raspa, m.raspa + 1.6)), lis = e(t, m.otro, m.otro + 1.2), ven = e(t, m.ven, m.ven + 1.4);
  const sh = t > m.raspa && t < m.raspa + 1.6 ? 3 * Math.sin(t * 70) : 0;
  return (
    <>
      <Svg>
        <Cuarto luz={0.6 + 0.4 * ven} />
        <g transform={`translate(0,${sh})`}>
          <Piso cx={560} y={460} w={820} d={420} rug={1} seed={2} />
          <g opacity={lis} transform={`translate(${(1 - lis) * 200},0)`}><Piso cx={1360} y={460} w={820} d={420} brillo={ven} t={t} /></g>
          {t > m.raspa - 0.4 && <Mano x={mx} y={720} rot={80} s={0.9} />}
          {t > m.raspa && Array.from({ length: 10 }, (_, i) => { const u = cl((t - m.raspa - i * 0.12) / 0.9); return u > 0 && u < 1 && <circle key={i} cx={mx - 60 - u * 80} cy={700 + 40 * hash(i, 1) - u * 60} r={4} fill="#a3927a" opacity={1 - u} />; })}
        </g>
      </Svg>
      <Lbl t={t} at={m.asp} out={m.otro} text="áspero" x={560} y={980} col={C.cream} size={80} />
      <Lbl t={t} at={m.liso} text="liso" x={1360} y={980} col={C.ok} size={80} />
      <Lbl t={t} at={m.ven} text="la ventana, en el piso" x={1360} y={180} col={C.sun} size={58} />
    </>
  );
};

// 2 · tres etiquetas de lo que NO es (porcelanato, resina, pulido a máquina) caen y se tachan; queda la bolsa de cemento
// y un reloj que marca los últimos 20 minutos
export const NoEsLoQueDicen: React.FC<FxP> = ({ t, m }) => {
  const it: [string, number][] = [["porcelanato", m.porc], ["resina", m.res + 0.5], ["pulido a máquina", m.pul]];
  const fuera = e(t, m.bol - 0.5, m.bol + 0.2), rel = e(t, m.min, m.min + 2);
  return (
    <>
      <Svg>
        {it.map(([w, at], i) => t > at && <g key={w} opacity={1 - fuera} transform={`translate(${380 + i * 580},${lerp(-200, 360, spr(t, at, 0.9))}) rotate(${(i - 1) * 5})`}><Tarja x={0} y={0} txt={w} w={480} size={50} /></g>)}
        {t > m.bol - 0.3 && <g transform={`translate(700,${lerp(1300, 640, spr(t, m.bol - 0.3, 0.8))})`}><Bolsa x={0} y={0} s={1.25} kg="EL DE LA BOLSA" /></g>}
        {t > m.min - 0.2 && <g transform={`translate(1260,620) scale(${spr(t, m.min - 0.2)})`}>
          <circle r={190} fill="rgba(30,20,10,.85)" stroke={C.cream} strokeWidth={10} />
          <path d={`M0,0 L0,-170 A170,170 0 ${rel > 0.5 ? 1 : 0} 1 ${170 * Math.sin(rel * Math.PI * 0.66 * 2)},${-170 * Math.cos(rel * Math.PI * 0.66 * 2)} Z`} fill={C.honey} opacity={0.7} />
          <line x1={0} y1={0} x2={0} y2={-150} stroke={C.ink} strokeWidth={10} strokeLinecap="round" transform={`rotate(${rel * 240})`} />
          <text y={260} textAnchor="middle" fontSize={64} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">20 MIN</text>
        </g>}
      </Svg>
      {it.map(([w, at], i) => <Cross key={w} t={t * (1 - fuera) + fuera * 0} at={at + 0.6} x={380 + i * 580} y={360} r={60} />)}
    </>
  );
};

// 3 · la carpeta mate de cerca: el colador espolvorea como azúcar, entra la llana de acero y abre el espejo; el reloj de
// arena (el momento) y una huella del pie que apenas marca
export const AzucarSobreLaCarpeta: React.FC<FxP> = ({ t, m }) => {
  const pol = e(t, m.azu, m.azu + 2.5), ll = e(t, m.lla, m.lla + 3), lx = lerp(400, 1500, ll), pie = e(t, m.pie, m.pie + 1);
  return (
    <>
      <Svg>
        <Cuarto luz={0.4 + 0.6 * ll} />
        <Piso cx={960} y={450} w={1600} d={560} brillo={cl(ll * 1.3) * 0.9} t={t}>
          {(f) => <>
            {pol > 0 && Array.from({ length: 160 }, (_, i) => { const [x, y] = f(hash(i, 3), hash(i, 4)); const ok = hash(i, 5) < pol; return ok && <circle key={i} cx={x} cy={y} r={2.5} fill="#e7e2d8" opacity={1 - cl((lx - x) / 300 + 0.4) * (ll > 0 ? 1 : 0)} />; })}
            {pie > 0.02 && <ellipse cx={f(0.78, 0.6)[0]} cy={f(0.78, 0.6)[1]} rx={50} ry={26} fill="rgba(40,30,20,.16)" opacity={pie} />}
          </>}
        </Piso>
        {t > m.esp && t < m.lla + 0.4 && <Colador x={lerp(500, 1300, e(t, m.esp, m.lla))} y={300} t={t} k={1 - e(t, m.lla - 0.5, m.lla)} />}
        {t > m.lla - 0.3 && <LlanaAcero x={lx} y={760 + 30 * Math.sin(t * 4)} rot={-8 + 10 * Math.sin(t * 3)} brillo={0.8} />}
        {t > m.mom && <g transform={`translate(1700,240) scale(${spr(t, m.mom) * 0.9})`}>
          <path d="M-70,-110 L70,-110 L10,0 L70,110 L-70,110 L-10,0 Z" fill="rgba(214,240,255,.18)" stroke={C.cream} strokeWidth={8} />
          <path d={`M${-50 * (1 - e(t, m.mom, m.mom + 4))},-90 L${50 * (1 - e(t, m.mom, m.mom + 4))},-90 L0,-6 Z`} fill={C.sun} />
          <path d={`M-50,100 L50,100 L${30 * e(t, m.mom, m.mom + 4)},${100 - 80 * e(t, m.mom, m.mom + 4)} L${-30 * e(t, m.mom, m.mom + 4)},${100 - 80 * e(t, m.mom, m.mom + 4)} Z`} fill={C.sun} />
        </g>}
      </Svg>
      <Lbl t={t} at={m.esp} text="espolvoreado" x={560} y={160} col={C.honey} size={76} />
      <Lbl t={t} at={m.pie} text="la prueba del pie" x={1440} y={960} col={C.ok} size={58} />
    </>
  );
};

// 4 · el contrapiso EN CORTE: tierra, cascote que cae y se acomoda, arena y cemento; arriba flotan las capas que van
// encima (cerámica, madera, porcelanato) y se abren: queda pelado, con piedritas
export const ContrapisoPorDentro: React.FC<FxP> = ({ t, m }) => {
  const cas = e(t, m.cas, m.cas + 2.4), vue = e(t, m.pie - 0.3, m.pie + 0.8);
  const cap: [string, string][] = [["cerámica", "#c47a52"], ["madera", "#9a6233"], ["porcelanato", "#d8d4cc"]];
  return (
    <>
      <Svg>
        <rect x={360} y={760} width={1200} height={220} fill="#4a3420" />
        {Array.from({ length: 70 }, (_, i) => { const tt = cl(cas * 1.6 - hash(i, 2) * 0.6), x = 380 + hash(i, 3) * 1160, y = lerp(200, 640 + hash(i, 4) * 100, tt); return tt > 0 && <polygon key={i} points={`${x - 22},${y} ${x - 8},${y - 24} ${x + 18},${y - 14} ${x + 22},${y + 10} ${x},${y + 18}`} fill={hash(i, 5) > 0.5 ? "#b86a44" : "#9c5a38"} />; })}
        <rect x={360} y={600} width={1200} height={160} fill={CONTRA} opacity={0.55 * cas} />
        {cap.map(([w, col], i) => t > m.arr - 0.2 + i * 0.3 && <g key={w} transform={`translate(${960 + (i - 1) * 420 * vue},${lerp(560 - i * 34, 120 + i * 60, vue)}) scale(${spr(t, m.arr + i * 0.3)})`} opacity={1 - vue * 0.85}>
          <rect x={-560 + (i * 0)} y={-16} width={1120 - vue * 700} height={30} rx={4} fill={col} stroke="rgba(0,0,0,.3)" strokeWidth={3} />
        </g>)}
        {vue > 0.05 && Array.from({ length: 22 }, (_, i) => <ellipse key={i} cx={390 + i * 54} cy={598 - 6 * hash(i, 9)} rx={10 + 8 * hash(i, 8)} ry={7} fill="#a3927a" opacity={vue} />)}
      </Svg>
      <Lbl t={t} at={m.base} text="la base" x={960} y={1010} col={C.cream} size={64} />
      <Lbl t={t} at={m.pie} text="piedritas a la vista" x={960} y={500} col={C.honey} size={66} />
    </>
  );
};

// 5 · el cuarto con muebles: el contrapiso larga polvo que sube y se posa en la mesa; el trapo se engancha y se rasga
export const PolvoEnLosMuebles: React.FC<FxP> = ({ t, m }) => {
  const pol = e(t, m.pol, m.mue + 1), tr = e(t, m.tra, m.tra + 1.6), deg = cl((t - m.mue) / 3);
  return (
    <>
      <Svg>
        <Cuarto />
        <Piso cx={960} y={450} w={1500} d={520} rug={1}>
          {(f) => <>{t > m.mug && Array.from({ length: 30 }, (_, i) => { const [x, y] = f(hash(i, 7), hash(i, 8)); return <circle key={i} cx={x} cy={y} r={7} fill="#3a2e22" opacity={e(t, m.mug + i * 0.03, m.mug + 0.3 + i * 0.03)} />; })}</>}
        </Piso>
        <g transform="translate(1340,560)">
          <rect x={-200} y={-30} width={400} height={30} rx={6} fill={MAD} /><rect x={-180} y={0} width={24} height={170} fill="#5e3a1c" /><rect x={156} y={0} width={24} height={170} fill="#5e3a1c" />
          <rect x={-200} y={-34} width={400} height={8} fill="#d8cfbd" opacity={0.8 * deg} />
          <rect x={-60} y={-110} width={120} height={80} rx={10} fill="#e9e1cf" /><rect x={-60} y={-110} width={120} height={80} rx={10} fill="#d8cfbd" opacity={0.8 * deg} />
        </g>
        {Array.from({ length: 60 }, (_, i) => { const ph = (t * 0.25 + hash(i, 2)) % 1, x = 380 + hash(i, 3) * 1160 + 40 * Math.sin(t + i); return <circle key={i} cx={x} cy={900 - ph * 600} r={2 + 3 * hash(i, 4)} fill="#e6dccb" opacity={pol * (1 - ph) * 0.8} />; })}
        {t > m.tra - 0.3 && <g transform={`translate(${lerp(400, 820, tr)},${830 + shake(t, m.tra + 1.2, 10)})`}>
          <path d={`M-90,-50 L90,-50 L90,50 ${tr > 0.75 ? "L30,20 L0,60 L-30,20" : ""} L-90,50 Z`} fill="#c9a8d8" stroke="#8a6a9a" strokeWidth={4} />
          {tr > 0.75 && [0, 1, 2].map((i) => <line key={i} x1={-20 + i * 20} y1={50} x2={-26 + i * 22} y2={80} stroke="#8a6a9a" strokeWidth={3} />)}
        </g>}
      </Svg>
      <Lbl t={t} at={m.tra + 1.2} text="se engancha" x={620} y={1000} col={C.red} size={56} />
      <Lbl t={t} at={m.mue} text="polvo en los muebles" x={1340} y={330} col={C.cream} size={58} />
    </>
  );
};

// 6 · la lechada finita encima, el secador de goma la deja brillante; a la semana se levanta en cáscaras que saltan
// como esmalte de plato viejo
export const CascaraQueSalta: React.FC<FxP> = ({ t, m }) => {
  const lec = e(t, m.lech, m.lech + 1.5), sx = lerp(260, 1660, e(t, m.sec, m.sec + 2.2)), cas = e(t, m.cas, m.cas + 2.5);
  return (
    <>
      <Svg>
        <Piso cx={960} y={380} w={1500} d={560} rug={1 - lec * 0.6} brillo={lec * 0.5 * (1 - cas)} t={t}>
          {(f) => <>
            {lec > 0.02 && <polygon points={quad(f, 0, 0, cl((sx - 210) / 1500 + 0.05), 1)} fill="#b5ad9f" opacity={0.8 * lec} />}
            {cas > 0.02 && Array.from({ length: 26 }, (_, i) => { const [x, y] = f(0.08 + (i % 7) * 0.13, 0.12 + Math.floor(i / 7) * 0.24), up = cl(cas * 1.4 - hash(i, 3) * 0.4); const r = 34 + 18 * hash(i, 4); return <g key={i} transform={`translate(${x},${y - up * 80 * hash(i, 5)}) rotate(${up * 40 * (hash(i, 6) - 0.5)})`}>
              <polygon points={`${-r},0 ${-r * 0.3},${-r * 0.5} ${r * 0.6},${-r * 0.4} ${r},${r * 0.1} ${r * 0.2},${r * 0.5}`} fill="#cbc4b6" stroke="#6e6658" strokeWidth={3} opacity={up > 0.05 ? 1 : 0} />
              {up > 0.05 && <polygon points={`${-r},12 ${r},20 ${r * 0.2},${r * 0.5 + 12}`} fill="rgba(0,0,0,.25)" />}
            </g>; })}
          </>}
        </Piso>
        {t > m.sec - 0.2 && t < m.sem && <g transform={`translate(${sx},560)`}><rect x={-20} y={-300} width={20} height={300} fill="#b98a55" /><rect x={-150} y={-10} width={300} height={34} rx={6} fill="#2f2f2f" /></g>}
        {t > m.sem - 0.3 && <g transform={`translate(1620,200) scale(${spr(t, m.sem - 0.3) * 0.9})`}>
          <rect x={-130} y={-110} width={260} height={220} rx={16} fill="#f2e3bf" stroke="#9c7a45" strokeWidth={6} />
          <rect x={-130} y={-110} width={260} height={56} rx={16} fill={C.red} />
          <text y={50} textAnchor="middle" fontSize={88} fontWeight={800} fill="#2b1a0c" fontFamily="Barlow Condensed">+7</text>
          <text y={96} textAnchor="middle" fontSize={30} fontWeight={700} fill="#6c5a3c" fontFamily="Barlow">DÍAS</text>
        </g>}
      </Svg>
      <Lbl t={t} at={m.lech} out={m.sem} text="lechada sola" x={560} y={240} col={C.cream} size={64} />
      <Lbl t={t} at={m.plat} text="como un plato viejo" x={960} y={1000} col={C.red} size={62} />
    </>
  );
};

// 7 · prueba del golpe: el martillo cae en tres puntos; ondas de sonido sólidas (seco) o huecas con eco; el pedazo hueco
// se marca con tiza y se rompe
export const OidoAlPiso: React.FC<FxP> = ({ t, m }) => {
  const P0 = [[640, 640, m.seco], [1240, 720, m.hue]] as [number, number, number][];
  const rom = e(t, m.romp, m.romp + 1.5);
  return (
    <>
      <Svg>
        <Piso cx={960} y={380} w={1500} d={560} rug={1}>
          {(f) => <>
            <polygon points={quad(f, 0.52, 0.42, 0.78, 0.82)} fill="#5a4c3b" opacity={0.3} />
            {t > m.hue + 1 && <polygon points={quad(f, 0.52, 0.42, 0.78, 0.82)} fill="none" stroke="#f6f5ef" strokeWidth={7} strokeDasharray="20 12" opacity={1 - rom} />}
            {rom > 0.02 && Array.from({ length: 12 }, (_, i) => { const [x, y] = f(0.54 + (i % 4) * 0.065, 0.46 + Math.floor(i / 4) * 0.12); return <polygon key={i} transform={`translate(${x},${y - rom * 120 * hash(i, 2)}) rotate(${rom * 70 * (hash(i, 3) - 0.5)})`} points="-40,-20 30,-30 46,12 -10,32 -44,10" fill={CONTRA} stroke="#4a3e30" strokeWidth={3} />; })}
          </>}
        </Piso>
        {P0.map(([x, y, at], i) => {
          const u = t - at, hit = u > 0 && u < 0.25;
          return <g key={i}>
            {t > at - 1.2 && t < at + 2.5 && <g transform={`translate(${x + 40},${y - 40 - (hit ? 0 : 120 * Math.abs(Math.sin((t - at) * 3)))}) rotate(-30)`}><rect x={-12} y={-260} width={24} height={240} rx={8} fill="#b98a55" /><rect x={-60} y={-40} width={120} height={50} rx={6} fill="#555b61" /></g>}
            {u > 0 && u < 2.4 && [0, 1, 2].map((k) => { const r = (u * 260 + k * 80) % 400; return <ellipse key={k} cx={x} cy={y} rx={r} ry={r * 0.35} fill="none" stroke={i ? C.red : C.ok} strokeWidth={i ? 4 : 9} strokeDasharray={i ? "14 18" : undefined} opacity={(1 - r / 400) * (1 - cl(u / 2.4))} />; })}
          </g>;
        })}
      </Svg>
      <Lbl t={t} at={m.seco} text="seco · macizo" x={640} y={300} col={C.ok} size={66} />
      <Lbl t={t} at={m.hue} text="hueco · a cajón" x={1260} y={300} col={C.red} size={66} />
    </>
  );
};

// 8 · prueba del destornillador: rayón en dos muestras (primer plano); una raya y queda, la otra se desgrana en arena;
// se raspa la capa floja hasta lo firme
export const PuntaQueRaya: React.FC<FxP> = ({ t, m }) => {
  const r1 = e(t, m.raya, m.raya + 1.4), r2 = e(t, m.desg, m.desg + 1.4), sac = e(t, m.sac, m.sac + 2.5);
  const Muestra: React.FC<{ x: number; k: number; floja: boolean }> = ({ x, k, floja }) => (
    <g transform={`translate(${x},560)`}>
      <rect x={-330} y={-180} width={660} height={360} rx={18} fill={CONTRA} stroke="#4a3e30" strokeWidth={5} />
      {Array.from({ length: 26 }, (_, i) => <ellipse key={i} cx={-300 + hash(i, 2 + x) * 600} cy={-150 + hash(i, 3 + x) * 300} rx={8 + 8 * hash(i, 4)} ry={6} fill="#a3927a" />)}
      <path d={`M-260,-40 L${-260 + 520 * k},${-40 + 60 * k}`} stroke={floja ? "#3a2e22" : "#d8cfbd"} strokeWidth={floja ? 26 : 6} strokeLinecap="round" />
      {floja && Array.from({ length: 30 }, (_, i) => { const u = cl(k * 1.3 - i / 30); return <circle key={i} cx={-260 + 520 * (i / 30) + 10 * Math.sin(i)} cy={-20 + 60 * (i / 30) + u * 140} r={4} fill="#b5a68f" opacity={u > 0 ? 1 - u * 0.5 : 0} />; })}
      {floja && sac > 0.02 && <rect x={-330} y={-180} width={660 * sac} height={60} fill="#8f8473" />}
      <g transform={`translate(${-260 + 520 * k},${-40 + 60 * k}) rotate(-50)`}><rect x={-8} y={-170} width={16} height={170} fill="#9aa2a9" /><rect x={-26} y={-330} width={52} height={170} rx={20} fill={floja ? C.red : "#e7b23a"} /></g>
    </g>
  );
  return (
    <>
      <Svg><Muestra x={540} k={r1} floja={false} /><Muestra x={1380} k={r2} floja /></Svg>
      <Tick t={t} at={m.bien + 0.4} x={540} y={860} r={50} />
      <Cross t={t} at={m.desg + 1.2} x={1380} y={860} r={50} />
      <Lbl t={t} at={m.bien} text="raya y no se desarma" x={540} y={250} col={C.ok} size={52} />
      <Lbl t={t} at={m.desg} text="se desgrana" x={1380} y={250} col={C.red} size={52} />
      <Lbl t={t} at={m.sac} text="hasta lo firme" x={1380} y={980} col={C.cream} size={52} />
    </>
  );
};

// 9 · prueba del nylon: cuadrado de nylon con cinta en los cuatro bordes; la luna cruza (una noche); por debajo aparecen
// gotitas y flechas que suben del suelo
export const NylonDeUnaNoche: React.FC<FxP> = ({ t, m }) => {
  const cin = e(t, m.cin, m.cin + 1.6), noc = e(t, m.noc, m.got), got = e(t, m.got, m.got + 1.5), sub = e(t, m.sube, m.sube + 2);
  return (
    <>
      <Svg>
        <rect x={0} y={0} width={1920} height={1080} fill="#0b1022" opacity={Math.sin(noc * Math.PI) * 0.55} />
        {noc > 0.02 && noc < 0.98 && <g transform={`translate(${lerp(200, 1720, noc)},${200 - 120 * Math.sin(noc * Math.PI)})`}><circle r={60} fill="#f4f1e8" /><circle cx={24} cy={-10} r={52} fill="#0b1022" opacity={0.6} /></g>}
        <Piso cx={960} y={420} w={1400} d={520} rug={0.8}>
          {(f) => <>
            <polygon points={quad(f, 0.28, 0.2, 0.72, 0.8)} fill="rgba(214,240,255,.22)" stroke="rgba(255,255,255,.5)" strokeWidth={3} />
            {[[0.28, 0.2, 0.72, 0.24], [0.28, 0.76, 0.72, 0.8], [0.28, 0.2, 0.32, 0.8], [0.68, 0.2, 0.72, 0.8]].map(([a0, b0, a1, b1], i) => <polygon key={i} points={quad(f, a0, b0, lerp(a0, a1, cl(cin * 4 - i)), lerp(b0, b1, cl(cin * 4 - i)))} fill="#d8b860" />)}
            {got > 0.02 && Array.from({ length: 40 }, (_, i) => { const [x, y] = f(0.33 + 0.34 * hash(i, 3), 0.27 + 0.48 * hash(i, 4)); return <circle key={i} cx={x} cy={y} r={(4 + 6 * hash(i, 5)) * cl(got * 2 - hash(i, 6))} fill="#cfefff" stroke="#7cc8ff" strokeWidth={2} />; })}
          </>}
        </Piso>
        {sub > 0.02 && [560, 760, 960, 1160, 1360].map((x, i) => { const ph = (t * 0.6 + i * 0.2) % 1; return <path key={i} d={`M${x},${1060 - ph * 160} l-18,30 m18,-30 l18,30`} stroke={C.water} strokeWidth={8} fill="none" strokeLinecap="round" opacity={sub * (1 - ph)} />; })}
      </Svg>
      <Lbl t={t} at={m.noc} out={m.got} text="una noche" x={960} y={140} col={C.cream} size={64} />
      <Lbl t={t} at={m.sube} text="humedad que sube" x={960} y={140} col={C.water} size={64} />
    </>
  );
};

// 10 · la regla de aluminio sobre el piso; la linterna barre por detrás y la luz pasa por debajo donde hay pozo; una flecha
// clava el punto más alto
export const LuzBajoLaRegla: React.FC<FxP> = ({ t, m }) => {
  const lx = lerp(300, 1620, e(t, m.lin, m.lin + 4)), alt = spr(t, m.alto);
  const prof = (x: number) => 720 + 26 * Math.sin((x - 300) / 210) + 14 * Math.sin((x - 300) / 90);
  const pts = Array.from({ length: 60 }, (_, i) => { const x = 300 + i * 22.4; return `${x},${prof(x)}`; }).join(" ");
  return (
    <>
      <Svg>
        <polygon points={`300,1000 ${pts} 1620,1000`} fill={CONTRA} />
        {t > m.reg - 0.3 && <g transform={`translate(0,${-200 * (1 - spr(t, m.reg - 0.3))})`}><rect x={300} y={672} width={1320} height={22} rx={3} fill="#c8ccd0" stroke="#7d848c" strokeWidth={3} /></g>}
        {t > m.lin && <>
          <defs><radialGradient id="ltn"><stop offset="0" stopColor="#fff6c8" stopOpacity={0.9} /><stop offset="1" stopColor="#fff6c8" stopOpacity={0} /></radialGradient></defs>
          <ellipse cx={lx} cy={706} rx={160} ry={60} fill="url(#ltn)" />
          {Array.from({ length: 60 }, (_, i) => { const x = 300 + i * 22.4, gap = prof(x) - 694; return gap > 14 && Math.abs(x - lx) < 170 && <rect key={i} x={x} y={694} width={22} height={gap} fill="#fff1a8" opacity={0.8 * (1 - Math.abs(x - lx) / 170)} />; })}
          <g transform={`translate(${lx},420)`}><rect x={-40} y={-30} width={120} height={60} rx={14} fill="#333" /><circle cx={-40} cy={0} r={30} fill="#fff6c8" /></g>
        </>}
        {t > m.alto && <g transform={`translate(${300 + 210 * Math.PI * 1.5 - 0},${600 - 40 * alt})`}><path d="M0,0 l-26,-50 h52 z" fill={C.red} /><text y={-70} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.red} fontFamily="Barlow Condensed">LO MÁS ALTO</text></g>}
      </Svg>
      <Lbl t={t} at={m.reg} text="regla de 2 m" x={960} y={180} col={C.cream} size={64} />
      <Lbl t={t} at={m.luz} text="más de 2 cm de luz" x={960} y={950} col={C.sun} size={60} />
    </>
  );
};

// 11 · limpieza: la escoba barre el polvo en olas, la aspiradora lo chupa; una curita en tiza no pega (con talco); la
// mancha de grasa se marca en rojo
export const CuritaConTalco: React.FC<FxP> = ({ t, m }) => {
  const bx = lerp(260, 1660, e(t, m.esc, m.esc + 5)), cur = spr(t, m.cur), tal = e(t, m.tal, m.tal + 1.4), gra = spr(t, m.gra);
  return (
    <>
      <Svg>
        <Piso cx={960} y={420} w={1500} d={520} rug={1}>
          {(f) => <>
            {Array.from({ length: 80 }, (_, i) => { const [x, y] = f(hash(i, 3), hash(i, 4)); return x > bx && <circle key={i} cx={x} cy={y} r={3} fill="#e6dccb" opacity={0.8} />; })}
            {t > m.gra && <ellipse cx={f(0.75, 0.55)[0]} cy={f(0.75, 0.55)[1]} rx={130 * gra} ry={54 * gra} fill="#2a2116" opacity={0.7} />}
          </>}
        </Piso>
        {t < m.cur && <g transform={`translate(${bx},720) rotate(${10 * Math.sin(t * 8)})`}><rect x={-10} y={-340} width={20} height={300} fill="#b98a55" /><rect x={-110} y={-50} width={220} height={40} rx={6} fill="#3a2e22" />{Array.from({ length: 11 }, (_, i) => <line key={i} x1={-100 + i * 20} y1={-10} x2={-104 + i * 20} y2={30} stroke="#d8b860" strokeWidth={6} />)}</g>}
        {t > m.cur && <g transform={`translate(760,${640 - 30 * tal}) rotate(${-8 + tal * 30}) scale(${cur})`}>
          <rect x={-140} y={-46} width={280} height={92} rx={46} fill="#e6b48e" stroke="#b3835d" strokeWidth={4} />
          <rect x={-46} y={-34} width={92} height={68} rx={10} fill="#f4e4d0" />
          {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={-130 + hash(i, 5) * 260} cy={-40 + hash(i, 6) * 80} r={4} fill="#f4f1e8" opacity={tal} />)}
        </g>}
        {t > m.gra && <circle cx={1260} cy={720} r={170 * gra} fill="none" stroke={C.red} strokeWidth={10} strokeDasharray="22 14" />}
      </Svg>
      <Lbl t={t} at={m.tal} text="no pega" x={760} y={460} col={C.red} size={64} />
      <Lbl t={t} at={m.gra} text="grasa = se despega" x={1260} y={950} col={C.red} size={56} />
    </>
  );
};

// 12 · corte del contrapiso como esponja: poros vacíos chupan el agua de una gota de carpeta que se seca y se fisura;
// después la manguera de la noche anterior llena los poros y la superficie queda húmeda sin charcos, como piedra de río
export const EsponjaSedienta: React.FC<FxP> = ({ t, m }) => {
  const chu = e(t, m.chu, m.chu + 3), noc = e(t, m.noc, m.noc + 4), cha = e(t, m.cha, m.cha + 1.5), pie = e(t, m.pie, m.pie + 1.6);
  return (
    <>
      <Svg>
        <rect x={360} y={600} width={1200} height={360} rx={10} fill={CONTRA} />
        {Array.from({ length: 64 }, (_, i) => { const x = 400 + (i % 16) * 74 + 20 * hash(i, 2), y = 640 + Math.floor(i / 16) * 80 + 14 * hash(i, 3); return <circle key={i} cx={x} cy={y} r={14 + 8 * hash(i, 4)} fill={noc > hash(i, 5) ? C.water : "#3e3428"} opacity={noc > hash(i, 5) ? 0.75 : 1} />; })}
        <rect x={360} y={540} width={1200} height={60} fill={lerp(0, 1, chu) > 0.5 && noc < 0.3 ? "#cdc6b8" : "#8a8277"} opacity={1 - noc} />
        {chu > 0.02 && noc < 0.3 && Array.from({ length: 12 }, (_, i) => { const x = 400 + i * 100; return <path key={i} d={`M${x},600 l14,-30 l-10,-30`} stroke="#5a4f42" strokeWidth={4} fill="none" opacity={chu} />; })}
        {chu > 0.02 && noc < 0.3 && Array.from({ length: 18 }, (_, i) => { const ph = (t * 0.8 + hash(i, 7)) % 1; return <circle key={i} cx={420 + hash(i, 8) * 1080} cy={570 + ph * 120} r={6} fill={C.water} opacity={chu * (1 - ph)} />; })}
        {noc > 0.02 && <rect x={360} y={590} width={1200} height={14} fill="#4f4a42" opacity={0.6 * noc} />}
        {cha > 0.02 && <><ellipse cx={1180} cy={580} rx={200} ry={26} fill={C.water} opacity={0.6 * cha} /><Cross t={t} at={m.cha + 0.4} x={1180} y={470} r={50} /></>}
        {pie > 0.02 && <g transform={`translate(1600,380) scale(${pie})`}><ellipse rx={130} ry={90} fill="#6f685d" /><ellipse cx={-30} cy={-30} rx={60} ry={24} fill="#fff" opacity={0.35} /></g>}
      </Svg>
      <Lbl t={t} at={m.esp} out={m.noc} text="como esponja seca" x={960} y={300} col={C.cream} size={64} />
      <Lbl t={t} at={m.noc} out={m.cha} text="la noche anterior, bien mojado" x={960} y={300} col={C.water} size={58} />
      <Lbl t={t} at={m.cha} text="húmedo, no encharcado" x={760} y={300} col={C.ok} size={58} />
    </>
  );
};

// 13 · el puente: cuchara de yogur que se estira; cola blanca 1 + agua 3 en un balde; el cepillo refriega (no pinta); la
// carpeta entra sobre lo fresco; si se seca, se pone gris claro y la carpeta rebota; avance de a metro
export const PuenteDeYogur: React.FC<FxP> = ({ t, m }) => {
  const mez = e(t, m.cola, m.tres + 2), ref = e(t, m.ref, m.fre), car = e(t, m.fre, m.fre + 3), sec = e(t, m.seca, m.seca + 2), met = e(t, m.met, m.met + 4);
  const cx = lerp(560, 1360, ref), cy = 760 + 30 * Math.sin(t * 9);
  return (
    <>
      <Svg>
        {t < m.ref && <>
          <Balde x={600} y={720} s={1.3} lvl={0.3 + 0.4 * mez} liq={mez > 0.5 ? "#c8c0b0" : "#e8e4da"} />
          {t > m.cola && <g transform={`translate(${lerp(1000, 760, e(t, m.cola, m.cola + 1.2))},360) rotate(${-40 * e(t, m.cola + 1.2, m.cola + 2)})`}><rect x={-50} y={-120} width={100} height={200} rx={20} fill="#f4f1e8" stroke="#bbb" strokeWidth={4} /><rect x={-50} y={-40} width={100} height={60} fill="#3a7bd5" /><text y={0} textAnchor="middle" fontSize={26} fontWeight={800} fill="#fff" fontFamily="Barlow">COLA</text></g>}
          {t > m.tres && <g transform={`translate(1240,560) scale(${spr(t, m.tres)})`}>
            {[0, 1, 2, 3].map((i) => <rect key={i} x={-200 + i * 100} y={-60} width={80} height={120} rx={10} fill={i === 0 ? "#f4f1e8" : C.water} opacity={0.9} />)}
            <text x={-160} y={120} textAnchor="middle" fontSize={60} fontWeight={800} fill={C.ink} fontFamily="Barlow Condensed">1</text>
            <text x={50} y={120} textAnchor="middle" fontSize={60} fontWeight={800} fill={C.water} fontFamily="Barlow Condensed">3</text>
          </g>}
          {t > m.yog && <g transform={`translate(1000,${300 + 10 * Math.sin(t * 2)})`}><ellipse rx={90} ry={34} fill="#9aa2a9" /><path d={`M-40,20 Q0,${60 + 80 * cl((t - m.yog) % 2)} 40,20`} fill="#d6d0c4" /></g>}
        </>}
        {t >= m.ref && <Piso cx={960} y={420} w={1500} d={520} rug={1 - ref * 0.6 - car * 0.4}>
          {(f) => <>
            <polygon points={quad(f, 0, 0, cl(ref + 0.05) * (1 - met * 0) , 1)} fill={sec > 0.5 ? "#c9c3b7" : "#7f786c"} opacity={0.85} />
            {car > 0.02 && <polygon points={quad(f, 0, 0, 0.5 * car, 1)} fill="#9d958a" />}
            {met > 0.02 && [0.25, 0.5, 0.75].map((u, i) => <polygon key={i} points={quad(f, u - 0.004, 0, u + 0.004, 1)} fill={C.honey} opacity={cl(met * 3 - i)} />)}
          </>}
        </Piso>}
        {t >= m.ref && t < m.fre && <g transform={`translate(${cx},${cy}) rotate(${20 * Math.sin(t * 12)})`}><rect x={-14} y={-300} width={28} height={280} fill="#b98a55" /><rect x={-120} y={-30} width={240} height={50} rx={10} fill="#5e3a1c" /></g>}
        {sec > 0.02 && <><circle cx={1300} cy={720} r={60 * spr(t, m.seca + 1.4)} fill="#b5ad9f" /><Cross t={t} at={m.seca + 1.6} x={1300} y={560} r={48} /></>}
      </Svg>
      <Lbl t={t} at={m.yog} out={m.ref} text="espeso como yogur" x={1000} y={160} col={C.cream} size={60} />
      <Lbl t={t} at={m.ref} out={m.fre} text="refregar, no pintar" x={960} y={180} col={C.honey} size={66} />
      <Lbl t={t} at={m.fre} out={m.seca} text="carpeta sobre fresco" x={960} y={180} col={C.ok} size={62} />
      <Lbl t={t} at={m.met} text="de a un metro" x={960} y={180} col={C.cream} size={62} />
    </>
  );
};

// 14 · la quemadura del cemento: guantes y antiparras se calzan; reloj que avanza hasta la noche y la mano se pone roja;
// salpicadura al ojo y un chorro de agua limpia la apaga
export const QuemaQueNoArde: React.FC<FxP> = ({ t, m }) => {
  const gua = e(t, m.gua, m.gua + 1.5), noc = e(t, m.noc, m.noc + 2.5), ojo = e(t, m.ojo, m.ojo + 1.2), ag = e(t, m.agua, m.agua + 2);
  return (
    <>
      <Svg>
        <g transform="translate(560,600)">
          <Mano x={0} y={0} rot={0} s={1.6} col={noc > 0.3 && gua < 0.5 ? "#d9a882" : "#d9a882"} />
          <g opacity={1 - noc}><Mano x={0} y={0} s={1.62} col="#2f8f5a" /></g>
          {noc > 0.02 && <ellipse cx={0} cy={-40} rx={110} ry={120} fill={C.red} opacity={0.45 * noc} />}
        </g>
        {t > m.noc && <g transform="translate(560,220)"><circle r={70} fill="#0b1022" stroke={C.cream} strokeWidth={6} /><line x1={0} y1={0} x2={0} y2={-56} stroke={C.ink} strokeWidth={8} transform={`rotate(${noc * 300})`} /><circle cx={30} cy={-10} r={22} fill="#f4f1e8" opacity={noc} /></g>}
        <g transform="translate(1340,520)">
          <ellipse rx={220} ry={130} fill="#e9d3b0" /><ellipse cx={0} cy={0} rx={90} ry={60} fill="#fff" /><circle r={42} fill="#5a3d26" /><circle r={18} fill="#111" />
          {t > m.gua && <g opacity={gua}><rect x={-260} y={-90} width={520} height={180} rx={70} fill="rgba(214,240,255,.25)" stroke="#3a3f45" strokeWidth={14} /></g>}
          {ojo > 0.02 && ag < 0.9 && Array.from({ length: 10 }, (_, i) => <circle key={i} cx={-300 + ojo * 300 + 20 * hash(i, 2)} cy={-120 + ojo * 110 + 30 * hash(i, 3)} r={10} fill="#8a8277" opacity={1 - ag} />)}
          {ag > 0.02 && Array.from({ length: 26 }, (_, i) => { const ph = (t * 1.6 + hash(i, 4)) % 1; return <line key={i} x1={300 - ph * 320} y1={-200 + ph * 200 + 20 * hash(i, 5)} x2={280 - ph * 320} y2={-190 + ph * 200 + 20 * hash(i, 5)} stroke={C.water} strokeWidth={8} opacity={ag * (1 - ph)} />; })}
        </g>
      </Svg>
      <Lbl t={t} at={m.gua} text="guantes y antiparras" x={960} y={140} col={C.honey} size={64} />
      <Lbl t={t} at={m.noc} out={m.ojo} text="te das cuenta a la noche" x={560} y={960} col={C.red} size={52} />
      <Lbl t={t} at={m.agua} text="agua limpia, enseguida" x={1340} y={900} col={C.water} size={56} />
    </>
  );
};

// 15 · vista cenital del cuarto: se tiran las fajas como rieles de mezcla paralelas, cada 1,80; el cuarto se pinta de
// tiras y una cota mide entre ellas
export const RielesDeMezcla: React.FC<FxP> = ({ t, m }) => {
  const xs = [520, 860, 1200, 1540];
  return (
    <>
      <Svg>
        <rect x={360} y={180} width={1360} height={760} fill={CONTRA} stroke="#e9e1cf" strokeWidth={22} />
        {Array.from({ length: 120 }, (_, i) => <circle key={i} cx={380 + hash(i, 2) * 1320} cy={200 + hash(i, 3) * 720} r={4 + 4 * hash(i, 4)} fill="#a3927a" />)}
        {xs.map((x, i) => { const k = e(t, m.diez + i * 1.1, m.diez + i * 1.1 + 1.8); return <g key={i}>
          <rect x={x - 26} y={200} width={52} height={720 * k} rx={8} fill="#9d958a" stroke="#6f685d" strokeWidth={4} />
          <rect x={x - 26} y={200} width={14} height={720 * k} fill="rgba(255,255,255,.2)" />
        </g>; })}
        {t > m.och && <g opacity={e(t, m.och, m.och + 0.5)}>
          <line x1={860} y1={560} x2={1200} y2={560} stroke={C.sun} strokeWidth={5} /><path d="M860,560 l20,-14 v28z M1200,560 l-20,-14 v28z" fill={C.sun} />
          <rect x={950} y={500} width={160} height={50} rx={10} fill="rgba(30,20,10,.85)" /><text x={1030} y={538} textAnchor="middle" fontSize={40} fontWeight={800} fill={C.sun} fontFamily="Barlow Condensed">1,80 m</text>
        </g>}
        <g transform={`translate(${xs[0]},${200 + 720 * e(t, m.diez, m.diez + 1.8)})`} opacity={t > m.diez && t < m.par ? 1 : 0}><Fratas x={0} y={0} rot={90} s={0.5} /></g>
      </Svg>
      <Lbl t={t} at={m.diez} text="10 cm de ancho" x={960} y={110} col={C.cream} size={56} />
      <Lbl t={t} at={m.alt} text="la altura exacta" x={960} y={1010} col={C.honey} size={56} />
    </>
  );
};

// 16 · la manguera transparente en U de pared a pared: el agua sube igual en las dos puntas; se marca en cada pared,
// se tira el hilo y ese hilo es la cara de arriba de cada faja
export const ManguerasGemelas: React.FC<FxP> = ({ t, m }) => {
  const lvl = lerp(900, 500, e(t, m.tra, m.mis + 1)), mk = e(t, m.pas, m.pas + 2), hi = e(t, m.hilo, m.hilo + 1.6);
  return (
    <>
      <Svg>
        <rect x={180} y={160} width={140} height={800} fill="#b9ad98" /><rect x={1600} y={160} width={140} height={800} fill="#b9ad98" />
        <rect x={180} y={880} width={1560} height={100} fill={CONTRA} />
        <MangueraU x0={400} x1={1520} y={860} h0={460} h1={420} lvl={lvl} k={e(t, m.tra - 0.4, m.tra + 0.6)} />
        <line x1={300} y1={lvl} x2={1620} y2={lvl} stroke={C.water} strokeWidth={2} strokeDasharray="8 10" opacity={e(t, m.mis, m.mis + 1)} />
        {[[320, 0], [1600, 1]].map(([x, i]) => <rect key={i} x={x - (i ? 0 : 0) - 10} y={lvl - 5} width={i ? 40 : 40} height={10} transform={`translate(${i ? -30 : -10},0)`} fill="#d8352a" opacity={mk} />)}
        {hi > 0.02 && <line x1={320} y1={lvl} x2={lerp(320, 1600, hi)} y2={lvl} stroke="#ffd27a" strokeWidth={5} />}
        {hi > 0.6 && [620, 960, 1300].map((x, i) => <rect key={i} x={x - 30} y={lvl} width={60} height={880 - lvl} fill="#9d958a" opacity={e(t, m.hilo + 1 + i * 0.4, m.hilo + 1.6 + i * 0.4)} />)}
      </Svg>
      <Lbl t={t} at={m.mis} text="el agua busca el mismo nivel" x={960} y={110} col={C.water} size={58} />
      <Lbl t={t} at={m.hilo} text="el hilo = arriba de la faja" x={960} y={1030} col={C.sun} size={52} />
    </>
  );
};
