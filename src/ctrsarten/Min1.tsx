// ctrsarten · MINUTO 1 (0-68,75 s). Un solo hilo, sin cortes secos; todo anclado a la VOZ con at("frase"):
// avatar + pastilla 3D → (la pastilla abre el portal) → cronómetro gigante → llama → la costra de diez años se levanta en el mundo 3D
// → (portal desde la sartén) macro de espuma → teléfono → (la pantalla se abre en el avatar) → humo que tapa todo → arroz/leche/cebolla
// → la perilla se apaga → costra "dura como piedra" → (latigazo) avatar con stickers de noche y media hora → (zoom a través de la tarjeta)
// tallando → al fondo del mueble → cocina de noche "nadie te explicó" → (iris desde la sartén) avatar "7 PASOS" → recorrido por el laboratorio
// (costra · colgador con imán · agua + pastilla · cronómetro · espátula) → avatar con las fichas.
// Audio fuera de Remotion (la voz se mezcla en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { KitchenWorld, makeCam, PT, EV0, Ev, win } from "./cocina3d";
import { BigNum, COL, Card3D, Chips, DrawX, Flash, FONT, P, Portal, Tag, Vid, e, ei, extrude, s, spr } from "./lib";
import WORDS from "./words.json";
import AVW from "./avwin.json";

// ---------- at("frase"): segundo en que EMPIEZA la frase en la voz (primera aparición después de `desde`) ----------
const nrm = (w: string) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ]/g, "");
const WN = (WORDS as { w: string; s: number; e: number }[]).map((x) => ({ n: nrm(x.w), s: x.s, e: x.e }));
export const at = (frase: string, desde = 0, fin = false): number => {
  const q = frase.split(/\s+/).map(nrm).filter(Boolean);
  for (let i = 0; i < WN.length - q.length + 1; i++) {
    if (WN[i].s < desde - 0.01) continue;
    let ok = true; for (let k = 0; k < q.length; k++) if (WN[i + k].n !== q[k]) { ok = false; break; }
    if (ok) return fin ? WN[i + q.length - 1].e : WN[i].s;
  }
  throw new Error("at(): no está en la voz → " + frase);
};

export const MIN1_END = (AVW as { win: { ms: number; me: number; off: number }[] }).win[4].me;
export const MIN1_FRAMES = s(MIN1_END);

// ---------- tomas LTX que ya llegaron (si falta: la foto del primer cuadro con zoom lento) ----------
export const HAS: Record<string, boolean> = { c1_pastilla: false, c2_iman: false, c3_espatula: false, c4_reloj: false, m1_espuma: false, l1_telefono: false, l2_humo: false, l3_leche: false, l4_costra: false, l5_tallar: false, l6_mueble: false };
export const REEL = true;  // true cuando llega el reel del avatar (public/ctrsarten/reel0.mp4)

export const Shot: React.FC<{ k: string; t: number; a: number; from?: number; z?: [number, number]; style?: React.CSSProperties }> = ({ k, t, a, from = 0, z = [1.03, 1.11], style }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 8);
  return <AbsoluteFill style={{ transform: `scale(${sc})`, ...style }}>{HAS[k] ? <Vid id={"ltx_" + k} from={from} at={a} /> : <Vid id={"img_" + k} />}</AbsoluteFill>;
};

// ---------- AVATAR: ventanas pagadas (avwin.json), preroll de 10 cuadros ----------
export const WIN = (AVW as { win: { ms: number; me: number; off: number }[] }).win;
export const Avatar: React.FC<{ t: number; blur?: number; dark?: number; edge?: number; style?: React.CSSProperties }> = ({ t, blur = 0, dark = 0, edge = 0, style }) => {
  const face = (
    <>
      {REEL ? WIN.filter((w) => w.me > t - 1 && w.ms < t + 1).map((w) => (
        <Sequence key={w.ms} from={Math.max(0, s(w.ms) - 10)} durationInFrames={s(w.me - w.ms) + 12} layout="none">
          <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me ? 1 : 0 }}>
            <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - (s(w.ms) >= 10 ? 10 : s(w.ms)))} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
        </Sequence>
      )) : <Img src={staticFile(P + "av_still.png")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />}
    </>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      {/* ⛔ el avatar va SIEMPRE nítido: sin blur, sin halo ni borde difuminado (creador, 21-oct). blur/edge quedan sin efecto */}
      <AbsoluteFill style={{ filter: dark > 0 ? `brightness(${1 - dark})` : undefined }}>{face}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- LA CÁMARA (una sola, keyframes anclados a la voz) ----------
