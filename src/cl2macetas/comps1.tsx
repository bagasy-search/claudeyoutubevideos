// cl2macetas · componentes del gancho a la preparación (las botellas que se vuelven maceta, el trapo que no se engancha, las
// tres intrigas en macetas, la azotea vista de arriba, la soga con la seguridad, qué vidrio sirve, la vitrina de colores, las
// tres botellas, el balde de la noche, el azúcar que frena, la bolsa doble, el sonido de nieve, picos y fondos, las dos
// zarandas, el polvo que no se respira, mitad y mitad). Cada uno es f(t) puro; marcas (m.*) desde fx.json.
import React from "react";
import { C, FONT, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Big, Cross, Draw, FxP, Pop, Svg, Tick, Txt, shake } from "./kit";

export const mk = (m: Record<string, number>, k: string, d: number) => m[k] ?? d;
export const GL = [[C.verde, C.verde2], [C.ambar, C.ambar2], [C.celeste, C.celeste2], [C.hielo, "#9fb8bb"]] as const;

// ---------- formas que usan las tres hojas ----------
// pedazo de vidrio: polígono irregular determinista con brillo
export const Vid: React.FC<{ x: number; y: number; r: number; col?: number; seed?: number; o?: number; rot?: number }> = ({ x, y, r, col = 0, seed = 0, o = 1, rot = 0 }) => {
  const n = 5 + Math.floor(hash(seed, 3) * 3), [f, b] = GL[col % 4];
  const pts = Array.from({ length: n }, (_, q) => { const a = rot + (q / n) * Math.PI * 2 + hash(seed * 7 + q, 2) * 0.5, k = 0.6 + 0.5 * hash(seed * 11 + q, 5); return `${x + Math.cos(a) * r * k},${y + Math.sin(a) * r * k}`; }).join(" ");
  return <g opacity={o}><polygon points={pts} fill={f} stroke={b} strokeWidth={Math.max(1.5, r * 0.08)} strokeLinejoin="round" /><circle cx={x - r * 0.25} cy={y - r * 0.25} r={r * 0.18} fill="rgba(255,255,255,.55)" /></g>;
};
// botella de pie (x centro, y = base), alto h
export const Botella: React.FC<{ x: number; y: number; h: number; col?: number; o?: number; rot?: number; etq?: number; liq?: number }> = ({ x, y, h, col = 0, o = 1, rot = 0, etq = 0, liq = 0 }) => {
  const w = h * 0.3, [f, b] = GL[col % 4];
  const d = `M${-w / 2},0 L${-w / 2},${-h * 0.58} Q${-w / 2},${-h * 0.7} ${-w * 0.18},${-h * 0.76} L${-w * 0.16},${-h} L${w * 0.16},${-h} L${w * 0.18},${-h * 0.76} Q${w / 2},${-h * 0.7} ${w / 2},${-h * 0.58} L${w / 2},0 Z`;
  return (
    <g opacity={o} transform={`translate(${x},${y}) rotate(${rot})`}>
      <path d={d} fill={f} fillOpacity={0.82} stroke={b} strokeWidth={4} />
      {liq > 0 && <rect x={-w / 2 + 3} y={-h * 0.55 * liq} width={w - 6} height={h * 0.55 * liq - 3} fill="rgba(70,40,20,.45)" />}
      <rect x={-w * 0.12} y={-h * 0.95} width={w * 0.08} height={h * 0.8} fill="rgba(255,255,255,.35)" rx={3} />
      {etq > 0.01 && <rect x={-w / 2} y={-h * 0.46} width={w} height={h * 0.26} fill="#efe6cf" stroke="#b9ad8e" strokeWidth={2} opacity={etq} />}
      <rect x={-w * 0.2} y={-h - 8} width={w * 0.4} height={12} rx={3} fill={b} />
    </g>
  );
};
// maceta de frente (tronco de cono): x centro, y base, ancho de boca w, alto h; dibujo de vidrio adentro de la pared
export const Mac: React.FC<{ x: number; y: number; w: number; h: number; o?: number; vid?: number; gris?: number; brillo?: number; seed?: number; raja?: number }> = ({ x, y, w, h, o = 1, vid = 1, gris = 0, brillo = 0, seed = 0, raja = 0 }) => {
  const wb = w * 0.72, cid = `mp${seed}${Math.round(w)}`;
  const body = `M${x - w / 2},${y - h} L${x - wb / 2},${y} L${x + wb / 2},${y} L${x + w / 2},${y - h} Z`;
  const base = `rgb(${Math.round(lerp(236, 172, gris) - 30 * brillo)},${Math.round(lerp(232, 168, gris) - 30 * brillo)},${Math.round(lerp(222, 158, gris) - 32 * brillo)})`;
  return (
    <g opacity={o}>
      <defs><clipPath id={cid}><path d={body} /></clipPath><linearGradient id={cid + "g"} x1="0" x2="1"><stop offset="0" stopColor="rgba(255,255,255,.2)" /><stop offset=".5" stopColor="rgba(255,255,255,0)" /><stop offset="1" stopColor="rgba(0,0,0,.4)" /></linearGradient></defs>
      <ellipse cx={x + 8} cy={y + 6} rx={wb * 0.7} ry={14} fill="rgba(0,0,0,.4)" />
      <path d={body} fill={base} />
      <g clipPath={`url(#${cid})`}>
        {Array.from({ length: Math.round(28 * vid) }, (_, i) => <Vid key={i} x={x - w / 2 + w * hash(seed * 31 + i, 1)} y={y - h * hash(seed * 31 + i, 2)} r={w * (0.03 + 0.035 * hash(seed * 31 + i, 3))} col={hash(seed * 31 + i, 4) < 0.45 ? 0 : hash(seed * 31 + i, 4) < 0.75 ? 1 : hash(seed * 31 + i, 4) < 0.9 ? 2 : 3} seed={seed * 31 + i} o={1 - gris * 0.92} />)}
        <path d={body} fill={`url(#${cid}g)`} />
        {brillo > 0.01 && <line x1={x - w * 0.22} y1={y - h * 0.92} x2={x - wb * 0.2} y2={y - h * 0.08} stroke="rgba(255,255,255,.5)" strokeWidth={w * 0.05} opacity={brillo} strokeLinecap="round" />}
        {raja > 0.01 && <polyline points={`${x + w * 0.1},${y - h} ${x + w * 0.03},${y - h * 0.7} ${x + w * 0.12},${y - h * 0.45} ${x + w * 0.04},${y - h * 0.15}`} fill="none" stroke="#141210" strokeWidth={5} strokeDasharray={`${raja * h * 1.3} 9999`} strokeLinejoin="round" />}
      </g>
      <ellipse cx={x} cy={y - h} rx={w / 2} ry={w * 0.08} fill="#2b2621" stroke={base} strokeWidth={8} />
    </g>
  );
};
// balde de plástico (x centro, y base)
export const BaldeP: React.FC<{ x: number; y: number; w: number; h: number; col?: string; o?: number; lv?: number; liq?: string; children?: React.ReactNode }> = ({ x, y, w, h, col = C.plast, o = 1, lv = 0, liq = C.water, children }) => {
  const wb = w * 0.8, yl = y - h * lv, wl = lerp(wb, w, lv);
  return (
    <g opacity={o}>
      {lv > 0.01 && <path d={`M${x - wb / 2 + 6},${y - 4} L${x - wl / 2 + 6},${yl} L${x + wl / 2 - 6},${yl} L${x + wb / 2 - 6},${y - 4} Z`} fill={liq} opacity={0.55} />}
      {children}
      <path d={`M${x - w / 2},${y - h} L${x - wb / 2},${y} L${x + wb / 2},${y} L${x + w / 2},${y - h}`} fill="none" stroke={col} strokeWidth={10} strokeLinejoin="round" />
      <rect x={x - w / 2 - 8} y={y - h - 8} width={w + 16} height={14} rx={7} fill={col} />
    </g>
  );
};
// vaso de plástico medidor (x centro, y base)
export const Vaso: React.FC<{ x: number; y: number; s?: number; lv?: number; fill?: string; o?: number; txt?: string }> = ({ x, y, s = 1, lv = 1, fill = C.marm, o = 1, txt }) => (
  <g opacity={o} transform={`translate(${x},${y}) scale(${s})`}>
    {lv > 0.01 && <path d={`M-34,0 L${-34 - 8 * lv},${-110 * lv} L${34 + 8 * lv},${-110 * lv} L34,0 Z`} fill={fill} />}
    <path d="M-44,-120 L-34,0 L34,0 L44,-120" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.75)" strokeWidth={4} strokeLinejoin="round" />
    {txt && <text x={0} y={46} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.ink}>{txt}</text>}
  </g>
);

