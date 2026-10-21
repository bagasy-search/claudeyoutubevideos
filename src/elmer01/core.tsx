// elmer01 · base del RESTO (61,6 s → final): at("frase"), avatar en TODAS las ventanas pagadas (preroll 10 cuadros, entrada/salida
// propia por ventana), el mundo del garaje con la cámara única del resto, fotos/tomas con zoom propio por plano.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { GarageWorld, Key, screenOf, camSpeed, GState } from "./garage3d";
import { P, Vid, e, ei, s } from "./lib";
import caps from "./caps.json";
import avwin from "./avwin.json";

const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9$]/g, "");
const WORDS = (caps as [string, number][]).flatMap(([w, ms]) => w.split(/\s+/).map((x, j) => ({ w: norm(x), t: ms / 1000 + j * 0.25 }))).filter((x) => x.w);
export const at = (phrase: string, after = 0): number => {
  const ws = phrase.split(/\s+/).map(norm).filter(Boolean);
  for (let i = 0; i < WORDS.length; i++) {
    if (WORDS[i].t < after - 0.01) continue;
    let ok = true;
    for (let j = 0; j < ws.length; j++) if (!WORDS[i + j] || WORDS[i + j].w !== ws[j]) { ok = false; break; }
    if (ok) return WORDS[i].t;
  }
  throw new Error(`at(): no encuentro "${phrase}" después de ${after}`);
};
export const END = WORDS[WORDS.length - 1].t + 1.6;

// ---------- tomas LTX que ya llegaron (si falta: la foto con zoom lento) ----------
export const HAS: Record<string, boolean> = {};
export const Shot: React.FC<{ k: string; t: number; a: number; z?: [number, number]; dur?: number; from?: number; ox?: string }> = ({ k, t, a, z = [1.03, 1.12], dur = 8, from = 0, ox = "50% 50%" }) => (
  <AbsoluteFill style={{ transform: `scale(${z[0] + (z[1] - z[0]) * e(t, a, a + dur)})`, transformOrigin: ox }}>
    {HAS[k] ? <Vid id={"ltx_" + k} from={from} at={a} /> : <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
  </AbsoluteFill>
);
// foto con paneo propio (cada plano su movimiento: zoom in / out / paneo lateral)
export const Pic: React.FC<{ id: string; t: number; a: number; dur?: number; mv?: "in" | "out" | "l" | "r" | "up"; ox?: string; style?: React.CSSProperties }> = ({ id, t, a, dur = 7, mv = "in", ox = "50% 50%", style }) => {
  const k = e(t, a, a + dur);
  const tr = mv === "in" ? `scale(${1.03 + 0.1 * k})` : mv === "out" ? `scale(${1.14 - 0.1 * k})` : mv === "l" ? `scale(1.12) translateX(${40 - 80 * k}px)` : mv === "r" ? `scale(1.12) translateX(${-40 + 80 * k}px)` : `scale(1.12) translateY(${30 - 60 * k}px)`;
  return <AbsoluteFill style={{ transform: tr, transformOrigin: ox, ...style }}><Img src={staticFile(P + "img_" + id + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>;
};

// ---------- AVATAR: cada ventana pagada se muestra entera; entrada/salida la elige el que la llama ----------
export type Win = { ms: number; me: number; off: number; pieces: number[][] };
export const WIN = (avwin as { win: Win[] }).win.filter((w) => w.ms > 61);
export const inWin = (t: number) => WIN.find((w) => t >= w.ms && t < w.me);
export const AvatarLayer: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
    {WIN.filter((w) => t > w.ms - 1 && t < w.me + 1).map((w, i) => (
      <Sequence key={w.ms} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 12} layout="none">
        <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me ? 1 : 0 }}>
          <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      </Sequence>
    ))}
  </AbsoluteFill>
);
// transiciones del avatar (rotan por ventana, nunca halo/desenfoque en el borde del presentador)
export type AvIn = "iris" | "door" | "slide" | "drop" | "split" | "card";
export const AvatarWin: React.FC<{ t: number; w: Win; kin: AvIn; kout: AvIn; ix?: number; iy?: number; children?: React.ReactNode }> = ({ t, w, kin, kout, ix = 960, iy = 540, children }) => {
  const a = ei(t, w.ms, w.ms + 0.4), b = 1 - ei(t, w.me - 0.4, w.me);
  const k = Math.min(a, b), kind = a < 1 ? kin : kout;
  if (k <= 0.001) return null;
  let st: React.CSSProperties = {};
  const R = k * 2300;
  if (kind === "iris") st = { clipPath: `circle(${R}px at ${ix}px ${iy}px)` };
  else if (kind === "door") st = { transformOrigin: "100% 50%", transform: `perspective(1600px) rotateY(${(1 - k) * 95}deg)` };
  else if (kind === "slide") st = { transform: `translateX(${(1 - k) * (a < 1 ? 1920 : -1920)}px)` };
  else if (kind === "drop") st = { transform: `translateY(${(1 - k) * -1080}px)` };
  else if (kind === "split") st = { clipPath: `inset(0 ${(1 - k) * 50}% 0 ${(1 - k) * 50}%)` };
  else st = { transform: `perspective(1800px) rotateX(${(1 - k) * 60}deg) scale(${0.55 + 0.45 * k})`, transformOrigin: "50% 100%", borderRadius: 30 * (1 - k), overflow: "hidden" };
  return (
    <AbsoluteFill style={st}>
      <AvatarLayer t={t} />
      {children}
    </AbsoluteFill>
  );
};

// ---------- EL MUNDO del resto: una cámara (K se arma juntando las llaves de cada tramo) ----------
export const WorldR: React.FC<{ K: Key[]; t: number; st: GState; children?: React.ReactNode }> = ({ K, t, st, children }) => {
  const v0 = camSpeed(K, t), v = { bx: Math.min(4, v0.bx * 0.3), by: Math.min(3, v0.by * 0.3) };
  const id = "mbr" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><GarageWorld K={K} t={t} st={st}>{children}</GarageWorld></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const scr = (K: Key[], t: number, q: [number, number, number]) => screenOf(K, t, q);
