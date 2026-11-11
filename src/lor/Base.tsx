// Piezas compartidas de los videos de Loretta (313 libreta espiral · 370 caja de recetas · 242 recetario de iglesia).
// Sin grade, sin grano, sin viñeta, sin temblor: la imagen va tal cual.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/Spectral";
import { loadFont as loadHand } from "@remotion/google-fonts/Kalam";
import { loadFont as loadSans } from "@remotion/google-fonts/WorkSans";

const { fontFamily: SERIF } = loadSerif("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });
const { fontFamily: HAND } = loadHand("normal", { weights: ["400", "700"], subsets: ["latin"] });
const { fontFamily: SANS } = loadSans("normal", { weights: ["500", "600"], subsets: ["latin"] });
export const FONTS = { SERIF, HAND, SANS };
export const C = { ink: "#1E2A44", pencil: "#3A3A3A", red: "#B23A2E", cream: "#FFF8EA", dark: "#14110D", lilac: "#7B5EA7", gold: "#B8863B" };
export const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const hash = (n: number) => { let x = Math.imul(n + 1, 2654435761) >>> 0; x ^= x >>> 16; x = Math.imul(x, 2246822507) >>> 0; x ^= x >>> 13; return x >>> 0; };
const r01 = (s: number, k: number) => (hash(s * 31 + k * 977) % 100000) / 100000;
export const ease = (t: number) => Easing.inOut(Easing.cubic)(Math.min(1, Math.max(0, t)));
const shadow = "0 2px 14px rgba(0,0,0,0.6)";

export type Look = { key: "nb" | "box" | "church"; paper: string; table: string; stamp?: string; accent: string };

// Ken Burns suave con sentido/foco sorteados
export const useKB = (seed: number, dur: number, clip = false) => {
  const f = useCurrentFrame();
  const out = hash(seed) % 2 === 1;
  const amp = Math.min(clip ? 0.05 : 0.12, (clip ? 0.008 : 0.025) * (dur / 30));
  const t = ease(f / Math.max(1, dur)); const k = out ? 1 - t : t;
  const ox = 35 + r01(seed, 2) * 30, oy = 35 + r01(seed, 3) * 30;
  return { transform: `scale(${1.04 + amp * k})`, transformOrigin: `${ox}% ${oy}%` } as React.CSSProperties;
};

export const Photo: React.FC<{ src: string; seed: number; dur: number }> = ({ src, seed, dur }) => {
  const kb = useKB(seed, dur);
  return (<AbsoluteFill style={{ overflow: "hidden", background: C.dark }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} /></AbsoluteFill>);
};

// tramo real de YouTube: empieza en `from` (s) dentro del archivo; si falta largo, se encadena el segundo tramo
export const Clip: React.FC<{ src: string; from?: number; seed: number; dur: number; src2?: string; from2?: number; cut?: number }> = ({ src, from = 0, seed, dur, src2, from2 = 0, cut }) => {
  const f = useCurrentFrame(); const kb = useKB(seed, dur, true);
  const use2 = src2 && cut !== undefined && f >= cut;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.dark }}>
      {!use2 ? <OffthreadVideo src={staticFile(src)} muted startFrom={Math.round(from * 30)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
        : <OffthreadVideo src={staticFile(src2!)} muted startFrom={Math.max(0, Math.round(from2 * 30) - cut!)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />}
    </AbsoluteFill>
  );
};

// (8) foto antigua como objeto: copia en papel con borde blanco apoyada sobre la mesa real
export const Vintage: React.FC<{ src: string; table: string; seed: number; dur: number }> = ({ src, table, seed, dur }) => {
  const f = useCurrentFrame();
  const inn = spring({ frame: f, fps: 30, config: { damping: 17, mass: 0.8 } });
  const rot = (r01(seed, 5) - 0.5) * 7;
  const z = 1 + 0.06 * ease(f / Math.max(1, dur));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(table)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + 0.03 * f / Math.max(1, dur)})` }} />
      <div style={{ position: "absolute", left: 960 - 690, top: 540 - 400, width: 1380, height: 800, background: "#F7F3EA", padding: 26, boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
        transform: `translateY(${(1 - inn) * 260}px) rotate(${rot * inn}deg) scale(${z})` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </AbsoluteFill>
  );
};

// (4) encuadres variados del avatar: plano general / medio / primer plano, siempre con empuje lento
export const AvatarFramed: React.FC<{ src: string; frame: string; seed: number; dur: number; enmano?: boolean }> = ({ src, frame, seed, dur }) => {
  const f = useCurrentFrame(); const t = f / Math.max(1, dur);
  const base = frame === "close" ? 1.3 : frame === "med" ? 1.14 : 1.0;
  const z = base + (hash(seed) % 2 ? 0.04 * t : 0.04 * (1 - t));
  const ox = frame === "close" ? "50% 30%" : frame === "med" ? (hash(seed + 3) % 2 ? "44% 34%" : "58% 34%") : "50% 40%";
  return (<AbsoluteFill style={{ overflow: "hidden", background: C.dark }}>
    <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, transformOrigin: ox }} />
  </AbsoluteFill>);
};

// papel a pantalla completa: la foto real de la hoja/ficha/página
const Paper: React.FC<{ look: Look; children: React.ReactNode; dur: number }> = ({ look, children, dur }) => {
  const f = useCurrentFrame();
  return (<AbsoluteFill style={{ overflow: "hidden", background: C.cream }}>
    <Img src={staticFile(look.paper)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.02 * f / Math.max(1, dur)})` }} />
    {children}
  </AbsoluteFill>);
};

