// Piezas propias de Stan the Butcher · look "papel de carnicero y pizarra de precios".
// PURO CSS y DOM: azulejo, papel rosa de carnicero, pizarra, madera y acero hechos con gradientes. Sin SVG, sin texturas PNG, sin blur.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { FONTS, useKB } from "./Piezas";

const { SERIF, SANS, HAND } = FONTS;
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);
export const K = { paper: "#EDC2AE", paper2: "#E2AE97", white: "#FAF7F0", ink: "#2A1A12", red: "#B3261E", slate: "#1E2420", chalk: "#F3F0E6", steel: "#B9BEC2", wood: "#7A4E2B", tile: "#F2EFE7" };
const fadeIO = (f: number, dur: number, a = 8, b = 8) => interpolate(f, [0, a, dur - b, dur], [0, 1, 1, 0], CL);

// ---------- materiales
export const TileWall: React.FC<{ dur: number; seed?: number; children?: React.ReactNode }> = ({ dur, seed = 0, children }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, dur], [seed % 2 ? -18 : 18, seed % 2 ? 18 : -18]);
  const s = interpolate(f, [0, dur], [1.04, 1.09]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.tile }}>
      <AbsoluteFill style={{ transform: `translateX(${x}px) scale(${s})`,
        backgroundImage: `linear-gradient(rgba(96,92,84,0.42) 4px, transparent 4px), linear-gradient(90deg, rgba(96,92,84,0.42) 4px, transparent 4px), linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 38%), linear-gradient(170deg, #F7F4EC 0%, #E4DFD2 100%)`,
        backgroundSize: "172px 172px, 172px 172px, 172px 172px, 100% 100%" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 1300px 760px at 32% 30%, rgba(255,250,235,0.55), rgba(255,250,235,0) 70%)" }} />
      {children}
    </AbsoluteFill>
  );
};

const paperBg = `linear-gradient(98deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 22%, rgba(120,60,40,0.07) 61%, rgba(255,255,255,0.1) 100%), linear-gradient(180deg, ${K.paper} 0%, ${K.paper2} 100%)`;
const woodBg = `repeating-linear-gradient(92deg, rgba(40,20,8,0.16) 0px, rgba(40,20,8,0) 7px, rgba(255,220,170,0.07) 13px, rgba(40,20,8,0.12) 23px), linear-gradient(180deg, #8A5A33 0%, #6B4224 100%)`;

const Tape: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div style={{ position: "absolute", width: 150, height: 44, background: "linear-gradient(180deg, rgba(246,238,205,0.92), rgba(228,216,170,0.92))", boxShadow: "0 3px 8px rgba(0,0,0,0.22)", ...style }} />
);

// escritura a mano: el texto aparece de izquierda a derecha desde el cuadro f0
const Write: React.FC<{ f0: number; len?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f0, len = 14, children, style }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [f0, f0 + len], [0, 1], { ...CL, easing: ease });
  return <div style={{ clipPath: `inset(-20% ${100 - p * 100}% -20% 0)`, ...style }}>{children}</div>;
};

