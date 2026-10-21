// donlupe01 · MINUTO 1 (0-~126 s). Un solo hilo: la cocina de afuera del rancho de Don Lupe es el mundo; todo entra y sale de ahí
// sin cortes secos: avatar → portal a la barbacoa de la mesa → el trinche baja y se deshace sola → humareda → la penca en la lumbre (toma)
// → la olla de presión tachada → avatar → domingo, la familia (toma) → la báscula de la taquería ($500 el kilo) → avatar con el recuerdo
// de la olla hirviendo (burbuja) → el suegro mastica ×3 (toma) → el tenedor en la mano (toma) → el cronómetro de 4 horas → la carne
// SECA/DURA/HILOS en la mesa → el refri → "NO FUISTE TÚ" en gis sobre la pared encalada → avatar: HIERVE vs SUDA → madrugada: el hoyo
// se destapa → la taquería: presión + sobre de consomé → avatar → los SIETE JARRITOS se encienden uno por secreto → pesos → avatar
// (el salero del coraje) → la cámara se mete al jarrito 2. Todo clavado a la voz con at("frase"). Audio fuera de Remotion.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, getInputProps, staticFile, useCurrentFrame } from "remotion";
const NOMB = !!(getInputProps() as { nomb?: boolean }).nomb; // stills locales: sin desenfoque de movimiento (el SVG blur sobre WebGL cuelga el Chrome local)
import { World as WorldRaw, WorldProps, PT, JARS, TY, screenOf, camSpeed, setKeys, win, Key, V } from "./rancho3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, CH, DrawX, Flash, FONT, HAND, P, Portal, SERIF, Tag, at, atEnd, e, ei, extrude, s, spr } from "./lib";

const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
const IMGS = new Set((AVAIL as { imgs?: string[] }).imgs ?? []);
type Win = { ms: number; me: number; off: number };
const WIN: Win[] = ((AVW as { win: Win[] }).win).filter((w) => w.ms < 125);
export const MIN1_END = Math.round((atEnd("todo el mundo", 120) + 0.45) * 30) / 30;
export const MIN1_FRAMES = s(MIN1_END);
const AVS = WIN.map((w) => [w.ms, w.me] as [number, number]);

// ---------------- tiempos clavados a la voz ----------------
const T = {
  carne: at("esta carne"), tenedor: at("con el tenedor"), deshace: at("se deshace"), cuchillo: at("sin cuchillo"), huele: at("huelela"),
  penca: at("a penca"), presion: at("olla de presion"), siete: at("siete secretos"), taquerias: at("las taquerias"),
  familia: at("toda la familia"), hagoyo: at("la hago yo"), k500: at("500"), kilo: at("el kilo"), kilos3: at("3 kilos"), agua: at("con agua"), horas4: at("4 horas"),
  suegro: at("tu suegro"), mast1: at("mastica"), mast2: at("mastica", at("mastica") + 0.2), mast3: at("mastica", at("mastica", at("mastica") + 0.2) + 0.2),
  salsa: at("la salsa"), mano: at("en la mano"), quehice: at("que hice"), cuatro: at("cuatro horas"), seca: at("seca por fuera"), dura: at("dura por dentro"),
  hilos: at("con hilos"), caldo: at("un caldo"), sabeagua: at("sabe a agua"), refri: at("en el refri"), compro: at("la compro"), pasado: at("te ha pasado"),
  nofuiste: at("no fuiste tu"), hierves: at("la hierves"), nosehierve: at("no se hierve"), suda: at("se suda"), sinhablar: at("sin hablar"),
  presion2: at("olla de presion", 75), sobre: at("un sobre"), consome: at("consome", 80), hoyo: at("en el hoyo"), siete2: at("7 secretos"),
  jar: [at("que carne"), at("la sal", 90), at("el adobo"), at("la penca", 95), at("una vaporera"), at("la olla escondida"), at("el reloj", 105)],
  pesos: at("en pesos"), num2: at("numero 2"), coraje: at("coraje"), mundo: at("todo el mundo", 120),
};
T.jar[4] = Math.max(AVS[6][1] + 0.25, T.jar[4]); // el hoyo/vaporera cae dentro del avatar: el jarrito 5 se enciende al volver

// ---------------- cámara del minuto 1 (una sola; entradas/salidas por portal, humareda o barrido) ----------------
const CA = PT.carne;
const JK: Key[] = JARS.flatMap((q, i) => [{ t: T.jar[i] - 0.35, p: [q[0] - 0.22, 1.16, 1.18] as V, l: [q[0] + 0.05, 0.9, 0.3] as V, fov: 34 }]);
setKeys([
  { t: 3.4, p: [0.62, 1.32, 1.05], l: CA, fov: 34 },
  { t: 4.0, p: [0.6, 1.3, 1.0], l: CA, fov: 34 },
  { t: T.tenedor, p: [-0.35, 1.18, 0.62], l: CA, fov: 30, arc: 0.08 },                // órbita a la altura de la mesa
  { t: 11.4, p: [-0.3, 1.06, 0.42], l: [CA[0], 0.86, CA[2]], fov: 27 },                 // muy cerca: la hebra se cae sola
  { t: 26.6, p: [-0.95, 1.34, 0.95], l: [0.3, 0.86, -0.45], fov: 38 },                // la mesa con el fogón detrás (sin patio vacío)
  { t: 32.2, p: [-0.72, 1.28, 0.78], l: [0.3, 0.86, -0.45], fov: 36 },
  { t: 53.4, p: [0.55, 1.14, 0.52], l: CA, fov: 30 },                                   // la carne "mala": seca, dura, hilos
  { t: 59.0, p: [0.32, 1.06, 0.38], l: CA, fov: 27 },
  { t: 63.6, p: [-1.15, 1.6, -0.95], l: [-1.65, 1.68, -2.6], fov: 40 },               // de cerca a la pared encalada: NO FUISTE TÚ
  { t: 67.3, p: [-1.35, 1.62, -1.25], l: [-1.65, 1.68, -2.6], fov: 38 },
  { t: 72.8, p: [0.3, 1.55, -0.85], l: [1.35, 1.08, -2.1], fov: 40 },                 // madrugada: la olla del fogón (de ahí, portal al hoyo)
  { t: 77.7, p: [0.8, 1.42, -1.3], l: [1.35, 1.05, -2.1], fov: 36 },
  { t: AVS[5][1] - 0.1, p: [-1.45, 1.25, 1.55], l: [-0.95, 0.88, 0.3], fov: 34 },       // los siete jarritos, de lado a lado
  ...JK,
  { t: 118.1, p: [1.05, 1.17, 1.2], l: [0.85, 0.9, 0.3], fov: 34 },
  { t: AVS[7][1] - 0.05, p: [-0.42, 1.12, 1.05], l: JARS[1], fov: 30 },                 // se mete al jarrito 2 (la sal)
  { t: 127, p: [-0.5, 1.0, 0.72], l: JARS[1], fov: 24 },
]);

