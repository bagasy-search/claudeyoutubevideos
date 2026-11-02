import React from "react";
import { AbsoluteFill, Img, staticFile, interpolate } from "remotion";
import { Avatar } from "./base";
import { FONT, e, ei, spr, extrude, Tag, BigNum, Chips, DrawX } from "./lib";

const W = 1920, H = 1080;
const rnd = (i: number) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };

const F = (n: string) => staticFile(`plo31t/img/plo31t_${n}.jpg`);

type Plano =
  | { k: "av"; a: number; b: number }
  | { k: "foto"; a: number; b: number; src: string; push?: [number, number]; zoom?: number };

const PLANOS: Plano[] = [
  { k: "av", a: 365.85, b: 370.52 },
  { k: "foto", a: 370.52, b: 374.80, src: F("t2_01"), push: [0.56, 0.62], zoom: 1.10 },
  { k: "foto", a: 374.80, b: 378.86, src: F("t2_02"), push: [0.40, 0.70], zoom: 1.08 },
  { k: "foto", a: 378.86, b: 381.89, src: F("t2_03"), push: [0.50, 0.55], zoom: 1.16 },
  { k: "av", a: 381.89, b: 386.63 },
  { k: "foto", a: 386.63, b: 390.46, src: F("t2_04"), push: [0.52, 0.50], zoom: 1.18 },
  { k: "foto", a: 390.46, b: 397.33, src: F("t2_05"), push: [0.55, 0.58], zoom: 1.12 },
  { k: "av", a: 397.33, b: 402.50 },
  { k: "foto", a: 402.50, b: 408.50, src: F("t2_06"), push: [0.48, 0.55], zoom: 1.07 },
  { k: "foto", a: 408.50, b: 414.90, src: F("t2_07"), push: [0.58, 0.50], zoom: 1.12 },
  { k: "av", a: 414.90, b: 418.49 },
  { k: "foto", a: 418.49, b: 421.46, src: F("t2_08"), push: [0.50, 0.72], zoom: 1.14 },
  { k: "foto", a: 421.46, b: 426.70, src: F("t2_09"), push: [0.50, 0.50], zoom: 1.10 },
  { k: "foto", a: 426.70, b: 430.25, src: F("t2_10"), push: [0.52, 0.55], zoom: 1.14 },
  { k: "av", a: 430.25, b: 434.07 },
  { k: "foto", a: 434.07, b: 440.40, src: F("t2_11"), push: [0.54, 0.52], zoom: 1.16 },
  { k: "foto", a: 440.40, b: 445.56, src: F("t2_12"), push: [0.50, 0.56], zoom: 1.10 },
  { k: "av", a: 445.56, b: 450.40 },
  { k: "foto", a: 450.40, b: 456.34, src: F("t2_13"), push: [0.50, 0.54], zoom: 1.15 },
  { k: "foto", a: 456.34, b: 463.16, src: F("t2_14"), push: [0.52, 0.58], zoom: 1.12 },
  { k: "av", a: 463.16, b: 466.92 },
  { k: "foto", a: 466.92, b: 472.97, src: F("t2_15"), push: [0.50, 0.50], zoom: 1.10 },
  { k: "foto", a: 472.97, b: 477.85, src: F("t2_16"), push: [0.50, 0.52], zoom: 1.17 },
  { k: "av", a: 477.85, b: 484.02 },
  { k: "foto", a: 484.02, b: 486.19, src: F("t2_17"), push: [0.52, 0.52], zoom: 1.16 },
  { k: "foto", a: 486.19, b: 491.07, src: F("t2_18"), push: [0.50, 0.55], zoom: 1.14 },
  { k: "foto", a: 491.07, b: 497.44, src: F("t2_19"), push: [0.46, 0.55], zoom: 1.08 },
  { k: "av", a: 497.44, b: 503.32 },
  { k: "foto", a: 503.32, b: 509.61, src: F("t2_20"), push: [0.54, 0.55], zoom: 1.13 },
  { k: "foto", a: 509.61, b: 515.58, src: F("t2_21"), push: [0.50, 0.50], zoom: 1.10 },
  { k: "av", a: 515.58, b: 520.80 },
  { k: "foto", a: 520.80, b: 527.11, src: F("t2_22"), push: [0.52, 0.52], zoom: 1.15 },
  { k: "foto", a: 527.11, b: 531.56, src: F("t2_23"), push: [0.50, 0.52], zoom: 1.18 },
];

