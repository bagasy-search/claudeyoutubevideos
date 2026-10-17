// Cap. 3 (127,7–193,3): Persia termina el canal (Darío, las estelas), griegos, romanos, árabes;
// el desierto gana, el califa lo rellena, mil años bajo la arena.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FPS, Key, MapView, Tag, BigWord, Stamp, Note, Count, ScenePortal, Chain, Dust, Vignette, YearNote, Caption, MiniMap, CanalLine, Photo, Route, proj, dpath, smooth, ramp, fadeOut, vis, camAt, pop, rnd, HAND, SANS } from "./kit";
import { PL, ANCIENT, DARIUS } from "./geo";
import { AnimeScene } from "./anime";

export const CH3: [number, number] = [127.7, 193.3];
const KEYS: Key[] = [
  [127.7, 31.95, 30.5, 12.5],
  [129.4, 40, 30, 1.25],   // "a century later, Egypt belonged to Persia"
  [132.3, 44, 30.5, 1.35],
  [133.0, 52.9, 29.9, 2.2], // Persépolis
  [136.0, 52.9, 29.9, 2.4],
  [166.0, 33, 30.3, 2.6],  // "every new empire…"
  [169.2, 32.6, 30.4, 3.4],
  [171.8, 32.3, 30.4, 6.0], // "the desert won"
  [172.8, 32.3, 30.4, 6.3],
  [177.4, 38, 29, 1.45],   // el califa en Bagdad
  [180.6, 39, 28.5, 1.5],
  [184.0, 36, 28.5, 1.55],
  [193.3, 32.3, 30.5, 8.0],
];
// el imperio persa (aprox., 500 a.C.) como mancha que se extiende hasta Egipto
const PERSIA: [number, number][] = [[26, 41], [35, 42], [44, 41], [52, 40], [62, 40], [70, 37], [72, 30], [66, 25], [58, 25], [52, 27], [48, 29], [44, 30], [40, 28], [36, 25], [33, 22], [30, 24], [25, 29], [25, 31.5], [29, 31.5], [33, 33], [30, 37], [26, 38]];
const EMPIRES: [string, string, number][] = [["Pharaohs", "#9c6a1c", 166.5], ["Persians", "#2d6a5a", 167.0], ["Greeks", "#24427a", 167.5], ["Romans", "#8e2a22", 168.0], ["Arabs", "#1d6b3a", 168.5]];

