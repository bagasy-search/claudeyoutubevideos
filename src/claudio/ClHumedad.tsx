// Kit de la HUMEDAD QUE SUBE (Claudio el Albañil, ep. 3 "La casa de Doña Marta"), dentro del mundo (cama real + sombra + luz):
//   ClWickWall   corte de la pared de la sala sobre el suelo: el agua sube por los canalitos del ladrillo hasta ~1 m, la sal se junta en la
//                cara de adentro y empuja la pintura. mode: "rise" (sube + salitre) · "trap" (pintura impermeable: el agua encerrada infla
//                ampollas más grandes) · "breathe" (pintura que respira + repello con hidrófugo: el vapor sale, nada se infla) ·
//                "planter" (afuera: la jardinera con tierra más alta que el piso de adentro + la canaleta descargando al pie del muro)
//   ClThreeDamp  las 3 humedades de una casa sobre la silueta de una pared: aire (arriba, esquinas) · lluvia (grieta/techo) · suelo (zócalo,
//                hasta 1 m). pick = la que se resalta (0,1,2) o -1 = las tres en orden
//   ClPencilLine la prueba del lápiz: raya en el borde de la mancha + la fecha; llega la lluvia; result "up" (la mancha pasa la raya: viene de
//                afuera) · "still" (se queda en la raya: sube del suelo)
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, rnd, clamp01, ease, hexA } from "./ClTheme";
import { Bed, Contact, RoomLight, lin, pop, useOut } from "./ClParts";

