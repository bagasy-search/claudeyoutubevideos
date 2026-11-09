// c8pc · componentes únicos de rm8pc (Ramón: check engine light). Inglés. Objetos en código.
import React from "react";
import { DIM, eio, H, MZ, RED, Stage, Tag, TX } from "./ckit";
import { ab, CHROME, cl, Finger, Hand, HAND, lerp, phys, rnd, SHAD, STEEL, txt, YEL } from "./r8";
type C = React.FC<{ t: number; h: H }>;
const LCD = "'Courier New', monospace";
const Eng: React.FC<{ x: number; y: number; w: number; c: string; glow?: string }> = ({ x, y, w, c, glow }) => <svg width={w} height={w * 0.69} viewBox="0 0 110 76" style={{ position: "absolute", left: x, top: y, filter: glow ? `drop-shadow(0 0 22px ${glow})` : undefined }}><path d="M30 8h22v8h-7v5h15l8 8h8v-7h7v36h-7v-7h-9l-9 11H31l-9-9h-8v-12H7v16H1V27h6v14h7V27l9-6h7v-5h-7z" fill={c} /></svg>;

// 1 · moneda al aire: 12 o 4.000
const Moneda: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1f232a">{(tt) => {
  const p = cl((tt - 0.3) / 2.8), y = 760 - Math.sin(p * Math.PI) * 620, a = (1 - (1 - p) * (1 - p)) * 3600 + 0, face = Math.cos(a * Math.PI / 180) > 0;
  return <>
    <div style={ab(960 - 250, y - 250, { width: 500, height: 500, borderRadius: "50%", transform: `perspective(1400px) rotateX(${a}deg)`, background: face ? "conic-gradient(#a8802a,#f6dd8b,#b88f35,#efd27c,#a8802a)" : "conic-gradient(#7f868e,#e8ecf0,#8c939b,#dfe3e8,#7f868e)", boxShadow: SHAD })}><div style={ab(34, 34, { width: 432, height: 432, borderRadius: "50%", boxShadow: "inset 0 0 0 7px rgba(0,0,0,.25)" })} /><div style={{ ...txt(0, face ? 170 : 186, face ? 180 : 130, face ? "#4b3710" : "#3b4046"), width: 500, textAlign: "center", transform: `scaleY(${face ? 1 : -1})` }}>{face ? "$12" : "$4,000"}</div></div>
    <div style={ab(960 - 240 + 0, 880, { width: 480, height: 40, borderRadius: "50%", background: "rgba(0,0,0,.4)", filter: "blur(16px)", opacity: 0.3 + 0.6 * cl(y / 760) })} />
  </>;
}}</Stage>;

// 2 · la mano arrebata las llaves del mostrador
const LlavesMostrador: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#25211a" mesa={false}>{(tt) => {
  const gr = eio(tt, 1.2, 1.9), bk = eio(tt, 2.2, 3.1);
  return <>
    <div style={ab(0, 620, { width: 1920, height: 460, background: "linear-gradient(#845b34,#4a3019)" })} />
    <div style={ab(0, 610, { width: 1920, height: 26, background: "#a57a4b" })} />
    <div style={ab(1200, 240, { width: 520, height: 400, borderRadius: 18, background: "#16181b", boxShadow: SHAD })}><div style={ab(24, 24, { width: 472, height: 300, background: "#0b2238" })}><div style={{ fontFamily: LCD, fontWeight: 900, position: "absolute", width: 472, textAlign: "center", top: 74, fontSize: 112, color: "#ff7b63" }}>$2,000</div></div></div>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${-bk * 1000}px,${-bk * 340}px)` }}>
      <div style={ab(lerp(150, 660, gr) + 40, 590 - gr * 20, { width: 300, height: 110 })}><div style={ab(0, 10, { width: 110, height: 110, borderRadius: "50%", border: "24px solid #c9b264", boxSizing: "border-box" })} /><div style={ab(100, 54, { width: 240, height: 32, background: "linear-gradient(#efe0a0,#8b7b42)" })} /></div>
    </div>
    <div style={{ position: "absolute", inset: 0, transform: `translate(${lerp(-1020, 0, gr) - bk * 1000}px,${-bk * 340}px)` }}>
      <div style={ab(180, 520, { width: 620, height: 210, borderRadius: 100, background: "linear-gradient(#cc9a73,#9d6e4b)", boxShadow: SHAD })} /><div style={ab(-200, 556, { width: 560, height: 170, background: "linear-gradient(#34507c,#1e3050)" })} />
      {[0, 1, 2, 3].map((i) => <div key={i} style={ab(690 + i * 16, 540 + i * 42, { width: 170, height: 52, borderRadius: 26, background: "linear-gradient(#dcaa82,#b07a55)" })} />)}
    </div>
  </>;
}}</Stage>;

// 3 · seis relojitos: uno se sale y prende la luz
const SeisRelojes: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#14171c" mesa={false}>{(tt) => {
  const out = eio(tt, 1.4, 2.4), lit = cl((tt - 2.4) * 4);
  return <>
    <div style={ab(0, 0, { width: 1920, height: 1080, background: "linear-gradient(#1f2228,#090a0d)" })} />
    {Array.from({ length: 6 }, (_, i) => { const x = 260 + (i % 3) * 500, y = 110 + Math.floor(i / 3) * 350, bad = i === 4, a = (bad ? out * 62 : 0) + 7 * Math.sin(tt * 2 + i * 2) - 10; return <div key={i} style={ab(x, y, { width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(#242830,#0b0c0f)", boxShadow: `0 0 0 10px #5b626a, 0 0 ${bad ? out * 50 : 0}px ${RED}` })}><div style={ab(60, 60, { width: 200, height: 200, borderRadius: "50%", background: "conic-gradient(from -60deg,#3bb36f 0 120deg,transparent 120deg)" })}><div style={ab(16, 16, { width: 168, height: 168, borderRadius: "50%", background: "#14171c" })} /></div><div style={ab(153, 44, { width: 14, height: 118, background: bad && out > 0.5 ? RED : "#f3f1e8", transformOrigin: "50% 100%", transform: `rotate(${a}deg)`, borderRadius: 7 })} /><div style={ab(136, 136, { width: 48, height: 48, borderRadius: "50%", background: CHROME })} /></div>; })}
    <Eng x={760} y={806} w={400} c={lit > 0 ? "#ff9b24" : "#3a3024"} glow={lit > 0 ? "rgba(255,160,40,.9)" : undefined} />
  </>;
}}</Stage>;

