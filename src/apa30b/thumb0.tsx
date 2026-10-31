// cuadro 0 = la miniatura elegida («31 Mice In 1 Night») SIN el texto: el balde lleno visto desde arriba — empuje lento hacia el
// tronco de la trampa, briznas de paja que caen sobre el borde; a 1,05-1,4 s se funde en el avatar sin corte.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const rn = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
export const Thumb0: React.FC<{ t: number }> = ({ t }) => {
  const k = Math.min(1, t / 1.4), ease = 1 - Math.pow(1 - k, 2);
  const op = t < 1.05 ? 1 : Math.max(0, 1 - (t - 1.05) / 0.35);
  return <AbsoluteFill style={{ opacity: op, overflow: "hidden", background: "#1a140c" }}>
    <AbsoluteFill style={{ transform: `scale(${1.0 + 0.05 * ease}) translate(${0.6 * ease}%, ${0.4 * ease}%)`, transformOrigin: "36% 52%" }}>
      <Img src={staticFile("apa30b/thumb0.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {/* briznas de paja que caen sobre el borde del balde */}
      {Array.from({ length: 10 }, (_, i) => { const ph = (t * (0.35 + 0.4 * rn(i, 1)) + rn(i, 2)) % 1;
        return <div key={i} style={{ position: "absolute", left: `${8 + 60 * rn(i, 3)}%`, top: `${-4 + 30 * ph}%`, width: 26 + 20 * rn(i, 4), height: 3, borderRadius: 2,
          background: "#d9b866", opacity: 0.7 * (1 - ph), transform: `rotate(${(rn(i, 5) - 0.5) * 120 + t * 40}deg)` }} />; })}
    </AbsoluteFill>
  </AbsoluteFill>;
};
