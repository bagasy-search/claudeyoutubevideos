// suengano v10 · edición a mano (Claude, 12-oct-2026). Voz maestra única public/v10/voz.wav (948,571 s, sin la repetición).
// Tiempos: segundos ABSOLUTOS de la voz v10 (words_v10.json). Material real primero (public/px = Pexels, public/v10/arc = archivo),
// cámara motivada hacia un punto medido, beats sobre la palabra (±0,1 s), capas: plato → marca/chip → grade → grano.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { fr, cl, ez, eo, sp, RK, LABEL_SANS, PRICE, STAMP, HAND, Grain } from "../repkit/Rk";
import { Stamp, CountCard, BeforeAfter, OfferPoster, ShelfHeights, ShelfTag, PerKilo, Ticket, Scanner, Clipboard, Cta, CommentQ } from "../repkit/Kit";
import { Mark } from "../repkit/Rk";

const REEL = staticFile("avatar/suengano_reel0_cfr.mp4");
// ventanas del avatar en la línea de tiempo final (= v10 antes de 506,625): [inicio, fin, segundo del reel]
const AVW: [number, number, number][] = [
  [23.70, 34.94, 13.236], [57.20, 66.89, 24.466], [115.41, 124.97, 34.146], [154.12, 164.66, 43.696], [195.75, 216.22, 54.221],
  [253.33, 267.57, 74.673], [293.87, 306.79, 88.9], [332.61, 353.24, 101.803], [398.63, 409.05, 122.318], [434.57, 448.17, 132.726],
  [483.07, 502.45, 146.31],
  // después del corte de la repetición (506,625-512,443): tiempos v10 = final − 5,818
  [539.452, 548.352, 165.676], [578.782, 589.502, 174.566], [628.052, 647.972, 185.271], [693.832, 704.552, 205.175],
  [736.592, 745.932, 215.885], [777.062, 798.372, 225.21], [840.652, 851.012, 246.404], [878.192, 925.632, 256.735],
  [934.032, 948.571, 304.144],
];
const reelAt = (t: number) => { const w = AVW.find((x) => t >= x[0] - 0.05 && t <= x[1] + 0.05); if (!w) throw new Error("sin AV en " + t); return w[2] + (t - w[0]); };

// ── un plano ──
type P = {
  a: number; b: number;
  k: "px" | "img" | "av" | "arc" | "ap"; src?: string; ofs?: number; rate?: number;
  z?: [number, number]; o?: [number, number]; // escala ini/fin y foco (% del cuadro) — la cámara empuja hacia o
  dx?: number; dy?: number; old?: boolean; // deriva px, look de recuerdo
};
const Cover: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
const Plate: React.FC<{ p: P }> = ({ p }) => {
  const f = useCurrentFrame();
  const T = fr(p.b - p.a);
  const u = ez(f / Math.max(1, T));
  const [z0, z1] = p.z || [1.03, 1.1];
  const s = z0 + (z1 - z0) * u;
  const [ox, oy] = p.o || [50, 50];
  const tx = (p.dx || 0) * (u - 0.5), ty = (p.dy || 0) * (u - 0.5);
  let media: React.ReactNode;
  if (p.k === "av") media = <OffthreadVideo src={REEL} startFrom={fr(reelAt(p.a))} muted style={Cover} />;
  else if (p.k === "ap") media = <OffthreadVideo src={staticFile("root/apertura.mp4")} muted style={Cover} />;
  else if (p.k === "img") media = <Img src={staticFile(`v10/img/${p.src}.png`)} style={Cover} />;
  else media = <OffthreadVideo src={staticFile(p.k === "px" ? `px/${p.src}.mp4` : `v10/arc/${p.src}.mp4`)} startFrom={fr(p.ofs || 0)} playbackRate={p.rate || 1} muted style={Cover} />;
  const flick = p.old ? 0.04 * Math.sin(f * 1.7) * Math.sin(f * 0.31) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: `${ox}% ${oy}%`,
        filter: p.old ? `sepia(0.38) saturate(0.72) contrast(0.94) brightness(${0.97 + flick})` : undefined }}>{media}</AbsoluteFill>
      {p.k !== "av" && p.k !== "ap" ? <Look old={p.old} /> : null}
    </AbsoluteFill>
  );
};
const Look: React.FC<{ old?: boolean }> = ({ old }) => (
  <>
    <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) ${old ? 46 : 58}%, rgba(10,8,6,${old ? 0.55 : 0.28}) 100%)` }} />
    <Grain o={old ? 0.2 : 0.07} />
  </>
);
const Shots: React.FC<{ list: P[] }> = ({ list }) => (
  <>{list.map((p, i) => <Sequence key={i} from={fr(p.a)} durationInFrames={fr(p.b) - fr(p.a)}><Plate p={p} /></Sequence>)}</>
);

// ── capas de texto (viven sobre los planos, tiempo absoluto) ──
const At: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => (
  <Sequence from={fr(a)} durationInFrames={fr(b) - fr(a)} layout="none">{children}</Sequence>
);
const useF = () => useCurrentFrame();
// chip de etiqueta: entra con resorte en `t` (absoluto), sale en el último 0,25 s
const Tag: React.FC<{ a: number; b: number; t: number; txt: string; x: number; y: number; bg?: string; color?: string; size?: number; rot?: number; sub?: string }> =
  ({ a, b, t, txt, x, y, bg = "#FFFDF4", color = RK.ink, size = 58, rot = -2, sub }) => (
    <At a={a} b={b}><TagIn a={a} b={b} t={t} txt={txt} x={x} y={y} bg={bg} color={color} size={size} rot={rot} sub={sub} /></At>
  );
const TagIn: React.FC<{ a: number; b: number; t: number; txt: string; x: number; y: number; bg: string; color: string; size: number; rot: number; sub?: string }> = (p) => {
  const f = useF();
  const on = sp(f, fr(p.t - p.a), 12, 170);
  const off = cl((fr(p.b - p.a) - f) / 7);
  return (
    <div style={{ position: "absolute", left: p.x, top: p.y, transform: `rotate(${p.rot}deg) scale(${0.7 + 0.3 * on})`, transformOrigin: "0 50%", opacity: Math.min(cl(on * 2), off) }}>
      <div style={{ display: "inline-block", background: p.bg, color: p.color, fontFamily: LABEL_SANS, fontWeight: 800, fontSize: p.size, letterSpacing: 3, textTransform: "uppercase",
        padding: `${p.size * 0.18}px ${p.size * 0.45}px`, borderRadius: 6, boxShadow: "0 16px 34px rgba(0,0,0,0.38)", whiteSpace: "nowrap" }}>{p.txt}</div>
      {p.sub ? <div style={{ marginTop: 14, marginLeft: 8, fontFamily: LABEL_SANS, fontWeight: 700, fontSize: p.size * 0.6, color: "#fff", textShadow: "0 4px 16px rgba(0,0,0,0.8)", opacity: cl((f - fr(p.t - p.a) - 8) / 8) }}>{p.sub}</div> : null}
    </div>
  );
};
// súper de nombre (abajo a la izquierda, barra verde delantal)
const NameSuper: React.FC<{ a: number; b: number; t: number }> = ({ a, b, t }) => (
  <At a={a} b={b}><NameIn a={a} b={b} t={t} /></At>
);
const NameIn: React.FC<{ a: number; b: number; t: number }> = ({ a, b, t }) => {
  const f = useF(), u = eo((f - fr(t - a)) / 12), off = cl((fr(b - a) - f) / 8);
  return (
    <div style={{ position: "absolute", left: 110, bottom: 120, opacity: off }}>
      <div style={{ width: 640 * u, height: 8, background: RK.offer, marginBottom: 14 }} />
      <div style={{ overflow: "hidden" }}>
        <div style={{ transform: `translateY(${(1 - u) * 110}%)`, fontFamily: LABEL_SANS, fontWeight: 800, fontSize: 96, color: "#fff", letterSpacing: 4, textShadow: "0 6px 24px rgba(0,0,0,0.7)" }}>CLAUDIO</div>
      </div>
      <div style={{ opacity: cl((f - fr(t - a) - 10) / 10), fontFamily: LABEL_SANS, fontWeight: 700, fontSize: 44, color: "#fff", letterSpacing: 2, textShadow: "0 4px 18px rgba(0,0,0,0.8)" }}>30 AÑOS DETRÁS DE LA GÓNDOLA</div>
    </div>
  );
};
// cita escrita a mano (Don Ramón)
const Quote: React.FC<{ a: number; b: number; t: number; txt: string; x: number; y: number }> = ({ a, b, t, txt, x, y }) => (
  <At a={a} b={b}><QuoteIn a={a} b={b} t={t} txt={txt} x={x} y={y} /></At>
);
const QuoteIn: React.FC<{ a: number; b: number; t: number; txt: string; x: number; y: number }> = (p) => {
  const f = useF(), n = Math.round(p.txt.length * cl((f - fr(p.t - p.a)) / 26));
  return (
    <div style={{ position: "absolute", left: p.x, top: p.y, maxWidth: 900, fontFamily: HAND, fontSize: 104, lineHeight: 1.05, color: "#FFF6DC",
      textShadow: "0 6px 26px rgba(0,0,0,0.85)", transform: "rotate(-3deg)" }}>{p.txt.slice(0, n)}</div>
  );
};

// ── mapa cenital: el camino que arma el súper (maqueta vista desde arriba) ──
// puntos en coordenadas del lienzo 1920×1080 (la foto 1536×1024 cubre: x·1,25, y·1,25−100)
const MP = (x: number, y: number) => ({ x: x * 1920, y: y * 1280 - 100 });
const ROUTE = [MP(0.215, 0.80), MP(0.19, 0.70), MP(0.19, 0.42), MP(0.30, 0.385), MP(0.78, 0.385), MP(0.78, 0.22), MP(0.42, 0.19)];
const STOPS = [
  { i: 0, txt: "ENTRADA", t: 37.68, dx: 40, dy: -80 },
  { i: 2, txt: "FRUTA", t: 42.0, dx: 40, dy: 10 },
  { i: 4, txt: "PASILLO DEL MEDIO", t: 44.3, dx: -560, dy: 30 },
  { i: 6, txt: "LECHE", t: 48.2, dx: -60, dy: -110 },
];
const segLen = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(b.x - a.x, b.y - a.y);
const TOTAL = ROUTE.slice(1).reduce((s, p, i) => s + segLen(ROUTE[i], p), 0);
// fracción del camino recorrida en el segundo t (claves: puerta 37,7 → fruta 42,3 → medio 45,0 → leche 48,5)
const KEYS: [number, number][] = [[38.0, 0], [42.3, 0.3], [45.0, 0.68], [48.5, 1]];
const progress = (t: number) => { if (t <= KEYS[0][0]) return 0; for (let i = 1; i < KEYS.length; i++) if (t <= KEYS[i][0]) { const [t0, v0] = KEYS[i - 1], [t1, v1] = KEYS[i]; return v0 + (v1 - v0) * ez((t - t0) / (t1 - t0)); } return 1; };
const pointAt = (u: number) => { let d = u * TOTAL; for (let i = 1; i < ROUTE.length; i++) { const l = segLen(ROUTE[i - 1], ROUTE[i]); if (d <= l) { const k = d / l; return { x: ROUTE[i - 1].x + (ROUTE[i].x - ROUTE[i - 1].x) * k, y: ROUTE[i - 1].y + (ROUTE[i].y - ROUTE[i - 1].y) * k }; } d -= l; } return ROUTE[ROUTE.length - 1]; };
const MapPlate: React.FC<{ a: number; b: number; pins?: number; tPins?: number }> = ({ a, b, pins = 0, tPins = 0 }) => {
  const f = useF(), t = a + f / 30;
  const u = progress(t), head = pointAt(u);
  // cámara: baja desde arriba (35,1) y sigue la punta del camino con aire
  const desc = ez((t - a) / 2.2);
  const sBase = pins ? 1.0 + 0.04 * ez((t - a) / (b - a)) : 1.0 + 0.14 * desc;
  const cx = pins ? 960 : 960 + (head.x - 960) * 0.2 * desc, cy = pins ? 540 : 540 + (head.y - 540) * 0.2 * desc;
  const d = ROUTE.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ");
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#111" }}>
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${960 - cx * sBase}px, ${540 - cy * sBase}px) scale(${sBase})` }}>
        <Img src={staticFile("v10/img/plano.png")} style={{ position: "absolute", left: 0, top: -100, width: 1920, height: 1280 }} />
        <AbsoluteFill style={{ background: "rgba(10,12,20,0.18)" }} />
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path d={d} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} transform="translate(4,6)" />
          <path d={d} fill="none" stroke={RK.price} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} />
          {u > 0.01 && u < 0.999 ? <circle cx={head.x} cy={head.y} r={18 + 3 * Math.sin(f / 3)} fill="#fff" stroke={RK.price} strokeWidth={8} /> : null}
          {Array.from({ length: pins }, (_, i) => {
            const pu = (i + 0.5) / pins, pt = pointAt(pu), on = sp(f, fr(tPins - a) + i * 3, 9, 220);
            return (
              <g key={i} transform={`translate(${pt.x} ${pt.y}) scale(${on})`}>
                <circle r={30} fill={RK.offer} stroke="#1b1b1b" strokeWidth={4} />
                <text y={11} textAnchor="middle" fontFamily={PRICE} fontWeight={700} fontSize={32} fill="#1b1b1b">{17 - i}</text>
              </g>
            );
          })}
        </svg>
        {!pins ? STOPS.map((s) => {
          const p = ROUTE[s.i], on = sp(f, fr(s.t - a), 12, 170);
          return f >= fr(s.t - a) - 2 ? (
            <div key={s.txt} style={{ position: "absolute", left: p.x + s.dx, top: p.y + s.dy, transform: `scale(${on / sBase})`, transformOrigin: "0 0" }}>
              <div style={{ background: "#FFFDF4", color: RK.ink, fontFamily: LABEL_SANS, fontWeight: 800, fontSize: 48, letterSpacing: 3, padding: "8px 22px", borderRadius: 6, boxShadow: "0 12px 26px rgba(0,0,0,0.4)", whiteSpace: "nowrap" }}>{s.txt}</div>
            </div>
          ) : null;
        }) : null}
      </AbsoluteFill>
      {pins ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 80, textAlign: "center", opacity: cl((f - fr(tPins - a) - 30) / 10) }}>
          <span style={{ background: RK.price, color: "#fff", fontFamily: LABEL_SANS, fontWeight: 800, fontSize: 70, letterSpacing: 4, padding: "12px 40px", borderRadius: 6 }}>17 TRAMPAS EN EL CAMINO</span>
        </div>
      ) : null}
      <Look />
    </AbsoluteFill>
  );
};

