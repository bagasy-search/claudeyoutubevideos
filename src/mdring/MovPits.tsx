// MovPits.tsx — MOVIMIENTO 1 · "NO ESTÁS LIMPIANDO UNA SUPERFICIE" · 1200 frames @30fps (40 s)
// Canal Mike Dalton (EN) · video `mdring`.
//
// UN SOLO PLANO SECUENCIA. La MATERIA que cruza las cinco fronteras es LA SUPERFICIE DEL ESMALTE:
// la misma placa de vidrio que en el acto 1 es un espejo perfecto es la que en el acto 2 se llena
// de cráteres bajo la luz rasante, la que en el acto 3 nos traga por uno de esos cráteres, la que
// en el acto 4 recibe la cerda del cepillo por arriba, y la que en el acto 5 se aleja hasta
// mostrarse como la banda entera de la línea de agua.
//
// La CÁMARA nunca vuelve a cero: arranca rasante y baja (rx +9 → 0 → −6) mientras empuja
// z −340 → +980 sin retroceder jamás, salvo el pull-back final que es parte del acto 5.
// La LUZ viaja FRÍO → FRÍO ALTO → ROJO BAJO (adentro del cráter) → FRÍO otra vez.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF — nada se reinicia entre actos
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · f0–230 · "ES VIDRIO"            (protagonista: el brillo especular)
//   enterFrom cam {z −340, rx +9 — rasante, casi a ras de la placa}  luz {FRÍO, key 0.18}
//             materia {placa espejada, una gota roja que entra y RESBALA}
//   exitTo    cam {z −120, rx +4}  luz {key 0.26}  materia {la gota sale de cuadro por derecha}
//   ── FRONTERA A @214 · OCLUSIÓN POR MATERIA: la estela de la gota cruza el cuadro ──
//
// ACTO 2 · f230–520 · "LA SUPERFICIE DE LA LUNA"   (protagonista: los cráteres)
//   enterFrom cam {z −120, rx +4}  luz {FRÍO ALTO — la luz RASA y los cráteres nacen de su sombra}
//   exitTo    cam {z +180, panX −120}  materia {un cráter queda centrado y creciendo}
//   ── FRONTERA B @504 · ZOOM-THROUGH: la boca del cráter se come el cuadro ──
//
// ACTO 3 · f520–800 · "VIVE ADENTRO"       (protagonista: el interior del cráter)
//   enterFrom cam {dentro del cráter}  luz {ROJO BAJO}  materia {la colonia en el fondo}
//   exitTo    cam {saliendo, z +420}  luz {rojo cediendo}  materia {la boca del cráter arriba}
//   ── FRONTERA C @784 · REENCUADRE: la cámara sale y sigue subiendo, sin corte ──
//
// ACTO 4 · f800–1030 · "EL CEPILLO SOLO TOCA LA PUNTA"  (protagonista: la cerda)
//   enterFrom cam {z +420, rx −2}  luz {FRÍO}  materia {la cerda barre las crestas}
//   exitTo    cam {z +700}  materia {el rojo SIGUE en los pozos, intacto}
//   ── FRONTERA D @1014 · OCLUSIÓN: la cerda barre el cuadro entero ──
//
// ACTO 5 · f1030–1200 · "ESTÁS CORTANDO EL PASTO"  (protagonista: la banda completa)
//   enterFrom cam {z +700}  exitTo {pull-back a z +980 + aberración cromática que prepara el corte}
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import {
  MD, rgba, clamp01, lerp, eio, rnd, cam, light, Atmos, Occluder, Sheen, TextBed, Kicker, Title, Em, F_SANS,
} from "../mdmold/Stage";

const A1 = 0, A2 = 230, A3 = 520, A4 = 800, A5 = 1030, END = 1200;

