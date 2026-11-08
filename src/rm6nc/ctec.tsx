// c9c.tsx · componentes ÚNICOS de rm6nc (sesE, Ramón: «Seniors: never let a mechanic do these 6 things to your car»). Inglés.
// Ninguno repite los de rm6na (c6a), rm6nb (c7b), tec5na/b/c (c5a/c5b/c8c). Objetos dibujados en código; 3D = CSS 3D real.
// El tiempo tt de Stage llega comprimido a ~0-4,4 s: toda la animación vive en esa ventana.
import React from "react";
import { cl, DIM, eio, H, HAND, lerp, MZ, phys, RED, rnd, Stage, Tag, TX, VER } from "./ckit";

type C = React.FC<{ t: number; h: H }>;
const ab = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });
const F = "'Arial Black', Arial, sans-serif";
const M = "'Courier New', monospace";
const INK = "#26314f", PAPER = "linear-gradient(#fbf7ea,#ece3cb)";
const txt = (x: number, y: number, s: number, c: string, o = 1, font = F): React.CSSProperties => ({ position: "absolute", left: x, top: y, fontFamily: font, fontSize: s, fontWeight: 900, color: c, opacity: o, lineHeight: 1, whiteSpace: "nowrap" });
const mid = (w: number, y: number, s: number, c: string, o = 1, font = F): React.CSSProperties => ({ ...txt(0, y, s, c, o, font), width: w, textAlign: "center" });
const shadow = "0 34px 70px rgba(0,0,0,.55)";
// renglón tachado con marcador rojo (k = 0..1 avance del trazo)
const Strike: React.FC<{ x: number; y: number; w: number; k: number; c?: string; h?: number }> = ({ x, y, w, k, c = RED, h = 12 }) => (
  <div style={ab(x, y, { width: w * cl(k), height: h, borderRadius: h, background: c, opacity: 0.88, transform: "rotate(-1.2deg)", boxShadow: "0 0 6px rgba(200,40,30,.35)" })} />
);
const Check: React.FC<{ x: number; y: number; k: number; s?: number; c?: string }> = ({ x, y, k, s = 1, c = VER }) => (
  <svg style={ab(x, y)} width={70 * s} height={60 * s} viewBox="0 0 70 60"><path d="M6 32 L26 52 L64 8" fill="none" stroke={c} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={100} strokeDashoffset={100 * (1 - cl(k))} /></svg>
);

// 1 · la factura ajena cae sobre el mostrador y el marcador rojo baja renglón por renglón
const Factura: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#231c16">{(tt) => {
  const k = phys(tt, 0.2, 6, 0.6), L = ["OIL CHANGE", "NITROGEN FILL", "FLUSH x2", "DIAG + RESET", "AIR FILTERS", "TOTAL  $612"];
  return <>
    <div style={ab(560, 150, { width: 800, height: 780, background: PAPER, boxShadow: shadow, transform: `rotate(${-2 + (1 - k) * 10}deg) translateY(${(1 - k) * -300}px)` })}>
      <div style={mid(800, 50, 44, "#3b3b3b")}>QUICK LUBE · INVOICE</div>
      {L.map((l, i) => <div key={i} style={{ ...txt(70, 170 + i * 92, i === 5 ? 50 : 40, i === 5 ? RED : "#2a2a2a", cl((tt - 0.5 - i * 0.18) * 4), M) }}>{l}</div>)}
      {L.slice(0, 5).map((_, i) => <div key={i} style={ab(560, 168 + i * 92, { width: 44, height: 44, borderRadius: 8, border: "4px solid #b8ad92" })}><Check x={-2} y={-8} k={(tt - 1.6 - i * 0.35) * 3} s={0.7} c={RED} /></div>)}
    </div>
    <div style={ab(1390 - eio(tt, 1.2, 3.4) * 120, 220 + eio(tt, 1.2, 3.4) * 380, { width: 54, height: 330, borderRadius: 14, background: "linear-gradient(90deg,#9c1c14,#e0402e 45%,#8d150f)", transform: "rotate(28deg)", boxShadow: shadow })}>
      <div style={ab(8, 300, { width: 38, height: 60, borderRadius: "6px 6px 20px 20px", background: "#2a2a2a" })} />
    </div>
    <Tag tt={tt} at={3.6} x={960} y={1000} txt="LINE BY LINE" col={MZ} />
  </>;
}}</Stage>;

// 2 · seis cartas boca abajo; la sexta, el doble de grande y con candado (se revela al final)
const SeisUno: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#1a1d24">{(tt) => <>
  {Array.from({ length: 6 }, (_, i) => {
    const s = phys(tt, 0.3 + i * 0.32, 7, 0.5), big = i === 5, w = big ? 330 : 200, hh = big ? 460 : 290;
    return <div key={i} style={ab(130 + i * 270 + (big ? -40 : 0), (big ? 300 : 380) + (1 - s) * 260, { width: w, height: hh, borderRadius: 18, opacity: cl(s * 2), background: big ? "linear-gradient(#7a1d16,#3d0d09)" : "linear-gradient(#e9e2cf,#c9bfa6)", boxShadow: big ? `0 0 ${60 * cl(tt - 2.6)}px rgba(230,70,40,.6), ${shadow}` : shadow, transform: `rotate(${(i - 2.5) * 2}deg)` })}>
      <div style={mid(w, big ? 120 : 80, big ? 170 : 120, big ? "#ffd7c8" : "#3a3328")}>{i + 1}</div>
      {big && <div style={mid(w, 340, 40, "#ffb59e", cl((tt - 2.8) * 3))}>COSTS MOST</div>}
    </div>;
  })}
</>}</Stage>;

// 3 · la tabla con clip se acerca a la ventanilla del auto
const Portapapeles: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#1d232a">{(tt) => {
  const k = eio(tt, 0.3, 2.4);
  return <>
    <div style={ab(180, 170, { width: 900, height: 640, borderRadius: "60px 200px 20px 20px", background: "linear-gradient(#3c4651,#1f252c)", boxShadow: shadow })}>
      <div style={ab(60, 60, { width: 760, height: 420, borderRadius: "40px 170px 10px 10px", background: "linear-gradient(160deg,rgba(170,200,225,.35),rgba(40,60,80,.65))", boxShadow: "inset 0 0 0 8px #11161b" })} />
    </div>
    <div style={ab(lerp(1500, 760, k), lerp(260, 300, k), { width: 420, height: 560, borderRadius: 16, background: "linear-gradient(#a8743f,#7d5228)", boxShadow: shadow, transform: `rotate(${lerp(12, -6, k)}deg) scale(${lerp(0.8, 1.08, k)})` })}>
      <div style={ab(140, -26, { width: 140, height: 60, borderRadius: 10, background: "linear-gradient(#d9dee3,#8b939b)" })} />
      <div style={ab(30, 50, { width: 360, height: 480, background: "#fbf8ee" })}>
        {["RECOMMEND:", "□ ______", "□ ______", "□ ______", "□ ______"].map((l, i) => <div key={i} style={{ ...txt(26, 34 + i * 82, 36, i ? "#555" : RED, cl((tt - 1.4 - i * 0.25) * 3), M) }}>{l}</div>)}
      </div>
    </div>
    <div style={{ ...txt(1180, 830, 64, TX, cl((tt - 2.6) * 2), HAND), fontWeight: 700 }}>"Ma'am, I'd recommend…"</div>
  </>;
}}</Stage>;

