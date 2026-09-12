import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Media } from "../components/Media";
import { THEME_MEDICO } from "../kit/premium/theme";

/* ============================================================================
 * SkinLayerBuild — el CORTE TRANSVERSAL de la piel que SE CONSTRUYE por etapas
 * ----------------------------------------------------------------------------
 * Explainer estilo BBC, no infografía plana: el dibujo nace vacío y se va
 * levantando capa por capa mientras entran los chips de rótulo. Lo anterior
 * NUNCA desaparece — se atenúa y queda de contexto, así el espectador ve el
 * mecanismo completo al final.
 *
 *   ETAPA 1  piel normal          dermis + epidermis con grosor tranquilo
 *   ETAPA 2  llega insulina       puntos teal que suben por la sangre
 *   ETAPA 3  receptores           se encienden y pulsan cuando los tocan
 *   ETAPA 4  piel gruesa/oscura   la epidermis crece y vira a pardo cálido
 *
 * MODELO DE CAPAS (stagecraft L1→L9), cada una a su propio ritmo:
 *   L1 PLATE    foto de cama (`bed`) escalada+desenfocada · o degradé profundo
 *   L2 GRADE    scrim direccional que hunde el plate
 *   L3 AURORA   manchas de luz teal/oro que respiran (periodo largo)
 *   L4 SCAN     retícula clínica + barrido lento
 *   L5 ART      el corte transversal en SVG (push de cámara + parallax)
 *   L6 CHIPS    tarjetas claras de rótulo, escalonadas
 *   L7 TYPE     eyebrow + título
 *   L8 MOTES    motas de polvo con profundidad
 *   L9 LENS     viñeta + halación
 *
 * 100% determinista (rand por índice, cero Date.now/Math.random). 1920x1080.
 * Entrada y SALIDA derivadas de durationInFrames.
 * ========================================================================== */

const T = THEME_MEDICO;
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* --------------------------------- paleta -------------------------------- */
const BG_HI = "#0E1D23";
const BG_LO = "#071216";
const TEAL = "#12B3AE";
const TEAL_HI = "#4FE3DA";
const TEAL_DEEP = "#063B40";
const CREAM = "#F5F9FA";
const INK = "#0E1B22";
const GOLD = "#E6A23C";
const ALERT = "#E0523E";

/* piel: normal → engrosada / parda */
const EPI_A = "#F0DCC9";
const EPI_B = "#8A5A34";
const EPI_EDGE_A = "#D8B99D";
const EPI_EDGE_B = "#6B421F";
const DERM_A = "#C98F7A";
const DERM_B = "#A56A55";

/* ------------------------------- utilidades ------------------------------ */
const rand = (i: number, salt = 0): number =>
  (((i * 37 + salt * 101 + 13) * 9301 + 49297) % 233280) / 233280;

const cl01 = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => {
  const k = cl01(t);
  return k * k * (3 - 2 * k);
};
const hex = (h: string): [number, number, number] => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];
const mix = (a: string, b: string, t: number) => {
  const k = cl01(t);
  const [r1, g1, b1] = hex(a);
  const [r2, g2, b2] = hex(b);
  return `rgb(${Math.round(r1 + (r2 - r1) * k)},${Math.round(g1 + (g2 - g1) * k)},${Math.round(
    b1 + (b2 - b1) * k
  )})`;
};

/* --------------------- geometría del corte transversal -------------------- */
const X0 = 648;
const X1 = 1852;
const SEG = 7;
const STEP = (X1 - X0) / SEG;

/** y de una "capa orgánica" en x (misma fórmula que usa el path → coherente) */
const wy = (x: number, y0: number, amp: number, ph: number) =>
  y0 + Math.sin(ph + ((x - X0) / STEP) * 1.05) * amp;

