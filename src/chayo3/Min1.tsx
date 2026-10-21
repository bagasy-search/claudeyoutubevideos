// chayo3 · MINUTO 1 (0-97 s). Un solo hilo: la cocina de adobe de Doña Chayo y su MESA DE FIESTA son el mundo; todo entra y sale
// de ahí sin cortes secos: avatar → portal a la cazuela (ojitos de grasa) → el vapor tapa la pantalla → clip → vapor → los 7 platos
// → avatar → la cámara sale al patio de la boda → la lista del súper → madrugada en el fogón (5:00) → la tía prueba → AMARGO
// → la cuchara en la mano → azúcar y el amargómetro → noche, patio vacío → la cazuela se tira → NUNCA MÁS → avatar
// → el ORDEN (platos) y el FUEGO (fogón) → el recetario de mamá Cuca se abre → portal desde la página a la fonda → frasco/agua/azúcar
// → avatar "$200 el plato" → vista cenital: 7 SECRETOS. Todo clavado a la voz con at("frase"). Audio fuera de Remotion.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, PLATES, screenOf, camSpeed, setKeys, win } from "./cocina3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, CH, DrawX, Flash, FONT, HAND, P, Portal, SERIF, Tag, at, atEnd, e, ei, extrude, s, spr } from "./lib";

const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
type Win = { ms: number; me: number; off: number };
const WIN: Win[] = ((AVW as { win: Win[] }).win).filter((w) => w.ms < 100);
export const MIN1_END = 97;
export const MIN1_FRAMES = s(MIN1_END);

// ---------------- tiempos clavados a la voz ----------------
const T = {
  cazuela: at("esta cazuela"), brilla: at("como brilla"), ojitos: at("ojitos"), huele: at("huelelo"), frasco: at("ningun frasco"),
  siete: at("siete cosas"), boda: at("la boda"), mole1: at("hacer el mole"), compraste: at("compraste todo"), cinco: at("a las cinco"),
  seis: at("seis horas"), tia: at("tu tia"), tortilla: at("la tortilla"), amargo: at("amargo amargo"), medicina: at("como medicina"),
  cuchara: at("la cuchara"), quehice: at("que hice mal"), chiles: at("los chiles"), choco: at("el chocolate"), azu1: at("puse azucar"),
  azu2: at("mas azucar"), peor: at("peor sabia"), noche: at("esa noche"), tiraste: at("tiraste"), media: at("media olla"), nunca: at("nunca", 65),
  orden: at("el orden"), fuego: at("el fuego"), abuelas: at("las abuelas"), sinhablar: at("sin hablar"), fondas: at("las fondas de ahora"),
  frasco2: at("un frasco de pasta"), agua: at("echan agua"), azu3: at("y azucar", 85), d200: at("200"), siete2: at("siete secretos"),
};
const AVS = WIN.map((w) => [w.ms, w.me] as [number, number]);
const inAv = (t: number) => AVS.some(([a, b]) => t >= a && t < b);