export const Ch3: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const c = camAt(KEYS, t);
  const sceneOn = (t > 133.4 && t < 165.6) || (t > 173.2 && t < 177.0) || (t > 181.0 && t < 192.9);
  const pers = proj(c, PL.persepolis[0], PL.persepolis[1]);
  const isth = proj(c, 32.3, 30.45);
  const bag = proj(c, PL.baghdad[0], PL.baghdad[1]);
  return (
    <AbsoluteFill style={{ background: "#e6d8b6", overflow: "hidden" }}>
      <MapView keys={KEYS} t={t} hidden={sceneOn}>
        {(c) => (
          <>
            <svg width={1920} height={1080} style={{ position: "absolute" }}>
              {vis(t, 129.6, 133.6) && (() => {
                const k = ramp(t, 129.7, 131.6, Easing.out(Easing.cubic));
                const cx = PL.persepolis[0], cy = PL.persepolis[1];
                const pts = PERSIA.map(([lo, la]) => proj(c, cx + (lo - cx) * k, cy + (la - cy) * k));
                return <path d={dpath(smooth(pts as [number, number][], 6)) + "Z"} fill="#2d6a5a" fillOpacity={0.32} stroke="#2d6a5a" strokeWidth={6} strokeDasharray="16 8" opacity={fadeOut(t, 133.6)} />;
              })()}
            </svg>
            {/* cada imperio reabre el mismo canal: la línea se enciende con cada uno */}
            {vis(t, 166.0, 172.9) && <CanalLine c={c} pts={ANCIENT} k={1} w={Math.max(8, c.z * 3)} color={t > 170.3 ? "#c9a66b" : "#4f9fe0"} op={(0.75 + 0.25 * Math.sin(f / 2)) * fadeOut(t, 172.9)} />}
            {vis(t, 170.2, 172.9) && <svg width={1920} height={1080} style={{ position: "absolute" }}>
              {Array.from({ length: 30 }).map((_, i) => {
                const p = smooth(ANCIENT).map(([lo, la]) => proj(c, lo, la)); const q = p[Math.floor(rnd(i) * (p.length - 1))];
                return <circle key={i} cx={q[0] + (rnd(i + 3) - 0.5) * 50} cy={q[1] + (rnd(i + 8) - 0.5) * 40} r={(12 + rnd(i + 5) * 26) * ramp(t, 170.3 + rnd(i) * 0.6, 171.4 + rnd(i) * 0.6)} fill="#d2b07a" />;
              })}
            </svg>}
            <Tag c={c} f={f} t={t} lon={56} lat={32} t0={130.0} t1={133.5} text="Persia" bg="#2d6a5a" size={46} />
            <Tag c={c} f={f} t={t} lon={30.6} lat={27} t0={131.4} t1={133.5} text="Egypt" bg="#9c6a1c" size={34} />
            {/* Bagdad ordena cerrar; Medina sin grano */}
            <Route c={c} t={t} f={f} pts={[[44.4, 33.3], [40, 33], [35.5, 31.8], [32.6, 30.5]]} t0={179.6} t1={180.6} out={181.2} color="#1a1a1a" w={7} />
            <Tag c={c} f={f} t={t} lon={PL.baghdad[0]} lat={PL.baghdad[1]} t0={179.4} t1={181.2} text="Baghdad" size={30} dot dy={-38} />
            <Tag c={c} f={f} t={t} lon={PL.medina[0]} lat={PL.medina[1]} t0={177.9} t1={181.2} text="Medina" size={30} dot dy={-38} bg="#7a1f1f" />
          </>
        )}
      </MapView>
      <YearNote f={f} t={t} marks={[[129.6, "500 BC"], [149.4, "270 BC"], [154.75, "100 AD"], [158.45, "641 AD"], [166.0, ""], [177.4, "c. 770 AD"], [186.0, ""]]} />

      {/* Darío → estela → foto real de la estela → griegos → romanos → árabes */}
      <ScenePortal t={t} open={[133.0, 133.5]} close={[165.6, 166.1]} o={pers} cpt={isth}>
        <Chain t={t} f={f} end={166.1} shots={[
          [133.0, (t) => <AnimeScene t={t} f={f} t0={133.0} t1={136.4} bg="bg_persepolis" z0={1.03} z1={1.12} px={60} chars={[{ src: "ch_darius", x: 1380, bottom: 10, h: 960, tIn: 133.2, from: 150 }]} sand="#ffe6bf" />],
          [136.15, (t) => <AnimeScene t={t} f={f} t0={136.1} t1={149.5} bg="bg_stele" z0={1.02} z1={1.24} px={-60} py={-40} chars={[]} />, "whip"],
          [149.4, (t) => <AnimeScene t={t} f={f} t0={149.3} t1={154.9} bg="bg_ptolemy" z0={1.02} z1={1.12} px={60} chars={[]} />, "whip"],
          [154.75, (t) => <AnimeScene t={t} f={f} t0={154.7} t1={158.6} bg="bg_trajan" z0={1.03} z1={1.13} px={-70} chars={[]} />, "whipL"],
          [158.45, (t) => <AnimeScene t={t} f={f} t0={158.4} t1={166.1} bg="bg_amr" z0={1.02} z1={1.12} px={50} chars={[{ src: "ch_amr", x: 330, bottom: 10, h: 900, tIn: 159.7, from: -150 }]} />, "whip"],
        ]} />
      </ScenePortal>
      <Caption f={f} t={t} t0={133.3} t1={135.9} x={1380} y={1010} text="Darius I of Persia" />
      <MiniMap f={f} t={t} t0={133.6} t1={136.0} lon={32.15} lat={30.32} z={8.5} title="Isthmus of Suez">
        {(mc) => <CanalLine c={mc} pts={ANCIENT} k={ramp(t, 133.9, 135.0)} w={26} />}
      </MiniMap>
      <BigWord f={f} t={t} t0={134.1} t1={135.9} text="FINISHED" y={170} size={120} color="#ffd23a" />
      {/* cuatro idiomas */}
      {vis(t, 140.6, 142.55) && ["Old Persian", "Elamite", "Akkadian", "Egyptian"].map((L, i) => (
        <div key={L} style={{ position: "absolute", left: 300 + i * 440, top: 930, transform: `translate(-50%,-50%) scale(${pop(f, 140.65 + i * 0.16, 10) * fadeOut(t, 142.55)}) rotate(${i % 2 ? 2 : -2}deg)`, background: "#111", color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 34, padding: "8px 18px", borderRadius: 6, border: "2px solid #fff", textTransform: "uppercase", boxShadow: "0 6px 16px rgba(0,0,0,.45)" }}>{L}</div>
      ))}
      <BigWord f={f} t={t} t0={140.6} t1={142.55} text="4 LANGUAGES" y={170} size={110} />
      <Photo f={f} t={t} t0={142.7} t1={149.3} src="suez/pd/stele_menant.jpg" x={470} y={520} w={470} h={600} rot={-4} caption="the real stele" pos="50% 40%" />
      {vis(t, 142.7, 149.3) && <AbsoluteFill style={{ background: "rgba(20,12,4,.35)", opacity: ramp(t, 142.7, 143.1) * fadeOut(t, 149.3), pointerEvents: "none" }} />}
      {/* la cita de la estela, escrita a mano sobre la foto real */}
      {vis(t, 143.0, 149.3) && (() => {
        const lines = ["“I commanded this canal", "to be dug… and ships went", "from Egypt to Persia,", "as I wished.”"];
        const starts = [143.8, 145.7, 146.4, 147.55];
        return <div style={{ position: "absolute", left: 1290, top: 540, transform: `translate(-50%,-50%) scale(${pop(f, 143.0, 12) * fadeOut(t, 149.3)}) rotate(-2deg)`, width: 760, padding: "26px 34px", background: "linear-gradient(#fbf6e6,#efe4c4)", border: "4px solid #fff", borderRadius: 6, boxShadow: "0 18px 40px rgba(0,0,0,.5)" }}>
          {lines.map((L, i) => <div key={i} style={{ fontFamily: HAND, fontSize: 56, color: "#26314a", whiteSpace: "nowrap", clipPath: `inset(0 ${100 - ramp(t, starts[i], starts[i] + 0.7, Easing.linear) * 100}% 0 0)` }}>{L}</div>)}
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 22, color: "#7a5a2a", marginTop: 8, letterSpacing: 1 }}>— DARIUS I, SUEZ STELE (DRAWING, 1887)</div>
        </div>;
      })()}
      <Caption f={f} t={t} t0={149.9} t1={154.5} x={430} y={1010} text="Greek Egypt · the first lock" />
      <Note f={f} t={t} t0={152.3} t1={154.5} x={1480} y={300} w={420} rot={3} size={46}>salt water <b style={{ color: "#b3261e" }}>✕</b><br />Nile water ✓</Note>
      <Caption f={f} t={t} t0={155.2} t1={158.3} x={1450} y={1010} text="Emperor Trajan" />
      <Caption f={f} t={t} t0={160.5} t1={165.6} x={330} y={1010} text="Amr ibn al-As" />
      <MiniMap f={f} t={t} t0={162.4} t1={165.7} lon={36} lat={26.5} z={1.6} title="grain to Arabia">
        {(mc) => <Route c={mc} t={t} f={f} pts={[[31.3, 30.1], [32.3, 30.4], [32.56, 29.9], [34.5, 27.5], [37.5, 23.5], [39.1, 22.0]]} t0={162.6} t1={164.6} color="#1d6b3a" w={18} ship shipSize={150} />}
      </MiniMap>

      {/* todos los imperios redescubren la idea */}
      {vis(t, 166.4, 170.0) && EMPIRES.map(([n, col, t0], i) => (
        <div key={n} style={{ position: "absolute", left: 240 + i * 360, top: 180, transform: `translate(-50%,-50%) scale(${pop(f, t0, 10) * fadeOut(t, 170.0)}) rotate(${i % 2 ? 3 : -3}deg)`, background: col, color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 36, padding: "8px 18px", borderRadius: 6, border: "3px solid #fff", textTransform: "uppercase", boxShadow: "0 8px 18px rgba(0,0,0,.45)" }}>{n}</div>
      ))}
      <BigWord f={f} t={t} t0={170.4} t1={172.7} text={<span>THE DESERT <span style={{ color: "#ffd23a" }}>WON</span></span>} y={900} size={120} />

      {/* la arena, las crecidas, el limo */}
      <ScenePortal t={t} open={[172.8, 173.3]} close={[176.9, 177.4]} o={isth} cpt={isth}>
        <><AnimeScene t={t} f={f} t0={172.8} t1={177.4} bg="bg_silting" z0={1.03} z1={1.14} px={60} chars={[]} /><Dust f={f} op={0.6} /></>
      </ScenePortal>
      {[["sand blew in", 173.3], ["floods shifted", 174.6], ["silted up", 176.2]].map(([s, t0], i) => (
        <Note key={i} f={f} t={t} t0={t0 as number} t1={177.0} x={420} y={260 + i * 150} w={420} rot={-3 + i * 2} size={46}>✓ {s}</Note>
      ))}

      {/* el califa: escena de la corte, después lo rellenan, después mil años de arena */}
      <ScenePortal t={t} open={[180.6, 181.1]} close={[192.8, 193.3]} o={bag} cpt={isth}>
        <Chain t={t} f={f} end={193.3} shots={[
          [180.6, (t) => <AnimeScene t={t} f={f} t0={180.6} t1={182.5} bg="bg_baghdad" z0={1.03} z1={1.1} px={40} chars={[]} />],
          [182.3, (t) => <><AnimeScene t={t} f={f} t0={182.2} t1={186.1} bg="bg_filling" z0={1.02} z1={1.12} px={-60} chars={[]} /><Dust f={f} op={0.5} /></>, "whip"],
          [186.0, (t) => <AnimeScene t={t} f={f} t0={185.9} t1={193.3} bg="bg_buried" z0={1.0} z1={1.2} px={0} py={-40} chars={[]} sand="#e8d6b0" />, "sand"],
        ]} />
      </ScenePortal>
      <Note f={f} t={t} t0={182.85} t1={184.3} x={1460} y={300} w={460} rot={3} size={46}>rebels in Medina:<br /><b>no grain</b></Note>
      <Stamp f={f} t={t} t0={184.45} t1={185.9} x={960} y={520} text="Closed" size={130} />
      <Note f={f} t={t} t0={186.6} t1={192.7} x={960} y={250} w={520} rot={-2} size={50}>buried for<br /><b style={{ fontSize: 100, color: "#b3261e" }}><Count t={t} t0={186.7} t1={188.6} from={0} to={1000} />+</b> years</Note>
      <BigWord f={f} t={t} t0={190.3} t1={192.6} text={<span>UNDER THE <span style={{ color: "#ffd23a" }}>SAND</span></span>} y={920} size={110} />
      <Vignette />
    </AbsoluteFill>
  );
};
