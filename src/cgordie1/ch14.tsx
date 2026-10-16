// Capítulo 14 — Prince Rupert: el puerto más cercano a Asia y el sueño de Charles M. Hays (Titanic, 1912)
import React from "react";
import { interpolate, Img } from "remotion";
import { Chapter, at, Tag, Pin, Icon, BigWord, Sticker, Line, Dots, Portal, PortalSpec, PL, pj, sf, pop, vis, win, ramp, fadeOut, clamp, SANS } from "./lib";

const S = at("let's come back to the mainland");
const T = {
  rupert: at("prince rupert", S), most: at("most canadians", S), rainy: at("rainy fishing", S), hwy: at("end of the highway", S),
  wettest: at("wettest", S), here: at("here's what", S), deep: at("deepest natural", S), freeze: at("doesn't freeze", S), important: at("even more important", S), closest: at("closest major", S), asia: at("to asia", S),
  china: at("china or japan", S), save: at("save a lot", S), south: at("further south", S), why: at("that's why", S), gateway: at("big gateway", S), trains: at("trains loaded", S), middle: at("middle of north america", S),
  shanghai: at("from shanghai", S), loaded: at("loaded onto a train", S), chicago: at("in chicago", S), buy: at("buy something", S), foggy: at("foggy", S), never: at("never seen", S),
  thing: at("here's the thing", S), bigger: at("much much bigger", S), nextv: at("next vancouver", S), y1900: at("start of the 1900s", S), gtp: at("grand trunk pacific", S), across: at("across canada", S), pacific: at("to the pacific", S),
  man: at("the man running", S), american: at("american railway", S), hays: at("melville hayes", S), picked: at("picked this spot", S), endline: at("end of the line", S),
  city: at("grand city", S), streets: at("wide streets", S), hotel: at("big hotel", S), port: at("great port", S), contest: at("a contest", S), winner: at("was the winner", S),
  spring: at("spring of 1912", S), europe: at("in europe", S), money: at("raising money", S), booked: at("booked passage", S), ship: at("brand new ship", S), back: at("back in time", S), newhotel: at("grand new hotel", S),
  titanic: at("was the titanic", S), down: at("went down with it", S), april: at("april of 1912", S), dream: at("dream went down", S),
  later: at("couple of years later", S), broke: at("went broke", S), scaled: at("scaled back", S), small: at("stayed a small", S), vanc: at("vancouver took off", S),
  way: at("in a way", S), rolling: at("rolling into", S), finishing: at("finally finishing", S), hundred: at("hundred years ago", S), atlantic: at("north atlantic", S), end: at("now head", S),
};
const PR = PL("prince_rupert"), PG = PL("prince_george");
const VAN: [number, number] = [-123.12, 49.28], CHI: [number, number] = [-87.63, 41.88], OTT: [number, number] = [-75.69, 45.42], NYC: [number, number] = [-74.0, 40.7];
const WRECK: [number, number] = [-49.95, 41.73];
const H16: [number, number][] = [PG, [-124.0, 54.0], [-126.2, 54.4], [-127.2, 54.8], [-128.6, 54.52], [-129.4, 54.2], PR];
const RAIL: [number, number][] = [PR, [-128.6, 54.52], [-127.2, 54.8], [-126.2, 54.4], PG, [-118.08, 52.87], [-113.5, 53.55], [-106.6, 52.13], [-97.14, 49.9], [-92.0, 46.8], CHI];
const GTP: [number, number][] = [[-97.14, 49.9], [-106.6, 52.13], [-113.5, 53.55], [-118.08, 52.87], PG, [-126.2, 54.4], [-128.6, 54.52], PR];
const SEA: [number, number][] = [[-179.5, 47.5], [-160.0, 51.5], [-145.0, 54.0], [-133.5, 54.4], PR];
const TITANIC: [number, number][] = [[-50.4, 47.5], [-50.2, 44.5], WRECK];
const CR = { aerial: "Photo: Sam Beebe · CC BY 2.0", cosco: "Photo: Fletcher6 · CC BY-SA 3.0" };

