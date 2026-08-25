// MovSafety.tsx — MOVIMIENTO 6 · "EL ACCIDENTE ES SIEMPRE LA SEGUNDA BOTELLA" · 840 frames @30fps (28 s)
// Canal Mike Dalton (EN) · video `mdring`.
//
// UN SOLO PLANO SECUENCIA. La MATERIA que cruza las cuatro fronteras es EL VAPOR: el que nace del
// gel en el acto 1, el que se vuelve verde-amarillo cuando cae la lejía encima en el acto 2, el
// que se DISUELVE cuando aparece la descarga en el acto 3, y el que en el acto 4 queda como un
// hilo fino sobre las cuatro reglas.
//
// ⛔ Este movimiento NO hace chistes visuales. Las advertencias van derechas: cada regla entra
// entera, se sostiene el tiempo de leerla, y no se superpone con la siguiente.
//
// ACTO 1 · f0–190 · "EL GEL YA ESTÁ ADENTRO"   luz {FRÍO}  cam {z −160}
//   ── FRONTERA A @174 · el vapor cruza el cuadro ──
// ACTO 2 · f190–420 · "Y LE ECHÁS LEJÍA ENCIMA" luz {ROJO}  el vapor vira, la pantalla late
//   ── FRONTERA B @404 · flash y el vapor tapa ──
// ACTO 3 · f420–580 · "DESCARGÁ EN EL MEDIO"    el agua barre el vapor; luz vuelve a FRÍO
//   ── FRONTERA C @564 · el barrido del agua es la costura ──
// ACTO 4 · f580–840 · "LAS CUATRO REGLAS"       hold largo, legible, sin adornos
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  MD, rgba, clamp01, lerp, rnd, cam, light, Atmos, Occluder, TextBed, Kicker, Title, F_SANS,
} from "../mdmold/Stage";

const A1 = 0, A2 = 190, A3 = 420, A4 = 580, END = 840;

const RULES: [string, string][] = [
  ["BLEACH + ACID GEL OR VINEGAR", "Chlorine gas. Flush in between."],
  ["BLEACH + AMMONIA OR URINE", "Chloramine. Flush first."],
  ["PEROXIDE + VINEGAR, STORED", "Peracetic acid. Never in one bottle."],
  ["ANYTHING OVER 3%", "Skin burns. Drugstore strength only."],
];

const PUFFS = Array.from({ length: 26 }, (_, i) => ({
  x: 30 + rnd(i * 3.3) * 40,
  sp: 0.35 + rnd(i * 5.7 + 1) * 0.7,
  r: 30 + rnd(i * 2.9 + 4) * 70,
  ph: rnd(i * 7.1 + 2) * 100,
}));

export const MovSafety: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const f = Math.min(frame, END);

  const C = cam(f, { z0: -160, z1: 180, panY: -40, dur: A4 });

  const gasPhase = clamp01((f - A2) / 70) * (1 - clamp01((f - A3) / 80));
  const tint = light(gasPhase, "cold", "red");
  const keyPos = interpolate(f, [A1, A2, A3, END], [0.3, 0.58, 0.34, 0.3], { extrapolateRight: "clamp" });

  // el barrido del agua del acto 3 borra el vapor: la descarga ES la solución
  const flush = clamp01((f - A3) / 90);
  const vapor = clamp01((f - 40) / 80) * (1 - flush);

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      <Atmos tint={tint} keyFrom={keyPos} intensity={interpolate(f, [A1, A2, A3, END], [0.95, 1.35, 0.9, 0.95], { extrapolateRight: "clamp" })} />

      <AbsoluteFill style={{ transform: C.transform, transformOrigin: "50% 56%" }}>
        {/* EL VAPOR — la materia que cruza los cuatro actos */}
        {vapor > 0.01 &&
          PUFFS.map((p, i) => {
            const t = ((f * p.sp + p.ph) % 130) / 130;
            const col = gasPhase > 0.15 ? "#B9C24A" : MD.cold; // vira a verde-amarillo con el gas
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${p.x + Math.sin((f + p.ph) / 40) * 4}%`,
                  top: `${(78 - t * 62).toFixed(1)}%`,
                  width: p.r, height: p.r, borderRadius: "50%",
                  background: `radial-gradient(circle, ${rgba(col, 0.20 * vapor * (1 - t))}, rgba(0,0,0,0) 70%)`,
                  filter: "blur(10px)",
                }}
              />
            );
          })}

        {/* el barrido del agua del acto 3 */}
        {flush > 0 && flush < 1 && (
          <AbsoluteFill
            style={{
              background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(MD.cold, 0.24)} 46%, rgba(0,0,0,0) 92%)`,
              transform: `translateY(${lerp(-120, 120, flush).toFixed(1)}%)`,
            }}
          />
        )}
      </AbsoluteFill>

      <Occluder at={A2 - 14} dur={14} color={MD.ink1} angle={8} />
      <Occluder at={A4 - 14} dur={14} color={MD.ink2} angle={-6} />
      {f > A3 - 8 && f < A3 + 12 && (
        <AbsoluteFill style={{ background: rgba(MD.redHot, 0.26 * clamp01(1 - Math.abs(f - A3 - 2) / 12)), mixBlendMode: "screen" }} />
      )}

      <AbsoluteFill style={{ padding: 96, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {f < A2 && (
          <div style={{ opacity: clamp01((f - 40) / 24) * clamp01((A2 - f) / 26), maxWidth: 1180 }}>
            <TextBed>
              <Kicker>Nobody pours two bottles together on purpose</Kicker>
              <Title size={66}>They clean with a gel. It does not work.</Title>
            </TextBed>
          </div>
        )}
        {f >= A2 + 40 && f < A3 + 40 && (
          <div style={{ opacity: clamp01((f - A2 - 50) / 24) * clamp01((A3 + 40 - f) / 30), maxWidth: 1220 }}>
            <TextBed>
              <Title size={68}>They do not flush.</Title>
              <Title size={68}>They pour bleach in on top of it.</Title>
            </TextBed>
          </div>
        )}
        {f >= A4 && (
          <div style={{ opacity: clamp01((f - A4 - 20) / 30), maxWidth: 1500 }}>
            <TextBed pad={34}>
              <Kicker>Never mix</Kicker>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 18 }}>
                {RULES.map(([a, b], i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex", alignItems: "center", gap: 20,
                      opacity: clamp01((f - A4 - 30 - i * 34) / 22),
                    }}
                  >
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: "50%", background: MD.red,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: F_SANS, fontWeight: 900, fontSize: 24, color: MD.white, flexShrink: 0,
                      }}
                    >
                      ✕
                    </div>
                    <div>
                      <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 34, color: MD.white, letterSpacing: 1 }}>{a}</div>
                      <div style={{ fontFamily: F_SANS, fontWeight: 600, fontSize: 25, color: rgba(MD.white, 0.72) }}>{b}</div>
                    </div>
                  </div>
                ))}
              </div>
            </TextBed>
          </div>
        )}
      </AbsoluteFill>

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

export const MOVSAFETY_FRAMES = END;
