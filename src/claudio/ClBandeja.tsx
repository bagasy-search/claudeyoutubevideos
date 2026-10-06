// Componentes del video de las BANDEJAS (reusables por el canal), DENTRO del mundo (cama real de la cocina del hotel, sombra, luz):
//   ClPasteCheck  la prueba del surco: tres montoncitos de pasta; el dedo del guante pasa por cada uno → chorrea / PERFECTA / polvo
//   ClCoating     la capa antiadherente de cerca: LANA DE ACERO (rayas brillantes, rojo) vs ESPONJA SUAVE (queda lisa, azul)
//   ClTally       el pizarrón de Don Ramiro: 30 bandejas rescatadas, se tachan 2, quedan 28 con tilde
//   ClReceipt     el ticket que se imprime: 40 bandejas/año × 10 años = 400 vs bicarbonato + frascos; total ahorrado subrayado
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, rnd, clamp01, ease } from "./ClTheme";
import { Bed, Card, Contact, RoomLight, lin, pop, useOut } from "./ClParts";

// ───────────────── ClPasteCheck
const Mound: React.FC<{ kind: "runny" | "ok" | "dry"; t0: number; x: number }> = ({ kind, t0, x }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig();
  const k = lin(f, t0 - 8, t0), swipe = ease(clamp01((f - t0) / 16));
  const ok = kind === "ok";
  const label = kind === "runny" ? "chorrea" : kind === "dry" ? "se desarma" : "¡perfecta!";
  return (
    <div style={{ position: "absolute", left: x, top: 380, width: 440, height: 420, opacity: k }}>
      <svg width={440} height={300} viewBox="0 0 440 300">
        {kind === "runny" ? <path d={`M40 230 Q220 ${120 + 20 * Math.sin(f * 0.1)} 400 230 Q 420 280 220 290 Q 20 285 40 230 Z`} fill="#F2F0E8" opacity={0.95} /> :
          kind === "dry" ? <g>{Array.from({ length: 60 }, (_, i) => <circle key={i} cx={80 + rnd(i) * 280} cy={150 + rnd(i + 3) * 120} r={5 + rnd(i + 5) * 10} fill="#FBFBF8" stroke="#E2DFD6" />)}</g> :
            <path d="M40 260 Q 70 120 220 110 Q 370 120 400 260 Z" fill="#F7F6F1" stroke="#E6E2D7" strokeWidth={3} />}
        {/* el surco del dedo */}
        {swipe > 0 ? <path d={`M ${60} ${kind === "ok" ? 190 : 210} L ${60 + 320 * swipe} ${kind === "ok" ? 175 : 200}`} stroke={kind === "ok" ? "#C9C3B4" : "rgba(201,195,180,0.25)"} strokeWidth={kind === "ok" ? 22 : 14} strokeLinecap="round" opacity={kind === "runny" ? 1 - clamp01((f - t0 - 18) / 12) : 1} /> : null}
      </svg>
      <div style={{ position: "absolute", left: 60 + 320 * swipe - 40, top: kind === "ok" ? 120 : 140, width: 90, height: 60, borderRadius: 30, background: CL.nitrile, opacity: swipe > 0 && swipe < 1 ? 1 : 0, boxShadow: "0 6px 10px rgba(0,0,0,0.25)" }} />
      <div style={{ textAlign: "center", marginTop: 6, fontFamily: HAND, fontWeight: 700, fontSize: ok ? 70 : 56, color: ok ? "#2E8B57" : CL.red, opacity: lin(f, t0 + 18, t0 + 26), scale: String(ok ? 1 + 0.08 * Math.sin(f * 0.3) : 1) }}>{label}</div>
    </div>
  );
};
export const ClPasteCheck: React.FC<{ bed?: string }> = ({ bed }) => {
  const out = useOut(6);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={63} dim={0.35} />
      <Contact x={960} y={720} w={1500} o={0.3} />
      <Mound kind="runny" t0={10} x={120} />
      <Mound kind="ok" t0={30} x={740} />
      <Mound kind="dry" t0={50} x={1360} />
      <RoomLight k={0.4} />
    </AbsoluteFill>
  );
};

// ───────────────── ClCoating
const CoatPanel: React.FC<{ steel: boolean; t0: number }> = ({ steel, t0 }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig();
  const k = lin(f, t0 - 6, t0 + 4), u = clamp01((f - t0) / (T * 0.6));
  const W = 720, H = 520, px = 120 + (W - 240) * (0.5 + 0.5 * Math.sin(u * Math.PI * 6 - Math.PI / 2));
  const scratches = steel ? Math.floor(u * 40) : 0;
  return (
    <div style={{ position: "relative", width: W, height: H, borderRadius: 24, overflow: "hidden", opacity: k, border: `10px solid ${CL.white}`, boxShadow: `0 26px 56px ${CL.shadow}`, background: "radial-gradient(ellipse at 40% 30%, #4A4D52, #26282C)" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0 2px, transparent 2px 6px)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: scratches }, (_, i) => { const y = 80 + rnd(i) * 360, x = 40 + rnd(i + 4) * 260; return <line key={i} x1={x} y1={y} x2={x + 200 + rnd(i + 2) * 240} y2={y - 20 + rnd(i + 9) * 40} stroke="#D9DCE0" strokeWidth={1.5 + rnd(i + 5) * 2} opacity={0.85} />; })}
      </svg>
      {/* la herramienta */}
      {steel ? <div style={{ position: "absolute", left: px - 110, top: 200, width: 220, height: 130, borderRadius: 40, background: "repeating-linear-gradient(35deg, #B9BCC0 0 3px, #8D9095 3px 6px)", boxShadow: "0 12px 20px rgba(0,0,0,0.4)" }} />
        : <div style={{ position: "absolute", left: px - 110, top: 200, width: 220, height: 130, borderRadius: 18, background: "#F2C230", boxShadow: "0 12px 20px rgba(0,0,0,0.4)" }}><div style={{ height: 30, borderRadius: "18px 18px 0 0", background: "#F6E7A8" }} /></div>}
      <div style={{ position: "absolute", left: 24, top: 20, background: steel ? CL.red : CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 3, padding: "6px 24px", borderRadius: 10 }}>{steel ? "LANA DE ACERO" : "ESPONJA SUAVE"}</div>
      <div style={{ position: "absolute", right: 24, bottom: 20, opacity: lin(f, t0 + T * 0.35, t0 + T * 0.45), background: CL.white, color: steel ? CL.red : CL.navy, fontFamily: HAND, fontWeight: 700, fontSize: 56, padding: "0 24px", borderRadius: 14 }}>{steel ? "se pega más" : "queda lisa"}</div>
    </div>
  );
};
export const ClCoating: React.FC<{ bed?: string }> = ({ bed }) => {
  const out = useOut(6);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={73} dim={0.4} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", justifyContent: "center", gap: 60 }}>
        <CoatPanel steel t0={6} />
        <CoatPanel steel={false} t0={16} />
      </div>
      <RoomLight k={0.4} />
    </AbsoluteFill>
  );
};