// 1 · el gancho: tres botellas se parten y los pedazos vuelan a formar la pared de la maceta
export const BotellasAMaceta: React.FC<FxP> = ({ t, a, m }) => {
  const r = mk(m, "rompe", a + 1.4), ar = mk(m, "arma", r + 1.6), k = e(t, ar, ar + 1.6), sx = shake(t, r, 16);
  const bot = [[-1, 0], [0, 1], [1, 2]] as const;
  return (
    <Svg>
      <g transform={`translate(${sx},0)`}>
        {bot.map(([dx, col], i) => <Botella key={i} x={960 + dx * 260} y={820} h={420} col={col} o={1 - e(t, r, r + 0.15)} />)}
        {Array.from({ length: 46 }, (_, i) => {
          const col = i % 7 === 6 ? 2 : i % 3, sx0 = 960 + (Math.floor(i / 16) - 1) * 260 + (hash(i, 1) - 0.5) * 120, sy0 = 820 - hash(i, 2) * 400;
          const fly = e(t, r, r + 0.7), vx = (hash(i, 3) - 0.5) * 900, vy = -200 - hash(i, 4) * 300;
          const px = sx0 + vx * fly * (1 - k), py = sy0 + (vy * fly + 500 * fly * fly) * (1 - k);
          const tx = 960 + (hash(i, 5) - 0.5) * lerp(380, 280, hash(i, 6)) * 1.0, ty = 860 - hash(i, 6) * 360;
          return <Vid key={i} x={lerp(px, tx, k)} y={Math.min(lerp(py, ty, k), 900)} r={22 + 14 * hash(i, 7)} col={col} seed={i} o={cl((t - r) * 8)} rot={t * (hash(i, 8) - 0.5) * 4 * (1 - k)} />;
        })}
        <g opacity={e(t, ar + 1.2, ar + 2)}><Mac x={960} y={890} w={420} h={380} seed={3} /></g>
      </g>
      <Lbl t={t} at={r + 0.2} out={ar} text="tres botellas rotas" x={960} y={180} col={C.ink} />
      <Lbl t={t} at={ar + 1.6} text="una maceta" x={1480} y={560} col={C.verde} size={80} />
    </Svg>
  );
};

