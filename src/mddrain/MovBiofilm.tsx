// MovBiofilm.tsx — MOVIMIENTO 3 del video `mddrain` (~44 s, 1320 frames @30).
//
// Qué es realmente el olor: no es mugre, es una colonia. Y el número que lo explica todo — tu
// nariz detecta sulfuro de hidrógeno en partes por MIL MILLONES.
//
// ── TABLA DE HANDOFF ────────────────────────────────────────────────────────────────────────
// acto 1  f0-280     LA SUPERFICIE   enterFrom: pared del caño de lejos, luz fría (viene del Mov 2).
//                                    exitTo:   macro extremo, la baba llena el cuadro.
//                                    materia:  la película.
// acto 2  f280-600   LAS CAPAS       enterFrom: macro; la cámara sigue entrando sin reset.
//                                    exitTo:   corte estratigráfico: comida, slime, colonia, sin oxígeno.
//                                    materia:  la misma capa, ahora abierta en secciones.
// acto 3  f600-880   EL SULFURO      enterFrom: la sección de abajo se ilumina en rojo.
//                                    exitTo:   moléculas subiendo, cámara retrocediendo rápido.
//                                    materia:  las burbujas del fondo se vuelven las moléculas.
// acto 4  f880-1150  LA COCINA       enterFrom: retroceso; el macro se revela como el caño de una cocina.
//                                    exitTo:   la habitación entera teñida, el número apareciendo.
//                                    materia:  las moléculas siguen subiendo, ahora en la habitación.
// acto 5  f1150-1320 EL NÚMERO       enterFrom: habitación teñida.
//                                    exitTo:   negro con el número (entrega al avatar).
//
// COSTURAS: 1→2 ZOOM-THROUGH · 2→3 WIPE POR MATERIA (el rojo sube por la estratigrafía) ·
// 3→4 MATCH-MOVE (dolly-out continuo) · 4→5 MATCH-SHAPE (una molécula se vuelve el punto decimal).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { MD, rgba, clamp01, lerp, rnd, cam, Atmos, Kicker, Title, Em, TextBed } from "../mdmold/Stage";
import { DR } from "./Pipe";

const A1 = 0, A2 = 280, A3 = 600, A4 = 880, A5 = 1150;

const LAYERS = [
  { label: "What you rinse off plates", color: "#6B6250", h: 0.16 },
  { label: "Their own slime", color: "#4F5A48", h: 0.22 },
  { label: "The colony", color: "#39422F", h: 0.28 },
  { label: "No oxygen down here", color: "#1E2119", h: 0.34 },
];

