// MovDryTrap.tsx — MOVIMIENTO 5 del video `mddrain` (~32 s, 960 frames @30).
//
// El caso del trapo limpio: no hay película, y sin embargo huele. Porque la única cosa que
// separa tu casa de la cloaca es una taza de agua, y esa taza se evapora.
//
// ── TABLA DE HANDOFF ────────────────────────────────────────────────────────────────────────
// acto 1  f0-210    EL SELLO        enterFrom: luz fría alta, el U-bend lleno (viene del Mov 4).
//                                   exitTo:   el sello brillando, el calendario arrancando.
//                                   materia:  el agua.
// acto 2  f210-470  LA EVAPORACIÓN  enterFrom: mismo encuadre, el calendario corre.
//                                   exitTo:   el sifón vacío, la puerta abierta.
//                                   materia:  el nivel del agua (baja, no salta).
// acto 3  f470-680  EL GAS          enterFrom: sifón vacío, la luz vira a roja.
//                                   exitTo:   el gas llenando el cuadro.
//                                   materia:  el hueco del sifón se vuelve la boca por donde sube.
// acto 4  f680-870  LA TAZA         enterFrom: gas en el aire; entra el agua por arriba.
//                                   exitTo:   sello repuesto, el gas se apaga, luz cálida.
//                                   materia:  el agua vuelve por la misma boca por la que subía el gas.
// acto 5  f870-960  EL ACEITE       enterFrom: sello lleno.
//                                   exitTo:   la película de aceite dorada arriba (entrega al avatar).
//
// COSTURAS: 1→2 MATCH-MOVE (el nivel baja sin corte) · 2→3 WIPE POR MATERIA (el rojo sube) ·
// 3→4 OCLUSIÓN (la columna de agua tapa) · 4→5 MATCH-SHAPE (la superficie del agua se vuelve el aceite).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { MD, rgba, clamp01, lerp, rnd, cam, Atmos, Occluder, Kicker, Title, Em, TextBed } from "../mdmold/Stage";
import { TrapSeal, DR } from "./Pipe";

const A1 = 0, A2 = 210, A3 = 470, A4 = 680, A5 = 870;

const WEEKS = ["WEEK 1", "WEEK 2", "WEEK 3", "WEEK 4"];

