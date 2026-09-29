// SplitFlapBoard — tablero Solari de aeropuerto/estación. Carcasa negra con tornillos, cada carácter es una
// paleta de dos medias cartas que giran sobre X alrededor de una bisagra (3-12 giros por carácter, escalonados).
// Filas entran de arriba hacia abajo; la última columna gira última. highlightRow se enciende con lámpara naranja.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, MONO, HK, clamp, ease, easeInOut, rnd, lerp } from "../theme";

export type SplitFlapBoardProps = {
  title: string;
  rows: { cells: string[] }[];
  headers: string[];
  highlightRow?: number;
};

const CHARSET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$,.-·%/:+";
const L = CHARSET.length;
const CW = 50; // ancho de paleta
const CH = 86; // alto de paleta
const GX = 5; // separación entre paletas
const FLIP = 3; // cuadros por giro

const Grain: React.FC<{ o?: number }> = ({ o = 0.22 }) => {
  const f = useCurrentFrame();
  return (
    <Img src={staticFile(`yc/grain/g${f % 8}.png`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "overlay", opacity: o, pointerEvents: "none" }} />
  );
};

const glyph = (ch: string) => {
  const c = (ch || " ").toUpperCase();
  return CHARSET.includes(c) ? c : c;
};

// Media carta (arriba o abajo) con el carácter recortado.
const Half: React.FC<{ ch: string; top: boolean; shade?: number; hl?: number; style?: React.CSSProperties }> = ({ ch, top, shade = 0, hl = 0, style }) => (
  <div style={{
    position: "absolute", left: 0, top: top ? 0 : CH / 2, width: CW, height: CH / 2, overflow: "hidden",
    borderRadius: top ? "5px 5px 1px 1px" : "1px 1px 5px 5px",
    background: top ? "linear-gradient(180deg,#303033 0%,#232326 70%,#1c1c1f 100%)" : "linear-gradient(180deg,#19191b 0%,#212124 40%,#262629 100%)",
    boxShadow: top ? "inset 0 1px 0 rgba(255,255,255,0.10)" : "inset 0 -1px 0 rgba(255,255,255,0.05)",
    backfaceVisibility: "hidden",
    ...style,
  }}>
    <div style={{
      position: "absolute", left: 0, top: top ? 0 : -CH / 2, width: CW, height: CH,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: SANS, fontWeight: 500, fontSize: 64, lineHeight: 1, letterSpacing: 0,
      color: hl > 0 ? `rgb(${lerp(241, 255, hl)},${lerp(235, 196, hl)},${lerp(221, 120, hl)})` : HK.bone,
      textShadow: "0 1px 0 rgba(0,0,0,0.6)",
      paddingTop: 2,
    }}>{ch === " " ? "" : ch}</div>
    {/* brillo de laca */}
    {top && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0) 55%)" }} />}
    {shade > 0 && <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${shade})` }} />}
  </div>
);

const Cell: React.FC<{ seq: string[]; start: number; t: number; hl: number }> = ({ seq, start, t, hl }) => {
  const n = seq.length - 1;
  const lt = t - start;
  let cur = seq[0];
  let nxt = seq[0];
  let p = -1;
  if (lt >= 0) {
    const k = Math.floor(lt / FLIP);
    if (k >= n) { cur = seq[n]; nxt = seq[n]; }
    else { cur = seq[k]; nxt = seq[k + 1]; p = (lt - k * FLIP) / FLIP; }
  }
  const flipping = p >= 0;
  return (
    <div style={{ position: "relative", width: CW, height: CH, perspective: 260 }}>
      {/* ranura */}
      <div style={{ position: "absolute", inset: -3, borderRadius: 7, background: "#040405", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.05)" }} />
      {/* estáticas */}
      <Half ch={flipping ? nxt : cur} top hl={hl} />
      <Half ch={cur} top={false} hl={hl} shade={flipping && p < 0.5 ? 0.35 * (1 - p * 2) + 0.1 : flipping ? 0.25 * (1 - (p - 0.5) * 2) : 0} />
      {/* paleta que cae */}
      {flipping && p < 0.5 && (
        <Half ch={cur} top hl={hl} shade={p * 0.9} style={{ transformOrigin: "50% 100%", transform: `rotateX(${-180 * p}deg)`, zIndex: 3 }} />
      )}
      {flipping && p >= 0.5 && (
        <Half ch={nxt} top={false} hl={hl} shade={(1 - p) * 0.9} style={{ transformOrigin: "50% 0%", transform: `rotateX(${180 * (1 - p)}deg)`, zIndex: 3 }} />
      )}
      {/* bisagra */}
      <div style={{ position: "absolute", left: 0, top: CH / 2 - 1.5, width: CW, height: 3, background: "linear-gradient(180deg,#000,#111 60%,#2a2a2a)", zIndex: 4 }} />
      <div style={{ position: "absolute", left: -4, top: CH / 2 - 4, width: 7, height: 8, borderRadius: 2, background: "linear-gradient(180deg,#6d6a63,#2b2a27)", zIndex: 5 }} />
      <div style={{ position: "absolute", right: -4, top: CH / 2 - 4, width: 7, height: 8, borderRadius: 2, background: "linear-gradient(180deg,#6d6a63,#2b2a27)", zIndex: 5 }} />
    </div>
  );
};

const Bolt: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div style={{ position: "absolute", left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: 9,
    background: "radial-gradient(circle at 35% 30%, #8a877f, #3a3935 55%, #151514)", boxShadow: "0 1px 2px rgba(0,0,0,0.8), inset 0 -1px 1px rgba(0,0,0,0.6)" }}>
    <div style={{ position: "absolute", left: 3, top: 8, width: 12, height: 2, background: "rgba(0,0,0,0.55)", transform: `rotate(${(x * 7 + y * 3) % 180}deg)` }} />
  </div>
);

export const SplitFlapBoard: React.FC<SplitFlapBoardProps> = ({ title, rows, headers, highlightRow }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  // comprimir el horario si la duración es corta
  const k = clamp((D - 45) / 150, 0.55, 1);
  const t = frame / k;

  const nCols = Math.max(headers.length, ...rows.map((r) => r.cells.length));
  const widths = Array.from({ length: nCols }, (_, c) =>
    Math.max((headers[c] || "").length, ...rows.map((r) => (r.cells[c] || "").length)) + (c === 0 ? 0 : 1));
  const totalChars = widths.reduce((a, b) => a + b, 0) + (nCols - 1);
  const rowW = totalChars * (CW + GX) - GX;
  const scale = Math.min(1, 1480 / rowW);

  // armar secuencias por carácter
  const ROW_GAP = 22;
  const rowStart = (r: number) => 14 + r * 17;
  let lastSettle = 0;
  const rowData = rows.map((row, r) => {
    const chars: { seq: string[]; start: number; col: number }[] = [];
    let x = 0;
    for (let c = 0; c < nCols; c++) {
      const w = widths[c];
      const raw = (row.cells[c] || "").toUpperCase();
      const s = c === 0 ? raw.padEnd(w, " ") : raw.padStart(w, " ");
      for (let j = 0; j < w; j++) {
        const target = glyph(s[j]);
        const seed = r * 131 + x * 17 + 3;
        let seq: string[] = [" "];
        if (target !== " ") {
          const n = 3 + Math.floor(rnd(seed) * 10); // 3..12 giros
          let ti = CHARSET.indexOf(target);
          if (ti < 0) ti = 1;
          for (let q = n - 1; q >= 1; q--) seq.push(CHARSET[(((ti - q) % L) + L) % L]);
          seq.push(target);
        }
        const isLast = c === nCols - 1;
        const start = rowStart(r) + x * 0.85 + rnd(seed + 9) * 5 + (isLast ? 16 : 0);
        lastSettle = Math.max(lastSettle, start + (seq.length - 1) * FLIP);
        chars.push({ seq, start, col: c });
        x++;
      }
      x++; // hueco entre columnas
    }
    return chars;
  });

  // columnas con posiciones x
  const colX: number[] = [];
  { let x = 0; for (let c = 0; c < nCols; c++) { colX.push(x); x += widths[c] + 1; } }

  const hlOn = highlightRow != null ? ease((t - lastSettle - 4) / 10) : 0;
  const hlPulse = hlOn * (0.8 + 0.2 * Math.sin((t - lastSettle) * 0.25));

  // entrada/salida/cámara
  const enter = ease(frame / 20);
  const tOut = clamp((frame - (D - 12)) / 12);
  const out = 1 - easeInOut(tOut);
  const drift = frame / Math.max(1, D);
  const rotY = lerp(-9, -3, easeInOut(drift)) + (1 - enter) * -8;
  const rotX = lerp(5, 2.5, drift) + (1 - enter) * 10;
  const camS = lerp(0.95, 1.03, easeInOut(drift)) * (1 - tOut * 0.04);

  const boardW = rowW * scale + 120;
  const cellsH = rows.length * (CH + ROW_GAP) - ROW_GAP;
  const boardH = (cellsH + 70) * scale + 170;

  return (
    <AbsoluteFill style={{ background: "#050606", overflow: "hidden" }}>
      {/* sala: luz cenital con caída */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 18%, #2c3330 0%, #141816 45%, #070808 80%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 70%, rgba(0,0,0,0.6) 100%)" }} />
      <AbsoluteFill style={{ perspective: 2400, opacity: out * clamp(frame / 8), alignItems: "center", justifyContent: "center" }}>
        <div style={{
          position: "relative", width: boardW, height: boardH,
          transform: `translateY(${(1 - enter) * 60}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${camS})`,
          transformStyle: "preserve-3d",
        }}>
          {/* sombra proyectada */}
          <div style={{ position: "absolute", left: 40, right: 40, bottom: -70, height: 90, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,0.75), rgba(0,0,0,0))" }} />
          {/* carcasa */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: 16,
            background: "linear-gradient(180deg,#1b1c1d 0%,#0f1010 40%,#0a0a0a 100%)",
            boxShadow: "0 40px 90px rgba(0,0,0,0.85), 0 0 0 2px #050505, inset 0 2px 0 rgba(255,255,255,0.08), inset 0 -3px 0 rgba(0,0,0,0.8)",
          }} />
          {/* marco interior */}
          <div style={{ position: "absolute", left: 22, right: 22, top: 108, bottom: 22, borderRadius: 10, background: "#070707", boxShadow: "inset 0 4px 12px rgba(0,0,0,0.95), 0 1px 0 rgba(255,255,255,0.06)" }} />
          <Bolt x={22} y={22} /><Bolt x={boardW - 22} y={22} /><Bolt x={22} y={boardH - 22} /><Bolt x={boardW - 22} y={boardH - 22} />
          {/* placa del título */}
          <div style={{ position: "absolute", left: 60, right: 60, top: 26, height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 36, letterSpacing: 7, color: HK.bone, opacity: ease((frame - 4) / 14), textShadow: "0 0 18px rgba(241,235,221,0.15)" }}>{title}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: HK.orange, boxShadow: `0 0 ${10 + 8 * Math.sin(frame * 0.3)}px ${HK.orange}`, opacity: 0.6 + 0.4 * (Math.sin(frame * 0.3) > 0 ? 1 : 0.4) }} />
              <div style={{ fontFamily: MONO, fontSize: 20, color: "#8d8a80", letterSpacing: 3 }}>SOURCE · LDWF</div>
            </div>
          </div>
          <div style={{ position: "absolute", left: 60, right: 60, top: 92, height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.12), rgba(255,255,255,0))" }} />
          {/* celdas */}
          <div style={{ position: "absolute", left: 60, top: 128, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
            {/* encabezados */}
            {headers.map((h, c) => (
              <div key={c} style={{
                position: "absolute", top: -2, left: colX[c] * (CW + GX), width: widths[c] * (CW + GX) - GX,
                textAlign: c === 0 ? "left" : "right", fontFamily: SANS, fontSize: 22, letterSpacing: 6, color: "#9a968b",
                opacity: ease((frame - 8) / 12),
              }}>{h}</div>
            ))}
            <div style={{ position: "absolute", top: 44 }}>
              {rowData.map((chars, r) => {
                const hl = r === highlightRow ? hlPulse : 0;
                return (
                  <div key={r} style={{ position: "absolute", top: r * (CH + ROW_GAP), left: 0, height: CH, width: rowW }}>
                    {r === highlightRow && hlOn > 0 && (
                      <div style={{ position: "absolute", left: -14, top: -9, width: rowW + 28, height: CH + 18, borderRadius: 10,
                        border: `2px solid rgba(255,122,26,${0.8 * hlOn})`, boxShadow: `0 0 ${30 * hlPulse}px rgba(255,122,26,${0.45 * hlOn}), inset 0 0 ${24 * hlPulse}px rgba(255,122,26,${0.25 * hlOn})` }} />
                    )}
                    {chars.map((ch, i) => {
                      const xi = i + ch.col; // +1 hueco por columna previa
                      return (
                        <div key={i} style={{ position: "absolute", left: xi * (CW + GX), top: 0 }}>
                          <Cell seq={ch.seq} start={ch.start} t={t} hl={hl} />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          {/* lámpara del renglón destacado */}
          {highlightRow != null && (
            <div style={{ position: "absolute", left: 30, top: 128 + (44 + highlightRow * (CH + ROW_GAP) + CH / 2) * scale - 8, width: 16, height: 16, borderRadius: 8,
              background: hlOn > 0 ? `radial-gradient(circle at 40% 35%, #fff2d8, ${HK.orange} 50%, #7a2d00)` : "radial-gradient(circle at 40% 35%, #5a4a3a, #2a1a10)",
              boxShadow: hlOn > 0 ? `0 0 ${18 * hlPulse}px ${HK.orange}, 0 0 ${40 * hlPulse}px rgba(255,122,26,0.5)` : "none" }} />
          )}
          {/* brillo del vidrio/laca, se mueve con la cámara */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 16, pointerEvents: "none",
            background: `linear-gradient(${115 + drift * 10}deg, rgba(255,255,255,0) ${28 + drift * 12}%, rgba(255,255,255,0.055) ${36 + drift * 12}%, rgba(255,255,255,0) ${46 + drift * 12}%)` }} />
        </div>
      </AbsoluteFill>
      {/* viñeta + grano */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.65) 100%)", pointerEvents: "none" }} />
      <Grain o={0.2} />
    </AbsoluteFill>
  );
};
