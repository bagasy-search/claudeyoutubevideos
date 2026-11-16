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

const REP_O = [[50, 50], [28, 38], [72, 62], [30, 70], [70, 30], [50, 25], [50, 75], [22, 50], [78, 50], [40, 60], [60, 40], [35, 30]];
export const Photo: React.FC<{ src: string; seed: number; dur: number; rep?: number }> = ({ src, seed, dur, rep = 0 }) => {
  const kb = useKB(seed, dur); const f = useCurrentFrame();
  if (!rep) return (<AbsoluteFill style={{ overflow: "hidden", background: C.dark }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} /></AbsoluteFill>);
  // repetición: plano de detalle en otra zona de la foto + paneo lateral (otro plano, no la misma foto otra vez)
  const [ox, oy] = REP_O[rep % REP_O.length]; const z = 1.42 + 0.06 * ease(f / Math.max(1, dur));
  const dx = (hash(seed + rep) % 2 ? 1 : -1) * 3 * ease(f / Math.max(1, dur));
  return (<AbsoluteFill style={{ overflow: "hidden", background: C.dark }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z}) translateX(${dx}%)`, transformOrigin: `${ox}% ${oy}%` }} /></AbsoluteFill>);
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
  // título y datos ya están en el cuadro 0 (nada de hoja vacía); las líneas entran rápido de a una
  const L = (i: number) => (i <= 1 ? 1 : interpolate(f, [i * 3, i * 3 + 6], [0, 1], CL));
  const col = look.key === "church" ? "#2B2219" : C.ink;
  // alto real estimado contando los renglones partidos (columna ≈ 30 caracteres de Kalam 42 px)
  const wr = (x: string, c: number) => Math.max(1, Math.ceil(x.length / c));
  const nIng = card.ing.reduce((a, x) => a + wr(x, 26), 0) * 61;
  const nSt = card.steps.reduce((a, x) => a + wr(x, 27) * 56 + 8, 0);
  const nNote = card.note ? 24 + wr(card.note, 44) * 52 : 0;
  const nL = (Math.max(nIng, nSt) + nNote) / 64;
  const H = 92 + 96 + 110 + nL * 64 + 120;
  // márgenes calculados para que, con la escala ZC, ningún texto quede a menos de 80 px del borde
  const ZC = 1.12, M = 960 - (960 - 80) / ZC;
  // si no entra, primero se achica (hasta 0.78) y recién después se desplaza, con margen abajo de 170 px
  const Z0 = Math.max(0.6, Math.min(ZC, 940 / H));
  const travel = Math.max(0, H * Z0 - 1080 + 170);
  const cy = -travel * ease((f - dur * 0.15) / (dur * 0.55));
  const cz = Z0 + 0.02 * f / Math.max(1, dur);
  return (
    <Paper look={look} dur={dur}>
     <AbsoluteFill style={{ transform: `translateY(${cy}px) scale(${cz})`, transformOrigin: "50% 0%" }}>
      <div style={{ position: "absolute", left: M, top: 86, right: M, color: col }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 30 }}>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 80, lineHeight: 1.05 }}>{card.title}</div>
          {look.stamp && <div style={{ flexShrink: 0, border: `5px solid ${C.red}`, color: C.red, fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 2, padding: "8px 14px", transform: "rotate(-6deg)", opacity: 0.85, marginTop: 10, whiteSpace: "nowrap" }}>{look.stamp}</div>}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 18px", marginTop: 16 }}>
          {[card.serves && `Makes: ${card.serves}`, card.temp, card.time].filter(Boolean).map((x, i) => (
            <span key={i} style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, color: "#fff", background: C.red, padding: "6px 16px", borderRadius: 10, whiteSpace: "nowrap" }}>{x}</span>))}
        </div>
        <div style={{ display: "flex", gap: 54, marginTop: 30 }}>
          <div style={{ flex: 1.1, minWidth: 0 }}>
            {card.ing.map((x, i) => (<div key={i} style={{ fontFamily: HAND, fontSize: card.ing.length > 6 ? 42 : 46, lineHeight: 1.45, opacity: L(2 + i) }}>• {x}</div>))}
          </div>
          {card.steps.length > 0 && <div style={{ flex: 1, minWidth: 0 }}>
            {card.steps.map((x, i) => (<div key={i} style={{ fontFamily: HAND, fontSize: 40, lineHeight: 1.4, marginBottom: 8, color: C.pencil, opacity: L(3 + card.ing.length + i) }}>{i + 1}. {x.replace(/^\d+\s*·\s*/, "")}</div>))}
          </div>}
        </div>
        {card.note && <div style={{ fontFamily: HAND, fontSize: 42, fontWeight: 700, color: C.red, marginTop: 24, opacity: L(5 + card.ing.length + card.steps.length) }}>{card.note}</div>}
      </div>
     </AbsoluteFill>
    </Paper>
  );
};

// (3)+(2) apertura de capítulo: la tarjeta entra a la mesa como objeto + barra "trick n of N"
export const TrickTitle: React.FC<{ n: number; N: number; name: string; look: Look; dur: number; label: string }> = ({ n, N, name, look, dur, label }) => {
  const f = useCurrentFrame();
  const inn = spring({ frame: f, fps: 30, config: { damping: 17, mass: 0.6, stiffness: 160 } });
  const rot = (hash(n) % 2 ? 1 : -1) * (3 + (hash(n + 7) % 4));
  const bar = interpolate(f, [4, 22], [(n - 1) / N, n / N], { ...CL, easing: Easing.out(Easing.cubic) });
  const p = ease(f / Math.max(1, dur));
  const extra = n > N; // capítulo fuera de la cuenta (p. ej. «From Your Letters»): sin número ni barra
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(look.table)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.08 * p})` }} />
      <div style={{ position: "absolute", left: 960 - 580, top: 150, width: 1160, height: 650, overflow: "hidden", boxShadow: "0 34px 70px rgba(0,0,0,0.5)",
        transform: `translate(${(1 - inn) * 900}px, ${(1 - inn) * -80}px) rotate(${rot * inn + (1 - inn) * 18 - rot * 0.7 * p}deg) scale(${1 + 0.12 * p})` }}>
        <Img src={staticFile(look.paper)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 80px" }}>
          {!extra && <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 190, lineHeight: 1, color: C.red, transform: `scale(${1 + 0.5 * (1 - spring({ frame: f, fps: 30, config: { damping: 11, mass: 0.6 } }))})` }}>{n}</div>}
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 100, lineHeight: 1.05, color: C.ink, marginTop: 4 }}>{name.split(" ").map((w, i) => { const s = spring({ frame: f - 4 - i * 3, fps: 30, config: { damping: 14 } }); return <span key={i} style={{ display: "inline-block", opacity: s > 0.02 ? 1 : 0, transform: `translateY(${(1 - s) * 40}px) scale(${0.7 + 0.3 * s})`, marginRight: 22 }}>{w}</span>; })}</div>
        </div>
      </div>
      {!extra && <div style={{ position: "absolute", left: 320, right: 320, bottom: 70, background: "rgba(20,17,13,0.82)", borderRadius: 22, padding: "16px 34px 22px" }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 50, color: "#fff", marginBottom: 12, textAlign: "center", letterSpacing: 1 }}>{label.toUpperCase()} {n} OF {N}</div>
        <div style={{ height: 20, background: "rgba(255,255,255,0.28)", borderRadius: 10, overflow: "hidden" }}><div style={{ width: `${bar * 100}%`, height: "100%", background: "#E0533F" }} /></div>
      </div>}
    </AbsoluteFill>
  );
};

