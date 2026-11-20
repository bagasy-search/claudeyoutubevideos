// setsuko10 · escenas hechas con las fotos reales (skill edicion-sobre-fotos; ideas en D:/rtmp/setsuko10/ideas.md).
// Cada escena tapa su plano G entero y lleva su propia cámara. Coordenadas en 1920x1080 (foto en fill).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { P, cl, eo, lerp, spr } from "./lib";

type EP = { t: number; a: number; b: number; f: string; m1: number; m2?: number };
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const CAPA: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080 };
const src = (f: string) => staticFile(P + f);
const r = Math.round;

// 1 · el vidrio de la lupa real (elipse 92x68 en 200,240) muestra, x3, otra parte de la página: primero el borde
//     deshilachado (1325,780) y en m2 ("woven") pasea hasta la trama oscura (1240,370); la cámara se acerca a la lupa.
export const FotoLupa: React.FC<EP> = ({ t, a, b, f, m1, m2 = m1 + 1.2 }) => {
  if (t < a || t >= b) return null;
  const z = lerp(1, 1.03, eo(t, a, Math.max(0.5, m1 - a))) * lerp(1, 1.7, eo(t, m1 - 0.3, 1.7));
  const ve = cl((t - (m1 - 0.25)) / 0.35), q = eo(t, m2, 1.6);
  const qx = lerp(1325, 1240, q), qy = lerp(780, 370, q), K = 3;
  const vidrio = "ellipse(92px 68px at 200px 240px)";
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <div style={{ ...CAPA, transformOrigin: "200px 240px", transform: `scale(${z})` }}>
      <Img src={src(f)} style={FULL} />
      <div style={{ ...CAPA, overflow: "hidden", clipPath: vidrio, WebkitClipPath: vidrio, opacity: ve }}>
        <Img src={src(f)} style={{ ...FULL, transformOrigin: "0 0", transform: `translate(${r(200 - K * qx)}px, ${r(240 - K * qy)}px) scale(${K})` }} />
        <div style={{ ...CAPA, background: "radial-gradient(ellipse 92px 68px at 200px 240px, transparent 55%, rgba(0,0,0,.38) 100%)" }} />
        <div style={{ ...CAPA, background: "radial-gradient(ellipse 40px 22px at 165px 205px, rgba(255,255,255,.22), transparent 100%)" }} />
      </div>
    </div>
  </AbsoluteFill>;
};

// 2 · calco: una copia del bolsillo dibujado (985-1070 x 490-555, centro 1028,520) se despega en m1 ("patent"),
//     viaja en arco y se apoya en m2 sobre la tapa real con remaches (centro 1567,625, 15°, x2,6) como trazo claro.
export const FotoCalco: React.FC<EP> = ({ t, a, b, f, m1, m2 = m1 + 1.6 }) => {
  if (t < a || t >= b) return null;
  const z = lerp(1, 1.08, eo(t, a, b - a));
  const ve = cl((t - m1) / 0.3), p = eo(t, m1 + 0.3, Math.max(0.8, m2 - m1 - 0.3)), asienta = spr(t, m2, 1.2);
  const arco = Math.sin(Math.PI * p);
  const dx = lerp(0, 1567 - 1028, p), dy = lerp(0, 625 - 520, p) - 90 * arco;
  const s = lerp(1, 2.6, p) * (1 + 0.07 * arco) * (1 + 0.03 * (1 - asienta) * (t >= m2 ? 1 : 0)), rot = lerp(0, 15, p);
  const recorte = "polygon(972px 480px, 1084px 480px, 1084px 566px, 972px 566px)";
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <div style={{ ...CAPA, transformOrigin: "1250px 600px", transform: `scale(${z})` }}>
      <Img src={src(f)} style={FULL} />
      <div style={{ ...CAPA, overflow: "hidden", mixBlendMode: "screen", opacity: ve * lerp(0.75, 0.95, p) }}>
        <div style={{ ...CAPA, transformOrigin: "1028px 523px", transform: `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${s.toFixed(3)})` }}>
          <Img src={src(f)} style={{ ...FULL, clipPath: recorte, WebkitClipPath: recorte, filter: "grayscale(1) invert(1) contrast(3) brightness(1.15)" }} />
        </div>
      </div>
    </div>
  </AbsoluteFill>;
};

// 3 · el baño negro se vuelve espejo: desde donde la tela entra al líquido (880,1000) se abre el reflejo invertido
//     de la tela y las manos (eje en y=740), temblando apenas; en m1 ("deepest") cubre todo el baño. Tela y palo encima.
const BANO = "polygon(375px 840px, 495px 780px, 675px 746px, 900px 735px, 1125px 738px, 1350px 758px, 1500px 795px, 1590px 840px, 1635px 900px, 1650px 960px, 1650px 1080px, 352px 1080px, 360px 900px)";
const TELA = "polygon(742px 715px, 748px 840px, 806px 960px, 828px 1080px, 978px 1080px, 962px 840px, 948px 715px)";
const PALO = "polygon(372px 868px, 1476px 734px, 1482px 768px, 378px 903px)";
export const FotoBano: React.FC<EP> = ({ t, a, b, f, m1 }) => {
  if (t < a || t >= b) return null;
  const k = eo(t, a, b - a), z = lerp(1.04, 1.12, k), oy = lerp(430, 800, k);
  const R = lerp(0, 1150, eo(t, m1 - 0.3, 1.5)), w = Math.sin(t * 2 * Math.PI * 0.7), w2 = Math.sin(t * 2 * Math.PI * 1.3 + 1);
  const mascara = `radial-gradient(circle ${r(R + 1)}px at 880px 1000px, #000 0%, #000 ${R > 160 ? 80 : 40}%, transparent 100%)`;
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <div style={{ ...CAPA, transformOrigin: `880px ${r(oy)}px`, transform: `scale(${z.toFixed(4)})` }}>
      <Img src={src(f)} style={FULL} />
      <div style={{ ...CAPA, overflow: "hidden", clipPath: BANO, WebkitClipPath: BANO, mixBlendMode: "screen", opacity: 0.85, WebkitMaskImage: mascara, maskImage: mascara }}>
        <Img src={src(f)} style={{ ...FULL, transformOrigin: "0 740px", transform: `translateX(${(4 * w).toFixed(2)}px) scaleY(${(-1 - 0.012 * w2).toFixed(4)})`, filter: "brightness(.62) saturate(1.45) blur(1.2px)" }} />
      </div>
      <Img src={src(f)} style={{ ...FULL, clipPath: PALO, WebkitClipPath: PALO }} />
      <Img src={src(f)} style={{ ...FULL, clipPath: TELA, WebkitClipPath: TELA }} />
    </div>
  </AbsoluteFill>;
};