// ---------------- cámara del minuto 1 (una sola, sin cortes; las entradas/salidas son portales y vapor) ----------------
const TBL = [0, 0.8, 0] as [number, number, number];
const CZ = PT.cazuela;
setKeys([
  { t: 0, p: [0.9, 1.5, 1.25], l: CZ, fov: 36 },
  { t: 4.4, p: [0.85, 1.48, 1.2], l: CZ, fov: 36 },
  { t: 8.2, p: [-0.95, 1.5, 1.05], l: CZ, fov: 36, arc: 0.12 },                 // órbita alrededor de la mesa
  { t: 10.9, p: [0.04, 1.42, 0.18], l: [0, 0.95, -0.17], fov: 34 },             // se zambulle a la superficie del mole
  { t: 11.9, p: [0.02, 1.15, -0.07], l: [0, 0.95, -0.17], fov: 32 },            // (el vapor ya tapa)
  { t: 15.4, p: [0.0, 4.3, 1.05], l: [0, 0.8, 0.12], fov: 40 },                // cenital: los siete platos
  { t: 17.8, p: [0.0, 4.1, 0.95], l: [0, 0.8, 0.12], fov: 40 },
  { t: 23.6, p: [1.4, 1.55, 2.3], l: [4, 1.4, 0.2], fov: 40 },                 // (detrás del avatar) mira al lado abierto
  { t: 26.2, p: [1.5, 1.52, 0.52], l: [0.88, 0.82, -0.3], fov: 37 },          // (la boda va en foto) espera en la mesa
  { t: 29.1, p: [1.45, 1.5, 0.48], l: [0.88, 0.82, -0.3], fov: 37 },
  { t: 30.0, p: [1.35, 1.45, 0.42], l: [0.88, 0.82, -0.3], fov: 36, arc: 0.4 },// vuelve a la mesa: la lista del súper
  { t: 30.9, p: [1.25, 1.42, 0.35], l: [0.88, 0.82, -0.3], fov: 36 },
  { t: 32.0, p: [-0.55, 1.4, -0.75], l: [-1.3, 0.95, -2.4], fov: 38 },          // madrugada: el fogón
  { t: 34.6, p: [-0.6, 1.35, -0.9], l: [-1.3, 0.95, -2.4], fov: 38 },
  { t: 56.15, p: [0.75, 1.4, 0.75], l: CZ, fov: 34 },                           // azúcar a la cazuela
  { t: 60.4, p: [0.55, 1.32, 0.6], l: CZ, fov: 33 },
  { t: 61.6, p: [0.5, 1.3, 0.55], l: CZ, fov: 33 },                            // (el patio de noche va en foto)
  { t: 74.8, p: [1.9, 1.95, 2.7], l: [-0.6, 0.8, -1.3], fov: 42 },             // el orden (platos) y el fuego (fogón)
  { t: 77.0, p: [1.5, 1.9, 2.4], l: [-0.8, 0.8, -1.6], fov: 42 },
  { t: 78.4, p: [1.12, 1.42, 0.28], l: [0.88, 0.82, -0.3], fov: 34, arc: 0.15 },// el recetario de mamá Cuca
  { t: 81.6, p: [1.0, 1.2, 0.02], l: [0.88, 0.82, -0.3], fov: 30 },
  { t: 92.7, p: [0.0, 4.4, 1.1], l: [0, 0.8, 0.12], fov: 40 },                 // cenital: siete secretos
  { t: 97, p: [0.0, 3.6, 0.95], l: [0, 0.8, 0.12], fov: 40 },
]);

// ---------------- estado del mundo por segundo ----------------
const worldAt = (t: number): WorldProps => {
  const dawn = win(t, 30.4, 31.6) * (1 - win(t, 34.2, 35.0));
  const night = Math.max(win(t, 23.0, 24.0) * 0.7 * (1 - win(t, 29.2, 30.0)), win(t, 60.6, 61.8) * (1 - win(t, 70, 72)));
  const plateOn = PLATES.map((_, i) => {
    const a = Math.max(15.45, T.siete) + i * 0.22, b = 92.75 + i * 0.18;
    return Math.max(win(t, a, a + 0.25) * (1 - win(t, 17.6, 18)), win(t, b, b + 0.25), win(t, T.orden + i * 0.12, T.orden + i * 0.12 + 0.2) * (1 - win(t, T.fuego, T.fuego + 0.3)));
  });
  return {
    t, night, dawn,
    fire: 1 + 1.4 * win(t, T.fuego, T.fuego + 0.3) * (1 - win(t, 76.6, 77.2)) - 0.5 * night,
    steamCaz: (t >= 15.3 && t < 18) || t >= 92.6 ? 0.25 : t > 9 && t < 12 ? 0.5 : 1, ojitos: 0.35 + 0.65 * win(t, T.ojitos - 0.4, T.ojitos + 0.4),
    plateOn, plateServed: PLATES.map(() => 0), plateSteam: PLATES.map(() => 0),
    // la mesa puesta con comida hasta la fonda (81,8); en la cenital de los 7 secretos los platos ya esperan vacíos, uno por secreto
    plateFill: PLATES.map(() => (t < 82 ? 1 : 0)),
    sugar: win(t, T.azu1 - 0.1, T.azu1 + 0.2) * (1 - win(t, 60.0, 60.4)),
    pour: 0,
    patioLights: win(t, 23.0, 24.0) * (1 - win(t, 29.5, 30)) + win(t, 60.6, 61.5) * 0.8 * (1 - win(t, 68, 69)),
    partyPeople: 0,
    book: { open: ei(t, 78.0, 79.6), flip: 0, pages: RECETARIO },
    top: (t >= 15.3 && t < 18) || t >= 92.6 ? 1 : 0,
  };
};
const RECETARIO = [{
  l: ["# Mole de Fiesta", "de mi mamá Cuca", "", "Pa' 20 platos.", "Nadie entra a la cocina", "enojado.", "", "— Refugio, 1961"],
  r: ["chiles uno por uno,", "contando...", "cada cosa frita aparte", "el agua del remojo NO", "las especias enteras", "colar dos veces", "freír hasta los ojitos", "y de un día pa' otro"],
}];

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

