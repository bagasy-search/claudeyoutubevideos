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

// ---------- pizarra de precios con el dato y su fuente; a la derecha o abajo, un mecanismo que se mueve desde el primer cuadro
export type BLine = { t: string; f: number; big?: boolean; red?: boolean };
const CH = "rgba(243,240,230,0.9)";
const BoardViz: React.FC<{ kind: string; fBig: number; dur: number; target?: number }> = ({ kind, fBig, dur, target = 145 }) => {
  if (kind === "none") return null;
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  if (kind === "thermo") {
    // termómetro de aguja: el dial va de 100 a 200 °F en 270 grados; la aguja sube despacio y clava en 145 sobre la palabra
    const creep = interpolate(f, [8, fBig], [0, 0.72], { ...CL, easing: ease });
    const hit = spring({ frame: f - fBig, fps, config: { damping: 7, mass: 0.6 } });
    const v = 100 + (target - 100) * (creep + (1 - 0.72) * hit) + (f > fBig + 30 ? Math.sin(f / 5) * 0.7 : 0);
    const ang = -135 + ((v - 100) / 100) * 270;
    const ticks = Array.from({ length: 21 }, (_, i) => i);
    return (
      <div style={{ position: "absolute", right: 60, top: 196, width: 470, height: 470, transformOrigin: "100% 0%", transform: "scale(1.06)" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `7px solid ${CH}`, boxShadow: "inset 0 0 0 14px rgba(243,240,230,0.07)" }} />
        {ticks.map((i) => {
          const a = -135 + i * 13.5, big = i % 2 === 0, is145 = i === Math.round((target - 100) / 5);
          return <div key={i} style={{ position: "absolute", left: 235 - 3, top: 26, width: is145 ? 9 : 6, height: big ? 40 : 22, background: is145 ? "#FF9D8A" : CH, transformOrigin: `3px ${235 - 26}px`, transform: `rotate(${a}deg)`, borderRadius: 3 }} />;
        })}
        {[100, 120, 140, 160, 180, 200].map((n, i) => {
          const a = (-135 + i * 54 - 90) * Math.PI / 180;
          return <div key={n} style={{ position: "absolute", left: 235 + Math.cos(a) * 150 - 50, top: 235 + Math.sin(a) * 150 - 26, width: 100, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 46, color: CH }}>{n}</div>;
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
  const H = 520 * up;
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
  const kind = (bigL && lines.some((l) => l.t.includes("°F"))) ? "thermo" : head.includes("HERD") ? "tally" : (bigL && bigL.t.includes("RECORD")) ? "arrow" : "none";
  const target = Number(((bigL ? bigL.t : "").match(/\d+/) || ["145"])[0]);
  const longHead = head.length > 24;
  return (
    <TileWall dur={dur} seed={seed}>
      <AbsoluteFill style={{ opacity: fadeIO(f, dur, 4, 7), perspective: 1800 }}>
        <div style={{ position: "absolute", left: 250, top: 110, width: 1420, height: 860, transform: `translateY(${(1 - inn) * -120}px) rotateX(${(1 - inn) * 14}deg) scale(${sc}) rotate(${seed % 2 ? 0.6 : -0.6}deg)`, opacity: inn,
          backgroundImage: woodBg, padding: 34, boxShadow: "0 40px 70px rgba(0,0,0,0.45), 0 4px 0 rgba(255,255,255,0.15) inset", borderRadius: 6 }}>
          <div style={{ position: "absolute", inset: 34, borderRadius: 3, boxShadow: "inset 0 0 0 3px rgba(0,0,0,0.5), inset 0 14px 30px rgba(0,0,0,0.5)",
            backgroundImage: `linear-gradient(104deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0.06) 52%, rgba(255,255,255,0) 80%), linear-gradient(180deg, #232B26 0%, ${K.slate} 100%)` }}>
            <div style={{ position: "absolute", left: 70, right: 70, top: 46, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 42, letterSpacing: longHead ? 5 : 9, color: "rgba(243,240,230,0.82)", whiteSpace: "nowrap" }}>{head}</div>
              {!longHead && <div style={{ fontFamily: HAND, fontSize: 40, color: "rgba(243,240,230,0.6)" }}>Stan's Meats · since 1961</div>}
            </div>
            <div style={{ position: "absolute", left: 70, right: 70, top: 112, height: 3, background: "rgba(243,240,230,0.35)" }} />
            <BoardViz kind={kind} fBig={fBig} dur={dur} target={target} />
            {kind === "none" && <div style={{ position: "absolute", left: 70, right: 70, top: 150, opacity: interpolate(f, [6, 18], [0, 0.3], CL) }}>
              {lines.map((l, i) => /^\d · /.test(l.t) ? <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 128, lineHeight: 1.22, color: K.chalk, whiteSpace: "nowrap" }}>{l.t.slice(0, 3)}</div> : null)}
            </div>}
            <div style={{ position: "absolute", left: 70, right: 70, top: 150 }}>
              {lines.map((l, i) => (
                <Write key={i} f0={l.f} len={l.big ? 20 : 14} style={{ fontFamily: HAND, fontWeight: 700, fontSize: l.big ? (kind === "tally" ? 150 : kind === "none" ? 230 : 190) : (kind === "none" && !bigL ? 128 : kind === "thermo" ? 76 : 116), lineHeight: l.big ? 1.02 : 1.22, color: l.red ? "#FF9D8A" : K.chalk, textShadow: "0 0 2px rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>{l.t}</Write>
              ))}
            </div>
            <div style={{ position: "absolute", left: 70, bottom: 30, fontFamily: SANS, fontWeight: 500, fontSize: source.length > 48 ? 32 : 42, letterSpacing: 1, color: "rgba(243,240,230,0.9)", opacity: interpolate(f, [18, 30], [0, 1], CL) }}>{source}</div>
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
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 12, color: K.red }}>{sub}</div>
            <div style={{ height: 5, background: K.red, opacity: 0.5, margin: "22px 120px 6px" }} />
            <div style={{ fontFamily: SERIF, fontSize: title.length > 18 ? 132 : 158, lineHeight: 1.02, color: K.ink, marginTop: 14 }}>{title}</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 84, color: "rgba(42,26,18,0.7)", marginTop: 14 }}>now serving · you</div>
          </div>
        </div>
        {/* dispensador de turnos, por delante del papel */}
        <div style={{ position: "absolute", left: 800, top: -60, width: 320, height: 250, borderRadius: "0 0 160px 160px", background: `linear-gradient(90deg, #7A1410 0%, ${K.red} 40%, #E0584E 55%, #7A1410 100%)`, boxShadow: "0 18px 34px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: 868, top: 110, width: 184, height: 30, borderRadius: 8, background: "#2A1A12" }} />
        {/* timbre de mostrador */}
        <div style={{ position: "absolute", left: 1500, top: 860, width: 220, height: 130, transformOrigin: "50% 100%", transform: `scale(1.5) ` +  `translateY(${-16 * ring * Math.abs(Math.sin(f / 2.2))}px) rotate(${Math.sin(f / 1.8) * 4 * ring}deg)` }}>
          <div style={{ position: "absolute", left: 96, top: 0, width: 28, height: 26, borderRadius: 8, background: "linear-gradient(90deg,#6F757A,#E9EDF0,#8B9196)" }} />
          <div style={{ position: "absolute", left: 20, top: 22, width: 180, height: 90, borderRadius: "90px 90px 8px 8px", background: "linear-gradient(100deg, #8B9196 0%, #F4F6F7 34%, #B9BEC2 60%, #6F757A 100%)", boxShadow: "0 14px 22px rgba(0,0,0,0.35)" }} />
          <div style={{ position: "absolute", left: 0, top: 108, width: 220, height: 20, borderRadius: 8, background: "#2A1A12" }} />
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
            <Write f0={fSub} len={20} style={{ fontFamily: HAND, fontSize: 70, lineHeight: 1.15, color: "rgba(42,26,18,0.82)", marginTop: 40 }}>{sub}</Write>
          </div>
        </div>
        <Tape style={{ left: 880, top: 126, transform: `rotate(${side * 3}deg)`, opacity: p }} />
      </AbsoluteFill>
    </TileWall>
  );
};

// ---------- repaso: la foto del corte entera y el papel que se desenrolla por abajo con su dato clave
export const RecapItem: React.FC<{ n: number; total: number; name: string; fact: string; fFact: number; img: string; dur: number; seed: number; big?: string }> = ({ n, total, name, fact, fFact, img, dur, seed, big }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const kb = useKB(seed + 7, dur);
  const roll = spring({ frame: f - 2, fps, config: { damping: 18, mass: 0.8 } });
  const W = 1920 * roll;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}>
      <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
      <div style={{ position: "absolute", left: 0, bottom: 60, width: W, height: 300, overflow: "hidden", backgroundImage: paperBg, boxShadow: "0 -10px 30px rgba(0,0,0,0.35), 0 14px 30px rgba(0,0,0,0.35)" }}>
        <div style={{ position: "absolute", left: 70, top: 22, width: 1780, display: "flex", alignItems: "center" }}>
          <div style={{ fontFamily: SERIF, fontSize: big ? 120 : 190, lineHeight: 1, color: K.red, width: big ? 330 : n > 9 ? 250 : 170 }}>{big ?? n}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 116, lineHeight: 1, color: K.ink, whiteSpace: "nowrap" }}>{name}</div>
            <Write f0={Math.min(fFact, Math.round(dur * 0.45))} len={22} style={{ fontFamily: HAND, fontWeight: 700, fontSize: Math.min(108, Math.floor((big ? 1400 : 1560) / (Math.max(1, fact.length) * 0.43))), lineHeight: 1.1, color: "rgba(42,26,18,0.92)", marginTop: 4, whiteSpace: "nowrap" }}>{fact}</Write>
          </div>
        </div>
      </div>
      {/* el rollo */}
      <div style={{ position: "absolute", left: W - 40, bottom: 46, width: 80, height: 328, borderRadius: 40, opacity: roll < 0.985 ? 1 : 0, background: `linear-gradient(90deg, #B98672 0%, ${K.paper} 40%, #F7D9CB 55%, #A9765F 100%)`, boxShadow: "12px 10px 20px rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", right: 70, top: 60, display: "flex", gap: 12 }}>
        {total > 0 && Array.from({ length: total }, (_, i) => <div key={i} style={{ width: 34, height: 34, borderRadius: "50%", background: i < n ? K.red : "rgba(255,255,255,0.55)", border: "4px solid #FFF8EE", boxShadow: "0 2px 6px rgba(0,0,0,0.4)" }} />)}
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
        transform: `translateY(${(1 - p) * 500}px) rotate(${-1.6 + p * 0.6}deg)` }}>
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
              <div style={{ position: "absolute", left: p.x + 30, top: p.y - 44, backgroundImage: paperBg, padding: "6px 20px", fontFamily: HAND, fontWeight: 700, fontSize: 44, color: K.ink, whiteSpace: "nowrap",
                boxShadow: "0 8px 16px rgba(0,0,0,0.35)", transform: `rotate(-2deg) scale(${Math.min(1, s)})`, transformOrigin: "0 50%", opacity: Math.min(1, s * 2) }}>{p.label}</div>
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- bandeja de acero: las 8 piezas del pollo van cayendo a su lugar (contador "piece N of 8")
export const PieceTray: React.FC<{ n: number; from: number; imgs: string[]; dur: number; seed: number }> = ({ n, from, imgs, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inn = spring({ frame: f, fps, config: { damping: 18 } });
  const CW = 400, CH = 330, GAP = 24, X0 = 960 - (CW * 4 + GAP * 3) / 2, Y0 = 262;
  const NAMES = ["Thigh", "Drumstick", "Thigh", "Drumstick", "Wing", "Wing", "Breast", "Breast"];
  const thud = f > 14 ? 9 * Math.exp(-(f - 14) / 6) * Math.sin((f - 14) / 1.6) : 0;
  return (
    <TileWall dur={dur} seed={seed}>
      <AbsoluteFill style={{ opacity: fadeIO(f, dur, 4, 6), perspective: 1700 }}>
        <div style={{ position: "absolute", left: X0 - 50, top: Y0 - 50, width: CW * 4 + GAP * 3 + 100, height: CH * 2 + GAP + 100, borderRadius: 26, transform: `translateY(${thud}px) rotateX(${10 - inn * 5}deg) scale(${interpolate(f, [0, dur], [0.97, 1.03])})`, transformOrigin: "50% 80%",
          background: "linear-gradient(135deg, #DCE0E3 0%, #AEB4B9 38%, #E8EBED 52%, #9AA0A6 100%)", boxShadow: "0 40px 70px rgba(0,0,0,0.4), inset 0 0 0 10px rgba(255,255,255,0.35), inset 0 0 60px rgba(0,0,0,0.25)" }}>
          {imgs.map((src, i) => {
            const isNew = i >= from && i < n; const on = i < n;
            const d = spring({ frame: f - 6 - (i - from) * 9, fps, config: { damping: 11, mass: 0.7 } });
            const p = isNew ? d : on ? 1 : 0;
            return (
              <div key={i} style={{ position: "absolute", left: 50 + (i % 4) * (CW + GAP), top: 50 + Math.floor(i / 4) * (CH + GAP), width: CW, height: CH, borderRadius: 14, overflow: "hidden",
                background: "rgba(0,0,0,0.12)", boxShadow: on ? `0 ${10 * p}px ${20 * p}px rgba(0,0,0,0.35)` : "inset 0 0 0 3px rgba(255,255,255,0.35)" }}>
                {on && <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateY(${(1 - Math.min(1, p)) * -420}px) scale(${isNew ? 1.25 - 0.25 * Math.min(1, p) : 1})`, opacity: Math.min(1, p * 2) }} />}
                {on && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "4px 0 8px", textAlign: "center", backgroundImage: paperBg, fontFamily: HAND, fontWeight: 700, fontSize: 62, lineHeight: 1, color: K.ink, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - Math.min(1, p)) * 80}px)` }}>{NAMES[i]}</div>}
                {!on && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 150, color: "rgba(52,58,64,0.4)" }}>{i + 1}</div>}
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 44, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 56, letterSpacing: 14, color: K.ink }}>
          PIECE <span style={{ fontFamily: SERIF, fontSize: 140, letterSpacing: 0, color: K.red, margin: "0 18px", position: "relative", top: 18, display: "inline-block", transform: `scale(${1 + 0.35 * Math.max(0, 1 - Math.abs(f - 16) / 8)})` }}>{n}</span> OF 8
        </div>
      </AbsoluteFill>
    </TileWall>
  );
};

