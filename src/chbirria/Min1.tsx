// chbirria · MINUTO 1 (0-114,9 s). Un solo hilo: la cocina de adobe de Doña Chayo, su fogón y la OLLA DE BIRRIA de la mesa son el mundo;
// todo entra y sale de ahí sin cortes secos: avatar "mira nomás esta olla" → portal a la toma real (la cuchara levanta la carne y se deshace)
// → avatar → la olla 3D: "ninguna olla mágica" → cenital: los 7 platos → LAS FONDAS NO TE LO DICEN → vapor → domingo temprano (5:00)
// → avatar "dos kilos y medio" → el fogón de madrugada, el reloj corre → la familia se sienta → la suegra prueba → avatar "ni dice nada"
// → le echa salsa y le echa → cenital: los platos → PÁLIDO como agua de jamaica → avatar DURA → el colador con la pasta que no pasó
// → ¿el chile? ¿la carne? → esa noche lavando la olla → avatar "no fuiste tú" → EL ORDEN y EL FUEGO → el recetario de mamá Cuca
// → avatar "por plato" → la fonda: ESO COBRAN → cenital: 7 SECRETOS. Todo clavado a la voz con at("frase"). Audio fuera de Remotion.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, PLATES, screenOf, camSpeed, setKeys, win } from "./cocina3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, CH, DrawX, Flash, FONT, HAND, P, Portal, SERIF, Tag, at, atEnd, e, ei, extrude, s, spr } from "./lib";

const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
const GANCHO = (AVAIL as { gancho?: string }).gancho || "gancho_a";
type Win = { ms: number; me: number; off: number };
const WIN: Win[] = ((AVW as { win: Win[] }).win).filter((w) => w.ms < 118);
export const MIN1_END = 114.9;
export const MIN1_FRAMES = s(MIN1_END);

// ---------------- tiempos clavados a la voz ----------------
const T = {
  olla: at("esta olla"), rojo: at("rojo rojo"), capita: at("capita"), deshace: at("se deshace"), magica: at("olla magica"),
  siete: at("siete cosas"), fondas: at("las fondas no"), domingo: at("es domingo"), temprano: at("temprano"), kilos: at("dos kilos"),
  manana: at("toda la manana"), suegra: at("llega tu suegra"), sirves: at("sirves"), nada: at("ni dice nada"), salsa: at("la salsa"),
  echa1: at("le echa"), echa2: at("le echa", 56), platos: at("en los platos"), palido: at("esta palido"), jamaica: at("agua de jamaica"),
  dura: at("esta dura"), medio: at("medio plato"), colador: at("del colador"), pasta: at("la pasta"), chile: at("era el chile"),
  carne: at("era la carne"), noche: at("esa noche"), hecha: at("compras hecha"), nofuiste: at("no fuiste"), receta: at("la receta"),
  orden: at("el orden"), fuego: at("el fuego"), abuelas: at("las abuelas"), plato: at("por plato"), cobran: at("ellos cobran"),
  dar: at("te voy a dar", 100), siete2: at("siete secretos"), chiles: at("se tuestan"),
};
const AVS = WIN.map((w) => [w.ms, w.me] as [number, number]);

