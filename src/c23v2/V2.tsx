// c23 v2 · "23 Arreglos de $2" — MINUTO 1, documental fotorrealista sin cortes (dirección aprobada 16-oct).
// Cada plano = foto/clip real con su propia cámara; las transiciones pasan A TRAVÉS del objeto (zoom-through,
// barrido siguiendo el movimiento, caída). Gráficos de autor: tinta blanca fina anclada a la imagen, un acento dorado.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, spring, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { SHOTS, Shot, SFX2, PTS23 } from "./v2data";

const { fontFamily: SANS } = loadFont("normal", { weights: ["500", "700", "800"] });
const { fontFamily: SERIF } = loadSerif("italic", { weights: ["500", "700"] });
const { fontFamily: MONO } = loadMono("normal", { weights: ["500", "700"] });
const FPS = 30, W = 1920, H = 1080;
const GOLD = "#E8B64C", RED = "#E2483D";
const ease = Easing.bezier(0.65, 0, 0.35, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const k01 = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
const pop = (f: number, t0: number, d = 14) => spring({ frame: f - t0 * FPS, fps: FPS, config: { damping: d, stiffness: 160, mass: 0.7 } });

// ───────── cámara de cada plano ─────────
// kb = [z0, fx0, fy0, z1, fx1, fy1]: zoom y punto de la imagen (0-1) que queda al centro de la pantalla.
type X = { z: number; fx: number; fy: number; dx: number; dy: number; op: number; bx: number; by: number };
function xform(s: Shot, i: number, t: number): X | null {
  const prev = SHOTS[i - 1], next = SHOTS[i + 1];
  const dIn = prev ? prev.out.d : 0, dOut = next ? s.out.d : 0;
  if (t < s.t0 - dIn / 2 - 0.02 || t > s.t1 + dOut / 2 + 0.02) return null;
  let z: number, fx: number, fy: number;
  if (s.keys) {
    const K = s.keys; let j = 0;
    while (j < K.length - 2 && t > K[j + 1][0]) j++;
    const a = K[j], b = K[j + 1], q = ease(k01(t, a[0], b[0]));
    z = Math.exp(lerp(Math.log(a[1]), Math.log(b[1]), q)); fx = lerp(a[2], b[2], q); fy = lerp(a[3], b[3], q);
  } else {
    const k = ease(k01(t, s.t0, s.t1));
    z = Math.exp(lerp(Math.log(s.kb[0]), Math.log(s.kb[3]), k)); fx = lerp(s.kb[1], s.kb[4], k); fy = lerp(s.kb[2], s.kb[5], k);
  }
  let dx = 0, dy = 0, op = 1, bx = 0, by = 0;
  // salida
  if (next && t > s.t1 - dOut / 2) {
    const e = k01(t, s.t1 - dOut / 2, s.t1 + dOut / 2);
    const o = s.out;
    if (o.type === "zoom") { // entra hacia el punto de salida
      const m = 1 + 3.2 * Math.pow(e, 2.4);
      fx = lerp(fx, o.fx ?? fx, ease(Math.min(1, e * 1.6))); fy = lerp(fy, o.fy ?? fy, ease(Math.min(1, e * 1.6)));
      z *= m; const b = 22 * Math.pow(e, 1.5); bx = b; by = b; op = 1 - k01(e, 0.45, 0.85);
    } else if (o.type === "pull") { // se aleja (sale hacia atrás)
      z *= 1 - 0.18 * Math.pow(e, 2); const b = 14 * e * e; bx = b; by = b; op = 1 - k01(e, 0.4, 0.8);
    } else { // barrido en dirección (vx, vy)
      const p = Math.pow(e, 2.2); dx = -(o.vx ?? 0) * W * 1.1 * p; dy = -(o.vy ?? 0) * H * 1.1 * p;
      bx = Math.abs(o.vx ?? 0) * 60 * Math.sin(Math.PI * e); by = Math.abs(o.vy ?? 0) * 60 * Math.sin(Math.PI * e);
    }
  }
  // entrada
  if (prev && t < s.t0 + dIn / 2) {
    const e = k01(t, s.t0 - dIn / 2, s.t0 + dIn / 2);
    const o = prev.out;
    if (o.type === "zoom") { z *= 1 + 0.5 * Math.pow(1 - e, 2); const b = 18 * Math.pow(1 - e, 2); bx = Math.max(bx, b); by = Math.max(by, b); }
    else if (o.type === "pull") { z *= 1 + 0.9 * Math.pow(1 - e, 2.2); const b = 16 * Math.pow(1 - e, 2); bx = Math.max(bx, b); by = Math.max(by, b); op = k01(e, 0.05, 0.5); }
    else { const p = Math.pow(1 - e, 2.2); dx += (o.vx ?? 0) * W * 1.1 * p; dy += (o.vy ?? 0) * H * 1.1 * p; bx = Math.max(bx, Math.abs(o.vx ?? 0) * 60 * Math.sin(Math.PI * e)); by = Math.max(by, Math.abs(o.vy ?? 0) * 60 * Math.sin(Math.PI * e)); }
  }
  // nunca mostrar el borde de la foto
  z = Math.max(1, z);
  const hx = 0.5 / z, hy = 0.5 / z;
  fx = Math.min(1 - hx, Math.max(hx, fx)); fy = Math.min(1 - hy, Math.max(hy, fy));
  return { z, fx, fy, dx, dy, op, bx, by };
}
// punto de la imagen → pantalla
const proj = (x: X, ix: number, iy: number): [number, number] => [W / 2 + (ix - x.fx) * W * x.z + x.dx, H / 2 + (iy - x.fy) * H * x.z + x.dy];

const ShotLayer: React.FC<{ s: Shot; i: number; t: number; f: number }> = ({ s, i, t, f }) => {
  const x = xform(s, i, t);
  if (!x) return null;
  const id = `b${i}`;
  return (
    <AbsoluteFill style={{ opacity: x.op, zIndex: s.z ?? i }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={`${x.bx.toFixed(2)} ${x.by.toFixed(2)}`} /></filter></svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", filter: x.bx + x.by > 0.4 ? `url(#${id})` : undefined,
        transform: `translate(${W / 2 + x.dx}px,${H / 2 + x.dy}px) scale(${x.z}) translate(${-x.fx * W}px,${-x.fy * H}px)` }}>
        {s.vid ? (
          <Sequence from={Math.round((s.t0 - (SHOTS[i - 1]?.out.d ?? 0) / 2 - 0.05) * FPS)} layout="none">
            <OffthreadVideo src={staticFile(`c23v2/${s.vid}.mp4`)} playbackRate={s.rate ?? 1} muted style={{ width: W, height: H, objectFit: "cover" }} />
          </Sequence>
        ) : (
          <Img src={staticFile(`c23v2/${s.img}.jpg`)} style={{ width: W, height: H, objectFit: "cover" }} />
        )}
        {s.id === "banco1" && <Book t={t} f={f} mode="open" />}
        {s.id === "banco2" && <Book t={t} f={f} mode="p32" />}
      </div>
    </AbsoluteFill>
  );
};