// ---------- apertura de capítulo: la foto del corte a pantalla completa y la etiqueta de precio que se clava y se da vuelta
export const PriceTag: React.FC<{ n: number; total: number; name: string; img: string; fName: number; dur: number; seed: number }> = ({ n, total, name, img, fName, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const kb = useKB(seed, dur);
  const drop = spring({ frame: f - 3, fps, config: { damping: 13, mass: 0.9 } });
  const flip = spring({ frame: f - fName, fps, config: { damping: 15, mass: 0.8 } });
  const rot = interpolate(flip, [0, 1], [0, 180]);
  const back = rot > 90;
  const sway = Math.sin(f / 19) * 1.2 * (1 - 0.5 * flip);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}>
      <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
      <div style={{ position: "absolute", left: 1010, top: 250, width: 760, height: 700, perspective: 1600, transform: `translateY(${(1 - drop) * -900}px) rotate(${-3 + sway}deg)`, transformOrigin: "50% 100%" }}>
        {/* pincho de acero */}
        <div style={{ position: "absolute", left: 372, top: 360, width: 16, height: 420, borderRadius: 8, background: "linear-gradient(90deg, #6F757A 0%, #E9EDF0 45%, #8B9196 100%)", boxShadow: "8px 10px 16px rgba(0,0,0,0.35)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 760, height: 430, transformStyle: "preserve-3d", transform: `rotateY(${rot}deg)` }}>
          <div style={{ position: "absolute", inset: 0, background: K.white, borderRadius: 14, border: `10px solid ${K.red}`, boxShadow: "0 26px 50px rgba(0,0,0,0.45)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            transform: back ? "rotateY(180deg)" : "none" }}>
            {!back ? (
              <>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 12, color: K.red }}>CUT</div>
                <div style={{ fontFamily: SERIF, fontSize: 210, lineHeight: 0.95, color: K.ink }}>{n}</div>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 34, letterSpacing: 10, color: K.ink, opacity: 0.7 }}>OF {total}</div>
              </>
            ) : (
              <>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 9, color: K.red }}>CUT {n} OF {total}</div>
                <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: name.length > 12 ? 118 : 150, lineHeight: 1, color: K.ink, marginTop: 14, textAlign: "center", padding: "0 30px" }}>{name}</div>
                <div style={{ width: 420, height: 6, background: K.red, marginTop: 18, borderRadius: 3, transform: `scaleX(${interpolate(f, [fName + 8, fName + 22], [0, 1], CL)})`, transformOrigin: "0 50%" }} />
              </>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- el mapa de la res: la chapa esmaltada de la pared, la cámara va al corte y se clava la chinche
