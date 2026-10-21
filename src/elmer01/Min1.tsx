// elmer01 · MINUTO 1 (0-61,6 s). UNA sola toma, sin cortes secos; todo anclado a la palabra con at("frase"):
// avatar → (la cámara se cae al piso) → toma de rodillas en el garaje → (la toma se encoge a un portal) → garaje 3D en corte:
// camioneta y cortadora se comen el piso → (iris desde la bombita) → avatar → (portal) → góndola de la tienda: $389 + tax = $420
// → (latigazo) → avatar "68" → (el avatar se abre como puerta del granero) → el banco plegado en la pared: 4" → baja, la pata
// traba, 6 bolsas = 300 lb → vuelo a los 3 pallets gratis → (portal) → Elmer con el pallet + junta sin tornillos → banco real que
// baja + recibo de $23 + reloj de una tarde → (latigazo) → avatar con rótulo → (zoom a través) → medidas en 3D → (portal) → foto del
// granero del abuelo → la clavija drawbore que tira → Elmer con el lápiz → avatar (sigue el resto).
// Audio fuera de Remotion (voz + sonido nativo de las tomas en la mezcla, encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { GarageWorld, Key, PT, BENCH, screenOf, camSpeed, GState } from "./garage3d";
import { BigNum, COL, Chips, DrawX, Flash, FONT, LowerThird, P, Portal, Tag, Vid, e, ei, extrude, s, spr } from "./lib";
import caps from "./caps.json";
import avwin from "./avwin.json";

export const MIN1_FRAMES = Math.round(61.6 * 30);

// ---------- at("frase", después_de): segundo exacto de la palabra (Groq ASR) ----------
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9$]/g, "");
const WORDS = (caps as [string, number][]).flatMap(([w, ms]) => w.split(/\s+/).map((x, j) => ({ w: norm(x), t: ms / 1000 + j * 0.25 }))).filter((x) => x.w);
export const at = (phrase: string, after = 0): number => {
  const ws = phrase.split(/\s+/).map(norm).filter(Boolean);
  for (let i = 0; i < WORDS.length; i++) {
    if (WORDS[i].t < after - 0.01) continue;
    let ok = true;
    for (let j = 0; j < ws.length; j++) if (!WORDS[i + j] || WORDS[i + j].w !== ws[j]) { ok = false; break; }
    if (ok) return WORDS[i].t;
  }
  throw new Error(`at(): no encuentro "${phrase}" después de ${after}`);
};

// ---------- tiempos (todos de la voz) ----------
const T = {
  floor: at("floor"), drawer: at("drawer"), screw: at("screw"), back: at("back"), noTable: at("no table"), noRoom: at("no room"),
  truck: at("your truck"), half: at("half the garage"), mower: at("the other half"), mowerW: at("lawnmower"), store: at("so you drive"),
  bench: at("folding wall workbench"), p389: at("$389"), tax: at("plus tax"), math: at("doing the math"), walk: at("walk out"),
  well: at("well i'm"), n68: at("68"), scrap: at("scrap wood"), thisRight: at("and this right here"), flat: at("hangs flat"),
  four: at("4 inches"), pin: at("pull one pin"), drops: at("drops down"), holds: at("holds 300"), p300: at("300 pounds"),
  built: at("i built it"), three: at("three free pallets"), free: at("free pallets"), notOne: at("not one screw"), joints: at("joints together"),
  cost: at("it cost me"), afternoon: at("one afternoon"), name: at("my name's"), fifty: at("50 years"), houses: at("houses"),
  today: at("and today"), cut: at("every cut"), meas: at("every measurement"), oldJoint: at("the old joint"), grand: at("granddaddy"),
  pulls: at("pulls wood tight"), single: at("single screw"), clamp: at("or clamp"), grab: at("grab a pencil"), build: at("let's build it"),
};

// ---------- qué tomas LTX ya llegaron (si falta, va la foto del primer cuadro con zoom lento) ----------
const HAS: Record<string, boolean> = { knees: true, pallet: true, drop: true, pencil: true };
const REEL = true;  // true cuando llega el reel del avatar (public/elmer01/reel0.mp4)