// 2 · la prueba del trapo en el gancho: el trapo recorre el borde y no deja ni un hilo
export const TrapoBorde: React.FC<FxP> = ({ t, a, b, m }) => {
  const p = mk(m, "pasa", a + 1), u = e(t, p, Math.min(b - 1, p + 4)), ang = u * Math.PI * 1.6 - Math.PI * 0.8;
  const cx = 960 + Math.sin(ang) * 300, cy = 470 + Math.cos(ang) * 50;
  return (
    <Svg>
      <Mac x={960} y={930} w={620} h={460} seed={5} />
      <g transform={`translate(${cx},${cy}) rotate(${Math.sin(t * 3) * 6})`} opacity={cl((t - p) * 5)}>
        <path d="M-90,-40 Q-20,-70 60,-44 Q100,-10 80,40 Q10,70 -70,52 Q-110,10 -90,-40 Z" fill="#e8e1d2" stroke="#b8ad98" strokeWidth={3} />
        {Array.from({ length: 8 }, (_, i) => <line key={i} x1={-70 + i * 18} y1={-44} x2={-74 + i * 18} y2={50} stroke="rgba(150,140,120,.35)" strokeWidth={2} />)}
      </g>
      {Array.from({ length: 6 }, (_, i) => { const at = p + 0.6 + i * 0.55; return <Tick key={i} t={t} at={at} x={960 + Math.sin(-Math.PI * 0.8 + ((i + 0.5) / 6) * Math.PI * 1.6) * 300} y={380} r={22} />; })}
      <Lbl t={t} at={p + 2.2} text="ni un hilo" x={1500} y={640} col={C.ok} size={84} />
      <Lbl t={t} at={p + 3.4} text="ningún filo afuera" x={1500} y={760} col={C.ink} size={52} />
    </Svg>
  );
};

// 3 · las tres intrigas, cada una colgada de su maceta con una tarjeta
export const TresMacetasIntriga: React.FC<FxP> = ({ t, a, m }) => {
  const it = [["el vidrio no aparece", mk(m, "i1", a + 0.8), 0.9, 0], ["el error del agujero", mk(m, "i2", a + 3), 0, 0], ["se raja sola", mk(m, "i3", a + 5.5), 0, 1]] as const;
  return (
    <>
      <Svg>
        {it.map(([, at, gris, raja], i) => {
          const p = spr(t, at, 1.1), x = 420 + i * 540;
          return <g key={i} transform={`translate(0,${(1 - p) * 120})`} opacity={cl((t - at) * 6)}>
            <Mac x={x} y={860} w={300} h={280} gris={gris} seed={i + 10} raja={raja ? e(t, at + 0.6, at + 1.6) : 0} />
            {i === 1 && <g><ellipse cx={x} cy={860} rx={30} ry={8} fill="#141210" /><Cross t={t} at={at + 0.7} x={x} y={620} r={36} /></g>}
            <text x={x} y={520} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={120} fill={C.sun} opacity={cl((t - at - 0.3) * 4)}>?</text>
          </g>;
        })}
      </Svg>
      {it.map(([w, at], i) => <Lbl key={i} t={t} at={at + 0.2} text={w} x={420 + i * 540} y={950} col={i === 2 ? C.red : C.ink} size={44} />)}
    </>
  );
};

// 4 · la azotea vista de arriba: tanque, mesa, plantas, pretil, y la azotea de Doña Elvira del otro lado
export const AzoteaPlano: React.FC<FxP> = ({ t, a, m }) => {
  const tq = mk(m, "tanque", a + 0.8), ms = mk(m, "mesa", a + 1.8), el = mk(m, "elvira", a + 3.5), d = e(t, a, a + 1.2);
  const tiles = Array.from({ length: 11 * 7 }, (_, i) => ({ x: 300 + (i % 11) * 72, y: 160 + Math.floor(i / 11) * 72 }));
  return (
    <>
      <Svg>
        <g opacity={d}>
          {tiles.map((q, i) => <rect key={i} x={q.x} y={q.y} width={70} height={70} fill={hash(i, 2) > 0.5 ? C.teja : "#a64a33"} opacity={0.75} />)}
          <rect x={296} y={156} width={800} height={512} fill="none" stroke="#f1ede4" strokeWidth={18} />
        </g>
        <g opacity={cl((t - tq) * 4)} transform={`translate(1000,250) scale(${spr(t, tq)})`}><circle r={70} fill="#d9cfb2" stroke="#8f8466" strokeWidth={6} /><circle r={20} fill="#8f8466" /></g>
        <g opacity={cl((t - ms) * 4)} transform={`translate(640,430) scale(${spr(t, ms)})`}><rect x={-150} y={-70} width={300} height={140} fill="#aab2b8" stroke="#5b6267" strokeWidth={6} /><Mac x={70} y={30} w={70} h={60} seed={2} /></g>
        {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={330 + i * 40} cy={630} r={16} fill="#5f9e5c" opacity={d} />)}
        {/* la azotea de al lado */}
        <g opacity={e(t, el, el + 0.8)} transform={`translate(${(1 - spr(t, el)) * 200},0)`}>
          {Array.from({ length: 5 * 7 }, (_, i) => <rect key={i} x={1130 + (i % 5) * 72} y={160 + Math.floor(i / 5) * 72} width={70} height={70} fill="#8f8a80" opacity={0.6} />)}
          {Array.from({ length: 9 }, (_, i) => <Mac key={i} x={1170 + (i % 3) * 110} y={300 + Math.floor(i / 3) * 140} w={70} h={56} seed={20 + i} />)}
        </g>
        <Draw d="M1110,140 L1110,690" p={e(t, el, el + 0.6)} col={C.honey} w={6} dash="0.03 0.02" />
      </Svg>
      <Lbl t={t} at={tq + 0.2} text="el tanque" x={1000} y={360} size={40} />
      <Lbl t={t} at={ms + 0.2} text="mesa de trabajo" x={640} y={560} size={40} />
      <Lbl t={t} at={el + 0.6} text="Doña Elvira" x={1310} y={760} col={C.honey} size={60} />
      <Lbl t={t} at={el + 1.4} text="treinta años de macetas" x={1310} y={850} col={C.ink} size={40} />
    </>
  );
};

