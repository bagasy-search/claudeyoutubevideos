// Capítulo 5 (5:35.4 → 8:00.5): el mismo auge; la diferencia está en un papel: la Dominion Lands Act.
// La grilla de agrimensura se dibuja sobre el mapa y la cámara baja hasta un cuarto de sección.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { P, proj, pop, fadeOut, vis, ease, clamp, Region, Tag, Icon, Flag, BigWord, Route, Clouds, SANS, HAND, geo, FPS } from "../Main";
import { K, camOf, blurOf, World, YearCorner, Portal2, HandNote, Rail, Vignette } from "./common";

import { sf } from "../sf";
const PRA = ["Alberta", "Saskatchewan", "Manitoba"].map((n) => geo.prov[n].d).join("");
const CPR_PR: [number, number][] = [[-97.1, 49.9], [-104.6, 50.4], [-114.1, 51.05]];
const Q: [number, number] = [-104.2, 50.6]; // el cuarto de sección "nuestro" (cerca de Regina)

const KEYS: K[] = [
  [335.4, -106, 52, 1.3],
  [337.3, -80, 10, 0.4],
  [341.2, -60, 12, 0.42],
  [345.1, -40, 20, 0.44],
  [346.3, -61, -34, 1.2],
  [350.3, -61.5, -34, 1.3],
  [351.6, -104, 52, 1.15],
  [354.5, -104, 52, 1.2],
  [357.0, -80, 10, 0.42],
  [358.0, -80, 10, 0.43],
  [363.5, -104, 52, 1.1],
  [367.5, -104, 52, 1.2],
  [372.3, -105, 51.5, 1.4],
  [373.4, Q[0], Q[1], 3.5],
  [376.4, Q[0], Q[1], 5],
  [379.4, Q[0], Q[1], 7],
  [381.9, Q[0], Q[1], 8],
  [398.4, Q[0], Q[1], 8.6],
  [399.6, 15, 52, 1.1],
  [408.4, 18, 52, 1.15],
  [409.5, -104, 52, 1.1],
  [425.1, -104.5, 51.6, 1.45],
  [435.1, -104.6, 50.45, 5.5],
  [444.2, -104.6, 50.45, 6.2],
  [445.1, -104, 52, 1.3],
  [467.3, -104, 51.6, 1.5],
  [468.1, -104.6, 50.45, 4],
  [480.5, -103, 50.5, 2.2],
];

