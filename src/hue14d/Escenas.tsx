// Escenas sobre fotos de hue14d (D:/rtmp/hue14d/ideas.md). Escritas de cero: solo React y Remotion, sin SVG.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { FONTS } from "./Piezas";

const FPS = 30;
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const sf = (s: string) => (s.startsWith("http") || s.startsWith("/") ? s : staticFile(s));
const cl = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
// cámara centrada en (px, py) con escala s; el corrimiento nunca deja bordes vacíos
const camAt = (px: number, py: number, s: number): React.CSSProperties => {
  const tx = cl(-(px - 960) * s, -(s - 1) * 960, (s - 1) * 960), ty = cl(-(py - 540) * s, -(s - 1) * 540, (s - 1) * 540);
  return { ...FULL, transformOrigin: "50% 50%", transform: `translate(${tx}px, ${ty}px) scale(${s})` };
};
// tramos de cámara: [frame, x, y, escala]; los frames se ordenan para que nunca se crucen
const via = (f: number, K: [number, number, number, number][]) => {
  const fr: number[] = []; K.forEach((k, i) => fr.push(i ? Math.max(k[0], fr[i - 1] + 1) : k[0]));
  const g = (i: number) => interpolate(f, fr, K.map((k) => k[i]), { ...CL, easing: io });
  return { x: g(1), y: g(2), s: g(3) };
};
const Frase: React.FC<{ t: string; f0: number; x: number; y: number; size?: number }> = ({ t, f0, x, y, size = 96 }) => {
  const f = useCurrentFrame(); if (f < f0) return null;
  const k = spring({ frame: f - f0, fps: FPS, config: { damping: 16, mass: 0.9 } });
  return (
    <div style={{ position: "absolute", left: x, top: y, fontFamily: FONTS.SERIF, fontSize: size, fontWeight: 700, color: "#FBEFD6", letterSpacing: 1,
      opacity: Math.min(1, k * 1.4), transform: `translateY(${(1 - k) * 26}px)`, textShadow: "0 3px 4px rgba(0,0,0,0.85), 0 0 28px rgba(0,0,0,0.6)" }}>{t}</div>
  );
};

