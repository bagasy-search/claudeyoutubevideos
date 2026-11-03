// cl2alisar · componentes de la linterna al cierre (de frente contra de costado, espátula ancha contra angosta, el enduido
// cruzado, balde o polvo, la lija en taco, el polvo que se queda media hora, el tironeo del encuentro, el mapa de encuentros,
// la malla que reparte, el fijador que evita manchas, los kilos por metro, el calendario de secado, los tres dólares, los
// pines de los comentarios, qué pared votás y las dos semanas).
import React from "react";
import { C, FONT, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Big, Cross, Draw, FxP, Pop, Svg, Tick, num } from "./kit";
import { Espatula, Muro, mk } from "./comps1";

// la misma pared con olas, en dos luces: el foco de frente no hace sombra, el rasante dibuja cada lomita
const olaD = (x0: number, y0: number, w: number, i: number) => `M${x0},${y0 + i * 70} Q${x0 + w * 0.3},${y0 + i * 70 - 14 * (1 + hash(i, 4))} ${x0 + w * 0.55},${y0 + i * 70 + 6} T${x0 + w},${y0 + i * 70 + 4}`;

// 44 · de frente contra de costado: el mismo paño con la luz de frente (liso) y con la luz rasante (olas)
export const FrenteVsCostado: React.FC<FxP> = ({ t, a, m }) => {
  const k = mk(m, "costado", a + 2.5), on = e(t, k, k + 1);
  return (
    <>
      <Svg>
        {[0, 1].map((s) => {
          const x0 = 260 + s * 760, lit = s === 0 ? 1 : on;
          return <g key={s} opacity={e(t, a + 0.3 + s * 0.6, a + 0.8 + s * 0.6)}>
            <rect x={x0} y={240} width={640} height={560} fill={C.prim} />
            {s === 0 && <circle cx={x0 + 320} cy={180} r={30} fill={C.luz} />}
            {s === 0 && <path d={`M${x0 + 300},200 L${x0 + 40},800 L${x0 + 600},800 L${x0 + 340},200 Z`} fill={C.luz} opacity={0.12} />}
            {s === 1 && <g opacity={lit}><circle cx={x0 - 30} cy={520} r={26} fill={C.luz} /><path d={`M${x0 - 10},520 L${x0 + 640},240 L${x0 + 640},800 Z`} fill={C.luz} opacity={0.16} />{Array.from({ length: 7 }, (_, i) => <path key={i} d={olaD(x0, 300, 640, i)} stroke="rgba(30,24,16,.6)" strokeWidth={22} fill="none" />)}</g>}
          </g>;
        })}
      </Svg>
      <Lbl t={t} at={a + 0.6} text="de frente: lista" x={580} y={900} size={48} col={C.ink} />
      <Lbl t={t} at={k + 0.8} text="de costado: tres lomas" x={1340} y={900} size={48} col={C.luz} />
    </>
  );
};

// 45 · ancha contra angosta: la de 40 apoya en las dos lomas y llena el pozo; la de 10 se hunde y copia la ola
export const AnchaVsAngosta: React.FC<FxP> = ({ t, a, m }) => {
  const k1 = mk(m, "cuarenta", a + 1), k2 = mk(m, "diez", a + 4), u1 = e(t, k1, k1 + 1.6), u2 = e(t, k2, k2 + 1.6);
  const perfil = (x0: number, y0: number) => `M${x0},${y0} Q${x0 + 150},${y0 - 50} ${x0 + 300},${y0} Q${x0 + 450},${y0 + 70} ${x0 + 600},${y0} L${x0 + 600},${y0 + 140} L${x0},${y0 + 140} Z`;
  return (
    <>
      <Svg>
        <path d={perfil(300, 420)} fill={C.prim} />
        <path d={`M300,${420} L900,420 Q750,${420 + 70 * (1 - u1)} 600,420 Z`} fill={C.end} opacity={u1} />
        <g transform={`translate(${lerp(300, 600, u1)},0)`}><rect x={0} y={386} width={600} height={14} rx={4} fill={C.alu} /></g>
        <path d={perfil(1020, 420)} fill={C.prim} />
        <g transform={`translate(${lerp(1020, 1520, u2)},${420 + 60 * Math.sin(u2 * Math.PI * 2) * 0.6})`}><rect x={-50} y={-28} width={100} height={14} rx={4} fill={C.alu} /></g>
        <path d={`M1020,420 Q1170,370 1320,420 Q1470,490 ${lerp(1020, 1620, u2)},420`} stroke={C.end} strokeWidth={8} fill="none" opacity={u2} />
        <Tick t={t} at={k1 + 1.8} x={600} y={260} r={40} /><Cross t={t} at={k2 + 1.8} x={1320} y={260} r={40} />
      </Svg>
      <Lbl t={t} at={k1 + 0.2} text="40 cm: hace de regla" x={600} y={700} size={46} col={C.ok} />
      <Lbl t={t} at={k2 + 0.2} text="10 cm: copia la ola" x={1320} y={700} size={46} col={C.red} />
    </>
  );
};

