// FailedFixes — anotador amarillo (legal pad) sobre el escritorio. El título y cada intento se escriben a mano
// letra por letra; los que fallaron se tachan con birome y reciben una ✗ roja; el último que funcionó, ✓ + círculo.
import React, { useMemo } from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { HAND, HK, clamp, ease, easeInOut, rnd, lerp } from "../theme";

export type FailedFixesProps = {
  title: string;
  items: { text: string; ok: boolean }[];
};

const PW = 1180, PH = 1560;
const RULE0 = 250, RULE = 74, MARGIN = 170;
const INK = "#1d2a5c"; // birome azul
const RED = "#c81d2a";

const makeWood = (): string => {
  if (typeof document === "undefined") return "";
  const W = 1400, H = 900;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d");
  if (!g) return "";
  const bg = g.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#33211a"); bg.addColorStop(1, "#1d120c");
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  let s = 5;
  const r = () => rnd(s++ * 0.877);
  for (let i = 0; i < 520; i++) {
    const y0 = r() * H, amp = 2 + r() * 10, fr = 0.002 + r() * 0.006, ph = r() * 6.28;
    g.strokeStyle = r() < 0.5 ? `rgba(130,86,50,${0.05 + r() * 0.12})` : `rgba(8,4,2,${0.1 + r() * 0.25})`;
    g.lineWidth = 0.6 + r() * 2.4;
    g.beginPath();
    for (let x = -10; x <= W + 10; x += 14) {
      const y = y0 + amp * Math.sin(x * fr + ph) + 3 * Math.sin(x * 0.03 + ph * 2);
      if (x < 0) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.stroke();
  }
  return c.toDataURL("image/jpeg", 0.88);
};

const makePad = (): string => {
  if (typeof document === "undefined") return "";
  const W = 590, H = 780;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d");
  if (!g) return "";
  g.fillStyle = "#f8e98c"; g.fillRect(0, 0, W, H);
  let s = 17;
  const r = () => rnd(s++ * 0.559);
  for (let i = 0; i < 16000; i++) {
    g.fillStyle = r() < 0.5 ? `rgba(150,120,30,${r() * 0.07})` : `rgba(255,255,220,${r() * 0.22})`;
    g.fillRect(r() * W, r() * H, 0.6 + r() * 1.5, 0.5 + r() * 0.8);
  }
  return c.toDataURL("image/jpeg", 0.9);
};

// trazo a mano: línea ondulada en caja w x h
const wobbleLine = (w: number, y: number, seed: number, amp = 5) => {
  const n = 7;
  let d = `M ${-6} ${y + (rnd(seed) - 0.5) * amp}`;
  for (let i = 1; i <= n; i++) {
    const x = (i / n) * (w + 12) - 6;
    const cxp = x - (w / n) * 0.5;
    d += ` Q ${cxp} ${y + (rnd(seed + i * 1.7) - 0.5) * amp * 2} ${x} ${y + (rnd(seed + i * 3.1) - 0.5) * amp}`;
  }
  return d;
};

const Grain: React.FC<{ f: number; o?: number }> = ({ f, o = 0.22 }) => (
  <Img src={staticFile(`yc/grain/g${f % 8}.png`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "overlay", opacity: o, pointerEvents: "none" }} />
);

// texto escrito letra por letra (p 0..1)
const Written: React.FC<{ text: string; p: number; style?: React.CSSProperties }> = ({ text, p, style }) => {
  const chars = Array.from(text);
  const shown = p * chars.length;
  return (
    <span style={{ whiteSpace: "pre", ...style }}>
      {chars.map((ch, i) => {
        const o = clamp(shown - i);
        return <span key={i} style={{ opacity: o, display: "inline-block", transform: `translateY(${(1 - o) * 3}px)`, minWidth: ch === " " ? "0.22em" : undefined }}>{ch}</span>;
      })}
    </span>
  );
};

const splitParen = (t: string) => {
  const m = t.match(/^(.*?)(\s*\(.*\))\s*$/);
  return m ? [m[1], m[2]] : [t, ""];
};

export const FailedFixes: React.FC<FailedFixesProps> = ({ title = "", items = [] }) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const wood = useMemo(makeWood, []);
  const pad = useMemo(makePad, []);
  const n = Math.max(1, items.length);

  // ---- agenda: título y luego los items repartidos parejo ----
  const inP = ease(f / Math.max(8, D * 0.1));
  const titleA = D * 0.03, titleB = D * 0.15;
  const winA = D * 0.17, winB = D * 0.93;
  const slot = (winB - winA) / n;
  const exitP = clamp((f - (D - 11)) / 11);
  const itemRow = (i: number) => 3 + i * 2; // renglón (rule index) de cada item
  const rowY = (k: number) => RULE0 + k * RULE;

  // ---- cámara: sigue al renglón activo ----
  const act = clamp((f - winA) / (winB - winA)) * n;
  const lastY = rowY(itemRow(n - 1));
  const focusY = lerp(rowY(1.5), lerp(rowY(itemRow(0)), lastY, clamp((act - 0.5) / Math.max(1, n - 1))), easeInOut((f - titleB + 10) / 40));
  const contentH = lastY - RULE0 + 260;
  const sc = clamp((1080 * 0.86) / contentH, 0.7, 1.25) * lerp(1.22, 1.1, easeInOut(f / D)) * (1 - exitP * 0.05);
  const midY = (RULE0 - 170 + lastY + 60) / 2;
  let cx = PW * 0.5 + 10 * Math.sin(f / 33) + 4 * Math.sin(f / 12.1 + 1);
  let cy = lerp(midY, focusY, 0.45) + 8 * Math.sin(f / 27 + 2) + 3 * Math.sin(f / 10.3);
  const rx = 16 + 1.5 * Math.sin(f / 47);
  const rz = -2.5 + 0.5 * Math.sin(f / 39);
  const ry = 2 * Math.sin(f / 57);

  const underlineP = ease((f - titleB + 4) / 10);

  return (
    <AbsoluteFill style={{ background: "#080504", overflow: "hidden", opacity: 1 - exitP }}>
      <AbsoluteFill style={{ perspective: 2000, perspectiveOrigin: "50% 40%" }}>
        <div style={{ position: "absolute", left: 960, top: 540, width: 0, height: 0, transformStyle: "preserve-3d", transform: `scale(${sc}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) translate(${-cx}px, ${-cy}px)` }}>
          {/* escritorio */}
          <div style={{ position: "absolute", left: -1800, top: -1300, width: PW + 3600, height: PH + 2600, backgroundImage: wood ? `url(${wood})` : undefined, backgroundColor: "#22150d", backgroundSize: "1400px 900px" }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(1500px 1200px at ${1800 + cx - 200}px ${1300 + cy - 300}px, rgba(255,205,140,0.2), rgba(0,0,0,0) 55%), radial-gradient(3000px 2400px at ${1800 + cx}px ${1300 + cy}px, rgba(0,0,0,0) 25%, rgba(0,0,0,0.78) 70%)` }} />
          </div>
          {/* lápiz sobre el escritorio (profundidad) */}
          <div style={{ position: "absolute", left: PW + 90, top: 380, transform: "translateZ(14px) rotate(74deg)", transformOrigin: "0 0" }}>
            <div style={{ position: "absolute", left: 10, top: 24, width: 760, height: 34, background: "rgba(0,0,0,0.5)", filter: "blur(9px)", borderRadius: 16 }} />
            <div style={{ position: "relative", width: 760, height: 36, display: "flex" }}>
              <div style={{ width: 60, height: 36, background: "linear-gradient(180deg,#f4b6ae,#d98a80 60%,#b56a61)", borderRadius: "10px 0 0 10px" }} />
              <div style={{ width: 34, height: 36, background: "linear-gradient(180deg,#e8e8e8,#9a9a9a 55%,#c9c9c9)" }} />
              <div style={{ width: 560, height: 36, background: "linear-gradient(180deg,#ffd760 0%,#f2b614 32%,#e0a10b 34%,#f4bd22 36%,#c98d08 70%,#a87406 100%)" }} />
              <div style={{ width: 106, height: 36, background: "linear-gradient(180deg,#f0d6b0,#caa57a)", clipPath: "polygon(0 0, 100% 44%, 100% 56%, 0 100%)" }} />
            </div>
          </div>
          {/* hojas de abajo del block */}
          {[3, 2, 1].map((k) => (
            <div key={k} style={{ position: "absolute", left: k * 1.5, top: 70 + k * 5, width: PW, height: PH - 70, transform: `translateZ(${1 + (3 - k) * 0.3}px)`, background: k === 3 ? "#cdb95a" : "#e9d773", boxShadow: k === 3 ? "0 40px 80px rgba(0,0,0,0.65), 0 8px 20px rgba(0,0,0,0.5)" : undefined }} />
          ))}
          {/* hoja */}
          <div style={{ position: "absolute", left: 0, top: 0, width: PW, height: PH, transform: `translateZ(${3 + (1 - inP) * 220}px) translateY(${(1 - inP) * 180}px)`, opacity: clamp(inP * 2) }}>
            <div style={{ position: "absolute", inset: 0, top: 60, backgroundImage: pad ? `url(${pad})` : undefined, backgroundColor: "#f8e98c", backgroundSize: `${PW}px ${PH}px`, overflow: "hidden" }}>
              {Array.from({ length: Math.floor((PH - RULE0) / RULE) + 1 }).map((_, i) => (
                <div key={i} style={{ position: "absolute", left: 0, right: 0, top: RULE0 - 60 + i * RULE, height: 2, background: "rgba(70,120,180,0.42)" }} />
              ))}
              <div style={{ position: "absolute", top: 0, bottom: 0, left: MARGIN - 60 + 60, width: 2, background: "rgba(214,60,70,0.6)" }} />
              <div style={{ position: "absolute", top: 0, bottom: 0, left: MARGIN + 6, width: 2, background: "rgba(214,60,70,0.6)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0) 75%, rgba(80,60,0,0.14) 100%)" }} />
            </div>
            {/* goma del block */}
            <div style={{ position: "absolute", left: -4, right: -4, top: 0, height: 72, background: "linear-gradient(180deg,#7a2a22 0%,#5c1c16 55%,#3f120e 100%)", borderRadius: "6px 6px 2px 2px", boxShadow: "0 6px 10px rgba(0,0,0,0.35)" }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 10, height: 6, background: "rgba(255,255,255,0.14)" }} />
            </div>

            {/* título */}
            <div style={{ position: "absolute", left: MARGIN - 30, right: 50, top: RULE0 - 150, height: 150, display: "flex", alignItems: "flex-end", paddingBottom: 12, fontFamily: HAND, fontWeight: 700, fontSize: Math.min(86, 960 / (Math.max(1, title.length) * 0.43)), color: INK, lineHeight: 0.95 }}>
              <span style={{ position: "relative" }}>
                <Written text={title} p={clamp((f - titleA) / (titleB - titleA))} />
                {underlineP > 0 && <svg width="100%" height={30} viewBox="0 0 1000 30" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: -18, overflow: "visible" }}>
                  <path d="M 0 16 C 250 8, 520 22, 1000 10" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${underlineP} 1`} vectorEffect="non-scaling-stroke" />
                  <path d="M 30 26 C 300 18, 600 30, 880 20" stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${clamp(underlineP * 1.4 - 0.4)} 1`} vectorEffect="non-scaling-stroke" />
                </svg>}
              </span>
            </div>

            {/* items */}
            {items.map((it, i) => {
              const a = winA + i * slot;
              const writeP = clamp((f - a) / (slot * 0.42));
              const markA = a + slot * 0.5;
              const strikeP = ease((f - markA) / (slot * 0.14));
              const xA = markA + slot * 0.12;
              const x1 = ease((f - xA) / (slot * 0.08)), x2 = ease((f - xA - slot * 0.08) / (slot * 0.08));
              const circP = ease((f - markA - slot * 0.1) / (slot * 0.2));
              const [main, paren] = splitParen(it.text);
              const y = rowY(itemRow(i));
              const fs = 74;
              const pop = it.ok ? 1 + 0.06 * Math.sin(Math.PI * clamp((f - markA) / 10)) : 1;
              return (
                <div key={i} style={{ position: "absolute", left: MARGIN - 110, top: y - fs * 1.02, height: fs * 1.1, display: "flex", alignItems: "flex-end", fontFamily: HAND, color: INK, whiteSpace: "nowrap" }}>
                  <div style={{ width: 90, textAlign: "right", paddingRight: 30, fontSize: fs * 0.9, fontWeight: 700, opacity: clamp(writeP * 8) }}>{i + 1}.</div>
                  <span style={{ position: "relative", display: "inline-block", transform: `scale(${pop})`, transformOrigin: "0 80%" }}>
                    <Written text={main} p={clamp(writeP * (main.length + paren.length) / Math.max(1, main.length))} style={{ fontSize: fs, fontWeight: 600 }} />
                    {paren && <Written text={paren} p={clamp((writeP * (main.length + paren.length) - main.length) / paren.length)} style={{ fontSize: fs * 0.7, fontWeight: 600, color: "#3d4666" }} />}
                    {!it.ok && strikeP > 0 && (
                      <svg width="100%" height={40} viewBox="0 0 1000 40" preserveAspectRatio="none" style={{ position: "absolute", left: 0, top: "24%", overflow: "visible" }}>
                        <path d={wobbleLine(1000, 20, i * 7 + 2, 10)} stroke={INK} strokeWidth={5.5} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${strikeP} 1`} vectorEffect="non-scaling-stroke" />
                        <path d={wobbleLine(1000, 26, i * 11 + 5, 12)} stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${clamp(strikeP * 1.3 - 0.3)} 1`} vectorEffect="non-scaling-stroke" opacity={0.85} />
                      </svg>
                    )}
                    {it.ok && circP > 0 && (
                      <svg width="100%" height="100%" viewBox="0 0 1000 100" preserveAspectRatio="none" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                        <path d="M 520 -18 C 1000 -30, 1080 60, 980 110 C 800 150, 120 150, 10 100 C -60 60, 40 -10, 380 -22 C 470 -26, 560 -20, 600 -6" stroke={RED} strokeWidth={5} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${circP} 1`} vectorEffect="non-scaling-stroke" />
                      </svg>
                    )}
                  </span>
                  {/* marca */}
                  <svg width={110} height={100} viewBox="0 0 110 100" style={{ marginLeft: 34, marginBottom: 4, overflow: "visible" }}>
                    {!it.ok ? (
                      x1 <= 0 ? null : <>
                        <path d="M 22 18 C 45 40, 62 62, 88 86" stroke={RED} strokeWidth={9} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${x1} 1`} />
                        {x2 > 0 && <path d="M 86 14 C 64 38, 44 62, 20 88" stroke={RED} strokeWidth={9} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${x2} 1`} />}
                      </>
                    ) : f < markA ? null : (
                      <>
                        <path d="M 14 52 C 26 60, 34 72, 42 84 C 58 50, 80 20, 104 2" stroke={RED} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${ease((f - markA) / (slot * 0.1))} 1`} />
                      </>
                    )}
                  </svg>
                </div>
              );
            })}
            {/* luz rasante sobre la hoja */}
            <div style={{ position: "absolute", inset: 0, top: 60, background: `radial-gradient(900px 700px at ${cx - 100}px ${cy - 250}px, rgba(255,250,220,0.16), rgba(0,0,0,0) 60%)`, pointerEvents: "none" }} />
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(115% 90% at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.66) 100%)", pointerEvents: "none" }} />
      <Grain f={f} />
    </AbsoluteFill>
  );
};
