// chcarnitas · MINUTO 1 (0-115,6 s). Un solo hilo: la cocina de adobe de Doña Chayo, su fogón y el CAZO DE COBRE de la mesa son el mundo;
// todo entra y sale de ahí sin cortes secos: avatar "mira nomás este cazo" → portal a la toma real (la pala levanta el trozo dorado y se deshace)
// → avatar "jugosas por dentro" → el cazo 3D: "ningún cazo mágico" → cenital: los 7 platos → LAS FONDAS NO TE LO DICEN → vapor → los 15 años
// → avatar "25 gentes" → la taquiza que cobraba más de 4,000 → el mercado: 7 kilos → el fogón, el reloj corre → avatar: llega tu suegra
// → mastica y mastica, le echa salsa y le echa → cenital: los platos → avatar PÁLIDA → seca → dos tacos en el plato → el caldo aguado
// → ¿la carne? → avatar ¿la manteca? → esa noche lavando la olla → "no fuiste tú" → avatar EL ORDEN y EL FUEGO → el recetario de la abuela
// → la fonda: POR KILO, ESO COBRAN → cenital: los 7 platos. Todo clavado a la voz con at("frase"). Audio fuera de Remotion.
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
export const MIN1_END = 115.6;
export const MIN1_FRAMES = s(MIN1_END);

// ---------------- tiempos clavados a la voz ----------------
// (el ASR escribe "caso" por "cazo")
const T = {
  cazo: at("este caso"), doradas: at("doraditas"), cobre: at("como de cobre"), deshace: at("se deshacen"), jugosas: at("jugosas"),
  magico: at("caso magico"), siete: at("siete cosas"), fondas: at("las fondas no"), quince: at("15 anos"), gentes: at("25 gentes"),
  cobraba: at("te cobraba"), hago: at("yo las hago"), kilos: at("7 kilos"), poco: at("no es poco"), manana: at("toda la manana"),
  suegra: at("llega tu suegra"), sirves: at("sirves"), mastica: at("mastica y mastica"), nada: at("ni dice nada"), salsa: at("la salsa"),
  echa1: at("le echa"), echa2: at("le echa", 63.5), platos: at("en los platos"), palida: at("palida"), hervida: at("carne hervida"),
  seca: at("esta seca"), hebra: at("se hace hebra"), tacos: at("dos tacos"), aguado: at("caldo aguado"), grasa: at("la grasa flotando"),
  carne: at("era la carne"), manteca: at("era la manteca"), pagas: at("mejor pagas"), nofuiste: at("no fuiste"), secas: at("secas y palidas"),
  porcarne: at("por la carne"), orden: at("el orden"), fuego: at("por el fuego"), abuelas: at("las abuelas"), kilo: at("por kilo"),
  cobran: at("ellos cobran"), dar: at("te voy a dar", 100),
};
const AVS = WIN.map((w) => [w.ms, w.me] as [number, number]);

// ---------------- cámara del minuto 1 (una sola, sin cortes; las entradas/salidas son portales y vapor) ----------------
const CZ = PT.cazuela;
const TOP_P = [0.0, 4.3, 1.05] as [number, number, number], TOP_L = [0, 0.8, 0.12] as [number, number, number];
const FOG_L = [-1.3, 0.95, -2.4] as [number, number, number], LIB_L = [0.88, 0.82, -0.3] as [number, number, number];
const MER_L = [6.6, 0.95, 5.4] as [number, number, number];
setKeys([
  { t: 0, p: [0.9, 1.5, 1.25], l: CZ, fov: 36 },
  { t: 19.0, p: [0.9, 1.5, 1.25], l: CZ, fov: 36 },
  { t: 21.8, p: [0.5, 1.3, 0.66], l: CZ, fov: 33, arc: 0.12 },                // se acerca al cazo: la manteca dorada
  { t: 22.0, p: TOP_P, l: TOP_L, fov: 40 },                                  // cenital: los siete platos
  { t: 28.2, p: [0.0, 4.0, 0.95], l: TOP_L, fov: 40 },
  { t: 42.2, p: [6.6, 1.5, 7.6], l: MER_L, fov: 38 },                        // el puesto del mercado: cerdo 7 kg
  { t: 45.6, p: [6.25, 1.3, 6.7], l: MER_L, fov: 35 },
  { t: 45.8, p: [-0.55, 1.4, -0.75], l: FOG_L, fov: 38 },                    // toda la mañana junto al fogón
  { t: 48.3, p: [-0.62, 1.35, -0.92], l: FOG_L, fov: 38 },
  { t: 64.5, p: TOP_P, l: TOP_L, fov: 40 },                                  // cenital: lo que pasa en los platos
  { t: 67.0, p: [0.0, 4.05, 0.98], l: TOP_L, fov: 40 },
  { t: 82.7, p: [0.75, 1.4, 0.75], l: CZ, fov: 34 },                         // ¿la carne? (el cazo)
  { t: 83.8, p: [0.62, 1.34, 0.64], l: CZ, fov: 33 },
  { t: 92.0, p: [0.85, 1.5, 1.2], l: CZ, fov: 36 },                          // no fuiste tú: el cazo
  { t: 95.3, p: [0.68, 1.42, 0.98], l: CZ, fov: 35 },
  { t: 95.5, p: [-0.9, 1.45, 1.0], l: CZ, fov: 36 },                         // secas y pálidas: no es la carne
  { t: 98.5, p: [-0.6, 1.35, 0.7], l: CZ, fov: 34 },
  { t: 102.6, p: [1.12, 1.42, 0.28], l: LIB_L, fov: 34, arc: 0.15 },         // el recetario de la abuela
  { t: 105.2, p: [1.0, 1.2, 0.02], l: LIB_L, fov: 30 },
  { t: 113.6, p: [0.0, 4.4, 1.1], l: TOP_L, fov: 40 },                       // cenital: siete secretos
  { t: 115.6, p: [0.0, 4.1, 1.0], l: TOP_L, fov: 40 },
]);

