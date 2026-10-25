// cn30semana · piezas de Chencho (tanda de 30 min): papel de cuaderno, lámina, tinta a mano y colores de pueblo
// (barro, guinda, maíz, nopal). Todas data-driven desde ov.json; cada una entra con la frase que se dice en ese segundo.
import React from "react";
import { Img, staticFile } from "remotion";
import { CH, FONT, HAND, P, SERIF, e, ei, spr } from "./lib";

const sh = "0 30px 60px rgba(0,0,0,.55)";
const oo = (t: number, a: number, out: number, fi = 0.18, fo = 0.3) => e(t, a, a + fi) * (1 - e(t, out, out + fo));
const pop = (t: number, at: number, k = 1) => Math.min(1.06, spr(t, at, k));
const fmt = (n: number) => n.toLocaleString("en-US");
const cnt = (t: number, a: number, b: number, to: number) => Math.round(to * ei(t, a, b));

// pestaña de capítulo: número grande de barro + título a mano, sobre una tira de papel
export const Pestana: React.FC<{ t: number; at: number; out: number; n: string; title: string; kicker?: string }> = ({ t, at, out, n, title, kicker }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1, pop(t, at, 0.9)), w = e(t, at + 0.25, at + 1.1);
  return <div style={{ position: "absolute", left: 110, top: 120, opacity: o, transform: `translateX(${(1 - k) * -520}px) rotate(-2deg)` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 26, padding: "18px 40px 18px 26px", background: CH.papel, borderRadius: 12, boxShadow: sh, borderLeft: `16px solid ${CH.barro}` }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 120, lineHeight: 1, color: CH.barro }}>{n}</div>
      <div>
        {kicker && <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 26, letterSpacing: 6, color: CH.nopal }}>{kicker}</div>}
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 70, lineHeight: 1.05, color: CH.tinta, maxWidth: 980, clipPath: `inset(-20% ${100 - 100 * w}% -20% 0)` }}>{title}</div>
      </div>
    </div>
  </div>;
};

// precio: lo que me cuesta a mí contra lo que te cobran afuera (el de afuera se tacha)
export const Precio: React.FC<{ t: number; at: number; out: number; yo: number; afuera: number; lyo?: string; lafuera?: string; x?: number; y?: number }> = ({ t, at, out, yo, afuera, lyo = "EN MI CASA", lafuera = "EN LA FONDA", x = 1380, y = 520 }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const k1 = Math.min(1, pop(t, at, 0.9)), k2 = Math.min(1, pop(t, at + 0.9, 0.9)), cross = e(t, at + 0.5, at + 0.9);
  const card = (lab: string, v: number, col: string, k: number, tachar: boolean, a0: number) => (
    <div style={{ width: 300, padding: "16px 10px 18px", background: CH.papel, borderRadius: 14, boxShadow: sh, textAlign: "center", transform: `scale(${0.6 + 0.4 * k})`, opacity: Math.min(1, k * 1.5), position: "relative" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 26, letterSpacing: 3, color: CH.tinta }}>{lab}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 112, lineHeight: 1.05, color: col }}>${fmt(cnt(t, a0, a0 + 0.7, v))}</div>
      {tachar && <div style={{ position: "absolute", left: 20, top: "56%", height: 12, width: `${86 * cross}%`, background: CH.guinda, borderRadius: 6, transform: "rotate(-9deg)" }} />}
    </div>);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 26, alignItems: "center" }}>
    {card(lafuera, afuera, CH.guinda, k1, true, at)}
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 60, color: "#fff", textShadow: "0 6px 18px #000", opacity: k2 }}>→</div>
    {card(lyo, yo, CH.nopal, k2, false, at + 0.9)}
  </div>;
};

