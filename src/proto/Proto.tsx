// Proto.tsx — 3 prototipos "puro código" para Federer (lámina viva, gravedad sobre la cara, flechas trackeadas).
import React from "react";
import { AbsoluteFill, Easing, Img, Loop, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { evolvePath, getLength, getPointAtLength, getTangentAtLength } from "@remotion/paths";
import { F_INTER, F_OSWALD } from "../VideoEdit/kit/premium/theme";
import face012 from "./data/face012.json";
import face013 from "./data/face013.json";
import tess from "./data/tess.json";

// ─── paleta y utilidades ───────────────────────────────────────────────────────────────
const C = {
  paper: "#FCF9F2", paper2: "#F4EDDF", line: "#E6DCC8", ink: "#16252A", ink2: "#51636A",
  teal: "#12B3AE", tealD: "#0B7A76", tealL: "#DDF4F2", amber: "#E39B2D", amberS: "#FDF1DA", danger: "#C8433A", dangerS: "#FBE4E1",
};
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const EO = Easing.bezier(0.16, 1, 0.3, 1); // expo-out suave
const EIO = Easing.bezier(0.65, 0, 0.35, 1);
const k = (f: number, a: number, b: number, e = EO) => interpolate(f, [a, b], [0, 1], { ...cl, easing: e });
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// grano de papel/tela, sutil (SVG turbulence — vectorial, sin assets)
const Grain: React.FC<{ id: string; op?: number; freq?: number }> = ({ id, op = 0.05, freq = 0.9 }) => (
  <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: op, mixBlendMode: "multiply", pointerEvents: "none" }}>
    <filter id={id}><feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={3} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
    <rect width="100%" height="100%" filter={`url(#${id})`} />
  </svg>
);

