// Piezas propias de Claudio el Conserje (cons15b, persianas). Todo CSS/DOM, sin SVG sobre las fotos.
// v2 (EVALUADOR v1 = 5,2): indicador grande con puertas de latón, salida por arriba; cerradura en puerta real
// con tarjeta 412 visible; recado que cae en el casillero de llaves con sello; repaso = persiana real cuyas
// lamas giran y muestran la foto de cada paso. Registro: D:/rtmp/cons14_COMPONENTES.md
import React from "react";
import { AbsoluteFill, Img, Easing, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { CL, SERIF, LABEL, HAND } from "./ClTheme";

const K = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const brass = `linear-gradient(135deg, ${CL.brassLight} 0%, ${CL.brass} 45%, #8E6A30 70%, ${CL.brassLight} 100%)`;
const MONO = "'Courier New', Courier, monospace";
// salida "ascensor": todo sube y sale por arriba (nunca un fundido encima de la cara)
const liftOut = (f: number, dur: number, n = 12) => interpolate(f, [dur - n, dur], [0, -1150], { ...K, easing: Easing.in(Easing.cubic) });
const fadeOut = (f: number, dur: number, n = 10) => interpolate(f, [dur - n, dur], [1, 0], K);

// 1) INDICADOR DE PISO grande: dos puertas de latón se abren y dejan ver el dial; la aguja viaja con inercia
// del paso anterior al actual, rebota, la lámpara del número se enciende con halo y un aro de "ding".
// Mientras dura: aguja que vibra, brillo que barre el latón, foto que sigue avanzando. Paso final: destello dorado.
export const ElevatorDial: React.FC<{ n: number; total: number; title: string; src: string; dur: number }> = ({ n, total, title, src, dur }) => {
  const f = useCurrentFrame();
  const y = liftOut(f, dur);
  const last = n === total;
  const W = 1100, H = 560, CX = W / 2 - 46, CY = 460, R = 380;
  const A0 = -72, A1 = 72;
  const ang = (k: number) => A0 + ((k - 1) / Math.max(1, total - 1)) * (A1 - A0);
  const pos = (k: number) => { const r = (ang(k) * Math.PI) / 180; return [CX + Math.sin(r) * R, CY - Math.cos(r) * R]; };
  const prev = n > 1 ? n - 1 : 1;
  const inn = spring({ frame: f, fps: 30, config: { damping: 15 } });
  const doors = interpolate(f, [4, 16], [0, 1], { ...K, easing: Easing.inOut(Easing.cubic) });
  const sp = spring({ frame: f - 10, fps: 30, config: { damping: 7, stiffness: 80 } });
  const ARR = 26;
  const hum = f > ARR ? Math.sin(f / 1.7) * 1.6 : 0;
  const a = ang(prev) + (ang(n) - ang(prev)) * sp + hum;
  const lit = f >= ARR && !(f >= ARR + 6 && f < ARR + 9); // parpadea una vez al llegar
  const ding = interpolate(f, [ARR, ARR + 22], [0, 1], K);
  const glint = interpolate(f, [ARR + 14, ARR + 44], [-40, 140], K);
  const big = last ? 1 + 0.16 * spring({ frame: f - ARR, fps: 30, config: { damping: 11 } }) : 1;
  const flash = last ? interpolate(f, [ARR, ARR + 4, ARR + 20], [0, 0.25, 0], K) : 0;
  const z = interpolate(f, [0, dur], [1.05, 1.16]);
  const panX = interpolate(f, [0, dur], [-14, 14]);
  const tIn = spring({ frame: f - 20, fps: 30, config: { damping: 18 } });
  const [dx, dy] = pos(n);
  return (
    <AbsoluteFill style={{ transform: `translateY(${y}px)` }}>
      <AbsoluteFill style={{ overflow: "hidden", background: CL.navyDeep }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${panX}px) scale(${z})`, transformOrigin: "50% 75%" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(19,29,53,0.9) 0%, rgba(19,29,53,0.55) 40%, rgba(19,29,53,0.05) 58%, rgba(19,29,53,0.15) 66%, rgba(19,29,53,0.88) 100%)" }} />
      {/* placa empotrada */}
      <div style={{ position: "absolute", left: 960 - W / 2, top: -36, width: W, height: H, transform: `translateY(${(1 - inn) * -560}px) scale(${big})`, transformOrigin: "50% 0%",
        borderRadius: `${W / 2}px ${W / 2}px 30px 30px`, background: brass, overflow: "hidden",
        boxShadow: `0 34px 60px rgba(0,0,0,0.55), 0 0 0 10px rgba(30,20,10,0.35), inset 0 4px 0 rgba(255,255,255,0.5), inset 0 -10px 18px rgba(0,0,0,0.3)` }}>
        <div style={{ position: "absolute", left: 46, top: 46, right: 46, bottom: 24, borderRadius: `${W / 2 - 46}px ${W / 2 - 46}px 16px 16px`, background: "#241B12",
          boxShadow: "inset 0 8px 20px rgba(0,0,0,0.75)", overflow: "hidden" }}>
          {Array.from({ length: total }, (_, i) => {
            const k = i + 1; const [x, yy] = pos(k);
            const on = lit && k === n; const past = k < n;
            return (
              <div key={k} style={{ position: "absolute", left: x - 45, top: yy - 45, width: 90, height: 90, borderRadius: 45,
                background: on ? "radial-gradient(circle, rgba(242,194,48,0.55) 0%, rgba(242,194,48,0.12) 55%, rgba(242,194,48,0) 72%)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 64,
                color: on ? "#FFE58A" : past ? "#7E6A4A" : "#5E513C", textShadow: on ? `0 0 22px ${CL.yellow}, 0 0 6px ${CL.yellow}` : "0 1px 0 rgba(255,255,255,0.08)" }}>{k}</div>
            );
          })}
          {/* aro del "ding" */}
          <div style={{ position: "absolute", left: dx - 45, top: dy - 45, width: 90, height: 90, borderRadius: 45, border: `5px solid ${CL.yellow}`,
            opacity: f >= ARR ? 1 - ding : 0, transform: `scale(${1 + ding * 1.6})` }} />
          <div style={{ position: "absolute", left: CX - 7, top: CY - 270, width: 14, height: 270, background: `linear-gradient(180deg, ${CL.red}, #7E1E16)`,
            borderRadius: "7px 7px 3px 3px", transformOrigin: "50% 100%", transform: `rotate(${a}deg)`, boxShadow: "0 3px 8px rgba(0,0,0,0.7)" }} />
          <div style={{ position: "absolute", left: CX - 36, top: CY - 36, width: 72, height: 72, borderRadius: 36, background: brass, boxShadow: "0 4px 10px rgba(0,0,0,0.7)" }} />
          {/* puertas de latón que se abren */}
          {[0, 1].map((s) => (
            <div key={s} style={{ position: "absolute", top: 0, bottom: 0, width: "50%", left: s ? "50%" : 0, background: brass,
              transform: `translateX(${(s ? 1 : -1) * doors * 102}%)`, boxShadow: s ? "inset 6px 0 10px rgba(0,0,0,0.35)" : "inset -6px 0 10px rgba(0,0,0,0.35)",
              borderLeft: s ? "3px solid #7A5A26" : undefined, borderRight: s ? undefined : "3px solid #7A5A26" }} />
          ))}
        </div>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, rgba(255,255,255,0) ${glint - 12}%, rgba(255,250,225,0.5) ${glint}%, rgba(255,255,255,0) ${glint + 12}%)` }} />
      </div>
      <AbsoluteFill style={{ background: "#FFE7A0", opacity: flash }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 80, display: "flex", flexDirection: "column", alignItems: "center", opacity: tIn, transform: `translateY(${(1 - tIn) * 50}px)` }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 58, letterSpacing: 12, color: CL.yellow, textShadow: "0 3px 12px rgba(0,0,0,0.6)" }}>PASO {n}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: title.length > 26 ? 96 : 116, lineHeight: 1.02, color: CL.white, marginTop: 4, maxWidth: 1600,
          textAlign: "center", textWrap: "balance" as any, textShadow: "0 5px 22px rgba(0,0,0,0.75), 0 2px 4px rgba(0,0,0,0.6)" }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// 2a) CERRADURA EN LA PUERTA (v=1): la mitad derecha es la puerta de madera de la 412 con la cerradura de latón.
// La tarjeta blanca "412" entra desde fuera de cuadro en perspectiva, baja por la ranura, flash verde, la manija
// baja 30° y la puerta se entreabre con luz cálida. Pantallita: SUSCRÍBASE → SUSCRITO.
// 2b) CAMPANILLA DE RECEPCIÓN (v=2): sobre el mostrador, la campanilla de latón se golpea dos veces (ondas)
// y la placa de al lado da vuelta de SUSCRÍBASE a SUSCRITO ✓; la tarjeta 412 descansa junto a ella.
export const KeycardLock: React.FC<{ text?: string; v?: number; dur: number }> = ({ v = 1, dur }) => {
  const f = useCurrentFrame();
  const y = v === 2 ? interpolate(f, [dur - 12, dur], [0, 600], K) : liftOut(f, dur, 14);
  if (v === 2) {
    const inn = spring({ frame: f, fps: 30, config: { damping: 16 } });
    const hits = [14, 30];
    const press = Math.max(...hits.map((h) => interpolate(f, [h - 3, h, h + 5], [0, 1, 0], K)));
    const flip = interpolate(f, [32, 44], [0, 180], { ...K, easing: Easing.inOut(Easing.cubic) });
    return (
      <AbsoluteFill style={{ transform: `translateY(${y}px)` }}>
        <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(19,29,53,0.6) 0%, rgba(19,29,53,0) 45%)" }} />
        <div style={{ position: "absolute", left: 980, right: -40, bottom: -20, height: 330, transform: `translateY(${(1 - inn) * 600}px)`,
          background: "linear-gradient(180deg, #8A5A34 0%, #6B4226 18%, #4E2F1A 100%)", borderTop: `10px solid ${CL.brassLight}`, boxShadow: "0 -20px 40px rgba(0,0,0,0.35)" }}>
          {/* campanilla */}
          <div style={{ position: "absolute", left: 90, top: -170, width: 240, height: 180 }}>
            <div style={{ position: "absolute", left: 108, top: 6 + press * 16, width: 24, height: 40, borderRadius: "10px 10px 4px 4px", background: brass }} />
            <div style={{ position: "absolute", left: 10, top: 40, width: 220, height: 120, borderRadius: "110px 110px 10px 10px", background: brass,
              boxShadow: "inset 0 -14px 20px rgba(0,0,0,0.25), 0 10px 20px rgba(0,0,0,0.4)", transform: `translateY(${press * 4}px)` }} />
            <div style={{ position: "absolute", left: -10, top: 150, width: 260, height: 26, borderRadius: 8, background: "#2B2118" }} />
            {hits.map((h) => { const p = interpolate(f, [h, h + 24], [0, 1], K); return f >= h && p < 1 ? (
              <div key={h} style={{ position: "absolute", left: -20, top: -40, width: 280, height: 280, borderRadius: 140, border: `6px solid ${CL.yellow}`,
                opacity: 1 - p, transform: `scale(${0.6 + p * 1.4})` }} />) : null; })}
          </div>
          {/* tarjeta 412 sobre el mostrador */}
          <div style={{ position: "absolute", left: 360, top: 40, width: 230, height: 150, borderRadius: 14, background: CL.white, transform: "rotate(-7deg)",
            boxShadow: "0 10px 18px rgba(0,0,0,0.45)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: LABEL, fontSize: 20, letterSpacing: 5, color: CL.brass }}>HABITACIÓN</div>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: CL.navy, lineHeight: 1 }}>412</div>
          </div>
          {/* placa que da vuelta */}
          <div style={{ position: "absolute", left: 350, top: -215, width: 560, height: 150, perspective: 1200 }}>
            <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateX(${flip}deg)` }}>
              {[0, 1].map((s) => (
                <div key={s} style={{ position: "absolute", inset: 0, borderRadius: 16, background: s ? CL.navy : brass, backfaceVisibility: "hidden",
                  transform: s ? "rotateX(180deg)" : undefined, boxShadow: "0 14px 28px rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: LABEL, fontWeight: 700, fontSize: 72, letterSpacing: 5, color: s ? CL.yellow : CL.navyDeep, whiteSpace: "nowrap" }}>{s ? "SUSCRITO ✓" : "SUSCRÍBASE"}</div>
              ))}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  const doorIn = spring({ frame: f, fps: 30, config: { damping: 17 } });
  const cardX = interpolate(f, [4, 26], [760, 0], { ...K, easing: Easing.out(Easing.cubic) });
  const cardRot = interpolate(f, [4, 26], [55, 0], K);
  const cardY = interpolate(f, [34, 52], [0, 95], { ...K, easing: Easing.inOut(Easing.quad) });
  const G = 54;
  const green = f >= G;
  const blink = !green && f > 26 && Math.floor(f / 5) % 2 === 0;
  const flash = interpolate(f, [G, G + 3, G + 14], [0, 0.18, 0], K);
  const handle = interpolate(f, [G + 4, G + 14], [0, 30], { ...K, easing: Easing.out(Easing.back(1.6)) });
  const open = interpolate(f, [G + 16, G + 40], [0, 1], { ...K, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ transform: `translateY(${y}px)` }}>
      <AbsoluteFill style={{ background: "linear-gradient(270deg, rgba(19,29,53,0.55) 0%, rgba(19,29,53,0) 50%)" }} />
      {/* luz cálida que sale por la puerta entreabierta */}
      <div style={{ position: "absolute", left: 1150, top: 0, bottom: 0, width: 30 + open * 90, opacity: open,
        background: "linear-gradient(90deg, rgba(255,214,140,0) 0%, rgba(255,214,140,0.85) 70%, #FFE2A6 100%)", filter: "blur(6px)" }} />
      <div style={{ position: "absolute", left: 1180, top: 0, width: 900, height: 1080, perspective: 2000, transform: `translateX(${(1 - doorIn) * 900}px)` }}>
        <div style={{ position: "absolute", inset: 0, transformOrigin: "100% 50%", transform: `rotateY(${open * -14}deg)`,
          background: "repeating-linear-gradient(90deg, #7A4E2C 0 46px, #6E4426 46px 92px)",
          boxShadow: "-30px 0 50px rgba(0,0,0,0.45), inset 12px 0 0 rgba(255,255,255,0.08)" }}>
          <div style={{ position: "absolute", left: 120, top: 70, width: 600, height: 230, border: "10px solid rgba(0,0,0,0.18)", borderRadius: 8 }} />
          <div style={{ position: "absolute", left: 300, top: 110, fontFamily: SERIF, fontWeight: 900, fontSize: 110, lineHeight: 1, color: CL.brassLight, textShadow: "0 3px 0 #5A3A14, 0 8px 16px rgba(0,0,0,0.5)" }}>412</div>
          {/* cerradura */}
          <div style={{ position: "absolute", left: 120, top: 360, width: 330, height: 640 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 36, background: brass, boxShadow: "0 26px 50px rgba(0,0,0,0.55), inset 0 3px 0 rgba(255,255,255,0.45)" }} />
            <div style={{ position: "absolute", left: 30, top: 28, width: 270, height: 120, borderRadius: 12, background: "#0E1410", boxShadow: "inset 0 4px 10px rgba(0,0,0,0.8)",
              display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 2, whiteSpace: "nowrap",
              color: green ? "#5BE37D" : "#E25A4C", textShadow: green ? "0 0 14px #5BE37D" : "0 0 10px #E25A4C" }}>{green ? "SUSCRITO" : "SUSCRÍBASE"}</div>
            <div style={{ position: "absolute", left: 140, top: 190, width: 50, height: 50, borderRadius: 25, background: green ? "#3FD267" : blink ? "#F04A3A" : "#7A2A22",
              boxShadow: green ? "0 0 40px #3FD267" : blink ? "0 0 18px #F04A3A" : "none" }} />
            <div style={{ position: "absolute", left: 45, top: 280, width: 240, height: 22, borderRadius: 11, background: "#1A140C", boxShadow: "inset 0 3px 6px rgba(0,0,0,0.9)" }} />
            {/* manija: baja 30° */}
            <div style={{ position: "absolute", left: -190, top: 440, width: 360, height: 74, borderRadius: 37, background: brass, boxShadow: "0 14px 26px rgba(0,0,0,0.5)",
              transformOrigin: "323px 37px", transform: `rotate(${-handle}deg)` }} />
            <div style={{ position: "absolute", left: 110, top: 430, width: 94, height: 94, borderRadius: 47, background: brass, boxShadow: "0 6px 14px rgba(0,0,0,0.5)" }} />
            {/* tarjeta blanca 412: lo que entró queda tapado por la ranura */}
            <div style={{ position: "absolute", left: 55, top: 291 - 420, width: 220, height: 420, overflow: "hidden", perspective: 900 }}>
              <div style={{ position: "absolute", left: 0, top: 70, width: 220, height: 320, transform: `translate(${cardX}px, ${cardY}px) rotateY(${cardRot}deg)`, borderRadius: 16,
                background: `linear-gradient(160deg, #FFFFFF 0%, ${CL.white} 60%, #E9E2D3 100%)`, boxShadow: "0 18px 30px rgba(0,0,0,0.5)", border: `3px solid ${CL.brass}`,
                display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 26 }}>
                <div style={{ fontFamily: LABEL, fontWeight: 500, fontSize: 22, letterSpacing: 5, color: CL.brass }}>HABITACIÓN</div>
                <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: CL.navy, lineHeight: 1 }}>412</div>
                <div style={{ width: 160, height: 20, background: "#1A1A1A", marginTop: 26, borderRadius: 3 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AbsoluteFill style={{ background: "#BFFFD0", opacity: flash }} />
    </AbsoluteFill>
  );
};

