// Capítulo 9 (16:06.9 → 17:43.9): 1990 Canadá ×3; convertibilidad 1991; 2001 default + corralito + 5 presidentes;
// Canadá nunca se salió del camino; Tommy Douglas y la salud pública; la pampa sigue rica (harina de soja);
// lo que falló fue el trato: quién es dueño y quién sólo trabaja.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { P, proj, pop, fadeOut, vis, ease, clamp, Region, Country, Tag, Flag, BigWord, Clouds, SANS, HAND, geo, FPS } from "../Main";
import { K, camOf, blurOf, World, YearCorner, Portal2, HandNote, Vignette } from "./common";

import { sf } from "../sf";
const BA: [number, number] = [-58.4, -34.6];

const KEYS: K[] = [
  [966.9, -61, -34, 2.3],
  [968.0, -82, 9, 0.42],
  [977.0, -82, 9, 0.45],
  [978.0, BA[0], BA[1], 3.0],
  [997.3, BA[0], BA[1], 3.4],
  [998.5, BA[0], BA[1], 4.5],
  [1015.0, BA[0], BA[1], 4.8],
  [1016.4, -82, 9, 0.42],
  [1019.6, -82, 9, 0.44],
  [1020.8, -106, 53, 2.2],
  [1029.2, -106, 53, 2.4],
  [1030.4, -95, 58, 0.75],
  [1042.5, -95, 58, 0.8],
  [1043.6, -61, -35, 2.0],
  [1063.9, -61, -35, 2.25],
];

