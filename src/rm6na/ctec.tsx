// c6a.tsx · componentes ÚNICOS de rm6na (sesE, Ramón: «never say "it's under warranty, whatever it needs"»). Inglés.
// Ninguno repite los de tec5na (c5a) ni tec29. Objetos dibujados en código; 3D = CSS 3D real (preserve-3d), sin WebGL.
import React from "react";
import { BR, cl, DIM, eio, H, HAND, lerp, MZ, phys, RED, rnd, Stage, Tag, TIN, TX, VER } from "./ckit";

type C = React.FC<{ t: number; h: H }>;
const ab = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });
const e1 = (tt: number, a: number) => cl((tt - a) / 0.4);
const F = "'Arial Black', Arial, sans-serif";
const PAPER = "linear-gradient(#fbf8f0,#efe9da)";
const lines = (n: number, w = 100, gap = 30, col = "rgba(60,60,70,.35)") => Array.from({ length: n }, (_, i) => <div key={i} style={{ height: 10, width: `${w - (rnd(i + n) * 30)}%`, background: col, borderRadius: 5, marginBottom: gap - 10 }} />);
const Scene: React.FC<{ x?: number; y?: number; rx: number; ry: number; rz?: number; s?: number; children: React.ReactNode }> = ({ x = 960, y = 540, rx, ry, rz = 0, s = 1, children }) => (
  <div style={ab(x, y, { perspective: 1700, perspectiveOrigin: "50% 40%" })}>
    <div style={{ transformStyle: "preserve-3d", transform: `scale(${s}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)` }}>{children}</div>
  </div>
);
// caja 3D (6 caras) centrada en el origen
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

// 1 · la carpeta gruesa de la garantía cae sobre el mostrador y dos dedos la golpean
const Carpeta3D: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1a1f26">{(tt) => {
  const k = phys(tt, 0.2, 7, 0.5), tap = (a: number) => Math.exp(-Math.max(0, tt - a) * 7) * (tt > a ? 1 : 0);
  const tp = tap(2.0) + tap(2.45);
  return <>
    <Scene rx={52} ry={0} rz={-14} s={1.25} y={560}>
      <div style={{ transformStyle: "preserve-3d", transform: `translateZ(${(1 - k) * 600 - tp * 6}px)` }}>
        {Array.from({ length: 34 }, (_, i) => <div key={i} style={{ position: "absolute", left: -330 + rnd(i) * 6, top: -230 + rnd(i + 3) * 6, width: 650, height: 450, background: i % 7 ? "#f6f2e6" : "#e9e2cc", transform: `translateZ(${i * 2.2}px)`, boxShadow: i === 0 ? "0 40px 60px rgba(0,0,0,.6)" : "none" }} />)}
        <div style={{ position: "absolute", left: -345, top: -245, width: 690, height: 490, borderRadius: 14, background: "linear-gradient(135deg,rgba(40,90,170,.82),rgba(25,60,130,.9))", transform: "translateZ(78px)", boxShadow: "inset 0 0 0 4px rgba(255,255,255,.18)" }}>
          <div style={ab(60, 60, { width: 300, height: 110, background: "#fff", borderRadius: 8, padding: "18px 24px", fontFamily: F, fontSize: 40, color: "#1c2b44" })}>WARRANTY<div style={{ fontSize: 22, color: "#6a7488", marginTop: 6 }}>SERVICE AGREEMENT</div></div>
          <div style={ab(560, 360, { width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#ffe58a,#c9962e)", boxShadow: "0 4px 10px rgba(0,0,0,.4)" })} />
        </div>
      </div>
    </Scene>
    {[2.0, 2.45].map((a, i) => tt > a - 0.3 && <div key={i} style={ab(1080 + i * 90, 470 - 30 * cl(1 - (tt - a) * 4), { width: 80, height: 120, borderRadius: "40px 40px 30px 30px", background: "linear-gradient(#d7a27c,#b9845e)", opacity: cl((tt - a + 0.3) * 4) * (1 - cl((tt - a - 0.8) * 3)), boxShadow: "0 10px 20px rgba(0,0,0,.4)" })} />)}
    {[2.0, 2.45].map((a, i) => { const r = cl((tt - a) * 2); return tt > a && <div key={"r" + i} style={ab(1120 + i * 90, 600, { width: 40 + r * 160, height: 20 + r * 60, marginLeft: -(20 + r * 80), borderRadius: "50%", border: `4px solid rgba(255,230,160,${1 - r})` })} />; })}
    <Tag tt={tt} at={3.0} x={1560} y={880} txt="THICK ONES" col={MZ} />
  </>;
}}</Stage>;

// 2 · impresora de tickets: sale el papel renglón a renglón y abajo el total de $400
const Ticket: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#1d1b19">{(tt) => {
  const L = eio(tt, 0.4, 3.2) * 620, rows = [["DIAGNOSIS", "$ 130"], ["TEARDOWN", "$ 260"], ["PART", "$ 10"]];
  return <>
    <div style={ab(960, 170, { transform: "translateX(-50%)", width: 640, height: 150, borderRadius: 26, background: "linear-gradient(#3a3f45,#1f2226)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" })}>
      <div style={ab(60, 110, { width: 520, height: 18, borderRadius: 9, background: "#0b0c0d" })} />
      <div style={ab(560, 36, { width: 22, height: 22, borderRadius: "50%", background: tt % 0.5 < 0.25 ? "#5cf28a" : "#1f6a3a" })} />
    </div>
    <div style={ab(960, 295, { transform: "translateX(-50%)", width: 480, height: L, overflow: "hidden", background: "linear-gradient(#fffef8,#f1ede0)", boxShadow: "0 20px 40px rgba(0,0,0,.5)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),95% 100%,90% calc(100% - 10px),85% 100%,80% calc(100% - 10px),75% 100%,70% calc(100% - 10px),65% 100%,60% calc(100% - 10px),55% 100%,50% calc(100% - 10px),45% 100%,40% calc(100% - 10px),35% 100%,30% calc(100% - 10px),25% 100%,20% calc(100% - 10px),15% 100%,10% calc(100% - 10px),5% 100%,0 calc(100% - 10px))" })}>
      <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, padding: "0 40px", fontFamily: "monospace", color: "#222", fontWeight: 700 }}>
        <div style={{ textAlign: "center", fontSize: 30, marginBottom: 18 }}>* WORK ORDER *</div>
        {rows.map(([a, b]) => <div key={a} style={{ display: "flex", justifyContent: "space-between", fontSize: 34, marginBottom: 12 }}><span>{a}</span><span>{b}</span></div>)}
        <div style={{ borderTop: "4px dashed #444", margin: "14px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 64, color: RED }}><span>TOTAL</span><span>$400</span></div>
      </div>
    </div>
    <Tag tt={tt} at={3.6} x={1500} y={760} txt="ONE SENTENCE" col={MZ} />
  </>;
}}</Stage>;

// 3 · reloj de paletas que pasa los años 1980 → 2026
const Anios: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#15191d">{(tt) => {
  const y = Math.round(lerp(1980, 2026, eio(tt, 0.3, 3.0))), fr = (tt * 9) % 1;
  return <>
    <div style={ab(960, 470, { transform: "translate(-50%,-50%)", display: "flex", gap: 26 })}>
      {String(y).split("").map((d, i) => <div key={i} style={{ position: "relative", width: 230, height: 330, borderRadius: 22, background: "linear-gradient(#2c3036 50%,#1d2024 50%)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontSize: 250, color: "#f4efe3", overflow: "hidden" }}>
        {d}<div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 5, background: "#0a0b0c" }} />
        {tt < 3.0 && i > 1 && <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "50%", background: "linear-gradient(#3a3f46,#2c3036)", transformOrigin: "50% 100%", transform: `rotateX(${-fr * 180}deg)`, opacity: 0.6 }} />}
      </div>)}
    </div>
    <div style={ab(960, 760, { transform: "translateX(-50%)", fontFamily: F, fontSize: 70, color: MZ, opacity: e1(tt, 3.1), letterSpacing: 4, whiteSpace: "nowrap" })}>46 YEARS · SAN ANTONIO</div>
  </>;
}}</Stage>;