// 4 · balanza: en un plato la palabra POLITE, en el otro la factura de $612 que la hunde
const Cortesia: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#201a22">{(tt) => {
  const drop = eio(tt, 1.3, 2.6), a = -14 * drop;
  return <>
    <div style={ab(940, 300, { width: 40, height: 560, background: "linear-gradient(90deg,#8a6a2a,#e0c070,#8a6a2a)" })} />
    <div style={ab(800, 840, { width: 320, height: 40, borderRadius: 10, background: "#6f5520" })} />
    <div style={ab(960, 300, { transform: `rotate(${a}deg)` })}>
      <div style={ab(-560, -10, { width: 1120, height: 20, borderRadius: 10, background: "linear-gradient(#e0c070,#8a6a2a)" })} />
      {[-1, 1].map((s) => <div key={s} style={ab(s * 520 - 170, 10, { transform: `rotate(${-a}deg)`, transformOrigin: "170px 0" })}>
        <div style={ab(168, 0, { width: 4, height: 220, background: "#c8a85a" })} />
        <div style={ab(0, 220, { width: 340, height: 40, borderRadius: "0 0 170px 170px", background: "linear-gradient(#e0c070,#8a6a2a)" })} />
        {s < 0 ? <div style={{ ...mid(340, 160, 52, MZ, 1, HAND), fontWeight: 700 }}>polite</div>
          : <div style={ab(60, 220 - 170 * cl((tt - 0.9) * 3), { width: 220, height: 170, background: PAPER, opacity: cl((tt - 0.9) * 3), boxShadow: shadow })}><div style={mid(220, 54, 56, RED)}>$612</div></div>}
      </div>)}
    </div>
    <Tag tt={tt} at={3.0} x={960} y={150} txt="HOW MUCH?" col={MZ} />
  </>;
}}</Stage>;

// 5 · la calcomanía del parabrisas se despega en la esquina y debajo aparece el número del manual
const Calco: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#17202a" mesa={false}>{(tt) => {
  const peel = eio(tt, 1.6, 3.2);
  return <>
    <div style={ab(-100, 80, { width: 2120, height: 900, borderRadius: "50% 50% 8% 8% / 18% 18% 8% 8%", background: "linear-gradient(170deg,rgba(150,185,215,.32),rgba(30,45,60,.75))", boxShadow: "inset 0 0 0 26px #0f1317" })} />
    <div style={ab(1260, 230, { width: 420, height: 300, borderRadius: 14, background: "#f8f4e6", boxShadow: shadow })}>
      <div style={mid(420, 40, 30, "#555")}>YOUR MANUAL</div>
      <div style={{ ...mid(420, 120, 92, VER, 1, HAND), fontWeight: 700 }}>7,500</div>
    </div>
    <div style={ab(1260, 230, { width: 420, height: 300, transformOrigin: "100% 0%", transform: `perspective(1200px) rotateY(${-peel * 120}deg) rotateZ(${peel * 10}deg)`, opacity: 1 - cl((peel - 0.8) * 5) })}>
      <div style={{ width: 420, height: 300, borderRadius: 14, background: "linear-gradient(#fff3b0,#f1d65a)", boxShadow: shadow }}>
        <div style={mid(420, 36, 30, "#5a4a10")}>NEXT SERVICE</div>
        <div style={mid(420, 110, 96, "#2a2408")}>3,000</div>
        <div style={mid(420, 220, 30, "#5a4a10")}>MILES</div>
      </div>
    </div>
    <Tag tt={tt} at={2.8} x={700} y={820} txt="WHO SAYS?" col={MZ} />
  </>;
}}</Stage>;

// 6 · dos épocas: 1970 aceite fino → 3.000; hoy barras que crecen a 5.000 / 7.500 / 10.000
const Aceites: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1b1f1a">{(tt) => {
  const B = [["THEN", 3000, DIM], ["TODAY", 5000, MZ], ["", 7500, MZ], ["", 10000, VER]] as const;
  return <>
    <div style={ab(220, 860, { width: 1480, height: 6, background: "rgba(255,255,255,.35)" })} />
    {B.map(([lab, v, c], i) => { const g = eio(tt, 0.4 + i * 0.55, 1.4 + i * 0.55), hh = (v / 10000) * 560 * g;
      return <div key={i} style={ab(300 + i * 360, 860 - hh, { width: 220, height: hh, borderRadius: "16px 16px 0 0", background: `linear-gradient(${c},rgba(0,0,0,.3))`, boxShadow: shadow })}>
        <div style={{ ...mid(220, -70, 52, c, cl(g * 2)) }}>{v.toLocaleString("en-US")}</div>
        <div style={{ ...mid(220, hh + 26, 36, TX, cl(g * 2)) }}>{lab}</div>
      </div>; })}
    <div style={ab(1060, 900, { width: 3, height: 1 })} />
    <div style={{ ...txt(270, 120, 44, DIM, cl(tt - 2.6)) }}>MILES BETWEEN CHANGES · YOUR MANUAL DECIDES</div>
  </>;
}}</Stage>;

// 7 · la cuenta: 6.000 millas al año ÷ sticker = 2 cambios; ÷ manual = 1 → +$50 al año
const CuentaAceite: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#1e1a14">{(tt) => {
  const r = (a: number) => cl((tt - a) * 2.5);
  return <div style={ab(330, 170, { width: 1260, height: 740, background: PAPER, boxShadow: shadow, borderRadius: 10 })}>
    <div style={{ ...txt(70, 60, 64, INK, r(0.2), HAND), fontWeight: 700 }}>6,000 miles a year</div>
    <div style={{ ...txt(70, 200, 58, "#7a5a10", r(0.9), HAND), fontWeight: 700 }}>sticker  ÷ 3,000 = 2 changes</div>
    <div style={{ ...txt(70, 320, 58, "#1f6a3a", r(1.6), HAND), fontWeight: 700 }}>manual  → about 1 change</div>
    <div style={ab(70, 450, { width: 1100 * eio(tt, 2.2, 2.8), height: 6, background: INK })} />
    <div style={{ ...txt(70, 500, 92, RED, r(2.8), HAND), fontWeight: 700 }}>+1 change = $50 a year</div>
  </div>;
}}</Stage>;

