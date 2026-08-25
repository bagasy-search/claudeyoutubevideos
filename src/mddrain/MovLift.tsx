// MovLift.tsx — MOVIMIENTO 7 del video `mddrain` (~28 s, 840 frames @30).
//
// Por qué el peróxido y no otra cosa: las burbujas nacen DEBAJO de la película y la levantan.
// Es lo único que un cepillo no puede hacer. Y al terminar, se vuelve agua y oxígeno.
//
// ── TABLA DE HANDOFF ────────────────────────────────────────────────────────────────────────
// acto 1  f0-180   LA LEJÍA        enterFrom: macro de la película, luz fría (viene del Mov Biofilm).
//                                  exitTo:   la capa DECOLORADA pero entera, andamio intacto.
//                                  materia:  la película.
// acto 2  f180-400 LA ENTRADA      enterFrom: misma capa; el líquido se mete por las grietas.
//                                  exitTo:   burbujas naciendo debajo.
//                                  materia:  el líquido, delgado como agua.
// acto 3  f400-620 EL LEVANTE      enterFrom: burbujas; la capa se despega por un borde.
//                                  exitTo:   la lámina entera flotando, la pared limpia debajo.
//                                  materia:  la capa se transforma en lámina suelta.
// acto 4  f620-840 AGUA Y OXÍGENO  enterFrom: lámina flotando fuera de cuadro.
//                                  exitTo:   la pared limpia y dos palabras (entrega al avatar).
//                                  materia:  las burbujas se vuelven las letras H₂O + O₂.
//
// COSTURAS: 1→2 WIPE POR MATERIA (el líquido barre) · 2→3 MATCH-MOVE (la burbuja empuja y la
// cámara sube con ella) · 3→4 OCLUSIÓN (la lámina cruza el cuadro y tapa).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { MD, rgba, clamp01, lerp, rnd, cam, Atmos, Occluder, Kicker, Title, Em, TextBed } from "../mdmold/Stage";
import { Foam, DR } from "./Pipe";

const A1 = 0, A2 = 180, A3 = 400, A4 = 620;

