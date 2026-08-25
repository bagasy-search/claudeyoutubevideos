// MovShoreline.tsx — MOVIMIENTO 4 · "TU ARO ES UNA ORILLA" · 900 frames @30fps (30 s)
// Canal Mike Dalton (EN) · video `mdring`.
//
// UN SOLO PLANO SECUENCIA. La MATERIA que cruza las cuatro fronteras es LA LÍNEA DE AGUA: la misma
// horizontal que en el acto 1 corta el piloto del muelle es la que en el acto 2 se queda quieta
// mientras el mundo alrededor MORPHEA de madera a porcelana, la que en el acto 3 se ilumina como
// la única franja viva, y la que en el acto 4 se cierra en un aro visto en perspectiva.
//
// El truco del movimiento: la línea NUNCA se mueve de su altura en pantalla. Todo lo demás cambia
// alrededor de ella. Por eso el morph muelle→inodoro no se lee como un corte sino como un
// descubrimiento.
//
// ACTO 1 · f0–230 · "EL PILOTE"      luz {FRÍO exterior, key alta}  cam {z −200, rx +4}
//   ── FRONTERA A @214 · el reflejo del agua barre el cuadro ──
// ACTO 2 · f230–500 · "EL MORPH"     la madera se vuelve porcelana; la línea no se mueve
//   ── FRONTERA B @484 · OCLUSIÓN por la propia curva de la taza ──
// ACTO 3 · f500–720 · "ARRIBA SE SECA, ABAJO FALTA AIRE"  las tres franjas se etiquetan solas
//   ── FRONTERA C @704 · la cámara ROTA y la línea se convierte en elipse ──
// ACTO 4 · f720–900 · "POR ESO ES UN ARO"  hold + salida por blur
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  MD, rgba, clamp01, lerp, eio, rnd, cam, light, Atmos, Occluder, Sheen, TextBed, Kicker, Title, Em, F_SANS,
} from "../mdmold/Stage";

const A1 = 0, A2 = 230, A3 = 500, A4 = 720, END = 900;
const LINE_Y = 52; // la horizontal sagrada: no se mueve nunca

