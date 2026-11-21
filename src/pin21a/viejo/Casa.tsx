// Piezas propias de pin21a (25 trucos con cosas de la casa). La caja verde de madera de Don Héctor como hilo: tabla verde
// pintada a mano, cinta de papel, broche de ropa, tubo de cartón. Todo CSS/DOM, sin SVG sobre las fotos.
// Registro: D:/rtmp/pin14_COMPONENTES.md (no repetir).
//  · CajaVerdeN  — contador "truco n/25": el costado verde de la caja de Don Héctor entra de costado; el número se estampa en
//                  blanco con plantilla, y debajo se pega una tira de cinta de papel con el truco y el lugar de la casa.
//  · BrocheCTA   — suscripción: un piolín cruza, un broche de madera baja y deja colgada una tarjeta con SUSCRIBITE.
//  · TuboPregunta— pregunta: un tubo de cartón de papel higiénico rueda y se desenrolla la pregunta escrita con marcador.
//  · CajaRecap   — repaso por lugar: la tapa de la caja abierta con compartimentos; cada truco se pega como cinta de papel
//                  en su palabra.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { SERIF, LABEL, HAND } from "./ClTheme";

const K = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CS = {
  green: "#2F6B43", greenDeep: "#1C4229", greenHi: "#4E8C60", wood: "#8A5A32", woodDeep: "#5A3818",
  paper: "#EADFC4", paperDeep: "#CDBE98", ink: "#1D1F22", white: "#F7F4EC", red: "#C9302C", cardboard: "#B88A55", cardDeep: "#8C6234",
};
const sp = (f: number, d = 14, m = 1) => spring({ frame: f, fps: 30, config: { damping: d, mass: m } });
const outY = (f: number, dur: number, n = 12) => interpolate(f, [dur - n, dur], [0, 520], { ...K, easing: Easing.in(Easing.cubic) });
// vetas de madera pintada (gradientes repetidos, sin imágenes)
const paintedWood = `repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0) 3px, rgba(255,255,255,0.04) 7px, rgba(0,0,0,0) 11px),
  linear-gradient(180deg, ${CS.greenHi} 0%, ${CS.green} 35%, ${CS.green} 75%, ${CS.greenDeep} 100%)`;
const tapeBg = `linear-gradient(180deg, #F1E7CE 0%, ${CS.paper} 40%, ${CS.paperDeep} 100%)`;
const ROOM = (n: number) => (n <= 6 ? "COCINA" : n <= 12 ? "COSTURA Y BAÑO" : n <= 18 ? "ESCRITORIO" : n <= 24 ? "LAVADERO Y GARAGE" : "EL PREMIO");

