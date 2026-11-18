// Piezas propias de pin15b (todos los enchufes de tu casa). CSS/DOM con material del oficio: tapa de toma de baquelita
// sobre azulejo, ficha que entra, puerta de heladera esmaltada con imán, pared de tomas. Sin SVG sobre las fotos.
// No repite pin15a (mordaza, cinta aisladora, etiqueta de cable, tablero de térmicas, tres cobres). Registro: D:/rtmp/pin14_COMPONENTES.md
//  · TomaN        — contador "enchufe n/12": la tapa de ese toma (agujeros reales de cada tipo) entra girando sobre un azulejo.
//  · FichaCTA     — suscripción: una ficha de tres patas entra en el toma, "clic", se prende el piloto verde y aparece SUSCRIBITE.
//  · ImanHeladera — pregunta: puerta blanca de heladera con un imán que sujeta una notita escrita a mano.
//  · ParedTomas   — repaso: pared de azulejos con las 12 tapas; cada una se enciende en su número; la 6 se tacha en rojo.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { SERIF, LABEL, HAND } from "./ClTheme";

const K = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const T = { ink: "#15181D", cream: "#F7F3EA", red: "#C9302C", green: "#2F9A52", yellow: "#F2C230", tile: "#E6EEF0", grout: "#C8D3D6", brass: "#B8913F" };
const sp = (f: number, d = 14, m = 1) => spring({ frame: f, fps: 30, config: { damping: d, mass: m } });
const outY = (f: number, dur: number, n = 12) => interpolate(f, [dur - n, dur], [0, 560], { ...K, easing: Easing.in(Easing.cubic) });
const tiles = `linear-gradient(${T.grout} 0 0) 0 0/100% 2px, linear-gradient(90deg, ${T.grout} 0 0) 0 0/2px 100%`;

const hole = (x: number, y: number, w: number, h: number, r: number | string, rot = 0, c = "#2A2D33") =>
  ({ position: "absolute" as const, left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: r, background: c, transform: `rotate(${rot}deg)`, boxShadow: "inset 0 3px 5px rgba(0,0,0,0.75)" });