// 46 · el enduido cruzado: la segunda mano sube vertical, un día de secado, la tercera horizontal de arriba hacia abajo
export const CruzadoEnduido: React.FC<FxP> = ({ t, a, m }) => {
  const k2 = mk(m, "vertical", a + 1), k3 = mk(m, "horizontal", a + 5), u2 = e(t, k2, k2 + 2.4), u3 = e(t, k3, k3 + 2.4);
  return (
    <>
      <Svg>
        <rect x={460} y={180} width={1000} height={700} fill={C.prim} />
        {Array.from({ length: 6 }, (_, i) => <rect key={"v" + i} x={460 + i * 167} y={880 - 700 * cl(u2 * 6 - i)} width={160} height={700 * cl(u2 * 6 - i)} fill={C.end2} opacity={0.9} />)}
        {Array.from({ length: 5 }, (_, i) => <rect key={"h" + i} x={460} y={180 + i * 140} width={1000 * cl(u3 * 5 - i)} height={136} fill={C.end} opacity={0.92} />)}
        <Draw d="M380,860 L380,200" p={u2} col={C.honey} w={6} /><Draw d="M480,140 L1440,140" p={u3} col={C.honey} w={6} />
      </Svg>
      <Lbl t={t} at={k2 + 0.4} text="2ª: de abajo arriba" x={1680} y={700} size={42} col={C.end2} />
      <Lbl t={t} at={k3 - 1.4} text="un día de secado" x={1680} y={560} size={40} col={C.dim} />
      <Lbl t={t} at={k3 + 0.4} text="3ª: de arriba abajo" x={1680} y={420} size={42} col={C.honey} />
    </>
  );
};

// 47 · balde o polvo: el de balde listo para abrir, el de polvo que se bate; cómodo contra barato
export const BaldeOPolvo: React.FC<FxP> = ({ t, a, m }) => {
  const k1 = mk(m, "balde", a + 0.8), k2 = mk(m, "polvo", a + 2.6);
  return (
    <>
      <Svg>
        <g opacity={cl((t - k1) * 4)} transform={`translate(620,${560 + (1 - spr(t, k1)) * 90})`}>
          <path d="M-150,-170 L-130,170 L130,170 L150,-170 Z" fill="#e9eef2" stroke="#9aa6af" strokeWidth={6} /><rect x={-165} y={-200} width={330} height={44} rx={10} fill="#d5dde2" transform={`rotate(${-18 * e(t, k1 + 0.8, k1 + 1.4)},165,-200)`} />
          <ellipse cx={0} cy={-150} rx={130} ry={22} fill={C.end} opacity={e(t, k1 + 0.8, k1 + 1.4)} />
        </g>
        <g opacity={cl((t - k2) * 4)} transform={`translate(1300,${560 + (1 - spr(t, k2)) * 90})`}>
          <path d="M-130,-190 L130,-190 L150,170 L-150,170 Z" fill="#c9b893" stroke="#8b7a55" strokeWidth={5} />
          <path d="M-130,-190 L-100,-230 L100,-230 L130,-190" fill="#b4a37d" />
          {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={-60 + hash(i, 1) * 120} cy={-240 - ((t * 60 + hash(i, 2) * 80) % 90)} r={5} fill={C.end2} opacity={0.7} />)}
        </g>
      </Svg>
      <Lbl t={t} at={k1 + 0.4} text="balde: más cómodo" x={620} y={860} size={46} col={C.ink} />
      <Lbl t={t} at={k2 + 0.4} text="polvo: más barato" x={1300} y={860} size={46} col={C.honey} />
    </>
  );
};

