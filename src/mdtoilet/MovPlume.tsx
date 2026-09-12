// MovPlume.tsx — MOVIMIENTO 4 · "LO QUE SUBE" · 1619 frames (54 s)
// Canal Mike Dalton (EN) · video `mdtoilet`.
//
// LA IDEA: en 2022 unos ingenieros iluminaron un inodoro con láseres verdes y fotografiaron algo
// que siempre estuvo ahí y nadie había visto: la pluma. Sube más rápido de dos metros por segundo
// y a los ocho segundos está a metro y medio. Metro y medio es la altura de la cara, del toallero
// y del vaso de los cepillos de dientes. Y después el beat honesto: era un inodoro COMERCIAL sin
// tapa. En casa, con la tapa baja, es una fracción — que es exactamente el punto.
//
// MATERIA QUE CRUZA LAS FRONTERAS: **la lámina de láser**. Es el plano verde del acto 1, es lo
// que hace visible la pluma en el 2, es la regla graduada del 3, es la línea que parte la
// comparación del 4 y es el filo que la tapa corta en el 5.
//
// ACTO 1 · f0–300   · "EL LÁSER SE ENCIENDE"  cam {z -320 → -120}
//   ── FRONTERA A @288 · la lámina barre y detrás ya hay agua moviéndose ──
// ACTO 2 · f300–740 · "LA PLUMA"              cam {z -120 → +40, panY -120 (sube con ella)}
//   ── FRONTERA B @726 · la regla graduada se materializa desde la lámina ──
// ACTO 3 · f740–1030 · "METRO Y MEDIO"        cam {z +40 → +130}
//   ── FRONTERA C @1014 · OCLUSIÓN por la tapa que baja ──
// ACTO 4 · f1030–1330 · "SEAMOS HONESTOS"     cam {z +130 → +60, ry +5}
//   ── FRONTERA D @1314 · la tapa cae de verdad y corta la lámina ──
// ACTO 5 · f1330–1619 · "LA PARTE GRATIS"     hold vivo
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { MD, rgba, clamp01, lerp, rnd, light, Atmos, Occluder, Sheen, glassStyle, F_SANS } from "../mdmold/Stage";
import { Blocks, PT } from "./Porcelain";

const LASER = "#7CFF9E";
const P1 = 0, P2 = 300, P3 = 740, P4 = 1030, P5 = 1330, END = 1619;

const CAMERA = (f: number) => {
  const z =
    f < P2 ? lerp(-320, -120, clamp01(f / P2)) :
    f < P3 ? lerp(-120, 40, clamp01((f - P2) / (P3 - P2))) :
    f < P4 ? lerp(40, 130, clamp01((f - P3) / (P4 - P3))) :
    f < P5 ? lerp(130, 60, clamp01((f - P4) / (P5 - P4))) :
             lerp(60, 96, clamp01((f - P5) / (END - P5)));
  const panY =
    f < P2 ? lerp(70, 40, clamp01(f / P2)) :
    f < P3 ? lerp(40, -120, clamp01((f - P2) / (P3 - P2))) :
             lerp(-120, -56, clamp01((f - P3) / (END - P3)));
  const ry = f < P4 ? 0 : lerp(0, 5, clamp01((f - P4) / 380));
  const bx = Math.sin(f / 53) * 2.4;
  const by = Math.cos(f / 69) * 1.8;
  return `perspective(1500px) translateZ(${z.toFixed(2)}px) translate3d(${bx.toFixed(2)}px, ${(panY + by).toFixed(2)}px, 0) rotateY(${ry.toFixed(3)}deg) rotateX(${lerp(5, -2, clamp01(f / 1400)).toFixed(3)}deg)`;
};

