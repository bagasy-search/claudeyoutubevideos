// Kit del video cons6nd (la plancha que escupe sarro). Un componente ÚNICO por minuto, ninguno repetido, sin rótulos de esquina.
//   PlSpit        la plancha sobre el cuello blanco: aprieta el vapor y escupe un chorro turbio con escamas → aureola marrón
//   PlCutaway     la plancha en corte: depósito → gota a gota → cámara de vapor → agujeritos; la piedra se pega en capas
//   PlFlakeCrack  la capita de piedra se agrieta, se suelta y viaja con el vapor hasta la camisa; con almidón quemado se tiñe marrón
//   PlUniform     el uniforme de gala blanco en la percha: la mancha marrón cae justo donde va la plaqueta; reloj: falta 1 hora
//   PlManual      el manual se abre y se subrayan solas «agua destilada» y «no use vinagre en el depósito»
//   PlCalcButton  los tres dibujitos del botón de autolimpieza (CALC CLEAN · SELF CLEAN · gota con rayitas) y el botón se hunde
//   PlSoleTypes   tres suelas boca arriba: antiadherente (oscura), cerámica (clarita), acero (plateada) + con qué se puede
//   PlSelfClean   la plancha horizontal sobre la pileta: sale vapor y agua sucia con escamas por la suela; manos lejos
//   PlRatioJug    la jarrita: ¼ de vinagre blanco + ¾ de agua destilada; «vinagre puro» tachado
//   PlRinses      tres vasos: lo que sale en cada llenada de destilada, turbio → menos → transparente y sin olor
//   PlColdCheck   la suela pasa de roja a azul; el enchufe afuera; el dorso de la mano se acerca sin apoyar
//   PlSolePaste   la suela vista desde abajo: el paño con pasta da vueltas y las manchas marrones se ablandan
//   PlHoleSwab    el hisopo pasa por cada agujerito, uno por uno: cada uno se aclara al pasar
//   PlNoScratch   cuchillo, lana de acero y esponja verde tachados; la raya en la suela engancha un hilo de la tela
//   PlRagTest     el trapo blanco planchado: la luz lo recorre y no aparece una gota → «lista»
//   PlEmptyTank   el depósito con agua quieta: pasan los días y aparece la piedra; el vacío queda limpio
//   PlParked      la plancha guardada: parada sobre el talón (bien) vs acostada sobre la suela (mal)
//   PlIronRow     el estante del cuarto de planchado: las planchas paradas en fila y Rosa pasa revista
//   PlFiveErrors  abanico de cinco tarjetas sobre la tabla de planchar, una se levanta
//   PlStarch      el almidón en aerosol: rociar, esperar unos segundos que entre en la tela, recién ahí planchar
//   PlRoutine     la planilla del cuarto de planchado colgada en la tabla, con 5 pasos y el tiempo
//   PlWaterSrc    las aguas: del aire acondicionado y del deshumidificador (no) vs destilada (sí)
//   PlWhenToss    las tres señales de que ya no es piedra, es la plancha
//   PlRecap       repaso: las tarjetas colgadas de perchas en el perchero de camisas
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, rnd, clamp01, ease, hexA } from "./ClTheme";
import { Bed, RoomLight, Stamp, Card, Tape, lin, pop, useOut } from "./ClParts";
import { Tag, Tick, Hand2D } from "./ClTina";

