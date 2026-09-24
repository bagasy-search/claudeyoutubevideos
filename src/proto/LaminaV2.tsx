// LaminaV2.tsx — la página de la guía VIVA: cada tarjeta trae el clip real del ejercicio con la trayectoria
// dibujada y pegada a la cara (MediaPipe), papel con luz de ventana, profundidad 3D y cámara con motion blur.
import React from "react";
import { AbsoluteFill, Easing, Img, Loop, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { evolvePath, getLength, getPointAtLength, getTangentAtLength } from "@remotion/paths";
import { F_INTER, F_OSWALD } from "../VideoEdit/kit/premium/theme";
import f001 from "./data/face001.json";
import f008 from "./data/face008.json";
import f009 from "./data/face009.json";
import f010 from "./data/face010.json";
import f011 from "./data/face011.json";
import f012 from "./data/face012.json";
import f013 from "./data/face013.json";
import f034 from "./data/face034.json";

const C = {
  paper: "#FDFAF3", paper2: "#F3ECDD", line: "#E7DDC9", ink: "#15242A", ink2: "#51636A",
  teal: "#12B3AE", tealD: "#0B7A76", amber: "#E39B2D", amberS: "#FDF1DA", danger: "#D2453B", dangerS: "#FBE4E1",
};
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const EO = Easing.bezier(0.16, 1, 0.3, 1);
const EIO = Easing.bezier(0.65, 0, 0.35, 1);
const k = (f: number, a: number, b: number, e = EO) => interpolate(f, [a, b], [0, 1], { ...cl, easing: e });
type Pt = [number, number];
type FaceData = (number[][] | null)[];

// suavizado temporal gaussiano, salta los cuadros sin cara
const faceAt = (data: FaceData, f: number, r = 4): Pt[] | null => {
  const n = data.length; let acc: Pt[] | null = null, ws = 0;
  for (let d = -r; d <= r; d++) {
    const fr = data[Math.min(n - 1, Math.max(0, f + d))]; if (!fr) continue;
    const w = Math.exp(-(d * d) / (2 * (r / 1.6) ** 2));
    if (!acc) acc = fr.map(() => [0, 0] as Pt);
    for (let i = 0; i < fr.length; i++) { acc[i][0] += fr[i][0] * w; acc[i][1] += fr[i][1] * w; }
    ws += w;
  }
  return acc ? acc.map(([x, y]) => [x / ws, y / ws] as Pt) : null;
};
const P = (p: Pt) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
const add = (a: Pt, b: Pt, s = 1): Pt => [a[0] + b[0] * s, a[1] + b[1] * s];
const sub = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]];
const arc = (c: Pt, r: number, a0: number, a1: number, sweep: 0 | 1) => {
  const s: Pt = [c[0] + r * Math.cos(a0), c[1] + r * Math.sin(a0)], e: Pt = [c[0] + r * Math.cos(a1), c[1] + r * Math.sin(a1)];
  return `M${P(s)} A${r.toFixed(1)} ${r.toFixed(1)} 0 1 ${sweep} ${P(e)}`;
};

// flecha con cabeza que viaja + halo
const Arrow: React.FC<{ d: string; t: number; color: string; w: number; head: number }> = ({ d, t, color, w, head }) => {
  if (t <= 0.001) return null;
  const L = getLength(d), ev = evolvePath(t, d), at = Math.max(0.5, L * t);
  const p = getPointAtLength(d, at), tg = getTangentAtLength(d, at), a = Math.atan2(tg.y, tg.x);
  const h = (da: number, r: number) => `${(p.x + Math.cos(a + da) * r).toFixed(1)},${(p.y + Math.sin(a + da) * r).toFixed(1)}`;
  const tip = `${(p.x + Math.cos(a) * head * 0.6).toFixed(1)},${(p.y + Math.sin(a) * head * 0.6).toFixed(1)}`;
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={w * 3.2} strokeLinecap="round" opacity={0.22} strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} style={{ filter: "blur(6px)" }} />
      <path d={d} fill="none" stroke="#fff" strokeWidth={w * 1.9} strokeLinecap="round" opacity={0.9} strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
      <polygon points={`${tip} ${h(Math.PI * 0.78, head)} ${h(-Math.PI * 0.78, head)}`} fill={color} stroke="#fff" strokeWidth={w * 0.45} strokeLinejoin="round" opacity={Math.min(1, t * 5)} />
    </g>
  );
};

