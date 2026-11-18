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
  const fCut = S(5.9), fPar = S(7.64), fUna = S(9.0);
  if (f >= fUna) {
    const k = (f - fUna) / Math.max(1, dur - fUna);
    return (
      <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
        {veo ? <OffthreadVideo src={staticFile(veo)} muted style={{ width: 1920, height: 1080, objectFit: "cover" }} />
          : <div style={cam(1180, 470, lerp(1.08, 1.2, k))}><Img src={staticFile(r10)} style={FULL} /></div>}
      </AbsoluteFill>
    );
  }
  // caída: se inclina 8 frames, cae con gravedad, rebota una vez y queda acostada
  const t = (f - fCut - 8) / 30;
  let dy = 0, rot = 0, dx = 0;
  if (f >= fCut) rot = interpolate(f, [fCut, fCut + 8], [0, 9], CL);
  if (t > 0) {
    const g = 2600, drop = 760, tl = Math.sqrt((2 * drop) / g);
    if (t < tl) { dy = 0.5 * g * t * t; rot = lerp(9, 84, t / tl); dx = 70 * (t / tl); }
    else { const tb = t - tl, vb = 380, up = Math.max(0, vb * tb - 0.5 * g * tb * tb); dy = drop - up; rot = 84 + 6 * Math.min(1, tb / 0.3); dx = 70 + 18 * Math.min(1, tb / 0.3); }
  }
  // cámara: sube por el tallo hasta la punta, después sigue la caída
  const a = seg(f, 0, fCut - 4), b = seg(f, fCut + 4, fCut + 40);
  const cx = lerp(lerp(848, 850, a), 900, b), cy = lerp(lerp(560, 300, a), 640, b), s = lerp(lerp(1.05, 1.5, a), 1.15, b) + 0.02 * (f / dur);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#8fb3e0" }}>
      <div style={cam(cx, cy, s)}>
        <Img src={staticFile(src)} style={FULL} />
        {f >= fCut && (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: poly(TIP_PATCH) }}>
            <Img src={staticFile(src)} style={{ ...FULL, left: -110 }} />
          </div>
        )}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "848px 232px",
          transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, filter: f >= fCut ? "drop-shadow(0 8px 6px rgba(0,0,0,0.35))" : undefined }}>
          <Img src={staticFile(src)} style={{ ...FULL, clipPath: poly(TIP) }} />
        </div>
        <Rotulo x={906} y={236} w={90} t="último par" f0={fPar} />
      </div>
    </AbsoluteFill>
  );
};