// 5 · la seguridad colgada de una soga, con broches: cada cosa cae a su lugar al nombrarla
export const SogaSeguridad: React.FC<FxP> = ({ t, a, m }) => {
  const its = [["guantes", "guan"], ["anteojos", "ante"], ["mangas largas", "mang"], ["zapatos cerrados", "zap"], ["barbijo", "barb"]] as const;
  return (
    <>
      <Svg>
        <Draw d="M80,250 Q960,360 1840,250" p={e(t, a, a + 0.8)} col="#d8cfbd" w={6} />
        {its.map(([, k], i) => {
          const at = mk(m, k, a + 1 + i * 1.2), x = 260 + i * 350, y = 250 + 110 * Math.sin((x - 80) / 1760 * Math.PI) * 0.97;
          const p = spr(t, at, 1.2, 0.25), sw = Math.sin((t - at) * 5) * 8 * Math.exp(-(t - at) * 1.5);
          return <g key={k} opacity={cl((t - at) * 6)} transform={`translate(${x},${y - (1 - p) * 300}) rotate(${sw})`}>
            <rect x={-8} y={-24} width={16} height={44} rx={4} fill="#c79a5b" />
            <rect x={-110} y={16} width={220} height={240} rx={24} fill="rgba(24,22,20,.86)" stroke="rgba(255,236,200,.4)" strokeWidth={3} />
            {i === 0 && <path d="M-50,220 L-50,110 Q-50,80 -30,80 L-30,60 Q-20,40 -10,60 L-10,50 Q0,30 10,50 L10,60 Q20,40 30,60 L30,110 Q60,120 50,150 L40,220 Z" fill={C.honey} />}
            {i === 1 && <g><circle cx={-40} cy={140} r={36} fill="rgba(127,214,234,.35)" stroke={C.ink} strokeWidth={8} /><circle cx={40} cy={140} r={36} fill="rgba(127,214,234,.35)" stroke={C.ink} strokeWidth={8} /><line x1={-4} y1={140} x2={4} y2={140} stroke={C.ink} strokeWidth={8} /></g>}
            {i === 2 && <path d="M-70,80 L-20,70 L20,70 L70,80 L60,230 L20,230 L20,120 L-20,120 L-20,230 L-60,230 Z" fill={C.verde2} />}
            {i === 3 && <path d="M-80,200 Q-80,140 -30,140 L10,110 Q60,120 80,170 L80,210 L-80,210 Z" fill="#6e4b25" />}
            {i === 4 && <g><path d="M-70,110 Q0,80 70,110 L60,190 Q0,220 -60,190 Z" fill="#e8e6e0" /><line x1={-70} y1={115} x2={-100} y2={100} stroke="#e8e6e0" strokeWidth={5} /><line x1={70} y1={115} x2={100} y2={100} stroke="#e8e6e0" strokeWidth={5} /></g>}
          </g>;
        })}
      </Svg>
      {its.map(([w, k], i) => <Lbl key={k} t={t} at={mk(m, k, a + 1 + i * 1.2) + 0.25} text={w} x={260 + i * 350} y={720} size={40} col={i % 2 ? C.honey : C.ink} />)}
    </>
  );
};

// 6 · qué vidrio sirve: los de envase pasan, ventana / espejo / templado no
export const QueVidrioSirve: React.FC<FxP> = ({ t, a, m }) => {
  const si = mk(m, "si", a + 0.6), ven = mk(m, "ven", a + 3), esp = mk(m, "esp", ven + 2), tem = mk(m, "tem", esp + 2);
  return (
    <>
      <Svg>
        {[0, 1, 2].map((i) => <g key={i} opacity={cl((t - si - i * 0.2) * 5)}><Botella x={260 + i * 150} y={560} h={300} col={i} /></g>)}
        <Tick t={t} at={si + 0.9} x={410} y={680} r={50} />
        {/* ventana: láminas finas como cuchillos */}
        <g opacity={cl((t - ven) * 5)}>{Array.from({ length: 5 }, (_, i) => <polygon key={i} points={`${960 + i * 30},${300 + i * 20} ${1000 + i * 30},${310 + i * 20} ${990 + i * 30},${560} ${975 + i * 30},${560}`} fill="rgba(200,230,235,.5)" stroke="#dff3f5" strokeWidth={2} />)}<Cross t={t} at={ven + 0.5} x={1030} y={680} r={44} /></g>
        <g opacity={cl((t - esp) * 5)}><rect x={1250} y={330} width={160} height={220} rx={10} fill="#b9c7cc" stroke="#7d8b90" strokeWidth={5} /><rect x={1250} y={330} width={160 * (1 - e(t, esp + 0.3, esp + 1.2))} height={220} rx={10} fill="#3b3b3b" opacity={0.6} /><Cross t={t} at={esp + 0.5} x={1330} y={680} r={44} /></g>
        <g opacity={cl((t - tem) * 5)}>{Array.from({ length: 40 }, (_, i) => <circle key={i} cx={1560 + (i % 8) * 22 + (Math.floor(i / 8) % 2) * 10} cy={360 + Math.floor(i / 8) * 40} r={9} fill="#cfe7ea" stroke="#8fb0b4" strokeWidth={2} />)}<Cross t={t} at={tem + 0.5} x={1640} y={680} r={44} /></g>
      </Svg>
      <Lbl t={t} at={si + 0.4} text="botellas y frascos" x={410} y={820} col={C.ok} size={50} />
      <Lbl t={t} at={ven + 0.3} text="ventana" x={1030} y={820} col={C.red} size={46} />
      <Lbl t={t} at={esp + 0.3} text="espejo" x={1330} y={820} col={C.red} size={46} />
      <Lbl t={t} at={tem + 0.3} text="templado" x={1640} y={820} col={C.red} size={46} />
    </>
  );
};

