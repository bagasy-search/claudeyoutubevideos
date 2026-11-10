// setsuko01 · "Japanese Women Over 60 Look Elegant With Only 9 Clothes — The Kyoto Closet Rule"
// Base: avatar (ventanas del reel de RunPod) / clip real / foto real / imagen / escena propia, un plano por frase (data.json).
// Encima: piezas ancladas a la palabra. Cuadro 0 = avatar hablando. El audio (voz + SFX + música) se monta en la entrega.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, D, P, cl, e, eo, h, s } from "./lib";
import * as PIE from "./piezas";
import * as SOB from "./sobre";
import * as ESC from "./escenas";

const ESCENAS: Record<string, React.FC<any>> = { rail: PIE.Rail, rail9: PIE.Rail9, railfull: PIE.RailFull, cambio: PIE.Cambio, mapa: PIE.Mapa, agenda: PIE.Agenda, agenda2: PIE.Agenda, tanmono: PIE.Tanmono, tanmono2: PIE.Tanmono,
  nocolores: PIE.NoColores, abanico: PIE.Abanico, matriz: PIE.Matriz, recap: PIE.Recap, ...(ESC as unknown as Record<string, React.FC<any>>), pilas2: ESC.pilas };
const OVS: Record<string, React.FC<any>> = { Regla: SOB.Regla, Kin: SOB.Kin, Tag: SOB.Tag, Cuenta: SOB.Cuenta, Lower: SOB.Lower, Chip: SOB.Chip, Muestra: SOB.Muestra, Cta: SOB.Cta, Fin: SOB.Fin };
const TR = 0.42; // duración de una transición

// Ken Burns sorteado por plano: sentido 50/50, 1,8–4 %/s (techo 20 %), foco 35–65 %, paneo en ángulo atado a la escala
const ZB = 1.06;
const kb = (i: number, t: number, a: number, b: number, mitad = false): React.CSSProperties => {
  const d = b - a + TR, amp = Math.min(0.2, (0.018 + 0.022 * h(i, 1)) * d) * (mitad ? 0.45 : 1), saleZ = h(i, 2) < 0.5;
  const p = cl((t - a) / d), z = ZB + amp * (saleZ ? 1 - p : p), k = (z - ZB) / amp, ang = h(i, 5) * Math.PI * 2;
  return { width: "100%", height: "100%", objectFit: "cover", transformOrigin: `${35 + 30 * h(i, 3)}% ${35 + 30 * h(i, 4)}%`, transform: `translate(${Math.cos(ang) * 36 * k}px, ${Math.sin(ang) * 13 * k}px) scale(${z})` };
};

const Plano: React.FC<{ i: number; t: number }> = ({ i, t }) => {
  const q = D.shots[i], d = q.e - q.s;
  if (q.k === "A") { // avatar a cuadro completo con empuje lento; corte limpio, sin fundido
    const z = 1.012 + Math.min(0.06, 0.02 + 0.0045 * d) * cl((t - q.s) / (d + TR));
    return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={s(q.off || 0)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: "58% 34%", transform: `scale(${z})` }} />
    </AbsoluteFill>;
  }
  if (q.k === "S") { const X = ESCENAS[q.sc as string]; return <X t={t} a={q.s} b={q.e} arg={q.arg} />; }
  if (q.k === "Y") { // clip real ENTERO: nunca se corta ni se congela (si es más corto que el plano, corre apenas más lento)
    const need = d + TR + 0.1, rate = q.len && q.len < need ? Math.max(0.7, q.len / need) : 1;
    return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}><OffthreadVideo src={staticFile(P + q.f)} muted playbackRate={rate} style={kb(i, t, q.s, q.e, true)} /></AbsoluteFill>;
  }
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}><Img src={staticFile(P + q.f)} style={kb(i, t, q.s, q.e)} /></AbsoluteFill>;
};

// entrada de un plano sobre el anterior: corte · barrido de papel · empuje · fundido corto
const Entrada: React.FC<{ tr?: string; t: number; a: number; children: React.ReactNode }> = ({ tr, t, a, children }) => {
  if (!tr || tr === "cut") return <AbsoluteFill>{children}</AbsoluteFill>;
  const p = eo(t, a, TR);
  if (tr === "fade") return <AbsoluteFill style={{ opacity: e(t, a, a + 0.26) }}>{children}</AbsoluteFill>;
  if (tr === "push") return <AbsoluteFill style={{ transform: `translateX(${(1 - p) * 100}%)`, boxShadow: "-40px 0 80px rgba(0,0,0,.35)" }}>{children}</AbsoluteFill>;
  const v = tr === "wipeV";
  return <AbsoluteFill>
    <AbsoluteFill style={{ clipPath: v ? `inset(0 0 ${(1 - p) * 100}% 0)` : `inset(0 ${(1 - p) * 100}% 0 0)` }}>{children}</AbsoluteFill>
    {p < 0.995 && <div style={{ position: "absolute", ...(v ? { left: 0, right: 0, top: `calc(${p * 100}% - 10px)`, height: 22 } : { top: 0, bottom: 0, left: `calc(${p * 100}% - 10px)`, width: 22 }), background: C.washi, boxShadow: "0 0 34px rgba(0,0,0,.4)" }} />}
  </AbsoluteFill>;
};

export const END = D.end;
export const Body: React.FC = () => {
  const t = useCurrentFrame() / 30;
  return <AbsoluteFill style={{ background: C.washi }}>
    {D.shots.map((q, i) => { const sig = D.shots[i + 1], cola = sig && sig.tr && sig.tr !== "cut" ? s(TR) + 2 : 0;
      return <Sequence key={i} from={s(q.s)} durationInFrames={Math.max(1, s(q.e) - s(q.s) + cola)}><Entrada tr={q.tr} t={t} a={q.s}><Plano i={i} t={t} /></Entrada></Sequence>; })}
    {D.ov.map(({ k, ...p }, i) => { if (t < p.a - 0.3 || t > p.b + 0.1) return null; const X = OVS[k]; return <X key={i} t={t} {...p} />; })}
  </AbsoluteFill>;
};
