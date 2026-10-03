// EvidenceBoard — tablero de corcho "conspiración" (Johnny Harris) en 3D leve con cámara en mano.
// Fase 1: el mito (tarjetas con pin + hilo rojo). Fase 2: sello "NOT TRUE", los hilos se cortan y cuelgan.
// Fase 3: la cámara viaja al otro lado del tablero: lo que dicen los registros (fechas + hilo) + fuente.
import React, { useMemo } from "react";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, SERIF, MONO, HAND, HK, clamp, ease, easeInOut, rnd, lerp } from "../theme";

export type EvidenceBoardProps = {
  myths: string[];
  truths: { date: string; text: string }[];
  source?: string;
  photo?: string;
  split?: number;
  mythTitle?: string;
  truthTitle?: string;
  stamp?: string;
};

const BW = 3700;
const BH = 1900;

// ---------- textura de corcho generada una vez (determinista) ----------
const makeCork = (): string => {
  if (typeof document === "undefined") return "";
  const W = 1700, H = 950;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d");
  if (!g) return "";
  g.fillStyle = "#a0703f";
  g.fillRect(0, 0, W, H);
  let s = 1;
  const r = () => rnd(s++ * 0.731);
  // manchas grandes y suaves (variación de tono)
  for (let i = 0; i < 60; i++) {
    const x = r() * W, y = r() * H, rad = 80 + r() * 260;
    const gr = g.createRadialGradient(x, y, 0, x, y, rad);
    const dark = r() < 0.5;
    gr.addColorStop(0, dark ? "rgba(90,55,25,0.22)" : "rgba(205,160,105,0.2)");
    gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr;
    g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  // gránulos finos
  for (let i = 0; i < 120000; i++) {
    const x = r() * W, y = r() * H, rad = 0.5 + r() * r() * 2.0;
    const t = r();
    g.fillStyle = t < 0.4 ? `rgba(84,48,20,${0.4 + r() * 0.45})` : t < 0.8 ? `rgba(212,164,108,${0.35 + r() * 0.45})` : `rgba(48,26,10,${0.45 + r() * 0.45})`;
    g.beginPath();
    g.ellipse(x, y, rad * (0.7 + r() * 0.8), rad, r() * 3.14, 0, 6.283);
    g.fill();
  }
  // algunos gránulos oscuros más grandes, escasos
  for (let i = 0; i < 1800; i++) {
    g.fillStyle = `rgba(60,34,14,${0.35 + r() * 0.35})`;
    g.beginPath();
    g.ellipse(r() * W, r() * H, 1.5 + r() * 2.2, 1.2 + r() * 1.6, r() * 3.14, 0, 6.283);
    g.fill();
  }
  // pinchazos viejos
  for (let i = 0; i < 70; i++) {
    g.fillStyle = "rgba(25,12,5,0.75)";
    g.beginPath();
    g.arc(r() * W, r() * H, 0.9 + r() * 0.7, 0, Math.PI * 2);
    g.fill();
  }
  return c.toDataURL("image/jpeg", 0.9);
};

// ---------- geometría ----------
type Slot = { x: number; y: number; w: number; h: number; rot: number };
const MYTH_SLOTS: Slot[] = [
  { x: 300, y: 350, w: 560, h: 260, rot: -3.2 },
  { x: 990, y: 300, w: 560, h: 260, rot: 2.6 },
  { x: 640, y: 740, w: 580, h: 260, rot: -1.4 },
  { x: 1300, y: 760, w: 520, h: 250, rot: 3.4 },
  { x: 180, y: 800, w: 460, h: 250, rot: -2.4 },
];
const TRUTH_SLOTS: Slot[] = [
  { x: 1960, y: 350, w: 580, h: 260, rot: -2.0 },
  { x: 2640, y: 300, w: 600, h: 260, rot: 1.6 },
  { x: 2000, y: 760, w: 600, h: 260, rot: 1.3 },
  { x: 2720, y: 740, w: 480, h: 300, rot: -3.0 },
  { x: 2380, y: 1150, w: 560, h: 250, rot: 2.0 },
];
const PHOTO = { x: 3290, y: 420, w: 280, h: 330 };
const bounds = (sl: Slot[], extra: { x0: number; y0: number; x1: number; y1: number }) => {
  let x0 = extra.x0, y0 = extra.y0, x1 = extra.x1, y1 = extra.y1;
  sl.forEach((s) => { x0 = Math.min(x0, s.x); y0 = Math.min(y0, s.y); x1 = Math.max(x1, s.x + s.w); y1 = Math.max(y1, s.y + s.h); });
  const w = x1 - x0, h = y1 - y0;
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, sc: clamp(Math.min((1920 * 0.9) / w, (1080 * 0.9) / h), 0.6, 1.45) };
};
const pinOf = (s: Slot) => ({ x: s.x + s.w / 2 + Math.sin((s.rot * Math.PI) / 180) * 0, y: s.y + 26 });

