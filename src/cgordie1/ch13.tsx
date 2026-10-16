// Capítulo 13 — Haida Gwaii: el terremoto de 2012, SG̱ang Gwaay y el abeto dorado
import React from "react";
import { interpolate, Img } from "remotion";
import { Chapter, at, Tag, Pin, Icon, BigWord, Sticker, Line, Portal, PortalSpec, PL, P, pj, sf, pop, vis, win, ramp, fadeOut, clamp, SANS } from "./lib";

const S = at("and that brings me to something");
const T = {
  coast: at("out on the coast", S), haida: at("haida gwaii", S), queen: at("queen charlotte", S), wayout: at("way out in", S), western: at("western shore", S), fault: at("fault line", S), grind: at("grind past", S),
  oct: at("october of 2012", S), slipped: at("fault slipped", S), mag: at("magnitude 7.8", S), powerful: at("most powerful", S), shook: at("shook the islands", S), tsunami: at("tsunami", S), hawaii: at("as far as hawaii", S),
  else: at("something else happened", S), springs: at("hot springs", S), stopped: at("stopped flowing", S), tap: at("turned off the tap", S),
  remark: at("most remarkable", S), thousands: at("thousands of years", S), small: at("small island", S), eskang: at("eskang gwaii", S), village: at("old village site", S), poles: at("carved cedar poles", S), gray: at("weathered gray", S),
  heritage: at("world heritage", S), chose: at("chose to let", S), earth: at("return to the earth", S), lock: at("rather than lock", S), mist: at("in the mist", S), moss: at("moss on everything", S), back: at("stepped back", S),
  wild: at("wildlife secrets", S), isolated: at("isolated", S), developed: at("developed a little", S), bears: at("black bears", S), jaws: at("larger jaws", S), sci: at("scientists have long", S), lab: at("natural laboratory", S),
  famous: at("most famous tree", S), standing: at("isn't standing", S), sad: at("makes me sad", S), yakoun: at("yakoon river", S), sitka: at("sitka spruce", S), hundreds: at("hundreds of years", S), unlike: at("unlike any other", S),
  green: at("weren't green", S), gold: at("they were gold", S), glowed: at("glowed yellow", S), candle: at("like a candle", S), quirk: at("genetic quirk", S), more: at("much more than", S),
  kiid: at("kiyad kiyas", S), oral: at("oral history", S), sacred: at("sacred tree", S), boy: at("turned into a tree", S),
  jan: at("january of 1997", S), night: at("at night", S), saw: at("chainsaw", S), forestry: at("former forestry", S), statement: at("make a statement", S), cut: at("cut deep", S), days: at("few days later", S), storm: at("winter storm", S), fell: at("spruce fell", S),
  heart: at("heartbroken", S), funeral: at("like a funeral", S), charged: at("was charged", S), court: at("never made it", S), stormy: at("stormy water", S), kayak: at("in a kayak", S), gone1: at("he disappeared", S), pieces: at("pieces of his", S), never: at("he never was", S),
  happy: at("happy ending", S), cuttings: at("cuttings", S), young: at("young golden", S), growing: at("still growing", S), giant: at("old giant", S), isgone: at("is gone", S), end: at("let's come back", S),
};
const HG = PL("haida_gwaii"), SG = PL("sgang_gwaay"), QK: [number, number] = [-132.75, 52.75], HI = PL("hawaii"), PR = PL("prince_rupert");
const YAK: [number, number] = [-132.2, 53.62];
const FAULT: [number, number][] = [[-135.4, 55.2], [-134.4, 54.2], [-133.8, 53.5], [-133.4, 52.8], [-132.8, 52.0], [-131.9, 51.2]];
const YAKOUN: [number, number][] = [[-132.35, 53.25], [-132.3, 53.45], YAK, [-132.1, 53.85], [-132.0, 54.0]];
const SPRINGS: [number, number] = [-131.45, 52.57];
const CUT: [number, number][] = [[-131.95, 53.45], [-132.35, 53.75], [-131.8, 53.7], [-132.1, 53.3], [-131.7, 53.55]];
const ISL = { shiny: "Photo: Murray Foubister · CC BY-SA 2.0", sg: "Photo: Yvrsigmatech · public domain" };

