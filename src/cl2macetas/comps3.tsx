// cl2macetas · componentes de la espera al cierre (el reloj de 24 horas, nylon o balde, las cinco macetas rotas, el puesto de
// la feria, la escalera de lijas, el agua lechosa, la tarjeta que se raspa, el trapo que se engancha, la mecha que hace palanca,
// el cubremaceta, pincel y no dedo, el antes y después del sellador, las cuatro defensas, las tapitas bajo el plato, la torre
// de costos, las cartas por país, qué plantar, los colores de tus macetas). Cada uno es f(t) puro; marcas (m.*) desde fx.json.
import React from "react";
import { C, FONT, BODY, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Cross, Draw, FxP, Svg, Tick, shake, glass } from "./kit";
import { BaldeP, Mac, Vid, mk } from "./comps1";

// 33 · esperar: el reloj da una vuelta entera (24 h); si hace frío, dos
export const RelojEspera: React.FC<FxP> = ({ t, a, m }) => {
  const fr = mk(m, "frio", a + 3.5), u = e(t, a + 0.4, fr), u2 = e(t, fr + 0.4, fr + 2.4);
  const hand = (ang: number, L: number, w: number, col: string) => <line x1={0} y1={0} x2={Math.sin(ang) * L} y2={-Math.cos(ang) * L} stroke={col} strokeWidth={w} strokeLinecap="round" />;
  return (
    <>
      <Svg>
        <g transform="translate(760,540)">
          <circle r={300} fill="rgba(24,22,20,.8)" stroke={C.ink} strokeWidth={8} />
          <path d={`M0,0 L0,-290 A290,290 0 ${u > 0.5 ? 1 : 0} 1 ${Math.sin(u * 6.283) * 290},${-Math.cos(u * 6.283) * 290} Z`} fill="rgba(240,169,58,.35)" />
          {u2 > 0 && <path d={`M0,0 L0,-250 A250,250 0 ${u2 > 0.5 ? 1 : 0} 1 ${Math.sin(u2 * 6.283) * 250},${-Math.cos(u2 * 6.283) * 250} Z`} fill="rgba(127,214,234,.35)" />}
          {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-260} x2={0} y2={-286} stroke={C.ink} strokeWidth={6} transform={`rotate(${i * 30})`} />)}
          {hand((u + u2) * 6.283 * 2, 200, 14, C.ink)}{hand((u + u2) * 6.283 * 24, 260, 6, C.honey)}<circle r={16} fill={C.ink} />
        </g>
        <g transform="translate(1400,800)"><Mac x={0} y={0} w={300} h={260} gris={0.9} seed={12} /><path d="M-190,-280 Q0,-340 190,-280 L170,10 L-170,10 Z" fill="rgba(220,235,240,.18)" stroke="rgba(220,235,240,.5)" strokeWidth={3} /></g>
      </Svg>
      <Lbl t={t} at={a + 0.8} text="24 horas, mínimo" x={1400} y={300} size={56} col={C.honey} />
      <Lbl t={t} at={fr + 0.4} text="con frío, dos días" x={1400} y={400} size={46} col={C.celeste} />
    </>
  );
};

// 34 · el curado: envuelta en nylon mojado una semana, o sumergida en un balde las primeras 24 horas
export const NylonOBalde: React.FC<FxP> = ({ t, a, m }) => {
  const su = mk(m, "sumerg", a + 3.5), dias = Math.floor(7 * e(t, a + 0.6, su - 0.2));
  return (
    <>
      <Svg>
        <g opacity={cl((t - a) * 3)}>
          <Mac x={560} y={760} w={320} h={300} gris={0.8} seed={13} />
          <path d="M370,440 Q560,380 750,440 L720,780 L400,780 Z" fill="rgba(220,235,240,.2)" stroke="rgba(220,235,240,.6)" strokeWidth={3} />
          {Array.from({ length: 7 }, (_, i) => <g key={i}><rect x={360 + i * 66} y={850} width={56} height={56} rx={10} fill={i < dias ? C.water : "rgba(255,255,255,.08)"} stroke={C.water} strokeWidth={3} /><text x={388 + i * 66} y={889} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.night}>{i + 1}</text></g>)}
        </g>
        <g opacity={e(t, su, su + 0.8)}><BaldeP x={1360} y={860} w={460} h={380} lv={0.85} col={C.plast}><g opacity={0.85}><Mac x={1360} y={850} w={260} h={240} gris={0.8} seed={14} /></g></BaldeP></g>
        <text x={960} y={620} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={70} fill={C.dim} opacity={cl((t - su) * 3)}>o</text>
      </Svg>
      <Lbl t={t} at={a + 0.6} text="nylon y agua: una semana" x={560} y={300} size={44} col={C.water} />
      <Lbl t={t} at={su + 0.5} text="sumergida las primeras 24 h" x={1360} y={300} size={40} col={C.celeste} />
      <Lbl t={t} at={su + 2.2} text="nunca seca del todo" x={960} y={1000} size={50} col={C.ok} />
    </>
  );
};