const T = {
  diez: at("diez minutos"), fuego: at("fuego bajito"), negro: at("lo negro de diez"), cae: at("se cae solo"), alambre: at("sin fibra"), brazo: at("sin dejarte"),
  mira: at("mira"), estas: at("estás en la cocina"), olor: at("ese olor"), arroz: at("el arroz"), leche: at("la leche que"), cebolla: at("la cebolla"),
  corres: at("corres"), apagas: at("apagas"), fondo: at("el fondo de la sartén"), costra: at("una costra"), piedra: at("dura como piedra"),
  remojo: at("en remojo"), noche: at("toda la noche"), media: at("media hora"), duelen: at("te duelen"), sigue: at("sigue ahí"), gris: at("apenas más gris"),
  guardas: at("la guardas"), tiras: at("o la tiras"), nosupiste: at("no es que no supiste"), nadie: at("nadie te explicó"), eso: at("eso negro"),
  sabes: at("cuando sabes"), despega: at("se despega"), siete: at("siete pasos"), unoxuno: at("uno por uno"),
  q1: at("qué es de verdad"), q2: at("cómo saber qué sartén"), q3: at("cuánta agua"), pastilla3: at("dónde va la pastilla"), q4: at("los diez minutos que"),
  q5: at("cómo se levanta"), q6: at("el fondo de afuera"), q7: at("cómo hacer para que"),
};
const CAM = makeCam([
  { t: 0, p: [0.35, 2.25, 1.5], l: [0.25, 2.3, -1.42], fov: 40 },
  { t: T.diez - 0.1, p: [0.3, 2.32, 1.05], l: [0.22, 2.4, -1.42], fov: 40 },
  { t: T.fuego + 0.9, p: [1.05, 1.38, 1.5], l: [0.55, 0.98, 0.3], fov: 36, arc: 0.25 },
  { t: T.negro + 0.6, p: [0.64, 1.95, 0.98], l: [0.55, 0.99, 0.22], fov: 36 },
  { t: T.mira + 0.6, p: [0.6, 1.72, 0.74], l: [0.55, 1.0, 0.24], fov: 34 },
  { t: T.corres - 0.05, p: [1.05, 1.12, 1.35], l: [0.55, 0.9, 0.58], fov: 38 },
  { t: T.apagas + 0.6, p: [0.95, 1.5, 1.3], l: [0.55, 0.95, 0.42], fov: 38 },
  { t: T.costra + 0.2, p: [0.62, 1.85, 0.9], l: [0.55, 1.0, 0.22], fov: 34 },
  { t: T.nosupiste - 0.05, p: [-0.9, 2.3, 3.1], l: [0.3, 1.25, -0.6], fov: 44 },
  { t: T.eso + 0.3, p: [0.62, 1.62, 0.78], l: [0.55, 1.0, 0.24], fov: 36, arc: 0.3 },
  { t: T.q1 + 1.2, p: [0.62, 1.78, 0.88], l: [0.55, 1.0, 0.22], fov: 34 },
  { t: T.q2 + 0.9, p: [1.37, 1.42, 0.35], l: [1.37, 1.28, -1.42], fov: 38, arc: 0.15 },
  { t: T.q3 + 0.8, p: [0.86, 1.62, 1.18], l: [0.55, 1.0, 0.25], fov: 36, arc: 0.15 },
  { t: T.q4 + 0.7, p: [0.3, 2.3, 1.1], l: [0.22, 2.4, -1.42], fov: 40, arc: 0.1 },
  { t: T.q5 + 0.6, p: [0.72, 1.55, 1.0], l: [0.55, 1.0, 0.22], fov: 34, arc: 0.2 },
  { t: 80, p: [0.68, 1.5, 0.92], l: [0.55, 1.0, 0.22], fov: 32 },
]);

// ---------- los EVENTOS del mundo por tramo ----------
const evAt = (t: number): Ev => {
  // gancho: 10 minutos de fuego bajito → se cae solo
  if (t < T.estas) {
    const run = win(t, T.fuego + 0.2, T.cae);
    return { ...EV0, day: 0.7, flame: win(t, T.fuego, T.fuego + 0.35), water: win(t, T.fuego - 0.3, T.fuego + 0.3), tab: 1 - win(t, T.fuego + 0.4, T.cae), tabDrop: 1,
      foam: win(t, T.fuego + 0.5, T.negro), steam: win(t, T.fuego + 0.8, T.negro + 0.5), rem: 600 * (1 - run), hot: run, glow: win(t, T.diez, T.diez + 0.4) * (1 - win(t, T.fuego + 0.5, T.fuego + 1)),
      crust: 1 - win(t, T.cae + 0.3, T.mira), lift: win(t, T.cae - 0.15, T.mira + 0.6) };
  }
  // el quemado: corres, apagas (la perilla), la costra dura como piedra
  if (t < T.remojo) return { ...EV0, day: 0.55, flame: 1 - win(t, T.apagas, T.apagas + 0.3), smoke: 1 - win(t, T.apagas + 0.5, T.costra + 0.5) * 0.6, glow: 0 };
  // de noche: nadie te explicó qué es eso negro → cuando sabes lo que es, se despega casi solo
  if (t < T.q1 - 0.5) return { ...EV0, day: 0.12, glow: 0.15, lift: win(t, T.sabes + 0.4, T.siete) * 0.45, crust: 1 - win(t, T.sabes + 0.6, T.siete) * 0.3, water: win(t, T.sabes - 0.4, T.sabes), foam: win(t, T.sabes, T.despega) * 0.6 };
  // el recorrido de los 7 pasos
  const run = win(t, T.q4, T.q5 - 0.2);
  return { ...EV0, day: 0.8, rackHi: win(t, T.q2 + 0.3, T.q2 + 2.2), mag: win(t, T.q2 + 0.9, T.q2 + 1.6),
    water: win(t, T.q3, T.q3 + 0.6), tab: win(t, T.pastilla3 - 0.3, T.pastilla3) * (1 - win(t, T.q4 + 0.4, T.q5)), tabDrop: win(t, T.pastilla3, T.pastilla3 + 0.5),
    flame: win(t, T.q4 - 0.2, T.q4 + 0.2), foam: win(t, T.pastilla3 + 0.5, T.q4 + 0.6), steam: win(t, T.q4, T.q4 + 1.2), rem: 600 * (1 - run), hot: run, glow: win(t, T.q4, T.q4 + 0.3) * 0.6,
    lift: win(t, T.q5, T.q6 + 0.5), crust: 1 - win(t, T.q5 + 0.3, T.q6 + 0.3), spat: win(t, T.q5 + 0.1, T.q6 + 0.2) };
};