// ---------------- PIEZAS NUEVAS del minuto 1 ----------------
// el vapor de la cazuela tapa la pantalla (transición caliente, ida y vuelta)
export const SteamWipe: React.FC<{ t: number; mid: number; w?: number }> = ({ t, mid, w = 0.55 }) => {
  const k = 1 - Math.min(1, Math.abs(t - mid) / w);
  if (k <= 0.01) return null;
  const blobs = Array.from({ length: 14 }, (_, i) => {
    const x = (i * 137) % 1920, y = 1100 - ((t - mid + w) / (2 * w)) * (900 + (i % 5) * 120) + (i % 3) * 140;
    const r = 420 + (i % 4) * 120;
    return `radial-gradient(circle ${r}px at ${x}px ${y}px, rgba(255,248,236,${0.75 * k}) 0%, rgba(255,248,236,0) 70%)`;
  });
  return <AbsoluteFill style={{ background: blobs.join(","), opacity: Math.min(1, k * 1.6), filter: "blur(18px)" }}><AbsoluteFill style={{ background: `rgba(255,246,232,${0.85 * Math.pow(k, 1.6)})` }} /></AbsoluteFill>;
};

// remolino de aroma: hilos de humo dibujados que suben y se enroscan
export const Aroma: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = e(t, at, at + 0.3) * (1 - e(t, out, out + 0.4));
  if (o <= 0.01) return null;
  const d = (k: number) => { let p = `M ${x + (k - 1) * 60} ${y}`; for (let i = 1; i <= 14; i++) { const yy = y - i * 34, xx = x + (k - 1) * 60 + Math.sin(i * 0.7 + t * 2 + k) * (20 + i * 4); p += ` L ${xx.toFixed(1)} ${yy.toFixed(1)}`; } return p; };
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    {[0, 1, 2].map((k) => <path key={k} d={d(k)} fill="none" stroke="rgba(255,240,215,.75)" strokeWidth={7 - k} strokeLinecap="round" strokeDasharray="1400" strokeDashoffset={1400 * (1 - e(t, at + k * 0.12, at + 1.1 + k * 0.12))} style={{ filter: "blur(2.5px) drop-shadow(0 0 12px rgba(255,220,170,.8))" }} />)}
  </svg>;
};

// frasco de pasta comercial (2.5D) que se tacha
export const Frasco: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const k = Math.min(1.1, spr(t, at, 1.1)), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1000 }}>
    <div style={{ transform: `translate(-50%,-50%) rotateY(${(1 - Math.min(1, k)) * -60 - 12 + 4 * Math.sin(t)}deg) scale(${0.6 + 0.4 * Math.min(1, k)})`, width: 230, height: 300 }}>
      <div style={{ position: "absolute", left: 30, top: 0, width: 170, height: 46, borderRadius: 10, background: "linear-gradient(90deg,#8a1d1d,#d23a2a 45%,#7a1414)" }} />
      <div style={{ position: "absolute", left: 10, top: 40, width: 210, height: 260, borderRadius: "28px 28px 36px 36px", background: "linear-gradient(90deg,#2b0f08,#5a2412 40%,#3a1609 70%,#1c0904)", boxShadow: "inset 10px 0 20px rgba(255,255,255,.12), 0 30px 60px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 22, top: 120, width: 186, height: 90, borderRadius: 8, background: "#f2c14e", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#7a1f2b", letterSpacing: 2 }}>PASTA<br />LISTA</div>
    </div>
    <div style={{ position: "absolute", left: -150, top: -170 }}><DrawX t={t} at={at + 0.45} x={0} y={0} w={300} h={340} /></div>
  </div>;
};

// número extruido de barro que sale de cada plato (los 7)
export const PlateNums: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => <>{PLATES.map((q, i) => {
  const p = screenOf(t, [q[0], q[1] + 0.05, q[2]]), at0 = a + i * 0.22, k = Math.min(1.15, spr(t, at0, 1.2)), o = e(t, at0, at0 + 0.08) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div key={i} style={{ position: "absolute", left: p.x, top: p.y - 70 * k, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: CH.maiz, textShadow: extrude(8, "#5a2a10") }}>{i + 1}</div>;
})}</>;

// tarjetita escrita a mano (papel de cuaderno)
export const Nota: React.FC<{ t: number; at: number; out: number; x: number; y: number; lines: string[]; rot?: number; w?: number }> = ({ t, at, out, x, y, lines, rot = -4, w = 420 }) => {
  const k = Math.min(1.1, spr(t, at, 0.9)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200 }}>
    <div style={{ transform: `translate(-50%,-50%) rotateX(${(1 - Math.min(1, k)) * 60}deg) rotate(${rot + 1.2 * Math.sin(t * 1.3)}deg)`, width: w, padding: "26px 34px 30px", background: `repeating-linear-gradient(180deg, transparent 0 55px, rgba(90,110,150,.22) 55px 57px), linear-gradient(180deg, ${CH.papel}, #e4d1a6)`, borderRadius: 6,
      boxShadow: "0 30px 60px rgba(0,0,0,.55), inset 0 0 40px rgba(140,95,40,.18)" }}>
      <div style={{ position: "absolute", left: "50%", top: -14, width: 90, height: 28, transform: "translateX(-50%) rotate(-3deg)", background: "rgba(240,230,200,.7)", boxShadow: "0 2px 6px rgba(0,0,0,.2)" }} />
      {lines.map((ln, i) => <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: i === 0 ? 62 : 50, lineHeight: "57px", color: CH.tinta, clipPath: `inset(0 ${100 - 100 * e(t, at + 0.15 + i * 0.25, at + 0.55 + i * 0.25)}% 0 0)` }}>{ln}</div>)}
    </div>
  </div>;
};