// la cuenta del cuaderno: renglones que se escriben con la voz y el total que se va sumando
export const Cuenta: React.FC<{ t: number; at: number; out: number; title: string; rows: { at: number; tx: string; v?: number }[]; total?: string; totalAt?: number; x?: number; y?: number; sc?: number }> = ({ t, at, out, title, rows, total, totalAt, x = 1400, y = 540, sc = 1 }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1, pop(t, at, 0.85));
  const vis = rows.filter((r) => t >= r.at - 0.1);
  const sum = vis.reduce((s, r) => s + (r.v ?? 0), 0);
  const last = vis.slice(-9);
  const tot = totalAt !== undefined && t >= totalAt;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${sc * (0.8 + 0.2 * k)}) rotate(${1.5 - 1.5 * k}deg)` }}>
    <div style={{ width: 640, padding: "26px 40px 30px 70px", background: `repeating-linear-gradient(180deg, ${CH.papel} 0 62px, #c9b98f 62px 64px)`, borderRadius: 10, boxShadow: sh, position: "relative" }}>
      <div style={{ position: "absolute", left: 46, top: 0, bottom: 0, width: 3, background: "#d0786a" }} />
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 6, color: CH.barro, height: 62, display: "flex", alignItems: "center" }}>{title}</div>
      {last.map((r) => { const w = e(t, r.at, r.at + 0.5); return <div key={r.tx + r.at} style={{ display: "flex", justifyContent: "space-between", height: 64, alignItems: "flex-end", fontFamily: HAND, fontWeight: 700, fontSize: 50, color: CH.tinta, clipPath: `inset(-30% ${100 - 100 * w}% -10% 0)` }}>
        <span>{r.tx}</span>{r.v !== undefined && <span style={{ color: CH.guinda }}>${fmt(r.v)}</span>}</div>; })}
      {(rows.some((r) => r.v !== undefined) || total) && <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 8, borderTop: `4px solid ${CH.tinta}`, fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: tot ? CH.nopal : CH.tinta }}>
        <span>TOTAL</span><span>{tot && total ? total : "$" + fmt(sum)}</span></div>}
    </div>
  </div>;
};

// sello de goma (NO / SÍ / un número) que cae y rebota
export const Sello: React.FC<{ t: number; at: number; out: number; text: string; x?: number; y?: number; rot?: number; size?: number; col?: string }> = ({ t, at, out, text, x = 960, y = 540, rot = -9, size = 100, col = CH.guinda }) => {
  const o = oo(t, at, out, 0.06); if (o <= 0.01) return null;
  const k = e(t, at, at + 0.16), sc = 1.9 - 0.9 * k + 0.06 * Math.sin(Math.max(0, t - at - 0.16) * 22) * Math.exp(-Math.max(0, t - at - 0.16) * 7);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${sc})`, padding: "8px 34px", border: `10px solid ${col}`, borderRadius: 18, fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(246,231,200,.88)", whiteSpace: "nowrap", boxShadow: "0 18px 40px rgba(0,0,0,.45)" }}>{text}</div>;
};

// CTA: la guía de verdad. Los 5 libros entran en abanico, el que toca se adelanta y se abre en la página REAL que se cita;
// después la página crece (se lee) y a la derecha el QR grande. En pantalla sólo el nombre + "link en la 1ª línea de la descripción".
export const Guia: React.FC<{ t: number; at: number; out: number; libro: number; page: string; openAt: number; zoomAt: number; pg: string }> = ({ t, at, out, libro, page, openAt, zoomAt, pg }) => {
  const o = oo(t, at, out, 0.25, 0.4); if (o <= 0.01) return null;
  const fan = Math.min(1, pop(t, at, 0.7));
  const sel = ei(t, at + 1.0, at + 1.8);                 // el libro elegido se adelanta
  const open = ei(t, openAt, openAt + 1.1);              // la tapa gira sobre el lomo
  const zoom = ei(t, zoomAt, zoomAt + 1.0);              // la página crece y el libro se va a la izquierda
  const qr = Math.min(1, pop(t, zoomAt + 0.6, 0.8));
  const BW = 330, BH = 495;
  return <div style={{ position: "absolute", inset: 0, opacity: o }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 45% 50%, rgba(30,18,10,.55), rgba(12,7,4,.9) 75%)" }} />
    {/* abanico de los otros 4 */}
    {[1, 2, 3, 4, 5].filter((n) => n !== libro).map((n, i) => {
      const ang = (i - 1.5) * 9 * fan, dx = (i - 1.5) * 150 * fan;
      return <Img key={n} src={staticFile(P + `cov_l${n}.jpg`)} style={{ position: "absolute", left: 780 + dx - BW * 0.4, top: 300 + Math.abs(i - 1.5) * 18, width: BW * 0.8, height: BH * 0.8, objectFit: "cover", borderRadius: 6, boxShadow: sh,
        transform: `rotate(${ang}deg) translateY(${(1 - fan) * 700}px)`, opacity: 1 - 0.75 * sel - 0.25 * zoom, filter: `brightness(${1 - 0.35 * sel})` }} />;
    })}
    {/* el libro elegido: tapa (gira) + página real debajo */}
    <div style={{ position: "absolute", left: 960 - 0.5 * BW + (-470 * zoom), top: 540 - 0.5 * BH + (1 - fan) * 700 - 30 * sel, width: BW, height: BH, perspective: 1800,
      transform: `scale(${1 + 0.25 * sel + 0.55 * zoom})`, transformOrigin: "50% 50%" }}>
      <Img src={staticFile(P + page)} style={{ position: "absolute", inset: 0, width: BW, height: BH, objectFit: "cover", borderRadius: 4, boxShadow: sh, opacity: open > 0.02 ? 1 : 0 }} />
      <div style={{ position: "absolute", inset: 0, transformOrigin: "0% 50%", transform: `rotateY(${-170 * open}deg)`, backfaceVisibility: "hidden" }}>
        <Img src={staticFile(P + `cov_l${libro}.jpg`)} style={{ width: BW, height: BH, objectFit: "cover", borderRadius: 4, boxShadow: sh }} />
      </div>
    </div>
    {/* nombre + página */}
    <div style={{ position: "absolute", left: 960, top: 70, transform: "translateX(-50%)", textAlign: "center", opacity: fan, width: 1500 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 8, color: CH.maiz }}>EL MANUAL DEL TÍO CHENCHO</div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: "#fff8e6", textShadow: "0 6px 18px #000" }}>140 Trucos de Pueblo que Ahorran $1,000 al Mes</div>
    </div>
    {open > 0.5 && <div style={{ position: "absolute", left: 960 - 470 * zoom, top: 1000, transform: "translateX(-50%)", fontFamily: HAND, fontWeight: 700, fontSize: 54, color: CH.maiz, textShadow: "0 6px 18px #000", opacity: e(t, openAt + 0.6, openAt + 1.0), whiteSpace: "nowrap" }}>{pg}</div>}
    {/* QR grande: se lee con el celular desde la pantalla */}
    {qr > 0.01 && <div style={{ position: "absolute", left: 1440, top: 560, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * qr})`, opacity: Math.min(1, qr * 1.4), textAlign: "center", padding: "26px 30px", background: CH.papel, borderRadius: 22, boxShadow: sh }}>
      <div style={{ background: "#fff", padding: 16, borderRadius: 14 }}><Img src={staticFile(P + "qr.png")} style={{ width: 380, height: 380, display: "block", imageRendering: "pixelated" }} /></div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: CH.tinta, marginTop: 14 }}>📱 ESCANÉALO CON TU CELULAR</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 25, color: CH.barro, marginTop: 6 }}>o el link en la 1ª línea de la descripción</div>
    </div>}
  </div>;
};

