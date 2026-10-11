// cltoilet · MINUTO 1 editado a mano (Claude, 10-oct-2026) — comparación contra el clon DeepSeek.
// Todo función pura del frame. Tiempos en SEGUNDOS del video final (= voz recortada).
// Capas por plano: placa (foto/clip con cámara) → grade → anotaciones que viven DENTRO del encuadre → grano.
// Componentes: fondo continuo (un solo plano), materia real adentro, texto entre capas, salida por cámara (match/zoom), nunca pop.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SERIF, LABEL, HAND } from "../../claudio/ClTheme";
import AV from "../avwin.json";

export const FPS = 30;
export const END = 61.44;
export const fr = (s: number) => Math.round(s * FPS);
export const cl = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const ez = (x: number) => { const t = cl(x); return t * t * (3 - 2 * t); };
export const eo = (x: number) => 1 - Math.pow(1 - cl(x), 3);
export const lin = (f: number, a: number, b: number, v0: number, v1: number, e = ez) => v0 + (v1 - v0) * e((f - a) / Math.max(1, b - a));
export const img = (k: string) => staticFile(k.includes("/") ? k : `img/cltoilet/${k}.png`);
export const C = { porc: "#FBF8F2", ink: "#2B2620", inkSoft: "#6B6257", sage: "#4E7A50", lilac: "#B4A2C6", lilacDeep: "#6B5786", red: "#C0392B", cream: "#F6EEDC", shadow: "rgba(30,20,10,0.45)" };

// ── avatar: segundo del reel pagado para un segundo del video ──
export const avAt = (t: number) => {
  const W = (AV as any).win as { ms: number; me: number; off: number; lag?: number; pieces: [number, number][] }[];
  const w = W.find((x) => x.pieces.some((p) => t >= p[0] - 0.02 && t <= p[1] + 0.02)) || W[0];
  return w.off + (t - w.ms) + (w.lag || 0);
};

// ── capas comunes ──
export const Grain: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: `url(${staticFile("img/cltoilet/_st/grain.png")})`, backgroundRepeat: "repeat", opacity: 0.06, mixBlendMode: "overlay" }} />
);
export const Grade: React.FC<{ warm?: number; vig?: number }> = ({ warm = 1, vig = 0.32 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", background:
    `linear-gradient(180deg, rgba(255,236,200,${0.08 * warm}) 0%, rgba(255,236,200,0) 40%, rgba(24,18,36,0.14) 100%), radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 55%, rgba(14,10,22,${vig}) 100%)` }} />
);