// ── cuenta regresiva 17 → 1 sobre el pasillo ──
const Countdown: React.FC<{ a: number; b: number; t0: number; t1: number }> = ({ a, b, t0, t1 }) => (
  <At a={a} b={b}><CountIn a={a} t0={t0} t1={t1} /></At>
);
const CountIn: React.FC<{ a: number; t0: number; t1: number }> = ({ a, t0, t1 }) => {
  const f = useF(), t = a + f / 30;
  const u = cl((t - t0) / (t1 - t0));
  const n = Math.max(1, 17 - Math.floor(eo(u) * 16.999));
  const pop = sp(f, fr(t0 - a), 10, 180);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.35), rgba(0,0,0,0) 60%)" }}>
      <div style={{ transform: `scale(${pop})`, display: "flex", alignItems: "flex-end", gap: 18 }}>
        <div style={{ fontFamily: PRICE, fontWeight: 700, fontSize: 420, lineHeight: 0.8, color: n === 1 ? RK.offer : "#fff", textShadow: "0 16px 50px rgba(0,0,0,0.7)", minWidth: 470, textAlign: "right" }}>{n}</div>
        <div style={{ fontFamily: LABEL_SANS, fontWeight: 800, fontSize: 70, color: "#fff", letterSpacing: 4, paddingBottom: 20, textShadow: "0 6px 24px rgba(0,0,0,0.7)" }}>{n === 1 ? "EL QUE MÁS CUESTA" : "ENGAÑOS"}</div>
      </div>
    </AbsoluteFill>
  );
};

