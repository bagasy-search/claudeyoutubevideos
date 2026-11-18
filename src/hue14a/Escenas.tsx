// Escenas sobre fotos de hue14a (D:/rtmp/hue14a/ideas.md). Escritas de cero: solo React y Remotion, sin SVG.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { FONTS } from "./Piezas";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const S = (sec: number) => Math.round(sec * 30);
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
// cámara: centro (cx, cy) de la foto en el centro de la pantalla, con escala mínima para no dejar bordes vacíos
const cover = (cx: number, cy: number, s: number) => Math.max(s, 960 / cx, 960 / (1920 - cx), 540 / cy, 540 / (1080 - cy), 1);
const cam = (cx: number, cy: number, s: number): React.CSSProperties => {
  const k = cover(cx, cy, s);
  return { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${960 - cx * k}px, ${540 - cy * k}px) scale(${k})` };
};
const seg = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...CL, easing: io });
const poly = (p: number[][]) => `polygon(${p.map(([x, y]) => `${x}px ${y}px`).join(",")})`;
// banda alrededor de una rama recta: n puntos por lado
const band = (x0: number, y0: number, x1: number, y1: number, w: number, n = 8) => {
  const L = Math.hypot(x1 - x0, y1 - y0), nx = -(y1 - y0) / L, ny = (x1 - x0) / L, a: number[][] = [], b: number[][] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = lerp(x0, x1, t), y = lerp(y0, y1, t), ww = w * (0.8 + 0.2 * Math.sin(i * 1.7));
    a.push([x + nx * ww, y + ny * ww]); b.unshift([x - nx * ww, y - ny * ww]);
  }
  return [...a, ...b];
};
const CREAM = "#F6EFDF";

// rótulo: etiqueta kraft atada con hilo al punto (x, y) de la foto; cae y se mece con peso (vuelta 2: grande y legible)
const Rotulo: React.FC<{ x: number; y: number; w: number; t: string; f0: number; left?: boolean }> = ({ x, y, t, f0, left }) => {
  const f = useCurrentFrame(); if (f < f0) return null;
  const k = spring({ frame: f - f0, fps: 30, config: { damping: 9, mass: 0.9, stiffness: 150 } });
  const sw = Math.exp(-(f - f0) / 26) * Math.cos(((f - f0) / 30) * Math.PI * 2) * 6;
  return (
    <div style={{ position: "absolute", left: x, top: y, transformOrigin: "0 0", transform: `rotate(${(left ? 18 : -18) + sw}deg)` }}>
      <div style={{ position: "absolute", left: -3, top: 0, width: 6, height: 150 * k, backgroundImage: "repeating-linear-gradient(60deg, #D2B07A 0 4px, #A07B45 4px 7px)", borderRadius: 3 }} />
      <div style={{ position: "absolute", left: left ? -330 : -40, top: 140 * k, padding: "16px 34px 20px", whiteSpace: "nowrap", borderRadius: 8, opacity: k > 0.3 ? 1 : 0,
        backgroundColor: "#C9A36A", backgroundImage: "repeating-linear-gradient(17deg, rgba(90,60,25,0.07) 0 2px, transparent 2px 7px)", boxShadow: "14px 20px 26px rgba(0,0,0,0.45)",
        transform: `rotate(${left ? -18 : 18}deg)`, fontFamily: FONTS.SERIF, fontSize: 66, color: "#2B2118" }}>{t}</div>
    </div>
  );
};

// ── Escena 1 · despunte: la yema de punta (823-875 x 111-232) se suelta por la línea de corte y cae girando hasta el piso de piedra real (y 960)
const TIP = [[848, 111], [858, 125], [868, 145], [874, 168], [873, 190], [866, 208], [857, 222], [854, 232], [842, 232], [839, 222], [830, 208], [822, 190], [820, 168], [824, 145], [834, 125]];
const TIP_PATCH = [[846, 102], [864, 120], [878, 145], [884, 168], [882, 192], [874, 212], [862, 228], [858, 236], [838, 236], [834, 228], [822, 212], [813, 192], [811, 168], [816, 145], [830, 120]];
export const EscDespunte: React.FC<{ src: string; r10: string; veo?: string; dur: number }> = ({ src, r10, veo, dur }) => {
  const f = useCurrentFrame();
  const fCut = S(5.9);
  if (f >= fCut) {
    const k = seg(f, fCut, dur);
    return (
      <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
        {veo && f >= S(9.0) ? <OffthreadVideo src={staticFile(veo)} startFrom={0} muted style={{ width: 1920, height: 1080, objectFit: "cover" }} />
          : <div style={cam(lerp(1080, 1180, k), lerp(520, 470, k) - 20 * Math.sin(k * Math.PI), lerp(1.06, 1.28, k))}><Img src={staticFile(r10)} style={FULL} /></div>}
      </AbsoluteFill>
    );
  }
  // cámara: sube en curva por el tallo hasta la yema de punta (848,170)
  const a = seg(f, 0, fCut);
  const cx = lerp(900, 848, a) + 30 * Math.sin(a * Math.PI), cy = lerp(620, 260, a), s2 = lerp(1.04, 1.5, a);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#8fb3e0" }}>
      <div style={cam(cx, cy, s2)}><Img src={staticFile(src)} style={FULL} /></div>
    </AbsoluteFill>
  );
};

// tablita de madera clavada en la tierra en (x, y = punto donde pisa); cae con peso, se clava, rebota y levanta polvo
const Tablita: React.FC<{ x: number; y: number; t: string; f0: number; size?: number }> = ({ x, y, t, f0, size = 64 }) => {
  const f = useCurrentFrame(); if (f < f0) return null;
  const k = spring({ frame: f - f0, fps: 30, config: { damping: 9, mass: 1.1, stiffness: 170 } });
  const sw = Math.exp(-(f - f0) / 10) * Math.sin((f - f0) / 2) * 2.5;
  return (
    <>
      <div style={{ position: "absolute", left: x - 70, top: y - 10, width: 140, height: 26, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,0.45), rgba(0,0,0,0) 70%)", opacity: k }} />
      <div style={{ position: "absolute", left: x, top: y, transformOrigin: "0 0", transform: `translateY(${(1 - k) * -600}px) rotate(${-3 + sw}deg)` }}>
        <div style={{ position: "absolute", left: -9, top: -150, width: 18, height: 160, borderRadius: 3, background: "linear-gradient(90deg, #8a5d35, #b07f4e 50%, #6e4626)" }} />
        <div style={{ position: "absolute", left: 0, top: -150, transform: "translate(-50%, -100%)", padding: "14px 34px 18px", whiteSpace: "nowrap", borderRadius: 6,
          background: "linear-gradient(180deg, #c99a62, #a8794a)", backgroundImage: "repeating-linear-gradient(0deg, rgba(70,40,15,0.18) 0 2px, transparent 2px 9px), linear-gradient(180deg, #c99a62, #a8794a)",
          boxShadow: "12px 16px 20px rgba(0,0,0,0.45)", fontFamily: FONTS.SERIF, fontSize: size, color: "#2B2118" }}>{t}</div>
      </div>
    </>
  );
};

// ── Escena 2 · poda (versión simple, vuelta 4): plano abierto real, cámara curva lenta del muñón (555,195) a la rama cortada del piso;
// en «la mitad» se clava una tablita al lado del muñón. Nada más.
export const EscPoda: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  const fMit = S(10.38);
  const a = seg(f, 0, dur);
  const cx = lerp(620, 520, a) + 60 * Math.sin(a * Math.PI), cy = lerp(380, 640, a), s = lerp(1.32, 1.12, a);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#55524c" }}>
      <div style={cam(cx, cy, s)}>
        <Img src={staticFile(src)} style={FULL} />
        <Tablita x={640} y={540} t="la mitad" f0={fMit - 4} />
      </div>
    </AbsoluteFill>
  );
};

// ── Escena 3 · prueba del dedo (versión simple, vuelta 4): la regla ya está clavada al lado del dedo desde el cuadro 0;
// lo único que se mueve es la marca roja, que sube de la punta (y 683) al nudillo (y 495), y la cámara curva. En «tres centímetros», «3 cm».
export const EscDedo: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  const fCm = S(7.54);
  const a = seg(f, 0, dur);
  const cx = lerp(980, 1020, a) - 40 * Math.sin(a * Math.PI), cy = lerp(520, 560, a), s = lerp(1.02, 1.22, a);
  const m = seg(f, fCm - 50, fCm);
  const yM = lerp(683, 495, m);
  const lab = spring({ frame: f - fCm, fps: 30, config: { damping: 10, stiffness: 160 } });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#3b3a38" }}>
      <div style={cam(cx, cy, s)}>
        <Img src={staticFile(src)} style={FULL} />
        <div style={{ position: "absolute", left: 1092, top: 200, width: 104, height: 520, borderRadius: 6, transform: "rotate(2deg)", transformOrigin: "50% 100%",
          background: "linear-gradient(90deg, #d9b98a, #f0dcb4 40%, #c9a473)", boxShadow: "14px 16px 20px rgba(0,0,0,0.45), inset -4px 0 0 rgba(90,60,25,0.25)" }}>
          {Array.from({ length: 22 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 0, bottom: i * 23, width: i % 5 === 0 ? 46 : 24, height: 3, background: "#4a3420" }} />)}
        </div>
        <div style={{ position: "absolute", left: 1086, top: 716, width: 120, height: 18, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,0.45), rgba(0,0,0,0) 70%)" }} />
        {f >= fCm - 50 && <div style={{ position: "absolute", left: 990, top: yM - 4, width: 220, height: 8, borderRadius: 4, background: "#B4321C", boxShadow: "0 3px 4px rgba(0,0,0,0.5)" }} />}
        {f >= fCm && <div style={{ position: "absolute", left: 1230, top: 560, padding: "8px 28px 12px", borderRadius: 8, backgroundColor: "#C9A36A", boxShadow: "10px 14px 18px rgba(0,0,0,0.45)",
          whiteSpace: "nowrap", fontFamily: FONTS.SERIF, fontSize: 80, color: "#2B2118", transform: `scale(${lab}) rotate(${-3 * lab}deg)`, transformOrigin: "0 50%" }}>3 cm</div>}
      </div>
    </AbsoluteFill>
  );
};