// ── un plano: foto o clip con cámara (escala/foco/deriva) + transición de entrada/salida por movimiento ──
export type Tr = "cut" | "whip" | "zoom";
export type Shot = {
  a: number; b: number; k: string; vid?: boolean; ofs?: number; // segundos dentro del clip
  z?: [number, number]; o?: [number, number]; dx?: number; dy?: number; // escala ini/fin, foco % (x,y), deriva px
  tin?: Tr; tout?: Tr; av?: boolean; comp?: React.FC<{ d: number }>; children?: React.ReactNode;
};
export const OV = 6; // cuadros de solape en transiciones con movimiento
export const Plate: React.FC<{ s: Shot; d: number; lead: number }> = ({ s, d, lead }) => {
  const f = useCurrentFrame() - lead; // f=0 en el corte de entrada
  const T = fr(s.b - s.a);
  const [z0, z1] = s.z || [1.04, 1.12];
  const [ox, oy] = s.o || [50, 50];
  const k = f / Math.max(1, T);
  let sc = z0 + (z1 - z0) * k, tx = (s.dx || 0) * (k - 0.5), ty = (s.dy || 0) * (k - 0.5), blur = 0, op = 1;
  // entrada
  if (s.tin === "whip" && f < 0) { const u = (f + OV) / OV; tx += 1920 * (1 - eo(u)); blur = 26 * (1 - u); }
  else if (s.tin === "whip" && f < 3) { blur = 10 * (1 - f / 3); }
  if (s.tin === "zoom" && f < 4) { const u = cl((f + OV) / (OV + 4)); sc *= 1 + 0.55 * (1 - eo(u)); blur = 18 * (1 - u); op = cl((f + OV) / 3); }
  // salida (los cuadros después de T sólo existen si el siguiente entra con movimiento)
  if (f >= T) { const u = (f - T + 1) / OV; if (s.tout === "whip") { tx -= 1920 * ez(u) * 0.9; blur = 26 * u; } if (s.tout === "zoom") { sc *= 1 + 0.9 * ez(u); blur = 16 * u; } }
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000", opacity: op }}>
      <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${sc})`, transformOrigin: `${ox}% ${oy}%`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
        {s.av ? (
          <OffthreadVideo src={staticFile("av/reel.mp4")} startFrom={Math.max(0, fr(avAt(s.a)) - lead)} muted style={st} />
        ) : s.vid ? (
          <OffthreadVideo src={staticFile(`broll/${s.k}.mp4`)} startFrom={fr(s.ofs || 0)} muted style={st} />
        ) : (
          <Img src={img(s.k)} style={st} />
        )}
        {s.children}
      </AbsoluteFill>
      <Grade />
    </AbsoluteFill>
  );
};

// ═════════════════════════ COMPONENTES (cada uno = un plano continuo con capas) ═════════════════════════

// marcador rojo dibujado (círculo / tachado / subrayado) — stroke animado
export const Mark: React.FC<{ kind: "circle" | "strike" | "under"; x: number; y: number; w: number; h: number; f: number; at: number; dur?: number; color?: string; sw?: number }> =
  ({ kind, x, y, w, h, f, at, dur = 9, color = C.red, sw = 9 }) => {
    const u = eo((f - at) / dur);
    if (u <= 0) return null;
    const d = kind === "circle"
      ? `M ${w * 0.62} ${h * 0.04} C ${w * 1.02} ${h * 0.08}, ${w * 1.04} ${h * 0.9}, ${w * 0.5} ${h * 0.97} C ${w * 0.02} ${h * 1.0}, ${-w * 0.04} ${h * 0.18}, ${w * 0.42} ${h * 0.02} C ${w * 0.56} ${-h * 0.02}, ${w * 0.7} ${h * 0.03}, ${w * 0.78} ${h * 0.1}`
      : kind === "strike" ? `M ${w * 0.0} ${h * 0.58} C ${w * 0.3} ${h * 0.46}, ${w * 0.7} ${h * 0.5}, ${w} ${h * 0.4}`
      : `M 0 ${h * 0.5} C ${w * 0.35} ${h * 0.62}, ${w * 0.7} ${h * 0.38}, ${w} ${h * 0.5}`;
    return (
      <svg style={{ position: "absolute", left: x, top: y, overflow: "visible", filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.35))" }} width={w} height={h}>
        <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} />
      </svg>
    );
  };
// marco de foto real con canto, paspartú, brillo que barre
export const Print: React.FC<{ k: string; w: number; h: number; f: number; mat?: number; children?: React.ReactNode }> = ({ k, w, h, f, mat = 16, children }) => (
  <div style={{ background: "#FFFDF8", padding: `${mat}px ${mat}px ${mat * 1.25}px`, borderRadius: 3,
    boxShadow: `0 40px 80px ${C.shadow}, 0 6px 14px rgba(0,0,0,0.25), inset 0 1px 0 #fff` }}>
    <div style={{ position: "relative", width: w, height: h, overflow: "hidden", background: "#ccc" }}>
      <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.04 * Math.sin(f / 50)})` }} />
      <div style={{ position: "absolute", top: "-40%", bottom: "-40%", width: "28%", left: `${-40 + ((f * 1.3) % 220)}%`, transform: "rotate(14deg)",
        background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.22), rgba(255,255,255,0))" }} />
      {children}
    </div>
  </div>
);
export const Chip: React.FC<{ txt: string; size?: number; bg?: string; color?: string; rot?: number; font?: string; ls?: number }> =
  ({ txt, size = 44, bg = "#FFFDF4", color = C.ink, rot = -2, font = LABEL, ls = 3 }) => (
    <div style={{ display: "inline-block", background: bg, color, fontFamily: font, fontWeight: 700, fontSize: size, letterSpacing: ls, textTransform: font === LABEL ? "uppercase" : undefined,
      padding: `${size * 0.16}px ${size * 0.42}px`, borderRadius: 4, transform: `rotate(${rot}deg)`, boxShadow: "0 14px 30px rgba(0,0,0,0.3)", whiteSpace: "nowrap" }}>{txt}</div>
  );
// fondo continuo: la foto desenfocada en disco (blur barato: escala chica + filtro) con deriva
export const Bed: React.FC<{ k: string; f: number; T: number; dim?: number; z?: [number, number] }> = ({ k, f, T, dim = 0.45, z = [1.12, 1.22] }) => (
  <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
    <AbsoluteFill style={{ transform: `scale(${z[0] + (z[1] - z[0]) * f / Math.max(1, T)})`, filter: `blur(14px) brightness(${1 - dim * 0.65}) saturate(1.05)` }}>
      <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 70% at 30% 10%, rgba(255,232,190,0.22), rgba(255,232,190,0) 60%)` }} />
    {Array.from({ length: 22 }, (_, i) => {
      const r = (n: number) => { const x = Math.sin(i * 91.7 + n * 13.3) * 43758.5; return x - Math.floor(x); };
      const x = r(1) * 1920 + Math.sin(f / (60 + 40 * r(2)) + r(3) * 6) * 24, y = 1080 - ((f * (0.5 + r(4)) * 1.4 + r(5) * 1080) % 1120);
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 3 + 4 * r(6), height: 3 + 4 * r(6), borderRadius: 9, background: "rgba(255,244,222,0.6)", opacity: 0.1 + 0.18 * r(7) }} />;
    })}
  </AbsoluteFill>
);
// cámara del componente: empuja hacia un punto en la salida (match/zoom-through al plano siguiente)
export const Stage: React.FC<{ f: number; T: number; push?: [number, number, number]; drift?: number; children: React.ReactNode }> = ({ f, T, push, drift = 1, children }) => {
  const P = 9; let sc = 1 + 0.03 * drift * f / Math.max(1, T), ox = 50, oy = 50, bl = 0;
  if (push && f > T - P) { const u = ez((f - (T - P)) / P); sc *= 1 + (push[2] - 1) * u; ox = push[0]; oy = push[1]; bl = 0; }
  return <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: `${ox}% ${oy}%`, filter: bl ? `blur(${bl}px)` : undefined }}>{children}</AbsoluteFill>;
};
export const sp = (f: number, at: number, damping = 13, stiffness = 140) => spring({ frame: f - at, fps: FPS, config: { damping, stiffness, mass: 0.8 } });

