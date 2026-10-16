// Capítulo 3 (2:02.1 → 3:42.4): la apuesta por la Pampa, trenes en abanico, 6 millones de europeos,
// Buenos Aires gran ciudad, Colón, subte, "riche comme un Argentin", la edad de oro. A mano, palabra por palabra.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { P, proj, pop, fadeOut, vis, ease, clamp, Region, Tag, Icon, Flag, BigWord, Route, Clouds, SANS, HAND, geo, FPS } from "../Main";
import { K, camOf, blurOf, World, YearCorner, Portal2, MapBar, HandNote, Rail, along, Vignette } from "./common";

import { sf } from "../sf";
const BA: [number, number] = [-58.4, -34.6];
const KEYS: K[] = [
  [122.1, -64, -33, 0.75],
  [123.0, -62, -34, 0.9],
  [126.4, -60, -35, 1.3],
  [127.3, -60.5, -35, 1.32],
  [128.3, -52, -37, 0.95],
  [129.4, -55, -36, 1.05],
  [130.6, -58.4, -34.6, 2.7],
  [132.6, -58.4, -34.6, 3.0],
  [133.4, -60, -34.5, 1.6],
  [135.3, -60.5, -34.5, 1.5],
  [136.5, -82, 9, 0.4],
  [140.6, -82, 9, 0.43],
  [142.8, -38, 10, 0.36],
  [144.4, -37, 8, 0.37],
  [145.6, -61, -35, 1.65],
  [150.2, -61.5, -34.2, 1.9],
  [154.0, -61, -34.6, 2.0],
  [156.5, -61, -34.6, 2.05],
  [157.9, -36, 8, 0.36],
  [162.0, -36, 9, 0.37],
  [166.4, -35, 10, 0.38],
  [167.3, -58.4, -34.6, 3.2],
  [171.4, -58.4, -34.6, 3.5],
  [172.8, -58.6, -34.5, 2.8],
  [179.8, -58.5, -34.55, 3.1],
  [182.5, -58.38, -34.6, 4.0],
  [186.1, -58.38, -34.6, 4.3],
  [187.3, -58.4, -34.6, 4.6],
  [196.9, -58.4, -34.6, 4.9],
  [197.7, -45, -12, 0.95],
  [198.6, -20, 22, 0.95],
  [199.6, 2.35, 48.85, 2.5],
  [205.7, 2.35, 48.85, 2.9],
  [207.1, -61, -33.5, 1.5],
  [215.0, -61, -33.6, 1.85],
  [218.5, -61, -34, 1.45],
  [221.7, -61.2, -34.2, 1.5],
  [222.4, -72, -12, 0.7],
];

// vías en abanico desde Buenos Aires (aprox. trazas reales)
const SPOKES: [number, number][][] = [
  [BA, [-60.6, -32.95], [-64.2, -31.4], [-65.2, -26.8]], // Rosario, Córdoba, Tucumán
  [BA, [-60.9, -34.6], [-64.3, -33.1], [-68.8, -32.9]], // Junín, Mendoza
  [BA, [-59.1, -37.3], [-62.3, -38.7]], // Tandil?, Bahía Blanca
  [BA, [-57.95, -36.5], [-57.55, -38.0]], // Mar del Plata
  [BA, [-61.9, -35.2], [-64.3, -36.6]], // Santa Rosa
  [BA, [-60.7, -31.6], [-59.6, -29.1]], // Santa Fe, norte
];
const SPOKES_1914: [number, number][][] = [
  [[-62.3, -38.7], [-68.06, -38.95]],
  [[-60.6, -32.95], [-61.5, -31.0], [-62.0, -29.0]],
  [[-64.2, -31.4], [-66.3, -33.3], [-68.8, -32.9]],
  [[-60.9, -34.6], [-62.3, -38.7]],
  [[-59.1, -37.3], [-57.55, -38.0]],
  [[-64.3, -36.6], [-64.2, -31.4]],
  [[-60.6, -32.95], [-58.4, -34.6]],
  [[-61.9, -35.2], [-60.9, -34.6], [-60.7, -31.6]],
];
const ORIGINS: { cc: string; name: string; lon: number; lat: number; t0: number }[] = [
  { cc: "it", name: "Italians", lon: 8.9, lat: 44.4, t0: 163.58 },
  { cc: "es", name: "Spaniards", lon: -8.7, lat: 42.2, t0: 164.52 },
  { cc: "fr", name: "French", lon: 0.1, lat: 49.5, t0: 165.38 },
  { cc: "de", name: "Germans", lon: 10, lat: 53.5, t0: 165.9 },
];

