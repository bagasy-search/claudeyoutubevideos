// gary14c · overlays propios (MEJORAS 2,4,5,8,9 + CTA de mitad + chip «THE SAFE WAY»). PURO CSS/DOM, sin SVG, sin blur, sin grano. Todos distintos de gary14a.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONTS, hash, useKB } from "./Piezas";

const { SERIF, SANS, HAND } = FONTS;
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cl = (v: number) => Math.max(0, Math.min(1, v));
const ou = (t: number) => Easing.out(Easing.cubic)(cl(t));
const inout = (f: number, d: number, a = 10, b = 10) => interpolate(f, [0, a, d - b, d], [0, 1, 1, 0], { ...CL, easing: Easing.inOut(Easing.cubic) });
const INK = "#1b2330", RED = "#d6402f", GRN = "#2f9e5a", YEL = "#f2c230";

// MEJORA 2 · progreso «N / 10»: diez detectores chiquitos en fila arriba a la derecha; los errores ya vistos quedan con LED verde, el actual titila en rojo
export const DetectorRow: React.FC<{ n: number; dur: number }> = ({ n, dur }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 12, 12);
  return <div style={{ position: "absolute", right: 50, top: 44, opacity: o, transform: `translateX(${(1 - o) * 60}px)` }}>
    <div style={{ display: "flex", gap: 10, padding: "12px 16px", background: "rgba(20,24,30,.82)", borderRadius: 40 }}>
      {Array.from({ length: 10 }, (_, i) => { const cur = i + 1 === n, done = i + 1 < n; const s = cur ? 1 + 0.18 * ou((f - 8) / 8) : 1;
        return <div key={i} style={{ width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #fff, #d9dcdf 70%)", position: "relative", transform: `scale(${s})` }}>
          <div style={{ position: "absolute", inset: 11, borderRadius: "50%", background: "repeating-radial-gradient(circle, #c9cdd0 0 2px, #f2f3f4 2px 5px)" }} />
          <div style={{ position: "absolute", right: 5, top: 5, width: 9, height: 9, borderRadius: "50%", background: cur ? (Math.floor(f / 6) % 2 ? RED : "#7a2a22") : done ? GRN : "#9aa0a5" }} />
        </div>; })}
    </div>
    <div style={{ marginTop: 8, textAlign: "right", fontFamily: SANS, fontWeight: 900, fontSize: 30, color: "#fff", letterSpacing: 3, textShadow: "2px 2px 0 rgba(0,0,0,.65)" }}>MISTAKE {n} / 10</div>
  </div>;
};

// MEJORA 5 · transición de capítulo: el portón seccional del garaje baja tapando el corte y vuelve a subir
export const GarageDoor: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const half = dur / 2;
  const p = f < half ? Easing.in(Easing.cubic)(cl(f / half)) : 1 - Easing.out(Easing.cubic)(cl((f - half) / half));
  const h = 1080 * p;
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: h, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, bottom: 0, width: 1920, height: 1080, background: "repeating-linear-gradient(0deg, #d8d3c8 0 262px, #8f8a80 262px 270px)" }}>
        {[0, 1, 2, 3].map((r) => <div key={r} style={{ position: "absolute", left: 0, right: 0, top: r * 270 + 40, display: "flex", justifyContent: "space-around" }}>
          {[0, 1, 2, 3, 4].map((c) => <div key={c} style={{ width: 300, height: 180, border: "6px solid #bdb7aa", boxShadow: "inset 4px 4px 0 rgba(255,255,255,.4)" }} />)}</div>)}
        <div style={{ position: "absolute", left: 900, bottom: 30, width: 120, height: 26, background: "#555", borderRadius: 6 }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, top: h - 18, width: 1920, height: 18, background: "#222", opacity: p > 0.01 ? 1 : 0 }} />
  </AbsoluteFill>;
};

