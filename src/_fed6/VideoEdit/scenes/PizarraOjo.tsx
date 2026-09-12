import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ── PizarraOjo (versión PROFESIONAL / limpia) ────────────────────────────────
// Explainer médico sobrio: UN sujeto grande (ojo en corte) + una columna de texto
// que avanza por PASOS. Solo se enfatiza lo que se está explicando; lo anterior se
// atenúa. Paleta mínima (tinta + teal + coral). Una sola tipografía. Movimiento
// sobrio: un trazo que se dibuja + fundidos. El avatar NO va: ocupa todo el cuadro.

const INTER = loadInter().fontFamily;
const C = {
  bg: "#F7FAFB",
  ink: "#152430",
  sub: "#5A6B76",
  teal: "#0E9C99",
  tealDim: "#BFE3E2",
  coral: "#E0523E",
  line: "#DCE6EA",
};

const draw = (frame: number, a: number, b: number) =>
  interpolate(frame, [a, b], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const fade = (frame: number, a: number, b: number) =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// 3 pasos: [entra, sale]. El activo va full, los pasados se atenúan.
const STEPS = [
  { n: "1", head: "La retina necesita oxígeno", body: "Es el tejido del ojo que más oxígeno consume. Se lo llevan unos capilares finísimos.", at: 40 },
  { n: "2", head: "De noche llega menos", body: "Al dormir, la presión baja y el flujo se vuelve lento. Si falta oxígeno, la retina no se repara.", at: 130 },
  { n: "3", head: "El óxido nítrico lo abre", body: "Esta molécula ensancha los capilares y deja pasar más oxígeno. Después de los 60 se produce menos.", at: 220 },
];

export const PizarraOjo: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const active = STEPS.reduce((acc, s, i) => (frame >= s.at ? i : acc), 0);

  // pulso de oxígeno MUY sutil por el capilar (solo en paso 2+)
  const pulseT = ((frame - 130) % 55) / 55;
  const showPulse = frame >= 130;

  // resaltado del capilar abierto (paso 3)
  const openK = fade(frame, 226, 252);

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: INTER }}>
      {/* etiqueta de sección (chiquita, arriba) */}
      <div style={{ position: "absolute", top: 70, left: 96, opacity: fade(frame, 4, 20) }}>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.teal }}>
          El mecanismo
        </div>
        <div style={{ fontSize: 52, fontWeight: 800, color: C.ink, marginTop: 8, letterSpacing: -0.5 }}>
          Por qué se te nubla la vista de noche
        </div>
      </div>

      {/* ── OJO EN CORTE (izquierda) ── */}
      <svg viewBox="0 0 960 1080" width="50%" height="100%" style={{ position: "absolute", left: 40, top: 40 }}>
        <g transform="translate(470 560)">
          {/* globo ocular, trazo limpio que se dibuja una vez */}
          <circle cx="0" cy="0" r="250" fill="#FFFFFF" stroke={C.ink} strokeWidth="5"
            strokeDasharray="1571" strokeDashoffset={draw(frame, 16, 66) * 1571} />
          {/* córnea al frente */}
          <path d="M -250 -78 Q -326 0 -250 78" fill="#FFFFFF" stroke={C.ink} strokeWidth="5"
            strokeDasharray="250" strokeDashoffset={draw(frame, 34, 66) * 250} />
          {/* lente */}
          <ellipse cx="-222" cy="0" rx="30" ry="70" fill={C.tealDim} stroke={C.ink} strokeWidth="3"
            opacity={fade(frame, 56, 80) * 0.9} />
          {/* RETINA (arco al fondo) — se resalta en el paso 1 y queda tenue después */}
          <path d="M 66 -224 A 236 236 0 0 1 66 224" fill="none" stroke={C.teal}
            strokeWidth="14" strokeLinecap="round"
            strokeDasharray="770" strokeDashoffset={draw(frame, 44, 84) * 770}
            opacity={active === 0 ? 1 : 0.4} />
          {/* fóvea */}
          <circle cx="238" cy="0" r="9" fill={C.teal} opacity={fade(frame, 70, 90) * (active === 0 ? 1 : 0.4)} />
          {/* nervio óptico */}
          <path d="M 234 44 Q 320 78 360 132" fill="none" stroke={C.ink} strokeWidth="5"
            strokeDasharray="190" strokeDashoffset={draw(frame, 78, 100) * 190} />

          {/* CAPILAR que alimenta la retina (paso 2+) */}
          <path id="cap" d="M -40 130 C 120 60, 230 20, 250 -60" fill="none"
            stroke={active >= 2 ? C.teal : C.coral} strokeWidth={interpolate(openK, [0, 1], [4, 9])}
            strokeLinecap="round" opacity={fade(frame, 96, 124)} />
          {/* pulso de O2 sutil, un solo punto lento */}
          {showPulse && (() => {
            const x = interpolate(pulseT, [0, 1], [-40, 250]);
            const y = interpolate(pulseT, [0, 1], [130, -60]);
            const op = pulseT < 0.15 ? pulseT / 0.15 : pulseT > 0.85 ? (1 - pulseT) / 0.15 : 1;
            return <circle cx={x} cy={y} r="8" fill={active >= 2 ? C.teal : C.coral} opacity={op * 0.9} />;
          })()}
        </g>
      </svg>

      {/* flecha "menos O2 de noche" — solo paso 2, en coral, sobrio */}
      <div style={{
        position: "absolute", left: 560, top: 300,
        opacity: active === 1 ? fade(frame, 132, 150) : interpolate(frame, [214, 230], [active === 1 ? 1 : 0, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: C.coral, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 40 }}>↓</span> menos oxígeno
        </div>
      </div>

      {/* ── COLUMNA DE PASOS (derecha) ── */}
      <div style={{ position: "absolute", right: 110, top: 300, width: 640 }}>
        {STEPS.map((s, i) => {
          const isActive = i === active;
          const isDone = i < active;
          const app = spring({ frame: frame - s.at, fps, config: { damping: 18, stiffness: 110 } });
          if (frame < s.at - 6) return null;
          const op = isActive ? 1 : isDone ? 0.32 : 1;
          return (
            <div key={i} style={{
              display: "flex", gap: 24, marginBottom: 46,
              opacity: op * app, transform: `translateY(${interpolate(app, [0, 1], [16, 0])}px)`,
            }}>
              <div style={{
                flex: "0 0 auto", width: 56, height: 56, borderRadius: 30,
                background: isActive ? C.teal : "#FFFFFF", border: `2px solid ${C.teal}`,
                color: isActive ? "#FFFFFF" : C.teal, fontWeight: 800, fontSize: 26,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{s.n}</div>
              <div>
                <div style={{ fontSize: 40, fontWeight: 800, color: C.ink, lineHeight: 1.1 }}>{s.head}</div>
                <div style={{ fontSize: 25, color: C.sub, marginTop: 10, lineHeight: 1.4 }}>{s.body}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* takeaway final, una línea, abajo */}
      <div style={{
        position: "absolute", left: 96, bottom: 78, right: 96,
        opacity: fade(frame, 285, 310),
        borderTop: `2px solid ${C.line}`, paddingTop: 26,
      }}>
        <span style={{ fontSize: 34, fontWeight: 800, color: C.ink }}>
          Cuidás la circulación de noche <span style={{ color: C.teal }}>→ cuidás tu vista</span>.
        </span>
      </div>
    </AbsoluteFill>
  );
};