// 4 · archivador de 3 cajones: cada cajón es un tipo de garantía
const Cajonera3D: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#181c20" mesa={false}>{(tt) => {
  const labs = ["FACTORY", "SERVICE CONTRACT", "REPAIR"], cols = ["#3d7bd9", "#d9a23d", "#4caf7d"];
  return <Scene rx={-12} ry={-28 + 6 * Math.sin(tt * 0.5)} s={0.98} y={520} x={900}>
    <Box w={560} h={700} d={460} c="linear-gradient(#8d959b,#5f666b)" top="#a9b0b5" side="linear-gradient(90deg,#6b7277,#8d959b)" />
    {labs.map((l, i) => { const o = eio(tt, 0.5 + i * 0.9, 1.1 + i * 0.9) * 260;
      return <Box key={l} w={520} h={200} d={440} z={o + 12} y={-225 + i * 225} c="linear-gradient(#c9cfd3,#9aa1a7)" side="#7c838a" top="#e8ebed"
        front={<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <div style={{ padding: "8px 22px", background: "#fff", border: `6px solid ${cols[i]}`, borderRadius: 8, fontFamily: F, fontSize: l.length > 10 ? 34 : 46, color: "#1c2b44" }}>{l}</div>
          <div style={{ width: 160, height: 26, borderRadius: 13, background: "linear-gradient(#e9eced,#7c838a)" }} /></div>} />; })}
  </Scene>;
}}</Stage>;

// 5 · cinta métrica de paragolpe a paragolpe sobre la silueta de la camioneta
const Cinta: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#171b20">{(tt) => {
  const k = eio(tt, 0.6, 2.4), x0 = 330, x1 = 1590;
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d="M300 640 L380 520 Q420 470 520 465 L860 455 L960 360 Q990 330 1060 330 L1330 330 Q1390 330 1420 380 L1480 470 L1600 480 Q1640 485 1640 540 L1640 640 Z" fill="#5d6b78" stroke="#c9d3db" strokeWidth={6} />
      <path d="M990 370 L1060 350 L1300 350 L1350 450 L960 455 Z" fill="#9fc3dc" opacity={0.75} />
      {[520, 1400].map((cx) => <g key={cx}><circle cx={cx} cy={650} r={95} fill="#1b1d20" /><circle cx={cx} cy={650} r={48} fill="#9aa1a7" /></g>)}
    </svg>
    <div style={ab(x0, 780, { width: (x1 - x0) * k, height: 70, background: "repeating-linear-gradient(90deg,#1b1b1b 0 3px,transparent 3px 40px),linear-gradient(#ffd23a,#e8b400)", boxShadow: "0 10px 20px rgba(0,0,0,.5)", borderRadius: 6 })} />
    <div style={ab(x0 + (x1 - x0) * k - 70, 750, { width: 140, height: 130, borderRadius: 24, background: "linear-gradient(#d33,#911)", boxShadow: "0 16px 30px rgba(0,0,0,.6)" })} />
    <div style={ab(960, 140, { transform: "translateX(-50%)", fontFamily: F, fontSize: 76, color: TX, opacity: e1(tt, 2.5), whiteSpace: "nowrap" })}>3 YEARS <span style={{ color: MZ }}>OR</span> 36,000 MILES</div>
    <div style={ab(960, 920, { transform: "translateX(-50%)", fontFamily: F, fontSize: 40, color: DIM, opacity: e1(tt, 3.2), whiteSpace: "nowrap" })}>READ YOUR OWN PAPERS FOR THE REAL NUMBERS</div>
  </>;
}}</Stage>;

