// Escenas sobre fotos de chiyo01 (skill edicion-sobre-fotos): un mecanismo distinto por escena, escritas de cero.
// Ideas y coordenadas: D:/rtmp/chiyo01/ideas.md. Fotos a 1920x1080 con objectFit:'fill'.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const GOLD = "#B79A5B", LACA = "#2B0F19", CREMA = "#EEE4D8";
const sh = "0 2px 18px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.6)";

// ---------- Escena 1 (gancho): biombo de cuatro hojas; cada hoja gira en su palabra y trae su franja del tocador
const HOJAS = [[0, 510], [510, 850], [850, 1440], [1440, 1920]];
const CENTROS = [334, 684, 1148, 1630];
export const Biombo: React.FC<{ src: string; marks: number[]; labels: string[]; title: string; titleAt: number; serif: string; dur: number }> = ({ src, marks, labels, title, titleAt, serif, dur }) => {
  const f = useCurrentFrame();
  const cam = 1.02 + 0.05 * (f / Math.max(1, dur));
  const tIn = spring({ frame: f - titleAt, fps: 30, config: { damping: 18 } });
  return (
    <AbsoluteFill style={{ background: "#12060A", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, perspective: 2600, transform: `scale(${cam})`, transformOrigin: "50% 46%" }}>
        {HOJAS.map(([x0, x1], i) => {
          const p = spring({ frame: f - marks[i], fps: 30, config: { damping: 17, mass: 0.9 } });
          const pliegue = (i % 2 ? -1 : 1) * 14 * (1 - p); // biombo plegado en zigzag hasta que gira
          const ang = 180 * (1 - p) + pliegue;
          const w = x1 - x0;
          return (
            <div key={i} style={{ position: "absolute", left: x0, top: 0, width: w, height: 1080, transformStyle: "preserve-3d", transform: `rotateY(${ang}deg)` }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: w, height: 1080, overflow: "hidden", backfaceVisibility: "hidden" }}>
                <Img src={staticFile(src)} style={{ ...FULL, left: -x0 }} />
                <div style={{ position: "absolute", left: 0, top: 0, width: w, height: 1080, boxShadow: "inset 10px 0 24px -12px rgba(0,0,0,0.55), inset -10px 0 24px -12px rgba(0,0,0,0.55)" }} />
              </div>
              <div style={{ position: "absolute", left: 0, top: 0, width: w, height: 1080, backfaceVisibility: "hidden", transform: "rotateY(180deg)",
                background: `linear-gradient(100deg, #3A1522 0%, ${LACA} 45%, #1A080E 100%)`, boxShadow: `inset 0 0 0 3px ${GOLD}, inset 0 0 0 26px ${LACA}, inset 0 0 0 27px rgba(183,154,91,0.5)` }}>
                <div style={{ position: "absolute", left: w / 2 - 44, top: 496, width: 88, height: 88, borderRadius: 44, boxShadow: `inset 0 0 0 2px rgba(183,154,91,0.6)` }} />
              </div>
            </div>
          );
        })}
      </div>
      {labels.map((l, i) => {
        const q = spring({ frame: f - marks[i] - 9, fps: 30, config: { damping: 15 } });
        return <div key={i} style={{ position: "absolute", left: CENTROS[i] - 260, width: 520, top: 742, textAlign: "center", fontFamily: serif, fontStyle: "italic", fontWeight: 500, fontSize: 58, color: "#FFFDFB", textShadow: sh, opacity: q, transform: `translateY(${(1 - q) * 24}px)` }}>{l}</div>;
      })}
      <div style={{ position: "absolute", left: 0, width: 1920, top: 902, textAlign: "center", fontFamily: serif, fontWeight: 500, fontSize: 92, color: "#FFFDFB", textShadow: sh, opacity: tIn, transform: `translateY(${(1 - tIn) * 30}px)` }}>{title}</div>
    </AbsoluteFill>
  );
};

// ---------- Escena 2 (paso 1): el cuadro se llena de aceite dorado desde abajo y vuelve a bajar
const Aceite: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  const z = 1.16 - 0.08 * Easing.out(Easing.cubic)(Math.min(1, f / dur));
  const sube = interpolate(f, [12, 50], [1080, 430], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const baja = interpolate(f, [dur - 22, dur - 4], [0, 700], { ...CL, easing: Easing.in(Easing.cubic) });
  const y = sube + baja;
  const pts = Array.from({ length: 13 }, (_, i) => `${(i / 12) * 100}% ${(18 + 9 * Math.sin(i * 1.1 + f * 0.16) + 5 * Math.sin(i * 2.3 - f * 0.11)).toFixed(1)}px`);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#1A080E" }}>
      <Img src={staticFile(src)} style={{ ...FULL, transform: `scale(${z})`, transformOrigin: "62% 54%" }} />
      <div style={{ position: "absolute", left: 0, top: y, width: 1920, height: 1100, clipPath: `polygon(${pts.join(", ")}, 100% 100%, 0% 100%)`,
        background: "linear-gradient(180deg, rgba(255,228,140,0.62) 0px, rgba(226,170,48,0.40) 26px, rgba(190,128,20,0.44) 420px, rgba(150,92,8,0.5) 1100px)" }} />
    </AbsoluteFill>
  );
};

