// cerpapeles · MINUTO 1 + CTA1 (0-151,2 s). Un solo hilo, sin cortes secos, todo clavado a la voz con at():
// avatar "estás en la fila del banco" → portal a la toma del ladrón (guante, primer cajón) → la casa 3D: el cajón se abre,
// la carpeta azul que dice IMPORTANTE → avatar (sello IMPORTANTE) + la lista de papeles que se lleva → toma: la carpeta sale
// del cajón → Claudio cambiando la cerradura de una puerta forzada (rótulo) → avatar → DINERO 1 SEMANA / PAPELES 1 AÑO
// → avatar "los 5 lugares" → la MAQUETA entera se apaga y pasa a VISTA TÉRMICA del ladrón: su recorrido se dibuja en el piso
// y cada escondite se enciende en rojo (escritorio, cajón con llavecita, caja contra el fuego, congelador, auto) y el placard
// del cerrajero en verde → avatar "3 copias" → el kit de una tarde → Claudio (rótulo) → avatar → el señor y la carpeta azul
// → 10 MINUTOS en térmica → avatar → la mochila → avatar → suscribirse + la 1ª línea de la descripción + la guía → avatar
// → portal al escritorio. Audio fuera de Remotion (voz + sonido real de los clips se mezclan en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, PT, makeCam, type Key, type WorldState } from "./casa3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import WORDS from "./words.json";
import { BigNum, COL, FONT, Flash, LowerThird, P, Portal, Tag, Vid, e, ei, extrude, s, spr } from "./lib";

// ---------------- reloj de la voz ----------------
const norm = (x: string) => x.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, "");
const WN = (WORDS as { w: string; s: number }[]).map((x) => ({ w: norm(x.w), s: x.s }));
export const at = (ph: string, after = 0): number => {
  const q = norm(ph).split(" ").filter(Boolean);
  for (let i = 0; i < WN.length; i++) {
    if (WN[i].s < after) continue;
    if (q.every((w, j) => WN[i + j]?.w === w)) return WN[i].s;
  }
  throw new Error("at(): no encuentro «" + ph + "» en words.json");
};

export const MIN1_END = 151.2;
export const MIN1_FRAMES = s(MIN1_END);
const AV = AVAIL as { reel: boolean; reelLen?: number; ltx: string[] };
const LTX = new Set(AV.ltx); // clips LTX ya bajados (public/cerpapeles/ltx_<k>.mp4); si no, el cuadro clave img_<k>.jpg
export const clip = (k: string) => (LTX.has(k) ? "ltx_" + k : "img_" + k);
const REEL_LEN = AV.reelLen ?? 253.0; // si la última ventana pide más que el reel → se congela el último cuadro (nunca negro)
export const WIN: { ms: number; me: number; off: number }[] = (AVW as { win: { ms: number; me: number; off: number }[] }).win;

export const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const cur = WIN.findIndex((w) => t >= w.ms - 0.02 && t < w.me);
  const vis = cur >= 0 ? cur : WIN.findIndex((w) => t >= w.ms - 0.32 && t < w.me + 0.8);
  const face = AV.reel ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={Math.max(0, s(w.ms) - 10)} durationInFrames={s(w.me - w.ms) + 12 + 14} layout="none">
      <AbsoluteFill style={{ opacity: i === vis ? 1 : 0 }}><Freeze frame={s(REEL_LEN) - Math.max(0, s(w.off) - 10)} active={(f) => f > s(REEL_LEN) - Math.max(0, s(w.off) - 10)}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};

// ---------------- tiempos (todos salen de la voz) ----------------
export const T = {
  cajon: at("el primer cajon"), noBusca: at("no busca dinero"), carpeta: at("busca una carpeta"), minuto: at("menos de un minuto"), marcador: at("con marcador"), importante: at("importante"),
  escr: at("la escritura"), pasap: at("tu pasaporte"), partida: at("la partida"), test: at("el testamento"), auto0: at("los papeles del auto"), libreta: at("la libreta del banco"),
  cerrajero: at("soy cerrajero"), manana: at("la manana despues"), dinero: at("el dinero que se llevan"), semana: at("una semana"), papeles: at("los papeles que se llevan"), anio: at("un ano entero"),
  tram: at("de tramites"), filas: at("de filas"), nombre: at("tu nombre"), cinco: at("cinco lugares"), revisa: at("revisa primero"), dondeYo: at("y donde los guardo yo"), llevar: at("te voy a llevar"),
  orden: at("en el mismo orden"), joyas: at("busca joyas"), esc: at("primero el escritorio"), llave: at("el cajon con llavecita"), caja: at("la caja contra el fuego"), cong: at("el congelador"),
  auto: at("y el auto"), cerr: at("un cerrajero guarda"), tres: at("tres copias"), tarde: at("en una tarde"), kCarp: at("con una carpeta"), bolsas: at("unas bolsas"), cel: at("tu celular"),
  claudio: at("soy claudio"), cajas: at("abri cajas fuertes"), cajones: at("abri cajones"), senor: at("un senor mayor"), azul: at("la carpeta azul"), aprendi: at("y aprendi algo"),
  diez: at("tiene 10 minutos"), mochila: at("una mochila"), cosas: at("se hacen cosas"), rapido: at("rapido"), canal: at("este canal"), sus: at("suscribete"), lista: at("la lista de hoy"),
  linea: at("primera linea"), guia: at("mi guia"), vamos: at("vamos al escritorio"),
};
// ventanas del avatar del minuto 1 (las pagó el /run: no se mueven)
const AW = WIN.filter((w) => w.ms < MIN1_END).map((w) => [w.ms, w.me] as [number, number]);
const inAv = (t: number) => AW.some(([a, b]) => t >= a && t < b);
const A = (i: number) => AW[i]; // A(0)=[0,3.55] A(1)=[16.8,21.5] …

