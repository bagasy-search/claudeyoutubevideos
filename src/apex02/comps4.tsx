// comps4.tsx — componentes de los bloques nuevos (versión 20 min): el recorrido de las termas como gradiente de calor,
// la cadena de tres calderas de Vitruvio, los ladrillos a escala del pie romano, el hipocausto de canales y la cadena de
// abastecimiento de Caracalla. Todo SVG por código, misma paleta brasa/hielo que comps3.
import React from "react";
import { SANS, ROMAN, MONO, EMBER, EMBER2, ICE, W, H, k01, lerp, ease, easeOut, rnd, shadow } from "./lib";

const fadeIO = (t: number, a: number, b: number, d = 0.3) => k01(t, a, a + d) * (1 - k01(t, b - d, b));
const heat = (u: number) => {            // 1 = brasa, 0 = frío
  const c0 = [120, 190, 255], c1 = [255, 196, 107], c2 = [255, 110, 30];
  const m = u < 0.5 ? c0.map((v, i) => lerp(v, c1[i], u * 2)) : c1.map((v, i) => lerp(v, c2[i], (u - 0.5) * 2));
  return `rgb(${m.map(Math.round).join(",")})`;
};
const Backdrop: React.FC<{ o: number; tone?: "warm" | "cold" }> = ({ o, tone = "warm" }) => (
  <div style={{ position: "absolute", inset: 0, opacity: o * 0.82, background: tone === "warm"
    ? "radial-gradient(ellipse at 50% 55%, rgba(30,16,8,.55) 0%, rgba(6,4,3,.92) 78%)"
    : "radial-gradient(ellipse at 50% 55%, rgba(8,16,28,.55) 0%, rgba(3,5,8,.92) 78%)" }} />
);

// ---------- el recorrido de las termas: las salas se encienden según su distancia al horno ----------
export const BathRoute: React.FC<{ t: number; a: number; b: number; rooms: { at: number; la: string; en: string; h: number }[]; gradAt: number }> = ({ t, a, b, rooms, gradAt }) => {
  if (t < a || t > b) return null;
  const o = fadeIO(t, a, b), n = rooms.length, x0 = 360, w = 290, gap = 22, y = 330, hh = 300;
  const g = ease(k01(t, gradAt, gradAt + 2.2));
  const cur = rooms.reduce((k, r, i) => (t >= r.at ? i : k), -1);
  const walker = cur < 0 ? 0 : lerp(cur, Math.min(n - 1, cur + 1), ease(k01(t, rooms[cur].at, rooms[cur].at + 0.8)) * 0);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <Backdrop o={1} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="brGlow"><feGaussianBlur stdDeviation="14" /></filter>
          <radialGradient id="brFire"><stop offset="0" stopColor={EMBER2} /><stop offset=".5" stopColor={EMBER} /><stop offset="1" stopColor="rgba(255,90,20,0)" /></radialGradient>
        </defs>
        {/* horno */}
        <g opacity={k01(t, a + 0.2, a + 0.7)}>
          <ellipse cx={185} cy={y + hh / 2} rx={110 + 8 * Math.sin(t * 9)} ry={90 + 6 * Math.sin(t * 7)} fill="url(#brFire)" />
          <path d={`M115 ${y + hh} L115 ${y + 60} Q185 ${y - 10} 255 ${y + 60} L255 ${y + hh}`} fill="none" stroke="#e9d3b4" strokeWidth={5} />
          <text x={185} y={y - 30} textAnchor="middle" fontFamily={ROMAN} fontWeight={800} fontSize={24} fill={EMBER2} letterSpacing={1}>PRAEFURNIUM</text>
          <text x={185} y={y + hh + 150} textAnchor="middle" fontFamily={SANS} fontWeight={600} fontSize={22} fill="rgba(255,255,255,.75)" letterSpacing={3}>THE FURNACE</text>
        </g>
        {rooms.map((r, i) => {
          const k = easeOut(k01(t, r.at, r.at + 0.5)); if (k <= 0) return null;
          const x = x0 + i * (w + gap), u = r.h * g, on = i === cur;
          return (
            <g key={i} opacity={k} transform={`translate(0 ${(1 - k) * 40})`}>
              {g > 0 && <rect x={x} y={y} width={w} height={hh} fill={heat(r.h)} opacity={0.18 + 0.5 * u} filter="url(#brGlow)" />}
              <rect x={x} y={y} width={w} height={hh} fill={g > 0 ? heat(r.h) : "rgba(255,255,255,.06)"} fillOpacity={g > 0 ? 0.16 + 0.3 * u : 1}
                stroke={on ? "#fff" : "rgba(233,211,180,.85)"} strokeWidth={on ? 6 : 3} />
              {/* pilae bajo el piso */}
              {Array.from({ length: 8 }, (_, j) => <rect key={j} x={x + 14 + j * 36} y={y + hh + 8} width={18} height={30} fill={heat(r.h)} opacity={0.25 + 0.6 * u} />)}
              <text x={x + w / 2} y={y + 92} textAnchor="middle" fontFamily={ROMAN} fontWeight={800} fontSize={r.la.length > 10 ? 25 : 31} fill="#fff" letterSpacing={0}>{r.la}</text>
              <text x={x + w / 2} y={y + 140} textAnchor="middle" fontFamily={SANS} fontWeight={600} fontSize={26} fill="rgba(255,255,255,.85)" letterSpacing={4}>{r.en}</text>
            </g>
          );
        })}
        {/* el gradiente: flecha de los gases que se enfrían */}
        {g > 0 && <g opacity={g}>
          <defs><linearGradient id="brGrad" x1="0" x2="1"><stop offset="0" stopColor={EMBER} /><stop offset=".5" stopColor={EMBER2} /><stop offset="1" stopColor={ICE} /></linearGradient></defs>
          <rect x={x0} y={y + hh + 70} width={(n * (w + gap) - gap) * g} height={10} rx={5} fill="url(#brGrad)" />
          <text x={x0} y={y + hh + 130} fontFamily={MONO} fontWeight={700} fontSize={30} fill={EMBER2}>HOT GASES</text>
          <text x={x0 + n * (w + gap) - gap} y={y + hh + 130} textAnchor="end" fontFamily={MONO} fontWeight={700} fontSize={30} fill={ICE} opacity={k01(g, 0.8, 1)}>COOLED</text>
        </g>}
      </svg>
      {walker < 0 && null}
    </div>
  );
};

