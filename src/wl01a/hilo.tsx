// wl01a · EL HILO «la máquina de pedal y el maniquí». Fotos Nano Banana h00..h11 (mismo cuarto, misma cámara): al decir el número
// el maniquí suma su prenda (fundido sobre la foto anterior) y la cámara se arrima a lo que entró; de un hilo cuelga la etiqueta
// de la tienda, que escribe a mano el precio de 1956 y abajo, en lápiz rojo, el de hoy. vestida = la silueta entera, al cierre.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { e, spr } from "./lib";
import { HAND } from "./k3d";

export type Fi = { id: string; a: number; b: number; va?: number; wow?: number | null; n?: number; mo?: Record<string, number>; precio?: string; hoy?: string };
const foto = (n: number) => staticFile(`wl01a/hilo/h${String(n).padStart(2, "0")}.jpg`);
// a dónde mira la cámara cuando entra cada prenda (fracción de la foto) y cuánto se arrima
const FOCO: Record<number, [number, number, number]> = {
  0: [0.55, 0.5, 1.1], 1: [0.59, 0.42, 1.38], 2: [0.45, 0.55, 1.15], 3: [0.59, 0.5, 1.34], 4: [0.59, 0.55, 1.3], 5: [0.59, 0.38, 1.36],
  6: [0.36, 0.53, 1.5], 7: [0.38, 0.53, 1.5], 8: [0.46, 0.75, 1.4], 9: [0.8, 0.45, 1.25], 10: [0.25, 0.55, 1.45], 11: [0.59, 0.15, 1.4]};

