// CTA de la guía paga de Ernie («The Funeral Price Playbook»): la tapa REAL del libro 1 se abre en 3D sobre la hoja REAL de tachar
// (p. 83) y al lado entra la tapa del set de 5. En pantalla nunca la URL: sólo el nombre y "link in the first line of the description".
import React from "react";
import { Img, staticFile } from "remotion";
import { COL, FONT, P, e, ei, extrude, spr } from "./lib";
const GOLD = "#ffb257", RED = "#e8402f";
export const GuideCTA: React.FC<{ t: number; at: number; out: number; pag?: string; note?: string }> = ({ t, at, out, pag = "gpl", note }) => {
  const o = e(t, at, at + 0.35) * (1 - e(t, out, out + 0.4)); if (o < 0.01) return null;
  const bk = Math.min(1, spr(t, at + 0.1, 0.9)), open = ei(t, at + 0.9, at + 2.1), sk = Math.min(1, spr(t, at + 1.6, 0.9)), pk = Math.min(1, spr(t, at + 2.6, 1.2));
  const tacha = ei(t, at + 2.3, at + 3.6);  // tres renglones de la hoja se tachan con la birome roja
  const W = 470, H = 608;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, fontFamily: FONT, background: "radial-gradient(ellipse at 40% 45%, rgba(40,28,14,.9), rgba(10,8,6,.97))" }}>
      <div style={{ position: "absolute", left: 960, top: 104, transform: "translate(-50%,-50%)", textAlign: "center", width: 1700 }}>
        <div style={{ fontWeight: 900, fontSize: 32, letterSpacing: 8, color: GOLD }}>5 BOOKS · THE 9 LINES TO CROSS OUT</div>
        <div style={{ fontWeight: 900, fontSize: 78, color: COL.ink, textShadow: extrude(4, "#000"), marginTop: 4 }}>The Funeral Price Playbook</div>
      </div>
      <div style={{ position: "absolute", left: 720, top: 590, width: W * 2, height: H, transform: `translate(-25%,-50%) perspective(2200px) rotateX(${8 - 8 * bk}deg) rotateY(${-18 + 10 * open}deg) translateY(${(1 - bk) * 300}px) scale(${0.8 + 0.2 * bk})`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", left: W * 0.5, top: 0, width: W, height: H, background: "#fdfbf5", boxShadow: "0 50px 100px rgba(0,0,0,.65)", borderRadius: "0 8px 8px 0", overflow: "hidden" }}>
          <Img src={staticFile(P + "g_" + pag + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          {[0, 1, 2].map((i) => { const k = Math.min(1, Math.max(0, tacha * 3 - i)); return (
            <div key={i} style={{ position: "absolute", left: W * 0.08, top: H * [0.416, 0.48, 0.642][i], width: W * 0.42 * k, height: 4, background: RED, borderRadius: 2, transform: "rotate(-1deg)" }} />); })}
        </div>
        <div style={{ position: "absolute", left: W * 0.5, top: 0, width: W, height: H, transformOrigin: "left center", transform: `rotateY(${-165 * open}deg)`, transformStyle: "preserve-3d" }}>
          <Img src={staticFile(P + "g_tapa.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: "0 8px 8px 0", backfaceVisibility: "hidden", boxShadow: "0 50px 100px rgba(0,0,0,.65)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#e9e2d2,#f7f3ea)", transform: "rotateY(180deg)", backfaceVisibility: "hidden", borderRadius: "8px 0 0 8px" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 1530, top: 560, transform: `translate(-50%,-50%) rotate(${4 - 2 * sk}deg) translateX(${(1 - sk) * 500}px)`, opacity: Math.min(1, sk * 1.5) }}>
        <Img src={staticFile(P + "g_set.jpg")} style={{ width: 460, height: 690, display: "block", borderRadius: 10, boxShadow: "0 50px 100px rgba(0,0,0,.7)" }} />
      </div>
      <div style={{ position: "absolute", left: 1530, top: 940, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * pk})`, opacity: Math.min(1, pk * 1.5), background: RED, color: "#fff", fontWeight: 900, fontSize: 36, padding: "12px 28px", borderRadius: 16, boxShadow: "0 20px 50px rgba(0,0,0,.5)", whiteSpace: "nowrap" }}>{note ?? "Save $3,000–6,000 on a funeral"}</div>
      <div style={{ position: "absolute", left: 960, top: 1030, transform: "translate(-50%,-50%)", fontWeight: 800, fontSize: 40, color: COL.ink, opacity: e(t, at + 2.0, at + 2.4), textShadow: extrude(3, "#000"), whiteSpace: "nowrap" }}>Link in the first line of the description ↓</div>
    </div>
  );
};
