// Escenas ilustradas 100 % código (SVG + React) para Suez: siluetas a contraluz con borde de luz,
// dunas en capas con profundidad, partículas de arena y cámara que nunca queda quieta.
// Nada de caras dibujadas: los personajes son siluetas (en código las caras quedan baratas).
import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";

export const clampX = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.65, 0, 0.35, 1);
const rmp = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], { ...clampX, easing: e });
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

type V = [number, number];
const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1]];
// ángulo en grados: 0 = hacia abajo, 90 = hacia adelante (+x), 180 = hacia arriba
const dirv = (a: number, len: number): V => [Math.sin((a * Math.PI) / 180) * len, Math.cos((a * Math.PI) / 180) * len];
const pts = (a: V[]) => a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
const line = (a: V[]) => "M" + a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("L");

// ───────── cielo, sol, dunas, pirámides ─────────
export const Sky: React.FC<{ id: string; stops: [number, string][]; sun?: { x: number; y: number; r: number; color: string; glow: string } }> = ({ id, stops, sun }) => (
  <>
    <defs>
      <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">{stops.map(([o, c], i) => <stop key={i} offset={o} stopColor={c} />)}</linearGradient>
      {sun && <radialGradient id={`glow${id}`}><stop offset="0" stopColor={sun.glow} stopOpacity={0.95} /><stop offset="0.25" stopColor={sun.glow} stopOpacity={0.45} /><stop offset="1" stopColor={sun.glow} stopOpacity={0} /></radialGradient>}
    </defs>
    <rect x={-400} y={-400} width={2720} height={1880} fill={`url(#sky${id})`} />
    {sun && <>
      <circle cx={sun.x} cy={sun.y} r={sun.r * 7} fill={`url(#glow${id})`} />
      <circle cx={sun.x} cy={sun.y} r={sun.r} fill={sun.color} />
    </>}
  </>
);

