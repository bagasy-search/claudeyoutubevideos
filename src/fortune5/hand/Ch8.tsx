// Capítulo 8 (13:19.3 → 16:06.9): 1929; los dos igual de ricos en 1932; Canadá: el sistema aguanta (Dirty Thirties,
// Bank of Canada, Wheat Board); Argentina: golpe de 1930, seis golpes, Roca-Runciman, Década Infame, fraude patriótico;
// el ciclo; 1945 Canadá 60 % más rica; Perón; las reglas cambian con cada gobierno; 1989: +3.000 %.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { P, proj, pop, fadeOut, vis, ease, clamp, Region, Tag, Flag, BigWord, Route, Clouds, SANS, HAND, geo, FPS } from "../Main";
import { K, camOf, blurOf, World, YearCorner, Portal2, HandNote, Vignette } from "./common";

import { sf } from "../sf";
const BA: [number, number] = [-58.4, -34.6];
const OTTAWA: [number, number] = [-75.7, 45.4];
const LONDON: [number, number] = [-0.1, 51.5];
const PRA = ["Alberta", "Saskatchewan", "Manitoba"].map((n) => geo.prov[n].d).join("");

const KEYS: K[] = [
  [799.3, -61, -33.6, 2.2],
  [801.2, BA[0], BA[1], 3.4],
  [806.0, BA[0], BA[1], 3.7],
  [810.1, -82, 9, 0.42],
  [822.0, -82, 9, 0.46],
  [823.3, -100, 52, 1.3],
  [833.0, -100, 52, 1.45],
  [834.1, -104, 51, 2.0],
  [846.9, -104, 51, 2.2],
  [848.0, OTTAWA[0], OTTAWA[1], 3.2],
  [858.4, OTTAWA[0], OTTAWA[1], 3.5],
  [859.4, -96, 52, 1.2],
  [866.4, -96, 52, 1.3],
  [867.6, BA[0], BA[1], 4.0],
  [879.0, BA[0], BA[1], 4.4],
  [880.7, -28, 12, 0.45],
  [887.6, -28, 12, 0.47],
  [888.6, BA[0], BA[1], 3.0],
  [906.6, BA[0], BA[1], 3.3],
  [907.4, -61, -34, 1.8],
  [919.6, -61, -34, 2.0],
  [920.6, -82, 9, 0.42],
  [926.8, -82, 9, 0.44],
  [927.8, BA[0], BA[1], 4.2],
  [946.3, BA[0], BA[1], 4.6],
  [947.4, -61, -34, 2.0],
  [966.9, -61, -34, 2.3],
];

const chip = (bg: string): React.CSSProperties => ({ background: bg, color: "#fff", border: "5px solid #fff", borderRadius: 10, padding: "6px 26px", fontFamily: SANS, fontWeight: 900, fontSize: 52, whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(0,0,0,.4)" });
const stamp = (col: string): React.CSSProperties => ({ border: `7px solid ${col}`, color: col, background: "rgba(255,250,240,.92)", fontFamily: SANS, fontWeight: 900, fontSize: 64, padding: "2px 30px", borderRadius: 12, whiteSpace: "nowrap" });
const paper: React.CSSProperties = { background: "linear-gradient(#fbf6e6,#efe4c4)", border: "5px solid #fff", boxShadow: "0 24px 50px rgba(0,0,0,.55)" };

// gráfico de línea dibujándose (pantalla)
const LineChart: React.FC<{ t: number; t0: number; pts: number[]; x: number; y: number; w: number; h: number; color: string; dur?: number }> = ({ t, t0, pts, x, y, w, h, color, dur = 1.4 }) => {
  const k = interpolate(t, [t0, t0 + dur], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const xy = pts.map((v, i) => [x + (i / (pts.length - 1)) * w, y + h - v * h]);
  const d = xy.map(([a, b], i) => `${i ? "L" : "M"}${a},${b}`).join(" ");
  let L = 0; for (let i = 1; i < xy.length; i++) L += Math.hypot(xy[i][0] - xy[i - 1][0], xy[i][1] - xy[i - 1][1]);
  return <g><path d={d} fill="none" stroke="#fff" strokeWidth={16} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - k)} /><path d={d} fill="none" stroke={color} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - k)} /></g>;
};

