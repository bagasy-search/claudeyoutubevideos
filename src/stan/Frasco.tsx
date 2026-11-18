// Kit "Frasco" del Constructor Libre (fb14d, limpiador de cáscara de naranja y vinagre): etiqueta kraft con hilo, estante de frascos,
// heladera con notas e imanes, funda de recetario, temporizador de cocina, pulverizadores, mármol que se opaca, calendario de taco,
// burbujas de sarro, mancha de pegamento que se ablanda, olla con gel. PURO CSS y DOM: sin SVG, sin blur grande, sin backdrop-filter,
// sin feTurbulence. Ningún mecanismo de Obra (fb14a), Muro (fb14b) ni Piso (fb14c) se repite; dentro del video, uno por idea.
// Lecciones del EVALUADOR (fb14a-c): todo legible desde el primer cuadro (entradas ≤ 8 cuadros), placas opacas, letra grande
// (secundaria ≥ 46 px), máximo dos renglones y una idea, siempre algo en movimiento, nada cortado contra el borde.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { Photo, FONTS, CL } from "./Kit";

const { SERIF, SANS, HAND } = FONTS as any;
export const N = { kraft: "#C9A574", kraftD: "#A9844F", ink: "#2A1D12", nar: "#E8812A", narL: "#F5B25C", amb: "#B8661C", ok: "#3E9A55", no: "#D23F2E", crema: "#FBF5E8", azul: "#CFE3EA", noche: "rgba(18,14,10,0.9)" };
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = Easing.out(Easing.cubic);
const sp = (f: number, d = 0, damping = 15) => spring({ frame: f - d, fps: 30, config: { damping, mass: 0.6 } });
const out = (f: number, dur: number, len = 8) => interpolate(f, [dur - len, dur], [1, 0], CL);
const tsh = "0 3px 14px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.9)";
const Pic: React.FC<{ src: string; style?: React.CSSProperties; fit?: "cover" | "contain" }> = ({ src, style, fit = "cover" }) => <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: fit, ...style }} />;
// fondo: foto viva + sombra lateral (no oscurece toda la foto)
const Fondo: React.FC<{ bg?: string; dur: number; seed?: number; side?: "left" | "right" | "bottom" | "all"; k?: number }> = ({ bg, dur, seed = 3, side = "left", k = 0.78 }) => {
  const g = side === "all" ? `rgba(16,12,9,${k * 0.62})` : side === "bottom" ? `linear-gradient(0deg, rgba(16,12,9,${k}) 0%, rgba(16,12,9,${k * 0.5}) 45%, transparent 75%)` : `linear-gradient(${side === "left" ? 90 : 270}deg, rgba(16,12,9,${k}) 0%, rgba(16,12,9,${k * 0.6}) 45%, transparent 78%)`;
  return <AbsoluteFill>{bg ? <Photo src={bg} seed={seed} dur={dur} /> : <AbsoluteFill style={{ background: "linear-gradient(160deg,#3A2C20,#1C150F)" }} />}<AbsoluteFill style={{ background: g }} /></AbsoluteFill>;
};
const Kick: React.FC<{ txt: string; color?: string; style?: React.CSSProperties }> = ({ txt, color = N.narL, style }) => <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, letterSpacing: 4, color, textShadow: tsh, ...style }}>{txt}</div>;
const Titulo: React.FC<{ txt: string; size?: number; color?: string; f0?: number; style?: React.CSSProperties }> = ({ txt, size = 92, color = "#FFF8EE", f0 = 0, style }) => {
  const f = useCurrentFrame(); const p = sp(f, f0, 16);
  return <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: size, lineHeight: 1.06, color, textShadow: tsh, opacity: cl(p * 1.5), transform: `translateY(${(1 - p) * 20}px)`, ...style }}>{txt}</div>;
};
const Placa: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; edge?: string }> = ({ children, style, edge = N.nar }) => <div style={{ background: N.noche, borderLeft: `12px solid ${edge}`, padding: "26px 40px 30px", boxShadow: "0 24px 50px rgba(0,0,0,0.55)", ...style }}>{children}</div>;

// ---------- apertura de paso: etiqueta kraft colgada de un hilo, se balancea sobre la foto del paso
export const ChapN: React.FC<{ n: number; total: number; title: string; src: string; dur: number }> = ({ n, total, title, src, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 12); const odd = n % 2 === 1; const base = ((n * 37) % 7) - 3;
  const sw = odd ? Math.sin(f / 9) * 6 * Math.exp(-f / 45) + Math.sin(f / 23) * 1 : 0;
  const card = (
    <div style={{ width: 600, background: odd ? `linear-gradient(170deg, ${N.kraft}, ${N.kraftD})` : `linear-gradient(170deg, ${N.crema}, #EDE3CF)`, borderRadius: odd ? "22px 22px 10px 10px" : 6, padding: "64px 46px 42px", boxShadow: "0 30px 60px rgba(0,0,0,0.55)", position: "relative" }}>
      {odd ? <div style={{ position: "absolute", left: 280, top: 18, width: 40, height: 40, borderRadius: "50%", background: "#2B2118", boxShadow: "inset 0 0 0 7px #E9DCC2" }} />
        : [[-30, -14, -8], [470, -14, 9]].map(([x, y, r], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 160, height: 46, background: "rgba(236,226,196,0.82)", transform: `rotate(${r}deg)`, boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />)}
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 48, letterSpacing: 5, color: N.ink }}>PASO <span style={{ fontSize: 108, color: "#8E3B12", verticalAlign: -14 }}>{n}</span> DE {total}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: title.length > 26 ? 62 : 72, lineHeight: 1.05, color: N.ink, marginTop: 14 }}>{title}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={src} dur={dur} side="left" k={0.55} />
      {odd ? (
        <div style={{ position: "absolute", left: 470, top: -40, width: 4, height: 230, background: "#E9DCC2", transformOrigin: "50% 0", transform: `rotate(${sw}deg)` }}>
          <div style={{ position: "absolute", left: -298, top: 214, transform: `translateY(${(1 - p) * -300}px) rotate(${base * 0.4}deg)`, transformOrigin: "300px 0" }}>{card}</div>
        </div>
      ) : (
        <div style={{ position: "absolute", left: 190, top: 170, transform: `translateY(${(1 - p) * -120}px) rotate(${base * 0.6 + (1 - p) * -6}deg) scale(${0.9 + 0.1 * p})`, opacity: cl(p * 2) }}>{card}</div>
      )}
    </AbsoluteFill>
  );
};

// ---------- índice: estante de frascos; cada frasco tiene su número y la hilera se recorre con un brillo
export const IdxN: React.FC<{ head: string; items: { n: number; t: string }[]; dur: number }> = ({ head, items, dur }) => {
  const f = useCurrentFrame(); const k = Math.floor(interpolate(f, [6, Math.max(60, dur - 20)], [0, 12], CL));
  const row = (a: number) => (
    <div style={{ display: "flex", gap: 22, justifyContent: "center", position: "relative" }}>
      {items.slice(a, a + 6).map((it, j) => { const i = a + j; const on = i === k || i === k - 1; const p = sp(f, j * 2, 14);
        return <div key={i} style={{ width: 268, opacity: cl(p * 1.6), transform: `translateY(${(1 - p) * 30}px)` }}>
          <div style={{ height: 210, borderRadius: "26px 26px 18px 18px", position: "relative", background: on ? "linear-gradient(180deg, rgba(255,255,255,0.35), rgba(232,129,42,0.95) 30%, #B8661C)" : "linear-gradient(180deg, rgba(255,255,255,0.25), rgba(232,129,42,0.6) 30%, rgba(150,80,24,0.7))", boxShadow: on ? "0 0 0 6px #F5B25C, 0 18px 30px rgba(0,0,0,0.5)" : "0 18px 30px rgba(0,0,0,0.5)" }}>
            <div style={{ position: "absolute", left: 18, right: 18, top: -26, height: 34, borderRadius: 8, background: "#6E6A63" }} />
            <div style={{ position: "absolute", left: 22, right: 22, top: 56, bottom: 22, background: N.crema, borderRadius: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 6 }}>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 58, color: "#8E3B12", lineHeight: 1 }}>{it.n}</div>
              <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 30, color: N.ink, textAlign: "center", lineHeight: 1.05 }}>{it.t}</div>
            </div>
          </div>
        </div>; })}
      <div style={{ position: "absolute", left: -20, right: -20, bottom: -30, height: 26, background: "linear-gradient(180deg,#8A5A32,#5E3B1E)", boxShadow: "0 14px 24px rgba(0,0,0,0.6)" }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "radial-gradient(ellipse at 50% 30%, #F1E8D8, #CDBFA6)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 52, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 52, letterSpacing: 6, color: N.ink }}>{head}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 210 }}>{row(0)}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 610 }}>{row(6)}</div>
    </AbsoluteFill>
  );
};

