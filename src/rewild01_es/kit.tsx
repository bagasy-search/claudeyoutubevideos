// rewild01 · kit propio de Rewild Report (documental de naturaleza, narrador puro, sin avatar). 16-oct-2026.
// edl = { end, shots: [{a, b, t: "img"|"clip", src, kb?, rate?, from?}], overlays: [{a, b, c, props}] }
// Todos los tiempos en SEGUNDOS absolutos del video. Las fotos llevan Ken-Burns (kb = variante 0-5); los clips van mudos
// (el sonido real de los clips se mezcla aparte en el wav final).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";

const fFr = loadFraunces("normal", { weights: ["500", "700", "900"], subsets: ["latin"] });
const fOs = loadOswald("normal", { weights: ["500", "700"], subsets: ["latin"] });
export const SERIF = fFr.fontFamily;
export const LABEL = fOs.fontFamily;
export const FPS = 30;
export const fr = (s: number) => Math.round(s * FPS);
const cl = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ez = (x: number) => { const t = cl(x); return t * t * (3 - 2 * t); };
const eo = (x: number) => 1 - Math.pow(1 - cl(x), 3);
export const K = { moss: "#1E3A2A", bone: "#F3EFE4", amber: "#E3A43B", ink: "#0C130E", red: "#C8442F" };
const shadow = "0 4px 22px rgba(0,0,0,0.7)";

export type Shot = { a: number; b: number; t: "img" | "clip"; src: string; kb?: number; rate?: number; from?: number };
export type Ov = { a: number; b: number; c: string; props?: any };
export type Edl = { end: number; shots: Shot[]; overlays: Ov[] };