const BODY = "#2F6FB3", BODYD = "#1F4F85", SOLE = "#BFC5CC", SOLED = "#8E959D", SCALE = "#EDE8DC", BRN = "#9A6A3A", SHIRT = "#FBFBF7";
// plancha de costado, punta a la derecha, base en y=0
const Iron: React.FC<{ x: number; y: number; s?: number; rot?: number; body?: string; tank?: number }> = ({ x, y, s = 1, rot = 0, body = BODY, tank = 0.6 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-180 -10 L190 -10 Q215 -10 200 -40 Q140 -130 -40 -140 L-180 -140 Z" fill={body} stroke={BODYD} strokeWidth={5} />
    <path d="M-150 -40 L140 -40 Q120 -100 -40 -112 L-150 -112 Z" fill="rgba(210,235,255,0.55)" />
    <rect x={-150} y={-40 - 72 * tank} width={250} height={72 * tank} fill="rgba(140,190,230,0.55)" />
    <path d="M-185 0 L195 0 Q225 0 210 -14 L-185 -14 Z" fill={SOLE} stroke={SOLED} strokeWidth={4} />
    <path d="M-150 -140 Q-150 -240 -40 -240 L80 -240 Q130 -240 110 -200 L70 -140" fill="none" stroke={BODYD} strokeWidth={34} strokeLinecap="round" />
    <circle cx={60} cy={-226} r={14} fill="#E9EEF3" stroke={BODYD} strokeWidth={4} />
    <path d="M-180 -90 Q-260 -80 -280 -10" fill="none" stroke="#333" strokeWidth={10} />
  </g>
);
// suela vista desde abajo (punta arriba), centro (0,0)
const SolePlate: React.FC<{ col?: string; holes?: (i: number) => string; children?: React.ReactNode }> = ({ col = SOLE, holes, children }) => {
  const H: [number, number][] = [];
  for (let r = 0; r < 7; r++) for (let c = -2; c <= 2; c++) { const y = -150 + r * 55; const w = 40 + r * 18; if (Math.abs(c) * 46 < w) H.push([c * 46, y]); }
  return <g>
    <path d="M0 -330 Q170 -60 190 200 Q190 300 0 300 Q-190 300 -190 200 Q-170 -60 0 -330 Z" fill={col} stroke={SOLED} strokeWidth={6} />
    {H.map(([hx, hy], i) => <circle key={i} cx={hx} cy={hy} r={11} fill={holes ? holes(i) : "#555"} stroke="rgba(0,0,0,0.3)" strokeWidth={2} />)}
    {children}
  </g>;
};
const holeCount = (() => { let n = 0; for (let r = 0; r < 7; r++) for (let c = -2; c <= 2; c++) if (Math.abs(c) * 46 < 40 + r * 18) n++; return n; })();
const Flakes: React.FC<{ n: number; x: number; y: number; k: number; spread?: number; seed?: number; col?: string }> = ({ n, x, y, k, spread = 200, seed = 0, col = SCALE }) => (
  <g>{Array.from({ length: n }, (_, i) => { const a = rnd(i + seed) * Math.PI - Math.PI; const r = spread * k * (0.3 + rnd(i + seed + 3)); return <rect key={i} x={x + Math.cos(a) * r * 0.6} y={y + Math.abs(Math.sin(a)) * r} width={8 + rnd(i + seed + 1) * 12} height={5 + rnd(i + seed + 2) * 7} fill={col} transform={`rotate(${rnd(i + seed + 4) * 90} ${x + Math.cos(a) * r * 0.6} ${y + Math.abs(Math.sin(a)) * r})`} opacity={clamp01(k * 3)} />; })}</g>
);

// ═════════════════════════════ 0 · escupe sobre el cuello
export const PlSpit: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const glide = ease(lin(f, 0, T * 0.3)); const sp = lin(f, T * 0.3, T * 0.5); const halo = lin(f, T * 0.5, T * 0.8);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={601} dim={0.3} />
      <Hand2D seed={601} push={[1.0, 1.1]}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <rect x={0} y={640} width={1920} height={440} fill="#D9D2C4" />
          <path d="M420 700 L1500 700 L1560 1080 L360 1080 Z" fill={SHIRT} stroke="#DDD8CC" strokeWidth={4} />
          <path d="M760 700 L960 820 L1160 700 L1120 660 L960 760 L800 660 Z" fill="#F1F0EA" stroke="#D6D1C4" strokeWidth={4} />
          <ellipse cx={1000} cy={780} rx={150 * halo} ry={60 * halo} fill={hexA(BRN, 0.45)} />
          <ellipse cx={1000} cy={780} rx={110 * halo} ry={40 * halo} fill="none" stroke={hexA(BRN, 0.7)} strokeWidth={6} />
          <Iron x={760 + 300 * glide} y={640} s={1.2} rot={-6} />
          {sp > 0 ? Array.from({ length: 18 }, (_, i) => { const t = ((f * 2 + i * 9) % 30) / 30; return <circle key={i} cx={1000 + (rnd(i) - 0.5) * 120 * t} cy={640 + 160 * t} r={6 + rnd(i + 1) * 8} fill="rgba(170,160,135,0.8)" opacity={(1 - halo) * (1 - t)} />; }) : null}
          <Flakes n={26} x={1000} y={700} k={sp} spread={180} seed={3} />
        </svg>
        <Tag x={1240} y={300} text="un chorro turbio" k={sp * 2} color={CL.red} />
        <Tag x={1240} y={410} text="justo en el cuello" k={halo * 2} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 1 · la plancha en corte
export const PlCutaway: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const drip = (f % 18) / 18; const lay = ease(lin(f, T * 0.45, T * 0.9));
  const lbl = (i: number) => lin(f, 8 + i * (T * 0.12), 16 + i * (T * 0.12));
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={602} dim={0.45} />
      <Hand2D seed={602} push={[1.0, 1.08]}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <g transform="translate(900 760) scale(2.3)">
            <path d="M-180 -10 L190 -10 Q215 -10 200 -40 Q140 -130 -40 -140 L-180 -140 Z" fill="#EAF0F5" stroke={BODYD} strokeWidth={3} />
            <rect x={-160} y={-125} width={260} height={70} fill="rgba(140,190,230,0.6)" stroke={BODYD} strokeWidth={2} />
            <rect x={-170} y={-40} width={360} height={26} fill="#F6E7D8" stroke="#B6884E" strokeWidth={2} />
            <rect x={-170} y={-40} width={360} height={7 * lay} fill={SCALE} />
            <rect x={-170} y={-21 - 5 * lay} width={360} height={5 * lay} fill={SCALE} />
            <circle cx={0} cy={-55 + drip * 15} r={4} fill="#7FB6E0" />
            {Array.from({ length: 9 }, (_, i) => <g key={i}><rect x={-150 + i * 38} y={-14} width={7} height={14} fill="#555" /><rect x={-150 + i * 38} y={-14} width={7} height={8 * lay * rnd(i)} fill={SCALE} /></g>)}
            <path d="M-185 0 L195 0 Q225 0 210 -14 L-185 -14 Z" fill="none" stroke={SOLED} strokeWidth={3} />
            {Array.from({ length: 9 }, (_, i) => { const t = ((f + i * 7) % 30) / 30; return <path key={i} d={`M${-147 + i * 38} ${4 + t * 30} q 6 6 0 12`} stroke="rgba(255,255,255,0.9)" strokeWidth={3} fill="none" opacity={1 - t} />; })}
          </g>
        </svg>
        <Tag x={560} y={420} text="el depósito" k={lbl(0)} />
        <Tag x={1290} y={520} text="la cámara de vapor" k={lbl(1)} />
        <Tag x={1150} y={930} text="los agujeritos" k={lbl(2)} color={CL.inkSoft} />
        <Tag x={300} y={930} text="una capita por planchada" k={lay * 2} color={CL.red} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 2 · la capita se agrieta
export const PlFlakeCrack: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const cr = lin(f, 6, T * 0.35); const fly = ease(lin(f, T * 0.35, T * 0.75)); const brn = lin(f, T * 0.7, T * 0.85);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={603} dim={0.45} />
      <Hand2D seed={603}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <rect x={200} y={260} width={1520} height={200} fill="#B9BEC5" />
          <rect x={200} y={440} width={1520} height={70} fill={SCALE} stroke="#CFC7B4" strokeWidth={3} />
          {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${260 + i * 150} 440 l ${20 - rnd(i) * 40} ${35 * cr} l ${rnd(i + 2) * 30 - 15} ${35 * cr}`} stroke="#8E8676" strokeWidth={4} fill="none" />)}
          {Array.from({ length: 14 }, (_, i) => { const x0 = 260 + rnd(i) * 1400; const y = 480 + fly * (120 + rnd(i + 1) * 260); return <rect key={i} x={x0 + Math.sin(f / 6 + i) * 20 * fly} y={y} width={44 + rnd(i + 3) * 40} height={18 + rnd(i + 4) * 12} rx={4} fill={brn > 0 && i % 2 ? `rgb(${237 - 80 * brn},${232 - 110 * brn},${220 - 160 * brn})` : SCALE} transform={`rotate(${rnd(i + 5) * 60 * fly} ${x0} ${y})`} opacity={fly > 0 ? 1 : 0} />; })}
          <rect x={0} y={1010} width={1920} height={70} fill={SHIRT} />
        </svg>
        <Tag x={300} y={360} text="se agrieta y se suelta" k={cr * 2} />
        <Tag x={1080} y={360} text="con almidón quemado: marrón" k={brn * 2} color={BRN} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 3 · el uniforme de gala, 2009
export const PlUniform: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 0, 14); const st = lin(f, T * 0.25, T * 0.45); 
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={604} dim={0.35} />
      <Hand2D seed={604}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <g transform={`translate(800 ${120 - (1 - p) * 400}) rotate(${Math.sin(f / 18) * 2})`}>
            <path d="M0 0 q 0 -40 30 -40" stroke="#888" strokeWidth={8} fill="none" />
            <path d="M-260 80 L0 20 L260 80" stroke="#7A5A3A" strokeWidth={14} fill="none" />
            <path d="M-260 80 L-330 300 L-240 330 L-220 860 L220 860 L240 330 L330 300 L260 80 L80 60 L0 220 L-80 60 Z" fill={SHIRT} stroke="#D9D4C8" strokeWidth={5} />
            {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={0} cy={300 + i * 110} r={12} fill="#C9A44C" />)}
            <rect x={70} y={300} width={140} height={44} rx={6} fill="#C9A44C" opacity={0.25 + 0.75 * (1 - st)} />
            <ellipse cx={140} cy={330} rx={110 * st} ry={80 * st} fill={hexA(BRN, 0.55)} />
          </g>
          <g transform="translate(1460 360)">
            <circle r={160} fill="#FFFFFF" stroke={CL.navy} strokeWidth={10} />
            <line x1={0} y1={0} x2={0} y2={-110} stroke={CL.navy} strokeWidth={10} strokeLinecap="round" transform={`rotate(${(f / T) * 30})`} />
            <line x1={0} y1={0} x2={70} y2={0} stroke={CL.navy} strokeWidth={14} strokeLinecap="round" transform="rotate(-60)" />
          </g>
        </svg>
        <Tag x={1300} y={590} text="falta 1 hora" k={lin(f, 10, 20)} color={CL.red} />
        <Tag x={1000} y={980} text="donde va la plaqueta" k={st * 2} color={BRN} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 4 · el manual
export const PlManual: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const op = ease(lin(f, 2, 18)); const u1 = lin(f, T * 0.3, T * 0.45); const u2 = lin(f, T * 0.6, T * 0.75);
  const line = (w: number, y: number) => <div style={{ height: 14, width: w, background: "#D9D4CA", borderRadius: 7, marginTop: y }} />;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={605} dim={0.35} />
      <Hand2D seed={605} push={[1.05, 1.0]}>
        <div style={{ position: "absolute", left: 360, top: 120, width: 1200, height: 820, perspective: 2000 }}>
          <div style={{ position: "absolute", left: 600, top: 0, width: 600, height: 820, background: "#FFFFFF", boxShadow: `0 30px 60px ${CL.shadow}`, padding: 60 }}>
            <div style={{ fontFamily: LABEL, fontSize: 34, color: CL.inkSoft, letterSpacing: 3 }}>LIMPIEZA Y CUIDADO</div>
            {line(460, 40)}{line(380, 20)}
            <div style={{ fontFamily: SERIF, fontSize: 46, color: CL.ink, marginTop: 34, position: "relative" }}>Use agua destilada.<div style={{ position: "absolute", left: 0, bottom: -6, height: 8, width: `${u1 * 100}%`, background: CL.yellow, opacity: 0.8 }} /></div>
            {line(420, 30)}{line(300, 20)}
            <div style={{ fontFamily: SERIF, fontSize: 46, color: CL.ink, marginTop: 34, position: "relative" }}>No use vinagre en el depósito.<div style={{ position: "absolute", left: 0, bottom: -6, height: 8, width: `${u2 * 100}%`, background: CL.red, opacity: 0.7 }} /></div>
            {line(460, 30)}{line(340, 20)}
          </div>
          <div style={{ position: "absolute", left: 0, top: 0, width: 600, height: 820, background: "#F4F1EA", boxShadow: `0 30px 60px ${CL.shadow}`, transformOrigin: "100% 50%", transform: `rotateY(${(1 - op) * -170}deg)`, padding: 60, backfaceVisibility: "hidden" }}>
            <svg width={480} height={400}><Iron x={260} y={300} s={1.05} /></svg>
            <div style={{ fontFamily: LABEL, fontSize: 40, color: CL.navy, letterSpacing: 3 }}>MANUAL DE USO</div>
          </div>
        </div>
        <Tag x={200} y={990} text="casi nadie lo lee" k={lin(f, 8, 18)} color={CL.inkSoft} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 5 · el botón de autolimpieza
export const PlCalcButton: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const L = ["CALC CLEAN", "SELF CLEAN", "gota"];
  const press = lin(f, T * 0.7, T * 0.78);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={606} dim={0.35} />
      <Hand2D seed={606}>
        {L.map((t, i) => { const p = pop(f, fps, 4 + i * Math.round(T * 0.15), 11); const hi = i === 2 ? press : 0; return (
          <div key={i} style={{ position: "absolute", left: 240 + i * 520, top: 300, width: 400, height: 400, opacity: p, translate: `0 ${(1 - p) * 140}px` }}>
            <div style={{ width: 400, height: 400, borderRadius: 60, background: "linear-gradient(160deg,#3B7CC0,#1F4F85)", boxShadow: `0 ${30 - 20 * hi}px 50px ${CL.shadow}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.06 * hi})` }}>
              <div style={{ width: 250, height: 250, borderRadius: "50%", background: "#E9EEF3", boxShadow: `inset 0 ${-10 + 20 * hi}px 20px rgba(0,0,0,0.25)`, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                {i < 2 ? <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 48, color: BODYD, lineHeight: 1 }}>{t}</div>
                  : <svg width={180} height={180}><path d="M90 20 C130 80 140 110 140 125 A50 50 0 0 1 40 125 C40 110 50 80 90 20 Z" fill="none" stroke={BODYD} strokeWidth={10} />{[0, 1, 2].map((k) => <line key={k} x1={55 + k * 35} y1={160} x2={45 + k * 35} y2={178} stroke={BODYD} strokeWidth={8} />)}</svg>}
              </div>
            </div>
          </div>); })}
        <Tag x={700} y={860} text="si lo tiene, ese es su método" k={lin(f, T * 0.6, T * 0.7)} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 6 · tres suelas
export const PlSoleTypes: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const S = [["antiadherente", "#2E3136", "oscura y lisa"], ["cerámica", "#EFE9DD", "clarita, brillante"], ["acero", "#C7CDD3", "plateada"]];
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={607} dim={0.35} />
      <Hand2D seed={607}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {S.map(([, c], i) => { const p = pop(f, fps, 4 + i * 8, 12); return <g key={i} transform={`translate(${380 + i * 580} ${520}) scale(${0.95 * p}) rotate(${(1 - p) * 30})`}><SolePlate col={c} /><path d="M-60 -250 Q0 -300 40 -200" stroke="rgba(255,255,255,0.4)" strokeWidth={18} fill="none" /></g>; })}
        </svg>
        {S.map(([n, , d], i) => <div key={i} style={{ position: "absolute", left: 380 + i * 580, top: 860, translate: "-50% 0", textAlign: "center", padding: "10px 30px", background: "#FFF8EA", borderRadius: 16, boxShadow: "0 18px 40px rgba(0,0,0,0.28)", border: "3px solid #E6DAC2", opacity: lin(f, 14 + i * 8, 22 + i * 8) }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: CL.navy }}>{n}</div><div style={{ fontFamily: HAND, fontSize: 46, color: CL.navy }}>{d}</div></div>)}
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 7 · la autolimpieza sobre la pileta
export const PlSelfClean: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const k = lin(f, 6, T * 0.8); const sway = Math.sin(f / 8) * 30;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={608} dim={0.4} />
      <Hand2D seed={608}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <rect x={300} y={700} width={1320} height={380} rx={20} fill="#C9CED4" />
          <rect x={420} y={740} width={1080} height={300} rx={40} fill="#9AA2AB" />
          <circle cx={960} cy={990} r={26} fill="#555" />
          {/* el tomacorriente vacío y el enchufe colgando: desenchufada */}
          <g transform="translate(1680 250)"><rect x={-60} y={-80} width={120} height={160} rx={14} fill="#F2F2EE" stroke="#BBB" strokeWidth={4} /><circle cx={-18} cy={0} r={9} fill="#555" /><circle cx={18} cy={0} r={9} fill="#555" /></g>
          <path d={`M${720 + sway} 380 Q1300 300 1560 470`} stroke="#333" strokeWidth={9} fill="none" />
          <g transform="translate(1580 490) rotate(20)"><rect x={-40} y={-26} width={70} height={52} rx={9} fill="#333" /><rect x={30} y={-14} width={26} height={7} fill="#999" /><rect x={30} y={6} width={26} height={7} fill="#999" /></g>
          <Iron x={960 + sway} y={480} s={1.5} tank={0.6 * (1 - k)} />
          {Array.from({ length: 30 }, (_, i) => { const t = ((f + i * 4) % 26) / 26; return <circle key={i} cx={960 + sway + (rnd(i) - 0.5) * 520} cy={490 + t * 360} r={5 + rnd(i + 1) * 7} fill={`rgba(${150 - 40 * rnd(i + 2)},${145 - 40 * rnd(i + 2)},${120},0.8)`} opacity={(1 - t) * clamp01(k * 4)} />; })}
          <Flakes n={30} x={960 + sway} y={500} k={((f % 40) / 40)} spread={260} seed={11} />
          {Array.from({ length: 8 }, (_, i) => { const t = ((f + i * 10) % 50) / 50; return <path key={i} d={`M${700 + i * 70} ${500 + t * 200} q 20 -30 0 -60 q -20 -30 0 -60`} stroke="rgba(255,255,255,0.7)" strokeWidth={8} fill="none" opacity={1 - t} />; })}
        </svg>
        <Tag x={120} y={560} text="desenchufada · botón apretado" k={lin(f, 4, 14)} />
        <Tag x={1180} y={640} text="toda la piedra que tenía adentro" k={lin(f, T * 0.4, T * 0.5)} color={CL.red} />
        <Tag x={120} y={650} text="manos lejos: sale muy caliente" k={lin(f, T * 0.6, T * 0.7)} color={CL.inkSoft} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 8 · la jarrita ¼ + ¾
export const PlRatioJug: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const v = ease(lin(f, 6, T * 0.3)); const w = ease(lin(f, T * 0.32, T * 0.62)); const no = lin(f, T * 0.7, T * 0.8);
  const H = 560, top = 880;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={609} dim={0.4} />
      <Hand2D seed={609}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs><clipPath id="plJug"><path d="M560 320 L600 880 L1000 880 L1040 320 Z" /></clipPath></defs>
          <g clipPath="url(#plJug)">
            <rect x={540} y={top - H * 0.25 * v} width={520} height={H * 0.25 * v} fill="rgba(235,225,180,0.85)" />
            <rect x={540} y={top - H * 0.25 - H * 0.75 * w} width={520} height={H * 0.75 * w} fill="rgba(170,210,240,0.7)" />
          </g>
          <path d="M560 320 L600 880 L1000 880 L1040 320 Z" fill="none" stroke="#8FA3B5" strokeWidth={8} />
          <path d="M1040 400 Q1180 420 1160 560 Q1140 680 1010 690" fill="none" stroke="#8FA3B5" strokeWidth={22} />
          {[0.25, 0.5, 0.75, 1].map((q) => <g key={q}><line x1={590} x2={660} y1={top - H * q} y2={top - H * q} stroke={CL.navy} strokeWidth={5} /><text x={670} y={top - H * q + 14} fontFamily="Arial" fontWeight={700} fontSize={36} fill={CL.navy}>{q === 1 ? "1" : q === 0.25 ? "¼" : q === 0.5 ? "½" : "¾"}</text></g>)}
        </svg>
        <div style={{ position: "absolute", left: 1220, top: 230, fontFamily: SERIF, fontWeight: 900, color: CL.navy, lineHeight: 1.15, whiteSpace: "nowrap", padding: "24px 36px", background: "#FFF8EA", borderRadius: 16, boxShadow: "0 18px 40px rgba(0,0,0,0.28)", border: "3px solid #E6DAC2" }}>
          <div style={{ fontSize: 76, opacity: lin(f, 6, 14), color: BRN }}>¼ vinagre blanco</div>
          <div style={{ fontSize: 76, opacity: lin(f, T * 0.32, T * 0.4) }}>¾ agua destilada</div>
        </div>
        <div style={{ position: "absolute", left: 1220, top: 560, opacity: no, display: "flex", alignItems: "center", gap: 20, padding: "8px 28px", background: "#FFF8EA", borderRadius: 16, boxShadow: "0 18px 40px rgba(0,0,0,0.28)", border: "3px solid #E6DAC2" }}>
          <Tick ok={false} s={110} k={no} /><div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: CL.red, textDecoration: "line-through", textDecorationThickness: 8 }}>vinagre puro</div>
        </div>
        <Tag x={1240} y={860} text="sólo si el manual no lo prohíbe" k={lin(f, T * 0.82, T * 0.9)} color={CL.inkSoft} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 9 · tres llenadas de destilada
export const PlRinses: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const C = [[0.75, "turbia"], [0.35, "menos"], [0, "transparente"]] as const;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={610} dim={0.4} />
      <Hand2D seed={610}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {C.map(([tb], i) => { const p = pop(f, fps, 4 + i * Math.round(T * 0.22), 12); const fl = ease(lin(f, 6 + i * T * 0.22, 20 + i * T * 0.22)); const x = 420 + i * 540; return <g key={i} opacity={p}>
            <path d={`M${x - 150} 300 L${x - 120} 820 L${x + 120} 820 L${x + 150} 300 Z`} fill="rgba(255,255,255,0.55)" stroke="#5E7388" strokeWidth={8} />
            <path d={`M${x - 150 + 30 * (1 - fl * 0.9)} ${820 - 460 * fl} L${x - 120} 820 L${x + 120} 820 L${x + 150 - 30 * (1 - fl * 0.9)} ${820 - 460 * fl} Z`} fill={`rgba(${170 - 40 * tb},${200 - 60 * tb},${230 - 120 * tb},${0.7 + 0.25 * tb})`} />
            {tb > 0 ? Array.from({ length: Math.round(20 * tb) }, (_, k) => <rect key={k} x={x - 90 + rnd(k + i * 20) * 180} y={820 - 420 * fl * rnd(k + 7)} width={10} height={6} fill={SCALE} opacity={fl} />) : null}
          </g>; })}
        </svg>
        {C.map(([, t], i) => <div key={i} style={{ position: "absolute", left: 420 + i * 540, top: 850, translate: "-50% 0", textAlign: "center", background: CL.navy, padding: "8px 26px", borderRadius: 14, opacity: lin(f, 14 + i * T * 0.22, 22 + i * T * 0.22) }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 38, color: "#fff", letterSpacing: 3 }}>{i + 1}ª LLENADA</div><div style={{ fontFamily: HAND, fontSize: 56, color: i === 2 ? "#BFE3FF" : "#F2C58A" }}>{t}</div></div>)}
        <Tag x={1340} y={250} text="y sin olor a vinagre" k={lin(f, T * 0.8, T * 0.9)} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 10 · fría antes de tocarla
export const PlColdCheck: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const cool = ease(lin(f, 8, T * 0.7)); const hand = lin(f, T * 0.5, T * 0.8);
  const col = `rgb(${Math.round(220 - 140 * cool)},${Math.round(80 + 80 * cool)},${Math.round(60 + 170 * cool)})`;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={611} dim={0.4} />
      <Hand2D seed={611}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <rect x={0} y={760} width={1920} height={320} fill="#D5CDBE" />
          <Iron x={820} y={760} s={1.8} />
          <defs><linearGradient id="plCool" x1="0" x2="1"><stop offset="0" stopColor="#D9452E" /><stop offset={String(clamp01(1 - cool))} stopColor="#D9452E" /><stop offset={String(Math.min(1, clamp01(1 - cool) + 0.2))} stopColor="#3D7FBF" /><stop offset="1" stopColor="#3D7FBF" /></linearGradient></defs>
          <rect x={480} y={762} width={720} height={40} rx={12} fill="url(#plCool)" stroke="#555" strokeWidth={3} />
          {cool < 0.6 ? Array.from({ length: 10 }, (_, i) => { const t = ((f + i * 6) % 40) / 40; return <path key={i} d={`M${520 + i * 70} ${730 - t * 120} q 12 -15 0 -30 q -12 -15 0 -30`} stroke={`rgba(230,90,60,${0.6 * (1 - cool / 0.6)})`} strokeWidth={5} fill="none" opacity={1 - t} />; }) : null}
          {/* enchufe afuera */}
          <g transform="translate(1600 520)"><rect x={-70} y={-100} width={140} height={200} rx={16} fill="#F2F2EE" stroke="#BBB" strokeWidth={4} /><circle cx={-22} cy={0} r={10} fill="#555" /><circle cx={22} cy={0} r={10} fill="#555" /></g>
          <g transform={`translate(${1420 - 30 * lin(f, 4, 14)} 560)`}><rect x={-60} y={-30} width={90} height={60} rx={10} fill="#333" /><rect x={30} y={-14} width={30} height={8} fill="#999" /><rect x={30} y={6} width={30} height={8} fill="#999" /><path d="M-60 0 Q-400 40 -500 160" stroke="#333" strokeWidth={10} fill="none" /></g>
          <g transform={`translate(${930 + 300 * (1 - hand)} 520)`} opacity={hand}>
            <path d="M120 -50 L420 -70 L430 40 L130 50 Z" fill={CL.navy} />
            <path d="M-40 -60 Q20 -78 130 -60 L140 40 Q40 56 -30 40 Z" fill="#D9A47E" stroke="#A8724D" strokeWidth={4} />
            {[0, 1, 2, 3].map((i) => <path key={i} d={`M-30 ${-52 + i * 24} Q-120 ${-60 + i * 26} -170 ${-46 + i * 28} Q-186 ${-36 + i * 28} -170 ${-28 + i * 28} Q-120 ${-38 + i * 26} -30 ${-34 + i * 24}`} fill="#D59D77" stroke="#A8724D" strokeWidth={3} />)}
            <path d="M40 30 Q-10 70 -70 66 Q-84 56 -70 48 Q-20 44 20 14 Z" fill="#CF9670" stroke="#A8724D" strokeWidth={3} />
            {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={-24} cy={-46 + i * 24} rx={9} ry={6} fill="#C88E68" />)}
          </g>
        </svg>
        <Tag x={200} y={900} text="desenchufada y fría" k={lin(f, 4, 14)} />
        <Tag x={200} y={1000} text="el dorso cerca, sin apoyar" k={hand * 2} color={CL.inkSoft} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 11 · la pasta en la suela
export const PlSolePaste: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const k = ease(lin(f, 10, T * 0.9)); const a = f / 5;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={612} dim={0.4} />
      <Hand2D seed={612}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <g transform="translate(820 560) scale(1.25)">
            <SolePlate />
            {Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx={(rnd(i) - 0.5) * 260} cy={-200 + rnd(i + 3) * 460} rx={20 + rnd(i + 1) * 40} ry={14 + rnd(i + 2) * 22} fill={hexA(BRN, 0.6 * (1 - k))} />)}
            <g transform={`translate(${Math.cos(a) * 80} ${Math.sin(a) * 120 - 20})`}>
              <ellipse cx={0} cy={0} rx={120} ry={90} fill="#FFFFFF" stroke="#DDD" strokeWidth={4} />
              <ellipse cx={0} cy={0} rx={70} ry={45} fill="rgba(245,245,240,0.95)" />
              {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={(rnd(i + 30) - 0.5) * 100} cy={(rnd(i + 31) - 0.5) * 60} r={6} fill="#EEE9DF" />)}
            </g>
          </g>
        </svg>
        <Tag x={1300} y={300} text="2 cucharadas de bicarbonato" k={lin(f, 4, 14)} />
        <Tag x={1300} y={400} text="+ poquita agua = pasta" k={lin(f, 12, 22)} color={CL.inkSoft} />
        <Tag x={1300} y={700} text="en círculos, sin apretar" k={lin(f, T * 0.5, T * 0.6)} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 12 · el hisopo en cada agujerito
export const PlHoleSwab: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const k = lin(f, 6, T * 0.92); const cur = Math.floor(k * holeCount);
  let hx = 0, hy = 0; { let n = 0; for (let r = 0; r < 7; r++) for (let c = -2; c <= 2; c++) if (Math.abs(c) * 46 < 40 + r * 18) { if (n === Math.min(cur, holeCount - 1)) { hx = c * 46; hy = -150 + r * 55; } n++; } }
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={613} dim={0.4} />
      <Hand2D seed={613} push={[1.0, 1.06]}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <g transform="translate(800 560) scale(1.35)">
            <SolePlate holes={(i) => (i < cur ? "#3A3D42" : "#E8E1CF")} />
            <g transform={`translate(${hx} ${hy}) rotate(30)`}><rect x={-6} y={-8} width={12} height={320} rx={6} fill="#F4F1EA" stroke="#CFC8B8" strokeWidth={2} /><ellipse cx={0} cy={-8} rx={16} ry={26} fill="#FFFFFF" stroke="#DDD" strokeWidth={2} /></g>
          </g>
        </svg>
        <div style={{ position: "absolute", left: 1320, top: 330, fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: CL.navy, fontVariantNumeric: "tabular-nums", padding: "6px 30px", background: "#FFF8EA", borderRadius: 16, boxShadow: "0 18px 40px rgba(0,0,0,0.28)", border: "3px solid #E6DAC2" }}>{Math.min(cur, holeCount)}/{holeCount}</div>
        <Tag x={1320} y={560} text="uno por uno" k={lin(f, 6, 16)} />
        <Tag x={1320} y={660} text="sale blanco o marrón" k={lin(f, T * 0.4, T * 0.5)} color={BRN} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 13 · nada de metal
export const PlNoScratch: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const X = ["cuchillo", "lana de acero", "esponja verde"]; const sn = lin(f, T * 0.55, T * 0.85);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={614} dim={0.4} />
      <Hand2D seed={614}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {X.map((t, i) => { const p = pop(f, fps, 2 + i * 6, 11); const x = 260 + i * 300, y = 300; return <g key={i} opacity={p} transform={`translate(${x} ${y})`}>
            {i === 0 ? <g><rect x={-20} y={-120} width={40} height={140} rx={10} fill="#5A3A22" /><path d="M-18 20 L18 20 L10 200 Q0 220 -14 190 Z" fill="#C8CED4" stroke="#8E959D" strokeWidth={3} /></g>
              : i === 1 ? <g>{Array.from({ length: 40 }, (_, k) => <path key={k} d={`M${(rnd(k) - 0.5) * 140} ${(rnd(k + 1) - 0.5) * 100} q 20 ${rnd(k + 2) * 30 - 15} 40 0`} stroke="#9AA0A6" strokeWidth={3} fill="none" />)}</g>
              : <g><rect x={-90} y={-60} width={180} height={50} rx={8} fill="#3D8B3D" /><rect x={-90} y={-12} width={180} height={70} rx={8} fill="#F2D35B" /></g>}
          </g>; })}
          <g transform="translate(1360 600) rotate(-90) scale(0.85)"><SolePlate col="#2E3136" /></g>
          <line x1={1250} y1={560} x2={1250 + 360 * sn} y2={620} stroke="#C8CED4" strokeWidth={4} />
          <path d={`M1100 820 Q${1300 + 100 * sn} ${720 - 60 * sn} 1700 820`} stroke="#E8E4DA" strokeWidth={6} fill="none" />
        </svg>
        {X.map((t, i) => <div key={i} style={{ position: "absolute", left: 260 + i * 300 - 70, top: 540, opacity: lin(f, 12 + i * 6, 20 + i * 6) }}><Tick ok={false} s={140} k={lin(f, 12 + i * 6, 24 + i * 6)} /></div>)}
        {X.map((t, i) => <div key={i} style={{ position: "absolute", left: 260 + i * 300, top: 720, translate: "-50% 0", fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: CL.navy, whiteSpace: "nowrap", padding: "6px 18px", background: "#FFF8EA", borderRadius: 16, boxShadow: "0 18px 40px rgba(0,0,0,0.28)", border: "3px solid #E6DAC2", opacity: lin(f, 8 + i * 6, 16 + i * 6) }}>{t}</div>)}
        <Tag x={1150} y={920} text="una raya engancha la tela para siempre" k={sn * 2} color={CL.red} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 14 · la prueba del trapo
export const PlRagTest: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const pass = lin(f, 4, T * 0.5); const light = lin(f, T * 0.5, T * 0.85);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={615} dim={0.35} />
      <Hand2D seed={615} push={[1.04, 1.0]}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d="M180 520 L1600 480 Q1780 500 1760 620 L1600 760 L180 780 Z" fill="#7C8FA6" />
          <path d="M360 500 L1460 490 L1480 770 L340 780 Z" fill="#FFFFFF" stroke="#CFC9BC" strokeWidth={5} />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M${420 + i * 260} 505 Q${470 + i * 260} 640 ${430 + i * 260} 772`} stroke="rgba(0,0,0,0.07)" strokeWidth={14} fill="none" />)}
          {Array.from({ length: 36 }, (_, i) => <line key={i} x1={345 + i * 32} y1={778 - i * 0.3} x2={341 + i * 32 + (rnd(i) - 0.5) * 8} y2={806 - i * 0.3} stroke="#E2DDD2" strokeWidth={4} />)}
          <Iron x={420 + 900 * (((pass * 3) % 1))} y={620} s={1.2} rot={-4} />
          <defs><linearGradient id="plLight" x1="0" x2="1"><stop offset="0" stopColor="rgba(255,240,190,0)" /><stop offset="0.5" stopColor="rgba(255,240,190,0.75)" /><stop offset="1" stopColor="rgba(255,240,190,0)" /></linearGradient></defs>
          {light > 0 ? <rect x={200 + 1300 * light} y={480} width={260} height={320} fill="url(#plLight)" /> : null}
        </svg>
        <Tag x={300} y={880} text="un trapo viejo, blanco" k={lin(f, 4, 14)} />
        <Tag x={1100} y={880} text="sin una gota · sin una escama" k={lin(f, T * 0.7, T * 0.8)} />
        <Stamp text="LISTA" at={Math.round(T * 0.82)} x="52%" y="38%" size={74} rot={-6} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 15 · el depósito vacío