// ---------- contador de platos: la foto de los platos entera y la etiqueta que va sumando sobre cada número dicho
export const PlateCount: React.FC<{ from: number; fNums: number[]; label: string; img: string; dur: number; seed: number }> = ({ from, fNums, label, img, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const kb = useKB(seed + 5, dur);
  let n = from, last = 0; fNums.forEach((x, i) => { if (f >= x) { n = from + i + 1; last = x; } });
  const bump = spring({ frame: f - last, fps, config: { damping: 9, mass: 0.5 } });
  const inn = spring({ frame: f - 2, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}>
      <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
      <div style={{ position: "absolute", right: 46, bottom: 46, width: 400, height: 350, background: K.white, border: `10px solid ${K.red}`, borderRadius: 16, boxShadow: "0 26px 50px rgba(0,0,0,0.5)",
        transform: `translateY(${(1 - inn) * 500}px) rotate(${3 - inn * 5}deg)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ height: 214, width: 344, overflow: "hidden", borderRadius: 10, background: "linear-gradient(180deg, rgba(42,26,18,0.12) 0%, rgba(42,26,18,0) 22%, rgba(42,26,18,0) 78%, rgba(42,26,18,0.12) 100%)", display: "flex", justifyContent: "center" }}>
          <div style={{ fontFamily: SERIF, fontSize: 208, lineHeight: 1.03, color: K.ink, transform: `translateY(${n > from ? (1 - Math.min(1.04, bump)) * 214 : 0}px)` }}>{n}</div>
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: label.length > 8 ? 34 : 50, letterSpacing: label.length > 8 ? 3 : 8, color: K.red, marginTop: 10, whiteSpace: "nowrap" }}>{label.length > 8 ? "PLATES, ONE BIRD" : label}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- la cuenta honesta: boleta de carnicería escrita a mano sobre el tajo
export type RLine = { a: string; b: string; f: number; bold?: boolean };
export const Receipt: React.FC<{ head: string; lines: RLine[]; foot: string; dur: number; seed: number }> = ({ head, lines, foot, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inn = spring({ frame: f, fps, config: { damping: 17 } });
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundImage: woodBg, opacity: fadeIO(f, dur, 4, 7) }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 1200px 700px at 60% 35%, rgba(255,225,170,0.22), rgba(0,0,0,0) 70%)" }} />
      <div style={{ position: "absolute", left: 380, top: 150 + (1 - inn) * 700, width: 1160, minHeight: 740, backgroundImage: "repeating-linear-gradient(180deg, transparent 0px, transparent 103px, rgba(70,110,170,0.22) 103px, rgba(70,110,170,0.22) 106px), linear-gradient(180deg,#FFFEF8,#F4EEDC)", backgroundPosition: "0 236px, 0 0", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", padding: "44px 60px 60px", boxSizing: "border-box",
        transform: `rotate(${1.6 - inn}deg) scale(${interpolate(f, [0, dur], [1.02, 1.07])})`,
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 95% 98.4%, 90% 100%, 85% 98.4%, 80% 100%, 75% 98.4%, 70% 100%, 65% 98.4%, 60% 100%, 55% 98.4%, 50% 100%, 45% 98.4%, 40% 100%, 35% 98.4%, 30% 100%, 25% 98.4%, 20% 100%, 15% 98.4%, 10% 100%, 5% 98.4%, 0 100%)" }}>
        <div style={{ textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 36, letterSpacing: 8, color: K.red }}>STAN&apos;S MEATS · CHICAGO</div>
        <div style={{ textAlign: "center", fontFamily: SERIF, fontSize: 84, color: K.ink, marginTop: 6 }}>{head}</div>
        <div style={{ height: 4, background: K.ink, opacity: 0.6, margin: "18px 0 10px" }} />
        {lines.map((l, i) => (
          <Write key={i} f0={l.f} len={16} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", whiteSpace: "nowrap", paddingRight: 16, fontFamily: HAND, fontWeight: 700, fontSize: l.bold ? 88 : 80, lineHeight: 1.32, color: l.bold ? K.red : K.ink, borderTop: l.bold ? `3px solid ${K.ink}` : "none", marginTop: l.bold ? 10 : 0 }}>
            <span>{l.a}</span><span>{l.b}</span>
          </Write>
        ))}
        <div style={{ position: "absolute", left: 60, right: 60, bottom: 40, fontFamily: HAND, fontWeight: 700, fontSize: 68, color: "rgba(42,26,18,0.85)", textAlign: "center", opacity: interpolate(f, [20, 34], [0, 1], CL) }}>{foot}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- cartel esmaltado del local (dato oficial con su fuente): chapa blanca con borde azul y cuatro tornillos
export const Notice: React.FC<{ big: string; sub: string; source: string; dur: number; seed: number }> = ({ big, sub, source, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: f, fps, config: { damping: 13, mass: 0.9 } });
  const sw = Math.sin(f / 9) * 2.6 * Math.exp(-f / 28) + 1.3 * Math.sin(f / 24);
  const BLUE = "#1F3F7A";
  const screw = (st: React.CSSProperties) => <div style={{ position: "absolute", width: 34, height: 34, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #F2F4F5 0%, #9AA0A6 55%, #5B6166 100%)", boxShadow: "0 3px 5px rgba(0,0,0,0.4)", ...st }} />;
  return (
    <TileWall dur={dur} seed={seed}>
      <AbsoluteFill style={{ opacity: fadeIO(f, dur, 3, 7) }}>
        <div style={{ position: "absolute", left: 300, top: 190, width: 1320, height: 700, borderRadius: 34, transformOrigin: "50% 0%", transform: `translateY(${(1 - p) * -900}px) rotate(${sw}deg) scale(${interpolate(f, [0, dur], [1, 1.09])})`,
          background: "linear-gradient(160deg, #FFFFFF 0%, #F1F0EA 60%, #E3E1D8 100%)", border: `16px solid ${BLUE}`, boxShadow: "0 34px 60px rgba(0,0,0,0.4), inset 0 0 0 6px #FFFFFF, inset 0 0 40px rgba(0,0,0,0.08)" }}>
          {screw({ left: 26, top: 26 })}{screw({ right: 26, top: 26 })}{screw({ left: 26, bottom: 26 })}{screw({ right: 26, bottom: 26 })}
          <div style={{ position: "absolute", left: 0, right: 0, top: 54, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 16, color: BLUE }}>USDA SAYS</div>
          <div style={{ position: "absolute", left: 90, right: 90, top: 150, height: 6, background: BLUE, opacity: 0.85 }} />
          <div style={{ position: "absolute", left: 60, right: 60, top: 190, textAlign: "center", fontFamily: SERIF, fontSize: Math.min(210, Math.floor(1130 / (big.length * 0.5))), lineHeight: 1.02, color: K.red, whiteSpace: "nowrap", height: 230, display: "flex", alignItems: "center", justifyContent: "center",
            transform: `scale(${1 + 0.06 * Math.max(0, 1 - Math.abs(f - 16) / 8)})` }}>{big}</div>
          <div style={{ position: "absolute", left: 60, right: 60, top: 440, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: Math.min(60, Math.floor(1150 / (sub.length * 0.5))), lineHeight: 1.2, color: K.ink, whiteSpace: "nowrap", opacity: interpolate(f, [14, 26], [0, 1], CL) }}>{sub}</div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 42, letterSpacing: 1, color: "rgba(42,26,18,0.8)", opacity: interpolate(f, [22, 34], [0, 1], CL) }}>{source}</div>
        </div>
      </AbsoluteFill>
    </TileWall>
  );
};

// ====================== componentes propios de stan12k (panceta) — CSS y DOM puro ======================
const steelBg = "linear-gradient(135deg, #DCE0E3 0%, #AEB4B9 38%, #E8EBED 52%, #9AA0A6 100%)";
const brassBg = "linear-gradient(135deg, #E9CF8A 0%, #B98D3A 40%, #F2DFA6 55%, #8E6A24 100%)";

// ---------- LA regla: etiqueta de papel colgada de un hilo sobre la foto de la cura; el sello cae en "never more"
export const RuleTag: React.FC<{ img: string; big: string; sub: string; stamp: string; fBig: number; fStamp: number; dur: number; seed: number }> = ({ img, big, sub, stamp, fBig, fStamp, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const drop = spring({ frame: f - 2, fps, config: { damping: 11, mass: 1 } });
  const sw = 9 * Math.exp(-f / 40) * Math.cos(f / 7) + 1.4 * Math.sin(f / 22);
  const pop = spring({ frame: f - fBig, fps, config: { damping: 9, mass: 0.6 } });
  const st = spring({ frame: f - fStamp, fps, config: { damping: 8, mass: 0.5 } });
  const shake = f > fStamp && f < fStamp + 10 ? Math.sin(f * 2.6) * 6 * (1 - (f - fStamp) / 10) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.ink, opacity: fadeIO(f, dur, 4, 7) }}>
      <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${interpolate(f, [0, dur], [1.04, 1.12])}) translateY(${shake}px)`, transformOrigin: "40% 80%" }} />
      <div style={{ position: "absolute", left: 0, top: -40, width: 1920, height: 900, transformOrigin: "1180px 0px", transform: `rotate(${sw}deg) translateY(${(1 - drop) * -800}px)` }}>
        <div style={{ position: "absolute", left: 1177, top: 0, width: 6, height: 150, background: "#6B4A2A" }} />
        <div style={{ position: "absolute", left: 760, top: 140, width: 840, height: 520, backgroundImage: "linear-gradient(180deg,#FFFDF4,#F3EBD6)", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", border: `10px solid ${K.red}`, borderRadius: 18,
          clipPath: "polygon(0 12%, 6% 0, 94% 0, 100% 12%, 100% 100%, 0 100%)", textAlign: "center" }}>
          <div style={{ position: "absolute", left: 400, top: 22, width: 40, height: 40, borderRadius: "50%", background: K.ink, opacity: 0.75 }} />
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 44, letterSpacing: 8, color: K.red, marginTop: 84 }}>CURING SALT No. 1</div>
          <div style={{ fontFamily: SERIF, fontSize: 250, lineHeight: 0.98, color: K.ink, transform: `scale(${0.6 + 0.4 * Math.min(1.08, pop)})`, opacity: Math.min(1, pop * 3) }}>{big}</div>
          <Write f0={fBig + 10} len={18} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 80, lineHeight: 1, color: K.ink, whiteSpace: "nowrap", display: "inline-block" }}>{sub}</Write>
        </div>
      </div>
      <div style={{ position: "absolute", left: 70, top: 500, padding: "18px 40px", border: `12px solid ${K.red}`, outline: `4px solid ${K.red}`, outlineOffset: 9, borderRadius: 18, background: "rgba(250,247,240,0.92)", fontFamily: SANS, fontWeight: 600, fontSize: 92, letterSpacing: 6, color: K.red, whiteSpace: "nowrap",
        transform: `rotate(-8deg) scale(${2.6 - 1.6 * Math.min(1.05, st)})`, opacity: Math.min(1, st * 3), boxShadow: "0 16px 30px rgba(0,0,0,0.35)" }}>{stamp}</div>
    </AbsoluteFill>
  );
};

