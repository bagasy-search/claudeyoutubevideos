// MovClose.tsx — MOVIMIENTO 6 del video `mddrain` (~26 s, 780 frames @30).
//
// El cierre: el trapo vuelve, la botella de un dólar se planta, la cocina se enciende y el
// código se arma solo. Cierra el círculo del embudo nombrando lo que el espectador YA vio.
//
// ── TABLA DE HANDOFF ────────────────────────────────────────────────────────────────────────
// acto 1  f0-190    EL TRAPO        enterFrom: negro con luz cálida baja (viene del Mov 5).
//                                   exitTo:   el trapo limpio en el centro, iluminado.
//                                   materia:  el papel (el mismo objeto del Mov 4, ahora LIMPIO).
// acto 2  f190-400  LA BOTELLA      enterFrom: el trapo se pliega y descubre la botella detrás.
//                                   exitTo:   la botella en hero, rim-light, sombra que aterriza.
//                                   materia:  el pliegue del papel = la etiqueta de la botella.
// acto 3  f400-600  LA COCINA       enterFrom: la luz sube de golpe (amanecer de cocina).
//                                   exitTo:   espacio abierto, la botella en la mesada.
//                                   materia:  la luz.
// acto 4  f600-780  EL CÓDIGO       enterFrom: cocina iluminada.
//                                   exitTo:   el código armado y QUIETO (una cámara tiene que leerlo).
//                                   materia:  los módulos del código nacen de las gotas de la botella.
//
// COSTURAS: 1→2 OCLUSIÓN (el papel se pliega y tapa) · 2→3 WIPE POR MATERIA (la luz barre) ·
// 3→4 MATCH-SHAPE (las gotas se ordenan en cuadrícula).
import React from "react";
import { AbsoluteFill, Img, staticFile, interpolate, useCurrentFrame, Easing } from "remotion";
import { MD, rgba, clamp01, lerp, rnd, Atmos, Occluder, Sheen, glassStyle, Kicker, Title, Em } from "../mdmold/Stage";

const A1 = 0, A2 = 190, A3 = 400, A4 = 600;