// ---------- piezas ----------
const Grain: React.FC<{ f: number; o?: number }> = ({ f, o = 0.22 }) => (
  <Img src={staticFile(`yc/grain/g${f % 8}.png`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "overlay", opacity: o, pointerEvents: "none" }} />
);

const Pin: React.FC<{ x: number; y: number; p: number; color?: string }> = ({ x, y, p, color = HK.red }) => {
  // p: 0 → cayendo desde arriba, 1 → clavado
  const lift = Math.max(0, 1 - p) * 90;
  return (
    <div style={{ position: "absolute", left: x - 22, top: y - 22, width: 44, height: 44, transform: `translateZ(${14 + lift}px)`, opacity: clamp(p * 4) }}>
      {/* sombra del pin sobre el papel */}
      <div style={{ position: "absolute", left: 14 + lift * 0.35, top: 20 + lift * 0.5, width: 30, height: 18, borderRadius: "50%", background: "rgba(0,0,0,0.45)", filter: "blur(3px)", transform: `translateZ(${-14 - lift}px)` }} />
      <svg width={44} height={44} viewBox="0 0 44 44" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id={`pg${color}`} cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#fff" stopOpacity={0.9} />
            <stop offset="0.18" stopColor={color} />
            <stop offset="1" stopColor="#3a0508" />
          </radialGradient>
        </defs>
        <circle cx={22} cy={22} r={15} fill={`url(#pg${color})`} />
        <ellipse cx={17} cy={16} rx={5} ry={3} fill="#fff" opacity={0.55} />
      </svg>
    </div>
  );
};

const Card: React.FC<{ s: Slot; t0: number; f: number; fps: number; children: React.ReactNode; paper?: string; lined?: boolean; dim?: number; pinColor?: string }> = ({ s, t0, f, fps, children, paper = "#f4eee0", lined = true, dim = 0, pinColor }) => {
  if (f < t0 - 1) return null;
  const sp = spring({ frame: f - t0, fps, config: { damping: 11, stiffness: 170, mass: 0.7 } });
  const z = Math.max(0, 1 - sp) * 260;
  const squash = 1 + Math.min(0, 1 - sp) * 0.25; // rebote: se aplasta contra el corcho en vez de atravesarlo
  const pinP = spring({ frame: f - t0 - 5, fps, config: { damping: 9, stiffness: 260, mass: 0.5 } });
  const wob = (1 - clamp((f - t0) / 14)) * Math.sin((f - t0) * 1.3) * 2.2;
  const lift = 6 + z;
  return (
    <>
      {/* sombra proyectada sobre el corcho */}
      <div style={{ position: "absolute", left: s.x, top: s.y, width: s.w, height: s.h, transform: `translate(${10 + lift * 0.18}px, ${16 + lift * 0.28}px) rotate(${s.rot}deg)`, background: "rgba(10,5,0,0.55)", filter: `blur(${8 + lift * 0.06}px)`, opacity: clamp(sp * 1.4) * 0.9, borderRadius: 4 }} />
      <div style={{ position: "absolute", left: s.x, top: s.y, width: s.w, height: s.h, transform: `translateZ(${z + 2}px) rotate(${s.rot + wob}deg) scale(${squash})`, opacity: clamp(sp * 2.5), transformOrigin: "50% 8%" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(172deg, ${paper} 0%, ${paper} 55%, rgba(0,0,0,0.05) 100%), ${paper}`, borderRadius: 3, overflow: "hidden", boxShadow: "inset 0 0 40px rgba(120,90,40,0.18)" }}>
          {lined && (
            <>
              {Array.from({ length: Math.floor((s.h - 70) / 38) }).map((_, i) => (
                <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 88 + i * 38, height: 2, background: "rgba(90,130,190,0.28)" }} />
              ))}
              <div style={{ position: "absolute", left: 0, right: 0, top: 70, height: 2, background: "rgba(215,38,61,0.45)" }} />
            </>
          )}
          {/* luz rasante + fibra */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 20% 0%, rgba(255,255,255,0.35), rgba(255,255,255,0) 55%), linear-gradient(90deg, rgba(0,0,0,0.04), rgba(0,0,0,0) 10%, rgba(0,0,0,0) 90%, rgba(0,0,0,0.06))" }} />
          <div style={{ position: "absolute", inset: 0 }}>{children}</div>
          <div style={{ position: "absolute", inset: 0, background: "#1a120a", opacity: dim * 0.42, mixBlendMode: "multiply" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translateZ(${z}px)`, transformStyle: "preserve-3d" }}>
        <Pin x={s.x + s.w / 2} y={s.y + 26} p={pinP} color={pinColor} />
      </div>
    </>
  );
};

