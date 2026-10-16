// Capítulo 4 (3:42.4 → 5:35.4): Canadá vacía, el CPR, el último clavo, vender las Praderas, Sifton, 3 millones.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { P, proj, pop, fadeOut, vis, ease, clamp, Region, Tag, Icon, Flag, BigWord, Route, Clouds, SANS, HAND, geo, FPS } from "../Main";
import { Terrain3D, useTerrainTextures } from "../v3";
import { K, camOf, blurOf, World, YearCorner, Portal2, HandNote, Rail, along, Vignette } from "./common";

import { sf } from "../sf";
const CPR: [number, number][] = [[-73.6, 45.5], [-75.7, 45.4], [-81, 46.5], [-89.2, 48.4], [-97.1, 49.9], [-104.6, 50.4], [-114.1, 51.05], [-116.5, 51.4], [-118.6, 50.98], [-123.1, 49.3]];
const CPR_W = [...CPR].reverse(); // se dibuja de este a oeste igual que se construyó la promesa
const PRA = ["Alberta", "Saskatchewan", "Manitoba"].map((n) => geo.prov[n].d).join("");

const KEYS: K[] = [
  [222.4, -72, -12, 0.7],
  [223.4, -100, 54, 0.62],
  [225.6, -98, 55, 0.66],
  [226.3, -96, 50, 0.72],
  [228.4, -98, 50, 0.7],
  [229.7, -100, 50.5, 1.05],
  [233.9, -102, 50.5, 1.1],
  [234.6, -72, 45, 0.55],
  [236.4, -74, 45, 0.57],
  [237.0, -104, 53, 0.9],
  [240.5, -104, 53, 0.95],
  [243.6, -110, 51, 0.8],
  [246.3, -122, 53, 1.0],
  [249.8, -108, 52, 0.6],
  [251.2, -84, 49, 1.0],
  [252.5, -104, 50.5, 1.0],
  [253.5, -114, 51, 1.1],
  [262.4, -118.6, 51, 1.6],
  [263.3, -118.6, 51, 1.4],
  [265.9, -95, 54, 0.45],
  [266.6, -95, 54, 0.46],
  [268.0, -101, 51, 1.0],
  [270.1, -102, 51, 1.05],
  [272.7, -104, 52, 1.1],
  [275.2, -103, 52, 1.15],
  [276.4, -25, 50, 0.5],
  [280.0, -23, 50, 0.52],
  [280.3, -104, 52, 1.0],
  [285.4, -104, 52, 1.05],
  [286.4, -2, 53, 1.2],
  [287.4, 15, 60, 1.1],
  [288.5, 10, 51, 1.2],
  [289.2, 31, 49, 1.15],
  [292.4, 25, 50, 1.0],
  [293.4, -75.7, 45.4, 1.6],
  [298.5, -77.5, 45.8, 2.3],
  [314.4, -76.5, 45.6, 2.5],
  [316.0, -104, 52, 1.1],
  [319.0, -106, 51.5, 1.35],
  [322.1, -103, 52, 1.15],
  [323.5, -35, 48, 0.5],
  [328.3, -38, 48, 0.52],
  [329.6, -110, 53, 1.15],
  [335.4, -106, 52, 1.3],
];

// tren pequeño (locomotora + vagones) que recorre una polilínea
const Train: React.FC<{ c: any; f: number; pts: [number, number][]; k: number; cars?: number; empty?: boolean }> = ({ c, f, pts, k, cars = 3, empty }) => (
  <>
    {Array.from({ length: cars + 1 }).map((_, i) => {
      const [wx, wy] = along(pts, Math.max(0, k - i * 0.012));
      const [x, y] = proj(c, wx, wy);
      return (
        <div key={i} style={{ position: "absolute", left: x - 22, top: y - 16, width: 44, height: 28, borderRadius: 6, background: i === 0 ? "#1b1b1b" : empty ? "#d9d2bd" : "#b23a2a", border: "3px solid #fff", boxShadow: "0 4px 8px rgba(0,0,0,.4)" }}>
          {i === 0 && <div style={{ position: "absolute", left: 12, top: -18 - (f % 8), width: 16, height: 16, borderRadius: 8, background: "rgba(255,255,255,.8)" }} />}
        </div>
      );
    })}
  </>
);