// ── LOS CRÁTERES ────────────────────────────────────────────────────────────────────────────
// Se siembran UNA vez (posiciones deterministas) y son los MISMOS en los actos 2, 4 y 5. Esa
// permanencia es lo que hace que se lea como una sola superficie y no como tres ilustraciones.
const PITS = Array.from({ length: 46 }, (_, i) => ({
  x: 6 + rnd(i * 3.1) * 88,
  y: 18 + rnd(i * 7.7 + 2) * 64,
  r: 10 + rnd(i * 2.3 + 5) * 26,
  d: 0.35 + rnd(i * 5.9 + 1) * 0.65, // profundidad relativa → cuánto rojo aguanta
  born: Math.floor(rnd(i * 11.3 + 4) * 120), // aparecen escalonados cuando la luz rasa
}));

// El cráter protagonista, el que la cámara atraviesa en la frontera B.
const HERO = { x: 52, y: 46, r: 30 };

const Glaze: React.FC<{
  frame: number;
  pitted: number;   // 0 = espejo perfecto · 1 = luna
  rake: number;     // cuánto rasa la luz (define la sombra de cada cráter)
  redInPits: number;
  tint: string;
}> = ({ frame, pitted, rake, redInPits, tint }) => (
  <AbsoluteFill>
    {/* la placa: vidrio blanco frío, no blanco papel */}
    <AbsoluteFill
      style={{
        background:
          `linear-gradient(168deg, ${rgba(MD.white, 0.90)} 0%, ${rgba(tint, 0.42)} 38%, ` +
          `${rgba(MD.ink2, 0.86)} 78%, ${rgba(MD.ink0, 0.96)} 100%)`,
      }}
    />
    {/* el especular que PRUEBA que es vidrio — se estira cuando la luz rasa */}
    <AbsoluteFill
      style={{
        background:
          `linear-gradient(${(100 + rake * 30).toFixed(1)}deg, rgba(255,255,255,0) 34%, ` +
          `${rgba(MD.white, 0.30 + 0.34 * (1 - pitted))} 47%, rgba(255,255,255,0) 60%)`,
        mixBlendMode: "screen",
        opacity: 0.55 + 0.45 * (1 - pitted * 0.5),
      }}
    />
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id="pitWall" cx="38%" cy="30%">
          <stop offset="0%" stopColor={rgba(MD.ink0, 0.0)} />
          <stop offset="58%" stopColor={rgba(MD.ink0, 0.55)} />
          <stop offset="100%" stopColor={rgba(MD.ink0, 0.92)} />
        </radialGradient>
      </defs>
      {PITS.map((p, i) => {
        const grow = clamp01((frame - p.born) / 46) * pitted;
        if (grow <= 0.01) return null;
        const rr = (p.r / 10) * grow;
        // la sombra se alarga en la dirección opuesta a la luz: es lo que los hace LEER como huecos
        const off = rr * 0.42 * rake;
        return (
          <g key={i} opacity={grow}>
            <ellipse cx={p.x + off} cy={p.y + off * 0.6} rx={rr * 1.06} ry={rr * 0.74} fill={rgba(MD.ink0, 0.34 * rake)} />
            <ellipse cx={p.x} cy={p.y} rx={rr} ry={rr * 0.7} fill="url(#pitWall)" />
            {redInPits > 0 && (
              <ellipse
                cx={p.x} cy={p.y + rr * 0.16}
                rx={rr * 0.62 * p.d} ry={rr * 0.42 * p.d}
                fill={rgba(MD.red, 0.30 + 0.5 * redInPits * p.d)}
              />
            )}
            {/* borde iluminado del labio del cráter: sin esto parecen manchas, no huecos */}
            <ellipse
              cx={p.x - off * 0.5} cy={p.y - rr * 0.34} rx={rr * 0.9} ry={rr * 0.26}
              fill="none" stroke={rgba(MD.white, 0.22 * rake)} strokeWidth={0.22}
            />
          </g>
        );
      })}
    </svg>
  </AbsoluteFill>
);