// (1) carrusel de las recetas: las fotos reales de cada receta giran en un anillo sobre la mesa y terminan en abanico
export const Carousel: React.FC<{ items: { title: string; src: string }[]; look: Look; head: string; dur: number }> = ({ items, look, head, dur }) => {
  // las fotos reales de cada receta entran de a una, grandes y numeradas, y van a su lugar en una grilla 3x2
  const f = useCurrentFrame(); const N = items.length;
  // hasta 8 en 4 columnas; 9–10 en 5 columnas x 2 filas para que entren enteras
  const cols = N === 4 ? 4 : N <= 6 ? 3 : N <= 8 ? 4 : 5, rows = Math.ceil(N / cols);
  const W = cols === 3 ? 500 : cols === 4 ? 400 : 318, IH = Math.round(W * 0.56), CW = W + (cols === 5 ? 50 : 70), RH = IH + (cols === 5 ? 170 : 150);
  const gy0 = 205 + Math.max(0, (2 - rows) * RH / 2);
  const step = Math.max(10, Math.floor((dur * 0.62) / N));
  const kz = 1 + 0.06 * ease(f / Math.max(1, dur));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
     <AbsoluteFill style={{ transform: `scale(${kz})`, transformOrigin: "50% 55%" }}>
      <Img src={staticFile(look.table)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.18)" }} />
     </AbsoluteFill>
      <div style={{ position: "absolute", top: 34, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 84, color: "#fff", background: "rgba(20,17,13,0.72)", padding: "4px 46px 10px", borderRadius: 20 }}>{head}</div>
      </div>
      {items.map((c, i) => {
        const t0 = i * step; if (f < t0) return null;
        const a = spring({ frame: f - t0, fps: 30, config: { damping: 15, mass: 0.7 } });
        const g = spring({ frame: f - (i < N - 1 ? t0 + step : t0 + step), fps: 30, config: { damping: 17 } }); // 0 = al frente, 1 = en su lugar
        const col = i % cols, row = Math.floor(i / cols);
        const gx = 960 + (col - (cols - 1) / 2) * CW, gy = gy0 + row * RH + RH / 2;
        const x = 960 + (gx - 960) * g, y = 570 + (gy - 570) * g;
        const s = (1.5 - 0.5 * g) * (0.6 + 0.4 * a);
        const r = ((hash(i + 3) % 5) - 2) * 1.2 * g;
        return (<div key={i} style={{ position: "absolute", left: x - W / 2 - 14, top: y - (IH + 120) / 2, width: W + 28, zIndex: g < 0.99 ? 100 + i : 10 + i,
            transform: `translateY(${(1 - a) * 120}px) scale(${s}) rotate(${r}deg)` }}>
            <div style={{ background: "#FBF6EC", padding: 14, boxShadow: "0 18px 40px rgba(0,0,0,0.5)" }}>
              <div style={{ position: "relative" }}>
                <Img src={staticFile(c.src)} style={{ width: "100%", height: IH, objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", left: 10, top: 10, width: 58, height: 58, borderRadius: 29, background: C.red, color: "#fff", fontFamily: SERIF, fontWeight: 700, fontSize: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
              </div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: cols === 3 ? 40 : cols === 4 ? 34 : 31, color: C.ink, textAlign: "center", marginTop: 8, lineHeight: 1.08, height: 88, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.title}</div>
            </div></div>);
      })}
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
  const kz = 1 + 0.09 * Math.min(1, f / Math.max(1, dur)); // empuje continuo: el mapa nunca queda congelado
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
     <AbsoluteFill style={{ transform: `scale(${kz})`, transformOrigin: "42% 50%" }}>
      <Img src={staticFile(look.paper)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d={d} fill="rgba(123,94,167,0.10)" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" strokeDasharray={3000} strokeDashoffset={draw} />
        {pins.map((p, i) => { const [x, y] = P(p.lon, p.lat); const o = interpolate(f, [36 + i * 14, 46 + i * 14], [0, 1], CL); return (
          <g key={i} opacity={o}><circle cx={x} cy={y} r={16} fill={C.red} /><text x={x + 28} y={y + 14} fontFamily={HAND} fontWeight={700} fontSize={50} fill={C.ink}>{p.label}</text></g>); })}
      </svg>
      <div style={{ position: "absolute", left: 360, top: 90, fontFamily: HAND, fontWeight: 700, fontSize: 72, color: C.ink, opacity: interpolate(f, [0, 10], [0, 1], CL) }}>{title || "IOWA"}</div>
     </AbsoluteFill>
    </AbsoluteFill>
  );
};

// CTA del libro: la página real (200 dpi) sobre la mesa + QR verificado (≥8 s), sin precio ni URL dicha
export const BookCTA: React.FC<{ page: string; qr: string; look: Look; head: string; sub: string; dur: number; qrAt?: number }> = ({ page, qr, look, head, sub, dur, qrAt = 20 }) => {
  const f = useCurrentFrame();
  const inn = spring({ frame: f, fps: 30, config: { damping: 18, mass: 0.5, stiffness: 170 } });
  const q = spring({ frame: f - qrAt, fps: 30, config: { damping: 16 } });
  const z = 1 + 0.05 * ease(f / Math.max(1, dur));
  const cam = 1 + 0.1 * ease(f / Math.max(1, dur)); const pulse = f > qrAt + 20 ? 1 + 0.035 * Math.max(0, Math.sin((f - qrAt) / 9)) : 1;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
     <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: "62% 45%", perspective: 2400 }}>
      <Img src={staticFile(look.table)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.02 * f / Math.max(1, dur)})` }} />
      <div style={{ position: "absolute", left: 230, top: 40, height: 1000, width: 773, boxShadow: "0 30px 70px rgba(0,0,0,0.5)", transform: `translateY(${(1 - inn) * 700}px) rotateX(${8 * inn}deg) rotateY(${6 - 6 * ease(f / Math.max(1, dur))}deg) rotate(${-2.5 * inn}deg) scale(${z})`, transformOrigin: "50% 60%" }}>
        <Img src={staticFile(page)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", left: 1130, top: 110, width: 520, opacity: q > 0.02 ? 1 : 0, transform: `translateX(${(1 - q) * 700}px) rotate(2deg) scale(${pulse})` }}>
        <div style={{ background: "#fff", padding: 26, boxShadow: "0 20px 50px rgba(0,0,0,0.45)" }}><Img src={staticFile(qr)} style={{ width: "100%", display: "block" }} /></div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: "#fff", textShadow: "0 3px 16px rgba(0,0,0,0.8)", marginTop: 26, textAlign: "center", lineHeight: 1.1 }}>{head}</div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 44, color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.8)", marginTop: 10, textAlign: "center" }}>{sub}</div>
      </div>
     </AbsoluteFill>
    </AbsoluteFill>
  );
};

// cartas: notas manuscritas parafraseadas (sin nombres) que caen sobre la foto real de las cartas
export const Letters: React.FC<{ bg: string; notes: { t: string; at: number }[]; head: string; dur: number }> = ({ bg, notes, head, dur }) => {
  const f = useCurrentFrame(); const p = ease(f / Math.max(1, dur));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.12 * p}) translateX(${-30 * p}px)`, transformOrigin: "50% 40%" }} />
      <div style={{ position: "absolute", top: 46, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 80, color: "#fff", background: "rgba(20,17,13,0.78)", padding: "4px 44px 10px", borderRadius: 20 }}>{head}</div>
      </div>
      {notes.map((n, i) => { const s = spring({ frame: f - n.at, fps: 30, config: { damping: 16 } }); return (
        <div key={i} style={{ position: "absolute", left: notes.length === 1 ? 460 : 260 + (i % 2) * 720, top: notes.length === 1 ? 360 : 260 + Math.floor(i / 2) * 330, width: notes.length === 1 ? 1000 : 640, background: "#FFFDF6", padding: "34px 44px", boxShadow: "0 22px 50px rgba(0,0,0,0.5)",
          fontFamily: HAND, fontSize: notes.length === 1 ? 72 : 54, fontWeight: 700, color: C.ink, lineHeight: 1.2, opacity: s > 0.02 ? 1 : 0, transform: `translateY(${(1 - s) * 300}px) rotate(${(i % 2 ? 2 : -2) + (1 - s) * 14}deg) scale(${1 + 0.06 * ease((f - n.at) / Math.max(1, dur))})` }}>“{n.t}”</div>); })}
    </AbsoluteFill>
  );
};

