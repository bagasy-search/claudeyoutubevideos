// Kit Loretta (lor11 S1) — tres papeles según el video: "box" (caja de recetas: fichas rayadas con cinta),
// "notebook" (cuaderno de una sola persona: espiral, porciones marcadas), "church" (cookbook de iglesia: crema y tinta marrón).
// Sin grano, sin viñeta, sin filtros de color. Todo objeto de papel; fotos y clips a pantalla completa.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/Spectral";
import { loadFont as loadSans } from "@remotion/google-fonts/WorkSans";
import { loadFont as loadHand } from "@remotion/google-fonts/Kalam";
import { THEME, LABEL } from "./cues.gen";

const { fontFamily: SERIF } = loadSerif("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });
const { fontFamily: SANS } = loadSans("normal", { weights: ["500", "600"], subsets: ["latin"] });
const { fontFamily: HAND } = loadHand("normal", { weights: ["400", "700"], subsets: ["latin"] });
export const FONTS = { SERIF, SANS, HAND };

const THEMES: Record<string, any> = {
  box: { paper: "#FBF7EC", paper2: "#F2EBD8", line: "rgba(86,124,170,0.32)", head: "#C2453A", ink: "#2A2520", pen: "#2F4A7A", acc: "#C2453A", tape: "rgba(236,224,190,0.88)", bgTint: "rgba(24,16,10,0.5)" },
  notebook: { paper: "#FCFCF6", paper2: "#F1F1E6", line: "rgba(90,140,190,0.30)", head: "#D46A5A", ink: "#22304A", pen: "#22407A", acc: "#3D7F55", tape: "rgba(214,232,214,0.85)", bgTint: "rgba(14,18,24,0.5)" },
  church: { paper: "#F3E8D2", paper2: "#E9DABD", line: "rgba(120,84,50,0.20)", head: "#8C3B22", ink: "#4A2E1A", pen: "#5A3A22", acc: "#8C3B22", tape: "rgba(226,210,176,0.9)", bgTint: "rgba(30,18,8,0.52)" },
};
export const T = THEMES[THEME] || THEMES.box;
export const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cl = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const hash = (n: number) => { let x = Math.imul(n + 1, 2654435761) >>> 0; x ^= x >>> 16; x = Math.imul(x, 2246822507) >>> 0; x ^= x >>> 13; x = Math.imul(x, 3266489909) >>> 0; x ^= x >>> 16; return x >>> 0; };
const r01 = (seed: number, k: number) => (hash(seed * 31 + k * 977) % 100000) / 100000;
export const useIn = (delay = 0, damping = 18) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - delay, fps, config: { damping, mass: 0.7 } }); };
export const useOut = (dur: number, len = 10) => { const f = useCurrentFrame(); return interpolate(f, [dur - len, dur], [1, 0], CL); };
export const shadow = "0 2px 16px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6)";

// ---------- encuadre propio (Ken Burns sorteado), nunca quieto
export const useKB = (seed: number, dur: number, clip = false) => {
  const f = useCurrentFrame();
  const out = hash(seed) % 2 === 1;
  const rate = clip ? 0.006 + r01(seed, 1) * 0.008 : 0.016 + r01(seed, 1) * 0.02;
  const amp = Math.min(clip ? 0.08 : 0.18, rate * (dur / 30));
  const t = Easing.inOut(Easing.sin)(cl(f / Math.max(1, dur), 0, 1));
  const k = out ? 1 - t : t;
  const z = (clip ? 1.08 : 1.05) + amp * k;
  const ox = 35 + r01(seed, 2) * 30, oy = 35 + r01(seed, 3) * 30, ang = r01(seed, 4) * Math.PI * 2;
  return { transform: `translate(${Math.cos(ang) * 1.8 * k}%, ${Math.sin(ang) * 1.1 * k}%) scale(${z})`, transformOrigin: `${ox}% ${oy}%` } as React.CSSProperties;
};

