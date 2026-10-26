import React from "react";
import { Sala } from "./sets";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { C, fontFamily, ent, prog, Chip, Grande, Emote, cabeza, Moneda } from "./kit";
import { Soldadito, Barco, Lluvia } from "./kit2";
import { Laurel } from "./T1";
import { Persona, CIVIL } from "./persona";
import { TOP, BASE, MC, K, Cam, Pal, Plano, CartelTrampa, pant, Relampago } from "./mundo";
import { Gr, Cu, Ch, T, ck, TUNGRO, AUX, Picto, Ojos, gesto, Actua, Sale, Gesto } from "./kit3";

// TRAMPA 6 · EL NORTE (618,5-746,5 s). Los pueblos del norte cruzan el muro (año 180); el mapa de Britania: el Muro
// Antonino que se levanta y se abandona; Severo marcha a Escocia, se le funde el enemigo en las ciénagas y muere en
// York; sus consejos; el 367: pictos, escotos y sajones a la vez; los areani que vendían secretos; vos en la torre,
// en la niebla, el último en enterarte; Teodosio retoma la provincia; y el muro visto como lo que era: una raya fina.
const D = 618;
const M6 = MC(6);
const YO6 = M6 + 330;
const TU6 = 36000;

export const keys6: K[] = [
  [618.8, 31000, 560, 0.36], ck("the people beyond the wall", D, M6, 520, 0.6), ck("around the year 180", D, M6, 520, 0.8),
  ck("did a great deal", D, M6 - 200, 560, 0.9), ck("and cut down a roman", D, M6 + 300, 620, 1.05), ck("rome called it", D, M6, 560, 0.6),
  ck("and the frontier", D, M6, 500, 0.3), ck("which", 685, YO6, 520, 1.2, 0), ck("if you are the soldier freezing", D, YO6, 520, 1.3),
  ck("and then came the worst", D, M6, 480, 0.42), ck("and the worst part", D, M6, 420, 0.55), ck("rome had a group", D, M6 - 900, 460, 1.0),
  ck("ammianus says they", D, M6 - 950, 420, 1.15), ck("so the men who were supposed", D, M6 - 950, 440, 0.8), ck("and you", 729, TU6, 360, 1.4, 0),
  ck("in the fog", D, TU6, 380, 1.7), ck("would have been the very last", D, TU6, 370, 2.0), ck("the wall survived", D, 19000, 560, 0.2),
  ck("but everyone on it now", D, 19000, 600, 0.044), [746.3, 19000, 600, 0.042],
];
export const amb6: [number, Pal][] = [[618.8, "tormenta"], [656.2, "gris"], [692.8, "sangre"], [712.3, "noche"], [741.3, "gris"]];
export const lluvia6: [number, number][] = [[618.8, 0.5], [640.0, 0.4], [692.8, 0.2], [712.3, 0.1], [741.3, 0.2], [746.4, 0.2]];
export const niebla6: [number, number][] = [[618.8, 0], [712.3, 0], [729.7, 0.4], [731.6, 1], [741.0, 1], [742.0, 0], [746.4, 0]];
export const rayos6: number[] = [627.0, 631.0, 693.0, 694.9, 701.1];
export const sol6: [number, number, number, boolean?][] = [[712.3, 1500, 170, true], [741.3, -999, 0]];

