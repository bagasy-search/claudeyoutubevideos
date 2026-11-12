// St3.tsx — piezas de stan12h: todo escrito a mano SOBRE fotos reales (puro CSS/DOM, sin SVG, sin filtros pesados)
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, Easing } from "remotion";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";
import { F, K } from "./St";

const { fontFamily: HAND } = loadHand("normal", { weights: ["700"], subsets: ["latin"] });
const { MARK, COND } = F;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eio = (t: number) => Easing.inOut(Easing.cubic)(cl(t));
const eout = (t: number) => Easing.out(Easing.cubic)(cl(t));

// ---------- HOJA: renglones que se escriben sobre el papel de la foto (lápiz graso / birome / marcador)
export type Seg = { t: string; f: number; big?: boolean; strike?: number; ring?: number; red?: boolean; dim?: boolean };
export type Row = { segs: Seg[]; size?: number; indent?: number; gap?: number };
const SKIN: Record<string, { font: string; ink: string; k: number; ls: number }> = {
  pencil: { font: MARK, ink: "#26221E", k: 1, ls: 0 },
  marker: { font: MARK, ink: "#1B1612", k: 1, ls: 0 },
  pen: { font: HAND, ink: "#0F1E6E", k: 1.28, ls: 0.5 },
  lead: { font: HAND, ink: "#33302C", k: 1.28, ls: 0.5 },
};
export const Hoja: React.FC<{ src: string; skin: string; box: [number, number, number]; rows: Row[]; size?: number; pitch?: number; focus?: number; rot?: number; zoom?: [number, number]; dur: number }> = ({ src, skin, box, rows, size = 62, pitch, focus, rot = -1.2, zoom = [1.03, 1.1], dur }) => {
  const f = useCurrentFrame(); const S = SKIN[skin] || SKIN.pencil; const P = pitch ?? Math.round(size * 1.42);
  let y = 0; const ys = rows.map((r) => { const v = y; y += (r.size ? Math.round(r.size * 1.42) : P) + (r.gap || 0); return v; });
  const fi = focus ?? rows.length - 1; const fy = box[1] + (ys[Math.max(0, Math.min(rows.length - 1, fi))] || 0) + P / 2;
  const z = lerp(zoom[0], zoom[1], eio(f / Math.max(1, dur)));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${box[0] + box[2] * 0.42}px ${fy}px` }}>
        <Img src={staticFile(src)} style={{ width: 1920, height: 1080, objectFit: "fill" }} />
        <div style={{ position: "absolute", left: box[0], top: box[1], width: box[2], transform: `rotate(${rot}deg)`, transformOrigin: "0 0", mixBlendMode: "multiply", opacity: 0.97 }}>
          {rows.map((r, i) => {
            const sz = (r.size || size) * S.k;
            return (
              <div key={i} style={{ position: "absolute", left: (r.indent || 0) + ((i * 37) % 11) - 5, top: ys[i], display: "flex", alignItems: "baseline", gap: sz * 0.36, whiteSpace: "nowrap", transform: `rotate(${((i * 53) % 9 - 4) * 0.12}deg)`, transformOrigin: "0 50%" }}>
                {r.segs.map((s, j) => {
                  const n = Math.max(6, Math.min(26, Math.round(s.t.length * 1.1))); const w = s.f < 0 ? 1 : eout((f - s.f) / n);
                  if (w <= 0) return <span key={j} style={{ fontFamily: S.font, fontSize: sz * (s.big ? 1.55 : 1), visibility: "hidden" }}>{s.t}</span>;
                  const st = s.strike === undefined ? 0 : s.strike < 0 ? 1 : eout((f - s.strike) / 9);
                  const rg = s.ring === undefined ? 0 : s.ring < 0 ? 1 : eout((f - s.ring) / 10);
                  return (
                    <span key={j} style={{ position: "relative", fontFamily: S.font, fontSize: sz * (s.big ? 1.55 : 1), lineHeight: 1, letterSpacing: S.ls, color: s.red ? "#A3201A" : S.ink, opacity: s.dim ? 0.62 : 1, clipPath: `inset(-40% ${(1 - w) * 104 - 4}% -40% -4%)` }}>
                      {s.t}
                      {st > 0 && <span style={{ position: "absolute", left: "-3%", top: "52%", width: `${st * 106}%`, height: Math.max(5, sz * 0.09), background: "#A3201A", borderRadius: 4, transform: "rotate(-2.5deg)", transformOrigin: "0 50%" }} />}
                      {rg > 0 && <span style={{ position: "absolute", left: "-9%", right: "-9%", top: "-16%", bottom: "-20%", border: `${Math.max(5, sz * 0.08)}px solid #A3201A`, borderRadius: "50%", transform: `rotate(-3deg) scale(${lerp(1.25, 1, rg)})`, opacity: cl(rg * 2) }} />}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- MEDIA RES: la foto se apaga y queda encendida la zona del corte que nombra (máscara radial sobre la misma foto)
export type Reg = { x: number; y: number; rx: number; ry: number; t: string; lx: number; ly: number };
export const BeefMap: React.FC<{ src: string; regs: Reg[]; now: number; sweep?: boolean; dur: number }> = ({ src, regs, now, sweep, dur }) => {
  const f = useCurrentFrame(); const N = regs.length;
  const pos = sweep ? cl((f - 14) / Math.max(1, dur - 24)) * (N - 0.01) : now - 1; const i = Math.floor(cl(pos, 0, N - 1));
  const z = sweep ? lerp(1.02, 1.07, eio(f / Math.max(1, dur))) : lerp(1.06, 1.2, eout(f / Math.max(1, dur))); const dark = sweep ? cl(f / 12) : 1;
  const r = regs[i]; const mask = `radial-gradient(ellipse ${r.rx}px ${r.ry}px at ${r.x}px ${r.y}px, #000 28%, transparent 100%)`;
  const pop = sweep ? cl((pos - i) * 6) : cl((f + 3) / 5);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${r.x}px ${r.y}px` }}>
        <Img src={staticFile(src)} style={{ position: "absolute", width: 1920, height: 1080, objectFit: "fill", filter: `brightness(${lerp(1, 0.36, dark)}) saturate(${lerp(1, 0.4, dark)})` }} />
        <Img src={staticFile(src)} style={{ position: "absolute", width: 1920, height: 1080, objectFit: "fill", WebkitMaskImage: mask, maskImage: mask, opacity: dark, filter: `brightness(${1.06 + 0.05 * Math.sin(f / 7)})` }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 90, bottom: 64, opacity: pop * dark, transform: `rotate(-2deg) scale(${lerp(1.14, 1, pop)})`, transformOrigin: "0 100%", whiteSpace: "nowrap" }}>
        <div style={{ fontFamily: COND, fontWeight: 600, fontSize: 58, letterSpacing: 6, color: "#F3E7CC", textShadow: "0 2px 12px rgba(0,0,0,0.95)" }}>{i + 1} OF {N} · FRONT TO BACK</div>
        <div style={{ fontFamily: MARK, fontSize: 150, lineHeight: 1, color: "#FFFDF6", textShadow: "0 4px 24px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.9)" }}>{r.t}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- DOS FOTOS: la segunda entra corriendo a la primera cuando la nombra; rótulo escrito en cinta de papel
const Tape: React.FC<{ t: string; show: number }> = ({ t, show }) => (
  <div style={{ position: "absolute", left: 60, bottom: 70, padding: "12px 34px 16px", background: "#F4EDDC", boxShadow: "0 10px 26px rgba(0,0,0,0.5)", transform: `rotate(-2.5deg) translateY(${(1 - show) * 60}px)`, opacity: cl(show * 2), fontFamily: MARK, fontSize: 88, color: K.ink, whiteSpace: "nowrap" }}>{t}</div>
);
export const Duo: React.FC<{ a: { src: string; t: string }; b: { src: string; t: string; f: number }; dur: number }> = ({ a, b, dur }) => {
  const f = useCurrentFrame(); const p = eio((f - b.f) / 16); const z = lerp(1.04, 1.1, f / Math.max(1, dur));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: lerp(1920, 954, p), height: 1080, overflow: "hidden" }}>
        <Img src={staticFile(a.src)} style={{ position: "absolute", left: lerp(0, -483, p), width: 1920, height: 1080, objectFit: "cover", transform: `scale(${z})` }} />
        <Tape t={a.t} show={eout((f - 8) / 10)} />
      </div>
      {p > 0 && (
        <div style={{ position: "absolute", left: lerp(1920, 966, p), top: 0, width: 954, height: 1080, overflow: "hidden" }}>
          <Img src={staticFile(b.src)} style={{ position: "absolute", left: -483, width: 1920, height: 1080, objectFit: "cover", filter: "brightness(1.22)", transform: `scale(${lerp(1.12, 1.04, cl((f - b.f) / Math.max(1, dur - b.f)))})` }} />
          <Tape t={b.t} show={eout((f - b.f - 12) / 10)} />
        </div>
      )}
    </AbsoluteFill>
  );
};
