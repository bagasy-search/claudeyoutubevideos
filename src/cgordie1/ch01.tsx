// Capítulo 1 — gancho + "el mapa es el primer secreto" (0:00 → Dawson Creek)
import React from "react";
import { interpolate } from "remotion";
import { Chapter, at, atEnd, Tag, Pin, Icon, BigWord, Sticker, Note, Line, Dots, Radius, Portal, PortalSpec, People, P, PL, pj, pop, fadeOut, vis, ramp, win, geo, clamp, SANS } from "./lib";
import geo2 from "./geo2.json";
const G2: any = geo2;

const T = {
  town: at("a town that was built"), hosp: at("hospital"), mall: at("shopping mall"), pool: at("swimming pool"), emptied: at("emptied out"), months18: at("18 months"),
  still: at("it's still standing"), volcano: at("a volcano that erupted"), river: at("a river that was turned"), turned: at("turned around"), backwards: at("backwards through"),
  road: at("a road the american"), eight: at("eight months during"), stretch: at("and a stretch of wild"), drop: at("drop a few european"), nobody: at("nobody would notice"),
  gordie: at("i'm gordy"), surveyed: at("before that i surveyed"), landed: at("i've landed on lakes"), chair: at("pull up a chair"), today: at("today i'm going to take"), piece: at("piece by piece"), hiding: at("show you what's hiding"),
  map: at("let's start with the map"), secret: at("the first secret"), huge: at("british columbia is huge"), france: at("france and germany"), germany: at("germany put together"), picture: at("but when most people picture"),
  van: at("vancouver"), vic: at("victoria"), whis: at("whistler"), okan: at("okanagan"), corner: at("all of that sits"), line: at("now draw a line"), pg: at("prince george"),
  above: at("everything above that line"), half: at("that's well over half"), number: at("and the number of people"), oneIn20: at("1 in 20"), pictureIt: at("picture it like this"), nation: at("big european nation"), city: at("one medium-sized city"), thatsNorth: at("that's northern bc"),
  young: at("when i first flew up"), hours: at("up here we measure"), fuel: at("how much fuel"), places: at("there are places up there"), quits: at("engine quits"), road200: at("nearest road might be"), person: at("the nearest person"),
  shaped: at("and yet this empty land"), gold: at("the gold that started"), power: at("the power that runs"), port: at("the port that ships"), jade: at("the jade"), lot: at("a lot of it comes"),
  dots: at("connect the dots"), connect: at("so let's connect them"), eastwest: at("we'll go from east"), alaska: at("the alaska highway all"), islands: at("the islands at the edge"), end: at("our first stop"),
};

export const ALCAN: [number, number][] = [[-120.24, 55.76], [-120.85, 56.25], [-121.9, 57.4], [-122.7, 58.81], [-124.3, 58.75], [-125.77, 58.95], [-126.1, 59.42], [-128.8, 60.06], [-131.5, 60.15], [-135.05, 60.72], [-137.5, 60.75], [-140.87, 62.38], [-142.98, 63.34], [-145.73, 64.04]];
const NORTH_Y = (61 - 53.92) * 276;

const PORTALS: PortalSpec[] = [
  { src: "img/s_kitsault_town.jpg", t0: T.still - 0.1, t1: T.volcano - 0.05, ...ll("kitsault"), label: "Still standing" },
  { src: "img/s_tseax_eruption.jpg", t0: at("buried whole villages") - 0.6, t1: T.river - 0.05, ...ll("tseax"), maxR: 330 },
  { src: "img/s_nechako_reverse.jpg", t0: T.backwards - 0.3, t1: T.road + 0.1, ...ll("kemano"), maxR: 310 },
  { src: "img/s_alcan_1942.jpg", t0: T.eight + 0.2, t1: T.stretch + 0.05, lon: -128, lat: 60, maxR: 300 },
  { src: "img/g_survey.jpg", t0: T.surveyed - 0.25, t1: T.landed + 0.1, lon: -125, lat: 56 },
  { src: "img/g_lake_landing.jpg", t0: T.landed - 0.1, t1: T.chair, lon: -128, lat: 58, label: "No name on the map" },
  { src: "img/g_chair.jpg", t0: T.chair - 0.15, t1: T.today + 0.35, lon: -126, lat: 56 },
  { src: "img/g_young_pilots.jpg", t0: T.young - 0.2, t1: at("he said, gordy") + 0.05, lon: -124, lat: 57, label: "Young pilot" },
  { src: "img/g_fuel_gauge.jpg", t0: T.fuel - 0.3, t1: T.places + 0.2, lon: -127.5, lat: 57.6 },
];
function ll(n: string) { const [lon, lat] = PL(n); return { lon, lat }; }