const PORTALS: PortalSpec[] = [
  { src: "raw/rupert_prince_rupert_british_co_0.jpg", t0: T.here - 0.1, t1: T.closest - 0.05, lon: PR[0], lat: PR[1], zoom: [1.0, 1.15], pan: [30, 0], credit: CR.aerial, label: "Prince Rupert" },
  { src: "raw/rupert_prince_rupert_port_conta_0.jpg", t0: T.why - 0.1, t1: T.trains - 0.05, lon: PR[0], lat: PR[1], zoom: [1.0, 1.12], credit: CR.cosco },
  { src: "img/s_rupert_container_train.jpg", t0: T.trains - 0.05, t1: T.shanghai - 0.05, lon: PR[0], lat: PR[1], zoom: [1.12, 1.0] },
  { src: "img/g_rupert_harbour.jpg", t0: T.foggy - 0.1, t1: T.thing - 0.05, lon: PR[0], lat: PR[1], zoom: [1.0, 1.12] },
  { src: "img/s_gtp_1914.jpg", t0: T.man - 0.1, t1: T.picked - 0.05, lon: PR[0], lat: PR[1], zoom: [1.0, 1.1], label: "Grand Trunk Pacific" },
  { src: "img/s_titanic_1912.jpg", t0: T.titanic - 0.1, t1: T.down + 0.6, lon: WRECK[0], lat: WRECK[1], zoom: [1.0, 1.12], label: "RMS Titanic · 1912" },
];

// lluvia y niebla sobre Prince Rupert
const Rain: React.FC<{ t: number; op: number }> = ({ t, op }) => {
  if (op <= 0) return null;
  const drops = Array.from({ length: 90 }, (_, i) => {
    const x = (i * 211.7) % 1960, sp = 1300 + (i % 7) * 120;
    const y = ((t * sp + i * 97) % 1200) - 100;
    return <line key={i} x1={x} y1={y} x2={x - 10} y2={y + 34} stroke="#cfe3ff" strokeWidth={3} strokeOpacity={0.55} />;
  });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: op }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(40,55,70,.35)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{drops}</svg>
    </div>
  );
};

// barras: navegar a Asia desde cada puerto
const Bars: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  if (!vis(t, T.closest - 0.2, T.why)) return null;
  const s = pop(f, T.closest - 0.2, 12) * fadeOut(t, T.why);
  const rows: [string, number, string][] = [["Prince Rupert", 0.62, "#2ecc71"], ["Vancouver", 0.8, "#9aa5b1"], ["Seattle", 0.84, "#9aa5b1"], ["Los Angeles", 1.0, "#9aa5b1"]];
  const k = interpolate(t, [T.china, T.south + 0.6], [0, 1], clamp);
  return (
    <div style={{ zIndex: 20, position: "absolute", left: 1010, top: 210, width: 820, padding: "22px 30px", background: "rgba(12,14,20,.9)", border: "3px solid #fff", borderRadius: 16, transform: `scale(${s})`, transformOrigin: "50% 0%" }}>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 34, color: "#fff", marginBottom: 14 }}>Sailing time to Asia</div>
      {rows.map(([lab, v, col], i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
          <div style={{ width: 230, fontFamily: SANS, fontWeight: 800, fontSize: 28, color: "#fff" }}>{lab}</div>
          <div style={{ height: 34, width: 520 * v * Math.min(1, k / v), background: col, borderRadius: 8 }} />
          {i === 0 && k >= v && <div style={{ marginLeft: 12, fontFamily: SANS, fontWeight: 900, fontSize: 34, color: "#2ecc71" }}>✓</div>}
        </div>
      ))}
    </div>
  );
};