// ---------- las tres calderas de bronce de Vitruvio: caliente, tibia, fría, en cadena ----------
export const TankChain: React.FC<{ t: number; a: number; b: number; drawAt: number; warmAt: number; coldAt: number; litAt?: number[]; linkAt?: number }> = ({ t, a, b, drawAt, warmAt, coldAt, litAt, linkAt }) => {
  if (t < a || t > b) return null;
  const o = fadeIO(t, a, b);
  const T = [
    { x: 1160, y: 590, la: "CALDARIUM", en: "HOT", c: EMBER },
    { x: 810, y: 400, la: "TEPIDARIUM", en: "WARM", c: EMBER2 },
    { x: 460, y: 210, la: "FRIGIDARIUM", en: "COLD", c: ICE },
  ];
  const kIn = (i: number) => easeOut(k01(t, a + 0.2 + i * 0.25, a + 0.8 + i * 0.25));
  const d = k01(t, drawAt, drawAt + 1.0), w = k01(t, warmAt, warmAt + 1.0), c = k01(t, coldAt, coldAt + 1.0);
  const lvl = [0.8 - 0.35 * d + 0.35 * w, 0.8 - 0.35 * w + 0.35 * c, 0.8 - 0.35 * c + 0.35 * k01(t, coldAt + 1.0, coldAt + 2.2)];
  const flow = (on: number, x1: number, y1: number, x2: number, y2: number, col: string, key: string) => on > 0 && on < 1 &&
    <g key={key}><path d={`M${x1} ${y1} C${x1 + 80} ${y1} ${x2 - 40} ${y2 - 90} ${x2} ${y2}`} fill="none" stroke={col} strokeWidth={14} strokeLinecap="round"
      strokeDasharray="30 22" strokeDashoffset={-t * 160} opacity={0.9} /></g>;
  const tw = 300, th = 210;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <Backdrop o={1} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="tcBronze" x1="0" x2="1"><stop offset="0" stopColor="#5a3a1c" /><stop offset=".35" stopColor="#c58b45" /><stop offset=".55" stopColor="#f0c27a" /><stop offset="1" stopColor="#4a2e14" /></linearGradient>
          <radialGradient id="tcFire"><stop offset="0" stopColor={EMBER2} /><stop offset=".55" stopColor={EMBER} /><stop offset="1" stopColor="rgba(255,90,20,0)" /></radialGradient>
        </defs>
        <ellipse cx={T[0].x + tw / 2} cy={T[0].y + th + 90} rx={220 + 10 * Math.sin(t * 8)} ry={90} fill="url(#tcFire)" opacity={kIn(0)} />
        <text x={T[0].x + tw + 60} y={T[0].y + th + 100} textAnchor="start" fontFamily={ROMAN} fontWeight={800} fontSize={32} fill={EMBER2} letterSpacing={4} opacity={kIn(0)}>THE FURNACE</text>
        {T.map((q, i) => {
          const k = kIn(i), L = lvl[i];
          const lit = litAt ? easeOut(k01(t, litAt[i], litAt[i] + 0.45)) : 1, pop = litAt ? Math.sin(Math.PI * k01(t, litAt[i], litAt[i] + 0.5)) : 0;
          const sc = 1 + 0.07 * pop, cx = q.x + tw / 2, cy = q.y + th / 2;
          return <g key={i} opacity={k * (0.28 + 0.72 * lit)} transform={`translate(0 ${(1 - k) * 50}) translate(${cx} ${cy}) scale(${sc}) translate(${-cx} ${-cy})`}>
            <rect x={q.x} y={q.y} width={tw} height={th} rx={26} fill="url(#tcBronze)" />
            <clipPath id={`tcc${i}`}><rect x={q.x + 14} y={q.y + 14} width={tw - 28} height={th - 28} rx={16} /></clipPath>
            <g clipPath={`url(#tcc${i})`}>
              <rect x={q.x + 14} y={q.y + 14} width={tw - 28} height={th - 28} fill="rgba(0,0,0,.55)" />
              <path d={`M${q.x} ${q.y + 14 + (th - 28) * (1 - L)} q ${tw / 4} ${-8 * Math.sin(t * 4 + i)} ${tw / 2} 0 t ${tw / 2} 0 V ${q.y + th} H ${q.x} Z`} fill={q.c} opacity={0.85} />
            </g>
            {i === 0 && <g opacity={d * (1 - k01(t, drawAt + 2.5, drawAt + 3.2))}>
              <path d={`M${q.x + tw} ${q.y + th - 40} h 70 v 60`} fill="none" stroke={EMBER} strokeWidth={14} strokeLinecap="round" strokeDasharray="26 18" strokeDashoffset={-t * 160} />
              <text x={q.x + tw + 100} y={q.y + th + 70} fontFamily={MONO} fontWeight={700} fontSize={26} fill={EMBER2}>DRAWN OFF</text>
            </g>}
            <g opacity={lit}><text x={q.x + tw / 2} y={q.y - 46} textAnchor="middle" fontFamily={ROMAN} fontWeight={800} fontSize={36} fill="#fff" letterSpacing={3} style={{ textShadow: shadow }}>{q.la}</text>
            <text x={q.x + tw / 2} y={q.y - 14} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={30} fill={q.c} letterSpacing={6}>{q.en}</text></g>
          </g>;
        })}
        {linkAt !== undefined && [[1, 0], [2, 1]].map(([u, v], j) => {
          const e = easeOut(k01(t, linkAt + j * 0.3, linkAt + j * 0.3 + 0.6)), x1 = T[u].x + tw, y1 = T[u].y + th - 30, x2 = T[v].x + 30, y2 = T[v].y + 6;
          return <path key={"lk" + j} d={`M${x1} ${y1} C${x1 + 80} ${y1} ${x2 - 40} ${y2 - 90} ${x2} ${y2}`} fill="none" stroke="#c58b45" strokeWidth={18} strokeLinecap="round" pathLength={1} strokeDasharray={`${e} 1`} opacity={0.75} />;
        })}
        {flow(w, T[1].x + tw, T[1].y + th - 30, T[0].x + 30, T[0].y + 6, EMBER2, "w")}
        {flow(c, T[2].x + tw, T[2].y + th - 30, T[1].x + 30, T[1].y + 6, ICE, "c")}
        {flow(k01(t, coldAt + 1.0, coldAt + 2.2) * 0.99, T[2].x - 220, T[2].y - 60, T[2].x + 20, T[2].y + 6, "#dfeeff", "in")}
      </svg>
    </div>
  );
};

