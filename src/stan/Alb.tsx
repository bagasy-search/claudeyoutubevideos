// Kit del Albañil (alb14): cartel de triplay con tornillos, cinta de papel con plumón, cinta métrica, ticket de ferretería,
// señal amarilla de obra, muestras de material hechas con DOM (ladrillo, block, azulejo, cantera, mármol, madera).
// PURO CSS y DOM: sin SVG, sin PNG de textura, sin blur. Las fotos de fondo van enteras y oscurecidas (Fondo del Kit).
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { loadFont as loadBold } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";
import { Photo, Fondo, CL } from "./Kit";

const { fontFamily: BOLD } = loadBold("normal", { weights: ["600", "800", "900"], subsets: ["latin"] });
const { fontFamily: HAND } = loadHand("normal", { weights: ["600", "700"], subsets: ["latin"] });
export const CU = { cal: "#F3F6F8", masa: "#D6E4EE", maiz: "#FFC23A", azul: "#1F5A8C", chile: "#E8432E", tinta: "#0F1B2A", verde: "#3FAE7E", naranja: "#F07A1A", triplay: "#C9A472", triplay2: "#B48D5A", cinta: "#EFE6CF", gris: "#8E9399" };
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = Easing.out(Easing.cubic);
const sp = (f: number, d = 0, damping = 14) => spring({ frame: f - d, fps: 30, config: { damping, mass: 0.8 } });
const fade = (f: number, dur: number, n = 9) => interpolate(f, [0, 6, dur - n, dur], [0, 1, 1, 0], CL);
export const extrude = (n: number, col: string) => Array.from({ length: n }, (_, i) => `${(i + 1) * 0.6}px ${i + 1}px 0 ${col}`).join(", ") + `, ${n * 0.6 + 6}px ${n + 16}px 30px rgba(0,0,0,.6)`;
const SH = "0 30px 70px rgba(0,0,0,.55), 0 3px 8px rgba(0,0,0,.35)";

// ---------- piezas
const Tornillo: React.FC<{ x: string; y: string }> = ({ x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 22, height: 22, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #EEF0F2, #7D838A 70%)", boxShadow: "0 2px 3px rgba(0,0,0,.5)" }}>
    <div style={{ position: "absolute", left: 4, right: 4, top: 10, height: 2, background: "#4A4F55", transform: "rotate(35deg)" }} />
  </div>
);
export const Triplay: React.FC<{ w: number; h?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ w, h, style, children }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: 6, background: `repeating-linear-gradient(92deg, ${CU.triplay} 0 22px, #C29B66 22px 26px, ${CU.triplay} 26px 61px, ${CU.triplay2} 61px 64px), linear-gradient(180deg, #D3B07E, #B0874F)`, backgroundBlendMode: "multiply", boxShadow: SH, border: "3px solid #8C6A3E", ...style }}>
    <Tornillo x="18px" y="18px" /><Tornillo x="calc(100% - 40px)" y="18px" /><Tornillo x="18px" y="calc(100% - 40px)" /><Tornillo x="calc(100% - 40px)" y="calc(100% - 40px)" />
    {children}
  </div>
);
export const Cinta: React.FC<{ children: React.ReactNode; rot?: number; size?: number; col?: string; style?: React.CSSProperties }> = ({ children, rot = -2, size = 54, col = CU.tinta, style }) => (
  <div style={{ display: "inline-block", padding: "8px 34px 4px", background: CU.cinta, transform: `rotate(${rot}deg)`, clipPath: "polygon(0 6%, 3% 0, 97% 4%, 100% 0, 99% 94%, 96% 100%, 4% 96%, 0 100%)", boxShadow: "0 6px 14px rgba(0,0,0,.35)", fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, lineHeight: 1.1, whiteSpace: "nowrap", ...style }}>{children}</div>
);
const Big: React.FC<{ children: React.ReactNode; size?: number; col?: string; edge?: string; style?: React.CSSProperties }> = ({ children, size = 120, col = CU.maiz, edge = "#6B3A00", style }) => (
  <div style={{ fontFamily: BOLD, fontWeight: 900, fontSize: size, color: col, lineHeight: 1, letterSpacing: 1, textShadow: extrude(Math.round(size / 24), edge), whiteSpace: "nowrap", ...style }}>{children}</div>
);
const Sello: React.FC<{ txt: string; col: string; f: number; at: number; size?: number; rot?: number }> = ({ txt, col, f, at, size = 92, rot = -9 }) => {
  if (f < at) return null; const k = sp(f, at, 11);
  return <div style={{ display: "inline-block", transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * k})`, opacity: cl(k * 1.6), border: `9px solid ${col}`, borderRadius: 14, padding: "4px 30px", fontFamily: BOLD, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, whiteSpace: "nowrap", background: "rgba(255,255,255,.06)" }}>{txt}</div>;
};
// fila de ladrillos que se va llenando: el progreso del video (pasos hechos)
const Hilada: React.FC<{ n: number; N: number; f: number; w?: number }> = ({ n, N, f, w = 74 }) => (
  <div style={{ display: "flex", gap: 6 }}>
    {Array.from({ length: N }, (_, i) => { const done = i + 1 < n, cur = i + 1 === n; const k = cur ? sp(f, 10, 12) : 1;
      return <div key={i} style={{ width: w, height: w * 0.46, borderRadius: 3, transform: cur ? `translateY(${(1 - k) * -120}px)` : undefined, background: done || cur ? `linear-gradient(180deg, ${cur ? "#E0703A" : "#B5552E"}, ${cur ? "#B84F22" : "#8E3E1E"})` : "rgba(255,255,255,.14)", border: done || cur ? "2px solid #6E2E14" : "2px dashed rgba(255,255,255,.35)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BOLD, fontWeight: 800, fontSize: w * 0.26, color: done || cur ? "#FFE9D6" : "rgba(255,255,255,.5)" }}>{i + 1}</div>; })}
  </div>
);
const Cuaderno: React.FC<{ w: number; children: React.ReactNode; rot?: number; style?: React.CSSProperties }> = ({ w, children, rot = -1.5, style }) => (
  <div style={{ width: w, padding: "40px 54px 40px 92px", transform: `rotate(${rot}deg)`, background: "repeating-linear-gradient(0deg, #FBF8EF 0 62px, #BFD0E6 62px 64px)", borderLeft: `12px solid ${CU.naranja}`, boxShadow: SH, borderRadius: 6, position: "relative", ...style }}>
    <div style={{ position: "absolute", left: 70, top: 0, bottom: 0, width: 3, background: "rgba(232,67,46,.45)" }} />
    {children}
  </div>
);

// foto fija a 1920x1080 exactos (coordenadas de la rejilla) con una cámara que se acerca a un punto; lo de adentro viaja con la foto
type Cam = { x: number; y: number; s: number; a?: number; b?: number };
export const FotoFija: React.FC<{ src?: string; cam?: Cam; tint?: number; children?: React.ReactNode }> = ({ src, cam, tint = 0.18, children }) => {
  const f = useCurrentFrame(); const c = cam ?? { x: 960, y: 540, s: 1.06 };
  const t = interpolate(f, [c.a ?? 0, c.b ?? 90], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const sc = 1 + (c.s - 1) * t; let cx = 960 + (c.x - 960) * t, cy = 540 + (c.y - 540) * t;
  cx = Math.max(960 / sc, Math.min(1920 - 960 / sc, cx)); cy = Math.max(540 / sc, Math.min(1080 - 540 / sc, cy));
  return <AbsoluteFill style={{ overflow: "hidden", background: "#111" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${960 - cx * sc}px, ${540 - cy * sc}px) scale(${sc})` }}>
      {src ? <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" }} /> : null}
      <div style={{ position: "absolute", inset: 0, background: `rgba(8,10,14,${tint})` }} />
      {children}
    </div>
  </AbsoluteFill>;
};
// overrides por plano (coordenadas leídas con la rejilla sobre la foto de ese plano)
export const OVA: Record<number, any> = {}; // ajustes por toma: vacíos en alb14c (los de alb14a eran de sus fotos)

