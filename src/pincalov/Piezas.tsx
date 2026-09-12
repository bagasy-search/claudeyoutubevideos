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

/** KEN-BURNS VARIADO — ⛔ REGLA DURA, CROSS-NICHO (feedback del creador, 2026-09-10).
 *  Lo que había antes: `interpolate(frame,[0,n],[1.04,1.11])` con origen en el centro, IGUAL en los
 *  249 planos del video. El creador lo describió así: *"todos los zooms en imagenes son IDENTICOS,
 *  algunos deben ser zoom out no todos zoom in hacia el centro, y al azar no siempre zoom out luego
 *  in luego out perfecto sino al azar"*.
 *
 *  Cuatro cosas varían, y las cuatro salen del MISMO seed (determinista: el farm rinde en chunks
 *  paralelos y cada uno tiene que dar exactamente lo mismo — ⛔ nunca Math.random):
 *    1. SENTIDO: zoom in o zoom out, sorteado por plano. ⛔ NO alternado (in/out/in/out se lee como
 *       un metrónomo visual, que es la otra mitad de la queja).
 *    2. RECORRIDO: cuánto zoom, entre 4,5 % y 12 % — no todos el mismo salto.
 *    3. ORIGEN: el punto desde el que se abre o se cierra, entre 30 % y 70 % en los dos ejes. No
 *       siempre el centro.
 *    4. DERIVA: hacia dónde se corre, en X y en Y, con signo y magnitud propios.
 *
 *  ⚠️ COBERTURA: con `objectFit:"cover"` y escala >= 1 el cuadro queda cubierto desde cualquier
 *  origen. La deriva es lo que puede destapar un borde: |d| <= min(o, 100-o) * (escalaMIN - 1).
 *  Con origen en [30,70] y escala mínima 1,05 el techo es 1,5 % — por eso la deriva se topa en 1,2 %.
 */
const useKenBurns = (seed: number, base: number, ampMax: number) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  // cinco sorteos INDEPENDIENTES del mismo seed (misma fórmula, distinta sal)
  const r1 = rnd(seed * 1.7 + 11.3);
  const r2 = rnd(seed * 3.1 + 37.7);
  const r3 = rnd(seed * 5.3 + 71.1);
  const r4 = rnd(seed * 7.9 + 113.9);
  const r5 = rnd(seed * 11.3 + 167.3);

  const acerca = r1 < 0.5;                       // 1. AL AZAR, no alternado
  const amp = 0.045 + r2 * (ampMax - 0.045);     // 2. cuánto recorre
  const lo = base, hi = base + amp;
  const desde = acerca ? lo : hi;
  const hasta = acerca ? hi : lo;

  const ox = 30 + r3 * 40;                       // 3. origen, 30-70 %
  const oy = 30 + r4 * 40;

  const escalaMin = Math.min(desde, hasta);
  const techo = Math.min(ox, 100 - ox, oy, 100 - oy) * (escalaMin - 1);
  const dMax = Math.min(1.2, Math.max(0, techo));
  const ang = r5 * Math.PI * 2;                  // 4. deriva con dirección propia
  const dx = Math.cos(ang) * dMax;
  const dy = Math.sin(ang) * dMax;

  const k = interpolate(frame, [0, n], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = desde + (hasta - desde) * k;
  return {
    transform: `scale(${z.toFixed(4)}) translate(${(dx * k).toFixed(3)}%, ${(dy * k).toFixed(3)}%)`,
    transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
  };
};

/** CLIP real a sangre. `loop` porque el clip de agnes dura ~4 s y el plano puede durar más:
 *  sin loop el último cuadro se CONGELA y se lee como plano muerto. */
export const Clip: React.FC<{ src: string; seed?: number }> = ({ src, seed = 1 }) => {
  const t = useKenBurns(seed, 1.03, 0.075);   // el clip ya se mueve solo: recorrido más corto
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        loop
        style={{ width: "100%", height: "100%", objectFit: "cover", ...t }}
      />
    </AbsoluteFill>
  );
};

/** FOTO con Ken-Burns lento. */
export const Foto: React.FC<{ src: string; seed?: number }> = ({ src, seed = 1 }) => {
  const t = useKenBurns(seed, 1.05, 0.12);
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...t }} />
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
