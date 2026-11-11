// swl11b · escenas inventadas sobre las fotos reales (skill edicion-sobre-fotos; ideas en D:/rtmp/swl11b/esc/ideas.md).
// Sólo React + Remotion. Foto a 1920x1080 con objectFit "fill" para que las coordenadas coincidan. Sin dibujos encima.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";

const c01 = (x: number) => Math.max(0, Math.min(1, x));
const ease = (t: number, a: number, b: number) => { const c = c01((t - a) / (b - a)); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const bounce = (t: number, a: number, w = 8, z = 0.45) => { const x = t - a; if (x <= 0) return 0; const wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + (z * w / wd) * Math.sin(wd * x)); };
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };

type P = { src: string; dur: number; marks: number[] };

// 1 · horno: la foto se parte por la parrilla (y=760) en dos pisos que se separan en profundidad; en "underneath" avanza el aluminio
const Horno: React.FC<P> = ({ src, dur, marks }) => {
  const t = useCurrentFrame() / 30, u = marks[0] ?? 1.6;
  const sep = ease(t, 0.2, 1.2) * (1 - 0.35 * ease(t, dur - 0.7, dur));
  const fwd = ease(t, u - 0.2, u + 0.6);
  const top = `scale(${1 - 0.06 * sep - 0.05 * fwd}) translateY(${-46 * sep}px)`;
  const bot = `scale(${1 + 0.02 * sep + 0.16 * fwd}) translateY(${40 * sep - 60 * fwd}px)`;
  return <AbsoluteFill style={{ background: "#0d0a08", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, transform: top, transformOrigin: "50% 40%", filter: `brightness(${1 - 0.3 * fwd})`, clipPath: "polygon(0 0, 100% 0, 100% 70.4%, 0 70.4%)" }}>
      <Img src={staticFile(src)} style={full} />
    </div>
    <div style={{ position: "absolute", inset: 0, transform: bot, transformOrigin: "50% 85%", clipPath: "polygon(0 70.4%, 100% 70.4%, 100% 100%, 0 100%)", boxShadow: "0 -20px 40px rgba(0,0,0,.6)" }}>
      <Img src={staticFile(src)} style={full} />
    </div>
  </AbsoluteFill>;
};

// 2 · mesa de la iglesia: arranca el mantel solo y cada fuente llega de costado a su lugar en su "somebody's"
const Mesa: React.FC<P> = ({ src, dur, marks }) => {
  const t = useCurrentFrame() / 30;
  const cols: [number, number, number][] = [[0, 720, -1], [720, 1160, 1], [1160, 1920, 1]];
  const cam = ease(t, 0, dur);
  return <AbsoluteFill style={{ background: "#efe4cc", overflow: "hidden", transform: `scale(${1.02 + 0.05 * cam})` }}>
    {/* mantel y pared: la foto con la franja de las fuentes tapada por la misma foto muy estirada (sólo tela y madera) */}
    <Img src={staticFile(src)} style={{ ...full, filter: "blur(18px) brightness(1.04)" }} />
    {cols.map(([a, b, dir], i) => {
      const k = bounce(t, (marks[i] ?? i * 1.5) - 0.15, 7.5, 0.6);
      const dx = (1 - k) * dir * 1100;
      return <div key={i} style={{ position: "absolute", inset: 0, clipPath: `polygon(${(a / 19.2).toFixed(2)}% 0, ${(b / 19.2).toFixed(2)}% 0, ${(b / 19.2).toFixed(2)}% 100%, ${(a / 19.2).toFixed(2)}% 100%)`, transform: `translateX(${dx}px)`, opacity: k > 0.02 ? 1 : 0 }}>
        <Img src={staticFile(src)} style={full} />
      </div>;
    })}
  </AbsoluteFill>;
};

// 3 · sartén: una copia "cruda" (tinte rosado) se come desde el borde de la sartén hacia el centro; al "hundred" la cámara va al 160
const Sarten: React.FC<P> = ({ src, dur, marks }) => {
  const t = useCurrentFrame() / 30, [a = 1.3, b = 2.1, c = 2.9] = marks;
  const cook = ease(t, a - 0.6, b + 0.3);     // radio del "crudo" que queda: de todo a nada
  const r = 1300 * (1 - cook);
  const go = ease(t, c - 0.2, Math.min(dur, c + 1.4));
  const mask = `radial-gradient(circle at 900px 600px, #000 ${Math.max(0, r - 160)}px, transparent ${r}px)`;
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <AbsoluteFill style={{ transform: `scale(${1 + 1.1 * go}) translate(${-260 * go}px, ${150 * go}px)`, transformOrigin: "1500px 265px" }}>
      <Img src={staticFile(src)} style={full} />
      <div style={{ position: "absolute", inset: 0, WebkitMaskImage: mask, maskImage: mask, opacity: cook < 1 ? 1 : 0, clipPath: "ellipse(760px 480px at 900px 590px)" } as React.CSSProperties}>
        <Img src={staticFile(src)} style={{ ...full, filter: "sepia(1) hue-rotate(-38deg) saturate(1.6) brightness(1.18)" }} />
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// 4 · papas en la heladera: las tres se cuentan saltando de a una en "the other three" y se asientan con su sombra
const Papas: React.FC<P> = ({ src, dur, marks }) => {
  const t = useCurrentFrame() / 30, a = (marks[0] ?? 4.4) - 0.1;
  const E: [number, number, number, number][] = [[470, 665, 260, 345], [970, 665, 240, 335], [1450, 660, 280, 340]];
  const cam = ease(t, 0, dur);
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <AbsoluteFill style={{ transform: `scale(${1.0 + 0.06 * cam})`, transformOrigin: "50% 62%" }}>
      <Img src={staticFile(src)} style={full} />
      {E.map(([x, y, rx, ry], i) => {
        const s = a + i * 0.32, up = Math.sin(Math.PI * c01((t - s) / 0.42)) * (1 - 0.0);
        const settle = bounce(t, s + 0.42, 14, 0.3);
        const lift = up * 70 + (t > s + 0.42 ? (1 - settle) * 10 : 0);
        return <React.Fragment key={i}>
          <div style={{ position: "absolute", left: x - rx, top: y + ry - 30, width: rx * 2, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,.45), transparent 70%)", opacity: c01(up * 1.5), filter: "blur(6px)" }} />
          <div style={{ position: "absolute", inset: 0, clipPath: `ellipse(${rx}px ${ry}px at ${x}px ${y}px)`, transform: `translateY(${-lift}px) scale(${1 + 0.05 * up})`, transformOrigin: `${x}px ${y}px` }}>
            <Img src={staticFile(src)} style={full} />
          </div>
        </React.Fragment>;
      })}
    </AbsoluteFill>
  </AbsoluteFill>;
};

const MAP: Record<string, React.FC<P>> = { horno: Horno, mesa: Mesa, sarten: Sarten, papas: Papas };
export const Escena: React.FC<{ name: string; src: string; dur: number; marks: number[] }> = ({ name, ...p }) => {
  const C = MAP[name];
  return C ? <C {...p} /> : null;
};