// lista del súper de Chayo: renglones con precio que se tachan uno por uno
export const Lista: React.FC<{ t: number; at: number; out: number; x: number; y: number; rows: [string, number][]; dt?: number }> = ({ t, at, out, x, y, rows, dt = 0.16 }) => {
  const k = Math.min(1.1, spr(t, at, 1.1)), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200 }}>
    <div style={{ transform: `translate(-50%,-50%) rotateY(${(1 - Math.min(1, k)) * 50 - 6}deg) rotate(3deg)`, width: 470, padding: "24px 34px", background: `linear-gradient(180deg, #f6ecd4, #e6d4ab)`, boxShadow: "0 30px 60px rgba(0,0,0,.55)", borderRadius: 4 }}>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: CH.guinda }}>Pa'l mole</div>
      {rows.map(([it, $], i) => { const tk = e(t, at + 0.15 + i * dt, at + 0.3 + i * dt); return (
        <div key={i} style={{ position: "relative", display: "flex", justifyContent: "space-between", fontFamily: HAND, fontWeight: 500, fontSize: 46, lineHeight: "54px", color: CH.tinta }}>
          <span>{it}</span><span>${$}</span>
          <div style={{ position: "absolute", left: -6, top: 28, height: 4, width: `${104 * tk}%`, background: CH.guinda, borderRadius: 2, transform: "rotate(-1.5deg)" }} />
        </div>); })}
    </div>
  </div>;
};

