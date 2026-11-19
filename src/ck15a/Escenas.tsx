// Escenas ck15a · 1959 Church Cookie Exchange Shortbread — cinco escenas hechas con las fotos reales (ver D:/rtmp/ck15a/ideas.md)
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S = (n: string) => staticFile(`ck15a/g/${n}.png`);
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const EASE = Easing.bezier(0.45, 0, 0.2, 1);
const BOX: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden" };
// cámara: escala + punto mirado (x,y) que queda al centro del cuadro
const cam = (s: number, x: number, y: number): React.CSSProperties => ({ ...BOX, overflow: "visible", transformOrigin: "0px 0px", transform: `translate(${960 - x * s}px, ${540 - y * s}px) scale(${s})` });
const lerp = (f: number, ks: number[], vs: number[]) => interpolate(f, ks, vs, { ...CL, easing: EASE });

// 1 · Misma manteca: la cámara arranca pegada a la fuente quemada y viaja en una sola curva a la pálida; al final las dos fuentes se levantan juntas de la mesa
export const Pans: React.FC<{ dur: number; fButter: number }> = ({ dur, fButter }) => {
  const f = useCurrentFrame();
  const k = [0, Math.max(10, fButter - 4), dur];
  const s = (1 + 0.05 * f / dur) * lerp(f, k, [2.05, 1.7, 1.12]);
  const x = lerp(f, k, [720, 1250, 960]);
  const y = lerp(f, k, [585, 590, 560]);
  const lift = lerp(f, [fButter, fButter + 16], [0, 1]);
  const pan = (clip: string) => (
    <div style={{ ...BOX, overflow: "visible", clipPath: clip, transform: `translateY(${-10 * lift}px) scale(${1 + 0.025 * lift})`, transformOrigin: "960px 585px", filter: `drop-shadow(0px ${18 * lift}px ${22 * lift}px rgba(0,0,0,0.55))` }}>
      <Img src={S("e_pans")} style={FULL} />
    </div>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1410", overflow: "hidden" }}>
      <div style={cam(s, x, y)}>
        <Img src={S("e_pans")} style={{ ...FULL, filter: `brightness(${1 - 0.18 * lift})` }} />
        {pan("inset(400px 985px 310px 505px)")}
        {pan("inset(400px 440px 310px 1015px)")}
      </div>
    </AbsoluteFill>
  );
};