const Shot: React.FC<{ k: string; t: number; a: number; from?: number; z?: [number, number]; dur?: number }> = ({ k, t, a, from = 0, z = [1.03, 1.12], dur = 9 }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + dur);
  return <AbsoluteFill style={{ transform: `scale(${sc})` }}>{HAS[k] ? <Vid id={"ltx_" + k} from={from} at={a} /> : <Vid id={"img_" + k} />}</AbsoluteFill>;
};
const Photo: React.FC<{ id: string; t: number; a: number; z?: [number, number]; dur?: number; style?: React.CSSProperties }> = ({ id, t, a, z = [1.02, 1.12], dur = 8, style }) => (
  <AbsoluteFill style={{ transform: `scale(${z[0] + (z[1] - z[0]) * e(t, a, a + dur)})`, ...style }}><Img src={staticFile(P + id + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
);

// ---------- AVATAR: ventanas pagadas (avwin.json), preroll de 10 cuadros, desenfoque/oscurecido ----------
const WIN = (avwin as { win: { ms: number; me: number; off: number }[] }).win;
const Avatar: React.FC<{ t: number; blur?: number; dark?: number; edge?: number }> = ({ t, blur = 0, dark = 0, edge = 0 }) => {
  const face = REEL ? WIN.filter((w) => w.ms < 62).map((w, i) => (
    <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me ? 1 : 0 }}>
        <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </Sequence>
  )) : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px) brightness(${1 - dark})` : dark > 0 ? `brightness(${1 - dark})` : undefined, transform: blur > 0.2 ? "scale(1.04)" : undefined }}>{face}</AbsoluteFill>
      {edge > 0.01 && <AbsoluteFill style={{ filter: `blur(${14 * edge}px) brightness(.7)`, transform: "scale(1.04)", WebkitMaskImage: "radial-gradient(ellipse 46% 52% at 50% 42%, transparent 55%, #000 100%)" } as React.CSSProperties}>{face}</AbsoluteFill>}
    </AbsoluteFill>
  );
};

// ---------- EL MUNDO: cámara y estado del garaje, todo desde la voz ----------
const K: Key[] = [
  { t: T.noTable - 0.15, p: [-4.4, 1.0, 5.6], l: [-5.6, 0.15, 2.2], fov: 42 },
  { t: T.noRoom + 0.25, p: [1.0, 19.0, 24.0], l: [0.0, 0.0, -2.5], fov: 44, arc: 0.3 },
  { t: T.truck + 0.35, p: [7.0, 21.0, 21.0], l: [1.0, 0.0, -3.0], fov: 44 },
  { t: T.mower + 0.4, p: [-3.0, 20.0, 19.0], l: [-2.0, 0.0, -4.0], fov: 44 },
  { t: T.store, p: [-2.6, 15.0, 13.0], l: [-1.2, 5.0, -2.0], fov: 44 },
  // G · el banco plegado en la pared (el avatar se abre como puerta del granero)
  { t: T.thisRight, p: [-3.2, 4.4, 6.9], l: [-9.8, 3.9, 2.0], fov: 34 },
  { t: T.four - 0.2, p: [-8.0, 4.3, 9.6], l: [-9.85, 4.0, 2.0], fov: 30 },
  { t: T.pin + 0.2, p: [-7.7, 4.2, 9.0], l: [-9.8, 3.9, 2.0], fov: 31 },
  { t: T.drops + 0.15, p: [-3.6, 4.9, 7.6], l: [-9.0, 2.8, 2.0], fov: 37 },
  { t: T.holds, p: [-3.2, 6.2, 7.0], l: [-8.9, 2.7, 2.0], fov: 38 },
  { t: T.built - 0.1, p: [-3.0, 6.4, 6.6], l: [-8.9, 2.8, 2.0], fov: 38 },
  // H · vuelo a los pallets gratis de la entrada
  { t: T.three - 0.05, p: [12.2, 4.2, 23.0], l: [6.5, 1.0, 15.5], fov: 36, arc: 1.1 },
  { t: T.notOne, p: [11.6, 3.9, 22.0], l: [6.5, 1.0, 15.5], fov: 34 },
  // K · medidas del banco abierto
  { t: T.meas - 0.3, p: [-3.4, 5.6, 8.2], l: [-8.9, 2.6, 2.0], fov: 38 },
  { t: T.oldJoint + 0.3, p: [-4.6, 4.8, 7.2], l: [-9.0, 2.6, 2.0], fov: 36 },
];
const stAt = (t: number): GState => ({
  fold: e(t, T.drops, T.drops + 0.75),
  leg: e(t, T.drops + 0.45, T.drops + 1.15),
  bags: t < T.meas - 1 ? Math.max(0, Math.min(6, (t - T.holds) / 0.23)) : 0,
  xray: 0, pallets: e(t, T.three - 0.1, T.three + 0.7), oil: 0, glow: 0, day: 0.75, bulb: 1,
});
const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(K, t), v = { bx: Math.min(4, v0.bx * 0.3), by: Math.min(3, v0.by * 0.3) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><GarageWorld K={K} t={t} st={stAt(t)} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
const sc = (t: number, q: [number, number, number]) => screenOf(K, t, q);

// ======================= PIEZAS NUEVAS DEL MINUTO 1 =======================

// dolor de espalda: anillos rojos que laten sobre la cintura + rayitos en zigzag
const PainPulse: React.FC<{ t: number; at: number; x: number; y: number; out: number }> = ({ t, at, x, y, out }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const rings = [0, 0.33, 0.66].map((d) => ((t - at + d) % 1));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 0 14px rgba(255,60,40,.8))" }}>
        <circle cx={x} cy={y} r={34} fill="rgba(255,60,40,.45)" />
        {rings.map((k, i) => <circle key={i} cx={x} cy={y} r={34 + k * 120} fill="none" stroke={COL.red} strokeWidth={6 * (1 - k)} opacity={1 - k} />)}
        {[-1, 1].map((d) => <polyline key={d} points={`${x + d * 60},${y - 70} ${x + d * 90},${y - 105} ${x + d * 72},${y - 120} ${x + d * 104},${y - 160}`} fill="none" stroke={COL.red} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={160} strokeDashoffset={160 * (1 - e(t, at + 0.1, at + 0.4))} />)}
      </svg>
    </div>
  );
};

// lupa que se abre sobre un detalle (el tornillito que falta)
const Loupe: React.FC<{ t: number; at: number; out: number; x: number; y: number; img: string; ox: number; oy: number; label: string }> = ({ t, at, out, x, y, img, ox, oy, label }) => {
  const k = spr(t, at, 1.1), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const R = 150 * Math.min(1.05, k);
  return (
    <div style={{ position: "absolute", left: x - R, top: y - R, width: 2 * R, height: 2 * R, opacity: o }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 8px #f4efe6, 0 0 0 11px rgba(0,0,0,.4), 0 30px 60px rgba(0,0,0,.7)" }}>
        <Img src={staticFile(P + img + ".jpg")} style={{ position: "absolute", width: 1920 * 2.6, left: -ox * 2.6 + R, top: -oy * 2.6 + R }} />
      </div>
      <div style={{ position: "absolute", left: "50%", top: 2 * R + 18, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 900, fontSize: 38, color: COL.ink, letterSpacing: 3, whiteSpace: "nowrap", textShadow: extrude(5, "rgba(0,0,0,.6)") }}>{label}</div>
    </div>
  );
};

// zona del piso proyectada desde 3D (mitad camioneta / mitad cortadora) que se pinta y "se come" el garaje
const FloorZone: React.FC<{ t: number; at: number; out: number; quad: [number, number, number][]; col: string; label: string }> = ({ t, at, out, quad, col, label }) => {
  const o = e(t, at, at + 0.35) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const pts = quad.map((q) => sc(t, q));
  const cx = pts.reduce((a, p) => a + p.x, 0) / 4, cy = pts.reduce((a, p) => a + p.y, 0) / 4;
  const fill = e(t, at, at + 0.6);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <polygon points={pts.map((p) => `${p.x},${p.y}`).join(" ")} fill={col} fillOpacity={0.32 * fill} stroke={col} strokeWidth={5} strokeDasharray="18 12" strokeDashoffset={-t * 60} />
      </svg>
      <div style={{ position: "absolute", left: cx, top: cy, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * Math.min(1, spr(t, at + 0.2))})`, fontFamily: FONT, fontWeight: 900, fontSize: 64, letterSpacing: 6, color: "#fff", textShadow: extrude(7, "rgba(0,0,0,.55)"), whiteSpace: "nowrap" }}>{label}</div>
    </div>
  );
};

