// Capítulo 7 (10:37.0 → 13:19.3): Esperanza y las colonias de Santa Fe (la excepción); dueños vs inquilinos;
// Solberg; lo que cambia ser dueño (crédito, escuela, voto); cooperativas y partidos en Canadá;
// en Argentina: no ciudadanos, Ley de Residencia 1902, Ley Sáenz Peña 1912, Yrigoyen 1916, extranjeros sin voto.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { P, proj, pop, fadeOut, vis, ease, clamp, Region, Tag, Flag, BigWord, Route, Clouds, SANS, HAND, geo, FPS } from "../Main";
import { K, camOf, blurOf, World, YearCorner, Portal2, HandNote, Vignette } from "./common";

import { sf } from "../sf";
const ESP: [number, number] = [-60.93, -31.45];
const BA: [number, number] = [-58.4, -34.6];
const CALGARY: [number, number] = [-114.07, 51.05];
const PRA = ["Alberta", "Saskatchewan", "Manitoba"].map((n) => geo.prov[n].d).join("");

const KEYS: K[] = [
  [637.0, -61, -34, 1.5],
  [641.3, -61, -32.3, 2.6],
  [645.0, ESP[0], ESP[1], 4.6],
  [653.4, ESP[0], ESP[1], 5.4],
  [655.4, -61, -31.6, 3.6],
  [660.7, -61, -31.6, 3.3],
  [661.9, -82, 9, 0.42],
  [665.5, -82, 9, 0.44],
  [667.6, -61.5, -35.5, 1.6],
  [671.9, -62.5, -36.8, 2.0],
  [676.8, -62.5, -36.8, 2.15],
  [678.0, -82, 9, 0.42],
  [707.6, -82, 9, 0.5],
  [708.6, -106, 52.2, 1.5],
  [718.8, -106, 52.2, 1.65],
  [719.4, -114.5, 54, 2.5],
  [726.8, -114.5, 54, 2.75],
  [727.3, -106, 53.8, 2.5],
  [734.4, -106, 53.4, 2.7],
  [736.3, CALGARY[0], CALGARY[1], 4.2],
  [742.2, CALGARY[0], CALGARY[1], 4.6],
  [744.0, -106, 52, 1.5],
  [750.0, -106, 52, 1.65],
  [751.4, -61, -34, 2.0],
  [758.4, -60, -34.4, 2.3],
  [759.7, BA[0], BA[1], 4.5],
  [766.6, BA[0], BA[1], 4.9],
  [768.4, -30, 4, 0.44],
  [777.6, -30, 4, 0.46],
  [779.4, BA[0], BA[1], 3.6],
  [790.4, BA[0], BA[1], 4.0],
  [791.6, -61, -33.6, 2.0],
  [799.3, -61, -33.6, 2.2],
];

// las colonias de Santa Fe (alrededor de Esperanza)
const COLONIES: [number, number][] = Array.from({ length: 34 }).map((_, i) => [ESP[0] + Math.cos(i * 2.39) * (0.25 + (i % 6) * 0.22), ESP[1] + Math.sin(i * 2.39) * (0.2 + (i % 5) * 0.2) - 0.1] as [number, number]);
const ESTATES: [number, number, number, number][] = [[-63.8, -37.4, 1.1, 0.8], [-62.4, -37.9, 0.9, 0.7], [-64.4, -36.4, 0.8, 0.7], [-61.2, -37.1, 0.8, 0.6], [-63.1, -36.6, 0.7, 0.6], [-60.4, -36.4, 0.7, 0.6], [-65.1, -37.6, 0.8, 0.7]];

const SwissFlag: React.FC<{ w: number }> = ({ w }) => (
  <div style={{ width: w, height: w * 0.66, background: "#d52b1e", border: "3px solid #fff", position: "relative", boxShadow: "0 6px 14px rgba(0,0,0,.4)" }}>
    <div style={{ position: "absolute", left: "50%", top: "50%", width: w * 0.14, height: w * 0.42, background: "#fff", transform: "translate(-50%,-50%)" }} />
    <div style={{ position: "absolute", left: "50%", top: "50%", width: w * 0.42, height: w * 0.14, background: "#fff", transform: "translate(-50%,-50%)" }} />
  </div>
);