export const MovShoreline: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const f = Math.min(frame, END);

  const C = cam(f, { z0: -200, z1: 420, panY: -20, ry: -8, dur: A4 });

  const tint = light(clamp01((f - A3) / 200), "cold", "warm");
  const keyPos = interpolate(f, [A1, A2, A4, END], [0.7, 0.5, 0.34, 0.3], { extrapolateRight: "clamp" });

  const morph = clamp01((f - A2 - 20) / 190);   // 0 = madera · 1 = porcelana
  const bandLit = clamp01((f - A3 - 20) / 90);  // la franja viva se enciende
  const ring = clamp01((f - A4 - 10) / 120);    // la línea se vuelve elipse

  // olas: la razón física de que esa franja reciba agua Y aire todo el día
  const wave = Math.sin(f / 13) * 1.1 + Math.sin(f / 29) * 0.6;

  const focusOut = clamp01((f - (END - 40)) / 40);

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      <Atmos tint={tint} keyFrom={keyPos} intensity={interpolate(f, [A1, A3, END], [1.15, 0.95, 1.05], { extrapolateRight: "clamp" })} />

      <AbsoluteFill style={{ transform: C.transform, transformOrigin: "50% 52%" }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="woodPorc" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={`rgb(${Math.round(lerp(94, 244, morph))},${Math.round(lerp(72, 242, morph))},${Math.round(lerp(52, 238, morph))})`} />
              <stop offset="100%" stopColor={`rgb(${Math.round(lerp(58, 186, morph))},${Math.round(lerp(44, 190, morph))},${Math.round(lerp(32, 196, morph))})`} />
            </linearGradient>
          </defs>

          {/* el agua: abajo de la línea, siempre */}
          <rect x="0" y={LINE_Y} width="100" height={100 - LINE_Y} fill={rgba(MD.cold, lerp(0.30, 0.16, morph))} />

          {/* el cuerpo: pilote recto → pared de taza curva. La misma silueta, interpolada. */}
          <path
            d={
              `M ${lerp(40, 22, morph)},8 ` +
              `C ${lerp(40, 24, morph)},${lerp(40, 42, morph)} ${lerp(40, 34, morph)},${lerp(70, 80, morph)} ${lerp(40, 50, morph)},${lerp(92, 88, morph)} ` +
              `L ${lerp(60, 50, morph)},${lerp(92, 88, morph)} ` +
              `C ${lerp(60, 66, morph)},${lerp(70, 80, morph)} ${lerp(60, 76, morph)},${lerp(40, 42, morph)} ${lerp(60, 78, morph)},8 Z`
            }
            fill="url(#woodPorc)"
          />

          {/* vetas de la madera, que se desvanecen con el morph */}
          {morph < 0.98 &&
            Array.from({ length: 7 }, (_, i) => (
              <line
                key={i}
                x1={42 + i * 2.5} y1="9" x2={42 + i * 2.5 + rnd(i) * 2} y2="90"
                stroke={rgba("#2A1E14", 0.3 * (1 - morph))} strokeWidth="0.3"
              />
            ))}

          {/* LA FRANJA — la orilla. Está en los cuatro actos, en la misma altura. */}
          {ring < 0.02 ? (
            <rect
              x={lerp(38, 20, morph)} y={LINE_Y - 3 + wave * 0.3}
              width={lerp(24, 60, morph)} height={6}
              fill={rgba(MD.red, 0.34 + 0.5 * bandLit)}
              style={{ filter: `drop-shadow(0 0 ${(2 + bandLit * 6).toFixed(1)}px ${rgba(MD.red, 0.8)})` }}
            />
          ) : (
            <ellipse
              cx="50" cy={LINE_Y}
              rx={lerp(30, 30, 1)} ry={lerp(0.6, 8, ring)}
              fill="none" stroke={MD.red} strokeWidth={lerp(5, 3.2, ring)}
              style={{ filter: `drop-shadow(0 0 7px ${rgba(MD.red, 0.85)})` }}
            />
          )}

          {/* la superficie del agua, con ola viva */}
          <path
            d={`M 0,${LINE_Y + wave * 0.5} C 25,${LINE_Y - 1 + wave} 75,${LINE_Y + 1 - wave} 100,${LINE_Y + wave * 0.5}`}
            fill="none" stroke={rgba(MD.white, 0.34)} strokeWidth="0.5"
          />
        </svg>

        {/* las etiquetas del acto 3: nacen de la propia franja */}
        {f > A3 + 40 && f < A4 + 90 && (
          <AbsoluteFill style={{ opacity: clamp01((f - A3 - 50) / 30) * clamp01((A4 + 90 - f) / 40) }}>
            <div style={{ position: "absolute", left: "62%", top: "30%", fontFamily: F_SANS, fontWeight: 800, fontSize: 30, color: rgba(MD.white, 0.8), letterSpacing: 2 }}>
              ABOVE — IT DRIES OUT
            </div>
            <div style={{ position: "absolute", left: "62%", top: `${LINE_Y - 3}%`, fontFamily: F_SANS, fontWeight: 900, fontSize: 34, color: MD.redHot, letterSpacing: 2 }}>
              WATER AND AIR, ALL DAY
            </div>
            <div style={{ position: "absolute", left: "62%", top: "72%", fontFamily: F_SANS, fontWeight: 800, fontSize: 30, color: rgba(MD.white, 0.8), letterSpacing: 2 }}>
              BELOW — NOT ENOUGH AIR
            </div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>

      <Sheen at={A2 + 30} dur={28} angle={12} />
      <Occluder at={A2 - 14} dur={14} color={MD.ink1} angle={7} />
      <Occluder at={A3 - 14} dur={14} color={MD.ink2} angle={-8} />
      <Occluder at={A4 - 14} dur={14} color={MD.ink1} angle={5} />

      <AbsoluteFill style={{ padding: 96, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        {f < A2 && (
          <div style={{ opacity: clamp01((f - 50) / 24) * clamp01((A2 - f) / 26), maxWidth: 1160 }}>
            <TextBed>
              <Kicker>A dock piling</Kicker>
              <Title size={70}>The wood underwater is fine. The wood in the air is fine.</Title>
            </TextBed>
          </div>
        )}
        {f >= A2 + 40 && f < A3 && (
          <div style={{ opacity: clamp01((f - A2 - 50) / 24) * clamp01((A3 - f) / 26), maxWidth: 1180 }}>
            <TextBed>
              <Title size={74}>What rots is the part the <Em>waves wash</Em>.</Title>
            </TextBed>
          </div>
        )}
        {f >= A4 && (
          <div style={{ opacity: clamp01((f - A4 - 30) / 26), maxWidth: 1240 }}>
            <TextBed>
              <Kicker>One band gets everything it needs</Kicker>
              <Title size={76}>That is why it is a <Em>ring</Em>.</Title>
            </TextBed>
          </div>
        )}
      </AbsoluteFill>

      {focusOut > 0 && <AbsoluteFill style={{ backdropFilter: `blur(${(focusOut * 6).toFixed(2)}px)` }} />}
      <AbsoluteFill
        style={{
          opacity: 0.05,
          backgroundImage: "repeating-conic-gradient(rgba(255,255,255,.5) 0% 25%, rgba(0,0,0,.5) 0% 50%)",
          backgroundSize: "3px 3px", mixBlendMode: "overlay",
        }}
      />
    </AbsoluteFill>
  );
};

export const MOVSHORELINE_FRAMES = END;