const BARB = (i: number) => ({ tunica: ["#5a3a26", "#3f5a2a", "#6a2a2a"][i % 3], tunica2: ["#3a2418", "#2a3f1a", "#4a1a1a"][i % 3], cinto: "#2a1810", piel: "#a8c4e8", piel2: "#7896c4", pelo: ["#c9602c", "#a0602c", "#e0a050"][i % 3] });
// ── mapa de Britania (dibujado a mano, norte arriba)
export const BRIT = "M 905 70 L 960 60 L 1010 90 L 990 150 L 1030 190 L 1010 260 L 1060 300 L 1040 350 L 1080 400 L 1050 440 L 1100 520 L 1120 600 L 1160 660 L 1200 720 L 1230 790 L 1180 840 L 1240 880 L 1200 940 L 1100 960 L 980 980 L 880 990 L 800 1000 L 760 960 L 840 920 L 900 880 L 860 840 L 820 800 L 870 760 L 880 700 L 840 640 L 860 580 L 900 540 L 880 500 L 840 470 L 860 420 L 820 380 L 830 330 L 800 290 L 840 240 L 810 200 L 850 150 L 830 110 Z";
export const IRL = "M 600 470 L 690 450 L 740 500 L 730 600 L 700 690 L 620 720 L 560 680 L 540 590 L 570 520 Z";
const YORK: [number, number] = [1090, 660];
const Mapa: React.FC<{ t: number; children?: React.ReactNode; antonino?: number; adriano?: number }> = ({ t, children, antonino = 0, adriano = 1 }) => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #3d7fc9, #1b3a6a 85%)" }}>
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <path d={IRL} fill="#5f8a4a" stroke="#fff" strokeWidth={6} />
      <path d={BRIT} fill="#7fa05a" stroke="#fff" strokeWidth={6} />
      <path d="M 800 290 L 1060 300 L 1100 520 L 900 540 Z" fill="#4a6a3a" opacity={0.45} />
      <line x1={872} y1={524} x2={1098} y2={518} stroke="#d8c8ae" strokeWidth={14} pathLength={1} strokeDasharray={`${adriano} 1`} />
      {antonino > 0 && <line x1={838} y1={372} x2={1052} y2={366} stroke="#7a5a2a" strokeWidth={12} pathLength={1} strokeDasharray={`${Math.min(1, antonino)} 1`} opacity={antonino > 1 ? Math.max(0.25, 2 - antonino) : 1} />}
      <circle cx={YORK[0]} cy={YORK[1]} r={12} fill={C.ambar} stroke="#fff" strokeWidth={4} />
    </svg>
    <div style={{ position: "absolute", left: YORK[0] + 20, top: YORK[1] - 18, fontFamily, fontWeight: 700, fontSize: 30, color: "#fff", WebkitTextStroke: "5px #1b1240", paintOrder: "stroke fill" }}>YORK</div>
    <div style={{ position: "absolute", left: 1110, top: 500, fontFamily, fontWeight: 700, fontSize: 30, color: "#fff", WebkitTextStroke: "5px #1b1240", paintOrder: "stroke fill" }}>HADRIAN'S WALL</div>
    {children}
  </AbsoluteFill>
);
const Flecha: React.FC<{ t: number; t0: number; d: string; col?: string; w?: number; dur?: number }> = ({ t, t0, d, col = C.rojo, w = 22, dur = 0.8 }) => t < t0 ? null : (
  <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}>
    <defs><marker id={"m" + col.slice(1)} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={col} /></marker></defs>
    <path d={d} stroke={col} strokeWidth={w} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${prog(t, t0, t0 + dur)} 1`} markerEnd={prog(t, t0, t0 + dur) > 0.97 ? `url(#m${col.slice(1)})` : undefined} />
  </svg>
);
// 1) la frontera que se mueve: Muro Antonino, ida y vuelta
const Frontera: React.FC<{ t: number }> = ({ t }) => {
  const a = T("the next emperor built", D), g = T("within about a generation", D);
  const an = t < g ? prog(t, a, a + 1.2) : 1 + prog(t, g + 0.4, g + 1.6);
  return (
    <Mapa t={t} antonino={an}>
      {/* la raya de la frontera no se queda quieta: tres líneas que suben y bajan entre los dos muros */}
      {t < a + 1.2 && [0, 1, 2].map((i) => { const fy = 450 - 70 * Math.sin((t - T("and the frontier", D)) * 1.9 + i * 2.1); const op = (1 - prog(t, a + 0.3, a + 1.2)) * prog(t, T("and the frontier", D), T("and the frontier", D) + 0.4); return <svg key={"fr" + i} style={{ position: "absolute", inset: 0, opacity: op * (0.95 - i * 0.2) }} width={1920} height={1080}><line x1={790} y1={fy + 6} x2={1120} y2={fy - 6} stroke={C.rojo} strokeWidth={12 - i * 2} strokeDasharray="26 16" strokeLinecap="round" /><path d={`M 1150 ${fy - 40} l 18 -26 l 18 26 M 1150 ${fy + 34} l 18 26 l 18 -26`} stroke={C.rojo} strokeWidth={8} fill="none" strokeLinecap="round" /></svg>; })}
      {t < a && <Chip t={t} t0={T("and the frontier", D) + 0.3} text="THE FRONTIER NEVER STOPPED MOVING" color={C.rojo} x={960} y={950} centro size={52} />}
      <Cu t={t} w="only 20 years after" d={D} de={0} a={20} sube={0.8} dur={2.6} x={460} y={200} size={110} suf=" YEARS LATER" color="#fff" />
      {t > a && <Chip t={t} t0={a + 0.3} text="THE ANTONINE WALL" color="#7a5a2a" x={540} y={360} centro size={50} />}
      {t > T("made mostly of turf", D) && <Chip t={t} t0={T("made mostly of turf", D)} t1={g} text="MOSTLY TURF" color={C.lima} tinta={C.noche} x={540} y={440} centro size={42} />}
      <Flecha t={t} t0={g + 1.2} d="M 940 410 L 940 500" col={C.ambar} />
      {t > T("to your wall", D) && <Chip t={t} t0={T("to your wall", D)} text="BACK TO YOUR WALL" color={C.ambar} tinta={C.noche} x={1460} y={560} centro size={50} />}
      <Chip t={t} t0={T("further north", D)} t1={T("within about a generation", D)} text="↑ FURTHER NORTH · SCOTLAND" color={C.violeta} x={940} y={150} centro size={50} />
      {Array.from({ length: 7 }, (_, i) => {
        const sube = prog(t, a + 0.2 + i * 0.12, a + 1.6 + i * 0.12), baja = prog(t, g + 0.6 + i * 0.15, g + 3.8 + i * 0.15);
        return t > a ? <Soldadito key={i} x={880 + i * 26} y={540 - 150 * sube + 150 * baja} s={0.32} t={t} seed={300 + i} avanza={1} /> : null;
      })}
      <Actua t={t} beats={[[T("and the frontier", D) + 0.2, "encoge"], [a, "camina"], [a + 2.2, "carga"], [g, "enojado"], [g + 1.4, "camina"], [T("to your wall", D), "encoge"]]} x0={1900} x1={1560} y={1060} h={420} frio />
    </Mapa>
  );
};
// 2a) Severo marcha al norte al frente de la columna
const SEVERO = { ...CIVIL(0), tunica: "#7a2a9a", tunica2: "#4a1a6a" };
// corona de laurel sobre la cabeza de una Persona (emperador)
const Corona: React.FC<{ x: number; y: number; h: number }> = ({ x, y, h }) => { const cb = cabeza(x, y, h); return <Laurel x={x} y={cb.y - 70 * cb.s} s={cb.s * 0.95} />; };
const SeveroMarcha: React.FC<{ t: number }> = ({ t }) => {
  const a = T("in the year 208", D), e = T("the emperor septimius", D), h = T("with a huge army", D), m = T("he marched deep", D);
  const av = prog(t, a, m + 2.5);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#6a8fc0,#b9c7dc 70%)" }}>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <path d="M 0 700 Q 300 560 620 650 T 1240 610 T 1920 640 L 1920 1080 L 0 1080 Z" fill="#5f8a4a" />
        <path d="M 0 820 Q 480 760 960 800 T 1920 790 L 1920 1080 L 0 1080 Z" fill="#7fa05a" />
      </svg>
      <div style={{ position: "absolute", left: 1620, top: 560, width: 18, height: 260, background: "#6b4a2f" }} />
      <div style={{ position: "absolute", left: 1500, top: 560, padding: "10px 26px", background: "#f6efe2", border: "6px solid #6b4a2f", fontFamily, fontWeight: 700, fontSize: 44, color: C.noche }}>SCOTLAND →</div>
      {Array.from({ length: 22 }, (_, i) => t > h - 0.2 || i < 4 ? <Soldadito key={i} x={-200 + 300 * av + 1100 - (i % 11) * 95 - Math.floor(i / 11) * 50} y={880 + Math.floor(i / 11) * 70} s={0.9 + Math.floor(i / 11) * 0.15} t={t} seed={330 + i} avanza={1} /> : null)}
      <Persona x={-100 + 300 * av + 1250} y={900} h={360} t={t} seed={89} ropa={SEVERO} casco="no" capa="#5a1a7a" {...gesto(t, [[a, "camina"], [e, "habla"], [h, "señala"], [m, "camina"]])} />
      <Corona x={-100 + 300 * av + 1250} y={900} h={360} />
      <Gr t={t} w="in the year 208" d={D} txt="AD 208" y={150} x={420} size={130} c={C.ambar} dur={2.2} />
      <Chip t={t} t0={e} text="EMPEROR SEPTIMIUS SEVERUS" color="#7a2a9a" x={1200} y={150} centro size={46} />
      {t > h && <Chip t={t} t0={h} text="+ A HUGE ARMY" color={C.rojo} x={1200} y={240} centro size={46} />}
    </AbsoluteFill>
  );
};
// 2b) la tierra se los traga: la ciénaga y las emboscadas
const SeveroCienaga: React.FC<{ t: number }> = ({ t }) => {
  const f = T("the tribes simply melted", D), l = T("and the romans lost", D);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#5c6f8f,#8b95aa)" }}>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <path d="M 0 600 Q 400 420 800 560 T 1500 500 T 1920 560 L 1920 1080 L 0 1080 Z" fill="#4a6a3a" />
        <rect x={0} y={760} width={1920} height={320} fill="#4a4a2a" />
      </svg>
      <Lluvia t={t} n={140} op={0.5} seed={62} />
      {[0, 1, 2, 3, 4].map((i) => { const k = prog(t, f + 0.3 + i * 0.25, f + 1.2 + i * 0.25); return <div key={i} style={{ position: "absolute", left: 300 + i * 300, top: 0, opacity: 1 - k }}><Picto x={0} y={560 - (i % 2) * 40 + k * 120} s={0.8} t={t} seed={350 + i} /></div>; })}
      {Array.from({ length: 9 }, (_, i) => { const hunde = prog(t, l + i * 0.35, l + 1.4 + i * 0.35); return <div key={i} style={{ position: "absolute", left: 0, top: 0, clipPath: "inset(0 0 230px 0)", width: 1920, height: 1080 }}><Soldadito x={260 + i * 175} y={850 + hunde * 170} s={1.2} t={t} seed={360 + i} avanza={hunde < 0.05 ? 1 : 0} /></div>; })}
      {Array.from({ length: 10 }, (_, i) => <div key={"c" + i} style={{ position: "absolute", left: 140 + i * 180, top: 846 + Math.sin(t * 3 + i) * 5, width: 130, height: 18, borderRadius: 9, background: "#6a6a3a" }} />)}
      <Chip t={t} t0={f} text="THEY MELTED INTO THE HILLS & BOGS" color="#2a2350" x={960} y={140} centro size={48} />
      {t > l && <Chip t={t} t0={l} text="THOUSANDS OF ROMANS LOST" color={C.rojo} x={960} y={240} centro size={52} />}
      {t > l && <div style={{ position: "absolute", left: 1500, top: 330, fontFamily, fontWeight: 700, fontSize: 48, color: "#fff", WebkitTextStroke: "7px #1b1240", paintOrder: "stroke fill" }}>LOST: {Math.round(9 * prog(t, l, l + 4.2))} / 9</div>}
    </AbsoluteFill>
  );
};
// 2c) vuelve enfermo a York y muere
const SeveroMuere: React.FC<{ t: number }> = ({ t }) => {
  const y = T("severus fell ill", D);
  return (
    <Mapa t={t}>
      <Flecha t={t} t0={y - 0.4} d={`M 960 220 Q 1040 420 ${YORK[0]} ${YORK[1] - 20}`} col={C.violeta} w={26} dur={1.1} />
      <div style={{ position: "absolute", left: YORK[0] - 40, top: YORK[1] - 110, fontFamily, fontWeight: 700, fontSize: 90, color: "#fff", WebkitTextStroke: "10px #1b1240", paintOrder: "stroke fill", transform: `scale(${ent(t, y + 0.8)})` }}>†</div>
      <Persona x={360} y={1000} h={380} t={t} seed={89} ropa={SEVERO} viejo capa="#5a1a7a" {...gesto(t, [[y, "tiembla"], [y + 1.6, "triste"]])} />
      <Corona x={360} y={1000} h={380} />
      <Chip t={t} t0={y + 0.8} text="DIES AT YORK · AD 211" color="#2a2350" x={1460} y={760} centro size={50} />
    </Mapa>
  );
};
// 3) el consejo de Severo a sus hijos: levanta la mano, los hijos se acercan a la cama
const Consejo: React.FC<{ t: number }> = ({ t }) => {
  const r: [string, string, string][] = [["get along with each other", "GET ALONG WITH EACH OTHER", C.teal], ["make the soldiers rich", "MAKE THE SOLDIERS RICH", C.oro], ["and ignore everyone else", "IGNORE EVERYONE ELSE", C.rojo]];
  const la = T("his last advice", D), r0 = T(r[0][0], D), r1 = T(r[1][0], D), r2 = T(r[2][0], D);
  const acerca = (i: number) => interpolate(t, [la + 0.4 + i * 0.25, la + 1.9 + i * 0.25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const sx = [1520 - 470 * acerca(0), 1800 - 520 * acerca(1)];
  const anda = (i: number) => acerca(i) > 0.02 && acerca(i) < 0.98;
  const sev = t < r0 ? { expr: "triste" as const, habla: true, bD: 40 + 100 * prog(t, la, la + 0.8) + Math.sin(t * 3) * 5, cD: 10, bI: 10, cI: 10 } : gesto(t, [[r0, "señala"], [r1, "habla"], [r2, "señala"]]);
  return (
    <AbsoluteFill>
      <Sala t={t} tono="violeta" />
      <div style={{ position: "absolute", left: 180, top: 640, width: 760, height: 140, background: "#8a5a2a", borderRadius: 30 }} />
      <div style={{ position: "absolute", left: 200, top: 590, width: 700, height: 90, background: "#f6efe2", borderRadius: 40 }} />
      <Persona x={360} y={760} h={320} t={t} seed={88} ropa={SEVERO} viejo {...sev} inclina={-62} />
      {(() => { const n = r.filter(([w]) => t > T(w, D)).length; return n ? <div key={n} style={{ position: "absolute", left: 640, top: 360, width: 150, height: 150, borderRadius: "50%", background: C.ambar, border: "8px solid #fff", fontFamily, fontWeight: 700, fontSize: 110, lineHeight: "150px", textAlign: "center", color: C.noche, transform: `scale(${ent(t, T(r[n - 1][0], D))})` }}>{n}</div> : null; })()}
      <Persona x={sx[0]} y={1010} h={450} t={t} seed={160} ropa={{ ...CIVIL(1), tunica: "#c93d6a", tunica2: "#8f2547" }} flip mira={-0.6} camina={anda(0) ? 1.3 : 0} {...(anda(0) ? { expr: "sorpresa" as const } : gesto(t, [[la, "lee"], [r0, "niega"], [r1, "festeja"], [r2, "habla"]]))} />
      <Persona x={sx[1]} y={1010} h={450} t={t} seed={161} ropa={{ ...CIVIL(2), tunica: "#3d7fc9", tunica2: "#25548f" }} flip mira={-0.6} camina={anda(1) ? 1.3 : 0} {...(anda(1) ? { expr: "triste" as const } : gesto(t, [[la, "lee"], [r0, "enojado"], [r1, "festeja"], [r2, "señala"]]))} />
      {r.map(([w, tx, col], i) => t > T(w, D) ? <Chip key={i} t={t} t0={T(w, D)} text={`${i + 1}. ${tx}`} color={col} tinta={i === 1 ? C.noche : "#fff"} x={1240} y={170 + i * 100} centro size={50} /> : null)}
      <Chip t={t} t0={la} t1={r0} text="HIS LAST ADVICE TO HIS SONS" color={C.violeta} x={1240} y={170} centro size={50} />
    </AbsoluteFill>
  );
};
// 4) vos en la ciénaga de Escocia, hundido hasta la cintura con otros dos, y el consejo que por fin sirve
const Junco: React.FC<{ x: number; y: number; t: number; s?: number; n?: number; col?: string }> = ({ x, y, t, s = 1, n = 5, col = "#3f5a1f" }) => (
  <svg style={{ position: "absolute", left: x - 120 * s, top: y - 360 * s, overflow: "visible" }} width={240 * s} height={360 * s} viewBox="-120 -360 240 360">
    {Array.from({ length: n }, (_, i) => { const a = -24 + i * (48 / Math.max(1, n - 1)) + Math.sin(t * 1.6 + i + x) * 5; const L = 260 + ((i * 37) % 80); return <g key={i} transform={`rotate(${a})`}><path d={`M 0 0 L 0 ${-L}`} stroke={col} strokeWidth={10} strokeLinecap="round" />{i % 2 === 0 && <rect x={-11} y={-L - 10} width={22} height={64} rx={11} fill="#6a3f1a" />}</g>; })}
  </svg>
);
const Cienaga: React.FC<{ t: number }> = ({ t }) => {
  const t0 = T("if you are the soldier freezing", D), fp = T("is the first piece", D), gu = T("genuinely useful", D);
  const k = prog(t, t0, t0 + 2.6);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#6f7fa0 0%,#c9c2b8 55%,#e8d6b0 62%)" }}>
      {/* sol pálido detrás de la niebla */}
      <div style={{ position: "absolute", left: 1380 - 300, top: 330 - 300, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,240,200,.95) 0 10%, rgba(255,230,180,.35) 22%, rgba(255,230,180,0) 60%)" }} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {/* lomas y pinos lejanos */}
        <path d="M 0 600 Q 300 470 640 560 T 1300 520 T 1920 560 L 1920 700 L 0 700 Z" fill="#7c8a8c" />
        {Array.from({ length: 22 }, (_, i) => { const x = i * 92 + ((i * 41) % 30), hh = 70 + ((i * 53) % 60); return <path key={i} d={`M ${x} 640 L ${x + 26} ${640 - hh} L ${x + 52} 640 Z`} fill="#5a6a6a" />; })}
        {/* agua de la ciénaga con reflejo */}
        <rect x={0} y={640} width={1920} height={440} fill="url(#cg6)" />
        <defs><linearGradient id="cg6" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a9a80" /><stop offset="0.4" stopColor="#4f5f3e" /><stop offset="1" stopColor="#2c3622" /></linearGradient></defs>
        <ellipse cx={1380} cy={700} rx={380} ry={26} fill="#fff6d8" opacity={0.35} />
        {Array.from({ length: 9 }, (_, i) => <ellipse key={"l" + i} cx={(i * 233 + 80) % 1920} cy={720 + ((i * 71) % 300)} rx={60} ry={12} fill="#5a7a3a" opacity={0.8} />)}
      </svg>
      {Array.from({ length: 5 }, (_, i) => <Junco key={"j" + i} x={140 + i * 420} y={690} t={t} s={0.55} col="#4a6a2a" />)}
      {/* bancos de niebla que pasan */}
      {Array.from({ length: 5 }, (_, i) => <div key={"n" + i} style={{ position: "absolute", left: ((t * (30 + i * 9) + i * 520) % 2700) - 700, top: 540 + i * 50, width: 900, height: 120, borderRadius: "50%", background: "#eef0f2", opacity: 0.32 }} />)}
      {/* tres legionarios hundidos hasta la cintura */}
      {[{ x: 430, h: 470, sd: 31, b: [[t0, "carga"], [fp, "habla"], [gu, "festeja"]] }, { x: 1500, h: 450, sd: 32, b: [[t0, "tiembla"], [t0 + 1.6, "señala"], [gu, "festeja"]] }].map((p, i) => (
        <Persona key={i} x={p.x} y={1150 + 30 * k} h={p.h} t={t} seed={p.sd} ropa={AUX(i * 3)} casco="legion" malla capa="#7a2a2a" flip={i === 1} mira={i === 1 ? -0.5 : 0.5} {...gesto(t, p.b as [number, Gesto][])} />
      ))}
      {(() => { const ok = t > gu; const piensa = t > fp && !ok; return <Persona x={960} y={1180 + 50 * k} h={560} t={t} seed={3} ropa={TUNGRO} casco="legion" malla pantalon="#6b4a2f" capa="#3f6b2a" {...(ok ? gesto(t, [[gu, "festeja"]]) : piensa ? { expr: "sorpresa" as const, bD: 120, cD: 100, bI: 15, cI: 20, habla: true } : gesto(t, [[t0 - 0.2, "tiembla"]]))} />; })()}
      {/* superficie del agua por delante: tapa las piernas, con ondas alrededor de cada uno */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 930, bottom: 0, background: "linear-gradient(180deg, rgba(74,90,52,.96), rgba(40,50,30,.98))" }} />
      {[430, 960, 1500].map((x, i) => [0, 1].map((j) => { const q = (t * 0.7 + j / 2 + i * 0.3) % 1; return <div key={i + "-" + j} style={{ position: "absolute", left: x - 120 - q * 90, top: 920 - q * 6, width: 240 + q * 180, height: 34 + q * 14, borderRadius: "50%", border: "5px solid #a8b890", opacity: 0.8 * (1 - q) }} />; }))}
      {Array.from({ length: 7 }, (_, i) => { const q = (t * 0.9 + i / 7) % 1; return <div key={"b" + i} style={{ position: "absolute", left: 860 + ((i * 53) % 200), top: 940 - q * 30, width: 16 + (i % 3) * 8, height: 16 + (i % 3) * 8, borderRadius: "50%", border: "4px solid #a8b890", opacity: 1 - q }} />; })}
      {/* juncos en primer plano, a los costados */}
      <Junco x={60} y={1120} t={t} s={1.15} n={6} />
      <Junco x={1860} y={1120} t={t} s={1.2} n={6} />
      <Lluvia t={t} n={110} op={0.4} seed={61} />
      <Chip t={t} t0={t0} text="A BOG · SCOTLAND" color="#4a4a2a" x={960} y={140} centro size={56} />
      {t > gu && <Grande t={t} t0={gu} text="GENUINELY USEFUL." y={270} size={110} color={C.lima} />}
    </AbsoluteFill>
  );
};
// 4b) el 367: tres pueblos corren hacia la muralla al mismo tiempo
const Anio367: React.FC<{ t: number }> = ({ t }) => {
  const a = T("and then came the worst", D);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 60%, #c93d3d, #3a0f1a 80%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, bottom: 0, background: "#2a0f14" }} />
      <div style={{ position: "absolute", left: 760, width: 400, top: 560, height: 260, background: "#b9a98e", border: "8px solid #2a0f14" }} />
      {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 800 + k * 110, top: 430 - Math.abs(Math.sin(t * 7 + k)) * 50, width: 100, height: 170, borderRadius: "50% 50% 30% 30%", background: k % 2 ? C.naranja : C.ambar, opacity: prog(t, a + 1.2, a + 1.8) }} />)}
      {Array.from({ length: 6 }, (_, i) => <Picto key={"p" + i} x={-120 + 520 * prog(t, a + i * 0.15, a + 2.4 + i * 0.15) + i * 60} y={880 + (i % 2) * 30} s={1.0} t={t} seed={380 + i} grita />)}
      {[0, 1, 2].map((i) => <Actua key={"s" + i} t={t} beats={[[a + 0.3 + i * 0.2, "camina"], [a + 2.6, "enojado"], [T("367", D) + 0.6, "golpea"]]} x0={2080 + i * 150} x1={1320 + i * 170} y={960 + (i % 2) * 25} h={290} casco={false} ropa={{ tunica: "#3f8a3a", tunica2: "#2a5a26", cinto: "#3a2410", piel: "#f2c09a", piel2: "#d99a72", pelo: ["#c9a05a", "#a0602c", "#7a4a22"][i] }} />)}
      <Grande t={t} t0={T("367", D)} text="AD 367" y={250} size={220} color={C.crema} borde="#3a0f14" />
      <Chip t={t} t0={a + 0.1} text="THE WORST YEAR OF ALL" color={C.rojo} x={960} y={90} centro size={52} />
    </AbsoluteFill>
  );
};
// 5) la conspiración del 367: tres pueblos (íconos grandes) viajan sobre sus flechas; un soldado mira el mapa y se asusta
const qb = (k: number, a: [number, number], c: [number, number], b: [number, number]) => [(1 - k) * (1 - k) * a[0] + 2 * (1 - k) * k * c[0] + k * k * b[0], (1 - k) * (1 - k) * a[1] + 2 * (1 - k) * k * c[1] + k * k * b[1]];
const Insignia: React.FC<{ x: number; y: number; t: number; col: string; tipo: 0 | 1 | 2; s?: number }> = ({ x, y, t, col, tipo, s = 1 }) => (
  <div style={{ position: "absolute", left: x - 85 * s, top: y - 85 * s, width: 170 * s, height: 170 * s, borderRadius: "50%", background: "#f6efe2", border: `${10 * s}px solid ${col}`, boxShadow: "0 10px 0 rgba(20,8,40,.35)", overflow: "hidden" }}>
    <svg width={170 * s} height={170 * s} viewBox="-85 -85 170 170">
      {tipo === 0 && <g><circle cx={0} cy={10} r={44} fill="#2a2350" /><path d="M -46 -2 Q -60 -58 -20 -36 Q 0 -74 20 -36 Q 60 -58 46 -2 Z" fill="#a0602c" /><circle cx={-15} cy={8} r={9} fill="#fff" /><circle cx={15} cy={8} r={9} fill="#fff" /><path d="M -28 -10 l 18 8 M 28 -10 l -18 8" stroke="#fff" strokeWidth={5} /><path d="M -30 30 q 10 -10 20 0 M 10 30 q 10 -10 20 0" stroke="#4fb0d8" strokeWidth={6} fill="none" /><rect x={-12} y={48} width={24} height={40} fill="#2a2350" /></g>}
      {tipo === 1 && <g><circle cx={0} cy={12} r={42} fill="#f2c09a" /><path d="M -46 0 Q -40 -56 0 -54 Q 40 -56 46 0 Q 20 -24 0 -22 Q -20 -24 -46 0 Z" fill="#3f8a3a" /><circle cx={-14} cy={10} r={7} fill="#3b2416" /><circle cx={14} cy={10} r={7} fill="#3b2416" /><path d="M -16 34 Q 0 26 16 34" stroke="#3b2416" strokeWidth={5} fill="none" /><path d="M -30 46 Q 0 70 30 46 L 30 85 L -30 85 Z" fill="#c9602c" /><line x1={52} y1={-70} x2={52} y2={85} stroke="#6b4a2f" strokeWidth={8} /><path d="M 42 -66 L 52 -88 L 62 -66 Z" fill="#9aa4b4" /></g>}
      {tipo === 2 && <g transform={`rotate(${Math.sin(t * 2.4) * 6})`}><path d="M -66 20 L 66 20 L 46 50 L -46 50 Z" fill="#8a4a20" /><rect x={-4} y={-60} width={8} height={80} fill="#6b3a1f" /><path d="M -40 -54 L 40 -54 L 34 10 L -34 10 Z" fill="#f2ead8" /><path d="M -12 -40 L 12 -40 L 0 -16 Z" fill={C.naranja} />{[-44, -20, 4, 28].map((xx) => <circle key={xx} cx={xx + 8} cy={26} r={10} fill={C.ambar} stroke="#6a4a10" strokeWidth={3} />)}<path d="M -85 62 Q -60 52 -40 62 T 0 62 T 40 62 T 85 62" stroke="#3d7fc9" strokeWidth={8} fill="none" /></g>}
    </svg>
  </div>
);
const Conspira: React.FC<{ t: number }> = ({ t }) => {
  const h0 = T("the historian ammianus", D), p = T("picts from the north", D), s = T("scots from ireland", D), x = T("saxons from the sea", D), a = T("all at once", D);
  const ck_ = T("the roman commander of the coast", D), g = T("the general in charge", D);
  const pulse = t > a ? 1 + 0.08 * Math.sin(t * 12) : 1;
  const R: { t0: number; a: [number, number]; c: [number, number]; b: [number, number]; col: string; tipo: 0 | 1 | 2; lab: string; lx: number; ly: number; lc: string }[] = [
    { t0: p, a: [1500, 210], c: [1150, 260], b: [985, 470], col: "#4fb0d8", tipo: 0, lab: "PICTS · NORTH", lx: 1500, ly: 345, lc: "#2a2350" },
    { t0: s, a: [430, 560], c: [640, 470], b: [860, 590], col: C.lima, tipo: 1, lab: "SCOTS · IRELAND", lx: 470, ly: 395, lc: "#3f8a3a" },
    { t0: x, a: [1620, 760], c: [1420, 690], b: [1215, 735], col: C.ambar, tipo: 2, lab: "SAXONS · THE SEA", lx: 1600, ly: 895, lc: C.naranja },
  ];
  return (
    <Mapa t={t}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${pulse})`, transformOrigin: "960px 600px" }}>
        {R.map((r, i) => <Flecha key={i} t={t} t0={r.t0} d={`M ${r.a[0]} ${r.a[1]} Q ${r.c[0]} ${r.c[1]} ${r.b[0]} ${r.b[1]}`} col={r.col} w={30} dur={1.6} />)}
      </div>
      {R.map((r, i) => { const k = Easing.inOut(Easing.quad)(prog(t, r.t0, r.t0 + 1.6)); const [ix, iy] = qb(k, r.a, r.c, r.b); const vivo = t > r.t0; const bob = vivo ? 0 : Math.sin(t * 4 + i) * 8; return <div key={"i" + i} style={{ position: "absolute", left: 0, top: 0, transform: `scale(${t > a ? pulse : 1})`, transformOrigin: `${ix}px ${iy}px` }}><Insignia x={ix} y={iy + bob} t={t} col={r.col} tipo={r.tipo} s={vivo ? 0.95 : 0.8 + 0.06 * Math.sin(t * 3 + i)} /></div>; })}
      {R.map((r, i) => t > r.t0 ? <Chip key={"c" + i} t={t} t0={r.t0} text={r.lab} color={r.lc} x={r.lx} y={r.ly} centro size={46} /> : null)}
      <Actua t={t} beats={[[h0, "lee"], [p, "sorpresa"], [s, "señala"], [x, "miedo"], [a, "tiembla"], [ck_, "triste"], [g, "miedo"]]} x0={230} x1={230} y={1060} h={440} frio />
      {t > a && <Sale t={t} t0={a} t1={ck_ - 0.2}><Grande t={t} t0={a} text="ALL AT ONCE." x={960} y={150} size={100} color={C.rojo} borde="#fff" /></Sale>}
      <Chip t={t} t0={h0} t1={p - 0.1} text="“A BARBARIAN CONSPIRACY”" color={C.rojo} x={900} y={150} centro size={52} />
      {t > ck_ && <Chip t={t} t0={ck_} text="COAST COMMANDER · KILLED" color={C.rojo} x={430} y={150} centro size={42} />}
      {t > g && <Chip t={t} t0={g} text="FRONTIER GENERAL · CAPTURED" color={C.rojo} x={1440} y={150} centro size={42} />}
    </Mapa>
  );
};
// 6) Teodosio retoma la provincia pueblo por pueblo: cada pin cae y él lo cuenta con el dedo
const Teodosio: React.FC<{ t: number }> = ({ t }) => {
  const a = T("the emperors general theodosius", D), r = T("retake the province", D), d2 = T("and disband the scouts", D);
  const pueblos: [number, number][] = [[1180, 900], [1100, 800], [1000, 760], [1090, 660], [960, 640], [1020, 560]];
  const paso = 0.38;
  const k = prog(t, a + 0.2, a + 2.6);
  const n = pueblos.filter((_, i) => t > r + i * paso).length;
  const H = 480, X = 300, Y = 1040, S = H / 560;
  const obj = n ? pueblos[n - 1] : pueblos[0];
  const ang = (Math.atan2(obj[0] - (X + 66 * S), obj[1] - (Y - 322 * S)) * 180) / Math.PI;
  const cuenta = t > r && t < d2;
  const tn = r + Math.max(0, n - 1) * paso;
  return (
    <Mapa t={t}>
      <Barco x={1500 - 380 * k} y={1020 - 60 * k} s={0.35} t={t} />
      {pueblos.map(([x, y], i) => t > r + i * paso ? <div key={i} style={{ position: "absolute", left: x - 26, top: y - 26, width: 52, height: 52, borderRadius: "50%", background: C.rojo, border: "7px solid #fff", transform: `translateY(${(1 - ent(t, r + i * paso)) * -120}px) scale(${ent(t, r + i * paso)})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 700, fontSize: 28, color: "#fff" }}>{i + 1}</div> : null)}
      {n > 0 && cuenta && <div style={{ position: "absolute", left: obj[0] - 50, top: obj[1] - 50, width: 100, height: 100, borderRadius: "50%", border: `6px solid ${C.ambar}`, opacity: 1 - prog(t, tn, tn + 0.5), transform: `scale(${1 + prog(t, tn, tn + 0.5)})` }} />}
      <Persona x={X} y={Y} h={H} t={t} seed={91} ropa={{ ...AUX(0), tunica: "#7a2a9a", tunica2: "#4a1a6a" }} casco="centurion" malla capa="#c81d2e"
        {...(cuenta ? { expr: (n % 2 ? "orgullo" : "sorpresa") as "orgullo" | "sorpresa", habla: true, bD: ang, cD: 4, bI: 20 + (n % 2) * 30, cI: 40, inclina: 4 } : gesto(t, [[a, "habla"], [d2, "niega"]]))} />
      {t > r && <div style={{ position: "absolute", left: 1150, top: 380, fontFamily, fontWeight: 700, fontSize: 60, color: "#fff", WebkitTextStroke: "8px #1b1240", paintOrder: "stroke fill", whiteSpace: "nowrap" }}>TOWNS RETAKEN: <span style={{ display: "inline-block", color: C.ambar, transform: `scale(${1 + 0.5 * (1 - prog(t, tn, tn + 0.35))})` }}>{n}</span></div>}
      <Chip t={t} t0={a} text="GENERAL THEODOSIUS" color={C.violeta} x={1460} y={180} centro size={54} />
      {t > r && <Chip t={t} t0={r} text="TOWN BY TOWN" color={C.rojo} x={1460} y={270} centro size={48} />}
      {t > d2 && <Chip t={t} t0={d2} text="SCOUTS: DISBANDED ✗" color="#2a2350" x={560} y={160} centro size={46} />}
    </Mapa>
  );
};

