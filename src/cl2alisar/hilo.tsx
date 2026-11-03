// cl2alisar · el HILO: la pared en capas en sus estados (la pared cruda con rebabas, la humedad que la descarta, la regla que
// mide la panza, el puente, la primera mano cruzada, las olas que muestra la linterna, el enduido, la malla del encuentro, el
// repaso) y como RELLENO cuando no hay plano: la pared gira apenas con lo que el relato ya le hizo. + el CTA con QR.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT, BODY, P, cl, e, lerp, spr } from "./lib";
import { Lbl } from "./base";
import { Pared, ParSt } from "./pared";
import { glass } from "./kit";
import SECS from "./secciones.json";

const ST = Object.fromEntries(SECS as [string, number][]);
const sec = (k: string) => ST[k] ?? 1e9;
// cómo está la pared a esta altura del relato
const estado = (t: number): ParSt => ({
  pego: 1 - e(t, sec("S04"), sec("S04") + 40), moja: t > sec("S06") && t < sec("S09") ? 1 : 0,
  puente: t > sec("S07") ? 1 : 0, prim: e(t, sec("S09"), sec("S09") + 40), olas: t > sec("S09") ? 1 : 0,
  end: e(t, sec("S12"), sec("S12") + 60), malla: t > sec("INTRIGA3") ? 1 : 0, pint: e(t, sec("S14"), sec("S14") + 40),
});

export const Hilo: React.FC<{ t: number; a: number; b: number; m: Record<string, number>; mode: string }> = ({ t, a, b, m, mode }) => {
  const u = t - a;
  let st = estado(t), x = 900, y = 860, s = 0.95, giro = t * 0.05, lbl: [string, number, string][] = [];
  if (mode === "cruda") {
    const k = m.pego ?? a + 2;
    st = { ...st, pego: 1, prim: 0, end: 0, pint: 0, puente: 0 };
    lbl = [["ladrillo hueco", a + 0.6, C.lad3], ["pegotes en las juntas", k, C.mort]];
  } else if (mode === "humedad") {
    const k = m.hum ?? a + 2;
    st = { ...st, prim: 0, end: 0, pint: 0, hum: e(t, k, k + 2) };
    lbl = [["los primeros 50 cm", a + 0.6, C.ink], ["mancha y sal: no", k + 1, C.red]];
  } else if (mode === "regla") {
    const k = m.regla ?? a + 1.5;
    st = { ...st, pego: 0, prim: 0, end: 0, pint: 0, regla: e(t, k, k + 1.2) };
    lbl = [["menos de un dedo", k + 1.5, C.ok], ["más: va revoque", k + 4, C.red]];
  } else if (mode === "puente") {
    const k = m.pinta ?? a + 2;
    st = { ...st, pego: 0, moja: 1, puente: e(t, k, k + 2), prim: 0, end: 0, pint: 0 };
    lbl = [["pared húmeda", a + 0.6, C.agua], ["puente pegajoso", k + 0.8, C.puente]];
  } else if (mode === "primera") {
    const k = m.llana ?? a + 2;
    st = { ...st, pego: 0, puente: 1, prim: e(t, k, b - 1), olas: 1, end: 0, pint: 0 };
    lbl = [["3 a 5 milímetros", k + 1, C.prim], ["tapa juntas y poros", k + 3, C.ink]];
  } else if (mode === "olas") {
    const k = m.luz ?? a + 2, f = m.llena ?? a + 7;
    st = { ...st, pego: 0, puente: 1, prim: 1, olas: 1 - e(t, f, f + 4) * 0.9, end: 0, pint: 0, luz: e(t, k, k + 1) };
    giro = 0.4 + u * 0.03;
    lbl = [["de frente: lisa", a + 0.6, C.ink], ["de costado: olas", k + 0.8, C.luz], ["espátula ancha", f, C.ok]];
  } else if (mode === "enduido") {
    const k = m.cruz ?? a + 3;
    st = { ...st, pego: 0, puente: 1, prim: 1, olas: 0.1, end: e(t, a + 1, b - 1), pint: 0 };
    lbl = [["un milímetro", a + 1.2, C.end], ["vertical y horizontal", k, C.honey]];
  } else if (mode === "malla") {
    const f = m.raja ?? a + 3, k = m.malla ?? a + 8;
    st = { ...st, pego: 0, puente: 1, prim: 1, olas: 0, end: e(t, k + 2, k + 5), pint: 0, fisura: e(t, f, f + 1.5) * (1 - e(t, k, k + 0.6)), malla: e(t, k, k + 1.6) };
    giro = 0.7 + u * 0.03;
    lbl = [["ladrillo contra hormigón", a + 0.6, C.horm], ["se raja el encuentro", f + 0.4, C.red], ["malla de fibra", k + 0.6, C.malla]];
  } else if (mode === "recap") {
    st = { pego: 0, puente: 1, prim: 1, olas: 0, end: 1, malla: 1, pint: e(t, a + 1, a + 3) };
    x = 640; s = 0.82;
  } else { // relleno
    s = 0.93 + 0.02 * Math.sin(t * 0.07);
  }
  const rc: [string, string][] = [["humedad y regla", "pru"], ["rebabas fuera", "reb"], ["pared mojada", "moj"], ["puente pegajoso", "pue"], ["primera cruzada", "pri"], ["linterna rasante", "lin"], ["enduido cruzado", "end"], ["lija y fijador", "lij"]];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(85% 70% at 50% 40%, #34312c 0%, ${C.night} 72%)` }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <line x1={0} x2={1920} y1={y + 20} y2={y + 20} stroke="rgba(255,236,200,.12)" strokeWidth={2} />
        <g transform={`translate(0,${(1 - spr(t, a, 0.8)) * 60})`}><Pared t={t} x={x} y={y} s={s} st={st} giro={giro} /></g>
      </svg>
      {mode !== "recap" && lbl.map(([w, at, col], i) => <Lbl key={i} t={t} at={at} text={w} x={1580} y={760 + i * 100} col={col} size={50} />)}
      {mode === "recap" && rc.map(([w, k], i) => m[k] !== undefined && <Lbl key={k} t={t} at={m[k]} text={w} x={1180} y={200 + i * 92} col={i % 2 ? C.honey : C.ink} size={48} align="left" />)}
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