// ───────── tinta: anotación fina anclada a la imagen ─────────
const Note: React.FC<{ t: number; f: number; shot: string; at: [number, number]; off: [number, number]; t0: number; t1: number; kicker?: string; big?: string; sub?: string; color?: string; align?: "left" | "right" }> = ({ t, f, shot, at, off, t0, t1, kicker, big, sub, color = "#fff", align = "left" }) => {
  if (t < t0 - 0.02 || t > t1 + 0.02) return null;
  const i = SHOTS.findIndex((s) => s.id === shot); const x = xform(SHOTS[i], i, t); if (!x) return null;
  const [px, py] = proj(x, at[0], at[1]);
  const lx = px + off[0], ly = py + off[1];
  const a = pop(f, t0) * interpolate(t, [t1 - 0.25, t1], [1, 0], clamp) * x.op;
  const line = k01(t, t0, t0 + 0.35);
  const ex = lerp(px, lx, ease(line)), ey = lerp(py, ly, ease(line));
  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: a, overflow: "visible" }}>
        <circle cx={px} cy={py} r={10 + 6 * (1 - line)} fill="none" stroke={color} strokeWidth={2.5} />
        <circle cx={px} cy={py} r={3.5} fill={color} />
        <line x1={px} y1={py} x2={ex} y2={ey} stroke={color} strokeWidth={2} />
      </svg>
      <div style={{ position: "absolute", left: lx, top: ly, transform: `translate(${align === "left" ? "14px" : "calc(-100% - 14px)"},-50%)`, opacity: a * k01(t, t0 + 0.2, t0 + 0.45), textAlign: align, color: "#fff", textShadow: "0 2px 14px rgba(0,0,0,.75), 0 1px 3px rgba(0,0,0,.8)", whiteSpace: "nowrap" }}>
        {kicker && <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 5, opacity: 0.92 }}>{kicker}</div>}
        {big && <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 92, lineHeight: 1, letterSpacing: -1, color, margin: "2px 0" }}>{big}</div>}
        {sub && <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 36 }}>{sub}</div>}
      </div>
    </>
  );
};
// palabra corta en los golpes rápidos (hormigas / moho / óxido / grieta)
const Word: React.FC<{ t: number; f: number; t0: number; t1: number; text: string; x?: number; y?: number }> = ({ t, f, t0, t1, text, x = 120, y = 900 }) => {
  if (t < t0 || t > t1) return null;
  const a = interpolate(t, [t0, t0 + 0.12, t1 - 0.1, t1], [0, 1, 1, 0], clamp);
  return <div style={{ position: "absolute", left: x, top: y, opacity: a, transform: `translateY(${(1 - a) * 12}px)`, fontFamily: SANS, fontWeight: 800, fontSize: 64, letterSpacing: 2, color: "#fff", textShadow: "0 3px 18px rgba(0,0,0,.8)" }}>{text}<span style={{ color: GOLD }}>.</span></div>;
};
// la grieta se dibuja sola (dentro del plano)
const CRACK = "M 230 150 L 300 300 L 360 420 L 470 560 L 560 700 L 640 850";
const CrackLine: React.FC<{ t: number }> = ({ t }) => {
  const k = k01(t, 11.55, 12.3), L = 900;
  const win = k01(t, 12.55, 13.1);
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d={CRACK} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray={L} strokeDashoffset={L * (1 - k)} strokeLinecap="round" opacity={0.95} style={{ filter: "drop-shadow(0 0 6px rgba(0,0,0,.7))" }} />
      <rect x={1440} y={140} width={420} height={760} fill="none" stroke="#bfe3ff" strokeWidth={4} opacity={win * 0.9} rx={6} style={{ filter: "drop-shadow(0 0 18px #9fd3ff)" }} />
    </svg>
  );
};
// etiquetas de precio sobre los productos baratos ($2 → $1 → $0)
const Tag: React.FC<{ t: number; f: number; at: [number, number]; t0: number; text: string; color?: string }> = ({ t, f, at, t0, text, color = GOLD }) => {
  if (t < t0 || t > 20.15) return null;
  const i = SHOTS.findIndex((s) => s.id === "baratos"); const x = xform(SHOTS[i], i, t); if (!x) return null;
  const [px, py] = proj(x, at[0], at[1]);
  const s = pop(f, t0, 11) * x.op;
  return (
    <div style={{ position: "absolute", left: px, top: py, transform: `translate(-50%,-120%) scale(${s}) rotate(-4deg)`, fontFamily: SANS, fontWeight: 800, fontSize: 76, color: "#1a140c", background: color, padding: "2px 22px 6px", borderRadius: 10, boxShadow: "0 12px 30px rgba(0,0,0,.5)" }}>
      {text}
      <div style={{ position: "absolute", left: "50%", bottom: -14, width: 2, height: 16, background: color }} />
    </div>
  );
};
// los 23 arreglos marcados sobre la casa real
const Pins23: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  if (t < 20.6 || t > 27.7) return null;
  const i = SHOTS.findIndex((s) => s.id === "casa"); const x = xform(SHOTS[i], i, t); if (!x) return null;
  const sweep = interpolate(t, [22.8, 25.4], [0, 23], clamp);
  return (
    <>
      {PTS23.map(([ix, iy], n) => {
        const t0 = 20.68 + n * 0.06; if (t < t0) return null;
        const [px, py] = proj(x, ix, iy);
        const on = Math.max(0, 1 - Math.abs(sweep - (n + 1)) / 1.6);
        const s = pop(f, t0, 12) * x.op * interpolate(t, [27.3, 27.7], [1, 0], clamp);
        return (
          <div key={n} style={{ position: "absolute", left: px, top: py, transform: `translate(-50%,-50%) scale(${s * (1 + 0.25 * on)})`, width: 44, height: 44, borderRadius: "50%", border: `2.5px solid ${on > 0.05 ? GOLD : "#fff"}`, background: on > 0.05 ? `rgba(232,182,76,${0.35 + 0.5 * on})` : "rgba(0,0,0,.35)", color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 19, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(0,0,0,.5)" }}>{n + 1}</div>
        );
      })}
    </>
  );
};
const Title23: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  if (t < 20.6 || t > 22.9) return null;
  const a = interpolate(t, [20.6, 20.85, 22.6, 22.9], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", opacity: a, color: "#fff", textShadow: "0 4px 24px rgba(0,0,0,.7)" }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 120, letterSpacing: -2, lineHeight: 1 }}><span style={{ color: GOLD }}>23</span> arreglos</div>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 40, marginTop: 6 }}>uno por uno, de toda la casa</div>
    </div>
  );
};
// contador de ahorro (discreto, arriba)
const Saver: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  if (t < 27.7) return null;
  const a = interpolate(t, [27.7, 28.2, 44.3, 44.8], [0, 1, 1, 0], clamp); // se va cuando entra el manual
  if (a <= 0) return null;
  const spin = t > 32.75 && t < 35.4, myst = t >= 35.4;
  const hl = interpolate(t, [28.2, 28.6, 30.0], [0, 1, 0], clamp);
  const v = spin ? String(Math.floor(1000 + ((f * 7919) % 8999))).replace(/\B(?=(\d{3})+(?!\d))/g, ".") : myst ? "?.???" : "0";
  return (
    <div style={{ position: "absolute", left: "50%", top: 54, transform: `translate(-50%, ${(1 - a) * -30}px)`, opacity: a, display: "flex", alignItems: "baseline", gap: 18, padding: "10px 26px", borderRadius: 14, background: "rgba(14,12,10,.55)", backdropFilter: "blur(10px)", border: `1.5px solid rgba(232,182,76,${0.35 + 0.65 * hl})`, boxShadow: `0 10px 30px rgba(0,0,0,.35), 0 0 ${30 * hl}px rgba(232,182,76,.6)` }}>
      <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: 5, color: "#efe6d4" }}>TE AHORRASTE</span>
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 52, color: GOLD, minWidth: 260, textAlign: "right", filter: spin ? "blur(1.2px)" : undefined }}>US$ {v}</span>
    </div>
  );
};

