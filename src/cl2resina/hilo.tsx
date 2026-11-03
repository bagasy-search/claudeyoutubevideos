// cl2resina · el HILO: el frasco de vidrio en sus estados (el telgopor que se hunde, el frasco que traga, la mano que tiñe la
// veta, la superficie que se vuelve espejo, el frasco de cubiertos que sale cristalino, el repaso) y como RELLENO cuando no hay
// plano: gira despacio con lo que el video ya hizo adentro. + el CTA: tarjeta grande con QR encima de lo que haya.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT, BODY, P, cl, e, hash, lerp, spr } from "./lib";
import { Lbl } from "./base";
import { Frasco, FrascoSt, Cam, Pedazo } from "./frasco";
import { glass } from "./kit";
import SECS from "./secciones.json";

const ST = Object.fromEntries(SECS as [string, number][]);
const sec = (k: string) => ST[k] ?? 1e9;
const cam = (ry: number, rx = 14, sc = 300, cx = 960, cy = 800): Cam => ({ ry, rx, sc, cx, cy });
// cómo está el frasco a esta altura del relato
const estado = (t: number): FrascoSt => {
  const dis = cl((t - sec("S05")) / 60), esp = cl((t - sec("S06")) / 90);
  const lech = t < sec("S08") ? cl((t - sec("S05")) / 40) : 1 - e(t, sec("S08") + 20, sec("INTRIGA1"));
  return { nivel: t < sec("S05") ? 0 : 0.5 + 0.1 * dis, visc: Math.max(0.05 + 0.3 * dis, 0.66 * esp), milk: 0.8 * lech, tapa: t < sec("S05") ? 1 : 0.6 + 0.4 * Math.round(hash(Math.floor(t / 20), 3)), burb: 0.3 * lech };
};
// pedacitos que caen al frasco a partir de t0, uno cada `cada` segundos; cada uno se hunde y se deshace en ~2,5 s
const lluvia = (t: number, t0: number, n: number, cada: number, s = 0.22): Pedazo[] =>
  Array.from({ length: n }, (_, i) => {
    const a = t0 + i * cada, u = t - a;
    if (u < 0) return null;
    const y = u < 0.5 ? lerp(1.9, 0.75, u / 0.5) : lerp(0.75, 0.25, cl((u - 0.5) / 2));
    return { p: [(hash(i, 1) - 0.5) * 0.5, y, (hash(i, 2) - 0.5) * 0.4] as [number, number, number], s, d: cl((u - 0.6) / 2.2) };
  }).filter(Boolean) as Pedazo[];

