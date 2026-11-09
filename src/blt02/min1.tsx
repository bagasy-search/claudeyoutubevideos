// blt02 · PRIMER MINUTO (6,92–42,34 s). Tres escenas hechas con la foto real, cada una con un mecanismo propio:
//   EscRumor  · el rumor SE INFLA: la mano con el teléfono crece con cada cosa que "dice el teléfono" y se desinfla en "supposedly".
//   EscGiro   · lo que pasa de verdad: en la foto quieta, la mano del operador se levanta y APRIETA el botón; de ahí sale la onda.
//   EscOnda   · la onda cruza la sala: radio, tele, cable y satélite dan un golpe cuando los cruza; después pasa por la cocina
//               y al teléfono y a la lámpara los rodea sin tocarlos.
// Coordenadas de cada foto en 1920x1080 (objectFit fill). Cada cosa cae en el cuadro de su palabra (words.json).
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

// ───────────────────────── 1 · EL RUMOR SE INFLA (s000 → s001) ─────────────────────────
const MANO1: Pt[] = [[790, 652], [816, 636], [822, 618], [834, 602], [850, 592], [872, 594], [890, 598], [906, 596], [916, 604], [930, 618], [990, 624], [1002, 640], [1002, 668], [986, 690], [960, 702], [930, 712], [900, 720], [866, 722], [838, 716], [790, 714]];
const M_MANO1 = mascara(MANO1, 2.2, [832, 0, 794, 0]);
// Foto nueva hk_pov: el teléfono de frente. La pantalla (cuadrilátero real, con su perspectiva) muestra una foto por cada dicho.
const TEL: Pt[] = [[798, 172], [815, 164], [1080, 164], [1098, 180], [1112, 360], [1124, 400], [1152, 470], [1200, 560], [1240, 650], [1282, 700], [1310, 760], [1310, 905], [1100, 908], [960, 884], [880, 844], [830, 830], [810, 812], [798, 770], [748, 742], [738, 700], [740, 640], [746, 560], [750, 480], [760, 428], [792, 414], [796, 300]];
const M_TEL = mascara(TEL, 2, [1236, 0, 1306, 0]);
const PANT = "matrix3d(0.95844444,-0.0085502646,0,-1.0582011e-05,0.050170796,0.98371271,0,2.1731269e-05,0,0,1,0,801,180,0,1)";
const PX = 1290, PY = 800, BX = 955.84, BY = 495.71, TOPE = 6.95;
const DICHOS: { at: number; txt: string; size: number; sc: number; img: string; pos: string }[] = [
  { at: 6.95, txt: "“three days”", size: 60, sc: 1.1, img: "hk_cal", pos: "51% 50%" },
  { at: 7.62, txt: "“no power”", size: 64, sc: 1.22, img: "hk_dark", pos: "50% 50%" },
  { at: 8.52, txt: "“no banks”", size: 68, sc: 1.34, img: "hk_bank", pos: "44% 50%" },
  { at: 9.42, txt: "“no internet”", size: 70, sc: 1.46, img: "hk_net", pos: "53% 50%" },
  { at: 10.38, txt: "“33 countries”", size: 104, sc: 1.46, img: "hk_map", pos: "50% 50%" },
];
export const EscRumor: React.FC<P> = ({ t, at, out }) => {
  if (t < at || t >= out) return null;
  if (t < 12.84) {
    let sc = 1, pag = 0; DICHOS.forEach((d, i) => { sc += (d.sc - (i ? DICHOS[i - 1].sc : 1)) * sp(t, d.at); if (i) pag += i === 4 ? cl(t, 10.28, 10.44, cubIO) : sp(t, d.at, 14, 160); });
    let cur = 0; DICHOS.forEach((d, i) => { if (t >= d.at) cur = i; });
    // "33 countries": el teléfono se infla hasta que la foto del mapa en su pantalla llena el cuadro
    const boom = cl(t, 10.44, 10.86, cubIO), deriva = cl(t, 10.86, 12.84);
    const S = mix(sc, TOPE, boom) * (1 + 0.06 * deriva);
    const tx = (960 - PX - (BX - PX) * S) * boom, ty = (540 - PY - (BY - PY) * S) * boom;
    const z = cl(t, at, 10.4), tiembla = Math.sin(t * 5.2) * 0.4 * (sc - 1) * (1 - boom);
    const banderas = cl(t, 11.5, 11.68);
    const izq = cur === 4;
    return <Raiz>
      <World cx={mix(mix(930, 880, z), 960, boom)} cy={mix(mix(500, 520, z), 540, boom)} S={mix(mix(1.3, 1.2, z), 1, boom)}>
        <Foto id="hk_pov" />
        <div style={{ ...full, transformOrigin: `${PX}px ${PY}px`, transform: `translate(${tx}px,${ty}px) rotate(${tiembla}deg) scale(${S})`, filter: boom < 1 ? `drop-shadow(0 ${40 * (sc - 1)}px ${70 * (sc - 1)}px rgba(0,0,0,${Math.min(0.5, 1.4 * (sc - 1))}))` : undefined }}>
          <Foto id="hk_pov" style={mk(M_TEL)} />
          <div style={{ position: "absolute", left: 0, top: 0, width: 300, height: 650, transformOrigin: "0 0", transform: PANT, overflow: "hidden", borderRadius: 30 * (1 - boom), background: "#000" }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 300, transform: `translateY(${-650 * pag}px)` }}>
              {DICHOS.map((d, i) => Math.abs(i - pag) < 1.2 && <div key={i} style={{ position: "absolute", left: 0, top: 650 * i, width: 300, height: 650, background: "#000", overflow: "hidden" }}>
                {i === 4 && <Img src={src("hk_map")} style={{ position: "absolute", left: -20, top: -20, width: 340, height: 690, objectFit: "cover", filter: "blur(9px) brightness(.55)" }} />}
                {i < 4
                  ? <Img src={src(d.img)} style={{ width: 300, height: 650, objectFit: "cover", objectPosition: d.pos }} />
                  : <div style={{ position: "absolute", left: 0, top: 325 - 84.4, width: 300, height: 168.8, overflow: "hidden" }}>
                    <Img src={src("hk_map")} style={{ position: "absolute", left: 0, top: 0, width: 300, height: 168.8, objectFit: "cover" }} />
                    {banderas > 0 && <Img src={src("hk_flags")} style={{ position: "absolute", left: 0, top: 0, width: 300, height: 168.8, objectFit: "cover", opacity: banderas }} />}
                  </div>}
              </div>)}
            </div>
            <div style={{ position: "absolute", inset: 0, opacity: 1 - boom, background: "linear-gradient(118deg, rgba(255,255,255,.13), rgba(255,255,255,0) 38%)" }} />
          </div>
        </div>
      </World>
      <Lab t={t} at={at + 0.02} x={60} y={izq ? 800 : 566} txt="YOUR PHONE SAYS" size={25} italic={false} weight={600} />
      {DICHOS.map((d, i) => (i === cur || i === cur - 1) && <Lab key={i} t={t} at={d.at} fin={DICHOS[i + 1]?.at} x={54} y={i === 4 ? 836 : 606} txt={d.txt} size={d.size} />)}
      <Lab t={t} at={11.44} x={72} y={958} txt="“warning their people”" size={50} />
    </Raiz>;
  }
  // s001: el nieto lo infla otra vez ("dug up an old cartoon") y en "supposedly" se desinfla de golpe frente a la cara del abuelo
  const pop = cl(t, 15.16, 15.3, cubIn), dt = t - 15.3;
  const sc = 1 + (0.35 * cl(t, 13.68, 14.3, sin) + 0.55 * sp(t, 14.4)) * (1 - pop) - (dt > 0 ? 0.05 * Math.exp(-dt * 9) * Math.cos(dt * 26) : 0);
  const p = cl(t, 15.1, 17.46, sin);
  return <Raiz>
    <World cx={mix(930, 1120, p)} cy={mix(570, 455, p)} S={mix(1.05, 1.3, p)}>
      <Foto id="s001" />
      <Pieza id="s001" m={M_MANO1} ox={800} oy={684} transform={`rotate(${-3 * (sc - 1)}deg) scale(${sc})`} filter={`drop-shadow(0 ${14 * Math.max(0, sc - 1)}px ${24 * Math.max(0, sc - 1)}px rgba(0,0,0,${Math.max(0, Math.min(0.5, sc - 1))}))`} />
      <Lab t={t} at={15.16} x={1290} y={352} txt="supposedly." size={78} />
    </World>
  </Raiz>;
};