// ---------- (1) apertura de paso / regla / error / pregunta / frase de Don Lalo
export const PasoA: React.FC<{ kind: string; n?: number; N?: number; title: string; bg?: string; dur: number; label?: string }> = ({ kind, n = 0, N = 9, title, bg, dur, label }) => {
  const f = useCurrentFrame(); const o = fade(f, dur); const k = sp(f, 0, 13), k2 = sp(f, 7, 15);
  let body: React.ReactNode;
  if (kind === "paso") body = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
      <div style={{ position: "relative", transform: `translateY(${(1 - k) * -700}px) rotate(${(1 - k) * 6}deg)` }}>
        <div style={{ position: "absolute", left: 120, top: -600, width: 6, height: 600, background: "linear-gradient(90deg,#6B5A40,#CDB993,#6B5A40)" }} />
        <div style={{ position: "absolute", right: 120, top: -600, width: 6, height: 600, background: "linear-gradient(90deg,#6B5A40,#CDB993,#6B5A40)" }} />
        <Triplay w={1180} style={{ padding: "54px 70px 60px", textAlign: "center" }}>
          <Big size={150}>{label || "PASO"} {n}</Big>
          <div style={{ fontFamily: BOLD, fontWeight: 800, fontSize: 70, color: CU.tinta, marginTop: 22, opacity: k2, lineHeight: 1.1 }}>{title}</div>
        </Triplay>
      </div>
      <div style={{ opacity: k2 }}><Hilada n={n} N={N} f={f} /></div>
    </div>);
  else if (kind === "camino") body = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, transform: `translateX(${(1 - k) * 900}px)` }}>
      <Triplay w={1120} style={{ padding: "44px 64px 50px", textAlign: "center" }}>
        <div style={{ fontFamily: BOLD, fontWeight: 900, fontSize: 60, color: CU.chile, letterSpacing: 10 }}>CAMINO {n} DE {N}</div>
        <div style={{ fontFamily: BOLD, fontWeight: 800, fontSize: title.length > 24 ? 74 : 92, color: CU.tinta, marginTop: 16, opacity: k2, lineHeight: 1.08 }}>{title}</div>
      </Triplay>
    </div>);
  else if (kind === "zona") body = (
    <div style={{ display: "flex", alignItems: "center", gap: 46, transform: `translateY(${(1 - k) * 120}px)`, opacity: cl(k * 1.4) }}>
      <div style={{ display: "flex", flexDirection: "column-reverse", gap: 10 }}>
        {Array.from({ length: N }, (_, i) => <div key={i} style={{ width: 150, height: 54, borderRadius: 8, background: i + 1 === n ? "#3D7BD9" : "rgba(255,255,255,.18)", border: "4px solid rgba(255,255,255,.75)", fontFamily: BOLD, fontWeight: 900, fontSize: 34, color: "#fff", textAlign: "center", lineHeight: "46px" }}>{i + 1}</div>)}
      </div>
      <Triplay w={1000} style={{ padding: "40px 56px 46px" }}>
        <div style={{ fontFamily: BOLD, fontWeight: 900, fontSize: 56, color: "#2A5DB0", letterSpacing: 8 }}>ZONA {n} DE {N}</div>
        <div style={{ fontFamily: BOLD, fontWeight: 800, fontSize: 76, color: CU.tinta, marginTop: 14, opacity: k2, lineHeight: 1.1 }}>{title}</div>
      </Triplay>
    </div>);
  else if (kind === "grieta") { const w = ease(cl((f - 4) / 16)); body = (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
      <div style={{ opacity: cl(k * 1.4), transform: `translateY(${(1 - k) * -60}px)` }}><Cinta size={58} rot={-2}>Grieta {n} de {N}</Cinta></div>
      <div style={{ position: "relative", padding: "10px 40px" }}>
        <Big size={title.length > 18 ? 110 : 140} col={CU.cal} edge="#2A2118" style={{ transform: `scale(${0.86 + 0.14 * k2})`, opacity: k2 }}>{title}</Big>
        <div style={{ position: "absolute", left: 0, top: "52%", height: 14, width: `${100 * w}%`, background: "#1A140E", clipPath: "polygon(0 40%,8% 10%,15% 70%,24% 20%,31% 85%,40% 30%,47% 75%,55% 15%,63% 80%,71% 25%,79% 70%,86% 20%,93% 65%,100% 35%,100% 55%,93% 90%,86% 45%,79% 95%,71% 50%,63% 100%,55% 40%,47% 100%,40% 55%,31% 100%,24% 45%,15% 95%,8% 35%,0 65%)", opacity: 0.55, mixBlendMode: "multiply" }} />
      </div>
      <div style={{ opacity: k2 }}><Hilada n={n} N={N} f={f} /></div>
    </div>); }
  else if (kind === "regla") body = (
    <div style={{ transform: `scale(${0.7 + 0.3 * k}) rotate(${(1 - k) * -8}deg)`, width: 1240, background: CU.maiz, border: "16px solid #111", borderRadius: 26, boxShadow: SH, overflow: "hidden" }}>
      <div style={{ height: 70, background: "repeating-linear-gradient(-45deg, #111 0 44px, #FFC23A 44px 88px)" }} />
      <div style={{ padding: "40px 60px 54px", textAlign: "center" }}>
        <div style={{ fontFamily: BOLD, fontWeight: 900, fontSize: 64, color: "#111", letterSpacing: 8 }}>REGLA {n} DE {N}</div>
        <div style={{ fontFamily: BOLD, fontWeight: 900, fontSize: title.length > 26 ? 76 : 100, color: "#111", lineHeight: 1.05, marginTop: 16, opacity: k2 }}>{title}</div>
      </div>
    </div>);
  else if (kind === "error") body = (
    <div style={{ position: "relative", textAlign: "center" }}>
      <Big size={130} col={CU.cal} edge="#5A0C06" style={{ transform: `scale(${0.8 + 0.2 * k})` }}>ERROR Nº {n}</Big>
      <div style={{ marginTop: 34, opacity: k2 }}><Cinta size={84} rot={-1.5}>{title}</Cinta></div>
      {[45, -45].map((r, i) => { const w = ease(cl((f - 14 - i * 5) / 9)); return <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: 1250 * w, height: 54, marginLeft: -625, marginTop: -27, transformOrigin: "50% 50%", transform: `rotate(${r * 0.22}deg)`, background: "rgba(232,67,46,.78)", clipPath: "polygon(0 8%, 100% 0, 99% 92%, 1% 100%)", mixBlendMode: "multiply" }} />; })}
    </div>);
  else if (kind === "pregunta") body = (
    <div style={{ transform: `translateY(${(1 - k) * 80}px)`, opacity: cl(k * 1.5), display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 26 }}>
      <Cinta size={50} rot={-3}>Me preguntaron · {n} de 5</Cinta>
      <div style={{ maxWidth: 1350, padding: "50px 70px", background: "#FFFDF7", borderRadius: "46px 46px 46px 10px", boxShadow: SH, fontFamily: BOLD, fontWeight: 800, fontSize: title.length > 40 ? 64 : 80, color: CU.tinta, lineHeight: 1.15 }}>{title}</div>
    </div>);
  else body = (
    <Cuaderno w={1300} rot={-2}><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 88, color: "#22407A", lineHeight: "64px", paddingTop: 6 }}>{title}</div><div style={{ fontFamily: HAND, fontSize: 46, color: CU.chile, marginTop: 14 }}>— Don Lalo</div></Cuaderno>);
  return <AbsoluteFill style={{ opacity: o }}><Fondo src={bg} seed={n + 5} dur={dur} /><AbsoluteFill style={{ background: "rgba(10,14,20,.35)", alignItems: "center", justifyContent: "center" }}>{body}</AbsoluteFill></AbsoluteFill>;
};

