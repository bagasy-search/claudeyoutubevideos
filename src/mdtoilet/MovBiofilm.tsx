// MovBiofilm.tsx — MOVIMIENTO 2 · "NO ES UNA MANCHA, ES UNA COLONIA" · 1580 frames (52,7 s)
// Canal Mike Dalton (EN) · video `mdtoilet`.
//
// LA IDEA: el aro no es suciedad depositada, es una colonia viviendo DENTRO de una capa de cola
// que fabricó ella misma. La lejía aterriza ARRIBA de esa cola, le quema el color y se queda ahí.
// La cola sobrevive — y la cola es exactamente lo que necesita la colonia nueva. El peróxido va
// a la COLA: la desarma. "Bleach kills what it can touch. Peroxide gets into what it can't."
//
// MATERIA QUE CRUZA TODAS LAS FRONTERAS: **la cola** (la matriz). Aparece como una gelatina
// ámbar en el acto 1, es el suelo donde crece la colonia en el 2, es la superficie donde rebota
// la lejía en el 3, es lo que se despolimeriza en el 4 y es el resto del que rebrota en el 5.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · f0–300 · "UNA MANCHA ESTÁ MUERTA"   cam {z -220 → -40, macro sobre la porcelana}
//   ── FRONTERA A @288 · OCLUSIÓN: una lámina de cola ámbar barre el cuadro ──
// ACTO 2 · f300–640 · "LA COLA"                cam {z -40 → +150, se mete en la gelatina}
//   ── FRONTERA B @624 · MATCH-SHAPE: una burbuja de la cola se vuelve la gota de lejía ──
// ACTO 3 · f640–1000 · "LA LEJÍA ATERRIZA ARRIBA"  cam {z +150 → +60, ry -5}
//   ── FRONTERA C @984 · WIPE POR MATERIA: el peróxido entra por la izquierda ──
// ACTO 4 · f1000–1320 · "EL PERÓXIDO VA A LA COLA"  cam {z +60 → +260}
//   ── FRONTERA D @1304 · FLASH INVERTIDO CORTO ──
// ACTO 5 · f1320–1580 · "LA FRASE"              cam {z +260 → +300, hold vivo}
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { MD, rgba, clamp01, lerp, rnd, light, Atmos, Occluder, Sheen, glassStyle, F_SANS } from "../mdmold/Stage";
import { Blocks, PT } from "./Porcelain";

const B1 = 0, B2 = 300, B3 = 640, B4 = 1000, B5 = 1320, END = 1580;

const CAMERA = (f: number) => {
  const z =
    f < B2 ? lerp(-220, -40, clamp01(f / B2)) :
    f < B3 ? lerp(-40, 150, clamp01((f - B2) / (B3 - B2))) :
    f < B4 ? lerp(150, 60, clamp01((f - B3) / (B4 - B3))) :
    f < B5 ? lerp(60, 260, clamp01((f - B4) / (B5 - B4))) :
             lerp(260, 300, clamp01((f - B5) / (END - B5)));
  const panX =
    f < B3 ? lerp(0, -70, clamp01(f / B3)) :
    f < B5 ? lerp(-70, 60, clamp01((f - B3) / (B5 - B3))) :
             lerp(60, 84, clamp01((f - B5) / (END - B5)));
  const ry = f < B3 ? 0 : lerp(0, -5, clamp01((f - B3) / 420));
  const rx = lerp(4, -2, clamp01(f / 1300));
  const bx = Math.sin(f / 57) * 2.6 + Math.sin(f / 123) * 1.4;
  const by = Math.cos(f / 71) * 2.0;
  return `perspective(1400px) translateZ(${z.toFixed(2)}px) translate3d(${(panX + bx).toFixed(2)}px, ${by.toFixed(2)}px, 0) rotateY(${ry.toFixed(3)}deg) rotateX(${rx.toFixed(3)}deg)`;
};

