// sucarne · SEGUNDA PASADA (P3): capa de fotos de Claudio HACIENDO, encima de Full961b (= Final961 del run 38224388965, cbc8920).
// Tiempos absolutos de la voz. Fotos fuera de las ventanas de avatar (avwin.json), fuera del WOW del minuto 1 y del CTA final.
// [t_ini, t_fin, nombre, celular]: 1 de cada 4 en formato "foto de celular" (borde blanco, rotacion -2 grados, fondo borroso).
import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { fr, Grade, Grain } from "./Base";
import { Full961b } from "./Full961b";

const FOTOS: [number, number, string, boolean][] = [
  [47.80, 51.00, "F0051", false],
  [66.00, 69.40, "F0060", false],
  [130.00, 133.58, "F0130", false],
  [134.00, 136.50, "F0134", true],
  [290.00, 293.50, "F0286", false],
  [297.69, 303.00, "F0297", false],
  [303.15, 308.50, "F0303", false],
  [468.75, 475.00, "F0468", true],
  [576.50, 580.50, "F0576", false],
  [623.00, 628.00, "F0623", false],
  [628.00, 633.00, "F0628", false],
  [636.05, 639.99, "F0643", true],
  [707.64, 711.00, "F0707", false],
  [711.00, 714.02, "F0711", false],
  [720.50, 725.00, "F0720", false],
  [735.00, 740.50, "F0735", true],
  [775.00, 779.00, "F0775", false],
  [780.00, 784.00, "F0780", false],
  [785.00, 790.00, "F0785", false],
  [800.00, 806.00, "F0800", true],
  [808.50, 813.50, "F0808", false],
  [851.00, 856.00, "F0851", false],
  [857.00, 860.00, "F0857", false],
  [860.00, 864.17, "F0860", true],
  [868.00, 872.00, "F0872", false],
  [922.17, 925.61, "F0922", false],
  [925.61, 928.31, "F0925", false],
];

const Foto: React.FC<{ a: number; b: number; name: string; cel: boolean }> = ({ a, b, name, cel }) => {
  const f = useCurrentFrame();
  const t = Math.max(0, Math.min(1, f / Math.max(1, fr(b) - fr(a))));
  const s = 1 + 0.07 * t;
  const img = <Img src={staticFile(`img/sucarne/p2/${name}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />;
  if (!cel) {
    return (
      <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
        <div style={{ width: "100%", height: "100%", transform: `scale(${s})`, transformOrigin: "50% 50%" }}>{img}</div>
      </AbsoluteFill>
    );
  }
  const rot = name.charCodeAt(name.length - 1) % 2 === 0 ? -2 : 2;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <AbsoluteFill style={{ filter: "blur(18px) brightness(0.7)", transform: "scale(1.08)" }}>{img}</AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.3)" }} />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", padding: 14, width: 1440, transform: `rotate(${rot}deg) scale(${1 + 0.03 * t})`, boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
          <div style={{ width: "100%", aspectRatio: "16 / 9", overflow: "hidden" }}>{img}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const CapaFotos: React.FC = () => (
  <>
    {FOTOS.map(([a, b, name, cel]) => (
      <Sequence key={name} from={fr(a)} durationInFrames={fr(b) - fr(a)}>
        <Foto a={a} b={b} name={name} cel={cel} />
        <Grade /><Grain />
      </Sequence>
    ))}
  </>
);

export const Pasada2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Full961b />
    <CapaFotos />
  </AbsoluteFill>
);