// presentación: cinta de rotuladora DYMO roja con letras en relieve que sale de a una
export const Dymo: React.FC<{ text: string; sub: string; dur: number }> = ({ text, sub, dur }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 6, 12); const n = Math.round(text.length * cl(f / 14)); const n2 = Math.round(sub.length * cl((f - 12) / 26));
  const tape = (t: string, size: number, bg: string) => <div style={{ display: "inline-block", padding: `${size * 0.22}px ${size * 0.5}px`, background: bg, borderRadius: 6, boxShadow: "4px 6px 0 rgba(0,0,0,.4)",
    fontFamily: SANS, fontWeight: 900, fontSize: size, letterSpacing: size * 0.18, color: "#fff", textShadow: "-1px -1px 0 rgba(0,0,0,.35), 1px 1px 0 rgba(255,255,255,.45)", whiteSpace: "pre" }}>{t || " "}</div>;
  return <div style={{ position: "absolute", left: 90, bottom: 100, opacity: o, transform: "rotate(-2deg)" }}>
    {tape(text.slice(0, n), 78, "#c62a22")}
    <div style={{ marginTop: 14, marginLeft: 30 }}>{n2 > 0 && tape(sub.slice(0, n2), 30, "#1b2330")}</div>
  </div>;
};

// MEJORA 4 · pantalla partida: el avatar se corre y a la derecha entra un marco de ventana de madera con sus vidrios; la foto se ve a través, con escarcha en las esquinas
export const WindowSplit: React.FC<{ src: string; seed: number; dur: number; label?: string }> = ({ src, seed, dur, label }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 14, 12); const kb = useKB(seed, dur);
  return <div style={{ position: "absolute", left: 1000, top: 70, width: 860, height: 940, transform: `translateX(${(1 - o) * 1000}px)` }}>
    <div style={{ position: "absolute", inset: 0, background: "#e9e4d8", borderRadius: 8, boxShadow: "10px 12px 0 rgba(0,0,0,.35)" }} />
    <div style={{ position: "absolute", left: 34, top: 34, right: 34, bottom: label ? 120 : 34, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 0 0, rgba(255,255,255,.7) 0 8%, rgba(255,255,255,0) 18%), radial-gradient(circle at 100% 100%, rgba(255,255,255,.7) 0 8%, rgba(255,255,255,0) 18%)" }} />
      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 22, marginLeft: -11, background: "#e9e4d8" }} />
      <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 22, marginTop: -11, background: "#e9e4d8" }} />
    </div>
    {label && <div style={{ position: "absolute", left: 34, right: 34, bottom: 30, height: 70, display: "flex", alignItems: "center", fontFamily: SANS, fontWeight: 900, fontSize: 32, color: INK, letterSpacing: 2 }}>{label}</div>}
  </div>;
};