// 7 · la vitrina de colores: cada vidrio sobre cemento blanco, y lo que parece
export const VitrinaColores: React.FC<FxP> = ({ t, a, m }) => {
  const cs = [["verde: vino", 0, "c1"], ["marrón: miel", 1, "c2"], ["transparente: hielo", 3, "c3"], ["celeste: oro", 2, "c4"]] as const;
  return (
    <>
      <Svg>
        {cs.map(([, col, k], i) => {
          const at = mk(m, k, a + 0.6 + i * 1.6), p = spr(t, at), x = 330 + i * 420;
          return <g key={k} opacity={cl((t - at) * 5)} transform={`translate(${x},${520 + (1 - p) * 140})`}>
            <rect x={-170} y={-200} width={340} height={340} rx={30} fill={C.marm} stroke="#cfc8b8" strokeWidth={4} />
            {Array.from({ length: 9 }, (_, q) => <Vid key={q} x={-110 + (q % 3) * 110} y={-130 + Math.floor(q / 3) * 110} r={34 + 8 * hash(q + i * 9, 1)} col={col} seed={q + i * 9} />)}
            {col === 2 && <circle r={150} fill="none" stroke={C.sun} strokeWidth={5} opacity={0.5 + 0.5 * Math.sin((t - at) * 4)} />}
          </g>;
        })}
      </Svg>
      {cs.map(([w, , k], i) => <Lbl key={k} t={t} at={mk(m, k, a + 0.6 + i * 1.6) + 0.3} text={w} x={330 + i * 420} y={760} size={42} col={i === 3 ? C.celeste : C.ink} />)}
    </>
  );
};

// 8 · lo que lleva una maceta mediana: dos de vino, una de cerveza y medio frasco celeste
export const TresBotellasPorMaceta: React.FC<FxP> = ({ t, a, m }) => {
  const s = mk(m, "suma", a + 3), k = e(t, s, s + 1.4);
  const bs = [[0, 1], [0, 1], [1, 1], [2, 0.5]] as const;
  return (
    <>
      <Svg>
        {bs.map(([col, f], i) => {
          const at = a + 0.5 + i * 0.6, x = 330 + i * 220;
          return <g key={i} opacity={cl((t - at) * 5) * (1 - k * 0.85)} transform={`translate(${lerp(0, 1150 - x, k)},${lerp(0, 120, k)}) scale(${lerp(1, 0.4, k)})`} style={{ transformOrigin: `${x}px 760px` }}>
            <Botella x={x} y={760} h={f < 1 ? 220 : 340} col={col} />
          </g>;
        })}
        <text x={1060} y={600} fontFamily={FONT} fontWeight={800} fontSize={140} fill={C.ink} opacity={cl((t - s) * 4)}>=</text>
        <g opacity={e(t, s + 0.6, s + 1.4)} transform={`translate(0,${(1 - spr(t, s + 0.6)) * 80})`}><Mac x={1480} y={840} w={380} h={360} seed={7} /></g>
      </Svg>
      <Lbl t={t} at={a + 0.8} text="dos de vino" x={440} y={880} size={42} col={C.verde} />
      <Lbl t={t} at={a + 2.1} text="una de cerveza" x={770} y={880} size={42} col={C.ambar} />
      <Lbl t={t} at={s + 1.4} text="una maceta mediana" x={1480} y={950} size={50} />
    </>
  );
};

// 9 · el balde de la noche: botellas en agua tibia, la luna pasa y las etiquetas flotan solas
export const BaldeNoche: React.FC<FxP> = ({ t, a, m }) => {
  const n = mk(m, "noche", a + 1), d = mk(m, "despega", n + 3), arc = e(t, n, d);
  return (
    <>
      <Svg>
        <g opacity={1 - arc * 0.8} transform={`translate(${lerp(300, 1600, arc)},${300 - Math.sin(arc * Math.PI) * 180})`}><circle r={60} fill="#e9eef7" /><circle cx={24} cy={-10} r={54} fill={C.night} /></g>
        <g opacity={e(t, d - 0.6, d)} transform={`translate(1600,240) rotate(${t * 10})`}>{Array.from({ length: 10 }, (_, i) => <line key={i} x1={0} y1={64} x2={0} y2={92} stroke={C.sun} strokeWidth={8} strokeLinecap="round" transform={`rotate(${i * 36})`} />)}<circle r={50} fill={C.sun} /></g>
        <BaldeP x={960} y={900} w={620} h={440} lv={0.78} col={C.plast}>
          {[0, 1, 2].map((i) => <Botella key={i} x={790 + i * 170} y={890} h={360} col={i === 1 ? 1 : 0} rot={(i - 1) * 8} etq={1} o={0.9} />)}
        </BaldeP>
        {[0, 1, 2].map((i) => { const u = e(t, d + i * 0.4, d + 1.6 + i * 0.4); return <rect key={i} x={760 + i * 170 + u * 30} y={lerp(700, 560, u)} width={110} height={90} rx={4} fill="#efe6cf" stroke="#b9ad8e" strokeWidth={2} opacity={u} transform={`rotate(${u * (i - 1) * 25} ${815 + i * 170} 600)`} />; })}
      </Svg>
      <Lbl t={t} at={n + 0.3} text="agua tibia, toda la noche" x={960} y={170} size={54} />
      <Lbl t={t} at={d + 1} text="se despegan solas" x={1500} y={760} col={C.ok} size={56} />
    </>
  );
};