// ---------------- cámara del minuto 1 (una sola, sin cortes; las entradas/salidas son portales y vapor) ----------------
const CZ = PT.cazuela;
const TOP_P = [0.0, 4.3, 1.05] as [number, number, number], TOP_L = [0, 0.8, 0.12] as [number, number, number];
const FOG_L = [-1.3, 0.95, -2.4] as [number, number, number], LIB_L = [0.88, 0.82, -0.3] as [number, number, number];
setKeys([
  { t: 0, p: [0.9, 1.5, 1.25], l: CZ, fov: 36 },
  { t: 17.7, p: [0.9, 1.5, 1.25], l: CZ, fov: 36 },
  { t: 21.0, p: [0.5, 1.3, 0.66], l: CZ, fov: 33, arc: 0.12 },                // se acerca a la olla: consomé y grasa
  { t: 21.4, p: TOP_P, l: TOP_L, fov: 40 },                                  // cenital: los siete platos
  { t: 27.0, p: [0.0, 4.0, 0.95], l: TOP_L, fov: 40 },
  { t: 37.3, p: [-0.55, 1.4, -0.75], l: FOG_L, fov: 38 },                    // madrugada: el fogón
  { t: 41.4, p: [-0.62, 1.35, -0.92], l: FOG_L, fov: 38 },
  { t: 57.2, p: TOP_P, l: TOP_L, fov: 40 },                                  // cenital: lo que pasa en los platos
  { t: 60.1, p: [0.0, 4.05, 0.98], l: TOP_L, fov: 40 },
  { t: 73.9, p: [-0.6, 1.35, -0.95], l: [-1.3, 1.0, -2.5], fov: 34 },         // ¿el chile? (el comal)
  { t: 75.0, p: [-0.66, 1.33, -1.02], l: [-1.3, 1.0, -2.5], fov: 34 },
  { t: 75.7, p: [0.75, 1.4, 0.75], l: CZ, fov: 34 },                         // ¿la carne? (la olla)
  { t: 77.8, p: [0.6, 1.33, 0.62], l: CZ, fov: 33 },
  { t: 86.2, p: [0.85, 1.5, 1.2], l: CZ, fov: 36 },                          // dura y pálido: la olla
  { t: 90.9, p: [0.68, 1.42, 0.98], l: CZ, fov: 35 },
  { t: 91.4, p: [1.9, 1.95, 2.7], l: [-0.6, 0.8, -1.3], fov: 42 },            // el orden (platos) y el fuego (fogón)
  { t: 93.0, p: [1.5, 1.9, 2.4], l: [-0.8, 0.8, -1.6], fov: 42 },
  { t: 93.9, p: [1.12, 1.42, 0.28], l: LIB_L, fov: 34, arc: 0.15 },          // el recetario de mamá Cuca
  { t: 97.5, p: [1.0, 1.2, 0.02], l: LIB_L, fov: 30 },
  { t: 105.2, p: [0.0, 4.4, 1.1], l: TOP_L, fov: 40 },                       // cenital: siete secretos
  { t: 114.9, p: [0.0, 3.6, 0.95], l: TOP_L, fov: 40 },
]);

