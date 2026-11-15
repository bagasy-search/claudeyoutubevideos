// gary14c · «10 Carbon Monoxide Mistakes» — componentes propios, PURO CSS/DOM (sin SVG, sin blur grande, sin backdrop-filter, sin grano, sin viñeta, sin sacudón).
// Mundo: el piso de concreto del garaje de Gary, escrito con tiza; detectores blancos, caños de PVC, nieve, chapa esmaltada. Registro: D:/rtmp/gary14_COMPONENTES.md
// m = cuadros (relativos al plano) en que se dice cada palabra ancla; dur = cuadros del plano. Todo dato en pantalla sale del guion (frases_t.txt).
import React from "react";
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from "remotion";
import { FONTS } from "./Piezas";

const { SERIF, SANS, HAND } = FONTS;
const cl = (v: number) => Math.max(0, Math.min(1, v));
const ou = (t: number) => Easing.out(Easing.cubic)(cl(t));
const io = (t: number) => Easing.inOut(Easing.cubic)(cl(t));
const k = (f: number, a: number, len = 12) => ou((f - a) / len);
const sp = (f: number, a: number) => { const x = Math.max(0, (f - a) / 30) * 9; return x <= 0 ? 0 : 1 - Math.exp(-x) * Math.cos(x * 1.7); };
const D = (m: number[], i: number, dur: number, fr: number) => (m[i] ?? Math.round(dur * fr));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
type P = { dur: number; m: number[]; a: string[] };
type CS = React.CSSProperties;
const ab = (x: number, y: number, w: number, h: number, st: CS = {}): CS => ({ position: "absolute", left: x, top: y, width: w, height: h, ...st });

const CH = "#f3f0e6", RED = "#d6402f", GRN = "#2f9e5a", YEL = "#f2c230", INK = "#1b2330", NIGHT = "#141b27", PVC = "#eef0ee", SNOW = "#eef3f7", BLUE = "#2b5d8f", ORG = "#e8892a";
const G = (id: string) => staticFile(`gary14c/g/${id}.png`);

// ---------- base: una FOTO REAL del video como plancha de fondo (cover) con un degradé oscuro suave — sin baldosas, sin manchas, sin grano
const PlateCtx = React.createContext<string>("g0020");
const Floor: React.FC<{ children?: React.ReactNode; dark?: number; ph?: string }> = ({ children, dark = 0, ph }) => {
  const f = useCurrentFrame(); const ctx = React.useContext(PlateCtx); const id = ph || ctx;
  return <AbsoluteFill style={{ background: "#141922", overflow: "hidden" }}>
    <Img src={G(id)} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover", transform: `scale(${1.08 - 0.05 * cl(f / 240)})` }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(12,15,22,.82) 0%, rgba(12,15,22,.68) 38%, rgba(12,15,22,.72) 70%, rgba(12,15,22,.88) 100%)" }} />
    {dark > 0 && <AbsoluteFill style={{ background: `rgba(10,14,22,${dark * 0.6})` }} />}
    {children}
  </AbsoluteFill>;
};
// cielo de invierno (noche → amanecer con t)
const Sky: React.FC<{ t?: number; children?: React.ReactNode }> = ({ t = 0, children }) => (
  <AbsoluteFill style={{ background: `linear-gradient(#0f1624, ${t > 0 ? `rgba(${Math.round(lerp(27, 236, t))},${Math.round(lerp(39, 168, t))},${Math.round(lerp(64, 120, t))},1)` : "#1b2740"})`, overflow: "hidden" }}>{children}</AbsoluteFill>
);
// números y unidades SIEMPRE en sans (en la letra a mano «FT» se leía «F1» y «CO» se leía «CC»)
const SEG = /(9-1-1|\d[\d,.:–\-]*\+?|\bFT\b|\bPPM\b|\bCO\b|O₂)/g;
const hand = (t: string) => t.split(SEG).map((s, i) => i % 2 ? <span key={i} style={{ fontFamily: SANS, fontWeight: 800, fontSize: "0.84em", letterSpacing: 1 }}>{s}</span> : s);
// tiza que se escribe (revela por recorte). Al terminar NO queda recorte (antes el inset 0% comía la cola de las letras inclinadas).
const Ch: React.FC<{ t: string; at: number; f: number; x: number; y: number; size?: number; col?: string; len?: number; c?: boolean; style?: CS }> = ({ t, at, f, x, y, size = 64, col = CH, len = 10, c, style }) => {
  const p = cl((f - at) / Math.min(len, 12)); if (p <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: c ? "translateX(-50%)" : undefined, fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, whiteSpace: "nowrap", padding: "0 0.25em", margin: "0 -0.25em", clipPath: p >= 1 ? undefined : `inset(-40% ${(1 - p) * 112 - 12}% -40% -12%)`, textShadow: "2px 3px 0 rgba(0,0,0,.35)", ...style }}>{hand(t)}</div>;
};
const Tx: React.FC<{ children: React.ReactNode; size?: number; col?: string; style?: CS }> = ({ children, size = 34, col = INK, style }) =>
  <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: size, color: col, letterSpacing: 2, lineHeight: 1.05, ...style }}>{children}</div>;
// raya de tiza (subrayado / tachado) que se dibuja
const Strike: React.FC<{ x: number; y: number; w: number; at: number; f: number; rot?: number; col?: string; th?: number }> = ({ x, y, w, at, f, rot = -4, col = CH, th = 8 }) =>
  <div style={ab(x, y, w * k(f, at, 10), th, { background: col, borderRadius: th, transform: `rotate(${rot}deg)`, transformOrigin: "0 50%", boxShadow: "2px 3px 0 rgba(0,0,0,.25)" })} />;
// fuente visible: etiqueta de papel amarillo pegada abajo a la izquierda (MEJORA 9)
const Src: React.FC<{ text: string; f: number; at: number }> = ({ text, f, at }) =>
  <div style={{ position: "absolute", left: 70, bottom: 54, padding: "10px 22px", background: "#f6e27a", fontFamily: SANS, fontWeight: 800, fontSize: 28, color: INK, letterSpacing: 2, whiteSpace: "nowrap", transform: `rotate(-2deg) translateY(${(1 - k(f, at, 10)) * 40}px)`, opacity: k(f, at, 10), boxShadow: "4px 6px 0 rgba(0,0,0,.3)" }}>SOURCE · {text}</div>;
// sello de goma: caja con borde que cae; el texto nunca se sale (nowrap + padding)
const Stamp: React.FC<{ text: string; f: number; at: number; x: number; y: number; col?: string; size?: number; rot?: number; bg?: string }> = ({ text, f, at, x, y, col = RED, size = 48, rot = -6, bg = "rgba(255,255,255,.9)" }) =>
  <div style={{ position: "absolute", left: x, top: y, padding: `${size * 0.32}px ${size * 0.6}px`, border: `8px solid ${col}`, borderRadius: 12, background: bg, whiteSpace: "nowrap", transform: `rotate(${rot}deg) scale(${1 + 0.5 * (1 - k(f, at, 6))})`, opacity: k(f, at, 4), boxShadow: "6px 8px 0 rgba(0,0,0,.3)" }}>
    <Tx size={size} col={col}>{text}</Tx></div>;

// ---------- FOTO COMO OBJETO: copia impresa / polaroid / papel rasgado / tarjeta redondeada, con sombra dura y cinta; entra cayendo
const TORN = "polygon(0 1.6%, 6% 0, 13% 1.8%, 21% 0.4%, 30% 1.6%, 38% 0, 47% 1.7%, 55% 0.3%, 64% 1.5%, 72% 0.1%, 81% 1.9%, 89% 0.5%, 100% 1.6%, 100% 98.4%, 93% 100%, 85% 98.2%, 76% 99.7%, 68% 98.3%, 59% 100%, 50% 98.4%, 41% 99.8%, 33% 98.1%, 24% 99.7%, 15% 98.3%, 7% 100%, 0 98.4%)";
const Pic: React.FC<{ id: string; x: number; y: number; w: number; h: number; f: number; at?: number; rot?: number; kind?: "pol" | "print" | "torn" | "round"; cap?: string; capCol?: string; pos?: string; op?: number; tape?: boolean }> =
  ({ id, x, y, w, h, f, at = 0, rot = 0, kind = "print", cap, capCol = INK, pos = "50% 50%", op = 1, tape }) => {
  const e = sp(f, at), o = k(f, at, 6) * op; if (o <= 0.001) return null;
  const pad = kind === "pol" ? 20 : kind === "round" ? 10 : 14, bot = kind === "pol" ? (cap ? 96 : 64) : (cap ? 76 : pad);
  const paper: CS = { position: "absolute", inset: 0, background: "#f6f2e8", borderRadius: kind === "round" ? 28 : 4, clipPath: kind === "torn" ? TORN : undefined };
  return <div style={ab(x, y, w, h, { transform: `translateY(${(1 - e) * 70}px) rotate(${rot + (1 - e) * 5}deg)`, opacity: o })}>
    <div style={{ ...paper, transform: "translate(12px,16px)", background: "rgba(0,0,0,.38)" }} />
    <div style={paper} />
    <div style={ab(pad, pad, w - 2 * pad, h - pad - bot, { overflow: "hidden", borderRadius: kind === "round" ? 20 : 2, background: "#222" })}>
      <Img src={G(id)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${1.1 - 0.06 * e})` }} />
    </div>
    {cap && <div style={{ position: "absolute", left: pad, right: pad, bottom: 0, height: bot, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontWeight: 700, fontSize: Math.min(44, Math.floor((w - 2 * pad) / (cap.length * 0.5))), color: capCol, whiteSpace: "nowrap" }}><span style={{ whiteSpace: "pre" }}>{hand(cap)}</span></div>}
    {tape && <div style={ab(w / 2 - 80, -22, 160, 46, { background: "rgba(236,226,186,.82)", transform: "rotate(-3deg)", boxShadow: "1px 2px 0 rgba(0,0,0,.15)" })} />}
  </div>;
};

// ---------- actores (piezas reutilizadas DENTRO de los componentes)
// detector de CO blanco, redondo, con rejilla de anillos y LED
const Puck: React.FC<{ s?: number; led?: string; ledOn?: number; back?: boolean; children?: React.ReactNode }> = ({ s = 1, led = GRN, ledOn = 1, back, children }) => (
  <div style={{ width: 180 * s, height: 180 * s, borderRadius: "50%", position: "relative", background: back ? "radial-gradient(circle at 45% 40%, #f1ece0, #d8d1c0 70%, #b9b19f)" : "radial-gradient(circle at 40% 35%, #ffffff, #e4e7e9 62%, #b8bdc1)", boxShadow: `0 ${7 * s}px 0 rgba(0,0,0,.3)` }}>
    {!back && <div style={{ position: "absolute", inset: 38 * s, borderRadius: "50%", background: "repeating-radial-gradient(circle, #cfd3d6 0 3px, #f5f6f7 3px 9px)" }} />}
    {!back && <div style={{ position: "absolute", right: 30 * s, top: 34 * s, width: 16 * s, height: 16 * s, borderRadius: "50%", background: ledOn > 0.5 ? led : "#5d6266", boxShadow: ledOn > 0.5 ? `0 0 0 ${4 * s}px rgba(255,255,255,.6)` : "none" }} />}
    {children}
  </div>
);
// generador portátil visto de costado: bastidor de caño negro, tanque naranja, silenciador a la derecha (escape en x+300,y+70)
const Gen2: React.FC<{ s?: number; run?: number; f?: number }> = ({ s = 1, run = 0, f = 0 }) => {
  const j = run ? Math.sin(f * 2.3) * 1.5 * run : 0;
  return (
    <div style={{ width: 300 * s, height: 210 * s, position: "relative", transform: `translateY(${j}px)` }}>
      <div style={{ position: "absolute", left: 10 * s, top: 0, right: 10 * s, bottom: 24 * s, border: `${11 * s}px solid #22262a`, borderRadius: 22 * s }} />
      <div style={{ position: "absolute", left: 34 * s, top: 18 * s, width: 170 * s, height: 62 * s, background: `linear-gradient(${ORG}, #c66f17)`, borderRadius: `${30 * s}px ${30 * s}px ${8 * s}px ${8 * s}px` }} />
      <div style={{ position: "absolute", left: 40 * s, top: 90 * s, width: 140 * s, height: 72 * s, background: "linear-gradient(#5a5f64,#3a3e42)", borderRadius: 8 * s }} />
      <div style={{ position: "absolute", left: 196 * s, top: 54 * s, width: 104 * s, height: 40 * s, background: "linear-gradient(#c9ced2,#80878d)", borderRadius: 20 * s }} />
      <div style={{ position: "absolute", left: 22 * s, bottom: 0, width: 50 * s, height: 50 * s, borderRadius: "50%", background: "radial-gradient(#777 0 30%, #1e1e1e 32%)" }} />
      <div style={{ position: "absolute", right: 22 * s, bottom: 0, width: 50 * s, height: 50 * s, borderRadius: "50%", background: "radial-gradient(#777 0 30%, #1e1e1e 32%)" }} />
    </div>
  );
};
// auto de costado (caño de escape abajo a la izquierda: x+10,y+128)
const Car: React.FC<{ s?: number; col?: string }> = ({ s = 1, col = "#5b7fa6" }) => (
  <div style={{ width: 440 * s, height: 170 * s, position: "relative" }}>
    <div style={{ position: "absolute", left: 100 * s, top: 0, width: 220 * s, height: 70 * s, background: col, clipPath: "polygon(14% 0, 82% 0, 100% 100%, 0 100%)" }} />
    <div style={{ position: "absolute", left: 128 * s, top: 12 * s, width: 160 * s, height: 50 * s, background: "#a9c3d8", clipPath: "polygon(12% 0, 86% 0, 100% 100%, 0 100%)" }} />
    <div style={{ position: "absolute", left: 0, top: 64 * s, width: 440 * s, height: 72 * s, background: col, borderRadius: `${28 * s}px ${40 * s}px ${14 * s}px ${14 * s}px` }} />
    <div style={{ position: "absolute", left: -8 * s, top: 118 * s, width: 30 * s, height: 12 * s, background: "#8d949a", borderRadius: 6 * s }} />
    {[64, 300].map((x) => <div key={x} style={{ position: "absolute", left: x * s, top: 100 * s, width: 76 * s, height: 76 * s, borderRadius: "50%", background: "radial-gradient(#9aa0a6 0 28%, #1d1d1d 30%)" }} />)}
  </div>
);
// bocanadas de escape (círculos grises que suben y se abren; gradiente radial chico, sin blur)
const Puffs: React.FC<{ f: number; x: number; y: number; at?: number; stop?: number; n?: number; dx?: number; dy?: number; col?: string; size?: number; life?: number; curve?: number }> = ({ f, x, y, at = 0, stop = 1e9, n = 8, dx = 0, dy = -140, col = "120,124,130", size = 56, life = 42, curve = 0 }) => {
  if (f < at) return null; const els: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const t = ((f - at) / life + i / n) % 1; const born = f - t * life; if (born < at - 0.5 || born > stop) continue;
    const s = size * (0.5 + t * 1.3);
    els.push(<div key={i} style={{ position: "absolute", left: x + dx * t + curve * t * t - s / 2, top: y + dy * t - s / 2, width: s, height: s, borderRadius: "50%", background: `radial-gradient(circle at 42% 40%, rgba(${col},.9), rgba(${col},.6) 58%, rgba(${col},0) 71%)`, opacity: 1 - t }} />);
  }
  return <>{els}</>;
};
// pared con siding de madera pintada
const Siding: React.FC<{ x: number; y: number; w: number; h: number; col?: string; children?: React.ReactNode }> = ({ x, y, w, h, col = "#d9d2c3", children }) => (
  <div style={ab(x, y, w, h, { background: `repeating-linear-gradient(0deg, ${col} 0 34px, rgba(0,0,0,.18) 34px 37px)`, boxShadow: "inset 0 -14px 0 rgba(0,0,0,.12)" })}>{children}</div>
);
// ventana con hoja de guillotina (open = 0..1 abre una rendija)
const Win: React.FC<{ x: number; y: number; w?: number; h?: number; open?: number; lit?: number }> = ({ x, y, w = 180, h = 220, open = 0, lit = 0 }) => (
  <div style={ab(x, y, w, h, { background: lit ? `rgba(255,214,120,${0.4 + 0.5 * lit})` : "#2b3a4c", border: "10px solid #f4f4f0", boxSizing: "border-box" })}>
    <div style={{ position: "absolute", left: 0, right: 0, top: -open * 40, height: "50%", borderBottom: "8px solid #f4f4f0" }} />
    <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 6, marginLeft: -3, background: "#f4f4f0" }} />
  </div>
);
// silueta de persona (cabeza + cuerpo), tint para «enfermo»
const Person: React.FC<{ s?: number; col?: string; slump?: number }> = ({ s = 1, col = "#f0e6d6", slump = 0 }) => (
  <div style={{ width: 70 * s, height: 170 * s, position: "relative", transform: `rotate(${slump * 18}deg)`, transformOrigin: "50% 100%" }}>
    <div style={{ position: "absolute", left: 15 * s, top: 0, width: 40 * s, height: 40 * s, borderRadius: "50%", background: col }} />
    <div style={{ position: "absolute", left: 0, top: 46 * s, width: 70 * s, height: 124 * s, borderRadius: `${30 * s}px ${30 * s}px ${8 * s}px ${8 * s}px`, background: col }} />
  </div>
);

// ================= INTRO =================
// sleep · LA CUADRA AL AMANECER: seis casas a oscuras; amanece y las ventanas se van prendiendo… dos no se prenden nunca
const Sleep: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t = io(f / Math.max(1, dur * 0.9)); const w = D(m, 0, dur, 0.45);
  const houses = [0, 1, 2, 3, 4, 5]; const dark = [2, 4];
  return <Floor ph="g0020" dark={0.2 * (1 - t)}>
    <AbsoluteFill style={{ background: `linear-gradient(rgba(236,168,120,${0.22 * t}), rgba(0,0,0,0) 60%)` }} />
    <Ch t="some of them don't wake up." at={w} f={f} x={960} y={50} size={92} c />
    <Pic id="g0220" x={190} y={200} w={740} h={560} f={f} at={2} rot={-3} kind="pol" cap="the first night of a blackout" tape />
    <Pic id="g2610" x={1010} y={230} w={700} h={520} f={f} at={8} rot={2.5} kind="pol" tape />
    <div style={ab(165, 850, 1620, 190)}>
      {houses.map((i) => { const lit = dark.includes(i) ? 0 : k(f, 6 + i * 4, 8);
        return <div key={i} style={ab(i * 275, 20, 230, 170)}>
          <div style={{ position: "absolute", left: -14, right: -14, top: 0, height: 60, background: "#23262d", clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 58, bottom: 0, background: "#343842" }} />
          {[28, 138].map((x) => <div key={x} style={ab(x, 78, 64, 50, { background: lit ? `rgba(255,214,120,${0.4 + 0.5 * lit})` : "#1e2733", border: "6px solid #e8e6df", boxSizing: "border-box" })} />)}
        </div>; })}
    </div>
  </Floor>;
};