// 8 · la puerta del taller: el aceite es la puerta, la calcomanía es la llave para volver
const Puerta: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1a1c20">{(tt) => {
  const op = eio(tt, 1.6, 3.0), key = phys(tt, 0.5, 6, 0.5);
  return <>
    <div style={ab(560, 140, { width: 620, height: 780, background: "#0d0f12", boxShadow: "inset 0 0 120px rgba(255,190,110,.35)" })}>
      <div style={{ ...mid(620, 360, 44, MZ, op) }}>ANOTHER CLIPBOARD</div>
    </div>
    <div style={ab(560, 140, { width: 620, height: 780, transformOrigin: "0 50%", transform: `perspective(1600px) rotateY(${-op * 70}deg)`, background: "linear-gradient(90deg,#6b4a2c,#8a6038 50%,#6b4a2c)", boxShadow: shadow })}>
      <div style={mid(620, 200, 64, "#f2e6c9")}>OIL CHANGE</div>
      <div style={ab(520, 400, { width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(#f0d07a,#a07a2a)" })} />
    </div>
    <div style={ab(1300, 360 + (1 - key) * -300, { opacity: cl(key * 2), transform: `rotate(${-20 + key * 20}deg)` })}>
      <div style={ab(0, 0, { width: 150, height: 150, borderRadius: "50%", border: "26px solid #e2c060" })} />
      <div style={ab(130, 62, { width: 300, height: 26, background: "#e2c060" })} />
      <div style={ab(360, 88, { width: 26, height: 50, background: "#e2c060" })} /><div style={ab(400, 88, { width: 26, height: 36, background: "#e2c060" })} />
      <div style={ab(-10, 190, { width: 260, height: 90, borderRadius: 10, background: "linear-gradient(#fff3b0,#f1d65a)" })}><div style={mid(260, 26, 36, "#3a3008")}>STICKER</div></div>
    </div>
  </>;
}}</Stage>;

// 9 · dos relojes en carrera: millas y meses; el que llega primero manda
const Severo: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#191d22">{(tt) => {
  const mi = eio(tt, 0.4, 3.6) * 0.55, mo = eio(tt, 0.4, 2.4);
  const Dial = ({ x, v, lab, c, win }: { x: number; v: number; lab: string; c: string; win: number }) => <div style={ab(x, 220, { width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(#22272d,#0d0f12)", boxShadow: `0 0 0 14px ${win > 0.5 ? c : "#3a3f46"}, ${shadow}` })}>
    <svg style={ab(0, 0)} width={520} height={520}><circle cx={260} cy={260} r={200} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={34} /><circle cx={260} cy={260} r={200} fill="none" stroke={c} strokeWidth={34} strokeDasharray={1257} strokeDashoffset={1257 * (1 - v)} transform="rotate(-90 260 260)" strokeLinecap="round" /></svg>
    <div style={mid(520, 226, lab.length > 6 ? 52 : 64, TX)}>{lab}</div>
    {win > 0.5 && <div style={mid(520, 580, 40, c)}>FIRST · CHANGE IT</div>}
  </div>;
  return <>
    <Dial x={300} v={mi} lab="MILES" c={MZ} win={0} />
    <Dial x={1100} v={mo} lab="12 MONTHS" c={VER} win={mo > 0.99 ? 1 : 0} />
    <div style={{ ...mid(1920, 900, 48, TX, cl(tt - 2.6)) }}>WHICHEVER COMES FIRST</div>
  </>;
}}</Stage>;

// 10 · la guantera se abre: servilletas y registro… y abajo de todo, el manual
const Guantera: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1d1916">{(tt) => {
  const op = eio(tt, 0.3, 1.2), out = eio(tt, 1.6, 3.2);
  return <>
    <div style={ab(360, 260, { width: 1200, height: 560, borderRadius: 30, background: "linear-gradient(#2a2c30,#141518)", boxShadow: shadow })} />
    <div style={ab(460, 330, { width: 1000, height: 420, borderRadius: 12, background: "#08090a", overflow: "hidden" })}>
      {[0, 1, 2, 3].map((i) => <div key={i} style={ab(80 + i * 40 + out * (i % 2 ? 380 : -380), 80 + i * 26 - out * 140, { width: 300, height: 220, background: "#f4f0e6", transform: `rotate(${(rnd(i) - 0.5) * 30 + out * (i % 2 ? 40 : -40)}deg)`, opacity: 1 - out * 0.9 })} />)}
      <div style={ab(540 + out * -40, 120 - out * 20, { width: 280, height: 190, background: "#c9d6e3", transform: `rotate(8deg) translateX(${out * 500}px)`, opacity: 1 - out })}><div style={mid(280, 70, 30, "#334")}>REGISTRATION</div></div>
      <div style={ab(330, 110, { width: 380, height: 260, borderRadius: 8, background: "linear-gradient(#24364d,#16222f)", boxShadow: `0 0 ${50 * out}px rgba(255,210,120,.6)`, transform: `scale(${0.9 + 0.12 * out})` })}>
        <div style={mid(380, 70, 40, "#e8d9a8")}>OWNER'S</div><div style={mid(380, 130, 40, "#e8d9a8")}>MANUAL</div>
      </div>
    </div>
    <div style={ab(460, 330, { width: 1000, height: 420, borderRadius: 12, background: "linear-gradient(#3a3d42,#1e2023)", transformOrigin: "50% 100%", transform: `perspective(1400px) rotateX(${-op * 98}deg)` })} />
    <Tag tt={tt} at={3.0} x={960} y={900} txt="FREE ONLINE" col={VER} />
  </>;
}}</Stage>;

// 11 · cuadrícula de 100 burbujas del aire: 78 ya son nitrógeno
const Nitrogeno: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#14202a">{(tt) => {
  const n = Math.floor(eio(tt, 0.3, 2.6) * 78);
  return <>
    {Array.from({ length: 100 }, (_, i) => { const x = i % 10, y = Math.floor(i / 10), on = i < n;
      return <div key={i} style={ab(560 + x * 82, 150 + y * 76, { width: 62, height: 62, borderRadius: "50%", background: on ? "radial-gradient(circle at 35% 30%,#bfe2ff,#3f86c6)" : "radial-gradient(circle at 35% 30%,#556,#2a2f36)", transform: `scale(${on ? 1 : 0.86})`, boxShadow: on ? "0 0 18px rgba(90,170,240,.45)" : "none" })}>{on && <div style={mid(62, 18, 26, "#0b2a44")}>N</div>}</div>; })}
    <div style={{ ...txt(150, 380, 150, "#8cc8ff", cl((tt - 2.4) * 3)) }}>78%</div>
    <div style={{ ...txt(150, 560, 40, TX, cl((tt - 2.8) * 3)) }}>ALREADY IN</div>
    <div style={{ ...txt(150, 610, 40, TX, cl((tt - 2.8) * 3)) }}>FREE AIR</div>
  </>;
}}</Stage>;

// 12 · los $40 se apoyan sólo sobre el 22 % que queda
const Veintidos: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#14202a">{(tt) => {
  const s = phys(tt, 1.0, 6, 0.5);
  return <>
    <div style={ab(260, 380, { width: 1400, height: 160, borderRadius: 80, overflow: "hidden", background: "#2a2f36", boxShadow: shadow, display: "flex" })}>
      <div style={{ position: "relative", width: "78%", background: "linear-gradient(#5aa4e4,#2d6aa5)" }}><div style={mid(1092, 52, 56, "#0b2a44")}>78% NITROGEN · FREE</div></div>
      <div style={{ position: "relative", width: "22%", background: `linear-gradient(${MZ},#9a7414)` }}><div style={mid(308, 52, 56, "#2a1d00")}>22%</div></div>
    </div>
    <div style={ab(1400, 120 + (1 - s) * -200, { width: 260, height: 200, borderRadius: 16, background: "linear-gradient(#cfe5c4,#8fb57e)", opacity: cl(s * 2), boxShadow: shadow, transform: `rotate(${-6 + (1 - s) * 20}deg)` })}><div style={mid(260, 62, 80, "#20401a")}>$40</div></div>
    <svg style={ab(1490, 320)} width={80} height={70}><path d="M40 0 L40 54 M18 34 L40 58 L62 34" stroke={MZ} strokeWidth={9} fill="none" opacity={cl((tt - 1.8) * 3)} /></svg>
    <div style={{ ...mid(1920, 640, 48, TX, cl((tt - 2.6) * 2)) }}>CHURCH AND GROCERY STORE: YOU'LL NEVER FEEL IT</div>
  </>;
}}</Stage>;

// 13 · el número correcto: marco de la puerta (35 PSI) vs. costado de la llanta (MAX 51)
const MarcoPuerta: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1b1d21">{(tt) => {
  const a = phys(tt, 0.4, 6, 0.55), b = phys(tt, 1.6, 6, 0.55);
  return <>
    <div style={ab(170, 200, { width: 720, height: 620, borderRadius: 24, background: "linear-gradient(90deg,#4a5059,#2b3036)", boxShadow: shadow, opacity: cl(a * 2), transform: `translateX(${(1 - a) * -200}px)` })}>
      <div style={ab(150, 120, { width: 420, height: 300, background: "#f6f2e6", borderRadius: 8 })}>
        <div style={mid(420, 30, 28, "#444")}>TIRE AND LOADING</div>
        <div style={mid(420, 110, 120, "#1f6a3a")}>35</div><div style={mid(420, 230, 36, "#444")}>PSI · COLD</div>
      </div>
      <Check x={300} y={460} k={(tt - 2.6) * 3} s={1.4} />
    </div>
    <div style={ab(1060, 190, { width: 640, height: 640, borderRadius: "50%", background: "radial-gradient(#3a3a3a 0 38%,#1a1a1a 39% 100%)", boxShadow: shadow, opacity: cl(b * 2), transform: `rotate(${(1 - b) * 90}deg)` })}>
      <div style={{ ...txt(150, 70, 40, "#9a9a9a"), transform: "rotate(-14deg)" }}>MAX PRESS 51 PSI</div>
    </div>
    <div style={ab(1080, 420, { width: 600, height: 12, background: RED, opacity: cl((tt - 2.6) * 3), transform: "rotate(-35deg)" })} />
    <div style={{ ...mid(960, 880, 44, TX, cl(tt - 2.8)) }}>THE DOOR, NOT THE TIRE</div>
  </>;
}}</Stage>;

