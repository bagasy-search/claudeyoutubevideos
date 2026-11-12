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
        <div style={{ position: "absolute", left: 300, top: 762, width: 160, height: 34, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.5), rgba(0,0,0,0) 70%)", opacity: Math.min(1, drop), transform: `scale(${2 - Math.min(1, drop)})` }} />
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
  const sc = 1.02 + 0.5 * t + 0.16 * (f / dur);
  const pin = spring({ frame: f - fPin, fps, config: { damping: 9, mass: 0.6 } });
  const lab = spring({ frame: f - fPin - 6, fps, config: { damping: 16 } });
  const right = cx < 1000;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.tile, opacity: fadeIO(f, dur, 5, 6) }}>
      <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: `${cx}px ${cy}px` }}>
        <Img src={staticFile(src)} style={{ width: 1920, height: 1080, objectFit: "fill" }} />
        <div style={{ position: "absolute", left: cx - 210, top: cy - 150, width: 420, height: 300, borderRadius: "50%", mixBlendMode: "multiply", opacity: Math.min(1, pin) * (0.75 + 0.2 * Math.sin(f / 9)),
          background: "radial-gradient(ellipse at 50% 50%, rgba(179,38,30,0.78) 0%, rgba(179,38,30,0.55) 50%, rgba(179,38,30,0) 74%)", transform: `scale(${0.3 + 0.7 * Math.min(1, pin)})` }} />
        <div style={{ position: "absolute", left: cx - 26, top: cy - 26 - (1 - Math.min(1, pin)) * 300, width: 52, height: 52, borderRadius: "50%", opacity: Math.min(1, pin * 3),
          background: "radial-gradient(circle at 34% 30%, #FFE9A8 0%, #D9A13A 38%, #8A5A12 100%)", boxShadow: `${10 * pin}px ${14 * pin}px 14px rgba(0,0,0,0.45)` }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", [right ? "right" : "left"]: 110, bottom: 110, transform: `translateY(${(1 - lab) * 160}px) rotate(${right ? 2 : -2}deg)`, opacity: lab,
        backgroundImage: paperBg, padding: "30px 52px 34px", boxShadow: "0 22px 44px rgba(0,0,0,0.4)", maxWidth: 1500 } as React.CSSProperties}>
        <Tape style={{ left: "50%", marginLeft: -75, top: -22, transform: "rotate(-3deg)" }} />
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 156, lineHeight: 1, color: K.ink, whiteSpace: "nowrap" }}>{label}</div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 52, letterSpacing: 2, color: K.red, marginTop: 12, whiteSpace: "nowrap" }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- pizarra de precios con el dato y su fuente; a la derecha o abajo, un mecanismo que se mueve desde el primer cuadro
export type BLine = { t: string; f: number; big?: boolean; red?: boolean };
const CH = "rgba(243,240,230,0.9)";
const BoardViz: React.FC<{ kind: string; fBig: number; dur: number }> = ({ kind, fBig, dur }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  if (kind === "thermo") {
    // termómetro de aguja: el dial va de 100 a 200 °F en 270 grados; la aguja sube despacio y clava en 145 sobre la palabra
    const creep = interpolate(f, [8, fBig], [0, 0.72], { ...CL, easing: ease });
    const hit = spring({ frame: f - fBig, fps, config: { damping: 7, mass: 0.6 } });
    const v = 100 + 45 * (creep + (1 - 0.72) * hit) + (f > fBig + 30 ? Math.sin(f / 5) * 0.7 : 0);
    const ang = -135 + ((v - 100) / 100) * 270;
    const ticks = Array.from({ length: 21 }, (_, i) => i);
    return (
      <div style={{ position: "absolute", right: 60, top: 150, width: 470, height: 470, transformOrigin: "100% 0%", transform: "scale(1.24)" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `7px solid ${CH}`, boxShadow: "inset 0 0 0 14px rgba(243,240,230,0.07)" }} />
        {ticks.map((i) => {
          const a = -135 + i * 13.5, big = i % 2 === 0, is145 = i === 9;
          return <div key={i} style={{ position: "absolute", left: 235 - 3, top: 26, width: is145 ? 9 : 6, height: big ? 40 : 22, background: is145 ? "#FF9D8A" : CH, transformOrigin: `3px ${235 - 26}px`, transform: `rotate(${a}deg)`, borderRadius: 3 }} />;
        })}
        {[100, 120, 140, 160, 180, 200].map((n, i) => {
          const a = (-135 + i * 54 - 90) * Math.PI / 180;
          return <div key={n} style={{ position: "absolute", left: 235 + Math.cos(a) * 150 - 50, top: 235 + Math.sin(a) * 150 - 26, width: 100, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 58, color: CH }}>{n}</div>;
        })}
        <div style={{ position: "absolute", left: 235 - 7, top: 60, width: 14, height: 205, background: "linear-gradient(180deg,#FF9D8A,#FF7A62)", transformOrigin: "7px 175px", transform: `rotate(${ang}deg)`, borderRadius: "7px 7px 3px 3px", boxShadow: "3px 4px 6px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", left: 235 - 22, top: 235 - 22, width: 44, height: 44, borderRadius: "50%", background: CH }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 318, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 6, color: "rgba(243,240,230,0.75)" }}>°F</div>
      </div>
    );
  }
  if (kind === "tally") {
    // palotes de tiza de a cinco: la manada. Se van borrando de derecha a izquierda hasta quedar pocos sobre la palabra
    const G = 12, step = Math.max(1, (fBig - 14) / G);
    return (
      <div style={{ position: "absolute", left: 70, right: 70, bottom: 96, height: 120, display: "flex", gap: 34 }}>
        {Array.from({ length: G }, (_, g) => {
          const o = g < 4 ? 1 : interpolate(f, [20 + (G - g) * step, 34 + (G - g) * step], [1, 0.1], CL);
          const born = interpolate(f, [4 + g * 1.2, 10 + g * 1.2], [0, 1], CL);
          return (
            <div key={g} style={{ position: "relative", width: 70, height: 110, opacity: o * born }}>
              {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 6 + i * 16, top: 6, width: 7, height: 98, background: CH, borderRadius: 4, transform: `rotate(${(i % 2 ? 2 : -3)}deg)` }} />)}
              <div style={{ position: "absolute", left: -6, top: 50, width: 84, height: 7, background: CH, borderRadius: 4, transform: "rotate(-28deg)" }} />
            </div>
          );
        })}
      </div>
    );
  }
  // flecha de tiza que trepa hasta pegar contra el marco de arriba
  const up = interpolate(f, [10, fBig], [0.12, 1], { ...CL, easing: Easing.in(Easing.quad) });
  const d = interpolate(f, [fBig, fBig + 16], [0, 1], CL);
  const pop = f >= fBig ? 1 + 0.3 * (1 - d) : 1;
  const H = 400 * up;
  return (
    <div style={{ position: "absolute", right: 150, bottom: 110, width: 200, height: 560 }}>
      {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: -260, right: -40, bottom: i * 120, height: 3, background: "rgba(243,240,230,0.16)" }} />)}
      <div style={{ position: "absolute", left: 88, bottom: 0, width: 24, height: H, background: "#FF9D8A", borderRadius: 6 }} />
      <div style={{ position: "absolute", left: 100 - 62, bottom: H - 14, width: 0, height: 0, borderLeft: "62px solid transparent", borderRight: "62px solid transparent", borderBottom: "92px solid #FF9D8A", transform: `scale(${pop})`, transformOrigin: "50% 100%" }} />
      {f >= fBig && [-70, -35, 0, 35, 70].map((a, i) => <div key={i} style={{ position: "absolute", left: 96, bottom: H + 70, width: 8, height: 34, background: CH, borderRadius: 4, opacity: 1 - d, transformOrigin: "4px 60px", transform: `rotate(${a}deg) translateY(${-70 * d}px)` }} />)}
    </div>
  );
};
export const ChalkBoard: React.FC<{ head: string; lines: BLine[]; source: string; dur: number; seed: number }> = ({ head, lines, source, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inn = spring({ frame: f, fps, config: { damping: 17, mass: 0.9 } });
  const sc = interpolate(f, [0, dur], [1, 1.06]);
  const bigL = lines.find((l) => l.big); const fBig = bigL ? bigL.f : Math.round(dur * 0.6);
  const kind = lines.some((l) => l.t.includes("°F")) ? "thermo" : head.includes("HERD") ? "tally" : "arrow";
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
            <BoardViz kind={kind} fBig={fBig} dur={dur} />
            <div style={{ position: "absolute", left: 70, right: 70, top: 150 }}>
              {lines.map((l, i) => (
                <Write key={i} f0={l.f} len={l.big ? 20 : 14} style={{ fontFamily: HAND, fontWeight: 700, fontSize: l.big ? (kind === "tally" ? 150 : 170) : 84, lineHeight: l.big ? 1.02 : 1.18, color: l.red ? "#FF9D8A" : K.chalk, textShadow: "0 0 2px rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>{l.t}</Write>
              ))}
            </div>
            <div style={{ position: "absolute", left: 70, bottom: 30, fontFamily: SANS, fontWeight: 500, fontSize: 42, letterSpacing: 1, color: "rgba(243,240,230,0.9)", opacity: interpolate(f, [18, 30], [0, 1], CL) }}>{source}</div>
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
              {cur ? (() => { const st = spring({ frame: f - Math.min(fScore, Math.round(dur * 0.55)), fps, config: { damping: 9, mass: 0.5 } }); return (
                <div style={{ color: K.red, fontSize: r.score.length > 9 ? 58 : 76, lineHeight: 1, padding: "2px 22px 6px", border: `5px solid ${K.red}`, borderRadius: 14, whiteSpace: "nowrap", background: "rgba(255,253,246,0.9)",
                  opacity: Math.min(1, st * 3), transform: `rotate(-4deg) scale(${2.4 - 1.4 * Math.min(1.08, st)})`, transformOrigin: "100% 50%", boxShadow: "0 6px 12px rgba(0,0,0,0.18)" }}>{r.score}</div>); })() : <div>{r.score}</div>}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- cartel de bloque (From the counter): el turno sale del dispensador, cuelga y se balancea; suena el timbre del mostrador
export const CounterCard: React.FC<{ title: string; sub: string; dur: number; seed: number }> = ({ title, sub, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const pull = spring({ frame: f - 2, fps, config: { damping: 14, mass: 0.9 } });
  const sw = 13 * Math.exp(-f / 55) * Math.cos(f / 7.5) + 3.2 * Math.sin(f / 21);
  const zoom = interpolate(f, [0, dur], [1.0, 1.1]);
  const ring = f > 12 ? Math.exp(-(f - 12) / 14) : 0;
  return (
    <TileWall dur={dur} seed={seed}>
      <AbsoluteFill style={{ opacity: fadeIO(f, dur, 4, 7), transform: `scale(${zoom})`, transformOrigin: "50% 20%" }}>
        <div style={{ position: "absolute", left: 0, top: 150, width: 1920, height: 900, transformOrigin: "960px 0px", transform: `rotate(${sw}deg)` }}>
          <div style={{ position: "absolute", left: 960 - 560, top: 0, width: 1120, padding: "112px 50px 86px", boxSizing: "border-box", background: "linear-gradient(180deg,#FFFDF4,#F3EBD6)", boxShadow: "0 30px 60px rgba(0,0,0,0.4)", textAlign: "center",
            transform: `translateY(${(1 - pull) * -620}px)`,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 96% 97%, 92% 100%, 88% 97%, 84% 100%, 80% 97%, 76% 100%, 72% 97%, 68% 100%, 64% 97%, 60% 100%, 56% 97%, 52% 100%, 48% 97%, 44% 100%, 40% 97%, 36% 100%, 32% 97%, 28% 100%, 24% 97%, 20% 100%, 16% 97%, 12% 100%, 8% 97%, 4% 100%, 0 97%)" }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 50, letterSpacing: 9, color: K.red, whiteSpace: "nowrap" }}>{sub}</div>
            <div style={{ height: 5, background: K.red, opacity: 0.5, margin: "22px 120px 6px" }} />
            <div style={{ fontFamily: SERIF, fontSize: title.length > 18 ? 132 : 158, lineHeight: 1.02, color: K.ink, marginTop: 14 }}>{title}</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 84, color: "rgba(42,26,18,0.7)", marginTop: 14 }}>now serving · you</div>
          </div>
        </div>
        {/* dispensador de turnos, por delante del papel */}
        <div style={{ position: "absolute", left: 800, top: -60, width: 320, height: 250, borderRadius: "0 0 160px 160px", background: `linear-gradient(90deg, #7A1410 0%, ${K.red} 40%, #E0584E 55%, #7A1410 100%)`, boxShadow: "0 18px 34px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: 868, top: 110, width: 184, height: 30, borderRadius: 8, background: "#2A1A12" }} />
        {/* timbre de mostrador */}
        <div style={{ position: "absolute", left: 1440, top: 790, width: 220, height: 130, transformOrigin: "50% 100%", transform: `scale(1.5) ` +  `translateY(${-16 * ring * Math.abs(Math.sin(f / 2.2))}px) rotate(${Math.sin(f / 1.8) * 4 * ring}deg)` }}>
          <div style={{ position: "absolute", left: 96, top: 0, width: 28, height: 26, borderRadius: 8, background: "linear-gradient(90deg,#6F757A,#E9EDF0,#8B9196)" }} />
          <div style={{ position: "absolute", left: 20, top: 22, width: 180, height: 90, borderRadius: "90px 90px 8px 8px", background: "linear-gradient(100deg, #8B9196 0%, #F4F6F7 34%, #B9BEC2 60%, #6F757A 100%)", boxShadow: "0 14px 22px rgba(0,0,0,0.35)" }} />
          <div style={{ position: "absolute", left: 0, top: 108, width: 220, height: 20, borderRadius: 8, background: "#2A1A12" }} />
        </div>
      </AbsoluteFill>
    </TileWall>
  );
};

// ---------- regla: riel de acero con cuatro ganchos de carnicero; la hoja de la regla sale de su gancho y queda colgada, balanceándose
export const RuleSheet: React.FC<{ n: number; title: string; sub: string; fSub: number; dur: number; seed: number }> = ({ n, title, sub, fSub, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: f, fps, config: { damping: 14, mass: 0.9 } });
  const sw = 10 * Math.exp(-f / 30) * Math.cos(f / 6.5) + 0.9 * Math.sin(f / 21);
  const st = spring({ frame: f - 2, fps, config: { damping: 8, mass: 0.5 } });
  const HX = [330, 750, 1170, 1590];
  const hx = 960;
  const fsT = Math.min(190, Math.floor(1150 / (title.length * 0.46)));
  const und = interpolate(f, [22, 40], [0, 1], { ...CL, easing: ease });
  return (
    <TileWall dur={dur} seed={seed + n}>
      <AbsoluteFill style={{ opacity: fadeIO(f, dur, 3, 7), transform: `scale(${interpolate(f, [0, dur], [1, 1.05])})`, transformOrigin: "50% 30%" }}>
        {/* riel y ganchos */}
        <div style={{ position: "absolute", left: -40, right: -40, top: 52, height: 26, background: "linear-gradient(180deg,#E9EDF0 0%,#8B9196 55%,#5D6367 100%)", boxShadow: "0 12px 18px rgba(0,0,0,0.3)" }} />
        {HX.map((x, i) => {
          const done = i + 1 < n, me = i + 1 === n;
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: x - 7, top: 60, width: 14, height: 70, borderRadius: 7, background: "linear-gradient(90deg,#6F757A,#E9EDF0,#8B9196)" }} />
              {!me && <div style={{ position: "absolute", left: x - 62, top: 118, width: 124, height: 150, backgroundImage: done ? paperBg : "none", border: done ? "none" : "5px dashed rgba(96,92,84,0.6)", boxSizing: "border-box", transform: `rotate(${Math.sin(f / 19 + i) * 2}deg)`, transformOrigin: "50% 0",
                display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 96, color: done ? K.red : "rgba(96,92,84,0.7)", boxShadow: done ? "0 10px 18px rgba(0,0,0,0.25)" : "none" }}>{i + 1}</div>}
            </React.Fragment>
          );
        })}
        {/* la hoja de esta regla */}
        <div style={{ position: "absolute", left: 0, top: 70, width: 1920, height: 1000, transformOrigin: `${hx}px 0px`, transform: `translateX(${(HX[n - 1] - hx) * (1 - p)}px) rotate(${sw}deg) scale(${0.12 + 0.88 * p})` }}>
          <div style={{ position: "absolute", left: hx - 7, top: -10, width: 14, height: 300, borderRadius: 7, background: "linear-gradient(90deg,#6F757A,#E9EDF0,#8B9196)" }} />
          <div style={{ position: "absolute", left: 250, top: 270, width: 1420, height: 620, backgroundImage: paperBg, boxShadow: "0 30px 60px rgba(0,0,0,0.38)",
            clipPath: "polygon(0 2%, 3% 0, 7% 2%, 12% 0, 18% 1.6%, 25% 0, 31% 2%, 38% 0.4%, 45% 2%, 52% 0, 59% 1.8%, 66% 0, 73% 2%, 80% 0.5%, 87% 2%, 94% 0, 100% 1.5%, 100% 100%, 0 100%)" }}>
            <div style={{ position: "absolute", left: 60, top: 190, width: 230, height: 230, borderRadius: "50%", border: `10px solid ${K.red}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 190, lineHeight: 1, color: K.red,
              transform: `rotate(-8deg) scale(${2.2 - 1.2 * Math.min(1.06, st)})`, opacity: Math.min(1, st * 3) }}>{n}</div>
            <div style={{ position: "absolute", left: 350, right: 50, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Write f0={5} len={18} style={{ fontFamily: HAND, fontWeight: 700, fontSize: fsT, lineHeight: 1, color: K.ink, whiteSpace: "nowrap" }}>{title}</Write>
              <div style={{ height: 10, width: 980, background: K.red, borderRadius: 5, marginTop: 10, transform: `scaleX(${und}) rotate(-0.6deg)`, transformOrigin: "0 50%" }} />
              <Write f0={Math.min(fSub, Math.round(dur * 0.45))} len={20} style={{ fontFamily: HAND, fontWeight: 700, fontSize: Math.min(92, Math.floor(1020 / (sub.length * 0.42))), lineHeight: 1.1, color: "rgba(42,26,18,0.9)", marginTop: 30, whiteSpace: "nowrap" }}>{sub}</Write>
            </div>
          </div>
        </div>
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
      <div style={{ position: "absolute", left: 0, bottom: 60, width: W, height: 300, overflow: "hidden", backgroundImage: paperBg, boxShadow: "0 -10px 30px rgba(0,0,0,0.35), 0 14px 30px rgba(0,0,0,0.35)" }}>
        <div style={{ position: "absolute", left: 70, top: 22, width: 1780, display: "flex", alignItems: "center" }}>
          <div style={{ fontFamily: SERIF, fontSize: 190, lineHeight: 1, color: K.red, width: n > 9 ? 250 : 170 }}>{n}</div>
          <div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 116, lineHeight: 1, color: K.ink, whiteSpace: "nowrap" }}>{name}</div>
            <Write f0={Math.min(fFact, Math.round(dur * 0.45))} len={22} style={{ fontFamily: HAND, fontWeight: 700, fontSize: Math.min(96, Math.floor((n > 9 ? 1500 : 1580) / (fact.length * 0.5))), lineHeight: 1.1, color: "rgba(42,26,18,0.92)", marginTop: 2, whiteSpace: "nowrap" }}>{fact}</Write>
          </div>
        </div>
      </div>
      {/* el rollo */}
      <div style={{ position: "absolute", left: W - 40, bottom: 46, width: 80, height: 328, borderRadius: 40, opacity: roll < 0.985 ? 1 : 0, background: `linear-gradient(90deg, #B98672 0%, ${K.paper} 40%, #F7D9CB 55%, #A9765F 100%)`, boxShadow: "12px 10px 20px rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", right: 70, top: 60, display: "flex", gap: 12 }}>
        {Array.from({ length: total }, (_, i) => <div key={i} style={{ width: 34, height: 34, borderRadius: "50%", background: i < n ? K.red : "rgba(255,255,255,0.55)", border: "4px solid #FFF8EE", boxShadow: "0 2px 6px rgba(0,0,0,0.4)", transform: `scale(${i === n - 1 ? 1 + 0.5 * Math.max(0, 1 - Math.abs(f - 14) / 10) : 1})` }} />)}
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
      <div style={{ position: "absolute", left: 180, top: 170, width: 1560, minHeight: 720, backgroundImage: paperBg, boxShadow: "0 34px 70px rgba(0,0,0,0.5)", padding: "70px 90px", boxSizing: "border-box",
        transform: `translateY(${(1 - p) * 500}px) rotate(${-1.6 + p * 0.6 + (f > 34 && f < 46 ? Math.sin(f * 2.4) * 0.5 : 0)}deg)` }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 42, letterSpacing: 7, color: K.red, whiteSpace: "nowrap" }}>{kicker}</div>
        <Write f0={8} len={46} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 104, lineHeight: 1.08, color: K.ink, marginTop: 26 }}>{text}</Write>
        <div style={{ position: "absolute", right: 80, bottom: 54, border: `9px solid ${K.red}`, outline: `3px solid ${K.red}`, outlineOffset: 7, borderRadius: 14, padding: "14px 40px", fontFamily: SANS, fontWeight: 600, fontSize: 84, letterSpacing: 10, color: K.red, background: "rgba(237,194,174,0.85)",
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
  const sc = interpolate(f, [0, dur], [1.04, 1.2], { ...CL, easing: ease });
  const mx = pins.reduce((a, p) => a + p.x, 0) / pins.length, my = pins.reduce((a, p) => a + p.y, 0) / pins.length;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.ink, opacity: fadeIO(f, dur, 5, 7) }}>
      <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: `${mx}px ${my}px` }}>
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
              {(() => { const lf = pins.some((q) => q !== p && q.x > p.x && q.x - p.x < 600 && Math.abs(q.y - p.y) < 130); return (
              <div style={{ position: "absolute", ...(lf ? { right: 1920 - p.x + 34 } : { left: p.x + 34 }), top: p.y - 70 + (lf ? 40 : 0), backgroundImage: paperBg, padding: "8px 26px", fontFamily: HAND, fontWeight: 700, fontSize: 94, color: K.ink, whiteSpace: "nowrap",
                boxShadow: "0 8px 16px rgba(0,0,0,0.35)", transform: `rotate(-2deg) scale(${Math.min(1, s)})`, transformOrigin: lf ? "100% 50%" : "0 50%", opacity: Math.min(1, s * 2) }}>{p.label}</div>); })()}
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