// ---------- los ladrillos con nombre: a escala del pie romano ----------
export const BrickScale: React.FC<{ t: number; a: number; b: number; footAt: number; bricks: { at: number; la: string; ft: number; frac: string; use: string }[] }> = ({ t, a, b, footAt, bricks }) => {
  if (t < a || t > b) return null;
  const o = fadeIO(t, a, b), px = 300;                  // 1 pie = 300 px
  const fk = ease(k01(t, footAt, footAt + 0.9));
  const xs = [260, 560, 1110];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <Backdrop o={1} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="bsClay" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d97a4a" /><stop offset=".6" stopColor="#b5552d" /><stop offset="1" stopColor="#7c3518" /></linearGradient>
          <pattern id="bsGrain" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1.1" fill="rgba(0,0,0,.18)" /><circle cx="7" cy="7" r=".8" fill="rgba(255,255,255,.12)" /></pattern>
        </defs>
        {/* regla: el pie romano */}
        <g opacity={fk}>
          <line x1={260} y1={250} x2={260 + px * fk} y2={250} stroke={EMBER2} strokeWidth={6} />
          {Array.from({ length: 13 }, (_, i) => i * px / 12 <= px * fk && <line key={i} x1={260 + i * px / 12} y1={250} x2={260 + i * px / 12} y2={i % 12 === 0 ? 212 : i % 3 === 0 ? 226 : 236} stroke={EMBER2} strokeWidth={i % 12 === 0 ? 5 : 3} />)}
          <text x={260 + px + 40} y={244} fontFamily={ROMAN} fontWeight={800} fontSize={40} fill="#fff" letterSpacing={4}>1 ROMAN FOOT</text>
          <text x={260 + px + 40} y={284} fontFamily={MONO} fontWeight={700} fontSize={28} fill={EMBER2}>≈ 29.6 cm</text>
        </g>
        {bricks.map((q, i) => {
          const k = easeOut(k01(t, q.at, q.at + 0.7)); if (k <= 0) return null;
          const s = q.ft * px * 0.55, x = xs[i] ?? 260, y = 380, dep = 26;
          return <g key={i} opacity={k} transform={`translate(${x} ${y + (1 - k) * 60})`}>
            <polygon points={`0,${dep} ${dep},0 ${s + dep},0 ${s},${dep}`} fill="#e59a6c" />
            <polygon points={`${s},${dep} ${s + dep},0 ${s + dep},${s} ${s},${s + dep}`} fill="#8a3e1d" />
            <rect x={0} y={dep} width={s} height={s} fill="url(#bsClay)" />
            <rect x={0} y={dep} width={s} height={s} fill="url(#bsGrain)" />
            <line x1={0} y1={s + dep + 30} x2={s} y2={s + dep + 30} stroke="#fff" strokeWidth={3} />
            <line x1={0} y1={s + dep + 20} x2={0} y2={s + dep + 40} stroke="#fff" strokeWidth={3} />
            <line x1={s} y1={s + dep + 20} x2={s} y2={s + dep + 40} stroke="#fff" strokeWidth={3} />
            <text x={s / 2} y={s + dep + 74} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={28} fill={EMBER2}>{q.frac}</text>
            <text x={s / 2} y={s + dep + 124} textAnchor="middle" fontFamily={ROMAN} fontWeight={800} fontSize={i === 1 ? 30 : 36} fill="#fff" letterSpacing={2}>{q.la}</text>
            <text x={s / 2} y={s + dep + 160} textAnchor="middle" fontFamily={SANS} fontWeight={600} fontSize={22} fill="rgba(255,255,255,.75)" letterSpacing={3}>{q.use}</text>
          </g>;
        })}
      </svg>
    </div>
  );
};

