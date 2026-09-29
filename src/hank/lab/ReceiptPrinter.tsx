// ReceiptPrinter — una impresora térmica escupe el ticket renglón por renglón (el papel SUBE desde la ranura a
// pasos de motor, con temblor), pausa, y el TOTAL cae como golpe (banda invertida). Después se corta el ticket
// contra la sierra y flota/curva mientras la cámara se abre para verlo entero.
import React from "react";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, MONO, HK, clamp, ease, easeInOut, rnd, lerp } from "../theme";

export type ReceiptPrinterProps = {
  title: string;
  lines: { l: string; r: string }[]; // l === "---" → separador
  totalLabel: string;
  total: string;
};

const PAPER_W = 660;
const PAD_X = 42;
const FS = 29;
const LH = 50;
const SLOT_Y = 800; // y de la ranura en pantalla (sin cámara)

const Grain: React.FC<{ f: number; o?: number }> = ({ f, o = 0.22 }) => (
  <Img src={staticFile(`yc/grain/g${f % 8}.png`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "overlay", opacity: o, pointerEvents: "none" }} />
);

type Row = { kind: "title" | "rule" | "stars" | "line" | "sep" | "gap" | "total"; h: number; l?: string; r?: string };

const zig = (w: number, h: number, seed: number, top: boolean) => {
  // borde de corte irregular (polígono en % para clip-path)
  const pts: string[] = [];
  const n = 34;
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * 100;
    const y = (i % 2 === 0 ? 0 : 1) * h + rnd(seed + i) * h * 0.6;
    pts.push(`${x}% ${top ? y : `calc(100% - ${y}px)`}${top ? "px" : ""}`);
  }
  return pts;
};

