// Kit "Placa" del Constructor Libre (cl19a, placas de cemento en cartón de huevos). PURO CSS y DOM: sin SVG, sin blur, sin
// backdrop-filter, sin feTurbulence. Materia del video: bandeja de conos (cartón de huevos), losa de cemento con textura de poro,
// listones de madera, llana, sendero en perspectiva, pared de placas. Ningún mecanismo de fb14a-d ni de las hermanas cl19 (registro
// D:/rtmp/cl19_COMPONENTES.md) se repite; dentro del video, uno por idea. Reglas del EVALUADOR: legible desde el primer cuadro
// (entradas ≤ 8 cuadros), placas opacas, letra grande (secundaria ≥ 46 px), máximo dos renglones, siempre algo en movimiento.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { Photo, FONTS, CL } from "./Kit";

const { SERIF, SANS, HAND } = FONTS as any;
export const C = { cem: "#B4B0A8", cemD: "#86827B", cemL: "#D9D5CD", ink: "#1F1B17", teja: "#B5532E", tejaL: "#D9805A", ok: "#3E9A55", no: "#D23F2E", crema: "#F6F1E6", madera: "#B07A45", maderaD: "#7A5230", noche: "rgba(20,18,16,0.9)", pulpa: "#A8A294" };
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = Easing.out(Easing.cubic);
const sp = (f: number, d = 0, damping = 15) => spring({ frame: f - d, fps: 30, config: { damping, mass: 0.6 } });
const out = (f: number, dur: number, len = 8) => interpolate(f, [dur - len, dur], [1, 0], CL);
const tsh = "0 3px 14px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.9)";
const Pic: React.FC<{ src: string; style?: React.CSSProperties; fit?: "cover" | "contain" }> = ({ src, style, fit = "cover" }) => <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: fit, ...style }} />;
const Fondo: React.FC<{ bg?: string; dur: number; seed?: number; side?: "left" | "right" | "bottom" | "all"; k?: number }> = ({ bg, dur, seed = 3, side = "left", k = 0.78 }) => {
  const g = side === "all" ? `rgba(18,16,14,${k * 0.62})` : side === "bottom" ? `linear-gradient(0deg, rgba(18,16,14,${k}) 0%, rgba(18,16,14,${k * 0.5}) 45%, transparent 75%)` : `linear-gradient(${side === "left" ? 90 : 270}deg, rgba(18,16,14,${k}) 0%, rgba(18,16,14,${k * 0.6}) 45%, transparent 78%)`;
  return <AbsoluteFill>{bg ? <Photo src={bg} seed={seed} dur={dur} /> : <AbsoluteFill style={{ background: "linear-gradient(160deg,#4A4640,#24211E)" }} />}<AbsoluteFill style={{ background: g }} /></AbsoluteFill>;
};
// textura de cemento: poros con gradientes repetidos (sin ruido de filtro)
const CEM = (base = C.cem) => `radial-gradient(circle at 23% 31%, rgba(0,0,0,0.13) 0 2px, transparent 3px), radial-gradient(circle at 71% 64%, rgba(0,0,0,0.11) 0 1.5px, transparent 2.5px), radial-gradient(circle at 48% 82%, rgba(255,255,255,0.18) 0 1.5px, transparent 2.5px), linear-gradient(150deg, ${base}, ${C.cemD})`;
const CEMSZ = "37px 41px, 29px 33px, 43px 31px, 100% 100%";
const Losa: React.FC<{ w: number; h: number; style?: React.CSSProperties; children?: React.ReactNode; base?: string }> = ({ w, h, style, children, base }) => <div style={{ width: w, height: h, background: CEM(base), backgroundSize: CEMSZ, borderRadius: 6, boxShadow: "inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -6px 12px rgba(0,0,0,0.25), 0 26px 50px rgba(0,0,0,0.5)", position: "relative", ...style }}>{children}</div>;
// un cono visto desde arriba (punta de la placa) o una copa del cartón (hundida)
const cono = (c1 = "#E4E0D8", c2 = C.cemD) => `radial-gradient(circle at 42% 38%, ${c1} 0%, ${c1} 12%, ${c2} 62%, rgba(0,0,0,0.35) 72%, transparent 74%)`;
const copa = `radial-gradient(circle at 58% 62%, #CFC9BC 0%, #9A9486 45%, #6E695F 66%, transparent 70%)`;
const Grilla: React.FC<{ n: number; m: number; cell: number; bg: (i: number) => string; style?: React.CSSProperties; item?: (i: number) => React.CSSProperties }> = ({ n, m, cell, bg, style, item }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${m}, ${cell}px)`, gridAutoRows: cell, ...style }}>{Array.from({ length: n * m }).map((_, i) => <div key={i} style={{ background: bg(i), ...(item ? item(i) : {}) }} />)}</div>
);
const Kick: React.FC<{ txt: string; color?: string; style?: React.CSSProperties }> = ({ txt, color = C.tejaL, style }) => <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, letterSpacing: 4, color, textShadow: tsh, ...style }}>{txt}</div>;
const Titulo: React.FC<{ txt: string; size?: number; color?: string; f0?: number; style?: React.CSSProperties }> = ({ txt, size = 88, color = "#FFF8EE", f0 = 0, style }) => {
  const f = useCurrentFrame(); const p = sp(f, f0, 16);
  return <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: size, lineHeight: 1.06, color, textShadow: tsh, opacity: cl(p * 1.5), transform: `translateY(${(1 - p) * 20}px)`, ...style }}>{txt}</div>;
};
const Caja: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; edge?: string }> = ({ children, style, edge = C.teja }) => <div style={{ background: C.noche, borderTop: `10px solid ${edge}`, padding: "26px 40px 30px", boxShadow: "0 24px 50px rgba(0,0,0,0.55)", ...style }}>{children}</div>;
const Sello: React.FC<{ ok: boolean; f0: number; size?: number; style?: React.CSSProperties }> = ({ ok, f0, size = 120, style }) => {
  const f = useCurrentFrame(); const p = sp(f, f0, 9); if (f < f0) return null;
  return <div style={{ width: size, height: size, borderRadius: "50%", background: ok ? C.ok : C.no, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: size * 0.62, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1.6 - 0.6 * p}) rotate(${(1 - p) * -25}deg)`, opacity: cl(p * 2), boxShadow: "0 10px 24px rgba(0,0,0,0.5)", ...style }}>{ok ? "✓" : "✕"}</div>;
};
const at = (f: number, list: { f: number }[]) => { let a = -1; list.forEach((x, i) => { if (f >= x.f) a = i; }); return a; };

