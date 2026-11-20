// dee05 · escenas sobre las fotos reales (ideas en D:/rtmp/dee05/ideas.md). Todo es función pura de t (segundos del video).
// Coordenadas en 1920x1080 de la foto; la cámara nunca muestra x>1729 ni y fuera de 53–1027 (estrellita NB fuera de cuadro).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { registerEsc } from "./Body";
import { P, e, lerp, swing } from "./lib";

const W = 1920, H = 1080, XMAX = 1729, Y0 = 53, Y1 = 1027;
const foto = (n: string) => staticFile(P + "g/" + n);
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: W, height: H, objectFit: "fill" };
const capa: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: W, height: H };

const cam = (cx: number, cy: number, z: number) => {
  z = Math.max(1.115, z);
  const vw = W / z, vh = H / z;
  const L = Math.min(Math.max(cx - vw / 2, 0), XMAX - vw), T = Math.min(Math.max(cy - vh / 2, Y0), Y1 - vh);
  return { transformOrigin: "0 0", transform: `translate(${-L * z}px, ${-T * z}px) scale(${z})` } as React.CSSProperties;
};
const curva = (t: number, ks: [number, number][]) => {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) if (t <= ks[i][0]) return lerp(ks[i - 1][1], ks[i][1], e(t, ks[i - 1][0], ks[i][0]));
  return ks[ks.length - 1][1];
};
const poly = (pts: number[][]) => `polygon(${pts.map(([x, y]) => `${x}px ${y}px`).join(",")})`;
// franja de ±g px alrededor de una polilínea
const franja = (pts: number[][], g: number) => [...pts.map(([x, y]) => [x, y - g]), ...pts.slice().reverse().map(([x, y]) => [x, y + g])];

// ---------- Escena 1 · cada línea nombrada se pulsa como una cuerda: pelo, cuello de la camisa, cadenita, borde de la capa
const CUERDAS: { t: number; pts: number[][] }[] = [
  { t: 157.3, pts: [[900,478],[1010,494],[1150,500],[1300,492],[1420,486]] },
  { t: 158.75, pts: [[850,682],[950,650],[1030,650],[1080,655],[1180,680],[1300,730]] },
  { t: 160.08, pts: [[950,592],[1030,610],[1130,640],[1200,690]] },
  { t: 161.66, pts: [[860,740],[950,800],[1020,820],[1130,770],[1230,745],[1300,730]] },
];
const EscCuerdas: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const src = foto("dee05_n046.jpg");
  const z = curva(t, [[a, 1.13], [157.1, 1.5], [b + 0.4, 1.62]]);
  const cx = curva(t, [[a, 1050], [157.1, 1110], [b + 0.4, 1090]]), cy = curva(t, [[a, 560], [157.1, 600], [b + 0.4, 640]]);
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <div style={{ position: "absolute", width: W, height: H, ...cam(cx, cy, z) }}>
      <Img src={src} style={full} />
      {CUERDAS.map((c, i) => {
        if (t < c.t || t > c.t + 1.6) return null;
        const d = swing(t, c.t, 7, 3.2, 44);
        return <div key={i} style={{ ...capa, clipPath: poly(franja(c.pts, 24)) }}>
          <Img src={src} style={{ ...full, transform: `translateY(${d}px)` }} />
        </div>;
      })}
    </div>
  </AbsoluteFill>;
};

// ---------- Escena 2 · la mitad izquierda de la cara reflejada se espeja sobre la derecha: simetría perfecta por un segundo
const EJE = 628;
const EscSimetria: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const src = foto("dee05_n129.jpg");
  const z = curva(t, [[a, 1.13], [455.4, 1.6], [459.4, 1.75], [b + 0.4, 1.8]]);
  const cx = curva(t, [[a, 800], [455.4, 630], [b + 0.4, 630]]), cy = curva(t, [[a, 480], [455.4, 360], [459.4, 400], [b + 0.4, 410]]);
  const m = e(t, 460.0, 460.55) * (1 - e(t, 461.4, b));
  const mask = `linear-gradient(to right, transparent ${EJE - 2}px, #000 ${EJE + 14}px)`;
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <div style={{ position: "absolute", width: W, height: H, ...cam(cx, cy, z) }}>
      <Img src={src} style={full} />
      {m > 0.01 && <div style={{ ...capa, opacity: m, clipPath: poly([[EJE, 130], [810, 130], [810, 770], [EJE, 770]]), WebkitMaskImage: mask, maskImage: mask }}>
        <Img src={src} style={{ ...full, transformOrigin: `${EJE}px 0px`, transform: "scaleX(-1)" }} />
      </div>}
    </div>
  </AbsoluteFill>;
};

// ---------- Escena 3 · su perfil se proyecta como sombra en la pared: cabeza chica, cuello largo
const PERFIL = [[1050,90],[1130,100],[1200,135],[1250,190],[1275,255],[1265,330],[1245,400],[1210,470],[1215,555],[1290,560],[1300,620],[1000,640],[960,600],[950,520],[1000,480],[940,440],[905,400],[895,360],[880,330],[885,292],[905,265],[915,225],[950,160],[1000,110]];
const EscSombra: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const src = foto("dee05_n165.jpg");
  const z = curva(t, [[a, 1.13], [587.4, 1.3], [b + 0.4, 1.36]]);
  const cx = curva(t, [[a, 1000], [587.4, 820], [b + 0.4, 800]]), cy = curva(t, [[a, 460], [587.4, 380], [590.6, 420], [b + 0.4, 430]]);
  const op = curva(t, [[585.5, 0], [586.2, 0.16], [587.6, 0.16], [588.4, 0.4]]) * (1 - e(t, b - 0.3, b + 0.2));
  const bl = curva(t, [[585.5, 18], [587.6, 18], [588.4, 6]]);
  const Y = curva(t, [[585.5, 300], [587.6, 300], [588.5, 430], [589.6, 430], [591.0, 680]]);
  const mask = `linear-gradient(to bottom, #000 ${Y}px, transparent ${Y + 70}px)`;
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <div style={{ position: "absolute", width: W, height: H, ...cam(cx, cy, z) }}>
      <Img src={src} style={full} />
      {op > 0.01 && <div style={{ ...capa, opacity: op, transformOrigin: "1080px 360px", transform: "translate(-470px, -24px) scale(1.08)", filter: `blur(${bl}px)` }}>
        <div style={{ ...capa, clipPath: poly(PERFIL), WebkitMaskImage: mask, maskImage: mask }}>
          <Img src={src} style={{ ...full, filter: "brightness(0)" }} />
        </div>
      </div>}
    </div>
  </AbsoluteFill>;
};

registerEsc({ EscCuerdas, EscSimetria, EscSombra });
