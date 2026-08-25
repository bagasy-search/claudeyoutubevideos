// MovSafety.tsx — MOVIMIENTO 5 · "LAS TRES QUE NO SE MEZCLAN" · 1837 frames (61,2 s)
// Canal Mike Dalton (EN) · video `mdtoilet`.
//
// Este movimiento es el único del video que NO juega. La regla del canal para advertencias es
// que se dicen DERECHAS: tipografía grande, contraste alto, cero ironía, cero adorno. La cámara
// casi no se mueve — el peso lo lleva el objeto y el color.
//
// MATERIA QUE CRUZA LAS FRONTERAS: **el frasco**. El pico angulado del gel es el mismo objeto
// que se inclina en el acto 2, el que queda al lado del charco en el 3, el que se aparta del
// vinagre en el 4 y el que se convierte en el frasco marrón del 5.
//
// ACTO 1 · f0–200    · "SAFETY"                    cam {z -140 → -60}
// ACTO 2 · f200–959  · REGLA UNO · GAS CLORO       cam {z -60 → +40}
//   ── FRONTERA A @944 · el gas verdoso barre y tapa el cuadro ──
// ACTO 3 · f959–1199 · REGLA UNO BIS · CLORAMINA   cam {z +40 → +90}
//   ── FRONTERA B @1186 · OCLUSIÓN por el frasco cruzando ──
// ACTO 4 · f1199–1531 · REGLA DOS · ÁCIDO PERACÉTICO cam {z +90 → +30, ry -4}
//   ── FRONTERA C @1516 · el frasco marrón entra desde abajo ──
// ACTO 5 · f1531–1837 · REGLA TRES · 3% Y NADA MÁS  hold vivo
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { MD, rgba, clamp01, lerp, rnd, Atmos, Occluder, glassStyle, F_SANS, F_SERIF } from "../mdmold/Stage";
import { Blocks, PT } from "./Porcelain";

const S1 = 0, S2 = 200, S3 = 959, S4 = 1199, S5 = 1531, END = 1837;
const GAS = "#B9D96B";

const CAMERA = (f: number) => {
  const z =
    f < S2 ? lerp(-140, -60, clamp01(f / S2)) :
    f < S3 ? lerp(-60, 40, clamp01((f - S2) / (S3 - S2))) :
    f < S4 ? lerp(40, 90, clamp01((f - S3) / (S4 - S3))) :
    f < S5 ? lerp(90, 30, clamp01((f - S4) / (S5 - S4))) :
             lerp(30, 72, clamp01((f - S5) / (END - S5)));
  const ry = f < S4 ? 0 : lerp(0, -4, clamp01((f - S4) / 400));
  const bx = Math.sin(f / 61) * 1.6;
  const by = Math.cos(f / 79) * 1.3;
  return `perspective(1400px) translateZ(${z.toFixed(2)}px) translate3d(${bx.toFixed(2)}px, ${by.toFixed(2)}px, 0) rotateY(${ry.toFixed(3)}deg)`;
};

// el rótulo de regla: una barra roja que se dibuja y sostiene el número
const RuleTag: React.FC<{ f: number; at: number; n: string; text: string }> = ({ f, at, n, text }) => {
  const a = clamp01((f - at) / 20);
  if (a <= 0) return null;
  const w = interpolate(clamp01((f - at) / 34), [0, 1], [0, 100]);
  return (
    <div style={{ position: "absolute", left: "7%", top: "13%", opacity: a }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 64, height: 64, background: MD.red, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, boxShadow: `0 0 40px ${rgba(MD.red, 0.5)}` }}>
          <span style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 38, color: MD.white }}>{n}</span>
        </div>
        <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 26, letterSpacing: 3.4, color: MD.white }}>{text}</div>
      </div>
      <div style={{ marginTop: 12, width: `${w * 5.4}px`, height: 3, background: MD.red, boxShadow: `0 0 18px ${rgba(MD.red, 0.7)}` }} />
    </div>
  );
};

