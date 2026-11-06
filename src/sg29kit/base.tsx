// sg29kit · la BASE del video: avatar (CORTE SECO, imagen pura) ⇄ fotos / clips Veo ⇄ el jardín 3D ⇄ escenas de componente.
// Todo sale de plan.json (lo arma plan.py desde las frases del guion): {end, shots:[{a,b,k,id,...}]} + avwin.json.
// El avatar entra y sale por corte: nada de portal, iris ni barrido. Fotos con movimiento curvo (nunca zoom lineal).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { COL, FONT, cl, e, ei, rnd, s, sm, spr } from "./k";

export type Win = { n?: number; ms: number; me: number; off: number };
export type Shot = { a: number; b: number; k: "img" | "veo" | "fx" | "world"; id: string; from?: number; fb?: string; seed?: number };

export const mkBase = (slug: string, wins: Win[], reel: boolean, veoOk: Set<string>) => {
  const IMG = (id: string) => staticFile(`img/${slug}/${id}.jpg`);
  const VEO = (id: string) => staticFile(`img/${slug}/veo/${id}.mp4`);

  // ---------- el avatar: ventanas del reel, corte seco ----------
  const Avatar: React.FC<{ t: number }> = ({ t }) => {
    const face = reel ? <>{wins.map((w, i) => (t >= w.ms - 1 && t < w.me + 1 ?
      <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 20} layout="none">
        <AbsoluteFill style={{ opacity: t >= w.ms && t < w.me ? 1 : 0 }}><OffthreadVideo src={staticFile(`av/${slug}/reel0.mp4`)} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      </Sequence> : null))}</> : <Img src={IMG("av_still")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
    return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
  };
  const inAv = (t: number) => wins.some((w) => t >= w.ms && t < w.me);

  // ---------- foto con movimiento curvo (paneo en arco + leve rotación: cámara viva) ----------
  const Photo: React.FC<{ id: string; t: number; a: number; b: number; seed?: number; blur?: number }> = ({ id, t, a, b, seed = 0, blur = 0 }) => {
    const k = ei(t, a - 0.2, b + 0.4), dir = rnd(seed, 3) < 0.5 ? -1 : 1, mode = Math.floor(rnd(seed, 5) * 3);
    const sc = mode === 0 ? 1.06 + 0.1 * k : mode === 1 ? 1.17 - 0.09 * k : 1.1 + 0.03 * Math.sin(k * Math.PI);
    const x = dir * (-30 + 60 * k), y = -14 * Math.sin(k * Math.PI) + (mode === 2 ? 10 * k : 0), r = dir * 0.6 * (k - 0.5);
    return <AbsoluteFill style={{ overflow: "hidden", background: "#111" }}>
      <Img src={IMG(id)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translate(${x}px,${y}px) scale(${sc}) rotate(${r}deg)`, filter: blur ? `blur(${blur}px) brightness(.62)` : undefined }} />
    </AbsoluteFill>;
  };
  // ---------- clip Veo (8 s, mudo acá: su audio real va en la mezcla) ----------
  const Veo: React.FC<{ sh: Shot; t: number }> = ({ sh, t }) => {
    if (!veoOk.has(sh.id)) return <Photo id={sh.fb ?? "av_still"} t={t} a={sh.a} b={sh.b} seed={sh.seed ?? 1} />;
    const k = ei(t, sh.a, sh.b), sc = 1.02 + 0.035 * k;
    return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <Sequence from={s(sh.a)} durationInFrames={Math.max(1, s(sh.b - sh.a) + 2)} layout="none">
        <OffthreadVideo src={VEO(sh.id)} startFrom={s(sh.from ?? 0.3)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${sc}) translateX(${-12 * k}px)` }} />
      </Sequence>
    </AbsoluteFill>;
  };

  // ---------- ESCENARIO de cada componente: la foto de ESE momento desenfocada atrás + piso iluminado con materia ----------
  const Stage: React.FC<{ t: number; a: number; b: number; bg: string; floor?: "wood" | "paper" | "soil" | "stone"; light?: number; zoom?: number; children: React.ReactNode }> = ({ t, a, b, bg, floor = "wood", light = 1, zoom = 1.12, children }) => {
    const fl = { wood: ["#7a5636", "#4a3220"], paper: ["#efe3c8", "#bfae8a"], soil: ["#4a3424", "#22170f"], stone: ["#8b867c", "#4e4a43"] }[floor];
    const sway = Math.sin(t * 0.5) * 6;
    return <AbsoluteFill style={{ overflow: "hidden", background: "#16120d" }}>
      <Photo id={bg} t={t} a={a} b={b} seed={Math.round(a)} blur={14} />
      {/* piso: plano en perspectiva real con veta y la luz que cae encima */}
      <div style={{ position: "absolute", left: -400, right: -400, top: 610, height: 900, perspective: 900, perspectiveOrigin: `${960 + sway}px -200px` }}>
        <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 0", transform: "rotateX(62deg)",
          background: `radial-gradient(ellipse 34% 40% at 50% 30%, rgba(255,236,200,${0.42 * light}), transparent 70%), repeating-linear-gradient(90deg, rgba(0,0,0,.10) 0 2px, transparent 2px 120px), linear-gradient(180deg, ${fl[0]}, ${fl[1]})`,
          boxShadow: "inset 0 40px 80px rgba(0,0,0,.35)" }} />
      </div>
      {/* el haz de luz desde arriba (cálido, sin viñeta) */}
      <div style={{ position: "absolute", left: 960 - 520 + sway, top: -200, width: 1040, height: 1200, background: `radial-gradient(ellipse 50% 60% at 50% 20%, rgba(255,240,210,${0.16 * light}), transparent 70%)`, pointerEvents: "none" }} />
      {/* el héroe ocupa el cuadro: el contenido de la escena va más grande, centrado sobre el piso */}
      {/* entrada: la escena llega desde la profundidad con peso; salida: se aleja y se funde con la foto de atrás */}
      {(() => { const qi = Math.min(1.04, spr(t, a - 0.05, 1.1)), qo = e(t, b - 0.4, b - 0.02);
        return <AbsoluteFill style={{ transform: `scale(${zoom * (0.9 + 0.1 * qi) * (1 - 0.07 * qo)}) translateY(${(1 - qi) * 50 - 40 * qo}px)`, transformOrigin: "50% 56%", opacity: cl(qi * 1.4) * (1 - qo), filter: qo > 0.01 ? `blur(${qo * 10}px)` : undefined }}>{children}</AbsoluteFill>; })()}
    </AbsoluteFill>;
  };

  return { Avatar, inAv, Photo, Veo, Stage, IMG, VEO };
};

