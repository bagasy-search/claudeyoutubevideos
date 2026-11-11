// lcf11c · escenas inventadas sobre las fotos reales (skill edicion-sobre-fotos; ideas en D:/rtmp/lcf11c/esc/ideas.md).
// Sólo React + Remotion. Foto a 1920x1080 con objectFit "fill" para que las coordenadas coincidan. Sin dibujos encima.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";

const c01 = (x: number) => Math.max(0, Math.min(1, x));
const ease = (t: number, a: number, b: number) => { const c = c01((t - a) / (b - a)); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };

type P = { src: string; dur: number; marks: number[]; t0?: number };

// 1 · mazo: el lado grueso arranca estirado hacia arriba desde la tabla (y=760) y baja en tres golpes hasta quedar como en la foto
const Mazo: React.FC<P> = ({ src, marks, t0 = 0 }) => {
  const t = useCurrentFrame() / 30 + t0;
  const lv = [1.42, 1.27, 1.13, 1.0];
  let s = lv[0];
  marks.slice(0, 3).forEach((m, i) => {
    const d = t - m;
    if (d >= 0) {
      const hit = d < 0.1 ? d / 0.1 : Math.exp(-(d - 0.1) * 9) * Math.cos((d - 0.1) * 14);
      s = lv[i + 1] - 0.05 * hit;
    }
  });
  const push = ease(t, (marks[3] ?? 99) - 0.2, (marks[3] ?? 99) + 1.4);
  const mask = "linear-gradient(to right, transparent 980px, #000 1090px), linear-gradient(to bottom, transparent 330px, #000 470px)";
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <AbsoluteFill style={{ transform: `scale(${1.04 + 0.5 * push})`, transformOrigin: "890px 660px" }}>
      <Img src={staticFile(src)} style={full} />
      <div style={{ position: "absolute", inset: 0, clipPath: "polygon(980px 300px, 1740px 300px, 1740px 762px, 980px 762px)", transform: `scaleY(${s})`, transformOrigin: "50% 760px", WebkitMaskImage: mask, maskImage: mask, WebkitMaskComposite: "source-in", maskComposite: "intersect" } as React.CSSProperties}>
        <Img src={staticFile(src)} style={full} />
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// 2 · bols: cada bol se inclina hacia la cámara sobre su borde de adelante en su palabra y vuelve a apoyarse
const BOLS: [number, number, number, number][] = [[360, 410, 262, 192], [935, 422, 265, 188], [1550, 668, 322, 258], [835, 830, 335, 260]];
const Bols: React.FC<P> = ({ src, dur, marks, t0 = 0 }) => {
  const t = useCurrentFrame() / 30 + t0;
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <AbsoluteFill style={{ transform: `scale(${1.03 + 0.03 * c01(t / 8)})`, transformOrigin: "930px 600px" }}>
      <Img src={staticFile(src)} style={full} />
      {BOLS.map(([x, y, rx, ry], i) => {
        const m = marks[i] ?? 99; const nx = Math.min(marks[i + 1] ?? m + 1.6, m + 1.6, t0 + dur + 5);
        const k = ease(t, m - 0.08, m + 0.35) * (1 - ease(t, nx - 0.25, nx + 0.2));
        if (k <= 0.001) return null;
        const fy = Math.min(1080, y + ry);
        return <React.Fragment key={i}>
          <div style={{ position: "absolute", left: x - rx * 1.05, top: fy - 40, width: rx * 2.1, height: 80, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(40,30,20,.45), transparent 70%)", filter: "blur(10px)", opacity: k }} />
          <div style={{ position: "absolute", inset: 0, clipPath: `ellipse(${rx}px ${ry}px at ${x}px ${y}px)`, transform: `translateY(${-26 * k}px) scale(${1 + 0.1 * k}, ${1 + 0.36 * k})`, transformOrigin: `${x}px ${fy}px`, filter: `drop-shadow(0 ${18 * k}px ${22 * k}px rgba(0,0,0,.35))` }}>
            <Img src={staticFile(src)} style={full} />
          </div>
        </React.Fragment>;
      })}
    </AbsoluteFill>
  </AbsoluteFill>;
};

// 3 · pliegue: la foto se dobla por la ranura x=915; en "white" se pliega la mitad derecha, en "dark" la izquierda
const Pliegue: React.FC<P> = ({ src, marks }) => {
  const t = useCurrentFrame() / 30, [w = 0.14, d = 2.14] = marks;
  const R = ease(t, w - 0.1, w + 0.6) * (1 - ease(t, d - 0.15, d + 0.55));
  const L = ease(t, d - 0.15, d + 0.55);
  const cam = 190 * R - 190 * L;
  const half = (side: "L" | "R", k: number) => {
    const poly = side === "L" ? "polygon(0 0, 915px 0, 915px 1080px, 0 1080px)" : "polygon(915px 0, 1920px 0, 1920px 1080px, 915px 1080px)";
    const ang = (side === "L" ? -1 : 1) * 78 * k;
    return <div style={{ position: "absolute", inset: 0, clipPath: poly, transform: `perspective(1600px) rotateY(${ang}deg)`, transformOrigin: "915px 540px", filter: `brightness(${1 - 0.45 * k})` }}>
      <Img src={staticFile(src)} style={full} />
    </div>;
  };
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <Img src={staticFile(src)} style={{ ...full, filter: "blur(28px) brightness(.35)", transform: "scale(1.1)" }} />
    <AbsoluteFill style={{ transform: `translateX(${cam}px) scale(1.06)`, transformOrigin: "915px 600px" }}>
      {half("L", L)}
      {half("R", R)}
    </AbsoluteFill>
  </AbsoluteFill>;
};

// 4 · bolsa: la de arriba arranca inflada, se desinfla en "squeeze", queda plana en "flat" y su etiqueta se escribe en "write the date"
const Bolsa: React.FC<P> = ({ src, dur, marks }) => {
  const t = useCurrentFrame() / 30, [sq = 0, fl = 1.68, wr = 2.6, en = 4.2] = marks;
  const air = 1 - ease(t, sq + 0.1, fl + 0.15);
  const wob = t > fl ? Math.exp(-(t - fl) * 6) * Math.sin((t - fl) * 18) * 0.025 : 0;
  const sy = 1 + 0.5 * air + wob, sx = 1 + 0.025 * air;
  const wp = ease(t, wr, en);                 // avance de la escritura sobre la etiqueta (395 → 812)
  const px = 395 + 440 * wp;
  const cam = ease(t, wr - 0.4, Math.min(dur, en + 0.6));
  const sxPatch = (812 - 395) / (392 - 345);
  const mask = `linear-gradient(to right, transparent ${px - 395}px, #000 ${px - 395 + 26}px)`;
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <AbsoluteFill style={{ transform: `scale(${1.03 + 0.22 * cam})`, transformOrigin: "590px 250px" }}>
      <Img src={staticFile(src)} style={full} />
      <div style={{ position: "absolute", inset: 0, clipPath: "inset(140px 60px 758px 255px round 70px)", transform: `scale(${sx}, ${sy})`, transformOrigin: "1060px 232px", filter: `drop-shadow(0 ${10 * air}px ${16 * air}px rgba(0,0,0,.4))` }}>
        <Img src={staticFile(src)} style={full} />
        {/* etiqueta en blanco: el margen liso de la propia etiqueta estirado sobre el texto; se va destapando de izquierda a derecha */}
        <div style={{ position: "absolute", left: 395, top: 212, width: 417, height: 76, overflow: "hidden", WebkitMaskImage: mask, maskImage: mask } as React.CSSProperties}>
          <Img src={staticFile(src)} style={{ position: "absolute", left: -345 * sxPatch, top: -212, width: 1920 * sxPatch, height: 1080, objectFit: "fill" }} />
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

const MAP: Record<string, React.FC<P>> = { mazo: Mazo, bols: Bols, pliegue: Pliegue, bolsa: Bolsa };
export const Escena: React.FC<{ name: string; src: string; dur: number; marks: number[]; t0?: number }> = ({ name, ...p }) => {
  const C = MAP[name];
  return C ? <C {...p} /> : null;
};
