// keikoen01 · MINUTO 1 (0-108,2 s). Un solo hilo: la cocina de madera de Keiko y su CAJÓN DEL CONGELADOR son el mundo.
// avatar "cerrá la puerta" → portal al cajón cerrado → martes de noche → (cansada) → el cajón se abre, la niebla fría tapa
// → la cámara cae al cajón: la bolsa-piedra → avatar "dura como piedra" → la bolsa en la mano → ¿POLLO? ¿SOPA? ¿MARZO?
// → la tapa del tacho → avatar "estoy tirando otra vez" → sola → "nunca fuiste vos" → la promesa de los 60 "DURA PARA SIEMPRE"
// se quiebra como hielo → avatar "un tacho frío con luz" → amanece: el desorden se ordena, 25 de hielo, arroz/sopa/pescado/verdura
// → avatar "cero tiempo, cero plata" → miso y dashi → la REGLA 3 (redondo vs. plano) → la cámara sale: KEIKO MORITA · 76 · KIOTO
// → avatar "20 años para una" → 1, 4, 7 cuencos → portal a la casa de campo de la madre → la caja de arroz con la abolladura
// → el cuarto frío del norte → avatar "sal, el cuarto del norte y reglas" → sus reglas → el sello del canal.
// Todo clavado a la voz con at("frase"). Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, FPS, screenOf, camSpeed, setKeys, win, DRAWER_OUT, bagTag } from "./cocina3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, Flash, FONT, HAND, KK, LowerThird, P, Portal, SERIF, Tag, at, e, ei, extrude, s, spr } from "./lib";

const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
type Win = { ms: number; me: number; off: number };
const WIN: Win[] = ((AVW as { win: Win[] }).win).filter((w) => w.ms < 112);
export const MIN1_END = Math.round((at("quick while") - 0.15) * FPS) / FPS;
export const MIN1_FRAMES = s(MIN1_END);
const AVS = WIN.map((w) => [w.ms, w.me] as [number, number]);
const A = (i: number) => AVS[i][0], B = (i: number) => AVS[i][1];

// ---------------- tiempos clavados a la voz ----------------
const T = {
  close: at("close the freezer"), leave: at("leave it closed"), tuesday: at("tuesday night"), tired: at("you are tired"), open: at("you open the freezer"),
  cold: at("the cold comes"), again: at("there it is again"), hard: at("hard like a stone"), turn: at("you turn it"), chicken: at("chicken"), soup: at("soup"),
  march: at("something from march"), stand: at("you stand there"), trash: at("in the trash"), lid: at("close the lid"), quietly: at("quietly"),
  wasting: at("i am wasting again"), alone: at("i live alone"), never: at("it was never you"), taught: at("nobody taught you"), came: at("the freezer came"),
  promise: at("big promise"), forever: at("lasts forever"), norules: at("nobody gave us"), lie: at("forever is a lie"), without: at("without rules"),
  trashcan: at("cold trash can"), light: at("with a light inside"), today: at("so today"), n25: at("25 of them"), opinions: at("not my opinions"),
  rice: at("to rice"), soup2: at("to soup"), fish: at("to fish"), greens: at("to greens"), zt: at("zero extra time"), zm: at("zero extra money"),
  nothing: at("cost nothing"), rule3: at("rule number three"), argue: at("argue with you"), letthem: at("let them"), know: at("you know me"),
  keiko: at("i am keiko"), n76: at("76"), kyoto: at("in kyoto"), one: at("for one person"), twenty: at("twenty years"), four: at("cooked for four"),
  seven: at("cook for seven"), farm: at("in a farmhouse"), box: at("wooden rice box"), dent: at("a dent"), brother: at("my brother"),
  nofreezer: at("had no freezer"), salt: at("had salt"), north: at("north room"), rules: at("she had rules"), kept: at("i kept her rules"),
  added: at("i added my own"), channel: at("this channel is"),
};

// ---------------- puntos del cajón abierto ----------------
const DZ = PT.drawer[2] - 0.3 + DRAWER_OUT;               // z del centro del cajón abierto
const STONE: [number, number, number] = [1.67, 0.27, DZ - 0.2];
const TRASH = PT.trash, TABLE = PT.table, RBOX: [number, number, number] = [-2.1, 1.12, 0.28];

// ---------------- cámara del minuto 1 (una sola, sin cortes; entradas/salidas = portales y niebla fría) ----------------
setKeys([
  { t: 0, p: [1.15, 1.35, 1.35], l: [1.4, 0.7, -1.2], fov: 40 },
  { t: 3.3, p: [1.2, 1.3, 1.2], l: [1.45, 0.65, -1.2], fov: 40 },
  { t: 9.6, p: [1.78, 0.78, -0.25], l: [1.55, 0.38, -1.15], fov: 31 },           // empuje lento al cajón cerrado (martes de noche)
  { t: 10.9, p: [1.76, 0.78, -0.22], l: [1.55, 0.38, -1.15], fov: 31 },
  { t: 12.4, p: [1.45, 1.45, 0.25], l: [1.55, 0.2, DZ], fov: 38, arc: 0.1 },     // se abre: la cámara sube y mira adentro
  { t: 15.2, p: [1.5, 1.12, -0.15], l: STONE, fov: 34 },                        // la bolsa-piedra al fondo
  { t: 21.1, p: [1.5, 1.1, -0.2], l: STONE, fov: 33 },
  { t: 26.7, p: [1.95, 1.4, 0.6], l: [1.4, 0.45, -1.0], fov: 40 },             // parada con la puerta abierta
  { t: 28.8, p: [1.9, 1.38, 0.5], l: [1.4, 0.45, -1.0], fov: 40 },
  { t: 29.6, p: [1.55, 0.95, -0.3], l: TRASH, fov: 34, arc: 0.06 },              // gira al tacho
  { t: 30.3, p: [1.5, 0.9, -0.38], l: TRASH, fov: 33 },
  { t: 41.0, p: [0.9, 1.85, 3.1], l: [0.4, 0.8, -1.0], fov: 42 },                 // la cocina entera, de noche (la promesa)
  { t: 48.9, p: [1.15, 1.8, 2.7], l: [0.5, 0.8, -1.0], fov: 42 },
  { t: 53.9, p: [1.55, 1.3, -0.3], l: [1.55, 0.1, DZ - 0.02], fov: 40 },          // amanece arriba del cajón: el orden
  { t: 58.6, p: [1.55, 1.2, -0.38], l: [1.55, 0.12, DZ - 0.04], fov: 38 },
  { t: 63.9, p: [1.6, 1.12, -0.42], l: [1.53, 0.14, DZ - 0.05], fov: 36 },
  { t: 69.1, p: [1.52, 1.15, -0.36], l: [1.52, 0.05, DZ + 0.02], fov: 40 },         // miso y dashi adelante
  { t: 72.5, p: [1.5, 1.25, -0.3], l: [1.52, 0.05, DZ + 0.02], fov: 42 },
  { t: 77.6, p: [1.6, 1.45, 0.2], l: [1.55, 0.3, DZ], fov: 40 },
  { t: 81.3, p: [0.6, 1.75, 3.1], l: [-0.1, 0.9, -0.7], fov: 42, arc: 0.25 },     // "ya me conocés": sale y muestra la casa
  { t: 86.7, p: [0.3, 1.5, 1.55], l: [TABLE[0], 0.76, TABLE[2]], fov: 34 },        // la mesita para una
  { t: 90.2, p: [0.15, 1.35, 1.25], l: [TABLE[0] - 0.08, 0.76, TABLE[2] + 0.08], fov: 30 },
  { t: 92.9, p: [-1.35, 1.55, 1.05], l: RBOX, fov: 30, arc: 0.1 },                // la caja de arroz de la madre
  { t: 97.0, p: [-1.55, 1.5, 0.82], l: RBOX, fov: 24 },
  { t: 104.2, p: [0.85, 1.85, 3.1], l: [0.2, 0.85, -0.9], fov: 42 },                // la cocina entera, de día: el sello
  { t: 108.4, p: [0.95, 1.75, 2.75], l: [0.3, 0.85, -0.9], fov: 41 },
]);