// 14 · manómetro de lápiz: la varilla sale y marca 35
const Manometro: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#1a1c1f">{(tt) => {
  const push = eio(tt, 0.5, 1.2), rod = eio(tt, 1.2, 2.2);
  return <>
    <div style={ab(1280, 260, { width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(#444 0 22%,#151515 23% 100%)", boxShadow: shadow })}>
      <div style={ab(190, 0, { width: 40, height: 70, background: "linear-gradient(90deg,#9aa0a6,#e3e7ea,#8a9096)" })} />
    </div>
    <div style={ab(lerp(500, 600, push), 300, { transform: "rotate(-90deg)", transformOrigin: "0 0" })}>
      <div style={ab(-60, 0, { width: 60, height: 520, borderRadius: 26, background: "linear-gradient(90deg,#8d949b,#e7ebee 45%,#7d848b)" })} />
      <div style={ab(-46, -260 * rod, { width: 32, height: 260, background: "repeating-linear-gradient(#f6f2e6 0 22px,#d1c8b0 22px 26px)", zIndex: -1 })}>
        <div style={{ ...txt(-4, 60, 26, RED), transform: "rotate(90deg)" }}>35</div>
      </div>
    </div>
    <div style={{ ...txt(500, 720, 72, MZ, cl((tt - 2.4) * 3)) }}>$2 · ONCE A MONTH</div>
    <div style={{ ...txt(500, 820, 40, TX, cl((tt - 2.9) * 3)) }}>IN THE MORNING, BEFORE YOU DRIVE</div>
  </>;
}}</Stage>;

// 15 · el depósito de dirección con la cinta de papel y la letra de Ramón
const CintaPS: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1d1a16">{(tt) => {
  const w = eio(tt, 1.0, 2.4), z = eio(tt, 2.6, 3.6);
  return <><div style={ab(0, 0, { transform: `scale(${1 + z * 0.35})`, transformOrigin: "960px 470px", width: 1920, height: 1080 })}>
    <div style={ab(660, 220, { width: 600, height: 620, borderRadius: "40% 40% 30px 30px", background: "linear-gradient(90deg,#20232a,#3b3f47 45%,#1b1e24)", boxShadow: shadow })}>
      <div style={ab(190, -60, { width: 220, height: 110, borderRadius: 30, background: "linear-gradient(#2b2f35,#111)" })} />
      <div style={ab(60, 260, { width: 480, height: 150, background: "linear-gradient(#efe2b8,#dccd9c)", transform: "rotate(-3deg)", boxShadow: "0 6px 12px rgba(0,0,0,.4)" })}>
        <div style={{ ...ab(0, 0, { width: 480, height: 150 }), clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}><div style={{ ...mid(480, 30, 76, INK, 1, HAND), fontWeight: 700 }}>P/S · R.T. · '24</div></div>
      </div>
    </div>
  </div><Tag tt={tt} at={2.8} x={1560} y={220} txt="MY WRITING" col={MZ} hand /></>;
}}</Stage>;

// 16 · lavado a presión: el líquido viejo y las partículas que sostenían la caja salen todas de golpe; el engranaje patina
const FlushPresion: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#1c1514">{(tt) => {
  const p = eio(tt, 0.8, 2.6), slip = cl((tt - 2.8) * 2);
  return <>
    <div style={ab(560, 200, { width: 800, height: 520, borderRadius: 60, background: "linear-gradient(#3a2f2a,#1a1412)", boxShadow: shadow, overflow: "hidden" })}>
      <div style={ab(0, 520 * (1 - (1 - p) * 0.8) - 420 * (1 - p), { width: 800, height: 520, background: `linear-gradient(${p > 0.5 ? "#c2342a" : "#5a2a18"},#2a1008)`, opacity: 0.85 })} />
      {Array.from({ length: 26 }, (_, i) => <div key={i} style={ab(60 + rnd(i) * 680 + p * 900 * (rnd(i + 9) > 0.5 ? 1 : -1), 120 + rnd(i + 3) * 340 - p * 200, { width: 12, height: 12, borderRadius: 3, background: "#d8b070", opacity: 1 - p })} />)}
      <div style={ab(300, 160, { width: 200, height: 200, borderRadius: "50%", border: "26px dashed #c9ced4", transform: `rotate(${tt * 80 + slip * Math.sin(tt * 30) * 18}deg)` })} />
    </div>
    {[0, 1, 2].map((i) => <div key={i} style={ab(250 + p * 160, 300 + i * 120, { width: 260, height: 26, borderRadius: 13, background: "linear-gradient(90deg,transparent,#e86a50)", opacity: cl(tt - 0.6) * (1 - cl(tt - 2.6)) })} />)}
    <div style={{ ...txt(1400, 360, 60, RED, slip) }}>SLIPPING</div>
    <div style={{ ...txt(1400, 440, 40, TX, slip) }}>A FEW WEEKS LATER</div>
    <div style={{ ...txt(560, 790, 40, DIM, cl(tt - 1)) }}>HIGH MILEAGE · NEVER SERVICED · MACHINE FLUSH</div>
  </>;
}}</Stage>;

// 17 · drenar y llenar: sale un cuarto, entra un cuarto, el contador sube despacio
const Vaciado: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1b1a17">{(tt) => {
  const q = Math.min(4, Math.floor(tt / 0.9)), fr = (tt % 0.9) / 0.9;
  return <>
    <div style={ab(560, 160, { width: 800, height: 300, borderRadius: 40, background: "linear-gradient(#3c3f45,#1d1f23)", boxShadow: shadow })}><div style={mid(800, 120, 44, DIM)}>TRANSMISSION</div></div>
    <div style={ab(950, 460, { width: 22, height: 220 * (fr < 0.6 ? fr / 0.6 : 1), background: "linear-gradient(#b8382a,#7a1d14)", borderRadius: 10, opacity: q < 4 ? 1 : 0 })} />
    <div style={ab(760, 690, { width: 420, height: 130, borderRadius: "0 0 90px 90px", background: "linear-gradient(#3b4048,#1a1d21)", boxShadow: shadow })} />
    {Array.from({ length: 4 }, (_, i) => <div key={i} style={ab(1450, 760 - i * 130, { width: 120, height: 110, borderRadius: 12, background: i < q ? `linear-gradient(${MZ},#9a7414)` : "rgba(255,255,255,.1)", boxShadow: i < q ? shadow : "none" })}><div style={mid(120, 34, 40, "#2a1d00")}>{i < q ? "QT" : ""}</div></div>)}
    <div style={{ ...txt(220, 760, 64, VER, cl(tt - 0.4), HAND), fontWeight: 700 }}>drain &amp; fill</div>
    <div style={{ ...txt(220, 850, 40, TX, cl(tt - 1.2)) }}>A FEW QUARTS AT A TIME</div>
  </>;
}}</Stage>;

