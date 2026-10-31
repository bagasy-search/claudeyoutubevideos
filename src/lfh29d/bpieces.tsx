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
  const sc = side ? 0.72 : 1, x = side ? 60 : 90, y = 70 - (1 - inn) * 420 - up * up * 520;
  const digits = String(n).split("");
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: x, top: y, transform: `scale(${sc}) rotate(${swing(t, at + 0.2) * 0.25}deg)`, transformOrigin: "0 0", display: "flex", alignItems: "center", gap: 34 }}>
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
      <div style={{ whiteSpace: "nowrap", fontFamily: FONT, fontWeight: 900, fontSize: 54, letterSpacing: 2, color: "#f7f4ee", textShadow: "0 6px 24px rgba(0,0,0,.85)", clipPath: `inset(-20px ${(1 - w) * 100}% -20px 0)` }}>{name}</div>
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
export const BookCTA: React.FC<{ t: number; at: number; out: number; v?: number; page?: string }> = ({ t, at, out, v = 1 }) => {
  if (t < at - 0.05 || t > out + 0.8) return null;
  const tt = t - at, dur = out - at, inn = phys(t, at, 3.6, 0.75), xo = eio(t, out - 0.2, out + 0.7), p = cl(inn) * (1 - xo);
  const L = v === 1 ? 1 : -1, dr = cl(tt / Math.max(1, dur));
  // cámara a la altura del mantel, mirando la mesa: el mundo queda desenfocado atrás y el libro es el primer plano
  const cam = { p: [BK[0] + 0.05 * L - 0.06 * L * dr, BK[1] + 0.2 - 0.02 * dr, BK[2] + 0.8 - 0.05 * dr] as V3, l: [BK[0], BK[1] + 0.12, BK[2] - 0.2] as V3, fov: 36 };
  const drop = phys(t, at + 0.15, 4.4, 0.42), lean = eio(t, at + 0.6, at + 1.6);
  const card = phys(t, at + Math.min(2.2, dur * 0.4), 4.6, 0.36), q = cl(card);
  const sw = cl((tt - dur * 0.62) / (dur * 0.2)), mk = `radial-gradient(circle at 50% 52%, #000 ${p * 1500}px, transparent ${p * 1500 + 480}px)`;
  const bx = 960 - 300 * L, cx = 960 + 330 * L, W = 470, Hh = Math.round(W * 1650 / 1275), D = 64;
  const ry = (-24 * L + 6 * L * dr) * lean + (1 - lean) * -40 * L;
  return <AbsoluteFill style={{ WebkitMaskImage: mk, maskImage: mk } as React.CSSProperties}>
    <AbsoluteFill style={{ filter: "blur(5px) brightness(.82)", transform: "scale(1.04)" }}><KitchenWorld t={t} sc={{ cam }} /></AbsoluteFill>
    {/* sombra de contacto del libro sobre el mantel */}
    <div style={{ position: "absolute", left: bx, top: 560 + Hh / 2 - 6, width: W * 1.25, height: 70, transform: "translate(-50%,-50%)", background: "radial-gradient(ellipse at center, rgba(0,0,0,.55), transparent 70%)", opacity: cl(drop) }} />
    {/* el libro de pie: tapa, lomo violeta, canto de hojas; cae parado con su peso y gira hacia la cámara */}
    <div style={{ position: "absolute", left: bx, top: 560, width: W, height: Hh, transform: `translate(-50%,-50%) perspective(2400px) translateY(${(1 - drop) * -900}px) rotateY(${ry}deg) rotateX(${(1 - cl(drop)) * 10 + 2}deg)`, transformStyle: "preserve-3d" }}>
      <Img src={staticFile(P + "book_cta.jpg")} style={{ position: "absolute", inset: 0, width: W, height: Hh, transform: `translateZ(${D / 2}px)`, borderRadius: "3px 8px 8px 3px", boxShadow: "inset 6px 0 10px rgba(0,0,0,.35)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, width: D, height: Hh, background: "linear-gradient(90deg,#3a1f52,#5a347c 45%,#3a1f52)", transform: `translateX(${-D / 2}px) rotateY(-90deg)` }} />
      <div style={{ position: "absolute", top: 4, left: W - D / 2 - 2, width: D - 4, height: Hh - 8, background: "repeating-linear-gradient(90deg,#f6efdf 0 3px,#e2d6bd 3px 4px)", transform: "rotateY(90deg)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, width: W, height: Hh, background: "#3a1f52", transform: `translateZ(${-D / 2}px)` }} />
    </div>
    {/* la tarjeta del QR entra deslizando por el mantel y queda apoyada contra el libro, ladeada */}
    <div style={{ position: "absolute", left: cx, top: 600, transform: `translate(-50%,-50%) perspective(1600px) translateX(${(1 - card) * 700 * L}px) rotateY(${(14 * L) * q}deg) rotate(${(5 * -L + Math.sin(tt * 0.8) * 1.2) * q}deg)`, opacity: cl(q * 2), filter: `drop-shadow(${-24 * L}px 40px 26px rgba(0,0,0,.65))` }}>
      <div style={{ width: 540, padding: "26px 34px 26px", borderRadius: 22, background: "linear-gradient(180deg,#fffaf0,#efe4cc)", boxShadow: "0 40px 80px rgba(0,0,0,.6), 0 0 0 4px #c9963f", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {sw > 0 && sw < 1 && <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(105deg, transparent 30%, rgba(255,226,140,.8) 50%, transparent 70%)", mixBlendMode: "screen", transform: `translateX(${-110 + 220 * sw}%)` }} />}
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 62, color: "#4b2a6a", lineHeight: 1.05 }}>The Bug-Free Farmhouse</div>
        <Img src={staticFile(P + "qr.png")} style={{ width: 400, height: 400, marginTop: 14, imageRendering: "pixelated", background: "#fff", padding: 14, borderRadius: 8 }} />
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 0.5, color: "#3a2a1a", marginTop: 12 }}>link in the first line of the description</div>
      </div>
    </div>
  </AbsoluteFill>;
};