// reloj de pared de la cocina: 5:00 y luego las manecillas corren seis horas
export const Reloj: React.FC<{ t: number; at: number; spin: number; out: number; x: number; y: number }> = ({ t, at, spin, out, x, y }) => {
  const k = Math.min(1.1, spr(t, at, 1)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const hrs = 5 + 6 * ei(t, spin, spin + 2.2), hA = (hrs % 12) * 30, mA = (hrs * 360) % 360;
  const lab = `${Math.floor(hrs)}:${String(Math.floor((hrs % 1) * 60)).padStart(2, "0")}`;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})` }}>
    <svg width={360} height={360} viewBox="-180 -180 360 360" style={{ filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      <circle r={170} fill="#7a3a1f" /><circle r={150} fill="#f3e6c8" />
      {Array.from({ length: 12 }, (_, i) => <text key={i} x={Math.sin(i * Math.PI / 6) * 118} y={-Math.cos(i * Math.PI / 6) * 118 + 14} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={36} fill={CH.tinta}>{i || 12}</text>)}
      <line x1={0} y1={0} x2={Math.sin(hA * Math.PI / 180) * 70} y2={-Math.cos(hA * Math.PI / 180) * 70} stroke={CH.tinta} strokeWidth={12} strokeLinecap="round" />
      <line x1={0} y1={0} x2={Math.sin(mA * Math.PI / 180) * 110} y2={-Math.cos(mA * Math.PI / 180) * 110} stroke={CH.guinda} strokeWidth={7} strokeLinecap="round" />
      <circle r={10} fill={CH.tinta} />
    </svg>
    <div style={{ textAlign: "center", marginTop: 6, fontFamily: SERIF, fontWeight: 900, fontSize: 74, color: CH.crema, textShadow: extrude(7, "#3a1a08") }}>{lab} <span style={{ fontSize: 40 }}>{hrs < 12 ? "a.m." : "p.m."}</span></div>
  </div>;
};

// letra a mano que se escribe sola (el pensamiento de la que cocinó)
export const Pensado: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; size?: number; col?: string }> = ({ t, at, out, x, y, text, size = 110, col = CH.crema }) => {
  const o = 1 - e(t, out, out + 0.3), w = e(t, at, at + 1.1);
  if (w <= 0.01 || o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(-4deg)`, fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - 100 * w}% -20% 0)`, textShadow: "0 6px 20px rgba(0,0,0,.75)" }}>{text}</div>;
};

// palomitas sobre el avatar ("le puse los chiles ✓")
export const Palomita: React.FC<{ t: number; at: number; out: number; y: number; text: string }> = ({ t, at, out, y, text }) => {
  const k = Math.min(1.1, spr(t, at, 1.1)), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", right: 110, top: y, opacity: o, transform: `translateX(${(1 - Math.min(1, k)) * 160}px)`, display: "flex", alignItems: "center", gap: 20, padding: "14px 30px", borderRadius: 16, background: "rgba(42,18,12,.88)", boxShadow: `0 20px 40px rgba(0,0,0,.5), inset 0 0 0 3px ${CH.maiz}88` }}>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: CH.crema }}>{text}</div>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 72, color: "#9ad35a", transform: `scale(${e(t, at + 0.25, at + 0.4)})` }}>✓</div>
  </div>;
};

// amargómetro: medidor de barro con aguja que sube con cada cucharada de azúcar
export const Amargometro: React.FC<{ t: number; at: number; steps: number[]; out: number; x: number; y: number; peorAt: number }> = ({ t, at, steps, out, x, y, peorAt }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const v = 0.35 + steps.reduce((acc, s0) => acc + 0.22 * Math.min(1.08, spr(t, s0, 1.1)), 0) + 0.1 * spr(t, peorAt, 1);
  const ang = -90 + 180 * Math.min(1.02, v);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
    <svg width={460} height={290} viewBox="-230 -240 460 290" style={{ filter: "drop-shadow(0 24px 40px rgba(0,0,0,.6))" }}>
      <path d="M -200 0 A 200 200 0 0 1 200 0 L 160 0 A 160 160 0 0 0 -160 0 Z" fill="#3a1a0c" />
      {Array.from({ length: 30 }, (_, i) => { const a = Math.PI * (1 - i / 29); const c = i < 10 ? "#9ad35a" : i < 20 ? CH.maiz : "#d8402c"; return <path key={i} d={`M ${Math.cos(a) * 196} ${-Math.sin(a) * 196} L ${Math.cos(a) * 166} ${-Math.sin(a) * 166}`} stroke={c} strokeWidth={12} />; })}
      <line x1={0} y1={0} x2={Math.sin(ang * Math.PI / 180) * 175} y2={-Math.cos(ang * Math.PI / 180) * 175} stroke={CH.crema} strokeWidth={9} strokeLinecap="round" />
      <circle r={20} fill={CH.crema} />
      <text x={0} y={42} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={40} fill={CH.crema} letterSpacing={4}>AMARGO</text>
    </svg>
  </div>;
};

// sello de barro que cae
export const Stamp: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; col?: string }> = ({ t, at, text, x, y, out = 1e9, rot = -8, size = 120, col = "#d8402c" }) => {
  const k = spr(t, at, 1.3), o = e(t, at, at + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
    <div style={{ border: `10px solid ${col}`, borderRadius: 16, padding: "4px 34px", fontFamily: SERIF, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(20,0,0,.25)", whiteSpace: "nowrap", textShadow: "0 4px 10px rgba(0,0,0,.6)" }}>{text}</div>
  </div>;
};

// etiqueta de precio colgada de un hilo que se mece
export const Precio: React.FC<{ t: number; at: number; out: number; x: number; y: number; top: string; sub: string }> = ({ t, at, out, x, y, top, sub }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sw = (1 - Math.min(1, k)) * 28 + 5 * Math.sin((t - at) * 3) * Math.exp(-(t - at) * 0.8);
  return <div style={{ position: "absolute", left: x, top: -20, opacity: o, transformOrigin: "50% 0", transform: `rotate(${sw}deg) translateY(${(1 - Math.min(1, k)) * -300}px)` }}>
    <div style={{ width: 4, height: y, margin: "0 auto", background: "#d9c7a0" }} />
    <div style={{ position: "relative", padding: "26px 44px 22px 70px", background: CH.maiz, clipPath: "polygon(16% 0, 100% 0, 100% 100%, 16% 100%, 0 50%)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 30, top: "50%", width: 22, height: 22, borderRadius: "50%", background: "#2a120c", transform: "translateY(-50%)" }} />
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 108, color: CH.guinda, lineHeight: 1 }}>{top}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 38, color: CH.negro, letterSpacing: 3 }}>{sub}</div>
    </div>
  </div>;
};

// letrero de la fonda pintado a mano + tachaduras
export const Pill: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; col?: string }> = ({ t, at, out, x, y, text, col = "#d8402c" }) => {
  const k = Math.min(1.12, spr(t, at, 1.2)), o = e(t, at, at + 0.08) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k}) rotate(-3deg)`, padding: "10px 34px", borderRadius: 12, background: "rgba(25,10,6,.86)", border: `4px solid ${col}`, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: CH.crema, letterSpacing: 3, boxShadow: "0 18px 40px rgba(0,0,0,.55)" }}>
    {text}<div style={{ position: "absolute", left: "6%", top: "52%", height: 7, width: `${88 * e(t, at + 0.4, at + 0.6)}%`, background: col, transform: "rotate(-4deg)", borderRadius: 3 }} /></div>;
};

