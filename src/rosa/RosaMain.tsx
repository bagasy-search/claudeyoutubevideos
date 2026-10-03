// RosaMain — montaje de los videos de "Abuela Rosa: Sabores de Antes" (narrador sin avatar).
//   beats[]    = plano base contiguo (foto con Ken-Burns o clip de ≤2 s a cámara lenta), `tr` dissolve funde con el anterior
//   overlays[] = sellos de receta, rótulos de truco, carta del libro (encima del base, nunca lo tapan)
// Acabado: viñeta + grano suaves. El audio final (voz) viene mezclado en `plan.audio`.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export type Beat = { from: number; dur: number; src: string; start?: number; rate?: number; kb?: KB; zoom?: number; filter?: string; pos?: string; tr?: "cut" | "dissolve" };
export type Cue = { from: number; dur: number; comp: string; props: any };
export type Plan = { fps: number; total: number; audio?: string; beats: Beat[]; overlays: Cue[] };

const TC = "#7A3B2E", TC2 = "#4A2019", GOLD = "#E2B15C", CREAM = "#FBF4EA";
const SERIF = "Georgia, 'Times New Roman', serif";
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (t: number) => 1 - Math.pow(1 - clamp(t), 3);

// Sello de receta: número grande en medallón + nombre que se escribe letra por letra.
export const RecipeStamp: React.FC<{ n: number | string; title: string; sub?: string }> = ({ n, title, sub }) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const inP = ease(f / 14), outP = ease((D - f) / 12);
  const o = Math.min(inP, outP);
  const chars = Math.floor(clamp((f - 10) / (title.length * 1.6)) * title.length);
  return (
    <AbsoluteFill style={{ opacity: o, transform: `translateY(${(1 - o) * -24}px)` }}>
      <div style={{ position: "absolute", left: 64, top: 56, display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ width: 132, height: 132, borderRadius: "50%", background: `radial-gradient(circle at 30% 28%, #F6D188, ${GOLD} 60%, #C98A2E)`, display: "grid", placeItems: "center", boxShadow: "0 12px 34px rgba(0,0,0,.45)", border: "4px solid rgba(74,32,25,.35)" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 74, color: TC2, lineHeight: 1 }}>{n}</div>
        </div>
        <div style={{ background: "rgba(74,32,25,.9)", padding: "18px 30px 20px", borderRadius: 14, boxShadow: "0 10px 30px rgba(0,0,0,.4)", maxWidth: 1050 }}>
          <div style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 21, letterSpacing: 5, color: GOLD, textTransform: "uppercase" }}>{sub ?? "Una sola olla"}</div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 54, color: CREAM, lineHeight: 1.08, marginTop: 4 }}>{title.slice(0, chars)}<span style={{ opacity: chars < title.length ? 1 : 0 }}>▌</span></div>
          <div style={{ height: 5, background: GOLD, borderRadius: 3, marginTop: 10, width: `${clamp((f - 10) / (title.length * 1.6)) * 100}%` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Rótulo "El truco de la abuela": tarjeta crema abajo a la izquierda.
export const Truco: React.FC<{ text: string; kicker?: string }> = ({ text, kicker }) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const o = Math.min(ease(f / 12), ease((D - f) / 12));
  return (
    <AbsoluteFill style={{ opacity: o, transform: `translateX(${(1 - o) * -60}px)` }}>
      <div style={{ position: "absolute", left: 64, bottom: 70, maxWidth: 980, background: CREAM, borderLeft: `10px solid ${GOLD}`, borderRadius: 12, padding: "20px 32px 24px", boxShadow: "0 12px 34px rgba(0,0,0,.45)" }}>
        <div style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 21, letterSpacing: 5, color: TC, textTransform: "uppercase" }}>{kicker ?? "El truco de la abuela"}</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: TC2, lineHeight: 1.2, marginTop: 6 }}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};

// Título de capítulo centrado (ej. "Antes de empezar", "Los errores que cometí").
export const Chapter: React.FC<{ text: string; sub?: string }> = ({ text, sub }) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const o = Math.min(ease(f / 16), ease((D - f) / 14));
  return (
    <AbsoluteFill style={{ opacity: o, background: `rgba(74,32,25,${0.55 * o})`, justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", transform: `scale(${0.94 + 0.06 * o})` }}>
        {sub ? <div style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 28, letterSpacing: 9, color: GOLD, textTransform: "uppercase" }}>{sub}</div> : null}
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 96, color: CREAM, lineHeight: 1.05, maxWidth: 1500, marginTop: 10 }}>{text}</div>
        <div style={{ width: 180, height: 6, background: GOLD, margin: "26px auto 0", borderRadius: 3 }} />
      </div>
    </AbsoluteFill>
  );
};