// cresta de duna suave (suma de senos, determinística)
export function dunePath(seed: number, baseY: number, amp: number, x0 = -500, x1 = 2420, step = 30) {
  const p: V[] = [];
  for (let x = x0; x <= x1; x += step) {
    const y = baseY - amp * (0.55 * Math.sin(x / 260 + seed) + 0.3 * Math.sin(x / 117 + seed * 2.3) + 0.15 * Math.sin(x / 61 + seed * 4.1));
    p.push([x, y]);
  }
  return line(p) + `L${x1},1600L${x0},1600Z`;
}
export const Dune: React.FC<{ id: string; seed: number; y: number; amp: number; top: string; bottom: string; dx?: number; haze?: number }> = ({ id, seed, y, amp, top, bottom, dx = 0, haze = 0 }) => (
  <g transform={`translate(${dx},0)`}>
    <defs><linearGradient id={`dn${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="0.5" stopColor={bottom} /></linearGradient></defs>
    <path d={dunePath(seed, y, amp)} fill={`url(#dn${id})`} />
    {haze > 0 && <path d={dunePath(seed, y, amp)} fill="#fff3dc" opacity={haze} />}
  </g>
);

export const Pyramid: React.FC<{ x: number; y: number; w: number; lit: string; shade: string; litLeft?: boolean }> = ({ x, y, w, lit, shade, litLeft }) => {
  const h = w * 0.62, ax = x + w * (litLeft ? 0.58 : 0.42);
  return (
    <g>
      <polygon points={pts([[x, y], [ax, y - h], [ax, y]])} fill={litLeft ? lit : shade} />
      <polygon points={pts([[ax, y], [ax, y - h], [x + w, y]])} fill={litLeft ? shade : lit} />
      {Array.from({ length: 7 }).map((_, i) => { const k = (i + 1) / 8; return <line key={i} x1={x + (ax - x) * k} y1={y - h * k} x2={x + w - (x + w - ax) * k} y2={y - h * k} stroke="#000" strokeOpacity={0.06} strokeWidth={2} />; })}
    </g>
  );
};

// esfinge recostada mirando a la izquierda, caja 1000×420 (base en y=420)
const SPHINX: V[] = [[1000, 420], [1000, 335], [975, 305], [880, 288], [600, 276], [500, 262], [478, 222], [470, 168], [455, 110], [430, 70], [390, 50], [345, 54], [318, 74], [306, 104], [300, 126], [284, 140], [290, 150], [286, 160], [294, 172], [288, 186], [306, 204], [330, 216], [345, 252], [338, 300], [318, 330], [140, 346], [70, 352], [42, 372], [40, 398], [60, 420]];
export const Sphinx: React.FC<{ x: number; y: number; s: number; fill: string; rim: string }> = ({ x, y, s, fill, rim }) => (
  <g transform={`translate(${x},${y - 420 * s}) scale(${s})`}>
    <polygon points={pts(SPHINX)} fill={rim} transform="translate(4,-3)" />
    <polygon points={pts(SPHINX)} fill={fill} />
    {/* rayas del nemes, apenas */}
    {[0, 1, 2, 3].map((i) => <line key={i} x1={455 - i * 4} y1={120 + i * 22} x2={480} y2={124 + i * 22} stroke={rim} strokeOpacity={0.18} strokeWidth={4} />)}
  </g>
);

// ───────── personaje: esqueleto con poses + vestuario ─────────
export type Pose = {
  lean?: number; head?: number;
  armF?: [number, number]; armB?: [number, number]; // [brazo, antebrazo] en grados absolutos
  legF?: [number, number]; legB?: [number, number];
};
export type Outfit = "pharaoh" | "worker" | "persian" | "napoleon" | "engineer" | "lesseps" | "soldier";
type Props = { x: number; y: number; s: number; dir?: 1 | -1; pose: Pose; outfit: Outfit; color: string; rim: string; rimDx?: number; tool?: "hoe" | "staff" | "banner" | "spear" | "basket" | "none"; toolBack?: boolean; f?: number; dropTool?: number };

function skeleton(p: Pose, s: number, dir: number, x: number, y: number) {
  const u = s, lean = p.lean ?? 0;
  const X = (v: V): V => [v[0] * dir, v[1]];
  const legF = p.legF ?? [8, 0], legB = p.legB ?? [-6, -2];
  // la cadera queda a 4 unidades del piso (piernas 2+2)
  const hip: V = [x, y - u * 3.85];
  const kneeF = add(hip, X(dirv(legF[0], u * 1.95))), footF = add(kneeF, X(dirv(legF[1], u * 1.95)));
  const kneeB = add(hip, X(dirv(legB[0], u * 1.95))), footB = add(kneeB, X(dirv(legB[1], u * 1.95)));
  const neck = add(hip, X(dirv(180 - lean, u * 2.75)));
  const sh = add(hip, X(dirv(180 - lean, u * 2.55)));
  const head = add(neck, X(dirv(180 - lean - (p.head ?? 0), u * 0.78)));
  const armF = p.armF ?? [10, 15], armB = p.armB ?? [-8, -4];
  const elF = add(sh, X(dirv(armF[0], u * 1.45))), haF = add(elF, X(dirv(armF[1], u * 1.35)));
  const elB = add(sh, X(dirv(armB[0], u * 1.45))), haB = add(elB, X(dirv(armB[1], u * 1.35)));
  const perp: V = X(dirv(90 - lean, 1));
  return { u, hip, kneeF, footF, kneeB, footB, neck, sh, head, elF, haF, elB, haB, perp, X };
}

const FigureShape: React.FC<Props & { fill: string }> = ({ x, y, s, dir = 1, pose, outfit, fill, tool = "none", toolBack, f = 0, dropTool = 0 }) => {
  const k0 = skeleton(pose, s, dir, x, y);
  const k = toolBack ? { ...k0, haF: k0.haB, elF: k0.elB, haB: k0.haF, elB: k0.elF } : k0;
  const { u, hip, sh, head, perp, X } = k;
  const fw = (a: V, b: V, w: number) => <path d={line([a, b])} stroke={fill} strokeWidth={w} strokeLinecap="round" fill="none" />;
  // segmento que se afina (cápsula de radios distintos)
  const taper = (a: V, b: V, r0: number, r1: number) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L;
    return (<g>
      <polygon points={pts([[a[0] + nx * r0, a[1] + ny * r0], [b[0] + nx * r1, b[1] + ny * r1], [b[0] - nx * r1, b[1] - ny * r1], [a[0] - nx * r0, a[1] - ny * r0]])} fill={fill} />
      <circle cx={a[0]} cy={a[1]} r={r0} fill={fill} /><circle cx={b[0]} cy={b[1]} r={r1} fill={fill} />
    </g>);
  };
  const boots = outfit === "napoleon" || outfit === "lesseps" || outfit === "engineer";
  const leg = (a: V, b: V, c: V) => (<>{taper(a, b, u * 0.36, u * 0.25)}{taper(b, c, boots ? u * 0.27 : u * 0.24, boots ? u * 0.2 : u * 0.13)}</>);
  const arm = (a: V, b: V, c: V) => (<>{taper(a, b, u * 0.24, u * 0.17)}{taper(b, c, u * 0.17, u * 0.11)}<circle cx={c[0]} cy={c[1]} r={u * 0.15} fill={fill} /></>);
  const limb = (a: V, b: V, c: V, w0: number) => (w0 > u * 0.5 ? leg(a, b, c) : arm(a, b, c));
  const foot = (a: V) => taper(add(a, X([-u * 0.08, -u * 0.05])), add(a, X([u * 0.5, u * 0.05])), u * (boots ? 0.2 : 0.14), u * 0.1);
  // torso: cadera -> cintura -> pecho -> hombros
  const up: V = [sh[0] - hip[0], sh[1] - hip[1]];
  const at = (kk: number, w: number, fwd = 0): V => [hip[0] + up[0] * kk + perp[0] * (w + fwd) * u, hip[1] + up[1] * kk + perp[1] * (w + fwd) * u];
  const wM = outfit === "worker" ? 0.92 : 1;
  const torso: V[] = [at(0, -0.42 * wM), at(0.35, -0.34 * wM), at(0.72, -0.44 * wM), at(0.97, -0.5 * wM), at(1.0, -0.2), at(1.0, 0.2), at(0.97, 0.52 * wM), at(0.72, 0.5 * wM, 0.06), at(0.38, 0.36 * wM), at(0, 0.44 * wM)];
  const shoulders = <><circle cx={at(0.93, -0.36)[0]} cy={at(0.93, -0.36)[1]} r={u * 0.26} fill={fill} /><circle cx={at(0.93, 0.36)[0]} cy={at(0.93, 0.36)[1]} r={u * 0.26} fill={fill} /></>;
  const H = (dx: number, dy: number): V => add(head, X([dx * u, dy * u]));
  const ground = y;
  // herramienta en la mano de adelante
  let toolEl: React.ReactNode = null;
  const fore = [k.haF[0] - k.elF[0], k.haF[1] - k.elF[1]], fl = Math.hypot(fore[0], fore[1]) || 1;
  const fd: V = [fore[0] / fl, fore[1] / fl];
  if (tool === "hoe") {
    const a = add(k.haF, [-fd[0] * u * 1.6, -fd[1] * u * 1.6]), b = add(k.haF, [fd[0] * u * 1.1, fd[1] * u * 1.1]);
    const blade = add(b, [fd[1] * u * 0.7 * dir, -fd[0] * u * 0.7 * dir]);
    const fall = dropTool;
    toolEl = (
      <g transform={fall > 0 ? `translate(${fall * u * 0.8 * dir},${fall * (ground - k.haF[1] - u * 0.3)}) rotate(${fall * 75 * dir},${k.haF[0]},${k.haF[1]})` : undefined}>
        {fw(a, b, u * 0.16)}
        <path d={line([b, blade])} stroke={fill} strokeWidth={u * 0.34} strokeLinecap="butt" />
      </g>
    );
  } else if (tool === "staff" || tool === "spear" || tool === "banner") {
    const top: V = [k.haF[0] + (tool === "staff" ? u * 0.15 * dir : 0), k.haF[1] - u * (tool === "banner" ? 5.2 : 3.6)];
    const bot: V = [k.haF[0], ground];
    toolEl = (
      <g>
        {fw(bot, top, u * 0.14)}
        {tool === "spear" && <polygon points={pts([add(top, [-u * 0.18, 0]), add(top, [0, -u * 0.8]), add(top, [u * 0.18, 0])])} fill={fill} />}
        {tool === "staff" && <circle cx={top[0]} cy={top[1]} r={u * 0.22} fill={fill} />}
        {tool === "banner" && (() => {
          const w = u * 3.2, h = u * 1.9, n = 10;
          const topEdge: V[] = Array.from({ length: n + 1 }).map((_, i) => [top[0] + dir * w * (i / n), top[1] + u * 0.2 + Math.sin(f / 5 + i * 0.7) * u * 0.18 * (i / n)]);
          const botEdge: V[] = topEdge.map(([px, py]) => [px, py + h]).reverse();
          return <polygon points={pts([...topEdge, ...botEdge])} fill={fill} />;
        })()}
      </g>
    );
  } else if (tool === "basket") {
    toolEl = <ellipse cx={head[0]} cy={head[1] - u * 0.75} rx={u * 0.8} ry={u * 0.38} fill={fill} />;
  }
  return (
    <g>
      {/* atrás: brazo y pierna */}
      {limb(k0.sh, k0.elB, k0.haB, u * 0.38)}
      {limb(hip, k.kneeB, k.footB, u * 0.62)}
      {foot(k.footB)}
      {/* ropa larga (detrás de las piernas de adelante) */}
      {outfit === "persian" && <polygon points={pts([add(sh, [perp[0] * -u * 0.85, perp[1] * -u * 0.85]), add(sh, [perp[0] * u * 0.85, perp[1] * u * 0.85]), [hip[0] + u * 1.15, ground - u * 0.15], [hip[0] - u * 1.15, ground - u * 0.15]])} fill={fill} />}
      {outfit === "lesseps" && <polygon points={pts([add(sh, X([-u * 0.65, 0])), add(sh, X([u * 0.6, 0])), add(hip, X([u * 0.75, u * 1.7])), add(hip, X([-u * 0.95, u * 1.9]))])} fill={fill} />}
      {limb(hip, k.kneeF, k.footF, u * 0.62)}
      {foot(k.footF)}
      <polygon points={pts(torso)} fill={fill} strokeLinejoin="round" stroke={fill} strokeWidth={u * 0.12} />
      {shoulders}
      {/* vestuario por personaje */}
      {(outfit === "pharaoh" || outfit === "worker") && (
        <polygon points={pts([add(hip, X([-u * 0.6, -u * 0.3])), add(hip, X([u * 0.62, -u * 0.3])), add(hip, X([u * (outfit === "pharaoh" ? 1.05 : 0.55), u * (outfit === "pharaoh" ? 1.7 : 1.0)])), add(hip, X([-u * 0.75, u * (outfit === "pharaoh" ? 1.6 : 0.9)]))])} fill={fill} />
      )}
      {outfit === "napoleon" && <polygon points={pts([add(hip, X([-u * 0.4, -u * 0.4])), add(hip, X([-u * 0.7, u * 1.6])), add(hip, X([-u * 1.25, u * 1.45])), add(hip, X([-u * 0.6, -u * 0.6]))])} fill={fill} />}
      {outfit === "soldier" && <polygon points={pts([add(hip, X([-u * 0.6, -u * 0.3])), add(hip, X([u * 0.6, -u * 0.3])), add(hip, X([u * 0.8, u * 1.3])), add(hip, X([-u * 0.8, u * 1.3]))])} fill={fill} />}
      {taper(k.neck, head, u * 0.2, u * 0.2)}
      <ellipse cx={head[0]} cy={head[1]} rx={u * 0.46} ry={u * 0.54} fill={fill} />
      <polygon points={pts([H(0.36, -0.12), H(0.6, 0.12), H(0.4, 0.2), H(0.42, 0.34), H(0.3, 0.5), H(0.1, 0.5)])} fill={fill} />
      {outfit === "pharaoh" && <>
        <polygon points={pts([H(-0.5, -0.62), H(0.38, -0.66), H(0.42, -0.2), H(0.18, 0.15), H(0.62, 1.35), H(-0.3, 1.35), H(-0.95, 1.1), H(-0.62, 0.1)])} fill={fill} />
        <polygon points={pts([H(-0.62, 0.6), H(-0.95, 1.1), H(-1.15, 1.9), H(-0.8, 1.9)])} fill={fill} />
        <path d={line([H(0.3, -0.62), H(0.5, -0.9)])} stroke={fill} strokeWidth={u * 0.12} strokeLinecap="round" />
        <polygon points={pts([H(0.22, 0.45), H(0.42, 0.45), H(0.4, 1.0), H(0.26, 1.0)])} fill={fill} />
      </>}
      {outfit === "persian" && <>
        <polygon points={pts([H(-0.48, -0.25), H(0.45, -0.25), H(0.55, -1.35), H(-0.58, -1.35)])} fill={fill} />
        <polygon points={pts([H(0.05, 0.3), H(0.55, 0.25), H(0.45, 1.15), H(0.0, 1.05)])} fill={fill} />
      </>}
      {outfit === "napoleon" && <ellipse cx={at(0.97, 0.45)[0]} cy={at(0.97, 0.45)[1]} rx={u * 0.42} ry={u * 0.16} fill={fill} />}
      {outfit === "napoleon" && <><path d={`M${H(-1.0, -0.05).join(",")} Q${H(-1.1, -1.35).join(",")} ${H(0, -1.42).join(",")} Q${H(1.1, -1.35).join(",")} ${H(1.0, -0.05).join(",")} Q${H(0, -0.38).join(",")} ${H(-1.0, -0.05).join(",")}Z`} fill={fill} /><circle cx={H(0.55, -0.75)[0]} cy={H(0.55, -0.75)[1]} r={u * 0.16} fill={fill} /></>}
      {outfit === "engineer" && <polygon points={pts([H(-0.85, -0.3), H(0.85, -0.3), H(0.5, -0.55), H(0.4, -0.95), H(-0.4, -0.95), H(-0.5, -0.55)])} fill={fill} />}
      {outfit === "lesseps" && <>
        <rect x={head[0] - u * 0.48} y={head[1] - u * 1.55} width={u * 0.96} height={u * 1.15} fill={fill} />
        <rect x={head[0] - u * 0.78} y={head[1] - u * 0.48} width={u * 1.56} height={u * 0.16} fill={fill} />
      </>}
      {outfit === "soldier" && <polygon points={pts([H(-0.5, -0.2), H(0.5, -0.2), H(0.3, -0.9), H(-0.3, -0.9)])} fill={fill} />}
      {/* adelante: brazo */}
      {limb(k0.sh, k0.elF, k0.haF, u * 0.38)}
      {toolEl}
    </g>
  );
};

// silueta con borde de luz del lado del sol + sombra larga en el piso
export const Figure: React.FC<Props & { shadow?: number }> = (p) => {
  const dx = p.rimDx ?? 3;
  return (
    <g>
      {(p.shadow ?? 0) > 0 && <ellipse cx={p.x - dx * p.s * 0.9} cy={p.y + p.s * 0.1} rx={p.s * (1 + Math.abs(dx) * 0.9)} ry={p.s * 0.28} fill="#000" opacity={p.shadow} style={{ filter: `blur(${p.s * 0.15}px)` }} />}
      <FigureShape {...p} fill={p.rim} />
      <g transform={`translate(${-dx * p.s * 0.06},${p.s * 0.035})`}><FigureShape {...p} fill={p.color} /></g>
    </g>
  );
};

// pose de excavar con azada: ciclo 0..1
export const digPose = (ph: number, amp = 1): Pose => {
  const c = (Math.sin(ph * Math.PI * 2) + 1) / 2 * amp; // 1 = arriba, 0 = golpe
  return { lean: 18 + 14 * (1 - c), head: -10, armF: [60 + 110 * c, 95 + 100 * c], armB: [45 + 100 * c, 85 + 95 * c], legF: [22, 4], legB: [-14, -6] };
};
export const walkPose = (ph: number): Pose => {
  const a = Math.sin(ph * Math.PI * 2) * 22;
  return { lean: 4, armF: [-a * 0.8, -a * 0.8 + 10], armB: [a * 0.8, a * 0.8 + 10], legF: [a, a > 0 ? a - 20 : a], legB: [-a, -a > 0 ? -a - 20 : -a] };
};

// partículas de arena llevadas por el viento
export const SandDrift: React.FC<{ f: number; n?: number; color?: string; speed?: number; y0?: number; y1?: number; op?: number }> = ({ f, n = 70, color = "#fff1d0", speed = 1, y0 = 500, y1 = 1080, op = 0.55 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const r = rnd(i), r2 = rnd(i + 99), r3 = rnd(i + 7);
      const x = ((r * 2200 + f * (3 + r2 * 9) * speed) % 2300) - 190;
      const y = y0 + r3 * (y1 - y0) + Math.sin(f / 9 + i) * 6;
      return <circle key={i} cx={x} cy={y} r={1 + r2 * 2.6} fill={color} opacity={op * (0.4 + r)} />;
    })}
  </g>
);