export const Hilo: React.FC<{ t: number; a: number; b: number; m: Record<string, number>; mode: string }> = ({ t, a, b, m, mode }) => {
  const u = t - a;
  let c = cam(-20 + u * 6), st = estado(t), lbl: [string, number, string][] = [], fondo: React.ReactNode = null, otro: React.ReactNode = null;
  if (mode === "hunde") {
    const k = e(t, a, a + 1.5);
    c = cam(-10 + u * 3, lerp(14, 22, k), lerp(300, 420, k), 960, 860);
    st = { nivel: 0.5, visc: 0.1, milk: 0.1, tapa: 0, burb: 0.4, ped: lluvia(t, m.toca - 0.6, 3, 1.4, 0.34) };
    lbl = [["el aire se escapa", m.toca + 0.8, C.solv], ["el plástico se derrite", m.toca + 2.2, C.honey]];
  } else if (mode === "traga") {
    c = cam(-30 + u * 8, 18, 340, 960, 860);
    st = { nivel: 0.5 + 0.06 * cl(u / 8), visc: lerp(0.1, 0.3, cl(u / 10)), milk: lerp(0.1, 0.6, cl(u / 8)), tapa: 0, burb: 0.6, ped: lluvia(t, a + 0.4, 14, 0.7, 0.26) };
    lbl = [["se hunde solo", a + 0.8, C.solv], ["y otro, y otro", m.otro, C.honey]];
  } else if (mode === "lupa") {
    // el frasco se inclina y deja una capa finita sobre la veta: la mitad tratada se oscurece y se aviva
    c = cam(-8, 20, 260, 1420, 560);
    st = { nivel: 0.45, visc: 0.3, milk: 0, tapa: 0 };
    const k = e(t, a + 0.6, a + 3.2);
    fondo = (
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs><clipPath id="vt"><rect x={0} y={0} width={1920 * k} height={1080} /></clipPath></defs>
        <rect width={1920} height={1080} fill="#b07a46" />
        {Array.from({ length: 34 }, (_, i) => <path key={i} d={`M-50,${i * 34 + 10} C 400,${i * 34 + 40 * Math.sin(i)} 900,${i * 34 - 30 + 20 * Math.cos(i * 1.3)} 1980,${i * 34 + 15}`} stroke="#7d5129" strokeWidth={2 + 3 * hash(i, 4)} fill="none" opacity={0.7} />)}
        <g clipPath="url(#vt)"><rect width={1920} height={1080} fill="rgba(110,52,10,.45)" />
          {Array.from({ length: 34 }, (_, i) => <path key={i} d={`M-50,${i * 34 + 10} C 400,${i * 34 + 40 * Math.sin(i)} 900,${i * 34 - 30 + 20 * Math.cos(i * 1.3)} 1980,${i * 34 + 15}`} stroke="#4a2408" strokeWidth={2 + 3 * hash(i, 4)} fill="none" opacity={0.85} />)}
</g>
        <line x1={1920 * k} y1={0} x2={1920 * k} y2={1080} stroke="rgba(255,236,200,.6)" strokeWidth={3} opacity={k > 0.02 && k < 0.98 ? 1 : 0} />
      </svg>
    );
    lbl = [["sin nada", a + 0.4, C.cream], ["con la primera mano", a + 1.8, C.honey]];
  } else if (mode === "espejo") {
    c = cam(-6 + u * 1.5, lerp(14, 34, e(t, a, a + 2)), 380, 960, 820);
    st = { nivel: 0.82, visc: 0.66, milk: 0, tapa: 0, reflejo: e(t, a + 1, a + 3) };
    lbl = [["se nivela sola", a + 0.8, C.honey], ["lisa como espejo", a + 2.6, C.sun]];
  } else if (mode === "cristal") {
    c = cam(-14 + u * 3, 14, 250, 640, 820);
    st = { nivel: 0.6, visc: 0.66, milk: 0.85, tapa: 1, burb: 0.4 };
    const c2 = cam(-14 + u * 3, 14, 250, 1300, 820);
    otro = <Frasco t={t} cam={c2} id={2} st={{ nivel: 0.6, visc: 0.62, milk: 0, tapa: 1, ped: lluvia(t, a - 0.6, 3, 0.9, 0.18).map((q) => ({ ...q, s: q.s * 0.6 })) }} />;
    lbl = [["telgopor: lechosa", a + 0.5, C.milk], ["cubiertos: cristal", a + 1.6, C.ok]];
  } else if (mode === "recap") {
    c = cam(-30 + u * 4, 14, 320, 760, 820);
    st = { nivel: 0.7, visc: 0.66, milk: 0, tapa: 1, reflejo: 0.6, burb: 0.5 };
  } else { // relleno: el frasco gira despacio con lo que ya tiene adentro
    c = cam(-24 + 26 * Math.sin(t * 0.04), 14 + 4 * Math.sin(t * 0.07), 300 + 12 * Math.sin(t * 0.03), 960, 820);
  }
  const rc: [string, string][] = [["vidrio y tapa de metal", "vid"], ["thinner fuerte, no alcohol", "dis"], ["telgopor limpio y seco", "tel"], ["la gota que no se abre", "gota"], ["lijar a favor de la veta", "made"], ["capas finas, 6 a 8 h", "capas"], ["ventana abierta, sin fuego", "fuego"]];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(85% 70% at 50% 40%, #3b2a16 0%, ${C.night} 72%)` }}>
      {fondo}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", transformOrigin: "50% 55%", transform: `translate(${24 * Math.sin(u * 0.41) + 14 * Math.sin(u * 0.23 + 2)}px,${14 * Math.sin(u * 0.33 + 1)}px) scale(${1.035 + 0.035 * Math.sin(u * 0.27 + 0.5)})` }}>
        <Frasco t={t} cam={c} st={st} id={1} />
        {otro}
      </svg>
      {lbl.map(([w, at, col], i) => <Lbl key={i} t={t} at={at} text={w} x={mode === "lupa" ? (i ? 1200 : 420) : 1500} y={mode === "lupa" ? 940 : i ? 820 : 400} col={col} size={58} />)}
      {mode === "recap" && rc.map(([w, k], i) => m[k] !== undefined && <Lbl key={k} t={t} at={m[k]} text={w} x={1180} y={180 + i * 112} col={i % 2 ? C.honey : C.ink} size={50} align="left" />)}
    </AbsoluteFill>
  );
};

// CTA: tarjeta con QR a la derecha (encima del avatar o del plano); entra con resorte, el QR late una vez al nombrarlo
export const Cta: React.FC<{ t: number; a: number; b: number; m: Record<string, number> }> = ({ t, a, b, m }) => {
  const p = spr(t, a + 0.1, 0.8), out = e(t, b - 0.5, b), beat = 1 + 0.06 * Math.sin(cl((t - (m.qr ?? a)) / 0.6) * Math.PI);
  const items = ["Manual de 76 arreglos", "Humedad, moho y goteras", "El taller con poca plata", "Hoja de compras"];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 70, top: 90, width: 640, height: 900, ...glass(1.2), background: "rgba(30,20,10,.88)", opacity: cl(p * 1.5) * (1 - out), transform: `translateX(${(1 - p) * 300}px)`, display: "flex", flexDirection: "column", alignItems: "center", padding: "36px 40px" }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: C.honey, textTransform: "uppercase" }}>la colección</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.ink, textTransform: "uppercase", lineHeight: 1 }}>El Constructor Libre</div>
        <div style={{ marginTop: 26, background: "white", borderRadius: 22, padding: 18, transform: `scale(${beat})` }}><Img src={staticFile(P + "qr.png")} style={{ width: 360, height: 360, display: "block" }} /></div>
        <div style={{ marginTop: 18, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.ok, textTransform: "uppercase", textAlign: "center" }}>escaneá con la cámara</div>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 34, color: C.cream }}>constructorlibre.com</div>
        <div style={{ marginTop: 22, alignSelf: "stretch" }}>{items.map((w, i) => <div key={w} style={{ fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.dim, opacity: e(t, a + 0.8 + i * 0.25, a + 1.1 + i * 0.25), padding: "4px 0" }}>✓ {w}</div>)}</div>
      </div>
    </AbsoluteFill>
  );
};