// ─── los 7 ejercicios: clip real + trayectoria calculada con los puntos de la cara ───────────
type Ex = { n: number; zona: string; como: string; dosis: string; clip: string; len: number; face: FaceData; paths: (F: Pt[]) => string[]; color?: string; dy?: number };
const H = (F: Pt[]) => Math.hypot(F[10][0] - F[152][0], F[10][1] - F[152][1]); // alto de la cara
const EX: Ex[] = [
  { n: 1, zona: "Frente", como: "Palmas abiertas hacia el cabello", dosis: "10 veces", clip: "001", len: 198, face: f001 as any,
    paths: (F) => [[105, 67], [334, 297]].map(([a, b]) => `M${P(F[a])} L${P(add(F[b], [0, -H(F) * 0.16]))}`) },
  { n: 2, zona: "Ojos", como: "Anular: círculos suaves en la sien", dosis: "10 × 5 s", clip: "008", len: 219, face: f008 as any,
    paths: (F) => { const r = H(F) * 0.07; const cL = add(F[33], sub(F[33], F[133]), 0.9), cR = add(F[263], sub(F[263], F[362]), 0.9);
      return [arc(cL, r, Math.PI * 0.6, Math.PI * 0.6 + 5.2, 1), arc(cR, r, Math.PI * 0.4, Math.PI * 0.4 - 5.2, 0)]; } },
  { n: 3, zona: "Mejillas", como: "Sonrisa cerrada, hacia las sienes", dosis: "10 × 5 s", clip: "009", len: 240, face: f009 as any,
    paths: (F) => [[205, 116, 139], [425, 345, 368]].map(([a, b, c]) => `M${P(F[a])} Q${P(F[b])} ${P(add(F[c], [0, -H(F) * 0.04]))}`) },
  { n: 4, zona: "Boca", como: "«O» larga, después sonrisa ancha", dosis: "10 × 3 s", clip: "010", len: 240, face: f010 as any,
    paths: (F) => { const w = sub(F[291], F[61]); return [`M${P(F[61])} L${P(add(add(F[61], w, -0.45), [0, -H(F) * 0.03]))}`, `M${P(F[291])} L${P(add(add(F[291], w, 0.45), [0, -H(F) * 0.03]))}`]; } },
  { n: 5, zona: "Mandíbula", como: "Nudillos del mentón a la oreja", dosis: "10 por lado", clip: "011", len: 219, face: f011 as any,
    paths: (F) => [`M${P(F[152])} Q${P(F[172])} ${P(F[132])}`, `M${P(F[152])} Q${P(F[397])} ${P(F[361])}`] },
  { n: 6, zona: "Cuello", como: "Mirar arriba, labio sobre labio", dosis: "10 × 5 s", clip: "012", len: 240, face: f012 as any, dy: 0.3,
    paths: (F) => { const h = H(F); return [-0.13, 0.13].map((dx) => `M${P(add(F[152], [dx * h, h * 0.36]))} L${P(add(F[152], [dx * h * 0.85, h * 0.08]))}`); } },
  { n: 7, zona: "Cierre", como: "Palmas de la nariz a las orejas", dosis: "3 respiraciones", clip: "013", len: 240, face: f013 as any,
    paths: (F) => [[129, 117, 234, -1], [358, 346, 454, 1]].map(([a, b, c, s]) => `M${P(F[a])} Q${P(add(F[b], [0, -H(F) * 0.03]))} ${P(add(F[c], [s * H(F) * 0.03, -H(F) * 0.02]))}`) },
];
const ERR: Ex = { n: 0, zona: "", como: "", dosis: "", clip: "034", len: 240, face: f034 as any, color: C.danger,
  paths: (F) => [205, 425].map((a) => `M${P(add(F[a], [0, -H(F) * 0.05]))} L${P(add(F[a], [0, H(F) * 0.3]))}`) };