// fichas de apuesta que caen sobre la Pampa
const Chips: React.FC<{ c: any; f: number; t: number }> = ({ c, f, t }) => {
  if (!vis(t, 125.9, 135.3)) return null;
  const [x, y] = proj(c, ...P(-61, -35.5));
  const n = Math.floor(interpolate(t, [125.9, 126.8], [0, 6], clamp)) + Math.floor(interpolate(t, [133.4, 134.9], [0, 8], clamp));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: fadeOut(t, 135.3) }}>
      {Array.from({ length: n }).map((_, i) => {
        const col = i % 3 === 0 ? "#e3261c" : i % 3 === 1 ? "#111" : "#ffd23a";
        const drop = interpolate(f - (125.9 + i * 0.14) * FPS, [0, 6], [-160, 0], { ...clamp, easing: Easing.bounce });
        return <div key={i} style={{ position: "absolute", left: -46 + (i > 5 ? 58 : 0), top: -20 - (i % 6) * 13 + (i > 5 ? drop * 0 : drop), width: 92, height: 26, borderRadius: "50%", background: col, border: "4px dashed #fff", boxShadow: "0 6px 0 rgba(0,0,0,.35)" }} />;
      })}
    </div>
  );
};

// "1 de cada 3": 30 personitas, 10 se encienden
const OneInThree: React.FC<{ f: number; t: number; t0: number; t1: number }> = ({ f, t, t0, t1 }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 12) * fadeOut(t, t1);
  return (
    <div style={{ position: "absolute", left: 1440, top: 560, transform: `translate(-50%,-50%) scale(${s})`, background: "rgba(14,16,24,.88)", border: "4px solid #fff", borderRadius: 14, padding: "20px 26px", boxShadow: "0 16px 36px rgba(0,0,0,.5)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 34px)", gap: 8 }}>
        {Array.from({ length: 30 }).map((_, i) => {
          const on = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28].includes(i) && t > t0 + 0.9 + (i % 10) * 0.05;
          return (
            <svg key={i} width={34} height={52} viewBox="0 0 34 52">
              <circle cx={17} cy={10} r={9} fill={on ? "#ffd23a" : "#59606e"} />
              <path d="M3,50 Q3,22 17,22 Q31,22 31,50 Z" fill={on ? "#ffd23a" : "#59606e"} />
            </svg>
          );
        })}
      </div>
      <div style={{ marginTop: 12, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 34, color: "#fff" }}>
        <span style={{ color: "#ffd23a" }}>1 IN 3</span> BORN ABROAD
      </div>
    </div>
  );
};

// tira de fotos que se desliza (avenidas, palacios, tranvías)
const FilmStrip: React.FC<{ f: number; t: number; t0: number; t1: number; items: [string, string, number][] }> = ({ f, t, t0, t1, items }) => {
  if (!vis(t, t0, t1)) return null;
  const k = interpolate(t, [t0, t1], [0, 1], clamp);
  const x = interpolate(k, [0, 1], [1920, -items.length * 560 + 900]);
  const o = Math.min(interpolate(t, [t0, t0 + 0.3], [0, 1], clamp), fadeOut(t, t1, 0.4));
  return (
    <div style={{ position: "absolute", left: x, top: 330, display: "flex", gap: 40, opacity: o, transform: "rotate(-3deg)" }}>
      {items.map(([src, cap, tt], i) => (
        <div key={i} style={{ width: 520, background: "#fbf7ec", padding: "16px 16px 54px", boxShadow: "0 20px 40px rgba(0,0,0,.5)", transform: `rotate(${(i % 2 ? 2 : -2)}deg) scale(${t > tt ? 1 + 0.06 * pop(f, tt, 8) : 1})`, position: "relative" }}>
          <div style={{ width: 488, height: 330, overflow: "hidden" }}>
            <Img src={sf(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: src.startsWith("desk/") ? "grayscale(.2) contrast(1.05)" : undefined, transform: `scale(${1.05 + 0.1 * k})` }} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 8, textAlign: "center", fontFamily: HAND, fontSize: 40, color: "#26314a" }}>{cap}</div>
        </div>
      ))}
    </div>
  );
};