const Grain: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.09 }}>
    <svg width={W} height={H}><filter id="gr"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} /></filter><rect width={W} height={H} filter="url(#gr)" /></svg>
  </AbsoluteFill>
);
const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 52%, rgba(0,0,0,.42) 100%)" }} />
);

const Foto: React.FC<{ t: number; p: Extract<Plano, { k: "foto" }> }> = ({ t, p }) => {
  const u = e(t, p.a, p.b);
  const z = 1 + ((p.zoom ?? 1.1) - 1) * u;
  const px = (p.push?.[0] ?? 0.5), py = (p.push?.[1] ?? 0.5);
  const drift = (rnd(p.a) - 0.5) * 40 * u;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#1a1410" }}>
      <Img
        src={p.src}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z}) translate(${drift}px, ${-drift * 0.4}px)`, transformOrigin: `${px * 100}% ${py * 100}%`, filter: "saturate(1.04) contrast(1.03)" }}
      />
    </AbsoluteFill>
  );
};

const Nota: React.FC<{ t: number; at: number; out?: number; x: number; y: number; rot?: number; text: string; sub?: string; size?: number; col?: string }> = ({ t, at, out = 1e9, x, y, rot = -3, text, sub, size = 54, col = "#d7261e" }) => {
  const k = spr(t, at);
  const o = 1 - e(t, out - 0.35, out);
  if (t < at || o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${0.6 + 0.4 * k})`, opacity: o, background: "#f4ecd8", padding: "22px 34px 26px", borderRadius: 6, boxShadow: "0 18px 40px rgba(0,0,0,.45), inset 0 0 40px rgba(180,160,120,.25)", maxWidth: 620 }}>
      <div style={{ fontFamily: "'Caveat','Permanent Marker',cursive", fontWeight: 700, fontSize: size, lineHeight: 1.02, color: col }}>{text}</div>
      {sub && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: "0.14em", color: "#6b5a3e", marginTop: 8 }}>{sub}</div>}
    </div>
  );
};

const Circulo: React.FC<{ t: number; at: number; x: number; y: number; rx: number; ry: number; col?: string; out?: number }> = ({ t, at, x, y, rx, ry, col = "#d7261e", out = 1e9 }) => {
  const k = ei(t, at, at + 0.55);
  const o = 1 - e(t, out - 0.3, out);
  if (k <= 0 || o <= 0) return null;
  const L = 2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2) * 1.02;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="none" stroke={col} strokeWidth={9} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - k)} transform={`rotate(-6 ${x} ${y})`} style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,.35))" }} />
    </svg>
  );
};

const Flecha: React.FC<{ t: number; at: number; x: number; y: number; dx: number; dy: number; out?: number }> = ({ t, at, x, y, dx, dy, out = 1e9 }) => {
  const k = ei(t, at, at + 0.7);
  const o = 1 - e(t, out - 0.3, out);
  if (k <= 0 || o <= 0) return null;
  const ex = x + dx * k, ey = y + dy * k;
  const ang = Math.atan2(dy, dx);
  const hx = ex - Math.cos(ang - 0.5) * 34, hy = ey - Math.sin(ang - 0.5) * 34;
  const hx2 = ex - Math.cos(ang + 0.5) * 34, hy2 = ey - Math.sin(ang + 0.5) * 34;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
      <path d={`M${x} ${y} Q${x + dx * 0.5} ${y + dy * 0.5 - 60} ${ex} ${ey}`} fill="none" stroke="#d7261e" strokeWidth={9} strokeLinecap="round" style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,.35))" }} />
      {k > 0.85 && <path d={`M${hx} ${hy} L${ex} ${ey} L${hx2} ${hy2}`} fill="none" stroke="#d7261e" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
};