// ventana de video recortada sobre la cara + trayectoria trackeada
const LiveShot: React.FC<{ ex: Ex; w: number; h: number; start: number; drawAt: number; loopDraw: boolean }> = ({ ex, w, h, start, drawAt, loopDraw }) => {
  const f = useCurrentFrame();
  const lf = Math.max(0, f - start) % ex.len; // cuadro dentro del clip en loop
  const F = faceAt(ex.face, lf);
  // encuadre: cara centrada y grande (mediana de todo el clip)
  const all = ex.face.filter(Boolean) as number[][][];
  const mid = all[Math.floor(all.length / 2)];
  const fh = Math.hypot(mid[10][0] - mid[152][0], mid[10][1] - mid[152][1]);
  const cx = mid.reduce((s, p) => s + p[0], 0) / mid.length, cy = mid.reduce((s, p) => s + p[1], 0) / mid.length;
  const S = Math.max(w / 1920, (h * 0.78) / fh);
  const cyO = cy + (ex.dy || 0) * fh;
  const tx = Math.min(0, Math.max(w - 1920 * S, w / 2 - cx * S)), ty = Math.min(0, Math.max(h - 1080 * S, h / 2 - cyO * S));
  const cyc = loopDraw ? ((f - drawAt) % 75) / 45 : 1;
  const t = Math.min(k(f, drawAt, drawAt + 30, EIO), Math.min(1, Math.max(0, cyc)));
  const col = ex.color || C.teal;
  const ws = 1 / S; // grosores en px de pantalla
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${tx}px, ${ty}px) scale(${S})`, transformOrigin: "0 0" }}>
        <Sequence from={start} layout="none">
          <Loop durationInFrames={ex.len} layout="none"><OffthreadVideo src={staticFile(`broll/falifting/falifting_${ex.clip}.mp4`)} muted style={{ width: 1920, height: 1080 }} /></Loop>
        </Sequence>
        {F && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {ex.paths(F).map((d, i) => <Arrow key={i} d={d} t={t} color={col} w={4.2 * ws} head={13 * ws} />)}
        </svg>}
      </div>
      {/* viñeta interna suave para que la foto se sienta impresa en el papel */}
      <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 0 1px rgba(0,0,0,.06), inset 0 -40px 50px -30px rgba(0,0,0,.18)" }} />
    </div>
  );
};

const Card: React.FC<{ ex: Ex; start: number; focus: number; dim: number }> = ({ ex, start, focus, dim }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const a = spring({ frame: f - start, fps, config: { damping: 16, stiffness: 110, mass: 0.9 } });
  if (f < start - 2) return <div style={{ width: 398, height: 372 }} />;
  return (
    <div style={{ width: 398, height: 372, position: "relative",
      transform: `perspective(1100px) rotateX(${(1 - a) * 70}deg) scale(${1 + 0.035 * focus})`, transformOrigin: "50% 100%", opacity: Math.min(1, a * 1.6) * (1 - 0.5 * dim),
      filter: dim > 0.01 ? `blur(${(2.2 * dim).toFixed(2)}px) saturate(${1 - 0.45 * dim})` : undefined }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: "linear-gradient(180deg,#FFFFFF 0%,#FBF7EE 100%)",
        border: `1.5px solid ${focus > 0.02 ? C.teal : C.line}`,
        boxShadow: `inset 0 1px 0 #fff, 0 ${3 + 26 * focus + (1 - a) * 20}px ${8 + 50 * focus}px rgba(22,37,42,${0.09 + 0.14 * focus}), 0 1px 2px rgba(22,37,42,.08)` }} />
      <div style={{ position: "absolute", left: 14, top: 14, width: 370, height: 212, borderRadius: 16, overflow: "hidden", background: "#ddd" }}>
        <LiveShot ex={ex} w={370} h={212} start={start} drawAt={start + 14} loopDraw={focus > 0.5} />
        <div style={{ position: "absolute", right: 10, top: 10, padding: "6px 12px", borderRadius: 999, background: "rgba(255,255,255,.92)", color: "#8F5708", fontFamily: F_INTER, fontWeight: 800, fontSize: 17, boxShadow: "0 4px 12px rgba(0,0,0,.15)" }}>{ex.dosis}</div>
      </div>
      <div style={{ position: "absolute", left: 22, top: 200, width: 52, height: 52, borderRadius: 16, background: `linear-gradient(145deg, ${C.teal}, ${C.tealD})`, color: "#fff", fontFamily: F_INTER, fontWeight: 900, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 18px rgba(11,122,118,.4), 0 0 0 4px #fff" }}>{ex.n}</div>
      <div style={{ position: "absolute", left: 24, right: 20, top: 266, fontFamily: F_INTER, fontWeight: 850 as any, fontSize: 34, color: C.ink, letterSpacing: -0.8 }}>{ex.zona}</div>
      <div style={{ position: "absolute", left: 24, right: 20, top: 310, fontFamily: F_INTER, fontWeight: 500, fontSize: 21, lineHeight: 1.28, color: C.ink2 }}>{ex.como}</div>
    </div>
  );
};

