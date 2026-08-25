// MovGravity.tsx — MOVIMIENTO 2 del video `mddrain` (~34 s, 1020 frames @30).
//
// El argumento central: no es la química, es el RELOJ. La misma gota, dos destinos.
//
// ── TABLA DE HANDOFF ────────────────────────────────────────────────────────────────────────
// acto 1  f0-230    LA CAÍDA        enterFrom: el caño abierto, luz fría alta (viene del Mov 1).
//                                   exitTo:   la gota ya pasó, el reloj marca 0.5s y se apaga.
//                                   materia:  la gota.
// acto 2  f230-470  EL ANUNCIO      enterFrom: mismo caño, la cámara gira 8° a la derecha.
//                                   exitTo:   la promesa del gel se despega de la pared y cae.
//                                   materia:  la capa azul del gel de publicidad = la gota anterior.
// acto 3  f470-720  EL TAPÓN        enterFrom: cámara sigue girando, luz vira a cálida.
//                                   exitTo:   el papel empapado sellando la boca, reloj corriendo.
//                                   materia:  el mismo líquido, ahora RETENIDO.
// acto 4  f720-940  LAS BARRAS      enterFrom: el reloj se transforma en la primera barra.
//                                   exitTo:   las tres barras completas, la roja llena el cuadro.
//                                   materia:  el número del reloj se vuelve el valor de la barra.
// acto 5  f940-1020 EL REMATE       enterFrom: barras, luz cálida.
//                                   exitTo:   negro con la frase (entrega al avatar).
//
// COSTURAS: 1→2 MATCH-MOVE (la gota y el gel caen con la misma curva) · 2→3 WIPE POR MATERIA
// (el papel empapado barre de izquierda) · 3→4 MATCH-SHAPE (el reloj ES la barra) ·
// 4→5 CORTE EN EL BEAT.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { MD, rgba, clamp01, cam, Atmos, Sheen, Kicker, Title, Em, TextBed } from "../mdmold/Stage";
import { PipeWall, ContactClock, CompareBar, DR } from "./Pipe";

const A1 = 0, A2 = 230, A3 = 470, A4 = 720, A5 = 940;

