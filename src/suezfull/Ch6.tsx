// Cap. 6 (304,9–399,2): Lesseps — el cónsul, Said y los macarrones, el salto a caballo, la concesión de 1854,
// el odio británico, las acciones vendidas al público y Egipto pagando un canal que sería de París.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FPS, Key, MapView, Tag, BigWord, Stamp, Note, Count, ScenePortal, Chain, Dust, Vignette, YearNote, Caption, Route, Flag, Photo, proj, partial, dpath, ramp, fadeOut, vis, camAt, pop, rnd, clamp, HAND, SANS } from "./kit";
import { PL, MODERN, SUEZ_ROUTE } from "./geo";
import { AnimeScene } from "./anime";

export const CH6: [number, number] = [304.9, 399.2];
const KEYS: Key[] = [
  [304.9, 32.3, 30.6, 8.0],
  [312.6, 30.3, 31.0, 5.0],   // hacia Alejandría
  [313.8, 29.92, 31.2, 5.5],
  [328.3, 30.5, 30.8, 4.8],
  [331.4, 31.0, 30.5, 4.0],
  [332.2, 14, 40, 1.15],      // París → Alejandría
  [334.6, 22, 36, 1.3],
  [335.1, 29, 31, 2.8],
  [352.6, 32.3, 30.6, 6.5],   // 99 años
  [356.4, 32.3, 30.6, 6.8],
  [358.6, 10, 45, 1.5],
  [360.4, -0.1, 51.4, 2.4],   // Londres
  [362.6, 0, 50, 2.0],
  [363.6, 35, 30, 0.75],      // "on the road to India"
  [367.9, 32, 32, 0.85],
  [376.8, 2, 49, 1.9],        // "went around them"
  [378.9, 3, 48.5, 2.1],
  [389.2, 8, 47, 1.0],        // el resto de Europa no compra
  [391.6, 10, 46, 1.05],
  [399.2, 10, 46, 1.1],
];
const AROUND: [number, number][] = [[2.35, 48.86], [-2, 52.5], [-0.5, 55], [3.5, 54], [2.5, 50.5], [2.35, 48.9]];

// la línea de tiempo de los 99 años
const LeaseBar: React.FC<{ f: number; t: number; t0: number; t1: number }> = ({ f, t, t0, t1 }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 12) * fadeOut(t, t1);
  const k = ramp(t, t0 + 0.3, t0 + 1.6, Easing.out(Easing.cubic));
  return (
    <div style={{ position: "absolute", left: 960, top: 860, width: 1300, height: 150, transform: `translate(-50%,-50%) scale(${s})`, background: "linear-gradient(#fbf6e6,#efe4c4)", border: "4px solid #fff", borderRadius: 8, boxShadow: "0 14px 34px rgba(0,0,0,.45)" }}>
      <div style={{ position: "absolute", left: 40, top: 62, width: 1220, height: 26, background: "#d8c8a4", borderRadius: 13 }} />
      <div style={{ position: "absolute", left: 40, top: 62, width: 1220 * k, height: 26, background: "linear-gradient(90deg,#2f6fb8,#4f9fe0)", borderRadius: 13 }} />
      <div style={{ position: "absolute", left: 40, top: 10, fontFamily: HAND, fontSize: 44, color: "#26314a" }}>opens</div>
      <div style={{ position: "absolute", right: 40, top: 10, fontFamily: HAND, fontSize: 44, color: "#26314a" }}>+99 years</div>
      <div style={{ position: "absolute", left: 650, top: 92, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 900, fontSize: 40, color: "#b3261e" }}><Count t={t} t0={t0 + 0.3} t1={t0 + 1.6} from={0} to={99} /> YEARS OF CONTROL</div>
    </div>
  );
};
// quién compró la compañía (1858): Francia ~52 %, Said ~44 %
const Pie: React.FC<{ f: number; t: number; t0: number; t1: number }> = ({ f, t, t0, t1 }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 12) * fadeOut(t, t1);
  const k = ramp(t, t0 + 0.2, t0 + 1.2, Easing.out(Easing.cubic));
  const a = 0.44 * k;
  const arc = (p: number) => { const ang = p * Math.PI * 2 - Math.PI / 2; return [Math.cos(ang) * 200, Math.sin(ang) * 200]; };
  const [x1, y1] = arc(a);
  return (
    <div style={{ position: "absolute", left: 1460, top: 520, transform: `translate(-50%,-50%) scale(${s})`, background: "linear-gradient(#fbf6e6,#efe4c4)", border: "4px solid #fff", borderRadius: 10, boxShadow: "0 14px 34px rgba(0,0,0,.45)", padding: 24, textAlign: "center" }}>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 28, color: "#26314a" }}>WHO OWNED THE COMPANY</div>
      <svg width={460} height={460} viewBox="-230 -230 460 460">
        <circle r={200} fill="#24427a" stroke="#fff" strokeWidth={6} />
        {a > 0.001 && <path d={`M0,0 L0,-200 A200,200 0 ${a > 0.5 ? 1 : 0} 1 ${x1},${y1} Z`} fill="#c8102e" stroke="#fff" strokeWidth={6} />}
        <text x={90} y={-30} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={40} fill="#fff" opacity={k}>EGYPT</text>
        <text x={90} y={14} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={44} fill="#fff" opacity={k}>{Math.round(44 * k)}%</text>
        <text x={-80} y={70} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={36} fill="#fff">FRENCH</text>
        <text x={-80} y={112} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={36} fill="#fff">SAVERS</text>
      </svg>
    </div>
  );
};