// tenlist · DIEZ TARJETAS QUE SE DAN VUELTA: rojo «MISTAKE» → verde «SAFE WAY», en cascada
const TenList: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const a = D(m, 0, dur, 0.35);
  return <Floor>
    <Ch t="10 mistakes · 10 safe ways" at={2} f={f} x={960} y={70} size={84} c />
    <div style={{ position: "absolute", left: 160, top: 250, width: 1600, display: "flex", flexWrap: "wrap", gap: 40, perspective: 1600 }}>
      {Array.from({ length: 10 }, (_, i) => { const r = 180 * io((f - a - i * 2.4) / 10); const e = k(f, i * 1.5, 10);
        return <div key={i} style={{ width: 280, height: 290, position: "relative", transformStyle: "preserve-3d", transform: `translateY(${(1 - e) * 60}px) rotateY(${r}deg)`, opacity: e }}>
          <div style={{ position: "absolute", inset: 0, background: RED, borderRadius: 12, backfaceVisibility: "hidden", overflow: "hidden", boxShadow: "6px 8px 0 rgba(0,0,0,.3)" }}>
            <Img src={G(MPH[i])} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 96, background: RED, display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
              <Tx size={30} col="#ffd9d2">MISTAKE</Tx><Tx size={70} col="#fff">{i + 1}</Tx></div></div>
          <div style={{ position: "absolute", inset: 0, background: GRN, borderRadius: 12, backfaceVisibility: "hidden", transform: "rotateY(180deg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "-6px 8px 0 rgba(0,0,0,.3)" }}>
            <Tx size={30} col="#d6f5e1">THE SAFE WAY</Tx><Tx size={130} col="#fff">✓</Tx></div>
        </div>; })}
    </div>
  </Floor>;
};

// promise · LA NOTITA EN EL DETECTOR: ventana del dormitorio con la luna que sube, papelito «TONIGHT · 2-MIN CHECK» y la lámpara que se apaga
// promise:garage · LA PROMESA ESCRITA EN EL PISO: tres renglones de tiza dentro del lugar donde estaciona el auto
const Promise2: React.FC<P> = ({ dur, m, a }) => {
  const f = useCurrentFrame();
  if (a[0] === "garage") {
    const t = [D(m, 0, dur, 0.05), D(m, 1, dur, 0.35), D(m, 2, dur, 0.62)];
    return <Floor>
      <div style={ab(420, 150, 1080, 800, { border: `10px dashed rgba(243,240,230,${0.75 * k(f, 0, 10)})`, borderRadius: 14 })} />
      <Ch t="no engine runs in this garage" at={0} f={f} x={960} y={190} size={70} c col={YEL} len={10} />
      {["not the generator,", "not the car,", "not for ten minutes."].map((s, i) => <React.Fragment key={i}>
        <Ch t={s} at={t[i]} f={f} x={540} y={360 + i * 170} size={100} len={12} />
        <Strike x={540} y={480 + i * 170} w={820} at={t[i] + 10} f={f} rot={-1} col={RED} th={10} />
      </React.Fragment>)}
    </Floor>;
  }
  const t0 = D(m, 0, dur, 0.15), t1 = D(m, 1, dur, 0.55), t2 = D(m, 2, dur, 0.75); const moon = io(f / dur);
  return <Floor ph="g3220" dark={0.15}>
    {/* placa real de noche: sin ventana ni lámpara CSS */}    <Pic id="g2330" x={150} y={150} w={600} h={520} f={f} at={0} rot={-2} kind="print" tape />
    <div style={ab(520, 520 - 40 * (1 - k(f, t0, 12)), 470, 330, { background: "#ffe66b", transform: `rotate(${6 - 4 * k(f, t0, 12)}deg)`, opacity: k(f, t0, 8), boxShadow: "5px 8px 0 rgba(0,0,0,.3)" })}>
      <Ch t="2-minute check" at={t0 + 4} f={f} x={30} y={22} size={56} col={INK} />
      <Ch t="TONIGHT" at={t1} f={f} x={30} y={110} size={78} col={RED} />
      <div style={ab(30, 238, 46, 46, { border: `5px solid ${INK}` })} />
      <Ch t="before bed" at={t2} f={f} x={100} y={222} size={58} col={INK} />
    </div>
  </Floor>;
};
// ================= CDC =================
// cdc:400 · LA CUADRA DE 400 CASAS: 400 casitas encendidas; el contador sube y se apagan; sello «NOT FROM A FIRE»
// cdc:er / cdc:hosp · LOS DOS RECIPIENTES DE MEDIR: perlitas que llenan el de la guardia y una parte salta al del hospital
// cdc:months · DOCE VIDRIOS DE VENTANA: la escarcha crece sobre los meses fríos
const Cdc: React.FC<P> = ({ dur, m, a }) => {
  const f = useCurrentFrame(); const v = a[0];
  if (v === "400") {
    const t0 = D(m, 0, dur, 0.15), t1 = D(m, 1, dur, 0.7); const p = io((f - t0 + 6) / Math.max(20, dur * 0.3)); const n = Math.round(p * 400);
    return <Floor dark={0.35}>
      <div style={{ position: "absolute", left: 90, top: 140, width: 1000, display: "grid", gridTemplateColumns: "repeat(25, 36px)", gap: "8px 4px" }}>
        {Array.from({ length: 400 }, (_, i) => { const off = i < n; return <div key={i} style={{ width: 36, height: 34, position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 36, height: 14, background: off ? "#4d525a" : "#c9ccd0", clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />
          <div style={{ position: "absolute", left: 4, top: 14, width: 28, height: 20, background: off ? "#3a3e45" : "#c9ccd0" }}><div style={{ margin: "5px auto", width: 10, height: 9, background: off ? "#23262c" : "#ffd37a" }} /></div></div>; })}
      </div>
      <div style={ab(1160, 160, 700, 420)}>
        <Tx size={60} col={CH}>MORE THAN</Tx>
        <Tx size={250} col="#fff" style={{ fontFamily: SERIF }}>{n}</Tx>
        <Tx size={40} col={CH}>DIE EVERY YEAR FROM CO</Tx>
      </div>
      <Stamp text="NOTHING TO DO WITH A FIRE" f={f} at={t1} x={1110} y={690} size={34} />
      <Src text="CDC" f={f} at={t0} />
    </Floor>;
  }
  if (v === "er" || v === "hosp") {
    const hosp = v === "hosp"; const t0 = D(m, 0, dur, 0.4);
    // mismos dos recipientes: 100.000 llena el de la guardia; 14.000 llena 1/7 del otro (≈ 7 : 1)
    const pe = hosp ? 1 : io((f - t0 + 8) / 30), ph = hosp ? io((f - t0 + 4) / 28) * 0.14 : 0;
    const bin = (x: number, w: number, h: number, lvl: number, big: string, lbl: string, col: string) => <div style={ab(x, 960 - h, w, h)}>
      <div style={{ position: "absolute", inset: 0, border: "10px solid rgba(230,238,244,.85)", borderTop: "none", borderRadius: "0 0 26px 26px" }} />
      <div style={{ position: "absolute", left: 10, right: 10, bottom: 10, height: (h - 20) * lvl, borderRadius: "0 0 18px 18px", background: `radial-gradient(circle at 10px 10px, ${col} 0 7px, rgba(0,0,0,.28) 8px 10px)`, backgroundSize: "20px 20px" }} />
      {[1 / 7, 2 / 7, 3 / 7, 4 / 7, 5 / 7, 6 / 7].map((q) => <div key={q} style={{ position: "absolute", right: -40, bottom: 10 + (h - 20) * q, width: 30, height: 5, background: CH }} />)}
      <div style={{ position: "absolute", left: -120, right: -120, top: -230, textAlign: "center", opacity: cl(lvl * 30) }}><Tx size={104} col="#fff" style={{ fontFamily: SERIF }}>{big}</Tx><Tx size={36} col={CH} style={{ whiteSpace: "nowrap" }}>{lbl}</Tx></div>
    </div>;
    return <Floor dark={0.3}>
      {bin(300, 520, 560, pe, "100,000+", "GO TO THE EMERGENCY ROOM", "#e9c46a")}
      {bin(1100, 520, 560, ph, "14,000+", "END UP IN THE HOSPITAL", "#e76f51")}
      {hosp && Array.from({ length: 10 }, (_, i) => { const t = cl((f - t0 - i * 2) / 18); return <div key={i} style={ab(lerp(760, 1300, t), 420 - Math.sin(t * Math.PI) * 180 + i * 6, 20, 20, { borderRadius: "50%", background: "#e76f51", opacity: t > 0 && t < 1 ? 1 : 0 })} />; })}
      {hosp && <Tx size={40} col={YEL} style={{ position: "absolute", left: 1100, width: 520, top: 960 - 560 * 0.14 - 70, textAlign: "center", opacity: k(f, t0 + 20, 8) }}>≈ 1 IN 7</Tx>}
      <Ch t="every year" at={4} f={f} x={960} y={50} size={70} c />
      <Src text="CDC" f={f} at={6} />
    </Floor>;
  }
  const t0 = D(m, 0, dur, 0.2), t1 = D(m, 1, dur, 0.55); const MO = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]; const cold = [1, 1, 0.45, 0, 0, 0, 0, 0, 0, 0, 0.45, 1];
  return <AbsoluteFill style={{ background: "#e7e1d4" }}>
    <div style={{ position: "absolute", left: 210, top: 130, display: "grid", gridTemplateColumns: "repeat(6, 230px)", gap: 24 }}>
      {MO.map((mo, i) => { const fr = cold[i] * k(f, t0 + (i % 6) * 3, 26);
        return <div key={mo} style={{ width: 230, height: 300, border: "14px solid #fbfbf8", boxSizing: "border-box", background: "linear-gradient(#5e86b0,#9cbcd8)", position: "relative", overflow: "hidden", boxShadow: "4px 6px 0 rgba(0,0,0,.2)" }}>
          <div style={{ position: "absolute", inset: 0, opacity: fr, background: "radial-gradient(circle at 0 100%, rgba(255,255,255,.95) 0 40%, rgba(255,255,255,.6) 60%, rgba(255,255,255,0) 80%), radial-gradient(circle at 100% 0, rgba(255,255,255,.9) 0 30%, rgba(255,255,255,0) 60%), repeating-linear-gradient(60deg, rgba(255,255,255,.45) 0 2px, rgba(255,255,255,0) 2px 16px), repeating-linear-gradient(-60deg, rgba(255,255,255,.45) 0 2px, rgba(255,255,255,0) 2px 16px)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center" }}><Tx size={44} col={cold[i] === 1 && fr > 0.5 ? BLUE : "#fff"}>{mo}</Tx></div>
        </div>; })}
    </div>
    <Ch t="the worst months are the cold ones" at={t1} f={f} x={960} y={850} size={74} c col={INK} />
    <Src text="CDC" f={f} at={4} />
  </AbsoluteFill>;
};

// nosense · TRES FRASCOS DE MUESTRA VACÍOS: COLOR / SMELL / TASTE; salta la tapa y cae el sello «NONE»
const NoSense: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t = [D(m, 0, dur, 0.15), D(m, 1, dur, 0.45), D(m, 2, dur, 0.72)];
  return <Floor>
    <Ch t="carbon monoxide has…" at={0} f={f} x={960} y={70} size={74} c />
    {["COLOR", "SMELL", "TASTE"].map((s, i) => { const x = 230 + i * 540, lid = sp(f, t[i]), st = k(f, t[i] + 6, 6);
      return <div key={s} style={ab(x, 260, 380, 620)}>
        <div style={{ position: "absolute", left: 40, right: 40, top: 200 + (1 - lid) * 40, height: 210, opacity: cl(lid * 2), background: "#f7f2e4", borderRadius: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Tx size={30} col="#6b5d44">NO</Tx><Tx size={52}>{s}</Tx></div>
        <div style={{ position: "absolute", left: 60, right: 60, top: 450, height: 110, background: "rgba(255,255,255,.92)", border: `8px solid ${RED}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(-10deg) scale(${1 + 0.6 * (1 - st)})`, opacity: st }}><Tx size={64} col={RED}>NONE</Tx></div>
      </div>; })}
  </Floor>;
};

// blood · LAS SILLAS DE LOS GLÓBULOS: discos rojos que llevan O₂ en cuatro asientos; el CO los empuja y se sienta; abajo se vacía «JUDGMENT»
const Blood: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.12), t1 = D(m, 1, dur, 0.4), t2 = D(m, 2, dur, 0.75);
  return <AbsoluteFill style={{ background: "#3b1418" }}>
    <div style={ab(0, 300, 1920, 420, { background: "linear-gradient(#7a2228,#9c2e33 50%,#7a2228)", boxShadow: "inset 0 18px 0 rgba(0,0,0,.25), inset 0 -18px 0 rgba(0,0,0,.25)" })} />
    {Array.from({ length: 6 }, (_, i) => { const x = ((i * 360 + f * 4) % 2160) - 200; const swap = cl((f - t1 - i * 3) / 12);
      return <div key={i} style={ab(x, 380 + (i % 2) * 70, 200, 200)}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle, #a8262d 0 30%, #d8434a 46%, #b9313a 70%)", boxShadow: "0 8px 0 rgba(0,0,0,.25)" }} />
        {[0, 1, 2, 3].map((s) => { const ang = s * 90 + 45, rx = 100 + Math.cos(ang * Math.PI / 180) * 70 - 22, ry = 100 + Math.sin(ang * Math.PI / 180) * 70 - 22; const gone = s < 3 ? swap : 0;
          return <React.Fragment key={s}>
            <div style={ab(rx, ry - gone * 260, 60, 60, { borderRadius: "50%", background: "#5fb3e8", opacity: 1 - gone, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 24, color: "#fff" })}>O₂</div>
            {s < 3 && <div style={ab(rx + (1 - swap) * 160, ry - (1 - swap) * 120, 60, 60, { borderRadius: "50%", background: "#8b9096", opacity: swap, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 24, color: "#fff" })}>CO</div>}
          </React.Fragment>; })}
      </div>; })}
    <Ch t="it gets into your blood" at={t0} f={f} x={80} y={90} size={74} />
    <Ch t="…and takes the oxygen's place" at={t1} f={f} x={80} y={180} size={64} col="#ffd0c8" />
    <div style={ab(560, 800, 800, 180, { opacity: k(f, t2 - 6, 10) })}>
      <Tx size={44} col={CH} style={{ textAlign: "center" }}>FIRST THING IT TAKES:</Tx>
      <div style={{ marginTop: 16, height: 80, border: `6px solid ${CH}`, borderRadius: 10, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${100 - 82 * io((f - t2) / 30)}%`, background: YEL }} />
        <Tx size={50} col="#f3f0e6" style={{ textShadow: "0 2px 6px rgba(0,0,0,.6)", position: "absolute", left: 0, right: 0, top: 10, textAlign: "center" }}>YOUR JUDGMENT</Tx>
      </div>
    </div>
  </AbsoluteFill>;
};

// ================= MEJORA 1 + 10 · EL TAMBOR DE CHAPAS ESMALTADAS (carrusel propio) =================
// Diez chapas esmaltadas en un tambor que gira sobre el eje horizontal (como el rodillo de una máquina): en cada error el tambor rueda hasta la chapa N (roja);
// en el repaso es el MISMO tambor en orden, las chapas pasan a verde con su regla y las ya repasadas quedan con tilde.
const MIS = ["THE GENERATOR IN THE GARAGE", "THE CAR IN THE GARAGE", "THE GENERATOR UNDER THE WINDOW", "THE GRILL OR CAMP STOVE INSIDE", "HEATING WITH THE GAS OVEN",
  "VENTS BURIED IN SNOW", "FUEL HEATER IN THE WRONG ROOM", "DAMPER CLOSED TOO EARLY", "DETECTOR DIES WITH THE POWER", "A DETECTOR THAT'S TOO OLD"];
const MISL = ["The generator in the garage with the door open.", "The car in the garage.", "The generator under the window.", "The grill or the camp stove inside.", "Heating the house with the gas oven.",
  "The vents buried in snow.", "The heater that burns fuel, in the wrong room.", "Closing the fireplace damper too early.", "The detector that dies with the power.", "Trusting a detector that's too old."];
const REC = ["NO GENERATOR IN THE GARAGE", "NO CAR IN THE GARAGE", "NOT UNDER A WINDOW", "GRILLS STAY OUTSIDE", "THE OVEN IS FOR COOKING", "CLEAR EVERY VENT", "LABELED HEATERS ONLY", "DAMPER OPEN TILL IT'S COLD", "WORKS WITHOUT WALL POWER", "CHECK THE DATE"];
const RECL = ["never a generator in the garage, even with the door open", "never the car in the garage, even with a hose through the wall", "not under a window, not next to a door, not on the porch",
  "grills, camp stoves and charcoal stay outside", "the gas oven is for cooking, not for heat", "clear the snow off every vent and pipe", "labeled heaters only, with fresh air and a detector, never while you sleep",
  "the damper stays open until the fire is out cold", "every detector works without wall power", "check the date on the back"];
// plancha de cada error = la foto real de ESE error; en el repaso, la foto de la manera segura
const MPH = ["g0410", "g0910", "g1040", "g1240", "g1430", "g1600", "g1770", "g1880", "g2000", "g2380"];
const RPH = ["g3640", "g0941", "g0531", "g1380", "g1500", "g1680", "g1801", "g1930", "g1980", "g3270"];
const Reel: React.FC<P & { recap?: boolean }> = ({ dur, m, a, recap }) => {
  const f = useCurrentFrame(); const n = Math.max(1, Math.min(10, +a[0] || 1)); const H = 200, R = H / (2 * Math.tan(Math.PI / 10));
  const from = recap ? n - 2 : n - 1 - 10; const land = recap ? 22 : 30; const p = io(f / land);
  const ang = lerp(from, n - 1, p) * 36 + (p < 1 ? 0 : Math.sin((f - land) / 5) * 1.2 * Math.exp(-(f - land) / 12));
  const lt = D(m, 0, dur, 0.1); const c1 = recap ? GRN : RED, c2 = recap ? "#1f6f3e" : "#8f241a";
  return <Floor dark={0.25} ph={(recap ? RPH : MPH)[n - 1]}>
    <div style={ab(330, 215, 1260, 520, { perspective: 1700 })}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 160, height: H, transformStyle: "preserve-3d", transform: `rotateX(${ang}deg)` }}>
        {Array.from({ length: 10 }, (_, i) => { const done = recap && i < n - 1; const cur = i === n - 1;
          // las chapas que se van de eje se apagan del todo (nada de filas espejadas ilegibles arriba/abajo)
          const rel = ((((ang - i * 36) % 360) + 540) % 360) - 180; const vis = cl(1 - (Math.abs(rel) - 30) / 14);
          return <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 0, height: H, opacity: vis, transform: `rotateX(${-i * 36}deg) translateZ(${R}px)`, backfaceVisibility: "hidden",
            background: `linear-gradient(${cur ? c1 : "#26364a"}, ${cur ? c2 : "#1b2838"})`, border: "10px solid #f2efe6", borderRadius: 18, boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 40px", gap: 36 }}>
            <div style={{ width: 130, height: 130, borderRadius: "50%", background: "#f2efe6", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Tx size={84} col={cur ? c2 : "#26364a"} style={{ fontFamily: SERIF }}>{i + 1}</Tx></div>
            <Tx size={Math.min(i === n - 1 ? 62 : 54, Math.floor((done ? 900 : 1000) / ((recap ? REC[i] : MIS[i]).length * 0.7)))} col="#f2efe6" style={{ flex: 1, whiteSpace: "nowrap" }}>{recap ? REC[i] : MIS[i]}</Tx>
            {done && <Tx size={90} col="#7fe0a2">✓</Tx>}
          </div>; })}
      </div>
    </div>
    <Tx size={46} col={recap ? "#9be3b5" : "#ffb3a8"} style={{ position: "absolute", left: 0, right: 0, top: 34, textAlign: "center", letterSpacing: 8, opacity: k(f, 0, 10) }}>{recap ? `RECAP · ${n} OF 10` : `MISTAKE ${n} OF 10`}</Tx>
    <Ch t={recap ? RECL[n - 1] : MISL[n - 1]} at={Math.max(land - 4, lt)} f={f} x={960} y={850} size={Math.min(recap ? 66 : 76, Math.floor(1780 / ((recap ? RECL[n - 1] : MISL[n - 1]).length * 0.44)))} c len={18} />
  </Floor>;
};

// ================= MEJORA 7 · EL MAPA A LINTERNA (mapa propio para los recuerdos) =================
// Mapa de los condados de Wayne / Holmes / Ashland de noche; el haz de una linterna barre el papel y se frena en el pueblo,
// se clava un banderín naranja de agrimensor y sale la tira impresa del parte (fecha + lugar, todo del guion).
const TOWNS: Record<string, [number, number, string]> = { wooster: [1056, 324, "WOOSTER"], loudonville: [592, 691, "LOUDONVILLE"], shreve: [928, 583, "SHREVE"], mounteaton: [1440, 562, "MOUNT EATON"] };
const LOG: Record<string, [string, string]> = { wooster: ["FEBRUARY 2011", "A house outside of Wooster, the morning after"], loudonville: ["FALL 2009", "A deer camp near Loudonville"],
  shreve: ["JANUARY 2014", "A big drift · a family near Shreve"], mounteaton: ["DECEMBER 2018", "A farmhouse outside of Mount Eaton"] };
// el papel del mapa (hl = pueblo del recuerdo: su rótulo va aparte, DENTRO de la lupa / del recorte)
const MapPaper: React.FC<{ hl: string }> = ({ hl }) => (
  <AbsoluteFill style={{ background: "#e6dcc3" }}>
    <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(120,140,110,.18) 0 2px, rgba(0,0,0,0) 2px 90px), repeating-linear-gradient(90deg, rgba(120,140,110,.18) 0 2px, rgba(0,0,0,0) 2px 90px)" }} />
    <div style={ab(-50, 316, 2100, 14, { background: "#c46a3a", transform: "rotate(-1.5deg)" })} />
    <div style={ab(1040, -50, 12, 1200, { background: "#c46a3a", transform: "rotate(3deg)" })} />
    <div style={ab(200, 520, 1700, 10, { background: "#d19a52", transform: "rotate(-9deg)" })} />
    <div style={ab(400, 120, 10, 1000, { background: "#d19a52", transform: "rotate(-22deg)" })} />
    <div style={ab(752, -20, 0, 660, { borderLeft: "6px dashed rgba(90,80,60,.55)" })} />
    <div style={ab(0, 640, 1920, 0, { borderTop: "6px dashed rgba(90,80,60,.55)" })} />
    {[["WAYNE CO.", 1240, 150], ["ASHLAND CO.", 300, 120], ["HOLMES CO.", 1150, 860]].map(([s, x, y]) => <Tx key={s as string} size={40} col="rgba(90,80,60,.7)" style={{ position: "absolute", left: x as number, top: y as number, letterSpacing: 10 }}>{s}</Tx>)}
    <div style={ab(820, 760, 900, 120, { background: "rgba(120,160,190,.35)", borderRadius: "50%", transform: "rotate(-12deg)" })} />
    {Object.entries(TOWNS).map(([kk, [x, y, nm]]) => <React.Fragment key={kk}>
      <div style={ab(x - 12, y - 12, 24, 24, { borderRadius: "50%", background: kk === hl ? RED : INK, border: "4px solid #e6dcc3" })} />
      {kk !== hl && <Tx size={32} col={INK} style={{ position: "absolute", left: x + 24, top: y - 20, opacity: 0.75 }}>{nm}</Tx>}
    </React.Fragment>)}
  </AbsoluteFill>
);
// MAPA CON LUPA DE BORDE DURO (sin halo difuso): el papel entero se ve apagado parejo; la lupa de bronce muestra el pueblo aumentado con su nombre adentro.
// Cuatro movimientos distintos: wooster = la lupa entra deslizando de costado · loudonville = cae desde arriba · shreve = el pedazo de mapa se recorta y se levanta · mount eaton = la lupa se abre en el lugar
const FlashMap: React.FC<P> = ({ dur, m, a }) => {
  const f = useCurrentFrame(); const key = a[0] in TOWNS ? a[0] : "wooster"; const [tx, ty, name] = TOWNS[key]; const [date, line] = LOG[key];
  const mode = ["wooster", "loudonville", "shreve", "mounteaton"].indexOf(key); const p = io(f / 26); const R = 270;
  const lx = mode === 0 ? lerp(tx + 1100, tx, p) : tx, ly = mode === 1 ? lerp(-400, ty, p) : ty;
  const r = mode === 3 ? R * sp(f, 2) : R; const Z = 1.55;
  const chip = (x: number, y: number) => <div style={{ position: "absolute", left: x, top: y, transform: "translateX(-50%)", padding: "6px 18px", background: "#fbf8ef", border: `4px solid ${INK}`, borderRadius: 8, whiteSpace: "nowrap", opacity: k(f, 24, 8) }}><Tx size={42} col={INK}>{name}</Tx></div>;
  const flag = (x: number, y: number) => <div style={ab(x - 4, y - 130 + 50 * (1 - sp(f, 26)), 8, 130, { background: "#a98b5c", opacity: k(f, 26, 4) })}>
    <div style={{ position: "absolute", left: 8, top: 0, width: 80, height: 50, background: ORG, clipPath: "polygon(0 0, 100% 50%, 0 100%)" }} /></div>;
  const cw = 620, chh = 440; const cx = Math.max(40, Math.min(1920 - cw - 40, tx - cw / 2)), cy = Math.max(40, Math.min(1080 - chh - 40, ty - chh / 2)); const lift = sp(f, 4);
  const sx = tx > 1200 ? 120 : 1100, sy = 830;
  return <AbsoluteFill style={{ background: "#0b0f16", overflow: "hidden" }}>
    <MapPaper hl={key} />
    <AbsoluteFill style={{ background: "rgba(10,12,18,.6)" }} />
    {mode !== 2 ? <>
      <AbsoluteFill style={{ clipPath: `circle(${Math.max(0, r)}px at ${lx}px ${ly}px)` }}>
        <AbsoluteFill style={{ transform: `translate(${lx - tx}px, ${ly - ty}px) scale(${Z})`, transformOrigin: `${tx}px ${ty}px` }}><MapPaper hl={key} /></AbsoluteFill>
        {flag(lx, ly)}{chip(lx, ly + 50)}
      </AbsoluteFill>
      <div style={ab(lx - r - 16, ly - r - 16, 2 * r + 32, 2 * r + 32, { borderRadius: "50%", border: "16px solid #b08d4a", boxSizing: "border-box", boxShadow: "8px 12px 0 rgba(0,0,0,.45), inset 0 0 0 4px #6e5526", opacity: r > 4 ? 1 : 0 })} />
      <div style={ab(lx + r * 0.7 + 4, ly + r * 0.7 + 4, 46, 230, { background: "linear-gradient(90deg,#3b2a1a,#6b4a2c,#3b2a1a)", borderRadius: 18, transformOrigin: "50% 0", transform: "rotate(-45deg)", opacity: r > 4 ? 1 : 0 })} />
    </> : <div style={ab(cx, cy, cw, chh, { transform: `translateY(${-30 * lift}px) rotate(${-4 * lift}deg)`, background: "#f6f2e8", padding: 12, boxSizing: "border-box", boxShadow: `${14 * lift}px ${20 * lift}px 0 rgba(0,0,0,.5)` })}>
      <div style={{ position: "absolute", left: 12, top: 12, right: 12, bottom: 12, overflow: "hidden" }}>
        <div style={ab(-(cx + 12), -(cy + 12), 1920, 1080, { transform: `scale(${lerp(1, Z, lift)})`, transformOrigin: `${tx}px ${ty}px` })}><MapPaper hl={key} /></div>
        {flag(tx - cx - 12, ty - cy - 12)}{chip(tx - cx - 12, ty - cy + 40)}
      </div>
    </div>}
    <div style={ab(sx, sy, 720, 200, { background: "#fbfaf4", boxShadow: "6px 8px 0 rgba(0,0,0,.4)", clipPath: `inset(0 0 ${100 - 100 * k(f, 30, 12)}% 0)`, borderTop: "10px dotted #c9c1ad" })}>
      <Tx size={60} col={RED} style={{ fontFamily: SERIF, padding: "24px 30px 6px" }}>{date}</Tx>
      <div style={{ padding: "0 30px", fontFamily: SERIF, fontSize: 36, color: INK, fontStyle: "italic" }}>{line}</div>
    </div>
  </AbsoluteFill>;
};

// ================= MISTAKE 1 =================
// hundreds · EL ESTACIONAMIENTO QUE SE LLENA: un generador solo de un lado; del otro entran filas y filas de autos
const Hundreds: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.1), t1 = D(m, 1, dur, 0.55), t2 = D(m, 2, dur, 0.85); const rows = 12, cols = 18;
  return <Floor dark={0.2}>
    <Pic id="g2760" x={60} y={300} w={480} h={460} f={f} at={t0} rot={-3} kind="pol" cap="1 portable generator" tape />
    <div style={ab(560, 260, 30, 600, { display: "flex", alignItems: "center", justifyContent: "center", opacity: k(f, t1 - 10, 8) })}><Tx size={150} col={CH}>=</Tx></div>
    <div style={ab(680, 160, 1180, 760, { background: "#4e5257", borderRadius: 10, overflow: "hidden" })}>
      {Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => { const i = r * cols + c; const show = cl((f - t1 + 26 - i * 0.12) / 6);
        return <div key={i} style={ab(18 + c * 64, 16 + r * 62, 54, 26, { background: ["#c9cdd1", "#8fb0cf", "#d98b6c", "#e9d9a6"][(i * 7) % 4], borderRadius: "10px 14px 4px 4px", opacity: show, transform: `translateX(${(1 - show) * -40}px)` })} />; }))}
      {Array.from({ length: cols + 1 }, (_, c) => <div key={c} style={ab(10 + c * 64, 0, 3, 760, { background: "rgba(243,240,230,.35)" })} />)}
    </div>
    <Ch t="hundreds of cars." at={t2 > t1 + 20 ? t2 : t1 + 20} f={f} x={1270} y={60} size={90} c col={YEL} />
    <Src text="U.S. CONSUMER PRODUCT SAFETY COMMISSION" f={f} at={t0 + 6} />
  </Floor>;
};

// casa en corte: garaje a la izquierda, cocina a la derecha, ático arriba (actor para leaks / draft)
const HouseCut: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div style={ab(160, 140, 1600, 840)}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1600, height: 300, background: "#5a4a3c", clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />
    <div style={{ position: "absolute", left: 120, top: 170, width: 1360, height: 130, background: "#3c3129", clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />
    <div style={ab(0, 300, 640, 540, { background: "#9a9da1", border: "14px solid #4a3f36", boxSizing: "border-box" })}><Tx size={36} col="#3b3f44" style={{ position: "absolute", left: 30, top: 20 }}>GARAGE</Tx></div>
    <div style={ab(640, 300, 960, 540, { background: "#e8dcc4", border: "14px solid #4a3f36", borderLeft: "none", boxSizing: "border-box" })}><Tx size={36} col="#8a7a5c" style={{ position: "absolute", right: 30, top: 20 }}>KITCHEN</Tx></div>
    <div style={ab(612, 560, 46, 266, { background: "#7a5a3c", border: "4px solid #4a3f36" })} />
    {children}
  </div>
);
// leaks · LAS TRES RENDIJAS: el humo entra de a un camino por vez — la puerta, los huecos de caños y cables, el ático
const Leaks: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t = [D(m, 0, dur, 0.2), D(m, 1, dur, 0.45), D(m, 2, dur, 0.75)];
  const path = (pts: [number, number][], at: number, lbl: string, lx: number, ly: number) => { const p = io((f - at) / 22); const seg = pts.length - 1;
    return <>{pts.slice(0, -1).map(([x1, y1], i) => { const [x2, y2] = pts[i + 1]; const q = cl(p * seg - i); const len = Math.hypot(x2 - x1, y2 - y1), an = Math.atan2(y2 - y1, x2 - x1);
      return <div key={i} style={ab(x1, y1 - 6, len * q, 12, { transform: `rotate(${an}rad)`, transformOrigin: "0 50%", background: "repeating-linear-gradient(90deg, #9fa4aa 0 22px, rgba(0,0,0,0) 22px 34px)" })} />; })}
      <Ch t={lbl} at={at + 8} f={f} x={lx} y={ly} size={54} col={YEL} /></>; };
  return <Floor dark={0.45}>
    <HouseCut>
      <div style={ab(150, 560, 300, 210)}><Gen2 s={0.9} run={1} f={f} /></div>
      <Puffs f={f} x={430} y={610} at={0} dy={-160} size={50} />
      {path([[440, 640], [600, 690], [760, 700]], t[0], "the door", 700, 620)}
      {path([[400, 520], [560, 440], [640, 420], [820, 400]], t[1], "gaps around pipes & wires", 700, 330)}
      <div style={ab(560, 360, 120, 18, { background: "#b87333", opacity: k(f, t[1] - 6, 8) })} /><div style={ab(560, 410, 120, 10, { background: "#2a2a2a", opacity: k(f, t[1] - 6, 8) })} />
      {path([[320, 400], [500, 240], [800, 200], [1000, 260], [1100, 330]], t[2], "the attic", 760, 120)}
    </HouseCut>
  </Floor>;
};

// draft · LAS CINTITAS DE LOS MARCOS: tiras de cinta colgadas de cada abertura; cuando prende la caldera, sopla el viento o el aire sube la escalera, todas se tuercen hacia adentro
// draft:garage · las mismas cintitas: la del garaje se estira fuerte y se escribe «A LOT OF IT»
const Draft: React.FC<P> = ({ dur, m, a }) => {
  const f = useCurrentFrame(); const g = a[0] === "garage";
  const t = g ? [0, 0, 0, 0] : [D(m, 0, dur, 0.12), D(m, 1, dur, 0.38), D(m, 2, dur, 0.62), D(m, 3, dur, 0.85)];
  const pull = g ? 1 : 0.35 * k(f, t[0], 14) + 0.25 * k(f, t[1], 14) + 0.2 * k(f, t[2], 14) + 0.2 * k(f, t[3], 14);
  const ribbon = (x: number, y: number, dir: number, s: number, key: string) => { const w = Math.sin(f / 4 + x) * 6; const ang = dir * (8 + 70 * pull * s) + w;
    return <div key={key} style={ab(x, y, 22, 170, { background: `linear-gradient(${RED}, #ef6a52)`, transformOrigin: "50% 0", transform: `rotate(${ang}deg)`, borderRadius: "0 0 6px 6px", boxShadow: "3px 4px 0 rgba(0,0,0,.25)" })} />; };
  return <Floor dark={0.45}>
    <HouseCut>
      <div style={ab(1120, 600, 200, 200, { background: "#54595e", border: "6px solid #2b2f33", opacity: 1 })}><div style={{ margin: "120px auto 0", width: 90, height: 34, borderRadius: 8, background: `rgba(90,170,255,${0.4 + 0.6 * k(f, t[0], 8)})` }} /></div>
      <Tx size={28} col="#fff" style={{ position: "absolute", left: 1134, top: 614, whiteSpace: "nowrap" }}>FURNACE</Tx>
      {Array.from({ length: 6 }, (_, i) => <div key={i} style={ab(820 + i * 46, 780 - i * 70, 120, 16, { background: "#8a6a48" })} />)}
      {ribbon(632, 560, -1, g ? 1.25 : 1, "g")}
      {ribbon(1588, 600, 1, 0.8, "f")}
      {ribbon(960, 300, -1, 0.7, "s")}
      {/* sin barras de viento sueltas */}
      {!g && <div style={ab(850, 380, 16, 300 * k(f, t[2], 18), { background: "linear-gradient(rgba(255,170,90,.0), rgba(255,170,90,.8))", transform: "rotate(-34deg)", transformOrigin: "50% 100%" })} />}
    </HouseCut>
    {g ? <Ch t="a lot of it comes from the garage." at={4} f={f} x={960} y={50} size={80} c col={YEL} len={18} />
      : <>{["the furnace runs", "the wind blows", "warm air rises"].map((s, i) => <Ch key={s} t={s} at={t[i]} f={f} x={60 + i * 610} y={40} size={56} />)}
        <Ch t="…it pulls air from wherever it can" at={t[3]} f={f} x={960} y={110} size={54} c col={YEL} /></>}
  </Floor>;
};

// yard20 · LAS OCHO PISADAS HASTA LA ESTACA: patio nevado visto de arriba, las botas caminan, se clava la estaca, la soga marca 20 FT y el escape gira hacia afuera
const Yard20: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.12), t1 = D(m, 1, dur, 0.5), t2 = D(m, 2, dur, 0.72);
  const sx = 1430; const rot = lerp(180, 0, io((f - t1) / 16)); // la soga mide de la PARED a la cara del generador: eso son los 20 FT
  return <AbsoluteFill style={{ background: SNOW, overflow: "hidden" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(255,255,255,1), rgba(214,224,234,1) 80%)" }} />
    <div style={ab(0, 120, 420, 840, { background: "repeating-linear-gradient(90deg,#4f4740 0 40px,#3e3832 40px 44px)", boxShadow: "10px 0 0 rgba(0,0,0,.2)" })}><Tx size={40} col="#d8cfc0" style={{ position: "absolute", left: 120, top: 400, transform: "rotate(-90deg)" }}>THE HOUSE</Tx></div>
    {[[420, 250, "WINDOW"], [420, 520, "DOOR"], [420, 760, "VENT"]].map(([x, y, s], i) => <div key={s as string} style={ab((x as number) - 8, y as number, 16, 110, { background: i === 1 ? "#7a5a3c" : i === 0 ? "#9ec3e6" : "#f4f4f0" })}>
      <Tx size={30} col={INK} style={{ position: "absolute", left: 30, top: 34, whiteSpace: "nowrap", opacity: k(f, t2 + i * 5, 8) }}>{s as string} ✕</Tx></div>)}
    {Array.from({ length: 8 }, (_, i) => { const x = 470 + i * 128, sh = k(f, 4 + i * 3.5, 5);
      return <div key={i} style={ab(x, 520 + (i % 2 ? 40 : -40), 70, 34, { borderRadius: "50%", background: "#b9c7d4", opacity: sh, boxShadow: "inset 4px 4px 0 rgba(90,110,130,.35)" })} />; })}
    <div style={ab(420, 470, (sx - 420) * k(f, t0, 18), 8, { background: "repeating-linear-gradient(90deg,#c08a3e 0 18px,#8f6528 18px 22px)" })} />
    <Ch t="20 FT" at={t0 + 6} f={f} x={900} y={390} size={86} col={RED} />
    <div style={ab(sx - 10, 330, 20, 150 * sp(f, t0 + 10), { background: "#a87b45", opacity: k(f, t0 + 10, 4) })}><div style={ab(-62, 0, 60, 26, { background: ORG })} /></div>
    <Pic id="g0481" x={600} y={640} w={540} h={390} f={f} at={t0 + 8} rot={-2} kind="print" tape />
    <div style={ab(sx - 50, 364, 360, 260, { transform: `rotate(${rot}deg)`, transformOrigin: "50% 40%" })}>
      <div style={ab(60, 30, 240, 160, { background: "#2a2e33", borderRadius: 16 })}><div style={ab(30, 24, 120, 112, { background: ORG, borderRadius: 12 })} /></div>
      <div style={ab(300, 80, 50, 40, { background: "#a7aeb4", borderRadius: 10 })} />
      <div style={ab(350, 92, 160 * k(f, t1, 12), 16, { background: RED })}><div style={{ position: "absolute", right: -24, top: -14, width: 0, height: 0, borderLeft: `30px solid ${RED}`, borderTop: "22px solid transparent", borderBottom: "22px solid transparent" }} /></div>
    </div>
    <Ch t="exhaust pointed away" at={t1 + 4} f={f} x={1240} y={720} size={54} col={INK} />
    <Src text="U.S. CPSC" f={f} at={t0 + 4} />
  </AbsoluteFill>;
};

// chainprice · LA CADENA CONTRA LA CUENTA: la cadena de 12 ft crece eslabón por eslabón y queda con su candado; al lado la cuenta de una noche en la guardia se desenrolla y no termina
const ChainPrice: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.1), t1 = D(m, 1, dur, 0.35), t2 = D(m, 2, dur, 0.7); const nl = Math.round(12 * io((f - t0) / 20));
  return <Floor>
    <div style={ab(120, 300, 760, 120, { display: "flex", alignItems: "center" })}>
      {Array.from({ length: nl }, (_, i) => <div key={i} style={{ width: i % 2 ? 40 : 76, height: i % 2 ? 22 : 52, border: `${i % 2 ? 7 : 11}px solid #b9c0c6`, borderRadius: 30, marginLeft: i ? -14 : 0, boxShadow: "2px 4px 0 rgba(0,0,0,.3)", flex: "none" }} />)}
    </div>
    <div style={ab(150, 400, 160, 200, { opacity: k(f, t1, 8), transform: `translateY(${(1 - sp(f, t1)) * -60}px)` })}>
      <div style={ab(36, 0, 88, 90, { border: "16px solid #9aa2a8", borderBottom: "none", borderRadius: "50px 50px 0 0" })} />
      <div style={ab(0, 80, 160, 120, { background: "linear-gradient(#e0b545,#a77f1d)", borderRadius: 14 })} />
    </div>
    <Ch t="12-ft chain + a good padlock" at={t0 + 4} f={f} x={120} y={190} size={58} />
    <div style={ab(1180, 70, 560, 70, { background: "#cfd3d6", borderRadius: 35, opacity: k(f, t2 - 10, 6) })} />
    <div style={ab(1210, 105, 500, 960 * io((f - t2 + 6) / 34), { background: "#fbfbf6", overflow: "hidden", boxShadow: "6px 0 0 rgba(0,0,0,.2)" })}>
      <Tx size={40} style={{ padding: "26px 30px 10px" }}>EMERGENCY ROOM</Tx><Tx size={28} col="#6a6a6a" style={{ padding: "0 30px 20px" }}>ONE NIGHT</Tx>
      {Array.from({ length: 22 }, (_, i) => <div key={i} style={{ margin: "0 30px 18px", height: 14, background: "#d9d9d2", width: `${60 + ((i * 37) % 35)}%` }} />)}
    </div>
    <div style={ab(900, 330, 200, 200, { display: "flex", alignItems: "center", justifyContent: "center", opacity: k(f, t2, 8), transform: `scale(${0.6 + 0.4 * sp(f, t2)})` })}><Tx size={220} col={YEL} style={{ fontFamily: SERIF }}>&lt;</Tx></div>
    <Ch t="costs less than" at={t2} f={f} x={1000} y={600} size={54} c col={YEL} />
  </Floor>;
};

// tarp · LA CARPA QUE DEVUELVE EL CALOR: lona azul atada sobre el generador; las ondas de calor y escape suben, rebotan en la lona y el adentro se pone rojo
const Tarp: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.15), t1 = D(m, 1, dur, 0.45); const heat = k(f, t1, 30);
  return <Floor>
    <Pic id="g0560" x={880} y={200} w={760} h={680} f={f} at={0} rot={2} kind="print" tape />
    <div style={ab(1730, 260, 70, 520, { background: "#fff", borderRadius: 35, border: "6px solid #9aa", boxShadow: "6px 8px 0 rgba(0,0,0,.3)" })}><div style={{ position: "absolute", left: 14, right: 14, bottom: 14, height: `${20 + 70 * heat}%`, background: RED, borderRadius: 20 }} /></div>
    <Tx size={30} col={CH} style={{ position: "absolute", left: 1700, top: 800, width: 130, textAlign: "center" }}>HEAT</Tx>
    <Ch t="a tarp tied down tight" at={2} f={f} x={90} y={300} size={62} />
    <Ch t="traps the exhaust and the heat" at={t0} f={f} x={90} y={420} size={58} col="#ff9a8a" />
    <Ch t="right around the engine" at={t1} f={f} x={90} y={540} size={62} />
  </Floor>;
};

