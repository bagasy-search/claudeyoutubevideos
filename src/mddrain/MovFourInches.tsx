// MovFourInches.tsx — MOVIMIENTO 1 del video `mddrain` (~38 s, 1140 frames @30).
//
// La tesis del video, en una sola escena continua: el olor vive en cuatro pulgadas de pared, y
// la máquina del plomero pasa por el centro sin tocarlas.
//
// ── TABLA DE HANDOFF ────────────────────────────────────────────────────────────────────────
// acto 1  f0-260    LA BAJADA        enterFrom: negro con el óvalo de luz del colador arriba.
//                                    exitTo:   cámara ya dentro del caño, luz fría cenital.
//                                    materia:  el óvalo del colador se convierte en la boca del caño.
// acto 2  f260-520  LA PARED         enterFrom: hereda z y luz del acto 1 (sin reset).
//                                    exitTo:   la pared ocupa el cuadro, la película visible.
//                                    materia:  la película que se ve de lejos pasa a ser textura.
// acto 3  f520-800  LA FRANJA ROJA   enterFrom: mismo encuadre, la luz vira de fría a roja.
//                                    exitTo:   la franja encendida, cámara retrocediendo.
//                                    materia:  la propia pared se enciende (nada nuevo entra).
// acto 4  f800-1010 EL CABLE         enterFrom: encuadre abierto, franja encendida.
//                                    exitTo:   el cable sale por abajo, la franja SIGUE encendida.
//                                    materia:  el cable entra por la boca del acto 1.
// acto 5  f1010-1140 EL REMATE       enterFrom: cable fuera, luz roja baja.
//                                    exitTo:   negro con la franja como única luz (entrega al avatar).
//
// COSTURAS: 1→2 ZOOM-THROUGH (la cámara atraviesa la boca) · 2→3 WIPE POR MATERIA (la luz roja
// barre la pared) · 3→4 OCLUSIÓN (el cable cruza y tapa) · 4→5 MATCH-MOVE (la cámara sigue
// retrocediendo, el cable ya no está). Ninguna repetida, ningún fade.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { MD, rgba, clamp01, lerp, cam, Atmos, Occluder, Kicker, Title, Em, TextBed } from "../mdmold/Stage";
import { PipeWall, Cable, DR } from "./Pipe";

const A1 = 0, A2 = 260, A3 = 520, A4 = 800, A5 = 1010;

