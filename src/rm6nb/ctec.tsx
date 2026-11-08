// c7b.tsx · componentes ÚNICOS de rm6nb (sesE, Ramón: «why I never put premium gas in my car»). Inglés.
// Ninguno repite los de rm6na (c6a), tec5na/b (c5a/c5b) ni enrm. Objetos dibujados en código; 3D = CSS 3D real, sin WebGL.
import React from "react";
import { BR, cl, DIM, eio, H, HAND, lerp, MZ, phys, RED, rnd, Stage, Tag, TIN, TX, VER } from "./ckit";

type C = React.FC<{ t: number; h: H }>;
const ab = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });
const F = "'Arial Black', Arial, sans-serif";
const M = "'Courier New', monospace";
const CHROME = "linear-gradient(100deg,#6d7680,#dfe6ec 28%,#8d969f 55%,#e8edf2 78%,#6a7279)";
const STEEL = "linear-gradient(#59616b,#2c3138)";
const OLIVE = "#c9a24a";
const txt = (x: number, y: number, s: number, c: string, o = 1, font = F): React.CSSProperties => ({ position: "absolute", left: x, top: y, fontFamily: font, fontSize: s, fontWeight: 900, color: c, opacity: o, lineHeight: 1, whiteSpace: "nowrap" });
const Scene: React.FC<{ x?: number; y?: number; rx: number; ry: number; rz?: number; s?: number; children: React.ReactNode }> = ({ x = 960, y = 540, rx, ry, rz = 0, s = 1, children }) => (
  <div style={ab(x, y, { perspective: 1700, perspectiveOrigin: "50% 40%" })}>
    <div style={{ transformStyle: "preserve-3d", transform: `scale(${s}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)` }}>{children}</div>
  </div>
);
const Box: React.FC<{ w: number; h: number; d: number; c: string; top?: string; front?: React.ReactNode; z?: number; x?: number; y?: number; side?: string }> = ({ w, h, d, c, top, front, z = 0, x = 0, y = 0, side }) => {
  const f = (tr: string, ww: number, hh: number, bg: string, ch?: React.ReactNode) => <div style={{ position: "absolute", left: -ww / 2, top: -hh / 2, width: ww, height: hh, transform: tr, background: bg, overflow: "hidden" }}>{ch}</div>;
  return <div style={{ position: "absolute", transformStyle: "preserve-3d", transform: `translate3d(${x}px,${y}px,${z}px)` }}>
    {f(`translateZ(${d / 2}px)`, w, h, c, front)}
    {f(`rotateY(180deg) translateZ(${d / 2}px)`, w, h, c)}
    {f(`rotateY(90deg) translateZ(${w / 2}px)`, d, h, side ?? c)}
    {f(`rotateY(-90deg) translateZ(${w / 2}px)`, d, h, side ?? c)}
    {f(`rotateX(90deg) translateZ(${h / 2}px)`, w, d, top ?? c)}
    {f(`rotateX(-90deg) translateZ(${h / 2}px)`, w, d, side ?? c)}
  </div>;
};
// dedo índice dibujado, apuntando hacia abajo (la yema en x,y)
const Finger: React.FC<{ x: number; y: number; w?: number; rot?: number; c?: string }> = ({ x, y, w = 96, rot = 0, c = "linear-gradient(90deg,#b9845e,#dcaa82 45%,#b07a55)" }) => (
  <div style={ab(x - w / 2, y - 560, { width: w, height: 560, borderRadius: `${w / 2}px ${w / 2}px ${w / 2}px ${w / 2}px`, background: c, transform: `rotate(${rot}deg)`, transformOrigin: "50% 100%", boxShadow: "0 18px 30px rgba(0,0,0,.45)" })}>
    <div style={ab(w * 0.16, 530 - 62, { width: w * 0.68, height: 62, borderRadius: "40% 40% 50% 50%", background: "rgba(255,235,220,.55)", boxShadow: "inset 0 0 0 2px rgba(120,80,50,.3)" })} />
    <div style={ab(w * 0.1, 360, { width: w * 0.8, height: 5, background: "rgba(90,55,30,.35)", borderRadius: 3 })} />
    <div style={ab(w * 0.1, 376, { width: w * 0.8, height: 4, background: "rgba(90,55,30,.28)", borderRadius: 3 })} />
  </div>
);
// panel de botones de surtidor: 87 / 89 / 93
const PumpBtn: React.FC<{ x: number; y: number; n: string; lit: number; name: string; w?: number }> = ({ x, y, n, lit, name, w = 240 }) => (
  <div style={ab(x, y, { width: w, height: 330, borderRadius: 20, background: "linear-gradient(#2d3137,#16181b)", boxShadow: "0 24px 44px rgba(0,0,0,.55), inset 0 0 0 3px rgba(255,255,255,.12)" })}>
    <div style={{ ...txt(0, 34, 40, "#d8dee6"), width: w, textAlign: "center" }}>{name}</div>
    <div style={ab(w / 2 - 82, 92, { width: 164, height: 164, borderRadius: "50%", background: lit > 0.5 ? "radial-gradient(circle at 40% 35%,#ffe9a0,#e0a020)" : "radial-gradient(circle at 40% 35%,#8d949c,#3c4148)", boxShadow: `0 8px 0 #0a0b0c, 0 0 ${lit * 90}px rgba(255,200,80,${lit * 0.9})` })}>
      <div style={{ ...txt(0, 44, 76, lit > 0.5 ? "#2a1a05" : "#e9edf1"), width: 164, textAlign: "center" }}>{n}</div>
    </div>
    <div style={ab(w / 2 - 70, 284, { width: 140, height: 14, borderRadius: 7, background: lit > 0.5 ? "#ffc940" : "#3a3e44" })} />
  </div>
);

// 1 · el dedo cae solo sobre el 93 del surtidor
const Boton93: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#20262d">{(tt) => {
  const d = eio(tt, 0.8, 2.0), glow = cl((tt - 2.0) * 4);
  return <>
    <div style={ab(390, 300, { width: 1140, height: 470, borderRadius: 30, background: "linear-gradient(#b8bfc7,#858d96)", boxShadow: "0 40px 90px rgba(0,0,0,.6)" })} />
    <PumpBtn x={450} y={370} n="87" lit={0} name="REGULAR" />
    <PumpBtn x={840} y={370} n="89" lit={0} name="PLUS" />
    <PumpBtn x={1230} y={370} n="93" lit={glow} name="PREMIUM" />
    <div style={{ transform: `translateY(${(1 - d) * -520 - eio(tt, 3.1, 3.9) * 520}px)`, position: "absolute", inset: 0 }}><Finger x={1350} y={486 + (tt > 2.05 ? 7 : 0)} w={104} /></div>
    <Tag tt={tt} at={2.6} x={560} y={210} txt="BY HABIT" col={MZ} />
  </>;
}}</Stage>;