// ---------- balanza de bolsillo: la cuenta escrita en un papel y el visor que sube hasta el gramo exacto
export const GramScale: React.FC<{ top: string; to: number; label: string; fTop: number; fRun: number; dur: number; seed: number }> = ({ top, to, label, fTop, fRun, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inn = spring({ frame: f, fps, config: { damping: 16 } });
  const run = interpolate(f, [fRun, fRun + 26], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const val = (to * run).toFixed(1);
  const hit = spring({ frame: f - fRun - 26, fps, config: { damping: 7, mass: 0.5 } });
  const grains = Math.round(run * 26);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundImage: woodBg, opacity: fadeIO(f, dur, 4, 7) }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 1300px 760px at 45% 35%, rgba(255,225,170,0.22), rgba(0,0,0,0) 70%)" }} />
      <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, dur], [1, 1.07])})`, transformOrigin: "60% 60%" }}>
        {/* papel con la cuenta */}
        <div style={{ position: "absolute", left: 70, top: 120, width: 900, boxSizing: "border-box", padding: "40px 50px 50px", backgroundImage: paperBg, boxShadow: "0 22px 44px rgba(0,0,0,0.45)", transform: `rotate(${-4 + inn * 1.5}deg) translateX(${(1 - inn) * -700}px)` }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 8, color: K.red }}>THE ARITHMETIC</div>
          <Write f0={fTop} len={22} style={{ fontFamily: HAND, fontWeight: 700, fontSize: Math.min(140, Math.floor(790 / (top.length * 0.47))), lineHeight: 1.2, color: K.ink, whiteSpace: "nowrap", marginTop: 14 }}>{top}</Write>
          <Write f0={fRun + 20} len={16} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 200, lineHeight: 1.1, color: K.red, whiteSpace: "nowrap" }}>{`= ${to.toFixed(1)} g`}</Write>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 88, lineHeight: 1.05, color: "rgba(42,26,18,0.85)", marginTop: 6, opacity: interpolate(f, [fRun + 34, fRun + 46], [0, 1], CL) }}>{label}</div>
        </div>
        {/* balanza */}
        <div style={{ position: "absolute", left: 1010, top: 250, width: 700, height: 640, transform: `translateY(${(1 - inn) * 500}px) rotate(${2 - inn * 1}deg)` }}>
          <div style={{ position: "absolute", left: 90, top: 20, width: 520, height: 300, borderRadius: 26, backgroundImage: steelBg, boxShadow: "0 20px 34px rgba(0,0,0,0.5), inset 0 0 0 8px rgba(255,255,255,0.4)", transform: `translateY(${4 * Math.min(1.1, hit)}px)` }}>
            <div style={{ position: "absolute", left: 170, top: 96, width: 180, height: 120, borderRadius: "10px 10px 60px 60px", background: "linear-gradient(180deg,#FFFDF4,#E9E0C8)", boxShadow: "0 6px 10px rgba(0,0,0,0.25)" }} />
            {Array.from({ length: grains }, (_, i) => <div key={i} style={{ position: "absolute", left: 196 + ((i * 37) % 120), top: 104 + ((i * 53) % 34) - Math.floor(i / 9) * 6, width: 16, height: 12, borderRadius: 5, background: i % 3 ? "#F58FB0" : "#EE6F99" }} />)}
          </div>
          <div style={{ position: "absolute", left: 0, top: 300, width: 700, height: 320, borderRadius: 30, backgroundImage: brassBg, boxShadow: "0 34px 60px rgba(0,0,0,0.55), inset 0 0 0 6px rgba(255,255,255,0.3)" }}>
            <div style={{ position: "absolute", left: 60, top: 54, width: 580, height: 210, borderRadius: 16, background: "linear-gradient(180deg,#1C2A22,#24362B)", boxShadow: "inset 0 8px 20px rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 44, boxSizing: "border-box" }}>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 190, letterSpacing: 6, color: "#B8FFB0", textShadow: "0 0 14px rgba(140,255,130,0.55)", transform: `scale(${1 + 0.1 * Math.max(0, 1 - Math.abs(f - fRun - 30) / 8)})` }}>{val}</div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 80, color: "#B8FFB0", marginLeft: 16, marginTop: 70 }}>g</div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- calendario de taco: cada día se arranca su hoja
export const TearCal: React.FC<{ days: number[]; fDays: number[]; note: string; dur: number; seed: number }> = ({ days, fDays, note, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inn = spring({ frame: f, fps, config: { damping: 15 } });
  let cur = 0; fDays.forEach((x, i) => { if (f >= x) cur = i; });
  const sw = 3 * Math.exp(-f / 30) * Math.cos(f / 6) + 0.6 * Math.sin(f / 25);
  const page = (d: number, style: React.CSSProperties) => (
    <div style={{ position: "absolute", left: 0, top: 150, width: 620, height: 600, background: "linear-gradient(180deg,#FFFEF8,#F1EAD6)", boxShadow: "0 10px 18px rgba(0,0,0,0.25)", textAlign: "center", ...style }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 70, letterSpacing: 26, color: K.red, marginTop: 40, paddingLeft: 26 }}>DAY</div>
      <div style={{ fontFamily: SERIF, fontSize: 420, lineHeight: 0.92, color: K.ink }}>{d}</div>
    </div>
  );
  return (
    <TileWall dur={dur} seed={seed}>
      <AbsoluteFill style={{ opacity: fadeIO(f, dur, 3, 6), transform: `scale(${interpolate(f, [0, dur], [1, 1.06])})`, transformOrigin: "40% 40%" }}>
        <div style={{ position: "absolute", left: 300, top: 110, width: 620, height: 800, transformOrigin: "310px 0px", transform: `rotate(${sw}deg) translateY(${(1 - inn) * -900}px)` }}>
          <div style={{ position: "absolute", left: 290, top: -30, width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #F2F4F5, #6B7176 70%)", zIndex: 5 }} />
          <div style={{ position: "absolute", left: -20, top: 0, width: 660, height: 170, borderRadius: 10, background: `linear-gradient(180deg, ${K.red}, #8E1D17)`, boxShadow: "0 16px 30px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 600, fontSize: 46, letterSpacing: 10, color: "#FFF4E6" }}>STAN'S MEATS</div>
          {page(days[Math.min(days.length - 1, cur)], {})}
          {days.map((d, i) => {
            if (i === 0 || f < fDays[i]) return null;
            const t = interpolate(f, [fDays[i], fDays[i] + 16], [0, 1], { ...CL, easing: Easing.in(Easing.quad) });
            if (t >= 1) return null;
            return <React.Fragment key={i}>{page(days[i - 1], { transformOrigin: "0% 0%", transform: `translate(${t * 260}px, ${t * 900}px) rotate(${t * 38}deg)`, opacity: 1 - t * 0.3, zIndex: 4 })}</React.Fragment>;
          })}
        </div>
        <div style={{ position: "absolute", left: 1000, top: 330, width: 780, padding: "34px 46px 42px", boxSizing: "border-box", backgroundImage: paperBg, boxShadow: "0 22px 44px rgba(0,0,0,0.35)", transform: `rotate(2deg) translateX(${(1 - inn) * 900}px)` }}>
          <Tape style={{ left: "50%", marginLeft: -75, top: -22, transform: "rotate(-3deg)" }} />
          <Write f0={10} len={22} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 108, lineHeight: 1.08, color: K.ink }}>{note}</Write>
        </div>
      </AbsoluteFill>
    </TileWall>
  );
};