// ---------- apertura de paso: cuatro listones arman el marco y la mezcla lo LLENA de abajo hacia arriba; el número queda "en relieve"
export const ChapPl: React.FC<{ n: number | string; total: number; title: string; src: string; dur: number }> = ({ n, total, title, src, dur }) => {
  const f = useCurrentFrame(); const lat = [0, 2, 4, 6].map((d) => sp(f, d, 13)); const fill = interpolate(f, [6, 20], [0, 1], { ...CL, easing: ease });
  const W = 720, H = 400, L = 36; const side = typeof n === "number" && n % 2 === 0;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={src} dur={dur} side={side ? "right" : "left"} k={0.62} />
      <div style={{ position: "absolute", [side ? "right" : "left"]: 130, top: 300, width: W, height: H } as any}>
        <div style={{ position: "absolute", left: L, top: L, right: L, bottom: L, overflow: "hidden", background: "#3A3631" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, background: CEM(), backgroundSize: CEMSZ }} />
          <div style={{ position: "absolute", inset: 0, padding: "34px 40px", opacity: cl((fill - 0.6) * 3) }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 50, letterSpacing: 6, color: "#5E5A54", textShadow: "1px 1px 0 rgba(255,255,255,0.55), -1px -1px 0 rgba(0,0,0,0.35)" }}>{typeof n === "number" ? <>PASO <span style={{ fontSize: 110, color: "#4B4741", verticalAlign: -16 }}>{n}</span> DE {total}</> : n}</div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: title.length > 24 ? 60 : 70, lineHeight: 1.04, color: C.ink, marginTop: 14 }}>{title}</div>
          </div>
        </div>
        {[[0, 0, W, L, 0], [0, H - L, W, L, 1], [0, 0, L, H, 2], [W - L, 0, L, H, 3]].map(([x, y, w, h, i]) => (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: h, background: `repeating-linear-gradient(${w > h ? 90 : 0}deg, ${C.madera} 0 22px, #A06C3C 22px 26px, ${C.madera} 26px 60px)`, boxShadow: "0 12px 22px rgba(0,0,0,0.5)", transform: `translate${w > h ? "X" : "Y"}(${(1 - lat[i]) * (i % 2 ? 600 : -600)}px)` }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- índice: las 12 placas se colocan en una pared de a una, como al revestir (de abajo hacia arriba)
export const IdxPl: React.FC<{ head: string; items: { n: number; t: string }[]; dur: number }> = ({ head, items, dur }) => {
  const f = useCurrentFrame(); const hi = Math.floor(interpolate(f, [40, Math.max(80, dur - 20)], [0, 12], CL));
  const order = [8, 9, 10, 11, 4, 5, 6, 7, 0, 1, 2, 3];
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#EDE7DC,#D4CCBE)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 46, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 52, letterSpacing: 6, color: C.ink }}>{head}</div>
      <div style={{ position: "absolute", left: 150, top: 150, display: "grid", gridTemplateColumns: "repeat(4, 390px)", gridAutoRows: 270, gap: 14 }}>
        {items.map((it, i) => { const k = order.indexOf(i); const p = sp(f, k * 2.4, 12); const on = i === hi;
          return <Losa key={i} w={390} h={270} style={{ opacity: cl(p * 2), transform: `translateY(${(1 - p) * 80}px) scale(${0.92 + 0.08 * p})`, outline: on ? `8px solid ${C.teja}` : "none", outlineOffset: -8 }}>
            <div style={{ position: "absolute", left: 22, top: 12, fontFamily: SANS, fontWeight: 700, fontSize: 74, color: "#56524C", textShadow: "1px 1px 0 rgba(255,255,255,0.55)" }}>{it.n}</div>
            <div style={{ position: "absolute", left: 22, right: 18, bottom: 18, fontFamily: SERIF, fontWeight: 700, fontSize: 40, lineHeight: 1.04, color: C.ink }}>{it.t}</div>
          </Losa>; })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- repaso: sendero de 12 placas en perspectiva; la cámara avanza y la placa del paso que se nombra se tiñe de teja
export const RepasoPl: React.FC<{ cards: { n: number; t: string; src: string; f: number }[]; dur: number }> = ({ cards, dur }) => {
  const f = useCurrentFrame(); const a = Math.max(0, at(f, cards)); const cur = cards[a]; const pa = sp(f, cur.f, 14);
  const pos = interpolate(f, cards.map((c) => c.f), cards.map((_, i) => i), CL);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#9DB7C9 0%,#D9E2E6 38%,#6E8A4E 40%,#4E6A34 100%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 430, height: 650, perspective: 900 }}>
        <div style={{ position: "absolute", left: 660, width: 600, top: 0, height: 650, transformStyle: "preserve-3d", transform: "rotateX(62deg)", transformOrigin: "50% 100%" }}>
          {cards.map((c, i) => { const z = (i - pos) * 330; const on = i === a; if (z < -500 || z > 3200) return null;
            return <div key={i} style={{ position: "absolute", left: 60, width: 480, height: 300, bottom: 0, transform: `translateY(${-z}px)`, background: on ? CEM(C.tejaL) : CEM(), backgroundSize: CEMSZ, boxShadow: "0 10px 0 #5C584F", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: 150, color: on ? "#7A3A1E" : "#6A665F" }}>{c.n}</div>; })}
        </div>
      </div>
      <div style={{ position: "absolute", left: 90, top: 70, width: 620, height: 350, borderRadius: 8, overflow: "hidden", boxShadow: "0 24px 50px rgba(0,0,0,0.5)", opacity: cl(pa * 1.5), transform: `translateY(${(1 - pa) * 30}px)` }}><Pic src={cur.src} /></div>
      <div style={{ position: "absolute", left: 760, right: 80, top: 120, opacity: cl(pa * 1.5) }}>
        <Kick txt={`PASO ${cur.n} DE 12`} color="#3A2A1C" style={{ textShadow: "none" }} />
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 92, lineHeight: 1.02, color: C.ink, marginTop: 8 }}>{cur.t}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- precio: un sello de goma baja sobre la placa fresca y deja "$1" hundido
export const PrecioPl: React.FC<{ big: string; sub: string; bg: string; dur: number }> = ({ big, sub, bg, dur }) => {
  const f = useCurrentFrame(); const down = interpolate(f, [0, 7, 11, 22], [-260, 0, 0, -320], CL); const mark = f >= 7;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur, 6) }}>
      <Fondo bg={bg} dur={dur} side="right" k={0.7} />
      <div style={{ position: "absolute", right: 170, top: 330 }}>
        <Losa w={560} h={400}>
          {mark ? <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 250, color: "#77736C", textShadow: "-3px -3px 0 rgba(0,0,0,0.35), 3px 3px 0 rgba(255,255,255,0.5)" }}>{big}</div> : null}
        </Losa>
        <div style={{ position: "absolute", left: 120, top: down, width: 320, height: 180, background: "linear-gradient(180deg,#6B4426,#4A2E18)", borderRadius: "14px 14px 4px 4px", boxShadow: "0 30px 40px rgba(0,0,0,0.5)" }}><div style={{ position: "absolute", left: 120, top: -120, width: 80, height: 130, background: "#3A2414", borderRadius: 30 }} /></div>
        <div style={{ marginTop: 26, fontFamily: SANS, fontWeight: 700, fontSize: 52, color: "#fff", textShadow: tsh, opacity: cl((f - 9) / 6) }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- premio: placa de conos vista de arriba; las puntas se tiñen de teja de a una (teaser: una sola y un velo)
export const PremioPl: React.FC<{ teaser?: boolean; title: string; sub: string; bg?: string; dur: number }> = ({ teaser, title, sub, bg, dur }) => {
  const f = useCurrentFrame(); const k = teaser ? 3 : Math.floor(interpolate(f, [4, Math.min(dur - 10, 60)], [0, 36], CL));
  const rot = interpolate(f, [0, dur], [-4, 4], CL);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="left" k={0.82} />
      <div style={{ position: "absolute", right: 150, top: 200, transform: `perspective(1400px) rotateX(28deg) rotateZ(${rot}deg)` }}>
        <Losa w={660} h={660} style={{ padding: 30 }}>
          <Grilla n={6} m={6} cell={100} bg={(i) => { const order = (i * 17) % 36; return order < k ? cono("#F0A47E", "#8E3E1E") : cono(); }} />
          {teaser ? <div style={{ position: "absolute", inset: 0, background: "rgba(30,26,22,0.55)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 240, color: "#F0A47E", textShadow: tsh }}>?</div> : null}
        </Losa>
      </div>
      <div style={{ position: "absolute", left: 110, top: 380, width: 820 }}><Kick txt={sub} /><Titulo txt={title} size={96} f0={3} style={{ marginTop: 12 }} /></div>
    </AbsoluteFill>
  );
};

// ---------- preguntas que se van a responder: cada una se raya en la cara de una losa (se revela de izquierda a derecha) sobre su palabra
export const PregListPl: React.FC<{ head: string; items: { txt: string; f: number }[]; dur: number }> = ({ head, items, dur }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "#2A2724" }}>
      <div style={{ position: "absolute", left: 200, top: 90 }}>
        <Losa w={1520} h={900} style={{ padding: "50px 70px" }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 52, letterSpacing: 6, color: "#4E4A44" }}>{head}</div>
          {items.map((it, i) => { const p = interpolate(f, [it.f, it.f + 14], [0, 100], CL);
            return <div key={i} style={{ marginTop: 34, fontFamily: HAND, fontSize: 76, color: "#3A3631", clipPath: `inset(0 ${100 - p}% 0 0)`, textShadow: "2px 2px 0 rgba(255,255,255,0.45)" }}>— {it.txt}</div>; })}
        </Losa>
      </div>
    </AbsoluteFill>
  );
};