// ---------------- estado del mundo por segundo ----------------
const worldAt = (t: number): WorldProps => {
  const night = win(t, 7.6, 8.6) * (1 - win(t, 53.6, 55.2));
  const drawer = Math.max(ei(t, 11.0, 12.3) * (1 - ei(t, 29.0, 29.7)), ei(t, 53.4, 54.4) * (1 - ei(t, 77.9, 79.2)), ei(t, 104.3, 105.2));
  return {
    t, night, drawer,
    order: win(t, T.today, T.today + 2.2), stone: t < T.today ? 1 : 1 - win(t, T.today, T.today + 0.6), frost: t < T.today ? 0.9 : 0.25,
    miso: win(t, T.nothing - 0.2, T.nothing + 1.0), dashi: win(t, T.nothing + 0.5, T.nothing + 1.2),
    hlBag: t >= T.rice && t < T.soup2 ? 0 : t >= T.soup2 && t < T.fish ? 3 : t >= T.fish && t < T.greens ? 5 : t >= T.greens && t < 63.9 ? 4 : -1,
    lid: ei(t, T.trash - 0.6, T.trash - 0.1) * (1 - ei(t, 29.9, 30.6)),
    pot: 0.5 * (1 - night), cooker: win(t, 81.3, 82) * 0.8, ricebox: win(t, T.box - 0.3, T.box + 0.4) * (1 - win(t, 97.6, 98.4)), bowlOn: 1,
  };
};

