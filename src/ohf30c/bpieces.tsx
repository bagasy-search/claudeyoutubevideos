// ohf30 · piezas de marca de The Old House Fix (se repiten en los 4 videos, no son componentes del minuto):
// la ETIQUETA DE FERRETERÍA (cartón manila con ojal de bronce, colgada de un hilo) marca cada arreglo con su número sellado,
// la CINTA DE PINTOR pegada a la derecha con «Subscribe» escrito con marcador, y el CTA del manual: el Winter Manual se abre
// sobre la mesita de la sala en la página real del capítulo + la tarjeta con el QR grande (NUNCA una URL en pantalla).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FONT, P } from "./lib";
import { MARK, cl, eio, phys } from "./hkit";
import { HouseWorld, BOOK } from "./house3d";
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const swing = (t: number, a: number) => { const x = t - a; return x <= 0 ? 0 : 16 * Math.exp(-x * 1.5) * Math.cos(x * 5.8); };
const SERIF = "Georgia, 'Times New Roman', serif";

// etiqueta manila colgando de un hilo: entra cayendo con peso, se balancea y el número se sella con tinta roja
export const StepTag: React.FC<{ t: number; at: number; out: number; n: number; name: string; side?: boolean; word?: string }> = ({ t, at, out, n, name, side, word = "FIX" }) => {
  if (t < at - 0.05 || t > out + 0.9) return null;
  const inn = phys(t, at, 5, 0.5), up = cl((t - out) / 0.7), stamp = phys(t, at + 0.45, 9, 0.35), w = cl(phys(t, at + 0.75, 6, 0.7)) * (1 - up);
  const sc = side ? 0.7 : 1, x = side ? 70 : 110, y = -330 + 400 * inn - up * up * 560;
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: x, top: y, transform: `scale(${sc})`, transformOrigin: "0 0", display: "flex", alignItems: "center", gap: 36 }}>
      <div style={{ position: "relative", width: 230, height: 330, transform: `rotate(${swing(t, at + 0.2) * 0.35 - 3}deg)`, transformOrigin: "115px -200px" }}>
        {/* hilo */}
        <div style={{ position: "absolute", left: 113, top: -260, width: 3, height: 292, background: "linear-gradient(180deg,#d8cdb6,#b3a588)" }} />
        {/* cartón manila con las esquinas cortadas */}
        <div style={{ position: "absolute", inset: 0, clipPath: "polygon(22% 0, 78% 0, 100% 14%, 100% 100%, 0 100%, 0 14%)", background: "linear-gradient(170deg,#e6cf98,#d4b678 60%,#c4a364)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(80deg, rgba(120,90,40,.06) 0 2px, transparent 2px 7px)" }} />
          <div style={{ position: "absolute", top: 72, width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 8, color: "#5b4420" }}>{word}</div>
          <div style={{ position: "absolute", top: 110, width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 170, lineHeight: 1, color: "#b3261e", opacity: cl(stamp * 1.4), transform: `scale(${1.7 - 0.7 * cl(stamp)}) rotate(-6deg)`, textShadow: "0 0 1px rgba(80,0,0,.6)" }}>{n}</div>
        </div>
        {/* ojal de bronce */}
        <div style={{ position: "absolute", left: 95, top: 18, width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle, #2a1d0c 0 34%, #e7c27a 36%, #9b7330 70%, #6d4f1f 100%)", boxShadow: "0 3px 5px rgba(0,0,0,.5)" }} />
      </div>
      <div style={{ whiteSpace: "nowrap", fontFamily: FONT, fontWeight: 900, fontSize: 56, letterSpacing: 2, color: "#f7f4ee", textShadow: "0 6px 24px rgba(0,0,0,.85)", clipPath: `inset(-20px ${(1 - w) * 100}% -20px 0)` }}>{name}</div>
    </div>
  </AbsoluteFill>;
};

// tira de cinta de pintor pegada a la derecha: «Subscribe» con marcador, que se escribe solo
export const SubTag: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  if (t < at - 0.05 || t > out + 0.9) return null;
  const d = phys(t, at, 6, 0.45), up = cl((t - out) / 0.7), wr = cl((t - at - 0.5) / 0.9);
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: 1390 + (1 - d) * 640 + up * up * 700, top: 120, transform: `rotate(${-3 + 2 * (1 - cl(d))}deg)` }}>
      <div style={{ position: "relative", width: 440, height: 150, background: "linear-gradient(180deg,#f1e2b5,#e6d29b)", boxShadow: "0 24px 50px rgba(0,0,0,.55)",
        clipPath: "polygon(0 4%, 3% 0, 6% 5%, 10% 1%, 100% 0, 97% 50%, 100% 100%, 4% 100%, 0 96%, 2% 50%)" }}>
        <div style={{ position: "absolute", left: 30, top: 8, fontFamily: MARK, fontSize: 70, color: "#1c2a3a", transform: "rotate(-2deg)", clipPath: `inset(0 ${(1 - wr) * 100}% 0 0)` }}>Subscribe</div>
        <div style={{ position: "absolute", left: 34, top: 100, fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 1, color: "#3a3424", opacity: cl((t - at - 1.5) * 2) }}>AN OLD-HOUSE FIX EVERY WEEK</div>
      </div>
    </div>
  </AbsoluteFill>;
};