// ── flecha "todo al frente" sobre la góndola de costado ──
const PushArrows: React.FC<{ a: number; b: number; t: number }> = ({ a, b, t }) => (
  <At a={a} b={b}><PushIn a={a} t={t} /></At>
);
const PushIn: React.FC<{ a: number; t: number }> = ({ a, t }) => {
  const f = useF();
  return (
    <AbsoluteFill>
      {[0, 1, 2].map((i) => {
        const u = eo((f - fr(t - a) - i * 4) / 14);
        return u > 0 ? (
          <svg key={i} width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
            <path d={`M ${1500} ${300 + i * 210} L ${1500 - 380 * u} ${300 + i * 210}`} stroke={RK.offer} strokeWidth={14} strokeLinecap="round" />
            {u > 0.6 ? <path d={`M ${1500 - 380 * u + 34} ${300 + i * 210 - 30} L ${1500 - 380 * u} ${300 + i * 210} L ${1500 - 380 * u + 34} ${300 + i * 210 + 30}`} fill="none" stroke={RK.offer} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" /> : null}
          </svg>
        ) : null;
      })}
    </AbsoluteFill>
  );
};
// sello de goma que cae en `t`
const StampDrop: React.FC<{ a: number; b: number; t: number; label: string; x: number; y: number; size?: number; color?: string; rot?: number }> = (p) => (
  <At a={p.a} b={p.b}><StampIn {...p} /></At>
);
const StampIn: React.FC<{ a: number; t: number; label: string; x: number; y: number; size?: number; color?: string; rot?: number }> = (p) => {
  const f = useF(), k = f - fr(p.t - p.a);
  if (k < 0) return null;
  const s = 1 + 1.4 * (1 - eo(k / 6));
  return (
    <div style={{ position: "absolute", left: p.x, top: p.y, transform: `translate(-50%,-50%) scale(${s})`, opacity: cl(k / 3) }}>
      <div style={{ background: "rgba(255,253,244,0.9)", padding: 10, borderRadius: 6 }}><Stamp label={p.label} size={p.size || 110} color={p.color || RK.price} rot={p.rot ?? -6} /></div>
    </div>
  );
};

// ═════════════ MINUTO 1 (0 – 115,41) ═════════════
const MIN1: P[] = [
  { a: 0, b: 11.18, k: "ap" },
  // "Soy Claudio": el avatar del gancho viejo (cuadros 27,08-28,00 del edl) y foto de Claudio en la fruta
  { a: 11.18, b: 13.45, k: "img", src: "L689", z: [1.04, 1.12], o: [30, 40] },
  { a: 13.45, b: 15.96, k: "img", src: "N097_gondola", old: true, z: [1.04, 1.14], o: [62, 25] },                 // repositor a los 16
  { a: 15.96, b: 17.54, k: "px", src: "8421359", ofs: 2.0, z: [1.06, 1.14], o: [50, 55] },                    // cajero
  { a: 17.54, b: 19.22, k: "px", src: "8420784", ofs: 2.5, z: [1.04, 1.12], o: [50, 30] },                    // encargado de sección
  { a: 19.22, b: 20.40, k: "px", src: "37326360", ofs: 6.0, z: [1.05, 1.12], o: [40, 60] },                   // fiambrería
  { a: 20.40, b: 21.40, k: "px", src: "855237", ofs: 4.0, z: [1.04, 1.1], o: [50, 40] },                      // carnicería
  { a: 21.40, b: 23.70, k: "px", src: "4281235", ofs: 0.6, z: [1.02, 1.1], o: [45, 45] },                     // depósito de atrás
  { a: 23.70, b: 30.98, k: "av" },
  { a: 30.98, b: 35.10, k: "px", src: "29376327", ofs: 0.5, z: [1.0, 1.08], o: [50, 55] },                    // antes de entrar con el carrito
  // 35,10-45,30 mapa (componente) · 45,30-49,12 la leche al fondo · 49,12-52,18 mapa con 17 pines
  { a: 45.30, b: 49.12, k: "px", src: "3735225", ofs: 0.3, z: [1.02, 1.1], o: [55, 50] },
  { a: 52.18, b: 57.20, k: "px", src: "39240106", ofs: 14.5, z: [1.0, 1.06], o: [50, 50] },                  // pasillo + cuenta 17→1
  { a: 57.20, b: 66.89, k: "av" },
  // recuerdo: primera noche (look viejo)
  { a: 66.89, b: 69.90, k: "arc", src: "vista_a", old: true, z: [1.04, 1.1], o: [50, 50] },
  { a: 69.90, b: 72.78, k: "arc", src: "vista_b", old: true, z: [1.04, 1.1], o: [50, 50] },
  { a: 72.78, b: 77.42, k: "img", src: "carrito_noche", old: true, z: [1.0, 1.16], o: [52, 62] },             // carrito lleno de cajas
  { a: 77.42, b: 80.18, k: "img", src: "reposicion_b", old: true, z: [1.02, 1.14], o: [50, 40] },             // lo nuevo detrás de lo viejo
  { a: 80.18, b: 88.38, k: "img", src: "ramon", old: true, z: [1.0, 1.0], o: [58, 30] },                      // Don Ramón (cámara propia abajo)
  { a: 88.38, b: 93.68, k: "img", src: "N108", old: true, z: [1.02, 1.14], o: [45, 35] },                     // "muchacho, todo al frente" · yo no entendía
  { a: 93.68, b: 97.70, k: "img", src: "gondola_lado", old: true, z: [1.0, 1.08], o: [70, 45] },              // correr lo de atrás al borde
  { a: 97.70, b: 102.08, k: "px", src: "29376327", ofs: 6.0, rate: 0.6, z: [1.06, 1.14], o: [30, 45] },       // parece llena · FRENTEAR
  // 102,08-106,50 BeforeAfter
  { a: 106.50, b: 111.10, k: "px", src: "29068393", ofs: 1.0, z: [1.02, 1.1], o: [50, 50] },                 // el primer engaño
];

// Don Ramón: empuje motivado a la cara (bigote 84,1) y después a la planilla (86,6)
const RamonCam: React.FC = () => {
  const f = useF(), t = 80.18 + f / 30;
  const k1 = ez((t - 83.4) / 1.4), k2 = ez((t - 86.0) / 1.2);
  const s = 1.0 + 0.4 * k1 - 0.05 * k2, ox = 58 - 4 * k2, oy = 8 + 60 * k2;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${ox}% ${oy}%`, filter: "sepia(0.38) saturate(0.72) contrast(0.94)" }}>
        <Img src={staticFile("v10/img/ramon.png")} style={Cover} />
      </AbsoluteFill>
      <Look old />
    </AbsoluteFill>
  );
};

export const V10Min1: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile("v10/voz.wav")} />
    <Min1Layers />
  </AbsoluteFill>
);
const Min1Layers: React.FC = () => (
  <>
    <Shots list={MIN1} />
    <NameSuper a={11.25} b={13.45} t={11.35} />
    <Tag a={13.6} b={15.96} t={13.72} txt="REPOSITOR · 16 AÑOS" x={110} y={110} />
    <Tag a={15.96} b={17.54} t={16.2} txt="CAJERO" x={110} y={110} />
    <Tag a={17.54} b={19.22} t={17.6} txt="ENCARGADO DE SECCIÓN" x={110} y={110} />
    <Tag a={19.22} b={20.40} t={19.36} txt="FIAMBRERÍA" x={110} y={110} bg={RK.offer} />
    <Tag a={20.40} b={21.40} t={20.45} txt="CARNICERÍA" x={110} y={110} bg={RK.offer} />
    <Tag a={21.40} b={23.70} t={21.68} txt="EL DEPÓSITO DE ATRÁS" x={110} y={110} bg={RK.offer} />
    <Sequence from={fr(35.10)} durationInFrames={fr(45.30) - fr(35.10)}><MapPlate a={35.10} b={45.30} /></Sequence>
    <Tag a={45.30} b={49.12} t={48.4} txt="LA LECHE, SIEMPRE AL FONDO" x={110} y={860} bg={RK.price} color="#fff" />
    <Sequence from={fr(49.12)} durationInFrames={fr(52.18) - fr(49.12)}><MapPlate a={49.12} b={52.18} pins={17} tPins={49.2} /></Sequence>
    <Countdown a={52.18} b={57.20} t0={53.5} t1={57.2} />
    <Tag a={61.7} b={66.89} t={63.9} txt="EL SÚPER CON OTROS OJOS" x={110} y={110} bg={RK.offer} />
    {/* recuerdo */}
    <Tag a={67.0} b={72.78} t={69.0} txt="MI PRIMERA NOCHE · 16 AÑOS" x={110} y={110} />
    <Tag a={77.42} b={80.18} t={78.44} txt="LO NUEVO, DETRÁS" x={110} y={860} bg={RK.offer} />
    <Sequence from={fr(80.18)} durationInFrames={fr(88.38) - fr(80.18)}><RamonCam /></Sequence>
    <Tag a={80.18} b={88.38} t={80.8} txt="DON RAMÓN" sub="el encargado" x={110} y={110} />
    <Quote a={88.38} b={92.48} t={90.3} txt="«Muchacho, todo al frente.»" x={980} y={720} />
    <PushArrows a={93.68} b={97.70} t={94.9} />
    <Tag a={93.68} b={97.70} t={96.0} txt="ATRÁS: VACÍO" x={1240} y={860} bg={RK.price} color="#fff" />
    <StampDrop a={97.70} b={102.08} t={100.62} label="FRENTEAR" x={960} y={540} />
    <Tag a={97.70} b={102.08} t={98.9} txt="PARECE LLENA" x={110} y={110} bg={RK.offer} />
    <BeforeAfter from={102.08} dur={4.42} a="v10/img/gondola_lado.png" b="px_still/29376327.png" tWipe={104.6} labels={["LO QUE HAY", "LO QUE VES"]} />
    <Tag a={106.5} b={111.1} t={107.8} txt="EL PRIMER ENGAÑO" x={110} y={860} bg={RK.price} color="#fff" size={70} />
    <CountCard from={111.10} dur={4.31} n={17} of={17} word="ENGAÑO" title="La música del súper" bg="px_still/9945020.png" t={111.5} />
  </>
);

// ═════════════ 115,41 – 948,57: los 16 engaños restantes, CTA, repaso y cierre ═════════════

// "¿CÓMO LO ESQUIVAS?" — chip rojo arriba a la izquierda desde la frase hasta los "Diez segundos"
const Esq: React.FC<{ t: number; b: number }> = ({ t, b }) => (
  <Tag a={t - 0.1} b={b} t={t} txt="¿CÓMO LO ESQUIVAS?" x={110} y={100} bg={RK.price} color="#fff" size={56} rot={-2} />
);
// "DIEZ SEGUNDOS": anillo que se vacía en 10 s + el consejo escrito
const Diez: React.FC<{ t: number; b: number; tip: string }> = ({ t, b, tip }) => (
  <At a={t} b={b}><DiezIn t={t} b={b} tip={tip} /></At>
);
const DiezIn: React.FC<{ t: number; b: number; tip: string }> = ({ t, b, tip }) => {
  const f = useF(), on = sp(f, 0, 12, 160), off = cl((fr(b - t) - f) / 8);
  const left = Math.max(0, 10 - f / 30), u = left / 10, R = 74, C = 2 * Math.PI * R;
  return (
    <div style={{ position: "absolute", right: 110, bottom: 110, display: "flex", alignItems: "center", gap: 30, opacity: Math.min(on, off), transform: `translateY(${(1 - on) * 60}px)` }}>
      <div style={{ maxWidth: 820, textAlign: "right", fontFamily: LABEL_SANS, fontWeight: 800, fontSize: 60, lineHeight: 1.08, color: "#fff", textShadow: "0 6px 24px rgba(0,0,0,0.85)", textTransform: "uppercase", opacity: cl((f - 8) / 10) }}>{tip}</div>
      <div style={{ position: "relative", width: 190, height: 190, flexShrink: 0, background: "rgba(15,15,15,0.72)", borderRadius: "50%", boxShadow: "0 14px 34px rgba(0,0,0,0.45)" }}>
        <svg width={190} height={190} style={{ position: "absolute", left: 0, top: 0 }}>
          <circle cx={95} cy={95} r={R} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={14} />
          <circle cx={95} cy={95} r={R} fill="none" stroke={RK.offer} strokeWidth={14} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - u)} transform="rotate(-90 95 95)" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff" }}>
          <div style={{ fontFamily: PRICE, fontWeight: 700, fontSize: 80, lineHeight: 0.9 }}>{Math.ceil(left)}</div>
          <div style={{ fontFamily: LABEL_SANS, fontWeight: 800, fontSize: 22, letterSpacing: 3 }}>SEGUNDOS</div>
        </div>
      </div>
    </div>
  );
};
// tarjeta del engaño: número + título (bg = foto del tema)
const Num: React.FC<{ a: number; b: number; n: number; title: string; bg: string; t?: number }> = ({ a, b, n, title, bg, t }) => (
  <CountCard from={a} dur={b - a} n={n} of={17} word="ENGAÑO" title={title} bg={bg} t={t ?? a + 0.25} />
);
// punta vs adentro: dos precios iguales
const PriceVs: React.FC<{ a: number; b: number; t: number }> = ({ a, b, t }) => (
  <At a={a} b={b}><PriceVsIn a={a} t={t} /></At>
);
const PriceVsIn: React.FC<{ a: number; t: number }> = ({ a, t }) => {
  const f = useF(), k = fr(t - a);
  const card = (lbl: string, i: number) => {
    const on = sp(f, k + i * 8, 11, 170);
    return (
      <div style={{ transform: `scale(${on}) rotate(${i ? 2 : -2}deg)`, background: RK.shelf, borderRadius: 10, padding: "26px 44px", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", textAlign: "center", minWidth: 470 }}>
        <div style={{ fontFamily: LABEL_SANS, fontWeight: 800, fontSize: 46, letterSpacing: 4, color: RK.ink }}>{lbl}</div>
        <div style={{ fontFamily: PRICE, fontWeight: 700, fontSize: 150, color: RK.price, lineHeight: 1 }}>$ 1.890</div>
      </div>
    );
  };
  const eq = sp(f, k + 22, 10, 200);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", background: "rgba(0,0,0,0.38)" }}>
      {card("EN LA PUNTA", 0)}
      <div style={{ fontFamily: PRICE, fontWeight: 700, fontSize: 200, color: "#fff", margin: "0 40px", transform: `scale(${eq})`, textShadow: "0 10px 30px rgba(0,0,0,0.6)" }}>=</div>
      {card("ADENTRO", 1)}
    </AbsoluteFill>
  );
};
// 2.999 → 3.000 (redondeá vos)
const Round: React.FC<{ a: number; b: number; t: number }> = ({ a, b, t }) => (
  <At a={a} b={b}><RoundIn a={a} t={t} /></At>
);
const RoundIn: React.FC<{ a: number; t: number }> = ({ a, t }) => {
  const f = useF(), k = f - fr(t - a), u = eo(k / 10);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.35)" }}>
      <div style={{ position: "relative", background: RK.shelf, borderRadius: 12, padding: "30px 70px", boxShadow: "0 40px 80px rgba(0,0,0,0.55)", transform: `scale(${sp(f, 2, 12, 150)})` }}>
        <div style={{ fontFamily: PRICE, fontWeight: 700, fontSize: 260, lineHeight: 1, color: RK.price, opacity: 1 - u, transform: `translateY(${-u * 60}px)` }}>$ 2.999</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontFamily: PRICE, fontWeight: 700, fontSize: 260, lineHeight: 1, color: RK.ink, opacity: u, transform: `translateY(${(1 - u) * 60}px)` }}>$ 3.000</div>
      </div>
      <div style={{ marginTop: 50, fontFamily: LABEL_SANS, fontWeight: 800, fontSize: 64, letterSpacing: 4, color: "#fff", textShadow: "0 6px 24px rgba(0,0,0,0.8)", opacity: cl((k - 12) / 10) }}>REDONDEÁ VOS</div>
    </AbsoluteFill>
  );
};
// misma caja, menos producto: dos cajas iguales, el peso cambia
const TwoBoxes: React.FC<{ a: number; b: number; tA: number; tB: number; tStrike: number }> = (p) => (
  <At a={p.a} b={p.b}><TwoBoxesIn {...p} /></At>
);
const TwoBoxesIn: React.FC<{ a: number; tA: number; tB: number; tStrike: number }> = ({ a, tA, tB, tStrike }) => {
  const f = useF(), T = (t: number) => fr(t - a);
  const box = (lbl: string, w: string, tt: number, i: number) => {
    const on = sp(f, T(tt), 12, 160);
    return (
      <div style={{ position: "relative", width: 560, transform: `translateY(${(1 - on) * 80}px) rotate(${i ? 2 : -2}deg)`, opacity: cl(on * 2) }}>
        <div style={{ background: "#FFFDF8", padding: "14px 14px 18px", boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }}>
          <div style={{ width: 532, height: 560, overflow: "hidden" }}><Img src={staticFile("v10/img/caja_cereal.png")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 40%" }} /></div>
        </div>
        <div style={{ position: "absolute", left: 30, top: -60 }}><span style={{ background: i ? RK.price : RK.shelf, color: i ? "#fff" : RK.ink, fontFamily: LABEL_SANS, fontWeight: 800, fontSize: 48, letterSpacing: 3, padding: "8px 24px", borderRadius: 6 }}>{lbl}</span></div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center" }}>
          <span style={{ background: "#fff", fontFamily: PRICE, fontWeight: 700, fontSize: 96, color: RK.ink, padding: "0 30px", boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }}>{w}</span>
        </div>
      </div>
    );
  };
  const st = eo((f - T(tStrike)) / 10);
  return (
    <AbsoluteFill style={{ background: "#1b1712", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 120 }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(255,236,200,0.25), rgba(0,0,0,0) 60%)" }} />
      {box("ANTES", "500 g", tA, 0)}
      <div style={{ position: "relative" }}>
        {box("AHORA", f >= T(tStrike) ? "450 g" : "500 g", tB, 1)}
        {st > 0 ? <div style={{ position: "absolute", right: -30, top: -150, transform: `scale(${st})`, fontFamily: PRICE, fontWeight: 700, fontSize: 110, color: RK.price, textShadow: "0 6px 20px rgba(0,0,0,0.6)" }}>−50 g</div> : null}
      </div>
      <Grain o={0.07} />
    </AbsoluteFill>
  );
};
// repaso: el mapa con los 17 pines; cada uno se enciende cuando lo nombra y su nombre aparece abajo
const RECAP: [number, string][] = [
  [900.6, "La música y el piso"], [902.7, "El pan en la entrada"], [904.2, "La leche al fondo"], [905.6, "El carrito grande"], [907.0, "Las puntas de góndola"],
  [908.6, "Lo caro a la altura de los ojos"], [910.4, "Lo de los chicos"], [911.6, "El 99"], [913.4, "Misma caja, menos producto"], [915.0, "El 2x1"],
  [916.2, "El precio por kilo"], [917.5, "La fruta mojada"], [918.8, "El cartel viejo"], [919.8, "Las golosinas"], [921.5, "La reposición"],
  [922.7, "El precio por pieza"], [924.0, "La etiqueta que no coincide"],
];
const RecapMap: React.FC<{ a: number; b: number }> = ({ a, b }) => (
  <Sequence from={fr(a)} durationInFrames={fr(b) - fr(a)}><RecapIn a={a} /></Sequence>
);
const RecapIn: React.FC<{ a: number }> = ({ a }) => {
  const f = useF(), t = a + f / 30;
  const cur = RECAP.reduce((m, r, i) => (t >= r[0] - 0.05 ? i : m), -1);
  const pt = cur >= 0 ? pointAt((cur + 0.5) / 17) : { x: 960, y: 540 };
  const k = ez((t - a) / 3), z = 1 + 0.18 * k;
  const cx = 960 + (pt.x - 960) * 0.3 * k, cy = 540 + (pt.y - 540) * 0.3 * k;
  const d = ROUTE.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ");
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#111" }}>
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${960 - cx * z}px, ${540 - cy * z}px) scale(${z})` }}>
        <Img src={staticFile("v10/img/plano.png")} style={{ position: "absolute", left: 0, top: -100, width: 1920, height: 1280 }} />
        <AbsoluteFill style={{ background: "rgba(10,12,20,0.3)" }} />
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path d={d} fill="none" stroke={RK.price} strokeOpacity={0.55} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
          {RECAP.map((r, i) => {
            const p = pointAt((i + 0.5) / 17), lit = t >= r[0] - 0.05, pop = lit ? sp(f, fr(r[0] - a), 9, 220) : 0;
            return (
              <g key={i} transform={`translate(${p.x} ${p.y}) scale(${0.8 + 0.35 * pop})`}>
                <circle r={30} fill={lit ? RK.offer : "#3a3a3a"} stroke={lit ? "#1b1b1b" : "#777"} strokeWidth={4} />
                <text y={11} textAnchor="middle" fontFamily={PRICE} fontWeight={700} fontSize={32} fill={lit ? "#1b1b1b" : "#aaa"}>{17 - i}</text>
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
      {cur >= 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: RK.shelf, color: RK.ink, fontFamily: LABEL_SANS, fontWeight: 800, fontSize: 72, letterSpacing: 2, padding: "10px 40px", borderRadius: 8, boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
            transform: `scale(${sp(f, fr(RECAP[cur][0] - a), 12, 200)})` }}>
            <span style={{ color: RK.price, marginRight: 22 }}>{17 - cur}</span>{RECAP[cur][1]}
          </span>
        </div>
      ) : (
        <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: LABEL_SANS, fontWeight: 800, fontSize: 70, letterSpacing: 4, color: "#fff", textShadow: "0 6px 24px rgba(0,0,0,0.8)" }}>DE 17 A 1, EN UNA RESPIRACIÓN</div>
      )}
      <Look />
    </AbsoluteFill>
  );
};
// círculo rojo dibujado sobre la foto (coordenadas del lienzo)
const Circle: React.FC<{ a: number; b: number; t: number; x: number; y: number; w: number; h: number; kind?: "circle" | "strike" | "under" }> = (p) => (
  <At a={p.a} b={p.b}><CircleIn {...p} /></At>
);
const CircleIn: React.FC<{ a: number; t: number; x: number; y: number; w: number; h: number; kind?: "circle" | "strike" | "under" }> = (p) => {
  const f = useF();
  return <AbsoluteFill><Mark kind={p.kind || "circle"} x={p.x} y={p.y} w={p.w} h={p.h} f={f} at={fr(p.t - p.a)} dur={10} color={RK.price} sw={12} /></AbsoluteFill>;
};