export const MovPits: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const f = Math.min(frame, END);
  const T = clamp01(f / END);

  // ── LA CÁMARA: una sola función del frame global, monótona hasta el acto 5 ──
  const C = cam(f, { z0: -340, z1: 700, rx: -15, panX: -120, dur: A5 });
  const pull = f > A5 ? eio(0, 280, clamp01((f - A5) / (END - A5))) : 0;
  const camT = `${C.transform} translateZ(${pull.toFixed(1)}px)`;

  // ── LA LUZ: FRÍO → FRÍO ALTO → ROJO (dentro) → FRÍO ──
  const redPhase = clamp01((f - A3 + 40) / 90) * (1 - clamp01((f - A4 + 20) / 110));
  const tint = light(redPhase, "cold", "red");
  const keyPos = interpolate(f, [A1, A2, A3, A5, END], [0.18, 0.30, 0.62, 0.34, 0.28], { extrapolateRight: "clamp" });
  const intensity = interpolate(f, [A1, A2, A3, A4, END], [0.9, 1.25, 0.7, 1.1, 1.0], { extrapolateRight: "clamp" });

  // ── LA MATERIA ──
  const pitted = clamp01((f - A2 + 10) / 150);                 // los cráteres NACEN, no aparecen
  const rake = interpolate(f, [A1, A2, A2 + 120, END], [0.15, 0.9, 1, 0.8], { extrapolateRight: "clamp" });
  const redInPits = clamp01((f - A3 - 30) / 90);

  // la gota del acto 1: entra, no encuentra dónde agarrarse, y se va
  const dropP = clamp01((f - 46) / 170);
  const dropX = lerp(-8, 118, eio(0, 1, dropP));
  const dropY = 40 + Math.sin(dropP * 2.4) * 6 + dropP * 12;

  // el cráter protagonista come el cuadro en la frontera B
  const zoomThrough = clamp01((f - (A3 - 90)) / 90);
  const heroScale = 1 + zoomThrough * 16;

  // la cerda del acto 4: barre por las CRESTAS, arquea sobre los pozos
  const bristleP = clamp01((f - A4 - 30) / 150);
  const bristleX = lerp(-20, 120, eio(0, 1, bristleP));

  // salida: aberración cromática que prepara el corte al presentador
  const ab = clamp01((f - (END - 34)) / 34);

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      <Atmos tint={tint} keyFrom={keyPos} intensity={intensity} />

      <AbsoluteFill style={{ transform: camT, transformOrigin: "52% 46%" }}>
        {/* dentro del cráter (acto 3) la placa se ve desde ABAJO: se invierte el orden de capas */}
        <AbsoluteFill
          style={{
            transform: `scale(${heroScale.toFixed(3)}) translate(${((50 - HERO.x) * zoomThrough).toFixed(2)}%, ${((50 - HERO.y) * zoomThrough).toFixed(2)}%)`,
            transformOrigin: `${HERO.x}% ${HERO.y}%`,
            opacity: f > A4 + 40 ? clamp01(1 - (f - A4 - 40) / 60) * 0 + 1 : 1,
          }}
        >
          <Glaze frame={f} pitted={pitted} rake={rake} redInPits={redInPits} tint={tint} />
        </AbsoluteFill>

        {/* ACTO 1 · la gota que resbala */}
        {f < A2 + 30 && (
          <div
            style={{
              position: "absolute", left: `${dropX}%`, top: `${dropY}%`,
              width: 46, height: 30, borderRadius: "50%",
              background: `radial-gradient(60% 60% at 36% 30%, ${rgba(MD.redHot, 0.95)}, ${rgba(MD.red, 0.72)})`,
              boxShadow: `0 6px 22px ${rgba(MD.red, 0.5)}`,
              opacity: clamp01(dropP * 6) * clamp01((1 - dropP) * 5),
              filter: "blur(0.4px)",
            }}
          />
        )}

        {/* ACTO 4 · la cerda: solo TOCA las crestas */}
        {f > A4 && f < A5 + 40 && (
          <div
            style={{
              position: "absolute", left: `${bristleX}%`, top: "26%",
              width: 8, height: "38%", borderRadius: 6,
              background: `linear-gradient(180deg, ${rgba(MD.bone, 0.9)}, ${rgba(MD.bone, 0.35)})`,
              transform: `rotate(${(-14 + Math.sin(bristleP * 12) * 5).toFixed(2)}deg)`,
              boxShadow: `0 10px 30px ${rgba(MD.ink0, 0.7)}`,
              opacity: clamp01(bristleP * 8) * clamp01((1 - bristleP) * 4),
            }}
          />
        )}
      </AbsoluteFill>

      <Sheen at={A2 + 40} dur={30} angle={22} />
      <Sheen at={A4 + 90} dur={26} angle={-12} />

      {/* ── COSTURAS ── */}
      <Occluder at={A2 - 16} dur={16} color={MD.ink1} angle={10} />
      <Occluder at={A4 - 16} dur={14} color={MD.ink2} angle={-8} />
      <Occluder at={A5 - 16} dur={14} color={MD.ink1} angle={6} />

      {/* ── EL TEXTO: bloques semánticos, nunca todo junto ── */}
      <AbsoluteFill style={{ padding: 96, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        {f < A2 && (
          <div style={{ opacity: clamp01((f - 60) / 22) * clamp01((A2 - f) / 26), maxWidth: 1180 }}>
            <TextBed>
              <Kicker>Porcelain is not porcelain</Kicker>
              <Title size={78}>It is <Em>glass</Em>.</Title>
            </TextBed>
          </div>
        )}
        {f >= A2 && f < A3 && (
          <div style={{ opacity: clamp01((f - A2 - 30) / 24) * clamp01((A3 - f) / 26), maxWidth: 1240 }}>
            <TextBed>
              <Kicker>Under the light, at the waterline</Kicker>
              <Title size={72}>It looked like the surface of the <Em>moon</Em>.</Title>
            </TextBed>
          </div>
        )}
        {f >= A3 + 60 && f < A4 && (
          <div style={{ opacity: clamp01((f - A3 - 80) / 24) * clamp01((A4 - f) / 26), maxWidth: 1160 }}>
            <TextBed>
              <Title size={70}>A stain sits on top of something.</Title>
              <Title size={70}>This <Em>lives inside</Em> something.</Title>
            </TextBed>
          </div>
        )}
        {f >= A4 + 60 && f < A5 && (
          <div style={{ opacity: clamp01((f - A4 - 70) / 24) * clamp01((A5 - f) / 26), maxWidth: 1200 }}>
            <TextBed>
              <Title size={72}>A brush only reaches <Em>the top</Em>.</Title>
            </TextBed>
          </div>
        )}
        {f >= A5 && (
          <div style={{ opacity: clamp01((f - A5 - 24) / 26), maxWidth: 1280 }}>
            <TextBed>
              <Kicker>That is the whole mystery</Kicker>
              <Title size={76}>You are not cleaning a surface.</Title>
              <Title size={76}>You are <Em>mowing a lawn</Em>.</Title>
            </TextBed>
          </div>
        )}
      </AbsoluteFill>

      {/* SALIDA: la aberración empieza ANTES del corte */}
      {ab > 0 && (
        <>
          <AbsoluteFill style={{ background: rgba(MD.red, 0.10 * ab), mixBlendMode: "screen" }} />
          <AbsoluteFill style={{ backdropFilter: `blur(${(ab * 5).toFixed(2)}px)` }} />
        </>
      )}
      {/* grano constante: la misma piel de imagen en los cinco actos */}
      <AbsoluteFill
        style={{
          opacity: 0.055,
          backgroundImage:
            "repeating-conic-gradient(rgba(255,255,255,.5) 0% 25%, rgba(0,0,0,.5) 0% 50%)",
          backgroundSize: "3px 3px",
          mixBlendMode: "overlay",
        }}
      />
    </AbsoluteFill>
  );
};

export const MOVPITS_FRAMES = END;