// mundo 3D con blur de movimiento real (velocidad de cámara proyectada)
const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = CAM.camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><KitchenWorld t={t} ev={evAt(t)} cam={CAM} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
const scr = (t: number, q: [number, number, number]) => CAM.screenOf(t, q);

// ================= PIEZAS NUEVAS DE ESTE MINUTO =================
// la PASTILLA 3D: bloque blanco con capa azul, gira y brilla; después se convierte en el portal
const Tablet3D: React.FC<{ t: number; at: number; x: number; y: number; sc?: number; out?: number }> = ({ t, at, x, y, sc = 1, out = 1e9 }) => {
  const k = spr(t, at, 1.1), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.2));
  if (o <= 0.01) return null;
  const ry = -38 + 30 * Math.sin((t - at) * 0.9), rx = 28 + Math.sin(t * 1.3) * 5, W = 300 * sc, H = 200 * sc, D = 110 * sc;
  const grain = "radial-gradient(rgba(0,0,0,.07) 1px, transparent 1.4px) 0 0/7px 7px, radial-gradient(rgba(255,255,255,.9) 1px, transparent 1.6px) 3px 4px/9px 9px";
  const face = (bg: string, w: number, h: number, tr: string, extra?: React.ReactNode) => <div style={{ position: "absolute", left: -w / 2, top: -h / 2, width: w, height: h, background: bg, transform: tr, borderRadius: 18 * sc, boxShadow: "inset 0 0 30px rgba(0,0,0,.18)", overflow: "hidden" }}>{extra}</div>;
  const top = <div style={{ position: "absolute", inset: 0 }}><div style={{ position: "absolute", left: 0, right: 0, top: "58%", bottom: 0, background: "linear-gradient(180deg,#2f7fe0,#1b56a8)" }} /><div style={{ position: "absolute", left: "38%", top: "26%", width: "24%", height: "38%", borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#ff7b6b,#d0231a)", boxShadow: "0 4px 10px rgba(0,0,0,.35)" }} /></div>;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1400, transform: `scale(${Math.min(1.06, k)})` }}>
      <div style={{ position: "absolute", transformStyle: "preserve-3d", transform: `rotateX(${rx}deg) rotateY(${ry}deg)` }}>
        {face(`${grain}, linear-gradient(135deg,#ffffff,#dfe3e7)`, W, H, `translateZ(${D / 2}px)`, top)}
        {face("#e9ecef", W, H, `rotateY(180deg) translateZ(${D / 2}px)`)}
        {face(`${grain}, linear-gradient(180deg,#e9edf0 58%,#2a72cf 58%)`, D, H, `rotateY(90deg) translateZ(${W / 2}px)`)}
        {face(`${grain}, linear-gradient(180deg,#d9dee3 58%,#1f5fb3 58%)`, D, H, `rotateY(-90deg) translateZ(${W / 2}px)`)}
        {face(`${grain}, #f7f8f9`, W, D, `rotateX(90deg) translateZ(${H / 2}px)`)}
        {face("#1b56a8", W, D, `rotateX(-90deg) translateZ(${H / 2}px)`)}
      </div>
      <div style={{ position: "absolute", left: -W * 0.7, top: -H * 0.9, width: W * 1.4, height: H * 1.8, background: "radial-gradient(circle, rgba(140,200,255,.35), transparent 65%)", mixBlendMode: "screen", pointerEvents: "none" }} />
    </div>
  );
};

// cartel que se escribe solo (frase grande con subrayado que se dibuja)
export const Line: React.FC<{ t: number; at: number; out: number; text: string; y?: number; size?: number; col?: string }> = ({ t, at, out, text, y = 150, size = 84, col = COL.ink }) => {
  const o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.2));
  if (o <= 0.01) return null;
  const n = Math.round(text.length * e(t, at, at + 0.45));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: o, fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: 4, color: col, textShadow: extrude(8, "rgba(0,0,0,.6)") }}>
      {text.slice(0, n)}<span style={{ opacity: 0 }}>{text.slice(n)}</span>
      <div style={{ margin: "6px auto 0", height: 8, width: `${60 * e(t, at + 0.3, at + 0.7)}%`, borderRadius: 4, background: COL.amber, boxShadow: `0 0 18px ${COL.amber}` }} />
    </div>
  );
};