const chip = (bg: string): React.CSSProperties => ({ background: bg, color: "#fff", border: "5px solid #fff", borderRadius: 10, padding: "6px 26px", fontFamily: SANS, fontWeight: 900, fontSize: 52, whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(0,0,0,.4)" });
const stamp = (col: string): React.CSSProperties => ({ border: `7px solid ${col}`, color: col, background: "rgba(255,250,240,.92)", fontFamily: SANS, fontWeight: 900, fontSize: 64, padding: "2px 30px", borderRadius: 12, whiteSpace: "nowrap" });
const paper: React.CSSProperties = { background: "linear-gradient(#fbf6e6,#efe4c4)", border: "5px solid #fff", boxShadow: "0 24px 50px rgba(0,0,0,.55)" };
const Coin: React.FC<{ label: string; sub: string; col: string; size?: number }> = ({ label, sub, col, size = 190 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #fff, ${col} 55%, #555 120%)`, border: "6px solid #fff", boxShadow: "0 14px 30px rgba(0,0,0,.45)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, color: "#1b2433" }}>
    <div style={{ fontSize: size * 0.32 }}>{label}</div><div style={{ fontSize: size * 0.11 }}>{sub}</div>
  </div>
);

export const Ch9: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const f = t * FPS;
  const c = camOf(KEYS, t);
  const blur = blurOf(KEYS, t, FPS);
  const at = (t0: number, d = 0.35) => interpolate(t, [t0, t0 + d], [0, 1], clamp);
  const off = (t1: number, d = 0.4) => interpolate(t, [t1, t1 + d], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: "#2f6fb8", overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id="mb9"><feGaussianBlur stdDeviation={blur.toFixed(2)} /></filter></svg>
      <AbsoluteFill style={{ filter: blur > 0.6 ? "url(#mb9)" : undefined }}>
        <World c={c} modern={interpolate(t, [1043.6, 1046.0], [0, 1], clamp)}>
          <Region d={geo.prov.Saskatchewan.d} op={at(1025.6) * off(1029.6)} z={c.z} color="#2a9d3a" />
          <Country iso="CAN" color="#2a9d3a" op={0.55 * at(1034.5, 1.4) * off(1042.4)} z={c.z} />
          <Region d={geo.prov.Saskatchewan.d} op={at(1031.7) * off(1042.4)} z={c.z} color="#9be05a" />
          <Region d={geo.prov.Pampas.d} op={0.8 * at(1044.3) * off(1063.6)} z={c.z} color="#3f9d2a" />
        </World>
      </AbsoluteFill>
      <Clouds c={c} f={f} t={t} />
      <YearCorner f={f} t={t} marks={[[967.0, "1990"], [970.6, "1991"], [986.1, "1990s"], [992.3, "2001"], [1016.4, "1930s → 2000s"], [1024.0, "1944"], [1030.4, "1962"], [1035.0, "1970s"], [1047.3, "today"]]} />

      {/* 1990: casi tres veces más rica */}
      {vis(t, 967.0, 970.4) && <div style={{ position: "absolute", left: 960, top: 560, transform: "translate(-50%,-50%)", opacity: off(970.3), display: "flex", gap: 90, alignItems: "flex-end" }}>
        {[["ar", 100, "#4aa3df"], ["ca", 280, "#d42a1e"]].map(([cc, v, col], i) => { const h = 1.4 * (v as number) * interpolate(t, [967.4 + i * 0.5, 968.8 + i * 0.5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }); return <div key={i} style={{ textAlign: "center" }}>
          {i === 1 && t > 968.8 && <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 90, color: "#ffd23a", textShadow: "0 4px 14px rgba(0,0,0,.6)", transform: `scale(${pop(f, 968.79, 8)})` }}>×3</div>}
          <div style={{ width: 160, height: h, background: col as string, border: "5px solid #fff", borderBottom: "none", borderRadius: "10px 10px 0 0", margin: "0 auto" }} />
          <Img src={sf(`flag_${cc}.png`)} style={{ width: 120, border: "4px solid #fff", marginTop: 10 }} />
        </div>; })}
      </div>}
      {/* 1991: peso = dólar por ley */}
      {vis(t, 970.5, 977.9) && <div style={{ position: "absolute", left: 960, top: 520, transform: "translate(-50%,-50%)", opacity: off(977.8), textAlign: "center" }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 60, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.6)", transform: `scale(${pop(f, 972.6, 8)})`, opacity: at(972.5) }}>A <span style={{ color: "#ffd23a" }}>RADICAL</span> CURE</div>
        <div style={{ display: "flex", gap: 40, alignItems: "center", justifyContent: "center", marginTop: 30 }}>
          {t > 974.4 && <div style={{ transform: `scale(${pop(f, 974.49, 8)})` }}><Coin label="$1" sub="PESO" col="#c9c9c9" /></div>}
          {t > 975.8 && <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 120, color: "#fff", transform: `scale(${pop(f, 975.87, 8)})` }}>=</div>}
          {t > 975.1 && <div style={{ transform: `scale(${pop(f, 975.15, 8)})` }}><Coin label="$1" sub="US DOLLAR" col="#8fc98a" /></div>}
        </div>
        {t > 976.6 && <div style={{ display: "inline-block", marginTop: 26, transform: `rotate(-4deg) scale(${pop(f, 976.61, 7)})`, ...stamp("#1d3f73") }}>BY LAW</div>}
      </div>}
      {vis(t, 978.0, 982.8) && <div style={{ position: "absolute", left: 960, top: 480, transform: "translate(-50%,-50%)", opacity: off(982.7), textAlign: "center", textShadow: "0 6px 24px rgba(0,0,0,.6)" }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 64, color: "#fff" }}>INFLATION</div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 170, color: interpolate(t, [978.2, 979.2], [0, 1], clamp) < 1 ? "#ff5040" : "#9be05a", lineHeight: 1 }}>{Math.round(interpolate(t, [978.2, 979.2], [3000, 0], { ...clamp, easing: Easing.in(Easing.quad) })).toLocaleString("en-US")}%</div>
        {t > 980.0 && <div style={{ fontFamily: HAND, fontSize: 84, color: "#ffd23a", marginTop: 10 }}>{"the country felt rich again".slice(0, Math.floor(interpolate(t, [980.0, 981.7], [0, 27], clamp)))}</div>}
      </div>}
      {/* la moneda no puede ser más fuerte que el país */}
      {vis(t, 982.9, 985.9) && <div style={{ position: "absolute", left: 960, top: 560, transform: "translate(-50%,-50%)", opacity: off(985.8), textAlign: "center" }}>
        <div style={{ transform: `translateY(${interpolate(t, [984.5, 985.6], [0, 80], { ...clamp, easing: Easing.in(Easing.quad) })}px) rotate(${interpolate(t, [984.5, 985.6], [0, 18], clamp)}deg)` }}><Coin label="$1" sub="PESO = DOLLAR" col="#c9c9c9" size={230} /></div>
        <div style={{ width: 160, height: 160, margin: "0 auto", background: "repeating-linear-gradient(0deg,#b38b5a 0 18px,#8a6a42 18px 22px)", border: "5px solid #fff", clipPath: t > 984.5 ? "polygon(0 0,45% 0,52% 40%,40% 60%,55% 100%,0 100%,0 0,100% 0,100% 100%,60% 100%,48% 62%,58% 38%,50% 0)" : undefined }} />
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 40, color: "#fff", marginTop: 8, textShadow: "0 4px 14px rgba(0,0,0,.6)" }}>THE COUNTRY BEHIND IT</div>
      </div>}
      {vis(t, 986.0, 991.9) && <div style={{ position: "absolute", left: 960, top: 540, transform: "translate(-50%,-50%)", display: "flex", gap: 40, alignItems: "flex-end", opacity: off(991.8) }}>
        {[["DEBT ↑", 986.11, "#b22"], ["EXPORTS: TOO EXPENSIVE", 987.19, "#7a5a12"], ["ECONOMY ↓", 990.49, "#333"]].map(([w, tt, col], i) => t >= (tt as number) ? <div key={i} style={{ textAlign: "center", transform: `scale(${pop(f, tt as number, 8)})` }}>
          <div style={{ width: 120, height: i === 2 ? 260 - 200 * interpolate(t, [990.5, 991.4], [0, 1], clamp) : 80 + 200 * interpolate(t, [tt as number, (tt as number) + 2.5], [0, 1], clamp), background: col as string, border: "5px solid #fff", borderBottom: "none", margin: "0 auto", borderRadius: "10px 10px 0 0" }} />
          <div style={{ ...chip(col as string), fontSize: 36, marginTop: 10 }}>{w}</div>
        </div> : null)}
      </div>}
      {/* 2001: default */}
      {vis(t, 992.3, 998.5) && <div style={{ position: "absolute", left: 960, top: 520, transform: "translate(-50%,-50%)", textAlign: "center", opacity: off(998.4) }}>
        <div style={{ display: "inline-block", transform: `rotate(-6deg) scale(${pop(f, 993.89, 6) * 1.3})`, ...stamp("#d42a1e"), fontSize: 150, opacity: at(993.8, 0.1) }}>DEFAULT</div>
        {t > 995.9 && <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 56, color: "#fff", marginTop: 40, textShadow: "0 4px 14px rgba(0,0,0,.6)", transform: `scale(${pop(f, 995.99, 8)})` }}>THE LARGEST SOVEREIGN DEFAULT <span style={{ color: "#ffd23a" }}>IN HISTORY</span></div>}
      </div>}
      <Portal2 c={c} t={t} lon={BA[0]} lat={BA[1]} t0={998.5} t1={1002.9} src="v5/img/t_bank_line.png" maxR={2000} />
      {vis(t, 999.8, 1002.9) && <div style={{ position: "absolute", left: 960, top: 940, transform: `translate(-50%,-50%) scale(${pop(f, 999.9, 8) * off(1002.8)})`, ...chip("#111"), fontSize: 50 }}>THEIR OWN SAVINGS — LOCKED INSIDE</div>}
      {/* corralito */}
      {vis(t, 1003.0, 1012.6) && <div style={{ position: "absolute", left: 960, top: 520, width: 0, height: 0, opacity: off(1012.5) }}>
        <div style={{ position: "absolute", left: -330, top: -220, width: 660, height: 360, ...paper, padding: "30px 40px", transform: `rotate(-2deg) scale(${pop(f, 1003.1, 9)})`, fontFamily: SANS, color: "#1b2433" }}>
          <div style={{ fontWeight: 800, fontSize: 26, color: "#59606e" }}>SAVINGS ACCOUNT · DECEMBER 2001</div>
          <div style={{ fontWeight: 900, fontSize: 90, marginTop: 20 }}>$ ●●●●●</div>
          {t > 1006.2 && <div style={{ fontWeight: 900, fontSize: 40, color: "#b22", marginTop: 10 }}>WITHDRAWALS: BLOCKED</div>}
        </div>
        {t > 1004.8 && <svg width={260} height={300} style={{ position: "absolute", left: 160, top: -40, transform: `scale(${pop(f, 1004.81, 7)}) rotate(8deg)` }}>
          <path d="M70,130 V80 a60,60 0 0 1 120,0 V130" fill="none" stroke="#ddd" strokeWidth={26} />
          <rect x={30} y={120} width={200} height={160} rx={20} fill="#d4a017" stroke="#fff" strokeWidth={8} />
          <circle cx={130} cy={190} r={20} fill="#333" /><rect x={122} y={195} width={16} height={40} fill="#333" />
        </svg>}
        {t > 1009.3 && Array.from({ length: 13 }).map((_, i) => { const k = interpolate(t, [1009.4 + i * 0.05, 1009.8 + i * 0.05], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) }); return <div key={i} style={{ position: "absolute", left: -420 + i * 70, top: 120, width: 22, height: 160 * k, background: "#f3e2b0", border: "4px solid #7a5a12", transformOrigin: "bottom", transform: "translateY(-100%) translateY(160px)", borderRadius: "10px 10px 0 0" }} />; })}
        {t > 1009.3 && <div style={{ position: "absolute", left: -440, top: 160, width: 900, height: 18, background: "#7a5a12", border: "3px solid #fff" }} />}
        {t > 1010.0 && <div style={{ position: "absolute", left: 0, top: 330, transform: `translate(-50%,-50%) scale(${pop(f, 1010.05, 8)})`, textAlign: "center", whiteSpace: "nowrap" }}><span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 90, color: "#fff", textShadow: "0 5px 18px rgba(0,0,0,.6)" }}>EL CORRALITO</span><span style={{ fontFamily: HAND, fontSize: 70, color: "#ffd23a" }}>  “the little fence”</span></div>}
      </div>}
      {/* cinco presidentes en dos semanas */}
      {vis(t, 1012.7, 1015.9) && <div style={{ position: "absolute", left: 960, top: 520, transform: "translate(-50%,-50%)", opacity: off(1015.8), textAlign: "center" }}>
        <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
          {[0, 1, 2, 3, 4].map((i) => { const tt = 1013.7 + i * 0.25; return t >= tt ? <div key={i} style={{ width: 150, height: 190, ...paper, transform: `rotate(${(i % 2 ? 4 : -4)}deg) scale(${pop(f, tt, 6)})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: 10 }}>
            <svg width={100} height={120}><circle cx={50} cy={40} r={28} fill="#59606e" /><path d="M5,120 Q50,50 95,120 Z" fill="#59606e" /></svg>
            <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 24, color: "#1b2433" }}>PRESIDENT {i + 1}</div>
          </div> : null; })}
        </div>
        {t > 1012.9 && <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 66, color: "#fff", marginTop: 30, textShadow: "0 4px 14px rgba(0,0,0,.6)" }}>{Math.min(5, Math.max(0, Math.floor((t - 1013.7) / 0.25) + 1))} PRESIDENTS · <span style={{ color: "#ffd23a" }}>2 WEEKS</span></div>}
      </div>}
      {/* Canadá: nunca se salió del camino */}
      {vis(t, 1016.4, 1020.6) && <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) scale(${pop(f, 1016.5, 10) * off(1020.5)})`, width: 1100, height: 440, background: "rgba(14,16,24,.88)", border: "5px solid #fff", borderRadius: 16 }}>
        <svg width={1100} height={440} style={{ position: "absolute" }}>
          {(() => { const k = interpolate(t, [1016.8, 1019.4], [0, 1], clamp); const ca = Array.from({ length: 40 }).map((_, i) => [60 + i * 25, 320 - i * 6 - (i === 14 || i === 15 ? -22 : 0) - (i === 30 ? -14 : 0)]); const ar = Array.from({ length: 40 }).map((_, i) => [60 + i * 25, 300 - i * 2.5 + Math.sin(i * 1.3) * 60 * (i % 4 ? 1 : -1)]); const n = Math.max(2, Math.floor(40 * k)); const d = (pp: number[][]) => pp.slice(0, n).map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" "); return <><path d={d(ar)} stroke="#4aa3df" strokeWidth={8} fill="none" strokeLinejoin="round" /><path d={d(ca)} stroke="#ff5040" strokeWidth={10} fill="none" strokeLinejoin="round" /></>; })()}
        </svg>
        <div style={{ position: "absolute", left: 30, top: 18, display: "flex", gap: 20, fontFamily: SANS, fontWeight: 900, fontSize: 32 }}><span style={{ color: "#ff5040" }}>■ CANADA</span><span style={{ color: "#4aa3df" }}>■ ARGENTINA</span></div>
        {t > 1018.5 && <div style={{ position: "absolute", right: 30, top: 14, fontFamily: HAND, fontSize: 52, color: "#ffd23a" }}>never fell off the road</div>}
      </div>}
      {/* Tommy Douglas */}
      <HandNote f={f} t={t} t0={1020.8} t1={1023.8} x={960} y={190} text="remember the party founded in Calgary?" size={76} />
      <Tag c={c} f={f} t={t} lon={-106} lat={55.4} t0={1025.6} t1={1029.6} text="Saskatchewan" bg="#111" size={30} />
      {vis(t, 1025.2, 1029.6) && <div style={{ position: "absolute", left: 1440, top: 480, transform: `translate(-50%,-50%) rotate(3deg) scale(${pop(f, 1025.27, 10) * off(1029.5)})`, ...paper, padding: "24px 40px", textAlign: "center" }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 60, color: "#2a9d3a" }}>✓ WON POWER</div>
        {t > 1027.2 && <><div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 28, color: "#59606e", marginTop: 12 }}>LED BY A FORMER PREACHER</div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 70, color: "#1b2433", transform: `scale(${pop(f, 1028.57, 8)})` }}>TOMMY DOUGLAS</div></>}
      </div>}
      {/* 1962: seguro médico público → todo el país */}
      <Portal2 c={c} t={t} lon={-106} lat={53} t0={1031.7} t1={1036.3} src="v5/img/u_clinic.png" maxR={280} dx={560} dy={-120} caption="Public medical insurance · 1962" />
      {vis(t, 1034.4, 1037.3) && <div style={{ position: "absolute", left: 1440, top: 860, transform: `translate(-50%,-50%) scale(${pop(f, 1034.5, 9) * off(1037.2)})`, ...chip("#2a7d2e"), fontSize: 50 }}>WITHIN A DECADE: ALL OF CANADA</div>}
      {vis(t, 1037.4, 1043.4) && <div style={{ position: "absolute", left: 960, top: 520, transform: "translate(-50%,-50%)", textAlign: "center", opacity: off(1043.3), textShadow: "0 5px 18px rgba(0,0,0,.6)" }}>
        <div style={{ fontFamily: HAND, fontSize: 80, color: "#fff", whiteSpace: "nowrap", transform: `scale(${pop(f, 1037.5, 8)})` }}>an idea born among wheat farmers</div>
        {t > 1039.3 && <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 110, color: "#9be05a", whiteSpace: "nowrap", transform: `scale(${pop(f, 1039.35, 8)})` }}>160 ACRES EACH</div>}
        {t > 1041.5 && <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 60, color: "#fff", transform: `scale(${pop(f, 1041.59, 8)})` }}>→ SHAPED THE ENTIRE NATION</div>}
      </div>}
      {/* la pampa nunca dejó de ser rica */}
      <Tag c={c} f={f} t={t} lon={-61.5} lat={-32.2} t0={1044.4} t1={1053.0} text="The Pampas" bg="#2a7d2e" size={32} />
      <BigWord f={f} t={t} t0={1044.9} t1={1047.1} text={<span>NEVER STOPPED BEING <span style={{ color: "#9be05a" }}>RICH</span></span>} y={170} size={90} />
      <Portal2 c={c} t={t} lon={-61} lat={-34} t0={1047.6} t1={1053.4} src="v5/img/u_soy.png" maxR={300} dx={-560} dy={-20} />
      {vis(t, 1048.5, 1053.4) && <div style={{ position: "absolute", left: 1420, top: 520, transform: "translate(-50%,-50%)", textAlign: "center", opacity: off(1053.3) }}>
        <div style={{ ...chip("#7a5a12"), fontSize: 40, transform: `scale(${pop(f, 1048.77, 8)})` }}>ONE OF THE BIGGEST FOOD EXPORTERS</div>
        {t > 1051.3 && <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center", marginTop: 24, transform: `scale(${pop(f, 1051.31, 8)})` }}><Img src={sf("icons/trophy.png")} style={{ width: 120 }} /><div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 56, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.6)", textAlign: "left" }}>#1 IN THE WORLD<br /><span style={{ color: "#ffd23a" }}>SOYBEAN MEAL</span></div></div>}
      </div>}
      <HandNote f={f} t={t} t0={1054.3} t1={1056.7} x={960} y={880} text="the Pampas still feed millions" size={90} />
      {vis(t, 1056.8, 1059.1) && <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) scale(${pop(f, 1056.9, 8) * off(1059.0)})`, fontFamily: SANS, fontWeight: 900, fontSize: 90, color: "#fff", textShadow: "0 5px 18px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>THE SOIL <span style={{ color: "#9be05a" }}>NEVER FAILED</span></div>}
      {vis(t, 1059.2, 1063.9) && <div style={{ position: "absolute", left: 960, top: 520, transform: "translate(-50%,-50%)", textAlign: "center", opacity: off(1063.8) }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 70, color: "#fff", textShadow: "0 5px 18px rgba(0,0,0,.6)", transform: `scale(${pop(f, 1059.3, 8)})` }}>WHAT FAILED WAS <span style={{ color: "#ff8a6a" }}>THE DEAL</span></div>
        <div style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 34 }}>
          {[["WHO OWNS IT", 1060.95, "#2a7d2e"], ["WHO ONLY WORKS ON IT", 1061.99, "#d42a1e"]].map(([w, tt, col], i) => t >= (tt as number) ? <div key={i} style={{ ...chip(col as string), fontSize: 56, transform: `rotate(${i ? 3 : -3}deg) scale(${pop(f, tt as number, 8)})` }}>{w}</div> : null)}
        </div>
      </div>}
      <Vignette />
    </AbsoluteFill>
  );
};