const ErrBox: React.FC<{ start: number; focus: number; dim: number }> = ({ start, focus, dim }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const a = spring({ frame: f - start, fps, config: { damping: 16, stiffness: 110 } });
  const stamp = spring({ frame: f - start - 22, fps, config: { damping: 9, stiffness: 160 } });
  if (f < start - 2) return <div style={{ width: 398, height: 372 }} />;
  const items = ["Tirar la piel hacia abajo", "Apretar la mandíbula", "Fruncir la frente"];
  return (
    <div style={{ width: 398, height: 372, position: "relative", transform: `perspective(1100px) rotateX(${(1 - a) * 70}deg) scale(${1 + 0.035 * focus})`, transformOrigin: "50% 100%", opacity: Math.min(1, a * 1.6) * (1 - 0.5 * dim),
      filter: dim > 0.01 ? `blur(${(2.2 * dim).toFixed(2)}px)` : undefined }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: `linear-gradient(165deg, #FFF9EC, ${C.amberS})`, border: `1.5px solid ${focus > 0.02 ? C.amber : "#EFD6A2"}`,
        boxShadow: `0 ${3 + 26 * focus}px ${8 + 50 * focus}px rgba(150,95,12,${0.1 + 0.16 * focus})` }} />
      <div style={{ position: "absolute", left: 14, top: 14, width: 370, height: 150, borderRadius: 16, overflow: "hidden" }}>
        <LiveShot ex={ERR} w={370} h={150} start={start} drawAt={start + 10} loopDraw={focus > 0.5} />
        <div style={{ position: "absolute", right: 12, top: 12, padding: "6px 14px", borderRadius: 10, background: C.danger, color: "#fff", fontFamily: F_OSWALD, fontWeight: 700, fontSize: 22, letterSpacing: 2,
          transform: `rotate(-6deg) scale(${0.4 + 0.6 * stamp})`, opacity: Math.min(1, stamp * 1.5), boxShadow: "0 6px 14px rgba(160,40,30,.35)" }}>ASÍ NO</div>
      </div>
      <div style={{ position: "absolute", left: 22, top: 178, fontFamily: F_OSWALD, fontWeight: 700, fontSize: 20, letterSpacing: 3, color: "#96590A" }}>LOS 3 ERRORES QUE LA ARRUINAN</div>
      {items.map((s, i) => {
        const x = k(f, start + 16 + i * 7, start + 30 + i * 7, EIO);
        return (
          <div key={i} style={{ position: "absolute", left: 22, top: 216 + i * 48, display: "flex", alignItems: "center", gap: 12, opacity: k(f, start + 12 + i * 7, start + 26 + i * 7) }}>
            <svg width={32} height={32} viewBox="0 0 32 32"><circle cx={16} cy={16} r={15} fill={C.dangerS} /><path d="M10 10 L22 22 M22 10 L10 22" stroke={C.danger} strokeWidth={3.4} strokeLinecap="round" strokeDasharray={34} strokeDashoffset={34 * (1 - x)} /></svg>
            <div style={{ fontFamily: F_INTER, fontWeight: 750 as any, fontSize: 24, color: C.ink, letterSpacing: -0.3 }}>{s}</div>
          </div>
        );
      })}
    </div>
  );
};

const QR: React.FC<{ t: number }> = ({ t }) => {
  const f = useCurrentFrame();
  if (t <= 0) return null;
  return (
    <div style={{ position: "absolute", right: 58, top: 282, width: 310, padding: 18, borderRadius: 26, background: "#fff", boxShadow: "0 40px 70px rgba(40,30,15,.28), 0 2px 6px rgba(22,37,42,.1)", opacity: t, transform: `translateY(${(1 - t) * 70}px) rotate(${(1 - t) * 5}deg)` }}>
      <div style={{ position: "relative", borderRadius: 12, overflow: "hidden" }}>
        <Img src={staticFile("img/falifting/qr_falifting.png")} style={{ width: 274, height: 274, display: "block" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: `${((f % 54) / 54) * 100}%`, height: 2, background: C.teal, boxShadow: `0 0 14px 4px ${C.teal}66`, opacity: 0.45 }} />
      </div>
      <div style={{ fontFamily: F_INTER, fontWeight: 800, fontSize: 23, color: C.ink, marginTop: 12, textAlign: "center" }}>Escanea con tu teléfono</div>
      <div style={{ fontFamily: F_INTER, fontWeight: 500, fontSize: 17, color: C.ink2, textAlign: "center", marginTop: 2 }}>La guía completa del Dr. Federer</div>
    </div>
  );
};