// 1) CAJA VERDE "TRUCO n/25": abajo a la izquierda, sobre el material.
export const CajaVerdeN: React.FC<{ n: number; title: string; dur: number }> = ({ n, title, dur }) => {
  const f = useCurrentFrame();
  const inX = interpolate(sp(f, 15, 1.1), [0, 1], [-1000, 0]);
  const stamp = sp(f - 10, 9, 0.8);
  const tape = interpolate(f, [18, 32], [0, 1], { ...K, easing: Easing.out(Easing.cubic) });
  const tilt = interpolate(sp(f, 12), [0, 1], [-4, -1.5]);
  const y = outY(f, dur);
  const prem = n === 25;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 70, bottom: 86, transform: `translate(${inX}px, ${y}px) rotate(${tilt}deg)` }}>
        <div style={{ position: "relative", width: 560, height: 200, borderRadius: 10, background: paintedWood,
          boxShadow: "0 24px 44px rgba(0,0,0,0.45), inset 0 3px 0 rgba(255,255,255,0.18), inset 0 -6px 0 rgba(0,0,0,0.22)" }}>
          {/* esquineros de chapa y clavos */}
          {[[10, 10], [520, 10], [10, 160], [520, 160]].map(([l, t], i) => (
            <div key={i} style={{ position: "absolute", left: l, top: t, width: 30, height: 30, borderRadius: 4,
              background: "linear-gradient(135deg,#D9DCDF,#8C9298)", boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.2)" }}>
              <div style={{ position: "absolute", left: 11, top: 11, width: 8, height: 8, borderRadius: 4, background: "#5D6268" }} />
            </div>
          ))}
          {/* número estampado con plantilla */}
          <div style={{ position: "absolute", left: 60, top: 26, fontFamily: LABEL, fontWeight: 700, fontSize: 118, lineHeight: 1,
            color: prem ? "#F2C230" : CS.white, letterSpacing: 6, opacity: stamp, transform: `scale(${1.5 - 0.5 * stamp})`, transformOrigin: "left center",
            textShadow: "0 2px 0 rgba(0,0,0,0.25)" }}>
            {n}<span style={{ fontSize: 54, opacity: 0.75 }}>/25</span>
          </div>
          <div style={{ position: "absolute", right: 60, top: 64, fontFamily: LABEL, fontWeight: 600, fontSize: 30, color: "rgba(247,244,236,0.85)",
            letterSpacing: 3, textAlign: "right", width: 220, lineHeight: 1.15 }}>TRUCO<br />{ROOM(n)}</div>
        </div>
        {/* cinta de papel con el truco */}
        <div style={{ marginTop: -14, marginLeft: 40, display: "inline-block", padding: "14px 34px 16px", background: tapeBg,
          clipPath: `inset(0 ${100 - tape * 100}% 0 0)`, transform: "rotate(1.4deg)", boxShadow: "0 10px 20px rgba(0,0,0,0.35)" }}>
          <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: CS.ink }}>{title}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 2) BROCHE CTA: un piolín cruza arriba a la derecha y un broche de madera cuelga la tarjeta SUSCRIBITE.
export const BrocheCTA: React.FC<{ text?: string; dur: number }> = ({ text = "SUSCRIBITE", dur }) => {
  const f = useCurrentFrame();
  const line = interpolate(f, [0, 12], [0, 1], { ...K, easing: Easing.out(Easing.cubic) });
  const drop = sp(f - 8, 10, 1.2);
  const sway = Math.sin(f / 9) * 3 * Math.exp(-f / 60);
  const y = outY(f, dur);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 0, top: 120, width: 900 * line, height: 4, background: "linear-gradient(180deg,#E9E2D2,#A79C86)",
        boxShadow: "0 3px 4px rgba(0,0,0,0.3)", transform: `translateY(${y}px)` }} />
      <div style={{ position: "absolute", right: 300, top: 70, transformOrigin: "50% 0%", transform: `translateY(${(1 - drop) * -400 + y}px) rotate(${sway}deg)` }}>
        {/* broche */}
        <div style={{ position: "relative", width: 44, height: 120, margin: "0 auto" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 20, height: 120, borderRadius: 6, background: `linear-gradient(90deg,#C99B66,#E8C08E,#B6874F)` }} />
          <div style={{ position: "absolute", left: 24, top: 0, width: 20, height: 120, borderRadius: 6, background: `linear-gradient(90deg,#B6874F,#E8C08E,#C99B66)` }} />
          <div style={{ position: "absolute", left: 6, top: 48, width: 32, height: 16, borderRadius: 8, border: "4px solid #9AA0A6", background: "transparent" }} />
        </div>
        <div style={{ marginTop: -20, padding: "26px 48px 28px", background: CS.white, borderRadius: 6, boxShadow: "0 20px 36px rgba(0,0,0,0.4)",
          borderTop: `14px solid ${CS.red}` }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 76, color: CS.ink, letterSpacing: 4 }}>{text}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 3) TUBO PREGUNTA: el tubo de cartón rueda desde la derecha y deja desenrollada una tira de papel con la pregunta.