// cámara de la escena: empuje lento + deriva (nunca quieta)
export const SceneCam: React.FC<{ t: number; t0: number; t1: number; z0?: number; z1?: number; x0?: number; x1?: number; y0?: number; y1?: number; children: React.ReactNode }> = ({ t, t0, t1, z0 = 1, z1 = 1.08, x0 = 0, x1 = 0, y0 = 0, y1 = 0, children }) => {
  const k = interpolate(t, [t0, t1], [0, 1], clampX);
  const z = z0 + (z1 - z0) * k, x = x0 + (x1 - x0) * k, y = y0 + (y1 - y0) * k;
  return <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
    <g transform={`translate(960,540) scale(${z}) translate(${-960 + x},${-540 + y})`}>{children}</g>
  </svg>;
};

// ───────── máquina excavadora a vapor (rosario de cangilones, 1860s) ─────────
const gear = (cx: number, cy: number, r: number, teeth: number, rot: number) => {
  const p: V[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2 + rot;
    const rr = i % 2 ? r : r * 1.16;
    p.push([cx + Math.cos(a - 0.08) * rr, cy + Math.sin(a - 0.08) * rr], [cx + Math.cos(a + 0.08) * rr, cy + Math.sin(a + 0.08) * rr]);
  }
  return p;
};
export const Excavator: React.FC<{ x: number; y: number; s: number; f: number; color: string; rim: string; fire: string; smoke?: boolean }> = ({ x, y, s, f, color, rim, fire, smoke = true }) => {
  const rot = f / 9;
  // escalera inclinada del rosario: de arriba de la máquina al fondo de la zanja (hacia +x)
  const top: V = [180, -330], bot: V = [520, 40];
  const n = 12, L = Math.hypot(bot[0] - top[0], bot[1] - top[1]);
  const dir: V = [(bot[0] - top[0]) / L, (bot[1] - top[1]) / L], nrm: V = [dir[1], -dir[0]];
  const buckets = Array.from({ length: n }).map((_, i) => {
    const k = ((i / n + f / 160) % 1);
    const along = k * 2; // ida por arriba, vuelta por abajo
    const side = along < 1 ? 1 : -1, a = along < 1 ? along : 2 - along;
    return [top[0] + dir[0] * L * a + nrm[0] * 22 * side, top[1] + dir[1] * L * a + nrm[1] * 22 * side, side] as [number, number, number];
  });
  const body = (fill: string, off = 0) => (
    <g transform={`translate(${off},${-off * 0.6})`}>
      {/* carro sobre rieles */}
      <rect x={-260} y={-120} width={420} height={70} rx={8} fill={fill} />
      {[-200, -90, 30, 120].map((wx, i) => <circle key={i} cx={wx} cy={-40} r={42} fill={fill} />)}
      {/* caldera */}
      <rect x={-240} y={-260} width={300} height={140} rx={70} fill={fill} />
      <rect x={-215} y={-470} width={46} height={220} fill={fill} />
      <rect x={-232} y={-490} width={80} height={30} rx={6} fill={fill} />
      {/* casilla */}
      <rect x={60} y={-330} width={150} height={210} fill={fill} />
      <polygon points={pts([[40, -330], [230, -330], [200, -370], [70, -370]])} fill={fill} />
      {/* escalera */}
      <path d={line([top, bot])} stroke={fill} strokeWidth={30} />
      <path d={line([[top[0] + nrm[0] * 22, top[1] + nrm[1] * 22], [bot[0] + nrm[0] * 22, bot[1] + nrm[1] * 22]])} stroke={fill} strokeWidth={8} />
      <path d={line([[top[0] - nrm[0] * 22, top[1] - nrm[1] * 22], [bot[0] - nrm[0] * 22, bot[1] - nrm[1] * 22]])} stroke={fill} strokeWidth={8} />
      {buckets.map(([bx, by], i) => <rect key={i} x={bx - 20} y={by - 16} width={40} height={32} rx={5} fill={fill} transform={`rotate(${(Math.atan2(dir[1], dir[0]) * 180) / Math.PI},${bx},${by})`} />)}
      <polygon points={pts(gear(top[0], top[1], 62, 14, rot))} fill={fill} />
      <polygon points={pts(gear(-40, -190, 48, 11, -rot * 1.3))} fill={fill} />
      {/* volante con rayos */}
      <circle cx={130} cy={-210} r={70} fill="none" stroke={fill} strokeWidth={14} />
      {[0, 1, 2, 3, 4, 5].map((i) => { const a = rot * 1.6 + (i * Math.PI) / 3; return <line key={i} x1={130} y1={-210} x2={130 + Math.cos(a) * 66} y2={-210 + Math.sin(a) * 66} stroke={fill} strokeWidth={8} />; })}
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {smoke && Array.from({ length: 9 }).map((_, i) => {
        const k = ((f / 40 + i / 9) % 1);
        return <circle key={i} cx={-192 - k * 260 + Math.sin(i * 3 + f / 20) * 30} cy={-500 - k * 520} r={30 + k * 150} fill={i % 2 ? "#3d3430" : "#5b4d45"} opacity={0.75 * (1 - k)} style={{ filter: `blur(${6 + k * 20}px)` }} />;
      })}
      {body(rim, 6)}
      {body(color)}
      {/* fogón encendido */}
      <rect x={-235} y={-160} width={60} height={34} rx={6} fill={fire} opacity={0.85 + 0.15 * Math.sin(f / 2)} style={{ filter: "blur(2px)" }} />
      {/* tierra que cae de los cangilones */}
      {Array.from({ length: 10 }).map((_, i) => { const k = ((f / 12 + i / 10) % 1); return <circle key={i} cx={top[0] - 40 + rnd(i) * 30} cy={top[1] + k * 220} r={5 + rnd(i + 3) * 6} fill={rim} opacity={1 - k} />; })}
    </g>
  );
};