const Titulo: React.FC<{ t: number; a: number; b: number; num: string; text: string }> = ({ t, a, b, num, text }) => {
  const k = spr(t, a + 0.1);
  const o = 1 - e(t, b - 0.4, b);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      <div style={{ position: "absolute", left: 120, top: 210, transform: `translateY(${(1 - k) * 40}px)` }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 300, lineHeight: 0.8, color: "#ffd84a", textShadow: extrude(10, "rgba(0,0,0,.55)"), transform: `scale(${0.85 + 0.15 * k})`, transformOrigin: "left bottom" }}>{num}</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 78, letterSpacing: "-0.01em", color: "#fff", textShadow: extrude(6, "rgba(0,0,0,.6)"), marginTop: 6, maxWidth: 900 }}>{text}</div>
        <div style={{ width: 260 * k, height: 10, background: "#d7261e", marginTop: 16, borderRadius: 6 }} />
      </div>
    </AbsoluteFill>
  );
};

const ContadorVueltas: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const k = spr(t, a + 0.1);
  const n = Math.round(interpolate(t, [a + 0.4, a + 1.6], [4, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const o = 1 - e(t, b - 0.4, b);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      <div style={{ position: "absolute", right: 150, top: 300, transform: `translateY(-50%) scale(${0.7 + 0.3 * k})`, textAlign: "center" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 260, lineHeight: 0.9, color: "#ffd84a", textShadow: extrude(10, "rgba(0,0,0,.6)") }}>{n}</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, letterSpacing: "0.18em", color: "#fff", textShadow: extrude(4, "rgba(0,0,0,.6)") }}>VUELTAS</div>
        <div style={{ marginTop: 18, display: "inline-block", background: "#d7261e", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: "0.16em", padding: "10px 22px", borderRadius: 8, boxShadow: "0 12px 26px rgba(0,0,0,.4)" }}>MEDIA PULGADA</div>
      </div>
    </AbsoluteFill>
  );
};

const Minutos: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const k = spr(t, a + 0.1);
  const n = Math.floor(interpolate(t, [a + 0.3, b - 0.3], [0, 9], { extrapolateRight: "clamp" }));
  const o = 1 - e(t, b - 0.4, b);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      <div style={{ position: "absolute", left: 150, bottom: 170, transform: `translateY(${(1 - k) * 30}px)`, display: "flex", alignItems: "baseline", gap: 18 }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 200, lineHeight: 0.9, color: "#fff", textShadow: extrude(8, "rgba(0,0,0,.6)") }}>{n}</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, letterSpacing: "0.1em", color: "#ffd84a", textShadow: extrude(4, "rgba(0,0,0,.6)") }}>MINUTOS</div>
      </div>
    </AbsoluteFill>
  );
};

