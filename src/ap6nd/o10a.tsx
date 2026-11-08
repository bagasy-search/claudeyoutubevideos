// ap6nd — únicas 1-14 (los leones de Tsavo, 1898): la línea, los dos leones, el campamento quieto, las noches.
// Ninguna repite apex01-07, ap6na, ap6nb ni ap6nc. Dibujado por código, sin IA. Todo sale de useCurrentFrame().
import React from "react";
import { useCurrentFrame } from "remotion";
import { F, INK, RED, GOLD, Scene, Tag, ez, lin, sp, rnd, at, Fig } from "./ukit";
import { SV } from "./pkit";

type UP = { d: number; p: any };
export const NIGHT = "#0b0806", DUST = "#b4562c", SAV = "#d9b27c", LION = "#b98a55", LRIM = "#6e4a28", MANE = "#6a4426", AMB = "#f2a945", CANVAS = "#e8dcc2", THORN = "#9a8a66", IRON = "#5b6066";
export const FL = "200,120,70";

// ── kit de Tsavo ──
type Pt = [number, number];
const segL = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);
// punto a la fracción u (0..1) del largo de una polilínea
export const polyAt = (pts: Pt[], u: number): Pt => {
  const L = pts.slice(1).reduce((s, q, i) => s + segL(pts[i], q), 0); let r = Math.max(0, Math.min(1, u)) * L;
  for (let i = 1; i < pts.length; i++) { const l = segL(pts[i - 1], pts[i]); if (r <= l) { const k = l ? r / l : 0; return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k]; } r -= l; }
  return pts[pts.length - 1];
};
// trazo de la polilínea hasta u
export const polyD = (pts: Pt[], u: number) => {
  const L = pts.slice(1).reduce((s, q, i) => s + segL(pts[i], q), 0); let r = Math.max(0, Math.min(1, u)) * L; let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) { const l = segL(pts[i - 1], pts[i]); if (r >= l) { d += ` L${pts[i][0]},${pts[i][1]}`; r -= l; } else { const k = l ? r / l : 0; d += ` L${pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k},${pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k}`; break; } }
  return d;
};
// león macho de perfil, casi sin melena (mira a la derecha). x,y = piso entre las patas; step = fase de la marcha; eyes = ojos que brillan
export const Lion: React.FC<{ x: number; y: number; s?: number; step?: number; flip?: boolean; op?: number; dark?: boolean; eyes?: number; mane?: number; low?: number }> = ({ x, y, s = 1, step = 0, flip, op = 1, dark, eyes = 0, mane = 0.35, low = 0 }) => {
  const f = useCurrentFrame();
  const C = dark ? "#140d08" : LION, R = dark ? "#3a2716" : LRIM, M = dark ? "#0c0805" : MANE;
  const L = (lx: number, ph: number) => { const a = Math.sin(step + ph) * 18; return <path d={`M${lx},-125 L${lx + Math.sin((a * Math.PI) / 180) * 125},${-low * 20}`} stroke={C} strokeWidth={30} strokeLinecap="round" />; };
  const tail = Math.sin(f / 14) * 18;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`} opacity={op}>
      <path d={`M-236,-160 C-300,-150 ${-330 + tail},-100 ${-306 + tail},-44`} stroke={C} strokeWidth={12} fill="none" strokeLinecap="round" />
      <ellipse cx={-306 + tail} cy={-40} rx={13} ry={17} fill={M} />
      {L(-190, Math.PI)}{L(150, 0)}
      <g transform={`translate(0,${low * 40})`}>
        <path d="M-240,-150 C-250,-230 -170,-262 -60,-258 C40,-256 120,-262 180,-240 C215,-228 232,-200 228,-170 C226,-140 200,-120 170,-112 C60,-96 -120,-96 -200,-108 C-235,-114 -240,-130 -240,-150 Z" fill={C} stroke={R} strokeWidth={4} />
        <path d="M150,-250 L218,-292 L246,-206 L172,-150 Z" fill={C} />
        <g transform={`translate(252,${-250 + low * 30})`}>
          <path d="M-44,-46 C-86,-6 -80,46 -34,70" stroke={M} strokeWidth={14 + mane * 30} fill="none" strokeLinecap="round" opacity={0.9} />
          <ellipse cx={0} cy={0} rx={62} ry={52} fill={C} stroke={R} strokeWidth={4} />
          <circle cx={-22} cy={-46} r={14} fill={C} stroke={R} strokeWidth={3} /><circle cx={12} cy={-52} r={13} fill={C} stroke={R} strokeWidth={3} />
          <ellipse cx={52} cy={18} rx={38} ry={27} fill={C} stroke={R} strokeWidth={3} />
          <circle cx={86} cy={8} r={8} fill="#2a1a10" />
          <circle cx={28} cy={-12} r={5} fill="#1a100a" />
          {eyes > 0 && <><circle cx={28} cy={-12} r={16} fill={AMB} opacity={0.35 * eyes} /><circle cx={28} cy={-12} r={6} fill="#ffe7a6" opacity={eyes} /></>}
        </g>
      </g>
      {L(-160, 0)}{L(178, Math.PI)}
    </g>
  );
};
// huella de león vista de arriba
export const LPaw: React.FC<{ x: number; y: number; s?: number; r?: number; c?: string; o?: number }> = ({ x, y, s = 1, r = 0, c = "#5a2a14", o = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`} opacity={o}>
    <path d="M-24,14 C-30,-6 -12,-14 0,-14 C12,-14 30,-6 24,14 C18,30 -18,30 -24,14 Z" fill={c} />
    {[-26, -10, 10, 26].map((dx, i) => <ellipse key={i} cx={dx} cy={-30 - (i === 1 || i === 2 ? 8 : 0)} rx={8} ry={10} fill={c} />)}
  </g>
);
// carpa de lona de frente (x,y = centro del piso)
export const Tent: React.FC<{ x: number; y: number; s?: number; glow?: number; hot?: number; op?: number }> = ({ x, y, s = 1, glow = 0, hot = 0, op = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={op}>
    <path d="M-110,0 L0,-120 L110,0 Z" fill={CANVAS} stroke="#8b7b5e" strokeWidth={4} />
    <path d="M0,-120 L0,0" stroke="#8b7b5e" strokeWidth={3} />
    <path d="M-30,0 L0,-70 L30,0 Z" fill={glow > 0 ? `rgba(242,169,69,${0.3 + 0.6 * glow})` : "#3a2e22"} />
    {hot > 0 && <path d="M-110,0 L0,-120 L110,0 Z" fill="none" stroke={RED} strokeWidth={8} opacity={hot} />}
  </g>
);
// anillo de espinas visto de arriba (boma)
export const Boma: React.FC<{ cx: number; cy: number; rx: number; ry: number; gap?: number; op?: number; th?: number }> = ({ cx, cy, rx, ry, gap = -1, op = 1, th = 1 }) => (
  <g opacity={op}>
    {Array.from({ length: 64 }).map((_, i) => { const a = (i / 64) * Math.PI * 2; if (gap >= 0 && Math.abs(Math.atan2(Math.sin(a - gap), Math.cos(a - gap))) < 0.22) return null;
      const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry, l = (18 + rnd(i, 2) * 16) * th;
      return <g key={i} transform={`translate(${x},${y}) rotate(${(a * 180) / Math.PI + rnd(i, 3) * 60})`}><path d={`M${-l},0 L${l},0 M${-l / 2},0 L${-l / 3},${-l / 2} M${l / 3},0 L${l / 2},${l / 2}`} stroke={THORN} strokeWidth={4} strokeLinecap="round" /></g>; })}
  </g>
);
// fuego (k = intensidad 0..1)
export const Flame: React.FC<{ x: number; y: number; s?: number; k?: number }> = ({ x, y, s = 1, k = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <circle r={90 * k + 10} fill={AMB} opacity={0.12 * k} />
      {[0, 1, 2].map((i) => { const h = (60 + 20 * Math.sin(f / 4 + i * 2)) * k + 6; return <path key={i} d={`M${-22 + i * 22},0 C${-36 + i * 22},${-h * 0.5} ${-8 + i * 18},${-h * 0.7} ${-10 + i * 20},${-h} C${4 + i * 20},${-h * 0.6} ${12 + i * 22},${-h * 0.3} ${2 + i * 22},0 Z`} fill={i === 1 ? "#ffd27a" : AMB} opacity={0.5 + 0.5 * k} />; })}
      <path d="M-40,6 L40,-6 M-40,-6 L40,6" stroke="#3a2416" strokeWidth={10} strokeLinecap="round" />
    </g>
  );
};
export const Cross: React.FC<{ x: number; y: number; k: number; r?: number }> = ({ x, y, k, r = 40 }) => (
  <g transform={`translate(${x},${y}) scale(${k})`} opacity={Math.min(1, k * 1.5)}>
    <path d={`M${-r},${-r} L${r},${r} M${r},${-r} L${-r},${r}`} stroke={RED} strokeWidth={14} strokeLinecap="round" />
  </g>
);
const Moon: React.FC<{ x: number; y: number; r?: number; o?: number }> = ({ x, y, r = 22, o = 1 }) => (
  <g opacity={o}><circle cx={x} cy={y} r={r} fill="#e9e2cf" /><circle cx={x + r * 0.45} cy={y - r * 0.2} r={r * 0.9} fill={NIGHT} /></g>
);

// 1 · LA LÍNEA DEL LUNÁTICO: costa → lago Victoria, la vía se traza, Tsavo marcado, las millas suben
const LINE: Pt[] = [[1650, 770], [1500, 716], [1390, 684], [1250, 630], [1100, 580], [950, 520], [800, 470], [650, 430], [500, 392], [380, 352]];
export const LunaticLine: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), mi = at(p, "miles", 60), mn = at(p, "men", 120);
  const k = ez(f, 10, mi + 40), ts = polyAt(LINE, 0.16), tr = polyAt(LINE, k);
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        <path d="M1740,0 C1690,300 1760,560 1690,1080 L1920,1080 L1920,0 Z" fill="#14324a" opacity={0.9} />
        <path d="M1740,0 C1690,300 1760,560 1690,1080" fill="none" stroke="#5f8fb4" strokeWidth={4} />
        <ellipse cx={250} cy={330} rx={130} ry={96} fill="#14324a" stroke="#5f8fb4" strokeWidth={4} opacity={ez(f, 4, 20)} />
        <path d={polyD(LINE, 1)} fill="none" stroke="rgba(240,235,229,.15)" strokeWidth={6} strokeDasharray="14 12" />
        <path d={polyD(LINE, k)} fill="none" stroke={GOLD} strokeWidth={10} strokeLinecap="round" />
        {Array.from({ length: 20 }).map((_, i) => { const u = (i / 20) * k; const [x, y] = polyAt(LINE, u); return <line key={i} x1={x - 8} y1={y - 14} x2={x + 8} y2={y + 14} stroke={GOLD} strokeWidth={4} opacity={0.7} />; })}
        <circle cx={tr[0]} cy={tr[1]} r={14} fill="#fff1c4" />
        <circle cx={1650} cy={770} r={14} fill={INK} />
        {f > 18 && <g transform={`translate(${ts[0]},${ts[1]})`}><circle r={30 + 6 * Math.sin(f / 6)} fill="none" stroke={RED} strokeWidth={6} opacity={ez(f, 18, 26)} /><circle r={10} fill={RED} /></g>}
        {f > mn && Array.from({ length: 36 }).map((_, i) => { const u = ((i / 36 + (f - mn) / 900) % 1) * k; const [x, y] = polyAt(LINE, u); return <circle key={i} cx={x + (rnd(i, 2) - 0.5) * 30} cy={y + (rnd(i, 3) - 0.5) * 30} r={4} fill={SAV} opacity={ez(f, mn, mn + 10) * 0.85} />; })}
      </SV>
      <Tag a={4} t="THE UGANDA RAILWAY · 1898" x={960} y={155} size={64} w={1500} />
      <Tag a={12} t="MOMBASA" x={1560} y={800} size={40} w={400} />
      <Tag a={16} t="LAKE VICTORIA" x={250} y={450} size={40} w={420} />
      <Tag a={22} t="TSAVO" x={ts[0]} y={ts[1] - 96} size={50} color={RED} w={300} />
      <Tag a={mi} t={`${Math.round(580 * lin(f, mi, mi + 40))}+ MILES INLAND`} x={760} y={620} size={56} color={GOLD} w={900} />
      {f > mn && <Tag a={mn} t="THOUSANDS OF MEN" x={760} y={710} size={48} w={900} />}
    </Scene>
  );
};