// 2 · tapa de combustible y cronómetro de 10 segundos
const Tapa10: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#1a2028">{(tt) => {
  const op = eio(tt, 0.6, 1.8), sec = Math.max(0, 10 - cl((tt - 1.2) / 3.2) * 10), a = 360 * (1 - sec / 10);
  return <>
    <div style={ab(250, 240, { width: 640, height: 600, borderRadius: 40, background: "linear-gradient(135deg,#8f2c2c,#561717)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 0 0 3px rgba(255,255,255,.1)" })}>
      <div style={ab(170, 150, { width: 300, height: 300, borderRadius: 28, background: "#111317", boxShadow: "inset 0 0 40px #000" })}>
        <div style={ab(90, 90, { width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#55595f,#14161a)", boxShadow: "0 0 0 8px #2b2e33" })} />
      </div>
      <div style={ab(170, 150, { width: 300, height: 300, borderRadius: 28, background: "linear-gradient(135deg,#a63636,#6c1d1d)", transformOrigin: "0% 50%", transform: `perspective(900px) rotateY(${-op * 118}deg)`, boxShadow: "inset 0 0 0 3px rgba(255,255,255,.14)" })} />
    </div>
    <div style={ab(1110, 250, { width: 560, height: 560, borderRadius: "50%", background: `conic-gradient(${MZ} ${a}deg, #2a2e34 ${a}deg)`, boxShadow: "0 30px 70px rgba(0,0,0,.6)" })}>
      <div style={ab(50, 50, { width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(#23272d,#101215)" })} />
      <div style={{ ...txt(0, 160, 220, TX), width: 560, textAlign: "center" }}>{Math.ceil(sec)}</div>
      <div style={{ ...txt(0, 400, 44, DIM), width: 560, textAlign: "center" }}>SECONDS</div>
    </div>
    <Tag tt={tt} at={3.8} x={960} y={150} txt="NO BOOK" col={MZ} />
  </>;
}}</Stage>;

// 3 · bandejas de carne con las palabras del surtidor
const Filetes: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#2a1c17">{(tt) => {
  const W = ["REGULAR", "PLUS", "PREMIUM", "ULTRA"];
  return <>
    {W.map((w, i) => { const k = phys(tt, 0.3 + i * 0.5, 8, 0.55), s = 0.86 + i * 0.1; return <div key={w} style={ab(130 + i * 430, 330 + (1 - k) * 300 - i * 20, { width: 380, height: 400, opacity: cl(k * 2), transform: `scale(${s})`, transformOrigin: "50% 100%" })}>
      <div style={ab(0, 90, { width: 380, height: 260, borderRadius: 34, background: "linear-gradient(#f7f5ef,#d8d3c6)", boxShadow: "0 26px 44px rgba(0,0,0,.55)" })} />
      <div style={ab(44, 120, { width: 292, height: 196, borderRadius: "48% 52% 46% 54%", background: "radial-gradient(ellipse at 40% 40%,#c8423a,#7c1f1e)", boxShadow: "inset 0 0 0 14px #ecd9c4, inset 0 0 40px rgba(0,0,0,.4)" })}>
        {Array.from({ length: 6 }, (_, j) => <div key={j} style={ab(30 + rnd(j + i) * 200, 30 + rnd(j * 3 + i) * 120, { width: 70, height: 7, borderRadius: 4, background: "rgba(245,225,205,.7)", transform: `rotate(${rnd(j) * 60}deg)` })} />)}
      </div>
      <div style={{ ...ab(60, 12, { width: 260, height: 74, borderRadius: 12, background: i > 1 ? OLIVE : "#fff", boxShadow: "0 8px 16px rgba(0,0,0,.4)" }) }}><div style={{ ...txt(0, 19, 40, "#1c1612"), width: 260, textAlign: "center" }}>{w}</div></div>
    </div>; })}
    <Tag tt={tt} at={2.8} x={960} y={170} txt="GOOD STEAK?" col={MZ} />
  </>;
}}</Stage>;

// 4 · la etiqueta amarilla del octanaje con la fórmula (R+M)/2
const Sticker: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#23211a">{(tt) => {
  const k = phys(tt, 0.3, 7, 0.5), R = eio(tt, 1.6, 2.5), Mo = eio(tt, 2.4, 3.3), av = eio(tt, 3.4, 4.2);
  return <>
    <div style={ab(250, 250, { width: 620, height: 620, background: "linear-gradient(#ffd93a,#eab408)", boxShadow: "0 40px 70px rgba(0,0,0,.55), inset 0 0 0 10px #15130c", transform: `rotate(${-5 + (1 - k) * 25}deg) scale(${k})` })}>
      <div style={{ ...txt(0, 50, 72, "#15130c"), width: 620, textAlign: "center" }}>MINIMUM</div>
      <div style={{ ...txt(0, 130, 72, "#15130c"), width: 620, textAlign: "center" }}>OCTANE</div>
      <div style={{ ...txt(0, 225, 250, "#15130c"), width: 620, textAlign: "center" }}>87</div>
      <div style={{ ...txt(0, 510, 58, "#15130c", 0.85), width: 620, textAlign: "center" }}>(R+M)/2</div>
    </div>
    <div style={{ ...txt(1000, 290, 74, TX, R) }}>RESEARCH <span style={{ color: MZ }}>91</span></div>
    <div style={{ ...txt(1000, 430, 74, TX, Mo) }}>MOTOR <span style={{ color: MZ }}>83</span></div>
    <div style={ab(1000, 560, { width: 720 * Mo, height: 8, background: TX })} />
    <div style={{ ...txt(1000, 600, 74, TX, av) }}>AVERAGE <span style={{ color: MZ, fontSize: 130 }}>87</span></div>
    <Tag tt={tt} at={4.4} x={1370} y={830} txt="A MEASURE" col={MZ} />
  </>;
}}</Stage>;

// 5 · una puerta alta no es mejor puerta
const Puertas: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1e2329">{(tt) => {
  const g = eio(tt, 0.6, 2.2), Dr: React.FC<{ x: number; H: number; l: string }> = ({ x, H: H2, l }) => <div style={ab(x, 850 - H2, { width: 300, height: H2, background: "linear-gradient(90deg,#7a5230,#5b3a20)", boxShadow: "0 0 0 14px #2e2a26, 0 30px 50px rgba(0,0,0,.5)" })}>
    <div style={ab(250, H2 * 0.5, { width: 26, height: 26, borderRadius: "50%", background: "#e5c76b" })} />
    <div style={{ ...txt(0, 34, 86, "#f5ead5"), width: 300, textAlign: "center" }}>{l}</div>
  </div>;
  const walk = eio(tt, 2.4, 4.0);
  return <>
    <Dr x={420} H={lerp(560, 560, g)} l="87" />
    <Dr x={1200} H={lerp(560, 760, g)} l="93" />
    <div style={ab(lerp(260, 505, walk), 850 - 400, { width: 130, height: 400 })}>
      <div style={ab(35, 0, { width: 60, height: 60, borderRadius: "50%", background: "#cfd4da" })} />
      <div style={ab(25, 62, { width: 80, height: 210, borderRadius: 26, background: "#cfd4da" })} />
      <div style={ab(30, 262, { width: 28, height: 138, borderRadius: 12, background: "#cfd4da" })} />
      <div style={ab(72, 262, { width: 28, height: 138, borderRadius: 12, background: "#cfd4da" })} />
    </div>
    <Tag tt={tt} at={3.8} x={960} y={190} txt="IF YOU FIT" col={MZ} />
  </>;
}}</Stage>;

// 6 · dos hombres aguantando la respiración: cada barra es el aire que le queda
const Aguante: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#172129">{(tt) => {
  const L1 = 1 - cl((tt - 0.6) / 2.4), L2 = 1 - cl((tt - 0.6) / 4.6);
  const Face: React.FC<{ x: number; l: number; n: string }> = ({ x, l, n }) => { const c = l > 0 ? `rgb(${lerp(226, 150, 1 - l)},${lerp(175, 60, 1 - l)},${lerp(140, 80, 1 - l)})` : "#d8a884", sw = 1 + (1 - l) * 0.16 * (l > 0 ? 1 : 0); return <div style={ab(x, 240, { width: 500, height: 620 })}>
    <div style={ab(100, 20, { width: 300, height: 380, borderRadius: "46% 46% 50% 50%", background: c, transform: `scaleX(${sw})`, boxShadow: "0 30px 50px rgba(0,0,0,.5)" })}>
      <div style={ab(70, 150, { width: 34, height: l > 0 ? 8 : 34, borderRadius: 20, background: "#222" })} />
      <div style={ab(196, 150, { width: 34, height: l > 0 ? 8 : 34, borderRadius: 20, background: "#222" })} />
      <div style={ab(105, 280, { width: 90, height: l > 0 ? 10 : 60, borderRadius: 40, background: "#3a1712" })} />
    </div>
    <div style={ab(40, 440, { width: 420, height: 58, borderRadius: 30, background: "#101215", boxShadow: "inset 0 0 0 4px rgba(255,255,255,.2)" })}><div style={ab(6, 6, { width: 408 * l, height: 46, borderRadius: 24, background: l > 0.3 ? VER : RED })} /></div>
    <div style={{ ...txt(0, 520, 90, TX), width: 500, textAlign: "center" }}>{n}</div>
  </div>; };
  return <><Face x={270} l={L1} n="87" /><Face x={1150} l={L2} n="93" /><Tag tt={tt} at={3.6} x={960} y={150} txt="JUST LONGER" col={MZ} /></>;
}}</Stage>;

// 7 · inflador 3D: el pistón baja y el termómetro del aire sube
const Inflador: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#231d18">{(tt) => {
  const pu = Math.abs(Math.sin(Math.max(0, tt - 0.6) * 2.0)), heat = cl((tt - 0.6) / 3.6);
  return <>
    <Scene x={700} y={590} rx={6} ry={-26} s={0.82}>
      <Box w={120} h={560} d={120} c={CHROME} side="linear-gradient(#b1b9c0,#6d757d)" top="#c8d0d7" y={40} />
      <Box w={34} h={320} d={34} c={CHROME} y={-250 + pu * 150} />
      <Box w={340} h={44} d={64} c="linear-gradient(#8a5a33,#5d3a1f)" y={-420 + pu * 150} />
      <Box w={260} h={30} d={200} c="#3c4047" y={320} />
    </Scene>
    <div style={ab(700 - 36, 395, { width: 72, height: 200, background: `radial-gradient(ellipse at 50% 100%, rgba(255,${lerp(190, 80, heat)},60,${heat * 0.9}), transparent 75%)`, mixBlendMode: "screen" })} />
    <div style={ab(1240, 230, { width: 120, height: 600, borderRadius: 60, background: "#191c20", boxShadow: "inset 0 0 0 5px rgba(255,255,255,.25)" })}>
      <div style={ab(26, 500 - 480 * heat + 26, { width: 68, height: 480 * heat + 48, borderRadius: 34, background: `linear-gradient(${RED},#ff8d5c)` })} />
    </div>
    <div style={{ ...txt(1400, 480, 96, heat > 0.6 ? RED : MZ) }}>{heat > 0.6 ? "HOT" : "WARM"}</div>
    <Tag tt={tt} at={3.2} x={1540} y={260} txt="SQUEEZE" col={TX} />
    <Tag tt={tt} at={3.8} x={1540} y={760} txt="= HEAT" col={RED} />
  </>;
}}</Stage>;