export const Ch6: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const c = camAt(KEYS, t);
  const sceneOn = (t > 314.3 && t < 327.9) || (t > 335.6 && t < 352.2) || (t > 368.6 && t < 376.4) || (t > 379.6 && t < 388.8) || (t > 392.1);
  const alx = proj(c, PL.alexandria[0], PL.alexandria[1]);
  const lon = proj(c, PL.london[0], PL.london[1]);
  const par = proj(c, PL.paris[0], PL.paris[1]);
  const isth = proj(c, 32.3, 30.6);
  const shake = t > 341.6 && t < 342.2 ? Math.sin(t * 90) * 10 * (342.2 - t) : 0;
  return (
    <AbsoluteFill style={{ background: "#e6d8b6", overflow: "hidden" }}>
      <MapView keys={KEYS} t={t} hidden={sceneOn}>
        {(c) => (
          <>
            {vis(t, 304.9, 309.0) && <svg width={1920} height={1080} style={{ position: "absolute" }}><path d={dpath(MODERN.map(([lo, la]) => proj(c, lo, la)))} fill="none" stroke="#fff" strokeWidth={10} strokeDasharray="20 14" strokeLinecap="round" opacity={fadeOut(t, 309.0, 0.6)} /></svg>}
            <Route c={c} t={t} f={f} pts={[[2.35, 48.86], [4.8, 45.8], [5.4, 43.3], [9, 40], [15, 37], [22, 34], [29.9, 31.25]]} t0={332.3} t1={334.5} out={335.4} color="#24427a" w={8} ship shipSize={90} />
            <Tag c={c} f={f} t={t} lon={PL.paris[0]} lat={PL.paris[1]} t0={332.2} t1={335.4} text="Paris" size={28} dot dy={-38} />
            {/* 99 años: el canal futuro */}
            {vis(t, 352.2, 356.6) && <svg width={1920} height={1080} style={{ position: "absolute" }}><path d={dpath(partial(MODERN.map(([lo, la]) => proj(c, lo, la)), ramp(t, 352.4, 353.6)))} fill="none" stroke="#fff" strokeWidth={14} strokeDasharray="22 14" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 8px #8fd0ff)" }} /></svg>}
            <Flag c={c} f={f} t={t} cc="gb" lon={PL.london[0]} lat={PL.london[1]} t0={359.8} t1={363.4} w={150} dy={-90} />
            <Route c={c} t={t} f={f} pts={SUEZ_ROUTE} t0={363.4} t1={365.4} out={368.4} color="#c8102e" w={8} dash />
            <Flag c={c} f={f} t={t} cc="fr" lon={32.3} lat={30.6} t0={363.75} t1={368.4} w={110} />
            <Tag c={c} f={f} t={t} lon={PL.india[0]} lat={PL.india[1]} t0={365.2} t1={368.4} text="India" size={30} bg="#a23b1d" />
            <Tag c={c} f={f} t={t} lon={PL.paris[0]} lat={PL.paris[1]} t0={366.9} t1={368.4} text="Paris" size={30} dot dy={-38} />
            {/* "went around them" */}
            <Route c={c} t={t} f={f} pts={AROUND} t0={377.0} t1={378.2} out={379.6} color="#24427a" w={9} />
            <Tag c={c} f={f} t={t} lon={PL.london[0]} lat={PL.london[1]} t0={376.9} t1={379.6} text="London" size={30} dot dy={-38} bg="#7a1f1f" />
            {/* el resto de Europa no compra */}
            {vis(t, 389.4, 392.0) && ([["gb", -2, 53], ["de", 10.5, 51], ["at", 15, 47.6], ["it", 12.5, 42.8], ["es", -3.7, 40.2], ["ot", 30, 39.5]] as [string, number, number][]).map(([cc, lo, la], i) => {
              const [x, y] = proj(c, lo, la); const x0 = ramp(t, 389.9 + i * 0.18, 390.2 + i * 0.18);
              return <div key={cc}><Flag f={f} t={t} cc={cc} x={x} y={y} t0={389.4 + i * 0.12} t1={392.0} w={90} />
                {x0 > 0 && <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${x0})`, fontFamily: SANS, fontWeight: 900, fontSize: 80, color: "#d4241c", opacity: fadeOut(t, 392.0), textShadow: "0 0 6px #fff" }}>✕</div>}</div>;
            })}
          </>
        )}
      </MapView>
      <YearNote f={f} t={t} marks={[[304.9, "1840s"], [313.9, "1830s"], [328.4, "1854"], [345.6, "Nov 1854"], [379.2, "1858"]]} />

      {/* la foto de Lesseps (viene del cap. 5) */}
      <Photo f={f} t={t} t0={300.75} t1={309.4} src="suez/pd/lesseps_nadar.jpg" x={1420} y={500} w={430} h={560} rot={4} pos="50% 25%" />
      <Caption f={f} t={t} t0={305.6} t1={309.2} x={1420} y={880} text="Ferdinand de Lesseps" flag="fr" />
      <Stamp f={f} t={t} t0={307.85} t1={309.2} x={1420} y={460} text="Not an engineer" size={60} rot={-14} />
      {[["charming", 310.6], ["stubborn", 311.3], ["a little reckless", 312.1]].map(([s, t0], i) => (
        <Note key={i} f={f} t={t} t0={t0 as number} t1={313.9} x={520} y={330 + i * 150} w={440} rot={-3 + i * 2} size={48}>✓ {s}</Note>
      ))}

      {/* el consulado: el joven cónsul y el príncipe goloso */}
      <ScenePortal t={t} open={[313.85, 314.35]} close={[327.85, 328.35]} o={alx} cpt={alx}>
        <Chain t={t} f={f} end={328.35} shots={[
          [313.85, (t) => <AnimeScene t={t} f={f} t0={313.8} t1={324.3} bg="bg_consulate" z0={1.02} z1={1.12} px={40} chars={[{ src: "ch_lesseps_young", x: 1480, bottom: 10, h: 930, tIn: 314.3, from: 140 }, { src: "ch_said_teen", x: 420, bottom: 10, h: 780, tIn: 319.15, from: -160 }]} sand="#ffffff" />],
          [324.15, (t) => <AnimeScene t={t} f={f} t0={324.1} t1={328.35} bg="bg_macaroni" z0={1.03} z1={1.16} px={30} py={10} chars={[]} />, "whip"],
        ]} />
      </ScenePortal>
      <Caption f={f} t={t} t0={315.0} t1={318.9} x={1480} y={1010} text="Young consul · Alexandria" flag="fr" />
      <Caption f={f} t={t} t0={320.4} t1={324.0} x={420} y={1010} text="Prince Said" />
      <Note f={f} t={t} t0={322.6} t1={324.0} x={960} y={300} w={360} rot={-3} size={52}>strict diet <b style={{ color: "#b3261e" }}>✕</b></Note>
      <BigWord f={f} t={t} t0={326.75} t1={328.2} text={<span style={{ color: "#ffd23a" }}>MACARONI!</span>} y={170} size={110} />
      {/* veinte años después */}
      <Photo f={f} t={t} t0={328.6} t1={331.4} src="suez/pd/said.jpg" x={1380} y={500} w={380} h={500} rot={3} caption="Said Pasha" pos="50% 30%" />
      <Note f={f} t={t} t0={329.3} t1={331.4} x={560} y={500} w={420} rot={-3} size={52}>20 years later:<br /><b>ruler of Egypt</b></Note>
      <Note f={f} t={t} t0={332.4} t1={335.0} x={1460} y={830} w={420} rot={3} size={50}>not a single<br />day wasted</Note>

      {/* el viaje por el desierto, el salto, la carpa */}
      <ScenePortal t={t} open={[335.15, 335.65]} close={[352.1, 352.6]} o={proj(c, 29.5, 30.3)} cpt={isth}>
        <AbsoluteFill style={{ transform: `translateY(${shake}px)` }}>
          <Chain t={t} f={f} end={352.6} shots={[
            [335.15, (t) => <><AnimeScene t={t} f={f} t0={335.1} t1={338.4} bg="bg_caravan" z0={1.03} z1={1.12} px={70} chars={[]} /><Dust f={f} op={0.4} /></>],
            [338.15, (t) => <AnimeScene t={t} f={f} t0={338.1} t1={344.6} bg="bg_horse_jump" z0={1.0} z1={1.18} px={-90} py={-20} chars={[]} />, "whip"],
            [344.45, (t) => <AnimeScene t={t} f={f} t0={344.4} t1={352.6} bg="bg_tent" z0={1.03} z1={1.12} px={40} chars={[{ src: "ch_said", x: 400, bottom: 10, h: 930, tIn: 344.8, from: -140 }]} sand="#ffe7c2" />, "ink"],
          ]} />
        </AbsoluteFill>
      </ScenePortal>
      <Caption f={f} t={t} t0={335.7} t1={338.0} x={1450} y={1010} text="Said Pasha's desert trip" />
      <BigWord f={f} t={t} t0={341.6} t1={344.2} text={<span>OVER A <span style={{ color: "#ffd23a" }}>STONE WALL</span></span>} y={170} size={100} />
      <Caption f={f} t={t} t0={345.0} t1={349.0} x={400} y={1010} text="Said Pasha · viceroy of Egypt" />
      {/* la concesión con sello */}
      {vis(t, 348.9, 352.4) && (() => {
        const s = pop(f, 348.9, 12) * fadeOut(t, 352.4); const seal = ramp(t, 349.95, 350.1, Easing.in(Easing.quad));
        return <div style={{ position: "absolute", left: 1300, top: 520, width: 560, height: 640, transform: `translate(-50%,-50%) scale(${s}) rotate(3deg)`, background: "linear-gradient(#f7ecd0,#e8d6a8)", border: "4px solid #fff", borderRadius: 6, boxShadow: "0 20px 44px rgba(0,0,0,.55)", padding: 40, fontFamily: HAND, color: "#3a2a14" }}>
          <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 30, letterSpacing: 2, textAlign: "center" }}>CONCESSION</div>
          <div style={{ fontSize: 40, marginTop: 20, lineHeight: 1.2 }}>to cut the isthmus of Suez<br />and open a canal<br />from sea to sea…</div>
          <div style={{ fontSize: 34, marginTop: 30, opacity: 0.8 }}>30 November 1854</div>
          {seal > 0 && <div style={{ position: "absolute", right: 50, bottom: 50, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #e0423a, #8e1a14)", transform: `scale(${2.2 - 1.2 * seal})`, opacity: seal, boxShadow: "0 6px 12px rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f6c9a8", fontFamily: SANS, fontWeight: 900, fontSize: 30 }}>SAID</div>}
        </div>;
      })()}
      <LeaseBar f={f} t={t} t0={352.8} t1={356.4} />
      <Note f={f} t={t} t0={357.6} t1={359.4} x={560} y={300} w={360} rot={-3} size={56}>money? <b style={{ color: "#b3261e" }}>✕</b></Note>
      <Stamp f={f} t={t} t0={361.5} t1={363.3} x={lon[0]} y={lon[1] + 120} text="Hated it" size={110} />

      {/* Palmerston en los Comunes */}
      <ScenePortal t={t} open={[368.15, 368.65]} close={[376.35, 376.85]} o={lon} cpt={par}>
        <AnimeScene t={t} f={f} t0={368.1} t1={376.9} bg="bg_commons" z0={1.02} z1={1.14} px={-50} chars={[]} />
      </ScenePortal>
      <Photo f={f} t={t} t0={369.4} t1={376.3} src="suez/pd/palmerston.jpg" x={400} y={480} w={380} h={500} rot={-4} caption="Lord Palmerston" pos="50% 25%" />
      <BigWord f={f} t={t} t0={370.95} t1={372.3} text="“A SWINDLE”" y={170} size={120} color="#ffd23a" />
      <Stamp f={f} t={t} t0={372.35} t1={374.0} x={1250} y={540} text="Never" size={140} />
      <Stamp f={f} t={t} t0={375.4} t1={376.3} x={1250} y={540} text="Impossible" size={120} rot={8} />

      {/* 1858: las acciones al público */}
      <ScenePortal t={t} open={[379.15, 379.65]} close={[388.8, 389.3]} o={par} cpt={par}>
        <AnimeScene t={t} f={f} t0={379.1} t1={389.3} bg="bg_shares" z0={1.02} z1={1.15} px={60} chars={[]} />
      </ScenePortal>
      {vis(t, 380.6, 383.0) && Array.from({ length: 7 }).map((_, i) => {
        const k = ramp(t, 380.65 + i * 0.12, 381.6 + i * 0.12, Easing.out(Easing.quad));
        return <div key={i} style={{ position: "absolute", left: 300 + i * 220 + Math.sin(i * 3) * 40, top: -200 + k * (600 + rnd(i) * 300), width: 200, height: 130, transform: `rotate(${(rnd(i + 4) - 0.5) * 50 + k * 30}deg)`, background: "linear-gradient(#f3e8c8,#e2cf9d)", border: "6px double #6b4a1a", borderRadius: 4, boxShadow: "0 8px 16px rgba(0,0,0,.4)", opacity: fadeOut(t, 383.0), fontFamily: SANS, fontWeight: 900, fontSize: 18, color: "#6b4a1a", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>SUEZ CANAL<br />1 SHARE · 500 F</div>;
      })}
      {[["savers", 384.36], ["shopkeepers", 385.1], ["priests", 386.1], ["teachers", 386.6]].map(([n, t0], i) => vis(t, t0 as number, 388.6) ? (
        <div key={i} style={{ position: "absolute", left: 330 + i * 420, top: 960, transform: `translate(-50%,-50%) scale(${pop(f, t0 as number, 10) * fadeOut(t, 388.6)}) rotate(${i % 2 ? 2 : -2}deg)`, background: ["#24427a", "#9c6a1c", "#3a3a3a", "#1d6b3a"][i], color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 36, padding: "8px 18px", borderRadius: 6, border: "3px solid #fff", textTransform: "uppercase", boxShadow: "0 8px 18px rgba(0,0,0,.45)" }}>{n}</div>) : null)}
      <BigWord f={f} t={t} t0={387.55} t1={388.7} text="A PIECE OF THE DREAM" y={170} size={96} />

      {/* Said se queda con casi la mitad */}
      <ScenePortal t={t} open={[391.65, 392.15]} close={[399.2, 399.3]} o={isth} cpt={isth}>
        <AnimeScene t={t} f={f} t0={391.6} t1={401.0} bg="bg_certificates" z0={1.02} z1={1.12} px={-70} chars={[]} />
      </ScenePortal>
      <Pie f={f} t={t} t0={392.6} t1={399.0} />
      <Stamp f={f} t={t} t0={397.45} t1={399.1} x={600} y={560} text="Paris owns it" size={90} />
      <Vignette />
    </AbsoluteFill>
  );
};
