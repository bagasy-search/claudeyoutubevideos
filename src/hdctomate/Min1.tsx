// hdctomate · MINUTO 1 + CTA1 (0-133,9 s). Un solo hilo, sin cortes secos, todo clavado a la voz con at():
// avatar "sales al patio con el café" → portal a la toma del vecino (el dedo va a las flores) → el patio 3D: la planta alta,
// verde, con florcitas → la toma: la toca y las flores caen → avatar (SECAS) → la tierra con las 5 flores tiradas → arriba de
// todo los 4 tomates, uno con la punta negra → avatar (NO ES TU MANO) → Claudio en su patio (rótulo) → la balanza: demasiado
// de lo que no necesita / nada de lo que sí → el banco con el frasco, la taza y el molcajete (sale de la cocina, $0) → avatar
// (7 PASOS) → los racimos se llenan de abajo hasta la punta → las 7 fichas del recorrido → avatar → el patio de Claudio
// (limoneros, chiles, fresas) → avatar → las latas de la azotea, la cocina de la mamá → CTA: las 5 tapas en abanico, la
// PÁGINA 70 real del libro de abono, la 1ª línea de la descripción → avatar "vamos a la planta" → portal a las flores.
// Audio fuera de Remotion (voz + sonido real de los clips se mezclan en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, PT, BASE, makeCam, type Key, type WorldState } from "./huerto3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import WORDS from "./words.json";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { BigNum, COL, FONT, LowerThird, P, Portal, Tag, Vid, e, ei, extrude, s, spr } from "./lib";

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

export const MIN1_END = 133.9;
export const MIN1_FRAMES = s(MIN1_END);
const AV = AVAIL as { reel: boolean; reelLen?: number; ltx: string[] };
const LTX = new Set(AV.ltx); // clips LTX ya bajados (public/hdctomate/ltx_<k>.mp4); si no, el cuadro clave img_<k>.jpg
export const clip = (k: string) => (LTX.has(k) ? "ltx_" + k : "img_" + k);
const REEL_LEN = AV.reelLen ?? 275.4; // si la última ventana pide más que el reel → se congela el último cuadro (nunca negro)
export const WIN: { ms: number; me: number; off: number }[] = (AVW as { win: { ms: number; me: number; off: number }[] }).win;

export const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const cur = WIN.findIndex((w) => t >= w.ms - 0.02 && t < w.me);
  const vis = cur >= 0 ? cur : WIN.findIndex((w) => t >= w.ms - 0.32 && t < w.me + 0.8);
  const face = AV.reel ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={Math.max(0, s(w.ms) - 10)} durationInFrames={s(w.me - w.ms) + 12 + 14} layout="none">
      <AbsoluteFill style={{ opacity: i === vis ? 1 : 0 }}><Freeze frame={s(REEL_LEN) - Math.max(0, s(w.off) - 10)} active={(f) => f > s(REEL_LEN) - Math.max(0, s(w.off) - 10)}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}><CamaraMano seed={1}>{face}</CamaraMano></AbsoluteFill>;
};

// ---------------- tiempos (todos salen de la voz) ----------------
export const T = {
  planta: at("tu planta de tomate"), preciosa: at("esta preciosa"), flores: at("florcitas amarillas"), tocas: at("la tocas apenas"), tres: at("tres flores"), secas: at("secas"),
  cinco: at("otras cinco"), temporada: at("al final de la temporada"), cuatro: at("cuatro tomates"), arriba: at("alla arriba"), punta: at("con la punta negra"), pensaste: at("y pensaste"),
  noMano: at("no es tu mano"), trabajo: at("yo trabajo la tierra"), demasiado: at("le diste demasiado"), nada: at("y nada de lo que"), hoy: at("hoy te doy"), cocina: at("sale de la cocina"),
  siete: at("los siete pasos"), racimo: at("el primer racimo"), punta2: at("hasta la punta"), orden: at("te lo voy a dar en orden"), primero: at("primero porque"), cincoMin: at("en cinco minutos"),
  echo: at("lo que de verdad le echo"), taza: at("la taza y el balde"), balde: at("y el balde"), polvo: at("el polvo blanco"), error: at("y el error"), follaje: at("puro follaje"),
  maceta: at("y al final la maceta"), riego: at("el riego y"), atar: at("y como atar"), basura: at("a la basura"), claudio: at("soy claudio"), patio: at("un patio chico"),
  limon: at("limoneros"), chiles: at("chiles"), fresas: at("fresas"), papa: at("mi papa sembraba"), latas: at("en latas de aceite"), azotea: at("azotea"), mama: at("la cocina de mi mama"),
  rapido: at("rapido mientras"), escribi: at("lo escribi"), libros: at("son cinco libros"), ficha: at("una ficha para cada"), pag: at("la del tomate es la pagina"), link: at("el link esta"),
  pasos: at("y los siete pasos de hoy"), vamos: at("vamos a la planta"),
};
// ventanas del avatar del minuto 1 (las pagó el /run: no se mueven)
const AW = WIN.filter((w) => w.ms < MIN1_END).map((w) => [w.ms, w.me] as [number, number]);
const A = (i: number) => AW[i]; // A(0)=[0,3.2] A(1)=[15.1,19.2] …

