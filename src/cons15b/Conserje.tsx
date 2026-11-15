// Piezas propias de Claudio el Conserje (cons15b, persianas). Todo CSS/DOM, sin SVG sobre las fotos.
// Distintas a las de cons15a (llavero, cartel de puerta, tarjeta a mano, hoja de servicio).
// Identidad: indicador de piso del ascensor del hotel, tarjeta-llave en la cerradura, nota de recepción
// a máquina, persiana de lamas. Registro: D:/rtmp/cons14_COMPONENTES.md
import React from "react";
import { AbsoluteFill, Img, Easing, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { CL, SERIF, LABEL } from "./ClTheme";

const K = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const brass = `linear-gradient(135deg, ${CL.brassLight} 0%, ${CL.brass} 45%, #8E6A30 70%, ${CL.brassLight} 100%)`;
const out = (f: number, dur: number, n = 12) => interpolate(f, [dur - n, dur], [1, 0], K);
const MONO = "'Courier New', Courier, monospace";

// 1) INDICADOR DE PISO: la foto del paso entra con empuje lento y arriba aparece el indicador de latón
// del ascensor antiguo del hotel: la aguja barre el arco y se para en el número del paso (1 a 8).
export const ElevatorDial: React.FC<{ n: number; total: number; title: string; src: string; dur: number }> = ({ n, total, title, src, dur }) => {
  const f = useCurrentFrame();
  const o = out(f, dur);
  const inn = spring({ frame: f, fps: 30, config: { damping: 16 } });
  const A0 = -70, A1 = 70; // grados del arco
  const ang = (k: number) => A0 + ((k - 1) / Math.max(1, total - 1)) * (A1 - A0);
  const prev = n > 1 ? n - 1 : 1;
  const sweep = interpolate(f, [8, 30], [0, 1], { ...K, easing: Easing.out(Easing.cubic) });
  const wob = Math.sin((f - 30) / 3) * 3 * Math.exp(-Math.max(0, f - 30) / 10) * (f > 30 ? 1 : 0);
  const a = ang(prev) + (ang(n) - ang(prev)) * sweep + wob;
  const lit = f >= 30;
  const tIn = spring({ frame: f - 22, fps: 30, config: { damping: 18 } });
  const z = interpolate(f, [0, dur], [1.04, 1.12]);
  const R = 230; // radio de los números
  return (
    <AbsoluteFill style={{ opacity: o, background: CL.navyDeep }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, transformOrigin: "50% 70%" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(19,29,53,0.88) 0%, rgba(19,29,53,0.5) 36%, rgba(19,29,53,0) 55%, rgba(19,29,53,0) 70%, rgba(19,29,53,0.8) 100%)" }} />
      {/* placa del indicador */}
      <div style={{ position: "absolute", left: 960 - 330, top: -20, width: 660, height: 360, transform: `translateY(${(1 - inn) * -380}px)`,
        borderRadius: "330px 330px 26px 26px", background: brass, boxShadow: `0 26px 50px rgba(0,0,0,0.5), inset 0 3px 0 rgba(255,255,255,0.45), inset 0 -8px 14px rgba(0,0,0,0.25)` }}>
        <div style={{ position: "absolute", left: 40, top: 40, right: 40, bottom: 20, borderRadius: "290px 290px 14px 14px", background: "#2A2117",
          boxShadow: "inset 0 6px 16px rgba(0,0,0,0.7)", overflow: "hidden" }}>
          {Array.from({ length: total }, (_, i) => {
            const k = i + 1; const r = (ang(k) * Math.PI) / 180;
            const on = lit && k === n;
            return (
              <div key={k} style={{ position: "absolute", left: 290 + Math.sin(r) * R - 30, top: 300 - Math.cos(r) * R - 30, width: 60, height: 60,
                display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 44,
                color: on ? CL.yellow : "#9C8A6A", textShadow: on ? `0 0 18px ${CL.yellow}, 0 0 4px ${CL.yellow}` : "none" }}>{k}</div>
            );
          })}
          {/* aguja */}
          <div style={{ position: "absolute", left: 290 - 5, top: 300 - 200, width: 10, height: 200, background: `linear-gradient(180deg, ${CL.red}, #8C2219)`,
            borderRadius: 5, transformOrigin: "50% 100%", transform: `rotate(${a}deg)`, boxShadow: "0 2px 6px rgba(0,0,0,0.6)" }} />
          <div style={{ position: "absolute", left: 290 - 28, top: 300 - 28, width: 56, height: 56, borderRadius: 28, background: brass, boxShadow: "0 3px 8px rgba(0,0,0,0.6)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, display: "flex", flexDirection: "column", alignItems: "center", opacity: tIn, transform: `translateY(${(1 - tIn) * 40}px)` }}>
        <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 36, letterSpacing: 10, color: CL.yellow }}>PASO {n} DE {total}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: title.length > 30 ? 84 : 104, lineHeight: 1.04, color: CL.white, textShadow: "0 4px 18px rgba(0,0,0,0.55)",
          marginTop: 6, maxWidth: 1500, textAlign: "center", textWrap: "balance" as any }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// 2) TARJETA-LLAVE: el CTA de suscripción es la tarjeta magnética de la habitación. Entra, baja por la ranura
// de la cerradura, la luz pasa de roja a verde y la pantallita dice "SUSCRITO".
export const KeycardLock: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame(); const o = out(f, dur, 14);
  const lockIn = spring({ frame: f, fps: 30, config: { damping: 15 } });
  const cardX = interpolate(f, [6, 30], [700, 0], { ...K, easing: Easing.out(Easing.cubic) });
  const cardY = interpolate(f, [40, 62], [0, 230], { ...K, easing: Easing.inOut(Easing.quad) });
  const green = f >= 64;
  const blink = !green && f > 30 && Math.floor(f / 6) % 2 === 0;
  const pulse = green ? interpolate(f, [64, 90], [0, 1], K) : 0;
  const band = spring({ frame: f - 46, fps: 30, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "linear-gradient(270deg, rgba(19,29,53,0.78) 0%, rgba(19,29,53,0) 58%)" }} />
      <div style={{ position: "absolute", right: 210, top: 80, width: 360, height: 760, transform: `translateX(${(1 - lockIn) * 600}px)` }}>
        {/* cuerpo de la cerradura */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 40, background: brass, boxShadow: `0 30px 60px rgba(0,0,0,0.5), inset 0 3px 0 rgba(255,255,255,0.45)` }} />
        <div style={{ position: "absolute", left: 40, top: 60, width: 280, height: 150, borderRadius: 14, background: "#0E1410", boxShadow: "inset 0 4px 10px rgba(0,0,0,0.8)",
          display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LABEL, fontWeight: 700, fontSize: green ? 50 : 40, letterSpacing: 4,
          color: green ? "#5BE37D" : "#E25A4C", textShadow: green ? "0 0 14px #5BE37D" : "0 0 10px #E25A4C" }}>{green ? "SUSCRITO" : "SUSCRÍBASE"}</div>
        <div style={{ position: "absolute", left: 155, top: 240, width: 50, height: 50, borderRadius: 25, background: green ? "#3FD267" : blink ? "#F04A3A" : "#7A2A22",
          boxShadow: green ? `0 0 ${20 + pulse * 30}px #3FD267` : blink ? "0 0 18px #F04A3A" : "none" }} />
        {/* ranura */}
        <div style={{ position: "absolute", left: 60, top: 330, width: 240, height: 22, borderRadius: 11, background: "#1A140C", boxShadow: "inset 0 3px 6px rgba(0,0,0,0.9)" }} />
        {/* manija */}
        <div style={{ position: "absolute", left: -150, top: 520, width: 340, height: 70, borderRadius: 35, background: brass, boxShadow: "0 12px 24px rgba(0,0,0,0.45)",
          transformOrigin: "300px 35px", transform: `rotate(${green ? interpolate(f, [70, 80, 92], [0, 14, 0], K) : 0}deg)` }} />
        {/* tarjeta: la parte que ya entró queda tapada por la placa de abajo */}
        <div style={{ position: "absolute", left: 70, top: 341 - 300, width: 220, height: 300, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 220, height: 300, transform: `translate(${cardX}px, ${cardY}px)`, borderRadius: 16,
            background: `linear-gradient(160deg, ${CL.navy} 0%, ${CL.navyDeep} 100%)`, boxShadow: "0 14px 28px rgba(0,0,0,0.5)", border: `3px solid ${CL.brassLight}`,
            display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 34 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: CL.brassLight }}>C</div>
            <div style={{ fontFamily: LABEL, fontWeight: 500, fontSize: 22, letterSpacing: 5, color: CL.navySoft, marginTop: 6 }}>HABITACIÓN</div>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: CL.white }}>412</div>
            <div style={{ width: 150, height: 18, background: "#0A0A0A", marginTop: 26, borderRadius: 3 }} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, bottom: 110, maxWidth: 1080, opacity: band, transform: `translateY(${(1 - band) * 30}px)` }}>
        <div style={{ background: CL.white, borderLeft: `14px solid ${CL.yellow}`, borderRadius: 14, padding: "22px 36px", fontFamily: SERIF, fontWeight: 700,
          fontSize: text.length > 48 ? 54 : 62, lineHeight: 1.12, color: CL.ink, boxShadow: `0 18px 40px ${CL.shadow}` }}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};