// ── Escena 2 · poda: las ramas del piso arrancan paradas sobre su muñón y se acuestan girando sobre el corte hasta su lugar real
type Rama = { p: number[][]; cut: [number, number]; tip: [number, number]; stump: [number, number]; rot0: number; f0: number; patchDx: number; patchDy: number };
export const EscPoda: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  const fAc = S(6.98), fMit = S(10.38), fPar = S(12.9);
  const R: Rama[] = [
    { p: band(478, 903, 285, 668, 15, 9), cut: [478, 903], tip: [285, 668], stump: [555, 195], rot0: 8, f0: fAc, patchDx: 70, patchDy: -40 },
    { p: band(1642, 868, 1430, 650, 14, 9), cut: [1642, 868], tip: [1430, 650], stump: [1372, 202], rot0: 82, f0: fAc + 9, patchDx: -60, patchDy: 60 },
  ];
  const back = seg(f, fAc - 2, fAc + 48), push = seg(f, fPar - 8, fPar + 40);
  const cx = lerp(lerp(960, 960, back), 1150, push), cy = lerp(lerp(270, 540, back), 400, push);
  const s = lerp(lerp(1.45 + 0.05 * Math.min(1, f / fAc), 1.0, back), 1.4, push);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#55524c" }}>
      <div style={cam(cx, cy, s)}>
        <Img src={staticFile(src)} style={FULL} />
        {R.map((r, i) => {
          const k = seg(f, r.f0, r.f0 + 34);
          // mientras la rama no llegó, su lugar en el piso muestra piedra vecina
          const patch = k < 1 ? (
            <div key={"p" + i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: poly(band(r.cut[0], r.cut[1], r.tip[0], r.tip[1], 34, 9)) }}>
              <Img src={staticFile(src)} style={{ ...FULL, left: r.patchDx, top: r.patchDy }} />
            </div>) : null;
          // camino del corte: arco con gravedad del muñón al piso; giro de rot0 a 0 con un pequeño asentado
          const kk = Math.pow(k, 1.6);
          const x = lerp(r.stump[0], r.cut[0], k), y = lerp(r.stump[1], r.cut[1], kk) - Math.sin(Math.PI * k) * 40;
          const settle = f > r.f0 + 34 ? Math.exp(-(f - r.f0 - 34) / 5) * Math.sin((f - r.f0 - 34) / 2.2) * 3 : 0;
          const rot = lerp(r.rot0, 0, Math.pow(k, 0.8)) + settle;
          return (
            <React.Fragment key={i}>
              {patch}
              <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${r.cut[0]}px ${r.cut[1]}px`,
                transform: `translate(${x - r.cut[0]}px, ${y - r.cut[1]}px) rotate(${rot}deg)`, filter: k < 1 ? "drop-shadow(0 14px 10px rgba(0,0,0,0.35))" : undefined }}>
                <Img src={staticFile(src)} style={{ ...FULL, clipPath: poly(r.p) }} />
              </div>
            </React.Fragment>
          );
        })}
        <Rotulo x={1120} y={420} w={120} t="la mitad" f0={fMit} left />
      </div>
    </AbsoluteFill>
  );
};

// ── Escena 3 · prueba del dedo: la tierra del frente (bajo su línea real y≈712) sube y entierra el dedo hasta el nudillo (885,534)
const SLAB = [[0, 735], [120, 731], [240, 726], [360, 722], [480, 717], [600, 713], [720, 710], [800, 712], [880, 716], [960, 714], [1060, 710], [1160, 702], [1260, 694], [1360, 690], [1460, 692], [1560, 696], [1680, 700], [1800, 703], [1920, 706], [1920, 1080], [0, 1080]];
export const EscDedo: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  const fMet = S(2.8), fSeg = S(6.0), fCm = S(7.54);
  const a = seg(f, 0, fMet + 20), b = seg(f, fMet + 10, fSeg);
  const cx = lerp(lerp(960, 950, a), 930, b), cy = lerp(lerp(540, 560, a), 590, b), s = lerp(lerp(1.0, 1.08, a), 1.22, b) + 0.02 * (f / dur);
  const r = seg(f, fSeg, fSeg + 34);
  const up = -230 * r, sy = 1 + 0.26 * r;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#3b3a38" }}>
      <div style={cam(cx, cy, s)}>
        <Img src={staticFile(src)} style={FULL} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 712px", transform: `translateY(${up}px) scaleY(${sy})`,
          filter: r > 0 ? "drop-shadow(0 -6px 6px rgba(0,0,0,0.25))" : undefined }}>
          <Img src={staticFile(src)} style={{ ...FULL, clipPath: poly(SLAB) }} />
        </div>
        {f >= fCm - 6 && (() => { const k = spring({ frame: f - fCm + 6, fps: 30, config: { damping: 8, mass: 0.9, stiffness: 160 } }); return (
          <div style={{ position: "absolute", left: 1010, top: 330, width: 64, height: 420, transform: `translateY(${(1 - k) * -700}px) rotate(4deg)`, transformOrigin: "50% 100%" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 6, background: "linear-gradient(90deg, #d9b98a, #f0dcb4 40%, #c9a473)", boxShadow: "14px 16px 20px rgba(0,0,0,0.45), inset -4px 0 0 rgba(90,60,25,0.25)" }} />
            {Array.from({ length: 21 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 0, top: 10 + i * 19, width: i % 5 === 0 ? 34 : 18, height: 3, background: "#4a3420" }} />)}
            <div style={{ position: "absolute", left: -30, top: 196, width: 124, height: 6, background: "#B4321C", boxShadow: "0 2px 4px rgba(0,0,0,0.5)" }} />
            <div style={{ position: "absolute", left: 84, top: 160, padding: "8px 22px 12px", borderRadius: 8, backgroundColor: "#C9A36A", boxShadow: "10px 14px 18px rgba(0,0,0,0.45)", whiteSpace: "nowrap", fontFamily: FONTS.SERIF, fontSize: 64, color: "#2B2118" }}>3 cm</div>
          </div>); })()}
      </div>
    </AbsoluteFill>
  );
};
