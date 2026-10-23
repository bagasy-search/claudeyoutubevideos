// abyss02 · escenas ILUSTRADAS ("Something Lives at the Bottom of the Second Deepest Trench"): todo en código con abysskit.
// Cada escena actúa la frase que se dice y nunca queda quieta. f = cuadro local (0 = arranque del bloque), d = duración en cuadros.
// name = "escena" o "escena:variante" (lo pone la escaleta esc.txt).
import { Plate } from "../abysskit/plate";
import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { C, FONT, ease, Person } from "../abysskit/kit";
import { Amphi, Arrow, Beam, Counter, Draw, Fish, Floor, GeoBase, Ghost, O, Pin, Ruler, Ship, Snow, Sphere, Sub, SV, Tag, Water, lin, rnd } from "../abysskit/ocean";
import { MAPS } from "../abysskit/maps";

const F = () => useCurrentFrame();
const M = "abyss02/map/";
type SP = { d: number; v: string };
// fondo de ficha: agua REAL desenfocada y oscura detrás (nunca un degradé plano), teñida con el tono de la escena
const Dark: React.FC<{ children?: React.ReactNode; tone?: string }> = ({ children, tone = "#03080f" }) => <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
  <Plate kind="deep" rate={0.4} vstyle={{ filter: "blur(4px) brightness(0.5) saturate(0.75)", transform: "scale(1.08)" }} />
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${tone}88 0%, rgba(0,0,0,.88) 85%)` }} />
  {children}
</AbsoluteFill>;
const Big: React.FC<{ x: number; y: number; k: number; size?: number; color?: string; children: React.ReactNode }> = ({ x, y, k, size = 110, color = O.orange, children }) => (
  <div style={{ position: "absolute", left: x, top: y, fontFamily: FONT, fontWeight: 900, fontSize: size, color, opacity: k, transform: `scale(${0.8 + 0.2 * k})`, transformOrigin: "left center", textShadow: "0 6px 26px rgba(0,0,0,.7)", whiteSpace: "nowrap" }}>{children}</div>
);
// corte de fosa en V (perfil del fondo) y su punto más hondo
const vPath = (y0: number, y1: number, w = 1920) => `M-20,${y0} L${w * 0.22},${y0 + 10} L${w * 0.42},${y1 - 60} L${w * 0.5},${y1} L${w * 0.58},${y1 - 60} L${w * 0.78},${y0 + 10} L${w + 20},${y0} L${w + 20},1100 L-20,1100 Z`;
const Trench: React.FC<{ y0?: number; y1?: number; shake?: number }> = ({ y0 = 420, y1 = 980, shake = 0 }) => {
  const f = F(), j = shake * Math.sin(f * 2.1) * 6;
  return <SV style={{ transform: `translateX(${j}px)` }}><defs><linearGradient id="tr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5a4f40" /><stop offset="100%" stopColor="#120f0c" /></linearGradient><filter id="rockT" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.03 0.07" numOctaves={4} seed={5} result="n" />
      <feDiffuseLighting in="n" lightingColor="#e6d6c2" surfaceScale={6} result="l"><feDistantLight azimuth={235} elevation={48} /></feDiffuseLighting>
      <feComposite in="l" in2="SourceGraphic" operator="in" result="c" /><feBlend in="SourceGraphic" in2="c" mode="multiply" /></filter></defs>
    <path d={vPath(y0, y1)} fill="url(#tr)" filter="url(#rockT)" /><path d={vPath(y0, y1).split(" L" + (1920 + 20))[0]} fill="none" stroke="#9fc7da" strokeWidth={3} opacity={0.35} /></SV>;
};
// placas en corte: la del Pacífico (derecha) se hunde por debajo de la otra
const Plates: React.FC<{ k: number; fast?: number }> = ({ k, fast = 0 }) => {
  const f = F(), off = (f * (1 + fast * 2)) % 80;
  return <SV>
    <defs><linearGradient id="pl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7a5a3e" /><stop offset="100%" stopColor="#3a2a1f" /></linearGradient></defs>
    <rect x={0} y={0} width={1920} height={560} fill="#0f3a58" />
    <path d="M0,520 L860,540 L900,600 L960,640 L940,1100 L0,1100 Z" fill="#5c4632" />
    <path d={`M1920,560 L1000,580 L960,640 Q820,820 620,1100 L820,1100 Q980,860 1060,700 L1920,690 Z`} fill="url(#pl)" />
    {Array.from({ length: 12 }).map((_, i) => { const x = 1900 - ((i * 80 + off) % 900); return <path key={i} d={`M${x},610 l-34,0 m0,0 l12,-10 m-12,10 l12,10`} stroke="#ffd2a0" strokeWidth={4} opacity={0.45 * k} />; })}
    {/* manto caliente */}
    <rect x={0} y={900} width={1920} height={200} fill="#b2421e" opacity={0.25} />
  </SV>;
};

const S: Record<string, React.FC<SP>> = {
  // "a steel ball barely wider than your shoulders… falling, three meters every second"
  sphere: ({ d, v }) => { const f = F(), two = v === "fall2", dep = two ? lin(f, 0, d, 9000, 10800) : lin(f, 0, d, 40, 40 + (d / 30) * 3 * 4);
    return <Water top={two ? 0.85 : 0.25} bot={two ? 1 : 0.5} drift={2.6}>
      <Sphere x={760} y={560} r={330} shake={0.5} lit={0.3} />
      <Counter x={1240} y={380} v={dep} unit="m" size={130} label={two ? "another kilometer" : "3 m every second"} />
      <Arrow x1={1340} y1={640} x2={1340} y2={640 + 220 * ((f % 30) / 30)} k={1} color={O.orange} w={12} />
    </Water>; },
  // regla de profundidad: el último sol (1.000 m) · la zona hadal (6.000 m)
  depth: ({ d, v }) => { const f = F(), had = v === "hadal", at = had ? lin(f, 0, d * 0.8, 4500, 6600) : lin(f, 0, d * 0.8, 150, 1300);
    const max = had ? 11000 : 1600, k = at / max;
    return <Water top={k * 0.9} bot={Math.min(1, k * 0.9 + 0.25)} rays={had ? 0 : Math.max(0, 1 - at / 900)} drift={2}>
      <Ruler x={1300} y0={110} y1={980} max={max} marks={had ? [[0], [1000, "last sunlight"], [4000, "abyss"], [6000, "HADAL ZONE"], [10800]] : [[0], [200, "gray"], [500, "black"], [1000, "LAST SUNLIGHT"]]} at={at} hot={had ? 6000 : 1000} />
      <Sphere x={560} y={540} r={170} inside={false} />
      {had && <Tag x={240} y={820} op={ease(f, d * 0.55, d * 0.65)} size={56} color={O.red}>HADES</Tag>}
      {!had && <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 300, background: "linear-gradient(180deg, rgba(255,240,200,.35), transparent)", opacity: Math.max(0, 1 - at / 1000) }} />}
    </Water>; },
  // la línea de los peces: arriba nadan, abajo de 8.200 m no hay ninguno · variante past: el récord 8.336 m y la fosa 2,5 km más abajo
  fishline: ({ d, v }) => { const f = F(), past = v === "past", ly = 560, line = ease(f, d * 0.25, d * 0.45);
    return <Water top={0.75} bot={1} drift={0.7}>
      {Array.from({ length: 16 }).map((_, i) => <Fish key={i} x={((rnd(i, 2) * 2200 + f * (1.5 + rnd(i, 3) * 2)) % 2200) - 140} y={130 + rnd(i, 4) * (ly - 190)} s={0.6 + rnd(i, 5) * 0.9} color="#9fb6c4" op={0.55} />)}
      <Draw pts={[[0, ly], [1920, ly]]} k={line} color={O.red} w={6} />
      <Tag x={90} y={ly - 70} op={line} color={O.red} size={52}>8,200 m</Tag>
      <Tag x={90} y={ly + 40} op={ease(f, d * 0.5, d * 0.6)} size={64}>NO FISH. ANYWHERE. EVER.</Tag>
      {past && <><Ghost x={1300} y={ly + 70} s={0.8} /><Tag x={1100} y={ly + 140} op={ease(f, d * 0.3, d * 0.4)} size={38} color={O.gold}>deepest fish ever filmed · 8,336 m</Tag>
        <Draw pts={[[1700, ly + 40], [1700, 1010]]} k={ease(f, d * 0.55, d * 0.8)} color={O.orange} w={8} />
        <Tag x={1480} y={1000} op={ease(f, d * 0.75, d * 0.85)} size={44} color={O.orange}>+2.5 km · Horizon Deep</Tag></>}
    </Water>; },
  // las luces se encienden y el piso se mueve (anfípodos por cientos)
  flood: ({ d, v }) => { const f = F(), back = v === "back", on = back ? 1 : ease(f, d * 0.35, d * 0.45);
    return <Dark>
      <Floor y={640} lit={0.3 + 0.7 * on} seed={3} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 80%, rgba(255,240,200,${0.28 * on}) 0%, transparent 55%)` }} />
      {Array.from({ length: back ? 34 : 26 }).map((_, i) => <div key={i} style={{ opacity: on }}><Amphi x={rnd(i, 7) * 1900 + Math.sin(f / 30 + i) * 30} y={720 + rnd(i, 8) * 340} s={0.22 + rnd(i, 9) * 0.18} flip={rnd(i, 10) < 0.5} ph={i * 7} /></div>)}
      {back && <Amphi x={lin(f, 0, d, 260, 620)} y={560} s={1.3} ph={3} />}
      <Sub x={960} y={180} s={0.9} on={on} ang={95} />
      <Snow n={60} drift={0.5} />
    </Dark>; },
  // mapas: dónde está la fosa (Tonga, Nueva Zelanda, 2.000 km) · la cicatriz de 1.400 km · el final
  geo: ({ d, v }) => { const f = F(), m = MAPS.swpac;
    if (v === "two") { const mp = MAPS.pac; return <GeoBase png={M + "pac_sat.png"} m={mp} d={d} zoom={[1, 1.06]}>{(P) => <>
      <Draw pts={[P("mariana_n"), P("mariana_s")]} k={ease(f, 6, 30)} color={O.orange} w={10} glow />
      <Draw pts={[P("tonga_n"), P("tonga_s"), P("kerm_s")]} k={ease(f, 20, 44)} color={O.red} w={10} glow />
      <Pin x={P("challenger")[0]} y={P("challenger")[1]} k={ease(f, 26, 36)} label="Challenger Deep · ~10,935 m" />
      <Pin x={P("horizon")[0]} y={P("horizon")[1]} k={ease(f, 40, 50)} label="Horizon Deep · ~10,800 m" />
    </>}</GeoBase>; }
    const scar = v === "scar";
    return <GeoBase png={M + "swpac_sat.png"} m={m} d={d} zoom={scar ? [1.15, 1.3] : [1, 1.12]} fx={0.72} fy={0.45}>{(P) => <>
      {!scar && <><Pin x={P("nukualofa")[0]} y={P("nukualofa")[1]} k={ease(f, 8, 18)} label="TONGA" />
        <Pin x={P("auckland")[0]} y={P("auckland")[1]} k={ease(f, 30, 40)} label="NEW ZEALAND" color={O.orange} />
        <Draw pts={[P("auckland"), P("nukualofa")]} k={ease(f, d * 0.45, d * 0.75)} color={O.ink} w={5} dash="16 14" />
        <Tag x={(P("auckland")[0] + P("nukualofa")[0]) / 2 + 30} y={(P("auckland")[1] + P("nukualofa")[1]) / 2} op={ease(f, d * 0.7, d * 0.8)} size={48} color={O.gold}>~2,000 km</Tag></>}
      {scar && <><Draw pts={[P("tonga_n"), P("horizon"), P("tonga_s"), P("kerm_s")]} k={ease(f, 6, d * 0.7)} color={O.red} w={14} glow />
        <Pin x={P("horizon")[0]} y={P("horizon")[1]} k={ease(f, d * 0.5, d * 0.6)} label="Horizon Deep" />
        <Tag x={P("tonga_s")[0] + 50} y={P("tonga_s")[1]} op={ease(f, d * 0.6, d * 0.7)} size={52} color={O.gold}>1,400 km</Tag></>}
    </>}</GeoBase>; },
  // la placa del Pacífico se mete debajo (24 cm por año, el choque más rápido medido)
  subduct: ({ d, v }) => { const f = F(), fast = v === "fast" ? 1 : 0;
    return <AbsoluteFill style={{ background: "#0f3a58" }}>
      <Plates k={1} fast={fast} />
      <Tag x={1250} y={430} size={48}>PACIFIC PLATE</Tag>
      <Arrow x1={1700} y1={630} x2={1150} y2={630} k={ease(f, 4, 30)} color={O.orange} w={14} />
      <Arrow x1={940} y1={700} x2={760} y2={1000} k={ease(f, 20, 50)} color={O.red} w={14} />
      {fast > 0 && <Big x={1150} y={760} k={ease(f, 10, 22)} size={150}>24 cm<span style={{ fontSize: 60, color: O.ink }}> / year</span></Big>}
      {v === "end" && <Tag x={200} y={200} op={ease(f, 10, 20)} size={56} color={O.orange}>still sliding into the Earth</Tag>}
      <Sphere x={950} y={560} r={22} inside={false} />
    </AbsoluteFill>; },
  // uñas 4 cm/año contra la fosa 24 cm/año
  nails: ({ d }) => { const f = F(), k = ease(f, 6, d * 0.8);
    return <Dark tone="#0e2236">
      {[["your fingernails", 4, O.ink], ["Tonga Trench", 24, O.red]].map(([t, cm, col], i) => <React.Fragment key={i}>
        <Tag x={160} y={330 + i * 260} size={46} color={O.dim}>{t as string}</Tag>
        <div style={{ position: "absolute", left: 160, top: 400 + i * 260, height: 70, borderRadius: 12, width: 60 + 1500 * k * (cm as number) / 24, background: col as string }} />
        <Tag x={190 + 1500 * k * (cm as number) / 24} y={406 + i * 260} size={54} color={col as string}>{Math.round(k * (cm as number))} cm</Tag>
      </React.Fragment>)}
      <Big x={1300} y={130} k={ease(f, d * 0.7, d * 0.8)} size={130}>×6</Big>
    </Dark>; },
  // el Everest cae en la fosa y su cumbre queda ~2 km bajo el agua
  everest: ({ d }) => { const f = F(), drop = ease(f, d * 0.15, d * 0.6), top = lin(drop, 0, 1, -380, 450);
    return <AbsoluteFill style={{ background: "linear-gradient(180deg,#123c5a 0%, #06121f 100%)" }}>
      <SV><rect x={0} y={0} width={1920} height={110} fill="#4b8fb0" opacity={0.6} /></SV>
      <Trench y0={250} y1={1060} />
      <SV><path d={`M700,${top + 610} L960,${top} L1220,${top + 610} Z`} fill="#e8eef2" /><path d={`M880,${top + 180} L960,${top} L1040,${top + 180} L1000,${top + 150} L960,${top + 190} L920,${top + 150} Z`} fill="#ffffff" /></SV>
      <Tag x={1250} y={top + 20} op={ease(f, d * 0.55, d * 0.65)} size={50}>MOUNT EVEREST</Tag>
      <Draw pts={[[960, 110], [960, Math.max(112, top - 10)]]} k={ease(f, d * 0.65, d * 0.8)} color={O.orange} w={8} />
      <Tag x={990} y={220} op={ease(f, d * 0.75, d * 0.85)} size={60} color={O.orange}>~2 km of water above it</Tag>
    </AbsoluteFill>; },
  // el barco manda pulsos de sonido y cronometra el eco (1952)
  echo: ({ d }) => { const f = F(), T = 90, ph = (f % T) / T, sec = (f / 30) * 1.4;
    return <AbsoluteFill style={{ background: "linear-gradient(180deg,#9fb8c4 0%,#9fb8c4 14%, #1a4a66 15%, #040b14 100%)" }}>
      <Ship x={700} y={170} s={0.75} old color="#1b2530" />
      <Trench y0={820} y1={1060} />
      <SV>{[0, 1, 2].map((i) => { const q = (ph + i / 3) % 1, down = q < 0.5, y = down ? 200 + q * 2 * 760 : 960 - (q - 0.5) * 2 * 760; return <path key={i} d={`M${700 - 60 - q * 80},${y} Q700,${y + (down ? 30 : -30)} ${700 + 60 + q * 80},${y}`} stroke={down ? O.cyan : O.orange} strokeWidth={6} fill="none" opacity={0.85} />; })}</SV>
      <Counter x={1250} y={300} v={sec} unit="s" size={140} label="waiting for the echo" />
      <Tag x={1250} y={560} op={ease(f, d * 0.55, d * 0.65)} size={50} color={O.gold}>bottom: ~10,800 m</Tag>
    </AbsoluteFill>; },
  // dos fosas lado a lado: la diferencia es un edificio de 40 pisos · la Mariana se lleva los flashes
  podium: ({ d }) => { const f = F(), k = ease(f, 6, d * 0.5), fl = f > d * 0.6 ? (Math.floor(f / 5) % 3 === 0 ? 1 : 0) : 0;
    const col = (x: number, h: number, name: string, deep: string, hot: boolean) => <>
      <div style={{ position: "absolute", left: x, top: 300, width: 300, height: h * k, background: `linear-gradient(180deg,#1a4a66,#04101c)`, border: `3px solid ${hot ? O.gold : "rgba(244,239,230,.4)"}`, borderTop: "none" }} />
      <Tag x={x} y={310 + h * k} size={42} color={hot ? O.gold : O.ink}>{name}</Tag><Tag x={x} y={365 + h * k} size={34} color={O.dim}>{deep}</Tag></>;
    return <Dark tone="#0b1d2e">
      {col(520, 560, "CHALLENGER DEEP", "~10,935 m", true)}{col(1100, 551, "HORIZON DEEP", "~10,800 m", false)}
      <SV><rect x={1100} y={300 + 551 * k} width={300} height={9 * k} fill={O.orange} /></SV>
      <Tag x={1430} y={280 + 551 * k} op={ease(f, d * 0.4, d * 0.5)} size={36} color={O.orange}>≈ 40 stories</Tag>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 670px 120px, rgba(255,255,255,${0.5 * fl}), transparent 40%)` }} />
    </Dark>; },
  // fábrica de terremotos: sismos profundos que saltan sobre la placa que se hunde
  quakes: ({ d }) => { const f = F();
    return <AbsoluteFill style={{ background: "#0f3a58" }}>
      <Plates k={1} />
      {Array.from({ length: 40 }).map((_, i) => { const t0 = rnd(i, 3) * d * 0.9, q = (f - t0) / 18, p = 0.1 + rnd(i, 4) * 0.85, x = 960 - p * 300 + (rnd(i, 5) - 0.5) * 60, y = 640 + p * 420; return q > 0 && q < 1 ? <div key={i} style={{ position: "absolute", left: x - 40 * q, top: y - 40 * q, width: 80 * q, height: 80 * q, borderRadius: "50%", border: `4px solid ${O.red}`, opacity: 1 - q }} /> : q >= 1 ? <div key={i} style={{ position: "absolute", left: x - 6, top: y - 6, width: 12, height: 12, borderRadius: 6, background: O.red, opacity: 0.7 }} /> : null; })}
      <Tag x={1180} y={820} op={ease(f, d * 0.4, d * 0.5)} size={52} color={O.red}>deep earthquakes</Tag>
    </AbsoluteFill>; },
  // presión: cada 10 m, una atmósfera más · el globo se aplasta
  press: ({ d, v }) => { const f = F();
    if (v === "balloon") { const m = lin(f, 0, d * 0.8, 0, 100), sc = 1 / (1 + m / 10);
      return <Water top={m / 300} bot={m / 300 + 0.3} rays={1 - m / 100}>
        <div style={{ position: "absolute", left: 960 - 200 * Math.sqrt(sc), top: 470 - 230 * Math.sqrt(sc), width: 400 * Math.sqrt(sc), height: 460 * Math.sqrt(sc), borderRadius: "50% 50% 48% 48%", background: "radial-gradient(circle at 35% 30%, #ff8a7a, #d8261c)" }} />
        <Counter x={1300} y={330} v={m} unit="m" size={120} label={`${Math.round(1 + m / 10)} atmospheres`} />
      </Water>; }
    const m = lin(f, 0, d * 0.85, 0, 60), atm = 1 + m / 10;
    return <Water top={m / 400} bot={m / 400 + 0.3} rays={1}>
      {Array.from({ length: Math.floor(atm) }).map((_, i) => <div key={i} style={{ position: "absolute", left: 760, top: 560 - (i + 1) * 62, width: 400, height: 54, borderRadius: 8, background: "rgba(244,239,230,.14)", border: "2px solid rgba(244,239,230,.4)", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: O.ink, textAlign: "center", lineHeight: "54px" }}>1 atm</div>)}
      <Person x={960} y={840} s={1} arms="up" />
      <Counter x={1320} y={600} v={m} unit="m" size={110} label={`${atm.toFixed(0)} atm`} />
    </Water>; },
  // un auto chico apoyado en cada centímetro cuadrado: la yema del dedo, el ojo
  carfinger: ({ d }) => { const f = F(), k = ease(f, 8, 26), eye = f > d * 0.6;
    return <Dark tone="#16283a">
      {!eye ? <OffthreadVideo src={staticFile("abyss02/real/nail_7299382.mp4")} muted playbackRate={0.4} startFrom={15} style={{ position: "absolute", inset: 0, width: 1920, height: 1080, objectFit: "cover", filter: `brightness(${0.95 - 0.2 * k})` }} />
        : <SV><ellipse cx={1340} cy={600} rx={320} ry={170} fill="#f6f1ea" /><circle cx={1340} cy={600} r={120} fill="#3b6b8a" /><circle cx={1340} cy={600} r={55} fill="#111" /></SV>}
      <SV><rect x={eye ? 1280 : 1290} y={eye ? 540 : 470} width={120} height={120} fill="none" stroke={O.orange} strokeWidth={5} strokeDasharray="12 8" opacity={k} /></SV>
      <svg width={420} height={230} viewBox="0 0 420 230" style={{ position: "absolute", left: (eye ? 1340 : 1350) - 210, top: (eye ? 540 : 470) - 140 - 260 * (1 - k), transform: `scale(${0.6 + 0.12 * k})`, transformOrigin: "50% 100%", filter: `drop-shadow(0 ${30 * (1 - k) + 8}px ${14 + 20 * (1 - k)}px rgba(0,0,0,.6))` }}>
        <defs><linearGradient id="carb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff6a5a" /><stop offset="45%" stopColor="#c8221a" /><stop offset="100%" stopColor="#5a0c08" /></linearGradient>
          <linearGradient id="carw" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#e6f4fb" /><stop offset="60%" stopColor="#6d8ea0" /><stop offset="100%" stopColor="#24343e" /></linearGradient></defs>
        <path d="M20,150 L40,90 Q70,40 150,40 L280,40 Q340,40 370,90 L400,150 L400,180 L20,180 Z" fill="url(#carb)" /><path d="M110,60 L310,60 L330,110 L90,110 Z" fill="url(#carw)" />
        <path d="M40,120 L390,120" stroke="#ffb3a8" strokeWidth={3} opacity={0.5} /><rect x={380} y={130} width={18} height={14} rx={4} fill="#fff4cc" />
        <circle cx={100} cy={185} r={32} fill="#111" /><circle cx={100} cy={185} r={14} fill="#9aa4ac" /><circle cx={320} cy={185} r={32} fill="#111" /><circle cx={320} cy={185} r={14} fill="#9aa4ac" /></svg>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,.7) 0%, rgba(0,0,0,0) 45%)" }} />
      <Tag x={160} y={420} op={ease(f, 20, 30)} size={64} color={O.orange}>1 cm²</Tag>
      <Tag x={160} y={510} op={ease(f, 30, 40)} size={46}>{eye ? "on each eye" : "on your fingertip"}</Tag>
    </Dark>; },
  // la presión dobla las proteínas y endurece la pared de la célula (como manteca en la heladera)
  protein: ({ d }) => { const f = F(), sq = ease(f, d * 0.3, d * 0.7), N = 22;
    const pts = Array.from({ length: N }).map((_, i) => { const a = i * 0.62; const r = 150 - i * 3; return [520 + Math.cos(a) * r * (1 - 0.45 * sq) + (rnd(i, 3) - 0.5) * 60 * sq, 520 + Math.sin(a) * r * (1 - 0.1 * sq) * (1 - 0.5 * sq) + (rnd(i, 4) - 0.5) * 50 * sq]; });
    return <Dark tone="#10263a">
      <SV><path d={"M" + pts.map((p) => p.join(",")).join(" L")} stroke={O.gold} strokeWidth={8} fill="none" />{pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={16} fill={i % 3 ? O.orange : O.cyan} />)}
        {[0, 1, 2, 3].map((i) => { const a = (i * Math.PI) / 2; return <line key={i} x1={520 + Math.cos(a) * 420} y1={520 + Math.sin(a) * 380} x2={520 + Math.cos(a) * (300 - 60 * sq)} y2={520 + Math.sin(a) * (260 - 50 * sq)} stroke={O.red} strokeWidth={10} opacity={sq} />; })}
        {/* membrana: dos filas de cabezas con colas que dejan de moverse */}
        {Array.from({ length: 16 }).map((_, i) => { const x = 1120 + i * 46, w = (1 - sq) * Math.sin(f / 5 + i) * 10; return <g key={i}><circle cx={x} cy={420} r={16} fill={O.sky} /><path d={`M${x - 5},436 q${w},30 0,70 M${x + 5},436 q${-w},30 0,70`} stroke={O.ivory} strokeWidth={4} fill="none" /><circle cx={x} cy={640} r={16} fill={O.sky} /><path d={`M${x - 5},624 q${w},-30 0,-70 M${x + 5},624 q${-w},-30 0,-70`} stroke={O.ivory} strokeWidth={4} fill="none" /></g>; })}</SV>
      <Tag x={330} y={820} size={44}>protein</Tag><Tag x={1180} y={720} size={44}>cell wall</Tag>
      <Tag x={1180} y={800} op={sq} size={44} color={O.red}>stiff, like cold butter</Tag>
    </Dark>; },
  // TMAO: moléculas chicas que abrazan a la proteína; cuanto más hondo, más hace falta
  tmao: ({ d }) => { const f = F(), k = ease(f, d * 0.1, d * 0.6), lvl = ease(f, d * 0.45, d * 0.95);
    return <Dark tone="#10263a">
      <SV><circle cx={700} cy={540} r={180} fill="none" stroke={O.gold} strokeWidth={14} strokeDasharray="30 12" />
        {Array.from({ length: 26 }).map((_, i) => { const a = (i / 26) * Math.PI * 2 + f / 120, r0 = 520 + rnd(i, 2) * 200, r = r0 + (240 - r0) * k; return <g key={i}><circle cx={700 + Math.cos(a) * r} cy={540 + Math.sin(a) * r} r={18} fill={O.cyan} /><circle cx={700 + Math.cos(a) * (r + 22)} cy={540 + Math.sin(a) * (r + 22)} r={9} fill={O.red} /></g>; })}</SV>
      <Tag x={560} y={515} size={48} color={O.gold}>protein</Tag>
      <Tag x={420} y={120} op={k} size={58} color={O.cyan}>TMAO</Tag>
      {/* medidor: TMAO por profundidad */}
      <div style={{ position: "absolute", left: 1400, top: 200, width: 120, height: 680, borderRadius: 20, border: "3px solid rgba(244,239,230,.5)" }} />
      <div style={{ position: "absolute", left: 1406, top: 874 - 668 * (0.15 + 0.8 * lvl), width: 108, height: 668 * (0.15 + 0.8 * lvl), borderRadius: 16, background: `linear-gradient(0deg, ${O.cyan}, ${O.red})` }} />
      <Tag x={1560} y={840} size={36}>shallow</Tag><Tag x={1560} y={210} size={36} color={O.red}>deep</Tag>
    </Dark>; },
  // ósmosis: a 8.200 m el pez queda más salado que el mar → entra agua y la célula revienta
  osmosis: ({ d }) => { const f = F(), sw = ease(f, d * 0.45, d * 0.9), pop = f > d * 0.88;
    return <Water top={0.85} bot={1} drift={0.6}>
      <div style={{ position: "absolute", left: 700 - 220 * (1 + sw * 0.5), top: 540 - 220 * (1 + sw * 0.5), width: 440 * (1 + sw * 0.5), height: 440 * (1 + sw * 0.5), borderRadius: "50%", border: `8px ${pop ? "dashed" : "solid"} ${pop ? O.red : O.gold}`, background: "rgba(255,200,120,.10)" }} />
      {Array.from({ length: 14 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 700 + Math.cos(i) * 120 * (1 + sw * 0.5) - 8, top: 540 + Math.sin(i * 1.3) * 120 * (1 + sw * 0.5) - 8, width: 16, height: 16, borderRadius: 3, background: "#fff", opacity: 0.8 }} />)}
      {Array.from({ length: 8 }).map((_, i) => { const a = (i / 8) * Math.PI * 2, R = 520; return <Arrow key={i} x1={700 + Math.cos(a) * R} y1={540 + Math.sin(a) * R} x2={700 + Math.cos(a) * 360} y2={540 + Math.sin(a) * 360} k={sw} color={O.cyan} w={9} />; })}
      <Tag x={1250} y={300} size={44}>salt inside the fish</Tag>
      <div style={{ position: "absolute", left: 1250, top: 370, height: 46, width: 520 * (0.4 + 0.6 * ease(f, 0, d * 0.4)), background: O.orange, borderRadius: 8 }} />
      <Tag x={1250} y={460} size={44}>salt in the sea</Tag>
      <div style={{ position: "absolute", left: 1250, top: 530, height: 46, width: 520 * 0.7, background: O.sky, borderRadius: 8 }} />
      <Tag x={1250} y={640} op={sw} size={52} color={O.cyan}>water rushes in</Tag>
    </Water>; },
  // trampa con carnada: baja a la fosa y vuelve llena
  trap: ({ d }) => { const f = F(), down = ease(f, 0, d * 0.45), up = ease(f, d * 0.7, d), y = 140 + 700 * down - 700 * up, full = ease(f, d * 0.4, d * 0.7);
    return <Water top={0.75} bot={1} drift={0.8}>
      <Floor y={900} seed={5} lit={0.6} />
      <SV><line x1={960} y1={-20} x2={960} y2={y} stroke="#c9b48e" strokeWidth={4} /></SV>
      <div style={{ position: "absolute", left: 870, top: y, width: 180, height: 120, border: "6px solid #e07a2a", borderRadius: 10, background: "rgba(255,255,255,.06)" }}>
        {Array.from({ length: 40 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 10 + rnd(i, 3) * 150, top: 100 - rnd(i, 4) * 90 * full, width: 16, height: 8, borderRadius: 4, background: O.ivory, opacity: rnd(i, 5) < full ? 1 : 0 }} />)}
      </div>
      {Array.from({ length: 18 }).map((_, i) => <div key={i} style={{ opacity: ease(f, d * 0.35, d * 0.5) * (1 - up) }}><Amphi x={960 + Math.cos(i + f / 20) * (300 - full * 200)} y={940 + Math.sin(i * 2) * 60} s={0.16} ph={i * 5} flip={i % 2 === 0} /></div>)}
      <Tag x={1180} y={200} op={up} size={64} color={O.orange}>FULL</Tag>
    </Water>; },
  // el anfípodo: cuerpo curvo, muchas patas, caparazón color marfil viejo · del tamaño de tu pulgar
  amphi: ({ d }) => { const f = F(), th = ease(f, d * 0.6, d * 0.75);
    return <Dark tone="#13263a">
      <Amphi x={lin(f, 0, d, 760, 860)} y={600} s={2.6} />
            <Tag x={1240} y={820} op={ease(f, 30, 40)} size={44}>many legs</Tag>
      <Tag x={1180} y={340} op={ease(f, 50, 60)} size={44} color={O.ivory}>shell like old ivory</Tag>
      <SV><path d="M1500,1100 L1500,760 Q1500,640 1600,640 Q1700,640 1700,760 L1700,1100 Z" fill="#f2c49b" opacity={th} /></SV>
      <div style={{ opacity: th }}><Amphi x={1600} y={720} s={0.5} walk={false} /></div>
    </Dark>; },
  // la cadena: el sol alimenta todo desde arriba; abajo nadie atrapa luz
  chain: ({ d }) => { const f = F(), k = ease(f, 4, d * 0.7);
    return <Water top={0} bot={0.95} rays={1} drift={-0.6}>
      <div style={{ position: "absolute", left: 860, top: -140, width: 200, height: 200, borderRadius: 100, background: "#ffe39a", boxShadow: "0 0 120px 60px rgba(255,220,140,.6)" }} />
      {Array.from({ length: 50 }).map((_, i) => <div key={i} style={{ position: "absolute", left: rnd(i, 2) * 1920, top: 120 + rnd(i, 3) * 120 + Math.sin(f / 15 + i) * 6, width: 8, height: 8, borderRadius: 4, background: "#7ee08a", opacity: 0.8 }} />)}
      {[0, 1, 2].map((i) => <Fish key={i} x={(f * 3 + i * 700) % 2100 - 100} y={330 + i * 40} s={1} color="#123044" />)}
      <Arrow x1={300} y1={120} x2={300} y2={560} k={k} color={O.gold} w={12} />
      <Tag x={340} y={140} op={ease(f, 10, 20)} size={40}>sunlight → plants → animals</Tag>
      <Tag x={760} y={850} op={ease(f, d * 0.6, d * 0.7)} size={56} color={O.dim}>down here: no sunlight</Tag>
    </Water>; },
  // nieve marina: cae y se la comen en el camino; a 4.000 m casi no queda
  snowfall: ({ d }) => { const f = F(), left = 1 - 0.95 * ease(f, d * 0.1, d * 0.85);
    return <Water top={0.3} bot={1} drift={-1}>
      <Snow n={Math.round(260 * left)} drift={-1.3} color="#f2efe6" size={1.6} />
      {[0, 1, 2, 3].map((i) => <Fish key={i} x={(f * (2 + i) + i * 500) % 2100 - 100} y={250 + i * 160} s={0.8} color="#091a28" />)}
      <Ruler x={1700} y0={80} y1={1000} max={5000} marks={[[0], [1000], [2000], [3000], [4000, "almost nothing left"]]} hot={4000} side="l" />
      <Counter x={160} y={780} v={left * 100} unit="% left" size={110} color={O.gold} />
    </Water>; },
  // la fosa como embudo: lo que cae en las laderas resbala al centro; el sismo suelta avalanchas
  funnel: ({ d, v }) => { const f = F(), shake = v === "quake" ? (Math.sin((f / d) * Math.PI)) : 0, trash = v === "trash";
    const N = 70, col = (i: number) => (trash ? ["#ff5a7a", "#3a8bff", "#ffd23a", "#59e0a0"][i % 4] : "#d9c9a6");
    return <Water top={0.6} bot={1} drift={-0.5}>
      <Trench y0={360} y1={1000} shake={shake} />
      {Array.from({ length: N }).map((_, i) => { const side = i % 2 ? 1 : -1, sp = 0.3 + rnd(i, 3) * 0.9 + (shake > 0.2 ? 2 : 0), q = ((rnd(i, 4) * 200 + f * sp) % 200) / 200;
        const x0 = 960 + side * (500 + rnd(i, 5) * 300), y0 = 380 + rnd(i, 6) * 20, x = x0 + (960 - x0) * q, y = y0 + (970 - y0) * Math.pow(q, 0.9);
        return <div key={i} style={{ position: "absolute", left: x - 6, top: y - 6, width: trash ? 18 : 12, height: trash ? 6 : 12, borderRadius: trash ? 2 : 6, background: col(i), transform: `rotate(${i * 37}deg)` }} />; })}
      <div style={{ position: "absolute", left: 860, top: 940, width: 200, height: 50, borderRadius: "50%", background: trash ? "rgba(255,90,122,.5)" : "rgba(217,201,166,.6)", transform: `scale(${0.6 + 0.4 * ease(f, 0, d)})` }} />
      {v === "drain" && <Big x={1120} y={330} k={ease(f, d * 0.3, d * 0.45)} size={120}>A DRAIN</Big>}
      {v === "quake" && <Tag x={1300} y={330} op={shake} size={56} color={O.red}>EARTHQUAKE</Tag>}
      {trash && <Tag x={1060} y={330} op={ease(f, 10, 20)} size={48} color={O.orange}>plastic · chemicals · all of it</Tag>}
    </Water>; },
  // la línea de los caparazones (CCD): debajo de 4-5 km la tiza se disuelve como azúcar en el té
  ccd: ({ d }) => { const f = F(), ly = 560;
    return <Water top={0.35} bot={0.95} drift={-0.4}>
      {Array.from({ length: 14 }).map((_, i) => { const q = ((rnd(i, 2) * 300 + f * (0.8 + rnd(i, 3))) % 300) / 300, y = -60 + q * 1160, x = 140 + i * 120, sc = y < ly ? 1 : Math.max(0, 1 - (y - ly) / 300);
        return <svg key={i} width={70} height={70} viewBox="-35 -35 70 70" style={{ position: "absolute", left: x - 35, top: y - 35, transform: `scale(${sc}) rotate(${f * 2 + i * 40}deg)`, opacity: sc }}><path d="M0,0 m-4,0 a4,4 0 1,1 8,0 a10,10 0 1,1 -20,0 a16,16 0 1,1 32,0 a22,22 0 1,1 -44,0" stroke="#f4ead8" strokeWidth={5} fill="none" /></svg>; })}
      <Draw pts={[[0, ly], [1920, ly]]} k={ease(f, 6, 26)} color={O.red} w={6} dash="20 12" />
      <Tag x={80} y={ly - 70} op={ease(f, 10, 20)} size={44} color={O.red}>~4,000–5,000 m · shells dissolve</Tag>
      <Tag x={80} y={ly + 330} op={ease(f, d * 0.5, d * 0.6)} size={52} color={O.dim}>like sugar in tea</Tag>
    </Water>; },
  // armadura de aluminio: el gel cubre el caparazón y el agua ácida rebota
  armor: ({ d }) => { const f = F(), k = ease(f, d * 0.1, d * 0.6);
    return <Dark tone="#132a3e">
      <Amphi x={760} y={600} s={2.4} metal={k} />
      {Array.from({ length: 10 }).map((_, i) => { const q = ((f + i * 9) % 50) / 50, x = 1500 - q * 380, y = 280 + i * 60; return <div key={i} style={{ position: "absolute", left: x, top: y, width: 18, height: 18, borderRadius: 9, background: O.cyan, opacity: q < 0.8 ? 0.9 : 0 }} />; })}
      <Tag x={1180} y={300} op={k} size={56} color="#dfe8f0">Al · ALUMINUM GEL</Tag>
      <Tag x={980} y={900} op={ease(f, d * 0.6, d * 0.7)} size={44}>the size of your thumb, wearing metal</Tag>
    </Dark>; },
  // termómetro: 1-2 °C todo el año, siempre igual
  thermo: ({ d, v }) => { const f = F(), flat = v === "flat", months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"], mi = Math.floor(f / 6) % 12;
    return <Dark tone="#0c2236">
      <div style={{ position: "absolute", left: 300, top: 300, width: 80, height: 500, borderRadius: 40, border: "6px solid #dfe8f0" }} />
      <div style={{ position: "absolute", left: 306, top: 760 - 60, width: 68, height: 100, borderRadius: 34, background: O.cyan }} />
      <div style={{ position: "absolute", left: 290, top: 780, width: 100, height: 100, borderRadius: 50, background: O.cyan }} />
      <Big x={460} y={600} k={ease(f, 6, 18)} size={150} color={O.cyan}>1–2 °C</Big>
      {!flat && <Tag x={1250} y={300} size={90} color={O.dim}>{months[mi]}</Tag>}
      {flat && <><SV><path d={`M900,700 ${Array.from({ length: 40 }).map((_, i) => `L${900 + i * 20},${700 + Math.sin(i + f / 10) * 2}`).join(" ")}`} stroke={O.cyan} strokeWidth={8} fill="none" strokeDasharray="1000" strokeDashoffset={1000 * (1 - ease(f, 0, d * 0.7))} /></SV>
        <Tag x={900} y={760} size={40} color={O.dim}>no summer · no winter · no day · no night</Tag></>}
    </Dark>; },
  // comparación: el del pulgar vs el supergigante de 30 cm vs tu mano
  size: ({ d }) => { const f = F(), g = ease(f, d * 0.2, d * 0.5), hand = ease(f, d * 0.55, d * 0.7);
    return <Dark tone="#13263a">
      <Amphi x={340} y={640} s={0.45} />
      <Tag x={250} y={720} size={36} color={O.dim}>~3 cm</Tag>
      <div style={{ opacity: g }}><Amphi x={1100} y={620} s={1.6 + 0.4 * g} ph={2} /></div>
      <Tag x={960} y={820} op={g} size={56} color={O.orange}>~30 cm</Tag>
      <SV><path d="M720,1000 L720,860 L1460,860 L1460,1000 Z" fill="#f2c49b" opacity={hand * 0.85} /></SV>
      <Tag x={760} y={890} op={hand} size={40} color="#5a3a22">your hand, wrist to fingertip</Tag>
    </Dark>; },
  // gigantismo: el frío lo hace todo lento (vive más y sigue creciendo) · cuerpo grande = viaja más lejos entre comidas
  gigant: ({ d }) => { const f = F(), two = f > d * 0.5, k = ease(f, two ? d * 0.5 : 0, two ? d : d * 0.5);
    return <Water top={0.85} bot={1} drift={0.5}>
      <Floor y={820} seed={8} lit={0.5} />
      {!two ? <><Amphi x={760} y={760} s={0.5 + 1.1 * k} walk={false} /><Tag x={1100} y={300} size={56} color={O.cyan}>cold = slow</Tag><Tag x={1100} y={380} op={ease(f, 20, 30)} size={44}>live longer · keep growing</Tag></>
        : <><Amphi x={200 + 1300 * k} y={760} s={1.2} /><Amphi x={200 + 420 * k} y={900} s={0.4} ph={4} />
          <div style={{ position: "absolute", left: 1640, top: 700, width: 70, height: 50, borderRadius: 10, background: "#d9c9a6" }} />
          <Tag x={760} y={320} size={48} color={O.orange}>bigger body → reaches the next meal</Tag></>}
    </Water>; },
  // el lugar más remoto: 11 km de agua, sin rutas ni fábricas · después: fábrica → río → mar → fosa
  remote: ({ d, v }) => { const f = F(), pipe = v === "pipe", k = ease(f, 6, d * 0.8);
    return <AbsoluteFill style={{ background: "linear-gradient(180deg,#7fb0c8 0%,#7fb0c8 22%,#14496a 23%,#020a12 100%)" }}>
      <SV><path d="M-20,250 L420,250 L520,300 L640,1100 L-20,1100 Z" fill="#4a3426" />
        {[60, 140, 220, 300].map((x) => <rect key={x} x={x} y={190} width={40} height={60} fill="#2a2018" />)}
        <path d={vPath(860, 1060)} fill="#2a241c" transform="translate(300,0)" /></SV>
      <Draw pts={[[1260, 250], [1260, 1040]]} k={pipe ? 1 : k} color={O.dim} w={4} dash="14 12" />
      <Tag x={1290} y={620} op={pipe ? 0 : k} size={60}>11 km of water</Tag>
      {!pipe && <Tag x={1290} y={720} op={ease(f, d * 0.5, d * 0.6)} size={42} color={O.dim}>no roads · no factories · no people</Tag>}
      {pipe && <><Draw pts={[[200, 200], [520, 300], [800, 420], [1100, 700], [1260, 1030]]} k={k} color={O.red} w={10} glow />
        <Tag x={120} y={110} op={ease(f, 4, 14)} size={42} color={O.red}>factories</Tag><Tag x={1300} y={980} op={ease(f, d * 0.7, d * 0.8)} size={44} color={O.red}>the trench</Tag></>}
    </AbsoluteFill>; },
  // rayos X del intestino: fibras de plástico adentro · Mariana: todos
  gut: ({ d }) => { const f = F(), k = ease(f, d * 0.2, d * 0.6);
    return <AbsoluteFill style={{ background: "#03121a" }}>
      <SV>{Array.from({ length: 30 }).map((_, i) => <line key={i} x1={i * 66} y1={0} x2={i * 66} y2={1080} stroke={O.cyan} strokeWidth={1} opacity={0.12} />)}</SV>
      <Amphi x={760} y={600} s={2.6} xray fiber={k} walk={false} />
      <Tag x={1300} y={360} op={ease(f, 10, 20)} size={46} color={O.cyan}>6 trenches checked</Tag>
      <Big x={1300} y={480} k={ease(f, d * 0.6, d * 0.7)} size={140} color={O.red}>100%</Big>
      <Tag x={1300} y={650} op={ease(f, d * 0.65, d * 0.75)} size={44}>Mariana: every animal</Tag>
    </AbsoluteFill>; },
  // último plano: un solo anfípodo bajo la luz, con la fibra azul adentro
  lastfiber: ({ d }) => { const f = F(), z = 1 + ease(f, 0, d) * 0.25;
    return <Dark tone="#0a1a26">
      <Beam x={960} y={-40} ang={90} len={1200} w={40} on={0.8} />
      <Floor y={760} seed={11} lit={0.5} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: "50% 65%" }}><Amphi x={960} y={760} s={1.2} fiber={ease(f, d * 0.3, d * 0.6)} /></div>
      <Snow n={50} drift={0.4} />
    </Dark>; },
};

export const Scene: React.FC<{ name: string; d: number }> = ({ name, d }) => {
  const [n, v = ""] = name.split(":"), Sc = S[n];
  return Sc ? <Sc d={d} v={v} /> : <AbsoluteFill style={{ background: "#300" }} />;
};
export const SCENES = Object.keys(S);
export { C };