// 0 · cold open: texto cinético sobre los planos + sello "STILL SMELLS" (vive en una capa encima de los cortes)
const ColdText: React.FC = () => {
  const f = useCurrentFrame();
  const W: [string, number][] = [["YOU", 0], ["CLEANED", 0.2], ["IT", 0.54], ["YESTERDAY.", 0.8]];
  const st = sp(f, fr(2.3), 11, 260);
  const shake = f >= fr(2.3) && f < fr(2.3) + 7 ? Math.sin(f * 7) * (7 - (f - fr(2.3))) * 2.2 : 0;
  const out = lin(f, fr(3.12), fr(3.3), 1, 0);
  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.6}px)`, opacity: out }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,8,14,0) 45%, rgba(10,8,14,0.55) 100%)" }} />
      <div style={{ position: "absolute", left: 120, bottom: 150, display: "flex", gap: 26 }}>
        {W.map(([w, t], i) => {
          const u = sp(f, fr(t), 14, 200);
          return <div key={i} style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 104, color: C.porc, letterSpacing: -1, opacity: u,
            transform: `translateY(${(1 - u) * 60}px)`, textShadow: "0 8px 30px rgba(0,0,0,0.55)" }}>{w}</div>;
        })}
      </div>
      {f >= fr(2.3) ? (
        <div style={{ position: "absolute", left: 1010, top: 120, transform: `rotate(-8deg) scale(${2.4 - 1.4 * st})`, opacity: cl(st * 3) }}>
          <div style={{ border: `10px solid ${C.red}`, borderRadius: 14, padding: "10px 38px", fontFamily: LABEL, fontWeight: 700, fontSize: 150, color: C.red, letterSpacing: 8,
            background: "rgba(255,248,240,0.82)", boxShadow: "0 20px 50px rgba(0,0,0,0.45)" }}>STILL SMELLS</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// 1 · "It is not the bowl" — la anotación vive DENTRO del encuadre (sigue a la cámara)
const NotBowlMarks: React.FC<{ a: number }> = ({ a }) => {
  const f = useCurrentFrame() - 0; const t0 = fr(a);
  return (
    <AbsoluteFill>
      <Mark kind="circle" x={461} y={725} w={430} h={300} f={f} at={fr(11.1) - t0} dur={10} sw={11} />
    </AbsoluteFill>
  );
};
const NotBowlText: React.FC<{ a: number }> = ({ a }) => {
  const f = useCurrentFrame(); const t0 = fr(a);
  const u = sp(f, fr(11.15) - t0, 14, 180);
  return (
    <div style={{ position: "absolute", left: 1080, top: 150, opacity: u, transform: `translateY(${(1 - u) * 40}px) rotate(-3deg)` }}>
      <div style={{ position: "relative" }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 70, letterSpacing: 8, color: "#fff", background: C.red, display: "inline-block", padding: "2px 22px", borderRadius: 4, marginLeft: 14, marginBottom: 8, boxShadow: "0 10px 24px rgba(0,0,0,0.35)" }}>NOT</div>
        <Chip txt="THE BOWL" size={86} />
        <Mark kind="strike" x={-10} y={100} w={500} h={90} f={f} at={fr(11.6) - t0} dur={8} sw={12} />
      </div>
      <div style={{ marginTop: 26, marginLeft: 40, opacity: lin(f, fr(11.97) - t0, fr(12.3) - t0, 0, 1), fontFamily: HAND, fontSize: 64, color: C.porc, textShadow: "0 4px 18px rgba(0,0,0,0.7)" }}>
        where you've been scrubbing
      </div>
    </div>
  );
};

// 2 · MISTAKE #1 — número gigante ENTRE capas: fondo continuo · número · foto en 3D · rótulos. Sale empujando a la foto.
const MistakeOne: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(); const T = d; const t0 = fr(13.89);
  const n = sp(f, 0, 12, 120), p = sp(f, 6, 14, 110), lab = sp(f, 3, 14, 160);
  const wet = sp(f, fr(16.63) - t0, 13, 180), hold = sp(f, fr(18.31) - t0, 13, 180);
  const cam = f / T;
  return (
    <Stage f={f} T={T} push={[66, 46, 3.2]}>
      <Bed k="p118" f={f} T={T} dim={0.5} />
      {/* número: detrás de la foto, parallax contrario */}
      <div style={{ position: "absolute", left: 210 - 40 * cam, top: 40, opacity: n, transform: `scale(${1.35 - 0.35 * n})`, transformOrigin: "40% 60%" }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 64, letterSpacing: 18, color: C.lilac, opacity: lab, transform: `translateX(${(1 - lab) * -50}px)`, marginLeft: 30 }}>MISTAKE</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 880, lineHeight: 0.86, color: "transparent",
          backgroundImage: "linear-gradient(170deg, #FFFDF8 10%, #E6DDF0 55%, #B4A2C6 100%)", WebkitBackgroundClip: "text", backgroundClip: "text",
          filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.5))" }}>1</div>
      </div>
      {/* la foto real, en 3D, tapa el canto derecho del número */}
      <div style={{ position: "absolute", left: 1290 + 30 * cam, top: 520, translate: "-50% -50%",
        transform: `perspective(1600px) rotateY(${-16 + 8 * cam}deg) rotateZ(${2 - 1.5 * cam}deg) translateX(${(1 - p) * 900}px)`, opacity: cl(p * 2) }}>
        <Print k="p118" w={820} h={560} f={f} />
        <div style={{ position: "absolute", left: -40, top: -36, opacity: wet, transform: `scale(${0.6 + 0.4 * wet}) rotate(-5deg)` }}><Chip txt="the WET brush" font={HAND} size={66} ls={0} /></div>
        <div style={{ position: "absolute", right: -30, bottom: 30, opacity: hold, transform: `scale(${0.6 + 0.4 * hold}) rotate(3deg)` }}><Chip txt="CLOSED HOLDER" size={46} bg={C.red} color="#fff" /></div>
      </div>
      <Grade vig={0.4} />
    </Stage>
  );
};

// 3 · PAGE 9 — la página real sube de la mesa a cámara, resaltador, pestaña
const PageNine: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(); const T = d; const t0 = fr(19.07);
  const up = sp(f, 0, 15, 90), tab = sp(f, fr(20.15) - t0, 12, 200);
  const hl = lin(f, fr(20.47) - t0, fr(21.3) - t0, 0, 1);
  const cap = sp(f, fr(21.21) - t0, 14, 160);
  const exitU = ez((f - (T - 7)) / 7);
  return (
    <AbsoluteFill>
      <Bed k="p058" f={f} T={T} dim={0.42} />
      <div style={{ position: "absolute", left: 960, top: 545, translate: "-50% -50%",
        transform: `perspective(1800px) rotateX(${(1 - up) * 58 + 6}deg) rotateZ(${-4 + 2 * up}deg) translateY(${(1 - up) * 260}px) rotateY(${-exitU * 70}deg) translateX(${-exitU * 900}px)`,
        transformOrigin: "50% 100%" }}>
        <div style={{ position: "relative", width: 720, height: 932, background: "#fff", boxShadow: "0 60px 100px rgba(0,0,0,0.55)", borderRadius: 3, overflow: "hidden" }}>
          <Img src={img("img/cltoilet/page9.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", left: 40, top: 210, height: 64, width: `${hl * 82}%`, background: "rgba(255,226,70,0.45)", mixBlendMode: "multiply", borderRadius: 6 }} />
          <AbsoluteFill style={{ background: "linear-gradient(150deg, rgba(255,250,235,0.18), rgba(0,0,0,0) 45%, rgba(20,16,30,0.18))" }} />
        </div>
        <div style={{ position: "absolute", right: -150, top: 70, transform: `translateX(${(1 - tab) * -120}px) rotate(4deg)`, opacity: tab }}>
          <Chip txt="PAGE 9" size={70} bg={C.red} color="#fff" />
        </div>
      </div>
      <div style={{ position: "absolute", left: 300, bottom: 110, opacity: cap * (1 - exitU), transform: `rotate(-4deg) translateY(${(1 - cap) * 30}px)`, fontFamily: HAND, fontSize: 78, color: C.porc, textShadow: "0 4px 20px rgba(0,0,0,0.7)" }}>
        my little book
      </div>
      <Grade vig={0.38} />
    </AbsoluteFill>
  );
};

// 4 · los CINCO lugares — se reparten 5 copias reales; sale entrando en la #4 (la manija) = plano siguiente
const FIVE: { k: string; t: string }[] = [{ k: "p118", t: "BRUSH" }, { k: "p154", t: "BASE" }, { k: "p149", t: "HINGE" }, { k: "p016", t: "HANDLE" }, { k: "p054", t: "WATERLINE" }];
const FiveSpots: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(); const T = d; const t0 = fr(24.39);
  const head = sp(f, 0, 13, 170);
  const spray = sp(f, fr(24.93) - t0, 14, 160);
  return (
    <Stage f={f} T={T} push={[68.2, 53.7, 6.4]} drift={0.6}>
      <Bed k="p164" f={f} T={T} dim={0.48} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", opacity: head, transform: `translateY(${(1 - head) * -40}px)` }}>
        <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: C.porc, textShadow: "0 10px 40px rgba(0,0,0,0.6)" }}>5 </span>
        <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 64, letterSpacing: 10, color: C.lilac }}>SPOTS NOBODY CLEANS</span>
      </div>
      {FIVE.map((x, i) => {
        const u = sp(f, 2 + i * 3.5, 13, 150);
        const X = 260 + i * 350, Y = 540 + (i % 2 ? 40 : -20), R = [-7, 4, -3, 5, -5][i];
        return (
          <div key={i} style={{ position: "absolute", left: X, top: Y, translate: "-50% -50%", transform: `translateY(${(1 - u) * 700}px) rotate(${R * u + (1 - u) * 25}deg)`, opacity: cl(u * 2) }}>
            <Print k={x.k} w={320} h={180} f={f + i * 20} mat={11} />
            <div style={{ position: "absolute", left: -18, top: -24 }}><Chip txt={`${i + 1}`} size={46} bg={C.lilacDeep} color="#fff" rot={-6} font={SERIF} ls={0} /></div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: -60, textAlign: "center" }}><Chip txt={x.t} size={30} rot={R * -0.3} /></div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", opacity: spray, transform: `translateY(${(1 - spray) * 40}px)` }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <span style={{ fontFamily: HAND, fontSize: 76, color: C.porc, textShadow: "0 4px 20px rgba(0,0,0,0.7)" }}>before you buy another spray</span>
          <Mark kind="strike" x={330} y={10} w={480} h={80} f={f} at={fr(25.95) - t0} dur={8} sw={10} />
        </div>
      </div>
      <Grade vig={0.4} />
    </Stage>
  );
};

// 5 · "damp dark places" — se apaga la luz y una linterna encuentra el rincón; palabras escritas al lado del haz
const DarkPlaces: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(); const t0 = fr(32.65);
  const dark = lin(f, 0, 12, 0, 0.93);
  const on = f >= fr(33.29) - t0;
  const k = ez((f - (fr(33.29) - t0)) / 40);
  const bx = 24 + (44 - 24) * k + 1.5 * Math.sin(f / 7), by = 28 + (80 - 28) * k + 1.2 * Math.cos(f / 9);
  const R = 300 + 70 * lin(f, fr(35.27) - t0, fr(35.9) - t0, 0, 1) + (on && f - (fr(33.29) - t0) < 4 ? -200 : 0);
  const flick = on && f - (fr(33.29) - t0) < 6 ? (f % 2 ? 0.5 : 1) : 1;
  const words: [string, number, number, number][] = [["damp", 34.11, 1040, 560], ["dark", 34.53, 1180, 690], ["places", 34.85, 1300, 820]];
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${1.06 + 0.06 * f / d})`, transformOrigin: "44% 80%" }}>
        <Img src={img("p019")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: on
        ? `radial-gradient(circle ${R}px at ${bx}% ${by}%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 42%, rgba(4,4,10,${dark * flick}) 100%)`
        : `rgba(4,4,10,${dark})` }} />
      {on ? <AbsoluteFill style={{ background: `radial-gradient(circle ${R * 0.8}px at ${bx}% ${by}%, rgba(255,236,190,0.16), rgba(255,236,190,0) 70%)`, mixBlendMode: "screen" }} /> : null}
      {words.map(([w, t, x, y], i) => {
        const u = sp(f, fr(t) - t0, 14, 200);
        return <div key={i} style={{ position: "absolute", left: x, top: y, opacity: u, transform: `translateY(${(1 - u) * 24}px) rotate(-4deg)`, fontFamily: HAND, fontSize: 96, color: "#F3E9D2", textShadow: "0 0 30px rgba(255,220,160,0.35)" }}>{w}</div>;
      })}
      <Grain />
    </AbsoluteFill>
  );
};