// 35 · los cinco errores: cinco macetas, cada una con su falla
export const CincoMacetasRotas: React.FC<FxP> = ({ t, a, m }) => {
  const es = [["pared fina", "e1"], ["mucha agua", "e2"], ["vidrio sin lavar", "e3"], ["desmolde apurado", "e4"], ["lijar en seco", "e5"]] as const;
  return (
    <>
      <Svg>
        {es.map(([, k], i) => {
          const at = mk(m, k, a + 0.6 + i * 2), x = 230 + i * 365, p = spr(t, at);
          return <g key={k} opacity={cl((t - at) * 5)} transform={`translate(0,${(1 - p) * 100})`}>
            {i === 0 && <Mac x={x} y={780} w={220} h={260} seed={30} raja={e(t, at + 0.4, at + 1.2)} />}
            {i === 1 && <g><Mac x={x} y={780} w={220} h={260} vid={0.15} seed={31} />{Array.from({ length: 14 }, (_, q) => <Vid key={q} x={x - 70 + (q % 7) * 22} y={770 - Math.floor(q / 7) * 18} r={11} col={q % 3} seed={q + 31} />)}</g>}
            {i === 2 && <g><Mac x={x} y={780} w={220} h={260} seed={32} gris={0.3} />{Array.from({ length: 8 }, (_, q) => <circle key={q} cx={x - 70 + hash(q, 1) * 140} cy={790 + hash(q, 2) * 20} r={6} fill="#cfc8b8" />)}</g>}
            {i === 3 && <g><Mac x={x} y={780} w={220} h={260} seed={33} /><path d={`M${x + 40},${520} l60,-30 l20,60 Z`} fill="#e9e4d8" transform={`translate(${e(t, at + 0.4, at + 1) * 60},${-e(t, at + 0.4, at + 1) * 40})`} /></g>}
            {i === 4 && <g><Mac x={x} y={780} w={220} h={260} seed={34} />{Array.from({ length: 30 }, (_, q) => <circle key={q} cx={x + (hash(q, 1) - 0.5) * 260} cy={520 - ((t * 60 + hash(q, 2) * 200) % 220)} r={4} fill="#e9f1f1" opacity={0.7} />)}</g>}
            <Cross t={t} at={at + 0.8} x={x} y={400} r={34} />
          </g>;
        })}
      </Svg>
      {es.map(([w, k], i) => <Lbl key={k} t={t} at={mk(m, k, a + 0.6 + i * 2) + 0.3} text={w} x={230 + i * 365} y={880} size={36} col={i === 4 ? C.red : C.ink} />)}
    </>
  );
};

