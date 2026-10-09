// Overlays TRANSPARENTES del kit Ole (van sobre la toma): OleNameTag, OleNote, OleArrow, OleComments, OleAsk, OleSubscribe, OleWipe.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, SLAB, HAND, SERIF, woodBg, hexA, rnd } from "./OleSupTheme";
import { clipR, CL, EnamelPlate, Rivet, Tape, Steam, easeIO, easeOut, fadeOut, pop } from "./OleBits";

export const OleNameTag: React.FC<{ name: string; sub?: string; side?: "left" | "right" }> = ({ name, sub, side = "left" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const p = pop(f, fps, 4); const out = fadeOut(f, durationInFrames, 10);
  const w = interpolate(f, [14, 32], [0, 100], { ...CL, easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", [side]: 70, bottom: 80, opacity: out, translate: `${(side === "left" ? -1 : 1) * (1 - p) * 500}px 0` }}>
        <div style={{ position: "relative", padding: "18px 36px 18px 38px", borderRadius: 12, maxWidth: 640, boxSizing: "border-box", ...woodBg(OLE.wood2, 7), boxShadow: `0 16px 34px ${OLE.shadow}, inset 0 0 0 3px rgba(0,0,0,0.5), inset 0 3px 0 rgba(255,220,160,0.2)` }}>
          <Rivet x={14} y={14} /><Rivet x={14} y="calc(100% - 14px)" />
          <div style={{ paddingLeft: 12 }}>
            <div style={{ fontFamily: SLAB, fontSize: name.length > 20 ? 46 : 60, lineHeight: 1.05, color: OLE.cream, textShadow: "0 4px 0 rgba(0,0,0,0.5)" }}>{name}</div>
            {sub ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, lineHeight: 1.05, color: OLE.lanternSoft, clipPath: clipR(w) }}>{sub}</div> : null}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const px = (v: number, max: number) => (v <= 1 ? v * max : v);

export const OleNote: React.FC<{ text: string; x?: number; y?: number; rot?: number }> = ({ text, x = 0.82, y = 0.3, rot = -4 }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const p = pop(f, fps, 6); const w = interpolate(f, [14, 40], [0, 100], { ...CL, easing: Easing.inOut(Easing.quad) });
  const out = fadeOut(f, durationInFrames, 10);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <div style={{ position: "absolute", left: px(x, 1920), top: px(y, 1080), translate: "-50% -50%", rotate: `${rot}deg`, scale: String(0.6 + 0.4 * p), opacity: Math.min(1, p * 1.4) }}>
        <div style={{ position: "relative", padding: "30px 46px 28px", background: `linear-gradient(180deg, ${OLE.paperLight}, ${OLE.paper})`, boxShadow: `0 18px 34px ${OLE.shadow}`, borderRadius: 4 }}>
          <Tape style={{ left: "38%", top: -22, width: 130, height: 40, rotate: "-3deg" }} />
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 68, lineHeight: 1.05, color: "#1F2E55", whiteSpace: "nowrap", clipPath: clipR(w) }}>{text}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// La punta de la flecha esta en (x,y); el texto queda a la derecha ("r") o izquierda ("l") y ARRIBA de la punta.
export const OleArrow: React.FC<{ text: string; x?: number; y?: number; dir?: "l" | "r" }> = ({ text, x = 0.8, y = 0.78, dir = "l" }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const out = fadeOut(f, durationInFrames, 10);
  const d = interpolate(f, [6, 26], [0, 1], { ...CL, easing: easeIO });
  const ring = interpolate(f, [22, 38], [0, 1], { ...CL, easing: easeIO });
  const t = interpolate(f, [16, 40], [0, 100], CL);
  const cx = px(x, 1920), cy = px(y, 1080); const sg = dir === "r" ? 1 : -1;
  const sx = cx + sg * 300, sy = cy - 230;
  const path = `M ${sx} ${sy} C ${sx - sg * 10} ${sy + 110}, ${cx + sg * 60} ${cy - 150}, ${cx + sg * 20} ${cy - 62}`;
  const head = `M ${cx + sg * 20 - sg * 4} ${cy - 62} l ${-sg * 6} -52 M ${cx + sg * 20} ${cy - 62} l ${sg * 46} -30`;
  const sty: React.CSSProperties = { filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.6))" };
  const ringLen = 2 * Math.PI * 62 * 1.15;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <ellipse cx={cx} cy={cy} rx={70} ry={54} fill="none" stroke={OLE.lantern} strokeWidth={9} strokeLinecap="round" strokeDasharray={ringLen} strokeDashoffset={ringLen * (1 - ring)} transform={`rotate(-10 ${cx} ${cy})`} style={sty} />
        <path d={path} fill="none" stroke={OLE.lantern} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} style={sty} />
        <path d={head} fill="none" stroke={OLE.lantern} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" opacity={d > 0.92 ? 1 : 0} style={sty} />
      </svg>
      <div style={{ position: "absolute", left: sx, top: sy, translate: sg > 0 ? "-10% -100%" : "-90% -100%", fontFamily: HAND, fontWeight: 700, fontSize: 84, lineHeight: 1, color: OLE.cream, textShadow: `0 4px 0 rgba(0,0,0,0.75), 0 0 20px rgba(0,0,0,0.6)`, clipPath: clipR(t), whiteSpace: "nowrap", rotate: `${-3 * sg}deg` }}>{text}</div>
    </AbsoluteFill>
  );
};