const WATER = "#3D8FD6";
const Tag: React.FC<{ x: number; y: number; text: string; color?: string; o?: number; size?: number }> = ({ x, y, text, color = CL.navy, o = 1, size = 40 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, background: color, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: size, letterSpacing: 2, padding: "6px 20px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 12px 26px ${CL.shadow}`, borderBottom: `5px solid ${CL.yellow}` }}>{text}</div>
);

// ───────────────── ClWickWall
export const ClWickWall: React.FC<{ mode?: "rise" | "trap" | "breathe" | "planter"; bed?: string }> = ({ mode = "rise", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const rise = ease(clamp01((f - 10) / (T * 0.45)));
  const GY = 820, WX = 760, WW = 300, H = 560; // suelo, pared (x, ancho), alto visible
  const top = GY - H;
  const wetH = (mode === "breathe" ? 0.55 : 1) * 330 * rise; // ~1 m
  const blis = mode === "breathe" ? 0 : clamp01((f - T * 0.4) / (T * 0.4)) * (mode === "trap" ? 1.8 : 1);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={161} dim={0.4} />
      <Contact x={960} y={GY + 150} w={1400} o={0.3} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        {/* suelo */}
        <rect x={200} y={GY} width={1520} height={180} fill="#7E5C3B" />
        {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={220 + rnd(i) * 1480} cy={GY + 20 + rnd(i + 5) * 150} r={3 + rnd(i + 9) * 5} fill={hexA(WATER, 0.5)} />)}
        {/* piso de adentro (derecha) más bajo que la tierra de afuera si planter */}
        <rect x={WX + WW} y={GY - 20} width={1720 - WX - WW} height={20} fill="#B4503A" />
        {mode === "planter" ? <path d={`M200 ${GY} L200 ${GY - 120} L${WX} ${GY - 120} L${WX} ${GY}`} fill="#8E6A45" /> : null}
        {/* el muro: ladrillos */}
        <rect x={WX} y={top} width={WW} height={H + 20} fill="#B5643E" />
        {Array.from({ length: 14 }, (_, r) => <line key={r} x1={WX} x2={WX + WW} y1={top + r * 42} y2={top + r * 42} stroke="#D9C9B4" strokeWidth={5} />)}
        {/* agua subiendo por los canalitos */}
        <rect x={WX} y={GY + 20 - wetH} width={WW} height={wetH} fill={hexA(WATER, 0.42)} />
        {Array.from({ length: 9 }, (_, i) => <line key={i} x1={WX + 20 + i * 32} x2={WX + 20 + i * 32 + Math.sin(i) * 6} y1={GY + 20} y2={GY + 20 - wetH * (0.8 + 0.2 * rnd(i))} stroke={WATER} strokeWidth={3} strokeDasharray="6 8" strokeDashoffset={f * 2} opacity={0.8} />)}
        {/* repello + pintura de adentro (cara derecha) */}
        <rect x={WX + WW} y={top} width={22} height={H} fill={mode === "breathe" ? "#D7D2C6" : "#CFC8BA"} />
        <rect x={WX + WW + 22} y={top} width={8} height={H} fill={mode === "trap" ? "#E8F0F7" : "#CFE3D6"} />
        {/* salitre y ampollas en la cara de adentro */}
        {Array.from({ length: 7 }, (_, i) => { const y = GY - 40 - i * 42; const r = (10 + 10 * rnd(i)) * blis; return r > 0.5 && GY - y < wetH + 30 ? <ellipse key={i} cx={WX + WW + 30 + r * 0.6} cy={y} rx={r * 0.8} ry={r} fill="#EFEBE1" stroke="#9C968A" strokeWidth={2} /> : null; })}
        {mode !== "breathe" ? Array.from({ length: 30 }, (_, i) => <circle key={"s" + i} cx={WX + WW + 32 + rnd(i) * 14} cy={GY - 20 - rnd(i + 3) * wetH} r={2.5} fill="#FFFFFF" opacity={blis > 0 ? 1 : rise} />) : null}
        {/* vapor que sale (breathe) */}
        {mode === "breathe" ? [0, 1, 2].map((i) => { const t = ((f * 0.02 + i / 3) % 1); return <path key={i} d={`M${WX + WW + 40} ${GY - 80 - i * 50} q 30 -20 60 0 t 60 0`} fill="none" stroke={hexA("#FFFFFF", 0.9)} strokeWidth={6} transform={`translate(${t * 120},${-t * 30})`} opacity={1 - t} />; }) : null}
        {/* canaleta descargando (planter) */}
        {mode === "planter" ? (<g><rect x={WX - 30} y={top - 40} width={26} height={H - 60} fill="#9AA0A6" />{Array.from({ length: 5 }, (_, i) => { const t = (f * 0.05 + i / 5) % 1; return <rect key={i} x={WX - 26} y={top + H - 100 + t * 120} width={18} height={26} rx={9} fill={WATER} opacity={1 - t} />; })}</g>) : null}
      </svg>
      <Tag x={WX - 520} y={top - 10} text={mode === "planter" ? "Afuera: la jardinera" : "Afuera"} color={CL.navy} o={lin(f, 6, 14)} size={34} />
      <Tag x={WX + WW + 80} y={top - 10} text="Adentro: la sala" color={CL.navy} o={lin(f, 6, 14)} size={34} />
      <Tag x={WX + WW + 80} y={GY - wetH - 30} text={mode === "breathe" ? "El vapor sale" : "Hasta 1 metro"} color={mode === "breathe" ? "#3E8A3A" : WATER} o={lin(f, T * 0.3, T * 0.4)} size={34} />
      {mode === "trap" ? <Tag x={WX + WW + 80} y={GY - 120} text="Impermeable: se infla más" color={CL.red} o={lin(f, T * 0.6, T * 0.7)} size={34} /> : null}
      {mode === "rise" ? <Tag x={WX + WW + 80} y={GY - 120} text="La sal empuja la pintura" color={CL.red} o={lin(f, T * 0.6, T * 0.7)} size={34} /> : null}
      {mode === "planter" ? <Tag x={240} y={GY - 200} text="Tierra más alta que el piso" color={CL.red} o={lin(f, T * 0.5, T * 0.6)} size={34} /> : null}
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};

// ───────────────── ClThreeDamp
const KINDS = [
  { k: "Aire", sub: "condensación · arriba, en las esquinas", c: "#5A8FC2" },
  { k: "Lluvia", sub: "filtración · aparece cuando llueve", c: "#7A6BB0" },
  { k: "Suelo", sub: "sube del piso · hasta 1 metro", c: CL.red },
];
export const ClThreeDamp: React.FC<{ pick?: number; bed?: string }> = ({ pick = -1, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const on = (i: number) => (pick === -1 ? lin(f, 8 + i * T * 0.25, 18 + i * T * 0.25) : i === pick ? lin(f, 6, 14) : 0.25);
  const X = 260, Y = 180, W = 760, Hh = 700;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={171} dim={0.38} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <rect x={X} y={Y} width={W} height={Hh} fill="#CFE3D6" stroke={CL.ink} strokeWidth={10} />
        <rect x={X} y={Y + Hh - 30} width={W} height={30} fill="#E9E1D2" stroke={CL.ink} strokeWidth={5} />
        {/* aire: esquinas de arriba */}
        <g opacity={on(0)}>{Array.from({ length: 30 }, (_, i) => <circle key={i} cx={X + 20 + rnd(i) * 160} cy={Y + 20 + rnd(i + 2) * 140} r={4 + rnd(i + 4) * 9} fill="#1A1C14" />)}{Array.from({ length: 20 }, (_, i) => <circle key={"b" + i} cx={X + W - 20 - rnd(i + 7) * 140} cy={Y + 20 + rnd(i + 8) * 110} r={4 + rnd(i + 4) * 8} fill="#1A1C14" />)}</g>
        {/* lluvia: mancha desde una grieta del techo */}
        <g opacity={on(1)}><path d={`M${X + 430} ${Y} l 10 60 l -14 50 l 12 60`} stroke={CL.ink} strokeWidth={5} fill="none" /><ellipse cx={X + 440} cy={Y + 190} rx={120} ry={150} fill="rgba(140,105,60,0.45)" /></g>
        {/* suelo: franja inflada desde el zócalo */}
        <g opacity={on(2)}><rect x={X} y={Y + Hh - 260} width={W} height={230} fill="rgba(120,130,110,0.45)" />{Array.from({ length: 18 }, (_, i) => <ellipse key={i} cx={X + 30 + rnd(i) * (W - 60)} cy={Y + Hh - 60 - rnd(i + 3) * 170} rx={14} ry={18} fill="#EFEBE1" stroke="#9C968A" strokeWidth={2} />)}</g>
      </svg>
      {KINDS.map((k, i) => (
        <div key={i} style={{ position: "absolute", left: 1110, top: 220 + i * 230, opacity: 0.25 + 0.75 * on(i), translate: `${(1 - on(i)) * 40}px 0` }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: k.c, lineHeight: 1 }}>{i + 1}. {k.k}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: CL.ink }}>{k.sub}</div>
        </div>
      ))}
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};

