// faperejil — VLOG CONTINUO (agnes-video-2.5-flash). Base = un mp4 por escena (armado por scripts/agnes_vlog.mjs),
// lámina a pantalla completa con zoom punto por punto, QR en la capa over, UN <Audio> con el máster del vlog.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { TL, TOTAL_FRAMES_FAPEREJIL, AUDIO, LAM_KEYS } from "./timeline_faperejil.gen";

export { TOTAL_FRAMES_FAPEREJIL };
const FPS = 30;

// Lámina: cada tecla = [segundo, cx, cy, escala] (cx/cy en fracción de la imagen). Tramos suaves entre teclas.
const Lamina: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const ks = LAM_KEYS;
  let i = 0;
  while (i < ks.length - 1 && t >= ks[i + 1][0]) i++;
  const a = ks[i], b = ks[Math.min(i + 1, ks.length - 1)];
  const T = 0.7; // transición al entrar a la tecla b
  const p = b === a ? 0 : interpolate(t, [b[0] - T, b[0]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const cx = a[1] + (b[1] - a[1]) * p, cy = a[2] + (b[2] - a[2]) * p, s = a[3] + (b[3] - a[3]) * p;
  const W = 1920, H = 1080;
  // traslado que lleva (cx,cy) al centro, sin destapar bordes
  let tx = W / 2 - cx * W * s, ty = H / 2 - cy * H * s;
  tx = Math.min(0, Math.max(W - W * s, tx)); ty = Math.min(0, Math.max(H - H * s, ty));
  const fadeIn = interpolate(f, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#f6f1e6", opacity: fadeIn }}>
      <Img src={staticFile("img/faperejil/lamina.jpg")} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${s})` }} />
    </AbsoluteFill>
  );
};

// QR sobreimpreso: quieto (sin Ken-Burns), tarjeta blanca, con las dos vías.
const QR: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", right: 70, bottom: 70, background: "#ffffff", borderRadius: 22, padding: 22, boxShadow: "0 10px 40px rgba(0,0,0,0.28)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <Img src={staticFile("img/faperejil/qr_faperejil.png")} style={{ width: 360, height: 360, display: "block" }} />
        <div style={{ fontFamily: "Inter, Arial, sans-serif", fontSize: 30, fontWeight: 700, color: "#0f5132" }}>drfederer.com/firmeza</div>
        <div style={{ fontFamily: "Inter, Arial, sans-serif", fontSize: 24, fontWeight: 500, color: "#333" }}>Escanea con el teléfono · o el enlace abajo</div>
      </div>
    </AbsoluteFill>
  );
};

export const MainFaperejil: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {TL.map((c, i) => (
      <Sequence key={i} from={c.from} durationInFrames={c.dur}>
        {c.kind === "vid" ? (
          <OffthreadVideo src={staticFile(c.src!)} startFrom={c.startFrom || 0} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : c.kind === "lam" ? (
          <Lamina dur={c.dur} />
        ) : (
          <QR />
        )}
      </Sequence>
    ))}
    <Audio src={staticFile(AUDIO)} />
  </AbsoluteFill>
);
