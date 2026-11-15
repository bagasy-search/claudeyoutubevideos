// Escenas sobre las fotos reales de cme14b (método edicion-sobre-fotos; ideas en D:/rtmp/cme14b/ideas.md).
// Capas de la misma foto en 1920x1080 (objectFit fill), recortes con clip-path: sin dibujos encima.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const fade = (f: number, dur: number) => interpolate(f, [0, 6, dur - 8, dur], [0, 1, 1, 0], CL);
const poly = (p: number[][]) => `polygon(${p.map(([x, y]) => `${x}px ${y}px`).join(",")})`;
// resorte amortiguado 0→1 que se pasa un poco y se asienta
const spr = (f: number, at: number) => { const t = Math.max(0, f - at) / 30; return f < at ? 0 : 1 - Math.exp(-5 * t) * Math.cos(9 * t); };

// 1 · INFLADOS: cada aparato se infla desde su base según lo que consume, al lado de la estación que no crece
const APAR = [
  { o: [228, 535], s: 1.95, p: [[48, 350], [90, 330], [150, 320], [240, 345], [330, 380], [390, 410], [410, 450], [405, 500], [360, 525], [240, 535], [110, 520], [80, 490], [70, 440], [55, 380]] },
  { o: [560, 520], s: 2.25, p: [[430, 320], [520, 275], [620, 255], [680, 270], [712, 320], [700, 360], [640, 385], [610, 420], [590, 480], [540, 520], [505, 505], [530, 440], [560, 395], [470, 355], [432, 340]] },
  { o: [1690, 495], s: 1.9, p: [[1530, 320], [1570, 265], [1650, 240], [1760, 240], [1830, 270], [1850, 330], [1840, 440], [1790, 485], [1700, 495], [1590, 485], [1545, 450], [1530, 390]] },
  { o: [902, 490], s: 2.1, p: [[790, 255], [820, 240], [990, 240], [1018, 260], [1018, 470], [1000, 490], [810, 490], [790, 470]] },
  { o: [1310, 495], s: 1.85, p: [[1075, 295], [1110, 285], [1440, 285], [1500, 300], [1545, 430], [1520, 455], [1430, 475], [1440, 495], [1100, 495], [1085, 470], [1080, 420]] },
];
export const EscInflados: React.FC<{ dur: number; img: string; fs: number[] }> = ({ dur, img, fs }) => {
  const f = useCurrentFrame();
  const fin = fs[fs.length - 1] ?? dur;
  const camZ = 1.06 + interpolate(f, [0, fin + 20], [0, 0.05], CL);
  const camY = interpolate(f, [0, fin + 20], [0, 30], CL);
  const dim = interpolate(f, [fs[0] ?? 0, (fs[0] ?? 0) + 12], [1, 0.6], CL);
  return (
    <AbsoluteFill style={{ background: "#0E0E0F", overflow: "hidden", opacity: fade(f, dur) }}>
      <AbsoluteFill style={{ transformOrigin: "960px 600px", transform: `translateY(${camY}px) scale(${camZ})` }}>
        <Img src={staticFile(img)} style={{ ...FULL, filter: `brightness(${dim})` }} />
        {APAR.map((a, i) => {
          const at = fs[i] ?? 99999;
          if (f < at) return null;
          const k = spr(f, at);
          const sig = fs[i + 1] ?? 99999;
          const baja = interpolate(f, [sig, sig + 10], [1, 0.3], { ...CL, easing: io });
          const sc = 1 + (a.s - 1) * k * baja;
          const luz = interpolate(f, [sig, sig + 10], [1, 0.62], CL);
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${a.o[0]}px ${a.o[1]}px`, transform: `scale(${sc})`, zIndex: f >= sig ? 1 : 10, filter: `brightness(${luz}) drop-shadow(0 ${14 * k}px ${22 * k}px rgba(0,0,0,0.6))` }}>
              <Img src={staticFile(img)} style={{ ...FULL, clipPath: poly(a.p) }} />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 2 · MECHA: el cable real de la acometida se pone incandescente de la casa al poste y el transformador se enciende
const CABLE = [[585, 570], [700, 505], [820, 440], [940, 376], [1060, 312], [1180, 246], [1300, 170], [1362, 130]];
const largo = (p: number[][]) => p.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - p[i][0], q[1] - p[i][1]), 0);
const tramo = (p: number[][], t: number) => {
  const L = largo(p) * t; const out = [p[0]]; let acc = 0;
  for (let i = 1; i < p.length; i++) {
    const d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
    if (acc + d >= L) { const u = (L - acc) / d; out.push([p[i - 1][0] + (p[i][0] - p[i - 1][0]) * u, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * u]); return out; }
    acc += d; out.push(p[i]);
  }
  return out;
};
const banda = (p: number[][], w: number) => {
  if (p.length < 2) return [[0, 0], [0, 0], [0, 0]];
  const a = p[0], b = p[p.length - 1]; const dx = b[0] - a[0], dy = b[1] - a[1]; const n = Math.hypot(dx, dy) || 1;
  const nx = (-dy / n) * w, ny = (dx / n) * w;
  return [...p.map(([x, y]) => [x + nx, y + ny]), ...p.slice().reverse().map(([x, y]) => [x - nx, y - ny])];
};
export const EscMecha: React.FC<{ dur: number; img: string; fIni: number; fFin: number }> = ({ dur, img, fIni, fFin }) => {
  const f = useCurrentFrame();
  const llega = Math.min(Math.max(fFin, fIni + 24), dur - 40);
  const t = interpolate(f, [fIni, llega], [0, 1], { ...CL, easing: Easing.in(Easing.quad) });
  const golpe = f >= llega ? Math.exp(-(f - llega) / 4) * Math.sin((f - llega) * 2.2) : 0;
  const caja = interpolate(f, [llega, llega + 6], [0, 1], CL);
  const camZ = 1.08 + interpolate(f, [0, dur], [0, 0.06], CL);
  const camX = interpolate(f, [0, llega + 10], [60, -40], { ...CL, easing: io });
  const pts = tramo(CABLE, t);
  const punta = pts[pts.length - 1];
  return (
    <AbsoluteFill style={{ background: "#0E0E0F", overflow: "hidden", opacity: fade(f, dur) }}>
      <AbsoluteFill style={{ transformOrigin: "980px 380px", transform: `translate(${camX + golpe * 10}px, ${golpe * 7}px) scale(${camZ})` }}>
        <Img src={staticFile(img)} style={{ ...FULL, filter: `brightness(${interpolate(f, [fIni - 6, fIni + 6], [1, 0.74], CL)})` }} />
        {t > 0 ? (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, filter: "drop-shadow(0 0 10px rgba(255,170,60,0.95)) drop-shadow(0 0 26px rgba(255,120,30,0.7))" }}>
            <Img src={staticFile(img)} style={{ ...FULL, clipPath: poly(banda(pts, 11)), filter: "brightness(3.2) sepia(1) saturate(4) hue-rotate(-12deg)" }} />
          </div>
        ) : null}
        {t > 0 && t < 1 ? (
          <div style={{ position: "absolute", left: punta[0] - 70, top: punta[1] - 70, width: 140, height: 140, borderRadius: 70, background: "radial-gradient(circle, rgba(255,236,190,0.95) 0%, rgba(255,160,60,0.55) 35%, rgba(255,120,30,0) 70%)", mixBlendMode: "screen" }} />
        ) : null}
        {caja > 0 ? (
          <>
            <Img src={staticFile(img)} style={{ ...FULL, clipPath: poly([[1478, 140], [1568, 135], [1572, 225], [1482, 228]]), filter: `brightness(${1 + 1.6 * caja}) sepia(${caja}) saturate(${1 + 3 * caja})` }} />
            <div style={{ position: "absolute", left: 1523 - 260, top: 180 - 260, width: 520, height: 520, borderRadius: 260, opacity: caja * (0.75 + 0.25 * Math.sin(f / 3)), background: "radial-gradient(circle, rgba(255,210,140,0.8) 0%, rgba(255,140,50,0.35) 30%, rgba(255,120,30,0) 65%)", mixBlendMode: "screen" }} />
          </>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 3 · TANQUE DE LUZ: el vidrio del panel está lleno de brillo y en "una esquina" se escurre hasta la mitad
const PANEL = [[562, 52], [1785, 412], [1650, 1080], [1080, 1080], [112, 567]];
export const EscTanque: React.FC<{ dur: number; img: string; fEsq: number }> = ({ dur, img, fEsq }) => {
  const f = useCurrentFrame();
  const lleno = interpolate(f, [8, 26], [0, 1], { ...CL, easing: io });
  const baja = interpolate(f, [fEsq, fEsq + 40], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const nivel = interpolate(baja, [0, 1], [0, 560]); // y de la superficie: 0 = lleno, 560 = medio panel
  const ola = (x: number) => Math.sin(x / 140 + f / 5) * 42 * Math.exp(-Math.max(0, f - fEsq) / 40) * (baja > 0 ? 1 : 0);
  const sup: number[][] = [];
  for (let x = 0; x <= 1920; x += 80) sup.push([x, nivel + ola(x)]);
  const agua = [...sup, [1920, 1080], [0, 1080]];
  const camZ = interpolate(f, [0, Math.max(30, fEsq - 6)], [1.32, 1.04], { ...CL, easing: io });
  const camO = "620px 260px";
  return (
    <AbsoluteFill style={{ background: "#0E0E0F", overflow: "hidden", opacity: fade(f, dur) }}>
      <AbsoluteFill style={{ transformOrigin: camO, transform: `scale(${camZ})` }}>
        <Img src={staticFile(img)} style={FULL} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: poly(PANEL), opacity: lleno }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: poly(agua) }}>
            <Img src={staticFile(img)} style={{ ...FULL, filter: "brightness(2.3) contrast(0.9) sepia(0.35) saturate(1.4)", mixBlendMode: "screen" }} />
            <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: "linear-gradient(180deg, rgba(255,200,110,0.55), rgba(255,170,70,0.35))", mixBlendMode: "screen" }} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