// ola de tormenta de arena: una banda de 2600 px que cruza de izquierda a derecha y tapa todo el cuadro
// entre ~45 % y ~59 % del recorrido (ahí se cambia la escena de atrás)
export const SandWall: React.FC<{ t: number; t0: number; t1: number; f: number }> = ({ t, t0, t1, f }) => {
  const k = interpolate(t, [t0, t1], [0, 1], clampX);
  if (k <= 0 || k >= 1) return null;
  const BW = 2600, front = -300 + k * 4900;
  const billow = (i: number, edge: number, spread: number) => {
    const r = rnd(i), r2 = rnd(i + 50);
    const y = -150 + r * 1380, size = 300 + r2 * 520;
    const x = edge + Math.sin(f / 14 + i) * 50 - r2 * spread;
    return <div key={i} style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: "50%", background: i % 3 ? "#d4aa6e" : "#bf9258", filter: `blur(${30 + r * 30}px)`, opacity: 0.92 }} />;
  };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: front - BW, top: -200, width: BW, height: 1480, background: "linear-gradient(90deg, rgba(207,162,104,0) 0%, #cfa268 16%, #c39558 55%, #cfa268 84%, rgba(207,162,104,0) 100%)" }} />
      {Array.from({ length: 22 }).map((_, i) => billow(i, front - 120, 380))}
      {Array.from({ length: 14 }).map((_, i) => billow(i + 40, front - BW + 260, -300))}
    </AbsoluteFill>
  );
};