// ---------- repaso: mosaico de las 12 fotos de los pasos; la del paso que se nombra se enciende y su título sube abajo
export const RepasoN: React.FC<{ cards: { n: number; t: string; src: string; f: number }[]; dur: number }> = ({ cards, dur }) => {
  const f = useCurrentFrame(); let a = 0; cards.forEach((c, i) => { if (f >= c.f) a = i; }); const cur = cards[a]; const pa = sp(f, cur.f, 14);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "#17120D" }}>
      <div style={{ position: "absolute", left: 60, right: 60, top: 40, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
        {cards.map((c, i) => { const on = i === a; const done = f >= c.f;
          return <div key={i} style={{ height: 300, position: "relative", overflow: "hidden", outline: on ? `8px solid ${N.nar}` : "none", opacity: done ? 1 : 0.45, transform: `scale(${on ? 1 + 0.04 * pa : 1})`, zIndex: on ? 2 : 1 }}>
            <Pic src={c.src} style={{ filter: done ? "none" : "grayscale(1) brightness(0.6)" }} />
            <div style={{ position: "absolute", left: 0, top: 0, background: on ? N.nar : "rgba(16,12,9,0.85)", color: "#FFF8EE", fontFamily: SANS, fontWeight: 600, fontSize: 52, padding: "2px 18px" }}>{c.n}</div>
          </div>; })}
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 50, height: 150, background: N.crema, display: "flex", alignItems: "center", padding: "0 44px", boxShadow: "0 -10px 30px rgba(0,0,0,0.4)" }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 96, color: N.nar, width: 150 }}>{cur.n}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 80, color: N.ink, opacity: cl(pa * 1.5), transform: `translateY(${(1 - pa) * 30}px)` }}>{cur.t}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- precio: etiqueta de góndola pegada torcida sobre la foto
export const PrecioN: React.FC<{ big: string; top: string; sub: string; bg?: string; dur: number }> = ({ big, top, sub, bg, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 10); const r = interpolate(p, [0, 1], [-14, -5]);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="right" k={0.5} />
      <div style={{ position: "absolute", right: 150, top: 250, width: 720, transform: `rotate(${r}deg) scale(${0.85 + 0.15 * p})`, boxShadow: "0 30px 60px rgba(0,0,0,0.55)" }}>
        <div style={{ background: "#F6D23A", padding: "22px 40px", fontFamily: SANS, fontWeight: 600, fontSize: 52, letterSpacing: 3, color: N.ink }}>{top}</div>
        <div style={{ background: "#FFFDF6", padding: "10px 40px 30px", borderBottom: "14px solid #D23F2E" }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 210, lineHeight: 1, color: N.ink }}>{big}</div>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 50, color: "#4A3A2A" }}>{sub}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- premio: ficha de recetario con una esquina de cinta roja «AL FINAL» (teaser) o la ficha del gel (final)
