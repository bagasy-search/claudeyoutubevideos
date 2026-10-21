// keikoes01 · MINUTO 1 (0-98 s). Un solo hilo: la cocina de madera de Keiko en Kioto es el mundo; todo entra y sale de ahí.
// avatar → portal a la bolsa (los bichitos caminan, la lupa) → el calendario arranca un mes → a la basura (y shh) → la cámara
// vuela desde el callejón y entra por la ventana: NO FUE TU CULPA (hanko) → avatar con las etiquetas "¿dónde vive?" → la estufa
// real → las bolsas abiertas junto al fuego (calor) → una sola persona → avatar: el tazón se pudre a la mitad + KEIKO 76 →
// la cocina entera + el mapa de Japón con Kioto → la alacena se abre: MESES → ¿MESES? → avatar: 15 trucos → $0 / 1 min →
// los 15 frascos se numeran, el 7 se dora → el 1: "¡qué tontería!" → avatar → もったいない se escribe con pincel → la madre
// y la caja bajo la escalera (olor) → avatar → suscríbete + campanita (fūrin) → la pregunta en la tablilla ema → vamos a la despensa → TRUCO 1.
// Todo clavado a la voz con at("frase"). Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, JARS, screenOf, camSpeed, setKeys, win, V } from "./kioto3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { Flash, FONT, HAND, KO, P, Portal, SERIF, Tag, at, e, ei, extrude, s, spr } from "./lib";

const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
type Win = { ms: number; me: number; off: number };
const WIN: Win[] = ((AVW as { win: Win[] }).win).filter((w) => w.ms < 98);
export const MIN1_END = 98.6;
export const MIN1_FRAMES = s(MIN1_END);
const AVS = WIN.map((w) => [w.ms, w.me] as [number, number]);

// ---------------- tiempos clavados a la voz ----------------
const T = {
  bichitos: at("unos bichitos"), granos: at("los granos"), paquete: at("el paquete"), mes: at("un mes"), tiras: at("lo tiras"), basura: at("la basura"),
  nadie: at("no le cuentas"), escucha: at("escuchame bien"), culpa: at("no fue tu culpa"), dondeVive: at("donde vive"), arroz2: at("el arroz", 18.5),
  miso: at("el miso"), algas: at("las algas"), soja: at("salsa de soja"), tienda: at("la tienda"), bolsas: at("en bolsas"), abren: at("se abren"),
  cierran: at("no se cierran"), lado: at("al lado de la cocina"), calor: at("hace calor"), sola: at("una sola persona"), mitad: at("la mitad"),
  perder: at("se echa a perder"), anos76: at("76"), kioto: at("kioto"), madera: at("chiquita de madera"), veinte: at("20 anos"), despensa: at("mi despensa"),
  meses: at("dura meses"), meses2: at("meses", 47.5), si: at("si meses"), magia: at("no es magia"), quince: at("15 trucos"), madre: at("mi madre", 52),
  pais: at("en tu pais"), dinero: at("cuesta dinero"), minuto: at("un minuto"), siete: at("el numero 7"), ahorrar: at("ahorrar muchisimo"), primero: at("el primero"),
  familia: at("tu familia"), tonteria: at("una tonteria"), dejalo: at("dejalo"), keiko: at("soy keiko"), nunca: at("nunca se tira"), motainai: at("motainai"),
  pena: at("que pena"), ella: at("ella guardaba"), caja: at("una caja de madera"), escalera: at("la escalera"), sol: at("nunca daba"), olor: at("del olor"),
  susc: at("suscribete"), campana: at("campanita"), cuentame: at("cuentame abajo"), pregunta: at("que se te echa"), primeroTi: at("primero a ti"), vamos: at("vamos a la despensa"), truco1: at("truco numero 1"),
};

// ---------------- cámara (una sola; las entradas/salidas son portales, vapor y barridos) ----------------
const J = (i: number) => JARS[i - 1];
setKeys([
  // E · del callejón al atardecer, entra volando por la ventana corrediza
  { t: 14.3, p: [-5.4, 1.65, 6.5], l: [-2.6, 1.55, -0.6], fov: 50 },
  { t: 15.6, p: [-3.4, 1.5, -0.6], l: [-2.2, 1.45, -0.55], fov: 44 },
  { t: 16.6, p: [-1.75, 1.42, -0.45], l: [0.0, 1.15, -1.3], fov: 44 },
  { t: 17.2, p: [-1.35, 1.4, -0.25], l: [0.2, 1.1, -1.45], fov: 43 },
  // G · las bolsas abiertas al lado del fuego
  { t: 24.4, p: [0.35, 1.62, 0.05], l: [-0.6, 0.98, -1.45], fov: 42 },
  { t: 27.3, p: [0.15, 1.5, -0.2], l: [-0.6, 1.0, -1.45], fov: 40 },
  { t: 30.3, p: [0.0, 1.42, -0.42], l: [-0.55, 1.0, -1.45], fov: 38 },
  // I · se aleja: la cocina entera (Kioto, madera, 20 años) → a la alacena que se abre
  { t: 39.6, p: [1.3, 1.85, 2.3], l: [-0.1, 1.0, -1.0], fov: 48, arc: 0.1 },
  { t: 43.6, p: [0.9, 1.75, 1.9], l: [0.1, 1.05, -1.1], fov: 46 },
  { t: 45.0, p: [1.45, 1.5, 0.55], l: [1.45, 1.5, -1.5], fov: 42, arc: 0.12 },
  { t: 47.6, p: [1.45, 1.5, 0.35], l: [1.45, 1.5, -1.5], fov: 42 },
  // K · los 15 frascos → el 7 de cerca
  { t: 60.0, p: [1.45, 1.5, 0.5], l: [1.45, 1.5, -1.5], fov: 42 },
  { t: 61.3, p: [1.45, 1.5, 0.42], l: [1.45, 1.5, -1.5], fov: 42 },
  { t: 62.4, p: [1.25, 1.55, -0.62], l: [J(7)[0], J(7)[1] + 0.08, J(7)[2]], fov: 34 },
  { t: 64.4, p: [1.22, 1.56, -0.7], l: [J(7)[0], J(7)[1] + 0.08, J(7)[2]], fov: 33 },
  // L · el frasco 1: arroz con chiles
  { t: 65.2, p: [0.98, 1.95, -0.78], l: [J(1)[0], J(1)[1] + 0.09, J(1)[2]], fov: 34, arc: 0.06 },
  { t: 69.0, p: [0.96, 1.96, -0.86], l: [J(1)[0], J(1)[1] + 0.09, J(1)[2]], fov: 32 },
  // O · "vamos a la despensa" → TRUCO 1
  { t: 95.0, p: [0.2, 1.6, 1.6], l: [1.3, 1.5, -1.4], fov: 46 },
  { t: 96.7, p: [1.12, 2.0, -0.45], l: [J(1)[0] + 0.05, J(1)[1] + 0.06, J(1)[2]], fov: 38, arc: 0.06 },
  { t: 98.6, p: [1.02, 1.98, -0.68], l: [J(1)[0] + 0.03, J(1)[1] + 0.08, J(1)[2]], fov: 34 },
]);

// ---------------- estado del mundo por segundo ----------------
const worldAt = (t: number): WorldProps => {
  const glow = JARS.map((_, i) => {
    const a = 60.25 + i * 0.07;
    const all = win(t, a, a + 0.2) * (1 - win(t, T.siete - 0.1, T.siete + 0.3) * (i === 6 ? 0 : 0.85)) * (1 - win(t, 64.3, 64.9));
    const one = i === 0 ? win(t, 64.6, 65.0) * (1 - win(t, 69.0, 69.2)) + win(t, T.truco1, T.truco1 + 0.3) : 0;
    const seven = i === 6 ? win(t, T.siete, T.siete + 0.3) * (1 - win(t, 64.3, 64.9)) : 0;
    return Math.min(1.4, all + one + seven * 0.4);
  });
  return {
    t,
    dusk: t < 18 ? 0.75 : 0.15,
    lamp: t < 18 ? 1 : 0.7,
    winOpen: 1 - win(t, 17.4, 18.4),
    doors: win(t, T.despensa + 0.1, T.despensa + 1.3),
    jarGlow: glow,
    bags: t < 38 ? 1 : 0,
    heat: t < 38 ? 0.6 + 0.6 * win(t, T.lado, T.calor) : 0.5,
    steam: 1,
    dimShelf: 0,
  };
};