const REST: P[] = [
  // ── 17 · la música ──
  { a: 115.41, b: 124.97, k: "av" },
  { a: 124.97, b: 127.10, k: "px", src: "9945020", ofs: 1.0, z: [1.0, 1.08], o: [60, 40] },
  { a: 127.10, b: 128.90, k: "img", src: "parlante", z: [1.0, 1.12], o: [50, 45] },
  { a: 128.90, b: 134.60, k: "px", src: "29068393", ofs: 3.0, rate: 0.6, z: [1.0, 1.06], o: [50, 50] },
  { a: 134.60, b: 138.00, k: "px", src: "39240106", ofs: 19.6, z: [1.02, 1.08], o: [50, 50] },
  { a: 138.00, b: 141.30, k: "px", src: "33006235", ofs: 0.5, z: [1.0, 1.08], o: [60, 45] },
  { a: 141.30, b: 144.60, k: "px", src: "9945020", ofs: 5.0, z: [1.06, 1.14], o: [40, 60] },
  { a: 144.60, b: 149.80, k: "px", src: "35226314", ofs: 1.0, z: [1.0, 1.08], o: [50, 60] },
  { a: 149.80, b: 154.12, k: "px", src: "8420787", ofs: 3.0, z: [1.02, 1.1], o: [50, 35] },
  { a: 154.12, b: 164.66, k: "av" },
  // ── 16 · el pan en la entrada ──
  { a: 169.50, b: 171.80, k: "px", src: "6516822", ofs: 3.0, z: [1.02, 1.1], o: [50, 50] },
  { a: 171.80, b: 175.20, k: "px", src: "3119255", ofs: 4.0, z: [1.0, 1.08], o: [50, 50] },
  { a: 175.20, b: 180.10, k: "px", src: "28988753", ofs: 2.0, z: [1.0, 1.08], o: [50, 55] },
  { a: 180.10, b: 183.50, k: "px", src: "30557963", ofs: 0.3, z: [1.02, 1.1], o: [40, 40], old: true },
  { a: 183.50, b: 186.00, k: "px", src: "4186967", ofs: 6.0, z: [1.02, 1.1], o: [50, 60], old: true },
  { a: 186.00, b: 188.70, k: "px", src: "7405929", ofs: 2.0, z: [1.02, 1.1], o: [50, 50], old: true },
  { a: 188.70, b: 192.50, k: "px", src: "4121747", ofs: 5.0, z: [1.0, 1.06], o: [50, 40] },
  { a: 192.50, b: 195.75, k: "px", src: "7405923", ofs: 2.0, z: [1.02, 1.1], o: [50, 50] },
  { a: 195.75, b: 206.40, k: "av" },
  { a: 209.40, b: 216.22, k: "av" },
  // ── 15 · la leche al fondo ──
  { a: 216.22, b: 219.60, k: "px", src: "39238831", ofs: 12.5, z: [1.0, 1.06], o: [50, 50] },
  { a: 219.60, b: 223.70, k: "px", src: "3735225", ofs: 3.0, z: [1.04, 1.12], o: [55, 50] },
  { a: 232.30, b: 236.80, k: "px", src: "8420776", ofs: 2.0, z: [1.02, 1.1], o: [45, 40] },
  { a: 236.80, b: 241.36, k: "px", src: "4121744", ofs: 2.0, z: [1.0, 1.06], o: [50, 45] },
  // ── 14 · el carrito grande ──
  { a: 250.40, b: 253.33, k: "px", src: "854634", ofs: 4.0, z: [1.0, 1.1], o: [50, 50] },
  { a: 253.33, b: 261.00, k: "av" },
  { a: 261.00, b: 264.50, k: "px", src: "9010435", ofs: 10.0, z: [1.0, 1.08], o: [50, 55] },
  { a: 264.50, b: 267.57, k: "av" },
  { a: 267.57, b: 274.86, k: "px", src: "8420602", ofs: 2.0, z: [1.02, 1.1], o: [50, 60] },
  { a: 274.86, b: 283.96, k: "px", src: "9010435", ofs: 1.0, z: [1.0, 1.06], o: [50, 60] },
  // ── 13 · las puntas de góndola ──
  { a: 299.80, b: 306.79, k: "av" },
  { a: 306.79, b: 310.40, k: "img", src: "gondola_alturas", z: [1.06, 1.1], o: [50, 50] },
  { a: 310.40, b: 314.50, k: "px", src: "5103996", ofs: 3.0, z: [1.0, 1.08], o: [55, 35] },
  { a: 314.50, b: 318.92, k: "px", src: "5103999", ofs: 3.0, z: [1.0, 1.08], o: [55, 40] },
  { a: 318.92, b: 322.36, k: "img", src: "puntagondola", z: [1.08, 1.2], o: [50, 30] },
  // ── 12 · lo caro a la altura de los ojos ──
  { a: 338.30, b: 349.00, k: "av" },
  { a: 349.00, b: 353.38, k: "px", src: "8420777", ofs: 4.0, z: [1.02, 1.08], o: [55, 40] },
  { a: 353.38, b: 360.70, k: "img", src: "gondola_alturas", z: [1.0, 1.55], o: [50, 92] },
  // ── 11 · lo de los chicos (sin chicos en cuadro) ──
  { a: 365.60, b: 372.80, k: "img", src: "cereal_ninos", z: [1.0, 1.14], o: [50, 55] },
  { a: 372.80, b: 378.40, k: "px", src: "7033608", ofs: 4.0, z: [1.0, 1.06], o: [50, 50] },
  { a: 378.40, b: 384.20, k: "px", src: "4098420", ofs: 6.0, z: [1.04, 1.1], o: [50, 50], old: true },
  { a: 384.20, b: 389.40, k: "img", src: "L392", z: [1.02, 1.1], o: [55, 35] },
  { a: 389.40, b: 395.28, k: "img", src: "caja_cereal", z: [1.0, 1.12], o: [50, 45] },
  { a: 395.28, b: 398.63, k: "px", src: "8077529", ofs: 2.0, z: [1.0, 1.06], o: [50, 55] },
  // ── CTA 1 ──
  { a: 398.63, b: 402.50, k: "av" },
  // ── 10 · el 99 ──
  { a: 415.30, b: 425.70, k: "img", src: "precio_a", z: [1.0, 1.18], o: [35, 50] },
  { a: 425.70, b: 430.30, k: "px", src: "7710749", ofs: 2.0, z: [1.02, 1.1], o: [50, 50], old: true },
  { a: 430.30, b: 434.57, k: "px", src: "39240107", ofs: 1.0, z: [1.02, 1.08], o: [50, 50] },
  { a: 434.57, b: 448.17, k: "av" },
  { a: 448.17, b: 458.44, k: "img", src: "N145", z: [1.0, 1.06], o: [50, 50] },
  { a: 458.44, b: 463.52, k: "img", src: "caja_a", z: [1.0, 1.1], o: [45, 45] },
  // ── 9 · misma caja, menos producto ──
  { a: 466.70, b: 473.90, k: "img", src: "caja_cereal", z: [1.0, 1.1], o: [50, 40] },
  { a: 473.90, b: 478.00, k: "px", src: "5103999", ofs: 10.0, z: [1.02, 1.1], o: [55, 45] },
  { a: 478.00, b: 483.07, k: "img", src: "caja_cereal", z: [1.25, 1.6], o: [50, 82] },
  { a: 483.07, b: 484.80, k: "av" },
  { a: 491.90, b: 501.70, k: "av" },
  { a: 501.70, b: 506.86, k: "img", src: "L540", z: [1.02, 1.14], o: [52, 40] },
  { a: 506.86, b: 515.24, k: "px", src: "5100068", ofs: 3.0, z: [1.0, 1.08], o: [50, 40] },
  // ── 8 · el 2x1 ──
  { a: 531.30, b: 535.00, k: "px", src: "7710749", ofs: 12.0, z: [1.02, 1.1], o: [50, 50], old: true },
  { a: 535.00, b: 539.45, k: "img", src: "oferta_a", z: [1.02, 1.12], o: [60, 35], old: true },
  { a: 539.45, b: 548.35, k: "av" },
  { a: 548.35, b: 552.00, k: "img", src: "cafe_2x1", z: [1.0, 1.1], o: [50, 50] },
  { a: 552.00, b: 554.40, k: "px", src: "8420781", ofs: 2.0, z: [1.02, 1.08], o: [50, 40], old: true },
  { a: 554.40, b: 564.60, k: "img", src: "clienta_cafe", z: [1.0, 1.16], o: [50, 40], old: true },
  { a: 564.60, b: 569.50, k: "px", src: "8420787", ofs: 7.0, z: [1.04, 1.1], o: [50, 35], old: true },
  { a: 569.50, b: 574.70, k: "px", src: "8420786", ofs: 6.0, z: [1.02, 1.08], o: [50, 40], old: true },
  { a: 578.78, b: 585.14, k: "av" },
  // ── 7 · precio por unidad contra precio por kilo ──
  { a: 610.60, b: 613.80, k: "px", src: "6194507", ofs: 3.0, z: [1.02, 1.08], o: [50, 50], old: true },
  { a: 613.80, b: 618.60, k: "img", src: "etiqueta_estante", z: [1.1, 1.4], o: [50, 75], old: true },
  { a: 618.60, b: 622.10, k: "px", src: "5371527", ofs: 5.0, z: [1.02, 1.08], o: [50, 50], old: true },
  { a: 622.10, b: 628.05, k: "px", src: "5100068", ofs: 8.0, z: [1.04, 1.1], o: [50, 40] },
  { a: 628.05, b: 638.02, k: "av" },
  // ── 6 · la fruta mojada ──
  { a: 641.50, b: 645.00, k: "img", src: "fruta_rocio", z: [1.0, 1.12], o: [50, 50] },
  { a: 645.00, b: 648.10, k: "px", src: "9020663", ofs: 2.0, z: [1.02, 1.08], o: [50, 50] },
  { a: 648.10, b: 650.80, k: "px", src: "34988877", ofs: 1.0, z: [1.0, 1.08], o: [50, 50] },
  { a: 650.80, b: 656.10, k: "px", src: "2948582", ofs: 3.0, z: [1.02, 1.12], o: [50, 60] },
  { a: 656.10, b: 658.90, k: "px", src: "4366190", ofs: 3.0, z: [1.02, 1.08], o: [50, 50], old: true },
  { a: 658.90, b: 663.68, k: "img", src: "fruta_b", z: [1.02, 1.14], o: [50, 45], old: true },
  { a: 663.68, b: 669.70, k: "px", src: "4121714", ofs: 3.0, z: [1.02, 1.1], o: [50, 55] },
  { a: 669.70, b: 676.32, k: "px", src: "5100073", ofs: 2.0, z: [1.02, 1.1], o: [45, 45] },
  // ── 5 · el cartel viejo ──
  { a: 679.30, b: 684.70, k: "img", src: "cartel_viejo", z: [1.0, 1.15], o: [50, 45] },
  { a: 684.70, b: 690.70, k: "img", src: "cartel_blank", z: [1.02, 1.12], o: [50, 45], old: true },
  { a: 690.70, b: 693.83, k: "img", src: "oferta_a", z: [1.12, 1.2], o: [60, 35], old: true },
  { a: 693.83, b: 704.55, k: "av" },
  { a: 704.55, b: 708.00, k: "img", src: "etiqueta_estante", z: [1.0, 1.1], o: [50, 70] },
  { a: 708.00, b: 713.18, k: "px", src: "39238831", ofs: 17.0, z: [1.0, 1.06], o: [50, 50] },
  // ── 4 · las golosinas en la caja ──
  { a: 715.60, b: 717.70, k: "px", src: "7033618", ofs: 3.0, z: [1.04, 1.1], o: [50, 50] },
  { a: 717.70, b: 723.20, k: "img", src: "cinta_golosinas", z: [1.0, 1.12], o: [50, 60] },
  { a: 723.20, b: 729.60, k: "px", src: "7033608", ofs: 12.0, z: [1.02, 1.1], o: [50, 50] },
  { a: 729.60, b: 733.00, k: "px", src: "39240107", ofs: 4.0, z: [1.02, 1.08], o: [50, 50], old: true },
  { a: 733.00, b: 736.59, k: "img", src: "caja_a", z: [1.04, 1.12], o: [50, 50], old: true },
  { a: 736.59, b: 745.93, k: "av" },
  { a: 745.93, b: 750.96, k: "px", src: "39240107", ofs: 7.0, z: [1.04, 1.1], o: [45, 55] },
  // ── 3 · la reposición ──
  { a: 754.40, b: 758.10, k: "img", src: "N288", z: [1.0, 1.1], o: [50, 50] },
  { a: 758.10, b: 760.20, k: "img", src: "fondo_estante", z: [1.0, 1.08], o: [50, 50] },
  { a: 760.20, b: 763.60, k: "img", src: "camion_noche", z: [1.0, 1.1], o: [50, 50] },
  { a: 763.60, b: 767.60, k: "img", src: "frente_a", z: [1.0, 1.08], o: [50, 50] },
  { a: 767.60, b: 772.10, k: "img", src: "fondo_estante", z: [1.15, 1.4], o: [60, 35] },
  { a: 772.10, b: 777.06, k: "px", src: "33006235", ofs: 6.0, z: [1.02, 1.08], o: [55, 45] },
  { a: 777.06, b: 787.16, k: "av" },
  // ── 2 · el precio por pieza ──
  { a: 790.60, b: 798.37, k: "av" },
  { a: 798.37, b: 800.30, k: "img", src: "L839", z: [1.02, 1.08], o: [45, 40] },
  { a: 800.30, b: 805.70, k: "img", src: "queso_pieza", z: [1.0, 1.12], o: [45, 55] },
  { a: 805.70, b: 808.90, k: "px", src: "5240825", ofs: 1.0, z: [1.02, 1.08], o: [50, 50] },
  { a: 808.90, b: 811.40, k: "px", src: "3191886", ofs: 3.0, z: [1.02, 1.08], o: [50, 50] },
  { a: 811.40, b: 813.90, k: "px", src: "5488079", ofs: 3.0, z: [1.02, 1.08], o: [50, 50] },
  { a: 813.90, b: 817.70, k: "px", src: "30747264", ofs: 3.0, z: [1.0, 1.06], o: [50, 50] },
  { a: 817.70, b: 820.60, k: "px", src: "6658177", ofs: 4.0, z: [1.02, 1.08], o: [50, 50] },
  { a: 820.60, b: 826.46, k: "px", src: "2948582", ofs: 8.0, z: [1.02, 1.1], o: [50, 60] },
  { a: 826.46, b: 833.40, k: "img", src: "queso_pieza", z: [1.15, 1.3], o: [60, 60] },
  // ── 1 · la etiqueta que no coincide con la caja ──
  { a: 837.70, b: 840.65, k: "px", src: "29068393", ofs: 8.0, z: [1.0, 1.06], o: [50, 50] },
  { a: 840.65, b: 844.90, k: "av" },
  { a: 851.01, b: 855.10, k: "px", src: "8421359", ofs: 5.0, z: [1.02, 1.08], o: [50, 55] },
  { a: 855.10, b: 861.60, k: "img", src: "etiqueta_estante", z: [1.15, 1.3], o: [45, 55] },
  { a: 861.60, b: 866.60, k: "px", src: "9841387", ofs: 3.0, z: [1.02, 1.08], o: [50, 50] },
  { a: 866.60, b: 870.00, k: "px", src: "7546417", ofs: 0.5, z: [1.02, 1.08], o: [50, 50] },
  { a: 870.00, b: 872.50, k: "px", src: "28827282", ofs: 2.0, z: [1.02, 1.08], o: [50, 50] },
  { a: 872.50, b: 878.19, k: "img", src: "ticket_blank", z: [1.0, 1.1], o: [50, 50] },
  { a: 878.19, b: 879.60, k: "av" },
  { a: 889.00, b: 896.90, k: "av" },
  // ── despedida ──
  { a: 943.80, b: 948.571, k: "av" },
];