// flecha que se dibuja con cabeza que viaja en la punta
const DrawArrow: React.FC<{ d: string; t: number; color: string; w?: number; head?: number; glow?: boolean }> = ({ d, t, color, w = 3, head = 9, glow }) => {
  if (t <= 0.001) return null;
  const L = getLength(d);
  const ev = evolvePath(t, d);
  const at = Math.max(0.5, L * t);
  const p = getPointAtLength(d, at);
  const tg = getTangentAtLength(d, at);
  const ang = Math.atan2(tg.y, tg.x);
  const hx = (a: number, r: number) => `${(p.x + Math.cos(ang + a) * r).toFixed(2)},${(p.y + Math.sin(ang + a) * r).toFixed(2)}`;
  const tip = `${(p.x + Math.cos(ang) * head * 0.55).toFixed(2)},${(p.y + Math.sin(ang) * head * 0.55).toFixed(2)}`;
  return (
    <g style={glow ? { filter: `drop-shadow(0 0 6px ${color})` } : undefined}>
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
      <polygon points={`${tip} ${hx(Math.PI * 0.8, head)} ${hx(-Math.PI * 0.8, head)}`} fill={color} opacity={Math.min(1, t * 4)} />
    </g>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════════
// A) LÁMINA VIVA — la página de la guía armada en código (0 typos), cámara que la recorre
// ═══════════════════════════════════════════════════════════════════════════════════════
type Ex = { n: number; zona: string; como: string; dosis: string; arrows: string[]; extra?: "o" };
const EX: Ex[] = [
  { n: 1, zona: "Frente", como: "Palmas abiertas hacia el cabello", dosis: "10 veces", arrows: ["M46 44 L46 16", "M74 44 L74 16"] },
  { n: 2, zona: "Ojos", como: "Anular: círculos suaves en la sien", dosis: "10 × 5 s", arrows: ["M24 66 C18 60 20 50 28 49 C34 49 36 55 32 58", "M96 66 C102 60 100 50 92 49 C86 49 84 55 88 58"] },
  { n: 3, zona: "Mejillas", como: "Sonrisa cerrada, hacia las sienes", dosis: "10 × 5 s", arrows: ["M44 84 C36 76 30 66 26 52", "M76 84 C84 76 90 66 94 52"] },
  { n: 4, zona: "Boca", como: "«O» larga, después sonrisa ancha", dosis: "10 × 3 s", arrows: ["M47 94 L32 88", "M73 94 L88 88"], extra: "o" },
  { n: 5, zona: "Mandíbula", como: "Nudillos del mentón a la oreja", dosis: "10 por lado", arrows: ["M56 116 C42 112 30 102 22 84", "M64 116 C78 112 90 102 98 84"] },
  { n: 6, zona: "Cuello", como: "Mirar arriba, labio sobre labio", dosis: "10 × 5 s", arrows: ["M49 140 L51 120", "M71 140 L69 120"] },
  { n: 7, zona: "Cierre", como: "Palmas de la nariz a las orejas", dosis: "3 respiraciones", arrows: ["M53 78 C42 74 32 70 20 70", "M67 78 C78 74 88 70 100 70"] },
];

const FaceIcon: React.FC<{ ex: Ex; t: number; hot: number }> = ({ ex, t, hot }) => {
  const f = useCurrentFrame();
  const ink = "#2B3B40";
  return (
    <svg viewBox="0 0 120 146" width={176} height={214} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`fg${ex.n}`} cx="50%" cy="42%" r="60%"><stop offset="0%" stopColor="#FFFFFF" /><stop offset="100%" stopColor="#EEF7F6" /></radialGradient>
      </defs>
      {/* cuello y hombros */}
      <path d="M46 114 L44 140 M74 114 L76 140" stroke={ink} strokeWidth={2} strokeLinecap="round" opacity={0.55} />
      {/* cabeza */}
      <path d="M60 14 C86 14 100 34 100 62 C100 92 84 118 60 118 C36 118 20 92 20 62 C20 34 34 14 60 14 Z" fill={`url(#fg${ex.n})`} stroke={ink} strokeWidth={2.2} />
      <path d="M24 46 C30 26 46 18 60 18 C76 18 92 26 96 46 C88 36 76 32 60 34 C44 32 32 36 24 46 Z" fill="#C9CFD0" opacity={0.75} />
      {/* rasgos */}
      <path d="M40 56 Q46 52 52 56 M68 56 Q74 52 80 56" stroke={ink} strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.8} />
      <path d="M41 63 Q46 66 51 63 M69 63 Q74 66 79 63" stroke={ink} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.7} />
      <path d="M60 64 L57 80 Q60 82 63 80" stroke={ink} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.6} />
      {ex.extra === "o"
        ? <ellipse cx={60} cy={95} rx={4 + 2 * Math.sin(f / 7)} ry={5 + 2 * Math.sin(f / 7)} fill="none" stroke={ink} strokeWidth={1.8} opacity={0.8} />
        : <path d="M50 94 Q60 100 70 94" stroke={ink} strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.8} />}
      {/* halo de la zona */}
      <g opacity={0.25 + 0.35 * hot}>{ex.arrows.map((d, i) => <path key={i} d={d} stroke={C.teal} strokeWidth={12} strokeLinecap="round" fill="none" opacity={0.18 * t} />)}</g>
      {ex.arrows.map((d, i) => <DrawArrow key={i} d={d} t={t} color={C.tealD} w={3.2} head={7} />)}
    </svg>
  );
};

const Card: React.FC<{ ex: Ex; start: number; focus: number; dim: number }> = ({ ex, start, focus, dim }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f - start, fps, config: { damping: 18, stiffness: 120, mass: 0.9 } });
  const draw = k(f, start + 8, start + 34, EIO);
  const redraw = focus > 0.5 ? ((f % 60) / 60) : 1; // en foco la flecha se repite
  return (
    <div style={{
      width: 398, height: 360, borderRadius: 24, background: "linear-gradient(180deg,#FFFFFF 0%,#FBF8F1 100%)",
      border: `1.5px solid ${focus > 0.01 ? C.teal : C.line}`, position: "relative", overflow: "hidden",
      boxShadow: `0 1px 0 rgba(255,255,255,.9) inset, 0 ${2 + 18 * focus}px ${6 + 40 * focus}px rgba(22,37,42,${0.08 + 0.12 * focus}), 0 1px 2px rgba(22,37,42,.08)`,
      opacity: a * (1 - 0.55 * dim), transform: `translateY(${(1 - a) * 40}px) scale(${0.96 + 0.04 * a + 0.03 * focus})`,
      filter: dim > 0.01 ? `blur(${(1.6 * dim).toFixed(2)}px) saturate(${1 - 0.5 * dim})` : undefined,
    }}>
      <div style={{ position: "absolute", left: 20, top: 18, width: 46, height: 46, borderRadius: 14, background: `linear-gradient(145deg, ${C.teal}, ${C.tealD})`, color: "#fff", fontFamily: F_INTER, fontWeight: 800, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 14px rgba(11,122,118,.35)" }}>{ex.n}</div>
      <div style={{ position: "absolute", right: 16, top: 22, padding: "6px 12px", borderRadius: 999, background: C.amberS, color: "#9A5F0C", fontFamily: F_INTER, fontWeight: 700, fontSize: 17, letterSpacing: 0.2 }}>{ex.dosis}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 44, display: "flex", justifyContent: "center" }}>
        <FaceIcon ex={ex} t={Math.min(draw, focus > 0.5 ? redraw : 1)} hot={focus} />
      </div>
      <div style={{ position: "absolute", left: 22, right: 22, top: 252, fontFamily: F_INTER, fontWeight: 800, fontSize: 34, color: C.ink, letterSpacing: -0.6 }}>{ex.zona}</div>
      <div style={{ position: "absolute", left: 22, right: 22, top: 296, fontFamily: F_INTER, fontWeight: 500, fontSize: 21, lineHeight: 1.3, color: C.ink2 }}>{ex.como}</div>
    </div>
  );
};