// 48 · la lija en taco: la lija en la mano sigue las olas, en un taco de madera las corta
export const TacoPlano: React.FC<FxP> = ({ t, a, m }) => {
  const k = mk(m, "taco", a + 2.4), u1 = e(t, a + 0.6, a + 2.2), u2 = e(t, k, k + 1.8);
  const ola = (x0: number, y0: number) => `M${x0},${y0} Q${x0 + 120},${y0 - 30} ${x0 + 240},${y0} T${x0 + 480},${y0} L${x0 + 480},${y0 + 120} L${x0},${y0 + 120} Z`;
  return (
    <>
      <Svg>
        <path d={ola(300, 520)} fill={C.end} />
        <g transform={`translate(${lerp(320, 700, u1)},${520 - 22 * Math.sin(u1 * Math.PI * 2) - 30})`}><ellipse rx={70} ry={26} fill="#d9a07a" /><rect x={-70} y={18} width={140} height={10} fill="#b9a27a" /></g>
        <path d={ola(1140, 520)} fill={C.end} />
        <path d={`M1140,${520} L${lerp(1140, 1620, u2)},520 L${lerp(1140, 1620, u2)},540 L1140,540 Z`} fill={C.end2} opacity={0.9} />
        <g transform={`translate(${lerp(1200, 1560, u2)},470)`}><rect x={-90} y={-40} width={180} height={50} rx={6} fill={C.wood} /><rect x={-90} y={10} width={180} height={10} fill="#b9a27a" /></g>
        <Cross t={t} at={a + 2.4} x={540} y={380} r={36} /><Tick t={t} at={k + 2} x={1380} y={380} r={36} />
      </Svg>
      <Lbl t={t} at={a + 1} text="en la mano copia" x={540} y={780} size={46} col={C.red} />
      <Lbl t={t} at={k + 0.6} text="en taco: plana" x={1380} y={780} size={46} col={C.ok} />
      <Lbl t={t} at={k + 2.4} text="120 y después 220" x={960} y={920} size={44} col={C.honey} />
    </>
  );
};

// 49 · el polvo que se queda media hora: la nube no baja; barbijo, anteojos y ventana abierta
export const PolvoMediaHora: React.FC<FxP> = ({ t, a, m }) => {
  const k = mk(m, "barbijo", a + 3), cuida = ["barbijo", "anteojos", "ventana abierta"];
  return (
    <>
      <Svg>
        {Array.from({ length: 90 }, (_, i) => { const x = 300 + hash(i, 1) * 1000, y = 200 + hash(i, 2) * 600; return <circle key={i} cx={x + 20 * Math.sin(t * 0.6 + i)} cy={y + 14 * Math.sin(t * 0.4 + i * 2)} r={3 + 5 * hash(i, 3)} fill={C.end} opacity={0.35 * e(t, a, a + 1.2)} />; })}
        <g transform="translate(1000,320)"><circle r={110} fill="rgba(24,22,20,.86)" stroke={C.honey} strokeWidth={5} /><path d={`M0,0 L0,-90 A90,90 0 0 1 0,90 Z`} fill={C.honey} opacity={0.4 * e(t, a + 0.8, a + 2.4)} /><line x1={0} y1={0} x2={0} y2={-80} stroke={C.ink} strokeWidth={6} /><line x1={0} y1={0} x2={70 * Math.sin(e(t, a + 0.8, a + 2.4) * Math.PI)} y2={-70 * Math.cos(e(t, a + 0.8, a + 2.4) * Math.PI)} stroke={C.ink} strokeWidth={8} strokeLinecap="round" /></g>
      </Svg>
      <Lbl t={t} at={a + 1.6} text="media hora en el aire" x={1000} y={490} size={46} col={C.honey} />
      {cuida.map((w, i) => <Lbl key={w} t={t} at={k + i * 0.6} text={w} x={1580} y={640 + i * 100} size={46} col={C.ok} />)}
    </>
  );
};