// la ciudad soñada: plano que se dibuja sobre el puerto
const Blueprint: React.FC<{ c: any; f: number; t: number }> = ({ c, f, t }) => {
  if (!vis(t, T.city - 0.2, T.small + 0.5)) return null;
  const op = win(t, T.city - 0.2, T.small + 0.5, 0.4) * (1 - 0.65 * ramp(t, T.dream, 1.2));
  const shrink = 1 - 0.55 * ramp(t, T.scaled, 1.0);
  const [x, y] = pj(c, PR[0], PR[1]);
  const st = ramp(t, T.streets, 1.0), ho = pop(f, T.hotel, 10), po = ramp(t, T.port, 0.8);
  const L = 460;
  return (
    <div style={{ zIndex: 15, position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${shrink * Math.min(1, c.z / 1.4)})`, opacity: op }}>
      <svg width={2 * L} height={2 * L} viewBox={`${-L} ${-L} ${2 * L} ${2 * L}`}>
        <rect x={-L + 20} y={-L + 20} width={2 * L - 40} height={2 * L - 40} rx={24} fill="#0d47a1" fillOpacity={0.55} stroke="#bbdefb" strokeWidth={4} />
        {Array.from({ length: 9 }, (_, i) => -L + 80 + i * 95).map((p, i) => (
          <g key={i} opacity={st > i / 9 ? 1 : 0}>
            <line x1={-L + 60} y1={p} x2={L - 60} y2={p} stroke="#e3f2fd" strokeWidth={i % 3 === 0 ? 9 : 4} />
            <line x1={p} y1={-L + 60} x2={p} y2={L - 60} stroke="#e3f2fd" strokeWidth={i % 3 === 0 ? 9 : 4} />
          </g>
        ))}
        <g transform={`translate(-30,-60) scale(${ho})`}>
          <rect x={-70} y={-60} width={140} height={120} fill="#ffd23a" stroke="#fff" strokeWidth={5} />
          <path d="M-80,-60 L0,-110 L80,-60 Z" fill="#ffb300" stroke="#fff" strokeWidth={5} />
        </g>
        <path d={`M${-L + 60},${L - 120} L${-L + 60 + (2 * L - 120) * po},${L - 120}`} stroke="#4fc3f7" strokeWidth={22} />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={-L + 90 + i * 200} y={L - 105} width={40} height={60 * po} fill="#4fc3f7" />)}
      </svg>
    </div>
  );
};

const Screen: Chapter["Screen"] = ({ c, f, t }) => {
  const rain = win(t, T.rainy - 0.2, T.here, 0.4);
  const tSink = interpolate(t, [T.down + 0.6, T.dream], [0, 1], clamp);
  const [wx, wy] = pj(c, WRECK[0], WRECK[1]);
  const vGrow = 1 + 2.4 * ramp(t, T.small + 0.4, 1.6);
  const [vx, vy] = pj(c, VAN[0], VAN[1]), [rx, ry] = pj(c, PR[0], PR[1]);
  return (
    <>
      <Rain t={t} op={rain} />
      <Pin c={c} f={f} t={t} lon={PR[0]} lat={PR[1]} t0={T.rupert} t1={T.here} label="Prince Rupert" />
      <Line c={c} f={f} t={t} pts={H16} t0={T.hwy - 0.4} t1={T.here} dur={1.0} color="#ffd23a" w={8} />
      <Tag c={c} f={f} t={t} lon={PR[0]} lat={PR[1]} dy={80} t0={T.hwy + 0.5} t1={T.here} text="End of Highway 16" size={28} bg="#111" />
      <Sticker f={f} t={t} t0={T.most} t1={T.rainy} x={1450} y={260} size={52}>“A rainy fishing town”</Sticker>
      <Sticker f={f} t={t} t0={T.wettest} t1={T.here} x={1450} y={260} size={52}>One of the wettest towns in Canada ☔</Sticker>
      <Sticker f={f} t={t} t0={T.deep} t1={T.closest} x={1480} y={230} size={48}>One of the deepest natural harbours</Sticker>
      <Sticker f={f} t={t} t0={T.freeze} t1={T.closest} x={1480} y={350} rot={3} size={48}>Ice-free ✓</Sticker>
      <Bars f={f} t={t} />
      <Line c={c} f={f} t={t} pts={[...SEA].reverse()} t0={T.china} t1={T.why} dur={1.6} color="#ffffff" w={6} icon="i_container_ship" iconSize={110} />
      <Tag c={c} f={f} t={t} lon={-176} lat={48.5} t0={T.china + 0.8} t1={T.why} text="← China · Japan" size={30} bg="#c0392b" />

      <Dots c={c} f={f} t={t} pts={SEA} t0={T.shanghai - 0.1} t1={T.buy} dur={1.3} color="#ffffff" icon="i_container_ship" iconSize={100} />
      <Tag c={c} f={f} t={t} lon={-174} lat={49.5} t0={T.shanghai} t1={T.buy} text="← from Shanghai" size={30} bg="#c0392b" />
      <Line c={c} f={f} t={t} pts={RAIL} t0={T.loaded} t1={T.foggy} dur={2.4} color="#ff9800" w={8} icon="i_train" iconSize={110} />
      <Pin c={c} f={f} t={t} lon={CHI[0]} lat={CHI[1]} t0={T.chicago} t1={T.foggy} label="Chicago" />
      <Sticker f={f} t={t} t0={T.chicago + 0.4} t1={T.foggy} x={1450} y={260} size={52}>…days later</Sticker>
      <Sticker f={f} t={t} t0={T.buy} t1={T.foggy} x={1450} y={380} rot={3} size={46}>🛒 Your store? Maybe via Prince Rupert</Sticker>
      <Sticker f={f} t={t} t0={T.never} t1={T.thing} x={1450} y={250} size={50}>…a town most Canadians never saw</Sticker>

      {vis(t, T.bigger - 0.2, T.y1900) && (() => { const [bx, by] = pj(c, PR[0], PR[1]); const g = 1 + 5 * ramp(t, T.bigger, 1.4); return <div style={{ position: "absolute", left: bx, top: by, width: 40 * g, height: 40 * g, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "rgba(255,210,58,.45)", border: "6px dashed #fff", opacity: pop(f, T.bigger - 0.2, 12) * fadeOut(t, T.y1900) }} />; })()}
      <Sticker f={f} t={t} t0={T.bigger} t1={T.nextv} x={1400} y={260} size={46}>Supposed to be much, much bigger</Sticker>
      <BigWord f={f} t={t} t0={T.nextv} t1={T.y1900} text={<span>THE NEXT <span style={{ color: "#ffd23a" }}>VANCOUVER</span>?</span>} y={160} size={110} />
      <Sticker f={f} t={t} t0={T.y1900} t1={T.gtp + 0.3} x={1450} y={260} size={60}>early 1900s</Sticker>
      <Line c={c} f={f} t={t} pts={GTP} t0={T.gtp} t1={T.man} dur={2.0} color="#e3261c" w={9} icon="i_train" iconSize={100} />
      <Tag c={c} f={f} t={t} lon={-110.5} lat={54.6} t0={T.gtp + 0.5} t1={T.man} text="Grand Trunk Pacific" size={32} bg="#e3261c" />
      <Sticker f={f} t={t} t0={T.american} t1={T.picked} x={1450} y={250} size={48}>Charles Melville Hays</Sticker>
      <Sticker f={f} t={t} t0={T.american + 0.4} t1={T.picked} x={1450} y={360} rot={3} size={42}>American railway boss 🇺🇸</Sticker>
      <Tag c={c} f={f} t={t} lon={PR[0]} lat={PR[1]} dy={-80} t0={T.endline} t1={T.city} text="END OF THE LINE ✕" size={34} bg="#e3261c" />
      <Blueprint c={c} f={f} t={t} />
      <Sticker f={f} t={t} t0={T.city} t1={T.contest} x={1500} y={220} size={50}>A grand city</Sticker>
      {[["Wide streets", T.streets], ["A big hotel", T.hotel], ["A great port", T.port]].map(([s, t0], i) => (
        <Sticker key={i} f={f} t={t} t0={t0 as number} t1={T.contest} x={1500} y={340 + i * 110} rot={i % 2 ? 3 : -3} size={46}>{s as string}</Sticker>
      ))}
      <Sticker f={f} t={t} t0={T.contest} t1={T.spring} x={1500} y={240} size={50}>A contest to name it…</Sticker>
      {vis(t, T.winner - 0.1, T.spring) && (
        <div style={{ zIndex: 20, position: "absolute", left: 1500, top: 420, transform: `translate(-50%,-50%) scale(${pop(f, T.winner - 0.1, 10) * fadeOut(t, T.spring)})`, textAlign: "center" }}>
          <Img src={sf("icons/trophy.png")} style={{ width: 150 }} />
          <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 52, color: "#ffd23a", textShadow: "0 4px 0 #111" }}>PRINCE RUPERT</div>
        </div>
      )}

      <BigWord f={f} t={t} t0={T.spring} t1={T.booked} text={<span>SPRING <span style={{ color: "#ffd23a" }}>1912</span></span>} y={160} size={110} />
      <Tag c={c} f={f} t={t} lon={-52} lat={50.5} t0={T.europe} t1={T.titanic} text="Europe →" size={32} bg="#111" />
      <Sticker f={f} t={t} t0={T.money} t1={T.titanic} x={420} y={260} rot={5} size={46}>raising money 💰</Sticker>
      <Pin c={c} f={f} t={t} lon={OTT[0]} lat={OTT[1]} t0={T.newhotel} t1={T.titanic} label="A grand new hotel" side="l" />
      <Dots c={c} f={f} t={t} pts={[...TITANIC, [-60, 41.5], NYC]} t0={T.booked} t1={T.titanic} dur={2.2} color="#ffffff" icon="i_titanic" iconSize={110} />
      <BigWord f={f} t={t} t0={T.april} t1={T.later} text={<span>APRIL <span style={{ color: "#ff3b30" }}>1912</span></span>} y={160} size={110} />
      {vis(t, T.down + 0.6, T.later) && (
        <div style={{ zIndex: 20, position: "absolute", left: wx, top: wy + 60 * tSink, transform: `translate(-50%,-50%) rotate(${-38 * tSink}deg)`, opacity: (1 - tSink * 0.9) * fadeOut(t, T.later) }}>
          <Img src={sf("icons/i_titanic.png")} style={{ width: 200 }} />
        </div>
      )}
      <Tag c={c} f={f} t={t} lon={WRECK[0]} lat={WRECK[1]} dy={90} t0={T.april + 0.6} t1={T.later} text="Charles M. Hays · lost" size={28} bg="#111" />
      <Sticker f={f} t={t} t0={T.dream} t1={T.later} x={1450} y={300} rot={3} size={52}>…and Prince Rupert's dream</Sticker>

      <Sticker f={f} t={t} t0={T.later} t1={T.scaled} x={1450} y={250} size={52}>1914 · railway finished</Sticker>
      <Sticker f={f} t={t} t0={T.broke} t1={T.way} x={1450} y={370} rot={3} size={52}>…company went broke <span style={{ color: "#ff3b30" }}>✗</span></Sticker>
      <Sticker f={f} t={t} t0={T.scaled} t1={T.way} x={1450} y={490} rot={-3} size={52}>Plans scaled back</Sticker>
      {vis(t, T.small - 0.2, T.way) && (
        <>
          <div style={{ position: "absolute", left: vx, top: vy, width: 60 * vGrow, height: 60 * vGrow, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "rgba(46,204,113,.55)", border: "5px solid #fff", opacity: pop(f, T.small - 0.2, 12) * fadeOut(t, T.way) }} />
          <div style={{ position: "absolute", left: rx, top: ry, width: 50, height: 50, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "rgba(255,210,58,.7)", border: "5px solid #fff", opacity: pop(f, T.small - 0.2, 12) * fadeOut(t, T.way) }} />
        </>
      )}
      <Tag c={c} f={f} t={t} lon={VAN[0]} lat={VAN[1]} dx={170} t0={T.small + 0.3} t1={T.way} text="Vancouver ↑" size={34} bg="#2a7d2e" />
      <Tag c={c} f={f} t={t} lon={PR[0]} lat={PR[1]} dy={-70} t0={T.small} t1={T.way} text="Prince Rupert" size={30} bg="#111" />

      <Line c={c} f={f} t={t} pts={RAIL} t0={T.rolling - 0.3} t1={T.end} dur={2.4} color="#ff9800" w={8} icon="i_train" iconSize={110} />
      <BigWord f={f} t={t} t0={T.finishing} t1={T.end} text={<span>FINISHING A <span style={{ color: "#ffd23a" }}>100-YEAR-OLD DREAM</span></span>} y={160} size={90} />
      {PORTALS.map((p, i) => <Portal key={i} c={c} t={t} f={f} p={p} />)}
    </>
  );
};

export const ch14: Chapter = {
  T0: S, T1: T.end,
  keys: [
    [S + 0.3, -131.4, 53.8, 0.8, 0], [T.rupert, -130.32, 54.31, 1.6, 0], [T.hwy, -129.3, 54.3, 0.8, 0], [T.wettest, -130.32, 54.31, 1.8, 0],
    [T.closest, -130.32, 54.31, 1.6, 0], [T.china, -150.0, 51.0, 0.11, 0], [T.why, -150.0, 51.0, 0.11, 0], [T.trains, -130.32, 54.31, 1.4, 0],
    [T.shanghai, -135.0, 49.0, 0.065, 0], [T.chicago, -125.0, 49.0, 0.065, 0], [T.foggy, -130.32, 54.31, 1.5, 0],
    [T.bigger, -130.32, 54.31, 0.9, 0], [T.nextv, -127.0, 51.8, 0.3, 0], [T.gtp, -110.0, 52.5, 0.12, 0], [T.man, -112.0, 52.5, 0.12, 0], [T.endline, -130.32, 54.31, 1.4, 0], [T.contest, -130.32, 54.31, 1.5, 0], [T.winner + 0.3, -130.32, 54.31, 1.5, 0], [(T.winner + T.spring) / 2 + 0.2, -100.0, 50.0, 0.1, 0],
    [T.spring, -66.0, 46.0, 0.16, 0], [T.newhotel, -64.0, 45.0, 0.16, 0], [T.down + 0.6, -52.0, 42.5, 0.5, 0], [T.april + 1.4, -51.0, 42.0, 0.6, 0],
    [T.later, -125.0, 52.0, 0.3, 0], [T.vanc, -126.5, 51.8, 0.28, 0], [T.rolling, -110.0, 50.0, 0.075, 0], [T.end, -108.0, 50.0, 0.072, 0],
  ],
  Screen,
  full: [1704.033, 1805.799],
  sfx: [
    [T.rupert, "pop1", 0.1, 0.4], [T.most, "st1", 0.1, 0.5], [T.wettest, "pop2", 0.1, 0.4], [T.here - 0.1, "sw1", 0.12, 1.0], [T.freeze, "pop3", 0.1, 0.4],
    [T.closest, "tk1", 0.08, 1.2], [T.china, "wh2", 0.12, 1.4], [T.why - 0.1, "sw4", 0.12, 1.0], [T.trains - 0.05, "sw1", 0.1, 1.0], [T.shanghai, "wh6", 0.12, 1.4], [T.loaded, "wh2", 0.1, 2.0],
    [T.chicago, "ck2", 0.1, 0.3], [T.foggy - 0.1, "sw4", 0.12, 1.0], [T.nextv, "im1", 0.14, 1.4], [T.gtp, "wh2", 0.12, 2.0], [T.man - 0.1, "sw1", 0.12, 1.0], [T.endline, "st2", 0.12, 0.5],
    [T.streets, "tk1", 0.08, 1.0], [T.hotel, "pop4", 0.1, 0.4], [T.port, "pop5", 0.1, 0.4], [T.winner, "im2", 0.12, 1.2], [T.spring, "im1", 0.14, 1.4], [T.booked, "wh6", 0.12, 2.0],
    [T.titanic - 0.1, "sw4", 0.14, 1.0], [T.april, "im2", 0.16, 1.4], [T.broke, "st2", 0.12, 0.5], [T.vanc, "pop1", 0.1, 0.4], [T.rolling, "wh2", 0.1, 2.0], [T.finishing, "im1", 0.12, 1.2],
  ],
};