// corte de cilindro compartido por los dos componentes de combustión
const Cyl: React.FC<{ x: number; y: number; py: number; children?: React.ReactNode }> = ({ x, y, py, children }) => <div style={ab(x, y, { width: 640, height: 720 })}>
  <div style={ab(0, 0, { width: 56, height: 700, background: STEEL })} /><div style={ab(584, 0, { width: 56, height: 700, background: STEEL })} /><div style={ab(0, 0, { width: 640, height: 60, background: STEEL })} />
  <div style={ab(300, 16, { width: 40, height: 66, background: "linear-gradient(#e7ecf2,#7a828b)", borderRadius: "0 0 8px 8px" })} />
  <div style={ab(56, 60, { width: 528, height: py - 60, overflow: "hidden", background: "rgba(150,180,210,.12)" })}>{children}</div>
  <div style={ab(58, py, { width: 524, height: 150, borderRadius: "10px 10px 0 0", background: "linear-gradient(#b9c1c9,#6f7780)", boxShadow: "inset 0 0 0 3px rgba(255,255,255,.2)" })}>
    <div style={ab(0, 40, { width: 524, height: 8, background: "#50575f" })} /><div style={ab(0, 66, { width: 524, height: 8, background: "#50575f" })} />
  </div>
  <div style={ab(280, py + 150, { width: 80, height: 700 - py - 150, background: "linear-gradient(90deg,#5f666f,#a2aab2,#5f666f)" })} />
</div>;

// 8 · el frente de llama viaja parejo, como una ola
const Frente: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#14191f" mesa={false}>{(tt) => {
  const f = eio(tt, 1.0, 3.6), py = lerp(280, 470, f), sp = tt > 0.8 && tt < 1.1;
  return <>
    <Cyl x={200} y={180} py={py}>
      <div style={ab(264 - 760 * f, -760 * f + 0, { width: 1520 * f, height: 1520 * f, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,240,180,.9) 40%,rgba(255,140,40,.85) 66%,rgba(255,90,20,.0) 72%)" })} />
      {sp && <div style={ab(214, 0, { width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(#fff,rgba(120,180,255,0) 70%)" })} />}
    </Cyl>
    <div style={{ ...txt(1000, 300, 96, VER) }}>GOOD DAY</div>
    <div style={{ ...txt(1000, 430, 62, TX, cl((tt - 1) * 2)) }}>ONE SPARK</div>
    <div style={{ ...txt(1000, 520, 62, TX, cl((tt - 2) * 2)) }}>ONE FLAME</div>
    <div style={{ ...txt(1000, 610, 62, TX, cl((tt - 3) * 2)) }}>ONE PUSH</div>
  </>;
}}</Stage>;

// 9 · dos llamas chocan y golpean el pistón
const DosLlamas: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1e1311" mesa={false}>{(tt) => {
  const a = eio(tt, 0.5, 2.0), b = eio(tt, 1.3, 2.0), hit = tt > 2.0 ? Math.exp(-(tt - 2.0) * 5) : 0, sh = hit * 14 * Math.sin(tt * 90);
  return <div style={{ position: "absolute", inset: 0, transform: `translate(${sh}px,${-sh * 0.5}px)` }}>
    <Cyl x={200} y={180} py={420 + hit * 40}>
      <div style={ab(264 - 600 * a, -600 * a, { width: 1200 * a, height: 1200 * a, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,235,170,.9) 44%,rgba(255,130,40,.85) 68%,transparent 72%)" })} />
      <div style={ab(528 - 350 * b, 300 - 350 * b, { width: 700 * b, height: 700 * b, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,180,160,.95) 44%,rgba(235,40,40,.9) 68%,transparent 72%)" })} />
      {hit > 0.05 && <div style={ab(250, 220, { width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(rgba(255,255,255,${hit}),transparent 70%)` })} />}
    </Cyl>
    <div style={{ ...txt(1010, 300, 120, RED, cl((tt - 2.0) * 5)) }}>KNOCK</div>
    <div style={ab(1020, 470, { width: 720, height: 260 })}>
      <svg width={720} height={260}><polyline fill="none" stroke={MZ} strokeWidth={8} points={Array.from({ length: 90 }, (_, i) => { const x = i * 8, ts = i / 90 * 3; const v = tt - 2.0 > ts - 1 ? Math.exp(-Math.abs(ts - 1.2) * 4) * Math.sin(ts * 70) * 110 : 0; return `${x},${130 - v}`; }).join(" ")} /></svg>
    </div>
    <Tag tt={tt} at={2.5} x={1400} y={820} txt="LIKE A HAMMER" col={MZ} />
  </div>;
}}</Stage>;

// 10 · lata 3D de canicas que tiembla, con la onda del ruido
const Canicas: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#201c16">{(tt) => {
  const s = tt > 0.7 ? Math.sin(tt * 38) * 11 * cl(tt - 0.7) : 0;
  return <>
    <div style={ab(330, 300, { width: 420, height: 500, transform: `rotate(${s * 0.5}deg) translateX(${s}px)`, transformOrigin: "50% 100%" })}>
      <div style={ab(0, 60, { width: 420, height: 440, background: "linear-gradient(90deg,#7d8389,#dde2e6 30%,#8f959b 60%,#c9ced3 85%,#6d7379)", borderRadius: "10px 10px 26px 26px", boxShadow: "0 30px 56px rgba(0,0,0,.6)" })}>
        {[70, 150, 300, 370].map((y) => <div key={y} style={ab(0, y, { width: 420, height: 10, background: "rgba(0,0,0,.2)" })} />)}
      </div>
      <div style={ab(0, 8, { width: 420, height: 104, borderRadius: "50%", background: "radial-gradient(ellipse,#2c2f33 55%,#aeb4ba 62%,#71777d)" })} />
      {Array.from({ length: 11 }, (_, i) => { const j = Math.sin(tt * (34 + i * 3) + i) * cl(tt - 0.7); return <div key={i} style={ab(90 + (i * 57) % 230 + j * 6, 26 + (i * 31) % 50 - Math.abs(j) * 24, { width: 44, height: 44, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%,#fff,hsl(${(i * 67) % 360} 80% 50%))` })} />; })}
    </div>
    <svg width={760} height={400} style={ab(950, 340, {})}>{Array.from({ length: 34 }, (_, i) => { const v = 20 + Math.abs(Math.sin(tt * 18 + i * 1.7) * Math.sin(i * 0.8)) * 170 * cl(tt - 0.7); return <rect key={i} x={i * 22} y={200 - v} width={13} height={v * 2} rx={6} fill={MZ} />; })}</svg>
    <Tag tt={tt} at={2.4} x={1330} y={230} txt="MARBLES" col={MZ} />
  </>;
}}</Stage>;

// 11 · ventilador de turbo girando y aguja de presión
const Turbo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#16202a">{(tt) => {
  const sp = Math.pow(cl(tt / 3.2), 2) * 1500 * Math.max(0.1, tt), p = eio(tt, 0.8, 3.4);
  return <>
    <div style={ab(250, 210, { width: 620, height: 620, borderRadius: "50%", background: "conic-gradient(#646c75,#b5bcc3,#585f68,#c3c9cf,#646c75)", boxShadow: "0 40px 70px rgba(0,0,0,.6)" })}>
      <div style={ab(60, 60, { width: 500, height: 500, borderRadius: "50%", background: "#0f1215" })} />
      <div style={ab(310, 310, { transform: `rotate(${sp}deg)` })}>{Array.from({ length: 11 }, (_, i) => <div key={i} style={ab(-30, -230, { width: 60, height: 230, background: "linear-gradient(#e4e9ee,#7c848c)", borderRadius: "60% 20% 10% 10%", transformOrigin: "50% 100%", transform: `rotate(${i * 32.7}deg) skewX(-14deg)` })} />)}</div>
      <div style={ab(262, 262, { width: 96, height: 96, borderRadius: "50%", background: "radial-gradient(#dfe5ea,#5a6168)" })} />
    </div>
    <div style={ab(1090, 260, { width: 540, height: 540, borderRadius: "50%", background: "radial-gradient(#f7f3e6,#ddd5bf)", boxShadow: "0 30px 60px rgba(0,0,0,.6), 0 0 0 16px #363b41" })}>
      {Array.from({ length: 11 }, (_, i) => <div key={i} style={ab(266, 18, { width: 8, height: 44, background: i > 7 ? RED : "#222", transformOrigin: "4px 252px", transform: `rotate(${-125 + i * 25}deg)` })} />)}
      <div style={ab(262, 60, { width: 16, height: 210, background: RED, transformOrigin: "8px 210px", borderRadius: 8, transform: `rotate(${-125 + p * 225}deg)` })} />
      <div style={ab(235, 235, { width: 70, height: 70, borderRadius: "50%", background: "#26292e" })} />
      <div style={{ ...txt(0, 380, 56, "#26292e"), width: 540, textAlign: "center" }}>BOOST</div>
    </div>
    <Tag tt={tt} at={3.4} x={960} y={150} txt="EXTRA AIR" col={MZ} />
  </>;
}}</Stage>;