// 3a) RECADO EN EL CASILLERO (v=1): casillero de llaves de madera en el tercio inferior; el recado rosa cae desde
// arriba, entra torcido en su casilla y un sello rojo "COMENTARIOS" lo golpea. Una sola línea, letra grande.
// 3b) LIBRO DE HUÉSPEDES (v=2): el libro de recepción entra desde la izquierda, una pluma escribe la pregunta
// a mano (revelado de izquierda a derecha) y al final se arranca la hoja.
export const PhoneMessage: React.FC<{ text: string; v?: number; dur: number }> = ({ text, v = 1, dur }) => {
  const f = useCurrentFrame();
  if (v === 2) {
    const o = fadeOut(f, dur, 12);
    const inn = spring({ frame: f, fps: 30, config: { damping: 16 } });
    const W0 = 18, W1 = W0 + Math.round(text.length * 1.3);
    const p = interpolate(f, [W0, W1], [0, 1], K);
    const tear = interpolate(f, [dur - 26, dur - 12], [0, 1], { ...K, easing: Easing.in(Easing.quad) });
    return (
      <AbsoluteFill style={{ opacity: o }}>
        <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(19,29,53,0.55) 0%, rgba(19,29,53,0) 45%)" }} />
        <div style={{ position: "absolute", left: 90, top: 690, width: 1180, height: 380, transform: `translateX(${(1 - inn) * -1300}px) rotate(-2deg)` }}>
          <div style={{ position: "absolute", left: -20, top: -16, right: -20, bottom: -24, borderRadius: 14, background: "linear-gradient(180deg, #7A2E26, #5A1F19)", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }} />
          <div style={{ position: "absolute", inset: 0, background: CL.white, borderRadius: 6, transformOrigin: "0% 100%",
            transform: `rotate(${tear * -9}deg) translateY(${tear * -40}px) scale(${1 + tear * 0.05})`,
            backgroundImage: "repeating-linear-gradient(0deg, transparent 0 74px, #C9D3E6 74px 77px)", boxShadow: tear > 0 ? "0 20px 40px rgba(0,0,0,0.4), inset 0 0 40px rgba(120,100,70,0.22)" : "inset 0 0 40px rgba(120,100,70,0.22), inset 0 -6px 0 rgba(0,0,0,0.06)" }}>
            <div style={{ position: "absolute", left: 40, top: 22, fontFamily: LABEL, fontWeight: 600, fontSize: 30, letterSpacing: 8, color: CL.brass }}>LIBRO DE HUÉSPEDES · RECEPCIÓN</div>
            <div style={{ position: "absolute", left: 40, top: 110, right: 40, fontFamily: HAND, fontWeight: 700, fontSize: 108, lineHeight: 1.1, color: CL.navy, whiteSpace: "nowrap",
              clipPath: `inset(-20px ${(1 - p) * 100}% -30px 0)` }}>{text}</div>
            <div style={{ position: "absolute", left: 40, top: 280, fontFamily: LABEL, fontWeight: 500, fontSize: 44, letterSpacing: 4, color: CL.ink, opacity: interpolate(f, [W1, W1 + 10], [0, 1], K) }}>CONTÉSTEME ABAJO, EN LOS COMENTARIOS</div>
          </div>
          {/* pluma */}
          <div style={{ position: "absolute", left: 40 + p * 1060, top: -40 + Math.sin(f / 2) * (p < 1 ? 6 : 0), width: 26, height: 210, transformOrigin: "50% 100%",
            transform: "rotate(28deg)", opacity: p > 0 && p < 1 ? 1 : 0 }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 26, height: 170, borderRadius: "13px 13px 4px 4px", background: "linear-gradient(90deg, #111, #3A3A3A, #111)" }} />
            <div style={{ position: "absolute", left: 0, top: 150, width: 26, height: 22, background: brass }} />
            <div style={{ position: "absolute", left: 3, top: 172, width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: `38px solid ${CL.brassLight}` }} />
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  const y = liftOut(f, dur, 12);
  const cub = spring({ frame: f, fps: 30, config: { damping: 18 } });
  const fall = interpolate(f, [8, 26], [-900, 0], { ...K, easing: Easing.in(Easing.quad) });
  const settle = f > 26 ? Math.sin((f - 26) / 2.2) * 5 * Math.exp(-(f - 26) / 8) : 0;
  const ST = 40;
  const st = interpolate(f, [ST, ST + 6], [2.6, 1], { ...K, easing: Easing.in(Easing.cubic) });
  const stO = interpolate(f, [ST, ST + 3], [0, 1], K);
  const shake = f >= ST + 6 && f < ST + 12 ? (f % 2 ? 4 : -4) : 0;
  const L = 260, T = 600, CW = 1400, CH = 440;
  return (
    <AbsoluteFill style={{ transform: `translateY(${y}px)` }}>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(19,29,53,0.6) 0%, rgba(19,29,53,0) 50%)" }} />
      <div style={{ position: "absolute", left: L, top: T, width: CW, height: CH, transform: `translateY(${(1 - cub) * 520 + shake}px)` }}>
        {/* casillero de llaves */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: "linear-gradient(180deg, #7A4E2C, #5A361E)", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }} />
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: 24 + i * 272, top: 26, width: 252, height: CH - 52, borderRadius: 6, background: "#2C1B10",
            boxShadow: "inset 0 14px 24px rgba(0,0,0,0.7)" }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", fontFamily: LABEL, fontWeight: 600, fontSize: 28, letterSpacing: 3, color: CL.brassLight }}>{410 + i}</div>
            {i !== 2 && <div style={{ position: "absolute", left: 110, top: 40, width: 34, height: 120, borderRadius: 6, background: brass, opacity: 0.9 }} />}
          </div>
        ))}
        {/* recado */}
        <div style={{ position: "absolute", left: 80, top: 30 + fall, width: 1240, height: 250, background: "#F9DDE2", borderRadius: 6,
          transform: `rotate(${-2.5 + settle * 0.3}deg)`, boxShadow: "0 22px 40px rgba(0,0,0,0.5)", padding: "26px 44px" }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 32, letterSpacing: 6, color: "#A3324A", borderBottom: "3px solid #A3324A", paddingBottom: 8 }}>MIENTRAS USTED NO ESTABA · HAB. 412</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: text.length > 24 ? 54 : 64, color: CL.navy, marginTop: 34, whiteSpace: "nowrap", maxWidth: 1000 }}>{text}</div>
          <div style={{ position: "absolute", right: -30, top: -34, transform: `rotate(-12deg) scale(${st})`, opacity: stO, border: `7px solid ${CL.red}`, borderRadius: 10,
            padding: "4px 20px", fontFamily: LABEL, fontWeight: 700, fontSize: 34, letterSpacing: 5, color: CL.red, background: "rgba(249,221,226,0.7)" }}>COMENTARIOS</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 4) PERSIANA DEL REPASO: persiana real de 8 lamas sobre la foto de la habitación. Cerrada, cada lama da media