// grilla de agrimensura: municipios (6 millas) que se dibujan barriendo de este a oeste
const Survey: React.FC<{ t: number; z: number }> = ({ t, z }) => {
  const k = interpolate(t, [369.6, 372.4], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const o = interpolate(t, [369.6, 370.0, 397.5, 398.3], [0, 1, 1, 0], clamp);
  if (o <= 0) return null;
  const [x0, y0] = P(-120, 60), [x1, y1] = P(-95, 49);
  const step = 0.0868 * 30 * 1.0; // ≈ 6 millas en grados de latitud × PPD
  const xs: number[] = [], ys: number[] = [];
  for (let x = x1; x >= x0; x -= step * 1.55) xs.push(x);
  for (let y = y1; y >= y0; y -= step) ys.push(y);
  const reach = x1 - (x1 - x0) * k;
  return (
    <g opacity={o}>
      {xs.filter((x) => x >= reach).map((x, i) => <line key={`v${i}`} x1={x} y1={y0} x2={x} y2={y1} stroke="#fff" strokeOpacity={0.55} strokeWidth={1.4 / z} />)}
      {ys.map((y, i) => <line key={`h${i}`} x1={Math.max(reach, x0)} y1={y} x2={x1} y2={y} stroke="#fff" strokeOpacity={0.55} strokeWidth={1.4 / z} />)}
    </g>
  );
};

// zoom en el municipio: 36 secciones → 4 cuartos → 160 acres
const Township: React.FC<{ f: number; t: number; c: any }> = ({ f, t, c }) => {
  if (!vis(t, 373.3, 398.4)) return null;
  const [cx, cy] = proj(c, ...P(Q[0], Q[1]));
  const ss = interpolate(t, [373.4, 376.4, 379.6, 380.6], [12, 70, 95, 420], { ...clamp, easing: ease }); // lado de una sección
  const s = ss * 6;
  const gx = cx - 2.5 * ss, gy = cy - 2.5 * ss;
  const o = Math.min(interpolate(t, [373.3, 373.8], [0, 1], clamp), fadeOut(t, 398.2));
  const sec = interpolate(t, [376.6, 378.2], [0, 36], clamp);
  const qk = interpolate(t, [380.0, 380.9], [0, 1], { ...clamp, easing: ease });
  const mine = interpolate(t, [381.9, 382.6], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <rect x={gx} y={gy} width={s} height={s} fill="rgba(255,236,150,.18)" stroke="#fff" strokeWidth={5} />
        {Array.from({ length: 36 }).map((_, i) => {
          if (i >= sec) return null;
          const r = Math.floor(i / 6), col = i % 6;
          const x = gx + (r % 2 ? 5 - col : col) * ss, y = gy + (5 - r) * ss;
          return <rect key={i} x={x} y={y} width={ss} height={ss} fill="none" stroke="#fff" strokeWidth={2.5} />;
        })}
        {qk > 0 && (() => { const x = cx - ss / 2, y = cy - ss / 2; return <>
          <line x1={x + ss / 2} y1={y + ss / 2 - (ss / 2) * qk} x2={x + ss / 2} y2={y + ss / 2 + (ss / 2) * qk} stroke="#ffd23a" strokeWidth={6} />
          <line x1={x + ss / 2 - (ss / 2) * qk} y1={y + ss / 2} x2={x + ss / 2 + (ss / 2) * qk} y2={y + ss / 2} stroke="#ffd23a" strokeWidth={6} />
          {mine > 0 && <rect x={x} y={y + ss / 2} width={ss / 2} height={ss / 2} fill="#9be05a" fillOpacity={0.55 * mine} stroke="#fff" strokeWidth={6} />}
        </>; })()}
      </svg>
      {vis(t, 373.4, 376.3) && <div style={{ position: "absolute", left: cx, top: Math.min(960, cy + s / 2 + 40), transform: `translate(-50%,0) scale(${pop(f, 373.41, 9)})`, fontFamily: SANS, fontWeight: 900, fontSize: 44, color: "#fff", background: "#111", padding: "6px 18px", borderRadius: 8, border: "3px solid #fff", whiteSpace: "nowrap" }}>TOWNSHIP · 6 × 6 MILES</div>}
      {vis(t, 376.5, 379.3) && <div style={{ position: "absolute", left: 1500, top: 300, transform: `translate(-50%,-50%) scale(${pop(f, 377.65, 9) * fadeOut(t, 379.3)})`, fontFamily: SANS, fontWeight: 900, fontSize: 110, color: "#fff", textShadow: "0 5px 18px rgba(0,0,0,.6)" }}>{Math.round(sec)} <span style={{ fontSize: 44 }}>SECTIONS</span></div>}
      {vis(t, 379.4, 381.8) && <div style={{ position: "absolute", left: 1500, top: 300, transform: `translate(-50%,-50%) scale(${pop(f, 380.51, 9) * fadeOut(t, 381.8)})`, fontFamily: SANS, fontWeight: 900, fontSize: 110, color: "#ffd23a", textShadow: "0 5px 18px rgba(0,0,0,.6)" }}>4 <span style={{ fontSize: 44, color: "#fff" }}>QUARTERS</span></div>}
      {vis(t, 381.9, 385.1) && <div style={{ position: "absolute", left: 1460, top: 330, transform: `translate(-50%,-50%) scale(${pop(f, 383.23, 8) * fadeOut(t, 385.1)})`, textAlign: "center", fontFamily: SANS, fontWeight: 900, color: "#fff", textShadow: "0 5px 18px rgba(0,0,0,.6)" }}>
        <div style={{ fontSize: 160, color: "#9be05a" }}>160</div><div style={{ fontSize: 50 }}>ACRES</div>
      </div>}
    </AbsoluteFill>
  );
};

// el trato: checklist que se tilda al ritmo de la voz
const DEAL: [string, number][] = [["Pay a $10 fee", 386.79], ["Live on it 3 years", 388.27], ["Build a house", 390.11], ["Break the ground & farm", 391.11]];
const Deal: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  if (!vis(t, 385.3, 398.3)) return null;
  const s = pop(f, 385.4, 12) * fadeOut(t, 398.3);
  const ok = t > 393.6;
  return (
    <div style={{ position: "absolute", left: 1400, top: 520, transform: `translate(-50%,-50%) rotate(1.5deg) scale(${s})`, width: 720, padding: "34px 44px", background: "linear-gradient(#fbf6e6,#efe4c4)", border: "4px solid #fff", boxShadow: "0 20px 44px rgba(0,0,0,.5)" }}>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 30, color: "#7a6a4a", marginBottom: 10 }}>DOMINION LANDS ACT · THE DEAL</div>
      {DEAL.map(([s2, tt], i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: HAND, fontSize: 56, color: "#26314a", opacity: t >= tt - 0.1 ? 1 : 0.25 }}>
          <div style={{ width: 46, height: 46, border: "4px solid #26314a", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#2a9d3a", fontSize: 52, fontFamily: SANS, fontWeight: 900 }}>{t >= tt + 0.3 ? "✓" : ""}</div>{s2}
        </div>
      ))}
      {ok && <div style={{ position: "absolute", right: -40, bottom: -50, transform: `rotate(-12deg) scale(${interpolate(f - 393.6 * FPS, [0, 5], [2.2, 1], { ...clamp, easing: Easing.out(Easing.cubic) })})`, border: "8px solid #2a9d3a", color: "#2a9d3a", background: "rgba(255,250,240,.9)", fontFamily: SANS, fontWeight: 900, fontSize: 64, padding: "0 24px", borderRadius: 10 }}>YOURS · FREE</div>}
    </div>
  );
};

