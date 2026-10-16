// Capítulo 10 (17:43.9 → final): no es la única razón (guerras, política, ventajas de Canadá); pero la tierra explica
// las sociedades; resumen 160 acres gratis vs estancias; mismo todo, distintos dueños; la pregunta; suscribite; próximo video.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { P, proj, pop, fadeOut, vis, ease, clamp, Region, Country, Tag, Flag, BigWord, Clouds, SANS, HAND, geo, FPS } from "../Main";
import { K, camOf, blurOf, World, YearCorner, Portal2, HandNote, Vignette } from "./common";

import { sf } from "../sf";
export const CH10_END = 1155.0;
const PRA = ["Alberta", "Saskatchewan", "Manitoba"].map((n) => geo.prov[n].d).join("");
const ESTATES: [number, number, number, number][] = [[-63.8, -37.4, 1.1, 0.8], [-62.4, -37.9, 0.9, 0.7], [-64.4, -36.4, 0.8, 0.7], [-61.2, -37.1, 0.8, 0.6], [-63.1, -36.6, 0.7, 0.6], [-60.4, -36.4, 0.7, 0.6], [-65.1, -37.6, 0.8, 0.7], [-62.0, -35.3, 0.9, 0.7], [-60.0, -34.4, 0.7, 0.6]];

const KEYS: K[] = [
  [1063.9, -61, -35, 2.25],
  [1065.0, -82, 9, 0.42],
  [1073.2, -82, 9, 0.44],
  [1074.3, -92, 44, 0.85],
  [1086.4, -92, 44, 0.9],
  [1087.4, -82, 8, 0.3],
  [1097.4, -82, 8, 0.32],
  [1098.6, -104, 51, 2.0],
  [1112.8, -104, 51, 2.3],
  [1113.6, -62.5, -36.5, 2.0],
  [1126.0, -62.5, -36.5, 2.3],
  [1126.8, -82, 9, 0.42],
  [CH10_END, -82, 9, 0.48],
];

