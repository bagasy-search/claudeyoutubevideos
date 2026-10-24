// t30cajaes/TrapChip.tsx — OVERLAY de capítulo con CONTADOR: la pestaña del kit ("TRAMPA 05" · título)
// + una fila de 17 casilleros que se llenan (las ya vistas en rojo, la actual se enciende al entrar).
// Se exporta como `ActChip` para que el pipeline (cfg.OVERLAY, fondo_bajo_overlay) lo trate igual que el del kit.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { W, F_TYPE, rgba } from "../backfire/Stage";

export const ActChip: React.FC<{ fileNo: string | number; part: string; n?: number; total?: number; durationInFrames?: number }> = ({ fileNo, part, n, total = 17, durationInFrames }) => {
  const f = useCurrentFrame();
  const { durationInFrames: seq } = useVideoConfig();
  const D = durationInFrames ?? seq;
  const a = interpolate(f, [0, 10, D - 12, D], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lit = interpolate(f, [14, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 40, top: 36, opacity: a, transform: `translateY(${((1 - a) * -14).toFixed(1)}px)` }}>
        <div style={{ display: "flex", alignItems: "stretch", boxShadow: "0 8px 22px rgba(0,0,0,.5)" }}>
          <div style={{ background: W.manila, padding: "9px 16px", fontFamily: F_TYPE, fontSize: 26, letterSpacing: 2, color: W.ink0 }}>{String(fileNo)}</div>
          <div style={{ background: rgba(W.ink0, 0.78), padding: "9px 18px", fontFamily: F_TYPE, fontSize: 26, letterSpacing: 2, color: W.white, borderRight: `5px solid ${W.red}` }}>{part}</div>
        </div>
        {n ? (
          <div style={{ display: "flex", gap: 5, marginTop: 9, padding: "6px 8px", background: rgba(W.ink0, 0.62), width: "fit-content", alignItems: "center" }}>
            {Array.from({ length: total }, (_, i) => {
              const k = i + 1;
              const on = k < n ? 1 : k === n ? lit : 0;
              return <div key={k} style={{ width: 17, height: 17, border: `2px solid ${rgba(W.white, 0.7)}`, background: on ? rgba(W.red, on) : "transparent", transform: k === n ? `scale(${1 + 0.25 * Math.sin(Math.PI * lit)})` : undefined }} />;
            })}
            <div style={{ marginLeft: 8, fontFamily: F_TYPE, fontSize: 20, color: W.white, letterSpacing: 1 }}>{n}/{total}</div>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