// 4 · la misma luz, dos cables: la tapa o el motor
const Horquilla: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#191c21" mesa={false}>{(tt) => {
  const p = cl((tt - 0.6) / 1.5), q = cl((tt - 1.8) / 1.4);
  return <>
    <Eng x={140} y={350} w={480} c="#ff9b24" glow="rgba(255,160,40,.85)" />
    <svg width="1920" height="1080" style={{ position: "absolute", left: 0, top: 0 }}><path d="M640 520 C 900 520 900 240 1200 240" fill="none" stroke="#e6c54f" strokeWidth="16" pathLength={1} strokeDasharray={`${p} 1`} /><path d="M640 520 C 900 520 900 800 1200 800" fill="none" stroke="#e6c54f" strokeWidth="16" pathLength={1} strokeDasharray={`${q} 1`} /></svg>
    <div style={ab(1250, 90, { width: 300, height: 300, borderRadius: "50%", opacity: cl(p * 2 - 1), background: "repeating-conic-gradient(#18191c 0 10deg,#2e3035 10deg 20deg)", boxShadow: SHAD })}><div style={ab(60, 60, { width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(#3a3d42,#17181b)" })} /></div>
    <div style={{ ...txt(1600, 200, 86, MZ, cl(p * 2 - 1)) }}>$12</div>
    <div style={ab(1240, 660, { width: 320, height: 290, borderRadius: 26, opacity: cl(q * 2 - 1), background: "linear-gradient(#7d858e,#3b4047)", boxShadow: SHAD })}>{[0, 1, 2].map((i) => <div key={i} style={ab(26 + i * 95, 30, { width: 78, height: 78, borderRadius: "50%", background: "#111317" })} />)}</div>
    <div style={{ ...txt(1580, 775, 74, RED, cl(q * 2 - 1)) }}>$2,000</div>
  </>;
}}</Stage>;

// 5 · el panal del catalizador se derrite
const Panal: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1b1412" mesa={false}>{(tt) => {
  const m = cl((tt - 0.9) / 2.8), fl = Math.sin(tt * 22) > 0.2;
  return <>
    <div style={ab(100, 260, { width: 1720, height: 560, borderRadius: 120, background: "linear-gradient(#6b6e73,#2c2e32)", boxShadow: SHAD })} />
    <div style={ab(420, 300, { width: 1080, height: 480, borderRadius: 70, overflow: "hidden", background: "#180c07" })}>
      {Array.from({ length: 22 * 11 }, (_, i) => { const c = i % 22, r = Math.floor(i / 22), d = Math.max(0, m * 1.6 - (r + rnd(c) * 2) / 12 - c / 44), sag = d * 90; return <div key={i} style={ab(c * 49 + (r % 2) * 24, r * 45 + sag, { width: 42, height: 40 + sag * 0.5, background: `hsl(${26 - d * 12} 92% ${40 + d * 24}%)`, clipPath: "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)", opacity: d > 1.2 ? 0 : 1 })} />; })}
    </div>
    {Array.from({ length: 9 }, (_, i) => { const k = ((tt * 0.9 + i * 0.11) % 1); return <div key={i} style={ab(120 + k * 300, 440 + (i - 4) * 32, { width: 46, height: 20, borderRadius: 10, background: "rgba(255,226,120,.85)", opacity: 1 - k, filter: "blur(3px)" })} />; })}
    <div style={ab(790, 30, { width: 340, height: 170, borderRadius: 16, background: "#0c0d10", boxShadow: "inset 0 0 0 6px #3a3d43" })}><Eng x={100} y={32} w={150} c={fl ? "#ff9b24" : "#40301c"} /></div>
  </>;
}}</Stage>;

// 6 · taxímetro: 11 millas, 1.900 dólares
const Taximetro: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#231c15" mesa={false}>{(tt) => {
  const v = Math.round(lerp(45, 1900, eio(tt, 0.6, 3.3))), mi = Math.min(11, Math.floor(cl((tt - 0.6) / 2.7) * 12));
  return <>
    <div style={ab(0, 720, { width: 1920, height: 360, background: "linear-gradient(#48454a,#1e1d1f)" })} />
    <div style={{ position: "absolute", left: 0, top: 780, width: 1920, height: 18, backgroundImage: "repeating-linear-gradient(90deg,#e7c95f 0 110px,transparent 110px 230px)", backgroundPosition: `${-tt * 620}px 0` }} />
    <div style={ab(380, 130, { width: 1160, height: 540, borderRadius: 34, background: "linear-gradient(#efc13d,#b0851a)", boxShadow: SHAD })}>
      <div style={ab(70, 70, { width: 1020, height: 280, borderRadius: 18, background: "#0d0a06", boxShadow: "inset 0 0 26px #000" })}><div style={{ fontFamily: LCD, fontWeight: 900, position: "absolute", width: 1020, textAlign: "center", top: 36, fontSize: 210, color: v > 500 ? "#ff5e49" : "#ffd27a" }}>${v.toLocaleString("en-US")}</div></div>
      <div style={{ ...txt(90, 400, 90, "#2a1c04") }}>{mi} MILES</div>
      <div style={ab(860, 390, { width: 230, height: 100, background: "#2a1c04", borderRadius: 14 })}><div style={{ ...txt(0, 20, 62, "#f3c84e"), width: 230, textAlign: "center" }}>HIRED</div></div>
    </div>
  </>;
}}</Stage>;

// 7 · la paleta que se da vuelta: por favor → pará
const PaletaStop: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#18191d" mesa={false}>{(tt) => {
  const f = eio(tt, 1.6, 2.3), front = f < 0.5, a = f * 180, sw = 5 * Math.exp(-Math.max(0, tt - 2.3)) * Math.sin(tt * 9);
  return <>
    <div style={ab(925, 680, { width: 70, height: 500, background: "linear-gradient(90deg,#3a2613,#7a542e,#3a2613)" })} />
    <div style={{ position: "absolute", left: 960, top: 410, transform: `perspective(1500px) rotateY(${front ? a : a - 180}deg) rotate(${sw}deg)` }}>
      <div style={ab(-340, -340, { width: 680, height: 680, clipPath: "polygon(29% 0,71% 0,100% 29%,100% 71%,71% 100%,29% 100%,0 71%,0 29%)", background: front ? "linear-gradient(#f6a53a,#c56e12)" : "linear-gradient(#d53228,#8c1610)", boxShadow: SHAD })}>
        {front ? <><Eng x={140} y={120} w={400} c="#2a1a06" /><div style={{ ...txt(0, 450, 88, "#2a1a06"), width: 680, textAlign: "center" }}>PLEASE</div></> : <div style={{ ...txt(0, 240, 210, "#fff"), width: 680, textAlign: "center" }}>STOP</div>}
      </div>
    </div>
  </>;
}}</Stage>;

// 8 · el lector y el rosario en la guantera
const Rosario: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1a1b1f" mesa={false}>{(tt) => {
  const r = phys(tt, 0.3, 7, 0.45), k = eio(tt, 0.8, 2.6), N = 46;
  return <>
    <div style={ab(250, 130, { width: 1420, height: 780, background: "linear-gradient(#23252a,#0f1013)", boxShadow: "inset 0 0 0 26px #2f3136, inset 0 40px 60px #000" })} />
    <div style={ab(500 + (1 - r) * 0, 330 + (1 - r) * -640, { width: 340, height: 480, borderRadius: 26, background: "linear-gradient(#2c3137,#101215)", boxShadow: SHAD, transform: "rotate(-6deg)" })}><div style={ab(32, 36, { width: 276, height: 170, borderRadius: 10, background: "#0a1518" })}><div style={{ fontFamily: LCD, fontWeight: 900, position: "absolute", width: 276, textAlign: "center", top: 54, fontSize: 56, color: "#7fe0ff" }}>P0457</div></div>{[0, 1].map((i) => <div key={i} style={ab(48 + i * 140, 256, { width: 104, height: 70, borderRadius: 14, background: "#3a3e45" })} />)}</div>
    {Array.from({ length: Math.floor(N * k) }, (_, i) => { const a = (i / N) * 6.283 + 0.9, x = 1190 + 250 * Math.cos(a), y = 500 + 200 * Math.sin(a) + 26 * Math.sin(a * 3); return <div key={i} style={ab(x, y, { width: 34, height: 34, borderRadius: "50%", background: "radial-gradient(circle at 36% 30%,#c98f54,#5a3414)", boxShadow: "0 4px 6px rgba(0,0,0,.4)" })} />; })}
    {k > 0.96 && <svg width="120" height="180" viewBox="0 0 12 18" style={{ position: "absolute", left: 1050, top: 690 }}><path d="M5 0h2v5h5v2H7v11H5V7H0V5h5z" fill="#c98f54" /></svg>}
  </>;
}}</Stage>;

