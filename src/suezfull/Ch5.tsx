// Cap. 5 (256,9–304,9): era mentira — cómo se acumuló el error, los dos mares al mismo nivel,
// la medición de 1847, el plan de Negrelli y el hombre que ya se había enamorado del canal.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FPS, Key, MapView, Tag, BigWord, Stamp, Note, Count, ScenePortal, Chain, Dust, Vignette, YearNote, Caption, MiniMap, CanalLine, Flag, Photo, proj, partial, dpath, ramp, fadeOut, vis, camAt, pop, clamp, HAND, SANS } from "./kit";
import { MODERN } from "./geo";
import { AnimeScene } from "./anime";

export const CH5: [number, number] = [256.9, 304.9];
const KEYS: Key[] = [
  [256.9, 32.3, 30.5, 5.0],
  [273.4, 32.3, 30.5, 5.2],
  [276.6, 32.4, 30.6, 6.6], // "the same level"
  [279.9, 32.3, 30.6, 7.4],
  [287.5, 32.3, 30.6, 9.0],
  [291.6, 32.32, 30.6, 10.5], // "inch by inch"
  [299.9, 32.3, 30.6, 9.0],
  [304.9, 32.3, 30.6, 8.0],
];
const SURVEY: [number, number][] = [[32.3, 31.24], [32.31, 31.0], [32.31, 30.8], [32.3, 30.6], [32.36, 30.42], [32.42, 30.3], [32.5, 30.1], [32.56, 29.95]];

// "pequeños errores, milla a milla": una escalera de errores que sube hasta 30 pies
const ErrorStairs: React.FC<{ f: number; t: number; t0: number; t1: number }> = ({ f, t, t0, t1 }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 13) * fadeOut(t, t1, 0.3);
  const N = 16, W0 = 900, H0 = 300;
  const k = ramp(t, t0 + 0.4, t0 + 3.0, Easing.linear);
  return (
    <div style={{ position: "absolute", left: 960, top: 560, width: 1100, height: 520, transform: `translate(-50%,-50%) scale(${s}) rotate(-1deg)`, border: "4px solid #fff", borderRadius: 8, boxShadow: "0 18px 40px rgba(0,0,0,.45)",
      backgroundImage: "repeating-linear-gradient(transparent 0 38px, rgba(80,110,160,.18) 38px 39px), linear-gradient(#fbf6e6,#efe4c4)" }}>
      <div style={{ position: "absolute", left: 40, top: 22, fontFamily: SANS, fontWeight: 900, fontSize: 30, color: "#26314a" }}>SMALL ERRORS, MILE AFTER MILE</div>
      <svg width={1100} height={520} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={100} y1={440} x2={1000} y2={440} stroke="#26314a" strokeWidth={4} />
        {Array.from({ length: N }).map((_, i) => {
          const on = k * N > i;
          const x = 100 + (i / N) * W0, h = ((i + 1) / N) * H0;
          return on ? <rect key={i} x={x + 4} y={440 - h} width={W0 / N - 8} height={h} fill={i === N - 1 ? "#d4241c" : "#c9a66b"} stroke="#8a6a3a" strokeWidth={2} /> : null;
        })}
        <text x={550} y={490} textAnchor="middle" fontFamily={HAND} fontSize={40} fill="#26314a">miles across the isthmus →</text>
      </svg>
      <div style={{ position: "absolute", left: 960, top: 70, transform: "translateX(-50%)", fontFamily: HAND, fontSize: 70, color: "#b3261e", whiteSpace: "nowrap", opacity: ramp(t, t0 + 2.8, t0 + 3.2) }}>= 30 ft!</div>
    </div>
  );
};

