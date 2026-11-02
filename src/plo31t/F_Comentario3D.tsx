import React from "react";
import { AbsoluteFill, Img, staticFile, interpolate } from "remotion";
import { FONT, e, ei, spr } from "./lib";

const rnd = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

// Marcador físico: trazo con fibra, presión variable (grosor que cambia), borde irregular y salpicaduras
const Marcador: React.FC<{ prog: number; h: number; seed: number; pop: number }> = ({ prog, h, seed, pop }) => {
  const p = clamp(prog);
  const wob = (i: number) => (rnd(seed + i) - 0.5) * 2;
  // borde superior e inferior irregulares (fibra)
  const top = Array.from({ length: 24 }, (_, i) => `${(i / 23) * 100}% ${3 + wob(i) * 5}%`).join(", ");
  const bot = Array.from({ length: 24 }, (_, i) => `${100 - (i / 23) * 100}% ${97 + wob(i + 60) * 5}%`).join(", ");
  const clip = `polygon(${top}, ${bot})`;
  const bleed = clamp(p * 1.02);
  const scaleY = 0.72 + 0.34 * pop;
  // presión variable: grosor del trazo que respira a lo largo del recorrido
  const pressure = (x: number) => 1 + 0.16 * Math.sin(x * 9 + seed) + 0.1 * Math.sin(x * 23 + seed * 3);
  return (
    <>
      {/* sombra propia del marcador sobre el papel */}
      <div
        style={{
          position: "absolute",
          left: -8,
          top: -2,
          width: `calc(${bleed * 100}% + 16px)`,
          height: (h + 12) * scaleY,
          background: "rgba(120,90,0,0.16)",
          filter: "blur(6px)",
          borderRadius: 6,
          transform: "translate(3px,5px)",
          transformOrigin: "left center",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -10,
          top: -8,
          width: `calc(${bleed * 100}% + 20px)`,
          height: (h + 14) * scaleY,
          background: "rgba(255,216,74,0.30)",
          filter: "blur(9px)",
          borderRadius: 8,
          pointerEvents: "none",
          transformOrigin: "left center",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -6,
          top: -4,
          width: `calc(${bleed * 100}% + 12px)`,
          height: (h + 8) * scaleY,
          overflow: "hidden",
          borderRadius: 3,
          pointerEvents: "none",
          filter: "drop-shadow(0 2px 2px rgba(120,90,0,0.35))",
          transformOrigin: "left center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(255,214,70,0.96) 0%, rgba(255,222,96,0.99) 50%, rgba(255,232,130,0.94) 100%)",
            clipPath: clip,
            filter: "blur(0.35px)",
          }}
        />
        {/* vetas de fibra con presión variable */}
        {Array.from({ length: 20 }).map((_, i) => {
          const yy = 5 + rnd(seed + i * 3) * 90;
          const pr = pressure(i / 20);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                top: `${yy}%`,
                width: "100%",
                height: (1 + rnd(seed + i) * 2) * pr,
                background: `rgba(${rnd(seed + i) > 0.5 ? "255,244,160" : "206,158,0"},${0.24 + rnd(seed + i * 7) * 0.36})`,
                clipPath: clip,
              }}
            />
          );
        })}
        {/* micro-salpicaduras a la salida del trazo */}
        {Array.from({ length: 10 }).map((_, i) => {
          const sp = rnd(seed + i * 11);
          return (
            <div
              key={`s${i}`}
              style={{
                position: "absolute",
                left: `${bleed * 100 - 2 + sp * 14}px`,
                top: `${6 + rnd(seed + i * 5) * 84}%`,
                width: 2 + sp * 4,
                height: 2 + sp * 4,
                borderRadius: "50%",
                background: "rgba(255,222,96,0.9)",
                opacity: p > 0.6 ? clamp((p - 0.6) / 0.4) * 0.8 : 0,
              }}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.16,
            mixBlendMode: "multiply",
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><filter id='m'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23m)'/></svg>\")",
            clipPath: clip,
          }}
        />
      </div>
    </>
  );
};

const CARD_W = 1240;
const CARD_H = 640;
const FONT_SIZE = 52;