// las 12 caras (tapa de 200x200, centro 100,100)
export const Cara: React.FC<{ n: number; s?: number }> = ({ n, s = 1 }) => {
  const H: React.CSSProperties[] = [];
  const R = (x: number, y: number) => hole(x, y, 20, 20, "50%");
  if (n === 1) H.push(R(78, 100), R(122, 100));
  if (n === 2) H.push(hole(76, 86, 10, 30, 3, 30), hole(124, 86, 10, 30, 3, -30), hole(100, 128, 10, 30, 3));
  if (n === 3) H.push(hole(74, 86, 14, 34, 3, 30), hole(126, 86, 14, 34, 3, -30), hole(100, 130, 14, 34, 3));
  if (n === 4) H.push(hole(80, 100, 10, 32, 3, 20), hole(120, 100, 10, 32, 3, -20));
  if (n === 5) H.push({ ...hole(100, 100, 120, 120, "50%", 0, "#D9D6CE") }, R(76, 100), R(124, 100), hole(100, 44, 14, 8, 2, 0, "#9AA0A8"), hole(100, 156, 14, 8, 2, 0, "#9AA0A8"));
  if (n === 6) H.push(hole(76, 96, 24, 32, "50% 50% 4px 4px", 30), hole(124, 96, 24, 32, "50% 50% 4px 4px", -30), hole(100, 136, 22, 30, "50% 50% 4px 4px"));
  if (n === 7) H.push(hole(70, 70, 10, 26, 3, 30), hole(130, 70, 10, 26, 3, -30), hole(100, 100, 10, 26, 3), R(70, 140), R(130, 140), hole(100, 150, 10, 26, 3));
  if (n === 8) H.push({ ...hole(100, 100, 170, 170, 18, 0, "rgba(180,215,235,0.55)"), boxShadow: "inset 0 0 0 4px rgba(255,255,255,0.8)" }, hole(76, 92, 10, 28, 3, 30), hole(124, 92, 10, 28, 3, -30), hole(100, 128, 10, 28, 3));
  if (n === 9) H.push({ ...hole(100, 100, 176, 176, 14, 0, "rgba(90,96,104,0.35)"), boxShadow: "inset 0 0 0 6px #6E747B" }, hole(76, 92, 10, 28, 3, 30), hole(124, 92, 10, 28, 3, -30), hole(100, 128, 10, 28, 3));
  if (n === 10) H.push(hole(76, 74, 10, 26, 3, 30), hole(124, 74, 10, 26, 3, -30), hole(100, 104, 10, 26, 3), hole(78, 150, 34, 12, 2), hole(122, 150, 34, 12, 2));
  if (n === 11) H.push({ ...hole(100, 100, 130, 60, 6, 0, "#E2DED4"), boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)" }, R(68, 100), R(100, 100), R(132, 100));
  if (n === 12) H.push(hole(76, 86, 10, 30, 3, 30), hole(124, 86, 10, 30, 3, -30), hole(100, 128, 10, 30, 3));
  const tilt = n === 12 ? -9 : 0;
  return (
    <div style={{ position: "relative", width: 200, height: 200, transform: `scale(${s}) rotate(${tilt}deg)`, transformOrigin: "0 0", borderRadius: 22,
      background: "linear-gradient(145deg,#FFFFFF 0%,#F1EEE8 55%,#DCD8CF 100%)", boxShadow: "0 14px 28px rgba(0,0,0,0.35), inset 0 2px 0 #fff" }}>
      {H.map((st, i) => <div key={i} style={st} />)}
      {n === 12 && <div style={{ position: "absolute", left: 60, top: 168, width: 80, height: 8, borderRadius: 4, background: "rgba(120,70,20,0.45)" }} />}
    </div>
  );
};

// 1) TOMA N: abajo a la derecha, tapa sobre un azulejo + rótulo
export const TomaN: React.FC<{ n: number; title: string; dur: number }> = ({ n, title, dur }) => {
  const f = useCurrentFrame();
  const k = sp(f, 13, 1.1);
  const rot = interpolate(k, [0, 1], [-70, 0]);
  const y = outY(f, dur);
  const lbl = interpolate(f, [12, 24], [0, 1], { ...K, easing: Easing.out(Easing.cubic) });
  const warn = n === 6;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 80, bottom: 80, display: "flex", alignItems: "flex-end", gap: 26, transform: `translateY(${y}px)` }}>
        <div style={{ opacity: lbl, transform: `translateX(${(1 - lbl) * 60}px)`, textAlign: "right", marginBottom: 20 }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 42, color: warn ? "#FFD7D2" : T.yellow, letterSpacing: 3, textShadow: "0 3px 10px rgba(0,0,0,0.8)" }}>ENCHUFE {n}/12</div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 56, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,0.85)", maxWidth: 760 }}>{title}</div>
        </div>
        <div style={{ width: 300, height: 300, borderRadius: 18, background: `${tiles}, ${T.tile}`, backgroundRepeat: "repeat", boxShadow: warn ? `0 0 0 8px ${T.red}, 0 20px 40px rgba(0,0,0,0.5)` : "0 20px 40px rgba(0,0,0,0.5)",
          transform: `translateX(${(1 - k) * 500}px)`, position: "relative" }}>
          <div style={{ position: "absolute", left: 50, top: 50, transform: `rotate(${rot}deg)`, transformOrigin: "100px 100px" }}><Cara n={n} /></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 2) FICHA CTA: la ficha entra en el toma, clic, se prende el piloto y aparece SUSCRIBITE
export const FichaCTA: React.FC<{ text?: string; dur: number }> = ({ text = "SUSCRIBITE", dur }) => {
  const f = useCurrentFrame();
  const inn = sp(f, 15);
  const push = interpolate(f, [10, 20], [140, 0], { ...K, easing: Easing.in(Easing.quad) });
  const on = f >= 20;
  const pop = sp(f - 21, 10);
  const y = outY(f, dur);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 90, bottom: 90, display: "flex", alignItems: "center", gap: 0, transform: `translate(${(1 - inn) * -900}px, ${y}px)` }}>
        <div style={{ position: "relative", width: 230, height: 230, borderRadius: 18, background: `${tiles}, ${T.tile}`, boxShadow: "0 20px 40px rgba(0,0,0,0.45)" }}>
          <div style={{ position: "absolute", left: 15, top: 15 }}><Cara n={2} /></div>
          <div style={{ position: "absolute", right: 22, top: 22, width: 22, height: 22, borderRadius: "50%", background: on ? "#5BE37F" : "#56605A", boxShadow: on ? "0 0 24px #5BE37F" : "none" }} />
        </div>
        {/* la ficha: cuerpo negro + cable */}
        <div style={{ position: "relative", marginLeft: -40 + push, width: 170, height: 150, borderRadius: "16px 60px 60px 16px", background: "linear-gradient(180deg,#3A3D44,#16181C)", boxShadow: "0 16px 30px rgba(0,0,0,0.45)" }}>
          <div style={{ position: "absolute", left: 150, top: 62, width: 600, height: 26, borderRadius: 13, background: "linear-gradient(180deg,#3A3D44,#121317)" }} />
        </div>
        <div style={{ marginLeft: 40, transform: `scale(${0.6 + 0.4 * pop})`, opacity: pop, padding: "18px 40px", borderRadius: 14, background: T.red, boxShadow: "0 16px 30px rgba(0,0,0,0.45)",
          fontFamily: LABEL, fontWeight: 700, fontSize: 72, color: "#fff", letterSpacing: 8 }}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};

