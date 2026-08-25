// MovSiphon.tsx — MOVIMIENTO 1 · "NO EMPUJA, TIRA" · 1071 frames @30fps (35,7 s)
// Canal Mike Dalton (EN) · video `mdtoilet`.
//
// UN SOLO PLANO SECUENCIA. Una atmósfera montada una vez, una cámara que es función del frame
// GLOBAL y nunca vuelve a cero, una luz que viaja FRÍO → FRÍO-ALTO → ROJO BAJO, y una MATERIA
// que cruza todas las fronteras: EL AGUA. La misma agua que corona la curva en S (acto 1) es la
// que se traga la taza (acto 2), la que se rompe con el glú-glú (acto 3), la que sube por la
// porcelana hasta la pestaña (acto 4) y la que espera adentro del canal (acto 5).
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF — nada se reinicia entre actos
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · f0–200 · "LA CURVA SE LLENA"   (protagonista: la curva en S)
//   enterFrom  cam {z -280, panY +90, rx +5 — estamos abajo, mirando el caño desde el piso}
//              luz {FRÍO, key 0.20, intensidad 1.0}   materia {el frente de agua subiendo el caño}
//   exitTo     cam {z -60, panY +20}  luz {key 0.28}  materia {el agua CORONA la cresta}
//   ── FRONTERA A @192 · OCLUSIÓN POR MATERIA: la columna de agua cruza el cuadro ──
//
// ACTO 2 · f200–470 · "SE BEBE A SÍ MISMO"  (protagonista: la taza vaciándose)
//   enterFrom  cam {z -60}  luz {FRÍO alto}  materia {el arco de agua ya está armado}
//   exitTo     cam {z +120, ry -4}  luz {key 0.36}  materia {el último remolino}
//   ── FRONTERA B @452 · BURBUJAS: el aire entra y tapa el cuadro 6 frames ──
//
// ACTO 3 · f470–640 · "EL GLÚ-GLÚ"  (protagonista: el aire — el sonido dibujado)
//   enterFrom  cam {z +120}  luz {primer 12% de rojo}  materia {burbujas subiendo}
//   exitTo     cam {z +40, panY -140 — la cámara EMPIEZA A SUBIR por la porcelana}
//   ── FRONTERA C @624 · REENCUADRE: no hay corte, la cámara simplemente sigue subiendo ──
//
// ACTO 4 · f640–860 · "DE DÓNDE SALE"  (protagonista: el anillo de agujeros)
//   enterFrom  cam {panY -140, subiendo}  luz {FRÍO otra vez, key 0.44}
//   exitTo     cam {z +520 — la cámara se mete DENTRO de un agujero}
//   ── FRONTERA D @844 · ZOOM-THROUGH por el agujero del borde ──
//
// ACTO 5 · f860–1071 · "ADENTRO DEL CANAL"  (protagonista: el túnel)
//   enterFrom  cam {dentro del canal}  luz {ROJO BAJO, key 0.58}
//   exitTo     hold vivo + aberración cromática que prepara el corte al presentador
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import {
  MD, rgba, clamp01, lerp, rnd, cam, light, Atmos, Occluder, Sheen, glassStyle, F_SANS,
} from "../mdmold/Stage";
import { BowlCutaway, RimTunnel, Blocks, PT } from "./Porcelain";

const A1 = 0, A2 = 200, A3 = 470, A4 = 640, A5 = 860, END = 1071;

// ── la cámara del movimiento: una sola función del frame global ─────────────────────────────
const CAMERA = (f: number) => {
  // tramos que se encadenan: cada uno arranca donde terminó el anterior
  const z =
    f < A2 ? lerp(-280, -60, clamp01(f / A2)) :
    f < A3 ? lerp(-60, 120, clamp01((f - A2) / (A3 - A2))) :
    f < A4 ? lerp(120, 40, clamp01((f - A3) / (A4 - A3))) :
    f < A5 ? lerp(40, 520, Math.pow(clamp01((f - A4) / (A5 - A4)), 2.2)) :
             lerp(520, 610, clamp01((f - A5) / (END - A5)));
  const panY =
    f < A2 ? lerp(90, 20, clamp01(f / A2)) :
    f < A3 ? lerp(20, -10, clamp01((f - A2) / (A3 - A2))) :
    f < A4 ? lerp(-10, -140, clamp01((f - A3) / (A4 - A3))) :
    f < A5 ? lerp(-140, -196, clamp01((f - A4) / (A5 - A4))) :
             lerp(-196, -210, clamp01((f - A5) / (END - A5)));
  const ry = f < A3 ? 0 : lerp(0, -4.2, clamp01((f - A3) / 340));
  const rx = lerp(5, -1.5, clamp01(f / 900));
  const bx = Math.sin(f / 51) * 2.4 + Math.sin(f / 119) * 1.5;
  const by = Math.cos(f / 67) * 1.9;
  return `perspective(1400px) translateZ(${z.toFixed(2)}px) translate3d(${bx.toFixed(2)}px, ${(panY + by).toFixed(2)}px, 0) rotateY(${ry.toFixed(3)}deg) rotateX(${rx.toFixed(3)}deg)`;
};