// ── LA COLA: una gelatina ámbar con espesor real, presente en TODOS los actos ────────────────
const Glue: React.FC<{ f: number; thick: number; lit?: number; broken?: number }> = ({ f, thick, lit = 1, broken = 0 }) => {
  const H = 120 * thick;
  return (
    <div style={{ position: "absolute", left: "-6%", right: "-6%", bottom: "26%", height: H, opacity: lit }}>
      {/* cuerpo de la gelatina */}
      <div
        style={{
          position: "absolute", inset: 0,
          borderRadius: "40px 30px 34px 26px / 26px 22px 20px 18px",
          background: `linear-gradient(180deg, ${rgba(PT.filmLit, 0.42)} 0%, ${rgba(PT.film, 0.66)} 46%, ${rgba("#2A2116", 0.86)} 100%)`,
          boxShadow: `inset 0 3px 0 ${rgba(MD.white, 0.16)}, 0 22px 60px rgba(0,0,0,0.6)`,
          filter: broken > 0 ? `blur(${broken * 3}px)` : undefined,
          transform: `scaleY(${1 - broken * 0.55})`,
          transformOrigin: "bottom",
        }}
      />
      {/* superficie viva: la cola respira */}
      {Array.from({ length: 18 }, (_, i) => {
        const s = rnd(i * 4.3);
        const b = Math.sin(f / (26 + s * 30) + i * 1.7) * 0.5 + 0.5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${2 + s * 94}%`,
              top: `${8 + rnd(i * 8.1) * 40}%`,
              width: 8 + s * 26,
              height: 5 + s * 14,
              borderRadius: "50%",
              background: rgba(MD.white, (0.05 + b * 0.13) * (1 - broken)),
              filter: "blur(1.2px)",
            }}
          />
        );
      })}
      {/* hebras: lo que la hace COLA y no barro */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
        {Array.from({ length: 14 }, (_, i) => {
          const s = rnd(i * 2.9);
          const x = 40 + s * 1760;
          const wob = Math.sin(f / 30 + i) * 8;
          return (
            <path
              key={i}
              d={`M${x},${H} C${x + wob},${H * 0.55} ${x - wob},${H * 0.3} ${x + wob * 0.5},${-18 - s * 26}`}
              stroke={rgba(PT.filmLit, (0.28 + s * 0.2) * (1 - broken))}
              strokeWidth={1.6 + s * 1.6}
              fill="none"
            />
          );
        })}
      </svg>
    </div>
  );
};

// bacterias: puntos que se dividen. Nunca Math.random.
const Colony: React.FC<{ f: number; n: number; alive: number; y: string }> = ({ f, n, alive, y }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, height: 130 }}>
    {Array.from({ length: n }, (_, i) => {
      const s = rnd(i * 6.1);
      const born = i * 7;
      const a = clamp01((f - born) / 22) * alive;
      const pulse = 0.8 + Math.sin(f / (18 + s * 20) + i) * 0.2;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${3 + s * 92}%`,
            top: `${rnd(i * 3.7) * 78}%`,
            width: (5 + s * 7) * pulse,
            height: (3 + s * 4) * pulse,
            borderRadius: "50%",
            background: rgba(MD.redHot, 0.5 * a),
            boxShadow: `0 0 ${10 * a}px ${rgba(MD.red, 0.5 * a)}`,
          }}
        />
      );
    })}
  </div>
);

const Act1: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01(f / B2);
  return (
    <>
      {/* la porcelana en macro: una pared clara con el aro encima */}
      <AbsoluteFill style={{ background: `linear-gradient(178deg, ${rgba(PT.china, 0.16)} 0%, ${rgba(PT.chinaDim, 0.1)} 52%, rgba(0,0,0,0) 100%)` }} />
      <Glue f={f} thick={interpolate(p, [0.3, 1], [0.12, 0.7], { extrapolateLeft: "clamp" })} lit={0.9} />
      <div style={{ position: "absolute", left: "8%", top: "16%", width: "48%" }}>
        <Blocks
          at={20}
          stepEvery={34}
          items={[
            { t: "A STAIN IS DEAD.", size: 58 },
            { t: "THIS ISN'T A STAIN.", size: 58, gap: 8 },
            { t: "it's a colony", em: true, size: 96, gap: 12 },
          ]}
        />
      </div>
    </>
  );
};

