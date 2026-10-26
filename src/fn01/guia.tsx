// CTA de la guía paga de Ramón («The $2 Mechanic»): la tapa REAL del set se abre en 3D sobre una página REAL del PDF + QR grande
// a la URL corta. En pantalla nunca la URL: sólo el nombre y "link in the first line of the description". pag = g_<pag>.jpg
import React from "react";
import { Img, staticFile } from "remotion";
import { COL, FONT, P, e, ei, extrude, spr } from "./lib";
const GOLD = "#ffb257", GREEN = "#2fae62";
export const GuideCTA: React.FC<{ t: number; at: number; out: number; pag: string; note?: string }> = ({ t, at, out, pag, note }) => {
  const o = e(t, at, at + 0.35) * (1 - e(t, out, out + 0.4)); if (o < 0.01) return null;
  const bk = Math.min(1, spr(t, at + 0.1, 0.9)), open = ei(t, at + 1.0, at + 2.3), qk = Math.min(1, spr(t, at + 1.8)), sk = Math.min(1, spr(t, at + 2.9, 1.2));
  const W = 500, H = 750;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, fontFamily: FONT, background: "radial-gradient(ellipse at 40% 45%, rgba(40,28,14,.88), rgba(10,8,6,.96))" }}>
      <div style={{ position: "absolute", left: 960, top: 92, transform: "translate(-50%,-50%)", textAlign: "center", width: 1700 }}>
        <div style={{ fontWeight: 900, fontSize: 34, letterSpacing: 9, color: GOLD }}>MY 5 BOOKS · 200 FIXES OF $2 OR LESS</div>
        <div style={{ fontWeight: 900, fontSize: 76, color: COL.ink, textShadow: extrude(4, "#000"), marginTop: 4 }}>The $2 Mechanic</div>
      </div>
      <div style={{ position: "absolute", left: 560, top: 570, width: W * 2, height: H, transform: `translate(-25%,-50%) perspective(2200px) rotateX(${8 - 8 * bk}deg) rotateY(${-18 + 10 * open}deg) translateY(${(1 - bk) * 300}px) scale(${0.8 + 0.2 * bk})`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", left: W * 0.5, top: 0, width: W, height: H, background: "#fdfbf5", boxShadow: "0 50px 100px rgba(0,0,0,.65)", borderRadius: "0 8px 8px 0", overflow: "hidden" }}>
          <Img src={staticFile(P + "g_" + pag + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
        </div>
        <div style={{ position: "absolute", left: W * 0.5, top: 0, width: W, height: H, transformOrigin: "left center", transform: `rotateY(${-165 * open}deg)`, transformStyle: "preserve-3d" }}>
          <Img src={staticFile(P + "g_tapa.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: "0 8px 8px 0", backfaceVisibility: "hidden", boxShadow: "0 50px 100px rgba(0,0,0,.65)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#e9e2d2,#f7f3ea)", transform: "rotateY(180deg)", backfaceVisibility: "hidden", borderRadius: "8px 0 0 8px" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 1480, top: 520, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * qk})`, opacity: Math.min(1, qk * 1.5), textAlign: "center" }}>
        <div style={{ background: "#fff", padding: 26, borderRadius: 26, boxShadow: "0 40px 90px rgba(0,0,0,.6)", border: `10px solid ${GOLD}` }}>
          <Img src={staticFile(P + "g_qr.png")} style={{ width: 470, height: 470, display: "block" }} />
        </div>
        <div style={{ fontWeight: 900, fontSize: 38, color: GOLD, marginTop: 22, whiteSpace: "nowrap", textShadow: extrude(3, "#000") }}>📱 Scan it with your phone camera</div>
      </div>
      <div style={{ position: "absolute", left: 1480, top: 915, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * sk})`, opacity: Math.min(1, sk * 1.5), background: GREEN, color: "#fff", fontWeight: 900, fontSize: 36, padding: "12px 28px", borderRadius: 16, boxShadow: "0 20px 50px rgba(0,0,0,.5)", whiteSpace: "nowrap" }}>{note ?? "200 fixes of $2 or less"}</div>
      <div style={{ position: "absolute", left: 960, top: 1028, transform: "translate(-50%,-50%)", fontWeight: 800, fontSize: 40, color: COL.ink, opacity: e(t, at + 2.2, at + 2.6), textShadow: extrude(3, "#000") }}>Link in the first line of the description ↓</div>
    </div>
  );
};