// puntos de "los secretos" que vamos a recorrer (piece by piece)
const STOPS = ["dawson_creek", "fort_nelson", "atlin", "williston", "cassiar", "kitsault", "tseax", "haida_gwaii", "prince_rupert", "kemano", "tatshenshini", "stewart"];

const World: Chapter["World"] = ({ t, z }) => {
  const bcGlow = win(t, T.huge - 0.2, T.picture + 0.4) + win(t, T.above - 0.3, T.number + 0.3) * 0.0;
  const north = ramp(t, T.above, 0.7) * (1 - ramp(t, T.young - 0.4, 0.4));
  const hook = win(t, 5.75, T.town + 0.2, 0.3);
  return (
    <g>
      <defs><mask id="noAK" maskUnits="userSpaceOnUse" x={-3000} y={-3000} width={12000} height={10000}><rect x={-3000} y={-3000} width={12000} height={10000} fill="#fff" /><path d={geo.prov["Alaska"]} fill="#000" /></mask><clipPath id="c1north"><rect x={-2000} y={-2000} width={9000} height={2000 + NORTH_Y} /></clipPath></defs>
      {/* Canadá entera en el arranque */}
      <path d={G2.world.Canada} fill="none" stroke="#fff" strokeWidth={3 / z} strokeOpacity={1 - ramp(t, 5.0, 1)} />
      <g mask="url(#noAK)">
      <path d={geo.prov["British Columbia"]} fill="#e3261c" fillOpacity={0.5 * hook} stroke="#fff" strokeWidth={4 / z} strokeOpacity={Math.max(hook, bcGlow, north, ramp(t, T.today, 0.5) * (1 - ramp(t, T.map, 0.5)))} style={{ filter: `drop-shadow(0 0 ${10 / z}px #fff)` }} />
      <path d={geo.prov["British Columbia"]} fill="#ffd23a" fillOpacity={0.35 * bcGlow} stroke="none" />
      {/* el Norte: todo lo que queda arriba de la línea de Prince George */}
      <path d={geo.prov["British Columbia"]} clipPath="url(#c1north)" fill="#ffd23a" fillOpacity={0.5 * north} stroke="#fff8c8" strokeWidth={4 / z} strokeOpacity={north} />
      {/* esquina de abajo (Vancouver y compañía) */}
      <ellipse cx={P(-122, 49.6)[0]} cy={P(-122, 49.6)[1]} rx={620} ry={420} fill="#ff6a3d" fillOpacity={0.28 * win(t, T.corner - 0.1, T.line + 0.2)} stroke="#fff" strokeWidth={5 / z} strokeOpacity={win(t, T.corner - 0.1, T.line + 0.2)} strokeDasharray={`${18 / z} ${12 / z}`} />
      </g>
    </g>
  );
};

// silueta de un país a escala real, apoyada sobre un punto del mapa
export const Sil: React.FC<{ c: any; f: number; t: number; name: string; lon: number; lat: number; t0: number; t1: number; color: string; label?: string; fade?: number }> = ({ c, f, t, name, lon, lat, t0, t1, color, label, fade = 1 }) => {
  if (!vis(t, t0, t1)) return null;
  const [x, y] = pj(c, lon, lat);
  const k = pop(f, t0, 12) * fadeOut(t, t1);
  const drop = interpolate(k, [0, 1], [2.2, 1]);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <g transform={`translate(${x},${y}) scale(${c.z * drop})`} opacity={Math.min(1, k * 1.4) * fade}>
        <path d={G2.sil[name]} fill={color} fillOpacity={0.62} stroke="#fff" strokeWidth={3.5 / c.z} strokeLinejoin="round" style={{ filter: "drop-shadow(0 10px 14px rgba(0,0,0,.45))" }} />
      </g>
      {label && <text x={x} y={y + 10} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={34} fill="#fff" stroke="#111" strokeWidth={6} paintOrder="stroke" opacity={k * fade} style={{ textTransform: "uppercase" }}>{label}</text>}
    </svg>
  );
};