const Act2: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01((f - B2) / (B3 - B2));
  return (
    <>
      <AbsoluteFill style={{ background: `linear-gradient(178deg, ${rgba(PT.china, 0.12)} 0%, rgba(0,0,0,0) 60%)` }} />
      <Glue f={f} thick={0.78} lit={1} />
      <Colony f={f - B2} n={34} alive={clamp01((p - 0.12) * 2.2)} y="52%" />
      <div style={{ position: "absolute", right: "7%", top: "18%", width: "38%" }}>
        <Blocks
          at={B2 + 24}
          stepEvery={34}
          items={[
            { t: "THEY BUILD A GLUE.", size: 52 },
            { t: "IT HOLDS WATER.", size: 40, gap: 12 },
            { t: "IT HOLDS FOOD.", size: 40 },
            { t: "it holds them to the wall", em: true, size: 58, gap: 12 },
          ]}
        />
      </div>
    </>
  );
};

const Act3: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01((f - B3) / (B4 - B3));
  // la gota de lejía cae, aterriza ARRIBA, se abre en disco y se queda ahí
  const drop = clamp01(p / 0.24);
  const spread = clamp01((p - 0.24) / 0.3);
  const bleached = clamp01((p - 0.42) / 0.34);
  return (
    <>
      <AbsoluteFill style={{ background: `linear-gradient(178deg, ${rgba(PT.china, 0.12)} 0%, rgba(0,0,0,0) 60%)` }} />
      <Glue f={f} thick={0.78} lit={1} />
      <Colony f={f - B2} n={34} alive={1 - bleached * 0.18} y="52%" />
      {/* el disco de lejía: ancho, finito, y NO baja */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: `${lerp(-18, 51, drop)}%`,
          transform: `translateX(-50%) scaleX(${1 + spread * 7}) scaleY(${1 - spread * 0.55})`,
          width: 120, height: 42, borderRadius: "50%",
          background: `radial-gradient(circle, ${rgba(MD.white, 0.9)} 0%, ${rgba("#CFE6F2", 0.5)} 60%, rgba(255,255,255,0) 76%)`,
          filter: "blur(0.6px)",
        }}
      />
      {/* el color se va, la estructura queda */}
      {bleached > 0 && (
        <div
          style={{
            position: "absolute", left: "-6%", right: "-6%", bottom: "26%", height: 96 * 0.78 + 24,
            background: `linear-gradient(180deg, ${rgba(MD.white, 0.5 * bleached)} 0%, ${rgba(MD.white, 0.06 * bleached)} 54%, rgba(255,255,255,0) 100%)`,
            mixBlendMode: "screen",
          }}
        />
      )}
      <div style={{ position: "absolute", left: "7%", top: "14%", width: "42%" }}>
        <Blocks
          at={B3 + 30}
          stepEvery={36}
          items={[
            { t: "BLEACH LANDS ON TOP.", size: 52 },
            { t: "IT BURNS THE COLOUR OFF.", size: 42, gap: 10 },
            { t: "and then it stops", em: true, size: 66, gap: 12 },
          ]}
        />
        <div style={{ marginTop: 26, ...glassStyle({ radius: 12 }), padding: "14px 18px", width: 470, opacity: clamp01((f - B3 - 190) / 22) }}>
          <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 20, letterSpacing: 2.4, color: MD.red }}>WHAT SURVIVES</div>
          <div style={{ fontFamily: F_SANS, fontWeight: 700, fontSize: 27, color: MD.white, marginTop: 5 }}>
            The colony inside the glue. And the glue.
          </div>
        </div>
      </div>
    </>
  );
};

