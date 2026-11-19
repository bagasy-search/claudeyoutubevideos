// tdp16 · base: avatar (ventanas del reel RunPod limpio) / clip Veo (V) / foto Nano Banana (G) / escena propia (S), un plano por tramo.
// Encima: piezas ancladas a la palabra (ov). Cuadro 0 = avatar. El audio (voz + cama Veo + foley) se mezcla en la nube.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, D, P, cl, e, eo, h, paginaBg, s } from "./lib";
import { ESCENAS } from "./escenas";
import { OVS } from "./piezas";

const TR = 0.45;
// Ken Burns sorteado por plano (sentido 50/50, foco 35-65 %) + balanceo lento de cámara en mano en los clips
const kb = (i: number, t: number, a: number, b: number, suave = false): React.CSSProperties => {
  const d = b - a + TR, amp = Math.min(0.16, (0.016 + 0.02 * h(i, 1)) * d) * (suave ? 0.4 : 1), out = h(i, 2) < 0.5;
  const p = cl((t - a) / d), z = 1.05 + amp * (out ? 1 - p : p), k = amp ? (z - 1.05) / amp : 0, ang = h(i, 5) * Math.PI * 2;
  const sway = suave ? Math.sin((t - a) * 0.55 + h(i, 6) * 6) * 6 : 0;
  return { width: "100%", height: "100%", objectFit: "cover", transformOrigin: `${35 + 30 * h(i, 3)}% ${35 + 30 * h(i, 4)}%`,
    transform: `translate(${Math.cos(ang) * 30 * k + sway}px, ${Math.sin(ang) * 12 * k + sway * 0.4}px) scale(${z}) rotate(${sway * 0.02}deg)` };
};

const Plano: React.FC<{ i: number; t: number }> = ({ i, t }) => {
  const q = D.shots[i], d = q.e - q.s;
  if (q.k === "A") {
    let z = 1.0 + Math.min(0.05, 0.015 + 0.004 * d) * cl((t - q.s) / (d + TR)), tx = 0;
    for (const m of q.mods || []) {
      const w = e(t, m.a, m.a + (m.k === "punch" ? 0.2 : 0.45)) * (1 - e(t, m.b - 0.35, m.b));
      if (m.k === "punch") z *= 1 + 0.12 * w;
      if (m.k === "split") tx -= 22 * w;
    }
    return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={s(q.off || 0)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: "50% 32%", transform: `translateX(${tx}%) scale(${z})` }} />
    </AbsoluteFill>;
  }
  if (q.k === "S") { const X = ESCENAS[q.sc as string]; return <X t={t} a={q.s} b={q.e} {...q} />; }
  if (q.f && q.f.endsWith(".mp4")) { // clip Veo: llena el plano; si es corto corre más lento (piso 0,5); arranca en `from` si es la continuación
    // `from` viene en tiempo de PANTALLA y el tramo anterior pudo ir lento: se acota para que el clip nunca arranque pasado su final (congelado)
    const L = q.len || 8, need = d + TR + 0.1, src0 = Math.max(0, Math.min(q.from || 0, L - 0.5 * need - 0.05)), rest = L - src0, rate = rest < need ? Math.max(0.5, rest / need) : 1;
    const v = <OffthreadVideo src={staticFile(P + q.f)} startFrom={s(src0)} muted playbackRate={rate} style={kb(i, t, q.s, q.e, true)} />;
    return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>{q.zoom ? <AbsoluteFill style={{ transform: `scale(${q.zoom})`, transformOrigin: `${q.zx}% ${q.zy}%` }}>{v}</AbsoluteFill> : v}</AbsoluteFill>;
  }
  const im = <AbsoluteFill style={{ transform: "scale(1.11)", transformOrigin: "0% 50%" }}><Img src={staticFile(P + q.f)} style={kb(i, t, q.s, q.e)} /></AbsoluteFill>;
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>{q.zoom ? <AbsoluteFill style={{ transform: `scale(${q.zoom})`, transformOrigin: `${q.zx}% ${q.zy}%` }}>{im}</AbsoluteFill> : im}</AbsoluteFill>;
};

// entrada de un plano: corte · fundido corto · empuje · HOJA (la página del pasaporte da vuelta y descubre la parada)
const Entrada: React.FC<{ tr?: string; t: number; a: number; children: React.ReactNode }> = ({ tr, t, a, children }) => {
  if (!tr) return <AbsoluteFill>{children}</AbsoluteFill>;
  if (tr === "fade") return <AbsoluteFill style={{ opacity: e(t, a, a + 0.3) }}>{children}</AbsoluteFill>;
  const p = eo(t, a, TR);
  if (tr === "push") return <AbsoluteFill style={{ transform: `translateX(${(1 - p) * 100}%)`, boxShadow: "-40px 0 80px rgba(0,0,0,.35)" }}>{children}</AbsoluteFill>;
  const q = e(t, a, a + 0.62);
  return <AbsoluteFill>
    <AbsoluteFill style={{ clipPath: `inset(0 ${(1 - q) * 100}% 0 0)` }}>{children}</AbsoluteFill>
    {q < 0.995 && <div style={{ position: "absolute", top: -40, bottom: -40, left: `calc(${q * 100}% - 160px)`, width: 320, ...paginaBg,
      transform: `perspective(1600px) rotateY(${-60 + 60 * q}deg)`, boxShadow: "-30px 0 60px rgba(0,0,0,.45), inset -40px 0 50px rgba(0,0,0,.12)" }} />}
  </AbsoluteFill>;
};

export const Body: React.FC = () => {
  const t = useCurrentFrame() / 30;
  return <AbsoluteFill style={{ background: C.navy }}>
    {D.shots.map((q, i) => { const sig = D.shots[i + 1], cola = sig && sig.tr ? s(0.7) + 2 : 0;
      return <Sequence key={i} from={s(q.s)} durationInFrames={Math.max(1, s(q.e) - s(q.s) + cola)}><Entrada tr={q.tr} t={t} a={q.s}><Plano i={i} t={t} /></Entrada></Sequence>; })}
    {D.ov.map(({ k, ...p }, i) => { if (t < p.a - 0.3 || t > p.b + 0.9) return null; const X = OVS[k]; return X ? <X key={i} t={t} {...p} /> : null; })}
  </AbsoluteFill>;
};
