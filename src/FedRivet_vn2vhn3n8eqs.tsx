/* ############################################################################
 * FED_RIVET — "EL REMACHE" de la pared cutánea
 *   Escena molecular multicapa (estilo After Effects) para el kit dark-cinematic
 *   Dr. Federer. Dos modos con la MISMA arquitectura de capas:
 *
 *     mode='rivet'    · ácido LINOLEICO. Las láminas lipídicas están opacas y
 *                       desordenadas. Entra volando desde la izquierda una
 *                       cadena zigzag con DOS dobles enlaces, girando, con
 *                       estela y motion blur. Se acopla al extremo libre de una
 *                       ceramida (cadena larga + cabeza polar) → CLICK: flash
 *                       dorado, onda expansiva, chispas, y las láminas se
 *                       ALINEAN de golpe y se encienden.
 *
 *     mode='disorder' · ácido OLEICO. Las mismas láminas, ordenadas. Entra una
 *                       cadena con UN solo doble enlace, más curva, que se
 *                       CLAVA entre las láminas y las EMPUJA: se separan, se
 *                       desalinean, pierden brillo y por los huecos se escapan
 *                       partículas. Flash frío en vez de dorado.
 *
 *   CAPAS
 *     L0  fondo por mood + wash + viñeta
 *     L1  bokeh grande de fondo (fuera de foco)
 *     L2  polvo / motas finas
 *     L3  resplandor de suelo bajo la pared
 *     L4  PARED: 4 láminas lipídicas en perspectiva 3D (div propio por lámina,
 *         gradiente de bicapa, colas, borde de luz y parallax propio)
 *     L5  ceramida receptora (SVG, draw-on por dasharray + cabeza polar)
 *     L6  cadena molecular viajera + estela fantasma + motion blur
 *     L7  flash + onda expansiva + chispas del acople
 *     L8  partículas que escapan por los huecos (modo disorder)
 *     L9  barrido de luz sobre la pared alineada (modo rivet)
 *     L10 placas de título / etiquetas con reveal por máscara
 *     L11 bokeh de primer plano + GrainOverlay
 *
 *   Todo procedural: cero imágenes externas, cero Math.random() (random('…')).
 * ########################################################################## */

import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  CLAMP,
  COOL_BLUE,
  DEFAULT_ACCENT,
  FED_SCENE_F,
  FED_WHIP_F,
  FONT_SANS,
  FONT_SERIF,
  GrainOverlay,
  MotesLayer,
  TEAL,
  TransitionShell,
  makeMotes,
  moodBg,
  rgba,
  shade,
  type FedMood,
} from './FedererKit';

/* ============================== CONTRATO ================================= */

export type FedRivetProps = {
  totalF?: number;
  accent?: string; // '#E9B44C'
  mood?: FedMood; // 'science'
  mode?: 'rivet' | 'disorder';
  title?: string;
  sub?: string;
  chainLabel?: string; // 'Ácido linoleico' | 'Ácido oleico'
  targetLabel?: string; // 'Ceramida'
  resultLabel?: string; // 'Acilceramida · el remache' | 'La pared filtra'
};

/* ========================= GEOMETRÍA MOLECULAR =========================== */

type Pt = {x: number; y: number};

/** Cadena zigzag de carbonos. `bend` arquea toda la cadena (cis = curvo). */
const buildChain = (n: number, step: number, amp: number, bend: number): Pt[] => {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const u = n > 1 ? i / (n - 1) : 0;
    pts.push({
      x: i * step,
      y: (i % 2 === 0 ? -amp : amp) + bend * Math.sin(u * Math.PI),
    });
  }
  return pts;
};

const polyLength = (pts: Pt[]): number => {
  let L = 0;
  for (let i = 1; i < pts.length; i++) {
    L += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  }
  return L;
};

const toPoints = (pts: Pt[]): string =>
  pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');

/** Doble enlace = segmento duplicado con offset perpendicular. */
const DoubleBond: React.FC<{
  a: Pt;
  b: Pt;
  color: string;
  w: number;
  off: number;
  opacity: number;
}> = ({a, b, color, w, off, opacity}) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const L = Math.hypot(dx, dy) || 1;
  const nx = (-dy / L) * off;
  const ny = (dx / L) * off;
  // el par se acorta hacia el centro del enlace: lectura química correcta
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const k = 0.74;
  const ax = mx - (dx / 2) * k;
  const ay = my - (dy / 2) * k;
  const bx = mx + (dx / 2) * k;
  const by = my + (dy / 2) * k;
  return (
    <g opacity={opacity}>
      <line
        x1={ax + nx}
        y1={ay + ny}
        x2={bx + nx}
        y2={by + ny}
        stroke={color}
        strokeWidth={w}
        strokeLinecap="round"
      />
      <line
        x1={ax - nx}
        y1={ay - ny}
        x2={bx - nx}
        y2={by - ny}
        stroke={color}
        strokeWidth={w}
        strokeLinecap="round"
      />
    </g>
  );
};