// 10 · el azúcar frena el cemento: un terrón cae y la barra de dureza se arrastra
export const AzucarFrena: React.FC<FxP> = ({ t, a, m }) => {
  const az = mk(m, "azucar", a + 1.5), u = t - a;
  const limpio = cl(u / 5), sucio = cl(u / 5) * lerp(1, 0.32, e(t, az, az + 1.5));
  const bar = (y: number, v: number, col: string) => <g><rect x={700} y={y} width={900} height={70} rx={35} fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.25)" strokeWidth={2} /><rect x={700} y={y} width={900 * v} height={70} rx={35} fill={col} /></g>;
  return (
    <>
      <Svg>
        {bar(460, limpio, C.ok)}
        {bar(680, sucio, C.ambar)}
        <g transform={`translate(560,${lerp(380, 715, e(t, az - 0.6, az))}) rotate(${t * 40})`} opacity={cl((t - az + 0.8) * 4)}><rect x={-40} y={-40} width={80} height={80} rx={8} fill="#fffaf0" stroke="#d6cfc0" strokeWidth={3} /></g>
      </Svg>
      <Lbl t={t} at={a + 0.3} text="vidrio lavado" x={560} y={495} size={44} col={C.ok} align="right" />
      <Lbl t={t} at={az + 0.2} text="con azúcar" x={480} y={715} size={44} col={C.ambar} align="right" />
      <Lbl t={t} at={az + 1.5} text="nunca toma fuerza" x={1150} y={900} size={60} col={C.red} />
    </>
  );
};

// 11 · la bolsa doble sobre la alfombra: el martillo pega y los pedazos se quedan adentro
export const BolsaDoble: React.FC<FxP> = ({ t, a, m }) => {
  const g0 = mk(m, "golpe", a + 2), hits = [0, 0.7, 1.4, 2.1].map((q) => g0 + q);
  const last = hits.filter((h) => t >= h).pop(), sx = last ? shake(t, last, 10) : 0;
  const hu = last ? cl((t - last) / 0.35) : 1, hang = Math.sin(hu * Math.PI) * -50;
  return (
    <>
      <Svg>
        <rect x={360} y={760} width={1200} height={80} rx={16} fill="#7a3b2e" /><rect x={360} y={760} width={1200} height={80} rx={16} fill="none" stroke="#c78b5c" strokeWidth={4} strokeDasharray="20 12" />
        <g transform={`translate(${sx},0)`}>
          <path d="M620,770 Q600,560 700,480 L1220,480 Q1320,560 1300,770 Z" fill="#b8955e" stroke="#7a5f35" strokeWidth={6} />
          {Array.from({ length: 14 }, (_, i) => <line key={i} x1={640 + i * 46} y1={500} x2={630 + i * 46} y2={760} stroke="rgba(90,70,40,.35)" strokeWidth={3} />)}
          <path d="M680,760 Q670,600 740,530 L1180,530 Q1250,600 1240,760" fill="none" stroke="#e1d5b7" strokeWidth={4} strokeDasharray="10 8" opacity={e(t, a + 0.6, a + 1.2)} />
          <path d="M920,480 Q960,420 1000,480" fill="none" stroke="#7a5f35" strokeWidth={10} />
          {Array.from({ length: Math.round(18 * e(t, g0, g0 + 3)) }, (_, i) => <Vid key={i} x={760 + hash(i, 1) * 400} y={740 - hash(i, 2) * 30} r={10 + 6 * hash(i, 3)} col={i % 3} seed={i} o={0.5} />)}
        </g>
        <g transform={`translate(1280,330) rotate(${hang - 20} 0 0)`}><rect x={-14} y={0} width={28} height={300} rx={8} fill="#8a5a2b" /><rect x={-70} y={-40} width={140} height={60} rx={8} fill="#5d5f63" /></g>
      </Svg>
      <Lbl t={t} at={a + 0.4} text="dos bolsas" x={430} y={620} size={56} col={C.honey} />
      <Lbl t={t} at={a + 1.1} text="alfombra vieja, afuera" x={430} y={700} size={40} />
      <Lbl t={t} at={g0 + 2.4} text="golpes cortos" x={960} y={930} size={56} col={C.ok} />
    </>
  );
};

