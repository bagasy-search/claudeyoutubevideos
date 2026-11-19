// setsuko08 · escenas hechas con las fotos reales (skill edicion-sobre-fotos; ideas en D:/rtmp/setsuko08/ideas.md).
// Cada escena tapa su plano G entero y lleva su propia cámara. Coordenadas en 1920x1080 (foto en fill).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { P, cl, eo, lerp } from "./lib";

type EP = { t: number; a: number; b: number; f: string; m1: number; m2?: number };
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const src = (f: string) => staticFile(P + f);

// 1 · el cuarto a oscuras sólo con las dos velas reales; en m1 el flash dispara y la foto aparece entera
export const FotoFlash: React.FC<EP> = ({ t, a, b, f, m1 }) => {
  if (t < a || t >= b) return null;
  const k = t - a, d = b - a, antes = t < m1;
  const flick = 0.9 + 0.06 * Math.sin(k * 23) * Math.sin(k * 7.3) + 0.04 * Math.sin(k * 41);
  const z = antes ? lerp(1.1, 1.13, cl(k / Math.max(0.1, m1 - a))) : lerp(1.0, 1.035, cl((t - m1) / Math.max(0.1, b - m1)));
  const golpe = antes ? 0 : Math.exp(-(t - m1) * 6.5);
  const halo = `radial-gradient(ellipse ${Math.round(470 * flick)}px ${Math.round(380 * flick)}px at 798px 656px, rgba(0,0,0,${0.92 * flick}) 0%, rgba(0,0,0,.5) 38%, rgba(0,0,0,.12) 70%, transparent 100%)`;
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: cl(d * 10) }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: antes ? "800px 600px" : "1000px 520px", transform: `scale(${z * (1 + 0.025 * golpe)})` }}>
      <Img src={src(f)} style={{ ...FULL, filter: antes ? "brightness(0.1) saturate(0.6)" : "none" }} />
      {antes && <Img src={src(f)} style={{ ...FULL, WebkitMaskImage: halo, maskImage: halo, filter: "sepia(.4) saturate(1.2) brightness(.95)" }} />}
      {golpe > 0.01 && <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: "#fffaf0", opacity: golpe }} />}
    </div>
  </AbsoluteFill>;
};

// 2 · el destello real de cada lente crece hasta comerse el ojo (izquierdo en m1, derecho en m2), dentro de la copia en papel
const COPIA = "polygon(625px 312px, 1125px 207px, 1240px 532px, 700px 600px)";
const Mancha: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => {
  const r = 6 + 32 * p;
  return <div style={{ position: "absolute", left: x - r * 1.6, top: y - r * 1.6, width: r * 3.2, height: r * 3.2, borderRadius: "50%", mixBlendMode: "screen",
    background: `radial-gradient(circle, rgba(255,255,252,${0.55 + 0.45 * p}) 0%, rgba(255,255,250,${0.9 * p}) ${30 + 10 * p}%, rgba(255,255,250,0) 62%)` }} />;
};
export const FotoBrillo: React.FC<EP> = ({ t, a, b, f, m1, m2 = m1 + 1 }) => {
  if (t < a || t >= b) return null;
  const ent = eo(t, a, 1.1), z = lerp(1.0, 1.55, ent) + 0.02 * cl((t - a - 1.1) / 3), ox = lerp(960, 935, ent), oy = lerp(540, 420, ent);
  const p1 = eo(t, m1, 0.5), p2 = eo(t, m2, 0.5);
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${ox}px ${oy}px`, transform: `scale(${z})` }}>
      <Img src={src(f)} style={FULL} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: COPIA, overflow: "hidden" }}>
        {p1 > 0 && <Mancha x={885} y={421} p={p1} />}
        {p2 > 0 && <Mancha x={982} y={403} p={p2} />}
      </div>
    </div>
  </AbsoluteFill>;
};

// 3 · la moldura real engorda hacia adentro (copia del anillo, más chica) y la pintura se encoge en su lugar
const ANILLO = "path(evenodd, 'M560 162 L930 232 L918 690 L560 695 Z M676 327 L840 333 L838 573 L678 580 Z')";
const PINTURA = "polygon(676px 327px, 840px 333px, 838px 573px, 678px 580px)";
export const FotoMarco: React.FC<EP> = ({ t, a, b, f, m1, m2 = m1 + 2 }) => {
  if (t < a || t >= b) return null;
  const sc = lerp(1, 0.62, eo(t, m1, 1.3)), z = lerp(1.03, 1.1, cl((t - a) / (b - a))) + 0.1 * eo(t, m2, 1.2);
  const capa = (clip: string, s: number, sombra = false) => <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "758px 453px", transform: `scale(${s})`,
    filter: sombra ? "drop-shadow(0 3px 6px rgba(0,0,0,.45))" : undefined }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: clip }}><Img src={src(f)} style={FULL} /></div>
  </div>;
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "760px 450px", transform: `scale(${z})` }}>
      <Img src={src(f)} style={FULL} />
      {sc < 0.999 && capa(ANILLO, sc, true)}
      {sc < 0.999 && capa(PINTURA, sc)}
    </div>
  </AbsoluteFill>;
};
