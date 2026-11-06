// ck5nc · «The Funeral Ham Buns Every Iowa Church Made — Gone Before the Service Ended» · motor yanqui3d.
// Bases (plan.json, D:/rtmp/ck5n_plan.py): AV = ventana pagada del avatar (reel0, UN /run) con CORTE SECO de entrada y salida ·
// vL = clip Veo con Loretta (ltx_<id>.mp4, sólo donde aparece ella) · iF = foto Nano Banana (img_<id>.jpg) con Ken Burns que
// sortea ESTILO y curva por plano. Todo plano no-avatar lleva scale(1.11) anclado a la izquierda (estrellita de Nano Banana).
// Piezas: pieces.tsx (ancladas a la palabra). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Vid, setSlug } from "../kits/yanqui3d/lib";
import { makeVideo, Beat } from "../kits/yanqui3d/engine";
import CAPS from "./caps.json";
import AVAIL from "./avail.json";
import AVW from "./avwin.json";
import PL from "./plan.json";
import { pieces } from "./pieces";
import PZW from "./pzwin.json";

const SLUG = "ck5nc";
setSlug(SLUG);
export const TEND = PL.TEND;
export const FULL_FRAMES = Math.ceil(TEND * 30);

const hash = (n: number, salt: number) => {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(salt + 1, 0xc2b2ae35);
  x ^= x >>> 15; x = Math.imul(x, 0x2c1b3c6d); x ^= x >>> 12; x = Math.imul(x, 0x297a2d39); x ^= x >>> 15;
  return (x >>> 0) / 4294967296;
};
const idn = (id: string) => parseInt(id.slice(1)) || 0;
const kbOf = (id: string, dur: number) => {
  const n = idn(id), out = hash(n, 1) < 0.5, rate = 0.018 + 0.022 * hash(n, 2), amp = Math.min(0.2, rate * dur);
  const ox = 35 + 30 * hash(n, 3), oy = 35 + 30 * hash(n, 4), ang = 2 * Math.PI * hash(n, 5), s = hash(n, 6), c = hash(n, 8);
  const estilo = s < 0.5 ? "deriva" : s < 0.7 ? "paneo" : s < 0.85 && dur >= 3.5 ? "golpe" : "frena";
  const curva = c < 0.4 ? 0 : c < 0.75 ? 1 : 2;
  return { out, amp, ox, oy, px: 2 * Math.cos(ang), py: 1.2 * Math.sin(ang), estilo, curva, tg: 0.35 + 0.3 * hash(n, 9) };
};
const cl01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (u: number, c: number) => (c === 1 ? 1 - Math.pow(1 - u, 3) : c === 2 ? 0.5 - 0.5 * Math.cos(Math.PI * u) : u);
const KB: React.FC<{ id: string; a: number; dur: number }> = ({ id, a, dur }) => {
  const t = useCurrentFrame() / 30, kb = kbOf(id, dur), u = cl01((t - a) / dur);
  let z: number, tx: number, ty: number, ox = kb.ox, oy = kb.oy;
  if (kb.estilo === "paneo") {
    const k = 2 * (kb.out ? 1 - ease(u, kb.curva) : ease(u, kb.curva)) - 1;
    z = 1.14; tx = 1.75 * kb.px * k; ty = 1.67 * kb.py * k; ox = 50; oy = 50;
  } else if (kb.estilo === "golpe") {
    const g = 1 - Math.pow(1 - cl01((t - a - kb.tg * dur) / 0.3), 3);
    z = 1.06 + 0.4 * kb.amp * u + 0.09 * g; tx = 0.5 * kb.px * u; ty = 0.5 * kb.py * u;
  } else {
    const e = kb.estilo === "frena" ? 1 - Math.pow(1 - u, 3) : ease(u, kb.curva), k = kb.out ? 1 - e : e;
    z = 1.06 + kb.amp * k; tx = kb.px * k; ty = kb.py * k;
  }
  const has = (AVAIL.imgs as string[]).includes(id);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#1a120c" }}>
      {has && <AbsoluteFill style={{ transform: `translate(${tx}%, ${ty}%) scale(${z})`, transformOrigin: `${ox}% ${oy}%` }}><Vid id={"img_" + id} /></AbsoluteFill>}
    </AbsoluteFill>
  );
};
const SinEstrella: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <AbsoluteFill style={{ transform: "scale(1.11)", transformOrigin: `0% ${Math.round(100 * hash(idn(id), 10))}%` }}>{children}</AbsoluteFill>
  </AbsoluteFill>
);