// ---------------- la cámara del mundo ----------------
const OVER: Key = { t: 0, p: [0.5, 9.0, 6.6], l: [0.5, 0.0, -1.1], fov: 50 };
const DESK: Key = { t: 0, p: [3.6, 1.45, 0.25], l: [2.85, 0.7, -1.55], fov: 36 };
const K = (t: number, k: Key, o: Partial<Key> = {}): Key => ({ ...k, t, ...o });
const KEYS: Key[] = [
  K(0, DESK),
  K(T.noBusca - 0.1, DESK),
  K(T.carpeta + 0.6, DESK, { p: [3.45, 1.5, -0.3], l: [2.97, 0.62, -1.48], fov: 34 }),
  K(T.marcador - 0.2, DESK, { p: [3.15, 1.6, -0.72], l: [2.97, 0.66, -1.48], fov: 30 }),
  K(A(1)[0], DESK, { p: [3.1, 1.5, -0.8], l: [2.97, 0.66, -1.48], fov: 30 }),
  K(A(2)[1], { t: 0, p: [-1.2, 1.35, 1.3], l: [2.0, 0.85, -1.7], fov: 40 }),
  K(A(3)[0], { t: 0, p: [1.4, 1.3, 0.9], l: [4.2, 0.85, -1.7], fov: 40 }),
  K(A(3)[1], OVER, { p: [-1.6, 4.6, 2.9], l: [-1.0, 0.3, -1.6], fov: 44 }), // 51,9: entra por el portal
  K(T.llevar, OVER, { p: [-0.5, 4.6, 2.9], l: [0.0, 0.3, -1.6], fov: 46 }),
  K(A(4)[0], OVER, { p: [3.0, 4.6, 2.9], l: [3.0, 0.3, -1.6], fov: 46 }),
  K(A(4)[1], { t: 0, p: [4.7, 1.9, 1.6], l: [3.95, 1.0, -1.6], fov: 38 }),
  K(T.caja - 0.7, { t: 0, p: [4.45, 1.7, 1.0], l: [3.95, 1.05, -1.6], fov: 36 }),
  K(T.caja + 0.25, { t: 0, p: [5.9, 1.35, 0.9], l: [6.35, 0.3, -1.8], fov: 38 }),
  K(T.cong - 0.55, { t: 0, p: [5.95, 1.4, 0.8], l: [6.35, 0.3, -1.8], fov: 37 }),
  K(T.cong + 0.4, OVER, { p: [-3.6, 4.6, 2.9], l: [-3.8, 0.3, -1.6], fov: 50, arc: 0.04 }),
  K(T.cerr - 0.1, OVER, { p: [-2.9, 4.6, 2.9], l: [-3.2, 0.3, -1.6], fov: 50 }),
  K(T.cerr + 1.1, { t: 0, p: [7.4, 3.0, 3.2], l: [9.1, 0.9, -1.8], fov: 40, arc: 0.05 }),
  K(A(5)[0], { t: 0, p: [7.6, 2.8, 2.8], l: [9.1, 0.9, -1.8], fov: 38 }),
  K(A(5)[1], DESK, { p: [2.3, 1.75, 1.0], l: [2.8, 0.75, -1.6], fov: 38 }),
  K(T.claudio - 1.0, DESK, { p: [2.5, 1.6, 0.6], l: [2.8, 0.75, -1.6], fov: 36 }),
  K(T.claudio + 0.1, OVER, { p: [-1.8, 4.6, 2.9], l: [0.2, 0.3, -1.6], fov: 44 }),
  K(A(6)[0], OVER, { p: [1.2, 4.6, 2.9], l: [1.4, 0.3, -1.6], fov: 44 }),
  K(A(6)[1], { t: 0, p: [4.3, 1.45, -0.75], l: [3.95, 1.2, -1.6], fov: 32 }),
  K(T.senor - 0.5, { t: 0, p: [4.15, 1.4, -0.95], l: [3.95, 1.2, -1.6], fov: 30 }),
  K(T.aprendi, OVER, { p: [0.0, 4.6, 2.9], l: [0.5, 0.3, -1.6], fov: 48 }),
  K(A(7)[0], OVER, { p: [1.5, 4.6, 2.9], l: [1.5, 0.3, -1.6], fov: 48 }),
  K(A(8)[1], OVER, { p: [-3.0, 4.6, 2.9], l: [-2.6, 0.3, -1.6], fov: 46 }),
  K(A(9)[0], OVER, { p: [3.4, 4.6, 2.9], l: [3.0, 0.3, -1.6], fov: 46 }),
  K(A(9)[1] - 0.1, DESK, { p: [3.6, 1.45, 0.25] }),
  K(MIN1_END, DESK, { p: [3.3, 1.3, -0.25], l: [2.9, 0.7, -1.55], fov: 34 }),
];
export const CAM = makeCam(KEYS);
const { screenOf, camSpeed } = CAM;

// ---------------- estado del mundo segundo a segundo ----------------
const on = (t: number, a: number, b = 1e9, f = 0.35) => e(t, a, a + f) * (1 - e(t, b, b + f));
const THERM: [number, number][] = [[T.llevar, A(5)[0]], [T.aprendi, A(7)[0]]];
export const thermAt = (t: number) => THERM.some(([a, b]) => t >= a && t < b);
export const stAt = (t: number): WorldState => {
  const night = t < A(3)[1] ? 0.0 : 1 - e(t, T.llevar, T.llevar + 0.5);
  const back = e(t, A(5)[1] - 0.2, A(5)[1] + 0.3) * (1 - e(t, T.aprendi, T.aprendi + 0.3)) + e(t, A(8)[1] - 0.3, A(8)[1]) * 0.7;
  return {
    lamps: Math.min(1, t < A(1)[0] ? 0.05 : t >= A(2)[1] - 0.5 && t < A(3)[1] ? 0.45 : Math.max(night, back)),
    drawer: on(t, T.noBusca + 0.25, A(5)[1] - 0.3, 0.9),
    pry: on(t, A(4)[1], A(5)[1] - 0.3, 0.6) + on(t, T.cajones + 0.3, A(7)[0], 0.6),
    wardrobe: on(t, T.caja - 0.6, A(5)[1], 0.6), lift: 0,
    freezer: on(t, T.cong, A(5)[1], 0.5), glove: on(t, T.auto, A(5)[1], 0.5), trunk: on(t, T.cerr + 0.5, A(5)[1], 1.0),
    trail: t < T.orden ? 0 : t < A(5)[0] ? e(t, T.orden, T.cerr + 0.8) : 0,
    flash: on(t, 3.0, A(1)[0] + 0.5, 0.3), flashAt: [2.97, 0.62, -1.5], flashFrom: [3.45, 1.55, -0.35],
    hot: thermAt(t) ? "#ffffff" : "#ff3a2a",
    heat: t >= A(5)[0] && t < T.aprendi ? {} : { desk: on(t, T.esc, A(5)[0], 0.3), cabinet: on(t, T.llave, A(5)[0], 0.3), box: on(t, T.caja, A(5)[0], 0.3), freezer: on(t, T.cong, A(5)[0], 0.3), glove: on(t, T.auto, A(5)[0], 0.3) },
    good: on(t, T.cerr, A(5)[0], 0.4),
  };
};