// ---------- recuerdo: foto impresa pegada con cinta de papel a una pared de ladrillo encalado; leyenda en lápiz sobre la pared
export const PinPl: React.FC<{ src: string; year: string; caption: string; dur: number }> = ({ src, year, caption, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 12); const z = interpolate(f, [0, dur], [1, 1.08], CL);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "repeating-linear-gradient(0deg, #EEEAE2 0 70px, #D9D3C8 70px 76px)", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, transparent 0 210px, #D9D3C8 210px 216px)", backgroundSize: "432px 152px" }} />
      <div style={{ position: "absolute", left: 260, top: 120, transform: `scale(${z}) rotate(${-2 + (1 - p) * -8}deg) translateY(${(1 - p) * -200}px)`, transformOrigin: "50% 0" }}>
        <div style={{ width: 1100, height: 640, background: "#fff", padding: 22, boxShadow: "0 30px 50px rgba(0,0,0,0.35)" }}><div style={{ width: "100%", height: "100%", overflow: "hidden" }}><Pic src={src} /></div></div>
        {[[-40, -20, -14], [1010, -24, 12]].map(([x, y, r], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 150, height: 50, background: "rgba(232,220,190,0.9)", transform: `rotate(${r}deg)` }} />)}
      </div>
      <div style={{ position: "absolute", left: 1400, top: 300, width: 460, fontFamily: HAND, color: "#3D3833", opacity: cl((f - 8) / 8) }}>
        <div style={{ fontSize: 96 }}>{year}</div><div style={{ fontSize: 60, lineHeight: 1.1 }}>{caption}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- tres cartones: tres fichas giran (rotateY) y del otro lado muestran su veredicto
export const TresPl: React.FC<{ items: { t: string; v: string; ok: boolean; c: string; f: number }[]; dur: number }> = ({ items, dur }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#3A3530,#1E1B18)" }}>
      <div style={{ position: "absolute", left: 120, right: 120, top: 220, display: "flex", gap: 50, perspective: 1600 }}>
        {items.map((it, i) => { const r = interpolate(f, [it.f, it.f + 10], [0, 180], { ...CL, easing: ease }); const back = r > 90;
          return <div key={i} style={{ flex: 1, height: 600, position: "relative", transformStyle: "preserve-3d", transform: `rotateY(${r}deg)` }}>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: it.c, borderRadius: 10, display: back ? "none" : "flex", flexDirection: "column", justifyContent: "flex-end", padding: 40 }}>
              <Grilla n={3} m={3} cell={140} bg={() => copa} style={{ position: "absolute", left: 60, top: 60, opacity: 0.85 }} />
              <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 74, color: C.ink, position: "relative" }}>{it.t}</div>
            </div>
            <div style={{ position: "absolute", inset: 0, transform: "rotateY(180deg)", background: C.crema, borderRadius: 10, display: back ? "flex" : "none", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 40, gap: 30 }}>
              <Sello ok={it.ok} f0={it.f + 10} size={140} />
              <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 62, color: C.ink, textAlign: "center" }}>{it.t}</div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 48, color: "#55504A", textAlign: "center", lineHeight: 1.1 }}>{it.v}</div>
            </div>
          </div>; })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- medida: una cinta métrica amarilla se estira a lo largo de la bandeja; abajo, 9 placas arman casi un metro
export const MedidaPl: React.FC<{ bg: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const t = interpolate(f, [2, 18], [0, 1], { ...CL, easing: ease }); const n = Math.floor(interpolate(f, [22, Math.max(40, dur - 20)], [0, 9], CL));
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="right" k={0.85} />
      <div style={{ position: "absolute", right: 120, top: 120, width: 720 }}>
        <div style={{ height: 70, width: `${t * 100}%`, background: "repeating-linear-gradient(90deg, #1E1B17 0 3px, transparent 3px 24px), #F2C230", backgroundSize: "24px 26px, 100% 100%", backgroundRepeat: "repeat-x, no-repeat", borderRadius: 4, boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }} />
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 96, color: "#fff", textShadow: tsh, marginTop: 20 }}>30 × 30 cm</div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 50, color: "#F2C230", textShadow: tsh }}>el cartón de 30 huevos</div>
        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(3, 150px)", gap: 8 }}>{Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ height: 150, background: i < n ? CEM() : "rgba(255,255,255,0.08)", backgroundSize: CEMSZ, border: "2px dashed rgba(255,255,255,0.4)" }} />)}</div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 50, color: "#fff", textShadow: tsh, marginTop: 14, opacity: n >= 9 ? 1 : 0.3 }}>9 placas ≈ 1 m²</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- combada: corte lateral; sin tabla el cartón cede en el medio y la placa sale panza; con tabla queda recta
export const CombaPl: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const b = interpolate(f, [6, 40], [0, 1], { ...CL, easing: ease }); const r2 = sp(f, 70, 14);
  const perfil = (sag: number) => <div style={{ width: 900, height: 80 + sag * 70, background: CEM(), backgroundSize: CEMSZ, borderRadius: `0 0 50% 50% / 0 0 ${sag * 100}% ${sag * 100}%`, boxShadow: "0 18px 30px rgba(0,0,0,0.5)" }} />;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#E9E3D8,#CFC6B6)" }}>
      <div style={{ position: "absolute", left: 140, top: 120 }}><Kick txt="SIN TABLA" color={C.no} style={{ textShadow: "none" }} /><div style={{ marginTop: 20 }}>{perfil(b)}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 60, color: C.ink, marginTop: 20 }}>más gruesa en el centro</div></div>
      <div style={{ position: "absolute", left: 140, top: 640, opacity: cl(r2 * 2), transform: `translateY(${(1 - r2) * 40}px)` }}><Kick txt="SOBRE TABLA PLANA" color={C.ok} style={{ textShadow: "none" }} /><div style={{ marginTop: 20 }}>{perfil(0)}</div>
        <div style={{ width: 960, height: 34, marginLeft: -30, background: `linear-gradient(180deg, ${C.madera}, ${C.maderaD})` }} /></div>
      <Sello ok={false} f0={30} style={{ position: "absolute", left: 1150, top: 170 }} /><Sello ok f0={80} style={{ position: "absolute", left: 1150, top: 680 }} />
    </AbsoluteFill>
  );
};

// ---------- marco: dos listones de canto se paran al lado de una regla; cada uno con su altura y su uso
export const MarcoPl: React.FC<{ bg: string; marks: { f: number }[]; dur: number }> = ({ bg, marks, dur }) => {
  const f = useCurrentFrame(); const a = sp(f, marks[0].f, 12), b = sp(f, marks[1].f, 12);
  const list = (h: number, p: number, t: string, s: string) => <div style={{ display: "flex", alignItems: "flex-end", gap: 30, opacity: cl(p * 2) }}>
    <div style={{ width: 340, height: h * p, background: `repeating-linear-gradient(90deg, ${C.madera} 0 30px, #9C673A 30px 34px)`, boxShadow: "0 14px 26px rgba(0,0,0,0.5)" }} />
    <div><div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 100, color: "#fff", textShadow: tsh }}>{t}</div><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 52, color: C.tejaL, textShadow: tsh }}>{s}</div></div>
  </div>;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="left" k={0.85} />
      <div style={{ position: "absolute", left: 130, top: 170, display: "flex", flexDirection: "column", gap: 70 }}>
        {list(110, a, "2 cm", "placas de pared")}{list(220, b, "4 cm", "placas de piso")}
      </div>
    </AbsoluteFill>
  );
};

// ---------- sed: dos círculos de pulpa; en el seco el agua de la mezcla se va (mancha que se achica) y queda cáscara arenosa
export const SedPl: React.FC<{ marks: { f: number }[]; dur: number }> = ({ marks, dur }) => {
  const f = useCurrentFrame(); const dry = interpolate(f, [marks[0].f, marks[0].f + 60], [1, 0.25], CL); const wet = sp(f, marks[1].f, 14);
  const disco = (k: number, txt: string, sub: string, okk: boolean, f0: number) => <div style={{ width: 640, textAlign: "center" }}>
    <div style={{ width: 520, height: 520, margin: "0 auto", borderRadius: "50%", background: C.pulpa, position: "relative", boxShadow: "0 20px 40px rgba(0,0,0,0.45)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 520 * k, height: 520 * k, marginLeft: -260 * k, marginTop: -260 * k, borderRadius: "50%", background: "radial-gradient(circle, #5E594F, #77715F 70%, transparent 72%)" }} />
    </div>
    <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: "#fff", marginTop: 24, textShadow: tsh }}>{txt}</div>
    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 48, color: okk ? "#9FE0AE" : "#F5A08F", textShadow: tsh }}>{sub}</div>
    <Sello ok={okk} f0={f0} style={{ margin: "14px auto 0" }} size={100} />
  </div>;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#3A352F,#1C1A17)", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 80 }}>
      {disco(dry, "Pulpa seca", "le roba agua a la mezcla", false, marks[0].f + 50)}
      <div style={{ opacity: cl(wet * 2) }}>{disco(1, "Pulpa húmeda", "ya no tiene sed", true, marks[1].f + 10)}</div>
    </AbsoluteFill>
  );
};