// 9 · el estrado: el código declara, nadie en la silla del juez
const Estrado: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#20150f" mesa={false}>{(tt) => {
  const s = cl((tt - 0.4) * 1.5), m = eio(tt, 1.8, 2.5);
  return <>
    <div style={ab(0, 0, { width: 1920, height: 1080, background: "linear-gradient(#3d2614,#1a0f07)" })} />
    <div style={ab(1100, 80, { width: 700, height: 920, background: "linear-gradient(#5a381c,#2d1b0c)", boxShadow: SHAD })}><div style={ab(180, 80, { width: 340, height: 500, borderRadius: "170px 170px 30px 30px", background: "linear-gradient(#20140a,#110a05)" })} /></div>
    <div style={ab(1060, 620, { width: 780, height: 90, background: "linear-gradient(#8a5a2b,#54351a)" })} />
    <div style={ab(0, 0, { width: 1100, height: 1080, background: `radial-gradient(ellipse 480px 620px at 500px 520px,rgba(255,226,160,${s * .5}),transparent 72%)` })} />
    <div style={ab(250, 620, { width: 500, height: 460, background: "linear-gradient(#7a4f25,#44290f)", boxShadow: SHAD })} />
    <div style={ab(320, 280, { width: 360, height: 360, borderRadius: 26, background: "linear-gradient(#2c3137,#101215)", boxShadow: SHAD })}><div style={ab(30, 40, { width: 300, height: 190, borderRadius: 10, background: "#0a1518" })}><div style={{ fontFamily: LCD, fontWeight: 900, position: "absolute", width: 300, textAlign: "center", top: 62, fontSize: 62, color: "#7fe0ff" }}>P0420</div></div></div>
    <div style={ab(540, 200, { width: 18, height: 220, background: CHROME, transform: "rotate(28deg)", transformOrigin: "50% 100%" })} /><div style={ab(556, 150, { width: 70, height: 100, borderRadius: 34, background: "linear-gradient(90deg,#2b2d31,#6b7077,#2b2d31)" })} />
    <div style={{ ...txt(1180, 800, 96, MZ, m) }}>A WITNESS</div>
  </>;
}}</Stage>;

// 10 · la jeringa chupa el bidón: si la tapa no cierra, no aguanta
const BotellaVac: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1d2026">{(tt) => {
  const pull = eio(tt, 0.6, 1.9), rel = tt > 2.8 ? eio(tt, 2.8, 3.1) : 0, sq = pull * (1 - rel);
  return <>
    <div style={ab(420, 300, { width: 660, height: 560, borderRadius: `${70 + sq * 120}px ${70 + sq * 120}px 40px 40px / ${50 + sq * 170}px ${50 + sq * 170}px 40px 40px`, background: "linear-gradient(90deg,#b52a24,#ea5249 40%,#982019)", boxShadow: SHAD, transform: `scaleX(${1 - sq * 0.16})` })} />
    <div style={ab(560, 190 + rel * -160, { width: 180, height: 120, borderRadius: 16, background: "linear-gradient(#34373c,#111214)", transform: `rotate(${rel * 34}deg)` })} />
    <div style={ab(1080, 560, { width: 150, height: 40, background: "#c1c5ca" })} />
    <div style={ab(1200, 460, { width: 520, height: 210, background: "rgba(220,235,245,.22)", boxShadow: "inset 0 0 0 7px rgba(240,245,250,.75)" })}><div style={ab(20 + sq * 320, 10, { width: 44, height: 190, background: "#2b2d31" })} /></div>
    <div style={ab(1240 + sq * 320, 548, { width: 560, height: 34, background: CHROME })} />
    {rel > 0 && [0, 1, 2].map((i) => { const p = ((tt + i * 0.2) % 0.6) / 0.6; return <div key={i} style={ab(530 - p * 240 + i * 40, 150 - p * 140, { width: 44, height: 44, borderRadius: "50%", border: "6px solid rgba(255,255,255,.6)", opacity: 1 - p })} />; })}
    <Tag tt={tt} at={3.0} x={960} y={140} txt="WONT HOLD" col={RED} />
  </>;
}}</Stage>;

// 11 · la tapa gira y hace clic con su rueda dentada
const ClickTapa: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#191b20" mesa={false}>{(tt) => {
  const a = eio(tt, 0.4, 2.4) * 300 + (tt > 2.4 ? 5 * Math.exp(-(tt - 2.4) * 8) : 0), cl2 = tt > 2.45 ? Math.max(0, 1 - (tt - 2.45) * 3) : 0, rip = eio(tt, 3.0, 3.8);
  return <>
    <div style={ab(480, 120, { width: 840, height: 840, borderRadius: "50%", background: "repeating-conic-gradient(#303238 0 7deg,#0e0f12 7deg 14deg)", boxShadow: `${SHAD}, 0 0 ${cl2 * 120}px rgba(255,214,120,${cl2})`, transform: `rotate(${a}deg)` })}><div style={ab(110, 110, { width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(#2a2c31,#101114)" })}><div style={ab(250, 40, { width: 120, height: 540, borderRadius: 40, background: "linear-gradient(90deg,#1b1c1f,#42454b,#1b1c1f)" })} /></div></div>
    <div style={ab(1360, 300, { width: 460, height: 340, background: "linear-gradient(170deg,#fbf8ee,#e9e3d0)", boxShadow: SHAD, transform: `rotate(${6 + rip * 40}deg) translateY(${rip * 700}px)`, opacity: 1 - cl((rip - 0.6) * 3) })}><div style={{ ...txt(0, 110, 112, RED), width: 460, textAlign: "center" }}>$2,000</div></div>
    {cl2 > 0 && <div style={{ ...txt(0, 470, 150, MZ, cl2), width: 960, textAlign: "center" }}>CLICK</div>}
  </>;
}}</Stage>;

// 12 · hilos rojos entre dos columnas del cuaderno: siempre 2 días
const Hilos: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#17271f">{(tt) => {
  const N = 7, k = cl((tt - 0.5) / 2.8);
  return <>
    <div style={ab(280, 70, { width: 1360, height: 940, background: "repeating-linear-gradient(180deg,#f7f4e8 0 56px,#bcd5c6 56px 58px)", boxShadow: SHAD })}><div style={ab(676, 0, { width: 8, height: 940, background: "#3c6c55" })} />
      {Array.from({ length: N }, (_, i) => <React.Fragment key={i}><Hand x={70} y={60 + i * 122} s={64} rot={0}>{`fill  ${3 + i * 4}/${12 - (i % 3)}`}</Hand><Hand x={780} y={60 + i * 122} s={64} c="#a42c25" rot={0} k={cl(k * N - i)}>{`light  ${5 + i * 4}/${12 - (i % 3)}`}</Hand></React.Fragment>)}
    </div>
    <svg width="1920" height="1080" style={{ position: "absolute", left: 0, top: 0 }}>{Array.from({ length: N }, (_, i) => { const j = cl(k * N - i); return <path key={i} d={`M770 ${160 + i * 122} Q960 ${124 + i * 122} 1110 ${160 + i * 122}`} fill="none" stroke="#c1261d" strokeWidth="9" pathLength={1} strokeDasharray={`${j} 1`} />; })}</svg>
    <div style={{ position: "absolute", left: 960, top: 500, transform: "translate(-50%,-50%) rotate(-6deg)", opacity: cl(tt - 3.2), background: YEL, padding: "30px 60px", boxShadow: SHAD }}><div style={{ fontFamily: HAND, fontSize: 130, fontWeight: 700, color: "#1e2b63", whiteSpace: "nowrap" }}>2 days after</div></div>
  </>;
}}</Stage>;