export const MovLift: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const D = durationInFrames;

  const c = cam(frame, { z0: 120, z1: 340, panY: -50, ry: 4, dur: D });

  // la lejía del acto 1: quita el COLOR, no la capa
  const bleach = interpolate(frame, [40, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // el peróxido entra por las grietas
  const wick = interpolate(frame, [A2 + 20, A2 + 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.3, 0.7, 0.2, 1) });
  const foamP = interpolate(frame, [A2 + 90, A3 + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // la capa se despega y se va
  const peel = interpolate(frame, [A3 + 20, A4 - 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.24, 0.6, 0.2, 1) });
  const words = interpolate(frame, [A4 + 40, A4 + 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const txt = (a: number, b: number) =>
    interpolate(frame, [a, a + 16, b - 16, b], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Atmos tint={MD.cold} keyFrom={interpolate(frame, [0, D], [0.3, 0.56])} intensity={0.82} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: c.transform, transformStyle: "preserve-3d" }}>
          <div
            style={{
              position: "relative",
              width: 1120,
              height: 560,
              borderRadius: 10,
              overflow: "hidden",
              boxShadow: "0 44px 120px rgba(0,0,0,0.82)",
            }}
          >
            {/* la pared limpia, debajo de todo */}
            <AbsoluteFill style={{ background: `linear-gradient(178deg, #E6E3DA 0%, ${DR.pvc} 46%, ${DR.pvcDark} 100%)` }} />

            {/* LA CAPA: se decolora, después se despega entera */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: "100%",
                transform: `translateY(${(-peel * 118).toFixed(1)}%) rotate(${(peel * -5).toFixed(2)}deg)`,
                transformOrigin: "left bottom",
                background: `linear-gradient(178deg, ${rgba(DR.filmWet, 1 - bleach * 0.5)} 0%, ${rgba(DR.film, 1 - bleach * 0.55)} 50%, ${rgba(DR.film, 0.9 - bleach * 0.5)} 100%)`,
                filter: `saturate(${(1 - bleach * 0.85).toFixed(2)}) brightness(${(1 + bleach * 0.55).toFixed(2)})`,
                boxShadow: peel > 0.05 ? "0 30px 70px rgba(0,0,0,0.6)" : undefined,
                borderRadius: peel > 0.05 ? 8 : 0,
              }}
            >
              {/* el andamio: la malla que la lejía NO toca */}
              {Array.from({ length: 40 }, (_, i) => {
                const s = rnd(i * 3.1);
                const s2 = rnd(i * 8.3);
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: `${s * 96}%`,
                      top: `${s2 * 92}%`,
                      width: 40 + s2 * 130,
                      height: 2,
                      background: rgba("#0E0F10", 0.34 + bleach * 0.4),
                      transform: `rotate(${(s * 180).toFixed(1)}deg)`,
                    }}
                  />
                );
              })}
              {/* las grietas por las que entra el líquido */}
              {wick > 0.02 &&
                Array.from({ length: 14 }, (_, i) => {
                  const s = rnd(i * 6.7);
                  return (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        left: `${4 + s * 90}%`,
                        top: 0,
                        width: 3,
                        height: `${wick * (40 + s * 55)}%`,
                        background: `linear-gradient(180deg, ${rgba(MD.white, 0.72)} 0%, ${rgba(MD.cold, 0.28)} 100%)`,
                        boxShadow: `0 0 10px ${rgba(MD.white, 0.5)}`,
                      }}
                    />
                  );
                })}
            </div>

            {/* las burbujas: NACEN debajo de la capa */}
            {foamP > 0.02 && <Foam p={foamP} count={64} x={50} spread={92} />}
          </div>
        </div>
      </AbsoluteFill>

      {/* acto 4: agua y oxígeno */}
      {words > 0.01 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", opacity: words }}>
            <div style={{ display: "flex", gap: 70, alignItems: "baseline", justifyContent: "center" }}>
              {["H₂O", "O₂"].map((w, i) => (
                <div
                  key={w}
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontWeight: 800,
                    fontSize: 150,
                    color: MD.white,
                    letterSpacing: -3,
                    textShadow: `0 10px 50px rgba(0,0,0,0.9), 0 0 70px ${rgba(MD.cold, 0.35)}`,
                    transform: `translateY(${interpolate(words, [0, 1], [30 + i * 12, 0]).toFixed(1)}px)`,
                  }}
                >
                  {w}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 18 }}>
              <Kicker color={rgba(MD.white, 0.7)}>That's all it leaves behind</Kicker>
            </div>
          </div>
        </AbsoluteFill>
      )}

      <div style={{ position: "absolute", left: 110, bottom: 130, maxWidth: 900 }}>
        {txt(50, A2) > 0.01 && (
          <div style={{ opacity: txt(50, A2) }}>
            <TextBed>
              <Kicker>Bleach takes the colour</Kicker>
              <div style={{ height: 12 }} />
              <Title size={66}>
                The scaffolding is <Em>still bolted on</Em>
              </Title>
            </TextBed>
          </div>
        )}
        {txt(A2 + 60, A3 + 40) > 0.01 && (
          <div style={{ opacity: txt(A2 + 60, A3 + 40), position: "absolute", bottom: 0, left: 0 }}>
            <TextBed>
              <Kicker>Thin as water, so it wicks in</Kicker>
              <div style={{ height: 12 }} />
              <Title size={66}>
                Then it foams <Em>underneath</Em>
              </Title>
            </TextBed>
          </div>
        )}
        {txt(A3 + 80, A4 + 30) > 0.01 && (
          <div style={{ opacity: txt(A3 + 80, A4 + 30), position: "absolute", bottom: 0, left: 0 }}>
            <TextBed>
              <Kicker>The one thing a brush can't do</Kicker>
              <div style={{ height: 12 }} />
              <Title size={66}>
                It lifts it <Em>off the wall</Em>
              </Title>
            </TextBed>
          </div>
        )}
      </div>

      {/* costura 3→4: la lámina cruza y tapa */}
      <Occluder at={A4 - 10} dur={15} color={DR.film} angle={-6} />
    </AbsoluteFill>
  );
};