// ---------------- estado del mundo por segundo ----------------
const worldAt = (t: number): WorldProps => ({
  t,
  dawn: win(t, 72.5, 73.2) * (1 - win(t, 78, 79)),
  fire: 1,
  fork: t < 20 ? ei(t, T.tenedor - 0.1, T.tenedor + 1.7) : 0,
  desh: t < 20 ? ei(t, T.deshace - 0.15, T.deshace + 1.6) : t < 60 ? 0.35 : 1,
  dry: t > 50 && t < 70 ? 1 : 0,
  meatSteam: t > 50 && t < 70 ? 0 : 1,
  hoyo: ei(t, T.sinhablar - 0.9, T.sinhablar + 1.2),
  hoyoSteam: win(t, T.sinhablar - 0.4, T.sinhablar + 0.6),
  jarOn: JARS.map((_, i) => win(t, T.jar[i], T.jar[i] + 0.3) * (i === 1 ? 1 : 1 - 0.55 * win(t, AVS[7][1], AVS[7][1] + 0.3))),
  jarSteam: JARS.map((_, i) => win(t, T.jar[i] + 0.2, T.jar[i] + 0.8) * 0.8),
  vapor: 0.6,
  dof: (t > 3 && t < 12) || (t > 53 && t < 60) || t > 123 ? 0.005 : 0.0018,
});

const World: React.FC<{ t: number; over?: Partial<WorldProps> }> = ({ t, over }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: !NOMB && v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw {...worldAt(t)} {...over} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------- avatar (preroll de 10 cuadros por ventana) ----------------
const Avatar: React.FC<{ t: number }> = ({ t }) => {
  // stills locales: cuadro del reel ya extraído (el extractor del reel se cuelga con 13 sesiones encima)
  const wAct = WIN.find((w) => t >= w.ms - 0.02 && t < w.me);
  const face = REEL && NOMB ? (wAct ? <Img src={staticFile(P + "avf/f" + Math.round((wAct.off + t - wAct.ms) * 30) + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null) : REEL ? <>{WIN.map((w, i) => (
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
    : IMGS.has(k) ? <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    : <AbsoluteFill style={{ background: "#2a1a10", color: "#f6e7c8", fontFamily: FONT, fontSize: 60, alignItems: "center", justifyContent: "center" }}>{k}</AbsoluteFill>;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}><AbsoluteFill style={{ transform: `scale(${sc}) translateX(${ox * e(t, a, a + 7)}px)` }}>{inner}</AbsoluteFill></AbsoluteFill>;
};

// ======================= PIEZAS NUEVAS del minuto 1 =======================
// HUMAREDA de leña: humo gris-ocre que cruza de lado con chispas (transición de rancho, ida y vuelta)
export const Humareda: React.FC<{ t: number; mid: number; w?: number; dir?: 1 | -1 }> = ({ t, mid, w = 0.5, dir = 1 }) => {
  const k = 1 - Math.min(1, Math.abs(t - mid) / w);
  if (k <= 0.01) return null;
  const u = (t - mid + w) / (2 * w);
  const blobs = Array.from({ length: 16 }, (_, i) => {
    const x = dir * ((i * 173) % 2300 - 200 + (u - 0.5) * 1400) + (dir < 0 ? 1920 : 0), y = ((i * 97) % 1180) - 50 + Math.sin(i + u * 3) * 60;
    const r = 380 + (i % 5) * 110;
    return `radial-gradient(circle ${r}px at ${x}px ${y}px, rgba(214,200,182,${0.8 * k}) 0%, rgba(190,172,150,0) 70%)`;
  });
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ background: blobs.join(","), opacity: Math.min(1, k * 1.7), filter: "blur(16px)" }} />
    <AbsoluteFill style={{ background: `rgba(222,210,192,${0.88 * Math.pow(k, 1.7)})` }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: k }}>
      {Array.from({ length: 26 }, (_, i) => { const x = (i * 211 + u * 900 * dir) % 1920, y = 1080 - ((i * 53 + u * 700) % 1080); return <circle key={i} cx={x} cy={y} r={2 + (i % 3)} fill="#ffb050" style={{ filter: "drop-shadow(0 0 6px #ff8a2a)" }} />; })}
    </svg>
  </AbsoluteFill>;
};

// cuchillo dibujado que cae junto a la carne y se tacha ("sin cuchillo")
export const SinCuchillo: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const k = Math.min(1.1, spr(t, at, 1.1)), o = e(t, at, at + 0.08) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k)) * -220}px) rotate(${-30 + 12 * Math.min(1, k)}deg)` }}>
    <svg width={420} height={130} viewBox="0 0 420 130" style={{ filter: "drop-shadow(0 18px 24px rgba(0,0,0,.6))" }}>
      <rect x={10} y={48} width={130} height={34} rx={12} fill="#4a2c18" /><circle cx={45} cy={65} r={5} fill="#c9b08a" /><circle cx={100} cy={65} r={5} fill="#c9b08a" />
      <path d="M 140 46 L 400 56 Q 410 66 396 78 L 140 84 Z" fill="url(#hoja)" />
      <defs><linearGradient id="hoja" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f2f2f2" /><stop offset="1" stopColor="#8a8a8a" /></linearGradient></defs>
    </svg>
    <div style={{ position: "absolute", left: 40, top: -100 }}><DrawX t={t} at={at + 0.35} x={0} y={0} w={340} h={320} /></div>
    <div style={{ position: "absolute", left: 60, top: 130, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: CH.crema, whiteSpace: "nowrap", textShadow: "0 6px 18px rgba(0,0,0,.8)", clipPath: `inset(-20% ${100 - 100 * e(t, at + 0.4, at + 1.0)}% -20% 0)` }}>sin cuchillo</div>
  </div>;
};

// olla de presión de aluminio (2.5D) con la válvula que gira y suelta chorro; se tacha
export const OllaPresion: React.FC<{ t: number; at: number; out: number; x: number; y: number; sc?: number }> = ({ t, at, out, x, y, sc = 1 }) => {
  const k = Math.min(1.1, spr(t, at, 1.1)), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const spin = (t - at) * 900;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${sc * (0.6 + 0.4 * Math.min(1, k))}) rotate(${(1 - Math.min(1, k)) * 25 - 4}deg)` }}>
    <svg width={360} height={330} viewBox="-180 -190 360 330" style={{ filter: "drop-shadow(0 26px 36px rgba(0,0,0,.6))" }}>
      <defs><linearGradient id="alu" x1="0" x2="1"><stop offset="0" stopColor="#7d8186" /><stop offset=".35" stopColor="#e4e7ea" /><stop offset=".7" stopColor="#a8acb0" /><stop offset="1" stopColor="#5d6166" /></linearGradient></defs>
      <rect x={-140} y={-60} width={280} height={190} rx={26} fill="url(#alu)" />
      <ellipse cx={0} cy={-60} rx={150} ry={34} fill="#cfd3d6" stroke="#6a6e72" strokeWidth={4} />
      <rect x={-240} y={-78} width={110} height={26} rx={12} fill="#1d1d1d" /><rect x={130} y={-78} width={70} height={24} rx={10} fill="#1d1d1d" />
      <g transform={`translate(0 -96) rotate(${spin % 360})`}><rect x={-14} y={-26} width={28} height={30} rx={6} fill="#2a2a2a" /><rect x={-24} y={-30} width={48} height={8} rx={4} fill="#3a3a3a" /></g>
      {Array.from({ length: 6 }, (_, i) => { const ph = ((t * 2.4 + i / 6) % 1); return <circle key={i} cx={Math.sin(i * 2 + t * 3) * 14 * ph} cy={-130 - ph * 70} r={10 + ph * 26} fill="#fff" opacity={(1 - ph) * 0.5} />; })}
    </svg>
    <div style={{ position: "absolute", left: -10, top: -10 }}><DrawX t={t} at={at + 0.5} x={0} y={0} w={380} h={340} /></div>
  </div>;
};

