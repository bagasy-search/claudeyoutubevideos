// TfbLamina — la FICHA a pantalla completa con recorrido punto por punto: la cámara va de zona en zona (zoom suave
// con curva), y en cada parada un marco amarillo "dibujado" enmarca la zona que la voz está leyendo.
// TfbQrCard — la tarjeta de conversión: portada REAL + QR REAL sobre blanco, sin Ken-Burns (el QR nunca se mueve
// una vez asentado, para que se pueda escanear), con una línea corta de instrucción.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, INTER, TFB, clamp, easeInOut, easeOut, pop } from "./theme";

export type LamStop = { f: number; x: number; y: number; z: number; box?: { x: number; y: number; w: number; h: number } }; // % de la lámina
export const TfbLamina: React.FC<{ src: string; dur: number; stops: LamStop[]; bg?: string }> = ({ src, dur, stops, bg = "#E9DABB" }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  const ks = stops.map((s) => s.f);
  const v = (k: "x" | "y" | "z") => (stops.length > 1 ? interpolate(f, ks, stops.map((s) => s[k]), { ...clamp, easing: easeInOut }) : stops[0][k]);
  const z = v("z"), x = v("x"), y = v("y");
  const op = interpolate(f, [0, 8, dur - 8, dur], [0, 1, 1, 0], clamp);
  // parada vigente = la última cuyo f ya pasó (+ 10 cuadros de viaje)
  let cur = -1; stops.forEach((s, i) => { if (f >= s.f) cur = i; });
  const st = cur >= 0 ? stops[cur] : null, since = st ? f - st.f : 0;
  const draw = interpolate(since, [2, 14], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill style={{ backgroundColor: bg, opacity: op, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z.toFixed(4)})`, transformOrigin: `${x.toFixed(2)}% ${y.toFixed(2)}%` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        {st?.box && (
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            <rect x={(st.box.x / 100) * W} y={(st.box.y / 100) * H} width={(st.box.w / 100) * W} height={(st.box.h / 100) * H} rx={10} fill="none"
              stroke={TFB.yellow} strokeWidth={7 / z} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} style={{ filter: "drop-shadow(0 0 6px rgba(0,0,0,0.4))" }} />
          </svg>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const TfbQrCard: React.FC<{ qr: string; cover: string; dur: number; line1: string; line2?: string; side?: "right" | "left" }> = ({ qr, cover, dur, line1, line2, side = "right" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = pop(f, fps, 0, 16, 0.8);
  const out = interpolate(f, [dur - 10, dur], [1, 0], clamp);
  const settled = Math.min(1, p); // después del resorte queda QUIETO (sin Ken-Burns)
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <div style={{ position: "absolute", bottom: 60, [side]: 60, display: "flex", gap: 30, alignItems: "center", background: TFB.white, borderRadius: 30, padding: 26,
        boxShadow: "0 24px 70px rgba(0,0,0,0.5)", transform: `translateY(${(1 - settled) * 80}px)`, opacity: interpolate(p, [0, 0.3], [0, 1], clamp) } as React.CSSProperties}>
        <Img src={staticFile(cover)} style={{ height: 380, borderRadius: 8, boxShadow: "0 8px 22px rgba(0,0,0,0.3)" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ background: TFB.white, padding: 10 }}>
            <Img src={staticFile(qr)} style={{ width: 330, height: 330, display: "block", imageRendering: "pixelated" }} />
          </div>
          <div style={{ fontFamily: ANTON, fontSize: 40, color: TFB.ink, textTransform: "uppercase", whiteSpace: "nowrap" }}>{line1}</div>
          {line2 && <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 24, color: "#555", whiteSpace: "nowrap" }}>{line2}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};