// subte línea A como diagrama + línea de tiempo 1913 / 1919 / 1927
const Subway: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  const t0 = 187.3, t1 = 196.8;
  if (!vis(t, t0, t1)) return null;
  const o = fadeOut(t, t1);
  const k = interpolate(t, [188.0, 191.4], [0, 1], { ...clamp, easing: ease });
  const st = ["Plaza de Mayo", "Congreso", "Once", "Primera Junta"];
  const train = interpolate(t, [190.8, 196.6], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 960, top: 330, transform: `translate(-50%,-50%) scale(${pop(f, t0 + 0.3, 12)})`, width: 1300, height: 220, background: "rgba(250,247,238,.97)", border: "5px solid #fff", borderRadius: 16, boxShadow: "0 18px 40px rgba(0,0,0,.5)" }}>
        <div style={{ position: "absolute", left: 30, top: 14, fontFamily: SANS, fontWeight: 900, fontSize: 30, color: "#1b2433" }}>SUBTE · LÍNEA A · 1913</div>
        <div style={{ position: "absolute", left: 110, top: 120, width: 1080 * k, height: 22, borderRadius: 11, background: "#18a7d8" }} />
        {st.map((s, i) => (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: 110 + i * 360 - 20, top: 111, width: 40, height: 40, borderRadius: 20, background: "#fff", border: "8px solid #18a7d8", transform: `scale(${k * 4 > i ? 1 : 0})` }} />
            <div style={{ position: "absolute", left: 110 + i * 360, top: 166, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 800, fontSize: 24, color: "#1b2433", whiteSpace: "nowrap", opacity: k * 4 > i ? 1 : 0 }}>{s}</div>
          </React.Fragment>
        ))}
        {train > 0 && <div style={{ position: "absolute", left: 110 + 1080 * (0.5 - 0.5 * Math.cos(train * Math.PI * 2.2)) - 50, top: 100, width: 100, height: 40, borderRadius: 10, background: "#e8e1c6", border: "4px solid #7a5a12" }} />}
      </div>
      {[["Buenos Aires", "1913", 191.6, "#18a7d8"], ["Madrid", "1919", 193.42, "#59606e"], ["Tokyo", "1927", 195.08, "#59606e"]].map(([c, y, tt, col], i) => (
        vis(t, tt as number, t1) ? (
          <div key={i} style={{ position: "absolute", left: 470 + i * 490, top: 720, transform: `translate(-50%,-50%) scale(${pop(f, tt as number, 9)})`, textAlign: "center" }}>
            <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 96, color: i ? "#fff" : "#ffd23a", textShadow: "0 5px 16px rgba(0,0,0,.6)" }}>{y}</div>
            <div style={{ background: col as string, color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 32, padding: "6px 18px", borderRadius: 8, border: "3px solid #fff", textTransform: "uppercase" }}>{i ? "Before " : ""}{c}</div>
          </div>
        ) : null
      ))}
    </AbsoluteFill>
  );
};

