// blt02 · cinco escenas más hechas con la foto real (mismos helpers que min1.tsx). Cada una con un mecanismo propio:
// el generador se aleja solo · el gas le saca el color a la foto · lo que se levanta se va · cinco bidones en ramo · las gotas se cuentan.
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/Fraunces";

const { fontFamily: SERIF } = loadSerif();
const CREMA = "#F7F0E3";
const SOMBRA = "0 2px 18px rgba(0,0,0,.8), 0 1px 3px rgba(0,0,0,.6)";
const sin = Easing.inOut(Easing.sin), cubOut = Easing.out(Easing.cubic), cubIn = Easing.in(Easing.cubic), cubIO = Easing.inOut(Easing.cubic);
const cl = (t: number, a: number, b: number, easing?: (x: number) => number) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
const sp = (t: number, at: number, damping = 11, stiffness = 170) => (t < at ? 0 : spring({ frame: (t - at) * 30, fps: 30, config: { damping, stiffness, mass: 0.8 } }));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080 };
const src = (id: string) => staticFile("img/blt02/" + id + ".jpg");
type Pt = number[];
type P = { t: number; at: number; out: number };

// Máscara por contorno con borde suave. `g` = [x1,y1,x2,y2]: el recorte se desvanece de opaco (x1,y1) a nada (x2,y2), para la muñeca.
const mascara = (pts: Pt[], fe: number, g?: number[]) => {
  const p = pts.map((q) => q.join(",")).join(" ");
  const grad = g ? `<linearGradient id='g' gradientUnits='userSpaceOnUse' x1='${g[0]}' y1='${g[1]}' x2='${g[2]}' y2='${g[3]}'><stop offset='0' stop-color='white' stop-opacity='1'/><stop offset='1' stop-color='white' stop-opacity='0'/></linearGradient>` : "";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'><defs><filter id='f' x='-10%' y='-10%' width='120%' height='120%'><feGaussianBlur stdDeviation='${fe}'/></filter>${grad}</defs><polygon points='${p}' fill='${g ? "url(#g)" : "white"}' filter='url(#f)'/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
};
const mk = (m: string): React.CSSProperties => ({ WebkitMaskImage: m, maskImage: m, WebkitMaskSize: "1920px 1080px", maskSize: "1920px 1080px", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat" });

const Foto: React.FC<{ id: string; style?: React.CSSProperties }> = ({ id, style }) => <Img src={src(id)} style={{ ...full, objectFit: "fill", ...style }} />;
const Raiz: React.FC<{ children: React.ReactNode }> = ({ children }) => <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>{children}</AbsoluteFill>;
const World: React.FC<{ cx: number; cy: number; S: number; children: React.ReactNode }> = ({ cx, cy, S, children }) => {
  const X = Math.max(1920 * (1 - S), Math.min(0, 960 - cx * S)), Y = Math.max(1080 * (1 - S), Math.min(0, 540 - cy * S));
  return <div style={{ ...full, transformOrigin: "0 0", transform: `translate(${X}px,${Y}px) scale(${S})` }}>{children}</div>;
};
// Un pedazo real de la foto, recortado por su contorno, que se mueve con `transform` alrededor de (ox, oy)
const Pieza: React.FC<{ id: string; m: string; ox: number; oy: number; transform: string; filter?: string }> = ({ id, m, ox, oy, transform, filter }) =>
  <div style={{ ...full, transformOrigin: `${ox}px ${oy}px`, transform, filter }}><Foto id={id} style={mk(m)} /></div>;

const Lab: React.FC<{ t: number; at: number; fin?: number; x: number; y: number; txt: string; size?: number; align?: "center" | "left" | "right"; italic?: boolean; weight?: number }> =
  ({ t, at, fin = 1e9, x, y, txt, size = 34, align = "left", italic = true, weight = 500 }) => {
    if (t < at || t > fin + 0.02) return null;
    const k = cl(t, at, at + 0.33, cubOut), o = cl(t, fin - 0.14, fin + 0.02, sin);
    return <div style={{ position: "absolute", left: x, top: y, opacity: k * (1 - o), transform: `translate(${align === "center" ? "-50%" : align === "right" ? "-100%" : "0"},${(1 - k) * 14 - o * 18}px)`, fontFamily: SERIF, fontStyle: italic ? "italic" : "normal", fontWeight: weight, fontSize: size, lineHeight: 1.05, color: CREMA, whiteSpace: "nowrap", textShadow: SOMBRA }}>{txt}</div>;
  };

// ───────────────────────── A · EL GENERADOR SE ALEJA SOLO (s042, 326,5–329,8) ─────────────────────────
const GEN: Pt[] = [[1296, 528], [1306, 512], [1322, 504], [1360, 500], [1372, 504], [1440, 512], [1478, 510], [1494, 516], [1500, 530], [1500, 640], [1492, 652], [1478, 656], [1462, 650], [1452, 668], [1438, 676], [1418, 676], [1404, 664], [1398, 648], [1332, 640], [1322, 650], [1300, 654], [1284, 646], [1276, 628], [1280, 610], [1296, 598]];
const M_GEN = mascara(GEN, 2.5);
export const EscGen: React.FC<P> = ({ t, at, out }) => {
  if (t < at || t >= out) return null;
  const p = cl(t, 327.33, 328.94, sin), z = cl(t, at, out, sin), llego = cl(t, 328.94, 329.2);
  const dt = t - 328.94, bote = dt > 0 ? 0.03 * Math.exp(-dt * 9) * Math.cos(dt * 24) : 0;
  const sc = mix(1.95, 1, p) + bote, dx = mix(-60, 0, p), dy = mix(300, 0, p);
  const pies = Math.min(20, Math.max(5, Math.round((20 * p) / 5) * 5));
  return <Raiz>
    <World cx={mix(1130, 1170, z)} cy={mix(640, 560, z)} S={mix(1.14, 1.05, z)}>
      <Foto id="s042_ng" />
      {llego > 0 && <Foto id="s042" style={{ opacity: llego }} />}
      {llego < 1 && <Pieza id="s042" m={M_GEN} ox={1395} oy={590} transform={`translate(${dx}px,${dy}px) scale(${sc})`} filter={`drop-shadow(0 ${10 * (sc - 1)}px ${16 * (sc - 1)}px rgba(0,0,0,.45))`} />}
      {t >= 327.33 && t < 328.94 && <Lab key={pies} t={t} at={327.33} x={1500} y={330} txt={`${pies} ft`} size={96} />}
      <Lab t={t} at={328.94} x={1500} y={330} txt="20 feet" size={96} />
    </World>
  </Raiz>;
};

// ───────────────────────── B · EL GAS LE SACA EL COLOR A LA FOTO (s039, 300,7–307,0) ─────────────────────────
const GAS: number[][] = [[1180, 760, 301.8, 300], [980, 880, 302.3, 380], [1320, 860, 302.6, 330], [640, 760, 303.0, 420], [1090, 580, 304.9, 150], [1085, 400, 305.4, 170], [1080, 210, 305.9, 200]];
export const EscGas: React.FC<P> = ({ t, at, out }) => {
  if (t < at || t >= out) return null;
  const a = cl(t, 303.3, 304.5, cubIO), b = cl(t, 305.0, 306.5, cubIO);
  const cx = mix(mix(1090, 1420, a), 1090, b), cy = mix(mix(700, 520, a), 400, b), S = mix(mix(1.18, 1.34, a), 1.5, b) + 0.04 * cl(t, at, out);
  const m = GAS.filter((g) => t > g[2]).map((g) => { const r = g[3] * cl(t, g[2], g[2] + 1.5, cubOut); return `radial-gradient(circle at ${g[0]}px ${g[1]}px, #000 ${r * 0.55}px, transparent ${r}px)`; }).join(",");
  return <Raiz>
    <World cx={cx} cy={cy} S={S}>
      <Foto id="s039" />
      {m && <Foto id="s039" style={{ filter: "saturate(.05) contrast(1.08) brightness(.96)", WebkitMaskImage: m, maskImage: m }} />}
      <Lab t={t} at={304.81} fin={305.7} x={1885} y={270} txt="a crack is not outside." size={56} align="right" />
    </World>
  </Raiz>;
};

// ───────────────────────── C · LO QUE SE LEVANTA, SE VA DE LA FOTO (s105, 742,3–744,0) ─────────────────────────
const CORD: Pt[] = [[896, 826], [912, 806], [940, 800], [955, 812], [962, 838], [1014, 838], [1022, 812], [1040, 806], [1066, 824], [1078, 850], [1070, 880], [1040, 900], [1000, 916], [960, 928], [920, 926], [892, 906], [880, 876], [884, 848]];
const SHO: Pt[] = [[926, 950], [946, 908], [970, 886], [1000, 876], [1040, 874], [1080, 884], [1110, 874], [1160, 880], [1200, 896], [1240, 930], [1290, 985], [1340, 1000], [1350, 1080], [940, 1080], [922, 1000]];
const M_CORD = mascara(CORD, 4), M_SHO = mascara(SHO, 4);
export const EscPiso: React.FC<P> = ({ t, at, out }) => {
  if (t < at || t >= out) return null;
  const z = cl(t, at, out, sin), c = cl(t, 742.71, 743.08, cubIn), s = cl(t, 743.55, 743.9, cubIn);
  return <Raiz>
    <World cx={mix(1010, 1050, z)} cy={mix(760, 840, z)} S={mix(1.3, 1.5, z)}>
      <Foto id="s105_np" />
      {c < 1 && <Pieza id="s105" m={M_CORD} ox={990} oy={812} transform={`translateY(${-26 * c}px) scale(${1 - 0.45 * c})`} filter={`opacity(${1 - c})`} />}
      {s < 1 && <Pieza id="s105" m={M_SHO} ox={1100} oy={980} transform={`translateY(${-46 * s}px) rotate(${-5 * s}deg)`} filter={`opacity(${1 - s})`} />}
    </World>
  </Raiz>;
};

// ───────────────────────── D · CINCO GALONES SON CINCO DE ESTOS (m5jug, 770,7–774,3 y 775,8–777,4) ─────────────────────────
const JUG: Pt[] = [[896, 205], [912, 205], [926, 250], [922, 268], [924, 286], [936, 300], [968, 318], [976, 340], [978, 440], [968, 456], [866, 456], [854, 440], [852, 330], [862, 312], [888, 298], [896, 284], [896, 268], [888, 250]];
const M_JUG = mascara(JUG, 1.6);
const RAMO = [[-54, 775.86], [54, 776.02], [-27, 776.18], [27, 776.34]];
export const EscJug: React.FC<P> = ({ t, at, out }) => {
  if (t < at || t >= out) return null;
  const dos = at > 775, z = cl(t, at, out, sin), n = 1 + RAMO.filter((r) => t >= r[1]).length;
  const dt = t - 773.01, tira = !dos && dt > 0 ? 7 * Math.exp(-dt * 6) * Math.cos(dt * 20) : 0;
  return <Raiz>
    <World cx={mix(905, 925, z)} cy={dos ? mix(330, 345, z) : mix(250, 300, z)} S={dos ? mix(1.62, 1.72, z) : mix(1.9, 1.7, z)}>
      <Foto id="m5jug" />
      {dos && RAMO.map((r, i) => t >= r[1] && <Pieza key={i} id="m5jug" m={M_JUG} ox={905} oy={212} transform={`rotate(${r[0] * sp(t, r[1], 9, 150)}deg)`} filter="drop-shadow(0 6px 10px rgba(0,0,0,.35))" />)}
      <Pieza id="m5jug" m={M_JUG} ox={905} oy={212} transform={`translateY(${tira}px)`} />
      {!dos && <Lab t={t} at={773.01} x={1010} y={300} txt="8 lb" size={88} />}
      {dos && <Lab key={n} t={t} at={n === 1 ? at : RAMO[n - 2][1]} x={1150} y={150} txt={n === 5 ? "40+ lb" : `${n * 8} lb`} size={n === 5 ? 96 : 80} />}
    </World>
  </Raiz>;
};

// ───────────────────────── E · LAS OCHO GOTAS SE CUENTAN (s076, 550,6–554,7 · s078, 559,2–563,2) ─────────────────────────
const GOTA = "radial-gradient(circle at 1023px 329px, #000 8px, transparent 13px)";
export const EscGotas: React.FC<P> = ({ t, at, out }) => {
  if (t < at || t >= out) return null;
  if (at > 556) {
    const z = cl(t, at, out, sin), k = Math.round(mix(8, 16, cl(t, 562.23, 562.7)));
    return <Raiz>
      <World cx={mix(900, 960, z)} cy={mix(600, 680, z)} S={mix(1.12, 1.26, z)}>
        <Foto id="s078" />
        <Lab t={t} at={561.31} x={330} y={770} txt={`${k} drops`} size={104} />
      </World>
    </Raiz>;
  }
  const z = cl(t, at, out, sin), T0 = 550.64, PASO = 0.165;
  const n = Math.min(8, Math.max(0, Math.floor((t - T0 - 0.2) / PASO) + 1));
  return <Raiz>
    <World cx={mix(990, 1010, z)} cy={mix(380, 420, z)} S={mix(1.55, 1.68, z)}>
      <Foto id="s076" />
      {Array.from({ length: 8 }, (_, i) => {
        const k = (t - (T0 + i * PASO)) / 0.2;
        const plop = cl(t, T0 + i * PASO + 0.2, T0 + i * PASO + 0.42);
        return <React.Fragment key={i}>
          {k >= 0 && k < 1 && <div style={{ ...full, transformOrigin: "1023px 329px", transform: `translateY(${122 * k * k}px) scaleY(${1 + 0.5 * k})` }}><Foto id="s076" style={{ WebkitMaskImage: GOTA, maskImage: GOTA, filter: "brightness(1.25)" }} /></div>}
          {k >= 1 && plop < 1 && <div style={{ position: "absolute", left: 1023 - 40 - 22 * plop, top: 452 - 9 - 4 * plop, width: 80 + 44 * plop, height: 18 + 8 * plop, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,.75), transparent 70%)", opacity: 1 - plop, mixBlendMode: "screen" }} />}
        </React.Fragment>;
      })}
      {n > 0 && <Lab key={n === 8 ? "f" : n} t={t} at={n === 8 ? T0 + 7 * PASO + 0.2 : t - 0.3} x={455} y={455} txt={n === 8 ? "8 drops" : String(n)} size={n === 8 ? 100 : 120} />}
      <Lab t={t} at={553.91} x={461} y={572} txt="30 minutes" size={54} />
    </World>
  </Raiz>;
};