// vuelta en 3D al decir su número y en el reverso muestra la foto del paso, el número grande y el título.
// Al final todas las lamas giran en ola. Marcas ordenadas y separadas (nunca se salta un paso).
export const BlindRecap: React.FC<{ items: string[]; marks: number[]; srcs?: string[]; bg?: string; dur: number }> = ({ items, marks, srcs = [], bg, dur }) => {
  const f = useCurrentFrame();
  const y = liftOut(f, dur, 14);
  const N = items.length;
  const mk = [...marks].sort((a, b) => a - b);
  for (let i = 1; i < N; i++) mk[i] = Math.max(mk[i] ?? 0, (mk[i - 1] ?? 0) + 8);
  const H = 92, G = 5, top = (1080 - (N * H + (N - 1) * G)) / 2 + 30;
  const inn = interpolate(f, [0, 10], [0, 1], { ...K, easing: Easing.out(Easing.cubic) });
  const waveT = dur - 56; // la ola termina 14+14 cuadros antes del corte: último cuadro quieto
  return (
    <AbsoluteFill style={{ transform: `translateY(${y}px)` }}>
      <AbsoluteFill style={{ overflow: "hidden", background: CL.navyDeep }}>
        {bg && <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(6px) brightness(0.7)", transform: `scale(${interpolate(f, [0, dur], [1.08, 1.14])})` }} />}
      </AbsoluteFill>
      {/* marco de ventana y riel */}
      <div style={{ position: "absolute", left: 200, top: top - 80, width: 1520, height: N * (H + G) + 104, borderRadius: 10, border: `22px solid ${CL.white}`,
        boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 0 0 4px #D8CFC1", transform: `scale(${0.96 + inn * 0.04})`, opacity: inn }} />
      <div style={{ position: "absolute", left: 230, top: top - 56, width: 1460, height: 46, borderRadius: 6, background: "linear-gradient(180deg, #FFFFFF, #DCD5C7)",
        boxShadow: "0 6px 12px rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 10, color: CL.navy, opacity: inn }}>REPASO · LOS 8 PASOS</div>
      {/* cordones (detrás de las lamas) */}
      {[420, 1500].map((x) => (
        <div key={x} style={{ position: "absolute", left: x, top: top - 10, width: 5, height: N * (H + G) + 30, background: "linear-gradient(90deg, #BDB3A0, #E6DFD0, #BDB3A0)", opacity: inn * 0.8 }} />
      ))}
      {items.map((t, i) => {
        const m = mk[i];
        const drop = interpolate(f, [i * 3, i * 3 + 12], [0, 1], { ...K, easing: Easing.out(Easing.cubic) });
        let a = interpolate(f, [m - 6, m + 8], [0, 180], { ...K, easing: Easing.inOut(Easing.cubic) });
        if (f >= waveT) a += interpolate(f, [waveT + i * 2, waveT + i * 2 + 14], [0, 360], { ...K, easing: Easing.inOut(Easing.cubic) });
        const back = Math.cos((a * Math.PI) / 180) < 0;
        const face = back ? a - 180 : a;
        const lit = f >= m && f < m + 30;
        return (
          <div key={i} style={{ position: "absolute", left: 250, top: top + i * (H + G), width: 1420, height: H, perspective: 1600,
            transform: `translateY(${(1 - drop) * -(i + 1) * (H + G)}px)`, opacity: drop }}>
            <div style={{ position: "absolute", inset: 0, transform: `rotateX(${face}deg)`, borderRadius: 8, overflow: "hidden",
              boxShadow: lit ? `0 0 0 5px ${CL.yellow}, 0 10px 22px rgba(0,0,0,0.5)` : "0 6px 14px rgba(0,0,0,0.4)",
              background: back ? `linear-gradient(180deg, ${CL.white} 0%, #ECE6DA 100%)` : "linear-gradient(180deg, #F1ECE2 0%, #D9D1C1 55%, #C6BCA8 100%)" }}>
              {back ? (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", gap: 28, paddingLeft: 22 }}>
                  <div style={{ width: 78, height: 78, borderRadius: 39, background: CL.navy, color: CL.yellow, display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: SERIF, fontWeight: 900, fontSize: 52, flexShrink: 0 }}>{i + 1}</div>
                  {srcs[i] && <Img src={staticFile(srcs[i])} style={{ width: 196, height: 84, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />}
                  <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 58, color: CL.ink, whiteSpace: "nowrap" }}>{t}</div>
                </div>
              ) : (
                <div style={{ position: "absolute", left: 0, right: 0, top: "48%", height: 3, background: "rgba(0,0,0,0.08)" }} />
              )}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