// ───────────────────────── 2 · EL GIRO: UNA MANO APRIETA UN BOTÓN (s002) ─────────────────────────
const BRAZO: Pt[] = [[1262, 556], [1215, 561], [1160, 571], [1100, 579], [1055, 581], [1030, 574], [1000, 561], [975, 556], [950, 561], [930, 573], [915, 590], [906, 606], [912, 618], [925, 627], [945, 633], [965, 640], [990, 636], [1010, 630], [1040, 628], [1080, 634], [1120, 643], [1160, 649], [1200, 653], [1262, 658]];
const M_BRAZO = mascara(BRAZO, 1.6);
// Anillo de la onda: la MISMA foto, un poco agrandada desde el centro, vista solo dentro de un aro que crece
const Anillo: React.FC<{ id: string; cx: number; cy: number; r: number; k: number }> = ({ id, cx, cy, r, k }) => {
  if (r <= 4 || k <= 0.01) return null;
  const w = 60 + r * 0.16, a = Math.max(0, r - w);
  const m = `radial-gradient(circle at ${cx}px ${cy}px, transparent ${a}px, rgba(0,0,0,.45) ${a + w * 0.6}px, #000 ${r - 5}px, transparent ${r}px)`;
  return <>
    <div style={{ ...full, WebkitMaskImage: m, maskImage: m, opacity: k }}><Foto id={id} style={{ transformOrigin: `${cx}px ${cy}px`, transform: "scale(1.1)", filter: "brightness(1.24) saturate(1.12)" }} /></div>
    <div style={{ ...full, opacity: 0.5 * k, background: `radial-gradient(circle at ${cx}px ${cy}px, transparent ${r - 46}px, rgba(255,250,235,.35) ${r - 14}px, rgba(255,255,255,.75) ${r - 4}px, transparent ${r}px)`, filter: "blur(3px)", mixBlendMode: "screen" }} />
  </>;
};
export const EscGiro: React.FC<P> = ({ t, at, out }) => {
  if (t < at || t >= out) return null;
  const a = cl(t, 28.3, 29.5, cubIO), b = cl(t, 30.0, out, sin);
  const S = mix(mix(1.2, 1.26, cl(t, at, 28.3)), 1.9, a) - 0.82 * b;
  const cx = mix(mix(1060, 1010, a), 960, b), cy = mix(mix(470, 610, a), 540, b);
  const dt = t - 29.7;
  const th = 4.6 * cl(t, 28.75, 29.45, sin) * (1 - cl(t, 29.58, 29.7, cubIn)) - (dt > 0 ? 0.7 * Math.exp(-dt * 10) * Math.cos(dt * 20) : 0);
  const R = (d: number) => 1700 * cl(t, 29.7 + d, 32.5 + d, Easing.out(Easing.quad));
  return <Raiz>
    <World cx={cx} cy={cy} S={S}>
      <Foto id="s002_nh" />
      <Pieza id="s002" m={M_BRAZO} ox={1262} oy={607} transform={`rotate(${th}deg)`} filter={th > 0.2 ? `drop-shadow(${-th * 1.5}px ${th * 3}px ${th * 2.5}px rgba(0,0,0,.4))` : undefined} />
      <Anillo id="s002" cx={935} cy={626} r={R(0)} k={1 - cl(t, 31.6, 32.5)} />
      <Anillo id="s002" cx={935} cy={626} r={R(0.3)} k={0.6 * (1 - cl(t, 31.9, 32.78))} />
    </World>
    <Lab t={t} at={at + 0.05} x={1420} y={640} txt="2:20 PM" size={118} />
    <Lab t={t} at={27.32} x={1426} y={772} txt="Eastern Time" size={50} />
    <Lab t={t} at={30.1} x={1426} y={850} txt="one test." size={50} />
  </Raiz>;
};