const chip = (bg: string): React.CSSProperties => ({ background: bg, color: "#fff", border: "5px solid #fff", borderRadius: 10, padding: "6px 26px", fontFamily: SANS, fontWeight: 900, fontSize: 52, whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(0,0,0,.4)" });

export const Ch7: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const f = t * FPS;
  const c = camOf(KEYS, t);
  const blur = blurOf(KEYS, t, FPS);
  const at = (t0: number, d = 0.35) => interpolate(t, [t0, t0 + d], [0, 1], clamp);
  const off = (t1: number, d = 0.4) => interpolate(t, [t1, t1 + d], [1, 0], clamp);
  const plots = interpolate(t, [650.6, 652.6], [0, 1], clamp);
  const colN = Math.floor(interpolate(t, [655.5, 657.2], [0, COLONIES.length], clamp));
  const [ex, ey] = P(ESP[0], ESP[1]);
  return (
    <AbsoluteFill style={{ background: "#2f6fb8", overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id="mb7"><feGaussianBlur stdDeviation={blur.toFixed(2)} /></filter></svg>
      <AbsoluteFill style={{ filter: blur > 0.6 ? "url(#mb7)" : undefined }}>
        <World c={c} modern={0}>
          {/* las parcelas de Esperanza: cada familia la suya */}
          {plots > 0 && Array.from({ length: 25 }).map((_, i) => { const gx = (i % 5) - 2, gy = Math.floor(i / 5) - 2; const k = interpolate(plots, [i / 30, i / 30 + 0.2], [0, 1], clamp); const s = 5.2; return <rect key={i} x={ex + gx * s * 1.08 - s / 2} y={ey + gy * s * 1.08 - s / 2} width={s * k} height={s * k} fill={i % 3 ? "#d9c25a" : "#9bc24a"} fillOpacity={0.85} stroke="#fff" strokeWidth={0.7 / c.z * 3} opacity={off(655.3)} />; })}
          {/* decenas de colonias */}
          {COLONIES.slice(0, colN).map(([lo, la], i) => { const [x, y] = P(lo, la); return <circle key={i} cx={x} cy={y} r={7 / c.z * (t < 665.6 ? 1 : 0.8)} fill="#2a9d3a" stroke="#fff" strokeWidth={2 / c.z} opacity={off(675.0)} />; })}
          {/* las Praderas canadienses, para comparar */}
          <Region d={PRA} op={at(663.6) * off(665.6)} z={c.z} color="#9bc24a" />
          {/* la pampa del sur: vendida en bloques gigantes */}
          {ESTATES.map(([lo, la, w, h], i) => { const [x, y] = P(lo, la); const k = interpolate(t, [669.9 + i * 0.14, 670.6 + i * 0.14], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.5)) }) * off(676.7); return k > 0 ? <rect key={i} x={x - (w * 30 * k) / 2} y={y - (h * 30 * k) / 2} width={w * 30 * k} height={h * 30 * k} fill={i % 2 ? "#c2412c" : "#a3311f"} fillOpacity={0.75} stroke="#fff" strokeWidth={3 / c.z} /> : null; })}
          {/* Alberta (UFA 1921) y Saskatchewan (Wheat Pool 1924) */}
          <Region d={geo.prov.Alberta.d} op={at(719.3) * off(726.8)} z={c.z} color="#2a9d3a" />
          <Region d={geo.prov.Saskatchewan.d} op={at(729.4) * off(734.4)} z={c.z} color="#d9b23a" />
          {/* granos de cada granja convergiendo al pool */}
          {vis(t, 730.4, 734.5) && Array.from({ length: 18 }).map((_, i) => { const lo = -109.5 + (i % 6) * 1.3, la = 50 + Math.floor(i / 6) * 1.6 + (i % 2) * 0.4; const [x0, y0] = P(lo, la), [x1, y1] = P(-105.8, 52.4); const k = interpolate(t, [731.6 + (i % 5) * 0.08, 733.2], [0, 1], { ...clamp, easing: ease }); return <g key={i} opacity={off(734.4)}><circle cx={x0 + (x1 - x0) * k} cy={y0 + (y1 - y0) * k} r={6 / c.z} fill="#ffd23a" stroke="#7a5a12" strokeWidth={1.5 / c.z} /></g>; })}
        </World>
      </AbsoluteFill>

      <Clouds c={c} f={f} t={t} />
      <YearCorner f={f} t={t} marks={[[641.5, "1856"], [660.8, "1880s"], [672.0, "1900s"], [708.4, "1920s"], [719.1, "1921"], [727.0, "1924"], [734.7, "1932"], [751.3, "1900s"], [766.7, "1902"], [779.4, "1912"], [785.1, "1916"]]} />

      {/* lo más raro */}
      <BigWord f={f} t={t} t0={637.1} t1={638.5} text={<span>THE <span style={{ color: "#ffd23a" }}>STRANGEST</span> PART</span>} y={170} size={100} />
      <HandNote f={f} t={t} t0={638.6} t1={641.3} x={960} y={190} text="Argentina knew the other way worked" size={86} />
      {/* Esperanza 1856 */}
      {vis(t, 643.1, 649.7) && <div style={{ position: "absolute", left: 1460, top: 300, display: "flex", gap: 22, opacity: fadeOut(t, 649.7) }}>
        {[["ch", 643.52], ["de", 643.98], ["fr", 644.56]].map(([cc, tt], i) => t >= (tt as number) ? <div key={i} style={{ transform: `rotate(${(i - 1) * 4}deg) scale(${pop(f, tt as number, 8)})`, textAlign: "center" }}>
          {cc === "ch" ? <SwissFlag w={110} /> : <Img src={sf(`flag_${cc}.png`)} style={{ width: 110, height: 73, objectFit: "cover", border: "3px solid #fff", boxShadow: "0 6px 14px rgba(0,0,0,.4)" }} />}
          <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 26, color: "#fff", marginTop: 6, textShadow: "0 2px 8px rgba(0,0,0,.7)" }}>{["SWISS", "GERMAN", "FRENCH"][i]}</div>
        </div> : null)}
      </div>}
      <Route c={c} t={t} f={f} from={[2, 46]} to={ESP} t0={642.6} t1={645.2} dur={1.6} bend={500} />
      <Tag c={c} f={f} t={t} lon={ESP[0]} lat={ESP[1] + 0.32} t0={646.9} t1={660.8} text="Esperanza" bg="#2a7d2e" size={32} />
      <Tag c={c} f={f} t={t} lon={ESP[0] - 0.6} lat={ESP[1] - 0.55} t0={648.7} t1={653.4} text="Santa Fe" bg="#111" size={24} />
      <Portal2 c={c} t={t} lon={ESP[0]} lat={ESP[1]} t0={646.7} t1={650.4} src="v5/img/o_colony.png" maxR={250} dx={-560} dy={-60} caption="Colonia Esperanza" />
      {vis(t, 651.6, 655.3) && <div style={{ position: "absolute", left: 1450, top: 820, transform: `translate(-50%,-50%) rotate(-3deg) scale(${pop(f, 651.62, 9) * fadeOut(t, 655.3)})`, ...chip("#2a7d2e"), fontSize: 64 }}>✓ THEIR OWN LAND</div>}
      <BigWord f={f} t={t} t0={653.6} t1={655.4} text={<span>ESPERANZA <span style={{ color: "#9be05a" }}>THRIVED</span></span>} y={170} />
      <BigWord f={f} t={t} t0={655.5} t1={657.3} text={<span><span style={{ color: "#9be05a" }}>DOZENS</span> OF COLONIES</span>} y={170} />
      {/* pueblos, molinos, escuelas, cooperativas */}
      {vis(t, 657.3, 660.7) && <div style={{ position: "absolute", left: 960, top: 900, transform: "translateX(-50%)", display: "flex", gap: 24, opacity: fadeOut(t, 660.7) }}>
        {[["TOWNS", 657.34], ["MILLS", 657.92], ["SCHOOLS", 658.62], ["CO-OPS", 659.46]].map(([w, tt], i) => t >= (tt as number) ? <div key={i} style={{ ...chip(["#1d3f73", "#7a5a12", "#b22", "#2a7d2e"][i]), transform: `rotate(${(i % 2 ? 3 : -3)}deg) scale(${pop(f, tt as number, 8)})` }}>{w}</div> : null)}
      </div>}
      <Portal2 c={c} t={t} lon={ESP[0]} lat={ESP[1]} t0={658.4} t1={660.8} src="v5/img/p_school.png" maxR={230} dx={560} dy={-110} />
      {/* parecido a las Praderas */}
      {vis(t, 661.0, 665.5) && <>
        <Flag c={c} f={f} t={t} cc="ar" lon={-58} lat={-28} t0={661.8} t1={665.5} w={84} />
        <Flag c={c} f={f} t={t} cc="ca" lon={-98} lat={57} t0={663.9} t1={665.5} w={84} />
        <HandNote f={f} t={t} t0={661.9} t1={665.5} x={960} y={200} text="for a few decades… a little Canada" size={84} />
      </>}
      {vis(t, 663.9, 665.5) && (() => { const [x1, y1] = proj(c, ...P(-61, -31.5)), [x2, y2] = proj(c, ...P(-104, 52)); return <svg width={1920} height={1080} style={{ position: "absolute" }}><path d={`M${x1},${y1} Q${(x1 + x2) / 2 - 300},${(y1 + y2) / 2} ${x2},${y2}`} stroke="#fff" strokeWidth={5} strokeDasharray="14 10" fill="none" opacity={at(663.9) * off(665.4)} /><text x={(x1 + x2) / 2 - 170} y={(y1 + y2) / 2} fill="#fff" fontFamily={SANS} fontWeight={900} fontSize={110} textAnchor="middle" opacity={at(664.0)}>≈</text></svg>; })()}
      {/* la excepción */}
      <BigWord f={f} t={t} t0={665.7} t1={667.6} text={<span>AN <span style={{ color: "#ffd23a" }}>EXCEPTION</span></span>} y={170} />
      <Tag c={c} f={f} t={t} lon={-61} lat={-31} t0={667.0} t1={671.9} text="Colonies" bg="#2a7d2e" size={26} />
      <Tag c={c} f={f} t={t} lon={-63} lat={-39.4} t0={668.1} t1={676.7} text="Southern Pampas" bg="#111" size={28} />
      <BigWord f={f} t={t} t0={670.5} t1={671.9} text={<span>SOLD IN <span style={{ color: "#ff8a6a" }}>GIANT BLOCKS</span></span>} y={950} size={90} />
      {/* dueños vs inquilinos */}
      {vis(t, 672.0, 676.8) && <AbsoluteFill style={{ opacity: Math.min(at(672.0, 0.3), fadeOut(t, 676.8)) }}>
        {[["v_owner", "OWNERS", "#2a9d3a", "ca", 673.7, 0], ["v_tenant", "TENANTS", "#d42a1e", "ar", 675.5, 1]].map(([img, w, col, cc, tt, i]) => {
          const k = interpolate(t, [i ? 675.1 : 672.2, (i ? 675.1 : 672.2) + 0.5], [0, 1], { ...clamp, easing: ease });
          return <div key={i as number} style={{ position: "absolute", left: i ? 960 : 0, top: 0, width: 960, height: 1080, overflow: "hidden", clipPath: `inset(${(1 - k) * 100}% 0 0 0)`, borderLeft: i ? "8px solid #fff" : undefined }}>
            <Img src={sf(`v5/img/${img}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.08 + 0.05 * (t - 672)})` }} />
            <Img src={sf(`flag_${cc}.png`)} style={{ position: "absolute", left: 40, top: 40, width: 110, border: "4px solid #fff" }} />
            {t >= (tt as number) && <div style={{ position: "absolute", left: 480, top: 860, transform: `translate(-50%,-50%) rotate(${i ? 3 : -3}deg) scale(${pop(f, tt as number, 8)})`, ...chip(col as string), fontSize: 90 }}>{w}</div>}
          </div>;
        })}
      </AbsoluteFill>}
      {/* Solberg */}
      {vis(t, 677.4, 685.7) && <div style={{ position: "absolute", left: 1440, top: 540, transform: `translate(-50%,-50%) rotate(4deg) scale(${pop(f, 677.66, 11) * fadeOut(t, 685.7)})`, width: 400, height: 560, background: "linear-gradient(135deg,#1d3a2a,#0f2318)", border: "6px solid #e8d9a8", boxShadow: "0 24px 50px rgba(0,0,0,.55)", padding: "50px 36px", textAlign: "center", color: "#e8d9a8" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 50, lineHeight: 1.15 }}>The Prairies<br />and the<br />Pampas</div>
        <div style={{ height: 3, background: "#e8d9a8", margin: "34px 40px" }} />
        <div style={{ fontFamily: "Georgia, serif", fontSize: 26, fontStyle: "italic" }}>Agrarian Policy in Canada<br />and Argentina</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, marginTop: 50, letterSpacing: 2 }}>CARL E. SOLBERG</div>
      </div>}
      <Tag c={c} f={f} t={t} lon={-104} lat={51.6} t0={681.9} t1={685.7} text="the Prairies" bg="#2a7d2e" size={30} />
      <Tag c={c} f={f} t={t} lon={-62} lat={-35.5} t0={682.6} t1={685.7} text="the Pampas" bg="#2a7d2e" size={30} />
      <Region d={PRA} op={at(681.9) * off(685.7)} z={c.z} color="#9bc24a" />
      {vis(t, 682.6, 685.7) && (() => { const [x, y] = proj(c, ...P(-62, -35.5)); return <div style={{ position: "absolute", left: x - 70, top: y - 50, width: 140, height: 100, borderRadius: "50%", background: "rgba(155,194,74,.6)", border: "4px solid #fff", transform: `scale(${pop(f, 682.6, 8)})` }} />; })()}
      <HandNote f={f} t={t} t0={684.0} t1={685.7} x={600} y={950} text="the gap he kept coming back to" size={70} />
      {/* no el suelo, no el clima: las reglas */}
      {vis(t, 686.3, 690.8) && <div style={{ position: "absolute", left: 960, top: 520, transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", gap: 24, opacity: fadeOut(t, 690.8) }}>
        {[["Not the soil", 686.38, false], ["Not the climate", 687.48, false], ["The rules: who gets to own it", 688.7, true]].map(([w, tt, ok], i) => t >= (tt as number) ? (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, transform: `scale(${pop(f, tt as number, 8) * (ok ? 1.12 : 1)})`, transformOrigin: "left", opacity: !ok && t > 688.7 ? 0.45 : 1 }}>
            <div style={{ width: 84, height: 84, borderRadius: 42, background: ok ? "#2a9d3a" : "#d42a1e", border: "5px solid #fff", color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 54, display: "flex", alignItems: "center", justifyContent: "center" }}>{ok ? "✓" : "✕"}</div>
            <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 70, color: ok ? "#ffd23a" : "#fff", textShadow: "0 4px 14px rgba(0,0,0,.6)", textDecoration: !ok && t > 688.7 ? "line-through" : undefined }}>{(w as string).toUpperCase()}</div>
          </div>) : null)}
      </div>}
      <HandNote f={f} t={t} t0={690.85} t1={692.9} x={960} y={540} text="why does that matter so much?" size={100} />
      <BigWord f={f} t={t} t0={693.0} t1={695.9} text={<span>OWNERSHIP CHANGES <span style={{ color: "#ffd23a" }}>EVERYTHING</span></span>} y={540} size={78} />
      {/* dueño vs inquilino: crédito, escuela, voto */}
      {vis(t, 696.0, 708.2) && (() => {
        const rows: [string, string, string, number, number][] = [
          ["p_tractor", "BORROWS AGAINST HIS LAND → TRACTOR", "CAN'T", 696.1, 698.84],
          ["p_school", "BUILDS A TOWN · PAYS FOR A SCHOOL", "MOVES ON", 700.3, 704.8],
          ["p_ballot", "VOTES", "", 706.84, 9999],
        ];
        const cur = t < 700.2 ? 0 : t < 706.7 ? 1 : 2;
        const [img, own, ten, t0, t1] = rows[cur];
        const k = interpolate(t, [t0, t0 + 0.45], [0, 1], { ...clamp, easing: ease });
        return (
          <AbsoluteFill style={{ opacity: Math.min(at(696.0, 0.3), fadeOut(t, 708.2)) }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden", clipPath: `circle(${k * 1200}px at 640px 540px)` }}>
              <Img src={sf(`v5/img/${img}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.06 + 0.04 * (t - t0)})` }} />
            </div>
            <div style={{ position: "absolute", left: 60, top: 60, transform: `scale(${pop(f, t0, 8)})`, transformOrigin: "left top", ...chip("#2a7d2e"), fontSize: 46 }}>✓ AN OWNER {own}</div>
            {t >= t1 && <div style={{ position: "absolute", right: 60, bottom: 80, transform: `rotate(-4deg) scale(${pop(f, t1, 8)})`, ...chip("#d42a1e"), fontSize: 64 }}>✕ A TENANT {ten}</div>}
            {cur === 1 && t > 702.6 && <div style={{ position: "absolute", right: 80, top: 220, transform: `scale(${pop(f, 702.6, 9)})`, fontFamily: HAND, fontSize: 60, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.7)" }}>his children will grow up there</div>}
          </AbsoluteFill>
        );
      })()}
      {/* Canadá: nación de dueños que se organiza */}
      <Tag c={c} f={f} t={t} lon={-100} lat={56} t0={708.5} t1={718.8} text="A nation of farm owners" bg="#2a7d2e" size={32} />
      {vis(t, 710.4, 714.9) && <div style={{ position: "absolute", left: 960, top: 900, transform: "translateX(-50%)", display: "flex", gap: 24, opacity: fadeOut(t, 714.9) }}>
        {[["CO-OPERATIVES", 710.76], ["GRAIN POOLS", 712.02], ["POLITICAL PARTIES", 712.96]].map(([w, tt], i) => t >= (tt as number) ? <div key={i} style={{ ...chip(["#2a7d2e", "#7a5a12", "#1d3f73"][i]), transform: `rotate(${(i % 2 ? 3 : -3)}deg) scale(${pop(f, tt as number, 8)})` }}>{w}</div> : null)}
      </div>}
      {vis(t, 715.0, 718.9) && <div style={{ position: "absolute", left: 960, top: 880, transform: "translateX(-50%)", display: "flex", gap: 30, alignItems: "center", opacity: fadeOut(t, 718.9) }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 54, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.6)", transform: `scale(${pop(f, 715.1, 8)})` }}>PUSHED BACK ⟶</div>
        {[["RAILWAYS", 716.04], ["BANKS", 717.18], ["GOVERNMENTS", 717.4]].map(([w, tt], i) => t >= (tt as number) ? <div key={i} style={{ ...chip("#333"), transform: `rotate(${(i - 1) * 4}deg) scale(${pop(f, tt as number, 8)}) translateX(${Math.sin((t - (tt as number)) * 30) * 6 * Math.max(0, 1 - (t - (tt as number)) * 3)}px)` }}>{w}</div> : null)}
      </div>}
      {/* UFA 1921 */}
      <Tag c={c} f={f} t={t} lon={-114.5} lat={56.2} t0={720.3} t1={726.8} text="Alberta" bg="#111" size={30} />
      {vis(t, 720.9, 726.8) && <div style={{ position: "absolute", left: 1440, top: 330, transform: `translate(-50%,-50%) rotate(3deg) scale(${pop(f, 720.98, 10) * fadeOut(t, 726.8)})`, background: "#fbf6e6", border: "5px solid #fff", padding: "22px 34px", boxShadow: "0 18px 40px rgba(0,0,0,.5)", textAlign: "center" }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 52, color: "#1b2433" }}>UNITED FARMERS<br />OF ALBERTA</div>
        {t > 722.3 && <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 60, color: "#2a9d3a", transform: `scale(${pop(f, 722.3, 8)})` }}>✓ WON</div>}
      </div>}
      {vis(t, 724.2, 726.8) && <div style={{ position: "absolute", left: 1440, top: 760, transform: `translate(-50%,-50%) scale(${pop(f, 724.3, 9) * fadeOut(t, 726.8)})`, fontFamily: SANS, fontWeight: 900, fontSize: 120, color: "#ffd23a", whiteSpace: "nowrap", textShadow: "0 6px 20px rgba(0,0,0,.6)" }}>{Math.round(interpolate(t, [724.6, 725.6], [1, 14], clamp))} <span style={{ fontSize: 56, color: "#fff" }}>YEARS IN POWER</span></div>}
      {/* Saskatchewan Wheat Pool 1924 */}
      <Tag c={c} f={f} t={t} lon={-106} lat={55.6} t0={729.5} t1={734.4} text="Saskatchewan Wheat Pool" bg="#7a5a12" size={30} />
      {vis(t, 731.4, 734.4) && <div style={{ position: "absolute", left: 1460, top: 860, transform: `translate(-50%,-50%) scale(${pop(f, 731.5, 9) * fadeOut(t, 734.4)})`, display: "flex", gap: 20, alignItems: "center" }}>
        <div style={{ ...chip("#555"), fontSize: 36, textDecoration: "line-through" }}>ONE BY ONE</div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 60, color: "#fff" }}>→</div>
        <div style={{ ...chip("#2a7d2e"), fontSize: 44 }}>TOGETHER</div>
      </div>}
      {/* Calgary 1932 → salud pública */}
      <Tag c={c} f={f} t={t} lon={CALGARY[0]} lat={CALGARY[1] + 0.25} t0={736.4} t1={742.2} text="Calgary" bg="#111" size={32} />
      {vis(t, 737.2, 742.2) && <div style={{ position: "absolute", left: 1420, top: 360, transform: `translate(-50%,-50%) scale(${fadeOut(t, 742.2)})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", gap: 16 }}>
          {[["FARMERS", 737.24, "#2a7d2e"], ["WORKERS", 737.62, "#1d3f73"]].map(([w, tt, col], i) => t >= (tt as number) ? <div key={i} style={{ ...chip(col as string), fontSize: 40, transform: `scale(${pop(f, tt as number, 8)})` }}>{w}</div> : null)}
        </div>
        {t > 738.6 && <div style={{ ...chip("#b22"), fontSize: 46, transform: `scale(${pop(f, 738.6, 8)})` }}>A NEW PARTY · 1932</div>}
      </div>}
      <Portal2 c={c} t={t} lon={CALGARY[0]} lat={CALGARY[1]} t0={739.8} t1={742.4} src="v5/img/u_clinic.png" maxR={270} dx={-560} dy={40} caption="Later: public health care" />
      {/* familias comunes con 160 acres */}
      {vis(t, 742.3, 746.9) && <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) scale(${fadeOut(t, 746.9)})`, textAlign: "center", fontFamily: SANS, fontWeight: 900, textShadow: "0 4px 16px rgba(0,0,0,.6)" }}>
        <div style={{ fontSize: 70, color: "#fff", transform: `scale(${pop(f, 742.3, 8)})` }}>NOT <span style={{ color: "#ff8a6a", textDecoration: "line-through" }}>LANDLORDS</span></div>
        {t > 743.9 && <div style={{ fontSize: 76, color: "#fff", marginTop: 14, transform: `scale(${pop(f, 743.96, 8)})` }}>ORDINARY FAMILIES</div>}
        {t > 745.2 && <div style={{ fontSize: 130, color: "#9be05a", transform: `scale(${pop(f, 745.22, 8)})` }}>160 ACRES</div>}
      </div>}
      <HandNote f={f} t={t} t0={747.0} t1={750.1} x={960} y={540} text="they owned something → they protected it" size={84} />
      {/* Argentina: no ciudadanos, sin voz */}
      <Tag c={c} f={f} t={t} lon={-62} lat={-30.8} t0={751.4} t1={758.4} text="Argentina" bg="#111" size={30} />
      {vis(t, 752.2, 758.5) && <div style={{ position: "absolute", left: 960, top: 540, transform: "translate(-50%,-50%)", display: "flex", gap: 14, flexWrap: "wrap", width: 900, justifyContent: "center", opacity: fadeOut(t, 758.5) }}>
        {Array.from({ length: 20 }).map((_, i) => { const tt = 752.3 + i * 0.05; const grey = t > 753.4 && i % 10 !== 0; return t >= tt ? <Img key={i} src={sf("icons/farmer.png")} style={{ width: 80, transform: `scale(${pop(f, tt, 6)})`, filter: grey ? "grayscale(1) brightness(.75)" : undefined, transition: "none" }} /> : null; })}
      </div>}
      {vis(t, 753.4, 758.5) && <div style={{ position: "absolute", left: 960, top: 210, transform: `translate(-50%,-50%) rotate(-3deg) scale(${pop(f, 753.5, 8) * fadeOut(t, 758.5)})`, border: "7px solid #b22", color: "#b22", background: "rgba(255,250,240,.92)", fontFamily: SANS, fontWeight: 900, fontSize: 70, padding: "2px 30px", borderRadius: 12 }}>NEVER CITIZENS</div>}
      {vis(t, 756.3, 758.5) && <div style={{ position: "absolute", left: 960, top: 880, transform: `translate(-50%,-50%) scale(${pop(f, 756.4, 8) * fadeOut(t, 758.5)})`, ...chip("#333"), fontSize: 56 }}>NO VOICE</div>}
      {/* poder: familias de las estancias */}
      {vis(t, 759.6, 766.6) && <div style={{ position: "absolute", left: 1440, top: 330, transform: `translate(-50%,-50%) scale(${fadeOut(t, 766.6)})`, display: "flex", gap: 16 }}>
        {[0, 1, 2, 3, 4].map((i) => t > 760.6 + i * 0.1 ? <Img key={i} src={sf("icons/tophat.png")} style={{ width: 96, transform: `rotate(${(i - 2) * 6}deg) scale(${pop(f, 760.6 + i * 0.1, 7)})` }} /> : null)}
      </div>}
      {vis(t, 762.2, 764.3) && <div style={{ position: "absolute", left: 1440, top: 470, display: "flex", gap: 16, transform: `translateX(-50%) scale(${fadeOut(t, 764.3)})` }}>
        {[["ESTANCIAS", 762.24], ["CAPITAL", 763.2]].map(([w, tt], i) => t >= (tt as number) ? <div key={i} style={{ ...chip(i ? "#7a5a12" : "#a3311f"), fontSize: 40, transform: `scale(${pop(f, tt as number, 8)})` }}>{w}</div> : null)}
      </div>}
      <Tag c={c} f={f} t={t} lon={BA[0]} lat={BA[1] + 0.3} t0={759.8} t1={766.6} text="Buenos Aires" bg="#111" size={28} />
      <HandNote f={f} t={t} t0={764.4} t1={766.6} x={1440} y={520} text="complain → thrown out" size={74} />
      {/* Ley de Residencia 1902 */}
      {vis(t, 767.4, 777.7) && <div style={{ position: "absolute", left: 470, top: 520, transform: `translate(-50%,-50%) rotate(-3deg) scale(${pop(f, 767.5, 10) * fadeOut(t, 777.7)})`, width: 520, background: "linear-gradient(#fbf6e6,#efe4c4)", border: "5px solid #fff", boxShadow: "0 24px 50px rgba(0,0,0,.55)", padding: "34px 40px", fontFamily: "Georgia, serif", color: "#26314a" }}>
        <div style={{ fontSize: 26, letterSpacing: 3, textAlign: "center" }}>REPÚBLICA ARGENTINA</div>
        <div style={{ fontSize: 50, fontWeight: 700, textAlign: "center", margin: "12px 0" }}>Ley de Residencia</div>
        <div style={{ fontSize: 24, textAlign: "center" }}>N.º 4144 · 1902</div>
        <div style={{ height: 2, background: "#26314a", margin: "20px 0" }} />
        <div style={{ fontFamily: HAND, fontSize: 38, lineHeight: 1.25 }}>{"deport any foreigner considered a threat to public order".slice(0, Math.floor(interpolate(t, [770.4, 774.0], [0, 56], clamp)))}</div>
        {t > 771.5 && <div style={{ position: "absolute", right: -40, top: -30, transform: `rotate(12deg) scale(${pop(f, 771.5, 7)})`, border: "7px solid #b22", color: "#b22", fontFamily: SANS, fontWeight: 900, fontSize: 56, padding: "0 20px", borderRadius: 10, background: "rgba(255,250,240,.85)" }}>DEPORTED</div>}
      </div>}
      <Route c={c} t={t} f={f} from={BA} to={[2, 44]} t0={771.6} t1={777.6} dur={2.2} bend={-500} />
      {vis(t, 775.5, 777.7) && <div style={{ position: "absolute", left: 1400, top: 900, display: "flex", gap: 18, transform: `translateX(-50%) scale(${fadeOut(t, 777.7)})` }}>
        {[["UNION LEADERS", 776.14], ["STRIKERS", 776.98]].map(([w, tt], i) => t >= (tt as number) ? <div key={i} style={{ ...chip("#b22"), fontSize: 42, transform: `scale(${pop(f, tt as number, 8)})` }}>{w}</div> : null)}
      </div>}
      <HandNote f={f} t={t} t0={777.0} t1={778.9} x={1400} y={760} text="for decades" size={80} color="#ffd23a" />
      {/* Ley Sáenz Peña 1912 → Yrigoyen 1916 */}
      {vis(t, 780.2, 784.9) && <div style={{ position: "absolute", left: 1420, top: 520, transform: `translate(-50%,-50%) scale(${pop(f, 780.3, 10) * fadeOut(t, 784.9)})`, textAlign: "center" }}>
        <div style={{ width: 300, height: 220, margin: "0 auto", background: "linear-gradient(#c79a5a,#8a5f2e)", border: "6px solid #fff", borderRadius: 10, position: "relative", boxShadow: "0 18px 40px rgba(0,0,0,.5)" }}>
          <div style={{ position: "absolute", left: 90, top: -6, width: 120, height: 14, background: "#222", borderRadius: 4 }} />
          <div style={{ position: "absolute", left: 110, top: -90 + interpolate(t, [781.0, 781.8], [0, 80], clamp), width: 80, height: 100, background: "#fff", border: "3px solid #999", transform: "rotate(-4deg)", opacity: t < 781.85 ? 1 : 0 }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 40, color: "#fff" }}>VOTE</div>
        </div>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 20 }}>
          {[["SECRET", 782.62], ["COMPULSORY", 783.28], ["MEN", 784.06]].map(([w, tt], i) => t >= (tt as number) ? <div key={i} style={{ ...chip(["#1d3f73", "#2a7d2e", "#555"][i]), fontSize: 36, transform: `scale(${pop(f, tt as number, 8)})` }}>{w}</div> : null)}
        </div>
      </div>}
      {vis(t, 786.2, 790.4) && <div style={{ position: "absolute", left: 1420, top: 520, transform: `translate(-50%,-50%) rotate(2deg) scale(${pop(f, 786.9, 10) * fadeOut(t, 790.4)})`, background: "#fbf6e6", border: "5px solid #fff", boxShadow: "0 18px 40px rgba(0,0,0,.5)", padding: "26px 40px", textAlign: "center" }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#59606e" }}>PRESIDENT ELECTED</div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 70, color: "#1b2433" }}>HIPÓLITO YRIGOYEN</div>
        {t > 789.3 && <div style={{ fontFamily: HAND, fontSize: 54, color: "#2a7d2e", transform: `scale(${pop(f, 789.3, 8)})` }}>from outside the old elite</div>}
      </div>}
      <HandNote f={f} t={t} t0={791.5} t1={793.5} x={960} y={200} text="it looked like the country was opening up…" size={80} />
      {/* pero los que trabajaban la tierra eran extranjeros: no votan */}
      {vis(t, 793.6, 799.3) && <div style={{ position: "absolute", left: 960, top: 600, transform: "translate(-50%,-50%)", opacity: fadeOut(t, 799.3), textAlign: "center" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", width: 1100, justifyContent: "center" }}>
          {Array.from({ length: 24 }).map((_, i) => { const tt = 793.8 + i * 0.04; const foreign = i % 4 !== 0; const x = t > 797.6 && foreign; return t >= tt ? <div key={i} style={{ position: "relative", transform: `scale(${pop(f, tt, 6)})` }}>
            <Img src={sf("icons/farmer.png")} style={{ width: 78, filter: x ? "grayscale(1) brightness(.7)" : undefined }} />
            {x && <div style={{ position: "absolute", left: 18, top: 10, fontFamily: SANS, fontWeight: 900, fontSize: 60, color: "#ff3b2f", transform: `scale(${pop(f, 797.6 + (i % 6) * 0.04, 6)})`, textShadow: "0 0 6px #fff" }}>✕</div>}
          </div> : null; })}
        </div>
        {t > 796.2 && <div style={{ marginTop: 26, fontFamily: SANS, fontWeight: 900, fontSize: 68, whiteSpace: "nowrap", color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.6)", transform: `scale(${pop(f, 796.22, 8)})` }}>FOREIGNERS <span style={{ color: "#ff6a5a" }}>{t > 797.6 ? "COULD NOT VOTE" : ""}</span></div>}
      </div>}
      <Vignette />
    </AbsoluteFill>
  );
};