// 50 · el tironeo del encuentro: ladrillo y hormigón respiran distinto con el calor; la capa de encima se raja en la línea
export const TironeoEncuentro: React.FC<FxP> = ({ t, a, m }) => {
  const k = mk(m, "raja", a + 4), osc = Math.sin((t - a) * 2.4) * e(t, a + 0.8, a + 1.6), rj = e(t, k, k + 1.2);
  return (
    <>
      <Svg>
        <g transform={`translate(${-10 * osc},0)`}><rect x={360} y={240} width={600} height={600} fill={C.lad} />{Array.from({ length: 6 }, (_, r) => <line key={r} x1={360} x2={960} y1={240 + r * 100} y2={240 + r * 100} stroke={C.mort} strokeWidth={8} />)}</g>
        <g transform={`translate(${12 * osc},0)`}><rect x={960} y={240} width={600} height={600} fill={C.horm} /></g>
        <rect x={360} y={220} width={1200} height={22} fill={C.end} />
        <polyline points={Array.from({ length: 13 }, (_, i) => `${960 + (hash(i, 5) - 0.5) * 14},${240 + i * 50 * rj}`).join(" ")} fill="none" stroke="#1a1714" strokeWidth={5} opacity={rj > 0.01 ? 1 : 0} />
        <path d="M700,180 l-60,0 l14,-14 m-14,14 l14,14" stroke={C.lad3} strokeWidth={5} fill="none" opacity={cl(osc * -3)} />
        <path d="M1220,180 l60,0 l-14,-14 m14,14 l-14,14" stroke={C.alu} strokeWidth={5} fill="none" opacity={cl(osc * 3)} />
      </Svg>
      <Lbl t={t} at={a + 0.6} text="ladrillo" x={660} y={930} size={46} col={C.lad3} />
      <Lbl t={t} at={a + 0.9} text="hormigón" x={1260} y={930} size={46} col={C.alu} />
      <Lbl t={t} at={k + 1} text="no fue la mezcla" x={960} y={140} size={50} col={C.red} />
    </>
  );
};

// 51 · el mapa de encuentros: la fachada de una pieza con columna, viga, techo y ventana; cada encuentro se enciende
export const MapaDeEncuentros: React.FC<FxP> = ({ t, a, m }) => {
  const ks = [["columna", "co"], ["viga", "vi"], ["techo", "te"], ["marco", "ma"]] as const;
  const kk = (k: string, i: number) => mk(m, k, a + 0.8 + i * 1.2);
  return (
    <>
      <Svg>
        <rect x={360} y={220} width={1200} height={660} fill={C.prim} />
        <rect x={1400} y={220} width={160} height={660} fill={C.horm} /><rect x={360} y={200} width={1200} height={60} fill={C.horm} />
        <rect x={640} y={420} width={360} height={280} fill="rgba(160,210,255,.3)" stroke={C.alu} strokeWidth={14} />
        <line x1={1400} x2={1400} y1={260} y2={880} stroke={C.malla} strokeWidth={14} opacity={e(t, kk("co", 0), kk("co", 0) + 0.5)} />
        <line x1={360} x2={1560} y1={260} y2={260} stroke={C.malla} strokeWidth={14} opacity={e(t, kk("vi", 1), kk("vi", 1) + 0.5)} />
        <line x1={360} x2={1560} y1={204} y2={204} stroke={C.malla} strokeWidth={8} strokeDasharray="20 12" opacity={e(t, kk("te", 2), kk("te", 2) + 0.5)} />
        <g opacity={e(t, kk("ma", 3), kk("ma", 3) + 0.5)}>
          {[[640, 420, -1, -1], [1000, 420, 1, -1], [640, 700, -1, 1], [1000, 700, 1, 1]].map(([x, y, sx, sy], i) => <line key={i} x1={x} y1={y} x2={x + sx * 90} y2={y + sy * 90} stroke={C.malla} strokeWidth={16} strokeLinecap="round" />)}
        </g>
      </Svg>
      {ks.map(([w, k], i) => <Lbl key={k} t={t} at={kk(k, i) + 0.3} text={w} x={[1480, 900, 600, 820][i]} y={[960, 320, 150, 780][i]} size={44} col={C.malla} />)}
    </>
  );
};