export const W6: React.FC<{ t: number; c: Cam }> = ({ t }) => {
  if (t < 618 || t > 747) return null;
  const cruza = T("did not stay politely", D);
  const fuego = T("did a great deal", D);
  const traidor = T("ammianus says they", D);
  return (
    <>
      {/* el norte cruza el muro: bárbaros de tres tamaños y poses (hacha en alto, salto, carga), y dos escaleras */}
      {t > cruza - 0.6 && t < T("rome called it", D) + 0.5 && Array.from({ length: 8 }, (_, i) => {
        const t0 = cruza + [0, 0.5, 1.1, 1.6, 2.3, 2.9, 3.6, 4.2][i];
        if (t < t0 - 0.5) return null;
        const k = prog(t, t0, t0 + 1.2);
        const corre = Math.max(0, t - (t0 + 1.2));
        const h = [300, 400, 250, 440, 330, 270, 380, 310][i];
        const x = M6 - 1250 + i * 290 + (i % 3) * 30 + 150 * k + corre * (60 + (i % 3) * 25);
        const y = TOP - 10 + k * 310 - 210 * Math.sin(Math.PI * k);
        const pose = i % 3;
        const g = t < t0 ? { expr: "enojado" as const, habla: true, bD: 150, bI: 150, cD: 20, cI: 20 } : k < 1 ? { expr: "enojado" as const, habla: true, bD: 160, bI: 120, cD: 10, cI: 40, inclina: 10 } : pose === 0 ? { expr: "enojado" as const, habla: true, bD: 150 + Math.sin(t * 9 + i) * 20, cD: 30, bI: 30, cI: 40 } : pose === 1 ? { expr: "enojado" as const, habla: true, bD: 95, cD: 10, bI: 95, cI: 10, inclina: 12 } : { expr: "feliz" as const, habla: true, bD: 165, bI: 165, cD: 15, cI: 15 };
        return <Persona key={i} x={x} y={y} h={h} t={t} seed={200 + i} ropa={BARB(i)} pantalon={i % 2 ? "#5a3a26" : "#3a5a8a"} camina={corre > 0 ? 1.7 : 0} {...g}
          manoD={pose === 0 ? <g><rect x={-6} y={-90} width={12} height={130} fill="#6b4a2f" /><path d="M 4 -90 Q 50 -100 46 -50 L 4 -60 Z" fill="#9aa4b4" stroke="#5d6577" strokeWidth={4} /></g> : undefined} />;
      })}
      {t > cruza + 0.2 && t < T("rome called it", D) + 0.5 && [M6 - 560, M6 + 760].map((lx, L) => {
        const sube = (j: number) => cruza + 0.8 + L * 0.7 + j * 2.6;
        return (
          <React.Fragment key={"e" + L}>
            <div style={{ position: "absolute", left: lx - 300, top: TOP - 700, width: 600, height: 712, overflow: "hidden" }}>
              <div style={{ position: "absolute", left: -(lx - 300), top: -(TOP - 700) }}>
                <svg style={{ position: "absolute", left: lx - 80, top: TOP - 230 + 240 * (1 - ent(t, cruza + 0.2 + L * 0.5)), overflow: "visible" }} width={160} height={400}>
                  <line x1={30} y1={0} x2={40} y2={400} stroke="#6b4a2f" strokeWidth={14} /><line x1={130} y1={0} x2={120} y2={400} stroke="#6b4a2f" strokeWidth={14} />
                  {Array.from({ length: 8 }, (_, r) => <line key={r} x1={32} y1={30 + r * 50} x2={128} y2={30 + r * 50} stroke="#8a6a3a" strokeWidth={10} />)}
                </svg>
                {[0, 1].map((j) => { const u = prog(t, sube(j), sube(j) + 1.6); if (u <= 0 || u >= 1) return null; const sw = Math.sin(t * 9 + j) * 22; return <Persona key={j} x={lx} y={TOP + 360 - 370 * u} h={330 - j * 40} t={t} seed={260 + L * 2 + j} ropa={BARB(L + j + 1)} pantalon="#3a5a8a" expr="enojado" bD={150 + sw} bI={150 - sw} cD={30} cI={30} />; })}
              </div>
            </div>
            {[0, 1].map((j) => { const t1 = sube(j) + 1.6; if (t < t1) return null; const kk = prog(t, t1 + 0.4, t1 + 1.4); const corre = Math.max(0, t - (t1 + 1.4)); const hh = 330 - j * 40;
              return <Persona key={"b" + j} x={lx + 120 * kk + corre * 80} y={TOP - 10 + kk * 310 - 160 * Math.sin(Math.PI * kk)} h={hh} t={t} seed={260 + L * 2 + j} ropa={BARB(L + j + 1)} pantalon="#3a5a8a" camina={corre > 0 ? 1.7 : 0} {...(t < t1 + 0.4 ? { expr: "feliz" as const, habla: true, bD: 160, bI: 160, cD: 10, cI: 10 } : { expr: "enojado" as const, habla: true, bD: 120, bI: 60, cD: 20, cI: 30 })} />; })}
          </React.Fragment>
        );
      })}
      {t > fuego && t < T("rome called it", D) + 0.5 && [M6 - 300, M6 + 200, M6 + 600].map((x, i) => <React.Fragment key={i}>{[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: x - 70 + k * 50, top: TOP - 230 - Math.abs(Math.sin(t * 8 + k + i)) * 60, width: 90, height: 160, borderRadius: "50% 50% 30% 30%", background: k % 2 ? C.naranja : C.ambar, opacity: 0.9 }} />)}</React.Fragment>)}
      {t > T("and cut down a roman", D) - 0.3 && t < T("rome called it", D) + 0.5 && Array.from({ length: 7 }, (_, i) => <Soldadito key={i} x={M6 + 100 + i * 120} y={BASE} s={i === 3 ? 1.7 : 1.3} t={t} seed={210 + i} cae={T("and cut down a roman", D) + 0.6 + i * 0.12} />)}
      {/* los areani: uno agachado espiando, uno con antorcha, uno que señala; después cobran */}
      {t > T("rome had a group", D) - 0.3 && t < T("and you", 729) && [0, 1, 2].map((i) => {
        const x = M6 - 1200 + i * 280;
        const vende = t > traidor;
        const job = T("whose job was to travel", D) + i * 0.3, fp = T("for profit", D);
        const H = 300;
        const g0 = gesto(t, [[T("rome had a group", D), "camina"], [T("men called the", D) + i * 0.2, ["habla", "lee", "encoge"][i] as Gesto]]);
        const pose = t < job ? g0 : !vende ? (i === 0 ? { expr: "neutro" as const, habla: false, bD: 25, bI: 25, cD: -50, cI: -50, inclina: 8 } : i === 1 ? { expr: "sorpresa" as const, habla: true, bD: 150, cD: 25, bI: 20, cI: 30 } : { ...gesto(t, [[job, "señala"]]), inclina: -6 }) : t < fp ? gesto(t, [[traidor, ["lee", "festeja", "habla"][i] as Gesto]]) : gesto(t, [[fp, ["festeja", "carga", "lee"][i] as Gesto]]);
        const agacha = i === 0 && t > job && !vende;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: 0, top: 0, transform: agacha ? "scaleY(0.76)" : undefined, transformOrigin: `${x}px ${TOP}px` }}>
              <Persona x={x} y={TOP} h={H} t={t} seed={220 + i} ropa={{ ...CIVIL(i + 2), tunica: ["#4a4a5a", "#5a4a3a", "#3a4a5a"][i], tunica2: "#2a2a3a" }} flip={vende ? i !== 1 : false} mira={vende ? -0.8 : 0.4} {...pose}
                manoD={i === 1 && !vende && t > job ? <g><rect x={-7} y={-10} width={14} height={150} fill="#6b4a2f" /><path d={`M -22 140 Q 0 ${210 + Math.abs(Math.sin(t * 13)) * 24} 22 140 Z`} fill={C.naranja} /><path d="M -11 140 Q 0 182 11 140 Z" fill={C.ambar} /></g> : undefined} />
            </div>
            {i === 1 && t > job && !vende && <div style={{ position: "absolute", left: x + 70 - 160, top: TOP - 350 - 160, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,190,90,.55), rgba(255,190,90,0) 65%)" }} />}
            {vende && <Moneda x={x - 150} y={TOP - 170 - Math.abs(Math.sin(t * 4 + i)) * 40} r={30} t={t} gira={2} />}
          </React.Fragment>
        );
      })}
      {/* vos en la torre, en la niebla */}
      {t > T("and you", 729) - 0.5 && t < 742 && <Persona x={TU6} y={TOP - 290} h={200} t={t} seed={3} ropa={TUNGRO} casco="legion" malla pantalon="#6b4a2f" capa="#3f6b2a" mira={0.3} {...gesto(t, [[T("and you", 729), "tiembla"], [T("in the fog", D), "lee"], [T("would have been the very last", D), "miedo"]])} />}
    </>
  );
};
export const N6: React.FC<{ t: number; c: Cam }> = ({ t, c }) => {
  const a = T("and the worst part", D), b = 742;
  if (t < a || t > b) return null;
  const bx = M6 * 0.62;
  return <>{Array.from({ length: 8 }, (_, i) => <Picto key={i} x={bx - 450 + i * 200} y={310 + (i % 2) * 30} s={0.65} t={t} seed={240 + i} sube={T("ammianus says they", D) + i * 0.1} />)}{t > T("whose job was to travel", D) && t < T("and you", 729) && [0, 1, 2, 3].map((i) => <React.Fragment key={"s" + i}><div style={{ position: "absolute", left: bx - 380 + i * 240 - 170, top: 360 + (i % 2) * 20 - 300, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,150,70,.6), rgba(255,150,70,0) 68%)", opacity: prog(t, T("whose job was to travel", D) + 0.2 + i * 0.25, T("whose job was to travel", D) + 0.8 + i * 0.25) }} /><Persona x={bx - 380 + i * 240} y={360 + (i % 2) * 20} h={170 + (i % 2) * 30} t={t} seed={300 + i} sombra="#140c26" flip={i % 2 === 1} aparece={T("whose job was to travel", D) + 0.4 + i * 0.25} {...gesto(t, [[T("whose job was to travel", D) + 0.4 + i * 0.25, "señala"], [T("ammianus says they", D) + i * 0.2, "festeja"]])} /></React.Fragment>)}{t > T("in the fog", D) && [0, 1, 2, 3, 4].map((i) => <Ojos key={"o" + i} x={TU6 * 0.62 - 600 + i * 260} y={280} t={t} t0={T("in the fog", D) + i * 0.25} s={0.55} seed={i + 30} />)}</>;
};

export const S6: React.FC<{ t: number; c: Cam }> = ({ t, c }) => {
  if (t < 618 || t > 747) return null;
  return (
    <>
      <CartelTrampa t={t} t0={618.48} n={6} titulo="THE NORTH" color="#2a2350" />
      <Ch t={t} w="did not stay politely" d={D} txt="THEY DID NOT STAY ON THEIR SIDE" y={150} c={C.rojo} size={56} dur={3.6} />
      <Gr t={t} w="around the year 180" d={D} txt="AD 180" y={340} size={180} c={C.ambar} dur={1.55} />
      <Ch t={t} w="the historian cassius" d={D} txt="HISTORIAN CASSIUS DIO" y={150} c={C.violeta} size={56} dur={2.2} />
      <Ch t={t} w="crossed the wall" d={D} txt="CROSSED THE WALL" y={260} c={C.rojo} size={56} dur={1.6} />
      <Ch t={t} w="did a great deal" d={D} txt="GREAT DAMAGE" y={150} c={C.naranja} size={60} dur={1.4} />
      <Ch t={t} w="and cut down a roman" d={D} txt="A ROMAN GENERAL + HIS TROOPS · CUT DOWN" y={150} c={C.rojo} size={50} dur={3.1} />
      <Gr t={t} w="its greatest war" d={D} txt="ROME'S GREATEST WAR OF THE TIME" y={200} size={80} c={C.crema} dur={2.2} />
      <Plano t={t} t0={T("and the frontier", D)} t1={T("then", 655) - 0.15} desde={[960, 540]} fondo="#1b3a6a"><Frontera t={t} /></Plano>
      <Plano t={t} t0={T("then", 655)} t1={T("the tribes simply melted", D) - 0.15} fondo="#6a8fc0"><SeveroMarcha t={t} /></Plano>
      <Plano t={t} t0={T("the tribes simply melted", D) - 0.1} t1={T("severus fell ill", D) - 0.15} fondo="#5c6f8f"><SeveroCienaga t={t} /></Plano>
      <Plano t={t} t0={T("severus fell ill", D) - 0.1} t1={T("his last advice", D) - 0.15} fondo="#1b3a6a"><SeveroMuere t={t} /></Plano>
      <Plano t={t} t0={T("his last advice", D) - 0.05} t1={T("which", 685) - 0.1} desde={[960, 540]} fondo="#1b1240"><Consejo t={t} /></Plano>
      <Plano t={t} t0={T("if you are the soldier freezing", D) - 0.1} t1={T("and then came the worst", D) - 0.15} desde={[960, 700]} fondo="#5c6f8f"><Cienaga t={t} /></Plano>
      <Plano t={t} t0={T("and then came the worst", D) - 0.1} t1={T("the historian ammianus", D) - 0.15} fondo="#3a0f1a"><Anio367 t={t} /></Plano>
      <Plano t={t} t0={T("the historian ammianus", D) - 0.1} t1={T("and the worst part", D) - 0.15} desde={[960, 540]} fondo="#1b3a6a"><Conspira t={t} /></Plano>
      <Gr t={t} w="and the worst part" d={D} txt="THE WORST PART?" y={200} size={120} c={C.ambar} dur={1.1} />
      <Ch t={t} w="rome had a group" d={D} txt="LOCAL SCOUTS" y={150} c={C.violeta} size={60} dur={2.3} />
      <Gr t={t} w="men called the" d={D} txt="THE AREANI" y={260} size={110} c={C.crema} dur={1.6} />
      <Ch t={t} w="whose job was to travel" d={D} txt="JOB: GO BEYOND THE WALL · REPORT BACK" y={150} c={C.teal} tinta={C.noche} size={52} dur={3.8} />
      <Ch t={t} w="ammianus says they" d={D} txt="SELLING ROMAN SECRETS…" y={150} c={C.rojo} size={60} dur={3.4} />
      <Ch t={t} w="for profit" d={D} txt="…FOR PROFIT" y={260} c={C.oro} tinta={C.noche} size={60} dur={1.1} />
      <Gr t={t} w="so the men who were supposed" d={D} txt="WORKING FOR THE OTHER SIDE" y={200} size={84} c={C.rojo} borde="#fff" dur={3.4} />
      <Ch t={t} w="standing in your turret" d={D} txt="YOU · IN YOUR TURRET" y={150} c={C.violeta} size={56} dur={1.2} />
      <Gr t={t} w="would have been the very last" d={D} txt="THE LAST TO KNOW." y={880} size={120} c="#fff" dur={1.0} />
      <Plano t={t} t0={T("the emperors general theodosius", D) - 0.1} t1={T("the wall survived", D) - 0.15} desde={[960, 540]} fondo="#1b3a6a"><Teodosio t={t} /></Plano>
      <Ch t={t} w="the wall survived" d={D} txt="THE WALL SURVIVED…" y={150} c={C.teal} tinta={C.noche} size={60} dur={1.8} />
      <Gr t={t} w="how thin it really was" d={D} txt="…BUT IT WAS THIN." y={200} size={120} c={C.rojo} borde="#fff" dur={3.0} />
      <Relampago t={t} t0={627.0} x={700} /><Relampago t={t} t0={693.0} x={1300} /><Relampago t={t} t0={701.1} x={500} />
    </>
  );
};