// Carta del libro (regalo en la descripción): portada + texto, abajo a la derecha. Sin precio ni link.
export const BookCta: React.FC<{ cover: string; line1?: string; line2?: string }> = ({ cover, line1, line2 }) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const o = Math.min(ease(f / 16), ease((D - f) / 16));
  return (
    <AbsoluteFill style={{ opacity: o, transform: `translateY(${(1 - o) * 50}px)` }}>
      <div style={{ position: "absolute", right: 64, bottom: 64, display: "flex", gap: 26, alignItems: "center", background: "rgba(74,32,25,.94)", borderRadius: 18, padding: "22px 34px 22px 22px", boxShadow: "0 16px 40px rgba(0,0,0,.5)", border: `2px solid ${GOLD}` }}>
        <Img src={staticFile(cover)} style={{ height: 250, borderRadius: 6, boxShadow: "0 10px 26px rgba(0,0,0,.5)" }} />
        <div style={{ maxWidth: 560 }}>
          <div style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: 5, color: GOLD, textTransform: "uppercase" }}>Un regalo de la casa</div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 44, color: CREAM, lineHeight: 1.1, marginTop: 6 }}>{line1 ?? "El Gran Recetario de la Abuela Rosa"}</div>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 30, color: "#E9D9C3", marginTop: 8 }}>{line2 ?? "Lo encuentras en la descripción"}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};


export type KB = "in" | "out" | "left" | "right" | "up" | "down" | "none";
const isVideo = (s: string) => /\.(mp4|mov|webm)$/i.test(s);
const easeIO = (t: number) => { const x = clamp(t); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
// Plano base: foto con Ken-Burns o clip (ya conformado a 1920x1080, 30 fps, sin audio).
const Media: React.FC<{ src: string; start?: number; rate?: number; kb?: KB; zoom?: number; filter?: string; pos?: string }> = ({ src, start = 0, rate = 1, kb = "in", zoom = 1.08, filter, pos = "50% 50%" }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames: D } = useVideoConfig();
  const t = easeIO(f / Math.max(1, D));
  const z = zoom - 1;
  let s = 1, x = 0, y = 0;
  if (kb === "in") s = 1 + z * t; else if (kb === "out") s = zoom - z * t;
  else if (kb === "left") { s = zoom; x = interpolate(t, [0, 1], [2.5, -2.5]); } else if (kb === "right") { s = zoom; x = interpolate(t, [0, 1], [-2.5, 2.5]); }
  else if (kb === "up") { s = zoom; y = interpolate(t, [0, 1], [2.5, -2.5]); } else if (kb === "down") { s = zoom; y = interpolate(t, [0, 1], [-2.5, 2.5]); }
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${s}) translate(${x}%, ${y}%)`, filter };
  const url = /^(https?:|data:|\/)/.test(src) ? src : staticFile(src);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      {isVideo(src) ? <OffthreadVideo src={url} startFrom={Math.round(start * fps)} playbackRate={rate} muted style={st} /> : <Img src={url} style={st} />}
    </AbsoluteFill>
  );
};
const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.35 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)` }} />
);

const COMPS: Record<string, React.FC<any>> = { RecipeStamp, Truco, Chapter, BookCta };
const XF = 10;

const BeatView: React.FC<{ b: Beat; fadeIn: boolean }> = ({ b, fadeIn }) => {
  const f = useCurrentFrame();
  const o = fadeIn ? clamp(f / XF) : 1;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Media src={b.src} start={b.start} rate={b.rate} kb={b.kb ?? "in"} zoom={b.zoom ?? 1.08} filter={b.filter} pos={b.pos} />
    </AbsoluteFill>
  );
};

export const RosaMain: React.FC<{ plan: Plan }> = ({ plan }) => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {plan.beats.map((b, i) => {
        const dis = b.tr === "dissolve" && i > 0;
        const from = dis ? Math.max(0, b.from - XF) : b.from;
        return (
          <Sequence key={"b" + i} from={from} durationInFrames={b.dur + (b.from - from)} layout="none">
            <BeatView b={b} fadeIn={dis} />
          </Sequence>
        );
      })}
      {plan.overlays.map((c, i) => {
        const C = COMPS[c.comp];
        return C ? <Sequence key={"o" + i} from={c.from} durationInFrames={c.dur}><C {...c.props} /></Sequence> : null;
      })}
      <Vignette strength={0.35} />
      {plan.audio ? <Audio src={staticFile(plan.audio)} /> : null}
    </AbsoluteFill>
  );
};
export { interpolate };