export const World: React.FC<{ t: number; over?: Partial<WorldProps> }> = ({ t, over }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(6, v0.bx * 0.5), by: Math.min(4, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw {...worldAt(t)} {...over} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------- avatar (preroll de 10 cuadros por ventana; sin reel = foto de referencia) ----------------
const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const face = REEL ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.012 * Math.sin(t * 0.7)})` }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};
const inAv = (t: number, i: number) => t >= AVS[i][0] && t < AVS[i][1];

// ---------------- toma real (clip si ya llegó; si no, la foto con empuje lento) ----------------
export const Clip: React.FC<{ k: string; t: number; a: number; z?: [number, number]; ox?: number; oy?: number; dur?: number }> = ({ k, t, a, z = [1.03, 1.1], ox = 0, oy = 0, dur = 7 }) => {
  const q = e(t, a, a + dur), sc = z[0] + (z[1] - z[0]) * q;
  const inner = CLIPS.has(k)
    ? <Sequence from={s(a)} layout="none"><OffthreadVideo src={staticFile(P + k + ".mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    : <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden" }}><AbsoluteFill style={{ transform: `scale(${sc}) translate(${ox * q}px, ${oy * q}px)` }}>{inner}</AbsoluteFill></AbsoluteFill>;
};
// barrido lateral con desenfoque de movimiento entre dos tomas (sin corte seco)
export const Slide: React.FC<{ t: number; a: number; from: React.ReactNode; to: React.ReactNode; dir?: number; w?: number }> = ({ t, a, from, to, dir = 1, w = 0.5 }) => {
  const sl = ei(t, a, a + w), mb = Math.sin(sl * Math.PI) * 40;
  return <>
    {sl < 1 && <AbsoluteFill style={{ transform: `translateX(${-dir * sl * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{from}</AbsoluteFill>}
    {sl > 0 && <AbsoluteFill style={{ transform: `translateX(${dir * (1 - sl) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{to}</AbsoluteFill>}
  </>;
};

// =====================================================================================================
// ---------------- PIEZAS NUEVAS de este minuto (papel washi, tinta sumi, sello hanko) ----------------
// =====================================================================================================
export const pop = (t: number, a: number, out: number, k = 1) => ({ k: Math.min(1.12, spr(t, a, k)), o: e(t, a, a + 0.1) * (1 - e(t, out, out + 0.3)) });

// los gorgojos: bichitos negros dibujados que caminan por los granos, con patitas que se mueven y una lupa que los sigue
const Gorgojos: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const o = e(t, a, a + 0.25) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const bugs = Array.from({ length: 9 }, (_, i) => {
    const r0 = (i * 0.618) % 1, sp = 38 + (i % 4) * 14, ang = r0 * Math.PI * 2 + Math.sin((t - a) * 0.6 + i) * 0.6;
    const d = (t - a) * sp;
    return { x: 380 + ((i * 263) % 1180) + Math.cos(ang) * d, y: 240 + ((i * 181) % 640) + Math.sin(ang) * d, ang, i };
  });
  const L = bugs[2], lx = L.x, ly = L.y;
  const bug = (b: typeof bugs[0], sc: number) => (
    <g key={b.i} transform={`translate(${b.x} ${b.y}) rotate(${(b.ang * 180) / Math.PI}) scale(${sc})`}>
      {[-1, 0, 1].map((k) => [-1, 1].map((sg) => <line key={k + "" + sg} x1={k * 6} y1={0} x2={k * 7 + Math.sin(t * 22 + k + sg) * 3} y2={sg * 14} stroke="#120c08" strokeWidth={2.2} strokeLinecap="round" />))}
      <ellipse cx={0} cy={0} rx={13} ry={6.5} fill="#1b120c" /><ellipse cx={-3} cy={-2} rx={6} ry={2} fill="rgba(255,230,200,.25)" />
      <ellipse cx={14} cy={0} rx={5} ry={4} fill="#120c08" /><line x1={18} y1={0} x2={30} y2={0} stroke="#120c08" strokeWidth={3} strokeLinecap="round" />
    </g>);
  const lens = Math.min(1.1, spr(t, a + 0.5, 1));
  return <AbsoluteFill style={{ opacity: o }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{bugs.map((b) => bug(b, 1))}</svg>
    {lens > 0.02 && <div style={{ position: "absolute", left: lx - 190, top: ly - 190, width: 380, height: 380, borderRadius: "50%", overflow: "hidden", transform: `scale(${lens})`,
      boxShadow: "0 0 0 16px #2a2018, 0 0 0 22px #b88a58, 0 40px 80px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: -lx * 2.2 + 190, top: -ly * 2.2 + 190, width: 1920 * 2.2, height: 1080 * 2.2 }}>
        <Img src={staticFile(P + "img_h_gorgojos.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.03 + 0.06 * e(t, 4.55, 11)})` }} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, transform: "scale(2.2)", transformOrigin: "0 0" }}>{bugs.map((b) => bug(b, 1))}</svg>
      </div>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,.35), transparent 40%)" }} />
    </div>}
    {lens > 0.02 && <div style={{ position: "absolute", left: lx + 120, top: ly + 120, width: 46, height: 200, background: "linear-gradient(90deg,#4a2c16,#8a5a32,#4a2c16)", borderRadius: 20, transform: `rotate(-45deg) scale(${lens})`, transformOrigin: "0 0" }} />}
  </AbsoluteFill>;
};

// calendario de pared japonés: las hojas se arrancan solas y vuelan hasta "HACE 1 MES"
const Calendario: React.FC<{ t: number; at: number; out: number; x: number; y: number; from: number; to: number; label: string; dur?: number }> = ({ t, at: a, out, x, y, from, to, label, dur = 1.2 }) => {
  const { k, o } = pop(t, a, out);
  if (o <= 0.01) return null;
  const p = ei(t, a + 0.2, a + 0.2 + dur), n = Math.round(from + (to - from) * p), flyK = ((t - a) * 14) % 1;
  const page = (d: number, extra?: React.CSSProperties) => <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${KO.washi}, #e3d6b8)`, borderRadius: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 0 30px rgba(120,90,40,.2)", ...extra }}>
    <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 150, color: d % 7 === 0 ? KO.beni : KO.sumi, lineHeight: 1 }}>{d}</div>
    <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 30, color: KO.tinta, letterSpacing: 6 }}>{["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"][d % 7]}</div>
  </div>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k)}) rotate(2deg)` }}>
    <div style={{ position: "relative", width: 300, height: 340 }}>
      <div style={{ position: "absolute", left: -10, top: -40, width: 320, height: 56, borderRadius: 8, background: KO.beni, boxShadow: "0 8px 20px rgba(0,0,0,.4)", fontFamily: SERIF, fontWeight: 800, fontSize: 30, color: KO.washi, textAlign: "center", lineHeight: "56px", letterSpacing: 8 }}>{label}</div>
      <div style={{ position: "absolute", inset: 0, boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>{page(n)}</div>
      {p > 0 && p < 1 && <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 0", transform: `rotateX(${-flyK * 120}deg) translateY(${-flyK * 160}px) rotate(${flyK * 30}deg)`, opacity: 1 - flyK }}>{page(n + 1)}</div>}
    </div>
  </div>;
};

// hanko: sello rojo japonés que se aprieta sobre la pantalla (tinta que se corre un poco)
export const Hanko: React.FC<{ t: number; at: number; out: number; x: number; y: number; lines: string[]; size?: number; rot?: number; paper?: boolean }> = ({ t, at: a, out, x, y, lines, size = 96, rot = -6, paper }) => {
  const k = spr(t, a, 1.4), o = e(t, a, a + 0.05) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sq = Math.min(1, k);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.2 - 1.2 * sq})` }}>
    <div style={{ padding: "18px 38px", border: `12px solid ${KO.beni}`, borderRadius: 22, background: paper ? KO.washi : "rgba(181,47,58,.08)", boxShadow: `inset 0 0 0 4px ${KO.beni}`, filter: "url(#tinta) drop-shadow(0 10px 18px rgba(0,0,0,.45))" }}>
      {lines.map((ln, i) => <div key={i} style={{ fontFamily: SERIF, fontWeight: 800, fontSize: size, lineHeight: 1.05, color: KO.beni, letterSpacing: 4, textAlign: "center", whiteSpace: "nowrap" }}>{ln}</div>)}
    </div>
  </div>;
};
export const TintaFilter = () => <svg width={0} height={0} style={{ position: "absolute" }}><filter id="tinta"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={7} result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale={4} /></filter></svg>;

// etiquetas washi colgadas de hilos (una por alimento) con un "?" que late: ¿dónde vive cada cosa?
const DondeVive: React.FC<{ t: number; items: { at: number; kanji: string; es: string }[]; out: number }> = ({ t, items, out }) => <>{items.map((it, i) => {
  const { k, o } = pop(t, it.at, out, 0.8);
  if (o <= 0.01) return null;
  const x = 1080 + i * 205, sw = (1 - Math.min(1, k)) * 30 + 6 * Math.sin((t - it.at) * 2.6 + i) * Math.exp(-(t - it.at) * 0.5);
  return <div key={i} style={{ position: "absolute", left: x, top: -10, opacity: o, transformOrigin: "50% 0", transform: `rotate(${sw}deg) translateY(${(1 - Math.min(1, k)) * -360}px)` }}>
    <div style={{ width: 3, height: 150 + (i % 2) * 90, margin: "0 auto", background: "#e7d9b8" }} />
    <div style={{ position: "relative", width: 170, padding: "18px 0 14px", background: `linear-gradient(180deg, ${KO.washi}, #e6d7b5)`, border: `5px solid ${KO.beni}`, borderRadius: 8, textAlign: "center", boxShadow: "0 24px 40px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: "50%", top: 8, width: 14, height: 14, borderRadius: "50%", background: "#3a2a1a", transform: "translateX(-50%)" }} />
      <Img src={staticFile(P + `label_${it.kanji}.png`)} style={{ width: 70, height: 105, objectFit: "cover", marginTop: 10, borderRadius: 4 }} />
      <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 34, color: KO.sumi, letterSpacing: 2 }}>{it.es}</div>
      <div style={{ position: "absolute", right: -26, top: -26, width: 62, height: 62, borderRadius: "50%", background: KO.ai, color: KO.washi, fontFamily: SERIF, fontWeight: 800, fontSize: 46, lineHeight: "62px", transform: `scale(${1 + 0.08 * Math.sin(t * 6 + i)})`, boxShadow: "0 8px 16px rgba(0,0,0,.4)" }}>?</div>
    </div>
  </div>;
})}</>;