// 13 · surtidor: el clic, y el dedo sigue apretando
const Surtidor: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1f2329" mesa={false}>{(tt) => {
  const v = lerp(38.42, 40.0, eio(tt, 1.6, 3.2)), over = eio(tt, 2.1, 3.6), clk = tt > 1.45 && tt < 1.9;
  return <>
    <div style={ab(140, 80, { width: 720, height: 950, borderRadius: 26, background: "linear-gradient(#d3372c,#8c1a13)", boxShadow: SHAD })}><div style={ab(60, 90, { width: 600, height: 340, borderRadius: 14, background: "#0a0c0e" })}><div style={{ fontFamily: LCD, fontWeight: 900, position: "absolute", width: 600, textAlign: "center", top: 90, fontSize: 158, color: "#8dff9e" }}>{v.toFixed(2)}</div></div>{clk && <div style={{ ...txt(0, 520, 130, "#fff"), width: 720, textAlign: "center" }}>CLICK</div>}</div>
    <div style={ab(1000, 600, { width: 800, height: 400, background: "linear-gradient(#e7e8e9,#9a9ea3)", borderRadius: "0 30px 30px 0", boxShadow: SHAD })} /><div style={ab(1090, 690, { width: 170, height: 170, borderRadius: "50%", background: "#181a1d", boxShadow: "inset 0 0 26px #000" })}><div style={ab(25, 170 - over * 150, { width: 120, height: over * 150, background: "#d2a951", borderRadius: "50%" })} /></div>
    {over > 0 && <div style={ab(1150, 840, { width: 46, height: 200 * over, borderRadius: 20, background: "linear-gradient(#d2a951,#b0833a)" })} />}
    <svg width="760" height="560" viewBox="0 0 760 560" style={{ position: "absolute", left: 680, top: 240 }}><path d="M130 90 L420 90 L480 170 L560 330 L500 370 L420 220 L130 220 Z" fill="#17181b" /><rect x="460" y="330" width="140" height="44" fill="#55585e" transform="rotate(60 530 350)" /></svg>
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${Math.sin(tt * 18) * cl((tt - 1.9) * 2) * 4}px)` }}><div style={ab(800, 410, { width: 240, height: 90, borderRadius: 45, background: "linear-gradient(#dcaa82,#b07a55)", transform: "rotate(-8deg)" })} /></div>
  </>;
}}</Stage>;

// 14 · dos sondas en el caño: antes y después
const DosSondas: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1a1c21" mesa={false}>{(tt) => {
  const f = (tt * 280) % 200, w1 = 40 * Math.sin(tt * 8), w2 = 14 * Math.sin(tt * 2.4);
  const Sn: React.FC<{ x: number; w: number; }> = ({ x, w }) => <><div style={ab(x - 46, 150, { width: 92, height: 270, background: "linear-gradient(90deg,#4b4f55,#d6dade,#4b4f55)", clipPath: "polygon(20% 0,80% 0,100% 70%,70% 100%,30% 100%,0 70%)" })} /><div style={ab(x - 170, 10, { width: 340, height: 130, borderRadius: 18, background: "#0a1518", boxShadow: "inset 0 0 0 6px #3a3d43" })}><svg width="340" height="130"><path d={`M0 65 ${Array.from({ length: 34 }, (_, i) => `L${i * 10} ${65 + w * Math.sin(i * 0.5)}`).join(" ")}`} fill="none" stroke="#7fe0ff" strokeWidth="6" /></svg></div></>;
  return <>
    <div style={ab(-60, 400, { width: 2040, height: 300, borderRadius: 40, background: "linear-gradient(#83878d,#3e4146)", boxShadow: SHAD })} />
    <div style={ab(720, 330, { width: 480, height: 440, borderRadius: 60, background: "linear-gradient(#a2a6ab,#54575c)", boxShadow: SHAD })} />
    {Array.from({ length: 9 }, (_, i) => <div key={i} style={ab(-100 + i * 200 + f + (i % 2) * 40, 530 + (i % 3 - 1) * 50, { width: 90, height: 34, borderRadius: 17, background: "rgba(235,235,240,.55)", filter: "blur(7px)" })} />)}
    <Sn x={420} w={w1} /><Sn x={1500} w={w2} />
    <Tag tt={tt} at={1.7} x={420} y={830} txt="BEFORE" col={MZ} size={84} /><Tag tt={tt} at={2.2} x={1500} y={830} txt="AFTER" col={MZ} size={84} />
  </>;
}}</Stage>;

// 15 · la sonda con aureola: la honesta
const Aureola: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#20232a" mesa={false}>{(tt) => {
  const d = phys(tt, 0.7, 6, 0.4), g = 0.75 + 0.25 * Math.sin(tt * 3), r = 3.2 * Math.sin(tt * 1.3);
  return <>
    <div style={ab(0, 0, { width: 1920, height: 1080, background: `radial-gradient(ellipse 620px 620px at 960px 430px,rgba(255,226,150,${0.34 * g}),transparent 72%)` })} />
    <div style={{ position: "absolute", left: 960, top: 620, transform: `rotate(${r}deg)` }}><div style={ab(-120, -360, { width: 240, height: 700, background: "linear-gradient(90deg,#4b4f55,#e3e6ea 45%,#4b4f55)", clipPath: "polygon(22% 0,78% 0,100% 62%,68% 100%,32% 100%,0 62%)", boxShadow: SHAD })} />{[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={ab(-140, 40 + i * 28, { width: 280, height: 14, background: "#6c7077" })} />)}</div>
    <div style={ab(960 - 290, 150 + (1 - d) * -500, { width: 580, height: 130, borderRadius: "50%", border: "28px solid #f2cd64", boxSizing: "border-box", boxShadow: `0 0 ${50 + g * 60}px rgba(255,214,120,.85)` })} />
    <Tag tt={tt} at={2.5} x={1520} y={620} txt="TELLS TRUTH" col={MZ} size={86} />
  </>;
}}</Stage>;

// 16 · esposas en la alarma de humo
const Esposas: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#20242c" mesa={false}>{(tt) => {
  const d = phys(tt, 0.5, 7, 0.4), lt = Math.sin(tt * 7) > 0.4;
  return <>
    <div style={ab(0, 0, { width: 1920, height: 180, background: "linear-gradient(#d7d4c9,#a7a498)" })} />
    <div style={ab(960 - 370, 150, { width: 740, height: 300, borderRadius: "0 0 370px 370px", background: "linear-gradient(#fbfaf3,#d6d3c7)", boxShadow: SHAD })}>{[0, 1, 2, 3, 4, 5, 6].map((i) => <div key={i} style={ab(90 + i * 80, 50, { width: 44, height: 140 - Math.abs(i - 3) * 22, borderRadius: 18, background: "#b8b5a9" })} />)}<div style={ab(345, 230, { width: 50, height: 50, borderRadius: "50%", background: lt ? "#ff3524" : "#7d1812", boxShadow: lt ? "0 0 40px #ff3524" : undefined })} /></div>
    <svg width="1100" height="520" viewBox="0 0 1100 520" style={{ position: "absolute", left: 410, top: 380 + (1 - d) * 700 }}><g fill="none" stroke="#c3c8ce" strokeLinecap="round"><circle cx="280" cy="280" r="150" strokeWidth="42" /><circle cx="820" cy="280" r="150" strokeWidth="42" /><path d="M430 280 q 30 -44 60 0 q 30 44 60 0 q 30 -44 60 0 q 30 44 60 0" strokeWidth="26" /></g></svg>
    {[0, 1, 2].map((i) => <div key={i} style={ab(720 + i * 170 + 26 * Math.sin(tt * 1.4 + i), -20 + ((tt * 40) % 40), { width: 130, height: 200, borderRadius: 65, background: "rgba(230,230,235,.3)", filter: "blur(26px)" })} />)}
    <Tag tt={tt} at={2.6} x={960} y={980} txt="WRONG GUY" col={MZ} size={100} />
  </>;
}}</Stage>;

// 17 · alambre del MAF y un pelo al lado
const HiloFino: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#17191e" mesa={false}>{(tt) => {
  const z = eio(tt, 0.3, 1.7), film = cl((tt - 1.6) / 2.2);
  return <>
    <div style={ab(960 - 470, 540 - 470, { width: 940, height: 940, borderRadius: "50%", background: "#0e1014", boxShadow: "0 0 0 34px #71777f," + SHAD, overflow: "hidden" })}>
      <div style={ab(0, 310 - z * 20, { width: 940, height: 26 + z * 90, background: "linear-gradient(#a6a8ad,#f5f5f6 45%,#88898d)", boxShadow: "0 0 34px rgba(255,190,120,.5)" })}>
        {Array.from({ length: 90 }, (_, i) => <div key={i} style={ab(rnd(i) * 930, rnd(i + 7) * (22 + z * 90), { width: 16 + rnd(i + 2) * 34, height: 12 + rnd(i + 3) * 14, borderRadius: 7, background: "#4e4231", opacity: cl(film * 2 - i / 90) * 0.92 })} />)}
      </div>
      <div style={ab(0, 620, { width: 940, height: 8 + z * 180, background: "linear-gradient(#21160d,#533a24 45%,#21160d)", transform: "rotate(-2deg)", borderRadius: 40 })} />
    </div>
    <Tag tt={tt} at={1.9} x={330} y={200} txt="THE WIRE" col={TX} size={72} /><Tag tt={tt} at={2.4} x={1600} y={830} txt="ONE HAIR" col={MZ} size={72} />
  </>;
}}</Stage>;

// 18 · la lata buena de $9 y las dos que lo arruinan
const TresLatas: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1f2126">{(tt) => {
  const L = [["BRAKE", "#b32a22", 500, 0.3, 1.5], ["MAF", "#2c6eb1", 960, 0.5, 0], ["CARB", "#b5832a", 1420, 0.7, 1.9]] as const;
  return <>{L.map(([s, c, x, a, off], i) => { const d = phys(tt, a, 7, 0.42), f = off ? Math.max(0, tt - off) : 0, y = 950 * f * f, g = !off && tt > 2.1; return <div key={i} style={ab(x - 150, 180 + (1 - d) * -760 + y, { width: 300, height: 700, transform: `rotate(${f * 70 * (i ? 1 : -1)}deg)`, filter: g ? "drop-shadow(0 0 40px rgba(255,214,120,.8))" : undefined })}><div style={ab(100, 0, { width: 100, height: 60, background: "#d6d9dd" })} /><div style={ab(44, 56, { width: 212, height: 70, borderRadius: "50% 50% 0 0", background: "linear-gradient(90deg,#858b92,#eef0f3,#858b92)" })} /><div style={ab(0, 120, { width: 300, height: 580, borderRadius: 18, background: `linear-gradient(90deg,#10121588,transparent 35%,#10121566),${c}` })}><div style={{ ...txt(0, 220, 74, "#fff"), width: 300, textAlign: "center" }}>{s}</div></div></div>; })}
    <Tag tt={tt} at={2.4} x={960} y={960} txt="$9 ONLY THIS" col={MZ} size={86} /></>;
}}</Stage>;

