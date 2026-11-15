// Kit de obra del Constructor Libre (fb14a): cemento fresco, madera de encofrado, cinta métrica, probeta, tendedero, carretilla.
// PURO CSS y DOM: sin SVG, sin blur grande, sin backdrop-filter, sin feTurbulence. Las fotos van enteras.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { Photo, FONTS, CL, hash, useOut } from "./Kit";

const { SERIF, SANS } = FONTS;
export const O = { cem: "#9A978F", cem2: "#7E7B74", cemD: "#3F3D3A", wood: "#B98A55", wood2: "#8E6235", tape: "#F2C230", ink: "#1F1D1A", chalk: "#F4F1E8", red: "#B5432A", green: "#5E8C4A", sand: "#D9BF86", oil: "#141210" };
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = Easing.out(Easing.cubic);
const sp = (f: number, d = 0, damping = 14) => spring({ frame: f - d, fps: 30, config: { damping, mass: 0.8 } });
const tsh = "0 3px 14px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.8)";
// textura de cemento hecha con gradientes (manchas y poros), sin imágenes
const cemento = (base = O.cem, dark = false) => ({
  background: `radial-gradient(circle at 18% 30%, rgba(0,0,0,${dark ? 0.22 : 0.12}) 0 2px, transparent 3px) 0 0 / 23px 19px, radial-gradient(circle at 70% 60%, rgba(255,255,255,0.10) 0 1.5px, transparent 2.5px) 0 0 / 17px 29px, radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(ellipse at 80% 90%, rgba(0,0,0,0.25), transparent 55%), ${base}`,
});
const madera = (a = O.wood, b = O.wood2) => ({ background: `repeating-linear-gradient(92deg, rgba(0,0,0,0.08) 0 3px, transparent 3px 19px, rgba(255,255,255,0.06) 19px 21px, transparent 21px 37px), linear-gradient(180deg, ${a}, ${b})` });
// fondo: la foto del paso entera, hundida (oscurecida) para que la pieza flote encima
const Base: React.FC<{ bg?: string; dur: number; seed?: number; dim?: number }> = ({ bg, dur, seed = 3, dim = 0.55 }) => (
  <AbsoluteFill>
    {bg ? <Photo src={bg} seed={seed} dur={dur} /> : <AbsoluteFill style={cemento(O.cemD, true)} />}
    <AbsoluteFill style={{ background: `rgba(14,12,10,${dim})` }} />
  </AbsoluteFill>
);
const Kicker: React.FC<{ txt: string; f0?: number; color?: string; style?: React.CSSProperties }> = ({ txt, f0 = 0, color = O.tape, style }) => {
  const f = useCurrentFrame(); const p = sp(f, f0, 16);
  return <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 6, color, textShadow: tsh, opacity: p, transform: `translateY(${(1 - p) * 20}px)`, ...style }}>{txt}</div>;
};
const Big: React.FC<{ txt: string; f0?: number; size?: number; color?: string; style?: React.CSSProperties }> = ({ txt, f0 = 0, size = 92, color = O.chalk, style }) => {
  const f = useCurrentFrame(); const p = sp(f, f0, 15);
  return <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: size, lineHeight: 1.08, color, textShadow: tsh, opacity: p, transform: `translateY(${(1 - p) * 34}px)`, ...style }}>{txt}</div>;
};