export const Ch8: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const f = t * FPS;
  const c = camOf(KEYS, t);
  const blur = blurOf(KEYS, t, FPS);
  const at = (t0: number, d = 0.35) => interpolate(t, [t0, t0 + d], [0, 1], clamp);
  const off = (t1: number, d = 0.4) => interpolate(t, [t1, t1 + d], [1, 0], clamp);
  const [bx, by] = proj(c, ...P(BA[0], BA[1]));
  return (
    <AbsoluteFill style={{ background: "#2f6fb8", overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id="mb8"><feGaussianBlur stdDeviation={blur.toFixed(2)} /></filter></svg>
      <AbsoluteFill style={{ filter: blur > 0.6 ? "url(#mb8)" : undefined }}>
        <World c={c} modern={0}>
          <Region d={PRA} op={at(834.2) * off(840.2)} z={c.z} color="#b07a3a" />
        </World>
      </AbsoluteFill>
      <Clouds c={c} f={f} t={t} />
      <YearCorner f={f} t={t} marks={[[799.4, "1920s"], [807.6, "1929"], [814.6, "1932"], [823.2, "1930s"], [848.0, "1934"], [853.3, "1935"], [868.4, "1930"], [879.4, "1933"], [888.6, "1930–1943"], [907.3, "1943 →"], [920.6, "1945"], [927.1, "1946"], [947.5, "1950s →"], [957.1, "1989"]]} />

      {/* el dinero entra… y se corta */}
      {vis(t, 799.4, 809.9) && <>
        {Array.from({ length: 16 }).map((_, i) => { const ph = ((t - 799.4) * 0.9 + i / 16) % 1; const stopped = t > 808.8; const born = 799.4 + (i / 16) / 0.9; if (stopped && (t - 799.4) * 0.9 + i / 16 > (808.8 - 799.4) * 0.9 + 1) return null; if (t < born - 1.1) return null; const sx = 1920 + 80, sy = 120; const x = sx + (bx - sx) * ph, y = sy + (by - sy) * ph - Math.sin(ph * Math.PI) * 120; return <div key={i} style={{ position: "absolute", left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: 22, background: "radial-gradient(circle at 35% 35%,#fff3a8,#e0a91e 60%,#a8730c)", border: "3px solid #fff", opacity: (stopped ? 0 : 1) * off(809.6) }} />; })}
        <Img src={sf("icons/tophat.png")} style={{ position: "absolute", left: bx - 70, top: by - 160, width: 140, transform: `scale(${pop(f, 800.0, 9)}) rotate(${t > 808.8 ? Math.sin((t - 808.8) * 30) * 8 * Math.max(0, 1 - (t - 808.8)) : 0}deg)`, opacity: off(809.8) }} />
        <div style={{ position: "absolute", left: 1440, top: 300, transform: `translate(-50%,-50%) scale(${pop(f, 800.5, 9) * off(805.2)})`, ...chip("#7a5a12") }}>WEALTH + POWER = A FEW HANDS</div>
        <HandNote f={f} t={t} t0={802.5} t1={805.2} x={1440} y={420} text="works fine… while the money keeps coming" size={58} />
        <HandNote f={f} t={t} t0={805.4} t1={807.5} x={960} y={880} text="the trouble starts when it stops" size={84} />
        {vis(t, 807.6, 809.9) && <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) scale(${pop(f, 807.62, 7) * off(809.7)})`, fontFamily: SANS, fontWeight: 900, fontSize: 230, color: "#ff5040", textShadow: "0 8px 30px rgba(0,0,0,.6)" }}>1929</div>}
      </>}
      {/* Gran Depresión: el trigo se desploma */}
      {vis(t, 810.1, 814.5) && <>
        <BigWord f={f} t={t} t0={810.2} t1={812.7} text={<span>THE GREAT <span style={{ color: "#ff8a6a" }}>DEPRESSION</span></span>} y={170} />
        <Flag c={c} f={f} t={t} cc="ca" lon={-100} lat={57} t0={811.2} t1={814.4} w={90} />
        <Flag c={c} f={f} t={t} cc="ar" lon={-63} lat={-36} t0={811.4} t1={814.4} w={90} />
        {vis(t, 812.7, 814.5) && <div style={{ position: "absolute", left: 1120, top: 640, width: 640, height: 340, transform: `scale(${pop(f, 812.78, 9)})`, background: "rgba(14,16,24,.88)", border: "4px solid #fff", borderRadius: 14, opacity: off(814.3) }}>
          <div style={{ position: "absolute", left: 24, top: 14, fontFamily: SANS, fontWeight: 900, fontSize: 32, color: "#fff" }}>WHEAT PRICE</div>
          <svg width={640} height={340} style={{ position: "absolute" }}><LineChart t={t} t0={812.9} pts={[0.85, 0.82, 0.62, 0.3, 0.12]} x={40} y={70} w={560} h={210} color="#ff5040" dur={0.9} /></svg>
          <div style={{ position: "absolute", left: 30, bottom: 12, fontFamily: SANS, fontWeight: 800, fontSize: 24, color: "#aaa" }}>1928</div>
          <div style={{ position: "absolute", right: 30, bottom: 12, fontFamily: SANS, fontWeight: 800, fontSize: 24, color: "#aaa" }}>1932</div>
        </div>}
      </>}
      {/* 1932: igual de ricos otra vez… reaccionaron distinto */}
      {vis(t, 815.9, 822.0) && <div style={{ position: "absolute", left: 960, top: 560, transform: "translate(-50%,-50%)", opacity: off(821.9), textAlign: "center" }}>
        <div style={{ display: "flex", gap: 70, alignItems: "flex-end", justifyContent: "center", height: 380 }}>
          {[["ar", 815.96], ["ca", 816.72]].map(([cc, tt], i) => { const h = 300 * interpolate(t, [tt as number, (tt as number) + 0.8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }); const split = interpolate(t, [820.4, 821.6], [0, 1], { ...clamp, easing: ease }); return <div key={i} style={{ textAlign: "center", transform: `translateX(${(i ? 1 : -1) * split * 260}px) rotate(${(i ? 1 : -1) * split * 8}deg)` }}>
            <div style={{ width: 130, height: h, background: i ? "#d42a1e" : "#4aa3df", border: "5px solid #fff", borderBottom: "none", borderRadius: "10px 10px 0 0" }} />
            <Img src={sf(`flag_${cc}.png`)} style={{ width: 110, border: "4px solid #fff", marginTop: 10 }} />
          </div>; })}
        </div>
        {t > 817.6 && <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 64, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.6)", transform: `scale(${pop(f, 817.66, 8)})`, whiteSpace: "nowrap" }}>{t < 820.2 ? <span>ALMOST <span style={{ color: "#ffd23a" }}>EXACTLY</span> AS RICH</span> : <span>…COMPLETELY <span style={{ color: "#ff8a6a" }}>DIFFERENT</span> WAYS</span>}</div>}
      </div>}
      {/* Canadá: el sistema aguantó */}
      <Tag c={c} f={f} t={t} lon={-100} lat={57} t0={823.2} t1={833.0} text="Canada" bg="#d42a1e" size={34} />
      {vis(t, 823.8, 833.0) && (() => { const bend = Math.sin(Math.min(1, Math.max(0, (t - 831.3) / 1.2)) * Math.PI) * 9; return (
        <div style={{ position: "absolute", left: 1460, top: 560, transform: `translate(-50%,-50%) scale(${pop(f, 823.9, 10) * off(832.9)})`, textAlign: "center" }}>
          <div style={{ transform: `skewX(${bend}deg)`, transformOrigin: "bottom" }}>
            <div style={{ width: 360, height: 34, background: "#efe4c4", border: "4px solid #fff" }} />
            <div style={{ display: "flex", gap: 26, justifyContent: "center" }}>{[0, 1, 2].map((i) => <div key={i} style={{ width: 70, height: 300, background: "repeating-linear-gradient(90deg,#e6dcc0 0 12px,#d6caa6 12px 18px)", border: "4px solid #fff", borderTop: "none", borderBottom: "none" }} />)}</div>
            <div style={{ width: 400, height: 34, background: "#efe4c4", border: "4px solid #fff", marginLeft: -20 }} />
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 46, color: "#fff", marginTop: 16, textShadow: "0 4px 14px rgba(0,0,0,.6)" }}>{t < 826.9 ? "THE SYSTEM HELD" : t < 829.4 ? "ELECTIONS, NOT COUPS" : t < 831.2 ? "FARMERS ORGANIZED" : <span>BENT, <span style={{ color: "#9be05a" }}>NOT BROKEN</span></span>}</div>
        </div>); })()}
      {vis(t, 824.4, 825.3) && <div style={{ position: "absolute", left: 540, top: 820, transform: `translate(-50%,-50%) rotate(-3deg) scale(${pop(f, 824.48, 7)})`, ...stamp("#b22") }}>BRUTAL</div>}
      {vis(t, 827.0, 829.4) && <div style={{ position: "absolute", left: 520, top: 800, display: "flex", gap: 16, transform: "translateX(-50%)" }}>
        {[["1930", 827.1], ["1935", 827.9]].map(([y, tt], i) => t >= (tt as number) ? <div key={i} style={{ ...paper, padding: "10px 24px", transform: `rotate(${i ? 4 : -4}deg) scale(${pop(f, tt as number, 8)})`, fontFamily: SANS, fontWeight: 900, fontSize: 36, color: "#1b2433", textAlign: "center" }}>ELECTION<br /><span style={{ color: "#2a7d2e", fontSize: 48 }}>{y}</span></div> : null)}
      </div>}
      {/* Dirty Thirties */}
      <Portal2 c={c} t={t} lon={-104} lat={51} t0={834.2} t1={840.3} src="v5/img/r_dust.png" maxR={2000} />
      {vis(t, 834.9, 838.4) && <div style={{ position: "absolute", left: 960, top: 880, transform: "translateX(-50%)", display: "flex", gap: 22 }}>
        {[["DROUGHT", 835.14], ["DUST STORMS", 835.84], ["GRASSHOPPERS", 836.6]].map(([w, tt], i) => t >= (tt as number) ? <div key={i} style={{ ...chip(["#a3311f", "#7a5a12", "#3d6b1f"][i]), transform: `rotate(${(i % 2 ? 3 : -3)}deg) scale(${pop(f, tt as number, 8) * off(838.3)})` }}>{w}</div> : null)}
      </div>}
      {vis(t, 838.5, 840.3) && <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) rotate(-2deg) scale(${pop(f, 838.6, 8) * off(840.2)})`, textAlign: "center", textShadow: "0 6px 24px rgba(0,0,0,.8)" }}><div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 52, color: "#fff" }}>THEY CALLED IT</div><div style={{ fontFamily: HAND, fontSize: 150, color: "#ffd23a" }}>the Dirty Thirties</div></div>}
      {vis(t, 840.4, 847.0) && <div style={{ position: "absolute", left: 960, top: 540, transform: "translate(-50%,-50%)", opacity: off(846.9), display: "flex", flexDirection: "column", gap: 22 }}>
        {[["THOUSANDS LOST EVERYTHING", 840.4, false], ["THE RULES DIDN'T BREAK", 842.4, true], ["INSTITUTIONS GOT STRONGER", 845.4, true]].map(([w, tt, ok], i) => t >= (tt as number) ? (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, transform: `scale(${pop(f, tt as number, 8)})`, transformOrigin: "left" }}>
            <div style={{ width: 80, height: 80, borderRadius: 40, background: ok ? "#2a9d3a" : "#d42a1e", border: "5px solid #fff", color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>{ok ? "✓" : "✕"}</div>
            <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 64, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.6)" }}>{w}</div>
          </div>) : null)}
      </div>}
      {/* Bank of Canada 1934 + Wheat Board 1935 */}
      <Tag c={c} f={f} t={t} lon={OTTAWA[0]} lat={OTTAWA[1] + 0.45} t0={848.5} t1={853.2} text="Ottawa" bg="#111" size={28} />
      <Portal2 c={c} t={t} lon={OTTAWA[0]} lat={OTTAWA[1]} t0={849.4} t1={853.2} src="v5/img/r_bank.png" maxR={290} dx={-540} dy={-40} caption="Bank of Canada · 1934" />
      {vis(t, 850.6, 853.2) && <div style={{ position: "absolute", left: 1420, top: 360, transform: `translate(-50%,-50%) rotate(3deg) scale(${pop(f, 850.68, 9) * off(853.1)})`, ...chip("#1d3f73"), fontSize: 60 }}>A CENTRAL BANK</div>}
      {vis(t, 854.4, 858.5) && <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) scale(${pop(f, 854.5, 10) * off(858.4)})`, width: 900, height: 460, background: "rgba(14,16,24,.9)", border: "5px solid #ffd23a", borderRadius: 16 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 18, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 48, color: "#ffd23a" }}>CANADIAN WHEAT BOARD · 1935</div>
        <svg width={900} height={460} style={{ position: "absolute" }}>
          <LineChart t={t} t0={855.4} pts={[0.6, 0.15, 0.85, 0.25, 0.7, 0.2]} x={60} y={110} w={380} h={260} color="#ff5040" dur={1.0} />
          <LineChart t={t} t0={856.5} pts={[0.5, 0.55, 0.5, 0.56, 0.52, 0.55]} x={470} y={110} w={380} h={260} color="#9be05a" dur={1.4} />
        </svg>
        <div style={{ position: "absolute", left: 250, bottom: 20, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 800, fontSize: 28, color: "#ff8a6a" }}>BEFORE</div>
        <div style={{ position: "absolute", left: 660, bottom: 20, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 800, fontSize: 28, color: "#9be05a" }}>A STABLE PRICE</div>
      </div>}
      {vis(t, 859.3, 866.4) && <div style={{ position: "absolute", left: 960, top: 520, transform: "translate(-50%,-50%)", textAlign: "center", opacity: off(866.3), textShadow: "0 5px 18px rgba(0,0,0,.6)" }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 110, color: "#9be05a", transform: `scale(${pop(f, 861.3, 8)})` }}>MORE RULES</div>
        {t > 862.1 && <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 70, color: "#fff", transform: `scale(${pop(f, 862.16, 8)})` }}>NOT <span style={{ textDecoration: "line-through", color: "#ff8a6a" }}>FEWER</span></div>}
        {t > 863.9 && <div style={{ fontFamily: HAND, fontSize: 70, color: "#ffd23a", marginTop: 16 }}>{"made by people who had to win elections".slice(0, Math.floor(interpolate(t, [863.9, 865.6], [0, 39], clamp)))}</div>}
      </div>}
      {/* Argentina: golpe de 1930, seis golpes */}
      <Tag c={c} f={f} t={t} lon={BA[0]} lat={BA[1] + 0.25} t0={867.8} t1={878.9} text="Buenos Aires" bg="#111" size={28} />
      <Portal2 c={c} t={t} lon={BA[0]} lat={BA[1]} t0={869.0} t1={873.0} src="v5/img/s_tanks.png" maxR={320} dx={-540} dy={-30} caption="September 1930" />
      {vis(t, 870.2, 872.9) && <div style={{ position: "absolute", left: 1440, top: 420, transform: `translate(-50%,-50%) rotate(-4deg) scale(${pop(f, 871.39, 7) * off(872.8)})`, ...stamp("#b22"), fontSize: 110 }}>COUP</div>}
      {vis(t, 872.7, 875.8) && <div style={{ position: "absolute", left: 960, top: 540, transform: "translate(-50%,-50%)", display: "flex", gap: 22, opacity: off(875.7) }}>
        {["1930", "1943", "1955", "1962", "1966", "1976"].map((y, i) => { const tt = 873.1 + i * 0.22; return t >= tt ? <div key={i} style={{ ...paper, width: 200, padding: "20px 0", textAlign: "center", transform: `rotate(${(i % 2 ? 4 : -4)}deg) scale(${pop(f, tt, 7)})` }}>
          <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 30, color: "#b22" }}>COUP</div>
          <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 56, color: "#1b2433" }}>{y}</div>
        </div> : null; })}
      </div>}
      {vis(t, 873.4, 875.8) && <div style={{ position: "absolute", left: 960, top: 820, transform: `translate(-50%,-50%) scale(${pop(f, 873.4, 8) * off(875.7)})`, fontFamily: SANS, fontWeight: 900, fontSize: 60, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.6)" }}>SIX MILITARY COUPS IN ONE CENTURY</div>}
      {vis(t, 875.9, 879.0) && <div style={{ position: "absolute", left: 1440, top: 360, transform: `translate(-50%,-50%) scale(${off(878.9)})`, textAlign: "center" }}>
        <div style={{ display: "flex", gap: 14 }}>{[0, 1, 2, 3].map((i) => t > 876.4 + i * 0.12 ? <Img key={i} src={sf("icons/tophat.png")} style={{ width: 100, transform: `translateY(${(1 - pop(f, 876.4 + i * 0.12, 8)) * -200}px)` }} /> : null)}</div>
        {t > 877.5 && <div style={{ ...chip("#7a5a12"), fontSize: 44, marginTop: 14, transform: `scale(${pop(f, 877.57, 8)})` }}>THE OLD ELITE: BACK</div>}
      </div>}
      {/* Roca-Runciman 1933 */}
      <Route c={c} t={t} f={f} from={BA} to={LONDON} t0={880.6} t1={887.6} dur={2.4} bend={-600} />
      <Flag c={c} f={f} t={t} cc="gb" lon={LONDON[0]} lat={LONDON[1] + 3} t0={881.9} t1={887.6} w={90} />
      {vis(t, 880.8, 887.6) && <div style={{ position: "absolute", left: 1440, top: 560, transform: `translate(-50%,-50%) rotate(3deg) scale(${pop(f, 881.3, 10) * off(887.5)})`, ...paper, width: 520, padding: "30px 40px", fontFamily: "Georgia, serif", color: "#26314a", textAlign: "center" }}>
        <div style={{ fontSize: 24, letterSpacing: 3 }}>AGREEMENT · 1933</div>
        <div style={{ fontSize: 50, fontWeight: 700, margin: "10px 0" }}>Roca–Runciman</div>
        <div style={{ height: 2, background: "#26314a", margin: "14px 0" }} />
        {t > 883.2 && <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: SANS, fontWeight: 900, fontSize: 34, transform: `scale(${pop(f, 883.29, 8)})` }}><Img src={sf("icons/cow.png")} style={{ width: 80 }} /> PROTECT BEEF EXPORTS</div>}
        {t > 886.6 && <div style={{ position: "absolute", left: 60, top: 140, transform: `rotate(-12deg) scale(${pop(f, 886.71, 7)})`, ...stamp("#b22"), fontSize: 58 }}>HUMILIATION</div>}
      </div>}
      {/* la Década Infame + fraude patriótico */}
      {vis(t, 888.5, 894.0) && <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) scale(${off(893.9)})`, textAlign: "center", textShadow: "0 6px 24px rgba(0,0,0,.7)" }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 90, color: "#fff", transform: `scale(${pop(f, 888.81, 8)})` }}>{Math.round(interpolate(t, [888.9, 889.6], [1, 13], clamp))} YEARS</div>
        {t > 892.2 && <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 130, color: "#ff5040", transform: `rotate(-2deg) scale(${pop(f, 892.31, 8)})`, whiteSpace: "nowrap" }}>LA DÉCADA INFAME</div>}
        {t > 892.5 && <div style={{ fontFamily: HAND, fontSize: 64, color: "#ffd23a" }}>the Infamous Decade</div>}
      </div>}
      <Portal2 c={c} t={t} lon={BA[0]} lat={BA[1]} t0={894.1} t1={900.4} src="v5/img/s_ballot_fraud.png" maxR={330} dx={-520} dy={-20} caption="Rigged elections" />
      {vis(t, 896.2, 900.4) && <div style={{ position: "absolute", left: 1420, top: 520, transform: `translate(-50%,-50%) rotate(-5deg) scale(${pop(f, 897.9, 8) * off(900.3)})`, textAlign: "center" }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 40, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.6)" }}>THEY CALLED IT</div>
        <div style={{ ...stamp("#b22"), fontSize: 64 }}>“PATRIOTIC FRAUD”</div>
        {t > 898.4 && <div style={{ fontFamily: HAND, fontSize: 56, color: "#ffd23a", marginTop: 8 }}>fraude patriótico</div>}
      </div>}
      {/* centro y afuera */}
      {vis(t, 900.5, 906.6) && <div style={{ position: "absolute", left: 960, top: 560, width: 0, height: 0, opacity: off(906.5) }}>
        <div style={{ position: "absolute", left: -260, top: -260, width: 520, height: 520, borderRadius: "50%", border: "8px dashed #fff", transform: `scale(${pop(f, 900.6, 10)})`, background: "rgba(14,16,24,.55)" }} />
        <div style={{ position: "absolute", left: 0, top: -40, transform: "translate(-50%,-50%)", display: "flex", gap: 10 }}>
          {[["icons/cow.png", 900.77], ["icons/wheat.png", 901.81]].map(([s, tt], i) => t >= (tt as number) ? <Img key={i} src={sf(s as string)} style={{ width: 120, transform: `scale(${pop(f, tt as number, 8)})` }} /> : null)}
        </div>
        {t > 902.7 && <div style={{ position: "absolute", left: 0, top: 80, transform: `translate(-50%,-50%) scale(${pop(f, 902.75, 8)})`, ...chip("#7a5a12"), fontSize: 38 }}>CENTER OF THE STATE</div>}
        {t > 904.7 && (() => { const k = interpolate(t, [904.7, 906.0], [0, 1], { ...clamp, easing: ease }); return [0, 1, 2, 3, 4].map((i) => { const a = -0.6 + i * 0.3; const r = 120 + k * 260; return <Img key={i} src={sf("icons/farmer.png")} style={{ position: "absolute", left: Math.cos(a) * r + 60, top: Math.sin(a) * r - 60, width: 90, filter: "grayscale(1) brightness(.8)" }} />; }); })()}
        {t > 905.9 && <div style={{ position: "absolute", left: 520, top: -220, transform: `translate(-50%,-50%) scale(${pop(f, 906.0, 8)})`, ...chip("#555"), fontSize: 38 }}>OUTSIDE</div>}
      </div>}
      {/* el ciclo */}
      {vis(t, 907.2, 919.6) && (() => {
        const items: [string, number][] = [["COUPS", 910.53], ["POPULISM", 911.81], ["INFLATION", 913.35], ["PRICE CONTROLS", 914.35], ["DEBT", 915.55], ["DEFAULT", 916.23]];
        const spin = interpolate(t, [917.6, 919.4], [0, 360], { ...clamp, easing: Easing.inOut(Easing.quad) });
        return <div style={{ position: "absolute", left: 960, top: 560, width: 0, height: 0, opacity: Math.min(at(907.4), off(919.5)) }}>
          <div style={{ position: "absolute", left: -330, top: -330, width: 660, height: 660, borderRadius: "50%", border: "10px solid rgba(255,255,255,.85)", transform: `rotate(${spin}deg)` }}>
            <div style={{ position: "absolute", right: 60, top: 40, width: 0, height: 0, borderLeft: "30px solid transparent", borderRight: "30px solid transparent", borderTop: "46px solid #fff", transform: "rotate(-45deg)" }} />
          </div>
          {items.map(([w, tt], i) => { const a = -Math.PI / 2 + (i / 6) * Math.PI * 2 + (spin * Math.PI) / 180; const on = t >= tt; return on ? <div key={i} style={{ position: "absolute", left: Math.cos(a) * 330, top: Math.sin(a) * 330, transform: `translate(-50%,-50%) scale(${pop(f, tt, 8)})`, ...chip(["#b22", "#1d3f73", "#d4561e", "#7a5a12", "#555", "#111"][i]), fontSize: 40 }}>{w}</div> : null; })}
          <div style={{ position: "absolute", left: 0, top: 0, transform: "translate(-50%,-50%)", fontFamily: HAND, fontSize: 64, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.7)", whiteSpace: "nowrap" }}>{t > 917.6 ? "…and again" : "a long cycle"}</div>
        </div>;
      })()}
      {/* 1945: Canadá 60 % más rica */}
      {vis(t, 920.6, 926.9) && <div style={{ position: "absolute", left: 960, top: 560, transform: "translate(-50%,-50%)", opacity: off(926.8), display: "flex", gap: 90, alignItems: "flex-end" }}>
        {[["ar", 100, "#4aa3df"], ["ca", 160, "#d42a1e"]].map(([cc, v, col], i) => { const h = 2.4 * (v as number) * interpolate(t, [922.9 + i * 0.4, 924.4 + i * 0.4], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }); return <div key={i} style={{ textAlign: "center" }}>
          {i === 1 && t > 923.6 && <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 80, color: "#ffd23a", textShadow: "0 4px 14px rgba(0,0,0,.6)", transform: `scale(${pop(f, 923.61, 8)})` }}>+60%</div>}
          <div style={{ width: 160, height: h, background: col as string, border: "5px solid #fff", borderBottom: "none", borderRadius: "10px 10px 0 0", margin: "0 auto" }} />
          <Img src={sf(`flag_${cc}.png`)} style={{ width: 120, border: "4px solid #fff", marginTop: 10 }} />
        </div>; })}
      </div>}
      <HandNote f={f} t={t} t0={920.0} t1={922.8} x={960} y={160} text="look at what happened next" size={80} />
      {/* Perón */}
      {vis(t, 927.1, 935.9) && <div style={{ position: "absolute", left: 1440, top: 420, transform: `translate(-50%,-50%) rotate(3deg) scale(${pop(f, 928.55, 10) * off(935.8)})`, ...paper, padding: "26px 40px", textAlign: "center" }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#59606e" }}>ELECTED PRESIDENT · 1946</div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 90, color: "#1b2433" }}>JUAN PERÓN</div>
      </div>}
      <Tag c={c} f={f} t={t} lon={BA[0]} lat={BA[1] + 0.25} t0={927.9} t1={941.3} text="Buenos Aires" bg="#111" size={28} />
      {vis(t, 931.0, 935.9) && <div style={{ position: "absolute", left: 960, top: 860, transform: "translate(-50%,-50%)", display: "flex", gap: 24, alignItems: "center", opacity: off(935.8) }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", transform: `scale(${pop(f, 932.65, 8)})` }}><Img src={sf("icons/tophat.png")} style={{ width: 90 }} /><span style={{ ...chip("#7a5a12"), fontSize: 38 }}>LANDOWNERS</span></div>
        {t > 933.8 && <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 80, color: "#fff", transform: `scale(${pop(f, 933.8, 8)})` }}>⟶</div>}
        {t > 934.3 && <div style={{ display: "flex", gap: 10, alignItems: "center", transform: `scale(${pop(f, 934.33, 8)})` }}><Img src={sf("icons/people.png")} style={{ width: 110 }} /><span style={{ ...chip("#1d3f73"), fontSize: 38 }}>CITY WORKERS</span></div>}
      </div>}
      <Portal2 c={c} t={t} lon={BA[0]} lat={BA[1]} t0={936.2} t1={941.4} src="v5/img/t_rail_nation.png" maxR={300} dx={-560} dy={-40} caption="British railways nationalized" />
      {vis(t, 936.3, 941.4) && <div style={{ position: "absolute", left: 1420, top: 540, transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", gap: 18, alignItems: "center", opacity: off(941.3) }}>
        {[["NATIONALIZED", 936.29, "#1d3f73"], ["RAISED WAGES", 938.47, "#2a7d2e"], ["A NEW KIND OF STATE", 939.77, "#b22"]].map(([w, tt, col], i) => t >= (tt as number) ? <div key={i} style={{ ...chip(col as string), fontSize: 46, transform: `rotate(${(i % 2 ? 3 : -3)}deg) scale(${pop(f, tt as number, 8)})` }}>{w}</div> : null)}
      </div>}
      {vis(t, 941.5, 946.3) && <div style={{ position: "absolute", left: 960, top: 520, transform: "translate(-50%,-50%)", textAlign: "center", opacity: off(946.2), textShadow: "0 5px 18px rgba(0,0,0,.6)" }}>
        <div style={{ fontFamily: HAND, fontSize: 110, color: "#9be05a", transform: `scale(${pop(f, 943.17, 8)})`, opacity: at(942.7) }}>it felt like justice</div>
        {t > 944.1 && <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 70, color: "#fff", transform: `scale(${pop(f, 944.11, 8)})` }}>BUT IT SET OFF A <span style={{ color: "#ff8a6a" }}>PATTERN</span></div>}
      </div>}
      {/* cada gobierno deshace al anterior */}
      {vis(t, 947.5, 956.4) && <div style={{ position: "absolute", left: 960, top: 540, width: 0, height: 0, opacity: off(956.3) }}>
        {Array.from({ length: 6 }).map((_, i) => { const tt = 947.6 + i * 0.6; if (t < tt) return null; const flip = interpolate(t, [tt + 0.6, tt + 1.0], [0, 1], clamp); return <div key={i} style={{ position: "absolute", left: -230 + i * 8, top: -300 + i * 8, width: 460, height: 560, ...paper, transform: `rotate(${(i % 2 ? 3 : -3)}deg) translateX(${i < 5 ? flip * -900 : 0}px) rotate(${i < 5 ? flip * -30 : 0}deg) scale(${pop(f, tt, 8)})`, padding: "40px 36px", fontFamily: "Georgia, serif", color: "#26314a" }}>
          <div style={{ fontSize: 34, fontWeight: 700, textAlign: "center" }}>THE RULES</div>
          <div style={{ fontSize: 22, textAlign: "center", color: "#59606e" }}>version {i + 1}</div>
          {[0, 1, 2, 3, 4, 5].map((j) => <div key={j} style={{ height: 10, background: "rgba(38,49,74,.25)", margin: "24px 0", width: `${60 + ((i + j) * 13) % 40}%` }} />)}
        </div>; })}
        <div style={{ position: "absolute", left: 0, top: 330, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 900, fontSize: 56, color: "#fff", whiteSpace: "nowrap", textShadow: "0 4px 14px rgba(0,0,0,.6)" }}>{t < 950.1 ? "EVERY GOVERNMENT UNDID THE LAST" : t < 952.7 ? "NEW LEADER → NEW RULES" : <span>NOBODY INVESTS <span style={{ color: "#ff8a6a" }}>LONG TERM</span></span>}</div>
      </div>}
      {/* 1989: +3.000 % */}
      {vis(t, 957.1, 966.9) && <div style={{ position: "absolute", left: 960, top: 300, transform: `translate(-50%,-50%) scale(${pop(f, 958.3, 9) * off(966.8)})`, textAlign: "center", textShadow: "0 6px 24px rgba(0,0,0,.6)" }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 44, color: "#fff" }}>PRICES IN ONE YEAR</div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 170, color: "#ff5040", lineHeight: 1 }}>+{Math.round(interpolate(t, [958.4, 961.6], [0, 3000], { ...clamp, easing: Easing.out(Easing.quad) })).toLocaleString("en-US")}%</div>
      </div>}
      {vis(t, 962.6, 966.9) && <div style={{ position: "absolute", left: 960, top: 750, transform: "translate(-50%,-50%)", display: "flex", gap: 80, opacity: off(966.8) }}>
        {[["MORNING", 963.13, "$"], ["AFTERNOON", 964.37, "$$$"]].map(([w, tt, p], i) => t >= (tt as number) ? <div key={i} style={{ textAlign: "center", transform: `scale(${pop(f, tt as number, 8)})` }}>
          <div style={{ width: 230, height: 120, margin: "0 auto", background: "radial-gradient(ellipse at 50% 30%,#e9b46a,#b4772f)", borderRadius: "110px 110px 30px 30px", border: "5px solid #fff" }} />
          <div style={{ ...chip(i ? "#b22" : "#1d3f73"), fontSize: 40, marginTop: 12 }}>{w}: {p}</div>
        </div> : null)}
      </div>}
      <Vignette />
    </AbsoluteFill>
  );
};