// ── planos ──
const KB: [number, number, number, number, number, number][] = [
  // [s0, s1, x0, x1, y0, y1]  (escala y corrimiento en %)
  [1.04, 1.16, 0, 0, 0, 0], [1.16, 1.04, 0, 0, 0, 0], [1.12, 1.12, -3, 3, 0, 0],
  [1.12, 1.12, 3, -3, 0, 0], [1.06, 1.16, 0, 2, 2, -1], [1.14, 1.06, -2, 0, -1, 1],
];
const Photo: React.FC<{ src: string; d: number; kb: number }> = ({ src, d, kb }) => {
  const f = useCurrentFrame(); const p = f / Math.max(1, d); const [s0, s1, x0, x1, y0, y1] = KB[kb % KB.length];
  const s = s0 + (s1 - s0) * p, x = x0 + (x1 - x0) * p, y = y0 + (y1 - y0) * p;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s}) translate(${x}%, ${y}%)` }} />
    </AbsoluteFill>
  );
};
const Vid: React.FC<{ src: string; rate?: number; from?: number }> = ({ src, rate, from }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <OffthreadVideo src={staticFile(src)} muted playbackRate={rate || 1} startFrom={from ? fr(from) : 0}
      style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.02)" }} />
  </AbsoluteFill>
);

// ── superposiciones ──
type OP = { d: number };
const fadeIO = (f: number, d: number, i = 10, o = 10) => Math.min(ez(f / i), ez((d - f) / o));

// Capítulo: número enorme + título, esquina inferior izquierda, sobre degradé
export const Chapter: React.FC<OP & { n: string; title: string }> = ({ d, n, title }) => {
  const f = useCurrentFrame(); const a = fadeIO(f, d, 12, 14); const y = (1 - eo(f / 20)) * 40;
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(8,14,10,0.85) 0%, rgba(8,14,10,0.35) 45%, rgba(0,0,0,0) 70%)" }} />
      <div style={{ position: "absolute", left: 120, bottom: 120, transform: `translateY(${y}px)`, color: K.bone }}>
        <div style={{ fontFamily: LABEL, fontSize: 34, letterSpacing: 10, color: K.amber, fontWeight: 700 }}>CAPÍTULO {n}</div>
        <div style={{ width: 120 * eo((f - 6) / 24), height: 4, background: K.amber, margin: "16px 0 20px" }} />
        <div style={{ fontFamily: SERIF, fontSize: 96, fontWeight: 900, lineHeight: 1.0, maxWidth: 1300, textShadow: shadow }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// Lugar: pin + nombre + subtítulo (arriba a la izquierda)
export const Place: React.FC<OP & { name: string; sub?: string }> = ({ d, name, sub }) => {
  const f = useCurrentFrame(); const a = fadeIO(f, d, 10, 12); const w = eo((f - 4) / 18);
  return (
    <div style={{ position: "absolute", left: 90, top: 80, opacity: a, display: "flex", alignItems: "center", gap: 22 }}>
      <svg width="46" height="62" viewBox="0 0 46 62"><path d="M23 2C11 2 2 11 2 23c0 16 21 37 21 37s21-21 21-37C44 11 35 2 23 2z" fill={K.amber} /><circle cx="23" cy="23" r="8" fill={K.ink} /></svg>
      <div style={{ background: "rgba(10,18,12,0.72)", padding: "14px 28px", clipPath: `inset(0 ${100 - w * 100}% 0 0)` }}>
        <div style={{ fontFamily: LABEL, fontSize: 44, fontWeight: 700, letterSpacing: 4, color: K.bone }}>{name}</div>
        {sub ? <div style={{ fontFamily: LABEL, fontSize: 26, letterSpacing: 3, color: K.amber, marginTop: 2 }}>{sub}</div> : null}
      </div>
    </div>
  );
};

// Año grande (esquina inferior derecha)
export const Year: React.FC<OP & { y: string; sub?: string }> = ({ d, y, sub }) => {
  const f = useCurrentFrame(); const a = fadeIO(f, d, 8, 12); const s = 0.9 + 0.1 * eo(f / 14);
  return (
    <div style={{ position: "absolute", right: 110, bottom: 90, opacity: a, textAlign: "right", transform: `scale(${s})`, transformOrigin: "right bottom" }}>
      <div style={{ fontFamily: SERIF, fontSize: 170, fontWeight: 900, color: K.bone, lineHeight: 0.9, textShadow: shadow }}>{y}</div>
      {sub ? <div style={{ fontFamily: LABEL, fontSize: 32, letterSpacing: 6, color: K.amber, fontWeight: 700, textShadow: shadow }}>{sub}</div> : null}
    </div>
  );
};

// Número que cuenta hasta `to` + etiqueta (centro-izquierda)
export const Stat: React.FC<OP & { to: number; label: string; pre?: string; suf?: string; dur?: number }> = ({ d, to, label, pre, suf, dur }) => {
  const f = useCurrentFrame(); const a = fadeIO(f, d, 8, 12); const n = Math.round(to * eo(f / (dur || 40)));
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <AbsoluteFill style={{ background: "linear-gradient(to right, rgba(8,14,10,0.8) 0%, rgba(8,14,10,0.3) 50%, rgba(0,0,0,0) 75%)" }} />
      <div style={{ position: "absolute", left: 120, top: "50%", transform: "translateY(-50%)" }}>
        <div style={{ fontFamily: SERIF, fontSize: 200, fontWeight: 900, color: K.bone, lineHeight: 1, textShadow: shadow }}>{pre || ""}{n.toLocaleString("de-DE")}{suf || ""}</div>
        <div style={{ fontFamily: LABEL, fontSize: 44, letterSpacing: 6, color: K.amber, fontWeight: 700, maxWidth: 900 }}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};

// Barras horizontales (p. ej. muertes por especie)
export const Bars: React.FC<OP & { head: string; rows: { k: string; v: number }[] }> = ({ d, head, rows }) => {
  const f = useCurrentFrame(); const a = fadeIO(f, d, 10, 12); const mx = Math.max(...rows.map((r) => r.v));
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <AbsoluteFill style={{ background: "rgba(8,14,10,0.62)" }} />
      <div style={{ position: "absolute", left: 160, right: 160, top: 210 }}>
        <div style={{ fontFamily: LABEL, fontSize: 46, letterSpacing: 6, color: K.amber, fontWeight: 700, marginBottom: 50 }}>{head}</div>
        {rows.map((r, i) => {
          const p = eo((f - 12 - i * 14) / 30);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 46 }}>
              <div style={{ width: 430, fontFamily: SERIF, fontSize: 50, whiteSpace: "nowrap", fontWeight: 700, color: K.bone }}>{r.k}</div>
              <div style={{ height: 70, width: `${(r.v / mx) * 62 * p}%`, background: i === 0 ? K.amber : K.bone, opacity: 0.92 }} />
              <div style={{ marginLeft: 26, fontFamily: SERIF, fontSize: 60, fontWeight: 900, color: K.bone, opacity: cl((f - 18 - i * 14) / 10) }}>{Math.round(r.v * p).toLocaleString("de-DE")}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Cita de fuente (centro-abajo)
export const Quote: React.FC<OP & { txt: string; src: string }> = ({ d, txt, src }) => {
  const f = useCurrentFrame(); const a = fadeIO(f, d, 12, 14); const w = txt.split(" ");
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(8,14,10,0.88) 0%, rgba(8,14,10,0.4) 50%, rgba(0,0,0,0) 80%)" }} />
      <div style={{ position: "absolute", left: 180, right: 180, bottom: 130 }}>
        <div style={{ fontFamily: SERIF, fontSize: 64, fontWeight: 500, fontStyle: "italic", color: K.bone, lineHeight: 1.2, textShadow: shadow }}>
          {"“"}{w.map((x, i) => <span key={i} style={{ opacity: cl((f - 6 - i * 2.2) / 6) }}>{x} </span>)}{"”"}
        </div>
        <div style={{ fontFamily: LABEL, fontSize: 30, letterSpacing: 5, color: K.amber, marginTop: 18, fontWeight: 700 }}>— {src}</div>
      </div>
    </AbsoluteFill>
  );
};

// Línea / cartel corto (palabra clave grande al centro)
export const Big: React.FC<OP & { txt: string; sub?: string }> = ({ d, txt, sub }) => {
  const f = useCurrentFrame(); const a = fadeIO(f, d, 8, 12); const s = 1.06 - 0.06 * eo(f / 16);
  return (
    <AbsoluteFill style={{ opacity: a, alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(8,14,10,0.7) 0%, rgba(8,14,10,0.25) 60%, rgba(0,0,0,0) 85%)" }} />
      <div style={{ transform: `scale(${s})`, textAlign: "center" }}>
        <div style={{ fontFamily: SERIF, fontSize: 150, fontWeight: 900, color: K.bone, textShadow: shadow, lineHeight: 1 }}>{txt}</div>
        {sub ? <div style={{ fontFamily: LABEL, fontSize: 40, letterSpacing: 8, color: K.amber, fontWeight: 700, marginTop: 16 }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// Cierre: suscripción + próximo video
export const Next: React.FC<OP & { title: string; img: string }> = ({ d, title, img }) => {
  const f = useCurrentFrame(); const a = fadeIO(f, d, 14, 20); const p = eo((f - 10) / 26);
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <AbsoluteFill style={{ background: "rgba(8,14,10,0.55)" }} />
      <div style={{ position: "absolute", right: 140, top: 200, width: 820, transform: `translateX(${(1 - p) * 120}px)`, opacity: p }}>
        <div style={{ fontFamily: LABEL, fontSize: 34, letterSpacing: 8, color: K.amber, fontWeight: 700, marginBottom: 18 }}>A CONTINUACIÓN EN INFORME SALVAJE</div>
        <div style={{ border: `6px solid ${K.bone}`, boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
          <Img src={staticFile(img)} style={{ width: "100%", height: 461, objectFit: "cover", display: "block" }} />
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 52, fontWeight: 700, color: K.bone, marginTop: 22, lineHeight: 1.1, textShadow: shadow }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// Botón de suscripción (abajo a la derecha, chico)
export const Sub: React.FC<OP> = ({ d }) => {
  const f = useCurrentFrame(); const a = fadeIO(f, d, 8, 10); const s = 0.8 + 0.2 * eo(f / 12); const on = f > 40;
  return (
    <div style={{ position: "absolute", right: 110, bottom: 110, opacity: a, transform: `scale(${s})`, transformOrigin: "right bottom" }}>
      <div style={{ background: on ? "#3a3a3a" : K.red, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 3, padding: "18px 44px", borderRadius: 10, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>{on ? "SUSCRITO" : "SUSCRÍBETE"}</div>
    </div>
  );
};

export const OVS: Record<string, React.FC<any>> = { Chapter, Place, Year, Stat, Bars, Quote, Big, Next, Sub };

export const makePlayer = (E: Edl): React.FC => () => (
  <AbsoluteFill style={{ backgroundColor: K.ink }}>
    {E.shots.map((s, i) => {
      const d = fr(s.b) - fr(s.a);
      return (
        <Sequence key={i} from={fr(s.a)} durationInFrames={d}>
          {s.t === "clip" ? <Vid src={s.src} rate={s.rate} from={s.from} /> : <Photo src={s.src} d={d} kb={s.kb ?? i} />}
        </Sequence>
      );
    })}
    {E.overlays.map((o, i) => {
      const C = OVS[o.c];
      if (!C) throw new Error(`rewild01: superposición desconocida "${o.c}"`);
      const d = fr(o.b) - fr(o.a);
      return <Sequence key={"o" + i} from={fr(o.a)} durationInFrames={d}><C {...o.props} d={d} /></Sequence>;
    })}
  </AbsoluteFill>
);