// una botella genérica del baño, con pico angulado o cuello recto
const Bottle: React.FC<{ kind: "gel" | "bleach" | "vinegar" | "brown"; h?: number; tilt?: number }> = ({ kind, h = 300, tilt = 0 }) => {
  const body =
    kind === "gel" ? "#2E6E5A" :
    kind === "bleach" ? "#E9EDF0" :
    kind === "vinegar" ? "#D8D3C4" : "#5A3A22";
  const label = kind === "gel" ? "BOWL CLEANER" : kind === "bleach" ? "BLEACH" : kind === "vinegar" ? "VINEGAR" : "3% H₂O₂";
  return (
    <div style={{ width: h * 0.42, height: h, transform: `rotate(${tilt}deg)`, position: "relative" }}>
      {/* cuello */}
      <div
        style={{
          position: "absolute", left: kind === "gel" ? "8%" : "34%", top: 0,
          width: "32%", height: "22%",
          transform: kind === "gel" ? "rotate(-32deg)" : "none",
          transformOrigin: "bottom right",
          background: `linear-gradient(180deg, ${rgba(body, 0.95)} 0%, ${rgba(body, 0.7)} 100%)`,
          borderRadius: "8px 8px 0 0",
        }}
      />
      {/* cuerpo */}
      <div
        style={{
          position: "absolute", left: 0, right: 0, top: "20%", bottom: 0,
          borderRadius: "14px 14px 18px 18px",
          background: `linear-gradient(100deg, ${rgba(body, 0.98)} 0%, ${rgba(body, 0.72)} 52%, ${rgba("#0B0C0E", 0.5)} 100%)`,
          boxShadow: "inset 0 3px 0 rgba(255,255,255,0.28), 0 30px 60px rgba(0,0,0,0.68)",
        }}
      />
      {/* etiqueta */}
      <div
        style={{
          position: "absolute", left: "8%", right: "8%", top: "44%", padding: "10px 0",
          background: rgba(MD.white, 0.92), borderRadius: 4, textAlign: "center",
        }}
      >
        <span style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 15, letterSpacing: 1, color: "#15171A" }}>{label}</span>
      </div>
    </div>
  );
};

const Act1: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <div style={{ textAlign: "center" }}>
      <Blocks at={12} align="center" stepEvery={40} items={[{ t: "SAFETY.", size: 108 }, { t: "NO JOKES.", size: 46, gap: 12 }]} />
    </div>
  </AbsoluteFill>
);

