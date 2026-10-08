// Kit del ep. 5 (mecbebe: el aceite de bebé en el auto, dónde sí y dónde no) — todo DENTRO del mundo (cama real + luz + sombra).
//   ClOilMap13   la hoja "ACEITE DE BEBÉ · 13 USOS" sobre el banco: el sedán desde arriba y 13 pines (1-7 verdes ✓ sí · 8-13 rojos ✗ no) ·
//                upto = cuántos se ven · n = el que se agranda con su etiqueta · all = caen todos
//   ClDropTest   el faro amarillo de cerca: el dedo con una gota pasa una franja · "surface" la franja queda transparente (se pule) ·
//                "inside" sigue opaco (humedad adentro: no hay pulido)
//   ClGrip       el pedal de freno de costado con la suela: "dry" la suela agarra y frena · "oiled" la suela resbala del pedal y el auto
//                sigue medio metro
//   ClSealSwell  el corte de la goma de la puerta con el mes que corre (0 → 12): "oil" se hincha, se deforma y entra el agua · "silicone"
//                sigue igual y la puerta sella
//   ClGlare      el parabrisas visto desde el asiento: "oil" el tablero aceitado se refleja en una mancha de luz que tapa la calle ·
//                "clean" con jabón y agua la mancha se va
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, clamp01, ease, hexA } from "./ClTheme";
import { Bed, Card, Contact, RoomLight, lin, pop, useOut } from "./ClParts";
import { CarTop } from "./ClMecanico";
import { Tag, Note } from "./ClMecParts";