// ---------- sombra de contacto para objetos que "apoyan" en el piso del escenario ----------
export const Contact: React.FC<{ x: number; y: number; w: number; o?: number }> = ({ x, y, w, o = 0.55 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - w * 0.06, width: w, height: w * 0.12, borderRadius: "50%", background: `radial-gradient(ellipse at center, rgba(0,0,0,${o}), transparent 70%)` }} />
);

// ---------- texto que se ESCRIBE al ritmo de la voz (palabra por palabra) ----------
export const Spoken: React.FC<{ t: number; words: { text: string; a: number }[]; x: number; y: number; size?: number; col?: string; w?: number; hot?: string[] }> = ({ t, words, x, y, size = 54, col = COL.cream, w = 1300, hot = [] }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: 1.2, color: col, textShadow: "0 4px 18px rgba(0,0,0,.75)" }}>
    {words.map((wd, i) => { const k = cl((t - wd.a) / 0.18); if (k <= 0) return null; const h = hot.includes(wd.text.toLowerCase().replace(/[^a-z0-9']/g, ""));
      return <span key={i} style={{ display: "inline-block", marginRight: size * 0.28, opacity: k, transform: `translateY(${(1 - sm(k)) * 22}px)`, color: h ? COL.gold : undefined }}>{wd.text}</span>; })}
  </div>
);

// entrada con física (resorte con peso) desde una dirección: devuelve transform y opacidad
export const enter = (t: number, a: number, out: number, from: "up" | "down" | "left" | "right" | "deep" = "deep", k = 1) => {
  const q = spr(t, a, k), o = e(t, a, a + 0.12) * (1 - e(t, out, out + 0.3));
  const d = 1 - Math.min(1.12, q);
  const tr = from === "up" ? `translateY(${d * -260}px)` : from === "down" ? `translateY(${d * 260}px)` : from === "left" ? `translateX(${d * -380}px) rotate(${d * -8}deg)` : from === "right" ? `translateX(${d * 380}px) rotate(${d * 8}deg)` : `translateZ(${d * -900}px) rotateY(${d * -40}deg)`;
  return { tr, o, q };
};