// 18 · embudo invertido: entra 1 motivo, el portapapeles lo multiplica a 6
const Embudo: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#1a1c22">{(tt) => {
  const L = ["OIL", "STICKER", "AIR", "FLUSH", "FLUSH", "RESET", "FILTERS"];
  return <>
    <div style={ab(200, 400, { width: 280, height: 280, borderRadius: 24, background: `linear-gradient(${VER},#1f5a32)`, boxShadow: shadow })}><div style={mid(280, 60, 120, "#0d2414")}>1</div><div style={mid(280, 200, 40, "#d8f0dc")}>OIL CHANGE</div></div>
    <svg style={ab(480, 200)} width={600} height={680}><path d={`M0 340 L600 ${340 - 320 * eio(tt, 0.6, 1.6)} L600 ${340 + 320 * eio(tt, 0.6, 1.6)} Z`} fill="rgba(230,190,90,.16)" stroke={MZ} strokeWidth={4} /></svg>
    {L.slice(1).map((l, i) => { const s = phys(tt, 1.2 + i * 0.32, 7, 0.5); return <div key={i} style={ab(1120 + (i % 2) * 340, 130 + Math.floor(i / 2) * 260 + (1 - s) * 60, { width: 300, height: 200, borderRadius: 18, background: "linear-gradient(#5a1712,#2d0b08)", boxShadow: shadow, opacity: cl(s * 2) })}><div style={mid(300, 70, 52, "#ffc6b8")}>{l}</div></div>; })}
  </>;
}}</Stage>;

// 19 · la camioneta verde de Don Chuy con la puerta blanca; su frase sobre genios y ladrones
const DonChuy: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#1d211a">{(tt) => {
  const k = eio(tt, 0.2, 1.6), q = cl((tt - 1.8) * 1.5);
  return <>
    <div style={ab(lerp(-900, 220, k), 360, { width: 1000, height: 380 })}>
      <div style={ab(0, 120, { width: 1000, height: 190, borderRadius: "30px 60px 20px 20px", background: "linear-gradient(#4f7a4a,#2e4a2b)", boxShadow: shadow })} />
      <div style={ab(560, 0, { width: 330, height: 170, borderRadius: "50px 50px 0 0", background: "linear-gradient(#4f7a4a,#2e4a2b)" })}><div style={ab(40, 30, { width: 250, height: 100, borderRadius: "36px 36px 0 0", background: "linear-gradient(160deg,#a8c4d6,#3e5566)" })} /></div>
      <div style={ab(600, 120, { width: 250, height: 190, background: "linear-gradient(#f3f0e6,#cfc8b4)", borderRadius: 8 })} />
      {[180, 800].map((x) => <div key={x} style={ab(x - 80, 240, { width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(#9aa0a6 0 26%,#141414 27% 100%)", transform: `rotate(${k * 600}deg)` })} />)}
      <div style={{ ...txt(30, 160, 40, "#cfe0c4") }}>'62</div>
    </div>
    <div style={ab(1260, 160, { width: 560, opacity: q })}>
      <div style={{ ...txt(0, 0, 54, TX, 1, HAND), fontWeight: 700, whiteSpace: "normal", width: 560, lineHeight: 1.15 }}>"One problem in. Six out?</div>
      <div style={{ ...txt(0, 160, 54, MZ, cl((tt - 2.6) * 2), HAND), fontWeight: 700, whiteSpace: "normal", width: 560, lineHeight: 1.15 }}>Genius… or thief."</div>
      <div style={{ ...txt(0, 300, 34, DIM, cl((tt - 3.2) * 2)) }}>— DON CHUY GARZA</div>
    </div>
  </>;
}}</Stage>;

// 20 · el testigo se apaga, pero la causa sigue ahí: el engranaje roto detrás de la luz
const Luz: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#16181c">{(tt) => {
  const off = tt > 1.6 ? 1 : 0, rev = eio(tt, 2.2, 3.4);
  return <>
    <div style={ab(560, 260, { width: 800, height: 460, borderRadius: 40, background: "#08090b", boxShadow: "inset 0 0 0 10px #2b2e33, 0 30px 60px rgba(0,0,0,.6)" })}>
      <svg style={ab(250, 90)} width={300} height={220} viewBox="0 0 300 220"><path d="M40 70 h40 v-30 h80 v30 h50 l30 30 v70 h-30 v20 h-60 v-20 h-80 v20 h-30 z" fill={off ? "#2a2a2a" : "#ffb020"} style={{ filter: off ? "none" : "drop-shadow(0 0 22px #ffb020)" }} /></svg>
    </div>
    <div style={ab(860, 300, { transform: `translateY(${rev * 480}px)`, opacity: rev })}>
      <div style={ab(0, 0, { width: 200, height: 200, borderRadius: "50%", border: "30px dashed #b04a3a", clipPath: "polygon(0 0,100% 0,100% 55%,62% 48%,55% 100%,0 100%)" })} />
    </div>
    <div style={{ ...txt(1400, 380, 50, off ? VER : TX, cl((tt - 1.6) * 3)) }}>LIGHT: OFF</div>
    <div style={{ ...txt(1160, 800, 50, RED, rev) }}>PROBLEM:</div><div style={{ ...txt(1160, 864, 50, RED, rev) }}>STILL THERE</div>
  </>;
}}</Stage>;

// 21 · la nota que escribe el auto (código) y la goma que la borra
const NotaCodigo: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1e1b16">{(tt) => {
  const w = eio(tt, 0.1, 0.9), er = eio(tt, 2.6, 3.9);
  return <>
    <div style={ab(500, 220, { width: 920, height: 560, background: PAPER, boxShadow: shadow, transform: "rotate(-2deg)" })}>
      <div style={{ ...ab(60, 70, { width: 800, height: 420 }), clipPath: `inset(0 ${(1 - w) * 100}% 0 ${er * 100}%)` }}>
        <div style={{ ...txt(0, 0, 64, INK, 1, HAND), fontWeight: 700 }}>Dear driver,</div>
        <div style={{ ...txt(0, 110, 56, INK, 1, HAND), fontWeight: 700 }}>something's wrong here:</div>
        <div style={{ ...txt(0, 240, 110, RED, 1, M) }}>P0456</div>
        <div style={{ ...txt(470, 330, 48, INK, 1, HAND), fontWeight: 700 }}>— your car</div>
      </div>
    </div>
    <div style={ab(500 + er * 860, 330 + Math.sin(er * 18) * 40, { width: 180, height: 110, borderRadius: 14, background: "linear-gradient(#f2a3b0,#d8707f)", opacity: cl((tt - 2.2) * 2) * (1 - cl((er - 0.95) * 20)), boxShadow: shadow, transform: "rotate(-14deg)" })} />
    <div style={{ ...txt(560, 560, 110, "rgba(200,40,30,.25)", er, M) }}>P0456?</div>
    <Tag tt={tt} at={3.6} x={960} y={900} txt="NO EVIDENCE" col={RED} />
  </>;
}}</Stage>;

// 22 · una letra y cuatro números: cinco casilleros que se llenan como en una ficha
const Letra: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#191c20">{(tt) => {
  const ch = ["P", "0", "4", "5", "6"];
  return <>
    {ch.map((c, i) => { const s = phys(tt, 0.4 + i * 0.4, 8, 0.45); return <div key={i} style={ab(330 + i * 260, 330, { width: 220, height: 300, borderRadius: 18, background: i === 0 ? `linear-gradient(${MZ},#9a7414)` : "linear-gradient(#f6f2e6,#d8cfb8)", boxShadow: shadow, transform: `rotateX(${(1 - s) * 90}deg)`, opacity: cl(s * 2) })}><div style={mid(220, 70, 160, i === 0 ? "#2a1d00" : "#222", 1, M)}>{c}</div></div>; })}
    <div style={{ ...txt(330, 680, 44, MZ, cl(tt - 1.0)) }}>1 LETTER</div>
    <div style={{ ...txt(800, 680, 44, TX, cl(tt - 2.6)) }}>+ 4 NUMBERS · ON PAPER</div>
  </>;
}}</Stage>;