// 2 · La tarjeta de 1959: se despega de la mesada y queda de frente a cámara mientras la cocina se apaga; con «tin» la cámara la deja y viaja a la lata
export const Card: React.FC<{ dur: number; fCard: number; fNine: number; fTin: number; fThree: number }> = ({ dur, fCard, fNine, fTin, fThree }) => {
  const f = useCurrentFrame();
  const up = lerp(f, [fNine - 6, fNine + 22, fTin - 10, fTin + 14], [0, 1, 1, 0]);
  const s = (1 + 0.05 * f / dur) * lerp(f, [0, fCard + 30, fTin - 8, fTin + 24, fThree, dur], [1.08, 1.5, 1.5, 1.75, 1.75, 1.82]);
  const x = lerp(f, [0, fCard + 30, fTin - 8, fTin + 24], [1080, 1005, 1005, 1180]);
  const y = lerp(f, [0, fCard + 30, fTin - 8, fTin + 24], [560, 700, 700, 430]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#16110d", overflow: "hidden" }}>
      <div style={cam(s, x, y)}>
        <Img src={S("e_card")} style={{ ...FULL, filter: `blur(${7 * up}px) brightness(${1 - 0.45 * up})` }} />
        <div style={{ ...BOX, overflow: "visible", clipPath: "inset(530px 665px 212px 755px)", transformOrigin: "1005px 700px", transform: `perspective(1600px) translateY(${-60 * up}px) rotateX(${-28 * up}deg) rotateZ(${-3 * up}deg) scale(${1 + 0.16 * up})`, filter: `drop-shadow(0px ${30 * up}px ${30 * up}px rgba(0,0,0,0.6))` }}>
          <Img src={S("e_card")} style={FULL} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 3 · Horno: con «three seventy-five» la perilla real gira de más; con «browned» la cámara entra al horno y la fuente se oscurece en los bordes hasta «hard»
export const Oven: React.FC<{ dur: number; fDeg: number; fBrown: number; fHard: number }> = ({ dur, fDeg, fBrown, fHard }) => {
  const f = useCurrentFrame();
  const s = (1 + 0.05 * f / dur) * lerp(f, [0, fDeg - 6, fDeg + 20, fBrown - 4, fBrown + 30, dur], [1.05, 1.3, 2.6, 2.6, 2.3, 2.45]);
  const x = lerp(f, [0, fDeg - 6, fDeg + 20, fBrown - 4, fBrown + 30], [960, 1150, 1335, 1335, 1030]);
  const y = lerp(f, [0, fDeg - 6, fDeg + 20, fBrown - 4, fBrown + 30], [560, 470, 268, 268, 520]);
  const turn = lerp(f, [fDeg + 4, fDeg + 30], [0, 55]);
  const burn = lerp(f, [fBrown, fHard + 10], [0, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f0c0a", overflow: "hidden" }}>
      <div style={cam(s, x, y)}>
        <Img src={S("e_oven")} style={FULL} />
        <div style={{ ...BOX, overflow: "visible", clipPath: "circle(30px at 1335px 268px)", transformOrigin: "1335px 268px", transform: `rotate(${turn}deg)` }}>
          <Img src={S("e_oven")} style={FULL} />
        </div>
        <div style={{ ...BOX, clipPath: "inset(455px 655px 485px 810px)" }}>
          <Img src={S("e_oven")} style={{ ...FULL, filter: `sepia(${0.55 * burn}) saturate(${1 + 0.6 * burn}) brightness(${1 - 0.32 * burn}) contrast(${1 + 0.15 * burn})` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 4 · El chasquido: la toma da un golpe seco con «snap» y la cámara se mete en la miga del corte; lo que no es la galletita se va de foco
export const Snap: React.FC<{ dur: number; fSnap: number; fSandy: number }> = ({ dur, fSnap, fSandy }) => {
  const f = useCurrentFrame();
  const hit = interpolate(f, [fSnap - 1, fSnap + 2, fSnap + 9], [0, 1, 0], CL);
  const s = (1 + 0.05 * f / dur) * lerp(f, [0, fSnap, fSandy - 4, fSandy + 34, dur], [1.0, 1.25, 1.35, 2.3, 2.4]) + 0.05 * hit;
  const x = lerp(f, [0, fSnap, fSandy + 34], [1000, 1010, 990]);
  const y = lerp(f, [0, fSnap, fSandy + 34], [560, 560, 600]);
  const foc = lerp(f, [fSandy - 4, fSandy + 30], [0, 1]);
  const R = 300 - 120 * foc;
  return (
    <AbsoluteFill style={{ backgroundColor: "#120e0b", overflow: "hidden" }}>
      <div style={{ ...cam(s, x, y), translate: `${hit * 7}px ${-hit * 5}px` }}>
        <Img src={S("e_snap")} style={{ ...FULL, filter: `blur(${5 * foc}px)` }} />
        <div style={{ ...BOX, WebkitMaskImage: `radial-gradient(ellipse ${R * 1.1}px ${R}px at 990px 600px, black 55%, transparent 100%)`, maskImage: `radial-gradient(ellipse ${R * 1.1}px ${R}px at 990px 600px, black 55%, transparent 100%)` }}>
          <Img src={S("e_snap")} style={FULL} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 5 · La lata: cada capa de papel y galletitas se apila de a una sobre su palabra (una / papel / otra) y la lata se llena hasta el borde con «nothing moves»
export const Tin: React.FC<{ dur: number; fOne: number; fWax: number; fAnother: number; fFill: number }> = ({ dur, fOne, fWax, fAnother, fFill }) => {
  const f = useCurrentFrame();
  const s = (1 + 0.05 * f / dur) * lerp(f, [0, fOne, fFill, dur], [1.18, 1.35, 1.6, 1.7]);
  const lay = (t: number) => lerp(f, [t - 4, t + 14], [0, 1]);
  const a = lay(fOne), b = lay(fWax), c = lay(fAnother), d = lay(fFill);
  return (
    <AbsoluteFill style={{ backgroundColor: "#15110d", overflow: "hidden" }}>
      <div style={cam(s, 960, 560)}>
        <Img src={S("e_tin")} style={{ ...FULL, filter: `brightness(${0.75 + 0.25 * a})` }} />
        {[b, c, d].map((v, i) => (
          <div key={i} style={{ ...BOX, overflow: "visible", opacity: v, transformOrigin: "960px 560px", transform: `translateY(${(1 - v) * -40 - i * 6}px) scale(${0.985 - i * 0.012}) rotate(${(i - 1) * 2}deg)`, filter: `drop-shadow(0px 10px 14px rgba(0,0,0,0.45))`, WebkitMaskImage: "radial-gradient(circle 420px at 960px 560px, black 80%, transparent 100%)", maskImage: "radial-gradient(circle 420px at 960px 560px, black 80%, transparent 100%)" }}>
            <Img src={S("e_tin")} style={{ ...FULL, filter: i === 0 ? "sepia(0.25) brightness(1.12) blur(1.2px)" : "none" }} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const ESC_CK15A = { pans: Pans, card: Card, oven: Oven, snap: Snap, tin: Tin } as Record<string, React.FC<any>>;
