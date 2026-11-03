// cl2macetas · el HILO: la maceta en medio corte en sus estados (qué hay en la pared, la piel que tapa el vidrio, la lija que
// lo revela, el agujero hecho con corcho, el gel que hincha y raja, el repaso) y como RELLENO cuando no hay plano: gira despacio
// con lo que el relato ya le hizo. + el CTA: tarjeta grande con QR encima de lo que haya.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT, BODY, P, cl, e, lerp, spr } from "./lib";
import { Lbl } from "./base";
import { Maceta, MacSt } from "./maceta";
import { glass } from "./kit";
import SECS from "./secciones.json";

const ST = Object.fromEntries(SECS as [string, number][]);
const sec = (k: string) => ST[k] ?? 1e9;
// cómo está la maceta a esta altura del relato: sin pasta hasta la mezcla, con piel hasta que se lija, sellada al final
const estado = (t: number): MacSt => ({
  vidrio: t < sec("S08") ? 0.5 : 1, pasta: t < sec("S07") ? 0 : 1, molde: t > sec("S10") && t < sec("S13") ? 1 : 0,
  piel: t < sec("INTRIGA1") ? 1 : 0, revela: t < sec("INTRIGA1") ? 0 : 1, sello: e(t, sec("S16"), sec("S16") + 30),
  corcho: t > sec("S10") ? 1 : 0, hueco: t > sec("INTRIGA2") ? 1 : 0, fresco: t > sec("S13") && t < sec("S14") + 60 ? 0.6 : 0,
});

export const Hilo: React.FC<{ t: number; a: number; b: number; m: Record<string, number>; mode: string }> = ({ t, a, b, m, mode }) => {
  const u = t - a;
  let st = estado(t), rot = t * 0.12, x = 960, y = 900, s = 1, lbl: [string, number, string][] = [];
  if (mode === "corte") {
    // qué hay en la pared: primero los dos moldes vacíos, después el vidrio suelto, después la pasta que lo abraza
    const v = m.vid ?? a + 2, p = m.pas ?? a + 4;
    st = { ...st, molde: 1 - e(t, p + 2, p + 3), vidrio: e(t, v, v + 1.5), pasta: e(t, p, p + 1.2), piel: 0, revela: 1, sello: 0, corcho: 0, hueco: 0 };
    x = 820; lbl = [["cemento blanco", m.cem ?? a + 0.6, C.cem], ["vidrio: los dibujos", v, C.verde], ["marmolina: la piedra", p, C.marm]];
  } else if (mode === "piel") {
    const k = m.piel ?? a + 3;
    st = { ...st, molde: 0, piel: 1, revela: 0, pasta: 1, vidrio: 1, fresco: 0.4, corcho: 1, hueco: 0 };
    x = 820; rot = 0.6 + u * 0.08; lbl = [["sale gris y opaca", a + 0.5, C.cem2], ["medio milímetro de piel", k, C.sun]];
  } else if (mode === "revela") {
    const k = m.lija ?? a + 2;
    st = { ...st, piel: 1, revela: e(t, k, b - 1), sello: 0, corcho: 1, hueco: 0 };
    x = 820; rot = 0.4 + u * 0.05; lbl = [["agua lechosa: la piel", k, C.marm], ["aparece el vidrio", k + 3, C.verde]];
  } else if (mode === "agujero") {
    const k = m.sale ?? a + 3;
    st = { ...st, piel: 0, revela: 1, corcho: 1, hueco: e(t, k, k + 1.2) };
    x = 820; lbl = [["corcho antes de llenar", a + 0.6, C.honey], ["agujero sin rajadura", k + 0.8, C.ok]];
  } else if (mode === "gel") {
    const k = m.gel ?? a + 3, r = m.raja ?? a + 6;
    st = { ...st, piel: 0, revela: 1, sello: 0, gel: e(t, k, k + 3), raja: e(t, r, r + 1.5), corcho: 1, hueco: 1 };
    x = 820; lbl = [["agua + vidrio + cemento", a + 0.6, C.water], ["el gel hincha", k + 0.5, C.sun], ["raja desde adentro", r + 0.4, C.red]];
  } else if (mode === "recap") {
    st = { ...st, piel: 0, revela: 1, sello: 1, corcho: 1, hueco: 1, planta: e(t, a + 1, a + 3) };
    x = 640; s = 0.92;
  } else { // relleno
    rot = t * 0.1; s = 0.95 + 0.02 * Math.sin(t * 0.07);
  }
  const rc: [string, string][] = [["botellas lavadas, sin etiqueta", "lav"], ["rotas en doble bolsa", "rom"], ["tamizadas, sin polvo", "tam"], ["moldes con 2,5 cm", "mol"], ["1 blanco, 2 marmolina", "mez"], ["24 h y una semana húmeda", "cur"], ["lija al agua y trapo", "lij"], ["sello con pincel", "sel"]];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(85% 70% at 50% 40%, #34312c 0%, ${C.night} 72%)` }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <line x1={0} x2={1920} y1={y + 2} y2={y + 2} stroke="rgba(255,236,200,.12)" strokeWidth={2} />
        <g transform={`translate(0,${(1 - spr(t, a, 0.8)) * 60})`}><Maceta t={t} x={x} y={y} s={s * 0.95} st={st} rot={rot} id={1} /></g>
      </svg>
      {mode !== "recap" && lbl.map(([w, at, col], i) => <Lbl key={i} t={t} at={at} text={w} x={1560} y={330 + i * 150} col={col} size={52} />)}
      {mode === "recap" && rc.map(([w, k], i) => m[k] !== undefined && <Lbl key={k} t={t} at={m[k]} text={w} x={1130} y={180 + i * 96} col={i % 2 ? C.honey : C.ink} size={46} align="left" />)}
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
export const _lerp = lerp;