const Screen: Chapter["Screen"] = ({ c, f, t }) => {
  const q = T.town - 0.1;
  return (
    <>
      {/* gancho: ¿qué hay arriba? */}
      {[[-128, 58.4], [-124.5, 57.2], [-131.5, 56.6], [-126.4, 55.4], [-121.6, 58.6]].map(([lo, la], i) => (
        <Tag key={i} c={c} f={f} t={t} lon={lo} lat={la} t0={5.8 + i * 0.16} t1={q} text="?" size={46} bg="#e3261c" />
      ))}
      <Tag c={c} f={f} t={t} lon={-126.5} lat={53.2} t0={6.2} t1={q} text="Northern B.C." size={34} />
      {/* Kitsault */}
      <Pin c={c} f={f} t={t} {...ll("kitsault")} t0={T.town} t1={T.still} label="A brand-new town" />
      <Icon c={c} f={f} t={t} src="i_hospital" lon={-130.1} lat={55.75} t0={T.hosp} t1={T.still} size={130} grey={ramp(t, T.emptied + 0.2, 0.6)} />
      <Icon c={c} f={f} t={t} src="i_mall" lon={-128.9} lat={55.8} t0={T.mall} t1={T.still} size={140} grey={ramp(t, T.emptied + 0.4, 0.6)} />
      <Icon c={c} f={f} t={t} src="i_pool" lon={-129.5} lat={55.15} t0={T.pool} t1={T.still} size={130} grey={ramp(t, T.emptied + 0.6, 0.6)} />
      <Sticker f={f} t={t} t0={T.months18} t1={T.still} x={1340} y={210}><span style={{ color: "#ffd23a" }}>18</span> MONTHS</Sticker>
      {/* volcán */}
      <Icon c={c} f={f} t={t} src="i_volcano" {...ll("tseax")} t0={T.volcano + 0.1} t1={T.river} size={170} />
      <Tag c={c} f={f} t={t} {...ll("tseax")} dy={60} t0={at("300 years ago")} t1={T.river} text="~300 years ago" bg="#9c2a1c" size={28} />
      {/* río al revés */}
      <Line c={c} f={f} t={t} pts={[[-125.9, 53.65], [-125.2, 53.55], [-124.95, 53.62]]} t0={T.river} t1={T.turned + 0.3} dur={0.8} color="#4fc3ff" w={9} />
      <Line c={c} f={f} t={t} pts={[[-125.9, 53.65], [-126.8, 53.5], [-127.94, 53.56]]} t0={T.turned + 0.15} t1={T.road} dur={1.2} color="#4fc3ff" w={11} />
      <Icon c={c} f={f} t={t} src="i_tunnel" {...ll("kemano")} t0={T.backwards} t1={T.road} size={140} />
      <Tag c={c} f={f} t={t} lon={-126.8} lat={53.95} t0={T.turned + 0.3} t1={T.road} text="⟵ Backwards" bg="#1565c0" size={28} />
      {/* Alaska Highway */}
      <Line c={c} f={f} t={t} pts={ALCAN} t0={T.road + 0.1} t1={T.stretch} dur={2.4} color="#ffd23a" w={8} icon="i_bulldozer" iconSize={110} />
      <Icon c={c} f={f} t={t} src="i_flag_us" {...ll("dawson_creek")} t0={at("american army")} t1={T.stretch} size={90} dx={40} />
      <Sticker f={f} t={t} t0={T.eight} t1={T.stretch} x={520} y={860} rot={5}><span style={{ color: "#ffd23a" }}>8</span> MONTHS</Sticker>
      {/* países europeos que "caben" en el Norte */}
      <Sil c={c} f={f} t={t} name="Netherlands" lon={-126.5} lat={58.3} t0={T.drop} t1={T.gordie} color="#ff8a1c" label="Netherlands" fade={1 - 0.7 * ramp(t, T.nobody, 0.6)} />
      <Sil c={c} f={f} t={t} name="Belgium" lon={-122.8} lat={56.9} t0={T.drop + 0.4} t1={T.gordie} color="#e3261c" label="Belgium" fade={1 - 0.7 * ramp(t, T.nobody, 0.6)} />
      <Sil c={c} f={f} t={t} name="Switzerland" lon={-130.2} lat={56.4} t0={T.drop + 0.8} t1={T.gordie} color="#d81b60" label="Switzerland" fade={1 - 0.7 * ramp(t, T.nobody, 0.6)} />
      <Tag c={c} f={f} t={t} lon={-126.5} lat={54.6} t0={T.nobody} t1={T.gordie} text="…nobody would notice" size={32} />
      {/* piece by piece */}
      {STOPS.map((n, i) => <Pin key={n} c={c} f={f} t={t} {...ll(n)} t0={T.piece + i * 0.17} t1={T.map - 0.2} color="#ffd23a" />)}
      <Tag c={c} f={f} t={t} lon={-127} lat={60.3} t0={T.hiding} t1={T.map - 0.2} text="What's hiding up there?" size={34} bg="#e3261c" />
      {/* el mapa */}
      <Note f={f} t={t} t0={T.map} t1={T.young - 0.2} text="The map" />
      <BigWord f={f} t={t} t0={T.secret} t1={T.huge + 0.2} text={<span>THE FIRST <span style={{ color: "#ffd23a" }}>SECRET</span></span>} />
      <Tag c={c} f={f} t={t} lon={-127} lat={54.2} t0={T.huge} t1={T.france} text="944,735 km²" size={40} bg="#b8860b" />
      <Sil c={c} f={f} t={t} name="France" lon={-125.8} lat={56.9} t0={T.france} t1={T.picture + 0.3} color="#1e5bd8" label="France" />
      <Sil c={c} f={f} t={t} name="Germany" lon={-122.6} lat={52.6} t0={T.germany} t1={T.picture + 0.3} color="#e3261c" label="Germany" />
      <Pin c={c} f={f} t={t} {...ll("vancouver")} t0={T.van} t1={T.line} label="Vancouver" />
      <Pin c={c} f={f} t={t} {...ll("victoria")} t0={T.vic} t1={T.line} label="Victoria" side="l" />
      <Pin c={c} f={f} t={t} {...ll("whistler")} t0={T.whis} t1={T.line} label="Whistler" />
      <Pin c={c} f={f} t={t} {...ll("kelowna")} t0={T.okan} t1={T.line} label="Okanagan" />
      <Tag c={c} f={f} t={t} lon={-121.5} lat={51.6} t0={T.corner + 0.2} t1={T.line} text="The bottom corner" size={30} bg="#c2410c" />
      <Line c={c} f={f} t={t} pts={[[-133.6, 53.92], [-119.6, 53.92]]} t0={T.line + 0.2} t1={T.young - 0.4} dur={1.6} color="#ffffff" w={8} />
      <Pin c={c} f={f} t={t} {...ll("prince_george")} t0={T.pg} t1={T.young - 0.4} label="Prince George" side="b" />
      <BigWord f={f} t={t} t0={T.above + 1.2} t1={T.half} text={<span>THE <span style={{ color: "#ffd23a" }}>NORTH</span></span>} y={170} />
      <Sticker f={f} t={t} t0={T.half} t1={T.number} x={1450} y={250}>&gt; <span style={{ color: "#ffd23a" }}>HALF</span></Sticker>
      <People f={f} t={t} t0={T.number + 0.2} t1={T.pictureIt + 0.1} n={20} hi={1} x={560} y={560} label="1 in 20 British Columbians" />
      <Sil c={c} f={f} t={t} name="France" lon={-126.5} lat={57.2} t0={T.nation} t1={T.thatsNorth + 0.6} color="#1e5bd8" />
      <Icon c={c} f={f} t={t} src="i_people" lon={-126.5} lat={57.2} t0={T.city} t1={T.thatsNorth + 0.6} size={120} />
      <Tag c={c} f={f} t={t} lon={-126.5} lat={56.2} t0={T.city + 0.3} t1={T.thatsNorth + 0.6} text="One city's worth of people" size={28} />
      <BigWord f={f} t={t} t0={T.thatsNorth} t1={T.young} text={<span>NORTHERN <span style={{ color: "#ffd23a" }}>B.C.</span></span>} y={920} />
      {/* km → horas */}
      <BigWord f={f} t={t} t0={T.hours} t1={T.fuel - 0.3} text={<span><s style={{ opacity: 0.6 }}>KILOMETRES</s> → <span style={{ color: "#ffd23a" }}>HOURS</span></span>} y={540} size={110} />
      {/* motor que se para */}
      <Icon c={c} f={f} t={t} src="i_plane" lon={-127.5 + interpolate(t, [T.places, T.quits], [-1.2, 0], clamp)} lat={57.6 - ramp(t, T.quits, 1.2) * 0.25} t0={T.places} t1={T.shaped - 0.1} size={150} />
      <Radius c={c} f={f} t={t} lon={-127.5} lat={57.35} km={200} t0={T.road200} t1={T.shaped - 0.1} label="200 km to the nearest road" />
      <Tag c={c} f={f} t={t} lon={-127.5} lat={55.0} t0={T.person + 0.3} t1={T.shaped - 0.1} text="Nearest person: even further" size={28} bg="#6b3fa0" />
      {/* lo que sale del Norte */}
      <Icon c={c} f={f} t={t} src="i_gold" {...ll("atlin")} t0={at("gold", T.gold)} t1={T.eastwest} size={120} />
      <Icon c={c} f={f} t={t} src="i_bolt" {...ll("kemano")} t0={at("power", T.power)} t1={T.eastwest} size={120} />
      <Icon c={c} f={f} t={t} src="i_container_ship" {...ll("prince_rupert")} t0={at("port", T.port)} t1={T.eastwest} size={140} />
      <Icon c={c} f={f} t={t} src="i_jade" {...ll("jade_city")} t0={at("jade", T.jade)} t1={T.eastwest} size={110} />
      <Tag c={c} f={f} t={t} {...ll("atlin")} dy={36} t0={at("gold", T.gold) + 0.2} t1={T.eastwest} text="Gold" size={24} bg="#b8860b" />
      <Tag c={c} f={f} t={t} {...ll("kemano")} dy={36} t0={at("power", T.power) + 0.2} t1={T.eastwest} text="Power" size={24} bg="#1565c0" />
      <Tag c={c} f={f} t={t} {...ll("prince_rupert")} dy={36} t0={at("port", T.port) + 0.2} t1={T.eastwest} text="Port" size={24} bg="#0f766e" />
      <Tag c={c} f={f} t={t} {...ll("jade_city")} dy={36} t0={at("jade", T.jade) + 0.2} t1={T.eastwest} text="Jade" size={24} bg="#15803d" />
      <Dots c={c} f={f} t={t} pts={[PL("atlin"), PL("jade_city"), PL("prince_rupert"), PL("kemano")]} t0={T.connect} t1={T.eastwest + 0.3} dur={1.4} color="#ffd23a" />
      {/* de este a oeste */}
      <Line c={c} f={f} t={t} pts={[PL("dawson_creek"), [-123.5, 57.3], [-127, 57.6], [-130.5, 56.2], [-132.2, 53.6]]} t0={T.eastwest + 0.3} t1={T.end} dur={4.2} color="#ffffff" w={9} icon="i_plane" iconSize={120} />
      <Tag c={c} f={f} t={t} {...ll("dawson_creek")} dy={44} t0={T.alaska} t1={T.end} text="Alaska Highway" size={26} />
      <Tag c={c} f={f} t={t} {...ll("haida_gwaii")} dy={-50} t0={T.islands} t1={T.end} text="Haida Gwaii" size={26} />
      {PORTALS.map((p, i) => <Portal key={i} c={c} t={t} f={f} p={p} />)}
    </>
  );
};