export const Ch5: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const c = camAt(KEYS, t);
  const sceneOn = (t < 273.0) || (t > 281.9 && t < 288.0) || (t > 293.3 && t < 299.4);
  const isth = proj(c, 32.3, 30.6);
  const gray = interpolate(t, [258.6, 258.9], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "#e6d8b6", overflow: "hidden" }}>
      <MapView keys={KEYS} t={t} hidden={sceneOn}>
        {(c) => (
          <>
            {/* los dos mares: mismo nivel */}
            {vis(t, 276.0, 281.6) && [[32.25, 31.55, "Mediterranean"], [32.62, 29.6, "Red Sea"]].map(([lo, la, n], i) => {
              const [x, y] = proj(c, lo as number, la as number); const s = pop(f, 276.15 + i * 0.25, 10) * fadeOut(t, 281.6);
              return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, textAlign: "center" }}>
                <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 26, color: "#fff", background: "#2f6fb8", padding: "4px 12px", borderRadius: 6, border: "2px solid #fff", textTransform: "uppercase" }}>{n}</div>
                <div style={{ fontFamily: HAND, fontSize: 60, color: "#26314a", textShadow: "0 0 8px #f3e6c4" }}>0 ft</div>
              </div>;
            })}
            {/* la medición de 1847, estaca por estaca */}
            {vis(t, 288.2, 292.9) && (() => {
              const p = SURVEY.map(([lo, la]) => proj(c, lo, la)); const k = ramp(t, 288.3, 290.5, Easing.linear);
              const q = partial(p, k);
              return <svg width={1920} height={1080} style={{ position: "absolute", opacity: fadeOut(t, 292.9) }}>
                <path d={dpath(q)} fill="none" stroke="#26314a" strokeWidth={5} strokeDasharray="4 10" />
                {Array.from({ length: Math.floor(k * 24) }).map((_, i) => { const r = partial(p, (i + 1) / 24); const [x, y] = r[r.length - 1]; return <g key={i}><line x1={x} y1={y} x2={x} y2={y - 26} stroke="#b3261e" strokeWidth={4} /><rect x={x} y={y - 26} width={14} height={10} fill="#b3261e" /></g>; })}
              </svg>;
            })()}
            {/* "and by then…": el canal que todavía no existe, en línea de puntos */}
            {vis(t, 299.9, 305) && <svg width={1920} height={1080} style={{ position: "absolute" }}><path d={dpath(partial(MODERN.map(([lo, la]) => proj(c, lo, la)), ramp(t, 300.0, 301.6)))} fill="none" stroke="#fff" strokeWidth={10} strokeDasharray="20 14" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 8px #8fd0ff)" }} /></svg>}
          </>
        )}
      </MapView>
      <YearNote f={f} t={t} marks={[[256.9, "1799"], [277.9, "1840s"], [281.6, "1847"]]} />

      {/* la inundación imaginada se congela: era mentira; después los agrimensores en guerra */}
      <ScenePortal t={t} open={[256.9, 256.9]} close={[272.9, 273.4]} o={[960, 540]} cpt={isth}>
        <Chain t={t} f={f} end={273.4} shots={[
          [256.9, (t) => <AbsoluteFill style={{ filter: `grayscale(${gray}) contrast(${1 + gray * 0.15})` }}><AnimeScene t={Math.min(t, 258.75)} f={f} t0={249.5} t1={260.6} bg="bg_flood" z0={1.04} z1={1.24} px={-110} py={40} chars={[]} /></AbsoluteFill>],
          [260.35, (t) => <><AnimeScene t={t} f={f} t0={260.3} t1={273.4} bg="bg_survey_war" z0={1.02} z1={1.16} px={60} chars={[]} /><Dust f={f} op={0.45} /></>, "whip"],
        ]} />
      </ScenePortal>
      {vis(t, 258.6, 260.3) && <AbsoluteFill style={{ background: "repeating-linear-gradient(transparent 0 6px, rgba(255,255,255,.06) 6px 8px)", pointerEvents: "none" }} />}
      <BigWord f={f} t={t} t0={257.0} t1={258.55} text="TERRIFYING." y={180} size={120} />
      <Stamp f={f} t={t} t0={259.1} t1={260.3} x={960} y={540} text="Wrong" size={170} />
      {[["a war", 262.1], ["the heat", 263.0], ["Bedouin raiders", 264.2], ["drifting instruments", 266.2]].map(([s, t0], i) => (
        <Note key={i} f={f} t={t} t0={t0 as number} t1={268.4} x={420} y={230 + i * 140} w={480} rot={-3 + i * 2} size={44}>✓ {s}</Note>
      ))}
      {vis(t, 268.5, 273.3) && <AbsoluteFill style={{ background: "#1a1208", opacity: 0.45 * ramp(t, 268.5, 268.9) * fadeOut(t, 273.3), pointerEvents: "none" }} />}
      <ErrorStairs f={f} t={t} t0={268.6} t1={273.3} />
      <BigWord f={f} t={t} t0={276.2} t1={277.8} text={<span>THE <span style={{ color: "#ffd23a" }}>SAME</span> LEVEL</span>} y={170} size={120} />
      <Note f={f} t={t} t0={278.6} t1={281.4} x={1480} y={850} w={420} rot={3} size={48}>proof? not until<br /><b>the 1840s</b></Note>

      {/* 1847: el equipo franco-británico-austríaco */}
      <ScenePortal t={t} open={[281.5, 282.0]} close={[287.9, 288.4]} o={isth} cpt={isth}>
        <AnimeScene t={t} f={f} t0={281.5} t1={288.4} bg="bg_survey_1847" z0={1.02} z1={1.13} px={-60} chars={[]} />
      </ScenePortal>
      {["fr", "gb", "at"].map((cc, i) => <Flag key={cc} f={f} t={t} cc={cc} x={720 + i * 240} y={170} t0={[283.36, 283.8, 284.3][i]} t1={287.9} w={150} />)}
      <BigWord f={f} t={t} t0={286.1} t1={287.9} text="A CAREFUL SURVEY" y={930} size={100} />
      <BigWord f={f} t={t} t0={288.4} t1={290.1} text="INCH BY INCH" y={170} size={110} />
      <Note f={f} t={t} t0={290.3} t1={292.9} x={1480} y={820} w={440} rot={3} size={50}>difference:<br /><b style={{ fontSize: 96, color: "#1d6b3a" }}>≈ 0</b></Note>

      {/* Negrelli y su plan directo sin esclusas */}
      <ScenePortal t={t} open={[292.9, 293.4]} close={[299.3, 299.8]} o={isth} cpt={isth}>
        <AnimeScene t={t} f={f} t0={292.9} t1={299.8} bg="bg_drafting" z0={1.03} z1={1.12} px={50} chars={[{ src: "ch_negrelli", x: 420, bottom: 10, h: 940, tIn: 293.1, from: -150 }]} sand="#ffffff" />
      </ScenePortal>
      <Caption f={f} t={t} t0={293.7} t1={299.3} x={420} y={1010} text="Alois Negrelli" flag="at" />
      <MiniMap f={f} t={t} t0={295.4} t1={299.3} lon={32.42} lat={30.6} z={7.5} title="sea to sea">
        {(mc) => <CanalLine c={mc} pts={MODERN} k={ramp(t, 295.6, 297.4)} w={30} />}
      </MiniMap>
      <Note f={f} t={t} t0={298.1} t1={299.3} x={1450} y={760} w={360} rot={3} size={56}>locks: <b style={{ color: "#b3261e" }}>none</b></Note>

      {/* el hombre que ya estaba enamorado del canal (la foto sigue en el cap. 6) */}
      <Photo f={f} t={t} t0={300.75} t1={309.4} src="suez/pd/lesseps_nadar.jpg" x={1420} y={500} w={430} h={560} rot={4} pos="50% 25%" />
      <BigWord f={f} t={t} t0={303.5} t1={304.9} text="❤" x={1600} y={260} size={150} color="#e8414d" />
      <Vignette />
    </AbsoluteFill>
  );
};
