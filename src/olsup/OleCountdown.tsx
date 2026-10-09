// OleCountdown (overlay transparente ~90f): chapa de lata clavada en un tablon + riel de 30 platitos de lata.
// OleCountdownCard (pantalla completa ~75f): version heroe con "#N" enorme sobre plato esmaltado.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, SLAB, HAND, woodBg, hexA, lanternGlow } from "./OleSupTheme";
import { Bed, CL, EnamelPlate, Rivet, easeOut, fadeOut, flicker, pop } from "./OleBits";

const nameSize = (s: string, big = 66) => (s.length > 26 ? big * 0.72 : s.length > 18 ? big * 0.86 : big);
const plateName = (s: string) => (s.length > 22 ? 40 : s.length > 14 ? 46 : 54);

const Plate: React.FC<{ state: number; lit: number; enter: number; f: number }> = ({ state, lit, enter, f }) => {
  // state 0..1 = lleno (servido); lit 0..1 = plato actual encendido
  const sc = (0.4 + 0.6 * enter) * (1 + 0.38 * lit);
  return (
    <div style={{ position: "relative", width: 52, height: 52, scale: String(sc), opacity: enter, translate: `0 ${-lit * 12}px` }}>
      {lit > 0 ? <div style={{ position: "absolute", inset: -26, borderRadius: "50%", background: `radial-gradient(circle, ${hexA(OLE.lantern, 0.85 * flicker(f))}, transparent 68%)`, opacity: lit }} /> : null}
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #fff, ${OLE.enamelWhite} 60%, #b9b39f)`, border: `5px solid ${OLE.enamel}`, boxShadow: "0 3px 5px rgba(0,0,0,0.5)" }} />
      <div style={{ position: "absolute", inset: 12, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #b7b09b, #8f8976)", boxShadow: "inset 0 2px 3px rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", inset: 12, borderRadius: "50%", scale: String(state), opacity: state, background: lit > 0.5 ? `radial-gradient(circle at 40% 35%, ${OLE.lanternSoft}, ${OLE.lantern} 60%, ${OLE.ember})` : "radial-gradient(circle at 40% 35%, #c58a4e, #7a4420 70%)", boxShadow: "inset 0 -2px 3px rgba(0,0,0,0.35)" }} />
    </div>
  );
};

export const OleCountdown: React.FC<{ n: number; name: string; sub?: string; hero?: boolean; total?: number; book?: number }> = ({ n, name, sub, hero = false, total = 30, book }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const out = fadeOut(f, durationInFrames, 10);
  const slide = interpolate(f, [0, 18], [0, 1], { ...CL, easing: easeOut });
  // numeral: el anterior (n+1) cae, el nuevo (n) rebota desde arriba
  const H = 240;
  const oldY = interpolate(f, [8, 22], [0, H + 20], { ...CL, easing: Easing.in(Easing.cubic) });
  const newP = pop(f, fps, 14, 11);
  const newY = (1 - newP) * -(H + 20);
  const hasOld = n + 1 <= total;
  const shake = f > 22 ? Math.sin((f - 22) * 1.3) * 1.6 * Math.exp(-(f - 22) * 0.12) : 0;
  const k = 1; // hero: misma placa (ancho max 640 px para no tapar la cara)
  const numSize = String(n).length > 1 ? 160 : 200;
  const swap = interpolate(f, [14, 22], [0, 1], CL);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <div style={{ position: "absolute", left: 48, top: 46, transformOrigin: "0 0", scale: String(k), translate: `${(1 - slide) * -900}px 0`, rotate: `${shake}deg` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 20px 20px 20px", borderRadius: 14, boxSizing: "border-box", width: 640, ...woodBg(OLE.wood2, 5), boxShadow: `0 20px 40px ${OLE.shadow}, inset 0 0 0 3px rgba(0,0,0,0.5), inset 0 3px 0 rgba(255,220,160,0.18)`, position: "relative" }}>
          <Rivet x={18} y={18} /><Rivet x="calc(100% - 18px)" y={18} /><Rivet x={18} y="calc(100% - 18px)" /><Rivet x="calc(100% - 18px)" y="calc(100% - 18px)" />
          <EnamelPlate w={250} h={H} radius={30} seed={n + 2}>
            {hasOld ? <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", translate: `0 ${oldY}px`, opacity: 1 - swap, fontFamily: SLAB, fontSize: String(n + 1).length > 1 ? 160 : 200, color: OLE.enamelWhite, textShadow: "0 5px 0 rgba(0,0,0,0.4)" }}>{n + 1}</div> : null}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", translate: `0 ${newY}px`, fontFamily: SLAB, fontSize: numSize, color: OLE.lanternSoft, textShadow: `0 5px 0 rgba(0,0,0,0.45), 0 0 26px ${hexA(OLE.lantern, 0.6)}` }}>{n}</div>
            <div style={{ position: "absolute", left: 16, top: 8, fontFamily: SLAB, fontSize: 34, color: hexA(OLE.enamelWhite, 0.85) }}>#</div>
          </EnamelPlate>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 6, flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: SLAB, fontSize: plateName(name), color: OLE.cream, lineHeight: 1.06, textShadow: "0 4px 0 rgba(0,0,0,0.45)", opacity: interpolate(f, [16, 30], [0, 1], CL), translate: `${interpolate(f, [16, 30], [40, 0], { ...CL, easing: easeOut })}px 0` }}>{name}</div>
            {sub ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: OLE.lanternSoft, lineHeight: 1.05, opacity: interpolate(f, [26, 40], [0, 1], CL) }}>{sub}</div> : null}
          </div>
        </div>
        {book != null ? <div style={{ position: "absolute", left: 0, top: "100%", marginTop: 10, padding: "4px 16px 6px", borderRadius: 8, background: "rgba(20,12,6,0.72)", fontFamily: HAND, fontWeight: 700, fontSize: 34, color: OLE.lanternSoft, whiteSpace: "nowrap", opacity: interpolate(f, [30, 44], [0, 1], CL) }}>In Ole's cookbook · p.{book}</div> : null}
      </div>
      <div style={{ position: "absolute", left: 56, right: 56, bottom: 40, height: 96, borderRadius: 14, background: "rgba(20,12,6,0.58)", boxShadow: `0 10px 30px ${OLE.shadow}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px", translate: `0 ${(1 - slide) * 140}px` }}>
        <div style={{ position: "absolute", left: 20, right: 20, bottom: 12, height: 8, borderRadius: 4, background: OLE.wood3, opacity: 0.8 }} />
        {Array.from({ length: total }).map((_, i) => {
          const num = total - i; // 30 a la izquierda ... 1 a la derecha
          const enter = interpolate(f, [4 + i * 0.5, 14 + i * 0.5], [0, 1], { ...CL, easing: easeOut });
          let state = num > n ? 1 : 0; let lit = 0;
          if (num === n + 1) state = 1;
          if (num === n) { state = interpolate(f, [16, 28], [0, 1], CL); lit = interpolate(f, [16, 28], [0, 1], CL); }
          return <Plate key={i} state={state} lit={lit} enter={enter} f={f} />;
        })}
      </div>
    </AbsoluteFill>
  );
};

export const OleCountdownCard: React.FC<{ n: number; name: string; sub?: string; bed?: string }> = ({ n, name, sub, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const out = fadeOut(f, durationInFrames, 8);
  const p = pop(f, fps, 2, 12);
  const glow = flicker(f, n);
  const big = String(n).length > 1 ? 330 : 420;
  const tIn = interpolate(f, [18, 34], [0, 1], { ...CL, easing: easeOut });
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} />
      <AbsoluteFill style={{ background: lanternGlow, opacity: 0.9 * glow }} />
      <div style={{ position: "absolute", left: 620, top: 540, width: 700, height: 700, translate: "-50% -50%", scale: String(0.5 + 0.5 * p), rotate: `${(1 - p) * -14}deg`, opacity: Math.min(1, p * 1.5) }}>
        <div style={{ position: "absolute", inset: -40, borderRadius: "50%", background: `radial-gradient(circle, ${hexA(OLE.lantern, 0.55 * glow)}, transparent 68%)` }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #3f6bb8, ${OLE.enamel} 55%, #1c3568)`, border: `18px solid ${OLE.enamelWhite}`, boxShadow: `0 0 0 8px #14264d, 0 40px 70px ${OLE.shadow}, inset 0 0 90px rgba(0,0,0,0.45)` }} />
        <div style={{ position: "absolute", inset: 70, borderRadius: "50%", border: `4px solid ${hexA(OLE.enamelWhite, 0.35)}` }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SLAB, color: OLE.cream, fontSize: big, textShadow: `0 10px 0 rgba(0,0,0,0.4), 0 0 50px ${hexA(OLE.lantern, 0.5)}` }}>
          <span style={{ fontSize: big * 0.5, color: OLE.lanternSoft, marginRight: 10, alignSelf: "flex-start", marginTop: big * 0.2 }}>#</span>{n}
        </div>
      </div>
      <div style={{ position: "absolute", left: 1040, top: 540, translate: `${(1 - tIn) * 120}px -50%`, opacity: tIn, width: 800 }}>
        <div style={{ position: "relative", padding: "38px 46px 42px", borderRadius: 16, ...woodBg(OLE.wood2, 6), boxShadow: `0 26px 50px ${OLE.shadow}, inset 0 0 0 3px rgba(0,0,0,0.5), inset 0 3px 0 rgba(255,220,160,0.2)` }}>
          <Rivet x={20} y={20} /><Rivet x="calc(100% - 20px)" y={20} /><Rivet x={20} y="calc(100% - 20px)" /><Rivet x="calc(100% - 20px)" y="calc(100% - 20px)" />
          <div style={{ fontFamily: SLAB, fontSize: nameSize(name, 104), lineHeight: 1.05, color: OLE.cream, textShadow: "0 6px 0 rgba(0,0,0,0.45)" }}>{name}</div>
          {sub ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, lineHeight: 1.05, color: OLE.lanternSoft, marginTop: 14, textShadow: "0 3px 0 rgba(0,0,0,0.4)" }}>{sub}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