// báscula colgante de carnicería: el plato se mece y la aguja corre hasta $500
export const Bascula: React.FC<{ t: number; at: number; numAt: number; out: number; x: number; y: number }> = ({ t, at, numAt, out, x, y }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sw = (1 - Math.min(1, k)) * 22 + 4 * Math.sin((t - at) * 3.2) * Math.exp(-(t - at) * 0.7);
  const val = 500 * Math.min(1.04, spr(t, numAt, 0.9)), ang = -140 + 280 * (val / 600);
  return <div style={{ position: "absolute", left: x, top: -40, opacity: o, transformOrigin: "50% 0", transform: `rotate(${sw}deg) translateY(${(1 - Math.min(1, k)) * -360}px)` }}>
    <div style={{ width: 6, height: y - 170, margin: "0 auto", background: "linear-gradient(90deg,#5a5a5a,#bbb,#5a5a5a)" }} />
    <svg width={400} height={460} viewBox="-200 -200 400 460" style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))", display: "block", margin: "0 auto" }}>
      <circle r={180} fill="#e9e4da" stroke="#9a2a1a" strokeWidth={18} />
      {Array.from({ length: 13 }, (_, i) => { const a = (-140 + i * (280 / 12)) * Math.PI / 180; return <g key={i}><line x1={Math.sin(a) * 150} y1={-Math.cos(a) * 150} x2={Math.sin(a) * (i % 2 ? 135 : 120)} y2={-Math.cos(a) * (i % 2 ? 135 : 120)} stroke="#2a120c" strokeWidth={i % 2 ? 4 : 7} />{i % 2 === 0 && <text x={Math.sin(a) * 96} y={-Math.cos(a) * 96 + 10} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={26} fill="#2a120c">{i * 50}</text>}</g>; })}
      <line x1={0} y1={0} x2={Math.sin(ang * Math.PI / 180) * 150} y2={-Math.cos(ang * Math.PI / 180) * 150} stroke="#c0281a" strokeWidth={8} strokeLinecap="round" />
      <circle r={16} fill="#2a120c" />
      <text x={0} y={70} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={30} fill="#9a2a1a" letterSpacing={3}>TAQUERÍA</text>
      <path d="M -150 200 Q 0 260 150 200 L 120 200 Q 0 236 -120 200 Z" fill="#a8acb0" /><line x1={-150} y1={200} x2={0} y2={180} stroke="#888" strokeWidth={3} /><line x1={150} y1={200} x2={0} y2={180} stroke="#888" strokeWidth={3} />
    </svg>
    <div style={{ marginTop: -24, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 112, lineHeight: 1, color: CH.maiz, textShadow: extrude(8, "#5a2a10") }}>${Math.round(val)}</div>
    <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: CH.crema, letterSpacing: 4, textShadow: "0 4px 14px rgba(0,0,0,.8)", opacity: e(t, numAt + 0.5, numAt + 0.8) }}>EL KILO</div>
  </div>;
};

// burbuja de recuerdo sobre el avatar: un portal redondo con borde de nube (la olla hirviendo)
export const Burbuja: React.FC<{ t: number; at: number; out: number; x: number; y: number; r: number; children: React.ReactNode }> = ({ t, at, out, x, y, r, children }) => {
  const k = Math.min(1.08, spr(t, at, 0.9)) * (1 - e(t, out, out + 0.35));
  if (k <= 0.01) return null;
  const R = r * k;
  return <>
    {[0.16, 0.09].map((q, i) => <div key={i} style={{ position: "absolute", left: x - r * (0.9 + i * 0.45), top: y + r * (0.95 + i * 0.4), width: r * q * k, height: r * q * k, borderRadius: "50%", background: "#f6efe2", boxShadow: "0 8px 20px rgba(0,0,0,.5)", transform: "translate(-50%,-50%)" }} />)}
    <div style={{ position: "absolute", left: x - R, top: y - R, width: 2 * R, height: 2 * R, borderRadius: "50%", overflow: "hidden", boxShadow: `0 0 0 ${10 * k}px #f6efe2, 0 24px 60px rgba(0,0,0,.6)` }}>
      <div style={{ position: "absolute", left: R - 960, top: R - 540, width: 1920, height: 1080, transform: `scale(${(2 * r) / 1080 * 1.05})` }}>{children}</div>
    </div>
  </>;
};

// renglones de papel de carnicería con sello: 3 KG · CON AGUA · 4 HORAS
export const Contador: React.FC<{ t: number; rows: { at: number; text: string }[]; out: number; x: number; y: number }> = ({ t, rows, out, x, y }) => <>{rows.map((r, i) => {
  const k = Math.min(1.1, spr(t, r.at, 1.2)), o = e(t, r.at, r.at + 0.08) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div key={i} style={{ position: "absolute", left: x, top: y + i * 112, opacity: o, transform: `translateX(${(1 - Math.min(1, k)) * 240}px) rotate(${-2 + i * 1.5}deg)`, padding: "10px 34px 12px", background: "linear-gradient(180deg,#f4ead6,#e2d2b0)", borderLeft: `14px solid ${CH.guinda}`, boxShadow: "0 16px 30px rgba(0,0,0,.5)", fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: CH.negro, letterSpacing: 2, whiteSpace: "nowrap" }}>{r.text}</div>;
})}</>;