// 36 · el puesto de la feria: un día se hace, una semana se termina; el domingo se vende todo
export const PuestoFeria: React.FC<FxP> = ({ t, a, m }) => {
  const sa = mk(m, "sabado", a + 3), dom = mk(m, "domingo", sa + 3), vend = e(t, dom + 0.6, dom + 3);
  return (
    <>
      <Svg>
        <path d="M360,300 L1560,300 L1500,200 L420,200 Z" fill={C.teja} />
        {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${360 + i * 100},300 q50,40 100,0`} fill={i % 2 ? C.teja : C.marm} />)}
        <rect x={380} y={300} width={16} height={560} fill={C.wood} /><rect x={1524} y={300} width={16} height={560} fill={C.wood} />
        <rect x={380} y={700} width={1160} height={40} rx={6} fill={C.wood} />
        {Array.from({ length: 7 }, (_, i) => { const gone = vend > (i + 1) / 8; return <g key={i} opacity={gone ? 0 : cl((t - a - i * 0.15) * 4)}><Mac x={480 + i * 160} y={700} w={120} h={110} seed={40 + i} brillo={0.6} /></g>; })}
        <g opacity={cl((t - sa) * 3) * (1 - e(t, dom, dom + 0.4))} transform="translate(960,520)"><rect x={-260} y={-80} width={520} height={160} rx={20} fill="rgba(24,22,20,.85)" /><text x={0} y={18} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={50} fill={C.ink}>SÁBADO: LIJA</text></g>
      </Svg>
      <Lbl t={t} at={a + 0.6} text="un día se hace" x={700} y={960} size={50} col={C.ink} />
      <Lbl t={t} at={a + 1.8} text="una semana se termina" x={1300} y={960} size={50} col={C.honey} />
      <Lbl t={t} at={dom + 0.4} text="el domingo: todas" x={960} y={520} size={64} col={C.ok} />
    </>
  );
};

// 37 · la escalera de lijas al agua: 60 · 120 · 220 · 400, cada una más fina
export const LijasEscalera: React.FC<FxP> = ({ t, a, m }) => {
  const gs = [["60", "g1", 9], ["120", "g2", 6], ["220", "g3", 3.5], ["400", "g4", 1.8]] as const;
  return (
    <Svg>
      {gs.map(([n, k, r], i) => {
        const at = mk(m, k, a + 0.6 + i * 1.3), x = 380 + i * 390, y = 780 - i * 110, p = spr(t, at);
        return <g key={k} opacity={cl((t - at) * 5)} transform={`translate(${x},${y + (1 - p) * 80})`}>
          <rect x={-160} y={-120} width={320} height={240} rx={14} fill="#26282b" stroke="#55595e" strokeWidth={4} />
          {Array.from({ length: Math.round(160 / r) }, (_, q) => <circle key={q} cx={-140 + hash(q + i * 99, 1) * 280} cy={-100 + hash(q + i * 99, 2) * 200} r={r * 0.6} fill="#4a4d52" />)}
          <text x={0} y={30} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={96} fill={C.ink}>{n}</text>
          {i > 0 && <path d={`M-210,${80} l40,-40`} stroke={C.honey} strokeWidth={8} strokeLinecap="round" />}
        </g>;
      })}
      <text x={1560} y={960} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={48} fill={C.celeste} opacity={cl((t - mk(m, "g4", a + 4.5) - 0.8) * 3)}>SIEMPRE AL AGUA</text>
    </Svg>
  );
};

// 38 · el agua lechosa: la lija circular saca la piel y el agua que cae pasa de blanca a clara
export const AguaLechosa: React.FC<FxP> = ({ t, a, b, m }) => {
  const cla = mk(m, "clara", a + (b - a) * 0.6), k = e(t, a + 0.5, cla), ang = t * 5;
  return (
    <>
      <Svg>
        <Mac x={760} y={840} w={520} h={480} gris={1 - k} seed={15} />
        <g transform={`translate(${760 + Math.cos(ang) * 90},${620 + Math.sin(ang) * 60})`}><rect x={-70} y={-50} width={140} height={100} rx={12} fill="#26282b" stroke="#55595e" strokeWidth={4} /></g>
        {Array.from({ length: 18 }, (_, i) => { const u = ((t * 0.9 + i / 18) % 1); return <path key={i} d={`M${560 + (i % 6) * 70},${840 + u * 140} q6,14 0,26`} stroke={k < 0.7 ? "rgba(240,238,230,.9)" : "rgba(124,200,255,.8)"} strokeWidth={8} fill="none" strokeLinecap="round" opacity={1 - u} />; })}
        <ellipse cx={760} cy={1010} rx={360} ry={40} fill={k < 0.7 ? "rgba(235,232,224,.55)" : "rgba(124,200,255,.3)"} />
      </Svg>
      <Lbl t={t} at={a + 0.8} out={cla} text="agua lechosa: la piel" x={1450} y={460} size={50} col={C.marm} />
      <Lbl t={t} at={cla + 0.3} text="agua clara: vidrio parejo" x={1450} y={460} size={50} col={C.celeste} />
    </>
  );
};

// 39 · como raspar una tarjeta: la moneda va pasando y aparecen los puntos de color
export const RaspaTarjeta: React.FC<FxP> = ({ t, a, b }) => {
  const u = e(t, a + 0.6, b - 0.8), rows = 4;
  const path = (k: number) => { const row = Math.min(rows - 1, Math.floor(k * rows)), f = (k * rows) % 1; return [lerp(520, 1400, row % 2 ? 1 - f : f), 380 + row * 110]; };
  const [cx, cy] = path(u);
  return (
    <>
      <Svg>
        <rect x={460} y={300} width={1000} height={480} rx={30} fill={C.marm} />
        {Array.from({ length: 30 }, (_, i) => <Vid key={i} x={520 + (i % 10) * 98} y={360 + Math.floor(i / 10) * 150 + (i % 2) * 40} r={40} col={i % 7 === 3 ? 2 : i % 3 === 0 ? 1 : 0} seed={i + 700} />)}
        {Array.from({ length: rows * 20 }, (_, i) => { const k = (i + 1) / (rows * 20); if (k < u) return null; const [x, y] = path(k - 0.5 / (rows * 20)); return <rect key={i} x={x - 40} y={y - 75} width={80} height={150} fill="#a9a59c" />; })}
        <g transform={`translate(${cx},${cy}) rotate(${t * 200})`} opacity={cl((t - a) * 3) * (1 - e(t, b - 0.8, b - 0.4))}><circle r={52} fill="#d9b55a" stroke="#8f7330" strokeWidth={5} /><circle r={36} fill="none" stroke="#8f7330" strokeWidth={3} /></g>
      </Svg>
      <Lbl t={t} at={a + 0.8} text="como raspar una tarjeta" x={960} y={900} size={58} col={C.sun} />
    </>
  );
};

// 40 · el trapo se engancha: un hilo queda en el filo, se marca con lápiz y se vuelve a lijar
export const TrapoEngancha: React.FC<FxP> = ({ t, a, m }) => {
  const en = mk(m, "engancha", a + 1.6), li = mk(m, "lija", en + 2.4), ps = mk(m, "pasa", li + 2), stop = t > en && t < ps;
  const x = stop ? 960 : lerp(560, 1360, t < en ? e(t, a + 0.2, en) * 0.5 : 0.5 + e(t, ps, ps + 1.2) * 0.5);
  return (
    <>
      <Svg>
        <Mac x={960} y={940} w={760} h={520} seed={16} brillo={0.2} />
        <g opacity={stop ? 1 : 0}><polygon points="960,560 990,500 1000,560" fill="#dff3f5" stroke="#9fb8bb" strokeWidth={3} /><Draw d="M985,520 Q1020,470 1060,480" p={e(t, en, en + 0.4) * (1 - e(t, ps - 0.2, ps))} col="#e8e1d2" w={4} /></g>
        <g transform={`translate(${x},520) rotate(${stop ? Math.sin(t * 30) * 2 : 0})`}><path d="M-120,-50 Q-30,-80 70,-54 Q120,-14 100,46 Q10,80 -90,60 Q-140,10 -120,-50 Z" fill="#e8e1d2" stroke="#b8ad98" strokeWidth={3} /></g>
        {t > li && <circle cx={990} cy={560} r={40} fill="none" stroke={C.sun} strokeWidth={6} strokeDasharray="10 8" opacity={1 - e(t, ps, ps + 0.6)} />}
        {t > li && t < ps && <g transform={`translate(${990 + Math.cos(t * 9) * 26},${600 + Math.sin(t * 9) * 16})`}><rect x={-50} y={-30} width={100} height={60} rx={8} fill="#26282b" /></g>}
      </Svg>
      <Lbl t={t} at={en + 0.3} out={ps} text="se engancha: hay filo" x={1500} y={300} size={50} col={C.red} />
      <Lbl t={t} at={li + 0.3} out={ps} text="lápiz y lija 220" x={1500} y={390} size={44} col={C.sun} />
      <Lbl t={t} at={ps + 0.8} text="pasa limpio" x={1500} y={300} size={60} col={C.ok} />
    </>
  );
};

// 41 · la mecha hace palanca con el vidrio: la maceta terminada se parte en dos
export const MechaPalanca: React.FC<FxP> = ({ t, a, m }) => {
  const tz = mk(m, "taladro", a + 1), tr = mk(m, "traba", tz + 2.2), pa = e(t, tr + 0.3, tr + 1.2), sx = shake(t, tr, 18);
  return (
    <>
      <Svg>
        <g transform={`translate(${sx},0)`}>
          <g transform={`translate(${-pa * 90},${pa * 20}) rotate(${-pa * 8} 960 860)`}><path d="M560,360 L640,860 L960,860 L960,360 Z" fill={C.marm} />{Array.from({ length: 14 }, (_, i) => <Vid key={i} x={600 + hash(i, 1) * 340} y={380 + hash(i, 2) * 460} r={22} col={i % 3} seed={i + 800} />)}</g>
          <g transform={`translate(${pa * 90},${pa * 20}) rotate(${pa * 8} 960 860)`}><path d="M960,360 L960,860 L1280,860 L1360,360 Z" fill={C.marm} />{Array.from({ length: 14 }, (_, i) => <Vid key={i} x={980 + hash(i, 3) * 340} y={380 + hash(i, 4) * 460} r={22} col={i % 3} seed={i + 830} />)}</g>
          <Vid x={960} y={840} r={30} col={0} seed={5} />
        </g>
        <g transform={`translate(960,${lerp(120, 800, e(t, tz, tr))}) rotate(${t > tr ? 0 : t * 900})`} opacity={cl((t - tz) * 3) * (1 - e(t, tr + 1.4, tr + 2))}><rect x={-6} y={-240} width={12} height={240} fill="#c9ced2" /><path d="M-6,-240 L6,-200 M-6,-180 L6,-140 M-6,-120 L6,-80 M-6,-60 L6,-20" stroke="#7a7f83" strokeWidth={3} /></g>
        <Draw d="M960,800 L940,700 L975,590 L950,470 L960,360" p={e(t, tr, tr + 0.4)} col="#141210" w={7} />
      </Svg>
      <Lbl t={t} at={tz + 1} text="la mecha empuja el vidrio" x={1640} y={230} size={42} col={C.ink} />
      <Lbl t={t} at={tr + 0.6} text="se parte en dos" x={1600} y={400} size={60} col={C.red} />
    </>
  );
};

// 42 · si ya no tiene agujero: cubremaceta, con una de plástico adentro que se saca para regar
export const CubreMaceta: React.FC<FxP> = ({ t, a, m }) => {
  const ad = mk(m, "adentro", a + 1.4), rg = mk(m, "regar", ad + 2.4), sube = e(t, rg, rg + 1) * (1 - e(t, rg + 2.4, rg + 3.4));
  return (
    <>
      <Svg>
        <g transform={`translate(0,${lerp(-380, 0, e(t, ad, ad + 1)) - sube * 300})`} opacity={cl((t - ad) * 3)}>
          <path d="M790,420 L830,820 L1090,820 L1130,420 Z" fill={C.plast2} />{Array.from({ length: 4 }, (_, i) => <circle key={i} cx={880 + i * 54} cy={812} r={9} fill="#141210" />)}
          {Array.from({ length: 9 }, (_, i) => { const ang = -Math.PI / 2 + (i - 4) * 0.3; return <ellipse key={i} cx={960 + Math.cos(ang) * 70} cy={400 + Math.sin(ang) * 70} rx={20} ry={56} transform={`rotate(${(ang * 180) / Math.PI + 90} ${960 + Math.cos(ang) * 70} ${400 + Math.sin(ang) * 70})`} fill={i % 2 ? "#6fae7a" : "#86c08f"} />; })}
        </g>
        <Mac x={960} y={900} w={520} h={460} seed={17} brillo={0.6} />
        {sube > 0.3 && Array.from({ length: 6 }, (_, i) => <circle key={i} cx={940 + i * 8} cy={lerp(560, 860, ((t * 2 + i / 6) % 1))} r={7} fill={C.water} />)}
      </Svg>
      <Lbl t={t} at={a + 0.4} text="no la taladres" x={1550} y={400} size={56} col={C.red} />
      <Lbl t={t} at={ad + 0.8} text="usala de cubremaceta" x={1550} y={500} size={48} col={C.ok} />
    </>
  );
};

// 43 · pincel sí, dedos no: el sellador se pasa con pincel, el dedo encuentra el filito
export const PincelNoDedo: React.FC<FxP> = ({ t, a, m }) => {
  const dd = mk(m, "dedo", a + 0.8), pc = mk(m, "pincel", dd + 3), p = e(t, pc, pc + 2.2);
  return (
    <>
      <Svg>
        <g opacity={1 - e(t, pc - 0.4, pc)}>
          <Mac x={960} y={880} w={560} h={460} seed={18} />
          <g transform={`translate(${lerp(760, 1000, e(t, dd, dd + 1.2))},560)`}><path d="M-40,60 L-40,-80 Q-40,-110 -10,-110 Q20,-110 20,-80 L20,60 Z" fill="#d8a77f" /><ellipse cx={-10} cy={-90} rx={18} ry={12} fill="#e8c3a0" /></g>
          <Cross t={t} at={dd + 1.3} x={960} y={300} r={56} />
        </g>
        <g opacity={e(t, pc - 0.2, pc + 0.3)}>
          <Mac x={960} y={880} w={560} h={460} seed={18} brillo={p} />
          <g transform={`translate(${lerp(720, 1180, (Math.sin(t * 2) + 1) / 2)},${lerp(500, 800, p)}) rotate(-30)`}><rect x={-10} y={-180} width={20} height={150} rx={6} fill={C.wood} /><rect x={-18} y={-36} width={36} height={22} fill="#9ba1a6" /><path d="M-18,-14 L18,-14 L14,26 L-14,26 Z" fill="#e8e4d6" /></g>
          <Tick t={t} at={pc + 0.6} x={960} y={300} r={56} />
        </g>
      </Svg>
      <Lbl t={t} at={dd + 0.4} out={pc} text="con los dedos, no" x={1550} y={540} size={54} col={C.red} />
      <Lbl t={t} at={pc + 0.6} text="pincel, dos manos finas" x={1550} y={540} size={48} col={C.ok} />
    </>
  );
};

// 44 · el antes y el después del sellador: una cortina barre la maceta y la deja oscura y viva
export const OscureceBrillo: React.FC<FxP> = ({ t, a, m }) => {
  const s = mk(m, "sello", a + 1.2), k = e(t, s, s + 2.4), xc = lerp(560, 1360, k);
  return (
    <>
      <Svg>
        <defs><clipPath id="obL"><rect x={0} y={0} width={xc} height={1080} /></clipPath></defs>
        <Mac x={960} y={920} w={720} h={600} seed={19} />
        <g clipPath="url(#obL)"><Mac x={960} y={920} w={720} h={600} seed={19} brillo={1} /></g>
        <line x1={xc} x2={xc} y1={260} y2={960} stroke={C.ink} strokeWidth={4} opacity={k > 0 && k < 1 ? 1 : 0} />
      </Svg>
      <Lbl t={t} at={s + 0.6} text="sellada: brillo de mojada" x={430} y={760} size={40} col={C.celeste} />
      <Lbl t={t} at={s + 2.4} text="el agua no entra" x={1520} y={760} size={44} col={C.ok} />
    </>
  );
};

// 45 · las cuatro defensas contra la rajadura: escudos que se encienden de a uno
export const CuatroDefensas: React.FC<FxP> = ({ t, a, m }) => {
  const ds = [["sin polvo de vidrio", "d1", C.hielo], ["marmolina", "d2", C.marm], ["pared de 2,5 cm", "d3", C.sun], ["que no viva empapada", "d4", C.celeste]] as const;
  return (
    <>
      <Svg>
        {ds.map(([, k, col], i) => {
          const at = mk(m, k, a + 0.6 + i * 2.2), x = 300 + i * 440, p = spr(t, at, 1.1);
          return <g key={k} opacity={Math.max(0.22 * cl((t - a - 0.2) * 3), cl((t - at) * 5))} transform={`translate(${x},${500 + (1 - p) * 120}) scale(${0.8 + 0.2 * p})`}>
            <path d="M0,-200 L150,-140 L150,10 Q150,140 0,210 Q-150,140 -150,10 L-150,-140 Z" fill="rgba(24,22,20,.86)" stroke={col} strokeWidth={8} />
            <text x={0} y={40} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={130} fill={col}>{i + 1}</text>
          </g>;
        })}
      </Svg>
      {ds.map(([w, k, col], i) => <Lbl key={k} t={t} at={mk(m, k, a + 0.6 + i * 2.2) + 0.3} text={w} x={300 + i * 440} y={820} size={36} col={col} />)}
    </>
  );
};

// 46 · levantada del plato: tres tapitas, y el agua se queda abajo sin tocarla
export const TapitasPlato: React.FC<FxP> = ({ t, a, m }) => {
  const tp = mk(m, "tapitas", a + 1.6), up = spr(t, tp + 0.4, 1);
  return (
    <>
      <Svg>
        <ellipse cx={960} cy={900} rx={420} ry={60} fill="#9a5a3b" /><ellipse cx={960} cy={884} rx={380} ry={46} fill="rgba(124,200,255,.55)" />
        {[-1, 0, 1].map((s) => <g key={s} opacity={cl((t - tp) * 5)} transform={`translate(${960 + s * 150},${880 - (1 - spr(t, tp)) * 300})`}><rect x={-32} y={-34} width={64} height={34} rx={6} fill={s ? C.red : C.verde} /></g>)}
        <g transform={`translate(0,${-34 * up})`}><Mac x={960} y={880} w={560} h={480} seed={20} brillo={0.8} /></g>
        {t < tp && <g opacity={0.8}>{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${760 + i * 36},${880} q6,-${20 + 30 * hash(i, 1)} 0,-${40 + 60 * hash(i, 2)}`} stroke={C.water} strokeWidth={5} fill="none" opacity={0.5 + 0.5 * Math.sin(t * 4 + i)} />)}</g>}
      </Svg>
      <Lbl t={t} at={a + 0.4} out={tp} text="empapada, siempre" x={1520} y={420} size={52} col={C.red} />
      <Lbl t={t} at={tp + 0.8} text="tres tapitas abajo" x={1520} y={420} size={56} col={C.ok} />
    </>
  );
};

