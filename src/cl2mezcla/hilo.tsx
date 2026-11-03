// cl2mezcla · el HILO: el bloque en corte en sus estados (cada cosa con su trabajo, la esponja del agua de más, los gemelos
// bajo la maza, los cristalitos que crecen mientras cura, el repaso) y como RELLENO cuando no hay plano: gira despacio con lo
// que el relato ya le hizo adentro. + el CTA: tarjeta grande con QR encima de lo que haya.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT, BODY, P, cl, e, lerp, spr } from "./lib";
import { Lbl } from "./base";
import { Bloque, BloqueSt, Cam } from "./bloque";
import { glass } from "./kit";
import SECS from "./secciones.json";

const ST = Object.fromEntries(SECS as [string, number][]);
const sec = (k: string) => ST[k] ?? 1e9;
const cam = (ry: number, rx = 22, sc = 300, cx = 960, cy = 700): Cam => ({ ry, rx, sc, cx, cy });
// cómo está el bloque a esta altura del relato: antes del agua, fresco; después del curado, con cristales
const estado = (t: number): BloqueSt => ({
  agua: t < sec("S07") ? 0.15 : 0, fresco: t < sec("S11") ? 0.8 : 1 - e(t, sec("S11"), sec("S11") + 40),
  cris: e(t, sec("S11"), sec("S11") + 60) * 0.9 + 0.1 * e(t, sec("INTRIGA1"), sec("INTRIGA1") + 20),
});
// la maza: cae sobre el bloque en `at`; devuelve el grupo SVG
const Maza: React.FC<{ t: number; at: number; x: number; y: number; s?: number }> = ({ t, at, x, y, s = 1 }) => {
  const u = t - at, ang = u < 0 ? lerp(-70, 0, cl((u + 0.5) / 0.5) ** 2) : -6 * Math.exp(-u * 6) * Math.sin(u * 30);
  if (u < -0.9 || u > 1.6) return null;
  return (
    <g transform={`translate(${x + 260 * s},${y}) rotate(${ang}) scale(${s})`} opacity={cl((u + 0.9) * 4) * (1 - e(t, at + 1.2, at + 1.6))}>
      <rect x={-470} y={-12} width={420} height={26} rx={12} fill="#b9873f" stroke="#5e3a1c" strokeWidth={3} />
      <rect x={-560} y={-70} width={110} height={140} rx={14} fill="#55585d" stroke="#25272a" strokeWidth={4} />
    </g>
  );
};