const Act4: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01((f - B4) / (B5 - B4));
  const eat = clamp01((p - 0.14) / 0.62);
  return (
    <>
      <AbsoluteFill style={{ background: `linear-gradient(178deg, ${rgba(PT.china, 0.14)} 0%, rgba(0,0,0,0) 60%)` }} />
      <Glue f={f} thick={0.78} lit={1} broken={eat} />
      <Colony f={f - B2} n={34} alive={1 - eat} y="52%" />
      {/* el peróxido: frente fino que entra por izquierda y se mete ADENTRO */}
      <div
        style={{
          position: "absolute", left: `${lerp(-30, 104, clamp01(p / 0.5))}%`, bottom: "22%",
          width: "42%", height: 190,
          background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${rgba(MD.white, 0.30)} 62%, ${rgba(MD.white, 0.06)} 100%)`,
          filter: "blur(6px)",
          mixBlendMode: "screen",
        }}
      />
      {/* burbujas de oxígeno naciendo DENTRO de la cola */}
      {eat > 0 &&
        Array.from({ length: 40 }, (_, i) => {
          const s = rnd(i * 11.3);
          const k = ((f - B4) / (40 + s * 46) + s) % 1;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${3 + s * 92}%`,
                bottom: `${26 + k * 26}%`,
                width: 3 + s * 9, height: 3 + s * 9, borderRadius: "50%",
                border: `1.2px solid ${rgba(MD.white, (1 - k) * 0.55 * eat)}`,
              }}
            />
          );
        })}
      <div style={{ position: "absolute", right: "6%", top: "16%", width: "40%" }}>
        <Blocks
          at={B4 + 26}
          stepEvery={34}
          items={[
            { t: "PEROXIDE GOES", size: 48 },
            { t: "after the glue", em: true, size: 84, gap: 4 },
            { t: "IT BREAKS DOWN THE MATRIX — AND IT'S THIN LIKE WATER.", size: 26, gap: 20 },
          ]}
        />
      </div>
    </>
  );
};

const Act5: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01((f - B5) / (END - B5));
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(70% 60% at 50% 52%, ${rgba(PT.chinaDim, 0.12)} 0%, rgba(0,0,0,0) 72%)` }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "80%", textAlign: "center" }}>
          <Blocks
            at={B5 + 20}
            align="center"
            stepEvery={52}
            items={[
              { t: "BLEACH KILLS WHAT IT CAN TOUCH.", size: 56 },
              { t: "peroxide gets into what it can't", em: true, size: 78, gap: 18 },
            ]}
          />
        </div>
      </AbsoluteFill>
      {/* una línea roja que se dibuja debajo del remate */}
      <div
        style={{
          position: "absolute", left: "50%", bottom: "31%", transform: "translateX(-50%)",
          width: `${clamp01((p - 0.5) * 2.6) * 54}%`, height: 3,
          background: `linear-gradient(90deg, rgba(0,0,0,0), ${MD.red}, rgba(0,0,0,0))`,
          boxShadow: `0 0 22px ${rgba(MD.red, 0.7)}`,
        }}
      />
    </>
  );
};

export const MovBiofilm: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const f = Math.min(frame, END - 1);
  const t = clamp01(f / END);
  const tint = f < B4 ? light(clamp01(f / B4) * 0.9, "cold", "red") : light(clamp01((f - B4) / (END - B4)), "red", "cold");
  const out = clamp01((frame - (durationInFrames - 12)) / 12);
  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      <Atmos tint={tint} keyFrom={lerp(0.22, 0.62, t)} intensity={lerp(0.95, 1.06, Math.sin(t * Math.PI))} />
      <AbsoluteFill style={{ transform: CAMERA(f), transformStyle: "preserve-3d" }}>
        {f < B2 + 10 && <Act1 f={f} />}
        {f >= B2 && f < B3 + 10 && <Act2 f={f} />}
        {f >= B3 && f < B4 + 8 && <Act3 f={f} />}
        {f >= B4 && f < B5 + 8 && <Act4 f={f} />}
        {f >= B5 && <Act5 f={f} />}
      </AbsoluteFill>

      <Occluder at={B2 - 12} dur={16} color={PT.film} angle={-7} />
      <Occluder at={B3 - 10} dur={12} color={MD.ink2} angle={9} />
      <Occluder at={B4 - 14} dur={18} color="#DDEAF0" angle={-3} />
      <Sheen at={B5 + 90} dur={34} />
      {/* flash invertido corto en la frontera D */}
      {frame >= B5 - 8 && frame < B5 + 2 && (
        <AbsoluteFill style={{ background: rgba(MD.white, 0.5), mixBlendMode: "difference" }} />
      )}
      {out > 0 && <AbsoluteFill style={{ background: rgba(MD.ink0, out * 0.5) }} />}
    </AbsoluteFill>
  );
};