// el mundo con desenfoque de movimiento + filtro térmico (falso color por luminancia)
export const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(6, v0.bx * 0.5), by: Math.min(4, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30), th = thermAt(t);
  const filt = [v.bx + v.by > 0.6 ? `url(#${id})` : "", th ? "url(#therm)" : ""].join(" ").trim();
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter>
        <filter id="therm" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.35 0.55 0.1 0 0  0.35 0.55 0.1 0 0  0.35 0.55 0.1 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.01 0.12 0.42 0.82 1 1 1" />
            <feFuncG type="table" tableValues="0.01 0.03 0.04 0.16 0.5 0.85 1" />
            <feFuncB type="table" tableValues="0.1 0.42 0.62 0.42 0.08 0.15 0.9" />
          </feComponentTransfer>
        </filter>
      </svg>
      <AbsoluteFill style={{ filter: filt || undefined }}><WorldRaw t={t} camAt={CAM.camAt} st={stAt(t)} /></AbsoluteFill>
      {th && <ThermHud t={t} />}
    </AbsoluteFill>
  );
};

// HUD de la cámara térmica: marco, REC titilando, escala de temperatura
export const ThermHud: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ pointerEvents: "none", fontFamily: FONT }}>
    {[[40, 40, 1, 1], [1880, 40, -1, 1], [40, 1040, 1, -1], [1880, 1040, -1, -1]].map(([x, y, sx, sy], i) => (
      <div key={i} style={{ position: "absolute", left: sx > 0 ? x : x - 70, top: sy > 0 ? y : y - 70, width: 70, height: 70, borderLeft: sx > 0 ? "5px solid rgba(255,255,255,.85)" : undefined, borderRight: sx < 0 ? "5px solid rgba(255,255,255,.85)" : undefined, borderTop: sy > 0 ? "5px solid rgba(255,255,255,.85)" : undefined, borderBottom: sy < 0 ? "5px solid rgba(255,255,255,.85)" : undefined }} />
    ))}
    <div style={{ position: "absolute", left: 80, top: 66, display: "flex", alignItems: "center", gap: 16, fontWeight: 900, fontSize: 34, color: "#fff", letterSpacing: 4, textShadow: "0 2px 10px #000" }}>
      <span style={{ width: 22, height: 22, borderRadius: 11, background: "#ff2d2d", opacity: Math.sin(t * 5) > 0 ? 1 : 0.25 }} />REC · LO QUE VE EL LADRÓN</div>
    <div style={{ position: "absolute", right: 80, top: 260, width: 22, height: 520, borderRadius: 11, background: "linear-gradient(0deg,#08061a,#3a0a6b,#a3175e,#e4521b,#ffd23a,#fff)", boxShadow: "0 0 0 3px rgba(255,255,255,.6)" }} />
    <div style={{ position: "absolute", right: 116, top: 248, fontWeight: 800, fontSize: 26, color: "#fff" }}>BUSCA</div>
    <div style={{ position: "absolute", right: 116, top: 764, fontWeight: 800, fontSize: 26, color: "rgba(255,255,255,.7)" }}>IGNORA</div>
  </AbsoluteFill>
);