export const PremioN: React.FC<{ teaser?: boolean; title: string; sub: string; bg?: string; dur: number }> = ({ teaser, title, sub, bg, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 13); const lift = Math.sin(f / 18) * 6;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="left" k={0.6} />
      <div style={{ position: "absolute", left: 120, top: 220 + lift, width: 860, transform: `rotate(-2deg) translateX(${(1 - p) * -300}px)`, background: N.crema, padding: "44px 54px 54px", boxShadow: "0 30px 60px rgba(0,0,0,0.6)", borderTop: `16px solid ${N.no}`, overflow: "hidden" }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 50, letterSpacing: 5, color: N.no }}>{sub}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 96, lineHeight: 1.04, color: N.ink, marginTop: 12 }}>{title}</div>
        {teaser ? <div style={{ position: "absolute", right: -92, top: 46, width: 380, transform: "rotate(38deg)", background: N.no, color: "#FFF", textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 3, padding: "8px 0" }}>AL FINAL</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- notas en la puerta de la heladera: cada nota con su imán; la que se dice se acerca y se ilumina
export const NotasN: React.FC<{ head: string; items: { txt: string; f: number }[]; dur: number }> = ({ head, items, dur }) => {
  const f = useCurrentFrame(); let a = -1; items.forEach((it, i) => { if (f >= it.f) a = i; });
  const cols = items.length > 4 ? 3 : 2; const COL = ["#F7E37A", "#F9C6B2", "#BFE3C9", "#BFD8F2", "#F7E37A", "#F9C6B2"];
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(90deg, #E9ECEC, #F8F9F8 40%, #E2E5E5)" }}>
      <div style={{ position: "absolute", right: 70, top: 160, width: 34, height: 760, borderRadius: 17, background: "linear-gradient(90deg,#B9BEC0,#F2F4F4,#A7ACAE)" }} />
      <div style={{ position: "absolute", left: 90, top: 48, fontFamily: SANS, fontWeight: 600, fontSize: 54, letterSpacing: 5, color: "#34404A" }}>{head}</div>
      <div style={{ position: "absolute", left: 90, right: 160, top: 150, display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 40 }}>
        {items.map((it, i) => { const on = i === a; const p = sp(f, i * 2, 14); const tilt = ((i * 37) % 7) - 3;
          return <div key={i} style={{ position: "relative", minHeight: 300, background: COL[i % 6], padding: "64px 34px 30px", boxShadow: on ? "0 30px 50px rgba(0,0,0,0.35)" : "0 10px 18px rgba(0,0,0,0.18)", transform: `rotate(${on ? 0 : tilt}deg) scale(${on ? 1.06 : 0.97}) translateY(${(1 - p) * 40}px)`, opacity: cl(p * 1.6) * (a >= 0 && !on ? 0.72 : 1), zIndex: on ? 3 : 1 }}>
            <div style={{ position: "absolute", left: "50%", top: 14, width: 54, height: 54, marginLeft: -27, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #FF8A5C, #C6421B)", boxShadow: "0 6px 10px rgba(0,0,0,0.35)" }} />
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, lineHeight: 1.12, color: "#2B2B33" }}>{it.txt}</div>
          </div>; })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- una sola nota de la heladera, grande: pregunta y respuesta corta
export const NotaN: React.FC<{ q: string; a: string; bg?: string; dur: number }> = ({ q, a, bg, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 12); const pa = sp(f, 18, 14);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="right" k={0.45} />
      <div style={{ position: "absolute", left: 130, top: 150, width: 900, minHeight: 640, background: "#F7E37A", padding: "100px 60px 50px", transform: `rotate(-2deg) translateY(${(1 - p) * 60}px)`, opacity: cl(p * 1.6), boxShadow: "0 40px 70px rgba(0,0,0,0.55)" }}>
        <div style={{ position: "absolute", left: "50%", top: 24, width: 70, height: 70, marginLeft: -35, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #FF8A5C, #C6421B)", boxShadow: "0 8px 12px rgba(0,0,0,0.35)" }} />
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 70, lineHeight: 1.1, color: "#2B2B33" }}>{q}</div>
        <div style={{ marginTop: 34, borderTop: "4px dashed rgba(43,43,51,0.35)", paddingTop: 26, fontFamily: SERIF, fontWeight: 700, fontSize: 64, lineHeight: 1.1, color: "#8E3B12", opacity: cl(pa * 1.5) }}>{a}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- foto vieja metida en la funda transparente de un recetario, con el pie en cinta de papel y el año grande
export const FundaN: React.FC<{ src: string; year: string; caption: string; dur: number }> = ({ src, year, caption, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 14); const gl = interpolate(f % 90, [0, 90], [-40, 140]);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(135deg,#5B3E26,#2E2015)" }}>
      <div style={{ position: "absolute", left: 120, top: 70, width: 1180, height: 760, background: "#EEE6D2", padding: 34, boxShadow: "0 40px 70px rgba(0,0,0,0.6)", transform: `rotate(-1.2deg) translateY(${(1 - p) * 50}px)` }}>
        <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
          <Pic src={src} style={{ filter: "sepia(0.18) saturate(0.9)" }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${gl - 20}%, rgba(255,255,255,0.22) ${gl}%, transparent ${gl + 12}%)` }} />
          <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 0 3px rgba(255,255,255,0.5)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", right: 80, top: 120, fontFamily: SERIF, fontWeight: 700, fontSize: 180, color: N.narL, textShadow: tsh, opacity: cl(p * 1.5) }}>{year}</div>
      <div style={{ position: "absolute", left: 1330, top: 380, width: 520, background: "rgba(240,226,190,0.95)", padding: "22px 30px", transform: "rotate(2deg)", fontFamily: HAND, fontWeight: 700, fontSize: 52, lineHeight: 1.1, color: N.ink, boxShadow: "0 12px 24px rgba(0,0,0,0.4)" }}>{caption}</div>
    </AbsoluteFill>
  );
};

// ---------- dos trabajadores: dos medallones de foto con aro, un «+» y lo que ataca cada uno
export const DosN: React.FC<{ a: { src: string; t: string; v: string }; b: { src: string; t: string; v: string }; dur: number }> = ({ a, b, dur }) => {
  const f = useCurrentFrame(); const pb = sp(f, 10, 13); const pa = sp(f, 0, 13); const rot = f * 0.15;
  const Med = ({ x, it, p }: { x: number; it: { src: string; t: string; v: string }; p: number }) => (
    <div style={{ position: "absolute", left: x, top: 120, width: 600, textAlign: "center", opacity: cl(p * 1.6), transform: `scale(${0.8 + 0.2 * p})` }}>
      <div style={{ width: 460, height: 460, margin: "0 auto", borderRadius: "50%", overflow: "hidden", border: `14px solid ${N.crema}`, boxShadow: `0 0 0 8px ${N.nar}, 0 30px 50px rgba(0,0,0,0.6)` }}><Pic src={it.src} style={{ transform: `scale(1.15) rotate(${rot}deg)` }} /></div>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 84, color: "#FFF8EE", marginTop: 26, textShadow: tsh }}>{it.t}</div>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 54, color: N.narL, marginTop: 4, textShadow: tsh }}>{it.v}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "radial-gradient(ellipse at 50% 40%, #3E2D1F, #160F0A)" }}>
      <Med x={210} it={a} p={pa} /><Med x={1110} it={b} p={pb} />
      <div style={{ position: "absolute", left: 900, top: 290, width: 120, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 150, color: N.narL, opacity: cl(pb * 1.5) }}>+</div>
    </AbsoluteFill>
  );
};

// ---------- etiqueta impresa grande pegada sobre la foto (vinagre 5 %, no se toma, fecha, cuánto dura, marcador)
export const RotuloN: React.FC<{ top: string; big: string; sub?: string; hand?: boolean; red?: boolean; bg?: string; dur: number }> = ({ top, big, sub, hand, red, bg, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 12); const peel = interpolate(p, [0, 1], [18, 0]);
  const c = red ? N.no : N.nar;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="all" k={0.55} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 1100, transform: `translate(-50%,-50%) perspective(1600px) rotateY(${peel}deg) rotate(-1.5deg)`, background: "#FFFDF7", borderRadius: 18, padding: "40px 60px 46px", boxShadow: "0 40px 70px rgba(0,0,0,0.6)", border: `10px solid ${c}`, opacity: cl(p * 1.6) }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 52, letterSpacing: 6, color: c }}>{top}</div>
        <div style={{ fontFamily: hand ? HAND : SERIF, fontWeight: 700, fontSize: big.length > 14 ? 104 : 150, lineHeight: 1.02, color: N.ink, marginTop: 8 }}>{big}</div>
        {sub ? <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 52, color: "#4A3A2A", marginTop: 14 }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- burbujas que suben de la costra: el ácido se come el sarro
export const BurbN: React.FC<{ title: string; sub: string; bg?: string; dur: number }> = ({ title, sub, bg, dur }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="left" k={0.75} />
      {Array.from({ length: 34 }).map((_, i) => { const x = 1000 + ((i * 263) % 820); const sz = 14 + ((i * 17) % 34); const sp0 = 2.2 + ((i * 7) % 5) * 0.7; const y = 1120 - ((f * sp0 + i * 97) % 1250); const wob = Math.sin((f + i * 11) / 8) * 10;
        return <div key={i} style={{ position: "absolute", left: x + wob, top: y, width: sz, height: sz, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.85)", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.7), rgba(255,255,255,0.08) 60%)" }} />; })}
      <div style={{ position: "absolute", left: 110, top: 300, width: 800 }}>
        <Kick txt={sub} />
        <Titulo txt={title} size={96} style={{ marginTop: 14 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- media naranja cortada vista de frente: los gajos se encienden uno por uno hasta el porcentaje (limoneno)
export const GajosN: React.FC<{ pct: string; v: number; title: string; sub: string; bg?: string; dur: number }> = ({ pct, v, title, sub, bg, dur }) => {
  const f = useCurrentFrame(); const NG = 12; const lit = interpolate(f, [2, 34], [0, v * NG], { ...CL, easing: ease }); const rot = f * 0.12;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="right" k={0.82} />
      <div style={{ position: "absolute", left: 170, top: 180, width: 720, height: 720, borderRadius: "50%", background: "radial-gradient(circle, #FFF3D6 0 60%, #F08A1E 61% 100%)", boxShadow: "0 40px 70px rgba(0,0,0,0.6)", transform: `rotate(${rot}deg)` }}>
        {Array.from({ length: NG }).map((_, i) => { const on = cl(lit - i); return <div key={i} style={{ position: "absolute", left: 360, top: 360, width: 0, height: 0, transform: `rotate(${i * 30}deg)` }}>
          <div style={{ position: "absolute", left: -78, top: -320, width: 156, height: 290, borderRadius: "50% 50% 12% 12% / 30% 30% 12% 12%", background: on > 0.01 ? `rgba(245,${Math.round(150 - 30 * on)},40,${0.35 + 0.65 * on})` : "rgba(245,200,140,0.35)", boxShadow: on > 0.5 ? "inset 0 0 0 4px rgba(255,236,170,0.9)" : "none" }} />
        </div>; })}
        <div style={{ position: "absolute", left: 330, top: 330, width: 60, height: 60, borderRadius: "50%", background: "#FFF3D6" }} />
      </div>
      <div style={{ position: "absolute", left: 980, top: 240, width: 860 }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 220, lineHeight: 1, color: N.narL, textShadow: tsh }}>{pct}</div>
        <Titulo txt={title} size={90} style={{ marginTop: 10 }} />
        <Kick txt={sub} style={{ marginTop: 18 }} color="#EFE3CF" />
      </div>
    </AbsoluteFill>
  );
};

// ---------- vaso con dos capas que no se mezclan (agua abajo, aceite arriba) y el aceite que ondula encima
export const CapasN: React.FC<{ title: string; sub: string; dur: number }> = ({ title, sub, dur }) => {
  const f = useCurrentFrame(); const w = Math.sin(f / 7) * 8; const p = sp(f, 0, 14);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "radial-gradient(ellipse at 30% 50%, #4A3727, #160F0A)" }}>
      <div style={{ position: "absolute", left: 230, top: 160, width: 480, height: 760, border: "12px solid rgba(255,255,255,0.8)", borderTop: "none", borderRadius: "0 0 40px 40px", overflow: "hidden", transform: `translateY(${(1 - p) * 40}px)` }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "58%", background: "linear-gradient(180deg, rgba(190,225,240,0.75), rgba(150,200,225,0.85))" }} />
        <div style={{ position: "absolute", left: -30, right: -30, bottom: "56%", height: "22%", borderRadius: `${50 + w}% ${50 - w}% 0 0`, background: "linear-gradient(180deg, #FFCB6B, #E89A2A)" }} />
        {Array.from({ length: 7 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 40 + i * 60, bottom: `${57 + Math.sin((f + i * 20) / 10) * 1.5}%`, width: 26, height: 26, borderRadius: "50%", background: "rgba(255,230,160,0.95)" }} />)}
      </div>
      <div style={{ position: "absolute", left: 230, top: 200, width: 480, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 48, color: N.ink }}>aceite</div>
      <div style={{ position: "absolute", left: 230, top: 760, width: 480, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 48, color: "#1D3F55" }}>agua</div>
      <div style={{ position: "absolute", left: 860, top: 330, width: 950 }}>
        <Titulo txt={title} size={100} />
        <Kick txt={sub} style={{ marginTop: 22 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- contraetiqueta: «LIMPIA» con tilde verde, «DESINFECTA» con raya roja que la tacha
export const DorsoN: React.FC<{ yes: string; no: string; note: string; bg?: string; dur: number }> = ({ yes, no, note, bg, dur }) => {
  const f = useCurrentFrame(); const st = interpolate(f, [14, 30], [0, 100], { ...CL, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="left" k={0.8} />
      <div style={{ position: "absolute", left: 120, top: 210, width: 920 }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 130, color: "#FFF8EE", textShadow: tsh }}><span style={{ color: N.ok }}>✓ </span>{yes}</div>
        <div style={{ position: "relative", display: "inline-block", fontFamily: SANS, fontWeight: 600, fontSize: 130, color: "#D9CFC2", textShadow: tsh, marginTop: 10 }}><span style={{ color: N.no }}>✕ </span>{no}
          <div style={{ position: "absolute", left: 0, top: "52%", height: 16, width: `${st}%`, background: N.no, borderRadius: 8 }} /></div>
        <Placa style={{ marginTop: 40, width: 860 }}><div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 56, color: "#FFF8EE", lineHeight: 1.1 }}>{note}</div></Placa>
      </div>
    </AbsoluteFill>
  );
};

// ---------- corte de la cáscara: banda de color con bolsitas de aceite y el albedo blanco esponjoso debajo
export const CascaraN: React.FC<{ a: string; b: string; bg?: string; dur: number }> = ({ a, b, bg, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 14); const glow = 0.55 + 0.45 * Math.sin(f / 8);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="all" k={0.85} />
      <div style={{ position: "absolute", left: 160, top: 260, width: 1000, height: 460, borderRadius: "40px 40px 60px 60px", overflow: "hidden", transform: `scale(${0.9 + 0.1 * p})`, boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}>
        <div style={{ height: 120, background: "linear-gradient(180deg, #F59A2C, #E8812A)", position: "relative" }}>
          {Array.from({ length: 16 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 30 + i * 61, top: 30 + (i % 3) * 18, width: 30, height: 30, borderRadius: "50%", background: `rgba(255,236,150,${glow})`, boxShadow: `0 0 ${10 * glow}px rgba(255,220,120,0.9)` }} />)}
        </div>
        <div style={{ height: 340, background: "radial-gradient(circle at 20% 30%, #FFFDF4 0 6px, transparent 7px) 0 0 / 46px 40px, radial-gradient(circle at 70% 70%, #EFE6D0 0 9px, transparent 10px) 0 0 / 58px 52px, #F8F0DE" }} />
      </div>
      <div style={{ position: "absolute", left: 1210, top: 270, width: 640 }}>
        <div style={{ borderLeft: `10px solid ${N.nar}`, paddingLeft: 26 }}><div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 70, color: "#FFF8EE", textShadow: tsh, lineHeight: 1.05 }}>{a}</div></div>
        <div style={{ borderLeft: "10px solid #F8F0DE", paddingLeft: 26, marginTop: 150, opacity: cl(sp(f, 10, 14) * 1.5) }}><div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 70, color: "#FFF8EE", textShadow: tsh, lineHeight: 1.05 }}>{b}</div></div>
      </div>
      <div style={{ position: "absolute", left: 1160, top: 320, width: 50, height: 6, background: N.nar }} />
      <div style={{ position: "absolute", left: 1160, top: 560, width: 50, height: 6, background: "#F8F0DE" }} />
    </AbsoluteFill>
  );
};

// ---------- contador de horas tipo reloj de estación (24 h al aire)
export const HorasN: React.FC<{ n: number; unit: string; sub: string; bg?: string; dur: number }> = ({ n, unit, sub, bg, dur }) => {
  const f = useCurrentFrame(); const v = Math.round(interpolate(f, [0, Math.min(40, dur - 20)], [0, n], { ...CL, easing: ease }));
  const D = String(v).padStart(2, "0").split("");
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="right" k={0.75} />
      <div style={{ position: "absolute", right: 140, top: 230, display: "flex", gap: 18 }}>
        {D.map((d, i) => <div key={i} style={{ width: 230, height: 330, background: "linear-gradient(180deg,#2B2622 50%,#1E1A17 50%)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 600, fontSize: 260, color: "#F4E9D6", boxShadow: "0 24px 40px rgba(0,0,0,0.6)", position: "relative" }}>{d}<div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 4, background: "#000" }} /></div>)}
        <div style={{ alignSelf: "flex-end", fontFamily: SANS, fontWeight: 600, fontSize: 120, color: N.narL, textShadow: tsh, marginLeft: 10 }}>{unit}</div>
      </div>
      <div style={{ position: "absolute", right: 140, top: 620, width: 900, textAlign: "right" }}><Titulo txt={sub} size={74} /></div>
    </AbsoluteFill>
  );
};

// ---------- naranjas que caen en fila y una cuenta: un frasco = 4 o 5 naranjas
export const NaranjasN: React.FC<{ k: number; title: string; sub: string; dur: number }> = ({ k, title, sub, dur }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#EFE5D3 0 70%, #B9875A 70%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}><Titulo txt={title} size={100} color={N.ink} style={{ textShadow: "none" }} /><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 54, color: "#8E3B12", marginTop: 10 }}>{sub}</div></div>
      {Array.from({ length: k }).map((_, i) => { const p = sp(f, i * 4, 9); const y = interpolate(p, [0, 1], [-300, 0]); const sq = 1 + (1 - Math.min(1, p)) * 0;
        return <div key={i} style={{ position: "absolute", left: 960 - (k * 260) / 2 + i * 260 + 15, top: 520 + y, width: 230, height: 230 * sq, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #FFC36A, #F08A1E 45%, #C45F0E)", boxShadow: "0 26px 30px rgba(60,30,10,0.45), inset -10px -14px 0 rgba(150,60,0,0.25)" }}>
          <div style={{ position: "absolute", left: 100, top: -14, width: 26, height: 30, borderRadius: "50% 50% 40% 40%", background: "#4C7A2E" }} />
        </div>; })}
    </AbsoluteFill>
  );
};

// ---------- frasco de vidrio dibujado: brillo que recorre el vidrio; modo «flota» marca la cáscara que asoma
export const FrascoN: React.FC<{ mode: "vidrio" | "flota"; title: string; sub: string; dur: number }> = ({ mode, title, sub, dur }) => {
  const f = useCurrentFrame(); const gl = interpolate(f % 70, [0, 70], [-30, 130]); const bob = Math.sin(f / 10) * 8; const ring = 0.6 + 0.4 * Math.sin(f / 5);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "radial-gradient(ellipse at 30% 50%, #463424, #140E09)" }}>
      <div style={{ position: "absolute", left: 230, top: 150, width: 560, height: 780 }}>
        <div style={{ position: "absolute", left: 60, right: 60, top: 0, height: 70, borderRadius: 14, background: "linear-gradient(180deg,#A8A39A,#6E6A63)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 60, bottom: 0, borderRadius: "70px 70px 60px 60px", border: "10px solid rgba(255,255,255,0.75)", overflow: "hidden", background: "rgba(255,255,255,0.06)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: mode === "flota" ? "72%" : "82%", background: "linear-gradient(180deg, rgba(240,220,170,0.55), rgba(232,170,80,0.7))" }} />
          {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 50 + (i % 3) * 140, bottom: 40 + Math.floor(i / 3) * 140, width: 120, height: 60, borderRadius: "60px 60px 20px 20px", background: "#E8812A", transform: `rotate(${(i * 47) % 60 - 30}deg)` }} />)}
          {mode === "flota" ? <div style={{ position: "absolute", left: 200, bottom: `${72 + 2}%`, width: 140, height: 64, borderRadius: "60px 60px 20px 20px", background: "#E8812A", transform: `translateY(${bob}px) rotate(-12deg)`, boxShadow: `0 0 0 10px rgba(210,63,46,${ring})` }} /> : null}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(110deg, transparent ${gl - 15}%, rgba(255,255,255,0.35) ${gl}%, transparent ${gl + 10}%)` }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 900, top: 320, width: 920 }}>
        <Titulo txt={title} size={100} />
        <Kick txt={sub} style={{ marginTop: 22 }} color={mode === "flota" ? "#FF8B7A" : N.narL} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- calendario de taco: las hojas vuelan una por una hasta el día 14
export const TacoN: React.FC<{ from: number; to: number; title: string; sub: string; bg?: string; dur: number }> = ({ from, to, title, sub, bg, dur }) => {
  const f = useCurrentFrame(); const t = interpolate(f, [4, Math.min(56, dur - 30)], [from, to], CL); const day = Math.floor(t); const fr = t - day;
  const Hoja = ({ d, y, r, o }: { d: number; y: number; r: number; o: number }) => (
    <div style={{ position: "absolute", left: 0, top: 0, width: 520, height: 560, background: "#FFFDF8", borderTop: "70px solid #D23F2E", boxShadow: "0 10px 20px rgba(0,0,0,0.25)", transform: `translateY(${y}px) rotate(${r}deg)`, opacity: o, transformOrigin: "50% 0", textAlign: "center" }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 60, color: "#4A3A2A", marginTop: 26 }}>DÍA</div>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 300, lineHeight: 1, color: N.ink }}>{d}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="left" k={0.8} />
      <div style={{ position: "absolute", left: 1260, top: 200, width: 520, height: 600 }}>
        <Hoja d={Math.min(to, day + 1)} y={0} r={0} o={1} />
        {day < to ? <Hoja d={day} y={-fr * 500} r={-fr * 30} o={1 - fr} /> : null}
      </div>
      <div style={{ position: "absolute", left: 110, top: 330, width: 1050 }}>
        <Titulo txt={title} size={100} />
        <Kick txt={sub} style={{ marginTop: 20 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- dos fotos del frasco, día 1 y día 14, con la tira de color que va de transparente a ámbar
export const ColorN: React.FC<{ a: string; b: string; la: string; lb: string; dur: number }> = ({ a, b, la, lb, dur }) => {
  const f = useCurrentFrame(); const pb = sp(f, 10, 14); const w = interpolate(f, [6, 40], [0, 100], { ...CL, easing: ease });
  const Card = ({ src, l, x, p }: { src: string; l: string; x: number; p: number }) => (
    <div style={{ position: "absolute", left: x, top: 80, width: 780, opacity: cl(p * 1.6), transform: `translateY(${(1 - p) * 40}px)` }}>
      <div style={{ height: 620, overflow: "hidden", border: `12px solid ${N.crema}`, boxShadow: "0 30px 50px rgba(0,0,0,0.55)" }}><Pic src={src} /></div>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 70, color: "#FFF8EE", textShadow: tsh, marginTop: 14 }}>{l}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#2A1F16,#120D09)" }}>
      <Card src={a} l={la} x={150} p={1} /><Card src={b} l={lb} x={990} p={pb} />
      <div style={{ position: "absolute", left: 150, right: 150, bottom: 50, height: 46, borderRadius: 23, background: "linear-gradient(90deg, rgba(240,240,235,0.9), #F3D46A 50%, #B8661C)", clipPath: `inset(0 ${100 - w}% 0 0 round 23px)` }} />
    </AbsoluteFill>
  );
};

// ---------- moho: la foto con un marco rojo que late y la regla en una placa
export const MohoN: React.FC<{ src: string; title: string; sub: string; dur: number }> = ({ src, title, sub, dur }) => {
  const f = useCurrentFrame(); const b = 10 + 6 * (0.5 + 0.5 * Math.sin(f / 6));
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "#120D09" }}>
      <div style={{ position: "absolute", left: 90, top: 90, width: 1060, height: 900, overflow: "hidden", boxShadow: `0 0 0 ${b}px ${N.no}` }}><Photo src={src} seed={9} dur={dur} /></div>
      <div style={{ position: "absolute", left: 1220, top: 260, width: 620 }}>
        <Titulo txt={title} size={88} />
        <Placa edge={N.no} style={{ marginTop: 30 }}><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 56, color: "#FF9A8A", lineHeight: 1.12 }}>{sub}</div></Placa>
      </div>
    </AbsoluteFill>
  );
};