const Escritura: React.FC<{ t: number; at: number; dur?: number; children: React.ReactNode }> = ({ t, at, dur = 0.6, children }) => {
  const k = e(t, at, at + dur);   // la pluma avanza de izquierda a derecha
  return <div style={{ clipPath: `inset(-20% ${100 - 104 * k}% -20% -4%)` }}>{children}</div>;
};
const Etiqueta: React.FC<{ t: number; f: Fi; x: number }> = ({ t, f, x }) => {
  const A0 = Math.max(f.a, f.va ?? f.a), a = Math.max(A0 + 0.2, Math.min(A0 + 1.1, (f.mo?.p ?? 1e9) - 0.6)), k = spr(t, a, 0.7), sw = 14 * Math.sin((t - a) * 3.2) * Math.exp(-(t - a) * 0.9) + 1.5 * Math.sin((t - a) * 1.3);
  const o = e(t, a - 0.05, a + 0.1), baja = (1 - Math.min(1.06, k)) * -900;
  if (o <= 0.01 || !f.mo) return null;
  return (
    <div style={{ position: "absolute", left: x, top: x < 960 ? 120 : -60, width: 380, height: 900, opacity: o, transformOrigin: "50% 0", transform: `translateY(${baja}px) rotate(${sw}deg)` }}>
      <div style={{ position: "absolute", left: 188, top: 0, width: 4, height: 330, background: "linear-gradient(90deg,#e9dcc0,#8a7656)", boxShadow: "2px 0 4px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 0, top: 320, width: 380, height: 500, background: "linear-gradient(170deg,#f7efdc,#e8dcc1)", borderRadius: 10,
        clipPath: "polygon(18% 0,82% 0,100% 12%,100% 100%,0 100%,0 12%)", boxShadow: "0 30px 60px rgba(0,0,0,.55)", textAlign: "center", color: "#2a2116" }}>
        <div style={{ margin: "26px auto 0", width: 30, height: 30, borderRadius: "50%", background: "#6f6250", boxShadow: "inset 0 3px 6px #000" }} />
        <div style={{ fontFamily: "Georgia, serif", fontSize: 28, letterSpacing: 6, marginTop: 18, color: "#6d5a40" }}>1956</div>
        <Escritura t={t} at={f.mo.p}><div style={{ fontFamily: HAND, fontSize: (f.precio ?? "").length > 6 ? 86 : 150, lineHeight: "160px", color: "#1d2a4a" }}>{f.precio}</div></Escritura>
        <div style={{ margin: "6px 40px", height: 2, background: "rgba(80,60,40,.35)" }} />
        <div style={{ fontFamily: "Georgia, serif", fontSize: 26, letterSpacing: 5, marginTop: 10, color: "#8a3a2e", opacity: e(t, f.mo.h - 0.2, f.mo.h) }}>TODAY</div>
        <Escritura t={t} at={f.mo.h}><div style={{ fontFamily: HAND, fontSize: (f.hoy ?? "").length > 6 ? 72 : 124, lineHeight: "136px", color: "#b3261e" }}>{f.hoy}</div></Escritura>
      </div>
    </div>
  );
};
// hilo2: las medias de costura bajan colgadas de su broche en primer plano (recorte Nano Banana) y se balancean
const Medias: React.FC<{ t: number; A: number; out: number }> = ({ t, A, out }) => {
  const k = Math.min(1.05, spr(t, A - 0.1, 0.9)), sw = 3 * Math.sin((t - A) * 2.4) * Math.exp(-(t - A) * 0.6);
  return <Img src={staticFile("wl01a/kit/k_medias.png")} style={{ position: "absolute", left: 640, top: -150 - (1 - k) * 1100, width: 840, height: 1120, opacity: 1 - out,
    transformOrigin: "50% 10%", transform: `rotate(${sw}deg)`, filter: "drop-shadow(30px 40px 30px rgba(20,10,4,.55))" }} />;
};
export const HiloFX: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const n = f.n ?? 0, cierre = f.id === "vestida";
  const [fx, fy, z] = cierre ? [0.58, 0.42, 1.55] : FOCO[n];
  const A = Math.max(f.a, f.va ?? f.a);
  const k = cierre ? 1 - e(t, A + 4, A + 10) : 0.55 + 0.45 * e(t, A, A + 4.5);   // se arrima a la prenda (o en el cierre se aleja de la cara a la silueta entera)
  const sc = cierre ? 1.1 + 0.3 * k : 1 + (z - 1) * k, mix = n === 0 || cierre ? 1 : e(t, A + 0.1, A + 1.1), out = e(t, f.b - 0.3, f.b);
  const glow = n > 0 && !cierre ? Math.sin(Math.PI * mix) * 0.14 : cierre ? -0.22 * (1 - e(t, A + 4, A + 9)) : 0;
  // cierre: el maniquí se viste entero en 1,5 s (h00→h11 de corrido) y recién ahí la cámara se aleja con la luz que sube
  const tl = cierre ? Math.min(11, 11 * Math.min(1, Math.max(0, (t - A) / 4))) : 0, f0 = Math.floor(tl), fr = tl - f0;
  const rev = mix * 130 - 15;
  const tagX = n === 2 ? 1440 : FOCO[n][0] > 0.5 ? 160 : 1380;   // del lado contrario a la prenda; nunca arriba a la izquierda (ahí baja 120 px)   // a la derecha; con el abrigo (que está a la derecha) a la izquierda pero más abajo — nunca arriba a la izquierda
  return (
    <AbsoluteFill style={{ background: "#0b0907", overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${fx * 100}% ${fy * 100}%`, transform: `scale(${sc})`, filter: `brightness(${1 + glow}) blur(${out * 6}px)`, opacity: 1 - out }}>
        {n > 0 && !cierre && <Img src={foto(n - 1)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />}
        {cierre ? <>
          <Img src={foto(f0)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
          {f0 < 11 && <Img src={foto(f0 + 1)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", WebkitMaskImage: `linear-gradient(to bottom, #000 ${fr * 130 - 30}%, transparent ${fr * 130}%)` }} />}
        </> : <Img src={foto(n)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover",
          WebkitMaskImage: n === 0 ? undefined : `linear-gradient(to bottom, #000 ${rev - 15}%, transparent ${rev + 15}%)` }} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(85% 75% at 50% 50%, transparent 55%, rgba(10,7,4,.55) 100%)" }} />
      {n === 2 && <Medias t={t} A={A} out={out} />}
      {!cierre && <div style={{ opacity: 1 - out }}><Etiqueta t={t} f={f} x={tagX} /></div>}
    </AbsoluteFill>
  );
};
export const HILO_RE = /^(hilo\d+|vestida)$/;
