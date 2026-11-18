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
  const cx = lerp(lerp(848, 850, a), 860, b), cy = lerp(lerp(560, 330, a), 400, b), s = lerp(lerp(1.05, 1.4, a), 1.3, b) + 0.015 * (f / dur);
  // tijera: entra desde la derecha, cierra sobre el corte y se va
  const tIn = seg(f, fCut - 16, fCut - 5), tCl = seg(f, fCut - 5, fCut), tOut = seg(f, fCut + 8, fCut + 22);
  const open = 22 * (1 - tCl), tx = lerp(700, 0, tIn) + 760 * tOut;
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
        {f >= fCut - 16 && f < fCut + 24 && (
          <div style={{ position: "absolute", left: 856, top: 236, transform: `translateX(${tx}px) rotate(-8deg)`, filter: "drop-shadow(10px 14px 8px rgba(0,0,0,0.35))" }}>
            {[1, -1].map((d) => (
              <div key={d} style={{ position: "absolute", left: 0, top: 0, transformOrigin: "60px 0", transform: `rotate(${d * open}deg)` }}>
                <div style={{ position: "absolute", left: -10, top: -7, width: 150, height: 14, borderRadius: "70% 10% 10% 70%", background: "linear-gradient(180deg, #f2f2f2, #9aa0a6 55%, #5b6066)" }} />
                <div style={{ position: "absolute", left: 140, top: -14, width: 230, height: 28, borderRadius: 14, background: "linear-gradient(180deg, #e0463a, #a3231a 60%, #6b140e)", transform: `rotate(${d * 10}deg)`, transformOrigin: "0 50%" }} />
              </div>
            ))}
            <div style={{ position: "absolute", left: 50, top: -10, width: 20, height: 20, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #fff, #777)" }} />
          </div>
        )}
        <Rotulo x={1000} y={330} w={90} t="último par" f0={fPar} />
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
  const s = lerp(lerp(1.25 + 0.15 * Math.min(1, f / fAc), 1.0, back), 1.3, push);
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
        {f >= fMit - 4 && (() => { const r = R[0]; const L = Math.hypot(r.tip[0] - r.cut[0], r.tip[1] - r.cut[1]); const ang = (Math.atan2(r.tip[1] - r.cut[1], r.tip[0] - r.cut[0]) * 180) / Math.PI;
          const k = seg(f, fMit - 4, fMit + 10); const m = seg(f, fMit + 12, fMit + 18); const land = f > fMit + 10 ? Math.exp(-(f - fMit - 10) / 5) * Math.sin((f - fMit - 10) / 1.8) * 6 : 0; return (
          <div style={{ position: "absolute", left: r.cut[0], top: r.cut[1] - 40, width: L * k, height: 54, transformOrigin: "0 40px", transform: `rotate(${ang}deg) translateY(${(1 - k) * -120 + land}px)`, overflow: "visible" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 4, background: "linear-gradient(180deg, #f5d34a, #e2b72a 60%, #b98f15)", boxShadow: "8px 14px 14px rgba(0,0,0,0.4)", overflow: "hidden" }}>
              {Array.from({ length: Math.ceil(L / 14) }).map((_, i) => <div key={i} style={{ position: "absolute", left: i * 14, top: 0, width: 2, height: i % 5 === 0 ? 24 : 12, background: "#2b2118" }} />)}
            </div>
            <div style={{ position: "absolute", left: L / 2 - 4, top: -24, width: 8, height: 102, background: "#B4321C", transform: `scaleY(${m})`, boxShadow: "0 2px 4px rgba(0,0,0,0.5)" }} />
            <div style={{ position: "absolute", left: L / 2 - 150, top: 70, width: 300, textAlign: "center", padding: "10px 0 14px", borderRadius: 8, backgroundColor: "#C9A36A", boxShadow: "10px 14px 18px rgba(0,0,0,0.45)", fontFamily: FONTS.SERIF, fontSize: 60, color: "#2B2118", opacity: m, transform: `rotate(${-ang}deg)` }}>la mitad</div>
          </div>); })()}
      </div>
    </AbsoluteFill>
  );
};

// ── Escena 3 · prueba del dedo (vuelta 3: sin capa de tierra recortada): empuje lento al dedo y en «tres centímetros» se clava una regla de madera al lado
export const EscDedo: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  const fCm = S(7.54);
  const a = seg(f, 0, dur);
  const cx = lerp(900, 880, a), cy = lerp(560, 600, a), s = lerp(1.0, 1.14, a);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#3b3a38" }}>
      <div style={cam(cx, cy, s)}>
        <Img src={staticFile(src)} style={FULL} />
        {f >= fCm - 6 && (() => { const k = spring({ frame: f - fCm + 6, fps: 30, config: { damping: 8, mass: 0.9, stiffness: 160 } }); return (
          <div style={{ position: "absolute", left: 990, top: 300, width: 96, height: 440, transform: `translateY(${(1 - k) * -700}px) rotate(3deg)`, transformOrigin: "50% 100%" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 6, background: "linear-gradient(90deg, #d9b98a, #f0dcb4 40%, #c9a473)", boxShadow: "14px 16px 20px rgba(0,0,0,0.45), inset -4px 0 0 rgba(90,60,25,0.25)" }} />
            {Array.from({ length: 19 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 0, bottom: i * 23, width: i % 5 === 0 ? 44 : 22, height: 3, background: "#4a3420" }} />)}
            <div style={{ position: "absolute", left: -40, bottom: 69, width: 176, height: 8, background: "#B4321C", boxShadow: "0 2px 4px rgba(0,0,0,0.5)" }} />
            <div style={{ position: "absolute", left: 120, bottom: 40, padding: "8px 26px 12px", borderRadius: 8, backgroundColor: "#C9A36A", boxShadow: "10px 14px 18px rgba(0,0,0,0.45)", whiteSpace: "nowrap", fontFamily: FONTS.SERIF, fontSize: 72, color: "#2B2118" }}>3 cm</div>
          </div>); })()}
      </div>
    </AbsoluteFill>
  );
};