// 12 · extintor dentro de una pileta
const Extintor: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#0f2630" mesa={false}>{(tt) => {
  const sink = eio(tt, 0.5, 2.6), wy = 480;
  return <>
    <div style={ab(790, 180 + sink * 220, { width: 340, height: 640 })}>
      <div style={ab(40, 130, { width: 260, height: 510, borderRadius: "44% 44% 20px 20px / 18% 18% 20px 20px", background: "linear-gradient(90deg,#8d1414,#e23a2d 38%,#a81c1c)" })}>
        <div style={ab(40, 200, { width: 180, height: 170, borderRadius: 10, background: "#f4efe3" })}><div style={{ ...txt(0, 26, 58, RED), width: 180, textAlign: "center" }}>$</div><div style={{ ...txt(0, 100, 44, "#222"), width: 180, textAlign: "center" }}>93</div></div>
      </div>
      <div style={ab(130, 56, { width: 84, height: 90, background: "#262a30", borderRadius: 8 })} />
      <div style={ab(40, 20, { width: 240, height: 34, background: "#262a30", borderRadius: 8, transform: "rotate(-8deg)" })} />
    </div>
    <div style={ab(-20, wy, { width: 1960, height: 640, background: "linear-gradient(rgba(60,190,225,.34),rgba(10,90,130,.55))", boxShadow: "inset 0 10px 0 rgba(255,255,255,.4)" })} />
    {Array.from({ length: 9 }, (_, i) => { const y = wy + 500 - ((tt * 120 + i * 77) % 480); return <div key={i} style={ab(830 + (i * 29) % 240, y, { width: 18 + i % 3 * 8, height: 18 + i % 3 * 8, borderRadius: "50%", boxShadow: "inset 0 0 0 3px rgba(255,255,255,.75)" })} />; })}
    <Tag tt={tt} at={2.6} x={400} y={230} txt="NO FIRE" col={MZ} />
    <Tag tt={tt} at={3.2} x={1500} y={230} txt="YOU PAID" col={RED} />
  </>;
}}</Stage>;

// 13 · el sensor de golpeteo es un micrófono: oye y atrasa la chispa
const Micro: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#191f24">{(tt) => {
  const kn = tt > 1.6 && tt < 2.8 ? 1 : 0, fix = eio(tt, 2.8, 3.5);
  return <>
    <div style={ab(170, 280, { width: 640, height: 480, borderRadius: 22, background: "linear-gradient(135deg,#6a7078,#3a3f45)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" })}>
      {Array.from({ length: 4 }, (_, i) => <div key={i} style={ab(60 + i * 140, 60, { width: 96, height: 150, borderRadius: 48, background: "#24282d", boxShadow: "inset 0 -20px 30px rgba(0,0,0,.6)" })} />)}
      <div style={ab(500, 320, { width: 150, height: 110, borderRadius: 18, background: "linear-gradient(#e9c24b,#a57b18)", boxShadow: `0 0 ${kn * 70}px ${MZ}` })}>
        {[0, 1, 2].map((i) => <div key={i} style={ab(22 + i * 40, 26, { width: 20, height: 60, borderRadius: 10, background: "#3a2c08" })} />)}
      </div>
    </div>
    {[0, 1, 2].map((i) => { const r = ((tt * 1.8 + i * 0.33) % 1); return kn ? <div key={i} style={ab(725 - r * 220, 655 - r * 220, { width: r * 440, height: r * 440, borderRadius: "50%", boxShadow: `inset 0 0 0 5px rgba(240,200,80,${1 - r})` })} /> : null; })}
    <div style={ab(1030, 310, { width: 720, height: 420, borderRadius: 26, background: "#0d1012", boxShadow: "inset 0 0 0 4px rgba(255,255,255,.2)" })}>
      <div style={{ ...txt(40, 40, 58, DIM) }}>SPARK TIMING</div>
      <div style={ab(360 - lerp(0, 150, fix) * (kn || fix ? 1 : 0), 150, { width: 12, height: 190, background: fix > 0.4 ? VER : RED, borderRadius: 6 })} />
      <div style={ab(40, 340, { width: 640, height: 6, background: "rgba(255,255,255,.3)" })} />
    </div>
    <Tag tt={tt} at={1.6} x={1390} y={220} txt="LISTENING" col={MZ} />
    <Tag tt={tt} at={3.5} x={1390} y={830} txt="KNOCK GONE" col={VER} />
  </>;
}}</Stage>;

// 14 · el plomo: casillero Pb que se apaga de 1923 a 1996
const Plomo: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#20201c">{(tt) => {
  const p = eio(tt, 0.8, 4.2), Y = Math.round(lerp(1923, 1996, p));
  return <>
    <div style={ab(300, 240, { width: 500, height: 560, borderRadius: 16, background: `rgba(${lerp(150, 44, p)},${lerp(160, 46, p)},${lerp(175, 50, p)},1)`, boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 0 0 6px rgba(255,255,255,.25)" })}>
      <div style={{ ...txt(36, 30, 64, "#fff", 1 - p * 0.6) }}>82</div>
      <div style={{ ...txt(0, 150, 260, "#fff", 1 - p * 0.75), width: 500, textAlign: "center" }}>Pb</div>
      <div style={{ ...txt(0, 450, 66, "#fff", 1 - p * 0.6), width: 500, textAlign: "center" }}>LEAD</div>
      {p > 0.92 && <svg width={500} height={560} style={ab(0, 0, {})}><line x1={30} y1={30} x2={470} y2={530} stroke={RED} strokeWidth={26} strokeLinecap="round" /></svg>}
    </div>
    <div style={ab(960, 700, { width: 780, height: 12, background: "rgba(255,255,255,.3)", borderRadius: 6 })}><div style={ab(0, 0, { width: 780 * p, height: 12, background: MZ, borderRadius: 6 })} /></div>
    <div style={{ ...txt(960, 330, 240, MZ) }}>{Y}</div>
    <div style={{ ...txt(960, 740, 60, TX, cl(1.4 - p * 1.6)) }}>CHEAP OCTANE</div>
    <div style={{ ...txt(960, 740, 60, VER, cl((p - 0.9) * 10)) }}>GONE FROM THE ROAD</div>
  </>;
}}</Stage>;

// 15 · surtidor antiguo «HIGH-TEST» con números de rodillo
const HighTest: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#2a1a14">{(tt) => {
  const v = eio(tt, 0.5, 4), g = v * 14.8;
  const Roll: React.FC<{ x: number; d: number }> = ({ x, d }) => <div style={ab(x, 0, { width: 62, height: 100, overflow: "hidden", background: "#f3ecdb", boxShadow: "inset 0 10px 14px rgba(0,0,0,.4), inset 0 -10px 14px rgba(0,0,0,.4)" })}><div style={{ transform: `translateY(${-(d % 10) * 100}px)` }}>{Array.from({ length: 11 }, (_, i) => <div key={i} style={{ height: 100, textAlign: "center", fontFamily: M, fontWeight: 900, fontSize: 80, lineHeight: "100px", color: "#222" }}>{i % 10}</div>)}</div></div>;
  return <>
    <div style={ab(600, 130, { width: 720, height: 780, borderRadius: "130px 130px 18px 18px", background: "linear-gradient(90deg,#8f1414,#d7392b 40%,#8c1313)", boxShadow: "0 40px 80px rgba(0,0,0,.65)" })}>
      <div style={ab(150, 34, { width: 420, height: 150, borderRadius: "50%", background: "radial-gradient(#fdf8e6,#d9cda6)", boxShadow: "0 0 0 10px #e6c86a" })}><div style={{ ...txt(0, 44, 66, "#8f1414"), width: 420, textAlign: "center" }}>HIGH-TEST</div></div>
      <div style={ab(150, 260, { width: 420, height: 170, borderRadius: 12, background: "#111", padding: 0 })}><div style={ab(70, 34, { width: 280, height: 100 })}><Roll x={0} d={Math.floor(g / 10)} /><Roll x={72} d={g % 10} /><Roll x={144} d={(g * 10) % 10} /></div></div>
      <div style={ab(285, 480, { width: 150, height: 150, borderRadius: "50%", background: "#222", boxShadow: "inset 0 0 0 10px #e6c86a" })}><div style={ab(70, 10, { width: 10, height: 66, background: "#e6c86a", transformOrigin: "5px 66px", transform: `rotate(${tt * 300}deg)` })} /></div>
    </div>
    <Tag tt={tt} at={2.4} x={320} y={500} txt="NO SENSORS" col={MZ} />
    <Tag tt={tt} at={3.2} x={1600} y={500} txt="HE WAS" col={TX} />
    <Tag tt={tt} at={3.7} x={1600} y={590} txt="RIGHT" col={VER} />
  </>;
}}</Stage>;

