// MovTowelman.tsx — MOVIMIENTO 4 del video `mddrain` (~30 s, 900 frames @30).
//
// El único movimiento SIN datos. Es la historia: el pasillo, el viejo, el papel negro y la
// frase que le dio vuelta la carrera a Mike. Sólo luz, foco y una hoja de papel.
//
// Va montado sobre las fotos hero de la historia (h29-h33) — las recibe por props y las trata
// como material, no como fondo: la cámara vive DENTRO de la imagen.
//
// ── TABLA DE HANDOFF ────────────────────────────────────────────────────────────────────────
// acto 1  f0-200    LA PUERTA       enterFrom: negro con una franja de luz de pasillo (viene del Mov 3).
//                                   exitTo:   la foto del pasillo, foco lejos.
//                                   materia:  la franja de luz = la rendija de la puerta.
// acto 2  f200-430  EL PAPEL ENTRA  enterFrom: mismo pasillo, rack focus del fondo al primer plano.
//                                   exitTo:   el papel ocupa el tercio derecho, negro y quieto.
//                                   materia:  el papel.
// acto 3  f430-660  EL SILENCIO     enterFrom: papel en foco; TODO lo demás cae a negro.
//                                   exitTo:   sólo el papel iluminado, la frase apareciendo.
//                                   materia:  el papel se queda; se va el pasillo.
// acto 4  f660-830  LA FRASE        enterFrom: papel + frase.
//                                   exitTo:   la frase sola sobre negro.
//                                   materia:  la mancha del papel se vuelve el subrayado de la frase.
// acto 5  f830-900  LA CAMIONETA    enterFrom: negro con el subrayado rojo.
//                                   exitTo:   luz de parabrisas (entrega al avatar).
//
// COSTURAS: 1→2 RACK FOCUS (los dos desenfoques coinciden) · 2→3 OCLUSIÓN (el papel tapa) ·
// 3→4 MATCH-SHAPE (mancha → subrayado) · 4→5 WIPE POR MATERIA (barrido de luz de parabrisas).
import React from "react";
import { AbsoluteFill, Img, staticFile, interpolate, useCurrentFrame, Easing } from "remotion";
import { MD, rgba, clamp01, lerp, rnd, Atmos, Occluder, Kicker, Em } from "../mdmold/Stage";

const A1 = 0, A2 = 200, A3 = 430, A4 = 660, A5 = 830;

