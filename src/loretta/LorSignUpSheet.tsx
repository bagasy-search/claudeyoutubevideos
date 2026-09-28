// LorSignUpSheet — la planilla de anotarse del potluck en un clipboard: renglones con nombres de señoras y el plato;
// cada renglón se escribe a mano; con `replace` algunos platos se tachan y se reescriben (p. ej. "store bought").
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { LOR, SERIF, HAND, rnd } from "./LorTheme";
import { Bed } from "./LorRecipeCard";

export type SignRow = { name: string; dish: string; replace?: string };

export const LorSignUpSheet: React.FC<{ title?: string; rows: SignRow[]; bed?: string; replaceAt?: number; stamp?: string }> = ({ title = "Harvest Supper · Sign Up", rows, bed, replaceAt = 5, stamp }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inP = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const per = Math.min(12, (replaceAt * fps - 20) / Math.max(1, rows.length));
  const push = interpolate(f, [0, replaceAt * fps + 60], [1, 1.07], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Bed src={bed} dim={0.35} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", scale: String(push) }}>
        <div style={{ position: "relative", width: 1000, height: 1000, marginTop: 120, rotate: `${-1.5 * inP}deg`, translate: `0px ${(1 - inP) * 200}px` }}>
          {/* tabla del clipboard */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: "linear-gradient(135deg,#A8743F,#8A5A2B)", boxShadow: `0 30px 60px ${LOR.shadow}` }} />
          <div style={{ position: "absolute", left: 40, right: 40, top: 70, bottom: 30, background: LOR.white, boxShadow: "0 3px 8px rgba(0,0,0,0.2)", padding: "70px 50px 20px" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 50, color: LOR.ink, marginBottom: 18 }}>{title}</div>
            <div style={{ display: "flex", fontFamily: SERIF, fontWeight: 700, fontSize: 28, color: LOR.inkSoft, borderBottom: `3px solid ${LOR.ink}`, paddingBottom: 6 }}>
              <div style={{ width: "46%" }}>NAME</div><div>BRINGING</div>
            </div>
            {rows.map((r, i) => {
              const t0 = 14 + i * per;
              const w = interpolate(f, [t0, t0 + per * 0.9], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const rt = replaceAt * fps + i * 7;
              const strike = r.replace ? interpolate(f, [rt, rt + 8], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
              const nw = r.replace ? interpolate(f, [rt + 8, rt + 22], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
              return (
                <div key={i} style={{ position: "relative", display: "flex", alignItems: "center", height: 64, borderBottom: "2px solid rgba(90,130,190,0.35)", fontFamily: HAND, fontSize: 46, color: "#1F2F5C", clipPath: `inset(0 ${100 - w}% 0 0)` }}>
                  <div style={{ width: "46%", rotate: `${(rnd(i) - 0.5) * 2}deg` }}>{r.name}</div>
                  <div style={{ position: "relative" }}>
                    {r.dish}
                    {r.replace ? <div style={{ position: "absolute", left: -4, top: "52%", height: 4, width: `${strike}%`, background: LOR.gingham, rotate: "-3deg" }} /> : null}
                  </div>
                  {r.replace ? <div style={{ marginLeft: 22, color: LOR.gingham, fontWeight: 700, clipPath: `inset(0 ${100 - nw}% 0 0)`, rotate: "-2deg" }}>{r.replace}</div> : null}
                </div>
              );
            })}
          </div>
          {/* clip metálico */}
          <div style={{ position: "absolute", left: "50%", top: 18, translate: "-50% 0", width: 300, height: 90, borderRadius: 14, background: "linear-gradient(180deg,#E8E8E8,#9A9A9A)", boxShadow: "0 6px 12px rgba(0,0,0,0.35)" }} />
          {stamp ? <div style={{ position: "absolute", right: -40, bottom: 80, rotate: "-12deg", fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: LOR.gingham, border: `6px solid ${LOR.gingham}`, padding: "4px 24px", borderRadius: 12, opacity: interpolate(f, [replaceAt * fps + 40, replaceAt * fps + 50], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), scale: String(interpolate(f, [replaceAt * fps + 40, replaceAt * fps + 50], [1.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })), background: "rgba(255,255,255,0.6)" }}>{stamp}</div> : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