const Tarjeta: React.FC<{
  texto: string;
  resaltar: string;
  likes: number;
  likesProg: number;
  marcProg: number;
  marcPop: number;
  lift: number;
  heartBeat: number;
  shine: number;
  headZ: number;
  textZ: number;
}> = ({ texto, resaltar, likes, likesProg, marcProg, marcPop, lift, heartBeat, shine, headZ, textZ }) => {
  const idx = texto.indexOf(resaltar);
  const before = idx >= 0 ? texto.slice(0, idx) : texto;
  const mid = idx >= 0 ? resaltar : "";
  const after = idx >= 0 ? texto.slice(idx + resaltar.length) : "";
  const shownLikes = Math.round(likes * clamp(likesProg));
  const heartScale = 1 + 0.4 * heartBeat;

  return (
    <div
      style={{
        width: CARD_W,
        height: CARD_H,
        borderRadius: 24,
        background: "linear-gradient(160deg, #fbf8f1 0%, #f0e9d8 100%)",
        boxShadow:
          "0 50px 110px rgba(0,0,0,0.62), 0 12px 28px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(0,0,0,0.06)",
        position: "relative",
        overflow: "hidden",
        padding: "44px 52px",
        boxSizing: "border-box",
        fontFamily: FONT,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -160,
          left: `${-50 + shine * 160}%`,
          width: 360,
          height: CARD_H + 320,
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%)",
          transform: "rotate(18deg)",
          filter: "blur(8px)",
          pointerEvents: "none",
          opacity: shine > 0.02 && shine < 0.98 ? 1 : 0,
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28, transform: `translateZ(${headZ}px)` }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(140deg, #d2cabb 0%, #a89f8d 100%)",
            boxShadow: "inset 0 -3px 8px rgba(0,0,0,0.22), 0 2px 4px rgba(0,0,0,0.12)",
          }}
        />
        <div
          style={{
            width: 260,
            height: 22,
            borderRadius: 11,
            background: "linear-gradient(90deg,#bcb4a5,#a49b8a)",
            opacity: 0.9,
          }}
        />
      </div>
      <div
        style={{
          fontSize: FONT_SIZE,
          lineHeight: 1.42,
          color: "#1c1a16",
          fontWeight: 600,
          letterSpacing: -0.3,
          transform: `translateZ(${textZ}px)`,
        }}
      >
        <span>{before}</span>
        <span style={{ position: "relative", display: "inline-block", whiteSpace: "pre-wrap" }}>
          <span
            style={{
              position: "relative",
              zIndex: 2,
              display: "inline-block",
              transform: `translateY(${-lift}px)`,
              textShadow: lift > 0.3 ? "0 3px 8px rgba(0,0,0,0.32)" : "none",
            }}
          >
            {mid}
          </span>
          {mid && (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                zIndex: 1,
                transform: `translateY(${-lift * 0.6}px)`,
              }}
            >
              <Marcador prog={marcProg} h={FONT_SIZE + 6} seed={7} pop={marcPop} />
            </div>
          )}
        </span>
        <span>{after}</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 52,
          bottom: 38,
          display: "flex",
          alignItems: "center",
          gap: 16,
          transform: `translateZ(${headZ * 1.4}px)`,
        }}
      >
        <div
          style={{
            fontSize: 46,
            transform: `scale(${heartScale})`,
            transformOrigin: "center",
            color: "#e0245e",
            filter: `drop-shadow(0 3px 6px rgba(224,36,94,${0.35 + heartBeat * 0.5}))`,
            lineHeight: 1,
          }}
        >
          ♥
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: "#3a352c",
            fontVariantNumeric: "tabular-nums",
            minWidth: 78,
          }}
        >
          {shownLikes}
        </div>
      </div>
    </div>
  );
};