export const PlEmptyTank: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const d = lin(f, 6, T * 0.75); const day = Math.max(1, Math.round(d * 30));
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={616} dim={0.4} />
      <Hand2D seed={616}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {[0, 1].map((s) => { const x = s ? 1340 : 580; return <g key={s} transform={`translate(${x} 560)`}>
            <rect x={-260} y={-220} width={520} height={440} rx={40} fill="rgba(215,235,250,0.7)" stroke="#2F6FB3" strokeWidth={10} />
            {!s ? <><rect x={-240} y={20} width={480} height={180} fill="rgba(110,170,225,0.85)" />
              {Array.from({ length: Math.round(40 * d) }, (_, i) => <rect key={i} x={-230 + rnd(i) * 460} y={180 - rnd(i + 1) * 30 - (i % 3 === 0 ? 0 : 0)} width={14} height={8} fill={SCALE} />)}
              <rect x={-240} y={190 - 34 * d} width={480} height={34 * d} fill={SCALE} stroke="#B9AE96" strokeWidth={2} />
              <rect x={-245} y={20} width={8} height={170} fill={SCALE} opacity={d} /><rect x={237} y={20} width={8} height={170} fill={SCALE} opacity={d} /></>
              : null}
          </g>; })}
        </svg>
        <div style={{ position: "absolute", left: 580, top: 420, translate: "-50% 0", fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: CL.navy, fontVariantNumeric: "tabular-nums", padding: "4px 28px", background: "#FFF8EA", borderRadius: 16, boxShadow: "0 18px 40px rgba(0,0,0,0.28)", border: "3px solid #E6DAC2" }}>día {day}</div>
        <Tag x={440} y={880} text="agua quieta adentro" k={lin(f, 4, 14)} color={CL.red} />
        <Tag x={1180} y={880} text="vacía y tibia: limpia" k={lin(f, T * 0.5, T * 0.6)} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 16 · parada sobre el talón
