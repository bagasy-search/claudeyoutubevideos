// TfbLamina — la FICHA a pantalla completa con cámara punto por punto: `keys` = [segundo, cx, cy, escala] (cx/cy en
// fracción de la imagen), tramos suaves entre teclas, nunca se sale del borde. Entra con un "golpe de papel" (escala 1,06→1
// + sombra) y un brillo de luz que barre el papel una vez. Fondo crema del canal.
import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IO, clamp } from "./theme";

export type TfbLaminaProps = { src: string; keys: [number, number, number, number][]; bg?: string; move?: number };

export const TfbLamina: React.FC<TfbLaminaProps> = ({ src, keys, bg = "#F1E4C9", move = 0.8 }) => {
  const f = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const t = f / fps;
  let i = 0; while (i < keys.length - 1 && t >= keys[i + 1][0]) i++;
  const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
  const p = b === a ? 0 : interpolate(t, [b[0] - move, b[0]], [0, 1], { ...clamp, easing: EASE_IO });
  const cx = a[1] + (b[1] - a[1]) * p, cy = a[2] + (b[2] - a[2]) * p, s = a[3] + (b[3] - a[3]) * p;
  let tx = W / 2 - cx * W * s, ty = H / 2 - cy * H * s;
  tx = Math.min(0, Math.max(W - W * s, tx)); ty = Math.min(0, Math.max(H - H * s, ty));
  const slam = interpolate(f, [0, 8], [1.06, 1], { ...clamp, easing: EASE_IO });
  const shine = interpolate(f, [6, 30], [-40, 140], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <AbsoluteFill style={{ transform: `scale(${slam})` }}>
        <Img src={src} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${s})` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(105deg, rgba(255,255,255,0) ${shine - 12}%, rgba(255,255,255,0.35) ${shine}%, rgba(255,255,255,0) ${shine + 12}%)`, mixBlendMode: "soft-light" }} />
    </AbsoluteFill>
  );
};
