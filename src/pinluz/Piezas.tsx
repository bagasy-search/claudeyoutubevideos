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
/** Hash entero (mulberry-ish). ⛔ NO usar `Math.sin(seed*12.9898)*43758.5453`: con seeds grandes
 *  (el seed es el frame de arranque del plano) pierde precision y se CORRELACIONA — medido en pinluz:
 *  daba 11 planos seguidos con el mismo sentido de zoom. */
const hash2 = (a: number, b: number) => {
  let x = Math.imul((a | 0) ^ 0x9e3779b9, 0x85ebca6b);
  x = Math.imul(x ^ (b | 0) ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
};
/** KEN BURNS al AZAR — ⛔⛔ REGLA DURA DEL CREADOR (cross-nicho, sep-2026):
 *  "todos los zooms en imagenes son IDENTICOS, algunos deben ser zoom out no todos zoom in hacia el
 *  centro, y al azar - no siempre zoom out luego in luego out perfecto sino al azar".
 *  La version vieja recibia `from`/`to` CONSTANTES (1.04 -> 1.11): todas las fotos hacian el mismo
 *  zoom in, a la misma velocidad, hacia el mismo centro, y 7% repartidos en todo el plano son
 *  ~1,5%/s = se lee como foto QUIETA (el creador lo reporto como "no estas animando ninguna imagen").
 *  Aca el seed decide TODO: sentido, amplitud, angulo del paneo y punto de foco.
 *
 *  ⛔ El movimiento va por el `transform` de Remotion (subpixel). NUNCA horneado con `zoompan` de
 *  ffmpeg, que cuantiza a pixel entero y se lee como tiron.
 *
 *  SEGURIDAD DE BORDE: el paneo se ata a la ESCALA (`k`), no al tiempo, asi el traslado maximo cae
 *  siempre en la escala maxima y el fondo no asoma nunca. Con ZBASE 1.06, origen en 35-65% y
 *  traslado <=2% en X / <=1,2% en Y, el margen alcanza con sobra en los dos extremos. */
const ZBASE = 1.06;

const useKenBurns = (seed: number, perSecMin: number, perSecMax: number, capTotal: number) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const secs = n / 30;

  const r = (k: number) => hash2(seed, k);

  // amplitud: %/s sorteado, con techo total -> los planos largos no se pasan de rosca
  const amp = Math.min(capTotal, (perSecMin + r(1) * (perSecMax - perSecMin)) * secs);
  // sentido: ~50/50 sorteado por plano. NO alternado: alternar es tan mecanico como no variar.
  const zoomIn = r(2) > 0.5;
  const zFrom = zoomIn ? ZBASE : ZBASE + amp;
  const zTo = zoomIn ? ZBASE + amp : ZBASE;

  // paneo en un angulo cualquiera (no solo horizontal)
  const ang = r(3) * Math.PI * 2;
  const travel = 0.8 + r(4) * 1.2;                 // 0,8 - 2,0 %
  const dx = Math.cos(ang) * travel;
  const dy = Math.sin(ang) * travel * 0.6;         // menos recorrido vertical

  // foco: el zoom NO va siempre al centro
  const ox = 35 + r(5) * 30;
  const oy = 35 + r(6) * 30;

  const z = interpolate(frame, [0, n], [zFrom, zTo], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const k = amp > 0 ? (z - ZBASE) / amp : 0;       // 0 en la escala minima, 1 en la maxima
  return {
    transform: `scale(${z.toFixed(4)}) translate(${(dx * k).toFixed(3)}%, ${(dy * k).toFixed(3)}%)`,
    transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
  };
};

/** Sentido del zoom de un plano, para la COMPUERTA del build (misma formula que useKenBurns). */
export const kenBurnsZoomIn = (seed: number) => hash2(seed, 2) > 0.5;

/** CLIP real a sangre. `loop` porque el clip de agnes dura ~4 s y el plano puede durar más:
 *  sin loop el último cuadro se CONGELA y se lee como plano muerto. */
export const Clip: React.FC<{ src: string; seed?: number }> = ({ src, seed = 1 }) => {
  const kb = useKenBurns(seed, 0.006, 0.014, 0.09);   // el clip ya tiene movimiento propio: push leve
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        loop
        style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }}
      />
    </AbsoluteFill>
  );
};

/** FOTO con Ken-Burns lento. */
export const Foto: React.FC<{ src: string; seed?: number }> = ({ src, seed = 1 }) => {
  // ⛔ 0,9-2,2 %/s (promedio 1,5) es lo que el creador vio como "no estas animando ninguna imagen".
  //    La foto esta QUIETA: el push tiene que NOTARSE. 1,8-4,0 %/s, techo 20% por plano.
  const kb = useKenBurns(seed, 0.018, 0.040, 0.20);
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
