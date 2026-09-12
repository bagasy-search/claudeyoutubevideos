// Piezas.tsx — las primitivas del montaje VLOG de `pinservice`.
//
// La vara del canal (validada por el creador en `cmesodimac`): planos CRUDOS a pantalla completa,
// cortes secos, CERO componentes, cero texto encima. La única composición que sobrevive es el CTA
// con el QR, porque necesita un cuadro quieto para poder escanearse.
//
// ⛔⛔ TODO video va con `OffthreadVideo`, NUNCA con `<Video>`. Al RENDERIZAR, `<Video>` monta un
// elemento HTML que busca POR TIEMPO y no acierta el cuadro exacto: repite y saltea cuadros de forma
// IRREGULAR, y eso se lee como TIRÓN (peor que una duplicación pareja, justamente por irregular).
// Es la causa #1 del "se ve todo lageado" y costó cinco renders encontrarla.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const INK = "#0A0B08";

/** rnd determinista: el farm rinde en 60 chunks separados y cada uno tiene que dar EXACTAMENTE
 *  lo mismo. ⛔ Nunca Math.random acá. */
const rnd = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/** Push lento por CSS (subpíxel). ⛔ El movimiento NUNCA se hornea con ffmpeg (`zoompan` cuantiza a
 *  píxel entero: unos cuadros no se mueven y otros saltan 2 px, y eso se lee como tirón). */
const useKenBurns = (seed: number, from: number, to: number) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const dir = rnd(seed) > 0.5 ? 1 : -1;
  const z = interpolate(frame, [0, n], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const px = interpolate(frame, [0, n], [0, dir * 1.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return `scale(${z.toFixed(4)}) translateX(${px.toFixed(3)}%)`;
};

/** CLIP real a sangre. `loop` porque el clip de agnes dura ~4 s y el plano puede durar más:
 *  sin loop el último cuadro se CONGELA y se lee como plano muerto. */
export const Clip: React.FC<{ src: string; seed?: number }> = ({ src, seed = 1 }) => {
  const t = useKenBurns(seed, 1.02, 1.06);
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        loop
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: t }}
      />
    </AbsoluteFill>
  );
};

/** FOTO con Ken-Burns lento. */
export const Foto: React.FC<{ src: string; seed?: number }> = ({ src, seed = 1 }) => {
  const t = useKenBurns(seed, 1.04, 1.11);
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: t }} />
    </AbsoluteFill>
  );
};

/** Lámina FIJA a pantalla completa. Es lo que lleva el CTA: un QR con push lento se recorta contra
 *  el borde (objectFit cover + scale 1.11 se come el 11% del cuadro, y ahí viven el dominio y la
 *  marca) y además cuesta escanearlo si se mueve. Va quieta y entera. */
export const Lamina: React.FC<{ src: string }> = ({ src }) => (
  <AbsoluteFill style={{ backgroundColor: INK }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
  </AbsoluteFill>
);

/** CTA — QR + dominio, en la capa `over`.
 *  ⛔ El CTA NUNCA vive adentro de un componente de escena: en `cmetemu` el QR estaba hardcodeado
 *  dentro de un `Mov*` y al pasar el video a modo VLOG se fue con él — el video salió sin CTA y
 *  ninguna compuerta lo vio. Va suelto, en su propia capa, atado al ms de la frase. */
export const Cta: React.FC<{ qr: string; dominio: string }> = ({ qr, dominio }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = interpolate(frame, [Math.max(14, durationInFrames - 12), durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const a = Math.min(inP, out);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute", right: 96, bottom: 150,   // 150: más abajo lo tapan los controles del reproductor web
          display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
          opacity: a, transform: `translateY(${((1 - inP) * 22).toFixed(1)}px)`,
        }}
      >
        {/* el QR va sobre BLANCO sólido y sin escalar raro: se verifica decodificándolo DEL RENDER */}
        <div style={{ background: "#FFFFFF", padding: 16, borderRadius: 10, boxShadow: "0 18px 50px rgba(0,0,0,.65)" }}>
          <Img src={staticFile(qr)} style={{ width: 300, height: 300, display: "block", imageRendering: "pixelated" }} />
        </div>
        <div
          style={{
            fontFamily: "Oswald, Impact, system-ui, sans-serif", fontSize: 40, letterSpacing: "0.01em",
            color: "#FFFFFF", background: "rgba(10,11,8,.86)", padding: "8px 20px", borderRadius: 6,
            textShadow: "0 3px 16px rgba(0,0,0,.9)",
          }}
        >
          {dominio}
        </div>
      </div>
    </AbsoluteFill>
  );
};