// ---------- NUNCA CON LEJÍA: franja de peligro que corre arriba y abajo, y los nombres de la lejía que se van sumando
export const LejiaN: React.FC<{ title: string; names: { t: string; f: number }[]; bg?: string; dur: number }> = ({ title, names, bg, dur }) => {
  const f = useCurrentFrame(); const mv = (f * 3) % 120; const p = sp(f, 0, 9);
  const band = (top: number) => <div style={{ position: "absolute", left: 0, right: 0, top, height: 70, background: `repeating-linear-gradient(-45deg, #F2C230 0 60px, #1A1612 60px 120px)`, backgroundPosition: `${mv}px 0` }} />;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="all" k={0.9} />
      {band(0)}{band(1010)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 220, textAlign: "center", transform: `scale(${1.25 - 0.25 * p})` }}><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 170, color: "#FF5A44", textShadow: tsh, letterSpacing: 4 }}>{title}</div></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center", gap: 40 }}>
        {names.map((n, i) => { const q = sp(f, n.f, 13); return <div key={i} style={{ background: N.noche, border: "4px solid #FF5A44", padding: "16px 34px", fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: "#FFF8EE", opacity: cl(q * 1.5), transform: `translateY(${(1 - q) * 30}px)` }}>{n.t}</div>; })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- dos botellas separadas por un «≠»: no se guardan juntas
export const SeparaN: React.FC<{ a: string; b: string; title: string; sub: string; dur: number }> = ({ a, b, title, sub, dur }) => {
  const f = useCurrentFrame(); const gap = interpolate(f, [0, 24], [0, 120], { ...CL, easing: ease });
  const Bot = ({ l, c, x }: { l: string; c: string; x: number }) => (
    <div style={{ position: "absolute", left: x, top: 230, width: 300, height: 620 }}>
      <div style={{ position: "absolute", left: 105, top: 0, width: 90, height: 120, background: "#EDEDEA", borderRadius: "16px 16px 6px 6px" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, bottom: 0, borderRadius: "60px 60px 30px 30px", background: c, boxShadow: "0 30px 40px rgba(0,0,0,0.5)" }}>
        <div style={{ position: "absolute", left: 22, right: 22, top: 170, background: N.crema, padding: "18px 10px", textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 44, color: N.ink, lineHeight: 1.1 }}>{l}</div>
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "radial-gradient(ellipse at 30% 50%, #45392F, #15100C)" }}>
      <Bot l={a} c="linear-gradient(180deg,#F0A04A,#B8661C)" x={300 - gap} /><Bot l={b} c="linear-gradient(180deg,#E6F0F6,#9FC2D6)" x={700 + gap} />
      <div style={{ position: "absolute", left: 610, top: 440, width: 200, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 180, color: "#FF5A44", opacity: cl(gap / 120) }}>≠</div>
      <div style={{ position: "absolute", left: 1220, top: 330, width: 620 }}><Titulo txt={title} size={88} /><Kick txt={sub} style={{ marginTop: 20 }} /></div>
    </AbsoluteFill>
  );
};