/** trazo suave (curvas, NUNCA rectángulos) a lo ancho del corte */
const waveD = (y0: number, amp: number, ph: number, reverse = false) => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= SEG; i++) {
    const x = X0 + STEP * i;
    pts.push([x, wy(x, y0, amp, ph)]);
  }
  const list = reverse ? pts.slice().reverse() : pts;
  let d = `${reverse ? "L" : "M"} ${list[0][0].toFixed(1)} ${list[0][1].toFixed(1)}`;
  for (let i = 0; i < list.length - 1; i++) {
    const [xa, ya] = list[i];
    const [xb, yb] = list[i + 1];
    d += ` C ${(xa + (xb - xa) * 0.42).toFixed(1)} ${ya.toFixed(1)} ${(xb - (xb - xa) * 0.42).toFixed(
      1
    )} ${yb.toFixed(1)} ${xb.toFixed(1)} ${yb.toFixed(1)}`;
  }
  return d;
};

/** banda cerrada entre dos capas orgánicas */
const bandD = (yT: number, aT: number, pT: number, yB: number, aB: number, pB: number) =>
  `${waveD(yT, aT, pT)} ${waveD(yB, aB, pB, true)} Z`;

const Y_SURF = 322; // techo de la epidermis (etapa 1)
const Y_BASAL = 496; // membrana basal (donde viven los receptores)
const Y_DERM = 792; // piso de la dermis
const Y_VES_T = 862; // techo del vaso sanguíneo
const Y_VES_B = 962;
const A_SURF = 8;
const P_SURF = 2.15;
const A_BASAL = 11;
const P_BASAL = 0.42;
const A_DERM = 14;
const P_DERM = 1.15;

type Stage = { label: string; sub?: string };

const DEFAULT_STAGES: Stage[] = [
  { label: "La piel normal", sub: "Epidermis y dermis, cada una en su lugar" },
  { label: "Llega insulina de más", sub: "Viaja por la sangre y se acumula abajo" },
  { label: "Aprietan los receptores del crecimiento", sub: "Se encienden en la base de la epidermis" },
  { label: "La piel se engruesa y se ve más oscura", sub: "Más capas, más pigmento, más marcas" },
];

