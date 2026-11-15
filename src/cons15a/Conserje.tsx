// Piezas propias de Claudio el Conserje (cons15a). Todo CSS/DOM, sin SVG sobre las fotos.
// Identidad: llavero de habitación de latón, cartel de "no molestar" de puerta, tarjeta de comentarios del huésped,
// hoja de servicio de lavandería. Registro: D:/rtmp/cons14_COMPONENTES.md
import React from "react";
import { AbsoluteFill, Img, Easing, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { CL, SERIF, LABEL, HAND } from "./ClTheme";

const K = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const brass = `linear-gradient(135deg, ${CL.brassLight} 0%, ${CL.brass} 45%, #8E6A30 70%, ${CL.brassLight} 100%)`;
const out = (f: number, dur: number, n = 12) => interpolate(f, [dur - n, dur], [1, 0], K);

// 1) LLAVERO DE PASO: la foto del paso entra con un empuje lento y un llavero de latón (de los de habitación)
// cae desde arriba, se balancea en su argolla y queda; el número del paso está grabado en la placa.
export const StepKey: React.FC<{ n: number; total: number; title: string; src: string; dur: number }> = ({ n, total, title, src, dur }) => {
  const f = useCurrentFrame();
  const o = out(f, dur);
  const drop = spring({ frame: f - 4, fps: 30, config: { damping: 9, mass: 0.9, stiffness: 120 } });
  const swing = Math.sin((f - 4) / 5.5) * 14 * Math.exp(-Math.max(0, f - 4) / 26);
  const tIn = spring({ frame: f - 16, fps: 30, config: { damping: 18 } });
  const z = interpolate(f, [0, dur], [1.04, 1.12]);
  return (
    <AbsoluteFill style={{ opacity: o, background: CL.navyDeep }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, transformOrigin: "70% 50%" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(19,29,53,0.86) 0%, rgba(19,29,53,0.55) 38%, rgba(19,29,53,0) 62%)` }} />
      {/* argolla + llavero */}
      <div style={{ position: "absolute", left: 170, top: -40, width: 300, height: 640, transformOrigin: "150px 40px",
        transform: `translateY(${(drop - 1) * 520}px) rotate(${swing}deg)` }}>
        <div style={{ position: "absolute", left: 112, top: 10, width: 76, height: 76, borderRadius: 38, border: `9px solid ${CL.brassLight}`, boxShadow: "0 6px 14px rgba(0,0,0,0.35)" }} />
        <div style={{ position: "absolute", left: 30, top: 92, width: 240, height: 440, borderRadius: "120px 120px 34px 34px", background: brass,
          boxShadow: `0 26px 50px ${CL.shadow}, inset 0 3px 0 rgba(255,255,255,0.45), inset 0 -6px 12px rgba(0,0,0,0.25)`,
          display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 46 }}>
          <div style={{ width: 34, height: 34, borderRadius: 17, background: CL.navyDeep, boxShadow: "inset 0 3px 6px rgba(0,0,0,0.6)" }} />
          <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 30, letterSpacing: 6, color: "#4A3514", marginTop: 34, textShadow: "0 1px 0 rgba(255,255,255,0.4)" }}>PASO</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 190, lineHeight: 0.95, color: "#3E2C10", textShadow: "0 2px 0 rgba(255,255,255,0.35), 0 -1px 0 rgba(0,0,0,0.3)" }}>{n}</div>
          <div style={{ fontFamily: LABEL, fontWeight: 500, fontSize: 26, letterSpacing: 4, color: "#4A3514" }}>DE {total}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 520, top: 380, maxWidth: 760, opacity: tIn, transform: `translateX(${(1 - tIn) * -40}px)` }}>
        <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 34, letterSpacing: 8, color: CL.yellow }}>PASO {n} DE {total}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: title.length > 24 ? 92 : 108, lineHeight: 1.02, color: CL.white, textShadow: "0 4px 18px rgba(0,0,0,0.5)", marginTop: 8, textWrap: "balance" as any }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// 2) CARTEL DE PUERTA: el CTA de suscripción es el cartel de picaporte del hotel. Entra colgado, se da vuelta
// (de "NO MOLESTAR" a "SUSCRÍBASE"), y al "presionarlo" pasa a "SUSCRITO ✓" con el aro amarillo.
export const DoorHanger: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame(); const o = out(f, dur, 14);
  const inn = spring({ frame: f - 2, fps: 30, config: { damping: 12, mass: 0.8 } });
  const flip = interpolate(f, [26, 44], [0, 180], { ...K, easing: Easing.inOut(Easing.cubic) });
  const back = flip > 90;
  const on = f >= 92;
  const press = interpolate(f, [86, 92, 100], [1, 0.9, 1], K);
  const sw = Math.sin(f / 7) * 3 * Math.exp(-f / 40);
  const band = spring({ frame: f - 50, fps: 30, config: { damping: 16 } });
  const face = (child: React.ReactNode, bg: string, rot: number) => (
    <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: `rotateY(${rot}deg)`, background: bg, borderRadius: 30,
      boxShadow: `0 30px 60px rgba(0,0,0,0.45)`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 30 }}>
      <div style={{ width: 150, height: 150, borderRadius: 75, background: "rgba(0,0,0,0.0)", border: `0px`, boxShadow: `inset 0 0 0 1000px transparent` }}>
        <div style={{ width: 150, height: 150, borderRadius: 75, background: CL.navyDeep, opacity: 0.9 }} />
      </div>
      {child}
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "linear-gradient(270deg, rgba(19,29,53,0.7) 0%, rgba(19,29,53,0) 55%)" }} />
      <div style={{ position: "absolute", right: 170, top: 90, width: 420, height: 760, perspective: 1600,
        transform: `translateY(${(1 - inn) * -900}px) rotate(${sw}deg) scale(${press})`, transformOrigin: "50% 0%" }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${flip}deg)` }}>
          {face(<>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 64, letterSpacing: 4, color: CL.white, marginTop: 120, textAlign: "center", lineHeight: 1.05 }}>NO<br />MOLESTAR</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: CL.yellowSoft, marginTop: 40 }}>habitación 412</div>
          </>, CL.red, 0)}
          {face(<>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: on ? 70 : 64, letterSpacing: 3, color: on ? CL.navy : CL.white, marginTop: 110, textAlign: "center", lineHeight: 1.05 }}>{on ? <>SUSCRITO<br />✓</> : <>SUSCRÍ-<br />BASE</>}</div>
            <div style={{ fontFamily: SERIF, fontWeight: 600, fontStyle: "italic", fontSize: 36, color: on ? CL.navy : CL.navySoft, marginTop: 40, textAlign: "center", padding: "0 30px" }}>un arreglo de la casa cada semana</div>
          </>, on ? CL.yellow : CL.navy, 180)}
        </div>
        {on && <div style={{ position: "absolute", left: 135, top: 30, width: 150, height: 150, borderRadius: 75, border: `8px solid ${CL.yellow}`,
          transform: `scale(${1 + (f - 92) / 30})`, opacity: Math.max(0, 1 - (f - 92) / 24) }} />}
      </div>
      <div style={{ position: "absolute", left: 120, bottom: 110, maxWidth: 1050, opacity: band, transform: `translateY(${(1 - band) * 30}px)` }}>
        <div style={{ background: CL.white, borderLeft: `14px solid ${CL.yellow}`, borderRadius: 14, padding: "22px 36px", fontFamily: SERIF, fontWeight: 700,
          fontSize: text.length > 48 ? 54 : 62, lineHeight: 1.12, color: CL.ink, boxShadow: `0 18px 40px ${CL.shadow}` }}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};