// 23 · cuatro hojas de calendario caen y en la cuarta el testigo vuelve a encenderse
const CuatroDias: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#1a1a1c">{(tt) => {
  const n = 1 + Math.min(3, Math.floor(eio(tt, 0.3, 2.4) * 3.999)), on = tt > 2.6;
  return <>
    <div style={ab(360, 220, { width: 520, height: 620, borderRadius: 14, background: "#f4efe2", boxShadow: shadow })}>
      <div style={ab(0, 0, { width: 520, height: 120, borderRadius: "14px 14px 0 0", background: RED })}><div style={mid(520, 34, 54, "#fff")}>DAY</div></div>
      <div style={mid(520, 220, 260, "#222")}>{n}</div>
    </div>
    {Array.from({ length: n }, (_, i) => <div key={i} style={ab(360 + 200 + i * 80, 860 + i * 6, { width: 220, height: 30, background: "#e7dfcb", transform: `rotate(${rnd(i) * 30 - 15}deg)`, opacity: 0.8 })} />)}
    <div style={ab(1160, 330, { width: 420, height: 320, borderRadius: 30, background: "#08090b", boxShadow: "inset 0 0 0 8px #2b2e33" })}>
      <svg style={ab(70, 60)} width={280} height={200} viewBox="0 0 300 220"><path d="M40 70 h40 v-30 h80 v30 h50 l30 30 v70 h-30 v20 h-60 v-20 h-80 v20 h-30 z" fill={on ? "#ffb020" : "#2a2a2a"} style={{ filter: on ? "drop-shadow(0 0 26px #ffb020)" : "none" }} /></svg>
    </div>
    <div style={{ ...txt(1160, 700, 52, MZ, on ? 1 : 0) }}>BACK ON</div>
  </>;
}}</Stage>;

// 24 · la manguerita agrietada junto al canister de carbón; vale menos que un sándwich
const Manguera: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#191b18">{(tt) => {
  const z = eio(tt, 0.3, 1.6), cr = cl((tt - 1.6) * 2), sw = phys(tt, 2.6, 6, 0.5);
  return <>
    <div style={ab(320, 300, { width: 300, height: 420, borderRadius: 40, background: "linear-gradient(90deg,#1c1c1c,#3a3a3a,#1c1c1c)", boxShadow: shadow })}><div style={mid(300, 170, 32, "#888")}>CHARCOAL</div><div style={mid(300, 210, 32, "#888")}>CANISTER</div></div>
    <svg style={ab(600, 360)} width={700} height={300}><path d="M0 120 C200 0 400 260 680 120" fill="none" stroke="#2b2b2b" strokeWidth={46} strokeLinecap="round" transform={`scale(${0.9 + 0.1 * z})`} />
      <path d="M330 150 l14 -22 l10 18 l12 -20" fill="none" stroke="#e0e0e0" strokeWidth={5} opacity={cr} /></svg>
    <div style={{ ...txt(870, 280, 44, RED, cr) }}>CRACK</div>
    <div style={ab(1380, 520 + (1 - sw) * -200, { opacity: cl(sw * 2) })}>
      <div style={ab(0, 0, { width: 320, height: 110, borderRadius: "60px 60px 14px 14px", background: "linear-gradient(#e8b86a,#b67a32)" })} />
      <div style={ab(10, 90, { width: 300, height: 30, background: "#6aa84f" })} /><div style={ab(0, 115, { width: 320, height: 70, borderRadius: "10px 10px 40px 40px", background: "linear-gradient(#d8a45a,#9e6a2a)" })} />
      <div style={{ ...mid(320, 220, 40, MZ) }}>PART &lt; SANDWICH</div>
    </div>
  </>;
}}</Stage>;

// 25 · la inspección de Texas: monitores «NOT READY» tras borrar los códigos
const Inspeccion: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1c1c20">{(tt) => {
  const R = ["CATALYST", "EVAP SYSTEM", "O2 SENSOR", "O2 HEATER", "EGR"];
  return <>
    <div style={ab(480, 140, { width: 960, height: 760, borderRadius: 20, background: "linear-gradient(#141a20,#0b0e11)", boxShadow: "inset 0 0 0 6px #2b3138, 0 30px 70px rgba(0,0,0,.6)" })}>
      <div style={{ ...txt(60, 50, 44, "#7fd0ff", 1, M) }}>STATE INSPECTION · MONITORS</div>
      {R.map((r, i) => <div key={i} style={{ position: "absolute", left: 60, top: 160 + i * 110, opacity: cl((tt - 0.4 - i * 0.35) * 3) }}>
        <div style={{ ...txt(0, 0, 48, "#d7dde3", 1, M) }}>{r}</div>
        <div style={{ ...txt(560, 0, 48, RED, 1, M) }}>NOT READY</div>
      </div>)}
    </div>
    <Tag tt={tt} at={2.8} x={960} y={970} txt="SENT HOME" col={RED} />
  </>;
}}</Stage>;

// 26 · el estante de Ramón: bolsas con piezas viejas y el nombre de cada cliente
const Estante: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1f1a14" mesa={false}>{(tt) => {
  const N = ["ELLISON", "KOWALSKI", "DOROTHY", "MARCUS", "PEÑA", "OCHOA"];
  return <>
    {[0, 1].map((r) => <div key={r} style={ab(260, 470 + r * 330, { width: 1400, height: 34, background: "linear-gradient(#8a6038,#5a3a1e)", boxShadow: shadow })} />)}
    {N.map((n, i) => { const r = Math.floor(i / 3), c = i % 3, s = phys(tt, 0.3 + i * 0.3, 7, 0.5);
      return <div key={i} style={ab(330 + c * 450, 210 + r * 330 + (1 - s) * -200, { width: 360, height: 260, borderRadius: "10px 10px 30px 30px", background: "linear-gradient(rgba(235,240,245,.55),rgba(200,210,220,.35))", border: "3px solid rgba(255,255,255,.5)", opacity: cl(s * 2) })}>
        <div style={ab(110, 80, { width: 140, height: 110, borderRadius: 18, background: ["#5a5048", "#9a6a2a", "#3a3a3a", "#6a2a1a", "#4a5a6a", "#2a2a2a"][i] })} />
        <div style={ab(40, 16, { width: 280, height: 56, background: "#f4ecd2", transform: "rotate(-2deg)" })}><div style={{ ...mid(280, 8, 40, INK, 1, HAND), fontWeight: 700 }}>{n}</div></div>
      </div>; })}
  </>;
}}</Stage>;

// 27 · tres pruebas: filtro negro, pastillas finas, correa agrietada → «muéstrame»
const Prueba: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1a1d21">{(tt) => {
  const P = [["BLACK FILTER", "#2a2622"], ["THIN PADS", "#6a6058"], ["CRACKED BELT", "#1c1c1c"]] as const;
  return <>
    {P.map(([l, c], i) => { const s = phys(tt, 0.4 + i * 0.7, 7, 0.5); return <div key={i} style={ab(200 + i * 540, 260 + (1 - s) * 160, { width: 440, height: 520, borderRadius: 22, background: "linear-gradient(#f3eee0,#d8cfb8)", boxShadow: shadow, opacity: cl(s * 2) })}>
      {i === 0 && <div style={ab(70, 70, { width: 300, height: 250, borderRadius: 14, background: `repeating-linear-gradient(90deg,${c} 0 14px,#4a443c 14px 20px)` })} />}
      {i === 1 && [0, 1].map((j) => <div key={j} style={ab(80 + j * 160, 110, { width: 120, height: 200, borderRadius: 14, background: "#9aa0a6", boxShadow: `inset 0 ${-30}px 0 ${c}` })} />)}
      {i === 2 && <svg style={ab(60, 70)} width={320} height={260}><ellipse cx={160} cy={130} rx={140} ry={100} fill="none" stroke={c} strokeWidth={30} />{[0, 1, 2, 3, 4].map((j) => <path key={j} d={`M${70 + j * 40} 40 l8 18`} stroke="#d9d4c8" strokeWidth={4} />)}</svg>}
      <div style={mid(440, 380, 42, "#2a2a2a")}>{l}</div>
    </div>; })}
    <div style={{ ...mid(1920, 860, 64, MZ, cl((tt - 2.8) * 2), HAND), fontWeight: 700 }}>"Show me."</div>
  </>;
}}</Stage>;