// 47 · las cuentas: pilas de monedas que crecen; las botellas y los moldes no suman nada
export const CostosTorre: React.FC<FxP> = ({ t, a, m }) => {
  const cs = [["cemento", 3, "c1"], ["marmolina", 2, "c2"], ["lija", 1, "c3"], ["sellador", 1, "c4"], ["botellas", 0, "c5"], ["moldes", 0, "c6"]] as const;
  const hl = mk(m, "hora", a + 9);
  return (
    <>
      <Svg>
        {cs.map(([, n, k], i) => {
          const at = mk(m, k, a + 0.6 + i * 1), x = 300 + i * 264, h = Math.round(n * 2 * e(t, at, at + 0.8));
          return <g key={k} opacity={cl((t - at) * 4)}>
            {Array.from({ length: h }, (_, q) => <g key={q}><ellipse cx={x} cy={800 - q * 34} rx={70} ry={20} fill="#c99a3a" stroke="#8f6c22" strokeWidth={3} /><rect x={x - 70} y={786 - q * 34} width={140} height={14} fill="#b8892f" /></g>)}
            {n === 0 && <text x={x} y={790} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={72} fill={C.ok}>0</text>}
          </g>;
        })}
        <g opacity={e(t, hl, hl + 0.6)} transform={`translate(960,${300 - (1 - spr(t, hl)) * 60})`}><rect x={-330} y={-80} width={660} height={160} rx={24} fill="rgba(24,22,20,.9)" stroke={C.honey} strokeWidth={4} /><text x={0} y={20} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={58} fill={C.honey}>SE COBRA LA HORA DE LIJA</text></g>
      </Svg>
      {cs.map(([w, , k], i) => <Lbl key={k} t={t} at={mk(m, k, a + 0.6 + i * 1) + 0.3} text={w} x={300 + i * 264} y={900} size={36} col={i > 3 ? C.ok : C.ink} />)}
    </>
  );
};

