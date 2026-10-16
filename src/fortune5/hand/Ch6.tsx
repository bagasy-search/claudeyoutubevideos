// Capítulo 6 (8:00.5 → 10:37.0): las Praderas no estaban vacías; la Conquista del Desierto pagada con bonos;
// estancias gigantes; los inmigrantes alquilan; golondrinas; el Grito de Alcorta (1912).
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { P, proj, pop, fadeOut, vis, ease, clamp, Region, Tag, Icon, Flag, BigWord, Route, Clouds, SANS, HAND, geo, FPS } from "../Main";
import { K, camOf, blurOf, World, YearCorner, Portal2, HandNote, Vignette } from "./common";

import { sf } from "../sf";
const PRA = ["Alberta", "Saskatchewan", "Manitoba"].map((n) => geo.prov[n].d).join("");
const ALCORTA: [number, number] = [-61.12, -33.54];

const KEYS: K[] = [
  [480.5, -103, 50.5, 2.2],
  [483.9, -106, 52, 1.3],
  [491.8, -106, 52.3, 1.4],
  [492.6, -104, 51.5, 1.15],
  [499.7, -103, 51.5, 1.25],
  [500.6, -82, 9, 0.42],
  [505.2, -82, 9, 0.43],
  [506.3, -82, 9, 0.41],
  [509.9, -82, 9, 0.42],
  [511.0, -63, -36.5, 1.5],
  [518.9, -63.5, -37.2, 1.6],
  [524.0, -64.5, -38.5, 1.45],
  [530.4, -64.5, -38.8, 1.5],
  [534.5, -62.5, -37, 1.75],
  [547.4, -62.5, -37, 2.1],
  [548.4, -58.6, -34.6, 2.4],
  [558.9, -58.4, -34.6, 2.9],
  [560.1, -61.5, -35.5, 1.6],
  [564.3, -61.5, -35.5, 1.7],
  [568.5, -61.2, -34, 3.0],
  [580.4, -61.2, -34, 3.3],
  [589.6, -61.2, -34, 3.0],
  [590.6, -28, 8, 0.36],
  [597.6, -26, 8, 0.37],
  [598.6, ALCORTA[0], ALCORTA[1], 4.5],
  [606.5, ALCORTA[0], ALCORTA[1], 5.0],
  [610.9, ALCORTA[0], ALCORTA[1], 4.6],
  [615.7, -61, -32, 2.3],
  [624.9, -61, -32.2, 2.5],
  [632.6, -61, -32.5, 2.3],
  [637.0, -61, -34, 1.5],
];

// las primeras naciones (sin íconos caricaturescos: sólo el nombre sobre su territorio)
const NATIONS: [string, number, number, number][] = [["Cree", -108, 54.6, 486.15], ["Blackfoot", -113.2, 50.2, 486.69], ["Assiniboine", -104.5, 50.6, 487.51], ["Saulteaux", -99.6, 51.4, 488.55], ["Métis", -106.2, 52.6, 489.13]];
const TREATIES: [string, number, number][] = [["1", -97.2, 50.1], ["2", -99.5, 51.2], ["4", -104, 51], ["6", -108.5, 53.6], ["7", -113.3, 50.8], ["5", -97.5, 53.6], ["3", -93.5, 49.6]];
// frontera sur: antes (1870s) y después (Río Negro)
const FRONT_A: [number, number][] = [[-57.5, -38.0], [-61, -37.4], [-63.5, -36], [-65.5, -34.6], [-67.5, -33.6]];
const FRONT_B: [number, number][] = [[-62.8, -41.0], [-64.5, -40.6], [-66.5, -39.6], [-68.5, -39.0], [-70.5, -38.4]];
const ESTATES: [number, number, number, number][] = [[-63.8, -37.4, 1.1, 0.8], [-62.4, -37.9, 0.9, 0.7], [-64.4, -36.4, 0.8, 0.7], [-61.2, -37.1, 0.8, 0.6], [-63.1, -36.6, 0.7, 0.6], [-60.4, -36.4, 0.7, 0.6], [-65.1, -37.6, 0.8, 0.7]];