// 2 · DOS FORMAS: en la oscuridad aparecen dos machos casi sin melena; abajo, nueve meses se llenan
export const TwoShapes: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), mn = at(p, "mane", 50), nn = at(p, "nine", 90);
  const a = ez(f, 6, 40), b = ez(f, 18, 52), months = ["MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return (
    <Scene d={d} bg={p.bg} tint="#050403" floor={FL} push={0.03}>
      <SV>
        <Lion x={lin(f, 0, d, 380, 520)} y={700} s={0.95} step={f / 6} op={a} dark={f < mn} eyes={1 - ez(f, mn, mn + 10)} />
        <Lion x={lin(f, 0, d, 1560, 1420)} y={720} s={0.9} step={f / 6 + 1} op={b} flip dark={f < mn} eyes={1 - ez(f, mn, mn + 10)} />
        {f > mn && [[630, 455], [1306, 478]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={74 + 6 * Math.sin(f / 7)} fill="none" stroke={GOLD} strokeWidth={5} strokeDasharray="10 10" opacity={ez(f, mn + i * 4, mn + 10 + i * 4)} />)}
        {months.map((m, i) => { const k = ez(f, nn + i * 2, nn + 6 + i * 2); const x = 330 + i * 140;
          return <g key={m}><rect x={x - 56} y={890} width={112} height={18} rx={9} fill={k > 0.5 ? RED : "rgba(240,235,229,.18)"} /><text x={x} y={950} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={30} fill={INK} opacity={0.4 + 0.6 * k}>{m}</text></g>; })}
      </SV>
      <Tag a={8} t="TWO MALE LIONS" x={960} y={155} size={78} w={1400} />
      <Tag a={mn} t="ALMOST NO MANE" x={960} y={250} size={54} color={GOLD} w={1100} />
      {f > nn && <Tag a={nn + 22} t="NINE MONTHS" x={960} y={810} size={60} color={RED} w={900} />}
    </Scene>
  );
};

