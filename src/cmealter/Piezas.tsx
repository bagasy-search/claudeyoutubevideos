// Piezas.tsx — primitivas del montaje VLOG CRUDO de la FÁBRICA (estilo compartido, NO clonar por slug).
// Procedencia: src/tcbriquetas/Piezas.tsx (Taller de Claudio). El build la copia a src/<slug>/Piezas.tsx
// para que el árbol de imports del farm sea autocontenido; la fuente de verdad es ESTE archivo.
// cero componentes. Lo único encima es el CTA: texto + QR opcional. El QR necesita un cuadro quieto
// para poder escanearse, por eso es la ÚNICA composición que sobrevive al vlog crudo.
//
// ⛔⛔ TODO video va con `OffthreadVideo`, NUNCA con `<Video>` (busca por tiempo, repite y saltea
// cuadros de forma irregular = el "se ve lageado").
import React from "react";
import { AbsoluteFill, Img, Loop, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const INK = "#0A0B08";

/** rnd determinista con hash ENTERO. ⛔ `Math.sin(seed*12.9898)` con seeds grandes (el seed es el
 *  cuadro de arranque) pierde precisión y se correlaciona (medido en pinluz: racha 11, 43/57). */
const rnd = (seed: number, salt = 0) => {
  let h = Math.imul(((seed | 0) + salt * 7919) ^ 0x9e3779b9, 0x85ebca6b);
  h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};

/** Ken-Burns por CSS (subpíxel), distinto en CADA plano y al AZAR (regla del creador, todos los
 *  nichos): sentido in/out sorteado, cantidad sorteada, origen sorteado en 30-70 % de los dos ejes y
 *  deriva en cualquier ángulo, atada a la escala para que nunca asome el borde. */
const useKenBurns = (seed: number, intensidad = 1): React.CSSProperties => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const t = interpolate(frame, [0, n], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const entra = rnd(seed, 1) > 0.5;
  const amp = (0.04 + rnd(seed, 2) * 0.08) * intensidad;
  const ang = rnd(seed, 3) * Math.PI * 2;
  const ox = 30 + rnd(seed, 4) * 40;
  const oy = 30 + rnd(seed, 5) * 40;
  const BASE = 1.045;
  const k = entra ? t : 1 - t;
  const z = BASE + amp * k;
  const margen = Math.min(ox, 100 - ox, oy, 100 - oy) * (BASE - 1);
  const dMax = Math.min(1.4, Math.max(0, margen));
  return {
    transform: `scale(${z.toFixed(4)}) translate(${(Math.cos(ang) * dMax * k).toFixed(3)}%, ${(Math.sin(ang) * dMax * k).toFixed(3)}%)`,
    transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
  };
};

/** CLIP a sangre. ⛔ `loop` NO es prop de OffthreadVideo (se ignora y el clip se CONGELA): va
 *  `<Loop durationInFrames={frames}>` con los cuadros REALES que midió el build. */
export const Clip: React.FC<{ src: string; seed?: number; frames?: number }> = ({ src, seed = 1, frames }) => {
  const t = useKenBurns(seed, 0.45);
  const video = <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", ...t }} />;
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      {frames && frames > 1 ? <Loop durationInFrames={frames}>{video}</Loop> : video}
    </AbsoluteFill>
  );
};

/** FOTO con Ken-Burns (red de seguridad cuando el clip de agnes no llega o se rechaza). */
export const Foto: React.FC<{ src: string; seed?: number }> = ({ src, seed = 1 }) => {
  const t = useKenBurns(seed);
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...t }} />
    </AbsoluteFill>
  );
};

/** PISO del avatar: la PLACA de Claudio en su taller (la misma imagen que animó InfiniteTalk).
 *  Sólo se ve si un plano no llega a su ventana: nunca negro. Push lento, nunca estático. */
export const PlacaPiso: React.FC<{ src: string }> = ({ src }) => {
  const f = useCurrentFrame();
  const s = 1.03 + Math.sin(f / 900) * 0.02;
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)})` }} />
    </AbsoluteFill>
  );
};

/** VENTANA del avatar (InfiniteTalk, lipsync real de ESA frase). Muteado: el audio sale del máster.
 *  El push es el MISMO que el de la placa (misma fórmula sobre el cuadro GLOBAL), así la entrada y la
 *  salida de la ventana no saltan de escala. */
export const AvatarVentana: React.FC<{ src: string; desde: number }> = ({ src, desde }) => {
  const f = useCurrentFrame() + desde;
  const s = 1.03 + Math.sin(f / 900) * 0.02;
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)})` }} />
    </AbsoluteFill>
  );
};

/** CTA DE CANAL — suscripción + lo que viene. OVERLAY en la esquina inferior, sin tarjeta a pantalla
 *  completa. ⛔ Va en la capa `over`, NUNCA como cue base (en dale1 dejó 13 s de negro). */
export const CtaFinal: React.FC<{ head: string; sub?: string; qr?: string }> = ({ head, sub, qr }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = interpolate(frame, [Math.max(16, durationInFrames - 10), durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const a = Math.min(inP, out);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 64, bottom: 150, maxWidth: 1600, opacity: a, transform: `translateY(${((1 - inP) * 26).toFixed(1)}px)`, display: "flex", alignItems: "flex-end", gap: 20 }}>
        <div style={{ padding: "18px 30px 20px", background: "rgba(10,11,8,.74)", borderLeft: "6px solid #F2B233" }}>
          <div style={{ fontFamily: "Oswald, Impact, system-ui, sans-serif", fontSize: 72, lineHeight: 1.04, fontWeight: 800, textTransform: "uppercase", color: "#FFFFFF", textShadow: "0 4px 24px rgba(0,0,0,.95)" }}>{head}</div>
          {sub ? <div style={{ fontFamily: "Oswald, Impact, system-ui, sans-serif", fontSize: 42, lineHeight: 1.15, marginTop: 10, color: "#F2B233", textShadow: "0 4px 22px rgba(0,0,0,.95)" }}>{sub}</div> : null}
          </div>
          {qr ? (
            <div style={{ display: "flex", alignItems: "center", gap: 18, padding: 14, background: "#FFFFFF", borderLeft: "6px solid #F2B233" }}>
              <Img src={staticFile(qr)} style={{ width: 208, height: 208, display: "block", imageRendering: "pixelated" }} />
            </div>
          ) : null}
      </div>
    </AbsoluteFill>
  );
};