// mesa fantasma (contorno de una mesa que "no está") que se tacha
const GhostTable: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const d = e(t, at, at + 0.45), L = 1400;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 0 10px rgba(255,255,255,.6))" }}>
        <path d={`M${x - 230} ${y - 40} L${x + 150} ${y - 90} L${x + 290} ${y - 20} L${x - 90} ${y + 40} Z M${x - 230} ${y - 40} L${x - 230} ${y + 130} M${x - 90} ${y + 40} L${x - 90} ${y + 210} M${x + 290} ${y - 20} L${x + 290} ${y + 150} M${x + 150} ${y - 90} L${x + 150} ${y + 60}`}
          fill="none" stroke="#fff" strokeWidth={5} strokeDasharray={`${L}`} strokeDashoffset={L * (1 - d)} strokeLinecap="round" opacity={0.9} />
      </svg>
      <DrawX t={t} at={at + 0.5} x={x - 220} y={y - 110} w={500} h={330} />
      <div style={{ position: "absolute", left: x, top: y - 210, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 900, fontSize: 70, letterSpacing: 8, color: COL.ink, textShadow: extrude(7, "rgba(0,0,0,.6)"), opacity: e(t, at + 0.2, at + 0.4) }}>NO TABLE</div>
    </div>
  );
};

// etiqueta de góndola enorme: se cuelga, se balancea, y el impuesto la empuja de 389 a 420 con un contador
const ShelfTag: React.FC<{ t: number; at: number; tax: number; out: number; x: number; y: number }> = ({ t, at, tax, out, x, y }) => {
  const k = spr(t, at, 1.0), o = e(t, at, at + 0.08) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sw = Math.sin((t - at) * 4.2) * 12 * Math.exp(-(t - at) * 1.6) + Math.sin((t - tax) * 6) * 6 * Math.exp(-Math.max(0, t - tax) * 2) * (t > tax ? 1 : 0);
  const v = Math.round(389 + 31 * ei(t, tax + 0.15, tax + 1.1));
  const dropOut = ei(t, out - 0.6, out + 0.3);
  return (
    <div style={{ position: "absolute", left: x, top: y + dropOut * 700, opacity: o, transformOrigin: "50% -70px", transform: `translate(-50%,0) rotate(${sw + dropOut * 25}deg) scale(${Math.min(1.04, k)})`, perspective: 1000 }}>
      <svg width={6} height={70} style={{ position: "absolute", left: "50%", top: -70 }}><line x1={3} y1={0} x2={3} y2={70} stroke="#ddd" strokeWidth={3} /></svg>
      <div style={{ transform: "rotateY(-12deg)", background: "linear-gradient(180deg,#ffe24a,#f1b815)", borderRadius: 16, padding: "18px 44px 22px", boxShadow: "0 40px 70px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.6), inset 0 -6px 0 rgba(0,0,0,.12)", fontFamily: FONT, color: "#1f1606", textAlign: "center", minWidth: 470 }}>
        <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 5 }}>FOLDING WALL BENCH</div>
        <div style={{ fontWeight: 900, fontSize: 170, lineHeight: 1, letterSpacing: -2 }}><span style={{ fontSize: 90, verticalAlign: "top" }}>$</span>{v}</div>
        <div style={{ fontWeight: 900, fontSize: 34, letterSpacing: 4, color: "#a3200f", opacity: e(t, tax, tax + 0.2), transform: `scale(${t > tax ? Math.min(1.1, spr(t, tax, 1.3)) : 0})` }}>+ TAX</div>
      </div>
    </div>
  );
};

// cuenta a mano alzada (lápiz sobre la imagen): 389 + 31 = 420, raya, y "NOPE." al irse
const MathNote: React.FC<{ t: number; at: number; walk: number; out: number; x: number; y: number }> = ({ t, at, walk, out, x, y }) => {
  const o = e(t, at - 0.1, at + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const L = ["  389", "+  31", "—————", "  420"];
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "rotate(-4deg)", fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 64, color: "#fdf8ec", lineHeight: 1.05, textShadow: "0 3px 12px rgba(0,0,0,.85)", whiteSpace: "pre" }}>
      {L.map((l, i) => { const a = at + i * 0.22; const n = Math.round(l.length * e(t, a, a + 0.2)); return <div key={i}>{l.slice(0, n)}</div>; })}
      {t > walk && <div style={{ marginTop: 16, fontFamily: FONT, fontSize: 92, color: COL.red, letterSpacing: 4, transform: `scale(${Math.min(1.1, spr(t, walk, 1.4))})`, transformOrigin: "0 50%" }}>NOPE.</div>}
    </div>
  );
};

// cota 3D: flecha doble entre dos puntos proyectados con número (las medidas reales del banco)
const Dim: React.FC<{ t: number; at: number; out: number; a: [number, number, number]; b: [number, number, number]; label: string; col?: string; off?: [number, number] }> = ({ t, at, out, a, b, label, col = COL.amber, off = [0, -40] }) => {
  const o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const A = sc(t, a), B = sc(t, b), d = ei(t, at, at + 0.45);
  const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2, ang = Math.atan2(B.y - A.y, B.x - A.x);
  const Bx = A.x + (B.x - A.x) * d, By = A.y + (B.y - A.y) * d;
  const ar = (x: number, y: number, a2: number) => `${x + Math.cos(a2 + 2.6) * 22},${y + Math.sin(a2 + 2.6) * 22} ${x},${y} ${x + Math.cos(a2 - 2.6) * 22},${y + Math.sin(a2 - 2.6) * 22}`;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, filter: `drop-shadow(0 0 8px ${col}) drop-shadow(0 3px 6px rgba(0,0,0,.7))` }}>
        <line x1={A.x} y1={A.y} x2={Bx} y2={By} stroke={col} strokeWidth={5} strokeLinecap="round" />
        <polyline points={ar(A.x, A.y, ang + Math.PI)} fill="none" stroke={col} strokeWidth={5} strokeLinecap="round" />
        {d > 0.97 && <polyline points={ar(B.x, B.y, ang)} fill="none" stroke={col} strokeWidth={5} strokeLinecap="round" />}
      </svg>
      <div style={{ position: "absolute", left: mx + off[0], top: my + off[1], transform: `translate(-50%,-50%) scale(${Math.min(1.08, spr(t, at + 0.3))})`, fontFamily: FONT, fontWeight: 900, fontSize: 66, color: col, letterSpacing: 2, textShadow: extrude(6, "rgba(0,0,0,.6)"), whiteSpace: "nowrap" }}>{label}</div>
    </div>
  );
};