// 52 · la malla reparte: el corte del encuentro con la malla de 15 cm por lado; el tirón se abre en abanico y no rompe
export const MallaReparte: React.FC<FxP> = ({ t, a, m }) => {
  const k = mk(m, "reparte", a + 2.5), u = e(t, a + 0.6, a + 2), f = e(t, k, k + 1.6);
  return (
    <>
      <Svg>
        <rect x={360} y={420} width={600} height={220} fill={C.lad} /><rect x={960} y={420} width={600} height={220} fill={C.horm} />
        <rect x={960 - 300 * u} y={392} width={600 * u} height={28} fill="url(#mr_p)" />
        <defs><pattern id="mr_p" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M0,0 L16,0 M0,0 L0,16" stroke={C.malla} strokeWidth={2.5} /></pattern></defs>
        <rect x={360} y={370} width={1200} height={22} fill={C.end} />
        {Array.from({ length: 9 }, (_, i) => { const dx = (i - 4) * 70 * f; return <path key={i} d={`M960,360 L${960 + dx},${300 - 30 * Math.abs(i - 4) * f}`} stroke={C.honey} strokeWidth={4} opacity={f * (1 - Math.abs(i - 4) / 6)} />; })}
        <Draw d="M660,700 L960,700" p={u} col={C.malla} w={4} /><Draw d="M960,700 L1260,700" p={u} col={C.malla} w={4} />
      </Svg>
      <Lbl t={t} at={a + 1.4} text="15 cm" x={810} y={770} size={44} col={C.malla} />
      <Lbl t={t} at={a + 1.6} text="15 cm" x={1110} y={770} size={44} col={C.malla} />
      <Lbl t={t} at={k + 1} text="reparte el movimiento" x={960} y={200} size={50} col={C.honey} />
    </>
  );
};

// 53 · sin fijador, manchas: la pintura cae en el enduido y se chupa en parches; con fijador cubre pareja
export const SinFijadorManchas: React.FC<FxP> = ({ t, a, m }) => {
  const k = mk(m, "fijador", a + 3.5), u1 = e(t, a + 0.6, a + 2.4), u2 = e(t, k, k + 1.8);
  return (
    <>
      <Svg>
        <rect x={300} y={240} width={600} height={560} fill={C.end} />
        <rect x={300} y={240} width={600} height={560 * u1} fill={C.pint} opacity={0.6} />
        {Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx={340 + hash(i, 1) * 520} cy={280 + hash(i, 2) * 480} rx={40 + 50 * hash(i, 3)} ry={30 + 40 * hash(i, 4)} fill={C.end2} opacity={u1 * 0.9} />)}
        <rect x={1020} y={240} width={600} height={560} fill={C.end} />
        <rect x={1020} y={240} width={600} height={560} fill="rgba(200,230,255,.25)" opacity={e(t, k - 0.8, k)} />
        <rect x={1020} y={240} width={600} height={560 * u2} fill={C.pint} />
        <Cross t={t} at={a + 2.6} x={600} y={170} r={34} /><Tick t={t} at={k + 2} x={1320} y={170} r={34} />
      </Svg>
      <Lbl t={t} at={a + 1.6} text="chupa en parches" x={600} y={900} size={46} col={C.red} />
      <Lbl t={t} at={k + 0.6} text="fijador primero" x={1320} y={900} size={46} col={C.ok} />
    </>
  );
};

// 54 · los kilos por metro: el corte de dos centímetros de revoque contra los milímetros de esta capa; los bolsones caen
export const KilosPorMetro: React.FC<FxP> = ({ t, a, m }) => {
  const k = mk(m, "milimetros", a + 3.2), u1 = e(t, a + 0.6, a + 2.2), u2 = e(t, k, k + 1.2);
  return (
    <>
      <Svg>
        <rect x={420} y={240} width={160} height={560} fill={C.lad} /><rect x={580} y={240} width={110 * u1} height={560} fill={C.mort} />
        {Array.from({ length: 6 }, (_, i) => <rect key={i} x={760 + (i % 3) * 120} y={800 - 90 - Math.floor(i / 3) * 90 - (1 - spr(t, a + 1 + i * 0.25)) * 300} width={110} height={84} rx={14} fill="#cfc6b2" stroke="#8c836f" strokeWidth={3} opacity={cl((t - a - 1 - i * 0.25) * 4)} />)}
        <rect x={1180} y={240} width={160} height={560} fill={C.lad} /><rect x={1340} y={240} width={22 * u2} height={560} fill={C.prim} />
        <rect x={1420} y={800 - 84 - (1 - spr(t, k + 0.4)) * 300} width={110} height={84} rx={14} fill="#cfc6b2" stroke="#8c836f" strokeWidth={3} opacity={cl((t - k - 0.4) * 4)} />
      </Svg>
      <Lbl t={t} at={a + 1.2} text="grueso: 2 cm" x={640} y={900} size={46} col={C.mort} />
      <Lbl t={t} at={k + 0.6} text="esto: milímetros" x={1340} y={900} size={46} col={C.ok} />
    </>
  );
};

