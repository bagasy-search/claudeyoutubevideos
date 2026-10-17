// Cap. 10 (669,3–753,5): el tratado de 1888, la yugular del Imperio, Nasser 1956 y la nacionalización,
// la invasión y la retirada, la estatua derribada, el cierre de 1967 y la Flota Amarilla, el Ever Given.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FPS, Key, MapView, Tag, BigWord, Stamp, Note, Count, ScenePortal, Chain, Vignette, YearNote, Caption, Route, Flag, Photo, CanalLine, proj, partial, dpath, ramp, fadeOut, vis, camAt, pop, rnd, clamp, HAND, SANS } from "./kit";
import { PL, SUEZ_ROUTE, MODERN } from "./geo";
import { AnimeScene } from "./anime";

export const CH10: [number, number] = [669.3, 753.5];
const KEYS: Key[] = [
  [669.3, 29.0, 40.6, 3.4],   // Constantinopla
  [670.4, 29.0, 40.9, 4.0],
  [678.4, 29.0, 40.9, 4.0],
  [682.6, 40, 30, 0.62],      // la yugular del Imperio
  [686.2, 40, 30, 0.66],
  [687.6, 29.92, 31.2, 6.0],  // Alejandría
  [688.1, 29.92, 31.2, 6.4],
  [704.2, 33.0, 31.0, 3.2],   // la invasión
  [708.0, 33.0, 31.0, 2.2],
  [711.3, 30, 34, 1.4],
  [714.0, 32.3, 31.2, 8.0],
  [718.8, 32.3, 30.6, 8.0],   // cerrado en 1967
  [725.5, 32.4, 30.35, 12.0], // los Lagos Amargos
  [735.7, 32.35, 30.5, 9.0],
  [743.2, 32.4, 30.5, 7.0],   // la fila en las dos puntas
  [753.5, 32.4, 30.5, 6.6],
];

// estampilla de la "Great Bitter Lake Association" dibujada a mano
const PostStamp: React.FC<{ f: number; t: number; t0: number; t1: number }> = ({ f, t, t0, t1 }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 10) * fadeOut(t, t1);
  return (
    <div style={{ position: "absolute", left: 1460, top: 560, width: 330, height: 400, transform: `translate(-50%,-50%) scale(${s}) rotate(6deg)`, background: "#fff", padding: 14, boxShadow: "0 14px 30px rgba(0,0,0,.5)",
      WebkitMaskImage: "radial-gradient(circle at 10px 10px, transparent 7px, #000 7.5px)", WebkitMaskSize: "20px 20px", WebkitMaskPosition: "-10px -10px" }}>
      <div style={{ width: "100%", height: "100%", background: "linear-gradient(#f6d24a,#e8a92a)", border: "3px solid #8a5a10", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: 14, boxSizing: "border-box" }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 22, color: "#5a3a08", textAlign: "center", lineHeight: 1.1 }}>GREAT BITTER LAKE<br />ASSOCIATION</div>
        <svg width={220} height={120}><path d="M10,70 L210,70 L190,104 L30,104 Z" fill="#5a3a08" /><rect x={70} y={40} width={60} height={30} fill="#5a3a08" /><rect x={140} y={20} width={14} height={50} fill="#5a3a08" /><path d="M0,112 q30,-12 60,0 t60,0 t60,0 t60,0" stroke="#2f6fb8" strokeWidth={6} fill="none" /></svg>
        <div style={{ fontFamily: HAND, fontSize: 40, color: "#5a3a08" }}>1967 – 1975</div>
      </div>
    </div>
  );
};