export const Ch5: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const f = t * FPS;
  const c = camOf(KEYS, t);
  const blur = blurOf(KEYS, t, FPS);
  const at = (t0: number, d = 0.35) => interpolate(t, [t0, t0 + d], [0, 1], clamp);
  const off = (t1: number, d = 0.4) => interpolate(t, [t1, t1 + d], [1, 0], clamp);
  const wheatGold = interpolate(t, [420.7, 424.0], [0, 1], { ...clamp, easing: ease }) * off(425.0);
  return (
    <AbsoluteFill style={{ background: "#2f6fb8", overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id="mb5"><feGaussianBlur stdDeviation={blur.toFixed(2)} /></filter></svg>
      <AbsoluteFill style={{ filter: blur > 0.6 ? "url(#mb5)" : undefined }}>
        <World c={c} modern={0}>
          <Region d={PRA} op={at(335.6) * off(337.2) + at(351.7) * off(354.4) + at(363.6) * off(369.5)} z={c.z} color="#e0c64a" />
          <Region d={geo.prov.Pampas.d} op={at(346.3) * off(350.4)} z={c.z} color="#9ad13a" />
          <Region d={PRA} op={wheatGold} z={c.z} color="#f2c230" />
          <Rail pts={CPR_PR} t={t} t0={335.4} dur={0.1} z={c.z} op={at(409.6) * off(480.0)} color="#b23a2a" />
          <Survey t={t} z={c.z} />
          {/* pueblos cada pocas millas a lo largo de la vía */}
          {Array.from({ length: 14 }).map((_, i) => { const lo = -98 + -15 * (i / 13), la = 49.95 + (i / 13) * 1.0; const [x, y] = P(lo, la); const o = at(435.2 + i * 0.1, 0.25) * off(444.3); return o > 0 ? <circle key={i} cx={x} cy={y} r={6 / c.z} fill="#ffd23a" stroke="#fff" strokeWidth={2 / c.z} opacity={o} /> : null; })}
        </World>
      </AbsoluteFill>

      <Clouds c={c} f={f} t={t} />
      <YearCorner f={f} t={t} marks={[[335.6, "1900s"], [363.6, "1872"], [398.6, "1900"], [416.9, "1909"], [425.2, "1900s"]]} />

      {/* el mismo auge */}
      <BigWord f={f} t={t} t0={336.4} t1={337.9} text={<span>BOOMING THE <span style={{ color: "#ffd23a" }}>SAME WAY</span></span>} y={170} size={90} />
      <Icon c={c} f={f} t={t} src="wheat" lon={-104} lat={52} t0={338.15} t1={345.2} size={96} dx={-50} />
      <Icon c={c} f={f} t={t} src="wheat" lon={-61} lat={-34} t0={338.3} t1={345.2} size={96} dx={-50} />
      <Icon c={c} f={f} t={t} src="cow" lon={-104} lat={52} t0={339.11} t1={345.2} size={110} dx={50} />
      <Icon c={c} f={f} t={t} src="cow" lon={-61} lat={-34} t0={339.25} t1={345.2} size={110} dx={50} />
      <Route c={c} t={t} f={f} from={[-58.4, -34.6]} to={[-4, 50]} t0={340.5} t1={345.2} dur={1.8} bend={-450} />
      <Route c={c} t={t} f={f} from={[-63.6, 44.6]} to={[-4, 51]} t0={340.7} t1={345.2} dur={1.6} bend={180} />
      <Flag c={c} f={f} t={t} cc="gb" lon={-2} lat={53} t0={342.4} t1={345.2} w={84} />
      {[[0, 54], [4, 52], [-6, 55], [2, 50.5], [-3, 57]].map(([lo, la], i) => <Icon key={i} c={c} f={f} t={t} src="people" lon={lo} lat={la} t0={344.1 + i * 0.1} t1={345.2} size={64} />)}
      <Tag c={c} f={f} t={t} lon={-2} lat={47.5} t0={344.4} t1={345.2} text="Factory workers" bg="#111" size={24} />
      {/* exportadores */}
      {vis(t, 346.4, 350.4) && <div style={{ position: "absolute", left: 1450, top: 300, display: "flex", gap: 16, transform: `translate(-50%,-50%) scale(${fadeOut(t, 350.4)})` }}>
        {[["wheat", 348.71], ["wheat", 349.25], ["cow", 349.69]].map(([s, tt], i) => t >= (tt as number) ? <div key={i} style={{ textAlign: "center", transform: `scale(${pop(f, tt as number, 8)})` }}><Img src={sf(`icons/${s}.png`)} style={{ width: 140, filter: i === 1 ? "hue-rotate(-25deg) saturate(1.5)" : undefined }} /><div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 30, color: "#fff", textShadow: "0 3px 8px rgba(0,0,0,.6)" }}>{["WHEAT", "CORN", "BEEF"][i]}</div></div> : null)}
      </div>}
      <Tag c={c} f={f} t={t} lon={-61} lat={-29.5} t0={346.4} t1={350.4} text="Top exporter" bg="#e3261c" size={30} />
      <Tag c={c} f={f} t={t} lon={-104} lat={57} t0={352.0} t1={354.5} text="Top exporter · wheat" bg="#b8860b" size={30} />
      {vis(t, 354.5, 357.9) && <div style={{ position: "absolute", left: 960, top: 540, transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        {[["SAME LAND", 354.59], ["SAME PEOPLE", 355.57], ["SAME CUSTOMERS", 356.45]].map(([w, tt], i) => t >= (tt as number) ? <div key={i} style={{ transform: `rotate(${i % 2 ? 2 : -2}deg) scale(${pop(f, tt as number, 8) * fadeOut(t, 357.9)})`, background: "#2a7d2e", color: "#fff", border: "5px solid #fff", borderRadius: 10, padding: "6px 30px", fontFamily: SANS, fontWeight: 900, fontSize: 70, boxShadow: "0 12px 26px rgba(0,0,0,.45)" }}>{w}</div> : null)}
      </div>}
      {/* un papel */}
      {vis(t, 359.5, 363.5) && (() => { const k = interpolate(t, [361.4, 362.6], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) }); return (
        <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) rotate(${-8 + 6 * k}deg) scale(${0.2 + 0.8 * k})`, opacity: Math.min(k * 2, fadeOut(t, 363.5)), width: 420, height: 540, background: "linear-gradient(#fbf6e6,#e8dcb8)", border: "4px solid #fff", boxShadow: "0 24px 50px rgba(0,0,0,.55)", padding: 30 }}>
          {Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ height: 8, background: "#c9bd9a", margin: "20px 0", width: `${70 + (i * 37) % 30}%` }} />)}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 64, color: "#b22" }}>?</div>
        </div>); })()}
      <BigWord f={f} t={t} t0={359.8} t1={361.3} text={<span>ONE <span style={{ color: "#ffd23a" }}>DIFFERENCE</span></span>} y={170} />
      <Portal2 c={c} t={t} lon={-104} lat={52} t0={364.6} t1={369.4} src="desk/dla_map.jpg" maxR={320} dx={460} dy={-40} caption="Dominion Lands Act" />
      <HandNote f={f} t={t} t0={367.7} t1={369.5} x={620} y={250} text="before a single settler…" size={76} />
      <Tag c={c} f={f} t={t} lon={-108} lat={57.5} t0={370.0} t1={372.8} text="A giant grid" bg="#111" size={34} />
      <Township f={f} t={t} c={c} />
      <Deal f={f} t={t} />
      {vis(t, 395.6, 398.3) && <div style={{ position: "absolute", left: 480, top: 330, display: "flex", flexDirection: "column", gap: 18 }}>
        {[["NOT RENTED", 395.77], ["NOT BORROWED", 396.67]].map(([w, tt], i) => t >= (tt as number) ? <div key={i} style={{ transform: `rotate(${-6 + i * 4}deg) scale(${pop(f, tt as number, 8) * fadeOut(t, 398.3)})`, fontFamily: SANS, fontWeight: 900, fontSize: 56, color: "#fff", background: "#59606e", border: "4px solid #fff", borderRadius: 8, padding: "4px 20px", textDecoration: "line-through", textDecorationColor: "#ff5a36", textDecorationThickness: 6 }}>{w}</div> : null)}
        {t >= 397.39 && <div style={{ transform: `scale(${pop(f, 397.39, 7) * fadeOut(t, 398.3)})`, fontFamily: SANS, fontWeight: 900, fontSize: 96, color: "#9be05a", textShadow: "0 5px 16px rgba(0,0,0,.6)" }}>YOURS.</div>}
      </div>}
      {/* imaginá: un granjero de Ucrania o Noruega */}
      {[["Ukraine", 31, 49, 399.87], ["Norway", 9, 61, 400.47]].map(([n, lo, la, tt], i) => (
        <React.Fragment key={i}>
          <Icon c={c} f={f} t={t} src="farmer" lon={lo as number} lat={la as number} t0={tt as number} t1={408.4} size={120} />
          <Tag c={c} f={f} t={t} lon={lo as number} lat={(la as number) - 3.6} t0={(tt as number) + 0.1} t1={408.4} text={n as string} bg="#111" size={28} />
        </React.Fragment>
      ))}
      <Portal2 c={c} t={t} lon={20} lat={55} t0={401.0} t1={405.4} src="desk/immigrants.jpg" maxR={300} dx={-560} dy={30} caption="Europe, 1900" />
      {vis(t, 402.4, 405.4) && <div style={{ position: "absolute", left: 1440, top: 820, transform: `translate(-50%,-50%) scale(${pop(f, 402.55, 9) * fadeOut(t, 405.4)})`, fontFamily: SANS, fontWeight: 900, fontSize: 66, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.6)" }}>YOU OWN: <span style={{ color: "#ff6a5a" }}>NOTHING</span></div>}
      {vis(t, 405.4, 408.4) && (() => { const g = interpolate(t, [405.5, 407.8], [0.2, 1.6], { ...clamp, easing: ease }); return (
        <div style={{ position: "absolute", left: 1400, top: 560, transform: `translate(-50%,-50%) scale(${g * fadeOut(t, 408.4)})`, width: 260, height: 260, background: "rgba(155,224,90,.55)", border: "6px solid #fff", boxShadow: "0 0 40px rgba(155,224,90,.8)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 36, color: "#fff" }}>A FARM OF YOUR OWN</div>); })()}
      {vis(t, 409.5, 411.8) && <div style={{ position: "absolute", left: 960, top: 940, transform: `translate(-50%,-50%) scale(${pop(f, 409.51, 9) * fadeOut(t, 411.8)})`, fontFamily: SANS, fontWeight: 900, fontSize: 70, color: "#fff", whiteSpace: "nowrap", textShadow: "0 4px 16px rgba(0,0,0,.6)" }}>HUNDREDS OF <span style={{ color: "#ffd23a" }}>THOUSANDS</span> OF FAMILIES</div>}
      {Array.from({ length: 40 }).map((_, i) => <Icon key={i} c={c} f={f} t={t} src={i % 3 ? "farmhouse" : "farmer"} lon={-118 + ((i * 37) % 100) / 100 * 21} lat={49.6 + ((i * 53) % 100) / 100 * 5} t0={409.6 + i * 0.04} t1={414.9} size={46} />)}
      {/* casas de tepe, luego de madera */}
      <Portal2 c={c} t={t} lon={-106} lat={51} t0={411.9} t1={415.0} src="v5/img/j_sod_house.png" maxR={300} dx={-480} dy={-60} caption="Sod house" />
      <Portal2 c={c} t={t} lon={-102} lat={51} t0={413.3} t1={416.6} src="desk/homestead.jpg" maxR={260} dx={470} dy={-80} caption="Then wood" />
      <Portal2 c={c} t={t} lon={-104} lat={51.5} t0={416.8} t1={421.0} src="v5/img/j_marquis.png" maxR={300} dx={470} dy={-40} caption="Marquis wheat · 1909" />
      {vis(t, 419.5, 421.0) && <div style={{ position: "absolute", left: 420, top: 300, transform: `translate(-50%,-50%) scale(${pop(f, 419.53, 9) * fadeOut(t, 421.0)})`, fontFamily: SANS, fontWeight: 900, fontSize: 60, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.6)", textAlign: "center" }}>RIPENS <span style={{ color: "#9be05a" }}>FASTER</span><br />THAN THE <span style={{ color: "#8fd0ff" }}>FROST</span></div>}
      <BigWord f={f} t={t} t0={422.4} t1={425.0} text={<span>A BREADBASKET OF THE <span style={{ color: "#ffd23a" }}>WORLD</span></span>} y={950} size={74} />
      {/* dueños que mejoran su tierra */}
      {[["drain", 430.07], ["fence", 430.79], ["machinery", 431.43], ["trees", 432.35], ["barn", 433.25]].map(([w, tt], i) => vis(t, tt as number, 434.9) ? (
        <div key={i} style={{ position: "absolute", left: 320 + i * 320, top: 860, transform: `translate(-50%,-50%) scale(${pop(f, tt as number, 8) * fadeOut(t, 434.9)})`, textAlign: "center" }}>
          <div style={{ width: 150, height: 150, borderRadius: 75, background: "rgba(14,16,24,.85)", border: "5px solid #ffd23a", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width={90} height={90} viewBox="0 0 90 90" fill="none" stroke="#ffd23a" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">{[<path key="a" d="M8,30 q12,-12 24,0 t24,0 t24,0 M8,52 q12,-12 24,0 t24,0 t24,0" />, <path key="b" d="M14,80 V18 M38,80 V18 M62,80 V18 M6,36 H76 M6,62 H76" />, <g key="c"><circle cx={24} cy={64} r={16} /><circle cx={68} cy={70} r={10} /><path d="M24,48 V20 H56 L66,58" /></g>, <path key="d" d="M45,8 L78,62 H12 Z M45,62 V84" />, <path key="e" d="M10,40 L45,12 L80,40 V82 H10 Z M34,82 V56 H56 V82" />][i]}</svg></div>
          <div style={{ marginTop: 8, fontFamily: SANS, fontWeight: 900, fontSize: 30, color: "#fff", textShadow: "0 3px 8px rgba(0,0,0,.6)", textTransform: "uppercase" }}>{w}</div>
        </div>) : null)}
      <BigWord f={f} t={t} t0={426.2} t1={429.8} text={<span>OWNED → <span style={{ color: "#9be05a" }}>IMPROVED</span></span>} y={170} />
      {/* pueblos: elevador, escuela, iglesia, almacén */}
      {[["elevator", 438.81, "v5/img/k_elevators.png"], ["school", 439.73, "v5/img/p_school.png"], ["church", 440.59, "desk/homestead.jpg"], ["general store", 441.17, "desk/lastbestwest.jpg"]].map(([w, tt], i) => vis(t, tt as number, 444.2) ? (
        <div key={i} style={{ position: "absolute", left: 300 + i * 440, top: 260, transform: `translate(-50%,-50%) rotate(${i % 2 ? 3 : -3}deg) scale(${pop(f, tt as number, 9) * fadeOut(t, 444.2)})`, background: "#111", color: "#fff", border: "4px solid #fff", borderRadius: 10, padding: "10px 24px", fontFamily: SANS, fontWeight: 900, fontSize: 40, textTransform: "uppercase" }}>{w as string}</div>) : null)}
      <Tag c={c} f={f} t={t} lon={-104.6} lat={50.3} t0={435.4} t1={444.2} text="A town every few miles" bg="#b8860b" size={26} />
      <HandNote f={f} t={t} t0={442.8} t1={444.6} x={960} y={900} text="built by owners, for owners" size={90} />
      {/* la vida dura */}
      <Portal2 c={c} t={t} lon={-104} lat={52} t0={445.2} t1={452.4} src="v5/img/j_sod_house.png" maxR={2200} />
      <BigWord f={f} t={t} t0={446.3} t1={448.0} text={<span>NOT <span style={{ color: "#ff6a5a" }}>ROMANTIC</span></span>} y={170} />
      <HandNote f={f} t={t} t0={448.4} t1={452.3} x={960} y={930} text="blocks of sod cut straight from the prairie" size={74} />
      <Portal2 c={c} t={t} lon={-104} lat={52} t0={452.4} t1={457.6} src="v5/img/k_winter.png" maxR={2200} />
      {vis(t, 452.6, 457.6) && <div style={{ position: "absolute", left: 1500, top: 360, transform: `translate(-50%,-50%) scale(${pop(f, 453.39, 9) * fadeOut(t, 457.6)})`, fontFamily: SANS, fontWeight: 900, fontSize: 150, color: "#bfe4ff", textShadow: "0 6px 20px rgba(0,0,0,.6)" }}>−40°</div>}
      <HandNote f={f} t={t} t0={455.0} t1={457.6} x={760} y={930} text="straw and dried dung to keep warm" size={70} />
      {vis(t, 457.8, 461.6) && <div style={{ position: "absolute", left: 960, top: 540, transform: "translate(-50%,-50%)", opacity: fadeOut(t, 461.6) }}>
        {Array.from({ length: 10 }).map((_, i) => { const gone = t > 458.4 + i * 0.12 && i % 3 !== 0; return <Img key={i} src={sf("icons/farmer.png")} style={{ position: "absolute", left: (i - 5) * 120, top: -60, width: 100, opacity: gone ? interpolate(t, [458.4 + i * 0.12, 459.4 + i * 0.12], [1, 0], clamp) : 1, transform: `translateX(${gone ? interpolate(t, [458.4 + i * 0.12, 459.6 + i * 0.12], [0, 400], clamp) : 0}px)` }} />; })}
        <div style={{ position: "absolute", left: 0, top: 120, transform: "translateX(-50%)", whiteSpace: "nowrap", fontFamily: SANS, fontWeight: 900, fontSize: 60, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.6)" }}>MANY <span style={{ color: "#ff6a5a" }}>WALKED AWAY</span></div>
      </div>}
      {/* el título con su nombre */}
      {vis(t, 462.4, 468.0) && (
        <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) rotate(-2deg) scale(${pop(f, 462.47, 12) * fadeOut(t, 468.0)})`, width: 900, padding: "40px 60px", background: "linear-gradient(#fbf6e6,#efe4c4)", border: "10px double #7a5a12", boxShadow: "0 24px 50px rgba(0,0,0,.55)", textAlign: "center" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 30, letterSpacing: 6, color: "#7a5a12" }}>DOMINION OF CANADA</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 72, color: "#26314a", margin: "10px 0" }}>Title Deed</div>
          <div style={{ fontFamily: HAND, fontSize: 64, color: "#1b2433", borderBottom: "3px solid #7a5a12", display: "inline-block", minWidth: 500 }}>{t > 466.4 ? "Your own name".slice(0, Math.floor(interpolate(t, [466.4, 467.2], [0, 13], clamp))) : ""}</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 26, color: "#7a6a4a", marginTop: 10 }}>N.E. ¼ · Section 12 · Township 17 · Range 20 · W2</div>
          {t > 463.6 && <div style={{ position: "absolute", right: -30, top: -30, transform: `rotate(14deg) scale(${pop(f, 463.63, 8)})`, border: "7px solid #b22", color: "#b22", background: "rgba(255,250,240,.9)", fontFamily: SANS, fontWeight: 900, fontSize: 38, padding: "4px 16px", borderRadius: 8 }}>NO LANDLORD</div>}
        </div>
      )}
      {/* centinelas de la pradera */}
      {Array.from({ length: 8 }).map((_, i) => { const tt = 469.3 + i * 0.22; if (!vis(t, tt, 480.4)) return null; const [x, y] = proj(c, ...P(-104.6 + (i - 3.5) * 0.9, 50.45 + (i % 2) * 0.02)); const h = 150 * interpolate(t, [tt, tt + 0.5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) }); return (
        <div key={i} style={{ position: "absolute", left: x - 22, top: y - h, width: 44, height: h, background: "linear-gradient(90deg,#9b2d1f,#c2412c)", border: "3px solid #fff", borderBottom: "none", clipPath: "polygon(15% 12%, 50% 0, 85% 12%, 100% 100%, 0 100%)", opacity: fadeOut(t, 480.4) }} />); })}
      <Portal2 c={c} t={t} lon={-104.6} lat={50.45} t0={471.6} t1={476.3} src="v5/img/k_elevators.png" maxR={300} dx={-480} dy={-220} caption="Grain elevator" />
      <HandNote f={f} t={t} t0={472.8} t1={476.4} x={1380} y={230} text="the Prairie Sentinels" size={96} color="#ffd23a" />
      <HandNote f={f} t={t} t0={478.3} t1={480.4} x={960} y={930} text="alone on the horizon" size={86} />
      <Vignette />
    </AbsoluteFill>
  );
};