const GREEN = "#2E7D32";
// ── ClOilMap13 ───────────────────────────────────────────────────────────────
const PINS: [number, number, string][] = [
  [118, 150, "Calcomanías"], [470, 202, "Savia"], [275, 372, "Alquitrán"], [790, 202, "Manos con grasa"], [62, 255, "Placa y tornillos"],
  [170, 262, "Herramientas"], [858, 112, "Prueba del faro"], [646, 118, "Pedales"], [560, 140, "Volante y palanca"], [590, 244, "Tablero"],
  [470, 54, "Gomas de puertas"], [700, 286, "Parabrisas"], [690, 372, "Frenos y llantas"],
];
export const ClOilMap13: React.FC<{ upto?: number; n?: number; all?: boolean; bed?: string }> = ({ upto = 0, n = 0, all, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  const W = 1180, sc = W / 900;
  const shown = all ? 13 : Math.max(upto, n);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={1001} dim={0.28} />
      <Contact x={960} y={960} w={1400} o={0.35} />
      <div style={{ position: "absolute", left: 260, top: 90 + (1 - p) * 140, width: 1400, transform: "perspective(2200px) rotateX(24deg) rotateZ(-1.5deg)", opacity: clamp01(p * 1.4) }}>
        <Card style={{ padding: "34px 40px 40px", borderRadius: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 3, color: CL.navy, borderBottom: `4px solid ${CL.navy}`, paddingBottom: 10, marginBottom: 16 }}>
            <span>ACEITE DE BEBÉ · 13 USOS</span><span><span style={{ color: GREEN }}>✓ SÍ 1-7</span> · <span style={{ color: CL.red }}>✗ NO 8-13</span></span>
          </div>
          <div style={{ position: "relative", width: W, height: W * 0.45, margin: "0 auto" }}>
            <CarTop w={W} />
            {PINS.slice(0, shown).map(([x, y, label], i) => {
              const at = all ? 6 + i * Math.max(2, (T * 0.5) / 13) : i + 1 === n ? 8 : 0;
              const k = pop(f, fps, at, 12), yes = i < 7, big = i + 1 === n;
              const c = yes ? GREEN : CL.red;
              return (
                <div key={i} style={{ position: "absolute", left: x * sc - 30, top: y * sc - 30, width: 60, height: 60, borderRadius: "50%", background: c, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 18px ${CL.shadow}`, scale: String((big ? 1.35 : 1) * clamp01(k)), border: "4px solid #fff", zIndex: big ? 3 : 1 }}>
                  {i + 1}
                  {big ? <div style={{ position: "absolute", left: x > 600 ? undefined : 72, right: x > 600 ? 72 : undefined, top: 2, whiteSpace: "nowrap", background: c, color: "#fff", fontSize: 38, padding: "4px 18px", borderRadius: 10, opacity: lin(f, 12, 20) }}>{yes ? "✓ " : "✗ "}{label}</div> : null}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ── ClDropTest ───────────────────────────────────────────────────────────────
export const ClDropTest: React.FC<{ mode?: "surface" | "inside"; bed?: string }> = ({ mode = "surface", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  const k = ease(clamp01((f - 14) / 22)); // la franja que pasa el dedo
  const W = 1000, Hh = 560;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={1011} dim={0.22} />
      <div style={{ position: "absolute", left: 240, top: 230 + (1 - p) * 100, width: W, height: Hh, opacity: clamp01(p * 1.4), transform: "perspective(1800px) rotateY(-18deg)" }}>
        <svg width={W} height={Hh} viewBox={`0 0 ${W} ${Hh}`}>
          <defs>
            <clipPath id="dt_lens"><path d={`M 60 280 Q 80 60 420 40 L 900 60 Q 980 120 960 300 Q 930 500 520 520 L 160 500 Q 50 470 60 280 Z`} /></clipPath>
            <radialGradient id="dt_in" cx="0.45" cy="0.4" r="0.7"><stop offset="0%" stopColor="#FFFFFF" /><stop offset="45%" stopColor="#C9D0D8" /><stop offset="100%" stopColor="#6E7782" /></radialGradient>
          </defs>
          <g clipPath="url(#dt_lens)">
            {/* adentro: reflector y lámpara */}
            <rect width={W} height={Hh} fill="url(#dt_in)" />
            {[300, 640].map((cx, i) => <g key={i}><circle cx={cx} cy={290} r={150} fill="#E9ECEF" stroke="#7D858F" strokeWidth={8} /><circle cx={cx} cy={290} r={46} fill="#FFFFFF" stroke="#9BA3AC" strokeWidth={6} /></g>)}
            {/* lo amarillo/opaco de afuera */}
            <rect width={W} height={Hh} fill="rgba(206,168,80,0.72)" />
            <rect width={W} height={Hh} fill="rgba(235,225,200,0.38)" />
            {Array.from({ length: 30 }, (_, i) => <line key={"s" + i} x1={(i * 37) % W} y1={0} x2={(i * 37) % W + 60} y2={Hh} stroke="rgba(255,250,235,0.18)" strokeWidth={3} />)}
            {/* la franja del dedo con la gota */}
            <rect x={380} y={-20} width={150} height={(Hh + 40) * k} rx={60} fill={mode === "surface" ? "url(#dt_in)" : "rgba(214,182,104,0.0)"} opacity={mode === "surface" ? 0.96 : 0} />
            {mode === "surface" ? <g opacity={k}><circle cx={455} cy={290} r={46} fill="#FFFFFF" /><path d={`M 380 ${Hh * k - 10} L 530 ${Hh * k - 10}`} stroke="rgba(255,255,255,0.5)" strokeWidth={6} /></g> : null}
            {mode === "inside" ? <>{Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 97) % W} cy={60 + ((i * 53) % (Hh - 120))} r={5 + (i % 4) * 3} fill="rgba(255,255,255,0.55)" />)}<rect x={380} y={-20} width={150} height={(Hh + 40) * k} rx={60} fill="rgba(255,255,255,0.08)" /></> : null}
          </g>
          <path d={`M 60 280 Q 80 60 420 40 L 900 60 Q 980 120 960 300 Q 930 500 520 520 L 160 500 Q 50 470 60 280 Z`} fill="none" stroke="#5E646C" strokeWidth={14} />
        </svg>
        {/* la yema con la gota */}
        <div style={{ position: "absolute", left: 400, top: -40 + (Hh) * k, width: 110, height: 140, borderRadius: "55px 55px 40px 40px", background: "linear-gradient(#D9A88A,#B98468)", boxShadow: "0 16px 30px rgba(0,0,0,0.35)", opacity: k > 0.98 ? lin(f, 40, 48, 1, 0) : clamp01(f / 6) }}>
          <div style={{ position: "absolute", left: 38, bottom: -14, width: 34, height: 40, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(255,236,190,0.85)" }} />
        </div>
      </div>
      <Tag x={1290} y={210} text="Una gota en el dedo" color={CL.navy} o={lin(f, 6, 16)} size={44} />
      {mode === "surface" ? <Note x={1290} y={330} o={lin(f, T * 0.55, T * 0.55 + 10)} big="Se aclara" small="el amarillo es de afuera: se pule ✓" w={560} /> : null}
      {mode === "inside" ? <Note x={1290} y={330} o={lin(f, T * 0.55, T * 0.55 + 10)} big="Sigue opaco" small="está adentro: no hay pulido" color={CL.red} w={560} /> : null}
      <Note x={1290} y={640} o={lin(f, T * 0.75, T * 0.75 + 10)} big="Es una prueba" small="después se limpia" color={CL.navy} w={560} />
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ── ClGrip ───────────────────────────────────────────────────────────────────
export const ClGrip: React.FC<{ mode?: "dry" | "oiled"; bed?: string }> = ({ mode = "oiled", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  const press = ease(clamp01((f - 10) / 14));
  const slip = mode === "oiled" ? ease(clamp01((f - 26) / 10)) : 0;
  const pedalAng = -18 + 16 * press * (1 - slip * 0.8);
  // la distancia que el auto sigue (medidor)
  const extra = mode === "oiled" ? 0.5 * ease(clamp01((f - 28) / 26)) : 0;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={1021} dim={0.3} />
      <div style={{ position: "absolute", left: 280, top: 120 + (1 - p) * 100, width: 900, height: 820, opacity: clamp01(p * 1.4) }}>
        <svg width={900} height={820} viewBox="0 0 900 820" style={{ overflow: "visible" }}>
          {/* piso del auto */}
          <path d="M 0 800 L 900 800 L 900 860 L 0 860 Z" fill="#2B2F36" opacity={0.85} />
          {/* brazo del pedal */}
          <g transform={`rotate(${pedalAng} 640 120)`}>
            <rect x={624} y={110} width={32} height={440} rx={12} fill="#5A606A" /><rect x={600} y={90} width={80} height={40} rx={10} fill="#3A3F48" />
            <g transform="translate(500 520)">
              <rect width={300} height={120} rx={26} fill={mode === "oiled" ? "#1A1A1A" : "#24262A"} />
              {Array.from({ length: 8 }, (_, i) => <rect key={i} x={22 + i * 35} y={16} width={16} height={88} rx={7} fill="#3B3E44" />)}
              {mode === "oiled" ? <><rect width={300} height={120} rx={26} fill="url(#gr_shine)" /><path d="M 30 22 L 270 22" stroke="rgba(255,255,255,0.7)" strokeWidth={8} strokeLinecap="round" /></> : null}
            </g>
          </g>
          <defs><linearGradient id="gr_shine" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="rgba(255,255,255,0.45)" /><stop offset="50%" stopColor="rgba(255,255,255,0.05)" /><stop offset="100%" stopColor="rgba(255,255,255,0.35)" /></linearGradient></defs>
          {/* el zapato */}
          <g transform={`translate(${300 + 150 * press - 30 * slip} ${330 + 150 * press + 120 * slip}) rotate(${-14 + 10 * press + 22 * slip})`}>
            <path d="M 0 60 Q 10 0 120 6 L 330 30 Q 380 40 380 90 L 380 120 Q 370 140 330 140 L 20 140 Q 0 130 0 60 Z" fill="#6B4A32" />
            <rect x={0} y={128} width={380} height={24} rx={10} fill="#2A1E15" />
          </g>
          {/* flechas */}
          {mode === "dry" ? <path d="M 500 330 l 0 120 l -26 -26 m 26 26 l 26 -26" stroke={GREEN} strokeWidth={14} fill="none" opacity={lin(f, 18, 26)} strokeLinecap="round" /> : null}
          {mode === "oiled" ? <path d="M 420 520 q -60 60 -40 150 l -14 -36 m 14 36 l 26 -26" stroke={CL.red} strokeWidth={14} fill="none" opacity={lin(f, 28, 34)} strokeLinecap="round" /> : null}
        </svg>
      </div>
      <Tag x={1240} y={200} text={mode === "dry" ? "Pedal limpio" : "Pedal aceitado"} color={mode === "dry" ? GREEN : CL.red} o={lin(f, 6, 16)} size={52} />
      {mode === "dry" ? <Note x={1240} y={320} o={lin(f, 22, 32)} big="La suela agarra" small="y el auto frena ✓" w={520} /> : null}
      {mode === "oiled" ? <Note x={1240} y={320} o={lin(f, 30, 40)} big="Como pie sobre hielo" small="la suela se resbala" color={CL.red} w={540} /> : null}
      {mode === "oiled" ? (
        <div style={{ position: "absolute", left: 1240, top: 620, opacity: lin(f, 30, 40) }}>
          <Card style={{ padding: "16px 30px", borderBottom: `8px solid ${CL.red}` }}>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 36, color: CL.inkSoft }}>EL AUTO SIGUE</div>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: CL.red, lineHeight: 1 }}>+{extra.toFixed(1).replace(".", ",")} m</div>
          </Card>
        </div>
      ) : null}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ── ClSealSwell ──────────────────────────────────────────────────────────────
export const ClSealSwell: React.FC<{ mode?: "oil" | "silicone"; bed?: string }> = ({ mode = "oil", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  const k = ease(clamp01((f - 10) / (T * 0.62)));
  const month = Math.round(12 * k);
  const sw = mode === "oil" ? k : 0; // cuánto se hincha
  const r1 = 110 * (1 + 0.32 * sw), r2 = 90 * (1 - 0.2 * sw);
  const gloss = mode === "oil" ? 0.5 * (1 - k) : 0.3;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={1031} dim={0.3} />
      <div style={{ position: "absolute", left: 300, top: 160 + (1 - p) * 100, opacity: clamp01(p * 1.4) }}>
        <svg width={900} height={720} viewBox="0 0 900 720">
          {/* chapa del marco de la puerta y de la puerta */}
          <rect x={80} y={120} width={150} height={520} fill="#B9C0C8" stroke="#7D858F" strokeWidth={6} />
          <rect x={560 - 40 * sw} y={120} width={150} height={520} fill="#C9CFD6" stroke="#7D858F" strokeWidth={6} />
          {/* la goma (bulbo) en corte */}
          <g transform="translate(230 380)">
            <path d={`M 0 -60 Q ${r1 * 1.4} ${-r2 * 1.6} ${r1 * 2.2} ${-10 + 30 * sw} Q ${r1 * 1.5} ${r2 * 1.6} 0 60 Z`} fill="#1E1F22" />
            <path d={`M 18 -30 Q ${r1 * 1.2} ${-r2 * 1.1} ${r1 * 1.8} ${-6 + 24 * sw} Q ${r1 * 1.2} ${r2 * 1.1} 18 30 Z`} fill={mode === "oil" ? `rgba(80,70,60,${0.2 + 0.6 * sw})` : "#2E3036"} />
            <path d={`M 20 -48 Q ${r1} ${-r2 * 1.35} ${r1 * 1.9} -16`} stroke={`rgba(255,255,255,${gloss})`} strokeWidth={8} fill="none" />
            {mode === "oil" && sw > 0.5 ? Array.from({ length: 5 }, (_, i) => <path key={i} d={`M ${60 + i * 34} ${-40 + (i % 2) * 70} q 10 6 0 14`} stroke="#5C4A36" strokeWidth={4} fill="none" opacity={sw} />) : null}
          </g>
          {/* el agua que entra */}
          {mode === "oil" ? Array.from({ length: 6 }, (_, i) => { const t = ((f * 0.03 + i / 6) % 1); return sw > 0.6 ? <ellipse key={i} cx={470 + 40 * Math.sin(i)} cy={140 + t * 480} rx={12} ry={18} fill="#6FB4E3" opacity={(sw - 0.6) * 2.4 * (1 - t * 0.5)} /> : null; }) : null}
        </svg>
      </div>
      {/* el calendario */}
      <div style={{ position: "absolute", left: 1260, top: 190 }}>
        <Card style={{ padding: "18px 34px", borderBottom: `8px solid ${mode === "oil" ? CL.red : GREEN}` }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 38, color: CL.inkSoft, letterSpacing: 2 }}>{mode === "oil" ? "CON ACEITE" : "CON SILICONA"}</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: CL.ink, lineHeight: 1 }}>{month} {month === 1 ? "mes" : "meses"}</div>
        </Card>
      </div>
      {mode === "oil" ? <Note x={1260} y={520} o={lin(f, T * 0.6, T * 0.6 + 10)} big="Blanda e hinchada" small="entra agua y viento" color={CL.red} w={560} /> : <Note x={1260} y={520} o={lin(f, T * 0.6, T * 0.6 + 10)} big="Igual que nueva" small="2 veces por año ✓" color={GREEN} w={560} />}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ── ClGlare ──────────────────────────────────────────────────────────────────
export const ClGlare: React.FC<{ mode?: "oil" | "clean"; bed?: string }> = ({ mode = "oil", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const k = ease(clamp01((f - 8) / (T * 0.5)));
  const glare = mode === "oil" ? k : 1 - k;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      {/* la calle a través del parabrisas */}
      <Bed src={bed} seed={1041} dim={0} warm={0.2} />
      {/* la mancha de luz del tablero reflejado */}
      <AbsoluteFill style={{ background: `linear-gradient(178deg, rgba(255,255,255,0) 30%, rgba(250,246,236,${0.82 * glare}) 52%, rgba(255,255,255,${0.55 * glare}) 66%, rgba(255,255,255,0) 82%)` }} />
      <AbsoluteFill style={{ background: `repeating-linear-gradient(176deg, rgba(255,255,255,0) 0 40px, rgba(255,255,255,${0.12 * glare}) 40px 44px)` }} />
      {/* marco del parabrisas + tablero abajo */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d="M 0 0 L 1920 0 L 1920 120 Q 960 60 0 120 Z" fill="#141518" />
        <path d="M 0 0 L 170 0 L 330 1080 L 0 1080 Z" fill="#17181B" />
        <path d="M 1920 0 L 1750 0 L 1590 1080 L 1920 1080 Z" fill="#17181B" />
        <path d={`M 0 860 Q 960 760 1920 860 L 1920 1080 L 0 1080 Z`} fill={mode === "oil" ? "#2A2C30" : "#1E2024"} />
        <path d="M 200 870 Q 960 780 1720 870" stroke={`rgba(255,255,255,${0.5 * glare})`} strokeWidth={10} fill="none" />
      </svg>
      <Tag x={380} y={160} text={mode === "oil" ? "Tablero con aceite" : "Agua, jabón y secar"} color={mode === "oil" ? CL.red : GREEN} o={lin(f, 6, 16)} size={50} />
      {mode === "oil" ? <Note x={1100} y={160} o={lin(f, T * 0.55, T * 0.55 + 10)} big="Se refleja" small="justo a la altura de los ojos" color={CL.red} w={520} /> : <Note x={1100} y={160} o={lin(f, T * 0.55, T * 0.55 + 10)} big="Se ve la calle" small="sin reflejo ✓" color={GREEN} w={440} />}
    </AbsoluteFill>
  );
};