// 3) TARJETA DEL HUÉSPED: la pregunta para comentarios se escribe a mano (Caveat) en la tarjeta de
// "comentarios del huésped" que deja el hotel sobre la cama, con el lápiz del hotel avanzando.
export const GuestCard: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame(); const o = out(f, dur, 14);
  const inn = spring({ frame: f - 2, fps: 30, config: { damping: 15, mass: 0.8 } });
  const T0 = 34, T1 = T0 + Math.round(text.length * 1.6);
  const shown = Math.floor(interpolate(f, [T0, T1], [0, text.length], K));
  const p = shown / Math.max(1, text.length);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "rgba(19,29,53,0.45)" }} />
      <div style={{ position: "absolute", left: 260, top: 120, width: 1400, height: 820, background: CL.white, borderRadius: 8,
        boxShadow: `0 40px 80px rgba(0,0,0,0.5)`, transform: `translateY(${(1 - inn) * 700}px) rotate(${(1 - inn) * 6 - 1.2}deg)`,
        backgroundImage: `repeating-linear-gradient(0deg, transparent 0 86px, ${CL.grout} 86px 88px)`, backgroundPosition: "0 210px", padding: "50px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `4px double ${CL.brass}`, paddingBottom: 18, background: CL.white }}>
          <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 38, letterSpacing: 8, color: CL.navy }}>COMENTARIOS DEL HUÉSPED</div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontStyle: "italic", fontSize: 36, color: CL.brass }}>Claudio · fijado</div>
        </div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 74, lineHeight: "88px", color: CL.navy, marginTop: 36, position: "relative" }}>
          {text.slice(0, shown)}
          <span style={{ display: "inline-block", width: 14, height: 120, marginLeft: 6, background: CL.yellow, borderRadius: 4, transform: "rotate(28deg) translateY(-30px)",
            boxShadow: "0 6px 10px rgba(0,0,0,0.3)", opacity: p < 1 ? 1 : 0 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 4) HOJA DE SERVICIO: el repaso de los 9 pasos es la hoja de turno de lavandería en una tablilla;
// cada renglón se marca con el sello de goma "HECHO" en el momento en que Claudio lo nombra.
export const ServiceSheet: React.FC<{ items: string[]; marks: number[]; dur: number }> = ({ items, marks, dur }) => {
  const f = useCurrentFrame(); const o = out(f, dur, 14);
  const inn = spring({ frame: f, fps: 30, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ opacity: o, background: CL.tile, backgroundImage: `linear-gradient(${CL.grout} 2px, transparent 2px), linear-gradient(90deg, ${CL.grout} 2px, transparent 2px)`, backgroundSize: "160px 160px" }}>
      <div style={{ position: "absolute", left: 460, top: 40, width: 1000, height: 1000, background: "#8B6A45", borderRadius: 26, boxShadow: `0 30px 60px ${CL.shadow}`,
        transform: `translateY(${(1 - inn) * 900}px)` }}>
        <div style={{ position: "absolute", left: 380, top: -14, width: 240, height: 70, borderRadius: 14, background: brass, boxShadow: "0 6px 12px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: 40, top: 70, right: 40, bottom: 34, background: CL.white, padding: "26px 48px" }}>
          <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 34, letterSpacing: 6, color: CL.navy, borderBottom: `3px solid ${CL.navy}`, paddingBottom: 10 }}>HOJA DE SERVICIO · LAVADORA</div>
          {items.map((t, i) => {
            const m = marks[i];
            const st = spring({ frame: f - m, fps: 30, config: { damping: 10, mass: 0.6 } });
            const lit = f >= m;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", height: 84, borderBottom: `2px solid ${CL.grout}`, position: "relative" }}>
                <div style={{ width: 70, fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: lit ? CL.brass : CL.grout }}>{i + 1}</div>
                <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 44, color: lit ? CL.ink : CL.inkSoft, opacity: lit ? 1 : 0.55 }}>{t}</div>
                {lit && <div style={{ position: "absolute", right: 0, fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: CL.nitrile,
                  border: `4px solid ${CL.nitrile}`, borderRadius: 8, padding: "2px 14px", transform: `rotate(-8deg) scale(${interpolate(st, [0, 1], [2.2, 1])})`, opacity: st * 0.9 }}>HECHO</div>}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