export const Photo: React.FC<{ src: string; seed: number; dur: number }> = ({ src, seed, dur }) => {
  const kb = useKB(seed, dur);
  return <AbsoluteFill style={{ overflow: "hidden", background: "#111" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} /></AbsoluteFill>;
};

// clip real: mudo (su ambiente de cocina va premezclado en la pista), encuadre propio
export const Clip: React.FC<{ src: string; seed: number; dur: number; clipDur?: number; minRate?: number }> = ({ src, seed, dur, clipDur, minRate = 0.75 }) => {
  const kb = useKB(seed, dur, true);
  const rate = clipDur && clipDur < dur / 30 + 0.1 ? Math.max(minRate, (clipDur - 0.15) / (dur / 30)) : 1;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#111" }}><OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} /></AbsoluteFill>;
};

// avatar con encuadres variados: plano normal / cerrado (punch) / corrido para la foto al lado (split); "mano" = vaivén lento de cámara en mano
export const AvatarFramed: React.FC<{ src: string; seed: number; dur: number; mods?: { a: number; b: number; k: string }[]; mano?: boolean }> = ({ src, seed, dur, mods = [], mano }) => {
  const f = useCurrentFrame();
  const v = hash(seed + 99) % 4; // 0 empuje, 1 abre, 2 cerrado fijo-lento, 3 medio
  const t = f / Math.max(1, dur);
  let z = v === 0 ? 1.03 + 0.05 * t : v === 1 ? 1.09 - 0.05 * t : v === 2 ? 1.16 + 0.02 * t : 1.06;
  let tx = 0, ty = 0, rot = 0;
  for (const m of mods) {
    const ra = m.k === "punch" ? 4 : 12, rb = m.k === "punch" ? 6 : 10;
    const w = interpolate(f, [m.a, m.a + ra, Math.max(m.a + ra + 1, m.b - rb), Math.max(m.a + ra + 2, m.b)], [0, 1, 1, 0], { ...CL, easing: Easing.inOut(Easing.cubic) });
    if (m.k === "punch") z *= 1 + 0.12 * w;
    if (m.k === "split") tx += -24 * w;
  }
  if (mano) { const g = (seed % 7) * 40; tx += 0.35 * Math.sin((f + g) / 47) + 0.2 * Math.sin((f + g) / 23); ty += 0.25 * Math.sin((f + g) / 61); rot = 0.18 * Math.sin((f + g) / 71); z *= 1.03; }
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#111" }}>
      <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translate(${tx}%, ${ty}%) rotate(${rot}deg) scale(${z})`, transformOrigin: "55% 30%" }} />
    </AbsoluteFill>
  );
};

// ---------- el papel del video
export const Paper: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; head?: boolean; tape?: boolean }> = ({ style, children, head = true, tape = true }) => {
  const lines = THEME === "church" ? "none" : `repeating-linear-gradient(180deg, transparent 0 47px, ${T.line} 47px 49px)`;
  return (
    <div style={{ position: "relative", background: `linear-gradient(180deg, ${T.paper} 0%, ${T.paper2} 100%)`, boxShadow: "0 24px 60px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.25)", borderRadius: THEME === "box" ? 10 : 3, ...style }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: lines, backgroundPosition: "0 118px", borderRadius: "inherit", opacity: 0.95 }} />
      {THEME === "box" && head && <div style={{ position: "absolute", left: 0, right: 0, top: 112, height: 3, background: T.head, opacity: 0.75 }} />}
      {THEME === "notebook" && (
        <>
          <div style={{ position: "absolute", left: 92, top: 0, bottom: 0, width: 2, background: T.head, opacity: 0.55 }} />
          <div style={{ position: "absolute", left: 18, top: 30, bottom: 30, width: 34, backgroundImage: "radial-gradient(circle at 17px 17px, rgba(40,44,52,0.85) 0 9px, transparent 10px)", backgroundSize: "34px 58px" }} />
        </>
      )}
      {THEME === "church" && <div style={{ position: "absolute", inset: 18, border: `2px solid ${T.ink}`, opacity: 0.35 }} />}
      {tape && THEME !== "church" && (
        <>
          <div style={{ position: "absolute", left: 60, top: -20, width: 170, height: 46, background: T.tape, transform: "rotate(-5deg)", boxShadow: "0 2px 5px rgba(0,0,0,0.15)" }} />
          <div style={{ position: "absolute", right: 60, top: -18, width: 170, height: 46, background: T.tape, transform: "rotate(4deg)", boxShadow: "0 2px 5px rgba(0,0,0,0.15)" }} />
        </>
      )}
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
};

// sello de la iglesia (solo church)
export const Stamp: React.FC<{ text?: string; delay?: number; style?: React.CSSProperties }> = ({ text = "FROM MY CHURCH COOKBOOK", delay = 8, style }) => {
  const p = useIn(delay, 11);
  return (
    <div style={{ position: "absolute", border: `5px double ${T.acc}`, color: T.acc, fontFamily: SANS, fontWeight: 600, letterSpacing: 5, fontSize: 24, padding: "10px 20px", borderRadius: 6, opacity: 0.85 * p,
      transform: `rotate(-7deg) scale(${interpolate(p, [0, 1], [1.8, 1])})`, ...style }}>{text}</div>
  );
};

// fondo: foto real oscurecida (sin desenfoque ni filtros)
export const Fondo: React.FC<{ src?: string; seed?: number; dur: number }> = ({ src, seed = 1, dur }) => (
  <AbsoluteFill>
    {src ? (src.endsWith(".mp4") ? <Clip src={src} seed={seed} dur={dur} /> : <Photo src={src} seed={seed} dur={dur} />) : <AbsoluteFill style={{ background: "#3A2C20" }} />}
    <AbsoluteFill style={{ background: T.bgTint }} />
  </AbsoluteFill>
);

const Typed: React.FC<{ txt: string; at: number; speed?: number; style?: React.CSSProperties }> = ({ txt, at, speed = 0.9, style }) => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [at, at + txt.length * speed], [0, txt.length], CL));
  return <span style={style}>{txt.slice(0, n)}<span style={{ opacity: 0 }}>{txt.slice(n)}</span></span>;
};

// ---------- (receta) tarjeta a pantalla completa: cantidades exactas, °F, tiempo, porciones; cada renglón cuando ella lo lee
export const RecipeCard: React.FC<{ n: number; N: number; title: string; meta: string[]; items: { txt: string; f: number }[]; steps: string[]; keeps?: string; bg?: string; dur: number; recap?: boolean }> = ({ n, N, title, meta, items, steps, keeps, bg, dur, recap }) => {
  const f = useCurrentFrame();
  const p = useIn(0, 19), o = useOut(dur, 8);
  const tilt = (hash(n + (recap ? 50 : 0)) % 2 ? 1 : -1) * 0.8;
  const big = items.length > 6;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={n * 13 + 1} dur={dur} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Paper style={{ width: 1640, height: 930, padding: "26px 70px 30px 120px", transform: `translateY(${(1 - p) * 700}px) rotate(${tilt * p}deg) scale(${1 + 0.012 * (f / Math.max(1, dur))})` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", height: 92 }}>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 70, color: T.ink, lineHeight: 1.1 }}>{title}</div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 4, color: T.acc, marginTop: 18, whiteSpace: "nowrap" }}>{recap ? "ONCE MORE · " : ""}{LABEL} {n} OF {N}</div>
          </div>
          <div style={{ display: "flex", gap: 14, margin: "22px 0 12px" }}>
            {meta.map((m, i) => { const q = useIn(6 + i * 4, 16); return <div key={i} style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: T.paper, background: i === 0 ? T.acc : T.ink, padding: "6px 18px", borderRadius: 20, opacity: q, transform: `scale(${0.8 + 0.2 * q})` }}>{m}</div>; })}
          </div>
          <div style={{ display: "flex", gap: 60 }}>
            <div style={{ width: 760 }}>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 5, color: T.acc, height: 49, lineHeight: "49px" }}>YOU NEED</div>
              {items.map((it, i) => (
                <div key={i} style={{ height: big ? 49 : 56, display: "flex", alignItems: "flex-end", gap: 14 }}>
                  <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: big ? 36 : 42, color: T.pen, opacity: f >= it.f ? 1 : 0 }}>•</span>
                  <Typed txt={it.txt} at={it.f} style={{ fontFamily: HAND, fontWeight: 700, fontSize: big ? 36 : 42, color: T.pen }} />
                </div>
              ))}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 5, color: T.acc, height: 49, lineHeight: "49px" }}>{LABEL === "RECIPE" ? "HOW I MAKE IT" : "HOW I DO IT"}</div>
              {steps.map((s, i) => { const q = useIn(recap ? 6 + i * 3 : 14 + i * 5, 18); return (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "baseline", marginBottom: 10, opacity: q }}>
                  <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 32, color: T.acc }}>{i + 1}.</span>
                  <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 30, color: T.ink, lineHeight: 1.22 }}>{s}</span>
                </div>
              ); })}
              {keeps && <div style={{ marginTop: 18, fontFamily: HAND, fontWeight: 700, fontSize: 32, color: T.acc, transform: "rotate(-1deg)", opacity: useIn(recap ? 14 : 40, 18) }}>Keeps: {keeps}</div>}
            </div>
          </div>
          {THEME === "church" && <Stamp style={{ right: 60, bottom: 40 }} />}
        </Paper>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- (3) apertura de capítulo: la ficha de la receta entra como objeto sobre el plato terminado
export const ChapterOpen: React.FC<{ n: number | string; N: number; title: string; src: string; dur: number }> = ({ n, N, title, src, dur }) => {
  const f = useCurrentFrame();
  const o = useOut(dur, 8);
  const p = spring({ frame: f - 6, fps: 30, config: { damping: 13, mass: 0.8 } });
  const right = typeof n === "number" ? n % 2 === 0 : true;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Photo src={src} seed={typeof n === "number" ? n * 7 + 3 : 77} dur={dur} />
      <div style={{ position: "absolute", top: 250, ...(right ? { right: 130 } : { left: 130 }), transform: `translateY(${(1 - p) * -900}px) rotate(${(right ? 3 : -3) * p + (1 - p) * 18}deg)` }}>
        <Paper style={{ width: 760, padding: "26px 54px 40px 110px" }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, letterSpacing: 7, color: T.acc, height: 70, lineHeight: "70px" }}>{typeof n === "number" ? `${LABEL} ${n} OF ${N}` : String(n).toUpperCase()}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 88, color: T.ink, lineHeight: 1.05, marginTop: 30 }}>
            <Typed txt={title} at={18} speed={1.2} />
          </div>
          {THEME === "church" && <Stamp style={{ right: 30, bottom: -26 }} delay={26} />}
        </Paper>
      </div>
    </AbsoluteFill>
  );
};

// ---------- (2) progreso "recipe X of N": pestañas de ficha arriba a la DERECHA
export const Progress: React.FC<{ n: number; N: number; title: string; dur: number }> = ({ n, N, title, dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8, dur - 8, dur], [0, 1, 1, 0], CL);
  return (
    <div style={{ position: "absolute", right: 54, top: 44, opacity: o, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 21, letterSpacing: 3, color: "#FFF8EA", textShadow: shadow }}>{LABEL} {n} OF {N} · {title.toUpperCase()}</div>
      <div style={{ display: "flex", gap: N > 12 ? 3 : 5 }}>
        {Array.from({ length: N }, (_, i) => (
          <div key={i} style={{ width: N > 12 ? 13 : 40, height: N > 12 ? 12 : 14, borderRadius: "5px 5px 0 0", background: i < n ? (i === n - 1 ? T.acc : T.paper) : "rgba(255,250,240,0.35)", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }} />
        ))}
      </div>
    </div>
  );
};

// ---------- (1) carrusel: las N recetas como fichas que giran y terminan en abanico
export const Carousel: React.FC<{ cards: { title: string; src: string }[]; bg?: string; head: string; dur: number }> = ({ cards, bg, head, dur }) => {
  // (1) fichas paradas dentro de la caja de recetas, vistas de frente; cada una sube sola en su turno y vuelve a su lugar
  const f = useCurrentFrame(); const o = useOut(dur, 10); const pIn = useIn(0, 22); const N = cards.length;
  const k = Math.max(14, (dur - 40) / N);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={909} dur={dur} />
      <div style={{ position: "absolute", top: 40, width: "100%", textAlign: "center", opacity: pIn, fontFamily: HAND, fontWeight: 700, fontSize: 84, color: "#FFF6E4", textShadow: shadow }}>{head}</div>
      {cards.map((c, i) => {
        const j = N - 1 - i; // la 1 adelante
        const t0 = 12 + i * k;
        const up = Easing.out(Easing.cubic)(cl((f - t0) / 9, 0, 1)) * (1 - Easing.in(Easing.cubic)(cl((f - t0 - k - 4) / 9, 0, 1)));
        const last = i === N - 1 ? Easing.out(Easing.cubic)(cl((f - t0) / 9, 0, 1)) : up;
        const y = 420 - j * 26 - last * 300, x = 560 + (j % 2 ? 14 : -14), sc = 1 - j * 0.035 + last * 0.06;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 800, zIndex: 100 - j + Math.round(last * 50), transform: `scale(${sc})`, transformOrigin: "50% 100%", filter: `brightness(${1 - j * 0.06 + last * 0.06 * j})` }}>
            <div style={{ marginLeft: 40 + (i * 103) % 560, width: 170, height: 46, background: T.paper2, borderRadius: "10px 10px 0 0", fontFamily: SANS, fontWeight: 700, fontSize: 24, color: T.acc, display: "flex", alignItems: "center", justifyContent: "center" }}>{String(i + 1).padStart(2, "0")}</div>
            <div style={{ background: T.paper, padding: 16, borderRadius: "0 8px 8px 8px", boxShadow: "0 -8px 30px rgba(0,0,0,0.35)", backgroundImage: `repeating-linear-gradient(180deg, transparent 0 38px, ${T.line} 38px 40px)` }}>
              <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                <div style={{ width: 380, height: 250, overflow: "hidden", borderRadius: 4, flex: "none" }}><Img src={staticFile(c.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: T.ink, lineHeight: 1.05 }}>{c.title}</span>
              </div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 470, top: 700, width: 980, height: 380, zIndex: 400, background: "linear-gradient(180deg, #8A5A34, #6B4226)", borderRadius: "10px 10px 0 0", boxShadow: "0 -14px 40px rgba(0,0,0,0.5), inset 0 6px 0 rgba(255,220,170,0.25)" }}>
        <div style={{ position: "absolute", left: 390, top: 60, width: 200, height: 70, border: "4px solid #C9A46A", borderRadius: 6, background: "#F3E7CF", fontFamily: HAND, fontSize: 34, color: "#5A3A22", display: "flex", alignItems: "center", justifyContent: "center" }}>{LABEL === "RECIPE" ? "Recipes" : LABEL.charAt(0) + LABEL.slice(1).toLowerCase() + "s"}</div>
      </div>
    </AbsoluteFill>
  );
};

export const MapIowa: React.FC<{ map: string; town: [number, number]; label: string; sub?: string; dur: number }> = ({ map, town, label, sub, dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8, dur - 10, dur], [0, 1, 1, 0], CL);
  const k = Easing.out(Easing.cubic)(cl((f - 6) / 50, 0, 1));
  const z = lerp(1.0, 1.55, k), ox = lerp(50, town[0], k), oy = lerp(50, town[1], k);
  const pin = spring({ frame: f - 34, fps: 30, config: { damping: 10 } });
  const lab = spring({ frame: f - 46, fps: 30, config: { damping: 16 } });
  const big = interpolate(f, [0, 14], [0, 1], CL);
  return (
    <AbsoluteFill style={{ opacity: o, background: T.paper, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${ox}% ${oy}%` }}>
        <Img src={staticFile(map)} style={{ width: "100%", height: "100%", objectFit: "fill" }} />
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", fontFamily: SERIF, fontWeight: 700, fontSize: 210, letterSpacing: 40, color: "rgba(92,62,40,0.13)", opacity: big }}>IOWA</div>
        <div style={{ position: "absolute", left: `${town[0]}%`, top: `${town[1]}%`, transform: `translate(-50%,-100%) scale(${pin / z})`, transformOrigin: "50% 100%" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", background: T.acc, boxShadow: "0 6px 14px rgba(0,0,0,0.35)" }} />
        </div>
        <div style={{ position: "absolute", left: `${town[0]}%`, top: `${town[1]}%`, transform: `translate(${40 / z}px, -${110 / z}px) scale(${1 / z})`, transformOrigin: "0 0", opacity: lab, whiteSpace: "nowrap" }}>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 80, color: T.ink }}>{label}</div>
          {sub && <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, letterSpacing: 4, color: T.acc }}>{sub}</div>}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- (8) foto de época como objeto: hoja de álbum con esquineros, sin grano ni viñeta
