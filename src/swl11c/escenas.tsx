// swl11c · escenas sobre fotos (ideas en D:/rtmp/swl11c/ideas.md). Coordenadas en 1920x1080; T = segundo absoluto del video.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { eOut, eIO, lerp, sf } from "./look";

const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const poly = (p: number[][]) => `polygon(${p.map(([x, y]) => `${(x / 19.2).toFixed(2)}% ${(y / 10.8).toFixed(2)}%`).join(", ")})`;

// 1 · foco: la foto en dos profundidades (auto con la familia / iglesia); en "sermon" el foco viaja del auto a la iglesia
const CAR = [[0, 702], [150, 640], [205, 592], [300, 575], [330, 520], [350, 486], [560, 470], [1150, 470], [1235, 515], [1330, 590], [1520, 688], [1920, 700], [1920, 1080], [0, 1080]];
const Foco: React.FC<{ s: any; T: number }> = ({ s, T }) => {
  const k = eIO(T, 994.5, 995.6);
  const bgBlur = lerp(9, 0, k), carBlur = lerp(0, 7, k);
  const z = lerp(1.02, 1.07, eIO(T, 989.5, 997.9));
  const ox = lerp(760, 1500, eIO(T, 994.3, 996.6));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#1b1a18" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${ox}px 420px` }}>
        <Img src={sf(s.src)} style={{ ...FULL, filter: `blur(${bgBlur}px)`, transform: `scale(${1 + bgBlur * 0.004})`, transformOrigin: "1500px 300px" }} />
        <div style={{ position: "absolute", inset: 0, clipPath: poly(CAR) }}>
          <Img src={sf(s.src)} style={{ ...FULL, filter: `blur(${carBlur}px) brightness(${lerp(1, 0.9, k)})` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 2 · puerta: la hoja real empieza cerrada sobre el vano (zaguán en penumbra); en "opened" gira sobre su bisagra (x=698) y entra el sol
const LEAF = [[262, 0], [690, 0], [706, 880], [445, 1080], [262, 1080]];
const Puerta: React.FC<{ s: any; T: number }> = ({ s, T }) => {
  const HX = 698;
  const op = eIO(T, 1003.2, 1004.1);
  const ang = lerp(158, 0, op);
  const sun = eOut(T, 1003.6, 1005.0);
  const R = sun * 1900;
  const z = lerp(1.0, 1.1, eIO(T, 1004.4, 1006.4));
  const m = `radial-gradient(ellipse ${R}px ${R * 0.75}px at 905px 860px, #000 ${Math.max(0, R * 0.55)}px, transparent ${R}px)`;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0d0b09" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "905px 600px" }}>
        <Img src={sf(s.src)} style={{ ...FULL, filter: "brightness(.22) saturate(.6)" }} />
        {R > 1 && <AbsoluteFill style={{ WebkitMaskImage: m, maskImage: m }}><Img src={sf(s.src)} style={FULL} /></AbsoluteFill>}
        <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: `${HX}px 500px` }}>
          <div style={{ position: "absolute", inset: 0, transformOrigin: `${HX}px 50%`, transform: `rotateY(${ang}deg)`, clipPath: poly(LEAF) }}>
            <Img src={sf(s.src)} style={{ ...FULL, filter: `brightness(${lerp(0.3, 1, sun)})` }} />
            <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(0,0,0,${0.004 * ang}), transparent 60%)` }} />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 3 · polvo: la vajilla buena guardada cubierta de polvo; se limpia desde la mano real de Ruth y al final la cocina se apaga
const Polvo: React.FC<{ s: any; T: number }> = ({ s, T }) => {
  const HX = 930, HY = 180;
  const a = eOut(T, 2037.9, 2039.0), b = eOut(T, 2039.4, 2040.3);
  const R1 = a * 620 + 0.5, R2 = b * 700 + 0.5;
  const dim = eIO(T, 2043.1, 2044.3);
  const z = lerp(1.0, 1.08, eIO(T, 2035.5, 2044.7));
  // máscara del polvo: blanco donde queda polvo, transparente donde ya se limpió
  const dustMask = `radial-gradient(ellipse ${R1 * 1.1}px ${R1 * 0.5}px at ${HX}px ${HY}px, transparent ${R1 * 0.7}px, #000 ${R1}px)`;
  const dustMask2 = `radial-gradient(ellipse ${R2}px ${R2 * 0.45}px at 1100px 320px, transparent ${R2 * 0.7}px, #000 ${R2}px)`;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#120f0c" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "1090px 260px" }}>
        <Img src={sf(s.src)} style={{ ...FULL, filter: `brightness(${lerp(1, 0.45, dim)})` }} />
        <div style={{ position: "absolute", inset: 0, clipPath: "inset(0px 480px 660px 745px)" }}>
          <div style={{ position: "absolute", inset: 0, WebkitMaskImage: dustMask, maskImage: dustMask }}>
            <div style={{ position: "absolute", inset: 0, WebkitMaskImage: dustMask2, maskImage: dustMask2 }}>
              <Img src={sf(s.src)} style={{ ...FULL, filter: "grayscale(.75) brightness(1.08) contrast(.62) sepia(.25)" }} />
              <AbsoluteFill style={{ background: "rgba(205,198,182,.28)" }} />
            </div>
          </div>
        </div>
        {dim > 0 && <div style={{ position: "absolute", inset: 0, clipPath: "inset(0px 480px 660px 745px round 6px)", opacity: dim }}>
          <Img src={sf(s.src)} style={FULL} />
        </div>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Escena: React.FC<{ name: string; s: any }> = ({ name, s }) => {
  const f = useCurrentFrame();
  const T = (s.from + f) / 30;
  if (name === "foco") return <Foco s={s} T={T} />;
  if (name === "puerta") return <Puerta s={s} T={T} />;
  if (name === "polvo") return <Polvo s={s} T={T} />;
  return <AbsoluteFill style={{ background: "#000" }} />;
};