export const CowChart: React.FC<{ src: string; cx: number; cy: number; label: string; sub: string; fPin: number; dur: number }> = ({ src, cx, cy, label, sub, fPin, dur }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const t = interpolate(f, [0, Math.min(dur, 70)], [0, 1], { ...CL, easing: ease });
  const sc = 1.02 + 0.5 * t + 0.04 * (f / dur);
  const pin = spring({ frame: f - fPin, fps, config: { damping: 9, mass: 0.6 } });
  const lab = spring({ frame: f - fPin - 6, fps, config: { damping: 16 } });
  const right = cx < 1000;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.tile, opacity: fadeIO(f, dur, 5, 6) }}>
      <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: `${cx}px ${cy}px` }}>
        <Img src={staticFile(src)} style={{ width: 1920, height: 1080, objectFit: "fill" }} />
        <div style={{ position: "absolute", left: cx - 26, top: cy - 26 - (1 - Math.min(1, pin)) * 300, width: 52, height: 52, borderRadius: "50%", opacity: Math.min(1, pin * 3),
          background: "radial-gradient(circle at 34% 30%, #FFE9A8 0%, #D9A13A 38%, #8A5A12 100%)", boxShadow: `${10 * pin}px ${14 * pin}px 14px rgba(0,0,0,0.45)` }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", [right ? "right" : "left"]: 110, bottom: 110, transform: `translateY(${(1 - lab) * 160}px) rotate(${right ? 2 : -2}deg)`, opacity: lab,
        backgroundImage: paperBg, padding: "30px 52px 34px", boxShadow: "0 22px 44px rgba(0,0,0,0.4)", maxWidth: 900 } as React.CSSProperties}>
        <Tape style={{ left: "50%", marginLeft: -75, top: -22, transform: "rotate(-3deg)" }} />
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 96, lineHeight: 1, color: K.ink }}>{label}</div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 4, color: K.red, marginTop: 10 }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- pizarra de precios con el dato y su fuente
export type BLine = { t: string; f: number; big?: boolean; red?: boolean };
export const ChalkBoard: React.FC<{ head: string; lines: BLine[]; source: string; dur: number; seed: number }> = ({ head, lines, source, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inn = spring({ frame: f, fps, config: { damping: 17, mass: 0.9 } });
  const sc = interpolate(f, [0, dur], [1, 1.05]);
  return (
    <TileWall dur={dur} seed={seed}>
      <AbsoluteFill style={{ opacity: fadeIO(f, dur, 4, 7), perspective: 1800 }}>
        <div style={{ position: "absolute", left: 250, top: 110, width: 1420, height: 860, transform: `translateY(${(1 - inn) * -120}px) rotateX(${(1 - inn) * 14}deg) scale(${sc}) rotate(${seed % 2 ? 0.6 : -0.6}deg)`, opacity: inn,
          backgroundImage: woodBg, padding: 34, boxShadow: "0 40px 70px rgba(0,0,0,0.45), 0 4px 0 rgba(255,255,255,0.15) inset", borderRadius: 6 }}>
          <div style={{ position: "absolute", inset: 34, borderRadius: 3, boxShadow: "inset 0 0 0 3px rgba(0,0,0,0.5), inset 0 14px 30px rgba(0,0,0,0.5)",
            backgroundImage: `linear-gradient(104deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0.06) 52%, rgba(255,255,255,0) 80%), linear-gradient(180deg, #232B26 0%, ${K.slate} 100%)` }}>
            <div style={{ position: "absolute", left: 70, right: 70, top: 46, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 34, letterSpacing: 9, color: "rgba(243,240,230,0.82)" }}>{head}</div>
              <div style={{ fontFamily: HAND, fontSize: 40, color: "rgba(243,240,230,0.6)" }}>Stan's Meats · since 1961</div>
            </div>
            <div style={{ position: "absolute", left: 70, right: 70, top: 112, height: 3, background: "rgba(243,240,230,0.35)" }} />
            <div style={{ position: "absolute", left: 70, right: 70, top: 150 }}>
              {lines.map((l, i) => (
                <Write key={i} f0={l.f} len={l.big ? 20 : 14} style={{ fontFamily: HAND, fontWeight: 700, fontSize: l.big ? 170 : 84, lineHeight: l.big ? 1.02 : 1.18, color: l.red ? "#FF9D8A" : K.chalk, textShadow: "0 0 2px rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>{l.t}</Write>
              ))}
            </div>
            <div style={{ position: "absolute", left: 70, bottom: 36, fontFamily: SANS, fontWeight: 500, fontSize: 28, letterSpacing: 2, color: "rgba(243,240,230,0.72)", opacity: interpolate(f, [18, 30], [0, 1], CL) }}>{source}</div>
          </div>
          {/* repisa de la tiza */}
          <div style={{ position: "absolute", left: 20, right: 20, bottom: -18, height: 26, backgroundImage: woodBg, boxShadow: "0 10px 14px rgba(0,0,0,0.35)" }} />
          <div style={{ position: "absolute", left: 220, bottom: 6, width: 86, height: 16, borderRadius: 4, background: "linear-gradient(180deg,#FFFFFF,#D9D6CC)", transform: "rotate(-4deg)" }} />
        </div>
      </AbsoluteFill>
    </TileWall>
  );
};

// ---------- la libreta de pedidos: el ranking se va escribiendo a lo largo del video
export type PadRow = { name: string; score: string };
export const OrderPad: React.FC<{ rows: PadRow[]; n: number; fScore: number; dur: number; seed: number }> = ({ rows, n, fScore, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inn = spring({ frame: f, fps, config: { damping: 18 } });
  const LH = 62;
  // la cámara baja hasta el renglón que se está escribiendo
  const y = interpolate(inn, [0, 1], [120, 0]) - Math.max(0, n - 7) * LH * 0.9;
  const sc = interpolate(f, [0, dur], [1.16, 1.22]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundImage: woodBg, opacity: fadeIO(f, dur, 4, 6) }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 1200px 700px at 40% 35%, rgba(255,225,170,0.22), rgba(0,0,0,0) 70%)" }} />
      <div style={{ position: "absolute", left: 460, top: 70, width: 1000, height: 1180, transform: `translateY(${y}px) rotate(${-2.2 + inn * 0.8}deg) scale(${sc})`, transformOrigin: `50% ${120 + n * LH}px`,
        background: "linear-gradient(180deg, #FFFDF6 0%, #F6F1E2 100%)", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", borderRadius: 4 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 86, background: `linear-gradient(180deg, ${K.red}, #8E1D17)`, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 8, color: "#FFF4E6" }}>STAN'S MEATS · CHICAGO · SINCE 1961</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 86, bottom: 0, backgroundImage: `repeating-linear-gradient(180deg, transparent 0px, transparent ${LH - 2}px, rgba(70,110,170,0.3) ${LH - 2}px, rgba(70,110,170,0.3) ${LH}px)`, backgroundPosition: "0 44px" }} />
        <div style={{ position: "absolute", left: 96, top: 86, bottom: 0, width: 3, background: "rgba(179,38,30,0.4)" }} />
        <div style={{ position: "absolute", left: 120, right: 60, top: 100, fontFamily: HAND, fontWeight: 700, fontSize: 40, color: "rgba(42,26,18,0.55)" }}>Cheap steaks, still good — my honest score</div>
        {rows.slice(0, n).map((r, i) => {
          const cur = i === n - 1;
          return (
            <div key={i} style={{ position: "absolute", left: 40, right: 60, top: 156 + i * LH, height: LH, display: "flex", alignItems: "baseline", fontFamily: HAND, fontWeight: 700, fontSize: 54, color: cur ? K.ink : "rgba(42,26,18,0.5)" }}>
              <div style={{ width: 62, textAlign: "right", marginRight: 24, color: K.red, opacity: cur ? 1 : 0.6 }}>{i + 1}</div>
              {cur ? <Write f0={4} len={16} style={{ flex: 1 }}>{r.name}</Write> : <div style={{ flex: 1 }}>{r.name}</div>}
              {cur ? <Write f0={fScore} len={10} style={{ color: K.red, fontSize: 64 }}>{r.score}</Write> : <div>{r.score}</div>}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- cartel de bloque (From the counter): el número de turno que se arranca
export const CounterCard: React.FC<{ title: string; sub: string; dur: number; seed: number }> = ({ title, sub, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: f, fps, config: { damping: 12, mass: 0.7 } });
  const tear = interpolate(f, [10, 24], [0, 1], { ...CL, easing: ease });
  return (
    <TileWall dur={dur} seed={seed}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: fadeIO(f, dur, 4, 7) }}>
        {/* rollo de turnos */}
        <div style={{ position: "absolute", left: 860, top: -40, width: 200, height: 260, borderRadius: "0 0 100px 100px", background: `linear-gradient(90deg, #7A1410 0%, ${K.red} 40%, #E0584E 55%, #7A1410 100%)`, boxShadow: "0 16px 30px rgba(0,0,0,0.35)" }} />
        <div style={{ width: 1040, padding: "70px 60px 80px", background: "linear-gradient(180deg,#FFFDF4,#F3EBD6)", boxShadow: "0 30px 60px rgba(0,0,0,0.4)", textAlign: "center",
          transform: `translateY(${interpolate(tear, [0, 1], [-200, 60])}px) rotate(${interpolate(tear, [0, 1], [0, -2.5])}deg) scale(${0.9 + 0.1 * p})`,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 96% 97%, 92% 100%, 88% 97%, 84% 100%, 80% 97%, 76% 100%, 72% 97%, 68% 100%, 64% 97%, 60% 100%, 56% 97%, 52% 100%, 48% 97%, 44% 100%, 40% 97%, 36% 100%, 32% 97%, 28% 100%, 24% 97%, 20% 100%, 16% 97%, 12% 100%, 8% 97%, 4% 100%, 0 97%)" }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 34, letterSpacing: 12, color: K.red }}>{sub}</div>
          <div style={{ fontFamily: SERIF, fontSize: 130, lineHeight: 1.02, color: K.ink, marginTop: 16 }}>{title}</div>
        </div>
      </AbsoluteFill>
    </TileWall>
  );
};

// ---------- regla: una hoja de papel de carnicero arrancada del rollo y pegada al azulejo
export const RuleSheet: React.FC<{ n: number; title: string; sub: string; fSub: number; dur: number; seed: number }> = ({ n, title, sub, fSub, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: f, fps, config: { damping: 14, mass: 0.9 } });
  const side = n % 2 ? -1 : 1;
  return (
    <TileWall dur={dur} seed={seed + n}>
      <AbsoluteFill style={{ opacity: fadeIO(f, dur, 3, 7), perspective: 1500 }}>
        <div style={{ position: "absolute", left: 300 + side * 40, top: 150, width: 1320, height: 780, backgroundImage: paperBg, boxShadow: "0 28px 56px rgba(0,0,0,0.35)",
          transform: `translateX(${(1 - p) * side * 700}px) rotate(${side * (2.4 - p * 1.2)}deg) rotateY(${(1 - p) * side * -30}deg) scale(${interpolate(f, [0, dur], [1, 1.04])})`,
          clipPath: "polygon(0 2%, 3% 0, 7% 2%, 12% 0, 18% 1.6%, 25% 0, 31% 2%, 38% 0.4%, 45% 2%, 52% 0, 59% 1.8%, 66% 0, 73% 2%, 80% 0.5%, 87% 2%, 94% 0, 100% 1.5%, 100% 100%, 0 100%)" }}>
          <div style={{ position: "absolute", left: 80, top: 70, fontFamily: SERIF, fontSize: 300, lineHeight: 0.8, color: K.red }}>{n}</div>
          <div style={{ position: "absolute", left: 330, right: 70, top: 110 }}>
            <Write f0={5} len={18} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 150, lineHeight: 1, color: K.ink }}>{title}</Write>
            <Write f0={fSub} len={20} style={{ fontFamily: HAND, fontSize: 88, lineHeight: 1.12, color: "rgba(42,26,18,0.88)", marginTop: 36 }}>{sub}</Write>
          </div>
        </div>
        <Tape style={{ left: 880, top: 126, transform: `rotate(${side * 3}deg)`, opacity: p }} />
      </AbsoluteFill>
    </TileWall>
  );
};

// ---------- repaso: la foto del corte entera y el papel que se desenrolla por abajo con su dato clave
export const RecapItem: React.FC<{ n: number; total: number; name: string; fact: string; fFact: number; img: string; dur: number; seed: number }> = ({ n, total, name, fact, fFact, img, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const kb = useKB(seed + 7, dur);
  const roll = spring({ frame: f - 2, fps, config: { damping: 18, mass: 0.8 } });
  const W = 1920 * roll;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}>
      <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
      <div style={{ position: "absolute", left: 0, bottom: 70, width: W, height: 250, overflow: "hidden", backgroundImage: paperBg, boxShadow: "0 -10px 30px rgba(0,0,0,0.35), 0 14px 30px rgba(0,0,0,0.35)" }}>
        <div style={{ position: "absolute", left: 70, top: 22, width: 1780, display: "flex", alignItems: "center" }}>
          <div style={{ fontFamily: SERIF, fontSize: 190, lineHeight: 1, color: K.red, width: n > 9 ? 250 : 170 }}>{n}</div>
          <div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 104, lineHeight: 1, color: K.ink }}>{name}</div>
            <Write f0={fFact} len={22} style={{ fontFamily: HAND, fontSize: 70, lineHeight: 1.1, color: "rgba(42,26,18,0.9)", marginTop: 2, whiteSpace: "nowrap" }}>{fact}</Write>
          </div>
        </div>
      </div>
      {/* el rollo */}
      <div style={{ position: "absolute", left: W - 40, bottom: 56, width: 80, height: 278, borderRadius: 40, opacity: roll < 0.985 ? 1 : 0, background: `linear-gradient(90deg, #B98672 0%, ${K.paper} 40%, #F7D9CB 55%, #A9765F 100%)`, boxShadow: "12px 10px 20px rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", right: 70, top: 60, display: "flex", gap: 12 }}>
        {Array.from({ length: total }, (_, i) => <div key={i} style={{ width: 22, height: 22, borderRadius: "50%", background: i < n ? K.red : "rgba(255,255,255,0.55)", border: "3px solid #FFF8EE", boxShadow: "0 2px 6px rgba(0,0,0,0.4)" }} />)}
      </div>
    </AbsoluteFill>
  );
};

// ---------- CTA: la pregunta escrita en el papel donde se envuelve el corte
export const AskPaper: React.FC<{ kicker: string; text: string; img: string; dur: number; seed: number }> = ({ kicker, text, img, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const kb = useKB(seed + 3, dur);
  const p = spring({ frame: f, fps, config: { damping: 15, mass: 0.9 } });
  const st = spring({ frame: f - 34, fps, config: { damping: 8, mass: 0.5 } });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.ink, opacity: fadeIO(f, dur, 4, 8) }}>
      <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
      <div style={{ position: "absolute", left: 180, top: 170, width: 1560, minHeight: 640, backgroundImage: paperBg, boxShadow: "0 34px 70px rgba(0,0,0,0.5)", padding: "70px 90px", boxSizing: "border-box",
        transform: `translateY(${(1 - p) * 500}px) rotate(${-1.6 + p * 0.6}deg)` }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, letterSpacing: 10, color: K.red }}>{kicker}</div>
        <Write f0={8} len={46} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 104, lineHeight: 1.08, color: K.ink, marginTop: 26 }}>{text}</Write>
        <div style={{ position: "absolute", right: 80, bottom: 54, border: `6px solid ${K.red}`, outline: `2px solid ${K.red}`, outlineOffset: 5, borderRadius: 10, padding: "10px 30px", fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 8, color: K.red,
          transform: `rotate(-7deg) scale(${2.2 - 1.2 * Math.min(1, st)})`, opacity: Math.min(1, st * 2) }}>SUBSCRIBE</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- mapa de Chicago: la foto del plano viejo y las tres chinches que se clavan en su palabra