// 55 · el calendario de secado: el revoque grueso tacha semanas; el sistema fino entra en fines de semana
export const CalendarioSecado: React.FC<FxP> = ({ t, a, m }) => {
  const k = mk(m, "semanas", a + 1.5);
  return (
    <>
      <Svg>
        {Array.from({ length: 28 }, (_, i) => {
          const c = i % 7, r = Math.floor(i / 7), x = 520 + c * 130, y = 260 + r * 130, finde = c >= 5, at = k + i * 0.08;
          return <g key={i} opacity={e(t, a + 0.2 + i * 0.02, a + 0.6 + i * 0.02)}>
            <rect x={x} y={y} width={116} height={116} rx={12} fill={finde ? "rgba(255,210,122,.18)" : "rgba(24,22,20,.8)"} stroke={finde ? C.honey : "rgba(255,236,200,.25)"} strokeWidth={3} />
            <path d={`M${x + 20},${y + 20} L${x + 96},${y + 96}`} stroke={C.mort} strokeWidth={8} strokeLinecap="round" opacity={cl((t - at) * 5) * (finde ? 0.25 : 1)} />
          </g>;
        })}
      </Svg>
      <Lbl t={t} at={k + 0.6} text="el grueso: semanas" x={960} y={180} size={48} col={C.mort} />
      <Lbl t={t} at={k + 2.8} text="esto: fines de semana" x={960} y={860} size={48} col={C.honey} />
    </>
  );
};

// 56 · los tres dólares: los materiales se apilan uno sobre otro y el contador sube hasta tres por metro
export const TresDolaresPila: React.FC<FxP> = ({ t, a, m }) => {
  const its = [["ligante", C.puente], ["cal", C.end], ["cemento", C.mort], ["arena", "#cdb486"], ["enduido", C.end2], ["malla", C.malla], ["fijador", "#bfe3ff"]] as const, k = mk(m, "tres", a + 6);
  return (
    <>
      <Svg>
        {its.map(([, col], i) => { const at = a + 0.5 + i * 0.6, p = spr(t, at); return <rect key={i} x={540} y={820 - (i + 1) * 74 - (1 - p) * 200} width={380} height={66} rx={10} fill={col} opacity={cl((t - at) * 5)} />; })}
      </Svg>
      {its.map(([w], i) => <Lbl key={w} t={t} at={a + 0.7 + i * 0.6} text={w} x={730} y={820 - (i + 1) * 74 + 33} size={34} col="#1a1714" plate="none" />)}
      <Pop t={t} at={a + 1} x={1380} y={500}><Big size={190} col={C.honey} style={{ whiteSpace: "nowrap" }}>US$ {num(t, a + 1, k, 0, 3)}</Big></Pop>
      <Lbl t={t} at={k + 0.3} text="por metro cuadrado" x={1380} y={680} size={46} col={C.ink} />
    </>
  );
};

