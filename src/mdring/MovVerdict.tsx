// MovVerdict.tsx — MOVIMIENTO 5 · "EL RELOJ DE RETORNO" · 960 frames @30fps (32 s)
// Canal Mike Dalton (EN) · video `mdring`.
//
// UN SOLO PLANO SECUENCIA. La MATERIA que cruza las cuatro fronteras es EL CALENDARIO: la misma
// grilla de cuadraditos que en el acto 1 está vacía es la que en el acto 2 se llena de días para
// la lejía, la que en el acto 3 se estira para el ácido y la lejía-bien-hecha, y la que en el
// acto 4 se desborda del cuadro con el peróxido. Nunca se redibuja: SE EXTIENDE.
//
// La CÁMARA hace un truck lateral continuo que sigue a la barra más larga, más un pull-back final
// que revela las cuatro juntas. La LUZ viaja FRÍO → ROJO (lejía, la peor) → FRÍO → CÁLIDO.
//
// ACTO 1 · f0–170 · "LA REGLA"        cam {z −180}  materia {la grilla vacía, un día = un cuadro}
//   ── FRONTERA A @154 · el primer cuadro se enciende y tapa el centro ──
// ACTO 2 · f170–420 · "LEJÍA: 9"      luz {ROJO}  la barra corre y FRENA en 9
//   ── FRONTERA B @404 · OCLUSIÓN: la barra frenada barre el cuadro ──
// ACTO 3 · f420–700 · "ÁCIDO 16 · LEJÍA BIEN 19"  dos barras más, la cámara truckea
//   ── FRONTERA C @684 · reencuadre: la cámara se aleja para que entre la cuarta ──
// ACTO 4 · f700–960 · "PERÓXIDO: 38"  luz {CÁLIDO}  la barra se sale del cuadro; hold
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  MD, rgba, clamp01, lerp, eio, cam, light, Atmos, Occluder, Sheen, TextBed, Kicker, Title, Em, F_SANS,
} from "../mdmold/Stage";

const A1 = 0, A2 = 170, A3 = 420, A4 = 700, END = 960;

type Row = { label: string; sub: string; days: number; at: number; hero?: boolean };
const ROWS: Row[] = [
  { label: "BLEACH", sub: "poured into a full bowl", days: 9, at: A2 + 30 },
  { label: "ACID GEL", sub: "only if it is mineral", days: 16, at: A3 + 30 },
  { label: "BLEACH", sub: "water off, poultice", days: 19, at: A3 + 150 },
  { label: "PEROXIDE", sub: "water off, poultice", days: 38, at: A4 + 40, hero: true },
];
const MAXD = 40;

export const MovVerdict: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const f = Math.min(frame, END);

  const C = cam(f, { z0: -180, z1: 240, panX: -90, panY: -30, dur: A4 });
  const back = f > A4 ? eio(0, 200, clamp01((f - A4) / (END - A4))) : 0;

  const redPhase = clamp01((f - A2) / 90) * (1 - clamp01((f - A3) / 120));
  const warmPhase = clamp01((f - A4 + 20) / 140);
  const tint = warmPhase > 0.02 ? light(warmPhase, "cold", "warm") : light(redPhase, "cold", "red");
  const keyPos = interpolate(f, [A1, A2, A3, A4, END], [0.24, 0.62, 0.36, 0.3, 0.28], { extrapolateRight: "clamp" });

  const ab = clamp01((f - (END - 34)) / 34);

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      <Atmos tint={tint} keyFrom={keyPos} intensity={interpolate(f, [A1, A2, A4, END], [0.9, 1.2, 1.0, 1.05], { extrapolateRight: "clamp" })} />

      <AbsoluteFill style={{ transform: `${C.transform} translateZ(${(-back).toFixed(1)}px)`, transformOrigin: "30% 50%" }}>
        <AbsoluteFill style={{ padding: "9% 7%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 34 }}>
          {ROWS.map((r, i) => {
            const on = clamp01((f - r.at) / 26);
            if (on <= 0.005) return null;
            // los días CORREN y frenan: es un contador, no una barra que crece sola
            const run = eio(0, 1, clamp01((f - r.at - 10) / (34 + r.days * 4.2)));
            const shown = Math.round(r.days * run);
            const col = r.hero ? MD.warm : i === 0 ? MD.red : MD.white;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, opacity: on }}>
                <div style={{ width: 300, textAlign: "right" }}>
                  <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 34, color: MD.white, letterSpacing: 1.4 }}>{r.label}</div>
                  <div style={{ fontFamily: F_SANS, fontWeight: 600, fontSize: 21, color: rgba(MD.white, 0.55) }}>{r.sub}</div>
                </div>
                {/* la grilla de días: un cuadrito por día, se van encendiendo */}
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                  {Array.from({ length: r.days }, (_, d) => {
                    const lit = d < shown;
                    return (
                      <div
                        key={d}
                        style={{
                          width: 22, height: 34, borderRadius: 4,
                          border: `1.5px solid ${rgba(MD.white, lit ? 0.06 : 0.20)}`,
                          background: lit ? rgba(col, 0.85) : "transparent",
                          boxShadow: lit ? `0 0 12px ${rgba(col, 0.5)}` : "none",
                          transform: lit ? "scaleY(1)" : "scaleY(0.86)",
                        }}
                      />
                    );
                  })}
                  <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 46, color: col, marginLeft: 16, minWidth: 90 }}>
                    {shown}
                  </div>
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>

      <Sheen at={A3 + 40} dur={26} angle={14} />
      <Occluder at={A2 - 14} dur={14} color={MD.ink1} angle={8} />
      <Occluder at={A3 - 14} dur={14} color={MD.ink2} angle={-7} />
      <Occluder at={A4 - 14} dur={14} color={MD.ink1} angle={6} />

      <AbsoluteFill style={{ padding: 90, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        {f < A2 && (
          <div style={{ opacity: clamp01((f - 40) / 24) * clamp01((A2 - f) / 26), maxWidth: 1200 }}>
            <TextBed>
              <Kicker>Not which one cleans it. They all clean it.</Kicker>
              <Title size={64}>How many days until it <Em>comes back</Em>.</Title>
            </TextBed>
          </div>
        )}
        {f >= A4 + 130 && (
          <div style={{ opacity: clamp01((f - A4 - 140) / 26), maxWidth: 1260, marginTop: "auto" }}>
            <TextBed>
              <Title size={60}>Same toilets. Same months. <Em>One change.</Em></Title>
            </TextBed>
          </div>
        )}
      </AbsoluteFill>

      {ab > 0 && (
        <>
          <AbsoluteFill style={{ background: rgba(MD.warm, 0.08 * ab), mixBlendMode: "screen" }} />
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

export const MOVVERDICT_FRAMES = END;
