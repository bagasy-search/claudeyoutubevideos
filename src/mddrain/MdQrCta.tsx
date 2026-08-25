// MdQrCta.tsx — la tarjeta de CTA del cierre: el QR en pantalla mientras Mike dice
// "point your phone camera at it". ⛔ Sin precio y sin URL escrita: el link vive en la descripción.
//
// Cierra el círculo del embudo: nombra lo que el espectador YA vio (las páginas de la guía),
// no una promesa. El QR entra con un latido corto para que el ojo lo encuentre, y después
// se queda quieto el tiempo suficiente para que una cámara de teléfono lo lea.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const RED = "#E4322A";

export const MdQrCta: React.FC<{
  durationInFrames: number;
  image: string;     // "img/mdtank_qrcard.jpg"
  eyebrow?: string;
  title?: string;
  bullet?: string;
  cta?: string;
}> = ({ durationInFrames, image, eyebrow = "THE REST OF THE PAGES", title = "Point your camera", bullet, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = durationInFrames;

  const inS = spring({ frame, fps, config: { damping: 200, mass: 0.8 }, durationInFrames: Math.min(26, D) });
  const out = interpolate(frame, [D - 8, D], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // latido único para que el ojo encuentre el código, y después quieto (la cámara tiene que leerlo)
  const beat = 1 + 0.035 * Math.max(0, Math.sin(interpolate(frame, [24, 44], [0, Math.PI], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  const txt = (a: number) => interpolate(frame, [a, a + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0C", opacity: out }}>
      <AbsoluteFill style={{ background: "radial-gradient(64% 60% at 62% 46%, rgba(228,50,42,0.16) 0%, rgba(0,0,0,0) 70%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(84% 72% at 50% 48%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.66) 100%)" }} />

      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 74 }}>
        {/* el código */}
        <div
          style={{
            transform: `translateY(${interpolate(inS, [0, 1], [40, 0]).toFixed(1)}px) scale(${(interpolate(inS, [0, 1], [0.9, 1]) * beat).toFixed(4)})`,
            opacity: interpolate(inS, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
            padding: 20,
            background: "#FFFFFF",
            borderRadius: 12,
            boxShadow: `0 30px 70px rgba(0,0,0,0.6), 0 0 0 3px ${RED}`,
          }}
        >
          <Img src={staticFile(image)} style={{ width: 360, height: 360, display: "block" }} />
        </div>

        {/* el texto */}
        <div style={{ maxWidth: 760 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: txt(8) }}>
            <div style={{ width: 40, height: 3, background: RED, borderRadius: 2 }} />
            <div style={{ font: "700 21px/1 Inter, system-ui, sans-serif", letterSpacing: 2.6, color: RED, textTransform: "uppercase" }}>{eyebrow}</div>
          </div>
          <div
            style={{
              marginTop: 16, font: "800 76px/1.04 Anton, Inter, system-ui, sans-serif", letterSpacing: -0.5,
              color: "#FFFFFF", textTransform: "uppercase", textShadow: "0 6px 26px rgba(0,0,0,0.7)",
              opacity: txt(14), transform: `translateY(${interpolate(txt(14), [0, 1], [18, 0]).toFixed(1)}px)`,
            }}
          >
            {title}
          </div>
          {bullet ? (
            <div style={{ marginTop: 22, font: "500 30px/1.42 Inter, system-ui, sans-serif", color: "rgba(255,255,255,0.9)", opacity: txt(24) }}>
              {bullet}
            </div>
          ) : null}
          {cta ? (
            <div style={{ marginTop: 20, font: "italic 500 26px/1.3 'Playfair Display', Georgia, serif", color: "rgba(255,255,255,0.66)", opacity: txt(32) }}>
              {cta}
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