// ---------------- la cámara del mundo ----------------
type Pose = Omit<Key, "t">;
export const POSE: Record<string, Pose> = {
  wide: { p: [0.0, 1.9, 4.6], l: [0.3, 1.2, -0.6], fov: 45 },
  plant: { p: [0.25, 1.65, 2.5], l: [0.0, 1.55, 0.0], fov: 42 },
  flowers: { p: [0.5, 2.05, 1.05], l: [0.05, 1.9, 0.05], fov: 36 },
  soilTop: { p: [0.55, 1.45, 1.05], l: [0.0, 0.72, -0.05], fov: 38 },
  topTruss: { p: [-0.25, 2.5, 0.95], l: [-0.05, 2.3, 0.1], fov: 34 },
  rot: { p: [-0.2, 2.32, 0.55], l: [-0.06, 2.24, 0.12], fov: 30 },
  botTruss: { p: [0.95, 1.25, 1.75], l: [0.08, 1.0, 0.08], fov: 32 },
  bench: { p: [1.6, 1.35, 0.6], l: [1.8, 0.85, -1.3], fov: 36 },
  molca: { p: [2.05, 1.25, -0.7], l: [2.15, 0.88, -1.35], fov: 30 },
  section: { p: [0.0, 0.55, 1.45], l: [0.0, 0.42, 0.0], fov: 36 },
  patioL: { p: [-1.6, 1.4, 1.6], l: [-2.3, 0.6, -1.4], fov: 44 },
  patioR: { p: [2.0, 1.6, 1.6], l: [2.6, 1.0, -1.8], fov: 44 },
};
const K = (t: number, q: Pose, o: Partial<Key> = {}): Key => ({ ...q, t, ...o });
const KEYS: Key[] = [
  K(0, POSE.plant),
  K(T.preciosa - 0.2, POSE.plant, { p: [0.3, 1.5, 2.9] }),
  K(T.flores, POSE.flowers, { arc: 0.03 }),
  K(T.tocas, POSE.flowers, { p: [0.4, 2.0, 0.85], fov: 33 }),
  K(A(1)[1], POSE.soilTop),
  K(T.temporada - 0.2, POSE.soilTop, { p: [0.5, 1.38, 0.95] }),
  K(T.cuatro + 0.2, POSE.topTruss, { arc: 0.02 }),
  K(T.punta - 0.1, POSE.topTruss, { p: [-0.22, 2.45, 0.8] }),
  K(T.punta + 0.6, POSE.rot),
  K(T.pensaste + 0.4, POSE.rot, { fov: 28 }),
  K(T.demasiado - 0.05, POSE.plant, { p: [0.4, 1.7, 3.2], fov: 44 }),
  K(T.hoy - 0.1, POSE.plant, { p: [0.1, 1.6, 2.7], fov: 42 }),
  K(T.hoy + 1.1, POSE.bench, { arc: 0.04 }),
  K(A(3)[0], POSE.bench, { p: [1.65, 1.25, 0.2], fov: 32 }),
  K(A(3)[1], POSE.botTruss),
  K(T.racimo + 0.3, POSE.botTruss, { p: [0.85, 1.18, 1.6] }),
  K(T.punta2 + 0.4, POSE.topTruss, { arc: 0.02 }),
  K(T.orden + 0.2, POSE.topTruss),
  K(T.orden + 2.0, POSE.wide),
  K(A(4)[0], POSE.wide, { p: [0.2, 1.8, 4.1] }),
  K(A(4)[1], POSE.bench, { p: [1.5, 1.3, 0.3], l: [1.6, 0.6, -0.9], fov: 40 }),
  K(T.polvo - 0.1, POSE.bench, { p: [1.6, 1.3, 0.2], l: [1.7, 0.7, -1.0], fov: 38 }),
  K(T.polvo + 0.9, POSE.molca),
  K(T.error - 0.1, POSE.molca, { p: [2.0, 1.2, -0.6] }),
  K(T.error + 1.0, POSE.plant, { p: [0.4, 1.7, 3.1], fov: 44, arc: 0.03 }),
  K(T.maceta - 0.1, POSE.plant, { p: [0.2, 1.6, 2.8] }),
  K(T.maceta + 1.0, POSE.wide),
  K(A(5)[0], POSE.wide, { p: [0.1, 1.85, 4.2] }),
  K(A(5)[1], POSE.wide, { p: [0.0, 2.2, 5.2], fov: 48 }),
  K(T.limon - 0.3, POSE.patioR, { arc: 0.03 }),
  K(T.chiles - 0.1, POSE.patioR, { p: [2.1, 1.5, 1.3] }),
  K(T.chiles + 0.9, POSE.patioL, { arc: 0.04 }),
  K(T.fresas + 0.6, POSE.patioL, { p: [-1.5, 1.3, 1.2], l: [-1.9, 0.7, -1.8] }),
  K(A(6)[0], POSE.plant),
  K(A(6)[1], POSE.wide, { p: [0.0, 2.2, 5.0], fov: 46 }),
  K(A(7)[0], POSE.wide, { p: [0.4, 2.0, 4.4], fov: 44 }),
  K(A(7)[1], POSE.wide, { p: [-0.3, 2.0, 4.4], fov: 44 }),
  K(A(8)[0], POSE.plant, { p: [0.2, 1.8, 3.4] }),
  K(A(8)[1], POSE.flowers, { p: [0.6, 2.1, 1.3], fov: 38 }),
  K(MIN1_END, POSE.flowers),
];
export const CAM = makeCam(KEYS);
const { screenOf, camSpeed } = CAM;