// "MASTICA" que rebota ×1 ×2 ×3 (la quijada del suegro)
export const Mastica: React.FC<{ t: number; hits: number[]; out: number; x: number; y: number }> = ({ t, hits, out, x, y }) => {
  const o = e(t, hits[0], hits[0] + 0.08) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const n = hits.filter((h) => t >= h).length, last = hits[Math.max(0, n - 1)];
  const sq = 1 - 0.18 * Math.exp(-(t - last) * 9) * Math.cos((t - last) * 30);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: CH.crema, transform: `scaleY(${sq}) scaleX(${2 - sq})`, textShadow: extrude(8, "#3a1a08") }}>MASTICA</div>
    <div style={{ display: "flex", gap: 26, justifyContent: "center", marginTop: 6 }}>{hits.map((h, i) => <div key={i} style={{ width: 92, height: 92, borderRadius: "50%", background: t >= h ? CH.maiz : "rgba(255,255,255,.12)", border: `5px solid ${CH.maiz}`, transform: `scale(${t >= h ? Math.min(1.15, spr(t, h, 1.4)) : 0.8})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 44, color: CH.negro }}>×{i + 1}</div>)}</div>
  </div>;
};

// signo de pregunta dibujado a mano (trazo que se escribe) + la frase
export const Pregunta: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string }> = ({ t, at, out, x, y, text }) => {
  const o = 1 - e(t, out, out + 0.3), w = e(t, at, at + 0.7);
  if (w <= 0.01 || o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
    <svg width={300} height={380} viewBox="0 0 300 380" style={{ display: "block", margin: "0 auto", filter: "drop-shadow(0 8px 20px rgba(0,0,0,.8))" }}>
      <path d="M 70 110 C 70 30 230 20 230 110 C 230 170 150 170 150 240" fill="none" stroke={CH.crema} strokeWidth={30} strokeLinecap="round" strokeDasharray="520" strokeDashoffset={520 * (1 - w)} />
      <circle cx={150} cy={320} r={22 * e(t, at + 0.6, at + 0.8)} fill={CH.crema} />
    </svg>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 96, color: CH.crema, whiteSpace: "nowrap", textShadow: "0 6px 20px rgba(0,0,0,.85)", clipPath: `inset(-20% ${100 - 100 * e(t, at + 0.3, at + 1.2)}% -20% 0)`, transform: "rotate(-4deg)" }}>{text}</div>
  </div>;
};

// cronómetro de cocina de aluminio (de cuerda): la perilla gira y marca 4 HORAS
export const Cronometro: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const k = Math.min(1.1, spr(t, at, 1)), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const h = 4 * ei(t, at + 0.15, at + 1.6), ang = h * 60;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k}) rotate(${Math.sin(t * 40) * 1.2 * (1 - e(t, at + 1.6, at + 1.8))}deg)` }}>
    <svg width={360} height={400} viewBox="-180 -220 360 400" style={{ filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      <defs><radialGradient id="cr" cx=".35" cy=".3"><stop offset="0" stopColor="#ffffff" /><stop offset=".6" stopColor="#c4c8cc" /><stop offset="1" stopColor="#7a7e82" /></radialGradient></defs>
      <rect x={-26} y={-212} width={52} height={40} rx={8} fill="#3a3a3a" />
      <circle r={170} fill="url(#cr)" /><circle r={140} fill="#f4efe4" />
      <path d={`M 0 0 L 0 -140 A 140 140 0 ${ang > 180 ? 1 : 0} 1 ${Math.sin(ang * Math.PI / 180) * 140} ${-Math.cos(ang * Math.PI / 180) * 140} Z`} fill={CH.barro} opacity={0.85} />
      {Array.from({ length: 6 }, (_, i) => <text key={i} x={Math.sin(i * Math.PI / 3) * 110} y={-Math.cos(i * Math.PI / 3) * 110 + 14} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={40} fill={CH.negro}>{i}</text>)}
      <circle r={22} fill="#3a3a3a" />
    </svg>
    <div style={{ marginTop: -10, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 86, color: CH.crema, textShadow: extrude(7, "#3a1a08") }}>{Math.round(h)} HORAS</div>
  </div>;
};

// gis sobre la pared encalada: el letrero vive EN el muro 3D (se proyecta con la cámara) y se escribe solo
export const Gis: React.FC<{ t: number; at: number; out: number; a: V; b: V; text: string; size?: number }> = ({ t, at, out, a, b, text, size = 1 }) => {
  const o = 1 - e(t, out, out + 0.3), w = e(t, at, at + 1.0);
  if (w <= 0.01 || o <= 0.01) return null;
  const pa = screenOf(t, a), pb = screenOf(t, b), len = Math.hypot(pb.x - pa.x, pb.y - pa.y), ang = Math.atan2(pb.y - pa.y, pb.x - pa.x);
  return <div style={{ position: "absolute", left: pa.x, top: pa.y, width: len, opacity: o * 0.92, transformOrigin: "0 50%", transform: `translateY(-50%) rotate(${ang}rad)`, fontFamily: HAND, fontWeight: 700, fontSize: len * 0.16 * size, lineHeight: 1, color: "rgba(250,248,240,.93)", whiteSpace: "nowrap", textAlign: "center",
    clipPath: `inset(-30% ${100 - 100 * w}% -30% 0)`, textShadow: "0 0 2px rgba(255,255,255,.6), 1px 1px 0 rgba(120,110,100,.5)", mixBlendMode: "screen", filter: "url(#gisRough)" }}>
    <svg width={0} height={0} style={{ position: "absolute" }}><filter id="gisRough"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} /><feDisplacementMap in="SourceGraphic" scale={4} /></filter></svg>
    {text}
  </div>;
};

// HIERVE ✗ vs SUDA ✓: dos cortes de olla lado a lado (agua que hierve sobre la carne / vapor que la abraza sin tocarla)
export const HierveSuda: React.FC<{ t: number; a1: number; a2: number; out: number; x: number; y: number }> = ({ t, a1, a2, out, x, y }) => {
  const o = e(t, a1, a1 + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const k1 = Math.min(1.08, spr(t, a1, 1.1)), k2 = Math.min(1.08, spr(t, a2, 1.1));
  const meat = (cx: number, cy: number, col: string) => <g>{Array.from({ length: 5 }, (_, i) => <rect key={i} x={cx - 60 + i * 24} y={cy - 26 + (i % 2) * 6} width={22} height={52} rx={10} fill={col} />)}</g>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 34 }}>
    <div style={{ transform: `scale(${k1})`, textAlign: "center" }}>
      <svg width={300} height={300} viewBox="0 0 300 300" style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}>
        <path d="M 40 80 L 260 80 L 245 270 Q 150 290 55 270 Z" fill="#8f9396" /><path d="M 52 110 L 248 110 L 236 262 Q 150 280 64 262 Z" fill="#6a4a2e" opacity={0.85} />
        {meat(150, 190, "#9a8a80")}
        {Array.from({ length: 12 }, (_, i) => { const ph = (t * 1.8 + i / 12) % 1; return <circle key={i} cx={70 + (i * 37) % 160} cy={260 - ph * 150} r={5 + ph * 7} fill="none" stroke="#e6d8c4" strokeWidth={3} opacity={1 - ph} />; })}
      </svg>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 62, color: "#ff6a4a", textShadow: "0 4px 14px rgba(0,0,0,.8)" }}>HIERVE ✗</div>
    </div>
    {t >= a2 && <div style={{ transform: `scale(${k2})`, textAlign: "center" }}>
      <svg width={300} height={300} viewBox="0 0 300 300" style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}>
        <path d="M 40 60 L 260 60 L 250 270 Q 150 290 50 270 Z" fill="#b8bcc0" /><path d="M 60 240 L 240 240 L 238 262 Q 150 278 62 262 Z" fill="#7aa6c8" />
        <line x1={58} y1={196} x2={242} y2={196} stroke="#555" strokeWidth={6} strokeDasharray="10 8" />
        {meat(150, 160, "#8a2a14")}
        {Array.from({ length: 10 }, (_, i) => { const ph = (t * 0.9 + i / 10) % 1; return <circle key={i} cx={70 + (i * 41) % 160 + Math.sin(t * 2 + i) * 10} cy={232 - ph * 170} r={10 + ph * 16} fill="#fff" opacity={(1 - ph) * 0.5} />; })}
      </svg>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 62, color: "#9ad35a", textShadow: "0 4px 14px rgba(0,0,0,.8)" }}>SUDA ✓</div>
    </div>}
  </div>;
};