export const PlParked: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const up = ease(lin(f, 6, T * 0.4));
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={617} dim={0.4} />
      <Hand2D seed={617}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <rect x={0} y={800} width={1920} height={280} fill="#B48A5E" /><rect x={0} y={800} width={1920} height={14} fill="#8C6A44" />
          <g opacity={lin(f, 2, 10)}><Iron x={560} y={800} s={1.1} /></g>
          <g transform={`translate(1360 800) rotate(${-90 * up}) translate(0 0)`}><Iron x={185} y={0} s={1.1} /></g>
        </svg>
        <div style={{ position: "absolute", left: 500, top: 300, opacity: lin(f, T * 0.45, T * 0.55) }}><Tick ok={false} s={120} k={lin(f, T * 0.45, T * 0.6)} /></div>
        <div style={{ position: "absolute", left: 1450, top: 160, opacity: lin(f, T * 0.45, T * 0.55) }}><Tick ok s={120} k={lin(f, T * 0.45, T * 0.6)} /></div>
        <Tag x={380} y={900} text="acostada sobre la suela" k={lin(f, 4, 14)} color={CL.red} />
        <Tag x={1200} y={900} text="parada, sobre el talón · fría" k={up * 2} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 17 · la fila de planchas (revista de Rosa)
export const PlIronRow: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const scan = lin(f, T * 0.25, T * 0.9); const N = 6;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={618} dim={0.62} />
      <Hand2D seed={618}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <rect x={120} y={720} width={1680} height={40} fill="#9A7048" stroke="#6E4E2E" strokeWidth={4} />
          {Array.from({ length: N }, (_, i) => { const p = pop(f, fps, 2 + i * 4, 11); return <g key={i} transform={`translate(${260 + i * 280} ${720 - (1 - p) * 300}) rotate(-90)`} opacity={p}><Iron x={185} y={0} s={0.65} tank={0} body={i % 2 ? "#3D7FBF" : "#3A9A8A"} /></g>; })}
          <rect x={160 + scan * 1600} y={120} width={6} height={600} fill={hexA(CL.yellow, 0.7)} />
        </svg>
        {Array.from({ length: N }, (_, i) => <div key={i} style={{ position: "absolute", left: 220 + i * 280, top: 790, opacity: scan * N > i + 0.5 ? 1 : 0 }}><Tick ok s={110} k={clamp01(scan * N - i - 0.5) * 2} /></div>)}
        <Tag x={160} y={960} text="vacías · secas · paradas · en fila" k={lin(f, 6, 16)} />
        <Tag x={1300} y={960} text="Rosa pasaba revista" k={lin(f, T * 0.3, T * 0.4)} color={CL.brass} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 18 · abanico de errores sobre la tabla