// Chips en DOS renglones con aire entre ellos (corrige 345 s: "ÓXIDO" y "GOMA QUE SE PEGA" pegados)
const ChipsApilados: React.FC<{ t: number; at: number; out: number; items: string[] }> = ({ t, at, out, items }) => {
  const o = 1 - e(t, out - 0.35, out);
  if (t < at || o <= 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        {items.map((it, i) => {
          const kk = spr(t, at + i * 0.22);
          return (
            <div key={i} style={{ transform: `translateY(${(1 - kk) * 26}px) scale(${0.86 + 0.14 * kk})`, background: i === 0 ? "#d7261e" : "#f4ecd8", color: i === 0 ? "#fff" : "#2a2016", fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: "0.06em", padding: "14px 30px", borderRadius: 10, boxShadow: "0 14px 30px rgba(0,0,0,.45)" }}>{it}</div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Tramo2: React.FC<{ t: number }> = ({ t }) => {
  const idx = PLANOS.findIndex((p) => t >= p.a && t < p.b);
  const i = idx < 0 ? PLANOS.length - 1 : idx;
  const p = PLANOS[i];
  const prev = i > 0 ? PLANOS[i - 1] : null;
  const tr = 0.42;
  // Corte limpio al ENTRAR al avatar (corrige 478 s: la foto no queda encima de la cara)
  const entraAv = p.k === "av";
  const inTr = !entraAv && t - p.a < tr && i > 0;

  const render = (pl: Plano) => {
    if (pl.k === "av") return <Avatar t={t} />;
    return <Foto t={t} p={pl} />;
  };

  return (
    <AbsoluteFill style={{ background: "#0b0a08" }}>
      {inTr && prev && (
        <AbsoluteFill style={{ opacity: 1 - (t - p.a) / tr }}>{render(prev)}</AbsoluteFill>
      )}
      <AbsoluteFill style={{ opacity: inTr ? Math.min(1, (t - p.a) / (tr * 0.7)) : 1 }}>{render(p)}</AbsoluteFill>

      {t >= 370.52 && t < 374.80 && (
        <Tag t={t} at={371.0} out={374.5} x={1180} y={430} dx={-140} dy={110} text="LLAVECITA ANGULAR" sub="SE TRABA" size={58} col="#ffd84a" />
      )}
      {t >= 374.80 && t < 378.86 && (
        <>
          <Tag t={t} at={374.95} out={378.6} x={620} y={470} dx={60} dy={-120} text="INODORO" size={56} col="#ffd84a" />
          <Tag t={t} at={375.3} out={378.6} x={1320} y={560} dx={-70} dy={-110} text="LAVAMANOS" sub="LAS DOS DE ABAJO" size={56} col="#ffd84a" />
        </>
      )}
      {t >= 378.86 && t < 381.89 && (
        <>
          <Circulo t={t} at={379.7} x={960} y={540} rx={300} ry={250} out={381.7} />
          <Nota t={t} at={380.6} out={381.8} x={1440} y={820} text="SE TRABAN" sub="NADIE LAS TOCA" rot={-4} />
        </>
      )}
      {t >= 386.63 && t < 390.46 && (
        <Tag t={t} at={389.6} out={390.4} x={1000} y={420} dx={-120} dy={120} text="VÁSTAGO" sub="AHÍ GOTEA" size={58} col="#ffd84a" />
      )}
      {t >= 390.46 && t < 397.33 && (
        <>
          <Circulo t={t} at={394.6} x={980} y={560} rx={250} ry={210} out={397.1} />
          <Nota t={t} at={395.6} out={397.2} x={1420} y={300} text="UN OCTAVO DE VUELTA" rot={3} size={50} />
        </>
      )}
      {t >= 402.50 && t < 408.50 && (
        <Nota t={t} at={403.9} out={408.3} x={1420} y={300} text="MARTES ≠ DOMINGO" sub="NUNCA DE NOCHE" rot={-3} />
      )}
      {t >= 408.50 && t < 414.90 && (
        <Tag t={t} at={411.3} out={414.6} x={700} y={430} dx={80} dy={130} text="LLAVE GENERAL" sub="QUE TODOS SEPAN" size={58} col="#ffd84a" />
      )}
      {t >= 418.49 && t < 421.46 && <Minutos t={t} a={418.49} b={421.46} />}
      {t >= 421.46 && t < 426.70 && <Titulo t={t} a={421.46} b={426.70} num="4" text="EL TEFLÓN Y LA ROSCA" />}
      {t >= 426.70 && t < 430.25 && (
        <>
          <DrawX t={t} at={428.6} x={760} y={430} w={420} h={320} />
          <Nota t={t} at={429.3} out={430.1} x={1420} y={820} text="EL ERROR MÁS VISTO" rot={3} size={48} />
        </>
      )}
      {t >= 434.07 && t < 440.40 && (
        <Tag t={t} at={438.2} out={440.2} x={1050} y={480} dx={-130} dy={120} text="ROSCA MACHO" sub="LA DE AFUERA" size={58} col="#ffd84a" />
      )}
      {t >= 440.40 && t < 445.56 && (
        <Flecha t={t} at={443.7} x={760} y={700} dx={420} dy={-220} out={445.4} />
      )}
      {t >= 450.40 && t < 456.34 && (
        <>
          <Nota t={t} at={455.2} out={456.1} x={1420} y={300} text="AL REVÉS" sub="SE DESENROLLA" rot={-4} />
          <DrawX t={t} at={455.5} x={780} y={420} w={380} h={300} />
        </>
      )}
      {t >= 456.34 && t < 463.16 && (
        <Circulo t={t} at={462.3} x={1000} y={560} rx={280} ry={230} out={463.0} />
      )}
      {t >= 466.92 && t < 472.97 && <ContadorVueltas t={t} a={466.92} b={472.97} />}
      {t >= 472.97 && t < 477.85 && (
        <Tag t={t} at={475.5} out={477.6} x={1000} y={440} dx={-120} dy={120} text="TIRANTE" sub="SE MARCA LA ROSCA" size={58} col="#ffd84a" />
      )}
      {t >= 484.02 && t < 486.19 && (
        <Circulo t={t} at={484.8} x={960} y={540} rx={270} ry={220} out={486.0} />
      )}
      {t >= 486.19 && t < 491.07 && (
        <Tag t={t} at={490.2} out={491.0} x={1000} y={450} dx={-120} dy={120} text="GOMA = SELLA" sub="SIN TEFLÓN" size={58} col="#ffd84a" />
      )}
      {t >= 491.07 && t < 497.44 && (
        <Chips t={t} at={491.3} out={497.2} y={860} items={["LAVAMANOS", "INODORO", "LAVADORA"]} />
      )}
      {t >= 503.32 && t < 509.61 && (
        <Nota t={t} at={507.5} out={509.4} x={1420} y={300} text="A MANO + ¼ VUELTA" rot={3} size={50} />
      )}
      {t >= 509.61 && t < 515.58 && <Titulo t={t} a={509.61} b={515.58} num="5" text="LA PRESIÓN ESTÁ EN LA PUNTA" />}
      {t >= 520.80 && t < 527.11 && (
        <Flecha t={t} at={522.9} x={760} y={560} dx={380} dy={180} out={526.9} />
      )}
      {t >= 527.11 && t < 531.56 && (
        <Tag t={t} at={530.4} out={531.5} x={1000} y={440} dx={-120} dy={120} text="EL AIREADOR" sub="ESA PIECITA" size={58} col="#ffd84a" />
      )}

      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

export const SFX2: [number, string, number?][] = [
  [370.52, "whoosh", -3], [371.05, "pop", -2], [374.80, "swish", -2], [374.95, "pop", -3], [375.32, "pop", -3],
  [378.86, "zoom", -2], [379.72, "write", -3], [380.62, "paper", -4], [386.63, "whoosh", -3], [388.95, "k_gota", -6],
  [389.62, "pop", -3], [390.46, "whoosh", -3], [394.62, "write", -3], [397.35, "paper", -4], [402.50, "whoosh", -3],
  [403.92, "paper", -4], [408.50, "swish", -2], [411.32, "pop", -3], [418.49, "whoosh", -3], [419.80, "tick", -6],
  [420.70, "tick", -6], [421.46, "riser", -3], [422.30, "slam", -1], [426.70, "whoosh", -3], [428.62, "fail", -3],
  [429.32, "paper", -4], [434.07, "whoosh", -3], [438.22, "pop", -3], [440.40, "swish", -2], [443.72, "write", -3],
  [450.40, "whoosh", -3], [455.22, "paper", -4], [455.52, "fail", -3], [456.34, "swish", -2], [462.32, "write", -3],
  [466.92, "whoosh", -3], [467.40, "roll", -4], [469.70, "tick", -5], [472.97, "swish", -2], [475.52, "pop", -3],
  [484.02, "whoosh", -3], [484.82, "write", -3], [486.19, "swish", -2], [490.22, "pop", -3], [491.07, "whoosh", -3],
  [491.32, "click", -4], [492.40, "click", -4], [493.50, "click", -4], [503.32, "whoosh", -3], [507.52, "paper", -4],
  [509.61, "riser", -3], [510.52, "slam", -1], [520.80, "whoosh", -3], [522.92, "write", -3], [527.11, "swish", -2],
  [530.42, "pop", -3],
];
