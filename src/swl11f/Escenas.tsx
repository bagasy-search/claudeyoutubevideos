// Escenas sobre fotos reales · swl11f (ideas en D:/rtmp/swl11f/ideas.md). Sin componentes hechos ni dibujos: sólo la foto y su geometría.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const S = (n: string) => staticFile(`swl11f/g/${n}.png`);
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const hand: React.CSSProperties = { position: "absolute", fontFamily: "Kalam, cursive", fontWeight: 700, color: "#fff", textShadow: "0 3px 14px rgba(0,0,0,0.9)" };

// ---------- 1 · el vapor real es el pincel: la cena de la iglesia aparece dentro de las volutas, sube con ellas y llena el cuadro
export const Paquete: React.FC<{ dur: number; fOpen: number; fSteam: number; fChurch: number }> = ({ dur, fOpen, fSteam, fChurch }) => {
  const f = useCurrentFrame();
  const V = { x: 990, y: 260 }; // núcleo del vapor
  const kc = interpolate(f, [0, fOpen], [1.0, 1.06], CL); // paquete cerrado, empuje hacia la costura
  const cut = f >= fOpen ? 1 : 0;
  const kp = interpolate(f, [fOpen, dur], [1.04, 1.12], CL); // paquete abierto, hacia el vapor
  // máscara: crece y sube con el vapor
  const m = interpolate(f, [fSteam - 6, fChurch + 4], [0.9, 3.4], { ...CL, easing: Easing.in(Easing.quad) });
  const rise = interpolate(f, [fSteam - 6, fChurch + 4], [40, -160], { ...CL, easing: io });
  const mo = interpolate(f, [fSteam - 8, fSteam + 10], [0, 1], CL);
  const mx = V.x - V.x * m, my = V.y - V.y * m + rise;
  const fillA = interpolate(f, [fChurch, fChurch + 18], [0, 1], { ...CL, easing: io });
  const kcena = interpolate(f, [fSteam, dur], [1.12, 1.0], { ...CL, easing: Easing.out(Easing.cubic) });
  const mask: React.CSSProperties = {
    WebkitMaskImage: `url(${S("e_vapor")})`, maskImage: `url(${S("e_vapor")})`,
    WebkitMaskSize: `${1920 * m}px ${1080 * m}px`, maskSize: `${1920 * m}px ${1080 * m}px`,
    WebkitMaskPosition: `${mx}px ${my}px`, maskPosition: `${mx}px ${my}px`,
    WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      {!cut && <div style={{ ...full, transform: `scale(${kc})`, transformOrigin: "960px 585px" }}><Img src={S("e_paq0")} style={full} /></div>}
      {cut === 1 && <div style={{ ...full, transform: `scale(${kp})`, transformOrigin: `${V.x}px ${V.y + 120}px` }}><Img src={S("e_paq1")} style={full} /></div>}
      {f >= fSteam - 8 && (
        <div style={{ ...full, ...mask, opacity: mo }}>
          <div style={{ ...full, transform: `scale(${kcena})`, transformOrigin: "960px 400px", filter: "brightness(1.08)" }}><Img src={S("e_cena")} style={full} /></div>
        </div>
      )}
      {f >= fChurch && <div style={{ ...full, opacity: fillA, transform: `scale(${kcena})`, transformOrigin: "960px 400px" }}><Img src={S("e_cena")} style={full} /></div>}
    </AbsoluteFill>
  );
};