export type Card = { title: string; serves: string; temp: string; time: string; ing: string[]; steps: string[]; note: string };
// tarjeta de receta a pantalla completa (≥8 s): todo lo que hace falta para copiarla
export const RecipeCard: React.FC<{ card: Card; look: Look; dur: number }> = ({ card, look, dur }) => {
  const f = useCurrentFrame();
  const L = (i: number) => interpolate(f, [8 + i * 7, 18 + i * 7], [0, 1], CL);
  const x0 = look.key === "nb" ? 330 : 210;
  const col = look.key === "church" ? "#2B2219" : C.ink;
  return (
    <Paper look={look} dur={dur}>
      {look.stamp && <div style={{ position: "absolute", right: 120, top: 70, border: `5px solid ${C.red}`, color: C.red, fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 3, padding: "8px 18px", transform: "rotate(-6deg)", opacity: 0.85 * L(0) }}>{look.stamp}</div>}
      <div style={{ position: "absolute", left: x0, top: 92, right: 120, color: col }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 82, lineHeight: 1.05, opacity: L(0) }}>{card.title}</div>
        <div style={{ display: "flex", gap: 46, marginTop: 14, fontFamily: SANS, fontWeight: 600, fontSize: 34, color: C.red, opacity: L(1) }}>
          {card.serves && <span>Makes: {card.serves}</span>}{card.temp && <span>{card.temp}</span>}{card.time && <span>{card.time}</span>}
        </div>
        <div style={{ display: "flex", gap: 60, marginTop: 30 }}>
          <div style={{ flex: 1.15 }}>
            {card.ing.map((x, i) => (<div key={i} style={{ fontFamily: HAND, fontSize: card.ing.length > 6 ? 42 : 47, lineHeight: 1.55, opacity: L(2 + i) }}>• {x}</div>))}
          </div>
          {card.steps.length > 0 && <div style={{ flex: 1 }}>
            {card.steps.map((x, i) => (<div key={i} style={{ fontFamily: HAND, fontSize: 40, lineHeight: 1.5, color: C.pencil, opacity: L(3 + card.ing.length + i) }}>{i + 1}. {x}</div>))}
          </div>}
        </div>
        {card.note && <div style={{ fontFamily: HAND, fontSize: 40, color: C.red, marginTop: 26, opacity: L(5 + card.ing.length + card.steps.length) }}>{card.note}</div>}
      </div>
    </Paper>
  );
};