// ---------- tres pulverizadores con su nivel; se enciende el que se nombra
export const PulveN: React.FC<{ items: { t: string; v: string; lvl: number; c: string; f: number }[]; dur: number }> = ({ items, dur }) => {
  const f = useCurrentFrame(); let a = 0; items.forEach((it, i) => { if (f >= it.f) a = i; });
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#F3EADB 0 72%, #C9A574 72%)" }}>
      {items.map((it, i) => { const on = i === a; const x = 170 + i * 560; const p = sp(f, i * 3, 14); const lv = interpolate(f, [it.f, it.f + 20], [0.05, it.lvl], CL);
        return <div key={i} style={{ position: "absolute", left: x, top: 60, width: 460, opacity: cl(p * 1.6) * (on ? 1 : 0.55), transform: `scale(${on ? 1.04 : 0.96})` }}>
          <div style={{ position: "relative", height: 560 }}>
            <div style={{ position: "absolute", left: 160, top: 0, width: 190, height: 110, background: "#3B3B3B", borderRadius: "20px 40px 10px 10px" }} />
            <div style={{ position: "absolute", left: 300, top: 30, width: 110, height: 40, background: "#3B3B3B", borderRadius: 8 }} />
            <div style={{ position: "absolute", left: 130, top: 100, width: 250, height: 460, borderRadius: "40px 40px 30px 30px", border: "8px solid rgba(255,255,255,0.95)", background: "rgba(255,255,255,0.35)", overflow: "hidden", boxShadow: on ? `0 0 0 8px ${N.nar}, 0 30px 40px rgba(0,0,0,0.35)` : "0 20px 30px rgba(0,0,0,0.25)" }}>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lv * 100}%`, background: it.c }} />
            </div>
          </div>
          <div style={{ marginTop: 30, background: on ? N.ink : "rgba(42,29,18,0.85)", padding: "18px 24px", textAlign: "center" }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 48, color: N.narL, letterSpacing: 2 }}>{it.t}</div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 56, color: "#FFF8EE", lineHeight: 1.05 }}>{it.v}</div>
          </div>
        </div>; })}
    </AbsoluteFill>
  );
};

// ---------- dónde sí / dónde no: dos columnas de azulejo verde y rojo
export const SinoN: React.FC<{ yes: string[]; no: string[]; dur: number }> = ({ yes, no, dur }) => {
  const f = useCurrentFrame();
  const Col = ({ head, it, c, x, d }: { head: string; it: string[]; c: string; x: number; d: number }) => (
    <div style={{ position: "absolute", left: x, top: 70, width: 790 }}>
      <div style={{ background: c, color: "#FFF", fontFamily: SANS, fontWeight: 600, fontSize: 64, letterSpacing: 4, padding: "14px 30px" }}>{head}</div>
      {it.map((t, i) => { const p = sp(f, d + i * 3, 15); return <div key={i} style={{ background: i % 2 ? "#FFFDF6" : "#F4EEE2", borderLeft: `14px solid ${c}`, padding: "16px 30px", fontFamily: SERIF, fontWeight: 700, fontSize: 58, color: N.ink, opacity: cl(p * 1.6), transform: `translateX(${(1 - p) * 40}px)` }}>{t}</div>; })}
    </div>
  );
  return <AbsoluteFill style={{ opacity: out(f, dur), background: "repeating-linear-gradient(0deg, #D9D3C8 0 4px, #EEE9E0 4px 160px), #EEE9E0" }}><Col head="DÓNDE SÍ" it={yes} c={N.ok} x={130} d={0} /><Col head="DÓNDE NO" it={no} c={N.no} x={1000} d={6} /></AbsoluteFill>;
};

// ---------- mármol: la luz recorre la piedra y salta los círculos opacos donde cayó el ácido
export const MarmolN: React.FC<{ title: string; sub: string; dur: number }> = ({ title, sub, dur }) => {
  const f = useCurrentFrame(); const g = interpolate(f, [4, 22], [-200, 520], { ...CL, easing: Easing.in(Easing.quad) }); const hit = f >= 22;
  const sp2 = interpolate(f, [22, 90], [0, 1], { ...CL, easing: ease }); const z = interpolate(f, [0, dur], [1.04, 1.16], CL);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: "55% 55%" }}><Pic src="fb14d/g/marmol.png" /></div>
      {!hit ? <div style={{ position: "absolute", left: 930, top: g, width: 46, height: 64, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), rgba(225,215,170,0.55))", boxShadow: "0 6px 10px rgba(0,0,0,0.25)" }} /> : null}
      {hit ? <div style={{ position: "absolute", left: 953 - 260 * sp2, top: 560 - 150 * sp2, width: 520 * sp2, height: 300 * sp2, borderRadius: "48% 52% 44% 56% / 55% 45% 55% 45%", background: "radial-gradient(ellipse at 50% 50%, rgba(232,228,218,0.85), rgba(210,204,192,0.7) 60%, rgba(190,184,172,0.2) 78%, transparent 80%)", filter: "blur(2px)" }} /> : null}
      {hit ? [[-120, -30], [60, -60], [150, 40], [-40, 70], [-180, 50], [100, 90], [10, -10]].map(([x, y], i) => { const b = interpolate(f, [26 + i * 5, 50 + i * 5], [0, 1], CL);
        return <div key={i} style={{ position: "absolute", left: 953 + x * sp2 - 9, top: 560 + y * sp2 - 9, width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.9)", opacity: b * (1 - interpolate(f, [70 + i * 6, 110 + i * 6], [0, 1], CL)), transform: `scale(${0.4 + 0.8 * b})` }} />; }) : null}
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(12,9,6,0.85) 0%, rgba(12,9,6,0.55) 22%, transparent 42%)" }} />
      <div style={{ position: "absolute", left: 120, bottom: 90, width: 1680 }}><Titulo txt={title} size={92} /><Kick txt={sub} style={{ marginTop: 14 }} /></div>
    </AbsoluteFill>
  );
};

// ---------- prueba del rincón: cuatro fichas en fila que se dan vuelta
export const RinconN: React.FC<{ steps: { t: string; f: number }[]; title: string; bg?: string; dur: number }> = ({ steps, title, bg, dur }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="bottom" k={0.92} />
      <div style={{ position: "absolute", left: 120, top: 90 }}><Titulo txt={title} size={96} /></div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 520, display: "flex", gap: 34 }}>
        {steps.map((s, i) => { const r = interpolate(f, [s.f, s.f + 12], [90, 0], { ...CL, easing: ease }); const shown = f >= s.f;
          return <div key={i} style={{ flex: 1, height: 380, perspective: 1200 }}>
            <div style={{ width: "100%", height: "100%", transform: `rotateY(${shown ? r : 0}deg)`, background: shown ? N.crema : "rgba(42,29,18,0.92)", border: `6px solid ${N.nar}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, boxShadow: "0 24px 40px rgba(0,0,0,0.5)" }}>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 110, color: shown ? "#8E3B12" : N.narL, lineHeight: 1 }}>{i + 1}</div>
              {shown ? <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 56, color: N.ink, textAlign: "center", lineHeight: 1.05, marginTop: 10 }}>{s.t}</div> : null}
            </div>
          </div>; })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- la lámina: la cámara se acerca a cada zona y se desliza despacio (deriva continua, sin marco)
