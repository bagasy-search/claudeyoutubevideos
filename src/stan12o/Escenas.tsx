// Escenas sobre fotos de stan12o (D:/rtmp/stan12o/ideas.md). Escritas de cero: sólo React y Remotion, sin SVG.
import React from "react";
import { FONTS } from "./Piezas";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const cover = (cx: number, cy: number, s: number) => Math.max(s, 960 / cx, 960 / (1920 - cx), 540 / cy, 540 / (1080 - cy), 1);
const cam = (cx: number, cy: number, s: number): React.CSSProperties => {
  const k = cover(cx, cy, s);
  return { transformOrigin: "0 0", transform: `translate(${960 - cx * k}px, ${540 - cy * k}px) scale(${k})` };
};
const damp = (t: number, tau: number, per: number) => (t <= 0 ? 0 : 1 - Math.exp(-t / tau) * Math.cos((t / per) * Math.PI * 2));
const seg = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...CL, easing: io });
const GREASE = "#1b1714";

// papel blanco de carnicería con letra a mano, en coordenadas de pantalla
const Papel: React.FC<{ x: number; y: number; t: string; f0: number; size?: number; rot?: number }> = ({ x, y, t, f0, size = 110, rot = -2 }) => {
  const f = useCurrentFrame(); const p = f < f0 ? 0 : Math.min(1, damp(f - f0, 5, 22));
  return <div style={{ position: "absolute", left: x, top: y, padding: "4px 30px 12px", backgroundImage: "linear-gradient(180deg, #FFFDF4 0%, #F3EBD6 100%)", fontFamily: FONTS.HAND, fontWeight: 700, fontSize: size, lineHeight: 1.05, color: "#2A1A12", whiteSpace: "nowrap",
    boxShadow: "0 12px 22px rgba(0,0,0,0.45)", opacity: Math.min(1, p * 2), transform: `rotate(${rot}deg) scale(${p})`, transformOrigin: "0 50%" }}>{t}</div>;
};

// ── Escena 1 · la ruta: la cámara viaja pegada a la veta principal real (560,130 → 900,470 → 1250,700 → 1700,960) y el contraste sube para que las líneas blancas resalten
export const EscRuta: React.FC<{ src: string; fMap: number; fPoint: number; dur: number }> = ({ src, fMap, fPoint, dur }) => {
  const f = useCurrentFrame();
  const P = [[560, 130], [900, 470], [1250, 700], [1700, 960]];
  const u = seg(f, 6, dur - 10) * 3, i = Math.min(2, Math.floor(u)), t = u - i;
  const cx = lerp(P[i][0], P[i + 1][0], t), cy = lerp(P[i][1], P[i + 1][1], t);
  const pop = seg(f, fMap - 8, fMap + 10);
  const s = lerp(1.25, 1.9, seg(f, 0, 40)) - 0.5 * seg(f, fPoint, dur);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#2a1a12" }}>
      <AbsoluteFill style={cam(cx, cy, s)}>
        <Img src={staticFile(src)} style={{ ...FULL, filter: `contrast(${1 + 0.28 * pop}) saturate(${1 + 0.18 * pop})` }} />
        {[0, 1, 2].map((k) => { const g = Math.max(0, Math.min(1, u - k)); const dx = P[k + 1][0] - P[k][0], dy = P[k + 1][1] - P[k][1];
          return <div key={k} style={{ position: "absolute", left: P[k][0], top: P[k][1] - 5, width: Math.hypot(dx, dy) * g, height: 10, borderRadius: 5, background: "#D9372C", boxShadow: "0 0 0 3px rgba(255,255,255,0.75)", transformOrigin: "0 50%", transform: `rotate(${Math.atan2(dy, dx) * 180 / Math.PI}deg)` }} />; })}
        <div style={{ position: "absolute", left: cx - 22, top: cy - 22, width: 44, height: 44, borderRadius: "50%", background: "radial-gradient(circle at 34% 30%, #FF9A8C 0%, #B3261E 45%, #5E0F0A 100%)", boxShadow: "6px 9px 10px rgba(0,0,0,0.45)" }} />
      </AbsoluteFill>
      <Papel x={980} y={110} t="like a road map" f0={fMap} size={116} rot={2} />
    </AbsoluteFill>
  );
};