// ---------- sonda con cable: el visor sube hasta el número y queda latiendo
export const ProbeBox: React.FC<{ label: string; from: number; to: number; fHit: number; note: string; dur: number; seed: number }> = ({ label, from, to, fHit, note, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inn = spring({ frame: f, fps, config: { damping: 15 } });
  const t = interpolate(f, [4, Math.max(8, fHit)], [0, 1], { ...CL, easing: Easing.out(Easing.quad) });
  const val = Math.round(from + (to - from) * t);
  const hit = spring({ frame: f - fHit, fps, config: { damping: 7, mass: 0.5 } });
  const done = f >= fHit;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundImage: steelBg, opacity: fadeIO(f, dur, 3, 6) }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 1300px 760px at 40% 30%, rgba(255,255,255,0.35), rgba(0,0,0,0.18) 80%)" }} />
      <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, dur], [1, 1.07])})` }}>
        {/* cable trenzado que sale hacia el horno */}
        <div style={{ position: "absolute", left: 1330, top: 520, width: 700, height: 22, borderRadius: 11, background: "repeating-linear-gradient(120deg, #3A3F44 0px, #3A3F44 10px, #8B9196 10px, #8B9196 20px)", transformOrigin: "0 50%", transform: `rotate(${-14 + Math.sin(f / 17) * 1.5}deg)`, boxShadow: "0 8px 12px rgba(0,0,0,0.3)" }} />
        <div style={{ position: "absolute", left: 420, top: 250, width: 960, height: 560, borderRadius: 40, background: "linear-gradient(160deg,#FAF7F0,#DAD5C8)", boxShadow: "0 40px 70px rgba(0,0,0,0.45), inset 0 0 0 8px rgba(255,255,255,0.6)", transform: `translateY(${(1 - inn) * 700}px) rotate(${-1.5 + inn}deg)` }}>
          <div style={{ position: "absolute", left: 60, top: 40, fontFamily: SANS, fontWeight: 600, fontSize: 46, letterSpacing: 7, color: K.red, whiteSpace: "nowrap" }}>{label}</div>
          <div style={{ position: "absolute", left: 60, top: 120, width: 840, height: 300, borderRadius: 20, background: "linear-gradient(180deg,#1C2A22,#24362B)", boxShadow: "inset 0 10px 24px rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 210, letterSpacing: 4, whiteSpace: "nowrap", color: done ? "#FFD27A" : "#B8FFB0", textShadow: `0 0 16px ${done ? "rgba(255,200,90,0.6)" : "rgba(140,255,130,0.5)"}`, transform: `scale(${1 + 0.12 * (1 - Math.min(1, Math.abs(hit - 1) * 3)) * (done ? 1 : 0) + (done ? 0.02 * Math.sin(f / 5) : 0)})` }}>{val}°F</div>
          </div>
          <div style={{ position: "absolute", left: 60, right: 60, top: 440, fontFamily: HAND, fontWeight: 700, fontSize: Math.min(84, Math.floor(820 / (note.length * 0.45))), color: K.ink, whiteSpace: "nowrap", opacity: interpolate(f, [fHit + 4, fHit + 16], [0, 1], CL) }}>{note}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- los cinco errores: cinco bolsas de papel sobre el mostrador; la que toca se adelanta y muestra su rótulo
export const FiveBags: React.FC<{ n: number; text: string; dur: number; seed: number }> = ({ n, text, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: f, fps, config: { damping: 11, mass: 0.8 } });
  return (
    <TileWall dur={dur} seed={seed}>
      <AbsoluteFill style={{ opacity: fadeIO(f, dur, 2, 5) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 800, height: 280, backgroundImage: woodBg, boxShadow: "0 -14px 30px rgba(0,0,0,0.3)" }} />
        {[1, 2, 3, 4, 5].map((i) => {
          const me = i === n, done = i < n;
          const x = 190 + (i - 1) * 330, sc = me ? 0.8 + 0.32 * p : 0.8, y = me ? -20 * p : 0;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: 440 + y, width: 240, height: 380, transformOrigin: "50% 100%", transform: `scale(${sc}) rotate(${me ? Math.sin(f / 9) * 2 : (i % 2 ? -2 : 2)}deg)`, zIndex: me ? 5 : 1, opacity: done ? 0.55 : 1 }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, #B98A55 0%, #D2A572 40%, #C4965F 60%, #A87A47 100%)", clipPath: "polygon(4% 8%, 14% 0, 30% 7%, 48% 1%, 66% 8%, 84% 0, 96% 7%, 100% 100%, 0 100%)", boxShadow: "0 20px 30px rgba(0,0,0,0.35)" }} />
              <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: SERIF, fontSize: 190, lineHeight: 1, color: me ? K.red : "rgba(42,26,18,0.55)" }}>{i}</div>
              {done && <div style={{ position: "absolute", left: 30, top: 190, width: 180, height: 12, background: K.red, transform: "rotate(-20deg)", borderRadius: 6 }} />}
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 0, right: 0, top: 60, display: "flex", justifyContent: "center" }}>
          <div style={{ padding: "22px 56px 30px", backgroundImage: paperBg, boxShadow: "0 22px 44px rgba(0,0,0,0.35)", transform: `rotate(-1.5deg) translateY(${(1 - p) * -300}px)` }}>
            <Write f0={3} len={16} style={{ fontFamily: HAND, fontWeight: 700, fontSize: Math.min(150, Math.floor(1500 / (text.length * 0.45))), lineHeight: 1.05, color: K.ink, whiteSpace: "nowrap", paddingRight: 30 }}>{text}</Write>
          </div>
        </div>
      </AbsoluteFill>
    </TileWall>
  );
};

// ---------- la cuenta sobre el mostrador: una etiqueta de precio clavada en cada lado de la foto y el sello final
export type CTag = { t: string; s: string; f: number; x: number };
export const CounterTags: React.FC<{ img: string; tags: CTag[]; stamp?: string; fStamp?: number; dur: number; seed: number }> = ({ img, tags, stamp, fStamp = 9999, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const st = spring({ frame: f - fStamp, fps, config: { damping: 8, mass: 0.5 } });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.ink, opacity: fadeIO(f, dur, 4, 7) }}>
      <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${interpolate(f, [0, dur], [1.02, 1.1])})`, transformOrigin: "50% 75%" }} />
      {tags.map((g, i) => {
        const d = spring({ frame: f - g.f, fps, config: { damping: 10, mass: 0.8 } });
        if (f < g.f) return null;
        return (
          <div key={i} style={{ position: "absolute", left: g.x - 300, top: 190, width: 600, height: 620, transformOrigin: "50% 100%", transform: `translateY(${(1 - d) * -800}px) rotate(${(i % 2 ? 2 : -2) + Math.sin(f / 15 + i) * 0.8}deg)` }}>
            <div style={{ position: "absolute", left: 292, top: 320, width: 16, height: 300, borderRadius: 8, background: "linear-gradient(90deg, #6F757A 0%, #E9EDF0 45%, #8B9196 100%)", boxShadow: "8px 10px 16px rgba(0,0,0,0.35)" }} />
            <div style={{ position: "absolute", left: 0, top: 0, width: 600, height: 350, background: K.white, border: `10px solid ${K.red}`, borderRadius: 16, boxShadow: "0 26px 50px rgba(0,0,0,0.5)", textAlign: "center", boxSizing: "border-box" }}>
              <div style={{ fontFamily: SERIF, fontSize: Math.min(210, Math.floor(540 / (g.t.length * 0.5))), lineHeight: 1.05, color: K.ink, marginTop: 30, whiteSpace: "nowrap" }}>{g.t}</div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: Math.min(58, Math.floor(560 / (g.s.length * 0.6))), letterSpacing: 1, color: K.red, whiteSpace: "nowrap" }}>{g.s}</div>
            </div>
          </div>
        );
      })}
      {stamp && <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "16px 50px", border: `12px solid ${K.red}`, outline: `4px solid ${K.red}`, outlineOffset: 9, borderRadius: 18, background: "rgba(250,247,240,0.94)", fontFamily: SANS, fontWeight: 600, fontSize: 130, letterSpacing: 8, color: K.red, whiteSpace: "nowrap",
          transform: `rotate(-5deg) scale(${2.6 - 1.6 * Math.min(1.05, st)})`, opacity: Math.min(1, st * 3), boxShadow: "0 16px 30px rgba(0,0,0,0.4)" }}>{stamp}</div>
      </div>}
    </AbsoluteFill>
  );
};