export const LaminaN: React.FC<{ src: string; focus: { x: number; y: number; z: number; f: number }[]; dur: number }> = ({ src, focus, dur }) => {
  const f = useCurrentFrame(); let a = 0; focus.forEach((z, i) => { if (f >= z.f) a = i; });
  const cur = focus[a]; const prev = focus[Math.max(0, a - 1)]; const t = a === 0 ? 1 : interpolate(f, [cur.f, cur.f + 30], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const cz = (v: number) => 1 + (Math.min(v, 2) - 1) * 0.3;
  const x = prev.x + (cur.x - prev.x) * t + Math.sin(f / 40) * 1.6; const y = prev.y + (cur.y - prev.y) * t + Math.cos(f / 47) * 1.3; const z = cz(prev.z) + (cz(cur.z) - cz(prev.z)) * t + 0.03 * Math.sin(f / 55) + 0.012 * Math.sin(f / 13);
  const dim = 0;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "#F4EFE4", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: `${x}% ${y}%` }}><Pic src={src} fit="contain" /></div>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 34% 30% at ${x}% ${y}%, transparent 60%, rgba(20,14,8,${dim}) 100%)` }} />
    </AbsoluteFill>
  );
};

// ---------- temporizador de cocina: la cuña naranja se achica y el tiempo queda grande al lado
export const TimerN: React.FC<{ big: string; title: string; sub?: string; bg?: string; dur: number }> = ({ big, title, sub, bg, dur }) => {
  const f = useCurrentFrame(); const k = interpolate(f, [0, dur], [0.9, 0.15], CL); const tick = Math.sin(f * 1.2) * 1.5; const p = sp(f, 0, 12);
  const kind = /trapo|Hervir/.test(title) ? "dial" : /Aquí/.test(title) ? "arena" : "digital";
  const right = kind === "arena" || /bolsa/.test(title);
  const mins = parseInt(big) * (/hora/.test(big) ? 60 : 1); const left = Math.max(0, mins * 60 - Math.floor(f / 30) * (mins >= 60 ? 37 : 7));
  const mm = String(Math.floor(left / 60)).padStart(2, "0"); const ss = String(left % 60).padStart(2, "0");
  const objX = right ? 1140 : 170; const txtX = right ? 120 : 900;
  let obj: React.ReactNode;
  if (kind === "dial") obj = (
    <div style={{ position: "absolute", left: objX, top: 200, width: 620, height: 620, borderRadius: "50%", background: "#FAF7F0", boxShadow: "0 40px 70px rgba(0,0,0,0.55), inset 0 -14px 0 rgba(0,0,0,0.08)", transform: `rotate(${tick}deg) scale(${0.85 + 0.15 * p})` }}>
      <div style={{ position: "absolute", inset: 70, borderRadius: "50%", background: `conic-gradient(${N.nar} 0 ${k * 360}deg, #EFE8DA ${k * 360}deg 360deg)` }} />
      <div style={{ position: "absolute", inset: 185, borderRadius: "50%", background: "#FAF7F0" }} />
      <div style={{ position: "absolute", left: 290, top: -40, width: 40, height: 70, background: "#8A8680", borderRadius: 8 }} />
    </div>);
  else if (kind === "digital") obj = (
    <div style={{ position: "absolute", left: objX, top: 300, width: 660, height: 380, borderRadius: 34, background: "linear-gradient(160deg,#3A3A3C,#1C1C1E)", boxShadow: "0 40px 70px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.18)", transform: `translateY(${(1 - p) * 80}px)`, opacity: cl(p * 2) }}>
      <div style={{ position: "absolute", left: 40, top: 40, right: 40, height: 210, borderRadius: 14, background: "#0E1A12", boxShadow: "inset 0 0 30px rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontWeight: 700, fontSize: 170, color: "#7CFF9B", textShadow: "0 0 18px rgba(124,255,155,0.7)", letterSpacing: 6 }}>{mm}<span style={{ opacity: f % 30 < 15 ? 1 : 0.2 }}>:</span>{ss}</div>
      {[0, 1, 2, 3].map(i => <div key={i} style={{ position: "absolute", left: 60 + i * 150, top: 285, width: 120, height: 56, borderRadius: 12, background: i === 3 ? N.nar : "#4A4A4E", boxShadow: "0 6px 0 rgba(0,0,0,0.5)" }} />)}
    </div>);
  else { const lv = interpolate(f, [0, dur], [1, 0.25], CL); obj = (
    <div style={{ position: "absolute", left: objX + 120, top: 150, width: 380, height: 740, transform: `scale(${0.88 + 0.12 * p})` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 380, height: 36, borderRadius: 10, background: "linear-gradient(180deg,#8A5A2B,#5C3A19)" }} />
      <div style={{ position: "absolute", left: 0, bottom: 0, width: 380, height: 36, borderRadius: 10, background: "linear-gradient(180deg,#8A5A2B,#5C3A19)" }} />
      <div style={{ position: "absolute", left: 40, top: 36, width: 300, height: 334, clipPath: "polygon(0 0,100% 0,56% 100%,44% 100%)", background: "rgba(220,235,240,0.22)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lv * 100}%`, background: "linear-gradient(180deg,#F2C27A,#D99A45)" }} /></div>
      <div style={{ position: "absolute", left: 40, top: 370, width: 300, height: 334, clipPath: "polygon(44% 0,56% 0,100% 100%,0 100%)", background: "rgba(220,235,240,0.22)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${(1 - lv) * 85}%`, background: "linear-gradient(180deg,#F2C27A,#C98835)", clipPath: "polygon(50% 0,100% 100%,0 100%)" }} /></div>
      <div style={{ position: "absolute", left: 187, top: 360, width: 6, height: 340, background: "#E9B465", opacity: 0.85 }} />
    </div>); }
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side={right ? "left" : "right"} k={0.8} />
      {obj}
      <div style={{ position: "absolute", left: txtX, top: 250, width: 880 }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 190, lineHeight: 1, color: N.narL, textShadow: tsh }}>{big}</div>
        <Titulo txt={title} size={80} style={{ marginTop: 16 }} />
        {sub ? <Kick txt={sub} style={{ marginTop: 18 }} color="#EFE3CF" /> : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- muestrario de acabados de grifería: fichas de color redondas
export const AcabN: React.FC<{ items: { t: string; c: string; ok?: boolean }[]; title: string; dur: number }> = ({ items, title, dur }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#2B241D,#15100C)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center" }}><Titulo txt={title} size={88} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", gap: 60 }}>
        {items.map((it, i) => { const p = sp(f, i * 4, 12); const sh = interpolate((f + i * 15) % 60, [0, 60], [-60, 160]);
          return <div key={i} style={{ width: 340, textAlign: "center", opacity: cl(p * 1.6), transform: `translateY(${(1 - p) * 40}px)` }}>
            <div style={{ width: 300, height: 300, margin: "0 auto", borderRadius: "50%", background: `linear-gradient(120deg, transparent ${sh - 20}%, rgba(255,255,255,0.55) ${sh}%, transparent ${sh + 15}%), ${it.c}`, boxShadow: `0 0 0 10px ${it.ok ? N.ok : N.narL}, 0 30px 40px rgba(0,0,0,0.5)` }} />
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 58, color: "#FFF8EE", marginTop: 34 }}>{it.t}</div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, color: it.ok ? "#7FD08F" : N.narL, marginTop: 4 }}>{it.ok ? "aguanta" : "prueba primero"}</div>
          </div>; })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- pegamento: la mancha que tiembla y se vuelve gomosa
export const PegoteN: React.FC<{ title: string; sub: string; bg?: string; dur: number }> = ({ title, sub, bg, dur }) => {
  const f = useCurrentFrame(); const drop = interpolate(f, [6, 26], [0, 1], { ...CL, easing: ease }); const peel = interpolate(f, [30, 95], [0, 1], { ...CL, easing: ease });
  const spat = interpolate(f, [40, 100], [0, 1], { ...CL, easing: ease }); const p = sp(f, 0, 13);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="left" k={0.82} />
      <div style={{ position: "absolute", left: 1130, top: 190, width: 520, height: 700, transform: `translateY(${(1 - p) * 60}px)` }}>
        <div style={{ position: "absolute", left: 120, top: 0, width: 280, height: 80, borderRadius: 14, background: "linear-gradient(180deg,#D9D6CF,#8F8B84)", boxShadow: "0 6px 12px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: 30, top: 70, width: 460, height: 620, borderRadius: "60px 60px 40px 40px", background: "linear-gradient(90deg, rgba(255,255,255,0.10), rgba(255,255,255,0.32) 18%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.18) 85%, rgba(255,255,255,0.05))", border: "3px solid rgba(255,255,255,0.35)", boxShadow: "0 40px 60px rgba(0,0,0,0.5)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 50, top: 170, width: 360, height: 280, background: "#F3EDE1", clipPath: `polygon(0 0, 100% 0, 100% ${100 - 42 * peel}%, ${100 - 42 * peel}% 100%, 0 100%)`, boxShadow: "inset 0 0 0 4px rgba(0,0,0,0.06)" }}>
            <div style={{ position: "absolute", left: 30, top: 40, width: 300, height: 26, background: "#C9A574" }} />
            <div style={{ position: "absolute", left: 30, top: 92, width: 220, height: 18, background: "#D8CDB8" }} />
            <div style={{ position: "absolute", left: 30, top: 128, width: 260, height: 18, background: "#D8CDB8" }} />
          </div>
          <div style={{ position: "absolute", left: 50 + 360 * (1 - 0.42 * peel), top: 170 + 280 * (1 - 0.42 * peel), width: 360 * 0.42 * peel, height: 280 * 0.42 * peel, background: "linear-gradient(135deg,#FFFFFF,#D9D1C2)", clipPath: "polygon(0 0, 100% 0, 0 100%)", boxShadow: "0 8px 14px rgba(0,0,0,0.35)" }} />
          <div style={{ position: "absolute", left: 300, top: 440 - 30 * drop, width: 70 * drop, height: 50 * drop, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.8), rgba(240,190,90,0.7))", opacity: drop }} />
        </div>
        <div style={{ position: "absolute", left: 560 - 190 * spat, top: 470 - 40 * spat, width: 300, height: 60, transform: "rotate(-24deg)", opacity: cl(spat * 3) }}>
          <div style={{ position: "absolute", left: 0, top: 14, width: 150, height: 32, background: "linear-gradient(180deg,#E6E6E6,#9A9A9A)", clipPath: "polygon(0 30%,100% 0,100% 100%,0 70%)" }} />
          <div style={{ position: "absolute", left: 150, top: 6, width: 170, height: 48, borderRadius: 14, background: "linear-gradient(180deg,#B5532A,#7A3518)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 110, top: 320, width: 920 }}><Titulo txt={title} size={96} /><Kick txt={sub} style={{ marginTop: 20 }} /></div>
    </AbsoluteFill>
  );
};

// ---------- ficha de receta del gel: tres renglones grandes
export const RecetaN: React.FC<{ head: string; rows: { q: string; t: string; f: number }[]; bg?: string; dur: number }> = ({ head, rows, bg, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 13);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="all" k={0.6} />
      <div style={{ position: "absolute", left: 260, top: 110, width: 1400, background: N.crema, padding: "40px 60px 50px", boxShadow: "0 40px 70px rgba(0,0,0,0.6)", transform: `rotate(1deg) translateY(${(1 - p) * 60}px)`, backgroundImage: "repeating-linear-gradient(180deg, transparent 0 96px, rgba(86,124,170,0.3) 96px 99px)" }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 56, letterSpacing: 6, color: N.no, borderBottom: `6px solid ${N.no}`, paddingBottom: 14 }}>{head}</div>
        {rows.map((r, i) => { const q = sp(f, r.f, 14); return <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 30, marginTop: 30, opacity: cl(q * 1.6), transform: `translateX(${(1 - q) * 40}px)` }}>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 84, color: "#8E3B12", minWidth: 330 }}>{r.q}</div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 68, color: N.ink }}>{r.t}</div>
        </div>; })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- la olla vista desde arriba: el líquido ondea y de golpe se vuelve gel brillante y quieto
export const OllaN: React.FC<{ title: string; sub: string; dur: number }> = ({ title, sub, dur }) => {
  const f = useCurrentFrame(); const g = interpolate(f, [Math.max(10, dur * 0.35), Math.max(20, dur * 0.35) + 14], [0, 1], CL); const rip = (1 - g);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "radial-gradient(ellipse at 30% 50%, #3A3128, #120E0A)" }}>
      <div style={{ position: "absolute", left: 160, top: 120, width: 820, height: 820, borderRadius: "50%", background: "linear-gradient(135deg,#C9CCCF,#6F7377)", boxShadow: "0 40px 70px rgba(0,0,0,0.6)" }}>
        <div style={{ position: "absolute", inset: 50, borderRadius: "50%", overflow: "hidden", background: `radial-gradient(circle at 40% 35%, rgba(255,255,255,${0.15 + 0.5 * g}), rgba(230,170,80,${0.75 - 0.25 * g}) 55%, rgba(200,130,50,0.9))` }}>
          {[0, 1, 2, 3].map((i) => { const r = ((f * 3 + i * 90) % 360); return <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: r * 2, height: r * 2, marginLeft: -r, marginTop: -r, borderRadius: "50%", border: `4px solid rgba(255,240,200,${0.5 * rip * (1 - r / 360)})` }} />; })}
        </div>
        <div style={{ position: "absolute", right: -220, top: 380, width: 260, height: 60, borderRadius: 30, background: "#2E2A26" }} />
      </div>
      <div style={{ position: "absolute", left: 1150, top: 300, width: 700 }}>
        <Titulo txt={g > 0.5 ? title : sub} size={92} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- azulejo vertical: la gota de líquido se escurre; la de gel se queda