// 6 · el sobre “oficial”: la solapa se abre en 3D y sale la carta con el sello
const Sobre3D: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#1e1a16">{(tt) => {
  const op = eio(tt, 0.6, 1.5), up = eio(tt, 1.4, 2.6);
  return <><div style={ab(960, 600, { transform: "translate(-50%,-50%)", width: 900, height: 560, perspective: 1600 })}>
    <div style={ab(60, 120 - up * 470, { width: 780, height: 480, background: PAPER, boxShadow: "0 20px 40px rgba(0,0,0,.4)", padding: "50px 60px", boxSizing: "border-box" })}>
      <div style={{ fontFamily: F, fontSize: 44, color: "#1c2b44", marginBottom: 26 }}>FINAL NOTICE</div>{lines(7, 100, 34)}
      <div style={ab(600, 300, { width: 130, height: 130, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#e45050,#8d1414)", boxShadow: "0 6px 12px rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffd9d9", fontFamily: F, fontSize: 26 })}>SEAL</div>
    </div>
    <div style={ab(0, 160, { width: 900, height: 400, background: "linear-gradient(#e6d6b0,#d4c08f)", boxShadow: "0 40px 70px rgba(0,0,0,.6)", clipPath: "polygon(0 0,50% 55%,100% 0,100% 100%,0 100%)" })} />
    <div style={ab(0, 160, { width: 900, height: 300, background: "linear-gradient(#efe2c0,#dccb9c)", transformOrigin: "50% 0", transform: `rotateX(${-170 * op}deg)`, clipPath: "polygon(0 0,100% 0,50% 100%)", zIndex: op > 0.5 ? 0 : 2 })} />
    <div style={ab(60, 420, { fontFamily: "monospace", fontSize: 30, color: "#4a3c24", fontWeight: 700 })}>URGENT · VEHICLE SERVICE DEPT.</div>
  </div><Tag tt={tt} at={3.0} x={1600} y={240} txt="OFFICIAL?" col={MZ} /></>;
}}</Stage>;

// 7 · el paraguas del contrato: tapa la lluvia, pero tiene agujeros (las exclusiones)
const Paraguas: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#141a21">{(tt) => {
  const op = eio(tt, 0.3, 1.2), holes = [[760, 330], [1010, 300], [1150, 380]];
  return <>
    {Array.from({ length: 70 }, (_, i) => { const x = 420 + rnd(i) * 1080, sp = 700 + rnd(i + 2) * 300, y = ((tt * sp + rnd(i + 5) * 1100) % 1100) - 60;
      const under = x > 600 && x < 1320 && !holes.some(([hx]) => Math.abs(hx - x) < 40); if (under && y > 380) return null;
      return <div key={i} style={ab(x, y, { width: 4, height: 46, borderRadius: 2, background: "rgba(170,210,255,.55)" })} />; })}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(960 400) scale(${0.3 + 0.7 * op} ${op})`}>
        <path d="M-380 0 Q-380 -260 0 -270 Q380 -260 380 0 Q330 -40 285 0 Q240 -40 190 0 Q140 -40 95 0 Q50 -40 0 0 Q-50 -40 -95 0 Q-140 -40 -190 0 Q-240 -40 -285 0 Q-330 -40 -380 0 Z" fill="#2b5fae" stroke="#8fb3e8" strokeWidth={5} />
        {holes.map(([hx, hy], i) => <ellipse key={i} cx={hx - 960} cy={hy - 400 - 60} rx={48} ry={34} fill="#141a21" stroke="#ff6a5a" strokeWidth={5} strokeDasharray="10 8" opacity={e1(tt, 1.4 + i * 0.4)} />)}
      </g>
      <line x1={960} y1={400} x2={960} y2={760} stroke="#cfd6dc" strokeWidth={10} />
      <path d="M960 760 Q960 800 925 800" stroke="#cfd6dc" strokeWidth={10} fill="none" />
      <path d="M720 900 L760 830 Q780 800 830 800 L1060 800 Q1110 800 1140 840 L1200 900 Z" fill="#7d8790" />
      {[800, 1130].map((cx) => <circle key={cx} cx={cx} cy={905} r={36} fill="#1b1d20" />)}
    </svg>
    {holes.map(([hx], i) => tt > 1.6 + i * 0.4 && Array.from({ length: 6 }, (_, j) => { const y = 360 + ((tt * 900 + j * 80) % 460); return <div key={i + "-" + j} style={ab(hx - 4, y, { width: 9, height: 54, background: "rgba(190,225,255,.95)", borderRadius: 4, boxShadow: "0 0 10px rgba(150,200,255,.8)" })} />; }))}
    <Tag tt={tt} at={2.6} x={1580} y={220} txt="EXCLUSIONS" col={RED} />
  </>;
}}</Stage>;

// 8 · la pantalla del tablero titila y se apaga; cuelga la etiqueta de $1,100
const Tablero: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#0e1114" mesa={false}>{(tt) => {
  const off = tt > 1.6 ? 1 : (Math.sin(tt * 40) > 0.6 && tt > 1.0 ? 1 : 0), sw = Math.exp(-Math.max(0, tt - 2.4) * 1.3) * Math.sin((tt - 2.4) * 7) * 14;
  return <>
    <div style={ab(960, 560, { transform: "translate(-50%,-50%)", width: 1500, height: 560, borderRadius: "60px 60px 20px 20px", background: "linear-gradient(#2b2f34,#16191c)", boxShadow: "0 40px 80px rgba(0,0,0,.7)" })}>
      <div style={ab(470, 90, { width: 560, height: 340, borderRadius: 18, background: off ? "#050607" : "linear-gradient(135deg,#123a5a,#1d6aa0)", boxShadow: "inset 0 0 0 10px #0a0b0c", overflow: "hidden" })}>
        {!off && <svg width={560} height={340}><path d="M20 300 L180 200 L260 240 L420 80 L540 120" stroke="#9fe0ff" strokeWidth={8} fill="none" /><circle cx={420} cy={80} r={14} fill="#ffd23a" /></svg>}
        {off ? <div style={ab(250, 150, { width: 60, height: 6, background: "#1a1c1e" })} /> : null}
      </div>
      {[150, 1150].map((x) => <div key={x} style={ab(x, 120, { width: 220, height: 220, borderRadius: "50%", border: "10px solid #3b4046", background: "radial-gradient(circle,#1c2024 60%,#262a2f)" })}><div style={ab(105, 20, { width: 10, height: 100, background: RED, transformOrigin: "5px 90px", transform: `rotate(${x < 500 ? -40 : 30}deg)` })} /></div>)}
    </div>
    {tt > 2.3 && <div style={ab(1240, 230, { transformOrigin: "50% 0", transform: `rotate(${sw}deg)` })}>
      <div style={{ width: 4, height: 90, background: "#ddd", margin: "0 auto" }} />
      <div style={{ padding: "26px 44px", background: MZ, borderRadius: 14, fontFamily: F, fontSize: 84, color: TIN, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>$1,100</div>
    </div>}
    <Tag tt={tt} at={3.4} x={560} y={940} txt="19,000 MILES" col={VER} />
  </>;
}}</Stage>;

// 9 · el mazo del juez golpea y queda el año de la ley
const Mazo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#1d1712">{(tt) => {
  const sw = tt < 1.2 ? -50 * eio(tt, 0.2, 1.0) : lerp(-50, 8, eio(tt, 1.2, 1.45)) - 8 * eio(tt, 1.45, 1.8), hit = tt > 1.45 ? Math.exp(-(tt - 1.45) * 3) : 0;
  return <>
    <div style={ab(960, 760, { transform: "translate(-50%,-50%)", width: 760, height: 150, borderRadius: 75, background: "linear-gradient(#7a4a26,#4a2b14)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" })} />
    <div style={ab(960, 700, { transform: "translate(-50%,-50%)", width: 300 + hit * 500, height: 60 + hit * 100, borderRadius: "50%", border: `6px solid rgba(255,220,150,${hit})` })} />
    <div style={ab(1180, 640, { transformOrigin: "-120px 20px", transform: `scale(1.7) rotate(${sw}deg)` })}>
      <div style={ab(-120, 10, { width: 520, height: 34, borderRadius: 17, background: "linear-gradient(#8a5630,#5a3418)" })} />
      <div style={ab(-260, -70, { width: 220, height: 180, borderRadius: 30, background: "linear-gradient(90deg,#5a3418,#9b6538 50%,#5a3418)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" })}>
        {[30, 150].map((x) => <div key={x} style={ab(x, 0, { width: 30, height: 180, background: "#c9963e" })} />)}
      </div>
    </div>
    <div style={ab(960, 250, { transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * phys(tt, 1.5, 7, 0.4)})`, opacity: e1(tt, 1.5), fontFamily: F, fontSize: 170, color: MZ, textShadow: "0 10px 30px rgba(0,0,0,.6)" })}>1975</div>
    <div style={ab(960, 900, { transform: "translateX(-50%)", opacity: e1(tt, 2.2), fontFamily: F, fontSize: 52, color: TX, whiteSpace: "nowrap" })}>MAGNUSON-MOSS WARRANTY ACT</div>
  </>;
}}</Stage>;

// 10 · la grapadora: los recibos quedan engrapados al cuaderno verde
const Grapadora: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#18201a">{(tt) => {
  const n = 3, cur = Math.min(n - 1, Math.floor((tt - 0.6) / 1.1)), ph = ((tt - 0.6) % 1.1) / 1.1, press = tt > 0.6 && tt < 0.6 + n * 1.1 ? Math.sin(cl(ph * 1.6) * Math.PI) : 0;
  return <>
    <div style={ab(700, 560, { transform: "translate(-50%,-50%) rotate(-4deg)", width: 700, height: 820, borderRadius: 14, background: "linear-gradient(135deg,#3f8a4e,#27613a)", boxShadow: "0 40px 70px rgba(0,0,0,.6)" })}>
      {Array.from({ length: 14 }, (_, i) => <div key={i} style={ab(-22, 40 + i * 56, { width: 50, height: 30, borderRadius: 15, border: "6px solid #c9ced2", borderRight: "none" })} />)}
      {Array.from({ length: n }, (_, i) => { const k = phys(tt, 0.25 + i * 1.1, 8, 0.45);
        return tt > 0.25 + i * 1.1 && <div key={i} style={ab(120 + i * 40, 90 + i * 70, { width: 470, height: 560, background: PAPER, transform: `rotate(${(i - 1) * 4}deg) translateY(${(1 - k) * -500}px)`, boxShadow: "0 10px 20px rgba(0,0,0,.35)", padding: "40px 36px", boxSizing: "border-box", fontFamily: "monospace", fontWeight: 700, color: "#333" })}>
          <div style={{ fontSize: 30, marginBottom: 16 }}>OIL CHANGE</div>{lines(6, 100, 30)}
          {(i < cur || (i === cur && ph > 0.55)) && <div style={ab(190, 20, { width: 80, height: 10, border: "4px solid #8d959b", borderTop: "none" })} />}
        </div>; })}
    </div>
    <div style={ab(1180, 560, { width: 600, height: 60, borderRadius: 24, background: "linear-gradient(#3a3f45,#1d2024)", boxShadow: "0 24px 40px rgba(0,0,0,.6)" })}><div style={ab(40, 14, { width: 120, height: 26, borderRadius: 8, background: "linear-gradient(#c9cfd3,#7c838a)" })} /></div>
    <div style={ab(1700, 470, { width: 70, height: 110, borderRadius: 20, background: "linear-gradient(#2a2e33,#111)" })} />
    <div style={ab(1180, 430, { width: 600, height: 110, borderRadius: "70px 30px 30px 70px", background: "linear-gradient(#c62828,#7f1515)", boxShadow: "0 18px 30px rgba(0,0,0,.55)", transformOrigin: "560px 70px", transform: `rotate(${-14 + press * 14}deg)` })}><div style={ab(30, 20, { width: 420, height: 16, borderRadius: 8, background: "rgba(255,255,255,.25)" })} /></div>
    <Tag tt={tt} at={3.8} x={1500} y={760} txt="EVERY ONE" col={MZ} />
  </>;
}}</Stage>;