// ---------------- EL MINUTO ----------------
export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const W = (k: string, tt = t, over?: Partial<WorldProps>) => <World key={k} t={tt} over={over} />;

  // A · 0-4,6 · avatar "mira nomás esta cazuela" → portal a la cazuela de la mesa
  if (t < 4.62) {
    L.push(<Avatar key="avA" t={t} />);
    const r = ei(t, T.cazuela + 0.45, 4.58);
    if (r > 0) { const c = screenOf(4.5, CZ); L.push(<Portal key="pA" x={c.x} y={c.y} r={r}>{W("wA", Math.max(4.2, t))}</Portal>); }
  }
  // B · 4,6-12,4 · órbita y zambullida a la superficie: los ojitos
  if (t >= 4.58 && t < 12.4) {
    L.push(W("wB"));
    const c = screenOf(t, [CZ[0] + 0.08, CZ[1] + 0.01, CZ[2] + 0.06]);
    L.push(<Tag key="br" t={t} at={T.brilla} x={c.x} y={c.y} dx={-300} dy={-170} text="CÓMO BRILLA" col={CH.maiz} out={T.ojitos - 0.3} size={50} />);
    L.push(<Tag key="oj" t={t} at={T.ojitos} x={c.x + 40} y={c.y - 10} dx={260} dy={-160} text="LOS OJITOS" sub="DE GRASA" col={CH.maiz} out={11.6} size={56} />);
  }
  // C · 12,0-15,7 · clip: la cazuela de cerca, "y huélelo" (aroma) → el frasco tachado
  if (t >= 11.9 && t < 15.75) {
    L.push(<Clip key="c1" k="h_cazuela" t={t} a={11.9} z={[1.08, 1.02]} />);
    L.push(<Aroma key="ar" t={t} at={Math.max(12.1, T.huele)} out={15.3} x={960} y={720} />);
    L.push(<Frasco key="fr" t={t} at={T.frasco} out={15.4} x={1500} y={560} />);
  }
  // D · 15,6-17,9 · vista cenital: los siete platos se encienden con su número
  if (t >= 15.55 && t < 18.0) {
    L.push(W("wD"));
    L.push(<PlateNums key="pn" t={t} a={Math.max(15.6, T.siete)} out={17.6} />);
  }
  L.push(<SteamWipe key="sw1" t={t} mid={11.95} />, <SteamWipe key="sw2" t={t} mid={15.62} w={0.4} />);
  // E · 17,8-24,0 · avatar
  if (t >= AVS[1][0] && t < AVS[1][1]) L.push(<Avatar key="avE" t={t} />);
  if (t >= AVS[1][0] && t < AVS[1][1]) L.push(<Stamp key="ff" t={t} at={at("ya no hacen")} text="LAS FONDAS YA NO" x={1380} y={860} out={21.0} rot={-5} size={72} col={CH.maiz} />);
  // F · 24,0-29,2 · la boda de tu sobrina: el patio de verdad (foto) → la mesa ya servida (desliza)
  if (t >= 24.0 && t < 29.25) {
    const sl = ei(t, 26.3, 26.8), mb = Math.sin(sl * Math.PI) * 36;
    L.push(<AbsoluteFill key="fF" style={{ transform: `translateX(${-sl * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Clip k="h_fiesta" t={t} a={24.0} /></AbsoluteFill>);
    if (sl > 0) L.push(<AbsoluteFill key="fB" style={{ transform: `translateX(${(1 - sl) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Clip k="h_boda" t={t} a={26.3} /></AbsoluteFill>);
    L.push(<Nota key="nb" t={t} at={T.mole1} out={29.0} x={1480} y={330} lines={["La boda de Lupita", "Mole: yo ♥"]} />);
  }
  L.push(<SteamWipe key="swF" t={t} mid={29.22} w={0.35} />);
  // G · 29,2-30,9 · la lista del súper sobre la mesa (se tacha todo)
  if (t >= 29.2 && t < 31.9) {
    L.push(W("wG"));
    L.push(<Lista key="ls" t={t} at={Math.max(29.25, T.compraste - 0.1)} out={31.0} x={560} y={470} rows={[["chiles", 210], ["manteca", 70], ["chocolate", 55], ["guajolote", 660]]} dt={0.18} />);
  }
  // H · 30,9-34,6 · madrugada: el fogón a oscuras, 5:00 → clip de las 5 am → seis horas parada
  if (t >= 31.8 && t < 34.65) {
    const r = ei(t, 32.2, 32.8);
    L.push(W("wH"));
    if (r > 0) { const c = screenOf(t, PT.comal); L.push(<Portal key="pH" x={c.x} y={c.y} r={r}><Clip k="h_5am" t={t} a={32.2} /></Portal>); }
  }
  if (t >= 30.8 && t < 34.65) L.push(<Reloj key="rl" t={t} at={T.cinco} spin={T.seis} out={34.4} x={1560} y={330} />);
  // I · 34,6-40,2 · avatar
  if (t >= AVS[2][0] && t < AVS[2][1]) L.push(<Avatar key="avI" t={t} />);
  // J · 40,2-47,4 · la tía prueba (clip) → AMARGO como medicina
  if (t >= AVS[2][1] && t < 47.45) {
    L.push(<Clip key="ct" k="h_tia2" t={t} a={AVS[2][1]} z={[1.02, 1.12]} />);
    L.push(<Tag key="tt" t={t} at={Math.max(AVS[2][1] + 0.1, T.tortilla)} x={760} y={620} dx={-260} dy={-180} text="LA TORTILLA" sub="PA' QUITARSE EL SABOR" col={CH.maiz} out={T.amargo - 0.2} size={46} />);
    L.push(<AbsoluteFill key="dk" style={{ background: "rgba(10,4,2,.5)", opacity: e(t, T.amargo - 0.1, T.amargo + 0.2) }} />);
    L.push(<BigNum key="am" t={t} at={T.amargo} text="AMARGO" size={250} col={CH.crema} edge="#4a1a0c" out={47.2} sub={t > T.medicina ? "COMO MEDICINA" : undefined} />);
  }
  // K · 47,4-52,8 · la cuchara en la mano: "¿qué hice mal?"
  if (t >= 47.4 && t < AVS[3][0] + 0.02) {
    L.push(<Clip key="cc" k="h_cuchara" t={t} a={47.4} z={[1.12, 1.03]} />);
    L.push(<Pensado key="qh" t={t} at={T.quehice} out={AVS[3][0] - 0.25} x={1300} y={300} text="¿qué hice mal?" />);
  }
  L.push(<SteamWipe key="sw3" t={t} mid={47.42} w={0.35} />);
  // L · 52,8-56,2 · avatar "le puse los chiles, le puse el chocolate"
  if (t >= AVS[3][0] && t < AVS[3][1]) {
    L.push(<Avatar key="avL" t={t} />);
    L.push(<Palomita key="p1" t={t} at={T.chiles} out={AVS[3][1] - 0.1} y={260} text="LOS CHILES" />);
    L.push(<Palomita key="p2" t={t} at={T.choco} out={AVS[3][1] - 0.1} y={400} text="EL CHOCOLATE" />);
  }
  // M · 56,2-60,6 · el azúcar cae en la cazuela y el amargómetro sube
  if (t >= AVS[3][1] && t < 61.8) {
    L.push(W("wM"));
    L.push(<Amargometro key="amg" t={t} at={AVS[3][1] + 0.1} steps={[T.azu1, T.azu2]} peorAt={T.peor} out={60.9} x={1520} y={360} />);
    L.push(<Pill key="pe" t={t} at={T.peor} out={60.9} x={1520} y={600} text="PEOR" />);
  }
  // N · 61,8-64,3 · esa noche, el patio vacío (foto) → portal: tiras media olla
  if (t >= 61.8 && t < 64.75) {
    L.push(<Clip key="cN" k="h_noche" t={t} a={61.8} z={[1.04, 1.1]} />);
    const r = ei(t, Math.max(63.4, T.tiraste - 0.6), Math.max(64.0, T.tiraste));
    if (r > 0) L.push(<Portal key="pN" x={1010} y={560} r={r}><Clip k="h_tirar2" t={t} a={63.4} /></Portal>);
  }
  L.push(<SteamWipe key="swN" t={t} mid={61.8} w={0.35} />);
  // O · 64,3-68,6 · media olla a la cubeta: NUNCA MÁS
  if (t >= 64.0 && t < AVS[4][0] + 0.02) {
    L.push(<Clip key="cO" k="h_tirar2" t={t} a={63.4} />);
    L.push(<Stamp key="nm" t={t} at={T.nunca} text="NUNCA MÁS" x={1300} y={300} out={AVS[4][0] - 0.1} rot={-7} />);
  }
  // P · 68,6-74,8 · avatar "pos no fuiste tú, mija"
  if (t >= AVS[4][0] && t < AVS[4][1]) L.push(<Avatar key="avP" t={t} />);
  if (t >= AVS[4][0] && t < AVS[4][1]) L.push(<Nota key="nf" t={t} at={at("no fuiste tu")} out={AVS[4][1] - 0.2} x={1500} y={250} rot={4} w={460} lines={["No fuiste tú, mija."]} />);
  // Q · 74,8-77,4 · el ORDEN (platos) y el FUEGO (fogón)
  if (t >= AVS[4][1] && t < 78.5) {
    L.push(W("wQ"));
    const pl = screenOf(t, PLATES[3]), fg = screenOf(t, PT.fire);
    L.push(<Tag key="or" t={t} at={Math.max(AVS[4][1] + 0.05, T.orden)} x={pl.x} y={pl.y} dx={180} dy={-200} text="EL ORDEN" col={CH.maiz} out={77.6} size={58} />);
    L.push(<Tag key="fu" t={t} at={Math.max(AVS[4][1] + 0.35, T.fuego)} x={fg.x} y={fg.y} dx={-200} dy={-220} text="EL FUEGO" col="#ff8a3a" out={77.6} size={58} />);
  }
  // R · 77,4-81,4 · el recetario de mamá Cuca se abre (lo que las abuelas hacían sin hablar)
  if (t >= 77.4 && t < 81.9) {
    L.push(W("wR"));
    const b = screenOf(t, [0.82, 0.86, -0.4]);
    L.push(<Tag key="rc" t={t} at={79.1} x={b.x} y={b.y} dx={-320} dy={-200} text="EL RECETARIO" sub="DE MAMÁ CUCA" col={CH.maiz} out={81.2} size={50} />);
    const r = ei(t, 81.15, 81.85);
    if (r > 0) { const pg = screenOf(t, [0.98, 0.84, -0.3]); L.push(<Portal key="pR" x={pg.x} y={pg.y} r={r}><Clip k="h_fonda_plato2" t={t} a={81.15} /></Portal>); }
  }
  // S · 81,8-88,0 · la fonda de ahora: frasco, agua y azúcar
  if (t >= 81.8 && t < AVS[5][0] + 0.02) {
    const sl = ei(t, 84.1, 84.6), mb = Math.sin(sl * Math.PI) * 36;
    L.push(<AbsoluteFill key="fp" style={{ transform: `translateX(${-sl * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Clip k="h_fonda_plato2" t={t} a={81.15} /></AbsoluteFill>);
    if (sl > 0) L.push(<AbsoluteFill key="fo" style={{ transform: `translateX(${(1 - sl) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Clip k="h_fonda" t={t} a={84.1} /></AbsoluteFill>);
    L.push(<Pill key="f1" t={t} at={T.frasco2} out={AVS[5][0] - 0.1} x={440} y={260} text="FRASCO" />);
    L.push(<Pill key="f2" t={t} at={T.agua} out={AVS[5][0] - 0.1} x={960} y={200} text="AGUA" />);
    L.push(<Pill key="f3" t={t} at={T.azu3} out={AVS[5][0] - 0.1} x={1480} y={260} text="AZÚCAR" />);
  }
  // T · 88,0-92,7 · avatar: "y te lo cobran a 200 pesos el plato"
  if (t >= AVS[5][0] && t < AVS[5][1]) {
    L.push(<Avatar key="avT" t={t} />);
    L.push(<Precio key="pr" t={t} at={T.d200} out={AVS[5][1] - 0.15} x={1420} y={150} top="$200" sub="EL PLATO" />);
  }
  // U · 92,7-97 · cenital: los siete platos → 7 SECRETOS
  if (t >= AVS[5][1]) {
    L.push(W("wU"));
    L.push(<PlateNums key="pn2" t={t} a={92.8} out={95.2} />);
    L.push(<BigNum key="7s" t={t} at={T.siete2} text="7 SECRETOS" size={170} y={900} col={CH.maiz} edge="#5a2a10" sub="QUE LAS FONDAS YA NO USAN" />);
  }
  L.push(<Flash key="fl1" t={t} at={AVS[5][1]} col="#fff1cf" peak={0.5} w={0.3} />);

  return <AbsoluteFill style={{ background: "#0a0503" }}>{L}</AbsoluteFill>;
};