// ───────────────── ClTally
export const ClTally: React.FC<{ total?: number; lost?: number; title?: string; bed?: string }> = ({ total = 30, lost = 2, title = "Bandejas rescatadas", bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const per = Math.max(1, Math.round(T * 0.45 / total));
  const saved = total - lost;
  const lostIdx = new Set([7, 22].slice(0, lost));
  const done = f > 10 + total * per + 6;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={83} dim={0.3} />
      <div style={{ position: "absolute", left: 260, top: 130, width: 1400, height: 820, borderRadius: 18, background: "#2E3B32", border: "22px solid #8A6236", boxShadow: `0 40px 70px ${CL.shadow}` }}>
        <div style={{ position: "absolute", left: 50, top: 30, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: "#F4F1E6", opacity: lin(f, 2, 10) }}>{title}</div>
        <div style={{ position: "absolute", left: 60, top: 150, display: "grid", gridTemplateColumns: "repeat(10, 120px)", gap: "26px 6px" }}>
          {Array.from({ length: total }, (_, i) => {
            const k = lin(f, 10 + i * per, 14 + i * per), isLost = lostIdx.has(i);
            return (
              <div key={i} style={{ position: "relative", width: 110, height: 70, opacity: k }}>
                <svg width={110} height={70} viewBox="0 0 110 70"><rect x={6} y={14} width={98} height={46} rx={6} fill="none" stroke="#F4F1E6" strokeWidth={5} /><rect x={14} y={22} width={82} height={30} rx={3} fill="rgba(244,241,230,0.15)" /></svg>
                {done && isLost ? <svg width={110} height={70} style={{ position: "absolute", inset: 0 }}><path d="M8 8 L102 62 M102 8 L8 62" stroke="#E86A5A" strokeWidth={8} strokeLinecap="round" /></svg> : null}
                {done && !isLost ? <div style={{ position: "absolute", right: -6, top: -14, fontFamily: HAND, fontWeight: 700, fontSize: 46, color: "#9BE08F", opacity: lin(f, 10 + total * per + 6 + i, 10 + total * per + 12 + i) }}>✓</div> : null}
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", right: 60, bottom: 40, opacity: lin(f, T * 0.7, T * 0.8), scale: String(0.8 + 0.2 * pop(f, fps, Math.round(T * 0.7))), fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: CL.yellow }}>{saved} / {total}</div>
      </div>
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};

// ───────────────── ClReceipt
export const ClReceipt: React.FC<{ lines?: [string, string][]; total?: [string, string]; bed?: string }> = ({ lines = [["Bandejas tiradas por año", "40"], ["Años", "× 10"], ["Bandejas en 10 años", "400"], ["Bicarbonato y frascos marrones", "unas cajas"]], total = ["Bandejas que se salvaron", "casi todas"], bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const printed = ease(clamp01((f - 6) / (T * 0.55)));
  const H = 760;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={93} dim={0.3} />
      <Contact x={960} y={980} w={700} o={0.35} />
      <div style={{ position: "absolute", left: 960 - 330, top: 980 - H * printed, width: 660, height: H * printed, overflow: "hidden", rotate: "-2deg" }}>
        <div style={{ position: "absolute", left: 0, bottom: 0, width: 660, height: H, background: "#FFFEF8", boxShadow: `0 30px 60px ${CL.shadow}`, padding: "50px 54px", boxSizing: "border-box", backgroundImage: "linear-gradient(transparent 96%, rgba(0,0,0,0.04) 96%)", backgroundSize: "100% 30px" }}>
          <div style={{ textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: CL.ink }}>COCINA · HOTEL</div>
          <div style={{ textAlign: "center", fontFamily: LABEL, fontSize: 28, color: CL.inkSoft, marginBottom: 26 }}>- - - - - - - - - - - - - - - - - - - -</div>
          {lines.map(([a, b], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: LABEL, fontWeight: 500, fontSize: 36, color: CL.ink, margin: "16px 0" }}><span>{a}</span><b>{b}</b></div>)}
          <div style={{ textAlign: "center", fontFamily: LABEL, fontSize: 28, color: CL.inkSoft, margin: "20px 0" }}>- - - - - - - - - - - - - - - - - - - -</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SERIF, fontWeight: 900, fontSize: 48, color: CL.ink }}><span>{total[0]}</span></div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 80, color: CL.red, textAlign: "right", marginTop: 6 }}>{total[1]}</div>
        </div>
      </div>
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};