// (9) dato con fuente real, como cinta sobre el plano
export const Data: React.FC<{ big: string; line: string; src: string; dur: number }> = ({ big, line, src, dur }) => {
  const f = useCurrentFrame(); const s = spring({ frame: f, fps: 30, config: { damping: 17 } });
  const out = interpolate(f, [dur - 6, dur - 1], [1, 0], { ...CL, easing: Easing.in(Easing.cubic) });
  const m = big.match(/^(\d+)(.*)$/); const v = m ? parseInt(m[1]) : 0;
  // la cifra llega al valor real en 8 cuadros: nunca queda leíble un número equivocado
  const cnt = m && v >= 20 ? Math.round(v * (0.9 + 0.1 * ease(f / 8))) + m[2].replace(/^ (°)/, "$1") : big.replace(/ °/, "°");
  const short = /USDA/.test(src) ? "USDA" : src;
  return (<AbsoluteFill>
    <div style={{ position: "absolute", left: 50, top: 190, background: "rgba(255,250,240,0.97)", padding: "22px 38px", width: 620, boxShadow: "0 16px 40px rgba(0,0,0,0.4)", transform: `scale(${(0.6 + 0.4 * s) * out * (1 + 0.025 * Math.sin(f / 16))})`, transformOrigin: "0% 0%" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 20 }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: cnt.length <= 6 ? 130 : cnt.length <= 9 ? 104 : 76, color: C.red, lineHeight: 1.02, whiteSpace: cnt.length <= 9 ? "nowrap" : "normal" }}>{cnt}</div>
      </div>
      <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 46, color: C.ink, marginTop: 8, lineHeight: 1.15 }}>{line.replace(/ °/g, "°")}</div>
      <div style={{ display: "inline-block", fontFamily: SANS, fontWeight: 600, fontSize: 26, color: "#fff", background: C.ink, padding: "4px 14px", borderRadius: 8, marginTop: 14 }}>{short}</div>
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
  const cam = 1 + 0.12 * ease(f / Math.max(1, dur));
  return (<AbsoluteFill style={{ overflow: "hidden" }}>
   <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: "55% 40%", perspective: 2400 }}>
    <Img src={staticFile(look.table)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.03 * f / Math.max(1, dur)})` }} />
    <div style={{ position: "absolute", left: 300, top: 90, height: 900, width: 696, boxShadow: "0 34px 80px rgba(0,0,0,0.55)", transform: `translateY(${(1 - inn) * 1000}px) rotateY(${10 - 14 * ease(f / Math.max(1, dur))}deg) rotate(${-3 * inn}deg)` }}>
      <Img src={staticFile(cover)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
    <div style={{ position: "absolute", left: 1130, top: 150, width: 560, transform: `translateX(${(1 - inn) * 900}px) rotate(${2 - 2 * ease(f / Math.max(1, dur))}deg)` }}>
      <div style={{ background: "#fff", padding: 22, boxShadow: "0 20px 50px rgba(0,0,0,0.45)" }}><Img src={staticFile(qr)} style={{ width: "100%", display: "block" }} /></div>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 36, color: C.ink, background: "#FFF3D6", padding: "10px 12px", whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(0,0,0,0.4)", marginTop: 22, textAlign: "center" }}>cookbook.lorettaschurch.com</div>
    </div>
   </AbsoluteFill>
    {question && <div style={{ position: "absolute", left: 140, right: 140, bottom: 70, textAlign: "center", background: "#fff", borderRadius: 34, padding: "26px 40px", fontFamily: HAND, fontWeight: 700, fontSize: 66, color: C.ink, boxShadow: "0 18px 44px rgba(0,0,0,0.45)", opacity: q > 0.02 ? 1 : 0, transform: `translateY(${(1 - q) * 300 + 6 * Math.sin(f / 20)}px) scale(${0.85 + 0.15 * q})` }}>{question}</div>}
  </AbsoluteFill>);
};

// pregunta para los comentarios, en papel, abajo
export const Ask: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame(); const s = spring({ frame: f, fps: 30, config: { damping: 15 } });
  const out = interpolate(f, [dur - 6, dur - 1], [1, 0], { ...CL, easing: Easing.in(Easing.cubic) });
  return (<AbsoluteFill>
    <div style={{ position: "absolute", right: 50, top: 60, width: 760, background: "#fff", borderRadius: 40, padding: "28px 42px", boxShadow: "0 18px 44px rgba(0,0,0,0.45)", transform: `translateY(${(1 - s) * -60 + 6 * Math.sin(f / 18)}px) rotate(${1.5 * Math.sin(f / 26)}deg) scale(${(0.7 + 0.3 * s) * out * (1 + 0.03 * ease(f / Math.max(1, dur)))})`, transformOrigin: "20% 100%" }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 36, letterSpacing: 3, color: C.red }}>TELL ME IN THE COMMENTS</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 70, color: C.ink, lineHeight: 1.1, marginTop: 8 }}>{text}</div>
      <div style={{ position: "absolute", left: 70, bottom: -34, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: "36px solid #fff" }} />
    </div></AbsoluteFill>);
};

// (2) barra de progreso chica, abajo: «trick 7 of 30»
export const Prog: React.FC<{ n: number; N: number; label: string; look: Look; dur: number }> = ({ n, N, label, look, dur }) => {
  const f = useCurrentFrame();
  if (n > N) return null; const s = spring({ frame: f, fps: 30, config: { damping: 18 } });
  const out = interpolate(f, [dur - 6, dur - 1], [0, 1], { ...CL, easing: Easing.in(Easing.cubic) });
  return (<AbsoluteFill>
    <div style={{ position: "absolute", left: 50, top: 44, padding: "16px 26px 20px", background: "rgba(20,17,13,0.86)", borderRadius: 20, transform: `translateX(${(1 - s) * -480 - out * 520}px)` }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 44, color: "#fff", marginBottom: 12, letterSpacing: 1 }}>{label.toUpperCase()} {n} / {N}</div>
      <div style={{ display: "flex", gap: 8 }}>{Array.from({ length: N }, (_, i) => <div key={i} style={{ width: 30, height: 14, borderRadius: 4, background: i < n ? "#E0533F" : "rgba(255,255,255,0.22)", transform: i === n - 1 ? `scaleY(${1 + 0.6 * Math.max(0, 1 - f / 14)})` : undefined }} />)}</div>
    </div></AbsoluteFill>);
};