export const MovTowelman: React.FC<{
  durationInFrames: number;
  hallway?: string;   // "img/mddrain_h32_oldmanhall.png"
  face?: string;      // "img/mddrain_h33_facefalls.png"
  truck?: string;     // "img/mddrain_h31_truckseat.png"
}> = ({ durationInFrames, hallway, face, truck }) => {
  const frame = useCurrentFrame();
  const D = durationInFrames;

  // una sola cámara: empuje lento y continuo, sin resets
  const push = interpolate(frame, [0, D], [1.02, 1.19], { easing: Easing.bezier(0.3, 0, 0.22, 1) });
  const panX = interpolate(frame, [0, D], [10, -22], { easing: Easing.bezier(0.3, 0, 0.22, 1) });

  // rack focus: el fondo se va, el papel llega
  const rack = interpolate(frame, [A2, A2 + 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.34, 0, 0.2, 1) });
  const bgBlur = lerp(1.2, 9, rack);
  const roomFade = interpolate(frame, [A3, A3 + 110], [1, 0.06], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // el papel entra desde la derecha y se queda quieto (el silencio ES el efecto)
  const paperIn = interpolate(frame, [A2 + 20, A2 + 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 0.8, 0.2, 1) });
  const paperX = lerp(64, 0, paperIn);
  const paperOut = interpolate(frame, [A4 + 90, A5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // la frase, palabra por bloque
  const words = ["Son,", "you cleaned", "the", "wrong four inches."];
  const wOp = (i: number) =>
    interpolate(frame, [A4 + i * 26, A4 + i * 26 + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const underline = interpolate(frame, [A4 + 120, A4 + 180], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 0.7, 0.2, 1) });

  const truckIn = interpolate(frame, [A5, A5 + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sweep = interpolate(frame, [A5 - 10, A5 + 40], [-40, 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0 }}>
      <Atmos tint={MD.warm} keyFrom={0.34} intensity={0.55} floor={false} />

      {/* el pasillo: material, no fondo — la cámara vive adentro */}
      {hallway && roomFade > 0.02 && (
        <AbsoluteFill style={{ overflow: "hidden", opacity: roomFade }}>
          <Img
            src={staticFile(hallway)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${push.toFixed(4)}) translateX(${panX.toFixed(1)}px)`,
              filter: `blur(${bgBlur.toFixed(2)}px) brightness(${(0.72 - rack * 0.22).toFixed(2)}) saturate(0.72)`,
            }}
          />
          <AbsoluteFill style={{ background: "radial-gradient(72% 64% at 42% 46%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.78) 100%)" }} />
        </AbsoluteFill>
      )}

      {/* la cara de Mike, muy brevemente, en el acto 3 (el golpe) */}
      {face && (
        <AbsoluteFill
          style={{
            opacity: interpolate(frame, [A3 - 40, A3 + 10, A3 + 90, A3 + 130], [0, 0.9, 0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            overflow: "hidden",
          }}
        >
          <Img
            src={staticFile(face)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${(push * 1.06).toFixed(4)})`,
              filter: "brightness(0.62) saturate(0.7)",
            }}
          />
          <AbsoluteFill style={{ background: "radial-gradient(64% 58% at 50% 44%, rgba(0,0,0,0) 26%, rgba(0,0,0,0.86) 100%)" }} />
        </AbsoluteFill>
      )}

      {/* EL PAPEL — la materia que atraviesa las cuatro fronteras */}
      {paperIn > 0.01 && paperOut > 0.01 && (
        <div
          style={{
            position: "absolute",
            right: `${8 + paperX}%`,
            top: "18%",
            width: 470,
            height: 620,
            opacity: paperIn * paperOut,
            transform: `rotate(${lerp(7, 1.6, paperIn).toFixed(2)}deg) scale(${lerp(0.88, 1, paperIn).toFixed(3)})`,
            background: "linear-gradient(158deg, #F3F1EA 0%, #DCD8CE 52%, #C3BFB4 100%)",
            borderRadius: 6,
            boxShadow: "0 50px 110px rgba(0,0,0,0.8), 0 4px 12px rgba(0,0,0,0.6)",
            overflow: "hidden",
          }}
        >
          {/* la mancha: lo único que importa del plano */}
          <div
            style={{
              position: "absolute",
              left: "6%",
              top: "28%",
              width: "88%",
              height: "40%",
              borderRadius: "48% 52% 46% 54%",
              background: "radial-gradient(ellipse at 42% 40%, #17181A 0%, #26282B 46%, rgba(38,40,43,0.42) 100%)",
              filter: "blur(1.2px)",
            }}
          />
          {Array.from({ length: 12 }, (_, i) => {
            const s = rnd(i * 5.1);
            const s2 = rnd(i * 12.7);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${8 + s * 80}%`,
                  top: `${26 + s2 * 44}%`,
                  width: 10 + s2 * 44,
                  height: 8 + s * 26,
                  borderRadius: "50%",
                  background: rgba("#1A1B1D", 0.5 + s * 0.4),
                  filter: "blur(2px)",
                }}
              />
            );
          })}
          {/* fibras del papel */}
          <AbsoluteFill style={{ opacity: 0.16, mixBlendMode: "multiply" }}>
            <svg width="100%" height="100%">
              <filter id="paperfib">
                <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed={11} />
              </filter>
              <rect width="100%" height="100%" filter="url(#paperfib)" />
            </svg>
          </AbsoluteFill>
        </div>
      )}

      {/* la frase */}
      {frame >= A4 && (
        <div style={{ position: "absolute", left: 130, top: "40%", maxWidth: 900 }}>
          <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 82, lineHeight: 1.08, color: MD.white, textShadow: "0 8px 40px rgba(0,0,0,0.95)" }}>
            {words.map((w, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  marginRight: 18,
                  opacity: wOp(i),
                  transform: `translateY(${interpolate(wOp(i), [0, 1], [16, 0]).toFixed(1)}px)`,
                }}
              >
                {i === 3 ? <Em color={MD.redHot}>{w}</Em> : w}
              </span>
            ))}
          </div>
          {/* la mancha se volvió el subrayado */}
          <div
            style={{
              marginTop: 14,
              height: 7,
              width: `${underline * 74}%`,
              borderRadius: 4,
              background: `linear-gradient(90deg, ${MD.redHot} 0%, ${rgba(MD.red, 0.2)} 100%)`,
              boxShadow: `0 0 26px ${rgba(MD.redHot, 0.7)}`,
            }}
          />
        </div>
      )}

      {/* acto 5: la camioneta, con el barrido de luz de parabrisas */}
      {truck && truckIn > 0.01 && (
        <AbsoluteFill style={{ opacity: truckIn, overflow: "hidden" }}>
          <Img
            src={staticFile(truck)}
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${(1.06 + truckIn * 0.04).toFixed(4)})`, filter: "brightness(0.58) saturate(0.66)" }}
          />
          <AbsoluteFill style={{ background: "radial-gradient(70% 62% at 48% 46%, rgba(0,0,0,0) 28%, rgba(0,0,0,0.8) 100%)" }} />
          <AbsoluteFill
            style={{
              background: `linear-gradient(102deg, rgba(255,255,255,0) ${sweep - 22}%, ${rgba(MD.warm, 0.22)} ${sweep}%, rgba(255,255,255,0) ${sweep + 22}%)`,
            }}
          />
        </AbsoluteFill>
      )}

      {/* acto 1: la rendija de luz del pasillo */}
      {frame < A2 + 40 && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              left: `${interpolate(frame, [A1, A2], [46, 30], { extrapolateRight: "clamp" })}%`,
              top: 0,
              bottom: 0,
              width: interpolate(frame, [A1, A2], [26, 300], { extrapolateRight: "clamp" }),
              background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(MD.warm, 0.16)} 50%, rgba(0,0,0,0) 100%)`,
              opacity: interpolate(frame, [A2 - 40, A2 + 40], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              filter: "blur(14px)",
            }}
          />
        </AbsoluteFill>
      )}

      {/* costura 2→3: el papel tapa el cambio */}
      <Occluder at={A3 - 10} dur={14} color="#DCD8CE" angle={-6} />

      {/* kicker discreto, arriba, sólo en el acto 1 */}
      {frame < A2 && (
        <div style={{ position: "absolute", left: 120, top: 110, opacity: interpolate(frame, [30, 60, A2 - 30, A2], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <Kicker>A year later</Kicker>
        </div>
      )}
    </AbsoluteFill>
  );
};