// ---------- quema: tira de pH; la aguja corre hasta 12-13, el agua queda en 7
export const PhPl: React.FC<{ bg: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const x = interpolate(f, [4, 30], [7, 12.6], { ...CL, easing: ease });
  const cols = ["#D23F2E", "#E2602A", "#EC8A2A", "#F1B32E", "#E9D53A", "#B5D03C", "#6CBF4A", "#3EA772", "#2E9C9A", "#2E7FB8", "#3561B5", "#4A47A8", "#5B3A9A", "#6A2E88"];
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="bottom" k={0.9} />
      <div style={{ position: "absolute", left: 160, right: 160, bottom: 140 }}>
        <div style={{ display: "flex", height: 90, borderRadius: 8, overflow: "hidden", boxShadow: "0 16px 30px rgba(0,0,0,0.5)" }}>{cols.map((c, i) => <div key={i} style={{ flex: 1, background: c, fontFamily: SANS, fontWeight: 700, fontSize: 40, color: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>{i}</div>)}</div>
        <div style={{ position: "absolute", left: `${(x + 0.5) / 14 * 100}%`, top: -150, transform: "translateX(-50%)", textAlign: "center" }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 60, color: "#fff", textShadow: tsh, whiteSpace: "nowrap" }}>cemento mojado</div>
          <div style={{ width: 0, height: 0, margin: "6px auto 0", borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: "40px solid #fff" }} />
        </div>
        <div style={{ position: "absolute", left: `${7.5 / 14 * 100}%`, top: 110, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 600, fontSize: 46, color: "#fff", textShadow: tsh }}>agua</div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 84, color: "#fff", textShadow: tsh, marginTop: 90 }}>Muy alcalino: quema despacio</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- equipo: tablero perforado con cuatro siluetas vacías que se llenan con su nombre
export const EppPl: React.FC<{ items: string[]; dur: number }> = ({ items, dur }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "radial-gradient(circle, #6B4F33 0 4px, transparent 5px) 0 0 / 50px 50px, #C49A68" }}>
      <div style={{ position: "absolute", left: 140, right: 140, top: 200, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }}>
        {items.map((t, i) => { const p = sp(f, 4 + i * 7, 11);
          return <div key={i} style={{ height: 560, borderRadius: 18, border: "6px dashed rgba(60,40,20,0.6)", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: C.noche, transform: `translateY(${(1 - p) * -120}px)`, opacity: cl(p * 2), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30, padding: 20 }}>
              <Sello ok f0={8 + i * 7} size={110} />
              <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 58, color: "#fff", textAlign: "center", lineHeight: 1.05 }}>{t}</div>
            </div>
          </div>; })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- dos mezclas: dos baldes de corte; cada uno se llena hasta su nivel con su grano y su receta
