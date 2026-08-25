// MovCurve.tsx — MOVIMIENTO 2 · "NO VOLVIÓ DE UN DÍA PARA EL OTRO" · 1140 frames @30fps (38 s)
// Canal Mike Dalton (EN) · video `mdring`.
//
// UN SOLO PLANO SECUENCIA. La MATERIA que cruza las cinco fronteras es EL PUNTO: el mismo punto
// rojo que en el acto 1 es "el uno por ciento que dejaste" se DUPLICA en el acto 2, se hunde bajo
// el umbral del ojo en el acto 3, revienta la curva en el acto 4 y en el acto 5 vuelve a ser un
// punto — pero ahora en el día seis, que es donde hay que pegarle.
//
// La CÁMARA hace un solo viaje: arranca pegada al punto (z −420) y se aleja de forma monótona
// hasta ver la curva entera (z +560), con un truck a la izquierda que convierte el punto inicial
// en el ORIGEN del gráfico. Nunca vuelve.
// La LUZ viaja FRÍO → FRÍO → ROJO (la explosión) → CÁLIDO (la resolución del acto 5).
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · f0–190 · "EL UNO POR CIENTO"      (protagonista: un punto rojo solo)
//   enterFrom cam {z −420, panX 0}  luz {FRÍO bajo}  materia {un punto}
//   exitTo    cam {z −300}  materia {el punto se PARTE en dos}
//   ── FRONTERA A @176 · la partición misma tapa el centro del cuadro ──
// ACTO 2 · f190–470 · "SE DUPLICA"           (protagonista: la colonia que se parte)
//   exitTo    cam {z −120, truck −180}  materia {ya son decenas, todas bajo el umbral}
//   ── FRONTERA B @452 · OCLUSIÓN: la línea del umbral barre el cuadro ──
// ACTO 3 · f470–700 · "NO LO PODÉS VER"      (protagonista: la línea del umbral del ojo)
//   luz {FRÍO alto}  materia {la curva dibujándose, plana, gris, por debajo de la línea}
//   ── FRONTERA C @684 · el trazo cruza la línea y se enciende en ROJO ──
// ACTO 4 · f700–950 · "LOS ÚLTIMOS DOS DÍAS" (protagonista: la pared vertical de la curva)
//   luz {ROJO}  materia {la curva explota; el 90% se construye acá}
//   ── FRONTERA D @934 · flash y reencuadre: la cámara retrocede y aparece el día 6 ──
// ACTO 5 · f950–1140 · "PEGALE EN EL DÍA SEIS" (protagonista: el punto otra vez, temprano)
//   luz {CÁLIDO}  exitTo {hold + blur focus-pull que prepara el corte}
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  MD, rgba, clamp01, lerp, eio, rnd, cam, light, Atmos, Occluder, Sheen, TextBed, Kicker, Title, Em,
} from "../mdmold/Stage";

const A1 = 0, A2 = 190, A3 = 470, A4 = 700, A5 = 950, END = 1140;

// La curva: y = 2^(x·k). Se dibuja como path en coordenadas 0..100.
const curveY = (x: number) => {
  const v = Math.pow(2, (x / 100) * 9.2) / Math.pow(2, 9.2); // 0..1
  return 92 - v * 78;
};
const CURVE_D = (() => {
  let d = `M 6,${curveY(0).toFixed(2)}`;
  for (let x = 1; x <= 100; x += 1) d += ` L ${(6 + x * 0.9).toFixed(2)},${curveY(x).toFixed(2)}`;
  return d;
})();
const EYE_Y = 40; // el umbral del ojo: por encima de esta línea (menor y) se VE

// Las colonias del acto 2: cada una nace de la anterior (duplicación real, no ruido)
const SEEDS = Array.from({ length: 34 }, (_, i) => ({
  x: 46 + (rnd(i * 4.7) - 0.5) * 44,
  y: 44 + (rnd(i * 8.1 + 3) - 0.5) * 34,
  born: 40 + Math.floor(Math.log2(i + 1) * 62) + Math.floor(rnd(i * 2.9) * 22),
  r: 3 + rnd(i * 6.3 + 7) * 5,
}));