// sobrecito de consomé en polvo que cae girando, suelta su polvo y se tacha
export const Sobre: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const k = Math.min(1.1, spr(t, at, 0.9)), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 900 }}>
    <div style={{ transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k)) * -400}px) rotateY(${(1 - Math.min(1, k)) * 200 + 10 * Math.sin(t * 2)}deg) rotate(${-8 + 3 * Math.sin(t * 1.5)}deg)`, width: 250, height: 320, borderRadius: 10,
      background: "linear-gradient(135deg,#f2c14e,#e09a2a 60%,#b8701a)", boxShadow: "inset 0 0 0 6px rgba(255,255,255,.25), 0 30px 50px rgba(0,0,0,.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, color: CH.guinda }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 26, background: "repeating-linear-gradient(90deg,#c8801e 0 10px,#e8a83a 10px 20px)", borderRadius: "10px 10px 0 0" }} />
      <div style={{ fontSize: 34, letterSpacing: 3 }}>CONSOMÉ</div><div style={{ fontSize: 30, color: CH.negro }}>en polvo</div>
      <div style={{ marginTop: 14, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle,#fff6d0,#f2c14e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, color: CH.negro }}>sabor<br />res</div>
    </div>
    {Array.from({ length: 30 }, (_, i) => { const ph = cl01((t - at - 0.6 - (i % 10) * 0.05) / 1.2); return ph > 0 && ph < 1 ? <div key={i} style={{ position: "absolute", left: -20 + Math.sin(i * 2.3) * 40 * ph, top: 140 + ph * 260, width: 8, height: 8, borderRadius: "50%", background: "#f2d27a", opacity: 1 - ph }} /> : null; })}
    <div style={{ position: "absolute", left: -170, top: -190 }}><DrawX t={t} at={at + 0.9} x={0} y={0} w={340} h={380} /></div>
  </div>;
};
const cl01 = (x: number) => Math.max(0, Math.min(1, x));

// íconos de los siete secretos (trazo de pincel) + la fichita de barro que sale de cada jarrito
const ICON: Record<number, React.ReactNode> = {
  0: <g fill="none" stroke={CH.crema} strokeWidth={7} strokeLinecap="round"><path d="M 18 40 L 62 20" /><circle cx={14} cy={36} r={8} /><circle cx={20} cy={48} r={8} /><circle cx={64} cy={14} r={8} /><circle cx={70} cy={26} r={8} /></g>,
  1: <g fill="none" stroke={CH.crema} strokeWidth={6}><path d="M 28 30 Q 28 14 40 14 Q 52 14 52 30 L 56 70 L 24 70 Z" /><circle cx={36} cy={22} r={2} fill={CH.crema} /><circle cx={44} cy={22} r={2} fill={CH.crema} /></g>,
  2: <g fill="none" stroke="#ff6a4a" strokeWidth={7} strokeLinecap="round"><path d="M 20 24 Q 16 60 50 72 Q 70 70 62 52 Q 40 50 34 24 Z" fill="#c0281a" /><path d="M 26 22 Q 30 10 40 12" stroke="#6b8a3a" /></g>,
  3: <g fill="#6b8a3a"><path d="M 40 6 Q 62 40 46 76 L 34 76 Q 18 40 40 6 Z" /></g>,
  4: <g><ellipse cx={40} cy={56} rx={34} ry={12} fill="#3a2414" /><path d="M 30 44 Q 24 30 32 18 M 42 44 Q 36 28 46 14 M 54 44 Q 50 32 56 22" stroke={CH.crema} strokeWidth={5} fill="none" strokeLinecap="round" /></g>,
  5: <g><path d="M 12 30 L 68 30 L 62 70 Q 40 78 18 70 Z" fill="#8a3f20" /><rect x={8} y={24} width={64} height={8} rx={4} fill="#5a2a14" /><ellipse cx={40} cy={36} rx={22} ry={4} fill="#c0281a" /></g>,
  6: <g fill="none" stroke={CH.crema} strokeWidth={6} strokeLinecap="round"><circle cx={40} cy={44} r={28} /><path d="M 40 44 L 40 26 M 40 44 L 54 52" /><path d="M 32 10 L 48 10" /></g>,
};
const JLAB = ["LA CARNE", "LA SAL", "EL ADOBO", "LA PENCA", "EL HOYO", "LA OLLA", "EL RELOJ"];
export const Ficha: React.FC<{ t: number; at: number; out: number; i: number; x: number; y: number; sc?: number }> = ({ t, at, out, i, x, y, sc = 1 }) => {
  const k = Math.min(1.12, spr(t, at, 1.1)), o = e(t, at, at + 0.08) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-100%) translateY(${(1 - Math.min(1, k)) * 70}px) scale(${sc * (0.4 + 0.6 * Math.min(1, k))})`, transformOrigin: "50% 100%" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 24px 10px 14px", borderRadius: 18, background: "linear-gradient(180deg,#a3502a,#7a3418)", boxShadow: "inset 0 3px 0 rgba(255,220,180,.35), 0 18px 34px rgba(0,0,0,.55)" }}>
      <div style={{ width: 70, height: 70, borderRadius: 14, background: "rgba(40,14,6,.55)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: CH.maiz }}>{i + 1}</div>
      <svg width={64} height={64} viewBox="0 0 80 80">{ICON[i]}</svg>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: CH.crema, letterSpacing: 2, whiteSpace: "nowrap" }}>{JLAB[i]}</div>
    </div>
    <div style={{ width: 4, height: 40, margin: "0 auto", background: "rgba(246,231,200,.7)" }} />
  </div>;
};

