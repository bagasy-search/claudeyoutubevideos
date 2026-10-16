// Capítulo 3 — desvío a Tumbler Ridge: las huellas de dinosaurio que encontraron dos chicos en cámaras de aire
import React from "react";
import { interpolate } from "remotion";
import { Chapter, at, Tag, Pin, Icon, BigWord, Sticker, Note, Dots, Line, Radius, Portal, PortalSpec, PL, pj, pop, fadeOut, vis, ramp, win, clamp, SANS } from "./lib";
import { Terrain3D, TEX, TKey } from "./v3_fortune";

const S = at("but before we head up");
const T = {
  detour: at("little detour", S), dawson: at("south of dawson creek", S), foothills: at("into the foothills", S), secret: at("with a secret", S), kids: at("two kids found", S),
  town: at("the town is called", S), young: at("it's young", S), built: at("it was built in the early", S), coal: at("for the coal mines", S), streets: at("streets houses", S), forest: at("middle of the forest", S),
  then: at("then in the summer", S), boys: at("two boys were", S), noticed: at("noticed something strange", S), shapes: at("big shapes", S), giant: at("like giant footprints", S),
  exactly: at("that's exactly what", S), dino: at("dinosaur footprints", S), told: at("the boys told", S), scientists: at("when the scientists", S), more: at("more and more", S),
  trackways: at("trackways of dinosaurs", S), tens: at("tens of millions", S), different: at("looked completely different", S), bones: at("later they found bones", S), first: at("some of the first", S),
  love: at("i love this story", S), nobody: at("nobody went looking", S), took: at("it took two kids", S), lost: at("a whole lost world", S),
  today: at("today the whole area", S), unesco: at("unesco global geopark", S), handful: at("one of only a handful", S), research: at("little research center", S), walk: at("walk out with a guide", S),
  hand: at("you put your hand", S), stood: at("something stood right here", S), back: at("okay back to the highway", S), end: at("up the highway past", S),
};
const TR: [number, number] = [-120.99, 55.13];
const FLATBED: [number, number] = [-121.15, 55.02];
const CREEK: [number, number][] = [[-121.55, 54.92], [-121.38, 54.97], [-121.24, 55.0], [-121.15, 55.02], [-121.05, 55.07], [-120.95, 55.12]];
const ll = (n: string) => { const [lon, lat] = PL(n); return { lon, lat }; };

const PORTALS: PortalSpec[] = [
  { src: "img/s_tumbler_tubes.jpg", t0: T.then - 0.1, t1: T.shapes - 0.1, lon: FLATBED[0], lat: FLATBED[1], label: "Summer 2000" },
  { src: "img/s_dinosaur_mudflat.jpg", t0: T.trackways - 0.15, t1: T.bones - 0.1, lon: TR[0], lat: TR[1], maxR: 400, label: "Tens of millions of years ago" },
  { src: "img/s_tumbler_dig.jpg", t0: T.bones - 0.1, t1: T.love + 0.2, lon: TR[0], lat: TR[1] },
  { src: "img/g_dino_track.jpg", t0: T.hand - 0.15, t1: T.back - 0.05, lon: TR[0], lat: TR[1] },
];