// 6 · el video anterior — miniatura real en 3D que orbita; título palabra por palabra al ritmo de la voz; sale entrando en la miniatura
const TITLE: [string, number][] = [["The", 39.47], ["Laundry", 39.71], ["Mistake", 40.09], ["Silently", 40.91], ["Destroying", 41.45], ["Your", 41.99], ["Towels", 42.33]];
const LastVideo: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(); const T = d; const t0 = fr(37.67);
  const c = sp(f, 0, 14, 110), tag = sp(f, 8, 13, 180);
  const cam = f / T;
  return (
    <Stage f={f} T={T} push={[50, 39.8, 2.4]} drift={0.5}>
      <Bed k="p030" f={f} T={T} dim={0.5} />
      <div style={{ position: "absolute", left: 960, top: 430, translate: "-50% -50%",
        transform: `perspective(1800px) rotateY(${22 - 26 * cam}deg) rotateX(${6 - 4 * cam}deg) translateY(${(1 - c) * 500}px) scale(${0.9 + 0.1 * c})`, opacity: cl(c * 2) }}>
        <div style={{ position: "relative", width: 1000, height: 562, borderRadius: 18, overflow: "hidden", boxShadow: "0 70px 120px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.25)" }}>
          <Img src={img("img/cltoilet/th_cltowels.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.03 + 0.04 * cam})` }} />
          <div style={{ position: "absolute", top: "-40%", bottom: "-40%", width: "26%", left: `${-40 + ((f * 1.2) % 220)}%`, transform: "rotate(14deg)", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.2), rgba(255,255,255,0))" }} />
          <div style={{ position: "absolute", left: "50%", top: "50%", translate: "-50% -50%", width: 130, height: 92, borderRadius: 24, background: "rgba(200,30,30,0.92)", opacity: lin(f, 20, 34, 0, 0.9) * (1 - lin(f, T - 14, T - 6, 0, 1)) }}>
            <div style={{ position: "absolute", left: 50, top: 26, width: 0, height: 0, borderTop: "20px solid transparent", borderBottom: "20px solid transparent", borderLeft: "34px solid #fff" }} />
          </div>
        </div>
        <div style={{ position: "absolute", left: -40, top: -40, opacity: tag, transform: `scale(${0.7 + 0.3 * tag}) rotate(-4deg)` }}><Chip txt="MY LAST VIDEO" size={46} bg={C.red} color="#fff" /></div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, textAlign: "center", padding: "0 160px" }}>
        {TITLE.map(([w, t], i) => {
          const u = sp(f, fr(t) - t0, 15, 200);
          return <span key={i} style={{ display: "inline-block", marginRight: 22, fontFamily: SERIF, fontWeight: 800, fontSize: 74, color: C.porc, opacity: u, transform: `translateY(${(1 - u) * 30}px)`, textShadow: "0 6px 26px rgba(0,0,0,0.65)" }}>{w}</span>;
        })}
      </div>
      <Grade vig={0.4} />
    </Stage>
  );
};

