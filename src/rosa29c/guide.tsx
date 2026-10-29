// CTA de la guía (Hotmart · El Gran Recetario de la Abuela Rosa): el libro llega en 3D desde la profundidad sobre la foto del momento,
// la tapa se abre sobre su bisagra y aparece la página REAL, la cámara se acerca; después el libro se corre y entra el QR con
// «el link está en la primera línea de la descripción». Nunca una URL en pantalla. Con el avatar en cuadro va chico abajo a la izquierda.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { P } from "./lib";
import { AMB, DIM, HAND, TX, cl, eIn, eio, img, phys } from "./hkit";
import { FONT } from "./lib";
import { WIN } from "./parts";

type Cta = { guide?: number; page?: number; desc: number; end: number; img?: string; pageTxt?: string };
const nowAv = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);

const Book: React.FC<{ t: number; at: number; open: number; page?: string; w: number }> = ({ t, at, open, page, w }) => {
  const h = w * 1.414, th = 34;
  return <div style={{ position: "relative", width: w, height: h, transformStyle: "preserve-3d" }}>
    {/* bloque de hojas (canto) */}
    <div style={{ position: "absolute", left: w - 2, top: 6, width: th, height: h - 12, transform: "rotateY(90deg)", transformOrigin: "0 50%", background: "repeating-linear-gradient(90deg,#efe6d2 0 2px,#d9cdb3 2px 3px)" }} />
    <div style={{ position: "absolute", left: 6, top: h - 2, width: w - 12, height: th, transform: "rotateX(-90deg)", transformOrigin: "50% 0", background: "repeating-linear-gradient(180deg,#efe6d2 0 2px,#d9cdb3 2px 3px)" }} />
    {/* la página real (debajo de la tapa) */}
    <div style={{ position: "absolute", inset: 0, background: "#f6efe0", transform: `translateZ(${-th}px)` }}>
      {page && <Img src={staticFile(P + page + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
      {page && <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-40 + 170 * eio(t, at + 0.6, at + 2.0)}%`, width: "26%", background: "linear-gradient(100deg, transparent, rgba(255,240,200,.35), transparent)" }} />}
    </div>
    {/* la tapa con bisagra a la izquierda */}
    <div style={{ position: "absolute", inset: 0, transformOrigin: "0 50%", transform: `rotateY(${-165 * open}deg)`, transformStyle: "preserve-3d" }}>
      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: "4px 10px 10px 4px", overflow: "hidden", boxShadow: "inset 6px 0 10px rgba(0,0,0,.35)" }}>
        <Img src={staticFile(P + "g_p001.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent 30%, rgba(255,255,255,${0.22 * (1 - open)}) 45%, transparent 60%)` }} />
      </div>
      <div style={{ position: "absolute", inset: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden", background: "#efe2c6", borderRadius: "10px 4px 4px 10px" }} />
    </div>
  </div>;
};

export const GuideCTA: React.FC<{ t: number; c: Cta; side: boolean; bg?: string }> = ({ t, c, bg }) => {
  const a = c.guide ?? c.desc;
  if (t < a - 0.1 || t > c.end + 1.0) return null;
  const av = nowAv(t);
  const inn = phys(t, a, 3.6, 0.62), xo = eIn(t, c.end - 0.3, c.end + 0.8);
  const op = cl(inn * 2) * (1 - xo);
  if (op <= 0.004) return null;
  const tt = t - a;
  const open = c.page !== undefined ? cl(phys(t, c.page, 3.2, 0.7)) : 0;
  const push = c.page !== undefined ? eio(t, c.page + 0.2, c.page + 2.2) * (1 - eio(t, c.desc - 0.6, c.desc + 0.6)) : 0;
  const dsc = cl(phys(t, c.desc, 4.2, 0.65));
  const qr = cl(phys(t, c.desc + 0.35, 5, 0.55));
  if (av) {
    // con la abuela en cuadro: sólo la tarjeta chica con el libro y el QR, abajo a la izquierda (nunca sobre la cara)
    const k = Math.max(dsc, cl(inn));
    return <div style={{ position: "absolute", left: 60, top: 1080 - 60 - 250, height: 250, display: "flex", alignItems: "center", gap: 22, padding: "18px 26px 18px 18px", borderRadius: 22,
      background: "rgba(18,14,10,.82)", boxShadow: "0 30px 70px rgba(0,0,0,.55)", opacity: op * k, transform: `translateY(${(1 - k) * 40}px)`, fontFamily: FONT, color: TX }}>
      <Img src={staticFile(P + "g_p001.jpg")} style={{ height: 214, borderRadius: 6, boxShadow: "0 10px 24px rgba(0,0,0,.5)" }} />
      <div style={{ background: "#fff", padding: 10, borderRadius: 12 }}><Img src={staticFile(P + "qr.png")} style={{ width: 150, height: 150, display: "block", imageRendering: "pixelated" }} /></div>
      <div style={{ width: 360 }}>
        <div style={{ fontWeight: 900, fontSize: 34, lineHeight: 1.05 }}>EL GRAN RECETARIO</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 36, color: AMB, marginTop: 8, lineHeight: 1 }}>el link está en la 1ª línea de la descripción</div>
      </div>
    </div>;
  }
  const bookX = 960 - 430 * dsc, bookY = 540 + 20 * Math.sin(tt * 0.4);
  const sc = 1 + 0.75 * push - 0.18 * dsc;
  const ry = -24 * (1 - inn) + 10 * Math.sin(tt * 0.33) * (1 - push) + 12 * (1 - open) * (1 - dsc) - 8 * dsc;
  return <AbsoluteFill style={{ opacity: op, fontFamily: FONT, color: TX }}>
    <AbsoluteFill style={{ background: "#0d0a08" }} />
    {bg && <AbsoluteFill style={{ opacity: 0.4 }}><Img src={img(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(26px) brightness(.55)", transform: `scale(${1.2 + 0.03 * Math.sin(tt * 0.2)}) translateX(${-10 * Math.sin(tt * 0.1)}px)` }} /></AbsoluteFill>}
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 45% 16% at 50% 88%, rgba(255,196,130,.16), transparent 70%)" }} />
    <AbsoluteFill style={{ background: `conic-gradient(from 168deg at 50% -12%, transparent 0deg, rgba(255,226,180,${0.06 + 0.02 * Math.sin(tt * 0.5)}) 12deg, transparent 24deg)`, mixBlendMode: "screen" }} />
    <div style={{ position: "absolute", left: bookX, top: bookY, perspective: 2000 }}>
      <div style={{ transformStyle: "preserve-3d", transform: `translate(-50%,-50%) translateZ(${-600 * (1 - inn)}px) translateY(${(1 - inn) * 120}px) rotateY(${ry}deg) rotateX(${6 * (1 - push)}deg) rotateZ(${-3 * (1 - inn)}deg) scale(${sc}) translateX(${open * 110 * (1 - push * 0.6)}px)` }}>
        <Book t={t} at={c.page ?? a} open={open} page={c.img} w={420} />
      </div>
      {/* sombra de contacto que se aprieta al apoyarse */}
      <div style={{ position: "absolute", left: -260, top: 290, width: 520, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,.6), transparent 70%)", transform: `scale(${0.6 + 0.4 * cl(inn)})`, opacity: 1 - push }} />
    </div>
    {/* kicker del libro (antes del QR) */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", opacity: cl(phys(t, a + 0.4, 5, 0.7)) * (1 - push) * (1 - dsc) }}>
      <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 8, color: DIM }}>MI LIBRO</div>
      <div style={{ fontWeight: 900, fontSize: 62 }}>EL GRAN RECETARIO DE LA ABUELA ROSA</div>
    </div>
    {c.pageTxt && <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 64, color: AMB, opacity: cl(phys(t, (c.page ?? a) + 0.9, 5, 0.7)) * (1 - dsc), textShadow: "0 6px 20px rgba(0,0,0,.7)" }}>{c.pageTxt.split("·")[0].trim().toLowerCase().replace("pág.", "página")}</div>}
    {/* el QR y la frase: entran de a uno con resorte */}
    {dsc > 0.01 && <div style={{ position: "absolute", left: 1010, top: 540, transform: `translateY(-50%) translateX(${(1 - dsc) * 120}px)`, opacity: dsc }}>
      <div style={{ fontWeight: 900, fontSize: 64, lineHeight: 1.05 }}>EL GRAN RECETARIO</div>
      <div style={{ fontWeight: 800, fontSize: 34, color: DIM, letterSpacing: 3, marginTop: 6 }}>111 RECETAS DE MENOS DE UN DÓLAR</div>
      <div style={{ display: "flex", alignItems: "center", gap: 34, marginTop: 38 }}>
        <div style={{ background: "#fff", padding: 18, borderRadius: 22, boxShadow: "0 40px 90px rgba(0,0,0,.6)", transform: `scale(${0.7 + 0.3 * qr}) rotate(${(1 - qr) * -8}deg)`, opacity: cl(qr * 2) }}>
          <Img src={staticFile(P + "qr.png")} style={{ width: 300, height: 300, display: "block", imageRendering: "pixelated" }} />
        </div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, lineHeight: 1.05, color: AMB, width: 360, opacity: cl(phys(t, c.desc + 0.8, 5, 0.7)) }}>el link está en la primera línea de la descripción</div>
      </div>
    </div>}
  </AbsoluteFill>;
};