// 11 · el teléfono del escritorio suena, se levanta el tubo y llega el número de autorización
const Telefono: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1a1d22">{(tt) => {
  const ring = tt < 1.4 ? Math.sin(tt * 50) * 5 : 0, lift = eio(tt, 1.4, 2.0);
  const cord = Array.from({ length: 40 }, (_, i) => { const u = i / 39, x = lerp(760, 820 + lift * 260, u), y = lerp(640, 470 - lift * 260, u) + Math.sin(u * 40) * 16; return `${i ? "L" : "M"}${x} ${y}`; }).join(" ");
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={cord} stroke="#1a1a1a" strokeWidth={8} fill="none" /></svg>
    <div style={ab(560, 560, { width: 520, height: 300, borderRadius: "60px 60px 30px 30px", background: "linear-gradient(#c93a2e,#7d1a12)", transform: `rotate(${ring}deg)`, boxShadow: "0 40px 70px rgba(0,0,0,.6)" })}>
      <div style={ab(160, 90, { width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,#efe7d6 0 30%,#3a1a14 31% 34%,#efe7d6 35%)" })} />
    </div>
    <div style={ab(560 + lift * 300, 470 - lift * 300, { width: 560, height: 110, borderRadius: 55, background: "linear-gradient(#d0463a,#8d1f16)", transform: `rotate(${ring - lift * 30}deg)`, boxShadow: "0 20px 40px rgba(0,0,0,.6)" })} />
    {tt < 1.4 && [0, 1, 2].map((i) => <div key={i} style={ab(560 + 260, 520, { width: 120 + i * 90 + ((tt * 3) % 1) * 60, height: 120 + i * 90 + ((tt * 3) % 1) * 60, transform: "translate(-50%,-50%)", borderRadius: "50%", border: `5px solid rgba(255,220,120,${0.6 - i * 0.18})`, clipPath: "polygon(50% 50%,100% 0,100% 100%)" })} />)}
    <div style={ab(1300, 330, { width: 440, height: 380, background: "#ffe066", transform: `rotate(3deg) scale(${phys(tt, 2.4, 7, 0.45)})`, boxShadow: "0 20px 40px rgba(0,0,0,.5)", padding: 40, boxSizing: "border-box", fontFamily: HAND, color: "#2a2a6a" })}>
      <div style={{ fontSize: 56, fontWeight: 700 }}>Auth #</div><div style={{ fontSize: 96, fontWeight: 700 }}>48213</div><div style={{ fontSize: 40 }}>Linda · 10:42 am</div>
    </div>
    <Tag tt={tt} at={3.2} x={1520} y={900} txt="CALL FIRST" col={MZ} />
  </>;
}}</Stage>;

// 12 · vista explotada de la suspensión delantera: las piezas se separan en 3D (eso es el teardown)
const Explosion3D: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#101519" mesa={false}>{(tt) => {
  const k = eio(tt, 0.8, 2.6);
  const P = (x: number, y: number, z: number, ch: React.ReactNode) => <div style={{ position: "absolute", transformStyle: "preserve-3d", transform: `translate3d(${x * k}px,${y * k}px,${z * k}px)` }}>{ch}</div>;
  return <><Scene rx={-14} ry={-30 + tt * 6} s={1.15} y={560}>
    {P(0, 0, 0, <div style={{ position: "absolute", left: -170, top: -170, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle,#3a3f45 0 18%,#9aa1a7 19% 30%,#5f666b 31% 60%,#c9cfd3 61% 66%,#4a5056 67%)", boxShadow: "0 0 0 6px #22262a" }} />)}
    {P(-380, 120, 120, <div style={{ position: "absolute", left: -260, top: -40, width: 520, height: 80, borderRadius: 40, background: "linear-gradient(#8d959b,#4a5056)", transform: "rotateZ(-12deg)" }} />)}
    {P(-150, 260, 220, <div style={{ position: "absolute", left: -55, top: -55, width: 110, height: 110, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#eef1f3,#5f666b)" }} />)}
    {P(80, -420, 60, <div style={{ position: "absolute", left: -60, top: -230, width: 120, height: 460, borderRadius: 20, background: "repeating-linear-gradient(0deg,#b8bec3 0 18px,#5f666b 18px 30px)" }} />)}
    {P(420, 40, -120, <div style={{ position: "absolute", left: -230, top: -18, width: 460, height: 36, borderRadius: 18, background: "linear-gradient(#c9cfd3,#6b7277)" }} />)}
  </Scene>
    {[["HUB", 960, 470], ["CONTROL ARM", 520, 690], ["BALL JOINT", 760, 880], ["STRUT", 1060, 140], ["TIE ROD", 1440, 560]].map(([n, x, y], i) => <div key={String(n)} style={ab(Number(x), Number(y), { transform: "translateX(-50%)", padding: "8px 20px", borderRadius: 10, background: "rgba(10,14,18,.8)", border: `3px solid ${MZ}`, fontFamily: F, fontSize: 34, color: TX, whiteSpace: "nowrap", opacity: e1(tt, 2.4 + i * 0.25) })}>{n}</div>)}
    <Tag tt={tt} at={2.4} x={1560} y={200} txt="TEARDOWN" col={MZ} />
  </>;
}}</Stage>;

// 13 · el taxímetro de la mano de obra: las horas corren y los dólares suben
const Taximetro: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#14181b">{(tt) => {
  const hrs = 3 * eio(tt, 0.5, 4.0), usd = Math.round(hrs * 130);
  return <>
    <div style={ab(960, 520, { transform: "translate(-50%,-50%)", width: 1200, height: 460, borderRadius: 36, background: "linear-gradient(#2a2e33,#121416)", boxShadow: "0 40px 80px rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "space-around" })}>
      <div style={{ textAlign: "center" }}><div style={{ fontFamily: F, fontSize: 40, color: DIM }}>HOURS</div>
        <div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 170, color: "#ffb84a", textShadow: "0 0 30px rgba(255,180,70,.6)" }}>{hrs.toFixed(1)}</div></div>
      <div style={{ width: 6, height: 300, background: "#33383d" }} />
      <div style={{ textAlign: "center" }}><div style={{ fontFamily: F, fontSize: 40, color: DIM }}>LABOR</div>
        <div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 170, color: "#ff5a4a", textShadow: "0 0 30px rgba(255,90,70,.6)" }}>${usd}</div></div>
    </div>
    <div style={ab(960, 860, { transform: "translateX(-50%)", fontFamily: F, fontSize: 54, color: MZ, whiteSpace: "nowrap", opacity: e1(tt, 0.4) })}>$130 AN HOUR · NOTHING FIXED YET</div>
  </>;
}}</Stage>;

// 14 · calculadora: 3 × 130 = 390, tecla por tecla
const Calculadora: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#1b1a17">{(tt) => {
  const seq = ["3", "×", "1", "3", "0", "="], i = Math.floor((tt - 0.3) / 0.45), pr = ((tt - 0.3) % 0.45) < 0.18;
  const disp = i < 0 ? "0" : i >= 5 ? "390" : i === 0 ? "3" : i === 1 ? "3" : seq.slice(2, i + 1).join("");
  const keys = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ".", "=", "+"];
  return <>
    <div style={ab(800, 540, { transform: "translate(-50%,-50%) rotate(-6deg)", width: 560, height: 820, borderRadius: 40, background: "linear-gradient(#3a3d42,#1d1f22)", boxShadow: "0 40px 80px rgba(0,0,0,.7)", padding: 40, boxSizing: "border-box" })}>
      <div style={{ height: 170, borderRadius: 16, background: "#b8c7a8", boxShadow: "inset 0 6px 12px rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 30px", fontFamily: "monospace", fontWeight: 900, fontSize: 120, color: "#1f2a18" }}>{disp}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 22, marginTop: 40 }}>
        {keys.map((k) => { const on = i >= 0 && i < 6 && seq[i] === k && pr;
          return <div key={k} style={{ height: 100, borderRadius: 18, background: on ? "#ffb84a" : "linear-gradient(#5a5e64,#3b3e42)", transform: on ? "translateY(6px)" : "none", boxShadow: on ? "none" : "0 6px 0 #222", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontSize: 48, color: "#eee" }}>{k}</div>; })}
      </div>
    </div>
    <Tag tt={tt} at={3.2} x={1450} y={420} txt="$390" col={RED} />
    <Tag tt={tt} at={3.7} x={1450} y={580} txt="JUST TO LOOK" col={MZ} />
  </>;
}}</Stage>;

