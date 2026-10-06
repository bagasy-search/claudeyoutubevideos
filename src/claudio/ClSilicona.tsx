// Componentes del video de la SILICONA (reusables por el canal), DENTRO del mundo (cama real del baño, sombra, luz):
//   ClFilmWrap  vista de cerca del rincón: la línea negra de silicona, las tiras empapadas se apoyan de a una, el film se estira encima
//   ClTubMap    el hotel en corte (4 pisos × 10 bañeras) de noche: el reloj avanza de 22 a 3 h y cada bañera se cubre; a las 7, 37 blancas
//               y 3 grises (la pared del patio)
//   ClCaulkGun  rehacer bien la silicona: cinta a los dos lados → cordón parejo → dedo con agua y jabón → se saca la cinta → "24 h sin mojar"
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, rnd, clamp01, ease } from "./ClTheme";
import { Bed, Contact, RoomLight, lin, pop, useOut } from "./ClParts";

const TILE = { backgroundColor: "#F1ECE2", backgroundImage: "linear-gradient(#CFC6B6 8px, transparent 8px), linear-gradient(90deg, #CFC6B6 8px, transparent 8px)", backgroundSize: "260px 260px, 260px 260px" } as React.CSSProperties;

// ───────────────── ClFilmWrap
export const ClFilmWrap: React.FC<{ bed?: string; n?: number }> = ({ bed, n = 6 }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const per = Math.max(6, Math.round(T * 0.45 / n));
  const filmK = ease(clamp01((f - (8 + n * per)) / (T * 0.25)));
  const X = 160, Y = 250, W = 1600, H = 600, lineY = 330;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={27} dim={0.42} />
      <Contact x={960} y={Y + H + 10} w={1500} o={0.3} />
      <div style={{ position: "absolute", left: X, top: Y, width: W, height: H, borderRadius: 22, overflow: "hidden", boxShadow: `0 30px 60px ${CL.shadow}`, border: `10px solid ${CL.white}` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: lineY, ...TILE }} />
        <div style={{ position: "absolute", left: 0, top: lineY + 40, width: W, height: H - lineY - 40, background: "linear-gradient(180deg, #FFFFFF, #ECEAE6)" }} />
        {/* la línea de silicona con moho */}
        <div style={{ position: "absolute", left: 0, top: lineY - 10, width: W, height: 60, borderRadius: 30, background: "linear-gradient(180deg, #F7F7F2, #DCDAD2)" }} />
        {Array.from({ length: 90 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * W, top: lineY + rnd(i + 3) * 40 - 4, width: 6 + rnd(i + 5) * 14, height: 5 + rnd(i + 6) * 10, borderRadius: "50%", background: "#1A1B12", opacity: 0.85 }} />)}
        {/* tiras empapadas */}
        {Array.from({ length: n }, (_, i) => { const k = ease(clamp01((f - 8 - i * per) / (per * 0.9))); if (k <= 0) return null; const w = W / n + 30;
          return <div key={"s" + i} style={{ position: "absolute", left: i * (W / n) - 15, top: lineY - 70, width: w, height: 170, rotate: `${(rnd(i) - 0.5) * 3}deg`, background: "linear-gradient(180deg, rgba(240,236,224,0.94), rgba(225,222,210,0.96))", boxShadow: "0 3px 8px rgba(0,0,0,0.15)", opacity: k, translate: `0 ${(1 - k) * -80}px`, backgroundImage: "radial-gradient(circle at 30% 40%, rgba(170,200,225,0.35), transparent 60%)" }} />; })}
        {/* film plástico con brillo */}
        {filmK > 0 ? <div style={{ position: "absolute", left: 0, top: lineY - 90, width: W * filmK, height: 210, background: "linear-gradient(170deg, rgba(255,255,255,0.55), rgba(220,235,245,0.25) 40%, rgba(255,255,255,0.5) 60%, rgba(220,235,245,0.2))", borderRight: "4px solid rgba(255,255,255,0.9)" }} /> : null}
      </div>
      <div style={{ position: "absolute", left: X + 40, top: Y - 70, opacity: lin(f, 8, 16), background: CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 44, letterSpacing: 2, padding: "8px 26px", borderRadius: 12, textTransform: "uppercase", borderBottom: `5px solid ${CL.yellow}` }}>Tiras empapadas</div>
      <div style={{ position: "absolute", right: 200, top: Y - 70, opacity: lin(f, 8 + n * per + 4, 8 + n * per + 14), background: CL.yellow, color: CL.ink, fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 2, padding: "8px 26px", borderRadius: 12, textTransform: "uppercase" }}>Film encima, sin aire</div>
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};

