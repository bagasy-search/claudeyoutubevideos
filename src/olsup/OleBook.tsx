// OleBookPage (pagina real del libro sobre mesa, zoom punto por punto) y OleCTA (portada + QR real).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, SLAB, HAND, SERIF, woodBg, hexA, lanternGlow } from "./OleSupTheme";
import { Bed, CL, Rivet, easeOut, fadeOut, flicker, pop } from "./OleBits";

const PW = 980, PH = 1268; // resolucion nativa de las paginas del libro

/* ---------------------------------------------------------------- BOOK PAGE */
// keys: [t seg, x 0-1 (punto de la pagina), y 0-1, escala]. Escala 1 = pagina entera visible (encaja en alto);
// >1 acerca (1.3 ~ resolucion nativa 1:1, mas alla se amplia el bitmap).
export const OleBookPage: React.FC<{ page: string; pageNo: number; keys: [number, number, number, number][]; caption?: string }> = ({ page, pageNo, keys, caption }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const t = f / fps;
  const inP = interpolate(f, [0, 18], [0, 1], { ...CL, easing: easeOut });
  const out = fadeOut(f, durationInFrames, 8);
  const ks = keys.length ? keys : ([[0, 0.5, 0.5, 1]] as [number, number, number, number][]);
  let x = ks[0][1], y = ks[0][2], s = ks[0][3];
  for (let i = 0; i < ks.length - 1; i++) {
    const a = ks[i], b = ks[i + 1];
    if (t >= a[0] && t <= b[0]) {
      const u = Easing.inOut(Easing.cubic)(b[0] === a[0] ? 1 : (t - a[0]) / (b[0] - a[0]));
      x = a[1] + (b[1] - a[1]) * u; y = a[2] + (b[2] - a[2]) * u; s = a[3] + (b[3] - a[3]) * u;
    } else if (t > b[0]) { x = b[1]; y = b[2]; s = b[3]; }
  }
  const fit = 1000 / PH; // pagina entera ~ 1000 px de alto
  const S = fit * s;
  const left = 960 - x * PW * S, top = 540 - y * PH * S;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <AbsoluteFill style={{ ...woodBg(OLE.wood2, 2) }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(255,190,110,0.16), rgba(10,5,2,0.6) 100%)" }} />
      <AbsoluteFill style={{ rotate: `${-1.1 * inP}deg`, scale: String(0.94 + 0.06 * inP), opacity: inP }}>
        <div style={{ position: "absolute", left, top, width: PW, height: PH, transformOrigin: "0 0", scale: String(S), boxShadow: `${24 / S}px ${34 / S}px ${60 / S}px rgba(0,0,0,0.6)`, background: "#f3ead2" }}>
          <Img src={staticFile(page)} style={{ width: PW, height: PH, display: "block" }} />
        </div>
      </AbsoluteFill>
      {/* etiquetas */}
      <div style={{ position: "absolute", left: 60, top: 56, translate: `${(1 - pop(f, fps, 6)) * -400}px 0` }}>
        <div style={{ position: "relative", padding: "16px 40px 18px", borderRadius: 12, ...woodBg(OLE.wood3, 5), boxShadow: `0 16px 30px ${OLE.shadow}, inset 0 0 0 3px rgba(0,0,0,0.5), inset 0 3px 0 rgba(255,225,170,0.3)` }}>
          <Rivet x={16} y="50%" />
          <div style={{ fontFamily: SLAB, fontSize: 54, color: OLE.cream, lineHeight: 1, textShadow: "0 4px 0 rgba(0,0,0,0.5)", paddingLeft: 14 }}>page {pageNo}</div>
        </div>
        <div style={{ marginTop: 14, display: "inline-block", padding: "8px 26px", borderRadius: 8, background: "rgba(20,12,6,0.72)", fontFamily: HAND, fontWeight: 700, fontSize: 42, color: OLE.lanternSoft, opacity: interpolate(f, [14, 28], [0, 1], CL) }}>In Ole's cookbook</div>
      </div>
      {caption ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", opacity: interpolate(f, [18, 32], [0, 1], CL) }}><span style={{ display: "inline-block", padding: "10px 34px", borderRadius: 10, background: "rgba(20,12,6,0.78)", fontFamily: SERIF, fontSize: 46, color: OLE.cream }}>{caption}</span></div> : null}
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- CTA */
export const OleCTA: React.FC<{ cover: string; qr: string; line1?: string; line2?: string; url?: string; bed?: string }> = ({ cover, qr, line1 = "Point your phone at this code", line2 = "or tap the link in the description", url, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const pc = pop(f, fps, 6, 13); const pq = interpolate(f, [16, 28], [0, 1], { ...CL, easing: easeOut });
  const tIn = interpolate(f, [0, 16], [0, 1], { ...CL, easing: easeOut });
  const float = Math.sin(f * 0.055) * 10; const tilt = -5 + Math.sin(f * 0.04) * 1.6;
  const glow = flicker(f, 1);
  const QS = 500; // el PNG del QR ya incluye su zona silenciosa (4 modulos); ademas va sobre blanco puro
  return (
    <AbsoluteFill>
      <Bed src={bed} />
      <AbsoluteFill style={{ background: lanternGlow, opacity: 0.75 * glow }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 46, textAlign: "center", opacity: tIn, translate: `0 ${(1 - tIn) * -40}px` }}>
        <div style={{ fontFamily: SLAB, fontSize: 92, lineHeight: 1.05, color: OLE.cream, textShadow: "0 7px 0 rgba(0,0,0,0.55), 0 0 30px rgba(0,0,0,0.4)" }}>{line1}</div>
        {line2 ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 70, color: OLE.lanternSoft, marginTop: 6, textShadow: "0 4px 0 rgba(0,0,0,0.55)" }}>{line2}</div> : null}
      </div>
      {/* portada */}
      <div style={{ position: "absolute", left: 262, top: 292 + float, width: 565, height: 730, rotate: `${tilt * pc}deg`, scale: String(0.6 + 0.4 * pc), opacity: Math.min(1, pc * 1.5), boxShadow: `18px 30px 50px rgba(0,0,0,0.6)`, borderRadius: 6, overflow: "hidden", background: "#222" }}>
        <Img src={staticFile(cover)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 26, background: "linear-gradient(90deg, rgba(0,0,0,0.35), transparent)" }} />
      </div>
      {/* QR real, entero, sin fade tapando ni sombra encima */}
      <div style={{ position: "absolute", left: 1130, top: 290, padding: 26, background: "#FFFFFF", borderRadius: 26, boxShadow: `0 26px 50px ${OLE.shadow}`, translate: `0 ${(1 - pq) * 60}px`, opacity: pq >= 0.999 ? 1 : Math.min(1, pq * 1.2) }}>
        <Img src={staticFile(qr)} style={{ width: QS, height: QS, display: "block", imageRendering: "pixelated" }} />
      </div>
      {url ? <div style={{ position: "absolute", left: 1130, width: QS + 52, top: 290 + QS + 52 + 30, textAlign: "center", fontFamily: SLAB, fontSize: 42, color: OLE.lanternSoft, textShadow: "0 4px 0 rgba(0,0,0,0.55)", opacity: interpolate(f, [30, 44], [0, 1], CL) }}>{url}</div> : null}
    </AbsoluteFill>
  );
};