const PORTALS: PortalSpec[] = [
  { src: "img/s_haida_quake.jpg", t0: T.shook - 0.1, t1: T.tsunami - 0.05, lon: QK[0], lat: QK[1], label: "October 2012" },
  { src: "raw/haida_haida_gwaii_2.jpg", t0: T.remark - 0.1, t1: T.small - 0.05, lon: HG[0], lat: HG[1], zoom: [1.0, 1.12], credit: ISL.shiny, label: "Haida Gwaii" },
  { src: "raw/haida_sgang_gwaay_1.jpg", t0: T.village - 0.1, t1: T.heritage - 0.05, lon: SG[0], lat: SG[1], zoom: [1.0, 1.15], pan: [40, 0], credit: ISL.sg, label: "SG̱ang Gwaay" },
  { src: "raw/haida_sgang_gwaay_3.jpg", t0: T.heritage - 0.05, t1: T.mist - 0.05, lon: SG[0], lat: SG[1], zoom: [1.12, 1.0], credit: ISL.sg },
  { src: "raw/haida_sgang_gwaay_2.jpg", t0: T.mist - 0.05, t1: T.wild - 0.05, lon: SG[0], lat: SG[1], zoom: [1.0, 1.18], pan: [0, -40], credit: ISL.sg },
  { src: "img/g_golden_spruce.jpg", t0: T.quirk - 0.1, t1: T.kiid - 0.05, lon: YAK[0], lat: YAK[1], zoom: [1.0, 1.15], label: "The Golden Spruce" },
  { src: "img/s_golden_spruce_old.jpg", t0: T.kiid - 0.05, t1: T.jan - 0.05, lon: YAK[0], lat: YAK[1], zoom: [1.1, 1.0] },
  { src: "img/s_golden_spruce_storm.jpg", t0: T.fell + 0.9, t1: T.charged - 0.05, lon: YAK[0], lat: YAK[1], zoom: [1.0, 1.12] },
  { src: "img/s_kayak_storm.jpg", t0: T.stormy - 0.1, t1: T.gone1 + 0.6, lon: -131.2, lat: 53.9, zoom: [1.0, 1.15] },
];

// ondas del sismo y del tsunami (en el mundo)
const World: Chapter["World"] = ({ t, z }) => {
  const [qx, qy] = P(QK[0], QK[1]);
  const out: React.ReactNode[] = [];
  if (vis(t, T.slipped, T.else)) for (let i = 0; i < 4; i++) {
    const k = ((t - T.slipped) * 0.8 + i / 4) % 1;
    out.push(<circle key={"q" + i} cx={qx} cy={qy} r={20 + k * 420} fill="none" stroke="#ff3b30" strokeWidth={7 / z} strokeOpacity={(1 - k) * fadeOut(t, T.tsunami)} />);
  }
  if (vis(t, T.tsunami - 0.2, T.else + 0.4)) {
    const [hx, hy] = P(HI[0], HI[1]);
    const D = Math.hypot(hx - qx, hy - qy);
    const op = win(t, T.tsunami - 0.2, T.else + 0.4, 0.4);
    for (let i = 0; i < 6; i++) {
      const r = interpolate(t, [T.tsunami + i * 0.35, T.hawaii + 0.6 + i * 0.35], [0, D * 1.02], clamp);
      if (r <= 0) continue;
      out.push(<circle key={"w" + i} cx={qx} cy={qy} r={r} fill="none" stroke="#7fd3ff" strokeWidth={(16 - i * 2) / z} strokeOpacity={op * (1 - i * 0.13)} />);
    }
  }
  return <>{out}</>;
};

// placas que se rozan a lo largo de la falla
const Plates: React.FC<{ c: any; t: number; f: number }> = ({ c, t, f }) => {
  if (!vis(t, T.grind - 0.2, T.oct + 0.3)) return null;
  const op = win(t, T.grind - 0.2, T.oct + 0.3, 0.3);
  const d = ((t - T.grind) * 60) % 120;
  const Arr = ({ x, y, rot, label, col }: any) => (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`, opacity: op }}>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 30, color: "#fff", background: col, padding: "6px 16px", borderRadius: 10, whiteSpace: "nowrap", boxShadow: "0 4px 0 #0007" }}>{label}</div>
    </div>
  );
  const [ax, ay] = pj(c, -134.6, 53.2), [bx, by] = pj(c, -132.7, 53.9);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${pop(f, T.grind - 0.2, 12)})`, transformOrigin: `${(ax + bx) / 2}px ${(ay + by) / 2}px` }}>
      <Arr x={ax - 30} y={ay + 60 - d} rot={-55} label="Pacific Plate ↑" col="#1565c0" />
      <Arr x={bx + 40} y={by - 60 + d} rot={-55} label="↓ North American Plate" col="#6d4c41" />
    </div>
  );
};