export const GotaN: React.FC<{ a: string; b: string; dur: number }> = ({ a, b, dur }) => {
  const f = useCurrentFrame(); const y = ((f * 9) % 700); const tile = "repeating-linear-gradient(0deg, #CFCBC4 0 6px, #F4F3EF 6px 200px), repeating-linear-gradient(90deg, #CFCBC4 0 6px, transparent 6px 200px)";
  const Col = ({ x, l, run }: { x: number; l: string; run: boolean }) => (
    <div style={{ position: "absolute", left: x, top: 60, width: 760, height: 800, background: tile, boxShadow: "0 30px 50px rgba(0,0,0,0.5)", overflow: "hidden" }}>
      {run ? <><div style={{ position: "absolute", left: 340, top: 120, width: 60, height: y, background: "linear-gradient(180deg, rgba(232,150,60,0.15), rgba(232,150,60,0.55))", borderRadius: 30 }} /><div style={{ position: "absolute", left: 330, top: 100 + y, width: 80, height: 90, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(232,140,50,0.9)" }} /></>
        : <div style={{ position: "absolute", left: 250, top: 200 + Math.sin(f / 10) * 3, width: 260, height: 200, borderRadius: "45% 55% 50% 50% / 50% 50% 55% 45%", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9), rgba(240,200,130,0.7) 45%, rgba(220,160,80,0.8))", boxShadow: "0 8px 0 rgba(0,0,0,0.08)" }} />}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: N.noche, padding: "18px 30px", fontFamily: SERIF, fontWeight: 700, fontSize: 62, color: "#FFF8EE", textAlign: "center" }}>{l}</div>
    </div>
  );
  return <AbsoluteFill style={{ opacity: out(f, dur), background: "#1A1410" }}><Col x={150} l={a} run /><Col x={1010} l={b} run={false} /></AbsoluteFill>;
};

// ---------- errores: un azulejo grande con el número sobre la foto del error, y la placa con el error y su arreglo
export const ErrorN: React.FC<{ k: number; title: string; sub: string; bg?: string; head?: boolean; dur: number }> = ({ k, title, sub, bg, head, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 10); const r = interpolate(p, [0, 1], [-25, -4]);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="left" k={0.86} />
      <div style={{ position: "absolute", left: 120, top: 120, width: 300, height: 300, background: "linear-gradient(135deg,#FFFFFF,#E6E2DA)", border: "8px solid #CFCBC4", transform: `rotate(${r}deg) scale(${0.7 + 0.3 * p})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 30px 50px rgba(0,0,0,0.55)" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: head ? 190 : 230, color: N.no, lineHeight: 1 }}>{head ? "5" : k}</div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 480, width: 1000 }}>
        <Titulo txt={title} size={head ? 104 : 88} />
        <Placa edge={N.no} style={{ marginTop: 26 }}><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 54, color: "#FFDCCF", lineHeight: 1.12 }}>{sub}</div></Placa>
      </div>
    </AbsoluteFill>
  );
};

// ---------- lista del almacén en un bloc: cada cosa con su precio en la columna de la derecha
export const BlocN: React.FC<{ head: string; rows: { t: string; v: string; f: number }[]; bg?: string; dur: number }> = ({ head, rows, bg, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 13);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="right" k={0.6} />
      <div style={{ position: "absolute", left: 140, top: 70, width: 1080, minHeight: 900, background: "#FFFDF4", padding: "110px 60px 40px", boxShadow: "0 40px 70px rgba(0,0,0,0.6)", transform: `rotate(-1.5deg) translateY(${(1 - p) * 60}px)`, backgroundImage: "repeating-linear-gradient(180deg, transparent 0 108px, rgba(86,124,170,0.3) 108px 111px)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 64, background: "repeating-linear-gradient(90deg, #8A8680 0 18px, transparent 18px 42px)" }} />
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 54, letterSpacing: 5, color: N.no, marginBottom: 18 }}>{head}</div>
        {rows.map((r, i) => { const q = sp(f, r.f, 14); return <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", height: 108, opacity: cl(q * 1.6) }}>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 66, color: "#22304A" }}>{r.t}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 70, color: "#8E3B12" }}>{r.v}</div>
        </div>; })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- jarras de rendimiento: el casero llena dos jarras y media; la botella de tienda, media
export const RindeN: React.FC<{ a: { t: string; v: string; l: number }; b: { t: string; v: string; l: number }; dur: number }> = ({ a, b, dur }) => {
  const f = useCurrentFrame(); const k = interpolate(f, [4, 40], [0, 1], { ...CL, easing: ease });
  const Fila = ({ it, y, c }: { it: { t: string; v: string; l: number }; y: number; c: string }) => (
    <div style={{ position: "absolute", left: 120, right: 120, top: y, height: 400, display: "flex", alignItems: "flex-end", gap: 30 }}>
      {Array.from({ length: Math.ceil(it.l) }).map((_, i) => { const fill = cl(it.l * k - i); return <div key={i} style={{ width: 200, height: 320, border: "8px solid rgba(255,255,255,0.85)", borderTop: "none", borderRadius: "0 0 24px 24px", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, background: c }} /></div>; })}
      <div style={{ marginLeft: 40, paddingBottom: 30 }}><div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 76, color: "#FFF8EE" }}>{it.t}</div><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 60, color: N.narL }}>{it.v}</div></div>
    </div>
  );
  return <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#2C2219,#120D09)" }}><Fila it={a} y={50} c="linear-gradient(180deg,#F5B25C,#B8661C)" /><Fila it={b} y={560} c="linear-gradient(180deg,#9FD0F0,#3E83B8)" /></AbsoluteFill>;
};

// ---------- pregunta final: tres fotos colgadas de un hilo con broches, se mecen; la que se nombra baja un poco y se enciende
export const VotoN: React.FC<{ q: string; opts: { t: string; src: string; f: number }[]; dur: number }> = ({ q, opts, dur }) => {
  const f = useCurrentFrame(); let a = -1; opts.forEach((o, i) => { if (f >= o.f) a = i; });
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "linear-gradient(180deg,#EFE6D6,#D8CBB4)" }}>
      <div style={{ position: "absolute", left: 100, right: 100, top: 40, textAlign: "center" }}><Titulo txt={q} size={80} color={N.ink} style={{ textShadow: "none" }} /></div>
      <div style={{ position: "absolute", left: -20, right: -20, top: 300, height: 5, background: "#7A6248", transform: "rotate(-1deg)" }} />
      {opts.map((o, i) => { const p = sp(f, i * 3, 11); const on = i === a; const sw = Math.sin((f + i * 17) / 14) * (on ? 1 : 3);
        return <div key={i} style={{ position: "absolute", left: 160 + i * 560, top: 290, width: 480, transformOrigin: "50% 0", transform: `translateY(${(1 - p) * -500 + (on ? 24 : 0)}px) rotate(${sw}deg)` }}>
          <div style={{ position: "absolute", left: 220, top: -24, width: 40, height: 74, background: "#C79B62", borderRadius: 6, zIndex: 2 }} />
          <div style={{ background: "#FFFDF8", padding: "26px 26px 20px", boxShadow: on ? `0 0 0 8px ${N.nar}, 0 30px 50px rgba(0,0,0,0.45)` : "0 20px 34px rgba(0,0,0,0.35)" }}>
            <div style={{ height: 420, overflow: "hidden" }}><Pic src={o.src} /></div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 66, color: N.ink, textAlign: "center", marginTop: 10 }}>{o.t}</div>
          </div>
        </div>; })}
    </AbsoluteFill>
  );
};

// ---------- capas sobre el avatar
// progreso: una fila de 12 tapitas de frasco abajo a la izquierda; la del paso se llena de naranja como un reloj
export const ProgN: React.FC<{ n: number; N: number; title: string; dur: number }> = ({ n, N: tot, title, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 16);
  return (
    <div style={{ position: "absolute", left: 50, bottom: 40, display: "flex", alignItems: "center", gap: 20, opacity: out(f, dur, 10) * cl(p * 1.5), transform: `translateY(${(1 - p) * 40}px)`, background: "rgba(18,14,10,0.82)", padding: "12px 26px 12px 16px", borderRadius: 40 }}>
      <div style={{ display: "flex", gap: 6 }}>{Array.from({ length: tot }, (_, i) => { const now = i === n - 1; const k = i < n - 1 ? 1 : now ? interpolate(f, [4, 26], [0, 1], CL) : 0;
        return <div key={i} style={{ width: 30, height: 30, borderRadius: "50%", background: `conic-gradient(${N.nar} 0 ${k * 360}deg, #5A5048 ${k * 360}deg)`, boxShadow: now ? "0 0 0 3px #FFE1B0" : "none" }} />; })}</div>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, color: "#FFF4E2", letterSpacing: 1 }}>{n}/{tot} · {title}</div>
    </div>
  );
};
// QR: ficha de recetario colgada de un imán a la derecha del avatar
export const QrN: React.FC<{ qr: string; cover: string; dur: number }> = ({ qr, cover, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 13); const sw = Math.sin(f / 20) * 1.2;
  return (
    <div style={{ position: "absolute", right: 70, top: 150, width: 640, opacity: out(f, dur, 10), transformOrigin: "50% 0", transform: `translateY(${(1 - p) * -700}px) rotate(${sw}deg)` }}>
      <div style={{ position: "absolute", left: 290, top: -26, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #FF8A5C, #C6421B)", zIndex: 2, boxShadow: "0 6px 10px rgba(0,0,0,0.4)" }} />
      <div style={{ background: N.crema, borderRadius: 26, padding: "44px 30px 28px", boxShadow: "0 30px 60px rgba(0,0,0,0.55)", borderTop: `14px solid ${N.nar}` }}>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Img src={staticFile(cover)} style={{ width: 230, height: 310, objectFit: "cover", borderRadius: 8, boxShadow: "0 10px 20px rgba(0,0,0,0.35)" }} />
          <Img src={staticFile(qr)} style={{ width: 300, height: 300, background: "#fff", padding: 10, borderRadius: 12 }} />
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 44, color: N.ink, marginTop: 18, textAlign: "center" }}>Escanea con tu cámara</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: "#8E3B12", textAlign: "center" }}>la guía completa, en la descripción</div>
      </div>
    </div>
  );
};
// panel partido: la foto entra como la puerta de un mueble de cocina que se abre hacia la izquierda
export const PanelN: React.FC<{ src: string; label: string; dur: number }> = ({ src, label, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 14); const r = interpolate(p, [0, 1], [-70, 0]);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 900, opacity: out(f, dur, 10), perspective: 2000 }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "0 50%", transform: `rotateY(${r}deg)`, borderRight: `16px solid ${N.kraftD}`, overflow: "hidden" }}>
        <Pic src={src} />
        <div style={{ position: "absolute", left: 50, right: 50, bottom: 60, background: N.noche, borderLeft: `12px solid ${N.nar}`, padding: "18px 26px", fontFamily: SERIF, fontWeight: 700, fontSize: 52, lineHeight: 1.08, color: "#FFF8EE" }}>{label}</div>
      </div>
    </div>
  );
};