// el lugar del cerrajero en la térmica: queda FRÍO (lo ignora) → anillo verde dibujado encima, fuera del filtro
export const GoodRing: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = e(t, at, at + 0.3) * (1 - e(t, out, out + 0.3)), k = Math.min(1.1, spr(t, at, 0.8)), pul = 1 + 0.06 * Math.sin(t * 6);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${(0.4 + 0.6 * Math.min(1, k)) * pul})` }}>
      <div style={{ width: 230, height: 230, borderRadius: "50%", border: "10px solid #3fe08a", boxShadow: "0 0 40px rgba(63,224,138,.8), inset 0 0 40px rgba(63,224,138,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 110, color: "#bfffd9", textShadow: "0 0 20px rgba(63,224,138,.9)" }}>✓</div>
    </div>
  );
};

// toma real (LTX o cuadro clave) con empuje lento propio por plano
export const Shot: React.FC<{ k: string; t: number; a: number; z?: [number, number]; ox?: number; oy?: number; dur?: number; dim?: number; from?: number }> = ({ k, t, a, z = [1.03, 1.12], ox = 0, oy = 0, dur = 8, dim = 0, from = 0 }) => {
  const q = e(t, a, a + dur), sc = z[0] + (z[1] - z[0]) * q, id = clip(k);
  return <AbsoluteFill style={{ transform: `scale(${sc}) translate(${ox * q}px, ${oy * q}px)`, filter: dim > 0 ? `brightness(${1 - dim})` : undefined }}><Vid id={id} from={from} at={id.startsWith("ltx_") ? a : undefined} /></AbsoluteFill>;
};
export const Swipe: React.FC<{ t: number; a: number; b: number; from: React.ReactNode; to: React.ReactNode; dir?: number; vert?: boolean }> = ({ t, a, b, from, to, dir = 1, vert }) => {
  const k = ei(t, a, b), ax = vert ? "Y" : "X", D = vert ? 1080 : 1920;
  return (
    <AbsoluteFill>
      {k < 1 && <AbsoluteFill style={{ transform: `translate${ax}(${-dir * k * D}px)` }}>{from}</AbsoluteFill>}
      {k > 0 && <AbsoluteFill style={{ transform: `translate${ax}(${dir * (1 - k) * D}px)` }}>{to}</AbsoluteFill>}
    </AbsoluteFill>
  );
};
export const Stamp: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; col?: string }> = ({ t, at, text, x, y, out = 1e9, rot = -9, size = 110, col = COL.red }) => {
  const k = spr(t, at, 1.3), o = e(t, at, at + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
      <div style={{ border: `10px solid ${col}`, borderRadius: 14, padding: "6px 30px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(20,0,0,.25)", boxShadow: `0 0 30px ${col}77`, textShadow: "0 4px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

// fichas de papel que caen apiladas en perspectiva, una por cada documento que se nombra
export const DocList: React.FC<{ t: number; items: { at: number; tx: string; ic: string }[]; out: number; x?: number }> = ({ t, items, out, x = 1230 }) => (
  <div style={{ position: "absolute", left: x, top: 120, perspective: 1300 }}>
    {items.map((it, i) => {
      const k = Math.min(1.1, spr(t, it.at)), o = e(t, it.at, it.at + 0.1) * (1 - e(t, out + i * 0.04, out + i * 0.04 + 0.25));
      if (o <= 0.01) return null;
      return (
        <div key={i} style={{ opacity: o, display: "flex", alignItems: "center", gap: 22, margin: "0 0 18px", padding: "14px 30px 14px 20px", borderRadius: 16, width: 560,
          transform: `translateY(${(1 - Math.min(1, k)) * -160}px) rotateX(${(1 - Math.min(1, k)) * 60}deg) rotateY(-12deg) rotateZ(${(i % 2 ? 1 : -1) * 1.4}deg)`,
          background: "linear-gradient(180deg,#fbf7ec,#e8e1cf)", boxShadow: "0 26px 50px rgba(0,0,0,.55), inset 0 -3px 0 rgba(0,0,0,.08)", fontFamily: FONT }}>
          <div style={{ fontSize: 54, width: 70, textAlign: "center" }}>{it.ic}</div>
          <div style={{ fontWeight: 900, fontSize: 44, color: "#1d2733", letterSpacing: 1 }}>{it.tx}</div>
        </div>
      );
    })}
  </div>
);

// balanza de dolor: DINERO → 1 SEMANA (chica) / PAPELES → 1 AÑO (grande), con las tres consecuencias
const Compare: React.FC<{ t: number; out: number }> = ({ t, out }) => {
  const row = (a: number, b: number, l: string, r: string, col: string, big: number, y: number) => {
    const k = Math.min(1.1, spr(t, a, 0.9)), o = e(t, a, a + 0.12) * (1 - e(t, out, out + 0.3)), k2 = Math.min(1.1, spr(t, b, 1.1)), o2 = e(t, b, b + 0.1);
    if (o <= 0.01) return null;
    return (
      <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", alignItems: "center", gap: 46, opacity: o, fontFamily: FONT, transform: `translateX(${(1 - Math.min(1, k)) * -300}px)` }}>
        <div style={{ fontWeight: 900, fontSize: 70, color: COL.ink, letterSpacing: 3, textShadow: extrude(6, "#000") }}>{l}</div>
        <div style={{ fontWeight: 900, fontSize: 70, color: COL.dim }}>➜</div>
        <div style={{ opacity: o2, transform: `scale(${0.4 + 0.6 * Math.min(1, k2)})`, padding: "8px 40px", borderRadius: 20, background: col, fontWeight: 900, fontSize: big, color: "#fff", letterSpacing: 2, boxShadow: `0 30px 70px rgba(0,0,0,.6), 0 0 50px ${col}88`, textShadow: extrude(5, "rgba(0,0,0,.35)") }}>{r}</div>
      </div>
    );
  };
  const chip = (a: number, tx: string, i: number) => {
    const k = Math.min(1.1, spr(t, a)), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.3));
    return <div key={i} style={{ opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 80}px)`, padding: "12px 30px", borderRadius: 40, background: "rgba(10,14,22,.85)", boxShadow: `0 0 0 3px ${COL.red}aa, 0 20px 40px rgba(0,0,0,.5)`, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: COL.ink, letterSpacing: 2 }}>{tx}</div>;
  };
  return (
    <AbsoluteFill>
      {row(T.dinero, T.semana, "EL DINERO", "1 SEMANA", "#b07a1d", 76, 220)}
      {row(T.papeles, T.anio, "LOS PAPELES", "1 AÑO", COL.red, 118, 450)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, display: "flex", justifyContent: "center", gap: 30 }}>
        {chip(T.tram, "TRÁMITES", 0)}{chip(T.filas, "FILAS", 1)}{chip(T.nombre - 0.5, "TU NOMBRE EN OTRAS MANOS", 2)}
      </div>
    </AbsoluteFill>
  );
};

// la ruta del ladrón numerada (abajo), cada parada nace con SU frase; la del cerrajero en verde
const Route: React.FC<{ t: number; out: number; y: number }> = ({ t, out, y }) => {
  const items = [{ at: T.esc, tx: "ESCRITORIO" }, { at: T.llave, tx: "CAJÓN CON LLAVE" }, { at: T.caja, tx: "CAJA ANTIFUEGO" }, { at: T.cong, tx: "CONGELADOR" }, { at: T.auto, tx: "EL AUTO" }];
  const g = Math.min(1.1, spr(t, T.cerr)), go = e(t, T.cerr, T.cerr + 0.1) * (1 - e(t, out, out + 0.3));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 16, perspective: 1200, fontFamily: FONT }}>
      {items.map((it, i) => {
        const k = Math.min(1.1, spr(t, it.at)), o = e(t, it.at, it.at + 0.1) * (1 - e(t, out, out + 0.3));
        return (
          <div key={i} style={{ opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 120}px) rotateX(${(1 - Math.min(1, k)) * 70}deg)`, width: 262, padding: "12px 0 10px", borderRadius: 16, textAlign: "center",
            background: "linear-gradient(180deg, rgba(60,10,12,.95), rgba(26,6,8,.95))", boxShadow: `0 22px 44px rgba(0,0,0,.6), 0 0 0 2px ${COL.red}aa` }}>
            <div style={{ fontWeight: 900, fontSize: 58, color: "#ff8a7a", lineHeight: 1, textShadow: extrude(5, "#3a0505") }}>{i + 1}</div>
            <div style={{ fontWeight: 800, fontSize: 25, color: COL.ink, letterSpacing: 2, marginTop: 6 }}>{it.tx}</div>
          </div>
        );
      })}
      <div style={{ opacity: go, transform: `translateY(${(1 - Math.min(1, g)) * 120}px) scale(${0.8 + 0.25 * Math.min(1, g)})`, width: 300, padding: "12px 0 10px", borderRadius: 16, textAlign: "center",
        background: "linear-gradient(180deg,#1f6b45,#13452c)", boxShadow: "0 22px 44px rgba(0,0,0,.6), 0 0 30px rgba(63,224,138,.5)" }}>
        <div style={{ fontWeight: 900, fontSize: 58, color: "#bfffd9", lineHeight: 1 }}>✓</div>
        <div style={{ fontWeight: 800, fontSize: 25, color: "#fff", letterSpacing: 2, marginTop: 6 }}>EL DEL CERRAJERO</div>
      </div>
    </div>
  );
};

// el kit de una tarde: tres objetos que entran girando
const Kit: React.FC<{ t: number; out: number }> = ({ t, out }) => {
  const items = [{ at: T.kCarp, ic: "📁", tx: "UNA CARPETA" }, { at: T.bolsas, ic: "🛍️", tx: "BOLSAS CON CIERRE" }, { at: T.cel, ic: "📱", tx: "TU CELULAR" }];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 40, perspective: 1300, fontFamily: FONT }}>
      {items.map((it, i) => {
        const k = Math.min(1.1, spr(t, it.at, 0.9)), o = e(t, it.at, it.at + 0.12) * (1 - e(t, out, out + 0.3));
        return (
          <div key={i} style={{ opacity: o, transform: `rotateY(${(1 - Math.min(1, k)) * 90 + (i - 1) * 8}deg) translateY(${Math.sin(t * 1.6 + i) * 6}px)`, width: 400, padding: "26px 0 22px", borderRadius: 24, textAlign: "center",
            background: "linear-gradient(180deg, rgba(250,248,242,.97), rgba(226,222,212,.97))", boxShadow: "0 36px 70px rgba(0,0,0,.6)" }}>
            <div style={{ fontSize: 110, lineHeight: 1.1 }}>{it.ic}</div>
            <div style={{ fontWeight: 900, fontSize: 38, color: "#1d2733", letterSpacing: 2, marginTop: 8 }}>{it.tx}</div>
          </div>
        );
      })}
    </div>
  );
};

// cronómetro: la aguja da la vuelta y se clava en <n> MIN
export const Stopwatch: React.FC<{ t: number; at: number; out: number; x: number; y: number; n: number; label?: string }> = ({ t, at, out, x, y, n, label }) => {
  const k = Math.min(1.1, spr(t, at, 0.9)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sweep = ei(t, at + 0.1, at + 1.4), ang = sweep * (360 + 60) - 90;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * Math.min(1, k)})` }}>
      <div style={{ transform: `rotateY(${-18 + 6 * Math.sin(t)}deg) rotateX(8deg)`, display: "flex", alignItems: "center", gap: 34 }}>
        <svg width={300} height={340} viewBox="0 0 300 340" style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
          <rect x={128} y={0} width={44} height={34} rx={8} fill="#c9ced3" />
          <circle cx={150} cy={190} r={140} fill="#d9dde1" /><circle cx={150} cy={190} r={124} fill="#fbfbf8" />
          {Array.from({ length: 12 }, (_, i) => <line key={i} x1={150 + 108 * Math.sin(i * 0.5236)} y1={190 - 108 * Math.cos(i * 0.5236)} x2={150 + 120 * Math.sin(i * 0.5236)} y2={190 - 120 * Math.cos(i * 0.5236)} stroke="#33404d" strokeWidth={i % 3 ? 3 : 7} />)}
          <line x1={150} y1={190} x2={150 + 100 * Math.cos((ang * Math.PI) / 180)} y2={190 + 100 * Math.sin((ang * Math.PI) / 180)} stroke={COL.red} strokeWidth={8} strokeLinecap="round" />
          <circle cx={150} cy={190} r={12} fill="#222" />
        </svg>
        <div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 130, color: COL.ink, textShadow: extrude(10, "#3a2a14"), lineHeight: 1 }}>{Math.round(sweep * n)} MIN</div>
          {label && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: COL.amber, letterSpacing: 3, marginTop: 10, textShadow: "0 3px 12px #000" }}>{label}</div>}
        </div>
      </div>
    </div>
  );
};

