import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { THEME_EARTH } from "../kit/premium";

// ═══════════════════════════════════════════════════════════════════════════
// PORO + HIFAS — corte transversal de aplanado/lechada poroso.
// El moho NO es una mancha: es un organismo con raíz metida DENTRO del poro.
// Arco de ~7 s en tres tiempos:
//   1) plano ancho: la mancha oscura sobre la superficie ("lo que ves")
//   2) la cámara BAJA al poro: se dibuja la red de hifas viva en el material
//   3) la cámara se abre: el cloro barre la capita de arriba y la raíz sigue viva
// Todo determinista (sin Math.random / Date / estado): mismo frame → mismo pixel.
// Theme EARTH (terroso vintage) sobre papel oscuro. Solo SVG + divs.
// ═══════════════════════════════════════════════════════════════════════════

// ── Paleta (valores del THEME_EARTH, versión papel oscuro) ───────────────────
const PAPER = "#1b1712";
const CREMA = "#f4ead8";
const GOLD = "#d99b3e";
const DANGER = "#b4472e";
const GOOD = "#6f8f5a";
const SERIF = THEME_EARTH.fontDisplay;
const SANS = "Inter, system-ui, 'Segoe UI', sans-serif";

// ── Ruido determinista (hash puro, NO random) ────────────────────────────────
const hash = (n: number): number => {
  const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
};
const RAD = Math.PI / 180;

// ── Geometría del mundo (viewBox 1920x1080, la losa arranca en SURFACE) ──────
const SURFACE = 300; // y de la superficie del aplanado
const SKIN = 52; // espesor de la "capita" que alcanza el cloro
const PORE_TOP = 292;
const PORE_LEN = 980;

/** Centro del canal del poro para t∈[0,1] (serpentea hacia abajo). */
const poreAt = (t: number) => ({
  x: 960 + Math.sin(t * 3.1) * 46 + Math.sin(t * 7.4 + 1.2) * 16,
  y: PORE_TOP + t * PORE_LEN,
});
/** Semi-ancho del poro: boca grande, punta capilar. */
const poreW = (t: number) => 78 * (1 - t) * (1 - t) + 16 * (1 - t) + 5;

/** Contorno cerrado del poro, construido por offset del centro. */
const PORE_D = (() => {
  const N = 44;
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const p = poreAt(t);
    const w = poreW(t);
    left.push(`${(p.x - w).toFixed(1)} ${p.y.toFixed(1)}`);
    right.push(`${(p.x + w).toFixed(1)} ${p.y.toFixed(1)}`);
  }
  right.reverse();
  return `M ${left.join(" L ")} L ${right.join(" L ")} Z`;
})();

/** ¿Cae este punto dentro del hueco del poro? (para no pintar árido ahí) */
const insidePore = (x: number, y: number): boolean => {
  const t = (y - PORE_TOP) / PORE_LEN;
  if (t < 0 || t > 1) return false;
  const p = poreAt(t);
  return Math.abs(x - p.x) < poreW(t) + 10;
};

// ── Árido / micro-poros de la lechada (estático, mismo en todo frame) ────────
type Speck = { x: number; y: number; r: number; o: number; c: string };
const SPECKS: Speck[] = (() => {
  const out: Speck[] = [];
  const tones = ["#4b4235", "#574c3c", "#3d362c", "#615645"];
  for (let i = 0; i < 190; i++) {
    const x = -60 + hash(i * 1.73 + 0.3) * 2040;
    const y = SURFACE + 6 + hash(i * 2.91 + 1.1) * 1480;
    if (insidePore(x, y)) continue;
    out.push({
      x,
      y,
      r: 2 + hash(i * 4.11) * 7,
      o: 0.1 + hash(i * 5.37) * 0.3,
      c: tones[Math.floor(hash(i * 6.53) * 4) % 4],
    });
  }
  return out;
})();

const VOIDS: Speck[] = (() => {
  const out: Speck[] = [];
  for (let i = 0; i < 90; i++) {
    const x = -40 + hash(i * 3.19 + 9.4) * 2000;
    const y = SURFACE + 14 + hash(i * 2.07 + 4.6) * 1400;
    if (insidePore(x, y)) continue;
    out.push({
      x,
      y,
      r: 1.5 + hash(i * 7.71) * 5,
      o: 0.22 + hash(i * 8.13) * 0.3,
      c: "#0c0a07",
    });
  }
  return out;
})();