// 15 · la orden de trabajo de Ramón: la línea roja y las tres casillas que se tildan
const Orden: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1d1a16">{(tt) => {
  const bx = ["CALL BEFORE ANY WORK:  YES / NO", "PHONE #  ___________", "WARRANTY OR CONTRACT?  WHICH ONE?"];
  return <div style={ab(960, 540, { transform: `translate(-50%,-50%) rotate(-2deg) translateY(${(1 - phys(tt, 0.1, 6, 0.6)) * 600}px)`, width: 1100, height: 860, background: PAPER, boxShadow: "0 40px 80px rgba(0,0,0,.6)", padding: "50px 70px", boxSizing: "border-box" })}>
    <div style={{ fontFamily: F, fontSize: 40, color: "#333" }}>TREVIÑO AUTO REPAIR · WORK ORDER</div>
    {bx.map((b, i) => { const k = eio(tt, 1.0 + i * 0.9, 1.5 + i * 0.9);
      return <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 44, padding: "22px 26px", border: `5px solid ${RED}`, borderRadius: 10 }}>
        <div style={{ width: 70, height: 70, border: "5px solid #333", position: "relative", flex: "none" }}>
          <svg width={70} height={70} style={{ position: "absolute", left: 0, top: 0 }}><path d="M12 36 L30 54 L62 10" stroke="#1d4fb8" strokeWidth={9} fill="none" strokeDasharray={90} strokeDashoffset={90 * (1 - k)} /></svg></div>
        <div style={{ fontFamily: F, fontSize: 40, color: i === 0 ? RED : "#333" }}>{b}</div></div>; })}
    <div style={{ marginTop: 40 }}>{lines(4, 100, 34)}</div>
  </div>;
}}</Stage>;

// 16 · la letra chica: la página de exclusiones sube y el resaltador marca las palabras
const Resaltador: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#161a1e">{(tt) => {
  const W = ["WEAR ITEMS", "SEALS AND GASKETS", "PRE-EXISTING", "LACK OF MAINTENANCE", "CONSEQUENTIAL DAMAGE"];
  return <div style={ab(960, 540, { transform: "translate(-50%,-50%)", width: 1000, height: 940, overflow: "hidden", background: PAPER, boxShadow: "0 40px 80px rgba(0,0,0,.6)" })}>
    <div style={{ transform: `translateY(${-eio(tt, 0.2, 1.4) * 120}px)`, padding: "60px 70px" }}>
      <div style={{ fontFamily: F, fontSize: 54, color: "#222", marginBottom: 30 }}>EXCLUSIONS</div>
      {W.map((w, i) => { const k = eio(tt, 1.2 + i * 0.75, 1.7 + i * 0.75);
        return <div key={w} style={{ marginBottom: 26 }}>{lines(2, 100, 22, "rgba(60,60,70,.25)")}
          <span style={{ position: "relative", fontFamily: "Georgia, serif", fontSize: 40, fontWeight: 700, color: "#222" }}>
            <span style={{ position: "absolute", left: -8, top: 4, height: "90%", width: `calc(${k * 100}% + 16px)`, background: "rgba(255,232,40,.75)", borderRadius: 6, zIndex: 0 }} />
            <span style={{ position: "relative" }}>{w}</span></span></div>; })}
    </div>
    <div style={ab(lerp(120, 840, ((tt - 1.2) / 0.75) % 1), 300 + Math.min(4, Math.max(0, Math.floor((tt - 1.2) / 0.75))) * 118, { width: 60, height: 230, borderRadius: 14, background: "linear-gradient(90deg,#f2d21c,#ffe95a)", transform: "rotate(35deg)", boxShadow: "0 10px 20px rgba(0,0,0,.4)", opacity: tt > 1.1 && tt < 5.0 ? 1 : 0 })} />
  </div>;
}}</Stage>;

// 17 · la pastilla de freno en 3D se gasta y el calibre lo mide
const Pastilla3D: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#14181c" mesa={false}>{(tt) => {
  const wear = eio(tt, 0.8, 3.4), th = lerp(110, 22, wear), mm = Math.round(lerp(10, 2, wear));
  return <><Scene rx={-30} ry={-62 + 4 * Math.sin(tt * 0.6)} s={1.15} y={540} x={820}>
    <div style={{ position: "absolute", left: -330, top: -330, width: 660, height: 660, borderRadius: "50%", background: "repeating-radial-gradient(circle,#9aa1a7 0 3px,#848b91 3px 7px)", boxShadow: "inset 0 0 0 120px rgba(0,0,0,.0), 0 0 0 10px #5f666b" }}><div style={ab(230, 230, { width: 200, height: 200, borderRadius: "50%", background: "#3a3f45" })} /></div>
    <Box w={380} h={160} d={30} z={40} y={-200} c="linear-gradient(#6b7277,#3a3f45)" />
    <Box w={360} h={140} d={th} z={55 + th / 2} y={-200} c="linear-gradient(#3b3330,#1f1a18)" top="#2e2724" side="#4a403b" />
  </Scene>
    <div style={ab(1380, 360, { width: 420, height: 300, borderRadius: 20, background: "linear-gradient(#2c3035,#16181b)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}>
      <div style={{ fontFamily: F, fontSize: 36, color: DIM }}>PAD LEFT</div><div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 130, color: mm <= 3 ? RED : VER }}>{mm} mm</div></div>
    <Tag tt={tt} at={3.4} x={1590} y={780} txt="WEAR ITEM" col={RED} />
  </>;
}}</Stage>;

// 18 · dominó 3D: la manguera barata cae y voltea al motor caro (daño consecuente)
const Domino3D: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#16191d" mesa={false}>{(tt) => {
  const D = [["HOSE", "$40", "NOT COVERED"], ["OVERHEAT", "", ""], ["ENGINE", "$6,000", "COVERED?"]];
  return <><Scene rx={-16} ry={-30} s={1.0} y={640} x={880}>
    <div style={{ position: "absolute", left: -700, top: 180, width: 1400, height: 30, background: "#2a2e33", transform: "rotateX(90deg) translateZ(-15px)" }} />
    {D.map(([a, b], i) => { const fall = eio(tt, 1.0 + i * 0.55, 1.5 + i * 0.55), sz = 1 + i * 0.45;
      return <div key={i} style={{ position: "absolute", transformStyle: "preserve-3d", transform: `translate3d(${-460 + i * 420}px,${180}px,0) rotateZ(${fall * (i < 2 ? 70 : 62)}deg)`, transformOrigin: "0 0" }}>
        <Box w={120 * sz} h={320 * sz} d={60} y={-160 * sz} x={60 * sz} c={i === 2 ? "linear-gradient(#e8eaec,#b9c0c5)" : "linear-gradient(#f4efe3,#d8d0bd)"}
          front={<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: F, color: i === 1 ? RED : "#222" }}>
            <div style={{ fontSize: 40 + 14 * i, writingMode: "vertical-rl", transform: "rotate(180deg)" }}>{a}</div>{b && <div style={{ fontSize: 30 + 12 * i, color: BR, marginTop: 10 }}>{b}</div>}</div>} />
      </div>; })}
  </Scene>
    <Tag tt={tt} at={0.4} x={330} y={190} txt="NOT COVERED" col={RED} />
    <Tag tt={tt} at={3.2} x={1560} y={190} txt="NO PAY" col={MZ} />
  </>;
}}</Stage>;