// termómetro de cocina de esmalte (no de heladera): sube del fresco al calor de la hornalla
const TermoCocina: React.FC<{ t: number; at: number; out: number; x: number; y: number; from: number; to: number }> = ({ t, at: a, out, x, y, from, to }) => {
  const { k, o } = pop(t, a, out);
  if (o <= 0.01) return null;
  const v = from + (to - from) * ei(t, a + 0.2, a + 1.6), hot = Math.max(0, Math.min(1, (v - 18) / 18));
  const col = `rgb(${Math.round(120 + 135 * hot)},${Math.round(170 - 110 * hot)},${Math.round(200 - 170 * hot)})`;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k)})`, display: "flex", alignItems: "center", gap: 26 }}>
    <div style={{ position: "relative", width: 110, height: 420, borderRadius: 55, background: `linear-gradient(90deg, #e9e4d8, ${KO.washi} 40%, #cfc7b6)`, boxShadow: "0 30px 60px rgba(0,0,0,.55), inset 0 0 0 5px #b8ad96" }}>
      {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 18, top: 50 + i * 30, width: i % 2 ? 16 : 26, height: 3, background: KO.tinta }} />)}
      <div style={{ position: "absolute", left: 47, bottom: 70, width: 16, height: 290, borderRadius: 8, background: "rgba(255,255,255,.7)", boxShadow: "inset 0 0 0 2px rgba(0,0,0,.15)" }} />
      <div style={{ position: "absolute", left: 47, bottom: 70, width: 16, height: 290 * Math.min(1, (v - 5) / 35), borderRadius: 8, background: col, boxShadow: `0 0 16px ${col}` }} />
      <div style={{ position: "absolute", left: 30, bottom: 26, width: 50, height: 50, borderRadius: "50%", background: col, boxShadow: `0 0 26px ${col}` }} />
    </div>
    <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 110, color: col, textShadow: extrude(7, "rgba(0,0,0,.55)") }}>{Math.round(v)}°</div>
  </div>;
};

// "para UNA sola persona": una mesita con un solo tazón, y las otras sillas que se apagan
const UnaPersona: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const { k, o } = pop(t, a, out);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * Math.min(1, k)})` }}>
    <svg width={520} height={300} viewBox="-260 -170 520 300" style={{ filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      <ellipse cx={0} cy={20} rx={220} ry={70} fill={KO.nogal} /><ellipse cx={0} cy={10} rx={220} ry={70} fill="#a8784a" />
      {[0, 1, 2, 3].map((i) => { const ang = (i / 4) * Math.PI * 2 - Math.PI / 2, cx = Math.cos(ang) * 150, cy = 10 + Math.sin(ang) * 46, on = i === 3 ? 1 : 1 - e(t, a + 0.3 + i * 0.15, a + 0.6 + i * 0.15);
        return <g key={i} opacity={0.25 + 0.75 * on}><ellipse cx={cx} cy={cy} rx={34} ry={12} fill={KO.washi} /><path d={`M ${cx - 30} ${cy - 4} Q ${cx} ${cy + 26} ${cx + 30} ${cy - 4}`} fill="#5f7a5a" /></g>; })}
    </svg>
    <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 800, fontSize: 64, color: KO.washi, textShadow: extrude(6, "#2a1a10"), marginTop: -20 }}>1 <span style={{ fontSize: 40 }}>PERSONA</span></div>
  </div>;
};

// el tazón de arroz se pudre a la mitad: una mitad blanca y brillante, la otra se pone verde-gris con moho
const MitadTazon: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const { k, o } = pop(t, a, out);
  if (o <= 0.01) return null;
  const rot = ei(t, a + 0.4, a + 1.6);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k)})`, textAlign: "center" }}>
    <svg width={460} height={330} viewBox="-230 -150 460 330" style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
      <defs><clipPath id="izq"><rect x={-230} y={-150} width={230} height={330} /></clipPath><clipPath id="der"><rect x={0} y={-150} width={230} height={330} /></clipPath></defs>
      <path d="M -190 0 Q -170 150 0 160 Q 170 150 190 0 Z" fill="#2c3e64" /><path d="M -150 60 Q 0 80 150 60" stroke={KO.washi} strokeWidth={6} fill="none" opacity={0.6} />
      <g clipPath="url(#izq)">{Array.from({ length: 40 }, (_, i) => <ellipse key={i} cx={-180 + (i * 37) % 360} cy={-30 + ((i * 53) % 60) - 10 * Math.sin(i)} rx={14} ry={7} transform={`rotate(${i * 23} ${-180 + (i * 37) % 360} ${-30 + ((i * 53) % 60)})`} fill="#fbf8f0" stroke="#e6dfcf" />)}</g>
      <g clipPath="url(#der)">{Array.from({ length: 40 }, (_, i) => <ellipse key={i} cx={-180 + (i * 37) % 360} cy={-30 + ((i * 53) % 60) - 10 * Math.sin(i)} rx={14} ry={7} transform={`rotate(${i * 23} ${-180 + (i * 37) % 360} ${-30 + ((i * 53) % 60)})`}
        fill={`rgb(${Math.round(251 - 150 * rot)},${Math.round(248 - 110 * rot)},${Math.round(240 - 170 * rot)})`} />)}
        {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={20 + (i * 47) % 160} cy={-40 + (i * 29) % 70} r={(10 + (i % 3) * 8) * rot} fill="rgba(120,140,90,.65)" style={{ filter: "blur(3px)" }} />)}</g>
      <line x1={0} y1={-90} x2={0} y2={170} stroke={KO.washi} strokeWidth={5} strokeDasharray="14 10" />
    </svg>
    <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 92, color: KO.washi, textShadow: extrude(7, "#2a1a10"), marginTop: -10 }}>LA MITAD</div>
    <div style={{ fontFamily: HAND, fontWeight: 600, fontSize: 46, color: "#cfe0a8", marginTop: -8, clipPath: `inset(0 ${100 - 100 * e(t, a + 1, a + 1.8)}% 0 0)` }}>se echa a perder</div>
  </div>;
};

// placa de madera hinoki con nombre (se desliza como puerta corrediza)
const PlacaNombre: React.FC<{ t: number; at: number; out: number; name: string; l2: string; l2at: number; l3?: string; l3at?: number }> = ({ t, at: a, out, name, l2, l2at, l3, l3at = 1e9 }) => {
  const o = e(t, a, a + 0.12) * (1 - e(t, out, out + 0.3)), d = ei(t, a, a + 0.55);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 100, bottom: 110, opacity: o, display: "flex", alignItems: "stretch", overflow: "hidden", borderRadius: 10, boxShadow: "0 30px 60px rgba(0,0,0,.55)" }}>
    <div style={{ width: 22, background: KO.beni }} />
    <div style={{ clipPath: `inset(0 ${100 - 100 * d}% 0 0)`, padding: "18px 40px 16px 30px", background: `repeating-linear-gradient(90deg, rgba(120,80,40,.08) 0 3px, transparent 3px 11px), linear-gradient(180deg, ${KO.hinoki}, #d5b483)` }}>
      <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 70, color: KO.sumi, letterSpacing: 4, lineHeight: 1 }}>{name}</div>
      <div style={{ display: "flex", gap: 22, marginTop: 8, fontFamily: SERIF, fontWeight: 800, fontSize: 38, color: KO.beni, letterSpacing: 3 }}>
        <span style={{ opacity: e(t, l2at, l2at + 0.2), transform: `translateY(${(1 - e(t, l2at, l2at + 0.25)) * 20}px)` }}>{l2}</span>
        {l3 && <span style={{ opacity: e(t, l3at, l3at + 0.2), color: KO.ai, transform: `translateY(${(1 - e(t, l3at, l3at + 0.25)) * 20}px)` }}>· {l3}</span>}
      </div>
    </div>
  </div>;
};

// mapa vectorial de Japón (papel washi, islas en tinta) con un alfiler que cae en Kioto y una línea a la cocina
const JAPON = [
  "M 300 40 L 360 30 L 420 60 L 440 110 L 400 150 L 350 140 L 320 110 L 290 80 Z", // Hokkaido
  "M 380 175 L 400 230 L 390 290 L 360 340 L 320 380 L 270 410 L 220 425 L 170 440 L 120 455 L 90 445 L 110 425 L 170 405 L 220 380 L 270 350 L 320 300 L 350 250 L 365 200 Z", // Honshu
  "M 150 470 L 200 460 L 230 475 L 200 495 L 160 495 Z", // Shikoku
  "M 50 450 L 90 470 L 95 520 L 70 560 L 40 540 L 30 490 Z", // Kyushu
];
const Mapa: React.FC<{ t: number; at: number; out: number; x: number; y: number; to?: { x: number; y: number } }> = ({ t, at: a, out, x, y, to }) => {
  const { k, o } = pop(t, a, out, 0.8);
  if (o <= 0.01) return null;
  const draw = e(t, a, a + 0.9), pin = Math.min(1.1, spr(t, a + 0.7, 1.2)), px = 205, py = 395;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * Math.min(1, k)}) rotate(-3deg)` }}>
    <div style={{ position: "relative", width: 500, height: 600, padding: 0, background: `linear-gradient(180deg, ${KO.washi}, #e4d4b0)`, borderRadius: 10, boxShadow: "0 40px 70px rgba(0,0,0,.6), inset 0 0 50px rgba(150,110,50,.25)" }}>
      <svg width={500} height={600} viewBox="0 0 500 600" style={{ position: "absolute", inset: 0 }}>
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M 0 ${100 + i * 100} Q 250 ${80 + i * 100} 500 ${110 + i * 100}`} stroke="rgba(36,55,92,.12)" strokeWidth={2} fill="none" />)}
        {JAPON.map((d, i) => <path key={i} d={d} fill={`rgba(134,163,82,${0.55 * draw})`} stroke={KO.sumi} strokeWidth={4} strokeLinejoin="round" strokeDasharray={1600} strokeDashoffset={1600 * (1 - draw)} />)}
        <circle cx={px} cy={py} r={34 * pin} fill="none" stroke={KO.beni} strokeWidth={4} opacity={0.6 * (1 - ((t - a) % 1.2) / 1.2)} />
        <g transform={`translate(${px} ${py - 40 * (1 - Math.min(1, pin))}) scale(${pin})`}><path d="M 0 0 L -14 -34 A 16 16 0 1 1 14 -34 Z" fill={KO.beni} /><circle cx={0} cy={-40} r={6} fill={KO.washi} /></g>
      </svg>
      <div style={{ position: "absolute", left: 238, top: 352, fontFamily: SERIF, fontWeight: 800, fontSize: 52, color: KO.beni, opacity: e(t, a + 0.9, a + 1.1), textShadow: "0 2px 0 #fff" }}>KIOTO</div>
      <div style={{ position: "absolute", left: 30, top: 24, fontFamily: SERIF, fontWeight: 800, fontSize: 34, color: KO.ai, letterSpacing: 10 }}>JAPÓN</div>
    </div>
    {to && <svg width={1920} height={1080} style={{ position: "absolute", left: -x + 0, top: -y, overflow: "visible", pointerEvents: "none" }} />}
  </div>;
};

// número grande de pincel (tinta) con trazo que se seca: "20 AÑOS"
const Pincel: React.FC<{ t: number; at: number; out: number; x: number; y: number; big: string; small: string; col?: string }> = ({ t, at: a, out, x, y, big, small, col = KO.washi }) => {
  const { k, o } = pop(t, a, out);
  if (o <= 0.01) return null;
  const w = e(t, a, a + 0.6);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.8 + 0.2 * Math.min(1, k)})`, textAlign: "center" }}>
    <svg width={520} height={90} viewBox="0 0 520 90" style={{ position: "absolute", left: "50%", top: "62%", transform: "translateX(-50%)" }}>
      <path d="M 20 50 C 120 20, 260 70, 500 36" stroke={KO.beni} strokeWidth={34} strokeLinecap="round" fill="none" strokeDasharray={560} strokeDashoffset={560 * (1 - w)} opacity={0.9} />
    </svg>
    <div style={{ position: "relative", fontFamily: SERIF, fontWeight: 800, fontSize: 210, lineHeight: 1, color: col, textShadow: extrude(10, "#1c1210") }}>{big}</div>
    <div style={{ position: "relative", fontFamily: SERIF, fontWeight: 800, fontSize: 64, color: col, letterSpacing: 14, textShadow: extrude(5, "#1c1210") }}>{small}</div>
  </div>;
};