export const TuboPregunta: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const roll = interpolate(f, [0, 26], [0, 1], { ...K, easing: Easing.out(Easing.cubic) });
  const x = interpolate(roll, [0, 1], [1300, 0]);
  const rot = -roll * 540;
  const y = outY(f, dur);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 80, bottom: 110, width: 1150, height: 170, transform: `translateY(${y}px)` }}>
        <div style={{ position: "absolute", right: 120, top: 18, width: 1030 * roll, height: 134, background: tapeBg, borderRadius: 4,
          boxShadow: "0 14px 26px rgba(0,0,0,0.35)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 40, top: 22, width: 960, fontFamily: HAND, fontWeight: 700, fontSize: 52, color: CS.ink, lineHeight: 1.05 }}>{text}</div>
        </div>
        <div style={{ position: "absolute", right: 0, top: 0, width: 170, height: 170, borderRadius: 85, transform: `translateX(${x}px) rotate(${rot}deg)`,
          background: `radial-gradient(circle, #6B4A2A 0 30%, ${CS.cardDeep} 31% 38%, ${CS.cardboard} 39% 100%)`, boxShadow: "0 16px 28px rgba(0,0,0,0.4)" }}>
          <div style={{ position: "absolute", left: 80, top: 8, width: 6, height: 50, background: "rgba(90,56,24,0.5)", transform: "rotate(25deg)" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 4) CAJA RECAP: la tapa de la caja verde abierta, un compartimento por lugar; cada truco se pega como cinta en su palabra.
export const CajaRecap: React.FC<{ room: string; first: number; items: string[]; marks: number[]; bg: string; dur: number }> = ({ room, first, items, marks, bg, dur }) => {
  const f = useCurrentFrame();
  const inn = sp(f, 16);
  const q = interpolate(f, [0, dur], [0, 1], K);
  const e = q * q * (3 - 2 * q);
  const camS = 1 + 0.06 * e, camX = Math.sin(q * Math.PI * 1.2) * 24, camY = -14 * e + Math.sin(q * Math.PI * 2) * 7;
  const cur = marks.reduce((a, m, i) => (f >= m ? i : a), -1);
  return (
    <AbsoluteFill style={{ background: "#1E2320", overflow: "hidden" }}>
      <Img src={staticFile(bg)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.08 * q})`, filter: "brightness(0.42)" }} />
      <div style={{ position: "absolute", left: 150, right: 150, top: 110, bottom: 110, borderRadius: 18, background: paintedWood,
        transform: `translate(${camX}px, ${(1 - inn) * 900 + camY}px) scale(${camS})`, boxShadow: "0 40px 80px rgba(0,0,0,0.55), inset 0 0 0 14px rgba(28,66,41,0.9)" }}>
        <div style={{ position: "absolute", left: 60, top: 40, fontFamily: LABEL, fontWeight: 700, fontSize: 58, letterSpacing: 6, color: CS.white }}>{room}</div>
        <div style={{ position: "absolute", left: 50, right: 50, top: 130, bottom: 40, borderRadius: 10, background: `linear-gradient(180deg, ${CS.woodDeep}, ${CS.wood})`,
          boxShadow: "inset 0 10px 24px rgba(0,0,0,0.5)" }}>
          {items.map((t, i) => {
            const on = f >= marks[i];
            const k = on ? sp(f - marks[i], 10) : 0;
            const col = i % 2, row = Math.floor(i / 2);
            return (
              <div key={i} style={{ position: "absolute", left: 40 + col * 760, top: 34 + row * 150, width: 700, height: 116,
                transform: `translateY(${(1 - k) * -60}px) rotate(${(i % 3 - 1) * 1.2}deg)`, opacity: on ? 1 : 0.0 }}>
                <div style={{ position: "absolute", inset: 0, background: tapeBg, boxShadow: i === cur ? "0 0 0 5px #F2C230, 0 12px 22px rgba(0,0,0,0.4)" : "0 12px 22px rgba(0,0,0,0.4)" }} />
                <div style={{ position: "absolute", left: 26, top: 22, fontFamily: LABEL, fontWeight: 700, fontSize: 52, color: CS.red, width: 90 }}>{first + i}</div>
                <div style={{ position: "absolute", left: 120, top: 26, right: 20, fontFamily: HAND, fontWeight: 700, fontSize: 52, color: CS.ink, lineHeight: 1 }}>{t}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
