import React from "react";
import { AbsoluteFill, spring, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Fredoka";
import { rnd, clamp } from "../soot/lib";
import MAPA from "./mapa.json";

// Kit de Soot v3: TODO en código (cero imágenes). Cielos por capas, colinas con paralaje, objetos,
// mapa de puntos real, chapitas y contadores. Paleta saturada de complementarios (vara del short de los zombies).
export const { fontFamily } = loadFont("normal", { weights: ["500", "600", "700"] });
export const FPS = 30;
export const C = {
  noche: "#1b1240", noche2: "#2d1b69", violeta: "#5b2bb5", lila: "#9b7bf0", teal: "#2ec4d6", lima: "#9be15d",
  rojo: "#e8344a", ambar: "#ffb020", naranja: "#ff7a3d", rosa: "#ff6f91", crema: "#fff3d6", oro: "#f7c548", tierra: "#c9773a",
};

export const ent = (t: number, t0: number, d = 0, cfg = { damping: 12, stiffness: 170 }) =>
  spring({ frame: Math.round((t - t0 - d) * FPS), fps: FPS, config: cfg });
export const prog = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

// ── escena: monta a sus hijos sólo en [t0, t1) y les aplica un empuje de cámara sorteado (in/out, foco 35-65 %)
export const Escena: React.FC<{ t: number; t0: number; t1: number; children: React.ReactNode; zoom?: number; seed?: number; fondo?: string }> = ({ t, t0, t1, children, zoom, seed, fondo = C.noche }) => {
  if (t < t0 || t >= t1) return null;
  const r = rnd(seed ?? Math.round(t0 * 1000) + 3);
  const vel = 0.018 + r() * 0.02;
  const amp = zoom ?? Math.min(0.16, vel * (t1 - t0));
  const dentro = r() < 0.5;
  const ox = 35 + r() * 30, oy = 35 + r() * 30;
  const u = interpolate(t, [t0, t1], [0, 1], { easing: Easing.inOut(Easing.sin) });
  const k = dentro ? u : 1 - u;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: fondo }}>
      <AbsoluteFill style={{ transformOrigin: `${ox}% ${oy}%`, transform: `scale(${1.04 + amp * k})` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── cielos
const CIELOS = {
  atardecer: ["#2d1b69", "#7a2f8f", "#e2557a", "#ff9a4d", "#ffd27a"],
  noche: ["#0e0a2a", "#1b1240", "#2d1b69", "#4a2f8f", "#6b48b8"],
  dia: ["#4fb3e8", "#78c8ee", "#a8dcf2", "#d6f0f7", "#fff3d6"],
  polvo: ["#c26a3a", "#e08a4a", "#f2ae62", "#f7c98a", "#fde3b4"],
  sangre: ["#1a0614", "#4a0f2a", "#8c1d34", "#d6423a", "#ff8a4d"],
};
export type Cielo = keyof typeof CIELOS;
export const Cielo: React.FC<{ tipo: Cielo }> = ({ tipo }) => {
  const s = CIELOS[tipo];
  return <AbsoluteFill style={{ background: `linear-gradient(180deg, ${s[0]} 0%, ${s[1]} 30%, ${s[2]} 55%, ${s[3]} 78%, ${s[4]} 100%)` }} />;
};
export const Estrellas: React.FC<{ t: number; n?: number; seed?: number; alto?: number }> = ({ t, n = 70, seed = 4, alto = 620 }) => {
  const r = rnd(seed);
  const e = Array.from({ length: n }, () => [r() * 1920, r() * alto, 1 + r() * 2.6, r() * 6]);
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      {e.map(([x, y, s, f], i) => <circle key={i} cx={x} cy={y} r={s} fill="#fff" opacity={0.45 + 0.45 * Math.sin(t * 2 + f)} />)}
    </svg>
  );
};
export const Astro: React.FC<{ x: number; y: number; r: number; luna?: boolean }> = ({ x, y, r, luna }) => (
  <svg style={{ position: "absolute", left: x - r * 3, top: y - r * 3 }} width={r * 6} height={r * 6}>
    <defs>
      <radialGradient id={`halo${x}${y}`}><stop offset="0.3" stopColor={luna ? "#fff6d8" : "#fff0b0"} stopOpacity={0.55} /><stop offset="1" stopColor={luna ? "#fff6d8" : "#ffb347"} stopOpacity={0} /></radialGradient>
    </defs>
    <circle cx={r * 3} cy={r * 3} r={r * 3} fill={`url(#halo${x}${y})`} />
    <circle cx={r * 3} cy={r * 3} r={r} fill={luna ? "#fff6d8" : "#fff0b0"} />
    {luna && <><circle cx={r * 2.7} cy={r * 2.8} r={r * 0.18} fill="#e8dcb4" /><circle cx={r * 3.35} cy={r * 3.3} r={r * 0.12} fill="#e8dcb4" /></>}
  </svg>
);
// colinas por capas: cada capa una curva suave sorteada; `dx` = paralaje en px (las de atrás se mueven menos)
export const Colinas: React.FC<{ capas: string[]; base?: number; dx?: number; seed?: number; alto?: number }> = ({ capas, base = 640, dx = 0, seed = 9, alto = 90 }) => (
  <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
    {capas.map((col, i) => {
      const r = rnd(seed + i * 17);
      const y0 = base + i * ((1080 - base) / (capas.length + 0.6));
      const desp = (dx * (i + 1)) / capas.length;
      const pts: string[] = [];
      for (let k = -2; k <= 26; k++) {
        const x = k * 90 - (desp % 180);
        pts.push(`${x},${y0 - (Math.sin(k * 0.55 + seed + i) * 0.5 + 0.5) * alto * (0.6 + r() * 0.5)}`);
      }
      return <polygon key={i} points={`-300,1080 ${pts.join(" ")} 2300,1080`} fill={col} strokeLinejoin="round" />;
    })}
  </svg>
);

// ── chapita (CORNELL · 2015 de la ref)
export const Chip: React.FC<{ t: number; t0: number; t1?: number; text: string; color?: string; x: number; y: number; size?: number; centro?: boolean; tinta?: string }> = ({ t, t0, t1 = 1e9, text, color = C.violeta, x, y, size = 62, centro, tinta = "#fff" }) => {
  if (t < t0 || t > t1 + 0.3) return null;
  const s = ent(t, t0, 0, { damping: 11, stiffness: 180 });
  const out = interpolate(t, [t1, t1 + 0.3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(${centro ? "-50%" : "0"}, -50%) scale(${s * out})`, transformOrigin: centro ? "center" : "left center", fontFamily, fontWeight: 700, fontSize: size, color: tinta, background: color, padding: `${size * 0.16}px ${size * 0.42}px`, borderRadius: size * 0.3, boxShadow: "0 8px 0 rgba(20,10,50,.35)", letterSpacing: 1, whiteSpace: "nowrap", lineHeight: 1.15 }}>
      {text}
    </div>
  );
};
// texto grande con contorno (títulos)
export const Grande: React.FC<{ t: number; t0: number; text: string; x?: number; y: number; size?: number; color?: string; borde?: string }> = ({ t, t0, text, x = 960, y, size = 150, color = C.crema, borde = C.noche }) => {
  if (t < t0) return null;
  const s = ent(t, t0, 0, { damping: 9, stiffness: 190 });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, fontFamily, fontWeight: 700, fontSize: size, color, WebkitTextStroke: `${size * 0.09}px ${borde}`, paintOrder: "stroke fill", whiteSpace: "nowrap", letterSpacing: 2, textShadow: `0 ${size * 0.07}px 0 ${borde}` }}>
      {text}
    </div>
  );
};

// ── mapa de puntos (tierra real de world-atlas, imperio c. 117 dibujado a mano)
const M = MAPA as { paso: number; pts: [number, number, number][]; lugares: { n: string; x: number; y: number }[] };
export const lugar = (n: string) => M.lugares.find((l) => l.n === n)!;
export const MapaPuntos: React.FC<{ t: number; enciende?: [number, number]; desde?: string; brillo?: string; pulsa?: string[]; t0Pulsa?: number }> = ({ t, enciende, desde = "ROME", brillo = C.ambar, pulsa = [], t0Pulsa = 0 }) => {
  const o = lugar(desde);
  const maxD = 1500;
  const u = enciende ? prog(t, enciende[0], enciende[1]) : 1;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, ${C.noche2} 0%, ${C.noche} 70%)` }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {M.pts.map(([x, y, imp], i) => {
          const d = Math.hypot(x - o.x, y - o.y) / maxD;
          const on = imp && u > d;
          const fresco = on ? clamp((u - d) * 12, 0, 1) : 0;
          return <circle key={i} cx={x} cy={y} r={on ? 3.6 + (1 - fresco) * 2.5 : 3.2} fill={on ? brillo : "#3d2d7a"} opacity={on ? 0.95 : 0.8} />;
        })}
        {pulsa.map((n, i) => {
          const l = lugar(n);
          const k = ((t - t0Pulsa - i * 0.25) % 1.4) / 1.4;
          if (t < t0Pulsa + i * 0.25) return null;
          return (
            <g key={n}>
              <circle cx={l.x} cy={l.y} r={14 + k * 60} fill="none" stroke={C.rojo} strokeWidth={5} opacity={1 - k} />
              <circle cx={l.x} cy={l.y} r={14} fill={C.rojo} stroke="#fff" strokeWidth={4} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ── objetos
export const Moneda: React.FC<{ x: number; y: number; r?: number; rot?: number }> = ({ x, y, r = 40, rot = 0 }) => (
  <svg style={{ position: "absolute", left: x - r, top: y - r, overflow: "visible" }} width={r * 2} height={r * 2}>
    <g transform={`rotate(${rot} ${r} ${r})`}>
      <ellipse cx={r} cy={r + r * 0.12} rx={r} ry={r} fill="#b87a14" />
      <circle cx={r} cy={r} r={r} fill={C.oro} />
      <circle cx={r} cy={r} r={r * 0.74} fill="none" stroke="#d99a1e" strokeWidth={r * 0.1} />
      <text x={r} y={r + r * 0.32} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={r * 0.9} fill="#b87a14">S</text>
      <path d={`M ${r * 0.45} ${r * 0.55} Q ${r * 0.7} ${r * 0.25} ${r * 1.1} ${r * 0.3}`} stroke="#fff6c8" strokeWidth={r * 0.12} fill="none" strokeLinecap="round" />
    </g>
  </svg>
);
export const Pan: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 90 * s, top: y - 60 * s, overflow: "visible" }} width={180 * s} height={120 * s} viewBox="0 0 180 120">
    <ellipse cx={90} cy={70} rx={86} ry={46} fill="#a8621f" />
    <ellipse cx={90} cy={62} rx={80} ry={40} fill="#d98a35" />
    {[-1, 0, 1].map((k) => <path key={k} d={`M ${70 + k * 40} 38 Q ${80 + k * 40} 62 ${72 + k * 40} 86`} stroke="#a8621f" strokeWidth={7} fill="none" strokeLinecap="round" />)}
    <path d="M 30 50 Q 60 30 100 32" stroke="#ffd08a" strokeWidth={8} fill="none" strokeLinecap="round" />
  </svg>
);
export const Bota: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 80 * s, top: y - 90 * s, overflow: "visible" }} width={160 * s} height={180 * s} viewBox="0 0 160 180">
    <path d="M 40 10 L 90 10 L 92 110 L 150 130 Q 160 160 140 168 L 30 168 Q 20 120 40 10 Z" fill="#7a4520" />
    {[30, 55, 80, 105].map((yy) => <line key={yy} x1={42} y1={yy} x2={90} y2={yy} stroke="#4a2810" strokeWidth={6} />)}
    <rect x={26} y={160} width={124} height={14} rx={6} fill="#3d220d" />
    {[50, 80, 110, 135].map((xx) => <circle key={xx} cx={xx} cy={176} r={5} fill="#c8ccd4" />)}
  </svg>
);
export const Tienda: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 140 * s, top: y - 150 * s, overflow: "visible" }} width={280 * s} height={160 * s} viewBox="0 0 280 160">
    <path d="M 10 150 L 140 10 L 270 150 Z" fill="#c9a36a" />
    <path d="M 140 10 L 270 150 L 180 150 Z" fill="#a8834e" />
    <path d="M 110 150 L 140 70 L 170 150 Z" fill="#5a3a1e" />
    <line x1={140} y1={10} x2={140} y2={-14} stroke="#5a3a1e" strokeWidth={6} />
  </svg>
);
export const Pergamino: React.FC<{ x: number; y: number; w: number; abre: number; lineas?: number; firma?: number; titulo?: string }> = ({ x, y, w, abre, lineas = 9, firma = 0, titulo }) => {
  const H = 640 * abre;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - H / 2 - 30 }}>
      <svg width={w} height={H + 60} style={{ overflow: "visible" }}>
        <rect x={20} y={30} width={w - 40} height={H} fill="#f6e3b4" />
        <rect x={20} y={30} width={22} height={H} fill="#e6cc92" />
        {titulo && abre > 0.4 && <text x={w / 2} y={100} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={54} fill="#7a3d14" opacity={clamp((abre - 0.4) * 3, 0, 1)}>{titulo}</text>}
        {Array.from({ length: lineas }, (_, i) => {
          const yy = 140 + i * 46;
          if (yy > H) return null;
          const r = rnd(i + 3);
          return <rect key={i} x={70} y={yy} width={(w - 160) * (0.55 + r() * 0.45)} height={12} rx={6} fill="#c79a5a" opacity={0.75} />;
        })}
        {firma > 0 && (
          <path d={`M 80 ${H - 30} q 30 -50 50 -10 t 40 0 q 20 -40 40 0 t 50 -10 q 30 20 70 -20`} stroke="#2b3a8f" strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={420} strokeDashoffset={420 * (1 - firma)} />
        )}
        <rect x={0} y={10} width={w} height={40} rx={20} fill="#c98f4a" />
        <rect x={0} y={H + 10} width={w} height={40} rx={20} fill="#c98f4a" />
        <rect x={10} y={16} width={w - 20} height={10} rx={5} fill="#e8b878" />
      </svg>
    </div>
  );
};
export const Aguila: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 160 * s, top: y - 120 * s, overflow: "visible" }} width={320 * s} height={600 * s} viewBox="0 0 320 600">
    <defs><linearGradient id="oro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff0a0" /><stop offset="0.45" stopColor="#f2b52e" /><stop offset="1" stopColor="#a8650f" /></linearGradient></defs>
    <rect x={150} y={150} width={20} height={460} fill="#7a4a22" />
    <path d="M 160 40 Q 120 70 130 110 L 20 40 Q 30 130 120 150 L 200 150 Q 290 130 300 40 L 190 110 Q 200 70 160 40 Z" fill="url(#oro)" />
    <circle cx={160} cy={60} r={22} fill="url(#oro)" />
    <path d="M 170 58 L 196 66 L 170 72 Z" fill="#a8650f" />
    <circle cx={164} cy={56} r={4} fill="#5a3008" />
    <rect x={110} y={150} width={100} height={22} rx={8} fill="url(#oro)" />
    <rect x={120} y={200} width={80} height={110} rx={6} fill="#c81d2e" />
    <text x={160} y={268} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={34} fill="#ffd77a">SPQR</text>
  </svg>
);
export const Casa: React.FC<{ x: number; y: number; s?: number; tono?: string; techo?: string; luz?: boolean }> = ({ x, y, s = 1, tono = "#e8b98a", techo = "#b5452c", luz }) => (
  <svg style={{ position: "absolute", left: x - 130 * s, top: y - 220 * s, overflow: "visible" }} width={260 * s} height={220 * s} viewBox="0 0 260 220">
    <rect x={20} y={90} width={220} height={130} fill={tono} />
    <rect x={160} y={90} width={80} height={130} fill="rgba(60,20,30,.18)" />
    <path d="M 0 96 L 130 20 L 260 96 Z" fill={techo} />
    <rect x={100} y={140} width={56} height={80} rx={26} fill="#5a3418" />
    <rect x={40} y={120} width={40} height={36} rx={6} fill={luz ? "#ffd27a" : "#5a3418"} />
    <rect x={182} y={120} width={40} height={36} rx={6} fill={luz ? "#ffd27a" : "#5a3418"} />
  </svg>
);
export const Mesa: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 520 }) => (
  <svg style={{ position: "absolute", left: x - w / 2, top: y, overflow: "visible" }} width={w} height={220}>
    <rect x={30} y={30} width={22} height={190} fill="#6b3a1f" />
    <rect x={w - 52} y={30} width={22} height={190} fill="#6b3a1f" />
    <rect x={0} y={0} width={w} height={40} rx={10} fill="#a8622c" />
    <rect x={0} y={30} width={w} height={14} fill="#7a4520" />
  </svg>
);
export const Pluma: React.FC = () => (
  <g transform="rotate(-30)">
    <path d="M 0 0 Q -30 -90 10 -170 Q 40 -90 6 0 Z" fill="#fff6e8" />
    <line x1={3} y1={0} x2={10} y2={-160} stroke="#c9b9a0" strokeWidth={4} />
    <line x1={3} y1={0} x2={0} y2={30} stroke="#2b2b2b" strokeWidth={5} strokeLinecap="round" />
  </g>
);
export const Palo: React.FC<{ largo?: number }> = ({ largo = 230 }) => (
  <g transform="rotate(-100)">
    <path d={`M -6 -40 Q 0 ${largo / 2} 4 ${largo}`} stroke="#6b3a1f" strokeWidth={16} fill="none" strokeLinecap="round" />
    {[0.25, 0.5, 0.75].map((k) => <circle key={k} cx={k * 3} cy={largo * k - 20} r={9} fill="#7d4a24" />)}
  </g>
);
export const Garrote: React.FC = () => (
  <g transform="rotate(-150)"><path d="M -5 -20 L 8 150 Q 30 170 10 190 Q -20 180 -14 150 Z" fill="currentColor" /></g>
);
export const Zzz: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <>
    {[0, 1, 2].map((i) => {
      const k = ((t * 0.6 + i / 3) % 1);
      return <div key={i} style={{ position: "absolute", left: x + k * 90, top: y - k * 160, fontFamily, fontWeight: 700, fontSize: 40 + k * 50, color: "#fff", opacity: Math.sin(k * Math.PI) }}>z</div>;
    })}
  </>
);
// grilla de 100 reclutas (ALIVE/LOST), del v2
const Fig: React.FC<{ c: string; s?: number }> = ({ c, s = 1 }) => (
  <svg width={26 * s} height={34 * s} viewBox="0 0 26 34"><circle cx={13} cy={7} r={6} fill={c} /><rect x={4} y={15} width={18} height={18} rx={8} fill={c} /></svg>
);
export const Grilla: React.FC<{ t: number; t0: number; de: number; a: number; tA: [number, number]; x?: number; y?: number; s?: number }> = ({ t, t0, de, a, tA, x = 960, y = 540, s = 1.6 }) => {
  const orden = React.useMemo(() => { const r = rnd(99); return Array.from({ length: 100 }, (_, i) => i).sort(() => r() - 0.5); }, []);
  if (t < t0) return null;
  const e = ent(t, t0, 0, { damping: 13, stiffness: 160 });
  const muertos = Math.round(interpolate(t, tA, [de, a], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const muerto = new Set(orden.slice(0, muertos));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${e})`, background: "rgba(27,18,64,.92)", borderRadius: 34, padding: "28px 30px 22px", boxShadow: "0 14px 0 rgba(10,5,30,.45)" }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(20, ${26 * s}px)`, gap: `${6 * s}px ${4 * s}px` }}>
        {Array.from({ length: 100 }, (_, i) => <Fig key={i} s={s} c={muerto.has(i) ? "#5d5a7a" : C.teal} />)}
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 18, fontFamily, fontWeight: 700, fontSize: 44 }}>
        <span style={{ background: C.teal, color: C.noche, padding: "4px 20px", borderRadius: 12 }}>ALIVE {100 - muertos}</span>
        <span style={{ background: "#5d5a7a", color: "#fff", padding: "4px 20px", borderRadius: 12 }}>LOST {muertos}</span>
      </div>
    </div>
  );
};