// 19 · la luz del tablero con los ojos vendados
const Venda: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#0d0e11" mesa={false}>{(tt) => {
  const k = eio(tt, 0.7, 1.6), bo = 1 - k * 0.8;
  return <>
    <Eng x={420} y={180} w={1080} c={`rgba(255,155,36,${0.2 + bo * 0.8})`} glow={bo > 0.5 ? "rgba(255,160,40,.9)" : undefined} />
    <div style={ab(lerp(-1800, 290, k), 400, { width: 1340, height: 230, background: "linear-gradient(#26272b,#0d0e10 45%,#2f3035)", borderRadius: 16, transform: "rotate(-2deg)", boxShadow: "0 22px 34px rgba(0,0,0,.65)" })}>{Array.from({ length: 20 }, (_, i) => <div key={i} style={ab(i * 68, 0, { width: 2, height: 230, background: "rgba(255,255,255,.07)" })} />)}</div>
    <div style={ab(1590, 370, { width: 170, height: 150, opacity: cl(k * 2 - 1), background: "#0f1012", clipPath: "polygon(0 22%,100% 0,74% 100%,16% 96%)" })} />
    <Tag tt={tt} at={2.3} x={960} y={930} txt="ROSIE AGAIN" col={MZ} size={96} />
  </>;
}}</Stage>;

// 20 · hilera de foquitos que se apagan al sacar la batería
const FocosNoReady: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#14161b" mesa={false}>{(tt) => {
  const off = eio(tt, 0.8, 1.5), n = 8, dead = Math.floor(cl((tt - 1.2) / 1.1) * n);
  return <>
    <div style={ab(200, 60, { width: 620, height: 320, borderRadius: 24, background: "linear-gradient(#2f3238,#121316)", boxShadow: SHAD })}><div style={ab(100, -40, { width: 110, height: 60, background: "#c2c5ca" })} /><div style={ab(420, -40, { width: 110, height: 60, background: "#c43a30" })} /></div>
    <svg width="900" height="520" viewBox="0 0 900 520" style={{ position: "absolute", left: 400, top: -120 }}><path d={`M90 150 C 120 ${10 - off * 80} ${180 + off * 60} ${40 - off * 60} ${200 + off * 240} ${40 + off * 40}`} fill="none" stroke="#b6362c" strokeWidth="24" /></svg>
    {Array.from({ length: n }, (_, i) => { const on = i >= dead; return <div key={i} style={ab(190 + i * 200, 480, { width: 150, height: 150, borderRadius: "50%", background: on ? "radial-gradient(#fff8d6,#f0c04c)" : "radial-gradient(#3a3a38,#1a1a19)", boxShadow: on ? "0 0 54px rgba(255,214,120,.85)" : "inset 0 8px 16px #000" })} />; })}
    <div style={{ ...txt(0, 730, 200, RED, cl(tt - 2.5)), width: 1920, textAlign: "center" }}>NOT READY</div>
  </>;
}}</Stage>;