// 28 · el filtro de aire con la fecha escrita a marcador, y la lupa que la encuentra
const Fecha: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#1c1a17">{(tt) => {
  const lx = lerp(1500, 1010, eio(tt, 0.8, 2.2)), ly = lerp(820, 470, eio(tt, 0.8, 2.2));
  return <>
    <div style={ab(460, 250, { width: 1000, height: 560, borderRadius: 20, background: "linear-gradient(#f2efe6,#d9d3c3)", boxShadow: shadow })}>
      <div style={ab(60, 60, { width: 880, height: 440, borderRadius: 10, background: "repeating-linear-gradient(90deg,#efe4c4 0 18px,#cdbf98 18px 26px)" })} />
      <div style={{ ...txt(420, 190, 72, INK, 1, HAND), fontWeight: 700, transform: "rotate(-4deg)" }}>MAY 14</div>
    </div>
    <div style={ab(lx - 170, ly - 170, { width: 340, height: 340, borderRadius: "50%", border: "22px solid #2a2a2a", background: "rgba(220,235,255,.12)", boxShadow: shadow, overflow: "hidden" })} />
    <div style={ab(lx + 120, ly + 120, { width: 60, height: 260, borderRadius: 30, background: "#2a2a2a", transform: "rotate(-45deg)", transformOrigin: "30px 0" })} />
    <Tag tt={tt} at={2.8} x={960} y={150} txt="5 MONTHS OLD" col={RED} />
  </>;
}}</Stage>;

// 29 · la suma redondeada: cada renglón se tacha y abajo queda lo que no hacía falta
const Suma: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#1e1a14">{(tt) => {
  const L = [["Oil change", "50", 0], ["Air (nitrogen)", "40", 1], ["Flushes", "219", 1], ["Light reset", "35", 1], ["Filters", "84", 1]] as const;
  return <div style={ab(400, 110, { width: 1120, height: 860, background: PAPER, boxShadow: shadow })}>
    {L.map(([a, b, x], i) => { const o = cl((tt - 0.2 - i * 0.45) * 3); return <div key={i}>
      <div style={{ ...txt(80, 70 + i * 120, 62, INK, o, HAND), fontWeight: 700 }}>{a}</div>
      <div style={{ ...txt(820, 70 + i * 120, 62, INK, o, HAND), fontWeight: 700 }}>${b}</div>
      {x ? <Strike x={60} y={100 + i * 120} w={960} k={(tt - 0.5 - i * 0.45) * 3} /> : <Check x={1000} y={64 + i * 120} k={(tt - 0.5) * 3} />}
    </div>; })}
    <div style={ab(60, 690, { width: 1000 * eio(tt, 2.6, 3.0), height: 6, background: INK })} />
    <div style={{ ...txt(80, 730, 84, RED, cl((tt - 3.1) * 3), HAND), fontWeight: 700 }}>not needed: $550+</div>
  </div>;
}}</Stage>;

// 30 · la nota a mano bajo el total y la tarjeta del concesionario abrochada
const TarjetaGrapa: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1d1916">{(tt) => {
  const w = eio(tt, 0.3, 1.6), c = phys(tt, 1.9, 7, 0.5);
  return <>
    <div style={ab(420, 160, { width: 820, height: 760, background: PAPER, boxShadow: shadow, transform: "rotate(-2deg)" })}>
      <div style={{ ...txt(70, 60, 50, "#2a2a2a", 1, M) }}>TOTAL      $612.00</div>
      <div style={ab(60, 140, { width: 700, height: 4, background: "#999" })} />
      <div style={{ ...ab(70, 190, { width: 700, height: 330 }), clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}>
        {["Customer advised.", "Vehicle high mileage.", "Recommend replacement."].map((l, i) => <div key={i} style={{ ...txt(0, i * 100, 56, "#1d2a8a", 1, HAND), fontWeight: 700 }}>{l}</div>)}
      </div>
    </div>
    <div style={ab(1080, 360 + (1 - c) * -400, { width: 560, height: 320, borderRadius: 12, background: "linear-gradient(#ffffff,#e8edf2)", boxShadow: shadow, transform: `rotate(${8 + (1 - c) * 20}deg)`, opacity: cl(c * 2) })}>
      <div style={{ ...txt(40, 50, 52, "#0e3a6e") }}>CAR DEALER</div>
      <div style={{ ...txt(40, 130, 32, "#445") }}>New & Used</div>
      <div style={{ ...txt(40, 190, 32, "#445") }}>Ask for my cousin</div>
      <div style={ab(250, -16, { width: 70, height: 16, background: "#9aa0a6", borderRadius: 3, opacity: c > 0.95 ? 1 : 0 })} />
    </div>
  </>;
}}</Stage>;

// 31 · palabras de miedo que cuelgan como anzuelos
const Palabras: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#18151c" mesa={false}>{(tt) => {
  const W = ["A LADY YOUR AGE", "ANYTHING CAN HAPPEN", "STRANDED"];
  return <>
    {W.map((w, i) => { const s = phys(tt, 0.3 + i * 0.6, 6, 0.4), x = 300 + i * 520, y = 140 + (i % 2) * 120, sw = Math.sin(tt * 1.6 + i) * 4;
      return <div key={i} style={ab(x, -200 + s * 200, { transform: `rotate(${sw}deg)`, transformOrigin: "120px 0" })}>
        <div style={ab(118, 0, { width: 3, height: y + 200, background: "rgba(255,255,255,.5)" })} />
        <svg style={ab(84, y + 190)} width={80} height={90}><path d="M38 0 V54 Q38 80 18 70 Q4 62 14 46" fill="none" stroke="#c9ced4" strokeWidth={7} /></svg>
        <div style={{ ...txt(0, y + 290, 48, i === 2 ? RED : TX), padding: "16px 26px", background: "rgba(0,0,0,.45)", borderRadius: 14 }}>"{w}"</div>
      </div>; })}
    <div style={{ ...mid(1920, 900, 46, MZ, cl((tt - 2.8) * 2)) }}>IT COMES AT YOU LIKE WORRY</div>
  </>;
}}</Stage>;

// 32 · 72 cuotas que se apilan hasta $36.000
const Cuotas: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1b1a16">{(tt) => {
  const n = Math.floor(eio(tt, 0.4, 3.0) * 72), tot = n * 500;
  return <>
    {Array.from({ length: n }, (_, i) => <div key={i} style={ab(300 + (i % 12) * 80, 860 - Math.floor(i / 12) * 92, { width: 70, height: 82, borderRadius: 6, background: "linear-gradient(#cfe5c4,#8fb57e)", boxShadow: "0 4px 8px rgba(0,0,0,.4)" })}><div style={mid(70, 26, 22, "#20401a")}>$500</div></div>)}
    <div style={{ ...txt(1330, 300, 40, TX) }}>PAYMENTS</div>
    <div style={{ ...txt(1330, 350, 110, MZ) }}>{n}</div>
    <div style={{ ...txt(1330, 520, 40, TX) }}>TOTAL</div>
    <div style={{ ...txt(1330, 570, 96, RED) }}>${tot.toLocaleString("en-US")}</div>
    <div style={{ ...txt(1330, 720, 30, DIM, cl(tt - 3)) }}>EXAMPLE · BEFORE INTEREST</div>
  </>;
}}</Stage>;

