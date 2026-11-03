// cl2heladera · el HILO: la heladera de vidrio en sus estados (calor, frazada, frío, hielo, desagote, no frost, repaso)
// y como RELLENO cuando no hay plano: gira despacio y muestra un punto rojo en cada falla que el video ya nombró.
// + el CTA: tarjeta grande con QR que va ENCIMA de lo que haya (avatar o plano).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT, BODY, P, cl, e, lerp, spr } from "./lib";
import { Lbl } from "./base";
import { Fridge, SPOT, Cam, Dot } from "./vidrio";
import { glass } from "./kit";
import SECS from "./secciones.json";

const ST = Object.fromEntries(SECS as [string, number][]);
// cuándo entra cada falla al relato (sección donde se nombra)
const FALLA: [string, string][] = [["parrilla", "S03"], ["pared", "S04"], ["bandeja", "S05"], ["burlete", "S06"], ["puerta", "S07"], ["carga", "S08"], ["escarcha", "S09"], ["desagote", "S10"], ["ventilador", "S11"], ["boton", "S11"], ["bulbo", "S12"], ["rele", "S14"], ["gas", "S16"]];
const dotsAt = (t: number, recap?: { a: number; b: number }): Dot[] => FALLA.map(([k, s], i) => {
  const t0 = ST[s] ?? 1e9;
  if (recap) { const ti = lerp(recap.a + 1, recap.b - 2, i / (FALLA.length - 1)); return { p: SPOT[k], on: cl((t - recap.a) * 2), col: t > ti ? C.ok : C.red }; }
  return { p: SPOT[k], on: cl((t - t0) * 0.5), col: C.red };
});

const cam = (ry: number, rx = 12, sc = 168, cx = 900, cy = 540): Cam => ({ ry, rx, sc, cx, cy });
export const Hilo: React.FC<{ t: number; a: number; b: number; m: Record<string, number>; mode: string }> = ({ t, a, b, m, mode }) => {
  const u = t - a;
  let c: Cam = cam(-28 + u * 4), st: Partial<React.ComponentProps<typeof Fridge>> = { cold: 0.6 }, lbl: [string, number, string][] = [];
  if (mode === "calor") { c = cam(lerp(-25, -150, e(t, m.atras - 1, m.atras + 2.5)), 14); st = { cold: 1, heat: e(t, a + 1, m.atras + 1) }; lbl = [["saca el calor afuera", m.atras + 0.6, C.heat2]]; }
  else if (mode === "frazada") { c = cam(-160 + u * 2, 10, 188); st = { cold: 0.4, heat: 0.9, lint: e(t, a + 1.2, b - 3) }; lbl = [["pelusa, polvo, pelo", a + 3, "#c9c7bf"]]; }
  else if (mode === "frio") { c = cam(-18 + u * 3, 8, 176); st = { cold: 1, coldTop: e(t, m.apret, m.apret + 1.5) * 0.8 }; lbl = [["baja por un costado", a + 1, C.ice], ["apretada, no llega", m.apret + 0.6, C.red]]; }
  else if (mode === "hielo") { c = cam(-20 + u * 3, 18, 190, 900, 575); st = { cold: 0.8, ice: e(t, a + 1, b - 0.5) }; lbl = [["hielo en las paredes", a + 1.5, C.ice2]]; }
  else if (mode === "desagote") { c = cam(-40 + u * 2, 10, 184); st = { cold: 0.6, dots: [{ p: SPOT.desagote, on: cl((t - m.tapa) * 2) }], ice: 0 }; lbl = [["el agujerito de desagote", a + 1, C.ice2], ["tapado: hielo abajo", m.tapa + 0.6, C.red]]; }
  else if (mode === "nofrost") { c = cam(-22 + u * 2.5, 14, 176); const stop = e(t, m.para, m.para + 0.6); st = { cold: 1, fan: 1 - stop, coldTop: stop, dots: [{ p: SPOT.ventilador, on: stop }] }; lbl = [["el ventilador reparte", a + 1.2, C.ice], ["parado: abajo no llega", m.para + 0.5, C.red]]; }
  else if (mode === "recap") { c = cam(-30 + u * 6, 12, 165, 960); st = { cold: 0.9, dots: dotsAt(t, { a, b }) }; }
  else { // relleno: gira lento, con las fallas ya nombradas
    c = cam(-35 + 30 * Math.sin(t * 0.05), 10 + 4 * Math.sin(t * 0.07), 164 + 6 * Math.sin(t * 0.03), 960);
    st = { cold: 0.7, heat: t > (ST.S02 ?? 1e9) ? 0.5 : 0, dots: dotsAt(t) };
  }
  return (
    <AbsoluteFill style={{ background: `radial-gradient(80% 70% at 50% 45%, #0d2233 0%, ${C.night} 70%)` }}>
      <Fridge t={t} cam={c} {...st} />
      {lbl.map(([w, at, col], i) => <Lbl key={i} t={t} at={at} out={lbl[i + 1] && i === 1 ? 1e9 : undefined} text={w} x={i ? 1580 : 1560} y={i ? 820 : 300} col={col} size={58} />)}
    </AbsoluteFill>
  );
};

// CTA: tarjeta con QR a la derecha (encima del avatar o del plano); entra con resorte, el QR late una vez al nombrarlo
export const Cta: React.FC<{ t: number; a: number; b: number; m: Record<string, number> }> = ({ t, a, b, m }) => {
  const p = spr(t, a + 0.1, 0.8), out = e(t, b - 0.5, b), beat = 1 + 0.06 * Math.sin(cl((t - m.qr) / 0.6) * Math.PI);
  const items = ["Manual de 76 arreglos", "Humedad, moho y goteras", "El taller con poca plata", "Fichas para la heladera"];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 70, top: 90, width: 640, height: 900, ...glass(1.2), background: "rgba(8,22,34,.86)", opacity: cl(p * 1.5) * (1 - out), transform: `translateX(${(1 - p) * 300}px)`, display: "flex", flexDirection: "column", alignItems: "center", padding: "36px 40px" }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: C.heat2, textTransform: "uppercase" }}>la colección</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.ink, textTransform: "uppercase", lineHeight: 1 }}>El Constructor Libre</div>
        <div style={{ marginTop: 26, background: "white", borderRadius: 22, padding: 18, transform: `scale(${beat})` }}><Img src={staticFile(P + "qr.png")} style={{ width: 360, height: 360, display: "block" }} /></div>
        <div style={{ marginTop: 18, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.ok, textTransform: "uppercase", textAlign: "center" }}>escaneá con la cámara</div>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 34, color: C.ice2 }}>constructorlibre.com</div>
        <div style={{ marginTop: 22, alignSelf: "stretch" }}>{items.map((w, i) => <div key={w} style={{ fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.dim, opacity: e(t, a + 0.8 + i * 0.25, a + 1.1 + i * 0.25), padding: "4px 0" }}>✓ {w}</div>)}</div>
      </div>
    </AbsoluteFill>
  );
};