// pesos que caen y se apilan (con su tintineo visual)
export const Pesos: React.FC<{ t: number; at: number; out: number; x: number; y: number; n?: number }> = ({ t, at, out, x, y, n = 9 }) => {
  const o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
    {Array.from({ length: n }, (_, i) => { const a = at + i * 0.09, k = Math.min(1, spr(t, a, 1.5)); if (t < a) return null;
      return <div key={i} style={{ position: "absolute", left: -70 + (i % 2) * 6, top: -i * 16 - (1 - k) * 500, width: 140, height: 42, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%,#fff0b0,#d4a82a 55%,#8a6a10)", boxShadow: "0 6px 0 #7a5a0a, 0 12px 20px rgba(0,0,0,.4)" }} />; })}
    <div style={{ position: "absolute", left: -110, top: 60, width: 220, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: CH.maiz, textShadow: extrude(6, "#5a3a08"), transform: `scale(${Math.min(1.1, spr(t, at + 0.6, 1))})` }}>EN PESOS</div>
  </div>;
};

// el salero del "coraje": se sacude, suelta sal y le salen vapores de enojo
export const Salero: React.FC<{ t: number; at: number; angry: number; out: number; x: number; y: number }> = ({ t, at, angry, out, x, y }) => {
  const k = Math.min(1.1, spr(t, at, 1)), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sh = Math.sin(t * 22) * 9 * e(t, at + 0.4, at + 0.6), an = e(t, angry, angry + 0.25);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k}) rotate(${sh}deg)` }}>
    <svg width={340} height={460} viewBox="-170 -260 340 460" style={{ filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      <path d="M -70 -120 Q -70 -190 0 -190 Q 70 -190 70 -120 Z" fill="#c9ccce" />
      {[-30, 0, 30].map((dx) => <circle key={dx} cx={dx} cy={-160} r={6} fill="#555" />)}
      <path d="M -90 -120 L 90 -120 L 80 160 Q 0 184 -80 160 Z" fill="rgba(235,240,245,.85)" stroke="#b8bcc0" strokeWidth={5} />
      <path d="M -82 0 L 82 0 L 80 160 Q 0 184 -80 160 Z" fill="#fbfbf8" />
      <text x={0} y={100} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={150} fill={CH.guinda}>2</text>
      {an > 0 && [-1, 1].map((sd) => <g key={sd} opacity={an}>{[0, 1, 2].map((j) => { const ph = (t * 1.6 + j / 3) % 1; return <path key={j} d={`M ${sd * (80 + ph * 40)} ${-210 - ph * 40} q ${sd * 14} -14 0 -28 q ${-sd * 14} -14 0 -28`} fill="none" stroke="#ff5a3a" strokeWidth={8} strokeLinecap="round" opacity={1 - ph} />; })}</g>)}
    </svg>
    {Array.from({ length: 18 }, (_, i) => { const ph = ((t - at) * 1.3 + i / 18) % 1; return t > at + 0.5 ? <div key={i} style={{ position: "absolute", left: -30 + ((i * 37) % 60), top: -170 - ph * 120, width: 6, height: 6, background: "#fff", opacity: 1 - ph }} /> : null; })}
    <div style={{ marginTop: -20, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: "#ff6a4a", letterSpacing: 4, textShadow: extrude(6, "#3a0a04"), opacity: an, transform: `scale(${Math.min(1.1, spr(t, angry, 1.2))})` }}>CORAJE</div>
  </div>;
};

// recado pegado con imán en la puerta del refri
export const Recado: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string }> = ({ t, at, out, x, y, text }) => {
  const k = Math.min(1.1, spr(t, at, 1)), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${5 - 3 * (1 - Math.min(1, k))}deg) scale(${0.7 + 0.3 * Math.min(1, k)})`, width: 470, padding: "40px 30px 30px", background: "#fff59a", boxShadow: "0 24px 40px rgba(0,0,0,.5)" }}>
    <div style={{ position: "absolute", left: "50%", top: -18, width: 52, height: 52, borderRadius: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle at 35% 35%,#ff8a7a,#c0281a)", boxShadow: "0 6px 10px rgba(0,0,0,.4)" }} />
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, lineHeight: 1.05, color: "#2a2a6a", clipPath: `inset(-20% ${100 - 100 * e(t, at + 0.2, at + 1.1)}% -20% 0)` }}>{text}</div>
  </div>;
};

// ---------------- EL MINUTO ----------------
const TBL: V = [0, TY, 0];
export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const W = (k: string, tt = t, over?: Partial<WorldProps>) => <World key={k} t={tt} over={over} />;
  const A = (i: number) => t >= AVS[i][0] && t < AVS[i][1];

  // A · 0-3,97 · avatar "mira nomás esta carne" → portal a la barbacoa de la mesa
  if (t < AVS[0][1] + 0.02) {
    L.push(<Avatar key="avA" t={t} />);
    const r = ei(t, Math.max(T.carne + 0.3, AVS[0][1] - 0.75), AVS[0][1]);
    if (r > 0) { const c = screenOf(3.6, CA); L.push(<Portal key="pA" x={c.x} y={c.y} r={r}>{W("wA", Math.max(3.4, t))}</Portal>); }
  }
  // B · 3,97-11,4 · órbita a la mesa: el trinche baja y la carne se deshace sola
  if (t >= AVS[0][1] && t < 11.45) {
    L.push(W("wB"));
    const c = screenOf(t, [CA[0] - 0.05, CA[1] + 0.06, CA[2]]);
    L.push(<Tag key="ab" t={t} at={Math.max(AVS[0][1] + 0.3, at("barbacoa") )} x={c.x} y={c.y} dx={-330} dy={-200} text="BARBACOA" sub="LA DEL ABUELO" col={CH.maiz} out={T.tenedor - 0.2} size={56} />);
    L.push(<SinCuchillo key="sc" t={t} at={T.cuchillo} out={11.0} x={1450} y={760} />);
  }
  // C · 11,4-15,34 · la penca en la lumbre (toma): "huélela, olor a penca y a leña" → la olla de presión tachada
  if (t >= 11.4 && t < AVS[1][0] + 0.02) {
    L.push(<Clip key="cC" k="k_penca" t={t} a={11.4} z={[1.1, 1.02]} />);
    L.push(<OllaPresion key="op" t={t} at={T.presion} out={AVS[1][0] - 0.1} x={1480} y={560} sc={1.35} />);
  }
  L.push(<Humareda key="h1" t={t} mid={11.42} />);
  // D · 15,34-20,25 · avatar: "siete secretos que mi abuelo me enseñó y que las taquerías no te dicen"
  if (A(1)) {
    L.push(<Avatar key="avD" t={t} />);
    L.push(<BigNum key="7a" t={t} at={Math.max(AVS[1][0] + 0.1, T.siete)} text="7" size={300} x={1420} y={420} col={CH.maiz} edge="#5a2a10" out={AVS[1][1] - 0.2} sub="SECRETOS DEL ABUELO" />);
  }
  // E · 20,25-26,6 · domingo, viene toda la familia (toma)
  if (t >= AVS[1][1] - 0.02 && t < 26.7) {
    L.push(<Clip key="cE" k="k_familia" t={t} a={AVS[1][1]} z={[1.02, 1.1]} />);
    L.push(<Tag key="dom" t={t} at={Math.max(AVS[1][1] + 0.4, at("es domingo"))} x={980} y={520} dx={420} dy={-260} text="DOMINGO" sub="VIENE TODA LA FAMILIA" col={CH.maiz} out={26.4} size={58} />);
  }
  L.push(<Humareda key="h2" t={t} mid={AVS[1][1]} w={0.4} dir={-1} />, <Humareda key="h3" t={t} mid={26.62} w={0.45} />);
  // F · 26,6-32,0 · la cocina entera: "la hago yo" → la báscula de la taquería: $500 el kilo
  if (t >= 26.6 && t < AVS[2][0] + 0.02) {
    L.push(W("wF"));
    L.push(<Tag key="yo" t={t} at={T.hagoyo} x={screenOf(t, TBL).x} y={screenOf(t, TBL).y} dx={-260} dy={-260} text="LA HAGO YO" col={CH.crema} out={T.k500 - 0.3} size={60} />);
    L.push(<Bascula key="bs" t={t} at={T.k500 - 0.6} numAt={T.k500} out={AVS[2][0] - 0.1} x={1420} y={420} />);
  }
  // G · 32,0-38,2 · avatar: "compraste 3 kilos, la echaste a la olla con agua, 4 horas" + el recuerdo de la olla hirviendo
  if (A(2)) {
    L.push(<Avatar key="avG" t={t} />);
    L.push(<Burbuja key="bu" t={t} at={T.agua - 0.3} out={AVS[2][1] - 0.25} x={1500} y={330} r={240}><Clip k="k_olla" t={t} a={T.agua - 0.3} z={[1.0, 1.06]} /></Burbuja>);
    L.push(<Contador key="ct" t={t} rows={[{ at: T.kilos3, text: "3 KILOS" }, { at: T.agua, text: "CON AGUA" }, { at: T.horas4, text: "4 HORAS" }]} out={AVS[2][1] - 0.15} x={110} y={600} />);
  }
  // H · 38,2-45,5 · el suegro mastica ×3 (toma) y pide la salsa
  const swT = T.mano - 0.9;
  if (t >= AVS[2][1] - 0.02 && t < swT + 0.55) {
    const sl = ei(t, swT, swT + 0.5), mb = Math.sin(sl * Math.PI) * 36;
    L.push(<AbsoluteFill key="hS" style={{ transform: `translateX(${-sl * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Clip k="k_suegro" t={t} a={AVS[2][1]} z={[1.02, 1.12]} /></AbsoluteFill>);
    if (sl > 0) L.push(<AbsoluteFill key="hT" style={{ transform: `translateX(${(1 - sl) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Clip k="k_tenedor" t={t} a={swT} z={[1.12, 1.03]} /></AbsoluteFill>);
    L.push(<Mastica key="ma" t={t} hits={[T.mast1, T.mast2, T.mast3]} out={T.salsa - 0.1} x={1440} y={250} />);
    L.push(<Tag key="sa" t={t} at={T.salsa} x={1400} y={800} dx={-300} dy={-260} text="LA SALSA" sub="PA' QUE LE PASE" col="#ff6a4a" out={swT} size={56} />);
  }
  L.push(<Humareda key="h4" t={t} mid={AVS[2][1]} w={0.38} />);
  // I · 45,5-49,9 · el tenedor en la mano: "¿qué hice mal?"
  if (t >= swT + 0.5 && t < AVS[3][0] + 0.02) {
    L.push(<Clip key="cI" k="k_tenedor" t={t} a={swT} z={[1.12, 1.03]} />);
    L.push(<Pregunta key="qh" t={t} at={T.quehice} out={AVS[3][0] - 0.2} x={560} y={430} text="¿qué hice mal?" />);
  }
  // J · 49,9-53,7 · avatar "si la tuve cuatro horas" → el cronómetro
  if (A(3)) {
    L.push(<Avatar key="avJ" t={t} />);
    L.push(<Cronometro key="cr" t={t} at={Math.max(AVS[3][0] + 0.1, T.cuatro - 0.2)} out={AVS[3][1] - 0.15} x={1540} y={480} />);
  }
  // K · 53,7-59 · la carne mala en la mesa: SECA · DURA · HILOS · CALDO = AGUA
  if (t >= AVS[3][1] - 0.02 && t < 59.05) {
    L.push(W("wK"));
    const c = screenOf(t, [CA[0], CA[1] + 0.08, CA[2]]), c2 = screenOf(t, [CA[0] + 0.08, CA[1] + 0.02, CA[2] + 0.06]), cs = screenOf(t, [PT.consome[0], PT.consome[1] + 0.16, PT.consome[2]]);
    L.push(<Tag key="t1" t={t} at={Math.max(AVS[3][1] + 0.1, T.seca)} x={c.x} y={c.y} dx={-380} dy={-120} text="SECA" sub="POR FUERA" col="#ff6a4a" out={58.7} size={60} />);
    L.push(<Tag key="t2" t={t} at={T.dura} x={c2.x} y={c2.y} dx={-420} dy={140} text="DURA" sub="POR DENTRO" col="#ff6a4a" out={58.7} size={60} />);
    L.push(<Tag key="t3" t={t} at={T.hilos} x={c2.x} y={c2.y} dx={300} dy={-260} text="HILOS" sub="ENTRE LOS DIENTES" col="#ff6a4a" out={58.7} size={60} />);
    L.push(<Tag key="t4" t={t} at={T.caldo} x={cs.x} y={cs.y} dx={160} dy={170} text="CALDO" sub={t > T.sabeagua ? "= AGUA" : ""} col={CH.crema} out={58.7} size={60} />);
  }
  L.push(<Humareda key="h5" t={t} mid={AVS[3][1]} w={0.36} />, <Humareda key="h6" t={t} mid={59.02} w={0.4} dir={-1} />);
  // L · 59-62,4 · esa tarde: media olla al refri (toma) + el recado "mejor la compro"
  if (t >= 59.0 && t < 63.75) {
    L.push(<Clip key="cL" k="k_refri" t={t} a={59.0} z={[1.03, 1.1]} />);
    L.push(<Recado key="rc" t={t} at={T.compro - 0.95} out={63.55} x={1420} y={400} text="la barbacoa mejor la compro…" />);
  }
  L.push(<Humareda key="h7" t={t} mid={63.72} w={0.4} />);
  // M · 62,4-67,2 · la pared encalada: NO FUISTE TÚ, en gis
  if (t >= 63.7 && t < AVS[4][0] + 0.02) {
    L.push(W("wM"));
    L.push(<Gis key="g1" t={t} at={Math.max(62.7, T.pasado)} out={T.nofuiste - 0.25} a={[-2.3, 2.0, -2.59]} b={[-1.0, 2.0, -2.59]} text="¿te ha pasado?" />);
    L.push(<Gis key="g2" t={t} at={T.nofuiste} out={AVS[4][0] - 0.1} a={[-2.4, 1.55, -2.59]} b={[-0.9, 1.55, -2.59]} text="NO FUISTE TÚ" size={1.05} />);
  }
  // N · 67,2-73 · avatar: "es porque la HIERVES. No se hierve: se SUDA"
  if (A(4)) {
    L.push(<Avatar key="avN" t={t} />);
    L.push(<div key="hs" style={{ position: "absolute", left: 1390, top: 520, transform: "scale(1.35)" }}><HierveSuda t={t} a1={T.hierves} a2={T.suda - 0.15} out={AVS[4][1] - 0.15} x={0} y={0} /></div>);
  }
  // O · 73-77,7 · madrugada en el hoyo: lo que los abuelos hacían sin hablar (la lámina se levanta, sale el vapor)
  if (t >= AVS[4][1] - 0.02 && t < 77.75) {
    L.push(W("wO"));
    const h = screenOf(t, [PT.olla[0], PT.olla[1] + 0.2, PT.olla[2]]);
    L.push(<Tag key="sh" t={t} at={74.7} x={h.x} y={h.y} dx={-380} dy={-200} text="SIN HABLAR" sub="ASÍ LO HACÍAN LOS ABUELOS" col={CH.maiz} out={76.6} size={54} />);
    const r = ei(t, 76.6, 77.7);
    if (r > 0) L.push(<Portal key="pO" x={h.x} y={h.y} r={r}><Clip k="k_hoyo" t={t} a={76.6} /></Portal>);
  }
  L.push(<Humareda key="h8" t={t} mid={AVS[4][1]} w={0.38} dir={-1} />);
  // P · 77,7-80,3 · el hoyo de verdad (toma) → Q · la taquería: olla de presión + sobre de consomé
  const presT = T.presion2 - 1.2;
  if (t >= 77.7 && t < presT + 0.02) L.push(<Clip key="cP" k="k_hoyo" t={t} a={76.6} />);
  L.push(<Humareda key="h9" t={t} mid={presT} w={0.45} />);
  if (t >= presT && t < AVS[5][0] + 0.02) {
    L.push(<Clip key="cQ" k="k_presion" t={t} a={presT} z={[1.02, 1.12]} />);
    L.push(<OllaPresion key="op2" t={t} at={T.presion2} out={T.sobre - 0.15} x={420} y={380} sc={0.85} />);
    L.push(<Sobre key="so" t={t} at={T.sobre} out={AVS[5][0] - 0.1} x={1520} y={420} />);
  }
  // R · 85,9-91,3 · avatar "y te la cobran como si hubiera pasado la noche en el hoyo… 7 secretos"
  if (A(5)) {
    L.push(<Avatar key="avR" t={t} />);
    L.push(<BigNum key="7b" t={t} at={T.siete2} text="7 SECRETOS" size={150} y={880} col={CH.maiz} edge="#5a2a10" out={AVS[5][1] - 0.1} />);
  }
  // S · 91,3-118 · los SIETE JARRITOS se encienden uno por secreto (con el avatar en medio: "el hoyo / la vaporera")
  if ((t >= AVS[5][1] - 0.02 && t < AVS[6][0] + 0.02) || (t >= AVS[6][1] - 0.02 && t < AVS[7][0] + 0.02)) {
    L.push(W("wS"));
    JARS.forEach((q, i) => { const p = screenOf(t, [q[0], TY + 0.17, q[2]]); L.push(<Ficha key={"f" + i} t={t} at={T.jar[i]} out={AVS[7][0]} i={i} x={p.x} y={p.y} sc={0.72} />); });
    L.push(<Pesos key="ps" t={t} at={T.pesos - 0.2} out={AVS[7][0] - 0.1} x={1660} y={700} />);
  }
  if (A(6)) {
    L.push(<Avatar key="avS" t={t} />);
    L.push(<Ficha key="f5a" t={t} at={Math.max(AVS[6][0] + 0.3, at("el hoyo", 100))} out={AVS[6][1] - 0.15} i={4} x={1500} y={330} />);
    L.push(<Tag key="vp" t={t} at={T.jar[4] - 2.0 > AVS[6][0] ? at("una vaporera") : AVS[6][1]} x={1500} y={360} dx={-60} dy={120} text="O UNA VAPORERA" col={CH.crema} out={AVS[6][1] - 0.15} size={48} />);
  }
  L.push(<Flash key="fl1" t={t} at={AVS[5][1]} col="#fff1cf" peak={0.45} w={0.3} />);
  // T · 118-123,8 · avatar: "el secreto número 2 le va a dar CORAJE a más de uno"
  if (A(7)) {
    L.push(<Avatar key="avT" t={t} />);
    L.push(<Salero key="sl" t={t} at={Math.max(AVS[7][0] + 0.2, T.num2 - 0.2)} angry={T.coraje} out={AVS[7][1] - 0.1} x={1520} y={470} />);
  }
  // U · 123,8-fin · la cámara se mete al jarrito 2 → la sal de la noche antes (toma)
  if (t >= AVS[7][1] - 0.02) {
    L.push(W("wU"));
    const j = screenOf(t, [JARS[1][0], TY + 0.08, JARS[1][2]]);
    L.push(<Ficha key="f2b" t={t} at={AVS[7][1] + 0.05} out={MIN1_END - 1.25} i={1} x={j.x} y={j.y - 60} sc={0.9} />);
    const r = ei(t, MIN1_END - 1.0, MIN1_END - 0.05);
    if (r > 0) L.push(<Portal key="pU" x={j.x} y={j.y} r={r}><Clip k="k_sal" t={t} a={MIN1_END - 1.0} /></Portal>);
  }

  return <AbsoluteFill style={{ background: "#0a0503" }}>{L}</AbsoluteFill>;
};