// ───────────────────────── 3 · LA ONDA CRUZA (m1wave → s004) ─────────────────────────
// Frente de onda: una franja vertical de la misma foto, estirada, que avanza de izquierda a derecha
const Frente: React.FC<{ id: string; x: number; k?: number }> = ({ id, x, k = 1 }) => {
  if (x < -20 || x > 2150) return null;
  const m = `linear-gradient(90deg, transparent ${x - 330}px, rgba(0,0,0,.35) ${x - 190}px, #000 ${x - 60}px, #000 ${x - 10}px, transparent ${x}px)`;
  return <>
    <div style={{ ...full, WebkitMaskImage: m, maskImage: m, opacity: k }}><Foto id={id} style={{ transformOrigin: `${x - 150}px 540px`, transform: "scaleX(1.5) scaleY(1.04)", filter: "brightness(1.3) saturate(1.15)" }} /></div>
    <div style={{ position: "absolute", left: x - 6, top: 0, width: 46, height: 1080, opacity: 0.34 * k, background: "linear-gradient(90deg, rgba(0,0,0,.9), transparent)", filter: "blur(4px)" }} />
    <div style={{ position: "absolute", left: x - 70, top: 0, width: 74, height: 1080, opacity: 0.6 * k, background: "linear-gradient(90deg, transparent, rgba(255,250,235,.55) 78%, rgba(255,255,255,.9) 94%, transparent)", filter: "blur(5px)", mixBlendMode: "screen" }} />
  </>;
};
const APARATOS: { br?: number; at: number; x: number; pts: Pt[]; o: Pt; amp: number; txt: string; lab: Pt; align: "center" | "left" }[] = [
  { at: 33.6, x: 165, pts: [[188, 108], [197, 112], [84, 664], [258, 664], [270, 682], [270, 864], [258, 876], [64, 876], [56, 862], [56, 680], [62, 666], [70, 664]], o: [165, 872], amp: 0.075, txt: "radio", lab: [190, 900], align: "center" },
  { at: 34.26, x: 688, pts: [[498, 316], [876, 316], [878, 602], [496, 602]], o: [688, 602], amp: 0.055, txt: "television", lab: [688, 622], align: "center" },
  { at: 34.98, x: 1450, pts: [[1334, 598], [1604, 598], [1606, 654], [1478, 662], [1474, 944], [1296, 944], [1300, 662], [1334, 654]], o: [1450, 628], amp: 0.06, txt: "cable", lab: [1500, 745], align: "left" },
  { at: 35.58, x: 1805, pts: [[1752, 204], [1852, 204], [1858, 296], [1832, 338], [1788, 338], [1752, 292]], o: [1805, 268], amp: 0.22, br: -0.1, txt: "satellite", lab: [1770, 700], align: "center" },
];
const M_AP = APARATOS.map((d) => mascara(d.pts, 6));
const golpe = (t: number, at: number) => { const d = t - at; return d < 0 ? 0 : Math.min(1, d / 0.05) * Math.exp(-d * 5.5) * (0.62 + 0.38 * Math.cos(d * 21)); };
const XS = [[32.9, -30], ...APARATOS.map((d) => [d.at, d.x + 30]), [36.25, 2160]];
const XD = [[38.5, -30], [39.3, 1010], [39.5, 1090], [40.25, 1400], [41.3, 1690], [41.56, 1800], [42.2, 2160]];
const pasa = (t: number, k: number[][]) => interpolate(t, k.map((q) => q[0]), k.map((q) => q[1]), { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
// La onda no toca: la foto intacta por encima del frente, dentro de un óvalo suave
const Intacto: React.FC<{ id: string; cx: number; cy: number; rx: number; ry: number }> = ({ id, cx, cy, rx, ry }) => {
  const m = `radial-gradient(ellipse ${rx}px ${ry}px at ${cx}px ${cy}px, #000 62%, transparent 100%)`;
  return <Foto id={id} style={{ WebkitMaskImage: m, maskImage: m }} />;
};
export const EscOnda: React.FC<P> = ({ t, at, out }) => {
  if (t < at || t >= out) return null;
  if (t < 38.38) {
    const u = cl(t, 33.7, 35.5, sin), fin = cl(t, 36.2, 38.38, sin);
    return <Raiz>
      <World cx={mix(mix(906, 1004, u), 960, fin)} cy={540} S={mix(1.06, 1.02, fin)}>
        <Foto id="m1wave" />
        <Frente id="m1wave" x={pasa(t, XS)} />
        {APARATOS.map((d, i) => { const g = golpe(t, d.at); return g > 0.004 ? <Pieza key={i} id="m1wave" m={M_AP[i]} ox={d.o[0]} oy={d.o[1]} transform={`scale(${1 + d.amp * g})`} filter={`brightness(${1 + (d.br ?? 0.35) * g}) contrast(${1 + 0.5 * g})`} /> : null; })}
        {APARATOS.map((d, i) => <Lab key={i} t={t} at={d.at + 0.04} fin={36.6} x={d.lab[0]} y={d.lab[1]} txt={d.txt} size={46} align={d.align} />)}
        <Lab t={t} at={36.98} x={452} y={120} txt="about one minute." size={68} />
      </World>
    </Raiz>;
  }
  const z = cl(t, 38.38, out), x = pasa(t, XD);
  return <Raiz>
    <World cx={mix(1000, 1080, z)} cy={mix(560, 520, z)} S={mix(1.04, 1.1, z)}>
      <Foto id="s004" />
      <Frente id="s004" x={x} />
      <Intacto id="s004" cx={1222} cy={792} rx={230} ry={150} />
      <Intacto id="s004" cx={1822} cy={140} rx={170} ry={140} />
      <Lab t={t} at={39.44} x={1232} y={592} txt="not your phone" size={50} />
      <Lab t={t} at={41.5} x={1668} y={92} txt="not your power" size={50} align="right" />
    </World>
  </Raiz>;
};