const World: React.FC<{ t: number; over?: Partial<WorldProps> }> = ({ t, over }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw {...worldAt(t)} {...over} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------- avatar (preroll de 10 cuadros por ventana) ----------------
const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const face = REEL ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.012 * Math.sin(t * 0.7)})` }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};

// ---------------- toma real (clip LTX si ya llegó, si no la foto con empuje lento) ----------------
const Clip: React.FC<{ k: string; t: number; a: number; z?: [number, number]; ox?: number }> = ({ k, t, a, z = [1.03, 1.1], ox = 0 }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 7);
  const inner = CLIPS.has(k)
    ? <Sequence from={s(a)} layout="none"><OffthreadVideo src={staticFile(P + k + ".mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    : <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden" }}><AbsoluteFill style={{ transform: `scale(${sc}) translateX(${ox * e(t, a, a + 7)}px)` }}>{inner}</AbsoluteFill></AbsoluteFill>;
};
// dos tomas que se deslizan (con desenfoque de movimiento sólo en el barrido)
const Slide: React.FC<{ t: number; at: number; a: React.ReactNode; b: React.ReactNode; dir?: number }> = ({ t, at: a0, a, b, dir = 1 }) => {
  const sl = ei(t, a0, a0 + 0.5), mb = Math.sin(sl * Math.PI) * 34;
  return <>
    {sl < 1 && <AbsoluteFill style={{ transform: `translateX(${-dir * sl * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{a}</AbsoluteFill>}
    {sl > 0 && <AbsoluteFill style={{ transform: `translateX(${dir * (1 - sl) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{b}</AbsoluteFill>}
  </>;
};

// ======================= PIEZAS NUEVAS (sólo de este minuto) =======================

// NIEBLA FRÍA: la escarcha crece desde los bordes, la niebla blanca-azul tapa y se va (transición del congelador)
export const ColdFog: React.FC<{ t: number; mid: number; w?: number }> = ({ t, mid, w = 0.6 }) => {
  const k = 1 - Math.min(1, Math.abs(t - mid) / w);
  if (k <= 0.01) return null;
  const blobs = Array.from({ length: 12 }, (_, i) => {
    const x = (i * 173) % 1920, y = 120 + ((t - mid + w) / (2 * w)) * 700 + (i % 4) * 160 - 200;
    return `radial-gradient(circle ${380 + (i % 3) * 140}px at ${x}px ${y}px, rgba(226,244,255,${0.8 * k}) 0%, rgba(226,244,255,0) 70%)`;
  });
  const cr = Array.from({ length: 26 }, (_, i) => {
    const side = i % 4, u = ((i * 0.618) % 1) * (side % 2 ? 1080 : 1920), L = (90 + (i % 5) * 50) * k;
    const [x, y] = side === 0 ? [u, 0] : side === 1 ? [1920, u] : side === 2 ? [u, 1080] : [0, u];
    const ang = side === 0 ? 90 : side === 1 ? 180 : side === 2 ? 270 : 0, r = (ang + (i % 3 - 1) * 25) * Math.PI / 180;
    const x2 = x + Math.cos(r) * L, y2 = y + Math.sin(r) * L;
    return <g key={i} stroke="rgba(255,255,255,.85)" strokeWidth={3} strokeLinecap="round">
      <line x1={x} y1={y} x2={x2} y2={y2} />
      {[0.4, 0.7].map((f) => { const bx = x + (x2 - x) * f, by = y + (y2 - y) * f; return <g key={f}><line x1={bx} y1={by} x2={bx + Math.cos(r + 0.8) * L * 0.25} y2={by + Math.sin(r + 0.8) * L * 0.25} /><line x1={bx} y1={by} x2={bx + Math.cos(r - 0.8) * L * 0.25} y2={by + Math.sin(r - 0.8) * L * 0.25} /></g>; })}
    </g>;
  });
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ background: blobs.join(","), opacity: Math.min(1, k * 1.7), filter: "blur(16px)" }} />
    <AbsoluteFill style={{ background: `rgba(232,246,255,${0.88 * Math.pow(k, 1.7)})` }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: Math.min(1, k * 2), filter: "drop-shadow(0 0 8px rgba(160,220,255,.9))" }}>{cr}</svg>
  </AbsoluteFill>;
};

// almanaque de hojas que se arrancan hasta MARTES, y una lunita (noche)
export const Almanaque: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a0, out, x, y }) => {
  const k = Math.min(1.1, spr(t, a0 - 0.6, 1)), o = e(t, a0 - 0.6, a0 - 0.45) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const days = ["SUN", "MON", "TUE"];
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k)}) rotate(-3deg)`, perspective: 900 }}>
    <div style={{ position: "relative", width: 300, height: 360 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 300, height: 56, borderRadius: "10px 10px 0 0", background: KK.hanko, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
      {days.map((d, i) => {
        const tear = i < 2 ? ei(t, a0 - 0.4 + i * 0.22, a0 - 0.1 + i * 0.22) : 0;
        return <div key={d} style={{ position: "absolute", left: 0, top: 56, width: 300, height: 304, zIndex: 3 - i, transformOrigin: "50% 0", transform: `rotateX(${-tear * 120}deg) translateY(${tear * -40}px)`, opacity: 1 - tear,
          background: "linear-gradient(180deg,#fbf6ea,#e9dfc8)", borderRadius: "0 0 8px 8px", boxShadow: "0 24px 40px rgba(0,0,0,.45)", textAlign: "center", fontFamily: SERIF }}>
          <div style={{ fontWeight: 900, fontSize: 150, color: KK.sumi, lineHeight: "200px" }}>{19 + i}</div>
          <div style={{ fontWeight: 900, fontSize: 58, letterSpacing: 8, color: i === 2 ? KK.indigo : KK.sumi }}>{d}</div>
        </div>;
      })}
      <svg width={120} height={120} viewBox="-60 -60 120 120" style={{ position: "absolute", right: -70, top: -60, opacity: e(t, a0 + 0.3, a0 + 0.7), filter: "drop-shadow(0 0 22px rgba(255,236,170,.9))" }}>
        <path d="M 20 -44 A 46 46 0 1 0 20 44 A 36 36 0 1 1 20 -44 Z" fill="#ffe9a8" />
      </svg>
    </div>
  </div>;
};

// texto de HIELO: letras escarchadas que golpean ("toc toc") y tiemblan
export const HieloTxt: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; size?: number; knock?: number[] }> = ({ t, at: a0, out, x, y, text, size = 120, knock = [] }) => {
  const k = Math.min(1.1, spr(t, a0, 1.1)), o = e(t, a0, a0 + 0.08) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sh = knock.reduce((acc, kk) => acc + (t > kk ? Math.exp(-(t - kk) * 14) * Math.sin((t - kk) * 90) * 10 : 0), 0);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) translateX(${sh}px) scale(${0.5 + 0.5 * Math.min(1, k)})` }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: 4, whiteSpace: "nowrap", color: "transparent",
      backgroundImage: "linear-gradient(180deg,#ffffff 0%,#d6f0ff 35%,#8fcff5 60%,#e9f7ff 100%), repeating-linear-gradient(60deg, rgba(255,255,255,.5) 0 2px, transparent 2px 9px)", WebkitBackgroundClip: "text", backgroundClip: "text",
      filter: "drop-shadow(0 0 14px rgba(170,225,255,.85)) drop-shadow(0 10px 18px rgba(0,30,60,.6))" } as React.CSSProperties}>{text}</div>
    {knock.map((kk, i) => { const kv = e(t, kk, kk + 0.1) * (1 - e(t, kk + 0.35, kk + 0.6)); return kv > 0.01 ? <div key={i} style={{ position: "absolute", left: `${30 + i * 40}%`, top: -size * 0.55, opacity: kv, transform: `rotate(${i ? 8 : -8}deg) scale(${0.8 + 0.3 * kv})`, fontFamily: HAND, fontWeight: 700, fontSize: size * 0.45, color: KK.cream, textShadow: "0 4px 14px rgba(0,0,0,.8)" }}>knock</div> : null; })}
  </div>;
};

// cinta de papel escrita a mano con signo de pregunta (lo que adivinás de la bolsa)
export const Adivina: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; rot?: number }> = ({ t, at: a0, out, x, y, text, rot = -5 }) => {
  const k = Math.min(1.12, spr(t, a0, 1.2)), o = e(t, a0, a0 + 0.08) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot + 2 * Math.sin(t * 2 + x)}deg) scale(${k})` }}>
    <div style={{ padding: "8px 40px 14px", background: "linear-gradient(180deg,#f6eed8,#e8dcbc)", boxShadow: "0 18px 36px rgba(0,0,0,.55)", clipPath: "polygon(2% 8%, 98% 0, 100% 92%, 0 100%)", fontFamily: HAND, fontWeight: 700, fontSize: 96, color: KK.sumi }}>
      {text}<span style={{ color: KK.hanko, display: "inline-block", transform: `rotate(${10 * Math.sin(t * 3)}deg)` }}>?</span>
    </div>
  </div>;
};