// ---------- Escena 3 (paso 2): todo empañado de vapor; una toalla pasa en diagonal y lo deja limpio
const Vapor: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  const z = 1.06 + 0.07 * (f / dur);
  const e = interpolate(f, [16, 58], [-10, 122], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const tr: React.CSSProperties = { transform: `scale(${z})`, transformOrigin: "45% 60%" };
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#1A080E" }}>
      <Img src={staticFile(src)} style={{ ...FULL, ...tr }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden", clipPath: `polygon(${e}% 0%, 100% 0%, 100% 100%, ${e - 14}% 100%)` }}>
        <Img src={staticFile(src)} style={{ ...FULL, ...tr, filter: "blur(18px) brightness(1.1)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: "linear-gradient(180deg, rgba(255,253,251,0.5), rgba(246,240,236,0.36))" }} />
      </div>
      {e > -9 && e < 121 && (
        <div style={{ position: "absolute", left: (e - 7) * 19.2 - 95, top: -160, width: 190, height: 1400, transform: "rotate(14deg)", borderRadius: 26,
          background: "repeating-linear-gradient(0deg, #FBF8F3 0 7px, #EFE9E0 7px 9px), #F8F4EE", boxShadow: "0 0 60px 14px rgba(255,255,255,0.55), -14px 0 40px rgba(0,0,0,0.28), inset 0 0 0 5px rgba(255,255,255,0.7)" }} />
      )}
    </AbsoluteFill>
  );
};

// ---------- Escena 4 (paso 3): tres hoyuelos se hunden en la imagen, uno por presión, y quedan marcados
const HOYOS: [number, number][] = [[560, 470], [980, 600], [1380, 430]];
const Presion: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  const z = 1.05 + 0.05 * (f / dur);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#1A080E" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${z})`, transformOrigin: "72% 70%" }}>
        <Img src={staticFile(src)} style={FULL} />
        {HOYOS.map(([cx, cy], i) => {
          const t0 = 16 + i * 13;
          const hunde = spring({ frame: f - t0, fps: 30, config: { damping: 9, mass: 0.7 } });
          const suelta = interpolate(f, [t0 + 14, t0 + 30], [0, 0.55], CL);
          const k = Math.max(0, hunde - suelta); // se hunde y vuelve casi todo: queda la marca
          const R = 175;
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: `circle(${R}px at ${cx}px ${cy}px)` }}>
                <Img src={staticFile(src)} style={{ ...FULL, transform: `scale(${1 - 0.085 * k})`, transformOrigin: `${cx}px ${cy}px`, filter: `brightness(${1 - 0.1 * k})` }} />
              </div>
              <div style={{ position: "absolute", left: cx - R, top: cy - R, width: R * 2, height: R * 2, borderRadius: R, opacity: Math.min(1, k * 1.4),
                boxShadow: "inset 0 22px 46px rgba(0,0,0,0.5), inset 0 -10px 26px rgba(255,255,255,0.28), 0 0 0 2px rgba(255,255,255,0.14)" }} />
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Escena 5 (paso 4): una aguja dorada da la vuelta entera y va dejando la imagen detrás de sí
const Aguja: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [12, 50], [0, 360], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const z = 1.14 - 0.07 * Easing.out(Easing.cubic)(Math.min(1, f / dur));
  const mask = a >= 359.5 ? undefined : `conic-gradient(from 0deg at 50% 50%, #000 0deg, #000 ${a}deg, transparent ${a + 0.4}deg, transparent 360deg)`;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: `radial-gradient(circle at 50% 50%, #F7F2EB 0%, ${CREMA} 55%, #DCCDBB 100%)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, WebkitMaskImage: mask, maskImage: mask }}>
        <Img src={staticFile(src)} style={{ ...FULL, transform: `scale(${z})`, transformOrigin: "58% 76%" }} />
      </div>
      {a < 359.5 && (
        <>
          <div style={{ position: "absolute", left: 957, top: 540 - 1250, width: 6, height: 1250, background: `linear-gradient(180deg, rgba(183,154,91,0) 0%, ${GOLD} 30%, #E6CD8E 100%)`, transformOrigin: "50% 100%", transform: `rotate(${a}deg)`, boxShadow: "0 0 16px rgba(0,0,0,0.35)" }} />
          <div style={{ position: "absolute", left: 960 - 17, top: 540 - 17, width: 34, height: 34, borderRadius: 17, background: GOLD, boxShadow: "0 2px 10px rgba(0,0,0,0.45), inset 0 0 0 4px #E6CD8E" }} />
        </>
      )}
    </AbsoluteFill>
  );
};

// capa de foto de la apertura de cada paso
export const Mecanismo: React.FC<{ n: number; src: string; dur: number }> = ({ n, src, dur }) => {
  if (n === 1) return <Aceite src={src} dur={dur} />;
  if (n === 2) return <Vapor src={src} dur={dur} />;
  if (n === 3) return <Presion src={src} dur={dur} />;
  return <Aguja src={src} dur={dur} />;
};