// ---------- (2) lista en el cuaderno de obra: cada renglón entra en su palabra
export const ListaA: React.FC<{ head: string; rows: { txt: string; mark?: string; f: number }[]; bg?: string; dur: number; dense?: boolean }> = ({ head, rows, bg, dur, dense }) => {
  const f = useCurrentFrame(); const o = fade(f, dur); const k = sp(f, 0, 16);
  const fs = dense ? 44 : rows.length > 4 ? 52 : 62;
  return (
    <AbsoluteFill style={{ opacity: o }}><Fondo src={bg} seed={7} dur={dur} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `translateY(${(1 - k) * 900}px)` }}>
          <Cuaderno w={dense ? 1560 : 1360}>
            <div style={{ fontFamily: BOLD, fontWeight: 900, fontSize: 40, letterSpacing: 5, color: CU.chile, height: 64, lineHeight: "64px" }}>{head.toUpperCase()}</div>
            {rows.map((r, i) => { const a = cl((f - r.f) / 10); const ok = r.mark === "✓", no = r.mark === "✗";
              return <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, minHeight: dense ? 64 : 128, opacity: a > 0 ? 1 : 0.0 }}>
                <div style={{ width: 66, flex: "0 0 66px", fontFamily: BOLD, fontWeight: 900, fontSize: 46, color: no ? CU.chile : ok ? CU.verde : CU.naranja, transform: `scale(${0.4 + 0.6 * sp(f, r.f, 10)})` }}>{r.mark ?? `${i + 1}.`}</div>
                <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: fs * 1.18, color: "#22407A", lineHeight: 1.05, clipPath: `inset(-20px ${100 - a * 100}% -20px 0)` }}>{r.txt}</div>
              </div>; })}
          </Cuaderno>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- (3) uno contra otro: la pantalla partida por una regla de albañil
export const DosA: React.FC<{ title?: string; a: { t: string; s?: string }; b: { t: string; s?: string }; fa: number; fb: number; srcA?: string; srcB?: string; colA?: string; colB?: string; dur: number }> = ({ title, a, b, fa, fb, srcA, srcB, colA = CU.maiz, colB = CU.cal, dur }) => {
  const f = useCurrentFrame(); const o = fade(f, dur); const cut = ease(cl(f / 14));
  const side = (x: { t: string; s?: string }, src: string | undefined, col: string, at: number, left: boolean) => (
    <div style={{ position: "absolute", top: 0, bottom: 0, left: left ? 0 : 960, width: 960, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: left ? 0 : -960, top: 0, width: 1920, height: 1080 }}>{src ? <Photo src={src} seed={left ? 3 : 9} dur={dur} /> : <AbsoluteFill style={{ background: "#2A2F35" }} />}</div>
      <AbsoluteFill style={{ background: `rgba(8,12,18,${0.32 + 0.18 * cl((f - at) / 8)})` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 420px 300px at 50% 50%, rgba(0,0,0,.55), transparent)", opacity: cl((f - at) / 8) }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 60, textAlign: "center", opacity: cl((f - at) / 8), transform: `translateY(${(1 - sp(f, at, 14)) * 40}px)` }}>
        <Big size={x.t.length > 10 ? 92 : x.t.length > 6 ? 116 : 160} col={col} edge="#111" style={{ transform: `scale(${0.6 + 0.4 * sp(f, at, 10)})` }}>{x.t}</Big>
        {x.s ? <div style={{ marginTop: 34, opacity: cl((f - at - 10) / 8), transform: `translateY(${(1 - sp(f, at + 10, 14)) * 30}px)` }}><Cinta size={86}>{x.s}</Cinta></div> : null}
      </AbsoluteFill>
    </div>);
  return (
    <AbsoluteFill style={{ opacity: o, background: "#111" }}>
      {side(a, srcA, colA, fa, true)}{side(b, srcB, colB, fb, false)}
      <div style={{ position: "absolute", left: 948, top: title ? 150 : 0, width: 24, height: (title ? 930 : 1080) * cut, background: "linear-gradient(90deg,#9BA3AB,#E9EDF0 45%,#7F878F)", boxShadow: "0 0 18px rgba(0,0,0,.6)" }} />
      {title ? <div style={{ position: "absolute", top: 60, left: 0, right: 0, textAlign: "center" }}><Cinta size={64} rot={1}>{title}</Cinta></div> : null}
    </AbsoluteFill>
  );
};

// ---------- (4) número grande que cae como block: 9 pasos, 8 reglas, 5 errores
export const NumA: React.FC<{ n: string; label: string; sub?: string; bg?: string; dur: number }> = ({ n, label, sub, bg, dur }) => {
  const f = useCurrentFrame(); const o = fade(f, dur); const k = sp(f, 0, 9);
  return (
    <AbsoluteFill style={{ opacity: o }}><Fondo src={bg} seed={11} dur={dur} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 10 }}>
        <Big size={380} style={{ transform: `translateY(${(1 - k) * -800}px)` }}>{n}</Big>
        <Big size={110} col={CU.cal} edge="#111" style={{ opacity: cl((f - 8) / 8) }}>{label}</Big>
        {sub ? <div style={{ marginTop: 26, opacity: cl((f - 16) / 8) }}><Cinta size={50}>{sub}</Cinta></div> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- (5) ciclo: una gota que viaja por el corte del muro (loop) o los pasos uno por vez, grandes
export const CadenaA: React.FC<{ steps: string[]; marks: number[]; bg?: string; dur: number; loop?: boolean }> = ({ steps, marks, bg, dur, loop }) => {
  const f = useCurrentFrame(); const o = fade(f, dur); const n = steps.length; const M = [...marks].sort((x, y) => x - y);
  let cur = 0; for (let i = 0; i < n; i++) if (f >= M[i]) cur = i;
  const txt = (i: number) => { const a = sp(f, M[i], 13); const out = i < cur ? cl((f - M[i + 1]) / 8) : 0;
    return <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 0, opacity: cl(a * 1.5) * (1 - out), transform: `translateY(${(1 - a) * 70 - out * 60}px)` }}>
      <div style={{ fontFamily: BOLD, fontWeight: 900, fontSize: 52, letterSpacing: 6, color: CU.maiz, textShadow: "0 3px 10px #000" }}>{i + 1} DE {n}</div>
      <Big size={steps[i].length > 22 ? 84 : 112} col={CU.cal} edge="#111" style={{ whiteSpace: "normal", lineHeight: 1.05, marginTop: 10 }}>{steps[i]}</Big>
    </div>; };
  if (!loop) return (
    <AbsoluteFill style={{ opacity: o }}><Fondo src={bg} seed={13} dur={dur} /><AbsoluteFill style={{ background: "radial-gradient(ellipse 900px 420px at 50% 50%, rgba(0,0,0,.5), transparent)" }} />
      <div style={{ position: "absolute", left: 160, right: 160, top: 400, height: 300, textAlign: "center" }}>{steps.map((_, i) => (i === cur || i === cur - 1) && f >= M[i] ? txt(i) : null)}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, display: "flex", justifyContent: "center", gap: 26 }}>{steps.map((_, i) => <div key={i} style={{ width: 120, height: 14, borderRadius: 7, background: f >= M[i] ? CU.maiz : "rgba(255,255,255,.25)", boxShadow: "0 2px 8px rgba(0,0,0,.6)" }} />)}</div>
    </AbsoluteFill>);
  // sobre la pared real: la humedad sube desde el piso (pasos 1-2), se seca (3) y la sal de la foto se enciende blanca (4)
  const st = (i: number) => (i < n && f >= M[i] ? ease(cl((f - M[i]) / 24)) : 0);
  const wet = n >= 4 ? Math.max(0, st(0) * 0.45 + st(1) * 0.55 - st(2)) : st(0) * 0.5 + st(1) * 0.5 - st(2) * 0.4;
  const salt = st(n - 1);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <FotoFija src={bg} tint={0.18} cam={{ x: 700, y: 560, s: 1.12, a: 0, b: dur }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 1080 * Math.max(0, wet), background: "linear-gradient(0deg, rgba(20,60,110,.62), rgba(20,60,110,.35) 70%, rgba(20,60,110,0))", mixBlendMode: "multiply" }} />
        {wet > 0.05 ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 1080 * wet - 30, height: 60, background: "linear-gradient(0deg, rgba(20,60,110,0), rgba(20,60,110,.45), rgba(20,60,110,0))", mixBlendMode: "multiply" }} /> : null}
        <div style={{ position: "absolute", left: 0, top: 120, width: 1300, height: 860, background: "radial-gradient(ellipse 620px 380px at 45% 50%, rgba(255,255,255,.75), rgba(255,255,255,0) 70%)", mixBlendMode: "screen", opacity: salt }} />
      </FotoFija>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0) 55%, rgba(0,0,0,.6) 80%)" }} />
      <div style={{ position: "absolute", left: 1180, right: 60, top: 380, height: 360 }}>{steps.map((_, i) => (i === cur || i === cur - 1) && f >= M[i] ? txt(i) : null)}</div>
    </AbsoluteFill>
  );
};

