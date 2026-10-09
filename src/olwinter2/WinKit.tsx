// Kit NUEVO de olwinter2 — todo DENTRO del mundo de la cabaña (nada de placas planas):
//  WinRecipeCard: una ficha de cocina de papel que Ole deja sobre la mesa de tablones (número, receta, costo, página);
//                 en el CTA la ficha lleva el QR IMPRESO (generado por código, verificado con cv2 sobre el render).
//  WinChalkMenu:  la pizarra clavada en la pared de troncos donde se escribe a tiza el menú de la semana, día por día.
//  WinReceipt:    el ticket arrugado del drive-through al lado de las monedas que cuesta la misma cena en casa.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, SERIF, HAND, LABEL, SANS, hexA } from "../ole/OleTheme";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const eo = Easing.bezier(0.16, 1, 0.3, 1);
const r1 = (s: number) => { let x = Math.imul(s ^ 0x9e3779b9, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16; return (x >>> 0) / 4294967296; };

/** foto de fondo de la escena con un push lento (el mundo real debajo del objeto) */
const Scene: React.FC<{ src: string; push?: number; ox?: number; oy?: number }> = ({ src, push = 0.05, ox = 50, oy = 50 }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const z = interpolate(f, [0, durationInFrames], [1.04, 1.04 + push], CL);
  return <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#2b2620" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, transformOrigin: `${ox}% ${oy}%` }} /></AbsoluteFill>;
};
/** escritura a mano: revela el texto de izquierda a derecha entre t0 y t1 (s) */
const Write: React.FC<{ text: string; t0: number; t1: number; style: React.CSSProperties }> = ({ text, t0, t1, style }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = interpolate(f / fps, [t0, t1], [0, 100], CL);
  return <div style={{ ...style, clipPath: p >= 99.9 ? "none" : `inset(-20% ${100 - p}% -20% 0)`, whiteSpace: "nowrap" }}>{text}</div>;
};
const paper = (seed = 1): React.CSSProperties => ({
  backgroundColor: "#F6EEDB",
  backgroundImage:
    `repeating-linear-gradient(0deg, transparent 0 52px, ${hexA("#6F8FB0", 0.35)} 52px 54px),` +
    `linear-gradient(0deg, transparent 0 calc(100% - 118px), ${hexA("#B8433A", 0.55)} calc(100% - 118px) calc(100% - 114px), transparent calc(100% - 114px)),` +
    `radial-gradient(ellipse at ${30 + 40 * r1(seed)}% ${60 + 30 * r1(seed + 3)}%, rgba(170,130,70,0.20), transparent 24%),` +
    "radial-gradient(ellipse at 90% 10%, rgba(120,90,40,0.10), transparent 30%)",
});

// ───────────────────────────── WinRecipeCard
export const WinRecipeCard: React.FC<{ n?: number; title: string; cost: string; page: string; time?: string; cta?: boolean; qr?: string; bed?: string }> = ({ n, title, cost, page, time, cta = false, qr, bed = "img/olwinter2/bed_table.jpg" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const t = f / fps;
  // la ficha "cae" sobre la mesa desde arriba de cuadro y se asienta (la mano de Ole la deja)
  const land = spring({ frame: f - 2, fps, config: { damping: 15, stiffness: 120, mass: 0.9 } });
  const y = (1 - land) * -700, rz = (cta ? -1.5 : -3.5) + (1 - land) * 9, rx = cta ? 10 : 26;
  const out = interpolate(f, [durationInFrames - 7, durationInFrames], [1, 0], CL);
  const W = cta ? 1500 : 1240, H = cta ? 760 : 700;
  const shadow = interpolate(land, [0, 1], [0.05, 0.42]);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Scene src={bed} push={0.06} />
      <AbsoluteFill style={{ perspective: 2200, alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: W, height: H, transform: `translateY(${y + 30}px) rotateX(${rx}deg) rotateZ(${rz}deg)`, transformStyle: "preserve-3d", position: "relative", borderRadius: 10, ...paper(n || 7), boxShadow: `0 ${40 * land}px ${70 * land}px rgba(25,18,10,${shadow}), 0 2px 0 rgba(255,255,255,0.6) inset` }}>
          {/* esquina doblada y mancha de grasa: papel usado, no diseño */}
          <div style={{ position: "absolute", right: 0, top: 0, width: 70, height: 70, background: "linear-gradient(225deg, #d9ccae 0 50%, transparent 50%)", borderTopRightRadius: 10 }} />
          {!cta ? (
            <>
              <Write text={`No. ${n}`} t0={0.35} t1={0.8} style={{ position: "absolute", left: 70, top: 34, fontFamily: HAND, fontSize: 64, color: "#B8433A", fontWeight: 700 }} />
              <div style={{ position: "absolute", right: 80, top: 44, fontFamily: LABEL, fontSize: 26, letterSpacing: 6, color: OLE.mute }}>OLE'S WINTER SUPPERS</div>
              <Write text={title} t0={0.7} t1={1.9} style={{ position: "absolute", left: 70, top: 190, fontFamily: HAND, fontSize: title.length > 30 ? 74 : 92, color: OLE.pencil, fontWeight: 700 }} />
              <Write text={cost + (time ? `  ·  ${time}` : "")} t0={1.9} t1={2.6} style={{ position: "absolute", left: 74, top: 360, fontFamily: HAND, fontSize: 66, color: OLE.forest }} />
              {/* página encerrada en un círculo a lápiz */}
              <div style={{ position: "absolute", right: 110, bottom: 120, opacity: interpolate(t, [2.5, 2.8], [0, 1], CL) }}>
                <div style={{ fontFamily: HAND, fontSize: 64, color: "#B8433A", padding: "10px 34px" }}>{page}</div>
                <svg width="330" height="130" style={{ position: "absolute", left: -20, top: -12 }} viewBox="0 0 330 130">
                  <path d="M40 70 C 30 20, 290 10, 300 60 C 310 110, 60 125, 30 80" fill="none" stroke="#B8433A" strokeWidth="5" strokeLinecap="round"
                    strokeDasharray="800" strokeDashoffset={interpolate(t, [2.6, 3.2], [800, 0], CL)} />
                </svg>
              </div>
            </>
          ) : (
            <>
              <div style={{ position: "absolute", left: 80, top: 52, fontFamily: LABEL, fontSize: 30, letterSpacing: 8, color: OLE.mute }}>OLE'S LITTLE WINTER BOOK</div>
              <Write text={title} t0={0.5} t1={1.4} style={{ position: "absolute", left: 76, top: 150, fontFamily: HAND, fontSize: 96, color: OLE.pencil, fontWeight: 700 }} />
              <Write text={cost} t0={1.3} t1={2.0} style={{ position: "absolute", left: 80, top: 300, fontFamily: HAND, fontSize: 56, color: OLE.forest }} />
              <div style={{ position: "absolute", left: 80, top: 420, width: 760, fontFamily: HAND, fontSize: 52, lineHeight: 1.15, color: "#B8433A", opacity: interpolate(t, [2.0, 2.4], [0, 1], CL) }}>{page}</div>
              {/* el QR va IMPRESO en una etiqueta pegada a la ficha (no un overlay) */}
              {qr ? (
                <div style={{ position: "absolute", right: 70, top: 120, width: 470, height: 520, background: "#FBF7EE", borderRadius: 6, boxShadow: "0 6px 14px rgba(40,30,15,0.25)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 22, transform: "rotate(1.2deg)" }}>
                  <Img src={staticFile(qr)} style={{ width: 400, height: 400, imageRendering: "pixelated" }} />
                  <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: OLE.iron, marginTop: 10, letterSpacing: 1 }}>Point your phone here</div>
                  <div style={{ position: "absolute", top: -22, left: 150, width: 170, height: 44, background: "rgba(232,214,160,0.75)", transform: "rotate(-4deg)" }} />
                </div>
              ) : null}
            </>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────────── WinChalkMenu
type Row = { d: string; s: string; at?: number };
export const WinChalkMenu: React.FC<{ title: string; rows: Row[]; total: string; totalAt?: number; bed?: string }> = ({ title, rows, total, totalAt, bed = "img/olwinter2/bed_wall.jpg" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const t = f / fps;
  const out = interpolate(f, [durationInFrames - 8, durationInFrames], [1, 0], CL);
  const cam = interpolate(f, [0, durationInFrames], [1.0, 1.06], CL);
  const at = (i: number) => (typeof rows[i].at === "number" && rows[i].at! > 0 ? rows[i].at! : 0.6 + i * 1.2);
  const tt = typeof totalAt === "number" && totalAt > 0 ? totalAt : at(rows.length - 1) + 1.4;
  // fila activa: la que se está escribiendo/diciendo ahora (cámara deriva un poco hacia ella)
  let cur = 0; rows.forEach((_, i) => { if (t >= at(i)) cur = i; });
  const drift = interpolate(cur, [0, rows.length - 1], [-40, 40], CL);
  const chalk: React.CSSProperties = { fontFamily: HAND, color: "rgba(244,242,232,0.93)", textShadow: "0 0 2px rgba(255,255,255,0.35), 1px 1px 0 rgba(255,255,255,0.08)" };
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Scene src={bed} push={0.04} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `scale(${cam}) translateY(${-drift}px)` }}>
        {/* marco de madera + pizarra de pizarra verdinegra con polvo de tiza viejo */}
        <div style={{ width: 1560, height: 900, padding: 34, borderRadius: 8, background: "linear-gradient(135deg,#6b4a2b,#4a321d 60%,#5c3f24)", boxShadow: "0 30px 60px rgba(0,0,0,0.55), inset 0 0 0 3px rgba(0,0,0,0.35)", transform: "rotate(-0.8deg)" }}>
          <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 4, overflow: "hidden",
            background: "radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.07), transparent 45%), radial-gradient(ellipse at 75% 70%, rgba(255,255,255,0.05), transparent 40%), #233028", boxShadow: "inset 0 0 80px rgba(0,0,0,0.6)" }}>
            <div style={{ ...chalk, position: "absolute", left: 60, top: 26, fontFamily: LABEL, letterSpacing: 6, fontSize: 40, opacity: interpolate(t, [0, 0.4], [0, 1], CL) }}>{title}</div>
            <div style={{ position: "absolute", left: 60, right: 60, top: 92, height: 3, background: "rgba(240,240,230,0.5)", transformOrigin: "left", transform: `scaleX(${interpolate(t, [0.2, 0.7], [0, 1], CL)})` }} />
            {rows.map((r, i) => {
              const a = at(i);
              const p = interpolate(t, [a, a + 0.9], [0, 100], CL);
              const on = i === cur;
              return (
                <div key={i} style={{ position: "absolute", left: 60, top: 128 + i * 88, display: "flex", gap: 34, alignItems: "baseline", opacity: t >= a ? 1 : 0, clipPath: p >= 99.9 ? "none" : `inset(-30% ${100 - p}% -30% 0)` }}>
                  <div style={{ ...chalk, fontSize: 52, width: 130, fontWeight: 700, color: on ? "#F3C46B" : chalk.color }}>{r.d}</div>
                  <div style={{ ...chalk, fontSize: 56, whiteSpace: "nowrap" }}>{r.s}</div>
                </div>
              );
            })}
            <div style={{ position: "absolute", left: 60, bottom: 40, opacity: interpolate(t, [tt, tt + 0.3], [0, 1], CL) }}>
              <Write text={total} t0={tt} t1={tt + 1.1} style={{ ...chalk, fontSize: 62, fontWeight: 700, color: "#F3C46B" }} />
            </div>
            {/* tiza y borrador apoyados en el canto */}
            <div style={{ position: "absolute", right: 70, bottom: 14, width: 120, height: 18, borderRadius: 9, background: "#efeee6", opacity: 0.85 }} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────────── WinReceipt
export const WinReceipt: React.FC<{ home: string; homeLabel: string; out: string; outLabel: string; keep?: string; mode?: string; bed?: string }> = ({ home, homeLabel, out, outLabel, keep, bed = "img/olwinter2/bed_coins.jpg" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const t = f / fps;
  const fade = interpolate(f, [durationInFrames - 7, durationInFrames], [1, 0], CL);
  const rec = spring({ frame: f - 4, fps, config: { damping: 16, stiffness: 110 } });
  const tag = spring({ frame: f - 14, fps, config: { damping: 13, stiffness: 140 } });
  const st = spring({ frame: f - Math.round(1.6 * fps), fps, config: { damping: 9, stiffness: 180 } });
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Scene src={bed} push={0.05} />
      <AbsoluteFill style={{ perspective: 2000 }}>
        {/* ticket térmico arrugado del drive-through, a la derecha (sobre el plato vacío) */}
        <div style={{ position: "absolute", right: 210, top: 120, width: 520, minHeight: 780, padding: "48px 40px", background: "linear-gradient(180deg,#fdfdfb,#f1f0ea 40%,#fbfbf8 70%,#ecebe4)", transform: `translateX(${(1 - rec) * 900}px) rotateX(18deg) rotateZ(${4 - rec * 1}deg)`, boxShadow: "0 30px 50px rgba(0,0,0,0.35)", fontFamily: "Courier New, monospace", color: "#333", clipPath: "polygon(0 0,100% 0,100% 96%,92% 100%,84% 96%,76% 100%,68% 96%,60% 100%,52% 96%,44% 100%,36% 96%,28% 100%,20% 96%,12% 100%,4% 96%,0 100%)" }}>
          <div style={{ fontSize: 30, textAlign: "center", letterSpacing: 4 }}>DRIVE-THRU</div>
          <div style={{ fontSize: 22, textAlign: "center", marginTop: 6, opacity: 0.7 }}>ORDER #4417 · TO GO</div>
          <div style={{ borderTop: "3px dashed #999", margin: "26px 0" }} />
          <div style={{ fontSize: 34, lineHeight: 1.3 }}>{outLabel}</div>
          <div style={{ borderTop: "3px dashed #999", margin: "26px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 44, fontWeight: 700 }}><span>TOTAL</span><span>{out}</span></div>
          <div style={{ fontSize: 22, marginTop: 40, textAlign: "center", opacity: 0.6 }}>THANK YOU · COME AGAIN</div>
        </div>
        {/* etiqueta kraft a mano sobre las monedas, a la izquierda */}
        <div style={{ position: "absolute", left: 230, top: 330, width: 640, padding: "40px 48px", background: OLE.kraftL, borderRadius: 8, transform: `translateY(${(1 - tag) * -600}px) rotateX(20deg) rotateZ(-5deg)`, boxShadow: "0 24px 40px rgba(0,0,0,0.32)" }}>
          <div style={{ fontFamily: LABEL, fontSize: 26, letterSpacing: 6, color: OLE.mute }}>MADE AT HOME</div>
          <div style={{ fontFamily: HAND, fontSize: 150, lineHeight: 1, color: OLE.forest, fontWeight: 700, marginTop: 10 }}>{home}</div>
          <div style={{ fontFamily: HAND, fontSize: 46, color: OLE.pencil, marginTop: 6 }}>{homeLabel}</div>
          <div style={{ position: "absolute", left: -14, top: 34, width: 28, height: 28, borderRadius: 14, background: "#3a2a18", boxShadow: "inset 0 0 0 6px #c9a66b" }} />
        </div>
        {/* sello "YOU KEEP" que golpea la mesa */}
        {keep ? (
          <div style={{ position: "absolute", left: 520, top: 760, transform: `scale(${interpolate(st, [0, 1], [2.2, 1])}) rotate(-9deg)`, opacity: interpolate(st, [0, 0.2], [0, 1], CL), border: "8px solid #B8433A", borderRadius: 14, padding: "10px 34px", color: "#B8433A", fontFamily: LABEL, fontSize: 64, letterSpacing: 4, background: "rgba(246,238,219,0.35)" }}>YOU KEEP {keep}</div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
