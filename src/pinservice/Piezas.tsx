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

/** rnd determinista: el farm rinde en chunks separados y cada uno tiene que dar EXACTAMENTE lo
 *  mismo. ⛔ Nunca Math.random acá. Tres hashes distintos para que el sentido, la cantidad y la
 *  deriva NO queden correlacionados (con un solo hash salen patrones). */
const rnd = (seed: number, salt = 0) => {
  const x = Math.sin((seed + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Push lento por CSS (subpíxel). ⛔ El movimiento NUNCA se hornea con ffmpeg (`zoompan` cuantiza a
 *  píxel entero: unos cuadros no se mueven y otros saltan 2 px, y eso se lee como tirón).
 *
 *  ⛔⛔ REGLA DEL CREADOR (sep-2026, PERMANENTE y para TODOS los nichos): los zooms NO pueden ser
 *  todos iguales. Antes todos los planos hacían el MISMO zoom IN hacia el centro y sólo cambiaba el
 *  lado de la deriva — con 250 planos eso se lee como un tic. Y tampoco vale alternar in/out/in
 *  prolijo: eso es otro patrón. Va **al azar por plano**, y al azar de verdad:
 *    · SENTIDO: entra o sale (~50/50, sorteado por plano)
 *    · CANTIDAD: cuánto se mueve, dentro de un rango
 *    · DERIVA: hacia dónde, en cualquiera de los 360°, no siempre al centro
 *  El `scale` base cubre la deriva máxima para que nunca asome el borde. */
const useKenBurns = (seed: number, intensidad = 1) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const t = interpolate(frame, [0, n], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const entra = rnd(seed, 1) > 0.5;                       // in o out, al azar
  const amp = (0.030 + rnd(seed, 2) * 0.055) * intensidad; // cuánto, al azar
  const ang = rnd(seed, 3) * Math.PI * 2;                  // hacia dónde, en 360°
  const BASE = 1.045;                                      // margen > deriva máx (1,4%) por lado
  const z = BASE + amp * (entra ? t : 1 - t);
  const px = Math.cos(ang) * 1.4 * (entra ? t : 1 - t);
  const py = Math.sin(ang) * 1.4 * (entra ? t : 1 - t);
  return `scale(${z.toFixed(4)}) translate(${px.toFixed(3)}%, ${py.toFixed(3)}%)`;
};

/** CLIP real a sangre. `loop` porque el clip de agnes dura ~4 s y el plano puede durar más:
 *  sin loop el último cuadro se CONGELA y se lee como plano muerto. */
export const Clip: React.FC<{ src: string; seed?: number }> = ({ src, seed = 1 }) => {
  const t = useKenBurns(seed, 0.55);   // el clip ya tiene movimiento propio: el push va más suave
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
  const t = useKenBurns(seed);
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
