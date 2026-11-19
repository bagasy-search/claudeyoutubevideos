// setsuko09 · escenas hechas con las fotos reales (skill edicion-sobre-fotos; ideas en D:/rtmp/setsuko09/ideas.md).
// Cada escena tapa su plano G entero y lleva su propia cámara. Coordenadas en 1920x1080 (foto en fill).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { P, cl, eo, lerp, spr } from "./lib";

type EP = { t: number; a: number; b: number; f: string; m1: number; m2?: number };
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const CAPA: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080 };
const src = (f: string) => staticFile(P + f);

// 1 · la luz del foco real del techo (375,120) cruza la sala que se apaga y se posa sobre el actor; en m1 ("stage") se ajusta
export const FotoEscenario: React.FC<EP> = ({ t, a, b, f, m1 }) => {
  if (t < a || t >= b) return null;
  const via = eo(t, a + 0.15, Math.max(0.6, m1 - a - 0.15)), ajusta = spr(t, m1, 1.4);
  const x = lerp(375, 955, via), y = lerp(120, 520, via), rx = lerp(120, 300, via) + 40 * ajusta, ry = lerp(110, 400, via) + 50 * ajusta;
  const apaga = lerp(1, 0.22, eo(t, a + 0.1, 0.9)), z = lerp(1.0, 1.12, eo(t, a, b - a));
  const pozo = `radial-gradient(ellipse ${Math.round(rx)}px ${Math.round(ry)}px at ${Math.round(x)}px ${Math.round(y)}px, #000 0%, #000 55%, rgba(0,0,0,.35) 80%, transparent 100%)`;
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <div style={{ ...CAPA, transformOrigin: `${Math.round(lerp(700, 955, via))}px ${Math.round(lerp(300, 500, via))}px`, transform: `scale(${z})` }}>
      <Img src={src(f)} style={{ ...FULL, filter: `brightness(${apaga})` }} />
      <Img src={src(f)} style={{ ...FULL, WebkitMaskImage: pozo, maskImage: pozo, filter: `brightness(${1 + 0.18 * via}) sepia(${0.25 * via})` }} />
    </div>
  </AbsoluteFill>;
};

// 2 · el relieve del espejo gira hacia atrás dentro de su aro (elipse 953,568 · 405x220), la perilla (948,532) quieta; frena en m2
const K = 220 / 405;
const RELIEVE = "ellipse(405px 220px at 953px 568px)", PERILLA = "ellipse(58px 52px at 948px 530px)";
export const FotoEspejo: React.FC<EP> = ({ t, a, b, f, m1, m2 = m1 + 1.5 }) => {
  if (t < a || t >= b) return null;
  const p = cl((t - m1 + 0.4) / (m2 - m1 + 0.4)), frena = 1 - Math.pow(1 - p, 3), ang = -200 * frena + (t > m2 ? 4 * Math.exp(-(t - m2) * 5) * Math.sin((t - m2) * 14) : 0);
  const z = lerp(1.02, 1.14, eo(t, a, b - a));
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <div style={{ ...CAPA, transformOrigin: "950px 560px", transform: `scale(${z})` }}>
      <Img src={src(f)} style={FULL} />
      <div style={{ ...CAPA, clipPath: RELIEVE }}>
        <div style={{ ...CAPA, transformOrigin: "953px 568px", transform: `scaleY(${K}) rotate(${ang}deg) scaleY(${1 / K})` }}><Img src={src(f)} style={FULL} /></div>
      </div>
      <div style={{ ...CAPA, clipPath: PERILLA, filter: "drop-shadow(0 4px 6px rgba(0,0,0,.4))" }}><Img src={src(f)} style={FULL} /></div>
    </div>
  </AbsoluteFill>;
};

// 3 · las dos tintas del furoshiki se separan: en m1 ("Green") las volutas blancas suben y queda el verde solo; en m2 ("white") vuelven a calzar
export const FotoTintas: React.FC<EP & { verde: string; blancas: string }> = ({ t, a, b, f, m1, m2 = m1 + 0.8, verde, blancas }) => {
  if (t < a || t >= b) return null;
  const sube = eo(t, m1, 0.35) * (1 - spr(t, m2, 1.6)), z = lerp(1.0, 1.08, eo(t, a, b - a));
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <div style={{ ...CAPA, transformOrigin: "680px 640px", transform: `scale(${z})` }}>
      <Img src={src(t < m1 ? f : verde)} style={FULL} />
      {t >= m1 && <div style={{ ...CAPA, transformOrigin: "680px 640px", transform: `translate(${-26 * sube}px, ${-44 * sube}px) scale(${1 + 0.05 * sube})`,
        filter: `drop-shadow(${14 * sube}px ${22 * sube}px ${8 + 10 * sube}px rgba(0,40,0,${0.55 * sube}))` }}>
        <Img src={src(blancas)} style={FULL} />
      </div>}
    </div>
  </AbsoluteFill>;
};