// ── Hifas: red ramificada determinista que nace DENTRO del poro ─────────────
type Hifa = { d: string; gen: number; ex: number; ey: number; k: number };
const HIFAS: Hifa[] = (() => {
  const out: Hifa[] = [];
  const grow = (x: number, y: number, ang: number, len: number, gen: number) => {
    const k = out.length * 1.37 + gen * 3.1 + 1;
    const bend = (hash(k * 3.7) * 2 - 1) * 30;
    const a1 = ang + bend * 0.45;
    const a2 = ang + bend;
    const d =
      `M ${x.toFixed(1)} ${y.toFixed(1)} C ` +
      `${(x + Math.cos(ang * RAD) * len * 0.34).toFixed(1)} ${(y + Math.sin(ang * RAD) * len * 0.34).toFixed(1)} ` +
      `${(x + Math.cos(a1 * RAD) * len * 0.7).toFixed(1)} ${(y + Math.sin(a1 * RAD) * len * 0.7).toFixed(1)} ` +
      `${(x + Math.cos(a2 * RAD) * len).toFixed(1)} ${(y + Math.sin(a2 * RAD) * len).toFixed(1)}`;
    const ex = x + Math.cos(a2 * RAD) * len;
    const ey = y + Math.sin(a2 * RAD) * len;
    out.push({ d, gen, ex, ey, k });
    if (gen >= 3 || len < 85) return;
    const spread = 23 + hash(k * 5.1) * 24;
    grow(ex, ey, a2 - spread, len * (0.6 + hash(k * 7.3) * 0.18), gen + 1);
    grow(ex, ey, a2 + spread, len * (0.58 + hash(k * 9.7) * 0.2), gen + 1);
  };
  // troncos que salen de la pared del poro, a distintas profundidades
  const roots: [number, number, number][] = [
    [0.05, 104, 300],
    [0.12, 66, 285],
    [0.24, 132, 300],
    [0.38, 74, 305],
    [0.55, 112, 270],
  ];
  for (let i = 0; i < roots.length; i++) {
    const t = roots[i][0];
    const p = poreAt(t);
    grow(p.x, p.y, roots[i][1], roots[i][2], 0);
  }
  // dos que corren pegadas por debajo de la capita (va POR DENTRO, no encima)
  grow(905, SURFACE + 40, 176, 250, 1);
  grow(1015, SURFACE + 44, 5, 250, 1);
  return out;
})();

const TIPS = HIFAS.filter((h) => h.gen >= 3);

// ── Esporas que suelta la parte que fructifica ──────────────────────────────
const SPORES = (() => {
  const out: { x: number; ph: number; r: number }[] = [];
  for (let i = 0; i < 11; i++) {
    out.push({
      x: 660 + hash(i * 2.21 + 3.3) * 620,
      ph: hash(i * 4.47),
      r: 2.2 + hash(i * 6.91) * 2.6,
    });
  }
  return out;
})();

// ── Pelusa de la mancha: tallos con cabeza (conidióforos) ───────────────────
const STALKS = (() => {
  const out: { x: number; h: number; r: number; lean: number }[] = [];
  for (let i = 0; i < 18; i++) {
    out.push({
      x: 648 + hash(i * 1.61 + 7.7) * 648,
      h: 20 + hash(i * 3.33) * 30,
      r: 4 + hash(i * 5.55) * 3.5,
      lean: (hash(i * 8.88) * 2 - 1) * 9,
    });
  }
  return out;
})();

/** Rótulo: serif o sans, con subrayado que se dibuja. Puro, sin hooks. */
const Rotulo: React.FC<{
  x: number;
  y: number;
  align: "left" | "right";
  vAlign: "middle" | "bottom";
  show: number;
  text: string;
  color: string;
  font: string;
  size: number;
  tracking: number;
  upper: boolean;
}> = ({ x, y, align, vAlign, show, text, color, font, size, tracking, upper }) => (
  <div
    style={{
      position: "absolute",
      left: align === "left" ? x : 0,
      width: align === "left" ? Math.max(60, 1920 - x) : Math.max(60, x),
      top: y,
      textAlign: align,
      opacity: show,
      transform: `translateY(${vAlign === "middle" ? -50 : -100}%) translateY(${((1 - show) * 14).toFixed(2)}px)`,
    }}
  >
    <div style={{ display: "inline-block" }}>
      <div
        style={{
          fontFamily: font,
          fontSize: size,
          fontWeight: 600,
          color,
          letterSpacing: tracking,
          textTransform: upper ? ("uppercase" as const) : ("none" as const),
          lineHeight: 1.04,
          whiteSpace: "nowrap",
          textShadow: "0 8px 30px rgba(0,0,0,0.72), 0 2px 6px rgba(0,0,0,0.6)",
        }}
      >
        {text}
      </div>
      <div
        style={{
          height: 2,
          marginTop: Math.round(size * 0.26),
          marginLeft: align === "right" ? "auto" : 0,
          background: color,
          opacity: 0.72,
          width: `${(show * 100).toFixed(1)}%`,
        }}
      />
    </div>
  </div>
);