// 16 · catalizador: panal cerámico que el plomo tapa
const Cataliza: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1c1d1a">{(tt) => {
  const N = 72, p = eio(tt, 1.8, 3.8);
  return <>
    <div style={ab(330, 210, { width: 780, height: 620, borderRadius: "90px", background: "linear-gradient(#a0a6ad,#5a6168)", boxShadow: "0 40px 70px rgba(0,0,0,.6)" })}>
      <div style={ab(60, 50, { width: 660, height: 520, borderRadius: 60, background: "#e6dfca", display: "flex", flexWrap: "wrap", padding: 14, gap: 6, overflow: "hidden" })}>
        {Array.from({ length: N }, (_, i) => <div key={i} style={{ width: 62, height: 62, background: rnd(i) < p ? "#27272b" : "#7e5b3a", borderRadius: 4 }} />)}
      </div>
    </div>
    <div style={{ ...txt(1190, 340, 110, MZ) }}>1975</div>
    <div style={{ ...txt(1190, 480, 62, TX, cl(tt - 1)) }}>CATALYTIC</div>
    <div style={{ ...txt(1190, 560, 62, TX, cl(tt - 1)) }}>CONVERTER</div>
    <div style={{ ...txt(1190, 680, 62, RED, p) }}>LEAD KILLS IT</div>
  </>;
}}</Stage>;

// 17 · el dedo de tres generaciones sobre el mismo botón
const TresDedos: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#22262b">{(tt) => {
  const L = [["FATHER", "#a97b5a", 1950], ["SON", "#c4936f", 1985], ["GRANDSON", "#ddae8b", 2025]] as const;
  return <>
    {L.map(([n, col, y], i) => { const a = 0.4 + i * 1.1, d = eio(tt, a, a + 0.7), x = 370 + i * 590; return <React.Fragment key={n}>
      <PumpBtn x={x - 120} y={420} n="93" lit={cl((tt - a - 0.7) * 5)} name={String(y)} />
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - d) * -560}px)` }}><Finger x={x} y={532} w={lerp(116, 82, i / 2)} c={`linear-gradient(90deg,${col},#f1d3ba 45%,${col})`} /></div>
      <div style={{ ...txt(x - 300, 800, 62, TX, cl((tt - a - 0.6) * 4)), width: 600, textAlign: "center" }}>{n}</div>
    </React.Fragment>; })}
  </>;
}}</Stage>;

// servilleta de papel común a las cuentas
const Napkin: React.FC<{ x: number; y: number; w: number; hh: number; rot?: number; children: React.ReactNode }> = ({ x, y, w, hh, rot = -2, children }) => <div style={ab(x, y, { width: w, height: hh, background: "linear-gradient(135deg,#fbf7ee,#e8e0cf)", transform: `rotate(${rot}deg)`, boxShadow: "0 30px 60px rgba(0,0,0,.55)", clipPath: "polygon(0 1.4%,12% 0,26% 1.2%,44% 0,60% 1.4%,78% 0,100% 1%,99% 22%,100% 48%,99% 74%,100% 100%,76% 98.8%,52% 100%,30% 98.6%,10% 100%,0 98%,1% 70%,0 42%,1% 20%)" })}>{children}</div>;
const Pen: React.FC<{ x: number; y: number; s: number; c?: string; o?: number; children: React.ReactNode }> = ({ x, y, s, c = "#2b2f3a", o = 1, children }) => <div style={{ ...txt(x, y, s, c, o, HAND), fontWeight: 700 }}>{children}</div>;
const Reveal: React.FC<{ k: number; children: React.ReactNode }> = ({ k, children }) => <div style={{ position: "absolute", inset: 0, clipPath: `inset(-20px ${(1 - k) * 100}% -20px -20px)` }}>{children}</div>;

// 18 · la división: millas entre mpg = galones
const Division: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#2a2118">{(tt) => {
  const a = eio(tt, 0.4, 1.3), b = eio(tt, 1.6, 2.5), c = eio(tt, 3.0, 3.9);
  return <Napkin x={420} y={210} w={1080} hh={660}>
    <Reveal k={a}><Pen x={90} y={70} s={120}>9,000 miles</Pen></Reveal>
    <Reveal k={b}><Pen x={90} y={230} s={120}>÷ 22 mpg</Pen></Reveal>
    <div style={ab(90, 382, { width: 800 * b, height: 8, background: "#2b2f3a" })} />
    <Reveal k={c}><Pen x={90} y={420} s={170} c="#b42318">≈ 400 gallons</Pen></Reveal>
  </Napkin>;
}}</Stage>;

// 19 · la cuenta entera en la servilleta: 1000 + 2400 = 3400 (dura todo el tramo de la cuenta)
const Servilleta: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#2a2118" cam={0.5}>{(tt0) => {
  const tt = t - h.at, A = h.q?.a ?? [0.3, 5.0, 10.3, 15.2];
  const k = (i: number) => eio(tt, A[i], A[i] + 1.1), tot = Math.round(lerp(0, 3400, eio(tt, A[3] + 0.9, A[3] + 2.4)));
  return <Napkin x={330} y={120} w={1260} hh={840} rot={1.5}>
    <Reveal k={k(0)}><Pen x={80} y={60} s={92}>400 gal × $0.25 = $100 a year</Pen></Reveal>
    <Reveal k={k(1)}><Pen x={80} y={180} s={92}>× 10 years = <span style={{ color: "#b42318" }}>$1,000</span></Pen></Reveal>
    <Reveal k={k(2)}><Pen x={80} y={320} s={92}>400 gal × $0.60 = $240 a year</Pen></Reveal>
    <Reveal k={k(2)}><Pen x={80} y={440} s={92}>× 10 years = <span style={{ color: "#b42318" }}>$2,400</span></Pen></Reveal>
    <div style={ab(80, 576, { width: 1040 * k(3), height: 8, background: "#2b2f3a" })} />
    <Pen x={80} y={606} s={196} c="#b42318" o={cl((tt - A[3] - 0.9) * 4)}>${tot.toLocaleString("en-US")}</Pen>
    <Pen x={800} y={680} s={66} o={cl((tt - A[3] - 2.2) * 3)}>round numbers</Pen>
  </Napkin>;
}}</Stage>;

// 20 · el techo: las tejas se colocan al ritmo del dinero
const Techo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#1a2028">{(tt) => {
  const N = 28, p = eio(tt, 0.4, 3.0);
  return <>
    <div style={ab(600, 560, { width: 720, height: 340, background: "linear-gradient(#e8dcc2,#c9b995)", boxShadow: "0 30px 50px rgba(0,0,0,.55)" })}>
      <div style={ab(300, 140, { width: 120, height: 200, background: "#6b4427" })} /><div style={ab(70, 90, { width: 130, height: 120, background: "#92b6c8", boxShadow: "inset 0 0 0 8px #fff" })} /><div style={ab(520, 90, { width: 130, height: 120, background: "#92b6c8", boxShadow: "inset 0 0 0 8px #fff" })} />
    </div>
    <div style={ab(520, 230, { width: 880, height: 340, clipPath: "polygon(50% 0,100% 100%,0 100%)", background: "#3a3f46", display: "flex", flexWrap: "wrap", alignContent: "flex-start" })}>
      {Array.from({ length: N * 4 }, (_, i) => <div key={i} style={{ width: 110, height: 42, boxSizing: "border-box", border: "2px solid #2a1e16", background: i / (N * 4) < p ? (i % 3 ? "#8c4b2c" : "#74381f") : "transparent", marginLeft: i % 8 === 0 && Math.floor(i / 8) % 2 ? -55 : 0 }} />)}
    </div>
    <div style={{ ...txt(0, 90, 150, MZ), width: 1920, textAlign: "center" }}>$3,400</div>
    <Tag tt={tt} at={3.2} x={1600} y={720} txt="THE ROOF" col={TX} />
  </>;
}}</Stage>;

