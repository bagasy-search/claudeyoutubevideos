// FriendStrip.tsx — la pieza recurrente de t30invien: la tira de fotos de los cinco amigos de Lou (1950).
// Cada cara se pone GRIS en el segundo en que Lou cuenta que ese amigo se fue (`goneAt`, segundo absoluto).
// Las que ya se fueron antes de este tramo llegan grises (goneAt < t0). Fotos reales de cama, cámara lenta.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { W, F_TYPE, F_HAND, useAbs, prog, Bed, Grade, Credit, useOut, lerp, easeIO, clamp01 } from "../backfire/Stage";

type Face = { img: string; name: string; goneAt?: number; inAt?: number; x?: number; y?: number; z?: number };

export const FriendStrip: React.FC<{
  faces: Face[];
  bed?: string;
  label?: string;          // arriba, máquina de escribir
  focus?: number;          // índice al que se acerca la cámara (el amigo de este tramo)
  focusAt?: number;
  note?: string;           // nota a mano 3-5 palabras
  noteAt?: number;
  credit?: string;
  t0?: number;
  durationInFrames?: number;
}> = ({ faces, bed, label, focus, focusAt, note, noteAt, credit, t0, durationInFrames }) => {
  const now = useAbs(t0);
  const start = t0 ?? 0;
  const out = useOut(durationInFrames);
  const n = faces.length;
  const TW = 300, TH = 400, GAP = 34;
  const totalW = n * TW + (n - 1) * GAP;
  const x0 = (1920 - totalW) / 2;
  // cámara: deriva lenta y, si hay foco, empuje hacia esa cara
  const fp = focus === undefined ? 0 : easeIO(prog(now, focusAt ?? start + 0.8, 1.6));
  const fx = focus === undefined ? 960 : x0 + focus * (TW + GAP) + TW / 2;
  const s = 1.0 + 0.02 * clamp01((now - start) / 8) + 0.32 * fp;
  const cx = lerp(960, fx, fp), cy = lerp(560, 600, fp);
  const tx = 960 - cx * s, ty = 540 - cy * s;
  const lab = prog(now, start, 0.5);
  return (
    <AbsoluteFill>
      <Bed src={bed} dim={0.62} />
      <Grade vignette={0.55} />
      <AbsoluteFill style={{ opacity: out }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${s.toFixed(4)})` }}>
          <div style={{ position: "absolute", left: x0 - 30, top: 330, width: totalW + 60, height: TH + 150, background: W.paper, transform: "rotate(-1.2deg)", boxShadow: "0 24px 60px rgba(0,0,0,.6)" }} />
          {faces.map((f, i) => {
            const inA = prog(now, f.inAt ?? start + 0.15 * i, 0.45);
            const g = f.goneAt === undefined ? 0 : f.goneAt <= start ? 1 : prog(now, f.goneAt, 1.4);
            const left = x0 + i * (TW + GAP);
            return (
              <div key={i} style={{ position: "absolute", left, top: 360 + (1 - inA) * 30, width: TW, opacity: inA, transform: `rotate(${(-1.2 + (i % 2 ? 0.8 : -0.5)).toFixed(2)}deg)` }}>
                <div style={{ width: TW, height: TH, overflow: "hidden", background: W.ink0, boxShadow: "0 4px 12px rgba(0,0,0,.35)" }}>
                  <Img src={staticFile(f.img)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${f.x ?? 50}% ${f.y ?? 30}%`, transform: `scale(${(f.z ?? 1.25).toFixed(3)})`, transformOrigin: `${f.x ?? 50}% ${f.y ?? 30}%`, filter: `grayscale(${g.toFixed(3)}) brightness(${(1 - 0.38 * g).toFixed(3)}) sepia(${(0.25 * (1 - g)).toFixed(3)})` }} />
                </div>
                <div style={{ marginTop: 14, textAlign: "center", fontFamily: F_HAND, fontWeight: 700, fontSize: 46, lineHeight: 1, color: g > 0.5 ? "#6E6A62" : "#1D1B16" }}>{f.name}</div>
              </div>
            );
          })}
        </div>
        {label ? <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", opacity: lab * (1 - fp), fontFamily: F_TYPE, fontSize: 38, letterSpacing: 5, color: W.manila, textShadow: "0 2px 10px rgba(0,0,0,.95)" }}>{label}</div> : null}
        {note ? (() => { const a = prog(now, noteAt ?? start + 1.5, 0.45); return a > 0 ? (
          <div style={{ position: "absolute", left: 960, top: 930, opacity: a, transform: `translate(-50%,-50%) rotate(-2deg) scale(${(0.92 + 0.08 * a).toFixed(3)})`, background: W.paper, padding: "10px 26px 12px", boxShadow: "0 10px 28px rgba(0,0,0,.55)", whiteSpace: "nowrap" }}>
            <div style={{ fontFamily: F_HAND, fontWeight: 700, fontSize: 54, lineHeight: 1, color: "#1D1B16" }}>{note}</div>
          </div>) : null; })() : null}
      </AbsoluteFill>
      <Credit text={credit} a={prog(now, start, 0.4) * out} />
    </AbsoluteFill>
  );
};