// botón giratorio (el "pin") que gira 90° con un destello: así se suelta el banco
const TurnButton: React.FC<{ t: number; at: number; turn: number; out: number; x: number; y: number }> = ({ t, at, turn, out, x, y }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const r = ei(t, turn, turn + 0.35) * 90;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.05, spr(t, at))})` }}>
      <div style={{ width: 230, height: 230, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,210,120,.25), rgba(0,0,0,.55) 70%)", boxShadow: `0 0 0 5px ${COL.amber}, 0 0 40px ${COL.amber}88`, position: "relative" }}>
        <div style={{ position: "absolute", left: 115 - 22, top: 115 - 90, width: 44, height: 180, borderRadius: 12, transform: `rotate(${r}deg)`, background: "linear-gradient(90deg,#8a6236,#c49460 50%,#8a6236)", boxShadow: "0 10px 20px rgba(0,0,0,.6), inset 0 0 0 2px rgba(0,0,0,.25)" }} />
        <div style={{ position: "absolute", left: 103, top: 103, width: 24, height: 24, borderRadius: "50%", background: "#c9ccd1", boxShadow: "inset 0 -3px 4px rgba(0,0,0,.4)" }} />
      </div>
      <div style={{ position: "absolute", left: "50%", top: 250, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 4, color: COL.amber, whiteSpace: "nowrap", textShadow: extrude(5, "rgba(0,0,0,.6)") }}>PULL ONE PIN</div>
    </div>
  );
};

// golpe de la pata que traba: onda en el piso + "CLUNK"
const Clunk: React.FC<{ t: number; at: number; x: number; y: number }> = ({ t, at, x, y }) => {
  const k = (t - at) / 0.7;
  if (k < 0 || k > 1) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <ellipse cx={x} cy={y} rx={30 + 170 * k} ry={(30 + 170 * k) * 0.3} fill="none" stroke="#fff" strokeWidth={6 * (1 - k)} opacity={1 - k} />
      </svg>
      <div style={{ position: "absolute", left: x + 40, top: y - 120 - 40 * k, fontFamily: FONT, fontWeight: 900, fontSize: 58, color: "#fff", letterSpacing: 4, opacity: 1 - k * k, transform: `rotate(-8deg) scale(${0.8 + 0.4 * Math.min(1, k * 4)})`, textShadow: extrude(5, "rgba(0,0,0,.6)") }}>CLUNK</div>
    </div>
  );
};

// contador de peso que sube con cada bolsa (50 → 300 LB)
const LoadMeter: React.FC<{ t: number; at: number; per: number; out: number; x: number; y: number }> = ({ t, at, per, out, x, y }) => {
  const o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const n = Math.max(0, Math.min(6, Math.floor((t - at) / per) + 1)), lb = n * 50;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1100 }}>
      <div style={{ transform: "rotateY(-14deg)", display: "flex", alignItems: "flex-end", gap: 18 }}>
        <div style={{ display: "flex", flexDirection: "column-reverse", gap: 8 }}>
          {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ width: 70, height: 26, borderRadius: 6, background: i < n ? "linear-gradient(180deg,#e9dfc4,#c9b98f)" : "rgba(255,255,255,.12)", boxShadow: i < n ? "0 6px 12px rgba(0,0,0,.5)" : "inset 0 0 0 2px rgba(255,255,255,.25)", transform: `translateY(${i === n - 1 ? -12 * (1 - e(t, at + i * per, at + i * per + 0.12)) : 0}px)` }} />)}
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 150, lineHeight: 0.9, color: n >= 6 ? COL.amber : COL.ink, textShadow: extrude(12, "#4a3a26") }}>{lb}<span style={{ fontSize: 56, marginLeft: 8 }}>LB</span></div>
      </div>
    </div>
  );
};

// cartel "FREE" de cartón atado al pallet, con precio tachado
const FreeSign: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const k = spr(t, at, 1.2), o = e(t, at, at + 0.08) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${-6 + Math.sin((t - at) * 5) * 6 * Math.exp(-(t - at) * 2)}deg) scale(${Math.min(1.05, k)})` }}>
      <div style={{ background: "linear-gradient(180deg,#c9a46e,#a9834f)", borderRadius: 6, padding: "14px 38px 18px", boxShadow: "0 30px 50px rgba(0,0,0,.6), inset 0 0 0 3px rgba(60,40,20,.35)", fontFamily: "'Arial Black', Arial, sans-serif", color: "#1e1408", textAlign: "center" }}>
        <div style={{ fontSize: 120, lineHeight: 1, letterSpacing: 4 }}>FREE</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 4 }}>3 PALLETS · FEED STORE</div>
      </div>
    </div>
  );
};