// 3 · LA CIFRA EN TINTA: «135» se escribe a pluma en la libreta; después la ciencia le pone un signo de pregunta
export const InkClaim: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), dt = at(p, "doubt", 120), w = lin(f, 10, 60);
  const q = ez(f, dt, dt + 14), shake = f > dt && f < dt + 14 ? Math.sin(f * 2.4) * 6 : 0;
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        <g transform="translate(960,560) rotate(-3)">
          <rect x={-560} y={-330} width={1120} height={660} rx={14} fill="#e9dfc6" />
          {Array.from({ length: 11 }).map((_, i) => <line key={i} x1={-520} y1={-250 + i * 55} x2={520} y2={-250 + i * 55} stroke="#c9b991" strokeWidth={3} />)}
          <line x1={-420} y1={-320} x2={-420} y2={320} stroke="#d58a7a" strokeWidth={3} />
          <text x={-380} y={-200} fontFamily="Georgia, serif" fontStyle="italic" fontSize={44} fill="#3a2a1c" opacity={ez(f, 4, 14)}>Killed by the two lions:</text>
          <g transform={`translate(${shake},0)`} opacity={1 - 0.55 * q}>
            <text x={-60} y={150} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontWeight={700} fontSize={330} fill="#1e2a4a"
              style={{ clipPath: `inset(0 ${100 - w * 100}% 0 0)` }}>135</text>
          </g>
          {f > dt && <g transform={`translate(380,40) scale(${sp(f, dt + 4, 0.8, 9)}) rotate(10)`}>
            <circle r={150} fill="none" stroke={RED} strokeWidth={14} />
            <text y={90} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={260} fill={RED}>?</text>
          </g>}
        </g>
      </SV>
      <Tag a={6} t="PATTERSON'S NUMBER" x={960} y={155} size={64} w={1300} />
      {f > dt && <Tag a={dt + 8} t="SCIENCE: PROBABLY WRONG" x={960} y={930} size={62} color={GOLD} w={1400} />}
    </Scene>
  );
};