// 19 · deducible por visita vs por reparación: tickets de $100 que se apilan
const Tickets: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#17191c">{(tt) => {
  const col = (x: number, n: number, ttl: string, a0: number, tot: string) => <div style={ab(x, 160, { transform: "translateX(-50%)", width: 600, textAlign: "center" })}>
    <div style={{ fontFamily: F, fontSize: 56, color: TX, marginBottom: 30 }}>{ttl}</div>
    {Array.from({ length: n }, (_, i) => { const k = phys(tt, a0 + i * 0.6, 8, 0.45);
      return <div key={i} style={{ margin: "0 auto 18px", width: 440, height: 130, borderRadius: 14, background: "linear-gradient(90deg,#c8f0c8,#9fd89f)", border: "4px dashed #2e7d32", transform: `translateY(${(1 - k) * -300}px) rotate(${(i - 1) * 2}deg)`, opacity: cl(k * 3), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontSize: 64, color: "#1b5e20" }}>$100</div>; })}
    <div style={{ fontFamily: F, fontSize: 90, color: n > 1 ? RED : VER, opacity: e1(tt, a0 + n * 0.6 + 0.3), marginTop: 20 }}>{tot}</div>
  </div>;
  return <>{col(560, 1, "PER VISIT", 0.6, "$100")}{col(1360, 3, "PER REPAIR", 1.0, "$300")}
    <div style={ab(960, 150, { width: 6, height: 820, background: "rgba(255,255,255,.15)" })} /></>;
}}</Stage>;

// 20 · cinco conos naranjas que saltan del piso, uno por error
const Conos3D: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#15181b">{(tt) => <>
  {Array.from({ length: 5 }, (_, i) => { const k = phys(tt, 0.4 + i * 0.4, 8, 0.4), x = 360 + i * 300;
    return <div key={i} style={ab(x, 820, { transform: `translate(-50%,-100%) scaleY(${cl(k)}) `, transformOrigin: "50% 100%" })}>
      <svg width={220} height={360} viewBox="0 0 220 360"><path d="M80 10 L140 10 L200 320 L20 320 Z" fill="#ff7a1a" /><path d="M66 90 L154 90 L166 150 L54 150 Z" fill="#fff" /><path d="M42 210 L178 210 L188 260 L32 260 Z" fill="#fff" /><rect x={0} y={318} width={220} height={40} rx={8} fill="#c95a0c" /></svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: -96, textAlign: "center", fontFamily: F, fontSize: 80, color: MZ, opacity: e1(tt, 0.6 + i * 0.4) }}>{i + 1}</div>
    </div>; })}
  <Tag tt={tt} at={2.8} x={960} y={160} txt="5 MISTAKES" col={TX} />
</>}</Stage>;

// 21 · el cheque en blanco: se firma, el monto queda vacío y cae el sello NEVER
const Cheque: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#1a1d20">{(tt) => {
  const sig = eio(tt, 0.7, 1.9), st = phys(tt, 2.4, 9, 0.35), cur = Math.floor(tt * 2) % 2;
  return <>
    <div style={ab(960, 520, { transform: "translate(-50%,-50%) rotate(-3deg)", width: 1300, height: 560, borderRadius: 16, background: "linear-gradient(135deg,#dff0e6,#bfdccb)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", padding: "50px 70px", boxSizing: "border-box", fontFamily: "monospace", fontWeight: 700, color: "#1d3b2c" })}>
      <div style={{ fontSize: 34 }}>PAY TO THE ORDER OF ______________________</div>
      <div style={ab(860, 120, { width: 340, height: 100, border: "5px solid #1d3b2c", borderRadius: 8, display: "flex", alignItems: "center", padding: "0 20px", fontSize: 64 })}>$ <span style={{ opacity: cur }}>|</span></div>
      <div style={{ marginTop: 160, fontSize: 30 }}>MEMO: whatever it needs</div>
      <svg width={460} height={140} style={ab(740, 380)}><path d="M10 100 C60 20 90 130 140 60 S220 20 250 90 S330 40 360 80 S420 60 450 70" stroke="#1a2b8a" strokeWidth={6} fill="none" strokeDasharray={900} strokeDashoffset={900 * (1 - sig)} /></svg>
    </div>
    {tt > 2.4 && <div style={ab(960, 520, { transform: `translate(-50%,-50%) rotate(-14deg) scale(${2.2 - 1.2 * cl(st)})`, opacity: cl(st * 2), padding: "18px 60px", border: `14px solid ${RED}`, borderRadius: 20, fontFamily: F, fontSize: 150, color: RED, letterSpacing: 10 })}>NEVER</div>}
  </>;
}}</Stage>;

// 22 · el basurero: cae la pieza vieja y detrás el reclamo; la tapa se cierra
const Basurero: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#15191b">{(tt) => {
  const p1 = eio(tt, 0.5, 1.4), p2 = eio(tt, 1.6, 2.5), lid = eio(tt, 2.8, 3.3);
  return <>
    <div style={ab(960, 640, { transform: "translate(-50%,0)", width: 520, height: 420, background: "repeating-linear-gradient(90deg,#5f666b 0 30px,#4a5056 30px 60px)", clipPath: "polygon(0 0,100% 0,90% 100%,10% 100%)", boxShadow: "0 40px 70px rgba(0,0,0,.6)", zIndex: 2 })} />
    <div style={ab(960, 630 - 380 * (1 - lid), { transform: "translate(-50%,-50%)", width: 580, height: 46, borderRadius: 23, background: "linear-gradient(#8d959b,#5f666b)", opacity: e1(tt, 2.6), zIndex: 3, boxShadow: "0 10px 20px rgba(0,0,0,.5)" })}><div style={ab(240, -26, { width: 100, height: 30, borderRadius: "14px 14px 0 0", border: "8px solid #7c838a", borderBottom: "none" })} /></div>
    <div style={ab(lerp(560, 960, p1), lerp(160, 700, p1 * p1), { transform: `translate(-50%,-50%) rotate(${p1 * 200}deg)`, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,#3a3f45 0 20%,#8a6b4e 21% 50%,#5c4632 51%)", opacity: p1 < 1 ? 1 : 0, zIndex: 1 })} />
    <div style={ab(lerp(1360, 960, p2), lerp(160, 700, p2 * p2), { transform: `translate(-50%,-50%) rotate(${-p2 * 90}deg)`, width: 240, height: 320, background: PAPER, padding: 24, boxSizing: "border-box", fontFamily: F, fontSize: 34, color: "#333", opacity: p2 < 1 ? 1 : 0, zIndex: 1 })}>CLAIM<div style={{ marginTop: 16 }}>{lines(5, 100, 26)}</div></div>
    <Tag tt={tt} at={3.2} x={1500} y={300} txt="CLAIM GONE" col={RED} />
    <Tag tt={tt} at={3.6} x={420} y={300} txt="KEEP PARTS" col={VER} />
  </>;
}}</Stage>;

// 23 · la ruta: el coche pasa el último poste del contrato por 300 millas
const Carretera: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#11161a" mesa={false}>{(tt) => {
  const run = tt * 260;
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 380, bottom: 0, background: "linear-gradient(#2c3a28,#1c2618)" }} />
    <div style={{ position: "absolute", left: "50%", top: 380, width: 1600, height: 700, marginLeft: -800, background: "#33373b", clipPath: "polygon(48% 0,52% 0,100% 100%,0 100%)" }} />
    {Array.from({ length: 8 }, (_, i) => { const z = ((i * 140 + run) % 1120) / 1120, y = 380 + z * z * 700, w = 6 + z * 40, hh = 10 + z * 90;
      return <div key={i} style={ab(960 - w / 2, y, { width: w, height: hh, background: "#e9d34a" })} />; })}
    {[0.25, 0.6].map((p, i) => { const z = cl(p + eio(tt, 0.4, 3.6) * 0.5), y = 380 + z * z * 700, s = 0.2 + z * 1.4, last = i === 1;
      return <div key={i} style={ab(1120 + z * 180, y - 160 * s, { transform: `scale(${Math.min(s, 1.05)})`, transformOrigin: "0 100%" })}>
        <div style={{ width: 16, height: 160, background: "#ccc", margin: "0 auto" }} /><div style={{ position: "absolute", top: -40, left: -90, padding: "10px 20px", background: last ? RED : "#2e7d32", color: "#fff", fontFamily: F, fontSize: 40, whiteSpace: "nowrap" }}>{last ? "CONTRACT ENDS" : "COVERED"}</div></div>; })}
    <svg width={560} height={293} style={ab(680, 760)} viewBox="0 0 420 220"><path d="M20 160 L60 90 Q80 60 130 60 L300 60 Q350 60 370 100 L400 160 Z" fill="#c62828" /><rect x={30} y={150} width={370} height={40} rx={12} fill="#8e1c1c" />{[100, 320].map((cx) => <circle key={cx} cx={cx} cy={192} r={26} fill="#111" />)}</svg>
    <div style={ab(560, 150, { transform: "translateX(-50%)", fontFamily: "monospace", fontWeight: 900, fontSize: 110, color: tt > 2.6 ? RED : TX, opacity: e1(tt, 0.4), whiteSpace: "nowrap" })}>{tt > 2.6 ? "+300 MI" : "36,000"}</div>
  </>;
}}</Stage>;