// 7 · "Waste not, want not" — la tarjeta escrita a mano de mamá, la letra se escribe al ritmo de la voz
const MamaCard: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(); const t0 = fr(50.64);
  const c = sp(f, 0, 14, 120);
  const w1 = lin(f, 2, 18, 0, 1, (x) => x), sig = sp(f, fr(50.9) - t0, 14, 160), too = sp(f, fr(52.08) - t0, 12, 200);
  return (
    <AbsoluteFill>
      <Bed k="p021" f={f} T={d} dim={0.45} />
      <div style={{ position: "absolute", left: 960, top: 520, translate: "-50% -50%", transform: `perspective(1600px) rotateX(${(1 - c) * 40}deg) rotateZ(${-3 + 1.5 * f / d}deg) translateY(${(1 - c) * 400}px) scale(${1 + 0.04 * f / d})` }}>
        <div style={{ position: "relative", width: 1100, height: 560, background: "#F8F1DF", borderRadius: 6, boxShadow: "0 60px 110px rgba(0,0,0,0.55)",
          backgroundImage: "repeating-linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 62px, rgba(90,120,170,0.25) 63px, rgba(0,0,0,0) 64px)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 120, top: 0, bottom: 0, width: 2, background: "rgba(200,70,70,0.35)" }} />
          <div style={{ position: "absolute", left: 170, top: 120, fontFamily: HAND, fontSize: 112, whiteSpace: "nowrap", color: "#2E3B63", clipPath: `inset(0 ${100 - w1 * 100}% 0 0)` }}>Waste not, want not.</div>
          <div style={{ position: "absolute", right: 130, top: 340, fontFamily: HAND, fontSize: 80, color: "#2E3B63", opacity: sig, transform: `translateX(${(1 - sig) * 30}px)` }}>— Mama</div>
          <AbsoluteFill style={{ background: "linear-gradient(160deg, rgba(255,250,235,0.3), rgba(0,0,0,0) 40%, rgba(60,40,20,0.14))" }} />
        </div>
        <div style={{ position: "absolute", left: 470, top: -26, width: 170, height: 52, background: "rgba(236,226,196,0.85)", transform: "rotate(-4deg)", boxShadow: "0 3px 8px rgba(0,0,0,0.2)" }} />
        <div style={{ position: "absolute", right: -60, bottom: -40, opacity: too, transform: `scale(${0.6 + 0.4 * too}) rotate(-5deg)` }}><Chip txt="…the bathroom too" font={HAND} size={70} ls={0} bg={C.lilacDeep} color="#fff" /></div>
      </div>
      <Grade vig={0.36} />
    </AbsoluteFill>
  );
};

// 8 · brush · base · hinge — tres copias golpean en la palabra; fondo = el mismo baño del plano anterior desenfocado (continuidad)
const THREE: { k: string; t: string; at: number }[] = [{ k: "p124", t: "THE BRUSH", at: 58.64 }, { k: "p154", t: "THE BASE", at: 59.22 }, { k: "p149", t: "THE HINGE", at: 59.74 }];
const Triad: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(); const t0 = fr(58.64);
  return (
    <AbsoluteFill>
      <Bed k="p164" f={f + 60} T={d + 60} dim={0.5} />
      {THREE.map((x, i) => {
        const u = sp(f, fr(x.at) - t0, 11, 260);
        const X = 380 + i * 580, R = [-4, 2.5, -2][i];
        return (
          <div key={i} style={{ position: "absolute", left: X, top: 520, translate: "-50% -50%", transform: `scale(${1.6 - 0.6 * u}) rotate(${R}deg)`, opacity: cl(u * 3) }}>
            <Print k={x.k} w={480} h={400} f={f + i * 30} mat={13} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: -70, textAlign: "center" }}><Chip txt={x.t} size={44} rot={-R} /></div>
          </div>
        );
      })}
      <Grade vig={0.4} />
    </AbsoluteFill>
  );
};