// 48 · las preguntas por país: las cartas caen del buzón una por una, con su respuesta corta
export const CartasBuzon: React.FC<FxP> = ({ t, a, m }) => {
  const cs = [["México", "gris: más rústica", "mex"], ["Colombia", "cemento duro: no", "col"], ["Perú", "sin marmolina: arena", "per"], ["España", "grande: malla adentro", "esp"], ["Chile", "loza no brilla", "chi"], ["Argentina", "pintarla: una lástima", "arg"]] as const;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {cs.map(([pais, resp, k], i) => {
        const at = mk(m, k, a + 0.6 + i * 3), p = spr(t, at, 1), x = 330 + (i % 3) * 630, y = 330 + Math.floor(i / 3) * 400;
        return <div key={k} style={{ position: "absolute", left: x - 270, top: y - 140, width: 540, height: 260, ...glass(1), opacity: cl((t - at) * 4), transform: `translateY(${(1 - p) * -200}px) rotate(${(hash(i, 1) - 0.5) * 6}deg)`, padding: "26px 34px" }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: C.honey, textTransform: "uppercase" }}>desde {pais}</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 50, color: C.ink, marginTop: 16, lineHeight: 1.05, textTransform: "uppercase", opacity: e(t, at + 0.8, at + 1.3) }}>{resp}</div>
        </div>;
      })}
    </div>
  );
};