export const DosPl: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const balde = (i: number, t: string, r: string, s: string, grain: number) => { const p = interpolate(f, [4 + i * 10, 30 + i * 10], [0, 0.82], { ...CL, easing: ease });
    return <div style={{ width: 620, textAlign: "center" }}>
      <div style={{ width: 460, height: 460, margin: "0 auto", position: "relative", clipPath: "polygon(0 0, 100% 0, 88% 100%, 12% 100%)", background: "#2E8A4E" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${p * 100}%`, background: `radial-gradient(circle, rgba(0,0,0,0.2) 0 ${grain}px, transparent ${grain + 1}px) 0 0 / ${grain * 7}px ${grain * 7}px, ${C.cem}` }} />
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 56, letterSpacing: 4, color: C.tejaL, marginTop: 24, textShadow: tsh }}>{t}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 96, color: "#fff", textShadow: tsh }}>{r}</div>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 48, color: "#E8E2D6", textShadow: tsh }}>{s}</div>
    </div>; };
  return <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#3B3631,#1D1A17)", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 120 }}>
    {balde(0, "PUNTAS", "1 : 2", "arena fina, colada", 2)}{balde(1, "CUERPO", "1 : 3", "arena gruesa", 5)}
  </AbsoluteFill>;
};

// ---------- bolsa: dos bolsas de papel caen; a una se le estampa el sí, a la otra el no
export const BolsaPl: React.FC<{ marks: { f: number }[]; dur: number }> = ({ marks, dur }) => {
  const f = useCurrentFrame();
  const bolsa = (t: string, s: string, ok: boolean, f0: number) => { const p = sp(f, f0, 10);
    return <div style={{ width: 520, height: 680, transform: `translateY(${(1 - p) * -700}px) rotate(${(1 - p) * 6}deg)`, background: "linear-gradient(170deg,#D8C9A6,#B9A47A)", borderRadius: "24px 24px 40px 40px", boxShadow: "0 30px 50px rgba(0,0,0,0.5)", position: "relative", padding: "120px 40px 0", textAlign: "center" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 30, height: 40, background: "repeating-linear-gradient(90deg, #A88F60 0 12px, transparent 12px 24px)" }} />
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: "#5A4A2E" }}>CEMENTO</div>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: t.length > 10 ? 74 : 92, color: C.ink, lineHeight: 1 }}>{t}</div>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, color: "#5A4A2E", marginTop: 26 }}>{s}</div>
      <Sello ok={ok} f0={f0 + 12} size={170} style={{ position: "absolute", left: 175, bottom: 50 }} />
    </div>; };
  return <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#5A5249,#2A2622)", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 120 }}>
    {bolsa("PORTLAND", "para las placas", true, marks[0].f)}{bolsa("ALBAÑILERÍA", "para pegar ladrillos", false, marks[1].f)}
  </AbsoluteFill>;
};

// ---------- proporción: vasitos medidores que se vuelcan y apilan bloques (1 gris + 2 arena) en una columna
export const ProporPl: React.FC<{ a: number; b: number; bg: string; dur: number }> = ({ a, b, bg, dur }) => {
  const f = useCurrentFrame(); const blocks = [...Array(a).fill("c"), ...Array(b).fill("s")];
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="right" k={0.85} />
      <div style={{ position: "absolute", right: 260, bottom: 160, display: "flex", flexDirection: "column-reverse", gap: 10 }}>
        {blocks.map((k, i) => { const p = sp(f, 2 + i * 7, 11); return <div key={i} style={{ width: 380, height: 150, transform: `translateY(${(1 - p) * -500}px)`, opacity: cl(p * 3), background: k === "c" ? CEM() : "radial-gradient(circle, rgba(120,90,40,0.35) 0 2px, transparent 3px) 0 0 / 18px 18px, #D9B97C", backgroundSize: k === "c" ? CEMSZ : undefined, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: 56, color: C.ink, boxShadow: "0 10px 20px rgba(0,0,0,0.4)" }}>{k === "c" ? "cemento" : "arena"}</div>; })}
      </div>
      <div style={{ position: "absolute", left: 130, top: 360 }}><Titulo txt={`${a} : ${b}`} size={220} /><Kick txt="MISMO RECIPIENTE, SIEMPRE" /></div>
    </AbsoluteFill>
  );
};

// ---------- prueba del surco: un surco abierto en la mezcla; según el caso se cierra rápido, no se cierra o se cierra en 3 s
export const SurcoPl: React.FC<{ cases: { t: string; sub: string; mode: "sopa" | "seca" | "justa"; f: number }[]; dur: number }> = ({ cases, dur }) => {
  const f = useCurrentFrame(); const a = Math.max(0, at(f, cases)); const c = cases[a]; const t = f - c.f;
  const w = c.mode === "sopa" ? interpolate(t, [0, 8], [140, 0], CL) : c.mode === "seca" ? 140 : interpolate(t, [0, 80], [140, 0], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const ok = c.mode === "justa"; const secs = Math.min(3, Math.floor(t / 27));
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "#2A2622" }}>
      <div style={{ position: "absolute", left: 160, top: 180, width: 1600, height: 460, borderRadius: 30, background: CEM(c.mode === "sopa" ? "#9A968F" : c.mode === "seca" ? "#C9C3B6" : C.cem), backgroundSize: CEMSZ, overflow: "hidden", boxShadow: "inset 0 10px 30px rgba(0,0,0,0.4)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 230 - w / 2, height: w, background: "linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.25) 50%, rgba(255,255,255,0.18))", borderTop: c.mode === "seca" ? "10px dotted rgba(80,70,60,0.8)" : "none", borderBottom: c.mode === "seca" ? "10px dotted rgba(80,70,60,0.8)" : "none" }} />
        {c.mode === "justa" ? <div style={{ position: "absolute", right: 40, top: 30, fontFamily: SANS, fontWeight: 700, fontSize: 90, color: "#fff", textShadow: tsh }}>{secs} s</div> : null}
      </div>
      <div style={{ position: "absolute", left: 160, top: 700, display: "flex", alignItems: "center", gap: 40 }}>
        <Sello ok={ok} f0={c.f + (ok ? 80 : 14)} size={130} />
        <div><div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 84, color: "#fff" }}>{c.t}</div><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 52, color: ok ? "#9FE0AE" : "#F5A08F" }}>{c.sub}</div></div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- burbujas: bandeja vista de arriba; cada golpe manda una onda y en las copas aparecen puntitos que se van apagando
export const BurbPl: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const hit = f % 14; const ring = interpolate(hit, [0, 13], [0, 1100], CL); const left = Math.max(0, Math.round(interpolate(f, [0, dur - 10], [14, 0], CL)));
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "#3A352F", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 360, top: 90, width: 1200, height: 900, background: CEM("#A39F97"), backgroundSize: CEMSZ, borderRadius: 10 }}>
        <Grilla n={6} m={8} cell={150} bg={(i) => (i * 7) % 48 < left * 3 ? `radial-gradient(circle at ${30 + (i * 13) % 40}% ${30 + (i * 29) % 40}%, rgba(255,255,255,0.85) 0 7px, transparent 8px), ${copa}` : copa} />
        <div style={{ position: "absolute", left: 600 - ring / 2, top: 450 - ring / 2, width: ring, height: ring, borderRadius: "50%", border: `8px solid rgba(255,255,255,${0.5 * (1 - ring / 1100)})` }} />
      </div>
      <div style={{ position: "absolute", left: 60, bottom: 60 }}><Caja><div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 72, color: "#fff" }}>Golpe hasta que no suba ni una</div></Caja></div>
    </AbsoluteFill>
  );
};

// ---------- galleta: la losa se levanta de un borde, se dobla y se parte en dos (clip-path); al lado, con malla, se levanta entera
export const GalletaPl: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const lift = interpolate(f, [4, 24], [0, -14], CL); const brk = interpolate(f, [24, 34], [0, 1], { ...CL, easing: ease }); const m = sp(f, 50, 13);
  const half = (left: boolean) => <div style={{ position: "absolute", inset: 0, clipPath: left ? "polygon(0 0, 52% 0, 47% 30%, 53% 55%, 46% 100%, 0 100%)" : "polygon(52% 0, 100% 0, 100% 100%, 46% 100%, 53% 55%, 47% 30%)", transform: left ? `rotate(${brk * -6}deg) translate(${brk * -30}px, ${brk * 20}px)` : `rotate(${brk * 9}deg) translate(${brk * 40}px, ${brk * 60}px)`, transformOrigin: left ? "0 50%" : "100% 50%" }}><Losa w={700} h={300} /></div>;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#E8E2D7,#C9C0B0)" }}>
      <div style={{ position: "absolute", left: 140, top: 200, width: 700, height: 300, transform: `rotate(${lift}deg)`, transformOrigin: "0 100%" }}>{half(true)}{half(false)}</div>
      <div style={{ position: "absolute", left: 140, top: 600, fontFamily: SERIF, fontWeight: 700, fontSize: 76, color: C.ink }}>Sin nada adentro: galleta</div>
      <div style={{ position: "absolute", left: 1040, top: 200, opacity: cl(m * 2), transform: `rotate(${-14 * m}deg)`, transformOrigin: "0 100%" }}>
        <Losa w={700} h={300}><div style={{ position: "absolute", inset: 24, background: "repeating-linear-gradient(60deg, transparent 0 34px, rgba(60,55,50,0.55) 34px 38px), repeating-linear-gradient(-60deg, transparent 0 34px, rgba(60,55,50,0.55) 34px 38px)" }} /></Losa>
      </div>
      <div style={{ position: "absolute", left: 1040, top: 600, fontFamily: SERIF, fontWeight: 700, fontSize: 76, color: C.ink, opacity: cl(m * 2) }}>Con malla: entera</div>
    </AbsoluteFill>
  );
};

// ---------- capas: despiece isométrico (cartón · mezcla fina · malla · cuerpo) que se separa y se vuelve a apretar
export const CapasPl: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const gap = interpolate(f, [0, 14, dur - 40, dur - 16], [0, 120, 120, 6], CL);
  const L = [{ t: "cartón", bg: `${copa}`, sz: "90px 90px", c: C.pulpa }, { t: "mezcla fina", bg: CEM("#C9C5BD"), sz: CEMSZ, c: "" }, { t: "malla, en el medio", bg: "repeating-linear-gradient(60deg, transparent 0 30px, #4A4744 30px 34px), repeating-linear-gradient(-60deg, transparent 0 30px, #4A4744 30px 34px)", sz: "auto", c: "rgba(0,0,0,0)" }, { t: "cuerpo", bg: CEM(), sz: CEMSZ, c: "" }];
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#3A3530,#1C1916)" }}>
      <div style={{ position: "absolute", left: 300, top: 640, transformStyle: "preserve-3d", transform: "perspective(2000px) rotateX(58deg) rotateZ(-32deg)" }}>
        {L.map((l, i) => <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 640, height: 640, background: l.c ? `${l.bg}, ${l.c}` : l.bg, backgroundSize: l.sz, transform: `translateZ(${i * gap}px)`, boxShadow: i === 2 ? "none" : "0 0 0 3px rgba(0,0,0,0.3)", opacity: 0.97 }} />)}
      </div>
      <div style={{ position: "absolute", right: 120, top: 200, display: "flex", flexDirection: "column-reverse", gap: 64 }}>
        {L.map((l, i) => { const p = sp(f, 6 + i * 4, 14); return <div key={i} style={{ fontFamily: SANS, fontWeight: 700, fontSize: i === 2 ? 66 : 54, color: i === 2 ? C.tejaL : "#fff", opacity: cl(p * 2), transform: `translateX(${(1 - p) * 60}px)` }}>{4 - i}. {l.t}</div>; })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- espesor: dos perfiles de placa con una regla de carpintero al costado; el de piso duplica
export const EspesorPl: React.FC<{ marks: { f: number }[]; dur: number }> = ({ marks, dur }) => {
  const f = useCurrentFrame();
  const fila = (cm: number, t: string, f0: number) => { const p = interpolate(f, [f0, f0 + 12], [0, 1], { ...CL, easing: ease });
    return <div style={{ display: "flex", alignItems: "flex-end", gap: 40, marginBottom: 90 }}>
      <div style={{ width: 70, height: cm * 70, background: "repeating-linear-gradient(0deg, #1E1B17 0 3px, transparent 3px 35px), #F2C230" }} />
      <div style={{ width: 1000, height: cm * 70 * p, background: CEM(), backgroundSize: CEMSZ, boxShadow: "0 14px 24px rgba(0,0,0,0.45)" }} />
      <div><div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 100, color: "#fff" }}>{cm} cm</div><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 50, color: C.tejaL }}>{t}</div></div>
    </div>; };
  return <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#3B3631,#1D1A17)", padding: "200px 0 0 130px" }}>{fila(2, "pared", marks[0].f)}{fila(4, "piso y sendero", marks[1].f)}</AbsoluteFill>;
};

// ---------- rombo: la espalda de la placa se raya en diagonal (dos pasadas que se revelan) y una gota de pegamento entra en los canales
export const RomboPl: React.FC<{ bg: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const a = interpolate(f, [2, 22], [0, 100], CL), b = interpolate(f, [24, 44], [0, 100], CL); const g = interpolate(f, [50, 90], [0, 1], CL);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="left" k={0.85} />
      <div style={{ position: "absolute", right: 160, top: 180 }}>
        <Losa w={720} h={720}>
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - a}% 0 0)`, background: "repeating-linear-gradient(45deg, transparent 0 52px, rgba(40,36,32,0.6) 52px 58px)" }} />
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${100 - b}%)`, background: "repeating-linear-gradient(-45deg, transparent 0 52px, rgba(40,36,32,0.6) 52px 58px)" }} />
          <div style={{ position: "absolute", left: 360 - 260 * g, top: 360 - 260 * g, width: 520 * g, height: 520 * g, borderRadius: "50%", background: "radial-gradient(circle, rgba(225,225,220,0.85), rgba(200,200,195,0.6) 60%, transparent 72%)" }} />
        </Losa>
      </div>
      <div style={{ position: "absolute", left: 120, top: 380, width: 820 }}><Kick txt="LA ESPALDA, RAYADA" /><Titulo txt="El pegamento se agarra en los canales" size={80} style={{ marginTop: 12 }} /></div>
    </AbsoluteFill>
  );
};

// ---------- hidratación: dos barras; con sombra y nylon la reacción llega al final; con sol se corta a la mitad
export const HidraPl: React.FC<{ marks: { f: number }[]; dur: number }> = ({ marks, dur }) => {
  const f = useCurrentFrame(); const a = interpolate(f, [marks[0].f, marks[0].f + 60], [0, 1], CL); const b = interpolate(f, [marks[1].f, marks[1].f + 30], [0, 0.5], CL);
  const barra = (k: number, t: string, c: string, okk: boolean, f0: number) => <div style={{ marginBottom: 80 }}>
    <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 56, color: "#fff", marginBottom: 16 }}>{t}</div>
    <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
      <div style={{ width: 1200, height: 90, borderRadius: 45, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}><div style={{ width: `${k * 100}%`, height: "100%", background: c }} /></div>
      <Sello ok={okk} f0={f0} size={110} />
    </div></div>;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#2F3B42,#151B1F)", padding: "170px 0 0 150px" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 84, color: "#fff", marginBottom: 70 }}>No se seca: reacciona con el agua</div>
      {barra(a, "tapada y a la sombra", "linear-gradient(90deg,#5FA8C8,#9AD3E8)", true, marks[0].f + 60)}
      {f >= marks[1].f ? barra(b, "al sol y al viento", "linear-gradient(90deg,#E8A04A,#D2602E)", false, marks[1].f + 30) : null}
    </AbsoluteFill>
  );
};

// ---------- 48 horas: dos días que pasan como una franja día/noche; la marca de 12 h dice "tiza"
export const HorasPl: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const h = interpolate(f, [0, dur - 8], [0, 48], CL);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "#1C1A17" }}>
      <div style={{ position: "absolute", left: 120, right: 120, top: 420, height: 160, borderRadius: 12, background: "linear-gradient(90deg, #13233A 0%, #F2C67A 12%, #9FD0EE 25%, #F2A066 37%, #13233A 50%, #F2C67A 62%, #9FD0EE 75%, #F2A066 87%, #13233A 100%)" }}>
        <div style={{ position: "absolute", left: `${h / 48 * 100}%`, top: -40, bottom: -40, width: 10, background: "#fff", boxShadow: "0 0 0 4px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: "25%", top: 190, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 600, fontSize: 48, color: "#F5A08F" }}>12 h = tiza</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 200, color: "#fff" }}>{Math.round(h)} h</div>
    </AbsoluteFill>
  );
};

// ---------- lámina: la página de la guía; un marco de color recorre cada zona que se nombra (sin zoom brusco)
export const LaminaPl: React.FC<{ src: string; focus: { x: number; y: number; w: number; h: number; f: number }[]; dur: number }> = ({ src, focus, dur }) => {
  const f = useCurrentFrame(); const a = Math.max(0, at(f, focus)); const c = focus[a], pv = focus[Math.max(0, a - 1)]; const k = interpolate(f, [c.f, c.f + 12], [0, 1], { ...CL, easing: ease });
  const L = (p: string) => (pv as any)[p] + ((c as any)[p] - (pv as any)[p]) * k; const z = interpolate(f, [0, dur], [1, 1.06], CL);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "#2A2622" }}>
      <div style={{ position: "absolute", left: 160, top: 60, width: 1600, height: 960, transform: `scale(${z})`, boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}>
        <Pic src={src} fit="contain" />
        <div style={{ position: "absolute", left: `${L("x")}%`, top: `${L("y")}%`, width: `${L("w")}%`, height: `${L("h")}%`, border: `8px solid ${C.teja}`, borderRadius: 10, boxShadow: "0 0 0 2000px rgba(20,18,16,0.38)" }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- no fuego: llama de gradiente que se apaga bajo un balde de agua; queda el cepillo
export const NoFuegoPl: React.FC<{ sub: string; dur: number }> = ({ sub, dur }) => {
  const f = useCurrentFrame(); const fl = 1 + Math.sin(f / 2.3) * 0.06; const w = interpolate(f, [26, 38], [1, 0], CL); const p = sp(f, 40, 13);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#2A2420,#120F0D)" }}>
      <div style={{ position: "absolute", left: 300, bottom: 260, width: 360, height: 520 * w, borderRadius: "50% 50% 40% 40% / 70% 70% 30% 30%", transform: `scaleY(${fl})`, transformOrigin: "50% 100%", background: "radial-gradient(ellipse at 50% 80%, #FFF2B0, #F7A531 35%, #D2441E 65%, transparent 72%)" }} />
      <Sello ok={false} f0={6} size={260} style={{ position: "absolute", left: 350, top: 210 }} />
      <div style={{ position: "absolute", left: 900, top: 300, opacity: cl(p * 2), transform: `translateY(${(1 - p) * 40}px)` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 120, color: "#fff" }}>Nunca fuego</div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 64, color: "#9FD0EE", marginTop: 20 }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- curva de resistencia: la línea sube por los días; marca 7 días (≈70 %) y 28 días (100 %)
export const CurvaPl: React.FC<{ marks: { f: number }[]; dur: number }> = ({ marks, dur }) => {
  const f = useCurrentFrame(); const d = interpolate(f, [marks[0].f, marks[1].f + 30], [0, 28], CL);
  const pct = (x: number) => 100 * (1 - Math.exp(-x / 6.2)) / (1 - Math.exp(-28 / 6.2));
  const W = 1400, H = 560;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#F1ECE3,#D8CFC0)" }}>
      <div style={{ position: "absolute", left: 260, top: 230, width: W, height: H, borderLeft: "6px solid #3A3631", borderBottom: "6px solid #3A3631" }}>
        {Array.from({ length: 57 }).map((_, i) => { const x = i / 2; if (x > d) return null; return <div key={i} style={{ position: "absolute", left: (x / 28) * W - 9, bottom: (pct(x) / 100) * H - 9, width: 18, height: 18, borderRadius: "50%", background: C.teja }} />; })}
        {[[7, "7 días ≈ 70 %"], [28, "28 días: 100 %"]].map(([x, t], i) => d >= (x as number) ? <div key={i} style={{ position: "absolute", left: ((x as number) / 28) * W - (i ? 520 : 40), bottom: (pct(x as number) / 100) * H + 30, fontFamily: SANS, fontWeight: 700, fontSize: 64, color: C.ink, whiteSpace: "nowrap" }}>{t}</div> : null)}
        <div style={{ position: "absolute", left: 0, bottom: -90, fontFamily: SANS, fontWeight: 600, fontSize: 48, color: "#55504A" }}>días de curado</div>
      </div>
      <div style={{ position: "absolute", left: 260, top: 70, fontFamily: SERIF, fontWeight: 700, fontSize: 80, color: C.ink }}>La primera semana manda</div>
    </AbsoluteFill>
  );
};

// ---------- carga: una carretilla con candado de calendario: "28 días" se tacha día por día en una tira
export const CargaPl: React.FC<{ marks: { f: number }[]; bg: string; dur: number }> = ({ marks, bg, dur }) => {
  const f = useCurrentFrame(); const n = Math.floor(interpolate(f, [marks[0].f, marks[0].f + 70], [0, 28], CL)); const w = sp(f, marks[1].f, 13);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="bottom" k={0.92} />
      <div style={{ position: "absolute", left: 120, right: 120, bottom: 250, display: "grid", gridTemplateColumns: "repeat(14, 1fr)", gap: 8 }}>
        {Array.from({ length: 28 }).map((_, i) => <div key={i} style={{ height: 76, background: i === 6 ? C.tejaL : C.crema, borderRadius: 6, fontFamily: SANS, fontWeight: 700, fontSize: 36, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>{i + 1}{i < n ? <div style={{ position: "absolute", left: 6, right: 6, top: 34, height: 8, background: C.no, transform: "rotate(-30deg)" }} /> : null}</div>)}
      </div>
      <div style={{ position: "absolute", left: 120, bottom: 80, fontFamily: SERIF, fontWeight: 700, fontSize: 76, color: "#fff", textShadow: tsh }}>Nada de carga fuerte antes del mes</div>
      <div style={{ position: "absolute", left: 120, top: 120, opacity: cl(w * 2), transform: `translateY(${(1 - w) * -40}px)` }}><Caja edge={C.ok}><div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 60, color: "#fff" }}>a la pared: desde el día 7</div></Caja></div>
    </AbsoluteFill>
  );
};

// ---------- eflorescencia: el polvo blanco florece sobre la foto y un trapo lo barre en diagonal
export const EflorPl: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame(); const bloom = interpolate(f, [0, 30], [0, 1], CL); const wipe = interpolate(f, [60, 120], [0, 140], CL);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Photo src={src} seed={5} dur={dur} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.75), transparent 40%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.7), transparent 38%)", opacity: bloom, clipPath: `polygon(${wipe}% 0, 100% 0, 100% 100%, ${wipe - 40}% 100%)` }} />
      <div style={{ position: "absolute", left: 90, bottom: 90 }}><Caja><div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 46, letterSpacing: 4, color: C.tejaL }}>NO ES MOHO</div><div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 84, color: "#fff" }}>eflorescencia: sale con cepillo seco</div></Caja></div>
    </AbsoluteFill>
  );
};

// ---------- pigmentos: muestrario de colores que se abre en abanico desde un tornillo
export const AbanicoPl: React.FC<{ items: { t: string; c: string }[]; dur: number }> = ({ items, dur }) => {
  const f = useCurrentFrame(); const p = interpolate(f, [2, 22], [0, 1], { ...CL, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#3B3631,#1D1A17)" }}>
      {items.map((it, i) => { const r = (-50 + (100 / (items.length - 1)) * i) * p;
        return <div key={i} style={{ position: "absolute", left: 860, top: 140, width: 200, height: 760, transformOrigin: "100px 700px", transform: `rotate(${r}deg)`, background: it.c, borderRadius: 14, boxShadow: "0 12px 26px rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", paddingTop: 40 }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 46, color: "#fff", writingMode: "vertical-rl", textShadow: tsh }}>{it.t}</div>
        </div>; })}
      <div style={{ position: "absolute", left: 930, top: 810, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle, #ddd, #777)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 50, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 72, color: "#fff" }}>Óxido: se mezcla en seco</div>
    </AbsoluteFill>
  );
};

// ---------- balanza digital: el visor de siete segmentos cuenta 1000 g de cemento y después 50 g de pigmento (5 %)
export const BalanzaPl: React.FC<{ marks: { f: number }[]; bg: string; dur: number }> = ({ marks, bg, dur }) => {
  const f = useCurrentFrame(); const second = f >= marks[1].f;
  const v = second ? Math.round(interpolate(f, [marks[1].f, marks[1].f + 24], [0, 50], CL)) : Math.round(interpolate(f, [marks[0].f, marks[0].f + 20], [0, 1000], CL));
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="right" k={0.85} />
      <div style={{ position: "absolute", right: 170, top: 260, width: 760, height: 520, borderRadius: 30, background: "linear-gradient(180deg,#E8E8E6,#B9B9B6)", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", padding: 50 }}>
        <div style={{ height: 230, borderRadius: 14, background: "#9FB89A", boxShadow: "inset 0 6px 14px rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 40px", fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 170, color: "#1F2A1C", letterSpacing: 8 }}>{v}<span style={{ fontSize: 80, marginLeft: 16 }}>g</span></div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 60, color: C.ink, marginTop: 40 }}>{second ? "pigmento: máximo 5 %" : "cemento"}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- doble encolado: la pared y la espalda de la placa reciben su peine de pegamento y se juntan
export const DoblePl: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const a = interpolate(f, [0, 16], [0, 100], CL); const j = interpolate(f, [18, 32], [0, 1], { ...CL, easing: ease });
  const peine = "repeating-linear-gradient(0deg, #D8D6D0 0 18px, #9C9890 18px 30px)";
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "repeating-linear-gradient(0deg, #B8673E 0 64px, #D9CFC0 64px 72px)" }}>
      <div style={{ position: "absolute", left: 260, top: 160, width: 600, height: 760, background: peine, clipPath: `inset(0 0 ${100 - a}% 0)`, boxShadow: "0 0 0 4px rgba(0,0,0,0.2)" }} />
      <div style={{ position: "absolute", left: 1100 - j * 840, top: 160, width: 600, height: 760, transform: `perspective(1600px) rotateY(${(1 - j) * -50}deg)` }}><Losa w={600} h={760}><div style={{ position: "absolute", inset: 0, background: peine, opacity: 1 - j * 0.9 }} /></Losa></div>
      <div style={{ position: "absolute", right: 80, bottom: 70 }}><Caja><div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 80, color: "#fff" }}>Doble encolado</div></Caja></div>
    </AbsoluteFill>
  );
};

// ---------- sendero: corte de una placa de piso que gira 180°: las puntas quedan abajo, enterradas en la arena
export const SenderoPl: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const r = interpolate(f, [6, 30], [0, 180], { ...CL, easing: Easing.inOut(Easing.cubic) }); const y = interpolate(f, [30, 44], [0, 120], CL);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#A7C3D4 0%,#E3E8E6 55%,#D9B97C 55%,#B8955A 100%)" }}>
      <div style={{ position: "absolute", left: 460, top: 300 + y, width: 1000, transform: `rotate(${r}deg)` }}>
        <div style={{ display: "flex", justifyContent: "space-around", height: 90 }}>{Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ width: 110, height: 90, background: C.cem, clipPath: "polygon(50% 0, 100% 100%, 0 100%)", borderRadius: 20 }} />)}</div>
        <div style={{ height: 160, background: CEM(), backgroundSize: CEMSZ }} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 80, fontFamily: SERIF, fontWeight: 700, fontSize: 96, color: C.ink }}>En el piso, puntas abajo</div>
    </AbsoluteFill>
  );
};

// ---------- cinco errores: cinco placas en fila; la del error que se nombra se raja (línea quebrada por clip-path) y debajo sale el arreglo
export const ErroresPl: React.FC<{ items: { t: string; fix: string; f: number }[]; dur: number }> = ({ items, dur }) => {
  const f = useCurrentFrame(); const a = at(f, items); const c = a >= 0 ? items[a] : null; const pc = c ? sp(f, c.f, 14) : 0;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#38332E,#1A1714)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 56, letterSpacing: 6, color: C.tejaL }}>LOS CINCO ERRORES</div>
      <div style={{ position: "absolute", left: 100, right: 100, top: 160, display: "flex", gap: 30 }}>
        {items.map((it, i) => { const on = i === a, done = i < a; const crack = f >= it.f + 4;
          return <div key={i} style={{ flex: 1, height: 300, position: "relative", transform: on ? "translateY(-16px)" : "none", opacity: done ? 0.5 : 1 }}>
            <Losa w={316} h={300} base={on ? "#C9BFB2" : C.cem}>
              <div style={{ position: "absolute", left: 20, top: 10, fontFamily: SANS, fontWeight: 700, fontSize: 110, color: "#5A564F" }}>{i + 1}</div>
              {crack ? <div style={{ position: "absolute", inset: 0, background: "#1A1714", clipPath: "polygon(48% 0, 53% 0, 47% 34%, 56% 58%, 49% 100%, 44% 100%, 51% 58%, 42% 34%)" }} /> : null}
            </Losa>
          </div>; })}
      </div>
      {c ? <div style={{ position: "absolute", left: 140, right: 140, top: 560, opacity: cl(pc * 2), transform: `translateY(${(1 - pc) * 30}px)` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 92, color: "#fff" }}>{c.t}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 30 }}><Sello ok f0={c.f + 40} size={110} /><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 60, color: "#9FE0AE", opacity: cl((f - c.f - 40) / 8) }}>{c.fix}</div></div>
      </div> : <div style={{ position: "absolute", left: 140, top: 600, fontFamily: SERIF, fontWeight: 700, fontSize: 92, color: "#fff" }}>Los vi todos. Algunos, míos.</div>}
    </AbsoluteFill>
  );
};

// ---------- pregunta: una losa con la pregunta grabada da media vuelta y atrás está la respuesta corta
export const PregPl: React.FC<{ n: number; q: string; a: string; bg: string; dur: number }> = ({ n, q, a, bg, dur }) => {
  const f = useCurrentFrame(); const r = interpolate(f, [Math.min(26, dur * 0.35), Math.min(38, dur * 0.35 + 12)], [0, 180], { ...CL, easing: ease }); const back = r > 90; const p = sp(f, 0, 12);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="all" k={0.9} />
      <div style={{ position: "absolute", left: 360, top: 170, width: 1200, height: 740, perspective: 2200, opacity: cl(p * 2) }}>
        <div style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d", transform: `rotateX(${r}deg) translateY(${(1 - p) * 80}px)` }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", display: back ? "none" : "block" }}><Losa w={1200} h={740} style={{ padding: "60px 70px" }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 50, letterSpacing: 5, color: "#55514B" }}>PREGUNTA {n}</div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: q.length > 34 ? 84 : 100, lineHeight: 1.06, color: "#3A3631", marginTop: 30, textShadow: "2px 2px 0 rgba(255,255,255,0.45)" }}>{q}</div>
          </Losa></div>
          <div style={{ position: "absolute", inset: 0, transform: "rotateX(180deg)", backfaceVisibility: "hidden", display: back ? "block" : "none", background: C.crema, borderRadius: 6, padding: "60px 70px", boxShadow: "0 26px 50px rgba(0,0,0,0.5)" }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 50, letterSpacing: 5, color: C.teja }}>RESPUESTA</div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: a.length > 40 ? 84 : 100, lineHeight: 1.06, color: C.ink, marginTop: 30 }}>{a}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- peso: dos placas cuelgan de un gancho; la cuerda se estira según el peso y aparece el número
export const PesoPl: React.FC<{ marks: { f: number }[]; dur: number }> = ({ marks, dur }) => {
  const f = useCurrentFrame();
  const colg = (x: number, kg: string, t: string, h: number, len: number, f0: number) => { const p = sp(f, f0, 7); const L = 120 + len * p;
    return <div style={{ position: "absolute", left: x, top: 0, opacity: cl((f - f0 + 2) / 4) }}>
      <div style={{ width: 8, height: L, marginLeft: 246, background: "#C9B48A" }} />
      <Losa w={500} h={h} />
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 110, color: "#fff", marginTop: 20 }}>{kg}</div>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 52, color: C.tejaL }}>{t}</div>
    </div>; };
  return <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#3B3631,#1D1A17)" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 60, height: 20, background: "#6B5236" }} />
    {colg(280, "7–8 kg", "pared · 2 cm", 70, 140, marks[0].f)}{colg(1100, "≈ 12 kg", "piso · 4 cm", 140, 260, marks[1].f)}
  </AbsoluteFill>;
};

// ---------- la cuenta: ticket de ferretería que sale de una impresora y va sumando renglón por renglón
export const TicketPl: React.FC<{ rows: { t: string; v: string; f: number }[]; total: string; tf: number; bg: string; dur: number }> = ({ rows, total, tf, bg, dur }) => {
  const f = useCurrentFrame(); const n = at(f, rows) + 1; const hgt = 180 + n * 110 + (f >= tf ? 170 : 0); const hh = sp(f, 0, 20) * 0 + hgt;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="left" k={0.88} />
      <div style={{ position: "absolute", left: 140, top: 60, width: 820, height: 70, background: "#3A3734", borderRadius: 12 }} />
      <div style={{ position: "absolute", left: 180, top: 110, width: 740, height: hh, background: "#FAF8F2", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", padding: "40px 46px", overflow: "hidden", clipPath: "polygon(0 0,100% 0,100% calc(100% - 14px),95% 100%,90% calc(100% - 14px),85% 100%,80% calc(100% - 14px),75% 100%,70% calc(100% - 14px),65% 100%,60% calc(100% - 14px),55% 100%,50% calc(100% - 14px),45% 100%,40% calc(100% - 14px),35% 100%,30% calc(100% - 14px),25% 100%,20% calc(100% - 14px),15% 100%,10% calc(100% - 14px),5% 100%,0 calc(100% - 14px))" }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 46, color: "#333", textAlign: "center", borderBottom: "4px dashed #999", paddingBottom: 16 }}>UNA PLACA 30×30</div>
        {rows.slice(0, n).map((r, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 50, color: "#222", marginTop: 34 }}><span>{r.t}</span><span>{r.v}</span></div>)}
        {f >= tf ? <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 76, color: C.teja, marginTop: 40, borderTop: "4px dashed #999", paddingTop: 20 }}><span>TOTAL</span><span>{total}</span></div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- metro cuadrado: una pared de 1 m² se reviste de a una placa (11) y el contador de dólares sube con ellas
export const MetroPl: React.FC<{ bg: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const n = Math.floor(interpolate(f, [4, 60], [0, 11], CL)); const m = sp(f, 80, 14);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="left" k={0.88} />
      <div style={{ position: "absolute", right: 170, top: 130, width: 800, height: 800, border: "6px dashed rgba(255,255,255,0.7)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: 196, gap: 4, padding: 4 }}>
        {Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ background: i < n ? CEM() : "transparent", backgroundSize: CEMSZ, transform: i < n ? "none" : "scale(0.8)", transition: "none" }} />)}
      </div>
      <div style={{ position: "absolute", left: 130, top: 320 }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 200, color: "#fff", textShadow: tsh }}>${n}</div>
        <Kick txt="EL METRO CUADRADO" />
        <div style={{ opacity: cl(m * 2), fontFamily: SANS, fontWeight: 600, fontSize: 56, color: "#fff", textShadow: tsh, marginTop: 30 }}>1 bolsa ≈ 25 placas</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- puntas de color: corte de la placa; sólo el cuarto de arriba (las puntas) se llena de teja, el resto queda gris
export const PuntasPl: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const p = interpolate(f, [4, 30], [0, 1], { ...CL, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#EEE8DE,#D2C9BA)" }}>
      <div style={{ position: "absolute", left: 260, top: 300, width: 1400 }}>
        <div style={{ display: "flex", justifyContent: "space-around", height: 200 }}>{Array.from({ length: 7 }).map((_, i) => <div key={i} style={{ width: 170, height: 200, clipPath: "polygon(50% 0, 100% 100%, 0 100%)", background: `linear-gradient(0deg, ${C.teja} ${p * 100}%, ${C.cemL} ${p * 100}%)` }} />)}</div>
        <div style={{ height: 300, background: CEM(), backgroundSize: CEMSZ }} />
      </div>
      <div style={{ position: "absolute", left: 260, top: 100, fontFamily: SERIF, fontWeight: 700, fontSize: 92, color: C.ink }}>El pigmento, sólo en las puntas</div>
      <div style={{ position: "absolute", left: 260, top: 840, fontFamily: SANS, fontWeight: 600, fontSize: 56, color: C.teja, opacity: cl(p * 2) }}>un cuarto de la placa</div>
    </AbsoluteFill>
  );
};

// ---------- cierre con guía: la lámina entra como una placa más a una pared, con el QR y la dirección grabados
export const CtaPl: React.FC<{ src: string; qr: string; url: string; dur: number }> = ({ src, qr, url, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 12), q = sp(f, 8, 12);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "repeating-linear-gradient(0deg, #EEEAE2 0 70px, #D9D3C8 70px 76px)" }}>
      <div style={{ position: "absolute", left: 120, top: 140, width: 1080, height: 760, background: "#fff", padding: 18, boxShadow: "0 30px 60px rgba(0,0,0,0.35)", transform: `translateX(${(1 - p) * -400}px) rotate(${-1.5 * p}deg)`, opacity: cl(p * 2) }}><Pic src={src} fit="contain" /></div>
      <div style={{ position: "absolute", left: 1300, top: 200, width: 500, opacity: cl(q * 2), transform: `translateY(${(1 - q) * 60}px)` }}>
        <div style={{ width: 500, height: 500, background: "#fff", padding: 24, boxShadow: "0 24px 50px rgba(0,0,0,0.35)" }}><Pic src={qr} fit="contain" /></div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 54, color: C.ink, marginTop: 30, textAlign: "center" }}>{url}</div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, color: C.teja, textAlign: "center" }}>la guía completa</div>
      </div>
    </AbsoluteFill>
  );
};