// shutoff · LA CAJA CON EL ESCUDO Y EL APAGADO SOLO: la caja del generador con el sello «CO SHUT-OFF»; el gris sube alrededor, toca la línea del sensor y la llave pasa a OFF
const Shutoff: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.25), t1 = D(m, 1, dur, 0.75); const lvl = io((f - t0) / Math.max(20, t1 - t0)); const off = k(f, t1, 6);
  return <Floor>
    <Pic id="g0720" x={110} y={150} w={720} h={620} f={f} at={0} rot={-2} kind="print" tape />
    <div style={ab(330, 800, 270, 200, { background: GRN, clipPath: "polygon(50% 0, 100% 18%, 92% 70%, 50% 100%, 8% 70%, 0 18%)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.4 + 0.6 * sp(f, t0)})`, opacity: k(f, t0, 4) })}>
      <Tx size={40} col="#fff" style={{ textAlign: "center" }}>CO<br />SHUT-OFF</Tx></div>
    <div style={ab(940, 260, 860, 660, { background: "#d7dde2", borderRadius: 12, overflow: "hidden" })}>
      <div style={ab(220, 330, 390, 280, {})}><Gen2 s={1.3} run={1 - off} f={f} /></div>
      <Puffs f={f} x={624} y={424} at={0} stop={t1} dy={-110} dx={90} size={70} life={50} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${70 * lvl}%`, background: "rgba(110,116,124,.55)" }} />
      <div style={ab(0, 660 - 0.7 * 660 + 0 - 2, 860, 6, { background: "repeating-linear-gradient(90deg,#d6402f 0 24px, rgba(0,0,0,0) 24px 36px)" })} />
      <Tx size={30} col={RED} style={{ position: "absolute", right: 20, top: 150 }}>SENSOR TRIPS</Tx>
      <div style={ab(40, 40, 200, 90, { background: off > 0.5 ? RED : GRN, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" })}><Tx size={56} col="#fff">{off > 0.5 ? "OFF" : "ON"}</Tx></div>
    </div>
    <Ch t="it shuts itself off" at={t1} f={f} x={1370} y={120} size={70} c col={YEL} />
  </Floor>;
};

// ================= MISTAKE 2 =================
// hosewall · LA MANGUERA DIBUJADA CON TIZA: el portón baja, la tiza tira la manguera desde el caño de escape y el taladro abre el agujero en la pared
const HoseWall: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.2), t1 = D(m, 1, dur, 0.45), t2 = D(m, 2, dur, 0.72); const door = io((f - t0) / 18);
  const pts: [number, number][] = [[350, 790], [300, 860], [700, 900], [1100, 880], [1360, 640]]; const hp = io((f - t1) / 30);
  return <Floor dark={0.15}>
    <div style={ab(160, 220, 1240, 740, { border: "16px solid #4a3f36", borderBottom: "none", boxSizing: "border-box" })} />
    <div style={ab(176, 236, 30, 720 * door, { background: "repeating-linear-gradient(0deg,#c9c3b6 0 70px,#a9a396 70px 74px)" })} />
    <Tx size={30} col={CH} style={{ position: "absolute", left: 220, top: 250, opacity: k(f, t0 + 10, 8) }}>DOOR CLOSED</Tx>
    <div style={ab(360, 600, 880, 340, {})}><Car s={1.9} /></div>
    {pts.slice(0, -1).map(([x1, y1], i) => { const [x2, y2] = pts[i + 1]; const q = cl(hp * 4 - i); const len = Math.hypot(x2 - x1, y2 - y1), an = Math.atan2(y2 - y1, x2 - x1);
      return <div key={i} style={ab(x1, y1 - 9, len * q, 18, { transform: `rotate(${an}rad)`, transformOrigin: "0 50%", background: "#1f1f1f", borderRadius: 9, border: "3px solid #f3f0e6" })} />; })}
    <div style={ab(1376, 610, 60, 60, { borderRadius: "50%", background: "#1a1a1a", border: "4px solid #f3f0e6", transform: `scale(${k(f, t2, 8)})` })} />
    <Pic id="g0880" x={1460} y={360} w={420} h={380} f={f} at={t2} rot={3} kind="print" tape />
    <Ch t="a hose out through a hole in the wall" at={t1} f={f} x={160} y={80} size={66} />
    <Ch t="safe?" at={t2 + 12} f={f} x={1560} y={790} size={110} col={YEL} />
  </Floor>;
};

// hoseleak · LA PRUEBA DEL AGUA CON JABÓN: primer plano de la abrazadera; crecen burbujas en la unión
const HoseLeak: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.1), t1 = D(m, 1, dur, 0.6);
  return <Floor>
    <Pic id="g0860" x={760} y={150} w={1040} h={780} f={f} at={0} rot={1.5} kind="torn" />
    <Ch t="never sealed." at={t0} f={f} x={100} y={300} size={96} />
    <Ch t="the clamp leaks." at={t1} f={f} x={100} y={560} size={96} col={YEL} />
  </Floor>;
};
// sealedbox · LA CAJA DE CARTÓN QUE SE CIERRA: las solapas se pliegan sobre un motorcito y por la ventana del corte sube el gris
const SealedBox: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.2), t1 = D(m, 1, dur, 0.65); const cls = io((f - t0) / 14);
  return <Floor>
    <div style={ab(560, 260, 800, 640, { perspective: 1500 })}>
      <div style={ab(0, 100, 800, 540, { background: "linear-gradient(#c49a62,#a77f48)", boxShadow: "10px 12px 0 rgba(0,0,0,.3)" })}>
        <div style={ab(200, 140, 400, 300, { background: "#5c4630", overflow: "hidden", border: "6px dashed #f3f0e6" })}>
          <div style={ab(60, 60, 290, 210, {})}><Gen2 s={0.95} run={1} f={f} /></div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${100 * io((f - t1) / 30)}%`, background: "rgba(140,144,150,.8)" }} />
        </div>
      </div>
      <div style={ab(0, 0, 400, 100, { background: "#b98f58", transformOrigin: "50% 100%", transform: `rotateX(${-160 * (1 - cls) + 0}deg)`, top: 0 })} />
      <div style={ab(400, 0, 400, 100, { background: "#b0864f", transformOrigin: "50% 100%", transform: `rotateX(${-200 * (1 - cls)}deg)` })} />
    </div>
    <Ch t="a sealed box" at={t0} f={f} x={960} y={90} size={92} c />
    <Ch t="with an engine in it." at={t1} f={f} x={960} y={190} size={74} c col={YEL} />
  </Floor>;
};

