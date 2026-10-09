// Piezas de la red Loretta 4-6 (todas por props, nada por default que el farm no tenga en la lista de assets):
//   LorSafeTemps (temperaturas internas seguras) · LorVerse (versículo King James) · LorQR (tapa del libro + QR al link del canal)
//   Overlays: LorCareful (línea verde BE CAREFUL con el límite del libro) · LorNeverMix (recuadro NEVER MIX)
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { LOR, SERIF, HAND, hexA } from "./LorTheme";
import { Bed } from "./LorRecipeCard";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const fadeOut = (f: number, d: number) => interpolate(f, [d - 9, d], [1, 0], cl);

export const LorSafeTemps: React.FC<{ bed?: string; title?: string; rows?: [string, string][] }> = ({ bed, title = "Safe inside temperatures", rows }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const R = rows || [["Chicken & turkey", "165°F"], ["Ground beef, meatloaf", "160°F"], ["Pork chops & roast", "145°F + rest 3 min"], ["Fish", "145°F"], ["Leftovers, reheated", "165°F"]];
  return (
    <AbsoluteFill>
      <Bed src={bed} dim={0.25} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 1280, padding: "50px 70px", background: LOR.white, borderRadius: 18, boxShadow: `0 30px 70px ${LOR.shadow}`, rotate: "-1deg", translate: `0 ${(1 - interpolate(f, [0, 14], [0, 1], { ...cl, easing: ease })) * 70}px` }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: LOR.ink }}>🌡 {title}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: LOR.greenDeep, marginBottom: 18 }}>use a meat thermometer, honey — it's the only way to know</div>
          {R.map(([a, b], i) => {
            const s = spring({ frame: f - 10 - i * 7, fps, config: { damping: 15, stiffness: 140 } });
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `3px dashed ${hexA(LOR.inkSoft, 0.3)}`, padding: "14px 4px", opacity: Math.min(1, s * 1.5), translate: `${(1 - s) * 60}px 0` }}>
                <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 50, color: LOR.ink }}>{a}</span>
                <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: LOR.gingham }}>{b}</span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const LorVerse: React.FC<{ text: string; vref: string; bed?: string }> = ({ text, vref, bed }) => {
  const f = useCurrentFrame();
  const w = interpolate(f, [10, 10 + Math.max(40, text.length * 0.9)], [0, 1], cl);
  const words = text.split(" "); const n = Math.ceil(words.length * w);
  const big = text.length < 120 ? 66 : text.length < 220 ? 54 : 44;
  return (
    <AbsoluteFill>
      <Bed src={bed} dim={0.35} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 1420, padding: "64px 90px", background: "rgba(255,253,247,0.95)", borderRadius: 12, boxShadow: `0 30px 70px ${LOR.shadow}`, borderTop: `10px solid ${LOR.lilac}`, opacity: interpolate(f, [0, 12], [0, 1], cl) }}>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: big, color: LOR.ink, lineHeight: 1.32 }}>
            “{words.map((wd, i) => <span key={i} style={{ opacity: i < n ? 1 : 0.08 }}>{wd} </span>)}”
          </div>
          <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 40, color: LOR.greenDeep, marginTop: 28, letterSpacing: 2, textAlign: "right", opacity: interpolate(f, [30, 44], [0, 1], cl) }}>— {vref} · KJV</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const LorQR: React.FC<{ qr: string; cover: string; site: string; book: string }> = ({ qr, cover, site, book }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ frame: f - 4, fps, config: { damping: 14, stiffness: 110 } });
  const pulse = 1 + 0.025 * Math.sin(f / 9);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${LOR.paper}, ${LOR.paper2})` }}>
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 110 }}>
        <Img src={staticFile(cover)} style={{ height: 820, borderRadius: 8, boxShadow: `0 34px 70px ${LOR.shadow}`, rotate: "-3deg", translate: `${(1 - s) * -400}px 0`, opacity: Math.min(1, s * 1.4) }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: LOR.greenDeep, marginBottom: 16 }}>point your phone camera at the square</div>
          <div style={{ background: "#fff", padding: 26, borderRadius: 16, boxShadow: `0 24px 50px ${LOR.shadow}`, scale: String(pulse * Math.min(1, 0.4 + s)) }}>
            <Img src={staticFile(qr)} style={{ width: 560, height: 560, imageRendering: "pixelated" }} />
          </div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: LOR.ink, marginTop: 26 }}>{book}</div>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 40, color: LOR.inkSoft, marginTop: 6 }}>{site} · link in the description</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const LorCareful: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const inn = interpolate(f, [4, 16], [0, 1], { ...cl, easing: ease });
  const fs = text.length > 110 ? 34 : 40;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", justifyContent: "flex-end", alignItems: "center" }}>
      <div style={{ marginBottom: 128, maxWidth: 1600, display: "flex", alignItems: "center", gap: 22, background: "rgba(44,92,46,0.93)", padding: "16px 34px", borderRadius: 12, boxShadow: `0 12px 30px ${LOR.shadow}`, opacity: inn * fadeOut(f, durationInFrames), translate: `0 ${(1 - inn) * 40}px` }}>
        <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 38, color: "#fff", background: "#7DBE5C", padding: "4px 14px", borderRadius: 8, whiteSpace: "nowrap" }}>BE CAREFUL</span>
        <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: fs, color: "#fff", lineHeight: 1.2 }}>{text}</span>
      </div>
    </AbsoluteFill>
  );
};

export const LorNeverMix: React.FC<{}> = () => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const inn = interpolate(f, [2, 14], [0, 1], { ...cl, easing: ease });
  const rows = ["Bleach + vinegar or acid", "Bleach + ammonia", "Bleach + rubbing alcohol", "Peroxide + vinegar in one bottle", "Two drain cleaners"];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 46, top: 46, width: 430, background: "rgba(255,253,247,0.96)", border: `5px solid ${LOR.gingham}`, borderRadius: 12, padding: "16px 22px", boxShadow: `0 14px 30px ${LOR.shadow}`, opacity: inn * fadeOut(f, durationInFrames), translate: `${(1 - inn) * 120}px 0` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 34, color: LOR.gingham, letterSpacing: 1 }}>⚠ NEVER MIX</div>
        {rows.map((r, i) => <div key={i} style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 25, color: LOR.ink, borderTop: i ? `2px dotted ${hexA(LOR.inkSoft, 0.3)}` : "none", padding: "5px 0" }}>✕ {r}</div>)}
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 28, color: LOR.greenDeep, marginTop: 4 }}>one product at a time · open a window</div>
      </div>
    </AbsoluteFill>
  );
};