/** Cadena dibujada: halo + enlaces + dobles enlaces + átomos + cabezas. */
const Molecule: React.FC<{
  pts: Pt[];
  doubles: number[];
  color: string;
  hot: string;
  strokeW: number;
  nodeR: number;
  reveal: number; // 0..1 draw-on
  glow: number; // 0..1 intensidad del halo
  acidHead?: boolean; // extremo izquierdo = carboxilo (–COOH)
  polarHead?: boolean; // extremo derecho = cabeza polar (esfingosina)
  headTint?: string;
}> = ({
  pts,
  doubles,
  color,
  hot,
  strokeW,
  nodeR,
  reveal,
  glow,
  acidHead = false,
  polarHead = false,
  headTint = TEAL,
}) => {
  const len = React.useMemo(() => polyLength(pts), [pts]);
  const d = toPoints(pts);
  const first = pts[0];
  const last = pts[pts.length - 1];
  const dash = len * (1 - Math.max(0, Math.min(1, reveal)));

  const bonds = (
    <>
      <polyline
        points={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeW}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={len}
        strokeDashoffset={dash}
      />
      {doubles.map((k) =>
        k + 1 < pts.length ? (
          <DoubleBond
            key={`db-${k}`}
            a={pts[k]}
            b={pts[k + 1]}
            color={hot}
            w={strokeW * 0.72}
            off={strokeW * 1.02}
            opacity={interpolate(reveal, [k / pts.length, (k + 1.4) / pts.length], [0, 1], CLAMP)}
          />
        ) : null
      )}
    </>
  );

  return (
    <g>
      {/* halo blando (copia desenfocada) */}
      <g style={{filter: `blur(${(7 * glow + 2).toFixed(1)}px)`}} opacity={0.34 + 0.5 * glow}>
        <polyline
          points={d}
          fill="none"
          stroke={hot}
          strokeWidth={strokeW * 2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={len}
          strokeDashoffset={dash}
        />
      </g>

      {bonds}

      {/* átomos, encendidos progresivamente por el draw-on */}
      {pts.map((p, i) => {
        const on = Math.max(0, Math.min(1, reveal * (pts.length + 1) - i));
        if (on <= 0.01) return null;
        const r = nodeR * (i === 0 || i === pts.length - 1 ? 1.5 : 1) * (0.6 + 0.4 * on);
        return (
          <g key={`n-${i}`} opacity={on}>
            <circle cx={p.x} cy={p.y} r={r * 2.6} fill={rgba(hot, 0.16 * (0.4 + glow))} />
            <circle cx={p.x} cy={p.y} r={r} fill={color} />
            <circle cx={p.x - r * 0.3} cy={p.y - r * 0.34} r={r * 0.42} fill={rgba('#FFFFFF', 0.7)} />
          </g>
        );
      })}

      {/* –COOH: el extremo que se remacha */}
      {acidHead && (
        <g opacity={Math.max(0, Math.min(1, reveal * 2.2))}>
          <circle cx={first.x - nodeR * 2.6} cy={first.y - nodeR * 2.2} r={nodeR * 1.35} fill={hot} />
          <circle cx={first.x - nodeR * 3.1} cy={first.y + nodeR * 2.3} r={nodeR * 1.15} fill={rgba(hot, 0.72)} />
          <line
            x1={first.x}
            y1={first.y}
            x2={first.x - nodeR * 2.6}
            y2={first.y - nodeR * 2.2}
            stroke={hot}
            strokeWidth={strokeW * 0.8}
            strokeLinecap="round"
          />
          <line
            x1={first.x}
            y1={first.y}
            x2={first.x - nodeR * 3.1}
            y2={first.y + nodeR * 2.3}
            stroke={rgba(hot, 0.7)}
            strokeWidth={strokeW * 0.7}
            strokeLinecap="round"
          />
        </g>
      )}

      {/* cabeza polar de la ceramida */}
      {polarHead && (
        <g opacity={Math.max(0, Math.min(1, reveal * 1.25 - 0.2))}>
          <circle cx={last.x + nodeR * 3.4} cy={last.y} r={nodeR * 5.2} fill={rgba(headTint, 0.16)} />
          <circle
            cx={last.x + nodeR * 3.4}
            cy={last.y}
            r={nodeR * 2.7}
            fill={rgba(headTint, 0.5)}
            stroke={headTint}
            strokeWidth={strokeW * 0.6}
          />
          <circle cx={last.x + nodeR * 6.1} cy={last.y - nodeR * 2.7} r={nodeR * 1.1} fill={rgba(headTint, 0.8)} />
          <circle cx={last.x + nodeR * 6.4} cy={last.y + nodeR * 2.4} r={nodeR * 0.95} fill={rgba(headTint, 0.62)} />
          <line
            x1={last.x}
            y1={last.y}
            x2={last.x + nodeR * 3.4}
            y2={last.y}
            stroke={headTint}
            strokeWidth={strokeW * 0.85}
            strokeLinecap="round"
          />
        </g>
      )}
    </g>
  );
};

/* ============================ UNA LÁMINA ================================= */

const Lamella: React.FC<{
  i: number;
  n: number;
  w: number;
  h: number;
  z: number;
  dis: number; // 0 = alineada, 1 = desordenada
  tone: string;
  cold: boolean;
  px: number;
  py: number;
  shock: number; // 0..1 sacudida del impacto
}> = ({i, n, w, h, z, dis, tone, cold, px, py, shock}) => {
  const frame = useCurrentFrame();

  // firma de desorden propia e irrepetible por lámina
  const jx = (random(`lam-jx-${i}`) - 0.5) * 2;
  const jr = (random(`lam-jr-${i}`) - 0.5) * 2;
  const jy = (random(`lam-jy-${i}`) - 0.5) * 2;
  const bob = Math.sin(frame * (0.021 + i * 0.004) + i * 1.9);

  const offX = jx * 74 * dis + bob * 3.4;
  const rotZ = jr * 3.6 * dis + bob * 0.28;
  const rotY = jy * 5.5 * dis;
  const lift = jy * 9 * dis + shock * (i % 2 === 0 ? -7 : 7);

  // parallax propio: las de arriba se mueven más que las del fondo
  const par = 0.35 + (i / Math.max(1, n - 1)) * 0.95;

  const order = 1 - Math.max(0, Math.min(1, dis));
  const bright = 0.68 + 0.5 * order;
  const blur = 0.3 + 2.1 * (1 - order) + (1 - i / n) * 0.7;
  const sat = cold ? 0.6 + 0.25 * order : 0.75 + 0.45 * order;

  const edge = 0.22 + 0.55 * order;
  const base = shade(tone, 0.42);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: w,
        height: h,
        marginLeft: -w / 2,
        marginTop: -h / 2,
        transform: [
          `translateZ(${z.toFixed(1)}px)`,
          `translate(${(offX + px * par).toFixed(1)}px, ${(lift + py * par).toFixed(1)}px)`,
          `rotateZ(${rotZ.toFixed(2)}deg)`,
          `rotateY(${rotY.toFixed(2)}deg)`,
        ].join(' '),
        borderRadius: h * 0.42,
        filter: `blur(${blur.toFixed(2)}px) brightness(${bright.toFixed(2)}) saturate(${sat.toFixed(2)})`,
        boxShadow: [
          `0 ${(24 + i * 4).toFixed(0)}px ${(46 + i * 8).toFixed(0)}px rgba(0,0,0,0.62)`,
          `0 0 0 1px ${rgba(tone, 0.1 + 0.24 * order)}`,
          `0 0 ${(34 * order).toFixed(0)}px ${rgba(tone, 0.26 * order)}`,
        ].join(', '),
        background: [
          `linear-gradient(180deg, ${rgba(tone, 0.44 + 0.2 * order)} 0%, ${rgba(base, 0.95)} 38%, ${rgba(
            base,
            0.98
          )} 62%, ${rgba(tone, 0.36 + 0.18 * order)} 100%)`,
          'linear-gradient(90deg, rgba(2,5,10,0.9) 0%, transparent 12%, transparent 88%, rgba(2,5,10,0.9) 100%)',
        ].join(', '),
        overflow: 'hidden',
        willChange: 'transform, filter',
      }}
    >
      {/* colas lipídicas (empalizada) */}
      <div
        style={{
          position: 'absolute',
          inset: `${h * 0.2}px 0`,
          background: `repeating-linear-gradient(90deg, ${rgba(
            '#FFFFFF',
            0.05 + 0.09 * order
          )} 0 1.6px, transparent 1.6px 11px)`,
          opacity: 0.9,
        }}
      />
      {/* cabezas polares: dos filas de luz, arriba y abajo */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: h * 0.13,
          height: 2,
          background: `linear-gradient(90deg, transparent 2%, ${rgba(tone, edge)} 22%, ${rgba(
            '#FFFFFF',
            edge * 0.65
          )} 50%, ${rgba(tone, edge)} 78%, transparent 98%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: h * 0.13,
          height: 2,
          background: `linear-gradient(90deg, transparent 2%, ${rgba(tone, edge * 0.72)} 26%, ${rgba(
            tone,
            edge * 0.45
          )} 74%, transparent 98%)`,
        }}
      />
      {/* reflejo especular que corre con el orden */}
      <div
        style={{
          position: 'absolute',
          top: '-40%',
          bottom: '-40%',
          left: 0,
          width: '30%',
          transform: `translateX(${(-30 + ((frame * 0.9 + i * 90) % 420)).toFixed(0)}%) skewX(-18deg)`,
          background: `linear-gradient(100deg, transparent 20%, ${rgba(
            '#FFFFFF',
            0.05 + 0.1 * order
          )} 50%, transparent 80%)`,
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
};

/* ============================== ESCENA =================================== */

const N_LAM = 4;

export const FedRivet: React.FC<FedRivetProps> = ({
  totalF = FED_SCENE_F,
  accent = DEFAULT_ACCENT,
  mood = 'science',
  mode = 'rivet',
  title,
  sub,
  chainLabel,
  targetLabel,
  resultLabel,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const isRivet = mode === 'rivet';
  const tone = isRivet ? accent : COOL_BLUE;
  const hotCore = isRivet ? '#FFE9AE' : '#DDEBFF';

  /* ---- textos por defecto, dependientes del modo ---- */
  const T = title ?? (isRivet ? 'El remache de la pared' : 'El que abre los huecos');
  const SUB =
    sub ??
    (isRivet
      ? 'el cuerpo no lo fabrica: tiene que entrar de afuera'
      : 'potenciador de penetración: desordena las láminas');
  const CH = chainLabel ?? (isRivet ? 'Ácido linoleico' : 'Ácido oleico');
  const TG = targetLabel ?? 'Ceramida';
  const RS = resultLabel ?? (isRivet ? 'Acilceramida · el remache' : 'La pared filtra');

  /* ---- reloj de la escena, todo relativo a totalF ---- */
  const impactF = totalF * 0.55;
  const travelF = totalF * 0.1;
  const waveF = Math.max(16, totalF * 0.2);

  const tv = interpolate(frame, [travelF, impactF], [0, 1], CLAMP);

  /* ---- cámara: push-in + handheld (nada estático) ---- */
  const push = interpolate(frame, [0, totalF], [1, 1.062], CLAMP);
  const kick = interpolate(frame, [impactF - 1, impactF + 3, impactF + 12], [0, 1, 0], CLAMP);
  const hx = Math.sin(frame * 0.023) * width * 0.0024 + kick * width * 0.006;
  const hy = Math.cos(frame * 0.031) * height * 0.0019 - kick * height * 0.004;

  /* ---- mapeo del espacio de diseño 1920x1080 al lienzo real ---- */
  const S = height / 1080;
  const cx = width / 2;
  const cy = height / 2;
  const X = React.useCallback((v: number) => cx + (v - 960) * S, [cx, S]);
  const Y = React.useCallback((v: number) => cy + (v - 540) * S, [cy, S]);

  /* ---- estado de orden de la pared ---- */
  const snapRaw = spring({
    frame: frame - impactF,
    fps,
    config: {damping: 12, mass: 0.62, stiffness: 165},
  });
  const snap = Math.max(0, Math.min(1.14, snapRaw));
  // anticipación: la pared "toma aire" justo antes del golpe
  const antic = interpolate(frame, [impactF - 9, impactF], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.quad),
  });
  const dis = isRivet ? 1 - snap * 0.98 + antic * 0.06 : Math.min(1, snap * 0.96) * 1 - antic * 0.04;
  const disC = Math.max(0, Math.min(1.05, dis));
  const shock = kick * (isRivet ? 1 : 1.5);

  /* ---- separación de las láminas ---- */
  const gapBase = 76 * S;
  const gapExtra = (isRivet ? 12 * disC : 52 * disC) * S;

  /* ---- geometría de las moléculas ---- */
  const cer = React.useMemo(() => buildChain(22, 25, 10, -9), []);
  const fly = React.useMemo(
    () => (isRivet ? buildChain(17, 25, 11, 7) : buildChain(17, 26, 10, 30)),
    [isRivet]
  );
  const flyLastX = fly[fly.length - 1].x;
  const flyDoubles = isRivet ? [8, 11] : [8];

  /* ---- punto de acople ---- */
  const dockX = isRivet ? 985 : 900;
  const dockY = isRivet ? 398 : 636;

  /* ---- trayectoria de la cadena viajera (3 tiempos: vuela · apunta · clava) ---- */
  const posAt = React.useCallback(
    (f: number) => {
      const t = interpolate(f, [travelF, impactF], [0, 1], CLAMP);
      const p1 = interpolate(t, [0, 0.6], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
      const p2 = interpolate(t, [0.6, 0.86], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.sin)});
      const p3 = interpolate(t, [0.86, 1], [0, 1], {...CLAMP, easing: Easing.in(Easing.cubic)});
      const startX = -520;
      const startY = isRivet ? dockY + 120 : dockY - 260;
      const x = startX + (dockX - 235 - startX) * p1 + 46 * p2 + 189 * p3;
      const arc = Math.sin(p1 * Math.PI) * (isRivet ? -74 : 58);
      const y = startY + (dockY - startY) * (0.72 * p1 + 0.1 * p2 + 0.18 * p3) + arc;
      const rot =
        -455 * (1 - p1) +
        7.5 * Math.sin(f * 0.36) * p1 * (1 - p3) +
        (isRivet ? 0 : 38 * p3);
      const tiltY = 62 * (1 - p1) * (1 - p3);
      return {x, y, rot, tiltY, p1, p2, p3, t};
    },
    [travelF, impactF, isRivet, dockX, dockY]
  );

  const now = posAt(frame);
  const prev = posAt(frame - 1);
  const speed = Math.hypot(now.x - prev.x, now.y - prev.y);
  const mBlur = Math.min(11, speed * 0.16);

  const flying = frame >= travelF - 2;
  const docked = frame >= impactF;

  /* ---- flash + onda expansiva ---- */
  const flash = docked ? Math.exp(-(frame - impactF) / (waveF * 0.3)) : 0;
  const wave = interpolate(frame, [impactF, impactF + waveF], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const wave2 = interpolate(frame, [impactF + waveF * 0.28, impactF + waveF * 1.5], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  /* ---- reveals de texto (máscara clipPath) ---- */
  const platoP = interpolate(frame, [FED_WHIP_F * 0.4, totalF * 0.24], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const tgP = interpolate(frame, [totalF * 0.14, totalF * 0.34], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const chP =
    interpolate(frame, [travelF + 3, travelF + 13], [0, 1], CLAMP) *
    (1 - interpolate(frame, [impactF - 7, impactF], [0, 1], CLAMP));
  const resP = interpolate(frame, [impactF + 3, impactF + Math.max(12, totalF * 0.13)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const cerReveal = interpolate(frame, [totalF * 0.05, totalF * 0.36], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  /* ---- partículas y bokeh ---- */
  const dust = React.useMemo(() => makeMotes(20, 'rivet-dust', 2, 6, 0.035, 0.085, 0.1, 0.3), []);
  const bokeh = React.useMemo(() => makeMotes(5, 'rivet-bok', 120, 250, 0.008, 0.022, 0.05, 0.12), []);
  const fgBokeh = React.useMemo(() => makeMotes(3, 'rivet-fg', 160, 300, 0.006, 0.016, 0.04, 0.09), []);

  const sparks = React.useMemo(
    () =>
      new Array(18).fill(0).map((_, i) => ({
        a: random(`spark-a-${i}`) * Math.PI * 2,
        d: 90 + random(`spark-d-${i}`) * 230,
        s: 2.6 + random(`spark-s-${i}`) * 5,
        lag: random(`spark-l-${i}`) * 0.28,
      })),
    []
  );
  const leaks = React.useMemo(
    () =>
      new Array(30).fill(0).map((_, i) => ({
        x: 260 + random(`leak-x-${i}`) * 1380,
        gap: Math.floor(random(`leak-g-${i}`) * N_LAM),
        rise: 120 + random(`leak-r-${i}`) * 300,
        drift: (random(`leak-d-${i}`) - 0.5) * 150,
        s: 2 + random(`leak-s-${i}`) * 5.5,
        lag: random(`leak-l-${i}`) * 0.55,
        sp: 0.6 + random(`leak-sp-${i}`) * 0.9,
      })),
    []
  );

  /* ---- barrido de luz sobre la pared alineada ---- */
  const sweepP = interpolate(frame, [impactF + 2, impactF + Math.max(22, totalF * 0.3)], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.quad),
  });
  const sweepA = Math.sin(sweepP * Math.PI) * (isRivet ? 1 : 0.35);

  const camStyle: React.CSSProperties = {
    transform: `translate(${hx.toFixed(1)}px, ${hy.toFixed(1)}px) scale(${push.toFixed(4)})`,
  };

  const molScale = S * 1.02;

  return (
    <AbsoluteFill style={{background: '#03060b', overflow: 'hidden'}}>
      <TransitionShell accent={tone} totalF={totalF}>
        {/* L0 · fondo por mood + wash + viñeta ---------------------------- */}
        <AbsoluteFill style={{background: moodBg(mood, tone)}} />
        <AbsoluteFill
          style={{
            background: [
              `radial-gradient(52% 44% at ${((X(dockX) / width) * 100).toFixed(1)}% ${(
                (Y(dockY) / height) *
                100
              ).toFixed(1)}%, ${rgba(tone, 0.12 + 0.16 * flash)} 0%, transparent 66%)`,
              'radial-gradient(122% 100% at 50% 46%, transparent 40%, rgba(1,3,8,0.9) 100%)',
              'linear-gradient(to bottom, rgba(2,4,10,0.55), transparent 24%, transparent 74%, rgba(2,4,10,0.6))',
            ].join(', '),
          }}
        />

        {/* L1 · bokeh de fondo -------------------------------------------- */}
        <AbsoluteFill style={{...camStyle, opacity: 0.75}}>
          <MotesLayer
            motes={bokeh}
            blur={16}
            scale={S}
            tint={isRivet ? '240, 205, 145' : '150, 185, 235'}
          />
        </AbsoluteFill>

        {/* L2 · polvo ------------------------------------------------------ */}
        <AbsoluteFill style={camStyle}>
          <MotesLayer
            motes={dust}
            blur={1.3}
            scale={S}
            tint={isRivet ? '236, 212, 162' : '176, 202, 238'}
          />
        </AbsoluteFill>

        {/* L3 · resplandor de suelo bajo la pared -------------------------- */}
        <AbsoluteFill style={camStyle}>
          <div
            style={{
              position: 'absolute',
              left: X(290),
              top: Y(700),
              width: 1360 * S,
              height: 290 * S,
              background: `radial-gradient(50% 50% at 50% 50%, ${rgba(
                tone,
                0.1 + 0.26 * (1 - Math.min(1, disC))
              )} 0%, transparent 72%)`,
              filter: 'blur(26px)',
            }}
          />
        </AbsoluteFill>

        {/* L4 · PARED: láminas lipídicas en 3D ----------------------------- */}
        <AbsoluteFill
          style={{
            ...camStyle,
            perspective: 2300 * S,
            perspectiveOrigin: '50% 50%',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: cx,
              top: Y(716),
              width: 0,
              height: 0,
              transformStyle: 'preserve-3d',
              transform: [
                `rotateX(${(50 - 4 * (1 - Math.min(1, disC)) + shock * 1.6).toFixed(2)}deg)`,
                `rotateZ(${(-1.2 + Math.sin(frame * 0.017) * 0.4 + disC * 0.9).toFixed(2)}deg)`,
              ].join(' '),
            }}
          >
            {new Array(N_LAM).fill(0).map((_, i) => (
              <Lamella
                key={`lam-${i}`}
                i={i}
                n={N_LAM}
                w={1400 * S}
                h={66 * S}
                z={(i - (N_LAM - 1) / 2) * (gapBase + gapExtra)}
                dis={disC}
                tone={tone}
                cold={!isRivet}
                px={Math.sin(frame * 0.019 + i) * 4 * S}
                py={Math.cos(frame * 0.024 + i * 0.8) * 3 * S}
                shock={shock}
              />
            ))}
          </div>
        </AbsoluteFill>

        {/* L5 · ceramida receptora ----------------------------------------- */}
        <AbsoluteFill style={camStyle}>
          <svg
            style={{
              position: 'absolute',
              left: X(985),
              top: Y(398),
              overflow: 'visible',
              transform: `scale(${molScale.toFixed(3)}) translateY(${(
                Math.sin(frame * 0.028) * 4
              ).toFixed(1)}px)`,
              filter: `drop-shadow(0 12px 26px rgba(0,0,0,0.7)) brightness(${(
                1 + (isRivet ? 0.5 : 0.06) * flash
              ).toFixed(2)})`,
              opacity: isRivet ? 1 : 0.66,
            }}
          >
            <Molecule
              pts={cer}
              doubles={[1]}
              color={isRivet ? '#DCD3C2' : '#B9C6DA'}
              hot={isRivet ? accent : COOL_BLUE}
              strokeW={5}
              nodeR={4.6}
              reveal={cerReveal}
              glow={isRivet ? 0.25 + 0.75 * Math.max(0, snap) : 0.14}
              polarHead
              headTint={TEAL}
            />
          </svg>
        </AbsoluteFill>

        {/* L6 · cadena viajera + estela + motion blur ----------------------- */}
        {flying && (
          <AbsoluteFill style={camStyle}>
            {/* estela: 4 fantasmas atrás en el tiempo */}
            {[4, 3, 2, 1].map((k) => {
              const g = posAt(frame - k * 1.7);
              const gh = 0.055 * (5 - k) * Math.min(1, speed / 9) * (docked ? 0 : 1);
              if (gh <= 0.004) return null;
              return (
                <svg
                  key={`gh-${k}`}
                  style={{
                    position: 'absolute',
                    left: X(g.x),
                    top: Y(g.y),
                    overflow: 'visible',
                    opacity: gh,
                    filter: `blur(${(2 + k * 2.4).toFixed(1)}px)`,
                    transform: `scale(${molScale.toFixed(3)}) rotate(${g.rot.toFixed(1)}deg)`,
                    mixBlendMode: 'screen',
                  }}
                >
                  <g transform={`translate(${-flyLastX},0)`}>
                    <polyline
                      points={toPoints(fly)}
                      fill="none"
                      stroke={hotCore}
                      strokeWidth={7}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              );
            })}

            {/* cola de velocidad */}
            {!docked && speed > 3 && (
              <div
                style={{
                  position: 'absolute',
                  left: X(now.x) - 470 * S,
                  top: Y(now.y) - 26 * S,
                  width: 470 * S,
                  height: 52 * S,
                  background: `linear-gradient(90deg, transparent 0%, ${rgba(
                    tone,
                    0.26 * Math.min(1, speed / 16)
                  )} 78%, ${rgba(hotCore, 0.4 * Math.min(1, speed / 16))} 100%)`,
                  filter: 'blur(13px)',
                  mixBlendMode: 'screen',
                  transform: `rotate(${(now.rot * 0.02).toFixed(2)}deg)`,
                }}
              />
            )}

            <svg
              style={{
                position: 'absolute',
                left: X(now.x),
                top: Y(now.y),
                overflow: 'visible',
                transform: [
                  `scale(${molScale.toFixed(3)})`,
                  `rotate(${now.rot.toFixed(2)}deg)`,
                  `perspective(600px) rotateY(${now.tiltY.toFixed(2)}deg)`,
                ].join(' '),
                filter: `blur(${mBlur.toFixed(2)}px) drop-shadow(0 14px 30px rgba(0,0,0,0.72)) brightness(${(
                  1 + 0.7 * flash
                ).toFixed(2)})`,
              }}
            >
              <g transform={`translate(${-flyLastX},0)`}>
                <Molecule
                  pts={fly}
                  doubles={flyDoubles}
                  color={isRivet ? '#F2E7CE' : '#CBDCF4'}
                  hot={hotCore}
                  strokeW={6}
                  nodeR={5.2}
                  reveal={1}
                  glow={0.35 + 0.65 * Math.min(1, speed / 14) + 0.8 * flash}
                  acidHead
                />
              </g>
            </svg>
          </AbsoluteFill>
        )}

        {/* L7 · flash + onda expansiva + chispas ---------------------------- */}
        {docked && (
          <AbsoluteFill style={{...camStyle, pointerEvents: 'none'}}>
            {/* núcleo del flash */}
            <div
              style={{
                position: 'absolute',
                left: X(dockX) - 380 * S,
                top: Y(dockY) - 380 * S,
                width: 760 * S,
                height: 760 * S,
                borderRadius: '50%',
                background: `radial-gradient(50% 50% at 50% 50%, ${rgba(
                  hotCore,
                  0.9 * flash
                )} 0%, ${rgba(tone, 0.5 * flash)} 24%, transparent 66%)`,
                mixBlendMode: 'screen',
                filter: 'blur(6px)',
              }}
            />
            {/* destello anamórfico horizontal */}
            <div
              style={{
                position: 'absolute',
                left: X(dockX) - 620 * S,
                top: Y(dockY) - 5 * S,
                width: 1240 * S,
                height: 10 * S,
                background: `linear-gradient(90deg, transparent, ${rgba(hotCore, 0.85 * flash)}, transparent)`,
                filter: `blur(${(5 * S).toFixed(1)}px)`,
                mixBlendMode: 'screen',
              }}
            />
            {/* onda expansiva 1 */}
            {wave < 1 && (
              <div
                style={{
                  position: 'absolute',
                  left: X(dockX) - 520 * S * wave,
                  top: Y(dockY) - 520 * S * wave * 0.52,
                  width: 1040 * S * wave,
                  height: 1040 * S * wave * 0.52,
                  borderRadius: '50%',
                  border: `${Math.max(1, 5 * (1 - wave)) * S}px solid ${rgba(tone, 0.7 * (1 - wave))}`,
                  boxShadow: `0 0 ${40 * (1 - wave)}px ${rgba(tone, 0.4 * (1 - wave))}`,
                  filter: `blur(${(1.5 + 4 * wave).toFixed(1)}px)`,
                  mixBlendMode: 'screen',
                }}
              />
            )}
            {/* onda expansiva 2 (retrasada) */}
            {wave2 > 0 && wave2 < 1 && (
              <div
                style={{
                  position: 'absolute',
                  left: X(dockX) - 640 * S * wave2,
                  top: Y(dockY) - 640 * S * wave2 * 0.46,
                  width: 1280 * S * wave2,
                  height: 1280 * S * wave2 * 0.46,
                  borderRadius: '50%',
                  border: `${Math.max(1, 3 * (1 - wave2)) * S}px solid ${rgba(
                    hotCore,
                    0.34 * (1 - wave2)
                  )}`,
                  filter: `blur(${(2 + 6 * wave2).toFixed(1)}px)`,
                  mixBlendMode: 'screen',
                }}
              />
            )}
            {/* chispas radiales */}
            {sparks.map((sp, i) => {
              const t = interpolate(
                frame,
                [impactF + sp.lag * waveF, impactF + waveF * (1.1 + sp.lag)],
                [0, 1],
                {...CLAMP, easing: Easing.out(Easing.cubic)}
              );
              if (t <= 0 || t >= 1) return null;
              const d = sp.d * t;
              return (
                <div
                  key={`sp-${i}`}
                  style={{
                    position: 'absolute',
                    left: X(dockX) + Math.cos(sp.a) * d * S,
                    top: Y(dockY) + Math.sin(sp.a) * d * S * 0.62,
                    width: sp.s * S * (1 - t * 0.6),
                    height: sp.s * S * (1 - t * 0.6),
                    borderRadius: '50%',
                    background: rgba(hotCore, 0.9 * (1 - t)),
                    boxShadow: `0 0 ${10 * S}px ${rgba(tone, 0.7 * (1 - t))}`,
                    mixBlendMode: 'screen',
                  }}
                />
              );
            })}
          </AbsoluteFill>
        )}

        {/* L8 · partículas que se escapan por los huecos (disorder) --------- */}
        {!isRivet && docked && (
          <AbsoluteFill style={{...camStyle, pointerEvents: 'none'}}>
            {leaks.map((lk, i) => {
              const t = interpolate(
                frame,
                [impactF + lk.lag * waveF, impactF + waveF * (2.2 * lk.sp + lk.lag)],
                [0, 1],
                {...CLAMP, easing: Easing.out(Easing.quad)}
              );
              if (t <= 0 || t >= 1) return null;
              const baseY = 706 + (lk.gap - (N_LAM - 1) / 2) * 48;
              const op = Math.sin(t * Math.PI) * 0.85;
              return (
                <div
                  key={`lk-${i}`}
                  style={{
                    position: 'absolute',
                    left: X(lk.x + lk.drift * t),
                    top: Y(baseY - lk.rise * t),
                    width: lk.s * S,
                    height: lk.s * S,
                    borderRadius: '50%',
                    background: rgba('#CFE0F7', op),
                    boxShadow: `0 0 ${(9 + lk.s) * S}px ${rgba(COOL_BLUE, op * 0.75)}`,
                    filter: `blur(${(t * 1.6).toFixed(2)}px)`,
                    mixBlendMode: 'screen',
                  }}
                />
              );
            })}
          </AbsoluteFill>
        )}

        {/* L9 · barrido de luz sobre la pared ------------------------------- */}
        {sweepA > 0.01 && (
          <AbsoluteFill style={{...camStyle, pointerEvents: 'none', overflow: 'hidden'}}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: Y(560),
                width: '46%',
                height: 340 * S,
                transform: `translateX(${interpolate(sweepP, [0, 1], [-50, 195], CLAMP).toFixed(
                  1
                )}%) skewX(-19deg)`,
                background: `linear-gradient(100deg, transparent 18%, ${rgba(
                  tone,
                  0.42 * sweepA
                )} 48%, ${rgba('#FFFFFF', 0.16 * sweepA)} 56%, transparent 84%)`,
                mixBlendMode: 'screen',
                filter: 'blur(9px)',
              }}
            />
          </AbsoluteFill>
        )}

        {/* L10 · placas de texto con reveal por máscara ---------------------- */}
        {/* título arriba a la izquierda */}
        <div
          style={{
            position: 'absolute',
            left: width * 0.072,
            top: height * 0.088,
            opacity: platoP,
            clipPath: `inset(0 ${((1 - platoP) * 100).toFixed(1)}% 0 0)`,
            transform: `translate(${(hx * 0.5).toFixed(1)}px, ${(
              (1 - platoP) * 16 +
              hy * 0.5
            ).toFixed(1)}px)`,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '16px 34px 18px',
              borderLeft: `3px solid ${tone}`,
              background: 'linear-gradient(100deg, rgba(6,10,18,0.72), rgba(4,7,13,0.24))',
              backdropFilter: 'blur(5px)',
            }}
          >
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 15 * S,
                letterSpacing: 7 * S,
                fontWeight: 700,
                color: tone,
                marginBottom: 10 * S,
                textTransform: 'uppercase',
              }}
            >
              {isRivet ? 'Ácido graso esencial' : 'Potenciador de penetración'}
            </div>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 60 * S,
                fontWeight: 700,
                letterSpacing: -0.8 * S,
                lineHeight: 1.04,
                color: '#F4EFE6',
                textShadow: '0 4px 26px rgba(0,0,0,0.75)',
              }}
            >
              {T}
            </div>
            <div
              style={{
                fontFamily: FONT_SERIF,
                fontStyle: 'italic',
                fontSize: 27 * S,
                color: 'rgba(232,224,210,0.74)',
                marginTop: 10 * S,
                maxWidth: 760 * S,
              }}
            >
              {SUB}
            </div>
          </div>
        </div>

        {/* etiqueta de la ceramida (con guía) */}
        <div
          style={{
            position: 'absolute',
            left: X(1290) + hx * 0.7,
            top: Y(288) + hy * 0.7,
            opacity: tgP * (isRivet ? 1 : 0.6),
            clipPath: `inset(0 ${((1 - tgP) * 100).toFixed(1)}% 0 0)`,
          }}
        >
          <div
            style={{
              fontFamily: FONT_SANS,
              fontSize: 24 * S,
              fontWeight: 700,
              letterSpacing: 3 * S,
              color: '#EAE3D6',
              textShadow: '0 3px 16px rgba(0,0,0,0.85)',
            }}
          >
            {TG}
          </div>
          <div
            style={{
              width: 150 * S * tgP,
              height: 1,
              marginTop: 9 * S,
              background: `linear-gradient(90deg, ${rgba(TEAL, 0.85)}, transparent)`,
            }}
          />
        </div>

        {/* etiqueta que viaja pegada a la cadena */}
        {chP > 0.01 && (
          <div
            style={{
              position: 'absolute',
              left: X(now.x) - 300 * S,
              top: Y(now.y) + (isRivet ? 58 : -104) * S,
              opacity: chP,
              clipPath: `inset(0 ${((1 - chP) * 100).toFixed(1)}% 0 0)`,
              filter: `blur(${(mBlur * 0.35).toFixed(2)}px)`,
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: `${8 * S}px ${18 * S}px`,
                border: `1px solid ${rgba(tone, 0.5)}`,
                background: 'rgba(4,8,14,0.6)',
                fontFamily: FONT_SANS,
                fontSize: 22 * S,
                fontWeight: 700,
                letterSpacing: 2.4 * S,
                color: tone,
                whiteSpace: 'nowrap',
              }}
            >
              {CH}
            </div>
          </div>
        )}

        {/* placa de resultado */}
        {resP > 0.01 && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: height * 0.075,
              textAlign: 'center',
              opacity: resP,
              clipPath: `inset(0 ${((1 - resP) * 50).toFixed(1)}% 0 ${((1 - resP) * 50).toFixed(1)}%)`,
              transform: `translateY(${((1 - resP) * 18).toFixed(1)}px)`,
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: `${16 * S}px ${50 * S}px ${18 * S}px`,
                background: 'linear-gradient(180deg, rgba(8,12,20,0.66), rgba(4,7,13,0.9))',
                border: `1px solid ${rgba(tone, 0.36)}`,
                borderRadius: 6,
                backdropFilter: 'blur(6px)',
                boxShadow: `0 22px 60px rgba(0,0,0,0.62), 0 0 ${(46 * flash).toFixed(0)}px ${rgba(
                  tone,
                  0.5 * flash
                )}`,
              }}
            >
              <div
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 50 * S,
                  fontWeight: 700,
                  letterSpacing: -0.4 * S,
                  color: '#F6F1E7',
                  textShadow: `0 4px 24px rgba(0,0,0,0.75), 0 0 ${(26 * flash).toFixed(0)}px ${rgba(
                    tone,
                    0.7 * flash
                  )}`,
                }}
              >
                {RS}
              </div>
              <div
                style={{
                  height: 2,
                  marginTop: 12 * S,
                  width: `${(resP * 100).toFixed(0)}%`,
                  background: `linear-gradient(90deg, transparent, ${tone}, transparent)`,
                }}
              />
            </div>
          </div>
        )}

        {/* L11 · bokeh de primer plano fuera de foco ------------------------- */}
        <AbsoluteFill style={{filter: 'blur(18px)', opacity: 0.42, pointerEvents: 'none'}}>
          <MotesLayer
            motes={fgBokeh}
            blur={0}
            scale={S}
            tint={isRivet ? '246, 218, 168' : '160, 192, 240'}
          />
        </AbsoluteFill>
      </TransitionShell>

      <GrainOverlay />
    </AbsoluteFill>
  );
};

export default FedRivet;