// ---------------- estado del mundo por segundo ----------------
const topAt = (t: number) => (t >= 21.85 && t < 28.3) || (t >= 64.4 && t < 67.1) || t >= 113.5;
const worldAt = (t: number): WorldProps => {
  const plateOn = PLATES.map((_, i) => {
    const a = Math.max(22.0, T.siete) + i * 0.22, b = Math.max(113.7, T.dar) + i * 0.18, c = Math.max(64.6, T.platos - 0.8) + i * 0.1;
    return Math.max(win(t, a, a + 0.25) * (1 - win(t, 27.8, 28.2)), win(t, c, c + 0.2) * (1 - win(t, 66.8, 67.1)), win(t, b, b + 0.25));
  });
  return {
    t, night: 0, dawn: 0, fire: 1,
    steamCaz: topAt(t) ? 0 : 1, steamComal: topAt(t) ? 0 : undefined, ojitos: 0.5 + 0.5 * win(t, 19.2, 19.8),
    plateOn, plateServed: PLATES.map(() => 0), plateSteam: PLATES.map(() => 0),
    // la mesa puesta con sus carnitas; en la cenital de los 7 secretos los platos esperan vacíos, uno por secreto
    plateFill: PLATES.map(() => (t < 110 ? 1 : 0)),
    sugar: 0, pour: 0, patioLights: 0, partyPeople: 0,
    book: { open: ei(t, 102.7, 104.2), flip: 0, pages: RECETARIO },
    top: topAt(t) ? 1 : 0,
  };
};
const RECETARIO = [{
  l: ["# Carnitas de Fiesta", "de mi abuela", "", "Pa' los 15 años", "y los cumpleaños.", "Fuego bajito,", "nada de prisa.", "— Refugio"],
  r: ["tres carnes, no una", "manteca, nunca agua", "las naranjas", "destapado la 1ª hora", "fuego bajito 2 horas", "5 minutos fuerte", "un día antes", "y tú, sentada"],
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
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: CH.guinda }}>Pa las carnitas</div>
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

  // A · 0-4,2 · avatar "mira nomás este cazo" → portal a la toma real del cazo
  if (t < A(0)[1] + 0.02) {
    L.push(<Avatar key="avA" t={t} />);
    const r = ei(t, T.cazo + 0.3, A(0)[1]);
    if (r > 0) L.push(<Portal key="pA" x={960} y={640} r={r}><Clip k={GANCHO} t={t} a={T.cazo + 0.3} z={[1.0, 1.06]} /></Portal>);
  }
  // B · 4,2-15,5 · TOMA REAL continua: la manteca burbujea, la pala levanta el trozo dorado y se deshace
  if (t >= A(0)[1] && t < A(1)[0] + 0.02) {
    L.push(<Clip key="cB" k={GANCHO} t={t} a={T.cazo + 0.3} z={[1.0, 1.06]} />);
    L.push(<Tag key="dr" t={t} at={T.doradas} x={900} y={760} dx={-330} dy={-260} text="DORADITAS" col={CH.maiz} out={A(1)[0] - 0.2} size={54} />);
    L.push(<Tag key="cb" t={t} at={T.cobre} x={1060} y={800} dx={300} dy={-250} text="COMO DE COBRE" col="#ff9a5a" out={A(1)[0] - 0.2} size={50} />);
  }
  // C · 15,5-19,0 · avatar "se deshacen solitas, jugosas por dentro"
  if (inA(1)) {
    L.push(<Avatar key="avC" t={t} />);
    L.push(<Stamp key="ds" t={t} at={T.deshace} text="SE DESHACEN SOLITAS" x={1380} y={860} out={T.jugosas - 0.15} rot={-5} size={60} col={CH.maiz} />);
    L.push(<Stamp key="jg" t={t} at={T.jugosas} text="JUGOSAS POR DENTRO" x={1380} y={860} out={A(1)[1] - 0.1} rot={-5} size={60} col={CH.maiz} />);
  }
  // D · 19,0-21,9 · el cazo de cobre de la mesa (mundo 3D): "esto no lo hace ningún cazo mágico"
  if (t >= A(1)[1] && t < 21.95) {
    L.push(W("wD"));
    L.push(<Pill key="cm" t={t} at={T.magico} out={21.7} x={1380} y={300} text="CAZO MÁGICO" />);
  }
  // E · 21,9-28,2 · cenital: los siete platos se encienden con su número → LAS FONDAS NO TE LO DICEN
  if (t >= 21.85 && t < 28.25) {
    L.push(W("wE"));
    L.push(<PlateNums key="pn" t={t} a={Math.max(22.05, T.siete)} out={T.fondas - 0.15} />);
    L.push(<Stamp key="fn" t={t} at={T.fondas} text="LAS FONDAS NO TE LO DICEN" x={960} y={540} out={28.0} rot={-6} size={84} col={CH.maiz} />);
  }
  L.push(<SteamWipe key="sw1" t={t} mid={21.9} w={0.4} />, <SteamWipe key="sw2" t={t} mid={28.2} w={0.45} />);
  // F · 28,2-31,3 · imagínate: los 15 años de tu hija
  if (t >= 28.2 && t < A(2)[0] + 0.02) {
    L.push(<Clip key="cF" k="h_fiesta" t={t} a={28.2} z={[1.1, 1.02]} />);
    L.push(<Nota key="nq" t={t} at={T.quince - 0.2} out={A(2)[0] - 0.2} x={1480} y={300} lines={["Los 15 años", "de mi hija"]} />);
  }
  // G · 31,3-35,6 · avatar "vienen 25 gentes"
  if (inA(2)) {
    L.push(<Avatar key="avG" t={t} />);
    L.push(<Precio key="gn" t={t} at={T.gentes} out={A(2)[1] - 0.15} x={1420} y={150} top="25" sub="GENTES A COMER" />);
  }
  // H · 35,6-42,2 · la taquiza cobraba más de 4,000 → "no, yo las hago"
  if (t >= A(2)[1] && t < 42.25) {
    L.push(<Clip key="cH" k="h_cocinera" t={t} a={A(2)[1]} z={[1.03, 1.12]} />);
    L.push(<Precio key="tq" t={t} at={T.cobraba} out={T.hago - 0.4} x={1380} y={140} top="+$4,000" sub="LA TAQUIZA" />);
    L.push(<Pensado key="yh" t={t} at={T.hago - 0.5} out={42.0} x={1300} y={300} text="no, yo las hago" size={104} />);
  }
  L.push(<SteamWipe key="sw3" t={t} mid={42.2} w={0.35} />);
  // I · 42,2-45,7 · el puesto del mercado: 7 kilos de carne, que no es poco dinero
  if (t >= 42.2 && t < 45.75) {
    L.push(W("wI"));
    L.push(<Precio key="kg" t={t} at={T.kilos} out={45.5} x={420} y={150} top="7 kg" sub="DE CARNE" />);
    L.push(<Pill key="np" t={t} at={T.poco} out={45.5} x={1400} y={880} text="NO ES POCO DINERO" col={CH.maiz} />);
  }
  L.push(<SteamWipe key="sw4" t={t} mid={45.7} w={0.3} />);
  // I2 · 45,7-48,3 · el fogón: toda la mañana parada junto a la olla (el reloj corre)
  if (t >= 45.7 && t < A(3)[0] + 0.02) {
    L.push(W("wI2", t, { steamComal: 0.2 }));
    L.push(<Reloj key="r2" t={t} at={45.75} spin={T.manana} out={A(3)[0] - 0.2} x={1540} y={340} />);
  }
  // J · 48,3-54,5 · avatar "llegan tus comadres, llega tu suegra… sirves el primer taco"
  if (inA(3)) {
    L.push(<Avatar key="avJ" t={t} />);
    L.push(<Pill key="sg" t={t} at={T.suegra + 0.3} out={T.sirves - 0.1} x={1450} y={300} text="LA SUEGRA" col={CH.maiz} />);
    L.push(<Palomita key="pt" t={t} at={T.sirves + 0.3} out={A(3)[1] - 0.1} y={260} text="el primer taco" />);
  }
  // K · 54,5-64,5 · la suegra muerde: mastica y mastica… ni dice nada → le echa salsa y le echa
  if (t >= A(3)[1] && t < 64.55) {
    L.push(<Clip key="cK" k="h_suegra" t={t} a={A(3)[1]} z={[1.02, 1.2]} ox={-60} />);
    L.push(<Pill key="mm" t={t} at={T.mastica} out={T.nada - 0.2} x={1400} y={300} text="MASTICA Y MASTICA" col={CH.maiz} />);
    L.push(<Pensado key="nn" t={t} at={T.nada} out={T.salsa - 0.2} x={1400} y={300} text="(ni dice nada)" size={92} />);
    L.push(<Tag key="sa" t={t} at={T.salsa} x={1160} y={640} dx={260} dy={-240} text="LA SALSA" col="#ff8a3a" out={64.3} size={52} />);
    L.push(<Pill key="e1" t={t} at={T.echa1} out={64.3} x={520} y={300} text="Y LE ECHA" col={CH.maiz} />);
    L.push(<Pill key="e2" t={t} at={T.echa2} out={64.3} x={620} y={430} text="Y LE ECHA" col={CH.maiz} />);
  }
  L.push(<SteamWipe key="sw5" t={t} mid={64.5} w={0.35} />);
  // L · 64,5-67,0 · cenital: lo que pasa en los platos
  if (t >= 64.45 && t < A(4)[0] + 0.02) L.push(W("wL"));
  // M · 67,0-71,4 · avatar "la carne está pálida, grisecita, como carne hervida"
  if (inA(4)) {
    L.push(<Avatar key="avM" t={t} />);
    L.push(<Stamp key="pa" t={t} at={T.palida} text="PÁLIDA" x={1460} y={300} out={A(4)[1] - 0.1} rot={-7} />);
    L.push(<Nota key="hv" t={t} at={T.hervida - 0.3} out={A(4)[1] - 0.15} x={1460} y={720} rot={3} w={420} lines={["como carne", "hervida"]} />);
  }
  // N · 71,4-74,2 · el plato: seca, se hace hebra
  if (t >= A(4)[1] && t < 74.25) {
    L.push(<Clip key="cN" k="h_palido" t={t} a={A(4)[1]} z={[1.02, 1.14]} />);
    L.push(<Tag key="sc" t={t} at={T.seca} x={900} y={540} dx={-300} dy={-240} text="SECA" sub={t > T.hebra ? "SE HACE HEBRA" : undefined} col={CH.maiz} out={74.0} size={60} />);
  }
  L.push(<Flash key="fl0" t={t} at={71.4} col="#fff1cf" peak={0.3} w={0.25} />);
  // O · 74,2-77,1 · alguien deja dos tacos en el plato
  if (t >= 74.2 && t < 77.15) {
    L.push(<Clip key="cO" k="h_seco" t={t} a={74.2} z={[1.04, 1.13]} />);
    L.push(<Nota key="dt" t={t} at={T.tacos - 0.2} out={76.9} x={1460} y={280} rot={-3} w={430} lines={["dos tacos", "se quedan"]} />);
  }
  L.push(<SteamWipe key="sw6" t={t} mid={77.1} w={0.35} />);
  // P · 77,1-82,7 · en el fondo de la olla, un caldo aguado con la grasa flotando
  if (t >= 77.1 && t < 82.75) {
    L.push(<Clip key="cP" k="h_caldo" t={t} a={77.1} z={[1.03, 1.15]} />);
    L.push(<Tag key="ca" t={t} at={T.aguado} x={1000} y={600} dx={320} dy={-260} text="CALDO AGUADO" sub={t > T.grasa ? "LA GRASA FLOTANDO" : undefined} col={CH.maiz} out={82.5} size={54} />);
  }
  L.push(<SteamWipe key="sw7" t={t} mid={82.7} w={0.3} />);
  // Q · 82,7-83,8 · ¿la carne? (el cazo)
  if (t >= 82.7 && t < A(5)[0] + 0.02) {
    L.push(W("wQ"));
    const oz = screenOf(t, [CZ[0], CZ[1] + 0.2, CZ[2]]);
    L.push(<Tag key="qk" t={t} at={Math.max(82.8, T.carne)} x={oz.x} y={oz.y} dx={-260} dy={-230} text="¿LA CARNE?" col={CH.maiz} size={58} />);
  }
  // R · 83,8-88,2 · avatar "pensaste que era la manteca… y esa noche"
  if (inA(5)) {
    L.push(<Avatar key="avR" t={t} />);
    L.push(<Pill key="qm" t={t} at={T.manteca} out={A(5)[1] - 0.1} x={1450} y={300} text="¿LA MANTECA?" col={CH.maiz} />);
  }
  // S · 88,2-92,0 · esa noche, lavando la olla: "mejor pago la taquiza"
  if (t >= A(5)[1] && t < 92.05) {
    L.push(<Clip key="cS" k="h_lavar" t={t} a={A(5)[1]} z={[1.03, 1.12]} />);
    L.push(<Pensado key="pg" t={t} at={T.pagas - 0.6} out={91.8} x={1320} y={280} text="mejor pago la taquiza" size={92} />);
  }
  L.push(<SteamWipe key="sw8" t={t} mid={92.0} w={0.35} />);
  // T · 92,0-95,5 · el cazo: "¿te ha pasado? pues no fuiste tú, mija"
  if (t >= 92.0 && t < 95.55) {
    L.push(W("wT"));
    L.push(<Nota key="nf" t={t} at={T.nofuiste} out={95.3} x={1460} y={260} rot={4} w={460} lines={["No fuiste tú, mija."]} />);
  }
  // U · 95,5-98,5 · secas y pálidas casi nunca son por la carne
  if (t >= 95.5 && t < A(6)[0] + 0.02) {
    L.push(W("wU"));
    L.push(<Pill key="us" t={t} at={T.secas} out={A(6)[0] - 0.2} x={560} y={260} text="SECAS" />);
    L.push(<Pill key="up" t={t} at={T.secas + 0.5} out={A(6)[0] - 0.2} x={1360} y={260} text="PÁLIDAS" />);
    L.push(<BigNum key="nc" t={t} at={T.porcarne} text="NO ES LA CARNE" size={120} y={880} col={CH.crema} edge="#4a1a0c" out={A(6)[0] - 0.2} />);
  }
  // V · 98,5-102,6 · avatar "son por el orden y por el fuego… lo que nadie te dijo"
  if (inA(6)) {
    L.push(<Avatar key="avV" t={t} />);
    L.push(<Palomita key="vo" t={t} at={T.orden} out={A(6)[1] - 0.1} y={230} text="EL ORDEN" />);
    L.push(<Palomita key="vf" t={t} at={T.fuego} out={A(6)[1] - 0.1} y={360} text="EL FUEGO" />);
  }
  // W · 102,6-105,2 · el recetario de la abuela se abre (lo que las abuelas hacían sin hablar)
  if (t >= A(6)[1] && t < 105.25) {
    L.push(W("wW"));
    L.push(<Tag key="rc" t={t} at={Math.max(103.0, T.abuelas)} x={1100} y={560} dx={-380} dy={300} text="LO QUE LAS ABUELAS" sub="HACÍAN SIN HABLAR" col={CH.maiz} out={105.0} size={46} />);
  }
  L.push(<SteamWipe key="sw9" t={t} mid={105.2} w={0.35} />);
  // X · 105,2-113,6 · la fonda: las venden por kilo, y lo que tú no sabes hacer es lo que ellos cobran
  if (t >= 105.2 && t < 113.65) {
    L.push(<Clip key="cX" k="h_fonda" t={t} a={105.2} z={[1.02, 1.16]} ox={50} />);
    L.push(<Pill key="pk" t={t} at={T.kilo} out={113.4} x={1450} y={300} text="POR KILO" col={CH.maiz} />);
    L.push(<Stamp key="ec" t={t} at={T.cobran} text="ESO COBRAN" x={1300} y={560} out={113.4} rot={-7} />);
  }
  L.push(<SteamWipe key="sw10" t={t} mid={113.6} w={0.35} />);
  // Y · 113,6-115,6 · cenital: "esto es lo que te voy a dar" → los siete platos se encienden
  if (t >= 113.55) {
    L.push(W("wY"));
    L.push(<PlateNums key="pn2" t={t} a={Math.max(113.8, T.dar)} out={1e9} />);
  }

  return <AbsoluteFill style={{ background: "#0a0503" }}>{L}</AbsoluteFill>;
};
