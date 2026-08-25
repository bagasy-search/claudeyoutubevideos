// MovDilution.tsx — MOVIMIENTO 3 · "NUNCA FUE EL PRODUCTO" · 1080 frames @30fps (36 s)
// Canal Mike Dalton (EN) · video `mdring`.
//
// UN SOLO PLANO SECUENCIA. La MATERIA que cruza las cinco fronteras es EL LÍQUIDO ROJO: el mismo
// vaso que en el acto 1 se vuelca sobre la taza LLENA es el que se disuelve hasta desaparecer en
// el acto 2, el que se retira con el agua en el acto 3, el que vuelve a caer sobre porcelana SECA
// en el acto 4 — y ahí, por primera vez, se queda entero — y el que en el acto 5 es una banda
// sólida sobre el aro.
//
// La CÁMARA hace un arco continuo: empieza arriba mirando la taza a pico (rx −22), baja hasta la
// altura de la línea de agua (rx 0) y termina rasante contra la porcelana (rx +8), empujando
// z −260 → +640 sin retroceder.
// La LUZ viaja FRÍO → FRÍO LAVADO (la dilución también lava la luz) → FRÍO ALTO → ROJO PLENO.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · f0–200 · "UN VASO"          (protagonista: el vaso volcándose)
//   enterFrom cam {z −260, rx −22 — a pico sobre la taza llena}  luz {FRÍO}
//   exitTo    cam {z −140, rx −16}  materia {el chorro rojo entra al agua}
//   ── FRONTERA A @186 · el chorro tapa el centro del cuadro ──
// ACTO 2 · f200–470 · "SE DISUELVE"    (protagonista: el agua que se lo come)
//   materia {el rojo se abre en volutas y baja de saturación hasta casi blanco}
//   exitTo    cam {rx −6}  luz {LAVADA}
//   ── FRONTERA B @452 · OCLUSIÓN: la línea de agua barre el cuadro al vaciarse ──
// ACTO 3 · f470–700 · "CERRÁ LA LLAVE"  (protagonista: el nivel de agua bajando)
//   materia {el agua se va y deja la porcelana seca y el aro expuesto}
//   ── FRONTERA C @684 · REENCUADRE: la cámara sigue bajando hasta el aro ──
// ACTO 4 · f700–930 · "LO MISMO, ENTERO" (protagonista: el líquido que YA no se diluye)
//   luz {FRÍO ALTO}  materia {el rojo cae sobre seco y se QUEDA}
//   ── FRONTERA D @914 · flash + la banda roja se cierra sobre sí misma ──
// ACTO 5 · f930–1080 · "9 → 19"         (protagonista: el número)
//   luz {ROJO}  exitTo {hold + aberración}
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  MD, rgba, clamp01, lerp, eio, rnd, cam, light, Atmos, Occluder, Sheen, TextBed, Kicker, Title, Em, F_SANS,
} from "../mdmold/Stage";

const A1 = 0, A2 = 200, A3 = 470, A4 = 700, A5 = 930, END = 1080;

// volutas del acto 2: el rojo abriéndose en el agua
const SWIRLS = Array.from({ length: 22 }, (_, i) => ({
  a: rnd(i * 3.7) * Math.PI * 2,
  sp: 0.5 + rnd(i * 5.1 + 2) * 1.1,
  r0: 2 + rnd(i * 7.3 + 4) * 4,
  born: Math.floor(rnd(i * 2.1 + 6) * 90),
}));