// 4 · EL CAMPAMENTO QUE NO SE MOVÍA: los demás avanzan con la vía, Tsavo queda clavado y las noches se apilan
export const FrozenCamp: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), sl = lin(f, 10, d), n = Math.floor(lin(f, 30, d - 10, 0, 14));
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        <line x1={0} y1={760} x2={1920} y2={760} stroke={IRON} strokeWidth={8} /><line x1={0} y1={790} x2={1920} y2={790} stroke={IRON} strokeWidth={8} />
        {Array.from({ length: 40 }).map((_, i) => <rect key={i} x={((i * 52 - f * 3) % 2080 + 2080) % 2080 - 80} y={752} width={14} height={46} fill="#4a3322" />)}
        {[0, 1, 2].map((i) => { const x = 1400 + i * 260 - sl * 1500; return <g key={i} opacity={x > -200 && x < 2100 ? 0.55 : 0}><Tent x={x} y={740} s={0.55} /><Tent x={x + 90} y={740} s={0.45} /></g>; })}
        <Tent x={900} y={740} s={1} glow={0.5 + 0.3 * Math.sin(f / 9)} /><Tent x={1080} y={740} s={0.8} /><Tent x={760} y={740} s={0.7} />
        <g transform={`translate(960,${430 + (1 - sp(f, 12)) * -200})`}><path d="M0,0 C-40,-50 -40,-110 0,-110 C40,-110 40,-50 0,0 Z" fill={RED} /><circle cy={-72} r={16} fill={NIGHT} /></g>
        {Array.from({ length: n }).map((_, i) => <Moon key={i} x={300 + i * 95} y={258} r={26} o={ez(f, 30 + i * 6, 36 + i * 6)} />)}
      </SV>
      <Tag a={6} t="THE TSAVO CAMP DID NOT MOVE" x={960} y={155} size={64} w={1600} />
      <Tag a={30} t={`NIGHT AFTER NIGHT · ${n}`} x={960} y={880} size={56} color={GOLD} w={1100} />
    </Scene>
  );
};

// 5 · LA HUELLA DE ARRASTRE: de la carpa a los arbustos, la marca y las huellas aparecen con la mañana
export const DragTrail: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), dr = at(p, "drag", 6), pw = at(p, "paws", 60);
  const P: Pt[] = [[430, 560], [620, 600], [820, 540], [1040, 610], [1260, 560], [1480, 600]];
  const k = ez(f, dr, dr + 70), k2 = ez(f, pw, pw + 60);
  return (
    <Scene d={d} bg={p.bg} tint="#1a0f08" floor="230,150,90">
      <SV>
        <rect x={0} y={0} width={1920} height={1080} fill="#7a3a1c" opacity={0.55} />
        {Array.from({ length: 180 }).map((_, i) => <circle key={i} cx={rnd(i, 1) * 1920} cy={rnd(i, 2) * 1080} r={1 + rnd(i, 3) * 3} fill="#a85a30" opacity={0.6} />)}
        <Tent x={300} y={640} s={1.5} /><path d="M255,640 L300,535 L345,640 Z" fill="#1c140d" /><path d="M300,535 L372,600 L345,640 Z" fill="#cdbf9f" stroke="#8b7b5e" strokeWidth={3} />
        <g transform="translate(1620,580)">{Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={(rnd(i, 4) - 0.5) * 260} cy={(rnd(i, 5) - 0.5) * 240} r={60 + rnd(i, 6) * 50} fill="#2c2a14" />)}</g>
        <path d={polyD(P, k)} fill="none" stroke="#4a1e0c" strokeWidth={26} strokeLinecap="round" opacity={0.8} />
        {Array.from({ length: 16 }).map((_, i) => { const u = (i + 0.5) / 16; if (u > k2) return null; const [x, y] = polyAt(P, u); const s = i % 2 ? 1 : -1;
          return <LPaw key={i} x={x} y={y + s * 46} s={0.8} r={90} c="#3d1608" o={ez(f, pw + i * 3, pw + i * 3 + 6)} />; })}
      </SV>
      <Tag a={dr + 10} t="DRAG MARKS" x={760} y={320} size={64} color={INK} w={800} />
      <Tag a={pw + 6} t="LARGE PAW PRINTS" x={1160} y={760} size={60} color={GOLD} w={900} />
      <Tag a={4} t="THE MORNING AFTER" x={960} y={155} size={54} w={1200} />
    </Scene>
  );
};

// 6 · SIEMPRE EN OTRO LADO: seis campamentos; cada noche Patterson espera en uno y el ataque cae en otro
export const ElsewhereMap: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const C: Pt[] = [[380, 420], [760, 330], [1160, 400], [1540, 330], [560, 760], [1360, 760]];
  const nights = [[0, 3], [2, 5], [4, 1], [3, 4], [5, 0]], per = Math.max(30, (d - 30) / nights.length);
  const cur = Math.min(nights.length - 1, Math.floor(Math.max(0, f - 20) / per)), lf = (f - 20) - cur * per;
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        {C.map(([x, y], i) => <g key={i}><Boma cx={x} cy={y} rx={120} ry={84} op={0.9} th={0.8} /><circle cx={x} cy={y} r={10} fill={AMB} opacity={0.5 + 0.3 * Math.sin(f / 7 + i)} /></g>)}
        {nights.slice(0, cur + 1).map(([w, h], i) => { const old = i < cur; const [wx, wy] = C[w], [hx, hy] = C[h]; const k = old ? 1 : ez(lf, 0, 10), k2 = old ? 1 : ez(lf, 14, 22);
          return <g key={i} opacity={old ? 0.35 : 1}>
            <g transform={`translate(${wx},${wy - 10}) scale(${k})`}><path d="M-46,0 C-20,-30 20,-30 46,0 C20,30 -20,30 -46,0 Z" fill="none" stroke={GOLD} strokeWidth={7} /><circle r={13} fill={GOLD} /></g>
            <g transform={`translate(${hx},${hy})`} opacity={k2}><circle r={40 + (old ? 0 : 50 * ez(lf, 14, 40))} fill="none" stroke={RED} strokeWidth={8} opacity={old ? 1 : 1 - 0.6 * ez(lf, 20, 40)} /><LPaw x={0} y={0} s={0.9} c={RED} /></g>
          </g>; })}
      </SV>
      <Tag a={10} t="WHERE HE WAITED" x={480} y={930} size={52} color={GOLD} w={800} />
      <Tag a={30} t="WHERE THEY STRUCK" x={1440} y={930} size={52} color={RED} w={800} />
      <Tag a={4} t={`NIGHT ${cur + 1}`} x={960} y={155} size={56} w={600} />
    </Scene>
  );
};