// 33 · dos años malos de arreglos frente a la montaña de cuotas
const DosMalos: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1a1d1a">{(tt) => {
  const g = eio(tt, 0.4, 2.0), g2 = eio(tt, 1.2, 3.0);
  return <>
    <div style={ab(200, 900, { width: 1520, height: 6, background: "rgba(255,255,255,.35)" })} />
    {[0, 1].map((i) => <div key={i} style={ab(330 + i * 230, 900 - 44 * g, { width: 190, height: 44 * g, background: `linear-gradient(${VER},#1f5a32)`, borderRadius: "10px 10px 0 0" })}><div style={mid(190, -60, 40, VER, g)}>$2,000</div></div>)}
    <div style={ab(1120, 900 - 700 * g2, { width: 400, height: 700 * g2, background: `linear-gradient(${RED},#5a120c)`, borderRadius: "16px 16px 0 0", boxShadow: shadow })}><div style={mid(400, 40, 60, "#fff", g2)}>$36,000</div></div>
    <div style={{ ...txt(300, 930, 36, TX) }}>TWO BAD YEARS · KEEP IT</div>
    <div style={{ ...txt(1120, 930, 36, TX) }}>NEW CAR PAYMENTS</div>
  </>;
}}</Stage>;

// 34 · el odómetro de la F-150 de Kowalski pasa 300.000 y abajo, las cuatro preguntas
const Kilometraje: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#16191d">{(tt) => {
  const v = Math.floor(eio(tt, 0.2, 1.8) * 301442), s = String(v).padStart(6, "0"), Q = ["WHAT PART?", "WHAT FAILURE?", "HOW MUCH?", "HOW SOON?"];
  return <>
    <div style={ab(560, 140, { width: 800, height: 200, borderRadius: 20, background: "#0b0c0e", boxShadow: "inset 0 0 0 8px #2b2e33, 0 30px 60px rgba(0,0,0,.6)", display: "flex", gap: 10, padding: "30px 40px", boxSizing: "border-box" })}>
      {s.split("").map((d, i) => <div key={i} style={{ width: 110, height: 140, borderRadius: 8, background: "linear-gradient(#fafafa,#cfcfcf)", fontFamily: M, fontWeight: 900, fontSize: 110, color: "#111", textAlign: "center", lineHeight: "140px" }}>{d}</div>)}
    </div>
    <div style={{ ...mid(1920, 370, 40, DIM) }}>MILEAGE IS A NUMBER</div>
    {Q.map((q, i) => { const s2 = phys(tt, 2.0 + i * 0.4, 7, 0.5); return <div key={i} style={ab(130 + i * 420, 560 + (1 - s2) * 120, { width: 390, height: 180, borderRadius: 20, background: "linear-gradient(#2a2f36,#171a1e)", boxShadow: `inset 0 0 0 4px ${MZ}, ${shadow}`, opacity: cl(s2 * 2) })}><div style={mid(390, 70, 38, MZ)}>{q}</div></div>; })}
  </>;
}}</Stage>;

// 35 · la revisión en el elevador: ocho tildes verdes y una sola nota (amortiguadores, el año que viene)
const Revision: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#181c1a">{(tt) => {
  const L = ["COMPRESSION", "OIL PRESSURE", "TRANSMISSION", "SHIFTING", "FRAME", "BRAKES", "SUSPENSION", "COOLING"];
  return <div style={ab(360, 90, { width: 1200, height: 900, background: PAPER, boxShadow: shadow })}>
    {L.map((l, i) => { const x = 80 + (i % 2) * 560, y = 70 + Math.floor(i / 2) * 140; return <div key={i}>
      <div style={{ ...txt(x, y, 42, "#2a2a2a", cl((tt - 0.2 - i * 0.28) * 3)) }}>{l}</div>
      <Check x={x + 430} y={y - 14} k={(tt - 0.4 - i * 0.28) * 3} />
    </div>; })}
    <div style={ab(60, 650, { width: 1080, height: 4, background: "#999" })} />
    <div style={{ ...txt(80, 700, 64, "#a0521a", cl((tt - 3.0) * 3), HAND), fontWeight: 700 }}>front struts · next year</div>
    <div style={{ ...txt(80, 790, 48, "#1f6a3a", cl((tt - 3.5) * 3), HAND), fontWeight: 700 }}>That's the whole list.</div>
  </div>;
}}</Stage>;

// 36 · tres frases permitidas en globos, y el portapapeles que se devuelve
const NoHoy: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#1b1e22">{(tt) => {
  const B = ["Not today.", "Write it down for me.", "Let me think about it."];
  return <>
    {B.map((b, i) => { const s = phys(tt, 0.4 + i * 0.8, 7, 0.5); return <div key={i} style={ab(260 + i * 120, 180 + i * 230 + (1 - s) * 60, { padding: "30px 50px", borderRadius: 50, background: "#f6f2e6", boxShadow: shadow, opacity: cl(s * 2), transform: `scale(${0.8 + 0.2 * s})`, transformOrigin: "0 100%" })}>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 72, color: INK, whiteSpace: "nowrap" }}>"{b}"</div>
      <div style={ab(60, 120, { width: 0, height: 0, borderLeft: "30px solid transparent", borderRight: "10px solid transparent", borderTop: "40px solid #f6f2e6" })} />
    </div>; })}
    <Tag tt={tt} at={3.2} x={1500} y={900} txt="ALLOWED" col={VER} />
  </>;
}}</Stage>;

// 37 · la tarjeta clavada en la pared del taller, junto al calendario, con la letra de Danny
const TarjetaPared: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#20190f" mesa={false}>{(tt) => {
  const c = phys(tt, 0.4, 7, 0.5), w = eio(tt, 1.8, 3.2);
  return <>
    <div style={ab(0, 0, { width: 1920, height: 1080, background: "repeating-linear-gradient(90deg,#5a4a38 0 140px,#4e3f2f 140px 146px)" })} />
    <div style={ab(1160, 160, { width: 520, height: 680, background: "#f4efe2", boxShadow: shadow })}>
      <div style={ab(0, 0, { width: 520, height: 110, background: RED })}><div style={mid(520, 30, 52, "#fff")}>NOVEMBER</div></div>
      {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ ...txt(40 + (i % 7) * 66, 150 + Math.floor(i / 7) * 96, 34, "#444") }}>{i + 1}</div>)}
    </div>
    <div style={ab(460, 300 + (1 - c) * -300, { width: 560, height: 320, borderRadius: 10, background: "linear-gradient(#ffffff,#e8edf2)", boxShadow: shadow, transform: `rotate(${-5 + (1 - c) * 20}deg)`, opacity: cl(c * 2) })}>
      <div style={{ ...txt(40, 60, 52, "#0e3a6e") }}>CAR DEALER</div>
      <div style={ab(266, -14, { width: 28, height: 28, borderRadius: "50%", background: "radial-gradient(#ff6a50,#a02010)" })} />
    </div>
    <div style={{ ...ab(470, 680, { width: 600, height: 120 }), clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}><div style={{ ...txt(0, 0, 76, "#1d2a8a", 1, HAND), fontWeight: 700, transform: "rotate(-4deg)" }}>"Customer advised."</div></div>
  </>;
}}</Stage>;

export const TEC: Record<string, C> = {
  factura: Factura, seisuno: SeisUno, portapapeles: Portapapeles, cortesia: Cortesia, calco: Calco, aceites: Aceites, cuentaaceite: CuentaAceite, puerta: Puerta,
  severo: Severo, guantera: Guantera, nitrogeno: Nitrogeno, veintidos: Veintidos, marcopuerta: MarcoPuerta, manometro: Manometro, cintaps: CintaPS, flushpresion: FlushPresion,
  vaciado: Vaciado, embudo: Embudo, donchuy: DonChuy, luz: Luz, notacodigo: NotaCodigo, letra: Letra, cuatrodias: CuatroDias, manguera: Manguera, inspeccion: Inspeccion,
  estante: Estante, prueba: Prueba, fecha: Fecha, suma: Suma, tarjetagrapa: TarjetaGrapa, palabras: Palabras, cuotas: Cuotas, dosmalos: DosMalos, kilometraje: Kilometraje,
  revision: Revision, nohoy: NoHoy, tarjetapared: TarjetaPared,
};