export const MovGravity: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const D = durationInFrames;

  const c = cam(frame, { z0: 40, z1: 210, panX: -120, ry: 8, dur: D });

  // la luz viaja: fría → cálida (de "esto falla" a "esto funciona")
  const warmth = interpolate(frame, [A3, A4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // la gota del acto 1: cae con aceleración real
  const dropT = clamp01((frame - 40) / 120);
  const dropY = dropT * dropT; // gravedad
  const clockA = interpolate(frame, [70, 160, 210, 230], [0, 0.5, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // la capa del anuncio (acto 2): se pinta y se despega
  const gelPaint = interpolate(frame, [A2 + 20, A2 + 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gelFall = interpolate(frame, [A2 + 130, A3 - 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.5, 0, 0.9, 0.6) });

  // el tapón de papel (acto 3): barre desde la izquierda y sella
  const plug = interpolate(frame, [A3, A3 + 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 0.7, 0.2, 1) });
  const heldSec = interpolate(frame, [A3 + 70, A4], [0, 1200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const barP = (i: number) => interpolate(frame, [A4 + i * 45, A4 + i * 45 + 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const txt = (a: number, b: number) =>
    interpolate(frame, [a, a + 16, b - 16, b], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const showPipe = frame < A4 - 10;

  return (
    <AbsoluteFill>
      <Atmos tint={warmth > 0.5 ? MD.warm : MD.cold} keyFrom={interpolate(frame, [0, D], [0.3, 0.7])} intensity={0.9} />

      {showPipe && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ transform: c.transform, transformStyle: "preserve-3d" }}>
            <div style={{ position: "relative" }}>
              <PipeWall w={360} h={840} filmT={0.9} lit={1 - warmth * 0.3} />

              {/* la gota */}
              {dropT > 0 && dropT < 1 && (
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: `${dropY * 96}%`,
                    transform: "translateX(-50%)",
                    width: 22,
                    height: 30 + dropY * 26,
                    borderRadius: "50% 50% 46% 46%",
                    background: `linear-gradient(180deg, rgba(255,255,255,0.9) 0%, ${rgba(MD.cold, 0.7)} 60%, rgba(255,255,255,0.5) 100%)`,
                    boxShadow: `0 0 18px ${rgba(MD.white, 0.5)}`,
                  }}
                />
              )}

              {/* la capa del anuncio: el azul que "abraza" la pared, y después se cae */}
              {gelPaint > 0.01 && (
                <>
                  {(["l", "r"] as const).map((side) => (
                    <div
                      key={side}
                      style={{
                        position: "absolute",
                        top: `${gelFall * 100}%`,
                        [side === "l" ? "left" : "right"]: 92,
                        width: 20,
                        height: `${88 * gelPaint * (1 - gelFall * 0.7)}%`,
                        background: `linear-gradient(180deg, rgba(86,166,214,0.85) 0%, rgba(46,110,158,0.7) 100%)`,
                        boxShadow: "0 0 22px rgba(86,166,214,0.5)",
                        borderRadius: 6,
                        opacity: 1 - gelFall * 0.85,
                      }}
                    />
                  ))}
                </>
              )}

              {/* el tapón de papel: entra por izquierda y sella la boca */}
              {plug > 0.01 && (
                <div
                  style={{
                    position: "absolute",
                    left: `${interpolate(plug, [0, 1], [-140, 0])}%`,
                    top: "2%",
                    width: "100%",
                    height: "22%",
                    background: `linear-gradient(180deg, #E8E4DA 0%, #C6C1B4 60%, #A8A296 100%)`,
                    boxShadow: "inset 0 -10px 26px rgba(0,0,0,0.45), 0 14px 34px rgba(0,0,0,0.6)",
                    borderRadius: 8,
                    filter: `saturate(${0.6 + plug * 0.4})`,
                  }}
                >
                  <Sheen at={A3 + 60} dur={30} />
                </div>
              )}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* el reloj: en el acto 1 marca medio segundo; en el 3 corre hasta 20 minutos */}
      {clockA > 0.01 && (
        <div style={{ opacity: clockA * 2 }}>
          <ContactClock seconds={0.5} label="Contact time" color={MD.redHot} x="50%" y="78%" size={120} />
        </div>
      )}
      {plug > 0.4 && frame < A4 && (
        <ContactClock seconds={heldSec} label="Contact time" color={MD.white} x="50%" y="80%" size={120} />
      )}

      {/* acto 4: las barras. El reloj se convirtió en la primera. */}
      {frame >= A4 - 10 && (
        <AbsoluteFill>
          <div style={{ position: "absolute", left: 120, top: 190 }}>
            <Kicker>Contact time on the pipe wall</Kicker>
            <div style={{ height: 16 }} />
            <Title size={64}>
              It was never <Em>the chemistry</Em>
            </Title>
          </div>
          <CompareBar p={barP(0)} w={30} color={rgba(MD.white, 0.55)} label="Poured straight down" value="0.5 s" y={430} />
          <CompareBar p={barP(1)} w={110} color="#56A6D6" label="Thick gel cleaner" value="3 s" y={530} />
          <CompareBar p={barP(2)} w={1180} color={MD.red} label="Peroxide poultice" value="20 min" y={630} />
        </AbsoluteFill>
      )}

      {/* una idea de texto por acto */}
      <div style={{ position: "absolute", left: 110, bottom: 140, maxWidth: 880 }}>
        {txt(50, A2) > 0.01 && (
          <div style={{ opacity: txt(50, A2) }}>
            <TextBed>
              <Kicker>Gravity is not optional</Kicker>
              <div style={{ height: 12 }} />
              <Title size={68}>
                Half a second, and it's <Em>gone</Em>
              </Title>
            </TextBed>
          </div>
        )}
        {txt(A2 + 40, A3) > 0.01 && (
          <div style={{ opacity: txt(A2 + 40, A3), position: "absolute", bottom: 0, left: 0 }}>
            <TextBed>
              <Kicker>Every ad you've seen</Kicker>
              <div style={{ height: 12 }} />
              <Title size={68}>
                Gel doesn't hug a pipe. It <Em>falls</Em>
              </Title>
            </TextBed>
          </div>
        )}
        {txt(A3 + 60, A4 - 20) > 0.01 && (
          <div style={{ opacity: txt(A3 + 60, A4 - 20), position: "absolute", bottom: 0, left: 0 }}>
            <TextBed>
              <Kicker>A dollar of peroxide that stays</Kicker>
              <div style={{ height: 12 }} />
              <Title size={68}>
                Make it <Em>stop falling</Em>
              </Title>
            </TextBed>
          </div>
        )}
      </div>

      <AbsoluteFill
        style={{
          background: `radial-gradient(66% 56% at 50% 46%, ${rgba(MD.warm, 0.10 * warmth)} 0%, rgba(0,0,0,0) 72%)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