const QR: React.FC<{ t: number }> = ({ t }) => {
  const f = useCurrentFrame();
  if (t <= 0) return null;
  const scan = ((f % 50) / 50) * 100;
  return (
    <div style={{ position: "absolute", right: 60, top: 300, width: 300, padding: 18, borderRadius: 24, background: "#fff", boxShadow: "0 30px 60px rgba(22,37,42,.25), 0 2px 6px rgba(22,37,42,.1)", opacity: t, transform: `translateY(${(1 - t) * 60}px) rotate(${(1 - t) * 4}deg)` }}>
      <div style={{ position: "relative", borderRadius: 12, overflow: "hidden" }}>
        <Img src={staticFile("img/falifting/qr_falifting.png")} style={{ width: 264, height: 264, display: "block" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: `${scan}%`, height: 3, background: C.teal, boxShadow: `0 0 18px 6px ${C.teal}88`, opacity: 0.8 }} />
      </div>
      <div style={{ fontFamily: F_INTER, fontWeight: 800, fontSize: 22, color: C.ink, marginTop: 12, textAlign: "center" }}>Escanea con tu teléfono</div>
      <div style={{ fontFamily: F_INTER, fontWeight: 500, fontSize: 17, color: C.ink2, textAlign: "center", marginTop: 2 }}>La guía completa del Dr. Federer</div>
    </div>
  );
};