// letra a mano que se escribe sola (lo que pensás); con trazo de tinta sumi o crema
export const Pensado: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; size?: number; col?: string; rot?: number }> = ({ t, at: a0, out, x, y, text, size = 104, col = KK.cream, rot = -4 }) => {
  const o = 1 - e(t, out, out + 0.3), w = e(t, a0, a0 + 0.9);
  if (w <= 0.01 || o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg)`, fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, whiteSpace: "nowrap", clipPath: `inset(-30% ${100 - 100 * w}% -30% 0)`, textShadow: "0 6px 22px rgba(0,0,0,.8)" }}>{text}</div>;
};

// papel washi pegado con cinta, renglones que se escriben
export const Washi: React.FC<{ t: number; at: number[]; out: number; x: number; y: number; lines: string[]; rot?: number; w?: number }> = ({ t, at: ats, out, x, y, lines, rot = -3, w = 520 }) => {
  const a0 = ats[0], k = Math.min(1.1, spr(t, a0 - 0.15, 0.9)), o = e(t, a0 - 0.15, a0) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200 }}>
    <div style={{ transform: `translate(-50%,-50%) rotateX(${(1 - Math.min(1, k)) * 55}deg) rotate(${rot + Math.sin(t * 1.2)}deg)`, width: w, padding: "30px 40px 34px", borderRadius: 4,
      background: "linear-gradient(180deg,#fbf6ea,#efe4cb)", boxShadow: "0 30px 60px rgba(0,0,0,.55), inset 0 0 50px rgba(160,130,80,.18)" }}>
      <div style={{ position: "absolute", left: "50%", top: -16, width: 120, height: 32, transform: "translateX(-50%) rotate(-2deg)", background: "repeating-linear-gradient(90deg, rgba(200,53,43,.75) 0 12px, rgba(240,220,200,.75) 12px 24px)", boxShadow: "0 2px 6px rgba(0,0,0,.25)" }} />
      {lines.map((ln, i) => <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: i === 0 ? 70 : 54, lineHeight: i === 0 ? "80px" : "64px", color: i === 0 ? KK.sumi : KK.indigo, clipPath: `inset(-20% ${100 - 100 * e(t, ats[i] ?? a0, (ats[i] ?? a0) + 0.6)}% -20% 0)` }}>{ln}</div>)}
    </div>
  </div>;
};

// la PROMESA de los 60: aviso de revista con un congelador dibujado, "IT LASTS FOREVER!" → se quiebra como hielo
export const Promesa: React.FC<{ t: number; at: number; txt: number; empty: number; crack: number; x: number; y: number }> = ({ t, at: a0, txt, empty, crack, x, y }) => {
  const k = Math.min(1.08, spr(t, a0, 0.9)), cr = ei(t, crack + 0.15, crack + 0.9), o = e(t, a0, a0 + 0.12) * (1 - e(t, crack + 0.6, crack + 1.0));
  if (o <= 0.01) return null;
  const lines = e(t, crack, crack + 0.2);
  const shards = Array.from({ length: 9 }, (_, i) => ({ cx: (i % 3) * 33.3, cy: Math.floor(i / 3) * 33.3, dx: ((i % 3) - 1) * 260 * cr + Math.sin(i * 7) * 60 * cr, dy: (Math.floor(i / 3) - 1) * 220 * cr + 300 * cr * cr, r: (i % 2 ? 1 : -1) * 25 * cr }));
  const card = (clip?: string, tf?: string) => <div style={{ position: "absolute", inset: 0, clipPath: clip, transform: tf }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: "linear-gradient(180deg,#f9e9c4,#efcf96)", boxShadow: "inset 0 0 0 10px #f4f0e6, inset 0 0 0 14px #c8352b, 0 40px 80px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 36, letterSpacing: 4, whiteSpace: "nowrap", color: KK.hanko }}>NEW! THE HOME FREEZER</div>
    <svg width={560} height={330} viewBox="0 0 560 330" style={{ position: "absolute", left: 0, top: 96 }}>
      <rect x={180} y={10} width={200} height={300} rx={26} fill="#f6f6f2" stroke="#2a3a52" strokeWidth={6} />
      <line x1={180} y1={120} x2={380} y2={120} stroke="#2a3a52" strokeWidth={6} />
      <rect x={340} y={40} width={14} height={60} rx={7} fill="#9aa6b2" /><rect x={340} y={150} width={14} height={60} rx={7} fill="#9aa6b2" />
      {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${110 - i * 6} ${70 + i * 34} l -40 0 M ${450 + i * 6} ${70 + i * 34} l 40 0`} stroke="#c8352b" strokeWidth={6} strokeLinecap="round" />)}
      <text x={280} y={240} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={44} fill="#2a3a52">☺</text>
    </svg>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: KK.indigo, opacity: e(t, txt, txt + 0.25), transform: `scale(${0.6 + 0.4 * Math.min(1, spr(t, txt, 1.2))})` }}>IT LASTS FOREVER!</div>
  </div>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1400 }}>
    <div style={{ position: "relative", width: 560, height: 600, transform: `translate(-50%,-50%) rotateY(${(1 - Math.min(1, k)) * -70 + 8}deg) rotate(-2deg)` }}>
      {cr <= 0.001 ? card() : shards.map((sh, i) => card(`polygon(${sh.cx}% ${sh.cy}%, ${sh.cx + 33.4}% ${sh.cy + (i % 2) * 6}%, ${sh.cx + 33.4}% ${sh.cy + 33.4}%, ${sh.cx}% ${sh.cy + 33.4 - (i % 2) * 6}%)`, `translate(${sh.dx}px,${sh.dy}px) rotate(${sh.r}deg)`))}
      {lines > 0.01 && cr < 0.3 && <svg width={560} height={600} style={{ position: "absolute", inset: 0, opacity: lines * (1 - cr * 3), filter: "drop-shadow(0 0 10px rgba(180,230,255,1))" }}>
        {[[280, 300, 40, 60], [280, 300, 520, 90], [280, 300, 90, 560], [280, 300, 500, 540], [280, 300, 280, 10], [280, 300, 10, 330]].map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={a + (c - a) * lines} y2={b + (d - b) * lines} stroke="#e9f8ff" strokeWidth={5} />)}
      </svg>}
      {/* el papel de las reglas, vacío */}
      <div style={{ position: "absolute", left: 560, top: 120, width: 340, height: 420, opacity: e(t, empty, empty + 0.2) * (1 - e(t, crack - 0.2, crack)), transform: `translateX(${(1 - ei(t, empty, empty + 0.5)) * 300}px) rotate(5deg)`, background: "repeating-linear-gradient(180deg, transparent 0 55px, rgba(90,110,150,.25) 55px 57px), linear-gradient(180deg,#fbf6ea,#ece2c9)", boxShadow: "0 30px 60px rgba(0,0,0,.55)", padding: "20px 30px" }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 62, color: KK.sumi }}>The rules:</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: "rgba(36,30,27,.35)", marginTop: 10 }}>1. ...<br />2. ...<br />3. ...</div>
      </div>
    </div>
  </div>;
};

