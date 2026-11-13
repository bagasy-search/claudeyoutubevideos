// St4.tsx — stan12l: el truco de la tapa, hecho con las dos fotos reales de la parrilla vista desde arriba (puro CSS/DOM)
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, Easing } from "remotion";
import { F, K } from "./St";

const { MARK, SLAB } = F;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eio = (t: number) => Easing.inOut(Easing.cubic)(cl(t));
const eout = (t: number) => Easing.out(Easing.cubic)(cl(t));
const kraft = `repeating-linear-gradient(92deg, rgba(90,60,25,0.07) 0 2px, transparent 2px 7px), linear-gradient(170deg, ${K.kraft} 0%, ${K.kraft2} 100%)`;

const Note: React.FC<{ x: number; y: number; a: string; b: string; show: number; rot?: number; k?: number }> = ({ x, y, a, b, show, rot = -2, k = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: cl(show * 2), transform: `translateY(${(1 - show) * 50}px) rotate(${rot}deg)`, transformOrigin: "0 100%", background: kraft, padding: "10px 26px 14px", boxShadow: "0 12px 28px rgba(0,0,0,0.55)", whiteSpace: "nowrap" }}>
    <span style={{ fontFamily: SLAB, fontWeight: 800, fontSize: 72 * k, color: K.red, marginRight: 14 * k }}>{a}</span>
    <span style={{ fontFamily: MARK, fontSize: 62 * k, color: K.ink }}>{b}</span>
  </div>
);

export type LidGeo = { g: [number, number, number]; l: [number, number, number]; vent: [number, number] };
// fase 1: la tapa (recorte circular de su foto) baja sobre la parrilla abierta con la ventilación del lado del fuego y GIRA hasta el lado frío
// fase 2: tapa puesta; la cámara va a la ventilación: la única salida
// fase 3: parrilla abierta y apagada: una mancha de calor cruza de las brasas a la salida
export const GrillLid: React.FC<{ open: string; lid: string; geo: LidGeo; phase: number; fTurn?: number; fNote?: number; fB?: number; dur: number }> = ({ open, lid, geo, phase, fTurn = 60, fNote = 90, fB = 9999, dur }) => {
  const f = useCurrentFrame(); const [gx, gy, gr] = geo.g; const [lx, ly, lr] = geo.l; const [vx, vy] = geo.vent;
  const t = f / Math.max(1, dur);
  if (phase === 1) {
    const drop = eout((f - 34) / 22); const turn = eio((f - fTurn) / 34); const k = gr / lr;
    const z = lerp(1.0, 1.08, eio(t));
    // posición de la ventilación ya girada, en coordenadas de la parrilla abierta
    const nvx = gx + (vx - lx) * k, nvy = gy + (vy - ly) * k;
    return (
      <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}>
        <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${gx}px ${gy}px` }}>
          <Img src={staticFile(open)} style={{ position: "absolute", width: 1920, height: 1080, objectFit: "fill" }} />
          <div style={{ position: "absolute", left: gx - gr, top: gy - gr - (1 - drop) * 1100, width: gr * 2, height: gr * 2, borderRadius: "50%", overflow: "hidden", boxShadow: `0 ${lerp(120, 14, drop)}px ${lerp(90, 30, drop)}px rgba(0,0,0,0.6)`, transform: `rotate(${lerp(180, 0, turn)}deg) scale(${lerp(1.12, 1, drop)})` }}>
            <Img src={staticFile(lid)} style={{ position: "absolute", left: (lr - lx) * k, top: (lr - ly) * k, width: 1920 * k, height: 1080 * k, objectFit: "fill" }} />
          </div>
          <Note x={30} y={gy - 60} a="HOT" b="side" show={eout((f - 6) / 10)} k={0.8} rot={-3} />
          <Note x={1575} y={gy - 60} a="COOL" b="side" show={eout((f - 14) / 10)} k={0.8} rot={3} />
          <Note x={Math.min(980, nvx - 250)} y={Math.max(40, nvy - 230)} a="vent" b="over the cool side" show={eout((f - fNote) / 12)} />
          <Note x={Math.max(60, gx - gr - 40)} y={Math.min(900, gy + gr - 150)} a="and" b="leave it open" show={eout((f - fB) / 12)} rot={2} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  if (phase === 2) {
    const z = lerp(1.05, 1.5, eio(t * 1.2));
    return (
      <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}>
        <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${lerp(lx, vx, 0.8)}px ${lerp(ly, vy, 0.8)}px` }}>
          <Img src={staticFile(lid)} style={{ position: "absolute", width: 1920, height: 1080, objectFit: "fill" }} />
        </AbsoluteFill>
        <Note x={110} y={110} a="one" b="way out" show={eout((f - fNote) / 12)} />
        <Note x={110} y={840} a="no air" b="= no flare-up" show={eout((f - fB) / 12)} rot={1.5} />
      </AbsoluteFill>
    );
  }
  // fase 3
  const k = gr / lr; const ex = gx + (vx - lx) * k, ey = gy + (vy - ly) * k; const sx = gx - gr * 0.5, sy = gy;
  const loop = ((f - 10) % 70) / 70; const p = eio(loop); const bx = lerp(sx, ex, p), by = lerp(sy, ey, p) - Math.sin(p * Math.PI) * gr * 0.18;
  const a = f < 10 ? 0 : Math.sin(loop * Math.PI);
  const z = lerp(1.04, 1.12, eio(t));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${gx}px ${gy}px` }}>
        <Img src={staticFile(open)} style={{ position: "absolute", width: 1920, height: 1080, objectFit: "fill", filter: "brightness(0.5) saturate(0.7)" }} />
        <div style={{ position: "absolute", left: gx - gr, top: gy - gr, width: gr * 2, height: gr * 2, borderRadius: "50%", overflow: "hidden" }}>
          <Img src={staticFile(open)} style={{ position: "absolute", left: gr - gx, top: gr - gy, width: 1920, height: 1080, objectFit: "fill", filter: "brightness(0.82)" }} />
          {[0, 0.5].map((d, q) => { const lp = (((f - 10) / 90 - d) % 1 + 1) % 1; return <div key={q} style={{ position: "absolute", left: lerp(-gr * 0.9, gr * 1.7, lp), top: 0, width: gr * 1.2, height: gr * 2, background: "linear-gradient(90deg, rgba(255,205,160,0) 0%, rgba(255,205,160,0.34) 45%, rgba(255,225,190,0.42) 60%, rgba(255,205,160,0) 100%)", mixBlendMode: "screen", opacity: f < 10 ? 0 : Math.sin(lp * Math.PI) }} />; })}
        </div>
      </AbsoluteFill>
      <Note x={110} y={840} a="heat + smoke" b="cross the brats" show={eout((f - fNote) / 12)} />
      <Note x={1180} y={110} a="out" b="the far side" show={eout((f - fB) / 12)} rot={2} />
    </AbsoluteFill>
  );
};