// osos negros: tierra firme vs isla (silueta dibujada)
const BEAR = "M10,70 C10,48 28,36 50,36 L92,34 C100,22 112,16 124,20 C132,14 140,18 138,26 C148,30 152,40 146,48 L132,52 C130,62 122,66 116,66 L112,96 L98,96 L96,72 L58,74 L54,96 L40,96 L38,76 C22,78 10,78 10,70 Z";
const Bears: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  if (!vis(t, T.bears - 0.2, T.sci + 1.2)) return null;
  const op = fadeOut(t, T.sci + 1.2);
  const big = interpolate(t, [T.bears + 0.6, T.bears + 1.6], [1, 1.35], { ...clamp });
  const jaw = ramp(t, T.jaws, 0.3);
  const B = ({ x, s, label, t0, hi }: any) => (
    <div style={{ position: "absolute", left: x, top: 640, transform: `translate(-50%,-100%) scale(${pop(f, t0, 12) * s})`, transformOrigin: "50% 100%", opacity: op, textAlign: "center" }}>
      <svg width={320} height={220} viewBox="0 0 160 110">
        <path d={BEAR} fill="#151515" stroke="#fff" strokeWidth={3} strokeLinejoin="round" />
        {hi && <ellipse cx={136} cy={50} rx={14} ry={10} fill="none" stroke="#ffd23a" strokeWidth={4} opacity={jaw} />}
      </svg>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 32 / s, color: "#fff", textShadow: "0 3px 0 #111", whiteSpace: "nowrap" }}>{label}</div>
    </div>
  );
  return (
    <div style={{ zIndex: 20, position: "absolute", inset: 0 }}>
      <B x={1250} s={1} label="Mainland" t0={T.bears} />
      <B x={1600} s={big} label="Haida Gwaii" t0={T.bears + 0.3} hi />
    </div>
  );
};