// ───────── las cinco escenas ─────────
const DARK = "#24160e";

// 0) Amanecer: el faraón señala el horizonte
export const SceneDawn: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const px = interpolate(t, [0, 1.6], [0, -40], clampX);
  const arm = interpolate(t, [0.05, 0.6], [20, 92], { ...clampX, easing: Easing.out(Easing.back(1.6)) });
  return (
    <SceneCam t={t} t0={0} t1={1.6} z0={1.0} z1={1.07}>
      <Sky id="dawn" stops={[[0, "#2c2550"], [0.45, "#a9566a"], [0.7, "#ec8e5c"], [0.82, "#f7c47c"]]} sun={{ x: 1340, y: 690, r: 64, color: "#fff2c8", glow: "#ffcf86" }} />
      <g transform={`translate(${px * 0.2},0)`}>
        <Pyramid x={780} y={760} w={240} lit="#c4795a" shade="#8c4c46" litLeft={false} />
        <Pyramid x={1000} y={762} w={150} lit="#c4795a" shade="#8c4c46" litLeft={false} />
        <Dune id="d0a" seed={1.2} y={780} amp={22} top="#c77a59" bottom="#a05a4a" haze={0.12} />
      </g>
      <g transform={`translate(${px * 0.5},0)`}><Dune id="d0b" seed={3.1} y={860} amp={40} top="#9a5440" bottom="#6d3a30" /></g>
      <g transform={`translate(${px},0)`}>
        <Dune id="d0c" seed={5.7} y={960} amp={70} top="#4f2a22" bottom="#2a1712" />
        <Figure x={560} y={905} s={52} pose={{ lean: 2, head: 4, armF: [arm, arm + 2], armB: [-14, -4], legF: [10, 2], legB: [-8, -2] }} outfit="pharaoh" tool="staff" toolBack color={DARK} rim="#ffcf86" rimDx={-3} f={f} shadow={0.25} />
      </g>
      <SandDrift f={f} n={60} color="#ffd9a0" y0={700} y1={1080} op={0.45} />
    </SceneCam>
  );
};

