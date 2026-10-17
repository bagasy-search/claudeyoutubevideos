// Cap. 1 (21,0–83,0): el mapa — Mediterráneo, Mar Rojo, el puente de arena, la vuelta por África vs el atajo, el istmo por dentro.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FPS, Key, MapView, Route, Tag, HandLabel, BigWord, Stamp, Note, Count, Flag, ScenePortal, Chain, Dust, Vignette, proj, partial, dpath, ramp, fadeOut, vis, camAt, clamp, pop } from "./kit";
import { PL, CAPE_ROUTE, SUEZ_ROUTE, MODERN } from "./geo";
import { AnimeScene } from "./anime";

export const CH1: [number, number] = [21.0, 83.0];
const KEYS: Key[] = [
  [21.0, 32.42, 30.4, 12.5],
  [23.2, 42, 24, 0.42],   // "look at a map"
  [24.0, 30, 30, 0.62],
  [24.9, 17, 36.0, 1.55], // "Here is the Mediterranean"
  [25.6, 18, 35.6, 1.6],
  [26.5, 38.2, 21.5, 1.75], // "here is the Red Sea"
  [27.1, 37.6, 22.4, 1.8],
  [28.7, 32.4, 30.6, 6.5], // "a bridge of sand"
  [31.0, 32.35, 30.6, 7.2],
  [32.4, 12, 46, 1.1],    // "Europe"
  [33.4, 14, 45, 1.15],
  [36.4, 96, 14, 0.72],   // India, China, Spice Islands
  [37.0, 92, 13, 0.7],
  [39.2, 30, 8, 0.5],     // vuelta por África
  [46.4, 33, 8, 0.48],
  [48.4, 28, 27, 0.9],    // "this little strip of desert"
  [50.6, 36, 22, 0.78],
  [52.3, 36, 14, 0.5],    // "shrink the planet"
  [53.9, 34, 24, 1.3],
  [56.6, 32.4, 30.5, 4.2],
  [59.0, 32.3, 30.6, 9.5], // "hiding in plain sight"
  [61.2, 32.2, 30.65, 10.5],
  [64.3, 31.95, 30.6, 12.5], // "dry valleys"
  [65.6, 32.08, 31.05, 12.0], // "salt marshes"
  [67.2, 32.33, 30.45, 12.5], // "lakes"
  [69.8, 32.3, 30.6, 9.0],
  [72.2, 32.3, 30.6, 10.5],
  [83.0, 32.3, 30.6, 11.5],
];
const ISTHMUS: [number, number][] = [[32.05, 31.2], [32.62, 31.2], [32.7, 29.98], [32.38, 29.98]];
const FLAGS: [string, number][] = [["fr", 0], ["gb", 1], ["it", 2], ["ot", 3], ["pt", 4], ["de", 5], ["es", 6], ["ve", 7]];

