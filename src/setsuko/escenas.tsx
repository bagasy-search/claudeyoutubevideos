// setsuko01 · escenas SOBRE FOTOS (skill edicion-sobre-fotos; ideas en D:/rtmp/setsuko01/ideas.md). Fotos a 1920x1080 exactos, sin gráficos encima.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FR, P, cl, e, eo, lerp } from "./lib";

type SP = { t: number; a: number; b: number; arg?: string };
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const foto = (f: string) => staticFile(P + "g/" + f + ".jpg");

// 1 · "One hundred and twelve pieces": las siete hileras reales se despliegan como un biombo sobre la foto anterior
const HIL = [0, 105, 200, 300, 440, 590, 780, 1080];
export const doblez: React.FC<SP> = ({ t, a, b }) => {
  const cam = lerp(1.0, 1.06, cl((t - a) / (b - a + 0.5)));
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <Img src={foto("g007")} style={{ ...FULL, transform: "scale(1.12)", filter: `brightness(${lerp(1, 0.5, e(t, a, a + 0.5))})` }} />
    <AbsoluteFill style={{ perspective: 1700, perspectiveOrigin: "50% 0%", transform: `scale(${cam})`, transformOrigin: "50% 60%" }}>
      {HIL.slice(0, -1).map((y, i) => { const p = eo(t, a + 0.08 + i * 0.17, 0.55); if (p <= 0) return null;
        return <div key={i} style={{ position: "absolute", left: 0, top: y, width: 1920, height: HIL[i + 1] - y + 1, overflow: "hidden", transformOrigin: "50% 0%", transform: `rotateX(${(p - 1) * 88}deg)`, filter: `brightness(${lerp(0.45, 1, p)})`, backfaceVisibility: "hidden" }}>
          <Img src={foto("g008")} style={{ ...FULL, top: -y }} />
        </div>; })}
    </AbsoluteFill>
  </AbsoluteFill>;
};

// 2 · "three piles… The first pile": la foto en tres hojas (cortes por el tatami libre) que se apartan; la de los tacos se queda con la pantalla
const H1 = "polygon(0 0, 650px 0, 705px 470px, 705px 585px, 660px 610px, 660px 1080px, 0 1080px)";
const H2 = "polygon(650px 0, 1335px 0, 1335px 1080px, 660px 1080px, 660px 610px, 705px 585px, 705px 470px)";
const H3 = "polygon(1335px 0, 1920px 0, 1920px 1080px, 1335px 1080px)";
export const pilas: React.FC<SP> = ({ t, arg }) => {
  const a = FR(150), tres = Number(arg), uno = FR(151), fin = FR(153);
  const sep = eo(t, tres, 0.55), f = e(t, uno - 0.05, uno + 0.95), drift = cl((t - uno) / (fin - uno));
  const cam = lerp(1.05, 1.0, eo(t, a, 1.6));
  const sombra = "drop-shadow(0 18px 30px rgba(0,0,0,.55))";
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <Img src={foto("g094")} style={{ ...FULL, transform: "scale(1.15)", filter: "blur(22px) brightness(.32)" }} />
    <AbsoluteFill style={{ transform: `scale(${cam})` }}>
      <AbsoluteFill style={{ transform: `translate(${sep * 52 + f * 1500}px, ${sep * 14}px)`, filter: sombra }}><Img src={foto("g094")} style={{ ...FULL, clipPath: H3 }} /></AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate(${f * 1650}px, ${-sep * 12}px)`, filter: sombra }}><Img src={foto("g094")} style={{ ...FULL, clipPath: H2 }} /></AbsoluteFill>
      <AbsoluteFill style={{ transformOrigin: "340px 480px", transform: `translate(${-sep * 52 * (1 - f) + f * 560 - drift * 30}px, ${sep * 10 * (1 - f) + f * 50}px) scale(${1 + f * 0.82 + drift * 0.05})`, filter: sombra }}>
        <Img src={foto("g094")} style={{ ...FULL, clipPath: H1 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// 3 · "White leather sneakers, and black loafers": dos mitades llegan desde lados opuestos, cada una con su par, y cierran en la piedra libre (x=712)
export const pares: React.FC<SP> = ({ t, a, b, arg }) => {
  const negro = Number(arg), L = eo(t, a - 0.3, 0.55), Rr = eo(t, negro - 0.1, 0.6), junto = e(t, negro + 0.5, b + 0.4);
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <Img src={foto("g064")} style={{ ...FULL, transform: "scale(1.15)", filter: "blur(24px) brightness(.28)" }} />
    <AbsoluteFill style={{ transformOrigin: "700px 790px", transform: `scale(${1.22 + junto * 0.16})` }}>
      <AbsoluteFill style={{ transform: `translateX(${(L - 1) * 760}px)`, filter: "drop-shadow(14px 0 26px rgba(0,0,0,.5))" }}><Img src={foto("g064")} style={{ ...FULL, clipPath: "inset(0 1208px 0 0)" }} /></AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${(1 - Rr) * 1260}px)`, filter: "drop-shadow(-14px 0 26px rgba(0,0,0,.5))" }}><Img src={foto("g064")} style={{ ...FULL, clipPath: "inset(0 0 0 712px)" }} /></AbsoluteFill>
    </AbsoluteFill>
  </AbsoluteFill>;
};