// el bosque oscuro y el abeto que brilla (y que cae)
const Forest: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  if (!vis(t, T.green - 0.3, T.quirk + 0.1) && !vis(t, T.saw - 0.3, T.fell + 1.0)) return null;
  const late = t > T.jan;
  const t0 = late ? T.saw - 0.3 : T.green - 0.3, t1 = late ? T.fell + 1.0 : T.quirk + 0.1;
  const op = win(t, t0, t1, 0.3);
  const gold = late ? 1 : ramp(t, T.gold, 0.5);
  const glow = late ? 0.35 : ramp(t, T.glowed, 0.6);
  const dark = late ? 0.7 : ramp(t, T.candle - 0.3, 0.6) * 0.6;
  const notch = late ? ramp(t, T.cut, 0.5) : 0;
  const wind = late ? win(t, T.storm, T.fell + 1.0, 0.3) : 0;
  const fall = late ? interpolate(t, [T.fell - 0.1, T.fell + 0.9], [0, 84], { ...clamp, easing: (x) => x * x }) : 0;
  const sway = wind * Math.sin(t * 7) * 3;
  const Tree = ({ x, h, col }: any) => (
    <g transform={`translate(${x},900)`}>
      <rect x={-9} y={-30} width={18} height={30} fill="#3b2a1a" />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M0,${-h + i * h * 0.2} L${h * 0.18 + i * h * 0.05},${-h * 0.45 + i * h * 0.2} L${-(h * 0.18 + i * h * 0.05)},${-h * 0.45 + i * h * 0.2} Z`} fill={col} />)}
    </g>
  );
  const others = [[140, 420], [330, 520], [520, 460], [720, 560], [1200, 540], [1400, 470], [1590, 560], [1780, 430]];
  const gc = `rgb(${Math.round(40 + 215 * gold)},${Math.round(110 + 100 * gold)},${Math.round(50 - 10 * gold)})`;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: op }}>
      <div style={{ position: "absolute", inset: 0, background: late ? "rgba(5,10,30,.82)" : `rgba(10,25,15,${0.55 + dark * 0.3})` }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs><radialGradient id="gl13"><stop offset="0" stopColor="#ffd23a" stopOpacity={0.75} /><stop offset="1" stopColor="#ffd23a" stopOpacity={0} /></radialGradient></defs>
        {others.map(([x, h], i) => <Tree key={i} x={x} h={h} col={`rgb(${Math.round(30 - 20 * dark)},${Math.round(80 - 50 * dark)},${Math.round(45 - 25 * dark)})`} />)}
        <circle cx={960} cy={560} r={420 * (0.6 + glow * 0.4 + 0.03 * Math.sin(t * 3))} fill="url(#gl13)" opacity={glow * (1 - fall / 84)} />
        <g transform={`rotate(${fall + sway} 960 900)`}>
          <Tree x={960} h={700} col={gc} />
          {notch > 0 && <path d={`M951,${885} L${951 + 16 * notch},876 L951,866 Z`} fill="#111" />}
        </g>
        <rect x={0} y={900} width={1920} height={180} fill="#0d1a0f" />
        {wind > 0 && [0, 1, 2, 3, 4, 5].map((i) => {
          const x = ((t * 900 + i * 360) % 2300) - 200;
          return <path key={i} d={`M${x},${220 + i * 90} q60,-25 120,0 t120,0`} stroke="#cfe8ff" strokeWidth={5} fill="none" opacity={0.6 * wind} />;
        })}
      </svg>
    </div>
  );
};

const Screen: Chapter["Screen"] = ({ c, f, t }) => {
  const nightOp = win(t, T.jan - 0.2, T.heart, 0.5) * 0.45;
  const kx = interpolate(t, [T.kayak, T.gone1], [0, 1], clamp);
  const kA = pj(c, PR[0] - 0.4, PR[1] - 0.15), kB = pj(c, -131.2, 53.9);
  const kOp = (t < T.gone1 ? 1 : 1 - ramp(t, T.gone1, 0.5)) * pop(f, T.kayak, 12);
  return (
    <>
      <Tag c={c} f={f} t={t} lon={HG[0]} lat={HG[1]} t0={T.haida - 0.1} t1={T.grind} text="Haida Gwaii" size={40} bg="#111" />
      <Sticker f={f} t={t} t0={T.queen} t1={T.western} x={1450} y={250} size={50}>once: Queen Charlotte Islands</Sticker>
      <Line c={c} f={f} t={t} pts={FAULT} t0={T.fault} t1={T.tsunami} dur={1.2} color="#ff3b30" w={10} glow />
      <Tag c={c} f={f} t={t} lon={-134.9} lat={54.6} t0={T.fault + 0.4} t1={T.oct} text="Fault line" size={30} bg="#e3261c" />
      <Plates c={c} t={t} f={f} />
      <BigWord f={f} t={t} t0={T.oct} t1={T.mag} text={<span>OCTOBER <span style={{ color: "#ff3b30" }}>2012</span></span>} y={160} size={120} />
      <Icon c={c} f={f} t={t} src="i_quake" lon={QK[0]} lat={QK[1]} t0={T.slipped} t1={T.shook} size={150} />
      <Sticker f={f} t={t} t0={T.mag} t1={T.shook} x={1450} y={270} rot={-3} size={90}>M <span style={{ color: "#ff3b30" }}>7.8</span></Sticker>
      <Sticker f={f} t={t} t0={T.powerful} t1={T.shook} x={1450} y={460} rot={3} size={48}>One of the strongest ever in Canada</Sticker>
      <Pin c={c} f={f} t={t} lon={HI[0]} lat={HI[1]} t0={T.tsunami + 0.6} t1={T.else + 0.3} label="Hawaii" side="l" />
      <BigWord f={f} t={t} t0={T.tsunami} t1={T.else} text={<span style={{ color: "#7fd3ff" }}>TSUNAMI</span>} y={160} size={120} />

      <Icon c={c} f={f} t={t} src="i_hotspring" lon={SPRINGS[0]} lat={SPRINGS[1]} t0={T.springs} t1={T.remark} size={150} grey={ramp(t, T.stopped, 0.6)} />
      <Tag c={c} f={f} t={t} lon={SPRINGS[0]} lat={SPRINGS[1]} dy={100} t0={T.springs + 0.2} t1={T.remark} text="Used for generations" size={28} bg="#00897b" />
      <Tag c={c} f={f} t={t} lon={SPRINGS[0]} lat={SPRINGS[1]} dx={130} t0={T.stopped} t1={T.remark} text="✗" size={60} bg="#e3261c" />
      <Sticker f={f} t={t} t0={T.tap} t1={T.remark} x={1450} y={250} size={58}>The earth turned off the tap</Sticker>

      <Sticker f={f} t={t} t0={T.thousands} t1={T.small} x={1450} y={250} size={52}>The Haida · thousands of years</Sticker>
      <Pin c={c} f={f} t={t} lon={SG[0]} lat={SG[1]} t0={T.small} t1={T.village} label="SG̱ang Gwaay" />
      <Sticker f={f} t={t} t0={T.poles} t1={T.heritage} x={1480} y={230} size={50}>Carved cedar poles</Sticker>
      <Sticker f={f} t={t} t0={T.gray} t1={T.heritage} x={1480} y={350} rot={3} size={50}>Weathered gray · leaning</Sticker>
      <Sticker f={f} t={t} t0={T.heritage} t1={T.mist} x={1480} y={230} size={50}>UNESCO World Heritage Site</Sticker>
      <Sticker f={f} t={t} t0={T.earth} t1={T.mist} x={1480} y={350} rot={3} size={50}>Left to return to the earth</Sticker>
      <Sticker f={f} t={t} t0={T.lock} t1={T.mist} x={1480} y={470} rot={-3} size={50}>Not in a museum</Sticker>

      <Line c={c} f={f} t={t} pts={[[-131.0, 54.6], [-130.8, 53.2], [-130.5, 52.0]]} t0={T.isolated} t1={T.lab} dur={0.8} color="#7fd3ff" w={14} />
      <Tag c={c} f={f} t={t} lon={-130.75} lat={53.4} t0={T.isolated + 0.3} t1={T.bears} text="Isolated" size={32} bg="#1e88e5" />
      <Bears f={f} t={t} />
      <Sticker f={f} t={t} t0={T.jaws} t1={T.sci + 1.2} x={1420} y={760} rot={3} size={46}>bigger · larger jaws</Sticker>
      <BigWord f={f} t={t} t0={T.lab} t1={T.famous} text={<span>A NATURAL <span style={{ color: "#2ecc71" }}>LABORATORY</span></span>} y={160} size={100} />

      <Sticker f={f} t={t} t0={T.standing} t1={T.yakoun} x={1450} y={250} size={52}>…isn't standing anymore</Sticker>
      <Line c={c} f={f} t={t} pts={YAKOUN} t0={T.yakoun} t1={T.green} dur={1.0} color="#2a9df4" w={8} />
      <Tag c={c} f={f} t={t} lon={-132.55} lat={53.4} t0={T.yakoun + 0.3} t1={T.green} text="Yakoun River" size={28} bg="#1e88e5" />
      <Icon c={c} f={f} t={t} src="i_spruce_gold" lon={YAK[0]} lat={YAK[1]} t0={T.sitka} t1={T.green} size={150} />
      <Sticker f={f} t={t} t0={T.hundreds} t1={T.green} x={1450} y={250} size={50}>Sitka spruce · hundreds of years old</Sticker>
      <Sticker f={f} t={t} t0={T.unlike} t1={T.green} x={1450} y={370} rot={3} size={50}>Unlike any other tree on Earth</Sticker>

      <Forest f={f} t={t} />
      <Sticker f={f} t={t} t0={T.green} t1={T.gold} x={1500} y={220} size={60}>Green? <span style={{ color: "#ff3b30" }}>✗</span></Sticker>
      <Sticker f={f} t={t} t0={T.gold} t1={T.quirk} x={1500} y={220} size={66}><span style={{ color: "#c79100" }}>GOLD</span></Sticker>
      <Sticker f={f} t={t} t0={T.candle} t1={T.quirk} x={420} y={240} rot={5} size={56}>like a candle 🕯</Sticker>
      <Sticker f={f} t={t} t0={T.quirk + 0.2} t1={T.more} x={1450} y={250} size={50}>Science: a rare genetic quirk</Sticker>
      <Sticker f={f} t={t} t0={T.more} t1={T.kiid} x={1450} y={370} rot={3} size={50}>The Haida: much more</Sticker>
      <BigWord f={f} t={t} t0={T.kiid} t1={T.oral + 0.4} text={<span style={{ color: "#ffd23a" }}>K'IID K'IYAAS</span>} y={160} size={110} />
      <Sticker f={f} t={t} t0={T.oral} t1={T.jan} x={1450} y={250} size={50}>Oral history</Sticker>
      <Sticker f={f} t={t} t0={T.sacred} t1={T.jan} x={1450} y={370} rot={3} size={50}>A sacred tree</Sticker>
      <Sticker f={f} t={t} t0={T.boy} t1={T.jan} x={1450} y={490} rot={-3} size={50}>A boy turned into a tree</Sticker>

      {nightOp > 0 && <div style={{ position: "absolute", inset: 0, background: `rgba(5,10,35,${nightOp})` }} />}
      <BigWord f={f} t={t} t0={T.jan} t1={T.saw - 0.1} text={<span>JANUARY <span style={{ color: "#ffd23a" }}>1997</span></span>} y={160} size={120} />
      {vis(t, T.saw - 0.1, T.statement + 1) && (
        <div style={{ zIndex: 20, position: "absolute", left: 640, top: 760, transform: `translate(-50%,-50%) scale(${pop(f, T.saw - 0.1, 10) * fadeOut(t, T.statement + 1)}) rotate(${Math.sin(t * 40) * 2 * ramp(t, T.cut - 0.3, 0.2)}deg)` }}>
          <Img src={sf("icons/i_chainsaw.png")} style={{ width: 230 }} />
        </div>
      )}
      <Sticker f={f} t={t} t0={T.forestry} t1={T.cut} x={1450} y={250} size={50}>A former forestry worker</Sticker>
      <Sticker f={f} t={t} t0={T.statement} t1={T.cut} x={1450} y={370} rot={3} size={50}>…to “make a statement”</Sticker>
      <Sticker f={f} t={t} t0={T.days} t1={T.fell + 0.9} x={1450} y={250} size={50}>A few days later · winter storm</Sticker>

      <Sticker f={f} t={t} t0={T.heart} t1={T.charged} x={1450} y={420} rot={3} size={52}>Mourned like a funeral</Sticker>
      <Sticker f={f} t={t} t0={T.charged} t1={T.stormy} x={1450} y={250} size={52}>Charged…</Sticker>
      <Sticker f={f} t={t} t0={T.court} t1={T.stormy} x={1450} y={370} rot={3} size={52}>…never made it to court</Sticker>
      {vis(t, T.kayak - 0.1, T.gone1 + 0.6) && (
        <div style={{ zIndex: 20, position: "absolute", left: kA[0] + (kB[0] - kA[0]) * kx, top: kA[1] + (kB[1] - kA[1]) * kx + Math.sin(t * 6) * 8, transform: `translate(-50%,-50%) rotate(${Math.sin(t * 5) * 8}deg)`, opacity: kOp }}>
          <Img src={sf("icons/i_kayak.png")} style={{ width: 150 }} />
        </div>
      )}
      <Tag c={c} f={f} t={t} lon={-131.2} lat={53.9} t0={T.gone1 + 0.4} t1={T.happy} text="?" size={60} bg="#e3261c" />
      {[[-131.0, 53.7], [-130.8, 53.95], [-131.35, 53.6]].map(([lo, la], i) => (
        <Tag key={i} c={c} f={f} t={t} lon={lo} lat={la} t0={T.pieces + 0.3 + i * 0.25} t1={T.happy} text="▬" size={22} bg="#e67e22" />
      ))}
      <Sticker f={f} t={t} t0={T.pieces} t1={T.happy} x={1450} y={250} size={50}>Pieces of the kayak: found</Sticker>
      <Sticker f={f} t={t} t0={T.never} t1={T.happy} x={1450} y={370} rot={3} size={50}>He never was.</Sticker>

      <Sticker f={f} t={t} t0={T.happy} t1={T.young} x={1450} y={250} size={50}>A little happy ending</Sticker>
      {CUT.map(([lo, la], i) => <Icon key={i} c={c} f={f} t={t} src="i_spruce_gold" lon={lo} lat={la} t0={T.cuttings + 0.4 + i * 0.3} t1={T.end} size={70 + i * 6} />)}
      <Sticker f={f} t={t} t0={T.young} t1={T.growing} x={1450} y={250} size={50}>Cuttings → young golden spruces</Sticker>
      <BigWord f={f} t={t} t0={T.growing} t1={T.end} text={<span>THE GOLD IS <span style={{ color: "#ffd23a" }}>STILL GROWING</span></span>} y={160} size={96} />
      <Icon c={c} f={f} t={t} src="i_spruce_gold" lon={YAK[0]} lat={YAK[1]} t0={T.giant} t1={T.end} size={170} grey={ramp(t, T.isgone, 0.6)} />

      {PORTALS.map((p, i) => <Portal key={i} c={c} t={t} f={f} p={p} />)}
    </>
  );
};

export const ch13: Chapter = {
  T0: S, T1: T.end,
  keys: [
    [S + 0.4, -129.5, 54.0, 0.45, 0], [T.haida, -132.0, 53.2, 0.75, 0], [T.wayout, -130.5, 53.4, 0.42, 0], [T.fault, -132.6, 53.2, 0.6, 0], [T.grind, -132.6, 53.2, 0.75, 0],
    [T.slipped, -132.1, 52.85, 1.0, 0], [T.shook, -132.1, 52.85, 1.2, 0], [T.tsunami + 0.2, -145.0, 38.0, 0.075, 0], [T.else, -145.0, 38.0, 0.075, 0],
    [T.springs, -131.5, 52.6, 1.4, 0], [T.tap, -131.5, 52.6, 1.6, 0], [T.thousands, -131.8, 53.0, 0.75, 0], [T.small, -131.3, 52.2, 1.6, 0], [T.village, -131.22, 52.09, 2.2, 0],
    [T.wild, -131.6, 53.3, 0.6, 0], [T.isolated, -131.0, 53.4, 0.5, 0], [T.lab, -131.5, 53.3, 0.6, 0], [T.yakoun, -132.2, 53.6, 1.3, 0], [T.unlike, -132.2, 53.62, 2.0, 0],
    [T.charged, -131.6, 53.9, 0.75, 0], [T.kayak, -131.4, 53.95, 0.8, 0], [T.pieces, -131.2, 53.85, 1.0, 0], [T.cuttings, -132.0, 53.6, 1.3, 0], [T.end, -132.1, 53.6, 1.5, 0],
  ],
  World, Screen,
  full: [1596.953, 1662.073],
  sfx: [
    [T.haida, "pop1", 0.1, 0.4], [T.queen, "st1", 0.1, 0.5], [T.fault, "wh2", 0.12, 1.2], [T.oct, "im1", 0.15, 1.4], [T.slipped, "im2", 0.16, 1.4], [T.mag, "tk1", 0.08, 0.8],
    [T.shook - 0.1, "sw4", 0.12, 1.0], [T.tsunami, "wh6", 0.14, 1.6], [T.hawaii, "pop2", 0.1, 0.4], [T.springs, "pop3", 0.1, 0.4], [T.stopped, "st2", 0.12, 0.5],
    [T.remark - 0.1, "sw1", 0.12, 1.0], [T.small, "ck2", 0.1, 0.3], [T.village - 0.1, "sw4", 0.12, 1.0], [T.heritage, "pop4", 0.1, 0.4], [T.lock, "pop5", 0.1, 0.4],
    [T.isolated, "wh2", 0.1, 1.0], [T.bears, "pop1", 0.1, 0.4], [T.lab, "im1", 0.12, 1.2], [T.yakoun, "ck2", 0.1, 0.3], [T.gold, "st1", 0.12, 0.5], [T.quirk - 0.1, "sw1", 0.12, 1.0],
    [T.kiid, "im2", 0.12, 1.2], [T.jan, "im1", 0.14, 1.4], [T.saw - 0.1, "st2", 0.12, 0.5], [T.fell, "im2", 0.16, 1.4], [T.stormy - 0.1, "sw4", 0.12, 1.0],
    [T.pieces, "pop2", 0.1, 0.4], [T.cuttings, "pop3", 0.1, 0.4], [T.growing, "im1", 0.12, 1.2],
  ],
};