// ---------- el hipocausto de canales: cruz y árbol tallados en el piso, el gas los recorre ----------
export const ChannelPlan: React.FC<{ t: number; a: number; b: number; crossAt: number; treeAt: number; gasAt: number }> = ({ t, a, b, crossAt, treeAt, gasAt }) => {
  if (t < a || t > b) return null;
  const o = fadeIO(t, a, b);
  const cx = 560, cy = 560, R = 300, tx = 1360, ty = 560;
  const cross = [`M${cx - R} ${cy} H${cx + R}`, `M${cx} ${cy - R} V${cy + R}`, `M${cx - R - 120} ${cy} H${cx - R}`];
  const tree = [`M${tx - R - 120} ${ty} H${tx - 60}`, `M${tx - 60} ${ty} L${tx + 150} ${ty - 230}`, `M${tx - 60} ${ty} L${tx + 150} ${ty + 230}`,
    `M${tx + 30} ${ty - 100} L${tx + 250} ${ty - 70}`, `M${tx + 30} ${ty + 100} L${tx + 250} ${ty + 70}`, `M${tx - 60} ${ty} H${tx + 280}`];
  const draw = (d: string, k: number, i: number, gas: number) => <g key={d}>
    <path d={d} fill="none" stroke="#6a4428" strokeWidth={52} strokeLinecap="square" pathLength={1} strokeDasharray={`${k} 1`} />
    <path d={d} fill="none" stroke="#e9d3b4" strokeWidth={4} strokeLinecap="square" pathLength={1} strokeDasharray={`${k} 1`} opacity={0.6} />
    {gas > 0 && <path d={d} fill="none" stroke={EMBER} strokeWidth={30} strokeLinecap="round" pathLength={1} strokeDasharray={`${gas} 1`} opacity={0.85} style={{ filter: `drop-shadow(0 0 16px ${EMBER})` }} />}
  </g>;
  const g = ease(k01(t, gasAt, gasAt + 2.0));
  const kc = ease(k01(t, crossAt, crossAt + 1.2)), kt = ease(k01(t, treeAt, treeAt + 1.4));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <Backdrop o={1} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g opacity={k01(t, crossAt - 0.2, crossAt + 0.3)}>
          <rect x={cx - R} y={cy - R} width={2 * R} height={2 * R} fill="rgba(233,211,180,.08)" stroke="rgba(233,211,180,.7)" strokeWidth={3} />
          {cross.map((d, i) => draw(d, kc, i, g))}
          <text x={cx} y={cy + R + 70} textAnchor="middle" fontFamily={ROMAN} fontWeight={800} fontSize={36} fill="#fff" letterSpacing={4}>A CROSS</text>
        </g>
        <g opacity={k01(t, treeAt - 0.2, treeAt + 0.3)}>
          <rect x={tx - R} y={ty - R} width={2 * R} height={2 * R} fill="rgba(233,211,180,.08)" stroke="rgba(233,211,180,.7)" strokeWidth={3} />
          {tree.map((d, i) => draw(d, kt, i, g))}
          <text x={tx} y={ty + R + 70} textAnchor="middle" fontFamily={ROMAN} fontWeight={800} fontSize={36} fill="#fff" letterSpacing={4}>A BRANCHING TREE</text>
        </g>
        {g > 0 && <text x={W / 2} y={150} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={30} fill={EMBER2} opacity={g} letterSpacing={4}>FEWER BRICKS · LESS FUEL</text>}
      </svg>
    </div>
  );
};

