// Escenas sobre fotos de lcf11d (skill edicion-sobre-fotos). Ideas y coordenadas: D:/rtmp/lcf11d/esc/ideas.md
// Fotos a 1920x1080 con objectFit fill: las coordenadas son las de la rejilla de ideas.md.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const W = 1920, H = 1080;
const CL = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const EZ = Easing.bezier(0.45, 0, 0.25, 1);
const poly = (p: number[][]) => `polygon(${p.map(([x, y]) => `${x}px ${y}px`).join(",")})`;
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: W, height: H, objectFit: "fill" };

// cámara: punto de foco (cx,cy) a escala s, sin dejar bordes vacíos
const cam = (cx: number, cy: number, s: number) => {
  const tx = Math.min(0, Math.max(W - W * s, W / 2 - cx * s));
  const ty = Math.min(0, Math.max(H - H * s, H / 2 - cy * s));
  return `translate(${tx}px, ${ty}px) scale(${s})`;
};
// recorrido por llaves [frame, cx, cy, s] con curva suave entre llaves
const track = (f: number, keys: number[][]) => {
  const fr = keys.map((k) => k[0]);
  const v = (i: number) => interpolate(f, fr, keys.map((k) => k[i]), { ...CL, easing: EZ });
  return cam(v(1), v(2), v(3));
};

// ---------- Escena 1 · la brisa entra por la ventana y mece las cortinas cosidas a mano
const CORT_IZQ = [[761, 0], [1051, 0], [1054, 367], [1042, 616], [1021, 719], [940, 706], [878, 690], [800, 676], [761, 668], [775, 560], [783, 440], [780, 300], [776, 176]];
const CORT_DER = [[1478, 0], [1753, 0], [1763, 293], [1768, 470], [1771, 631], [1785, 829], [1700, 818], [1624, 807], [1540, 803], [1481, 800], [1495, 660], [1507, 514], [1500, 360], [1493, 220]];
const Cortina: React.FC<{ src: string; p: number[][]; sgn: number; f: number; amp: number }> = ({ src, p, sgn, f, amp }) => {
  const y0 = Math.min(...p.map((q) => q[1])), y1 = Math.max(...p.map((q) => q[1]));
  const N = 14, h = (y1 - y0) / N;
  return (
    <>
      {Array.from({ length: N }, (_, k) => {
        const top = y0 + k * h, w = Math.pow((k + 0.5) / N, 1.6);
        const dx = sgn * amp * w * (0.65 + 0.35 * Math.sin((2 * Math.PI * f) / 24 - k * 0.42));
        return (
          <div key={k} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, clipPath: `inset(${top - 1}px 0px ${H - top - h - 1}px 0px)` }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `translateX(${dx}px)` }}>
              <Img src={staticFile(src)} style={{ ...full, clipPath: poly(p) }} />
            </div>
          </div>
        );
      })}
    </>
  );
};
export const EscBrisa: React.FC<{ dur: number; src: string; fC: number; fS: number; fStove: number; fHen: number }> = ({ dur, src, fC, fS, fStove, fHen }) => {
  const f = useCurrentFrame();
  // el soplo: sube en "curtains", se sostiene hasta "sewed" y se aquieta despacio
  const amp = 18 * interpolate(f, [fC - 4, fC + 8], [0, 1], CL) * interpolate(f, [fS, fS + 70], [1, 0.12], { ...CL, easing: Easing.out(Easing.quad) });
  const t = track(f, [[0, 1270, 420, 1.1], [fS + 6, 1250, 430, 1.13], [fStove + 6, 760, 560, 1.12], [fHen - 6, 900, 650, 1.1], [fHen + 24, 1240, 760, 1.17], [dur, 1180, 790, 1.2]]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: t }}>
        <Img src={staticFile(src)} style={full} />
        <Cortina src={src} p={CORT_IZQ} sgn={-1} f={f} amp={amp} />
        <Cortina src={src} p={CORT_DER} sgn={1} f={f + 5} amp={amp * 1.15} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- Escena 2 · el televisor de 1965 se prende como un tubo viejo en "television"
const PANT = [[700, 198], [1147, 198], [1171, 222], [1171, 551], [1147, 575], [700, 575], [676, 551], [676, 222]];
const PC = [923.5, 386.5];
export const EscTele: React.FC<{ dur: number; src: string; fFl: number; fOn: number; fW: number }> = ({ dur, src, fFl, fOn, fW }) => {
  const f = useCurrentFrame(), g = f - fOn;
  const sx = interpolate(g, [0, 3, 7], [0.02, 0.02, 1], CL);
  const sy = interpolate(g, [0, 7, 14], [0.012, 0.012, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const flick = f > fW ? 0.04 * Math.sin(f * 1.7) + 0.03 * Math.sin(f * 0.53) : 0;
  const br = interpolate(g, [0, 7, 16], [4, 3.2, 1.05], CL) + flick;
  const t = track(f, [[0, 860, 960, 1.24], [fFl + 10, 860, 930, 1.27], [fOn - 26, 870, 760, 1.18], [fOn + 4, 923, 400, 1.2], [dur, 923, 395, 1.27]]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: t }}>
        <Img src={staticFile(src)} style={full} />
        {/* el mismo vidrio, apagado */}
        <Img src={staticFile(src)} style={{ ...full, clipPath: poly(PANT), filter: "brightness(0.13) saturate(0.15) contrast(0.8)" }} />
        {g >= 0 && (
          <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: `${PC[0]}px ${PC[1]}px`, transform: `scale(${sx}, ${sy})` }}>
            <Img src={staticFile(src)} style={{ ...full, clipPath: poly(PANT), filter: `brightness(${br}) saturate(${interpolate(g, [0, 16], [0, 1], CL)})` }} />
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
