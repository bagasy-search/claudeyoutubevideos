// blt02 · escenas hechas CON la foto real (método edicion-sobre-fotos): sin tarjetas ni dibujos.
// Coordenadas de cada foto en 1920x1080 (objectFit fill). Cada cosa nueva cae en el cuadro de su palabra.
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/Fraunces";
import { FONT } from "./lib";

const { fontFamily: SERIF } = loadSerif();
const CREMA = "#F7F0E3";
const SOMBRA = "0 2px 18px rgba(0,0,0,.75)";
const sin = Easing.inOut(Easing.sin), cubOut = Easing.out(Easing.cubic), cubIn = Easing.in(Easing.cubic), cubIO = Easing.inOut(Easing.cubic);
const cl = (t: number, a: number, b: number, easing?: (x: number) => number) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
const sp = (t: number, at: number) => (t < at ? 0 : spring({ frame: Math.round((t - at) * 30), fps: 30, config: { damping: 13, stiffness: 150, mass: 0.8 } }));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080 };
const src = (id: string) => staticFile("img/blt02/" + id + ".jpg");
type Pt = number[];

const mascara = (pts: Pt[], fe: number) => {
  const p = pts.map((q) => q.join(",")).join(" ");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'><defs><filter id='f' x='-10%' y='-10%' width='120%' height='120%'><feGaussianBlur stdDeviation='${fe}'/></filter></defs><polygon points='${p}' fill='white' filter='url(#f)'/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
};

const Foto: React.FC<{ id: string; filter?: string; opacity?: number }> = ({ id, filter, opacity }) =>
  <Img src={src(id)} style={{ ...full, objectFit: "fill", filter, opacity }} />;

// La misma foto apagada encima: k=0 normal, k=1 oscura y casi sin color
const Base: React.FC<{ id: string; k: number; dark?: string }> = ({ id, k, dark = "saturate(.35) brightness(.42)" }) => <>
  <Foto id={id} />
  {k > 0 && <Foto id={id} filter={dark} opacity={k} />}
</>;

const World: React.FC<{ cx: number; cy: number; S: number; blur?: number; children: React.ReactNode }> = ({ cx, cy, S, blur = 0, children }) => {
  const X = Math.max(1920 * (1 - S), Math.min(0, 960 - cx * S)), Y = Math.max(1080 * (1 - S), Math.min(0, 540 - cy * S));
  return <div style={{ ...full, transformOrigin: "0 0", transform: `translate(${X}px,${Y}px) scale(${S})`, filter: blur > 0.05 ? `blur(${blur}px)` : undefined }}>{children}</div>;
};

// Un objeto real de la foto, recortado por su contorno, que se enciende en su palabra
const Lit: React.FC<{ id: string; pts: Pt[]; t: number; at: number; cx: number; cy: number; fe?: number; lift?: number; rise?: number; dx?: number; shift?: number; base?: number; flash?: boolean; plain?: boolean }> =
  ({ id, pts, t, at, cx, cy, fe = 3, lift = 0.06, rise = 12, dx = 0, shift = 0, base = 1, flash = true, plain = false }) => {
    const m = useMemo(() => mascara(pts, fe), [pts, fe]);
    if (t < at) return null;
    const s = sp(t, at), asienta = cl(t, at + 0.8, at + 1.46, sin), sc = 1 + lift * s - lift * 0.4 * asienta;
    const br = base * (flash ? 1 + 0.25 * (1 - cl(t, at, at + 0.6)) : 1);
    return <div style={{ ...full, opacity: cl(t, at, at + 0.33, cubOut), transformOrigin: `${cx}px ${cy}px`, transform: `translate(${dx * s + shift}px,${-rise * s}px) scale(${sc})`, filter: plain ? `brightness(${br})` : `drop-shadow(0 16px 24px rgba(0,0,0,.6)) brightness(${br})` }}>
      <Img src={src(id)} style={{ ...full, objectFit: "fill", WebkitMaskImage: m, maskImage: m, WebkitMaskSize: "1920px 1080px", maskSize: "1920px 1080px" }} />
    </div>;
  };

const Lab: React.FC<{ t: number; at: number; x: number; y: number; txt: string; size?: number; align?: "center" | "left"; italic?: boolean; weight?: number }> =
  ({ t, at, x, y, txt, size = 34, align = "center", italic = true, weight = 500 }) => {
    if (t < at) return null;
    const k = cl(t, at, at + 0.36, cubOut);
    return <div style={{ position: "absolute", left: x, top: y, opacity: k, transform: `translate(${align === "center" ? "-50%" : "0"},${(1 - k) * 12}px)`, fontFamily: SERIF, fontStyle: italic ? "italic" : "normal", fontWeight: weight, fontSize: size, color: CREMA, whiteSpace: "nowrap", textShadow: SOMBRA }}>{txt}</div>;
  };

const Raiz: React.FC<{ children: React.ReactNode }> = ({ children }) => <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>{children}</AbsoluteFill>;
type P = { t: number; at: number; out: number };

// ── 1 · "It is a test": la palabra está hecha con las barras reales del televisor y queda DETRÁS de la pareja, que sigue comiendo
const PAREJA: Pt[] = [[578, 210], [600, 192], [640, 200], [648, 190], [652, 150], [668, 105], [700, 75], [735, 65], [768, 85], [785, 125], [792, 138], [830, 150], [868, 178], [872, 150], [870, 120], [885, 85], [925, 62], [985, 57], [1040, 75], [1070, 120], [1072, 165], [1050, 205], [1042, 225], [1090, 240], [1130, 400], [640, 500], [578, 300]].map(([x, y]) => [x * 1.5, y * 1.5]);
const KB = 870 / 400;
export const EscTV: React.FC<P> = ({ t, at, out }) => {
  if (t < at || t >= out) return null;
  const p = cl(t, at, 43.4, cubIO), r = cl(t, 42.78, 43.12, cubOut), S = mix(1.3, 1.05, p) + 0.04 * cl(t, 43.4, out, sin);
  return <Raiz><World cx={mix(260, 1010, p)} cy={mix(320, 520, p)} S={S}>
    <Foto id="s005" />
    {r > 0 && <div style={{ position: "absolute", left: 425, top: 52, width: 880, height: 250, clipPath: `inset(-20px ${100 - 100 * r}% -20px 0)`, fontFamily: FONT, fontWeight: 900, fontSize: 296, lineHeight: "250px", letterSpacing: -2, whiteSpace: "nowrap", backgroundImage: `url("${src("s005")}")`, backgroundSize: `${1920 * KB}px ${1080 * KB}px`, backgroundPosition: `0px ${-210 * KB}px`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>TEST</div>}
    <Lit id="s005" pts={PAREJA} t={t} at={at - 1} cx={1000} cy={300} lift={0} rise={0} flash={false} fe={2} plain />
  </World></Raiz>;
};

// ── 2 · De la mano de un hombre a la pared del Sol: la cámara entra por el teléfono
const SOL: Pt[] = [[1047, 38], [1290, 8], [1530, 0], [1590, 90], [1635, 270], [1620, 480], [1587, 660], [1300, 575], [1062, 480]];
export const EscSol: React.FC<P> = ({ t, at, out }) => {
  if (t < at || t >= out) return null;
  if (t < 241.1) {
    const k = cl(t, 239.9, 241.08, cubIn), S = mix(mix(1.06, 1.18, cl(t, at, 239.9)), 8, k);
    return <Raiz><World cx={998} cy={502} S={S} blur={14 * cl(t, 240.4, 241.0)}><Foto id="s029" /></World>
      <AbsoluteFill style={{ background: "#000", opacity: cl(t, 240.72, 241.06) }} /></Raiz>;
  }
  const p = cl(t, 241.1, 242.6, cubOut), S = mix(3.4, 1.05, p), d = cl(t, 242.3, 242.9, sin);
  return <Raiz><World cx={mix(1290, 960, p)} cy={mix(400, 540, p)} S={S} blur={12 * (1 - cl(t, 241.1, 241.6))}>
    <Base id="s030" k={d * 0.86} />
    <Lit id="s030" pts={SOL} t={t} at={242.3} cx={1300} cy={300} lift={0} rise={0} flash={false} fe={7} />
  </World>
    <AbsoluteFill style={{ background: "#000", opacity: 1 - cl(t, 241.1, 241.4) }} />
    <Lab t={t} at={243.86} x={90} y={720} txt="Real." size={92} align="left" />
    <Lab t={t} at={245.02} x={90} y={830} txt="And common." size={92} align="left" />
  </Raiz>;
};

// ── 3 · Golpe a la puerta, la nota pegada, adentro: la aguja del termómetro sube y la puerta real se cierra sobre la heladera
const circulo = (cx: number, cy: number, r: number, n = 26): Pt[] => Array.from({ length: n }, (_, i) => [Math.round(cx + r * Math.cos((i / n) * 2 * Math.PI)), Math.round(cy + r * Math.sin((i / n) * 2 * Math.PI))]);
const TERMO = circulo(570, 405, 116);
const AGUJA: Pt[] = [[545, 375], [561, 372], [602, 458], [584, 466]];
const M_AGUJA = mascara(AGUJA, 2), M_PARCHE = mascara([[535, 365], [570, 360], [612, 462], [576, 476]], 5);
const mk = (m: string): React.CSSProperties => ({ WebkitMaskImage: m, maskImage: m, WebkitMaskSize: "1920px 1080px", maskSize: "1920px 1080px" });
export const EscNevera: React.FC<P> = ({ t, at, out }) => {
  if (t < at || t >= out) return null;
  if (t < 455.175) {
    const g = t >= 451.06 ? Math.exp(-(t - 451.06) * 5) : 0, n = cl(t, 452.4, 453.7, cubIO), k = cl(t, 454.3, 455.15, cubIn);
    const S = mix(mix(1.04, 1.1, cl(t, at, 451.06)), 1.55, n) + 0.06 * g + 4 * k;
    return <Raiz><World cx={mix(mix(800, 250, n), 330, k)} cy={mix(mix(540, 490, n), 420, k)} S={S} blur={10 * cl(t, 454.8, 455.15)}><Foto id="s061" /></World>
      <AbsoluteFill style={{ background: "#000", opacity: cl(t, 454.9, 455.15) }} /></Raiz>;
  }
  const p = cl(t, 455.175, 456.4, cubOut), luz = cl(t, 455.95, 456.28, cubOut), th = 28 * cl(t, 455.95, 457.86, sin), dx = -1100 * cl(t, 458.55, 459.2, cubIO);
  return <Raiz><World cx={mix(570, 640, p)} cy={mix(400, 470, p)} S={mix(2, 1.62, p)}>
    <Foto id="s062" />
    <Lit id="s062" pts={TERMO} t={t} at={455.95} cx={570} cy={405} lift={0} rise={0} base={2} flash={false} fe={5} plain />
    {luz > 0 && <div style={{ ...full, ...mk(M_PARCHE), filter: "brightness(2)", opacity: luz }}><Img src={src("s062")} style={{ ...full, objectFit: "fill", transform: "translateX(44px)", filter: "blur(2px)" }} /></div>}
    {luz > 0 && <div style={{ ...full, opacity: luz, transformOrigin: "570px 417px", transform: `rotate(${th}deg)`, filter: "brightness(2.2)" }}><Img src={src("s062")} style={{ ...full, objectFit: "fill", ...mk(M_AGUJA) }} /></div>}
    {dx !== 0 && <div style={{ position: "absolute", left: 1002 + dx, top: 0, width: 1700, height: 1080, overflow: "hidden", boxShadow: "-30px 0 50px rgba(0,0,0,.7)" }}>
      <div style={{ position: "absolute", left: 250, top: 0, width: 1450, height: 1080, overflow: "hidden" }}><Img src={src("s062")} style={{ position: "absolute", left: -1270 * 6, top: 0, width: 1920 * 6, height: 1080 * 6, objectFit: "fill", filter: "blur(10px)" }} /></div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 250, height: 1080, overflow: "hidden" }}><Img src={src("s062")} style={{ position: "absolute", left: -1002, top: 0, width: 1920, height: 1080, objectFit: "fill" }} /></div>
    </div>}
  </World>
    <AbsoluteFill style={{ background: "#000", opacity: 1 - cl(t, 455.175, 455.5) }} />
    <Lab t={t} at={457.56} x={760} y={590} txt="4 hours" size={110} align="left" />
    <Lab t={t} at={458.95} x={764} y={722} txt="if it stays closed" size={64} align="left" />
  </Raiz>;
};

// ── 4 · Tres días en dos segundos: pasa el día y la noche sobre el garaje y los bidones reales se vacían de a dos
const bidon = (cx: number, top: number, bot: number, hw: number): Pt[] => {
  const H = bot - top;
  return [[cx - 0.22 * hw, top], [cx + 0.22 * hw, top], [cx + 0.24 * hw, top + 0.09 * H], [cx + 0.3 * hw, top + 0.16 * H], [cx + 0.85 * hw, top + 0.3 * H], [cx + hw, top + 0.42 * H], [cx + hw, bot - 0.05 * H], [cx + 0.85 * hw, bot], [cx - 0.85 * hw, bot], [cx - hw, bot - 0.05 * H], [cx - hw, top + 0.42 * H], [cx - 0.85 * hw, top + 0.3 * H], [cx - 0.3 * hw, top + 0.16 * H], [cx - 0.24 * hw, top + 0.09 * H]];
};
const JUGS = [[567, 848, 1032, 49], [739, 830, 1014, 46], [894, 820, 998, 46], [1033, 803, 980, 46], [1161, 793, 962, 45], [1294, 786, 956, 46]];
const M_JUGS = JUGS.map(([c, a, b, w]) => mascara(bidon(c, a, b, w), 2));
const DIAS = [536.25, 536.95, 537.65];
export const EscBidones: React.FC<P> = ({ t, at, out }) => {
  if (t < at || t >= out) return null;
  const z = cl(t, at, 536.2, cubIO), S = mix(1.02, 1.6, z);
  const noche = t > 536.25 && t < 538.35 ? 0.85 * Math.sin((Math.PI * (t - 536.25)) / 0.7) ** 2 : 0;
  return <Raiz><World cx={930} cy={mix(540, 900, z)} S={S}>
    <Foto id="s072" />
    {JUGS.map(([c, a, b], i) => {
      const k = cl(t, DIAS[i >> 1], DIAS[i >> 1] + 0.7, sin);
      if (k <= 0) return null;
      const H = b - a, y = mix(a + 0.26 * H, b - 0.06 * H, k);
      return <div key={i} style={{ ...full, ...mk(M_JUGS[i]) }}>
        <div style={{ ...full, clipPath: `inset(0 0 ${1080 - y}px 0)` }}><Img src={src("s072")} style={{ ...full, objectFit: "fill", filter: "brightness(1.14) contrast(.62) saturate(.5) blur(1.6px)" }} /></div>
        <div style={{ position: "absolute", left: c - 60, top: y - 1.5, width: 120, height: 3, background: "rgba(255,255,255,.38)", filter: "blur(2px)" }} />
      </div>;
    })}
    {noche > 0 && <Foto id="s072" filter="brightness(.38) saturate(.7)" opacity={noche} />}
    <Lab t={t} at={535.58} x={1035} y={716} txt="6 gallons" size={54} />
    {DIAS.map((d, i) => <Lab key={i} t={t} at={d} x={[653, 963, 1228][i]} y={[1022, 992, 960][i]} txt={`day ${i + 1}`} size={42} />)}
    <Lab t={t} at={538.41} x={1430} y={700} txt="+ the dog" size={54} />
  </World></Raiz>;
};

// ── 5 · El foco de la cámara viaja por el banco: cada aparato se pone nítido cuando se lo nombra y su nombre queda escrito sobre la madera
const ALARMA: Pt[] = [[312, 660], [590, 648], [604, 664], [608, 792], [596, 806], [312, 834], [298, 820], [296, 676]];
const RADIO: Pt[] = [[622, 645], [645, 622], [690, 622], [680, 560], [700, 535], [735, 555], [810, 640], [930, 632], [952, 660], [955, 790], [932, 812], [640, 812], [622, 790]];
const BANCO: Pt[] = [[968, 730], [1045, 712], [1115, 612], [1180, 545], [1290, 530], [1370, 590], [1300, 640], [1285, 720], [1282, 790], [1260, 812], [985, 812], [968, 790]];
const FOCO = [{ m: mascara(ALARMA, 12), at: 928.29, x: 450, txt: "CO alarm" }, { m: mascara(RADIO, 12), at: 930.27, x: 790, txt: "crank radio" }, { m: mascara(BANCO, 14), at: 932.37, x: 1125, txt: "power bank" }];
export const EscKit: React.FC<P> = ({ t, at, out }) => {
  if (t < at || t >= out) return null;
  const d = cl(t, 927.9, 928.3, sin), u = cl(t, 928.0, 933.6, sin);
  return <Raiz><World cx={mix(520, 860, u)} cy={720} S={mix(1.2, 1.24, u)}>
    <Foto id="s141" />
    {d > 0 && <Foto id="s141" filter="blur(11px) brightness(.86)" opacity={d} />}
    {FOCO.map((f, i) => {
      const fin = FOCO[i + 1]?.at ?? 99999, o = cl(t, f.at, f.at + 0.25, sin) * (1 - cl(t, fin, fin + 0.25, sin));
      return o > 0 ? <Img key={i} src={src("s141")} style={{ ...full, objectFit: "fill", opacity: o, ...mk(f.m) }} /> : null;
    })}
    {FOCO.map((f, i) => t >= f.at + 0.1 && <div key={i} style={{ position: "absolute", left: f.x, top: 868, transform: "translateX(-50%) perspective(900px) rotateX(52deg)", opacity: cl(t, f.at + 0.1, f.at + 0.45, cubOut) * (1 - cl(t, (FOCO[i + 1]?.at ?? 99999) - 0.1, (FOCO[i + 1]?.at ?? 99999) + 0.15)), fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 66, color: CREMA, whiteSpace: "nowrap", textShadow: "0 2px 6px rgba(0,0,0,.65)" }}>{f.txt}</div>)}
  </World></Raiz>;
};

// ── 6 · Cada pestaña real se abre en su propia silueta y por ahí entra lo que hay en ese capítulo
const TABS: { pts: Pt[]; at: number; txt: string; c: Pt; foto: string; col: string }[] = [
  { pts: [[878, 222], [930, 210], [933, 273], [867, 294]], at: 1002.21, txt: "Water", c: [900, 252], foto: "t_water", col: "#E9B22A" },
  { pts: [[858, 300], [933, 282], [930, 352], [849, 375]], at: 1002.81, txt: "Food", c: [893, 328], foto: "t_food", col: "#EDB63A" },
  { pts: [[837, 393], [930, 357], [927, 435], [830, 457]], at: 1003.45, txt: "Light", c: [880, 405], foto: "t_light", col: "#E86A24" },
  { pts: [[802, 594], [918, 543], [921, 630], [788, 684]], at: 1004.05, txt: "Heat", c: [853, 615], foto: "t_heat", col: "#C8262B" },
  { pts: [[788, 705], [912, 636], [903, 735], [770, 795]], at: 1004.63, txt: "Medical", c: [835, 720], foto: "t_medical", col: "#2744B0" },
  { pts: [[765, 825], [908, 742], [900, 855], [750, 927]], at: 1005.25, txt: "Money", c: [825, 835], foto: "t_money", col: "#1E54C4" },
  { pts: [[795, 930], [906, 855], [897, 975], [780, 1038]], at: 1005.83, txt: "Safety", c: [850, 950], foto: "t_safety", col: "#3C9A3E" },
];
const TS = 1.32, TX = 960 - 930 * TS, TY = 540 - 585 * TS;
const pant = (q: Pt) => [q[0] * TS + TX, q[1] * TS + TY];
const silueta = (pts: Pt[], c: Pt, k: number) => { const [a, b] = pant(c); return "polygon(" + pts.map((q) => { const [x, y] = pant(q); return `${a + (x - a) * k}px ${b + (y - b) * k}px`; }).join(",") + ")"; };
export const EscTabs: React.FC<P> = ({ t, at, out }) => {
  if (t < at || t >= out) return null;
  const S = mix(1.02, TS, cl(t, at, 1002.1, sin));
  let cur = -1; TABS.forEach((b, i) => { if (t >= b.at) cur = i; });
  return <Raiz>
    <World cx={930} cy={585} S={S}><Foto id="s152" /></World>
    {TABS.map((b, i) => {
      if (i !== cur && i !== cur - 1) return null;
      const k = 1 + 44 * cl(t, b.at, b.at + 0.3, cubIn);
      return <React.Fragment key={i}>
        <div style={{ ...full, background: b.col, clipPath: silueta(b.pts, b.c, k * 1.05 + 0.3) }} />
        <div style={{ ...full, overflow: "hidden", clipPath: silueta(b.pts, b.c, k) }}><World cx={960} cy={540} S={mix(1.03, 1.12, cl(t, b.at, b.at + 1, sin))}><Foto id={b.foto} /></World></div>
      </React.Fragment>;
    })}
    {cur >= 0 && <Lab key={cur} t={t} at={TABS[cur].at + 0.12} x={96} y={872} txt={TABS[cur].txt} size={128} align="left" />}
  </Raiz>;
};