// ---------- la cadena de abastecimiento: se enciende eslabón por eslabón y al final se quiebra ----------
export const SupplyChain: React.FC<{ t: number; a: number; b: number; items: { at: number; text: string }[]; breakAt?: number; title?: string }> = ({ t, a, b, items, breakAt, title }) => {
  if (t < a || t > b) return null;
  const o = fadeIO(t, a, b), n = items.length, x0 = 230, x1 = W - 230, y = 560;
  const br = breakAt != null ? ease(k01(t, breakAt, breakAt + 1.2)) : 0;
  const px = (i: number) => lerp(x0, x1, i / (n - 1));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <Backdrop o={1} tone={br > 0.5 ? "cold" : "warm"} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {title && <text x={W / 2} y={260} textAnchor="middle" fontFamily={ROMAN} fontWeight={800} fontSize={58} fill="#fff" letterSpacing={8} opacity={k01(t, a + 0.2, a + 0.8)} style={{ textShadow: shadow }}>{title}</text>}
        {items.slice(0, -1).map((_, i) => {
          const on = k01(t, items[i + 1].at - 0.3, items[i + 1].at + 0.2);
          const gap = br * (6 + 40 * rnd(i, 3)), dy = br * (rnd(i, 7) - 0.5) * 60;
          const xa = px(i) + 70, xb = px(i + 1) - 70, xm = (xa + xb) / 2;
          return <g key={i} opacity={on}>
            <line x1={xa} y1={y} x2={xm - gap} y2={y + dy * 0.3} stroke={br > 0 ? lerp(1, 0.4, br) > 0.6 ? EMBER : "#777" : EMBER} strokeWidth={8} />
            <line x1={xm + gap} y1={y - dy * 0.3} x2={xb} y2={y} stroke={br > 0.6 ? "#777" : EMBER} strokeWidth={8} />
            {br < 0.2 && <circle cx={lerp(xa, xb, (t * 0.9 + i * 0.3) % 1)} cy={y} r={9} fill={EMBER2} />}
          </g>;
        })}
        {items.map((it, i) => {
          const k = easeOut(k01(t, it.at, it.at + 0.45)); if (k <= 0) return null;
          const dim = br * (0.5 + 0.5 * rnd(i, 11));
          return <g key={i} opacity={k * (1 - 0.55 * dim)} transform={`translate(${px(i)} ${y + br * (rnd(i, 5) - 0.5) * 40}) scale(${0.6 + 0.4 * k})`}>
            <circle r={62} fill="rgba(20,12,8,.85)" stroke={dim > 0.5 ? "#777" : EMBER} strokeWidth={6} style={{ filter: dim > 0.5 ? undefined : `drop-shadow(0 0 18px ${EMBER})` }} />
            <circle r={16} fill={dim > 0.5 ? "#555" : EMBER2} />
            <text y={120} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={34} fill="#fff" letterSpacing={4} style={{ textShadow: shadow }}>{it.text}</text>
          </g>;
        })}
      </svg>
    </div>
  );
};

