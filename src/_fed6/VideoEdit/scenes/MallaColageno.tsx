import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  random,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ── MallaColageno ────────────────────────────────────────────────────────────
// El CORAZÓN conceptual: la malla de colágeno que sostiene la piel, y cómo el
// azúcar la suelda hasta que deja de estirarse. UNA sola pieza continua con
// movimiento de cámara, en 4 fases encadenadas:
//   1. MALLA SANA      — 4 planos en Z (parallax + desenfoque por distancia),
//                        cuerdas trenzadas que se DESLIZAN unas sobre otras,
//                        gel translúcido con gotas de agua entre ellas.
//   2. ESTIRAMIENTO    — la cámara entra, la malla se estira y VUELVE (spring).
//   3. SOLDADURA       — granos de azúcar caen, aterrizan en los CRUCES y se
//                        endurecen ahí: micro-flash + halo + nudo rígido.
//   4. MALLA RÍGIDA    — ya no desliza: vibra, se tensa y una cuerda TRUENA,
//                        con las dos puntas retrayéndose y rizándose.
//
// 100% dibujado (SVG + CSS). Determinista: todo el azar sale de random() de
// Remotion sembrado por índice — cero PRNG del runtime, cero reloj del sistema.
// Todos los tiempos son FRACCIONES de durationInFrames → sirve a 6 s o a 12 s.
// Presupuesto: ~90 nodos SVG en total (renderiza en el farm sin costar segundos).

const INTER = loadInter().fontFamily;

const BG_IN = "#0E1D23";
const BG_OUT = "#08151A";
const TEAL = "#12B3AE";
const TEAL_L = "#3FE0D6";
const CREAM = "#F3ECDD";
const AMBER = "#E8B96B";
const CORAL = "#E0523E";