export const LaminaViva: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // entrada de la página en perspectiva
  const land = spring({ frame: f - 2, fps, config: { damping: 22, stiffness: 70, mass: 1.2 } });
  const CARD0 = 46, STEP = 13;
  // cámara: plano general → card 3 → recuadro de errores → general (T = centro − S·objetivo)
  const w3 = k(f, 205, 245, EIO) * (1 - k(f, 290, 330, EIO));
  const wE = k(f, 300, 340, EIO) * (1 - k(f, 385, 425, EIO));
  const PW = 1720, PH = 1000, cx = PW / 2, cy = PH / 2;
  const c3 = { x: 30 + 2 * 420 + 199, y: 162 + 180 }, ce = { x: 1290 + 200, y: 544 + 180 };
  const w = Math.max(w3, wE), tgt = wE > w3 ? ce : c3;
  const S = 1 + (wE > w3 ? 1.35 : 1.45) * w;
  const ex_ = cx + (tgt.x - cx) * w, ey_ = cy + (tgt.y - cy) * w;
  const camT = `translate(${cx - S * ex_}px, ${cy - S * ey_}px) scale(${S})`;
  const focus3 = w3;
  const focusE = wE;
  const sheen = k(f, 38, 92, EIO);
  const errA = k(f, 150, 175);
  const foot = k(f, 172, 196);
  const qr = k(f, 425, 452);
  const slowPush = 1 + 0.02 * k(f, 0, 480, Easing.linear);

  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 35%, #F3EEE4 0%, #E4DBCB 70%, #D8CDB9 100%)", overflow: "hidden" }}>
      <Grain id="lin" op={0.07} freq={0.75} />
      <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "50% 40%" }}>
        <div style={{
          position: "absolute", left: 100, top: 40, width: 1720, height: 1000,
          transform: `translateY(${(1 - land) * 260}px) rotateX(${(1 - land) * 28}deg) rotateZ(${(1 - land) * -5}deg) translateX(${-190 * qr}px) scale(${(0.86 + 0.14 * land) * slowPush * (1 - 0.16 * qr)})`,
          transformOrigin: "50% 50%", transformStyle: "preserve-3d",
        }}>
          {/* sombra de contacto + ambiente */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 26, boxShadow: `0 ${10 + 50 * (1 - land)}px ${40 + 60 * (1 - land)}px rgba(40,30,15,${0.18 + 0.1 * (1 - land)}), 0 2px 4px rgba(40,30,15,.12)` }} />
          <div style={{ position: "absolute", inset: 0, transform: camT, transformOrigin: "0 0" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 26, overflow: "hidden", background: `linear-gradient(180deg, ${C.paper} 0%, ${C.paper2} 100%)` }}>
            <Grain id="pap" op={0.06} freq={1.2} />
            {/* cabecera */}
            <div style={{ position: "absolute", left: 60, top: 36, fontFamily: F_OSWALD, fontWeight: 600, fontSize: 22, letterSpacing: 5, color: C.tealD, opacity: k(f, 18, 40) }}>GUÍA DEL DR. FEDERER · PÁGINA 7</div>
            <div style={{ position: "absolute", left: 58, top: 66, fontFamily: F_INTER, fontWeight: 900, fontSize: 62, letterSpacing: -2, color: C.ink, opacity: k(f, 22, 46), transform: `translateY(${(1 - k(f, 22, 46)) * 20}px)` }}>
              La rutina de <span style={{ color: C.tealD }}>7 minutos</span>
            </div>
            <div style={{ position: "absolute", right: 60, top: 58, display: "flex", gap: 10, opacity: k(f, 34, 56) }}>
              {["1 minuto por zona", "Todos los días"].map((s, i) => (
                <div key={i} style={{ padding: "10px 18px", borderRadius: 999, border: `1.5px solid ${C.line}`, background: "#fff", fontFamily: F_INTER, fontWeight: 700, fontSize: 19, color: C.ink2 }}>{s}</div>
              ))}
            </div>
            <div style={{ position: "absolute", left: 60, right: 60, top: 138, height: 2, background: `linear-gradient(90deg, ${C.teal}, ${C.line} 40%, transparent)`, transform: `scaleX(${k(f, 30, 70)})`, transformOrigin: "0 0" }} />
            {/* 7 tarjetas: 4 arriba + 3 abajo con el recuadro de errores */}
            <div style={{ position: "absolute", left: 30, top: 162, display: "flex", gap: 22 }}>
              {EX.slice(0, 4).map((ex, i) => <Card key={ex.n} ex={ex} start={CARD0 + i * STEP} focus={ex.n === 3 ? focus3 : 0} dim={ex.n === 3 ? 0 : Math.max(focus3, focusE)} />)}
            </div>
            <div style={{ position: "absolute", left: 30, top: 544, display: "flex", gap: 22 }}>
              {EX.slice(4).map((ex, i) => <Card key={ex.n} ex={ex} start={CARD0 + (4 + i) * STEP} focus={0} dim={Math.max(focus3, focusE)} />)}
            </div>
            {/* recuadro ámbar de errores */}
            <div style={{
              position: "absolute", left: 1290, top: 544, width: 400, height: 360, borderRadius: 22, background: `linear-gradient(160deg, #FFF8EA, ${C.amberS})`,
              border: `1.5px solid ${focusE > 0.01 ? C.amber : "#F0D9A8"}`, padding: "26px 30px", boxSizing: "border-box",
              opacity: errA * (1 - 0.55 * focus3), transform: `translateY(${(1 - errA) * 30}px)`,
              boxShadow: `0 ${4 + 18 * focusE}px ${10 + 40 * focusE}px rgba(150,95,12,${0.1 + 0.15 * focusE})`,
              filter: focus3 > 0.01 ? `blur(${(1.6 * focus3).toFixed(2)}px)` : undefined,
            }}>
              <div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 22, letterSpacing: 3, lineHeight: 1.25, color: "#9A5F0C" }}>LOS 3 ERRORES<br />QUE LA ARRUINAN</div>
              {["Tirar la piel hacia abajo", "Apretar la mandíbula", "Fruncir la frente"].map((s, i) => {
                const a = k(f, 160 + i * 8, 180 + i * 8);
                const x = k(f, 168 + i * 8, 186 + i * 8, EIO);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, marginTop: i === 0 ? 24 : 22, opacity: a, transform: `translateX(${(1 - a) * -20}px)` }}>
                    <svg width={44} height={44} viewBox="0 0 44 44"><circle cx={22} cy={22} r={20} fill={C.dangerS} /><path d="M14 14 L30 30" stroke={C.danger} strokeWidth={4} strokeLinecap="round" strokeDasharray={23} strokeDashoffset={23 * (1 - x)} /><path d="M30 14 L14 30" stroke={C.danger} strokeWidth={4} strokeLinecap="round" strokeDasharray={23} strokeDashoffset={23 * (1 - k(f, 174 + i * 8, 192 + i * 8, EIO))} /></svg>
                    <div style={{ fontFamily: F_INTER, fontWeight: 700, fontSize: 27, lineHeight: 1.15, color: C.ink, letterSpacing: -0.4 }}>{s}</div>
                  </div>
                );
              })}
            </div>
            {/* pie */}
            <div style={{ position: "absolute", left: 60, right: 60, bottom: 40, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: foot * (1 - 0.5 * Math.max(focus3, focusE)) }}>
              <div style={{ fontFamily: F_INTER, fontWeight: 700, fontSize: 24, color: C.ink2 }}>Siempre <span style={{ color: C.tealD }}>hacia arriba y hacia afuera</span> · sin dolor</div>
              <div style={{ fontFamily: F_INTER, fontWeight: 800, fontSize: 24, color: C.ink }}>Plazo realista: <span style={{ color: C.tealD }}>2 a 3 meses</span></div>
            </div>
            {/* brillo que barre la página al asentarse */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,.55) 50%, transparent 65%)", transform: `translateX(${mix(-120, 120, sheen)}%)`, opacity: sheen > 0 && sheen < 1 ? 1 : 0, mixBlendMode: "soft-light" }} />
          </div>
          </div>
        </div>
      </AbsoluteFill>
      <QR t={qr} />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════════
