// LorCountdown — tarjeta de cuenta regresiva "No. 25": una ficha de recetario con pestaña, clavada con un broche de ropa sobre el mantel
// gingham; el número grande cae y rebota, el nombre del plato en serif, una línea manuscrita y una tira de cuentas (las ya pasadas en rojo).
// Reusable por el canal (cualquier lista "N cosas"). Textos por props (inglés).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { LOR, SERIF, HAND, gingham } from "./LorTheme";

export const LorCountdown: React.FC<{ n: number; total?: number; name: string; sub?: string; word?: string; tab?: string }> = ({ n, total = 25, name, sub, word = "No.", tab = "side dishes" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ez = (a: number, b: number, e = Easing.bezier(0.16, 1, 0.3, 1)) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
  const card = ez(0, 12);
  const drop = interpolate(f, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 1.5, 0.4, 1) });
  const tIn = ez(14, 28), sIn = interpolate(f, [24, 44], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drift = f / fps;
  const done = total - n; // cuántas ya pasaron (cuenta regresiva)
  return (
    <AbsoluteFill style={{ ...gingham(LOR.gingham, 64, 0.22), overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(246,238,220,0.9) 0%, rgba(246,238,220,0.7) 60%, rgba(246,238,220,0.3) 100%)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 1380, height: 640, translate: `0px ${(1 - card) * 700}px`, rotate: `${-1.6 + Math.sin(drift * 0.9) * 0.6}deg` }}>
          {/* pestaña del fichero */}
          <div style={{ position: "absolute", left: 90, top: -54, width: 300, height: 70, background: LOR.butterSoft, borderRadius: "16px 16px 0 0", border: `3px solid ${LOR.paperEdge}`, borderBottom: "none", fontFamily: HAND, fontSize: 46, color: LOR.inkSoft, textAlign: "center", lineHeight: "70px" }}>{tab}</div>
          <div style={{ position: "absolute", inset: 0, background: LOR.paper, borderRadius: 18, boxShadow: `0 30px 60px ${LOR.shadow}`, border: `3px solid ${LOR.paperEdge}`,
            backgroundImage: `repeating-linear-gradient(${LOR.paper} 0px, ${LOR.paper} 62px, rgba(110,154,91,0.35) 62px, rgba(110,154,91,0.35) 64px)`, backgroundPosition: "0 150px" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 118, height: 4, background: LOR.ginghamSoft }} />
          {/* broche */}
          <div style={{ position: "absolute", right: 120, top: -70, width: 46, height: 150, background: "#C9A577", borderRadius: 8, boxShadow: `0 6px 10px ${LOR.shadow}`, rotate: "8deg" }} />
          <div style={{ position: "absolute", left: 80, top: 150, display: "flex", alignItems: "flex-start", gap: 60 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, color: LOR.gingham, lineHeight: 0.85, translate: `0px ${(1 - drop) * -260}px`, opacity: Math.min(1, drop * 2) }}>
              <div style={{ fontSize: 64, letterSpacing: 2, color: LOR.inkSoft }}>{word}</div>
              <div style={{ fontSize: 300 }}>{n}</div>
            </div>
            <div style={{ maxWidth: 820, paddingTop: 70 }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: name.length > 22 ? 96 : 118, color: LOR.ink, lineHeight: 1.0, opacity: tIn, translate: `0px ${(1 - tIn) * 30}px` }}>{name}</div>
              {sub ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 62, color: LOR.greenDeep, marginTop: 18, clipPath: `inset(0 ${100 - sIn}% 0 0)` }}>{sub}</div> : null}
            </div>
          </div>
          {/* cuentas: las que ya pasaron en rojo, la actual en manteca */}
          <div style={{ position: "absolute", left: 80, right: 80, bottom: 46, display: "flex", gap: 10, justifyContent: "center" }}>
            {Array.from({ length: total }).map((_, i) => {
              const cur = i === done, past = i < done;
              const pop = cur ? interpolate(f, [20, 32], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 1.6, 0.4, 1) }) : 1;
              return <div key={i} style={{ width: 30, height: 30, borderRadius: 15, scale: String(pop), background: past ? LOR.gingham : cur ? LOR.butter : "transparent", border: `3px solid ${past ? LOR.gingham : LOR.paperEdge}` }} />;
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