// ── Escena 1 · la prueba de la uña. La toma pasa por el nudo de corteza, que tiembla y no se despega,
// y llega a la escama real, que se abre como tapa de frasco con bisagra a la izquierda y deja ver su cara de adentro.
const NUDO = { x: 667, y: 822, r: 46 };
const TAPA = { x: 886, y: 494, w: 106, h: 122 };
export const EscUna: React.FC<{ src: string; fCorteza: number; fEscama: number; fTapita: number; fHumeda: number; fViva: number; dur: number }> = ({ src, fCorteza, fEscama, fTapita, fHumeda, fViva, dur }) => {
  const f = useCurrentFrame(); const S = sf(src);
  const c = via(f, [[0, 900, 600, 1.08], [Math.max(1, fCorteza - 10), 700, 800, 1.55], [fEscama - 8, 690, 790, 1.62], [fEscama + 40, 935, 565, 2.15], [fViva, 935, 565, 2.35], [dur, 900, 590, 1.7]]);
  const tiembla = f > fCorteza + 10 && f < fCorteza + 40 ? Math.sin((f - fCorteza) * 1.7) * 4 * (1 - (f - fCorteza - 10) / 30) : 0;
  const ab = spring({ frame: f - fTapita, fps: FPS, config: { damping: 11, mass: 1.1, stiffness: 70 } });
  const ang = -128 * ab;
  const dentro = ang < -90;
  const moja = interpolate(f, [fHumeda, fHumeda + 30], [0, 1], CL);
  const lustre = (f - fHumeda) / 40;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <div style={camAt(c.x + Math.sin(f / 50) * 14, c.y + Math.cos(f / 66) * 9, c.s)}>
        <Img src={S} style={FULL} />
        <div style={{ position: "absolute", left: NUDO.x - NUDO.r, top: NUDO.y - NUDO.r, width: NUDO.r * 2, height: NUDO.r * 2, borderRadius: "50%", overflow: "hidden",
          transform: `translate(${tiembla}px, ${-Math.abs(tiembla) * 0.5}px)`, WebkitMaskImage: "radial-gradient(circle, #000 60%, transparent 100%)", maskImage: "radial-gradient(circle, #000 60%, transparent 100%)" }}>
          <Img src={S} style={{ ...FULL, left: -(NUDO.x - NUDO.r), top: -(NUDO.y - NUDO.r) }} />
        </div>
        {ab > 0.01 && (
          <div style={{ position: "absolute", left: TAPA.x + 4, top: TAPA.y + 4, width: TAPA.w - 8, height: TAPA.h - 8, borderRadius: "50%", overflow: "hidden",
            WebkitMaskImage: "radial-gradient(ellipse, #000 70%, transparent 100%)", maskImage: "radial-gradient(ellipse, #000 70%, transparent 100%)" }}>
            <Img src={S} style={{ ...FULL, left: -(TAPA.x + 4) + 108, top: -(TAPA.y + 4) - 96, filter: `brightness(${0.8 - 0.12 * moja}) saturate(${1.2 + 0.5 * moja}) contrast(1.1)` }} />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 55%, rgba(120,90,30,0.45) 0%, rgba(80,60,20,0) 100%)", opacity: moja, mixBlendMode: "multiply" }} />
            <div style={{ position: "absolute", left: 20 + Math.sin(lustre) * 18, top: 26 + Math.cos(lustre * 0.8) * 10, width: 44, height: 22, borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(255,255,240,0.9) 0%, rgba(255,255,240,0) 70%)", opacity: moja * (0.7 + 0.3 * Math.sin(lustre * 2)) }} />
          </div>
        )}
        <div style={{ position: "absolute", left: TAPA.x, top: TAPA.y, width: TAPA.w, height: TAPA.h, transformOrigin: "0% 55%",
          transform: `perspective(520px) translateY(${-8 * ab}px) rotateY(${ang}deg)`, filter: `drop-shadow(${6 * ab}px ${10 * ab}px ${8 * ab}px rgba(0,0,0,${0.55 * ab}))` }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden" }}>
            <Img src={S} style={{ ...FULL, left: -TAPA.x, top: -TAPA.y, filter: dentro ? `sepia(0.55) brightness(${1.35 + 0.15 * moja}) saturate(1.3)` : "none" }} />
            {dentro && <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(ellipse 45% 35% at ${45 + Math.sin(lustre) * 15}% 40%, rgba(255,250,225,${0.75 * moja}) 0%, rgba(255,250,225,0) 100%)` }} />}
          </div>
        </div>
      </div>
      <Frase t="Húmeda: está viva." f0={fViva} x={110} y={850} />
    </AbsoluteFill>
  );
};

// ── Escena 2 · la vaselina sobre la cinta. La franja de cinta real queda lustrosa de izquierda a derecha, con un reflejo
// que da la vuelta al tronco; después la toma trepa desde la tierra como la hormiga, choca con el lustre y retrocede.
const BANDA = { x: 404, y: 334, w: 322, h: 84 };
const TRONCO = 566;
export const EscVaselina: React.FC<{ src: string; fUntas: number; fAlrededor: number; fHormiga: number; fAtora: number; fVuelta: number; fCruza: number; dur: number }> = ({ src, fUntas, fAlrededor, fHormiga, fAtora, fVuelta, fCruza, dur }) => {
  const f = useCurrentFrame(); const S = sf(src);
  const c = via(f, [[0, 760, 430, 1.22], [Math.max(1, fUntas), 620, 390, 1.5], [fHormiga - 16, 590, 390, 1.62], [fHormiga + 4, TRONCO, 880, 2.0], [fAtora, TRONCO, 520, 2.1], [fVuelta + 6, TRONCO, 545, 2.1], [fVuelta + 40, TRONCO, 760, 1.9], [fCruza + 4, 820, 560, 1.12], [dur, 840, 560, 1.16]]);
  const trepa = f > fHormiga && f < fAtora ? Math.sin(f / 4) * 5 : 0;
  const choque = f >= fAtora && f < fAtora + 24 ? Math.sin((f - fAtora) * 1.9) * 9 * (1 - (f - fAtora) / 24) : 0;
  const unta = interpolate(f, [fUntas, Math.max(fUntas + 30, fAlrededor + 24)], [0, 1], { ...CL, easing: Easing.inOut(Easing.quad) });
  const giro = (f / 70) % 1;
  const flash = f >= fAtora ? interpolate(f, [fAtora, fAtora + 8, fAtora + 40], [0, 1, 0], CL) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <div style={camAt(c.x + trepa + choque, c.y + Math.cos(f / 60) * 8, c.s)}>
        <Img src={S} style={FULL} />
        {unta > 0 && (
          <div style={{ position: "absolute", left: BANDA.x, top: BANDA.y, width: BANDA.w, height: BANDA.h, overflow: "hidden", clipPath: `inset(-4px ${(1 - unta) * 100}% -4px 0)`,
            WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%)", maskImage: "linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%)" }}>
            <Img src={S} style={{ ...FULL, left: -BANDA.x, top: -BANDA.y, filter: "brightness(1.12) contrast(1.18) saturate(0.85)" }} />
            <div style={{ position: "absolute", inset: 0, mixBlendMode: "screen",
              background: "linear-gradient(90deg, rgba(255,250,235,0) 0%, rgba(255,250,235,0.22) 28%, rgba(255,250,235,0.42) 38%, rgba(255,250,235,0.18) 50%, rgba(255,250,235,0) 75%)" }} />
            <div style={{ position: "absolute", top: 0, height: BANDA.h, width: 40, left: BANDA.w * (0.5 - 0.48 * Math.cos(giro * Math.PI * 2)) - 20, mixBlendMode: "screen",
              background: "linear-gradient(90deg, rgba(255,255,250,0) 0%, rgba(255,255,250,0.75) 50%, rgba(255,255,250,0) 100%)", opacity: 0.35 + 0.65 * Math.sin(giro * Math.PI * 2) ** 2 }} />
            <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(255,248,225,1)", mixBlendMode: "screen", opacity: 0.35 * flash }} />
          </div>
        )}
      </div>
      <Frase t="No la cruza." f0={fCruza} x={1180} y={860} />
    </AbsoluteFill>
  );
};

// ── Escena 3 · los huevos debajo de la madre. En «la mamá se muere» la cáscara se vuelve gris ceniza y los huevos siguen
// amarillos; «semanas después» las crías reales, escondidas hasta ahí, salen de debajo de esa cáscara y caminan a su lugar.
const KX = 1920 / 1088, KY = 1080 / 608;
const CASCARA = [[330, 388], [335, 360], [355, 338], [385, 324], [420, 318], [460, 320], [495, 330], [520, 350], [538, 375], [543, 405], [541, 440], [510, 441], [470, 427], [430, 417], [395, 411], [360, 401]]
  .map(([x, y]) => `${(x * KX).toFixed(0)}px ${(y * KY).toFixed(0)}px`).join(", ");
const CRIAS = [
  { x: 574, y: 805, r: 30, dx: -92, dy: -20 }, { x: 392, y: 723, r: 32, dx: -82, dy: -18 }, { x: 1078, y: 872, r: 32, dx: 92, dy: 20 },
  { x: 364, y: 536, r: 26, dx: 86, dy: 18 }, { x: 88, y: 622, r: 28, dx: 86, dy: 18 },
];
const NIDO = { x: 780, y: 792 };
const Circ: React.FC<{ S: string; x: number; y: number; r: number; dx?: number; dy?: number; style?: React.CSSProperties }> = ({ S, x, y, r, dx = 0, dy = 0, style }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", overflow: "hidden",
    WebkitMaskImage: "radial-gradient(circle, #000 58%, transparent 100%)", maskImage: "radial-gradient(circle, #000 58%, transparent 100%)", ...style }}>
    <Img src={S} style={{ ...FULL, left: -(x - r) - dx, top: -(y - r) - dy }} />
  </div>
);
export const EscHuevos: React.FC<{ src: string; fHuevos: number; fDecenas: number; fProtegidos: number; fMuere: number; fSemanas: number; dur: number }> = ({ src, fHuevos, fDecenas, fProtegidos, fMuere, fSemanas, dur }) => {
  const f = useCurrentFrame(); const S = sf(src);
  const c = via(f, [[0, 900, 600, 1.1], [Math.max(1, fHuevos + 20), 810, 790, 1.85], [fDecenas + 40, 805, 795, 2.0], [fProtegidos + 30, 770, 690, 1.7], [fSemanas - 10, 760, 700, 1.75], [fSemanas + 40, 640, 720, 1.22], [dur, 620, 715, 1.16]]);
  const gris = interpolate(f, [fMuere, fMuere + 40], [0, 1], CL);
  const brillo = interpolate(f, [fDecenas, fDecenas + 14, fDecenas + 60], [0, 1, 0.35], CL) * interpolate(f, [fProtegidos + 30, fProtegidos + 60], [1, 0], CL);
  const t0 = fSemanas + 14;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <div style={camAt(c.x + Math.sin(f / 48) * 14, c.y + Math.cos(f / 63) * 9, c.s)}>
        <Img src={S} style={FULL} />
        {brillo > 0.01 && <div style={{ position: "absolute", left: 640, top: 700, width: 340, height: 200, borderRadius: "50%", mixBlendMode: "screen", opacity: brillo,
          background: "radial-gradient(ellipse, rgba(255,236,150,0.55) 0%, rgba(255,226,120,0) 70%)" }} />}
        {CRIAS.map((k, i) => {
          const p = interpolate(f, [t0 + i * 10, t0 + i * 10 + 70], [0, 1], { ...CL, easing: Easing.out(Easing.quad) });
          return (
            <React.Fragment key={i}>
              {p < 1 && <Circ S={S} x={k.x} y={k.y} r={k.r + 6} dx={k.dx} dy={k.dy} />}
              {p > 0 && <Circ S={S} x={k.x} y={k.y} r={k.r}
                style={{ transform: `translate(${(NIDO.x - k.x) * (1 - p)}px, ${(NIDO.y - k.y) * (1 - p) + Math.sin(p * 14) * 3 * (1 - p)}px) rotate(${Math.sin(p * 22) * 9 * (1 - p)}deg)` }} />}
            </React.Fragment>
          );
        })}
        <div style={{ ...FULL, clipPath: `polygon(${CASCARA})` }}>
          <Img src={S} style={FULL} />
          <Img src={S} style={{ ...FULL, opacity: gris, filter: "grayscale(1) brightness(0.92) contrast(0.85)" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