// ecuación con íconos dibujados: CONGELADOR = TACHO + LUZ
export const Ecuacion: React.FC<{ t: number; a: number; b: number; c: number; out: number; y?: number }> = ({ t, a, b, c, out, y = 860 }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (o <= 0.01 || t < a) return null;
  const pop = (x: number) => Math.min(1.12, spr(t, x, 1.1));
  const box = (k: number, ch: React.ReactNode, lab: string) => <div style={{ opacity: e(t, k, k + 0.08), transform: `translateY(${(1 - Math.min(1, pop(k))) * 80}px) scale(${pop(k)})`, textAlign: "center" }}>
    <svg width={170} height={170} viewBox="0 0 170 170" style={{ filter: "drop-shadow(0 16px 26px rgba(0,0,0,.6))" }}>{ch}</svg>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 4, color: KK.cream, textShadow: extrude(3, "#000") }}>{lab}</div>
  </div>;
  const sign = (k: number, ch: string) => <div style={{ opacity: e(t, k, k + 0.1), fontFamily: FONT, fontWeight: 900, fontSize: 110, color: KK.ice, textShadow: extrude(6, "#0a2a40"), margin: "0 10px 40px" }}>{ch}</div>;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y - 120, display: "flex", justifyContent: "center", alignItems: "center", opacity: o }}>
    <div style={{ display: "flex", alignItems: "center", padding: "20px 50px", borderRadius: 30, background: "rgba(14,22,36,.72)", boxShadow: "0 30px 60px rgba(0,0,0,.5), inset 0 0 0 2px rgba(159,216,255,.35)" }}>
      {box(a, <><rect x={40} y={14} width={90} height={142} rx={14} fill="#f6f6f2" /><line x1={40} y1={72} x2={130} y2={72} stroke="#2a3a52" strokeWidth={6} /><rect x={112} y={30} width={8} height={30} rx={4} fill="#9aa6b2" /><rect x={112} y={86} width={8} height={30} rx={4} fill="#9aa6b2" /></>, "FREEZER")}
      {sign(b - 0.15, "=")}
      {box(b, <><path d="M 45 50 L 125 50 L 115 156 L 55 156 Z" fill="#e6e6e0" /><rect x={36} y={36} width={98} height={16} rx={6} fill="#cfcfc8" /><path d="M 70 70 L 72 140 M 85 70 L 85 140 M 100 70 L 98 140" stroke="#9a9a92" strokeWidth={5} /></>, "COLD TRASH CAN")}
      {sign(c - 0.15, "+")}
      {box(c, <><circle cx={85} cy={70} r={46} fill="#ffe9a8" style={{ filter: "drop-shadow(0 0 20px #ffd060)" }} /><rect x={66} y={112} width={38} height={32} rx={6} fill="#9aa0a8" /><path d="M 70 84 L 78 60 L 85 80 L 92 60 L 100 84" stroke="#e0a030" strokeWidth={5} fill="none" /></>, "A LIGHT")}
    </div>
  </div>;
};

// fichas de hielo "0 EXTRA TIME" / "0 EXTRA MONEY" (cubos de hielo con el cero adentro)
export const Ceros: React.FC<{ t: number; a: number; b: number; out: number; x: number; y: number }> = ({ t, a, b, out, x, y }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (o <= 0.01 || t < a) return null;
  const cube = (k: number, lab: string, i: number) => {
    const p = Math.min(1.12, spr(t, k, 1)), v = e(t, k, k + 0.1);
    return <div key={lab} style={{ opacity: v, transform: `translateY(${(1 - Math.min(1, p)) * -260}px) rotate(${(i ? 6 : -5) + 2 * Math.sin(t * 1.4 + i)}deg) scale(${p})`, width: 300, height: 300, borderRadius: 40, position: "relative",
      background: "linear-gradient(135deg, rgba(240,250,255,.92), rgba(160,215,245,.75) 55%, rgba(220,244,255,.9))", boxShadow: "inset 0 0 0 4px rgba(255,255,255,.8), inset -20px -30px 60px rgba(90,160,210,.45), 0 30px 60px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 170, lineHeight: 1, color: KK.indigo, textShadow: "0 0 18px rgba(255,255,255,.9)" }}>0</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 3, color: KK.sumi }}>{lab}</div>
    </div>;
  };
  return <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", display: "flex", gap: 50, opacity: o }}>{cube(a, "EXTRA TIME", 0)}{cube(b, "EXTRA MONEY", 1)}</div>;
};

// la REGLA 3: dos globos que discuten (ROUND! vs FLAT!) alrededor de una ficha "RULE 3"
export const Discusion: React.FC<{ t: number; at: number; arg: number; out: number }> = ({ t, at: a0, arg, out }) => {
  const o = e(t, a0, a0 + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const k = Math.min(1.1, spr(t, a0, 1));
  const bub = (k0: number, txt: string, left: number, top: number, rot: number, col: string) => {
    const p = Math.min(1.15, spr(t, k0, 1.3)), sh = t > k0 ? Math.sin(t * 26) * 4 * Math.exp(-(t - k0) * 2) : 0;
    return <div style={{ position: "absolute", left, top, opacity: e(t, k0, k0 + 0.06), transform: `translate(-50%,-50%) rotate(${rot}deg) translateX(${sh}px) scale(${p})` }}>
      <div style={{ position: "relative", padding: "20px 44px", borderRadius: 60, background: "#fbf6ea", boxShadow: `0 20px 40px rgba(0,0,0,.5), inset 0 0 0 5px ${col}`, fontFamily: FONT, fontWeight: 900, fontSize: 76, color: col }}>{txt}
        <div style={{ position: "absolute", left: rot < 0 ? "70%" : "20%", bottom: -30, width: 0, height: 0, borderLeft: "22px solid transparent", borderRight: "22px solid transparent", borderTop: "34px solid #fbf6ea" }} />
      </div>
    </div>;
  };
  return <AbsoluteFill style={{ opacity: o }}>
    <div style={{ position: "absolute", left: 960, top: 300, transform: `translate(-50%,-50%) perspective(900px) rotateX(${(1 - Math.min(1, k)) * 70}deg)`, padding: "24px 60px", borderRadius: 24, background: "linear-gradient(180deg,#24364f,#132033)", boxShadow: `0 30px 60px rgba(0,0,0,.6), inset 0 0 0 4px ${KK.hinoki}` }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 10, color: KK.hinoki, textAlign: "center" }}>RULE</div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 200, lineHeight: 1, color: KK.cream, textAlign: "center", textShadow: extrude(10, "#0a1424") }}>3</div>
    </div>
    {bub(arg, "ROUND!", 520, 200, -8, KK.hanko)}
    {bub(arg + 0.35, "FLAT!", 1400, 190, 7, KK.indigo)}
  </AbsoluteFill>;
};