// siluetas muy simples (México, Sudamérica, España) para el mapa de puntos de los comentarios
const TIERRA: [number, number][][] = [
  [[260, 220], [470, 230], [520, 330], [600, 390], [560, 420], [470, 400], [400, 330], [330, 280]],
  [[520, 450], [700, 430], [820, 520], [860, 600], [800, 700], [740, 820], [690, 960], [640, 1000], [620, 860], [560, 700], [500, 560]],
  [[1360, 260], [1560, 250], [1590, 330], [1520, 420], [1380, 420], [1350, 330]],
];
const enTierra = (x: number, y: number) => TIERRA.some((pg) => { let c = false; for (let i = 0, j = pg.length - 1; i < pg.length; j = i++) { const [xi, yi] = pg[i], [xj, yj] = pg[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; });

// 57 · los pines de los comentarios: un mapa de puntos de América y España; cada pregunta clava su pin
export const PinesEnElMapa: React.FC<FxP> = ({ t, a, m }) => {
  const ps = [["Perú", "pe", 580, 640], ["Colombia", "co", 600, 490], ["Uruguay", "uy", 780, 800], ["México", "mx", 400, 300], ["España", "es", 1460, 340], ["Argentina", "ar", 680, 900]] as const;
  return (
    <>
      <Svg>
        {Array.from({ length: 34 * 22 }, (_, i) => { const x = 250 + (i % 34) * 42, y = 150 + Math.floor(i / 34) * 40; return enTierra(x, y) ? <circle key={i} cx={x} cy={y} r={7} fill="rgba(255,236,200,.22)" /> : null; })}
        {ps.map(([, k, x, y], i) => { const at = mk(m, k, a + 0.8 + i * 1.6), p = spr(t, at); return <g key={k} opacity={cl((t - at) * 5)} transform={`translate(${x},${y - (1 - p) * 80})`}><path d="M0,0 C-30,-40 -30,-80 0,-80 C30,-80 30,-40 0,0 Z" fill={C.honey} /><circle cy={-54} r={12} fill={C.night} /></g>; })}
      </Svg>
      {ps.map(([w, k, x, y], i) => <Lbl key={k} t={t} at={mk(m, k, a + 0.8 + i * 1.6) + 0.2} text={w} x={x + (k === "es" ? 0 : 160)} y={y - 40} size={40} col={C.ink} />)}
    </>
  );
};

// 58 · ¿qué pared votás?: tres puertas de pieza nueva, garaje y lavadero; las barras de votos crecen
export const QueParedVotas: React.FC<FxP> = ({ t, a, m }) => {
  const ps = [["pieza nueva", "pi", 0.62], ["garaje", "ga", 0.44], ["lavadero", "la", 0.33]] as const;
  return (
    <>
      <Svg>
        {ps.map(([, k, v], i) => {
          const at = mk(m, k, a + 0.8 + i * 1), x = 500 + i * 460;
          return <g key={k} opacity={cl((t - at) * 4)}>
            <Muro x={x - 150} y={260} w={300} h={380} seed={50 + i} liso={e(t, at + 0.4, at + 2) * 0.6} />
            <rect x={x - 150} y={700} width={300} height={36} rx={18} fill="rgba(255,236,200,.15)" />
            <rect x={x - 150} y={700} width={300 * v * e(t, at + 0.6, at + 2.4)} height={36} rx={18} fill={C.honey} />
          </g>;
        })}
      </Svg>
      {ps.map(([w, k], i) => <Lbl key={k} t={t} at={mk(m, k, a + 0.8 + i * 1) + 0.3} text={w} x={500 + i * 460} y={820} size={44} col={C.ink} />)}
      <Lbl t={t} at={a + 0.4} text="contame en comentarios" x={960} y={170} size={46} col={C.honey} />
    </>
  );
};

// 59 · las dos semanas: la misma pared, ladrillo hueco el día uno y lisa el día catorce; la cortina barre de izquierda a derecha
export const DosSemanas: React.FC<FxP> = ({ t, a, m }) => {
  const k = mk(m, "ahora", a + 2), u = e(t, k, k + 2.2), d = Math.round(lerp(1, 14, u));
  return (
    <>
      <Svg>
        <defs><clipPath id="ds_c"><rect x={360} y={180} width={1200 * u} height={700} /></clipPath></defs>
        <Muro x={360} y={180} w={1200} h={700} seed={59} />
        <g clipPath="url(#ds_c)"><rect x={360} y={180} width={1200} height={700} fill={C.pint} /></g>
        <line x1={360 + 1200 * u} x2={360 + 1200 * u} y1={170} y2={890} stroke={C.honey} strokeWidth={6} opacity={u > 0.01 && u < 0.99 ? 1 : 0} />
        <text x={1500} y={850} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={72} fill={u > 0.5 ? "#2b2620" : C.ink}>día {d}</text>
      </Svg>
      <Lbl t={t} at={a + 0.5} text="ladrillo hueco" x={760} y={960} size={46} col={C.lad3} out={k + 1.6} />
      <Lbl t={t} at={k + 2.2} text="sin revoque, sin yeso" x={960} y={960} size={48} col={C.ok} />
    </>
  );
};
export const _k3 = [Draw, Espatula, Pop];
