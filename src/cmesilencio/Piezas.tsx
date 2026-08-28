// Piezas.tsx — las tres primitivas de la capa base/overlay del montaje de `cmegenerador`.
// Las escenas premium viven en Mov*.tsx; esto es lo que dibuja el material CRUDO entre medio.
import React from "react";
import { AbsoluteFill, Img, Video, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, rnd } from "./VoltStage";

/** CLIP real. Va a sangre y NO se corta (`noSplit`): el movimiento ya es dinámico.
 *  Cama de negro abajo para que nunca asome el avatar por los bordes del objectFit. */
export const Clip: React.FC<{ src: string }> = ({ src }) => (
  <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
    <Video src={staticFile(src)} muted
      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </AbsoluteFill>
);

/** FOTO con Ken-Burns lento. `seed` la hace determinista (nunca Math.random: el farm
 *  renderiza en 60 chunks separados y cada uno tiene que dar exactamente lo mismo). */
export const Foto: React.FC<{ src: string; seed: number }> = ({ src, seed }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const r = rnd(seed);
  const dir = r > 0.5 ? 1 : -1;
  const z = interpolate(frame, [0, Math.max(2, durationInFrames)], [1.04, 1.11], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const px = interpolate(frame, [0, Math.max(2, durationInFrames)], [0, dir * 1.6], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{
        width: "100%", height: "100%", objectFit: "cover",
        transform: `scale(${z.toFixed(4)}) translateX(${px.toFixed(2)}%)`,
      }} />
    </AbsoluteFill>
  );
};

/** ICONO + número. Va ENCIMA de lo que ya se está viendo y NO tapa la capa de abajo:
 *  el número nunca va solo ni sobre fondo plano (regla de la vara). */