// ───────── el manual sobre el banco (visto desde arriba, dentro del plano) ─────────
const BW = 450, BH = 780; // tapa 0,577
const FL = ["p010", "p014", "p022", "p035", "p037", "p048"], FT = [50.0, 50.5, 51.0, 51.5, 52.0];
const Book: React.FC<{ t: number; f: number; mode: "open" | "p32" }> = ({ t, f, mode }) => {
  const pg = (n: string) => <Img src={staticFile(`c23v2/pages/${n}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "contain", background: "#F6EFDF", display: "block" }} />;
  const sheet: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: BW, height: BH, background: "#F6EFDF", backfaceVisibility: "hidden" };
  const open = mode === "p32" ? 1 : ease(k01(t, 49.3, 49.95));
  const fk = FT.map((a) => ease(k01(t, a, a + 0.42)));
  const done = mode === "p32" ? 0 : fk.filter((k) => k >= 1).length;
  const leftSrc = mode === "p32" ? "p022" : done > 0 ? FL[done - 1] : "p011";
  const rightSrc = mode === "p32" ? "p034" : FL[Math.min(FL.length - 1, done + (fk[done] > 0 ? 1 : 0))];
  const shine = interpolate(t, [47.2, 48.4], [-40, 140], clamp);
  const L = 960 - BW * (1.5 - 0.5 * open); // cerrado: el libro al centro · abierto: el pliego al centro
  return (
    <div style={{ position: "absolute", left: L, top: 540 - BH / 2, width: BW * 2, height: BH, perspective: 2600, perspectiveOrigin: `${BW}px 50%` }}>
      {/* sombra sobre el banco */}
      <div style={{ position: "absolute", left: BW * (1 - open), top: 18, width: BW * (1 + open), height: BH, background: "rgba(0,0,0,.55)", filter: "blur(22px)", borderRadius: 8 }} />
      <div style={{ position: "absolute", left: BW, top: 0, width: BW, height: BH, transformStyle: "preserve-3d" }}>
        {/* canto de las hojas (grosor) */}
        <div style={{ position: "absolute", left: 4, top: 6, width: BW, height: BH, background: "repeating-linear-gradient(90deg,#e9dfc8 0 2px,#d6c9ad 2px 3px)", borderRadius: "0 6px 6px 0" }} />
        <div style={{ ...sheet, boxShadow: "inset 18px 0 26px -10px rgba(0,0,0,.35)" }}>{pg(rightSrc)}</div>
        {done < FT.length && mode === "open" && fk[done] > 0 && (
          <div style={{ ...sheet, transformOrigin: "0 50%", transform: `rotateY(${-180 * fk[done]}deg)`, transformStyle: "preserve-3d" }}>
            <div style={{ ...sheet }}>{pg(FL[done])}</div>
            <div style={{ ...sheet, transform: "rotateY(180deg)" }}>{pg(FL[done])}</div>
          </div>
        )}
        {/* tapa: abre hacia la izquierda; su dorso es la página izquierda */}
        <div style={{ position: "absolute", left: 0, top: 0, width: BW, height: BH, transformOrigin: "0 50%", transform: `rotateY(${-180 * open}deg)`, transformStyle: "preserve-3d" }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: "3px 8px 8px 3px", overflow: "hidden", boxShadow: "inset 6px 0 10px rgba(0,0,0,.35)" }}>
            <Img src={staticFile("c23v2/cover76.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(110deg, transparent ${shine - 12}%, rgba(255,255,255,.38) ${shine}%, transparent ${shine + 12}%)` }} />
          </div>
          <div style={{ ...sheet, transform: "rotateY(180deg)", boxShadow: "inset -18px 0 26px -10px rgba(0,0,0,.35)" }}>{pg(leftSrc)}</div>
        </div>
      </div>
      {mode === "p32" && <Circle32 t={t} />}
    </div>
  );
};
// círculo dorado a mano sobre el título y el número de página
const Circle32: React.FC<{ t: number }> = ({ t }) => {
  const a = k01(t, 60.3, 60.9), b = k01(t, 60.75, 61.3), L = 1500;
  return (
    <svg width={BW * 2} height={BH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <path d={`M ${BW + 30} 150 C ${BW + 120} 95, ${BW + 420} 92, ${BW + 440} 140 C ${BW + 455} 185, ${BW + 140} 200, ${BW + 40} 178 C ${BW + 10} 170, ${BW + 20} 140, ${BW + 70} 118`} fill="none" stroke={GOLD} strokeWidth={5} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - a)} />
      <ellipse cx={BW + BW / 2} cy={BH - 52} rx={40} ry={26} fill="none" stroke={GOLD} strokeWidth={5} strokeDasharray={300} strokeDashoffset={300 * (1 - b)} />
    </svg>
  );
};
// de dónde sale: albañiles viejos · plomeros · mi taller
const Source: React.FC<{ t: number; f: number; t0: number; t1: number; n: string; text: string }> = ({ t, f, t0, t1, n, text }) => {
  if (t < t0 || t > t1) return null;
  const a = interpolate(t, [t0, t0 + 0.2, t1 - 0.2, t1], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 110, bottom: 110, opacity: a, color: "#fff", textShadow: "0 3px 18px rgba(0,0,0,.85)" }}>
      <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 24, color: GOLD, letterSpacing: 3 }}>{n}</div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 66, letterSpacing: -1, transform: `translateX(${(1 - a) * -20}px)` }}>{text}</div>
    </div>
  );
};
const Credit: React.FC<{ t: number; t0: number; t1: number; text: string; sub: string }> = ({ t, t0, t1, text, sub }) => {
  if (t < t0 || t > t1) return null;
  const a = interpolate(t, [t0, t0 + 0.3, t1 - 0.3, t1], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", right: 110, bottom: 120, opacity: a, textAlign: "right", color: "#fff", textShadow: "0 3px 18px rgba(0,0,0,.85)" }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 46 }}>{text}</div>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 32, color: GOLD }}>{sub}</div>
    </div>
  );
};