// bloque de madera con volumen (frente + tapa + canto), CSS 3D
export const Block: React.FC<{ x: number; y: number; w: number; h: number; d: number; grain: "h" | "v"; tone?: number; ghost?: boolean }> = ({ x, y, w, h, d, grain, tone = 0, ghost }) => {
  const g = grain === "h" ? "90deg" : "180deg";
  const wood = (l: number) => `repeating-linear-gradient(${g}, rgba(90,55,25,.16) 0 2px, transparent 2px 17px), linear-gradient(${grain === "h" ? "180deg" : "90deg"}, hsl(32,48%,${l + tone}%), hsl(30,45%,${l - 9 + tone}%))`;
  const face = (st: React.CSSProperties, l: number): React.CSSProperties => ({ position: "absolute", backgroundImage: wood(l), boxShadow: "inset 0 0 0 2px rgba(60,35,12,.35)", opacity: ghost ? 0.45 : 1, ...st });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transformStyle: "preserve-3d" }}>
      <div style={face({ inset: 0, transform: `translateZ(${d / 2}px)` }, 62)} />
      <div style={face({ left: 0, top: 0, width: w, height: d, transformOrigin: "50% 0", transform: `translateZ(${d / 2}px) rotateX(-90deg)` }, 72)} />
      <div style={face({ right: 0, top: 0, width: d, height: h, transformOrigin: "100% 50%", transform: `translateZ(${d / 2}px) rotateY(-90deg)` }, 48)} />
      <div style={face({ left: 0, top: 0, width: d, height: h, transformOrigin: "0 50%", transform: `translateZ(${d / 2}px) rotateY(90deg)` }, 50)} />
    </div>
  );
};
// LA JUNTA (drawbore): la espiga entra en la caja del poste, la clavija atraviesa el agujero corrido y cierra el hombro — sin tornillos
export const Drawbore: React.FC<{ t: number; at: number; peg: number; out: number; x: number; y: number; scale?: number; showScrew?: number; showClamp?: number }> = ({ t, at, peg, out, x, y, scale = 1, showScrew, showClamp }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const inK = ei(t, at, at + 0.6), pK = ei(t, peg, peg + 0.8), pull = ei(t, peg + 0.35, peg + 0.9);
  const gap = 30 * (1 - pull), tenX = -300 * (1 - inK) - gap;
  const ry = -32 + Math.sin((t - at) * 0.5) * 5;
  const glow = e(t, peg + 0.8, peg + 0.95) * (1 - e(t, peg + 1.2, peg + 1.8));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${scale})` }}>
      <div style={{ position: "relative", width: 900, height: 560, perspective: 1700 }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateX(-18deg) rotateY(${ry}deg)` }}>
          {/* poste con la caja */}
          <Block x={440} y={30} w={170} h={500} d={170} grain="v" />
          {/* travesaño + espiga (la espiga, fantasma, adentro del poste) */}
          <div style={{ position: "absolute", left: 0, top: 0, width: 900, height: 560, transformStyle: "preserve-3d", transform: `translateX(${tenX}px)` }}>
            <Block x={40} y={200} w={400} h={150} d={120} grain="h" tone={4} />
            <Block x={440} y={232} w={150} h={86} d={70} grain="h" tone={4} ghost />
          </div>
          {/* agujero corrido + clavija de roble que entra desde adelante */}
          <div style={{ position: "absolute", left: 525 - 17, top: 275 - 17, width: 34, height: 34, borderRadius: "50%", background: "#2e1b0b", boxShadow: "0 0 0 4px rgba(255,210,120,.7)", transform: "translateZ(86px)", opacity: 1 - pK }} />
          {pK > 0 && <div style={{ position: "absolute", left: 525 - 17, top: 275 - 17 - 5 * pull, width: 34, height: 34, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #b07a45, #5e3a1a)", boxShadow: `0 0 0 3px #3e2410, 0 0 ${30 * glow}px ${12 * glow}px rgba(255,190,90,.8)`, transform: `translateZ(${86 + (1 - pK) * 380}px)` }} />}
        </div>
        <svg width={900} height={560} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: e(t, peg + 0.35, peg + 0.55) }}>
          <path d="M 150 450 C 250 500, 330 490, 400 430" fill="none" stroke={COL.amber} strokeWidth={9} strokeLinecap="round" />
          <polyline points="372,428 402,428 398,458" fill="none" stroke={COL.amber} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ position: "absolute", left: 20, top: 500, fontFamily: FONT, fontWeight: 900, fontSize: 44, letterSpacing: 4, color: COL.amber, whiteSpace: "nowrap", textShadow: extrude(5, "rgba(0,0,0,.6)"), opacity: e(t, peg + 0.4, peg + 0.6) }}>PULLS IT TIGHT</div>
      </div>
      {showScrew !== undefined && <NoTool t={t} at={showScrew} x={-180} y={-20} kind="screw" />}
      {showClamp !== undefined && <NoTool t={t} at={showClamp} x={880} y={-20} kind="clamp" />}
    </div>
  );
};
// tornillo / sargento dibujados y tachados
const NoTool: React.FC<{ t: number; at: number; x: number; y: number; kind: "screw" | "clamp" }> = ({ t, at, x, y, kind }) => {
  const k = spr(t, at, 1.2), o = e(t, at, at + 0.08);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `scale(${Math.min(1.05, k)})` }}>
      <svg width={220} height={220} viewBox="0 0 220 220" style={{ filter: "drop-shadow(0 10px 16px rgba(0,0,0,.6))" }}>
        {kind === "screw" ? (
          <g>
            <ellipse cx={110} cy={38} rx={44} ry={14} fill="#d7dbe0" stroke="#7d848c" strokeWidth={3} />
            <line x1={92} y1={38} x2={128} y2={38} stroke="#555" strokeWidth={5} />
            <path d="M92 44 L128 44 L118 190 L110 205 L102 190 Z" fill="#b9bfc6" stroke="#7d848c" strokeWidth={3} />
            {Array.from({ length: 8 }, (_, i) => <line key={i} x1={94 + i * 0.9} y1={60 + i * 17} x2={126 - i * 0.9} y2={52 + i * 17} stroke="#7d848c" strokeWidth={3} />)}
          </g>
        ) : (
          <g fill="none" strokeLinecap="round">
            <path d="M40 40 L40 180 M40 40 L170 40 M40 180 L170 180" stroke="#2f6fd0" strokeWidth={18} />
            <line x1={150} y1={40} x2={150} y2={100} stroke="#b9bfc6" strokeWidth={10} />
            <rect x={130} y={100} width={40} height={18} fill="#2f6fd0" />
          </g>
        )}
        <circle cx={110} cy={110} r={96} fill="none" stroke={COL.red} strokeWidth={14} opacity={e(t, at + 0.1, at + 0.25)} />
        <line x1={42} y1={178} x2={178} y2={42} stroke={COL.red} strokeWidth={14} strokeLinecap="round" strokeDasharray={200} strokeDashoffset={200 * (1 - e(t, at + 0.15, at + 0.35))} />
      </svg>
    </div>
  );
};

