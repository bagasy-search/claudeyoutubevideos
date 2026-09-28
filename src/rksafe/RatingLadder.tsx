// RatingLadder.tsx — ESCALERA DE CLASIFICACIÓN de cajas fuertes (canal Ray Kessler · rkhanger).
// Barras que SUBEN con los minutos de ataque que resiste cada clase; un contador corre hasta el
// valor y el peldaño recomendado (`pick`) se enciende en latón. "Fire only" = 0 minutos de ataque:
// su barra queda en ROJO y vacía (el punto del video: la etiqueta de fuego no es de robo).
// ⛔ Datos: fire-only y B-rate no tienen prueba de ataque; RSC (UL 1037) = 5 min con herramientas de
//    mano; TL-15 / TL-30 (UL 687) = 15 / 30 min. Números como NÚMERO, no string.
import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, PhotoBed, Keyring, clamp01 } from "./RayStage";

const ez = Easing.bezier(0.25, 0.1, 0.2, 1);
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

export const RatingLadder: React.FC<{
  kicker?: string;
  title?: string;
  rungs?: { label: string; minutes: number }[];
  pick?: number;
  bed?: string;
  durationInFrames?: number;
}> = ({
  kicker = "ATTACK TEST, IN MINUTES",
  title = "Buy the label, not the box",
  rungs = [
    { label: "Fire only", minutes: 0 },
    { label: "B-rate", minutes: 0 },
    { label: "RSC", minutes: 5 },
    { label: "TL-15", minutes: 15 },
    { label: "TL-30", minutes: 30 },
  ],
  pick = 2,
  bed,
  durationInFrames = 240,
}) => {
  const f = useCurrentFrame();
  const dur = Math.max(60, durationInFrames);
  const p = f / dur;
  const n = rungs.length;
  const maxM = Math.max(1, ...rungs.map((r) => r.minutes));
  const aHead = ez(seg(p, 0, 0.1));
  const H = 470, W = 150, gap = 70;
  const x0 = (1600 - (n * W + (n - 1) * gap)) / 2;
  const base = 760;
  // cámara: leve travelling lateral que acompaña la subida
  const cam = -30 + 60 * ez(seg(p, 0.1, 0.9));

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} dim={0.8} />
      <svg viewBox="0 0 1600 900" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: `translateX(${cam.toFixed(1)}px)` }}>
        <line x1={x0 - 40} x2={x0 + n * (W + gap)} y1={base} y2={base} stroke={rgba(V.bone, 0.5)} strokeWidth="3" />
        {rungs.map((r, i) => {
          const a = ez(seg(p, 0.12 + i * (0.5 / n), 0.24 + i * (0.5 / n)));
          const hgt = r.minutes > 0 ? 40 + (H - 40) * (r.minutes / maxM) * a : 14;
          const x = x0 + i * (W + gap);
          const isPick = i === pick;
          const lit = isPick ? ez(seg(p, 0.7, 0.8)) : 0;
          const col = r.minutes === 0 ? V.danger : isPick ? V.brass : V.steel;
          const shown = Math.round(r.minutes * a);
          return (
            <g key={i} opacity={clamp01(a * 2)}>
              <rect x={x} y={base - hgt} width={W} height={hgt} rx="6" fill={rgba(col, 0.25 + 0.45 * lit)} stroke={col} strokeWidth={isPick ? 4 + 2 * lit : 3} />
              {isPick ? <rect x={x - 10} y={base - hgt - 10} width={W + 20} height={hgt + 20} rx="10" fill="none" stroke={V.brassSoft} strokeWidth="3" opacity={lit} /> : null}
              <text x={x + W / 2} y={base - hgt - 22} textAnchor="middle" fontFamily={F_DISPLAY} fontWeight={700} fontSize="58" fill={r.minutes === 0 ? V.dangerSoft : V.white}>
                {r.minutes === 0 ? "0" : String(shown)}
              </text>
              <text x={x + W / 2} y={base + 52} textAnchor="middle" fontFamily={F_DISPLAY} fontWeight={700} fontSize="40" fill={isPick ? V.brassSoft : V.bone}>{r.label}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: "5%", top: "7%", opacity: aHead, transform: `translateY(${((1 - aHead) * 14).toFixed(1)}px)` }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 3.4, color: V.brass }}>{kicker}</div>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 64, color: V.white, textShadow: "0 6px 30px rgba(0,0,0,0.92)" }}>{title}</div>
      </div>
      <div style={{ position: "absolute", right: "5%", bottom: "6%", opacity: 0.85 * aHead, display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ fontFamily: F_BODY, fontSize: 22, color: V.bone }}>min</div>
        <Keyring size={30} />
      </div>
    </AbsoluteFill>
  );
};