export const MovDilution: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const f = Math.min(frame, END);

  const C = cam(f, { z0: -260, z1: 640, rx: 30, panY: -90, dur: A5 });

  const redPhase = clamp01((f - A4 + 40) / 120);
  const tint = light(redPhase, "cold", "red");
  const wash = clamp01((f - A2) / 200) * (1 - clamp01((f - A3) / 140)); // la luz se lava con la dilución
  const keyPos = interpolate(f, [A1, A2, A3, A4, END], [0.26, 0.5, 0.34, 0.6, 0.4], { extrapolateRight: "clamp" });

  // el agua de la taza: llena hasta el acto 3, después se va
  const waterLevel = interpolate(f, [A3, A3 + 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const WATER_TOP = 46; // y en coords 0..100 donde está la línea de agua

  // acto 1: el vaso se vuelca
  const tip = clamp01((f - 50) / 90);
  // acto 2: la concentración del rojo cae (esto ES la idea del movimiento)
  const conc = 1 - clamp01((f - A2 - 20) / 210);
  // acto 4: el rojo sobre seco, que NO se diluye
  const dryPour = clamp01((f - A4 - 30) / 110);
  // acto 5: el número
  const num = clamp01((f - A5 - 20) / 60);
  const nineToNineteen = Math.round(lerp(9, 19, eio(0, 1, clamp01((f - A5 - 60) / 80))));

  const ab = clamp01((f - (END - 34)) / 34);

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      <Atmos tint={tint} keyFrom={keyPos} intensity={interpolate(f, [A1, A2 + 120, A4, END], [1.0, 0.7, 1.2, 1.05], { extrapolateRight: "clamp" })} />

      <AbsoluteFill style={{ transform: C.transform, transformOrigin: "50% 44%" }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="porc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={rgba(MD.white, 0.92)} />
              <stop offset="52%" stopColor={rgba(MD.bone, 0.7)} />
              <stop offset="100%" stopColor={rgba(MD.ink2, 0.9)} />
            </linearGradient>
            <radialGradient id="wat" cx="50%" cy="34%">
              <stop offset="0%" stopColor={rgba(MD.cold, 0.5)} />
              <stop offset="100%" stopColor={rgba(MD.ink1, 0.86)} />
            </radialGradient>
          </defs>

          {/* la taza en sección: dos paredes que se cierran hacia el desagüe */}
          <path d="M 16,20 C 18,64 34,88 50,88 C 66,88 82,64 84,20 L 76,20 C 74,58 62,80 50,80 C 38,80 26,58 24,20 Z" fill="url(#porc)" />

          {/* el agua */}
          {waterLevel > 0.01 && (
            <path
              d={`M 24.5,${WATER_TOP} C 27,66 38,79.4 50,79.4 C 62,79.4 73,66 75.5,${WATER_TOP} Z`}
              fill="url(#wat)"
              opacity={waterLevel}
            />
          )}

          {/* ACTO 1 · el chorro que entra */}
          {f > 60 && f < A2 + 60 && (
            <rect
              x={49} y={lerp(6, WATER_TOP, 1)} width={2.2} height={Math.max(0, WATER_TOP - 6)}
              fill={rgba(MD.red, 0.8 * clamp01(tip * 3) * clamp01((A2 + 60 - f) / 50))}
              rx={1}
            />
          )}

          {/* ACTO 2 · las volutas que se disuelven — la CONCENTRACIÓN cae */}
          {f > A2 - 40 && waterLevel > 0.01 &&
            SWIRLS.map((s, i) => {
              const t = clamp01((f - A2 + 40 - s.born) / 200);
              if (t <= 0) return null;
              const rr = s.r0 + t * 16;
              const cx = 50 + Math.cos(s.a + t * s.sp * 2.4) * rr * 0.7;
              const cy = WATER_TOP + 8 + Math.sin(s.a + t * s.sp * 2.4) * rr * 0.4 + t * 10;
              return (
                <circle
                  key={i} cx={cx} cy={cy} r={rr * 0.5}
                  fill={rgba(MD.red, 0.34 * conc * (1 - t * 0.5) * waterLevel)}
                  style={{ filter: "blur(1.4px)" }}
                />
              );
            })}

          {/* el aro: siempre estuvo, se ve cuando el agua se va */}
          <g opacity={clamp01(1 - waterLevel * 1.6)}>
            <path d={`M 24.6,${WATER_TOP} C 26,${WATER_TOP + 4} 74,${WATER_TOP + 4} 75.4,${WATER_TOP}`} fill="none" stroke={rgba("#6B5A4A", 0.85)} strokeWidth="2.6" />
          </g>

          {/* ACTO 4 · el rojo sobre porcelana SECA: se queda entero */}
          {dryPour > 0 && (
            <path
              d={`M 24.6,${WATER_TOP} C 26,${WATER_TOP + 4} 74,${WATER_TOP + 4} 75.4,${WATER_TOP}`}
              fill="none" stroke={MD.red} strokeWidth={3.2}
              strokeLinecap="round"
              style={{
                clipPath: `inset(0 ${(100 - dryPour * 100).toFixed(1)}% 0 0)`,
                filter: `drop-shadow(0 0 ${(3 + dryPour * 6).toFixed(1)}px ${rgba(MD.red, 0.9)})`,
              }}
            />
          )}
        </svg>

        {/* el vaso del acto 1, como objeto real por encima de la sección */}
        {f < A2 + 40 && (
          <div
            style={{
              position: "absolute", left: "40%", top: "4%", width: 150, height: 110,
              borderRadius: "8px 8px 26px 26px",
              border: `3px solid ${rgba(MD.white, 0.5)}`,
              background: `linear-gradient(180deg, rgba(255,255,255,0.05), ${rgba(MD.red, 0.34 * (1 - tip))})`,
              transform: `rotate(${(tip * 118).toFixed(1)}deg)`,
              transformOrigin: "88% 82%",
              opacity: clamp01((A2 + 40 - f) / 40),
            }}
          />
        )}
      </AbsoluteFill>

      <Sheen at={A3 + 20} dur={26} angle={14} />
      <Occluder at={A2 - 14} dur={14} color={MD.ink1} angle={8} />
      <Occluder at={A3 - 14} dur={14} color={MD.ink2} angle={-6} />
      <Occluder at={A4 - 14} dur={14} color={MD.ink1} angle={7} />
      {f > A4 + 200 && f < A4 + 220 && (
        <AbsoluteFill style={{ background: rgba(MD.redHot, 0.3 * clamp01(1 - Math.abs(f - A4 - 210) / 12)), mixBlendMode: "screen" }} />
      )}

      <AbsoluteFill style={{ padding: 96, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        {f < A2 + 20 && (
          <div style={{ opacity: clamp01((f - 40) / 22) * clamp01((A2 + 20 - f) / 26), maxWidth: 1140 }}>
            <TextBed>
              <Kicker>A cup, into a bowl with water in it</Kicker>
              <Title size={74}>You are not applying a cleaner.</Title>
            </TextBed>
          </div>
        )}
        {f >= A2 + 60 && f < A3 && (
          <div style={{ opacity: clamp01((f - A2 - 70) / 24) * clamp01((A3 - f) / 26), maxWidth: 1220 }}>
            <TextBed>
              <Title size={70}>You are adding an ingredient</Title>
              <Title size={70}>to a gallon and a half of <Em>water</Em>.</Title>
              <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 44, color: MD.redHot, marginTop: 14 }}>
                ≈ 1/25 of the label
              </div>
            </TextBed>
          </div>
        )}
        {f >= A3 + 50 && f < A4 && (
          <div style={{ opacity: clamp01((f - A3 - 60) / 24) * clamp01((A4 - f) / 26), maxWidth: 1160 }}>
            <TextBed>
              <Kicker>Same bottle. One change.</Kicker>
              <Title size={72}>Shut the water off.</Title>
            </TextBed>
          </div>
        )}
        {f >= A5 && (
          <div style={{ opacity: num, maxWidth: 1280 }}>
            <TextBed>
              <Kicker>Bleach, poured in → bleach, water off</Kicker>
              <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
                <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 132, color: MD.white, lineHeight: 1 }}>
                  {nineToNineteen}
                </div>
                <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 40, color: MD.redHot, letterSpacing: 2 }}>DAYS</div>
              </div>
              <Title size={58}>It was never the product. It was the <Em>dilution</Em>.</Title>
            </TextBed>
          </div>
        )}
      </AbsoluteFill>

      {ab > 0 && (
        <>
          <AbsoluteFill style={{ background: rgba(MD.red, 0.1 * ab), mixBlendMode: "screen" }} />
          <AbsoluteFill style={{ backdropFilter: `blur(${(ab * 5).toFixed(2)}px)` }} />
        </>
      )}
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

export const MOVDILUTION_FRAMES = END;