// ---------- máquina de sumar: la cinta de papel sube un renglón cada vez que imprime
export type TLine = { a: string; b: string; f: number; bold?: boolean };
export const AddTape: React.FC<{ head: string; lines: TLine[]; dur: number; seed: number }> = ({ head, lines, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inn = spring({ frame: f, fps, config: { damping: 16 } });
  const LH = 128; let up = 0;
  lines.forEach((l) => { up += spring({ frame: f - l.f, fps, config: { damping: 14, mass: 0.6 } }); });
  const key = lines.some((l) => f >= l.f && f < l.f + 5);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundImage: woodBg, opacity: fadeIO(f, dur, 4, 7) }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 1300px 760px at 50% 30%, rgba(255,225,170,0.22), rgba(0,0,0,0) 70%)" }} />
      <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, dur], [1.2, 1.27])})`, transformOrigin: "50% 100%" }}>
        {/* cinta */}
        <div style={{ position: "absolute", left: 420, top: 0, width: 1080, height: 820, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 820 - 330 - up * LH, width: 1080, minHeight: 1400, background: "linear-gradient(180deg,#FFFEF8,#F4EEDC)", boxShadow: "0 0 30px rgba(0,0,0,0.4)", padding: "30px 70px", boxSizing: "border-box" }}>
            <div style={{ height: 120, fontFamily: SANS, fontWeight: 600, fontSize: 46, letterSpacing: 9, color: K.red, textAlign: "center", whiteSpace: "nowrap" }}>{head}</div>
            {lines.map((l, i) => f < l.f ? null : (
              <div key={i} style={{ height: LH, display: "flex", justifyContent: "space-between", alignItems: "baseline", whiteSpace: "nowrap", fontFamily: l.bold ? SERIF : HAND, fontWeight: 700, fontSize: l.bold ? 100 : 78, color: l.bold ? K.red : K.ink, borderTop: l.bold ? `5px solid ${K.ink}` : "none", opacity: interpolate(f, [l.f, l.f + 4], [0, 1], CL) }}>
                <span>{l.a}</span><span>{l.b}</span>
              </div>
            ))}
          </div>
        </div>
        {/* máquina */}
        <div style={{ position: "absolute", left: 300, top: 790, width: 1320, height: 330, borderRadius: "40px 40px 0 0", background: "linear-gradient(180deg,#5A6A62 0%,#39463F 60%,#2A332E 100%)", boxShadow: "0 -20px 40px rgba(0,0,0,0.45), inset 0 6px 0 rgba(255,255,255,0.2)", transform: `translateY(${(1 - inn) * 300 + (key ? 5 : 0)}px)` }}>
          <div style={{ position: "absolute", left: 100, right: 100, top: -14, height: 34, borderRadius: 12, background: "#1E2420", boxShadow: "inset 0 6px 10px rgba(0,0,0,0.7)" }} />
          {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 150 + i * 88, top: 90 + (key && i % 4 === (Math.floor(f / 3) % 4) ? 8 : 0), width: 66, height: 66, borderRadius: "50%", background: i === 11 ? `radial-gradient(circle at 35% 30%, #E0584E, ${K.red})` : "radial-gradient(circle at 35% 30%, #FAF7F0, #B9B4A6)", boxShadow: "0 6px 0 rgba(0,0,0,0.4)" }} />)}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ====================== componentes propios de stan12o (paleta de cerdo) — CSS y DOM puro ======================
const whitePaper = "linear-gradient(100deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0.04) 55%, rgba(0,0,0,0) 100%), linear-gradient(180deg, #FFFEFA 0%, #F1EDE2 100%)";
const GREASE = "#1b1714";

// ---------- el DÍA escrito a lápiz graso en una hoja de papel blanco de carnicería que cae del rollo sobre la foto
export const DayPaper: React.FC<{ img: string; day: string; what: string; fDay: number; dur: number; seed: number }> = ({ img, day, what, fDay, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const kb = useKB(seed + 11, dur);
  const pull = spring({ frame: f - Math.max(0, fDay - 10), fps, config: { damping: 15, mass: 0.9 } });
  const left = seed % 2 === 0;
  const tear = interpolate(f, [fDay + 2, fDay + 12], [0, 1], CL);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}>
      <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
      {/* rollo de papel en su cortador, arriba */}
      <div style={{ position: "absolute", [left ? "left" : "right"]: 90, top: -70, width: 820, height: 120, borderRadius: 60, background: "linear-gradient(180deg,#FFFFFF 0%,#E9E4D6 55%,#C9C3B2 100%)", boxShadow: "0 16px 26px rgba(0,0,0,0.4)" } as React.CSSProperties} />
      <div style={{ position: "absolute", [left ? "left" : "right"]: 70, top: 34, width: 860, height: 16, background: "linear-gradient(180deg,#8B9196,#4D5357)", boxShadow: "0 6px 8px rgba(0,0,0,0.4)" } as React.CSSProperties} />
      {/* la hoja */}
      <div style={{ position: "absolute", [left ? "left" : "right"]: 120, top: 40, width: 760, height: 560 * pull, overflow: "hidden", backgroundImage: whitePaper, boxShadow: "0 26px 44px rgba(0,0,0,0.45)", transform: `rotate(${(left ? -1 : 1) * tear * 2.2}deg) translateY(${tear * 26}px)`, transformOrigin: "50% 0%",
        clipPath: "polygon(0 0, 100% 0, 100% 97%, 94% 100%, 88% 97%, 81% 100%, 74% 97.4%, 66% 100%, 58% 97%, 50% 100%, 42% 97.4%, 34% 100%, 26% 97%, 18% 100%, 10% 97.4%, 4% 100%, 0 97%)" } as React.CSSProperties}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 96, textAlign: "center" }}>
          <Write f0={fDay} len={14} style={{ display: "inline-block", fontFamily: HAND, fontWeight: 700, fontSize: day.length > 8 ? 150 : 190, lineHeight: 1, color: GREASE, whiteSpace: "nowrap", paddingRight: 20, transform: "rotate(-3deg)" }}>{day}</Write>
          <div style={{ height: 12, width: 520 * interpolate(f, [fDay + 12, fDay + 24], [0, 1], CL), background: GREASE, borderRadius: 6, margin: "6px auto 0", transform: "rotate(-2deg)", opacity: 0.85 }} />
          <Write f0={fDay + 20} len={16} style={{ display: "inline-block", fontFamily: HAND, fontWeight: 700, fontSize: Math.min(92, Math.floor(680 / (what.length * 0.46))), lineHeight: 1.1, color: K.red, whiteSpace: "nowrap", marginTop: 34, paddingRight: 16 }}>{what}</Write>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- tres etiquetas de cartón atadas con hilo a los ganchos del riel: cada una baja y se da vuelta en su palabra