export const PoroHifas: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(24, durationInFrames);
  const p = frame / D; // 0..1 — todos los beats son fracciones: aguanta cualquier largo

  // entrada con spring, salida con fade en los últimos 12 frames
  const enter = spring({ frame, fps, config: { damping: 18, mass: 0.9, stiffness: 120 }, durationInFrames: 14 });
  const out = interpolate(frame, [D - 12, D - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const alpha = enter * out;

  // ── CÁMARA: ancho → baja al poro → se abre para comparar ──────────────────
  const easeCam = Easing.bezier(0.4, 0, 0.18, 1);
  const camY =
    interpolate(p, [0, 0.15, 0.4, 0.68, 0.82, 1], [0, 0, -200, -200, -40, -40], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeCam,
    }) - p * 12;
  const camS =
    interpolate(p, [0, 0.15, 0.4, 0.68, 0.82, 1], [1, 1, 1.2, 1.2, 1.04, 1.04], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeCam,
    }) * (1 + p * 0.02);
  const sx = (x: number) => 960 + (x - 960) * camS;
  const sy = (y: number) => 540 + (y + camY - 540) * camS;
  const hair = (w: number) => w / camS; // trazos de anotación de peso constante

  // ── Beats ─────────────────────────────────────────────────────────────────
  const fIn = (a: number, b: number) =>
    interpolate(p, [a, b], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });

  const l1 = fIn(0.05, 0.13) * (1 - fIn(0.17, 0.24));
  const l2 = fIn(0.5, 0.62);
  const l3 = fIn(0.79, 0.89);
  const dive = fIn(0.13, 0.24) * (1 - fIn(0.28, 0.38)); // anillo "entrando al poro"
  const diveR = interpolate(p, [0.13, 0.38], [430, 108], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const chl = interpolate(p, [0.72, 0.87], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });
  const chlFront = -420 + (SURFACE + SKIN + 420) * chl;
  const bleach = fIn(0.74, 0.88);
  const stainOp = 1 - bleach * 0.84;
  const sporeOp = (1 - fIn(0.2, 0.3)) * 0.55;
  const bracket = fIn(0.8, 0.93);

  // ventana de dibujado de las hifas
  const h0 = 0.27 * D;
  const h1 = 0.6 * D;
  const hSpan = h1 - h0;

  // agua que baja por el poro y le da de beber a la raíz
  const wet = fIn(0.42, 0.56) * (1 - fIn(0.9, 1));
  const pulse = 0.5 + 0.5 * Math.sin(p * Math.PI * 6.2);

  return (
    <AbsoluteFill style={{ opacity: alpha }}>
      {/* fondo papel oscuro */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 50% 18%, #2a2419 0%, ${PAPER} 58%, #120f0b 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          transform: `scale(${(0.968 + 0.032 * enter).toFixed(4)})`,
        }}
      >
        <svg
          viewBox="0 0 1920 1080"
          width="1920"
          height="1080"
          style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}
        >
          <defs>
            <linearGradient id="ph_slab" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#463d31" />
              <stop offset="0.16" stopColor="#3a3227" />
              <stop offset="0.62" stopColor="#2a241b" />
              <stop offset="1" stopColor="#1d1912" />
            </linearGradient>
            <linearGradient id="ph_hifa" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e8d9a8" />
              <stop offset="0.42" stopColor={GOOD} />
              <stop offset="1" stopColor="#4d6b3f" />
            </linearGradient>
            <linearGradient id="ph_void" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0a0806" />
              <stop offset="0.5" stopColor="#100c08" />
              <stop offset="1" stopColor="#1a150e" />
            </linearGradient>
            <linearGradient id="ph_chl" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(244,234,216,0.02)" />
              <stop offset="0.75" stopColor="rgba(244,234,216,0.13)" />
              <stop offset="1" stopColor="rgba(244,234,216,0.3)" />
            </linearGradient>
            <filter id="ph_glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
            <filter id="ph_soft" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="16" />
            </filter>
            <filter id="ph_grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>

          {/* ═══ MUNDO (con cámara) ═══ */}
          <g
            transform={`translate(960 540) scale(${camS.toFixed(4)}) translate(-960 -540) translate(0 ${camY.toFixed(1)})`}
          >
            {/* cuerpo del aplanado */}
            <rect x={-160} y={SURFACE} width={2240} height={2200} fill="url(#ph_slab)" />
            {SPECKS.map((s, i) => (
              <circle key={`sp${i}`} cx={s.x} cy={s.y} r={s.r} fill={s.c} opacity={s.o} />
            ))}
            {VOIDS.map((s, i) => (
              <circle key={`vd${i}`} cx={s.x} cy={s.y} r={s.r} fill={s.c} opacity={s.o} />
            ))}

            {/* capita superficial (lo único que alcanza el cloro) */}
            <rect
              x={-160}
              y={SURFACE}
              width={2240}
              height={SKIN}
              fill="rgba(244,234,216,0.05)"
            />
            <rect
              x={-160}
              y={SURFACE}
              width={2240}
              height={SKIN}
              fill={CREMA}
              opacity={bleach * 0.1}
            />
            <path
              d={`M -160 ${SURFACE} L 2080 ${SURFACE}`}
              stroke={CREMA}
              strokeWidth={hair(2.4)}
              opacity={0.26 + bleach * 0.24}
            />

            {/* hueco del poro */}
            <path d={PORE_D} fill="url(#ph_void)" />
            <path
              d={PORE_D}
              fill="none"
              stroke="#0a0705"
              strokeWidth={hair(6)}
              opacity={0.55}
            />
            <path
              d={PORE_D}
              fill="none"
              stroke={GOLD}
              strokeWidth={hair(1.6)}
              opacity={0.16}
            />

            {/* agua bajando por el poro: le da de beber a la raíz */}
            <g opacity={wet}>
              {[0, 1, 2, 3].map((k) => {
                const u = ((p * 2.1 + k * 0.27) % 1) * 0.82;
                const q = poreAt(u);
                const w = poreW(u);
                const fade = Math.sin(Math.min(1, u / 0.82) * Math.PI);
                return (
                  <g key={`w${k}`} opacity={0.75 * fade}>
                    <ellipse
                      cx={q.x + (hash(k * 3.3) * 2 - 1) * w * 0.3}
                      cy={q.y}
                      rx={Math.min(13, 5 + w * 0.18)}
                      ry={Math.min(19, 8 + w * 0.24)}
                      fill="rgba(244,234,216,0.5)"
                    />
                    <ellipse
                      cx={q.x + (hash(k * 3.3) * 2 - 1) * w * 0.3}
                      cy={q.y - 26}
                      rx={2.4}
                      ry={20}
                      fill="rgba(244,234,216,0.16)"
                    />
                  </g>
                );
              })}
            </g>

            {/* HIFAS — resplandor + trazo que se dibuja solo */}
            <g filter="url(#ph_glow)" opacity={0.42 + 0.2 * pulse}>
              {HIFAS.map((h, i) => {
                const st = h0 + (h.gen / 4) * hSpan * 0.62 + hash(h.k) * hSpan * 0.16;
                const pr = interpolate(frame, [st, st + hSpan * 0.34], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.quad),
                });
                if (pr <= 0) return null;
                return (
                  <path
                    key={`g${i}`}
                    d={h.d}
                    pathLength={1}
                    fill="none"
                    stroke={GOOD}
                    strokeWidth={hair(14 - h.gen * 2.6)}
                    strokeLinecap="round"
                    strokeDasharray={1}
                    strokeDashoffset={1 - pr}
                  />
                );
              })}
            </g>
            {HIFAS.map((h, i) => {
              const st = h0 + (h.gen / 4) * hSpan * 0.62 + hash(h.k) * hSpan * 0.16;
              const pr = interpolate(frame, [st, st + hSpan * 0.34], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.quad),
              });
              if (pr <= 0) return null;
              return (
                <path
                  key={`h${i}`}
                  d={h.d}
                  pathLength={1}
                  fill="none"
                  stroke="url(#ph_hifa)"
                  strokeWidth={hair(6.4 - h.gen * 1.25)}
                  strokeLinecap="round"
                  strokeDasharray={1}
                  strokeDashoffset={1 - pr}
                  opacity={0.94}
                />
              );
            })}
            {/* vesículas en las puntas */}
            {TIPS.map((h, i) => {
              const st = h0 + (h.gen / 4) * hSpan * 0.62 + hash(h.k) * hSpan * 0.16 + hSpan * 0.3;
              const pop = spring({
                frame: Math.max(0, frame - st),
                fps,
                config: { damping: 11, mass: 0.6, stiffness: 220 },
                durationInFrames: 16,
              });
              if (pop <= 0.001) return null;
              return (
                <circle
                  key={`t${i}`}
                  cx={h.ex}
                  cy={h.ey}
                  r={(2.6 + hash(h.k * 2.2) * 3) * pop}
                  fill="#e8d9a8"
                  opacity={0.5 + 0.35 * pulse}
                />
              );
            })}
            {/* savia viva: pulso corto corriendo por los troncos */}
            {HIFAS.filter((h) => h.gen === 0).map((h, i) => {
              const off = -(((p * 1.5 + i * 0.19) % 1));
              return (
                <path
                  key={`pl${i}`}
                  d={h.d}
                  pathLength={1}
                  fill="none"
                  stroke={CREMA}
                  strokeWidth={hair(3)}
                  strokeLinecap="round"
                  strokeDasharray="0.07 0.93"
                  strokeDashoffset={off}
                  opacity={0.55 * fIn(0.45, 0.58)}
                />
              );
            })}

            {/* LA MANCHA: lo que fructifica, arriba (se decolora con el cloro) */}
            <g opacity={stainOp}>
              <g filter="url(#ph_soft)">
                <ellipse cx={900} cy={296} rx={300} ry={44} fill="#0e0b07" opacity={0.9} />
                <ellipse cx={1180} cy={300} rx={190} ry={34} fill="#100d09" opacity={0.8} />
                <ellipse cx={720} cy={302} rx={150} ry={28} fill="#120e0a" opacity={0.7} />
                <ellipse cx={975} cy={322} rx={340} ry={30} fill="#0b0906" opacity={0.65} />
              </g>
              {STALKS.map((s, i) => (
                <g key={`st${i}`}>
                  <path
                    d={`M ${s.x} ${SURFACE + 4} L ${s.x + s.lean} ${SURFACE - s.h}`}
                    stroke="#0d0a07"
                    strokeWidth={hair(2.6)}
                    strokeLinecap="round"
                  />
                  <circle cx={s.x + s.lean} cy={SURFACE - s.h - s.r * 0.6} r={s.r} fill="#0c0906" />
                  <circle
                    cx={s.x + s.lean - s.r * 0.3}
                    cy={SURFACE - s.h - s.r * 0.9}
                    r={s.r * 0.32}
                    fill={CREMA}
                    opacity={0.14}
                  />
                </g>
              ))}
            </g>

            {/* esporas soltándose */}
            <g opacity={sporeOp}>
              {SPORES.map((s, i) => {
                const u = (p * 1.9 + s.ph) % 1;
                return (
                  <circle
                    key={`e${i}`}
                    cx={s.x + Math.sin(u * 5.4 + s.ph * 9) * 26}
                    cy={SURFACE - 26 - u * 190}
                    r={s.r}
                    fill={CREMA}
                    opacity={Math.sin(u * Math.PI) * 0.7}
                  />
                );
              })}
            </g>

            {/* EL CLORO: frente que baja y se frena en la capita */}
            <g opacity={chl > 0.001 ? 1 : 0}>
              <rect
                x={-160}
                y={-420}
                width={2240}
                height={(SURFACE + SKIN + 420) * chl}
                fill="url(#ph_chl)"
                opacity={0.9}
              />
              <path
                d={`M -160 ${chlFront.toFixed(1)} L 2080 ${chlFront.toFixed(1)}`}
                stroke={CREMA}
                strokeWidth={hair(3)}
                opacity={0.5 * (1 - bleach * 0.5)}
              />
            </g>

            {/* límite real de lo que limpia el cloro */}
            <g opacity={fIn(0.78, 0.88)}>
              <path
                d={`M -160 ${SURFACE + SKIN} L 2080 ${SURFACE + SKIN}`}
                stroke={DANGER}
                strokeWidth={hair(3.4)}
                strokeDasharray={`${hair(20)} ${hair(14)}`}
              />
              {[700, 960, 1220].map((ax) => (
                <g key={`ar${ax}`} stroke={DANGER} strokeWidth={hair(3)} fill="none">
                  <path d={`M ${ax} ${SURFACE - 16} L ${ax} ${SURFACE + SKIN - 6}`} />
                  <path
                    d={`M ${ax - 9} ${SURFACE + SKIN - 16} L ${ax} ${SURFACE + SKIN - 4} L ${ax + 9} ${SURFACE + SKIN - 16}`}
                  />
                </g>
              ))}
            </g>

            {/* corchete de la zona viva */}
            <g opacity={bracket * 0.85}>
              <path
                d={`M 1452 ${SURFACE + SKIN + 40} L 1500 ${SURFACE + SKIN + 40} L 1500 1200 L 1452 1200`}
                fill="none"
                stroke={GOOD}
                strokeWidth={hair(3.4)}
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - bracket}
              />
            </g>
          </g>

          {/* ═══ PANTALLA (fuera de la cámara) ═══ */}
          {/* anillo de inmersión: entramos al poro */}
          <g opacity={dive * 0.6}>
            <circle
              cx={sx(960)}
              cy={sy(PORE_TOP + 40)}
              r={diveR}
              fill="none"
              stroke={GOLD}
              strokeWidth={2.4}
              strokeDasharray="16 22"
              transform={`rotate(${(frame * 0.7).toFixed(2)} ${sx(960).toFixed(1)} ${sy(PORE_TOP + 40).toFixed(1)})`}
            />
            <circle
              cx={sx(960)}
              cy={sy(PORE_TOP + 40)}
              r={diveR * 0.62}
              fill="none"
              stroke={CREMA}
              strokeWidth={1.2}
              opacity={0.5}
            />
          </g>

          {/* guías de los rótulos */}
          <path
            d={`M ${sx(742) - 170} ${sy(272)} L ${sx(742)} ${sy(272)}`}
            stroke={CREMA}
            strokeWidth={2}
            opacity={l1 * 0.55}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - l1}
          />
          <path
            d={`M ${sx(700) - 150} ${sy(940)} L ${sx(700)} ${sy(940)}`}
            stroke={GOOD}
            strokeWidth={2}
            opacity={l2 * 0.7}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - l2}
          />
          <path
            d={`M ${sx(430)} ${sy(SURFACE + SKIN)} L ${sx(430)} ${sy(SURFACE + SKIN) - 86}`}
            stroke={DANGER}
            strokeWidth={2}
            opacity={l3 * 0.8}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - l3}
          />

          {/* grano de papel, estático (no titila) */}
          <rect
            x={0}
            y={0}
            width={1920}
            height={1080}
            filter="url(#ph_grain)"
            opacity={0.07}
            style={{ mixBlendMode: "overlay" }}
          />
        </svg>

        {/* viñeta */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(78% 62% at 50% 48%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.52) 100%)",
          }}
        />

        {/* ═══ RÓTULOS (máx 3) ═══ */}
        {l1 > 0.002 ? (
          <Rotulo
            x={sx(742) - 196}
            y={sy(272)}
            align="right"
            vAlign="middle"
            show={l1}
            text="Lo que ves"
            color={CREMA}
            font={SERIF}
            size={58}
            tracking={1}
            upper={false}
          />
        ) : null}
        {l2 > 0.002 ? (
          <Rotulo
            x={sx(700) - 176}
            y={sy(940)}
            align="right"
            vAlign="middle"
            show={l2}
            text="La raíz viva"
            color={GOOD}
            font={SERIF}
            size={62}
            tracking={1}
            upper={false}
          />
        ) : null}
        {l3 > 0.002 ? (
          <Rotulo
            x={sx(430)}
            y={sy(SURFACE + SKIN) - 104}
            align="left"
            vAlign="bottom"
            show={l3}
            text="El cloro llega hasta aquí"
            color={DANGER}
            font={SANS}
            size={34}
            tracking={3.4}
            upper
          />
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