// ───────── SFX bajos con duck bajo la voz ─────────
import words from "./words.json";
const W_ = words as number[][];
const duck = (fr: number) => { const x = fr / FPS; for (const [a, b] of W_) { if (x < a - 0.05) break; if (x <= b + 0.08) return 0.5; } return 1; };
const SfxTrack: React.FC = () => (
  <>
    {SFX2.map(([t0, file, vol, dur], i) => {
      const n = Math.max(4, Math.round(dur * FPS)), s0 = Math.max(0, Math.round(t0 * FPS));
      return (
        <Sequence key={i} from={s0} durationInFrames={n} layout="none">
          <Audio src={staticFile(`sfx/${file}.wav`)} volume={(fr) => vol * duck(s0 + fr) * interpolate(fr, [n - 6, n], [1, 0], clamp)} />
        </Sequence>
      );
    })}
  </>
);

export const V2: React.FC<{ farm?: boolean }> = ({ farm }) => {
  const f = useCurrentFrame(), t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#0d0b09", overflow: "hidden" }}>
      {!farm && <Audio src={staticFile("c23v2.wav")} />}
      {!farm && <SfxTrack />}
      {SHOTS.map((s, i) => <ShotLayer key={s.id} s={s} i={i} t={t} f={f} />)}

      <AbsoluteFill style={{ zIndex: 100 }}>
      {/* gotera · albañil */}
      <Note t={t} f={f} shot="gota" at={[0.52, 0.3]} off={[230, -40]} t0={2.0} t1={5.0} kicker="ALBAÑIL" big="US$100" sub="sólo por mirar" />
      {/* caño · plomero */}
      <Note t={t} f={f} shot="cano" at={[0.54, 0.55]} off={[-260, -150]} t0={6.45} t1={8.95} kicker="PLOMERO" big="US$70" sub="sólo por venir" align="right" />
      <Word t={t} f={f} t0={9.05} t1={10.1} text="Hormigas" />
      <Word t={t} f={f} t0={10.12} t1={10.6} text="Moho" />
      <Word t={t} f={f} t0={10.6} t1={11.38} text="Óxido" />
      <Word t={t} f={f} t0={11.4} t1={13.4} text="Una grieta" />
      <Note t={t} f={f} shot="grieta" at={[0.24, 0.41]} off={[170, -120]} t0={11.6} t1={13.4} kicker="VUELVE A ABRIRSE" />
      <Note t={t} f={f} shot="grieta" at={[0.8, 0.55]} off={[-120, 230]} t0={12.6} t1={13.4} sub="cada invierno" align="right" color="#bfe3ff" />
      {/* lo que cuesta: $2 → $1 → $0 */}
      <Tag t={t} f={f} at={[0.25, 0.27]} t0={16.2} text="$2" />
      <Tag t={t} f={f} at={[0.48, 0.2]} t0={17.56} text="$1" />
      <Tag t={t} f={f} at={[0.78, 0.6]} t0={18.7} text="$0" color="#9FD9A0" />
      {/* la casa entera, 23 */}
      <Pins23 t={t} f={f} />
      <Title23 t={t} f={f} />
      <Note t={t} f={f} shot="casa" at={[0.45, 0.24]} off={[60, -170]} t0={25.9} t1={26.75} kicker="DESDE EL TECHO" />
      <Note t={t} f={f} shot="casa" at={[0.83, 0.6]} off={[-60, -230]} t0={26.82} t1={27.6} kicker="HASTA EL GARAJE" align="right" />
      <Saver t={t} f={f} />
      <Note t={t} f={f} shot="telefono" at={[0.5, 0.6]} off={[260, -160]} t0={31.36} t1={32.6} kicker="NO LLAMAS A NADIE" color={RED} />
      <Credit t={t} t0={41.2} t1={44.4} text="No son inventados." sub="salen todos del manual" />
      <Source t={t} f={f} t0={53.0} t1={55.45} n="01 · LA CALLE" text="Albañiles viejos" />
      <Source t={t} f={f} t0={55.55} t1={57.25} n="02 · EL OFICIO" text="Plomeros de toda la vida" />
      <Source t={t} f={f} t0={57.3} t1={58.2} n="03 · LA PRÁCTICA" text="Mi propio taller" />
      <Note t={t} f={f} shot="banco2" at={[0.62, 0.86]} off={[240, 10]} t0={60.8} t1={62.73} kicker="PÁGINA 32" sub="la gotera del techo" color={GOLD} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 101, background: "radial-gradient(ellipse at center, transparent 62%, rgba(0,0,0,.28) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