// ---------- cota de diámetro sobre una foto (el caldarium de 35 m) ----------
export const SpanMark: React.FC<{ t: number; a: number; b: number; x1: number; x2: number; y: number; label: string; sub?: string }> = ({ t, a, b, x1, x2, y, label, sub }) => {
  if (t < a || t > b) return null;
  const o = fadeIO(t, a, b), k = ease(k01(t, a + 0.1, a + 1.0)), xm = (x1 + x2) / 2, hw = (x2 - x1) / 2 * k;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: o, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.9))" }}>
      <line x1={xm - hw} y1={y} x2={xm + hw} y2={y} stroke="#fff" strokeWidth={5} />
      <path d={`M${xm - hw + 22} ${y - 14} L${xm - hw} ${y} L${xm - hw + 22} ${y + 14} M${xm + hw - 22} ${y - 14} L${xm + hw} ${y} L${xm + hw - 22} ${y + 14}`} fill="none" stroke="#fff" strokeWidth={5} />
      <line x1={x1} y1={y - 40} x2={x1} y2={y + 40} stroke="#fff" strokeWidth={3} opacity={k} />
      <line x1={x2} y1={y - 40} x2={x2} y2={y + 40} stroke="#fff" strokeWidth={3} opacity={k} />
      <text x={xm} y={y - 34} textAnchor="middle" fontFamily={ROMAN} fontWeight={800} fontSize={64} fill="#fff" letterSpacing={4} opacity={k01(t, a + 0.7, a + 1.1)}>{label}</text>
      {sub && <text x={xm} y={y + 70} textAnchor="middle" fontFamily={SANS} fontWeight={600} fontSize={28} fill={EMBER2} letterSpacing={5} opacity={k01(t, a + 0.9, a + 1.3)}>{sub}</text>}
    </svg>
  );
};