export const Ch1: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const c = camAt(KEYS, t);
  const squeeze = 1 - 0.13 * interpolate(t, [52.25, 52.7, 53.3, 53.9], [0, 1, 1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const isth = proj(c, 32.35, 30.6);
  const pj = (a: [number, number][]) => a.map(([lo, la]) => proj(c, lo, la));
  return (
    <AbsoluteFill style={{ background: "#e6d8b6", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scaleX(${squeeze})` }}>
        <MapView keys={KEYS} t={t} hidden={t > 72.5 && t < 82.5}>
          {(c) => (
            <>
              <svg width={1920} height={1080} style={{ position: "absolute" }}>
                {/* el canal moderno de la intro sigue ahí, tenue */}
                <path d={dpath(pj(MODERN))} fill="none" stroke="#fff" strokeWidth={Math.max(3, c.z * 0.8)} strokeLinecap="round" opacity={fadeOut(t, 23.0, 1.2) * 0.9} />
                {/* el puente de arena */}
                {vis(t, 28.0, 31.4) && (() => {
                  const k = ramp(t, 28.0, 28.7) * fadeOut(t, 31.4, 0.4);
                  return <path d={dpath(pj(ISTHMUS)) + "Z"} fill="#ffd23a" fillOpacity={0.24 * k + 0.08 * k * Math.sin(f / 4)} stroke="#fff6cf" strokeWidth={4} strokeOpacity={k} strokeDasharray="14 10" strokeDashoffset={-f * 1.5} />;
                })()}
                {/* "dry valleys": el Wadi Tumilat, "salt marshes": Manzala, "lakes": Timsah y Amargos que van y vienen */}
                {vis(t, 64.3, 69.6) && <path d={dpath(partial(pj([[31.45, 30.56], [31.7, 30.55], [31.95, 30.56], [32.2, 30.57]]), ramp(t, 64.4, 65.2)))} fill="none" stroke="#8a5a2a" strokeWidth={14} strokeDasharray="4 12" strokeLinecap="round" opacity={fadeOut(t, 69.6)} />}
                {vis(t, 65.5, 69.6) && (() => { const [x, y] = proj(c, 32.02, 31.18); const r = 150 * pop(f, 65.5, 12) * fadeOut(t, 69.6); return <ellipse cx={x} cy={y} rx={r * 1.6} ry={r * 0.7} fill="#7fa36a" fillOpacity={0.25} stroke="#4c6b3a" strokeWidth={5} strokeDasharray="10 8" />; })()}
                {vis(t, 66.85, 69.6) && [[32.29, 30.57, 0.05], [32.38, 30.33, 0.09], [32.47, 30.2, 0.05]].map(([lo, la, rr], i) => {
                  const [x, y] = proj(c, lo, la); const pulse = 0.6 + 0.4 * Math.sin(f / 5 + i * 2);
                  const r = rr * 30 * c.z * pop(f, 66.9 + i * 0.18, 10) * fadeOut(t, 69.6);
                  return <ellipse key={i} cx={x} cy={y} rx={r * 1.3} ry={r} fill="#4f9fe0" fillOpacity={0.35 * pulse} stroke="#fff" strokeWidth={5} />;
                })}
                {/* "on paper": la línea recta a lápiz Port Said → Suez */}
                {vis(t, 69.95, 72.4) && <path d={dpath(partial(pj([[32.3, 31.26], [32.56, 29.95]]), ramp(t, 70.0, 70.8, Easing.linear)))} fill="none" stroke="#3a3a3a" strokeWidth={6} strokeDasharray="18 10" opacity={fadeOut(t, 72.4)} />}
              </svg>
              <HandLabel c={c} f={f} t={t} lon={17.5} lat={35.0} t0={24.35} t1={31.0} text="Mediterranean Sea" size={60} />
              <HandLabel c={c} f={f} t={t} lon={38.6} lat={20.4} t0={26.0} t1={31.0} text="Red Sea" size={60} rot={-52} />
              <Tag c={c} f={f} t={t} lon={33.15} lat={30.62} t0={28.95} t1={31.3} text="≈100 miles of sand" bg="#9c6a1c" size={30} dx={170} />
              <Tag c={c} f={f} t={t} lon={10} lat={49} t0={32.6} t1={37.0} text="Europe" bg="#24427a" size={40} />
              <Tag c={c} f={f} t={t} lon={PL.india[0]} lat={PL.india[1]} t0={34.25} t1={43.9} text="India" bg="#a23b1d" size={38} />
              <Tag c={c} f={f} t={t} lon={PL.china[0]} lat={PL.china[1]} t0={35.0} t1={46.6} text="China" bg="#a23b1d" size={38} />
              <Tag c={c} f={f} t={t} lon={PL.spice[0]} lat={PL.spice[1]} t0={35.85} t1={46.6} text="Spice Islands" bg="#a23b1d" size={34} />
              <Route c={c} t={t} f={f} pts={CAPE_ROUTE} t0={38.5} t1={46.0} out={53.9} color="#d4241c" w={7} dash ship shipSize={80} />
              <Tag c={c} f={f} t={t} lon={PL.london[0]} lat={PL.london[1]} t0={43.4} t1={53.9} text="London" size={26} dot dy={-34} />
              <Tag c={c} f={f} t={t} lon={PL.bombay[0]} lat={PL.bombay[1]} t0={44.0} t1={53.9} text="Bombay" size={26} dot dy={-34} />
              <Route c={c} t={t} f={f} pts={SUEZ_ROUTE} t0={47.7} t1={50.4} out={53.9} color="#fff" w={8} ship shipSize={80} glow="#8fd0ff" />
            </>
          )}
        </MapView>
      </AbsoluteFill>

      {/* cifras de las dos rutas */}
      <Note f={f} t={t} t0={45.2} t1={53.9} x={420} y={830} w={480} rot={-3}><span style={{ color: "#b3261e" }}>around Africa</span><br /><b style={{ fontSize: 76 }}>≈<Count t={t} t0={45.3} t1={46.4} from={0} to={12000} /> mi</b></Note>
      <Note f={f} t={t} t0={49.5} t1={53.9} x={1500} y={830} w={480} rot={2}><span style={{ color: "#1d6b3a" }}>through Suez</span><br /><b style={{ fontSize: 76 }}>≈<Count t={t} t0={49.6} t1={50.4} from={12000} to={7000} /> mi</b></Note>
      <BigWord f={f} t={t} t0={51.75} t1={52.4} text="✂" x={isth[0]} y={isth[1] - 60} size={150} />
      <BigWord f={f} t={t} t0={52.4} t1={53.9} text={<span>SHRINK THE <span style={{ color: "#ffd23a" }}>PLANET</span></span>} y={170} size={110} />

      {/* todas las potencias lo veían… casi nadie podía */}
      {vis(t, 54.1, 57.2) && FLAGS.map(([cc, i]) => {
        const a = (i / FLAGS.length) * Math.PI * 2 - Math.PI / 2;
        const R = 330 + 20 * Math.sin(f / 9 + i);
        const fall = ramp(t, 55.5 + i * 0.05, 56.3 + i * 0.05, Easing.in(Easing.quad));
        return <AbsoluteFill key={cc} style={{ transform: `translateY(${fall * 900}px) rotate(${fall * (i % 2 ? 40 : -40)}deg)`, transformOrigin: `${isth[0] + Math.cos(a) * R}px ${isth[1] + Math.sin(a) * R}px`, filter: `grayscale(${fall})` }}>
          <Flag f={f} t={t} cc={cc} x={isth[0] + Math.cos(a) * R} y={isth[1] + Math.sin(a) * R} t0={54.15 + i * 0.07} t1={57.2} w={96} />
        </AbsoluteFill>;
      })}
      <BigWord f={f} t={t} t0={54.15} t1={55.4} text="EVERYONE COULD SEE IT" y={160} size={90} />
      <Stamp f={f} t={t} t0={55.65} t1={57.2} x={960} y={540} text="Almost nobody" size={100} />

      <BigWord f={f} t={t} t0={60.05} t1={61.5} text={<span>NOT JUST <span style={{ color: "#ffd23a" }}>SAND</span></span>} y={170} size={120} />
      {(() => { const p = proj(c, 32.3, 30.6); return <Tag c={c} f={f} t={t} lon={32.3} lat={30.6} t0={62.45} t1={64.2} text="low · flat · corridor" bg="#9c6a1c" size={34} dy={-120} key={p[0]} />; })()}
      <Tag c={c} f={f} t={t} lon={31.85} lat={30.5} t0={64.5} t1={69.6} text="dry valley" bg="#7a4b20" size={30} dy={70} />
      <Tag c={c} f={f} t={t} lon={32.05} lat={31.18} t0={65.55} t1={69.6} text="salt marshes" bg="#4c6b3a" size={30} />
      <Tag c={c} f={f} t={t} lon={32.5} lat={30.4} t0={66.95} t1={69.6} text="lakes" bg="#2f6fb8" size={30} dx={120} />
      <Note f={f} t={t} t0={70.05} t1={72.3} x={1450} y={300} w={300} rot={4} size={70}>easy? ✓</Note>

      {/* la realidad: horno sin agua, dunas que caminan */}
      <ScenePortal t={t} open={[71.95, 72.5]} close={[82.45, 82.98]} o={isth} cpt={isth}>
        <Chain t={t} f={f} end={83.0} shots={[
          [71.9, (t) => <AnimeScene t={t} f={f} t0={71.9} t1={75.3} bg="bg_furnace" z0={1.02} z1={1.12} px={50} chars={[]} sand="#fff6dc" />],
          [75.15, (t) => <><AnimeScene t={t} f={f} t0={75.1} t1={83.0} bg="bg_dunes_wind" z0={1.04} z1={1.2} px={-80} chars={[]} /><Dust f={f} op={0.85} n={70} /></>, "whip"],
        ]} />
      </ScenePortal>
      {vis(t, 73.1, 75.1) && <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, rgba(255,240,200,${0.25 + 0.1 * Math.sin(f / 3)}), transparent 60%)`, pointerEvents: "none" }} />}
      <BigWord f={f} t={t} t0={73.15} t1={75.1} text="A FURNACE" y={190} size={130} color="#ffe2a8" />
      <Note f={f} t={t} t0={73.85} t1={75.1} x={1500} y={820} w={380} rot={3}>fresh water: <b style={{ color: "#b3261e" }}>0</b></Note>
      <BigWord f={f} t={t} t0={76.1} t1={77.9} text="WHOLE DUNES MOVE" y={180} size={100} />
      <BigWord f={f} t={t} t0={79.9} t1={82.3} text={<span>THE DESERT <span style={{ color: "#ffd23a" }}>FILLS IT BACK</span></span>} y={930} size={88} />
      <Vignette />
    </AbsoluteFill>
  );
};