// ---------------- estado del mundo segundo a segundo ----------------
const on = (t: number, a: number, b = 1e9, f = 0.35) => e(t, a, a + f) * (1 - e(t, b, b + f));
export const stAt = (t: number): WorldState => {
  const grow = (i: number) => e(t, T.racimo - 0.6 + i * 0.9, T.racimo + 0.6 + i * 0.9);
  const timelapse = t >= A(3)[1] - 0.5 && t < A(4)[1];
  const top4 = t >= T.temporada && t < A(2)[1] + 0.5 || t >= T.demasiado && t < T.hoy + 1;
  const bushy = on(t, T.demasiado - 0.3, T.hoy + 0.8, 0.8) + on(t, T.error + 0.6, T.maceta + 0.4, 0.8);
  const fr = timelapse ? [0, 1, 2, 3].map(grow) : top4 ? [0, 0, 0, 0.85] : [0, 0, 0, 0];
  return {
    ...BASE,
    jarFill: 0.85, peels: 1, ferment: 0.75, cloth: 1, bucket: 0.75, powder: 1, shells: 0.6,
    fallen: on(t, T.cinco - 0.2, A(2)[0], 0.4),
    fruit: fr, ripe: timelapse ? [0, 1, 2, 3].map((i) => 0.85 * e(t, T.racimo + 0.4 + i * 0.9, T.racimo + 2.4 + i * 0.9)) : [0, 0, 0, 0.7],
    rot: top4 ? e(t, T.punta, T.punta + 0.5) : 0,
    flw: [1, 1, 1, 1].map((v, i) => (fr[i] > 0.15 ? 0 : v * (t >= T.temporada && t < A(2)[1] + 0.5 ? (i === 3 ? 0 : 0.35) : 1))),
    bushy: Math.min(1, bushy), wilt: 0,
    cupGlow: on(t, T.hoy + 1.0, A(3)[0], 0.3) + on(t, T.taza, T.polvo, 0.3), bucketGlow: on(t, T.balde, T.polvo + 0.5, 0.3),
    powderGlow: on(t, T.polvo + 0.6, T.error + 0.4, 0.3),
    flowerGlow: on(t, T.flores, T.tocas, 0.3) * 0.6,
    roots: 0.2,
  };
};

// el mundo con desenfoque de movimiento (y oscurecido cuando hay piezas grandes encima)
export const World: React.FC<{ t: number; dim?: number }> = ({ t, dim = 0 }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(6, v0.bx * 0.5), by: Math.min(4, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  const filt = [v.bx + v.by > 0.6 ? `url(#${id})` : "", dim > 0 ? `brightness(${1 - dim})` : ""].join(" ").trim();
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: filt || undefined }}><WorldRaw t={t} camAt={CAM.camAt} st={stAt(t)} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// toma real (LTX o cuadro clave) con empuje lento propio por plano
export const Shot: React.FC<{ k: string; t: number; a: number; z?: [number, number]; ox?: number; oy?: number; dur?: number; dim?: number; from?: number }> = ({ k, t, a, z = [1.03, 1.12], ox = 0, oy = 0, dur = 8, dim = 0, from = 0 }) => {
  const q = e(t, a, a + dur), sc = z[0] + (z[1] - z[0]) * q, id = clip(k);
  // toma corta de agnes (~3 s): arranca desde su 1er cuadro y al terminar funde a su foto (mismo encuadre) que sigue el empuje
  const agl = (AV as { agnes?: Record<string, number> }).agnes?.[k];
  const inner = agl ? <>
    <Vid id={"img_" + k} />
    {t < a + agl && <AbsoluteFill style={{ opacity: 1 - e(t, a + agl - 0.45, a + agl - 0.05) }}><Vid id={id} from={0} at={a} /></AbsoluteFill>}
  </> : <Vid id={id} from={from} at={id.startsWith("ltx_") ? a : undefined} />;
  return <CamaraMano seed={2}><AbsoluteFill style={{ transform: `scale(${sc}) translate(${ox * q}px, ${oy * q}px)`, filter: dim > 0 ? `brightness(${1 - dim})` : undefined }}>{inner}</AbsoluteFill></CamaraMano>;
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

// cronómetro: la aguja da la vuelta y se clava en <n> <unit>
export const Stopwatch: React.FC<{ t: number; at: number; out: number; x: number; y: number; n: number; label?: string; unit?: string }> = ({ t, at, out, x, y, n, label, unit = "MIN" }) => {
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
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 130, color: COL.ink, textShadow: extrude(10, "#3a2a14"), lineHeight: 1 }}>{Math.round(sweep * n)} {unit}</div>
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
export const Desc: React.FC<{ t: number; at: number; out: number; second?: number }> = ({ t, at, out, second = 1e9 }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const hl = e(t, at + 0.4, at + 0.9), sweep = e(t, at + 0.4, at + 1.4), h2 = e(t, second, second + 0.4);
  const L = (w: number, op = 0.25) => <div style={{ height: 16, width: w, borderRadius: 8, background: `rgba(255,255,255,${op})`, margin: "18px 0 0" }} />;
  return (
    <div style={{ position: "absolute", left: 760, top: 560, perspective: 1500, opacity: o }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -500}px) rotateX(${14 - 8 * Math.min(1, k)}deg) rotateY(${8 + 3 * Math.sin(t * 0.8)}deg)`, width: 1060, padding: "34px 44px 40px", borderRadius: 26,
        background: "linear-gradient(180deg, rgba(28,30,34,.96), rgba(16,17,20,.96))", boxShadow: "0 70px 120px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.12)", fontFamily: FONT }}>
        <div style={{ color: "rgba(255,255,255,.55)", fontWeight: 800, fontSize: 24, letterSpacing: 4 }}>DESCRIPCIÓN</div>
        <div style={{ position: "relative", marginTop: 16, padding: "16px 20px", borderRadius: 14, background: `rgba(255,214,10,${0.18 * hl})`, boxShadow: hl > 0.05 ? `0 0 0 3px rgba(255,214,10,${0.9 * hl}), 0 0 40px rgba(255,214,10,${0.35 * hl})` : undefined, overflow: "hidden" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 38, lineHeight: 1.3 }}>🍅 La Colección del Huerto de Claudio · los 5 libros</div>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-30 + 130 * sweep}%`, width: "25%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)", opacity: sweep < 1 ? 1 : 0 }} />
        </div>
        <div style={{ marginTop: 14, padding: "10px 20px", borderRadius: 12, background: `rgba(125,255,180,${0.14 * h2})`, boxShadow: h2 > 0.05 ? `0 0 0 3px rgba(125,255,180,${0.8 * h2})` : undefined, color: `rgba(255,255,255,${0.35 + 0.65 * h2})`, fontWeight: 800, fontSize: 32 }}>✅ Los 7 pasos de hoy, con las medidas</div>
        {L(880)}{L(660)}{L(800, 0.15)}
      </div>
      <div style={{ position: "absolute", left: -500, top: -300, opacity: hl, transform: `translateX(${-30 * (1 - hl) + 10 * Math.sin(t * 6)}px)`, fontFamily: FONT, fontWeight: 900, fontSize: 54, color: "#ffd60a", textShadow: extrude(6, "#5a4500"), whiteSpace: "nowrap" }}>1ª LÍNEA DE LA DESCRIPCIÓN ⬇</div>
    </div>
  );
};