// calendario que vuela meses (ENE→…) mientras la alacena se abre: "MESES"
const MesesVuelan: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const o = e(t, a, a + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const M = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO"];
  return <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
    {M.map((m, i) => { const ti = a + i * 0.16, q = Math.max(0, Math.min(1.4, (t - ti) / 1.3)); if (q <= 0) return null;
      const xx = 960 + Math.sin(i * 2.3) * 620 * q, yy = 560 - 380 * q + 160 * q * q, r = (i % 2 ? 1 : -1) * 70 * q;
      return <div key={i} style={{ position: "absolute", left: xx, top: yy, transform: `translate(-50%,-50%) rotate(${r}deg) scale(${1.25 - 0.3 * q})`, opacity: Math.min(1, 3 * (1.4 - q)), width: 170, height: 190, borderRadius: 8, background: `linear-gradient(180deg, ${KO.washi}, #e1d2ae)`, boxShadow: "0 20px 40px rgba(0,0,0,.5)", textAlign: "center", paddingTop: 16 }}>
        <div style={{ height: 34, margin: "-16px 0 10px", background: KO.beni, borderRadius: "8px 8px 0 0" }} />
        <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 64, color: KO.sumi }}>{m}</div></div>; })}
    <div style={{ position: "absolute", left: 960, top: 840, transform: `translate(-50%,-50%) scale(${Math.min(1.1, spr(t, a + 0.15, 1))})`, fontFamily: SERIF, fontWeight: 800, fontSize: 190, color: KO.oro, textShadow: extrude(10, "#3a2208"), letterSpacing: 8 }}>MESES</div>
  </AbsoluteFill>;
};

// el eco: "¿MESES?" en tinta que tiembla, y "¡SÍ, MESES!" que lo pisa con sello
const Eco: React.FC<{ t: number; a: number; b: number; out: number }> = ({ t, a, b, out }) => {
  const o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const q = Math.min(1.1, spr(t, a, 1.2)), shake = t < b ? Math.sin(t * 40) * 4 : 0;
  return <AbsoluteFill style={{ opacity: o }}>
    <div style={{ position: "absolute", left: 1380 + shake, top: 300, transform: `translate(-50%,-50%) scale(${q}) rotate(-6deg)`, fontFamily: SERIF, fontWeight: 800, fontSize: 150, color: KO.washi, opacity: 1 - 0.55 * e(t, b, b + 0.2), textShadow: extrude(8, "#1c1210") }}>¿MESES?</div>
    {t >= b && <div style={{ position: "absolute", left: 1380, top: 560 }}><Hanko t={t} at={b} out={out} x={0} y={0} lines={["¡SÍ, MESES!"]} size={104} rot={4} /></div>}
  </AbsoluteFill>;
};

// "no es magia": la varita dibujada que se tacha
const NoMagia: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const { k, o } = pop(t, a, out);
  if (o <= 0.01) return null;
  const sl = e(t, a + 0.35, a + 0.6);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * Math.min(1, k)})` }}>
    <svg width={420} height={300} viewBox="-210 -150 420 300">
      <line x1={-120} y1={100} x2={70} y2={-70} stroke={KO.sumi} strokeWidth={18} strokeLinecap="round" /><line x1={-120} y1={100} x2={70} y2={-70} stroke={KO.washi} strokeWidth={10} strokeLinecap="round" />
      {Array.from({ length: 5 }, (_, i) => { const ang = (i / 5) * Math.PI * 2 + t * 2; return <path key={i} d={`M ${90 + Math.cos(ang) * 40} ${-90 + Math.sin(ang) * 40} l 8 -18 l 8 18 l -16 0 Z`} fill={KO.oro} />; })}
      <line x1={-180} y1={-120} x2={180} y2={120} stroke={KO.beni} strokeWidth={22} strokeLinecap="round" strokeDasharray={440} strokeDashoffset={440 * (1 - sl)} />
    </svg>
    <div style={{ fontFamily: HAND, fontWeight: 600, fontSize: 70, color: KO.washi, textAlign: "center", textShadow: "0 6px 18px rgba(0,0,0,.8)", marginTop: -20 }}>no es magia</div>
  </div>;
};

// 15 fichas de madera que se alinean una por una (sobre el avatar): QUINCE trucos
const Fichas15: React.FC<{ t: number; at: number; out: number; y?: number; sub?: string; subAt?: number }> = ({ t, at: a, out, y = 900, sub, subAt = 1e9 }) => {
  const o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 960, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <div style={{ display: "flex", gap: 10 }}>{Array.from({ length: 15 }, (_, i) => { const kk = Math.min(1.12, spr(t, a + i * 0.045, 1.4));
      return <div key={i} style={{ width: 82, height: 100, borderRadius: 10, background: `linear-gradient(180deg, ${KO.hinoki}, #c99a62)`, boxShadow: `0 ${10 * kk}px 20px rgba(0,0,0,.5), inset 0 -6px 0 rgba(90,55,30,.35)`, transform: `translateY(${(1 - Math.min(1, kk)) * 160}px) scale(${kk})`, fontFamily: SERIF, fontWeight: 800, fontSize: 52, lineHeight: "100px", color: i === 6 ? KO.beni : KO.sumi }}>{i + 1}</div>; })}</div>
    {sub && <div style={{ marginTop: 18, fontFamily: SERIF, fontWeight: 800, fontSize: 48, color: KO.washi, letterSpacing: 6, textShadow: extrude(5, "#1c1210"), opacity: e(t, subAt, subAt + 0.3) }}>{sub}</div>}
  </div>;
};

// moneda de cobre con agujero (5 yenes) que gira y muestra $0 / reloj de arena de 1 minuto
const Moneda: React.FC<{ t: number; at: number; out: number; x: number; y: number; label: string; sub: string; kind: "coin" | "clock" }> = ({ t, at: a, out, x, y, label, sub, kind }) => {
  const { k, o } = pop(t, a, out);
  if (o <= 0.01) return null;
  const spin = (1 - Math.min(1, k)) * 540 + 8 * Math.sin(t * 2);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%)`, textAlign: "center", perspective: 900 }}>
    <div style={{ width: 280, height: 280, margin: "0 auto", borderRadius: "50%", transform: `rotateY(${spin}deg) scale(${0.6 + 0.4 * Math.min(1, k)})`,
      background: kind === "coin" ? "radial-gradient(circle at 35% 30%, #f6d48a, #c88a2c 55%, #8a5a18)" : `radial-gradient(circle at 35% 30%, ${KO.washi}, #d9c8a2)`,
      boxShadow: "0 30px 50px rgba(0,0,0,.55), inset 0 0 0 10px rgba(0,0,0,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {kind === "coin" ? <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 130, color: "#5a3608", textShadow: "0 3px 0 #ffe6a8" }}>{label}</div>
        : <svg width={200} height={200} viewBox="-100 -100 200 200"><circle r={88} fill="none" stroke={KO.sumi} strokeWidth={8} />
          <path d={`M 0 0 L 0 -80 A 80 80 0 ${ei(t, a + 0.2, a + 1.4) > 0.5 ? 1 : 0} 1 ${Math.sin(ei(t, a + 0.2, a + 1.4) * Math.PI * 2) * 80} ${-Math.cos(ei(t, a + 0.2, a + 1.4) * Math.PI * 2) * 80} Z`} fill={KO.beni} opacity={0.85} />
          <text y={30} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={74} fill={KO.sumi}>{label}</text></svg>}
    </div>
    <div style={{ marginTop: 14, fontFamily: SERIF, fontWeight: 800, fontSize: 50, color: KO.washi, letterSpacing: 4, textShadow: extrude(5, "#1c1210") }}>{sub}</div>
  </div>;
};