// recibo de lo que costó (renglón por palabra, total en rojo) — título propio
const Receipt23: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const rows = [["3 PALLETS", 0], ["WOOD GLUE", 6], ["3 HINGES", 12], ["4 LAG SCREWS", 3], ["OIL + SANDPAPER", 2]] as [string, number][];
  const o = e(t, at - 0.2, at) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const per = 0.14, shown = rows.filter((_, i) => t >= at + i * per), totalAt = at + rows.length * per + 0.1;
  const H2 = 130 + shown.length * 50 + (t >= totalAt ? 96 : 0);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1300 }}>
      <div style={{ transform: "rotateY(-16deg) rotateX(4deg) rotateZ(1.5deg)", width: 470, height: H2, background: "linear-gradient(180deg,#fbfaf6,#efece3)", borderRadius: 4, boxShadow: "0 40px 80px rgba(0,0,0,.65)", padding: "26px 30px", fontFamily: "'Courier New', monospace", color: "#1c1c1c", overflow: "hidden" }}>
        <div style={{ fontWeight: 900, fontSize: 28, letterSpacing: 3, textAlign: "center", borderBottom: "2px dashed #999", paddingBottom: 10, marginBottom: 12 }}>ELMER'S BENCH</div>
        {shown.map(([n, v], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 29, fontWeight: 700, lineHeight: "50px", opacity: e(t, at + i * per, at + i * per + 0.1) }}><span>{n}</span><span>{v === 0 ? "FREE" : "$" + v}</span></div>)}
        {t >= totalAt && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 50, fontWeight: 900, borderTop: "2px dashed #999", marginTop: 10, paddingTop: 12, color: "#b3261e", transform: `scale(${Math.min(1.08, spr(t, totalAt))})`, transformOrigin: "100% 50%" }}><span>TOTAL</span><span>$23</span></div>}
      </div>
    </div>
  );
};

// reloj de sol de "una tarde": arco 1 PM → 5 PM con el sol que lo recorre
const Afternoon: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = e(t, at - 0.1, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const k = ei(t, at, at + 1.2), a = Math.PI * (1 - (0.25 + 0.5 * k)), R = 210;
  const sx = R + Math.cos(a) * R, sy = R - Math.sin(a) * R;
  const hh = Math.round(1 + 4 * k);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
      <svg width={2 * R + 40} height={R + 120} style={{ overflow: "visible", filter: "drop-shadow(0 8px 14px rgba(0,0,0,.6))" }}>
        <path d={`M 20 ${R + 20} A ${R} ${R} 0 0 1 ${2 * R + 20} ${R + 20}`} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={6} strokeDasharray="4 14" />
        <path d={`M ${20 + R + Math.cos(Math.PI * 0.75) * R} ${R + 20 - Math.sin(Math.PI * 0.75) * R} A ${R} ${R} 0 0 1 ${sx + 20} ${sy + 20}`} fill="none" stroke={COL.amber} strokeWidth={8} strokeLinecap="round" />
        <circle cx={sx + 20} cy={sy + 20} r={30} fill="#ffd36b" style={{ filter: "drop-shadow(0 0 22px #ffb257)" }} />
        <line x1={0} y1={R + 22} x2={2 * R + 40} y2={R + 22} stroke="rgba(255,255,255,.6)" strokeWidth={4} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: R + 40, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 52, letterSpacing: 4, color: COL.ink, textShadow: extrude(5, "rgba(0,0,0,.6)") }}>1 PM → {hh} PM</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: R + 104, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: COL.amber }}>ONE AFTERNOON</div>
    </div>
  );
};