const Grain: React.FC<{ id: string; op: number; freq: number }> = ({ id, op, freq }) => (
  <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: op, mixBlendMode: "multiply", pointerEvents: "none" }}>
    <filter id={id}><feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={3} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
    <rect width="100%" height="100%" filter={`url(#${id})`} />
  </svg>
);

// T (opcional, en cuadros desde el inicio): tiempos sincronizados con la voz. Sin T = la versión de 18 s del prototipo.
export type LaminaT = { cards: number[]; err: number; w3: [number, number, number, number]; wE: [number, number, number, number]; foot: number; qr: number | null };
const T0: LaminaT = { cards: [0, 1, 2, 3, 4, 5, 6].map((i) => 44 + i * 14), err: 44 + 7 * 14 + 12, w3: [215, 258, 300, 342], wE: [312, 354, 400, 442], foot: 150, qr: 440 };
const Scene: React.FC<{ T?: LaminaT }> = ({ T = T0 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const land = spring({ frame: f - 2, fps, config: { damping: 24, stiffness: 60, mass: 1.3 } });
  // cámara: general → tarjeta 3 → errores → general → QR
  const w3 = k(f, T.w3[0], T.w3[1], EIO) * (1 - k(f, T.w3[2], T.w3[3], EIO));
  const wE = k(f, T.wE[0], T.wE[1], EIO) * (1 - k(f, T.wE[2], T.wE[3], EIO));
  const qr = T.qr == null ? 0 : k(f, T.qr, T.qr + 30);
  const PW = 1720, PH = 1000, cx = PW / 2, cy = PH / 2;
  const c3 = { x: 30 + 2 * 420 + 199, y: 164 + 186 }, ce = { x: 30 + 3 * 420 + 199, y: 556 + 186 };
  const w = Math.max(w3, wE), tgt = wE > w3 ? ce : c3, S = 1 + 1.35 * w;
  const ex_ = cx + (tgt.x - cx) * w, ey_ = cy + (tgt.y - cy) * w;
  const tiltX = 6 * (1 - land) + 5 * w3 + 4 * wE, tiltY = -3 * w3 + 4 * wE;
  const drift = Math.sin(f / 70) * 0.35;
  const sheen = k(f, 46, 110, EIO);
  const head = k(f, 20, 46);
  const foot = k(f, T.foot, T.foot + 26);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(130% 100% at 30% 20%, #F6F1E7 0%, #E6DDCC 60%, #D6CAB4 100%)", overflow: "hidden" }}>
      <Grain id="tbl" op={0.08} freq={0.7} />
      <AbsoluteFill style={{ perspective: 2400, perspectiveOrigin: "50% 42%" }}>
        <div style={{ position: "absolute", left: 100, top: 40, width: PW, height: PH, transformStyle: "preserve-3d",
          transform: `translateX(${-200 * qr}px) translateY(${(1 - land) * 300}px) rotateX(${tiltX + (1 - land) * 26}deg) rotateY(${tiltY + drift}deg) rotateZ(${(1 - land) * -6}deg) scale(${(0.84 + 0.16 * land) * (1 - 0.16 * qr)})` }}>
          <div style={{ position: "absolute", inset: 0, transform: `translate(${cx - S * ex_}px, ${cy - S * ey_}px) scale(${S})`, transformOrigin: "0 0", transformStyle: "preserve-3d" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 28, boxShadow: `0 ${14 + 60 * (1 - land)}px ${50 + 70 * (1 - land)}px rgba(50,35,15,${0.22 + 0.1 * (1 - land)}), 0 3px 6px rgba(50,35,15,.14)` }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: 28, overflow: "hidden", background: `linear-gradient(180deg, ${C.paper} 0%, ${C.paper2} 100%)` }}>
              <Grain id="pap" op={0.07} freq={1.3} />
              <div style={{ position: "absolute", left: 62, top: 38, fontFamily: F_OSWALD, fontWeight: 600, fontSize: 22, letterSpacing: 5, color: C.tealD, opacity: head }}>GUÍA DEL DR. FEDERER · PÁGINA 7</div>
              <div style={{ position: "absolute", left: 58, top: 66, fontFamily: F_INTER, fontWeight: 900, fontSize: 64, letterSpacing: -2.2, color: C.ink, opacity: head, transform: `translateY(${(1 - head) * 24}px)` }}>
                La rutina de <span style={{ color: C.tealD }}>7 minutos</span>
              </div>
              {/* barra de 7 minutos que se llena con cada tarjeta */}
              <div style={{ position: "absolute", right: 62, top: 76, width: 520, opacity: k(f, 36, 60) }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F_INTER, fontWeight: 700, fontSize: 18, color: C.ink2, marginBottom: 8 }}><span>1 minuto por zona</span><span>Todos los días</span></div>
                <div style={{ display: "flex", gap: 6 }}>
                  {EX.map((e, i) => <div key={i} style={{ flex: 1, height: 12, borderRadius: 6, background: C.line, overflow: "hidden" }}><div style={{ width: `${k(f, T.cards[i] + 10, T.cards[i] + 26) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.teal}, ${C.tealD})` }} /></div>)}
                </div>
              </div>
              <div style={{ position: "absolute", left: 62, right: 62, top: 146, height: 2, background: `linear-gradient(90deg, ${C.teal}, ${C.line} 45%, transparent)`, transform: `scaleX(${k(f, 30, 80)})`, transformOrigin: "0 0" }} />
              <div style={{ position: "absolute", left: 62, right: 62, bottom: 34, display: "flex", justifyContent: "space-between", fontFamily: F_INTER, fontSize: 24, opacity: foot * (1 - 0.6 * w) }}>
                <div style={{ fontWeight: 700, color: C.ink2 }}>Siempre <span style={{ color: C.tealD }}>hacia arriba y hacia afuera</span> · sin dolor</div>
                <div style={{ fontWeight: 800, color: C.ink }}>Plazo realista: <span style={{ color: C.tealD }}>2 a 3 meses</span></div>
              </div>
              {/* luz de ventana (persiana) que cruza el papel */}
              <div style={{ position: "absolute", inset: "-20%", background: "repeating-linear-gradient(112deg, transparent 0 110px, rgba(60,40,10,.07) 110px 150px)", filter: "blur(22px)", mixBlendMode: "multiply", transform: `translateX(${-60 + f * 0.12}px)` }} />
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 60% at 18% 8%, rgba(255,250,235,.55), transparent 60%)", mixBlendMode: "soft-light" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 38%, rgba(255,255,255,.6) 50%, transparent 62%)", transform: `translateX(${-130 + 260 * sheen}%)`, opacity: sheen > 0 && sheen < 1 ? 1 : 0, mixBlendMode: "soft-light" }} />
            </div>
            {/* tarjetas FUERA del recorte del papel para que tengan profundidad 3D real */}
            <div style={{ position: "absolute", left: 30, top: 164, display: "flex", gap: 22 }}>
              {EX.slice(0, 4).map((ex, i) => <Card key={ex.n} ex={ex} start={T.cards[i]} focus={ex.n === 3 ? w3 : 0} dim={ex.n === 3 ? wE : Math.max(w3, wE)} />)}
            </div>
            <div style={{ position: "absolute", left: 30, top: 556, display: "flex", gap: 22 }}>
              {EX.slice(4).map((ex, i) => <Card key={ex.n} ex={ex} start={T.cards[4 + i]} focus={0} dim={Math.max(w3, wE)} />)}
              <ErrBox start={T.err} focus={wE} dim={w3} />
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <QR t={qr} />
    </AbsoluteFill>
  );
};

export const LaminaV2: React.FC = () => (
  <CameraMotionBlur shutterAngle={170} samples={5}><Scene /></CameraMotionBlur>
);

export const DebugShot: React.FC = () => <AbsoluteFill style={{ background: "#fff" }}><div style={{ position: "absolute", left: 100, top: 100, width: 1480, height: 848 }}><LiveShot ex={EX[2]} w={1480} h={848} start={0} drawAt={0} loopDraw={false} /></div></AbsoluteFill>;
export const LaminaV2NB: React.FC<{ T?: LaminaT; durationInFrames?: number }> = ({ T }) => <Scene T={T} />;
