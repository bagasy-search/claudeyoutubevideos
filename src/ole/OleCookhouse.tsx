// OleCookhouse — el comedor del campamento maderero visto desde ARRIBA (ilustración vectorial): mesas largas de tablones,
// bancos, 40 platos de lata que se van SIRVIENDO con porotos uno por uno (desde la estufa hacia afuera) y un contador que sube.
// OleCampMap — mapa dibujado a mano del campamento (bunkhouse, cook shack, stable, el POZO de los porotos con una X),
// bosque, lago congelado, recorrido punteado animado y rótulos por props.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, HAND, LABEL, SERIF, hexA, rnd, kraftBg } from "./OleTheme";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ─────────────────────────────────────────── COMEDOR ───────────────────────────────────────────
type Plate = { x: number; y: number; side: -1 | 1; order: number };
const T_X0 = 250, T_X1 = 1440, T_W = 150; const TABLES_Y = [372, 712];

function makePlates(n: number): Plate[] {
  const ps: Plate[] = [];
  const perSide = Math.max(1, Math.ceil(n / (TABLES_Y.length * 2)));
  const step = (T_X1 - T_X0) / perSide;
  TABLES_Y.forEach((ty) => ([-1, 1] as const).forEach((side) => {
    for (let i = 0; i < perSide; i++) ps.push({ x: T_X1 - step * (i + 0.5), y: ty + side * 44, side, order: 0 });
  }));
  // orden de servicio: el más cercano a la estufa primero, alternando mesas y lados
  const keep = ps.map((p) => ({ p, k: (T_X1 - p.x) * 1.0 + (p.y > 540 ? 18 : 0) + (p.side > 0 ? 9 : 0) })).sort((a, b) => a.k - b.k).slice(0, n);
  keep.forEach((o, r) => { o.p.order = r; });
  return keep.map((o) => o.p);
}