// marco de foto vieja que cae sobre el mundo (el granero del abuelo), con rótulo a mano
const OldPhoto: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = spr(t, at, 0.9), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const rz = -5 + (1 - Math.min(1, k)) * -20;
  return (
    <div style={{ position: "absolute", left: 960, top: 520, opacity: o, transform: `translate(-50%,-50%) perspective(1400px) rotateX(${(1 - Math.min(1, k)) * 40}deg) rotateZ(${rz}deg) scale(${0.62 + 0.06 * e(t, at, at + 6)})` }}>
      <div style={{ padding: 22, paddingBottom: 90, background: "#efe7d6", boxShadow: "0 50px 100px rgba(0,0,0,.75)" }}>
        <Img src={staticFile(P + "img_barnold.jpg")} style={{ width: 1500, height: 840, objectFit: "cover", filter: "sepia(.35) contrast(1.05)" }} />
        <div style={{ position: "absolute", left: 40, bottom: 18, fontFamily: "'Segoe Script', 'Brush Script MT', cursive", fontSize: 54, color: "#3b2a18" }}>Granddaddy's barn — still standing</div>
      </div>
    </div>
  );
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];

  // ===== A · 0 → piso · avatar; en "floor" la cámara se cae al piso (giro en X + blur) y aterriza en la toma de rodillas =====
  const A1 = T.floor + 0.45;
  if (t < A1 + 0.5) {
    const k = ei(t, A1 - 0.3, A1 + 0.15);
    L.push(<AbsoluteFill key="avA" style={{ transform: `perspective(1500px) rotateX(${k * 70}deg) translateY(${k * -260}px)`, transformOrigin: "50% 100%", opacity: 1 - e(t, A1, A1 + 0.15), filter: k > 0.05 ? `blur(${k * 10}px)` : undefined }}><Avatar t={t} /></AbsoluteFill>);
  }
  // ===== B · toma de rodillas: cajón, el tornillito (lupa), la espalda que late =====
  if (t >= A1 - 0.2 && t < T.noTable + 0.55) {
    const inK = ei(t, A1 - 0.2, A1 + 0.25), shrink = ei(t, T.noTable - 0.1, T.noTable + 0.45);
    L.push(
      <AbsoluteFill key="shotB" style={{ transform: `perspective(1500px) rotateX(${(1 - inK) * -55}deg) translateY(${(1 - inK) * 300}px)`, transformOrigin: "50% 0%", opacity: e(t, A1 - 0.2, A1 + 0.05) }}>
        <Portal x={960} y={760} r={1 - shrink * 0.999} ring={shrink > 0 ? 1 : 0}>
          <Shot k="knees" t={t} a={A1 - 0.2} z={[1.04, 1.16]} dur={6} />
          <Tag t={t} at={T.drawer} x={820} y={640} dx={-180} dy={-150} text="THE DRAWER" out={T.screw - 0.15} size={44} />
          <Loupe t={t} at={T.screw} out={T.back + 0.6} x={430} y={560} img="img_knees" ox={722} oy={975} label="ONE LITTLE SCREW" />
          <PainPulse t={t} at={T.back} x={1150} y={690} out={T.noTable} />
        </Portal>
      </AbsoluteFill>
    );
    if (shrink > 0) L.unshift(<World key="wB" t={t} />);
  }
  // ===== C · el garaje en corte: sin mesa, sin lugar; la camioneta y la cortadora se comen el piso =====
  if (t >= T.noTable + 0.5 && t < T.store + 0.6) {
    L.push(<World key="wC" t={t} />);
    L.push(<GhostTable key="ghost" t={t} at={T.noTable + 0.5} out={T.noRoom + 0.6} x={1060} y={640} />);
    L.push(<FloorZone key="zT" t={t} at={T.half} out={T.store - 0.2} quad={[[-0.6, 0.02, -11.5], [11, 0.02, -11.5], [11, 0.02, 7], [-0.6, 0.02, 7]]} col={COL.ice} label="TRUCK" />);
    L.push(<FloorZone key="zM" t={t} at={T.mower + 0.15} out={T.store - 0.2} quad={[[-9.6, 0.02, -11.5], [-0.6, 0.02, -11.5], [-0.6, 0.02, 7], [-9.6, 0.02, 7]]} col={COL.red} label="MOWER" />);
    const g = sc(t, PT.bulb);
    const r = ei(t, T.store - 0.05, T.store + 0.45);
    if (r > 0) L.push(<Portal key="pD" x={g.x} y={g.y} r={r}><Avatar t={t} /></Portal>);
  }
  // ===== D · avatar "so you drive to the big store…" → portal a la góndola =====
  if (t >= T.store + 0.45 && t < T.bench + 0.65) {
    L.push(<Avatar key="avD" t={t} />);
    const r = ei(t, T.bench, T.bench + 0.55);
    if (r > 0) L.push(<Portal key="pE" x={1300} y={420} r={r}><Photo id="img_store" t={t} a={T.bench} z={[1.18, 1.05]} dur={7} /></Portal>);
  }
  // ===== E · la tienda: etiqueta de $389, + tax → $420, la cuenta, "NOPE." y se va =====
  const EOUT = T.well - 0.05;
  if (t >= T.bench + 0.55 && t < EOUT + 0.5) {
    const bw = e(t, T.math - 0.2, T.math + 0.3);
    L.push(<AbsoluteFill key="store" style={{ filter: `blur(${bw * 5}px) brightness(${1 - bw * 0.35})` }}><Photo id="img_store" t={t} a={T.bench} z={[1.18, 1.05]} dur={7} /></AbsoluteFill>);
    L.push(<ShelfTag key="tag" t={t} at={T.p389 - 0.1} tax={T.tax} out={T.walk + 0.6} x={1130} y={230} />);
    L.push(<MathNote key="math" t={t} at={T.math} walk={T.walk} out={EOUT - 0.15} x={170} y={300} />);
  }
  // ===== F · latigazo al avatar: "68" extruido al costado =====
  const G0 = T.thisRight - 0.05;
  if (t >= EOUT && t < G0 + 0.75) {
    const wk = 1 - ei(t, EOUT, EOUT + 0.4);
    const door = ei(t, G0, G0 + 0.7);
    const body = (
      <AbsoluteFill style={{ perspective: 1600 }}>
        <AbsoluteFill style={{ transformOrigin: "100% 50%", transform: `translateX(${wk * 340}px) rotateY(${door * 100}deg)`, filter: wk > 0.05 ? `blur(${wk * 18}px)` : undefined, boxShadow: door > 0 ? "-30px 0 80px rgba(0,0,0,.8)" : undefined }}>
          <Avatar t={t} />
          <BigNum t={t} at={T.n68} text="68" x={1560} y={420} size={250} edge="#5a3d22" out={T.scrap + 0.8} sub="YEARS OLD" />
          {/* canto de la puerta de granero (tablas) */}
          {door > 0 && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 34, background: "repeating-linear-gradient(180deg,#7a5532 0 120px,#5d3f22 120px 124px)", boxShadow: "inset -6px 0 0 #3a2410" }} />}
        </AbsoluteFill>
      </AbsoluteFill>
    );
    if (door > 0) L.push(<World key="wF" t={t} />);
    L.push(<AbsoluteFill key="avF">{body}</AbsoluteFill>);
  }
  // ===== G · el banco plegado en la pared: 4", el pin, baja, la pata traba, 300 lb =====
  if (t >= G0 + 0.6 && t < T.three + 0.1) {
    L.push(<World key="wG" t={t} />);
    L.push(<Dim key="d4" t={t} at={T.four} out={T.pin + 0.2} a={[-10.0, 4.75, BENCH.z + 2.25]} b={[-10 + 0.33 + 0.36, 4.75, BENCH.z + 2.25]} label={'4"'} off={[0, -70]} />);
    const bt = sc(t, [BENCH.x0 + 0.35, BENCH.y + 1.9, BENCH.z + 2.15]);
    L.push(<TurnButton key="tb" t={t} at={T.pin - 0.05} turn={T.pin + 0.35} out={T.drops + 0.1} x={bt.x} y={bt.y - 40} />);
    const lg = sc(t, [BENCH.x0 + BENCH.d - 0.15, 0.02, BENCH.z + 0.55]);
    L.push(<Clunk key="ck" t={t} at={T.drops + 1.1} x={lg.x} y={lg.y} />);
    L.push(<LoadMeter key="lm" t={t} at={T.holds} per={0.23} out={T.built + 0.1} x={1240} y={170} />);
  }
  // ===== H · los 3 pallets gratis → portal a Elmer con el pallet; la junta sin tornillos =====
  if (t >= T.three - 0.1 && t < T.cost + 0.6) {
    L.push(<World key="wH" t={t} />);
    const pp = sc(t, PT.pallets);
    L.push(<FreeSign key="free" t={t} at={T.free} out={T.notOne + 0.2} x={pp.x + 330} y={pp.y - 230} />);
    const r = ei(t, T.notOne - 0.25, T.notOne + 0.3);
    if (r > 0) L.push(<Portal key="pH" x={pp.x} y={pp.y} r={r}>
      <AbsoluteFill style={{ filter: `blur(${7 * e(t, T.notOne + 0.2, T.notOne + 0.5)}px) brightness(${1 - 0.3 * e(t, T.notOne + 0.2, T.notOne + 0.5)})` }}><Shot k="pallet" t={t} a={T.notOne - 0.25} z={[1.03, 1.1]} dur={5} /></AbsoluteFill>
      <Drawbore t={t} at={T.notOne + 0.15} peg={T.joints - 0.1} out={T.cost - 0.1} x={960} y={560} scale={1.0} showScrew={T.notOne + 0.45} />
    </Portal>);
  }
  // ===== I · el banco REAL baja (toma) + recibo de $23 + reloj de una tarde =====
  if (t >= T.cost - 0.1 && t < T.name + 0.6) {
    const wk = ei(t, T.cost - 0.1, T.cost + 0.35);
    L.push(<AbsoluteFill key="shotI" style={{ transform: `translateX(${(1 - wk) * -500}px)`, filter: wk < 0.95 ? `blur(${(1 - wk) * 26}px)` : undefined }}><Shot k="drop" t={t} a={T.cost - 0.1} z={[1.02, 1.1]} dur={4} /></AbsoluteFill>);
    L.push(<Receipt23 key="rc" t={t} at={T.cost + 0.3} out={T.name - 0.15} x={1300} y={130} />);
    L.push(<Afternoon key="sun" t={t} at={T.afternoon - 0.2} out={T.name - 0.15} x={70} y={560} />);
    const r = ei(t, T.name - 0.05, T.name + 0.45);
    if (r > 0) L.push(<AbsoluteFill key="whI" style={{ clipPath: `inset(0 0 0 ${(1 - r) * 100}%)` }}><Avatar t={t} /></AbsoluteFill>);
  }
  // ===== J · avatar con rótulo; "every cut" → fichas =====
  const K0 = T.meas - 0.1;
  if (t >= T.name + 0.4 && t < K0 + 0.6) {
    const z = ei(t, K0 - 0.05, K0 + 0.5);
    L.push(<AbsoluteFill key="avJ" style={{ transform: `scale(${1 + z * 2.2})`, opacity: 1 - e(t, K0 + 0.15, K0 + 0.5), filter: z > 0.05 ? `blur(${z * 12}px)` : undefined }}>
      <Avatar t={t} />
      <LowerThird t={t} at={T.name + 0.2} out={T.today - 0.1} name="ELMER HASKINS" l2="50 YEARS · HOUSES · BARNS · FURNITURE" l2at={T.fifty} />
      <Chips t={t} at={T.cut - 0.05} items={["CUTS", "SIZES", "THE JOINT"]} out={K0 + 0.2} />
    </AbsoluteFill>);
    if (z > 0) L.unshift(<World key="wJ" t={t} />);
  }
  // ===== K · medidas del banco abierto → foto del granero del abuelo → la clavija que tira =====
  if (t >= K0 + 0.2 && t < T.grab + 0.6) {
    L.push(<World key="wK" t={t} />);
    const B = BENCH;
    L.push(<Dim key="dw" t={t} at={T.meas + 0.15} out={T.oldJoint + 0.2} a={[B.x0 + B.d + 0.05, B.y + 0.12, B.z - 2]} b={[B.x0 + B.d + 0.05, B.y + 0.12, B.z + 2]} label={'48"'} off={[0, 60]} />);
    L.push(<Dim key="dd" t={t} at={T.meas + 0.45} out={T.oldJoint + 0.2} a={[B.x0, B.y + 0.12, B.z - 2.05]} b={[B.x0 + B.d, B.y + 0.12, B.z - 2.05]} label={'22"'} col={COL.ice} off={[-40, -50]} />);
    L.push(<Dim key="dh" t={t} at={T.meas + 0.75} out={T.oldJoint + 0.2} a={[B.x0 + B.d + 0.05, 0.02, B.z + 2.1]} b={[B.x0 + B.d + 0.05, B.y + 0.07, B.z + 2.1]} label={'34½"'} col="#fff" off={[110, 0]} />);
    const ph = ei(t, T.oldJoint, T.oldJoint + 0.4);
    if (ph > 0) L.push(<AbsoluteFill key="dim" style={{ background: "rgba(10,8,6,.55)", opacity: ph }} />);
    L.push(<OldPhoto key="old" t={t} at={T.oldJoint + 0.05} out={T.pulls - 0.2} />);
    const pb = e(t, T.pulls - 0.3, T.pulls);
    if (pb > 0) L.push(<AbsoluteFill key="dim2" style={{ background: "rgba(10,8,6,.35)", opacity: pb }} />);
    L.push(<Drawbore key="db2" t={t} at={T.pulls - 0.3} peg={T.pulls + 0.15} out={T.grab - 0.2} x={960} y={540} scale={1.1} showScrew={T.single} showClamp={T.clamp} />);
  }
  // ===== L · Elmer agarra el lápiz (toma) → "let's build it" (sigue el avatar en Rest) =====
  if (t >= T.grab - 0.25) {
    const r = ei(t, T.grab - 0.25, T.grab + 0.25);
    L.push(<AbsoluteFill key="shotL" style={{ clipPath: `circle(${r * 120}% at 50% 40%)` }}><Shot k="pencil" t={t} a={T.grab - 0.25} z={[1.0, 1.08]} dur={3} /></AbsoluteFill>);
    L.push(<Flash key="fl" t={t} at={T.build} peak={0.35} />);
    L.push(<div key="lb" style={{ position: "absolute", left: 0, right: 0, top: 850, textAlign: "center", opacity: e(t, T.build, T.build + 0.15), fontFamily: FONT, fontWeight: 900, fontSize: 110, letterSpacing: 10, color: COL.ink, textShadow: extrude(10, "#4a3a26"), transform: `scale(${0.85 + 0.15 * Math.min(1, spr(t, T.build))})` }}>LET'S BUILD IT</div>);
  }
  return <AbsoluteFill style={{ background: "#000" }}>{L}</AbsoluteFill>;
};