export const PlFiveErrors: React.FC<{ hi?: number; bed?: string }> = ({ hi = 1, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const E = ["Agua en el depósito", "Vinagre puro", "Rascar con cuchillo", "Suela caliente", "Almidón directo"];
  const fan = ease(lin(f, 4, 22));
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={619} dim={0.35} />
      <Hand2D seed={619}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M120 760 L1650 740 Q1860 760 1840 830 L1650 880 L120 890 Z" fill="#7C8FA6" stroke="#4E5F75" strokeWidth={5} /><path d="M500 885 L760 1080 M1300 880 L1040 1080" stroke="#8E969F" strokeWidth={18} strokeLinecap="round" /></svg>
        {E.map((e, i) => { const a = (i - 2) * 5 * fan; const up = i + 1 === hi ? ease(lin(f, 20, 34)) : 0; return (
          <div key={i} style={{ position: "absolute", left: 800 + (i - 2) * 335 * fan, top: 230 + Math.abs(i - 2) * 30 * fan, width: 320, height: 460, transformOrigin: "50% 100%", transform: `rotate(${a}deg) translateY(${-70 * up}px) scale(${1 + 0.1 * up})`, zIndex: i + 1 === hi ? 10 : i, background: i + 1 === hi ? "#FFFFFF" : "#F1EDE4", borderRadius: 14, border: `6px solid ${i + 1 === hi ? CL.red : "#D8D1C2"}`, boxShadow: `0 20px 40px ${CL.shadow}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: i + 1 === hi ? CL.red : "#9A9384", lineHeight: 1 }}>{i + 1}</div>
            <div style={{ fontFamily: LABEL, fontSize: 42, color: CL.ink, marginTop: 16, opacity: i + 1 === hi ? 1 : 0.7 }}>{e}</div>
          </div>); })}
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 19 · el almidón: rociar, esperar, planchar
export const PlStarch: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const spray = lin(f, 4, T * 0.3); const wait = lin(f, T * 0.3, T * 0.65); const iron = ease(lin(f, T * 0.65, T * 0.95));
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={620} dim={0.35} />
      <Hand2D seed={620}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <rect x={500} y={660} width={920} height={260} rx={20} fill={SHIRT} stroke="#C9C2B4" strokeWidth={5} /><path d="M520 700 Q960 680 1400 700" stroke="rgba(0,0,0,0.06)" strokeWidth={14} fill="none" />
          <g transform="translate(360 320) rotate(20)"><rect x={-50} y={-40} width={100} height={260} rx={20} fill="#E7E2F2" stroke="#8D82B5" strokeWidth={4} /><rect x={-24} y={-80} width={48} height={50} rx={6} fill="#5B4E8C" /></g>
          {Array.from({ length: 50 }, (_, i) => { const t = ((f * 1.5 + i * 5) % 30) / 30; return <circle key={i} cx={420 + t * (300 + rnd(i) * 400)} cy={280 + t * (300 + rnd(i + 1) * 120)} r={3 + rnd(i + 2) * 4} fill="rgba(200,210,230,0.9)" opacity={spray > 0 && spray < 1 ? 1 - t : 0} />; })}
          {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={560 + rnd(i) * 800} cy={690 + rnd(i + 1) * 200} r={6} fill="rgba(190,200,215,0.8)" opacity={spray * (1 - wait)} />)}
          <g opacity={iron > 0 ? 1 : 0}><Iron x={1700 - 700 * iron} y={720} s={1} rot={-4} /></g>
          <g transform="translate(1500 300)"><circle r={110} fill="#FFFFFF" stroke={CL.navy} strokeWidth={8} />{wait >= 0.99 ? <circle r={90} fill={hexA(CL.yellow, 0.8)} /> : <path d={`M0 0 L0 -90 A90 90 0 ${wait > 0.5 ? 1 : 0} 1 ${Math.sin(wait * Math.PI * 2) * 90} ${-Math.cos(wait * Math.PI * 2) * 90} Z`} fill={hexA(CL.yellow, 0.8)} />}<line x1={0} y1={0} x2={Math.sin(wait * Math.PI * 2) * 80} y2={-Math.cos(wait * Math.PI * 2) * 80} stroke={CL.navy} strokeWidth={10} strokeLinecap="round" /><circle r={12} fill={CL.navy} /></g>
        </svg>
        <Tag x={170} y={560} text="1 · rocíe" k={lin(f, 4, 12)} />
        <Tag x={1330} y={460} text="2 · espere unos segundos" k={lin(f, T * 0.3, T * 0.38)} />
        <Tag x={800} y={980} text="3 · recién ahí, planche" k={lin(f, T * 0.65, T * 0.72)} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 20 · la planilla del cuarto de planchado
export const PlRoutine: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const S = [["El manual: agua, vinagre, botón", 2], ["Por dentro: autolimpieza o ¼ + ¾", 10], ["2-3 llenadas de destilada", 15], ["Por fuera, fría: pasta + hisopo", 15], ["La prueba del trapo", 3]] as const;
  const p = pop(f, fps, 0, 15); const step = (i: number) => clamp01((f - 10 - i * (T * 0.15)) / 10);
  const sum = S.reduce((a, [, m], i) => a + m * step(i), 0);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={621} dim={0.3} />
      <Hand2D seed={621}>
        <div style={{ position: "absolute", left: 170, top: 170, width: 1060, rotate: `${2 - 2 * p}deg`, translate: `0 ${(1 - p) * -900}px` }}>
          <div style={{ position: "absolute", left: 480, top: -40, width: 100, height: 60, borderRadius: 10, background: "#8C8F94" }} />
          <div style={{ background: "#FFFDF6", borderRadius: 8, boxShadow: `0 40px 80px ${CL.shadow}`, padding: "60px 60px 40px" }}>
            
            {S.map(([t, m], i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, height: 120, borderTop: "2px solid #E3DCCF", opacity: 0.75 + 0.25 * step(i) }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: CL.brass, width: 50 }}>{i + 1}</div>
              <div style={{ flex: 1, fontFamily: HAND, fontSize: 50, color: CL.ink }}>{t}</div>
              <div style={{ fontFamily: LABEL, fontSize: 40, color: CL.navy }}>{m} min</div>
              <div style={{ width: 70 }}>{step(i) > 0.1 ? <Tick ok s={66} k={step(i)} /> : null}</div>
            </div>)}
          </div>
        </div>
        <div style={{ position: "absolute", left: 1300, top: 340, opacity: p, padding: "24px 36px", background: "#FFF8EA", borderRadius: 16, boxShadow: "0 18px 40px rgba(0,0,0,0.28)", border: "3px solid #E6DAC2" }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: CL.inkSoft, letterSpacing: 4 }}>TOTAL</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 120, whiteSpace: "nowrap", color: CL.navy, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{Math.round(sum)} min</div>
          <div style={{ fontFamily: HAND, fontSize: 50, color: CL.ink, opacity: lin(f, T * 0.8, T * 0.9), width: 520 }}>y recién ahí, la camisa</div>
        </div>
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 21 · qué agua sí y cuál no
export const PlWaterSrc: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const W = [["aire acondicionado", false], ["deshumidificador", false], ["destilada", true]] as const;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={622} dim={0.35} />
      <Hand2D seed={622}>
        {W.map(([t, ok], i) => { const p = pop(f, fps, 4 + i * Math.round(T * 0.2), 12); const x = 260 + i * 560; return (
          <div key={i} style={{ position: "absolute", left: x, top: 220, width: 440, opacity: p, translate: `0 ${(1 - p) * 120}px`, textAlign: "center" }}>
            <svg width={440} height={460}>
              <path d="M140 60 L140 120 Q80 160 80 230 L80 420 Q80 440 100 440 L340 440 Q360 440 360 420 L360 230 Q360 160 300 120 L300 60 Z" fill={ok ? "rgba(190,220,245,0.6)" : "rgba(190,190,170,0.6)"} stroke={ok ? "#7FA6C8" : "#9A9480"} strokeWidth={6} />
              <rect x={130} y={30} width={180} height={40} rx={8} fill={ok ? "#2F6FB3" : "#777"} />
              {!ok ? Array.from({ length: 30 }, (_, k) => <circle key={k} cx={100 + rnd(k + i * 40) * 240} cy={250 + rnd(k + 1 + i * 40) * 180} r={3 + rnd(k + 2) * 4} fill="rgba(100,95,70,0.6)" />) : null}
            </svg>
            <div style={{ display: "inline-block", fontFamily: LABEL, fontWeight: 700, fontSize: 44, color: CL.navy, padding: "6px 22px", background: "#FFF8EA", borderRadius: 16, boxShadow: "0 18px 40px rgba(0,0,0,0.28)", border: "3px solid #E6DAC2" }}>{t}</div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}><Tick ok={ok} s={100} k={lin(f, 12 + i * T * 0.2, 24 + i * T * 0.2)} /></div>
          </div>); })}
        <Tag x={300} y={960} text="polvo, mugre y bacterias: para las plantas" k={lin(f, T * 0.45, T * 0.55)} color={CL.red} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 22 · cuándo tirarla
export const PlWhenToss: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const R = ["escupe tras 2 limpiezas", "gotea sin apretar nada", "suela rayada que engancha"];
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={623} dim={0.35} />
      <Hand2D seed={623}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <Iron x={480} y={760} s={1.6} rot={-8} />
          <g transform="translate(160 960) rotate(-10)"><rect x={-40} y={-26} width={70} height={52} rx={9} fill="#333" /><rect x={30} y={-14} width={26} height={7} fill="#999" /><rect x={30} y={6} width={26} height={7} fill="#999" /></g>
          {Array.from({ length: 6 }, (_, i) => { const t = ((f + i * 10) % 40) / 40; return <ellipse key={i} cx={560 + i * 12} cy={770 + t * 220} rx={8} ry={12} fill="#7FB6E0" opacity={(1 - t) * lin(f, T * 0.35, T * 0.4)} />; })}
        </svg>
        <div style={{ position: "absolute", left: 860, top: 210, width: 960, height: 540, opacity: lin(f, 4, 12), background: "#FFF8EA", borderRadius: 16, boxShadow: "0 18px 40px rgba(0,0,0,0.28)", border: "3px solid #E6DAC2" }} />
        {R.map((r, i) => { const k = lin(f, 8 + i * T * 0.22, 18 + i * T * 0.22); return <div key={i} style={{ position: "absolute", left: 900, top: 260 + i * 170, display: "flex", alignItems: "center", gap: 24, opacity: k, translate: `${(1 - k) * 80}px 0` }}>
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: CL.red, color: "#fff", fontFamily: SERIF, fontWeight: 900, fontSize: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: CL.navy, whiteSpace: "nowrap" }}>{r}</div></div>; })}
        <Tag x={900} y={860} text="ya no es piedra: es la plancha" k={lin(f, T * 0.8, T * 0.9)} color={CL.red} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 23 · repaso en el perchero
export const PlRecap: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const W = ["piedra en la cámara", "primero el manual", "autolimpieza", "¼ vinagre: sólo si el manual deja", "2-3 llenadas de destilada", "fría y desenchufada", "pasta + paño suave", "hisopo, uno por uno", "nada de metal", "la prueba del trapo", "vaciarla siempre", "guardarla parada"];
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={624} dim={0.35} />
      <Hand2D seed={624} push={[1.04, 1.0]}>
        {[0, 1, 2].map((r) => <div key={r} style={{ position: "absolute", left: 80, right: 80, top: 84 + r * 330, height: 14, borderRadius: 7, background: "linear-gradient(180deg,#D7DCE1,#9AA2AB)" }} />)}
        {W.map((w, i) => { const r = Math.floor(i / 4), c = i % 4; const t0 = 4 + i * ((T - 30) / W.length); const p = pop(f, fps, t0, 10); const sw = Math.sin(f / 14 + i) * 2;
          return <div key={i} style={{ position: "absolute", left: 140 + c * 430, top: 70 + r * 330, width: 360, transformOrigin: "50% 0", rotate: `${sw + (1 - p) * 30}deg`, opacity: clamp01(p * 2) }}>
            <svg width={360} height={80} style={{ display: "block" }}><path d="M180 20 q 0 -18 16 -18" stroke="#888" strokeWidth={6} fill="none" /><path d="M20 76 L180 22 L340 76" stroke="#7A5A3A" strokeWidth={10} fill="none" /></svg>
            <div style={{ marginTop: -6, height: 200, background: SHIRT, borderRadius: "0 0 10px 10px", boxShadow: `0 20px 40px ${CL.shadow}`, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", padding: 16 }}>
              <div style={{ fontFamily: LABEL, fontSize: 28, color: CL.brass, letterSpacing: 3 }}>{i + 1}</div>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 44, color: CL.navy, lineHeight: 1.1 }}>{w}</div>
            </div>
          </div>; })}
      </Hand2D>
      <RoomLight k={0.6} />
    </AbsoluteFill>
  );
};
