// cuadro 0 = la miniatura elegida («NO POISON») SIN el texto ni la flecha: la rata en la paja y el granjero con el rollo de malla —
// empuje lento hacia la rata, motas de polvo que flotan en el contraluz; a 1,05-1,4 s se funde en el avatar sin corte.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const rn = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
export const Thumb0: React.FC<{ t: number }> = ({ t }) => {
  const k = Math.min(1, t / 1.4), ease = 1 - Math.pow(1 - k, 2);
  const op = t < 1.05 ? 1 : Math.max(0, 1 - (t - 1.05) / 0.35);
  return <AbsoluteFill style={{ opacity: op, overflow: "hidden", background: "#1a140c" }}>
    <AbsoluteFill style={{ transform: `scale(${1.0 + 0.05 * ease}) translate(${0.5 * ease}%, ${-0.3 * ease}%)`, transformOrigin: "30% 55%" }}>
      <Img src={staticFile("apa30c/thumb0.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {/* motas de polvo que flotan en el contraluz del gallinero */}
      {Array.from({ length: 14 }, (_, i) => { const ph = (t * (0.08 + 0.1 * rn(i, 1)) + rn(i, 2)) % 1;
        return <div key={i} style={{ position: "absolute", left: `${4 + 55 * rn(i, 3) + 3 * Math.sin(t * 2 + i)}%`, top: `${8 + 40 * rn(i, 4) - 12 * ph}%`, width: 5 + 6 * rn(i, 5), height: 5 + 6 * rn(i, 5), borderRadius: "50%",
          background: "#fff2c8", opacity: 0.45 * Math.sin(ph * Math.PI), filter: "blur(1.5px)" }} />; })}
    </AbsoluteFill>
  </AbsoluteFill>;
};