// 3) NOTA DE RECEPCIÓN: la pregunta para comentarios llega como el recado que la recepción le deja al huésped,
// en el talonario rosa de "MIENTRAS USTED NO ESTABA", escrito a máquina letra por letra.
export const PhoneMessage: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame(); const o = out(f, dur, 14);
  const inn = spring({ frame: f - 2, fps: 30, config: { damping: 14, mass: 0.8 } });
  const T0 = 30, T1 = T0 + Math.round(text.length * 1.4);
  const shown = Math.floor(interpolate(f, [T0, T1], [0, text.length], K));
  const typing = f >= T0 && f < T1;
  const jig = typing ? (Math.floor(f / 2) % 2 ? 1.5 : -1.5) : 0;
  const box = (on: boolean, label: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: LABEL, fontWeight: 500, fontSize: 28, letterSpacing: 2, color: "#7A3A48" }}>
      <div style={{ width: 30, height: 30, border: "3px solid #7A3A48", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 700, fontSize: 30, color: CL.navy }}>{on ? "X" : ""}</div>
      {label}
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "rgba(19,29,53,0.5)" }} />
      <div style={{ position: "absolute", left: 300, top: 70, width: 1320, height: 900, background: "#F9DDE2", borderRadius: 6,
        boxShadow: `0 40px 80px rgba(0,0,0,0.5)`, transform: `translateX(${(1 - inn) * 1400}px) rotate(${(1 - inn) * -5 + 1}deg)`, padding: "44px 70px" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 22, background: "repeating-linear-gradient(90deg, #F9DDE2 0 14px, transparent 14px 22px)", transform: "translateY(-11px)" }} />
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 50, letterSpacing: 6, color: "#A3324A", textAlign: "center", borderBottom: "3px solid #A3324A", paddingBottom: 12 }}>MIENTRAS USTED NO ESTABA</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, fontFamily: LABEL, fontSize: 30, color: "#7A3A48" }}>
          <div>PARA: <span style={{ fontFamily: MONO, fontWeight: 700, color: CL.navy, fontSize: 34 }}>Usted</span></div>
          <div>DE: <span style={{ fontFamily: MONO, fontWeight: 700, color: CL.navy, fontSize: 34 }}>Claudio, recepción</span></div>
        </div>
        <div style={{ display: "flex", gap: 50, marginTop: 22 }}>
          {box(false, "LLAMÓ")}{box(true, "DEJÓ PREGUNTA")}{box(true, "ESPERA RESPUESTA")}
        </div>
        <div style={{ marginTop: 30, fontFamily: LABEL, fontSize: 28, letterSpacing: 3, color: "#7A3A48" }}>MENSAJE:</div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 62, lineHeight: "84px", color: CL.navy, marginTop: 6, minHeight: 420,
          backgroundImage: "repeating-linear-gradient(0deg, transparent 0 82px, #D9A9B4 82px 84px)", transform: `translateX(${jig}px)` }}>
          {text.slice(0, shown)}
          <span style={{ display: "inline-block", width: 34, height: 6, background: CL.navy, marginLeft: 4, opacity: shown < text.length && Math.floor(f / 8) % 2 === 0 ? 1 : 0 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 4) PERSIANA DEL REPASO: una persiana de 8 lamas anchas sobre la ventana del hotel; cada lama gira en 3D
// y muestra su paso escrito en el momento en que Claudio dice el número.
export const BlindRecap: React.FC<{ items: string[]; marks: number[]; dur: number }> = ({ items, marks, dur }) => {
  const f = useCurrentFrame(); const o = out(f, dur, 14);
  const inn = interpolate(f, [0, 16], [0, 1], { ...K, easing: Easing.out(Easing.cubic) });
  const H = 104, G = 10, N = items.length;
  const top = (1080 - (N * H + (N - 1) * G)) / 2;
  return (
    <AbsoluteFill style={{ opacity: o, background: "linear-gradient(180deg, #DCE7EE 0%, #F4F1EA 100%)" }}>
      {/* marco de ventana + riel */}
      <div style={{ position: "absolute", left: 230, top: top - 60, width: 1460, height: 40, borderRadius: 8, background: CL.white, boxShadow: `0 8px 18px ${CL.shadow}` }} />
      {[400, 1520].map((x) => (
        <div key={x} style={{ position: "absolute", left: x, top: top - 20, width: 6, height: N * (H + G), background: "#CFC6B6", opacity: inn }} />
      ))}
      {items.map((t, i) => {
        const m = marks[i];
        const drop = interpolate(f, [i * 1.5, i * 1.5 + 12], [0, 1], { ...K, easing: Easing.out(Easing.cubic) });
        const rot = interpolate(f, [m - 4, m + 8], [80, 0], { ...K, easing: Easing.out(Easing.back(1.4)) });
        const on = f >= m - 4;
        return (
          <div key={i} style={{ position: "absolute", left: 260, top: top + i * (H + G), width: 1400, height: H, perspective: 1400,
            transform: `translateY(${(1 - drop) * -(i + 1) * (H + G)}px)`, opacity: drop }}>
            <div style={{ position: "absolute", inset: 0, transform: `rotateX(${rot}deg)`, borderRadius: 10,
              background: on ? `linear-gradient(180deg, ${CL.white} 0%, #ECE6DA 100%)` : "linear-gradient(180deg, #E9E3D6 0%, #CDC4B2 100%)",
              boxShadow: `0 6px 14px ${CL.shadow}`, display: "flex", alignItems: "center", padding: "0 40px", gap: 30 }}>
              <div style={{ width: 70, height: 70, borderRadius: 35, background: on ? CL.navy : "#B9AF9C", color: on ? CL.yellow : "#E9E3D6",
                display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 44, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 50, color: CL.ink, opacity: on ? 1 : 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