// teléfono 3D con notificaciones que se apilan (sobre el avatar: "se te fue la cabeza con el teléfono")
export const Phone: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const k = spr(t, at, 1), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const notes = ["Mensaje nuevo", "3 videos para ti", "Grupo familia (12)", "¡Oferta!"];
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateY(${(1 - Math.min(1, k)) * 70 - 16}deg) rotateX(8deg) rotateZ(${Math.sin(t * 1.1) * 2}deg)` }}>
      <div style={{ width: 300, height: 600, borderRadius: 46, background: "#0c0d10", padding: 14, boxShadow: "0 50px 90px rgba(0,0,0,.7), inset 0 0 0 3px #2a2c31, 18px 0 0 -6px #1a1b1f" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 34, background: "linear-gradient(160deg,#3b4a7a,#141a2e)", overflow: "hidden", position: "relative" }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, color: "#fff", fontSize: 64, textAlign: "center", marginTop: 50 }}>12:47</div>
          {notes.map((n, i) => {
            const a = at + 0.35 + i * 0.32, kk = spr(t, a, 1.2);
            return <div key={i} style={{ position: "absolute", left: 14, right: 14, top: 170 + i * 92, opacity: e(t, a, a + 0.08), transform: `translateY(${(1 - Math.min(1, kk)) * -40}px) scale(${0.9 + 0.1 * Math.min(1, kk)})`, borderRadius: 18, background: "rgba(255,255,255,.88)", padding: "14px 16px", fontFamily: FONT, fontWeight: 800, fontSize: 22, color: "#1b1e26", boxShadow: "0 8px 18px rgba(0,0,0,.35)" }}>{n}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

// humo que sube y TAPA todo (transición avatar → quemado)
export const SmokeWipe: React.FC<{ t: number; a: number; b: number; c: number }> = ({ t, a, b, c }) => {
  const up = e(t, a, b), out = e(t, b + 0.1, c);
  if (up <= 0.01 || out >= 0.99) return null;
  return (
    <AbsoluteFill style={{ opacity: 1 - out, pointerEvents: "none" }}>
      {Array.from({ length: 14 }, (_, i) => {
        const x = (i / 13) * 2100 - 90 + Math.sin(i * 7.3) * 60, sz = 520 + (i % 4) * 140;
        const y = 1200 - up * (1100 + (i % 3) * 260) + Math.sin(t * 1.4 + i) * 30;
        return <div key={i} style={{ position: "absolute", left: x - sz / 2, top: y - sz / 2, width: sz, height: sz, borderRadius: "50%", background: "radial-gradient(circle, rgba(70,66,62,.95) 0%, rgba(55,52,50,.7) 40%, transparent 70%)", filter: "blur(28px)", transform: `rotate(${t * 20 + i * 30}deg)` }} />;
      })}
    </AbsoluteFill>
  );
};

// sticker 3D brillante con icono dibujado (luna / reloj de 30 min / dedos)
export const Sticker: React.FC<{ t: number; at: number; out: number; x: number; y: number; icon: "luna" | "reloj"; text: string; col: string }> = ({ t, at, out, x, y, icon, text, col }) => {
  const k = spr(t, at, 1.1), o = e(t, at, at + 0.08) * (1 - e(t, out, out + 0.2));
  if (o <= 0.01) return null;
  const sweep = ((t - at) * 0.7) % 1;
  const ic = icon === "luna"
    ? <svg width={110} height={110}><circle cx={55} cy={55} r={40} fill="#ffe7a3" /><circle cx={74} cy={44} r={36} fill="#22305a" /></svg>
    : <svg width={110} height={110}><circle cx={55} cy={55} r={44} fill="#fff" stroke="#22252b" strokeWidth={6} /><path d={`M55 55 L55 15 A40 40 0 ${e(t, at + 0.2, at + 1.6) > 0.5 ? 1 : 0} 1 ${55 + 40 * Math.sin(e(t, at + 0.2, at + 1.6) * Math.PI)} ${55 - 40 * Math.cos(e(t, at + 0.2, at + 1.6) * Math.PI)} Z`} fill={COL.amber} /><line x1={55} y1={55} x2={55 + 34 * Math.sin(e(t, at + 0.2, at + 1.6) * Math.PI)} y2={55 - 34 * Math.cos(e(t, at + 0.2, at + 1.6) * Math.PI)} stroke="#22252b" strokeWidth={6} strokeLinecap="round" /></svg>;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1000px) rotateY(${(1 - Math.min(1, k)) * -80 + Math.sin(t) * 6}deg) rotateZ(-4deg) scale(${Math.min(1.05, k)})` }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 20, padding: "18px 34px 18px 22px", borderRadius: 40, background: `linear-gradient(160deg, ${col}, #1a2236)`, border: "5px solid #fff", boxShadow: "0 30px 60px rgba(0,0,0,.6), 0 10px 0 #c9cfd8", overflow: "hidden" }}>
        {ic}
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 58, color: "#fff", textShadow: extrude(5, "rgba(0,0,0,.5)"), whiteSpace: "nowrap" }}>{text}</div>
        <div style={{ position: "absolute", top: 0, bottom: 0, width: 90, left: `${-20 + sweep * 140}%`, background: "linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent)", transform: "skewX(-20deg)" }} />
      </div>
    </div>
  );
};