type PB = { id: string; a: number; t: "AV" | "vL" | "iF" };
const B = PL.beats as PB[];
const TRS: Beat["tr"][] = ["light", "push", "whip", "whipL", "light", "zoom", "push", "light"];
type AvWin = { ms: number; me: number; off: number };
const WIN = (AVW as unknown as { win: AvWin[] }).win;
const W0 = WIN[0];
// Loretta se corre a la izquierda (cámara que reencuadra) mientras hay un componente a la derecha: nunca nada encima de la cara.
const eio = (t: number, a: number, b: number) => { const u = Math.min(1, Math.max(0, (t - a) / (b - a))); return u * u * (3 - 2 * u); };
const pushK = (t: number) => Math.max(0, ...(PZW as number[][]).map(([a, o]) => eio(t, a - 0.7, a + 0.05) * (1 - eio(t, o + 0.1, o + 0.8))));
const Push: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => { const k = pushK(t); return <AbsoluteFill style={{ transform: k > 0.001 ? `translateX(${(-300 * k).toFixed(1)}px) scale(${(1 + 0.32 * k).toFixed(4)})` : undefined }}>{children}</AbsoluteFill>; };

const V = makeVideo({
  caps: CAPS as [string, number][], avwin: WIN.map((w) => [w.ms, w.me, w.off]), avail: AVAIL as { clips: string[]; imgs: string[] }, T0: 0, TEND, flashAtStart: false,
  beats: ({ AV, CL }) => B.map((b, i) => {
    const prevAV = i > 0 && B[i - 1].t === "AV";
    if (b.t === "AV") {
      // ventana 0 (arranca en 0): el motor la desfasa 10 cuadros → se monta acá, reel desde el cuadro 0
      if (b.a < 0.05) return { a: 0, tr: "cut", r: () => <AbsoluteFill style={{ background: "#000" }}><Sequence from={0} durationInFrames={Math.ceil((W0.me + 0.7) * 30)} layout="none"><OffthreadVideo src={staticFile(SLUG + "/reel0.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence></AbsoluteFill> } as Beat;
      const xa = AV(b.a, "cut");
      return { ...xa, r: (t: number) => <Push t={t}>{xa.r(t)}</Push> };
    }
    const dur = (B[i + 1]?.a ?? TEND) - b.a;
    let tr = prevAV ? "cut" : TRS[Math.floor(hash(idn(b.id), 7) * TRS.length)];
    if (!prevAV && i > 1 && B[i - 1].t !== "AV" && tr === TRS[Math.floor(hash(idn(B[i - 1].id), 7) * TRS.length)]) tr = "light";
    const x: Beat = b.t === "vL" && (AVAIL.clips as string[]).includes(b.id) ? CL(b.a, b.id, tr as Beat["tr"], undefined, [1.0, 1.05])
      : { a: b.a, tr: tr as Beat["tr"], k: b.id, r: () => <KB id={b.id} a={b.a} dur={dur} /> };
    // con un componente encima, el fondo se desenfoca (primer plano nítido, fondo fuera de foco): no compite con el objeto
    return { ...x, r: (t: number) => { const k = pushK(t); return <AbsoluteFill style={{ filter: k > 0.01 ? `blur(${(18 * k).toFixed(2)}px) brightness(${(1 - 0.4 * k).toFixed(3)})` : undefined }}><SinEstrella id={b.id}>{x.r(t)}</SinEstrella></AbsoluteFill>; } };
  }),
  pieces: (t, h) => pieces(t, h, TEND),
});

export const Full: React.FC = () => <AbsoluteFill><V.Body /></AbsoluteFill>;
export const clipPlan = V.clipPlan;
export const beatTable = V.beatTable;
