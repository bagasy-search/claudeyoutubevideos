// YearCounter.tsx — el AÑO grande que rueda (1935 → 2025) sobre una foto real desenfocada, y al lado la
// POBLACIÓN que rueda con él ("102 → 200,000,000"). Es el plano de "lo que pasó con los años".
//
// ⛔ `unit` SIEMPRE explícito (aunque sea ''): un número sin unidad se lee como cualquier cosa.
// ⛔ La población rueda en escala LOGARÍTMICA (102 → 200 M en lineal se queda en "102" casi todo el
//    tiempo y salta al final). Con `linear: true` se fuerza lineal (para rangos chicos).
// ⛔ Beats en palabras: `from`/`to` = segundos ABSOLUTOS en que arranca y termina de rodar (words.json).
//    `marks` (opcional): años intermedios donde el contador FRENA medio segundo con una nota corta
//    ({year, note, at}) — el "1940: they reach New South Wales".
import React from "react";
import { AbsoluteFill } from "remotion";
import { W, F_NUM, F_TYPE, F_BODY, useAbs, prog, Bed, Grade, Credit, clamp01, easeIO, fmt, rgba, useOut } from "./Stage";

const Odo: React.FC<{ value: number; digits: number; size: number; color: string }> = ({ value, digits, size, color }) => {
  // cada dígito es una cinta 0-9 que se desliza (el de las unidades rueda continuo, los demás saltan con easing)
  const s = String(Math.floor(value)).padStart(digits, "0");
  const frac = value - Math.floor(value);
  return (
    <div style={{ display: "flex", height: size * 1.05, overflow: "hidden" }}>
      {s.split("").map((d, i) => {
        const last = i === s.length - 1;
        const off = +d; void last; void frac;   // ⛔ sin fracción: medio dígito se lee como glitch (stills 13-oct)
        return (
          <div key={i} style={{ width: size * 0.56, height: size * 1.05, overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: -off * size * 1.05 }}>
              {Array.from({ length: 11 }, (_, k) => (
                <div key={k} style={{ height: size * 1.05, lineHeight: `${size * 1.05}px`, fontFamily: F_NUM, fontWeight: 700, fontSize: size, color, textAlign: "center", width: size * 0.56 }}>{k % 10}</div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const YearCounter: React.FC<{
  photo?: string;           // foto real (se desenfoca acá); si falta usa `bed`
  bed?: string;
  yearFrom: number;
  yearTo: number;
  popFrom?: number;
  popTo?: number;
  unit: string;             // "cane toads" · "" — OBLIGATORIO explícito
  label?: string;           // rótulo arriba: "QUEENSLAND · CANE TOADS"
  from?: number;            // seg absoluto en que empieza a rodar
  to?: number;              // seg absoluto en que llega
  marks?: { year: number; note: string }[];
  linear?: boolean;
  credit?: string;
  source?: string;          // "Source: Australian Govt DCCEEW"
  t0?: number;
  durationInFrames?: number;
}> = ({ photo, bed, yearFrom, yearTo, popFrom, popTo, unit, label, from, to, marks = [], linear, credit, source, t0, durationInFrames }) => {
  const now = useAbs(t0);
  const start = t0 ?? 0;
  const a0 = from ?? start + 0.6;
  const a1 = to ?? a0 + 4;
  const out = useOut(durationInFrames);
  const p = easeIO(clamp01((now - a0) / Math.max(0.2, a1 - a0)));
  const year = yearFrom + (yearTo - yearFrom) * p;
  let pop: number | null = null;
  if (popFrom !== undefined && popTo !== undefined) {
    pop = linear || popFrom <= 0 ? popFrom + (popTo - popFrom) * p : Math.exp(Math.log(popFrom) + (Math.log(popTo) - Math.log(popFrom)) * p);
  }
  const enterA = prog(now, start, 0.6);
  const done = prog(now, a1, 0.4);
  const mark = [...marks].reverse().find((m) => year >= m.year - 0.5);
  return (
    <AbsoluteFill>
      <Bed src={photo ?? bed} dim={0.5} blur={photo ? 14 : 0} />
      <Grade vignette={0.6} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enterA * out }}>
        {label ? <div style={{ fontFamily: F_TYPE, fontSize: 34, letterSpacing: 4, color: W.manila, marginBottom: 18, textShadow: "0 2px 10px rgba(0,0,0,.9)" }}>{label}</div> : null}
        <div style={{ display: "flex", alignItems: "center", gap: 80 }}>
          <div style={{ textShadow: "0 8px 40px rgba(0,0,0,.9)", filter: "drop-shadow(0 8px 30px rgba(0,0,0,.8))" }}>
            <Odo value={year} digits={4} size={250} color={W.white} />
          </div>
          {pop !== null ? (
            <div style={{ borderLeft: `6px solid ${W.red}`, paddingLeft: 40 }}>
              <div style={{ fontFamily: F_NUM, fontWeight: 700, fontSize: 132, lineHeight: 1, color: done > 0.5 ? W.redSoft : W.white, textShadow: "0 6px 30px rgba(0,0,0,.95)" }}>{fmt(Math.round(pop))}</div>
              <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 44, color: W.bone, marginTop: 8, textShadow: "0 3px 14px rgba(0,0,0,.95)" }}>{unit}</div>
            </div>
          ) : null}
        </div>
        <div style={{ height: 90, marginTop: 26 }}>
          {mark ? <div key={mark.year} style={{ fontFamily: F_TYPE, fontSize: 40, color: W.ink0, background: W.paper, padding: "8px 22px", boxShadow: "0 10px 26px rgba(0,0,0,.5)" }}>{mark.year} · {mark.note}</div> : null}
        </div>
      </AbsoluteFill>
      {source ? <div style={{ position: "absolute", left: 40, bottom: 30, fontFamily: F_TYPE, fontSize: 22, color: rgba(W.white, 0.85), opacity: out }}>{source}</div> : null}
      <Credit text={credit} a={enterA} />
    </AbsoluteFill>
  );
};