// la lámina de láser: un plano vertical de luz que corta el aire
const LaserSheet: React.FC<{ f: number; on: number; x?: string; w?: number }> = ({ f, on, x = "50%", w = 3 }) => {
  const flick = 0.86 + Math.sin(f / 7) * 0.07 + Math.sin(f / 3.1) * 0.05;
  return (
    <>
      <div
        style={{
          position: "absolute", left: x, top: "-10%", height: "120%",
          transform: "translateX(-50%)", width: w,
          background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(LASER, 0.9 * on * flick)} 14%, ${rgba(LASER, 0.9 * on * flick)} 86%, rgba(0,0,0,0) 100%)`,
          boxShadow: `0 0 ${40 * on}px ${10 * on}px ${rgba(LASER, 0.35 * on)}`,
        }}
      />
      {/* el halo del plano: hace visible el polvo del aire */}
      <div
        style={{
          position: "absolute", left: x, top: 0, height: "100%", width: 260,
          transform: "translateX(-50%)",
          background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(LASER, 0.07 * on)} 50%, rgba(0,0,0,0) 100%)`,
        }}
      />
    </>
  );
};

// las partículas de la pluma: nacen en la taza, suben, se abren
const Plume: React.FC<{ f: number; t0: number; n?: number; rise?: number; spread?: number }> = ({
  f, t0, n = 190, rise = 1, spread = 1,
}) => (
  <>
    {Array.from({ length: n }, (_, i) => {
      const s = rnd(i * 1.37);
      const s2 = rnd(i * 5.11);
      const born = t0 + s * 90;
      const age = (f - born) / (150 + s2 * 190);
      if (age < 0 || age > 1) return null;
      const y = 86 - age * 78 * rise;
      const wob = Math.sin(age * 5 + i) * (4 + s2 * 14) * spread;
      const x = 50 + (s - 0.5) * 12 * spread + wob * age;
      const o = Math.sin(clamp01(age) * Math.PI) * (0.35 + s2 * 0.55);
      const r = 1.4 + s2 * 3.4;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${x}%`, top: `${y}%`,
            width: r, height: r, borderRadius: "50%",
            background: rgba(LASER, o),
            boxShadow: `0 0 ${r * 3}px ${rgba(LASER, o * 0.6)}`,
          }}
        />
      );
    })}
  </>
);

// la regla graduada: pies y metros, con las tres marcas que importan
const Ruler: React.FC<{ f: number; at: number; upto: number; marks: { h: number; label: string }[] }> = ({ f, at, upto, marks }) => {
  const a = clamp01((f - at) / 24);
  if (a <= 0) return null;
  return (
    <div style={{ position: "absolute", right: "12%", top: "8%", bottom: "12%", width: 320, opacity: a }}>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 2, background: rgba(MD.white, 0.32) }} />
      {Array.from({ length: 7 }, (_, i) => {
        const h = i; // pies
        const on = h <= upto;
        return (
          <div key={i} style={{ position: "absolute", right: 0, bottom: `${(h / 6) * 100}%`, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontFamily: F_SANS, fontWeight: 700, fontSize: 22, color: rgba(MD.white, on ? 0.85 : 0.28) }}>{h} ft</div>
            <div style={{ width: h % 2 === 0 ? 34 : 18, height: 2, background: rgba(on ? LASER : MD.white, on ? 0.7 : 0.22) }} />
          </div>
        );
      })}
      {marks.map((m, i) => {
        const mo = clamp01((f - at - 40 - i * 34) / 20);
        if (mo <= 0) return null;
        return (
          <div
            key={"m" + i}
            style={{
              position: "absolute", right: 54, bottom: `${(m.h / 6) * 100}%`,
              transform: "translateY(50%)", opacity: mo,
              ...glassStyle({ radius: 10 }), padding: "8px 14px", whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 24, color: MD.white }}>{m.label}</span>
          </div>
        );
      })}
    </div>
  );
};

const Act1: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01(f / P2);
  const on = clamp01((p - 0.18) / 0.3);
  return (
    <>
      {/* el baño público a oscuras: una silueta de porcelana apenas insinuada */}
      <div
        style={{
          position: "absolute", left: "50%", bottom: "6%", transform: "translateX(-50%)",
          width: 560, height: 320,
          borderRadius: "48% 48% 22% 22% / 62% 62% 30% 30%",
          background: `linear-gradient(180deg, ${rgba(PT.chinaDim, 0.20)} 0%, ${rgba("#141518", 0.9)} 100%)`,
          boxShadow: "0 40px 90px rgba(0,0,0,0.7)",
        }}
      />
      <LaserSheet f={f} on={on} />
      <div style={{ position: "absolute", left: "8%", top: "18%", width: "40%" }}>
        <Blocks
          at={26}
          stepEvery={40}
          items={[
            { t: "2022. COLORADO.", size: 50 },
            { t: "HIGH-POWERED GREEN LASERS", size: 34, gap: 10 },
            { t: "aimed at a toilet", em: true, size: 66, gap: 10 },
          ]}
        />
      </div>
    </>
  );
};

const Act2: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01((f - P2) / (P3 - P2));
  const secs = Math.min(8, Math.max(0, (f - P2 - 40) / 30));
  return (
    <>
      <div
        style={{
          position: "absolute", left: "50%", bottom: "6%", transform: "translateX(-50%)",
          width: 560, height: 320,
          borderRadius: "48% 48% 22% 22% / 62% 62% 30% 30%",
          background: `linear-gradient(180deg, ${rgba(PT.chinaDim, 0.22)} 0%, ${rgba("#141518", 0.9)} 100%)`,
        }}
      />
      <LaserSheet f={f} on={1} />
      <Plume f={f} t0={P2 + 26} n={210} rise={clamp01(p * 1.5)} spread={0.5 + p} />
      <div style={{ position: "absolute", left: "7%", top: "14%", width: "36%" }}>
        <Blocks
          at={P2 + 34}
          stepEvery={46}
          items={[
            { t: "IT WAS ALWAYS THERE.", size: 46 },
            { t: "nobody had seen it", em: true, size: 66, gap: 8 },
          ]}
        />
        {/* dos números duros, sin adorno */}
        <div style={{ display: "flex", gap: 16, marginTop: 30, opacity: clamp01((f - P2 - 140) / 24) }}>
          <div style={{ ...glassStyle({ radius: 14 }), padding: "16px 22px" }}>
            <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 18, letterSpacing: 2.4, color: MD.red }}>SPEED</div>
            <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 56, color: MD.white, lineHeight: 1.05 }}>&gt;2 m/s</div>
          </div>
          <div style={{ ...glassStyle({ radius: 14 }), padding: "16px 22px" }}>
            <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 18, letterSpacing: 2.4, color: MD.red }}>ELAPSED</div>
            <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 56, color: MD.white, lineHeight: 1.05 }}>{secs.toFixed(1)}s</div>
          </div>
        </div>
      </div>
    </>
  );
};

const Act3: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01((f - P3) / (P4 - P3));
  return (
    <>
      <LaserSheet f={f} on={0.8} x="34%" />
      <Plume f={f} t0={P3 - 220} n={210} rise={1} spread={1.5} />
      <Ruler
        f={f}
        at={P3 + 10}
        upto={interpolate(p, [0, 0.5], [1, 5], { extrapolateRight: "clamp" })}
        marks={[
          { h: 5, label: "FACE HEIGHT" },
          { h: 4.2, label: "TOWEL BAR" },
          { h: 3.4, label: "TOOTHBRUSH CUP" },
        ]}
      />
      <div style={{ position: "absolute", left: "7%", top: "22%", width: "32%" }}>
        <Blocks
          at={P3 + 16}
          stepEvery={40}
          items={[
            { t: "FIVE FEET", size: 86 },
            { t: "in eight seconds", em: true, size: 58, gap: 4 },
          ]}
        />
      </div>
    </>
  );
};

const Act4: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01((f - P4) / (P5 - P4));
  const lid = clamp01((p - 0.34) / 0.4);
  return (
    <>
      {/* comparación honesta: la lámina parte el cuadro en dos */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "50%", overflow: "hidden" }}>
        <Plume f={f} t0={P4 - 260} n={130} rise={1} spread={1.2} />
        <div style={{ position: "absolute", left: "8%", bottom: "16%", ...glassStyle({ radius: 12 }), padding: "12px 18px" }}>
          <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 20, letterSpacing: 2.2, color: MD.red }}>COMMERCIAL · NO LID</div>
          <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 34, color: MD.white }}>What they measured</div>
        </div>
      </div>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "50%", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 1 - lid * 0.86 }}>
          <Plume f={f} t0={P4 - 260} n={70} rise={0.42} spread={0.5} />
        </div>
        {/* la tapa baja de este lado */}
        <div
          style={{
            position: "absolute", left: "10%", right: "10%",
            top: `${lerp(-16, 58, lid)}%`, height: 46, borderRadius: 26,
            background: `linear-gradient(180deg, ${rgba(PT.china, 0.9)} 0%, ${rgba(PT.chinaDim, 0.9)} 100%)`,
            boxShadow: "0 22px 50px rgba(0,0,0,0.7), inset 0 2px 0 rgba(255,255,255,0.5)",
          }}
        />
        <div style={{ position: "absolute", right: "8%", bottom: "16%", ...glassStyle({ radius: 12 }), padding: "12px 18px" }}>
          <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 20, letterSpacing: 2.2, color: LASER }}>HOME · LID DOWN</div>
          <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 34, color: MD.white }}>A fraction of that</div>
        </div>
      </div>
      <LaserSheet f={f} on={0.9} x="50%" w={2} />
      <div style={{ position: "absolute", left: "50%", top: "10%", transform: "translateX(-50%)", textAlign: "center" }}>
        <Blocks
          at={P4 + 18}
          align="center"
          stepEvery={40}
          items={[{ t: "I WANT TO BE STRAIGHT WITH YOU", size: 40 }]}
        />
      </div>
    </>
  );
};

const Act5: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01((f - P5) / (END - P5));
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(64% 56% at 50% 54%, ${rgba(PT.chinaDim, 0.13)} 0%, rgba(0,0,0,0) 74%)` }} />
      {/* la tapa, sola, cerrándose en el centro del cuadro */}
      <div
        style={{
          position: "absolute", left: "50%", top: "46%", transform: `translate(-50%,-50%) rotateX(${lerp(64, 4, clamp01(p / 0.42))}deg)`,
          width: 620, height: 90, borderRadius: 46,
          background: `linear-gradient(180deg, ${rgba(PT.china, 0.95)} 0%, ${rgba(PT.chinaDim, 0.92)} 100%)`,
          boxShadow: "0 40px 90px rgba(0,0,0,0.75), inset 0 3px 0 rgba(255,255,255,0.6)",
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: "16%" }}>
        <div style={{ textAlign: "center" }}>
          <Blocks
            at={P5 + 40}
            align="center"
            stepEvery={44}
            items={[
              { t: "CLOSE THE LID BEFORE YOU FLUSH.", size: 54 },
              { t: "it costs nothing", em: true, size: 74, gap: 10 },
            ]}
          />
        </div>
      </AbsoluteFill>
    </>
  );
};

