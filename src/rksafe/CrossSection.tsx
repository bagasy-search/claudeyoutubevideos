// CrossSection.tsx — corte/CUTAWAY de una caja fuerte EMPOTRADA a ras entre dos montantes,
// baja, con un espejo colgado delante. El espejo se DESLIZA para taparla → "boring = invisible".
// Estructura en brass; la caja en steel; rótulos brass con línea guía apuntando a las partes.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, enter, clamp01, PhotoBed, Kick, Head, Keyring } from "./RayStage";

export const CrossSection: React.FC<{
  title?: string;
  caption?: string;
  labels?: { text: string }[];
  bed?: string;
  durationInFrames?: number;
}> = ({
  title = "In the wall, done right",
  caption = "Boring = invisible",
  labels = [
    { text: "Between the studs" },
    { text: "Below eye level" },
    { text: "Mirror that belongs there" },
  ],
  bed,
}) => {
  const frame = useCurrentFrame();
  const W = 1920;
  const H = 1080;

  // Geometría del corte (todo en coords 1920x1080)
  // Dos montantes verticales, plano de drywall, caja empotrada baja, espejo que se desliza.
  const wall = { x: 560, y: 150, w: 800, h: 820 };
  const studL = { x: 720, w: 46 };
  const studR = { x: 1150, w: 46 };
  const safe = { x: studL.x + studL.w, w: studR.x - (studL.x + studL.w), y: 640, h: 220 };

  // el espejo empieza a la izquierda (destapado) y se desliza a cubrir la caja
  const slideStart = 40;
  const slideDur = 46;
  const slideT = clamp01(
    interpolate(frame, [slideStart, slideStart + slideDur], [0, 1], {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const mirrorW = 340;
  const mirrorH = 470;
  const mirrorY = safe.y + safe.h / 2 - mirrorH / 2 - 30;
  const mirrorStartX = studL.x - mirrorW - 40;
  const mirrorTargetX = safe.x + safe.w / 2 - mirrorW / 2;
  const mirrorX = interpolate(slideT, [0, 1], [mirrorStartX, mirrorTargetX]);
  const covered = slideT > 0.92;

  const structA = enter(frame, 12);
  const safeA = enter(frame - 14, 12);
  const titleA = enter(frame, 10);

  // caption "boring = invisible" entra cuando el espejo terminó
  const capA = enter(frame - (slideStart + slideDur - 2), 12);

  // callouts apuntan a: montantes / (bajo la vista) / espejo — aparecen escalonados
  const calloutTargets = [
    { x: studL.x + studL.w / 2, y: 300, side: "left" as const, tx: wall.x - 60, ty: 300 },
    { x: safe.x + safe.w / 2, y: safe.y + safe.h + 8, side: "left" as const, tx: wall.x - 60, ty: safe.y + safe.h + 60 },
    { x: mirrorTargetX + mirrorW / 2, y: mirrorY + 40, side: "right" as const, tx: wall.x + wall.w + 60, ty: mirrorY + 20 },
  ];
  const calloutStart = (i: number) => 60 + i * 14;

  const drift = Math.sin(frame / 160) * 3;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} dim={0.7} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 100% at 55% 45%, ${rgba(V.ink0, 0)} 40%, ${rgba(V.ink0, 0.76)} 100%)`,
        }}
      />

      {/* Titular arriba-izquierda */}
      <div
        style={{
          position: "absolute",
          left: "5.5%",
          top: "8%",
          opacity: titleA,
          transform: `translateY(${((1 - titleA) * 16).toFixed(1)}px)`,
          maxWidth: "60%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <Keyring size={34} />
          <Kick>CUTAWAY</Kick>
        </div>
        <div
          style={{
            display: "inline-block",
            padding: "12px 26px 16px",
            background: rgba(V.ink0, 0.6),
            borderLeft: `6px solid ${V.brass}`,
            borderRadius: 4,
          }}
        >
          <Head size={70}>{title}</Head>
        </div>
      </div>

      {/* El dibujo del corte */}
      <AbsoluteFill style={{ transform: `translateX(${drift.toFixed(2)}px)` }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            <pattern id="cs_drywall" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="10" stroke={rgba(V.brass, 0.12)} strokeWidth="1.4" />
            </pattern>
            <linearGradient id="cs_mirror" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={rgba(V.white, 0.34)} />
              <stop offset="45%" stopColor={rgba(V.steel, 0.22)} />
              <stop offset="100%" stopColor={rgba(V.white, 0.12)} />
            </linearGradient>
            <linearGradient id="cs_safe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3A3A42" />
              <stop offset="100%" stopColor="#22222A" />
            </linearGradient>
          </defs>

          <g opacity={structA}>
            {/* plano de drywall (cara del corte) */}
            <rect x={wall.x} y={wall.y} width={wall.w} height={wall.h} fill="url(#cs_drywall)" stroke={rgba(V.brass, 0.5)} strokeWidth={3} rx={4} />
            {/* placa/línea de drywall frontal */}
            <rect x={wall.x} y={wall.y} width={wall.w} height={wall.h} fill={rgba(V.ink0, 0.28)} rx={4} />

            {/* montantes verticales (studs) */}
            {[studL, studR].map((st, k) => (
              <g key={k}>
                <rect x={st.x} y={wall.y + 14} width={st.w} height={wall.h - 28} fill={rgba(V.brass, 0.14)} stroke={V.brass} strokeWidth={3} rx={3} />
                <line x1={st.x + st.w / 2} y1={wall.y + 24} x2={st.x + st.w / 2} y2={wall.y + wall.h - 24} stroke={rgba(V.brass, 0.4)} strokeWidth={1.4} strokeDasharray="4 8" />
              </g>
            ))}

            {/* línea de "eye level" (referencia, sobre la caja) */}
            <g opacity={0.7}>
              <line x1={wall.x - 20} y1={470} x2={wall.x + wall.w + 20} y2={470} stroke={rgba(V.bone, 0.4)} strokeWidth={2} strokeDasharray="10 10" />
              <text x={wall.x + wall.w + 26} y={476} fontFamily={F_BODY} fontSize={22} fill={rgba(V.bone, 0.8)}>eye level</text>
            </g>
          </g>

          {/* la caja fuerte empotrada a ras entre los montantes, baja */}
          <g opacity={safeA}>
            <rect x={safe.x} y={safe.y} width={safe.w} height={safe.h} fill="url(#cs_safe)" stroke={V.steel} strokeWidth={4} rx={8} />
            {/* puerta */}
            <rect x={safe.x + 16} y={safe.y + 16} width={safe.w - 32} height={safe.h - 32} fill="none" stroke={rgba(V.steel, 0.7)} strokeWidth={2} rx={5} />
            {/* dial/manija */}
            <circle cx={safe.x + safe.w - 60} cy={safe.y + safe.h / 2} r={26} fill={V.ink1} stroke={V.brass} strokeWidth={3.5} />
            <circle cx={safe.x + safe.w - 60} cy={safe.y + safe.h / 2} r={7} fill={V.brass} />
            <line x1={safe.x + safe.w - 60} y1={safe.y + safe.h / 2} x2={safe.x + safe.w - 60} y2={safe.y + safe.h / 2 - 22} stroke={V.brass} strokeWidth={3} strokeLinecap="round" />
          </g>

          {/* El ESPEJO que se desliza a tapar la caja (semi-transparente) */}
          <g>
            {/* marco del espejo */}
            <rect
              x={mirrorX - 12}
              y={mirrorY - 12}
              width={mirrorW + 24}
              height={mirrorH + 24}
              fill={rgba(V.brass, 0.16)}
              stroke={V.brass}
              strokeWidth={5}
              rx={8}
            />
            {/* vidrio */}
            <rect x={mirrorX} y={mirrorY} width={mirrorW} height={mirrorH} fill="url(#cs_mirror)" stroke={rgba(V.white, 0.35)} strokeWidth={1.5} rx={4} />
            {/* reflejo diagonal */}
            <line
              x1={mirrorX + 30}
              y1={mirrorY + mirrorH - 40}
              x2={mirrorX + mirrorW - 60}
              y2={mirrorY + 40}
              stroke={rgba(V.white, 0.4)}
              strokeWidth={10}
              strokeLinecap="round"
              opacity={0.5}
            />
          </g>
        </svg>

        {/* Callouts brass con línea guía */}
        {calloutTargets.map((c, i) => {
          const label = labels[i]?.text ?? "";
          if (!label) return null;
          const a = enter(frame - calloutStart(i), 10);
          const leftPct = (c.tx / W) * 100;
          const topPct = (c.ty / H) * 100;
          return (
            <div key={i} style={{ opacity: a }}>
              {/* línea guía SVG del punto al rótulo */}
              <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
                <line x1={c.tx} y1={c.ty} x2={c.x} y2={c.y} stroke={V.brass} strokeWidth={2} strokeDasharray="3 6" opacity={a} />
                <circle cx={c.x} cy={c.y} r={6} fill={V.brass} opacity={a} />
              </svg>
              <div
                style={{
                  position: "absolute",
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  transform: `translate(${c.side === "left" ? "-100%" : "0"}, -50%)`,
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    padding: "8px 16px 10px",
                    background: rgba(V.ink0, 0.82),
                    border: `1.5px solid ${rgba(V.brass, 0.6)}`,
                    borderLeft: c.side === "left" ? undefined : `5px solid ${V.brass}`,
                    borderRight: c.side === "left" ? `5px solid ${V.brass}` : undefined,
                    borderRadius: 6,
                    whiteSpace: "nowrap",
                    boxShadow: `0 6px 20px ${rgba(V.ink0, 0.7)}`,
                  }}
                >
                  <span style={{ fontFamily: F_DISPLAY, fontSize: 30, color: V.brassSoft, letterSpacing: "0.01em" }}>{label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      {/* Nota final "boring = invisible" (aparece con el espejo ya puesto) */}
      <div
        style={{
          position: "absolute",
          right: "6%",
          bottom: "10%",
          opacity: capA,
          transform: `translateY(${((1 - capA) * 14).toFixed(1)}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "12px 24px 14px",
            background: rgba(V.ink0, 0.8),
            border: `2px solid ${rgba(V.brass, covered ? 0.75 : 0.4)}`,
            borderRadius: 8,
            boxShadow: `0 8px 26px ${rgba(V.ink0, 0.7)}`,
          }}
        >
          <Keyring size={30} />
          <span style={{ fontFamily: F_DISPLAY, fontSize: 48, color: V.brassSoft, letterSpacing: "0.02em" }}>{caption}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