// ── Escena 2 · los paquetes: el paquete real (590,345 a 1320,865) se multiplica hacia los costados y cada uno recibe su día a lápiz graso
export const EscPaquetes: React.FC<{ src: string; fDays: number[]; dur: number }> = ({ src, fDays, dur }) => {
  const f = useCurrentFrame();
  const BOX = "polygon(585px 340px, 1325px 340px, 1325px 870px, 585px 870px)";
  const DAYS = ["Sunday", "Tuesday", "Thursday"], DX = [-640, 0, 640];
  const T0 = [Math.max(0, fDays[0] - 14), 0, Math.max(0, fDays[0] + 4)];
  const out = (i: number) => (i === 1 ? 0 : damp(f - T0[i], 6, 30) * (f >= T0[i] ? 1 : 0));
  const s = lerp(1.0, 0.86, seg(f, 0, Math.max(10, fDays[1])));
  const ORD = [1, 0, 2];
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#3a4038" }}>
      <Img src={staticFile(src)} style={{ ...FULL, transform: "scale(1.5)", filter: "brightness(0.5)" }} />
      <AbsoluteFill style={{ transform: `scale(${s + 0.04 * (f / dur)})`, transformOrigin: "50% 56%" }}>
        <Img src={staticFile(src)} style={FULL} />
        {ORD.map((i) => {
          const x = DX[i] * Math.min(1.03, out(i));
          if (i !== 1 && f < T0[i]) return null;
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${x}px) rotate(${i === 1 ? 0 : (i - 1) * 2.5 * Math.min(1, out(i))}deg)`, transformOrigin: "955px 605px" }}>
              {i !== 1 && <Img src={staticFile(src)} style={{ ...FULL, clipPath: BOX }} />}
              <div style={{ position: "absolute", left: 640, top: 500, width: 640, textAlign: "center", fontFamily: FONTS.HAND, fontWeight: 700, fontSize: 150, lineHeight: 1, color: GREASE, whiteSpace: "nowrap", transform: "rotate(-4deg)",
                clipPath: `inset(-20% ${100 - seg(f, Math.min(fDays[i], dur - 26), Math.min(fDays[i], dur - 26) + 10) * 115}% -20% 0)` }}>{DAYS[i]}</div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Escena 3 · la espada: el hueso real (893,288 a 994,475), recortado, sube y sale del cuadro; donde estaba queda un parche de la misma foto corrida
export const EscEspada: React.FC<{ src: string; fPull: number; dur: number }> = ({ src, fPull, dur }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const BONE = "polygon(886px 280px, 1000px 280px, 1004px 478px, 884px 478px)";
  const tug = f < fPull ? Math.sin(f / 3) * 3 * seg(f, fPull - 24, fPull) : 0;
  const up = seg(f, fPull, fPull + Math.min(70, Math.max(30, dur - fPull - 30)));
  const y = -300 * up;
  const s = lerp(1.25, 1.55, seg(f, 0, fPull)) - 0.2 * seg(f, fPull + 6, dur);
  const cy = lerp(520, 400, seg(f, 0, fPull)) + 60 * seg(f, fPull + 6, dur);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#2a2a28" }}>
      <AbsoluteFill style={cam(960, cy, s)}>
        <Img src={staticFile(src)} style={FULL} />
        {/* parche: la misma foto corrida 135 px tapa el hueco del hueso (azulejo arriba, carne abajo) */}
        {f >= fPull - 1 && <Img src={staticFile(src)} style={{ ...FULL, transform: "translateX(-135px)", clipPath: "polygon(1013px 270px, 1143px 270px, 1147px 492px, 1011px 492px)", opacity: Math.min(1, up * 12) }} />}
        <Img src={staticFile(src)} style={{ ...FULL, transform: `translate(${tug + 150 * up}px, ${y}px) rotate(${up * 16}deg)`, transformOrigin: "945px 470px", clipPath: BONE, filter: `drop-shadow(0 ${18 * up}px ${14 * up}px rgba(0,0,0,0.5))` }} />
      </AbsoluteFill>
      <Papel x={1250} y={150} t="out clean" f0={fPull + 30} size={150} rot={3} />
    </AbsoluteFill>
  );
};

// ── Escena 4 · las capas: la capa de arriba del frasco real (800,461 a 1115,500) se levanta como una tapa y la de abajo tiembla como gelatina; cada una recibe su nombre
export const EscCapas: React.FC<{ src: string; fFat: number; fJelly: number; fGood: number; dur: number }> = ({ src, fFat, fJelly, fGood, dur }) => {
  const f = useCurrentFrame();
  const lift = damp(f - fFat, 7, 34) * (f >= fFat ? 1 : 0);
  const wob = f >= fJelly ? Math.sin((f - fJelly) / 2.2) * 4.5 * Math.exp(-(f - fJelly) / 40) : 0;
  const s = lerp(1.2, 1.7, seg(f, 0, Math.max(12, fFat))) + 0.06 * (f / dur);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#2a2a28" }}>
      <AbsoluteFill style={cam(1000, 590, s)}>
        <Img src={staticFile(src)} style={FULL} />
        {/* cuerpo ámbar: tiembla */}
        <Img src={staticFile(src)} style={{ ...FULL, clipPath: "polygon(800px 500px, 1116px 500px, 1116px 905px, 800px 905px)", transformOrigin: "958px 905px", transform: `skewX(${wob}deg)` }} />
        {/* la capa de arriba: se levanta */}
        <Img src={staticFile(src)} style={{ ...FULL, clipPath: "polygon(798px 452px, 1118px 452px, 1118px 502px, 798px 502px)", transform: `translateY(${-150 * Math.min(1.05, lift)}px)`, filter: "drop-shadow(0 16px 10px rgba(0,0,0,0.45))" }} />
      </AbsoluteFill>
      <Papel x={1230} y={250} t="fat · fry in it" f0={fFat + 8} size={104} rot={2} />
      <Papel x={1230} y={600} t="jelly · the flavor" f0={fJelly + 4} size={104} rot={-2} />
    </AbsoluteFill>
  );
};

// ── Escena 5 · el pimentón: la cámara va de la lata (196,763) a la boca de la olla (elipse 1330,430 · 300×95) y la cebolla real se tiñe de rojo desde el centro
export const EscPimenton: React.FC<{ src: string; fStir: number; fOff: number; dur: number }> = ({ src, fStir, fOff, dur }) => {
  const f = useCurrentFrame();
  const go = seg(f, 10, Math.max(30, fStir));
  const cx = lerp(520, 1330, go), cy = lerp(640, 470, go), s = lerp(1.35, 1.75, go) + 0.08 * seg(f, fStir, dur);
  const red = seg(f, fStir, fStir + 50);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#2a2a28" }}>
      <AbsoluteFill style={cam(cx, cy, s)}>
        <Img src={staticFile(src)} style={FULL} />
        <div style={{ position: "absolute", left: 1330 - 290 * red, top: 430 - 88 * red, width: 580 * red, height: 176 * red, borderRadius: "50%", mixBlendMode: "multiply",
          background: "radial-gradient(ellipse at 50% 50%, rgba(170,44,22,0.92) 0%, rgba(176,52,26,0.8) 60%, rgba(176,52,26,0) 100%)" }} />
      </AbsoluteFill>
      <Papel x={140} y={120} t="off the heat" f0={6} size={124} rot={-2} />
      <Papel x={140} y={880} t="or it turns bitter" f0={fOff + 20} size={104} rot={2} />
    </AbsoluteFill>
  );
};