export const MovPlume: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const f = Math.min(frame, END - 1);
  const t = clamp01(f / END);
  const out = clamp01((frame - (durationInFrames - 12)) / 12);
  return (
    <AbsoluteFill style={{ backgroundColor: "#05060700", overflow: "hidden" }}>
      <AbsoluteFill style={{ backgroundColor: MD.ink0 }} />
      <Atmos tint={MD.cold} keyFrom={lerp(0.3, 0.6, t)} intensity={lerp(0.72, 0.94, t)} />
      <AbsoluteFill style={{ transform: CAMERA(f), transformStyle: "preserve-3d" }}>
        {f < P2 + 8 && <Act1 f={f} />}
        {f >= P2 && f < P3 + 8 && <Act2 f={f} />}
        {f >= P3 && f < P4 + 8 && <Act3 f={f} />}
        {f >= P4 && f < P5 + 8 && <Act4 f={f} />}
        {f >= P5 && <Act5 f={f} />}
      </AbsoluteFill>
      <Occluder at={P2 - 12} dur={14} color="#0C1410" angle={-6} />
      <Occluder at={P3 - 14} dur={14} color={MD.ink2} angle={6} />
      <Occluder at={P5 - 16} dur={18} color={PT.chinaDim} angle={-2} />
      <Sheen at={P5 + 110} dur={30} />
      {out > 0 && <AbsoluteFill style={{ background: rgba(MD.ink0, out * 0.5) }} />}
    </AbsoluteFill>
  );
};