// números sobre los frascos de la alacena (proyectados desde el 3D)
const JarNums: React.FC<{ t: number; a: number; out: number; only?: number }> = ({ t, a, out, only }) => <>{JARS.map((q, i) => {
  if (only && only !== i + 1) return null;
  const p = screenOf(t, only ? [q[0] + 0.12, q[1] + 0.13, q[2] + 0.05] as V : [q[0], q[1] + 0.27, q[2] + 0.05] as V), at0 = a + i * 0.07, k = Math.min(1.15, spr(t, at0, 1.3)), o = e(t, at0, at0 + 0.08) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const seven = i === 6 && t > T.siete;
  return <div key={i} style={{ position: "absolute", left: p.x, top: p.y, opacity: o * (t > T.siete && !seven && !only ? 0.35 : 1), transform: `translate(-50%,-50%) scale(${k * (seven ? 1.5 : 1)})`, width: 66, height: 66, borderRadius: "50%",
    background: seven ? KO.oro : KO.washi, border: `4px solid ${seven ? "#7a4a10" : KO.beni}`, fontFamily: SERIF, fontWeight: 800, fontSize: 38, lineHeight: "58px", textAlign: "center", color: KO.sumi, boxShadow: seven ? "0 0 30px rgba(255,200,90,.9)" : "0 8px 16px rgba(0,0,0,.45)" }}>{i + 1}</div>;
})}</>;

