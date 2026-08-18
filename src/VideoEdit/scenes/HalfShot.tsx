import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT_STACK } from "../theme";
import { COLORS as BEN } from "../theme_ben";
import { Media } from "../components/Media";

// HalfShot — split 50/50: la imagen/clip llena UNA MITAD y la OTRA mitad es un PANEL
// de texto (marca terrosa, serif, crema) — "imagen de un lado, texto del otro".
// Autónomo (no depende del avatar). Ken-Burns suave en la imagen, texto que entra con fade+rise.
export const HalfShot: React.FC<{
  durationInFrames: number;
  src: string; // "img/x.png" | "vid/x.mp4" | "real/x.jpg" | "broll/x.mp4"
  side?: "right" | "left"; // de qué lado va la IMAGEN (default derecha → texto izq)
  kicker?: string; // texto del panel (admite \n para varias líneas)
  hue?: "blue" | "cold" | "amber" | "red";
  dark?: boolean; // panel oscuro theme_ben (negro premium + oro) en vez del crema terroso
}> = ({ durationInFrames, src, side = "right", kicker, hue = "amber", dark = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const PAL = dark ? BEN : COLORS;
  const bg0 = PAL.bg0, txt = PAL.text;
  const acc = hue === "red" ? PAL.danger : hue === "cold" ? PAL.cold : hue === "blue" ? PAL.accent : PAL.amber;
  const edgeShadow = dark ? "rgba(0,0,0,0.55)" : "rgba(42,38,32,0.38)";
  const panelTint = dark ? "rgba(255,196,0,0.08)" : "rgba(212,180,120,0.10)";

  const imgLeft = side === "right" ? "50%" : "0%";
  const txtLeft = side === "right" ? "0%" : "50%";
  const kb = interpolate(frame, [0, durationInFrames], [1.05, 1.12]);
  const driftX = interpolate(frame, [0, durationInFrames], [side === "right" ? -10 : 10, 0]);

  const enter = spring({ frame, fps, config: { damping: 18, mass: 0.7, stiffness: 150 } });
  const lines = (kicker || "").split(/\\n|\n/); // soporta \n real y \n literal (JSX attr no procesa escapes)

  return (
    <AbsoluteFill style={{ backgroundColor: bg0 }}>
      {/* PANEL de texto en su mitad */}
      <div
        style={{
          position: "absolute", left: txtLeft, top: 0, width: "50%", height: "100%",
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          padding: "0 110px", fontFamily: FONT_STACK,
          background: `linear-gradient(${side === "right" ? "90deg" : "270deg"}, ${bg0} 70%, ${panelTint})`,
        }}
      >
        {/* línea de acento que crece */}
        <div style={{ height: 5, width: interpolate(enter, [0, 1], [0, 96]), background: acc, borderRadius: 3, marginBottom: 30, boxShadow: `0 0 14px ${acc}66` }} />
        <div style={{ opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [22, 0])}px)`, textAlign: "center" }}>
          {lines.map((ln, i) => (
            <div key={i} style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.12, color: txt, letterSpacing: 0.5 }}>{ln}</div>
          ))}
        </div>
      </div>

      {/* la imagen en su mitad */}
      <div style={{ position: "absolute", left: imgLeft, top: 0, width: "50%", height: "100%", overflow: "hidden" }}>
        <Media
          src={src}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb}) translateX(${driftX}px)` }}
        />
        <AbsoluteFill style={{ background: "radial-gradient(75% 80% at 50% 45%, transparent 60%, rgba(42,38,32,0.28) 100%)" }} />
        {/* canto interior hacia el panel: sombra + hairline de acento */}
        <div style={{ position: "absolute", top: 0, bottom: 0, [side === "right" ? "left" : "right"]: 0, width: 28, background: side === "right" ? `linear-gradient(90deg, ${edgeShadow}, transparent)` : `linear-gradient(270deg, ${edgeShadow}, transparent)` }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, [side === "right" ? "left" : "right"]: 0, width: 4, background: acc, opacity: 0.6 }} />
      </div>
    </AbsoluteFill>
  );
};
