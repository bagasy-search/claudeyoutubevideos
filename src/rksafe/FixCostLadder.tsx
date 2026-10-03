// FixCostLadder.tsx — LOS 12 ARREGLOS COMO CARRUSEL DE FOTOS (canal Ray Kessler, rkkeyless v2).
//
// v2 (3-oct, "componentes flojos"): cada arreglo es una TARJETA-FOTO real (`img`) en un carrusel 3D.
// La activa (`active`, 1-based) viene al frente grande con su número, nombre y costo; las vecinas
// quedan a los costados inclinadas y en sombra. Detrás, la misma foto desenfocada llena el cuadro.
// Con `picks` (y active=0) muestra en abanico SÓLO los elegidos ("los tres de esta noche").
// Con active=0 y sin picks: el carrusel gira de 1 a 12 (la promesa del video).
// ⛔ Staggers en FRACCIÓN de la duración.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, clamp01 } from "./RayStage";
import { Tag } from "./WorldBed";

const ease = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.inOut(Easing.cubic) };
type It = { label: string; cost: string; img?: string };

const Tarjeta: React.FC<{ it: It; n: number; x: number; z: number; rot: number; on: boolean; a: number }> = ({ it, n, x, z, rot, on, a }) => (
  <div style={{
    position: "absolute", left: 960 + x - 330, top: 250, width: 660, height: 560, opacity: a,
    transform: `perspective(1600px) translateZ(${z}px) rotateY(${rot}deg)`, borderRadius: 18, overflow: "hidden",
    boxShadow: on ? "0 30px 80px rgba(0,0,0,.8), 0 0 0 4px #C8912F" : "0 20px 50px rgba(0,0,0,.7)", background: V.ink2,
    filter: on ? "none" : "brightness(.55)",
  }}>
    {it.img ? <Img src={staticFile(it.img)} style={{ width: "100%", height: 400, objectFit: "cover" }} /> : <div style={{ height: 400, background: V.ink1 }} />}
    <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px", background: "linear-gradient(180deg,#1E1E22,#0A0A0C)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 70, color: V.brassSoft, lineHeight: 1 }}>{n}</div>
        <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 34, color: V.white, maxWidth: 330, lineHeight: 1.1 }}>{it.label}</div>
      </div>
      <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 36, whiteSpace: "nowrap", color: it.cost.toLowerCase() === "free" ? V.ok : V.brassSoft }}>{it.cost}</div>
    </div>
  </div>
);

export const FixCostLadder: React.FC<{
  items?: It[];
  active?: number;
  picks?: number[];
  kicker?: string;
  caption?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({ items = [], active = 0, picks = [], kicker = "TWELVE WAYS · CHEAPEST FIRST", caption = "About $30 and ten minutes", durationInFrames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: seqDur } = useVideoConfig();
  const D = Math.max(30, durationInFrames ?? seqDur);
  const t = frame / D;
  const n = Math.max(1, items.length);
  const tag = interpolate(t, [0, 0.07], [0, 1], ease);
  // posición del carrusel (índice fraccionario que queda al frente)
  let pos: number;
  if (active) pos = interpolate(t, [0, 0.35], [Math.max(0, active - 3), active - 1], ease);
  else if (picks.length) pos = 0;
  else pos = interpolate(t, [0.05, 0.85], [0, n - 1], ease);
  const front = picks.length && !active ? null : items[Math.round(pos)];
  const lista = picks.length && !active ? picks.map((p) => ({ it: items[p - 1], n: p })) : items.map((it, i) => ({ it, n: i + 1 }));
  return (
    <AbsoluteFill style={{ background: V.ink0, overflow: "hidden" }}>
      {front?.img ? <Img src={staticFile(front.img)} style={{ position: "absolute", inset: -40, width: 2000, height: 1160, objectFit: "cover", filter: "blur(28px) brightness(.45)" }} /> : null}
      {lista.map(({ it, n: num }, i) => {
        if (!it) return null;
        let d: number;
        if (picks.length && !active) d = (i - (lista.length - 1) / 2) * 1.05;
        else d = i - pos;
        if (Math.abs(d) > 3.2) return null;
        const on = picks.length && !active ? true : Math.abs(d) < 0.5;
        const a = picks.length && !active ? clamp01((t - 0.08 - i * 0.12) / 0.1) : clamp01(1.4 - Math.abs(d) * 0.35);
        return <Tarjeta key={num} it={it} n={num} x={d * 520} z={-Math.abs(d) * 260} rot={-d * 22} on={on} a={a} />;
      })}
      {picks.length && !active ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 56, color: V.white, opacity: clamp01((t - 0.5) * 6), textShadow: "0 6px 26px rgba(0,0,0,.95)" }}>{caption}</div>
      ) : null}
      <Tag kicker={kicker} a={tag} />
      <div style={{ position: "absolute", right: 80, top: 86, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 32, color: rgba(V.white, 0.85), opacity: tag }}>{active ? `${active} / ${n}` : `${n} WAYS`}</div>
    </AbsoluteFill>
  );
};