// ================= MISTAKE 3 =================
// climb · LADRILLOS QUE SE CALIENTAN: bocanadas que trepan pegadas a la pared de ladrillo
const Climb: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg,#8c4a36 0 56px,#d8cbb8 56px 62px)" }}>
    <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0) 0 120px, #d8cbb8 120px 126px)", backgroundSize: "126px 124px", opacity: 0.9, maskImage: "repeating-linear-gradient(0deg, #000 0 62px, transparent 62px 124px)" } as CS} />
    <Win x={1180} y={130} w={300} h={340} open={0.35} /><div style={ab(760, 960, 300, 120, { background: "#3a3f45", borderRadius: "20px 20px 0 0" })} /><div style={ab(870, 930, 80, 40, { background: "#222", borderRadius: 8, boxShadow: `0 0 ${30 + 10 * Math.sin(f / 4)}px rgba(255,120,40,.8)` })} /><Puffs f={f} x={900} y={930} at={0} dy={-720} size={150} n={10} life={34} col="150,150,155" curve={420} />
    <Pic id="g0630" x={140} y={380} w={600} h={440} f={f} at={6} rot={-3} kind="print" tape />
    <Ch t="exhaust is hot — and it climbs." at={2} f={f} x={140} y={120} size={92} len={10} />
  </AbsoluteFill>;
};

// window10 · LA RENDIJA DE LA VENTANA: el generador a 10 pies, la hoja se levanta una rendija y el humo trepa y entra; el cuarto se pone gris
const Window10: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.12), t1 = D(m, 1, dur, 0.4), t2 = D(m, 2, dur, 0.75); const op = k(f, t1, 14);
  return <AbsoluteFill style={{ background: "linear-gradient(#bfcad6,#e6edf3)" }}>
    <div style={ab(0, 900, 1920, 180, { background: SNOW })} />
    <Siding x={1180} y={60} w={740} h={840} />
    <div style={ab(1240, 240, 620, 480, { background: "#cfc6b4", opacity: 0.0 })} />
    <div style={ab(1300, 300, 240, 300, { background: `rgba(120,125,132,${0.85 * k(f, t2, 30)})` })} />
    <Win x={1300} y={300} w={240} h={300} open={op} />
    <Pic id="g1040" x={90} y={330} w={640} h={460} f={f} at={t0} rot={-3} kind="print" tape />
    <Puffs f={f} x={700} y={720} at={0} dy={-430} dx={640} curve={40} size={70} n={9} life={50} />
    <div style={ab(660, 940, 640 * k(f, t0, 14), 8, { background: RED })} />
    <Ch t="10 FT" at={t0 + 4} f={f} x={900} y={960} size={70} col={RED} />
    <Ch t="a window cracked open" at={t1} f={f} x={80} y={90} size={66} col={INK} />
    <Ch t="straight into the house" at={t2} f={f} x={80} y={190} size={74} col={RED} />
  </AbsoluteFill>;
};

// neighbor · LOS DOS PIOLINES: dos techos a 20 pies; del generador del vecino salen dos hilos — a tu ventana y a la suya — y se ve cuál es más corto
const Neighbor: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.1), t1 = D(m, 1, dur, 0.45), t2 = D(m, 2, dur, 0.78);
  // el vecino dejó SU generador a 20 FT de SU casa (la cota va del generador a su pared) … y quedó pegado a tu ventana
  const g: [number, number] = [760, 640]; const yours: [number, number] = [606, 470], his: [number, number] = [1300, 780];
  const str = (to: [number, number], at: number, col: string, lbl: string, lx: number, ly: number) => { const len = Math.hypot(to[0] - g[0], to[1] - g[1]), an = Math.atan2(to[1] - g[1], to[0] - g[0]); const q = k(f, at, 16);
    return <><div style={ab(g[0], g[1] - 4, len * q, 8, { background: col, transform: `rotate(${an}rad)`, transformOrigin: "0 50%", borderRadius: 4 })} />
      <Tx size={34} col={col} style={{ position: "absolute", left: lx, top: ly, opacity: q, background: "rgba(255,255,255,.92)", padding: "4px 12px", whiteSpace: "nowrap" }}>{lbl}</Tx></>; };
  return <AbsoluteFill style={{ background: "linear-gradient(#c3ced9,#e6edf3)" }}>
    <div style={ab(0, 900, 1920, 180, { background: SNOW })} />
    <div style={ab(100, 240, 520, 660, { background: "repeating-linear-gradient(90deg,#5a4f45 0 40px,#4a4139 40px 44px)" })}><Tx size={40} col="#efe6d6" style={{ position: "absolute", left: 40, top: 40 }}>YOUR HOUSE</Tx></div>
    <div style={ab(1300, 240, 520, 660, { background: "repeating-linear-gradient(90deg,#6b5a4a 0 40px,#5a4b3d 40px 44px)" })}><Tx size={40} col="#efe6d6" style={{ position: "absolute", right: 40, top: 40 }}>NEIGHBOR</Tx></div>
    <div style={ab(592, 410, 28, 120, { background: "#9ec3e6", border: "4px solid #f4f4f0" })} />
    <div style={ab(1300, 720, 28, 120, { background: "#9ec3e6", border: "4px solid #f4f4f0" })} />
    <div style={ab(820, 700, 480 * k(f, t0, 12), 8, { background: INK })} />
    <div style={ab(816, 680, 8, 48, { background: INK, opacity: k(f, t0, 6) })} /><div style={ab(1296, 680, 8, 48, { background: INK, opacity: k(f, t0, 12) })} />
    <Ch t="20 FT" at={t0 + 4} f={f} x={1000} y={720} size={60} col={INK} />
    <div style={ab(g[0] - 60, g[1] - 45, 120, 90, { background: "#2a2e33", borderRadius: 12 })}><div style={ab(16, 14, 60, 60, { background: ORG, borderRadius: 8 })} /></div>
    {str(yours, t1, RED, "YOUR BEDROOM", 330, 560)}
    {str(his, t2, BLUE, "HIS OWN", 960, 810)}
    <Ch t="closer to your window than his own" at={t2 + 6} f={f} x={960} y={70} size={64} c col={INK} />
    <Pic id="g1110" x={690} y={160} w={540} h={380} f={f} at={t0 + 6} rot={-2} kind="print" tape />
  </AbsoluteFill>;
};
// sidecheck · EL BARRIDO DE LA PARED: una línea de escaneo recorre el costado de la casa y etiqueta ventana, puerta y ventilación
const SideCheck: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const sx = lerp(80, 1840, io((f - 6) / Math.max(30, dur * 0.7)));
  const items: [number, string][] = [[380, "WINDOW?"], [900, "DOOR?"], [1450, "VENT?"]];
  return <AbsoluteFill style={{ background: "linear-gradient(#c9d4de,#eaf0f4)" }}>
    <Siding x={60} y={180} w={1800} h={720} />
    <Pic id="g1090" x={1150} y={300} w={640} h={480} f={f} at={4} rot={2} kind="print" tape />
    <div style={ab(0, 900, 1920, 180, { background: SNOW })} />
    <div style={ab(sx - 6, 140, 12, 800, { background: YEL, boxShadow: "0 0 0 6px rgba(242,194,48,.35)" })} />
    {items.map(([x, s], i) => { const at = 6 + (x - 80) / 1760 * Math.max(30, dur * 0.7); const q = k(f, at, 6); return <React.Fragment key={s}>
      <Pic id={["g0591", "g1060", "g1620"][i]} x={x - 70} y={300} w={380} h={330} f={f} at={at} rot={[-3, 2, -2][i]} kind="print" tape />
      <div style={ab(x - 20, 180, 260, 70, { background: YEL, opacity: q, transform: `translateY(${(1 - q) * -20}px)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "4px 6px 0 rgba(0,0,0,.25)" })}><Tx size={40}>{s}</Tx></div></React.Fragment>; })}
    <Ch t="20 feet — and look at that side of the house" at={4} f={f} x={960} y={50} size={60} c col={INK} />
  </AbsoluteFill>;
};

// cord · LOS CORTES DEL CABLE: tres cables cortados de frente — el cobre engorda al bajar el calibre; el de 10 queda marcado; cartón de precio colgado
const Cord: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.12), t1 = D(m, 1, dur, 0.6);
  const G: [string, number][] = [["14", 22], ["12", 28], ["10", 36]];
  return <Floor>
    {G.map(([g, r], i) => { const x = 220 + i * 420, e = k(f, 2 + i * 5, 10), sel = g === "10" ? k(f, t0, 8) : 0;
      return <div key={g} style={ab(x, 240, 340, 480, { opacity: e, transform: `scale(${0.8 + 0.2 * e + 0.08 * sel})` })}>
        <div style={ab(20, 0, 300, 300, { borderRadius: "50%", background: "#d7a21c", boxShadow: `0 10px 0 rgba(0,0,0,.3)${sel ? `, 0 0 0 14px ${RED}` : ""}` })}>
          {[[150, 95], [95, 190], [205, 190]].map(([cx, cy], j) => <div key={j} style={ab(cx - r * 1.7, cy - r * 1.7, r * 3.4, r * 3.4, { borderRadius: "50%", background: ["#222", "#f4f4f0", GRN][j], display: "flex", alignItems: "center", justifyContent: "center" })}>
            <div style={{ width: r * 2, height: r * 2, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #f6b07a, #b8652c)" }} /></div>)}
        </div>
        <Tx size={54} col={sel ? YEL : CH} style={{ textAlign: "center", marginTop: 330, whiteSpace: "nowrap" }}>{g}-GAUGE</Tx>
      </div>; })}
    <Ch t="10-gauge or thicker" at={t0 + 4} f={f} x={980} y={80} size={76} c col={YEL} />
    <div style={ab(1450, 230, 400, 560, { transformOrigin: "50% 0", transform: `rotate(${Math.sin((f - t1) / 9) * 6 * Math.exp(-Math.max(0, f - t1) / 30)}deg)`, opacity: k(f, t1, 6) })}>
      <div style={ab(170, 0, 60, 60, { borderRadius: "50%", border: "10px solid #9aa2a8" })} />
      <div style={ab(0, 50, 400, 480, { background: "#fbf6e8", borderRadius: 14, boxShadow: "6px 8px 0 rgba(0,0,0,.3)", padding: 30, boxSizing: "border-box" })}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#7f8387", margin: "0 auto 20px" }} />
        <Tx size={30}>HEAVY GENERATOR CORD</Tx>
        <Tx size={78} col={RED} style={{ fontFamily: SERIF, marginTop: 20, whiteSpace: "nowrap" }}>$50–150</Tx>
        <Tx size={26} col="#6a5a40" style={{ marginTop: 20 }}>WHERE GARY SHOPS</Tx>
      </div>
    </div>
  </Floor>;
};

// ================= MISTAKE 4 =================
// coals · LA LLAMA SE APAGA, LA AGUJA SIGUE: briquetas encendidas; las llamas bajan a cero y las brasas se ponen grises, pero el medidor de CO de al lado sigue subiendo
const Coals: React.FC<P> = ({ dur, m, a }) => {
  const f = useCurrentFrame(); const short = a[0] === "bag" || dur < 90;
  const t0 = D(m, 0, dur, 0.15), t1 = D(m, 1, dur, 0.55), t2 = D(m, 2, dur, 0.88);
  const flame = short ? 1 : 1 - io((f - t0) / 30); const gray = short ? 0 : io((f - t1) / 24); const meter = short ? 0.45 + 0.1 * k(f, 0, 30) : 0.35 + 0.6 * io(f / Math.max(30, t2));
  return <AbsoluteFill style={{ background: "#1b1714" }}>
    <div style={ab(360, 520, 900, 380, { borderRadius: "0 0 450px 450px", background: "linear-gradient(#3a3a3a,#1d1d1d)" })} />
    {Array.from({ length: 26 }, (_, i) => { const x = 440 + (i % 9) * 82 + (Math.floor(i / 9) % 2) * 40, y = 520 - Math.floor(i / 9) * 46 + ((i * 13) % 12);
      const glow = (0.6 + 0.4 * Math.sin(f / 7 + i)) * (1 - gray * 0.85);
      return <div key={i} style={ab(x, y, 90, 70, { borderRadius: 22, background: `radial-gradient(circle at 50% 60%, rgba(255,${Math.round(120 + 60 * glow)},40,${glow}), rgba(80,60,50,1) 75%)`, boxShadow: `inset 0 0 0 4px rgba(${Math.round(lerp(60, 170, gray))},${Math.round(lerp(50, 170, gray))},${Math.round(lerp(45, 165, gray))},1)` })} />; })}
    {Array.from({ length: 6 }, (_, i) => { const h = (160 + 60 * Math.sin(f / 4 + i * 2)) * flame;
      return <div key={i} style={ab(480 + i * 120, 470 - h, 90, h, { background: "linear-gradient(#ffd25a, #ff7a1a 60%, rgba(255,90,20,0))", clipPath: "polygon(50% 0, 100% 100%, 0 100%)", opacity: flame })} />; })}
    <div style={ab(1440, 160, 150, 760, { background: "#e9ecee", borderRadius: 75, border: "8px solid #9aa2a8" })}>
      <div style={{ position: "absolute", left: 24, right: 24, bottom: 24, height: `${88 * meter}%`, borderRadius: 50, background: `linear-gradient(${RED}, #f08a5d)` }} />
      <Tx size={44} col={INK} style={{ position: "absolute", left: 0, right: 0, top: -70, textAlign: "center", color: CH }}>CO</Tx>
    </div>
    {short ? <>
      <Pic id="g1250" x={260} y={250} w={1020} h={740} f={f} at={0} rot={-2} kind="pol" cap="charcoal" tape />
      <Ch t="charcoal is one of the worst." at={2} f={f} x={120} y={100} size={86} len={10} /></>
      : <><Ch t="long after the flames are gone" at={t0} f={f} x={100} y={70} size={70} />
        <Ch t="…just warm gray coals" at={t1} f={f} x={100} y={170} size={70} col="#c9c4bb" /></>}
  </AbsoluteFill>;
};

// ================= MISTAKE 5 =================
// oven · LA PUERTA DEL HORNO QUE BAJA: el horno a gas de frente, la puerta se abate hacia abajo, las agujas del reloj del horno dan horas; el repasador se mece cerca de la llama
const Oven: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t = [D(m, 0, dur, 0.08), D(m, 1, dur, 0.22), D(m, 2, dur, 0.5), D(m, 3, dur, 0.8)];
  const hrs = io((f - t[0]) / Math.max(30, dur * 0.7)) * 4;
  return <AbsoluteFill style={{ background: "#d8cbb2" }}>
    <Pic id="g1430" x={560} y={110} w={820} h={640} f={f} at={0} rot={-1.5} kind="print" tape />
    <div style={ab(1520, 90, 230, 230, { borderRadius: "50%", background: "#f4f1e6", border: "12px solid #8d949a", boxSizing: "border-box", boxShadow: "6px 8px 0 rgba(0,0,0,.25)" })}>
      {Array.from({ length: 12 }, (_, j) => <div key={j} style={ab(100, 6, 6, 18, { background: INK, transformOrigin: "3px 97px", transform: `rotate(${j * 30}deg)` })} />)}
      <div style={ab(99, 45, 8, 58, { background: INK, borderRadius: 4, transformOrigin: "4px 58px", transform: `rotate(${hrs * 30}deg)` })} />
      <div style={ab(100, 22, 6, 81, { background: RED, borderRadius: 3, transformOrigin: "3px 81px", transform: `rotate(${hrs * 360}deg)` })} />
    </div>
    <Pic id="g1481" x={1390} y={500} w={440} h={400} f={f} at={t[3]} rot={4} kind="pol" />
    <div style={ab(80, 120, 440, 700)}>
      <Ch t="for hours" at={t[0]} f={f} x={0} y={0} size={70} col={INK} />
      <Ch t="door open" at={t[1]} f={f} x={0} y={110} size={70} col={INK} />
      <Ch t="→ more CO" at={t[1] + 10} f={f} x={0} y={210} size={66} col={RED} />
      <Ch t="older ones" at={t[2]} f={f} x={0} y={330} size={58} col={INK} />
      <Ch t="needing a cleaning" at={t[2] + 8} f={f} x={0} y={410} size={50} col={INK} />
    </div>
    <Ch t="an open flame" at={t[3]} f={f} x={1400} y={400} size={70} col={RED} />
  </AbsoluteFill>;
};
// rooms · EL PLANO CON PUERTAS QUE SE CIERRAN: plano de tiza de la casa; las puertas de los cuartos giran a cerrado, caen tres frazadas apiladas y queda el anuncio del próximo video
const Rooms: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.08), t1 = D(m, 1, dur, 0.3), t2 = D(m, 2, dur, 0.7);
  const doors: [number, number, number][] = [[520, 470, 0], [880, 470, 1], [1240, 470, 2]];
  return <Floor>
    <div style={ab(220, 170, 1480, 700, { border: `10px solid ${CH}`, boxSizing: "border-box" })} />
    {[580, 940, 1300].map((x) => <div key={x} style={ab(x, 170, 10, 300, { background: CH })} />)}
    <div style={ab(220, 470, 1480, 10, { background: CH })} />
    {doors.map(([x, y, i]) => <React.Fragment key={i}>
      <div style={ab(x, y - 4, 120, 18, { background: "#7f8387" })} />
      <div style={ab(x, y, 120, 10, { background: YEL, transformOrigin: "0 50%", transform: `rotate(${-90 + 90 * io((f - t0 - i * 5) / 12)}deg)` })} />
    </React.Fragment>)}
    {["BEDROOM", "BEDROOM", "BATH"].map((s, i) => <Tx key={i} size={34} col={CH} style={{ position: "absolute", left: 250 + i * 360, top: 200 }}>{s}</Tx>)}
    <Tx size={40} col={CH} style={{ position: "absolute", left: 260, top: 520 }}>THE ONE ROOM YOU KEEP</Tx>
    {[0, 1, 2].map((i) => <div key={i} style={ab(330, 760 - i * 40 - (1 - sp(f, t1 + i * 5)) * 200, 420, 46, { background: ["#9c3b3b", "#3b6e9c", "#c9a23b"][i], borderRadius: 10, opacity: k(f, t1 + i * 5, 4), boxShadow: "3px 5px 0 rgba(0,0,0,.3)" })} />)}
    <Ch t="close off rooms" at={t0} f={f} x={220} y={60} size={64} />
    <Ch t="layer up" at={t1} f={f} x={820} y={680} size={64} />
    <div style={ab(1120, 560, 640, 330, { background: "#fbf8ef", transform: `rotate(-3deg) translateY(${(1 - k(f, t2, 12)) * 500}px)`, boxShadow: "6px 8px 0 rgba(0,0,0,.3)", padding: "26px 34px", boxSizing: "border-box" })}>
      <Tx size={30} col="#6a5a40">MY NEXT VIDEO</Tx><Tx size={50} col={INK} style={{ fontFamily: SERIF, marginTop: 14, lineHeight: 1.12 }}>12 WAYS TO KEEP THE HOUSE WARM</Tx></div>
  </Floor>;
};

// rank12 · EL ABANICO DE MUESTRAS DE PINTURA: doce tiras se abren desde un remache, de verde (más seguro) a rojo (más riesgoso)
const Rank12: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.2), t1 = D(m, 1, dur, 0.6); const op = io(f / 24);
  const col = (i: number) => `hsl(${Math.round(130 - i * 11)}, 62%, ${48 + (i % 2) * 4}%)`;
  return <Floor>
    <div style={ab(960, 960, 0, 0)}>
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={ab(-60, -760, 120, 760, { background: col(i), borderRadius: 14, border: "6px solid #fbf8ef", transformOrigin: "50% 100%", transform: `rotate(${(-77 + i * 14) * op}deg)`, boxShadow: "3px 4px 0 rgba(0,0,0,.25)" })}>
        <Tx size={50} col="#fff" style={{ textAlign: "center", marginTop: 20 }}>{i + 1}</Tx></div>)}
      <div style={ab(-34, -34, 68, 68, { borderRadius: "50%", background: "radial-gradient(#eee,#777)" })} />
    </div>
    <Ch t="safest" at={t0} f={f} x={60} y={900} size={92} col="#8ff0b0" />
    <Ch t="riskiest" at={t1} f={f} x={1560} y={900} size={92} col="#ff9a8a" />
  </Floor>;
};

