// Piezas.tsx — las primitivas del montaje VLOG de `pinvacas`.
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
const useKenBurns = (seed: number, intensidad = 1): React.CSSProperties => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const t = interpolate(frame, [0, n], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const entra = rnd(seed, 1) > 0.5;                        // in o out, al azar
  const amp = (0.030 + rnd(seed, 2) * 0.055) * intensidad; // cuánto, al azar
  const ang = rnd(seed, 3) * Math.PI * 2;                  // hacia dónde, en 360°
  // ⛔ Y DESDE DÓNDE: con el origen siempre en el centro, todos los planos abren igual aunque el
  //    sentido y la cantidad varíen. El origen se sortea en 30-70% de los DOS ejes.
  const ox = 30 + rnd(seed, 4) * 40;
  const oy = 30 + rnd(seed, 5) * 40;
  const BASE = 1.045;
  const z = BASE + amp * (entra ? t : 1 - t);
  // la deriva se ata a la ESCALA (no al tiempo) y topea contra el margen REAL del origen sorteado,
  // así el traslado máximo coincide con la escala máxima y nunca asoma el fondo.
  const margen = Math.min(ox, 100 - ox, oy, 100 - oy) * (BASE - 1);
  const dMax = Math.min(1.4, Math.max(0, margen));
  const k = entra ? t : 1 - t;
  const px = Math.cos(ang) * dMax * k;
  const py = Math.sin(ang) * dMax * k;
  return {
    transform: `scale(${z.toFixed(4)}) translate(${px.toFixed(3)}%, ${py.toFixed(3)}%)`,
    transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
  };
};

/** CLIP real a sangre.
 *  ⛔⛔ `loop` NO ES UNA PROP DE `OffthreadVideo`. Cae en el `...props` y se IGNORA en silencio:
 *  compila, renderiza, no avisa nada — y como el clip de agnes dura ~4 s y el plano puede durar 9,
 *  el último cuadro se CONGELA el resto del slot. Es el "plano muerto" que el creador marca.
 *  Lo traicionero es que el comentario de la versión anterior AFIRMABA que `loop` servía, o sea que
 *  la creencia equivocada venía escrita al lado del bug. `tsc` sí lo marca, y es la única compuerta
 *  que lo caza. Va `<Loop durationInFrames={frames}>`, con los cuadros REALES medidos por el build. */
export const Clip: React.FC<{ src: string; seed?: number; frames?: number }> = ({ src, seed = 1, frames }) => {
  const t = useKenBurns(seed, 0.55);   // el clip ya tiene movimiento propio: el push va más suave
  const video = (
    <OffthreadVideo
      src={staticFile(src)}
      muted
      style={{ width: "100%", height: "100%", objectFit: "cover", ...t }}
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
  const t = useKenBurns(seed);
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...t }} />
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

/** EL COMENTARIO — la única excepción a "cero componentes" de este canal, pedida por el creador:
 *  el comentario que originó el video aparece escrito en pantalla cuando la voz lo lee.
 *
 *  ⛔ SIN NOMBRE NI FOTO REALES. El comentario es de una persona de verdad en un video de verdad:
 *  inventarle un @handle o una cara la suplanta. Va con la franja del nombre TACHADA (anonimizada),
 *  que además se lee al instante como "esto es un comentario". El TEXTO sí es el suyo, y los 221
 *  me gusta son los reales.
 *
 *  Simple y hermoso: tarjeta de papel sobre el plano, entra con un plop, la segunda línea aparece
 *  cuando la voz llega a ella, y el contador de me-gusta sube hasta 221.
 */