// 3) IMÁN DE HELADERA: puerta blanca esmaltada a la derecha, imán rojo que cae y sujeta la notita con la pregunta
export const ImanHeladera: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const door = sp(f, 16);
  const note = sp(f - 8, 11);
  const mag = interpolate(f, [14, 22], [-200, 0], { ...K, easing: Easing.out(Easing.back(2)) });
  const y = outY(f, dur);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 0, top: 70, bottom: 70, width: 820, transform: `translate(${(1 - door) * 900}px, ${y}px)`,
        background: "linear-gradient(90deg,#DCDDDB 0%,#F7F7F5 18%,#FFFFFF 50%,#ECEDEB 100%)", borderRadius: "30px 0 0 30px", boxShadow: "-20px 0 50px rgba(0,0,0,0.4)" }}>
        <div style={{ position: "absolute", left: 40, top: 120, width: 26, height: 360, borderRadius: 13, background: "linear-gradient(90deg,#B8BBBE,#E8E9EA,#A9ACB0)" }} />
        <div style={{ position: "absolute", left: 130, top: 170, width: 600, padding: "60px 40px 40px", background: "#FFF6C9", transform: `rotate(${(1 - note) * 12 - 2}deg) scale(${0.8 + 0.2 * note})`, opacity: note,
          boxShadow: "0 14px 26px rgba(0,0,0,0.25)" }}>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, lineHeight: 1.12, color: T.ink }}>{text}</div>
          <div style={{ marginTop: 18, fontFamily: LABEL, fontSize: 28, color: "#7A6F48", letterSpacing: 3 }}>↓ CONTAME EN LOS COMENTARIOS</div>
          <div style={{ position: "absolute", left: 250, top: -26 + mag, width: 100, height: 64, borderRadius: 16, background: "radial-gradient(circle at 35% 30%,#F06A5E,#C9302C 55%,#7E1513)", boxShadow: "0 8px 14px rgba(0,0,0,0.35)" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 4) PARED DE TOMAS: 12 tapas en 4x3 sobre azulejo; cada una se ilumina en su marca; la 6 se tacha
export const ParedTomas: React.FC<{ items: string[]; marks: number[]; bg: string; dur: number }> = ({ items, marks, bg, dur }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], [1.04, 1.12]);
  const cur = marks.reduce((a, m, i) => (f >= m ? i : a), -1);
  return (
    <AbsoluteFill style={{ background: "#1C2024", overflow: "hidden" }}>
      <Img src={staticFile(bg)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, filter: "brightness(0.4)" }} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 70, bottom: 70, borderRadius: 24, background: `${tiles}, ${T.tile}`, backgroundSize: "120px 120px", boxShadow: "0 40px 80px rgba(0,0,0,0.55)",
        transform: `translateY(${(1 - sp(f, 16)) * 900}px)` }}>
        {items.map((t, i) => {
          const c = i % 4, r = Math.floor(i / 4);
          const on = f >= marks[i]; const k = on ? sp(f - marks[i], 10) : 0; const hi = i === cur;
          return (
            <div key={i} style={{ position: "absolute", left: 60 + c * 410, top: 34 + r * 305, width: 380, display: "flex", alignItems: "center", gap: 18,
              opacity: 0.35 + 0.65 * k, transform: `scale(${hi ? 1 + 0.05 * k : 1})` }}>
              <div style={{ position: "relative", width: 150, height: 150, flex: "none" }}>
                <Cara n={i + 1} s={0.75} />
                {i === 5 && on && <div style={{ position: "absolute", left: -10, top: 66, width: 170, height: 14, background: T.red, transform: `rotate(-35deg) scaleX(${k})`, borderRadius: 7 }} />}
              </div>
              <div>
                <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: i === 5 ? T.red : T.ink }}>{i + 1}</div>
                <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 30, lineHeight: 1.1, color: T.ink }}>{t}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