export const Ch10: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const c = camAt(KEYS, t);
  const sceneOn = (t > 670.9 && t < 678.4) || (t > 688.6 && t < 704.1) || (t > 705.9 && t < 708.1) || (t > 714.6 && t < 718.7) || (t > 726.1 && t < 735.5) || (t > 737.2 && t < 743.0);
  const ist = proj(c, PL.istanbul[0], PL.istanbul[1]);
  const alx = proj(c, PL.alexandria[0], PL.alexandria[1]);
  const ps = proj(c, PL.portSaid[0], PL.portSaid[1]);
  const bit = proj(c, 32.4, 30.32);
  return (
    <AbsoluteFill style={{ background: "#e6d8b6", overflow: "hidden" }}>
      <MapView keys={KEYS} t={t} hidden={sceneOn}>
        {(c) => (
          <>
            <Tag c={c} f={f} t={t} lon={PL.istanbul[0]} lat={PL.istanbul[1]} t0={669.6} t1={670.9} text="Constantinople" size={34} dot dy={-44} />
            {/* la yugular: la ruta del Imperio late */}
            {vis(t, 682.6, 686.3) && (() => {
              const p = SUEZ_ROUTE.map(([lo, la]) => proj(c, lo, la)); const k = ramp(t, 682.8, 684.4);
              const beat = 1 + 0.5 * Math.max(0, Math.sin((t - 684.4) * 9));
              return <svg width={1920} height={1080} style={{ position: "absolute", opacity: fadeOut(t, 686.3) }}>
                <path d={dpath(partial(p, k))} fill="none" stroke="#b3261e" strokeWidth={10 * beat} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 10px #ff5040)" }} />
              </svg>;
            })()}
            <Flag c={c} f={f} t={t} cc="gb" lon={-0.1} lat={51.5} t0={684.8} t1={686.3} w={100} dy={-60} />
            <Tag c={c} f={f} t={t} lon={72.8} lat={19} t0={684.4} t1={686.3} text="British India" size={28} dot dy={-40} />
            <Tag c={c} f={f} t={t} lon={PL.alexandria[0]} lat={PL.alexandria[1]} t0={687.7} t1={688.7} text="Alexandria" size={34} dot dy={-44} />
            {/* la invasión de 1956: tres flechas sobre el canal */}
            {vis(t, 704.3, 706.0) && [["gb", 33.4, 34.9, 704.4], ["fr", 30.5, 33.8, 704.9], ["il", 34.8, 30.9, 705.4]].map(([cc, lo, la, t0], i) => {
              const [x0, y0] = proj(c, lo as number, la as number), [x1, y1] = ps; const k = ramp(t, t0 as number, (t0 as number) + 0.4);
              return <div key={i}>
                <svg width={1920} height={1080} style={{ position: "absolute" }}><path d={`M${x0},${y0} L${x0 + (x1 - x0) * k},${y0 + (y1 - y0) * k}`} stroke="#b3261e" strokeWidth={12} strokeLinecap="round" markerEnd="" /></svg>
                <Flag f={f} t={t} cc={cc as string} x={x0} y={y0} t0={t0 as number} t1={706.0} w={100} />
              </div>;
            })}
            {/* 1967: el canal cerrado */}
            {vis(t, 718.8, 726.2) && <CanalLine c={c} pts={MODERN} k={1} w={Math.max(8, c.z * 0.9)} color={t > 722.4 ? "#7a7a7a" : "#4f9fe0"} />}
            {vis(t, 722.5, 726.2) && [[32.31, 31.05], [32.55, 29.98]].map(([lo, la], i) => { const [x, y] = proj(c, lo, la); const s = pop(f, 722.6 + i * 0.2, 9); return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, fontFamily: SANS, fontWeight: 900, fontSize: 90, color: "#b3261e", textShadow: "0 0 8px #fff" }}>✕</div>; })}
            {vis(t, 725.6, 726.2) && Array.from({ length: 14 }).map((_, i) => { const [x, y] = proj(c, 32.36 + (rnd(i) - 0.5) * 0.12, 30.36 + (rnd(i + 7) - 0.5) * 0.08); return <div key={i} style={{ position: "absolute", left: x, top: y, width: 18, height: 8, background: "#e8b92a", border: "2px solid #5a3a08", transform: `scale(${pop(f, 725.7 + i * 0.03, 9)})` }} />; })}
            {/* Ever Given: la fila en las dos puntas */}
            {vis(t, 743.1, 753.5) && Array.from({ length: Math.floor(ramp(t, 743.3, 745.0, Easing.linear) * 160) }).map((_, i) => {
              const north = i % 2 === 0; const j = Math.floor(i / 2); const a = rnd(i) * Math.PI;
              const [x, y] = north ? proj(c, 32.3 + Math.cos(a) * (0.08 + j * 0.006), 31.35 + Math.sin(a) * (0.04 + j * 0.004)) : proj(c, 32.56 + Math.cos(a) * (0.05 + j * 0.005), 29.85 - Math.sin(a) * (0.05 + j * 0.005));
              return <div key={i} style={{ position: "absolute", left: x, top: y, width: 10, height: 5, background: "#26314a", transform: `rotate(${rnd(i + 2) * 180}deg)`, opacity: fadeOut(t, 753.5) }} />;
            })}
            {vis(t, 743.1, 753.5) && (() => { const [x, y] = proj(c, 32.58, 30.02); return <div style={{ position: "absolute", left: x, top: y, width: 44, height: 12, background: "#1d6b3a", border: "2px solid #fff", transform: "translate(-50%,-50%) rotate(75deg)" }} />; })()}
            <Tag c={c} f={f} t={t} lon={32.58} lat={30.02} t0={743.4} t1={753.4} text="Ever Given" size={28} bg="#1d6b3a" dx={140} />
          </>
        )}
      </MapView>
      <YearNote f={f} t={t} marks={[[669.3, "1888"], [682.6, "1900s"], [686.6, "1956"], [718.8, "1967"], [735.8, "2021"]]} />

      {/* el tratado de Constantinopla */}
      <ScenePortal t={t} open={[670.4, 670.9]} close={[678.2, 678.7]} o={ist} cpt={ist}>
        <AnimeScene t={t} f={f} t0={670.4} t1={678.7} bg="bg_constantinople" z0={1.02} z1={1.13} px={-60} chars={[]} />
      </ScenePortal>
      <Caption f={f} t={t} t0={671.2} t1={673.4} x={960} y={1010} text="The Great Powers · Constantinople, 1888" />
      <Note f={f} t={t} t0={674.8} t1={678.1} x={480} y={260} w={480} rot={-3} size={48}>open to ships of<br /><b>every nation</b></Note>
      <Note f={f} t={t} t0={676.8} t1={678.1} x={1460} y={260} w={380} rot={3} size={48}>✓ in war</Note>
      <Note f={f} t={t} t0={677.6} t1={678.1} x={1460} y={390} w={380} rot={-2} size={48}>✓ in peace</Note>
      <BigWord f={f} t={t} t0={678.6} t1={680.4} text="A BEAUTIFUL PROMISE" y={230} size={100} />
      <Stamp f={f} t={t} t0={680.9} t1={682.5} x={960} y={620} text="Tested again & again" size={80} />
      <BigWord f={f} t={t} t0={683.4} t1={686.2} text={<span>THE <span style={{ color: "#ff6a5c" }}>JUGULAR</span> OF THE BRITISH EMPIRE</span>} y={950} size={80} />

      {/* Nasser, 1956 */}
      <BigWord f={f} t={t} t0={686.7} t1={688.5} text="1956" y={230} size={150} color="#ffd23a" />
      <ScenePortal t={t} open={[688.1, 688.6]} close={[703.9, 704.4]} o={alx} cpt={alx}>
        <Chain t={t} f={f} end={704.4} shots={[
          [688.1, (t) => <AnimeScene t={t} f={f} t0={688.1} t1={698.6} bg="bg_nasser_crowd" z0={1.02} z1={1.18} px={30} py={-30} chars={[]} />],
          [698.45, (t) => <AnimeScene t={t} f={f} t0={698.4} t1={704.4} bg="bg_takeover" z0={1.03} z1={1.14} px={-60} chars={[]} />, "whip"],
        ]} />
      </ScenePortal>
      <Photo f={f} t={t} t0={689.2} t1={693.0} src="suez/pd/nasser.jpg" x={1480} y={470} w={400} h={520} rot={4} pos="50% 25%" caption="Gamal Abdel Nasser" />
      <Caption f={f} t={t} t0={689.4} t1={692.8} x={480} y={1010} text="Alexandria, 26 July 1956" flag="eg" />
      {[0, 1, 2].map((i) => <BigWord key={i} f={f} t={t} t0={693.6 + i * 0.6} t1={696.4} text={<span style={{ opacity: 1 - i * 0.25 }}>“DE LESSEPS…”</span>} x={[620, 1300, 960][i]} y={[300, 460, 630][i]} size={86 - i * 8} color="#ffd23a" />)}
      <Note f={f} t={t} t0={696.6} t1={698.3} x={960} y={820} w={480} rot={-2} size={56}>= a <b>code word</b></Note>
      <Caption f={f} t={t} t0={699.3} t1={702.4} x={960} y={1010} text="Officers take over the company's offices" />
      <Stamp f={f} t={t} t0={703.0} t1={704.3} x={960} y={500} text="Nationalized" size={120} />

      {/* la invasión y la retirada */}
      <ScenePortal t={t} open={[705.8, 706.3]} close={[707.9, 708.4]} o={ps} cpt={ps}>
        <AnimeScene t={t} f={f} t0={705.8} t1={708.4} bg="bg_invasion" z0={1.03} z1={1.12} px={40} chars={[]} />
      </ScenePortal>
      <BigWord f={f} t={t} t0={705.9} t1={707.4} text="INVASION" y={230} size={130} color="#ff6a5c" />
      {vis(t, 708.3, 711.3) && <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Flag f={f} t={t} cc="us" x={520} y={480} t0={708.9} t1={711.2} w={200} />
        <Flag f={f} t={t} cc="su" x={1400} y={480} t0={709.9} t1={711.2} w={200} />
        <BigWord f={f} t={t} t0={707.5} t1={711.2} text={<span>FORCED TO <span style={{ color: "#ffd23a" }}>BACK DOWN</span></span>} y={230} size={100} />
      </AbsoluteFill>}
      <BigWord f={f} t={t} t0={711.5} t1={713.9} text={<span>THE END OF THE <span style={{ color: "#ffd23a" }}>OLD EMPIRES</span></span>} y={540} size={110} />

      {/* la estatua de Lesseps sale del pedestal */}
      <ScenePortal t={t} open={[714.1, 714.6]} close={[718.5, 719.0]} o={ps} cpt={ps}>
        <AnimeScene t={t} f={f} t0={714.1} t1={719.0} bg="bg_statue" z0={1.03} z1={1.16} px={0} py={-40} chars={[]} />
      </ScenePortal>
      <Photo f={f} t={t} t0={714.9} t1={718.5} src="suez/pd/statue.jpg" x={1480} y={460} w={380} h={500} rot={4} caption="The statue · Port Said" />
      <Stamp f={f} t={t} t0={717.0} t1={718.5} x={760} y={540} text="Pulled down" size={110} />
      <BigWord f={f} t={t} t0={719.0} t1={721.6} text="SHUT MORE THAN ONCE" y={230} size={100} />
      <Note f={f} t={t} t0={723.9} t1={725.6} x={1480} y={820} w={400} rot={3} size={50}>closed for<br /><b style={{ fontSize: 90 }}>8 years</b></Note>

      {/* la Flota Amarilla */}
      <ScenePortal t={t} open={[725.7, 726.2]} close={[735.3, 735.8]} o={bit} cpt={bit}>
        <Chain t={t} f={f} end={735.8} shots={[
          [725.7, (t) => <AnimeScene t={t} f={f} t0={725.7} t1={730.5} bg="bg_yellow_fleet" z0={1.02} z1={1.14} px={-50} chars={[]} />],
          [730.3, (t) => <AnimeScene t={t} f={f} t0={730.3} t1={735.8} bg="bg_ship_olympics" z0={1.03} z1={1.12} px={50} chars={[]} />, "whip"],
        ]} />
      </ScenePortal>
      <Note f={f} t={t} t0={725.9} t1={730.1} x={480} y={260} w={440} rot={-3} size={52}><b style={{ fontSize: 96 }}><Count t={t} t0={725.9} t1={726.6} from={0} to={14} /></b> ships trapped</Note>
      <Caption f={f} t={t} t0={727.4} t1={730.1} x={960} y={1010} text="The Great Bitter Lake · the “Yellow Fleet”" />
      {[["✓ own league", 731.6], ["✓ own Olympics", 732.9], ["✓ own stamps", 734.2]].map(([s, t0], i) => (
        <Note key={i} f={f} t={t} t0={t0 as number} t1={735.5} x={420} y={230 + i * 140} w={440} rot={-3 + i * 2} size={46}>{s}</Note>
      ))}
      <PostStamp f={f} t={t} t0={734.3} t1={735.6} />

      {/* el Ever Given */}
      <BigWord f={f} t={t} t0={735.9} t1={737.1} text="2021" y={230} size={150} color="#ffd23a" />
      <ScenePortal t={t} open={[737.1, 737.6]} close={[742.9, 743.4]} o={proj(c, 32.58, 30.02)} cpt={[960, 540]}>
        <Chain t={t} f={f} end={743.4} shots={[
          [737.1, (t) => <AnimeScene t={t} f={f} t0={737.1} t1={740.4} bg="bg_ever_given" z0={1.02} z1={1.12} px={-40} chars={[]} />],
          [740.2, (t) => <AbsoluteFill style={{ background: "#0a0a12" }}><Photo f={f} t={t} t0={740.2} t1={743.4} src="suez/pd/evergiven.jpg" x={960} y={520} w={1100} h={700} rot={-2} caption="Seen from space · March 2021" from={[0, 0]} /></AbsoluteFill>, "flash"],
        ]} />
      </ScenePortal>
      <BigWord f={f} t={t} t0={738.3} t1={740.1} text={<span>ONE SINGLE SHIP · <span style={{ color: "#ffd23a" }}>SIDEWAYS</span></span>} y={230} size={90} />
      <Note f={f} t={t} t0={741.6} t1={742.9} x={1560} y={240} w={300} rot={4} size={50}><b>6 days</b></Note>
      <Note f={f} t={t} t0={743.4} t1={745.9} x={480} y={240} w={420} rot={-3} size={48}><b>hundreds</b> of ships<br />piled up</Note>
      <Note f={f} t={t} t0={746.1} t1={749.9} x={1460} y={260} w={480} rot={3} size={46}>trade frozen:<br /><b style={{ fontSize: 70 }}>$ billions / day</b></Note>
      <BigWord f={f} t={t} t0={748.6} t1={753.3} text={<span>ONE STUCK HULL<br /><span style={{ color: "#ffd23a", fontSize: 64 }}>in a channel 120 miles long</span></span>} y={900} size={96} />
      <Vignette />
    </AbsoluteFill>
  );
};