// ---------- CTA del Winter Manual: el manual se abre en la mesita de la sala + la tarjeta con el QR grande ----------
type V3 = [number, number, number];
const mix = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const BK: V3 = [BOOK[0], BOOK[1] + 0.02, BOOK[2]];
export const BookCTA: React.FC<{ t: number; at: number; out: number; v?: number }> = ({ t, at, out, v = 1 }) => {
  if (t < at - 0.05 || t > out + 0.8) return null;
  const tt = t - at, dur = out - at, inn = phys(t, at, 3.6, 0.75), xo = eio(t, out - 0.2, out + 0.7), p = cl(inn) * (1 - xo);
  const k = eio(t, at, at + 3.2), dr = cl((t - at - 3.2) / Math.max(1, dur - 3.2)), open = eio(t, at + 0.7, at + 2.0);
  const sx = v === 1 ? 0.07 : -0.055;
  const p0: V3 = v === 1 ? [BK[0] + 0.55, BK[1] + 0.75, BK[2] + 0.75] : [BK[0] - 0.65, BK[1] + 0.6, BK[2] + 0.55];
  const cv = Math.sin(dr * Math.PI) * (v === 1 ? 1 : -1);
  const p1: V3 = [BK[0] + sx + 0.05 + 0.03 * dr * (v === 1 ? 1 : -1) + 0.07 * cv, BK[1] + 0.62 - 0.04 * dr, BK[2] + 0.7 - 0.03 * dr - 0.05 * Math.abs(cv)];
  const cam = { p: mix(p0, p1, k), l: mix([BK[0] - 0.02, BK[1], BK[2] - 0.05], [BK[0] + sx, BK[1], BK[2] - 0.012], k), fov: 34 - 2 * k };
  const card = phys(t, at + Math.max(1.6, dur * 0.62), 4.2, 0.3), q = cl(card), sw = cl((tt - dur * 0.8) / (dur * 0.17)), sw2 = cl((tt - dur * 0.5) / (dur * 0.45));
  const mk = `radial-gradient(circle at 50% 52%, #000 ${p * 1500}px, transparent ${p * 1500 + 480}px)`;
  const qx = v === 1 ? 1320 : 600;
  return <AbsoluteFill style={{ WebkitMaskImage: mk, maskImage: mk } as React.CSSProperties}>
    <HouseWorld t={t} sc={{ cam, book: { open, page: "cta" }, heat: 0.8 }} />
    {sw2 > 0 && sw2 < 1 && <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(100deg, transparent 38%, rgba(255,214,140,.3) 50%, transparent 62%)", mixBlendMode: "screen", transform: `translateX(${lerp(-90, 90, sw2)}%)` }} />}
    <div style={{ position: "absolute", left: qx, top: 540, transform: `translate(-50%,-50%) perspective(1600px) translateY(${(card < 1 ? (1 - card) * 700 : (1 - card) * 160) + Math.sin(tt * 1.1) * 7 * q}px) rotateX(${(1 - q) * 38}deg) rotateY(${((v === 1 ? -10 : 10) + Math.sin(tt * 0.55) * 8) * q}deg) rotate(${((v === 1 ? -4 : 4) + Math.sin(tt * 0.8) * 2.2) * q}deg)`, opacity: cl(q * 2), filter: `drop-shadow(${v === 1 ? -30 : 30}px ${40 + 30 * q}px 26px rgba(0,0,0,.7))` }}>
      <div style={{ width: 600, padding: "30px 40px 30px", borderRadius: 22, background: "linear-gradient(180deg,#fbf8f1,#e9e3d4)", boxShadow: "0 40px 80px rgba(0,0,0,.65), 0 0 0 4px #1d2b3a", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {sw > 0 && sw < 1 && <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(105deg, transparent 30%, rgba(255,226,160,.8) 50%, transparent 70%)", mixBlendMode: "screen", transform: `translateX(${lerp(-110, 110, sw)}%)` }} />}
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: "#7a2a22" }}>THE OLD HOUSE</div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 66, color: "#1d2b3a", lineHeight: 1.0 }}>Winter Manual</div>
        <Img src={staticFile(P + "qr.png")} style={{ width: 460, height: 460, marginTop: 16, imageRendering: "pixelated", background: "#fff", padding: 14, borderRadius: 8 }} />
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 1, color: "#3a2a1a", marginTop: 14, opacity: cl((tt - 2.6) * 2) }}>POINT YOUR PHONE CAMERA AT THE SQUARE</div>
      </div>
    </div>
  </AbsoluteFill>;
};