export const MovFourInches: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const D = durationInFrames;

  // UNA cámara para todo el movimiento: nunca vuelve a cero entre actos.
  const c = cam(frame, { z0: -160, z1: 300, panY: -40, rx: 3, dur: D });

  // la luz VIAJA: fría (la ventanita del baño) → roja (la alerta) → roja baja
  const heat = interpolate(frame, [A3, A3 + 160, A5, D], [0, 1, 1, 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tint = heat < 0.5 ? MD.cold : MD.red;

  // la boca del caño: el óvalo del colador, que se abre y nos deja pasar
  const mouth = interpolate(frame, [A1, A2], [1, 0], { extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.2, 1) });
  const wallScale = interpolate(frame, [A1, A2, A3, D], [0.42, 1, 1.12, 0.94], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0, 0.24, 1),
  });

  const redZone = interpolate(frame, [A3, A3 + 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cableP = interpolate(frame, [A4 + 30, A5 - 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const txt = (a: number, b: number) =>
    interpolate(frame, [a, a + 16, b - 16, b], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* atmósfera montada UNA vez — nunca se remonta */}
      <Atmos tint={tint} keyFrom={interpolate(frame, [0, D], [0.2, 0.6])} intensity={1 - heat * 0.24} />

      {/* la escena, en una sola cámara */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: c.transform, transformStyle: "preserve-3d" }}>
          <div style={{ transform: `scale(${wallScale.toFixed(4)})`, transformStyle: "preserve-3d", position: "relative" }}>
            <PipeWall
              w={380}
              h={880}
              filmT={interpolate(frame, [A2, A2 + 140], [0.25, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
              lit={1 - heat * 0.4}
              redZone={redZone}
              zoneTop={5}
              zoneH={42}
            />
            {/* el cable de la máquina: baja por el CENTRO, no toca nada */}
            {cableP > 0 && <Cable p={cableP} w={30} />}
          </div>
        </div>
      </AbsoluteFill>

      {/* la boca del colador: el óvalo por el que entramos (acto 1 → 2, ZOOM-THROUGH) */}
      {mouth > 0.01 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div
            style={{
              width: lerp(360, 2200, 1 - mouth),
              height: lerp(360, 2200, 1 - mouth) * 0.42,
              borderRadius: "50%",
              border: `${lerp(10, 60, 1 - mouth)}px solid ${rgba(DR.pvc, 0.9 * mouth)}`,
              boxShadow: `0 0 90px ${rgba(MD.cold, 0.36 * mouth)}, inset 0 0 120px rgba(0,0,0,0.9)`,
              opacity: mouth,
            }}
          />
        </AbsoluteFill>
      )}

      {/* la marca de las cuatro pulgadas: bracket + medida, aterrizada sobre la franja */}
      {redZone > 0.2 && (
        <div
          style={{
            position: "absolute",
            right: 150,
            top: "20%",
            opacity: interpolate(redZone, [0.2, 0.7], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateX(${interpolate(redZone, [0.2, 1], [40, 0]).toFixed(1)}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 4,
                height: 260,
                background: `linear-gradient(180deg, ${MD.redHot} 0%, ${rgba(MD.redHot, 0.4)} 100%)`,
                boxShadow: `0 0 22px ${rgba(MD.redHot, 0.7)}`,
              }}
            />
            <div>
              <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 108, lineHeight: 1, color: MD.white, textShadow: "0 6px 30px rgba(0,0,0,0.9)" }}>
                4"
              </div>
              <div style={{ marginTop: 8, fontFamily: "Inter, system-ui, sans-serif", fontWeight: 700, fontSize: 24, letterSpacing: 3, textTransform: "uppercase", color: MD.redHot }}>
                Always wet
              </div>
              <div style={{ marginTop: 4, fontFamily: "Inter, system-ui, sans-serif", fontWeight: 700, fontSize: 24, letterSpacing: 3, textTransform: "uppercase", color: rgba(MD.white, 0.6) }}>
                Never scrubbed
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UNA idea de texto por acto */}
      <div style={{ position: "absolute", left: 110, bottom: 130, maxWidth: 900 }}>
        {txt(A1 + 40, A2) > 0.01 && (
          <div style={{ opacity: txt(A1 + 40, A2) }}>
            <TextBed>
              <Kicker>It is not the sewer</Kicker>
              <div style={{ height: 14 }} />
              <Title size={72}>
                It's <Em>four inches</Em> down
              </Title>
            </TextBed>
          </div>
        )}
        {txt(A2 + 60, A3) > 0.01 && (
          <div style={{ opacity: txt(A2 + 60, A3), position: "absolute", bottom: 0, left: 0 }}>
            <TextBed>
              <Kicker>The wall of the pipe</Kicker>
              <div style={{ height: 14 }} />
              <Title size={72}>
                Everything you pour <Em>falls past it</Em>
              </Title>
            </TextBed>
          </div>
        )}
        {txt(A4 + 60, A5 + 60) > 0.01 && (
          <div style={{ opacity: txt(A4 + 60, A5 + 60), position: "absolute", bottom: 0, left: 0 }}>
            <TextBed>
              <Kicker>The machine</Kicker>
              <div style={{ height: 14 }} />
              <Title size={72}>
                It bores a hole. It <Em>never touches the wall</Em>
              </Title>
            </TextBed>
          </div>
        )}
      </div>

      {/* costura 3→4: el cable cruza y tapa el cambio de encuadre */}
      <Occluder at={A4 - 8} dur={16} color={DR.steel} angle={4} />

      {/* velo rojo de la alerta, montado sobre la misma atmósfera (no es un fondo nuevo) */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(70% 60% at 50% 40%, ${rgba(MD.red, 0.14 * heat)} 0%, rgba(0,0,0,0) 70%)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