export type TTag = { big: string; sub: string; f: number };
export const TriTags: React.FC<{ head: string; tags: TTag[]; source: string; dur: number; seed: number }> = ({ head, tags, source, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return (
    <TileWall dur={dur} seed={seed}>
      <AbsoluteFill style={{ opacity: fadeIO(f, dur, 3, 6), transform: `scale(${interpolate(f, [0, dur], [1, 1.05])})`, transformOrigin: "50% 20%" }}>
        <div style={{ position: "absolute", left: -40, right: -40, top: 70, height: 26, background: "linear-gradient(180deg,#E9EDF0 0%,#8B9196 55%,#5D6367 100%)", boxShadow: "0 12px 18px rgba(0,0,0,0.3)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 118, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 46, letterSpacing: 10, color: K.red }}>{head}</div>
        {tags.map((t, i) => {
          const d = spring({ frame: f - t.f, fps, config: { damping: 10, mass: 0.9 } });
          const x = 330 + i * 630, sw = 9 * Math.exp(-Math.max(0, f - t.f) / 26) * Math.cos((f - t.f) / 6.5) + 1.2 * Math.sin(f / 21 + i);
          return (
            <div key={i} style={{ position: "absolute", left: x - 260, top: 80, width: 520, height: 800, transformOrigin: "260px 0px", transform: `rotate(${f < t.f ? 0 : sw}deg)`, opacity: f < t.f ? 0.0 : 1 }}>
              <div style={{ position: "absolute", left: 257, top: 0, width: 6, height: 190 * Math.min(1, d) + 10, background: "#6B4A2A" }} />
              <div style={{ position: "absolute", left: 0, top: 180 * Math.min(1, d) - 20 + 200 * (1 - Math.min(1, d)) * -1, width: 520, height: 520, background: "linear-gradient(170deg,#F2DEB6 0%,#E3C48E 100%)", boxShadow: "0 26px 44px rgba(0,0,0,0.4)", borderRadius: 18,
                clipPath: "polygon(22% 0, 78% 0, 100% 16%, 100% 100%, 0 100%, 0 16%)", textAlign: "center" }}>
                <div style={{ position: "absolute", left: 240, top: 26, width: 40, height: 40, borderRadius: "50%", background: K.ink, opacity: 0.7 }} />
                <div style={{ fontFamily: SERIF, fontSize: Math.min(190, Math.floor(470 / (t.big.length * 0.52))), lineHeight: 1, color: K.ink, marginTop: 130, whiteSpace: "nowrap" }}>{t.big}</div>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 52, letterSpacing: 6, color: K.red, marginTop: 4 }}>DAYS</div>
                <div style={{ height: 6, background: K.ink, opacity: 0.5, margin: "20px 60px 14px" }} />
                <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: Math.min(84, Math.floor(480 / (t.sub.length * 0.43))), lineHeight: 1.05, color: K.ink, whiteSpace: "nowrap" }}>{t.sub}</div>
              </div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 42, color: "rgba(42,26,18,0.8)", opacity: interpolate(f, [20, 32], [0, 1], CL) }}>{source}</div>
      </AbsoluteFill>
    </TileWall>
  );
};

// ---------- pincho de comandas: cada cena es una comanda que se clava en el pincho del mostrador
export const OrderSpike: React.FC<{ n: number; name: string; img: string; dur: number; seed: number }> = ({ n, name, img, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const kb = useKB(seed + 2, dur);
  const d = spring({ frame: f - 6, fps, config: { damping: 9, mass: 0.8 } });
  const y = (1 - Math.min(1, d)) * -700;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}>
      <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
      <div style={{ position: "absolute", left: 1150, top: 150, width: 660, height: 860, transform: `scale(${interpolate(f, [0, dur], [1, 1.04])})`, transformOrigin: "50% 100%" }}>
        {/* base y pincho */}
        <div style={{ position: "absolute", left: 180, bottom: 0, width: 300, height: 54, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 30%, #F4F6F7, #7B8186 75%)", boxShadow: "0 18px 24px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", left: 324, bottom: 28, width: 12, height: 760, borderRadius: "6px 6px 0 0", background: "linear-gradient(90deg,#6F757A,#F4F6F7,#8B9196)", clipPath: "polygon(50% 0, 100% 6%, 100% 100%, 0 100%, 0 6%)" }} />
        {/* comandas ya clavadas */}
        {Array.from({ length: n - 1 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: 90 + ((i * 37) % 40) - 20, bottom: 70 + i * 34, width: 480, height: 150, backgroundImage: whitePaper, boxShadow: "0 8px 12px rgba(0,0,0,0.3)", transform: `rotate(${((i * 53) % 13) - 6}deg)`, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 30, boxSizing: "border-box", fontFamily: SERIF, fontSize: 84, color: "rgba(42,26,18,0.45)" }}>{i + 1}</div>
        ))}
        {/* la comanda de esta cena */}
        <div style={{ position: "absolute", left: 30, bottom: 70 + (n - 1) * 34, width: 600, height: 330, backgroundImage: whitePaper, boxShadow: "0 22px 34px rgba(0,0,0,0.45)", transform: `translateY(${y}px) rotate(${-4 + Math.sin(f / 17) * 0.8}deg)`, textAlign: "center" }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 44, letterSpacing: 12, color: K.red, marginTop: 26 }}>DINNER</div>
          <div style={{ fontFamily: SERIF, fontSize: 170, lineHeight: 0.95, color: K.ink }}>{n}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: Math.min(72, Math.floor(540 / (name.length * 0.45))), lineHeight: 1, color: GREASE, whiteSpace: "nowrap" }}>{name}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- pila de platos: crece de a uno en cada cifra dicha; al costado, la cuenta escrita a lápiz graso