// utilidades de rostro trackeado (MediaPipe, 478 puntos por cuadro) con suavizado temporal
// ═══════════════════════════════════════════════════════════════════════════════════════
type Pt = [number, number];
const smoothFace = (data: (number[][] | null)[], f: number, r = 3): Pt[] | null => {
  const n = data.length;
  let acc: Pt[] | null = null, wsum = 0;
  for (let d = -r; d <= r; d++) {
    const fr = data[Math.min(n - 1, Math.max(0, f + d))];
    if (!fr) continue;
    const w = Math.exp(-(d * d) / (2 * (r / 1.6) ** 2));
    if (!acc) acc = fr.map(() => [0, 0] as Pt);
    for (let i = 0; i < fr.length; i++) { acc[i][0] += fr[i][0] * w; acc[i][1] += fr[i][1] * w; }
    wsum += w;
  }
  return acc ? acc.map(([x, y]) => [x / wsum, y / wsum] as Pt) : null;
};

const Callout: React.FC<{ from: Pt; to: Pt; t: number; kicker: string; title: string; color: string; side?: "r" | "l" }> = ({ from, to, t, kicker, title, color, side = "r" }) => {
  if (t <= 0) return null;
  const mid: Pt = [to[0] + (side === "r" ? -40 : 40), to[1]];
  const d = `M${from[0]} ${from[1]} L${mid[0]} ${mid[1]} L${to[0]} ${to[1]}`;
  const ev = evolvePath(Math.min(1, t * 1.6), d);
  const ta = Math.max(0, (t - 0.45) / 0.55);
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <circle cx={from[0]} cy={from[1]} r={7 * Math.min(1, t * 3)} fill={color} stroke="#fff" strokeWidth={2.5} />
        <circle cx={from[0]} cy={from[1]} r={7 + 16 * ((t * 3) % 1)} fill="none" stroke={color} strokeWidth={2} opacity={1 - ((t * 3) % 1)} />
        <path d={d} fill="none" stroke="#fff" strokeWidth={4} strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} opacity={0.9} />
        <path d={d} fill="none" stroke={color} strokeWidth={2} strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
      </svg>
      <div style={{
        position: "absolute", top: to[1] - 44, ...(side === "r" ? { left: to[0] + 10 } : { right: 1920 - to[0] + 10 }),
        padding: "12px 20px 14px", borderRadius: 16, background: "rgba(255,255,255,.94)", boxShadow: "0 16px 36px rgba(0,0,0,.22)",
        borderLeft: side === "r" ? `5px solid ${color}` : undefined, borderRight: side === "l" ? `5px solid ${color}` : undefined,
        opacity: ta, transform: `translateX(${(1 - ta) * (side === "r" ? 16 : -16)}px)`,
      }}>
        <div style={{ fontFamily: F_OSWALD, fontWeight: 600, fontSize: 17, letterSpacing: 3, color }}>{kicker}</div>
        <div style={{ fontFamily: F_INTER, fontWeight: 800, fontSize: 30, color: C.ink, letterSpacing: -0.4, whiteSpace: "nowrap" }}>{title}</div>
      </div>
    </>
  );
};