// huella tridáctila de terópodo dibujada a mano: talón chico + tres dedos largos y abiertos, dedos hacia -y
const TOE = "M-13,0 C-15,-30 -8,-60 0,-80 C8,-60 15,-30 13,0 C7,8 -7,8 -13,0 Z";
const PrintG: React.FC<{ fill: string; stroke: string; sw: number }> = ({ fill, stroke, sw }) => (
  <g fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round">
    <ellipse cx={0} cy={6} rx={22} ry={24} />
    {[-42, 0, 42].map((r) => <path key={r} d={TOE} transform={`rotate(${r}) scale(${r ? 0.85 : 1})`} />)}
  </g>
);
const Prints: React.FC<{ f: number; t: number; t0: number; t1: number; n: number; x0: number; y0: number; dx: number; dy: number; step?: number; size?: number; rot?: number; color?: string; slabOn?: boolean }> = ({ f, t, t0, t1, n, x0, y0, dx, dy, step = 0.32, size = 1, rot = 0, color = "#3b2a1c", slabOn }) => {
  if (!vis(t, t0, t1)) return null;
  const out = fadeOut(t, t1);
  const slab = slabOn ? Math.min(1, pop(f, t0 - 0.15, 14) * 1.3) * out : 0;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {slabOn && <><defs><linearGradient id="slab" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9a948a" /><stop offset="1" stopColor="#6e675e" /></linearGradient></defs>
        <rect x={150} y={330} width={1620} height={620} rx={60} fill="url(#slab)" stroke="#fff" strokeWidth={6} opacity={slab} transform={`rotate(-4 960 640) translate(0 ${(1 - slab) * 60})`} style={{ filter: "drop-shadow(0 18px 30px rgba(0,0,0,.5))" }} /></>}
      {Array.from({ length: n }, (_, i) => {
        const k = pop(f, t0 + i * step, 9);
        const side = i % 2 ? 1 : -1;
        const x = x0 + dx * i - side * 30 * size * Math.sin((rot * Math.PI) / 180), y = y0 + dy * i + side * 30 * size * Math.cos((rot * Math.PI) / 180);
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${rot + 90}) scale(${size * interpolate(k, [0, 1], [1.8, 1])})`} opacity={Math.min(1, k * 1.5) * out}>
            <g style={{ filter: "drop-shadow(0 6px 8px rgba(0,0,0,.5))" }}><PrintG fill={color} stroke="#fff" sw={4} /></g>
          </g>
        );
      })}
    </svg>
  );
};
// huellas que aparecen sobre el mapa (anclas lon/lat)
const MapPrints: React.FC<{ c: any; f: number; t: number; t0: number; t1: number; pts: [number, number][]; step?: number; size?: number }> = ({ c, f, t, t0, t1, pts, step = 0.12, size = 0.45 }) => {
  if (!vis(t, t0, t1)) return null;
  const out = fadeOut(t, t1);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {pts.map(([lo, la], i) => {
        const [x, y] = pj(c, lo, la); const k = pop(f, t0 + i * step, 10);
        return <g key={i} transform={`translate(${x},${y}) rotate(${(i * 47) % 360}) scale(${size * interpolate(k, [0, 1], [2, 1])})`} opacity={Math.min(1, k * 1.5) * out}><PrintG fill="#ffd23a" stroke="#111" sw={6} /></g>;
      })}
    </svg>
  );
};
// rastro pseudoaleatorio estable alrededor del pueblo
const scatter = (n: number, seed: number, r: number): [number, number][] => Array.from({ length: n }, (_, i) => {
  const a = Math.sin(i * 12.9898 + seed) * 43758.5453, b = Math.sin(i * 78.233 + seed) * 12345.678;
  return [TR[0] + ((a - Math.floor(a)) - 0.5) * r * 1.8, TR[1] + ((b - Math.floor(b)) - 0.5) * r];
});
const MORE1 = scatter(7, 1, 0.5), MORE2 = scatter(9, 7, 0.9);

// relieve 3D: entramos a las sierras donde está el pueblo
const TK: TKey[] = [
  [0, -122.6, 54.25, 1.25, -121.0, 55.13, 0.05],
  [0, -121.9, 54.62, 0.82, -121.0, 55.13, 0.05],
  [0, -121.45, 54.86, 0.55, -120.98, 55.14, 0.08],
];

const Screen: Chapter["Screen"] = ({ c, f, t }) => {
  const tk: TKey[] = [[T.town - 0.1, ...TK[0].slice(1)] as TKey, [T.coal, ...TK[1].slice(1)] as TKey, [T.then, ...TK[2].slice(1)] as TKey];
  return (
    <>
      <Pin c={c} f={f} t={t} {...ll("dawson_creek")} t0={T.dawson - 0.2} t1={T.town} label="Dawson Creek" />
      <Dots c={c} f={f} t={t} pts={[PL("dawson_creek"), [-120.55, 55.5], [-120.8, 55.3], TR]} t0={T.detour} t1={T.town} dur={1.6} color="#ffd23a" icon="i_pickup" iconSize={96} />
      <Tag c={c} f={f} t={t} lon={-121.7} lat={55.45} t0={T.foothills} t1={T.town} text="Foothills" size={28} bg="#2a7d2e" />
      <Tag c={c} f={f} t={t} lon={TR[0]} lat={TR[1]} dy={-70} t0={T.secret} t1={T.town} text="?" size={52} bg="#e3261c" />

      {vis(t, T.town - 0.1, T.then) && (
        <Terrain3D name="nbc" t={t} t0={T.town - 0.1} t1={T.then} keys={tk} label="Tumbler Ridge" font={SANS} tex={TEX}>
          <Sticker f={f} t={t} t0={T.built} t1={T.then - 0.2} x={1500} y={230}>early <span style={{ color: "#ffd23a" }}>1980s</span></Sticker>
          <Sticker f={f} t={t} t0={T.coal} t1={T.then - 0.2} x={420} y={250} rot={5} size={66}>⛏ COAL</Sticker>
          {[["Streets", T.streets], ["Houses", T.streets + 0.45], ["A school", T.streets + 0.9]].map(([s, t0], i) => (
            <Sticker key={i} f={f} t={t} t0={t0 as number} t1={T.then - 0.2} x={560 + i * 400} y={620} rot={i % 2 ? 4 : -4} size={52}>{s as string}</Sticker>
          ))}
        </Terrain3D>
      )}

      {/* las formas en la piedra → huellas gigantes */}
      <Prints f={f} t={t} t0={T.shapes} t1={T.scientists - 0.2} n={5} x0={360} y0={800} dx={300} dy={-95} step={0.45} rot={-32} size={1.7} slabOn color="#3a2d22" />
      <BigWord f={f} t={t} t0={T.giant} t1={T.exactly} text="?" y={200} size={150} />
      <BigWord f={f} t={t} t0={T.dino} t1={T.told} text={<span>DINOSAUR <span style={{ color: "#ffd23a" }}>FOOTPRINTS</span></span>} y={190} size={104} />

      {/* más y más: huellas que se multiplican alrededor del pueblo */}
      <Pin c={c} f={f} t={t} lon={TR[0]} lat={TR[1]} t0={T.scientists - 0.2} t1={T.trackways} label="Tumbler Ridge" />
      <MapPrints c={c} f={f} t={t} t0={T.more} t1={T.trackways} pts={MORE1} />
      <MapPrints c={c} f={f} t={t} t0={T.more + 0.7} t1={T.trackways} pts={MORE2} />
      <Icon c={c} f={f} t={t} src="i_bone" lon={TR[0] + 0.35} lat={TR[1] + 0.1} t0={T.first} t1={T.love} size={130} />
      <Tag c={c} f={f} t={t} lon={TR[0]} lat={TR[1]} dy={250} t0={T.first} t1={T.love} text="First dinosaur bones in B.C." size={30} bg="#b8860b" />

      {/* nadie fue a buscar: el arroyo, las cámaras de aire */}
      <Pin c={c} f={f} t={t} lon={FLATBED[0]} lat={FLATBED[1]} t0={T.took - 0.2} t1={T.today} label="Flatbed Creek" side="l" color="#1e88e5" />
      <Line c={c} f={f} t={t} pts={CREEK} t0={T.took} t1={T.today} dur={1.8} color="#00e5ff" w={9} />
      <BigWord f={f} t={t} t0={T.lost} t1={T.today} text={<span>A WHOLE <span style={{ color: "#ffd23a" }}>LOST WORLD</span></span>} y={900} size={96} />
      <Note f={f} t={t} t0={T.nobody} t1={T.today} text="Nobody went looking" />

      {/* geoparque */}
      <Radius c={c} f={f} t={t} lon={TR[0]} lat={TR[1]} km={50} t0={T.today} t1={T.hand} color="#2ecc71" label="UNESCO Global Geopark" />
      <Tag c={c} f={f} t={t} lon={TR[0]} lat={TR[1]} dy={-280} t0={T.handful} t1={T.hand} text="One of a handful in North America" size={28} bg="#2a7d2e" />
      <Icon c={c} f={f} t={t} src="i_dino" lon={TR[0] - 0.05} lat={TR[1] - 0.04} t0={T.research} t1={T.hand} size={150} />
      <Tag c={c} f={f} t={t} lon={TR[0]} lat={TR[1]} dy={140} t0={T.research + 0.3} t1={T.hand} text="Research centre" size={28} />
      <Prints f={f} t={t} t0={T.walk} t1={T.hand} n={4} x0={700} y0={860} dx={180} dy={-30} step={0.4} size={0.8} rot={-8} color="#ffd23a" />

      <BigWord f={f} t={t} t0={T.stood + 0.2} t1={T.back} text="SOMETHING STOOD RIGHT HERE" y={940} size={74} />
      {/* volvemos a la ruta */}
      <Dots c={c} f={f} t={t} pts={[TR, [-120.8, 55.3], [-120.55, 55.5], PL("dawson_creek"), [-121.4, 56.6], PL("fort_nelson")]} t0={T.back} t1={T.end + 0.4} dur={2.0} color="#ffd23a" icon="i_pickup" iconSize={96} />
      {PORTALS.map((p, i) => <Portal key={i} c={c} t={t} f={f} p={p} />)}
    </>
  );
};

export const ch03: Chapter = {
  T0: S, T1: T.end,
  keys: [
    [S + 0.5, -121.3, 56.6, 0.45, 0], [T.dawson, -120.6, 55.7, 0.85, 0], [T.secret, -120.85, 55.35, 1.15, 0],
    [T.then, -121.1, 55.08, 1.5, 0], [T.exactly, -121.1, 55.08, 1.6, 0],
    [T.scientists - 0.3, -121.0, 55.13, 1.25, 0], [T.more + 1.8, -121.0, 55.13, 1.0, 0],
    [T.love, -121.0, 55.12, 1.05, 0], [T.took, -121.2, 55.02, 1.8, 0], [T.today - 0.2, -121.15, 55.05, 1.9, 0],
    [T.today + 0.6, -121.0, 55.13, 0.9, 0], [T.hand - 0.2, -121.0, 55.13, 0.95, 0],
    [T.back + 0.2, -121.0, 55.2, 0.9, 0], [T.end, -121.5, 57.0, 0.42, 0],
  ],
  Screen,
  full: [313.6, 334.92],
  sfx: [
    [T.detour, "wh2", 0.12, 1.2], [T.secret, "pop1", 0.12, 0.4], [T.town - 0.1, "wh5", 0.15, 1.6], [T.built, "st1", 0.13, 0.5], [T.coal, "pop2", 0.12, 0.4],
    [T.streets, "pop3", 0.1, 0.4], [T.streets + 0.45, "pop4", 0.1, 0.4], [T.streets + 0.9, "pop5", 0.1, 0.4], [T.then - 0.1, "sw4", 0.13, 1.2],
    [T.shapes, "tk1", 0.1, 2.0], [T.dino, "im1", 0.15, 1.4], [T.more, "pop1", 0.11, 0.4], [T.more + 0.7, "pop2", 0.11, 0.4], [T.trackways - 0.15, "sw1", 0.13, 1.2],
    [T.bones - 0.1, "sw4", 0.12, 1.0], [T.first, "ck2", 0.11, 0.4], [T.took, "wh2", 0.12, 1.2], [T.lost, "st2", 0.15, 0.6], [T.today, "wh6", 0.13, 1.4],
    [T.research, "pop3", 0.12, 0.4], [T.walk, "tk1", 0.08, 1.4], [T.hand - 0.15, "sw1", 0.13, 1.2], [T.stood + 0.2, "im2", 0.12, 1.0], [T.back, "wh5", 0.15, 1.6],
  ],
};