export type SRow = { day: string; n: number; f: number };
export const PlateStack: React.FC<{ from: number; rows: SRow[]; final?: string; fFinal?: number; dur: number; seed: number }> = ({ from, rows, final, fFinal = 9999, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  let total = from; const grow: number[] = [];
  rows.forEach((r) => { if (r.f >= 0) for (let k = 0; k < r.n; k++) grow.push(r.f + k * 4); });
  grow.forEach((g) => { if (f >= g) total++; });
  const all = from + grow.length, MAXP = 19, PH = 30;
  const st = spring({ frame: f - fFinal, fps, config: { damping: 8, mass: 0.5 } });
  return (
    <TileWall dur={dur} seed={seed}>
      <AbsoluteFill style={{ opacity: fadeIO(f, dur, 3, 6) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 880, height: 200, backgroundImage: woodBg, boxShadow: "0 -14px 30px rgba(0,0,0,0.3)" }} />
        {/* pila */}
        {Array.from({ length: Math.min(MAXP, all) }, (_, i) => {
          const born = i < from ? -99 : grow[i - from];
          const d = spring({ frame: f - born, fps, config: { damping: 9, mass: 0.6 } });
          if (f < born) return null;
          return <div key={i} style={{ position: "absolute", left: 300 + ((i * 29) % 14) - 7, top: 850 - i * PH - (1 - Math.min(1, d)) * 500, width: 520, height: 70, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 30%, #FFFFFF 0%, #EDEAE0 55%, #BDB8A9 100%)", boxShadow: "0 10px 12px rgba(0,0,0,0.3), inset 0 -8px 0 rgba(0,0,0,0.08)" }} />;
        })}
        <div style={{ position: "absolute", left: 300, top: 850 - Math.min(MAXP, total) * PH - 250, width: 520, textAlign: "center", fontFamily: SERIF, fontSize: 250, lineHeight: 1, color: K.red }}>{total}</div>
        {/* la cuenta en papel blanco */}
        <div style={{ position: "absolute", left: 1010, top: 70, width: 780, minHeight: 620, backgroundImage: whitePaper, boxShadow: "0 26px 44px rgba(0,0,0,0.35)", padding: "36px 50px 46px", boxSizing: "border-box", transform: "rotate(1.5deg)" }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 44, letterSpacing: 9, color: K.red }}>PLATES THIS WEEK</div>
          {rows.map((r, i) => f < r.f - 14 ? null : (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: HAND, fontWeight: 700, fontSize: 84, lineHeight: 1.22, color: GREASE, whiteSpace: "nowrap" }}>
              <Write f0={r.f - 14} len={10}>{r.day}</Write>
              <Write f0={r.f} len={6} style={{ color: K.red, paddingRight: 14 }}>{`${r.n}`}</Write>
            </div>
          ))}
          {final && <div style={{ marginTop: 20, fontFamily: HAND, fontWeight: 700, fontSize: 104, lineHeight: 1.05, color: K.red, opacity: Math.min(1, st * 3), transform: `scale(${1.8 - 0.8 * Math.min(1.05, st)})`, transformOrigin: "0 50%" }}>{final}</div>}
        </div>
      </AbsoluteFill>
    </TileWall>
  );
};