// ───────────────── ClPencilLine
export const ClPencilLine: React.FC<{ result?: "up" | "still"; date?: string; bed?: string }> = ({ result = "up", date = "7/10", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const draw = clamp01((f - 10) / 14), dk = lin(f, 22, 30), rain = lin(f, T * 0.35, T * 0.45) * (1 - lin(f, T * 0.7, T * 0.78));
  const grow = result === "up" ? ease(clamp01((f - T * 0.45) / (T * 0.3))) : 0;
  const X = 460, Y = 140, W = 1000, H = 760, line = Y + 380;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={181} dim={0.35} />
      <div style={{ position: "absolute", left: X, top: Y, width: W, height: H, borderRadius: 16, overflow: "hidden", boxShadow: `0 26px 56px ${CL.shadow}`, border: `8px solid ${CL.white}`, background: "#CFE3D6", opacity: clamp01(p * 1.4) }}>
        {/* mancha de abajo */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: H - (line - Y) + 10 + grow * 120, background: "linear-gradient(0deg, rgba(110,120,100,0.6), rgba(110,120,100,0.35) 85%, rgba(110,120,100,0))" }} />
        {/* lluvia por la ventana (franja de arriba) */}
        {Array.from({ length: 26 }, (_, i) => { const t = ((f * 0.06 + rnd(i)) % 1); return <div key={i} style={{ position: "absolute", left: 30 + rnd(i + 3) * (W - 60), top: -20 + t * 260, width: 3, height: 26, background: "rgba(80,120,170,0.6)", opacity: rain }} />; })}
        {/* la raya de lápiz y la fecha */}
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d={`M 80 ${line - Y} q 200 -8 420 2 t 420 -4`} stroke="#3A3A3A" strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={900} strokeDashoffset={900 * (1 - draw)} />
        </svg>
        <div style={{ position: "absolute", left: W - 230, top: line - Y - 70, fontFamily: HAND, fontWeight: 700, fontSize: 56, color: "#3A3A3A", opacity: dk }}>{date}</div>
      </div>
      <div style={{ position: "absolute", left: X, top: Y + H + 26, opacity: lin(f, T * 0.7, T * 0.8) }}>
        <Tag x={0} y={0} text={result === "up" ? "Pasó la raya: viene de afuera" : "Quieta en la raya: sube del suelo"} color={result === "up" ? CL.red : WATER} />
      </div>
      <div style={{ position: "absolute", left: 110, top: 60, opacity: lin(f, 4, 12) }}><Tag x={0} y={0} text="La prueba de $0 · un lápiz" /></div>
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};