// ═════════════════════════ EL MONTAJE ═════════════════════════
export const SHOTS: Shot[] = [
  // cold open — golpes cortos sobre la frase, el sello cae en "smells"
  { a: 0.0, b: 0.62, k: "p037", z: [1.3, 1.42], o: [40, 82] },
  { a: 0.62, b: 1.25, k: "p044", z: [1.18, 1.3], o: [40, 60] },
  { a: 1.25, b: 2.0, k: "p146", z: [1.25, 1.38], o: [70, 80] },
  { a: 2.0, b: 3.3, k: "p018", z: [1.05, 1.22], o: [30, 75] },
  { a: 3.3, b: 5.49, k: "cltoilet/p002", vid: true, ofs: 0.6, z: [1.3, 1.42], o: [45, 28], tin: "whip" },
  { a: 5.49, b: 7.69, k: "av", av: true, z: [1.0, 1.04], o: [50, 38] },
  { a: 7.69, b: 9.09, k: "av", av: true, z: [1.28, 1.32], o: [50, 30] }, // punch-in en "smell"
  { a: 9.09, b: 10.15, k: "p167", z: [1.08, 1.18], o: [50, 60], tin: "whip" },
  { a: 10.15, b: 12.67, k: "p054", z: [1.08, 1.2], o: [35, 80], children: <NotBowlMarks a={10.15} /> },
  { a: 12.67, b: 13.89, k: "p037", z: [1.55, 1.7], o: [28, 85], dx: -60 },
  { a: 13.89, b: 17.35, k: "", comp: MistakeOne, tout: "zoom" },
  { a: 17.35, b: 19.07, k: "cltoilet/p010", vid: true, ofs: 0.4, z: [1.25, 1.35], o: [38, 72], tin: "zoom" },
  { a: 19.07, b: 22.21, k: "", comp: PageNine },
  { a: 22.21, b: 24.39, k: "av", av: true, z: [1.0, 1.05], o: [50, 38] },
  { a: 24.39, b: 26.77, k: "", comp: FiveSpots },
  { a: 26.77, b: 28.27, k: "p016", z: [1.0, 1.1], o: [30, 40] }, // match: es la copia #4 a pantalla completa
  { a: 28.27, b: 30.73, k: "av", av: true, z: [1.26, 1.3], o: [50, 30] },
  { a: 30.73, b: 32.65, k: "p162", z: [1.2, 1.4], o: [62, 72], tin: "whip" },
  { a: 32.65, b: 36.41, k: "", comp: DarkPlaces },
  { a: 36.41, b: 37.67, k: "cltoilet/p017", vid: true, ofs: 1.0, z: [1.2, 1.28], o: [50, 30], tin: "whip" },
  { a: 37.67, b: 42.93, k: "", comp: LastVideo, tout: "zoom" },
  { a: 42.93, b: 44.95, k: "p023", z: [1.15, 1.3], o: [25, 50], dx: 50, tin: "zoom" },
  { a: 44.95, b: 46.09, k: "p025", z: [1.1, 1.22], o: [30, 70] },
  { a: 46.09, b: 48.42, k: "p160", z: [1.0, 1.16], o: [55, 80], dx: -40 },
  { a: 48.42, b: 50.64, k: "av", av: true, z: [1.0, 1.05], o: [50, 38] },
  { a: 50.64, b: 53.38, k: "", comp: MamaCard },
  { a: 53.38, b: 56.06, k: "p030", z: [1.2, 1.36], o: [20, 50], dx: 40 },
  { a: 56.06, b: 58.64, k: "p164", z: [1.0, 1.12], o: [45, 65], tin: "whip" },
  { a: 58.64, b: 60.58, k: "", comp: Triad, tout: "whip" },
  { a: 60.58, b: END, k: "av", av: true, z: [1.22, 1.3], o: [50, 30], tin: "whip" },
];
// salida automática = entrada del siguiente
SHOTS.forEach((s, i) => { const n = SHOTS[i + 1]; if (n && n.tin && n.tin !== "cut" && !s.tout) s.tout = n.tin; });

