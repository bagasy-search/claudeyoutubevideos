// PullQuote.tsx — una CITA real con quién la dijo, el año y la fuente. Si existe un retrato real de esa
// persona (dominio público / CC con crédito) va a la izquierda como foto de archivo.
//
// ⛔ La cita es TEXTUAL de la fuente (está en fuentes.md con la URL). Nada de citas inventadas.
// ⛔ Beats en palabras: las palabras de la cita aparecen al ritmo en que Walt la lee: `at` = primera
//    palabra, `until` = última (se reparte lineal). Sin `until` aparece entera en 0,6 s.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { W, F_TYPE, F_BODY, F_NUM, useAbs, prog, Bed, Grade, Credit, rgba, useOut, clamp01 } from "./Stage";

export const PullQuote: React.FC<{
  quote: string;
  who: string;               // "Walter Froggatt, entomologist"
  year?: string | number;
  source?: string;           // "Letter to the Queensland Govt, 1935 · via NLA"
  portrait?: string;         // retrato real (opcional)
  at?: number;
  until?: number;
  highlight?: string;        // palabra(s) de la cita que se pintan en rojo
  credit?: string;
  bed?: string;
  t0?: number;
  durationInFrames?: number;
}> = ({ quote, who, year, source, portrait, at, until, highlight, credit, bed, t0, durationInFrames }) => {
  const now = useAbs(t0);
  const start = t0 ?? 0;
  const out = useOut(durationInFrames);
  const a0 = at ?? start + 0.3;
  const words = quote.split(/\s+/);
  const hl = new Set((highlight || "").toLowerCase().split(/\s+/).filter(Boolean));
  const shown = until ? clamp01((now - a0) / Math.max(0.3, until - a0)) * words.length : prog(now, a0, 0.6) * words.length;
  const enterA = prog(now, start, 0.5);
  const drift = 1 + 0.004 * Math.max(0, now - start);
  return (
    <AbsoluteFill>
      <Bed src={bed} dim={0.7} />
      <Grade vignette={0.55} />
      <AbsoluteFill style={{ transform: `scale(${drift.toFixed(4)})`, opacity: out }}>
        {portrait ? (
          <div style={{ position: "absolute", left: 130, top: 190, width: 470, opacity: enterA, transform: `rotate(-2deg) translateY(${((1 - enterA) * 30).toFixed(1)}px)`, background: W.paper, padding: 14, paddingBottom: 18, boxShadow: "0 24px 60px rgba(0,0,0,.7)" }}>
            <Img src={staticFile(portrait)} style={{ width: 442, height: 560, objectFit: "cover", filter: "grayscale(0.35) sepia(0.15)" }} />
          </div>
        ) : null}
        <div style={{ position: "absolute", left: portrait ? 700 : 220, right: 170, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontFamily: F_NUM, fontWeight: 700, fontSize: 200, lineHeight: 0.6, color: W.red, opacity: enterA, height: 90 }}>“</div>
          <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: words.length > 26 ? 50 : 60, lineHeight: 1.22, color: W.white, textShadow: "0 4px 22px rgba(0,0,0,.95)" }}>
            {words.map((w, i) => {
              const a = clamp01(shown - i);
              const red = hl.has(w.toLowerCase().replace(/[^a-z0-9']/g, ""));
              return <span key={i} style={{ opacity: 0.12 + 0.88 * a, color: red ? W.redSoft : W.white }}>{w} </span>;
            })}
          </div>
          <div style={{ marginTop: 34, opacity: prog(now, a0 + 0.4, 0.5), display: "flex", alignItems: "baseline", gap: 18 }}>
            <div style={{ width: 60, height: 4, background: W.manila, transform: "translateY(-10px)" }} />
            <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 40, color: W.manila }}>{who}</div>
            {year !== undefined ? <div style={{ fontFamily: F_TYPE, fontSize: 36, color: W.bone }}>· {year}</div> : null}
          </div>
          {source ? <div style={{ marginTop: 12, marginLeft: 78, fontFamily: F_TYPE, fontSize: 24, color: rgba(W.white, 0.7), opacity: prog(now, a0 + 0.6, 0.5) }}>{source}</div> : null}
        </div>
      </AbsoluteFill>
      <Credit text={credit} a={enterA} />
    </AbsoluteFill>
  );
};