// 21 · la mano de póker dada vuelta en la mesa
const PokerAbierto: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#132416" mesa={false}>{(tt) => {
  const S = ["THE", "LIGHT", "IS", "ON", "ONLY"];
  return <>
    <div style={ab(-200, 200, { width: 2320, height: 1000, background: "radial-gradient(ellipse,#2b6a42,#123621)" })} />
    {S.map((s, i) => { const a = 0.4 + i * 0.3, k = eio(tt, a, a + 0.45), f = k * 180; return <div key={i} style={ab(330 + i * 270, 500 + Math.abs(i - 2) * 26, { width: 240, height: 340, transform: `rotate(${(i - 2) * 6}deg)`, perspective: 1200 })}><div style={{ position: "absolute", inset: 0, transform: `rotateY(${f}deg)`, transformStyle: "preserve-3d" }}><div style={{ position: "absolute", inset: 0, borderRadius: 16, background: "repeating-linear-gradient(45deg,#8c1e1e 0 16px,#6c1212 16px 32px)", backfaceVisibility: "hidden", boxShadow: SHAD }} /><div style={{ position: "absolute", inset: 0, borderRadius: 16, background: "linear-gradient(#fbf8ee,#e7e1cd)", backfaceVisibility: "hidden", transform: "rotateY(180deg)", boxShadow: SHAD }}><div style={{ ...txt(0, 130, 60, "#1b1b1b"), width: 240, textAlign: "center" }}>{s}</div></div></div></div>; })}
    {[0, 1, 2, 3].map((i) => <div key={i} style={ab(660 + i * 110, 60, { width: 200, height: 280, borderRadius: 14, background: "repeating-linear-gradient(45deg,#26364f 0 14px,#16243a 14px 28px)", boxShadow: SHAD, transform: `rotate(${(i - 1.5) * 7}deg)` })} />)}
  </>;
}}</Stage>;

// 22 · el motor por dentro: la chispa falla en el 2
const ChispaFalla: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#17181c" mesa={false}>{(tt) => {
  const ord = [0, 2, 3, 1], now = Math.floor(tt * 3.6) % 4, sh = Math.sin(tt * 38) * cl(tt - 1) * 6;
  return <div style={{ position: "absolute", inset: 0, transform: `translateX(${sh}px)` }}>
    <div style={ab(240, 120, { width: 1440, height: 840, borderRadius: 34, background: "linear-gradient(#54575c,#26282c)", boxShadow: SHAD })} />
    {[0, 1, 2, 3].map((i) => { const fire = ord[now] === i, bad = i === 1, off = (Math.sin(tt * 3.6 * Math.PI + i * 2) + 1) / 2 * 140; return <div key={i} style={ab(330 + i * 330, 200, { width: 280, height: 640, overflow: "hidden", background: fire && !bad ? "radial-gradient(ellipse at 50% 10%,#ffe29a,#ff8a22 40%,#401a05)" : "radial-gradient(ellipse at 50% 10%,#30323a,#101114)", borderRadius: 16 })}><div style={ab(16, 280 + off, { width: 248, height: 320, borderRadius: "16px 16px 0 0", background: "linear-gradient(#b4bac1,#5e646b)" })} /><div style={ab(110, 0, { width: 60, height: 80, background: "#c9c2ae" })} /><div style={{ ...txt(0, 90, 92, bad ? RED : "rgba(255,255,255,.75)"), width: 280, textAlign: "center" }}>{i + 1}</div></div>; })}
  </div>;
}}</Stage>;

// 23 · trilero: el código sigue a la bobina
const Trilero: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#1d1a14">{(tt) => {
  const s1 = eio(tt, 1.2, 2.2), lift = eio(tt, 2.8, 3.3), xs = [lerp(1160, 760, s1), lerp(760, 1160, s1)], arc = Math.sin(s1 * Math.PI) * 130;
  const Cup: React.FC<{ x: number; y: number; lab: string; up?: number }> = ({ x, y, lab, up = 0 }) => <div style={ab(x - 160, 330 + y - up * 240, { width: 320, height: 430, background: "linear-gradient(90deg,#5b3517,#a9733d 40%,#5b3517)", clipPath: "polygon(18% 0,82% 0,100% 100%,0 100%)", boxShadow: SHAD })}><div style={{ ...txt(0, 180, 104, "#f6e6c5"), width: 320, textAlign: "center" }}>{lab}</div></div>;
  return <>
    <div style={ab(480, 690, { width: 960, height: 100, borderRadius: "50%", background: "rgba(0,0,0,.4)", filter: "blur(18px)" })} />
    <div style={ab(xs[1] - 90, 590, { width: 180, height: 170, borderRadius: 24, background: "linear-gradient(#ffb23e,#b56a0e)", boxShadow: "0 0 50px rgba(255,170,60,.7)" })}><div style={{ ...txt(0, 44, 64, "#2a1a06"), width: 180, textAlign: "center" }}>COIL</div></div>
    <Cup x={xs[0]} y={-arc} lab="3" /><Cup x={xs[1]} y={arc * 0.2} lab="2" up={lift} />
  </>;
}}</Stage>;