// 1) Necho II: zanja en perspectiva, obreros con azada, el faraón frena la obra
const VP: V = [1180, 560];
const trench = (k0: number, k1: number, wNear = 700): V[] => {
  const near0: V = [380, 1180], near1: V = [380 + wNear, 1180];
  const lerp = (a: V, b: V, k: number): V => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  return [lerp(near0, VP, k0), lerp(near1, VP, k0), lerp(near1, VP, k1), lerp(near0, VP, k1)];
};
export const SceneNecho: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const dig = interpolate(t, [6.0, 7.45], [0.35, 0.72], { ...clampX, easing: Easing.out(Easing.quad) });
  const stop = rmp(t, 7.35, 7.7);
  const W = [[0.3, -1], [0.44, -1], [0.58, -1], [0.34, 1], [0.48, 1], [0.62, 1]] as const;
  return (
    <SceneCam t={t} t0={5.8} t1={8.95} z0={1.04} z1={1.12} x0={30} x1={-30}>
      <Sky id="necho" stops={[[0, "#8fb4c9"], [0.5, "#e8cfa2"], [0.52, "#f2dcb0"]]} sun={{ x: 1560, y: 150, r: 46, color: "#fffbe8", glow: "#fff1c4" }} />
      <Pyramid x={240} y={566} w={230} lit="#e9c48a" shade="#b88a5a" litLeft={false} />
      <Pyramid x={460} y={568} w={140} lit="#e9c48a" shade="#b88a5a" litLeft={false} />
      <Dune id="n1" seed={2.4} y={575} amp={14} top="#e4bf86" bottom="#d6aa6e" haze={0.25} />
      <rect x={-400} y={575} width={2720} height={700} fill="#d9ad70" />
      {/* zanja: borde lejano iluminado + fondo oscuro */}
      <polygon points={pts(trench(0, dig))} fill="#6b4426" />
      <polygon points={pts(trench(0, dig, 640).map(([x, y], i) => [x + (i === 0 || i === 3 ? 30 : 0), y] as V))} fill="#4a2c18" />
      <polygon points={pts([trench(0, dig)[1], trench(0, dig)[2], [trench(0, dig)[2][0] + 18, trench(0, dig)[2][1] + 2], [trench(0, dig)[1][0] + 60, 1180]])} fill="#b9844f" />
      {/* tierra sacada a los costados */}
      {Array.from({ length: 16 }).map((_, i) => { const k = 0.05 + i * 0.045; if (k > dig) return null; const p = trench(0, k)[3]; const q = trench(0, k)[2]; return <g key={i}><ellipse cx={p[0] - 40 * (1 - k)} cy={p[1] - 10} rx={70 * (1 - k * 0.8)} ry={22 * (1 - k * 0.8)} fill="#c99a5e" /><ellipse cx={q[0] + 50 * (1 - k)} cy={q[1] - 8} rx={70 * (1 - k * 0.8)} ry={22 * (1 - k * 0.8)} fill="#c99a5e" /></g>; })}
      {/* obreros a lo largo de la zanja, más chicos cuanto más lejos */}
      {W.map(([k, side], i) => {
        const tr = trench(0, k); const edge = side < 0 ? tr[3] : tr[2];
        const sc = 34 * (1 - k * 0.92);
        const ph = f / 22 + i * 0.37;
        const amp = 1 - stop;
        return <Figure key={i} x={edge[0] + side * sc * 1.2} y={edge[1]} s={sc} dir={side < 0 ? 1 : -1} pose={stop > 0.5 ? { lean: 4, armF: [12, 8], armB: [-10, -4] } : digPose(ph, amp)} outfit="worker" tool="hoe" color="#3a2416" rim="#fff1c6" rimDx={2} f={f} dropTool={rmp(t, 7.5 + i * 0.05, 7.85 + i * 0.05, Easing.in(Easing.quad))} shadow={0.22} />;
      })}
      {/* aguatero caminando */}
      <Figure x={interpolate(t, [5.8, 9], [560, 700])} y={720} s={22} dir={1} pose={walkPose(f / 26)} outfit="worker" tool="basket" color="#3a2416" rim="#fff1c6" rimDx={2} f={f} shadow={0.2} />
      {/* el faraón en su tarima, adelante a la derecha */}
      <polygon points={pts([[1420, 1000], [1840, 1000], [1880, 1090], [1380, 1090]])} fill="#8c6640" />
      <rect x={1420} y={985} width={420} height={18} fill="#b48a5a" />
      <Figure x={1610} y={990} s={44} dir={-1} pose={{ lean: 2, head: 2, armF: [interpolate(stop, [0, 1], [20, 150]), interpolate(stop, [0, 1], [25, 170])], armB: [-8, 10] }} outfit="pharaoh" tool="none" color={DARK} rim="#fff1c6" rimDx={2} f={f} shadow={0.25} />
      <Figure x={1760} y={990} s={36} dir={-1} pose={{ lean: 0, armF: [150, 175], armB: [-6, 4] }} outfit="soldier" tool="spear" color={DARK} rim="#fff1c6" rimDx={2} f={f} />
      <SandDrift f={f} n={45} color="#fff6dd" y0={600} y1={1080} op={0.4} />
    </SceneCam>
  );
};