// ── sonido: voz + diseño sonoro por debajo (niveles medidos aparte) ──
export const SFX: [number, string, number][] = [
  [0.0, "foley/scrub_toilet", 0.32], [0.62, "foley/scrub_pad", 0.25], [1.25, "foley/scrub_toilet", 0.22],
  [2.27, "design/stamp_rubber", 0.7], [2.29, "design/impact_drum_deep", 0.45],
  [3.12, "design/whoosh_quick", 0.35], [8.92, "design/whoosh_fast_trans", 0.35],
  [11.1, "design/pencil_strokes", 0.45], [11.6, "design/pencil_strokes", 0.35],
  [12.67, "foley/scrub_pad", 0.25], [13.86, "design/impact_drum_deep", 0.5], [14.0, "design/swell_wind", 0.18],
  [16.6, "design/click_slide", 0.3], [17.1, "design/whoosh_cine_fast", 0.32], [18.3, "foley/lid_close_a", 0.35],
  [19.07, "design/page_turn_big", 0.5], [20.15, "design/stamp_traditional", 0.3], [20.47, "design/pencil_strokes", 0.25],
  [22.0, "design/page_stiff", 0.3],
  [24.43, "design/camera_shutter", 0.25], [24.55, "design/camera_shutter", 0.22], [24.67, "design/camera_shutter", 0.22], [24.78, "design/camera_shutter", 0.22], [24.9, "design/camera_shutter", 0.22],
  [25.95, "design/pencil_strokes", 0.35], [26.5, "design/whoosh_air", 0.3],
  [30.31, "foley/flush_bathroom", 0.3], [30.55, "design/whoosh_fast_trans", 0.3], [31.05, "foley/water_bubble", 0.3],
  [32.65, "design/swell_suspense", 0.25], [33.27, "foley/light_pull_switch", 0.5], [34.11, "foley/drip_sink", 0.22],
  [36.25, "design/whoosh_air_quick", 0.35], [37.67, "design/whoosh_sweep_small", 0.3], [38.5, "design/click_interface", 0.25],
  [42.7, "design/whoosh_cine_wind", 0.32], [43.59, "foley/towel_wipe_hands", 0.25], [46.09, "design/texture_suspense", 0.18],
  [50.64, "design/paper_slide", 0.45], [50.7, "design/pen_write", 0.3], [52.08, "design/stamp_rubber", 0.25],
  [53.38, "foley/towel_wipe_hands", 0.3], [55.9, "design/whoosh_slow_sweep", 0.28],
  [58.64, "design/impact_drum_subtle", 0.5], [59.22, "design/impact_drum_subtle", 0.5], [59.74, "design/impact_drum_subtle", 0.55],
  [60.42, "design/whoosh_quick", 0.35],
];