// ───────────────── ClTubMap
export const ClTubMap: React.FC<{ floors?: number; per?: number; gray?: number[]; bed?: string }> = ({ floors = 4, per = 10, gray = [7, 8, 9], bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const total = floors * per;
  const night = clamp01((f - 8) / (T * 0.6));
  const done = Math.floor(night * total);
  const morning = f > T * 0.72;
  const hour = morning ? "7:00" : `${Math.floor(22 + 5 * night) % 24}:${String(Math.floor((5 * night * 60) % 60)).padStart(2, "0")}`;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={37} dim={0.3} />
      <div style={{ position: "absolute", left: 250, top: 130, width: 1420, height: 800, borderRadius: 14, background: morning ? "#E9EEF4" : "#1E2D4F", boxShadow: `0 40px 70px ${CL.shadow}`, transition: "none" }}>
        {Array.from({ length: floors }, (_, fl) => (
          <div key={fl} style={{ position: "absolute", left: 40, top: 40 + (floors - 1 - fl) * 185, width: 1340, height: 160, borderBottom: `6px solid ${morning ? "#B9C3D2" : "#33456E"}` }}>
            <div style={{ position: "absolute", left: 0, top: 50, fontFamily: LABEL, fontWeight: 600, fontSize: 34, color: morning ? CL.ink : "#C9D3E6" }}>{fl + 1}° PISO</div>
            {Array.from({ length: per }, (_, j) => {
              const idx = fl * per + j, covered = idx < done, isGray = fl === floors - 1 && gray.includes(j);
              const col = morning ? (isGray ? "#9A9688" : "#FFFFFF") : covered ? "#F4EFE2" : "#3C4A6B";
              return (
                <div key={j} style={{ position: "absolute", left: 150 + j * 118, top: 40, width: 100, height: 90 }}>
                  <svg width={100} height={90} viewBox="0 0 100 90"><path d="M6 30 L94 30 Q 94 80 50 82 Q 6 80 6 30 Z" fill={col} stroke={morning ? "#7E8DA6" : "#5A6B90"} strokeWidth={4} />
                    {!morning && covered ? <path d="M10 34 L90 34" stroke="#8EC3E6" strokeWidth={6} /> : null}</svg>
                  {morning ? <div style={{ position: "absolute", left: 30, top: -38, fontFamily: HAND, fontWeight: 700, fontSize: 40, color: isGray ? CL.red : "#2E8B57", opacity: lin(f, T * 0.74 + (idx % 10), T * 0.78 + (idx % 10)) }}>{isGray ? "×" : "✓"}</div> : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", right: 120, top: 60, background: CL.white, borderRadius: 16, padding: "10px 30px", boxShadow: `0 14px 30px ${CL.shadow}`, fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: CL.ink, fontVariantNumeric: "tabular-nums" }}>{hour}</div>
      {morning ? <div style={{ position: "absolute", left: 960, top: 980, translate: "-50% 0", scale: String(0.8 + 0.2 * pop(f, fps, Math.round(T * 0.8))), opacity: lin(f, T * 0.8, T * 0.86), background: CL.yellow, color: CL.ink, fontFamily: SERIF, fontWeight: 900, fontSize: 64, padding: "4px 36px", borderRadius: 14, boxShadow: `0 14px 30px ${CL.shadow}` }}>37 de 40, blancas</div> : null}
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};

// ───────────────── ClCaulkGun
export const ClCaulkGun: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const s1 = ease(clamp01((f - 6) / (T * 0.15))), s2 = ease(clamp01((f - T * 0.22) / (T * 0.25))), s3 = ease(clamp01((f - T * 0.5) / (T * 0.18))), s4 = ease(clamp01((f - T * 0.7) / (T * 0.12)));
  const X = 160, Y = 280, W = 1600, H = 520, lineY = 280;
  const steps = ["Cinta", "Cordón parejo", "Dedo con jabón", "Sacar la cinta"];
  const cur = s4 > 0.05 ? 3 : s3 > 0.05 ? 2 : s2 > 0.05 ? 1 : 0;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={47} dim={0.42} />
      <div style={{ position: "absolute", left: X, top: Y, width: W, height: H, borderRadius: 22, overflow: "hidden", boxShadow: `0 30px 60px ${CL.shadow}`, border: `10px solid ${CL.white}` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: lineY, ...TILE }} />
        <div style={{ position: "absolute", left: 0, top: lineY + 30, width: W, height: H - lineY, background: "linear-gradient(180deg, #FFFFFF, #ECEAE6)" }} />
        {/* cinta de pintor a los dos lados (se va con s4) */}
        <div style={{ position: "absolute", left: 0, top: lineY - 52, width: W * s1, height: 40, background: "#E9D9A6", opacity: 1 - s4, translate: `0 ${-60 * s4}px` }} />
        <div style={{ position: "absolute", left: 0, top: lineY + 52, width: W * s1, height: 40, background: "#E9D9A6", opacity: 1 - s4, translate: `0 ${60 * s4}px` }} />
        {/* cordón: se aplica (s2) y se alisa (s3) */}
        <div style={{ position: "absolute", left: 0, top: lineY - 12 + 6 * s3, width: W * s2, height: 50 - 10 * s3, borderRadius: 25, background: "linear-gradient(180deg, #FFFFFF, #E4E3DD)", boxShadow: "0 2px 4px rgba(0,0,0,0.12)", clipPath: s3 < 1 ? undefined : undefined }}>
          {s3 < 1 ? Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i / 30) * W * s2 + W * s3, top: 8 + 10 * Math.sin(i), width: 40, height: 24, borderRadius: "50%", background: "rgba(220,218,210,0.7)", display: (i / 30) * W > W * s3 ? "block" : "none" }} />) : null}
        </div>
        {/* pistola (s2) y dedo (s3) */}
        {s2 > 0 && s2 < 1 ? <div style={{ position: "absolute", left: W * s2 - 20, top: lineY - 140, width: 300, height: 110, rotate: "-25deg", transformOrigin: "0% 100%" }}><div style={{ width: 70, height: 26, background: "#F5F5F5", clipPath: "polygon(0 50%, 100% 0, 100% 100%)" }} /><div style={{ position: "absolute", left: 60, top: -10, width: 220, height: 46, borderRadius: 10, background: "#D7DBE0" }} /></div> : null}
        {s3 > 0 && s3 < 1 ? <div style={{ position: "absolute", left: W * s3 - 40, top: lineY - 40, width: 110, height: 70, borderRadius: 35, background: CL.nitrile, boxShadow: "0 6px 10px rgba(0,0,0,0.25)" }} /> : null}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 160, display: "flex", justifyContent: "center", gap: 24 }}>
        {steps.map((st, i) => <div key={i} style={{ background: i === cur ? CL.navy : CL.white, color: i === cur ? "#fff" : CL.inkSoft, fontFamily: LABEL, fontWeight: 600, fontSize: 38, letterSpacing: 1, padding: "8px 22px", borderRadius: 12, boxShadow: `0 10px 20px ${CL.shadow}`, opacity: lin(f, 4 + i * 3, 10 + i * 3) }}>{i + 1}. {st}</div>)}
      </div>
      <div style={{ position: "absolute", left: 960, top: 860, translate: "-50% 0", opacity: lin(f, T * 0.82, T * 0.9), background: CL.yellow, color: CL.ink, fontFamily: SERIF, fontWeight: 900, fontSize: 58, padding: "4px 34px", borderRadius: 14, boxShadow: `0 14px 30px ${CL.shadow}` }}>24 horas sin mojar</div>
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};
