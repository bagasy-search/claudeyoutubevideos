// Piezas propias de pin21b (cómo detectar cables antes de taladrar). Material del tema: el escáner de pared con su barra de
// leds, la mecha con la banderita de cinta de papel, el revoque con lápiz y la hoja del mapa de las cajas de Don Héctor.
// Todo CSS/DOM, sin SVG sobre las fotos. Registro: D:/rtmp/pin14_COMPONENTES.md (no repetir).
//  · EscanerN   — contador "método n/12": el detector de pared entra deslizándose sobre una franja de revoque; su barra de
//                 12 leds se llena hasta n, la pantallita dice n/12 y debajo se pega cinta de papel con el método.
//  · MechaCTA   — suscripción: una mecha de acero entra girando y se le enrolla una banderita de cinta con SUSCRIBITE.
//  · LapizPared — pregunta: un parche de revoque fresco; la pregunta aparece escrita en lápiz, renglón por renglón.
//  · MapaRecap  — repaso: la hoja del mapa de las cajas baja sobre la mesa; cada método se tilda en lápiz en su palabra.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { SERIF, LABEL, HAND } from "./ClTheme";

const K = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PW = {
  body: "#2E3236", bodyHi: "#4A5056", yellow: "#F2C230", led: "#3BE36B", ledOff: "#1E3324", red: "#E0402F",
  plaster: "#E9E4DA", plasterDeep: "#CFC7B8", paper: "#F4EFE2", line: "#B9C6D6", pencil: "#3A3D42", tape: "#EADFC4", tapeDeep: "#CDBE98", ink: "#1D1F22",
};
const sp = (f: number, d = 14, m = 1) => spring({ frame: f, fps: 30, config: { damping: d, mass: m } });
const outY = (f: number, dur: number, n = 12) => interpolate(f, [dur - n, dur], [0, 520], { ...K, easing: Easing.in(Easing.cubic) });
const plasterBg = `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.35) 0 2px, transparent 3px) 0 0/23px 19px,
  radial-gradient(circle at 70% 60%, rgba(0,0,0,0.05) 0 2px, transparent 3px) 0 0/31px 27px, linear-gradient(180deg, ${PW.plaster}, ${PW.plasterDeep})`;
const tapeBg = `linear-gradient(180deg, #F1E7CE 0%, ${PW.tape} 40%, ${PW.tapeDeep} 100%)`;

// 1) ESCÁNER "MÉTODO n/12": abajo a la izquierda.
export const EscanerN: React.FC<{ n: number; title: string; dur: number }> = ({ n, title, dur }) => {
  const f = useCurrentFrame();
  const strip = interpolate(f, [0, 12], [0, 1], { ...K, easing: Easing.out(Easing.cubic) });
  const slide = interpolate(sp(f - 4, 16, 1.2), [0, 1], [-700, 0]);
  const fill = interpolate(f, [12, 30], [0, n], K);
  const beep = f > 30 && f < 46 ? 0.5 + 0.5 * Math.sin(f * 1.6) : 0;
  const tape = interpolate(f, [24, 38], [0, 1], { ...K, easing: Easing.out(Easing.cubic) });
  const y = outY(f, dur);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 60, bottom: 80, width: 980, transform: `translateY(${y}px)` }}>
        <div style={{ position: "relative", height: 230, width: 980 * strip, background: plasterBg, borderRadius: 8, boxShadow: "0 18px 34px rgba(0,0,0,0.38)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 40 + slide, top: 26, width: 520, height: 178, borderRadius: 28,
            background: `linear-gradient(180deg, ${PW.bodyHi}, ${PW.body} 40%, #1C1F22)`, boxShadow: "0 14px 24px rgba(0,0,0,0.45), inset 0 2px 0 rgba(255,255,255,0.18)" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 22, borderRadius: "28px 28px 0 0", background: PW.yellow }} />
            {/* pantallita */}
            <div style={{ position: "absolute", left: 30, top: 44, width: 190, height: 100, borderRadius: 10, background: "linear-gradient(180deg,#A9C79A,#8DAF7E)",
              boxShadow: "inset 0 3px 8px rgba(0,0,0,0.4)", fontFamily: LABEL, fontWeight: 700, color: "#1E2A18", textAlign: "center" }}>
              <div style={{ fontSize: 22, letterSpacing: 3, marginTop: 8 }}>MÉTODO</div>
              <div style={{ fontSize: 50, lineHeight: 1 }}>{n}<span style={{ fontSize: 28 }}>/12</span></div>
            </div>
            {/* barra de 12 leds */}
            {Array.from({ length: 12 }).map((_, i) => {
              const on = i < fill;
              return <div key={i} style={{ position: "absolute", left: 246 + i * 21, top: 64, width: 15, height: 60, borderRadius: 4,
                background: on ? (i === n - 1 ? PW.red : PW.led) : PW.ledOff,
                boxShadow: on ? `0 0 ${10 + 14 * (i === n - 1 ? beep : 0)}px ${i === n - 1 ? PW.red : PW.led}` : "inset 0 2px 3px rgba(0,0,0,0.6)" }} />;
            })}
          </div>
        </div>
        <div style={{ marginTop: -16, marginLeft: 50, display: "inline-block", padding: "14px 34px 16px", background: tapeBg,
          clipPath: `inset(0 ${100 - tape * 100}% 0 0)`, transform: "rotate(-1.3deg)", boxShadow: "0 10px 20px rgba(0,0,0,0.35)" }}>
          <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: PW.ink }}>{title}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 2) MECHA CTA: la mecha entra girando desde la derecha y se le enrolla la banderita con SUSCRIBITE.
