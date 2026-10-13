// sachiko4 · componentes propios: tarjeta de secreto (número a la izquierda, foto a la derecha, sin solaparse) y tarjeta de dato.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { img, C, SERIF, LABEL } from "../sachiko/Base";

// Tarjeta numerada: el número ocupa el tercio izquierdo; la foto va en un marco a la derecha. Nunca se pisan.
export const SecretCard: React.FC<{ a?: number; d?: number; n: string; title: string; k: string; label?: string }> = ({ n, title, k, label }) => {
  const f = useCurrentFrame();
  const op = Math.min(1, f / 12);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Img src={img(k)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }} />
      <div style={{ position: "absolute", left: 110, top: 150, width: 560, opacity: op }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 46, letterSpacing: 14, color: C.lilac }}>{label || "SECRET"}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: n.length > 1 ? 300 : 360, lineHeight: 0.9, color: C.porc, textShadow: "0 6px 24px rgba(0,0,0,0.6)" }}>{n}</div>
      </div>
      <div style={{ position: "absolute", right: 110, top: 200, width: 900, height: 560, opacity: op, borderRadius: 8, overflow: "hidden", border: "8px solid #FBF8F2", boxShadow: "0 18px 50px rgba(0,0,0,0.5)" }}>
        <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", right: 110, top: 800, width: 900, textAlign: "center", opacity: op }}>
        <span style={{ display: "inline-block", background: C.porc, color: C.ink, padding: "18px 30px", fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 3 }}>{title.toUpperCase()}</span>
      </div>
    </AbsoluteFill>
  );
};

// Tarjeta de dato (ratio, seguridad, repaso): líneas grandes sobre fondo oscuro de la foto.
export const InfoCard: React.FC<{ a?: number; d?: number; head: string; lines: string[]; k: string }> = ({ head, lines, k }) => {
  const f = useCurrentFrame();
  const op = Math.min(1, f / 12);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Img src={img(k)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }} />
      <div style={{ position: "absolute", left: 140, right: 140, top: 180, opacity: op }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 48, letterSpacing: 12, color: C.lilac }}>{head}</div>
        {lines.map((l, i) => (
          <div key={i} style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 80, lineHeight: 1.15, color: C.porc, marginTop: 26, textShadow: "0 4px 18px rgba(0,0,0,0.7)" }}>{l}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const MINE = { SecretCard, InfoCard };
