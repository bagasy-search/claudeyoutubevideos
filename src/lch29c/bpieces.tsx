// lhh29 · piezas de marca de Loretta (se repiten en todos los videos, no son componentes del minuto):
// el TABLERO DE HIMNOS de la iglesia marca cada truco (las tablillas con el número entran deslizando en la ranura de madera),
// la FICHA DE RECETA colgada con «Subscribe» a mano, y el CTA del libro: su House Book abierto sobre el mantel en la página
// real + la tarjeta con el QR grande (NUNCA una URL en pantalla: sólo el nombre y «link in the first line of the description»).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FONT, P } from "./lib";
import { HAND, cl, eio, phys } from "./hkit";
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
import { KitchenWorld, BOOK } from "./kitchen3d";

const swing = (t: number, a: number) => { const x = t - a; return x <= 0 ? 0 : 18 * Math.exp(-x * 1.6) * Math.cos(x * 6.2); };
const SERIF = "Georgia, 'Times New Roman', serif";

// tablero de himnos de roble: «TRICK» pintado arriba y la tablilla blanca con el número que entra por la ranura con peso
export const HymnTag: React.FC<{ t: number; at: number; out: number; n: number; name: string; side?: boolean }> = ({ t, at, out, n, name, side }) => {
  if (t < at - 0.05 || t > out + 0.9) return null;
  const inn = phys(t, at, 5.2, 0.55), up = cl((t - out) / 0.7), slot = phys(t, at + 0.35, 7, 0.38), w = cl(phys(t, at + 0.7, 6, 0.7)) * (1 - up);
  const sc = side ? 0.72 : 1, y = 1080 - 70 - 250 * sc + (1 - inn) * 420 + up * up * 520;
  const digits = String(n).split("");
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", right: side ? 60 : 90, top: y, transform: `scale(${sc}) rotate(${swing(t, at + 0.2) * 0.25}deg)`, transformOrigin: "100% 0", display: "flex", flexDirection: "row-reverse", alignItems: "center", gap: 34 }}>
      <div style={{ position: "relative", width: 250, height: 250, borderRadius: "120px 120px 14px 14px", background: "linear-gradient(160deg,#8a5a32,#5e3a1e 60%,#43280f)", boxShadow: "0 30px 60px rgba(0,0,0,.65), inset 0 2px 0 rgba(255,220,170,.35), inset 0 0 0 8px rgba(40,22,8,.55)" }}>
        {/* veta del roble */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", background: "repeating-linear-gradient(95deg, rgba(255,210,150,.06) 0 3px, transparent 3px 11px)", mixBlendMode: "screen" }} />
        <div style={{ position: "absolute", top: 40, width: "100%", textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: "#e9c98e", textShadow: "0 2px 0 rgba(0,0,0,.6)" }}>TRICK</div>
        {/* ranura y tablillas */}
        <div style={{ position: "absolute", left: 22, right: 22, top: 96, height: 120, borderRadius: 8, background: "#2a1708", boxShadow: "inset 0 6px 12px rgba(0,0,0,.8)", overflow: "hidden", display: "flex", justifyContent: "center", gap: 8, paddingTop: 8 }}>
          {digits.map((d, i) => {
            const k = phys(t, at + 0.35 + i * 0.16, 7, 0.38);
            return <div key={i} style={{ width: 84, height: 104, borderRadius: 6, background: "linear-gradient(180deg,#fbf7ee,#e7dfcc)", boxShadow: "0 6px 10px rgba(0,0,0,.55)", transform: `translateY(${(1 - k) * -130}px)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 92, color: "#1f160c" }}>{d}</div>;
          })}
        </div>
        <div style={{ position: "absolute", left: 22, right: 22, top: 96, height: 12, background: "linear-gradient(180deg,rgba(0,0,0,.55),transparent)", opacity: slot }} />
      </div>
      <div style={{ whiteSpace: "nowrap", fontFamily: FONT, fontWeight: 900, fontSize: 54, letterSpacing: 2, color: "#f7f4ee", textShadow: "0 6px 24px rgba(0,0,0,.85)", clipPath: `inset(-20px 0 -20px ${(1 - w) * 100}%)` }}>{name}</div>
    </div>
  </AbsoluteFill>;
};

// ficha de receta rayada, colgada de una chinche de la derecha: «Subscribe» escrito a mano por Loretta
export const SubTag: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  if (t < at - 0.05 || t > out + 0.9) return null;
  const d = phys(t, at, 5, 0.38), up = cl((t - out) / 0.8), y = -380 + 470 * d - 600 * up * up, wr = cl((t - at - 0.6) / 0.9);
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: 1560, top: y, transform: `rotate(${4 + swing(t, at + 0.4) * 0.5}deg)`, transformOrigin: "50% 0" }}>
      <div style={{ position: "relative", width: 300, height: 200, background: "#fbf7ea", boxShadow: "0 30px 60px rgba(0,0,0,.6)", borderRadius: 4,
        backgroundImage: "linear-gradient(180deg, transparent 46px, #d64b3c 46px, #d64b3c 49px, transparent 49px), repeating-linear-gradient(180deg, transparent 0 34px, #9cc0dd 34px 36px)" }}>
        <div style={{ position: "absolute", left: 140, top: -14, width: 26, height: 26, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #ff8a7a, #b3261e)", boxShadow: "0 6px 8px rgba(0,0,0,.5)" }} />
        <div style={{ position: "absolute", left: 22, top: 2, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: "#7a1f14", transform: "rotate(-4deg)", clipPath: `inset(0 ${(1 - wr) * 100}% 0 0)` }}>Subscribe</div>
        <div style={{ position: "absolute", left: 26, top: 70, fontFamily: HAND, fontWeight: 700, fontSize: 36, color: "#2b2b44", lineHeight: 1.0, opacity: cl((t - at - 1.6) * 2) }}>a new trick<br />every week</div>
        <div style={{ position: "absolute", right: 22, bottom: 10, fontFamily: HAND, fontWeight: 700, fontSize: 34, color: "#2b2b44", opacity: cl((t - at - 2.4) * 2) }}>— Loretta</div>
      </div>
    </div>
  </AbsoluteFill>;
};

// ---------- CTA del House Book: el libro se abre en la mesa de su cocina + la tarjeta con el QR grande ----------
type V3 = [number, number, number];
const mix = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const BK: V3 = [BOOK[0] - 0.02, BOOK[1] + 0.02, BOOK[2]];
export const BookCTA: React.FC<{ t: number; at: number; out: number; v?: number; page?: string }> = ({ t, at, out, v = 1, page }) => {
  if (t < at - 0.05 || t > out + 0.8) return null;
  const tt = t - at, dur = out - at, inn = phys(t, at, 3.6, 0.75), xo = eio(t, out - 0.2, out + 0.7), p = cl(inn) * (1 - xo);
  // el libro se abre y la cámara queda en oblicuo sobre la mesa (libro 3D entero, con su lomo y su sombra) y sigue derivando muy lento
  const k = eio(t, at, at + 3.2), dr = cl((t - at - 3.2) / Math.max(1, dur - 3.2)), open = eio(t, at + 0.7, at + 2.0);
  const sx = v === 1 ? 0.07 : -0.055;
  const p0: V3 = v === 1 ? [BK[0] + 0.55, BK[1] + 0.75, BK[2] + 0.75] : [BK[0] - 0.65, BK[1] + 0.6, BK[2] + 0.55];
  const cv = Math.sin(dr * Math.PI) * (v === 1 ? 1 : -1);
  const p1: V3 = [BK[0] + sx + 0.05 + 0.03 * dr * (v === 1 ? 1 : -1) + 0.07 * cv, BK[1] + 0.62 - 0.04 * dr, BK[2] + 0.7 - 0.03 * dr - 0.05 * Math.abs(cv)];
  const cam = { p: mix(p0, p1, k), l: mix([BK[0] - 0.02, BK[1], BK[2] - 0.05], [BK[0] + sx, BK[1], BK[2] - 0.012], k), fov: 34 - 2 * k };
  const card = phys(t, at + Math.max(1.6, dur * 0.66), 4.2, 0.3), q = cl(card), sw = cl((tt - dur * 0.8) / (dur * 0.17)), sw2 = cl((tt - dur * 0.5) / (dur * 0.45)), mk = `radial-gradient(circle at 50% 52%, #000 ${p * 1500}px, transparent ${p * 1500 + 480}px)`;
  const qx = v === 1 ? 1320 : 600;
  return <AbsoluteFill style={{ WebkitMaskImage: mk, maskImage: mk } as React.CSSProperties}>
    <KitchenWorld t={t} sc={{ cam, book: { open, page: "cta" } }} />
    {sw2 > 0 && sw2 < 1 && <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(100deg, transparent 38%, rgba(255,214,140,.32) 50%, transparent 62%)", mixBlendMode: "screen", transform: `translateX(${lerp(-90, 90, sw2)}%)` }} />}
    {/* la tarjeta del QR: cartulina con borde dorado, se apoya con peso desde abajo y queda un poco ladeada */}
    <div style={{ position: "absolute", left: qx, top: 540, transform: `translate(-50%,-50%) perspective(1600px) translateY(${(card < 1 ? (1 - card) * 700 : (1 - card) * 160) + Math.sin(tt * 1.1) * 7 * q}px) rotateX(${(1 - q) * 38}deg) rotateY(${((v === 1 ? -10 : 10) + Math.sin(tt * 0.55) * 8) * q}deg) rotate(${((v === 1 ? -4 : 4) + Math.sin(tt * 0.8) * 2.2) * q}deg)`, opacity: cl(q * 2), filter: `drop-shadow(${v === 1 ? -30 : 30}px ${40 + 30 * q}px 26px rgba(0,0,0,.7))` }}>
      <div style={{ width: 600, padding: "30px 40px 30px", borderRadius: 22, background: "linear-gradient(180deg,#fffaf0,#efe4cc)", boxShadow: "0 40px 80px rgba(0,0,0,.65), 0 0 0 4px #c9963f", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {sw > 0 && sw < 1 && <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(105deg, transparent 30%, rgba(255,226,140,.8) 50%, transparent 70%)", mixBlendMode: "screen", transform: `translateX(${lerp(-110, 110, sw)}%)` }} />}
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 64, color: "#4b2a6a", lineHeight: 1.05 }}>The Clean Home Set</div>
        <Img src={staticFile(P + "qr.png")} style={{ width: 470, height: 470, marginTop: 16, imageRendering: "pixelated", background: "#fff", padding: 14, borderRadius: 8 }} />
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 1, color: "#3a2a1a", marginTop: 14, opacity: cl((tt - 2.6) * 2) }}>POINT YOUR PHONE CAMERA AT THE SQUARE</div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, letterSpacing: 0.5, color: "#6b4a2a", marginTop: 6, opacity: cl((tt - 3.2) * 2) }}>link in the first line of the description</div>
      </div>
    </div>
    {false && page && <div style={{ position: "absolute", left: v === 1 ? 640 : 1300, top: 70, transform: "translateX(-50%)", whiteSpace: "nowrap", fontFamily: SERIF, fontWeight: 700, fontSize: 58, letterSpacing: 2, color: "#f7f4ee", textShadow: "0 6px 20px rgba(0,0,0,.9)", opacity: cl((tt - 1.4) * 2) * (1 - xo) }}>{page}</div>}
    {dur < 0 && null}
  </AbsoluteFill>;
};