// 24 · la escalera de 8 escalones de la rutina, en 3D
const Escalera3D: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#14181b" mesa={false}>{(tt) => {
  const st = Math.min(8, Math.floor(tt / 0.7) + 1);
  return <><Scene rx={-20} ry={-35} s={0.95} y={640}>
    {Array.from({ length: 8 }, (_, i) => <Box key={i} w={300} h={70} d={200} x={-560 + i * 150} y={-i * 70} z={0} c={i < st ? "linear-gradient(#ffd23a,#e0a800)" : "linear-gradient(#5f666b,#3a3f45)"} top={i < st ? "#ffe27a" : "#7c838a"}
      front={<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontSize: 48, color: i < st ? TIN : "#ccc" }}>{i + 1}</div>} />)}
  </Scene>
    <Tag tt={tt} at={5.4} x={1500} y={200} txt="8 STEPS" col={MZ} />
    <Tag tt={tt} at={5.8} x={1500} y={330} txt="15 MINUTES" col={VER} />
  </>;
}}</Stage>;

// 25 · el celular le saca foto al tablero: flash y la miniatura guarda las millas
const Flash: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#0f1215" mesa={false}>{(tt) => {
  const up = eio(tt, 0.3, 1.1), fl = tt > 1.6 ? Math.exp(-(tt - 1.6) * 6) : 0, fly = eio(tt, 2.2, 3.0);
  const dash = <div style={{ width: "100%", height: "100%", background: "radial-gradient(ellipse at 50% 60%,#1d2228,#0b0d0f)", position: "relative" }}>
    {[0.3, 0.7].map((x, i) => <div key={i} style={{ position: "absolute", left: `${x * 100}%`, top: "50%", width: "34%", aspectRatio: "1", transform: "translate(-50%,-50%)", borderRadius: "50%", border: "6px solid #4a5056", boxShadow: "inset 0 0 30px rgba(120,200,255,.25)" }}><div style={{ position: "absolute", left: "50%", top: "10%", width: 6, height: "40%", background: "#ff6a3a", transformOrigin: "50% 100%", transform: `rotate(${i ? 20 : -50}deg)` }} /></div>)}
    <div style={{ position: "absolute", left: "50%", bottom: "14%", transform: "translateX(-50%)", padding: "6px 18px", background: "#071018", color: "#7fe0ff", fontFamily: "monospace", fontSize: "4vh", fontWeight: 900 }}>081,240 mi</div></div>;
  return <>
    <div style={{ position: "absolute", inset: 0 }}>{dash}</div>
    <div style={ab(960, lerp(1400, 540, up), { transform: `translate(-50%,-50%) scale(${1 - fly * 0.6}) translate(${fly * 900}px,${fly * -500}px)`, width: 520, height: 900, borderRadius: 60, background: "#0b0b0c", padding: 22, boxSizing: "border-box", boxShadow: "0 40px 80px rgba(0,0,0,.7)" })}>
      <div style={{ width: "100%", height: "100%", borderRadius: 42, overflow: "hidden" }}>{dash}</div>
    </div>
    <div style={{ position: "absolute", inset: 0, background: `rgba(255,255,255,${fl})` }} />
    <Tag tt={tt} at={3.0} x={600} y={160} txt="MILES SAVED" col={MZ} />
  </>;
}}</Stage>;

// 26 · el taller de Don Chuy en Monterrey: una sola bombilla que se balancea sobre el piso de tierra
const Bombilla: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#140f0a" mesa={false}>{(tt) => {
  const sw = Math.sin(tt * 1.6) * 10;
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, bottom: 0, background: "radial-gradient(ellipse at 50% 0%,#6b5032,#2b1f12 70%)" }} />
    <div style={ab(960, 0, { transformOrigin: "0 0", transform: `rotate(${sw}deg)` })}>
      <div style={ab(-3, 0, { width: 6, height: 380, background: "#222" })} />
      <div style={ab(-34, 370, { width: 68, height: 60, background: "linear-gradient(#5a5a5a,#2a2a2a)", borderRadius: 6 })} />
      <div style={ab(-60, 420, { width: 120, height: 150, borderRadius: "50% 50% 46% 46%", background: "radial-gradient(circle at 50% 40%,#fff8d0,#ffcf5a 60%,#c98a1a)", boxShadow: "0 0 120px 60px rgba(255,200,90,.45)" })} />
      <div style={ab(-500, 560, { width: 1000, height: 800, background: "radial-gradient(ellipse at 50% 0%,rgba(255,210,120,.28),transparent 70%)", clipPath: "polygon(44% 0,56% 0,100% 100%,0 100%)" })} />
    </div>
    <div style={ab(1450, 520, { width: 120, height: 230, background: "linear-gradient(#c62828,#7f1515)", borderRadius: "10px 10px 40px 20px", transform: "rotate(6deg)", boxShadow: "0 10px 20px rgba(0,0,0,.5)" })} />
    <div style={{ position: "absolute", inset: 0, background: "rgba(80,50,20,.18)", mixBlendMode: "multiply" }} />
    <Tag tt={tt} at={1.2} x={420} y={200} txt="MONTERREY" col={MZ} hand />
  </>;
}}</Stage>;

// 27 · la palanca de cambios va a D y el tablero prende SAFE MODE
const Palanca: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#121417">{(tt) => {
  const g = ["P", "R", "N", "D", "L"], pos = Math.min(3, Math.floor(eio(tt, 0.3, 1.6) * 3.99)), warn = tt > 2.0 ? (Math.sin(tt * 8) > 0 ? 1 : 0.5) : 0;
  return <>
    <div style={ab(620, 560, { transform: "translate(-50%,-50%)", width: 360, height: 700, borderRadius: 40, background: "linear-gradient(#2a2d31,#141619)", boxShadow: "0 40px 70px rgba(0,0,0,.6)" })}>
      {g.map((x, i) => <div key={x} style={ab(250, 90 + i * 115, { fontFamily: F, fontSize: 64, color: i === pos ? "#ff5a3a" : "#777" })}>{x}</div>)}
      <div style={ab(70, 80, { width: 40, height: 560, borderRadius: 20, background: "#0a0b0c" })} />
      <div style={ab(20, 60 + pos * 115, { width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#5a5e64,#1d1f22)", boxShadow: "0 12px 24px rgba(0,0,0,.6)" })} />
    </div>
    <div style={ab(1340, 540, { transform: "translate(-50%,-50%)", width: 720, height: 360, borderRadius: 30, background: "#07090b", boxShadow: "inset 0 0 0 10px #1d2024", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: e1(tt, 1.8) })}>
      <div style={{ fontSize: 110, color: `rgba(255,170,40,${warn})` }}>⚠</div><div style={{ fontFamily: F, fontSize: 70, color: `rgba(255,170,40,${warn})`, letterSpacing: 4 }}>SAFE MODE</div>
    </div>
    <Tag tt={tt} at={3.2} x={1340} y={880} txt="READ CODES" col={VER} />
  </>;
}}</Stage>;

// 28 · el reembolso: la barra de lo pagado, lo que vuelve y la tijera que corta la comisión
const Reembolso: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#171a1d">{(tt) => {
  const b = eio(tt, 0.3, 1.2), r = eio(tt, 1.4, 2.6), cut = eio(tt, 2.8, 3.4);
  return <>
    <div style={ab(260, 300, { fontFamily: F, fontSize: 48, color: DIM })}>WHAT YOU PAID</div>
    <div style={ab(260, 370, { width: 1400 * b, height: 120, borderRadius: 16, background: "linear-gradient(#5b7fa8,#3c5f86)" })} />
    <div style={ab(260, 560, { fontFamily: F, fontSize: 48, color: VER, opacity: e1(tt, 1.3) })}>PART OF IT BACK</div>
    <div style={ab(260, 630, { width: 840 * r, height: 120, borderRadius: "16px 0 0 16px", background: "linear-gradient(#5cc98a,#2e8b57)" })} />
    <div style={ab(260 + 840 * r, 630, { width: 160 * r, height: 120, borderRadius: "0 16px 16px 0", background: "repeating-linear-gradient(45deg,#c62828 0 14px,#a11 14px 28px)", transform: `translate(${cut * 120}px,${cut * 180}px) rotate(${cut * 25}deg)`, opacity: 1 - cut * 0.4 })} />
    <div style={ab(1120 + cut * 40, 540, { fontSize: 200, color: "#e8eaec", transform: `rotate(${-30 + 30 * Math.sin(tt * 10) * (tt > 2.6 && tt < 3.4 ? 1 : 0)}deg)`, opacity: e1(tt, 2.5) })}>✂</div>
    <Tag tt={tt} at={3.4} x={1460} y={900} txt="MINUS A FEE" col={RED} />
  </>;
}}</Stage>;