// ---------- 2 · cortes secos: en cada palabra del estallido la cámara salta a otro arándano reventado real, con culatazo
export const Arandano: React.FC<{ dur: number; fPop: number; fOne: number; fAnother: number; fLittle: number; fFire: number }> = ({ dur, fPop, fOne, fAnother, fLittle, fFire }) => {
  const f = useCurrentFrame();
  const B = [
    { t: fPop, x: 1062, y: 258 },
    { t: fOne, x: 540, y: 372 },
    { t: fAnother, x: 885, y: 532 },
    { t: fLittle, x: 375, y: 765 },
    { t: fFire, x: 1377, y: 915 },
  ];
  const back = fFire + 14;
  let k = interpolate(f, [0, fPop], [1.0, 1.08], CL), cx = 960, cy = 560, t0 = -99;
  if (f >= fPop && f < back) {
    const cur = [...B].reverse().find((b) => f >= b.t)!;
    t0 = cur.t; cx = cur.x; cy = cur.y; k = 2.6 * interpolate(f - cur.t, [0, 6], [1.0, 0.985], CL);
  }
  if (f >= back) { t0 = back; k = interpolate(f, [back, dur], [1.0, 1.04], CL); cx = 960; cy = 540; }
  const kick = f - t0 >= 0 && f - t0 < 5 ? 1 + 0.06 * (1 - (f - t0) / 5) : 1;
  const kk = k * kick;
  // encuadre: el punto queda al centro sin dejar bordes vacíos
  const tx = Math.min(0, Math.max(1920 - 1920 * kk, 960 - cx * kk));
  const ty = Math.min(0, Math.max(1080 - 1080 * kk, 540 - cy * kk));
  const flash = f >= fPop && f - t0 >= 0 && f - t0 < 2 && t0 !== back ? 0.32 : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <div style={{ ...full, transform: `translate(${tx}px, ${ty}px) scale(${kk})`, transformOrigin: "0px 0px" }}><Img src={S("e_cran")} style={full} /></div>
      <AbsoluteFill style={{ background: "rgb(255,196,140)", opacity: flash, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

// ---------- 3 · cada yema real se balancea dentro de su clara como un péndulo amortiguado y se frena en el centro
export const Huevo: React.FC<{ dur: number; fSide: number; fYolks: number; fMiddle: number; fCenter: number }> = ({ dur, fSide, fYolks, fMiddle, fCenter }) => {
  const f = useCurrentFrame();
  const swap = fSide + 22;
  const Y = [
    { x: 585, y: 537, dx: -30, dy: 24, ph: 0 },
    { x: 830, y: 537, dx: 28, dy: -22, ph: 0.6 },
    { x: 1070, y: 537, dx: -26, dy: -24, ph: 1.1 },
    { x: 1316, y: 543, dx: 30, dy: 20, ph: 0.3 },
  ];
  const R = 74;
  const u = interpolate(f, [swap, fMiddle], [0, 1], CL);
  const env = (1 - u) * Math.exp(-1.6 * u);
  const settled = f >= fMiddle;
  // cámara
  const kcar = interpolate(f, [0, swap], [1.0, 1.08], CL);
  const push = interpolate(f, [fMiddle, fCenter - 6], [1.0, 1.32], { ...CL, easing: io });
  const pull = interpolate(f, [fCenter - 6, fCenter + 30], [0, 1], { ...CL, easing: io });
  const ky = push + (1.0 - push) * pull;
  const ox = 830 + (950 - 830) * pull;
  const fade = interpolate(f, [swap, swap + 10], [0, 1], CL);
  const tSide = interpolate(f, [fSide, fSide + 8, swap - 4, swap + 2], [0, 1, 1, 0], CL);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      {f < swap + 10 && <div style={{ ...full, transform: `scale(${kcar})`, transformOrigin: "960px 600px" }}><Img src={S("e_carton")} style={full} /></div>}
      {f >= swap && (
        <div style={{ ...full, opacity: fade, transform: `scale(${ky})`, transformOrigin: `${ox}px 540px` }}>
          <Img src={S("e_yemas")} style={full} />
          {!settled && Y.map((y, i) => (
            <div key={`c${i}`} style={{ position: "absolute", left: y.x - R - 18, top: y.y - R - 18, width: 2 * R + 36, height: 2 * R + 36, borderRadius: "50%", background: `radial-gradient(circle, rgb(228,227,217) ${R + 4}px, rgba(228,227,217,0) ${R + 18}px)` }} />
          ))}
          {!settled && Y.map((y, i) => {
            const w = Math.cos(2 * Math.PI * 3.2 * u + y.ph) * env;
            return (
              <div key={`y${i}`} style={{ ...full, transform: `translate(${y.dx * w}px, ${y.dy * w}px)`, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.25))" }}>
                <div style={{ ...full, clipPath: `circle(${R + 2}px at ${y.x}px ${y.y}px)` }}><Img src={S("e_yemas")} style={full} /></div>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ ...hand, left: 1180, top: 120, fontSize: 84, opacity: tSide }}>on its side · 30 min</div>
    </AbsoluteFill>
  );
};

export const ESC_SWL11F = { paquete: Paquete, arandano: Arandano, huevo: Huevo } as Record<string, React.FC<any>>;