// 49 · qué plantar: suculentas, cactus y aromáticas entran; la primera semana, más riego
export const PlantasQueVan: React.FC<FxP> = ({ t, a, m }) => {
  const ps = [["suculentas", "p1"], ["cactus", "p2"], ["aromáticas", "p3"]] as const, rg = mk(m, "riego", a + 6);
  const planta = (i: number, x: number) => i === 0
    ? Array.from({ length: 9 }, (_, q) => { const ang = -Math.PI / 2 + (q - 4) * 0.34; return <ellipse key={q} cx={x + Math.cos(ang) * 50} cy={500 + Math.sin(ang) * 50} rx={18} ry={46} transform={`rotate(${(ang * 180) / Math.PI + 90} ${x + Math.cos(ang) * 50} ${500 + Math.sin(ang) * 50})`} fill={q % 2 ? "#6fae7a" : "#86c08f"} />; })
    : i === 1 ? <g><rect x={x - 30} y={360} width={60} height={200} rx={30} fill="#4f8f55" /><rect x={x - 90} y={420} width={40} height={90} rx={20} fill="#4f8f55" /><rect x={x + 50} y={400} width={40} height={80} rx={20} fill="#4f8f55" /></g>
    : <g>{Array.from({ length: 7 }, (_, q) => <path key={q} d={`M${x - 60 + q * 20},560 Q${x - 70 + q * 22},${440} ${x - 50 + q * 18},${360 + hash(q, 1) * 40}`} stroke="#5d8a52" strokeWidth={6} fill="none" />)}</g>;
  return (
    <>
      <Svg>
        {ps.map(([, k], i) => { const at = mk(m, k, a + 0.6 + i * 1.6), x = 460 + i * 500; return <g key={k} opacity={cl((t - at) * 4)} transform={`translate(0,${(1 - spr(t, at)) * 80})`}>{planta(i, x)}<Mac x={x} y={820} w={300} h={270} seed={50 + i} brillo={0.7} /><Tick t={t} at={at + 0.5} x={x + 160} y={380} r={34} /></g>; })}
        {t > rg && Array.from({ length: 10 }, (_, i) => <circle key={i} cx={460 + (i % 5) * 250} cy={lerp(200, 520, ((t - rg) * 0.8 + i / 10) % 1)} r={8} fill={C.water} opacity={0.8} />)}
      </Svg>
      {ps.map(([w, k], i) => <Lbl key={k} t={t} at={mk(m, k, a + 0.6 + i * 1.6) + 0.3} text={w} x={460 + i * 500} y={920} size={46} col={C.ok} />)}
      <Lbl t={t} at={rg + 0.3} text="primera semana: más agua" x={960} y={180} size={48} col={C.water} />
    </>
  );
};