// MEJORA 8 · recuerdo como objeto: una diapositiva de 35 mm con marco de cartón, escrita a mano en el marco, que cae sobre la pantalla
export const Slide: React.FC<{ src: string; note: string; seed: number; dur: number; left?: boolean }> = ({ src, note, seed, dur, left }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 16, 12); const r = (hash(seed) % 2 ? 1 : -1) * (3 + (hash(seed + 3) % 4)); const kb = useKB(seed, dur);
  return <div style={{ position: "absolute", [left ? "left" : "right"]: 90, top: 150, width: 760, height: 760, transform: `translateY(${(1 - o) * -1100}px) rotate(${r + (1 - o) * 20}deg)` } as React.CSSProperties}>
    <div style={{ position: "absolute", inset: 0, background: "#f3efe6", borderRadius: 26, boxShadow: "10px 14px 0 rgba(0,0,0,.35)" }} />
    <div style={{ position: "absolute", left: 90, top: 150, width: 580, height: 400, overflow: "hidden", borderRadius: 10, boxShadow: "inset 0 0 0 4px rgba(0,0,0,.2)" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(.25) saturate(.9)", ...kb }} /></div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 40, fontFamily: SANS, fontWeight: 800, fontSize: 24, color: "#8a7a5c", letterSpacing: 4, display: "flex", justifyContent: "space-between" }}><span>KODACHROME</span><span>◦ 35 MM ◦</span></div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 580, fontFamily: HAND, fontWeight: 700, fontSize: 54, color: "#1f4f8f", lineHeight: 1.05, clipPath: `inset(-20% ${100 - 100 * cl((f - 16) / 22)}% -20% 0)` }}>{note}</div>
  </div>;
};

// MEJORA 9 · dato con fuente: etiqueta naranja de advertencia que se pega desde una esquina (se despega el papel de atrás)
export const WarnLabel: React.FC<{ big: string; label: string; src: string; dur: number }> = ({ big, label, src, dur }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 12, 12); const peel = 1 - ou(f / 16);
  return <div style={{ position: "absolute", left: 90, top: 80, width: 560, opacity: cl(o * 1.6), transform: `rotate(${-3 + peel * -10}deg) translateY(${peel * -60}px)`, transformOrigin: "0 0" }}>
    <div style={{ background: "#f08a24", borderRadius: 18, padding: "26px 34px", border: "6px solid #1b2330", boxShadow: "8px 10px 0 rgba(0,0,0,.35)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}><div style={{ width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderBottom: `46px solid ${INK}` }} /><div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 32, color: INK, letterSpacing: 6 }}>WARNING</div></div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: INK, lineHeight: 1, marginTop: 12 }}>{big}</div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: INK, marginTop: 8 }}>{label}</div>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 20, color: "#3a2a12", marginTop: 14, paddingTop: 10, borderTop: `3px solid ${INK}` }}>SOURCE · {src}</div>
    </div>
  </div>;
};

// chip «THE SAFE WAY»: cartel luminoso verde tipo SALIDA de emergencia que se enciende con un parpadeo
export const ExitSign: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 6, 10); const lit = f < 4 ? 0.3 : f < 7 ? 1 : f < 9 ? 0.4 : 1;
  return <div style={{ position: "absolute", left: 80, bottom: 80, opacity: o }}>
    <div style={{ padding: "16px 36px", background: `rgba(${Math.round(30 + 17 * lit)},${Math.round(90 + 68 * lit)},${Math.round(55 + 35 * lit)},1)`, borderRadius: 10, border: "8px solid #e9ecee", boxShadow: "6px 8px 0 rgba(0,0,0,.4)" }}>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 26, letterSpacing: 6, color: "#e8fff0", opacity: 0.6 + 0.4 * lit }}>THE SAFE WAY ➜</div>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 44, color: "#fff", opacity: 0.6 + 0.4 * lit }}>{text}</div>
    </div>
  </div>;
};

// CTA de mitad (sin voz): la puerta de un mueble de cocina se entreabre en la esquina y deja ver la página del manual pegada adentro
export const CabinetPeek: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 18, 14);
  return <div style={{ position: "absolute", right: 70, bottom: 60, width: 520, height: 640, transform: `translateY(${(1 - cl(o * 2)) * 700}px)`, perspective: 1600 }}>
    <div style={{ position: "absolute", inset: 0, background: "#6e4526", borderRadius: 8, boxShadow: "8px 10px 0 rgba(0,0,0,.35)" }} />
    <div style={{ position: "absolute", left: 30, top: 30, right: 30, bottom: 30, background: "#f8f5ec", padding: 30, boxSizing: "border-box" }}>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 22, color: "#8a7a5c", letterSpacing: 4 }}>THE WINTER BLACKOUT MANUAL</div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 50, color: INK, lineHeight: 1.05, marginTop: 12 }}>THE TWO-MINUTE CHECK</div>
      {["test button", "date on the back", "one every floor", "garage door gap"].map((s, i) => <div key={s} style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18 }}>
        <div style={{ width: 30, height: 30, border: `4px solid ${INK}` }} /><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: "#1f4f8f" }}>{s}</div></div>)}
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 20, padding: "10px 0", background: YEL, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 26, color: INK, letterSpacing: 2 }}>LINK IN THE DESCRIPTION</div>
    </div>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#8a5a33,#7a4e2b)", borderRadius: 8, border: "10px solid #5a3a20", boxSizing: "border-box", transformOrigin: "0 50%", transform: `rotateY(${-100 * o}deg)`, backfaceVisibility: "hidden" }}>
      <div style={{ position: "absolute", right: 30, top: 300, width: 20, height: 60, background: "#c9ced2", borderRadius: 6 }} />
    </div>
  </div>;
};