// 12 · el sonido que avisa: la onda pasa de golpes secos a un susurro parejo, como nieve
export const SonidoNieve: React.FC<FxP> = ({ t, a, m }) => {
  const n = mk(m, "nieve", a + 3), k = e(t, n - 0.5, n + 1), off = t * 260;
  const pts = Array.from({ length: 220 }, (_, i) => {
    const x = 180 + i * 7.3, q = (i * 7.3 + off) / 60, seco = Math.exp(-((q % 6) * 2.2)) * 220 * Math.sin(q * 9), fino = (hash(Math.floor(i + off / 7.3), 4) - 0.5) * 70;
    return `${x},${560 + lerp(seco, fino, k)}`;
  }).join(" ");
  return (
    <>
      <Svg>
        <line x1={160} x2={1780} y1={560} y2={560} stroke="rgba(255,255,255,.15)" strokeWidth={2} />
        <polyline points={pts} fill="none" stroke={k > 0.5 ? C.hielo : C.honey} strokeWidth={5} strokeLinejoin="round" opacity={e(t, a, a + 0.6)} />
        {k > 0.3 && Array.from({ length: 30 }, (_, i) => <circle key={i} cx={(hash(i, 1) * 1920 + t * 20) % 1920} cy={(hash(i, 2) * 300 + t * 60 * (0.5 + hash(i, 3))) % 1080} r={3 + 3 * hash(i, 4)} fill="white" opacity={0.6 * k} />)}
      </Svg>
      <Lbl t={t} at={a + 0.6} out={n} text="seco y fuerte" x={960} y={850} col={C.honey} size={72} />
      <Lbl t={t} at={n + 0.4} text="como pisar nieve" x={960} y={850} col={C.hielo} size={72} />
    </>
  );
};

// 13 · picos y fondos enteros: la pinza los saca de la pila para romperlos aparte
export const PicosFondos: React.FC<FxP> = ({ t, a, m }) => {
  const p = mk(m, "pinza", a + 1.5), sale = e(t, p + 0.5, p + 1.5);
  return (
    <>
      <Svg>
        {Array.from({ length: 60 }, (_, i) => <Vid key={i} x={600 + hash(i, 1) * 720} y={760 + hash(i, 2) * 120 - Math.sin(hash(i, 1) * Math.PI) * 120} r={14 + 10 * hash(i, 3)} col={i % 3} seed={i + 40} />)}
        <g transform={`translate(${lerp(0, 380, sale)},${lerp(0, -260, sale)})`}>
          <path d="M780,700 L800,600 L820,600 L840,700 Z" fill={C.verde} stroke={C.verde2} strokeWidth={4} />
          <g transform={`translate(810,600) rotate(-30)`} opacity={cl((t - p) * 4)}><rect x={-8} y={-260} width={10} height={260} fill="#9ba1a6" transform="rotate(-6)" /><rect x={4} y={-260} width={10} height={260} fill="#9ba1a6" transform="rotate(6)" /></g>
        </g>
        <g transform={`translate(${lerp(0, -380, sale)},${lerp(0, -260, sale)})`}><ellipse cx={1150} cy={720} rx={80} ry={30} fill={C.verde2} stroke={C.verde} strokeWidth={8} /></g>
      </Svg>
      <Lbl t={t} at={p + 1.2} text="picos enteros" x={1300} y={960} size={50} />
      <Lbl t={t} at={p + 1.6} text="fondos: verde profundo" x={640} y={960} size={50} col={C.verde} />
    </>
  );
};

// 14 · las dos zarandas: lo que queda arriba y lo que pasa, a tres latas
export const ZarandaDoble: React.FC<FxP> = ({ t, a, m }) => {
  const z1 = mk(m, "z1", a + 1), z2 = mk(m, "z2", z1 + 3), j1 = Math.sin(t * 22) * 8 * (t > z1 && t < z1 + 2 ? 1 : 0), j2 = Math.sin(t * 22) * 8 * (t > z2 && t < z2 + 2 ? 1 : 0);
  const lata = (x: number, at: number, txt: string, n: number, r: number) => <g opacity={cl((t - at) * 4)}>
    <rect x={x - 90} y={760} width={180} height={190} rx={10} fill="#9ba1a6" stroke="#5b6267" strokeWidth={5} />
    {Array.from({ length: Math.round(n * e(t, at, at + 1.5)) }, (_, i) => r > 3 ? <Vid key={i} x={x - 60 + hash(i, 1) * 120} y={780 - hash(i, 2) * 20} r={r} col={i % 3} seed={i + x} /> : <circle key={i} cx={x - 70 + hash(i, 1) * 140} cy={770 - hash(i, 2) * 14} r={2} fill="#e8efef" />)}
    <text x={x} y={890} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#1b1a19">{txt}</text>
  </g>;
  return (
    <>
      <Svg>
        <g transform={`translate(${j1},0)`}><rect x={560} y={240} width={800} height={60} rx={8} fill="none" stroke={C.wood} strokeWidth={22} /><path d="M580,270 L1340,270" stroke="#c9c9c9" strokeWidth={4} strokeDasharray="14 14" /><text x={1390} y={285} fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.dim}>1 cm</text></g>
        <g transform={`translate(${j2},0)`}><rect x={560} y={450} width={800} height={60} rx={8} fill="none" stroke={C.wood} strokeWidth={22} /><path d="M580,480 L1340,480" stroke="#c9c9c9" strokeWidth={2} strokeDasharray="3 4" /><text x={1390} y={495} fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.dim}>mosquitero</text></g>
        {Array.from({ length: 24 }, (_, i) => { const u = cl((t - z1 - i * 0.06) / 1.2); return u > 0 && u < 1 ? <Vid key={i} x={600 + hash(i, 1) * 700} y={lerp(300, 450, u)} r={8} col={i % 3} seed={i} /> : null; })}
        {lata(560, z1 + 0.6, "grande", 14, 18)}
        {lata(960, z2 + 0.6, "mediano", 18, 10)}
        {lata(1360, z2 + 1.2, "polvo", 80, 0)}
      </Svg>
      <Lbl t={t} at={z2 + 2.4} text="grande + mediano: sí" x={760} y={1010} size={44} col={C.ok} />
      <Lbl t={t} at={z2 + 3} text="polvo: no" x={1360} y={1010} size={44} col={C.red} />
    </>
  );
};