// 21 · la fórmula en una nota de imán sobre la heladera
const Heladera: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#20262b" mesa={false}>{(tt) => {
  const R: [string, string][] = [["MILES A YEAR", "÷"], ["YOUR MPG", "="], ["GALLONS", "×"], ["PRICE GAP", "="]];
  const k = phys(tt, 0.3, 7, 0.55);
  return <>
    <div style={ab(330, 60, { width: 1260, height: 1000, borderRadius: 40, background: "linear-gradient(100deg,#d9dde1,#f4f6f8 45%,#c7ccd1)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" })}><div style={ab(1190, 340, { width: 34, height: 380, borderRadius: 16, background: CHROME })} /></div>
    <div style={ab(560, 130, { width: 800, height: 820, background: "#fffbea", transform: `rotate(${-2 + (1 - k) * 18}deg) translateY(${(1 - k) * -300}px)`, boxShadow: "0 22px 40px rgba(0,0,0,.4)" })}>
      <div style={ab(360, -34, { width: 76, height: 76, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ff9a8a,#b42318)" })} />
      {R.map(([a, b], i) => <div key={a} style={{ opacity: cl((tt - 0.8 - i * 0.65) * 3) }}><Pen x={70} y={70 + i * 145} s={96}>{a}</Pen><Pen x={690} y={70 + i * 145} s={96} c="#b42318">{b}</Pen></div>)}
      <div style={{ opacity: cl((tt - 3.6) * 3) }}><Pen x={70} y={640} s={136} c="#b42318">YOUR $ A YEAR</Pen></div>
    </div>
  </>;
}}</Stage>;

// 22 · la pila de billones que sube con el contador de conductores
const Billon: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#16221b">{(tt) => {
  const p = eio(tt, 0.4, 3.4), N = Math.round(p * 26);
  return <>
    <Scene x={560} y={720} rx={58} ry={0} rz={-32} s={1.1}>
      {Array.from({ length: N }, (_, i) => <Box key={i} w={330} h={150} d={22} c="linear-gradient(#5a8a60,#2f5d3a)" top="#6f9c74" z={i * 24} front={<div />} />)}
    </Scene>
    <div style={{ ...txt(980, 300, 170, MZ) }}>${(2.1 * p).toFixed(1)}B</div>
    <div style={{ ...txt(980, 490, 62, TX, cl(p * 3 - 1)) }}>ONE YEAR · AAA 2016</div>
    <div style={{ ...txt(980, 600, 98, TX) }}>{(16.5 * p).toFixed(1)}M</div>
    <div style={{ ...txt(980, 720, 62, TX, cl(p * 3 - 1)) }}>DRIVERS</div>
  </>;
}}</Stage>;

// 23 · dinamómetro: rodillos y dos curvas que se pisan
const Dyno: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#191c22">{(tt) => {
  const p = eio(tt, 0.8, 3.6), W = 760, curve = (o: number) => Array.from({ length: 80 }, (_, i) => { const x = i / 79 * p; return `${x * W},${380 - (Math.sin(x * 2.4) * 300 + o)}`; }).join(" ");
  return <>
    {[0, 1].map((i) => <div key={i} style={ab(190 + i * 330, 440, { width: 300, height: 300, borderRadius: "50%", background: "conic-gradient(#7d858d,#e0e5ea,#7d858d,#d0d6db,#7d858d)", transform: `rotate(${tt * 340}deg)`, boxShadow: "0 30px 50px rgba(0,0,0,.6)" })}><div style={ab(120, 120, { width: 60, height: 60, borderRadius: "50%", background: "#26292e" })} /></div>)}
    <div style={ab(910, 250, { width: 840, height: 500, borderRadius: 22, background: "#0d1012", boxShadow: "inset 0 0 0 4px rgba(255,255,255,.2)" })}>
      <svg width={840} height={500} style={ab(40, 50, {})}><polyline fill="none" stroke={VER} strokeWidth={13} points={curve(0)} /><polyline fill="none" stroke={MZ} strokeWidth={5} strokeDasharray="20 14" points={curve(2)} /></svg>
      <div style={{ ...txt(48, 30, 58, VER) }}>87</div><div style={{ ...txt(170, 30, 58, MZ) }}>93</div>
    </div>
    <Tag tt={tt} at={3.8} x={1330} y={850} txt="SAME CURVE" col={MZ} />
  </>;
}}</Stage>;

// 24 · la cuenta del 27 %: tendría que dar 25 → 32 mpg
const Veintisiete: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#20211c">{(tt) => {
  const a = eio(tt, 0.4, 1.4), b = eio(tt, 2.2, 3.4), m = lerp(25, 32, b);
  return <>
    <Napkin x={160} y={220} w={800} hh={620}><Reveal k={a}><Pen x={70} y={60} s={110}>$0.80</Pen><Pen x={70} y={190} s={110}>÷ $3.00</Pen></Reveal><div style={ab(70, 330, { width: 620 * a, height: 8, background: "#2b2f3a" })} /><div style={{ opacity: cl((tt - 1.4) * 4) }}><Pen x={70} y={360} s={190} c="#b42318">27% more</Pen></div></Napkin>
    <div style={ab(1090, 230, { width: 660, height: 600, borderRadius: 26, background: "#0d1012", boxShadow: "inset 0 0 0 4px rgba(255,255,255,.2)" })}>
      <div style={{ ...txt(0, 40, 62, DIM), width: 660, textAlign: "center" }}>TO PAY FOR ITSELF</div>
      <div style={{ ...txt(0, 160, 240, MZ), width: 660, textAlign: "center" }}>{Math.round(m)}</div>
      <div style={{ ...txt(0, 430, 66, TX), width: 660, textAlign: "center" }}>MILES PER GALLON</div>
    </div>
  </>;
}}</Stage>;

// 25 · el cuaderno verde de tanques
const Verde: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1a241c">{(tt) => {
  const N = 10, p = cl((tt - 0.5) / 3.2);
  return <div style={ab(330, 140, { width: 1260, height: 780, borderRadius: 18, background: "#1f5a3a", boxShadow: "0 40px 70px rgba(0,0,0,.6)", transform: "rotate(-1.5deg)" })}>
    <div style={ab(30, 26, { width: 1200, height: 728, background: "repeating-linear-gradient(#f7f3df 0 70px,#8fb1c6 70px 72px)" })}>
      <Pen x={40} y={10} s={70} c="#1f5a3a">Tank log — F-150</Pen>
      {Array.from({ length: N }, (_, i) => { const on = (i + 1) / N <= p, x0 = 70 + (i % 2) * 560, y0 = 100 + Math.floor(i / 2) * 118; return <div key={i} style={{ opacity: on ? 1 : 0 }}><Pen x={x0} y={y0} s={70}>tank {i + 1}</Pen><svg width={340} height={80} style={ab(x0 + 210, y0, {})}><path d={`M6 ${40 + rnd(i) * 18} Q 60 ${16 + rnd(i + 1) * 30} 120 ${38 + rnd(i + 2) * 18} T 240 ${34 + rnd(i + 3) * 20} T 330 ${42 + rnd(i + 4) * 14}`} fill="none" stroke="#2b2f3a" strokeWidth={6} strokeLinecap="round" /></svg></div>; })}
    </div>
    <Tag tt={tt} at={3.8} x={620} y={690} txt="NO DIFFERENCE" col={RED} />
  </div>;
}}</Stage>;

// 26 · costra negra que crece en el inyector
const Costra: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#1a1a1c">{(tt) => {
  const c = eio(tt, 0.6, 3.6);
  return <>
    <div style={ab(800, 90, { width: 320, height: 620, background: "linear-gradient(90deg,#60676f,#d9dfe5 40%,#646b73)", borderRadius: "30px 30px 12px 12px", boxShadow: "0 30px 50px rgba(0,0,0,.6)" })} />
    <div style={ab(900, 700, { width: 120, height: 100, background: "linear-gradient(90deg,#5a6168,#c8cfd5,#5a6168)", clipPath: "polygon(0 0,100% 0,72% 100%,28% 100%)" })} />
    {Array.from({ length: 34 }, (_, i) => { const s = (rnd(i) * 0.5 + 0.5) * c, a = rnd(i + 9) * 6.28; return <div key={i} style={ab(960 + Math.cos(a) * 66 - 30 * s, 770 + Math.sin(a) * 46 - 30 * s, { width: 90 * s, height: 70 * s, borderRadius: "46% 54% 50% 50%", background: "radial-gradient(circle at 40% 30%,#3a342e,#0a0908)" })} />; })}
    {Array.from({ length: 22 }, (_, i) => { const y = ((tt * 340 + i * 53) % 260); const o = 1 - c * 0.85; return <div key={i} style={ab(960 + (rnd(i) - 0.5) * (y * 1.4) * o, 800 + y, { width: 12, height: 12, borderRadius: "50%", background: "#d9b35a", opacity: o })} />; })}
    <Tag tt={tt} at={3} x={380} y={460} txt="DEPOSITS" col={RED} />
    <Tag tt={tt} at={3.5} x={1540} y={460} txt="LESS SPRAY" col={MZ} />
  </>;
}}</Stage>;

