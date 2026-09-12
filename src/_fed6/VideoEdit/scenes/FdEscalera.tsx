import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ── FdEscalera ───────────────────────────────────────────────────────────────
// METÁFORA CENTRAL animada: la caída NO es una rampa suave, es una ESCALERA.
// Se dibuja (tiza clínica) un escalón por evento; una figura humana baja uno por
// uno; cada nivel abandonado queda como LÍNEA PUNTEADA que ya no se recupera.
// Al fondo, tenue, la RAMPA que la gente CREE. Cámara con travelling hacia abajo.
//
// 100% SVG/CSS, fondo opaco propio, determinista (sin random / sin Date).

const INTER = loadInter().fontFamily;
const FONT = `${INTER}, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`;

const C = {
  paper: "#F4F7F9",
  card: "#FFFFFF",
  ink: "#14232B",
  soft: "rgba(20,35,43,0.62)",
  dim: "rgba(20,35,43,0.34)",
  teal: "#109C99",
  teal2: "#12B3AE",
  tealSoft: "#7FC9C6",
  coral: "#E0523E",
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export type Step = { label: string; sub?: string };

type Props = {
  durationInFrames: number;
  steps: Step[]; // 3 a 6 escalones (tolera 1..8 sin romperse)
  eyebrow?: string;
  title?: string;
  rampLabel?: string; // etiqueta de la rampa tenue del fondo
  tone?: "teal" | "warn";
};

export const FdEscalera: React.FC<Props> = ({
  durationInFrames,
  steps = [],
  eyebrow = "",
  title = "",
  rampLabel = "Lo que la gente cree",
  tone = "teal",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accent = tone === "warn" ? C.coral : C.teal;
  const accent2 = tone === "warn" ? "#F0765F" : C.teal2;

  // ── datos a prueba de balas ────────────────────────────────────────────────
  const src: Step[] = Array.isArray(steps) ? steps : [];
  const list: Step[] =
    src.length > 0
      ? src.slice(0, 8).map((s) => ({ label: s && s.label ? s.label : "", sub: s ? s.sub : undefined }))
      : [{ label: "Paso 1" }, { label: "Paso 2" }, { label: "Paso 3" }];
  const n = list.length;

  // ── geometría del mundo (se adapta a la cantidad de escalones) ─────────────
  const X0 = 150; // borde izquierdo del 1er escalón
  const RIGHT = 980; // hasta acá llega la escalera
  const treadW = clamp((RIGHT - X0) / n, 92, 300); // huella
  const dy = clamp(treadW * 1.15, 148, 250); // contrahuella
  const Y0 = 760; // Y del escalón 0 en coords de mundo
  const WORLD_H = Math.round(1280 + (n - 1) * dy);
  const AXIS_X = 54;
  const LABEL_X = 1035;
  const LABEL_W = 1920 - LABEL_X - 66;

  const tY = (i: number) => Y0 + i * dy; // i = -1 → descanso inicial
  const tX0 = (i: number) => (i === -1 ? -140 : X0 + i * treadW);
  const tX1 = (i: number) => X0 + (i + 1) * treadW;

  // ── tiempos derivados de la duración (5s a 14s) ────────────────────────────
  const IN = clamp(Math.round(durationInFrames * 0.13), 12, 34);
  const OUT = clamp(Math.round(durationInFrames * 0.1), 8, 26);
  const span = Math.max(n * 9, durationInFrames - IN - OUT);
  const per = span / n;
  const sAt = (i: number) => IN + i * per;
  const lead = clamp(per * 0.45, 6, 16);

  // ── posición continua de la figura (X adelanta, Y cae con snap) ────────────
  let px = -1;
  let py = -1;
  for (let i = 0; i < n; i++) {
    px += spring({ frame: frame - sAt(i), fps, config: { damping: 16, mass: 0.5, stiffness: 150 } });
    py += spring({ frame: frame - sAt(i) - 2, fps, config: { damping: 21, mass: 0.55, stiffness: 195 } });
  }
  const pos = py;
  const figX = X0 + (px + 0.5) * treadW;
  const figY = Y0 + py * dy;
  const frac = px - Math.floor(px);
  const swing = Math.sin(Math.PI * clamp(frac, 0, 1));

  // ── cámara: travelling lento siguiendo a la figura ─────────────────────────
  const drift = interpolate(frame, [0, Math.max(1, durationInFrames)], [0, 22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const camY = clamp(figY - 560 + drift, 0, WORLD_H - 1080);

  // ── entrada general (push-in leve; el fondo NUNCA se vuelve transparente) ──
  const inP = spring({ frame, fps, config: { damping: 20, mass: 0.8, stiffness: 90 } });
  const worldScale = interpolate(inP, [0, 1], [1.035, 1]);

  // ── rampa del fondo (lo que la gente cree) ─────────────────────────────────
  const rax = X0 - treadW * 0.5;
  const ray = tY(-1);
  const rbx = X0 + n * treadW;
  const rby = tY(n - 1);
  const rampD = `M ${rax} ${ray} C ${rax + (rbx - rax) * 0.5} ${ray}, ${rbx - (rbx - rax) * 0.5} ${rby}, ${rbx} ${rby}`;
  const rvx = rbx - rax;
  const rvy = rby - ray;
  const rlen = Math.max(1, Math.sqrt(rvx * rvx + rvy * rvy));
  const rampLen = Math.round(rlen * 1.18);
  const rampP = interpolate(frame, [2, IN + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rampMx = (rax + rbx) / 2 + (rvy / rlen) * 66;
  const rampMy = (ray + rby) / 2 - (rvx / rlen) * 66;
  const rampAng = (Math.atan2(rvy, rvx) * 180) / Math.PI;
  const rampLabP = interpolate(frame, [IN + 6, IN + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── eje vertical de niveles ────────────────────────────────────────────────
  const axisTop = tY(-1) - 46;
  const axisBot = tY(n - 1) + 78;
  const axisP = interpolate(frame, [4, IN + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const axisEnd = axisTop + (axisBot - axisTop) * axisP;

  // ── tipografía adaptativa (público adulto mayor: grande y con contraste) ───
  const labelFS = Math.round(clamp(dy * 0.26, 36, 52));
  const subFS = Math.round(labelFS * 0.6);
  const badge = Math.round(clamp(dy * 0.3, 46, 66));

  // ── header ─────────────────────────────────────────────────────────────────
  const headP = spring({ frame: frame - 3, fps, config: { damping: 18, stiffness: 115 } });
  const hasHead = Boolean(eyebrow || title);

  // ── helpers de dibujo ──────────────────────────────────────────────────────
  const drawP = (start: number, dur: number) =>
    interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // orden de trazo: contrahuella → huella, justo antes de que llegue la figura
  const riserP = (i: number) => (i === -1 ? 1 : drawP(sAt(i) - lead, 8));
  const treadDraw = (i: number) => (i === -1 ? drawP(2, 16) : drawP(sAt(i) - lead + 5, 11));

  // el nivel abandonado se apaga y queda punteado (no se recupera)
  const fadeOld = (i: number) =>
    interpolate(pos, [i + 0.3, i + 1], [1, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ghostP = (i: number) =>
    interpolate(pos, [i + 0.35, i + 1.05], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const idxs: number[] = [];
  for (let i = -1; i < n; i++) idxs.push(i);

  const nowIdx = clamp(Math.round(pos), -1, n - 1);

  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, fontFamily: FONT, overflow: "hidden" }}>
      {/* PAPEL: grilla clínica + hilo diagonal, muy sutil */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,156,153,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(16,156,153,0.045) 1px, transparent 1px), repeating-linear-gradient(45deg, rgba(20,35,43,0.018) 0px, rgba(20,35,43,0.018) 2px, transparent 2px, transparent 9px)",
          backgroundSize: "48px 48px, 48px 48px, auto",
        }}
      />
      {/* viñeta */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(118% 96% at 46% 42%, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0) 46%, rgba(20,35,43,0.10) 82%, rgba(20,35,43,0.20) 100%)",
        }}
      />

      {/* ── MUNDO (travelling) ──────────────────────────────────────────────── */}
      <AbsoluteFill style={{ transform: `scale(${worldScale})`, transformOrigin: "48% 46%" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1920,
            height: WORLD_H,
            transform: `translateY(${-camY}px)`,
          }}
        >
          <svg
            width={1920}
            height={WORLD_H}
            viewBox={`0 0 1920 ${WORLD_H}`}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <defs>
              <filter id="fdEscChalk" x="-4%" y="-4%" width="108%" height="108%">
                <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves={2} seed={9} result="fdn" />
                <feDisplacementMap in="SourceGraphic" in2="fdn" scale={4} xChannelSelector="R" yChannelSelector="G" />
              </filter>
              <linearGradient id="fdEscRamp" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={C.tealSoft} stopOpacity={0.8} />
                <stop offset="100%" stopColor={C.tealSoft} stopOpacity={0.26} />
              </linearGradient>
            </defs>

            {/* RAMPA tenue del fondo (la creencia) */}
            <g>
              <path
                d={rampD}
                fill="none"
                stroke="url(#fdEscRamp)"
                strokeWidth={16}
                strokeLinecap="round"
                strokeDasharray={`${rampLen} ${rampLen}`}
                strokeDashoffset={rampLen * (1 - rampP)}
              />
              <path
                d={rampD}
                fill="none"
                stroke={C.tealSoft}
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray="2 14"
                opacity={0.5 * rampP}
              />
            </g>

            {/* EJE de niveles + punta de flecha (baja) */}
            <g opacity={axisP}>
              <line x1={AXIS_X} y1={axisTop} x2={AXIS_X} y2={axisEnd} stroke={C.ink} strokeWidth={3} opacity={0.16} />
              <path
                d={`M ${AXIS_X - 11} ${axisEnd - 20} L ${AXIS_X} ${axisEnd} L ${AXIS_X + 11} ${axisEnd - 20}`}
                fill="none"
                stroke={C.ink}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.2}
              />
            </g>

            {/* NIVELES ABANDONADOS: punteado que ya no se recupera */}
            {idxs.map((i) => {
              const g = ghostP(i);
              if (g <= 0.001) return null;
              const from = i === -1 ? X0 : tX0(i);
              const x1 = from - (from - AXIS_X) * g;
              return (
                <g key={`ghost${i}`}>
                  <line
                    x1={x1}
                    y1={tY(i)}
                    x2={from}
                    y2={tY(i)}
                    stroke={C.ink}
                    strokeWidth={4}
                    strokeDasharray="3 15"
                    strokeLinecap="round"
                    opacity={0.32 * g}
                  />
                  <circle cx={AXIS_X} cy={tY(i)} r={6} fill={C.ink} opacity={0.22 * g} />
                </g>
              );
            })}

            {/* ESCALERA dibujada con tiza */}
            <g filter="url(#fdEscChalk)">
              {idxs.map((i) => {
                const tp = treadDraw(i);
                const rp = riserP(i);
                const op = fadeOld(i);
                const wide = i === -1 ? tX1(i) - tX0(i) : treadW;
                const isNow = nowIdx === i;
                return (
                  <g key={`st${i}`}>
                    {i >= 0 && rp > 0 ? (
                      <line
                        x1={tX0(i)}
                        y1={tY(i - 1)}
                        x2={tX0(i)}
                        y2={tY(i - 1) + dy * rp}
                        stroke={C.ink}
                        strokeWidth={7}
                        strokeLinecap="round"
                        opacity={0.45 * Math.max(op, 0.5)}
                      />
                    ) : null}
                    {tp > 0 ? (
                      <g>
                        <line
                          x1={tX0(i)}
                          y1={tY(i) + 5}
                          x2={tX0(i) + wide * tp}
                          y2={tY(i) + 5}
                          stroke={C.tealSoft}
                          strokeWidth={14}
                          strokeLinecap="round"
                          opacity={0.3 * op}
                        />
                        <line
                          x1={tX0(i)}
                          y1={tY(i)}
                          x2={tX0(i) + wide * tp}
                          y2={tY(i)}
                          stroke={C.ink}
                          strokeWidth={isNow ? 12 : 9}
                          strokeLinecap="round"
                          opacity={op}
                        />
                        {isNow ? (
                          <line
                            x1={tX0(i)}
                            y1={tY(i) + 13}
                            x2={tX0(i) + wide * tp}
                            y2={tY(i) + 13}
                            stroke={accent}
                            strokeWidth={5}
                            strokeLinecap="round"
                            opacity={0.75}
                          />
                        ) : null}
                      </g>
                    ) : null}
                  </g>
                );
              })}
            </g>

            {/* IMPACTO al pisar cada escalón */}
            {list.map((_, i) => {
              const s = sAt(i) + 3;
              const p = interpolate(frame, [s, s + 18], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              if (p <= 0 || p >= 1) return null;
              return (
                <circle
                  key={`imp${i}`}
                  cx={X0 + (i + 0.5) * treadW}
                  cy={tY(i)}
                  r={10 + 66 * p}
                  fill="none"
                  stroke={accent}
                  strokeWidth={4}
                  opacity={(1 - p) * 0.6}
                />
              );
            })}

            {/* GUÍAS punteadas hacia las etiquetas */}
            {list.map((_, i) => {
              const p = interpolate(frame, [sAt(i) + 2, sAt(i) + 16], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              if (p <= 0) return null;
              const a = tX1(i) + 12;
              const b = LABEL_X - 16;
              const act = nowIdx === i ? 1 : 0.42;
              return (
                <line
                  key={`lead${i}`}
                  x1={a}
                  y1={tY(i)}
                  x2={a + (b - a) * p}
                  y2={tY(i)}
                  stroke={accent}
                  strokeWidth={3}
                  strokeDasharray="3 12"
                  strokeLinecap="round"
                  opacity={0.55 * act * p}
                />
              );
            })}

            {/* FIGURA que baja */}
            <g transform={`translate(${figX} ${figY - 9 * swing}) rotate(${4 * swing})`}>
              <ellipse cx={0} cy={9 * swing + 4} rx={30} ry={7} fill={C.ink} opacity={0.12} />
              <g stroke={C.ink} strokeWidth={10} strokeLinecap="round" fill="none">
                <line x1={0} y1={-92} x2={0} y2={-46} />
                <line x1={0} y1={-46} x2={-15 - 9 * swing} y2={0} />
                <line x1={0} y1={-46} x2={15 + 17 * swing} y2={0} />
                <line x1={0} y1={-86} x2={-23} y2={-56 + 9 * swing} />
                <line x1={0} y1={-86} x2={23} y2={-56 - 9 * swing} />
              </g>
              <circle cx={0} cy={-117} r={19} fill={C.ink} />
              <circle cx={0} cy={-117} r={27} fill="none" stroke={accent} strokeWidth={3} opacity={0.35} />
            </g>
          </svg>

          {/* ETIQUETA de la RAMPA */}
          {rampLabel ? (
            <div
              style={{
                position: "absolute",
                left: rampMx,
                top: rampMy,
                transform: `translate(-50%, -50%) rotate(${rampAng}deg) scale(${interpolate(rampLabP, [0, 1], [0.9, 1])})`,
                opacity: rampLabP * 0.95,
                background: "rgba(244,247,249,0.92)",
                border: `2px dashed ${C.tealSoft}`,
                borderRadius: 999,
                padding: "10px 26px",
                whiteSpace: "nowrap",
                color: C.dim,
                fontSize: 30,
                fontWeight: 800,
              }}
            >
              {rampLabel}
            </div>
          ) : null}

          {/* TARJETAS de cada escalón */}
          {list.map((s, i) => {
            const st = sAt(i) + 2;
            const p = spring({ frame: frame - st, fps, config: { damping: 18, mass: 0.6, stiffness: 135 } });
            if (frame < st - 2) return null;
            const isNow = nowIdx === i;
            const past = pos > i + 0.6;
            const op = p * (past && !isNow ? 0.5 : 1);
            return (
              <div
                key={`card${i}`}
                style={{
                  position: "absolute",
                  left: LABEL_X,
                  top: tY(i),
                  width: LABEL_W,
                  transform: `translateY(-50%) translateX(${interpolate(p, [0, 1], [46, 0])}px)`,
                  opacity: op,
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  background: C.card,
                  borderLeft: `9px solid ${isNow ? accent : "rgba(20,35,43,0.18)"}`,
                  borderRadius: 20,
                  padding: "18px 30px",
                  boxSizing: "border-box",
                  boxShadow: isNow
                    ? "0 26px 60px rgba(20,35,43,0.20), 0 2px 0 rgba(20,35,43,0.05)"
                    : "0 12px 30px rgba(20,35,43,0.10)",
                }}
              >
                <div
                  style={{
                    flex: "0 0 auto",
                    width: badge,
                    height: badge,
                    borderRadius: badge,
                    background: isNow ? accent : "rgba(20,35,43,0.12)",
                    color: isNow ? "#FFFFFF" : C.soft,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: Math.round(badge * 0.5),
                    boxShadow: isNow ? `0 0 0 7px ${accent2}22` : "none",
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: labelFS, fontWeight: 900, color: C.ink, lineHeight: 1.07, letterSpacing: -0.4 }}>
                    {s.label}
                  </div>
                  {s.sub ? (
                    <div style={{ fontSize: subFS, fontWeight: 500, color: C.soft, lineHeight: 1.22, marginTop: 7 }}>
                      {s.sub}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* fundidos de papel: el mundo entra y sale del cuadro sin cortarse feo */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 258,
          background: `linear-gradient(${C.paper} 0%, ${C.paper} 56%, rgba(244,247,249,0) 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 170,
          background: `linear-gradient(rgba(244,247,249,0) 0%, ${C.paper} 78%, ${C.paper} 100%)`,
        }}
      />

      {/* HEADER fijo */}
      {hasHead ? (
        <div
          style={{
            position: "absolute",
            left: 96,
            top: 62,
            right: 96,
            opacity: headP,
            transform: `translateY(${interpolate(headP, [0, 1], [18, 0])}px)`,
          }}
        >
          {eyebrow ? (
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: 3.4,
                textTransform: "uppercase",
                color: accent,
                marginBottom: 10,
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          {title ? (
            <div style={{ fontSize: 58, fontWeight: 900, lineHeight: 1.03, color: C.ink, letterSpacing: -1 }}>{title}</div>
          ) : null}
          <div
            style={{
              marginTop: 16,
              height: 7,
              borderRadius: 5,
              width: interpolate(headP, [0.15, 1], [0, 280], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              background: `linear-gradient(90deg, ${accent}, ${C.tealSoft})`,
            }}
          />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export default FdEscalera;