export const Comentario3D: React.FC<{
  t: number;
  at: number;
  out: number;
  texto: string;
  resaltar: string;
  likes: number;
  fondo: string;
}> = ({ t, at, out, texto, resaltar, likes, fondo }) => {
  if (t < at - 0.1 || t > out + 0.1) return null;

  const clave = at + 1.5;
  const entrada = clamp((t - at) / 0.9);
  const sal = clamp((t - (out - 0.6)) / 0.6);

  // fondo: empuje + paralaje opuesto al zoom de la tarjeta
  const bgZoomCard = ei(t, clave, clave + 1.15);
  const bgScale = 1.02 + 0.06 * clamp((t - at) / 6) - 0.03 * bgZoomCard;
  const bgBlur = ei(t, at - 0.05, at + 0.6) * 7 * (1 - sal) + 2 * bgZoomCard;
  const bgDark = 0.15 + ei(t, at - 0.05, at + 0.6) * 0.42;
  const bgPanX = -14 * bgZoomCard;

  // entrada: llega GRANDE y legible desde el primer cuadro (Z corto, giro menor)
  const inZ = interpolate(entrada, [0, 1], [-420, 0], { extrapolateRight: "clamp" });
  const inRy = interpolate(entrada, [0, 1], [34, 0], { extrapolateRight: "clamp" });
  const inRx = interpolate(entrada, [0, 1], [-14, 0], { extrapolateRight: "clamp" });
  const settle = spr(t, at + 0.55, 0.7);
  const shine = clamp((t - (at + 0.55)) / 0.7);

  // flotación viva perceptible
  const floatY = Math.sin((t - at) * 1.15) * 16;
  const floatRy = Math.sin((t - at) * 0.72) * 9;
  const floatRx = Math.cos((t - at) * 0.63) * 5.5;
  const breathe = 1 + 0.03 * Math.sin((t - at) * 1.0);

  // CLAVE: marcador + zoom a la frase + micro-empuje táctil con parallax
  const claveProg = ei(t, clave, clave + 1.15);
  const claveRy = -9 * claveProg;
  const claveZ = 180 * claveProg;
  const claveScale = 1 + 0.26 * claveProg;
  const marcProg = clamp((t - clave) / 1.15);
  const marcPop = spr(t, clave, 0.55);
  const lift = ei(t, clave + 1.1, clave + 1.5) * 4;
  // punch: micro-empuje 3% al terminar el barrido
  const punch = spr(t, clave + 1.15, 0.6);
  const punchScale = 1 + 0.03 * punch;
  const punchZ = 40 * punch;
  const headZ = 26 * punch;
  const textZ = 14 * punch;

  // likes con pulso que arranca con el contador
  const likesProg = ei(t, clave + 0.2, clave + 1.3);
  const beatPhase = (t - (clave + 0.2)) / 0.42;
  const heartBeat =
    t > clave + 0.2 && t < clave + 1.6
      ? Math.max(0, Math.sin(beatPhase * Math.PI)) * (1 - clamp((t - clave - 0.2) / 1.4))
      : 0;

  // salida: giro + alejamiento REAL en Z (portal hacia la profundidad)
  const outZ = -sal * 1400;
  const outRy = sal * 62;
  const outScale = 1 - sal * 0.18;

  const totalZ = inZ + outZ + claveZ + punchZ;
  const totalRy = inRy + floatRy + outRy + claveRy;
  const totalRx = inRx + floatRx;
  const totalScale = claveScale * punchScale * breathe * outScale * (0.94 + 0.06 * settle);

  const shadowOp = clamp(entrada * 1.1) * (1 - sal);
  const shadowW = 940 * (1 + claveProg * 0.1) * (0.9 + 0.1 * settle);
  const shadowH = 130;
  const shadowBlur = 16 + claveProg * 8;

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${bgScale}) translateX(${bgPanX}px)`, filter: `blur(${bgBlur}px)` }}>
        <Img src={staticFile(fondo)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(6,10,18,${bgDark})` }} />
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 42%, rgba(0,0,0,0.55) 100%)" }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 2000,
          height: 2000,
          transform: `translate(-50%,-50%) scale(${clamp(entrada * 1.3) * (1 - sal) * (1 + claveProg * 0.08)})`,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,236,190,0.38) 0%, rgba(255,200,120,0.14) 40%, rgba(0,0,0,0) 70%)",
          pointerEvents: "none",
        }}
      />

      <AbsoluteFill
        style={{
          perspective: 1600,
          perspectiveOrigin: "50% 45%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translate(0, ${floatY * 0.35}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: shadowW,
            height: shadowH,
            transform: `translate(-50%, ${CARD_H * 0.42 + floatY * 0.9 + 44}px) scale(${0.85 + 0.15 * settle})`,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.36) 45%, rgba(0,0,0,0) 78%)",
            filter: `blur(${shadowBlur}px)`,
            opacity: shadowOp,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            transformStyle: "preserve-3d",
            transform: `translate3d(0, ${floatY}px, ${totalZ}px) rotateY(${totalRy}deg) rotateX(${totalRx}deg) scale(${totalScale})`,
          }}
        >
          <Tarjeta
            texto={texto}
            resaltar={resaltar}
            likes={likes}
            likesProg={likesProg}
            marcProg={marcProg}
            marcPop={marcPop}
            lift={lift}
            heartBeat={heartBeat}
            shine={shine}
            headZ={headZ}
            textZ={textZ}
          />
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.35'/></svg>\")",
          opacity: 0.06,
          mixBlendMode: "overlay",
        }}
      />
    </AbsoluteFill>
  );
};

export const sfxComentario3D = (at: number): [number, string, number?][] => [
  [at + 0.0, "whoosh_big", -2],
  [at + 0.55, "sparkle", -3],
  [at + 1.5, "write", -1],
  [at + 1.5, "pop", -2],
  [at + 1.65, "tick", -4],
  [at + 1.85, "tick", -5],
  [at + 2.05, "roll", -4],
  [at + 2.65, "ding", -3],
  [at + 2.65, "slam", -6],
  [at + 5.8, "whoosh", -4],
];
