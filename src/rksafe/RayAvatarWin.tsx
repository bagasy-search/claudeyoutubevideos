// RayAvatarWin.tsx — UNA VENTANA de avatar del canal Ray Kessler, DENTRO DE UNA PUESTA.
//
// En este flujo el avatar NO es una capa de fondo continua: se genera en RunPod SÓLO para las
// ventanas visibles (~25 % del video) y cada ventana se monta como un plano más de la capa base.
//
// ⛔⛔ POR QUÉ NO VA A PANTALLA COMPLETA (medido, y el creador lo rechazó en `rkspare`):
//    el endpoint público de InfiniteTalk devuelve **832×464 FIJO** y no tiene parámetro de
//    resolución. A pantalla completa eso es un upscale de **2,31×** y se ve blando y plástico
//    ("el avatar es muy poco real"). Acá el reel se conforma a **960×540** (lanczos + unsharp) y
//    el panel mide EXACTAMENTE 960×540, o sea **1:1 en pantalla**: el upscale real cae a
//    **1,154×** (1,19× en el pico del push). El resto del cuadro lo llena la puesta: la cama de
//    foto del momento, oscurecida, más la chapa de marca del canal.
// ⛔ OffthreadVideo SIEMPRE, nunca <Video>: en el render <Video> busca por TIEMPO y no acierta el
//    cuadro exacto. Va MUTEADO: el audio sale de UN solo <Audio> con el máster.
// ⛔ El push es MUY leve y determinista por seed. Más de ~1 %/s sobre una cara se nota y marea.
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, rnd, rgba } from "./RayStage";

const PW = 960;   // = 960/832 -> upscale 1,154x  (el reel se conforma a 960x540)
const PH = 540;

export const RayAvatarWin: React.FC<{ src: string; seed?: number; durF?: number; bed?: string }> = ({
  src, seed = 1, durF, bed,
}) => {
  const frame = useCurrentFrame();
  const cfg = useVideoConfig();
  const dur = Math.max(12, durF ?? cfg.durationInFrames);

  // push leve, sentido sorteado (nunca alternado)
  const acerca = rnd(seed * 3 + 7) < 0.5;
  const amp = 0.012 + rnd(seed * 11 + 5) * 0.018;          // 1,2 % a 3,0 %
  const z = interpolate(frame, [0, dur], acerca ? [1.0, 1.0 + amp] : [1.0 + amp, 1.0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.linear,
  });
  // el panel va a un lado o al otro segun la seed: 60 ventanas con el mismo reparto se leen como plantilla
  const derecha = rnd(seed * 23 + 13) < 0.5;
  const px = derecha ? 1920 - PW - 96 : 96;
  const py = (1080 - PH) / 2;
  // la chapa de marca ocupa el hueco que deja el panel
  const cx = derecha ? 96 : 1920 - PW - 96 + PW - 760;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {bed ? (
        <Img
          src={staticFile(bed)}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.34) saturate(0.7)" }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at ${derecha ? "22%" : "78%"} 50%, ${rgba(V.ink0, 0.62)} 0%, ${rgba(V.ink0, 0.92)} 62%, ${rgba(V.ink0, 0.97)} 100%)`,
        }}
      />

      {/* chapa de marca del canal — texto FIJO del canal, nunca por prop (quinta familia) */}
      <div style={{ position: "absolute", left: cx, top: py + 96, width: 700 }}>
        <div style={{ width: 84, height: 3, backgroundColor: V.brass, marginBottom: 26 }} />
        <div style={{
          fontFamily: F_DISPLAY, fontSize: 62, lineHeight: 1.02, letterSpacing: 2,
          color: V.white, textTransform: "uppercase",
        }}>
          Ray Kessler
        </div>
        <div style={{
          fontFamily: F_DISPLAY, fontSize: 25, letterSpacing: 5, marginTop: 16,
          color: V.brassSoft, textTransform: "uppercase",
        }}>
          35 years · 4,000 doors
        </div>
        <div style={{ width: 340, height: 1, backgroundColor: rgba(V.brass, 0.45), marginTop: 30 }} />
        <div style={{
          fontFamily: F_DISPLAY, fontSize: 19, letterSpacing: 6, marginTop: 22,
          color: rgba(V.bone, 0.66), textTransform: "uppercase",
        }}>
          The four thousand doors
        </div>
      </div>

      {/* el panel del avatar: 960x540 EXACTOS = 1:1 con el reel conformado */}
      <div
        style={{
          position: "absolute", left: px, top: py, width: PW, height: PH,
          overflow: "hidden", backgroundColor: V.ink1,
          boxShadow: `0 28px 70px ${rgba("#000000", 0.62)}`,
          outline: `2px solid ${rgba(V.brass, 0.5)}`, outlineOffset: -2,
        }}
      >
        <OffthreadVideo
          src={staticFile(src)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z.toFixed(4)})` }}
        />
      </div>
    </AbsoluteFill>
  );
};
