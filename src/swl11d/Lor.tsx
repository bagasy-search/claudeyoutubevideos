// Piezas propias de swl11d · look "supper for one": papel crema, tinta marrón, sello vino
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { C, FONTS, useKB } from "./Piezas";

const { SERIF, SANS, HAND } = FONTS;
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);
const INK = "#3B2414";
const WINE = "#8E1D2B";
const PAPER = "#F8EEDB";

const fadeIO = (f: number, dur: number, a = 10, b = 10) => interpolate(f, [0, a, dur - b, dur], [0, 1, 1, 0], CL);

// fondo de mesa: foto real del plato, desenfocada y oscura, con deriva lenta
const TableBg: React.FC<{ src: string; dur: number; seed: number; dark?: number }> = ({ src, dur, seed, dark = 0.55 }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [1.12, 1.2]);
  const x = interpolate(f, [0, dur], [seed % 2 ? -20 : 20, seed % 2 ? 20 : -20]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#1d130c" }}>
      <Img src={staticFile(src)} style={{ width: 1920, height: 1080, objectFit: "cover", filter: `blur(18px) brightness(${1 - dark}) saturate(0.85)`, transform: `translateX(${x}px) scale(${s})` }} />
    </AbsoluteFill>
  );
};

const Stamp: React.FC<{ size?: number; rot?: number }> = ({ size = 1, rot = -8 }) => (
  <div style={{ border: `${3 * size}px solid ${WINE}`, borderRadius: 8 * size, padding: `${6 * size}px ${16 * size}px`, color: WINE, fontFamily: SANS, fontWeight: 600,
    fontSize: 19 * size, letterSpacing: 3 * size, transform: `rotate(${rot}deg)`, opacity: 0.82, whiteSpace: "nowrap", outline: `${1 * size}px solid ${WINE}`, outlineOffset: 3 * size }}>
    FROM LORETTA'S KITCHEN
  </div>
);