// 7 · UNA CANCHA EN DOS SEGUNDOS: el león cruza una cancha de tenis y el cronómetro se clava en 2,0
export const TennisDash: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), g = at(p, "go", 40), t = lin(f, g, g + 60), x = 250 + 1420 * Easing2(t);
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        <rect x={240} y={560} width={1440} height={300} fill="#2d5a3a" stroke={INK} strokeWidth={6} />
        <line x1={960} y1={540} x2={960} y2={880} stroke={INK} strokeWidth={10} />
        <line x1={240} y1={620} x2={1680} y2={620} stroke={INK} strokeWidth={4} /><line x1={240} y1={800} x2={1680} y2={800} stroke={INK} strokeWidth={4} />
        <line x1={580} y1={620} x2={580} y2={800} stroke={INK} strokeWidth={4} /><line x1={1340} y1={620} x2={1340} y2={800} stroke={INK} strokeWidth={4} />
        {f > g && Array.from({ length: 6 }).map((_, i) => <line key={i} x1={x - 330 - i * 50} y1={640 + i * 22} x2={x - 220 - i * 50} y2={640 + i * 22} stroke={SAV} strokeWidth={5} opacity={0.6 * (t > 0 && t < 1 ? 1 : 0)} />)}
        <Lion x={x} y={760} s={0.62} step={f / 2.2} low={0.4} />
        <path d="M240,930 L1680,930 M240,910 L240,950 M1680,910 L1680,950" stroke={GOLD} strokeWidth={5} />
      </SV>
      <Tag a={6} t="THE LENGTH OF A TENNIS COURT" x={960} y={155} size={60} w={1500} />
      <Tag a={10} t="~24 M" x={960} y={950} size={46} color={GOLD} w={500} />
      <div style={{ position: "absolute", left: 760, top: 250, width: 400, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 150, color: t >= 1 ? RED : INK, textShadow: "0 0 18px rgba(0,0,0,.8)" }}>{(2 * t).toFixed(1)}s</div>
    </Scene>
  );
};
const Easing2 = (t: number) => (t < 0.15 ? (t / 0.15) * (t / 0.15) * 0.08 : 0.08 + ((t - 0.15) / 0.85) * 0.92);

// 8 · LO QUE NOS HACE RAROS: erguidos, en grupo, con ruido, con fuego — cuatro cuadros se prenden
export const NotOnMenu: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), A = [at(p, "upright", 0), at(p, "groups", 30), at(p, "noise", 55), at(p, "fire", 80)];
  const lab = ["WE WALK UPRIGHT", "WE MOVE IN GROUPS", "WE MAKE NOISE", "WE CARRY FIRE"];
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        {A.map((a, i) => { const k = sp(f, a + 4, 0.8, 11), x = 300 + i * 440;
          return <g key={i} transform={`translate(${x},540) scale(${0.85 + 0.15 * k})`} opacity={0.25 + 0.75 * ez(f, a, a + 8)}>
            <rect x={-190} y={-250} width={380} height={420} rx={22} fill="rgba(20,14,10,.85)" stroke={k > 0.5 ? GOLD : "rgba(240,235,229,.3)"} strokeWidth={5} />
            {i === 0 && <Fig x={0} y={60} s={1.6} c={SAV} />}
            {i === 1 && [-90, 0, 90].map((dx, j) => <Fig key={j} x={dx} y={60} s={1.1} c={SAV} step={f / 6 + j} />)}
            {i === 2 && <><Fig x={-50} y={60} s={1.3} c={SAV} arm={1} />{[0, 1, 2].map((j) => <path key={j} d={`M${30 + j * 30},-150 a${40 + j * 30},${40 + j * 30} 0 0 1 0,${80 + j * 60}`} fill="none" stroke={GOLD} strokeWidth={6} opacity={0.4 + 0.6 * Math.max(0, Math.sin(f / 4 - j))} transform={`translate(0,${-j * 30})`} />)}</>}
            {i === 3 && <><Fig x={-40} y={60} s={1.3} c={SAV} arm={1} /><Flame x={50} y={-110} s={0.7} k={0.6 + 0.4 * Math.sin(f / 5)} /></>}
          </g>; })}
      </SV>
      {A.map((a, i) => <Tag key={i} a={a + 6} t={lab[i]} x={300 + i * 440} y={760} size={38} color={GOLD} w={420} />)}
      <Tag a={4} t="WHY LIONS AVOID US" x={960} y={155} size={64} w={1300} />
    </Scene>
  );
};