// ---------------- estado del mundo por segundo ----------------
const topAt = (t: number) => (t >= 21.3 && t < 27.2) || (t >= 57.1 && t < 60.3) || t >= 105.1;
const worldAt = (t: number): WorldProps => {
  const dawn = win(t, 36.8, 37.4) * (1 - win(t, 40.6, 41.4));
  const plateOn = PLATES.map((_, i) => {
    const a = Math.max(21.4, T.siete) + i * 0.22, b = Math.max(105.3, T.siete2) + i * 0.18, c = T.platos + i * 0.1;
    return Math.max(win(t, a, a + 0.25) * (1 - win(t, 26.6, 27)), win(t, c, c + 0.2) * (1 - win(t, 59.8, 60.2)), win(t, b, b + 0.25), win(t, T.orden + i * 0.12, T.orden + i * 0.12 + 0.2) * (1 - win(t, T.fuego, T.fuego + 0.3)));
  });
  return {
    t, night: 0, dawn,
    fire: 1 + 1.4 * win(t, T.fuego, T.fuego + 0.3) * (1 - win(t, 92.6, 93.2)),
    steamCaz: topAt(t) ? 0 : 1, steamComal: topAt(t) ? 0 : undefined, ojitos: 0.5 + 0.5 * win(t, 17.8, 18.4),
    plateOn, plateServed: PLATES.map(() => 0), plateSteam: PLATES.map(() => 0),
    // la mesa puesta con su birria hasta la fonda; en la cenital de los 7 secretos los platos ya esperan vacíos, uno por secreto
    plateFill: PLATES.map(() => (t < 104 ? 1 : 0)),
    sugar: 0, pour: 0, patioLights: 0, partyPeople: 0,
    book: { open: ei(t, 93.9, 95.4), flip: 0, pages: RECETARIO },
    top: topAt(t) ? 1 : 0,
  };
};
const RECETARIO = [{
  l: ["# Birria de Domingo", "de mi mamá Cuca", "", "Pa' toda la semana.", "Fuego que apenas", "tiembla.", "", "— Refugio"],
  r: ["chiles contando", "los segundos", "el jitomate, negro", "colar dos veces", "freír el adobo", "agua fría", "la grasa NO se tira", "una olla, 7 comidas"],
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
  const A = (i: number) => AVS[i] || [1e9, 1e9];
  const inA = (i: number) => t >= A(i)[0] && t < A(i)[1];

  // A · 0-4,2 · avatar "mira nomás esta olla" → portal a la toma real de la olla
  if (t < A(0)[1] + 0.02) {
    L.push(<Avatar key="avA" t={t} />);
    const r = ei(t, T.olla + 0.3, A(0)[1]);
    if (r > 0) L.push(<Portal key="pA" x={960} y={640} r={r}><Clip k={GANCHO} t={t} a={T.olla + 0.3} z={[1.0, 1.06]} /></Portal>);
  }
  // B · 4,2-14,0 · TOMA REAL continua: el consomé tiembla, la cuchara levanta la carne y se deshace
  if (t >= A(0)[1] && t < A(1)[0] + 0.02) {
    L.push(<Clip key="cB" k={GANCHO} t={t} a={T.olla + 0.3} z={[1.0, 1.06]} />);
    L.push(<Tag key="rj" t={t} at={T.rojo} x={900} y={760} dx={-330} dy={-260} text="ROJO, ROJO" col={CH.maiz} out={A(1)[0] - 0.2} size={54} />);
    L.push(<Tag key="gr" t={t} at={T.capita} x={1060} y={800} dx={300} dy={-250} text="SU CAPITA" sub="DE GRASA ROJA" col="#ff8a3a" out={A(1)[0] - 0.2} size={50} />);
  }
  // C · 14,0-17,8 · avatar "nomás la toco con la cuchara y se deshace solita"
  if (inA(1)) {
    L.push(<Avatar key="avC" t={t} />);
    L.push(<Stamp key="ds" t={t} at={T.deshace} text="SE DESHACE SOLITA" x={1380} y={860} out={A(1)[1] - 0.1} rot={-5} size={64} col={CH.maiz} />);
  }
  // D · 17,8-21,3 · la olla de la mesa (mundo 3D): "esto no lo hace ninguna olla mágica"
  if (t >= A(1)[1] && t < 21.45) {
    L.push(W("wD"));
    const c = screenOf(t, [CZ[0], CZ[1] + 0.2, CZ[2]]);
    L.push(<Pill key="om" t={t} at={T.magica} out={21.1} x={1380} y={300} text="OLLA MÁGICA" />);
  }
  // E · 21,3-27,1 · cenital: los siete platos se encienden con su número → LAS FONDAS NO TE LO DICEN
  if (t >= 21.3 && t < 27.15) {
    L.push(W("wE"));
    L.push(<PlateNums key="pn" t={t} a={Math.max(21.45, T.siete)} out={T.fondas - 0.15} />);
    L.push(<Stamp key="fn" t={t} at={T.fondas} text="LAS FONDAS NO TE LO DICEN" x={960} y={540} out={26.9} rot={-6} size={84} col={CH.maiz} />);
  }
  L.push(<SteamWipe key="sw1" t={t} mid={21.35} w={0.4} />, <SteamWipe key="sw2" t={t} mid={27.1} w={0.45} />);
  // F · 27,1-31,8 · imagínate: es domingo, te levantaste temprano (5:00)
  if (t >= 27.1 && t < A(2)[0] + 0.02) {
    L.push(<Clip key="cF" k="h_domingo" t={t} a={27.1} z={[1.1, 1.02]} />);
    L.push(<Nota key="nd" t={t} at={T.domingo} out={A(2)[0] - 0.2} x={1480} y={300} lines={["Domingo", "comida en mi casa"]} />);
    L.push(<Reloj key="r1" t={t} at={T.temprano} spin={1e9} out={A(2)[0] - 0.2} x={400} y={340} />);
  }
  // G · 31,8-37,4 · avatar "compraste dos kilos y medio de carne, que no es poco dinero"
  if (inA(2)) {
    L.push(<Avatar key="avG" t={t} />);
    L.push(<Precio key="kg" t={t} at={T.kilos} out={A(2)[1] - 0.15} x={1420} y={150} top="2½ kg" sub="DE CARNE" />);
  }
  // H · 37,4-41,4 · el fogón de madrugada: toda la mañana con la olla (el reloj corre)
  if (t >= A(2)[1] && t < 41.45) {
    L.push(W("wH", t, { steamComal: 0.2 }));
    L.push(<Reloj key="r2" t={t} at={A(2)[1] + 0.05} spin={T.manana} out={41.2} x={1540} y={340} />);
  }
  L.push(<SteamWipe key="sw3" t={t} mid={41.42} w={0.35} />);
  // I · 41,4-48,6 · llega la familia y se sientan → sirves → la suegra mete la cuchara
  if (t >= 41.4 && t < A(3)[0] + 0.02) {
    const sl = ei(t, T.sirves - 0.25, T.sirves + 0.25), mb = Math.sin(sl * Math.PI) * 36;
    L.push(<AbsoluteFill key="iF" style={{ transform: `translateX(${-sl * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Clip k="h_familia" t={t} a={41.4} /></AbsoluteFill>);
    if (sl > 0) L.push(<AbsoluteFill key="iS" style={{ transform: `translateX(${(1 - sl) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Clip k="h_suegra" t={t} a={T.sirves - 0.25} z={[1.02, 1.12]} /></AbsoluteFill>);
    L.push(<Tag key="sg" t={t} at={T.suegra} x={560} y={640} dx={-200} dy={-260} text="LA SUEGRA" col={CH.maiz} out={T.sirves - 0.3} size={52} />);
  }
  // J · 48,6-52,9 · avatar "prueba el consomé y se queda viendo el plato… ni dice nada"
  if (inA(3)) {
    L.push(<Avatar key="avJ" t={t} />);
    L.push(<Pensado key="nn" t={t} at={T.nada} out={A(3)[1] - 0.15} x={1420} y={260} text="(ni dice nada)" size={92} />);
  }
  // K · 52,9-57,3 · le pide la salsa y le echa, y le echa
  if (t >= A(3)[1] && t < 57.35) {
    L.push(<Clip key="cK" k="h_suegra" t={t} a={A(3)[1]} z={[1.14, 1.24]} ox={-60} />);
    L.push(<Tag key="sa" t={t} at={T.salsa} x={1160} y={640} dx={260} dy={-240} text="LA SALSA" col="#ff8a3a" out={57.1} size={52} />);
    L.push(<Pill key="e1" t={t} at={T.echa1} out={57.1} x={520} y={300} text="Y LE ECHA" col={CH.maiz} />);
    L.push(<Pill key="e2" t={t} at={T.echa2} out={57.1} x={620} y={430} text="Y LE ECHA" col={CH.maiz} />);
  }
  L.push(<SteamWipe key="sw4" t={t} mid={57.3} w={0.35} />);
  // L · 57,3-60,1 · cenital: lo que pasa en los platos
  if (t >= 57.3 && t < 60.15) L.push(W("wL"));
  // M · 60,1-63,5 · el consomé pálido, como agua de jamaica aguada
  if (t >= 60.1 && t < A(4)[0] + 0.02) {
    L.push(<Clip key="cM" k="h_palido" t={t} a={60.1} z={[1.02, 1.14]} />);
    L.push(<Tag key="pl" t={t} at={T.palido} x={900} y={520} dx={-300} dy={-240} text="PÁLIDO" sub={t > T.jamaica ? "COMO AGUA DE JAMAICA" : undefined} col={CH.maiz} out={A(4)[0] - 0.15} size={60} />);
  }
  L.push(<Flash key="fl0" t={t} at={60.1} col="#fff1cf" peak={0.35} w={0.25} />);
  // N · 63,5-69,0 · avatar "la carne está dura… alguien deja medio plato"
  if (inA(4)) {
    L.push(<Avatar key="avN" t={t} />);
    L.push(<Stamp key="du" t={t} at={T.dura} text="DURA" x={1460} y={300} out={A(4)[1] - 0.1} rot={-7} />);
    L.push(<Nota key="mp" t={t} at={T.medio} out={A(4)[1] - 0.15} x={1460} y={720} rot={3} w={400} lines={["medio plato", "se queda"]} />);
  }
  // O · 69,0-74,0 · en el fondo del colador, la pasta que no pasó
  if (t >= A(4)[1] && t < 74.05) {
    L.push(<Clip key="cO" k="h_colador" t={t} a={A(4)[1]} z={[1.04, 1.16]} />);
    L.push(<Tag key="ps" t={t} at={T.pasta} x={1000} y={600} dx={320} dy={-260} text="LA PASTA" sub="QUE NO PASÓ" col={CH.maiz} out={73.8} size={54} />);
  }
  L.push(<SteamWipe key="sw5" t={t} mid={74.0} w={0.35} />);
  // P · 74,0-77,7 · ¿el chile? (comal) → ¿la carne? (la olla)
  if (t >= 74.0 && t < 77.75) {
    L.push(W("wP", t, { chiles: 6, toast: 0.5, steamComal: 0.2 }));
    const cm = screenOf(t, PT.comal), oz = screenOf(t, [CZ[0], CZ[1] + 0.2, CZ[2]]);
    if (t < 75.5) L.push(<Tag key="qc" t={t} at={Math.max(74.05, T.chile)} x={cm.x} y={cm.y} dx={220} dy={-220} text="¿EL CHILE?" col="#ff8a3a" out={75.3} size={58} />);
    if (t >= 75.5) L.push(<Tag key="qk" t={t} at={Math.max(75.75, T.carne)} x={oz.x} y={oz.y} dx={-260} dy={-230} text="¿LA CARNE?" col={CH.maiz} out={77.5} size={58} />);
  }
  L.push(<SteamWipe key="sw6" t={t} mid={77.7} w={0.35} />);
  // Q · 77,7-83,1 · esa noche, lavando la olla: "mejor la compro hecha"
  if (t >= 77.7 && t < A(5)[0] + 0.02) {
    L.push(<Clip key="cQ" k="h_lavar" t={t} a={77.7} z={[1.03, 1.12]} />);
    L.push(<Pensado key="ch" t={t} at={T.hecha - 0.6} out={A(5)[0] - 0.2} x={1320} y={280} text="mejor la compro hecha" size={96} />);
  }
  // R · 83,1-86,3 · avatar "¿te ha pasado? pues no fuiste tú, mija"
  if (inA(5)) {
    L.push(<Avatar key="avR" t={t} />);
    L.push(<Nota key="nf" t={t} at={T.nofuiste} out={A(5)[1] - 0.15} x={1500} y={250} rot={4} w={460} lines={["No fuiste tú, mija."]} />);
  }
  // S · 86,3-91,3 · la olla: dura y pálido casi nunca son por la receta
  if (t >= A(5)[1] && t < 91.45) {
    L.push(W("wS"));
    L.push(<Pill key="sd" t={t} at={A(5)[1] + 0.3} out={91.1} x={560} y={260} text="DURA" />);
    L.push(<Pill key="sp" t={t} at={A(5)[1] + 1.4} out={91.1} x={1360} y={260} text="PÁLIDO" />);
    L.push(<BigNum key="nr" t={t} at={T.receta} text="NO ES LA RECETA" size={120} y={880} col={CH.crema} edge="#4a1a0c" out={91.1} />);
  }
  // T · 91,3-93,9 · el ORDEN (platos) y el FUEGO (fogón)
  if (t >= 91.3 && t < 94.0) {
    L.push(W("wT"));
    const pl = screenOf(t, PLATES[3]), fg = screenOf(t, PT.fire);
    L.push(<Tag key="or" t={t} at={Math.max(91.4, T.orden)} x={pl.x} y={pl.y} dx={180} dy={-200} text="EL ORDEN" col={CH.maiz} out={93.7} size={58} />);
    L.push(<Tag key="fu" t={t} at={Math.max(91.7, T.fuego)} x={fg.x} y={fg.y} dx={-200} dy={-220} text="EL FUEGO" col="#ff8a3a" out={93.7} size={58} />);
  }
  // U · 93,9-97,6 · el recetario de mamá Cuca se abre (lo que las abuelas hacían sin hablar)
  if (t >= 93.9 && t < A(6)[0] + 0.02) {
    L.push(W("wU"));
    L.push(<Tag key="rc" t={t} at={Math.max(94.6, T.abuelas)} x={1100} y={560} dx={-380} dy={300} text="LO QUE LAS ABUELAS" sub="HACÍAN SIN HABLAR" col={CH.maiz} out={A(6)[0] - 0.2} size={46} />);
  }
  // V · 97,6-102,9 · avatar "en la fonda tampoco te las van a decir… la venden por plato"
  if (inA(6)) {
    L.push(<Avatar key="avV" t={t} />);
    L.push(<Pill key="pp" t={t} at={T.plato - 0.3} out={A(6)[1] - 0.1} x={1450} y={300} text="POR PLATO" col={CH.maiz} />);
  }
  // W · 102,9-105,3 · la fonda: lo que tú no sabes hacer es lo que ellos cobran
  if (t >= A(6)[1] && t < 105.35) {
    L.push(<Clip key="cW" k="h_fonda" t={t} a={A(6)[1]} z={[1.03, 1.1]} />);
    L.push(<Stamp key="ec" t={t} at={T.cobran} text="ESO COBRAN" x={1300} y={300} out={105.2} rot={-7} />);
  }
  L.push(<SteamWipe key="sw7" t={t} mid={105.3} w={0.4} />);
  // X · 105,3-114,9 · cenital: los siete platos → 7 SECRETOS → el primero: los chiles
  if (t >= 105.3) {
    L.push(W("wX"));
    L.push(<PlateNums key="pn2" t={t} a={Math.max(105.4, T.siete2)} out={T.chiles - 0.2} />);
    L.push(<BigNum key="7s" t={t} at={T.siete2} text="7 SECRETOS" size={170} y={900} col={CH.maiz} edge="#5a2a10" out={T.chiles - 0.2} sub="DE LA BIRRIA DE MI ABUELA" />);
    const p1 = screenOf(t, PLATES[0]);
    L.push(<Tag key="s1" t={t} at={T.chiles} x={p1.x} y={p1.y} dx={200} dy={-200} text="1 · LOS CHILES" sub="SIN QUE AMARGUEN" col={CH.maiz} size={52} />);
  }

  return <AbsoluteFill style={{ background: "#0a0503" }}>{L}</AbsoluteFill>;
};
