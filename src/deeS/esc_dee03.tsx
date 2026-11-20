// dee03 · escenas sobre las fotos reales (ideas en D:/rtmp/dee03/ideas.md). Todo es función pura de t (segundos del video).
// Coordenadas en 1920x1080 de la foto; la cámara nunca muestra x>1729 ni y fuera de 53–1027 (estrellita NB fuera de cuadro).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { registerEsc } from "./Body";
import { P, cl, e, eo, lerp } from "./lib";

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
const mover = (pts: number[][], dx: number, dy: number) => pts.map(([x, y]) => [x + dx, y + dy]);

// ---------- Escena 1 · los mechones vecinos se reparten encima del oscuro como naipes: castaño y después naranja, que se queda
const OSCURO = [[395,585],[430,600],[470,640],[540,700],[600,760],[650,830],[680,900],[640,920],[570,890],[500,830],[430,760],[380,690],[365,630],[375,595]];
const CASTANO = mover(OSCURO, 185, -20);
const NARANJA = [[750,520],[785,535],[825,575],[895,635],[925,675],[930,745],[1010,760],[1035,835],[995,855],[925,825],[855,765],[785,695],[735,625],[720,565],[730,530]];
const Naipe: React.FC<{ src: string; pts: number[][]; dx: number; dy: number; k: number }> = ({ src, pts, dx, dy, k }) => {
  const alza = Math.sin(Math.PI * cl(k)), [ox, oy] = [pts[0][0] + 150, pts[0][1] + 160];
  return <div style={{ ...capa, transformOrigin: `${ox}px ${oy}px`, transform: `translate(${dx * k}px, ${dy * k - 22 * alza}px) scale(${1 + 0.05 * alza})`,
    filter: `drop-shadow(0 ${6 + 14 * alza}px ${10 + 16 * alza}px rgba(0,0,0,${0.35 + 0.25 * alza}))` }}>
    <Img src={src} style={{ ...full, clipPath: poly(pts) }} />
  </div>;
};
const EscMechones: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const src = foto("dee03_n156.jpg");
  const z = curva(t, [[a, 1.13], [597.4, 1.5], [b + 0.4, 1.58]]);
  const cx = curva(t, [[a, 900], [597.4, 640], [b + 0.4, 620]]), cy = curva(t, [[a, 680], [597.4, 730], [b + 0.4, 745]]);
  const kC = eo(t, 597.95, 0.75), kN = eo(t, 599.95, 0.8);
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <div style={{ position: "absolute", width: W, height: H, ...cam(cx, cy, z) }}>
      <Img src={src} style={full} />
      {t > 597.9 && <Naipe src={src} pts={CASTANO} dx={-185} dy={20} k={kC} />}
      {t > 599.9 && <Naipe src={src} pts={NARANJA} dx={-355} dy={65} k={kN} />}
    </div>
  </AbsoluteFill>;
};

// ---------- Escena 2 · el reflejo del espejo de mano toma el tinte de la muestra nombrada: dorado en "yellow", gris en "grey"
const VIDRIO = [[740,0],[1372,0],[1372,330],[1290,345],[1265,400],[1270,520],[770,588],[745,570]];
const EscEspejo: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const src = foto("dee03_n201_toowarm.jpg");
  const z = curva(t, [[a, 1.13], [788.3, 1.3], [b + 0.4, 1.36]]);
  const cx = curva(t, [[a, 1000], [788.3, 1060], [b + 0.4, 1080]]), cy = curva(t, [[a, 480], [788.3, 330], [b + 0.4, 320]]);
  const calido = e(t, 787.2, 788.3) * (1 - e(t, 788.65, 789.2)), frio = e(t, 789.3, 790.05);
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <div style={{ position: "absolute", width: W, height: H, ...cam(cx, cy, z) }}>
      <Img src={src} style={full} />
      {calido > 0.01 && <div style={{ ...capa, opacity: 0.85 * calido, clipPath: poly(VIDRIO) }}>
        <Img src={src} style={{ ...full, filter: "sepia(0.75) saturate(2.3) hue-rotate(-8deg) brightness(1.04)" }} /></div>}
      {frio > 0.01 && <div style={{ ...capa, opacity: 0.9 * frio, clipPath: poly(VIDRIO) }}>
        <Img src={src} style={{ ...full, filter: "grayscale(1) brightness(0.88) contrast(0.9)" }} /></div>}
    </div>
  </AbsoluteFill>;
};

// ---------- Escena 3 · las dos teclas se tocan con las palabras: la gris clara en "silver", la de marfil amarillenta en "yellow" y en "piano key"
const GRIS = [[605,858],[630,852],[760,868],[895,888],[915,905],[925,932],[905,945],[780,935],[640,915],[605,900]];
const MARFIL = [[935,912],[1100,925],[1125,950],[1120,975],[1060,975],[925,950]];
const toque = (t: number, a: number) => (t < a ? 0 : t < a + 0.1 ? (t - a) / 0.1 : Math.max(0, 1 - (t - a - 0.1) / 0.35));
const Tecla: React.FC<{ src: string; pts: number[][]; p: number }> = ({ src, pts, p }) =>
  <div style={{ ...capa, transform: `translateY(${7 * p}px)`, filter: `brightness(${1 - 0.2 * p})` }}>
    <Img src={src} style={{ ...full, clipPath: poly(pts) }} />
  </div>;
const EscTeclas: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const src = foto("dee03_n232.jpg");
  const z = curva(t, [[a, 1.13], [892.3, 1.7], [894.3, 1.75], [895.0, 1.8], [b + 0.4, 1.86]]);
  const cx = curva(t, [[a, 960], [892.3, 820], [894.3, 840], [895.0, 1000], [b + 0.4, 1010]]);
  const cy = curva(t, [[a, 600], [892.3, 880], [b + 0.4, 900]]);
  const pG = toque(t, 892.5), pM = Math.max(toque(t, 895.12), toque(t, 897.1));
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <div style={{ position: "absolute", width: W, height: H, ...cam(cx, cy, z) }}>
      <Img src={src} style={full} />
      {pG > 0 && <Tecla src={src} pts={GRIS} p={pG} />}
      {pM > 0 && <Tecla src={src} pts={MARFIL} p={pM} />}
    </div>
  </AbsoluteFill>;
};

registerEsc({ EscMechones, EscEspejo, EscTeclas });