// ================= MISTAKE 6 =================
// flue · EL CAÑO QUE CRECE HASTA EL TECHO: caldera y calefón en el sótano encienden su llama azul y el caño sube piso por piso hasta salir por arriba
const Flue: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.15), t1 = D(m, 1, dur, 0.6); const up = io((f - t1 + 10) / 26);
  return <AbsoluteFill style={{ background: "#c9d3dc" }}>
    <div style={ab(360, 120, 1200, 260, { background: "#5a4a3c", clipPath: "polygon(50% 0, 100% 100%, 0 100%)" })} />
    <div style={ab(420, 380, 1080, 640, { background: "#e8dcc4", border: "14px solid #4a3f36", boxSizing: "border-box" })} />
    <div style={ab(420, 700, 1080, 14, { background: "#4a3f36" })} />
    <div style={ab(420, 714, 1080, 306, { background: "#9a9da1" })} />
    {[[560, "FURNACE"], [1000, "WATER HEATER"]].map(([x, s], i) => <div key={i} style={ab(x as number, 780, 220, 220, { background: i ? "#e7e9ea" : "#5d6266", borderRadius: i ? 60 : 8 })}>
      <div style={{ position: "absolute", left: 70, bottom: 30, width: 80, height: 50, background: "linear-gradient(#9fd2ff,#2f6fe0)", clipPath: "polygon(50% 0, 100% 100%, 0 100%)", opacity: k(f, t0 + i * 6, 8), transform: `scaleY(${0.8 + 0.2 * Math.sin(f / 3)})`, transformOrigin: "50% 100%" }} />
      <Tx size={i ? 26 : 30} col={i ? INK : "#fff"} style={{ position: "absolute", left: 0, right: 0, top: 74, textAlign: "center", whiteSpace: "nowrap" }}>{s as string}</Tx></div>)}
    <div style={ab(640, 600 - 500 * up + 180, 50, 500 * up, { background: "linear-gradient(90deg,#8d949a,#dfe3e6,#8d949a)" })} />
    <div style={ab(690, 780, 400, 40, { background: "linear-gradient(#8d949a,#dfe3e6,#8d949a)", opacity: k(f, t1 - 10, 8) })} />
    <Puffs f={f} x={665} y={260} at={t1 + 16} dy={-220} size={70} />
    <Ch t="they burn gas" at={t0} f={f} x={80} y={420} size={66} col={INK} />
    <Ch t="the exhaust has to go out" at={t1} f={f} x={1180} y={180} size={64} col={INK} />
  </AbsoluteFill>;
};

// inout · LAS DOS BOCAS DE PVC: dos caños blancos de frente; uno chupa las cintitas hacia adentro, el otro escupe bocanadas
const InOut: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.1), t1 = D(m, 1, dur, 0.5);
  const mouth = (x: number) => <div style={ab(x, 330, 380, 380, { borderRadius: "50%", background: PVC, boxShadow: "0 12px 0 rgba(0,0,0,.25)" })}><div style={ab(50, 50, 280, 280, { borderRadius: "50%", background: "radial-gradient(circle, #111 0 40%, #3a3d40 70%, #c9cdd0 100%)" })} /></div>;
  return <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg,#d9d2c3 0 34px,#bdb5a5 34px 37px)" }}>
    {mouth(330)}{mouth(1210)}
    <Pic id="g1570" x={760} y={390} w={420} h={330} f={f} at={4} rot={-2} kind="pol" tape />
    {Array.from({ length: 6 }, (_, i) => { const ph = ((f - t0) / 22 + i / 6) % 1; if (f < t0) return null; const ang = i * 60; const r = 420 * (1 - ph);
      return <div key={i} style={ab(520 + Math.cos(ang * Math.PI / 180) * r - 40, 520 + Math.sin(ang * Math.PI / 180) * r - 8, 80, 16, { background: "#5fb3e8", borderRadius: 8, transform: `rotate(${ang}deg)`, opacity: ph < 0.9 ? 1 : 0 })} />; })}
    <Puffs f={f} x={1400} y={520} at={t1} dy={0} dx={0} size={260} n={6} life={36} col="140,144,150" />
    <Ch t="air in" at={t0} f={f} x={520} y={150} size={90} c col={BLUE} />
    <Ch t="exhaust out" at={t1} f={f} x={1400} y={150} size={90} c col={INK} />
  </AbsoluteFill>;
};

// ventmap · LOS BANDERINES EN LA NIEVE: costado de la casa con la nieve amontonada; al nombrar cada salida se barre su nieve y salta un banderín
const VentMap: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t = [D(m, 0, dur, 0.05), D(m, 1, dur, 0.28), D(m, 2, dur, 0.55), D(m, 3, dur, 0.78)];
  const V: [number, number, string, number][] = [[260, 760, "FURNACE", 0], [700, 700, "WATER HEATER", 1], [1140, 780, "DRYER", 2], [1580, 140, "FIREPLACE", 3]];
  return <AbsoluteFill style={{ background: "linear-gradient(#c3ced9,#e6edf3)" }}>
    <Siding x={100} y={240} w={1720} h={700} />
    <div style={ab(1520, 40, 200, 220, { background: "repeating-linear-gradient(0deg,#8c4a36 0 40px,#d8cbb8 40px 44px)" })} />
    <div style={ab(220, 740, 120, 60, {})}><div style={ab(0, 0, 50, 50, { borderRadius: "50%", background: PVC, border: "6px solid #bbb" })} /><div style={ab(70, 0, 50, 50, { borderRadius: "50%", background: PVC, border: "6px solid #bbb" })} /></div>
    <div style={ab(680, 680, 70, 70, { borderRadius: "50%", background: "#9aa2a8" })} />
    <div style={ab(1120, 760, 100, 70, { background: "#f4f4f0", borderRadius: 8 })} />
    {V.map(([x, y, s, i]) => { const c = k(f, t[i], 10); return <React.Fragment key={s}>
      {i < 3 && <div style={ab(x - 80, y + 60 - 220 * (1 - c), 300, 220 * (1 - c) + 30, { background: SNOW, borderRadius: "140px 140px 0 0" })} />}
      <div style={ab(x + 60, y - 150 * sp(f, t[i] + 4), 8, 150 * sp(f, t[i] + 4), { background: "#d9c8a0" })}><div style={ab(8, 0, 80, 50, { background: ORG, clipPath: "polygon(0 0, 100% 50%, 0 100%)" })} /></div>
      <Tx size={40} col={INK} style={{ position: "absolute", left: x - 10, top: i === 3 ? 270 : y - 220, opacity: k(f, t[i] + 6, 6), background: "rgba(255,255,255,.85)", padding: "4px 12px" }}>{s}</Tx>
    </React.Fragment>; })}
    <div style={ab(0, 900, 1920, 180, { background: SNOW })} />
  </AbsoluteFill>;
};

// ================= MISTAKE 7 =================
// label · EL TANQUE DE AIRE DEL CUARTO: el cuarto como pecera de burbujas de O₂ que baja; al tocar la línea del sensor, la llama del calefactor se apaga sola
const Label: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.1), t1 = D(m, 1, dur, 0.4), t2 = D(m, 2, dur, 0.75); const lvl = 1 - 0.62 * io((f - t0) / Math.max(20, t2 - t0)); const off = k(f, t2 + 4, 6);
  return <Floor>
    <div style={ab(200, 160, 1000, 760, { border: "10px solid rgba(235,242,246,.85)", borderTop: "none", borderRadius: "0 0 20px 20px" })}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lvl * 100}%`, background: "rgba(95,179,232,.28)", overflow: "hidden" }}>
        {Array.from({ length: 30 }, (_, i) => <div key={i} style={ab((i * 97) % 910 + 14, ((i * 61 + f * 2) % Math.max(60, lvl * 750 - 54)) + 4, 64, 64, { borderRadius: "50%", border: "3px solid rgba(220,240,255,.8)", fontFamily: SANS, fontWeight: 800, fontSize: 26, color: "#e8f6ff", display: "flex", alignItems: "center", justifyContent: "center" })}>O₂</div>)}
      </div>
      <div style={ab(-10, 760 * 0.62 - 4, 1020, 8, { background: "repeating-linear-gradient(90deg,#d6402f 0 24px, rgba(0,0,0,0) 24px 36px)", top: 760 - 760 * 0.38 })} />
      <Tx size={30} col={RED} style={{ position: "absolute", right: 16, top: 760 - 760 * 0.38 - 44 }}>OXYGEN SENSOR LINE</Tx>
      <div style={ab(380, 520, 240, 230, { background: "#5d6266", borderRadius: 16 })}>
        <div style={ab(30, 30, 180, 120, { background: "repeating-linear-gradient(0deg,#2a2e33 0 10px,#444 10px 16px)", borderRadius: 8 })}>
          <div style={ab(40, 40, 100, 70, { background: "linear-gradient(#9fd2ff,#2f6fe0)", clipPath: "polygon(50% 0, 100% 100%, 0 100%)", opacity: 1 - off, transform: `scaleY(${(1 - off) * (0.85 + 0.15 * Math.sin(f / 3))})`, transformOrigin: "50% 100%" })} /></div>
        <div style={ab(150, 168, 60, 40, { background: off > 0.5 ? RED : GRN, borderRadius: 6 })} />
      </div>
    </div>
    <Ch t="an oxygen sensor" at={t0} f={f} x={1260} y={260} size={66} />
    <Ch t="room air gets low" at={t2 - 10} f={f} x={1260} y={380} size={60} col="#bfe3ff" />
    <Ch t="→ it shuts off" at={t1 > t2 ? t1 : t2 + 4} f={f} x={1260} y={500} size={66} col={YEL} />
  </Floor>;
};

// heaterrules · EL PROSPECTO QUE SE DESPLIEGA: un folleto en acordeón de tres paneles — USO INTERIOR, TAMAÑO DEL CUARTO (el cuarto se agranda), AIRE FRESCO (la ventana se abre)
const HeaterRules: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t = [D(m, 0, dur, 0.08), D(m, 1, dur, 0.4), D(m, 2, dur, 0.68)];
  const panel = (i: number, children: React.ReactNode, title: string) => { const o = io((f - t[i]) / 14);
    return <div style={{ width: 520, height: 640, flex: "none", background: i % 2 ? "#f4efe2" : "#fbf8ef", transformOrigin: "0 50%", transform: `rotateY(${(1 - o) * (i ? 90 : 0)}deg)`, opacity: i ? cl(o * 3) : k(f, t[0], 8), boxShadow: "inset 0 0 0 4px #d8cfba", padding: 30, boxSizing: "border-box", position: "relative" }}>
      <Tx size={28} col="#6a5a40">{i + 1}</Tx><Tx size={46} col={INK} style={{ marginTop: 6 }}>{title}</Tx>{children}</div>; };
  const g = io((f - t[1] - 6) / 20); const w = k(f, t[2] + 6, 14);
  return <Floor>
    <div style={ab(180, 230, 1560, 640, { display: "flex", perspective: 1800 })}>
      {panel(0, <div style={ab(130, 260, 260, 260, { borderRadius: "50%", border: `16px solid ${GRN}`, display: "flex", alignItems: "center", justifyContent: "center" })}><Tx size={150} col={GRN}>✓</Tx></div>, "LABELED FOR INDOOR USE")}
      {panel(1, <div style={ab(260 - 120 - 80 * g, 230 + 160 - 120 - 60 * g, 240 + 160 * g, 240 + 120 * g, { border: `8px solid ${INK}` })}><Tx size={28} col={INK} style={{ position: "absolute", left: 10, bottom: 6 }}>MIN. ROOM SIZE</Tx></div>, "HOW BIG THE ROOM HAS TO BE")}
      {panel(2, <div style={ab(130, 360, 260, 230, { background: "#9ec3e6", border: "12px solid #e9e4d8" })}><div style={ab(0, -w * 80, 236, 140, { borderBottom: "10px solid #e9e4d8", background: "#9ec3e6" })} />
        {[0, 1, 2].map((i) => <div key={i} style={ab(60 + i * 50, 170 - ((f * 3 + i * 30) % 90), 12, 50, { background: "#fff", opacity: w, borderRadius: 6 })} />)}</div>, "HOW MUCH FRESH AIR IT NEEDS")}
    </div>
    <Ch t="read the label" at={0} f={f} x={960} y={80} size={76} c />
  </Floor>;
};

// nosleep · LA ALMOHADA TACHADA: la almohada y el calefactor al lado, tachados con dos golpes de tiza
const NoSleep: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <Floor>
    <Pic id="g1770" x={300} y={240} w={900} h={700} f={f} at={0} rot={-2} kind="print" tape />
    <div style={ab(1330, 380, 420, 420, { borderRadius: "50%", border: `34px solid ${RED}`, boxSizing: "border-box", transform: `scale(${0.5 + 0.5 * sp(f, 8)})`, opacity: k(f, 8, 4), boxShadow: "6px 8px 0 rgba(0,0,0,.3)", background: "rgba(255,255,255,.08)" })}>
      <div style={ab(155, -20, 42, 420, { background: RED, transform: "rotate(-45deg)", transformOrigin: "50% 50%", top: -34 })} />
      <Tx size={58} col="#fff" style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", textShadow: "2px 3px 0 rgba(0,0,0,.6)" }}>ASLEEP</Tx>
    </div>
    <Ch t="never while you sleep" at={4} f={f} x={960} y={70} size={92} c len={10} />
  </Floor>;
};
// towers · EL UMBRAL QUE NO SE CRUZA: tres siluetas (torre, de patio, torpedo) avanzan hacia la puerta, chocan contra la raya roja del umbral y rebotan
const Towers: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t = [D(m, 0, dur, 0.05), D(m, 1, dur, 0.3), D(m, 2, dur, 0.55), D(m, 3, dur, 0.82)];
  const go = (at: number) => { const p = cl((f - at) / 14); return p < 1 ? p * 1 : 1 - 0.18 * Math.sin(Math.min(Math.PI, (f - at - 14) / 6)) * Math.exp(-(f - at - 14) / 20); };
  const shapes = [
    <div style={{ width: 90, height: 520, position: "relative" }}><div style={ab(25, 60, 40, 460, { background: "#6b7076" })} /><div style={ab(0, 0, 90, 120, { background: "linear-gradient(#ff9a3a,#c45a12)", borderRadius: 18 })} /><div style={ab(-20, 500, 130, 30, { background: "#3a3e42", borderRadius: 10 })} /></div>,
    <div style={{ width: 240, height: 520, position: "relative" }}><div style={ab(0, 0, 240, 70, { background: "#8d949a", clipPath: "polygon(50% 0, 100% 100%, 0 100%)" })} /><div style={ab(105, 70, 30, 430, { background: "#6b7076" })} /><div style={ab(60, 490, 120, 30, { background: "#3a3e42", borderRadius: 10 })} /></div>,
    <div style={{ width: 300, height: 520, position: "relative" }}><div style={ab(0, 340, 300, 120, { background: "linear-gradient(#e2b23a,#a8811a)", borderRadius: 60 })} /><div style={ab(260, 360, 60, 80, { background: "radial-gradient(#ff7a1a,#c4400e)", borderRadius: "50%" })} /><div style={ab(60, 460, 30, 60, { background: "#333" })} /><div style={ab(210, 460, 30, 60, { background: "#333" })} /></div>];
  return <AbsoluteFill style={{ background: "linear-gradient(#cdd7e1,#eef3f7)" }}>
    <div style={ab(1300, 140, 520, 860, { background: "#e8dcc4" })}><Tx size={40} col="#8a7a5c" style={{ position: "absolute", left: 120, top: 60 }}>INSIDE</Tx></div>
    <div style={ab(1280, 140, 40, 860, { background: "#7a5a3c" })} />
    <div style={ab(1250, 140, 20, 860 * k(f, t[3] - 6, 10), { background: RED })} />
    <div style={ab(0, 1000, 1920, 80, { background: SNOW })} />
    {shapes.map((sh, i) => { const p = go(t[i]); const x = lerp(-400, 1240 - [90, 240, 300][i] - i * 0, p) - (2 - i) * 330 * (p > 0.98 ? 1 : p);
      return <div key={i} style={ab(x, 480, 320, 520, { opacity: f >= t[i] ? 1 : 0 })}>{sh}</div>; })}
    {["tower heaters", "patio heaters", "torpedo heaters"].map((s, i) => <Ch key={s} t={s} at={t[i]} f={f} x={60} y={60 + i * 90} size={56} col={INK} />)}
    <Ch t="never come inside." at={t[3]} f={f} x={1340} y={240} size={62} col={RED} />
    <Pic id="g1780" x={1350} y={360} w={430} h={400} f={f} at={t[3] + 4} rot={3} kind="pol" />
    <Stamp text="✕ OUTDOOR ONLY" f={f} at={t[3] + 10} x={1370} y={790} size={36} rot={-4} />
  </AbsoluteFill>;
};

// ================= MISTAKE 8 =================
// damper · LA TAPA DEL TIRAJE: chimenea en corte; la tapa gira a cerrado, el humo de las brasas choca y se derrama en el living (el gris baja del techo); al final se reabre
const Damper: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t = [D(m, 0, dur, 0.08), D(m, 1, dur, 0.4), D(m, 2, dur, 0.6), D(m, 3, dur, 0.9)];
  const reopen = Math.max(t[3], Math.round(dur * 0.88)); // se reabre recién al final del plano
  const closed = io((f - 4) / 14) * (1 - io((f - reopen) / 12)); const fill = io((f - t[1]) / 50) * (1 - k(f, reopen, 30));
  return <AbsoluteFill style={{ background: "#e8dcc4" }}>
    <div style={ab(0, 0, 1920, 600 * fill, { background: "rgba(110,112,118,.75)" })} />
    <div style={ab(560, 0, 520, 1080, { background: "repeating-linear-gradient(0deg,#8c4a36 0 50px,#d8cbb8 50px 56px)" })} />
    <div style={ab(700, 0, 240, 470, { background: "#2a2522" })} />
    <div style={ab(640, 470, 360, 360, { background: "#1d1915", borderRadius: "16px 16px 0 0" })}>
      {Array.from({ length: 7 }, (_, i) => <div key={i} style={ab(30 + i * 44, 300 - (i % 2) * 20, 70, 50, { borderRadius: 16, background: `radial-gradient(circle, rgba(255,${120 + 40 * Math.sin(f / 6 + i)},40,.9), #3a2a22 80%)` })} />)}
    </div>
    <div style={ab(700, 440, 240, 26, { perspective: 800 })}><div style={{ width: 240, height: 26, background: "#4a4f55", border: "4px solid #222", transformOrigin: "0 50%", transform: `rotate(${-80 * (1 - closed)}deg)` }} /></div>
    <Puffs f={f} x={820} y={740} at={0} dy={closed > 0.5 ? -260 : -720} dx={closed > 0.5 ? 380 : 0} curve={closed > 0.5 ? 300 : 0} size={90} n={9} life={46} col="120,122,128" />
    <Ch t="the coals are still burning" at={t[0]} f={f} x={1140} y={720} size={58} col={INK} />
    <Ch t="nowhere to go" at={t[1]} f={f} x={1140} y={820} size={64} col={RED} />
    <Ch t="but into the room" at={t[2]} f={f} x={1140} y={910} size={64} col={RED} />
    <Pic id="g1880" x={70} y={90} w={440} h={380} f={f} at={0} rot={-3} kind="print" tape />
    <div style={ab(80, 720, 440, 120, { background: closed > 0.5 ? RED : GRN, borderRadius: 12, border: "6px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", opacity: k(f, 6, 8), boxShadow: "6px 8px 0 rgba(0,0,0,.3)" })}><Tx size={46} col="#fff" style={{ whiteSpace: "nowrap" }}>{closed > 0.5 ? "DAMPER CLOSED" : "DAMPER OPEN"}</Tx></div>
  </AbsoluteFill>;
};

// ================= MISTAKE 9 =================
// perfloor · LOS PISOS QUE ENTRAN COMO ESTANTES + EL ENCHUFE ARRANCADO: sótano, planta baja y arriba entran deslizándose; un detector por piso, otro frente a los cuartos;
// después se arranca la ficha del enchufe y todos los LED siguen verdes con su pila
const PerFloor: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.08), t1 = D(m, 1, dur, 0.4), t2 = D(m, 2, dur, 0.7); const yank = k(f, t2, 10);
  const FL = ["UPSTAIRS · BEDROOMS", "MAIN FLOOR", "BASEMENT"];
  return <Floor dark={0.2}>
    {FL.map((s, i) => { const e = io((f - t0 - (2 - i) * 5) / 14);
      return <div key={s} style={ab(260 + (1 - e) * 1400, 140 + i * 260, 1000, 240, { background: i === 2 ? "#a9adb1" : "#efe5d0", border: "10px solid #4a3f36", boxSizing: "border-box" })}>
        <Tx size={36} col="#5a4a3c" style={{ position: "absolute", left: 24, top: 16 }}>{s}</Tx>
        <div style={ab(440, 60, 140, 140, { transform: `scale(${sp(f, t0 + 10 + (2 - i) * 4)})` })}><Puck s={0.75} />{yank > 0.5 && <div style={ab(96, 92, 50, 28, { background: GRN, borderRadius: 4, border: "3px solid #fff" })} />}</div>
        {i === 0 && <>{[700, 820].map((x) => <div key={x} style={ab(x, 70, 90, 150, { background: "#7a5a3c" })} />)}
          <div style={ab(560, 50, 110, 110, { transform: `scale(${sp(f, t1)})` })}><Puck s={0.6} /></div></>}
      </div>; })}
    <div style={ab(1340, 400, 150, 200, { background: "#f4f4f0", borderRadius: 14, border: "4px solid #bbb", boxShadow: "4px 6px 0 rgba(0,0,0,.3)" })}>{[60, 100].map((y) => <div key={y} style={ab(40, y - 8, 64, 14, { background: "#222", borderRadius: 3 })} />)}</div>
    {/* la ficha: sus dos patas entran justo en las dos ranuras; al arrancarla sale derecha hacia afuera */}
    <div style={ab(1424 + yank * 200, 400 + 52 - 22, 0, 0)}>
      {[0, 40].map((y) => <div key={y} style={ab(-44, 22 + y - 8 + 8, 64, 10, { background: "linear-gradient(#e8d28a,#b8963a)", borderRadius: 2 })} />)}
      <div style={ab(16, 0, 110, 96, { background: "#e9e9e6", borderRadius: 12, border: "3px solid #c9c9c4", boxShadow: "4px 6px 0 rgba(0,0,0,.3)" })} />
      <div style={ab(126, 40, 420, 16, { background: "#e9e9e6", borderRadius: 8 })} />
    </div>
    <Ch t="one on every floor" at={t0} f={f} x={1300} y={150} size={58} />
    <Ch t="+ outside the bedrooms" at={t1} f={f} x={1300} y={240} size={54} />
    <Ch t="no wall power? still on." at={t2} f={f} x={1300} y={700} size={58} col={YEL} />
  </Floor>;
};