export const Ch3: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const f = t * FPS;
  const c = camOf(KEYS, t);
  const blur = blurOf(KEYS, t, FPS);
  const at = (t0: number, d = 0.35) => interpolate(t, [t0, t0 + d], [0, 1], clamp);
  const off = (t1: number, d = 0.4) => interpolate(t, [t1, t1 + d], [1, 0], clamp);
  const gold = interpolate(t, [218.5, 219.6, 221.8, 222.4], [0, 1, 1, 0], clamp);
  const railsOp = off(156.5) + at(205.9) * off(222.0);
  // barco que lleva a la familia rica a París: la cámara lo sigue
  const shipK = interpolate(t, [197.0, 199.6], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ background: "#2f6fb8", overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id="mb3"><feGaussianBlur stdDeviation={blur.toFixed(2)} /></filter></svg>
      <AbsoluteFill style={{ filter: blur > 0.6 ? "url(#mb3)" : undefined }}>
        <World c={c} modern={0}>
          <Region d={geo.prov.Pampas.d} op={at(123.7) * off(135.3) + at(151.4) * off(156.4)} z={c.z} color="#9ad13a" />
          <Region d={geo.prov.Pampas.d} op={gold} z={c.z} color="#ffd23a" />
          {/* Pampa más cerca del mar: línea corta vs línea larga desde las Praderas */}
          {vis(t, 128.3, 130.4) && (() => {
            const k = interpolate(t, [128.4, 129.2], [0, 1], { ...clamp, easing: ease }) * off(130.0);
            const [a1, b1] = P(-61, -34.5), [a2, b2] = P(-57, -36.5);
            return <line x1={a1} y1={b1} x2={a1 + (a2 - a1) * k} y2={b1 + (b2 - b1) * k} stroke="#fff" strokeWidth={8 / c.z} strokeDasharray={`${18 / c.z} ${10 / c.z}`} />;
          })()}
          {SPOKES.map((s, i) => <Rail key={i} pts={s} t={t} t0={144.9 + i * 0.55} dur={1.6} z={c.z} op={railsOp} />)}
          {SPOKES_1914.map((s, i) => <Rail key={i} pts={s} t={t} t0={206.2 + i * 0.35} dur={1.2} z={c.z} op={at(205.9) * off(222.0)} />)}
          {/* campos nuevos a lo largo de cada vía */}
          {SPOKES.flatMap((s, i) => [0.35, 0.6, 0.85].map((u, j) => {
            const [x, y] = along(s, u); const o = at(151.6 + i * 0.12 + j * 0.15, 0.3) * off(156.4);
            return o > 0 ? <rect key={`${i}-${j}`} x={x - 23 / c.z} y={y - 15 / c.z} width={46 / c.z} height={30 / c.z} fill={j % 2 ? "#b9d84a" : "#e0c64a"} stroke="#fff" strokeWidth={3 / c.z} opacity={o} transform={`rotate(${(i * 23) % 40 - 20} ${x} ${y})`} /> : null;
          }))}
        </World>
      </AbsoluteFill>

      <Clouds c={c} f={f} t={t} />
      <YearCorner f={f} t={t} marks={[[122.4, "1880"], [135.6, "1890"], [157.9, "1880–1930"], [179.9, "1908"], [188.1, "1913"], [205.9, "1914"]]} />

      {/* la apuesta */}
      <HandNote f={f} t={t} t0={123.6} t1={126.2} x={960} y={190} text="Place your bet: 1880" size={92} />
      <Tag c={c} f={f} t={t} lon={-61} lat={-31} t0={126.3} t1={135.3} text="The Pampas" bg="#2a7d2e" size={34} />
      <Chips c={c} f={f} t={t} />
      {vis(t, 127.3, 128.4) && <div style={{ position: "absolute", left: 1440, top: 300, transform: `translate(-50%,-50%) scale(${pop(f, 127.32, 8) * fadeOut(t, 128.4)})`, fontFamily: SANS, fontWeight: 900, fontSize: 84, color: "#fff", textShadow: "0 4px 16px rgba(0,0,0,.6)" }}>WARMER</div>}
      <Tag c={c} f={f} t={t} lon={-54} lat={-38.5} t0={128.6} t1={130.3} text="Closer to the ocean" bg="#2f6fb8" size={30} />
      <Portal2 c={c} t={t} lon={BA[0]} lat={BA[1]} t0={130.3} t1={133.2} src="v5/img/f_port.png" maxR={300} dx={380} dy={-80} caption="Buenos Aires" />
      <BigWord f={f} t={t} t0={134.3} t1={135.4} text={<span style={{ color: "#ffd23a" }}>BRILLIANT</span>} y={170} />

      {/* 1890: Argentina más rica por persona */}
      <MapBar c={c} f={f} t={t} lon={-62} lat={-30} t0={137.4} t1={140.6} value={3851} max={4200} color="#e3261c" label="Argentina 1890" />
      <MapBar c={c} f={f} t={t} lon={-100} lat={44} t0={138.8} t1={140.6} value={3790} max={4200} color="#f2b81d" label="Canada 1890" />
      <Tag c={c} f={f} t={t} lon={-82} lat={-8} t0={138.4} t1={140.6} text="GDP per person · Maddison" bg="#111" size={22} />

      {/* el dinero británico y las vías */}
      <Flag c={c} f={f} t={t} cc="gb" lon={-2} lat={53} t0={142.7} t1={145.4} w={84} />
      <Route c={c} t={t} f={f} from={[-3, 51]} to={BA} t0={143.1} t1={145.4} dur={1.4} bend={-420} ship={false} />
      {[0, 1, 2, 3].map((i) => { const B = (k: number) => [-3 + (BA[0] + 3) * k, 51 + (BA[1] - 51) * k] as [number, number]; const k = interpolate(t, [143.2 + i * 0.22, 144.6 + i * 0.22], [0, 1], { ...clamp, easing: ease }); return k > 0 && k < 1 ? <Icon key={i} c={c} f={f} t={t} src="ingot" lon={B(k)[0]} lat={B(k)[1]} t0={143.2} t1={145.4} size={70} /> : null; })}
      <Tag c={c} f={f} t={t} lon={-30} lat={30} t0={143.0} t1={145.0} text="British money" bg="#111" size={30} />
      {SPOKES.map((s, i) => { const k = interpolate(t, [146.6 + i * 0.4, 149.8 + i * 0.4], [0, 1], { ...clamp, easing: ease }); if (k <= 0 || k >= 1 || t > 156.4) return null; const [x, y] = proj(c, ...along(s, k)); return <div key={i} style={{ position: "absolute", left: x - 13, top: y - 13, width: 26, height: 26, borderRadius: 6, background: "#e3261c", border: "4px solid #fff", boxShadow: "0 0 10px rgba(0,0,0,.5)" }} />; })}
      <HandNote f={f} t={t} t0={149.4} t1={151.2} x={1480} y={220} text="spokes of a wheel" size={78} />
      <Tag c={c} f={f} t={t} lon={-63} lat={-29} t0={151.8} t1={154.0} text="New line → new land" bg="#2a7d2e" size={30} />
      {[[-62, -33.6], [-60.2, -36], [-63.5, -35.4], [-59.5, -33.4]].map(([lo, la], i) => <Icon key={i} c={c} f={f} t={t} src="farmer" lon={lo} lat={la} t0={154.6 + i * 0.12} t1={156.4} size={70} />)}
      <BigWord f={f} t={t} t0={154.9} t1={156.4} text={<span>NEEDED <span style={{ color: "#ffd23a" }}>HANDS</span></span>} y={940} size={84} />

      {/* llegan las manos: 6 millones */}
      {ORIGINS.map((o, i) => <Route key={i} c={c} t={t} f={f} from={[o.lon, o.lat]} to={BA} t0={157.2 + i * 0.25} t1={166.4} dur={2.0} bend={-380 - i * 60} />)}
      {ORIGINS.map((o, i) => <Flag key={i} c={c} f={f} t={t} cc={o.cc} lon={o.lon} lat={o.lat} t0={o.t0} t1={166.4} w={78} />)}
      {ORIGINS.map((o, i) => <Tag key={i} c={c} f={f} t={t} lon={o.lon + 9} lat={o.lat + (i === 3 ? 1.5 : i === 2 ? 0.8 : -1.5)} t0={o.t0 + 0.08} t1={166.4} text={o.name} bg="#111" size={22} />)}
      {vis(t, 159.8, 166.4) && <div style={{ position: "absolute", left: 960, top: 940, transform: `translate(-50%,-50%) scale(${pop(f, 159.96, 10) * fadeOut(t, 166.4)})`, fontFamily: SANS, fontWeight: 900, fontSize: 104, color: "#fff", textShadow: "0 5px 18px rgba(0,0,0,.6)", fontVariantNumeric: "tabular-nums" }}>
        {Math.round(interpolate(t, [160.0, 162.0], [0, 6000000], { ...clamp, easing: Easing.out(Easing.cubic) })).toLocaleString("en-US")} <span style={{ fontSize: 46 }}>EUROPEANS</span>
      </div>}
      <OneInThree f={f} t={t} t0={167.3} t1={172.4} />
      <Tag c={c} f={f} t={t} lon={-58.9} lat={-34.0} t0={167.6} t1={172.4} text="Buenos Aires" bg="#111" size={30} />

      {/* gran ciudad */}
      <Portal2 c={c} t={t} lon={BA[0]} lat={BA[1]} t0={172.9} t1={176.2} src="clips/ba_avenue.mp4" video maxR={340} dx={420} dy={-60} caption="Buenos Aires" />
      <BigWord f={f} t={t} t0={173.9} t1={176.0} text={<span>ONE OF THE <span style={{ color: "#ffd23a" }}>GREAT CITIES</span></span>} y={985} size={74} />
      <FilmStrip f={f} t={t} t0={175.9} t1={179.8} items={[["desk/ba1920.jpg", "wide avenues", 176.08], ["v5/img/f_paris.png", "palaces", 177.16], ["desk/ba_elite.jpg", "electric trams", 178.06]]} />
      <Portal2 c={c} t={t} lon={BA[0]} lat={BA[1]} t0={182.4} t1={186.2} src="v5/img/f_colon.png" maxR={360} dx={-420} dy={-40} caption="Teatro Colón · 1908" />
      <HandNote f={f} t={t} t0={184.3} t1={186.2} x={1380} y={760} text="one of the finest on the planet" size={64} />

      <Subway f={f} t={t} />

      {/* a París en barco */}
      {vis(t, 196.9, 199.8) && (() => { const lon = BA[0] + (2.35 - BA[0]) * shipK, lat = BA[1] + (48.85 - BA[1]) * shipK; const [x, y] = proj(c, ...P(lon, lat)); return <Img src={sf("icons/ship.png")} style={{ position: "absolute", left: x, top: y + Math.sin(f / 5) * 4, width: 130, transform: "translate(-50%,-70%)", filter: "drop-shadow(0 10px 10px rgba(0,0,0,.4))" }} />; })()}
      <Icon c={c} f={f} t={t} src="tophat" lon={-58} lat={-30} t0={197.1} t1={198.0} size={90} />
      <Flag c={c} f={f} t={t} cc="fr" lon={4.5} lat={50.6} t0={199.4} t1={205.6} w={70} />
      <Portal2 c={c} t={t} lon={2.35} lat={48.85} t0={199.6} t1={205.6} src="v5/img/f_paris.png" maxR={300} dx={-430} dy={-40} caption="Paris" />
      {vis(t, 200.6, 205.6) && (
        <div style={{ position: "absolute", left: 1300, top: 330, transform: `translate(-50%,-50%) scale(${pop(f, 200.6, 10) * fadeOut(t, 205.6)})`, background: "#fff", borderRadius: 30, padding: "26px 40px", boxShadow: "0 16px 36px rgba(0,0,0,.45)", fontFamily: HAND, fontSize: 70, color: "#1b2433", whiteSpace: "nowrap" }}>
          « riche comme un Argentin »
          <div style={{ position: "absolute", left: 80, bottom: -34, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: "40px solid #fff" }} />
        </div>
      )}
      <BigWord f={f} t={t} t0={203.9} t1={205.6} text={<span>RICH AS AN <span style={{ color: "#ffd23a" }}>ARGENTINE</span></span>} y={985} size={80} />

      {/* 1914: red ferroviaria, granos y vacas al puerto */}
      {vis(t, 207.0, 218.4) && <div style={{ position: "absolute", right: 80, top: 200, textAlign: "right", transform: `scale(${pop(f, 207.2, 10) * fadeOut(t, 218.4)})`, transformOrigin: "right", fontFamily: SANS, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.7)" }}>
        <div style={{ fontWeight: 900, fontSize: 100, fontVariantNumeric: "tabular-nums" }}>{Math.round(interpolate(t, [207.4, 209.6], [0, 33000], { ...clamp, easing: Easing.out(Easing.cubic) })).toLocaleString("en-US")} km</div>
        <div style={{ fontWeight: 800, fontSize: 30 }}>OF RAILWAY · BRITISH-BUILT</div>
      </div>}
      {[0, 1, 2, 3, 4, 5].map((i) => { const s = SPOKES[i]; const k = 1 - interpolate(t, [212.0 + i * 0.3, 216.5 + i * 0.3], [0, 1], { ...clamp, easing: ease }); if (t < 212 || t > 218.4) return null; const [x, y] = proj(c, ...along(s, k)); return <Img key={i} src={sf(`icons/${i % 2 ? "cow" : "wheat"}.png`)} style={{ position: "absolute", left: x, top: y, width: 70, transform: "translate(-50%,-70%)", filter: "drop-shadow(0 6px 6px rgba(0,0,0,.4))" }} />; })}
      <Tag c={c} f={f} t={t} lon={-57.2} lat={-35.6} t0={215.2} t1={218.4} text="Buenos Aires" bg="#111" size={26} />
      <Tag c={c} f={f} t={t} lon={-60.6} lat={-32.2} t0={215.6} t1={218.4} text="Rosario" bg="#111" size={26} />
      {[[-63.2, -33.6], [-60.3, -36.4], [-62.8, -36.8]].map(([lo, la], i) => <Icon key={i} c={c} f={f} t={t} src="tophat" lon={lo} lat={la} t0={218.7 + i * 0.15} t1={222.0} size={86} />)}
      <BigWord f={f} t={t} t0={219.6} t1={222.0} text={<span>A <span style={{ color: "#ffd23a" }}>GOLDEN</span> AGE</span>} y={170} />
      <Vignette />
    </AbsoluteFill>
  );
};