export const ch01: Chapter = {
  T0: 0, T1: T.end,
  keys: [
    [0, -100, 60, 0.12, 0], [5.6, -112, 58, 0.15, 0],
    [6.6, -126.5, 56.3, 0.34, 0], [T.town - 0.1, -126.8, 56.2, 0.36, 0],
    [T.town + 0.9, -129.5, 55.5, 0.95, 0], [T.still - 0.2, -129.45, 55.48, 1.05, 0],
    [T.volcano + 0.6, -128.9, 55.15, 1.0, 0], [T.river - 0.2, -128.95, 55.1, 1.08, 0],
    [T.river + 0.8, -126.7, 53.65, 0.95, 0], [T.road - 0.2, -126.6, 53.6, 1.0, 0],
    [T.road + 1.0, -131, 59.5, 0.27, 0], [T.stretch - 0.1, -131.5, 59.6, 0.28, 0],
    [T.stretch + 1.0, -126.5, 57.2, 0.34, 0], [T.gordie, -126.6, 57.0, 0.36, 0],
    [T.surveyed, -126.6, 57.0, 0.36, 0], [T.today + 0.4, -126.5, 56.2, 0.27, 0], [T.map - 0.3, -126.6, 56.0, 0.28, 0],
    [T.huge, -126.8, 54.6, 0.24, 0], [T.picture, -126.8, 54.4, 0.25, 0],
    [T.van, -122.5, 50.0, 0.55, 0], [T.corner, -122.6, 50.2, 0.5, 0],
    [T.line, -126.5, 54.4, 0.26, 0], [T.above, -126.5, 54.7, 0.26, 0], [T.number, -125.2, 55.4, 0.3, 0],
    [T.nation, -126.5, 56.4, 0.3, 0], [T.young - 0.3, -126.6, 56.2, 0.31, 0],
    [T.places, -127.5, 57.6, 0.5, 0], [T.shaped - 0.2, -127.5, 57.2, 0.38, 0],
    [T.gold - 0.3, -129, 56.7, 0.36, 0], [T.lot, -129.2, 56.6, 0.38, 0], [T.eastwest, -128.5, 56.4, 0.33, 0],
    [T.end, -127.5, 56.8, 0.3, 0],
  ],
  World,
  Screen,
  full: [0.18, 39.98, 60.28, 118.1],
  sfx: [
    [5.75, "wh5", 0.16, 1.4], [T.town, "sw2", 0.13, 0.9], [T.hosp, "pop1", 0.14, 0.4], [T.mall, "pop2", 0.14, 0.4], [T.pool, "pop3", 0.14, 0.4], [T.emptied + 0.2, "dg1", 0.1, 1.2], [T.months18, "st2", 0.16, 0.5],
    [T.still - 0.1, "sw1", 0.14, 1.2], [T.volcano, "wh8", 0.16, 1.4], [T.river, "sw3", 0.13, 1.0], [T.road, "wh6", 0.14, 1.2], [T.eight, "st1", 0.15, 0.5], [T.drop, "pop4", 0.14, 0.4], [T.drop + 0.4, "pop5", 0.14, 0.4], [T.drop + 0.8, "pop1", 0.14, 0.4],
    [T.surveyed - 0.25, "sw1", 0.13, 1.2], [T.landed - 0.1, "sw4", 0.12, 1.0], [T.chair - 0.15, "sw1", 0.12, 1.0], [T.piece, "tk1", 0.08, 2.0], [T.map, "pp1", 0.12, 0.8], [T.secret, "im1", 0.16, 1.4],
    [T.france, "pop2", 0.15, 0.4], [T.germany, "pop3", 0.15, 0.4], [T.van, "ck2", 0.1, 0.3], [T.vic, "ck2", 0.1, 0.3], [T.whis, "ck2", 0.1, 0.3], [T.okan, "ck2", 0.1, 0.3], [T.line + 0.2, "sw6", 0.12, 1.4], [T.half, "st2", 0.16, 0.5],
    [T.number + 0.2, "tk1", 0.08, 1.4], [T.young - 0.2, "sw1", 0.13, 1.2], [T.hours, "im2", 0.14, 1.0], [T.fuel - 0.3, "sw4", 0.12, 1.0], [T.road200, "wh2", 0.12, 1.0],
    [at("gold", T.gold), "ck6", 0.12, 1.0], [at("power", T.power), "ck6", 0.12, 1.0], [at("port", T.port), "ck6", 0.12, 1.0], [at("jade", T.jade), "ck6", 0.12, 1.0], [T.connect, "sw2", 0.12, 1.2], [T.eastwest + 0.3, "wh5", 0.14, 1.6],
  ],
};