export const MovClose: React.FC<{
  durationInFrames: number;
  qr?: string;        // "img/mddrain_qrcard.png"
  kitchen?: string;   // "img/mddrain_h77_wipehands.png"
}> = ({ durationInFrames, qr, kitchen }) => {
  const frame = useCurrentFrame();
  const D = durationInFrames;

  const warm = interpolate(frame, [A1, A3, D], [0.2, 1, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0.3, 0, 0.24, 1) });
  const push = interpolate(frame, [0, D], [1.0, 1.1], { easing: Easing.bezier(0.3, 0, 0.22, 1) });

  const towelIn = interpolate(frame, [20, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 0.8, 0.2, 1) });
  const fold = interpolate(frame, [A2 - 30, A2 + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.3, 0, 0.2, 1) });

  const bottleIn = interpolate(frame, [A2 + 20, A2 + 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 0.8, 0.2, 1) });
  const bottleOut = interpolate(frame, [A4 - 60, A4], [1, 0.24], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const roomIn = interpolate(frame, [A3, A3 + 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const qrBuild = interpolate(frame, [A4, A4 + 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 0.8, 0.2, 1) });

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0 }}>
      <Atmos tint={MD.warm} keyFrom={interpolate(frame, [0, D], [0.32, 0.6])} intensity={0.5 + warm * 0.7} />

      {/* la cocina, que se enciende en el acto 3 */}
      {kitchen && roomIn > 0.01 && (
        <AbsoluteFill style={{ opacity: roomIn * 0.72, overflow: "hidden" }}>
          <Img
            src={staticFile(kitchen)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${push.toFixed(4)})`,
              filter: `blur(${(9 - roomIn * 5).toFixed(1)}px) brightness(${(0.4 + roomIn * 0.24).toFixed(2)}) saturate(0.72)`,
            }}
          />
          <AbsoluteFill style={{ background: "radial-gradient(76% 68% at 50% 46%, rgba(0,0,0,0) 32%, rgba(0,0,0,0.76) 100%)" }} />
        </AbsoluteFill>
      )}

      {/* acto 1: el trapo, ahora LIMPIO — el mismo objeto del movimiento de la historia */}
      {towelIn > 0.01 && fold < 0.98 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              width: 430,
              height: 560,
              opacity: towelIn * (1 - fold * 0.9),
              transform: `perspective(1300px) rotateY(${lerp(-8, -62, fold).toFixed(2)}deg) rotate(${lerp(4, -2, towelIn).toFixed(2)}deg) scale(${lerp(0.9, 1, towelIn).toFixed(3)})`,
              transformOrigin: "right center",
              background: "linear-gradient(158deg, #FAF8F3 0%, #E9E5DC 54%, #D2CEC4 100%)",
              borderRadius: 6,
              boxShadow: "0 46px 100px rgba(0,0,0,0.76)",
              overflow: "hidden",
            }}
          >
            <AbsoluteFill style={{ opacity: 0.13, mixBlendMode: "multiply" }}>
              <svg width="100%" height="100%">
                <filter id="closefib">
                  <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" seed={19} />
                </filter>
                <rect width="100%" height="100%" filter="url(#closefib)" />
              </svg>
            </AbsoluteFill>
            <Sheen at={70} dur={34} />
          </div>
        </AbsoluteFill>
      )}

      {/* acto 2: la botella marrón, en hero */}
      {bottleIn > 0.01 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              position: "relative",
              width: 210,
              height: 480,
              opacity: bottleIn * bottleOut,
              transform: `translateY(${interpolate(bottleIn, [0, 1], [50, 0]).toFixed(1)}px) scale(${lerp(0.86, 1, bottleIn).toFixed(3)})`,
            }}
          >
            {/* cuerpo de vidrio marrón */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 66,
                bottom: 0,
                borderRadius: "18px 18px 26px 26px",
                background: "linear-gradient(100deg, #3A2213 0%, #6B3E1E 26%, #8B5227 48%, #4E2C16 78%, #2E1A0E 100%)",
                boxShadow: `inset 12px 0 26px rgba(255,255,255,0.18), inset -14px 0 30px rgba(0,0,0,0.6), 0 40px 80px rgba(0,0,0,0.78), 0 0 60px ${rgba(MD.warm, 0.22 * warm)}`,
              }}
            />
            {/* etiqueta blanca */}
            <div
              style={{
                position: "absolute",
                left: 12,
                right: 12,
                top: 210,
                height: 190,
                borderRadius: 6,
                background: "linear-gradient(180deg, #FBFAF7 0%, #E6E3DB 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 6px 16px rgba(0,0,0,0.4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <div style={{ font: "800 44px/1 Inter, system-ui, sans-serif", color: "#1B1C1E", letterSpacing: -1 }}>3%</div>
              <div style={{ font: "700 15px/1 Inter, system-ui, sans-serif", letterSpacing: 2.4, color: MD.red, textTransform: "uppercase" }}>
                One dollar
              </div>
            </div>
            {/* cuello + tapa */}
            <div style={{ position: "absolute", left: 68, right: 68, top: 22, height: 56, background: "linear-gradient(100deg, #3A2213 0%, #7A4823 50%, #2E1A0E 100%)", borderRadius: 6 }} />
            <div style={{ position: "absolute", left: 56, right: 56, top: 0, height: 30, background: "linear-gradient(180deg, #2C4C63 0%, #162835 100%)", borderRadius: 5, boxShadow: "0 4px 12px rgba(0,0,0,0.6)" }} />
            {/* sombra de contacto que aterriza */}
            <div
              style={{
                position: "absolute",
                left: -50,
                right: -50,
                bottom: -26,
                height: 34,
                borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 72%)",
              }}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* acto 4: el código, armado desde las gotas */}
      {qr && qrBuild > 0.01 && (
        <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 80 }}>
          <div
            style={{
              padding: 20,
              background: "#FFFFFF",
              borderRadius: 12,
              boxShadow: `0 30px 70px rgba(0,0,0,0.6), 0 0 0 3px ${MD.red}`,
              opacity: qrBuild,
              transform: `scale(${lerp(0.84, 1, qrBuild).toFixed(3)})`,
            }}
          >
            <Img src={staticFile(qr)} style={{ width: 380, height: 380, display: "block" }} />
          </div>
          <div style={{ maxWidth: 640, opacity: interpolate(qrBuild, [0.3, 1], [0, 1], { extrapolateLeft: "clamp" }) }}>
            <Kicker>The rest of the pages</Kicker>
            <div style={{ height: 16 }} />
            <Title size={70}>
              Point your <Em>camera</Em> at it
            </Title>
            <div style={{ marginTop: 22, font: "500 29px/1.42 Inter, system-ui, sans-serif", color: "rgba(255,255,255,0.86)" }}>
              Every amount, and the chart of what never mixes.
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* las gotas que se ordenan en cuadrícula (costura 3→4) */}
      {frame > A3 + 40 && frame < A4 + 40 &&
        Array.from({ length: 26 }, (_, i) => {
          const s = rnd(i * 4.7);
          const s2 = rnd(i * 10.3);
          const p = clamp01((frame - (A3 + 40) - s * 40) / 120);
          const gx = 30 + (i % 6) * 6;
          const gy = 34 + Math.floor(i / 6) * 7;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${lerp(20 + s * 60, gx, p)}%`,
                top: `${lerp(96, gy, p)}%`,
                width: lerp(9, 16, p),
                height: lerp(9, 16, p),
                borderRadius: lerp(50, 2, p),
                background: rgba(MD.white, 0.5 + s2 * 0.35),
                opacity: (1 - clamp01((frame - A4) / 50)) * (0.3 + p * 0.6),
                boxShadow: `0 0 12px ${rgba(MD.warm, 0.4)}`,
              }}
            />
          );
        })}

      {/* costura 1→2: el papel se pliega y tapa */}
      <Occluder at={A2 - 4} dur={12} color="#E9E5DC" angle={5} />
    </AbsoluteFill>
  );
};
