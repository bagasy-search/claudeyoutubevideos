// swl11e · escenas inventadas sobre las fotos reales (skill edicion-sobre-fotos; ideas en D:/rtmp/swl11e/esc/ideas.md).
// Sólo React + Remotion. Foto a 1920x1080 con objectFit "fill" para que las coordenadas coincidan. Sin dibujos encima.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";

const c01 = (x: number) => Math.max(0, Math.min(1, x));
const ease = (t: number, a: number, b: number) => { const c = c01((t - a) / (b - a)); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };

type P = { src: string; dur: number; marks: number[]; t0?: number };

// 1 · vapor: las tapas arrancan empañadas (copia desenfocada y lavada de la misma foto) y se despejan de abajo hacia arriba,
//     el arroz en "rice" y los fideos en "noodles"; en "date" la cámara se acerca a las etiquetas.
//     Encuadre desde arriba (scale ≥1.25, origen y=0) para que la marca impresa de abajo a la derecha (y>915) nunca entre.
const TAP: { poly: string; y0: number; y1: number }[] = [
  { poly: "inset(335px 910px 255px 120px round 28px)", y0: 825, y1: 335 },
  { poly: "inset(295px 70px 330px 970px round 28px)", y0: 750, y1: 295 },
];
const Vapor: React.FC<P> = ({ src, marks, t0 = 0 }) => {
  const t = useCurrentFrame() / 30 + t0, [r = 2.2, n = 3.45, d = 8.15] = marks;
  const cam = ease(t, d - 0.3, d + 1.2);
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <AbsoluteFill style={{ transform: `scale(${1.26 + 0.03 * c01(t / 9) + 0.12 * cam})`, transformOrigin: `${960 + 40 * cam}px 0px` }}>
      <Img src={staticFile(src)} style={full} />
      {TAP.map((c, i) => {
        const a = i === 0 ? r : n;
        const k = ease(t, a - 0.2, a + 2.8);              // 0 = empañado entero, 1 = despejado
        if (k >= 0.999) return null;
        const line = c.y0 - (c.y0 - c.y1 + 120) * k;     // borde del vapor que sube
        const mask = `linear-gradient(to bottom, #000 ${line - 90}px, transparent ${line + 30}px)`;
        return <div key={i} style={{ position: "absolute", inset: 0, clipPath: c.poly, WebkitMaskImage: mask, maskImage: mask, opacity: 0.92 } as React.CSSProperties}>
          <Img src={staticFile(src)} style={{ ...full, filter: "blur(16px) brightness(1.32) contrast(.7) saturate(.45)" }} />
        </div>;
      })}
    </AbsoluteFill>
  </AbsoluteFill>;
};

// 2 · cinta: la cámara arranca pegada a la fuente de arriba a la izquierda y en "full" se abre a la heladera entera;
//     en "masking tape" cada cinta de papel se estira desde su punta izquierda, primero Erin y después Lyndsey
const CINTAS: { poly: string; x: number; w: number; top: number; h: number }[] = [
  { poly: "polygon(370px 703px, 726px 698px, 722px 782px, 372px 786px)", x: 370, w: 356, top: 698, h: 88 },
  { poly: "polygon(1148px 664px, 1488px 659px, 1488px 742px, 1150px 746px)", x: 1148, w: 340, top: 659, h: 87 },
];
const Cinta: React.FC<P> = ({ src, marks, t0 = 0 }) => {
  const t = useCurrentFrame() / 30 + t0, [fu = 0.98, mt = 4.07, nm = 5.94] = marks;
  const open = ease(t, fu - 0.4, fu + 1.3);
  const s = 1.55 - 0.5 * open;
  const ox = 420 + (960 - 420) * open, oy = 290 + (540 - 290) * open;
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${ox}px ${oy}px` }}>
      <Img src={staticFile(src)} style={full} />
      {CINTAS.map((c, i) => {
        const a = i === 0 ? mt - 0.1 : (mt + nm) / 2;
        const k = ease(t, a, a + 0.75);
        return <React.Fragment key={i}>
          {/* antes de la cinta: el mismo borde de aluminio, corrido 80 px hacia abajo, tapa el lugar de la cinta */}
          <div style={{ position: "absolute", inset: 0, clipPath: c.poly, opacity: k < 1 ? 1 : 0 }}>
            <Img src={staticFile(src)} style={{ ...full, transform: "translateY(80px)" }} />
          </div>
          {k > 0.001 && <div style={{ position: "absolute", inset: 0, clipPath: c.poly, transform: `scaleX(${k}) translateY(${-6 * (1 - k)}px)`, transformOrigin: `${c.x}px ${c.top + c.h / 2}px`, filter: `drop-shadow(${10 * (1 - k)}px ${6 * (1 - k)}px ${8 * (1 - k)}px rgba(0,0,0,.35))` }}>
            <Img src={staticFile(src)} style={full} />
          </div>}
        </React.Fragment>;
      })}
    </AbsoluteFill>
  </AbsoluteFill>;
};

// 3 · reflejo: una banda de brillo (copia aclarada de la misma foto) cruza el vidrio en "baking dish" y la chapa en "loaf pan"
const PIEZAS: { poly: string; x0: number; x1: number }[] = [
  { poly: "polygon(60px 660px, 225px 255px, 495px 112px, 975px 128px, 1110px 210px, 1155px 375px, 1080px 720px, 975px 885px, 855px 930px, 120px 795px)", x0: -300, x1: 1500 },
  { poly: "polygon(1290px 128px, 1770px 210px, 1710px 990px, 1110px 840px)", x0: 800, x1: 2100 },
];
const Reflejo: React.FC<P> = ({ src, dur, marks }) => {
  const t = useCurrentFrame() / 30, [bd = 0.56, lp = 2.0] = marks;
  const cam = ease(t, 0, dur);
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <AbsoluteFill style={{ transform: `scale(${1.03 + 0.04 * cam})`, transformOrigin: "900px 540px" }}>
      <Img src={staticFile(src)} style={full} />
      {PIEZAS.map((p, i) => {
        const a = i === 0 ? bd - 0.15 : lp - 0.15;
        const k = c01((t - a) / 0.95);
        if (k <= 0 || k >= 1) return null;
        const x = p.x0 + (p.x1 - p.x0) * k;
        const mask = `linear-gradient(115deg, transparent ${x - 220}px, #000 ${x - 40}px, #000 ${x + 40}px, transparent ${x + 220}px)`;
        return <div key={i} style={{ position: "absolute", inset: 0, clipPath: p.poly, WebkitMaskImage: mask, maskImage: mask, opacity: Math.sin(Math.PI * k) * 0.85 } as React.CSSProperties}>
          <Img src={staticFile(src)} style={{ ...full, filter: "brightness(1.75) contrast(.85) saturate(.6)" }} />
        </div>;
      })}
    </AbsoluteFill>
  </AbsoluteFill>;
};

const MAP: Record<string, React.FC<P>> = { vapor: Vapor, cinta: Cinta, reflejo: Reflejo };
export const Escena: React.FC<{ name: string; src: string; dur: number; marks: number[]; t0?: number }> = ({ name, ...p }) => {
  const C = MAP[name];
  return C ? <C {...p} /> : null;
};
