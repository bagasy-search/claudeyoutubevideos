// Escenas sobre fotos reales · ck11e (ideas en D:/rtmp/ck11e/ideas.md). Sin componentes hechos ni dibujos: sólo la foto y su geometría.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const S = (n: string) => staticFile(`ck11e/g/${n}.png`);
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const hand: React.CSSProperties = { position: "absolute", fontFamily: "Kalam, cursive", fontWeight: 700, color: "#fff", textShadow: "0 3px 14px rgba(0,0,0,0.9)" };

// ---------- 1 · la aguja real del termómetro gira a 350 y vuelve a su 325; la masa se corre hasta el reborde
export const Horno: React.FC<{ dur: number; fFifty: number; fReally: number; fSpreads: number }> = ({ dur, fFifty, fReally, fSpreads }) => {
  const f = useCurrentFrame();
  const T = { x: 962, y: 725, r: 80 };
  const D = { x: 975, y: 448 };
  // cámara: entra al termómetro y, en "spreads", vuelve a la bandeja entera
  const zin = interpolate(f, [0, fFifty], [1.0, 1.75], { ...CL, easing: io });
  const zout = interpolate(f, [fSpreads - 14, fSpreads + 22], [0, 1], { ...CL, easing: io });
  const k = zin + (1.04 - zin) * zout;
  const ox = T.x + (D.x - T.x) * zout, oy = T.y + (D.y - T.y) * zout;
  // aguja: la cara entera gira (recorte circular) a 350 y vuelve con rebote
  const ang = f < fReally
    ? interpolate(f, [fFifty - 6, fFifty + 8], [0, 38], { ...CL, easing: io })
    : interpolate(f, [fReally, fReally + 8, fReally + 14, fReally + 20], [38, -6, 3, 0], CL);
  // masa: se estira desde su centro y pisa el reborde
  const sx = interpolate(f, [fSpreads - 4, fSpreads + 30], [1, 1.022], { ...CL, easing: io });
  const sy = interpolate(f, [fSpreads - 4, fSpreads + 30], [1, 1.05], { ...CL, easing: io });
  const t1 = interpolate(f, [fFifty, fFifty + 8, fReally - 4, fReally], [0, 1, 1, 0], CL);
  const t2 = interpolate(f, [fReally + 6, fReally + 14, fSpreads - 16, fSpreads - 8], [0, 1, 1, 0], CL);
  const dough = "polygon(282px 340px, 700px 334px, 1200px 334px, 1668px 342px, 1676px 455px, 1670px 552px, 1200px 560px, 700px 560px, 286px 552px, 276px 450px)";
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <div style={{ ...full, transform: `scale(${k})`, transformOrigin: `${ox}px ${oy}px` }}>
        <Img src={S("e_hornoin")} style={full} />
        <div style={{ ...full, clipPath: dough, transform: `scale(${sx}, ${sy})`, transformOrigin: `${D.x}px ${D.y}px` }}><Img src={S("e_hornoin")} style={full} /></div>
        <div style={{ ...full, clipPath: `circle(${T.r}px at ${T.x}px ${T.y}px)`, transform: `rotate(${ang}deg)`, transformOrigin: `${T.x}px ${T.y}px` }}><Img src={S("e_hornoin")} style={full} /></div>
      </div>
      <div style={{ ...hand, left: 1180, top: 560, fontSize: 92, opacity: t1 }}>says 350°</div>
      <div style={{ ...hand, left: 1180, top: 560, fontSize: 92, opacity: t2, color: "#ffd9a8" }}>really 325°</div>
    </AbsoluteFill>
  );
};