// twotypes · LOS DOS DETECTORES DADOS VUELTA: giran y muestran la espalda — uno con portapilas, el otro con ficha + pila de respaldo tildada
const TwoTypes: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t = [D(m, 0, dur, 0.1), D(m, 1, dur, 0.45)];
  const flip = (i: number, back: React.ReactNode, lbl: string) => { const r = 180 * io((f - t[i]) / 14);
    return <div style={ab(250 + i * 800, 240, 620, 620, { perspective: 1400 })}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${r}deg)` }}>
        <div style={{ position: "absolute", inset: 60, backfaceVisibility: "hidden" }}><Puck s={2.77} /></div>
        <div style={{ position: "absolute", inset: 60, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}><Puck s={2.77} back>{back}</Puck></div>
      </div>
      <Tx size={44} col={CH} style={{ position: "absolute", left: -60, right: -60, top: 660, textAlign: "center", opacity: k(f, t[i] + 8, 8) }}>{lbl}</Tx>
    </div>; };
  const batt = (x: number, y: number) => <div style={ab(x, y, 180, 90, { background: "linear-gradient(90deg,#222 0 70%, #c9a23b 70%)", borderRadius: 10, border: "4px solid #555" })} />;
  return <Floor>
    {flip(0, <>{batt(160, 210)}</>, "BATTERY-ONLY")}
    {flip(1, <>{[200, 270].map((x) => <div key={x} style={ab(x, 120, 26, 90, { background: "#c7cdd1", borderRadius: 4 })} />)}{batt(160, 270)}
      <div style={ab(330, 300, 80, 80, { borderRadius: "50%", background: GRN, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sp(f, t[1] + 16)})` })}><Tx size={56} col="#fff">✓</Tx></div></>, "PLUG-IN + A BATTERY BACKUP YOU'VE CHECKED")}
    <Ch t="or" at={t[1] - 4} f={f} x={960} y={480} size={100} c />
  </Floor>;
};

// place:* · EL PLANO DE TIZA EN EL PISO DEL GARAJE: la casa dibujada con tiza sobre el concreto; en cada frase se apoya un detector como ficha de damas (acumulativo),
// el anillo de 15 ft alrededor de la cocina, la cruz en el baño por el vapor
const PL = ["hall", "living", "15", "basement", "garage", "no"];
const Place: React.FC<P> = ({ dur, m, a }) => {
  const f = useCurrentFrame(); const v = PL.indexOf(a[0]) < 0 ? 0 : PL.indexOf(a[0]); const t0 = D(m, 0, dur, 0.2), t1 = D(m, 1, dur, 0.55);
  const room = (x: number, y: number, w: number, h: number, s: string, hi = false) => <div style={ab(x, y, w, h, { border: `8px solid ${CH}`, boxSizing: "border-box", background: hi ? "rgba(242,194,48,.18)" : "transparent" })}><Tx size={30} col={CH} style={{ position: "absolute", left: 16, top: 12 }}>{s}</Tx></div>;
  const chip = (x: number, y: number, idx: number, at: number) => { if (idx > v) return null; const now = idx === v; const s = now ? sp(f, at) : 1;
    return <div style={ab(x - 50, y - 50 - (now ? (1 - s) * 140 : 0), 100, 100, { opacity: now ? k(f, at, 4) : 1 })}><Puck s={0.56} /></div>; };
  return <Floor>
    {room(140, 120, 360, 330, "BEDROOM", v === 0)}{room(500, 120, 360, 330, "BEDROOM", v === 0)}{room(860, 120, 260, 330, "BATH", v === 5)}
    {room(140, 450, 980, 120, "HALLWAY", v === 0)}
    {room(140, 570, 560, 400, "LIVING ROOM", v === 1)}{room(700, 570, 420, 400, "KITCHEN · STOVE", v === 2)}
    {room(1120, 570, 420, 400, "GARAGE", v === 4)}
    {room(1240, 120, 560, 380, "BASEMENT", v === 3)}
    <div style={ab(1270, 340, 170, 140, { background: "#5d6266", border: `4px solid ${CH}`, display: "flex", alignItems: "center", justifyContent: "center" })}><Tx size={24} col="#fff" style={{ whiteSpace: "nowrap", letterSpacing: 1 }}>FURNACE</Tx></div>
    <div style={ab(1456, 340, 190, 140, { background: "#e7e9ea", borderRadius: 40, display: "flex", alignItems: "center", justifyContent: "center" })}><Tx size={24} col={INK} style={{ whiteSpace: "nowrap", letterSpacing: 1 }}>W. HEATER</Tx></div>
    <div style={ab(960, 860, 100, 80, { background: "#3b3f44", borderRadius: 8 })} />
    <div style={ab(1112, 700, 16, 140, { background: YEL, opacity: v >= 4 ? 1 : 0.3 })} />
    {chip(640, 510, 0, v === 0 ? t0 : 0)}
    {chip(300, 720, 1, v === 1 ? t0 : 0)}
    {v === 1 && <div style={ab(820, 760, 260, 200, { background: `repeating-linear-gradient(45deg, rgba(214,64,47,.55) 0 14px, rgba(0,0,0,0) 14px 28px)`, opacity: k(f, t1, 10) })} />}
    {v === 2 && <><div style={ab(1010 - 380 * io((f - t0) / 18), 900 - 380 * io((f - t0) / 18), 760 * io((f - t0) / 18), 760 * io((f - t0) / 18), { borderRadius: "50%", border: `8px dashed ${YEL}` })} />
      <Ch t="≈ 15 FT" at={t0 + 10} f={f} x={170} y={870} size={70} col={YEL} /></>}
    {chip(1700, 300, 3, v === 3 ? t0 : 0)}
    {chip(1040, 760, 4, v === 4 ? t1 : 0)}
    {v === 4 && <><div style={ab(1250, 680, 180, 180, { opacity: k(f, t0, 6) })}><div style={ab(0, 80, 180, 20, { background: RED, transform: "rotate(45deg)" })} /><div style={ab(0, 80, 180, 20, { background: RED, transform: "rotate(-45deg)" })} /></div></>}
    {v === 5 && <><div style={ab(900, 200, 180, 180, { opacity: k(f, t0, 6) })}><div style={ab(0, 80, 180, 20, { background: RED, transform: "rotate(45deg)" })} /><div style={ab(0, 80, 180, 20, { background: RED, transform: "rotate(-45deg)" })} /></div>
      {[0, 1, 2].map((i) => <div key={i} style={ab(910 + i * 60, 400 - ((f * 2 + i * 20) % 120), 14, 60, { background: CH, borderRadius: 7, opacity: 0.7 })} />)}</>}
    <Tx size={44} col={YEL} style={{ position: "absolute", left: 140, top: 40 }}>{["OUTSIDE THE BEDROOMS · AT THE HEIGHT THE MANUAL SAYS", "MAIN FLOOR · NOT RIGHT NEXT TO THE FURNACE OR STOVE", "SEVERAL FEET FROM ANYTHING THAT BURNS FUEL", "THE BASEMENT · WHERE THE FURNACE LIVES", "NOT IN THE GARAGE · JUST INSIDE THE DOOR", "NOT IN THE BATHROOM · STEAM FOOLS THEM"][v]}</Tx>
    {v === 2 && <Src text="MOST DETECTOR MANUALS" f={f} at={t0 + 12} />}
  </Floor>;
};

// mixes · LA PROBETA PAREJA: una columna de vidrio con partículas grises repartidas igual de arriba a abajo; «¿se hunde?» ✕ «¿flota?» ✕; aparecen los detectores en pared y techo
const Mixes: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t = [D(m, 0, dur, 0.08), D(m, 1, dur, 0.3), D(m, 2, dur, 0.75)];
  return <Floor>
    <div style={ab(560, 140, 300, 840, { border: "10px solid rgba(80,100,120,.5)", borderTop: "none", borderRadius: "0 0 30px 30px", background: "rgba(255,255,255,.35)", overflow: "hidden" })}>
      {Array.from({ length: 60 }, (_, i) => <div key={i} style={ab(((i * 53) % 260) + Math.sin(f / 9 + i) * 8, ((i * 137) % 800) + Math.cos(f / 11 + i) * 10, 22, 22, { borderRadius: "50%", background: "#7c8188", opacity: k(f, t[0] - 10, 10) })} />)}
    </div>
    {/* sin flecha: contradecía la mezcla */}
    <Ch t="doesn't sink much ✕" at={t[1]} f={f} x={1050} y={360} size={56} col={CH} />
    <Ch t="doesn't float much ✕" at={t[1] + 10} f={f} x={1050} y={480} size={56} col={CH} />
    <div style={ab(1600, 70 - (1 - sp(f, t[2])) * 100, 130, 130, { opacity: k(f, t[2], 4) })}><Puck s={0.72} /></div>
    <div style={ab(60, 520, 130, 130, { opacity: k(f, t[2] + 8, 4), transform: `scale(${sp(f, t[2] + 8)})` })}><Puck s={0.72} /></div>
    <Ch t="the wall or the ceiling — fine" at={t[2] + 4} f={f} x={1050} y={700} size={56} col={GRN} />
    <Ch t="it mixes with the air" at={t[0]} f={f} x={1050} y={170} size={66} col={YEL} />
  </Floor>;
};

// ================= MISTAKE 10 =================
// age14 · LOS ANILLOS DE POLVO: la espalda del detector junta polvo en 14 anillos, uno por año
const Age14: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const n = Math.min(14, Math.floor(f / 2));
  return <Floor>
    <div style={ab(560, 140, 800, 800, { borderRadius: "50%", background: "radial-gradient(circle at 45% 40%, #efe9da, #cfc6b0 70%, #a99f88)", boxShadow: "0 12px 0 rgba(0,0,0,.3)" })}>
      {Array.from({ length: n }, (_, i) => <div key={i} style={ab(400 - (60 + i * 24), 400 - (60 + i * 24), (60 + i * 24) * 2, (60 + i * 24) * 2, { borderRadius: "50%", border: `5px solid rgba(120,104,80,${0.25 + i * 0.03})` })} />)}
    </div>
    <div style={ab(1360, 380, 500, 300)}><Tx size={240} col={CH} style={{ fontFamily: SERIF }}>{n}</Tx><Tx size={50} col={YEL}>YEARS OLD</Tx></div>
  </Floor>;
};

// sensor · LA CELDA QUE SE GASTA: el sensor visto de costado pierde su color a gris; abajo una regla de años y la abrazadera 5–10 que se encastra
const Sensor: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t = [D(m, 0, dur, 0.15), D(m, 1, dur, 0.55), D(m, 2, dur, 0.85)]; const worn = io((f - t[0]) / 30);
  return <Floor>
    <div style={ab(200, 180, 520, 380, { background: "linear-gradient(90deg,#9aa2a8,#e3e6e8 30%,#9aa2a8)", borderRadius: 30 })}>
      <div style={ab(60, 60, 400, 260, { borderRadius: 20, background: `rgb(${Math.round(lerp(40, 140, worn))},${Math.round(lerp(190, 140, worn))},${Math.round(lerp(170, 140, worn))})`, boxShadow: "inset 0 0 0 10px rgba(0,0,0,.15)" })} />
      <Tx size={34} col={INK} style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center", color: CH }}>THE SENSOR INSIDE</Tx>
    </div>
    <Ch t="it wears out" at={t[0]} f={f} x={820} y={300} size={86} />
    <div style={ab(160, 760, 1600, 120, { background: "#f2d24a", borderRadius: 8 })}>
      {Array.from({ length: 13 }, (_, i) => <React.Fragment key={i}><div style={ab(40 + i * 125, 0, 6, i % 5 === 0 ? 60 : 40, { background: INK })} /><Tx size={30} style={{ position: "absolute", left: 28 + i * 125, top: 66 }}>{i}</Tx></React.Fragment>)}
    </div>
    <div style={ab(40 + 5 * 125 + 160, 690 - (1 - sp(f, t[1])) * 120, 5 * 125 + 6, 90, { border: `10px solid ${RED}`, borderBottom: "none", opacity: k(f, t[1], 4), boxSizing: "border-box" })}>
      <Tx size={44} col={RED} style={{ position: "absolute", left: 0, right: 0, top: -64, textAlign: "center" }}>REPLACE · 5–10 YEARS</Tx></div>
    <Ch t="depending on the model" at={t[2]} f={f} x={960} y={920} size={54} c />
    <Src text="DETECTOR MANUFACTURERS" f={f} at={t[1] + 6} />
  </Floor>;
};

// ================= SIGNS / EMERGENCY =================
// signs · EL PASTILLERO DE SIETE TAPITAS: cada tapa se levanta y muestra un síntoma, en el orden en que los dice
const Signs: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const S = ["HEADACHE", "DIZZINESS", "WEAKNESS", "UPSET STOMACH", "THROWING UP", "CHEST PAIN", "CONFUSION"];
  return <Floor>
    <Ch t="the signs" at={0} f={f} x={960} y={70} size={84} c />
    <div style={ab(110, 300, 1700, 520, { background: "#3b6e9c", borderRadius: 30, padding: 24, boxSizing: "border-box", display: "flex", gap: 18, boxShadow: "8px 12px 0 rgba(0,0,0,.3)", perspective: 1200 })}>
      {S.map((s, i) => { const at = D(m, i, dur, 0.08 + i * 0.11); const o = io((f - at) / 10);
        return <div key={s} style={{ flex: 1, minWidth: 0, overflow: "hidden", position: "relative", background: "#f4f1e8", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Tx size={s.length > 10 ? 30 : 36} col={i === 6 || i === 5 ? RED : INK} style={{ textAlign: "center", transform: "rotate(-90deg)", whiteSpace: "nowrap", opacity: o }}>{s}</Tx>
          <div style={{ position: "absolute", inset: -6, background: "linear-gradient(#5c93c6,#4a7fb0)", borderRadius: 16, transformOrigin: "50% 0", transform: `rotateX(${o * 80}deg)`, opacity: 1 - o, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 20 }}><Tx size={40} col="#dbe9f6">{i + 1}</Tx></div>
        </div>; })}
    </div>
    <Src text="CDC" f={f} at={4} />
  </Floor>;
};

// suspect:N · LOS CONITOS DE EVIDENCIA: carpita amarilla numerada sobre el piso y su escena
const Tent: React.FC<{ n: number; f: number }> = ({ n, f }) => (
  <div style={ab(120, 680 - 60 * (1 - sp(f, 0)), 220, 240, {})}>
    <div style={{ position: "absolute", inset: 0, background: YEL, clipPath: "polygon(20% 0, 80% 0, 100% 100%, 0 100%)", boxShadow: "6px 8px 0 rgba(0,0,0,.3)" }} />
    <Tx size={130} col={INK} style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center" }}>{n}</Tx>
  </div>
);
const Suspect: React.FC<P> = ({ dur, m, a }) => {
  const f = useCurrentFrame(); const n = +a[0] || 1; const t0 = D(m, 0, dur, 0.25), t1 = D(m, 1, dur, 0.65);
  return <Floor>
    <Tent n={n} f={f} />
    <Tx size={36} col={CH} style={{ position: "absolute", left: 120, top: 940 }}>SUSPICIOUS · {n} OF 4</Tx>
    {n === 1 && <>
      <Pic id="g2680" x={430} y={250} w={640} h={500} f={f} at={t0 - 10} rot={-3} kind="print" tape />
      <Pic id="g2450" x={1140} y={290} w={640} h={500} f={f} at={t0} rot={2.5} kind="print" tape />
      <Ch t="everybody sick at the same time" at={t0} f={f} x={1060} y={110} size={66} c /></>}
    {n === 3 && <>
      <Pic id="g2510" x={460} y={250} w={640} h={520} f={f} at={t0 - 6} rot={-2} kind="print" tape />
      <Tx size={56} col={GRN} style={{ position: "absolute", left: 480, top: 800, opacity: k(f, t0, 8), background: "rgba(255,255,255,.92)", padding: "6px 18px", whiteSpace: "nowrap" }}>OUTSIDE · BETTER</Tx>
      <Pic id="g0420" x={1180} y={250} w={640} h={520} f={f} at={t1 - 6} rot={2} kind="print" tape />
      <Tx size={56} col={RED} style={{ position: "absolute", left: 1200, top: 800, opacity: k(f, t1, 8), background: "rgba(255,255,255,.92)", padding: "6px 18px", whiteSpace: "nowrap" }}>BACK IN · WORSE</Tx></>}
    {n === 4 && <>
      {["GENERATOR", "HEATER", "STOVE"].map((s, i) => <div key={s} style={ab(520 + i * 440, 280, 360, 420, { background: "#2c3036", borderRadius: 16, opacity: k(f, t0 + i * 4, 8) })}>
        <Tx size={40} col={CH} style={{ textAlign: "center", marginTop: 30 }}>{s}</Tx>
        <div style={ab(130, 170, 100, 160, { background: "#555", borderRadius: 12 })}><div style={ab(15, 15 + 70 * k(f, t0 + 10 + i * 4, 6), 70, 60, { background: GRN, borderRadius: 8 })} /></div>
        <Tx size={34} col={GRN} style={{ position: "absolute", left: 0, right: 0, bottom: 30, textAlign: "center", opacity: k(f, t0 + 12 + i * 4, 6) }}>TURNED ON</Tx></div>)}
      <Ch t="…and then it started" at={t1} f={f} x={1180} y={110} size={70} c /></>}
  </Floor>;
};

// firstmin · EL ARO DE 60 PUNTOS: la alarma se prende y un aro de 60 puntitos empieza a correr: el primer minuto
const FirstMin: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.1), t1 = D(m, 1, dur, 0.35), t2 = D(m, 2, dur, 0.7); const n = Math.floor(60 * io((f - t2) / Math.max(20, dur - t2)));
  return <Floor dark={0.35}>
    <div style={ab(200, 330, 420, 420, {})}><Puck s={2.3} led={RED} ledOn={f >= t1 && Math.floor(f / 5) % 2 === 0 ? 1 : 0} /></div>
    {f >= t1 && [0, 1, 2].map((i) => { const r = ((f - t1) * 6 + i * 70) % 210; return <div key={i} style={ab(410 - 210 - r, 540 - 210 - r, 420 + 2 * r, 420 + 2 * r, { borderRadius: "50%", border: `6px solid rgba(214,64,47,${1 - r / 210})` })} />; })}
    <div style={ab(1060, 200, 700, 700, {})}>
      {Array.from({ length: 60 }, (_, i) => { const an = (i / 60) * Math.PI * 2 - Math.PI / 2; return <div key={i} style={ab(350 + Math.cos(an) * 320 - 12, 350 + Math.sin(an) * 320 - 12, 24, 24, { borderRadius: "50%", background: i < n ? YEL : "rgba(243,240,230,.25)" })} />; })}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: k(f, t2, 8) }}><Tx size={60} col={CH}>THE FIRST</Tx><Tx size={140} col={YEL} style={{ fontFamily: SERIF }}>MINUTE</Tx></div>
    </div>
    <Ch t="the signs —" at={t0} f={f} x={120} y={110} size={64} />
    <Ch t="or the alarm goes off" at={t1} f={f} x={120} y={200} size={64} col="#ffb3a8" />
  </Floor>;
};

// dispatch · LA BURBUJA DE LA LLAMADA: el teléfono en llamada al 9-1-1, desde afuera, y la frase se escribe en el globo
const Dispatch: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.1); const msg = "I think it's carbon monoxide."; const n = Math.round(msg.length * cl((f - t0 + 10) / 30));
  return <AbsoluteFill style={{ background: "linear-gradient(#1c2a3e,#2c3f58)" }}>
    <div style={ab(0, 860, 1920, 220, { background: SNOW })} />
    <div style={ab(300, 140, 420, 820, { background: "#15181c", borderRadius: 56, border: "10px solid #3a3f45" })}>
      <div style={ab(30, 60, 340, 640, { background: "#0f3b26", borderRadius: 22 })}>
        <Tx size={30} col="#9be3b5" style={{ textAlign: "center", marginTop: 80 }}>CALLING</Tx><Tx size={110} col="#fff" style={{ textAlign: "center" }}>9-1-1</Tx>
        <Tx size={28} col="#9be3b5" style={{ textAlign: "center", marginTop: 40 }}>FROM OUTSIDE</Tx>
        <div style={ab(130, 470, 80, 80, { borderRadius: "50%", background: RED })} />
      </div>
    </div>
    <div style={ab(820, 300, 920, 260, { background: "#fff", borderRadius: 40, padding: "40px 50px", boxSizing: "border-box", boxShadow: "8px 10px 0 rgba(0,0,0,.3)", opacity: k(f, t0 - 10, 6) })}>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 72, color: INK }}>“{msg.slice(0, n)}{n < msg.length && Math.floor(f / 6) % 2 ? "|" : ""}”</div>
      <div style={{ position: "absolute", left: -40, top: 140, width: 0, height: 0, borderRight: "60px solid #fff", borderTop: "30px solid transparent", borderBottom: "30px solid transparent" }} />
    </div>
    <Ch t="tell them" at={0} f={f} x={830} y={180} size={70} />
    <Pic id="g2690" x={1200} y={600} w={540} h={400} f={f} at={6} rot={3} kind="pol" />
  </AbsoluteFill>;
};