// tarjeta de receta a pantalla completa: renglones escritos a mano que aparecen sobre su palabra
export type Line = { t: string; f: number };
export const RecipeCard: React.FC<{ kicker: string; title: string; lines: Line[]; img: string; photo?: boolean; dur: number; seed: number }> = ({ kicker, title, lines, img, photo, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const pin = spring({ frame: f, fps, config: { damping: 17, mass: 0.8 } });
  const o = interpolate(f, [dur - 10, dur], [1, 0], CL);
  const two = lines.length > 7;
  const W = photo ? 1040 : 1500, H = 900;
  const cardX = photo ? 820 : 210;
  // cámara: se acerca de a poco al renglón que se está leyendo
  let cur = -1; lines.forEach((l, i) => { if (f >= l.f) cur = i; });
  const fs = two ? (photo ? 30 : 40) : (photo ? 36 : 48);
  const sc = interpolate(f, [0, dur], [1, 1.045]);
  const kb = useKB(seed, dur);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <TableBg src={img} dur={dur} seed={seed} dark={photo ? 0.7 : 0.55} />
      {photo && (
        <div style={{ position: "absolute", left: 70, top: 120, width: 700, height: 840, overflow: "hidden", borderRadius: 6, boxShadow: "0 24px 60px rgba(0,0,0,0.55)", transform: `translateX(${(1 - pin) * -200}px)`, opacity: pin }}>
          <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: kb.transform }} />
        </div>
      )}
      <div style={{ position: "absolute", left: cardX, top: 90, width: W, height: H, transform: `translateY(${(1 - pin) * 260}px) rotate(${(seed % 3) - 1 * 0.6}deg) scale(${sc})`, opacity: pin,
        background: `linear-gradient(180deg, ${PAPER} 0%, #F3E4C6 100%)`, borderRadius: 10, boxShadow: "0 30px 70px rgba(0,0,0,0.55), inset 0 0 90px rgba(140,95,40,0.22)", overflow: "hidden" }}>
        {/* renglones del papel */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(180deg, transparent 0px, transparent ${fs * 1.55 - 2}px, rgba(120,90,60,0.16) ${fs * 1.55 - 2}px, rgba(120,90,60,0.16) ${fs * 1.55}px)`, backgroundPosition: `0 ${210}px` }} />
        <div style={{ position: "absolute", left: 60, top: 0, bottom: 0, width: 2, background: "rgba(142,29,43,0.35)" }} />
        <div style={{ position: "absolute", left: 100, top: 46, right: 60, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: photo ? 20 : 24, letterSpacing: 5, color: WINE }}>{kicker}</div>
            <div style={{ fontFamily: SERIF, fontSize: photo ? 58 : 76, color: INK, lineHeight: 1.05, marginTop: 8 }}>{title}</div>
          </div>
          {!photo && <div style={{ marginTop: 6 }}><Stamp /></div>}
        </div>
        <div style={{ position: "absolute", left: 100, right: 60, top: photo ? 200 : 220, columnCount: two ? 2 : 1, columnGap: 50 }}>
          {lines.map((l, i) => {
            const p = interpolate(f, [l.f, l.f + 12], [0, 1], { ...CL, easing: ease });
            const now = i === cur && f < (lines[i + 1]?.f ?? dur);
            return (
              <div key={i} style={{ breakInside: "avoid", fontFamily: HAND, fontWeight: 700, fontSize: fs, color: INK, lineHeight: 1.55, whiteSpace: "nowrap",
                clipPath: `inset(0 ${100 - p * 100}% 0 0)`, position: "relative" }}>
                <span style={{ color: WINE, marginRight: 14 }}>•</span>{l.t}
                {now && <span style={{ position: "absolute", left: 0, right: 0, bottom: fs * 0.18, height: fs * 0.32, background: "rgba(227,178,92,0.32)", zIndex: -1 }} />}
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", right: 60, bottom: 34, fontFamily: HAND, fontSize: photo ? 30 : 36, color: WINE, opacity: interpolate(f, [20, 35], [0, 0.9], CL) }}>— Loretta</div>
      </div>
    </AbsoluteFill>
  );
};

// página real del recetario (PDF) sobre la mesa + QR al enlace limpio
export const BookPage: React.FC<{ src: string; qr?: string; qrFrom?: number; label?: string; cover?: boolean; dur: number; seed: number; bg: string }> = ({ src, qr, qrFrom = 0, label, cover, dur, seed, bg }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const pin = spring({ frame: f, fps, config: { damping: 18, mass: 0.9 } });
  const o = interpolate(f, [dur - 10, dur], [1, 0], CL);
  const pageH = 1000, pageW = Math.round(pageH * 1700 / 2200);
  // cámara: baja despacio por la página
  const t = interpolate(f, [0, dur], [0, 1], { ...CL, easing: ease });
  const sc = cover ? interpolate(f, [0, dur], [1, 1.05]) : 1 + 0.32 * Math.min(1, f / 40);
  const ty = cover ? 0 : interpolate(t, [0, 1], [180, -200]);
  const q = qr ? spring({ frame: f - qrFrom, fps, config: { damping: 15 } }) : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <TableBg src={bg} dur={dur} seed={seed} dark={0.6} />
      <div style={{ position: "absolute", left: qr ? 260 : 960 - pageW / 2, top: 40, width: pageW, height: pageH, transform: `translateY(${(1 - pin) * 300 + ty}px) scale(${sc}) rotate(${cover ? -2 : -1}deg)`, transformOrigin: "50% 30%",
        boxShadow: "0 30px 80px rgba(0,0,0,0.6)", borderRadius: cover ? 6 : 2, overflow: "hidden", background: PAPER }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      {qr && (
        <div style={{ position: "absolute", right: 170, top: 210, width: 560, padding: 34, background: PAPER, borderRadius: 14, boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
          transform: `scale(${0.6 + 0.4 * q}) rotate(${2 - 2 * q}deg)`, opacity: q, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <Img src={staticFile(qr)} style={{ width: 400, height: 400, imageRendering: "pixelated" }} />
          <div style={{ fontFamily: SERIF, fontSize: 42, color: INK, textAlign: "center", lineHeight: 1.1 }}>{label || "My Supper for One book"}</div>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 22, letterSpacing: 2, color: WINE }}>LINK IN THE DESCRIPTION</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// cartel de capítulo sobre papel (cartas, cuando sale mal)
export const Chapter: React.FC<{ kicker: string; title: string; bg: string; dur: number; seed: number }> = ({ kicker, title, bg, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: f, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ opacity: fadeIO(f, dur, 6, 8) }}>
      <TableBg src={bg} dur={dur} seed={seed} dark={0.5} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: PAPER, padding: "50px 90px", borderRadius: 10, boxShadow: "0 30px 70px rgba(0,0,0,0.55)", transform: `scale(${0.85 + 0.15 * p}) rotate(${-1.5 + p}deg)`, opacity: p, textAlign: "center" }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, letterSpacing: 7, color: WINE }}>{kicker}</div>
          <div style={{ fontFamily: SERIF, fontSize: 96, color: INK, marginTop: 10 }}>{title}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// lista a pantalla completa (compras, la semana, lo que cuesta): cada renglón se escribe y se tilda sobre su palabra;
// el fondo pasa a la foto del renglón que se está leyendo
export type Item = { txt: string; val?: string; f: number; img?: string; total?: boolean };
export const Lista: React.FC<{ head: string; title: string; items: Item[]; bg: string; cols?: number; dur: number; seed: number }> = ({ head, title, items, bg, cols = 1, dur, seed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const pin = spring({ frame: f, fps, config: { damping: 17, mass: 0.8 } });
  let cur = -1; items.forEach((it, i) => { if (f >= it.f) cur = i; });
  const imgs = items.map((it) => it.img).filter(Boolean) as string[];
  const curImg = cur >= 0 ? (items.slice(0, cur + 1).reverse().find((it) => it.img)?.img || bg) : bg;
  const prevImg = (() => { const k = items.slice(0, cur).reverse().find((it) => it.img); return k?.img || bg; })();
  const xf = cur >= 0 && items[cur].img ? interpolate(f, [items[cur].f, items[cur].f + 14], [0, 1], CL) : 1;
  const fs = cols > 1 ? 40 : 46, rowH = fs * 1.6;
  const W = cols > 1 ? 1500 : 1180, X = (1920 - W) / 2;
  const sc = interpolate(f, [0, dur], [1, 1.035]);
  return (
    <AbsoluteFill style={{ opacity: interpolate(f, [dur - 10, dur], [1, 0], CL) }}>
      <TableBg src={prevImg} dur={dur} seed={seed} dark={0.62} />
      {imgs.length > 0 && <AbsoluteFill style={{ opacity: xf }}><TableBg src={curImg} dur={dur} seed={seed + 1} dark={0.62} /></AbsoluteFill>}
      <div style={{ position: "absolute", left: X, top: 80, width: W, height: 920, transform: `translateY(${(1 - pin) * 260}px) rotate(-0.5deg) scale(${sc})`, opacity: pin,
        background: `linear-gradient(180deg, ${PAPER} 0%, #F3E4C6 100%)`, borderRadius: 10, boxShadow: "0 30px 70px rgba(0,0,0,0.55), inset 0 0 90px rgba(140,95,40,0.22)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(180deg, transparent 0px, transparent ${rowH - 2}px, rgba(120,90,60,0.16) ${rowH - 2}px, rgba(120,90,60,0.16) ${rowH}px)`, backgroundPosition: "0 196px" }} />
        <div style={{ position: "absolute", left: 60, top: 0, bottom: 0, width: 2, background: "rgba(142,29,43,0.35)" }} />
        <div style={{ position: "absolute", left: 100, top: 44, right: 60 }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 5, color: WINE }}>{head}</div>
          <div style={{ fontFamily: SERIF, fontSize: 70, color: INK, lineHeight: 1.05, marginTop: 6 }}>{title}</div>
        </div>
        <div style={{ position: "absolute", left: 100, right: 70, top: 210, columnCount: cols, columnGap: 60 }}>
          {items.map((it, i) => {
            const p = interpolate(f, [it.f, it.f + 12], [0, 1], { ...CL, easing: ease });
            const now = i === cur;
            return (
              <div key={i} style={{ breakInside: "avoid", display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: HAND, fontWeight: 700,
                fontSize: it.total ? fs * 1.12 : fs, color: it.total ? WINE : INK, lineHeight: 1.6, whiteSpace: "nowrap", clipPath: `inset(0 ${100 - p * 100}% 0 0)`, position: "relative",
                borderTop: it.total ? `3px solid ${WINE}` : undefined, marginTop: it.total ? 10 : 0 }}>
                <span><span style={{ color: WINE, marginRight: 14 }}>{it.total ? "=" : "•"}</span>{it.txt}</span>
                {it.val && <span style={{ color: WINE, marginLeft: 24 }}>{it.val}</span>}
                {now && cols === 1 && <span style={{ position: "absolute", left: 0, right: 0, bottom: fs * 0.18, height: fs * 0.32, background: "rgba(227,178,92,0.32)", zIndex: -1 }} />}
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", right: 60, bottom: 30, fontFamily: HAND, fontSize: 36, color: WINE, opacity: interpolate(f, [20, 35], [0, 0.9], CL) }}>— Loretta</div>
      </div>
    </AbsoluteFill>
  );
};