export const Ch6: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const f = t * FPS;
  const c = camOf(KEYS, t);
  const blur = blurOf(KEYS, t, FPS);
  const at = (t0: number, d = 0.35) => interpolate(t, [t0, t0 + d], [0, 1], clamp);
  const off = (t1: number, d = 0.4) => interpolate(t, [t1, t1 + d], [1, 0], clamp);
  const push = interpolate(t, [537.9, 540.0], [0, 1], { ...clamp, easing: ease });
  const front = FRONT_A.map(([a, b], i) => [a + (FRONT_B[i][0] - a) * push, b + (FRONT_B[i][1] - b) * push] as [number, number]);
  const frontD = front.map(([lo, la], i) => { const [x, y] = P(lo, la); return `${i ? "L" : "M"}${x},${y}`; }).join(" ");
  const southD = frontD + (() => { const [x1, y1] = P(-72, -45), [x0, y0] = P(-55, -45); return ` L${x1},${front[front.length - 1][1] > -40 ? P(-72, front[front.length - 1][1])[1] : y1} L${x1},${y1} L${x0},${y0} Z`; })();
  const strike = interpolate(t, [615.8, 618.6], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ background: "#2f6fb8", overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id="mb6"><feGaussianBlur stdDeviation={blur.toFixed(2)} /></filter></svg>
      <AbsoluteFill style={{ filter: blur > 0.6 ? "url(#mb6)" : undefined }}>
        <World c={c} modern={0}>
          <Region d={PRA} op={at(484.0) * off(499.6)} z={c.z} color="#b98a4a" />
          {/* tratados numerados: líneas punteadas que se dibujan */}
          {vis(t, 492.0, 499.6) && TREATIES.map(([n, lo, la], i) => { const [x, y] = P(lo, la); const o = at(492.2 + i * 0.18, 0.3) * off(499.6); return <circle key={i} cx={x} cy={y} r={70 / c.z} fill="none" stroke="#fff" strokeWidth={3 / c.z} strokeDasharray={`${10 / c.z} ${7 / c.z}`} opacity={o} />; })}
          {/* la Pampa del sur todavía indígena + la frontera que avanza */}
          {vis(t, 513.6, 548.3) && <>
            <clipPath id="argclip"><path d={geo.countries.ARG.d} /></clipPath>
            <path d={southD} fill="#7a4b2a" fillOpacity={0.4 * at(515.3) * off(548.0)} stroke="none" clipPath="url(#argclip)" />
            <path d={frontD} fill="none" stroke="#b22" strokeWidth={7 / c.z} strokeDasharray={`${20 / c.z} ${10 / c.z}`} opacity={at(519.3) * off(548.0)} />
          </>}
          {/* bonos que se vuelven bloques enormes de tierra */}
          {ESTATES.map(([lo, la, w, h], i) => { const [x, y] = P(lo, la); const k = interpolate(t, [540.6 + i * 0.16, 541.3 + i * 0.16], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.5)) }) * off(564.2); return k > 0 ? <rect key={i} x={x - (w * 30 * k) / 2} y={y - (h * 30 * k) / 2} width={w * 30 * k} height={h * 30 * k} fill={i % 2 ? "#c2412c" : "#a3311f"} fillOpacity={0.75} stroke="#fff" strokeWidth={3 / c.z} /> : null; })}
          {/* el cuarto de sección canadiense, para comparar (un puntito) */}
          {vis(t, 543.3, 547.4) && (() => { const [x, y] = P(-60.2, -38.6); return <rect x={x - 1.2} y={y - 1.2} width={2.4} height={2.4} fill="#9be05a" stroke="#fff" strokeWidth={1 / c.z} opacity={at(543.3) * off(547.3)} />; })()}
          {/* huelga que se extiende por Santa Fe */}
          {strike > 0 && Array.from({ length: 26 }).map((_, i) => { const lo = ALCORTA[0] + Math.cos(i * 2.4) * (0.4 + (i % 7) * 0.35) * strike, la = ALCORTA[1] + Math.sin(i * 2.4) * (0.3 + (i % 5) * 0.4) * strike + 0.6 * strike; const [x, y] = P(lo, la); return <circle key={i} cx={x} cy={y} r={(10 + (i % 3) * 4) / c.z} fill="#d42a1e" fillOpacity={0.8 * off(624.8)} stroke="#fff" strokeOpacity={off(624.8)} strokeWidth={2 / c.z} />; })}
        </World>
      </AbsoluteFill>

      <Clouds c={c} f={f} t={t} />
      <YearCorner f={f} t={t} marks={[[480.6, "1870s"], [492.0, "1871–1877"], [510.1, "1870s"], [519.3, "1878–1885"], [568.6, "1900s"], [598.7, "1912"]]} />

      {/* Canadá: las Praderas no estaban vacías */}
      <HandNote f={f} t={t} t0={482.6} t1={485.6} x={960} y={190} text="the Prairies weren't empty either" size={86} />
      {NATIONS.map(([n, lo, la, tt], i) => <Tag key={i} c={c} f={f} t={t} lon={lo} lat={la} t0={tt} t1={491.8} text={n} bg="#6b3a1f" size={30} />)}
      <BigWord f={f} t={t} t0={490.2} t1={491.9} text={<span>FOR <span style={{ color: "#ffd23a" }}>GENERATIONS</span></span>} y={950} size={84} />
      {TREATIES.map(([n, lo, la], i) => <Tag key={i} c={c} f={f} t={t} lon={lo} lat={la} t0={492.3 + i * 0.18} t1={499.6} text={`Treaty ${n}`} bg="#111" size={22} />)}
      <Portal2 c={c} t={t} lon={-104} lat={51.5} t0={493.5} t1={499.4} src="desk/dla_map.jpg" maxR={260} dx={-560} dy={-40} />
      {[["UNDER PRESSURE", 494.29], ["BROKEN AFTERWARDS", 494.91]].map(([w, tt], i) => vis(t, tt as number, 499.6) ? <div key={i} style={{ position: "absolute", left: 1480, top: 760 + i * 90, transform: `translate(-50%,-50%) rotate(${-4 + i * 5}deg) scale(${pop(f, tt as number, 8) * fadeOut(t, 499.6)})`, border: "6px solid #b22", color: "#b22", background: "rgba(255,250,240,.9)", fontFamily: SANS, fontWeight: 900, fontSize: 46, padding: "2px 22px", borderRadius: 10, whiteSpace: "nowrap" }}>{w}</div> : null)}
      {/* los dos países tomaron la tierra */}
      {vis(t, 499.9, 509.9) && <>
        {[[-100, 46, "ca"], [-63, -36, "ar"]].map(([lo, la, cc], i) => <Flag key={i} c={c} f={f} t={t} cc={cc as string} lon={lo as number} lat={la as number} t0={500.6 + i * 0.3} t1={509.9} w={90} />)}
        <HandNote f={f} t={t} t0={501.1} t1={505.2} x={960} y={190} text="both took the land from the people already there" size={70} />
        <BigWord f={f} t={t} t0={503.7} t1={505.3} text={<span>NOT SO <span style={{ color: "#ffd23a" }}>DIFFERENT</span></span>} y={950} size={84} />
        {vis(t, 506.3, 509.9) && <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) scale(${pop(f, 506.39, 9) * fadeOut(t, 509.9)})`, background: "rgba(14,16,24,.9)", border: "5px solid #ffd23a", borderRadius: 14, padding: "26px 44px", fontFamily: SANS, fontWeight: 900, fontSize: 56, color: "#fff", textAlign: "center" }}>THE DIFFERENCE:<br /><span style={{ color: "#ffd23a" }}>WHAT EACH DID WITH IT</span></div>}
      </>}
      {/* Argentina: la Pampa del sur */}
      <Tag c={c} f={f} t={t} lon={-62} lat={-31.6} t0={510.6} t1={518.8} text="Argentina" bg="#111" size={30} />
      <HandNote f={f} t={t} t0={512.4} t1={515.2} x={960} y={190} text="the Pampas weren't empty either" size={86} />
      <Tag c={c} f={f} t={t} lon={-66} lat={-39.8} t0={516.0} t1={523.9} text="Indigenous lands" bg="#6b3a1f" size={28} />
      <Tag c={c} f={f} t={t} lon={-60} lat={-36.2} t0={519.6} t1={523.9} text="Frontier" bg="#b22" size={24} />
      {vis(t, 521.0, 530.4) && <div style={{ position: "absolute", left: 1450, top: 300, transform: `translate(-50%,-50%) scale(${pop(f, 521.6, 10) * fadeOut(t, 530.4)})`, textAlign: "center" }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 40, color: "#fff", textShadow: "0 3px 10px rgba(0,0,0,.6)" }}>MILITARY CAMPAIGN</div>
        {t > 524.4 && <div style={{ fontFamily: HAND, fontSize: 86, color: "#ffd23a", textShadow: "0 4px 14px rgba(0,0,0,.6)", transform: `scale(${pop(f, 524.6, 9)})` }}>“Conquest of the Desert”</div>}
      </div>}
      <Portal2 c={c} t={t} lon={-65} lat={-38.5} t0={522.0} t1={526.6} src="v5/img/m_frontier.png" maxR={270} dx={-520} dy={-60} />
      <BigWord f={f} t={t} t0={529.3} t1={531.3} text={<span>FOR A <span style={{ color: "#ffd23a" }}>CENTURY</span></span>} y={950} size={84} />
      {vis(t, 531.4, 534.4) && <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) rotate(-3deg) scale(${pop(f, 531.65, 9) * fadeOut(t, 534.4)})`, background: "#fbf6e6", border: "5px solid #fff", padding: "24px 44px", boxShadow: "0 18px 40px rgba(0,0,0,.5)", fontFamily: SANS, fontWeight: 900, fontSize: 64, color: "#1b2433", textAlign: "center" }}>
        SOLD <span style={{ color: "#b22" }}>BEFORE</span><br />IT WAS EVEN CONQUERED
      </div>}
      {/* bonos */}
      {vis(t, 534.6, 540.6) && Array.from({ length: 7 }).map((_, i) => { const k = interpolate(t, [535.0 + i * 0.12, 536.2 + i * 0.12], [0, 1], { ...clamp, easing: ease }); const [ex, ey] = proj(c, ...P(ESTATES[i][0], ESTATES[i][1])); const sx = 960 + (i - 3) * 160, sy = 980; const fly = interpolate(t, [539.3, 540.5], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) }); return (
        <div key={i} style={{ position: "absolute", left: sx + (ex - sx) * fly, top: sy - 200 * k + (ey - (sy - 200)) * fly, width: 150, height: 92, transform: `translate(-50%,-50%) rotate(${(i - 3) * 5}deg) scale(${k * (1 - 0.6 * fly)})`, background: "linear-gradient(#f3e7c4,#e2d09a)", border: "4px solid #7a5a12", borderRadius: 6, fontFamily: "Georgia, serif", fontSize: 20, color: "#7a5a12", textAlign: "center", paddingTop: 12, boxShadow: "0 8px 16px rgba(0,0,0,.4)", opacity: 1 - interpolate(t, [540.4, 540.7], [0, 1], clamp) }}>LAND BOND<div style={{ fontSize: 26, fontWeight: 700 }}>1878</div></div>); })}
      <Tag c={c} f={f} t={t} lon={-62} lat={-34.8} t0={535.0} t1={537.9} text="Investors" bg="#7a5a12" size={28} />
      <Tag c={c} f={f} t={t} lon={-66.5} lat={-40.4} t0={538.3} t1={540.4} text="Army pushes south" bg="#b22" size={26} />
      <BigWord f={f} t={t} t0={541.05} t1={543.2} text={<span><span style={{ color: "#ff8a6a" }}>ENORMOUS</span> BLOCKS</span>} y={170} />
      {vis(t, 543.3, 547.4) && <div style={{ position: "absolute", left: 1460, top: 820, transform: `translate(-50%,-50%) scale(${pop(f, 543.4, 9) * fadeOut(t, 547.4)})`, background: "rgba(14,16,24,.88)", border: "4px solid #fff", borderRadius: 12, padding: "14px 26px", fontFamily: SANS, fontWeight: 900, color: "#fff" }}>
        <div style={{ fontSize: 30 }}><span style={{ color: "#9be05a" }}>■</span> CANADA: 160 ACRES</div>
        <div style={{ fontSize: 30, marginTop: 6 }}><span style={{ color: "#c2412c" }}>■</span> PAMPAS: TENS OF THOUSANDS</div>
      </div>}
      {/* para los que ya tenían dinero */}
      {[["Ranchers", 552.99], ["Merchants", 553.73], ["Politicians", 554.49]].map(([w, tt], i) => vis(t, tt as number, 558.8) ? <div key={i} style={{ position: "absolute", left: 1400, top: 260 + i * 110, transform: `translate(-50%,-50%) scale(${pop(f, tt as number, 8) * fadeOut(t, 558.8)})`, display: "flex", alignItems: "center", gap: 14 }}><Img src={sf("icons/tophat.png")} style={{ width: 80 }} /><span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 50, color: "#fff", textShadow: "0 3px 10px rgba(0,0,0,.6)" }}>{w}</span></div> : null)}
      <Tag c={c} f={f} t={t} lon={-58.4} lat={-34.2} t0={550.3} t1={558.8} text="Buenos Aires" bg="#111" size={26} />
      {vis(t, 555.8, 558.9) && <div style={{ position: "absolute", left: 520, top: 760, display: "flex", gap: 24, transform: `scale(${fadeOut(t, 558.9)})` }}>
        {["Av. Alvear", "Anchorena"].map((n, i) => t > 556.4 + i * 0.6 ? <div key={i} style={{ transform: `rotate(${i ? 3 : -3}deg) scale(${pop(f, 556.4 + i * 0.6, 9)})`, background: "#1d3f73", color: "#fff", border: "5px solid #fff", borderRadius: 8, padding: "8px 26px", fontFamily: SANS, fontWeight: 800, fontSize: 44 }}>{n}</div> : null)}
      </div>}
      <BigWord f={f} t={t} t0={562.6} t1={564.3} text={<span>ALREADY <span style={{ color: "#ff8a6a" }}>TAKEN</span></span>} y={170} />
      {/* alquilan */}
      {vis(t, 564.4, 568.5) && <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) scale(${pop(f, 564.5, 11) * fadeOut(t, 568.5)})`, fontFamily: SANS, fontWeight: 900, fontSize: 70, color: "#fff", textAlign: "center", textShadow: "0 4px 16px rgba(0,0,0,.6)" }}>6,000,000 IMMIGRANTS<br /><span style={{ fontSize: 46 }}>…AND THE LAND WAS <span style={{ color: "#ff8a6a" }}>TAKEN</span>?</span></div>}
      {vis(t, 568.6, 570.0) && <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) scale(${pop(f, 568.8, 7) * fadeOut(t, 570.0)})`, fontFamily: SANS, fontWeight: 900, fontSize: 170, color: "#ffd23a", textShadow: "0 6px 20px rgba(0,0,0,.6)" }}>RENTED.</div>}
      {/* la familia que salta de campo en campo */}
      {vis(t, 570.0, 589.5) && (() => {
        const plots = [[560, 620], [960, 520], [1360, 640]];
        const hop = t < 577.9 ? 0 : t < 580.3 ? interpolate(t, [577.9, 580.3], [0, 1], { ...clamp, easing: ease }) : 1 + interpolate(t, [584.0, 586.0], [0, 1], { ...clamp, easing: ease });
        const i0 = Math.min(1, Math.floor(hop)), u = hop - i0;
        const x = plots[i0][0] + (plots[i0 + 1][0] - plots[i0][0]) * u, y = plots[i0][1] + (plots[i0 + 1][1] - plots[i0][1]) * u - Math.sin(u * Math.PI) * 140;
        const o = Math.min(interpolate(t, [570.0, 570.4], [0, 1], clamp), fadeOut(t, 589.5));
        return (
          <AbsoluteFill style={{ opacity: o }}>
            {plots.map(([px, py], i) => <div key={i} style={{ position: "absolute", left: px - 150, top: py - 70, width: 300, height: 140, background: i <= hop ? "rgba(224,198,74,.75)" : "rgba(224,198,74,.35)", border: "4px dashed #fff", transform: "skewX(-12deg)" }} />)}
            <Img src={sf("icons/farmer.png")} style={{ position: "absolute", left: x - 60, top: y - 170, width: 120 }} />
            {t > 570.5 && <Img src={sf("flag_it.png")} style={{ position: "absolute", left: x + 40, top: y - 190, width: 60, border: "3px solid #fff", transform: `scale(${pop(f, 570.53, 9)})` }} />}
            {vis(t, 572.3, 577.8) && <div style={{ position: "absolute", left: 1500, top: 250, transform: `translate(-50%,-50%) rotate(3deg) scale(${pop(f, 572.69, 10)})`, background: "#fbf6e6", border: "4px solid #fff", padding: "20px 30px", boxShadow: "0 14px 30px rgba(0,0,0,.45)", fontFamily: HAND, fontSize: 50, color: "#26314a" }}>Contract with the estancia<br /><span style={{ color: "#b22" }}>3 or 4 years</span></div>}
            {[["solid house", 584.82], ["trees", 587.86]].map(([w, tt], i) => vis(t, tt as number, 589.5) ? <div key={i} style={{ position: "absolute", left: 600 + i * 720, top: 250, transform: `translate(-50%,-50%) scale(${pop(f, tt as number, 8)})`, fontFamily: SANS, fontWeight: 900, fontSize: 56, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.6)" }}>WHY BUILD A <span style={{ color: "#ffd23a" }}>{(w as string).toUpperCase()}</span>?</div> : null)}
            {vis(t, 581.2, 584.1) && <div style={{ position: "absolute", left: 960, top: 230, transform: `translate(-50%,-50%) scale(${pop(f, 581.56, 9) * fadeOut(t, 584.1)})`, fontFamily: SANS, fontWeight: 900, fontSize: 64, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.6)" }}>NOT THEIR SOIL → <span style={{ color: "#ff8a6a" }}>WHY IMPROVE IT?</span></div>}
          </AbsoluteFill>
        );
      })()}
      <Portal2 c={c} t={t} lon={-61.2} lat={-34} t0={572.6} t1={577.6} src="v5/img/n_contract.png" maxR={250} dx={-620} dy={-200} />
      <HandNote f={f} t={t} t0={589.7} t1={591.9} x={960} y={540} text="many didn't even stay" size={110} />
      {/* golondrinas: ida y vuelta cada año */}
      {vis(t, 591.9, 598.4) && Array.from({ length: 9 }).map((_, i) => { const ph = ((t - 592.0) / 2.6 + i / 9) % 1; const back = Math.floor((t - 592.0) / 2.6 + i / 9) % 2 === 1; const k = back ? 1 - ph : ph; const a = P(9, 44.4), b = P(-58.4, -34.6); const mx = (a[0] + b[0]) / 2 - 900, my = (a[1] + b[1]) / 2; const wx = (1 - k) ** 2 * a[0] + 2 * (1 - k) * k * mx + k * k * b[0], wy = (1 - k) ** 2 * a[1] + 2 * (1 - k) * k * my + k * k * b[1]; const [x, y] = proj(c, wx, wy); const flap = Math.sin(f / 2 + i) * 10; return (
        <svg key={i} width={70} height={40} style={{ position: "absolute", left: x - 35, top: y - 20, opacity: Math.min(at(592.0), fadeOut(t, 598.4)), transform: `scaleX(${back ? -1 : 1})` }}><path d={`M2,${20 - flap} Q20,${8 - flap} 35,22 Q50,${8 - flap} 68,${20 - flap}`} stroke="#1b1b1b" strokeWidth={5} fill="none" strokeLinecap="round" /></svg>); })}
      <Flag c={c} f={f} t={t} cc="it" lon={12} lat={43} t0={592.6} t1={598.4} w={80} />
      <Flag c={c} f={f} t={t} cc="ar" lon={-62} lat={-31} t0={592.4} t1={598.4} w={80} />
      <Tag c={c} f={f} t={t} lon={-24} lat={14} t0={592.8} t1={598.4} text="Every harvest, every year" bg="#111" size={24} />
      {vis(t, 596.0, 598.4) && <div style={{ position: "absolute", left: 960, top: 930, transform: `translate(-50%,-50%) scale(${pop(f, 596.24, 9) * fadeOut(t, 598.4)})`, textAlign: "center", textShadow: "0 4px 14px rgba(0,0,0,.6)" }}><span style={{ fontFamily: HAND, fontSize: 100, color: "#ffd23a" }}>golondrinas</span><span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 48, color: "#fff" }}> · SWALLOWS</span></div>}
      {/* el Grito de Alcorta */}
      <Tag c={c} f={f} t={t} lon={ALCORTA[0]} lat={ALCORTA[1] + 0.35} t0={599.0} t1={615.6} text="Alcorta · Santa Fe" bg="#111" size={30} />
      <Portal2 c={c} t={t} lon={ALCORTA[0]} lat={ALCORTA[1]} t0={602.9} t1={606.6} src="v5/img/n_strike.png" maxR={330} dx={-500} dy={-40} caption="Farmers on strike" />
      {vis(t, 603.1, 606.6) && <div style={{ position: "absolute", left: 1420, top: 380, transform: `translate(-50%,-50%) scale(${pop(f, 603.12, 9) * fadeOut(t, 606.6)})`, fontFamily: SANS, fontWeight: 900, fontSize: 72, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.6)", textAlign: "center" }}>THOUSANDS<br /><span style={{ color: "#ff6a5a" }}>ON STRIKE</span></div>}
      {vis(t, 606.7, 610.9) && <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) rotate(-3deg) scale(${pop(f, 607.6, 8) * fadeOut(t, 610.9)})`, textAlign: "center" }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 110, color: "#fff", whiteSpace: "nowrap", textShadow: "0 6px 20px rgba(0,0,0,.6)" }}>GRITO DE ALCORTA</div>
        {t > 609.1 && <div style={{ fontFamily: HAND, fontSize: 80, color: "#ffd23a", textShadow: "0 4px 14px rgba(0,0,0,.6)" }}>the Cry of Alcorta</div>}
      </div>}
      {vis(t, 611.0, 615.7) && <div style={{ position: "absolute", left: 1450, top: 300, transform: `translate(-50%,-50%) rotate(4deg) scale(${pop(f, 611.7, 10) * fadeOut(t, 615.7)})`, background: "#fff", padding: "14px 18px 20px", boxShadow: "0 14px 30px rgba(0,0,0,.45)", textAlign: "center", width: 260 }}>
        <div style={{ background: "#b22", color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 28, padding: 6 }}>JUNE</div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 120, color: "#1b2433", lineHeight: 1.1 }}>25</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 26, color: "#59606e" }}>1912</div>
      </div>}
      <Tag c={c} f={f} t={t} lon={-61} lat={-29.8} t0={617.0} t1={624.8} text="Spreads across the province" bg="#d42a1e" size={26} />
      {vis(t, 618.8, 624.9) && <div style={{ position: "absolute", left: 1400, top: 860, transform: `translate(-50%,-50%) scale(${pop(f, 619.92, 10) * fadeOut(t, 624.9)})`, background: "#1b2433", border: "5px solid #fff", borderRadius: 12, padding: "14px 30px", fontFamily: SANS, fontWeight: 900, fontSize: 40, color: "#fff", textAlign: "center" }}>FEDERACIÓN AGRARIA ARGENTINA<div style={{ fontSize: 26, color: "#ffd23a" }}>THE FIRST GREAT UNION OF SMALL FARMERS</div></div>}
      {/* lo que ganaron y lo que no */}
      {vis(t, 624.9, 632.6) && <div style={{ position: "absolute", left: 960, top: 520, transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", gap: 20, opacity: fadeOut(t, 632.6) }}>
        {[["Lower rents", 625.46, true], ["Longer contracts", 626.46, true], ["The land itself", 630.82, false]].map(([w, tt, ok], i) => t >= (tt as number) ? (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, transform: `scale(${pop(f, tt as number, 8) * (i === 2 ? 1.15 : 1)})`, transformOrigin: "left" }}>
            <div style={{ width: 84, height: 84, borderRadius: 42, background: ok ? "#2a9d3a" : "#d42a1e", border: "5px solid #fff", color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 54, display: "flex", alignItems: "center", justifyContent: "center" }}>{ok ? "✓" : "✕"}</div>
            <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 70, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.6)" }}>{(w as string).toUpperCase()}</div>
          </div>) : null)}
      </div>}
      {/* mismo todo */}
      {[["SAME LAND", 632.68], ["SAME WHEAT", 634.34], ["SAME PEOPLE", 635.3]].map(([w, tt], i) => vis(t, tt as number, 636.9) ? <div key={i} style={{ position: "absolute", left: 480 + i * 480, top: 540, transform: `translate(-50%,-50%) rotate(${i % 2 ? 3 : -3}deg) scale(${pop(f, tt as number, 8) * fadeOut(t, 636.9)})`, background: "#2a7d2e", color: "#fff", border: "5px solid #fff", borderRadius: 10, padding: "6px 26px", fontFamily: SANS, fontWeight: 900, fontSize: 60, whiteSpace: "nowrap" }}>{w}</div> : null)}
      <Vignette />
    </AbsoluteFill>
  );
};