// 2) Darío I: el canal con agua, el rey con su estandarte, un barco; después la arena lo traga
export const SceneDarius: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const water = interpolate(t, [9.0, 10.15], [0.0, 0.92], { ...clampX, easing: Easing.inOut(Easing.quad) });
  const bury = rmp(t, 10.7, 11.9);
  const tr = trench(0, 0.92);
  const lerp = (a: V, b: V, k: number): V => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  // el agua entra desde lejos (el mar) hacia la cámara
  const wq: V[] = [lerp(tr[0], tr[3], 1 - water), lerp(tr[1], tr[2], 1 - water), tr[2], tr[3]];
  const boatK = interpolate(t, [10.0, 12.5], [0.85, 0.55], clampX);
  const bp = lerp([680, 1180], VP, boatK), bs = 1 - boatK * 0.9;
  return (
    <SceneCam t={t} t0={8.8} t1={12.6} z0={1.05} z1={1.13} x0={-20} x1={25}>
      <Sky id="darius" stops={[[0, "#5f6e94"], [0.42, "#e59a62"], [0.52, "#f6d09a"]]} sun={{ x: 430, y: 470, r: 52, color: "#fff4d0", glow: "#ffd28c" }} />
      <Dune id="p1" seed={6.1} y={572} amp={16} top="#d39864" bottom="#c48852" haze={0.2} />
      <rect x={-400} y={575} width={2720} height={700} fill="#c98f58" />
      <polygon points={pts(trench(0, 0.92))} fill="#6b4426" />
      {water > 0 && <>
        <polygon points={pts(wq)} fill="#3c78ad" />
        {Array.from({ length: 14 }).map((_, i) => { const k = 0.08 + i * 0.06; if (k < 1 - water) return null; const a = lerp(tr[3], tr[0], 1 - k), b = lerp(tr[2], tr[1], 1 - k); const sh = Math.sin(f / 6 + i) * 20; return <line key={i} x1={a[0] + 40 + sh} y1={a[1]} x2={b[0] - 60 + sh} y2={b[1]} stroke="#cfe6ff" strokeOpacity={0.35} strokeWidth={3 * (1 - k * 0.8)} />; })}
      </>}
      {/* la arena se come el agua */}
      {bury > 0 && <polygon points={pts(trench(0, 0.92))} fill="#c98f58" opacity={bury} />}
      {/* barco con vela */}
      {t > 10.0 && (
        <g transform={`translate(${bp[0] + 260 * bs},${bp[1] - 6}) scale(${bs * 1.6})`} opacity={1 - bury}>
          <path d="M-90,0 Q0,40 90,0 L70,-14 L-70,-14 Z" fill={DARK} />
          <line x1={0} y1={-14} x2={0} y2={-150} stroke={DARK} strokeWidth={6} />
          <path d={`M4,-145 Q${70 + Math.sin(f / 8) * 6},-90 4,-30 Z`} fill="#f3e2c0" />
        </g>
      )}
      {/* soldados persas en la otra orilla */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => { const p = lerp(trench(0, 0.6)[2], trench(0, 0.6)[1], 0) as V; return <Figure key={i} x={p[0] + 80 + i * 46} y={p[1] - i * 2} s={15} dir={-1} pose={{ lean: 0, armF: [170, 178], armB: [-4, 2] }} outfit="soldier" tool="spear" color="#3a2416" rim="#ffd8a0" rimDx={-2} f={f} />; })}
      {/* el rey con su estandarte, adelante a la izquierda */}
      <Dune id="p2" seed={2.9} y={1010} amp={40} top="#7a4a2c" bottom="#4a2a18" />
      <Figure x={300} y={985} s={50} dir={1} pose={{ lean: 0, head: 3, armF: [150, 172], armB: [-4, 6] }} outfit="persian" tool="banner" color={DARK} rim="#ffd8a0" rimDx={-3} f={f} shadow={0.25} />
      <SandDrift f={f} n={80} color="#ffe2b0" y0={500} y1={1080} speed={1 + bury * 3} op={0.45 + bury * 0.3} />
    </SceneCam>
  );
};