export const ReceiptPrinter: React.FC<ReceiptPrinterProps> = ({ title = "", lines = [], totalLabel = "TOTAL", total = "" }) => {
  const f = useCurrentFrame();
  const { durationInFrames: D, fps } = useVideoConfig();

  // ---- filas del ticket ----
  const titleParts = title.split("·").map((s) => s.trim()).filter(Boolean);
  const rows: Row[] = [{ kind: "gap", h: 40 }, { kind: "stars", h: 36 }];
  titleParts.forEach((t) => rows.push({ kind: "title", h: 58, l: t }));
  rows.push({ kind: "stars", h: 44 }, { kind: "gap", h: 14 });
  lines.forEach((ln) => rows.push(ln.l === "---" ? { kind: "sep", h: 40 } : { kind: "line", h: LH, l: ln.l, r: ln.r }));
  rows.push({ kind: "gap", h: 26 }, { kind: "sep", h: 30 }, { kind: "gap", h: 20 }, { kind: "total", h: 190 }, { kind: "gap", h: 60 }, { kind: "stars", h: 40 }, { kind: "gap", h: 90 });
  const tops: number[] = [];
  let acc = 0;
  rows.forEach((r) => { tops.push(acc); acc += r.h; });
  const C = acc;
  const totalIdx = rows.findIndex((r) => r.kind === "total");

  // ---- agenda: cuándo termina de salir cada fila ----
  const printA = D * 0.05, printB = D * 0.56;
  const preTotal = totalIdx; // filas antes del total
  const rowT = rows.map((_, i) => (i < preTotal ? lerp(printA, printB, i / Math.max(1, preTotal - 1)) : 0));
  const totalFeedA = D * 0.6, slamF = D * 0.68;
  const tearF = D * 0.82;
  const exitP = clamp((f - (D - 11)) / 11);

  // extrusión E(f): escalones de motor hacia el fondo de cada fila
  let E = 0;
  for (let i = 0; i < preTotal; i++) {
    const t0 = rowT[i] - 5;
    const k = clamp((f - t0) / 5);
    const target = tops[i] + rows[i].h;
    const prev = i === 0 ? 0 : tops[i - 1] + rows[i - 1].h;
    if (k > 0) E = lerp(prev, target, k < 1 ? Math.floor(k * 6) / 6 + (k * 6 - Math.floor(k * 6)) * 0.35 / 6 : 1);
  }
  const fullE = C;
  const feedP = easeInOut((f - totalFeedA) / (slamF - totalFeedA - 2));
  if (f >= totalFeedA) E = lerp(tops[preTotal], fullE, feedP);
  const printing = f > printA - 5 && f < slamF && (rowT.some((t) => f >= t - 5 && f <= t) || (f >= totalFeedA && f < slamF - 2));
  const jit = printing ? (rnd(f * 1.7) - 0.5) * 2.4 : 0;

  // ---- golpe del total ----
  const slam = f >= slamF ? spring({ frame: f - slamF, fps, config: { damping: 12, stiffness: 360, mass: 0.7 } }) : 0;
  const shake = f >= slamF && f < slamF + 16 ? Math.exp(-(f - slamF) / 4) : 0;

  // ---- corte + deriva ----
  const tearP = clamp((f - tearF) / 5);
  const drift = easeInOut((f - tearF - 3) / (D - tearF - 3));

  // ---- cámara ----
  const pullBack = drift;
  let camY = lerp(0, 0, 0);
  // al imprimir sube un poco con el papel (para que no se vaya arriba demasiado rápido)
  camY = -Math.min(Math.max(0, E - 300), 220) * 0.6;
  const camS = lerp(1.3 + 0.08 * clamp(f / (D * 0.6)), 0.8, pullBack) * (1 + shake * 0.02);
  const hx = 12 * Math.sin(f / 31) + 5 * Math.sin(f / 11.7 + 1) + shake * 16 * Math.sin(f * 2.9);
  const hy = 8 * Math.sin(f / 27 + 2) + 3 * Math.sin(f / 9.1) + shake * 12 * Math.cos(f * 3.3);
  const rx = 10 + 1.5 * Math.sin(f / 45) - pullBack * 4;
  const ry = -8 + 2 * Math.sin(f / 53) + pullBack * 5;

  // posición del ticket: pegado a la ranura; tras el corte, flota hacia el centro
  const paperBottom = SLOT_Y;
  const floatUp = drift * 220;
  const yc = SLOT_Y - C / 2 - floatUp;
  const shiftY = lerp(-camY * camS, 540 - 648 - (yc - 648) * camS, drift);

  const lineEl = (r: Row, i: number) => {
    const style: React.CSSProperties = { position: "absolute", left: PAD_X, right: PAD_X, top: tops[i], height: r.h, display: "flex", alignItems: "center", fontFamily: MONO, color: "#222", fontSize: FS };
    if (r.kind === "stars") return <div key={i} style={{ ...style, justifyContent: "center", letterSpacing: 4, color: "#555", fontSize: 22, whiteSpace: "nowrap", overflow: "hidden" }}>{"* ".repeat(19).trim()}</div>;
    if (r.kind === "title") return <div key={i} style={{ ...style, justifyContent: "center", fontWeight: 700, fontSize: 36, letterSpacing: 2 }}>{r.l}</div>;
    if (r.kind === "sep") return <div key={i} style={style}><div style={{ flex: 1, borderTop: "3px dashed #444", opacity: 0.85 }} /></div>;
    if (r.kind === "line") return (
      <div key={i} style={{ ...style, fontWeight: 700 }}>
        <span>{r.l}</span>
        <span style={{ flex: 1, margin: "0 12px", height: 3, alignSelf: "center", marginTop: 12, backgroundImage: "radial-gradient(circle, #333 1.3px, transparent 1.6px)", backgroundSize: "12px 4px", backgroundRepeat: "repeat-x", opacity: 0.75 }} />
        <span>{r.r}</span>
      </div>
    );
    if (r.kind === "total") {
      const s = slam;
      const tfs = Math.min(84, (PAPER_W - PAD_X * 2 - 30) / (Math.max(6, total.length) * 0.6));
      return (
        <div key={i} style={{ position: "absolute", left: PAD_X - 14, right: PAD_X - 14, top: tops[i], height: r.h, opacity: clamp(s * 3), transform: `scale(${1 + (1 - s) * 0.9}) rotate(${(1 - s) * -4}deg)`, transformOrigin: "50% 50%" }}>
          <div style={{ position: "absolute", inset: 0, background: "#141414", borderRadius: 2 }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 18, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: "#f4f2ea" }}>{totalLabel}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 66, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: tfs, lineHeight: 1.2, letterSpacing: 1, color: "#fff" }}>{total}</div>
          {/* textura térmica: vetas claras horizontales */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.05) 0 2px, rgba(0,0,0,0) 2px 5px)" }} />
        </div>
      );
    }
    return null;
  };

  // bokeh del fondo (parallax lento)
  const bokeh = Array.from({ length: 14 }).map((_, i) => {
    const x = rnd(i * 4.1) * 1920, y = rnd(i * 7.3 + 1) * 700, r = 40 + rnd(i * 2.2) * 110;
    const col = i % 3 === 0 ? "255,150,60" : i % 3 === 1 ? "255,210,140" : "120,170,160";
    return <div key={i} style={{ position: "absolute", left: x - r - hx * 0.3, top: y - r - hy * 0.3 + camY * 0.15, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle, rgba(${col},${0.1 + rnd(i) * 0.12}) 0%, rgba(${col},0.05) 55%, rgba(0,0,0,0) 70%)` }} />;
  });

  const paperVisibleH = tearP > 0 ? C : E;

  return (
    <AbsoluteFill style={{ background: "#07080a", overflow: "hidden", opacity: 1 - exitP }}>
      <AbsoluteFill style={{ background: "radial-gradient(90% 80% at 50% 30%, #1d1a17 0%, #0b0a09 65%, #050505 100%)" }} />
      {bokeh}
      <AbsoluteFill style={{ perspective: 1900, perspectiveOrigin: "50% 40%" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformStyle: "preserve-3d", transformOrigin: "50% 60%", transform: `translate(${hx}px, ${hy + shiftY}px) scale(${camS}) rotateX(${rx}deg) rotateY(${ry}deg)` }}>
          {/* sombra de la impresora sobre la mesa */}
          <div style={{ position: "absolute", left: 960 - 620, top: SLOT_Y + 330, width: 1240, height: 160, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,0.85), rgba(0,0,0,0))" }} />
          {/* ticket: contenedor recortado por la ranura */}
          <div style={{ position: "absolute", left: 960 - PAPER_W / 2, top: paperBottom - C - 2000, width: PAPER_W, height: C + 2000, overflow: tearP > 0 ? "visible" : "hidden", transformStyle: "preserve-3d" }}>
            <div style={{ position: "absolute", left: jit, width: PAPER_W, height: C, top: 2000 + (C - paperVisibleH) - floatUp, transformOrigin: "50% 100%", transform: `translateZ(${drift * 120}px) rotateZ(${drift * -5}deg) rotateY(${drift * 10}deg) rotateX(${drift * -12}deg)` }}>
              {/* sombra del papel sobre el fondo */}
              <div style={{ position: "absolute", left: 30, right: -30, top: 40 + drift * 40, bottom: -10, background: "rgba(0,0,0,0.55)", filter: "blur(22px)", transform: `translateZ(-40px)` }} />
              <div style={{ position: "absolute", inset: 0, background: "#f3f1ea", clipPath: tearP > 0 ? `polygon(${zig(PAPER_W, 7, 3, true).join(",")}, ${zig(PAPER_W, 8, 9, false).reverse().join(",")})` : `polygon(${zig(PAPER_W, 7, 3, true).join(",")}, 100% 100%, 0% 100%)` }}>
                {rows.map((r, i) => lineEl(r, i))}
                {/* curvatura cilíndrica + térmico */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0) 12%, rgba(255,255,255,0.2) 38%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.05) 85%, rgba(0,0,0,0.2) 100%)", mixBlendMode: "multiply" }} />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(0deg, rgba(0,0,0,${0.3 * (1 - tearP)}) 0px, rgba(0,0,0,0) 90px)` }} />
                {/* luz que baja con la curva del final */}
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(0,0,0,${0.25 * drift}) 0%, rgba(0,0,0,0) 25%)` }} />
              </div>
            </div>
          </div>

          {/* impresora */}
          <div style={{ position: "absolute", left: 960 - 470, top: SLOT_Y - 26, width: 940, height: 420, transform: "translateZ(30px)" }}>
            {/* cara superior */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 70, borderRadius: "30px 30px 6px 6px", background: "linear-gradient(180deg, #4a4a4c 0%, #2c2c2e 40%, #1c1c1e 100%)", boxShadow: "0 -2px 0 rgba(255,255,255,0.08) inset" }} />
            {/* ranura */}
            <div style={{ position: "absolute", left: 470 - PAPER_W / 2 - 20, top: 20, width: PAPER_W + 40, height: 14, borderRadius: 7, background: "#050505", boxShadow: "inset 0 3px 5px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.12)" }} />
            {/* sierra de corte */}
            <div style={{ position: "absolute", left: 470 - PAPER_W / 2 - 30, top: 30, width: PAPER_W + 60, height: 12, background: "linear-gradient(180deg,#c9ccd0,#7c8187)", clipPath: "polygon(0 0,100% 0,100% 40%," + Array.from({ length: 60 }).map((_, k) => `${100 - (k + 0.5) * (100 / 60)}% ${k % 2 ? 40 : 100}%`).join(",") + ",0 40%)" }} />
            {/* frente */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 64, height: 360, background: "linear-gradient(180deg, #2c2c2f 0%, #19191b 26%, #101012 70%, #0a0a0b 100%)", borderRadius: "4px 4px 18px 18px", boxShadow: "0 30px 60px rgba(0,0,0,0.7)" }}>
              <div style={{ position: "absolute", left: 30, right: 30, top: 120, height: 1, background: "rgba(255,255,255,0.06)" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: "4px 4px 18px 18px", background: "linear-gradient(100deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0) 60%)" }} />
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3, background: "rgba(255,255,255,0.1)" }} />
              <div style={{ position: "absolute", right: 70, top: 46, width: 12, height: 12, borderRadius: 6, background: printing ? "#4dff88" : "#1e7a3d", boxShadow: printing ? "0 0 14px #4dff88" : "none" }} />
              <div style={{ position: "absolute", right: 110, top: 38, width: 70, height: 28, borderRadius: 8, background: "linear-gradient(180deg,#3a3a3c,#202022)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)" }} />
              <div style={{ position: "absolute", left: 60, top: 44, width: 160, height: 3, background: "rgba(255,255,255,0.08)" }} />
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(110% 90% at 50% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)", pointerEvents: "none" }} />
      <Grain f={f} />
    </AbsoluteFill>
  );
};
