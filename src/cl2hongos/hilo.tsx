// cl2hongos · el HILO: el cantero de vidrio en sus estados (el hongo en corte, la tierra que moja, el medio ladrillo, la luz
// de noche, el repaso) y como RELLENO cuando no hay plano: gira despacio y va mostrando los hongos que el video ya hizo, con un
// punto rojo donde estuvo cada error. + el CTA: tarjeta grande con QR encima de lo que haya (avatar o plano).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT, BODY, P, cl, e, lerp, spr } from "./lib";
import { Lbl } from "./base";
import { Cantero, Cam, HongoSt, V3 } from "./cantero";
import { glass } from "./kit";
import SECS from "./secciones.json";

const ST = Object.fromEntries(SECS as [string, number][]);
const sec = (k: string) => ST[k] ?? 1e9;
const G: V3 = [-0.55, 0, 0.15], M: V3 = [0.45, 0, -0.25], Ch: V3 = [1.0, 0, 0.35];
// cómo están los tres hongos a esta altura del relato (lo que el video ya hizo)
const estado = (t: number, extra: Partial<HongoSt> = {}, marcas = false): { p: V3; st: HongoSt }[] => {
  const pin = cl((t - sec("S15")) / 20), dot = cl((t - sec("S16")) / 12), err = marcas ? cl((t - sec("ERRORES")) * 0.5) : 0;
  return [
    { p: G, st: { on: cl((t - sec("S03")) * 0.4), tam: 0.62, paint: pin, dots: dot, seed: 3, marca: err, ...extra } },
    { p: M, st: { on: cl((t - sec("S07")) * 0.4), tam: 0.42, paint: pin, dots: dot, seed: 7, ...extra } },
    { p: Ch, st: { on: cl((t - sec("S07") - 3) * 0.4), tam: 0.28, paint: pin, dots: dot, seed: 11, ...extra } },
  ];
};
const cam = (ry: number, rx = 16, sc = 300, cx = 900, cy = 640): Cam => ({ ry, rx, sc, cx, cy });

export const Hilo: React.FC<{ t: number; a: number; b: number; m: Record<string, number>; mode: string }> = ({ t, a, b, m, mode }) => {
  const u = t - a;
  let c = cam(-18 + u * 2), H = estado(t, {}, true), lbl: [string, number, string][] = [], over: Partial<React.ComponentProps<typeof Cantero>> = {};
  if (mode === "seccion") {
    const k = e(t, a + 0.4, a + 2);
    c = cam(lerp(-18, -6, k), 10, lerp(300, 420, k), lerp(900, 1180, k), 700);
    H = estado(t).map((h, i) => (i ? { ...h, st: { ...h.st, on: h.st.on * (1 - k * 0.7) } } : { ...h, st: { ...h.st, on: 1, corte: e(t, m.corte, m.corte + 0.8), paint: 0, dots: 0 } }));
    lbl = [["el alambre, adentro", m.corte + 0.6, C.red], ["de la llave", m.llave, C.sun]];
  } else if (mode === "humedad") {
    c = cam(-14 + u * 1.5, 12, 330);
    const ag = e(t, m.chupa, m.chupa + 3), hi = e(t, m.hiela, m.hiela + 1.5);
    over = { humedad: 1, hielo: hi };
    H = estado(t, { agua: ag, grieta: e(t, m.hiela + 1, m.hiela + 3) });
    lbl = [["la tierra moja", a + 0.8, C.water], ["la helada cuartea", m.hiela + 0.4, C.red]];
  } else if (mode === "ladrillo") {
    c = cam(-10 + u * 1.5, 12, 330);
    over = { humedad: 1, ladrillo: e(t, m.lad, m.lad + 1) };
    H = estado(t, { agua: 1 - e(t, m.lad + 0.6, m.lad + 2) });
    lbl = [["medio ladrillo abajo", m.lad + 0.5, C.cream], ["el tallo, seco", m.seco + 0.3, C.ok]];
  } else if (mode === "noche") {
    c = cam(-16 + u * 1.2, 14, 320);
    over = { noche: e(t, a, a + 1.2), ladrillo: 1 };
    H = estado(t, { luz: e(t, m.luz, m.luz + 1.5) });
    lbl = [["una luz solar adentro", m.luz + 0.3, C.sun]];
  } else if (mode === "recap") {
    c = cam(-30 + u * 1.2, 14, 300, 960);
    over = { ladrillo: 1 };
    H = estado(t, { paint: 1, dots: 1 });
  } else { // relleno: gira lento, con lo que ya se hizo y un punto rojo en los errores
    c = cam(-22 + 18 * Math.sin(t * 0.05), 14 + 3 * Math.sin(t * 0.07), 290 + 10 * Math.sin(t * 0.03), 960);
    over = { ladrillo: t > sec("S17") ? 1 : 0 };
  }
  return (
    <AbsoluteFill style={{ background: `radial-gradient(85% 70% at 50% 40%, #3a2c18 0%, ${C.night} 72%)` }}>
      <Cantero t={t} cam={c} hongos={H} {...over} />
      {lbl.map(([w, at, col], i) => <Lbl key={i} t={t} at={at} text={w} x={i ? 1560 : 1540} y={i ? 820 : 230} col={col} size={58} />)}
    </AbsoluteFill>
  );
};

// CTA: tarjeta con QR a la derecha (encima del avatar o del plano); entra con resorte, el QR late una vez al nombrarlo
export const Cta: React.FC<{ t: number; a: number; b: number; m: Record<string, number> }> = ({ t, a, b, m }) => {
  const p = spr(t, a + 0.1, 0.8), out = e(t, b - 0.5, b), beat = 1 + 0.06 * Math.sin(cl((t - (m.qr ?? a)) / 0.6) * Math.PI);
  const items = ["Manual de 76 arreglos", "Humedad, moho y goteras", "El taller con poca plata", "Hoja de compras"];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 70, top: 90, width: 640, height: 900, ...glass(1.2), background: "rgba(30,22,12,.88)", opacity: cl(p * 1.5) * (1 - out), transform: `translateX(${(1 - p) * 300}px)`, display: "flex", flexDirection: "column", alignItems: "center", padding: "36px 40px" }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: C.sun, textTransform: "uppercase" }}>la colección</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.ink, textTransform: "uppercase", lineHeight: 1 }}>El Constructor Libre</div>
        <div style={{ marginTop: 26, background: "white", borderRadius: 22, padding: 18, transform: `scale(${beat})` }}><Img src={staticFile(P + "qr.png")} style={{ width: 360, height: 360, display: "block" }} /></div>
        <div style={{ marginTop: 18, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.ok, textTransform: "uppercase", textAlign: "center" }}>escaneá con la cámara</div>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 34, color: C.cream }}>constructorlibre.com</div>
        <div style={{ marginTop: 22, alignSelf: "stretch" }}>{items.map((w, i) => <div key={w} style={{ fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.dim, opacity: e(t, a + 0.8 + i * 0.25, a + 1.1 + i * 0.25), padding: "4px 0" }}>✓ {w}</div>)}</div>
      </div>
    </AbsoluteFill>
  );
};