// ---------- la cuenta a lápiz graso sobre la hoja de papel blanco que baja del rollo (sin foto): renglón por cifra
export type PLine = { a: string; b: string; f: number; bold?: boolean };
export const PaperBill: React.FC<{ head: string; lines: PLine[]; dur: number; seed: number }> = ({ head, lines, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const pull = spring({ frame: f, fps, config: { damping: 16, mass: 1 } });
  return (
    <TileWall dur={dur} seed={seed}>
      <AbsoluteFill style={{ opacity: fadeIO(f, dur, 3, 6), transform: `scale(${interpolate(f, [0, dur], [1, 1.05])})`, transformOrigin: "50% 10%" }}>
        <div style={{ position: "absolute", left: 330, top: -60, width: 1260, height: 130, borderRadius: 65, background: "linear-gradient(180deg,#FFFFFF 0%,#E9E4D6 55%,#C9C3B2 100%)", boxShadow: "0 16px 26px rgba(0,0,0,0.35)" }} />
        <div style={{ position: "absolute", left: 300, top: 52, width: 1320, height: 18, background: "linear-gradient(180deg,#8B9196,#4D5357)", boxShadow: "0 6px 8px rgba(0,0,0,0.35)" }} />
        <div style={{ position: "absolute", left: 380, top: 60, width: 1160, height: 940 * pull, overflow: "hidden", backgroundImage: whitePaper, boxShadow: "0 26px 44px rgba(0,0,0,0.35)" }}>
          <div style={{ padding: "46px 70px" }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 50, letterSpacing: 10, color: K.red, whiteSpace: "nowrap" }}>{head}</div>
            <div style={{ height: 8, background: GREASE, opacity: 0.8, margin: "14px 0 18px", borderRadius: 4 }} />
            {lines.map((l, i) => f < l.f ? null : (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", whiteSpace: "nowrap", fontFamily: HAND, fontWeight: 700, fontSize: l.bold ? 116 : 98, lineHeight: 1.28, color: l.bold ? K.red : GREASE, gap: 30 }}>
                <Write f0={l.f} len={12}>{l.a}</Write>
                <Write f0={l.f + 8} len={8} style={{ paddingRight: 16 }}>{l.b}</Write>
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </TileWall>
  );
};