export const MovDryTrap: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const D = durationInFrames;

  const c = cam(frame, { z0: -60, z1: 190, panY: -30, ry: -6, dur: D });

  const heat = interpolate(frame, [A3, A3 + 120, A4 + 60, D], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const warm = interpolate(frame, [A4 + 40, A5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // el nivel: lleno → se evapora → vuelve con la taza
  const level =
    frame < A2
      ? 1
      : frame < A3
      ? interpolate(frame, [A2, A3 - 20], [1, 0], { extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.6, 1) })
      : frame < A4 + 60
      ? interpolate(frame, [A4 + 10, A4 + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 0.8, 0.2, 1) })
      : 1;

  const gas = interpolate(frame, [A3, A3 + 90, A4 + 20, A4 + 60], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // la columna de agua de la taza (costura 3→4)
  const pour = interpolate(frame, [A4, A4 + 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // la película de aceite del acto 5
  const oil = interpolate(frame, [A5, A5 + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const weekI = Math.min(3, Math.floor(interpolate(frame, [A2, A3 - 20], [0, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  const showWeeks = frame >= A2 && frame < A3 + 20;

  const txt = (a: number, b: number) =>
    interpolate(frame, [a, a + 16, b - 16, b], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Atmos tint={heat > 0.4 ? MD.red : warm > 0.4 ? MD.warm : MD.cold} keyFrom={interpolate(frame, [0, D], [0.3, 0.62])} intensity={0.9} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: c.transform, transformStyle: "preserve-3d", position: "relative" }}>
          <TrapSeal w={620} h={380} level={level} gas={gas} />

          {/* la columna de agua que cae desde la taza */}
          {pour > 0.01 && pour < 1 && (
            <div
              style={{
                position: "absolute",
                left: "18%",
                top: `${-70 + pour * 60}%`,
                width: 34,
                height: `${pour * 130}%`,
                borderRadius: 20,
                background: `linear-gradient(180deg, rgba(255,255,255,0.7) 0%, ${rgba(DR.waterLit, 0.85)} 40%, ${rgba(DR.water, 0.9)} 100%)`,
                boxShadow: `0 0 30px ${rgba(DR.waterLit, 0.5)}`,
              }}
            />
          )}

          {/* la película de aceite: dorada, encima del agua */}
          {oil > 0.01 && (
            <div
              style={{
                position: "absolute",
                left: "6%",
                right: "6%",
                bottom: "34%",
                height: 12,
                borderRadius: 6,
                background: `linear-gradient(90deg, ${rgba(MD.warm, 0.4)} 0%, #E8C27A ${(30 + Math.sin(frame / 40) * 12).toFixed(0)}%, ${rgba(MD.warm, 0.5)} 100%)`,
                boxShadow: `0 0 24px ${rgba("#E8C27A", 0.6)}`,
                opacity: oil,
              }}
            />
          )}
        </div>
      </AbsoluteFill>

      {/* el calendario que corre: 2 a 4 semanas */}
      {showWeeks && (
        <div style={{ position: "absolute", right: 140, top: "26%", textAlign: "right" }}>
          {WEEKS.map((w, i) => (
            <div
              key={w}
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontWeight: 800,
                fontSize: i === weekI ? 58 : 34,
                lineHeight: 1.3,
                letterSpacing: 2,
                color: i === weekI ? MD.white : rgba(MD.white, 0.22),
                textShadow: i === weekI ? "0 6px 26px rgba(0,0,0,0.9)" : undefined,
                transition: undefined,
              }}
            >
              {w}
            </div>
          ))}
          <div style={{ marginTop: 14 }}>
            <Kicker color={rgba(MD.white, 0.55)}>It just evaporates</Kicker>
          </div>
        </div>
      )}

      {/* una idea de texto por acto */}
      <div style={{ position: "absolute", left: 110, bottom: 130, maxWidth: 900 }}>
        {txt(40, A2) > 0.01 && (
          <div style={{ opacity: txt(40, A2) }}>
            <TextBed>
              <Kicker>Between your house and the sewer</Kicker>
              <div style={{ height: 12 }} />
              <Title size={66}>
                Two inches of <Em>water</Em>
              </Title>
            </TextBed>
          </div>
        )}
        {txt(A3 + 30, A4) > 0.01 && (
          <div style={{ opacity: txt(A3 + 30, A4), position: "absolute", bottom: 0, left: 0 }}>
            <TextBed>
              <Kicker>Guest bath. Floor drain. Standpipe.</Kicker>
              <div style={{ height: 12 }} />
              <Title size={66}>
                Now it's <Em>an open door</Em>
              </Title>
            </TextBed>
          </div>
        )}
        {txt(A5 - 40, A5 + 80) > 0.01 && (
          <div style={{ opacity: txt(A5 - 40, A5 + 80), position: "absolute", bottom: 0, left: 0 }}>
            <TextBed>
              <Kicker>One cup of water. One spoon of oil.</Kicker>
              <div style={{ height: 12 }} />
              <Title size={66}>
                The oil floats and <Em>it stops evaporating</Em>
              </Title>
            </TextBed>
          </div>
        )}
      </div>

      {/* costura 3→4: la columna de agua tapa el cambio */}
      <Occluder at={A4 - 6} dur={13} color={DR.water} angle={-3} />

      <AbsoluteFill
        style={{
          background: `radial-gradient(68% 58% at 50% 46%, ${rgba(MD.red, 0.13 * heat)} 0%, rgba(0,0,0,0) 72%)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