const chip = (bg: string): React.CSSProperties => ({ background: bg, color: "#fff", border: "5px solid #fff", borderRadius: 10, padding: "6px 26px", fontFamily: SANS, fontWeight: 900, fontSize: 52, whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(0,0,0,.4)" });

export const Ch10: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const f = t * FPS;
  const c = camOf(KEYS, t);
  const blur = blurOf(KEYS, t, FPS);
  const at = (t0: number, d = 0.35) => interpolate(t, [t0, t0 + d], [0, 1], clamp);
  const off = (t1: number, d = 0.4) => interpolate(t, [t1, t1 + d], [1, 0], clamp);
  const homes = Math.floor(interpolate(t, [1101.6, 1107.3], [0, 140], clamp));
  return (
    <AbsoluteFill style={{ background: "#2f6fb8", overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id="mb10"><feGaussianBlur stdDeviation={blur.toFixed(2)} /></filter></svg>
      <AbsoluteFill style={{ filter: blur > 0.6 ? "url(#mb10)" : undefined }}>
        <World c={c} modern={interpolate(t, [1063.9, 1065.0], [1, 0], clamp)}>
          <Country iso="USA" color="#4a7fd4" op={0.5 * at(1074.3) * off(1077.0)} z={c.z} />
          {/* las dos llanuras */}
          <Region d={PRA} op={at(1088.6) * off(1097.3)} z={c.z} color="#d9b23a" />
          <Region d={geo.prov.Pampas.d} op={at(1089.0) * off(1097.3)} z={c.z} color="#d9b23a" />
          {/* miles de propietarios chicos */}
          {Array.from({ length: homes }).map((_, i) => { const lo = -114 + ((i * 37) % 140) / 140 * 17, la = 49.3 + ((i * 53) % 97) / 97 * 4.6; const [x, y] = P(lo, la); return <rect key={i} x={x - 2.2} y={y - 2.2} width={4.4} height={4.4} fill="#9be05a" stroke="#fff" strokeWidth={0.6} opacity={off(1112.7)} />; })}
          {/* estancias gigantes */}
          {ESTATES.map(([lo, la, w, h], i) => { const [x, y] = P(lo, la); const k = interpolate(t, [1115.8 + i * 0.1, 1116.5 + i * 0.1], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.5)) }) * off(1125.9); return k > 0 ? <rect key={i} x={x - (w * 30 * k) / 2} y={y - (h * 30 * k) / 2} width={w * 30 * k} height={h * 30 * k} fill={i % 2 ? "#c2412c" : "#a3311f"} fillOpacity={0.78} stroke="#fff" strokeWidth={3 / c.z} /> : null; })}
        </World>
      </AbsoluteFill>
      <Clouds c={c} f={f} t={t} />
      <YearCorner f={f} t={t} marks={[[1063.9, "today"], [1074.2, "1900–1945"], [1098.5, "1872 →"], [1113.6, "1880 →"], [1126.8, "today"]]} />

      {/* no es la única razón */}
      {vis(t, 1063.9, 1073.1) && <div style={{ position: "absolute", left: 960, top: 520, transform: "translate(-50%,-50%)", textAlign: "center", opacity: off(1073.0) }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 72, color: "#fff", textShadow: "0 5px 18px rgba(0,0,0,.6)", transform: `scale(${pop(f, 1064.55, 8)})` }}>LAND IS <span style={{ color: "#ff8a6a" }}>NOT</span> THE ONLY REASON</div>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", width: 1300, justifyContent: "center", marginTop: 30 }}>
          {[["WARS", 1066.49, "#b22"], ["POLITICS", 1067.07, "#1d3f73"], ["TRADE", 1067.91, "#7a5a12"], ["BAD LUCK", 1068.43, "#555"], ["BAD DECISIONS", 1069.11, "#333"]].map(([w, tt, col], i) => t >= (tt as number) ? <div key={i} style={{ ...chip(col as string), transform: `rotate(${(i % 2 ? 3 : -3)}deg) scale(${pop(f, tt as number, 8)})` }}>{w}</div> : null)}
        </div>
        {t > 1070.8 && <div style={{ fontFamily: HAND, fontSize: 76, color: "#ffd23a", marginTop: 30, textShadow: "0 4px 14px rgba(0,0,0,.6)" }}>{"Canada had advantages Argentina didn't".slice(0, Math.floor(interpolate(t, [1070.9, 1072.6], [0, 38], clamp)))}</div>}
      </div>}
      {/* las ventajas de Canadá */}
      <Flag c={c} f={f} t={t} cc="us" lon={-98} lat={38} t0={1075.2} t1={1086.3} w={110} />
      <Flag c={c} f={f} t={t} cc="ca" lon={-104} lat={57} t0={1074.4} t1={1086.3} w={110} />
      {vis(t, 1075.2, 1077.0) && <div style={{ position: "absolute", left: 1460, top: 300, transform: `translate(-50%,-50%) scale(${pop(f, 1075.2, 8) * off(1076.9)})`, ...chip("#1d3f73"), fontSize: 44 }}>NEXT TO THE LARGEST ECONOMY</div>}
      {vis(t, 1077.0, 1080.0) && <div style={{ position: "absolute", left: 1460, top: 300, transform: `translate(-50%,-50%) scale(${pop(f, 1077.09, 8) * off(1079.9)})`, display: "flex", alignItems: "center", gap: 16 }}><Img src={sf("flag_gb.png")} style={{ width: 110, border: "4px solid #fff" }} /><div style={{ ...chip("#7a1f2b"), fontSize: 40 }}>BRITISH PARLIAMENTARY INSTITUTIONS</div></div>}
      {vis(t, 1080.1, 1084.0) && <div style={{ position: "absolute", left: 1460, top: 300, transform: `translate(-50%,-50%) scale(${pop(f, 1080.15, 8) * off(1083.9)})`, textAlign: "center" }}>
        <div style={{ ...chip("#333"), fontSize: 44 }}>BOTH WORLD WARS</div>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 12 }}>{["gb", "us"].map((cc, i) => t > 1081.7 + i * 1.3 ? <Img key={i} src={sf(`flag_${cc}.png`)} style={{ width: 100, border: "4px solid #fff", transform: `scale(${pop(f, 1081.7 + i * 1.3, 8)})` }} /> : null)}</div>
      </div>}
      {vis(t, 1084.1, 1086.4) && <div style={{ position: "absolute", left: 1460, top: 300, transform: `translate(-50%,-50%) scale(${pop(f, 1084.25, 8) * off(1086.3)})`, display: "flex", alignItems: "center", gap: 14 }}><Img src={sf("icons/wheat.png")} style={{ width: 90 }} /><div style={{ ...chip("#2a7d2e"), fontSize: 44 }}>GUARANTEED BUYERS</div></div>}
      {/* pero nada de eso explica… */}
      {vis(t, 1087.2, 1097.4) && <>
        <Tag c={c} f={f} t={t} lon={-104} lat={55.6} t0={1088.6} t1={1097.3} text="The Prairies" bg="#7a5a12" size={30} />
        <Tag c={c} f={f} t={t} lon={-61} lat={-31.4} t0={1089.0} t1={1097.3} text="The Pampas" bg="#7a5a12" size={30} />
        <div style={{ position: "absolute", left: 960, top: 170, transform: `translate(-50%,-50%) scale(${pop(f, 1087.3, 8) * off(1095.3)})`, fontFamily: SANS, fontWeight: 900, fontSize: 60, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>BUT NONE OF THAT EXPLAINS…</div>
        {vis(t, 1089.6, 1095.3) && <div style={{ position: "absolute", left: 1500, top: 560, transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start", opacity: off(1095.2) }}>
          {[["SAME TIME", 1090.23], ["SAME KIND OF PEOPLE", 1091.15], ["DIFFERENT SOCIETIES", 1093.11]].map(([w, tt], i) => t >= (tt as number) ? <div key={i} style={{ ...chip(i === 2 ? "#d42a1e" : "#2a7d2e"), fontSize: 42, transform: `scale(${pop(f, tt as number, 8)})` }}>{w}</div> : null)}
        </div>}
        {vis(t, 1095.4, 1097.4) && <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) scale(${pop(f, 1096.79, 8) * off(1097.3)})`, fontFamily: SANS, fontWeight: 900, fontSize: 120, color: "#ffd23a", textShadow: "0 6px 22px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>LOOK AT THE LAND</div>}
      </>}
      {/* Canadá: 160 acres gratis → millones de dueños */}
      <HandNote f={f} t={t} t0={1097.9} t1={1100.4} x={960} y={190} text="think about where it started" size={84} />
      {vis(t, 1100.5, 1105.9) && <div style={{ position: "absolute", left: 1450, top: 330, transform: `translate(-50%,-50%) rotate(3deg) scale(${pop(f, 1101.0, 9) * off(1105.8)})`, background: "#fbf6e6", border: "5px solid #fff", boxShadow: "0 18px 40px rgba(0,0,0,.5)", padding: "20px 34px", textAlign: "center" }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 80, color: "#1b2433" }}>160 ACRES</div>
        {t > 1103.2 && <div style={{ display: "inline-block", border: "6px solid #2a9d3a", color: "#2a9d3a", fontFamily: SANS, fontWeight: 900, fontSize: 64, padding: "0 24px", borderRadius: 10, transform: `rotate(-6deg) scale(${pop(f, 1103.21, 7)})` }}>FREE</div>}
        {t > 1104.0 && <div style={{ fontFamily: HAND, fontSize: 44, color: "#26314a" }}>to almost anyone willing to farm it</div>}
      </div>}
      {vis(t, 1106.0, 1112.8) && <div style={{ position: "absolute", left: 960, top: 880, transform: "translate(-50%,-50%)", display: "flex", gap: 22, opacity: off(1112.7) }}>
        {[["MILLIONS OF SMALL OWNERS", 1106.45, "#2a7d2e"], ["A STAKE", 1108.63, "#1d3f73"], ["A REASON TO INVEST", 1110.45, "#7a5a12"], ["A VOICE", 1111.91, "#b22"]].map(([w, tt, col], i) => t >= (tt as number) ? <div key={i} style={{ ...chip(col as string), fontSize: i ? 44 : 48, transform: `rotate(${(i % 2 ? 3 : -3)}deg) scale(${pop(f, tt as number, 8)})` }}>{w}</div> : null)}
      </div>}
      {/* Argentina: estancias antes de que llegaran */}
      {vis(t, 1113.3, 1121.6) && <div style={{ position: "absolute", left: 1450, top: 300, transform: `translate(-50%,-50%) scale(${pop(f, 1114.3, 9) * off(1121.5)})`, textAlign: "center" }}>
        <div style={{ ...chip("#a3311f"), fontSize: 50 }}>GIANT ESTATES</div>
        {t > 1117.5 && <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 14 }}>{[0, 1, 2, 3].map((i) => <Img key={i} src={sf("icons/tophat.png")} style={{ width: 80, transform: `scale(${pop(f, 1117.6 + i * 0.1, 7)})` }} />)}</div>}
        {t > 1117.7 && <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 40, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.6)" }}>A FEW HUNDRED FAMILIES</div>}
        {t > 1119.2 && <div style={{ fontFamily: HAND, fontSize: 56, color: "#ffd23a", textShadow: "0 4px 14px rgba(0,0,0,.6)", transform: `scale(${pop(f, 1119.2, 8)})` }}>before the immigrants arrived</div>}
      </div>}
      {vis(t, 1121.7, 1126.1) && <div style={{ position: "absolute", left: 960, top: 860, transform: "translate(-50%,-50%)", display: "flex", gap: 30, alignItems: "center", opacity: off(1126.0) }}>
        <div style={{ ...chip("#7a5a12"), fontSize: 46, transform: `scale(${pop(f, 1122.15, 8)})` }}>A HANDFUL OF LANDLORDS</div>
        {t > 1123.7 && <div style={{ ...chip("#d42a1e"), fontSize: 46, transform: `scale(${pop(f, 1123.71, 8)})` }}>MILLIONS RENTING</div>}
      </div>}
      {/* mismo todo, distinto dueño */}
      {vis(t, 1126.7, 1131.6) && <div style={{ position: "absolute", left: 960, top: 540, transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", gap: 16, alignItems: "center", opacity: off(1131.5) }}>
        {[["SAME LAND", 1126.73, "#2a7d2e"], ["SAME PEOPLE", 1127.87, "#2a7d2e"], ["SAME CUSTOMERS", 1128.85, "#2a7d2e"], ["DIFFERENT OWNERS", 1130.07, "#d42a1e"]].map(([w, tt, col], i) => t >= (tt as number) ? <div key={i} style={{ ...chip(col as string), fontSize: i === 3 ? 90 : 60, transform: `rotate(${(i % 2 ? 2 : -2)}deg) scale(${pop(f, tt as number, 8)})` }}>{w}</div> : null)}
      </div>}
      {vis(t, 1131.7, 1135.5) && <div style={{ position: "absolute", left: 960, top: 560, transform: "translate(-50%,-50%)", opacity: off(1135.4), textAlign: "center" }}>
        <div style={{ fontFamily: HAND, fontSize: 70, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.6)" }}>more than a century later…</div>
        <div style={{ display: "flex", gap: 90, alignItems: "flex-end", justifyContent: "center", marginTop: 20 }}>
          {[["ar", 100, "#4aa3df"], ["ca", 330, "#d42a1e"]].map(([cc, v, col], i) => { const h = (v as number) * interpolate(t, [1133.0 + i * 0.4, 1134.4 + i * 0.4], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }); return <div key={i} style={{ textAlign: "center" }}>
            <div style={{ width: 150, height: h, background: col as string, border: "5px solid #fff", borderBottom: "none", borderRadius: "10px 10px 0 0", margin: "0 auto" }} />
            <Img src={sf(`flag_${cc}.png`)} style={{ width: 110, border: "4px solid #fff", marginTop: 10 }} />
          </div>; })}
        </div>
      </div>}
      {/* la pregunta */}
      {vis(t, 1135.6, 1142.4) && <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) scale(${pop(f, 1135.7, 10) * off(1142.3)})`, background: "rgba(14,16,24,.9)", border: "6px solid #ffd23a", borderRadius: 20, padding: "40px 60px", textAlign: "center", maxWidth: 1400 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 36, color: "#ffd23a" }}>MY QUESTION FOR YOU</div>
        {t > 1137.8 && <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 66, color: "#fff", marginTop: 14 }}>If your country had a pampas or a prairie…</div>}
        {t > 1140.2 && <div style={{ fontFamily: HAND, fontSize: 110, color: "#ffd23a", transform: `scale(${pop(f, 1140.29, 8)})` }}>who owned it?</div>}
      </div>}
      {vis(t, 1141.1, 1144.0) && <div style={{ position: "absolute", left: 1500, top: 900, transform: `translate(-50%,-50%) rotate(-3deg) scale(${pop(f, 1141.23, 8) * off(1143.9)})`, background: "#fff", borderRadius: 18, padding: "16px 30px", boxShadow: "0 12px 30px rgba(0,0,0,.4)", fontFamily: SANS, fontWeight: 900, fontSize: 40, color: "#1b2433" }}>TELL ME IN THE COMMENTS</div>}
      {vis(t, 1144.1, 1147.5) && <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) scale(${pop(f, 1146.4, 9) * off(1147.4)})`, display: "flex", alignItems: "center", gap: 20, opacity: at(1146.0) }}>
        <div style={{ background: "#cc0000", color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 70, padding: "18px 50px", borderRadius: 14, boxShadow: "0 14px 34px rgba(0,0,0,.45)" }}>SUBSCRIBE</div>
      </div>}
      {/* el próximo */}
      <Portal2 c={c} t={t} lon={-82} lat={9} t0={1147.6} t1={CH10_END + 1} src="v5/img/w_two_roads.png" maxR={2000} />
      {vis(t, 1148.6, CH10_END + 1) && <div style={{ position: "absolute", left: 960, top: 900, transform: `translate(-50%,-50%) scale(${pop(f, 1149.4, 9)})`, textAlign: "center", textShadow: "0 6px 24px rgba(0,0,0,.8)" }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 56, color: "#fff" }}>NEXT: TWO COUNTRIES, THE SAME START</div>
        {t > 1152.9 && <div style={{ fontFamily: HAND, fontSize: 96, color: "#ffd23a", transform: `scale(${pop(f, 1152.97, 8)})` }}>…opposite ends</div>}
      </div>}
      <Vignette />
    </AbsoluteFill>
  );
};
