// Piezas propias de pin15c (el panel solar que se enchufa). CSS/DOM con material del oficio: celdas de silicio azul con
// sus hilos de plata, marco de aluminio, display LCD del medidor, brújula de bolsillo, factura de papel.
// No repite pin15a (mordaza, cinta, etiqueta de cable, térmicas, cobres) ni pin15b (tapas de toma, ficha, imán, pared de tomas).
//  · CeldaN       — contador "lo que no te dicen n/9": panel de 3x3 celdas; la celda n se da vuelta y muestra su número.
//  · LcdCTA       — suscripción: display LCD verde del medidor que corre dígitos y se queda en SUSCRIBITE.
//  · Brujula      — pregunta: brújula de bolsillo de latón cuya aguja busca el norte; la pregunta escrita al lado.
//  · FacturaRecap — repaso: factura de luz de papel que baja; 9 renglones se tildan con birome en su número.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { SERIF, LABEL, HAND } from "./ClTheme";

const K = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S = { ink: "#14181F", cell: "#1D3B73", cellHi: "#3C66B5", silver: "#C8CDD3", alu: "linear-gradient(180deg,#F1F3F5,#B9BFC6 50%,#E3E6E9)", lcd: "#9DBF7A", lcdInk: "#1E2A12", red: "#C9302C", yellow: "#F2C230", paper: "#FBF8F1", pen: "#1C3FA8" };
const sp = (f: number, d = 14, m = 1) => spring({ frame: f, fps: 30, config: { damping: d, mass: m } });
const outY = (f: number, dur: number, n = 12) => interpolate(f, [dur - n, dur], [0, 560], { ...K, easing: Easing.in(Easing.cubic) });

const Celda: React.FC<{ w: number; flip?: number; label?: string }> = ({ w, flip = 0, label }) => (
  <div style={{ position: "relative", width: w, height: w, perspective: 600 }}>
    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${flip * 180}deg)` }}>
      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 4,
        background: `linear-gradient(90deg, transparent 32%, ${S.silver} 32% 34%, transparent 34% 66%, ${S.silver} 66% 68%, transparent 68%), linear-gradient(135deg, ${S.cellHi} 0%, ${S.cell} 55%, #142B57 100%)` }} />
      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 4, background: S.yellow,
        display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LABEL, fontWeight: 700, fontSize: w * 0.55, color: S.ink }}>{label}</div>
    </div>
  </div>
);

// 1) CELDA N: panel de 3x3 abajo a la izquierda; la celda n gira y muestra el número; título al lado
export const CeldaN: React.FC<{ n: number; title: string; dur: number }> = ({ n, title, dur }) => {
  const f = useCurrentFrame();
  const inn = sp(f, 15);
  const flip = sp(f - 10, 12);
  const lbl = interpolate(f, [16, 28], [0, 1], { ...K, easing: Easing.out(Easing.cubic) });
  const y = outY(f, dur);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 80, bottom: 80, display: "flex", alignItems: "flex-end", gap: 30, transform: `translate(${(1 - inn) * -700}px, ${y}px)` }}>
        <div style={{ padding: 12, background: S.alu, borderRadius: 8, boxShadow: "0 20px 40px rgba(0,0,0,0.5)", transform: "perspective(900px) rotateX(14deg)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 84px)", gap: 6, background: "#0E1A33", padding: 6 }}>
            {Array.from({ length: 9 }).map((_, i) => <Celda key={i} w={84} flip={i === n - 1 ? flip : i < n - 1 ? 1 : 0} label={String(i + 1)} />)}
          </div>
        </div>
        <div style={{ opacity: lbl, transform: `translateX(${(1 - lbl) * -40}px)`, marginBottom: 14 }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 38, color: S.yellow, letterSpacing: 3, textShadow: "0 3px 10px rgba(0,0,0,0.8)" }}>LO QUE NO TE DICEN · {n}/9</div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 58, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,0.85)", maxWidth: 900 }}>{title}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 2) LCD CTA: display del medidor que corre dígitos y se queda en SUSCRIBITE