// ── ACTO 1 ──────────────────────────────────────────────────────────────────────────────────
const Act1: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01(f / (A2 - 8));
  // el agua sube por el caño y corona la cresta justo al final del acto
  const trap = interpolate(p, [0, 0.86], [0.12, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0.5, 0, 0.3, 1) });
  const water = interpolate(p, [0, 0.9], [0.3, 0.62], { extrapolateRight: "clamp" });
  return (
    <>
      <div style={{ position: "absolute", left: "6%", top: "10%", width: "56%", height: "78%" }}>
        <BowlCutaway water={water} trap={trap} jetGlow={interpolate(p, [0, 0.5], [0, 0.9], { extrapolateRight: "clamp" })} />
      </div>
      <div style={{ position: "absolute", right: "5%", top: "27%", width: "34%" }}>
        <Blocks
          at={26}
          items={[
            { t: "NO PUMP.", size: 64 },
            { t: "NO MOTOR.", size: 64 },
            { t: "just a shape", em: true, size: 76, gap: 10 },
          ]}
        />
      </div>
      {/* la cresta: cuando el agua corona, un pulso blanco recorre el caño */}
      {p > 0.82 && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(40% 30% at 68% 44%, ${rgba(MD.white, (p - 0.82) * 1.6)} 0%, rgba(0,0,0,0) 70%)`,
            mixBlendMode: "screen",
          }}
        />
      )}
    </>
  );
};

// ── ACTO 2 ──────────────────────────────────────────────────────────────────────────────────
const Act2: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01((f - A2) / (A3 - A2 - 10));
  const water = interpolate(p, [0.06, 0.82], [0.62, 0.04], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.25, 1) });
  // las flechas de succión: nacen en la taza y se van por el caño
  const arrows = Array.from({ length: 7 }, (_, i) => {
    const k = ((f - A2) / 26 + i * 0.42) % 1;
    return { k, i };
  });
  return (
    <>
      <div style={{ position: "absolute", left: "6%", top: "10%", width: "56%", height: "78%" }}>
        <BowlCutaway water={water} trap={1} jetGlow={0.2} />
        {/* succión: cuñas que viajan por el caño */}
        <svg viewBox="0 0 640 560" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {arrows.map(({ k, i }) => {
            const o = Math.sin(k * Math.PI) * 0.85;
            const x = lerp(300, 506, k), y = lerp(360, 470, k) - Math.sin(k * Math.PI) * 120;
            return (
              <polygon
                key={i}
                points={`${x},${y - 12} ${x + 20},${y} ${x},${y + 12}`}
                fill={rgba(PT.water, o)}
                transform={`rotate(${lerp(-40, 78, k)} ${x} ${y})`}
              />
            );
          })}
        </svg>
      </div>
      <div style={{ position: "absolute", right: "5%", top: "24%", width: "36%" }}>
        <Blocks
          at={A2 + 22}
          stepEvery={30}
          items={[
            { t: "IT DOESN'T PUSH.", size: 58 },
            { t: "it pulls", em: true, size: 96, gap: 4 },
            { t: "THE BOWL DRINKS ITSELF EMPTY.", size: 30, gap: 20 },
          ]}
        />
      </div>
    </>
  );
};

// ── ACTO 3 ──────────────────────────────────────────────────────────────────────────────────
const Act3: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01((f - A3) / (A4 - A3));
  const bubbles = Array.from({ length: 22 }, (_, i) => {
    const s = rnd(i * 7.7);
    const k = ((f - A3) / (34 + s * 40) + s) % 1;
    return { s, k, i };
  });
  // la onda del sonido: el glú-glú dibujado, que se apaga
  const wave = Array.from({ length: 46 }, (_, i) => i);
  return (
    <>
      <div style={{ position: "absolute", left: "6%", top: "10%", width: "56%", height: "78%" }}>
        <BowlCutaway water={interpolate(p, [0, 0.5], [0.04, 0.26], { extrapolateRight: "clamp" })} trap={interpolate(p, [0, 0.6], [1, 0.2], { extrapolateRight: "clamp" })} />
        <svg viewBox="0 0 640 560" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {bubbles.map(({ s, k, i }) => (
            <circle
              key={i}
              cx={430 + Math.sin(k * 6 + i) * 26 + s * 40}
              cy={lerp(470, 300, k)}
              r={2 + s * 7}
              fill="none"
              stroke={rgba(MD.white, (1 - k) * 0.5)}
              strokeWidth={1.4}
            />
          ))}
        </svg>
      </div>
      <div style={{ position: "absolute", right: "5%", top: "30%", width: "36%" }}>
        <Blocks
          at={A3 + 16}
          stepEvery={26}
          items={[
            { t: "THAT GURGLE", size: 54 },
            { t: "is the siphon breaking", em: true, size: 62, gap: 6 },
          ]}
        />
        {/* la onda */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 30, height: 90 }}>
          {wave.map((i) => {
            const a = clamp01((f - A3 - 40 - i * 1.6) / 10);
            const decay = Math.max(0, 1 - (f - A3 - 60) / 90);
            const h = (10 + Math.abs(Math.sin(i * 0.7 + (f - A3) / 6)) * 62) * a * (0.25 + decay * 0.75);
            return (
              <div
                key={i}
                style={{
                  width: 4, height: Math.max(3, h), borderRadius: 2,
                  background: rgba(i % 3 === 0 ? MD.redHot : PT.water, 0.35 + a * 0.4),
                }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

// ── ACTO 4 ──────────────────────────────────────────────────────────────────────────────────
const Act4: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01((f - A4) / (A5 - A4));
  return (
    <>
      <div style={{ position: "absolute", left: "6%", top: "10%", width: "56%", height: "78%" }}>
        <BowlCutaway water={0.3} trap={0} jetGlow={interpolate(p, [0.1, 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} lit={1 + p * 0.2} />
      </div>
      {/* el anillo de agujeros, contado: cada uno se enciende y se numera */}
      <div style={{ position: "absolute", right: "5%", top: "22%", width: "36%" }}>
        <Blocks
          at={A4 + 14}
          stepEvery={30}
          items={[
            { t: "EVERY DROP", size: 56 },
            { t: "comes from here", em: true, size: 70, gap: 4 },
            { t: "A CHANNEL THE WIDTH OF YOUR FINGER", size: 26, gap: 22 },
          ]}
        />
        <div style={{ marginTop: 26, ...glassStyle({ radius: 14 }), padding: "16px 20px", width: 400, opacity: clamp01((f - A4 - 96) / 20) }}>
          <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 22, letterSpacing: 2.6, color: MD.red }}>UNDER THE RIM</div>
          <div style={{ fontFamily: F_SANS, fontWeight: 700, fontSize: 30, color: MD.white, marginTop: 6 }}>Dark · Wet · Warm · Never dries</div>
        </div>
      </div>
    </>
  );
};

// ── ACTO 5 ──────────────────────────────────────────────────────────────────────────────────
const Act5: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01((f - A5) / (END - A5));
  return (
    <>
      <RimTunnel depth={interpolate(p, [0, 1], [0, 0.8])} wet={1} film={interpolate(p, [0.25, 0.8], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} lightAt={interpolate(p, [0, 0.6], [0.1, 1], { extrapolateRight: "clamp" })} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "72%", textAlign: "center" }}>
          <Blocks
            at={A5 + 34}
            align="center"
            stepEvery={38}
            items={[
              { t: "NO BRUSH YOU HAVE EVER OWNED", size: 46 },
              { t: "has been in here", em: true, size: 92, gap: 6 },
            ]}
          />
        </div>
      </AbsoluteFill>
    </>
  );
};

export const MovSiphon: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const f = Math.min(frame, END - 1);
  const t = clamp01(f / END);
  // la luz viaja: fría (la ventanita) → fría alta → rojo bajo cuando entramos al canal
  const tint = f < A3 ? light(clamp01(f / A3) * 0.15, "cold", "warm") : light(clamp01((f - A3) / (END - A3)) * 0.8, "cold", "red");
  const keyFrom = lerp(0.2, 0.6, t);
  // aberración cromática de salida: prepara el corte al presentador
  const out = clamp01((frame - (durationInFrames - 14)) / 14);
  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      <Atmos tint={tint} keyFrom={keyFrom} intensity={lerp(1.0, 0.86, t)} />
      <AbsoluteFill style={{ transform: CAMERA(f), transformStyle: "preserve-3d" }}>
        {f < A2 + 10 && <Act1 f={f} />}
        {f >= A2 && f < A3 + 10 && <Act2 f={f} />}
        {f >= A3 && f < A4 + 8 && <Act3 f={f} />}
        {f >= A4 && f < A5 + 8 && <Act4 f={f} />}
        {f >= A5 && <Act5 f={f} />}
      </AbsoluteFill>

      {/* costuras */}
      <Occluder at={A2 - 8} dur={16} color={PT.waterDim} angle={-6} />
      <Occluder at={A3 - 10} dur={12} color={MD.ink2} angle={10} />
      <Occluder at={A5 - 10} dur={14} color={MD.ink1} angle={-4} />
      <Sheen at={A4 + 120} dur={30} />

      {out > 0 && (
        <>
          <AbsoluteFill style={{ background: rgba(MD.redHot, out * 0.16), mixBlendMode: "screen" }} />
          <AbsoluteFill style={{ backdropFilter: "none", boxShadow: `inset 0 0 ${out * 180}px ${out * 70}px rgba(0,0,0,0.7)` }} />
        </>
      )}
    </AbsoluteFill>
  );
};
