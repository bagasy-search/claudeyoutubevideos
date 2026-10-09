// OleCTA — la tarjeta del libro para el CTA: la portada REAL como libro físico (CSS 3D con lomo y canto de hojas)
// que entra girando, y al lado el QR REAL sobre una tarjeta de papel. Variante `compact` (esquina, fondo transparente)
// para el cierre "the book's link is in the description".
// ⛔ QR: tamaño en múltiplos exactos del módulo (el png tiene 49 px por módulo… 1176 px / 24 px): 441 px (9 px/módulo) en la
// versión grande, 343 px (7 px/módulo) en la compacta; la tarjeta llega a rotación 0 y traslación 0 EXACTAS y queda quieta.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, HAND, LABEL, hexA, woodBg } from "./OleTheme";
import { OleBed } from "./OleBookPage";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const asset = (p: string) => (/^(https?:|data:|\/)/.test(p) ? p : staticFile(p));
const QR_BG = "#FAF6EC"; // el mismo papel del png del QR (margen de silencio continuo)

// Libro físico: portada al frente, lomo verde a la izquierda, canto de hojas a la derecha y arriba
export const OleBook3D: React.FC<{ cover: string; h: number; ry: number; rx?: number; thick?: number; spine?: string }> = ({ cover, h, ry, rx = 4, thick, spine = OLE.forest }) => {
  const w = h * (1700 / 2200); const T = thick ?? h * 0.07;
  const face: React.CSSProperties = { position: "absolute", backfaceVisibility: "hidden" };
  return (
    <div style={{ width: w, height: h, position: "relative", transformStyle: "preserve-3d", transform: `rotateX(${rx}deg) rotateY(${ry}deg)` }}>
      {/* contratapa */}
      <div style={{ ...face, inset: 0, background: OLE.forest2, transform: `rotateY(180deg) translateZ(${T / 2}px)`, borderRadius: 4 }} />
      {/* canto de hojas (derecha) */}
      <div style={{ ...face, top: 3, height: h - 6, width: T, left: (w - T) / 2, transform: `rotateY(90deg) translateZ(${w / 2 - 3}px)`,
        background: `repeating-linear-gradient(90deg, #F4ECD8 0 2px, #D9CCAE 2px 3px), ${OLE.paper}` }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.18))" }} />
      </div>
      {/* canto superior */}
      <div style={{ ...face, left: 3, width: w - 6, height: T, top: (h - T) / 2, transform: `rotateX(90deg) translateZ(${h / 2 - 3}px)`,
        background: `repeating-linear-gradient(0deg, #F4ECD8 0 2px, #D9CCAE 2px 3px)` }} />
      {/* lomo */}
      <div style={{ ...face, top: 0, height: h, width: T, left: (w - T) / 2, transform: `rotateY(-90deg) translateZ(${w / 2}px)`,
        background: `linear-gradient(90deg, ${hexA("#000000", 0.25)}, transparent 30%, ${hexA("#FFFFFF", 0.10)} 55%, ${hexA("#000000", 0.3)}), ${spine}` }} />
      {/* portada */}
      <div style={{ ...face, inset: 0, transform: `translateZ(${T / 2}px)`, borderRadius: "2px 5px 5px 2px", overflow: "hidden" }}>
        <Img src={asset(cover)} style={{ width: "100%", height: "100%", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(255,255,255,0.12) 2.2%, rgba(0,0,0,0.12) 4%, transparent 7%, transparent 70%, rgba(255,240,215,0.10) 100%)" }} />
      </div>
    </div>
  );
};

// flecha dibujada a mano (SVG), se traza con p 0..1
const HandArrow: React.FC<{ d: string; head: string; p: number; color?: string; w?: number }> = ({ d, head, p, color = OLE.fire, w = 7 }) => (
  <g fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, p / 0.8)} />
    <path d={head} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, (p - 0.8) / 0.2)} />
  </g>
);