// emergency · LAS TRES BALDOSAS DE TRIAGE: CONFUSED / VERY SLEEPY / WON'T WAKE UP se dan vuelta a rojo y cae la franja «EMERGENCY · TELL THE DISPATCHER»
const Emergency: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const S = ["CONFUSED", "VERY SLEEPY", "WON'T WAKE UP"]; const t3 = D(m, 3, dur, 0.6), t4 = D(m, 4, dur, 0.85);
  return <Floor>
    <div style={ab(150, 220, 1620, 420, { display: "flex", gap: 40, perspective: 1600 })}>
      {S.map((s, i) => { const at = D(m, i, dur, 0.08 + i * 0.15); const r = 180 * io((f - at) / 12);
        return <div key={s} style={{ flex: 1, position: "relative", transformStyle: "preserve-3d", transform: `rotateX(${r}deg)` }}>
          <div style={{ position: "absolute", inset: 0, background: "#4a4f55", borderRadius: 18, backfaceVisibility: "hidden" }} />
          <div style={{ position: "absolute", inset: 0, background: RED, borderRadius: 18, backfaceVisibility: "hidden", transform: "rotateX(180deg)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "6px 8px 0 rgba(0,0,0,.3)" }}><Tx size={64} col="#fff" style={{ textAlign: "center" }}>{s}</Tx></div>
        </div>; })}
    </div>
    <div style={ab(150, 720, 1620 * k(f, t3, 12), 170, { background: YEL, overflow: "hidden", boxShadow: "6px 8px 0 rgba(0,0,0,.3)" })}>
      <Tx size={80} style={{ padding: "36px 50px", whiteSpace: "nowrap" }}>= EMERGENCY</Tx></div>
    <Ch t="…and you tell the dispatcher that." at={t4} f={f} x={960} y={920} size={58} c />
  </Floor>;
};

// risk · EL PERCHERO DE LA ENTRADA: cinco cosas cuelgan de los ganchos (babero, bastón, corazón, inhalador, gota) — los que se enferman más rápido y peor
const Risk: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const S = ["BABIES", "OLDER ADULTS", "HEART DISEASE", "BREATHING PROBLEMS", "ANEMIA"]; const t5 = D(m, 5, dur, 0.85);
  const item = (i: number) => [
    <div style={{ width: 150, height: 170, background: "#f7c6d0", borderRadius: "40px 40px 75px 75px", border: "6px solid #e79cb0" }} />,
    <div style={{ width: 120, height: 260, position: "relative" }}><div style={ab(0, 0, 100, 100, { border: "16px solid #7a5a3c", borderBottom: "none", borderRight: "none", borderRadius: "60px 0 0 0" })} /><div style={ab(0, 50, 16, 210, { background: "#7a5a3c" })} /></div>,
    <div style={{ width: 150, height: 150, position: "relative", marginTop: 20 }}><div style={ab(25, 35, 100, 100, { background: RED, transform: "rotate(45deg)" })} /><div style={ab(5, 10, 80, 80, { background: RED, borderRadius: "50%" })} /><div style={ab(65, 10, 80, 80, { background: RED, borderRadius: "50%" })} /></div>,
    <div style={{ width: 150, height: 190, position: "relative" }}><div style={ab(40, 0, 70, 130, { background: "#5fb3e8", borderRadius: 14 })} /><div style={ab(40, 120, 110, 60, { background: "#3b6e9c", borderRadius: 14 })} /></div>,
    <div style={{ width: 130, height: 130, background: RED, borderRadius: "0 50% 50% 50%", transform: "rotate(45deg)", marginTop: 30 }} />][i];
  return <Floor>
    <div style={ab(100, 210, 1720, 50, { background: "linear-gradient(#8a5a33,#6e4526)", borderRadius: 10, boxShadow: "0 8px 0 rgba(0,0,0,.25)" })} />
    {S.map((s, i) => { const at = D(m, i, dur, 0.06 + i * 0.14); const sw = Math.sin((f - at) / 6) * 18 * Math.exp(-Math.max(0, f - at) / 22); const e = k(f, at, 6);
      return <div key={s} style={ab(200 + i * 330, 250, 260, 600, { transformOrigin: "50% 0", transform: `rotate(${sw}deg) translateY(${(1 - e) * -200}px)`, opacity: e })}>
        <div style={ab(120, 0, 18, 60, { background: "#9aa2a8", borderRadius: 9 })} />
        <div style={{ position: "absolute", top: 70, left: 0, right: 0, display: "flex", justifyContent: "center" }}>{item(i)}</div>
        <Tx size={s.length > 12 ? 30 : 36} col={CH} style={{ position: "absolute", top: 400, left: -20, right: -20, textAlign: "center" }}>{s}</Tx>
      </div>; })}
    <Ch t="get sick faster — and worse" at={t5} f={f} x={960} y={820} size={78} c col={RED} />
    <Src text="CDC" f={f} at={6} />
  </Floor>;
};

// ================= QUESTIONS FROM THE COUNTER =================
// counter · EL FRASCO DE PAPELITOS: sobre el mostrador de la ferretería, un frasco de vidrio donde caen los comentarios doblados
// q:N · EL PAPELITO QUE SE DESDOBLA: sale uno del frasco y se abre en el mostrador con la pregunta escrita a mano
const QS = ["I'll get a dual fuel one and only use propane.", "The hose through the wall.", "My detector beeps once every thirty seconds or so.", "Are combination smoke and CO detectors any good?",
  "My detector has a little screen with a number on it.", "The shed, a carport, or the breezeway?", "Is a battery power station safe inside?"];
const Counter: React.FC<{ f: number; slips: number }> = ({ f, slips }) => (<>
  <AbsoluteFill style={{ background: "linear-gradient(#3a4a5c,#26323f)" }} />
  <div style={ab(0, 760, 1920, 320, { background: "repeating-linear-gradient(90deg,#9a6a3c 0 120px,#87592f 120px 124px)", boxShadow: "inset 0 14px 0 rgba(255,255,255,.12)" })} />
  <div style={ab(150, 330, 360, 460, { borderRadius: "40px 40px 30px 30px", border: "8px solid rgba(230,240,246,.8)", background: "rgba(255,255,255,.12)", overflow: "hidden" })}>
    {Array.from({ length: slips }, (_, i) => <div key={i} style={ab(30 + ((i * 71) % 260), 400 - Math.floor(i / 4) * 34 - ((i * 13) % 16), 70, 40, { background: ["#fbf8ef", "#ffe66b", "#cfe8ff"][i % 3], transform: `rotate(${((i * 47) % 60) - 30}deg)` })} />)}
  </div>
  <div style={ab(170, 300, 320, 50, { background: "linear-gradient(#c9ced2,#8d959c)", borderRadius: 10 })} />
</>);
const CounterJar: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.1), t1 = D(m, 1, dur, 0.55); const n = Math.round(30 * io((f - t1 + 10) / 30));
  return <AbsoluteFill>
    <Counter f={f} slips={n} />
    {Array.from({ length: 5 }, (_, i) => { const q = cl((f - t1 - i * 5) / 16); return q > 0 && q < 1 ? <div key={i} style={ab(330 + Math.sin(i) * 60, -60 + q * 420, 70, 40, { background: "#fbf8ef", transform: `rotate(${q * 300}deg)` })} /> : null; })}
    <Ch t="questions from the counter" at={t0} f={f} x={620} y={360} size={86} />
    <Ch t="— from your comments" at={t1} f={f} x={620} y={480} size={70} col={YEL} />
  </AbsoluteFill>;
};
const Q: React.FC<P> = ({ dur, m, a }) => {
  const f = useCurrentFrame(); const n = Math.max(1, Math.min(7, +a[0] || 1)); const o = io((f - 4) / 14); const yes = n === 7 ? D(m, 0, dur, 0.85) : 1e9;
  return <AbsoluteFill>
    <Floor dark={0.3} />
    <div style={ab(620 + (1 - o) * -300, 180 + (1 - o) * 200, 1150, 560, { transform: `rotate(${-2 + (1 - o) * 30}deg) scale(${0.3 + 0.7 * o})`, transformOrigin: "0 100%" })}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 280, background: "#fbf8ef", transformOrigin: "50% 100%", transform: `rotateX(${(1 - o) * 120}deg)`, boxShadow: "6px 8px 0 rgba(0,0,0,.3)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 280, height: 280, background: "#f4efe2", boxShadow: "6px 8px 0 rgba(0,0,0,.3)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 278, height: 4, background: "rgba(0,0,0,.1)" }} />
      <Tx size={36} col="#8a7a5c" style={{ position: "absolute", left: 50, top: 40, opacity: o }}>QUESTION {n} OF 7</Tx>
      <div style={{ position: "absolute", left: 50, right: 50, top: 110, fontFamily: HAND, fontWeight: 700, fontSize: QS[n - 1].length > 40 ? 72 : 88, lineHeight: 1.15, color: "#1f4f8f", opacity: k(f, 10, 10) }}>“{QS[n - 1]}”</div>
      <div style={ab(780, 380, 300, 140, { border: `10px solid ${GRN}`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(-8deg) scale(${1 + 0.6 * (1 - k(f, yes, 6))})`, opacity: k(f, yes, 4) })}><Tx size={96} col={GRN}>YES</Tx></div>
    </div>
  </AbsoluteFill>;
};

// propane · LAS DOS PILAS DE FICHAS: las fichas grises de escape se apilan; la de propano queda más baja, pero las dos pasan la raya roja «enough to kill a family in a garage»
const Propane: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.1), t1 = D(m, 1, dur, 0.4), t2 = D(m, 2, dur, 0.75);
  const pile = (x: number, n: number, lbl: string, col: string) => <div style={ab(x, 0, 300, 1080, {})}>
    {Array.from({ length: n }, (_, i) => { const e = k(f, 4 + i * 1.6, 6); return <div key={i} style={ab(20, 900 - i * 34 - (1 - e) * 80, 260, 40, { borderRadius: "50%", background: "linear-gradient(#a7acb1,#6d7277)", border: "3px solid #4d5156", opacity: e })} />; })}
    <div style={ab(-40, 960, 380, 90, { background: col, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" })}><Tx size={46} col="#fff">{lbl}</Tx></div>
  </div>;
  return <Floor>
    {pile(450, 18, "GASOLINE", "#8a5a33")}
    {pile(1150, 13, "PROPANE", "#3b6e9c")}
    <div style={ab(200, 900 - 8 * 34, 1520 * k(f, t1, 12), 12, { background: RED })} />
    <Tx size={36} col={RED} style={{ position: "absolute", left: 210, top: 900 - 8 * 34 + 22, opacity: k(f, t1 + 6, 8), background: "rgba(255,255,255,.88)", padding: "6px 14px" }}>ENOUGH TO KILL A FAMILY IN A GARAGE</Tx>
    <Ch t="less is not safe" at={t0} f={f} x={960} y={70} size={84} c />
    <Ch t="in a garage" at={t2} f={f} x={1540} y={300} size={64} col={YEL} />
  </Floor>;
};

// protect · LAS DOS BANDEJAS: tres tarjetas (cadena afuera, auto con llave de día, batería de noche) se deslizan a la bandeja verde «PROTECTS YOU»
const Protect: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const S = ["A CHAIN ON A GENERATOR OUTSIDE", "A LOCKED CAR IN THE DAYLIGHT", "A BATTERY FOR THE NIGHT"];
  return <Floor>
    <div style={ab(150, 470, 1620, 560, { background: "rgba(47,158,90,.35)", border: `10px solid ${GRN}`, borderRadius: 24, boxSizing: "border-box" })}><Tx size={46} col="#d6f5e1" style={{ position: "absolute", left: 40, bottom: 20, whiteSpace: "nowrap" }}>THOSE PROTECT YOU</Tx></div>
    {S.map((s, i) => { const at = D(m, i, dur, 0.05 + i * 0.3); const p = io((f - at) / 14); const x = 200 + i * 520, y = lerp(40, 500, p);
      return <div key={s} style={ab(x, y, 480, 420, { background: "#fbf8ef", borderRadius: 14, transform: `rotate(${(1 - p) * (i - 1) * 8}deg)`, boxShadow: "6px 8px 0 rgba(0,0,0,.3)", opacity: k(f, at - 6, 6), boxSizing: "border-box", overflow: "hidden" })}>
        <div style={ab(14, 14, 452, 190, { overflow: "hidden", borderRadius: 8, background: "#222" })}><Img src={G(["g0490", "g0940", "g3200"][i])} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
        <div style={{ position: "absolute", left: 24, right: 24, top: 218 }}><Tx size={28} col="#8a7a5c">{i === 2 ? "NIGHT" : "DAY"}</Tx><Tx size={36} col={INK} style={{ marginTop: 10 }}>{s}</Tx></div></div>; })}
  </Floor>;
};

// chirp · LA TIRA DE MEDIO MINUTO: una línea de tiempo con marcas cada 30 s; en cada marca un único piquito; cuelgan las dos causas
const Chirp: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.08), t1 = D(m, 1, dur, 0.5), t2 = D(m, 2, dur, 0.78); const x0 = 160, step = 400;
  const play = (f - t0) / 14;
  return <Floor dark={0.3}>
    <div style={ab(x0, 470, 1600, 8, { background: CH })} />
    {[0, 1, 2, 3, 4].map((i) => <React.Fragment key={i}>
      <div style={ab(x0 + i * step - 3, 440, 6, 70, { background: CH })} />
      <Tx size={32} col={CH} style={{ position: "absolute", left: x0 + i * step + 18, top: 488, whiteSpace: "nowrap" }}>{["0:00", "0:30", "1:00", "1:30", "2:00"][i]}</Tx>
      <div style={ab(x0 + i * step - 14, 470 - 200 * cl(1 - Math.abs(play - i) * 2.5), 28, 200 * cl(1 - Math.abs(play - i) * 2.5), { background: YEL, borderRadius: 14 })} />
      {play >= i && <div style={ab(x0 + i * step - 20, 380, 40, 40, { borderRadius: "50%", background: YEL })} />}
    </React.Fragment>)}
    <Ch t="one single chirp · every half minute" at={t0} f={f} x={960} y={120} size={64} c />
    {/* cada cartel cuelga de SU marca (0:30 y 1:30): el poste nace en la línea, justo en el tic */}
    {[["LOW BATTERY", t1, x0 + step], ["END OF ITS LIFE", t2, x0 + 3 * step]].map(([s, at, cx]) => <div key={s as string} style={ab((cx as number) - 220, 478, 440, 330, { transformOrigin: "50% 0", transform: `rotate(${Math.sin((f - (at as number)) / 7) * 8 * Math.exp(-Math.max(0, f - (at as number)) / 24)}deg)`, opacity: k(f, at as number, 6) })}>
      <div style={ab(212, 0, 16, 150, { background: "#9aa2a8" })} />
      <div style={ab(0, 150, 440, 160, { background: "#fbf8ef", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "6px 8px 0 rgba(0,0,0,.3)" })}><Tx size={46} style={{ whiteSpace: "nowrap" }}>{s as string}</Tx></div></div>)}
  </Floor>;
};

// alarm4 · EL ROLLO DE PIANOLA: grupos de cuatro barras altas pasan de derecha a izquierda una y otra vez; el LED titila en rojo
const Alarm4: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.25), t1 = D(m, 1, dur, 0.7); const off = (f * 9) % 520;
  return <AbsoluteFill style={{ background: "#1d1f24" }}>
    <div style={ab(0, 340, 1920, 400, { background: "#f4efe2" })}>
      {Array.from({ length: 6 }, (_, g) => [0, 1, 2, 3].map((j) => <div key={g + "-" + j} style={ab(1920 - off + (g - 2) * 520 + j * 70, 60, 46, 280, { background: RED, borderRadius: 8, opacity: k(f, t0 - 20, 8) })} />))}
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={ab(0, 30 + i * 30, 1920, 2, { background: "rgba(0,0,0,.08)" })} />)}
    </div>
    <div style={ab(120, 80, 220, 220, {})}><Puck s={1.2} led={RED} ledOn={Math.floor(f / 4) % 2} /></div>
    <Ch t="loud · in groups of four" at={t0} f={f} x={420} y={120} size={80} col="#fff" />
    <Ch t="again and again" at={t1} f={f} x={960} y={800} size={86} c col={YEL} />
  </AbsoluteFill>;
};

// ppm · EL ZOOM AL UNO EN UN MILLÓN: una trama infinita de puntos grises; la cámara se zambulle hasta el único punto rojo; al lado la pantallita «PPM»
const Ppm: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.1); const z = Math.pow(14, io((f - t0) / Math.max(30, dur * 0.7)));
  return <AbsoluteFill style={{ background: "#e9ecee", overflow: "hidden" }}>
    <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "1206px 546px" }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(circle, #9aa2a8 0 3px, rgba(0,0,0,0) 3.5px)", backgroundSize: "12px 12px" }} />
      <div style={ab(1200, 540, 12, 12, { borderRadius: "50%", background: RED })} />
    </AbsoluteFill>
    <div style={ab(100, 120, 760, 340, { background: "#1b2330", borderRadius: 20, padding: 30, boxSizing: "border-box", boxShadow: "8px 10px 0 rgba(0,0,0,.25)" })}>
      <div style={{ background: "#b9c8a4", borderRadius: 10, height: 200, display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 30px", fontFamily: "monospace", fontWeight: 900, fontSize: 130, color: "#24301a" }}>1<span style={{ fontSize: 50, marginLeft: 20 }}>PPM</span></div>
      <Tx size={34} col={CH} style={{ marginTop: 20 }}>PARTS PER MILLION</Tx>
    </div>
    <Ch t="1 part in 1,000,000 of the air" at={t0 + 10} f={f} x={100} y={520} size={66} col={INK} />
  </AbsoluteFill>;
};

// daynight · LA RUEDA DEL HORIZONTE: un disco gira detrás del horizonte; baja el sol y sube la luna (la estación junto a la cama); vuelve el sol (el generador afuera)
const DayNight: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.1), t1 = D(m, 1, dur, 0.6); const ang = 180 * io((f - t0 + 6) / 16) - 180 * io((f - t1 + 6) / 16); const night = ang / 180;
  return <AbsoluteFill style={{ background: `rgb(${Math.round(lerp(150, 20, night))},${Math.round(lerp(190, 28, night))},${Math.round(lerp(225, 48, night))})`, overflow: "hidden" }}>
    <div style={ab(960 - 700, 760 - 700, 1400, 1400, { transform: `rotate(${ang}deg)` })}>
      <div style={ab(640, 20, 120, 120, { borderRadius: "50%", background: "#ffd35a" })} />
      <div style={ab(640, 1260, 120, 120, { borderRadius: "50%", background: "#f4f1e2", boxShadow: "inset -28px -10px 0 #d6d0b8", transform: "rotate(180deg)" })} />
    </div>
    <div style={ab(0, 760, 1920, 320, { background: SNOW })} />
    <Pic id="g3200" x={140} y={250} w={760} h={520} f={f} at={0} rot={-2} kind="print" op={0.35 + 0.65 * night} />
    <Pic id="g3640" x={1020} y={250} w={760} h={520} f={f} at={0} rot={2} kind="print" op={1 - 0.65 * night} />
    <Tx size={40} col={INK} style={{ position: "absolute", left: 160, top: 820, whiteSpace: "nowrap", opacity: 0.4 + 0.6 * night }}>OVERNIGHT · POWER STATION</Tx>
    <Tx size={40} col={INK} style={{ position: "absolute", left: 1040, top: 820, whiteSpace: "nowrap", opacity: 1 - 0.6 * night }}>DAYTIME · GENERATOR OUTSIDE</Tx>
  </AbsoluteFill>;
};

// ================= CTA (spoken) =================
// ctaq · EL COMENTARIO EN BLANCO: una tarjeta de comentario con el año vacío que titila; el detector se da vuelta y muestra «MFG DATE: ?»
const CtaQ: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.08), t1 = D(m, 1, dur, 0.6); const r = 180 * io((f - t1) / 14);
  return <Floor>
    <div style={ab(140, 230, 980, 520, { background: "#fbf8ef", borderRadius: 24, boxShadow: "8px 10px 0 rgba(0,0,0,.3)", padding: 50, boxSizing: "border-box", opacity: k(f, t0, 8) })}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}><div style={{ width: 80, height: 80, borderRadius: "50%", background: "#9aa2a8" }} /><Tx size={36} col="#6a5a40">TELL ME IN THE COMMENTS</Tx></div>
      <div style={{ fontFamily: SERIF, fontSize: 60, color: INK, marginTop: 50, lineHeight: 1.2 }}>The detector closest to my bed is from <span style={{ display: "inline-block", width: 220, borderBottom: `6px solid ${INK}`, color: RED }}>{Math.floor(f / 8) % 2 ? "|" : " "}</span></div>
    </div>
    <div style={ab(1260, 260, 480, 480, { perspective: 1400 })}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${r}deg)` }}>
        <div style={{ position: "absolute", inset: 30, backfaceVisibility: "hidden" }}><Puck s={2.33} /></div>
        <div style={{ position: "absolute", inset: 30, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}><Puck s={2.33} back><div style={ab(70, 160, 280, 100, { background: "#fff", border: "4px solid #999", display: "flex", alignItems: "center", justifyContent: "center" })}><Tx size={40}>MFG DATE: ?</Tx></div></Puck></div>
      </div>
    </div>
  </Floor>;
};

// cta · EL BUZÓN CON LA BANDERITA: el buzón rural levanta su bandera roja (suscribite) y entra el sobre del próximo video
const Cta: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.1), t1 = D(m, 1, dur, 0.4), t2 = D(m, 2, dur, 0.9); const flag = io((f - t0) / 12); const env = io((f - t1) / 18);
  return <Floor ph="g1600">
    <div style={ab(0, 860, 1920, 220, { background: "rgba(238,243,247,.92)" })} />
    <div style={ab(880, 560, 40, 300, { background: "#7a5a3c" })} />
    <div style={ab(600, 300, 620, 280, { background: "linear-gradient(#b9c0c6,#7d858c)", borderRadius: "140px 140px 10px 10px", boxShadow: "8px 10px 0 rgba(0,0,0,.25)" })}>
      <div style={ab(-10, 20, 40, 250, { background: "#2a2e33", borderRadius: "40px 0 0 10px" })} />
    </div>
    <div style={ab(1180, 340, 24, 230, { background: RED, transformOrigin: "50% 100%", transform: `rotate(${90 - 90 * flag}deg)` })}><div style={ab(0, 0, 110, 70, { background: RED })} /></div>
    <div style={ab(lerp(-700, 560, env), 640 + (1 - env) * -200, 620, 270, { background: "#fbf8ef", boxShadow: "6px 8px 0 rgba(0,0,0,.3)", transform: `rotate(${(1 - env) * -14 - 2}deg)`, boxSizing: "border-box" })}>
      <div style={ab(18, 18, 220, 234, { overflow: "hidden", borderRadius: 10, background: "#222" })}><Img src={G("g2630")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
      <div style={{ position: "absolute", left: 260, right: 20, top: 22 }}><Tx size={28} col="#6a5a40">NEXT VIDEO</Tx><Tx size={36} col={INK} style={{ fontFamily: SERIF, marginTop: 10, lineHeight: 1.12 }}>KEEPING YOUR HOUSE WARM WHEN THE POWER'S OUT</Tx></div></div>
    <Ch t="subscribe" at={t0} f={f} x={1300} y={200} size={100} col={RED} />
    <Ch t="now the prize →" at={t2} f={f} x={1300} y={700} size={70} col={YEL} />
  </Floor>;
};

// ================= THE TWO-MINUTE CHECK =================
// check:0-4 · LA REGLETA DE CUATRO MEDIOS MINUTOS: cuatro baldosas de 0:30 forman los 2:00; en cada paso la suya se llena como un vaso y arriba aparece el pictograma del paso
const STEP = ["PRESS THE TEST BUTTON", "FIND THE DATE ON THE BACK", "COUNT: ONE ON EVERY FLOOR?", "HOUSE-TO-GARAGE DOOR · LOOK AT THE BOTTOM"];
const Check: React.FC<P> = ({ dur, a }) => {
  const f = useCurrentFrame(); const n = Math.max(0, Math.min(4, +a[0] || 0));
  const pic = (i: number) => [
    <div style={{ position: "relative", width: 300, height: 300 }}><Puck s={1.6} />{[0, 1].map((j) => { const r = ((f * 4 + j * 40) % 80); return <div key={j} style={ab(144 - r, 144 - r, 2 * r + 12, 2 * r + 12, { borderRadius: "50%", border: `5px solid rgba(242,194,48,${1 - r / 80})` })} />; })}</div>,
    <div style={{ position: "relative", width: 300, height: 300 }}><Puck s={1.6} back><div style={ab(40, 120, 210, 60, { background: "#fff", border: "3px solid #999", display: "flex", alignItems: "center", justifyContent: "center" })}><Tx size={26}>MFG DATE</Tx></div></Puck></div>,
    <div style={{ position: "relative", width: 300, height: 300 }}>{[0, 1, 2].map((j) => <div key={j} style={ab(0, 20 + j * 92, 300, 84, { border: `6px solid ${CH}`, boxSizing: "border-box" })}><Tx size={40} col={YEL} style={{ position: "absolute", right: 16, top: 14, opacity: k(f, 10 + j * 8, 6) }}>{j < 2 ? "✓" : "?"}</Tx></div>)}</div>,
    <div style={{ position: "relative", width: 300, height: 300 }}><div style={ab(40, 0, 220, 280, { background: "#7a5a3c" })} /><div style={ab(40, 280, 220, 12, { background: "#fff6c8", boxShadow: "0 0 0 6px rgba(255,246,200,.5)" })} /></div>][i];
  return <Floor>
    <Tx size={48} col={YEL} style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", letterSpacing: 6 }}>THE TWO-MINUTE CHECK{n === 0 ? " · TONIGHT" : ""}</Tx>
    <div style={ab(160, 760, 1600, 200, { display: "flex", gap: 20 })}>
      {[0, 1, 2, 3].map((i) => { const e = n === 0 ? k(f, 6 + i * 6, 8) : 1; const fill = i < n - 1 ? 1 : i === n - 1 ? io(f / Math.max(20, dur * 0.9)) : 0;
        return <div key={i} style={{ flex: 1, height: 200, position: "relative", border: `8px solid ${i === n - 1 ? YEL : CH}`, borderRadius: 16, overflow: "hidden", opacity: e, transform: `translateY(${(1 - e) * 60}px)` }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, background: i < n - 1 ? "rgba(47,158,90,.8)" : "rgba(242,194,48,.85)" }} />
          <Tx size={70} col={i === n - 1 ? INK : CH} style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center" }}>0:30</Tx>
          <Tx size={30} col={i === n - 1 ? INK : CH} style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center" }}>STEP {i + 1}</Tx>
        </div>; })}
    </div>
    {n === 0 ? <><div style={ab(330, 170, 480, 480, { borderRadius: "50%", background: "#f3f0e6", border: "18px solid #2b3442", boxSizing: "border-box", boxShadow: "0 20px 40px rgba(0,0,0,.35)" })}>{Array.from({ length: 12 }, (_, j) => <div key={j} style={ab(213, 14, 18, 40, { background: "#2b3442", transformOrigin: "9px 208px", transform: `rotate(${j * 30}deg)` })} />)}<Tx size={64} col={CH} style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center" }}>{`${Math.floor((120 - Math.round(f / 3)) / 60)}:${String((120 - Math.round(f / 3)) % 60).padStart(2, "0")}`}</Tx><div style={ab(214, 60, 16, 170, { background: RED, borderRadius: 8, transformOrigin: "8px 162px", transform: `rotate(${((120 - Math.round(f / 3)) % 60) * 6}deg)` })} /><div style={ab(202, 202, 40, 40, { borderRadius: "50%", background: RED })} /><div style={ab(190, -70, 64, 60, { background: "#2b3442", borderRadius: 10 })} /></div><Ch t="do it tonight." at={10} f={f} x={1330} y={380} size={130} c /></>
      : <><div style={ab(260, 220, 300, 300, { transform: `scale(${sp(f, 2)})` })}>{pic(n - 1)}</div>
        <Tx size={64} col={CH} style={{ position: "absolute", left: 660, top: 300, width: 1100, opacity: k(f, 6, 8) }}>{STEP[n - 1]}</Tx></>}
  </Floor>;
};