export const MovBiofilm: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const D = durationInFrames;

  // una sola cámara: entra hasta el macro y después sale a la habitación
  const zIn = interpolate(frame, [A1, A2, A3, A4, D], [0, 420, 520, 60, -220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.32, 0, 0.22, 1),
  });
  const drift = Math.sin(frame / 53) * 3 + Math.cos(frame / 97) * 2;

  const heat = interpolate(frame, [A3, A3 + 140, D], [0, 1, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // el corte estratigráfico se abre
  const split = interpolate(frame, [A2 + 40, A2 + 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.24, 0.7, 0.2, 1) });
  const roomOut = interpolate(frame, [A4, A4 + 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const num = interpolate(frame, [A5, A5 + 70], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 0.8, 0.2, 1) });

  const txt = (a: number, b: number) =>
    interpolate(frame, [a, a + 16, b - 16, b], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Atmos tint={heat > 0.4 ? MD.red : MD.cold} keyFrom={interpolate(frame, [0, D], [0.26, 0.64])} intensity={0.86} />

      {/* LA MATERIA: una sola pieza de película que atraviesa todo el movimiento */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            transform: `perspective(1500px) translateZ(${zIn.toFixed(1)}px) translate3d(${drift.toFixed(2)}px, ${(-drift * 0.6).toFixed(2)}px, 0) scale(${(1 - roomOut * 0.42).toFixed(4)})`,
            transformStyle: "preserve-3d",
            position: "relative",
            width: 1180,
            height: 620,
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: "0 40px 120px rgba(0,0,0,0.8)",
          }}
        >
          {/* el PVC de fondo */}
          <AbsoluteFill style={{ background: `linear-gradient(180deg, #D6D3CA 0%, ${DR.pvc} 40%, ${DR.pvcDark} 100%)` }} />

          {/* las capas: cerradas al principio, abiertas en el acto 2 */}
          {LAYERS.map((L, i) => {
            const base = LAYERS.slice(0, i).reduce((a, b) => a + b.h, 0);
            const gap = split * 26 * i;
            const lit = i === 3 ? heat : 0;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: `${base * 100}%`,
                  height: `${L.h * 100}%`,
                  transform: `translateY(${gap.toFixed(1)}px)`,
                  background: `linear-gradient(180deg, ${L.color} 0%, ${rgba(L.color, 0.86)} 100%)`,
                  boxShadow: `inset 0 2px 0 ${rgba(MD.white, 0.1)}, 0 6px 22px rgba(0,0,0,0.55)`,
                  filter: lit > 0 ? `saturate(${1 + lit}) brightness(${1 + lit * 0.3})` : undefined,
                }}
              >
                {/* grumos vivos dentro de cada capa */}
                {Array.from({ length: 14 }, (_, k) => {
                  const s = rnd(i * 31 + k * 5.3);
                  const s2 = rnd(i * 17 + k * 11.9);
                  return (
                    <div
                      key={k}
                      style={{
                        position: "absolute",
                        left: `${s * 96}%`,
                        top: `${s2 * 70}%`,
                        width: 8 + s2 * 30,
                        height: 8 + s * 20,
                        borderRadius: "46%",
                        background: rgba(MD.white, 0.05 + s * 0.06),
                        transform: `translateY(${(Math.sin(frame / (40 + s * 30) + k) * 2).toFixed(2)}px)`,
                      }}
                    />
                  );
                })}
                {/* la etiqueta de la capa, sólo cuando está abierta */}
                {split > 0.5 && (
                  <div
                    style={{
                      position: "absolute",
                      right: 22,
                      top: "50%",
                      transform: "translateY(-50%)",
                      opacity: interpolate(split, [0.5, 1], [0, 1], { extrapolateRight: "clamp" }),
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontWeight: 700,
                      fontSize: 26,
                      letterSpacing: 1.6,
                      textTransform: "uppercase",
                      color: i === 3 ? MD.redHot : rgba(MD.white, 0.8),
                      textShadow: "0 2px 12px rgba(0,0,0,0.9)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {L.label}
                  </div>
                )}
              </div>
            );
          })}

          {/* el rojo que sube por la estratigrafía (costura 2→3) */}
          {heat > 0.01 && (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: `${heat * 62}%`,
                background: `linear-gradient(0deg, ${rgba(MD.red, 0.42)} 0%, rgba(0,0,0,0) 100%)`,
                mixBlendMode: "screen",
              }}
            />
          )}
        </div>
      </AbsoluteFill>

      {/* las moléculas de sulfuro: nacen abajo y siguen subiendo hasta el acto 5 */}
      {frame > A3 &&
        Array.from({ length: 34 }, (_, i) => {
          const s = rnd(i * 3.3);
          const s2 = rnd(i * 8.9);
          const speed = 150 + s * 180;
          const p = (((frame - A3) / speed + s2) % 1);
          const size = lerp(5, 13, s) * (1 + roomOut * 0.6);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${6 + s2 * 88}%`,
                top: `${96 - p * 104}%`,
                width: size,
                height: size,
                borderRadius: "50%",
                background: `radial-gradient(circle at 34% 30%, ${MD.redHot} 0%, ${rgba(MD.red, 0.5)} 60%, rgba(0,0,0,0) 100%)`,
                opacity: (1 - Math.abs(p - 0.5) * 1.4) * (0.5 + heat * 0.5),
                filter: "blur(0.6px)",
                transform: `translateX(${(Math.sin(frame / 34 + i) * 8).toFixed(2)}px)`,
              }}
            />
          );
        })}

      {/* acto 5: el número */}
      {frame >= A5 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontWeight: 800,
                fontSize: 210,
                lineHeight: 1,
                letterSpacing: -6,
                color: MD.white,
                textShadow: `0 10px 60px rgba(0,0,0,0.95), 0 0 90px ${rgba(MD.red, 0.4)}`,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {num.toFixed(1)}
            </div>
            <div style={{ marginTop: 6 }}>
              <Kicker>Parts per billion</Kicker>
            </div>
            <div style={{ marginTop: 22, maxWidth: 900 }}>
              <Title size={54}>
                Your nose beats <Em>most lab equipment</Em>
              </Title>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* una idea de texto por acto */}
      <div style={{ position: "absolute", left: 110, bottom: 130, maxWidth: 880 }}>
        {txt(60, A2) > 0.01 && (
          <div style={{ opacity: txt(60, A2) }}>
            <TextBed>
              <Kicker>It isn't dirt</Kicker>
              <div style={{ height: 12 }} />
              <Title size={68}>
                Dirt doesn't smell. This is <Em>a colony</Em>
              </Title>
            </TextBed>
          </div>
        )}
        {txt(A3 + 40, A4) > 0.01 && (
          <div style={{ opacity: txt(A3 + 40, A4), position: "absolute", bottom: 0, left: 0 }}>
            <TextBed>
              <Kicker>Down there, no oxygen</Kicker>
              <div style={{ height: 12 }} />
              <Title size={68}>
                So they breathe <Em>sulfur</Em>
              </Title>
            </TextBed>
          </div>
        )}
        {txt(A4 + 60, A5) > 0.01 && (
          <div style={{ opacity: txt(A4 + 60, A5), position: "absolute", bottom: 0, left: 0 }}>
            <TextBed>
              <Kicker>A patch the size of a quarter</Kicker>
              <div style={{ height: 12 }} />
              <Title size={68}>
                Fills <Em>a whole kitchen</Em>
              </Title>
            </TextBed>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