export const MovCurve: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const f = Math.min(frame, END);

  const C = cam(f, { z0: -420, z1: 560, panX: -180, panY: 30, ry: 6, dur: A5 });

  const redPhase = clamp01((f - A4 + 30) / 90);
  const warmPhase = clamp01((f - A5 + 20) / 110);
  const tint = warmPhase > 0.02 ? light(warmPhase, "red", "warm") : light(redPhase, "cold", "red");
  const keyPos = interpolate(f, [A1, A3, A4, END], [0.22, 0.4, 0.66, 0.34], { extrapolateRight: "clamp" });

  // el trazo de la curva: avanza con el tiempo, se enciende al cruzar el umbral
  const draw = clamp01((f - A3 + 20) / (A4 + 180 - A3));
  const litFrom = clamp01((f - A4) / 120);

  // acto 1-2: el punto y sus duplicaciones
  const split = clamp01((f - 150) / 60);

  // acto 5: el punto temprano, en el día seis
  const day6 = clamp01((f - A5 - 30) / 70);

  const focusPull = clamp01((f - (END - 40)) / 40);

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      <Atmos tint={tint} keyFrom={keyPos} intensity={interpolate(f, [A1, A4, END], [0.85, 1.25, 1.0], { extrapolateRight: "clamp" })} />

      <AbsoluteFill style={{ transform: C.transform, transformOrigin: "42% 52%" }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {/* eje: nace en el acto 3, sale del mismo punto que fue el protagonista */}
          {f > A3 - 60 && (
            <g opacity={clamp01((f - A3 + 60) / 70)}>
              <line x1="6" y1="92" x2="97" y2="92" stroke={rgba(MD.white, 0.28)} strokeWidth="0.35" />
              <line x1="6" y1="12" x2="6" y2="92" stroke={rgba(MD.white, 0.18)} strokeWidth="0.3" />
              {[2, 4, 6, 8, 10].map((d, i) => (
                <g key={d}>
                  <line x1={6 + (i + 1) * 16.6} y1="91" x2={6 + (i + 1) * 16.6} y2="93.4" stroke={rgba(MD.white, 0.3)} strokeWidth="0.3" />
                </g>
              ))}
            </g>
          )}

          {/* LA LÍNEA DEL UMBRAL DEL OJO — el personaje del acto 3 */}
          {f > A3 && (
            <g opacity={clamp01((f - A3 - 20) / 50)}>
              <line
                x1="6" y1={EYE_Y} x2="97" y2={EYE_Y}
                stroke={rgba(MD.white, 0.5)} strokeWidth="0.34" strokeDasharray="2.2 1.6"
              />
            </g>
          )}

          {/* LA CURVA: gris punteada bajo el umbral, roja y gruesa arriba */}
          {f > A3 - 20 && (
            <>
              <path
                d={CURVE_D} fill="none"
                stroke={rgba(MD.white, 0.42)} strokeWidth="0.5" strokeDasharray="1.6 1.4"
                pathLength={1} strokeDashoffset={0}
                style={{ clipPath: `inset(0 ${(100 - draw * 100).toFixed(2)}% 0 0)` }}
              />
              <path
                d={CURVE_D} fill="none"
                stroke={MD.red} strokeWidth={1.5} strokeLinecap="round"
                style={{
                  clipPath: `inset(0 ${(100 - draw * 100).toFixed(2)}% ${(100 - EYE_Y).toFixed(1)}% 0)`,
                  filter: `drop-shadow(0 0 ${(2 + litFrom * 5).toFixed(1)}px ${rgba(MD.red, 0.8)})`,
                  opacity: litFrom,
                }}
              />
            </>
          )}

          {/* ACTOS 1-2 · el punto y su descendencia */}
          {f < A3 + 40 &&
            SEEDS.map((s, i) => {
              const on = clamp01((f - s.born) / 26) * (i === 0 ? 1 : split);
              if (on <= 0.01) return null;
              const fade = f > A3 ? clamp01(1 - (f - A3) / 40) : 1;
              return (
                <circle
                  key={i} cx={s.x} cy={s.y} r={s.r * on}
                  fill={rgba(MD.red, 0.72 * on * fade)}
                  style={{ filter: `drop-shadow(0 0 3px ${rgba(MD.red, 0.6 * fade)})` }}
                />
              );
            })}

          {/* ACTO 5 · el punto temprano, en el día seis */}
          {day6 > 0 && (
            <g opacity={day6}>
              <line x1={6 + 3 * 16.6} y1="92" x2={6 + 3 * 16.6} y2={curveY(50)} stroke={rgba(MD.warm, 0.6)} strokeWidth="0.4" strokeDasharray="1.4 1.2" />
              <circle cx={6 + 3 * 16.6} cy={curveY(50)} r={2.4 + Math.sin(f / 9) * 0.3} fill={MD.warm} style={{ filter: `drop-shadow(0 0 6px ${rgba(MD.warm, 0.9)})` }} />
            </g>
          )}
        </svg>
      </AbsoluteFill>

      <Sheen at={A3 + 30} dur={26} angle={16} />
      <Occluder at={A2 - 14} dur={14} color={MD.ink1} angle={9} />
      <Occluder at={A3 - 14} dur={14} color={MD.ink2} angle={-7} />
      <Occluder at={A5 - 14} dur={14} color={MD.ink1} angle={5} />

      {/* flash de la frontera D: la explosión de la curva */}
      {f > A4 - 6 && f < A4 + 14 && (
        <AbsoluteFill style={{ background: rgba(MD.redHot, 0.34 * clamp01(1 - Math.abs(f - A4 - 4) / 12)), mixBlendMode: "screen" }} />
      )}

      <AbsoluteFill style={{ padding: 96, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        {f < A2 + 40 && (
          <div style={{ opacity: clamp01((f - 44) / 22) * clamp01((A2 + 40 - f) / 26), maxWidth: 1120 }}>
            <TextBed>
              <Kicker>You cleaned it. You left one percent.</Kicker>
              <Title size={74}>One percent is <Em>invisible</Em>.</Title>
            </TextBed>
          </div>
        )}
        {f >= A2 + 60 && f < A3 && (
          <div style={{ opacity: clamp01((f - A2 - 70) / 24) * clamp01((A3 - f) / 26), maxWidth: 1180 }}>
            <TextBed>
              <Title size={72}>Colonies do not grow in a line.</Title>
              <Title size={72}>They <Em>double</Em>.</Title>
            </TextBed>
          </div>
        )}
        {f >= A3 + 60 && f < A4 && (
          <div style={{ opacity: clamp01((f - A3 - 70) / 24) * clamp01((A4 - f) / 26), maxWidth: 1220 }}>
            <TextBed>
              <Kicker>Day three. Day six.</Kicker>
              <Title size={70}>Still nothing your eye can see.</Title>
            </TextBed>
          </div>
        )}
        {f >= A4 + 50 && f < A5 && (
          <div style={{ opacity: clamp01((f - A4 - 60) / 24) * clamp01((A5 - f) / 26), maxWidth: 1260 }}>
            <TextBed>
              <Title size={72}>Ninety percent of that ring</Title>
              <Title size={72}>was built in the <Em>last two days</Em>.</Title>
            </TextBed>
          </div>
        )}
        {f >= A5 + 40 && (
          <div style={{ opacity: clamp01((f - A5 - 50) / 26), maxWidth: 1240 }}>
            <TextBed>
              <Kicker>So stop fighting it at the top</Kicker>
              <Title size={76}>Hit it on <Em>day six</Em>, while there is nothing to see.</Title>
            </TextBed>
          </div>
        )}
      </AbsoluteFill>

      {focusPull > 0 && <AbsoluteFill style={{ backdropFilter: `blur(${(focusPull * 6).toFixed(2)}px)` }} />}
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

export const MOVCURVE_FRAMES = END;