const Tape: React.FC<{ x: number; y: number; rot: number; text: string; p: number; w?: number }> = ({ x, y, rot, text, p, w = 900 }) => {
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateZ(4px) rotate(${rot}deg)`, transformOrigin: "0 50%" }}>
      <div style={{ position: "absolute", left: 8, top: 14, width: w * p, height: 86, background: "rgba(0,0,0,0.35)", filter: "blur(6px)" }} />
      <div style={{ position: "relative", width: w * p, height: 86, overflow: "hidden", background: "linear-gradient(180deg, #efe4c4, #e2d4ad)", clipPath: "polygon(0 4%, 2% 0, 4% 6%, 6% 0, 100% 2%, 99% 22%, 100% 48%, 99% 76%, 100% 100%, 3% 97%, 1% 100%, 0 70%, 1% 40%)", opacity: 0.96 }}>
        <div style={{ position: "absolute", left: 34, top: 0, height: 86, display: "flex", alignItems: "center", whiteSpace: "nowrap", fontFamily: SANS, fontWeight: 700, fontSize: 46, letterSpacing: 7, color: HK.ink }}>{text}</div>
      </div>
    </div>
  );
};

// hilo con catenaria; t = progreso de dibujo
const sagPath = (a: { x: number; y: number }, b: { x: number; y: number }, sag: number) => {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 + sag;
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
};

export const EvidenceBoard: React.FC<EvidenceBoardProps> = ({
  myths = [], truths = [], source, photo, split = 0.45,
  mythTitle = "THE STORY EVERYONE TELLS", truthTitle = "WHAT THE RECORDS SAY", stamp = "NOT TRUE",
}) => {
  const f = useCurrentFrame();
  const { durationInFrames: D, fps } = useVideoConfig();
  const cork = useMemo(makeCork, []);

  const M = myths.slice(0, MYTH_SLOTS.length);
  const T = truths.slice(0, TRUTH_SLOTS.length);
  const splitF = D * clamp(split, 0.2, 0.8);

  // ---- agenda ----
  const mythStart = D * 0.05, mythEnd = splitF - D * 0.17;
  const mythT = M.map((_, i) => (M.length <= 1 ? mythStart : lerp(mythStart, mythEnd, i / (M.length - 1))));
  const stampF = splitF - D * 0.09;
  const snapF = stampF + 5;
  const panA = splitF - D * 0.03, panB = splitF + D * 0.1;
  const truthStart = splitF + D * 0.07, truthEnd = D * 0.8;
  const truthT = T.map((_, i) => (T.length <= 1 ? truthStart : lerp(truthStart, truthEnd, i / (T.length - 1))));
  const exitP = clamp((f - (D - 12)) / 12);

  // ---- cámara ----
  const MB = bounds(MYTH_SLOTS.slice(0, Math.max(1, M.length)), { x0: 250, y0: 150, x1: 1150, y1: 240 });
  const TB = bounds(TRUTH_SLOTS.slice(0, Math.max(1, T.length)), photo ? { x0: 1900, y0: 150, x1: PHOTO.x + PHOTO.w, y1: PHOTO.y + PHOTO.h } : { x0: 1900, y0: 150, x1: 2700, y1: 240 });
  const mythC = MB, truthC = TB;
  const pan = easeInOut((f - panA) / (panB - panA));
  const pullOut = Math.sin(Math.PI * clamp((f - panA) / (panB - panA))); // se aleja en medio del paneo
  const phase1 = clamp(f / Math.max(1, panA));
  const phase3 = clamp((f - panB) / Math.max(1, D - panB));
  let cx = lerp(mythC.x - 50 + 90 * phase1, truthC.x - 40 + 70 * phase3, pan);
  let cy = lerp(mythC.y + 20 - 30 * phase1, truthC.y + 10 - 20 * phase3, pan);
  let sc = lerp(MB.sc * lerp(1.1, 1.0, ease(phase1)), TB.sc * lerp(0.97, 1.06, phase3), pan) - pullOut * 0.25 - exitP * 0.06;
  // mano
  cx += 16 * Math.sin(f / 37) + 7 * Math.sin(f / 13.7 + 1);
  cy += 11 * Math.sin(f / 29 + 2) + 5 * Math.sin(f / 11.3);
  // sacudón del sello
  const shake = f >= stampF ? Math.exp(-(f - stampF) / 4) * (f - stampF < 14 ? 1 : 0) : 0;
  cx += shake * 18 * Math.sin(f * 3.1);
  cy += shake * 14 * Math.cos(f * 2.7);
  const rx = 9 + 2 * Math.sin(f / 47) - pullOut * 3;
  const ry = -6 + lerp(0, 9, pan) + 1.5 * Math.sin(f / 53);
  const rz = 0.5 * Math.sin(f / 41) - 0.6;

  // ---- hilos ----
  const mythPins = M.map((_, i) => pinOf(MYTH_SLOTS[i]));
  const truthPins = T.map((_, i) => pinOf(TRUTH_SLOTS[i]));
  const stampP = f >= stampF ? spring({ frame: f - stampF, fps, config: { damping: 14, stiffness: 320, mass: 0.6 } }) : 0;
  const mythDim = clamp((f - stampF) / 8);

  const strings: React.ReactNode[] = [];
  const drawString = (a: { x: number; y: number }, b: { x: number; y: number }, t0: number, key: string, snapAt: number | null, color = "#b3141f") => {
    const prog = ease((f - t0) / 16);
    if (prog <= 0) return;
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    const sag = d * 0.08;
    if (snapAt !== null && f >= snapAt) {
      // cortado: dos mitades que caen y cuelgan de su pin con un rebote
      const k = f - snapAt;
      const fall = 1 - Math.exp(-k / 7) * Math.cos(k * 0.45);
      const half = d / 2;
      [[a, b], [b, a]].forEach(([p, q], j) => {
        const mid = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 + sag * 0.7 };
        const hang = { x: p.x + (q.x > p.x ? 1 : -1) * half * 0.62, y: p.y + half * 0.95 };
        const e = { x: lerp(mid.x, hang.x, fall), y: lerp(mid.y, hang.y, fall) };
        const c = { x: lerp((p.x + mid.x) / 2, p.x + (e.x - p.x) * 0.15, fall), y: lerp((p.y + mid.y) / 2 + sag * 0.4, p.y + (e.y - p.y) * 0.55, fall) };
        const path = `M ${p.x} ${p.y} Q ${c.x} ${c.y} ${e.x} ${e.y}`;
        strings.push(
          <g key={`${key}${j}`} opacity={1 - 0.45 * clamp(k / 20)}>
            <path d={path} transform="translate(9,16)" stroke="rgba(0,0,0,0.35)" strokeWidth={5} fill="none" />
            <path d={path} stroke={color} strokeWidth={4.5} fill="none" strokeLinecap="round" />
          </g>,
        );
      });
      return;
    }
    const path = sagPath(a, b, sag);
    strings.push(
      <g key={key}>
        <path d={path} transform="translate(9,16)" stroke="rgba(0,0,0,0.38)" strokeWidth={5} fill="none" pathLength={1} strokeDasharray={`${prog} 1`} />
        <path d={path} stroke={color} strokeWidth={4.5} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${prog} 1`} />
        <path d={path} stroke="rgba(255,255,255,0.25)" strokeWidth={1.2} fill="none" pathLength={1} strokeDasharray={`${prog} 1`} transform="translate(-1,-1.5)" />
      </g>,
    );
  };
  for (let i = 1; i < mythPins.length; i++) drawString(mythPins[i - 1], mythPins[i], mythT[i] + 7, `m${i}`, snapF);
  if (mythPins.length > 2) drawString(mythPins[mythPins.length - 1], mythPins[0], mythT[mythPins.length - 1] + 12, "mc", snapF);
  for (let i = 1; i < truthPins.length; i++) drawString(truthPins[i - 1], truthPins[i], truthT[i] + 7, `t${i}`, null, i === truthPins.length - 1 ? "#c8761a" : "#b3141f");

  const photoT = truthStart - D * 0.02;
  const photoSp = f >= photoT ? spring({ frame: f - photoT, fps, config: { damping: 12, stiffness: 150 } }) : 0;
  const srcP = ease((f - truthT[0] - 6) / 14);

  return (
    <AbsoluteFill style={{ background: "#0a0806", overflow: "hidden", opacity: 1 - exitP }}>
      {/* pared */}
      <AbsoluteFill style={{ background: "radial-gradient(80% 70% at 50% 45%, #2a1d12 0%, #0d0906 70%, #050403 100%)" }} />
      <AbsoluteFill style={{ perspective: 2100, perspectiveOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: 960, top: 540, width: 0, height: 0, transformStyle: "preserve-3d", transform: `scale(${sc}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) translate(${-cx}px, ${-cy}px)` }}>
          {/* marco de madera + sombra */}
          <div style={{ position: "absolute", left: -60, top: -60, width: BW + 120, height: BH + 120, background: "linear-gradient(135deg, #3b2412, #1f1309 60%, #2b1a0c)", boxShadow: "0 40px 120px rgba(0,0,0,0.8)", borderRadius: 6 }} />
          <div style={{ position: "absolute", left: 0, top: 0, width: BW, height: BH, transformStyle: "preserve-3d", backgroundImage: cork ? `url(${cork})` : undefined, backgroundColor: "#9b6a3c", backgroundSize: `${BW}px ${BH}px`, boxShadow: "inset 0 0 60px rgba(0,0,0,0.7), inset 0 8px 18px rgba(0,0,0,0.6)" }}>
            {/* pool de luz cálida que sigue a la cámara */}
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(1300px 900px at ${cx}px ${cy - 80}px, rgba(255,220,160,0.28), rgba(0,0,0,0) 60%), radial-gradient(2400px 1500px at ${cx}px ${cy}px, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)` }} />

            <Tape x={250} y={150} rot={-1.8} text={mythTitle} p={ease((f - D * 0.015) / 12)} w={880} />
            <Tape x={1900} y={150} rot={1.2} text={truthTitle} p={ease((f - (panB - D * 0.04)) / 12)} w={800} />

            {/* foto polaroid */}
            {photo && photoSp > 0 && (
              <>
                <div style={{ position: "absolute", left: PHOTO.x, top: PHOTO.y, width: PHOTO.w, height: PHOTO.h, transform: `translate(${14 + (1 - photoSp) * 30}px, ${22 + (1 - photoSp) * 50}px) rotate(6deg)`, background: "rgba(0,0,0,0.5)", filter: "blur(9px)", opacity: photoSp }} />
                <div style={{ position: "absolute", left: PHOTO.x, top: PHOTO.y, width: PHOTO.w, height: PHOTO.h, transform: `translateZ(${Math.max(0, 1 - photoSp) * 200 + 3}px) rotate(${6 + (1 - photoSp) * 8}deg)`, background: "#f3f0e8", padding: "18px 18px 62px", boxSizing: "border-box", opacity: clamp(photoSp * 3) }}>
                  <Img src={staticFile(photo)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.1) sepia(0.25)" }} />
                  <div style={{ position: "absolute", left: 18, bottom: 14, fontFamily: MONO, fontSize: 15, color: "#8a8272", letterSpacing: 1 }}>ILLUSTRATION</div>
                </div>
                <div style={{ position: "absolute", left: 0, top: 0, transform: `translateZ(${Math.max(0, 1 - photoSp) * 200}px)` }}>
                  <Pin x={PHOTO.x + PHOTO.w / 2} y={PHOTO.y + 26} p={photoSp} color="#2f6fb0" />
                </div>
              </>
            )}

            {/* hilos debajo de las tarjetas (salen de los pines) */}
            <svg width={BW} height={BH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", transform: "translateZ(1px)" }}>{strings}</svg>

            {/* mitos */}
            {M.map((txt, i) => {
              const s = MYTH_SLOTS[i];
              const strikeP = ease((f - stampF - 3 - i * 3) / 9);
              return (
                <Card key={`m${i}`} s={s} t0={mythT[i]} f={f} fps={fps} dim={mythDim}>
                  <div style={{ position: "absolute", left: 36, top: 22, fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 5, color: HK.red }}>CLAIM {String(i + 1).padStart(2, "0")}</div>
                  <div style={{ position: "absolute", left: 36, right: 36, top: 84, bottom: 26, display: "flex", alignItems: "center", fontFamily: SERIF, fontSize: txt.length > 30 ? 46 : 54, lineHeight: 1.12, color: HK.ink }}>{txt}</div>
                  {strikeP > 0 && (
                    <svg width={s.w} height={s.h} style={{ position: "absolute", inset: 0 }}>
                      <path d={`M 26 ${s.h * 0.62} C ${s.w * 0.3} ${s.h * 0.55}, ${s.w * 0.6} ${s.h * 0.6}, ${s.w - 24} ${s.h * 0.5}`} stroke={HK.red} strokeWidth={9} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${strikeP} 1`} opacity={0.9} style={{ mixBlendMode: "multiply" }} />
                    </svg>
                  )}
                </Card>
              );
            })}

            {/* verdades */}
            {T.map((tr, i) => {
              const s = TRUTH_SLOTS[i];
              const last = i === T.length - 1 && T.length > 1;
              const sticky = last && !tr.date;
              return (
                <Card key={`t${i}`} s={s} t0={truthT[i]} f={f} fps={fps} paper={sticky ? "#f7d85a" : last ? "#fbf4e3" : "#f6f1e6"} lined={!sticky} pinColor={last ? "#e0721c" : HK.red}>
                  {sticky ? (
                    <div style={{ position: "absolute", inset: "54px 34px 20px", display: "flex", alignItems: "center", fontFamily: HAND, fontWeight: 700, fontSize: 70, lineHeight: 0.98, color: "#1b1406", transform: "rotate(-2deg)" }}>{tr.text}</div>
                  ) : (
                    <>
                      <div style={{ position: "absolute", left: 34, top: 18, display: "inline-block", padding: "4px 12px", background: HK.ink, color: HK.bone, fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 1 }}>{tr.date || `№ ${i + 1}`}</div>
                      <div style={{ position: "absolute", left: 34, right: 30, top: 88, bottom: 22, display: "flex", alignItems: "center", fontFamily: MONO, fontWeight: 700, fontSize: tr.text.length > 48 ? 36 : 41, lineHeight: 1.22, color: "#1d1a15" }}>{tr.text}</div>
                    </>
                  )}
                </Card>
              );
            })}

            {/* sello */}
            {stampP > 0 && (
              <div style={{ position: "absolute", left: MB.x, top: MB.y + 40, transform: `translate(-50%, -50%) translateZ(${30 + Math.max(0, 1 - stampP) * 500}px) rotate(-11deg) scale(${1 + (1 - stampP) * 0.6})`, opacity: clamp(stampP * 3) * (1 - 0.35 * clamp((f - panB) / 20)), mixBlendMode: "multiply" }}>
                <div style={{ position: "relative", border: `14px solid ${HK.red}`, borderRadius: 18, padding: "10px 60px 0", fontFamily: SANS, fontWeight: 700, fontSize: 230, letterSpacing: 16, lineHeight: 1.05, color: HK.red, whiteSpace: "nowrap", boxShadow: `inset 0 0 0 6px rgba(255,255,255,0.0)` }}>
                  {stamp}
                  {/* huecos de tinta */}
                  {Array.from({ length: 140 }).map((_, k) => (
                    <div key={k} style={{ position: "absolute", left: `${rnd(k * 3.1) * 100}%`, top: `${rnd(k * 7.7 + 2) * 100}%`, width: 3 + rnd(k) * 12, height: 2 + rnd(k + 9) * 7, borderRadius: "50%", background: "#c9a071", opacity: 0.85, transform: `rotate(${rnd(k + 4) * 180}deg)` }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </AbsoluteFill>

      {/* viñeta + grano */}
      <AbsoluteFill style={{ background: "radial-gradient(120% 95% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.72) 100%)", pointerEvents: "none" }} />
      <Grain f={f} />

      {/* fuente */}
      {source && srcP > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 150, opacity: srcP, background: "linear-gradient(0deg, rgba(0,0,0,0), rgba(0,0,0,0.7))" }} />
      )}
      {source && srcP > 0 && (
        <div style={{ position: "absolute", right: 60, top: 40, opacity: srcP, transform: `translateY(${(1 - srcP) * 14}px)`, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 4, height: 30, background: HK.orange }} />
          <div style={{ fontFamily: MONO, fontSize: 21, color: "rgba(241,235,221,0.88)", letterSpacing: 0.5, textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>{source}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