// ---------- versión SIMPLE (ronda 3 del EVALUADOR): foto viva + placa oscura opaca + texto grande; filas visibles todas
export const SimpleN: React.FC<{ bg?: string; title: string; sub?: string; rows?: string[]; dur: number }> = ({ bg, title, sub, rows, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 15);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Fondo bg={bg} dur={dur} side="all" k={0.25} />
      <div style={{ position: "absolute", left: 110, bottom: 100, maxWidth: 1300, background: "rgba(24,17,11,0.9)", borderLeft: `14px solid ${N.nar}`, padding: "40px 56px 44px", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", transform: `translateY(${(1 - p) * 50}px)`, opacity: cl(p * 2) }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: title.length > 30 ? 72 : 86, lineHeight: 1.06, color: "#FFF8EE" }}>{title}</div>
        {sub ? <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, letterSpacing: 4, color: N.narL, marginTop: 16 }}>{sub}</div> : null}
        {rows ? rows.map((r, i) => <div key={i} style={{ fontFamily: SANS, fontWeight: 600, fontSize: 50, color: "#FFF8EE", marginTop: i ? 10 : 26, opacity: cl(sp(f, 4 + i * 3, 16) * 2) }}>{r}</div>) : null}
      </div>
    </AbsoluteFill>
  );
};