const AV = ["#A5322B", "#2B4C8C", "#2F4A36", "#8A5B33", "#6d4a7a"];
export const OleComments: React.FC<{ items: { at: number; text: string }[] }> = ({ items }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const out = fadeOut(f, durationInFrames, 10);
  const SLOT = 168;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      {items.map((it, i) => {
        const p0 = pop(f, fps, it.at * fps, 15); if (f < it.at * fps) return null;
        // cuanto la empujaron los comentarios posteriores hacia arriba
        let push = 0; for (let j = i + 1; j < items.length; j++) push += pop(f, fps, items[j].at * fps, 15);
        const fade = interpolate(push, [1.6, 2.6], [1, 0], CL);
        if (fade <= 0) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 70, top: 820 - push * SLOT, width: 900, opacity: Math.min(1, p0 * 1.5) * fade, translate: `0 ${(1 - p0) * 90}px`, scale: String(0.9 + 0.1 * p0), transformOrigin: "0 100%" }}>
            <div style={{ display: "flex", gap: 22, alignItems: "center", background: OLE.paperLight, borderRadius: 26, padding: "18px 34px 18px 20px", boxShadow: `0 16px 34px ${OLE.shadow}` }}>
              <div style={{ width: 84, height: 84, borderRadius: "50%", background: AV[i % AV.length], border: `5px solid ${OLE.enamelWhite}`, boxShadow: "0 3px 6px rgba(0,0,0,0.4)", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SLAB, fontSize: 40, color: OLE.cream }}>{String.fromCharCode(65 + Math.floor(rnd(i + 11) * 26))}</div>
              <div style={{ fontFamily: SERIF, fontSize: 42, lineHeight: 1.12, color: OLE.ink }}>{it.text}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const OleAsk: React.FC<{ text: string; sub?: string }> = ({ text, sub = "tell me in the comments" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const p = pop(f, fps, 6); const out = fadeOut(f, durationInFrames, 10);
  const bob = Math.sin(f * 0.16) * 8;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <div style={{ position: "absolute", right: 70, top: 70, width: 820, opacity: Math.min(1, p * 1.3), scale: String(0.8 + 0.2 * p), rotate: "1.8deg", transformOrigin: "100% 0" }}>
        <EnamelPlate w="100%" h="auto" radius={22} seed={4} style={{ padding: "26px 36px 24px" }}>
          <div style={{ position: "relative", fontFamily: SLAB, fontSize: 62, lineHeight: 1.08, color: OLE.cream, textShadow: "0 4px 0 rgba(0,0,0,0.45)" }}>{text}</div>
          <div style={{ position: "relative", fontFamily: HAND, fontWeight: 700, fontSize: 52, color: OLE.lanternSoft, marginTop: 8, display: "flex", alignItems: "center", gap: 14 }}>
            {sub}
            <svg width={44} height={52} viewBox="0 0 44 52" style={{ translate: `0 ${bob}px` }}><path d="M22 4 L22 40 M6 26 L22 44 L38 26" fill="none" stroke={OLE.lanternSoft} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </EnamelPlate>
      </div>
    </AbsoluteFill>
  );
};

export const OleSubscribe: React.FC<{ text?: string; sub?: string }> = ({ text = "Subscribe", sub }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const p = pop(f, fps, 4); const out = fadeOut(f, durationInFrames, 10);
  const press = interpolate(f, [34, 39, 46], [1, 0.9, 1], CL);
  const done = f > 39;
  const bell = f > 46 ? 18 * Math.sin((f - 46) * 0.9) * Math.exp(-(f - 46) * 0.09) : 0;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <div style={{ position: "absolute", left: 70, bottom: 80, translate: `0 ${(1 - p) * 120}px`, opacity: Math.min(1, p * 1.5) }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 28, padding: "22px 36px 22px 28px", borderRadius: 14, ...woodBg(OLE.wood2, 8), boxShadow: `0 18px 36px ${OLE.shadow}, inset 0 0 0 3px rgba(0,0,0,0.5)` }}>
          <div style={{ scale: String(press), background: done ? "#4b4540" : OLE.plaid, color: OLE.cream, fontFamily: SLAB, fontSize: 52, padding: "12px 38px", borderRadius: 12, boxShadow: "0 5px 0 rgba(0,0,0,0.45)", display: "flex", alignItems: "center", gap: 14 }}>
            {done ? <svg width={44} height={44} viewBox="0 0 44 44"><path d="M6 24 L18 36 L39 9" fill="none" stroke={OLE.cream} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
            {done ? "Subscribed" : text}
          </div>
          <svg width={64} height={70} viewBox="-32 -34 64 70" style={{ rotate: `${bell}deg`, transformOrigin: "50% 0" }}><path d="M-22 16 C-22 -8 -14 -22 0 -24 C14 -22 22 -8 22 16 Z" fill={OLE.lantern} stroke="#4a3410" strokeWidth={3} /><rect x={-26} y={14} width={52} height={7} rx={3.5} fill="#B0781E" /><circle cx={0} cy={29} r={6} fill="#3a2a12" /></svg>
          {sub ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: OLE.cream, maxWidth: 620, lineHeight: 1.05, textShadow: "0 3px 0 rgba(0,0,0,0.5)" }}>{sub}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Transicion ~14 frames: un tablon de madera con vapor barre la pantalla (cubre del todo hacia la mitad). */
export const OleWipe: React.FC<{ dir?: "l" | "r" }> = ({ dir = "r" }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const u = interpolate(f, [0, Math.max(2, durationInFrames - 1)], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const W = 3400;
  const x = -W + u * (W + 1920);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden", transform: dir === "l" ? "scaleX(-1)" : undefined }}>
      <div style={{ position: "absolute", left: x, top: 0, width: W, height: 1080, ...woodBg(OLE.wood2, 3), boxShadow: "-30px 0 60px rgba(0,0,0,0.55), 0 0 0 4px rgba(0,0,0,0.5)" }}>
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 26, background: `linear-gradient(90deg, transparent, ${hexA(OLE.lanternSoft, 0.55)})` }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 260, background: "linear-gradient(90deg, rgba(255,255,255,0.0), rgba(255,255,255,0.0))" }} />
      </div>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{ position: "absolute", left: x + W - 120 + i * 40 - 200, top: 80 + i * 200, width: 380, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,0.55), transparent 68%)", filter: "blur(22px)", opacity: 0.85 }} />
      ))}
    </AbsoluteFill>
  );
};