// ---------- (3)+(5) apertura de cada paso: la foto del paso + un bloque de cemento fresco que sube con el número grabado a dedo
export const ChapO: React.FC<{ n: number; N: number; title: string; src: string; dur: number }> = ({ n, N, title, src, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const up = sp(f, 3, 13); const dig = interpolate(f, [10, 34], [0, 100], { ...CL, easing: ease });
  const left = n % 2 === 1;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Photo src={src} seed={n * 11 + 5} dur={dur} />
      <AbsoluteFill style={{ background: `linear-gradient(${left ? 90 : 270}deg, rgba(10,9,8,0.72) 0%, rgba(10,9,8,0.25) 46%, transparent 70%)` }} />
      <div style={{ position: "absolute", [left ? "left" : "right"]: 110, top: 250, width: 640, transform: `translateY(${(1 - up) * 640}px) perspective(1400px) rotateX(${(1 - up) * 18}deg)` }}>
        <div style={{ ...cemento(), height: 330, borderRadius: 6, boxShadow: "0 40px 70px rgba(0,0,0,0.6), inset 0 0 0 6px rgba(0,0,0,0.12), inset 0 10px 18px rgba(255,255,255,0.15)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 40, top: 26, fontFamily: SANS, fontWeight: 600, fontSize: 28, letterSpacing: 6, color: "rgba(30,28,25,0.75)" }}>PASO</div>
          <div style={{ position: "absolute", left: 34, top: 50, fontFamily: SERIF, fontWeight: 700, fontSize: 230, lineHeight: 1, color: "#86837C", textShadow: "inset 0 0 0 #000, 2px 3px 0 rgba(255,255,255,0.35), -2px -3px 0 rgba(0,0,0,0.45)", clipPath: `inset(0 ${100 - dig}% 0 0)` }}>{n}</div>
          <div style={{ position: "absolute", right: 40, bottom: 34, fontFamily: SERIF, fontWeight: 600, fontSize: 64, color: "rgba(40,38,34,0.7)", textShadow: "1px 2px 0 rgba(255,255,255,0.3), -1px -1px 0 rgba(0,0,0,0.4)" }}>de {N}</div>
        </div>
        <Big txt={title} f0={14} size={74} style={{ marginTop: 30, maxWidth: 760 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- (2) barra de progreso: doce piedras de un sendero; las hechas, oscuras con vetas
export const ProgO: React.FC<{ n: number; N: number; title: string; dur: number }> = ({ n, N, title, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 18); const o = useOut(dur, 10);
  return (
    <div style={{ position: "absolute", left: 60, bottom: 46, display: "flex", alignItems: "center", gap: 18, opacity: p * o, transform: `translateY(${(1 - p) * 60}px)` }}>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        {Array.from({ length: N }).map((_, i) => {
          const done = i + 1 < n, cur = i + 1 === n; const w = 34 + (hash(i + 3) % 12), h = 22 + (hash(i + 9) % 8);
          return <div key={i} style={{ width: w, height: h, borderRadius: `${40 + (hash(i) % 20)}% ${55 - (hash(i + 1) % 20)}% ${45 + (hash(i + 2) % 15)}% ${50 - (hash(i + 4) % 15)}%`, background: done || cur ? `linear-gradient(${hash(i) % 180}deg, #2E2C29 0 30%, #55524C 30% 34%, #2E2C29 34% 70%, #4A4743 70% 73%, #2E2C29 73%)` : "rgba(244,241,232,0.18)", border: done || cur ? "none" : "2px solid rgba(244,241,232,0.55)", boxShadow: cur ? `0 0 0 ${3 + 2 * Math.sin(f / 6)}px ${O.tape}` : "0 3px 6px rgba(0,0,0,0.5)" }} />;
        })}
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: O.chalk, textShadow: tsh, letterSpacing: 2 }}><span style={{ color: O.tape }}>{n} / {N}</span> · {title}</div>
    </div>
  );
};

// ---------- (1)+(10) el listado: doce lajas en un sendero en perspectiva, cada una con su foto; en el recap se encienden en orden
export const CarruselO: React.FC<{ head: string; cards: { n: number; title: string; src: string; txt?: string; f?: number }[]; bg?: string; recap?: boolean; dur: number }> = ({ head, cards, bg, recap, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  const cur = recap ? cards.filter((c) => (c.f ?? 0) <= f).length - 1 : -1;
  const cam = recap ? interpolate(f, [0, dur], [0, -40], CL) : interpolate(f, [0, dur], [10, -30], CL);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.62} />
      <Kicker txt={head} style={{ position: "absolute", top: 54, width: "100%", textAlign: "center" }} />
      <AbsoluteFill style={{ perspective: 1600, perspectiveOrigin: "50% 20%" }}>
        <div style={{ position: "absolute", left: 160, top: 150, width: 1600, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 30, transform: `rotateX(32deg) translateY(${cam}px)`, transformStyle: "preserve-3d" }}>
          {cards.map((c, i) => {
            const d = recap ? 0 : 6 + i * 5; const p = sp(f, d, 13); const on = recap ? i === cur : false; const past = recap && i < cur;
            return (
              <div key={i} style={{ position: "relative", height: 250, borderRadius: 10, overflow: "hidden", boxShadow: on ? `0 0 0 8px ${O.tape}, 0 30px 50px rgba(0,0,0,0.7)` : "0 24px 40px rgba(0,0,0,0.6)", opacity: recap ? (past || on ? 1 : 0.45) : p, transform: `translateZ(${on ? 70 : 0}px) translateY(${(1 - p) * -500}px)` }}>
                <Img src={staticFile(c.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(10,9,8,0.85) 0%, transparent 60%)" }} />
                <div style={{ position: "absolute", left: 16, top: 10, width: 64, height: 64, borderRadius: 32, ...cemento(), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 40, color: O.ink }}>{c.n}</div>
                <div style={{ position: "absolute", left: 18, right: 14, bottom: 12, fontFamily: SANS, fontWeight: 600, fontSize: 28, lineHeight: 1.1, color: O.chalk }}>{c.title}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {recap && cur >= 0 && cards[cur].txt ? (
        <div key={cur} style={{ position: "absolute", left: 120, right: 120, bottom: 60, textAlign: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 52, color: O.chalk, textShadow: tsh, opacity: cl((f - (cards[cur].f ?? 0)) / 8) }}>{cards[cur].txt}</div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- el precio escrito con el dedo en el cemento fresco
export const DedoO: React.FC<{ big: string; sub: string; bg?: string; dur: number }> = ({ big, sub, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const w = interpolate(f, [8, 8 + big.length * 6], [0, 100], { ...CL, easing: Easing.inOut(Easing.quad) });
  const slab = sp(f, 0, 16);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.5} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ ...cemento("#8C8982"), width: 1180, height: 560, borderRadius: 8, position: "relative", boxShadow: "0 50px 90px rgba(0,0,0,0.65), inset 0 0 0 14px #6D4A28, inset 0 0 0 18px rgba(0,0,0,0.3)", transform: `perspective(1600px) rotateX(${(1 - slab) * 30 + 8}deg) scale(${0.9 + 0.1 * slab})` }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 300, letterSpacing: 10, color: "#6F6C66", textShadow: "-3px -4px 0 rgba(0,0,0,0.5), 3px 4px 0 rgba(255,255,255,0.28)", clipPath: `inset(0 ${100 - w}% 0 0)` }}>{big}</div>
        </div>
        <Big txt={sub} f0={8 + big.length * 6} size={58} style={{ marginTop: 46 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- (8) recuerdo como objeto: la foto del taller sale de un sobre de taller manchado de grasa
export const SobreO: React.FC<{ src: string; caption: string; dur: number }> = ({ src, caption, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const out = interpolate(f, [6, 40], [0, 1], { ...CL, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: o, ...madera("#6E4E2E", "#4C331C") }}>
      <AbsoluteFill style={{ transform: `scale(${1 + 0.04 * (f / dur)})` }}>
        <div style={{ position: "absolute", left: 360, top: 150 - out * 120, width: 1200, padding: "26px 26px 80px", background: "#EFE6D2", transform: `rotate(${-2 + out * 1.4}deg)`, boxShadow: "0 30px 60px rgba(0,0,0,0.55)", zIndex: 1 }}>
          <div style={{ width: 1148, height: 640, overflow: "hidden", filter: "sepia(0.25)" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 16, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 50, color: "#3B3026" }}>{caption}</div>
        </div>
        <div style={{ position: "absolute", left: 300, top: 640, width: 1320, height: 460, background: "linear-gradient(180deg, #C9A86F, #B08E57)", zIndex: 2, boxShadow: "0 -10px 30px rgba(0,0,0,0.35)", transform: `translateY(${out * 120}px)` }}>
          <div style={{ position: "absolute", left: 160, top: 90, width: 130, height: 150, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(30,22,12,0.55), rgba(30,22,12,0.15) 60%, transparent 72%)" }} />
          <div style={{ position: "absolute", right: 260, top: 60, width: 220, height: 120, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(30,22,12,0.35), transparent 70%)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 8, color: "rgba(60,40,20,0.75)" }}>TALLER · 1989</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- (8) recuerdo como objeto: la foto colgada con un broche en el tendedero de Marta, se hamaca con el viento
export const TendederoO: React.FC<{ src: string; caption: string; bg?: string; dur: number }> = ({ src, caption, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const p = sp(f, 4, 9); const sw = Math.sin(f / 13) * 2.4 + (1 - p) * 14;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.45} />
      <div style={{ position: "absolute", left: -20, right: -20, top: 120, height: 5, background: "linear-gradient(180deg,#E8E2D4,#A9A294)", transform: "rotate(-1.2deg)", boxShadow: "0 4px 8px rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", left: 520, top: 104, transformOrigin: "50% 0", transform: `rotate(${sw}deg) translateY(${(1 - p) * -700}px)` }}>
        <div style={{ position: "absolute", left: 420, top: -14, width: 34, height: 92, borderRadius: 6, ...madera("#D7B07A", "#B48A52"), boxShadow: "0 4px 8px rgba(0,0,0,0.45)", zIndex: 2 }} />
        <div style={{ marginTop: 36, background: "#FBF8F1", padding: "24px 24px 96px", boxShadow: "0 30px 60px rgba(0,0,0,0.55)" }}>
          <div style={{ width: 840, height: 560, overflow: "hidden" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 24, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 50, color: "#2A2520" }}>{caption}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- (9) dato con fuente real: la hoja del estudio en una tablilla de obra, con resaltador que pasa por cada línea
export const EstudioO: React.FC<{ cite: string; title: string; lines: { txt: string; f: number }[]; bg?: string; dur: number }> = ({ cite, title, lines, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0, 15);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.6} />
      <div style={{ position: "absolute", left: 420, top: 70, width: 1080, height: 960, borderRadius: 18, ...madera("#9C7148", "#7A5530"), boxShadow: "0 40px 80px rgba(0,0,0,0.6)", transform: `translateY(${(1 - p) * 900}px) rotate(${-1.5 + (1 - p) * 6}deg)` }}>
        <div style={{ position: "absolute", left: 340, top: -18, width: 400, height: 86, borderRadius: 10, background: "linear-gradient(180deg,#D8DBDE,#8E9398 60%,#C4C8CC)", boxShadow: "0 8px 14px rgba(0,0,0,0.5)", zIndex: 2 }} />
        <div style={{ position: "absolute", left: 54, top: 54, right: 54, bottom: 54, background: "#FBFAF5", padding: "70px 64px", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 3, color: "#6B655C" }}>{cite}</div>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 52, lineHeight: 1.12, color: O.ink, marginTop: 22, marginBottom: 40 }}>{title}</div>
          {lines.map((l, i) => {
            const t = interpolate(f, [l.f, l.f + 16], [0, 100], { ...CL, easing: ease }); const a = cl((f - l.f + 6) / 8);
            return (
              <div key={i} style={{ position: "relative", fontFamily: SERIF, fontSize: 40, lineHeight: 1.25, color: O.ink, margin: "18px 0", opacity: 0.35 + 0.65 * a }}>
                <div style={{ position: "absolute", left: -10, top: 6, height: 44, width: `calc(${t}% + 20px)`, background: "rgba(242,194,48,0.55)", borderRadius: 4 }} />
                <span style={{ position: "relative" }}>{l.txt}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- la probeta graduada: cuánto aceite (30 ml), el tope (50 ml) o el bidón de 2 litros
export const ProbetaO: React.FC<{ mode: "dosis" | "max" | "pedido"; bg?: string; dur: number }> = ({ mode, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0, 15);
  const max = mode === "pedido" ? 2000 : 60;
  const target = mode === "dosis" ? 30 : mode === "max" ? 50 : 2000;
  const lvl = interpolate(f, [12, 12 + (mode === "max" ? 50 : 40)], [0, target], { ...CL, easing: Easing.inOut(Easing.quad) });
  const shake = mode === "max" && lvl >= 49.5 ? Math.sin(f * 1.7) * 4 * Math.exp(-(f - 62) / 12) : 0;
  const H = 700; const marks = mode === "pedido" ? [500, 1000, 1500, 2000] : [10, 20, 30, 40, 50, 60];
  const lab = mode === "dosis" ? ["30 ml = 2 cucharadas", "cada 5 kg de cemento"] : mode === "max" ? ["Tope: 50 ml", "cada 5 kg · ni una gota más"] : ["Un bidón de 2 litros", "para todo un verano de lajas"];
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.58} />
      <div style={{ position: "absolute", left: 470, top: 170, width: 240, height: H, transform: `translateY(${(1 - p) * 900}px) translateX(${shake}px)` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "0 0 26px 26px", border: "6px solid rgba(235,240,242,0.85)", borderTop: "none", background: "rgba(220,230,235,0.12)", boxShadow: "inset 10px 0 20px rgba(255,255,255,0.2), 0 30px 60px rgba(0,0,0,0.5)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${(lvl / max) * 100}%`, background: `linear-gradient(90deg, #0E0C0A, #2A241C 40%, #0E0C0A)` }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: `${(lvl / max) * 100}%`, height: 8, background: "rgba(90,80,60,0.8)", borderRadius: "50%" }} />
        </div>
        {marks.map((m) => (
          <div key={m} style={{ position: "absolute", right: -150, bottom: `${(m / max) * 100}%`, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 70, height: m === 50 && mode !== "pedido" ? 6 : 3, background: m === 50 && mode !== "pedido" ? O.red : O.chalk, marginLeft: -110 }} />
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: m === 50 && mode !== "pedido" ? "#FF8A6E" : O.chalk, textShadow: tsh }}>{mode === "pedido" ? m / 1000 + " L" : m + " ml"}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 960, top: 380 }}>
        <Big txt={lab[0]} f0={30} size={84} color={mode === "max" ? "#FFD2C4" : O.chalk} />
        <Big txt={lab[1]} f0={44} size={50} color={O.tape} style={{ marginTop: 18 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- dónde NO van: cuatro tablas pintadas, cada una tachada a brochazo rojo; al final la de AFUERA, sí
export const TablasNoO: React.FC<{ items: { txt: string; f: number }[]; si: { txt: string; f: number }; bg?: string; dur: number }> = ({ items, si, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.62} />
      <div style={{ position: "absolute", left: 180, top: 120, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, width: 1560 }}>
        {items.map((it, i) => {
          const p = sp(f, it.f - 10, 13); const x = interpolate(f, [it.f + 8, it.f + 20], [0, 1], CL);
          return (
            <div key={i} style={{ position: "relative", height: 210, borderRadius: 6, ...madera(i % 2 ? "#A87C4C" : "#B88D5A"), boxShadow: "0 22px 40px rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${(hash(i) % 5) - 2}deg) translateY(${(1 - p) * -700}px)` }}>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 62, color: "#2C1E10", letterSpacing: 2 }}>{it.txt}</div>
              <div style={{ position: "absolute", left: "8%", top: "48%", width: `${84 * x}%`, height: 26, background: O.red, borderRadius: 13, transform: "rotate(-9deg)", opacity: 0.92 }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 360, right: 360, bottom: 120, height: 170, borderRadius: 8, ...cemento("#4E5A45"), display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 50px rgba(0,0,0,0.6)", opacity: sp(f, si.f, 14), transform: `scale(${0.8 + 0.2 * sp(f, si.f, 14)})` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 64, color: O.chalk }}>{si.txt}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- el aceite vuelve al taller: una gota que cae y se frena en el aire sobre la tierra y la rejilla, y sube al bidón
export const VuelveO: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const fall = (d: number) => interpolate(f, [d, d + 18], [-200, 360], { ...CL, easing: Easing.in(Easing.quad) });
  const back = interpolate(f, [56, 84], [0, 1], { ...CL, easing: ease });
  const Panel: React.FC<{ x: number; label: string; ground: React.CSSProperties; d: number }> = ({ x, label, ground, d }) => (
    <div style={{ position: "absolute", left: x, top: 200, width: 520, height: 620 }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 180, borderRadius: 8, ...ground }} />
      <div style={{ position: "absolute", left: 238, top: fall(d) * (1 - back) - back * 140, width: 44, height: 58, borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%", background: "radial-gradient(circle at 35% 35%, #4A4036, #0C0A08 60%)", opacity: 1 - back * 0.9 }} />
      <div style={{ position: "absolute", left: 100, top: 360, width: 320, height: 26, background: O.red, borderRadius: 13, transform: "rotate(-8deg)", opacity: interpolate(f, [d + 18, d + 24], [0, 1], CL) }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 44, color: O.chalk, textShadow: tsh }}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.66} />
      <Panel x={240} d={8} label="Nunca a la tierra" ground={{ background: "radial-gradient(circle at 30% 30%, rgba(0,0,0,0.25) 0 3px, transparent 4px) 0 0 / 26px 22px, linear-gradient(180deg,#6E4F33,#4A3420)" }} />
      <Panel x={1160} d={22} label="Nunca al desagüe" ground={{ background: "repeating-linear-gradient(90deg, #2A2A2A 0 26px, #0D0D0D 26px 40px), #222", border: "10px solid #8E9398" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, textAlign: "center", opacity: back }}>
        <Big txt="Vuelve al taller, en el mismo bidón" f0={60} size={64} color={O.tape} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- la medida: una cinta métrica amarilla que se estira por los bordes de la laja
export const CintaO: React.FC<{ marks: number[]; bg?: string; dur: number }> = ({ marks, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0, 15);
  const a = interpolate(f, [marks[0], marks[0] + 22], [0, 1], { ...CL, easing: ease }), b = interpolate(f, [marks[1], marks[1] + 22], [0, 1], { ...CL, easing: ease }), c = interpolate(f, [marks[2], marks[2] + 16], [0, 1], { ...CL, easing: ease });
  const tape = (w: number, vertical = false): React.CSSProperties => ({ position: "absolute", height: vertical ? w : 60, width: vertical ? 60 : w, background: `repeating-linear-gradient(${vertical ? 180 : 90}deg, #1B1B1B 0 3px, transparent 3px 16px), repeating-linear-gradient(${vertical ? 180 : 90}deg, #1B1B1B 0 4px, transparent 4px 80px), ${O.tape}`, backgroundSize: vertical ? "18px 16px, 34px 80px, auto" : "16px 18px, 80px 34px, auto", backgroundRepeat: "repeat-x, repeat-x, no-repeat", boxShadow: "0 6px 12px rgba(0,0,0,0.5)" });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.55} />
      <AbsoluteFill style={{ perspective: 1800 }}>
        <div style={{ position: "absolute", left: 610, top: 250, width: 700, height: 700, transform: `rotateX(48deg) rotateZ(-8deg) translateY(${(1 - p) * 400}px)`, transformStyle: "preserve-3d" }}>
          <div style={{ position: "absolute", inset: 0, ...cemento("#55524D", true), boxShadow: "0 0 0 2px #333, 0 60px 80px rgba(0,0,0,0.6)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: -60, height: 60, background: "linear-gradient(180deg,#4A4743,#2E2C2A)", transform: "rotateX(-90deg)", transformOrigin: "top" }} />
          <div style={{ ...tape(700 * a), left: 0, top: -80 }} />
          <div style={{ ...tape(700 * b, true), left: -80, top: 0 }} />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 120, top: 120 }}>
        <Big txt="40 × 40 cm" f0={marks[0] + 10} size={96} color={O.tape} />
        <Big txt={"4 cm de espesor"} f0={marks[2]} size={64} style={{ marginTop: 10, opacity: c }} />
      </div>
      <div style={{ position: "absolute", right: 120, bottom: 110, width: 620, textAlign: "right" }}>
        <Big txt="la levantas sola · no se parte" f0={marks[2] + 20} size={46} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- las partes: un balde de cemento y dos y medio de arena fina caen en fila
export const BaldesO: React.FC<{ fA: number; fB: number; bg?: string; dur: number }> = ({ fA, fB, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const Balde: React.FC<{ x: number; d: number; fill: string; part?: number; label: string }> = ({ x, d, fill, part = 1, label }) => {
    const p = sp(f, d, 12);
    return (
      <div style={{ position: "absolute", left: x, top: 330, width: 230, height: 300, transform: `translateY(${(1 - p) * -900}px)` }}>
        <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 0, 100% 0, 88% 100%, 12% 100%)", background: "linear-gradient(90deg,#7F858A,#D3D7DA 45%,#8B9095)" }} />
        <div style={{ position: "absolute", left: 10, right: 10, top: 10 + (1 - part) * 280, bottom: 0, clipPath: "polygon(0 0, 100% 0, 91% 100%, 9% 100%)", background: fill }} />
        <div style={{ position: "absolute", left: -10, right: -10, top: -8, height: 20, borderRadius: "50%", border: "5px solid #5E6266" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 320, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 32, color: O.chalk, textShadow: tsh }}>{label}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.62} />
      <Balde x={260} d={fA - 6} fill={cemento("#8F8D88").background as string} label="cemento" />
      <div style={{ position: "absolute", left: 560, top: 400, fontFamily: SERIF, fontWeight: 700, fontSize: 140, color: O.chalk, textShadow: tsh, opacity: sp(f, fB - 10, 15) }}>:</div>
      <Balde x={700} d={fB - 6} fill={`linear-gradient(180deg, #E1C892, ${O.sand})`} label="arena fina" />
      <Balde x={980} d={fB + 6} fill={`linear-gradient(180deg, #E1C892, ${O.sand})`} label="arena fina" />
      <Balde x={1260} d={fB + 18} fill={`linear-gradient(180deg, #E1C892, ${O.sand})`} part={0.5} label="media" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center" }}><Big txt="1 : 2½" f0={fB + 26} size={130} color={O.tape} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center" }}><Big txt="la arena de revocar, no la gruesa" f0={fB + 40} size={48} /></div>
    </AbsoluteFill>
  );
};

// ---------- corte de la mezcla: gotitas sueltas (bien) o gotas que se tocan y hacen canales (mal)
export const CorteO: React.FC<{ stage: 1 | 2; bg?: string; dur: number }> = ({ stage, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0, 16);
  const g = interpolate(f, [14, 60], [0, 1], { ...CL, easing: Easing.inOut(Easing.quad) });
  const drops = Array.from({ length: 34 }).map((_, i) => ({ x: 6 + (hash(i * 3) % 88), y: 8 + (hash(i * 7 + 1) % 82), r: 14 + (hash(i * 5 + 2) % 12) }));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.62} />
      <div style={{ position: "absolute", left: 160, top: 170, width: 980, height: 740, borderRadius: 10, overflow: "hidden", ...cemento("#A3A098"), boxShadow: "0 40px 70px rgba(0,0,0,0.6), inset 0 0 0 8px rgba(0,0,0,0.2)", transform: `translateX(${(1 - p) * -1200}px)` }}>
        {drops.map((d, i) => {
          const grow = stage === 2 ? 1 + g * (1.6 + (i % 3) * 0.5) : 1;
          return <div key={i} style={{ position: "absolute", left: `${d.x}%`, top: `${d.y}%`, width: d.r * grow * (stage === 2 ? 1 + g * 1.4 : 1), height: d.r * grow * 0.8, borderRadius: 999, background: "radial-gradient(circle at 35% 30%, #4A4036, #0E0C0A 65%)", transform: `rotate(${stage === 2 ? (hash(i) % 40) - 20 : 0}deg) scale(${cl(g * 1.4)})` }} />;
        })}
      </div>
      <div style={{ position: "absolute", left: 1220, top: 300, width: 600 }}>
        <Kicker txt={stage === 1 ? "DOSIS CHICA" : "EL DOBLE"} f0={10} color={stage === 1 ? "#A9D98E" : "#FF9A80"} />
        <Big txt={stage === 1 ? "Gotitas sueltas, rodeadas de cemento" : "Las gotas se tocan: canales de aceite"} f0={20} size={62} style={{ marginTop: 16 }} />
        <Big txt={stage === 1 ? "la resistencia casi no cambia" : "suda al sol · pierde fuerza"} f0={44} size={44} color={O.tape} style={{ marginTop: 24 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- las tres vueltas: la carretilla vista desde arriba; con cada vuelta el aceite se retuerce en vetas; con diez, desaparecen
export const VueltasO: React.FC<{ marks: number[]; mal?: boolean; bg?: string; dur: number }> = ({ marks, mal, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const n = mal ? Math.floor(interpolate(f, [marks[0], marks[0] + 70], [3, 10], CL)) : marks.filter((m) => m <= f).length;
  const tw = mal ? interpolate(f, [marks[0], marks[0] + 70], [3, 10], CL) : n + cl((f - (marks[n - 1] ?? 0)) / 12) - 1;
  const fade = mal ? interpolate(f, [marks[0] + 20, marks[0] + 80], [1, 0], CL) : 1;
  const bands = Array.from({ length: 9 });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.6} />
      <div style={{ position: "absolute", left: 260, top: 150, width: 900, height: 780, borderRadius: "48%", background: "linear-gradient(135deg,#C8CDD1,#7B8186 50%,#AEB4B8)", boxShadow: "0 40px 70px rgba(0,0,0,0.6)" }}>
        <div style={{ position: "absolute", inset: 40, borderRadius: "48%", overflow: "hidden", ...cemento(mal ? interpolate(f, [marks[0], marks[0] + 80], [0, 1], CL) > 0.6 ? "#6E6B66" : "#8E8B85" : "#8E8B85") }}>
          {bands.map((_, i) => (
            <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: 40 + i * 70, height: 6 + (i % 3) * 3, marginLeft: -(20 + i * 35), borderRadius: 999, background: "rgba(12,10,8,0.85)", opacity: cl(tw / 2) * fade * (0.5 + 0.5 * ((i * 7) % 3) / 2), transform: `rotate(${i * 23 + tw * (40 + i * 11)}deg) translateY(${Math.sin(i + tw) * 90}px) skewX(${tw * 6}deg)` }} />
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 1260, top: 220, textAlign: "center", width: 520 }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 300, lineHeight: 1, color: mal && n > 3 ? "#FF9A80" : O.tape, textShadow: tsh }}>{Math.max(0, n)}</div>
        <Big txt={mal ? (n >= 10 ? "Cemento manchado" : "vueltas…") : n >= 3 ? "y paras" : n === 0 ? "vueltas" : "vuelta" + (n > 1 ? "s" : "")} f0={marks[0]} size={64} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- la lámina: la página de la guía en una tabla, la cámara va a cada zona cuando él la nombra
export const LaminaO: React.FC<{ src: string; focus: { x: number; y: number; z: number; f: number }[]; dur: number }> = ({ src, focus, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0, 16);
  let x = 50, y = 50, z = 1;
  const seq = [{ x: 50, y: 50, z: 1, f: 0 }, ...focus];
  for (let i = 0; i < seq.length; i++) {
    const a = seq[i], b = seq[i + 1];
    if (!b || f < b.f) { if (b) { const t = 0; x = a.x; y = a.y; z = a.z; } else { x = a.x; y = a.y; z = a.z; } break; }
    const t = interpolate(f, [b.f, b.f + 24], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
    x = a.x + (b.x - a.x) * t; y = a.y + (b.y - a.y) * t; z = a.z + (b.z - a.z) * t;
    if (t < 1) break;
  }
  return (
    <AbsoluteFill style={{ opacity: o, ...madera("#5A3E24", "#3C2815") }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${x}% ${y}%` }}>
        <div style={{ position: "absolute", left: 150, top: 40, width: 1620, height: 1000, background: "#FBF8F0", padding: 14, boxShadow: "0 40px 80px rgba(0,0,0,0.6)", transform: `translateY(${(1 - p) * 1100}px)` }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- QR flotando al lado del avatar (overlay): portada + código + dirección
export const QrO: React.FC<{ qr: string; cover: string; dur: number }> = ({ qr, cover, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 15); const o = useOut(dur, 10);
  const bob = Math.sin(f / 22) * 6;
  return (
    <div style={{ position: "absolute", right: 70, top: 170 + bob, width: 640, borderRadius: 28, background: "#F6EFDD", boxShadow: "0 30px 70px rgba(0,0,0,0.55)", padding: 30, opacity: p * o, transform: `translateX(${(1 - p) * 700}px) rotate(${(1 - p) * 6}deg)`, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <Img src={staticFile(cover)} style={{ height: 300, borderRadius: 6, boxShadow: "0 10px 22px rgba(0,0,0,0.35)" }} />
        <Img src={staticFile(qr)} style={{ width: 300, height: 300 }} />
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 2, color: "#6B4E2A", marginTop: 20 }}>ESCANEA CON TU CELULAR</div>
      <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 46, color: O.ink, marginTop: 6 }}>constructorlibre.com</div>
    </div>
  );
};

// ---------- el cemento se cura: al sol se raja y suelta vapor; tapado a la sombra queda entero
export const CuraO: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const crack = interpolate(f, [24, 70], [0, 1], { ...CL, easing: ease }); const sheen = interpolate(f, [30, 90], [-30, 130], CL);
  const segs = [[0, 48, 18], [18, 52, -14], [34, 46, 22], [52, 55, -8], [68, 49, 16], [84, 53, -10]];
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.62} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}>
        <Big txt="El cemento no se seca: se cura" f0={2} size={78} />
      </div>
      {[0, 1].map((k) => (
        <div key={k} style={{ position: "absolute", left: k ? 1010 : 150, top: 280, width: 760, height: 500 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 8, ...cemento(k ? "#6F6C66" : "#A8A49C"), boxShadow: "0 30px 60px rgba(0,0,0,0.6)", overflow: "hidden" }}>
            {!k && segs.map(([x, y, r], i) => <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: `${17 * cl(crack * 6 - i)}%`, height: 5, background: "#1A1916", transform: `rotate(${r}deg)`, transformOrigin: "left" }} />)}
            {!k && Array.from({ length: 8 }).map((_, i) => <div key={i} style={{ position: "absolute", left: `${10 + i * 11}%`, bottom: `${((f * 2 + i * 40) % 120)}%`, width: 30, height: 30, borderRadius: 15, background: "rgba(255,255,255,0.12)" }} />)}
            {k ? <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sheen}%`, width: "18%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)", transform: "skewX(-18deg)" }} /> : null}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 530, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 44, color: k ? "#A9D98E" : "#FF9A80", textShadow: tsh }}>{k ? "Tapada, a la sombra: entera" : "Al sol, destapada: se raja"}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ---------- siete días: siete lajas en fila; cada día el rociador las oscurece
export const SieteO: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.6} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center" }}><Big txt="7 días tapada · agua una vez por día" f0={0} size={66} /></div>
      <div style={{ position: "absolute", left: 140, top: 430, display: "flex", gap: 34 }}>
        {Array.from({ length: 7 }).map((_, i) => {
          const d = 14 + i * 10; const wet = interpolate(f, [d, d + 10], [0, 1], CL);
          return (
            <div key={i} style={{ position: "relative", width: 200, height: 200 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 6, ...cemento(wet > 0.5 ? "#6B6862" : "#A19D96"), boxShadow: "0 18px 30px rgba(0,0,0,0.55)" }} />
              {Array.from({ length: 6 }).map((_, k) => <div key={k} style={{ position: "absolute", left: 30 + k * 26, top: interpolate(f, [d - 8, d + 6], [-120, 60 + (k % 3) * 30], CL), width: 6, height: 16, borderRadius: 3, background: "rgba(200,225,240,0.8)", opacity: f > d + 12 ? 0 : 1 }} />)}
              <div style={{ position: "absolute", left: 0, right: 0, top: 220, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 34, color: O.chalk, textShadow: tsh }}>día {i + 1}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- el sellador: un rodillo que pasa y detrás la laja se oscurece y aparecen las vetas; tres renglones
export const RodilloO: React.FC<{ a: string; lines: { txt: string; f: number }[]; dur: number }> = ({ a, lines, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const x = interpolate(f, [6, 70], [-6, 106], { ...CL, easing: Easing.inOut(Easing.sin) });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Photo src={a} seed={77} dur={dur} />
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.12)", clipPath: `inset(0 ${100 - x}% 0 0)` }}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,8,6,0.35), rgba(10,8,6,0.2))", mixBlendMode: "multiply" }} />
        <AbsoluteFill style={{ background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.10) 45%, transparent 60%)" }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", top: -40, bottom: -40, left: `calc(${x}% - 60px)`, width: 120, borderRadius: 60, background: "linear-gradient(90deg,#CFC9BE,#F2EEE6 40%,#B5AFA4)", boxShadow: "0 0 40px rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", left: 90, bottom: 90, padding: "30px 40px", background: "rgba(14,12,10,0.72)", borderRadius: 12 }}>
        {lines.map((l, i) => <Big key={i} txt={`${i + 1}. ${l.txt}`} f0={l.f} size={48} style={{ margin: "8px 0" }} />)}
      </div>
    </AbsoluteFill>
  );
};

// ---------- (7) mapa animado del barrio: el taller del tío, mi casa, la de Marta; el sendero de 9 m se dibuja
export const BarrioO: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const cam = interpolate(f, [0, dur], [1, 1.12], CL); const path = interpolate(f, [60, 120], [0, 1], { ...CL, easing: ease });
  const Pin: React.FC<{ x: number; y: number; t: string; s: string; d: number }> = ({ x, y, t, s, d }) => { const p = sp(f, d, 11); return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateY(${(1 - p) * -80}px)`, opacity: p }}>
      <div style={{ width: 30, height: 30, borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", background: O.red, boxShadow: "0 6px 10px rgba(0,0,0,0.5)" }} />
      <div style={{ position: "absolute", left: 44, top: -16, whiteSpace: "nowrap", background: "#FBF8F0", padding: "8px 16px", borderRadius: 6, fontFamily: SANS, fontWeight: 600, fontSize: 30, color: O.ink, boxShadow: "0 6px 14px rgba(0,0,0,0.4)" }}>{t}<div style={{ fontWeight: 500, fontSize: 22, color: "#6B655C" }}>{s}</div></div>
    </div>); };
  return (
    <AbsoluteFill style={{ opacity: o, background: "#CDBB93", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: "62% 55%" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 470, height: 110, background: "linear-gradient(180deg,#B49E72,#A88F60)" }} />
        <div style={{ position: "absolute", left: 640, top: 0, bottom: 0, width: 100, background: "#B8A57C" }} />
        {[[90, 120, 460, 290], [800, 120, 420, 290], [1290, 120, 520, 290], [90, 640, 460, 330], [800, 640, 470, 330], [1330, 640, 480, 330]].map(([x, y, w, h], i) => (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: h, background: "#9BAE76", border: "6px solid #E6DCC4", borderRadius: 6 }}>
            <div style={{ position: "absolute", left: 30, top: 30, width: w * 0.42, height: h * 0.5, background: i === 4 || i === 5 ? "#C8754D" : "#B9A88A", boxShadow: "6px 6px 0 rgba(0,0,0,0.2)" }} />
          </div>
        ))}
        <div style={{ position: "absolute", left: 1400, top: 820, width: 300 * path, height: 14, background: `repeating-linear-gradient(90deg, #3D3A36 0 38px, transparent 38px 52px)`, transform: "rotate(-14deg)", transformOrigin: "left" }} />
        <div style={{ position: "absolute", left: 1690, top: 690, width: 6, height: 120, background: "#7A6A55", opacity: path }} />
        <div style={{ position: "absolute", left: 1600, top: 700, width: 200, height: 4, background: "#E8E2D4", opacity: path }} />
        <Pin x={190} y={300} t="Taller del tío Rubén" s="1989 · calle de tierra" d={6} />
        <Pin x={880} y={790} t="Mi casa" s="el taller del patio" d={26} />
        <Pin x={1380} y={770} t="Casa de Marta" s="el sendero: 9 m, 18 lajas" d={44} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- corte del suelo: tierra, 4 cm de arena apisonada, la laja de 4 cm, 1 cm sobre el pasto
export const CapasO: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const L = [{ t: "tierra firme", h: 300, bg: "linear-gradient(180deg,#6E4F33,#4A3420)", d: 4 }, { t: "4 cm de arena gruesa, apisonada", h: 120, bg: `linear-gradient(180deg,#D6BF8C,#BFA470)`, d: 22 }, { t: "la laja: 4 cm", h: 120, bg: "", d: 40 }];
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.62} />
      <div style={{ position: "absolute", left: 180, top: 180, width: 900, height: 700 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 210, height: 30, background: "repeating-linear-gradient(90deg,#5F8A3E 0 6px,#4C7432 6px 10px)" }} />
        {L.map((l, i) => {
          const p = sp(f, l.d, 12); const bottom = [0, 300, 420][i];
          return <div key={i} style={{ position: "absolute", left: i === 2 ? 200 : 0, right: i === 2 ? 200 : 0, bottom, height: l.h, ...(i === 2 ? cemento("#3F3C38", true) : { background: l.bg }), borderRadius: i === 2 ? 6 : 0, transform: `translateY(${(1 - p) * -700}px)`, boxShadow: i === 2 ? "0 10px 20px rgba(0,0,0,0.5)" : "none" }} />;
        })}
      </div>
      <div style={{ position: "absolute", left: 1150, top: 260 }}>
        {[...L].reverse().map((l, i) => <Big key={i} txt={l.t} f0={l.d + 8} size={52} style={{ margin: "26px 0" }} />)}
        <Big txt="1 cm por encima del pasto" f0={64} size={52} color={O.tape} style={{ marginTop: 40 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- los errores: cinco lajas en un sendero; en cada error una se raja y aparece el texto
export const RajaO: React.FC<{ k: number; title: string; sub?: string; bg?: string; dur: number }> = ({ k, title, sub, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const cr = interpolate(f, [16, 34], [0, 1], { ...CL, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.66} />
      <div style={{ position: "absolute", left: 160, right: 160, top: 640, display: "flex", justifyContent: "space-between" }}>
        {[1, 2, 3, 4, 5].map((i) => {
          const on = i === k; const p = sp(f, k === 0 ? 4 + i * 7 : 0, 13);
          return (
            <div key={i} style={{ position: "relative", width: 250, height: 190, borderRadius: "46% 54% 40% 60% / 50% 44% 56% 50%", ...cemento(i < k ? "#3E3B37" : "#615E58", true), boxShadow: on ? `0 0 0 6px ${O.tape}, 0 22px 40px rgba(0,0,0,0.6)` : "0 18px 30px rgba(0,0,0,0.55)", transform: `translateY(${(1 - p) * 500 - (on ? 30 : 0)}px) scale(${on ? 1.12 : 1})`, opacity: k > 0 && !on ? 0.6 : 1 }}>
              <div style={{ position: "absolute", left: 18, top: 10, fontFamily: SERIF, fontWeight: 700, fontSize: 56, color: O.chalk, textShadow: tsh }}>{i}</div>
              {(on || i < k) && [[20, 40, 25], [45, 55, -20], [62, 45, 30]].map(([x, y, r], j) => <div key={j} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: `${30 * (on ? cl(cr * 3 - j) : 1)}%`, height: 5, background: "#0F0E0C", transform: `rotate(${r}deg)`, transformOrigin: "left" }} />)}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 160, right: 160, top: 170 }}>
        <Kicker txt={k ? `ERROR ${k} DE 5` : "LOS 5 ERRORES"} f0={4} color="#FF9A80" />
        <Big txt={title} f0={12} size={86} style={{ marginTop: 16 }} />
        {sub ? <Big txt={sub} f0={30} size={50} color={O.tape} style={{ marginTop: 18 }} /> : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- «me preguntaron»: tiras de cinta de papel pegadas en la pared de ladrillo, escritas a máquina
export const CintasO: React.FC<{ qs: { txt: string; f: number }[]; bg?: string; dur: number }> = ({ qs, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o, background: "repeating-linear-gradient(0deg, #8A4B33 0 58px, #C9B9A3 58px 64px), #8A4B33" }}>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, transparent 0 124px, #C9B9A3 124px 130px)", backgroundSize: "260px 128px", opacity: 0.9 }} />
      <AbsoluteFill style={{ background: "rgba(20,12,8,0.35)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center" }}><Kicker txt="ME PREGUNTARON" f0={0} color={O.chalk} /></div>
      {qs.map((q, i) => {
        const w = interpolate(f, [q.f, q.f + 14], [0, 1], { ...CL, easing: ease });
        return <div key={i} style={{ position: "absolute", left: 180 + (i % 2) * 120, top: 150 + i * 140, width: 1500 * w, overflow: "hidden", whiteSpace: "nowrap", background: "#EDE3C8", padding: "22px 34px", fontFamily: SERIF, fontSize: 50, color: O.ink, boxShadow: "0 8px 16px rgba(0,0,0,0.45)", transform: `rotate(${(hash(i + 5) % 3) - 1}deg)` }}>{q.txt}</div>;
      })}
    </AbsoluteFill>
  );
};

// ---------- los tiempos: un metro plegable de carpintero que se despliega tramo por tramo
export const MetroO: React.FC<{ rows: { a: string; b: string; f: number }[]; foot: string; bg?: string; dur: number }> = ({ rows, foot, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.62} />
      <div style={{ position: "absolute", left: 130, top: 230, display: "flex", perspective: 1400 }}>
        {rows.map((r, i) => {
          const p = interpolate(f, [r.f, r.f + 16], [0, 1], { ...CL, easing: ease });
          return (
            <div key={i} style={{ width: 410, height: 120, marginLeft: i ? -6 : 0, transformOrigin: "left", transform: `rotateY(${(1 - p) * -170}deg)`, background: `repeating-linear-gradient(90deg, #1B1B1B 0 3px, transparent 3px 41px), #F3E7C2`, backgroundSize: "41px 30px, auto", backgroundRepeat: "repeat-x, no-repeat", borderRadius: 4, boxShadow: "0 12px 24px rgba(0,0,0,0.5)", position: "relative", opacity: p > 0.02 ? 1 : 0 }}>
              <div style={{ position: "absolute", right: -10, top: 50, width: 20, height: 20, borderRadius: 10, background: "#9AA0A5" }} />
              <div style={{ position: "absolute", left: 20, top: 170, width: 380, fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: O.tape, textShadow: tsh, opacity: p }}>{r.a}</div>
              <div style={{ position: "absolute", left: 20, top: 250, width: 380, fontFamily: SANS, fontWeight: 600, fontSize: 34, color: O.chalk, textShadow: tsh, opacity: p }}>{r.b}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 130, textAlign: "center" }}><Big txt={foot} f0={rows[rows.length - 1].f + 30} size={66} /></div>
    </AbsoluteFill>
  );
};

// ---------- la cuenta: los gastos caen en la carretilla, se suman y se parten en seis lajas
export const CuentaO: React.FC<{ rows: { t: string; v: string; f: number }[]; total: string; each: string; fT: number; fE: number; bg?: string; dur: number }> = ({ rows, total, each, fT, fE, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const split = interpolate(f, [fE, fE + 20], [0, 1], { ...CL, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.66} />
      <div style={{ position: "absolute", left: 140, top: 110, width: 900 }}>
        <Kicker txt="LA CUENTA · 6 LAJAS DE 40 × 40" f0={0} />
        {rows.map((r, i) => {
          const p = sp(f, r.f, 14);
          return <div key={i} style={{ display: "flex", justifyContent: "space-between", marginTop: 20, padding: "14px 24px", borderRadius: 8, ...cemento("#8E8B85"), boxShadow: "0 10px 20px rgba(0,0,0,0.45)", transform: `translateX(${(1 - p) * -1000}px)`, fontFamily: SANS, fontWeight: 600, fontSize: 42, color: O.ink }}><span>{r.t}</span><span>{r.v}</span></div>;
        })}
        <div style={{ marginTop: 34, fontFamily: SERIF, fontWeight: 700, fontSize: 90, color: O.tape, textShadow: tsh, opacity: sp(f, fT, 14) }}>{total}</div>
      </div>
      <div style={{ position: "absolute", left: 1150, top: 260, width: 640, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 * split + 4 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ height: 170, borderRadius: 8, ...cemento("#46433F", true), boxShadow: "0 14px 24px rgba(0,0,0,0.55)", opacity: sp(f, fT + i * 3, 14), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: O.chalk, textShadow: tsh }}>{split > 0.5 ? each : ""}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- el premio: el título del cepillado que aparece al «cepillar» una capa gris en círculos
export const PremioO: React.FC<{ src: string; title: string; sub: string; dur: number }> = ({ src, title, sub, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const spots = Array.from({ length: 14 }).map((_, i) => ({ x: 8 + (hash(i * 13) % 84), y: 10 + (hash(i * 17 + 3) % 80), d: 4 + i * 3 }));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Photo src={src} seed={91} dur={dur} />
      <AbsoluteFill style={{ ...cemento("#8F8C86") }}>
        {spots.map((s, i) => { const r = interpolate(f, [s.d, s.d + 22], [0, 260], { ...CL, easing: ease }); return <div key={i} style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, width: r * 2, height: r * 2, marginLeft: -r, marginTop: -r, borderRadius: "50%", backgroundImage: `url(${staticFile(src)})`, backgroundSize: "1920px 1080px", backgroundPosition: `${-(s.x / 100) * 1920 + r}px ${-(s.y / 100) * 1080 + r}px` }} />; })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(10,9,8,0.75), transparent 55%)" }} />
      <div style={{ position: "absolute", left: 120, bottom: 110 }}>
        <Kicker txt={sub} f0={30} />
        <Big txt={title} f0={36} size={130} style={{ marginTop: 10 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- la prueba de la uña: las 48 horas en una regla; la ventana de 18 a 24 h se enciende
export const UnaO: React.FC<{ fA: number; fB: number; bg?: string; dur: number }> = ({ fA, fB, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0, 15);
  const win = interpolate(f, [10, 30], [0, 1], CL); const hand = interpolate(f, [12, dur - 20], [6, 72], CL);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.64} />
      <div style={{ position: "absolute", left: 150, right: 150, top: 300, height: 120, borderRadius: 10, ...cemento("#7D7A74"), transform: `translateY(${(1 - p) * 600}px)`, boxShadow: "0 24px 50px rgba(0,0,0,0.55)" }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${(18 / 48) * 100}%`, width: `${(6 / 48) * 100}%`, background: `rgba(120,190,90,${0.75 * win})`, boxShadow: win > 0.5 ? "0 0 30px rgba(140,220,100,0.6)" : "none" }} />
        {[0, 6, 12, 18, 24, 30, 36, 42, 48].map((h) => <div key={h} style={{ position: "absolute", left: `${(h / 48) * 100}%`, top: 130, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 600, fontSize: 30, color: O.chalk, textShadow: tsh }}>{h} h</div>)}
        <div style={{ position: "absolute", left: `${hand}%`, top: -70, width: 46, height: 60, borderRadius: "46% 46% 20% 20%", background: "linear-gradient(180deg,#F1D9C5,#D9B596)", boxShadow: "inset 0 -14px 0 #F7ECE2, 0 6px 10px rgba(0,0,0,0.4)" }} />
      </div>
      <div style={{ position: "absolute", left: 150, top: 560, width: 760 }}>
        <Kicker txt="LA UÑA MARCA UN SURCO" f0={fA} color="#FF9A80" />
        <Big txt="Todavía blanda: espera" f0={fA + 6} size={58} style={{ marginTop: 10 }} />
      </div>
      <div style={{ position: "absolute", left: 1010, top: 560, width: 760 }}>
        <Kicker txt="NO MARCA · SUELTA ARENA" f0={fB} color="#A9D98E" />
        <Big txt="Ese es el momento" f0={fB + 6} size={58} style={{ marginTop: 10 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- antes y después: la laja de cemento se vuelve piedra en círculos cortos, como pasa el cepillo
export const CepilloO: React.FC<{ a: string; b: string; dur: number }> = ({ a, b, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const path = Array.from({ length: 22 }).map((_, i) => ({ x: 12 + ((i * 37) % 76) + Math.sin(i) * 6, y: 18 + ((i * 53) % 64), d: 6 + i * 4 }));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Photo src={a} seed={21} dur={dur} />
      {path.map((s, i) => { const r = interpolate(f, [s.d, s.d + 18], [0, 210], { ...CL, easing: ease }); return <div key={i} style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, width: r * 2, height: r * 2, marginLeft: -r, marginTop: -r, borderRadius: "50%", backgroundImage: `url(${staticFile(b)})`, backgroundSize: "1920px 1080px", backgroundPosition: `${-(s.x / 100) * 1920 + r}px ${-(s.y / 100) * 1080 + r}px` }} />; })}
      <div style={{ position: "absolute", left: 80, top: 70, fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 4, color: O.chalk, textShadow: tsh }}>{f < 50 ? "CEMENTO" : "PIEDRA"}</div>
    </AbsoluteFill>
  );
};

// ---------- la pregunta final: tres lajas para elegir
export const EligeO: React.FC<{ opts: string[]; bg?: string; dur: number }> = ({ opts, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.6} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center" }}><Big txt="¿Qué harías con la primera laja?" f0={0} size={80} /></div>
      <div style={{ position: "absolute", left: 200, right: 200, top: 420, display: "flex", justifyContent: "space-between" }}>
        {opts.map((t, i) => { const p = sp(f, 10 + i * 9, 12); const glow = 0.5 + 0.5 * Math.sin((f - i * 20) / 10);
          return <div key={i} style={{ width: 440, height: 300, borderRadius: "44% 56% 48% 52% / 52% 46% 54% 48%", ...cemento("#4D4A45", true), display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 ${2 + 4 * glow}px ${O.tape}, 0 26px 50px rgba(0,0,0,0.6)`, transform: `translateY(${(1 - p) * 500}px)`, fontFamily: SERIF, fontWeight: 600, fontSize: 56, color: O.chalk, textShadow: tsh }}>{t}</div>; })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, textAlign: "center" }}><Big txt="Cuéntamelo en los comentarios" f0={40} size={56} color={O.tape} /></div>
    </AbsoluteFill>
  );
};

// ---------- (4) pantalla partida: foto a la derecha mientras el avatar se corre (overlay)
export const SplitO: React.FC<{ src: string; label?: string; dur: number }> = ({ src, label, dur }) => {
  const f = useCurrentFrame(); const p = interpolate(f, [0, 12], [0, 1], { ...CL, easing: ease }); const o = useOut(dur, 10);
  return (
    <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 960, overflow: "hidden", transform: `translateX(${(1 - p * o) * 100}%)`, boxShadow: "-20px 0 40px rgba(0,0,0,0.5)" }}>
      <Photo src={src} seed={33} dur={dur} />
      {label ? <div style={{ position: "absolute", left: 40, bottom: 50, fontFamily: SANS, fontWeight: 600, fontSize: 38, color: O.chalk, textShadow: tsh }}>{label}</div> : null}
    </div>
  );
};