const BeansOnPlate: React.FC<{ p: number; seed: number }> = ({ p, seed }) => {
  if (p <= 0) return null;
  const beans = Array.from({ length: 13 }).map((_, i) => {
    const a = rnd(seed + i) * Math.PI * 2, r = Math.sqrt(rnd(seed + 40 + i)) * 19;
    return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.9, rot: rnd(seed + 80 + i) * 180, c: rnd(seed + 120 + i) > 0.45 ? OLE.bean : OLE.beanL };
  });
  return (
    <g transform={`scale(${p})`}>
      <ellipse cx={0} cy={0} rx={27} ry={25} fill="#6E3A1E" opacity={0.92} />
      {beans.map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${b.rot})`}>
          <ellipse rx={5.2} ry={3.4} fill={b.c} />
          <ellipse rx={2} ry={1} cx={-1.4} cy={-1.1} fill="rgba(255,225,190,0.55)" />
        </g>
      ))}
      <rect x={6} y={-12} width={11} height={9} rx={2} fill="#E9B8A6" transform="rotate(14)" opacity={0.9} />
    </g>
  );
};

const Steam: React.FC<{ x: number; y: number; t: number; n?: number; s?: number; seed?: number }> = ({ x, y, t, n = 5, s = 1, seed = 1 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const ph = ((t * 0.45 + i / n + rnd(seed + i) * 0.2) % 1);
      const dx = Math.sin((ph * 3 + i) * 2) * 16 * s, r = (14 + ph * 34) * s;
      return <circle key={i} cx={x + dx + (rnd(seed + 9 + i) - 0.5) * 20 * s} cy={y - ph * 60 * s} r={r} fill="#FFFFFF" opacity={0.2 * Math.sin(Math.PI * ph)} filter="url(#ckSteamBlur)" />;
    })}
  </g>
);

export const OleCookhouse: React.FC<{
  count?: number; label?: string; sub?: string; serveStart?: number; serveEnd?: number; stove?: string;
}> = ({ count = 40, label = "40 MEN · 2 MEALS A DAY", sub, serveStart = 0.8, serveEnd, stove = "" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const t = f / fps; const dur = durationInFrames / fps;
  const n = Math.max(1, Math.min(60, count));
  const plates = React.useMemo(() => makePlates(n), [n]);
  const sEnd = serveEnd ?? Math.max(serveStart + 1, dur * 0.72);
  const every = (sEnd - serveStart) / n;
  const served = Math.max(0, Math.min(n, Math.floor((t - serveStart) / every) + 1));
  const push = interpolate(f, [0, durationInFrames], [1.0, 1.05], cl);
  const cardIn = spring({ frame: f - 6, fps, config: { damping: 15, stiffness: 120 } });
  const bump = served > 0 ? 1 + 0.06 * Math.max(0, 1 - ((t - serveStart) % every) / Math.min(every, 0.25)) : 1;

  const planks = Array.from({ length: 21 });
  return (
    <AbsoluteFill style={{ backgroundColor: OLE.snow, overflow: "hidden" }}>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0, scale: String(push) }}>
        <defs>
          <radialGradient id="ckTin" cx="45%" cy="40%" r="60%"><stop offset="0" stopColor="#EEF1F2" /><stop offset="0.7" stopColor="#BFC5C9" /><stop offset="1" stopColor="#8F979C" /></radialGradient>
          <radialGradient id="ckTinIn" cx="50%" cy="45%" r="60%"><stop offset="0" stopColor="#DDE2E4" /><stop offset="1" stopColor="#A9B0B4" /></radialGradient>
          <radialGradient id="ckIron" cx="40%" cy="35%" r="75%"><stop offset="0" stopColor="#4A4540" /><stop offset="1" stopColor={OLE.iron} /></radialGradient>
          <radialGradient id="ckGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="rgba(255,190,110,0.45)" /><stop offset="1" stopColor="rgba(255,190,110,0)" /></radialGradient>
          <filter id="ckSteamBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
          <linearGradient id="ckTable" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C99B63" /><stop offset="1" stopColor="#B4844F" /></linearGradient>
        </defs>
        {/* nieve afuera con huellas y pinos */}
        {Array.from({ length: 26 }).map((_, i) => {
          const edge = i % 4; const k = rnd(300 + i);
          const x = edge === 0 ? k * 1920 : edge === 1 ? 1880 + rnd(i + 7) * 30 : edge === 2 ? k * 1920 : 10 + rnd(i + 3) * 30;
          const y = edge === 0 ? 20 + rnd(i + 5) * 20 : edge === 2 ? 1050 + rnd(i + 5) * 20 : k * 1080;
          return <circle key={i} cx={x} cy={y} r={10 + rnd(i + 11) * 14} fill="#DCE5EA" />;
        })}
        {/* piso de tablones */}
        <rect x={90} y={80} width={1740} height={920} fill="#C8A071" />
        {planks.map((_, i) => (
          <g key={i}>
            <rect x={90} y={80 + i * 44} width={1740} height={44} fill={i % 2 ? "#C39A69" : "#CDA678"} />
            <line x1={90} x2={1830} y1={80 + i * 44} y2={80 + i * 44} stroke="rgba(90,55,25,0.35)" strokeWidth={2} />
            {[0, 1, 2].map((j) => { const bx = 90 + ((rnd(i * 7 + j) * 0.9 + j) / 3) * 1740; return <line key={j} x1={bx} x2={bx} y1={80 + i * 44} y2={124 + i * 44} stroke="rgba(90,55,25,0.3)" strokeWidth={2} />; })}
            {[0, 1].map((j) => <circle key={`n${j}`} cx={90 + rnd(i * 13 + j) * 1740} cy={80 + i * 44 + 22} r={2.2} fill="rgba(70,40,15,0.45)" />)}
          </g>
        ))}
        {/* luz de la estufa sobre el piso */}
        <ellipse cx={1640} cy={500} rx={520} ry={420} fill="url(#ckGlow)" opacity={0.8 + 0.08 * Math.sin(t * 7)} />
        {/* paredes de troncos */}
        {[[60, 50, 1800, 42], [60, 988, 1800, 42], [60, 50, 42, 980], [1818, 50, 42, 980]].map(([x, y, w, h], i) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} fill="#7A5232" />
            {Array.from({ length: 3 }).map((__, k) => w > h
              ? <line key={k} x1={x} x2={x + w} y1={y + 8 + k * 13} y2={y + 8 + k * 13} stroke="rgba(40,22,10,0.45)" strokeWidth={3} />
              : <line key={k} y1={y} y2={y + h} x1={x + 8 + k * 13} x2={x + 8 + k * 13} stroke="rgba(40,22,10,0.45)" strokeWidth={3} />)}
          </g>
        ))}
        {/* ventanas con nieve en el alféizar */}
        {[[330, 50], [760, 50], [1190, 50], [520, 988], [980, 988], [1420, 988]].map(([x, y], i) => (
          <g key={`w${i}`}>
            <rect x={x} y={y} width={150} height={42} fill="#D6E6F0" />
            <rect x={x} y={y + (y < 100 ? 0 : 26)} width={150} height={16} fill="#FFFFFF" />
            <line x1={x + 75} x2={x + 75} y1={y} y2={y + 42} stroke="#6A4A2E" strokeWidth={5} />
            <rect x={x} y={y} width={150} height={42} fill="none" stroke="#5B3E26" strokeWidth={5} />
            <rect x={x - 10} y={y < 100 ? y + 42 : y - 70} width={170} height={70} fill="rgba(210,230,245,0.18)" />
          </g>
        ))}
        {/* puerta */}
        <rect x={60} y={500} width={42} height={120} fill="#CDA678" />
        <path d="M 102 500 A 120 120 0 0 1 222 620" fill="none" stroke="rgba(90,55,25,0.5)" strokeWidth={3} strokeDasharray="8 8" />
        <line x1={102} y1={500} x2={102} y2={620} stroke="#5B3E26" strokeWidth={7} />
        {/* mesas + bancos */}
        {TABLES_Y.map((ty, k) => (
          <g key={`t${k}`}>
            {[-1, 1].map((sd) => (
              <g key={sd}>
                <rect x={T_X0 + 10} y={ty + sd * (T_W / 2 + 34) - 18} width={T_X1 - T_X0 - 20} height={36} rx={4} fill="#9C6E40" />
                <rect x={T_X0 + 10} y={ty + sd * (T_W / 2 + 34) - 18} width={T_X1 - T_X0 - 20} height={10} rx={4} fill="rgba(255,230,190,0.18)" />
              </g>
            ))}
            <rect x={T_X0 + 6} y={ty - T_W / 2 + 10} width={T_X1 - T_X0} height={T_W} rx={6} fill="rgba(50,28,10,0.35)" />
            <rect x={T_X0} y={ty - T_W / 2} width={T_X1 - T_X0} height={T_W} rx={6} fill="url(#ckTable)" />
            {[1, 2].map((j) => <line key={j} x1={T_X0} x2={T_X1} y1={ty - T_W / 2 + j * (T_W / 3)} y2={ty - T_W / 2 + j * (T_W / 3)} stroke="rgba(80,45,15,0.45)" strokeWidth={2.5} />)}
            {/* cafeteras esmaltadas y jarros de melaza en el centro */}
            {[0.2, 0.5, 0.8].map((q, j) => {
              const cx = T_X0 + (T_X1 - T_X0) * q;
              return j === 1
                ? <g key={j}><circle cx={cx} cy={ty} r={20} fill="#6B4A2A" /><circle cx={cx} cy={ty} r={12} fill="#3A2412" /><circle cx={cx - 5} cy={ty - 6} r={4} fill="rgba(255,255,255,0.3)" /></g>
                : <g key={j}><circle cx={cx} cy={ty} r={24} fill={OLE.enamel} /><circle cx={cx} cy={ty} r={9} fill="#1E3F60" />{Array.from({ length: 7 }).map((__, q2) => <circle key={q2} cx={cx + (rnd(j * 17 + q2) - 0.5) * 36} cy={ty + (rnd(j * 31 + q2) - 0.5) * 36} r={1.8} fill={OLE.enamelFleck} opacity={0.8} />)}<path d={`M ${cx + 22} ${ty} l 18 -6`} stroke="#1E3F60" strokeWidth={6} strokeLinecap="round" /></g>;
            })}
          </g>
        ))}
        {/* platos */}
        {plates.map((p, i) => {
          const sAt = serveStart + p.order * every;
          const pp = spring({ frame: f - sAt * fps, fps, config: { damping: 11, stiffness: 170, mass: 0.6 } });
          const mugX = p.x + 44, mugY = p.y + p.side * 4;
          return (
            <g key={`p${i}`}>
              <ellipse cx={p.x + 3} cy={p.y + 5} rx={39} ry={37} fill="rgba(40,25,10,0.28)" />
              <circle cx={p.x} cy={p.y} r={38} fill="url(#ckTin)" />
              <circle cx={p.x} cy={p.y} r={29} fill="url(#ckTinIn)" stroke="rgba(90,98,104,0.5)" strokeWidth={1.5} />
              <g transform={`translate(${p.x} ${p.y})`}><BeansOnPlate p={pp} seed={i * 29 + 3} /></g>
              {pp > 0.05 && t - sAt < 2.2 ? <Steam x={p.x} y={p.y - 10} t={t - sAt} n={3} s={0.55} seed={i} /> : null}
              <circle cx={mugX} cy={mugY} r={12} fill={OLE.enamel} />
              <circle cx={mugX} cy={mugY} r={7.5} fill={pp > 0.5 ? "#3B2414" : "#1E3F60"} />
              <line x1={p.x - 46} x2={p.x - 46} y1={p.y - 22} y2={p.y + 22} stroke="#A8AFB3" strokeWidth={5} strokeLinecap="round" />
            </g>
          );
        })}
        {/* estufa del cocinero */}
        <g>
          <rect x={1548} y={336} width={236} height={320} rx={12} fill="rgba(30,15,5,0.35)" transform="translate(8 10)" />
          <rect x={1548} y={336} width={236} height={320} rx={12} fill="url(#ckIron)" />
          <rect x={1560} y={348} width={212} height={296} rx={8} fill="none" stroke="#5A544D" strokeWidth={3} />
          {[[1612, 410], [1720, 410]].map(([x, y], i) => (
            <g key={i}><circle cx={x} cy={y} r={40} fill="#26231F" stroke="#5E5750" strokeWidth={4} /><circle cx={x} cy={y} r={24} fill="none" stroke="#5E5750" strokeWidth={3} />
              <circle cx={x} cy={y} r={40} fill="rgba(255,120,40,0.25)" opacity={0.5 + 0.4 * Math.sin(t * 5 + i)} /></g>
          ))}
          {/* olla grande de porotos */}
          <circle cx={1666} cy={560} r={78} fill="#141312" />
          <circle cx={1666} cy={560} r={66} fill="#6E3A1E" />
          {Array.from({ length: 34 }).map((_, i) => { const a = rnd(500 + i) * 6.283, r = Math.sqrt(rnd(600 + i)) * 58; return <ellipse key={i} cx={1666 + Math.cos(a) * r} cy={560 + Math.sin(a) * r} rx={6} ry={3.8} transform={`rotate(${rnd(700 + i) * 180} ${1666 + Math.cos(a) * r} ${560 + Math.sin(a) * r})`} fill={i % 3 ? OLE.bean : OLE.beanL} />; })}
          <line x1={1700} y1={530} x2={1790} y2={470} stroke="#8A6A45" strokeWidth={9} strokeLinecap="round" />
          <circle cx={1694} cy={534} r={16} fill="#9AA1A5" />
          {/* caño de la estufa */}
          <circle cx={1760} cy={352} r={22} fill="#2A2724" stroke="#57504A" strokeWidth={4} />
          <Steam x={1666} y={540} t={t} n={7} s={1.3} seed={77} />
        </g>
        {/* leñera y bolsa de porotos */}
        <g>
          {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={1600 + (i % 3) * 44} y={720 + Math.floor(i / 3) * 34} width={40} height={30} rx={14} fill={i % 2 ? "#8C6239" : "#7A5230"} stroke="#5B3E26" strokeWidth={2} />)}
          <path d="M 1600 830 q 60 -30 120 0 q 20 50 -10 90 q -50 20 -100 0 q -30 -40 -10 -90 z" fill="#C9AE7E" stroke="#8F7447" strokeWidth={3} />
          <ellipse cx={1660} cy={835} rx={40} ry={14} fill={OLE.bean} />
        </g>
      </svg>
      {/* contador */}
      <div style={{ position: "absolute", left: 150, top: 22, opacity: cardIn, translate: `0 ${(1 - cardIn) * -60}px`, rotate: "-1deg", display: "flex", alignItems: "center", gap: 26,
        background: OLE.cream, padding: "12px 34px 12px 28px", borderRadius: 6, boxShadow: `0 16px 34px ${OLE.shadow}`, borderLeft: `8px solid ${OLE.fire}` }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 104, lineHeight: 1, color: OLE.forest, scale: String(bump), transformOrigin: "50% 70%", fontVariantNumeric: "tabular-nums", minWidth: 128, textAlign: "right" }}>{served}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 42, color: OLE.fire }}>/ {n}</div>
        </div>
        <div>
          <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 34, letterSpacing: 5, color: OLE.forest }}>{label}</div>
          {sub ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 36, color: OLE.pencil, marginTop: 0 }}>{sub}</div> : null}
        </div>
      </div>
      {stove ? (
        <div style={{ position: "absolute", left: 1500, top: 250, fontFamily: HAND, fontWeight: 700, fontSize: 42, color: OLE.forest, rotate: "-3deg", background: hexA(OLE.cream, 0.9), padding: "2px 16px", borderRadius: 4 }}>{stove}</div>
      ) : null}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────── MAPA ───────────────────────────────────────────
const PT = {
  bunk: { x: 590, y: 470, w: 280, h: 118 },
  cook: { x: 960, y: 560, w: 196, h: 128 },
  stable: { x: 700, y: 770, w: 250, h: 108 },
};
const HOLE = { x: 1232, y: 600 };

const Pine: React.FC<{ x: number; y: number; s: number; p: number }> = ({ x, y, s, p }) => (
  <g transform={`translate(${x} ${y}) scale(${s * p})`} opacity={p}>
    <path d="M 0 -26 L -11 -6 L -5 -6 L -15 10 L 15 10 L 5 -6 L 11 -6 Z" fill={hexA(OLE.forest, 0.22)} stroke={OLE.forest} strokeWidth={2.4} strokeLinejoin="round" />
    <line x1={0} y1={10} x2={0} y2={17} stroke={OLE.forest} strokeWidth={2.6} strokeLinecap="round" />
  </g>
);

const Building: React.FC<{ x: number; y: number; w: number; h: number; p: number; chimney?: boolean; t: number }> = ({ x, y, w, h, p, chimney, t }) => {
  const x0 = x - w / 2, y0 = y - h / 2;
  return (
    <g>
      <rect x={x0 + 6} y={y0 + 7} width={w} height={h} fill="rgba(80,50,20,0.14)" opacity={p} />
      <rect x={x0} y={y0} width={w} height={h} fill={hexA(OLE.kraft, 0.55)} opacity={p} />
      <rect x={x0} y={y0} width={w} height={h} fill="none" stroke={OLE.ironL} strokeWidth={3.4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      <line x1={x0} y1={y} x2={x0 + w} y2={y} stroke={OLE.ironL} strokeWidth={2.6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      {Array.from({ length: Math.floor(w / 18) }).map((_, i) => (
        <line key={i} x1={x0 + 9 + i * 18} x2={x0 + 9 + i * 18} y1={y0 + 4} y2={y0 + h - 4} stroke={hexA(OLE.ironL, 0.35)} strokeWidth={1.4} opacity={p} />
      ))}
      {chimney ? (
        <g opacity={p}>
          <rect x={x0 + w * 0.72} y={y0 + 10} width={16} height={16} fill={OLE.ironL} />
          {[0, 1, 2].map((i) => { const ph = (t * 0.5 + i / 3) % 1; return <circle key={i} cx={x0 + w * 0.72 + 8 + ph * 40} cy={y0 + 10 - ph * 40} r={6 + ph * 12} fill="none" stroke={hexA(OLE.pencil, 0.5 * (1 - ph))} strokeWidth={2} />; })}
        </g>
      ) : null}
    </g>
  );
};

export const OleCampMap: React.FC<{
  title?: string; sub?: string; bunk?: string; cook?: string; stable?: string; hole?: string; forest?: string; lake?: string;
  pathAt?: number; holeAt?: number; focus?: boolean; bed?: string;
}> = ({ title = "The Logging Camp", sub = "Northern Minnesota", bunk = "Bunkhouse", cook = "Cook shack", stable = "Stable", hole = "The bean hole", forest = "White pine", lake = "Frozen lake", pathAt, holeAt, focus = true }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const t = f / fps; const dur = durationInFrames / fps;
  const pA = pathAt ?? dur * 0.38; const hA = holeAt ?? Math.min(dur - 1.2, pA + Math.max(1.4, dur * 0.28));
  const ap = (at: number, len = 0.6) => interpolate(t, [at, at + len], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });

  const trees = React.useMemo(() => {
    const out: { x: number; y: number; s: number; d: number }[] = [];
    for (let i = 0; i < 420 && out.length < 190; i++) {
      const x = 90 + rnd(i * 3 + 1) * 1740, y = 90 + rnd(i * 3 + 2) * 900;
      const inClear = ((x - 900) / 520) ** 2 + ((y - 610) / 330) ** 2 < 1;
      const inLake = ((x - 1500) / 300) ** 2 + ((y - 270) / 190) ** 2 < 1;
      const inTitle = x < 640 && y > 830; const inCompass = x > 1620 && y > 780;
      if (inClear || inLake || inTitle || inCompass) continue;
      out.push({ x, y, s: 0.9 + rnd(i * 7) * 0.7, d: Math.hypot(x - 900, y - 610) });
    }
    return out.sort((a, b) => a.y - b.y);
  }, []);

  // recorrido: puerta del bunkhouse → cook shack → atrás, al pozo
  const pathD = `M ${PT.bunk.x + 60} ${PT.bunk.y + PT.bunk.h / 2 + 4} C ${PT.bunk.x + 100} ${PT.bunk.y + 150}, ${PT.cook.x - 150} ${PT.cook.y + 150}, ${PT.cook.x - 50} ${PT.cook.y + PT.cook.h / 2 + 42} S ${PT.cook.x + 150} ${PT.cook.y + 140}, ${HOLE.x - 58} ${HOLE.y + 26}`;
  const pathP = interpolate(t, [pA, pA + Math.max(1.2, (hA - pA) * 0.9)], [0, 1], { ...cl, easing: Easing.inOut(Easing.quad) });
  const holeP = spring({ frame: f - hA * fps, fps, config: { damping: 9, stiffness: 160 } });
  const circleP = interpolate(t, [hA + 0.25, hA + 0.9], [0, 1], cl);
  const zoom = focus ? interpolate(t, [hA - 0.4, hA + 1.6], [1, 1.32], { ...cl, easing: Easing.inOut(Easing.cubic) }) : 1;
  const ox = (HOLE.x - 960) * (zoom - 1) / zoom, oy = (HOLE.y - 540) * (zoom - 1) / zoom;

  const label = (txt: string, x: number, y: number, at: number, rot = -3, size = 44) => {
    const w = interpolate(t, [at, at + 0.7], [0, 100], cl);
    return (
      <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", rotate: `${rot}deg`, fontFamily: HAND, fontWeight: 700, fontSize: size, color: OLE.iron,
        whiteSpace: "nowrap", clipPath: `inset(-20px ${100 - w}% -20px -10px)`, textShadow: `0 0 8px ${OLE.kraftL}, 0 0 3px ${OLE.kraftL}` }}>{txt}</div>
    );
  };

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: OLE.kraft }}>
      <AbsoluteFill style={{ transform: `scale(${zoom}) translate(${-ox}px, ${-oy}px)`, transformOrigin: "50% 50%" }}>
        <AbsoluteFill style={{ ...kraftBg("#E4D0A6") }} />
        {/* bordes tostados del papel (marrón cálido, no negro) */}
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 62%, rgba(140,90,40,0.28) 92%, rgba(120,70,30,0.42) 100%)" }} />
        <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <filter id="mapInk" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={4} />
              <feDisplacementMap in="SourceGraphic" scale={4} />
            </filter>
            <pattern id="iceHatch" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
              <line x1="0" y1="0" x2="0" y2="22" stroke="rgba(47,93,138,0.28)" strokeWidth="2" />
            </pattern>
          </defs>
          <g filter="url(#mapInk)">
            {/* lago congelado */}
            <g opacity={ap(0.2, 0.8)}>
              <path d="M 1250 200 C 1320 110, 1560 90, 1700 150 C 1810 200, 1800 330, 1720 400 C 1640 470, 1420 470, 1330 420 C 1230 370, 1190 270, 1250 200 Z" fill="#DCE8EE" stroke={OLE.enamel} strokeWidth={3.5} />
              <path d="M 1250 200 C 1320 110, 1560 90, 1700 150 C 1810 200, 1800 330, 1720 400 C 1640 470, 1420 470, 1330 420 C 1230 370, 1190 270, 1250 200 Z" fill="url(#iceHatch)" />
              <path d="M 1380 260 l 60 30 l 30 -20 l 70 40 M 1470 290 l -10 60 M 1600 220 l -30 50 l 40 40" fill="none" stroke="rgba(47,93,138,0.6)" strokeWidth={2.2} />
            </g>
            {/* camino de tala que sale del campamento */}
            <path d="M 60 640 C 200 620, 300 560, 450 540" fill="none" stroke={OLE.ironL} strokeWidth={3} strokeDasharray="2 14" strokeLinecap="round" opacity={ap(0.5)} />
            <path d="M 60 668 C 200 650, 310 596, 452 574" fill="none" stroke={OLE.ironL} strokeWidth={3} strokeDasharray="2 14" strokeLinecap="round" opacity={ap(0.5)} />
            {/* bosque */}
            {trees.map((tr, i) => <Pine key={i} x={tr.x} y={tr.y} s={tr.s} p={ap(0.1 + (tr.d / 1100) * 0.9, 0.35)} />)}
            {/* edificios */}
            <Building {...PT.bunk} p={ap(0.6, 0.7)} t={t} />
            <Building {...PT.cook} p={ap(0.9, 0.7)} chimney t={t} />
            <Building {...PT.stable} p={ap(1.2, 0.7)} t={t} />
            {/* piedras alrededor del pozo */}
            <g opacity={ap(hA - 0.2, 0.4)}>{Array.from({ length: 11 }).map((_, i) => { const a = (i / 11) * Math.PI * 2; return <ellipse key={i} cx={HOLE.x + Math.cos(a) * 44} cy={HOLE.y + Math.sin(a) * 36} rx={9} ry={7} fill={hexA(OLE.ironL, 0.18)} stroke={OLE.ironL} strokeWidth={2} />; })}</g>
          </g>
          {/* recorrido punteado */}
          <path d={pathD} fill="none" stroke={OLE.plaid} strokeWidth={6} strokeLinecap="round" strokeDasharray="4 16"
            style={{ clipPath: "none" }} mask="url(#pathMask)" />
          <mask id="pathMask"><path d={pathD} fill="none" stroke="#fff" strokeWidth={14} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - pathP} /></mask>
          {/* el pozo: X + círculo */}
          <g transform={`translate(${HOLE.x} ${HOLE.y}) scale(${holeP})`} opacity={Math.min(1, holeP * 2)}>
            <path d="M -30 -32 L 32 30 M 30 -32 L -32 32" stroke={OLE.plaid} strokeWidth={11} strokeLinecap="round" />
          </g>
          <ellipse cx={HOLE.x} cy={HOLE.y} rx={70} ry={58} fill="none" stroke={OLE.fire} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - circleP} transform={`rotate(-12 ${HOLE.x} ${HOLE.y})`} />
          {/* rosa de los vientos */}
          <g transform="translate(1740 900)" opacity={ap(0.4)}>
            <circle r={62} fill="none" stroke={OLE.ironL} strokeWidth={2.4} />
            <path d="M 0 -76 L 12 0 L 0 76 L -12 0 Z" fill={hexA(OLE.ironL, 0.2)} stroke={OLE.ironL} strokeWidth={2.4} />
            <path d="M 0 -76 L 12 0 L -12 0 Z" fill={OLE.plaid} />
            <path d="M -76 0 L 0 10 L 76 0 L 0 -10 Z" fill="none" stroke={OLE.ironL} strokeWidth={2} />
            <text y={-88} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={30} fill={OLE.iron}>N</text>
          </g>
        </svg>
        {label(bunk, PT.bunk.x, PT.bunk.y - PT.bunk.h / 2 - 34, 0.9)}
        {label(cook, PT.cook.x - 10, PT.cook.y - PT.cook.h / 2 - 34, 1.2, 2)}
        {label(stable, PT.stable.x + PT.stable.w / 2 + 100, PT.stable.y + 6, 1.5, -2)}
        {label(forest, 300, 250, 0.8, -8, 40)}
        {label(lake, 1510, 280, 1.0, -4, 44)}
        {label(hole, HOLE.x + 40, HOLE.y + 100, hA + 0.5, -5, 54)}
      </AbsoluteFill>
      {/* cartela del título (fija) */}
      <div style={{ position: "absolute", left: 70, bottom: 64, opacity: ap(0.2), translate: `0 ${(1 - ap(0.2)) * 30}px`, background: OLE.paper, padding: "16px 30px 18px",
        border: `3px solid ${OLE.iron}`, outline: `2px solid ${OLE.iron}`, outlineOffset: 5, rotate: "-1deg", boxShadow: `0 10px 24px ${OLE.shadow}` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 54, color: OLE.forest, lineHeight: 1 }}>{title}</div>
        {sub ? <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 28, letterSpacing: 6, color: OLE.fire, marginTop: 8 }}>{sub.toUpperCase()}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