const TitleCard: React.FC<{ kicker: string; title: React.ReactNode; t: number; color: string }> = ({ kicker, title, t, color }) => (
  <div style={{ position: "absolute", left: 90, top: 110, width: 560, opacity: t, transform: `translateY(${(1 - t) * 24}px)` }}>
    <div style={{ display: "inline-block", padding: "8px 16px", borderRadius: 10, background: color, color: "#fff", fontFamily: F_OSWALD, fontWeight: 600, fontSize: 20, letterSpacing: 3.5 }}>{kicker}</div>
    <div style={{ marginTop: 16, padding: "22px 26px", borderRadius: 20, background: "rgba(255,255,255,.93)", boxShadow: "0 24px 50px rgba(0,0,0,.22)", fontFamily: F_INTER, fontWeight: 800, fontSize: 44, lineHeight: 1.12, letterSpacing: -1.2, color: C.ink }}>{title}</div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════════════
// B) GRAVEDAD — escaneo de la cara real, la malla cede hacia abajo y los ejercicios la suben
// ═══════════════════════════════════════════════════════════════════════════════════════
const SAG_PTS = [116, 345, 205, 425, 172, 397, 150, 379];
// G (opcional, cuadros desde el inicio): tiempos sincronizados con la voz; pp = clip ida y vuelta (sin salto) para tramos largos.
export type GravT = { arrows: number; sag: number; flip: number; calls: [number, number, number]; end: number; pp?: boolean };
const G0: GravT = { arrows: 86, sag: 80, flip: 200, calls: [250, 262, 274], end: 360 };
export const Gravedad: React.FC<{ G?: GravT; durationInFrames?: number }> = ({ G = G0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = (face012 as any[]).length;
  const fi = G.pp ? (f % (2 * L) < L ? f % (2 * L) : 2 * L - 1 - (f % (2 * L))) : f;
  const F = smoothFace(face012 as any, fi, 3)!;
  const scanY = mix(60, 1020, k(f, 12, 72, EIO));
  const meshOn = k(f, 12, 72, EIO);
  const sag = k(f, G.sag, G.sag + 70, EIO);
  const flip = spring({ frame: f - G.flip, fps, config: { damping: 14, stiffness: 90 } });
  const lift = k(f, G.flip + 5, G.flip + 60, EIO);
  const s = sag * (1 - lift) - 0.45 * lift; // + cae, − sube
  const eyeY = (F[33][1] + F[263][1]) / 2, chinY = F[152][1];
  const disp = (p: Pt): Pt => { const w = Math.max(0, Math.min(1, (p[1] - eyeY) / (chinY - eyeY))); return [p[0], p[1] + s * 26 * w * w]; };
  const P = F.map(disp);
  const edges = tess as number[][];
  let dMesh = "";
  for (const [a, b] of edges) dMesh += `M${P[a][0].toFixed(1)} ${P[a][1].toFixed(1)}L${P[b][0].toFixed(1)} ${P[b][1].toFixed(1)}`;
  const down = "#E0663C", up = C.teal;
  const col = flip > 0.5 ? up : down;
  const meshCol = interpolate(lift, [0, 1], [0, 1]) > 0.5 ? "#7FF2EC" : (sag > 0.3 ? "#FFC7A8" : "#BFF6F2");
  const arrowsT = k(f, G.arrows, G.arrows + 54, EIO);
  const fade = 1 - 0.65 * k(f, G.end - 30, G.end);
  const t1 = k(f, G.arrows + 10, G.arrows + 38) * (1 - k(f, G.flip - 12, G.flip + 6));
  const t2 = k(f, G.flip + 14, G.flip + 40);
  const push = 1.03 + 0.05 * k(f, 0, G.end, Easing.linear);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "50% 38%" }}>
        {G.pp ? <Loop durationInFrames={2 * L} layout="none"><OffthreadVideo src={staticFile("broll/falifting/falifting_012_pp.mp4")} muted /></Loop> : <OffthreadVideo src={staticFile("broll/falifting/falifting_012.mp4")} muted />}
        {/* velo claro radial para despegar la cara del fondo (sin oscurecer) */}
        <AbsoluteFill style={{ background: `radial-gradient(34% 48% at ${F[1][0] / 19.2}% ${F[1][1] / 10.8}%, transparent 55%, rgba(240,248,247,${0.42 * meshOn}) 100%)` }} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="scanM" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#fff" /></linearGradient>
            <clipPath id="scanC"><rect x={0} y={0} width={1920} height={scanY} /></clipPath>
            <filter id="gl"><feGaussianBlur stdDeviation="2.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <g clipPath="url(#scanC)" opacity={(0.5 - 0.2 * lift) * fade} filter="url(#gl)">
            <path d={dMesh} stroke={meshCol} strokeWidth={0.9} fill="none" />
          </g>
          {meshOn < 1 && <g><rect x={0} y={scanY - 2} width={1920} height={3} fill="#9FF7F2" opacity={0.9} /><rect x={0} y={scanY - 40} width={1920} height={40} fill="url(#scanM)" opacity={0.08} /></g>}
          {/* vectores de gravedad → se dan vuelta */}
          {SAG_PTS.map((i, j) => {
            const p = P[i];
            const L = (78 + (j % 2) * 10) * Math.min(1, Math.max(0, arrowsT * 1.4 - j * 0.05)) * fade;
            if (L < 2) return null;
            const ang = mix(Math.PI / 2, -Math.PI / 2, Math.min(1, Math.max(0, flip)));
            const x2 = p[0] + Math.cos(ang) * L, y2 = p[1] + Math.sin(ang) * L;
            const hx = (a: number) => `${(x2 + Math.cos(ang + a) * 17).toFixed(1)},${(y2 + Math.sin(ang + a) * 17).toFixed(1)}`;
            return (
              <g key={i} style={{ filter: `drop-shadow(0 0 5px ${col})` }}>
                <line x1={p[0]} y1={p[1]} x2={x2} y2={y2} stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.85} />
                <line x1={p[0]} y1={p[1]} x2={x2} y2={y2} stroke={col} strokeWidth={5} strokeLinecap="round" />
                <polygon points={`${(x2 + Math.cos(ang) * 7).toFixed(1)},${(y2 + Math.sin(ang) * 7).toFixed(1)} ${hx(Math.PI * 0.78)} ${hx(-Math.PI * 0.78)}`} fill={col} stroke="#fff" strokeWidth={1.5} />
                <circle cx={p[0]} cy={p[1]} r={4} fill="#fff" />
              </g>
            );
          })}
        </svg>
        {/* callouts anclados a la cara (siguen la cabeza) */}
        <Callout from={P[345]} to={[1420, 330]} t={k(f, G.calls[0], G.calls[0] + 35)} kicker="MÚSCULO" title="Cigomático · mejillas" color={C.tealD} />
        <Callout from={P[263]} to={[1420, 470]} t={k(f, G.calls[1], G.calls[1] + 35)} kicker="MÚSCULO" title="Orbicular · ojos" color={C.tealD} />
        <Callout from={[P[152][0] + 40, P[152][1] + 70]} to={[1420, 610]} t={k(f, G.calls[2], G.calls[2] + 35)} kicker="MÚSCULO" title="Platisma · cuello" color={C.tealD} />
      </AbsoluteFill>
      <TitleCard kicker="CON LOS AÑOS" t={t1} color={down} title={<>La gravedad tira<br />todo <span style={{ color: down }}>hacia abajo</span></>} />
      <TitleCard kicker="LOS EJERCICIOS" t={t2} color={C.tealD} title={<>Devuelven tono<br /><span style={{ color: C.tealD }}>hacia arriba</span></>} />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════════
// C) FLECHAS TRACKEADAS — la trayectoria correcta pegada a la cara real que se mueve
// ═══════════════════════════════════════════════════════════════════════════════════════
export const FlechasTrack: React.FC<{ sc?: number; durationInFrames?: number }> = ({ sc = 1 }) => {
  const fr = useCurrentFrame(), f = fr / sc;
  const F = smoothFace(face013 as any, Math.min(239, fr), 4)!;
  // de al lado de la nariz → por el pómulo → hasta delante de la oreja (los dos lados)
  const side = (nose: number, cheek: number, ear: number, out: number) => {
    const a = F[nose], b = F[cheek], c = F[ear];
    const e: Pt = [c[0] + out, c[1] - 6];
    return `M${a[0].toFixed(1)} ${a[1].toFixed(1)} C${(b[0] - out * 0.2).toFixed(1)} ${(b[1] + 14).toFixed(1)} ${(b[0] + out * 0.6).toFixed(1)} ${(b[1] - 10).toFixed(1)} ${e[0].toFixed(1)} ${e[1].toFixed(1)}`;
  };
  const dL = side(129, 117, 234, -22), dR = side(358, 346, 454, 22);
  const draw = k(f, 40, 78, EIO);
  const flowOn = k(f, 70, 90) * (1 - k(f, 200, 225));
  const chip = k(f, 6, 30);
  const low = k(f, 95, 120);
  const ok = spring({ frame: f - 170, fps: 30, config: { damping: 13, stiffness: 110 } });
  const chevrons = (d: string) => {
    const L = getLength(d);
    return Array.from({ length: 4 }).map((_, i) => {
      const u = ((f / 38) + i / 4) % 1;
      const p = getPointAtLength(d, u * L), tg = getTangentAtLength(d, u * L);
      const ang = (Math.atan2(tg.y, tg.x) * 180) / Math.PI;
      const op = Math.sin(u * Math.PI) * flowOn;
      return <path key={i} d="M-7 -9 L4 0 L-7 9" transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${ang.toFixed(1)})`} stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={op} />;
    });
  };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile("broll/falifting/falifting_013.mp4")} muted />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {[dL, dR].map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke={C.teal} strokeWidth={22} strokeLinecap="round" opacity={0.18 * draw} style={{ filter: "blur(6px)" }} />
            <path d={d} fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={0.55 * draw} strokeDasharray={evolvePath(draw, d).strokeDasharray} strokeDashoffset={evolvePath(draw, d).strokeDashoffset} />
            <DrawArrow d={d} t={draw} color={C.teal} w={5} head={16} glow />
            {chevrons(d)}
          </g>
        ))}
      </svg>
      {/* chip de ejercicio */}
      <div style={{ position: "absolute", left: 70, top: 64, display: "flex", alignItems: "center", gap: 16, opacity: chip, transform: `translateX(${(1 - chip) * -30}px)` }}>
        <div style={{ width: 70, height: 70, borderRadius: 20, background: `linear-gradient(145deg, ${C.teal}, ${C.tealD})`, color: "#fff", fontFamily: F_INTER, fontWeight: 900, fontSize: 38, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 26px rgba(11,122,118,.45)" }}>7</div>
        <div style={{ padding: "12px 22px", borderRadius: 18, background: "rgba(255,255,255,.94)", boxShadow: "0 14px 34px rgba(0,0,0,.2)" }}>
          <div style={{ fontFamily: F_OSWALD, fontWeight: 600, fontSize: 18, letterSpacing: 3.5, color: C.tealD }}>EJERCICIO 7 DE 7</div>
          <div style={{ fontFamily: F_INTER, fontWeight: 800, fontSize: 34, color: C.ink, letterSpacing: -0.6 }}>El cierre</div>
        </div>
      </div>
      {/* barra inferior */}
      <div style={{ position: "absolute", left: "50%", bottom: 70, transform: `translate(-50%, ${(1 - low) * 30}px)`, opacity: low, display: "flex", alignItems: "stretch", borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 44px rgba(0,0,0,.25)" }}>
        <div style={{ padding: "16px 26px", background: "rgba(255,255,255,.95)", fontFamily: F_INTER, fontWeight: 800, fontSize: 32, color: C.ink, letterSpacing: -0.5, whiteSpace: "nowrap" }}>De la nariz <span style={{ color: C.tealD }}>hacia las orejas</span></div>
        <div style={{ padding: "16px 24px", background: C.tealD, fontFamily: F_INTER, fontWeight: 700, fontSize: 26, color: "#fff", display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>presión muy suave · 3 respiraciones</div>
      </div>
      {/* sello final */}
      <div style={{ position: "absolute", right: 80, top: 70, opacity: Math.min(1, ok), transform: `scale(${0.6 + 0.4 * ok})`, display: "flex", alignItems: "center", gap: 12, padding: "12px 20px 12px 14px", borderRadius: 999, background: "rgba(255,255,255,.95)", boxShadow: "0 14px 30px rgba(0,0,0,.22)" }}>
        <svg width={38} height={38} viewBox="0 0 38 38"><circle cx={19} cy={19} r={18} fill={C.teal} /><path d="M11 19.5 L16.5 25 L27 13" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={30} strokeDashoffset={30 * (1 - k(f, 176, 196))} /></svg>
        <div style={{ fontFamily: F_INTER, fontWeight: 800, fontSize: 24, color: C.ink }}>Siempre hacia arriba y afuera</div>
      </div>
    </AbsoluteFill>
  );
};