// torres de monedas que crecen una al lado de la otra: el ahorro del número 7
const Ahorro: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const { k, o } = pop(t, a, out);
  if (o <= 0.01) return null;
  const H = [5, 8, 12, 16];
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.75 + 0.25 * Math.min(1, k)})`, textAlign: "center" }}>
    <svg width={460} height={380} viewBox="-230 -340 460 380" style={{ filter: "drop-shadow(0 24px 30px rgba(0,0,0,.55))" }}>
      <ellipse cx={0} cy={22} rx={220} ry={22} fill="rgba(0,0,0,.35)" />
      {H.map((n, c) => Array.from({ length: n }, (_, i) => { const ti = a + 0.15 + c * 0.12 + i * 0.05, q = Math.max(0, Math.min(1, (t - ti) / 0.18)); if (q <= 0) return null;
        const cx = -150 + c * 100, cy = 8 - i * 17 - (1 - q) * 90;
        return <g key={c + "-" + i} opacity={q}><ellipse cx={cx} cy={cy + 6} rx={42} ry={12} fill="#9a6418" /><rect x={cx - 42} y={cy - 2} width={84} height={8} fill="#c88a2c" /><ellipse cx={cx} cy={cy - 2} rx={42} ry={12} fill="#f0c463" stroke="#a8701e" strokeWidth={2} /><ellipse cx={cx} cy={cy - 2} rx={9} ry={3} fill="#7a4a10" /></g>; }))}
    </svg>
    <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 84, color: KO.oro, textShadow: extrude(7, "#3a2208"), marginTop: -6 }}>AHORRO</div>
    <div style={{ fontFamily: HAND, fontWeight: 600, fontSize: 44, color: KO.washi, textShadow: "0 4px 12px rgba(0,0,0,.8)" }}>muchísimo</div>
  </div>;
};

// globitos de la familia que dicen "¡qué tontería!" y Keiko los pincha
const Globos: React.FC<{ t: number; at: number; pop2: number; out: number }> = ({ t, at: a, pop2, out }) => {
  const o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const G = [{ x: 420, y: 260, s: "¡Qué tontería!", r: -6 }, { x: 1500, y: 220, s: "¿Un chile en el arroz?", r: 5 }, { x: 1440, y: 520, s: "Cosas de abuela…", r: -3 }];
  return <AbsoluteFill style={{ opacity: o }}>{G.map((g, i) => { const k = Math.min(1.12, spr(t, a + i * 0.35, 1.2)), burst = e(t, pop2 + i * 0.1, pop2 + 0.15 + i * 0.1);
    if (k <= 0.01) return null;
    return <div key={i} style={{ position: "absolute", left: g.x, top: g.y, transform: `translate(-50%,-50%) rotate(${g.r}deg) scale(${k * (1 + 0.4 * burst)})`, opacity: 1 - burst }}>
      <div style={{ position: "relative", padding: "22px 40px", background: "#fffdf6", borderRadius: 50, boxShadow: "0 20px 40px rgba(0,0,0,.45)", fontFamily: HAND, fontWeight: 600, fontSize: 58, color: KO.tinta, whiteSpace: "nowrap" }}>{g.s}
        <div style={{ position: "absolute", left: 60, bottom: -24, width: 0, height: 0, borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderTop: "30px solid #fffdf6" }} /></div>
    </div>; })}</AbsoluteFill>;
};

// el kakejiku: un rollo de papel que se desenrolla y もったいない se pinta trazo a trazo; abajo la traducción a mano
const Kakejiku: React.FC<{ t: number; at: number; out: number; transAt: number }> = ({ t, at: a, out, transAt }) => {
  const o = e(t, a, a + 0.12) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const un = ei(t, a, a + 0.8), ink = e(t, a + 0.5, a + 2.2);
  return <AbsoluteFill style={{ opacity: o, background: `radial-gradient(ellipse at 50% 45%, #3a2a1c, #120c08)` }}>
    <div style={{ position: "absolute", left: 960, top: 70, width: 1240, transform: "translateX(-50%)" }}>
      <div style={{ height: 34, borderRadius: 17, background: "linear-gradient(180deg,#7a4b2a,#3a2214)", boxShadow: "0 10px 20px rgba(0,0,0,.6)" }} />
      <div style={{ height: 760 * un, overflow: "hidden", margin: "0 30px", background: `linear-gradient(180deg, ${KO.washi}, #e9dcbd)`, boxShadow: "inset 0 0 60px rgba(140,100,40,.25), 0 30px 60px rgba(0,0,0,.6)", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", clipPath: `inset(0 ${100 - 100 * ink}% 0 0)` }}>
          <Img src={staticFile(P + "kanji_mottainai_ink.png")} style={{ height: 300, objectFit: "contain", filter: "url(#tinta) drop-shadow(2px 3px 0 rgba(30,20,10,.35))" }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", fontFamily: SERIF, fontWeight: 800, fontSize: 92, letterSpacing: 18, color: KO.beni, opacity: e(t, a + 1.6, a + 2.0) }}>MOTTAINAI</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: HAND, fontWeight: 600, fontSize: 78, color: KO.tinta, clipPath: `inset(-20% ${100 - 100 * e(t, transAt, transAt + 1.2)}% -20% 0)` }}>"qué pena desperdiciar"</div>
        <div style={{ position: "absolute", right: 70, bottom: 40, width: 90, height: 90, border: `6px solid ${KO.beni}`, borderRadius: 8, opacity: e(t, transAt + 1.2, transAt + 1.3), transform: `scale(${2 - Math.min(1, spr(t, transAt + 1.2, 1.4))})`, color: KO.beni, fontFamily: SERIF, fontWeight: 800, fontSize: 30, lineHeight: "38px", textAlign: "center", paddingTop: 6 }}>母<br />の</div>
      </div>
      <div style={{ height: 40, borderRadius: 20, background: "linear-gradient(180deg,#7a4b2a,#3a2214)", boxShadow: "0 10px 20px rgba(0,0,0,.6)", transform: `translateY(${-4}px)` }} />
    </div>
  </AbsoluteFill>;
};

// el olor de la caja: hilos de aroma dorados que suben y se enroscan
export const Aroma: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a, a + 0.3) * (1 - e(t, out, out + 0.4));
  if (o <= 0.01) return null;
  const d = (k: number) => { let p = `M ${x + (k - 1) * 70} ${y}`; for (let i = 1; i <= 14; i++) { const yy = y - i * 34, xx = x + (k - 1) * 70 + Math.sin(i * 0.7 + t * 2 + k) * (20 + i * 4); p += ` L ${xx.toFixed(1)} ${yy.toFixed(1)}`; } return p; };
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    {[0, 1, 2].map((k) => <path key={k} d={d(k)} fill="none" stroke="rgba(255,226,170,.8)" strokeWidth={7 - k} strokeLinecap="round" strokeDasharray="1400" strokeDashoffset={1400 * (1 - e(t, a + k * 0.12, a + 1.1 + k * 0.12))} style={{ filter: "blur(2.5px) drop-shadow(0 0 12px rgba(255,210,140,.8))" }} />)}
  </svg>;
};

// SUSCRÍBETE: un sello hanko gigante que baja y estampa la palabra sobre washi + un fūrin (campanita de vidrio) que se mece y suena
const Suscribete: React.FC<{ t: number; at: number; bell: number; out: number }> = ({ t, at: a, bell, out }) => {
  const o = e(t, a - 0.1, a + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const down = ei(t, a, a + 0.22), up = ei(t, a + 0.3, a + 0.6), hit = t >= a + 0.22;
  const ink = hit ? Math.min(1, spr(t, a + 0.22, 1.6)) : 0;
  const sw = t < bell ? 0 : Math.sin((t - bell) * 9) * Math.exp(-(t - bell) * 1.1) * 26;
  const ring = (k: number) => { const ph = t - bell - k * 0.18; return ph > 0 && ph < 1.4 ? ph / 1.4 : -1; };
  return <AbsoluteFill style={{ opacity: o }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(10,7,5,.15), rgba(10,7,5,.65))" }} />
    {/* hoja de washi */}
    <div style={{ position: "absolute", left: 60, top: 560, width: 760, height: 300, transform: `rotate(-2deg) scale(${0.9 + 0.1 * e(t, a - 0.1, a + 0.15)})`, background: `linear-gradient(180deg, ${KO.washi}, #e7d8b6)`, boxShadow: "0 40px 80px rgba(0,0,0,.6)", borderRadius: 6 }}>
      <div style={{ position: "absolute", inset: 30, border: "3px solid rgba(181,47,58,.35)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 78, textAlign: "center", fontFamily: SERIF, fontWeight: 800, fontSize: 94, letterSpacing: 2, color: KO.beni, whiteSpace: "nowrap", opacity: ink, transform: `scale(${1.25 - 0.25 * ink})`, filter: "url(#tinta)" }}>SUSCRÍBETE</div>
    </div>
    {/* el sello: cae, aprieta y sube */}
    {up < 1 && <div style={{ position: "absolute", left: 440, top: 690 - 600 * (1 - down) - 500 * up, transform: `translate(-50%,-100%) scaleY(${hit && up < 0.2 ? 0.94 : 1})`, transformOrigin: "50% 100%" }}>
      <div style={{ width: 120, height: 200, margin: "0 auto", borderRadius: "60px 60px 14px 14px", background: "linear-gradient(90deg,#5a3418,#9a6a3c 45%,#4a2a12)", boxShadow: "0 20px 40px rgba(0,0,0,.6)" }} />
      <div style={{ width: 660, height: 46, borderRadius: 8, background: "linear-gradient(180deg,#7a4b2a,#3a2214)", boxShadow: `0 ${hit ? 4 : 30}px ${hit ? 10 : 40}px rgba(0,0,0,.6)` }} />
    </div>}
    {/* el fūrin: campana de vidrio soplado abierta abajo, pintada con olas y un pez rojo, badajo y tira de papel (tanzaku) con la campanita */}
    <svg width={360} height={760} viewBox="-180 0 360 760" style={{ position: "absolute", left: 1320, top: -20, overflow: "visible", transformOrigin: "180px 0", transform: `rotate(${sw}deg)`, opacity: e(t, bell - 0.6, bell - 0.3) }}>
      <defs>
        <radialGradient id="vid" cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#ffffff" stopOpacity=".95" /><stop offset=".45" stopColor="#d9eef3" stopOpacity=".55" /><stop offset="1" stopColor="#8fbfcc" stopOpacity=".6" /></radialGradient>
      </defs>
      <line x1={0} y1={0} x2={0} y2={200} stroke="#efe2c4" strokeWidth={3} />
      <path d="M -95 330 C -100 250, -60 200, 0 200 C 60 200, 100 250, 95 330 Z" fill="url(#vid)" stroke="rgba(255,255,255,.85)" strokeWidth={3} />
      <ellipse cx={0} cy={330} rx={95} ry={14} fill="rgba(60,90,100,.35)" stroke="rgba(255,255,255,.9)" strokeWidth={3} />
      <path d="M -88 296 Q -66 284 -44 296 T 0 296 T 44 296 T 88 296" stroke="#2f5d8a" strokeWidth={5} fill="none" opacity={0.85} />
      <path d="M -40 258 C -25 244, 5 246, 14 258 C 5 270, -25 272, -40 258 Z M 14 258 L 30 246 L 28 270 Z" fill={KO.beni} opacity={0.9} />
      <ellipse cx={-38} cy={232} rx={20} ry={30} fill="rgba(255,255,255,.55)" />
      <line x1={0} y1={210} x2={0} y2={350} stroke="#efe2c4" strokeWidth={3} transform={`rotate(${-sw * 0.6} 0 210)`} />
      <g transform={`rotate(${-sw * 1.1} 0 350)`}>
        <line x1={0} y1={330} x2={0} y2={380} stroke="#efe2c4" strokeWidth={3} />
        <rect x={-44} y={378} width={88} height={240} rx={4} fill={KO.washi} stroke="#d6c39a" strokeWidth={2} />
        <path d="M 0 440 C -24 440, -28 462, -28 486 L -28 506 L -38 520 L 38 520 L 28 506 L 28 486 C 28 462, 24 440, 0 440 Z" fill={KO.beni} />
        <circle cx={0} cy={532} r={8} fill={KO.beni} />
      </g>
    </svg>
    {/* ondas del sonido de la campanita */}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {[0, 1, 2].map((k) => { const r = ring(k); return r < 0 ? null : <circle key={k} cx={1500} cy={250} r={80 + r * 240} fill="none" stroke="rgba(255,240,210,.9)" strokeWidth={6 * (1 - r)} opacity={1 - r} />; })}
    </svg>
    <div style={{ position: "absolute", left: 1660, top: 640, transform: "translateX(-50%) rotate(-4deg)", fontFamily: HAND, fontWeight: 600, fontSize: 64, color: KO.washi, textShadow: "0 6px 18px rgba(0,0,0,.85)", opacity: e(t, bell + 0.1, bell + 0.4), whiteSpace: "nowrap" }}>¡y la campanita!</div>
  </AbsoluteFill>;
};

// la pregunta para comentar: una tablilla ema de madera colgada, la pregunta se escribe a pincel y una flecha baja a los comentarios
const EmaPregunta: React.FC<{ t: number; at: number; q: number; out: number }> = ({ t, at: a, q, out }) => {
  const { k, o } = pop(t, a, out, 0.9);
  if (o <= 0.01) return null;
  const sw = Math.sin(t * 1.6) * 1.6 * Math.exp(-(t - a) * 0.4);
  const lines = ["¿Qué se te echa", "a perder", "primero a ti?"];
  return <AbsoluteFill style={{ opacity: o }}>
    <div style={{ position: "absolute", left: 300, top: 40, transformOrigin: "50% 0", transform: `translateX(-50%) translateY(${(1 - Math.min(1, k)) * -500}px) scale(0.66) rotate(${sw}deg)` }}>
      <svg width={300} height={110} style={{ display: "block", margin: "0 auto" }}><path d="M 40 110 L 150 10 L 260 110" stroke={KO.beni} strokeWidth={7} fill="none" /><circle cx={150} cy={10} r={9} fill="#3a2a1c" /></svg>
      <div style={{ position: "relative", width: 820, height: 560, marginTop: -8, clipPath: "polygon(0 22%, 50% 0, 100% 22%, 100% 100%, 0 100%)", background: `linear-gradient(180deg, ${KO.hinoki}, #d4ae76)`, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 96, height: 14, background: "rgba(122,75,42,.55)" }} />
        {lines.map((ln, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 150 + i * 112, textAlign: "center", fontFamily: HAND, fontWeight: 600, fontSize: i === 0 ? 84 : 88, color: KO.sumi, filter: "url(#tinta)", clipPath: `inset(-20% ${100 - 100 * e(t, q + i * 0.45, q + 0.5 + i * 0.45)}% -20% 0)` }}>{ln}</div>)}
        <div style={{ position: "absolute", right: 46, bottom: 34, width: 74, height: 74, border: `5px solid ${KO.beni}`, borderRadius: 8, color: KO.beni, fontFamily: SERIF, fontWeight: 800, fontSize: 24, lineHeight: "30px", textAlign: "center", paddingTop: 6, opacity: e(t, q + 1.6, q + 1.7), transform: `scale(${2 - Math.min(1, spr(t, q + 1.6, 1.4))})` }}>KEI<br />KO</div>
      </div>
    </div>
    {/* "cuéntame abajo": flecha de pincel que baja hasta la caja de comentarios, que se escribe sola */}
    <svg width={260} height={330} style={{ position: "absolute", left: 1430, top: 560 }}>
      <path d="M 60 10 C 150 90, 40 180, 130 290" stroke={KO.washi} strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray={360} strokeDashoffset={360 * (1 - e(t, a + 0.1, a + 0.6))} style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,.7))" }} />
      <path d="M 90 260 L 132 300 L 168 252" stroke={KO.washi} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={e(t, a + 0.55, a + 0.65)} />
    </svg>
    <div style={{ position: "absolute", left: 960, top: 930, transform: `translate(-50%,0) translateY(${(1 - e(t, a + 0.3, a + 0.7)) * 200}px)`, width: 1100, height: 96, borderRadius: 48, background: "rgba(251,248,241,.96)", boxShadow: "0 20px 50px rgba(0,0,0,.6)", display: "flex", alignItems: "center", gap: 24, padding: "0 30px" }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: `linear-gradient(135deg, ${KO.matcha}, ${KO.ai})` }} />
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 36, color: "#5f5f5f", whiteSpace: "nowrap", overflow: "hidden", width: 820 }}>{"A mí, el pan de molde…".slice(0, Math.max(0, Math.floor((t - q - 0.4) * 10)))}<span style={{ opacity: Math.floor(t * 2.5) % 2 }}>|</span></div>
    </div>
  </AbsoluteFill>;
};

// nota de cuaderno escrita a mano (papel con renglones azules)
export const Nota: React.FC<{ t: number; at: number; out: number; x: number; y: number; lines: string[]; rot?: number; w?: number }> = ({ t, at: a, out, x, y, lines, rot = -4, w = 460 }) => {
  const { k, o } = pop(t, a, out, 0.9);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200 }}>
    <div style={{ transform: `translate(-50%,-50%) rotateX(${(1 - Math.min(1, k)) * 60}deg) rotate(${rot + 1.2 * Math.sin(t * 1.3)}deg)`, width: w, padding: "26px 34px 30px", background: `repeating-linear-gradient(180deg, transparent 0 55px, rgba(36,55,92,.22) 55px 57px), linear-gradient(180deg, ${KO.papel}, #e4d1a6)`, borderRadius: 6, boxShadow: "0 30px 60px rgba(0,0,0,.55)" }}>
      <div style={{ position: "absolute", left: "50%", top: -14, width: 90, height: 28, transform: "translateX(-50%) rotate(-3deg)", background: "rgba(181,47,58,.55)" }} />
      {lines.map((ln, i) => <div key={i} style={{ fontFamily: HAND, fontWeight: 600, fontSize: i === 0 ? 60 : 48, lineHeight: "57px", color: KO.tinta, clipPath: `inset(0 ${100 - 100 * e(t, a + 0.15 + i * 0.3, a + 0.6 + i * 0.3)}% 0 0)` }}>{ln}</div>)}
    </div>
  </div>;
};