// ---------- (6) la palabra técnica escrita en la pared con el plumón, y abajo qué quiere decir
export const PalabraA: React.FC<{ word: string; sub?: string; sub2?: string; bg?: string; dur: number; col?: string }> = ({ word, sub, sub2, bg, dur, col = CU.cal }) => {
  const f = useCurrentFrame(); const o = fade(f, dur); const a = cl(f / Math.max(10, word.length * 1.2));
  return (
    <AbsoluteFill style={{ opacity: o }}><Fondo src={bg} seed={17} dur={dur} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 36, padding: 80, textAlign: "center" }}>
        <Big size={word.length > 26 ? 104 : word.length > 16 ? 124 : 150} col={col} edge="#111" style={{ whiteSpace: "normal", maxWidth: 1620, lineHeight: 1.08, clipPath: `inset(-40px ${100 - a * 100}% -40px -40px)` }}>{word}</Big>
        {sub ? <div style={{ opacity: cl((f - 14) / 8) }}><Cinta size={60}>{sub}</Cinta></div> : null}
        {sub2 ? <div style={{ opacity: cl((f - 26) / 8) }}><Cinta size={52} rot={1.5}>{sub2}</Cinta></div> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- (7) la gota que burbujea: sobre la foto fija, en el punto donde cae el gotero (coordenadas de la rejilla)
export const GotaA: React.FC<{ label: string; bg?: string; dur: number; at?: { x: number; y: number }; tip?: { x: number; y: number }; cam?: Cam }> = ({ label, bg, dur, at = { x: 960, y: 620 }, tip, cam }) => {
  const f = useCurrentFrame(); const o = fade(f, dur); const hit = 20; const t0 = tip ?? { x: at.x, y: at.y - 200 };
  const y = interpolate(f, [6, hit], [t0.y, at.y - 6], { ...CL, easing: Easing.in(Easing.quad) });
  const [w1, w2] = label.split(" = ");
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <FotoFija src={bg} cam={cam ?? { x: at.x, y: at.y, s: 1.8, a: 0, b: 40 }} tint={0.08}>
        {f >= 6 && f < hit ? <div style={{ position: "absolute", left: t0.x - 5, top: y, width: 10, height: 14, borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%", background: "radial-gradient(circle at 40% 35%, #FFFFFF, #CFE2EE 60%, #9DB8C9)", boxShadow: "0 2px 3px rgba(0,0,0,.35)" }} /> : null}
        {f >= hit ? <div style={{ position: "absolute", left: at.x - 34, top: at.y - 9, width: 68, height: 18, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 45%, rgba(240,244,246,.55), rgba(225,232,236,.3) 60%, rgba(200,210,215,0) 100%)", transform: `scale(${0.3 + 0.9 * cl((f - hit) / 30)})` }} /> : null}
        {Array.from({ length: 46 }, (_, i) => { const st = hit + 2 + (i % 16) * 2.2; if (f < st) return null; const life = ((f - st) % 34) / 34; const sp2 = 0.4 + 0.6 * cl((f - hit) / 40);
          const x = at.x + (((i * 37) % 80) - 40) * sp2; const r = 3.5 + (i % 5) * 2.2; const yy = at.y - 2 + (((i * 13) % 10) - 5) * 0.8 - life * (8 + (i % 4) * 4);
          return <div key={i} style={{ position: "absolute", left: x - r, top: yy - r, width: r * 2 * (1 + life * 0.6), height: r * 2 * (1 + life * 0.6), borderRadius: "50%", background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,.95) 0 18%, rgba(255,255,255,.12) 40%, rgba(255,255,255,.05) 62%, rgba(255,255,255,.55) 80%, rgba(255,255,255,0) 100%)", boxShadow: "0 1px 1px rgba(60,60,60,.18)", opacity: life > 0.85 ? (1 - life) * 6 : 1 }} />; })}
      </FotoFija>
      <div style={{ position: "absolute", left: 90, bottom: 110, opacity: cl((f - hit - 10) / 8), transform: `translateY(${(1 - sp(f, hit + 10, 12)) * 60}px)` }}>
        <Big size={120} col={CU.maiz} edge="#3A2000">{w1}</Big>
        {w2 ? <div style={{ marginTop: 22, opacity: cl((f - hit - 24) / 8) }}><Cinta size={66}>= {w2}</Cinta></div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- (8) cinta métrica que se estira sobre la superficie real (tramo horizontal y, si hay, el alto)
export const MetroA: React.FC<{ big: string; sub?: string; bg?: string; dur: number; tape?: { x0: number; x1: number; y: number; up?: number } }> = ({ big, sub, bg, dur, tape }) => {
  const f = useCurrentFrame(); const o = fade(f, dur); const T = tape ?? { x0: 140, x1: 1780, y: 900 };
  const w = ease(cl((f - 4) / 26)); const L = (T.x1 - T.x0) * w; const hU = T.up ? (T.y - T.up) * ease(cl((f - 34) / 18)) : 0;
  const nums = (big.match(/(\d+)\s*m\b/) || [])[1]; const N = nums ? Math.min(10, parseInt(nums)) : 0;
  const strip = "repeating-linear-gradient(90deg, #111 0 3px, transparent 3px 22px), linear-gradient(180deg, #FFD54A, #F2B70E)";
  return (
    <AbsoluteFill style={{ opacity: o }}><FotoFija src={bg} tint={0.22} cam={{ x: 960, y: 540, s: 1.05, a: 0, b: dur }}>
      <div style={{ position: "absolute", left: T.x0, top: T.y - 30, width: L, height: 60, background: strip, backgroundSize: "100% 30%, 100% 100%", backgroundRepeat: "repeat-x", boxShadow: "0 10px 18px rgba(0,0,0,.55)", borderRadius: 3 }}>
        <div style={{ position: "absolute", right: -14, top: -8, width: 16, height: 76, background: "linear-gradient(90deg,#9AA0A6,#E3E6E8,#7E848A)", borderRadius: 3 }} />
        {N > 0 ? Array.from({ length: N + 1 }, (_, i) => { const x = ((T.x1 - T.x0) * i) / N; return x <= L ? <div key={i} style={{ position: "absolute", left: Math.max(0, x - 30 - (i === N ? 30 : 0)), top: 18, width: 60, textAlign: "center", fontFamily: BOLD, fontWeight: 900, fontSize: 36, color: "#111" }}>{i}</div> : null; }) : null}
      </div>
      {T.up ? <div style={{ position: "absolute", left: T.x0, top: T.y - 30 - hU, width: 60, height: hU, background: "repeating-linear-gradient(0deg, #111 0 3px, transparent 3px 22px), linear-gradient(90deg, #FFD54A, #F2B70E)", backgroundSize: "30% 100%, 100% 100%", backgroundRepeat: "repeat-y", boxShadow: "8px 0 16px rgba(0,0,0,.5)", borderRadius: 3 }} /> : null}
    </FotoFija>
      <div style={{ position: "absolute", left: 90, top: 110, opacity: cl((f - 10) / 8), transform: `translateY(${(1 - sp(f, 10, 13)) * -50}px)` }}>
        <Big size={big.length > 16 ? 112 : 140} col={CU.cal} edge="#111">{big}</Big>
        {sub ? <div style={{ marginTop: 28, opacity: cl((f - 40) / 8) }}><Cinta size={88}>{sub}</Cinta></div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- (9) ticket de ferretería que se imprime renglón por renglón (de costado, nunca encima de la persona)
export const TicketA: React.FC<{ rows: { name: string; price: string; f: number }[]; total?: string; ft?: number; head?: string; bg?: string; dur: number; side?: string }> = ({ rows, total, ft = 999, head = "FERRETERÍA DE LA ESQUINA", bg, dur, side }) => {
  const f = useCurrentFrame(); const o = fade(f, dur); const last = Math.max(...rows.map((r) => r.f), total ? ft : 0);
  const L = Math.max(...rows.map((r) => r.name.length + r.price.length)); const fsz = L > 28 ? 32 : L > 22 ? 38 : side ? 40 : 46; const h = 190 + rows.reduce((s, r) => s + 104 * ease(cl((f - r.f + 2) / 7)), 0) + (total ? 156 * ease(cl((f - ft + 2) / 7)) : 0); const W = side ? 860 : 980;
  const k = sp(f, 0, 15); const teeth = Array.from({ length: 34 }, (_, i) => `${(i * 100) / 33}% ${i % 2 ? "100%" : "calc(100% - 10px)"}`).reverse().join(", ");
  return (
    <AbsoluteFill style={{ opacity: o }}><Fondo src={bg} seed={29} dur={dur} />
      <div style={{ position: "absolute", top: 90, left: side === "right" ? 1920 - W - 30 : side === "left" ? 50 : 960 - W / 2, width: W, opacity: cl(k * 1.6), transform: `translateY(${(1 - k) * -70}px) rotate(${side ? 1.5 : -1}deg)` }}>
        <div style={{ height: Math.max(170, h), overflow: "hidden", background: "#FBFBF7", boxShadow: SH, padding: "30px 40px", fontFamily: "'Courier New', monospace", color: "#222", clipPath: `polygon(0 0, 100% 0, ${teeth})` }}>
          <div style={{ textAlign: "center", fontSize: 36, fontWeight: 700, letterSpacing: 2 }}>{head}</div>
          <div style={{ borderBottom: "3px dashed #999", margin: "14px 0 16px" }} />
          {rows.map((r, i) => f >= r.f ? <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 20, fontSize: fsz, whiteSpace: "nowrap", fontWeight: 700, minHeight: 104, alignItems: "center", lineHeight: 1.05, opacity: cl((f - r.f) / 5) }}><span>{r.name}</span><span style={{ whiteSpace: "nowrap" }}>{r.price}</span></div> : null)}
          {total && f >= ft ? <><div style={{ borderBottom: "3px dashed #999", margin: "6px 0 14px" }} /><div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 50, fontWeight: 700 }}><span style={{ marginRight: 24 }}>TOTAL</span><span style={{ color: CU.chile, fontSize: side ? 62 : 68, transform: `scale(${0.6 + 0.4 * sp(f, ft, 9)})`, display: "inline-block", whiteSpace: "nowrap" }}>{total}</span></div></> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- (10) precio: escrito con plumón en la etiqueta blanca real del envase (si hay coordenadas); si no, etiqueta colgada a un costado
export const PrecioA: React.FC<{ item: string; price: string; bg?: string; dur: number; label?: { x: number; y: number; w: number; h: number }; cam?: Cam }> = ({ item, price, bg, dur, label, cam }) => {
  const f = useCurrentFrame(); const o = fade(f, dur);
  if (label) { const wr = cl((f - 30) / 22); const m = price.match(/^(.*?)(US\$.*)$/); const pre = m ? m[1].trim() : ""; const amt = m ? m[2] : price;
    return (
      <AbsoluteFill style={{ opacity: o }}>
        <FotoFija src={bg} cam={cam} tint={0.05}>
          <div style={{ position: "absolute", left: label.x, top: label.y, width: label.w, height: label.h, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: "rotate(-3deg)", mixBlendMode: "multiply", clipPath: `inset(0 ${100 - wr * 100}% 0 0)` }}>
            {pre ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 19, color: "#1B2C8F", lineHeight: 1 }}>{pre}</div> : null}
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 36, color: "#C0201A", lineHeight: 1 }}>{amt}</div>
          </div>
        </FotoFija>
      </AbsoluteFill>); }
  const k = sp(f, 0, 7); const sw = 9 * Math.exp(-f / 20) * Math.cos(f / 4);
  return (
    <AbsoluteFill style={{ opacity: o }}><Fondo src={bg} seed={31} dur={dur} />
      <div style={{ position: "absolute", left: 1460, top: -40, transformOrigin: "0 0", transform: `rotate(${sw}deg) translateY(${(1 - k) * -500}px)` }}>
        <div style={{ position: "absolute", left: -14, top: 30, width: 28, height: 28, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #F25C4A, #8E1C12)", boxShadow: "0 3px 5px rgba(0,0,0,.5)" }} />
        <div style={{ position: "absolute", left: -3, top: 44, width: 6, height: 230, background: "linear-gradient(90deg,#8E6B3E,#D8C19A 50%,#8E6B3E)" }} />
        <div style={{ position: "absolute", left: -300, top: 260, width: 600, padding: "84px 40px 44px", textAlign: "center", background: "linear-gradient(170deg,#FFF4D6,#F4DFA8)", clipPath: "polygon(14% 0, 86% 0, 100% 13%, 100% 100%, 0 100%, 0 13%)", boxShadow: SH }}>
          <div style={{ position: "absolute", left: 282, top: 24, width: 36, height: 36, borderRadius: "50%", background: "#2B211A", boxShadow: "0 0 0 8px #E9DCC2" }} />
          <div style={{ fontFamily: BOLD, fontWeight: 800, fontSize: 52, color: CU.tinta, lineHeight: 1.1 }}>{item}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: price.length > 16 ? 72 : price.length > 11 ? 88 : 120, color: CU.chile, lineHeight: 1.05, marginTop: 10, whiteSpace: "nowrap" }}>{price}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- (11) peligro: sobre la foto real; si están los dos envases, sus nombres arriba y el gas que sube entre ellos; el sello abajo, sin pisar
export const PeligroA: React.FC<{ line: string; sub?: string; stamp?: string; fs?: number; bg?: string; dur: number; botA?: { x: number; y: number; t: string }; botB?: { x: number; y: number; t: string }; mid?: { x: number; y: number } }> = ({ line, sub, stamp, fs = 26, bg, dur, botA, botB, mid }) => {
  const f = useCurrentFrame(); const o = fade(f, dur);
  if (botA && botB && mid) { const g = ease(cl((f - 10) / 30));
    const tag = (b: { x: number; y: number; t: string }, at: number) => <div style={{ position: "absolute", left: b.x, top: b.y, transform: `translate(-50%, -100%) translateY(${(1 - sp(f, at, 12)) * -80}px)`, opacity: cl((f - at) / 6) }}><Cinta size={80} rot={b.x < 960 ? -3 : 3} col={CU.chile}>{b.t}</Cinta></div>;
    const eq = line.split("=").pop()?.trim() ?? "GAS";
    return (
      <AbsoluteFill style={{ opacity: o }}>
        <FotoFija src={bg} tint={0.1 + 0.15 * g} cam={{ x: mid.x, y: 480, s: 1.08, a: 0, b: dur }}>
          {Array.from({ length: 7 }, (_, i) => { const ph = ((f * 0.9 + i * 31) % 90) / 90; const x = mid.x + (i - 3) * 150 * g; const yy = mid.y - ph * 360 * g;
            return <div key={i} style={{ position: "absolute", left: x - 230, top: yy - 150, width: 460, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 50%, rgba(196,214,92,.8), rgba(176,196,70,.45) 45%, rgba(170,190,60,0) 70%)", opacity: g * (ph < 0.15 ? ph / 0.15 : 1 - (ph - 0.15) / 0.85) }} />; })}
        </FotoFija>
        {tag(botA, 2)}{tag(botB, 10)}
        <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", opacity: cl((f - 18) / 6), transform: `scale(${0.7 + 0.3 * sp(f, 18, 10)})` }}><Big size={170} col={CU.cal} edge="#3F4A08">= {eq}</Big></div>
        {stamp ? <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center" }}><Sello txt={stamp} col={CU.chile} f={f} at={fs + 12} size={120} rot={-6} /></div> : null}
      </AbsoluteFill>); }
  return (
    <AbsoluteFill style={{ opacity: o }}><Fondo src={bg} seed={37} dur={dur} /><AbsoluteFill style={{ background: "radial-gradient(ellipse 1100px 600px at 50% 50%, rgba(60,8,4,.55), rgba(60,8,4,.2))" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 52%, rgba(20,4,2,.82) 74%, rgba(20,4,2,.9))", opacity: cl((f - 2) / 8) }} />
      <div style={{ position: "absolute", left: 120, right: 120, top: stamp ? 600 : 790, textAlign: "center", opacity: cl((f - 4) / 8), transform: `translateY(${(1 - sp(f, 4, 13)) * 50}px)` }}>
        <Big size={line.length > 28 ? 92 : 124} col={CU.cal} edge="#5A0C06" style={{ whiteSpace: "normal", lineHeight: 1.08 }}>{line}</Big>
        {sub ? <div style={{ marginTop: 30, opacity: cl((f - 14) / 8) }}><Cinta size={60}>{sub}</Cinta></div> : null}
      </div>
      {stamp ? <div style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center" }}><Sello txt={stamp} col={CU.chile} f={f} at={fs} size={100} /></div> : null}
    </AbsoluteFill>
  );
};

// ---------- (12) reloj de cocina: la aguja recorre los minutos y al lado, uno por vez, el veredicto de cada tiempo
export const RelojA: React.FC<{ big: string; sweep?: number; chips?: { t: string; ok: boolean; f: number }[]; bg?: string; dur: number }> = ({ big, sweep = 360, chips, bg, dur }) => {
  const f = useCurrentFrame(); const o = fade(f, dur); const k = sp(f, 0, 14);
  const cs = chips ?? []; let ci = -1; cs.forEach((c, i) => { if (f >= c.f) ci = i; });
  const deg = (i: number) => Math.min(360, (parseFloat(cs[i].t) || 0) * 6);
  const a = cs.length ? (ci < 0 ? 0 : (ci > 0 ? deg(ci - 1) : 0) + (deg(ci) - (ci > 0 ? deg(ci - 1) : 0)) * ease(cl((f - cs[ci].f) / 20))) : interpolate(f, [6, Math.min(dur - 10, 60)], [0, sweep], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const c = ci >= 0 ? cs[ci] : null;
  return (
    <AbsoluteFill style={{ opacity: o }}><Fondo src={bg} seed={41} dur={dur} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 110 }}>
        <div style={{ position: "relative", width: 560, height: 560, borderRadius: "50%", background: `conic-gradient(${c ? (c.ok ? "rgba(63,174,126,.92)" : "rgba(232,67,46,.9)") : "rgba(240,122,26,.9)"} 0 ${a}deg, #FFFDF7 ${a}deg 360deg)`, border: "24px solid #E9EDF0", boxShadow: SH, transform: `scale(${0.6 + 0.4 * k})`, opacity: cl(k * 1.5) }}>
          {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 252, top: 6, width: 8, height: 34, background: CU.tinta, transformOrigin: "4px 250px", transform: `rotate(${i * 30}deg)` }} />)}
          {[0, 15, 30, 45].map((m, i) => <div key={m} style={{ position: "absolute", left: 256 + Math.sin((i * Math.PI) / 2) * 190 - 40, top: 256 - Math.cos((i * Math.PI) / 2) * 190 - 26, width: 80, textAlign: "center", fontFamily: BOLD, fontWeight: 800, fontSize: 40, color: CU.tinta }}>{m}</div>)}
          <div style={{ position: "absolute", left: 248, top: 50, width: 16, height: 228, background: CU.tinta, borderRadius: 8, transformOrigin: "8px 206px", transform: `rotate(${a}deg)` }} />
          <div style={{ position: "absolute", left: 236, top: 236, width: 40, height: 40, borderRadius: "50%", background: CU.chile }} />
        </div>
        <div style={{ width: 640, height: 420, position: "relative" }}>
          {c ? <div key={ci} style={{ position: "absolute", left: 0, top: 40, transform: `translateY(${(1 - sp(f, c.f, 12)) * 60}px)`, opacity: cl((f - c.f) / 6) }}>
            <Big size={c.t.length > 7 ? 112 : 150} col={CU.cal} edge="#111" style={{ whiteSpace: "normal", width: 640, lineHeight: 1.02 }}>{c.t}</Big>
            <div style={{ marginTop: 30, marginLeft: 10 }}><Sello txt={c.ok ? "SÍ" : "NO"} col={c.ok ? CU.verde : CU.chile} f={f} at={c.f + 14} size={170} rot={c.ok ? -4 : -8} /></div>
          </div> : <div style={{ position: "absolute", left: 0, top: big.length > 6 ? 70 : 120, width: 640, opacity: cl((f - 8) / 8), transform: `translateY(${(1 - sp(f, 8, 13)) * 50}px)` }}><Big size={big.length > 6 ? 128 : 170} col={CU.cal} edge="#111" style={{ whiteSpace: "normal", lineHeight: 1.02 }}>{big}</Big></div>}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- (13) proporción: dos frascos que se llenan (1 : 1, 1 : 10, 5 % contra 30 %)
export const FrascosA: React.FC<{ head: string; items: { name: string; lvl: number; col: string; label: string; f: number }[]; foot?: string; bg?: string; dur: number }> = ({ head, items, foot, bg, dur }) => {
  const f = useCurrentFrame(); const o = fade(f, dur);
  return (
    <AbsoluteFill style={{ opacity: o }}><Fondo src={bg} seed={43} dur={dur} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 40 }}>
        <Cinta size={56}>{head}</Cinta>
        <div style={{ display: "flex", gap: 120, alignItems: "flex-end" }}>
          {items.map((it, i) => { const l = it.lvl * ease(cl((f - it.f) / 24));
            return <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 92, color: CU.maiz, textShadow: "0 3px 12px #000", opacity: cl((f - it.f - 10) / 8) }}>{it.label}</div>
              <div style={{ position: "relative", width: 280, height: 440, borderRadius: "30px 30px 46px 46px", border: "8px solid rgba(235,245,250,.85)", background: "rgba(220,235,245,.12)", overflow: "hidden", boxShadow: "inset 0 0 30px rgba(255,255,255,.25), 0 24px 50px rgba(0,0,0,.5)" }}>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${l * 100}%`, background: `linear-gradient(180deg, ${it.col}, ${it.col}CC)` }} />
                <div style={{ position: "absolute", left: 30, top: 20, bottom: 20, width: 18, borderRadius: 9, background: "rgba(255,255,255,.35)" }} />
              </div>
              <div style={{ fontFamily: BOLD, fontWeight: 800, fontSize: 52, color: CU.cal, textShadow: "0 3px 10px #000" }}>{it.name}</div>
            </div>; })}
        </div>
        {foot ? <div style={{ opacity: cl((f - 40) / 8) }}><Cinta size={50} rot={1}>{foot}</Cinta></div> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- (14) muestras de material hechas con DOM + sello SÍ / NO / CON CUIDADO
const Muestra: React.FC<{ mat: string; w: number; h: number }> = ({ mat, w, h }) => {
  const box: React.CSSProperties = { position: "relative", width: w, height: h, overflow: "hidden", borderRadius: 10, boxShadow: SH };
  const grid = (bw: number, bh: number, col: string, mortar: string, off = true) => (
    <div style={{ ...box, background: mortar }}>{Array.from({ length: Math.ceil(h / bh) + 1 }, (_, r) => Array.from({ length: Math.ceil(w / bw) + 2 }, (_, c) => (
      <div key={r + "-" + c} style={{ position: "absolute", left: c * bw - (off && r % 2 ? bw / 2 : 0), top: r * bh, width: bw - 8, height: bh - 8, borderRadius: 3, background: `linear-gradient(${(r * 37 + c * 53) % 180}deg, ${col}, ${col}DD)`, filter: `brightness(${0.88 + ((r * 7 + c * 13) % 5) * 0.05})` }} />)))}</div>);
  const speck = (base: string, dot: string, n = 120) => (
    <div style={{ ...box, background: base }}>{Array.from({ length: n }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 131) % w, top: (i * 71) % h, width: 3 + (i % 4) * 3, height: 3 + (i % 3) * 3, borderRadius: "50%", background: dot, opacity: 0.5 }} />)}</div>);
  switch (mat) {
    case "ladrillo": return grid(150, 62, "#B4532A", "#C9C0B0");
    case "block": return grid(240, 120, "#9EA2A3", "#7F8384");
    case "azulejo": return grid(150, 150, "#EDEFF0", "#B8B2A6", false);
    case "piso": return speck("linear-gradient(160deg,#A9ABAA,#8F9291)", "#5E6261", 160);
    case "revoque": return speck("linear-gradient(160deg,#E8DFCB,#D6CAB0)", "#B7A98A", 140);
    case "cantera": return speck("linear-gradient(150deg,#D9A08C,#C4826C)", "#8E4E3C", 180);
    case "marmol": return <div style={{ ...box, background: "linear-gradient(115deg, transparent 40%, rgba(120,120,130,.35) 41%, transparent 43%), linear-gradient(60deg, transparent 62%, rgba(120,120,130,.3) 63%, transparent 64.5%), linear-gradient(160deg,#F5F4F0,#E2E0DA)" }} />;
    case "caliza": return speck("linear-gradient(160deg,#E7DDC6,#D3C6A6)", "#A7946C", 90);
    case "travertino": return <div style={{ ...box, background: "repeating-linear-gradient(4deg, #D9C29A 0 26px, #C9AE80 26px 31px, #E2CFAA 31px 58px, #B89A6A 58px 61px)" }}>{Array.from({ length: 26 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 97) % w, top: (i * 53) % h, width: 10 + (i % 4) * 6, height: 4 + (i % 3) * 2, borderRadius: "50%", background: "#7E6440", opacity: 0.6 }} />)}</div>;
    case "granito": return speck("linear-gradient(160deg,#4A4A4C,#2E2E30)", "#D8D8D8", 220);
    case "madera": return <div style={{ ...box, background: "repeating-linear-gradient(0deg, #9C6B3E 0 18px, #8A5B32 18px 22px, #A97748 22px 40px)" }} />;
    case "metal": case "aluminio": case "herreria": return <div style={{ ...box, background: "linear-gradient(135deg,#C9CED3,#8E959C 50%,#D9DDE1)" }} />;
    case "yeso": case "tablaroca": return <div style={{ ...box, background: "linear-gradient(160deg,#FAFAF7,#EAE9E3)" }} />;
    default: return <div style={{ ...box, background: "#999" }} />;
  }
};
export const SuperficieA: React.FC<{ mats: { mat: string; name: string; f: number }[]; verdict: string; vf: number; sub?: string; bg?: string; dur: number }> = ({ mats, verdict, vf, sub, bg, dur }) => {
  const f = useCurrentFrame(); const o = fade(f, dur); const n = mats.length; const w = n === 1 ? 900 : n === 2 ? 640 : n === 3 ? 470 : 380, h = n === 1 ? 560 : 440;
  const col = verdict === "SÍ" ? CU.verde : verdict === "NO" ? CU.chile : CU.maiz;
  return (
    <AbsoluteFill style={{ opacity: o }}><Fondo src={bg} seed={47} dur={dur} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 40 }}>
        <div style={{ display: "flex", gap: 34 }}>
          {mats.map((m, i) => { const a = sp(f, m.f, 14); return <div key={i} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: cl(a * 1.5), transform: `translateY(${(1 - a) * 60}px)` }}>
            <Muestra mat={m.mat} w={w} h={h} />
            <div style={{ fontFamily: BOLD, fontWeight: 900, fontSize: n > 3 ? 66 : 74, color: CU.cal, textShadow: "0 4px 12px #000, 0 0 3px #000", whiteSpace: "nowrap" }}>{m.name}</div>
            {verdict.length <= 4 ? <div style={{ position: "absolute", left: 0, right: 0, top: h / 2 - 70, textAlign: "center" }}><Sello txt={verdict} col={col} f={f} at={vf + i * 5} size={n > 3 ? 96 : 120} rot={-10 + (i % 2) * 6} /></div> : null}
          </div>; })}
        </div>
        {sub ? <div style={{ opacity: cl((f - vf - 8) / 8) }}><Cinta size={50}>{sub}</Cinta></div> : null}
      </AbsoluteFill>
      {verdict.length > 4 ? <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center" }}><Sello txt={verdict} col={col} f={f} at={vf} size={100} /></div> : null}
    </AbsoluteFill>
  );
};

// ---------- (15) corte de la pared: seca (el ácido se mete) contra mojada (se queda en la costra)
export const CorteA: React.FC<{ fa: number; fb: number; dur: number; bg?: string }> = ({ fa, fb, dur, bg }) => {
  const f = useCurrentFrame(); const o = fade(f, dur);
  const pared = (x: number, title: string, wet: boolean, at: number) => { const d = ease(cl((f - at) / 40)); const depth = wet ? 26 : 300;
    return <div style={{ position: "absolute", left: x, top: 170, width: 760 }}>
      <div style={{ textAlign: "center", marginBottom: 26, opacity: cl((f - at + 8) / 8) }}><Cinta size={58} col={wet ? "#1F5A8C" : CU.chile}>{title}</Cinta></div>
      <div style={{ position: "relative", height: 560, borderRadius: 8, overflow: "hidden", boxShadow: SH, background: "repeating-linear-gradient(0deg, #B4532A 0 70px, #CFC6B6 70px 80px)" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 120, background: "linear-gradient(90deg,#E8DFCB,#D7CBB2)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 28, background: "#F7F7F2" }} />
        {wet ? <div style={{ position: "absolute", left: 28, top: 0, bottom: 0, width: 360, background: "linear-gradient(90deg, rgba(31,90,140,.55), rgba(31,90,140,.1))" }} /> : null}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: depth * d, background: "linear-gradient(90deg, rgba(240,122,26,.9), rgba(240,122,26,.35))" }} />
      </div>
      <div style={{ textAlign: "center", marginTop: 22, fontFamily: BOLD, fontWeight: 800, fontSize: 46, color: CU.cal, textShadow: "0 3px 10px #000", opacity: cl((f - at - 30) / 8) }}>{wet ? "se queda en la costra" : "el ácido se mete adentro"}</div>
    </div>; };
  return <AbsoluteFill style={{ opacity: o }}><Fondo src={bg} seed={53} dur={dur} /><AbsoluteFill style={{ background: "rgba(10,14,20,.45)" }} />{pared(150, "pared SECA", false, fa)}{pared(1010, "pared MOJADA antes", true, fb)}</AbsoluteFill>;
};

// ---------- (16) el Manual del Albañil: el libro se abre en su página; o el código para llegar
export const ManualA: React.FC<{ arreglo?: string; page?: string; lines: string[]; marks: number[]; qr?: string; bg?: string; dur: number }> = ({ arreglo, page, lines, marks, qr, bg, dur }) => {
  const f = useCurrentFrame(); const o = fade(f, dur); const op = ease(cl((f - 6) / 22));
  return (
    <AbsoluteFill style={{ opacity: o }}><Fondo src={bg} seed={59} dur={dur} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 80 }}>
        <div style={{ position: "relative", width: 1000, height: 680, perspective: 2200 }}>
          <div style={{ position: "absolute", left: 500, top: 0, width: 500, height: 680, background: "#FFFDF7", boxShadow: SH, padding: "60px 50px", borderRadius: "0 10px 10px 0" }}>
            {page ? <div style={{ fontFamily: BOLD, fontWeight: 600, fontSize: 26, color: "#777", letterSpacing: 3 }}>PÁGINA {page}</div> : null}
            {arreglo ? <div style={{ fontFamily: BOLD, fontWeight: 900, fontSize: 52, color: CU.azul, marginTop: 14 }}>{arreglo}</div> : null}
            {lines.map((l, i) => { const a = cl((f - marks[i]) / 10); return <div key={i} style={{ position: "relative", marginTop: 26, fontFamily: BOLD, fontWeight: 700, fontSize: 36, color: CU.tinta, lineHeight: 1.2 }}>
              <div style={{ position: "absolute", left: -10, right: -10, top: 4, bottom: -2, background: "rgba(255,194,58,.7)", transformOrigin: "0 50%", transform: `scaleX(${a})`, zIndex: 0 }} /><span style={{ position: "relative" }}>{l}</span></div>; })}
          </div>
          <div style={{ position: "absolute", left: 0, top: 0, width: 500, height: 680, background: "#F3EEE2", borderRadius: "10px 0 0 10px", boxShadow: SH }} />
          <div style={{ position: "absolute", left: 500, top: 0, width: 500, height: 680, transformOrigin: "0 50%", transform: `rotateY(${-180 * op}deg)`, transformStyle: "preserve-3d" }}>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: `linear-gradient(160deg, ${CU.azul}, #143E62)`, borderRadius: "4px 10px 10px 4px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
              <div style={{ fontFamily: BOLD, fontWeight: 900, fontSize: 66, color: CU.maiz, lineHeight: 1.05 }}>MANUAL DEL ALBAÑIL</div>
              <div style={{ width: 140, height: 8, background: CU.naranja, margin: "26px 0" }} />
              <div style={{ fontFamily: BOLD, fontWeight: 600, fontSize: 30, color: CU.masa }}>arreglos de la casa, paso a paso</div>
            </div>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "#F3EEE2", borderRadius: "10px 4px 4px 10px" }} />
          </div>
        </div>
        {qr ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, opacity: cl((f - 20) / 10) }}>
          <div style={{ padding: 22, background: "#fff", borderRadius: 18, boxShadow: SH }}><Img src={staticFile(qr)} style={{ width: 300, height: 300, objectFit: "contain" }} /></div>
          <Cinta size={44}>1ª línea de la descripción</Cinta>
        </div> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- (17) CTA: el botón de suscribirse se hunde; o la pregunta para los comentarios
export const CtaA: React.FC<{ kind: string; lines: string[]; marks: number[]; bg?: string; dur: number }> = ({ kind, lines, marks, bg, dur }) => {
  const f = useCurrentFrame(); const o = fade(f, dur);
  if (kind === "sub") { const press = cl((f - 26) / 4) - cl((f - 32) / 6); const on = f >= 30;
    return <AbsoluteFill style={{ opacity: o }}><Fondo src={bg} seed={61} dur={dur} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 46 }}>
        <div style={{ padding: "30px 80px", borderRadius: 20, background: on ? "#5A5550" : "#E2231A", fontFamily: BOLD, fontWeight: 900, fontSize: 84, color: "#fff", letterSpacing: 3, boxShadow: `0 ${20 - press * 14}px 0 ${on ? "#2E2B28" : "#8A120C"}, 0 34px 60px rgba(0,0,0,.5)`, transform: `translateY(${press * 14}px)` }}>{on ? "SUSCRITO ✓" : "SUSCRÍBETE"}</div>
        <div style={{ opacity: cl((f - 36) / 8) }}><Cinta size={60}>{lines[0]}</Cinta></div>
      </AbsoluteFill></AbsoluteFill>; }
  return <AbsoluteFill style={{ opacity: o }}><Fondo src={bg} seed={67} dur={dur} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 110, gap: 40 }}>
      <div style={{ opacity: cl(f / 8), transform: `translateY(${(1 - sp(f, 0, 13)) * -60}px)` }}><Cinta size={86} rot={-2}>cuéntame en los comentarios</Cinta></div>
      {lines.map((l, i) => { const a = sp(f, marks[i], 12); return <div key={i} style={{ position: "relative", maxWidth: 1500, padding: "40px 70px", background: "#FFFDF7", borderRadius: 46, boxShadow: SH, fontFamily: BOLD, fontWeight: 900, fontSize: 88, color: CU.tinta, opacity: cl(a * 1.5), transform: `translateY(${(1 - a) * 160}px) scale(${0.7 + 0.3 * a})` }}>
        {l.split(" ").map((w, j) => <span key={j} style={{ color: /^[¿¡]?[A-ZÁÉÍÓÚÑ]{4,}[?!]?$/.test(w) ? CU.naranja : undefined }}>{w} </span>)}
        <div style={{ position: "absolute", left: 90, bottom: -40, width: 70, height: 50, background: "#FFFDF7", clipPath: "polygon(0 0, 100% 0, 10% 100%)" }} />
      </div>; })}
    </AbsoluteFill></AbsoluteFill>;
};

// ---------- (18) próximo video: la foto del tema y el cartel
export const ProximoA: React.FC<{ title: string; src?: string; bg?: string; dur: number }> = ({ title, src, dur }) => {
  const f = useCurrentFrame(); const o = fade(f, dur, 14); const k = sp(f, 4, 14);
  return <AbsoluteFill style={{ opacity: o }}><Fondo src={src} seed={71} dur={dur} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 30 }}>
      <Cinta size={56} rot={-2}>en el próximo video</Cinta>
      <Triplay w={1400} style={{ padding: "50px 70px", textAlign: "center", transform: `scale(${0.8 + 0.2 * k})`, opacity: cl(k * 1.4) }}><div style={{ fontFamily: BOLD, fontWeight: 900, fontSize: 82, color: CU.tinta, lineHeight: 1.1 }}>{title}</div></Triplay>
    </AbsoluteFill></AbsoluteFill>;
};

// ---------- overlay: PASO N DE 9 en hilada de ladrillos (sobre material, nunca sobre un componente)
export const ProgA: React.FC<{ n: number; N: number; title: string; dur: number; unit?: string }> = ({ n, N, title, dur, unit = "PASO" }) => {
  const f = useCurrentFrame(); const o = interpolate(f, [0, 8, dur - 8, dur], [0, 1, 1, 0], CL);
  return <div style={{ position: "absolute", right: 50, top: 40, opacity: o, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
    <div style={{ fontFamily: BOLD, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: "#FFF8EA", textShadow: "0 2px 10px rgba(0,0,0,.8)" }}>{unit} {n} DE {N} · {title.toUpperCase()}</div>
    <Hilada n={n} N={N} f={30} w={44} />
  </div>;
};