export const MechaCTA: React.FC<{ text?: string; dur: number }> = ({ text = "SUSCRIBITE", dur }) => {
  const f = useCurrentFrame();
  const x = interpolate(sp(f, 15, 1.1), [0, 1], [900, 0]);
  const spin = f * 22;
  const flag = sp(f - 14, 11);
  const y = outY(f, dur);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 60, top: 120, width: 760, height: 260, transform: `translate(${x}px, ${y}px)` }}>
        {/* mecha: espiral simulada con franjas que corren */}
        <div style={{ position: "absolute", left: 0, top: 90, width: 760, height: 46, borderRadius: "40px 6px 6px 40px",
          background: `repeating-linear-gradient(115deg, #9AA1A8 ${-spin % 40}px, #E7EAED ${(-spin % 40) + 10}px, #7D848B ${(-spin % 40) + 22}px, #C9CED3 ${(-spin % 40) + 40}px)`,
          boxShadow: "0 12px 22px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: -26, top: 90, width: 0, height: 0, borderTop: "23px solid transparent", borderBottom: "23px solid transparent", borderRight: "30px solid #8E959C" }} />
        {/* banderita de cinta de papel */}
        <div style={{ position: "absolute", left: 230, top: 136, transformOrigin: "50% 0%", transform: `scaleY(${flag})`,
          padding: "22px 40px 24px", background: tapeBg, boxShadow: "0 14px 24px rgba(0,0,0,0.35)" }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 70, color: "#C9302C", letterSpacing: 4 }}>{text}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 3) LÁPIZ EN LA PARED: parche de revoque abajo a la derecha, la pregunta escrita en lápiz renglón por renglón.
export const LapizPared: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const inn = sp(f, 14);
  const words = text.split(" ");
  const shown = Math.floor(interpolate(f, [10, 10 + words.length * 4], [0, words.length], K));
  const y = outY(f, dur);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 80, bottom: 100, width: 1060, padding: "34px 50px 40px", background: plasterBg, borderRadius: 14,
        transform: `translateY(${(1 - inn) * 500 + y}px) rotate(-0.8deg)`, boxShadow: "0 22px 40px rgba(0,0,0,0.4)" }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, lineHeight: 1.08, color: PW.pencil, opacity: 0.9 }}>
          {words.map((w, i) => <span key={i} style={{ opacity: i < shown ? 1 : 0 }}>{w} </span>)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 4) MAPA RECAP: la hoja cuadriculada baja sobre la foto; 12 renglones se tildan en lápiz en su palabra.
export const MapaRecap: React.FC<{ items: string[]; marks: number[]; bg: string; dur: number }> = ({ items, marks, bg, dur }) => {
  const f = useCurrentFrame();
  const inn = sp(f, 16);
  const q = interpolate(f, [0, dur], [0, 1], K);
  const e = q * q * (3 - 2 * q);
  const camS = 1 + 0.06 * e, camX = Math.sin(q * Math.PI * 1.25) * 22, camY = -16 * e + Math.sin(q * Math.PI * 2.2) * 7, camR = Math.sin(q * Math.PI) * 0.7 - 1;
  const cur = marks.reduce((a, m, i) => (f >= m ? i : a), -1);
  return (
    <AbsoluteFill style={{ background: "#202328", overflow: "hidden" }}>
      <Img src={staticFile(bg)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.08 * q})`, filter: "brightness(0.42)" }} />
      <div style={{ position: "absolute", left: 200, right: 200, top: 70, bottom: 70, borderRadius: 6,
        background: `repeating-linear-gradient(0deg, transparent 0 58px, ${PW.line} 58px 60px), ${PW.paper}`,
        transform: `translate(${camX}px, ${(1 - inn) * 1000 + camY}px) scale(${camS}) rotate(${camR}deg)`, boxShadow: "0 40px 80px rgba(0,0,0,0.55)" }}>
        <div style={{ position: "absolute", left: 90, top: 0, bottom: 0, width: 3, background: "rgba(201,48,44,0.5)" }} />
        <div style={{ position: "absolute", left: 120, top: 22, fontFamily: HAND, fontWeight: 700, fontSize: 56, color: PW.pencil }}>Rígido o flexible</div>
        {items.map((t, i) => {
          const on = f >= marks[i];
          const k = on ? interpolate(f - marks[i], [0, 8], [0, 1], K) : 0;
          const col = i < 6 ? 0 : 1, row = i % 6;
          return (
            <div key={i} style={{ position: "absolute", left: 120 + col * 700, top: 120 + row * 120, width: 660, height: 100 }}>
              <div style={{ position: "absolute", left: 0, top: 18, width: 54, height: 54, border: `4px solid ${PW.pencil}`, borderRadius: 6, opacity: 0.8,
                boxShadow: i === cur ? "0 0 0 6px rgba(242,194,48,0.6)" : undefined }} />
              {/* tilde en lápiz: dos trazos que se dibujan */}
              <div style={{ position: "absolute", left: 10, top: 48, width: 22 * Math.min(1, k * 2), height: 7, background: PW.pencil, transform: "rotate(45deg)", transformOrigin: "0 50%" }} />
              <div style={{ position: "absolute", left: 24, top: 62, width: 46 * Math.max(0, k * 2 - 1), height: 7, background: PW.pencil, transform: "rotate(-55deg)", transformOrigin: "0 50%" }} />
              <div style={{ position: "absolute", left: 76, top: 14, fontFamily: HAND, fontWeight: 700, fontSize: 50, lineHeight: 1, color: on ? PW.ink : "rgba(29,31,34,0.25)" }}>
                {i + 1}. {t}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