// las 5 tapas en abanico; la del abono (libro 4) se adelanta
export const Fan: React.FC<{ t: number; at: number; out: number; lift: number; title?: string }> = ({ t, at: a0, out, lift, title = "LA COLECCIÓN DEL HUERTO DE CLAUDIO" }) => {
  const o = e(t, a0, a0 + 0.2) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const up = ei(t, lift, lift + 0.7);
  return (
    <AbsoluteFill style={{ opacity: o, perspective: 1600 }}>
      {[1, 2, 3, 4, 5].map((n, i) => {
        const k = Math.min(1.1, spr(t, a0 + i * 0.12, 0.8)), ang = (i - 2) * 13 * Math.min(1, k), me = n === 4;
        const dy = me ? -70 * up : 40 * up, sc = me ? 1 + 0.18 * up : 1 - 0.08 * up;
        return <Img key={n} src={staticFile(P + `portada_l${n}.png`)} style={{ position: "absolute", left: 960 - 190, top: 250, width: 380, borderRadius: 10, transformOrigin: "50% 160%",
          transform: `rotate(${ang}deg) translateY(${(1 - Math.min(1, k)) * 400 + dy}px) scale(${sc})`, zIndex: me ? 10 : i, boxShadow: "0 40px 80px rgba(0,0,0,.6)", filter: me || up < 0.05 ? undefined : `brightness(${1 - 0.35 * up})` }} />;
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 56, color: "#fff", letterSpacing: 4, textShadow: extrude(6, "rgba(0,0,0,.7)"), opacity: e(t, a0 + 0.4, a0 + 0.7) }}>{title}</div>
    </AbsoluteFill>
  );
};

// una página REAL del libro de abono en 3D: entra girando, la cámara se acerca al título y lo subraya
export const Page: React.FC<{ t: number; at: number; out: number; n: number; hl: string; band?: [number, number] }> = ({ t, at: a0, out, n, hl, band = [64, 120] }) => {
  const k = Math.min(1.08, spr(t, a0, 0.7)), o = e(t, a0, a0 + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const zoom = ei(t, a0 + 0.8, a0 + 3.5), mark = e(t, a0 + 1.4, a0 + 2.2);
  return (
    <AbsoluteFill style={{ opacity: o, perspective: 1800 }}>
      <div style={{ position: "absolute", left: 960 - 330, top: 70, width: 660, transformOrigin: "50% 12%", transform: `rotateY(${(1 - Math.min(1, k)) * -80}deg) rotateX(${8 - 8 * zoom}deg) scale(${1 + 0.55 * zoom}) translateY(${150 * zoom}px)` }}>
        <Img src={staticFile(P + `pag${n}.png`)} style={{ width: 660, borderRadius: 6, boxShadow: "0 50px 90px rgba(0,0,0,.7)" }} />
        <div style={{ position: "absolute", left: 96, top: band[0], height: band[1] - band[0], width: 520 * mark, background: "rgba(255,214,10,.38)", mixBlendMode: "multiply", borderRadius: 6 }} />
      </div>
      <div style={{ position: "absolute", left: 80, bottom: 90, fontFamily: FONT, opacity: e(t, a0 + 0.5, a0 + 0.8) }}>
        <div style={{ fontWeight: 900, fontSize: 34, color: COL.amber, letterSpacing: 4, textShadow: "0 3px 10px #000" }}>LIBRO 4 · PÁGINA {n}</div>
        <div style={{ fontWeight: 900, fontSize: 52, color: "#fff", letterSpacing: 2, maxWidth: 560, textShadow: extrude(5, "rgba(0,0,0,.7)") }}>{hl}</div>
      </div>
    </AbsoluteFill>
  );
};

// las 7 fichas del recorrido: cada una nace con SU frase y quedan en fila abajo
const STEPS = ["LAS FLORES", "EL FERMENTADO", "EL CASCARÓN", "EL ERROR", "LA MACETA", "EL RIEGO", "ATAR Y LIMPIAR"];
export const StepRow: React.FC<{ t: number; ats: number[]; out: number; y?: number; hi?: number }> = ({ t, ats, out, y = 900, hi = -1 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 14, perspective: 1200, fontFamily: FONT }}>
    {STEPS.map((tx, i) => {
      const a0 = ats[i] ?? 1e9, k = Math.min(1.1, spr(t, a0)), o = e(t, a0, a0 + 0.1) * (1 - e(t, out + i * 0.03, out + i * 0.03 + 0.25)), me = i === hi;
      return (
        <div key={i} style={{ opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 120}px) rotateX(${(1 - Math.min(1, k)) * 70}deg) scale(${me ? 1.12 : 1})`, width: 236, padding: "10px 0 8px", borderRadius: 16, textAlign: "center",
          background: me ? "linear-gradient(180deg,#2f8a4f,#17502d)" : "linear-gradient(180deg, rgba(24,40,22,.94), rgba(12,22,12,.94))", boxShadow: `0 22px 44px rgba(0,0,0,.55), 0 0 0 2px ${me ? "#9dffbf" : "rgba(160,220,120,.5)"}` }}>
          <div style={{ fontWeight: 900, fontSize: 50, color: me ? "#e9ffe0" : "#b9f08a", lineHeight: 1, textShadow: extrude(5, "#0b2a10") }}>{i + 1}</div>
          <div style={{ fontWeight: 800, fontSize: 22, color: COL.ink, letterSpacing: 2, marginTop: 4 }}>{tx}</div>
        </div>
      );
    })}
  </div>
);

// balanza: DEMASIADO → LO QUE NO NECESITA / NADA → LO QUE SÍ
const Scale2: React.FC<{ t: number; out: number }> = ({ t, out }) => {
  const row = (a: number, l: string, r: string, col: string, y: number) => {
    const k = Math.min(1.1, spr(t, a, 0.9)), o = e(t, a, a + 0.12) * (1 - e(t, out, out + 0.3));
    if (o <= 0.01) return null;
    return (
      <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", alignItems: "center", gap: 40, opacity: o, fontFamily: FONT, transform: `translateX(${(1 - Math.min(1, k)) * -300}px)` }}>
        <div style={{ padding: "8px 36px", borderRadius: 20, background: col, fontWeight: 900, fontSize: 84, color: "#fff", letterSpacing: 2, boxShadow: `0 30px 70px rgba(0,0,0,.6), 0 0 50px ${col}88`, textShadow: extrude(5, "rgba(0,0,0,.35)") }}>{l}</div>
        <div style={{ fontWeight: 900, fontSize: 70, color: COL.ink, textShadow: extrude(6, "#000") }}>➜</div>
        <div style={{ fontWeight: 900, fontSize: 64, color: COL.ink, letterSpacing: 2, textShadow: extrude(6, "#000") }}>{r}</div>
      </div>
    );
  };
  return <AbsoluteFill>{row(T.demasiado + 0.3, "DEMASIADO", "DE LO QUE NO NECESITA", COL.red, 170)}{row(T.nada, "NADA", "DE LO QUE SÍ", "#2f8a4f", 360)}</AbsoluteFill>;
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const g1 = <Shot k="g_flores" t={t} a={A(0)[1] - 0.3} z={[1.0, 1.05]} dur={4} from={0} />;
  const g2 = <Shot k="g_flores" t={t} a={T.tocas - 0.2} z={[1.02, 1.08]} dur={5} from={6.5} />;
  const ST = [T.primero, T.echo, T.polvo, T.error, T.maceta, T.riego, T.atar];

  // ===== A · 0-3,2 · avatar "sales al patio temprano, con el café" → portal a la toma del vecino =====
  if (t < A(0)[1] + 0.05) {
    L.push(<Avatar key="avA" t={t} />);
    const r = ei(t, A(0)[1] - 0.35, A(0)[1]);
    if (r > 0) L.push(<Portal key="pA" x={1250} y={520} r={r}>{g1}</Portal>);
  }
  // ===== B · 3,2-tocas · la toma (el dedo va a las flores) → el patio 3D: la planta alta, verde, con florcitas =====
  if (t >= A(0)[1] && t < T.tocas) {
    L.push(<Swipe key="swB" t={t} a={T.preciosa - 0.35} b={T.preciosa} vert from={g1} to={<World t={t} />} />);
    if (t > T.preciosa) {
      const fl = screenOf(t, PT.tr2), tp = screenOf(t, PT.tr3);
      L.push(<Tag key="pr" t={t} at={T.preciosa + 0.3} x={tp.x} y={tp.y} dx={-320} dy={-120} text="ALTA, VERDE, LLENA DE HOJAS" col={COL.ink} out={T.flores - 0.2} size={44} />);
      L.push(<Tag key="fl" t={t} at={T.flores + 0.1} x={fl.x} y={fl.y} dx={300} dy={-170} text="FLORCITAS AMARILLAS" col="#ffd84a" out={T.tocas - 0.15} size={50} />);
    }
  }
  // ===== C · tocas-15,1 · la toma: la toca y las flores se caen =====
  if (t >= T.tocas && t < A(1)[0] + 0.05) {
    L.push(<Swipe key="swC" t={t} a={T.tocas - 0.05} b={T.tocas + 0.3} from={<World t={t} />} to={g2} />);
    const r = ei(t, A(1)[0] - 0.35, A(1)[0]);
    if (r > 0) L.push(<Portal key="pC" x={960} y={560} r={r}><Avatar t={t} /></Portal>);
  }
  // ===== D · 15,1-19,2 · avatar: tres flores en la palma, SECAS =====
  if (t >= A(1)[0] && t < A(1)[1] + 0.4) {
    L.push(<Swipe key="swD" t={t} a={A(1)[1]} b={A(1)[1] + 0.38} vert from={<Avatar t={t} />} to={<World t={t} />} />);
    L.push(<Stamp key="sec" t={t} at={T.secas} text="SECAS" x={1500} y={260} out={A(1)[1] - 0.1} rot={-8} size={110} col="#d9a43a" />);
  }
  // ===== E · 19,2-32 · la tierra: 5 flores tiradas → arriba, 4 tomates → la punta negra → "pensaste que era tu culpa" =====
  if (t >= A(1)[1] + 0.38 && t < A(2)[0] + 0.05) {
    const img = <Shot k="r_cuatro_arriba" t={t} a={T.pensaste} z={[1.04, 1.12]} dur={4} />;
    L.push(<Swipe key="swE" t={t} a={T.pensaste} b={T.pensaste + 0.38} dir={-1} from={<World t={t} />} to={img} />);
    if (t < T.temporada + 0.3) { const so = screenOf(t, [0.25, 0.73, -0.2]); L.push(<Tag key="c5" t={t} at={T.cinco + 0.2} x={so.x} y={so.y} dx={330} dy={-230} text="5 FLORES EN LA TIERRA" col="#ffd84a" out={T.temporada - 0.1} size={50} />); }
    if (t > T.cuatro - 0.3 && t < T.pensaste + 0.4) {
      L.push(<BigNum key="4t" t={t} at={T.cuatro + 0.1} text="4 TOMATES" sub="Y TODOS ALLÁ ARRIBA" size={120} x={1400} y={230} out={T.punta - 0.15} col="#ff8a6a" edge="#4a120a" />);
      const tp = screenOf(t, PT.tr3);
      L.push(<Tag key="pn" t={t} at={T.punta + 0.3} x={tp.x} y={tp.y + 60} dx={-340} dy={140} text="LA PUNTA NEGRA" col={COL.red} out={T.pensaste - 0.1} size={56} />);
    }
    const r = ei(t, A(2)[0] - 0.35, A(2)[0]);
    if (r > 0) L.push(<Portal key="pE" x={960} y={540} r={r}><Avatar t={t} /></Portal>);
  }
  // ===== F · 32-35,9 · avatar: NO ES TU MANO =====
  if (t >= A(2)[0] && t < A(2)[1] + 0.4) {
    L.push(<Swipe key="swF" t={t} a={A(2)[1]} b={A(2)[1] + 0.38} from={<Avatar t={t} />} to={<Shot k="k_patio" t={t} a={A(2)[1]} z={[1.1, 1.02]} ox={-30} dur={4} />} />);
    L.push(<Stamp key="nm" t={t} at={T.noMano} text="NO ES TU MANO" x={540} y={230} out={A(2)[1] - 0.1} rot={-8} size={92} col="#7dffb4" />);
  }
  // ===== G · 35,9-46,7 · Claudio en su patio (rótulo) → la balanza sobre la planta → el banco (sale de la cocina) =====
  if (t >= A(2)[1] + 0.38 && t < A(3)[0] + 0.05) {
    const kp = <Shot k="k_patio" t={t} a={A(2)[1]} z={[1.1, 1.02]} ox={-30} dur={4} />;
    L.push(<Swipe key="swG" t={t} a={T.demasiado - 0.35} b={T.demasiado} vert from={kp} to={<World t={t} dim={t < T.hoy ? 0.35 : 0} />} />);
    if (t >= T.demasiado - 0.1 && t < T.hoy + 0.4) L.push(<Scale2 key="sc2" t={t} out={T.hoy} />);
    if (t > T.hoy + 0.8) {
      const j = screenOf(t, PT.jar), m = screenOf(t, PT.molca);
      L.push(<Tag key="sc" t={t} at={T.cocina} x={j.x} y={j.y} dx={-320} dy={-200} text="SALE DE LA COCINA" col="#ffd84a" out={A(3)[0] - 0.1} size={52} />);
      L.push(<Tag key="cn" t={t} at={T.cocina + 0.9} x={m.x} y={m.y} dx={260} dy={-220} text="$0" sub="NO CUESTA NADA" col="#7dffb4" out={A(3)[0] - 0.1} size={72} />);
    }
    const r = ei(t, A(3)[0] - 0.35, A(3)[0]);
    if (r > 0) L.push(<Portal key="pG" x={960} y={540} r={r}><Avatar t={t} /></Portal>);
  }
  if (t >= A(2)[1] && t < T.demasiado + 0.3) L.push(<LowerThird key="lt1" t={t} at={T.trabajo} out={T.demasiado - 0.3} name="CLAUDIO" l2="30 AÑOS CON LAS MANOS EN LA TIERRA" l2at={T.trabajo + 0.8} />);
  // ===== H · 46,7-50,8 · avatar: 7 PASOS =====
  if (t >= A(3)[0] && t < A(3)[1] + 0.05) {
    L.push(<Avatar key="avH" t={t} />);
    L.push(<BigNum key="7p" t={t} at={T.siete} text="7 PASOS" sub="DE ABAJO HASTA LA PUNTA" size={120} x={1500} y={220} out={A(3)[1] - 0.35} col="#b9f08a" edge="#14350f" />);
    const r = ei(t, A(3)[1] - 0.35, A(3)[1]);
    if (r > 0) L.push(<Portal key="pH" x={960} y={540} r={r}><World t={t} /></Portal>);
  }
  // ===== I · 50,8-62,7 · los racimos se llenan de abajo a la punta → el patio entero y las fichas del recorrido =====
  if (t >= A(3)[1] && t < A(4)[0] + 0.05) {
    L.push(<World key="wI" t={t} />);
    if (t < T.orden + 0.5) { const b0 = screenOf(t, PT.tr0); L.push(<Tag key="pr0" t={t} at={T.racimo + 0.1} x={b0.x} y={b0.y + 40} dx={-330} dy={150} text="EL PRIMER RACIMO DE ABAJO" col="#ff9a7a" out={T.punta2 + 0.2} size={48} />); }
    L.push(<Stopwatch key="sw5" t={t} at={T.cincoMin} out={A(4)[0] - 0.3} x={1460} y={330} n={5} label="Y SE ARREGLA" />);
    const r = ei(t, A(4)[0] - 0.35, A(4)[0]);
    if (r > 0) L.push(<Portal key="pI" x={960} y={540} r={r}><Avatar t={t} /></Portal>);
  }
  // ===== J · 62,7-68,7 · avatar: la medida exacta =====
  if (t >= A(4)[0] && t < A(4)[1] + 0.4) {
    L.push(<Swipe key="swJ" t={t} a={A(4)[1]} b={A(4)[1] + 0.38} vert from={<Avatar t={t} />} to={<World t={t} />} />);
    L.push(<BigNum key="tz" t={t} at={T.taza} text="1 TAZA · 1 BALDE" sub="LA MEDIDA EXACTA" size={92} x={1430} y={200} out={A(4)[1] - 0.2} col="#ffd84a" edge="#5a4500" />);
  }
  // ===== K · 68,7-80,1 · el banco (taza y balde) → el molcajete (polvo blanco) → PURO FOLLAJE → el patio =====
  if (t >= A(4)[1] + 0.38 && t < A(5)[0] + 0.05) {
    L.push(<World key="wK" t={t} />);
    if (t < T.polvo + 0.2) { const b = screenOf(t, PT.bucket); L.push(<Tag key="bl" t={t} at={A(4)[1] + 0.4} x={b.x} y={b.y} dx={300} dy={-180} text="EL BALDE DE 10 LITROS" col="#8fd6ff" out={T.polvo} size={46} />); }
    if (t > T.polvo + 0.6 && t < T.error + 0.4) { const m = screenOf(t, PT.molca); L.push(<Tag key="pb" t={t} at={T.polvo + 0.9} x={m.x} y={m.y} dx={-320} dy={-200} text="EL POLVO BLANCO" sub="UNA VEZ AL MES" col="#fff" out={T.error + 0.1} size={52} />); }
    L.push(<Stamp key="pf" t={t} at={T.follaje} text="PURO FOLLAJE" x={1350} y={260} out={T.maceta - 0.1} rot={-7} size={96} />);
    const r = ei(t, A(5)[0] - 0.35, A(5)[0]);
    if (r > 0) L.push(<Portal key="pK" x={960} y={540} r={r}><Avatar t={t} /></Portal>);
  }
  if ((t >= T.primero - 0.2 && t < A(4)[0] + 0.1) || (t >= A(4)[1] + 0.3 && t < A(5)[0] + 0.1)) L.push(<StepRow key="sr" t={t} ats={ST} out={A(5)[0] - 0.25} y={900} />);
  // ===== L · 80,1-84,6 · avatar: todo con cosas que hoy tiras a la basura =====
  if (t >= A(5)[0] && t < A(5)[1] + 0.05) {
    L.push(<Avatar key="avL" t={t} />);
    L.push(<Stamp key="bs" t={t} at={T.basura - 0.1} text="DE LA BASURA" x={1480} y={250} out={A(5)[1] - 0.3} rot={-8} size={86} col="#7dffb4" />);
    const r = ei(t, A(5)[1] - 0.35, A(5)[1]);
    if (r > 0) L.push(<Portal key="pL" x={960} y={540} r={r}><World t={t} /></Portal>);
  }
  // ===== M · 84,6-94,8 · el patio de Claudio: limoneros, chiles, fresas =====
  if (t >= A(5)[1] && t < A(6)[0] + 0.05) {
    L.push(<World key="wM" t={t} />);
    const lm = screenOf(t, [2.9, 1.6, -2.0]), ch = screenOf(t, [-2.9, 0.75, -0.9]), fr = screenOf(t, [-1.7, 0.8, -1.9]);
    L.push(<Tag key="lm" t={t} at={T.limon} x={lm.x} y={lm.y} dx={-300} dy={-160} text="LIMONEROS" col="#ffe25a" out={T.chiles + 0.6} size={50} />);
    L.push(<Tag key="ch" t={t} at={T.chiles + 0.9} x={ch.x} y={ch.y} dx={280} dy={-200} text="CHILES" col="#ff7a5a" out={A(6)[0] - 0.2} size={50} />);
    L.push(<Tag key="fr" t={t} at={T.fresas + 0.5} x={fr.x} y={fr.y} dx={300} dy={-140} text="FRESAS" col="#ff9ab0" out={A(6)[0] - 0.2} size={50} />);
    const r = ei(t, A(6)[0] - 0.35, A(6)[0]);
    if (r > 0) L.push(<Portal key="pM" x={960} y={540} r={r}><Avatar t={t} /></Portal>);
  }
  if (t >= T.claudio - 0.2 && t < A(6)[0] + 0.3) L.push(<LowerThird key="lt2" t={t} at={T.claudio} out={T.limon - 0.3} name="CLAUDIO" l2="55 AÑOS · UN PATIO CHICO LLENO DE MACETAS" l2at={T.claudio + 0.9} />);
  // ===== N · 94,8-100,9 · avatar: mi papá sembraba tomates =====
  if (t >= A(6)[0] && t < A(6)[1] + 0.4) {
    L.push(<Swipe key="swN" t={t} a={A(6)[1]} b={A(6)[1] + 0.38} from={<Avatar t={t} />} to={<Shot k="r_latas" t={t} a={A(6)[1]} z={[1.12, 1.03]} dur={3} />} />);
    L.push(<Tag key="lt" t={t} at={T.latas + 0.1} x={1240} y={640} dx={280} dy={-260} text="EN LATAS DE ACEITE" col={COL.amber} out={A(6)[1] - 0.15} size={48} />);
  }
  // ===== O · 100,9-112,6 · las latas de la azotea → la cocina de la mamá → las 5 tapas (lo escribí) =====
  if (t >= A(6)[1] + 0.38 && t < A(7)[0] + 0.05) {
    const lat = <Shot k="r_latas" t={t} a={A(6)[1]} z={[1.12, 1.03]} dur={3} />, coc = <Shot k="k_cocina" t={t} a={T.mama - 0.3} z={[1.03, 1.1]} dur={3} />;
    L.push(<Swipe key="swO" t={t} a={T.mama - 0.3} b={T.mama + 0.05} from={lat} to={
      <Swipe t={t} a={T.rapido - 0.1} b={T.rapido + 0.25} vert from={coc} to={<World t={t} dim={0.55} />} />} />);
    L.push(<Tag key="sa" t={t} at={T.azotea + 0.4} x={960} y={620} dx={-320} dy={-240} text="SIN ABONO DE TIENDA" col="#fff" out={T.mama - 0.3} size={52} />);
    L.push(<Tag key="cm" t={t} at={T.mama + 0.4} x={960} y={600} dx={320} dy={-240} text="LA COCINA DE MI MAMÁ" col="#ffd84a" out={T.rapido - 0.1} size={52} />);
    L.push(<Fan key="fan" t={t} at={T.escribi} out={A(7)[0] - 0.25} lift={T.libros + 0.4} />);
    const r = ei(t, A(7)[0] - 0.35, A(7)[0]);
    if (r > 0) L.push(<Portal key="pO" x={960} y={540} r={r}><Avatar t={t} /></Portal>);
  }
  // ===== P · 112,6-117,4 · avatar: uno entero es el abono de la cocina =====
  if (t >= A(7)[0] && t < A(7)[1] + 0.05) {
    L.push(<Avatar key="avP" t={t} />);
    L.push(<BigNum key="fc" t={t} at={T.ficha} text="UNA FICHA POR PLANTA" size={74} x={1380} y={190} out={A(7)[1] - 0.3} col="#ffd84a" edge="#5a4500" />);
    const r = ei(t, A(7)[1] - 0.35, A(7)[1]);
    if (r > 0) L.push(<Portal key="pP" x={960} y={540} r={r}><World t={t} dim={0.55} /></Portal>);
  }
  // ===== Q · 117,4-129,3 · la PÁGINA 70 real → la 1ª línea de la descripción (+ los 7 pasos) =====
  if (t >= A(7)[1] && t < A(8)[0] + 0.05) {
    L.push(<World key="wQ" t={t} dim={0.55} />);
    L.push(<Page key="p70" t={t} at={A(7)[1] + 0.05} out={T.link - 0.1} n={70} hl="LA FICHA DEL TOMATE" band={[64, 120]} />);
    L.push(<Desc key="desc" t={t} at={T.link} out={A(8)[0] - 0.3} second={T.pasos} />);
    const r = ei(t, A(8)[0] - 0.35, A(8)[0]);
    if (r > 0) L.push(<Portal key="pQ" x={960} y={540} r={r}><Avatar t={t} /></Portal>);
  }
  // ===== R · 129,3-133,9 · avatar "vamos a la planta" → portal a las flores =====
  if (t >= A(8)[0]) {
    L.push(<Avatar key="avR" t={t} />);
    const r = ei(t, A(8)[1] - 0.4, A(8)[1]);
    if (r > 0) L.push(<Portal key="pR" x={1300} y={500} r={r}><World t={t} /></Portal>);
  }
  return <AbsoluteFill style={{ background: "#0b0d08" }}>{L}</AbsoluteFill>;
};