// datecalc · LA RESTA EN EL PAPELITO: «HOY − FECHA DE FÁBRICA = EDAD» escrito en lápiz; la edad se compara con 5–10 años y se encierra «THIS WEEK» en el almanaque
const DateCalc: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.08), t1 = D(m, 1, dur, 0.45), t2 = D(m, 2, dur, 0.8);
  return <Floor>
    <div style={ab(140, 200, 860, 600, { background: "#ffe66b", transform: "rotate(-2deg)", boxShadow: "6px 8px 0 rgba(0,0,0,.3)" })}>
      <Ch t="today" at={t0} f={f} x={60} y={60} size={80} col={INK} />
      <Ch t="− MFG date" at={t0 + 10} f={f} x={60} y={170} size={80} col={INK} />
      <div style={ab(60, 290, 640 * k(f, t0 + 20, 10), 8, { background: INK })} />
      <Ch t="= its age" at={t0 + 24} f={f} x={60} y={320} size={80} col={RED} />
      <Ch t="older than 5–10 yrs?" at={t1} f={f} x={60} y={450} size={66} col={INK} />
    </div>
    <div style={ab(1120, 200, 640, 600, { background: "#fbf8ef", boxShadow: "6px 8px 0 rgba(0,0,0,.3)" })}>
      <div style={ab(0, 0, 640, 100, { background: RED })} />
      <div style={{ position: "absolute", left: 30, top: 130, display: "grid", gridTemplateColumns: "repeat(7, 80px)", gap: 4 }}>
        {Array.from({ length: 35 }, (_, i) => <div key={i} style={{ height: 80, background: i >= 14 && i < 21 ? "rgba(242,194,48,.3)" : "#f0ece0", fontFamily: SANS, fontSize: 22, color: "#888", padding: 6, boxSizing: "border-box" }}>{(i % 31) + 1}</div>)}
      </div>
      <div style={ab(16, 130 + 2 * 84 - 10, 600, 104, { border: `8px solid ${RED}`, borderRadius: 50, clipPath: `inset(0 ${100 - 100 * k(f, t2, 14)}% 0 0)` })} />
      <Ch t="replace it this week" at={t2 + 6} f={f} x={40} y={500} size={58} col={RED} />
    </div>
  </Floor>;
};

// floorplan · LA LISTA PARA CONTAR: anotador con los pisos; se van tildando y el último queda con signo de pregunta
const FloorPlan: React.FC<P> = () => {
  const f = useCurrentFrame(); const L = ["BASEMENT", "MAIN FLOOR", "UPSTAIRS", "OUTSIDE THE BEDROOMS"];
  return <Floor>
    <div style={ab(560, 120, 800, 860, { background: "#fbf8ef", boxShadow: "8px 10px 0 rgba(0,0,0,.3)", backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0) 0 98px, #b9d0e8 98px 101px)" })}>
      <Ch t="count." at={0} f={f} x={60} y={30} size={110} col={RED} len={8} />
      {L.map((s, i) => <React.Fragment key={s}><div style={ab(60, 230 + i * 150, 70, 70, { border: `6px solid ${INK}` })} />
        <Tx size={46} col={INK} style={{ position: "absolute", left: 160, top: 240 + i * 150 }}>{s}</Tx>
        <Ch t={i < 3 ? "✓" : "?"} at={10 + i * 8} f={f} x={66} y={210 + i * 150} size={90} col={i < 3 ? GRN : RED} len={4} /></React.Fragment>)}
    </div>
  </Floor>;
};

// ================= CLOSE =================
// next · LA ESCALERA DE DOCE PELDAÑOS: doce peldaños de lo más seguro (arriba, verde) a lo más riesgoso (abajo, rojo); tres de abajo se marcan «you just saw these»
const Next: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t = [D(m, 0, dur, 0.05), D(m, 1, dur, 0.4), D(m, 2, dur, 0.55), D(m, 3, dur, 0.8)];
  return <Floor>
    <div style={ab(740, 60, 26, 960, { background: "#c9a26b" })} /><div style={ab(1160, 60, 26, 960, { background: "#c9a26b" })} />
    {Array.from({ length: 12 }, (_, i) => { const e = k(f, t[0] + i * 1.5, 8); const mark = i >= 9 ? k(f, t[3] + (i - 9) * 4, 8) : 0;
      return <div key={i} style={ab(766 - (1 - e) * 400, 80 + i * 78, 394, 56, { background: `hsl(${130 - i * 11}, 60%, 50%)`, borderRadius: 8, opacity: e, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: mark ? `0 0 0 8px ${YEL}` : "3px 4px 0 rgba(0,0,0,.25)" })}><Tx size={34} col="#fff">{i + 1}</Tx></div>; })}
    <Ch t="12 ways to keep" at={t[0]} f={f} x={60} y={120} size={60} />
    <Ch t="your house warm" at={t[0] + 4} f={f} x={60} y={200} size={60} />
    <Ch t="safest ↑" at={t[1]} f={f} x={1240} y={70} size={64} col="#8ff0b0" />
    <Ch t="riskiest ↓" at={t[2]} f={f} x={1240} y={930} size={64} col="#ff9a8a" />
    <Ch t="3 of them:" at={t[3] + 4} f={f} x={60} y={790} size={58} col={YEL} />
    <Ch t="mistakes you just saw" at={t[3] + 8} f={f} x={60} y={870} size={58} col={YEL} />
  </Floor>;
};

// recap:out · LA SALIDA EN FILA: la familia sale por la puerta a la nieve y recién afuera se enciende el teléfono con el 9-1-1
const ExitWalk: React.FC<P> = ({ dur, m }) => {
  const f = useCurrentFrame(); const t0 = D(m, 0, dur, 0.2), t1 = D(m, 1, dur, 0.7);
  return <Floor>
    <Pic id="g2510" x={110} y={300} w={760} h={560} f={f} at={t0 - 8} rot={-2.5} kind="pol" tape />
    <Pic id="g2520" x={1010} y={270} w={800} h={560} f={f} at={t1 - 8} rot={2} kind="print" tape />
    <div style={ab(1270, 850, 300, 120, { background: RED, borderRadius: 16, border: "6px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", opacity: k(f, t1, 6), transform: `scale(${0.6 + 0.4 * sp(f, t1)})`, boxShadow: "6px 8px 0 rgba(0,0,0,.3)" })}><Tx size={64} col="#fff" style={{ whiteSpace: "nowrap" }}>9-1-1</Tx></div>
    <Ch t="everybody out first" at={t0} f={f} x={80} y={90} size={80} />
    <Ch t="then call 9-1-1 from outside" at={t1} f={f} x={80} y={185} size={66} col={YEL} />
  </Floor>;
};

// ---------- r4 limpieza: escenas que dibujaban generador/casa/caja/calefactor/frasco con CSS → foto real como plancha + copias reales + texto grande
// L = renglón: [texto, índice de marca (−1 = arranque; ≥0 = m[i]), color?, tamaño?, demora extra?]
type L = [string, number, string?, number?, number?];
type TK = { ph?: string; pics?: [string, string][]; lines: L[]; stamp?: [string, number]; src?: string; head?: string };
const Talk: React.FC<P & { k: TK }> = ({ dur, m, k: c }) => {
  const f = useCurrentFrame(); const n = c.lines.length;
  const at = (i: number, ex = 0) => (i < 0 ? 3 : D(m, i, dur, 0.1 + 0.75 * (i / Math.max(1, n)))) + ex;
  const P = c.pics || []; const row = P.length >= 3; const none = P.length === 0;
  const lx = none ? 960 : 90, ly0 = row ? 170 : none ? 300 : 230;
  return <Floor dark={0.25} ph={c.ph}>
    {c.head && <Ch t={c.head} at={2} f={f} x={960} y={50} size={60} c />}
    {P.length === 1 && <Pic id={P[0][0]} x={1000} y={170} w={820} h={680} f={f} at={2} rot={2} kind="pol" cap={P[0][1]} tape />}
    {P.length === 2 && <><Pic id={P[0][0]} x={980} y={90} w={600} h={480} f={f} at={2} rot={-3} kind="print" cap={P[0][1]} tape />
      <Pic id={P[1][0]} x={1260} y={520} w={600} h={480} f={f} at={at(Math.min(1, n - 1))} rot={3} kind="print" cap={P[1][1]} tape /></>}
    {row && P.map(([id, cap], i) => <Pic key={id} id={id} x={90 + i * 600} y={360} w={540} h={480} f={f} at={6 + i * Math.max(8, dur * 0.22)} rot={[-3, 2, -2][i]} kind="pol" cap={cap} tape />)}
    {!row && c.lines.map(([t, i, col, size, ex], j) => <Ch key={j} t={t} at={at(i, ex || 0)} f={f} x={lx} y={ly0 + j * 128} size={size || 66} col={col || CH} c={none} />)}
    {c.stamp && <Stamp text={c.stamp[0]} f={f} at={at(c.stamp[1], 10)} x={none ? 760 : 120} y={none ? 880 : 860} size={44} rot={-4} />}
    {c.src && <Src text={c.src} f={f} at={6} />}
  </Floor>;
};
const FIX: Record<string, TK> = {
  leaks: { ph: "g0280", pics: [["g0410", "the garage"], ["g0420", "the kitchen"]], lines: [["three ways in:", -1], ["the door", 0, YEL], ["gaps around pipes", 1, YEL], ["& the wires", 1, YEL, 66, 8], ["the attic", 2, YEL]] },
  draft: { ph: "g2251", pics: [["g0420", "pulled in from the garage"]], lines: [["warm air rises —", 2, CH, 84], ["it pulls air in", 3, YEL, 84]] }, // r3: 2 renglones
  "draft:garage": { ph: "g1690", pics: [["g0410", "the attached garage"]], lines: [["a lot of it", -1, CH, 84], ["comes from", -1, CH, 84, 10], ["the garage.", -1, YEL, 92, 22]] },
  yard20: { ph: "g2010", pics: [["g0480", "a stake at 20 FT"], ["g0531", "exhaust pointed away"]], lines: [["at least 20 FT", 0, YEL, 84], ["from the house", 0, CH, 66, 10], ["exhaust pointed away", 1], ["from windows,", 2], ["doors and vents", 2, CH, 66, 8]], src: "U.S. CPSC" },
  chainprice: { ph: "g0281", pics: [["g0490", "chained to the stake"]], lines: [["a 12-ft chain", 0], ["+ a good padlock", 1], ["cost less than", 2, YEL], ["one night in the ER", 2, YEL, 66, 10]] },
  shutoff: { ph: "g2800", pics: [["g0720", "CO shut-off on the box"]], lines: [["many new generators", -1], ["have a CO shut-off", 0], ["exhaust builds up…", 1], ["it shuts itself off.", 1, YEL, 70, 12]] }, // r3: sin sello repetido
  hosewall: { ph: "g0630", pics: [["g0910", "the car in the garage"], ["g0880", "the hose out the wall"]], lines: [["run the car", 0], ["door closed", 0, CH, 66, 10], ["a hose from the tailpipe", 1, CH, 60], ["through the wall", 2], ["safe?", 2, YEL, 110, 14]] },
  sealedbox: { ph: "g3110", pics: [["g0910", "door down"]], lines: [["a closed garage", 0, CH, 80], ["is a sealed box", 0, CH, 80, 10], ["with an engine in it.", 1, YEL, 72]] },
  climb: { ph: "g1240", pics: [["g0630", "up the wall"]], lines: [["exhaust is hot", -1, CH, 92], ["— and it climbs.", -1, YEL, 92, 18]] },
  window10: { ph: "g1090", pics: [["g1040", "right under the window"]], lines: [["10 FT from the house", 0, CH, 66], ["a window cracked open", 1], ["for fresh air…", 1, CH, 66, 10], ["straight into", 2, YEL, 80], ["the house", 2, YEL, 80, 8]] },
  neighbor: { ph: "g1200", pics: [["g1110", "20 feet apart"]], lines: [["houses 20 FT apart", 0], ["your neighbor's generator", 1, CH, 58], ["closer to your window", 2, YEL], ["than his own.", 2, YEL, 66, 10]] },
  sidecheck: { ph: "g0660", head: "20 feet — and look at that side of the house", pics: [["g0591", "WINDOW?"], ["g1060", "DOOR?"], ["g1620", "VENT?"]], lines: [] },
  flue: { ph: "g1600", pics: [["g1570", "the exhaust goes out"]], lines: [["your furnace", 0], ["your water heater", 0, CH, 66, 10], ["they burn gas", 0, CH, 66, 20], ["the exhaust", 1, YEL, 80], ["has to go out.", 1, YEL, 80, 8]] },
  inout: { ph: "g1650", pics: [["g1680", "two pipes"]], lines: [["one brings", 0], ["air in", 0, "#8fc4f0", 96, 8], ["one pushes", 1], ["exhaust out", 1, YEL, 96, 8]] },
  ventmap: { ph: "g2380", pics: [["g1620", "dryer + water heater"], ["g1650", "the furnace pipe"]], lines: [["FURNACE", 0, CH, 80], ["WATER HEATER", 1, CH, 80], ["DRYER", 2, CH, 80], ["FIREPLACE", 3, CH, 80]] },
  towers: { ph: "g1630", pics: [["g1780", "a patio heater · in the den"]], lines: [["tower heaters", 0], ["patio heaters", 1], ["torpedo heaters", 2], ["never come inside.", 3, RED, 72]] }, // r3: foto del error real, sin sello
  damper: { ph: "g1930", pics: [["g1880", "damper closed too soon"]], lines: [["the coals are", 0], ["still burning", 0, CH, 66, 8], ["nowhere to go", 1, YEL, 76], ["but into the room", 2, YEL, 76]] }, // r3: sin sello
  counter: { ph: "g3270", lines: [["questions from the counter", 0, CH, 92], ["— from your comments", 1, YEL, 76]] },
  alarm4: { ph: "g2020", pics: [["g2950", "the back label"]], lines: [["the real alarm:", -1], ["loud", 0, YEL, 92], ["in groups of four", 0, CH, 66, 10], ["again and again", 1, YEL, 76]] },
};

// plancha de fondo por escena: una foto real distinta del video en cada plano (bajo degradé oscuro)
const PLATE: Record<string, string> = {
  tenlist: "g0230", rooms: "g0230", "promise:garage": "g2560", "cdc:400": "g2251", cdc: "g0420", nosense: "g3530", hundreds: "g2240", leaks: "g0280",
  draft: "g2251", "draft:garage": "g1690", chainprice: "g0281", shutoff: "g2800", hosewall: "g0630", hoseleak: "g3120", sealedbox: "g3110", cord: "g1190",
  rank12: "g1730", heaterrules: "g1730", label: "g1801", nosleep: "g0020", perfloor: "g1980", twotypes: "g3420", "place:hall": "g2610", "place:15": "g2980",
  "place:no": "g1802", age14: "g2370", sensor: "g2330", signs: "g0290", "suspect:1": "g3530", "suspect:4": "g3140", suspect: "g3140", firstmin: "g2510",
  emergency: "g2680", propane: "g2760", chirp: "g2950", ctaq: "g2370", check: "g3350", datecalc: "g3390", floorplan: "g3480", next: "g3370", tarp: "g1630",
  risk: "g2450", counter: "g3270", q: "g2000", protect: "g2800", climb: "g1240", window10: "g1090", inout: "g1650", flue: "g1600", ventmap: "g2380",
  towers: "g1630", mixes: "g3420", blood: "g0420", sleep: "g0020", recap: "g1280", promise: "g1290", coals: "g1310", sidecheck: "g0660", yard20: "g2010", alarm4: "g2020", dispatch: "g2070", hundreds2: "g2170",
};
export const CompC14c: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  const [c, ...a] = String(s.comp || s.spec).split(":"); const m: number[] = s.m || [];
  const T: Record<string, React.FC<P>> = { sleep: Sleep, tenlist: TenList, promise: Promise2, cdc: Cdc, nosense: NoSense, blood: Blood, postmark: FlashMap, hundreds: Hundreds, leaks: Leaks, draft: Draft,
    yard20: Yard20, chainprice: ChainPrice, tarp: Tarp, shutoff: Shutoff, hosewall: HoseWall, hoseleak: HoseLeak, sealedbox: SealedBox, climb: Climb, window10: Window10, neighbor: Neighbor,
    sidecheck: SideCheck, cord: Cord, coals: Coals, oven: Oven, rooms: Rooms, rank12: Rank12, flue: Flue, inout: InOut, ventmap: VentMap, label: Label, heaterrules: HeaterRules, nosleep: NoSleep,
    towers: Towers, damper: Damper, perfloor: PerFloor, twotypes: TwoTypes, place: Place, mixes: Mixes, age14: Age14, sensor: Sensor, signs: Signs, suspect: Suspect, firstmin: FirstMin,
    dispatch: Dispatch, emergency: Emergency, risk: Risk, counter: CounterJar, q: Q, propane: Propane, protect: Protect, chirp: Chirp, alarm4: Alarm4, ppm: Ppm, daynight: DayNight, ctaq: CtaQ, cta: Cta,
    check: Check, datecalc: DateCalc, floorplan: FloorPlan, next: Next };
  const key = String(s.comp || s.spec);
  const ph = PLATE[key] || PLATE[c] || "g2060";
  const inner = FIX[key] ? <Talk m={m} dur={dur} a={a} k={FIX[key]} /> : c === "mistake" ? <Reel m={m} dur={dur} a={a} /> : c === "recap" ? (a[0] === "out" ? <ExitWalk m={m} dur={dur} a={a} /> : <Reel m={m} dur={dur} a={a} recap />)
    : T[c] ? React.createElement(T[c], { m, dur, a }) : <AbsoluteFill style={{ background: "#f0f" }} />;
  return <PlateCtx.Provider value={ph}>{inner}</PlateCtx.Provider>;
};
