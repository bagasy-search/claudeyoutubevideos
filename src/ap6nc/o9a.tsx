// ap6nc — únicas 1-13 (el oso de Sankebetsu, 1915): el lugar, el oso, noviembre y el primer día. Ninguna repite apex01-07, ap6na ni ap6nb.
// Dibujado por código, sin IA. Todo sale de useCurrentFrame().
import React from "react";
import { useCurrentFrame } from "remotion";
import { F, INK, RED, GOLD, Scene, Tag, ez, lin, sp, rnd, at } from "./ukit";
import { SV } from "./pkit";

type UP = { d: number; p: any };
export const NIGHT = "#06090e", SNOW = "#e6edf4", WOOD = "#7a5434", FUR = "#2b1d13", RIM = "#8a6440", AMB = "#f2a945", ICEB = "#9cc4e0";
export const lp = (a: number, b: number, k: number) => a + (b - a) * k;

// ── kit del oso ──
// oso de perfil caminando (mira a la derecha). x,y = punto entre las patas en el piso; step = fase de la marcha
export const Bear: React.FC<{ x: number; y: number; s?: number; step?: number; flip?: boolean; band?: number; op?: number; id?: string }> = ({ x, y, s = 1, step = 0, flip, band = 0, op = 1, id = "b" }) => {
  const L = (lx: number, ph: number) => { const a = Math.sin(step + ph) * 16; return <path d={`M${lx},-120 L${lx + Math.sin((a * Math.PI) / 180) * 120},0`} stroke={FUR} strokeWidth={48} strokeLinecap="round" />; };
  const body = "M-290,-110 C-305,-200 -230,-252 -140,-256 C-60,-262 0,-300 60,-290 C120,-280 170,-250 210,-215 L270,-225 C300,-228 330,-205 342,-180 L352,-160 C322,-150 292,-150 272,-148 C250,-128 230,-110 200,-100 C100,-72 -150,-70 -260,-88 Z";
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`} opacity={op}>
      {L(-200, Math.PI)}{L(140, 0)}
      <path d={body} fill={FUR} stroke={RIM} strokeWidth={4} />
      <circle cx={200} cy={-246} r={20} fill={FUR} stroke={RIM} strokeWidth={4} />
      {L(-160, 0)}{L(180, Math.PI)}
      {band > 0 && <>
        <clipPath id={`kb${id}`}><path d={body} /></clipPath>
        <path d="M20,-292 L190,-96" stroke="#dccaa2" strokeWidth={30} strokeLinecap="round" clipPath={`url(#kb${id})`} strokeDasharray="300" strokeDashoffset={300 * (1 - band)} />
      </>}
    </g>
  );
};
// oso parado en dos patas (frente), x,y = pies
export const BearUp: React.FC<{ x: number; y: number; s?: number; op?: number }> = ({ x, y, s = 1, op = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={op}>
    <rect x={-70} y={-150} width={50} height={150} rx={24} fill={FUR} /><rect x={20} y={-150} width={50} height={150} rx={24} fill={FUR} />
    <ellipse cx={0} cy={-300} rx={115} ry={190} fill={FUR} stroke={RIM} strokeWidth={4} />
    <path d="M-100,-380 L-170,-250 M100,-380 L170,-250" stroke={FUR} strokeWidth={48} strokeLinecap="round" />
    <circle cx={0} cy={-520} r={70} fill={FUR} stroke={RIM} strokeWidth={4} />
    <circle cx={-52} cy={-575} r={22} fill={FUR} stroke={RIM} strokeWidth={4} /><circle cx={52} cy={-575} r={22} fill={FUR} stroke={RIM} strokeWidth={4} />
    <ellipse cx={0} cy={-495} rx={30} ry={22} fill="#4a3322" />
  </g>
);
// casa de troncos de frente (x,y = centro del piso), glow = ventana prendida 0..1
export const House: React.FC<{ x: number; y: number; s?: number; glow?: number; broken?: number; op?: number }> = ({ x, y, s = 1, glow = 0.8, broken = 0, op = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={op}>
    <path d="M-170,0 L-170,-150 L0,-250 L170,-150 L170,0 Z" fill="#3d2a1b" stroke={RIM} strokeWidth={4} />
    {[30, 60, 90, 120].map((h) => <line key={h} x1={-170} y1={-h} x2={170} y2={-h} stroke="#2a1c12" strokeWidth={5} />)}
    <path d="M-200,-140 L0,-268 L200,-140" fill="none" stroke={SNOW} strokeWidth={16} strokeLinecap="round" />
    <rect x={-120} y={-118} width={70} height={60} fill={`rgba(242,169,69,${glow})`} stroke="#2a1c12" strokeWidth={5} />
    <rect x={40} y={-110} width={70} height={110} fill="#1a110b" stroke="#2a1c12" strokeWidth={5} />
    {broken > 0 && <g stroke={SNOW} strokeWidth={6} strokeLinecap="round" opacity={broken}>{[0, 1, 2].map((i) => <path key={i} d={`M${48 + i * 18},${-96} l${-14 + i * 3},${70 * broken}`} />)}</g>}
  </g>
);
// nieve que cae (nunca un cuadro quieto)
export const Snow: React.FC<{ n?: number; w?: number }> = ({ n = 60, w = 1 }) => {
  const f = useCurrentFrame();
  return <>{Array.from({ length: n }).map((_, i) => { const sp_ = 1.2 + rnd(i, 2) * 2.2; const y = ((rnd(i, 3) * 1200 + f * sp_) % 1200) - 60; const x = (rnd(i, 4) * 2100 + Math.sin(f / 40 + i) * 30 + f * 0.6 * w) % 2000 - 40; const r = 2 + rnd(i, 5) * 4;
    return <div key={i} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: r, background: `rgba(240,246,252,${0.35 + rnd(i, 6) * 0.45})` }} />; })}</>;
};
export const Rifle: React.FC<{ x: number; y: number; s?: number; rot?: number; flash?: number }> = ({ x, y, s = 1, rot = 0, flash = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-220,10 L-120,-6 L-60,-6 L-40,14 L-150,40 Z" fill="#6b4529" stroke="#2a1a10" strokeWidth={3} />
    <rect x={-60} y={-12} width={300} height={12} fill="#3b3f44" stroke="#15181b" strokeWidth={2} />
    <rect x={-50} y={-22} width={40} height={12} fill="#55595e" />
    {flash > 0 && <g transform="translate(250,-6)" opacity={flash}><path d="M0,0 L70,-26 L52,0 L90,6 L50,14 L66,40 Z" fill="#ffd27a" /><circle r={24} fill="#fff1c4" /></g>}
  </g>
);
const Paw: React.FC<{ x: number; y: number; s?: number; r?: number; c?: string; o?: number }> = ({ x, y, s = 1, r = 0, c = FUR, o = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`} opacity={o}>
    <ellipse cx={0} cy={10} rx={26} ry={30} fill={c} />
    {[-26, -9, 9, 26].map((dx, i) => <ellipse key={i} cx={dx} cy={-30 - (i === 1 || i === 2 ? 6 : 0)} rx={9} ry={11} fill={c} />)}
  </g>
);

// 1 · LA VUELTA A LA CASA: planta de la casa vista desde arriba, las huellas la rodean y vuelven a la ventana
export const WallCircuit: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), w0 = at(p, "walk", 10), wn = at(p, "window", 120);
  const per = (u: number): [number, number, number] => { // perímetro de un rectángulo 760x440 centrado, con margen
    const W = 900, H = 580, P = 2 * (W + H); let q = ((u % 1) + 1) % 1 * P;
    if (q < W) return [510 + q, 250, 90]; q -= W; if (q < H) return [1410, 250 + q, 180]; q -= H; if (q < W) return [1410 - q, 830, 270]; q -= W; return [510, 830 - q, 0];
  };
  const prog = lin(f, w0, wn, 0.62, 1.62), n = 46;
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor="140,170,210">
      <SV>
        <rect x={580} y={320} width={760} height={440} fill="#2e2015" stroke={RIM} strokeWidth={8} />
        {Array.from({ length: 9 }).map((_, i) => <line key={i} x1={580} y1={320 + i * 55} x2={1340} y2={320 + i * 55} stroke="#22170f" strokeWidth={6} />)}
        <rect x={880} y={308} width={160} height={24} fill={AMB} opacity={0.6 + 0.4 * Math.sin(f / 9)} />
        <circle cx={960} cy={540} r={36} fill={AMB} opacity={0.18} />
        {Array.from({ length: n }).map((_, i) => { const u = 0.62 + i / n; if (u > prog) return null; const [x, y, r] = per(u); const age = (prog - u) * 40; const side = i % 2 ? 14 : -14;
          return <Paw key={i} x={x + (r % 180 === 0 ? side : 0)} y={y + (r % 180 ? side : 0)} s={0.55} r={r} c="#c9d6e4" o={Math.max(0.2, 1 - age * 0.06)} />; })}
        {f > wn && <circle cx={960} cy={250} r={70 + 12 * Math.sin(f / 6)} fill="none" stroke={RED} strokeWidth={8} opacity={ez(f, wn, wn + 8)} />}
      </SV>
      <Snow n={50} />
      <Tag a={w0 + 4} t="SOMETHING WALKED AROUND THE WALLS" x={960} y={145} size={62} w={1700} />
      <Tag a={wn} t="AND CAME BACK TO THE WINDOW" x={960} y={930} size={66} color={AMB} w={1600} />
    </Scene>
  );
};

// 2 · SEIS DÍAS: seis hojas de diciembre; cada regreso del oso cae como una huella sobre su día
export const SixDays: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), g = at(p, "go", 8), bk = at(p, "back", 60);
  const days = [9, 10, 11, 12, 13, 14], paws = [[0, 0], [1, 0], [1, 1], [3, 0], [4, 0]];
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor="140,170,210">
      <SV>
        {days.map((dd, i) => { const k = sp(f, g + i * 5, 0.8, 12), x = 270 + i * 276;
          return <g key={dd} transform={`translate(${x},${460 + (1 - k) * 260})`} opacity={Math.min(1, k * 1.4)}>
            <rect x={-118} y={-150} width={236} height={300} rx={14} fill="#efe8dc" />
            <rect x={-118} y={-150} width={236} height={70} rx={14} fill={i === 5 ? GOLD : RED} />
            <text x={0} y={-102} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={40} fill="#fff">DEC</text>
            <text x={0} y={70} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={130} fill="#1c1410">{dd}</text>
          </g>; })}
        {paws.map(([i, j], n) => { const a = bk + n * 9, k = sp(f, a, 0.7, 9);
          return <Paw key={n} x={270 + i * 276 + (j ? 50 : -30)} y={560 + (j ? -40 : 30)} s={0.9 * (1.6 - 0.6 * k)} r={-12 + n * 7} c="rgba(43,29,19,.9)" o={ez(f, a, a + 4)} />; })}
      </SV>
      <Snow n={36} />
      <Tag a={g + 6} t="SIX DAYS · DECEMBER 1915" x={960} y={145} size={72} w={1500} />
      <Tag a={bk + 10} t="IT KEPT COMING BACK" x={960} y={850} size={70} color={GOLD} w={1300} />
    </Scene>
  );
};

// 3 · UN DÍA A PIE: la casa del valle, el pueblo lejos, el camino a pie; teléfono y ruta tachados
export const LongDayAway: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), ph = at(p, "phone", 60), rd = at(p, "road", 100), k = ez(f, 10, Math.max(60, ph));
  const path = "M330,700 C560,560 760,800 980,640 S1380,520 1600,600";
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor="140,170,210">
      <SV>
        <House x={330} y={760} s={0.8} glow={0.7 + 0.3 * Math.sin(f / 10)} />
        <g transform="translate(1600,660)">{[-110, -30, 50, 120].map((dx, i) => <rect key={i} x={dx} y={-90 - (i % 2) * 50} width={64} height={90 + (i % 2) * 50} fill="#2c3440" stroke="#7d8ea3" strokeWidth={3} />)}</g>
        <path d={path} fill="none" stroke={SNOW} strokeWidth={7} strokeDasharray="22 18" strokeDashoffset={-f} opacity={0.8} />
        <path d={path} fill="none" stroke={GOLD} strokeWidth={9} strokeDasharray="2400" strokeDashoffset={2400 * (1 - k)} />
        {[[ph, 640, 300, "M-34,-40 h68 v80 h-68 Z M-20,-28 h40 v28 h-40 Z"], [rd, 1260, 300, "M-50,40 L-14,-44 M50,40 L14,-44 M0,-30 v12 M0,0 v14 M0,26 v12"]].map(([a, x, y, dd], i) => (
          <g key={i} transform={`translate(${x},${y}) scale(${sp(f, a as number)})`}>
            <circle r={84} fill="rgba(10,14,20,.8)" stroke={INK} strokeWidth={5} />
            <path d={dd as string} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
            <path d="M-60,-60 L60,60" stroke={RED} strokeWidth={14} strokeLinecap="round" />
          </g>))}
      </SV>
      <Snow n={40} />
      <Tag a={14} t="THE NEAREST TOWN: A DAY ON FOOT" x={960} y={145} size={60} w={1600} />
      <Tag a={ph + 4} t="NO PHONE" x={640} y={410} size={50} color={RED} w={500} />
      <Tag a={rd + 4} t="NO ROAD" x={1260} y={410} size={50} color={RED} w={500} />
      <Tag a={rd + 24} t="NO HELP UNTIL MORNING" x={960} y={900} size={66} color={GOLD} w={1400} />
    </Scene>
  );
};

// 4 · NIEVE SOBRE LA CABEZA: viento de Siberia, la nieve sube contra la regla y le pasa la cabeza a un hombre
export const SnowOverHead: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), r = at(p, "rise", 40), k = ez(f, r, r + 90), lvl = lp(900, 520, k);
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor="160,190,230">
      <SV>
        {Array.from({ length: 6 }).map((_, i) => { const x = ((f * 9 + i * 360) % 2300) - 300; return <path key={i} d={`M${x},${180 + i * 50} q120,-30 240,0 t240,0`} fill="none" stroke={ICEB} strokeWidth={5} opacity={0.5} />; })}
        <text x={120} y={150} fontFamily={F} fontWeight={900} fontSize={44} fill={ICEB} opacity={ez(f, 6, 20)}>SIBERIA →</text>
        <g transform="translate(960,900)"><path d="M0,0 L0,-300" stroke="#1d150f" strokeWidth={34} strokeLinecap="round" /><circle cy={-340} r={34} fill="#1d150f" /><path d="M-10,-10 L-40,0 M10,-10 L40,0" stroke="#1d150f" strokeWidth={26} strokeLinecap="round" /><path d="M0,-240 L-50,-150 M0,-240 L50,-150" stroke="#1d150f" strokeWidth={20} strokeLinecap="round" /></g>
        <path d={`M0,${lvl} C400,${lvl - 30} 700,${lvl + 20} 960,${lvl - 10} S1500,${lvl + 25} 1920,${lvl - 15} L1920,1080 L0,1080 Z`} fill={SNOW} />
        <g transform="translate(1380,900)">{Array.from({ length: 9 }).map((_, i) => <g key={i}><line x1={0} y1={-i * 50} x2={i % 2 ? 26 : 50} y2={-i * 50} stroke={GOLD} strokeWidth={5} /></g>)}<line x1={0} y1={0} x2={0} y2={-420} stroke={GOLD} strokeWidth={6} /><text x={64} y={-386} fontFamily={F} fontWeight={900} fontSize={48} fill={GOLD}>2 M</text></g>
      </SV>
      <Snow n={90} w={3} />
      <Tag a={r + 70} t="SNOW HIGHER THAN A MAN'S HEAD" x={960} y={960} size={64} color="#1c2733" w={1600} />
    </Scene>
  );
};

// 5 · QUINCE FAMILIAS: el río, las casas que aparecen lejos unas de otras, la cota entre dos
export const FifteenFamilies: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), h = at(p, "houses", 12), far = at(p, "far", 90);
  const riv = (u: number) => [160 + u * 1600, 560 + Math.sin(u * 6.5) * 120] as const;
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor="140,170,210">
      <SV>
        <path d={Array.from({ length: 41 }).map((_, i) => { const [x, y] = riv(i / 40); return `${i ? "L" : "M"}${x},${y}`; }).join(" ")} fill="none" stroke={ICEB} strokeWidth={26} strokeLinecap="round" opacity={0.7} strokeDasharray="2200" strokeDashoffset={2200 * (1 - ez(f, 0, 30))} />
        {Array.from({ length: 15 }).map((_, i) => { const u = (i + 0.5) / 15 + (rnd(i, 1) - 0.5) * 0.03, [x, y] = riv(u), up = i % 2 ? -1 : 1, k = sp(f, h + i * 4);
          return <g key={i} transform={`translate(${x},${y + up * (90 + rnd(i, 2) * 60)}) scale(${0.26 * k})`}><House x={0} y={0} glow={0.5 + 0.5 * Math.sin(f / 13 + i)} /></g>; })}
        {(() => { const [x1, y1] = riv(4.5 / 15), [x2] = riv(5.5 / 15), k = ez(f, far, far + 20); return <g opacity={k}><line x1={x1} y1={y1 + 230} x2={lp(x1, x2, k)} y2={y1 + 230} stroke={GOLD} strokeWidth={6} /><line x1={x1} y1={y1 + 210} x2={x1} y2={y1 + 250} stroke={GOLD} strokeWidth={6} /><line x1={x2} y1={y1 + 210} x2={x2} y2={y1 + 250} stroke={GOLD} strokeWidth={6} opacity={k > 0.95 ? 1 : 0} /></g>; })()}
      </SV>
      <Snow n={30} />
      <Tag a={h + 10} t="ABOUT 15 FAMILIES · ROKUSENSAWA" x={960} y={145} size={64} w={1600} />
      <Tag a={far + 16} t="HUNDREDS OF METERS APART" x={960} y={920} size={60} color={GOLD} w={1300} />
    </Scene>
  );
};

// 6 · UNA SOLA ESPECIE: tres osos de tres continentes se juntan en uno
export const OneSpecies: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), m = at(p, "merge", 80), k = ez(f, m, m + 30);
  const B: [number, string][] = [[330, "GRIZZLY · N. AMERICA"], [960, "BROWN BEAR · RUSSIA"], [1590, "HIGUMA · HOKKAIDO"]];
  return (
    <Scene d={d} bg={p.bg} tint="#0b0a09" floor="230,170,110">
      <SV>
        {B.map(([x, ], i) => <Bear key={i} id={`os${i}`} x={lp(x, 960, k)} y={720} s={lp(0.62, i === 1 ? 1.05 : 0.62, k)} step={f / 7 + i} op={i === 1 ? 1 : 1 - k} flip={i === 0 && k < 0.5} />)}
      </SV>
      {B.map(([x, t], i) => <Tag key={i} a={10 + i * 12} t={t} x={x} y={770} size={42} color={i === 2 ? GOLD : INK} w={560} />)}
      {f > m && <Tag a={m + 26} t="ONE SPECIES · URSUS ARCTOS" x={960} y={150} size={80} color={GOLD} w={1600} />}
    </Scene>
  );
};

// 7 · TE HUELE PRIMERO: anillos de olor que salen de la persona; el oso se da vuelta y se va
export const ScentRings: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), rg = at(p, "rings", 12), lv = at(p, "leave", 90), go = ez(f, lv, lv + 60);
  return (
    <Scene d={d} bg={p.bg} tint="#0a0c08" floor="160,200,140">
      <SV>
        {Array.from({ length: 6 }).map((_, i) => { const ph = ((f - rg) / 70 + i / 6) % 1; return f > rg && <circle key={i} cx={1500} cy={700} r={60 + ph * 1100} fill="none" stroke={GOLD} strokeWidth={6} opacity={(1 - ph) * 0.55} />; })}
        <g transform="translate(1500,820)"><path d="M0,0 L0,-170" stroke="#e8e0d0" strokeWidth={30} strokeLinecap="round" /><circle cy={-200} r={26} fill="#e8e0d0" /></g>
        <Bear id="sc" x={lp(520, 120, go)} y={820} s={0.7} step={f / (go > 0 ? 5 : 30)} flip={go > 0.02} />
      </SV>
      <Tag a={rg + 30} t="IT SMELLS YOU LONG BEFORE YOU SEE IT" x={960} y={145} size={60} w={1700} />
      <Tag a={lv + 10} t="…AND IT LEAVES" x={760} y={920} size={70} color={GOLD} w={900} />
    </Scene>
  );
};

// 8 · DICIEMBRE, DORMIDO: corte de la ladera, la cueva con el oso enroscado y la grasa que se gasta hasta abril
export const DenFat: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), s0 = at(p, "sleep", 10), fa = at(p, "fat", 60), k = ez(f, fa, fa + 100);
  const MO = ["DEC", "JAN", "FEB", "MAR", "APR"];
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor="160,190,230">
      <SV>
        <path d="M0,520 C400,380 900,300 1300,420 S1800,560 1920,520 L1920,1080 L0,1080 Z" fill="#3a2a1e" />
        <path d="M0,520 C400,380 900,300 1300,420 S1800,560 1920,520" fill="none" stroke={SNOW} strokeWidth={34} />
        <ellipse cx={820} cy={640} rx={260} ry={150} fill="#140d08" />
        <g transform={`translate(820,690) scale(${1 + 0.02 * Math.sin(f / 18)})`} opacity={ez(f, s0, s0 + 14)}><ellipse rx={190} ry={95} fill={FUR} stroke={RIM} strokeWidth={4} /><circle cx={130} cy={-30} r={52} fill={FUR} stroke={RIM} strokeWidth={4} /><circle cx={150} cy={-78} r={16} fill={FUR} /></g>
        {[0, 1, 2].map((i) => { const ph = ((f / 40) + i / 3) % 1; return <text key={i} x={1000 + ph * 60} y={600 - ph * 120} fontFamily={F} fontWeight={900} fontSize={40} fill={ICEB} opacity={1 - ph}>z</text>; })}
        <rect x={1240} y={760} width={560} height={46} rx={23} fill="#1c1410" stroke={GOLD} strokeWidth={4} />
        <rect x={1246} y={766} width={548 * (1 - 0.82 * k)} height={34} rx={17} fill={GOLD} />
        {MO.map((m, i) => <text key={m} x={1250 + i * 132} y={860} fontFamily={F} fontWeight={900} fontSize={34} fill={INK} opacity={k * 4 > i ? 1 : 0.3}>{m}</text>)}
        <text x={1240} y={740} fontFamily={F} fontWeight={900} fontSize={38} fill={GOLD} opacity={ez(f, fa, fa + 10)}>FALL FAT</text>
      </SV>
      <Snow n={40} />
      <Tag a={s0 + 10} t="DECEMBER: EVERY BEAR SHOULD BE ASLEEP" x={960} y={145} size={62} w={1700} />
    </Scene>
  );
};

// 9 · LA LIBRETA DE NOVIEMBRE: tres visitas a la casa Ikeda y el rastro de sangre que tapa la tormenta
export const CornLedger: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), a1 = at(p, "n1", 8), a2 = at(p, "n20", 50), a3 = at(p, "n30", 100), st = at(p, "storm", 170);
  const R: [number, string, string][] = [[a1, "EARLY NOV", "CORN TAKEN"], [a2, "NOV 20", "BACK AGAIN"], [a3, "NOV 30", "SHOT · WOUNDED"]];
  const cover = ez(f, st, st + 40);
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor="140,170,210">
      <SV>
        {R.map(([a, , ], i) => <g key={i} transform={`translate(${300 + i * 330},${300})`} opacity={ez(f, a, a + 8)}>
          <rect x={-130} y={-120} width={260} height={240} rx={18} fill="#efe8dc" transform={`rotate(${-3 + i * 3})`} />
          {i < 2 ? <g transform="rotate(-20)">{[0, 1, 2].map((j) => <ellipse key={j} cx={-30 + j * 30} cy={0} rx={18} ry={62} fill={GOLD} stroke="#8a6a20" strokeWidth={4} />)}</g> : <Rifle x={-10} y={10} s={0.45} rot={-20} flash={ez(f, a + 6, a + 10) * (1 - ez(f, a + 14, a + 22))} />}
        </g>)}
        {Array.from({ length: 12 }).map((_, i) => { const x = 1120 + i * 62, y = 420 - i * 22 + Math.sin(i) * 14; return <circle key={i} cx={x} cy={y} r={9} fill={RED} opacity={ez(f, a3 + 30 + i * 3, a3 + 34 + i * 3) * (1 - cover * (i / 12 + 0.3))} />; })}
        <path d="M1500,560 L1700,180 L1900,560 Z" fill="#202a36" stroke={SNOW} strokeWidth={5} />
      </SV>
      <Snow n={40 + Math.round(cover * 120)} w={1 + cover * 5} />
      {R.map(([a, t1, t2], i) => <React.Fragment key={i}><Tag a={a + 4} t={t1} x={300 + i * 330} y={460} size={42} color={GOLD} w={420} /><Tag a={a + 8} t={t2} x={300 + i * 330} y={520} size={34} w={420} /></React.Fragment>)}
      <Tag a={st + 10} t="THE STORM COVERED THE TRAIL" x={960} y={880} size={62} color={ICEB} w={1500} />
    </Scene>
  );
};

// 10 · NUEVE DÍAS DE CALMA: nueve rayitas, y la décima es una fecha en rojo
export const QuietTally: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), g = at(p, "go", 8), end = g + 9 * 8;
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor="140,170,210">
      <SV>
        {Array.from({ length: 9 }).map((_, i) => { const a = g + i * 8, k = ez(f, a, a + 7), x = 560 + i * 90 + (i >= 5 ? 50 : 0);
          return <line key={i} x1={x} y1={380} x2={x + 6} y2={380 + 300 * k} stroke={SNOW} strokeWidth={16} strokeLinecap="round" />; })}
        <line x1={520} y1={620} x2={1010} y2={430} stroke={SNOW} strokeWidth={14} strokeLinecap="round" strokeDasharray="540" strokeDashoffset={540 * (1 - ez(f, g + 34, g + 40))} />
      </SV>
      <Snow n={30} />
      <Tag a={g + 4} t="NINE QUIET DAYS" x={960} y={170} size={78} w={1300} />
      <Tag a={end + 10} t="DECEMBER 9" x={960} y={780} size={110} color={RED} w={1300} />
    </Scene>
  );
};

// 11 · 10:30 DE LA MAÑANA: reloj que llega a la hora y el sol alto en la nieve
export const DaylightClock: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), g = at(p, "go", 6), k = ez(f, g, g + 50), mins = lp(0, 630, k);
  const hA = (mins / 720) * 360, mA = (mins % 60) * 6;
  return (
    <Scene d={d} bg={p.bg} tint="#0e1218" floor="255,230,170">
      <SV>
        <circle cx={1480} cy={lp(700, 290, k)} r={110} fill="#fff1c9" opacity={0.85} />
        {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={1480 + Math.cos((i * 30 * Math.PI) / 180) * 150} y1={lp(700, 290, k) + Math.sin((i * 30 * Math.PI) / 180) * 150} x2={1480 + Math.cos((i * 30 * Math.PI) / 180) * 190} y2={lp(700, 290, k) + Math.sin((i * 30 * Math.PI) / 180) * 190} stroke="#fff1c9" strokeWidth={8} opacity={0.6 * k} />)}
        <g transform="translate(700,540)">
          <circle r={290} fill="#efe8dc" stroke="#2a1c12" strokeWidth={16} />
          {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={0} y1={-250} x2={0} y2={-220} stroke="#2a1c12" strokeWidth={10} transform={`rotate(${i * 30})`} />)}
          <line x1={0} y1={0} x2={0} y2={-150} stroke="#2a1c12" strokeWidth={22} strokeLinecap="round" transform={`rotate(${hA})`} />
          <line x1={0} y1={0} x2={0} y2={-230} stroke={RED} strokeWidth={12} strokeLinecap="round" transform={`rotate(${mA})`} />
          <circle r={18} fill="#2a1c12" />
        </g>
      </SV>
      <Tag a={g + 50} t="10:30 AM" x={1480} y={560} size={110} color={GOLD} w={700} />
      <Tag a={g + 60} t="BROAD DAYLIGHT" x={1480} y={700} size={60} w={700} />
    </Scene>
  );
};

// 12 · LA DESPENSA: el pie del abeto, el montículo de nieve y ramas; «escena del crimen» se tacha y queda «despensa»
export const FirPantry: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), m = at(p, "mound", 10), lb = at(p, "label", 100), k = ez(f, m, m + 50);
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor="140,170,210">
      <SV>
        <rect x={1180} y={140} width={70} height={720} fill="#3a2a1e" />
        {Array.from({ length: 7 }).map((_, i) => { const y = 160 + i * 95, w = 120 + i * 60; return <path key={i} d={`M${1215 - w},${y + 120} L1215,${y} L${1215 + w},${y + 120} Z`} fill="#1d2b22" stroke={SNOW} strokeWidth={6} />; })}
        <path d={`M760,860 Q980,${lp(860, 680, k)} 1200,860 Z`} fill={SNOW} />
        {Array.from({ length: 9 }).map((_, i) => <line key={i} x1={820 + i * 40} y1={lp(860, 760 + rnd(i, 1) * 40, k)} x2={880 + i * 40} y2={lp(860, 720 + rnd(i, 2) * 40, k)} stroke="#4a3626" strokeWidth={9} strokeLinecap="round" opacity={ez(f, m + 20 + i * 3, m + 26 + i * 3)} />)}
        <line x1={0} y1={860} x2={1920} y2={860} stroke={SNOW} strokeWidth={10} />
      </SV>
      <Snow n={40} />
      <Tag a={lb} t="NOT A CRIME SCENE" x={560} y={300} size={62} w={900} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><line x1={200} y1={340} x2={920} y2={340} stroke={RED} strokeWidth={12} strokeDasharray="720" strokeDashoffset={720 * (1 - ez(f, lb + 30, lb + 40))} /></svg>
      <Tag a={lb + 44} t="ITS PANTRY" x={560} y={420} size={110} color={GOLD} w={900} />
      <Tag a={m + 30} t="HIDDEN UNDER SNOW AND BRANCHES" x={960} y={920} size={50} w={1400} />
    </Scene>
  );
};

// 13 · CINCO GATILLOS, UN TIRO: cinco rifles en fila; cuatro hacen «clic», uno dispara
export const OneInFive: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), pl = at(p, "pull", 20), one = at(p, "one", pl + 30);
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor="140,170,210">
      <SV>
        {Array.from({ length: 5 }).map((_, i) => { const y = 250 + i * 150, fire = i === 2; const kick = fire ? Math.max(0, 1 - Math.abs(f - one) / 6) : 0;
          return <g key={i}><Rifle x={760 - kick * 30} y={y} s={1.15} flash={fire ? ez(f, one, one + 2) * (1 - ez(f, one + 6, one + 14)) : 0} />
            {!fire && <text x={1180} y={y + 14} fontFamily={F} fontWeight={900} fontSize={44} fill={INK} opacity={ez(f, pl + i * 4, pl + i * 4 + 3)}>click</text>}</g>; })}
      </SV>
      <Snow n={30} />
      <Tag a={6} t="5 TRIGGERS" x={360} y={145} size={70} w={700} />
      <Tag a={one + 8} t="1 SHOT" x={1560} y={145} size={70} color={GOLD} w={700} />
      <Tag a={one + 20} t="THE COLD JAMMED THE OLD RIFLES" x={960} y={960} size={50} w={1500} />
    </Scene>
  );
};