// 27 · 1995: el mismo jabón cae en todos los grados
const Jabon: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#172028">{(tt) => {
  const G = ["87", "89", "93"];
  return <>
    <div style={{ ...txt(0, 100, 130, MZ), width: 1920, textAlign: "center" }}>SINCE 1995</div>
    <div style={ab(260, 280, { width: 1400, height: 80, borderRadius: 40, background: CHROME, boxShadow: "0 14px 30px rgba(0,0,0,.5)" })} />
    {G.map((g, i) => { const x = 370 + i * 480, lv = cl((tt - 0.7) / 3); return <React.Fragment key={g}>
      <div style={ab(x + 80, 360, { width: 40, height: 60, background: "#6b737c" })} />
      {Array.from({ length: 6 }, (_, j) => { const y = (tt * 300 + j * 62) % 280; return <div key={j} style={ab(x + 90, 420 + y, { width: 24, height: 34, borderRadius: "50% 50% 50% 50% / 62% 62% 40% 40%", background: "#79d8ee", opacity: tt > 0.7 ? 0.95 : 0 })} />; })}
      <div style={ab(x - 30, 610, { width: 260, height: 300, borderRadius: "16px 16px 28px 28px", background: "rgba(255,255,255,.14)", boxShadow: "inset 0 0 0 5px rgba(255,255,255,.5)", overflow: "hidden" })}>
        <div style={ab(0, 300 - 280 * lv, { width: 260, height: 300, background: "linear-gradient(#e8c257,#a97716)" })} />
        <div style={{ ...txt(0, 104, 106, TX), width: 260, textAlign: "center" }}>{g}</div>
      </div>
    </React.Fragment>; })}
  </>;
}}</Stage>;

// 28 · 19 discos negros contra 1
const Diecinueve: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#1c1c1e">{(tt) => {
  const n = Math.min(19, Math.round(cl((tt - 0.6) / 2.6) * 19));
  const Disc: React.FC<{ x: number; y: number; on: boolean; c: string }> = ({ x, y, on, c }) => <div style={ab(x, y, { width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle at 36% 30%,#55504a,${c})`, transform: `scale(${on ? 1 : 0})`, boxShadow: "0 12px 20px rgba(0,0,0,.6)" })} />;
  return <>
    <Disc x={270} y={420} on={tt > 0.3} c="#141210" />
    <div style={{ ...txt(170, 590, 62, VER), width: 320, textAlign: "center" }}>TOP TIER</div>
    <div style={ab(600, 240, { width: 1180, height: 620 })}>{Array.from({ length: 19 }, (_, i) => <Disc key={i} x={(i % 7) * 165} y={Math.floor(i / 7) * 165} on={i < n} c="#141210" />)}</div>
    <div style={{ ...txt(600, 740, 130, RED, cl((tt - 3.2) * 4)) }}>× 19</div>
    <div style={{ ...txt(980, 780, 58, TX, cl((tt - 3.6) * 4)) }}>IN AAA'S LAB</div>
  </>;
}}</Stage>;

// 29 · la almohada tapa el ruido: la onda sigue, pero no se oye
const Almohada: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#20201e">{(tt) => {
  const d = phys(tt, 1.8, 7, 0.6), pa = cl(d);
  return <>
    <div style={ab(320, 340, { width: 540, height: 420, borderRadius: 26, background: "linear-gradient(135deg,#6a7078,#343940)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", transform: `translateX(${Math.sin(tt * 40) * 4}px)` })}>
      {Array.from({ length: 3 }, (_, i) => <div key={i} style={ab(50 + i * 160, 50, { width: 120, height: 180, borderRadius: 60, background: "#23272c" })} />)}
    </div>
    <div style={ab(250, 290 - (1 - d) * 560, { width: 680, height: 330, borderRadius: "46% 54% 40% 48% / 60%", background: "radial-gradient(ellipse at 42% 35%,#fdfbf6,#d7d0c0)", boxShadow: "0 30px 40px rgba(0,0,0,.45)", opacity: cl(tt - 1.4) })} />
    <svg width={760} height={400} style={ab(1010, 340, {})}>{Array.from({ length: 34 }, (_, i) => { const v = (20 + Math.abs(Math.sin(tt * 16 + i * 1.5)) * 170) * (1 - pa * 0.92); return <rect key={i} x={i * 22} y={200 - v} width={13} height={v * 2} rx={6} fill={pa > 0.5 ? "#616870" : RED} />; })}</svg>
    <Tag tt={tt} at={2.5} x={1390} y={260} txt="NOT A FIX" col={MZ} />
  </>;
}}</Stage>;

// 30 · pasaje EGR tapado que se destapa
const Egr: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#191b1f" mesa={false}>{(tt) => {
  const cl2 = eio(tt, 2.3, 3.4), L = 1500;
  return <>
    <div style={ab(210, 420, { width: L, height: 240, borderRadius: 40, background: "linear-gradient(#7a828b,#d6dce2 35%,#596069)", boxShadow: "0 30px 50px rgba(0,0,0,.55)" })}>
      <div style={ab(30, 40, { width: L - 60, height: 160, background: "#14171a", borderRadius: 24, overflow: "hidden" })}>
        {Array.from({ length: 40 }, (_, i) => <div key={i} style={ab(560 + i * 9 + (cl2 * 1200), 8 + rnd(i) * 130, { width: 40 + rnd(i + 2) * 60, height: 36 + rnd(i + 3) * 30, borderRadius: "50%", background: "radial-gradient(#3b342c,#0d0b09)" })} />)}
        {Array.from({ length: 12 }, (_, i) => { const x = cl2 > 0.5 ? ((tt * 620 + i * 130) % (L - 60)) : Math.min(520, (tt * 360 + i * 130) % 540); return <div key={i} style={ab(x, 62 + Math.sin(i) * 28, { width: 66, height: 26, borderRadius: 13, background: "rgba(120,190,255,.8)" })} />; })}
      </div>
    </div>
    <div style={{ ...txt(0, 210, 130, MZ), width: 1920, textAlign: "center" }}>EGR PASSAGE</div>
    <Tag tt={tt} at={1.2} x={960} y={780} txt="STOPPED UP" col={RED} />
    <Tag tt={tt} at={3.6} x={960} y={880} txt="BACK TO 87" col={VER} />
  </>;
}}</Stage>;

// 31 · el cinturón: sirve, pero no chocas a propósito
const Cinturon: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#20262c" mesa={false}>{(tt) => {
  const c = eio(tt, 0.4, 1.6), wall = eio(tt, 2.2, 3.4);
  return <>
    <div style={ab(330, 150, { width: 520, height: 780, borderRadius: "130px 130px 60px 60px", background: "linear-gradient(#3e444c,#1f2329)", boxShadow: "0 40px 70px rgba(0,0,0,.6)" })}>
      <div style={ab(40, 0, { width: 120 * c + 20, height: 780 * c, background: "repeating-linear-gradient(0deg,#6a4c17 0 8px,#8f6a22 8px 16px)", transformOrigin: "0 0", transform: "rotate(-24deg) translate(-30px,60px)" })} />
      <div style={ab(320, 600, { width: 130, height: 80, borderRadius: 12, background: CHROME, opacity: c })} />
    </div>
    <div style={ab(1380 - wall * 180, 90, { width: 540, height: 900, background: "repeating-linear-gradient(0deg,transparent 0 58px,#3e241a 58px 64px),repeating-linear-gradient(90deg,#7a3a24 0 118px,#3e241a 118px 124px),#7a3a24", boxShadow: "-30px 0 60px rgba(0,0,0,.6)" })} />
    <Tag tt={tt} at={1.8} x={960} y={300} txt="SEAT BELT" col={VER} />
    <Tag tt={tt} at={3.4} x={960} y={520} txt="NOT A PLAN" col={RED} />
  </>;
}}</Stage>;