// 24 · Marta por encima de los anteojos
const Anteojos: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1d1b18" mesa={false}>{(tt) => {
  const d = eio(tt, 0.6, 1.6);
  return <>
    <div style={ab(0, 0, { width: 1920, height: 1080, background: "radial-gradient(ellipse at 50% 40%,#3a342b,#14120f)" })} />
    {[550, 1010].map((x, i) => <div key={x} style={ab(x, 190, { width: 360, height: 200, borderRadius: "50%", background: "radial-gradient(#fbf9f3,#d9d6cc)", overflow: "hidden", boxShadow: "inset 0 -10px 18px rgba(0,0,0,.18)" })}><div style={ab(120, 44, { width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle at 38% 34%,#5b3b1f,#120a05 58%)" })} /><div style={ab(-20, -116 + d * 22, { width: 400, height: 160, background: "#b58b6e", borderBottom: "9px solid #5d4332", transform: `rotate(${i ? -7 : 7}deg)` })} /></div>)}
    {[510, 970].map((x) => <div key={x} style={ab(x, 90 + d * 26, { width: 440, height: 40, borderRadius: 20, background: "#7a7168", transform: x === 510 ? "rotate(6deg)" : "rotate(-6deg)" })} />)}
    <div style={{ position: "absolute", left: 0, top: d * 270, width: 1920, height: 400 }}>
      {[490, 980].map((x) => <div key={x} style={ab(x, 250, { width: 450, height: 300, borderRadius: 90, border: "22px solid #8a2d36", boxSizing: "border-box", background: "linear-gradient(115deg,rgba(255,255,255,.3),rgba(190,225,255,.06) 40%,rgba(255,255,255,.18))" })}><div style={{ fontFamily: LCD, fontWeight: 900, position: "absolute", width: 400, textAlign: "center", top: 96, fontSize: 86, color: `rgba(127,224,255,${cl(tt - 1.5)})` }}>P0128</div></div>)}
      <div style={ab(910, 350, { width: 100, height: 26, borderRadius: 13, background: "#8a2d36" })} />
    </div>
  </>;
}}</Stage>;

// 25 · termostato trabado: el agua se va de largo y la aguja no sube
const TermoTrabado: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#172028" mesa={false}>{(tt) => {
  const f = (tt * 260) % 170, nd = -82 + 18 * cl(tt / 1.4) + 2 * Math.sin(tt * 3);
  return <>
    <div style={ab(-60, 330, { width: 1320, height: 380, background: "linear-gradient(#566069,#2d343a)", boxShadow: SHAD })}><div style={ab(0, 28, { width: 1320, height: 324, background: "#174a78", overflow: "hidden" })}>{Array.from({ length: 12 }, (_, i) => <div key={i} style={ab(-180 + i * 170 + f, 30 + (i % 4) * 72, { width: 100, height: 14, borderRadius: 7, background: "rgba(220,240,255,.6)" })} />)}</div></div>
    <div style={ab(590, 220, { width: 34, height: 600, background: CHROME })} /><div style={ab(460, 400, { width: 300, height: 240, background: "radial-gradient(#d6a14a,#8d6420)", borderRadius: "48%", boxShadow: SHAD, transform: "perspective(600px) rotateY(72deg)" })} />
    <div style={ab(1300, 150, { width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(#23272e,#0c0d10)", boxShadow: "0 0 0 14px #5d646c," + SHAD })}><div style={{ ...txt(54, 330, 74, "#7fc0ff") }}>C</div><div style={{ ...txt(390, 330, 74, RED) }}>H</div><div style={ab(243, 84, { width: 14, height: 170, background: "#f4f1e8", transformOrigin: "50% 100%", transform: `rotate(${nd}deg)`, borderRadius: 7 })} /><div style={ab(218, 218, { width: 64, height: 64, borderRadius: "50%", background: CHROME })} /></div>
    <Tag tt={tt} at={2.2} x={1550} y={800} txt="STUCK OPEN" col={MZ} size={84} />
  </>;
}}</Stage>;

// 26 · dos ondas que se parecen demasiado
const OndaGemela: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#0f1418" mesa={false}>{(tt) => {
  const k = eio(tt, 1.2, 3.2), wv = (A: number, ph: number) => "M0 " + 270 + " " + Array.from({ length: 180 }, (_, i) => `L${i * 8} ${270 + A * Math.sin(i * 0.22 + tt * 5 + ph) + A * 0.3 * Math.sin(i * 0.61 + tt * 7 + ph)}`).join(" ");
  return <>
    <div style={ab(250, 150, { width: 1420, height: 760, borderRadius: 36, background: "linear-gradient(#2c3036,#14161a)", boxShadow: SHAD })}>
      <div style={ab(50, 80, { width: 1320, height: 590, borderRadius: 14, background: "#07110d", backgroundImage: "repeating-linear-gradient(0deg,rgba(90,190,120,.14) 0 2px,transparent 2px 66px),repeating-linear-gradient(90deg,rgba(90,190,120,.14) 0 2px,transparent 2px 66px)" })}>
        <svg width="1320" height="590"><path d={wv(150, 0)} fill="none" stroke="#6bff9b" strokeWidth="9" /><path d={wv(lerp(30, 138, k), k * 0.2 + (1 - k) * 2)} fill="none" stroke="#ffb040" strokeWidth="9" /></svg>
      </div>
    </div>
    <Tag tt={tt} at={3.0} x={960} y={990} txt="TOO ALIKE" col={MZ} size={96} />
  </>;
}}</Stage>;

// 27 · pistola infrarroja: entra 480, sale 590
const PistolaIR: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#17191e" mesa={false}>{(tt) => {
  const s = eio(tt, 1.5, 2.3), x = lerp(520, 1400, s);
  return <>
    <div style={ab(-60, 610, { width: 2040, height: 200, borderRadius: 30, background: "linear-gradient(#83878d,#3e4146)", boxShadow: SHAD })} />
    <div style={ab(700, 540, { width: 520, height: 340, borderRadius: 60, background: "linear-gradient(#9fa3a8,#54575c)", boxShadow: SHAD })} />
    <svg width="1920" height="1080" style={{ position: "absolute", left: 0, top: 0 }}><line x1={x} y1="370" x2={x} y2="690" stroke="#ff2a1a" strokeWidth="6" /><circle cx={x} cy="694" r="20" fill="#ff5a48" /></svg>
    <div style={ab(x - 190, 130, { width: 380, height: 240, borderRadius: 34, background: "linear-gradient(#2a6bb1,#123a68)", boxShadow: SHAD })}><div style={ab(40, 36, { width: 300, height: 130, borderRadius: 12, background: "#0a1518" })}><div style={{ fontFamily: LCD, fontWeight: 900, position: "absolute", width: 300, textAlign: "center", top: 24, fontSize: 86, color: "#7fe0ff" }}>{Math.round(lerp(480, 590, s))}°</div></div></div>
    <Tag tt={tt} at={0.7} x={400} y={900} txt="GOING IN" col={TX} size={72} /><Tag tt={tt} at={2.4} x={1520} y={900} txt="COMING OUT" col={MZ} size={72} />
  </>;
}}</Stage>;

// 28 · placa de bronce: la ley
const Placa880: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#201b12">{(tt) => {
  const d = phys(tt, 0.4, 6, 0.4), sh = cl((tt - 1.5) / 1.6);
  return <>
    <div style={ab(330, 130 + (1 - d) * -860, { width: 1260, height: 780, borderRadius: 26, background: "linear-gradient(135deg,#7c5a22,#e6c376 42%,#9a7330 62%,#dcb666 82%,#6a4b18)", boxShadow: SHAD, overflow: "hidden" })}>
      {[[34, 34], [1186, 34], [34, 706], [1186, 706]].map(([x, y], i) => <div key={i} style={ab(x, y, { width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(#6e4f1b,#2d1f08)" })} />)}
      <div style={{ ...txt(0, 140, 216, "#3f2c0b"), width: 1260, textAlign: "center", textShadow: "0 3px 1px rgba(255,235,180,.55)" }}>8 YEARS</div><div style={{ ...txt(0, 440, 138, "#3f2c0b"), width: 1260, textAlign: "center", textShadow: "0 3px 1px rgba(255,235,180,.55)" }}>80,000 MILES</div>
      <div style={ab(lerp(-500, 1500, sh), -80, { width: 280, height: 980, background: "rgba(255,250,225,.42)", transform: "rotate(16deg)", filter: "blur(14px)" })} />
    </div>
  </>;
}}</Stage>;

// 29 · la pantalla era una marioneta: hilos desde arriba
const PantallaHilos: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#1b1d22" mesa={false}>{(tt) => {
  const sw = 7 * Math.sin(tt * 1.8), bo = 22 * Math.sin(tt * 2.6), rv = eio(tt, 1.8, 2.8);
  return <>
    <div style={{ position: "absolute", left: 300, top: 0, width: 1320, height: 640 }}><svg width="1320" height="640">{[120, 460, 860, 1200].map((x, i) => <line key={i} x1={660 + (x - 660) * 0.4} y1="0" x2={x + sw * 10} y2={380 + bo * (i % 2 ? 1 : -1)} stroke={`rgba(235,235,225,${rv})`} strokeWidth="5" />)}</svg></div>
    <div style={ab(660 + sw * 3, -60, { width: 600, height: 170, opacity: rv, borderRadius: 100, background: "linear-gradient(#cc9a73,#9d6e4b)", boxShadow: SHAD })} />
    <div style={ab(420 + sw * 10, 370 + bo * 0.5, { width: 1080, height: 640, borderRadius: 28, background: "#14171b", boxShadow: SHAD, transform: `rotate(${sw * 0.6}deg)` })}><div style={ab(40, 40, { width: 1000, height: 480, background: "#0b2238", borderRadius: 10 })}><div style={{ fontFamily: LCD, fontWeight: 900, position: "absolute", width: 1000, textAlign: "center", top: 150, fontSize: 130, color: "#ff7b63" }}>YOU NEED IT</div></div></div>
  </>;
}}</Stage>;

// 30 · destornillador en la oreja de don Chuy
const DestornilladorOreja: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#241d14" mesa={false}>{(tt) => {
  const p = eio(tt, 0.4, 1.4);
  return <>
    <div style={ab(-120, 520, { width: 1100, height: 700, borderRadius: 60, background: "linear-gradient(#60666c,#25282d)", boxShadow: SHAD })} />
    <div style={ab(1160, 60, { width: 700, height: 940, borderRadius: "50% 46% 44% 50%", background: "radial-gradient(circle at 44% 40%,#b58563,#694128 78%)", boxShadow: SHAD })}><div style={ab(70, 330, { width: 200, height: 330, borderRadius: "54% 50% 58% 46%", background: "linear-gradient(135deg,#caa07a,#7f5438)", boxShadow: "inset 8px 10px 22px rgba(60,30,10,.55)" })}><div style={ab(66, 112, { width: 88, height: 130, borderRadius: "50%", background: "radial-gradient(#3a2112,#6a3f26)" })} /></div></div>
    <div style={{ position: "absolute", left: lerp(-600, 0, p), top: 0, width: 1920, height: 1080 }}><div style={ab(1020, 470, { width: 300, height: 92, borderRadius: 46, background: "linear-gradient(#db8a25,#8f5309)", boxShadow: SHAD, transform: "rotate(-18deg)" })} /><div style={ab(340, 620, { width: 720, height: 30, background: CHROME, transform: "rotate(-18deg)", transformOrigin: "100% 50%" })} /></div>
    {[0, 1, 2].map((i) => { const k = ((tt + i * 0.33) % 1); return tt > 1.4 && <div key={i} style={ab(1000 - 60 - k * 120, 500 - 60 - k * 120, { width: 240 + k * 240, height: 240 + k * 240, borderRadius: "50%", border: `7px solid rgba(255,214,120,${(1 - k) * .8})` })} />; })}
  </>;
}}</Stage>;

// 31 · maqueta de vías: la rutina
const ViasCambio: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#20281c" mesa={false}>{(tt) => {
  const k = cl((tt - 0.4) / 4.5), p = (s: number) => cl((k - s) * 3), x = lerp(120, 1500, k), y = k < 0.35 ? 540 : 540 + ((k - 0.35) / 0.65) * ((k > 0 ? 1 : 0) * -220);
  const Rail: React.FC<{ d: string }> = ({ d }) => <><path d={d} fill="none" stroke="#6b4a2c" strokeWidth="56" strokeDasharray="12 34" /><path d={d} fill="none" stroke="#c8ccd1" strokeWidth="9" transform="translate(0,-18)" /><path d={d} fill="none" stroke="#c8ccd1" strokeWidth="9" transform="translate(0,18)" /></>;
  return <>
    <div style={ab(0, 0, { width: 1920, height: 1080, background: "radial-gradient(#566b43,#27321e)" })} />
    <svg width="1920" height="1080" style={{ position: "absolute", left: 0, top: 0 }}><Rail d="M0 540 L620 540 C 900 540 1000 320 1920 320" /><Rail d="M620 540 C 900 540 1000 760 1920 760" /></svg>
    <div style={ab(x - 120, y - 70, { width: 240, height: 130, borderRadius: 30, background: "linear-gradient(#ff9b24,#b56a0e)", boxShadow: "0 18px 26px rgba(0,0,0,.5)", transform: `rotate(${k > 0.35 ? -10 : 0}deg)` })}><div style={{ ...txt(0, 36, 52, "#2a1a06"), width: 240, textAlign: "center" }}>LIGHT</div></div>
    <div style={ab(1400, 120, { width: 400, height: 120, borderRadius: 16, background: "#e7ddc3", opacity: p(0.45), boxShadow: SHAD })}><div style={{ ...txt(0, 34, 58, "#2c2a24"), width: 400, textAlign: "center" }}>STEADY</div></div>
    <div style={ab(1400, 830, { width: 400, height: 120, borderRadius: 16, background: "#b13a2a", opacity: p(0.55), boxShadow: SHAD })}><div style={{ ...txt(0, 34, 58, "#fff4dc"), width: 400, textAlign: "center" }}>FLASHING</div></div>
  </>;
}}</Stage>;