export type Pin = { x: number; y: number; label: string; f: number };
export const MapChi: React.FC<{ src: string; pins: Pin[]; dur: number }> = ({ src, pins, dur }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const last = pins[pins.length - 1];
  const sc = interpolate(f, [0, dur], [1.05, 1.42], { ...CL, easing: ease });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.ink, opacity: fadeIO(f, dur, 5, 7) }}>
      <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: `${last.x}px ${last.y}px` }}>
        <Img src={staticFile(src)} style={{ width: 1920, height: 1080, objectFit: "fill" }} />
        {pins.map((p, i) => {
          const s = spring({ frame: f - p.f, fps, config: { damping: 9, mass: 0.6 } });
          const nx = pins[i + 1];
          const len = nx ? Math.hypot(nx.x - p.x, nx.y - p.y) : 0, ang = nx ? Math.atan2(nx.y - p.y, nx.x - p.x) * 180 / Math.PI : 0;
          const grow = nx ? interpolate(f, [nx.f - 14, nx.f], [0, 1], { ...CL, easing: ease }) : 0;
          return (
            <React.Fragment key={i}>
              {nx && <div style={{ position: "absolute", left: p.x, top: p.y - 3, width: len * grow, height: 6, background: K.red, transformOrigin: "0 50%", transform: `rotate(${ang}deg)`, boxShadow: "0 3px 5px rgba(0,0,0,0.35)", borderRadius: 3 }} />}
              <div style={{ position: "absolute", left: p.x - 20, top: p.y - 20 - (1 - Math.min(1, s)) * 240, width: 40, height: 40, borderRadius: "50%", opacity: Math.min(1, s * 3),
                background: "radial-gradient(circle at 34% 30%, #FF9A8C 0%, #B3261E 45%, #5E0F0A 100%)", boxShadow: `${7 * s}px ${10 * s}px 10px rgba(0,0,0,0.45)` }} />
              <div style={{ position: "absolute", left: p.x + 34, top: p.y - 56, backgroundImage: paperBg, padding: "8px 24px", fontFamily: HAND, fontWeight: 700, fontSize: 62, color: K.ink, whiteSpace: "nowrap",
                boxShadow: "0 8px 16px rgba(0,0,0,0.35)", transform: `rotate(-2deg) scale(${Math.min(1, s)})`, transformOrigin: "0 50%", opacity: Math.min(1, s * 2) }}>{p.label}</div>
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