export const LcdCTA: React.FC<{ text?: string; dur: number }> = ({ text = "SUSCRIBITE", dur }) => {
  const f = useCurrentFrame();
  const inn = sp(f, 14);
  const y = outY(f, dur);
  const settle = 18;
  const chars = text.split("").map((c, i) => (f < settle + i * 2 ? "0123456789"[(f * 7 + i * 3) % 10] : c));
  const blink = f > settle + text.length * 2 && Math.floor(f / 12) % 2 === 0;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: "50%", bottom: 90, transform: `translate(-50%, ${y + (1 - inn) * 400}px)`, padding: 26, borderRadius: 22,
        background: "linear-gradient(180deg,#5F666E,#2E3237)", boxShadow: "0 24px 50px rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.25)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "16px 34px", borderRadius: 10, background: `linear-gradient(180deg, #B4D394, ${S.lcd})`, boxShadow: "inset 0 4px 10px rgba(0,0,0,0.35)" }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 92, letterSpacing: 10, color: S.lcdInk }}>{chars.join("")}</div>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: blink ? S.red : "#6E2A26", boxShadow: blink ? `0 0 18px ${S.red}` : "none" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 3) BRÚJULA: brújula de latón a la derecha; la aguja oscila y se asienta al norte; pregunta al lado
export const Brujula: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const inn = sp(f, 15);
  const ang = 140 * Math.exp(-f / 22) * Math.cos(f / 4.5);
  const txt = interpolate(f, [10, 24], [0, 1], { ...K, easing: Easing.out(Easing.cubic) });
  const y = outY(f, dur);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 80, bottom: 80, display: "flex", alignItems: "center", gap: 34, transform: `translate(${(1 - inn) * 800}px, ${y}px)` }}>
        <div style={{ opacity: txt, maxWidth: 820, padding: "26px 36px", borderRadius: 14, background: "rgba(251,248,241,0.96)", boxShadow: "0 18px 36px rgba(0,0,0,0.4)" }}>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, lineHeight: 1.1, color: S.ink }}>{text}</div>
          <div style={{ marginTop: 10, fontFamily: LABEL, fontSize: 28, color: "#6B6F76", letterSpacing: 3 }}>↓ CONTAME EN LOS COMENTARIOS</div>
        </div>
        <div style={{ position: "relative", width: 280, height: 280, borderRadius: "50%", flex: "none",
          background: "radial-gradient(circle at 35% 30%, #F2D58A 0%, #B8913F 55%, #6E5320 100%)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
          <div style={{ position: "absolute", inset: 22, borderRadius: "50%", background: "radial-gradient(circle,#FFFDF6,#EDE5D2)", boxShadow: "inset 0 4px 10px rgba(0,0,0,0.3)" }}>
            {["N", "E", "S", "O"].map((c, i) => (
              <div key={c} style={{ position: "absolute", left: "50%", top: "50%", transform: `rotate(${i * 90}deg) translateY(-96px) rotate(${-i * 90}deg) translate(-50%,-50%)`,
                fontFamily: LABEL, fontWeight: 700, fontSize: 30, color: c === "N" ? S.red : S.ink }}>{c}</div>
            ))}
            <div style={{ position: "absolute", left: "50%", top: "50%", width: 18, height: 180, marginLeft: -9, marginTop: -90, transform: `rotate(${ang}deg)`,
              background: `linear-gradient(180deg, ${S.red} 0 50%, #3A3F46 50% 100%)`, clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" }} />
            <div style={{ position: "absolute", left: "50%", top: "50%", width: 18, height: 18, margin: -9, borderRadius: "50%", background: "#B8913F" }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 4) FACTURA RECAP: factura de papel con 9 renglones que se tildan en su número
export const FacturaRecap: React.FC<{ items: string[]; marks: number[]; bg: string; dur: number }> = ({ items, marks, bg, dur }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], [1.04, 1.12]);
  const inn = sp(f, 16);
  const cur = marks.reduce((a, m, i) => (f >= m ? i : a), -1);
  return (
    <AbsoluteFill style={{ background: "#1C2024", overflow: "hidden" }}>
      <Img src={staticFile(bg)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, filter: "brightness(0.4)" }} />
      <div style={{ position: "absolute", left: 460, width: 1000, top: 50, bottom: 50, background: S.paper, transform: `translateY(${(1 - inn) * -1100}px) rotate(-1deg)`,
        boxShadow: "0 40px 80px rgba(0,0,0,0.55)", padding: "40px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `4px solid ${S.ink}`, paddingBottom: 10 }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: S.ink, letterSpacing: 2 }}>PANEL ENCHUFABLE · LO QUE NO TE DICEN</div>
          <div style={{ fontFamily: LABEL, fontSize: 30, color: "#6B6F76" }}>9 ítems</div>
        </div>
        {items.map((t, i) => {
          const on = f >= marks[i]; const k = on ? sp(f - marks[i], 12) : 0; const hi = i === cur;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, height: 96, borderBottom: "2px dashed #C9C2B2", background: hi ? "rgba(242,194,48,0.22)" : "transparent" }}>
              <div style={{ width: 54, fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: S.ink }}>{i + 1}</div>
              <div style={{ flex: 1, fontFamily: SERIF, fontWeight: 700, fontSize: 42, color: on ? S.ink : "rgba(20,24,31,0.25)" }}>{t}</div>
              <div style={{ width: 70, height: 60, position: "relative" }}>
                <div style={{ position: "absolute", left: 4, top: 30, width: 26 * k, height: 8, background: S.pen, transform: "rotate(45deg)", transformOrigin: "0 50%", borderRadius: 4 }} />
                <div style={{ position: "absolute", left: 20, top: 46, width: 50 * Math.max(0, k * 1.6 - 0.6), height: 8, background: S.pen, transform: "rotate(-55deg)", transformOrigin: "0 50%", borderRadius: 4 }} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