// 9 · LA MELENA QUE NO ESTÁ: cabeza de un macho típico vs. un macho de Tsavo; el largo, igual de normal
export const ManeMeter: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), ln = at(p, "length", 120);
  const Head: React.FC<{ x: number; m: number; k: number }> = ({ x, m, k }) => (
    <g transform={`translate(${x},520) scale(${k})`}>
      {m > 0.5 && <>{Array.from({ length: 30 }).map((_, i) => { const a = (i / 30) * Math.PI * 2; return <ellipse key={i} cx={Math.cos(a) * 158} cy={Math.sin(a) * 170 + 20} rx={78} ry={46} transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 158} ${Math.sin(a) * 170 + 20})`} fill={i % 2 ? "#4a2a12" : "#6a3e1c"} />; })}
        <ellipse cx={0} cy={30} rx={170} ry={190} fill="#5a3418" /></>}
      {m <= 0.5 && <><path d="M-112,-70 C-150,10 -130,100 -70,150" stroke={MANE} strokeWidth={22} fill="none" strokeLinecap="round" /><path d="M112,-70 C150,10 130,100 70,150" stroke={MANE} strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.7} /></>}
      <path d="M-104,-118 L-128,-150 L-86,-140 Z M104,-118 L128,-150 L86,-140 Z" fill={LION} stroke={LRIM} strokeWidth={4} />
      <path d="M-112,-60 C-120,-140 -60,-170 0,-170 C60,-170 120,-140 112,-60 C108,10 96,90 60,130 C30,160 -30,160 -60,130 C-96,90 -108,10 -112,-60 Z" fill={LION} stroke={LRIM} strokeWidth={5} />
      <path d="M-70,-62 C-50,-74 -24,-72 -14,-58 M70,-62 C50,-74 24,-72 14,-58" stroke="#5a3a1e" strokeWidth={8} fill="none" strokeLinecap="round" />
      <ellipse cx={-44} cy={-40} rx={17} ry={11} fill={AMB} /><ellipse cx={44} cy={-40} rx={17} ry={11} fill={AMB} />
      <circle cx={-42} cy={-40} r={6} fill="#120a05" /><circle cx={42} cy={-40} r={6} fill="#120a05" />
      <path d="M-22,-30 L-30,40 M22,-30 L30,40" stroke="#c99a64" strokeWidth={10} strokeLinecap="round" opacity={0.6} />
      <ellipse cx={-34} cy={70} rx={48} ry={36} fill="#e2c49a" /><ellipse cx={34} cy={70} rx={48} ry={36} fill="#e2c49a" />
      <path d="M-28,30 C-20,18 20,18 28,30 L6,56 L-6,56 Z" fill="#2a160c" />
      <path d="M0,56 L0,80 M0,80 C-14,96 -30,94 -40,86 M0,80 C14,96 30,94 40,86" stroke="#2a160c" strokeWidth={5} fill="none" strokeLinecap="round" />
      {[[-58, 64], [-48, 82], [-66, 82], [58, 64], [48, 82], [66, 82]].map(([wx, wy], i) => <circle key={i} cx={wx} cy={wy} r={3.5} fill="#3a2416" />)}
      {[-1, 1].map((sd) => [0, 1, 2].map((j) => <path key={`${sd}${j}`} d={`M${sd * 70},${72 + j * 10} L${sd * (130 + j * 6)},${60 + j * 18}`} stroke="#f0e6d2" strokeWidth={2} opacity={0.7} />))}
      <path d="M-30,118 C-10,132 10,132 30,118" stroke="#e2c49a" strokeWidth={14} fill="none" strokeLinecap="round" />
    </g>
  );
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        <Head x={560} m={1} k={sp(f, 6)} />
        <Head x={1360} m={0.2} k={sp(f, 20)} />
        {f > ln && <g opacity={ez(f, ln, ln + 8)}>
          <path d={`M300,930 L${300 + 1320 * ez(f, ln, ln + 30)},930`} stroke={GOLD} strokeWidth={8} />
          {Array.from({ length: 11 }).map((_, i) => <line key={i} x1={300 + i * 132} y1={910} x2={300 + i * 132} y2={950} stroke={GOLD} strokeWidth={4} opacity={ez(f, ln + i * 2, ln + i * 2 + 4)} />)}
        </g>}
      </SV>
      <Tag a={10} t="TYPICAL MALE" x={560} y={175} size={50} w={700} />
      <Tag a={24} t="TSAVO MALE" x={1360} y={175} size={50} color={GOLD} w={700} />
      {f > ln && <Tag a={ln + 20} t="~9.5 FT NOSE TO TAIL · NORMAL SIZE" x={960} y={960} size={44} w={1500} />}
    </Scene>
  );
};

// 10 · LA RUTINA DE LA NOCHE: el fuego baja, el reloj avanza, el león salta la cerca y elige una carpa
export const NightRoutine: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), lo = at(p, "low", 30), fe = at(p, "fence", 80), ch = at(p, "choose", 140);
  const fire = 1 - 0.75 * ez(f, lo, lo + 40), hr = lin(f, 0, ch, 21, 26);
  const P: Pt[] = [[1800, 900], [1480, 760], [1340, 640], [1150, 560], [980, 470], [860, 400]];
  const k = ez(f, fe, ch + 10), [lx, ly] = polyAt(P, k);
  const T: Pt[] = [[700, 380], [860, 400], [1020, 330], [760, 560], [1080, 600], [900, 700]];
  return (
    <Scene d={d} bg={p.bg} tint="#07060a" floor="120,110,160">
      <SV>
        <Boma cx={900} cy={520} rx={430} ry={300} />
        {T.map(([x, y], i) => <g key={i}><rect x={x - 50} y={y - 36} width={100} height={72} fill={CANVAS} opacity={0.8} stroke={i === 1 && f > ch ? RED : "#8b7b5e"} strokeWidth={i === 1 && f > ch ? 10 : 4} /><line x1={x} y1={y - 36} x2={x} y2={y + 36} stroke="#8b7b5e" strokeWidth={3} /></g>)}
        <Flame x={920} y={500} s={0.8} k={fire} />
        <path d={polyD(P, k)} fill="none" stroke={RED} strokeWidth={6} strokeDasharray="16 14" opacity={0.85} />
        {f > fe && <g transform={`translate(${lx},${ly})`}><circle r={20} fill={RED} /><circle r={36 + 6 * Math.sin(f / 4)} fill="none" stroke={RED} strokeWidth={4} /></g>}
        <g transform="translate(1730,340)"><circle r={90} fill="rgba(10,10,14,.8)" stroke={INK} strokeWidth={5} />
          <line x1={0} y1={0} x2={Math.sin((hr / 12) * Math.PI * 2) * 50} y2={-Math.cos((hr / 12) * Math.PI * 2) * 50} stroke={INK} strokeWidth={8} strokeLinecap="round" />
          <line x1={0} y1={0} x2={Math.sin(hr * Math.PI * 2) * 72} y2={-Math.cos(hr * Math.PI * 2) * 72} stroke={GOLD} strokeWidth={5} strokeLinecap="round" /></g>
      </SV>
      <Tag a={lo + 4} t="FIRES BURN LOW" x={420} y={930} size={46} color={AMB} w={600} />
      <Tag a={fe + 4} t="OVER THE THORNS" x={1500} y={880} size={46} color={RED} w={700} />
      {f > ch && <Tag a={ch + 4} t="ONE TENT" x={820} y={300} size={52} color={RED} w={500} />}
      <Tag a={4} t="LATE, WHEN THE CAMP SLEEPS" x={960} y={155} size={52} w={1300} />
    </Scene>
  );
};

// 11 · CERCA MÁS ALTA, FUEGO, LATAS: cada defensa crece y el león igual pasa
export const BomaRise: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), fi = at(p, "fire", 70), tn = at(p, "tins", 140);
  const h = 120 + 200 * ez(f, 6, 40), jump = (a: number) => { const t = lin(f, a, a + 36); return [lin(t, 0, 1, 200, 1700), 760 - Math.sin(t * Math.PI) * (h + 230)] as const; };
  const stage = f < fi ? 0 : f < tn ? 1 : 2;
  const [jx, jy] = stage === 0 ? jump(44) : stage === 1 ? jump(fi + 30) : jump(tn + 46);
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        <line x1={0} y1={790} x2={1920} y2={790} stroke="#3a2416" strokeWidth={6} />
        <g transform="translate(960,790)">{Array.from({ length: 26 }).map((_, i) => { const x = -200 + (i % 13) * 32, hh = h * (0.7 + rnd(i, 2) * 0.4);
          return <path key={i} d={`M${x},0 L${x + (rnd(i, 3) - 0.5) * 60},${-hh} M${x},${-hh * 0.4} l${30 * (i % 2 ? 1 : -1)},-30 M${x},${-hh * 0.7} l${-26 * (i % 2 ? 1 : -1)},-24`} stroke={THORN} strokeWidth={6} strokeLinecap="round" />; })}</g>
        {stage >= 1 && [700, 1220].map((x, i) => <Flame key={i} x={x} y={790} s={1.1} k={ez(f, fi + i * 4, fi + 14 + i * 4)} />)}
        {stage >= 2 && [620, 1300].map((x, i) => <g key={i} transform={`translate(${x},${770 + Math.sin(f / 2 + i) * 6})`}><rect x={-34} y={-50} width={68} height={70} fill="#9aa0a6" stroke="#4a4f55" strokeWidth={4} />{[0, 1, 2].map((j) => <path key={j} d={`M${46 + j * 26},-60 a${30 + j * 24},${30 + j * 24} 0 0 1 0,${60 + j * 48}`} fill="none" stroke={GOLD} strokeWidth={5} opacity={Math.max(0, Math.sin(f / 3 - j))} transform={`translate(0,${-j * 24})`} />)}</g>)}
        <Lion x={jx} y={jy} s={0.5} step={f / 3} low={0.3} />
      </SV>
      <Tag a={10} t="HIGHER, THICKER THORNS" x={360} y={985} size={40} color={stage === 0 ? GOLD : "rgba(240,235,229,.45)"} w={700} />
      {stage >= 1 && <Tag a={fi + 4} t="FIRES ALL NIGHT" x={960} y={985} size={40} color={stage === 1 ? GOLD : "rgba(240,235,229,.45)"} w={600} />}
      {stage >= 2 && <Tag a={tn + 4} t="BANGING TINS" x={1560} y={985} size={40} color={GOLD} w={600} />}
      <Tag a={44 + 30} t="THEY GOT THROUGH ANYWAY" x={960} y={885} size={56} color={RED} w={1400} />
    </Scene>
  );
};

// 12 · LO QUE APRENDIERON: tres reglas que cualquier depredador aprende, escritas en fichas
export const LearnedRules: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), A = [at(p, "r1", 30), at(p, "r2", 90), at(p, "r3", 150)];
  const R = [["SHOT AT HERE", "AVOID THIS CAMP"], ["WEAK SPOT IN A FENCE", "USE IT AGAIN"], ["MEN SLEEP, SAME PLACE, EVERY NIGHT", "EASIEST PREY IN TSAVO"]];
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        {A.map((a, i) => { const k = sp(f, a, 0.9, 12), y = 335 + i * 225;
          return <g key={i} transform={`translate(${960 + (1 - k) * 900},${y})`} opacity={Math.min(1, k * 1.3)}>
            <rect x={-760} y={-90} width={1520} height={180} rx={18} fill="#e9dfc6" />
            <rect x={-760} y={-90} width={22} height={180} rx={6} fill={i === 2 ? RED : GOLD} />
            <text x={-700} y={-12} fontFamily={F} fontWeight={900} fontSize={i === 2 ? 46 : 52} fill="#2a1d12">{R[i][0]}</text>
            <path d={`M-700,40 L-620,40`} stroke="#2a1d12" strokeWidth={6} /><path d="M-630,26 L-610,40 L-630,54" fill="none" stroke="#2a1d12" strokeWidth={6} />
            <text x={-590} y={58} fontFamily={F} fontWeight={900} fontSize={48} fill={i === 2 ? RED : "#7a4a1c"} opacity={ez(f, a + 14, a + 22)}>{R[i][1]}</text>
            <LPaw x={660} y={0} s={1.1} c="#5a2a14" o={ez(f, a + 18, a + 26)} />
          </g>; })}
      </SV>
      <Tag a={4} t="NOT MAGIC. LEARNING." x={960} y={155} size={66} color={GOLD} w={1300} />
    </Scene>
  );
};

// 13 · SIGUIERON EL TRABAJO: la punta de la vía avanza, las carpas van detrás… y las huellas también
export const FollowTheLine: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), q = at(p, "quiet", 60), fo = at(p, "follow", 140);
  const head = lin(f, 6, d, 500, 1640), quiet = f > q && f < fo;
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        <line x1={120} y1={720} x2={head} y2={720} stroke={IRON} strokeWidth={8} /><line x1={120} y1={750} x2={head} y2={750} stroke={IRON} strokeWidth={8} />
        {Array.from({ length: 50 }).map((_, i) => { const x = 130 + i * 32; return x < head ? <rect key={i} x={x} y={712} width={12} height={46} fill="#4a3322" /> : null; })}
        <g transform={`translate(${head},735)`}><circle r={18} fill={GOLD} /><circle r={34 + 4 * Math.sin(f / 5)} fill="none" stroke={GOLD} strokeWidth={4} /></g>
        {[0, 1, 2, 3].map((i) => <Tent key={i} x={head - 120 - i * 130} y={690} s={0.5} />)}
        <Tent x={420} y={690} s={0.55} op={0.6} /><text x={420} y={800} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={30} fill={INK} opacity={0.7}>BRIDGE CREW</text>
        {f > fo && Array.from({ length: 12 }).map((_, i) => { const x = 300 + i * ((head - 420) / 12); return <LPaw key={i} x={x} y={860 + (i % 2) * 28} s={0.55} r={90} c={RED} o={ez(f, fo + i * 3, fo + i * 3 + 6)} />; })}
        {quiet && <Moon x={960} y={300} r={50} o={ez(f, q, q + 10)} />}
      </SV>
      <Tag a={8} t="THE LINE MOVED FORWARD" x={960} y={155} size={60} w={1300} />
      {quiet && <Tag a={q + 4} t="QUIET NIGHTS" x={960} y={400} size={52} color={GOLD} w={700} />}
      {f > fo && <Tag a={fo + 6} t="THEY FOLLOWED THE WORK" x={960} y={920} size={58} color={RED} w={1300} />}
    </Scene>
  );
};

// 14 · EL HOSPITAL SE MUDA: el viejo queda vacío, el nuevo tiene una cerca más fuerte… el rastro dobla hacia él
export const HospitalSwitch: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), em = at(p, "empty", 60), nw = at(p, "nw", 120);
  const P1: Pt[] = [[200, 940], [420, 820], [560, 640], [600, 560]], P2: Pt[] = [[600, 560], [860, 640], [1120, 620], [1340, 520]];
  const k1 = ez(f, em - 30, em + 10), k2 = ez(f, nw, nw + 50);
  const Comp: React.FC<{ x: number; y: number; th: number; on: boolean; label: string }> = ({ x, y, th, on, label }) => (
    <g>
      <Boma cx={x} cy={y} rx={200} ry={140} th={th} op={on ? 1 : 0.5} />
      <rect x={x - 70} y={y - 46} width={140} height={92} fill={on ? CANVAS : "rgba(232,220,194,.3)"} stroke="#8b7b5e" strokeWidth={4} />
      <path d={`M${x - 14},${y - 30} h28 v18 h18 v28 h-18 v18 h-28 v-18 h-18 v-28 h18 Z`} fill={on ? RED : "rgba(241,69,54,.35)"} />
      <text x={x} y={y + 200} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={34} fill={INK}>{label}</text>
    </g>
  );
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        <Comp x={600} y={500} th={0.8} on={f < em} label="OLD HOSPITAL" />
        <Comp x={1340} y={460} th={1.5} on label="NEW HOSPITAL" />
        {f > 10 && <g transform="translate(1340,460)" opacity={ez(f, 10, 20)}><circle r={228} fill="none" stroke={GOLD} strokeWidth={4} strokeDasharray="12 10" /></g>}
        <path d={polyD(P1, k1)} fill="none" stroke={RED} strokeWidth={6} strokeDasharray="16 12" />
        <path d={polyD(P2, k2)} fill="none" stroke={RED} strokeWidth={8} strokeDasharray="16 12" />
        {f > em && <g transform="translate(600,500)" opacity={ez(f, em, em + 8)}><text y={-70} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={52} fill={GOLD}>EMPTY</text></g>}
        {f > nw && (() => { const [x, y] = polyAt(P2, k2); return <g transform={`translate(${x},${y})`}><LPaw x={0} y={0} s={1} r={70} c={RED} /></g>; })()}
      </SV>
      <Tag a={4} t="A STRONGER FENCE, A NEW PLACE" x={960} y={155} size={58} w={1500} />
      {f > nw && <Tag a={nw + 30} t="THE NEXT NIGHT" x={1340} y={800} size={54} color={RED} w={700} />}
    </Scene>
  );
};
