// SashLockRotor.tsx — la traba de MEDIA LUNA (sash lock) girando, y su versión CON LLAVE
// (canal Ray Kessler · rkwindow). Vista desde arriba del encuentro de las dos hojas.
//
// Tiempos relativos a la duración:
//   0-42 %  lado izquierdo "LATCH": la leva gira y engancha el cerradero... y se BAMBOLEA sobre sus
//           tornillos flojos (los tornillos laten en rojo): está cansada, no rota.
//   42-55 % la cámara virtual se desliza al lado derecho.
//   55-95 % lado derecho "LOCK": la misma leva, pero un botón/cilindro con llave la BLOQUEA; la llave
//           entra, gira 90°, y aparece el sello brass.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, enter, PhotoBed, Kick, Head, Keyring } from "./RayStage";

const ease = (f: number, a: number, b: number, e = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

const Cam: React.FC<{ cx: number; cy: number; rot: number; wobble: number; loose: number; keyed: number; keyT: number }> = ({
  cx, cy, rot, wobble, loose, keyed, keyT,
}) => (
  <g>
    {/* riel de la hoja de abajo y de la de arriba */}
    <rect x={cx - 330} y={cy - 10} width={660} height={140} fill={rgba(V.bone, 0.08)} stroke={rgba(V.bone, 0.35)} strokeWidth={2} />
    <rect x={cx - 330} y={cy - 150} width={660} height={140} fill={rgba(V.bone, 0.05)} stroke={rgba(V.bone, 0.25)} strokeWidth={2} />
    {/* cerradero (keeper) en la hoja de arriba */}
    <path d={`M ${cx + 40} ${cy - 20} q 90 -10 120 -70 l 30 0 q -20 90 -150 95 z`} fill="#8F8F98" stroke="#5C5C66" strokeWidth={2} />
    <circle cx={cx + 150} cy={cy - 90} r={9} fill="#44444C" />
    {/* base de la traba en la hoja de abajo, con tornillos que se aflojan */}
    <g transform={`translate(${wobble.toFixed(2)},${(wobble * 0.4).toFixed(2)}) rotate(${(wobble * 0.6).toFixed(2)} ${cx} ${cy + 60})`}>
      <rect x={cx - 120} y={cy + 10} width={240} height={100} rx={18} fill="#A7A7B0" stroke="#5C5C66" strokeWidth={3} />
      {[-80, 80].map((dx) => (
        <g key={dx}>
          <circle cx={cx + dx} cy={cy + 60} r={14} fill="#6E6E78" stroke={loose > 0.05 ? V.danger : "#44444C"} strokeWidth={3 + loose * 5} />
          <line x1={cx + dx - 9} y1={cy + 60} x2={cx + dx + 9} y2={cy + 60} stroke="#33333A" strokeWidth={3} />
          {loose > 0.05 ? <circle cx={cx + dx} cy={cy + 60} r={22 + loose * 16} fill="none" stroke={rgba(V.danger, 0.5 * loose)} strokeWidth={3} /> : null}
        </g>
      ))}
      {/* la media luna (leva) que gira */}
      <g transform={`rotate(${rot.toFixed(2)} ${cx} ${cy + 20})`}>
        <path d={`M ${cx} ${cy + 20} m -110 0 a 110 110 0 0 1 220 0 z`} fill="url(#slr_brass)" stroke="#7A5A20" strokeWidth={3} />
        <rect x={cx - 12} y={cy + 20} width={24} height={70} rx={10} fill="#B8862A" stroke="#7A5A20" strokeWidth={2} />
      </g>
      <circle cx={cx} cy={cy + 20} r={16} fill="#D9B45A" stroke="#7A5A20" strokeWidth={3} />
      {/* versión con llave: cilindro en la base */}
      <g opacity={keyed}>
        <circle cx={cx - 60} cy={cy + 78} r={20} fill="#D9B45A" stroke="#7A5A20" strokeWidth={3} />
        <rect x={cx - 64} y={cy + 66} width={8} height={24} rx={3} fill="#5A4212" transform={`rotate(${(keyT * 90).toFixed(1)} ${cx - 60} ${cy + 78})`} />
        {/* la llave entra desde abajo */}
        <g transform={`translate(0,${((1 - Math.min(1, keyT * 2.2)) * 160).toFixed(1)}) rotate(${(keyT * 90).toFixed(1)} ${cx - 60} ${cy + 78})`}>
          <rect x={cx - 66} y={cy + 78} width={12} height={90} rx={3} fill="#E4B75C" stroke="#7A5A20" strokeWidth={2} />
          <circle cx={cx - 60} cy={cy + 190} r={30} fill="none" stroke="#E4B75C" strokeWidth={12} />
        </g>
      </g>
    </g>
  </g>
);

export const SashLockRotor: React.FC<{
  title?: string;
  leftLabel?: string;
  rightLabel?: string;
  caption?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({
  title = "A latch is not a lock",
  leftLabel = "Tired latch",
  rightLabel = "Keyed lock",
  caption = "Two screws. Six to fifteen dollars.",
  bed,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const cfg = useVideoConfig();
  const D = Math.max(60, durationInFrames ?? cfg.durationInFrames);
  const W = 1920, H = 1080;

  // lado A: gira a cerrado y bambolea
  const rotA = interpolate(ease(frame, D * 0.04, D * 0.16, Easing.out(Easing.back(1.3))), [0, 1], [-180, 0]);
  const loose = ease(frame, D * 0.18, D * 0.26);
  const wob = frame > D * 0.2 && frame < D * 0.42 ? Math.sin(frame / 2.1) * 9 * loose : 0;
  // cámara virtual: paneo al lado B
  const pan = ease(frame, D * 0.42, D * 0.55);
  // lado B: gira a cerrado, entra la llave y gira
  const rotB = interpolate(ease(frame, D * 0.55, D * 0.64, Easing.out(Easing.back(1.3))), [0, 1], [-180, 0]);
  const keyT = ease(frame, D * 0.66, D * 0.82);
  const seal = enter(frame - D * 0.82, 10);
  const titleA = enter(frame, 10);
  const shift = -pan * W;
  const zoom = 1 + 0.06 * Math.sin(Math.PI * pan);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} dim={0.74} />
      <AbsoluteFill style={{ background: `radial-gradient(100% 90% at 50% 55%, ${rgba(V.ink0, 0.25)} 0%, ${rgba(V.ink0, 0.85)} 100%)` }} />

      <div style={{ position: "absolute", left: "5.5%", top: "7%", opacity: titleA, zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          <Keyring size={32} /><Kick>TOP VIEW · SASH LOCK</Kick>
        </div>
        <div style={{ display: "inline-block", padding: "10px 24px 14px", background: rgba(V.ink0, 0.6), borderLeft: `6px solid ${V.brass}`, borderRadius: 4 }}>
          <Head size={64}>{title}</Head>
        </div>
      </div>

      <AbsoluteFill style={{ transform: `translateX(${shift.toFixed(1)}px) scale(${zoom.toFixed(4)})`, transformOrigin: "50% 60%" }}>
        <svg viewBox={`0 0 ${W * 2} ${H}`} width={W * 2} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <linearGradient id="slr_brass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F1D48A" />
              <stop offset="55%" stopColor="#C8912F" />
              <stop offset="100%" stopColor="#8A6220" />
            </linearGradient>
          </defs>
          <g transform="translate(960,560) scale(1.7) translate(-960,-560)">
            <Cam cx={960} cy={560} rot={rotA} wobble={wob} loose={loose} keyed={0} keyT={0} />
          </g>
          <g transform="translate(2880,560) scale(1.7) translate(-2880,-560)">
            <Cam cx={2880} cy={560} rot={rotB} wobble={0} loose={0} keyed={1} keyT={keyT} />
          </g>
          <text x={960} y={282} textAnchor="middle" fontFamily={F_DISPLAY} fontWeight={700} fontSize={54} fill={V.dangerSoft} letterSpacing={3}
            style={{ textTransform: "uppercase" }} opacity={enter(frame - D * 0.2, 10)}>{leftLabel}</text>
          <text x={2880} y={282} textAnchor="middle" fontFamily={F_DISPLAY} fontWeight={700} fontSize={54} fill={V.brassSoft} letterSpacing={3}
            style={{ textTransform: "uppercase" }} opacity={enter(frame - D * 0.6, 10)}>{rightLabel}</text>
        </svg>
      </AbsoluteFill>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: "5.5%", display: "flex", justifyContent: "center", opacity: seal, transform: `scale(${(0.9 + 0.1 * seal).toFixed(3)})` }}>
        <div style={{ padding: "14px 34px", background: rgba(V.ink0, 0.8), border: `2px solid ${V.brass}`, borderRadius: 6, fontFamily: F_BODY, fontWeight: 700, fontSize: 40, color: V.brassSoft }}>
          {caption}
        </div>
      </div>
    </AbsoluteFill>
  );
};
