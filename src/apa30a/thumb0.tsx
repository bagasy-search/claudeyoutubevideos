// cuadro 0 = la miniatura elegida (a1 «LIVE CATCH MOLE TRAP») SIN el texto: la foto viva — empuje lento hacia el topo de la mano,
// migas de tierra que caen del tubo; a 1,05-1,4 s se funde en el avatar sin corte.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const rn = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
export const Thumb0: React.FC<{ t: number }> = ({ t }) => {
  const k = Math.min(1, t / 1.4), ease = 1 - Math.pow(1 - k, 2);
  const op = t < 1.05 ? 1 : Math.max(0, 1 - (t - 1.05) / 0.35);
  return <AbsoluteFill style={{ opacity: op, overflow: "hidden", background: "#f9f9f9" }}>
    <AbsoluteFill style={{ transform: `scale(${1.0 + 0.05 * ease}) translate(${-0.8 * ease}%, ${0.6 * ease}%)`, transformOrigin: "30% 62%" }}>
      <Img src={staticFile("apa30a/thumb0.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {/* migas de tierra que caen del borde del tubo */}
      {Array.from({ length: 14 }, (_, i) => { const ph = (t * (0.5 + 0.5 * rn(i, 1)) + rn(i, 2)) % 1;
        return <div key={i} style={{ position: "absolute", left: `${52 + 26 * rn(i, 3)}%`, top: `${62 + 26 * ph}%`, width: 4 + 5 * rn(i, 4), height: 4 + 4 * rn(i, 5), borderRadius: 3, background: "#4a3020", opacity: 0.75 * (1 - ph) }} />; })}
    </AbsoluteFill>
  </AbsoluteFill>;
};