// título del truco: noren índigo que baja con el número
export const NorenTitulo: React.FC<{ t: number; at: number; n: number; text: string }> = ({ t, at: a, n, text }) => {
  const d = ei(t, a, a + 0.6);
  if (d <= 0.01) return null;
  return <div style={{ position: "absolute", left: 420, top: 0, transform: "translateX(-50%)", display: "flex", gap: 8 }}>
    {[0, 1, 2].map((i) => <div key={i} style={{ width: 230, height: 360 * d, overflow: "hidden", background: `linear-gradient(180deg, ${KO.ai}, #1a2846)`, borderRadius: "0 0 10px 10px", boxShadow: "0 20px 40px rgba(0,0,0,.5)",
      transform: `rotate(${Math.sin(t * 1.4 + i) * 1.2}deg)`, transformOrigin: "50% 0", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 26 }}>
      {i === 1 && <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 170, color: KO.washi, lineHeight: 1 }}>{n}</div>}
      {i === 0 && <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 46, color: KO.washi, letterSpacing: 3 }}>TRUCO</div>}
      {i === 2 && <div style={{ width: 60, height: 60, borderRadius: "50%", border: `6px solid ${KO.washi}` }} />}
    </div>)}
    <div style={{ position: "absolute", left: "50%", top: 392, width: 640, transform: `translateX(-50%) rotate(-1deg) scaleY(${e(t, a + 0.5, a + 0.8)})`, transformOrigin: "50% 0", textAlign: "center", fontFamily: SERIF, fontWeight: 800, fontSize: 58, lineHeight: "70px", color: KO.tinta, background: `linear-gradient(180deg, ${KO.washi}, #e9dcbc)`, padding: "18px 28px", borderTop: `6px solid #b3241c`, boxShadow: "0 18px 36px rgba(0,0,0,.45)" }}>{text}</div>
  </div>;
};

