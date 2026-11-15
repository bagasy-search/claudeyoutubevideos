// Escenas sobre las fotos reales de cme14a (método edicion-sobre-fotos; ideas en D:/rtmp/cme14a/ideas.md).
// Todo con capas de la misma foto en 1920x1080 (objectFit fill): sin dibujos encima.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Oswald";
const { fontFamily: OSW } = loadFont();
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const fade = (f: number, dur: number) => interpolate(f, [0, 6, dur - 6, dur], [0, 1, 1, 0], CL);

// 1 · PERSIANA: cada aparato es una lama que gira sobre su eje al nombrarse y del revés queda apagada con "NO"
const CORTES = [0, 440, 665, 1000, 1330, 1920];
export const EscPersiana: React.FC<{ dur: number; img: string; fs: number[] }> = ({ dur, img, fs }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], [1.0, 1.045]);
  return (
    <AbsoluteFill style={{ background: "#0E0E0F", overflow: "hidden", opacity: fade(f, dur) }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "960px 520px" }}>
        {CORTES.slice(0, -1).map((x0, i) => {
          const w = CORTES[i + 1] - x0;
          const at = Math.max(fs[i] ?? 9999, 10);
          const a = interpolate(f, [at, at + 20], [0, 180], { ...CL, easing: io });
          const sig = fs.slice(i + 1).find((v) => v !== undefined) ?? 99999;
          const noOp = interpolate(f, [at + 12, at + 18, Math.max(sig, 10), Math.max(sig, 10) + 8], [0, 1, 1, 0.18], CL);
          const lift = Math.sin((a * Math.PI) / 180);
          const face: React.CSSProperties = { position: "absolute", inset: 0, overflow: "hidden", backfaceVisibility: "hidden" };
          return (
            <div key={i} style={{ position: "absolute", left: x0 + 3, top: 0, width: w - 6, height: 1080, perspective: 1100 }}>
              <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `translateZ(${-140 * lift}px) rotateY(${a}deg)`, boxShadow: "0 0 24px rgba(0,0,0,0.6)" }}>
                <div style={face}><Img src={staticFile(img)} style={{ ...FULL, left: -x0 - 3 }} /></div>
                <div style={{ ...face, transform: "rotateY(180deg)" }}>
                  <Img src={staticFile(img)} style={{ ...FULL, left: -x0 - 3, filter: "grayscale(1) brightness(0.5) contrast(1.1)" }} />
                  <div style={{ position: "absolute", left: 0, right: 0, top: 430, textAlign: "center", fontFamily: OSW, fontWeight: 700, fontSize: Math.min(170, w * 0.6), color: "#E0402F", opacity: noOp, textShadow: "0 4px 18px rgba(0,0,0,0.8)" }}>NO</div>
                </div>
              </div>
              {a > 2 && a < 178 ? <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.55 * lift})`, pointerEvents: "none" }} /> : null}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 2 · BALANZA: la foto entera es el brazo de una balanza apoyado en la cinta métrica (905,740) y se vence hacia la batería de auto
export const EscBalanza: React.FC<{ dur: number; img: string; fTilt: number }> = ({ dur, img, fTilt }) => {
  const f = useCurrentFrame();
  const t = Math.max(0, f - fTilt) / 30;
  const ang = f < fTilt ? 0 : 7 * (1 - Math.exp(-2.2 * t) * Math.cos(7 * t));
  const z = 1.42 + interpolate(f, [0, dur], [0, 0.03]);
  const tx = (k: number) => interpolate(f, [k, k + 10], [0, 1], { ...CL, easing: io });
  const lab: React.CSSProperties = { position: "absolute", top: 70, width: 600, textAlign: "center", fontFamily: OSW, fontWeight: 700, fontSize: 84, color: "#F4F1E8", textShadow: "0 4px 16px rgba(0,0,0,0.85)" };
  return (
    <AbsoluteFill style={{ background: "#0E0E0F", overflow: "hidden", opacity: fade(f, dur) }}>
      <AbsoluteFill style={{ transformOrigin: "905px 740px", transform: `rotate(${ang}deg) scale(${z})` }}>
        <Img src={staticFile(img)} style={FULL} />
      </AbsoluteFill>
      <div style={{ ...lab, left: 150, opacity: tx(4), transform: `translateY(${(1 - tx(4)) * 20}px)` }}>11 kg</div>
      <div style={{ ...lab, left: 1170, fontSize: 110, color: "#FFC93C", opacity: tx(fTilt + 8), transform: `translateY(${(1 - tx(fTilt + 8)) * 20}px)` }}>×2</div>
    </AbsoluteFill>
  );
};

// 3 · FRÍO QUE BAJA: desde el estante de las botellas la foto se enfría por franjas que caen hasta las verduras
export const EscFrio: React.FC<{ dur: number; img: string; fCold: number }> = ({ dur, img, fCold }) => {
  const f = useCurrentFrame();
  const STEPS = 8, H = 56;
  let edge = 0;
  for (let i = 0; i < STEPS; i++) edge += interpolate(f, [fCold + i * 6, fCold + i * 6 + 8], [0, H], { ...CL, easing: io });
  const y0 = 640, yE = y0 + 160 + edge;
  const ty = interpolate(f, [0, dur], [0, -50], { easing: io });
  const mask = `linear-gradient(180deg, black 0px, black ${yE - 40}px, transparent ${yE + 30}px)`;
  const cold = interpolate(f, [fCold, fCold + 12], [0, 1], CL);
  return (
    <AbsoluteFill style={{ background: "#0E0E0F", overflow: "hidden", opacity: fade(f, dur) }}>
      <AbsoluteFill style={{ transform: `translateY(${ty}px) scale(1.12)` }}>
        <Img src={staticFile(img)} style={FULL} />
        <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 800px, 1750px 640px, 1920px 640px, 1920px 1080px, 0 1080px)", WebkitMaskImage: mask, maskImage: mask, opacity: cold }}>
          <Img src={staticFile(img)} style={{ ...FULL, filter: "saturate(0.35) brightness(1.22) contrast(0.92) blur(0.8px)" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(120,180,255,0.62)", mixBlendMode: "color" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(225,240,255,0.26)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: yE - 70, height: 90, background: "linear-gradient(180deg, rgba(235,248,255,0) 0%, rgba(235,248,255,0.85) 70%, rgba(235,248,255,0) 100%)", mixBlendMode: "screen" }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 4 · BLANDA: la mitad de abajo, cortada en tiras, se comba en arco a lo largo del cable derretido y después vuelve
export const EscBlanda: React.FC<{ dur: number; img: string; fSoft: number; fBack: number }> = ({ dur, img, fSoft, fBack }) => {
  const f = useCurrentFrame();
  const A = 115 * interpolate(f, [fSoft, fSoft + 12], [0, 1], { ...CL, easing: io }) * interpolate(f, [fBack, fBack + 14], [1, 0], { ...CL, easing: io });
  const z = interpolate(f, [0, dur], [1.0, 1.06]);
  const X0 = 380, X1 = 1250, SW = 30;
  const mask = "linear-gradient(180deg, transparent 0px, transparent 380px, black 520px, black 1080px)";
  const tiras = [];
  for (let x = 320; x < 1310; x += SW) {
    const c = x + SW / 2;
    const d = c > X0 && c < X1 ? A * Math.sin((Math.PI * (c - X0)) / (X1 - X0)) : 0;
    tiras.push(
      <div key={x} style={{ position: "absolute", left: x, top: 0, width: SW + 1, height: 1080, overflow: "hidden", transformOrigin: "50% 450px", transform: `scaleY(${1 + d / 630})`, WebkitMaskImage: mask, maskImage: mask }}>
        <Img src={staticFile(img)} style={{ ...FULL, left: -x }} />
      </div>
    );
  }
  return (
    <AbsoluteFill style={{ background: "#0E0E0F", overflow: "hidden", opacity: fade(f, dur) }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "820px 650px", overflow: "hidden" }}>
        <Img src={staticFile(img)} style={FULL} />
        {A > 0.3 ? tiras : null}
        {A > 0.3 ? <div style={{ position: "absolute", left: 815 - 420, top: 720 - 260, width: 840, height: 520, borderRadius: "50%", opacity: A / 115, background: "radial-gradient(ellipse, rgba(255,150,60,0.45) 0%, rgba(255,110,40,0.15) 45%, rgba(255,110,40,0) 70%)", mixBlendMode: "screen" }} /> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