export const OleCTA: React.FC<{
  cover?: string; qr?: string; point?: string; line?: string; kicker?: string; bed?: string; compact?: boolean; text?: string;
}> = ({ cover = "img/ole/portada.png", qr = "qr_ole.png", point = "Point your phone here", line = "Page 7 · the bean method", kicker = "THE WHOLE METHOD, WRITTEN DOWN", bed, compact = false, text = "The book's link is in the description" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const t = f / fps;
  const out = interpolate(f, [durationInFrames - 8, durationInFrames], [1, 0], cl);

  // libro: entra girando como objeto físico y se asienta
  const bookP = interpolate(f, [0, 30], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  const ry = interpolate(bookP, [0, 1], [-78, -20]) + Math.sin(t * 1.1) * 1.6 * bookP;
  const rx = 5 + Math.sin(t * 0.8 + 1) * 0.8;
  const bookY = (1 - bookP) * 120 + Math.sin(t * 1.3) * 5;
  // tarjeta del QR: llega girando y queda EXACTA a 0 (sin escala en ningún momento)
  const cardP = interpolate(f, [12, 36], [0, 1], { ...cl, easing: Easing.out(Easing.back(1.15)) });
  const cardDone = f >= 36;
  const cardRot = cardDone ? 0 : (1 - cardP) * 7;
  const cardX = cardDone ? 0 : Math.round((1 - cardP) * 700);
  const arrowP = interpolate(f, [40, 62], [0, 1], cl);
  const write = interpolate(f, [34, 58], [0, 100], cl);
  const lineIn = interpolate(f, [48, 64], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });

  if (compact) {
    const qs = 343;
    return (
      <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
        {bed ? <OleBed src={bed} veil={0.2} /> : null}
        <div style={{ position: "absolute", right: 60, bottom: 56, display: "flex", alignItems: "flex-end", gap: 34 }}>
          <div style={{ perspective: 1600, translate: `0 ${bookY * 0.6}px`, opacity: bookP, marginBottom: 20 }}>
            <div style={{ position: "absolute", left: 10, right: -10, bottom: -18, height: 30, borderRadius: "50%", background: "rgba(40,24,10,0.35)", filter: "blur(12px)" }} />
            <OleBook3D cover={cover} h={330} ry={ry} rx={rx} />
          </div>
          <div style={{ translate: `${cardX}px 0`, rotate: `${cardRot}deg`, background: QR_BG, padding: "18px 18px 22px", borderRadius: 10,
            boxShadow: `0 18px 40px ${OLE.shadow}, 0 2px 4px rgba(0,0,0,0.2)`, display: "flex", flexDirection: "column", alignItems: "center", width: qs + 36 }}>
            <Img src={asset(qr)} style={{ width: qs, height: qs, display: "block" }} />
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 34, lineHeight: 1.1, color: OLE.forest, textAlign: "center", marginTop: 6, clipPath: `inset(0 ${100 - write}% 0 0)` }}>{text} ↓</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  const qs = 441;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      {bed ? <OleBed src={bed} veil={0.32} /> : <AbsoluteFill style={{ ...woodBg("#BD915E") }} />}
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "soft-light", background: "radial-gradient(ellipse at 30% 35%, rgba(255,200,130,0.6), transparent 60%)" }} />
      {/* libro */}
      <div style={{ position: "absolute", left: 250, top: 150, perspective: 2000, opacity: Math.min(1, bookP * 2), translate: `0 ${bookY}px` }}>
        <div style={{ position: "absolute", left: 30, right: -40, bottom: -34, height: 60, borderRadius: "50%", background: "rgba(40,24,10,0.40)", filter: "blur(18px)" }} />
        <OleBook3D cover={cover} h={780} ry={ry} rx={rx} />
      </div>
      {/* kicker */}
      {kicker ? (
        <div style={{ position: "absolute", left: 1060, top: 92, width: 640, textAlign: "center", fontFamily: LABEL, fontWeight: 600, fontSize: 30, letterSpacing: 6, color: OLE.forest,
          opacity: lineIn, background: hexA(OLE.cream, 0.92), padding: "10px 0", borderRadius: 4 }}>{kicker}</div>
      ) : null}
      {/* tarjeta del QR */}
      <div style={{ position: "absolute", left: 1150, top: 170, translate: `${cardX}px 0`, rotate: `${cardRot}deg`, background: QR_BG, padding: 26, borderRadius: 12,
        boxShadow: `0 24px 54px rgba(55,32,12,0.38), 0 2px 5px rgba(0,0,0,0.2)`, width: qs + 52 }}>
        <div style={{ position: "absolute", top: -16, left: "50%", marginLeft: -70, width: 140, height: 34, background: hexA(OLE.kraft, 0.7), rotate: "-3deg" }} />
        <Img src={asset(qr)} style={{ width: qs, height: qs, display: "block" }} />
        <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 32, letterSpacing: 4, color: OLE.forest, textAlign: "center", marginTop: 8, opacity: lineIn }}>{line}</div>
      </div>
      {/* "Point your phone here" + flecha */}
      <div style={{ position: "absolute", left: 1396, top: 752, translate: "-50% 0", whiteSpace: "nowrap", textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: point.length > 24 ? 54 : 64, color: OLE.forest,
        clipPath: `inset(-20px ${100 - write}% -20px 0)`, textShadow: `0 0 18px ${hexA(OLE.cream, 0.9)}, 0 0 4px ${hexA(OLE.cream, 1)}` }}>{point}</div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {(() => { const fs = point.length > 24 ? 54 : 64; const x0 = 1396 - point.length * fs * 0.235 - 24; return (
          <HandArrow p={arrowP} d={`M ${x0} 800 C ${x0 - 60} 790, 1110 770, 1150 716`} head="M 1128 728 L 1152 712 L 1156 740" color={OLE.fire} w={8} />); })()}
      </svg>
    </AbsoluteFill>
  );
};