// sello rojo que cae girando
export const Stamp: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number }> = ({ t, at, text, x, y, out = 1e9, rot = -9, size = 110 }) => {
  const k = spr(t, at, 1.3), o = e(t, at, at + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
      <div style={{ border: `10px solid ${COL.red}`, borderRadius: 14, padding: "6px 30px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: COL.red, letterSpacing: 4, background: "rgba(20,0,0,.25)", boxShadow: "0 0 30px rgba(255,60,40,.45)", textShadow: "0 4px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

// número de paso que sale del objeto 3D (recorrido del laboratorio)
const Step: React.FC<{ t: number; at: number; out: number; n: number; text: string; q: [number, number, number]; dx?: number; dy?: number; col?: string }> = ({ t, at: a, out, n, text, q, dx = 200, dy = -140, col = COL.amber }) => {
  const p = scr(t, q), k = spr(t, a, 1.1), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.2));
  if (o <= 0.01) return null;
  const lw = 120 + text.length * 36, ex = dx >= 0 ? Math.min(p.x + dx, 1870 - lw) : Math.max(p.x + dx, 50 + lw), ey = Math.max(80, Math.min(1000, p.y + dy));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={p.x} y1={p.y} x2={p.x + (ex - p.x) * Math.min(1, k)} y2={p.y + (ey - p.y) * Math.min(1, k)} stroke={col} strokeWidth={4} />
        <circle cx={p.x} cy={p.y} r={10} fill={col} style={{ filter: `drop-shadow(0 0 12px ${col})` }} />
      </svg>
      <div style={{ position: "absolute", left: ex, top: ey, transform: `translate(${dx >= 0 ? 0 : -100}%,-50%) scale(${0.6 + 0.4 * Math.min(1, k)})`, transformOrigin: dx >= 0 ? "0 50%" : "100% 50%", display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 96, height: 96, borderRadius: 24, background: col, color: "#1b1205", fontFamily: FONT, fontWeight: 900, fontSize: 70, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 30px rgba(0,0,0,.55), inset 0 -6px 0 rgba(0,0,0,.2)" }}>{n}</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 54, color: COL.ink, textShadow: extrude(6, "rgba(0,0,0,.6)"), whiteSpace: "nowrap" }}>{text}</div>
      </div>
    </div>
  );
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const W0 = WIN[0], W1 = WIN[1], W2 = WIN[2], W3 = WIN[3], W4 = WIN[4];

  // ===== A · avatar + la pastilla 3D; la pastilla se agranda y ABRE el portal al cronómetro =====
  if (t < W0.me + 0.05) {
    L.push(<Avatar key="avA" t={t} blur={8 * e(t, W0.me - 0.9, W0.me - 0.3)} dark={0.35 * e(t, W0.me - 0.9, W0.me - 0.3)} />);
    const go = ei(t, W0.me - 0.9, W0.me - 0.3);
    L.push(<Tablet3D key="tab" t={t} at={at("pastilla") - 0.05} x={1420 + (960 - 1420) * go} y={380 + (540 - 380) * go} sc={0.8 + go * 0.6} out={W0.me - 0.35} />);
    L.push(<Tag key="tLav" t={t} at={at("lavavajillas")} x={1420} y={450} dx={-150} dy={170} text="UNA PASTILLA" sub="DE LAVAVAJILLAS" col={COL.ice} out={W0.me - 1.0} size={44} />);
    const r = ei(t, W0.me - 0.45, W0.me);
    if (r > 0) L.push(<Portal key="pA" x={960} y={540} r={r}><World t={Math.max(W0.me - 0.45, t)} /></Portal>);
  }
  // ===== B · cronómetro gigante → llama → la costra de diez años se levanta =====
  if (t >= W0.me && t < T.estas + 0.4) {
    L.push(<World key="wB" t={t} />);
    const ck = scr(t, PT.clock);
    L.push(<Tag key="t10" t={t} at={T.diez} x={ck.x + 220} y={ck.y} dx={140} dy={-60} text="10 MIN" sub="DE FUEGO BAJITO" col={COL.amber} out={T.fuego + 0.6} size={60} />);
    const pn = scr(t, PT.pan);
    L.push(<Tag key="t10a" t={t} at={T.negro + 0.3} x={pn.x} y={pn.y} dx={-260} dy={-170} text="10 AÑOS DE NEGRO" col={COL.ink} out={T.cae - 0.1} size={52} />);
    const prM = ei(t, T.cae + 0.05, T.cae + 0.5) * (1 - ei(t, T.estas - 0.3, T.estas + 0.1));
    if (prM > 0) L.push(<Portal key="pM" x={pn.x} y={pn.y} r={prM}><Shot k="m1_espuma" t={t} a={T.cae} z={[1.0, 1.12]} /></Portal>);
    L.push(<BigNum key="cae" t={t} at={T.cae} text="SE CAE SOLO" y={170} size={120} col="#9df0b4" edge="#1f5a36" out={T.alambre - 0.1} />);
    // sin fibra de alambre / sin dejarte el brazo: las dos tarjetas que se tachan
    L.push(<Card3D key="cAl" id="img_l5_tallar" x={160} y={260} w={560} h={360} ry={-14 + 10 * (1 - Math.min(1, spr(t, T.alambre)))} rx={5} z={(1 - Math.min(1, spr(t, T.alambre))) * -900} o={e(t, T.alambre, T.alambre + 0.08) * (1 - e(t, T.mira - 0.1, T.mira + 0.1))} label="FIBRA DE ALAMBRE" />);
    L.push(<DrawX key="xAl" t={t} at={T.alambre + 0.45} x={200} y={290} w={480} h={300} />);
    L.push(<Line key="brazo" t={t} at={T.brazo} out={T.mira} text="SIN DEJARTE EL BRAZO" y={820} size={70} />);
    // "Mira." → portal desde la sartén a la toma macro de la espuma
    L.push(<Line key="mira" t={t} at={T.mira} out={T.estas - 0.1} text="MIRA." y={140} size={96} col={COL.amber} />);
  }
  // ===== B2 · el teléfono (vista en primera persona); la pantalla se agranda y es el avatar =====
  if (t >= T.estas && t < W1.ms + 0.5) {
    const z = ei(t, W1.ms - 0.45, W1.ms + 0.05);
    L.push(<AbsoluteFill key="tel" style={{ transformOrigin: "50% 62%", transform: `scale(${1 + z * z * 4})`, filter: z > 0.05 ? `blur(${z * 10}px)` : undefined }}><Shot k="l1_telefono" t={t} a={T.estas} /></AbsoluteFill>);
    L.push(<Tag key="tCoc" t={t} at={T.estas + 0.15} x={960} y={300} dx={-200} dy={-110} text="UN MINUTO" sub="CON EL TELÉFONO" col={COL.ice} out={W1.ms - 0.5} size={48} />);
    const r = ei(t, W1.ms - 0.25, W1.ms + 0.4);
    if (r > 0) L.push(<Portal key="pT" x={960} y={670} r={r}><Avatar t={Math.max(W1.ms, t)} /></Portal>);
  }
  // ===== C · avatar con el teléfono 3D; "ese olor" → el humo sube y tapa todo =====
  if (t >= W1.ms + 0.4 && t < W1.me + 0.1) {
    L.push(<Avatar key="avC" t={t} blur={6 * e(t, T.olor, T.olor + 0.5)} />);
    L.push(<Phone key="ph" t={t} at={W1.ms + 0.45} out={T.olor - 0.2} x={1500} y={560} />);
    L.push(<Line key="olor" t={t} at={T.olor} out={W1.me} text="…ESE OLOR" y={140} size={96} col={COL.amber} />);
  }
  // ===== D · el quemado: arroz, leche, cebolla (tomas reales) → la perilla → costra "dura como piedra" =====
  if (t >= W1.me - 0.1 && t < W2.ms + 0.05) {
    if (t < T.leche) {
      L.push(<AbsoluteFill key="d1"><Shot k="l2_humo" t={t} a={W1.me - 0.1} /></AbsoluteFill>);
      L.push(<Tag key="arroz" t={t} at={T.arroz + 0.1} x={1000} y={620} dx={-220} dy={-200} text="ARROZ PEGADO" col={COL.ink} out={T.leche - 0.15} size={50} />);
    } else if (t < T.cebolla) {
      const wp = ei(t, T.leche - 0.12, T.leche + 0.15);
      L.push(<AbsoluteFill key="d2" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: wp < 0.98 ? `blur(${Math.sin(wp * Math.PI) * 30}px)` : undefined }}><Shot k="l3_leche" t={t} a={T.leche} /></AbsoluteFill>);
      L.push(<Tag key="leche" t={t} at={T.leche + 0.2} x={1000} y={480} dx={220} dy={-180} text="LECHE QUE SUBIÓ" col={COL.ice2} out={T.cebolla - 0.15} size={50} />);
    } else if (t < T.corres) {
      L.push(<AbsoluteFill key="d3" style={{ filter: "saturate(.8) contrast(1.1)" }}><Shot k="l2_humo" t={t} a={T.cebolla} z={[1.15, 1.24]} /></AbsoluteFill>);
      L.push(<Tag key="ceb" t={t} at={T.cebolla + 0.2} x={940} y={640} dx={230} dy={-190} text="CEBOLLA → CARBÓN" col={COL.amber} out={T.corres - 0.1} size={50} />);
    } else {
      L.push(<World key="wD" t={t} />);
      const kn = scr(t, PT.knob);
      L.push(<Tag key="apag" t={t} at={T.apagas} x={kn.x} y={kn.y} dx={170} dy={-120} text="APAGAS" col={COL.red} out={T.fondo + 0.4} size={56} />);
      { const pf = scr(t, PT.pan); L.push(<Tag key="fondo" t={t} at={T.fondo + 0.2} x={pf.x} y={pf.y} dx={-240} dy={-160} text="EL FONDO… YA ES COSTRA" col={COL.ink} out={T.costra + 0.1} size={50} />); }
      const pn = scr(t, PT.pan);
      const pr = ei(t, T.costra - 0.1, T.costra + 0.35);
      if (pr > 0) L.push(<Portal key="pC" x={pn.x} y={pn.y} r={pr}><Shot k="l4_costra" t={t} a={T.costra} /></Portal>);
      L.push(<Stamp key="piedra" t={t} at={T.piedra} text="DURA COMO PIEDRA" x={960} y={860} rot={-6} size={86} out={W2.ms - 0.25} />);
      // latigazo al avatar
      const wp = ei(t, W2.ms - 0.3, W2.ms + 0.02);
      if (wp > 0) L.push(<AbsoluteFill key="avW" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, }}><Avatar t={Math.max(t, W2.ms)} /></AbsoluteFill>);
    }
  }
  L.push(<SmokeWipe key="sw" t={t} a={T.olor + 0.3} b={W1.me} c={W1.me + 0.6} />);
  // ===== E · avatar: remojo toda la noche / media hora tallando → la tarjeta se acerca y la atravesamos =====
  if (t >= W2.ms && t < W2.me + 0.05) {
    const zt = ei(t, W2.me - 0.5, W2.me);
    L.push(<Avatar key="avE" t={t} blur={10 * e(t, W2.me - 1.3, W2.me - 0.8)} dark={0.35 * e(t, W2.me - 1.3, W2.me - 0.8)} />);
    L.push(<Sticker key="st1" t={t} at={T.noche} out={T.media + 0.9} x={1450} y={300} icon="luna" text="TODA LA NOCHE" col="#3a4f8f" />);
    L.push(<Sticker key="st2" t={t} at={T.media} out={W2.me - 1.2} x={1430} y={560} icon="reloj" text="MEDIA HORA" col="#8f5a2a" />);
    const k = spr(t, W2.me - 1.3, 0.9);
    L.push(<Card3D key="cTa" id={HAS.l5_tallar ? "ltx_l5_tallar" : "img_l5_tallar"} at={W2.me - 1.3} x={560} y={215} w={800} h={450} ry={(1 - Math.min(1, k)) * 60 - 8} rx={4} z={(1 - Math.min(1, k)) * -1400 + zt * 1700} o={e(t, W2.me - 1.3, W2.me - 1.15)} label="TE DUELEN LOS DEDOS" />);
  }
  // ===== F · tallando de verdad → "sigue ahí" → al fondo del mueble → "o la tiras" =====
  if (t >= W2.me && t < T.nosupiste + 0.1) {
    if (t < T.guardas) {
      L.push(<AbsoluteFill key="f1"><Shot k="l5_tallar" t={t} a={W2.me} /></AbsoluteFill>);
      L.push(<Stamp key="sig" t={t} at={T.sigue} text="SIGUE AHÍ" x={1380} y={300} rot={7} size={100} out={T.guardas - 0.2} />);
      L.push(<Tag key="gris" t={t} at={T.gris} x={900} y={640} dx={-200} dy={160} text="…APENAS MÁS GRIS" col={COL.dim} out={T.guardas - 0.2} size={44} />);
    } else {
      const wp = ei(t, T.guardas - 0.15, T.guardas + 0.2);
      L.push(<AbsoluteFill key="f2" style={{ transform: `translateY(${(1 - wp) * -1080}px)`, filter: wp < 0.98 ? `blur(${Math.sin(wp * Math.PI) * 26}px)` : undefined }}><Shot k="l6_mueble" t={t} a={T.guardas} /></AbsoluteFill>);
      L.push(<Tag key="mue" t={t} at={T.guardas + 0.25} x={960} y={600} dx={240} dy={-200} text="AL FONDO DEL MUEBLE" col={COL.ink} out={T.nosupiste - 0.2} size={48} />);
      L.push(<Stamp key="tir" t={t} at={T.tiras} text="O A LA BASURA" x={760} y={330} rot={-8} size={92} out={T.nosupiste - 0.15} />);
    }
  }
  // ===== F2 · la cocina de noche: "no es que no supiste limpiar · nadie te explicó qué es eso negro" =====
  if (t >= T.nosupiste && t < W3.ms + 0.45) {
    L.push(<World key="wF" t={t} />);
    L.push(<Flash key="flN" t={t} at={T.nosupiste} peak={0.5} />);
    L.push(<Line key="ns" t={t} at={T.nosupiste + 0.05} out={T.nadie - 0.1} text="NO ES QUE NO SUPISTE" y={130} size={80} />);
    L.push(<Line key="nd" t={t} at={T.nadie} out={T.sabes - 0.1} text="NADIE TE EXPLICÓ" y={130} size={80} col={COL.amber} />);
    const pn = scr(t, PT.pan);
    L.push(<Tag key="qe" t={t} at={T.eso} x={pn.x} y={pn.y} dx={-240} dy={-170} text="¿QUÉ ES ESTO?" col={COL.amber} out={W3.ms - 0.4} size={60} />);
    L.push(<Tag key="sol" t={t} at={T.sabes + 0.3} x={pn.x} y={pn.y} dx={230} dy={140} text="SE DESPEGA CASI SOLO" col="#9df0b4" out={W3.ms + 0.2} size={44} />);
    const r = ei(t, W3.ms - 0.1, W3.ms + 0.4);
    if (r > 0) L.push(<Portal key="pI" x={pn.x} y={pn.y} r={r}><Avatar t={Math.max(W3.ms, t)} /></Portal>);
  }
  // ===== G · avatar: "SIETE PASOS, uno por uno" → zoom a través del 7 =====
  if (t >= W3.ms + 0.4 && t < W3.me + 0.05) {
    const z = ei(t, W3.me - 0.5, W3.me);
    L.push(<AbsoluteFill key="avG" style={{ transformOrigin: "50% 45%", transform: `scale(${1 + z * z * 6})` }}><Avatar t={t} /><BigNum t={t} at={T.siete} text="7 PASOS" x={1420} y={420} size={170} col={COL.amber} edge="#5a3a10" sub="UNO POR UNO" /></AbsoluteFill>);
    L.push(<Flash key="flG" t={t} at={W3.me - 0.05} peak={0.8} w={0.3} />);
  }
  // ===== H · el recorrido del laboratorio: un objeto 3D por paso =====
  if (t >= W3.me && t < W4.ms + 0.5) {
    L.push(<World key="wH" t={t} />);
    L.push(<Step key="s1" t={t} at={T.q1 + 0.1} out={T.q2 - 0.1} n={1} text="QUÉ ES LA COSTRA" q={PT.pan} dx={-250} dy={-180} />);
    L.push(<Step key="s2" t={t} at={T.q2 + 0.2} out={T.q3 - 0.1} n={2} text="QUÉ SARTÉN TIENES" q={PT.rack} dx={-300} dy={-230} />);
    const mg = scr(t, [0.98, 1.2, -1.37]);
    L.push(<Tag key="mag" t={t} at={T.q2 + 1.5} x={mg.x} y={mg.y} dx={-180} dy={140} text="EL IMÁN" sub="SE PEGA = ACERO" col={COL.ice} out={T.q3 - 0.1} size={40} />);
    L.push(<Step key="s3" t={t} at={T.q3 + 0.1} out={T.q4 - 0.1} n={3} text="AGUA + PASTILLA" q={PT.pan} dx={-280} dy={-200} col={COL.ice} />);
    L.push(<Step key="s4" t={t} at={T.q4 + 0.1} out={T.q5 - 0.1} n={4} text="LOS 10 MINUTOS" q={[0.75, 2.2, -1.42]} dx={260} dy={-120} />);
    L.push(<Step key="s5" t={t} at={T.q5 + 0.1} out={W4.ms} n={5} text="SIN RAYAR" q={PT.pan} dx={260} dy={-200} col="#9df0b4" />);
    const DO: { k: string; a: number; b: number; q: [number, number, number]; tag: string }[] = [
      { k: "c2_iman", a: T.q2 + 1.9, b: T.q3 - 0.15, q: [0.98, 1.2, -1.37], tag: "SE PEGA → ACERO ✓" },
      { k: "c1_pastilla", a: T.pastilla3 + 0.05, b: T.q4 - 0.1, q: PT.pan, tag: "UNA SOLA, AL CENTRO" },
      { k: "c4_reloj", a: T.q4 + 1.0, b: T.q5 - 0.1, q: [0.2, 2.55, -1.42], tag: "FUEGO BAJITO" },
      { k: "c3_espatula", a: T.q5 + 0.9, b: W4.ms - 0.2, q: PT.pan, tag: "DESDE EL BORDE" },
    ];
    DO.forEach((d) => {
      const pr = ei(t, d.a, d.a + 0.35) * (1 - ei(t, d.b - 0.3, d.b));
      if (pr <= 0) return;
      const o = scr(t, d.q);
      L.push(<Portal key={"do" + d.k} x={o.x} y={o.y} r={pr}><Shot k={d.k} t={t} a={d.a} z={[1.0, 1.09]} />
        <Tag t={t} at={d.a + 0.3} x={960} y={300} dx={160} dy={-120} text={d.tag} col={COL.amber} out={d.b - 0.3} size={46} /></Portal>);
    });
    const r = ei(t, W4.ms - 0.15, W4.ms + 0.4);
    if (r > 0) { const pn = scr(t, PT.pan); L.push(<Portal key="pH" x={pn.x} y={pn.y} r={r}><Avatar t={Math.max(W4.ms, t)} /></Portal>); }
  }
  // (portales del recorrido: se abren desde el objeto y se cierran sobre él)
  // ===== I · avatar con las fichas de los 7 pasos =====
  if (t >= W4.ms + 0.4) {
    L.push(<Avatar key="avI" t={t} edge={e(t, W4.ms + 0.6, W4.ms + 1.0)} />);
    L.push(<Chips key="ch" t={t} at={T.q6 + 0.1} items={["COSTRA", "SARTÉN", "AGUA", "10 MIN", "SIN RAYAR", "AFUERA", "QUE NO VUELVA"]} out={MIN1_END + 5} />);
    L.push(<Line key="q7" t={t} at={T.q7} out={MIN1_END + 5} text="Y QUE NO VUELVA" y={120} size={78} col="#9df0b4" />);
  }

  return <AbsoluteFill style={{ background: "#05070b" }}>{L}</AbsoluteFill>;
};