// (3)+(2) apertura de capítulo: la tarjeta entra a la mesa como objeto + barra "trick n of N"
export const TrickTitle: React.FC<{ n: number; N: number; name: string; look: Look; dur: number; label: string }> = ({ n, N, name, look, dur, label }) => {
  const f = useCurrentFrame();
  const inn = spring({ frame: f, fps: 30, config: { damping: 15, mass: 0.9 } });
  const rot = (hash(n) % 2 ? 1 : -1) * (3 + (hash(n + 7) % 4));
  const bar = interpolate(f, [10, 30], [(n - 1) / N, n / N], { ...CL, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(look.table)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.03 * f / Math.max(1, dur)})` }} />
      <div style={{ position: "absolute", left: 960 - 560, top: 175, width: 1120, height: 640, overflow: "hidden", boxShadow: "0 34px 70px rgba(0,0,0,0.5)",
        transform: `translate(${(1 - inn) * 1300}px, ${(1 - inn) * -120}px) rotate(${rot * inn + (1 - inn) * 24}deg)` }}>
        <Img src={staticFile(look.paper)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 90px" }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 6, color: C.red }}>{label.toUpperCase()} {n}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 92, lineHeight: 1.08, color: C.ink, marginTop: 14 }}>{name}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 360, right: 360, bottom: 92 }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: "#fff", textShadow: shadow, marginBottom: 10, textAlign: "center" }}>{label.toLowerCase()} {n} of {N}</div>
        <div style={{ height: 14, background: "rgba(255,255,255,0.35)", borderRadius: 7, overflow: "hidden" }}><div style={{ width: `${bar * 100}%`, height: "100%", background: look.accent }} /></div>
      </div>
    </AbsoluteFill>
  );
};

// (1) carrusel de las recetas: las fotos reales de cada receta giran en un anillo sobre la mesa y terminan en abanico
export const Carousel: React.FC<{ items: { title: string; src: string }[]; look: Look; head: string; dur: number }> = ({ items, look, head, dur }) => {
  const f = useCurrentFrame(); const N = items.length;
  const fan = ease((f - dur * 0.6) / 30); const rot = -f * 0.7;
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(look.table)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", top: 54, width: "100%", textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 86, color: "#fff", textShadow: "0 3px 18px rgba(0,0,0,0.75)" }}>{head}</div>
      <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "50% 45%" }}>
        {items.map((c, i) => {
          const th = ((((i * (360 / N) + rot) % 360) + 540) % 360) - 180; const rad = (th * Math.PI) / 180;
          const phi = -30 + i * (60 / Math.max(1, N - 1)), pr = (phi * Math.PI) / 180;
          const x = lerp(700 * Math.sin(rad), 1500 * Math.sin(pr), fan), y = lerp(30, 1500 * (1 - Math.cos(pr)), fan), z = lerp(700 * (Math.cos(rad) - 1), i * 2, fan);
          const ap = spring({ frame: f - i * 3, fps: 30, config: { damping: 16 } });
          return (<div key={i} style={{ position: "absolute", left: 960 - 190, top: 330, width: 380, zIndex: Math.round(3000 + z), opacity: ap,
            transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${lerp(th, 0, fan)}deg) rotateZ(${lerp(0, phi, fan)}deg) scale(${lerp(1, 0.8, fan)})` }}>
            <div style={{ background: "#FBF6EC", padding: 12, boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
              <Img src={staticFile(c.src)} style={{ width: "100%", height: 214, objectFit: "cover" }} />
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 32, color: C.ink, textAlign: "center", marginTop: 6, lineHeight: 1.1 }}>{c.title}</div>
            </div></div>);
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// (7) mapa de Iowa dibujado a mano sobre la hoja (contorno por lon/lat reales)
const IOWA: [number, number][] = [[-96.64, 43.5], [-91.22, 43.5], [-91.06, 43.0], [-90.64, 42.5], [-90.15, 42.1], [-90.31, 41.75], [-90.95, 41.43], [-91.05, 41.17], [-91.12, 40.7], [-91.42, 40.38], [-91.73, 40.61], [-95.77, 40.58], [-95.86, 41.1], [-95.94, 41.5], [-96.1, 41.75], [-96.35, 42.2], [-96.62, 42.5], [-96.6, 43.0], [-96.46, 43.3], [-96.64, 43.5]];
export const MapIowa: React.FC<{ look: Look; pins: { lon: number; lat: number; label: string }[]; dur: number; title?: string }> = ({ look, pins, dur, title }) => {
  const f = useCurrentFrame(); const S = 250, X0 = 360, Y0 = 210;
  const P = (lon: number, lat: number) => [X0 + (lon + 96.7) * 0.74 * S, Y0 + (43.55 - lat) * S];
  const d = IOWA.map(([a, b], i) => `${i ? "L" : "M"}${P(a, b).join(" ")}`).join(" ") + "Z";
  const draw = interpolate(f, [4, 40], [3000, 0], CL);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(look.paper)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d={d} fill="rgba(123,94,167,0.10)" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" strokeDasharray={3000} strokeDashoffset={draw} />
        {pins.map((p, i) => { const [x, y] = P(p.lon, p.lat); const o = interpolate(f, [36 + i * 14, 46 + i * 14], [0, 1], CL); return (
          <g key={i} opacity={o}><circle cx={x} cy={y} r={16} fill={C.red} /><text x={x + 28} y={y + 14} fontFamily={HAND} fontWeight={700} fontSize={50} fill={C.ink}>{p.label}</text></g>); })}
      </svg>
      <div style={{ position: "absolute", left: 360, top: 90, fontFamily: HAND, fontWeight: 700, fontSize: 72, color: C.ink, opacity: interpolate(f, [0, 10], [0, 1], CL) }}>{title || "IOWA"}</div>
    </AbsoluteFill>
  );
};