/* ═══════════════════════════ L1 · PLATE (cama) ═══════════════════════════ */
const Bed: React.FC<{ bed?: string; frame: number }> = ({ bed, frame }) => {
  const drift = Math.sin(frame / 210) * 14;
  const driftY = Math.cos(frame / 260) * 9;
  if (!bed) {
    return (
      <AbsoluteFill
        style={{
          background: `radial-gradient(128% 96% at 22% 12%, #16323A 0%, ${BG_HI} 42%, ${BG_LO} 100%)`,
        }}
      >
        <AbsoluteFill
          style={{
            background: `radial-gradient(70% 60% at 78% 82%, ${TEAL_DEEP}88 0%, transparent 68%)`,
            transform: `translate(${drift * 0.6}px, ${driftY * 0.6}px)`,
          }}
        />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: BG_LO }}>
      <AbsoluteFill
        style={{
          transform: `scale(1.16) translate(${drift}px, ${driftY}px)`,
        }}
      >
        <Media
          src={bed}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(26px) saturate(0.72) brightness(0.44) contrast(1.05)",
          }}
        />
      </AbsoluteFill>
      {/* scrim de color: la cama NUNCA compite con el dibujo */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(103deg, ${BG_HI}F2 0%, ${BG_HI}D6 46%, ${BG_LO}CC 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const SkinLayerBuild: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  stages?: Stage[];
  bed?: string;
}> = ({
  durationInFrames,
  eyebrow = "POR QUÉ SE OSCURECE",
  title = "Insulina de más, piel de más",
  stages,
  bed,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(60, durationInFrames);
  const list = stages && stages.length ? stages : DEFAULT_STAGES;
  const n = list.length;

  /* ── reparto del tiempo entre etapas (entrada 10, salida 12) ── */
  const IN = 10;
  const OUT = 12;
  const seg = Math.max(18, (D - OUT - IN) / n);
  const at = (i: number) => IN + i * seg;
  const prog = (i: number) => ease((frame - at(i)) / (seg * 0.66));

  const p0 = prog(0);
  const p1 = prog(1);
  const p2 = prog(2);
  const p3 = prog(3 < n ? 3 : n - 1);
  const grow = n >= 4 ? p3 : 0; // engrosamiento de la epidermis

  /* ── entrada / salida de la escena entera ── */
  const intro = interpolate(frame, [0, IN], [0, 1], CLAMP);
  const outro = interpolate(frame, [D - OUT, D - 1], [1, 0], CLAMP);
  const outScale = interpolate(frame, [D - OUT, D - 1], [1, 0.982], CLAMP);

  /* ── L5 · cámara: push lentísimo + parallax propio ── */
  const push = interpolate(frame, [0, D], [1.0, 1.062], CLAMP);
  const artX = Math.sin(frame / 165) * 7;
  const artY = Math.cos(frame / 198) * 5;

  /* ── etapa 4: la epidermis crece hacia arriba y vira a pardo ── */
  const ySurf = Y_SURF - grow * 74;
  const epiTop = mix(EPI_A, EPI_B, grow);
  const epiEdge = mix(EPI_EDGE_A, EPI_EDGE_B, grow);

  /* ── trazado de contornos (stroke-dashoffset) ── */
  const LEN = 3200;
  const draw = (t: number) => ({
    strokeDasharray: LEN,
    strokeDashoffset: LEN * (1 - cl01(t)),
  });
  const dDerm = ease((frame - at(0) - 2) / 30);
  const dEpi = ease((frame - at(0) - 12) / 30);
  const dVes = ease((frame - at(1) + 2) / 26);

  /* ── etapa 2: puntos de insulina que suben por la sangre ── */
  const DOTS = 30;
  const dots = Array.from({ length: DOTS }, (_, i) => {
    const x = X0 + 46 + rand(i, 2) * (X1 - X0 - 92);
    const delay = rand(i, 1) * 30 + (i % 6) * 3;
    const p = ease((frame - at(1) - delay) / 44);
    const yFrom = Y_VES_T + 24 + rand(i, 3) * 60;
    const yTo = wy(x, Y_BASAL, A_BASAL, P_BASAL) + 26 + rand(i, 4) * 34;
    const y = yFrom + (yTo - yFrom) * p + Math.sin(frame / 13 + i * 1.7) * 3.2 * p;
    const r = 6 + rand(i, 5) * 5;
    return { x, y, r, p, o: p * (0.55 + rand(i, 6) * 0.45), i };
  });

  /* ── etapa 3: receptores del crecimiento sobre la basal ── */
  const RECS = 7;
  const recs = Array.from({ length: RECS }, (_, k) => {
    const x = X0 + ((k + 0.5) * (X1 - X0)) / RECS;
    const y = wy(x, Y_BASAL, A_BASAL, P_BASAL);
    const lit = ease((frame - at(2) - k * 5) / 20);
    const pulse = 0.5 + 0.5 * Math.sin(frame / 8.5 + k * 0.9);
    return { x, y, lit, pulse, k };
  });

  /* ── etapa 4: líneas de superficie (la piel se marca) ── */
  const LINES = 9;

  /* ── L8 · motas ── */
  const MOTES = 22;

  return (
    <AbsoluteFill
      style={{
        fontFamily: T.fontBody,
        backgroundColor: BG_LO,
        overflow: "hidden",
        opacity: intro * outro,
        transform: `scale(${outScale})`,
      }}
    >
      {/* L1 · PLATE */}
      <Bed bed={bed} frame={frame} />

      {/* L2 · GRADE — hunde el lado del texto para que el chip claro pese */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(96deg, rgba(4,12,16,0.82) 0%, rgba(4,12,16,0.46) 34%, rgba(4,12,16,0.02) 62%)`,
        }}
      />

      {/* L3 · AURORA — manchas de luz que respiran (periodo LARGO) */}
      <AbsoluteFill style={{ opacity: 0.75 }}>
        {Array.from({ length: 4 }, (_, i) => {
          const bx = 18 + rand(i, 11) * 70 + Math.sin(frame / (250 + i * 41)) * 2.4;
          const by = 16 + rand(i, 12) * 68 + Math.cos(frame / (290 + i * 37)) * 1.8;
          const size = 420 + rand(i, 13) * 520;
          const col = i === 1 ? GOLD : TEAL;
          const breath = 0.5 + 0.5 * Math.sin(frame / (96 + i * 23) + i);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${bx}%`,
                top: `${by}%`,
                width: size,
                height: size * 0.72,
                marginLeft: -size / 2,
                marginTop: -size * 0.36,
                borderRadius: "50%",
                background: `radial-gradient(closest-side, ${col}, transparent 72%)`,
                filter: `blur(${52 + rand(i, 14) * 40}px)`,
                opacity: 0.1 + breath * 0.14,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* L4 · SCAN — retícula clínica + barrido lento (ritmo medio) */}
      <AbsoluteFill style={{ opacity: 0.5 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${TEAL}0E 1px, transparent 1px), linear-gradient(90deg, ${TEAL}0E 1px, transparent 1px)`,
            backgroundSize: "120px 120px",
            backgroundPosition: `${(frame * 0.16) % 120}px ${(frame * 0.1) % 120}px`,
            maskImage: "radial-gradient(70% 62% at 62% 52%, #000 0%, transparent 82%)",
            WebkitMaskImage: "radial-gradient(70% 62% at 62% 52%, #000 0%, transparent 82%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: 320,
            left: `${((frame * 0.9) % 2400) - 320}px`,
            background: `linear-gradient(90deg, transparent, ${TEAL}14, transparent)`,
            filter: "blur(6px)",
          }}
        />
      </AbsoluteFill>

      {/* L5 · ART — el corte transversal */}
      <AbsoluteFill
        style={{
          transform: `scale(${push}) translate(${artX}px, ${artY}px)`,
          transformOrigin: "62% 54%",
        }}
      >
        <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="slb_derm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={DERM_A} stopOpacity="0.92" />
              <stop offset="1" stopColor={DERM_B} stopOpacity="0.68" />
            </linearGradient>
            <linearGradient id="slb_epi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={epiTop} stopOpacity="0.97" />
              <stop offset="1" stopColor={epiEdge} stopOpacity="0.88" />
            </linearGradient>
            <linearGradient id="slb_ves" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={TEAL_DEEP} stopOpacity="0.9" />
              <stop offset="1" stopColor="#04262A" stopOpacity="0.95" />
            </linearGradient>
            <radialGradient id="slb_recglow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor={TEAL_HI} stopOpacity="0.85" />
              <stop offset="1" stopColor={TEAL_HI} stopOpacity="0" />
            </radialGradient>
            <filter id="slb_soft" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
            <clipPath id="slb_epiclip">
              <path d={bandD(ySurf, A_SURF, P_SURF, Y_BASAL, A_BASAL, P_BASAL)} />
            </clipPath>
            <clipPath id="slb_dermclip">
              <path d={bandD(Y_BASAL, A_BASAL, P_BASAL, Y_DERM, A_DERM, P_DERM)} />
            </clipPath>
          </defs>

          {/* sombra de contacto del corte (le da peso, no flota) */}
          <ellipse
            cx={(X0 + X1) / 2}
            cy={Y_DERM + 46}
            rx={(X1 - X0) / 2}
            ry={54}
            fill="#000"
            opacity={0.34 * p0}
            filter="url(#slb_soft)"
          />

          {/* ── ETAPA 1a · DERMIS ── */}
          <g opacity={cl01(p0) * (1 - grow * 0.18)}>
            <path d={bandD(Y_BASAL, A_BASAL, P_BASAL, Y_DERM, A_DERM, P_DERM)} fill="url(#slb_derm)" opacity={0.9 * p0} />
            {/* textura orgánica: fibras de colágeno */}
            <g clipPath="url(#slb_dermclip)" opacity={0.5 * p0}>
              {Array.from({ length: 12 }, (_, i) => {
                const y = Y_BASAL + 34 + rand(i, 21) * (Y_DERM - Y_BASAL - 60);
                const amp = 6 + rand(i, 22) * 12;
                const ph = rand(i, 23) * 6;
                const dw = ease((frame - at(0) - 8 - i * 2) / 26);
                return (
                  <path
                    key={i}
                    d={waveD(y, amp, ph)}
                    fill="none"
                    stroke="#F6E4D8"
                    strokeOpacity={0.34}
                    strokeWidth={2 + rand(i, 24) * 2}
                    strokeLinecap="round"
                    {...draw(dw)}
                  />
                );
              })}
            </g>
            <path
              d={waveD(Y_DERM, A_DERM, P_DERM)}
              fill="none"
              stroke={TEAL}
              strokeOpacity={0.55}
              strokeWidth={3}
              strokeLinecap="round"
              {...draw(dDerm)}
            />
          </g>

          {/* ── ETAPA 1b · EPIDERMIS (crece en la etapa 4) ── */}
          <g opacity={cl01(p0)}>
            <path d={bandD(ySurf, A_SURF, P_SURF, Y_BASAL, A_BASAL, P_BASAL)} fill="url(#slb_epi)" opacity={0.95 * p0} />
            {/* estratos internos: se multiplican cuando engruesa */}
            <g clipPath="url(#slb_epiclip)">
              {Array.from({ length: 5 }, (_, i) => {
                const t = (i + 1) / 6;
                const y = ySurf + (Y_BASAL - ySurf) * t;
                const vis = i < 3 ? p0 : grow;
                return (
                  <path
                    key={i}
                    d={waveD(y, A_SURF + (A_BASAL - A_SURF) * t, P_SURF + (P_BASAL - P_SURF) * t)}
                    fill="none"
                    stroke={mix("#B9977E", "#4E2E14", grow)}
                    strokeOpacity={0.42 * cl01(vis)}
                    strokeWidth={2}
                  />
                );
              })}
            </g>
            {/* techo de la piel */}
            <path
              d={waveD(ySurf, A_SURF, P_SURF)}
              fill="none"
              stroke={mix("#FFF3E6", "#C79362", grow)}
              strokeWidth={4.5}
              strokeLinecap="round"
              {...draw(dEpi)}
            />
            {/* membrana basal */}
            <path
              d={waveD(Y_BASAL, A_BASAL, P_BASAL)}
              fill="none"
              stroke={TEAL_HI}
              strokeOpacity={0.4 + 0.35 * cl01(p2)}
              strokeWidth={3.5}
              strokeLinecap="round"
              {...draw(dEpi)}
            />

            {/* ETAPA 4 · líneas de la superficie (la piel se marca) */}
            {Array.from({ length: LINES }, (_, i) => {
              const x = X0 + 70 + (i * (X1 - X0 - 140)) / (LINES - 1);
              const y = wy(x, ySurf, A_SURF, P_SURF);
              const g = ease((frame - at(3 < n ? 3 : n - 1) - 10 - i * 3) / 18);
              const len = 30 + rand(i, 31) * 26;
              return (
                <path
                  key={i}
                  d={`M ${x - 8} ${y - 4} Q ${x + len / 2} ${y + 12} ${x + len} ${y - 2}`}
                  fill="none"
                  stroke="#4A2A11"
                  strokeOpacity={0.5 * g}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              );
            })}
          </g>

          {/* ── ETAPA 3 · RECEPTORES del crecimiento ── */}
          <g>
            {recs.map((r) => {
              const on = cl01(r.lit);
              const glow = on * (0.35 + r.pulse * 0.65);
              const s = 1 + on * 0.12 * r.pulse;
              return (
                <g key={r.k} transform={`translate(${r.x} ${r.y}) scale(${s})`}>
                  <circle r={44} fill="url(#slb_recglow)" opacity={0.55 * glow} />
                  {/* copita receptora anclada en la basal */}
                  <path
                    d="M -20 6 C -20 -16, 20 -16, 20 6"
                    fill="none"
                    stroke={on > 0.02 ? TEAL_HI : TEAL}
                    strokeOpacity={0.35 + 0.65 * on}
                    strokeWidth={5}
                    strokeLinecap="round"
                  />
                  <path d="M 0 6 L 0 24" stroke={TEAL} strokeOpacity={0.35 + 0.5 * on} strokeWidth={4} strokeLinecap="round" />
                  <circle
                    r={7 + on * 3}
                    cy={-6}
                    fill={TEAL_HI}
                    opacity={0.25 + 0.75 * glow}
                  />
                </g>
              );
            })}
          </g>

          {/* ── ETAPA 2 · el vaso sanguíneo y los puntos de insulina ── */}
          <g opacity={cl01(p1)}>
            <path d={bandD(Y_VES_T, 10, 0.8, Y_VES_B, 12, 1.9)} fill="url(#slb_ves)" opacity={0.85} />
            <path
              d={waveD(Y_VES_T, 10, 0.8)}
              fill="none"
              stroke={TEAL}
              strokeOpacity={0.6}
              strokeWidth={3}
              strokeLinecap="round"
              {...draw(dVes)}
            />
          </g>
          <g>
            {dots.map((d) => (
              <g key={d.i} opacity={d.o}>
                <circle cx={d.x} cy={d.y} r={d.r * 2.6} fill={TEAL_HI} opacity={0.16} />
                <circle cx={d.x} cy={d.y} r={d.r} fill={TEAL_HI} />
                {/* estela mientras sube */}
                <path
                  d={`M ${d.x} ${d.y + 8} L ${d.x} ${d.y + 8 + 26 * (1 - d.p)}`}
                  stroke={TEAL_HI}
                  strokeOpacity={0.35 * (1 - d.p)}
                  strokeWidth={d.r * 0.9}
                  strokeLinecap="round"
                />
              </g>
            ))}
          </g>

          {/* rótulos anatómicos (chiquitos, sobre pastilla oscura) */}
          {[
            { t: "EPIDERMIS", y: (ySurf + Y_BASAL) / 2 + 8, on: p0 },
            { t: "DERMIS", y: (Y_BASAL + Y_DERM) / 2 + 8, on: p0 },
            { t: "SANGRE", y: (Y_VES_T + Y_VES_B) / 2 + 8, on: p1 },
          ].map((a, i) => (
            <g key={i} opacity={cl01(a.on) * 0.95}>
              <rect x={X0 + 20} y={a.y - 28} rx={16} ry={16} width={218} height={40} fill="#061318" opacity={0.62} />
              <text
                x={X0 + 40}
                y={a.y}
                fill={TEAL_HI}
                fontFamily={T.fontLabel}
                fontSize={24}
                fontWeight={800}
                letterSpacing={5}
              >
                {a.t}
              </text>
            </g>
          ))}
        </svg>
      </AbsoluteFill>

      {/* L7 · TYPE — eyebrow + título */}
      <div style={{ position: "absolute", left: 76, top: 84, width: 600 }}>
        <div
          style={{
            opacity: interpolate(frame, [4, 20], [0, 1], CLAMP),
            transform: `translateY(${interpolate(frame, [4, 20], [16, 0], CLAMP)}px)`,
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 18,
          }}
        >
          <div style={{ width: 46, height: 5, borderRadius: 3, background: TEAL_HI }} />
          <span
            style={{
              fontSize: 27,
              fontWeight: 800,
              letterSpacing: 6,
              color: TEAL_HI,
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </span>
        </div>
        <div
          style={{
            opacity: interpolate(frame, [8, 26], [0, 1], CLAMP),
            transform: `translateY(${interpolate(frame, [8, 26], [22, 0], CLAMP)}px)`,
            fontSize: title.length > 34 ? 52 : 60,
            lineHeight: 1.08,
            fontWeight: 900,
            color: CREAM,
            textShadow: "0 2px 10px rgba(0,0,0,0.6), 0 18px 46px rgba(0,0,0,0.45)",
          }}
        >
          {title}
        </div>
      </div>

      {/* L6 · CHIPS — tarjetas CLARAS, escalonadas; las viejas quedan atenuadas */}
      <div
        style={{
          position: "absolute",
          left: 76,
          top: 284,
          width: 566,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {list.map((s, i) => {
          const sp = spring({
            frame: frame - Math.round(at(i)) - 3,
            fps,
            config: { damping: 18, mass: 0.9, stiffness: 130 },
            durationInFrames: 20,
          });
          const active = i === Math.min(n - 1, Math.max(0, Math.floor((frame - IN) / seg)));
          const dim = sp > 0.02 ? (active ? 1 : 0.52) : 0;
          const blur = (1 - sp) * 8;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
                padding: "20px 26px",
                borderRadius: T.radius,
                background: active ? T.color.surfaceStrong : "rgba(240,247,249,0.90)",
                border: `1px solid ${active ? TEAL : "rgba(255,255,255,0.5)"}`,
                boxShadow: active
                  ? `0 22px 54px rgba(0,0,0,0.45), 0 0 0 4px ${TEAL}2E`
                  : "0 12px 30px rgba(0,0,0,0.34)",
                opacity: dim,
                transform: `translateX(${(1 - sp) * -34}px) scale(${active ? 1 : 0.965})`,
                filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : undefined,
              }}
            >
              <div
                style={{
                  flex: "0 0 auto",
                  width: 54,
                  height: 54,
                  borderRadius: 27,
                  background: active ? TEAL : TEAL_DEEP,
                  color: active ? "#04252A" : CREAM,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  fontWeight: 900,
                  boxShadow: active ? `0 0 26px ${TEAL}88` : "none",
                }}
              >
                {i + 1}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 34, lineHeight: 1.14, fontWeight: 800, color: INK }}>{s.label}</div>
                {s.sub && (
                  <div style={{ fontSize: 23, lineHeight: 1.25, fontWeight: 600, color: "rgba(14,27,34,0.62)", marginTop: 6 }}>
                    {s.sub}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* L8 · MOTES — polvo con profundidad (ritmo rápido, amplitud chica) */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {Array.from({ length: MOTES }, (_, i) => {
          const depth = rand(i, 41);
          const span = 240 + rand(i, 42) * 200;
          const p = ((frame * (0.45 + depth) + rand(i, 43) * span) % span) / span;
          const x = rand(i, 44) * 100 + Math.sin(frame / 58 + i * 1.7) * (1 + depth * 3);
          const y = 100 - p * 108;
          const size = 2 + depth * 6;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                borderRadius: "50%",
                background: i % 5 === 0 ? GOLD : TEAL_HI,
                opacity: Math.sin(p * Math.PI) * (0.1 + depth * 0.26),
                filter: `blur(${depth * 2.2}px)`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* L9 · LENS — halación + viñeta */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(46% 40% at 72% 46%, ${TEAL}10 0%, transparent 70%)`,
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(124% 94% at 52% 46%, rgba(0,0,0,0) 44%, rgba(0,0,0,0.28) 78%, rgba(0,0,0,0.56) 100%)",
        }}
      />
      {/* alerta sutil al final: la piel ya viró */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(0deg, ${ALERT}00 60%, ${ALERT}14 100%)`,
          opacity: cl01(grow) * 0.8,
        }}
      />
    </AbsoluteFill>
  );
};
