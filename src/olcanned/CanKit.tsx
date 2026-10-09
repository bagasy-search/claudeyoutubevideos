// Kit NUEVO de olcanned — todo DENTRO del mundo de la cabaña:
//  CanLedger:   el libro de cuentas de Emil abierto sobre la mesa; la cuenta se escribe a lápiz renglón por renglón.
//  CanJarTag:   la etiqueta de cartón atada con hilo al frasco de porotos: el número de cada forma, su costo y su página;
//               en el CTA la etiqueta lleva el QR IMPRESO (generado por código, verificado con cv2 sobre el render).
//  CanBagVsCan: la estantería de la despensa: una bolsa de papel contra las latas, y las tazas que rinde cada una.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, SERIF, HAND, LABEL, SANS, hexA } from "../ole/OleTheme";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const Scene: React.FC<{ src: string; push?: number }> = ({ src, push = 0.05 }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const z = interpolate(f, [0, durationInFrames], [1.04, 1.04 + push], CL);
  return <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#2b2620" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})` }} /></AbsoluteFill>;
};
const reveal = (p: number) => (p >= 99.9 ? "none" : `inset(-30% ${100 - p}% -30% 0)`);
const num = (v: any, d: number) => (typeof v === "number" && v > 0 ? v : d);

// ───────────────────────────── CanLedger
type Line = { t: string; at?: number | string; circle?: boolean };
export const CanLedger: React.FC<{ title?: string; lines: Line[]; bed?: string }> = ({ title = "", lines, bed = "img/olcanned/bed_ledger.jpg" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const t = f / fps;
  const out = interpolate(f, [durationInFrames - 7, durationInFrames], [1, 0], CL);
  const at = (i: number) => num(lines[i].at, 0.3 + i * 0.9);
  // cámara: baja lentamente siguiendo el renglón que se escribe (como alguien mirando por encima del hombro)
  let cur = 0; lines.forEach((_, i) => { if (t >= at(i)) cur = i; });
  const ty = interpolate(cur, [0, Math.max(1, lines.length - 1)], [30, -40], CL);
  const pencil: React.CSSProperties = { fontFamily: HAND, color: "#3d3a33", textShadow: "0 0 1px rgba(60,55,45,0.4)" };
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Scene src={bed} push={0.07} />
      <AbsoluteFill style={{ perspective: 2400, alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 1380, height: 820, transform: `translateY(${ty}px) rotateX(24deg) rotateZ(-2deg)`, position: "relative" }}>
          {/* página del libro (papel rayado azul con margen rojo, gastado) apoyada sobre la cama del libro abierto */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 6, background: "#EFE6CD", backgroundImage: `linear-gradient(90deg, transparent 150px, ${hexA("#B8433A", 0.5)} 150px 153px, transparent 153px), repeating-linear-gradient(0deg, transparent 0 66px, ${hexA("#6F8FB0", 0.4)} 66px 68px), radial-gradient(ellipse at 80% 20%, rgba(150,110,50,0.18), transparent 30%)`, boxShadow: "0 30px 60px rgba(20,14,8,0.45), inset 30px 0 40px -30px rgba(80,60,30,0.5)" }} />
          {title ? <div style={{ ...pencil, position: "absolute", left: 190, top: 40, fontSize: 56, fontWeight: 700, clipPath: reveal(interpolate(t, [0, 0.6], [0, 100], CL)), whiteSpace: "nowrap" }}>{title}</div> : null}
          {lines.map((l, i) => {
            const a = at(i), p = interpolate(t, [a, a + 0.8], [0, 100], CL);
            return (
              <div key={i} style={{ position: "absolute", left: 190, top: 150 + i * 136, opacity: t >= a ? 1 : 0 }}>
                <div style={{ ...pencil, fontSize: 74, whiteSpace: "nowrap", clipPath: reveal(p) }}>{l.t}</div>
                {l.circle ? (
                  <svg width="1100" height="150" viewBox="0 0 1100 150" style={{ position: "absolute", left: -40, top: -26, overflow: "visible" }}>
                    <path d="M30 80 C 20 10, 1040 0, 1070 70 C 1090 140, 60 150, 40 85" fill="none" stroke="#B8433A" strokeWidth="6" strokeLinecap="round" strokeDasharray="2400" strokeDashoffset={interpolate(t, [a + 0.8, a + 1.4], [2400, 0], CL)} />
                  </svg>
                ) : null}
              </div>
            );
          })}
          {/* el lápiz que escribe, en la punta del renglón activo */}
          <div style={{ position: "absolute", left: 190 + Math.min(900, 40 * (lines[cur]?.t.length || 0) * interpolate(t, [at(cur), at(cur) + 0.8], [0, 1], CL)), top: 150 + cur * 136 - 70, width: 26, height: 220, background: "linear-gradient(90deg,#d9a33a,#f0c35a,#c48a26)", borderRadius: 4, transform: "rotate(28deg)", transformOrigin: "bottom", boxShadow: "8px 8px 14px rgba(0,0,0,0.3)" }}>
            <div style={{ position: "absolute", bottom: -26, left: 3, width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: "28px solid #e8c9a0" }} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────────── CanJarTag
export const CanJarTag: React.FC<{ n?: number; title: string; cost: string; page: string; cta?: boolean; qr?: string; bed?: string }> = ({ n, title, cost, page, cta = false, qr, bed = "img/olcanned/bed_jar.jpg" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const t = f / fps;
  const out = interpolate(f, [durationInFrames - 7, durationInFrames], [1, 0], CL);
  // la etiqueta cuelga del hilo y se mece hasta quedarse quieta (en el CTA queda quieta antes para leer el QR)
  const swing = Math.sin(t * 2.4) * (cta ? 4 : 7) * Math.exp(-t * (cta ? 2.2 : 0.9));
  const drop = spring({ frame: f, fps, config: { damping: 12, stiffness: 120 } });
  const W = cta ? 820 : 780, H = cta ? 920 : 560;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Scene src={bed} push={0.06} />
      {/* hilo desde el cuello del frasco */}
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}><path d={`M 860 300 Q ${1000 + swing * 4} 330 ${1180 + swing * 6} ${cta ? 120 : 250}`} stroke="#8a6a40" strokeWidth="5" fill="none" /></svg>
      <div style={{ position: "absolute", left: cta ? 1020 : 1060, top: cta ? 70 : 230, width: W, height: H, transformOrigin: "160px 40px", transform: `translateY(${(1 - drop) * -500}px) rotate(${swing + (cta ? -2 : -5)}deg)`,
        background: "linear-gradient(160deg,#d8b98a,#c9a66b 55%,#b8935a)", clipPath: "polygon(16% 0, 100% 0, 100% 100%, 0 100%, 0 14%)", boxShadow: "0 24px 40px rgba(0,0,0,0.35)", borderRadius: 6 }}>
        <div style={{ position: "absolute", left: 120, top: 26, width: 40, height: 40, borderRadius: 20, background: "#2b2018", boxShadow: "0 0 0 10px #efe3c8" }} />
        {!cta ? (
          <div style={{ position: "absolute", left: 70, top: 110, right: 50 }}>
            <div style={{ fontFamily: LABEL, fontSize: 26, letterSpacing: 6, color: "#5a4426" }}>ONE BAG · WAY</div>
            <div style={{ fontFamily: HAND, fontSize: 130, lineHeight: 1, color: "#8e2b2b", fontWeight: 700 }}>No. {n}</div>
            <div style={{ fontFamily: HAND, fontSize: title.length > 28 ? 50 : 62, lineHeight: 1.05, color: "#2e2a22", fontWeight: 700, marginTop: 8, clipPath: reveal(interpolate(t, [0.4, 1.3], [0, 100], CL)) }}>{title}</div>
            <div style={{ fontFamily: HAND, fontSize: 48, color: OLE.forest, marginTop: 14, opacity: interpolate(t, [1.3, 1.6], [0, 1], CL) }}>{cost} · <span style={{ color: "#8e2b2b" }}>{page}</span></div>
          </div>
        ) : (
          <div style={{ position: "absolute", left: 60, top: 100, right: 50, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontFamily: HAND, fontSize: 70, color: "#2e2a22", fontWeight: 700 }}>{title}</div>
            <div style={{ fontFamily: HAND, fontSize: 40, color: OLE.forest, marginTop: 4 }}>{cost}</div>
            {qr ? <div style={{ marginTop: 22, background: "#FBF7EE", padding: 18, borderRadius: 4 }}><Img src={staticFile(qr)} style={{ width: 420, height: 420, imageRendering: "pixelated", display: "block" }} /></div> : null}
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: "#2e2a22", marginTop: 14 }}>Point your phone here</div>
            <div style={{ fontFamily: HAND, fontSize: 38, color: "#8e2b2b", marginTop: 6, textAlign: "center" }}>{page}</div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────────── CanBagVsCan
const Can: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 150 * s, height: 200 * s, opacity: o, borderRadius: `${14 * s}px / ${10 * s}px`, background: "linear-gradient(90deg,#7d8188,#d7dade 28%,#9ea2a8 52%,#e6e8ea 70%,#7a7e84)", boxShadow: "8px 14px 18px rgba(0,0,0,0.35)" }}>
    {[0.08, 0.5, 0.92].map((k) => <div key={k} style={{ position: "absolute", left: 0, right: 0, top: `${k * 100}%`, height: 4 * s, background: "rgba(0,0,0,0.18)" }} />)}
    <div style={{ position: "absolute", left: 0, right: 0, top: -10 * s, height: 22 * s, borderRadius: "50%", background: "radial-gradient(ellipse,#e9ebee,#8d9198)" }} />
  </div>
);
const Bag: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 300, height: 380 }}>
    <div style={{ position: "absolute", inset: 0, top: 50, borderRadius: "18px 18px 26px 26px", background: "linear-gradient(95deg,#9c7446,#c49a62 30%,#b48850 60%,#8f6a3e)", boxShadow: "10px 18px 26px rgba(0,0,0,0.4)" }} />
    <div style={{ position: "absolute", left: 14, right: 14, top: 0, height: 80, background: "linear-gradient(180deg,#a67c4a,#c69c66)", clipPath: "polygon(0 100%, 6% 20%, 30% 40%, 50% 10%, 72% 38%, 94% 18%, 100% 100%)" }} />
    <div style={{ position: "absolute", left: 40, bottom: 40, right: 40, height: 100, borderRadius: 8, background: "radial-gradient(circle at 30% 40%, #9a5a34 0 7px, transparent 8px), radial-gradient(circle at 60% 60%, #b06a40 0 7px, transparent 8px), radial-gradient(circle at 80% 30%, #8a4b2a 0 7px, transparent 8px)", backgroundSize: "44px 40px", opacity: 0.6 }} />
  </div>
);
const Cups: React.FC<{ n: number; x: number; y: number; t0: number; color?: string }> = ({ n, x, y, t0, color = OLE.bean }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const t = f / fps; const whole = Math.floor(n), frac = n - whole;
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: 14 }}>
      {Array.from({ length: Math.ceil(n) }, (_, i) => {
        const p = spring({ frame: f - Math.round((t0 + i * 0.22) * fps), fps, config: { damping: 12, stiffness: 160 } });
        const fill = i < whole ? 1 : frac;
        return (
          <div key={i} style={{ width: 86, height: 96, borderRadius: "6px 6px 18px 18px", background: "linear-gradient(90deg,#c9ccd1,#f2f3f5 40%,#b9bdc3)", position: "relative", transform: `translateY(${(1 - p) * -200}px)`, opacity: Math.min(1, p * 2), boxShadow: "4px 8px 10px rgba(0,0,0,0.3)", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 88}%`, background: `radial-gradient(circle at 30% 30%, ${color} 0 9px, transparent 10px), radial-gradient(circle at 70% 60%, #a56a42 0 9px, transparent 10px), #6d3b20`, backgroundSize: "30px 28px" }} />
          </div>
        );
      })}
      <div style={{ fontFamily: HAND, fontSize: 64, color: "#fff", textShadow: "0 3px 8px rgba(0,0,0,0.8)", alignSelf: "center", marginLeft: 10, opacity: interpolate(t, [t0 + 0.6, t0 + 0.9], [0, 1], CL) }}>{n === 1.5 ? "1½" : n} cups</div>
    </div>
  );
};
const Tag: React.FC<{ x: number; y: number; big: string; sub: string; at: number; rot?: number }> = ({ x, y, big, sub, at, rot = -4 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: f - Math.round(at * fps), fps, config: { damping: 11, stiffness: 150 } });
  return (
    <div style={{ position: "absolute", left: x, top: y, padding: "16px 30px", background: "#F6EEDB", borderRadius: 6, transform: `rotate(${rot}deg) scale(${0.6 + 0.4 * p})`, opacity: p, boxShadow: "0 10px 18px rgba(0,0,0,0.35)" }}>
      <div style={{ position: "absolute", top: -14, left: "45%", width: 16, height: 16, borderRadius: 8, background: "#7a2a22" }} />
      <div style={{ fontFamily: HAND, fontSize: 76, lineHeight: 1, color: "#8e2b2b", fontWeight: 700 }}>{big}</div>
      <div style={{ fontFamily: HAND, fontSize: 36, color: OLE.pencil }}>{sub}</div>
    </div>
  );
};
export const CanBagVsCan: React.FC<{ mode?: "four" | "cups" | "rule" | "twelve"; bag?: string; can?: string; bagCups?: number; canCups?: number; bed?: string }> = ({ mode = "four", bag = "$1.80", can = "$1.25", bagCups = 6, canCups = 1.5, bed = "img/olcanned/bed_shelf.jpg" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const t = f / fps;
  const out = interpolate(f, [durationInFrames - 7, durationInFrames], [1, 0], CL);
  const shelfY = 700; // la tabla de la estantería en la foto
  const cans = mode === "four" ? 4 : mode === "rule" ? 2 : mode === "cups" ? 1 : 0;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Scene src={bed} push={0.04} />
      <AbsoluteFill>
        <Bag x={330} y={shelfY - 380} />
        <Tag x={300} y={shelfY + 30} big={mode === "rule" ? "1 cup dry" : bag} sub={mode === "rule" ? "≈ 3 cups cooked" : "1 lb bag · dried"} at={0.2} rot={-3} />
        {Array.from({ length: cans }, (_, i) => {
          const p = spring({ frame: f - Math.round((0.6 + i * 0.35) * fps), fps, config: { damping: 13, stiffness: 140 } });
          return <Can key={i} x={980 + i * 175} y={shelfY - 200 - (1 - p) * 300} o={Math.min(1, p * 2)} />;
        })}
        {cans ? <Tag x={1040} y={shelfY + 30} big={mode === "four" ? `4 × ${can}` : mode === "rule" ? "= 2 cans" : can} sub={mode === "rule" ? "drained" : "15 oz can"} at={0.6 + cans * 0.35} rot={3} /> : null}
        {mode === "cups" ? <><Cups n={bagCups} x={210} y={shelfY + 210} t0={1.2} /><Cups n={canCups} x={1000} y={shelfY + 210} t0={2.2} /></> : null}
        {mode === "twelve" ? (
          <div style={{ position: "absolute", left: 760, top: 200, width: 1000, display: "flex", flexWrap: "wrap", gap: 22 }}>
            {Array.from({ length: 12 }, (_, i) => {
              const p = spring({ frame: f - Math.round((0.4 + i * 0.25) * fps), fps, config: { damping: 12, stiffness: 160 } });
              return <div key={i} style={{ width: 150, height: 150, borderRadius: 75, background: "radial-gradient(circle,#efe7d6 0 52%,#cfc6b3 54%,#b9b09c 70%,#8b8473)", boxShadow: "6px 10px 14px rgba(0,0,0,0.35)", transform: `scale(${p})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontSize: 60, color: "#8e2b2b", fontWeight: 700 }}>{i + 1}</div>;
            })}
            <div style={{ width: "100%", fontFamily: HAND, fontSize: 70, color: "#fff", textShadow: "0 3px 10px rgba(0,0,0,0.85)", opacity: interpolate(t, [3.6, 4.0], [0, 1], CL) }}>twelve ways · one {bag} bag</div>
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
