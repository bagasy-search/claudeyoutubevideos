// dee04 · escenas sobre las fotos reales (ideas en D:/rtmp/dee04/ideas.md). Todo es función pura de t (segundos del video).
// Coordenadas en 1920x1080 de la foto; la cámara nunca muestra x>1729 ni y fuera de 53–1027 (estrellita NB fuera de cuadro).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { registerEsc } from "./Body";
import { P, cl, e, lerp } from "./lib";

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

// ---------- Escena 1 · la contraluz entra por las puntas y recorre el mechón: donde llega, el pelo se transparenta
const MECHON = [[0,0],[250,50],[500,160],[700,250],[860,300],[950,220],[1100,200],[1260,280],[1200,350],[1050,380],[900,395],[850,440],[700,470],[450,420],[250,330],[0,290]];
const EscContraluz: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const src = foto("dee04_n049.jpg");
  const z = curva(t, [[a, 1.13], [186.4, 1.45], [189.7, 1.45], [b + 0.4, 1.55]]);
  const cx = curva(t, [[a, 640], [186.4, 1000], [b + 0.4, 1030]]), cy = curva(t, [[a, 330], [186.4, 330], [b + 0.4, 320]]);
  const S = curva(t, [[187.45, 600], [189.0, 1500]]), op = e(t, 187.4, 187.8);   // frente de luz: px desde el borde derecho
  const mask = `linear-gradient(to left, #000 0px, #000 ${S}px, transparent ${S + 260}px)`;
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <div style={{ position: "absolute", width: W, height: H, ...cam(cx, cy, z) }}>
      <Img src={src} style={full} />
      {op > 0.01 && <div style={{ ...capa, opacity: 0.8 * op, clipPath: poly(MECHON), WebkitMaskImage: mask, maskImage: mask }}>
        <Img src={src} style={{ ...full, filter: "brightness(1.75) contrast(0.8) saturate(0.55)" }} />
      </div>}
    </div>
  </AbsoluteFill>;
};

// ---------- Escena 2 · corte seco sobre la hebra real: el tramo fino se suelta y cae; queda lo parejo
const COLA = [[1125,725],[1220,774],[1300,795],[1370,800],[1372,830],[1300,826],[1215,806],[1120,752]];
const EscCorte: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const src = foto("dee04_n063.jpg");
  const z = curva(t, [[a, 1.13], [229.6, 1.6], [232.3, 1.6], [233.6, 1.2], [b + 0.4, 1.22]]);
  const cx = curva(t, [[a, 1000], [229.6, 1180], [232.3, 1150], [233.6, 900], [b + 0.4, 890]]);
  const cy = curva(t, [[a, 560], [229.6, 740], [232.3, 720], [233.6, 560], [b + 0.4, 560]]);
  const T0 = 229.75, dt = Math.max(0, t - T0), cae = t > T0;
  const dy = 20 * dt + 900 * dt * dt, rot = 9 * cl(dt / 0.8), opc = 1 - e(t, T0 + 0.5, T0 + 0.8);
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <div style={{ position: "absolute", width: W, height: H, ...cam(cx, cy, z) }}>
      <Img src={src} style={full} />
      {cae && <>
        <div style={{ ...capa, clipPath: poly(COLA) }}><Img src={src} style={{ ...full, transform: "translateY(45px)" }} /></div>
        {opc > 0.01 && <div style={{ ...capa, opacity: opc, transformOrigin: "1130px 740px", transform: `translate(${14 * dt}px, ${dy}px) rotate(${rot}deg)`,
          filter: "drop-shadow(0 6px 6px rgba(0,0,0,.35))" }}><Img src={src} style={{ ...full, clipPath: poly(COLA) }} /></div>}
      </>}
    </div>
  </AbsoluteFill>;
};

// ---------- Escena 3 · en "cotton setting" la seda se tuesta desde la nariz de la plancha
const BLUSA = [[485,640],[600,615],[740,610],[860,625],[960,650],[1035,700],[1045,792],[1290,800],[1480,790],[1500,830],[1490,880],[1420,890],[1200,860],[1050,840],[980,850],[960,1080],[500,1080],[480,900]];
const EscPlancha: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const src = foto("dee04_n153.jpg");
  const z = curva(t, [[a, 1.13], [574.0, 1.5], [b + 0.4, 1.58]]);
  const cx = curva(t, [[a, 900], [574.0, 1030], [b + 0.4, 1040]]), cy = curva(t, [[a, 700], [574.0, 760], [b + 0.4, 770]]);
  const r = curva(t, [[573.95, 0], [574.7, 170], [575.0, 170], [575.7, 250]]);
  const mask = `radial-gradient(ellipse ${r * 1.5}px ${r}px at 1050px 760px, #000 0%, rgba(0,0,0,.75) 55%, transparent 100%)`;
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <div style={{ position: "absolute", width: W, height: H, ...cam(cx, cy, z) }}>
      <Img src={src} style={full} />
      {r > 2 && <div style={{ ...capa, opacity: 0.85, clipPath: poly(BLUSA), WebkitMaskImage: mask, maskImage: mask }}>
        <Img src={src} style={{ ...full, filter: "sepia(1) saturate(1.6) brightness(0.78) hue-rotate(-6deg)" }} />
      </div>}
    </div>
  </AbsoluteFill>;
};

registerEsc({ EscContraluz, EscCorte, EscPlancha });