// CTA del libro: la página real (200 dpi) sobre la mesa + QR verificado (≥8 s), sin precio ni URL dicha
export const BookCTA: React.FC<{ page: string; qr: string; look: Look; head: string; sub: string; dur: number; qrAt?: number }> = ({ page, qr, look, head, sub, dur, qrAt = 20 }) => {
  const f = useCurrentFrame();
  const inn = spring({ frame: f, fps: 30, config: { damping: 18, mass: 0.9 } });
  const q = spring({ frame: f - qrAt, fps: 30, config: { damping: 16 } });
  const z = 1 + 0.05 * ease(f / Math.max(1, dur));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(look.table)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.02 * f / Math.max(1, dur)})` }} />
      <div style={{ position: "absolute", left: 230, top: 40, height: 1000, width: 773, boxShadow: "0 30px 70px rgba(0,0,0,0.5)", transform: `translateY(${(1 - inn) * 1100}px) rotate(${-2.5 * inn}deg) scale(${z})`, transformOrigin: "50% 60%" }}>
        <Img src={staticFile(page)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", left: 1130, top: 250, width: 560, opacity: q, transform: `translateY(${(1 - q) * 60}px) rotate(2deg)` }}>
        <div style={{ background: "#fff", padding: 26, boxShadow: "0 20px 50px rgba(0,0,0,0.45)" }}><Img src={staticFile(qr)} style={{ width: "100%", display: "block" }} /></div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: "#fff", textShadow: "0 3px 16px rgba(0,0,0,0.8)", marginTop: 26, textAlign: "center", lineHeight: 1.1 }}>{head}</div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.8)", marginTop: 10, textAlign: "center" }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};

// cartas: notas manuscritas parafraseadas (sin nombres) que caen sobre la foto real de las cartas
export const Letters: React.FC<{ bg: string; notes: { t: string; at: number }[]; head: string; dur: number }> = ({ bg, notes, head, dur }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.04 * f / Math.max(1, dur)})` }} />
      <div style={{ position: "absolute", top: 60, width: "100%", textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 84, color: "#fff", textShadow: "0 3px 18px rgba(0,0,0,0.8)" }}>{head}</div>
      {notes.map((n, i) => { const s = spring({ frame: f - n.at, fps: 30, config: { damping: 16 } }); return (
        <div key={i} style={{ position: "absolute", left: 260 + (i % 2) * 720, top: 260 + Math.floor(i / 2) * 330, width: 640, background: "#FFFDF6", padding: "26px 34px", boxShadow: "0 18px 40px rgba(0,0,0,0.4)",
          fontFamily: HAND, fontSize: 40, color: C.ink, lineHeight: 1.3, opacity: s, transform: `translateY(${(1 - s) * 80}px) rotate(${(i % 2 ? 2 : -2)}deg)` }}>“{n.t}”</div>); })}
    </AbsoluteFill>
  );
};

// (9) dato con fuente real, como cinta sobre el plano
export const Data: React.FC<{ big: string; line: string; src: string; dur: number }> = ({ big, line, src, dur }) => {
  const f = useCurrentFrame(); const s = spring({ frame: f, fps: 30, config: { damping: 17 } }); const o = interpolate(f, [dur - 10, dur], [1, 0], CL);
  return (<AbsoluteFill style={{ opacity: o }}>
    <div style={{ position: "absolute", left: 110, bottom: 110, background: "rgba(255,250,240,0.95)", padding: "26px 40px", maxWidth: 980, boxShadow: "0 16px 40px rgba(0,0,0,0.4)", transform: `translateX(${(1 - s) * -700}px)` }}>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 92, color: C.red, lineHeight: 1 }}>{big}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 40, color: C.ink, marginTop: 8 }}>{line}</div>
      <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 24, color: "#555", marginTop: 10 }}>Source: {src}</div>
    </div></AbsoluteFill>);
};

