// BigStat.tsx — UN número que pega, rodando, sobre una foto real; con su comparación en palabras simples
// ("That's more toads than people in Brazil") y su fuente.
//
// ⛔ `unit` SIEMPRE explícito (aunque sea ''): BigStat sin unidad = número huérfano.
// ⛔ `compare` sólo si la cuenta es CORRECTA (se verifica en fuentes.md).
// ⛔ Beats en palabras: `at` = cuando Walt DICE el número (rueda 1,1 s y frena ahí); `compareAt` = la comparación.
import React from "react";
import { AbsoluteFill } from "remotion";
import { W, F_NUM, F_BODY, F_TYPE, useAbs, prog, Bed, Grade, Credit, fmt, rgba, useOut, easeOut } from "./Stage";

export const BigStat: React.FC<{
  value: number;
  unit: string;              // OBLIGATORIO explícito ('' si no hay)
  prefix?: string;           // "$" · "~"
  decimals?: number;
  label?: string;            // arriba, máquina de escribir: "BEAVERS IN TIERRA DEL FUEGO TODAY"
  compare?: string;          // "More toads than people in Brazil."
  source?: string;           // "Source: CONICET, 2021"
  photo?: string;            // foto real nítida de fondo (oscurecida); si falta, `bed`
  bed?: string;
  tone?: "red" | "white" | "green";
  at?: number;
  compareAt?: number;
  credit?: string;
  t0?: number;
  durationInFrames?: number;
}> = ({ value, unit, prefix = "", decimals = 0, label, compare, source, photo, bed, tone = "red", at, compareAt, credit, t0, durationInFrames }) => {
  const now = useAbs(t0);
  const start = t0 ?? 0;
  const out = useOut(durationInFrames);
  const a = at ?? start + 0.3;
  const p = prog(now, a - 0.6, 1.1, easeOut);
  const v = value * p;
  const col = tone === "red" ? W.redSoft : tone === "green" ? W.green : W.white;
  const cA = prog(now, compareAt ?? a + 1.4, 0.45);
  return (
    <AbsoluteFill>
      <Bed src={photo ?? bed} dim={photo ? 0.58 : 0.5} />
      <Grade vignette={0.6} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: out }}>
        {label ? <div style={{ fontFamily: F_TYPE, fontSize: 36, letterSpacing: 4, color: W.manila, opacity: prog(now, start, 0.4), textShadow: "0 2px 10px rgba(0,0,0,.95)", marginBottom: 6, textAlign: "center", maxWidth: 1500 }}>{label}</div> : null}
        <div style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
          <div style={{ fontFamily: F_NUM, fontWeight: 700, fontSize: 250, lineHeight: 1, color: col, textShadow: `0 0 60px ${rgba(col, 0.25)}, 0 10px 40px rgba(0,0,0,.95)` }}>{prefix}{fmt(v, decimals)}</div>
          {unit ? <div style={{ fontFamily: F_NUM, fontWeight: 500, fontSize: 84, color: W.white, textShadow: "0 6px 26px rgba(0,0,0,.95)" }}>{unit}</div> : null}
        </div>
        {compare ? (
          <div style={{ marginTop: 26, opacity: cA, transform: `translateY(${((1 - cA) * 16).toFixed(1)}px)`, background: W.paper, padding: "12px 30px", boxShadow: "0 12px 30px rgba(0,0,0,.55)", maxWidth: 1500 }}>
            <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 48, color: W.ink0, textAlign: "center" }}>{compare}</div>
          </div>
        ) : null}
      </AbsoluteFill>
      {source ? <div style={{ position: "absolute", left: 40, bottom: 30, fontFamily: F_TYPE, fontSize: 24, color: rgba(W.white, 0.88), background: rgba(W.ink0, 0.55), padding: "5px 12px", opacity: out }}>{source}</div> : null}
      <Credit text={credit} a={prog(now, start, 0.4)} />
    </AbsoluteFill>
  );
};