const TAU = Math.PI * 2;
const RAD = Math.PI / 180;
const HALF = 1500; // media longitud de cuerda (cubre la pantalla ya rotada)

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const EASE = Easing.bezier(0.33, 0, 0.15, 1);
const EASE_OUT = Easing.bezier(0.16, 0.84, 0.24, 1);
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const toRgb = (h: string): number[] => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];
const mix = (a: string, b: string, t: number) => {
  const ca = toRgb(a);
  const cb = toRgb(b);
  const k = clamp01(t);
  const c = [0, 1, 2].map((i) => Math.round(ca[i] + (cb[i] - ca[i]) * k));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

// ── geometría de una cuerda ondulada, trazada entre dos parámetros t ─────────
// La cuerda vive sobre la recta  p · n = offset,  con u = (cosθ, sinθ) y
// n = (−sinθ, cosθ). El "trenzado" es la ondulación sinusoidal sobre n.
const cordPath = (o: {
  theta: number;
  offset: number;
  amp: number;
  phase: number;
  k: number;
  tFrom: number;
  tTo: number;
  curl?: number; // rizo de retracción de una punta rota
  curlEnd?: 1 | -1; // 1 = rizo en tTo, -1 = rizo en tFrom
}) => {
  const ux = Math.cos(o.theta);
  const uy = Math.sin(o.theta);
  const nx = -Math.sin(o.theta);
  const ny = Math.cos(o.theta);
  const N = 22;
  let d = "";
  for (let s = 0; s <= N; s++) {
    const u = s / N;
    const t = o.tFrom + (o.tTo - o.tFrom) * u;
    let w = o.offset + o.amp * Math.sin(o.k * t + o.phase);
    if (o.curl && o.curlEnd) {
      const prox = o.curlEnd === 1 ? u : 1 - u;
      w += o.curl * prox * prox * prox;
    }
    d += (s === 0 ? "M" : "L") + (ux * t + nx * w).toFixed(1) + " " + (uy * t + ny * w).toFixed(1);
    if (s < N) d += " ";
  }
  return d;
};

// intersección exacta de la cuerda A (ángulo +θ, offset a) con la B (−θ, offset b)
const crossing = (theta: number, a: number, b: number) => ({
  x: (b - a) / (2 * Math.sin(theta)),
  y: (a + b) / (2 * Math.cos(theta)),
});

// ── planos de fondo (blur SOLO acá; la capa enfocada va limpia) ──────────────
const BACK = [
  { key: "z3", theta: 21, n: 3, sp: 300, w: 6, op: 0.26, blur: 3, depth: 0.34, amp: 30, k: 0.0034 },
  { key: "z2", theta: 23, n: 3, sp: 250, w: 9, op: 0.38, blur: 2.5, depth: 0.56, amp: 26, k: 0.0038 },
  { key: "z1", theta: 25, n: 4, sp: 205, w: 12, op: 0.55, blur: 2, depth: 0.78, amp: 22, k: 0.0042 },
];

const FT = 26 * RAD; // ángulo de la capa enfocada
const FSP = 165; // separación entre cuerdas enfocadas
const FN = 5; // cuerdas por familia en la capa enfocada
const FK = 0.0046; // número de onda del trenzado
const FAMP = 18;
const BREAK_I = 2; // cuerda de la familia A que se trunca

// cruces donde el azúcar suelda (índices [familiaA, familiaB])
const WELDS: number[][] = [
  [2, 2], [1, 3], [3, 1], [0, 2], [2, 0],
  [4, 2], [2, 4], [1, 1], [3, 3], [0, 4],
];
// celdas donde queda el gel (offsets a media distancia entre cuerdas)
const GEL: number[][] = [
  [-0.5, -0.5], [0.5, 0.5], [-1.5, 0.5], [1.5, -0.5],
  [0.5, -1.5], [-0.5, 1.5], [1.5, 1.5], [-1.5, -1.5],
];

type Win = [number, number];
type Marks = {
  meshIn: Win;
  labSana: Win | null;
  stretch: Win;
  sugar: Win | null;
  labSold: Win | null;
  rigid: Win | null;
  tense: Win | null;
  snap: number | null;
  labRig: Win | null;
};

const MARKS: { [k: string]: Marks } = {
  sana: {
    meshIn: [0, 0.1],
    labSana: [0.12, 0.6],
    stretch: [0.4, 0.75],
    sugar: null,
    labSold: null,
    rigid: null,
    tense: null,
    snap: null,
    labRig: null,
  },
  soldadura: {
    meshIn: [0, 0.07],
    labSana: [0.05, 0.22],
    stretch: [0.19, 0.34],
    sugar: [0.3, 0.62],
    labSold: [0.4, 0.8],
    rigid: [0.4, 0.8],
    tense: [0.82, 0.99],
    snap: null,
    labRig: null,
  },
  completa: {
    meshIn: [0, 0.07],
    labSana: [0.07, 0.25],
    stretch: [0.26, 0.43],
    sugar: [0.44, 0.6],
    labSold: [0.46, 0.66],
    rigid: [0.5, 0.7],
    tense: [0.72, 0.94],
    snap: 0.855,
    labRig: [0.8, 0.97],
  },
};

// ── rótulo broadcast: minúsculas grandes + filete de acento ─────────────────
const Rotulo: React.FC<{
  text: string;
  win: Win;
  D: number;
  frame: number;
  accent: string;
}> = ({ text, win, D, frame, accent }) => {
  const a = win[0] * D;
  const b = win[1] * D;
  const fd = Math.min(Math.max(3, D * 0.045), (b - a) / 2.4);
  const on = interpolate(frame, [a, a + fd, b - fd, b], [0, 1, 1, 0], { ...CLAMP, easing: EASE });
  if (on <= 0.001) return null;
  const rise = interpolate(frame, [a, a + fd * 1.6], [30, 0], { ...CLAMP, easing: EASE });
  const rule = interpolate(frame, [a + fd * 0.4, a + fd * 2.4], [0, 1], { ...CLAMP, easing: EASE });
  return (
    <div
      style={{
        position: "absolute",
        left: 126,
        bottom: 118,
        opacity: on,
        filter: `blur(${(1 - on) * 16}px)`,
        transform: `translate3d(0, ${rise}px, 0)`,
        fontFamily: INTER,
      }}
    >
      <div
        style={{
          fontSize: 96,
          fontWeight: 700,
          lineHeight: 0.98,
          letterSpacing: -3.2,
          color: CREAM,
          textTransform: "lowercase",
          textShadow: "0 14px 46px rgba(0,0,0,0.6)",
        }}
      >
        {text}
      </div>
      <div
        style={{
          marginTop: 20,
          height: 6,
          width: 168 * rule,
          borderRadius: 3,
          background: accent,
          boxShadow: `0 0 26px ${accent}`,
        }}
      />
    </div>
  );
};

export const MallaColageno: React.FC<{
  durationInFrames: number;
  phase?: "sana" | "soldadura" | "completa";
  labels?: { sana?: string; soldadura?: string; rigida?: string };
}> = ({ durationInFrames, phase = "completa", labels }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(1, durationInFrames);
  const M = MARKS[phase];
  const p = clamp01(frame / D);
  const secs = frame / fps;

  const L_SANA = (labels && labels.sana) || "se deslizan";
  const L_SOLD = (labels && labels.soldadura) || "el azúcar suelda";
  const L_RIG = (labels && labels.rigida) || "ya no se estira";

  // ── entrada de la malla ────────────────────────────────────────────────────
  // unidad corta atada a fps (micro-tiempos: flashes, fades) — nunca frames "a ojo"
  const U = fps / 30; // 1 unidad = 1 frame a 30 fps, escala si cambia el fps
  const born = interpolate(frame, [M.meshIn[0] * D, M.meshIn[1] * D + 4 * U], [0, 1], {
    ...CLAMP,
    easing: EASE,
  });

  // ── rigidez: 0 = elástica, 1 = soldada ─────────────────────────────────────
  const rigid = M.rigid
    ? interpolate(frame, [M.rigid[0] * D, M.rigid[1] * D], [0, 1], { ...CLAMP, easing: EASE })
    : 0;

  // ── estiramiento elástico (tira y VUELVE con rebote) ───────────────────────
  const s0 = M.stretch[0] * D;
  const s1 = s0 + (M.stretch[1] - M.stretch[0]) * D * 0.5;
  const pull = spring({ frame: frame - s0, fps, config: { damping: 26, stiffness: 90, mass: 1 } });
  const release = spring({
    frame: frame - s1,
    fps,
    config: { damping: 8.5, stiffness: 120, mass: 1.05 },
  });
  const stretchVal = pull - release;

  // ── tensión final (ya rígida) + trueno ─────────────────────────────────────
  const tenseP = M.tense
    ? spring({ frame: frame - M.tense[0] * D, fps, config: { damping: 30, stiffness: 55, mass: 1.2 } })
    : 0;
  const cut =
    M.snap != null
      ? spring({ frame: frame - M.snap * D, fps, config: { damping: 15, stiffness: 85, mass: 1 } })
      : 0;
  const tenseVal = tenseP * (1 - cut * 0.8);
  const shake = tenseP * (1 - cut);

  // ── deslizamiento: las cuerdas corren unas sobre otras hasta que sueldan ───
  const slideGain = clamp01(1 - rigid) * born;
  const slideOsc = Math.sin(secs * TAU * 0.22);
  const slideFor = (dir: number) =>
    (slideOsc * 46 + secs * 11 + Math.abs(stretchVal) * 34) * dir * slideGain;
  const breathe = Math.sin(secs * TAU * 0.09) * 0.9 * slideGain;

  // ── cámara ─────────────────────────────────────────────────────────────────
  const camZ = interpolate(p, [0, 0.25, 0.45, 0.66, 0.86, 1], [1.02, 1.07, 1.17, 1.24, 1.3, 1.36], {
    ...CLAMP,
    easing: EASE,
  });
  const camX = interpolate(p, [0, 0.5, 1], [-44, 8, 34], { ...CLAMP, easing: EASE });
  const camY = interpolate(p, [0, 0.5, 1], [26, -6, -30], { ...CLAMP, easing: EASE });
  const kick = cut * (1 - cut) * 0.16; // pop seco al truene

  // deformación de la malla (estirar / tensar)
  const sx = 1 + stretchVal * 0.17 * (1 - 0.5 * rigid) + tenseVal * 0.055;
  const sy = 1 - stretchVal * 0.075 * (1 - 0.5 * rigid) - tenseVal * 0.024;
  const vx = Math.sin(secs * TAU * 10.5) * 3.2 * shake;
  const vy = Math.sin(secs * TAU * 13.3 + 1.1) * 2.1 * shake;

  // ── capa enfocada: offsets y fases de cada cuerda ──────────────────────────
  const ampF = FAMP * (1 - 0.45 * rigid);
  const offA: number[] = [];
  const offB: number[] = [];
  const phA: number[] = [];
  const phB: number[] = [];
  for (let i = 0; i < FN; i++) {
    const base = (i - (FN - 1) / 2) * FSP;
    offA.push(base + slideOsc * 5 * slideGain);
    offB.push(base - slideOsc * 5 * slideGain);
    phA.push(random(`fa${i}`) * TAU + breathe);
    phB.push(random(`fb${i}`) * TAU - breathe);
  }

  // posición real de un cruce (suma la ondulación de las dos cuerdas)
  const weldPos = (i: number, j: number) => {
    const c = crossing(FT, offA[i], offB[j]);
    const tA = c.x * Math.cos(FT) + c.y * Math.sin(FT);
    const tB = c.x * Math.cos(FT) - c.y * Math.sin(FT);
    const wA = ampF * Math.sin(FK * tA + phA[i]);
    const wB = ampF * Math.sin(FK * tB + phB[j]);
    return {
      x: c.x + -Math.sin(FT) * wA + Math.sin(FT) * wB,
      y: c.y + Math.cos(FT) * wA + Math.cos(FT) * wB,
    };
  };

  const showSugar = M.sugar != null;
  const sugarA = M.sugar ? M.sugar[0] * D : 0;
  const sugarB = M.sugar ? M.sugar[1] * D : 0;
  const sugarStep = (sugarB - sugarA) / WELDS.length;
  const landLag = Math.max(6, Math.round(fps * 0.55));

  // color de las cuerdas: la malla se "caramelize" al soldarse
  const colA = mix(CREAM, AMBER, rigid * 0.45);
  const colB = mix(TEAL_L, AMBER, rigid * 0.4);
  const dashLen = 40 + rigid * 220;
  const dashGap = 9 * (1 - rigid);
  const fDash = `${dashLen.toFixed(1)} ${dashGap.toFixed(1)}`;

  // ── cuerdas enfocadas ──────────────────────────────────────────────────────
  const cords: React.ReactNode[] = [];
  for (let i = 0; i < FN; i++) {
    const broken = M.snap != null && cut > 0.001 && i === BREAK_I;
    if (!broken) {
      // adelgazamiento previo al trueno (cuello de la cuerda condenada)
      const neck = M.snap != null && i === BREAK_I ? tenseP * 0.22 : 0;
      cords.push(
        <path
          key={`a${i}`}
          d={cordPath({
            theta: FT,
            offset: offA[i],
            amp: ampF,
            phase: phA[i],
            k: FK,
            tFrom: -HALF,
            tTo: HALF,
          })}
          stroke={colA}
          strokeWidth={17 * (1 - neck)}
          strokeLinecap="round"
          strokeDasharray={fDash}
          strokeDashoffset={slideFor(1)}
          fill="none"
          opacity={0.94 * born}
        />
      );
    }
  }
  for (let j = 0; j < FN; j++) {
    cords.push(
      <path
        key={`b${j}`}
        d={cordPath({
          theta: -FT,
          offset: offB[j],
          amp: ampF,
          phase: phB[j],
          k: FK,
          tFrom: -HALF,
          tTo: HALF,
        })}
        stroke={colB}
        strokeWidth={15}
        strokeLinecap="round"
        strokeDasharray={fDash}
        strokeDashoffset={slideFor(-1)}
        fill="none"
        opacity={0.9 * born}
      />
    );
  }

  // ── la cuerda que TRUENA: dos mitades que se retraen y se rizan ────────────
  if (M.snap != null && cut > 0.001) {
    const brk = weldPos(BREAK_I, BREAK_I);
    const tCut = brk.x * Math.cos(FT) + brk.y * Math.sin(FT);
    const gap = cut * 205;
    const curl = cut * 62;
    const snapCol = mix(CREAM, CORAL, clamp01(cut * 1.7));
    cords.push(
      <path
        key="snapL"
        d={cordPath({
          theta: FT,
          offset: offA[BREAK_I],
          amp: ampF,
          phase: phA[BREAK_I],
          k: FK,
          tFrom: -HALF,
          tTo: tCut - gap,
          curl,
          curlEnd: 1,
        })}
        stroke={snapCol}
        strokeWidth={17}
        strokeLinecap="round"
        fill="none"
        opacity={0.96 * born}
      />
    );
    cords.push(
      <path
        key="snapR"
        d={cordPath({
          theta: FT,
          offset: offA[BREAK_I],
          amp: ampF,
          phase: phA[BREAK_I],
          k: FK,
          tFrom: tCut + gap,
          tTo: HALF,
          curl: -curl,
          curlEnd: -1,
        })}
        stroke={snapCol}
        strokeWidth={17}
        strokeLinecap="round"
        fill="none"
        opacity={0.96 * born}
      />
    );
  }

  // ── gel translúcido + gotas de agua (se secan al soldarse) ─────────────────
  const wet = clamp01(1 - rigid * 0.92) * born;
  const gel = GEL.map((g, i) => {
    const c = crossing(FT, g[0] * FSP, g[1] * FSP);
    const wob = Math.sin(secs * TAU * 0.18 + i) * 6 * slideGain;
    return (
      <ellipse
        key={`g${i}`}
        cx={c.x + wob}
        cy={c.y - wob * 0.5}
        rx={118}
        ry={76}
        fill="url(#mcGel)"
        opacity={0.22 * wet}
      />
    );
  });
  const drops = [0, 1, 2, 3, 4, 5].map((i) => {
    const g = GEL[i];
    const c = crossing(FT, g[0] * FSP, g[1] * FSP);
    const jx = (random(`dx${i}`) - 0.5) * 130;
    const jy = (random(`dy${i}`) - 0.5) * 84;
    const r = 9 + random(`dr${i}`) * 7;
    const bob = Math.sin(secs * TAU * 0.3 + i * 1.4) * 5 * slideGain;
    return (
      <circle
        key={`d${i}`}
        cx={c.x + jx + bob}
        cy={c.y + jy - bob}
        r={r * (0.5 + 0.5 * wet)}
        fill="url(#mcDrop)"
        opacity={0.9 * wet}
      />
    );
  });

  // ── azúcar: cae, aterriza en el cruce y SUELDA (flash + halo + nudo) ───────
  const sugar: React.ReactNode[] = [];
  if (showSugar) {
    for (let m = 0; m < WELDS.length; m++) {
      const dly = sugarA + m * sugarStep + random(`sd${m}`) * sugarStep * 0.55;
      const fall = spring({
        frame: frame - dly,
        fps,
        config: { damping: 26, stiffness: 70, mass: 0.9 },
      });
      if (fall <= 0.001) continue;
      const tgt = weldPos(WELDS[m][0], WELDS[m][1]);
      const x0 = tgt.x + (random(`sx${m}`) - 0.5) * 110;
      const y0 = -820 - m * 36;
      const x = interpolate(fall, [0, 1], [x0, tgt.x]);
      const y = interpolate(fall, [0, 1], [y0, tgt.y]);
      const welded = clamp01((fall - 0.86) / 0.14);
      const landF = dly + landLag;
      const fl = interpolate(frame, [landF, landF + 3 * U, landF + 17 * U], [0, 1, 0], {
        ...CLAMP,
        easing: EASE_OUT,
      });
      sugar.push(
        <g key={`w${m}`} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(1 / sx).toFixed(3)} ${(1 / sy).toFixed(3)})`}>
          <circle
            cx={0}
            cy={0}
            r={13 + fl * 28 + welded * 4}
            fill="none"
            stroke={AMBER}
            strokeWidth={2 + fl * 3.4}
            opacity={(0.2 * welded + fl * 0.72) * born}
          />
          <circle
            cx={0}
            cy={0}
            r={6 + welded * 7.5}
            fill={mix(AMBER, "#FFF6E2", fl * 0.85)}
            opacity={0.96 * born}
          />
        </g>
      );
    }
    // granos que erran el cruce y siguen de largo
    for (let m = 0; m < 4; m++) {
      const dly = sugarA + m * sugarStep * 1.7;
      const t = interpolate(frame, [dly, dly + fps * 1.5], [0, 1], { ...CLAMP, easing: EASE_OUT });
      if (t <= 0.001 || t >= 0.999) continue;
      const gx = (random(`mx${m}`) - 0.5) * 1500;
      sugar.push(
        <circle
          key={`m${m}`}
          cx={gx + t * 60}
          cy={interpolate(t, [0, 1], [-780, 760])}
          r={4 + random(`mr${m}`) * 3}
          fill={AMBER}
          opacity={0.45 * Math.sin(t * Math.PI) * born}
        />
      );
    }
  }

  const camWrap = (depth: number, extraShake: number): React.CSSProperties => ({
    transform: `translate3d(${(camX * depth + vx * extraShake).toFixed(2)}px, ${(camY * depth + vy * extraShake).toFixed(2)}px, 0) scale(${(1 + (camZ - 1 + kick) * depth).toFixed(4)})`,
    willChange: "transform",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(122% 94% at 50% 46%, ${BG_IN} 0%, #0B1920 54%, ${BG_OUT} 100%)`,
        fontFamily: INTER,
        overflow: "hidden",
      }}
    >
      {/* planos de fondo: parallax + desenfoque por distancia */}
      {BACK.map((L) => {
        const th = L.theta * RAD;
        const ampL = L.amp * (1 - 0.4 * rigid);
        const paths: React.ReactNode[] = [];
        for (let i = 0; i < L.n; i++) {
          const base = (i - (L.n - 1) / 2) * L.sp;
          paths.push(
            <path
              key={`a${i}`}
              d={cordPath({
                theta: th,
                offset: base,
                amp: ampL,
                phase: random(`${L.key}a${i}`) * TAU + breathe,
                k: L.k,
                tFrom: -HALF,
                tTo: HALF,
              })}
              stroke={mix(TEAL, AMBER, rigid * 0.35)}
              strokeWidth={L.w}
              strokeLinecap="round"
              strokeDasharray={`${30 + rigid * 160} ${12 * (1 - rigid)}`}
              strokeDashoffset={slideFor(1) * L.depth}
              fill="none"
            />
          );
          paths.push(
            <path
              key={`b${i}`}
              d={cordPath({
                theta: -th,
                offset: base,
                amp: ampL,
                phase: random(`${L.key}b${i}`) * TAU - breathe,
                k: L.k,
                tFrom: -HALF,
                tTo: HALF,
              })}
              stroke={mix("#0E7C82", AMBER, rigid * 0.3)}
              strokeWidth={L.w}
              strokeLinecap="round"
              strokeDasharray={`${30 + rigid * 160} ${12 * (1 - rigid)}`}
              strokeDashoffset={slideFor(-1) * L.depth}
              fill="none"
            />
          );
        }
        return (
          <AbsoluteFill
            key={L.key}
            style={{
              ...camWrap(L.depth, L.depth * 0.5),
              filter: `blur(${L.blur}px)`,
              opacity: L.op * born,
            }}
          >
            <svg viewBox="0 0 1920 1080" width="100%" height="100%">
              <g
                transform={`translate(960 540) scale(${(1 + (sx - 1) * L.depth).toFixed(4)} ${(1 + (sy - 1) * L.depth).toFixed(4)})`}
              >
                {paths}
              </g>
            </svg>
          </AbsoluteFill>
        );
      })}

      {/* CAPA ENFOCADA — sin blur */}
      <AbsoluteFill style={camWrap(1, 1)}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <defs>
            <radialGradient id="mcGel" cx="42%" cy="38%" r="68%">
              <stop offset="0%" stopColor={TEAL_L} stopOpacity="0.55" />
              <stop offset="70%" stopColor={TEAL} stopOpacity="0.2" />
              <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="mcDrop" cx="34%" cy="30%" r="72%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="45%" stopColor={TEAL_L} stopOpacity="0.5" />
              <stop offset="100%" stopColor={TEAL} stopOpacity="0.12" />
            </radialGradient>
          </defs>
          <g transform={`translate(960 540) scale(${sx.toFixed(4)} ${sy.toFixed(4)})`}>
            {gel}
            {cords}
            {drops}
            {sugar}
          </g>
        </svg>
      </AbsoluteFill>

      {/* bloom teal + vignette (0 nodos SVG) */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(46% 40% at 50% 44%, rgba(18,179,174,${(0.13 * (1 - rigid * 0.6)).toFixed(3)}) 0%, rgba(18,179,174,0) 70%)`,
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(72% 66% at 50% 50%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.62) 100%)`,
        }}
      />
      {/* destello del truene */}
      {M.snap != null ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(38% 34% at 50% 50%, rgba(224,82,62,0.55) 0%, rgba(224,82,62,0) 72%)`,
            mixBlendMode: "screen",
            opacity: interpolate(frame, [M.snap * D - U, M.snap * D + 3 * U, M.snap * D + 16 * U], [0, 1, 0], {
              ...CLAMP,
              easing: EASE_OUT,
            }),
          }}
        />
      ) : null}

      {/* rótulos — nunca los tres a la vez */}
      {M.labSana ? (
        <Rotulo text={L_SANA} win={M.labSana} D={D} frame={frame} accent={TEAL_L} />
      ) : null}
      {M.labSold ? (
        <Rotulo text={L_SOLD} win={M.labSold} D={D} frame={frame} accent={AMBER} />
      ) : null}
      {M.labRig ? (
        <Rotulo text={L_RIG} win={M.labRig} D={D} frame={frame} accent={CORAL} />
      ) : null}
    </AbsoluteFill>
  );
};