const RestLayers: React.FC = () => (
  <>
    <Shots list={REST} />
    {/* 17 */}
    <Tag a={125.0} b={127.1} t={125.2} txt="TODO INVITA A IR DESPACIO" x={110} y={860} />
    <Tag a={128.9} b={134.6} t={131.0} txt="+ TIEMPO ADENTRO = + COSAS EN EL CARRITO" x={110} y={860} bg={RK.offer} size={50} />
    <Tag a={134.6} b={138.0} t={135.4} txt="EL SILENCIO" x={110} y={110} />
    <Tag a={144.6} b={149.8} t={146.5} txt="EL CARRITO MANDA" x={110} y={860} bg={RK.price} color="#fff" />
    <Esq t={150.0} b={154.12} />
    <Tag a={151.1} b={154.12} t={151.3} txt="LISTA ESCRITA · PASO FIRME" x={110} y={860} bg={RK.offer} />
    <Diez t={162.26} b={164.66} tip="¿Esto estaba en tu lista?" />
    {/* 16 */}
    <Num a={164.66} b={169.50} n={16} title="El pan recién horneado en la entrada" bg="px_still/6516822.png" t={164.9} />
    <Tag a={175.2} b={180.1} t={176.6} txt="LA PANADERÍA, EN LA ENTRADA" x={110} y={860} bg={RK.offer} />
    <Tag a={180.1} b={188.7} t={180.4} txt="7:00 · YO ABRÍA LA SECCIÓN" x={110} y={110} />
    <Esq t={189.34} b={195.75} />
    <Tag a={192.5} b={195.75} t={192.7} txt="EL PAN, AL FINAL" x={110} y={860} bg={RK.offer} />
    <Diez t={200.58} b={206.40} tip="¿Venís por pan o te lo pide el olor?" />
    {/* 15 */}
    <Num a={206.40} b={209.40} n={15} title="La leche y el pan, al fondo" bg="v10/img/fondo_estante.png" t={206.5} />
    <Tag a={216.22} b={223.7} t={217.0} txt="CRUZÁS TODO EL SÚPER" x={110} y={860} bg={RK.price} color="#fff" />
    <Clipboard from={223.70} dur={8.6} title="Planilla · lunes" bg="v10/img/N108.png" lines={[{ txt: "Reponer lácteos", t: 224.6 }, { txt: "Leche → al fondo", t: 228.1, tick: 229.2 }, { txt: "(la orden de siempre)", t: 230.6 }]} />
    <Esq t={232.78} b={241.36} />
    <Tag a={236.8} b={241.36} t={237.6} txt="DIRECTO, SIN MIRAR A LOS COSTADOS" x={110} y={860} bg={RK.offer} size={50} />
    <Sequence from={fr(241.36)} durationInFrames={fr(247.26) - fr(241.36)}><MapPlate a={241.36} b={247.26} /></Sequence>
    <Diez t={241.36} b={247.26} tip="Decidí la ruta antes de entrar" />
    {/* 14 */}
    <Num a={247.26} b={250.40} n={14} title="El carrito cada vez más grande" bg="px_still/9010435.png" t={247.4} />
    <Tag a={250.4} b={253.33} t={250.8} txt="CARRITOS MÁS GRANDES QUE ANTES" x={110} y={860} />
    <Tag a={261.0} b={264.5} t={261.4} txt="LO LLENABAN PORQUE HABÍA LUGAR" x={110} y={860} bg={RK.price} color="#fff" size={50} />
    <Esq t={268.06} b={274.86} />
    <Tag a={268.6} b={274.86} t={269.6} txt="CANASTA CHICA" x={110} y={860} bg={RK.offer} />
    <Diez t={274.86} b={283.96} tip="Mirá el fondo del carrito" />
    {/* 13 */}
    <Num a={283.96} b={288.40} n={13} title="Las puntas de góndola que parecen oferta" bg="v10/img/puntagondola.png" t={284.1} />
    <OfferPoster from={288.40} dur={11.4} bg="v10/img/puntagondola.png" big="¡YA!" small="APROVECHÁ" tIn={289.0} tPeel={296.5} under={[{ txt: "Cartel grande", t: 294.0 }, { txt: "Colores fuertes", t: 295.4 }, { txt: "¿Más barato? NO", t: 297.2, hl: true }]} />
    <PriceVs a={306.79} b={310.40} t={307.3} />
    <Esq t={310.88} b={318.92} />
    <Tag a={311.7} b={318.92} t={312.6} txt="BUSCÁ EL MISMO PRODUCTO ADENTRO" x={110} y={860} bg={RK.offer} size={50} />
    <Diez t={318.92} b={322.36} tip="Si no coincide, seguí de largo" />
    {/* 12 */}
    <Num a={322.36} b={326.40} n={12} title="Lo caro, a la altura de los ojos" bg="v10/img/gondola_alturas.png" t={322.5} />
    <ShelfHeights from={326.40} dur={11.9} bg="v10/img/gondola_alturas.png" bands={[
      { label: "ALTURA DE LOS OJOS", y0: 330, y1: 560, chip: "LO QUE CONVIENE VENDER", t: 327.9 },
      { label: "RODILLAS", y0: 800, y1: 1010, chip: "LO BARATO", t: 333.6 },
    ]} />
    <Tag a={341.9} b={346.4} t={342.0} txt="HAY QUE AGACHARSE" x={110} y={860} bg={RK.offer} />
    <Esq t={346.90} b={353.38} />
    <Tag a={348.3} b={353.38} t={348.5} txt="ARRIBA · MEDIO · ABAJO" x={110} y={860} bg={RK.offer} />
    <Diez t={353.38} b={360.70} tip="Agachate y compará en dos estantes" />
    {/* 11 */}
    <Num a={360.70} b={365.60} n={11} title="Lo de los chicos, a la altura de los chicos" bg="v10/img/cereal_ninos.png" t={360.8} />
    <Tag a={365.6} b={372.8} t={371.8} txt="A 1 METRO DEL PISO" x={110} y={860} bg={RK.price} color="#fff" />
    <Tag a={372.8} b={378.4} t={373.0} txt="VE · PIDE · LLORA" x={110} y={860} />
    <Esq t={384.68} b={395.28} />
    <Tag a={385.7} b={389.4} t={386.0} txt="CONTALE ANTES QUÉ VIENEN A BUSCAR" x={110} y={860} bg={RK.offer} size={48} />
    <Tag a={389.4} b={395.28} t={391.0} txt="¿LA ELEGISTE VOS O LA ALTURA?" x={110} y={860} bg={RK.offer} size={50} />
    <Diez t={395.28} b={398.63} tip="El carrito entre el chico y la góndola" />
    {/* CTA 1 */}
    <Tag a={398.63} b={402.5} t={399.8} txt="7 DE 17 · FALTAN 10" x={110} y={110} bg={RK.offer} />
    <Cta from={402.50} dur={9.4} t={409.3} bg="v10/img/N145.png" />
    {/* 10 */}
    <Num a={411.90} b={415.30} n={10} title="El precio terminado en 99" bg="v10/img/precio_a.png" t={412.3} />
    <Circle a={415.3} b={425.7} t={424.1} x={560} y={330} w={320} h={420} />
    <Tag a={415.3} b={425.7} t={425.0} txt="≈ $ 3.000" x={1300} y={860} bg={RK.price} color="#fff" size={70} />
    <Tag a={430.3} b={434.57} t={431.0} txt="EJEMPLO" x={110} y={110} />
    <Esq t={448.66} b={458.44} />
    <Round a={448.17} b={458.44} t={456.5} />
    <Diez t={458.44} b={463.52} tip="Sumá uno y compará" />
    {/* 9 */}
    <Num a={463.52} b={466.70} n={9} title="El paquete más chico al mismo precio" bg="v10/img/caja_cereal.png" t={463.7} />
    <Tag a={466.7} b={473.9} t={467.0} txt="MISMA CAJA, MENOS PRODUCTO" x={110} y={860} bg={RK.price} color="#fff" />
    <Tag a={473.9} b={478.0} t={474.0} txt="MISMO COLOR · MISMO DIBUJO · MISMO TAMAÑO" x={110} y={860} size={44} />
    <Tag a={478.0} b={483.07} t={479.5} txt="−50 GRAMOS QUE NO SE VEN" x={110} y={110} bg={RK.price} color="#fff" />
    <TwoBoxes a={484.80} b={491.90} tA={485.0} tB={485.6} tStrike={487.6} />
    <Tag a={492.4} b={501.7} t={496.5} txt="LA COMPRABAN POR COSTUMBRE" x={110} y={110} />
    <Esq t={501.74} b={506.86} />
    <Tag a={502.6} b={506.86} t={503.5} txt="EL PESO, EN LA LETRA CHICA" x={110} y={860} bg={RK.offer} />
    <Diez t={506.86} b={515.24} tip="Leé los gramos y compará con el de al lado" />
    {/* 8 */}
    <Num a={515.24} b={518.50} n={8} title="El 2x1 que te hace llevar de más" bg="v10/img/cafe_2x1.png" t={515.4} />
    <OfferPoster from={518.50} dur={12.8} bg="v10/img/cafe_2x1.png" big="2x1" small="¡LLEVÁ 2!" tIn={519.1} tPeel={524.0} under={[{ txt: "Venías por 1", t: 525.6 }, { txt: "¿Y el 2º?", t: 527.6, hl: true }]} />
    <Tag a={531.3} b={539.45} t={531.6} txt="YO ARMABA OFERTAS ASÍ" x={110} y={110} />
    <Esq t={538.84} b={547.42} />
    <Diez t={547.42} b={552.0} tip="Precio por unidad, no el del cartel" />
    <Tag a={554.4} b={564.6} t={555.0} txt="UNA CLIENTA DE TODAS LAS SEMANAS" x={110} y={110} size={50} />
    <Quote a={554.4} b={564.6} t={563.4} txt="«¡Es dos por uno!»" x={1060} y={760} />
    <Tag a={569.5} b={574.7} t={570.0} txt="EL CARTEL LE GANÓ A LA COMPRA" x={110} y={860} bg={RK.price} color="#fff" size={52} />
    <CommentQ from={574.70} dur={4.08} q="¿Te pasó algo así? Contámelo." t={575.0} bg="v10/img/clienta_cafe.png" name="Claudio" initial="C" when="ahora" />
    <Tag a={579.2} b={585.14} t={582.6} txt="FALTAN 7" x={110} y={110} bg={RK.offer} />
    {/* 7 */}
    <Num a={585.14} b={589.90} n={7} title="Precio por unidad contra precio por kilo" bg="v10/img/etiqueta_estante.png" t={585.4} />
    <ShelfTag from={589.90} dur={11.8} bg="v10/img/etiqueta_estante.png" at={[890, 525]} product="Fideos secos" price={1240} unitLine="$ 2.480 el kg" tPrint={590.4} tLupa={597.3} tCircle={599.8} />
    <PerKilo from={601.70} dur={8.9} left={{ img: "v10/img/caja_cereal.png", name: "Paquete 500 g", price: 1240, grams: 500 }} right={{ img: "v10/img/caja_cereal.png", name: "Paquete 400 g", price: 1050, grams: 400 }} tA={602.0} tB={602.6} tCalc={604.4} tWin={608.6} bg="v10/img/N145.png" />
    <Tag a={610.6} b={622.1} t={610.8} txt="YO CARGABA LAS ETIQUETAS" x={110} y={110} />
    <Esq t={622.52} b={628.05} />
    <Tag a={623.4} b={628.05} t={624.0} txt="COMPARÁ EN LA MISMA UNIDAD" x={110} y={860} bg={RK.offer} />
    <Diez t={635.14} b={638.02} tip="Mirá la línea de abajo" />
    {/* 6 */}
    <Num a={638.02} b={641.50} n={6} title="La fruta mojada, que pesa más" bg="v10/img/fruta_rocio.png" t={638.2} />
    <Tag a={650.8} b={656.1} t={651.0} txt="+ AGUA = + PESO" x={110} y={860} bg={RK.price} color="#fff" size={64} />
    <Tag a={656.1} b={663.68} t={656.3} txt="CADA MAÑANA, LA MANGUERA" x={110} y={110} />
    <Esq t={663.68} b={669.70} />
    <Tag a={664.6} b={669.7} t={665.5} txt="ELEGÍ LA SECA · SECALA CON PAPEL" x={110} y={860} bg={RK.offer} size={50} />
    <Diez t={669.70} b={676.32} tip="Si gotea, estás pagando el agua" />
    {/* 5 */}
    <Num a={676.32} b={679.30} n={5} title="El cartel viejo que queda colgado" bg="v10/img/cartel_viejo.png" t={676.5} />
    <Tag a={679.3} b={684.7} t={683.2} txt="2 SEMANAS DESPUÉS" x={110} y={860} bg={RK.price} color="#fff" />
    <Tag a={684.7} b={693.83} t={685.0} txt="NADIE LO BAJABA A TIEMPO" x={110} y={110} />
    <Esq t={699.54} b={708.00} />
    <Tag a={700.4} b={704.55} t={700.6} txt="MIRÁ LA FECHA DEL CARTEL" x={110} y={860} bg={RK.offer} />
    <Tag a={704.55} b={708.0} t={705.6} txt="MANDA EL ESTANTE" x={110} y={860} bg={RK.price} color="#fff" size={64} />
    <Diez t={708.00} b={713.18} tip="La etiqueta vale más que el cartel grande" />
    {/* 4 */}
    <Num a={713.18} b={715.60} n={4} title="Las golosinas en la caja" bg="v10/img/cinta_golosinas.png" t={713.3} />
    <Tag a={723.2} b={729.6} t={723.4} txt="A LA ALTURA DE LA MANO DE UN CHICO" x={110} y={860} bg={RK.price} color="#fff" size={50} />
    <Tag a={729.6} b={736.59} t={732.9} txt="EL ÚNICO MOMENTO EN QUE ESPERÁS" x={110} y={110} size={50} />
    <Esq t={737.30} b={744.98} />
    <Diez t={744.98} b={750.96} tip="Mirá lo que está en la cinta antes de que pase" />
    {/* 3 */}
    <Num a={750.96} b={754.40} n={3} title="La reposición de atrás para adelante" bg="v10/img/fondo_estante.png" t={751.1} />
    <Tag a={754.4} b={758.1} t={754.6} txt="DE NOCHE, AL REPONER" x={110} y={110} />
    <Tag a={758.1} b={760.2} t={758.3} txt="VENCE ANTES → ADELANTE" x={110} y={860} bg={RK.offer} />
    <Tag a={760.2} b={763.6} t={760.4} txt="LO NUEVO → ATRÁS" x={110} y={860} bg={RK.price} color="#fff" />
    <Tag a={767.6} b={772.1} t={768.4} txt="LO MÁS FRESCO, AL FONDO" x={110} y={860} bg={RK.price} color="#fff" />
    <Esq t={772.56} b={777.34} />
    <Diez t={777.34} b={783.9} tip="Compará la fecha del de atrás" />
    {/* 2 */}
    <Num a={787.16} b={790.60} n={2} title="El precio especial del mostrador, por pieza" bg="v10/img/queso_pieza.png" t={787.3} />
    <Tag a={800.3} b={805.7} t={800.6} txt="PRECIO ESPECIAL · POR PIEZA" x={110} y={110} bg={RK.price} color="#fff" />
    <Tag a={805.7} b={808.9} t={806.0} txt="CUENTA LO QUE PAGÁS AL SALIR" x={110} y={860} />
    <Tag a={813.9} b={820.6} t={814.2} txt="EL PESO, AL FINAL" x={110} y={860} bg={RK.price} color="#fff" />
    <Esq t={820.96} b={826.46} />
    <Tag a={822.0} b={826.46} t={822.4} txt="PEDÍ EL PESO ANTES DE QUE ENVUELVAN" x={110} y={860} bg={RK.offer} size={48} />
    <Diez t={826.46} b={833.40} tip="Buscá la palabra «kilo»" />
    {/* 1 */}
    <Num a={833.40} b={837.70} n={1} title="La etiqueta que no coincide con la caja" bg="v10/img/etiqueta_estante.png" t={833.6} />
    <Tag a={837.7} b={840.65} t={837.9} txt="EL QUE MÁS VECES VI" x={110} y={110} bg={RK.offer} />
    <Scanner from={844.90} dur={6.11} img="v10/img/caja_a.png" price={1890} tBeep={847.6} display={{ price: 2150, t: 848.2 }} />
    <Tag a={851.01} b={855.1} t={851.2} txt="A VECES, MÁS ALTO" x={110} y={860} bg={RK.price} color="#fff" />
    <Tag a={855.1} b={861.6} t={855.6} txt="SISTEMA ≠ ESTANTE" x={110} y={860} bg={RK.offer} size={64} />
    <Tag a={861.6} b={866.6} t={862.9} txt="EL TICKET ES TU PRUEBA" x={110} y={860} bg={RK.price} color="#fff" />
    <Diez t={874.60} b={878.19} tip="Antes de salir, mirá el ticket" />
    <Ticket from={879.60} dur={9.4} bg="v10/img/caja_a.png" head="SUPERMERCADO" lines={[
      { txt: "LECHE ENTERA 1 L", amt: "1.150", t: 880.0 }, { txt: "PAN DE MOLDE", amt: "2.300", t: 880.5 },
      { txt: "CAFÉ 500 G", amt: "6.900", t: 881.0 }, { txt: "FIDEOS SECOS", amt: "1.240", t: 881.5 },
    ]} hl={{ idx: 2, t: 882.2, note: "ESTANTE: 6.400" }} />
    <Tag a={889.0} b={896.9} t={890.5} txt="TICKET · ETIQUETA · PRECIO" x={110} y={860} bg={RK.offer} />
    {/* repaso, CTA 2, pregunta, despedida */}
    <RecapMap a={896.90} b={925.63} />
    <Cta from={925.63} dur={11.67} t={934.6} bg="v10/img/N145.png" />
    <CommentQ from={937.30} dur={6.5} q="¿Cuál de estas te pasó a ti? Escribilo, los leo todos." t={939.9} bg="v10/img/L392.png" name="Claudio" initial="C" when="ahora" />
    <Tag a={943.8} b={948.571} t={946.4} txt="MIRÁ BIEN LA ETIQUETA" x={110} y={860} bg={RK.offer} />
  </>
);

export const V10Full: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile("v10/voz.wav")} />
    <Min1Layers />
    <RestLayers />
  </AbsoluteFill>
);