const Act2: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01((f - S2) / (S3 - S2));
  const pour = clamp01((p - 0.32) / 0.2);
  const gas = clamp01((p - 0.52) / 0.34);
  return (
    <>
      <RuleTag f={f} at={S2 + 10} n="1" text="NEVER MIX" />
      {/* el gel a la izquierda, la lejía a la derecha, la taza abajo en el medio */}
      <div style={{ position: "absolute", left: "16%", top: "34%" }}>
        <Bottle kind="gel" h={310} tilt={interpolate(clamp01((p - 0.14) / 0.16), [0, 1], [0, -26])} />
      </div>
      <div style={{ position: "absolute", right: "18%", top: "30%" }}>
        <Bottle kind="bleach" h={340} tilt={interpolate(pour, [0, 1], [0, 34])} />
      </div>
      {/* la taza */}
      <div
        style={{
          position: "absolute", left: "50%", bottom: "8%", transform: "translateX(-50%)",
          width: 420, height: 200,
          borderRadius: "46% 46% 26% 26% / 58% 58% 34% 34%",
          background: `linear-gradient(180deg, ${rgba(PT.china, 0.42)} 0%, ${rgba("#16181B", 0.92)} 100%)`,
          boxShadow: "0 30px 70px rgba(0,0,0,0.7)",
        }}
      />
      {/* el gas: sube de la taza y se abre */}
      {gas > 0 &&
        Array.from({ length: 34 }, (_, i) => {
          const s = rnd(i * 4.9);
          const k = ((f - S2) / (60 + s * 70) + s) % 1;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${42 + (s - 0.5) * 26 + Math.sin(k * 5 + i) * 8}%`,
                bottom: `${10 + k * 62}%`,
                width: 40 + s * 130, height: 30 + s * 90, borderRadius: "50%",
                background: `radial-gradient(circle, ${rgba(GAS, 0.16 * gas * (1 - k))} 0%, rgba(0,0,0,0) 70%)`,
                filter: "blur(3px)",
              }}
            />
          );
        })}
      <div style={{ position: "absolute", left: "6%", bottom: "16%", width: "40%" }}>
        <Blocks
          at={S2 + 60}
          stepEvery={56}
          items={[
            { t: "THE GEL IS ACID.", size: 46 },
            { t: "BLEACH ON TOP OF ACID", size: 40, gap: 10 },
            { t: "makes chlorine gas", em: true, size: 74, gap: 8 },
          ]}
        />
      </div>
      {/* la secuencia real, en cuatro pasos secos */}
      <div style={{ position: "absolute", right: "5%", bottom: "14%", width: 470, opacity: clamp01((f - S2 - 340) / 26) }}>
        <div style={{ ...glassStyle({ radius: 14 }), padding: "18px 22px" }}>
          <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 19, letterSpacing: 2.6, color: MD.red, marginBottom: 10 }}>
            HOW IT ACTUALLY HAPPENS
          </div>
          {["They clean with the gel", "It doesn't look clean enough", "They pour bleach on top", "Nobody flushed first"].map((s, i) => {
            const a = clamp01((f - S2 - 360 - i * 44) / 20);
            return (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "baseline", opacity: a, marginTop: 8 }}>
                <span style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 20, color: i === 3 ? MD.redHot : rgba(MD.white, 0.45) }}>{i + 1}</span>
                <span style={{ fontFamily: F_SANS, fontWeight: 700, fontSize: 25, color: i === 3 ? MD.redHot : MD.white }}>{s}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

const Act3: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01((f - S3) / (S4 - S3));
  return (
    <>
      <RuleTag f={f} at={S3 + 6} n="1" text="AND THE SAME RULE, TWICE" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
          <div style={{ ...glassStyle({ radius: 16 }), padding: "26px 34px", textAlign: "center" }}>
            <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 19, letterSpacing: 2.4, color: rgba(MD.white, 0.6) }}>IN THE BOWL</div>
            <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 54, color: MD.white }}>URINE</div>
            <div style={{ fontFamily: F_SERIF, fontStyle: "italic", fontSize: 30, color: PT.filmLit, marginTop: 4 }}>ammonia</div>
          </div>
          <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 62, color: MD.red, opacity: clamp01((p - 0.2) * 3) }}>+</div>
          <div style={{ ...glassStyle({ radius: 16 }), padding: "26px 34px", textAlign: "center", opacity: clamp01((p - 0.26) * 3) }}>
            <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 19, letterSpacing: 2.4, color: rgba(MD.white, 0.6) }}>POURED IN</div>
            <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 54, color: MD.white }}>BLEACH</div>
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: "18%" }}>
        <div style={{ textAlign: "center" }}>
          <Blocks at={S3 + 96} align="center" stepEvery={40} items={[{ t: "CHLORAMINE.", size: 84 }]} />
        </div>
      </AbsoluteFill>
    </>
  );
};

const Act4: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01((f - S4) / (S5 - S4));
  const apart = clamp01((p - 0.2) / 0.4);
  return (
    <>
      <RuleTag f={f} at={S4 + 8} n="2" text="NEVER STORE THEM TOGETHER" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: lerp(40, 420, apart) }}>
          <Bottle kind="brown" h={300} />
          <Bottle kind="vinegar" h={300} />
        </div>
      </AbsoluteFill>
      {/* el frasco cerrado que se hincha: lo que pasa si los casás con la tapa puesta */}
      <div
        style={{
          position: "absolute", left: "50%", top: "46%", transform: `translate(-50%,-50%) scale(${1 + Math.sin(f / 9) * 0.03 * (1 - apart)})`,
          opacity: 1 - apart,
          width: 150, height: 210, borderRadius: 18,
          background: `linear-gradient(120deg, ${rgba("#8A8F79", 0.9)} 0%, ${rgba("#3A3E33", 0.9)} 100%)`,
          boxShadow: `0 0 ${40 + Math.sin(f / 9) * 20}px ${rgba(MD.red, 0.4)}`,
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: "16%" }}>
        <div style={{ textAlign: "center", maxWidth: "70%" }}>
          <Blocks
            at={S4 + 70}
            align="center"
            stepEvery={48}
            items={[
              { t: "PEROXIDE + VINEGAR IN A CAPPED BOTTLE", size: 38 },
              { t: "peracetic acid", em: true, size: 78, gap: 8 },
              { t: "USE ONE. RINSE. USE THE OTHER.", size: 26, gap: 16 },
            ]}
          />
        </div>
      </AbsoluteFill>
    </>
  );
};

const Act5: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01((f - S5) / (END - S5));
  return (
    <>
      <RuleTag f={f} at={S5 + 8} n="3" text="THE ONLY ONE YOU NEED" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 120 }}>
          <div style={{ textAlign: "center", transform: `scale(${lerp(0.9, 1.06, clamp01(p * 2))})` }}>
            <Bottle kind="brown" h={340} />
            <div style={{ marginTop: 16, fontFamily: F_SANS, fontWeight: 900, fontSize: 46, color: MD.white }}>3%</div>
            <div style={{ fontFamily: F_SANS, fontWeight: 700, fontSize: 24, color: rgba(MD.white, 0.7) }}>the brown drugstore bottle</div>
          </div>
          <div style={{ textAlign: "center", opacity: clamp01(1 - p * 1.6) * 0.7, filter: `grayscale(${p})` }}>
            <Bottle kind="bleach" h={300} />
            <div style={{ marginTop: 16, fontFamily: F_SANS, fontWeight: 900, fontSize: 46, color: MD.red }}>35%</div>
            <div style={{ fontFamily: F_SANS, fontWeight: 700, fontSize: 24, color: rgba(MD.white, 0.55) }}>that one is a burn</div>
          </div>
        </div>
      </AbsoluteFill>
      {p > 0.42 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: "10%" }}>
          <div style={{ textAlign: "center" }}>
            <Blocks at={S5 + 140} align="center" stepEvery={40} items={[{ t: "there is no job here that needs the other one", em: true, size: 56 }]} />
          </div>
        </AbsoluteFill>
      )}
    </>
  );
};

export const MovSafety: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const f = Math.min(frame, END - 1);
  const out = clamp01((frame - (durationInFrames - 12)) / 12);
  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      <Atmos tint={MD.red} keyFrom={0.32} intensity={0.72} />
      <AbsoluteFill style={{ transform: CAMERA(f), transformStyle: "preserve-3d" }}>
        {f < S2 + 20 && <Act1 f={f} />}
        {f >= S2 && f < S3 + 8 && <Act2 f={f} />}
        {f >= S3 && f < S4 + 8 && <Act3 f={f} />}
        {f >= S4 && f < S5 + 8 && <Act4 f={f} />}
        {f >= S5 && <Act5 f={f} />}
      </AbsoluteFill>
      <Occluder at={S3 - 16} dur={18} color={GAS} angle={-4} />
      <Occluder at={S4 - 14} dur={14} color={MD.ink2} angle={6} />
      <Occluder at={S5 - 14} dur={14} color="#5A3A22" angle={-6} />
      {out > 0 && <AbsoluteFill style={{ background: rgba(MD.ink0, out * 0.4) }} />}
    </AbsoluteFill>
  );
};