export const Min1: React.FC<{ gain?: Record<string, number>; noVoice?: boolean }> = ({ gain = {}, noVoice }) => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SHOTS.map((s, i) => {
        const lead = s.tin && s.tin !== "cut" ? OV : 0;
        const tail = s.tout && s.tout !== "cut" ? OV : 0;
        const from = fr(s.a) - lead, d = fr(s.b) - fr(s.a);
        const K = s.comp;
        return (
          <Sequence key={i} from={from} durationInFrames={d + lead + tail}>
            {K ? <CompWrap lead={lead} d={d} tout={s.tout}><K d={d} /></CompWrap> : <Plate s={s} d={d} lead={lead} />}
          </Sequence>
        );
      })}
      <Sequence from={0} durationInFrames={fr(3.3)}><ColdText /></Sequence>
      <Sequence from={fr(10.15)} durationInFrames={fr(12.67) - fr(10.15)}><NotBowlText a={10.15} /></Sequence>
      <Grain />
      {noVoice ? null : <Audio src={staticFile("voz.wav")} />}
      {SFX.map(([t, k, v], i) => (
        <Sequence key={"s" + i} from={fr(t)} durationInFrames={Math.min(durationInFrames - fr(t), fr(4))}>
          <Audio src={staticFile(`sfx/${k}.flac`)} volume={(fr_) => v * (gain[k] ?? 1) * (fr_ > fr(3.4) ? Math.max(0, 1 - (fr_ - fr(3.4)) / 18) : 1)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
// componente: corre en su propio tiempo (f=0 en el corte); la salida con movimiento la hace su Stage
export const CompWrap: React.FC<{ lead: number; d: number; tout?: Tr; children: React.ReactNode }> = ({ lead, d, tout, children }) => {
  const f = useCurrentFrame() - lead;
  let tx = 0, sc = 1, bl = 0;
  if (f >= d && tout === "whip") { const u = (f - d + 1) / OV; tx = -1920 * ez(u) * 0.9; bl = 26 * u; }
  if (f >= d && tout === "zoom") { const u = (f - d + 1) / OV; sc = 1 + 0.9 * ez(u); bl = 16 * u; }
  return <AbsoluteFill style={{ transform: `translateX(${tx}px) scale(${sc})`, filter: bl ? `blur(${bl}px)` : undefined }}><Sequence from={lead} layout="none">{children}</Sequence></AbsoluteFill>;
};