export const Hilo: React.FC<{ t: number; a: number; b: number; m: Record<string, number>; mode: string }> = ({ t, a, b, m, mode }) => {
  const u = t - a;
  let c = cam(20 + u * 3), st = estado(t), lbl: [string, number, string][] = [], extra: React.ReactNode = null;
  if (mode === "trabajo") {
    // cada cosa con su trabajo: primero sólo granos, después la pasta, después el brillo del agua
    c = cam(16 + u * 2, lerp(10, 26, e(t, a, a + 2)), lerp(260, 340, e(t, a, a + 2)), 960, 720);
    st = { agua: 0, fresco: e(t, m.agua ?? a + 4, (m.agua ?? a + 4) + 1), cris: e(t, m.cem ?? a + 2, (m.cem ?? a + 2) + 3) * 0.6 };
    lbl = [["arena: el esqueleto", m.are ?? a + 0.6, C.sand], ["cemento: el pegamento", m.cem ?? a + 2, C.cem], ["agua: lo despierta", m.agua ?? a + 4, C.water]];
  } else if (mode === "esponja") {
    c = cam(24 - u * 2, 24, lerp(300, 380, e(t, a, a + 3)), 960, 720);
    st = { agua: e(t, a + 0.6, a + 4), fresco: 0.2, cris: 0.3 };
    lbl = [["el agua se va", a + 0.8, C.water], ["queda un poro", a + 2.4, C.red]];
  } else if (mode === "gemelos") {
    // dos bloques iguales: al aguado la maza lo parte, al justo le deja una marca
    c = cam(18, 22, 200, 560, 700);
    const c2 = cam(18, 22, 200, 1360, 700), h1 = m.g1 ?? a + 1, h2 = m.g2 ?? a + 4;
    st = { agua: 1, fresco: 0, cris: 0.5, grieta: e(t, h1, h1 + 0.4), roto: e(t, h1 + 0.5, h1 + 1.1), golpe: e(t, h1, h1 + 0.05) * (1 - e(t, h1 + 0.1, h1 + 0.5)) };
    const st2: BloqueSt = { agua: 0, fresco: 0, cris: 0.9, grieta: e(t, h2, h2 + 0.4), frena: true, golpe: e(t, h2, h2 + 0.05) * (1 - e(t, h2 + 0.1, h2 + 0.5)) };
    extra = <>
      <Bloque t={t} cam={c2} st={st2} id={2} />
      <Maza t={t} at={h1} x={560} y={490} s={0.7} />
      <Maza t={t} at={h2} x={1360} y={490} s={0.7} />
    </>;
    lbl = [["con agua de más", a + 0.3, C.red], ["con el agua justa", a + 0.6, C.ok]];
  } else if (mode === "cura") {
    c = cam(14 + u * 2, 26, 340, 960, 720);
    st = { agua: 0, fresco: 0.6 * (1 - e(t, a + 2, a + 5)), cris: e(t, a + 0.5, (m.siete ?? a + 6)) };
    lbl = [["húmeda: crece", a + 0.6, C.water], ["7 días", m.siete ?? a + 6, C.ok]];
  } else if (mode === "recap") {
    c = cam(20 + u * 3, 22, 300, 720, 720);
    st = { agua: 0, fresco: 0, cris: 1 };
  } else { // relleno: el bloque gira despacio con lo que ya tiene adentro
    c = cam(22 + 12 * Math.sin(t * 0.05), 22 + 4 * Math.sin(t * 0.07), 300 + 12 * Math.sin(t * 0.03), 960, 720);
  }
  const rc: [string, string][] = [["arena limpia, sin tierra", "are"], ["portland, el gris común", "por"], ["1 de cemento, 3 de arena", "med"], ["en seco, sin vetas", "sec"], ["agua: cuchara y puño", "agu"], ["mojar antes, lechada", "moj"], ["7 días tapada", "cur"]];
  const lado = mode === "gemelos" ? null : mode === "recap" ? "rc" : "der";
  return (
    <AbsoluteFill style={{ background: `radial-gradient(85% 70% at 50% 40%, #33302b 0%, ${C.night} 72%)` }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", transformOrigin: "50% 55%", transform: `translate(${24 * Math.sin(u * 0.41) + 14 * Math.sin(u * 0.23 + 2)}px,${14 * Math.sin(u * 0.33 + 1)}px) scale(${1.035 + 0.035 * Math.sin(u * 0.27 + 0.5)})` }}>
        <Bloque t={t} cam={c} st={st} id={1} />
        {extra}
      </svg>
      {lado === "der" && lbl.map(([w, at, col], i) => <Lbl key={i} t={t} at={at} text={w} x={1560} y={300 + i * 150} col={col} size={54} />)}
      {mode === "gemelos" && lbl.map(([w, at, col], i) => <Lbl key={i} t={t} at={at} text={w} x={i ? 1360 : 560} y={930} col={col} size={54} />)}
      {mode === "recap" && rc.map(([w, k], i) => m[k] !== undefined && <Lbl key={k} t={t} at={m[k]} text={w} x={1200} y={200 + i * 108} col={i % 2 ? C.sand : C.ink} size={50} align="left" />)}
    </AbsoluteFill>
  );
};

// CTA: tarjeta con QR a la derecha (encima del avatar o del plano); entra con resorte, el QR late una vez al nombrarlo
export const Cta: React.FC<{ t: number; a: number; b: number; m: Record<string, number> }> = ({ t, a, b, m }) => {
  const p = spr(t, a + 0.1, 0.8), out = e(t, b - 0.5, b), beat = 1 + 0.06 * Math.sin(cl((t - (m.qr ?? a)) / 0.6) * Math.PI);
  const items = ["Manual de 76 arreglos", "Humedad, moho y goteras", "El taller con poca plata", "Hoja de compras"];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 70, top: 90, width: 640, height: 900, ...glass(1.2), background: "rgba(24,22,20,.88)", opacity: cl(p * 1.5) * (1 - out), transform: `translateX(${(1 - p) * 300}px)`, display: "flex", flexDirection: "column", alignItems: "center", padding: "36px 40px" }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: C.sand, textTransform: "uppercase" }}>la colección</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.ink, textTransform: "uppercase", lineHeight: 1 }}>El Constructor Libre</div>
        <div style={{ marginTop: 26, background: "white", borderRadius: 22, padding: 18, transform: `scale(${beat})` }}><Img src={staticFile(P + "qr.png")} style={{ width: 360, height: 360, display: "block" }} /></div>
        <div style={{ marginTop: 18, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.ok, textTransform: "uppercase", textAlign: "center" }}>escaneá con la cámara</div>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 34, color: C.cream }}>constructorlibre.com</div>
        <div style={{ marginTop: 22, alignSelf: "stretch" }}>{items.map((w, i) => <div key={w} style={{ fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.dim, opacity: e(t, a + 0.8 + i * 0.25, a + 1.1 + i * 0.25), padding: "4px 0" }}>✓ {w}</div>)}</div>
      </div>
    </AbsoluteFill>
  );
};