// 32 · estante con precio que sube como escalera
const Estante5: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#231e17" mesa={false}>{(tt) => {
  const P = [["CAP", "$12"], ["HOSE", "$4+"], ["CAN", "$9"], ["COIL", "$70"], ["CAT", "$2,500"]];
  return <>{P.map(([o, p], i) => { const d = phys(tt, 0.3 + i * 0.5, 7, 0.45), h2 = 150 + i * 118, x = 170 + i * 330; return <React.Fragment key={i}>
    <div style={ab(x, 900 - h2, { width: 300, height: h2, background: "linear-gradient(#73522f,#3f2a14)", boxShadow: SHAD })} />
    <div style={ab(x + 30, 900 - h2 - 170 + (1 - d) * -700, { width: 240, height: 170, borderRadius: 18, background: i === 4 ? "linear-gradient(#b3b7bd,#5e6268)" : "linear-gradient(#3a3d42,#17181b)", boxShadow: SHAD })}><div style={{ ...txt(0, 54, 58, TX), width: 240, textAlign: "center" }}>{o}</div></div>
    <div style={{ ...txt(x, 900 - h2 + 40, 72, MZ, cl(d)), width: 300, textAlign: "center" }}>{p}</div>
  </React.Fragment>; })}</>;
}}</Stage>;

// 33 · la caja se tambalea y asoman siete fichas
const CajaAsoma: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#1a1b1f" mesa={false}>{(tt) => {
  const w = Math.sin(tt * 8) * 2.5 * cl(tt - 0.4), q = cl((tt - 1.4) / 2.6);
  return <>
    <div style={ab(150, 840, { width: 1620, height: 40, background: "linear-gradient(#a2a6ab,#54575c)" })} />
    <div style={{ position: "absolute", left: 960, top: 840, transform: `rotate(${w}deg)`, transformOrigin: "50% 100%" }}>
      {Array.from({ length: 7 }, (_, i) => { const k = cl(q * 7 - i), a = (i - 3) * 13, up = k * 300; return <div key={i} style={ab(-120 + (i - 3) * 62, -470 - up, { width: 240, height: 340, background: "repeating-linear-gradient(180deg,#fbf8ee 0 30px,#bcd0e6 30px 32px)", borderRadius: 8, transform: `rotate(${a * k}deg)`, boxShadow: "0 12px 20px rgba(0,0,0,.45)" })}><div style={{ ...txt(0, 110, 110, "#a42c25", 1, HAND), width: 240, textAlign: "center" }}>{i + 1}</div></div>; })}
      <div style={ab(-430, -430, { width: 860, height: 430, background: "linear-gradient(#c49a63,#94703f)", boxShadow: SHAD, borderRadius: 6 })}><div style={ab(390, 0, { width: 80, height: 430, background: "rgba(214,190,140,.7)" })} /></div>
    </div>
    <Tag tt={tt} at={3.2} x={960} y={150} txt="NEVER BACK" col={MZ} />
  </>;
}}</Stage>;

export const TEC: Record<string, C> = { moneda: Moneda, llavesmostrador: LlavesMostrador, seisrelojes: SeisRelojes, horquilla: Horquilla, panal: Panal, taximetro: Taximetro, paletastop: PaletaStop, rosario: Rosario, estrado: Estrado, botellavac: BotellaVac, clicktapa: ClickTapa, hilos: Hilos, surtidor: Surtidor, dossondas: DosSondas, aureola: Aureola, esposas: Esposas, hilofino: HiloFino, treslatas: TresLatas, venda: Venda, focosnoready: FocosNoReady, pokerabierto: PokerAbierto, chispafalla: ChispaFalla, trilero: Trilero, anteojos: Anteojos, termotrabado: TermoTrabado, ondagemela: OndaGemela, pistolair: PistolaIR, placa880: Placa880, pantallahilos: PantallaHilos, destornilladororeja: DestornilladorOreja, viascambio: ViasCambio, estante5: Estante5, cajaasoma: CajaAsoma };