// contador de cuencos: 1 → 4 → 7 (cuencos de arroz dibujados que se suman en fila)
export const Cuencos: React.FC<{ t: number; steps: [number, number][]; out: number; y: number }> = ({ t, steps, out, y }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (o <= 0.01 || t < steps[0][0]) return null;
  let n = 0; steps.forEach(([a, m]) => { if (t >= a) n = m; });
  const cur = steps.filter(([a]) => t >= a).pop()!;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 26, opacity: o }}>
    {Array.from({ length: n }, (_, i) => {
      const born = steps.find(([, m], j) => i < m && (j === 0 || i >= steps[j - 1][1]))![0] + (i % 3) * 0.1, p = Math.min(1.15, spr(t, born, 1.2));
      return <svg key={i} width={140} height={110} viewBox="0 0 140 110" style={{ transform: `translateY(${(1 - Math.min(1, p)) * 120}px) scale(${p})`, opacity: e(t, born, born + 0.06), filter: "drop-shadow(0 14px 18px rgba(0,0,0,.55))" }}>
        <ellipse cx={70} cy={46} rx={50} ry={22} fill="#fbfaf6" /><path d="M 18 48 Q 70 120 122 48 Z" fill={i === 0 ? KK.indigo : "#efe8dc"} /><path d="M 30 70 Q 70 92 110 70" stroke={KK.hanko} strokeWidth={4} fill="none" />
      </svg>;
    })}
    <div style={{ marginLeft: 30, fontFamily: FONT, fontWeight: 900, fontSize: 150, lineHeight: 1, color: KK.cream, textShadow: extrude(10, "#3a2210"), transform: `scale(${Math.min(1.1, spr(t, cur[0], 1.2))})` }}>{n}</div>
  </div>;
};

// tablillas de madera colgadas de un hilo: SALT · NORTH ROOM · RULES (cada una con su palabra)
export const Tablillas: React.FC<{ t: number; items: [string, number][]; out: number; x: number; y: number }> = ({ t, items, out, x, y }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (o <= 0.01 || t < items[0][1]) return null;
  return <div style={{ position: "absolute", left: x, top: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: o }}>
    {items.map(([txt, a0], i) => {
      const k = spr(t, a0, 0.8), sw = (1 - Math.min(1, k)) * 24 + 4 * Math.sin((t - a0) * 3) * Math.exp(-(t - a0) * 0.9);
      return <div key={txt} style={{ opacity: e(t, a0, a0 + 0.08), transformOrigin: "50% 0", transform: `rotate(${sw}deg) translateY(${(1 - Math.min(1, k)) * -200}px)`, marginTop: i ? 0 : y }}>
        <div style={{ width: 4, height: 30, margin: "0 auto", background: "#d9c7a0" }} />
        <div style={{ minWidth: 420, padding: "18px 40px", textAlign: "center", borderRadius: 10, background: "linear-gradient(180deg,#d9ad72,#b9874e)", boxShadow: "0 24px 44px rgba(0,0,0,.55), inset 0 0 0 3px rgba(90,50,20,.45)", fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: KK.sumi, letterSpacing: 4 }}>{txt}</div>
      </div>;
    })}
  </div>;
};