// sello que golpea
const Stamp: React.FC<{ f: number; t: number; t0: number; t1: number; x: number; y: number; text: string; color?: string; rot?: number }> = ({ f, t, t0, t1, x, y, text, color = "#d42a1e", rot = -10 }) => {
  if (!vis(t, t0, t1)) return null;
  const k = interpolate(f - t0 * FPS, [0, 5], [2.4, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${k})`, opacity: Math.min(interpolate(f - t0 * FPS, [0, 3], [0, 1], clamp), fadeOut(t, t1)), border: `8px solid ${color}`, color, fontFamily: SANS, fontWeight: 900, fontSize: 70, padding: "2px 26px", borderRadius: 10, letterSpacing: 3, background: "rgba(255,250,240,.82)", whiteSpace: "nowrap" }}>{text}</div>
  );
};

// martillo + clavo: tres golpes
const LastSpike: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  const t0 = 260.3, t1 = 263.3;
  if (!vis(t, t0, t1)) return null;
  const hits = [261.46, 261.94, 262.42];
  const last = Math.max(t0, ...hits.filter((h) => h <= t));
  const sinceHit = t - last;
  const swing = hits.some((h) => h > t) ? interpolate(sinceHit, [0, 0.12, 0.42], [0, -55, -55], clamp) - interpolate(Math.min(...hits.filter((h) => h > t).map((h) => h - t), 9), [0, 0.1], [-55, 0], clamp) * 0 : 0;
  const nextHit = hits.find((h) => h > t);
  const ang = nextHit ? interpolate(nextHit - t, [0, 0.12, 0.3], [0, -60, -60], clamp) : 0;
  const depth = hits.filter((h) => h <= t).length;
  const flash = interpolate(sinceHit, [0, 0.15], [0.8, 0], clamp) * (depth > 0 ? 1 : 0);
  const shake = interpolate(sinceHit, [0, 0.2], [14, 0], clamp) * (depth > 0 ? 1 : 0) * Math.sin(f * 3);
  const o = Math.min(interpolate(t, [t0, t0 + 0.3], [0, 1], clamp), fadeOut(t, t1));
  return (
    <AbsoluteFill style={{ opacity: o, transform: `translate(${shake}px, ${shake * 0.4}px)` }}>
      <div style={{ position: "absolute", left: 1350, top: 860, width: 520, height: 60, background: "linear-gradient(#6b4a2a,#4a321c)", border: "4px solid #fff", borderRadius: 6, transform: "translateX(-50%)" }} />
      <div style={{ position: "absolute", left: 1350, top: 860 - 170 + depth * 40, width: 26, height: 190, transform: "translateX(-50%)", background: "linear-gradient(90deg,#d8c27a,#f6e3a1,#b8992f)", borderRadius: "4px 4px 0 0", clipPath: "polygon(0 0,100% 0,100% 85%,50% 100%,0 85%)" }} />
      <div style={{ position: "absolute", left: 1350 + 30, top: 860 - 210 + depth * 40, width: 360, height: 40, transformOrigin: "100% 50%", transform: `translateX(-100%) rotate(${ang}deg)` }}>
        <div style={{ position: "absolute", right: 0, top: -40, width: 70, height: 120, background: "#3b3f46", border: "4px solid #fff", borderRadius: 8 }} />
        <div style={{ position: "absolute", right: 60, top: 10, width: 300, height: 22, background: "#8a5a2b", border: "3px solid #fff", borderRadius: 6 }} />
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.35 }} />
      {depth >= 3 && <div style={{ position: "absolute", left: 1350, top: 960, transform: `translate(-50%,-50%) scale(${pop(f, 262.45, 8)})`, fontFamily: SANS, fontWeight: 900, fontSize: 54, color: "#fff", textShadow: "0 4px 12px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>THE LAST SPIKE</div>}
    </AbsoluteFill>
  );
};

const LANGS: [string, number, number][] = [["Free farms", -2, 55], ["Freie Farmen", 10, 51], ["Fria gårdar", 15, 61], ["Gratis gårder", 9, 61], ["Безкоштовні ферми", 31, 49], ["Darmowe farmy", 20, 52], ["Gratis boerderijen", 5, 52.5], ["Fermes gratuites", 2.3, 47], ["Fattorie gratuite", 12, 43], ["Farmy zdarma", 15, 49.8], ["Ingyen farmok", 19, 47.4], ["Ilmaisia tiloja", 25, 62]];

// cita de Sifton escrita a máquina, palabra por palabra al ritmo de la voz
const QUOTE: [string, number][] = [["“A stalwart", 308.59], ["peasant", 308.93], ["in a", 309.29], ["sheep-skin", 309.75], ["coat,", 310.09], ["born on", 310.91], ["the soil,", 311.15], ["with a", 311.95], ["stout", 312.17], ["wife", 312.43], ["and a", 312.77], ["half-dozen", 313.05], ["children.”", 313.4]];

export const Ch4: React.FC = () => {
  const tex = useTerrainTextures();
  const t = useCurrentFrame() / FPS;
  const f = t * FPS;
  const c = camOf(KEYS, t);
  const blur = blurOf(KEYS, t, FPS);
  const at = (t0: number, d = 0.35) => interpolate(t, [t0, t0 + d], [0, 1], clamp);
  const off = (t1: number, d = 0.4) => interpolate(t, [t1, t1 + d], [1, 0], clamp);
  const cprOp = at(225.8) * off(335.0);
  const glow = interpolate(t, [263.3, 264.6, 265.9, 266.6], [0, 1, 1, 0], clamp);
  const fill = interpolate(t, [329.6, 333.8], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ background: "#2f6fb8", overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id="mb4"><feGaussianBlur stdDeviation={blur.toFixed(2)} /></filter></svg>
      <AbsoluteFill style={{ filter: blur > 0.6 ? "url(#mb4)" : undefined }}>
        <World c={c} modern={0}>
          <path d={geo.countries.CAN.d} fill="#f7cd1f" fillOpacity={0.35 * at(222.6) * off(225.5)} stroke="#fff" strokeWidth={3 / c.z} strokeOpacity={at(222.6) * off(225.5)} />
          <Region d={PRA} op={at(236.6) * off(240.4) + at(270.7) * off(275.1) + at(280.3) * off(285.2)} z={c.z} color="#c9b450" />
          <Region d={PRA} op={fill} z={c.z} color="#9ad13a" />
          <Rail pts={CPR} t={t} t0={226.3} dur={2.0} z={c.z} op={cprOp} color="#b23a2a" />
          {glow > 0 && (() => { const d = CPR.map(([lo, la], i) => { const [x, y] = P(lo, la); return `${i ? "L" : "M"}${x},${y}`; }).join(" "); return <path d={d} fill="none" stroke="#ffd23a" strokeWidth={10 / c.z} opacity={glow} style={{ filter: `drop-shadow(0 0 ${12 / c.z}px #ffd23a)` }} />; })()}
          {/* promesa a Columbia Británica */}
          {vis(t, 243.7, 249.7) && (() => { const [x, y] = P(-124, 54); return <circle cx={x} cy={y} r={190 / c.z * 1.0} fill="#2a9d8f" fillOpacity={0.3 * at(243.7) * off(249.4)} stroke="#fff" strokeWidth={4 / c.z} strokeOpacity={at(243.7) * off(249.4)} />; })()}
          {/* puntitos de población que llenan las Praderas */}
          {fill > 0 && Array.from({ length: 160 }).map((_, i) => { const lo = -119 + ((i * 37) % 100) / 100 * 22, la = 49.3 + ((i * 53) % 100) / 100 * 5.6; const [x, y] = P(lo, la); const o = interpolate(fill, [i / 200, i / 200 + 0.12], [0, 1], clamp); return <circle key={i} cx={x} cy={y} r={5 / c.z} fill="#1b1b1b" opacity={o} />; })}
        </World>
      </AbsoluteFill>

      <Clouds c={c} f={f} t={t} />
      <YearCorner f={f} t={t} marks={[[222.6, "1880s"], [227.5, "1885"], [243.7, "1871"], [254.9, "Nov 7, 1885"], [270.1, "1890s"], [323.5, "1896–1914"], [329.6, "1905"]]} />

      {/* casi vacía */}
      <HandNote f={f} t={t} t0={223.8} t1={225.6} x={960} y={860} text="almost empty" size={110} />
      <Tag c={c} f={f} t={t} lon={-123.1} lat={47.6} t0={227.6} t1={233.6} text="Pacific" bg="#2f6fb8" size={24} />
      {vis(t, 229.7, 234.0) && <Train c={c} f={f} pts={CPR} k={interpolate(t, [229.7, 234.0], [0.25, 0.75], clamp)} empty />}
      {vis(t, 231.4, 233.9) && <div style={{ position: "absolute", left: 1460, top: 250, transform: `translate(-50%,-50%) scale(${pop(f, 231.4, 9) * fadeOut(t, 233.9)})`, fontFamily: SANS, fontWeight: 900, fontSize: 70, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.6)" }}>PASSENGERS: <span style={{ color: "#ffd23a" }}>0</span></div>}
      <Portal2 c={c} t={t} lon={-100} lat={50.5} t0={230.4} t1={233.6} src="v5/img/g_empty_train.png" maxR={260} dx={-480} dy={-80} />
      {/* prefieren EE. UU. */}
      {[0, 1, 2, 3, 4].map((i) => <Route key={i} c={c} t={t} f={f} from={[-8 + i * 6, 50 + (i % 2) * 3]} to={[-74, 40.7]} t0={234.1 + i * 0.12} t1={236.4} dur={1.4} bend={160 + i * 30} ship={i === 2} />)}
      <Flag c={c} f={f} t={t} cc="us" lon={-80} lat={37.5} t0={234.9} t1={236.4} w={90} />
      <Tag c={c} f={f} t={t} lon={-80} lat={33.5} t0={235.0} t1={236.4} text="United States" bg="#111" size={28} />
      <Stamp f={f} t={t} t0={237.6} t1={240.5} x={560} y={330} text="TOO COLD" color="#2f7fd6" rot={-12} />
      <Stamp f={f} t={t} t0={238.5} t1={240.5} x={1380} y={430} text="TOO FAR" rot={8} />
      <Stamp f={f} t={t} t0={239.3} t1={240.5} x={900} y={760} text="TOO UNKNOWN" color="#6b3fa0" rot={-4} />
      {/* la apuesta: un dado que rueda sobre la vía */}
      {vis(t, 240.8, 243.5) && (() => { const k = interpolate(t, [240.8, 242.4], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }); return (
        <div style={{ position: "absolute", left: 300 + 1300 * k, top: 640, width: 150, height: 150, transform: `translate(-50%,-50%) rotate(${k * 720}deg)`, background: "#fff", borderRadius: 24, border: "5px solid #222", boxShadow: "0 16px 30px rgba(0,0,0,.45)", opacity: fadeOut(t, 243.5) }}>
          {[[30, 30], [120, 120], [75, 75], [120, 30], [30, 120]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x - 14, top: y - 14, width: 28, height: 28, borderRadius: 14, background: "#b22" }} />)}
        </div>); })()}
      <BigWord f={f} t={t} t0={241.8} t1={243.5} text={<span>A <span style={{ color: "#ffd23a" }}>GAMBLE</span></span>} y={190} />
      {/* Columbia Británica */}
      <Tag c={c} f={f} t={t} lon={-124} lat={57} t0={244.2} t1={249.6} text="British Columbia" bg="#2a9d8f" size={30} />
      {vis(t, 246.4, 249.6) && <div style={{ position: "absolute", left: 1350, top: 320, transform: `translate(-50%,-50%) rotate(3deg) scale(${pop(f, 246.4, 10) * fadeOut(t, 249.6)})`, width: 520, padding: "28px 34px", background: "#fbf6e6", border: "4px solid #fff", boxShadow: "0 16px 34px rgba(0,0,0,.45)", fontFamily: HAND, fontSize: 52, color: "#26314a", lineHeight: 1.15 }}>
        Promise, 1871:<br />a railway to the East<br /><span style={{ color: "#b22" }}>within ten years</span>
      </div>}
      <Tag c={c} f={f} t={t} lon={-84} lat={52} t0={251.2} t1={252.4} text="Canadian Shield" bg="#59606e" size={30} />
      <Tag c={c} f={f} t={t} lon={-104} lat={53} t0={252.5} t1={253.5} text="Open Prairies" bg="#8a6a00" size={30} />
      {/* las Rocosas en 3D hasta Craigellachie */}
      {vis(t, 253.6, 260.4) && <Terrain3D tex={tex} name="rockies" t={t} t0={253.6} t1={260.4} label="The Rocky Mountains" font={SANS}
        keys={[[253.6, -112.5, 51.2, 0.9, -117, 51.1, 0.3], [256.5, -116, 51.3, 0.75, -119.5, 51.0, 0.25], [260.4, -118.0, 50.95, 0.55, -119.4, 50.98, 0.2]]}>
        {vis(t, 257.7, 260.3) && <div style={{ position: "absolute", left: 960, top: 230, transform: `translate(-50%,-50%) scale(${pop(f, 259.1, 9) * fadeOut(t, 260.3)})`, fontFamily: HAND, fontSize: 104, color: "#fff", textShadow: "0 4px 16px rgba(0,0,0,.6)" }}>Craigellachie</div>}
      </Terrain3D>}
      <Portal2 c={c} t={t} lon={-118.6} lat={51} t0={260.3} t1={263.2} src="v5/img/g_last_spike.png" maxR={280} dx={-520} dy={-60} />
      <LastSpike f={f} t={t} />
      {/* de océano a océano */}
      <Tag c={c} f={f} t={t} lon={-128} lat={47} t0={264.6} t1={266.5} text="Pacific" bg="#2f6fb8" size={28} />
      <Tag c={c} f={f} t={t} lon={-60} lat={42} t0={265.4} t1={266.5} text="Atlantic" bg="#2f6fb8" size={28} />
      <BigWord f={f} t={t} t0={265.0} t1={266.6} text={<span>OCEAN TO <span style={{ color: "#ffd23a" }}>OCEAN</span></span>} y={900} size={96} />
      {/* un tren y nadie que lo use */}
      {vis(t, 266.7, 270.0) && <Train c={c} f={f} pts={CPR} k={interpolate(t, [266.7, 270.0], [0.35, 0.62], clamp)} cars={4} empty />}
      <HandNote f={f} t={t} t0={268.7} t1={270.0} x={960} y={860} text="…and nobody to ride it" size={92} />
      {/* vender las Praderas como un producto */}
      {vis(t, 272.8, 275.2) && (() => { const [x, y] = proj(c, ...P(-104, 52)); const sw = Math.sin(f / 7) * 8; return (
        <div style={{ position: "absolute", left: x + 160, top: y - 220, transformOrigin: "0 0", transform: `rotate(${18 + sw}deg) scale(${pop(f, 273.62, 8) * fadeOut(t, 275.2)})` }}>
          <div style={{ width: 4, height: 90, background: "#fff", marginLeft: 30 }} />
          <div style={{ background: "#ffd23a", border: "5px solid #fff", borderRadius: "14px 40px 40px 14px", padding: "18px 40px", fontFamily: SANS, fontWeight: 900, fontSize: 66, color: "#1b1b1b", boxShadow: "0 14px 30px rgba(0,0,0,.45)" }}>FREE<div style={{ fontSize: 26 }}>160 ACRES</div></div>
        </div>); })()}
      <BigWord f={f} t={t} t0={274.2} t1={275.3} text={<span>LIKE A <span style={{ color: "#ffd23a" }}>PRODUCT</span></span>} y={170} />
      {/* afiches en 12 idiomas sobre Europa */}
      <Route c={c} t={t} f={f} from={[-75.7, 45.4]} to={[0, 52]} t0={275.5} t1={279.9} dur={1.2} bend={-200} ship={false} />
      {LANGS.map(([w, lo, la], i) => <Tag key={i} c={c} f={f} t={t} lon={lo} lat={la} t0={276.6 + i * 0.2} t1={279.9} text={w} bg={i % 3 === 0 ? "#b23a2a" : i % 3 === 1 ? "#2a7d2e" : "#1b2433"} size={20} />)}
      {vis(t, 278.6, 279.9) && <div style={{ position: "absolute", left: 960, top: 940, transform: `translate(-50%,-50%) scale(${pop(f, 278.82, 9) * fadeOut(t, 279.9)})`, fontFamily: SANS, fontWeight: 900, fontSize: 84, color: "#fff", textShadow: "0 4px 16px rgba(0,0,0,.6)" }}><span style={{ color: "#ffd23a" }}>12</span> LANGUAGES</div>}
      <Portal2 c={c} t={t} lon={-104} lat={52} t0={280.3} t1={285.3} src="desk/lastbestwest.jpg" maxR={330} dx={430} dy={-20} caption="Canada West poster" />
      <BigWord f={f} t={t} t0={283.1} t1={285.3} text={<span>FREE FARMS FOR THE <span style={{ color: "#ffd23a" }}>MILLIONS</span></span>} y={985} size={70} />
      {/* agentes por Europa */}
      {[["Britain", -2, 53, 286.74], ["Scandinavia", 15, 61, 287.44], ["Germany", 10, 51, 288.44], ["Eastern Europe", 31, 49, 289.05]].map(([n, lo, la, t0], i) => (
        <React.Fragment key={i}>
          <Icon c={c} f={f} t={t} src="people" lon={lo as number} lat={la as number} t0={t0 as number} t1={292.6} size={90} />
          <Tag c={c} f={f} t={t} lon={lo as number} lat={(la as number) - 3} t0={(t0 as number) + 0.1} t1={292.6} text={n as string} bg="#111" size={22} />
        </React.Fragment>
      ))}
      <Portal2 c={c} t={t} lon={25} lat={50} t0={289.9} t1={293.2} src="v5/img/h_lantern.png" maxR={300} dx={-560} dy={-40} caption="Lantern slides" />
      {/* Sifton */}
      {vis(t, 293.5, 314.4) && (
        <div style={{ position: "absolute", left: 360, top: 520, transform: `translate(-50%,-50%) rotate(-3deg) scale(${pop(f, 293.65, 11) * fadeOut(t, 314.4)})`, background: "#fbf7ec", padding: "16px 16px 70px", boxShadow: "0 20px 44px rgba(0,0,0,.55)" }}>
          <div style={{ width: 380, height: 464, overflow: "hidden" }}><Img src={sf("hand/sifton.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + (t - 293.5) * 0.006})` }} /></div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, textAlign: "center", fontFamily: HAND, fontSize: 40, color: "#26314a", lineHeight: 1 }}>Clifford Sifton<div style={{ fontSize: 28 }}>Minister of the Interior</div></div>
        </div>
      )}
      {vis(t, 298.7, 305.9) && <>
        {[["City clerks", 300.4, false], ["Farmers", 301.73, true]].map(([n, t0, ok], i) => (
          vis(t, t0 as number, 305.9) ? (
            <div key={i} style={{ position: "absolute", left: 1000 + i * 480, top: 400, transform: `translate(-50%,-50%) scale(${pop(f, t0 as number, 9) * fadeOut(t, 305.9)})`, textAlign: "center" }}>
              <div style={{ width: 300, height: 300, borderRadius: 24, background: "rgba(14,16,24,.85)", border: "5px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <Img src={sf(`icons/${ok ? "farmer" : "people"}.png`)} style={{ width: 200, filter: ok ? undefined : "grayscale(1)" }} />
                <div style={{ position: "absolute", right: -26, top: -26, width: 86, height: 86, borderRadius: 43, background: ok ? "#2a9d3a" : "#d42a1e", border: "5px solid #fff", color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 56, lineHeight: "76px" }}>{ok ? "✓" : "✕"}</div>
              </div>
              <div style={{ marginTop: 14, fontFamily: SANS, fontWeight: 900, fontSize: 40, color: "#fff", textShadow: "0 3px 10px rgba(0,0,0,.6)", textTransform: "uppercase" }}>{n}</div>
            </div>
          ) : null
        ))}
        <HandNote f={f} t={t} t0={303.0} t1={305.9} x={1240} y={760} text="hard winters, hard work" size={74} />
      </>}
      <HandNote f={f} t={t} t0={316.7} t1={319.0} x={1240} y={240} text="what Canada was really after…" size={80} />
      <Tag c={c} f={f} t={t} lon={-75.7} lat={44.6} t0={293.9} t1={298.4} text="Ottawa" bg="#111" size={28} />
      <Stamp f={f} t={t} t0={296.7} t1={298.5} x={1300} y={300} text="MINISTER OF THE INTERIOR" color="#1b2433" rot={-5} />
      <Stamp f={f} t={t} t0={300.9} t1={302.4} x={1000} y={400} text="NO" rot={-14} />
      {vis(t, 306.0, 314.4) && (
        <div style={{ position: "absolute", left: 1180, top: 520, transform: `translate(-50%,-50%) rotate(1.5deg) scale(${pop(f, 306.1, 12) * fadeOut(t, 314.4)})`, width: 980, padding: "40px 54px", background: "linear-gradient(#fbf6e6,#efe4c4)", border: "4px solid #fff", boxShadow: "0 20px 44px rgba(0,0,0,.5)" }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 24, color: "#7a6a4a", marginBottom: 14 }}>CLIFFORD SIFTON, 1922</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 50, color: "#26314a", lineHeight: 1.3 }}>
            {QUOTE.map(([w, tt], i) => <span key={i} style={{ opacity: t >= tt ? 1 : 0.12, color: ["peasant", "sheep-skin", "soil,", "half-dozen"].includes(w) && t >= tt ? "#a3311f" : undefined }}>{w} </span>)}
          </div>
        </div>
      )}
      {/* no trabajadores: familias con raíces */}
      {vis(t, 314.5, 322.1) && <>
        <BigWord f={f} t={t} t0={314.6} t1={316.0} text={<span style={{ fontFamily: HAND, fontWeight: 700 }}>harsh today…</span>} y={200} size={100} />
        <Stamp f={f} t={t} t0={319.2} t1={322.0} x={640} y={420} text="WORKERS" color="#59606e" rot={-8} />
        {t > 319.4 && <div style={{ position: "absolute", left: 470, top: 420, width: 340, height: 8, background: "#d42a1e", transform: `rotate(-8deg) scaleX(${interpolate(t, [319.4, 319.8], [0, 1], clamp)})`, transformOrigin: "left", opacity: fadeOut(t, 322.0) }} />}
        {vis(t, 320.2, 322.1) && (() => { const g = interpolate(t, [320.6, 321.9], [0, 1], { ...clamp, easing: ease }); return (
          <div style={{ position: "absolute", left: 1320, top: 420, transform: `translate(-50%,-50%) scale(${pop(f, 320.21, 9) * fadeOut(t, 322.1)})` }}>
            <div style={{ display: "flex", gap: 6 }}>{["farmer", "people", "farmer"].map((s, i) => <Img key={i} src={sf(`icons/${s}.png`)} style={{ width: 120 }} />)}</div>
            <svg width={380} height={220} style={{ position: "absolute", left: 0, top: 150 }}>{[60, 130, 190, 250, 320].map((x, i) => <path key={i} d={`M${x},0 q${(i % 2 ? 20 : -20)},60 ${(i - 2) * 8},120 t${(i % 2 ? -10 : 10)},90`} stroke="#c9a46a" strokeWidth={6} fill="none" strokeDasharray={260} strokeDashoffset={260 * (1 - g)} />)}</svg>
            <div style={{ position: "absolute", left: 190, top: 400, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 900, fontSize: 50, color: "#fff", textShadow: "0 3px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>FAMILIES <span style={{ color: "#9be05a" }}>+ ROOTS</span></div>
          </div>); })()}
      </>}
      {/* funcionó: 3 millones */}
      <BigWord f={f} t={t} t0={322.6} t1={323.6} text={<span>IT <span style={{ color: "#9be05a" }}>WORKED</span></span>} y={540} size={120} />
      {[0, 1, 2, 3, 4, 5].map((i) => <Route key={i} c={c} t={t} f={f} from={[-6 + i * 7, 50 + (i % 3) * 3]} to={[i % 2 ? -63.6 : -71.2, i % 2 ? 44.6 : 46.8]} t0={323.6 + i * 0.15} t1={329.4} dur={1.5} bend={-160 - i * 20} ship={i % 2 === 0} />)}
      {vis(t, 326.5, 329.4) && <div style={{ position: "absolute", left: 960, top: 940, transform: `translate(-50%,-50%) scale(${pop(f, 326.59, 10) * fadeOut(t, 329.4)})`, fontFamily: SANS, fontWeight: 900, fontSize: 104, color: "#fff", textShadow: "0 5px 18px rgba(0,0,0,.6)", fontVariantNumeric: "tabular-nums" }}>
        {Math.round(interpolate(t, [326.6, 328.2], [0, 3000000], { ...clamp, easing: Easing.out(Easing.cubic) })).toLocaleString("en-US")} <span style={{ fontSize: 46 }}>IMMIGRANTS</span>
      </div>}
      <Tag c={c} f={f} t={t} lon={-106} lat={55.5} t0={329.7} t1={335.2} text="Saskatchewan" bg="#2a7d2e" size={28} />
      <Tag c={c} f={f} t={t} lon={-114.5} lat={56.5} t0={330.5} t1={335.2} text="Alberta" bg="#2a7d2e" size={28} />
      <Stamp f={f} t={t} t0={332.5} t1={335.2} x={1500} y={260} text="PROVINCES · 1905" color="#2a7d2e" rot={6} />
      <Vignette />
    </AbsoluteFill>
  );
};