// 50 · ¿de qué color van a ser las tuyas? tres macetas, una por color, y las barras que suben
export const ColorVotacion: React.FC<FxP> = ({ t, a, m }) => {
  const cs = [["verde de vino", C.verde, 0, "v1"], ["ámbar de cerveza", C.ambar, 1, "v2"], ["celeste", C.celeste, 2, "v3"]] as const;
  return (
    <>
      <Svg>
        {cs.map(([, col, gi, k], i) => {
          const at = mk(m, k, a + 0.6 + i * 1.4), x = 480 + i * 480, h = 300 * e(t, at, at + 2) * (0.7 + 0.3 * hash(i, 3));
          return <g key={k} opacity={Math.max(0.25 * cl((t - a - 0.2) * 3), cl((t - at) * 4))}>
            <rect x={x - 70} y={560 - h} width={140} height={h} rx={14} fill={col} opacity={0.85} />
            <g transform={`translate(0,${(1 - spr(t, at)) * 80})`}>{Array.from({ length: 1 }, () => <Mac key={0} x={x} y={840} w={260} h={240} seed={60 + i} />)}{Array.from({ length: 10 }, (_, q) => <Vid key={q} x={x - 90 + (q % 5) * 45} y={700 + Math.floor(q / 5) * 60} r={20} col={gi} seed={q + i * 10} />)}</g>
          </g>;
        })}
      </Svg>
      {cs.map(([w, col, , k], i) => <Lbl key={k} t={t} at={mk(m, k, a + 0.6 + i * 1.4) + 0.3} text={w} x={480 + i * 480} y={940} size={42} col={col} />)}
      <div style={{ position: "absolute", left: 960, top: 120, transform: "translateX(-50%)", fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.dim, opacity: e(t, a + 0.3, a + 0.9), whiteSpace: "nowrap" }}>contame en los comentarios</div>
    </>
  );
};
export const _unused3 = [Draw];
