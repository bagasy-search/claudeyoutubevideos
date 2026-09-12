import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ── PizarraGlicacion (explainer animado, avatar afuera) ──────────────────────
// Clímax del ERROR #1: el azúcar de la noche se pega al cristalino y lo OPACA
// (glicación → catarata). Mismo molde PRO que PizarraOjo: un sujeto grande (el
// cristalino que se nubla) + columna de pasos + takeaway. Paleta mínima, 1 tipografía.

const INTER = loadInter().fontFamily;
const C = {
  bg: "#F7FAFB", ink: "#152430", sub: "#5A6B76",
  teal: "#0E9C99", coral: "#E0523E", amber: "#D98A2B", line: "#DCE6EA",
};
const fade = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const STEPS = [
  { n: "1", head: "Azúcar alta de noche", body: "Un postre o harinas en la cena dejan la glucosa alta por horas, justo mientras dormís.", at: 40, tone: C.amber },
  { n: "2", head: "Se pega a las proteínas", body: "Esa glucosa se adhiere al cristalino como un caramelo. Se llama glicación.", at: 130, tone: C.coral },
  { n: "3", head: "El cristalino se opaca", body: "Las proteínas del cristalino casi no se renuevan: el daño se acumula. Eso es la catarata.", at: 220, tone: C.ink },
];

export const PizarraGlicacion: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const active = STEPS.reduce((acc, s, i) => (frame >= s.at ? i : acc), 0);

  // opacidad del "velo" del cristalino: 0 → nublado, progresivo
  const cloud = interpolate(frame, [120, 300], [0, 0.72], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // moléculas de azúcar que caen y se pegan al cristalino
  const molecules = Array.from({ length: 9 }).map((_, i) => {
    const start = 90 + i * 14;
    const p = spring({ frame: frame - start, fps, config: { damping: 20, stiffness: 60 } });
    const ang = (i / 9) * Math.PI * 2 + 0.6;
    const rTo = 150 + (i % 3) * 26;
    const x0 = 470 + Math.cos(ang) * 520;
    const y0 = 540 + Math.sin(ang) * 360 - 300;
    const x1 = 470 + Math.cos(ang) * rTo;
    const y1 = 540 + Math.sin(ang) * (rTo * 0.62);
    return { x: interpolate(p, [0, 1], [x0, x1]), y: interpolate(p, [0, 1], [y0, y1]), op: p * 0.95, k: i };
  });

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: INTER }}>
      <div style={{ position: "absolute", top: 70, left: 96, opacity: fade(frame, 4, 20) }}>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.coral }}>Error #1 · el azúcar</div>
        <div style={{ fontSize: 52, fontWeight: 800, color: C.ink, marginTop: 8, letterSpacing: -0.5 }}>Qué le hace a tus ojos de noche</div>
      </div>

      {/* ── CRISTALINO (izquierda) que se nubla ── */}
      <svg viewBox="0 0 960 1080" width="50%" height="100%" style={{ position: "absolute", left: 40, top: 40 }}>
        <defs>
          <radialGradient id="lens" cx="42%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#EAF6F5" />
            <stop offset="100%" stopColor="#CDE7E5" />
          </radialGradient>
        </defs>
        <g transform="translate(470 540)">
          {/* cristalino transparente */}
          <ellipse cx="0" cy="0" rx="215" ry="250" fill="url(#lens)" stroke={C.ink} strokeWidth="5"
            opacity={fade(frame, 16, 50)} />
          {/* brillo (se apaga al nublarse) */}
          <ellipse cx="-70" cy="-90" rx="52" ry="80" fill="#FFFFFF" opacity={(1 - cloud) * fade(frame, 30, 55) * 0.8} />
          {/* velo lechoso = glicación */}
          <ellipse cx="0" cy="0" rx="213" ry="248" fill="#C9CBB0" opacity={cloud} />
          <ellipse cx="0" cy="0" rx="213" ry="248" fill="none" stroke={C.ink} strokeWidth="5" opacity={fade(frame, 16, 50)} />
          {/* etiqueta */}
          <text x="0" y="300" fontFamily={INTER} fontSize="28" fontWeight={700} fill={active >= 2 ? C.coral : C.sub} textAnchor="middle">
            {active >= 2 ? "cristalino opaco = catarata" : "cristalino transparente"}
          </text>
        </g>
        {/* moléculas de azúcar */}
        {molecules.map((m) => (
          <g key={m.k} opacity={m.op} transform={`translate(${m.x} ${m.y})`}>
            <circle cx="0" cy="0" r="13" fill={C.amber} />
            <text x="0" y="5" fontFamily={INTER} fontSize="13" fontWeight={800} fill="#FFFFFF" textAnchor="middle">Az</text>
          </g>
        ))}
      </svg>

      {/* ── COLUMNA DE PASOS ── */}
      <div style={{ position: "absolute", right: 110, top: 300, width: 640 }}>
        {STEPS.map((s, i) => {
          const isActive = i === active, isDone = i < active;
          const app = spring({ frame: frame - s.at, fps, config: { damping: 18, stiffness: 110 } });
          if (frame < s.at - 6) return null;
          const op = isActive ? 1 : isDone ? 0.32 : 1;
          return (
            <div key={i} style={{ display: "flex", gap: 24, marginBottom: 46, opacity: op * app, transform: `translateY(${interpolate(app, [0, 1], [16, 0])}px)` }}>
              <div style={{ flex: "0 0 auto", width: 56, height: 56, borderRadius: 30, background: isActive ? s.tone : "#FFFFFF", border: `2px solid ${s.tone}`, color: isActive ? "#FFFFFF" : s.tone, fontWeight: 800, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.n}</div>
              <div>
                <div style={{ fontSize: 40, fontWeight: 800, color: C.ink, lineHeight: 1.1 }}>{s.head}</div>
                <div style={{ fontSize: 25, color: C.sub, marginTop: 10, lineHeight: 1.4 }}>{s.body}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", left: 96, bottom: 78, right: 96, opacity: fade(frame, 285, 310), borderTop: `2px solid ${C.line}`, paddingTop: 26 }}>
        <span style={{ fontSize: 34, fontWeight: 800, color: C.ink }}>Cortá el azúcar de la <span style={{ color: C.coral }}>noche</span> → protegés el cristalino.</span>
      </div>
    </AbsoluteFill>
  );
};