// ---------- 2 · fundido por luminancia: las grietas oscuras quedan, el azúcar se vuelve nieve del campo arado
export const Campo: React.FC<{ dur: number; fCrack: number; fSnow: number; fDec: number }> = ({ dur, fCrack, fSnow, fDec }) => {
  const f = useCurrentFrame();
  const B = { x: 1190, y: 760 }; // granero
  const kc = interpolate(f, [0, fSnow + 20], [1.12, 1.0], { ...CL, easing: io });
  const push = interpolate(f, [0, fCrack], [1.0, 1.05], CL);
  const a = interpolate(f, [fSnow - 12, fSnow + 18], [0, 1], { ...CL, easing: io }); // el campo aparece debajo
  const off = interpolate(f, [fSnow + 30, fDec + 6], [1, 0], { ...CL, easing: io }); // la galleta se va
  const kf = interpolate(f, [fSnow - 12, dur], [2.1, 1.0], { ...CL, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#fff" }}>
      <div style={{ ...full, opacity: a, transform: `scale(${kf})`, transformOrigin: `${B.x}px ${B.y}px` }}><Img src={S("e_campo")} style={full} /></div>
      <div style={{ ...full, opacity: off, mixBlendMode: "multiply", transform: `scale(${kc * push})`, transformOrigin: "960px 470px" }}><Img src={S("e_crinkle")} style={full} /></div>
    </AbsoluteFill>
  );
};

// ---------- 3 · el bombón real cae, se hunde en la bola y desde el impacto corren las diez grietas reales que abren la galleta
export const Flor: React.FC<{ dur: number; fCracks: number; fFlower: number }> = ({ dur, fCracks, fFlower }) => {
  const f = useCurrentFrame();
  const B0 = { x: 942, y: 536, r: 285 }, B1 = { x: 971, y: 543, r: 323 }, C = { x: 980, y: 555, r: 88 };
  const fImp = Math.max(8, fCracks - 4);
  const drop = interpolate(f, [0, fImp], [-760, 0], { ...CL, easing: Easing.in(Easing.quad) });
  const squash = interpolate(f, [fImp, fImp + 3, fImp + 8], [1, 0.9, 1], CL);
  const flat = interpolate(f, [fImp, fFlower + 6], [0, 1], { ...CL, easing: io });
  const kb = 1 + (B1.r / B0.r - 1) * flat;
  const R = interpolate(f, [fImp, fFlower + 10], [0, 430], { ...CL, easing: Easing.out(Easing.cubic) });
  const inner = interpolate(f, [fImp, fImp + 10, fFlower + 14], [0.22, 0.32, 1], CL);
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a0 = ((-95 + 36 * i) * Math.PI) / 180, a1 = ((-95 + 36 * i + 18) * Math.PI) / 180;
    pts.push(`${C.x + Math.cos(a0) * R}px ${C.y + Math.sin(a0) * R}px`);
    pts.push(`${C.x + Math.cos(a1) * R * inner}px ${C.y + Math.sin(a1) * R * inner}px`);
  }
  const cam = interpolate(f, [0, dur], [1.0, 1.07], CL);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <div style={{ ...full, transform: `scale(${cam})`, transformOrigin: `${B1.x}px ${B1.y}px` }}>
        <Img src={S("e_flor0")} style={full} />
        <div style={{ ...full, clipPath: `circle(${B0.r - 3}px at ${B0.x}px ${B0.y}px)`, transform: `translate(${(B1.x - B0.x) * flat}px, ${(B1.y - B0.y) * flat}px) scale(${kb})`, transformOrigin: `${B0.x}px ${B0.y}px` }}><Img src={S("e_flor0")} style={full} /></div>
        {R > 1 && <div style={{ ...full, clipPath: `polygon(${pts.join(",")})` }}><Img src={S("e_flor1")} style={full} /></div>}
        <div style={{ ...full, clipPath: `circle(${C.r}px at ${C.x}px ${C.y}px)`, transform: `translateY(${drop}px) scale(${squash}, ${2 - squash})`, transformOrigin: `${C.x}px ${C.y + C.r}px`, filter: "drop-shadow(0 18px 20px rgba(0,0,0,0.45))" }}><Img src={S("e_flor1")} style={full} /></div>
      </div>
    </AbsoluteFill>
  );
};

export const ESC_CK11E = { horno: Horno, campo: Campo, flor: Flor } as Record<string, React.FC<any>>;
