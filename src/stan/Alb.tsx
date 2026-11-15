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

// ---------- (1) apertura de paso / regla / error / pregunta / frase de Don Lalo
export const PasoA: React.FC<{ kind: string; n?: number; N?: number; title: string; bg?: string; dur: number }> = ({ kind, n = 0, N = 9, title, bg, dur }) => {
  const f = useCurrentFrame(); const o = fade(f, dur); const k = sp(f, 0, 13), k2 = sp(f, 7, 15);
  let body: React.ReactNode;
  if (kind === "paso") body = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
      <div style={{ position: "relative", transform: `translateY(${(1 - k) * -700}px) rotate(${(1 - k) * 6}deg)` }}>
        <div style={{ position: "absolute", left: 120, top: -600, width: 6, height: 600, background: "linear-gradient(90deg,#6B5A40,#CDB993,#6B5A40)" }} />
        <div style={{ position: "absolute", right: 120, top: -600, width: 6, height: 600, background: "linear-gradient(90deg,#6B5A40,#CDB993,#6B5A40)" }} />
        <Triplay w={1180} style={{ padding: "54px 70px 60px", textAlign: "center" }}>
          <Big size={150}>PASO {n}</Big>
          <div style={{ fontFamily: BOLD, fontWeight: 800, fontSize: 70, color: CU.tinta, marginTop: 22, opacity: k2, lineHeight: 1.1 }}>{title}</div>
        </Triplay>
      </div>
      <div style={{ opacity: k2 }}><Hilada n={n} N={N} f={f} /></div>
    </div>);
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
      <AbsoluteFill style={{ background: `rgba(8,12,18,${0.42 + 0.2 * cl((f - at) / 8)})` }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 60, textAlign: "center", opacity: cl((f - at) / 8), transform: `translateY(${(1 - sp(f, at, 14)) * 40}px)` }}>
        <Big size={x.t.length > 10 ? 92 : 120} col={col} edge="#111">{x.t}</Big>
        {x.s ? <div style={{ marginTop: 30 }}><Cinta size={50}>{x.s}</Cinta></div> : null}
      </AbsoluteFill>
    </div>);
  return (
    <AbsoluteFill style={{ opacity: o, background: "#111" }}>
      {side(a, srcA, colA, fa, true)}{side(b, srcB, colB, fb, false)}
      <div style={{ position: "absolute", left: 948, top: 0, width: 24, height: 1080 * cut, background: "linear-gradient(90deg,#9BA3AB,#E9EDF0 45%,#7F878F)", boxShadow: "0 0 18px rgba(0,0,0,.6)" }} />
      {title ? <div style={{ position: "absolute", top: 60, left: 0, right: 0, textAlign: "center" }}><Cinta size={48} rot={1}>{title}</Cinta></div> : null}
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

// ---------- (5) cadena de pasos con flechas (ciclo del agua y la sal, rocías → esperas → cepillas)
export const CadenaA: React.FC<{ steps: string[]; marks: number[]; bg?: string; dur: number; loop?: boolean }> = ({ steps, marks, bg, dur, loop }) => {
  const f = useCurrentFrame(); const o = fade(f, dur); const n = steps.length; const w = n > 3 ? 380 : 470;
  return (
    <AbsoluteFill style={{ opacity: o }}><Fondo src={bg} seed={13} dur={dur} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {steps.map((s, i) => { const a = sp(f, marks[i], 13);
            return <React.Fragment key={i}>
              {i > 0 ? <div style={{ width: 70, height: 16, background: CU.maiz, clipPath: "polygon(0 30%, 70% 30%, 70% 0, 100% 50%, 70% 100%, 70% 70%, 0 70%)", transform: `scaleX(${cl((f - marks[i] + 6) / 6)})`, transformOrigin: "0 50%" }} /> : null}
              <div style={{ width: w, minHeight: 230, padding: "26px 26px", borderRadius: 18, background: i === n - 1 ? CU.naranja : "#FFFDF7", boxShadow: SH, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", transform: `translateY(${(1 - a) * 60}px) scale(${0.85 + 0.15 * a})`, opacity: cl(a * 1.4) }}>
                <div style={{ fontFamily: BOLD, fontWeight: 900, fontSize: 34, color: i === n - 1 ? "#FFE7D2" : CU.naranja }}>{i + 1}</div>
                <div style={{ fontFamily: BOLD, fontWeight: 800, fontSize: s.length > 22 ? 40 : 50, color: i === n - 1 ? "#fff" : CU.tinta, lineHeight: 1.1 }}>{s}</div>
              </div>
            </React.Fragment>; })}
        </div>
        {loop ? <div style={{ marginTop: 40, opacity: cl((f - marks[n - 1] - 10) / 8) }}><Cinta size={52}>↺ y vuelve a empezar</Cinta></div> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- (6) la palabra técnica escrita en la pared con el plumón, y abajo qué quiere decir
export const PalabraA: React.FC<{ word: string; sub?: string; sub2?: string; bg?: string; dur: number; col?: string }> = ({ word, sub, sub2, bg, dur, col = CU.cal }) => {
  const f = useCurrentFrame(); const o = fade(f, dur); const a = cl(f / Math.max(10, word.length * 1.2));
  return (
    <AbsoluteFill style={{ opacity: o }}><Fondo src={bg} seed={17} dur={dur} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 36, padding: 80, textAlign: "center" }}>
        <Big size={word.length > 18 ? 110 : 150} col={col} edge="#111" style={{ clipPath: `inset(-40px ${100 - a * 100}% -40px -40px)` }}>{word}</Big>
        {sub ? <div style={{ opacity: cl((f - 14) / 8) }}><Cinta size={60}>{sub}</Cinta></div> : null}
        {sub2 ? <div style={{ opacity: cl((f - 26) / 8) }}><Cinta size={52} rot={1.5}>{sub2}</Cinta></div> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- (7) la gota que burbujea sobre la costra (cuenta-gotas, burbujas con radial-gradient)
export const GotaA: React.FC<{ label: string; bg?: string; dur: number }> = ({ label, bg, dur }) => {
  const f = useCurrentFrame(); const o = fade(f, dur); const hit = 22; const y = interpolate(f, [4, hit], [-260, 470], { ...CL, easing: Easing.in(Easing.quad) });
  return (
    <AbsoluteFill style={{ opacity: o }}><Fondo src={bg} seed={19} dur={dur} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, height: 520, background: "linear-gradient(180deg, #E9E7E0, #CFCBC0)", boxShadow: "inset 0 18px 30px rgba(0,0,0,.25)" }}>
        {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 211) % 1900, top: (i * 97) % 480, width: 14 + (i % 5) * 9, height: 10 + (i % 4) * 7, borderRadius: "50%", background: "rgba(255,255,255,.75)" }} />)}
      </div>
      {f < hit ? <div style={{ position: "absolute", left: 930, top: y, width: 60, height: 84, background: "radial-gradient(circle at 40% 60%, #F7F2D8, #D7CFA4)", borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%", boxShadow: "0 6px 14px rgba(0,0,0,.35)" }} /> : null}
      {f >= hit ? <div style={{ position: "absolute", left: 960 - 160, top: 540, width: 320, height: 70, borderRadius: "50%", background: "rgba(214,204,160,.75)", transform: `scale(${0.4 + 0.6 * cl((f - hit) / 8)})` }} /> : null}
      {Array.from({ length: 34 }, (_, i) => { const t0 = hit + (i % 12) * 3; if (f < t0) return null; const life = ((f - t0) % 40) / 40; const x = 960 + (((i * 73) % 300) - 150); const r = 8 + (i % 5) * 5;
        return <div key={i} style={{ position: "absolute", left: x, top: 560 - life * 140, width: r, height: r, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,.95), rgba(255,255,255,.2) 60%)", border: "1.5px solid rgba(255,255,255,.8)", opacity: 1 - life }} />; })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center" }}><Sello txt={label} col={CU.maiz} f={f} at={hit + 14} size={74} rot={-4} /></div>
    </AbsoluteFill>
  );
};

// ---------- (8) cinta métrica que se desenrolla con la medida
export const MetroA: React.FC<{ big: string; sub?: string; bg?: string; dur: number }> = ({ big, sub, bg, dur }) => {
  const f = useCurrentFrame(); const o = fade(f, dur); const w = ease(cl(f / 18));
  return (
    <AbsoluteFill style={{ opacity: o }}><Fondo src={bg} seed={23} dur={dur} />
      <div style={{ position: "absolute", left: 120, top: 560, width: 1680 * w, height: 96, background: `repeating-linear-gradient(90deg, #111 0 3px, transparent 3px 21px), repeating-linear-gradient(90deg, #111 0 4px, transparent 4px 105px), linear-gradient(180deg, #FFD54A, #F2B70E)`, backgroundSize: "100% 30%, 100% 55%, 100% 100%", backgroundRepeat: "repeat-x", boxShadow: "0 14px 30px rgba(0,0,0,.5)", borderRadius: 4 }} />
      <div style={{ position: "absolute", left: 40, top: 500, width: 210, height: 210, borderRadius: 36, background: "linear-gradient(160deg, #3A3F45, #1A1D21)", boxShadow: SH, border: "6px solid #FFC23A" }} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 210 }}>
        <Big size={big.length > 16 ? 110 : 140} col={CU.cal} edge="#111" style={{ opacity: cl((f - 10) / 8) }}>{big}</Big>
      </AbsoluteFill>
      {sub ? <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", opacity: cl((f - 20) / 8) }}><Cinta size={64}>{sub}</Cinta></div> : null}
    </AbsoluteFill>
  );
};

// ---------- (9) ticket de ferretería que se imprime renglón por renglón
export const TicketA: React.FC<{ rows: { name: string; price: string; f: number }[]; total?: string; ft?: number; head?: string; bg?: string; dur: number }> = ({ rows, total, ft = 999, head = "FERRETERÍA DE LA ESQUINA", bg, dur }) => {
  const f = useCurrentFrame(); const o = fade(f, dur); const last = Math.max(...rows.map((r) => r.f), total ? ft : 0);
  const shown = rows.filter((r) => f >= r.f).length + (total && f >= ft ? 1.3 : 0); const h = 230 + shown * 96;
  return (
    <AbsoluteFill style={{ opacity: o }}><Fondo src={bg} seed={29} dur={dur} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 70 }}>
        <div style={{ width: 860, height: interpolate(f, [0, last + 10], [180, h], CL), overflow: "hidden", background: "#FBFBF7", boxShadow: SH, padding: "36px 56px", fontFamily: "'Courier New', monospace", color: "#222", transform: "rotate(-1deg)" }}>
          <div style={{ textAlign: "center", fontSize: 34, fontWeight: 700, letterSpacing: 2 }}>{head}</div>
          <div style={{ borderBottom: "3px dashed #999", margin: "16px 0 22px" }} />
          {rows.map((r, i) => f >= r.f ? <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 44, height: 96, alignItems: "center" }}><span>{r.name}</span><span style={{ fontWeight: 700 }}>{r.price}</span></div> : null)}
          {total && f >= ft ? <><div style={{ borderBottom: "3px dashed #999", margin: "6px 0 14px" }} /><div style={{ display: "flex", justifyContent: "space-between", fontSize: 54, fontWeight: 700 }}><span>TOTAL</span><span style={{ color: CU.chile }}>{total}</span></div></> : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- (10) etiqueta de precio colgada con hilo (de la tienda de la esquina)
export const PrecioA: React.FC<{ item: string; price: string; bg?: string; dur: number }> = ({ item, price, bg, dur }) => {
  const f = useCurrentFrame(); const o = fade(f, dur); const k = sp(f, 0, 7); const sw = 9 * Math.exp(-f / 20) * Math.cos(f / 4);
  return (
    <AbsoluteFill style={{ opacity: o }}><Fondo src={bg} seed={31} dur={dur} />
      <div style={{ position: "absolute", left: 960, top: -40, transformOrigin: "0 0", transform: `rotate(${sw}deg) translateY(${(1 - k) * -500}px)` }}>
        <div style={{ position: "absolute", left: -3, top: 0, width: 6, height: 300, background: "linear-gradient(90deg,#8E6B3E,#D8C19A 50%,#8E6B3E)" }} />
        <div style={{ position: "absolute", left: -360, top: 290, width: 720, padding: "90px 50px 50px", textAlign: "center", background: "linear-gradient(170deg,#FFF4D6,#F4DFA8)", clipPath: "polygon(14% 0, 86% 0, 100% 13%, 100% 100%, 0 100%, 0 13%)", boxShadow: SH }}>
          <div style={{ position: "absolute", left: 342, top: 26, width: 36, height: 36, borderRadius: "50%", background: "#2B211A", boxShadow: "0 0 0 8px #E9DCC2" }} />
          <div style={{ fontFamily: BOLD, fontWeight: 800, fontSize: 46, color: CU.tinta, lineHeight: 1.15 }}>{item}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 128, color: CU.chile, lineHeight: 1.05, marginTop: 10 }}>{price}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- (11) peligro: banda de obra amarilla y negra, la frase en blanco, el sello en rojo
export const PeligroA: React.FC<{ line: string; sub?: string; stamp?: string; fs?: number; bg?: string; dur: number }> = ({ line, sub, stamp, fs = 26, bg, dur }) => {
  const f = useCurrentFrame(); const o = fade(f, dur); const w = ease(cl(f / 12));
  const band = (top: number, dir: number) => <div style={{ position: "absolute", left: 0, top, width: 1920, height: 86, transform: `translateX(${dir * (1 - w) * 1920}px)`, background: "repeating-linear-gradient(-45deg, #111 0 50px, #FFC23A 50px 100px)", boxShadow: "0 10px 26px rgba(0,0,0,.5)" }} />;
  return (
    <AbsoluteFill style={{ opacity: o }}><Fondo src={bg} seed={37} dur={dur} /><AbsoluteFill style={{ background: "rgba(40,6,4,.45)" }} />
      {band(120, -1)}{band(874, 1)}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 34, padding: 90, textAlign: "center" }}>
        <Big size={line.length > 28 ? 84 : 112} col={CU.cal} edge="#5A0C06" style={{ whiteSpace: "normal", lineHeight: 1.1, opacity: cl((f - 6) / 8) }}>{line}</Big>
        {sub ? <div style={{ opacity: cl((f - 14) / 8) }}><Cinta size={54}>{sub}</Cinta></div> : null}
        {stamp ? <Sello txt={stamp} col={CU.chile} f={f} at={fs} size={110} /> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- (12) reloj de cocina: la aguja recorre los minutos; o tres fichas NO / SÍ / NO
export const RelojA: React.FC<{ big: string; sweep?: number; chips?: { t: string; ok: boolean; f: number }[]; bg?: string; dur: number }> = ({ big, sweep = 360, chips, bg, dur }) => {
  const f = useCurrentFrame(); const o = fade(f, dur); const a = interpolate(f, [6, Math.min(dur - 10, 60)], [0, sweep], { ...CL, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: o }}><Fondo src={bg} seed={41} dur={dur} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 90 }}>
        <div style={{ position: "relative", width: 520, height: 520, borderRadius: "50%", background: `conic-gradient(rgba(240,122,26,.85) 0 ${a}deg, #FFFDF7 ${a}deg 360deg)`, border: "22px solid #E9EDF0", boxShadow: SH }}>
          {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 238, top: 6, width: 8, height: 34, background: CU.tinta, transformOrigin: "4px 232px", transform: `rotate(${i * 30}deg)` }} />)}
          <div style={{ position: "absolute", left: 234, top: 40, width: 16, height: 220, background: CU.tinta, borderRadius: 8, transformOrigin: "8px 198px", transform: `rotate(${a}deg)` }} />
          <div style={{ position: "absolute", left: 222, top: 222, width: 40, height: 40, borderRadius: "50%", background: CU.chile }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 30, alignItems: "flex-start" }}>
          <Big size={140} col={CU.cal} edge="#111">{big}</Big>
          {chips?.map((c, i) => f >= c.f ? <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, transform: `translateX(${(1 - sp(f, c.f, 13)) * 80}px)` }}>
            <div style={{ fontFamily: BOLD, fontWeight: 900, fontSize: 66, color: CU.cal, width: 260, textShadow: "0 3px 10px #000" }}>{c.t}</div>
            <div style={{ padding: "6px 26px", borderRadius: 12, background: c.ok ? CU.verde : CU.chile, fontFamily: BOLD, fontWeight: 900, fontSize: 56, color: "#fff" }}>{c.ok ? "SÍ" : "NO"}</div>
          </div> : null)}
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
    case "caliza": case "travertino": return speck("linear-gradient(160deg,#E7DDC6,#D3C6A6)", "#A7946C", 90);
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
          {mats.map((m, i) => { const a = sp(f, m.f, 14); return <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: cl(a * 1.5), transform: `translateY(${(1 - a) * 60}px)` }}>
            <Muestra mat={m.mat} w={w} h={h} />
            <div style={{ fontFamily: BOLD, fontWeight: 800, fontSize: n > 3 ? 44 : 54, color: CU.cal, textShadow: "0 3px 10px #000", whiteSpace: "nowrap" }}>{m.name}</div>
          </div>; })}
        </div>
        {sub ? <div style={{ opacity: cl((f - vf - 8) / 8) }}><Cinta size={50}>{sub}</Cinta></div> : null}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center" }}><Sello txt={verdict} col={col} f={f} at={vf} size={verdict.length > 4 ? 100 : 170} /></div>
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
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 30 }}>
      <Cinta size={48} rot={-3}>cuéntame en los comentarios</Cinta>
      {lines.map((l, i) => { const a = sp(f, marks[i], 14); return <div key={i} style={{ maxWidth: 1400, padding: "34px 60px", background: "#FFFDF7", borderRadius: "40px 40px 40px 8px", boxShadow: SH, fontFamily: BOLD, fontWeight: 800, fontSize: 70, color: CU.tinta, opacity: cl(a * 1.5), transform: `translateX(${(1 - a) * -90}px)` }}>{l}</div>; })}
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
