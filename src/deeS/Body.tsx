// serie Dee's Salon Chair (dee02-05). Base, un plano por tramo (d/<slug>.json):
//   A = avatar (reel de RunPod entero, reel0.mp4 + offset) · V = clip Veo entero · G = foto Nano Banana · E = escena sobre fotos (esc_<slug>.tsx)
// El audio (voz + sonido real de los Veo + room tone + foley) se mezcla en la nube y entra en encfin. Todo es función pura de t (chunks del farm).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { D, P, cl, e, eo, h, s } from "./lib";

export const ESC: Record<string, React.FC<{ t: number; a: number; b: number; arg?: string }>> = {};
export const registerEsc = (m: Record<string, React.FC<any>>) => Object.assign(ESC, m);
const TR = 0.42;

// Ken Burns sorteado por plano: sentido 50/50, 1,5–3,5 %/s (techo 14 %), foco 35–65 %, paneo suave en ángulo
const ZB = 1.04;
const kb = (i: number, t: number, a: number, b: number, k = 1): React.CSSProperties => {
  const d = b - a + TR, amp = Math.min(0.14, (0.015 + 0.02 * h(i, 1)) * d) * k, saleZ = h(i, 2) < 0.5;
  const p = cl((t - a) / d), z = ZB + amp * (saleZ ? 1 - p : p), q = (z - ZB) / Math.max(amp, 1e-6), ang = h(i, 5) * Math.PI * 2;
  return { width: "100%", height: "100%", objectFit: "cover", transformOrigin: `${35 + 30 * h(i, 3)}% ${35 + 30 * h(i, 4)}%`, transform: `translate(${Math.cos(ang) * 28 * q}px, ${Math.sin(ang) * 10 * q}px) scale(${z})` };
};

const Plano: React.FC<{ i: number; t: number }> = ({ i, t }) => {
  const q = D.shots[i], d = q.e - q.s;
  if (q.k === "A") { // avatar a cuadro completo, empuje lento + punch-in 110 % en los largos
    let z = (q.cz ? 1.14 : 1.01) + Math.min(0.05, 0.018 + 0.004 * d) * cl((t - q.s) / (d + TR));   // cz = segundo encuadre (cerrado) del mismo tramo de avatar
    for (const m of q.mods || []) { const w = e(t, m.a, m.a + 0.18) * (1 - e(t, m.b - 0.3, m.b)); if (m.k === "punch") z *= 1 + 0.1 * w; }
    return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={s(q.off || 0)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: "50% 32%", transform: `scale(${z})` }} />
    </AbsoluteFill>;
  }
  if (q.k === "E") { const X = ESC[q.sc as string]; return X ? <X t={t} a={q.s} b={q.e} arg={q.arg} /> : null; }
  if (q.f && q.f.endsWith(".mp4")) { // clip Veo ENTERO: nunca se congela; si es corto corre más lento (piso 0,59 = cámara lenta ≤1,7×)
    const need = d + TR + 0.1, rate = q.len && q.len < need ? Math.max(0.59, q.len / need) : 1;
    const v = <OffthreadVideo src={staticFile(P + q.f)} muted playbackRate={rate} style={kb(i, t, q.s, q.e, 0.45)} />;
    return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>{q.zl ? <AbsoluteFill style={{ transform: "scale(1.11)", transformOrigin: "0% 50%" }}>{v}</AbsoluteFill> : v}</AbsoluteFill>;
  }
  // foto Nano Banana: scale(1.11) anclado a la izquierda (la estrellita de abajo a la derecha queda fuera de cuadro)
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}><AbsoluteFill style={{ transform: "scale(1.11)", transformOrigin: "0% 50%" }}><Img src={staticFile(P + q.f)} style={kb(i, t, q.s, q.e)} /></AbsoluteFill></AbsoluteFill>;
};

const Entrada: React.FC<{ tr?: string; t: number; a: number; children: React.ReactNode }> = ({ tr, t, a, children }) => {
  if (!tr || tr === "cut") return <AbsoluteFill>{children}</AbsoluteFill>;
  if (tr === "fade") return <AbsoluteFill style={{ opacity: e(t, a, a + 0.3) }}>{children}</AbsoluteFill>;
  const p = eo(t, a, TR); // push
  return <AbsoluteFill style={{ transform: `translateX(${(1 - p) * 100}%)`, boxShadow: "-40px 0 80px rgba(0,0,0,.35)" }}>{children}</AbsoluteFill>;
};

export const Body: React.FC = () => {
  const t = useCurrentFrame() / 30;
  return <AbsoluteFill style={{ background: "#000" }}>
    {D.shots.map((q, i) => { const sig = D.shots[i + 1], cola = sig && sig.tr && sig.tr !== "cut" ? s(TR) + 2 : 0;
      return <Sequence key={i} from={s(q.s)} durationInFrames={Math.max(1, s(q.e) - s(q.s) + cola)}><Entrada tr={q.tr} t={t} a={q.s}><Plano i={i} t={t} /></Entrada></Sequence>; })}
  </AbsoluteFill>;
};