// sello hanko rojo que cae y deja la tinta (el nombre del canal)
export const Hanko: React.FC<{ t: number; at: number; x: number; y: number; l1: string; l2: string }> = ({ t, at: a0, x, y, l1, l2 }) => {
  const k = spr(t, a0, 1.3), o = e(t, a0, a0 + 0.06);
  if (o <= 0.01) return null;
  const ink = e(t, a0 + 0.08, a0 + 0.5);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(-4deg) scale(${2.2 - 1.2 * Math.min(1, k)})` }}>
    <div style={{ padding: "22px 54px", border: `12px solid ${KK.hanko}`, borderRadius: 26, background: `rgba(251,243,226,${0.82 * ink})`, boxShadow: `0 30px 60px rgba(0,0,0,${0.5 * ink})`, textAlign: "center",
      maskImage: "radial-gradient(circle at 30% 40%, #000 60%, rgba(0,0,0,.82) 100%)", WebkitMaskImage: "radial-gradient(circle at 30% 40%, #000 60%, rgba(0,0,0,.82) 100%)" } as React.CSSProperties}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: KK.hanko, letterSpacing: 6 }}>{l1}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: KK.hanko, lineHeight: 1.05 }}>{l2}</div>
    </div>
  </div>;
};

// ======================= EL MINUTO =======================
export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const W = (k: string, tt = t, over?: Partial<WorldProps>) => <World key={k} t={tt} over={over} />;
  const inA = (i: number) => t >= A(i) && t < B(i);

  // A · avatar "come here… close the freezer door" → portal al cajón cerrado
  if (t < B(0) + 0.02) {
    L.push(<Avatar key="avA" t={t} />);
    const r = ei(t, B(0) - 0.75, B(0));
    if (r > 0) { const c = screenOf(B(0), PT.drawer); L.push(<Portal key="pA" x={c.x} y={c.y} r={r}>{W("wA", Math.max(B(0) - 0.3, t))}</Portal>); }
  }
  // B · el cajón cerrado, empuje lento, martes de noche → (cansada) → el cajón se abre
  if (t >= B(0) && t < 12.95) {
    if (t < T.tired - 0.1 || t >= T.open - 0.1) L.push(W("wB"));
    const c = screenOf(t, PT.drawer);
    L.push(<Tag key="lc" t={t} at={T.leave} x={c.x} y={c.y - 30} dx={-260} dy={-200} text="LEAVE IT CLOSED" col={KK.ice} out={T.tuesday - 0.4} size={50} />);
    L.push(<Almanaque key="al" t={t} at={T.tuesday} out={T.tired - 0.25} x={480} y={420} />);
    if (t >= T.tired - 0.1 && t < T.open) L.push(<Clip key="cT" k="k_tired" t={t} a={T.tired - 0.1} z={[1.1, 1.03]} />);
  }
  L.push(<Flash key="flT" t={t} at={T.tired - 0.1} col="#bcd8ff" peak={0.35} w={0.2} />, <Flash key="flO" t={t} at={T.open - 0.1} col="#bcd8ff" peak={0.3} w={0.2} />);
  L.push(<ColdFog key="cf1" t={t} mid={Math.max(12.4, T.cold)} w={0.6} />);
  // C · adentro del cajón: la bolsa-piedra al fondo "there it is again"
  if (t >= 12.9 && t < A(1) + 0.02) {
    L.push(W("wC"));
    const p = screenOf(t, STONE);
    L.push(<Tag key="ag" t={t} at={T.again} x={p.x} y={p.y} dx={-320} dy={-170} text="THERE IT IS" sub="AGAIN" col={KK.frost} size={54} />);
  }
  // D · avatar "a little bag… hard like a stone"
  if (inA(1)) {
    L.push(<Avatar key="avD" t={t} />);
    L.push(<HieloTxt key="hs" t={t} at={T.hard} out={B(1) - 0.15} x={1220} y={830} text="HARD LIKE A STONE" size={84} knock={[T.hard + 0.35, T.hard + 0.75]} />);
  }
  // E · la bolsa en la mano → ¿pollo? ¿sopa? ¿marzo?
  if (t >= B(1) && t < T.stand + 0.02) {
    L.push(<Slide key="sE" t={t} at={T.chicken - 0.55} a={<Clip k="k_frostbag" t={t} a={B(1)} z={[1.04, 1.12]} />} b={<Clip k="k_knock" t={t} a={T.chicken - 0.55} z={[1.1, 1.03]} />} />);
    L.push(<Adivina key="g1" t={t} at={T.chicken} out={T.stand - 0.2} x={470} y={300} text="CHICKEN" rot={-6} />);
    L.push(<Adivina key="g2" t={t} at={T.soup} out={T.stand - 0.2} x={1450} y={250} text="SOUP" rot={5} />);
    L.push(<Adivina key="g3" t={t} at={T.march} out={T.stand - 0.2} x={960} y={860} text="MARCH" rot={-2} />);
  }
  L.push(<ColdFog key="cf2" t={t} mid={T.stand} w={0.4} />);
  // F · parada con la puerta abierta → gira al tacho, la tapa se abre y se cierra despacito
  if (t >= T.stand && t < A(2) + 0.02) {
    const p = screenOf(t, [TRASH[0], 0.42, TRASH[2]]), q = screenOf(t, PT.drawerIn);
    L.push(<Slide key="sF" t={t} at={T.trash - 0.55} a={W("wF")} b={<Clip k="k_trash" t={t} a={T.trash - 0.55} z={[1.1, 1.04]} />} />);
    if (t < T.trash - 0.55) L.push(<Tag key="dr" t={t} at={T.stand + 0.4} x={q.x} y={q.y} dx={-260} dy={-190} text="DOOR OPEN" col={KK.ice} out={T.trash - 1.0} size={46} />);
    if (t < T.trash - 0.55) L.push(<Tag key="tr" t={t} at={T.trash - 1.0} x={p.x} y={p.y} dx={230} dy={-190} text="THE TRASH" col={KK.cream} out={T.trash - 0.6} size={50} />);
  }
  // G · avatar "…close the lid quietly… I am wasting again"
  if (inA(2)) {
    L.push(<Avatar key="avG" t={t} />);
    L.push(<Pensado key="sh" t={t} at={T.quietly} out={T.wasting - 0.3} x={1440} y={260} text="shh… quietly" size={92} rot={-3} />);
    L.push(<Pensado key="wa" t={t} at={T.wasting} out={B(2) - 0.1} x={1340} y={830} text="I am wasting again." size={100} />);
  }
  // H · sola, y "it was never you, dear"
  if (t >= B(2) && t < T.came + 0.02) {
    L.push(<Clip key="cH" k="k_alone" t={t} a={B(2)} z={[1.03, 1.1]} />);
    L.push(<Washi key="wn" t={t} at={[T.never, T.taught]} out={T.came - 0.3} x={1440} y={330} lines={["It was never you, dear.", "Nobody taught you."]} />);
  }
  L.push(<ColdFog key="cf3" t={t} mid={T.came} w={0.45} />);
  // I · la cocina entera de noche: la promesa de los 60 se quiebra como hielo
  if (t >= T.came && t < A(3) + 0.02) {
    L.push(W("wI"));
    L.push(<Promesa key="pm" t={t} at={T.promise - 0.2} txt={T.forever} empty={T.norules} crack={T.lie} x={720} y={540} />);
    L.push(<BigNum key="lie" t={t} at={T.lie + 0.15} text="FOREVER IS A LIE" size={110} x={1040} y={880} col={KK.frost} edge="#14324e" out={A(3) - 0.1} />);
  }
  // J · avatar "a freezer without rules is just a very cold trash can with a light inside"
  if (inA(3)) {
    L.push(<Avatar key="avJ" t={t} />);
    L.push(<Ecuacion key="eq" t={t} a={T.without - 0.3} b={T.trashcan} c={T.light} out={B(3) - 0.15} />);
  }
  L.push(<Flash key="flJ" t={t} at={B(3)} col="#fff4dc" peak={0.45} w={0.3} />);
  // K · amanece arriba del cajón: el desorden se ordena, 25 de hielo, las bolsas con nombre
  if (t >= B(3) && t < A(4) + 0.02) {
    L.push(W("wK"));
    L.push(<BigNum key="25" t={t} at={T.n25} text="25" size={300} x={1450} y={430} col={KK.frost} edge="#14324e" out={T.opinions + 0.9} sub="FREEZER RULES" />);
    L.push(<Pensado key="op" t={t} at={T.opinions} out={T.rice - 0.2} x={520} y={260} text="not opinions." size={90} />);
    ([["RICE", T.rice, 0, -1], ["SOUP", T.soup2, 3, 1], ["FISH", T.fish, 5, 1], ["GREENS", T.greens, 4, -1]] as [string, number, number, number][]).forEach(([txt, a0, i, sd], j) => {
      const p = screenOf(t, bagTag(i));
      L.push(<Tag key={"bg" + j} t={t} at={a0} x={p.x} y={p.y - 40} dx={sd * 420} dy={-260 + j * 150} text={txt} col={[KK.washi, "#e8b46a", "#f29a74", "#a7c96a"][j]} size={56} />);
    });
  }
  // L · avatar "…tasting like you just made them. Zero extra time." (los ceros siguen al volver al cajón)
  if (inA(4)) L.push(<Avatar key="avL" t={t} />);
  L.push(<Ceros key="z0" t={t} a={T.zt} b={T.zm} out={T.nothing + 0.6} x={1360} y={470} />);
  // M · miso y dashi (cuestan nada) → la REGLA 3 → "let them"
  if (t >= B(4) && t < T.know + 0.02) {
    L.push(W("wM"));
    const m = screenOf(t, [1.41, 0.51, DZ + 0.15]), d = screenOf(t, [1.7, 0.5, DZ + 0.15]);
    L.push(<Tag key="mi" t={t} at={T.nothing + 0.1} x={m.x} y={m.y} dx={-240} dy={-150} text="MISO BALLS" col="#e8b46a" out={T.rule3 - 0.2} size={48} />);
    L.push(<Tag key="da" t={t} at={T.nothing + 0.6} x={d.x} y={d.y} dx={230} dy={-170} text="DASHI CUBES" col={KK.frost} out={T.rule3 - 0.2} size={48} />);
    L.push(<Discusion key="r3" t={t} at={T.rule3} arg={T.argue - 0.1} out={T.letthem + 0.3} />);
    L.push(<Pensado key="lt" t={t} at={T.letthem} out={T.know - 0.1} x={960} y={880} text="Let them." size={120} />);
  }
  // N · "you know me. I am Keiko" → la cámara sale y muestra la casa
  if (t >= T.know && t < A(5) + 0.02) {
    L.push(W("wN"));
    L.push(<LowerThird key="lt3" t={t} at={T.keiko} out={A(5) + 3.5} name="KEIKO MORITA" l2="76 · KYOTO · COOKING FOR ONE" l2at={T.n76} />);
  }
  // O · avatar "…cooking for one person for twenty years"
  if (inA(5)) {
    L.push(<Avatar key="avO" t={t} />);
    L.push(<LowerThird key="lt3b" t={t} at={T.keiko} out={A(5) + 3.5} name="KEIKO MORITA" l2="76 · KYOTO · COOKING FOR ONE" l2at={T.n76} />);
    L.push(<BigNum key="20" t={t} at={T.twenty} text="20 YEARS" size={150} x={1380} y={330} col={KK.hinoki} edge="#4a2a10" sub="FOR ONE" out={B(5) - 0.1} />);
  }
  // P · la mesita: 1 → 4 → 7 cuencos → portal a la casa de campo de la madre
  if (t >= B(5) && t < T.box + 0.02) {
    const r = ei(t, T.seven + 0.1, T.farm + 0.2);
    if (r < 1) L.push(W("wP"));
    if (r > 0) { const b = screenOf(t, PT.bowl); L.push(<Portal key="pP" x={b.x} y={b.y} r={r}><Clip k="k_farm" t={t} a={T.seven + 0.1} z={[1.12, 1.04]} /></Portal>); }
    L.push(<Cuencos key="cu" t={t} steps={[[B(5) + 0.1, 1], [T.four + 0.4, 4], [T.seven + 0.3, 7]]} out={T.farm - 0.1} y={760} />);
    L.push(<Tag key="lk" t={t} at={at("near the lake")} x={1180} y={560} dx={200} dy={-220} text="NEAR THE LAKE" sub="1960s" col={KK.cream} out={T.box - 0.25} size={48} />);
  }
  L.push(<Flash key="flP" t={t} at={T.box} col="#ffe6b8" peak={0.4} w={0.3} />);
  // Q · la caja de arroz de la madre, con la abolladura de la tapa
  if (t >= T.box && t < T.nofreezer + 0.02) {
    L.push(W("wQ"));
    const d = screenOf(t, [RBOX[0] - 0.02, RBOX[1] + 0.07, RBOX[2] + 0.06]);
    L.push(<Tag key="dn" t={t} at={T.dent} x={d.x} y={d.y} dx={230} dy={-200} text="THE DENT" col={KK.hinoki} size={60} />);
    L.push(<Pensado key="br" t={t} at={T.brother} out={T.nofreezer - 0.2} x={d.x + 330} y={d.y - 40} text="(my brother sat on it)" size={64} rot={-2} />);
  }
  L.push(<ColdFog key="cf4" t={t} mid={T.nofreezer} w={0.4} />);
  // R · "my mother had no freezer at all": el cuarto frío del norte
  if (t >= T.nofreezer && t < A(6) + 0.02) {
    L.push(<Clip key="cR" k="k_northroom" t={t} a={T.nofreezer} z={[1.04, 1.12]} />);
    L.push(<HieloTxt key="nf" t={t} at={at("no freezer") + 0.1} out={A(6) - 0.05} x={960} y={860} text="NO FREEZER" size={110} />);
  }
  // S · avatar "she had salt, the cold north room, and rules"
  if (inA(6)) {
    L.push(<Avatar key="avS" t={t} />);
    L.push(<Tablillas key="tb" t={t} items={[["SALT", T.salt + 0.1], ["NORTH ROOM", T.north], ["RULES", T.rules]]} out={B(6) - 0.15} x={1460} y={200} />);
  }
  // T · sus reglas (foto) → la cocina entera de día: el sello del canal
  if (t >= B(6)) {
    const sl = ei(t, T.channel - 0.7, T.channel - 0.2);
    if (sl < 1) L.push(<AbsoluteFill key="cTa" style={{ opacity: 1 - sl }}><Clip k="k_rules" t={t} a={B(6)} z={[1.03, 1.1]} /></AbsoluteFill>);
    if (sl > 0) L.push(<AbsoluteFill key="wTa" style={{ opacity: sl }}>{W("wT")}</AbsoluteFill>);
    L.push(<Washi key="kr" t={t} at={[B(6) + 0.15, T.added]} out={T.channel - 0.4} x={1420} y={330} rot={3} w={540} lines={["Her rules.", "+ mine, for the freezer."]} />);
    L.push(<Hanko key="hk" t={t} at={T.channel + 0.1} x={960} y={500} l1="GRANDMA KEIKO'S" l2="KITCHEN" />);
  }
  return <AbsoluteFill style={{ background: "#07090d" }}>{L}</AbsoluteFill>;
};