export const IconoNum: React.FC<{ src: string; texto?: string }> = ({ src, texto }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = interpolate(frame, [0, 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = interpolate(frame, [Math.max(8, durationInFrames - 6), durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const a = Math.min(inP, out);
  const y = (1 - inP) * 26;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute", left: "6.5%", top: "12%",
        display: "flex", alignItems: "center", gap: 22,
        opacity: a, transform: `translateY(${y.toFixed(1)}px)`,
      }}>
        <Img src={staticFile(src)} style={{
          width: 118, height: 118, objectFit: "contain",
          filter: `drop-shadow(0 10px 26px ${rgba(V.ink0, 0.75)})`,
        }} />
        {texto ? (
          <div style={{
            fontFamily: F_DISPLAY, fontSize: 96, lineHeight: 1, letterSpacing: "-0.01em",
            color: V.volt, textShadow: `0 6px 30px ${rgba(V.ink0, 0.9)}`,
            padding: "10px 22px", borderLeft: `5px solid ${rgba(V.volt, 0.85)}`,
          }}>{texto}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/** LÁMINA — una página REAL de la guía del canal, dentro de una tarjeta con marco, sombra y
 *  profundidad, sobre una cama de foto desenfocada (nunca sobre fondo plano: la regla de la cama).
 *  Es el momento de CONVERSIÓN del video, así que la página entra entera y se sostiene: el tiempo
 *  de lectura lo fija el build, no el slot. `zoom` empuja despacio hacia el bloque que se explica. */
export const Lamina: React.FC<{
  src: string; bed?: string; rotulo?: string; foco?: [number, number]; zoom?: number;
}> = ({ src, bed, rotulo, foco = [50, 50], zoom = 1.16 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const D = Math.max(2, durationInFrames);
  const inP = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = interpolate(frame, [0, D], [1.0, zoom], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dy = interpolate(frame, [0, D], [0, -2.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {bed ? (
        <Img src={staticFile(bed)} style={{
          width: "100%", height: "100%", objectFit: "cover",
          filter: "blur(26px) saturate(0.7) brightness(0.42)", transform: "scale(1.14)",
        }} />
      ) : null}
      <AbsoluteFill style={{ background: `radial-gradient(70% 60% at 50% 46%, ${rgba(V.paper, 0.10)} 0%, rgba(0,0,0,0) 70%)` }} />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          position: "relative", height: "88%", aspectRatio: "0.707",
          transform: `translateY(${(dy + (1 - inP) * 3).toFixed(2)}%) scale(${(z * (0.965 + inP * 0.035)).toFixed(4)})`,
          transformOrigin: `${foco[0]}% ${foco[1]}%`,
          borderRadius: 6, overflow: "hidden", opacity: inP,
          boxShadow: `0 44px 96px ${rgba(V.ink0, 0.85)}, 0 6px 18px ${rgba(V.ink0, 0.6)}`,
          border: `1px solid ${rgba(V.paper, 0.28)}`,
        }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <AbsoluteFill style={{
            background: `linear-gradient(102deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 34%)`,
            mixBlendMode: "screen", pointerEvents: "none",
          }} />
        </div>
      </AbsoluteFill>
      {rotulo ? (
        <div style={{
          position: "absolute", left: "5%", bottom: "7.5%", maxWidth: "30%",
          fontFamily: F_DISPLAY, fontSize: 44, lineHeight: 1.12, color: V.volt,
          textShadow: `0 6px 26px ${rgba(V.ink0, 0.95)}`,
          borderLeft: `5px solid ${rgba(V.volt, 0.9)}`, paddingLeft: 18, opacity: inP,
        }}>{rotulo}</div>
      ) : null}
    </AbsoluteFill>
  );
};

/** RÓTULO — texto overlay corto. Flota encima de lo que ya se ve y NO tapa la capa de abajo.
 *  Su duración la fija el build por TIEMPO DE LECTURA (2,0 s + 0,28 s por palabra sobre 3). */
export const Rotulo: React.FC<{ texto: string; pos?: "bl" | "tl" | "br" }> = ({ texto, pos = "bl" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = interpolate(frame, [Math.max(9, durationInFrames - 7), durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const a = Math.min(inP, out);
  const anchor: React.CSSProperties =
    pos === "tl" ? { left: "6%", top: "13%" }
    : pos === "br" ? { right: "6%", bottom: "12%", textAlign: "right" }
    : { left: "6%", bottom: "12%" };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute", ...anchor, maxWidth: "52%",
        opacity: a, transform: `translateY(${((1 - inP) * 18).toFixed(1)}px)`,
      }}>
        <div style={{
          display: "inline-block", padding: "14px 26px 16px",
          background: `linear-gradient(180deg, ${rgba(V.ink0, 0.74)} 0%, ${rgba(V.ink0, 0.56)} 100%)`,
          backdropFilter: "blur(9px)",
          borderLeft: `5px solid ${rgba(V.volt, 0.92)}`,
          fontFamily: F_DISPLAY, fontSize: 52, lineHeight: 1.1, color: V.white,
          textShadow: `0 4px 22px ${rgba(V.ink0, 0.9)}`,
        }}>{texto}</div>
      </div>
    </AbsoluteFill>
  );
};

/** CTA — la tarjeta del cierre: la PORTADA de la guía o el QR, flotando al costado mientras el
 *  presentador habla FULL detrás. ⛔ NUNCA precio, NUNCA la URL en pantalla. */
export const Cta: React.FC<{ src: string; texto?: string; lado?: "der" | "izq" }> = ({
  src, texto, lado = "der",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = interpolate(frame, [Math.max(17, durationInFrames - 12), durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const a = Math.min(inP, out);
  const flot = Math.sin(frame / 46) * 6;
  const dx = (1 - inP) * (lado === "der" ? 44 : -44);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute", top: "50%",
        [lado === "der" ? "right" : "left"]: "6.5%",
        transform: `translateY(calc(-50% + ${flot.toFixed(1)}px)) translateX(${dx.toFixed(1)}px)`,
        opacity: a, display: "flex", flexDirection: "column", alignItems: "center", gap: 18,
      }}>
        <div style={{
          borderRadius: 14, overflow: "hidden",
          boxShadow: `0 34px 80px ${rgba(V.ink0, 0.9)}, 0 0 0 1px ${rgba(V.paper, 0.22)}`,
        }}>
          <Img src={staticFile(src)} style={{ display: "block", height: 470, width: "auto", objectFit: "contain" }} />
        </div>
        {texto ? (
          <div style={{
            fontFamily: F_DISPLAY, fontSize: 40, lineHeight: 1.12, color: V.volt, textAlign: "center",
            maxWidth: 470, textShadow: `0 5px 24px ${rgba(V.ink0, 0.95)}`,
          }}>{texto}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/** FICHA — una tarjeta de DATOS del video (no una página de la guía). Se distingue a propósito de
 *  `Lamina`: fondo del kit, no papel. Así el espectador nunca confunde un dato del video con una
 *  página del producto — la regla de "la lámina tiene que ser de verdad una página de la guía".
 *  `texto` viene del plan con saltos de línea: la primera línea es el título, el resto son filas. */
export const Ficha: React.FC<{ texto: string; bed?: string }> = ({ texto, bed }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const D = Math.max(2, durationInFrames);
  const inP = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = interpolate(frame, [0, D], [1.0, 1.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineas = String(texto || "").split("\n").map((s) => s.trim()).filter(Boolean);
  const titulo = lineas[0] || "";
  // ⛔ El plan a veces deja las viñetas como MARCADORES sin contenido ("1 ·", "2 ·"). Renderizadas
  // dan una lista de puntos vacíos que se ve como un componente roto — y ninguna compuerta lo mira,
  // porque la prop existe y el componente no crashea. Se descartan: queda sólo el título.
  const filas = lineas.slice(1).filter((x) => !/^\d+\s*[·.\-–]?\s*$/.test(x) && x.replace(/[^\wáéíóúñÁÉÍÓÚÑ]/gi, "").length > 1);
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {bed ? (
        <Img src={staticFile(bed)} style={{
          width: "100%", height: "100%", objectFit: "cover",
          filter: "blur(30px) saturate(0.62) brightness(0.34)", transform: "scale(1.16)",
        }} />
      ) : null}
      <AbsoluteFill style={{ background: `radial-gradient(78% 66% at 34% 40%, ${rgba(V.volt, 0.10)} 0%, rgba(0,0,0,0) 72%)` }} />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", paddingLeft: "9%" }}>
        <div style={{
          maxWidth: "62%", opacity: inP,
          transform: `translateY(${((1 - inP) * 22).toFixed(1)}px) scale(${z.toFixed(4)})`,
          transformOrigin: "left center",
        }}>
          <div style={{
            fontFamily: F_DISPLAY, fontSize: 74, lineHeight: 1.06, color: V.white,
            letterSpacing: "-0.012em", textShadow: `0 8px 34px ${rgba(V.ink0, 0.95)}`,
            borderLeft: `6px solid ${rgba(V.volt, 0.95)}`, paddingLeft: 26, marginBottom: filas.length ? 30 : 0,
          }}>{titulo}</div>
          {filas.map((f, i) => {
            const ap = interpolate(frame, [10 + i * 7, 24 + i * 7], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            return (
              <div key={i} style={{
                display: "flex", alignItems: "baseline", gap: 20,
                padding: "13px 0 13px 26px", opacity: ap,
                transform: `translateX(${((1 - ap) * 20).toFixed(1)}px)`,
                borderBottom: i < filas.length - 1 ? `1px solid ${rgba(V.white, 0.14)}` : "none",
              }}>
                <div style={{ width: 9, height: 9, borderRadius: 2, background: V.volt, flexShrink: 0 }} />
                <div style={{
                  fontFamily: F_BODY, fontSize: 40, lineHeight: 1.24, color: V.bone,
                  textShadow: `0 4px 20px ${rgba(V.ink0, 0.9)}`,
                }}>{f}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