// el billete de quinientos (tianguis): entra girando y se va "gastando" con lo que se compra
export const Billete: React.FC<{ t: number; at: number; out: number; v: number; resta?: { at: number; v: number }[]; x?: number; y?: number }> = ({ t, at, out, v, resta = [], x = 1460, y = 300 }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1, pop(t, at, 0.8));
  const left = v - resta.filter((r) => t >= r.at).reduce((s, r) => s + r.v, 0);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${-6 + 14 * (1 - k)}deg) scale(${0.5 + 0.5 * k})` }}>
    <div style={{ width: 440, height: 200, borderRadius: 14, background: "linear-gradient(135deg,#8fb6d6,#5a8ab0)", boxShadow: sh, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 22, top: 12, fontFamily: SERIF, fontWeight: 900, fontSize: 74, color: "#123" }}>{v}</div>
      <div style={{ position: "absolute", right: 22, bottom: 10, fontFamily: FONT, fontWeight: 900, fontSize: 26, color: "#123", letterSpacing: 4 }}>PESOS</div>
      <div style={{ position: "absolute", left: 200, top: 30, width: 120, height: 140, borderRadius: "50%", background: "rgba(255,255,255,.25)" }} />
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(60deg, rgba(255,255,255,.08) 0 6px, transparent 6px 14px)" }} />
    </div>
    {resta.length > 0 && <div style={{ marginTop: 12, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 56, color: "#fff", textShadow: "0 6px 18px #000" }}>me quedan <span style={{ color: CH.maiz }}>${fmt(left)}</span></div>}
  </div>;
};
