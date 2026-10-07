// OpTally — pizarra de tiza colgada de un clavo DENTRO del gallinero (sobre la foto/clip de cama con Ken-Burns):
// el número del error, el error escrito con tiza, las rayitas de "gallinas perdidas" que se dibujan una por una
// (grupos de 5 con la diagonal), la etiqueta kraft atada con hilo que entra columpiándose con el arreglo y su costo,
// y el total acumulado abajo. Modo resumen (rows): las 9 filas con sus rayitas y el total final.
// Props: n, title, lost, fix, cost, total (perdidas ANTES de este error), bed, rows [{n,title,lost}], sumLabel.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { OP, LABEL, HAND, rnd } from "./OpTheme";
import { OpBed, ease } from "./OpParts";

const CHALK = "#F4F1E8";
const chalkTxt = (size: number): React.CSSProperties => ({ fontFamily: HAND, fontWeight: 700, fontSize: size, color: CHALK, lineHeight: 1.0, textShadow: "0 0 2px rgba(255,255,255,0.55), 1px 1px 0 rgba(0,0,0,0.25)", opacity: 0.93 });

// texto de tiza que se revela de izquierda a derecha (como la mano que escribe)
const ChalkWrite: React.FC<{ text: string; at: number; size: number; dur?: number; style?: React.CSSProperties }> = ({ text, at, size, dur, style }) => {
  const f = useCurrentFrame();
  const d = dur ?? Math.max(8, text.length * 1.3);
  const k = interpolate(f, [at, at + d], [0, 100], ease);
  return <div style={{ ...chalkTxt(size), clipPath: `inset(-20% ${100 - k}% -20% -5%)`, whiteSpace: "nowrap", ...style }}>{text}</div>;
};

// rayitas de tiza: grupos de 4 verticales + diagonal; cada trazo se dibuja en 5 cuadros
const Tally: React.FC<{ count: number; at: number; every?: number; h?: number; seed?: number }> = ({ count, at, every = 7, h = 92, seed = 1 }) => {
  const f = useCurrentFrame();
  const strokes: React.ReactNode[] = [];
  const gw = 4 * 26 + 40;
  for (let i = 0; i < count; i++) {
    const g = Math.floor(i / 5), j = i % 5, x0 = g * gw;
    const k = interpolate(f, [at + i * every, at + i * every + 5], [0, 1], ease);
    const jit = (o: number) => (rnd(seed * 97 + i * 13 + o) - 0.5) * 8;
    let x1: number, y1: number, x2: number, y2: number;
    if (j < 4) { x1 = x0 + j * 26 + 10 + jit(1); y1 = 6 + jit(2); x2 = x0 + j * 26 + 10 + jit(3); y2 = h - 6 + jit(4); }
    else { x1 = x0 - 6; y1 = h - 16; x2 = x0 + 4 * 26 + 6; y2 = 14; }
    strokes.push(<line key={i} x1={x1} y1={y1} x2={x1 + (x2 - x1) * k} y2={y1 + (y2 - y1) * k} stroke={CHALK} strokeWidth={9} strokeLinecap="round" opacity={k > 0 ? 0.92 : 0} />);
  }
  const groups = Math.ceil(count / 5);
  return <svg width={Math.max(1, groups * gw)} height={h} style={{ overflow: "visible", filter: "drop-shadow(0 0 1.5px rgba(255,255,255,0.5))" }}>{strokes}</svg>;
};

// pizarra con marco de madera, en perspectiva leve, colgada de un clavo con hilo
const Slate: React.FC<{ w: number; h: number; children: React.ReactNode; seed: number }> = ({ w, h, children, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 7, stiffness: 60 } });
  const sway = (1 - s) * 7 + Math.sin(f / 22) * 0.35;
  const ry = -9 + (rnd(seed) - 0.5) * 6;
  return (
    <div style={{ position: "relative", width: w, height: h, transformOrigin: "50% -70px", transform: `perspective(1800px) rotateY(${ry}deg) rotateX(3deg) rotateZ(${sway.toFixed(3)}deg)` }}>
      <svg width={w} height={90} style={{ position: "absolute", left: 0, top: -88, overflow: "visible" }}>
        <line x1={w * 0.22} y1={86} x2={w / 2} y2={6} stroke="#4a3b28" strokeWidth={5} />
        <line x1={w * 0.78} y1={86} x2={w / 2} y2={6} stroke="#4a3b28" strokeWidth={5} />
        <circle cx={w / 2} cy={6} r={9} fill="#6b6359" stroke="#3b3631" strokeWidth={2} />
      </svg>
      <div style={{ position: "absolute", inset: 0, borderRadius: 6, background: "linear-gradient(135deg,#8a6236,#6a4524 55%,#7d5730)", boxShadow: "0 30px 50px rgba(0,0,0,0.55), inset 0 0 0 2px rgba(0,0,0,0.25)" }} />
      <div style={{ position: "absolute", inset: 22, borderRadius: 3, overflow: "hidden", backgroundColor: "#2e3430",
        backgroundImage: "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.10), transparent 60%), radial-gradient(ellipse at 75% 85%, rgba(255,255,255,0.06), transparent 55%), repeating-linear-gradient(8deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 7px), repeating-linear-gradient(-14deg, rgba(255,255,255,0.02) 0 3px, transparent 3px 11px)",
        boxShadow: "inset 0 0 40px rgba(0,0,0,0.55)" }}>
        <div style={{ position: "absolute", inset: 0, padding: "34px 44px" }}>{children}</div>
      </div>
      {/* luz de la puerta: degradado cálido que barre la pizarra */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 6, background: "linear-gradient(100deg, rgba(255,214,150,0.16), transparent 45%, rgba(0,0,0,0.18))", pointerEvents: "none" }} />
    </div>
  );
};