// (10) resumen: tira con el número y lo que se dice, mientras se repasan las 30
export const RecapLine: React.FC<{ n: number; N: number; name: string; text: string; look: Look; dur: number }> = ({ n, N, name, text, look, dur }) => {
  const f = useCurrentFrame(); const s = spring({ frame: f, fps: 30, config: { damping: 18 } }); const o = interpolate(f, [dur - 6, dur], [1, 0], CL);
  return (<AbsoluteFill style={{ opacity: o }}>
    <div style={{ position: "absolute", left: 90, right: 90, bottom: 70, display: "flex", alignItems: "stretch", boxShadow: "0 14px 34px rgba(0,0,0,0.45)", transform: `translateY(${(1 - s) * 200}px)` }}>
      <div style={{ background: look.accent, color: "#fff", fontFamily: SERIF, fontWeight: 700, fontSize: 70, width: 150, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
      <div style={{ background: "rgba(255,250,240,0.97)", flex: 1, padding: "16px 30px" }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: C.ink, lineHeight: 1.1 }}>{name} <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 24, color: "#777" }}>{n} of {N}</span></div>
        <div style={{ fontFamily: HAND, fontSize: 36, color: C.pencil, lineHeight: 1.25, marginTop: 4 }}>{text}</div>
      </div>
    </div></AbsoluteFill>);
};

// cierre: el libro cerrado sobre la mesa + QR + pregunta para los comentarios
export const Close: React.FC<{ cover: string; qr: string; look: Look; head: string; question?: string; qAt?: number; dur: number }> = ({ cover, qr, look, head, question, qAt = 9999, dur }) => {
  const f = useCurrentFrame(); const inn = spring({ frame: f, fps: 30, config: { damping: 18 } }); const q = spring({ frame: f - qAt, fps: 30, config: { damping: 16 } });
  return (<AbsoluteFill style={{ overflow: "hidden" }}>
    <Img src={staticFile(look.table)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.03 * f / Math.max(1, dur)})` }} />
    <div style={{ position: "absolute", left: 300, top: 90, height: 900, width: 696, boxShadow: "0 34px 80px rgba(0,0,0,0.55)", transform: `translateY(${(1 - inn) * 1000}px) rotate(${-3 * inn}deg)` }}>
      <Img src={staticFile(cover)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
    <div style={{ position: "absolute", left: 1150, top: 200, width: 480, opacity: inn }}>
      <div style={{ background: "#fff", padding: 22, boxShadow: "0 20px 50px rgba(0,0,0,0.45)" }}><Img src={staticFile(qr)} style={{ width: "100%", display: "block" }} /></div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: "#fff", textShadow: "0 3px 16px rgba(0,0,0,0.8)", marginTop: 22, textAlign: "center" }}>{head}</div>
    </div>
    {question && <div style={{ position: "absolute", left: 120, right: 120, bottom: 60, textAlign: "center", background: "rgba(255,250,240,0.96)", padding: "20px 30px", fontFamily: HAND, fontWeight: 700, fontSize: 54, color: C.ink, opacity: q, transform: `translateY(${(1 - q) * 80}px)` }}>{question}</div>}
  </AbsoluteFill>);
};

// pregunta para los comentarios, en papel, abajo
export const Ask: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame(); const s = spring({ frame: f, fps: 30, config: { damping: 17 } }); const o = interpolate(f, [dur - 8, dur], [1, 0], CL);
  return (<AbsoluteFill style={{ opacity: o }}>
    <div style={{ position: "absolute", left: 160, right: 160, bottom: 70, textAlign: "center", background: "rgba(255,250,240,0.97)", padding: "22px 34px", boxShadow: "0 16px 40px rgba(0,0,0,0.4)", transform: `translateY(${(1 - s) * 160}px)` }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, letterSpacing: 4, color: C.red }}>TELL ME IN THE COMMENTS</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: C.ink, lineHeight: 1.15, marginTop: 6 }}>{text}</div>
    </div></AbsoluteFill>);
};

// (2) barra de progreso chica, abajo: «trick 7 of 30»
export const Prog: React.FC<{ n: number; N: number; label: string; look: Look; dur: number }> = ({ n, N, label, look, dur }) => {
  const f = useCurrentFrame(); const o = Math.min(interpolate(f, [0, 8], [0, 1], CL), interpolate(f, [dur - 8, dur], [1, 0], CL));
  return (<AbsoluteFill style={{ opacity: o }}>
    <div style={{ position: "absolute", left: 60, bottom: 44, width: 420 }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, color: "#fff", textShadow: shadow, marginBottom: 6 }}>{label.toLowerCase()} {n} of {N}</div>
      <div style={{ height: 8, background: "rgba(255,255,255,0.35)", borderRadius: 4, overflow: "hidden" }}><div style={{ width: `${(n / N) * 100}%`, height: "100%", background: look.accent }} /></div>
    </div></AbsoluteFill>);
};