export const Album: React.FC<{ src: string; seed: number; dur: number; caption?: string }> = ({ src, seed, dur, caption }) => {
  const f = useCurrentFrame(); const t = f / Math.max(1, dur);
  const r = (hash(seed) % 2 ? 1 : -1) * (1.2 + (hash(seed + 1) % 3) * 0.6);
  const corner = (s: React.CSSProperties) => <div style={{ position: "absolute", width: 0, height: 0, borderStyle: "solid", ...s }} />;
  return (
    <AbsoluteFill style={{ background: "#2E241B", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "#3A2E22", backgroundImage: "repeating-linear-gradient(90deg, rgba(255,240,210,0.035) 0 2px, transparent 2px 14px)" }} />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.05 * t}) rotate(${-0.5 * t}deg)` }}>
        <div style={{ position: "absolute", left: 300, top: 70, width: 1320, padding: "34px 34px 90px", background: "#F1E8D4", transform: `rotate(${r}deg)`, boxShadow: "0 34px 80px rgba(0,0,0,0.6)" }}>
          <div style={{ width: 1252, height: 760, overflow: "hidden", position: "relative" }}>
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {corner({ left: 0, top: 0, borderWidth: "56px 56px 0 0", borderColor: "#1E1914 transparent transparent transparent" })}
            {corner({ right: 0, top: 0, borderWidth: "0 56px 56px 0", borderColor: "transparent #1E1914 transparent transparent" })}
            {corner({ left: 0, bottom: 0, borderWidth: "56px 0 0 56px", borderColor: "transparent transparent transparent #1E1914" })}
            {corner({ right: 0, bottom: 0, borderWidth: "0 0 56px 56px", borderColor: "transparent transparent #1E1914 transparent" })}
          </div>
          {caption && <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 52, color: "#3B3026" }}>{caption}</div>}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// polaroid sobre la mesa (plano completo)
export const PolaroidShot: React.FC<{ src: string; caption: string; bg?: string; seed: number; dur: number }> = ({ src, caption, bg, seed, dur }) => {
  const f = useCurrentFrame();
  const p = spring({ frame: f - 3, fps: 30, config: { damping: 12, mass: 0.8 } });
  const r = (hash(seed) % 2 ? 1 : -1) * (3 + (hash(seed + 3) % 4));
  return (
    <AbsoluteFill>
      <Fondo src={bg} seed={seed} dur={dur} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ background: "#FBF8F1", padding: "30px 30px 120px", boxShadow: "0 34px 70px rgba(0,0,0,0.55)", transform: `translateY(${(1 - p) * -1100}px) rotate(${r + (1 - p) * 20}deg) scale(${1 + 0.03 * (f / Math.max(1, dur))})`, position: "relative" }}>
          <div style={{ width: 900, height: 680, overflow: "hidden" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 28, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 64, color: "#2A2520" }}>{caption}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- (9) dato con fuente real
export const Stat: React.FC<{ head: string; title: string; lines: string[]; foot: string; bg?: string; dur: number }> = ({ head, title, lines, foot, bg, dur }) => {
  const p = useIn(0, 18), o = useOut(dur, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={4141} dur={dur} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Paper style={{ width: 1280, padding: "30px 70px 44px 120px", transform: `translateY(${(1 - p) * 600}px) rotate(-0.8deg)` }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 6, color: T.acc, height: 84, lineHeight: "84px" }}>{head}</div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 76, color: T.ink, margin: "26px 0 18px", lineHeight: 1.05 }}>{title}</div>
          {lines.map((l, i) => { const q = useIn(14 + i * 9, 18); return <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: T.pen, opacity: q, transform: `translateX(${(1 - q) * 30}px)`, marginBottom: 4 }}>— {l}</div>; })}
          <div style={{ height: 2, background: T.ink, opacity: 0.25, margin: "22px 0 14px" }} />
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 26, color: T.ink, opacity: 0.8 }}>Source: {foot}</div>
        </Paper>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// termómetro de cocina (°F) a pantalla completa
export const Thermo: React.FC<{ deg: number; label: string; sub?: string; foot?: string; bg?: string; dur: number }> = ({ deg, label, sub, foot, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = useIn(0, 16);
  const t = interpolate(f, [6, 44], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const v = Math.round(40 + (deg - 40) * t);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={165} dur={dur} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 70 }}>
        <div style={{ width: 120, height: 700, position: "relative", opacity: p }}>
          <div style={{ position: "absolute", left: 30, top: 0, width: 60, height: 600, borderRadius: 30, background: T.paper, boxShadow: "0 14px 30px rgba(0,0,0,0.4)" }} />
          <div style={{ position: "absolute", left: 44, bottom: 90, width: 32, height: 520 * (0.1 + 0.9 * t), borderRadius: 16, background: T.acc }} />
          <div style={{ position: "absolute", left: 0, bottom: 0, width: 120, height: 120, borderRadius: "50%", background: T.acc, boxShadow: "0 14px 30px rgba(0,0,0,0.4)" }} />
        </div>
        <div style={{ opacity: p }}>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 230, lineHeight: 0.9, color: "#FFF8EA", textShadow: shadow }}>{v}°F</div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 34, letterSpacing: 5, color: "#FFF1DC", textShadow: shadow, marginTop: 12 }}>{label.toUpperCase()}</div>
          {sub && <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: "#FFE7C4", textShadow: shadow, marginTop: 16, opacity: interpolate(f, [40, 54], [0, 1], CL) }}>{sub}</div>}
          {foot && <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 24, color: "#F4E6D0", textShadow: shadow, marginTop: 20 }}>Source: {foot}</div>}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// perilla del horno vieja: gira hasta la temperatura; el tiempo al lado
export const OvenDial: React.FC<{ deg: number; min: number; txt?: string; bg?: string; dur: number }> = ({ deg, min, txt, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = useIn(0, 14);
  const t = interpolate(f, [4, 34], [0, 1], { ...CL, easing: Easing.out(Easing.back(1.3)) });
  const ang = -135 + ((deg - 200) / 300) * 270 * t;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={375} dur={dur} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 90 }}>
        <div style={{ width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #FFFFFF 0%, #E9E4DA 60%, #C9C1B2 100%)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", position: "relative", opacity: p, transform: `scale(${0.7 + 0.3 * p})` }}>
          {[200, 250, 300, 350, 400, 450, 500].map((d, i) => { const a = (-135 + ((d - 200) / 300) * 270) * Math.PI / 180; return (
            <div key={d} style={{ position: "absolute", left: 230 + Math.sin(a) * 180 - 40, top: 230 - Math.cos(a) * 180 - 18, width: 80, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 28, color: d === deg ? T.acc : "#3A332B" }}>{d}</div>
          ); })}
          <div style={{ position: "absolute", left: 130, top: 130, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #FAFAF7, #D6D0C4)", boxShadow: "0 6px 14px rgba(0,0,0,0.35)", transform: `rotate(${ang}deg)` }}>
            <div style={{ position: "absolute", left: 92, top: 6, width: 16, height: 80, borderRadius: 8, background: T.acc }} />
          </div>
        </div>
        <div style={{ opacity: p }}>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 200, lineHeight: 0.9, color: "#FFF8EA", textShadow: shadow }}>{Math.round(200 + (deg - 200) * Math.min(1, t))}°F</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 84, color: "#FFE7C4", textShadow: shadow, marginTop: 10, opacity: interpolate(f, [26, 40], [0, 1], CL) }}>{txt || `${min} minutes`}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// reloj de cocina: dos tiempos (grande y chico)
export const Timer: React.FC<{ a: number; b?: number; la: string; lb?: string; unit?: string; bg?: string; dur: number }> = ({ a, b, la, lb, unit = "min", bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const dial = (min: number, label: string, delay: number, size: number) => {
    const p = spring({ frame: f - delay, fps: 30, config: { damping: 14 } });
    const set = interpolate(f, [delay + 4, delay + 30], [0, min], { ...CL, easing: Easing.out(Easing.back(1.4)) });
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: p, transform: `scale(${0.7 + 0.3 * p})` }}>
        <div style={{ width: size, height: size, borderRadius: "50%", background: "#F7F3EC", border: `10px solid ${T.acc}`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)", position: "relative" }}>
          {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: size / 2 - 3 - 10, top: 8, width: 6, height: 26, background: "#2A2520", transformOrigin: `3px ${size / 2 - 18}px`, transform: `rotate(${i * 30}deg)` }} />)}
          <div style={{ position: "absolute", left: size / 2 - 16, top: size / 2 - 16, width: 32, height: 32, borderRadius: "50%", background: T.acc }} />
          <div style={{ position: "absolute", left: size / 2 - 5, top: size * 0.12, width: 10, height: size * 0.38, borderRadius: 5, background: "#2A2520", transformOrigin: `5px ${size * 0.38}px`, transform: `rotate(${(set / 60) * 360}deg)` }} />
        </div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 90, color: "#FFF8EA", textShadow: shadow, marginTop: 16 }}>{Math.round(set)} {unit}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: "#FFE7C4", textShadow: shadow }}>{label}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={3025} dur={dur} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 140 }}>
        {dial(a, la, 2, 400)}
        {b != null && dial(b, lb || "", 40, 300)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// regla de las 2 horas: reloj que corre hasta 2 h y se marca
export const Clock2h: React.FC<{ head: string; sub: string; foot: string; bg?: string; dur: number }> = ({ head, sub, foot, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = useIn(0, 14);
  const t = interpolate(f, [6, 40], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const R = 200;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={22} dur={dur} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 90 }}>
        <div style={{ width: R * 2, height: R * 2, borderRadius: "50%", background: `conic-gradient(${T.acc} 0deg ${60 * t}deg, ${T.paper} ${60 * t}deg 360deg)`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)", position: "relative", opacity: p }}>
          <div style={{ position: "absolute", inset: 28, borderRadius: "50%", background: T.paper }} />
          {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: R - 4, top: 34, width: 8, height: i % 3 ? 18 : 30, background: T.ink, transformOrigin: `4px ${R - 34}px`, transform: `rotate(${i * 30}deg)` }} />)}
          <div style={{ position: "absolute", left: R - 7, top: R - 120, width: 14, height: 120, borderRadius: 7, background: T.ink, transformOrigin: "7px 120px", transform: `rotate(${60 * t}deg)` }} />
          <div style={{ position: "absolute", left: R - 18, top: R - 18, width: 36, height: 36, borderRadius: "50%", background: T.acc }} />
        </div>
        <div style={{ opacity: p, maxWidth: 820 }}>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 110, lineHeight: 0.95, color: "#FFF8EA", textShadow: shadow }}>{head}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: "#FFE7C4", textShadow: shadow, marginTop: 14, opacity: interpolate(f, [30, 44], [0, 1], CL) }}>{sub}</div>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 24, color: "#F4E6D0", textShadow: shadow, marginTop: 20 }}>Source: {foot}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- lista en papel con renglones que se escriben a su palabra (horario del horno / compras / errores / guardado)
export const ListCard: React.FC<{ head: string; title: string; rows: { a?: string; txt: string; f: number; done?: boolean }[]; bg?: string; dur: number; wide?: boolean; cross?: boolean }> = ({ head, title, rows, bg, dur, wide, cross }) => {
  const f = useCurrentFrame(); const p = useIn(0, 19), o = useOut(dur, 8);
  const many = rows.length > 8; const H = many ? 52 : 64, FS = many ? 38 : 46;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={hash(rows.length + title.length)} dur={dur} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Paper style={{ width: wide ? 1640 : 1240, height: 940, padding: "22px 70px 30px 120px", transform: `translateY(${(1 - p) * 700}px) rotate(${wide ? 0.6 : -0.9}deg)` }}>
          <div style={{ display: "flex", justifyContent: "space-between", height: 92 }}>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 66, color: T.ink }}>{title}</div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 5, color: T.acc, marginTop: 20 }}>{head}</div>
          </div>
          <div style={{ marginTop: 26 }}>
            {rows.map((r, i) => {
              const on = f >= r.f;
              const st = interpolate(f, [r.f + 10, r.f + 22], [0, 1], CL);
              return (
                <div key={i} style={{ display: "flex", gap: 22, alignItems: "flex-end", height: H, opacity: on ? 1 : 0, position: "relative" }}>
                  {r.a && <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: FS * 0.72, color: T.acc, width: 190, whiteSpace: "nowrap" }}>{r.a}</span>}
                  <Typed txt={r.txt} at={r.f} speed={0.8} style={{ fontFamily: HAND, fontWeight: 700, fontSize: FS, color: T.pen }} />
                  {cross && on && <div style={{ position: "absolute", left: r.a ? 212 : 0, top: H * 0.55, height: 4, width: `${st * 70}%`, background: T.acc, transform: "rotate(-1deg)", opacity: 0.85 }} />}
                </div>
              );
            })}
          </div>
          {THEME === "church" && <Stamp style={{ right: 60, bottom: 40 }} />}
        </Paper>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// tabla de guardado: heladera / freezer
export const Guarda: React.FC<{ rows: { item: string; fridge: string; freezer: string; f: number }[]; bg?: string; dur: number }> = ({ rows, bg, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 19), o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={566} dur={dur} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Paper style={{ width: 1500, padding: "22px 70px 40px 120px", transform: `translateY(${(1 - p) * 700}px) rotate(0.7deg)` }}>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 66, color: T.ink, height: 92 }}>How long it keeps</div>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", rowGap: 4, marginTop: 24 }}>
            {["", "REFRIGERATOR", "FREEZER"].map((h, i) => <div key={i} style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 4, color: T.acc, height: 48, lineHeight: "48px" }}>{h}</div>)}
            {rows.map((r, i) => [r.item, r.fridge, r.freezer].map((c, j) => (
              <div key={i + "-" + j} style={{ height: 56, display: "flex", alignItems: "flex-end", fontFamily: HAND, fontWeight: 700, fontSize: 42, color: j === 0 ? T.ink : T.pen, opacity: f >= r.f ? 1 : 0.0 }}>{c}</div>
            )))}
          </div>
        </Paper>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// cartas de los comentarios: sobres que caen y la carta se abre con el título
export const Cartas: React.FC<{ title: string; bg?: string; dur: number }> = ({ title, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={513} dur={dur} />
      {[0, 1, 2, 3, 4].map((i) => {
        const p = spring({ frame: f - i * 3, fps: 30, config: { damping: 12 } });
        return <div key={i} style={{ position: "absolute", left: 360 + i * 240, top: 330 + (i % 2) * 90, width: 420, height: 270, background: i % 2 ? "#F4ECDC" : "#EADFC8", boxShadow: "0 14px 30px rgba(0,0,0,0.4)", transform: `translateY(${(1 - p) * -900}px) rotate(${((i * 37) % 17) - 8}deg)` }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(155deg, transparent 49%, rgba(0,0,0,0.08) 50%, transparent 51%), linear-gradient(25deg, transparent 49%, rgba(0,0,0,0.08) 50%, transparent 51%)" }} />
          <div style={{ position: "absolute", right: 22, top: 18, width: 54, height: 64, border: `3px dashed ${T.acc}`, opacity: 0.6 }} />
        </div>;
      })}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Paper head={false} style={{ padding: "40px 90px", transform: `scale(${spring({ frame: f - 14, fps: 30, config: { damping: 14 } })}) rotate(-1.5deg)` }}>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 120, color: T.ink }}>{title}</div>
        </Paper>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// libro real: página del PDF sobre la mesa, con cinta; opcional QR con link limpio (sin precio, sin decirlo)
export const BookPage: React.FC<{ src: string; bg?: string; note?: string; dur: number; seed?: number }> = ({ src, bg, note, dur, seed = 1 }) => {
  const f = useCurrentFrame(); const p = useIn(0, 18), o = useOut(dur, 8);
  const z = 1 + 0.08 * Easing.inOut(Easing.sin)(cl(f / Math.max(1, dur), 0, 1));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={seed} dur={dur} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ transform: `translateY(${(1 - p) * 900}px) rotate(${(hash(seed) % 2 ? 1 : -1) * 1.5}deg) scale(${z})`, boxShadow: "0 30px 70px rgba(0,0,0,0.55)" }}>
          <Img src={staticFile(src)} style={{ height: 1000, width: "auto", display: "block" }} />
        </div>
      </AbsoluteFill>
      {note && <div style={{ position: "absolute", right: 120, bottom: 110, opacity: interpolate(f, [20, 32], [0, 1], CL) }}>
        <Paper head={false} tape={false} style={{ padding: "14px 30px", transform: "rotate(-2deg)" }}><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: T.ink }}>{note}</div></Paper>
      </div>}
    </AbsoluteFill>
  );
};

export const BookQR: React.FC<{ cover: string; qr: string; url: string; line: string; bg?: string; dur: number }> = ({ cover, qr, url, line, bg, dur }) => {
  const p = useIn(0, 18), q = useIn(10, 16), o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={4242} dur={dur} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 110 }}>
        <Img src={staticFile(cover)} style={{ height: 860, boxShadow: "0 30px 70px rgba(0,0,0,0.55)", transform: `translateX(${(1 - p) * -900}px) rotate(-2deg)` }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: q, transform: `scale(${0.85 + 0.15 * q})` }}>
          <div style={{ background: "#FFFDF6", padding: 26, borderRadius: 12, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
            <Img src={staticFile(qr)} style={{ width: 500, height: 500, display: "block" }} />
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, color: "#FFF8EA", textShadow: shadow, marginTop: 26 }}>{url.replace(/^https?:\/\//, "")}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: "#FFE7C4", textShadow: shadow, marginTop: 8 }}>{line}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// contador grande sobre una foto (gente de la iglesia, etc.)
export const CounterShot: React.FC<{ src: string; steps: { to: number; f: number; label: string }[]; dur: number }> = ({ src, steps, dur }) => {
  const f = useCurrentFrame();
  const cur = steps.reduce((a, s, i) => (f >= s.f ? i : a), 0);
  const prev = cur ? steps[cur - 1].to : 0;
  const v = Math.round(interpolate(f, [steps[cur].f, steps[cur].f + 26], [prev, steps[cur].to], { ...CL, easing: Easing.out(Easing.quad) }));
  return (
    <AbsoluteFill>
      <Photo src={src} seed={458} dur={dur} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(14,9,5,0.7) 0%, rgba(14,9,5,0.2) 55%, rgba(0,0,0,0) 80%)" }} />
      <div style={{ position: "absolute", left: 130, top: 330 }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 250, lineHeight: 0.9, color: "#FFF8EA", textShadow: shadow }}>{v}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: "#FFE7C4", textShadow: shadow }}>{steps[cur].label}</div>
      </div>
    </AbsoluteFill>
  );
};

// cuenta del día: libreta de gastos que suma (cifras = las que ella dice)
export const Cuenta: React.FC<{ rows: { txt: string; amt: string }[]; total: string; bg?: string; dur: number }> = ({ rows, total, bg, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 18), o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={382} dur={dur} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Paper style={{ width: 1100, padding: "22px 70px 36px 120px", transform: `translateY(${(1 - p) * 700}px) rotate(-0.6deg)` }}>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: T.ink, height: 92 }}>Thanksgiving, for one</div>
          <div style={{ marginTop: 22 }}>
            {rows.map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", height: 49, alignItems: "flex-end", opacity: interpolate(f, [4 + i * 3, 10 + i * 3], [0, 1], CL) }}>
                <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 38, color: T.pen }}>{r.txt}</span>
                <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 38, color: T.pen }}>{r.amt}</span>
              </div>
            ))}
          </div>
          <div style={{ height: 4, background: T.ink, margin: "16px 0 10px", width: `${interpolate(f, [34, 48], [0, 100], CL)}%` }} />
          <div style={{ display: "flex", justifyContent: "space-between", opacity: interpolate(f, [46, 58], [0, 1], CL) }}>
            <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 4, color: T.acc, marginTop: 14 }}>ONE PLATE, ABOUT</span>
            <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 84, color: T.acc }}>{total}</span>
          </div>
        </Paper>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- overlay: etiqueta de precio de la receta (lo que ella dice que cuesta)
export const Price: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const p = useIn(0, 11), o = useOut(dur, 8);
  return (
    <div style={{ position: "absolute", right: 120, bottom: 110, opacity: o * p, transform: `rotate(${-8 + (1 - p) * -20}deg) scale(${0.6 + 0.4 * p})` }}>
      <div style={{ background: T.paper, padding: "14px 34px 14px 54px", borderRadius: "10px 40px 40px 10px", boxShadow: "0 10px 24px rgba(0,0,0,0.45)", position: "relative" }}>
        <div style={{ position: "absolute", left: 18, top: "50%", marginTop: -9, width: 18, height: 18, borderRadius: "50%", background: "rgba(40,30,20,0.55)" }} />
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 18, letterSpacing: 4, color: T.acc }}>ABOUT</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 70, color: T.ink, lineHeight: 1 }}>{text}</div>
      </div>
    </div>
  );
};

// overlay: CTA de cierre (pregunta) — sin URL ni precio
export const Pregunta: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const p = useIn(0, 18), o = useOut(dur, 10);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 90, opacity: o }}>
      <Paper head={false} style={{ padding: "18px 50px", maxWidth: 1500, transform: `translateY(${(1 - p) * 300}px) rotate(-1deg)` }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: T.ink, textAlign: "center" }}>{text}</div>
      </Paper>
    </AbsoluteFill>
  );
};

// carta de un espectador, parafraseada por Loretta: hoja de carta con doblez, se escribe a su ritmo; el sobre abierto atrás
export const Carta: React.FC<{ txt: string; n?: number; bg?: string; dur: number }> = ({ txt, n = 1, bg, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 18), o = useOut(dur, 8);
  const sp = Math.max(0.35, Math.min(1.1, (dur - 40) / Math.max(1, txt.length)));
  const r = (hash(n * 31) % 2 ? 1 : -1) * (1 + (hash(n) % 3) * 0.5);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={700 + n} dur={dur} />
      <div style={{ position: "absolute", left: 300, top: 250, width: 640, height: 400, background: "#EADFC8", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", transform: `rotate(${-r * 3}deg) translateX(${(1 - p) * -700}px)` }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(155deg, transparent 49%, rgba(0,0,0,0.10) 50%, transparent 51%), linear-gradient(25deg, transparent 49%, rgba(0,0,0,0.10) 50%, transparent 51%)" }} />
        <div style={{ position: "absolute", right: 30, top: 24, width: 70, height: 84, border: `3px dashed ${T.acc}`, opacity: 0.6 }} />
      </div>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: 1180, padding: "40px 80px 60px", background: "#FFFDF6", backgroundImage: `repeating-linear-gradient(180deg, transparent 0 63px, rgba(90,140,190,0.28) 63px 65px)`, boxShadow: "0 30px 70px rgba(0,0,0,0.5)", transform: `translateY(${(1 - p) * 800}px) rotate(${r}deg)`, position: "relative" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 2, background: "rgba(0,0,0,0.07)" }} />
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 6, color: T.acc, height: 64 }}>FROM YOUR LETTERS</div>
          <Typed txt={txt} at={12} speed={sp} style={{ fontFamily: HAND, fontWeight: 700, fontSize: txt.length > 120 ? 46 : 54, color: T.pen, lineHeight: "65px" }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