// =====================================================================================================
// ---------------- EL MINUTO ----------------
// =====================================================================================================
export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [<TintaFilter key="tf" />];
  const W = (k: string, tt = t, over?: Partial<WorldProps>) => <World key={k} t={tt} over={over} />;
  const A = AVS;

  // A · 0-4,55 · avatar "abres la bolsa de arroz… y ves algo que se mueve" → portal a la bolsa
  if (t < A[0][1] + 0.02) {
    L.push(<Avatar key="avA" t={t} />);
    const r = ei(t, 3.75, A[0][1]);
    if (r > 0) L.push(<Portal key="pA" x={1240} y={640} r={r}><Clip k="h_gorgojos" t={t} a={3.75} z={[1.25, 1.12]} /></Portal>);
  }
  // B · 4,55-8,8 · los bichitos caminan por los granos; la lupa los sigue
  if (t >= A[0][1] && t < 8.85) {
    L.push(<Clip key="cB" k="h_gorgojos" t={t} a={3.75} z={[1.12, 1.03]} dur={5} />);
    L.push(<Gorgojos key="gg" t={t} at={T.bichitos} out={8.6} />);
    L.push(<Tag key="tg" t={t} at={T.bichitos + 0.6} x={720} y={420} dx={-240} dy={-200} text="GORGOJOS" col={KO.washi} out={8.4} size={52} />);
  }
  // C · 8,8-11,3 · "y el paquete lo compraste hace un mes": la mano con la bolsa + el calendario se arranca
  if (t >= 8.8 && t < 11.35) {
    L.push(<Slide key="sC" t={t} a={8.8} w={0.4} from={<Clip k="h_gorgojos" t={t} a={3.75} z={[1.12, 1.03]} dur={5} />} to={<Clip k="h_bolsa" t={t} a={8.8} z={[1.02, 1.1]} ox={-40} />} />);
    L.push(<Calendario key="cal" t={t} at={T.paquete} out={11.15} x={1460} y={420} from={21} to={21 + 30} label="HACE 1 MES" dur={1.2} />);
  }
  // D · 11,3-14,6 · "lo tiras entero a la basura… y no le cuentas a nadie"
  if (t >= 11.3 && t < 14.65) {
    L.push(<Slide key="sD" t={t} a={11.3} w={0.4} dir={-1} from={<Clip k="h_bolsa" t={t} a={8.8} z={[1.02, 1.1]} ox={-40} />} to={<Clip k="h_basura" t={t} a={11.3} z={[1.04, 1.12]} oy={30} />} />);
    L.push(<Hanko key="hb" t={t} at={T.basura} out={14.3} x={560} y={300} lines={["A LA BASURA"]} size={84} rot={-8} />);
    L.push(<Nota key="ns" t={t} at={T.nadie} out={14.35} x={1460} y={760} rot={4} w={480} lines={["(y no le cuentas", "a nadie… shh)"]} />);
  }
  // E · 14,3-17,15 · el callejón de Kioto al atardecer: la cámara entra volando por la ventana — "no fue tu culpa"
  if (t >= 14.3 && t < A[1][0] + 0.02) {
    L.push(W("wE"));
    L.push(<Hanko key="nc" t={t} at={T.culpa} out={A[1][0] + 1.6} x={960} y={540} lines={["NO FUE", "TU CULPA"]} size={120} rot={-4} />);
  }
  L.push(<Flash key="flE" t={t} at={14.45} col="#ffe9c8" peak={0.55} w={0.35} />);
  // F · 17,15-21,7 · avatar: "nadie te enseñó dónde vive el arroz, ni el miso, ni las algas, ni la soja"
  if (inAv(t, 1)) {
    L.push(<Avatar key="avF" t={t} />);
    L.push(<Hanko key="nc2" t={t} at={T.culpa} out={A[1][0] + 1.6} x={960} y={540} lines={["NO FUE", "TU CULPA"]} size={120} rot={-4} />);
    L.push(<DondeVive key="dv" t={t} out={A[1][1] - 0.15} items={[{ at: T.arroz2, kanji: "kome", es: "ARROZ" }, { at: T.miso, kanji: "miso", es: "MISO" }, { at: T.algas, kanji: "konbu", es: "ALGAS" }, { at: T.soja, kanji: "shoyu", es: "SOJA" }]} />);
  }
  // G1 · 21,7-24,6 · "la tienda te vende todo en bolsas…": la estufa real con las bolsas abiertas
  if (t >= A[1][1] && t < 24.85) {
    L.push(<Clip key="cG" k="h_estufa" t={t} a={A[1][1]} z={[1.04, 1.12]} ox={-30} />);
    L.push(<Tag key="tb" t={t} at={T.bolsas} x={1120} y={560} dx={-260} dy={-260} text="BOLSAS" sub="QUE NO SE CIERRAN" col={KO.washi} out={24.6} size={58} />);
  }
  // G2 · 24,6-30,4 · las mismas bolsas en la cocina de Keiko, al lado del fuego: el calor
  if (t >= 24.6 && t < 30.45) {
    const amt = e(t, T.lado, T.calor + 0.3);
    const w = W("wG");
    L.push(<AbsoluteFill key="hhG"><HeatWorld t={t} amt={amt}>{w}</HeatWorld></AbsoluteFill>);
    const b = screenOf(t, [PT.bolsas[0], PT.bolsas[1] + 0.3, PT.bolsas[2]] as V);
    L.push(<Tag key="ab" t={t} at={T.abren} x={b.x} y={b.y} text="SE ABREN…" sub={t > T.cierran ? "Y NO SE CIERRAN" : undefined} col={KO.washi} out={T.lado} size={54} dx={320} dy={40} />);
    L.push(<TermoCocina key="tc" t={t} at={T.lado} out={30.2} x={1560} y={470} from={18} to={38} />);
  }
  L.push(<SteamWipe key="sw1" t={t} mid={24.65} w={0.4} />);
  // H · 30,4-33,2 · "cuando cocinas para una sola persona": la heladera con verdura de más
  if (t >= 30.4 && t < A[2][0] + 0.02) {
    L.push(<Clip key="cH" k="h_heladera" t={t} a={30.4} z={[1.1, 1.02]} />);
    L.push(<UnaPersona key="up" t={t} at={T.sola} out={A[2][0] - 0.1} x={1400} y={330} />);
  }
  L.push(<SteamWipe key="sw2" t={t} mid={30.42} w={0.35} />);
  // AV3 · 33,2-39,55 · "la mitad se echa a perder… yo tengo 76 años"
  if (inAv(t, 2)) {
    L.push(<Avatar key="avI" t={t} />);
    L.push(<MitadTazon key="mt" t={t} at={T.mitad} out={T.anos76 - 0.25} x={1450} y={430} />);
    L.push(<PlacaNombre key="pn" t={t} at={T.anos76 - 0.1} out={A[2][1] + 4.5} name="KEIKO" l2="76 AÑOS" l2at={T.anos76} l3="KIOTO" l3at={T.kioto} />);
  }
  // I · 39,55-45,0 · la cocina entera: Kioto (mapa), la madera, 20 años
  if (t >= A[2][1] && t < 45.25) {
    L.push(W("wI"));
    L.push(<PlacaNombre key="pn2" t={t} at={T.anos76 - 0.1} out={A[2][1] + 4.5} name="KEIKO" l2="76 AÑOS" l2at={T.anos76} l3="KIOTO" l3at={T.kioto} />);
    L.push(<Mapa key="mp" t={t} at={Math.max(A[2][1] + 0.05, T.kioto - 0.6)} out={T.veinte - 0.2} x={1500} y={420} />);
    const m = screenOf(t, [-0.2, 2.0, ZB_]);
    L.push(<Tag key="md" t={t} at={T.madera} x={m.x} y={m.y} dx={-200} dy={-120} text="MADERA" sub="CHIQUITA" col={KO.washi} out={T.veinte} size={50} />);
    L.push(<Pincel key="20" t={t} at={T.veinte} out={45.0} x={1420} y={420} big="20" small="AÑOS" />);
  }
  // I2 · 45-47,6 · "en mi despensa la comida me dura meses": la alacena se abre y vuelan los meses
  if (t >= 45.0 && t < 47.75) {
    L.push(W("wI2"));
    L.push(<MesesVuelan key="mv" t={t} at={T.meses} out={47.5} />);
  }
  // J · 47,6-51,05 · "¿Meses? ¡Sí, meses! No es magia" — Keiko con el frasco de arroz y chiles
  if (t >= 47.6 && t < A[3][0] + 0.02) {
    L.push(<Slide key="sJ" t={t} a={47.6} w={0.45} from={W("wJ0")} to={<Clip k="k_meses" t={t} a={47.6} z={[1.02, 1.1]} />} />);
    L.push(<Eco key="ec" t={t} a={T.meses2} b={T.si} out={T.magia - 0.15} />);
    L.push(<NoMagia key="nm" t={t} at={T.magia} out={A[3][0] - 0.1} x={1450} y={430} />);
  }
  // AV4 · 51,05-56,2 · "son 15 trucos que me enseñó mi madre, y que en tu país casi nadie conoce"
  if (inAv(t, 3)) {
    L.push(<Avatar key="avK" t={t} />);
    L.push(<Fichas15 key="f15" t={t} at={T.quince} out={A[3][1] - 0.1} y={880} sub="CASI NADIE LOS CONOCE" subAt={T.pais} />);
  }
  // K1 · 56,2-60,1 · los 15 frascos en la mesada: $0 y 1 minuto
  if (t >= A[3][1] && t < 60.3) {
    L.push(<Clip key="cK" k="k_quince" t={t} a={A[3][1]} z={[1.02, 1.1]} />);
    L.push(<Moneda key="m0" t={t} at={T.dinero - 0.2} out={60.0} x={420} y={330} label="$0" sub="NINGUNO CUESTA" kind="coin" />);
    L.push(<Moneda key="m1" t={t} at={T.minuto - 0.15} out={60.0} x={1500} y={330} label="1 min" sub="NI UN MINUTO MÁS" kind="clock" />);
  }
  // K2 · 60,1-64,5 · la alacena: los 15 frascos se numeran → el 7 se dora: ahorro
  if (t >= 60.0 && t < 64.6) {
    L.push(W("wK"));
    L.push(<JarNums key="jn" t={t} a={60.3} out={62.2} />);
    L.push(<JarNums key="j7" t={t} a={62.2} out={64.3} only={7} />);
    L.push(<Ahorro key="ah" t={t} at={T.ahorrar - 0.1} out={64.3} x={1550} y={430} />);
  }
  L.push(<SteamWipe key="sw3" t={t} mid={60.1} w={0.35} />);
  // L · 64,5-69,0 · el frasco 1 (arroz con chiles): "alguien en tu familia te va a decir que es una tontería"
  if (t >= 64.4 && t < A[4][0] + 0.02) {
    L.push(W("wL"));
    L.push(<JarNums key="j1" t={t} a={64.7} out={68.8} only={1} />);
    L.push(<Globos key="gl" t={t} at={T.familia} pop2={68.6} out={68.95} />);
  }
  // AV5 · 69-74,7 · "déjalo que lo diga. Ya me conoces, soy Keiko. En mi casa nunca se tira comida"
  if (inAv(t, 4)) {
    L.push(<Avatar key="avM" t={t} />);
    L.push(<Hanko key="nt" t={t} at={T.nunca} out={A[4][1] - 0.1} x={1520} y={250} lines={["AQUÍ NUNCA SE", "TIRA COMIDA"]} size={64} rot={5} paper />);
  }
  // M · 74,7-79,1 · もったいない: el rollo se desenrolla y el pincel escribe
  if (t >= A[4][1] && t < 79.4) L.push(<Kakejiku key="kk" t={t} at={A[4][1] + 0.05} out={79.05} transAt={T.pena} />);
  // N · 79,1-85,0 · la madre guardaba el arroz en la caja de madera, debajo de la escalera (portal) — el olor
  if (t >= 79.0 && t < A[5][0] + 0.02) {
    L.push(<Clip key="cN" k="h_madre" t={t} a={79.0} z={[1.03, 1.1]} ox={-30} />);
    const r = ei(t, T.escalera - 0.5, T.escalera + 0.3);
    if (r > 0) L.push(<Portal key="pN" x={1180} y={640} r={r}><Clip k="h_caja" t={t} a={T.escalera - 0.5} z={[1.15, 1.04]} /></Portal>);
    L.push(<Tag key="tc2" t={t} at={T.caja} x={700} y={640} dx={-200} dy={-260} text="CAJA DE MADERA" sub="CON TAPA" col={KO.washi} out={T.escalera} size={50} />);
    L.push(<Tag key="ts" t={t} at={T.sol} x={1220} y={560} dx={220} dy={-250} text="NUNCA" sub="DABA EL SOL" col={KO.oro} out={A[5][0] - 0.1} size={58} />);
    L.push(<Aroma key="ar" t={t} at={T.sol + 0.4} out={A[5][0]} x={1160} y={700} />);
  }
  L.push(<Flash key="flM" t={t} at={79.05} col="#fff1cf" peak={0.45} w={0.3} />);
  // AV6 · 85-87,9 · "todavía me acuerdo del olor de esa caja" (el avatar se corta antes del CTA nuevo)
  if (inAv(t, 5)) {
    L.push(<Avatar key="avO" t={t} />);
    L.push(<Aroma key="ar2" t={t} at={A[5][0]} out={A[5][1] - 0.3} x={1500} y={900} />);
  }
  // O · 87,9-94,4 · "suscríbete, toca la campanita, y cuéntame abajo: ¿qué se te echa a perder primero a ti?" → "vamos a la despensa"
  if (t >= A[5][1] && t < 95.3) {
    const sl = ei(t, 94.4, 94.95);
    L.push(<AbsoluteFill key="oc" style={{ transform: `translateX(${-sl * 1920}px)`, filter: sl > 0.02 && sl < 0.98 ? `blur(${Math.sin(sl * Math.PI) * 40}px)` : undefined }}>
      {t < 92.9 ? <Clip k="k_cuaderno" t={t} a={A[5][1]} z={[1.03, 1.1]} /> : <Clip k="k_vamos" t={t} a={92.9} z={[1.02, 1.08]} />}</AbsoluteFill>);
    L.push(<Suscribete key="su" t={t} at={T.susc} bell={T.campana} out={T.cuentame - 0.15} />);
    L.push(<EmaPregunta key="em" t={t} at={T.cuentame - 0.1} q={T.pregunta} out={94.3} />);
    if (sl > 0) L.push(<AbsoluteFill key="ow" style={{ transform: `translateX(${(1 - sl) * 1920}px)`, filter: sl < 0.98 ? `blur(${Math.sin(sl * Math.PI) * 40}px)` : undefined }}>{W("wO0", 95.0)}</AbsoluteFill>);
  }
  L.push(<SteamWipe key="sw4" t={t} mid={92.9} w={0.3} />);
  // P · 95-98,6 · la alacena: TRUCO 1, el frasco de arroz con chiles se enciende
  if (t >= 95.25) {
    L.push(W("wP"));
    L.push(<NorenTitulo key="nr" t={t} at={T.truco1} n={1} text="UN CHILE SECO EN EL ARROZ" />);
  }
  return <AbsoluteFill style={{ background: "#0a0705" }}>{L}</AbsoluteFill>;
};

const ZB_ = -1.75;
// mundo con aire caliente que ondula (sólo cuando hay calor)
const HeatWorld: React.FC<{ t: number; amt: number; children: React.ReactNode }> = ({ t, amt, children }) => {
  if (amt <= 0.01) return <>{children}</>;
  return <AbsoluteFill>
    <svg width={0} height={0} style={{ position: "absolute" }}><filter id="hhk" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.022" numOctaves={2} seed={4} result="n" /><feOffset in="n" dx={0} dy={-t * 60} result="m" /><feDisplacementMap in="SourceGraphic" in2="m" scale={amt * 16} xChannelSelector="R" yChannelSelector="G" /></filter></svg>
    <AbsoluteFill style={{ filter: "url(#hhk)" }}>{children}</AbsoluteFill>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 40% 60%, transparent ${60 - amt * 20}%, rgba(255,120,40,${0.38 * amt}) 100%)`, mixBlendMode: "screen" }} />
  </AbsoluteFill>;
};
// el vapor de la olla tapa la pantalla (ida y vuelta)
export const SteamWipe: React.FC<{ t: number; mid: number; w?: number }> = ({ t, mid, w = 0.5 }) => {
  const k = 1 - Math.min(1, Math.abs(t - mid) / w);
  if (k <= 0.01) return null;
  const blobs = Array.from({ length: 14 }, (_, i) => {
    const x = (i * 137) % 1920, y = 1100 - ((t - mid + w) / (2 * w)) * (900 + (i % 5) * 120) + (i % 3) * 140;
    return `radial-gradient(circle ${420 + (i % 4) * 120}px at ${x}px ${y}px, rgba(255,250,240,${0.75 * k}) 0%, rgba(255,250,240,0) 70%)`;
  });
  return <AbsoluteFill style={{ background: blobs.join(","), opacity: Math.min(1, k * 1.6), filter: "blur(18px)" }}><AbsoluteFill style={{ background: `rgba(250,246,236,${0.85 * Math.pow(k, 1.6)})` }} /></AbsoluteFill>;
};