// etiqueta kraft atada con hilo, entra columpiándose
const PriceTag: React.FC<{ fix: string; cost: string; at: number }> = ({ fix, cost, at }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 6, stiffness: 70 } });
  const rot = (1 - s) * 38 + Math.sin((f - at) / 9) * 2 * Math.max(0, 1 - (f - at) / 90) - 4;
  return (
    <div style={{ opacity: interpolate(f, [at, at + 3], [0, 1], ease), transformOrigin: "50% -120px", transform: `rotate(${rot.toFixed(2)}deg)` }}>
      <svg width={40} height={120} style={{ position: "absolute", left: "50%", top: -120, marginLeft: -20 }}><path d="M20 0 C 10 40, 30 80, 20 120" stroke="#4a3b28" strokeWidth={4} fill="none" /></svg>
      <div style={{ position: "relative", width: 470, padding: "26px 34px 26px 70px", background: OP.kraft, clipPath: "polygon(48px 0,100% 0,100% 100%,48px 100%,0 50%)", boxShadow: "0 18px 30px rgba(0,0,0,0.45)",
        backgroundImage: "repeating-linear-gradient(45deg, rgba(90,60,20,0.07) 0 3px, transparent 3px 9px)" }}>
        <div style={{ position: "absolute", left: 22, top: "50%", width: 18, height: 18, marginTop: -9, borderRadius: 9, background: "#5a3d1d", boxShadow: "inset 0 2px 3px rgba(0,0,0,0.6)" }} />
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 28, letterSpacing: 6, color: OP.redDeep, textTransform: "uppercase" }}>the fix</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 54, color: OP.pencil, lineHeight: 1.0 }}>{fix}</div>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 64, color: OP.red, marginTop: 4 }}>{cost}</div>
      </div>
    </div>
  );
};

export const OpTally: React.FC<{ n?: number; title?: string; lost?: number; fix?: string; cost?: string; total?: number; bed?: string; seed?: number;
  rows?: { n: number; title: string; lost: number }[]; sumLabel?: string; lostText?: string; noRunning?: boolean }> = ({ n = 9, title = "", lost = 1, fix = "", cost = "", total = 0, bed, seed = 5, rows, sumLabel = "hens lost", lostText, noRunning }) => {
  const f = useCurrentFrame();
  if (rows && rows.length) {
    const sum = rows.reduce((a, r) => a + r.lost, 0);
    const shownSum = Math.round(interpolate(f, [10, 10 + rows.length * 9 + 20], [0, sum], ease));
    return (
      <AbsoluteFill>
        <OpBed src={bed} seed={seed} dim={0.28} />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 70 }}>
          <Slate w={1500} h={880} seed={seed}>
            <ChalkWrite text="my coop notebook · 50 years" at={4} size={50} />
            <div style={{ marginTop: 14 }}>
              {rows.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", height: 66, gap: 26 }}>
                  <div style={{ ...chalkTxt(50), width: 70, opacity: interpolate(f, [10 + i * 9, 14 + i * 9], [0, 0.93], ease) }}>#{r.n}</div>
                  <ChalkWrite text={r.title} at={10 + i * 9} size={46} dur={10} style={{ width: 640 }} />
                  <Tally count={r.lost} at={14 + i * 9} every={1.6} h={46} seed={seed + i} />
                </div>
              ))}
            </div>
            <div style={{ position: "absolute", right: 60, bottom: 40, display: "flex", alignItems: "baseline", gap: 18 }}>
              <div style={{ ...chalkTxt(52) }}>{sumLabel}</div>
              <div style={{ ...chalkTxt(130), color: "#ffd9a0" }}>{shownSum}</div>
            </div>
          </Slate>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  const tallyAt = 26, tagAt = tallyAt + Math.max(1, lost) * 7 + 14;
  const running = Math.round(interpolate(f, [tallyAt, tallyAt + Math.max(1, lost) * 7], [total, total + lost], ease));
  return (
    <AbsoluteFill>
      <OpBed src={bed} seed={seed} dim={0.22} />
      <div style={{ position: "absolute", left: 150, top: 150 }}>
        <Slate w={1020} h={720} seed={seed}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
            <div style={{ ...chalkTxt(150), color: "#ffd9a0" }}>#{n}</div>
            <ChalkWrite text={title} at={8} size={74} />
          </div>
          <div style={{ marginTop: 34 }}>
            <ChalkWrite text={lostText || (lost === 1 ? "cost me 1 hen" : `cost me ${lost} hens`)} at={18} size={52} dur={10} />
            <div style={{ marginTop: 18, minHeight: 100 }}><Tally count={lost} at={tallyAt} seed={seed} /></div>
          </div>
          {noRunning ? null : <div style={{ position: "absolute", left: 44, bottom: 30, display: "flex", alignItems: "baseline", gap: 14, opacity: interpolate(f, [tallyAt, tallyAt + 6], [0, 1], ease) }}>
            <div style={{ ...chalkTxt(42) }}>hens lost so far:</div>
            <div style={{ ...chalkTxt(76), color: "#ffd9a0" }}>{running}</div>
          </div>}
        </Slate>
      </div>
      {fix ? <div style={{ position: "absolute", right: 150, top: 330 }}><PriceTag fix={fix} cost={cost} at={tagAt} /></div> : null}
    </AbsoluteFill>
  );
};
