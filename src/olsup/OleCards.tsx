// Tarjetas de pantalla completa del kit Ole: OleSupperCard (libreta), OleTrick, OleFact, OleTwoCards, OleArchivePhoto.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, SLAB, HAND, SERIF, woodBg, hexA, rnd, lanternGlow } from "./OleSupTheme";
import { clipR, Bed, CL, Rivet, Tape, easeOut, fadeOut, flicker, pop, sourceLine } from "./OleBits";

const INK = "#1F2E55"; // tinta azul-negra de libreta

const paperTex = (base = OLE.paperLight) => ({
  backgroundColor: base,
  backgroundImage:
    "radial-gradient(ellipse at 18% 12%, rgba(255,255,255,0.55), transparent 55%)," +
    "radial-gradient(ellipse at 88% 92%, rgba(120,80,30,0.18), transparent 50%)," +
    "radial-gradient(circle at 72% 28%, rgba(120,80,30,0.07), transparent 30%)",
});

/* ---------------------------------------------------------------- SUPPER CARD */
export const OleSupperCard: React.FC<{ n: number; title: string; items: string[]; why: string; note?: string; bed?: string }> = ({ n, title, items, why, note, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const inP = interpolate(f, [0, 20], [0, 1], { ...CL, easing: easeOut });
  const out = fadeOut(f, durationInFrames, 8);
  const per = 13, start = 20;
  const line = (t0: number, w = per) => interpolate(f, [t0, t0 + w], [0, 100], { ...CL, easing: Easing.inOut(Easing.quad) });
  const its = items.slice(0, 6);
  const tWhy = start + its.length * per + 4;
  const tNote = tWhy + 24;
  const stamp = interpolate(f, [tWhy + 8, tWhy + 14], [0, 1], { ...CL, easing: Easing.out(Easing.back(3)) });
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 1440, filter: "drop-shadow(0 30px 40px rgba(15,8,3,0.55))", rotate: `${(-1.4) * inP}deg`, translate: `0 ${(1 - inP) * 110}px`, scale: String(0.95 + 0.05 * inP), opacity: inP }}>
        <div style={{ position: "relative", width: 1440, minHeight: 820, borderRadius: "10px 22px 22px 10px", ...paperTex(), overflow: "hidden", clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 110px), calc(100% - 110px) 100%, 0 100%)" }}>
          {/* mancha de grasa */}
          <div style={{ position: "absolute", right: 220, top: 300, width: 260, height: 220, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(160,110,40,0.20), rgba(160,110,40,0.08) 60%, transparent 72%)", opacity: 0.9 }} />
          <div style={{ position: "absolute", left: 560, bottom: 50, width: 150, height: 130, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(140,95,35,0.16), rgba(140,95,35,0.06) 62%, transparent 74%)" }} />
          {/* margen rojo y espiral */}
          <div style={{ position: "absolute", left: 150, top: 0, bottom: 0, width: 3, background: "rgba(190,55,50,0.45)" }} />
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: 26, top: 40 + i * 64, width: 84, height: 24 }}>
              <div style={{ position: "absolute", left: 10, top: 3, width: 26, height: 18, borderRadius: "50%", background: "radial-gradient(circle, #14100c 40%, #3a2a1a)", boxShadow: "inset 0 2px 3px rgba(0,0,0,0.7)" }} />
              <div style={{ position: "absolute", left: 4, top: 6, width: 78, height: 10, borderRadius: 6, background: "linear-gradient(180deg, #bdb7ab, #6c665d 55%, #a49e92)", boxShadow: "0 3px 4px rgba(0,0,0,0.4)" }} />
            </div>
          ))}
          {/* contenido con renglones */}
          <div style={{ position: "relative", padding: "56px 70px 50px 200px", backgroundImage: "linear-gradient(transparent 62px, rgba(70,100,160,0.28) 62px, rgba(70,100,160,0.28) 64px, transparent 64px)", backgroundSize: "100% 64px", backgroundPositionY: 120 }}>
            <div style={{ fontFamily: SLAB, fontSize: 68, color: OLE.ink, lineHeight: "80px", height: 80, marginBottom: 24, whiteSpace: "nowrap", clipPath: clipR(line(8, 14)), paddingRight: 360 }}>{title}</div>
            {its.map((it, i) => (
              <div key={i} style={{ fontFamily: HAND, fontWeight: 600, fontSize: 54, lineHeight: "64px", height: 64, color: INK, clipPath: clipR(line(start + i * per)), whiteSpace: "nowrap" }}>
                <span style={{ color: OLE.plaid, marginRight: 18 }}>&#8211;</span>{it}
              </div>
            ))}
            <div style={{ marginTop: 32, display: "flex", gap: 18, alignItems: "baseline", clipPath: clipR(line(tWhy, 22)), minHeight: 64 }}>
              <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: OLE.plaid, lineHeight: "64px" }}>Why:</span>
              <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: OLE.ink, lineHeight: "64px", textDecoration: "underline", textDecorationColor: hexA(OLE.ember, 0.6), textDecorationThickness: 4, textUnderlineOffset: 8 }}>{why}</span>
            </div>
            {note ? <div style={{ marginTop: 30, fontFamily: HAND, fontWeight: 600, fontSize: 48, lineHeight: "64px", color: OLE.inkSoft, rotate: "-1.5deg", clipPath: clipR(line(tNote, 18)), whiteSpace: "nowrap" }}>&#9998; {note}</div> : null}
          </div>
          {/* sello */}
          <div style={{ position: "absolute", right: 70, top: 50, rotate: "7deg", scale: String(0.4 + 0.6 * stamp), opacity: stamp * 0.95, border: `7px solid ${OLE.plaid}`, borderRadius: 16, padding: "6px 26px 8px", fontFamily: SLAB, fontSize: 54, color: OLE.plaid, letterSpacing: 2, background: "rgba(255,255,255,0.25)", textAlign: "center", lineHeight: 1.1 }}>
            <div style={{ fontSize: 26, letterSpacing: 6 }}>SUPPER</div>#{n}
          </div>
        </div>
        <div style={{ position: "absolute", right: 0, bottom: 0, width: 110, height: 110, background: "linear-gradient(135deg, #f0e4c0 0%, #bfa878 100%)", clipPath: "polygon(0 0, 100% 0, 0 100%)", boxShadow: "none", filter: "drop-shadow(-4px -4px 6px rgba(0,0,0,0.3))" }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- TRICK */
const renderAccent = (text: string, style: React.CSSProperties, f: number) => {
  let parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  if (!parts.some((p) => /^\*[^*]+\*$/.test(p))) {
    const words = text.split(" ");
    let bi = 0; words.forEach((w, i) => { if (w.replace(/\W/g, "").length > words[bi].replace(/\W/g, "").length) bi = i; });
    parts = [words.slice(0, bi).join(" ") + (bi ? " " : ""), `*${words[bi]}*`, (bi < words.length - 1 ? " " : "") + words.slice(bi + 1).join(" ")].filter(Boolean);
  }
  const u = interpolate(f, [26, 44], [0, 100], { ...CL, easing: Easing.inOut(Easing.quad) });
  return parts.map((p, i) => /^\*[^*]+\*$/.test(p)
    ? <span key={i} style={{ position: "relative", color: OLE.plaid, ...style }}>{p.slice(1, -1)}<span style={{ position: "absolute", left: -4, right: -4, bottom: -6, height: 12, borderRadius: 8, background: OLE.lantern, opacity: 0.85, clipPath: clipR(u), zIndex: -1 }} /></span>
    : <span key={i}>{p}</span>);
};

export const OleTrick: React.FC<{ title: string; text: string; bed?: string }> = ({ title, text, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const p = pop(f, fps, 2); const p2 = pop(f, fps, 10, 13);
  const out = fadeOut(f, durationInFrames, 8);
  const sw = Math.sin(f * 0.09) * 0.8 * Math.exp(-f * 0.02);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} />
      <AbsoluteFill style={{ alignItems: "center" }}>
        {/* cartel de madera colgado */}
        <div style={{ position: "absolute", top: 60, translate: `0 ${(1 - p) * -260}px`, rotate: `${sw}deg`, transformOrigin: "50% -60px" }}>
          <div style={{ position: "absolute", left: 90, top: -90, width: 6, height: 100, background: "#7a6a4a", rotate: "-6deg" }} />
          <div style={{ position: "absolute", right: 90, top: -90, width: 6, height: 100, background: "#7a6a4a", rotate: "6deg" }} />
          <div style={{ position: "relative", padding: "22px 74px 26px", borderRadius: 12, ...woodBg(OLE.wood3, 4), boxShadow: `0 20px 40px ${OLE.shadow}, inset 0 0 0 4px rgba(0,0,0,0.5), inset 0 3px 0 rgba(255,225,170,0.3)` }}>
            <Rivet x={22} y="50%" /><Rivet x="calc(100% - 22px)" y="50%" />
            <div style={{ fontFamily: SLAB, fontSize: 90, color: OLE.cream, lineHeight: 1, textShadow: "0 5px 0 rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>{title}</div>
          </div>
        </div>
        {/* tarjeta */}
        <div style={{ position: "absolute", top: 300, width: 1360, minHeight: 470, borderRadius: 12, padding: "70px 90px 70px", ...paperTex(), boxShadow: `0 34px 64px ${OLE.shadow}`, rotate: `${1.2 * p2}deg`, scale: String(0.9 + 0.1 * p2), opacity: Math.min(1, p2 * 1.4), translate: `0 ${(1 - p2) * 90}px` }}>
          <Tape style={{ left: 60, top: -18, rotate: "-8deg" }} />
          <Tape style={{ right: 60, top: -18, rotate: "6deg" }} />
          <div style={{ position: "absolute", left: 90, top: 34, fontFamily: SLAB, fontSize: 32, letterSpacing: 7, color: OLE.ember }}>COOK'S TRICK</div>
          <div style={{ marginTop: 40, fontFamily: SERIF, fontSize: 92, lineHeight: 1.16, color: OLE.ink }}>{renderAccent(text, {}, f)}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- FACT */
export const OleFact: React.FC<{ big: string; unit: string; text?: string; source?: string; bed?: string }> = ({ big, unit, text, source = "", bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const p = pop(f, fps, 4, 12); const out = fadeOut(f, durationInFrames, 8);
  const gl = flicker(f, 3);
  const s2 = interpolate(f, [22, 38], [0, 1], { ...CL, easing: easeOut });
  const bigSize = big.length > 7 ? 240 : big.length > 4 ? 320 : 400;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} />
      <AbsoluteFill style={{ background: lanternGlow, opacity: 0.7 * gl }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", padding: "30px 90px 40px", borderRadius: 24, background: "rgba(22,14,8,0.52)", boxShadow: `0 30px 60px ${OLE.shadow}, inset 0 0 0 3px rgba(255,210,140,0.18)`, textAlign: "center", translate: "0 -30px" }}>
          <div style={{ fontFamily: SLAB, fontSize: bigSize, lineHeight: 1.0, color: OLE.lantern, textShadow: `0 10px 0 rgba(0,0,0,0.5), 0 0 60px ${hexA(OLE.lantern, 0.45)}`, scale: String(0.6 + 0.4 * p), opacity: Math.min(1, p * 1.5) }}>{big}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 110, lineHeight: 1, color: OLE.cream, textShadow: "0 5px 0 rgba(0,0,0,0.5)", opacity: s2, translate: `0 ${(1 - s2) * 30}px` }}>{unit}</div>
          {text ? <div style={{ fontFamily: SERIF, fontSize: 52, color: OLE.lanternSoft, marginTop: 18, opacity: s2, textShadow: "0 3px 0 rgba(0,0,0,0.5)" }}>{text}</div> : null}
        </div>
      </AbsoluteFill>
      {source ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 92, background: "rgba(14,9,5,0.72)", display: "flex", alignItems: "center", justifyContent: "center", opacity: s2 }}>
        <div style={{ fontFamily: SERIF, fontSize: 34, color: OLE.paper, letterSpacing: 1 }}>{sourceLine(source)}</div>
      </div> : null}
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- TWO CARDS */
type Side = { title: string; lines: string[]; mark?: string };
const Mark: React.FC<{ m: string; good: boolean }> = ({ m, good }) => {
  const isYes = /^(✓|✔|yes|ok|check)$/i.test(m), isNo = /^(✗|✘|x|no|cross)$/i.test(m);
  const c = isYes ? "#2E7D3E" : isNo ? OLE.plaid : good ? "#2E7D3E" : OLE.plaid;
  return (
    <div style={{ width: 128, height: 128, borderRadius: "50%", border: `9px solid ${c}`, background: "rgba(255,250,235,0.9)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 14px rgba(0,0,0,0.3)" }}>
      {isYes || isNo ? (
        <svg width={76} height={76} viewBox="0 0 76 76"><path d={isYes ? "M12 40 L31 58 L64 16" : "M16 16 L60 60 M60 16 L16 60"} fill="none" stroke={c} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" /></svg>
      ) : <div style={{ fontFamily: SLAB, fontSize: m.length > 4 ? 32 : 54, color: c, textAlign: "center", lineHeight: 1 }}>{m}</div>}
    </div>
  );
};

export const OleTwoCards: React.FC<{ a: Side; b: Side; bed?: string }> = ({ a, b, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const out = fadeOut(f, durationInFrames, 8);
  const pa = pop(f, fps, 2, 13), pb = pop(f, fps, 12, 13), pv = pop(f, fps, 24, 10);
  const card = (s: Side, p: number, rot: number, x: number, good: boolean, seed: number) => (
    <div style={{ position: "absolute", left: x, top: 200, width: 760, minHeight: 540, padding: "56px 56px 50px", borderRadius: 12, ...paperTex(good ? "#F1EBCB" : "#EBDCC0"), boxShadow: `0 30px 56px ${OLE.shadow}`, rotate: `${rot * p}deg`, translate: `0 ${(1 - p) * 140}px`, opacity: Math.min(1, p * 1.4), scale: String(0.94 + 0.06 * p) }}>
      <Tape style={{ left: 300, top: -20, rotate: `${(rnd(seed) - 0.5) * 10}deg` }} />
      <div style={{ fontFamily: SLAB, fontSize: 76, lineHeight: 1.05, color: OLE.ink, minHeight: 96 }}>{s.title}</div>
      <div style={{ height: 6, width: 160, background: good ? "#2E7D3E" : OLE.plaid, borderRadius: 3, margin: "16px 0 24px" }} />
      {s.lines.slice(0, 4).map((l, i) => <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, lineHeight: 1.12, color: INK, marginBottom: 8 }}>{l}</div>)}
      {s.mark ? <div style={{ position: "absolute", right: 34, bottom: 30, rotate: "-8deg", scale: String(interpolate(f, [30 + (good ? 0 : 8), 38 + (good ? 0 : 8)], [0, 1], { ...CL, easing: Easing.out(Easing.back(3)) })) }}><Mark m={s.mark} good={good} /></div> : null}
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} />
      {card(a, pa, -2, 150, true, 3)}
      {card(b, pb, 2, 1010, false, 9)}
      <div style={{ position: "absolute", left: 960, top: 500, translate: "-50% -50%", scale: String(pv), width: 130, height: 130, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #3f6bb8, ${OLE.enamel})`, border: `8px solid ${OLE.enamelWhite}`, boxShadow: `0 10px 24px ${OLE.shadow}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SLAB, fontSize: 48, color: OLE.cream }}>VS</div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- ARCHIVE PHOTO */
export const OleArchivePhoto: React.FC<{ src: string; caption: string; credit: string; seed?: number }> = ({ src, caption, credit, seed = 1 }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const p = pop(f, fps, 2, 15); const out = fadeOut(f, durationInFrames, 8);
  const rot = (rnd(seed) - 0.5) * 5;
  const dir = rnd(seed + 7) > 0.5 ? 1 : -1;
  const kb = 1.05 + (f / durationInFrames) * 0.08;
  const tx = dir * (f / durationInFrames - 0.5) * 36, ty = (rnd(seed + 3) - 0.5) * 12;
  const PW = 1300, PH = 730;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", padding: "26px 26px 0", background: "#F1EBDB", boxShadow: `0 36px 70px ${OLE.shadow}, 0 3px 8px rgba(0,0,0,0.35)`, rotate: `${rot * p}deg`, translate: `0 ${(1 - p) * 120}px`, scale: String(0.94 + 0.06 * p), opacity: Math.min(1, p * 1.5) }}>
          <Tape style={{ left: -40, top: -14, rotate: "-38deg" }} />
          <Tape style={{ right: -40, top: -14, rotate: "38deg" }} />
          <div style={{ position: "relative", width: PW, height: PH, overflow: "hidden", background: "#111" }}>
            <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(28px)", scale: "1.2", opacity: 0.8 }} />
            <div style={{ position: "absolute", inset: 0, translate: `${tx}px ${ty}px`, scale: String(kb) }}>
              <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <svg width={PW} height={PH} style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", opacity: 0.16 }}>
              <filter id={`gr${seed}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed + Math.floor(f / 3)} /><feColorMatrix type="saturate" values="0" /></filter>
              <rect width={PW} height={PH} filter={`url(#gr${seed})`} />
            </svg>
          </div>
          <div style={{ padding: "18px 10px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: SERIF, fontSize: 46, lineHeight: 1.1, color: OLE.ink, opacity: interpolate(f, [12, 26], [0, 1], CL) }}>{caption}</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 38, color: OLE.inkSoft, marginTop: 4, opacity: interpolate(f, [20, 34], [0, 1], CL) }}>{credit}</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