// 15 · el polvo de vidrio: la nube va al pulmón; mojado, envuelto y embotellado no vuela
export const PolvoPulmon: React.FC<FxP> = ({ t, a, m }) => {
  const mj = mk(m, "moja", a + 3), bt = mk(m, "botella", mj + 2.5), nube = 1 - e(t, mj, mj + 1);
  return (
    <>
      <Svg>
        <g opacity={nube}>{Array.from({ length: 70 }, (_, i) => { const u = ((t - a) * 0.3 + hash(i, 1)) % 1; return <circle key={i} cx={lerp(480, 1180, u) + Math.sin(u * 9 + i) * 40} cy={640 - u * 220 + (hash(i, 2) - 0.5) * 120} r={3 + 4 * hash(i, 3)} fill="#e9f1f1" opacity={0.7} />; })}</g>
        <g transform="translate(1340,470)" opacity={cl((t - a - 0.8) * 3)}>
          <path d="M-20,-150 L-20,-60 Q-120,-60 -130,60 Q-140,170 -50,160 Q-20,150 -20,60 Z" fill="none" stroke={nube > 0.5 ? C.red : C.dim} strokeWidth={10} />
          <path d="M20,-150 L20,-60 Q120,-60 130,60 Q140,170 50,160 Q20,150 20,60 Z" fill="none" stroke={nube > 0.5 ? C.red : C.dim} strokeWidth={10} />
          <circle r={160 * (0.95 + 0.05 * Math.sin(t * 6))} fill="rgba(255,85,70,.12)" opacity={nube} />
        </g>
        {/* chorrito de agua, papel de diario, botella cerrada */}
        <g opacity={e(t, mj, mj + 0.6) * (1 - e(t, bt, bt + 0.6))}>{Array.from({ length: 8 }, (_, i) => <circle key={i} cx={720 + i * 8} cy={lerp(360, 600, ((t * 2 + i / 8) % 1))} r={7} fill={C.water} />)}<rect x={560} y={600} width={340} height={120} rx={10} fill="#d9d4c5" /><text x={730} y={672} textAnchor="middle" fontFamily={FONT} fontSize={30} fontWeight={700} fill="#6b665c">DIARIO</text></g>
        <g opacity={e(t, bt, bt + 0.6)} transform={`translate(730,${760 - spr(t, bt) * 60})`}><path d="M-70,0 L-70,-230 Q-70,-270 -30,-280 L-30,-330 L30,-330 L30,-280 Q70,-270 70,-230 L70,0 Z" fill="rgba(200,220,230,.35)" stroke="#dfe8ea" strokeWidth={5} /><rect x={-34} y={-350} width={68} height={26} rx={6} fill={C.celeste2} /><rect x={-60} y={-170} width={120} height={70} rx={6} fill={C.marm} /><text x={0} y={-124} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill="#1b1a19">VIDRIO</text></g>
      </Svg>
      <Lbl t={t} at={a + 1.2} text="no se respira" x={1340} y={760} col={C.red} size={60} />
      <Lbl t={t} at={bt + 0.8} text="así no se corta nadie" x={730} y={900} col={C.ok} size={48} />
    </>
  );
};

// 16 · mitad y mitad: los grandes hacen el dibujo, los medianos tapan los huecos
export const MitadMitad: React.FC<FxP> = ({ t, a, m }) => {
  const mz = mk(m, "mezcla", a + 2.5), k = e(t, mz, mz + 1.5);
  const G = Array.from({ length: 14 }, (_, i) => ({ x: 760 + (i % 5) * 100 + (Math.floor(i / 5) % 2) * 50, y: 380 + Math.floor(i / 5) * 110, r: 42 }));
  const Mi = Array.from({ length: 30 }, (_, i) => ({ x: 740 + hash(i, 1) * 480, y: 360 + hash(i, 2) * 260, r: 16 }));
  return (
    <>
      <Svg>
        <rect x={700} y={320} width={540} height={360} rx={24} fill={C.marm} opacity={0.9 * k} />
        {G.map((g, i) => <Vid key={"g" + i} x={lerp(420 + (i % 4) * 60, g.x, k)} y={lerp(600 - Math.floor(i / 4) * 50, g.y, k)} r={g.r} col={i % 3} seed={i + 70} o={cl((t - a) * 3)} />)}
        {Mi.map((g, i) => <Vid key={"m" + i} x={lerp(1460 + (i % 6) * 34, g.x, k)} y={lerp(620 - Math.floor(i / 6) * 34, g.y, k)} r={g.r} col={(i + 1) % 3} seed={i + 120} o={cl((t - a - 0.4) * 3)} />)}
      </Svg>
      <Lbl t={t} at={a + 0.5} out={mz} text="grande" x={520} y={760} size={56} col={C.verde} />
      <Lbl t={t} at={a + 0.9} out={mz} text="mediano" x={1540} y={760} size={56} col={C.ambar} />
      <Lbl t={t} at={mz + 1.2} text="los dibujos" x={500} y={500} size={50} col={C.verde} />
      <Lbl t={t} at={mz + 1.8} text="tapan los huecos" x={1500} y={500} size={50} col={C.ambar} />
    </>
  );
};
export const _unused = [Big, Pop, Txt];
