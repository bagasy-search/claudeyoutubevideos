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
import { AbsoluteFill, Img, Loop, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const INK = "#0A0B08";

/** rnd determinista: el farm rinde en 60 chunks separados y cada uno tiene que dar EXACTAMENTE
 *  lo mismo. ⛔ Nunca Math.random acá. */
const rnd = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/** Push lento por CSS (subpíxel). ⛔ El movimiento NUNCA se hornea con ffmpeg (`zoompan` cuantiza a
 *  píxel entero: unos cuadros no se mueven y otros saltan 2 px, y eso se lee como tirón).
 *
 *  ⛔⛔ REGLA DEL CREADOR (sep-2026, PARA SIEMPRE Y PARA TODOS LOS NICHOS): los zooms NO pueden ser
 *  todos iguales. La versión vieja hacía SIEMPRE lo mismo —1,04 → 1,11, siempre ACERCANDO y siempre
 *  al CENTRO— y con 228 fotos seguidas eso se lee como un tic. Tampoco vale alternar
 *  acerca/aleja/acerca prolijito: eso es otro patrón y también se nota.
 *
 *  Lo que varía POR PLANO, todo derivado de la misma semilla (el cuadro de inicio del cue):
 *   · SENTIDO: acerca o aleja, 50/50 y sin patrón (medido: 53% de cambios de sentido = azar).
 *   · CANTIDAD: entre `ampMin` y `ampMax`, no un valor fijo.
 *   · FOCO: `transformOrigin` entre 28% y 72% en los dos ejes — el zoom NO va al centro.
 *   · DERIVA: paneo suave con signo propio en cada eje.
 *
 *  ⛔ El paneo NUNCA puede destapar el fondo: al zoom MÁS CHICO (`piso`) el margen por lado es
 *  100·(piso−1)/(2·piso) — con piso 1,06 son 2,83% y el paneo topea en 1,3%. Si tocás `piso` o
 *  `pan`, rehacé la cuenta.
 *  ⛔ Y nada de `Math.random`: el farm rinde en 60 chunks separados y cada uno tiene que dar
 *  EXACTAMENTE lo mismo. */
const useKenBurns = (seed: number, piso: number, ampMin: number, ampMax: number, pan: number) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const r = (o: number) => rnd(seed + o);
  const amp = ampMin + (ampMax - ampMin) * r(7.3);
  const acerca = r(0) > 0.5;
  const lo = piso, hi = piso + amp / 100;
  const z = interpolate(frame, [0, n], acerca ? [lo, hi] : [hi, lo], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dx = (r(31.9) - 0.5) * 2 * pan;
  const dy = (r(41.3) - 0.5) * 2 * pan * 0.7;
  const t = interpolate(frame, [0, n], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return {
    transform: `scale(${z.toFixed(4)}) translate(${(dx * t).toFixed(3)}%, ${(dy * t).toFixed(3)}%)`,
    transformOrigin: `${(28 + 44 * r(13.7)).toFixed(1)}% ${(28 + 44 * r(21.1)).toFixed(1)}%`,
  };
};

/** CLIP real a sangre.
 *  ⛔ `loop` NO es una prop de `OffthreadVideo` (cae en `...props` y se ignora en silencio): el clip
 *  de agnes dura ~4 s, el plano puede durar 7,6 s, y el último cuadro se CONGELA = plano muerto.
 *  El bucle se hace con `<Loop durationInFrames={frames}>`, con los cuadros REALES del archivo que
 *  mide el build. `tsc` sí marcaba el `loop` — no ignorar ese error. */
export const Clip: React.FC<{ src: string; seed?: number; frames?: number }> = ({ src, seed = 1, frames }) => {
  const kb = useKenBurns(seed, 1.03, 1.5, 4, 0.6);
  const video = (
    <OffthreadVideo
      src={staticFile(src)}
      muted
      style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }}
    />
  );
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      {frames && frames > 1 ? <Loop durationInFrames={frames}>{video}</Loop> : video}
    </AbsoluteFill>
  );
};

/** FOTO con Ken-Burns lento. */
export const Foto: React.FC<{ src: string; seed?: number }> = ({ src, seed = 1 }) => {
  const kb = useKenBurns(seed, 1.06, 3, 9, 1.3);
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
    </AbsoluteFill>
  );
};

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