// 3) Napoleón ante la Esfinge, al atardecer, con su ingeniero midiendo
export const SceneNapoleon: React.FC<{ t: number; f: number }> = ({ t, f }) => (
  <SceneCam t={t} t0={12.3} t1={17.2} z0={1.0} z1={1.1} x0={20} x1={-30}>
    <Sky id="napo" stops={[[0, "#3a2a52"], [0.4, "#b25a55"], [0.62, "#f09a5c"], [0.7, "#f8c27a"]]} sun={{ x: 1480, y: 700, r: 80, color: "#ffeec2", glow: "#ffc276" }} />
    <Pyramid x={1560} y={760} w={320} lit="#a8584c" shade="#6e3540" litLeft />
    <Pyramid x={1820} y={762} w={200} lit="#a8584c" shade="#6e3540" litLeft />
    <Dune id="s1" seed={4.4} y={770} amp={14} top="#9a5048" bottom="#7a3d3a" haze={0.1} />
    <Sphinx x={760} y={830} s={1.05} fill="#3a1f1c" rim="#ffc98a" />
    <Dune id="s2" seed={1.7} y={930} amp={30} top="#4d2a22" bottom="#2a1712" />
    {/* Napoleón con las manos atrás y el ingeniero con el nivel */}
    <Figure x={430} y={905} s={40} dir={1} pose={{ lean: -2, head: -6, armF: [-30, 40], armB: [-34, 36], legF: [6, 0], legB: [-6, 0] }} outfit="napoleon" color={DARK} rim="#ffc98a" rimDx={3} f={f} shadow={0.3} />
    <g>
      {/* trípode del nivel */}
      <line x1={640} y1={905} x2={600} y2={760} stroke={DARK} strokeWidth={7} />
      <line x1={590} y1={905} x2={600} y2={760} stroke={DARK} strokeWidth={7} />
      <line x1={560} y1={905} x2={600} y2={760} stroke={DARK} strokeWidth={7} />
      <rect x={570} y={738} width={70} height={24} rx={6} fill={DARK} />
      <rect x={630} y={744} width={22} height={12} fill={DARK} />
    </g>
    <Figure x={700} y={905} s={36} dir={-1} pose={{ lean: 22, head: -8, armF: [115, 100], armB: [95, 80], legF: [14, 0], legB: [-10, -4] }} outfit="engineer" color={DARK} rim="#ffc98a" rimDx={3} f={f} shadow={0.3} />
    <SandDrift f={f} n={50} color="#ffd9a0" y0={700} y1={1080} op={0.4} />
  </SceneCam>
);

// 4) Las máquinas a vapor muerden el desierto (1860s) y Lesseps mira
export const SceneSteam: React.FC<{ t: number; f: number; lesseps: number }> = ({ t, f, lesseps }) => (
  <SceneCam t={t} t0={16.9} t1={19.5} z0={1.0} z1={1.1} x0={-30} x1={30}>
    <Sky id="steam" stops={[[0, "#4a4048"], [0.45, "#a8705a"], [0.6, "#e4a466"], [0.66, "#f2c482"]]} sun={{ x: 520, y: 600, r: 56, color: "#fff0c8", glow: "#ffc77e" }} />
    <Dune id="e1" seed={3.3} y={640} amp={12} top="#b77b52" bottom="#a46a45" haze={0.15} />
    <rect x={-400} y={640} width={2720} height={700} fill="#b07548" />
    {/* el corte del canal, ancho y profundo */}
    <polygon points={pts([[200, 1180], [1700, 1180], [1080, 645], [900, 645]])} fill="#5e3a22" />
    <polygon points={pts([[200, 1180], [480, 1180], [960, 660], [900, 645]])} fill="#8a5a34" />
    <Excavator x={1360} y={760} s={0.42} f={f + 20} color="#2a1a14" rim="#ffc27a" fire="#ff7a2a" />
    <Excavator x={1110} y={690} s={0.22} f={f + 50} color="#3a2a22" rim="#e9a46a" fire="#ff7a2a" />
    <Excavator x={1500} y={1040} s={0.9} f={f} color="#1e130e" rim="#ffc27a" fire="#ff8a3a" />
    {/* obreros chiquitos */}
    {[0, 1, 2, 3].map((i) => <Figure key={i} x={720 + i * 60} y={860 + i * 18} s={14 + i * 2} dir={1} pose={digPose(f / 20 + i * 0.3)} outfit="worker" tool="hoe" color="#2a1a14" rim="#ffd29a" rimDx={-2} f={f} />)}
    {/* Ferdinand de Lesseps, adelante a la izquierda */}
    <g opacity={lesseps}>
      <Dune id="e2" seed={5.2} y={1050} amp={30} top="#4a2c1c" bottom="#24150e" />
      <Figure x={330} y={1030} s={48} dir={1} pose={{ lean: -2, head: 4, armF: [40, 70], armB: [-10, 8] }} outfit="lesseps" tool="staff" color={DARK} rim="#ffd29a" rimDx={-3} f={f} shadow={0.3} />
    </g>
    <SandDrift f={f} n={40} color="#ffd9a0" y0={700} y1={1080} op={0.35} />
  </SceneCam>
);