// 32 · dos autos gemelos: bajo el capó cambia el número
const Gemelos: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1a1f26">{(tt) => {
  const op = eio(tt, 1.6, 2.8);
  const Car: React.FC<{ x: number; n: string; c: string }> = ({ x, n, c }) => <div style={ab(x, 390, { width: 720, height: 320 })}>
    <div style={ab(150, 0, { width: 380, height: 170, borderRadius: "90px 110px 0 0", background: "linear-gradient(#59626c,#30363d)" })}><div style={ab(30, 26, { width: 150, height: 104, background: "#9ec1d6", borderRadius: "50px 0 0 0" })} /><div style={ab(200, 26, { width: 150, height: 104, background: "#9ec1d6", borderRadius: "0 60px 0 0" })} /></div>
    <div style={ab(0, 150, { width: 720, height: 130, borderRadius: 50, background: "linear-gradient(#5e6872,#343a42)" })} />
    {[110, 500].map((wx) => <div key={wx} style={ab(wx, 220, { width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(#b5bbc2 30%,#15171a 34%)" })} />)}
    <div style={ab(530, 60 - op * 40, { width: 200, height: 100, borderRadius: 16, background: c, opacity: op, transform: `scale(${op})` })}><div style={{ ...txt(0, 14, 76, "#14110a"), width: 200, textAlign: "center" }}>{n}</div></div>
  </div>;
  return <><Car x={140} n="87" c={VER} /><Car x={1060} n="91+" c={MZ} /><div style={{ ...txt(0, 160, 100, TX), width: 1920, textAlign: "center" }}>SAME MODEL · SAME YEAR</div><Tag tt={tt} at={3.2} x={960} y={850} txt="READ IT" col={MZ} /></>;
}}</Stage>;

// 33 · interior de la tapa con su etiqueta
const TapaLabel: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#191d22">{(tt) => {
  const op = eio(tt, 0.5, 1.8), y = cl((tt - 2) * 3);
  return <>
    <Scene x={960} y={530} rx={0} ry={-8} s={1.1}>
      <div style={ab(-420, -330, { width: 840, height: 660, borderRadius: 44, background: "#131519", boxShadow: "inset 0 0 70px #000" })} />
      <div style={ab(-420, -330, { width: 840, height: 660, borderRadius: 44, background: "linear-gradient(135deg,#d0d4d9,#979da4)", transformOrigin: "0 50%", transform: `perspective(1400px) rotateY(${-op * 76}deg)`, boxShadow: "inset 0 0 0 6px rgba(0,0,0,.2)" })}>
        <div style={ab(170, 180, { width: 500, height: 300, background: "#fff", borderRadius: 12, boxShadow: "0 8px 20px rgba(0,0,0,.3)", opacity: 1 })}><div style={{ ...txt(0, 80, 74, "#222"), width: 500, textAlign: "center" }}>FUEL</div><div style={{ ...txt(0, 170, 60, "#222"), width: 500, textAlign: "center" }}>LABEL</div></div>
      </div>
      <div style={ab(-250, -140, { width: 500, height: 280, borderRadius: 14, background: "#f9f5e3", opacity: y, boxShadow: `0 0 ${y * 50}px rgba(255,220,120,.7)` })}><div style={{ ...txt(0, 40, 68, "#222"), width: 500, textAlign: "center" }}>LOOK FOR</div><div style={{ ...txt(0, 130, 116, "#b42318"), width: 500, textAlign: "center" }}>1 OF 3</div></div>
    </Scene>
    <Tag tt={tt} at={3} x={960} y={950} txt="TEN SECONDS" col={MZ} />
  </>;
}}</Stage>;

// 34 · tres etiquetas, tres veredictos
const TresVias: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#171c22">{(tt) => {
  const R = [["PREMIUM", "REQUIRED", "USE IT", RED, 0.3], ["PREMIUM", "RECOMMENDED", "YOUR CHOICE", MZ, 2.3], ["87 OR", "NOTHING", "STOP PAYING", VER, 4.3]] as const;
  return <>{R.map(([a, b, v, c, ta], i) => { const s = phys(tt, ta * (h.q?.ks ?? 1), 7, 0.55), y = cl((tt - ta * (h.q?.ks ?? 1) - 0.6) * 3); return <div key={i} style={ab(140 + i * 570, 170 + (1 - s) * 160, { width: 500, height: 720, opacity: cl(s * 2) })}>
    <div style={ab(0, 0, { width: 500, height: 400, borderRadius: 18, background: "#f6f2e4", boxShadow: "0 30px 50px rgba(0,0,0,.55)" })}><div style={{ ...txt(0, 90, 68, "#222"), width: 500, textAlign: "center" }}>{a}</div><div style={{ ...txt(0, 200, i === 1 ? 50 : 66, "#222"), width: 500, textAlign: "center" }}>{b}</div></div>
    <div style={ab(40, 440, { width: 420, height: 170, borderRadius: 20, background: c, opacity: y, transform: `scale(${0.8 + 0.2 * y})` })}><div style={{ ...txt(0, 58, 54, "#141210"), width: 420, textAlign: "center" }}>{v}</div></div>
  </div>; })}</>;
}}</Stage>;

// 35 · aguja a medio tanque y corrección con premium (error de una vez)
const Medio: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#1c1d20">{(tt) => {
  const fall = eio(tt, 0.4, 2.2), up = eio(tt, 2.8, 3.8), v = 1 - fall * 0.5 + up * 0.5, a = -70 + v * 140;
  return <>
    <div style={ab(330, 240, { width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(#23272c,#0d0f12)", boxShadow: "0 0 0 18px #3a3f46, 0 40px 70px rgba(0,0,0,.6)" })}>
      <div style={{ ...txt(90, 400, 90, RED) }}>E</div><div style={{ ...txt(470, 400, 90, TX) }}>F</div><div style={{ ...txt(278, 90, 64, DIM) }}>½</div>
      {Array.from({ length: 9 }, (_, i) => <div key={i} style={ab(306, 44, { width: 8, height: 40, background: "#d7dce2", transformOrigin: "4px 266px", transform: `rotate(${-70 + i * 17.5}deg)` })} />)}
      <div style={ab(300, 76, { width: 20, height: 236, background: "#ff5a36", transformOrigin: "10px 234px", borderRadius: 10, transform: `rotate(${a}deg)` })} />
    </div>
    <div style={{ ...txt(1040, 330, 60, TX, cl(tt - 0.5)) }}>ONE TIME, BY MISTAKE</div>
    <div style={{ ...txt(1040, 450, 60, TX, cl(tt - 1.5)) }}>DRIVE EASY</div>
    <div style={{ ...txt(1040, 570, 60, MZ, cl(tt - 2.8)) }}>AT HALF A TANK</div>
    <div style={{ ...txt(1040, 690, 60, MZ, cl(tt - 3.4)) }}>TOP OFF PREMIUM</div>
  </>;
}}</Stage>;

// 36 · el sobre escrito a mano
const SobreRoof: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#241d17">{(tt) => {
  const k = phys(tt, 0.3, 6, 0.6), w = eio(tt, 1.3, 3.3);
  return <>
    <div style={ab(360, 280, { width: 1200, height: 560, background: "linear-gradient(#fbf6e8,#e9e0c8)", boxShadow: "0 40px 70px rgba(0,0,0,.55)", transform: `rotate(${-3 + (1 - k) * 12}deg) translateY(${(1 - k) * -400}px)` })}>
      <div style={ab(0, 0, { width: 1200, height: 280, clipPath: "polygon(0 0,100% 0,50% 100%)", background: "linear-gradient(#f4eddb,#e5dcc4)", boxShadow: "inset 0 -2px 0 rgba(0,0,0,.12)" })} />
      <div style={{ ...ab(0, 0, { width: 1200, height: 560 }), clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}><div style={{ ...txt(0, 300, 170, "#26314f", 1, HAND), fontWeight: 700, width: 1200, textAlign: "center" }}>Walter's Roof</div></div>
    </div>
  </>;
}}</Stage>;

export const TEC: Record<string, C> = {
  boton93: Boton93, tapa10: Tapa10, filetes: Filetes, sticker: Sticker, puertas: Puertas, aguante: Aguante, inflador: Inflador, frente: Frente, dosllamas: DosLlamas, canicas: Canicas,
  turbo: Turbo, extintor: Extintor, micro: Micro, plomo: Plomo, hightest: HighTest, cataliza: Cataliza, tresdedos: TresDedos, division: Division, servilleta: Servilleta, techo: Techo,
  heladera: Heladera, billon: Billon, dyno: Dyno, veintisiete: Veintisiete, verde: Verde, costra: Costra, jabon: Jabon, diecinueve: Diecinueve, almohada: Almohada, egr: Egr,
  cinturon: Cinturon, gemelos: Gemelos, tapalabel: TapaLabel, tresvias: TresVias, medio: Medio, sobreroof: SobreRoof,
};