// 29 · la gota de refrigerante cae en la entrada y el charco verde crece
const Charco: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#15191c" mesa={false}>{(tt) => {
  const per = 0.9, ph = (tt % per) / per, n = Math.floor(tt / per), pud = cl(tt / 5);
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 300, background: "linear-gradient(#3a3f45,#23272b)" }}>
      <div style={ab(860, 220, { width: 200, height: 80, borderRadius: 20, background: "linear-gradient(#6b7277,#454b50)" })} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, bottom: 0, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.08) 0 2px,transparent 2px 260px),linear-gradient(#b9b4a8,#8f8a7e)" }} />
    <div style={ab(960, 880, { transform: "translate(-50%,-50%)", width: 200 + pud * 900, height: 60 + pud * 240, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(80,230,120,.85),rgba(40,170,80,.75) 60%,rgba(40,170,80,0) 72%)" })} />
    <div style={ab(960, lerp(300, 860, ph * ph), { transform: "translate(-50%,-50%)", width: 36, height: 50, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 40% 35%,#c8ffd8,#33c46a)", opacity: ph < 0.95 ? 1 : 0 })} />
    {n > 0 && <div style={ab(960, 870, { transform: "translate(-50%,-50%)", width: 40 + ph * 260, height: 14 + ph * 70, borderRadius: "50%", border: `4px solid rgba(220,255,230,${1 - ph})` })} />}
    <Tag tt={tt} at={2.2} x={1500} y={460} txt="COOLANT" col={VER} />
    <Tag tt={tt} at={3.2} x={420} y={460} txt="NOT THE A/C" col={MZ} />
  </>;
}}</Stage>;

// 30 · la frase en tres piezas de rompecabezas que encastran
const Frase3: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#121519">{(tt) => {
  const P = [["DIAGNOSE IT", "WRITE ME AN ESTIMATE", "#3d7bd9"], ["DON'T TOUCH IT", "UNTIL I SAY YES", "#e0a800"], ["IS THIS MY", "WARRANTY'S JOB?", "#4caf7d"]];
  return <>{P.map(([a, b, c], i) => { const k = phys(tt, 0.4 + i * 1.3, 7, 0.5), x = 340 + i * 620;
    return <div key={i} style={ab(x, 540, { transform: `translate(-50%,-50%) translateY(${(1 - cl(k)) * (i % 2 ? 700 : -700)}px)`, width: 600, height: 420 })}>
      <svg width={600} height={420} style={{ position: "absolute", inset: 0 }} viewBox="0 0 600 420"><path d={`M0 20 Q0 0 20 0 L580 0 Q600 0 600 20 L600 150 ${i < 2 ? "Q660 150 660 210 Q660 270 600 270" : ""} L600 400 Q600 420 580 420 L20 420 Q0 420 0 400 L0 270 ${i > 0 ? "Q60 270 60 210 Q60 150 0 150" : ""} Z`} fill={c} stroke="rgba(255,255,255,.4)" strokeWidth={6} /></svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: F, color: "#fff", textAlign: "center", padding: "0 60px" }}>
        <div style={{ fontSize: 50 }}>{a}</div><div style={{ fontSize: 34, marginTop: 14, opacity: 0.9 }}>{b}</div></div>
    </div>; })}
    <div style={ab(960, 160, { transform: "translateX(-50%)", fontFamily: F, fontSize: 60, color: MZ, opacity: e1(tt, 4.2), whiteSpace: "nowrap" })}>THE SENTENCE · 3 PARTS</div>
  </>;
}}</Stage>;

// 31 · la guantera se abre en 3D y adentro, la notita amarilla con la frase
const Guantera3D: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#121518" mesa={false}>{(tt) => {
  const op = eio(tt, 0.5, 1.6), note = phys(tt, 1.5, 7, 0.5);
  return <><div style={ab(960, 170, { transform: "translateX(-50%)", width: 1200, perspective: 1400 })}>
    <div style={{ width: 1200, height: 120, borderRadius: "40px 40px 0 0", background: "linear-gradient(#3a3f45,#24282c)" }} />
    <div style={{ position: "relative", width: 1200, height: 520, background: "linear-gradient(#060708,#14171a)", boxShadow: "inset 0 30px 60px rgba(0,0,0,.9)" }}>
      <div style={ab(80, 360, { width: 300, height: 120, background: "#4a5056", borderRadius: 8, transform: "rotate(-4deg)" })} />
      <div style={ab(330, 60 + (1 - note) * 40, { width: 560, height: 330, background: "#ffe066", transform: `rotate(-2deg) scale(${0.85 + 0.15 * note})`, opacity: cl(note * 2), padding: 30, boxSizing: "border-box", fontFamily: HAND, fontSize: 44, fontWeight: 700, color: "#2a2a6a", lineHeight: 1.12, boxShadow: "0 16px 30px rgba(0,0,0,.6)" })}>Diagnose it, write me an estimate. Nothing until I say YES. Is this my warranty's job?</div>
      <div style={ab(900, 210, { width: 230, height: 180, background: "#ffd6e0", transform: "rotate(4deg)", padding: 18, boxSizing: "border-box", fontFamily: HAND, fontSize: 32, fontWeight: 700, color: "#6a2a3a", opacity: e1(tt, 2.2) })}>Auth # in writing</div>
      <div style={ab(0, 0, { width: 1200, height: 520, transformOrigin: "50% 100%", transform: `rotateX(${-88 * op}deg)`, background: "linear-gradient(#4a5056,#2f3438)", borderRadius: "0 0 30px 30px", boxShadow: "0 20px 40px rgba(0,0,0,.5)" })}>
        <div style={ab(540, 40, { width: 120, height: 36, borderRadius: 18, background: "#1d2024" })} />
      </div>
    </div>
  </div><Tag tt={tt} at={2.6} x={960} y={110} txt="GLOVE BOX" col={MZ} /></>;
}}</Stage>;

export const TEC: Record<string, C> = {
  carpeta3d: Carpeta3D, ticket: Ticket, anios: Anios, cajonera3d: Cajonera3D, cinta: Cinta, sobre3d: Sobre3D, paraguas: Paraguas, tablero: Tablero,
  mazo: Mazo, grapadora: Grapadora, telefono: Telefono, explosion3d: Explosion3D, taximetro: Taximetro, calculadora: Calculadora, orden: Orden,
  resaltador: Resaltador, pastilla3d: Pastilla3D, domino3d: Domino3D, tickets: Tickets, conos3d: Conos3D, cheque: Cheque, basurero: Basurero,
  carretera: Carretera, escalera3d: Escalera3D, flash: Flash, bombilla: Bombilla, palanca: Palanca, reembolso: Reembolso, charco: Charco,
  frase3: Frase3, guantera3d: Guantera3D,
};