// botón de suscribirse + campanita (lo aprieta un cursor)
export const Subscribe: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = Math.min(1.1, spr(t, at - 0.3, 0.9)), o = e(t, at - 0.3, at - 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const click = e(t, at + 0.35, at + 0.5), done = t > at + 0.5, ring = t > at + 1.0 ? Math.sin((t - at) * 22) * 18 * (1 - e(t, at + 1.0, at + 2.2)) : 0;
  const cx = 1180 - 200 * e(t, at - 0.2, at + 0.35), cy = 700 - 120 * e(t, at - 0.2, at + 0.35);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) scale(${(0.6 + 0.4 * Math.min(1, k)) * (1 - 0.06 * click * (done ? 0 : 1))})`, display: "flex", gap: 26, alignItems: "center", fontFamily: FONT }}>
        <div style={{ padding: "26px 60px", borderRadius: 60, background: done ? "#3a3a3a" : "#e62117", color: "#fff", fontWeight: 900, fontSize: 64, letterSpacing: 3, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>{done ? "SUSCRITO ✓" : "SUSCRIBIRSE"}</div>
        <div style={{ width: 120, height: 120, borderRadius: 60, background: "rgba(250,248,242,.96)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70, transform: `rotate(${ring}deg)`, boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>🔔</div>
      </div>
      <div style={{ position: "absolute", left: cx, top: cy, fontSize: 80, transform: `scale(${1 - 0.15 * click})`, filter: "drop-shadow(0 6px 10px rgba(0,0,0,.6))" }}>👆</div>
    </AbsoluteFill>
  );
};

// la descripción del video: el renglón 1 se ilumina (en pantalla NUNCA la URL: sólo el nombre y "1ª línea")
export const Desc: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const hl = e(t, at + 0.4, at + 0.9), sweep = e(t, at + 0.4, at + 1.4);
  const L = (w: number, op = 0.25) => <div style={{ height: 16, width: w, borderRadius: 8, background: `rgba(255,255,255,${op})`, margin: "18px 0 0" }} />;
  return (
    <div style={{ position: "absolute", left: 760, top: 560, perspective: 1500, opacity: o }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -500}px) rotateX(${14 - 8 * Math.min(1, k)}deg) rotateY(${8 + 3 * Math.sin(t * 0.8)}deg)`, width: 1060, padding: "34px 44px 40px", borderRadius: 26,
        background: "linear-gradient(180deg, rgba(28,30,34,.96), rgba(16,17,20,.96))", boxShadow: "0 70px 120px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.12)", fontFamily: FONT }}>
        <div style={{ color: "rgba(255,255,255,.55)", fontWeight: 800, fontSize: 24, letterSpacing: 4 }}>DESCRIPCIÓN</div>
        <div style={{ position: "relative", marginTop: 16, padding: "16px 20px", borderRadius: 14, background: `rgba(255,214,10,${0.18 * hl})`, boxShadow: hl > 0.05 ? `0 0 0 3px rgba(255,214,10,${0.9 * hl}), 0 0 40px rgba(255,214,10,${0.35 * hl})` : undefined, overflow: "hidden" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 38, lineHeight: 1.3 }}>🔑 La lista de hoy + El Método del Cerrajero</div>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-30 + 130 * sweep}%`, width: "25%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)", opacity: sweep < 1 ? 1 : 0 }} />
        </div>
        {L(880)}{L(940)}{L(660)}{L(800, 0.15)}
      </div>
      <div style={{ position: "absolute", left: -500, top: -300, opacity: hl, transform: `translateX(${-30 * (1 - hl) + 10 * Math.sin(t * 6)}px)`, fontFamily: FONT, fontWeight: 900, fontSize: 54, color: "#ffd60a", textShadow: extrude(6, "#5a4500"), whiteSpace: "nowrap" }}>1ª LÍNEA DE LA DESCRIPCIÓN ⬇</div>
    </div>
  );
};

// la portada pastel del libro 4 (la guía real) que entra girando al lado de la descripción
const Cover: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const k = Math.min(1.1, spr(t, at, 0.8)), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, perspective: 1600, opacity: o }}>
      <div style={{ transform: `translate(-50%,-50%) rotateY(${(1 - Math.min(1, k)) * 120 - 18 + 4 * Math.sin(t * 0.9)}deg) rotateX(4deg)`, width: 430, height: 600, borderRadius: 8, overflow: "hidden", boxShadow: "-18px 0 0 #c9c2b2, 0 60px 110px rgba(0,0,0,.7)" }}>
        <Img src={staticFile(P + "guia_l4.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", left: -230, top: 330, width: 460, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 34, color: COL.ink, letterSpacing: 2, opacity: e(t, at + 0.5, at + 0.8), textShadow: "0 3px 12px #000" }}>EL MÉTODO DEL CERRAJERO</div>
    </div>
  );
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const shot1 = <Shot k="g_cajon" t={t} a={A(0)[1] - 0.3} z={[1.0, 1.06]} dur={6} from={3} />;
  const shot2 = <Shot k="g_carpeta" t={t} a={A(1)[1] - 0.3} z={[1.0, 1.06]} dur={7} from={6} />;
  const shot3 = <Shot k="g_mochila" t={t} a={A(7)[1] - 0.3} z={[1.06, 1.0]} dur={9} from={4} />;

  // ===== A · 0-3,55 · avatar "estás en la fila del banco" → portal a la toma del ladrón =====
  if (t < A(0)[1] + 0.05) {
    L.push(<Avatar key="avA" t={t} />);
    const r = ei(t, A(0)[1] - 0.35, A(0)[1]);
    if (r > 0) L.push(<Portal key="pA" x={1300} y={560} r={r}>{shot1}</Portal>);
  }
  // ===== B · 3,55-9,4 · el guante abre el primer cajón =====
  if (t >= A(0)[1] && t < T.noBusca + 0.35) {
    const k = ei(t, T.noBusca - 0.05, T.noBusca + 0.35);
    L.push(<Swipe key="swB" t={t} a={T.noBusca - 0.05} b={T.noBusca + 0.35} vert from={shot1} to={<World t={t} />} />);
    void k;
    L.push(<Tag key="pc" t={t} at={T.cajon + 0.2} x={980} y={640} dx={-300} dy={-200} text="EL PRIMER CAJÓN" col={COL.amber} out={T.noBusca - 0.1} size={54} />);
  }
  // ===== C · 9,4-16,8 · el cajón 3D se abre: no busca dinero, busca LA CARPETA que dice IMPORTANTE =====
  if (t >= T.noBusca + 0.35 && t < A(1)[0] + 0.05) {
    L.push(<World key="wC" t={t} />);
    const nm = e(t, T.noBusca, T.noBusca + 0.15) * (1 - e(t, T.carpeta + 0.9, T.carpeta + 1.1)), sx = e(t, T.carpeta - 0.3, T.carpeta - 0.05);
    if (nm > 0.01) L.push(<div key="nd" style={{ position: "absolute", left: 960, top: 190, transform: "translate(-50%,-50%)", opacity: nm, fontFamily: FONT, fontWeight: 900, fontSize: 92, color: COL.ink, letterSpacing: 4, textShadow: extrude(8, "#000") }}>
      NO BUSCA DINERO<div style={{ position: "absolute", left: -20, right: -20, top: "52%", height: 14, background: COL.red, transformOrigin: "0 50%", transform: `scaleX(${sx}) rotate(-3deg)`, borderRadius: 7, boxShadow: "0 0 18px rgba(255,60,40,.8)" }} /></div>);
    const fo = screenOf(t, PT.folder);
    L.push(<Tag key="cp" t={t} at={T.carpeta + 0.2} x={fo.x} y={fo.y} text="BUSCA UNA CARPETA" col={COL.amber} out={T.marcador - 0.3} size={56} dx={260} dy={-230} />);
    L.push(<Stopwatch key="sw1" t={t} at={T.minuto} out={T.marcador - 0.3} x={470} y={250} n={1} label="MENOS DE UN MINUTO" />);
    L.push(<Tag key="mk" t={t} at={T.marcador} x={fo.x} y={fo.y} dx={240} dy={230} text="TÚ LE ESCRIBISTE ENCIMA" col={COL.ink} out={A(1)[0] - 0.1} size={46} />);
    const r = ei(t, A(1)[0] - 0.35, A(1)[0]);
    if (r > 0) L.push(<Portal key="pC" x={fo.x} y={fo.y} r={r}><Avatar t={t} /></Portal>);
  }
  // ===== D · 16,8-21,5 · avatar + sello IMPORTANTE + la lista de papeles =====
  if (t >= A(1)[0] && t < A(1)[1] + 0.4) {
    L.push(<Swipe key="swD" t={t} a={A(1)[1]} b={A(1)[1] + 0.38} from={<Avatar t={t} />} to={shot2} />);
    L.push(<Stamp key="imp" t={t} at={T.importante} text="IMPORTANTE" x={560} y={250} out={T.escr + 0.3} rot={-10} size={96} col={COL.red} />);
  }
  // ===== E · 21,5-28,3 · el guante saca la carpeta del cajón (sigue la lista) =====
  if (t >= A(1)[1] + 0.38 && t < T.cerrajero + 0.4) {
    L.push(<Swipe key="swE" t={t} a={T.cerrajero} b={T.cerrajero + 0.38} dir={-1} from={shot2} to={<Shot k="k_puerta" t={t} a={T.cerrajero} z={[1.1, 1.02]} ox={-30} dur={5} />} />);
  }
  if (t >= T.escr - 0.1 && t < T.cerrajero + 0.6) L.push(<DocList key="dl" t={t} out={T.cerrajero - 0.2} items={[
    { at: T.escr, tx: "ESCRITURA DE LA CASA", ic: "🏠" }, { at: T.pasap, tx: "PASAPORTE", ic: "🛂" }, { at: T.partida, tx: "PARTIDA DE NACIMIENTO", ic: "📜" },
    { at: T.test, tx: "TESTAMENTO", ic: "✒️" }, { at: T.auto0, tx: "PAPELES DEL AUTO", ic: "🚗" }, { at: T.libreta, tx: "LIBRETA DEL BANCO", ic: "🏦" }]} />);
  // ===== F · 28,3-33,3 · Claudio cambiando la cerradura de una puerta forzada =====
  if (t >= T.cerrajero + 0.38 && t < A(2)[0] + 0.05) {
    L.push(<Shot key="kF" k="k_puerta" t={t} a={T.cerrajero} z={[1.1, 1.02]} ox={-30} dur={5} />);
    L.push(<Tag key="md" t={t} at={T.manana} x={760} y={430} dx={300} dy={-210} text="LA MAÑANA DESPUÉS DEL ROBO" col={COL.amber} out={A(2)[0] - 0.2} size={44} />);
    const r = ei(t, A(2)[0] - 0.35, A(2)[0]);
    if (r > 0) L.push(<Portal key="pF" x={960} y={480} r={r}><Avatar t={t} /></Portal>);
  }
  if (t >= T.cerrajero && t < A(2)[0] + 0.3) L.push(<LowerThird key="lt1" t={t} at={T.cerrajero + 0.3} out={A(2)[0] - 0.4} name="CLAUDIO" l2="CERRAJERO · 30 AÑOS" l2at={T.cerrajero + 1.1} />);
  // ===== G · 33,3-38,05 · avatar "te digo una cosa que casi nadie sabe" =====
  if (t >= A(2)[0] && t < A(2)[1] + 0.4) L.push(<Swipe key="swG" t={t} a={A(2)[1]} b={A(2)[1] + 0.38} vert from={<Avatar t={t} />} to={<AbsoluteFill style={{ filter: "brightness(.55)" }}><World t={t} /></AbsoluteFill>} />);
  // ===== H · 38-47,1 · DINERO 1 SEMANA / PAPELES 1 AÑO sobre la casa a oscuras (la cámara cruza la maqueta) =====
  if (t >= A(2)[1] + 0.38 && t < A(3)[0] + 0.05) {
    L.push(<AbsoluteFill key="hH" style={{ filter: "brightness(.55)" }}><World t={t} /></AbsoluteFill>);
    L.push(<Compare key="cmp" t={t} out={A(3)[0] - 0.3} />);
    const r = ei(t, A(3)[0] - 0.35, A(3)[0]);
    if (r > 0) L.push(<Portal key="pH" x={960} y={540} r={r}><Avatar t={t} /></Portal>);
  }
  // ===== I · 47,1-52 · avatar "los 5 lugares donde el ladrón revisa primero" =====
  if (t >= A(3)[0] && t < A(3)[1] + 0.05) {
    L.push(<Avatar key="avI" t={t} />);
    L.push(<BigNum key="5l" t={t} at={T.cinco} text="5 LUGARES" size={100} x={1590} y={190} out={A(3)[1] - 0.4} col="#ff8a7a" edge="#4a0c08" />);
    const r = ei(t, A(3)[1] - 0.35, A(3)[1]);
    if (r > 0) L.push(<Portal key="pI" x={960} y={540} r={r}><World t={t} /></Portal>);
  }
  // ===== J · 52-63,5 · la MAQUETA: se apaga la casa, VISTA TÉRMICA, su recorrido se dibuja =====
  if (t >= A(3)[1] && t < A(4)[0] + 0.05) {
    L.push(<World key="wJ" t={t} />);
    L.push(<Flash key="flJ" t={t} at={T.llevar} col="#ffffff" peak={0.7} w={0.35} />);
    L.push(<div key="yo" style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 70, color: "#bfffd9", letterSpacing: 3, opacity: on(t, T.dondeYo, T.llevar - 0.2, 0.2), textShadow: extrude(6, "#0b2a1a") }}>¿Y DÓNDE LOS GUARDO YO?</div>);
    L.push(<div key="or" style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 52, color: "#fff", letterSpacing: 3, opacity: on(t, T.orden, A(4)[0] - 0.4, 0.3), textShadow: extrude(5, "#000") }}>EN EL ORDEN EN QUE ÉL LA RECORRE</div>);
    const r = ei(t, A(4)[0] - 0.35, A(4)[0]);
    if (r > 0) L.push(<Portal key="pJ" x={960} y={540} r={r}><Avatar t={t} /></Portal>);
  }
  // ===== K · 63,5-67,6 · avatar "primero el escritorio" =====
  if (t >= A(4)[0] && t < A(4)[1] + 0.4) L.push(<Swipe key="swK" t={t} a={A(4)[1]} b={A(4)[1] + 0.38} from={<Avatar t={t} />} to={<World t={t} />} />);
  // ===== L · 67,6-78,9 · la ruta: cada escondite se enciende; el placard del cerrajero en VERDE =====
  if (t >= A(4)[1] + 0.38 && t < A(5)[0] + 0.05) {
    L.push(<World key="wL" t={t} />);
    const cb = screenOf(t, PT.cabinet), bx = screenOf(t, PT.box), mn = screenOf(t, PT.manuals);
    L.push(<Tag key="ll" t={t} at={A(4)[1] + 0.5} x={cb.x} y={cb.y} dx={-320} dy={-180} text="“ES SEGURO”" sub="SE ABRE CON UN DESTORNILLADOR" col="#fff" out={T.caja - 0.6} size={50} />);
    L.push(<Tag key="cx" t={t} at={T.caja + 0.35} x={bx.x} y={bx.y} dx={-320} dy={-220} text="SE LA LLEVA ENTERA" col="#fff" out={T.cong + 0.1} size={46} />);
    L.push(<GoodRing key="gr" t={t} at={T.cerr} out={A(5)[0]} x={mn.x} y={mn.y} />);
    L.push(<Tag key="cr" t={t} at={T.cerr + 1.1} x={mn.x} y={mn.y} dx={-380} dy={120} text="AHÍ NO MIRA" col="#7dffb4" out={A(5)[0] - 0.2} size={54} />);
    const r = ei(t, A(5)[0] - 0.35, A(5)[0]);
    if (r > 0) L.push(<Portal key="pL" x={960} y={540} r={r}><Avatar t={t} /></Portal>);
  }
  if (t >= T.esc && t < A(5)[0] + 0.4) L.push(<Route key="rt" t={t} out={A(5)[0] - 0.1} y={880} />);
  // ===== M · 78,9-84,6 · avatar "la regla de las 3 copias" =====
  if (t >= A(5)[0] && t < A(5)[1] + 0.05) {
    L.push(<Avatar key="avM" t={t} />);
    L.push(<BigNum key="3c" t={t} at={T.tres} text="3 COPIAS" sub="LA QUE TE SALVA" size={100} x={1590} y={200} out={A(5)[1] - 0.4} col="#bfffd9" edge="#0b3a22" />);
    const r = ei(t, A(5)[1] - 0.35, A(5)[1]);
    if (r > 0) L.push(<Portal key="pM" x={960} y={540} r={r}><World t={t} /></Portal>);
  }
  // ===== N · 84,6-96,1 · en una tarde: carpeta, bolsas con cierre, celular → la puerta (Claudio) =====
  if (t >= A(5)[1] && t < A(6)[0] + 0.05) {
    L.push(<World key="wN" t={t} />);
    L.push(<BigNum key="ut" t={t} at={T.tarde} text="UNA TARDE" size={110} y={250} out={T.claudio - 0.7} col="#ffd60a" edge="#5a4500" />);
    L.push(<Kit key="kit" t={t} out={T.claudio - 0.7} />);
    const r = ei(t, A(6)[0] - 0.35, A(6)[0]);
    if (r > 0) L.push(<Portal key="pN" x={960} y={540} r={r}><Avatar t={t} /></Portal>);
  }
  if (t >= T.claudio - 0.2 && t < A(6)[0] + 0.3) L.push(<LowerThird key="lt2" t={t} at={T.claudio} out={A(6)[0] - 0.4} name="CLAUDIO" l2="30 AÑOS · CERRAJERÍA DE BARRIO" l2at={T.claudio + 0.9} />);
  // ===== O · 96,1-100,8 · avatar "abrí cajas fuertes…" =====
  if (t >= A(6)[0] && t < A(6)[1] + 0.4) L.push(<Swipe key="swO" t={t} a={A(6)[1]} b={A(6)[1] + 0.38} vert from={<Avatar t={t} />} to={<World t={t} />} />);
  // ===== P · 100,8-109 · el cajón con la llavecita → el señor que ve el cajón vacío =====
  if (t >= A(6)[1] + 0.38 && t < T.aprendi + 0.4) {
    const sn = <Shot k="k_senor" t={t} a={T.senor - 0.5} z={[1.03, 1.12]} dur={6} />;
    L.push(<Swipe key="swP" t={t} a={T.senor - 0.5} b={T.senor - 0.12} from={<World t={t} />} to={
      <Swipe t={t} a={T.aprendi} b={T.aprendi + 0.38} vert from={sn} to={<World t={t} />} />} />);
    const cb = screenOf(t, [3.95, 1.27, -1.62]);
    if (t < T.senor - 0.2) L.push(<Tag key="lv" t={t} at={T.cajones + 0.4} x={cb.x} y={cb.y} dx={-300} dy={-160} text="LA LLAVECITA PERDIDA" col={COL.amber} out={T.senor - 0.7} size={46} />);
    L.push(<Tag key="az" t={t} at={T.azul} x={1100} y={720} dx={260} dy={-120} text="YA NO ESTÁ" col="#8fd6ff" out={T.aprendi - 0.2} size={52} />);
  }
  // ===== Q · 109-113 · térmica: tiene 10 minutos =====
  if (t >= T.aprendi + 0.38 && t < A(7)[0] + 0.05) {
    L.push(<World key="wQ" t={t} />);
    L.push(<Stopwatch key="sw10" t={t} at={T.diez} out={A(7)[0] - 0.3} x={960} y={540} n={10} label="Y SE VA" />);
    const r = ei(t, A(7)[0] - 0.35, A(7)[0]);
    if (r > 0) L.push(<Portal key="pQ" x={960} y={540} r={r}><Avatar t={t} /></Portal>);
  }
  // ===== R · 113-118 · avatar "lo que entra en una mochila" =====
  if (t >= A(7)[0] && t < A(7)[1] + 0.4) L.push(<Swipe key="swR" t={t} a={A(7)[1]} b={A(7)[1] + 0.38} from={<Avatar t={t} />} to={shot3} />);
  // ===== S · 118-126,9 · la carpeta entra en la mochila: con tus papeles se hacen cosas =====
  if (t >= A(7)[1] + 0.38 && t < A(8)[0] + 0.05) {
    L.push(shot3);
    L.push(<Tag key="cs" t={t} at={T.cosas} x={960} y={600} dx={-320} dy={-240} text="CON TU NOMBRE" sub="SE HACEN COSAS" col={COL.red} out={T.rapido - 0.2} size={54} />);
    const r = ei(t, A(8)[0] - 0.35, A(8)[0]);
    if (r > 0) L.push(<Portal key="pS" x={960} y={540} r={r}><Avatar t={t} /></Portal>);
  }
  // ===== T · 126,9-133 · avatar "este canal…" =====
  if (t >= A(8)[0] && t < A(8)[1] + 0.05) {
    L.push(<Avatar key="avT" t={t} />);
    const r = ei(t, A(8)[1] - 0.35, A(8)[1]);
    if (r > 0) L.push(<Portal key="pT" x={960} y={540} r={r}><World t={t} /></Portal>);
  }
  // ===== U · 133-146,3 · CTA1: suscribirse + la 1ª línea de la descripción + la guía =====
  if (t >= A(8)[1] && t < A(9)[0] + 0.05) {
    L.push(<AbsoluteFill key="wU" style={{ filter: `brightness(${1 - 0.45 * e(t, T.sus - 0.5, T.sus)})` }}><World t={t} /></AbsoluteFill>);
    L.push(<Subscribe key="sub" t={t} at={T.sus} out={T.lista - 0.3} />);
    L.push(<Desc key="desc" t={t} at={T.linea - 1.2} out={A(9)[0] - 0.3} />);
    L.push(<Cover key="cov" t={t} at={T.lista} out={A(9)[0] - 0.3} x={1520} y={520} />);
    const r = ei(t, A(9)[0] - 0.35, A(9)[0]);
    if (r > 0) L.push(<Portal key="pU" x={960} y={540} r={r}><Avatar t={t} /></Portal>);
  }
  // ===== V · 146,3-151,2 · avatar "vamos al escritorio" → portal al escritorio =====
  if (t >= A(9)[0]) {
    L.push(<Avatar key="avV" t={t} />);
    const r = ei(t, A(9)[1] - 0.4, A(9)[1]);
    if (r > 0) L.push(<Portal key="pV" x={1300} y={600} r={r}><World t={t} /></Portal>);
  }
  void inAv;
  return <AbsoluteFill style={{ background: "#05070d" }}>{L}</AbsoluteFill>;
};
