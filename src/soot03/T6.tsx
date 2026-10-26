import React from "react";
import { Sala } from "./sets";
import { AbsoluteFill } from "remotion";
import { C, fontFamily, ent, prog, Chip, Grande, Emote, cabeza, Moneda } from "./kit";
import { Soldadito, Barco, Lluvia } from "./kit2";
import { Laurel } from "./T1";
import { Persona, CIVIL } from "./persona";
import { TOP, BASE, MC, K, Cam, Pal, Plano, CartelTrampa, pant, Relampago } from "./mundo";
import { Gr, Cu, Ch, T, ck, TUNGRO, AUX, Picto, Ojos, gesto, Actua } from "./kit3";

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
      {t < a && <Chip t={t} t0={T("and the frontier", D) + 0.3} text="THE FRONTIER NEVER STOPPED MOVING" color={C.rojo} x={960} y={980} centro size={52} />}
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
// 3) el consejo de Severo a sus hijos
const Consejo: React.FC<{ t: number }> = ({ t }) => {
  const r: [string, string, string][] = [["get along with each other", "GET ALONG WITH EACH OTHER", C.teal], ["make the soldiers rich", "MAKE THE SOLDIERS RICH", C.oro], ["and ignore everyone else", "IGNORE EVERYONE ELSE", C.rojo]];
  return (
    <AbsoluteFill>
      <Sala t={t} tono="violeta" />
      <div style={{ position: "absolute", left: 180, top: 640, width: 760, height: 140, background: "#8a5a2a", borderRadius: 30 }} />
      <div style={{ position: "absolute", left: 200, top: 590, width: 700, height: 90, background: "#f6efe2", borderRadius: 40 }} />
      <Persona x={360} y={760} h={320} t={t} seed={88} ropa={SEVERO} viejo {...gesto(t, [[T("his last advice", D), "habla"], [T(r[0][0], D), "señala"], [T(r[1][0], D), "habla"], [T(r[2][0], D), "señala"]])} inclina={-62} />
      {(() => { const n = r.filter(([w]) => t > T(w, D)).length; return n ? <div key={n} style={{ position: "absolute", left: 600, top: 380, width: 150, height: 150, borderRadius: "50%", background: C.ambar, border: "8px solid #fff", fontFamily, fontWeight: 700, fontSize: 110, lineHeight: "150px", textAlign: "center", color: C.noche, transform: `scale(${ent(t, T(r[n - 1][0], D))})` }}>{n}</div> : null; })()}
      <Persona x={1080} y={960} h={330} t={t} seed={160} ropa={{ ...CIVIL(1), tunica: "#c93d6a", tunica2: "#8f2547" }} flip mira={-0.6} {...gesto(t, [[T("his last advice", D), "lee"], [T(r[0][0], D), "niega"], [T(r[1][0], D), "festeja"], [T(r[2][0], D), "habla"]])} />
      <Persona x={1360} y={960} h={330} t={t} seed={161} ropa={{ ...CIVIL(2), tunica: "#3d7fc9", tunica2: "#25548f" }} flip mira={-0.6} {...gesto(t, [[T("his last advice", D), "lee"], [T(r[0][0], D), "enojado"], [T(r[1][0], D), "festeja"], [T(r[2][0], D), "señala"]])} />
      {r.map(([w, tx, col], i) => t > T(w, D) ? <Chip key={i} t={t} t0={T(w, D)} text={`${i + 1}. ${tx}`} color={col} tinta={i === 1 ? C.noche : "#fff"} x={1240} y={170 + i * 100} centro size={50} /> : null)}
      <Chip t={t} t0={T("his last advice", D)} t1={T("get along with each other", D)} text="HIS LAST ADVICE TO HIS SONS" color={C.violeta} x={1240} y={170} centro size={50} />
    </AbsoluteFill>
  );
};
// 4) vos en la ciénaga, aprobando
const Cienaga: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#5c6f8f,#8b95aa)" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 720, bottom: 0, background: "#4a4a2a" }} />
    {[0, 1, 2, 3, 4, 5].map((i) => <div key={"j" + i} style={{ position: "absolute", left: 80 + i * 330, top: 600, width: 14, height: 140, background: "#5a6a2a", borderRadius: 7, transform: `rotate(${Math.sin(t * 1.3 + i) * 6}deg)`, transformOrigin: "50% 100%" }} />)}
    {(() => { const t0 = T("if you are the soldier freezing", D); const k = prog(t, t0, t0 + 3.2); const ok = t > T("is the first piece", D); return <Persona x={960} y={960 + 60 * k} h={520} t={t} seed={3} ropa={TUNGRO} casco="legion" malla pantalon="#6b4a2f" capa="#3f6b2a" expr={ok ? "feliz" : k > 0.3 ? "miedo" : "triste"} bD={ok ? 150 : 60 + 70 * k} cD={ok ? 160 : 40} bI={ok ? 20 : 60 + 70 * k} cI={40} />; })()}
    <div style={{ position: "absolute", left: 0, right: 0, top: 820, bottom: 0, background: "#3a3a20" }} />
    {Array.from({ length: 7 }, (_, i) => { const q = (t * 0.9 + i / 7) % 1; return <div key={"b" + i} style={{ position: "absolute", left: 860 + ((i * 53) % 200), top: 830 - q * 40, width: 18 + (i % 3) * 8, height: 18 + (i % 3) * 8, borderRadius: "50%", border: "4px solid #8a8a5a", opacity: 1 - q }} />; })}
    {[0, 1].map((i) => { const t0 = T("if you are the soldier freezing", D) + 0.8 + i * 0.5; return <Actua key={"l" + i} t={t} beats={[[t0, "camina"], [t0 + 2, "miedo"]]} x0={-200 - i * 180} x1={2200} y={1150 + i * 30} h={560} frio vuelta={t0} />; })}
    {[0, 1, 2, 3].map((i) => <div key={"jj" + i} style={{ position: "absolute", left: i * 560 - 40, top: 860, width: 22, height: 260, background: "#3f5a1f", borderRadius: 11, transform: `rotate(${-8 + Math.sin(t * 1.7 + i) * 7}deg)`, transformOrigin: "50% 100%" }} />)}
    {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 200 + i * 220, top: 830 + Math.sin(t * 3 + i) * 6, width: 120, height: 16, borderRadius: 8, background: "#6a6a3a" }} />)}
    <Lluvia t={t} n={170} op={0.6} seed={61} />
    <Chip t={t} t0={T("if you are the soldier freezing", D)} text="A BOG · SCOTLAND" color="#4a4a2a" x={960} y={140} centro size={56} />
    {t > T("is the first piece", D) && <Grande t={t} t0={T("genuinely useful", D)} text="GENUINELY USEFUL." y={260} size={110} color={C.lima} />}
  </AbsoluteFill>
);
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
// 5) la conspiración del 367
const Conspira: React.FC<{ t: number }> = ({ t }) => {
  const p = T("picts from the north", D), s = T("scots from ireland", D), x = T("saxons from the sea", D), a = T("all at once", D);
  const pulse = t > a ? 1 + 0.08 * Math.sin(t * 12) : 1;
  return (
    <Mapa t={t}>
      {([[930, 120, "#4fb0d8"], [600, 560, C.lima], [1560, 760, C.ambar]] as const).map(([x0, y0, col], i) => <div key={"o" + i} style={{ position: "absolute", left: x0 - 70, top: y0 - 70 + 40, width: 140, height: 140, borderRadius: "50%", border: `10px solid ${col}`, transform: `scale(${0.8 + 0.25 * Math.abs(Math.sin(t * 4 + i))})` }} />)}
      {([[930, 120], [600, 560], [1560, 760]] as const).map(([x0, y0], i) => <Picto key={"q" + i} x={x0} y={y0 + 40 - Math.abs(Math.sin(t * 5 + i)) * 20} s={0.42} t={t} seed={520 + i} grita />)}
      <div style={{ position: "absolute", inset: 0, transform: `scale(${pulse})`, transformOrigin: "960px 600px" }}>
        <Flecha t={t} t0={p} d="M 930 120 Q 960 330 960 500" col="#4fb0d8" w={34} />
        <Flecha t={t} t0={s} d="M 600 560 Q 760 540 860 580" col={C.lima} w={34} />
        <Flecha t={t} t0={x} d="M 1560 760 Q 1380 720 1200 730" col={C.ambar} w={34} />
      </div>
      {([[p, 930, 120, 960, 500], [s, 600, 560, 860, 580], [x, 1560, 760, 1200, 730]] as const).map(([t0, x0, y0, x1, y1], i) => t > t0 ? [0, 1, 2].map((j) => { const k = prog(t, t0 + 0.3 + j * 0.35, t0 + 2.6 + j * 0.35); return <div key={i + "-" + j} style={{ position: "absolute", left: 0, top: 0, opacity: k > 0 && k < 1 ? 1 : 0 }}><Picto x={x0 + (x1 - x0) * k + (j - 1) * 30} y={y0 + (y1 - y0) * k + 40} s={0.32} t={t} seed={500 + i * 3 + j} grita /></div>; }) : null)}
      {t > p && <Chip t={t} t0={p} text="PICTS · NORTH" color="#2a2350" x={620} y={160} centro size={50} />}
      {t > s && <Chip t={t} t0={s} text="SCOTS · IRELAND" color="#3f8a3a" x={420} y={760} centro size={50} />}
      {t > x && <Chip t={t} t0={x} text="SAXONS · THE SEA" color={C.naranja} x={1560} y={870} centro size={50} />}
      {t > a && <Grande t={t} t0={a} text="ALL AT ONCE." x={470} y={930} size={90} color={C.rojo} borde="#fff" />}
      <Chip t={t} t0={T("the historian ammianus", D)} t1={p} text="“A BARBARIAN CONSPIRACY”" color={C.rojo} x={960} y={150} centro size={60} />
      {t > T("the roman commander of the coast", D) && <Chip t={t} t0={T("the roman commander of the coast", D)} text="COAST COMMANDER · KILLED" color={C.rojo} x={1450} y={330} centro size={44} />}
      {t > T("the general in charge", D) && <Chip t={t} t0={T("the general in charge", D)} text="FRONTIER GENERAL · CAPTURED" color={C.rojo} x={1450} y={420} centro size={44} />}
    </Mapa>
  );
};
// 6) Teodosio retoma la provincia
const Teodosio: React.FC<{ t: number }> = ({ t }) => {
  const a = T("the emperors general theodosius", D), r = T("retake the province", D), d2 = T("and disband the scouts", D);
  const pueblos: [number, number][] = [[1180, 900], [1100, 800], [1000, 760], [1090, 660], [960, 640], [1020, 560]];
  const k = prog(t, a + 0.2, a + 2.6);
  return (
    <Mapa t={t}>
      <Barco x={1500 - 380 * k} y={1020 - 60 * k} s={0.35} t={t} />
      {pueblos.map(([x, y], i) => t > r + i * 0.3 ? <div key={i} style={{ position: "absolute", left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: "50%", background: C.rojo, border: "6px solid #fff", transform: `scale(${ent(t, r + i * 0.3)})` }} /> : null)}
      <Persona x={300} y={990} h={420} t={t} seed={91} ropa={{ ...AUX(0), tunica: "#7a2a9a", tunica2: "#4a1a6a" }} casco="centurion" malla capa="#c81d2e" {...gesto(t, [[a, "habla"], [r, "señala"], [d2, "niega"]])} />
      {t > r && <div style={{ position: "absolute", left: 1320, top: 380, fontFamily, fontWeight: 700, fontSize: 56, color: "#fff", WebkitTextStroke: "8px #1b1240", paintOrder: "stroke fill" }}>TOWNS RETAKEN: {pueblos.filter((_, i) => t > r + i * 0.3).length}</div>}
      <Chip t={t} t0={a} text="GENERAL THEODOSIUS" color={C.violeta} x={1460} y={180} centro size={54} />
      {t > r && <Chip t={t} t0={r} text="TOWN BY TOWN" color={C.rojo} x={1460} y={270} centro size={48} />}
      {t > d2 && <Chip t={t} t0={d2} text="SCOUTS: DISBANDED ✗" color="#2a2350" x={640} y={330} centro size={50} />}
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
      {/* el norte cruza el muro */}
      {t > cruza - 0.2 && t < T("rome called it", D) + 0.5 && Array.from({ length: 10 }, (_, i) => {
        const k = prog(t, cruza + i * 0.25, cruza + 3 + i * 0.25);
        const corre = Math.max(0, t - (cruza + 3 + i * 0.25));
        return <Picto key={i} x={M6 - 1200 + i * 260 + (i % 3) * 40 + 140 * k + corre * (70 + (i % 3) * 25)} y={TOP - 10 + k * 310 - 190 * Math.sin(Math.PI * k) + (i % 2) * 30 - (corre > 0 ? Math.abs(Math.sin(t * 7 + i)) * 22 : 0)} s={1.0 + (i % 3) * 0.15} t={t} seed={200 + i} sube={cruza + i * 0.12} grita />;
      })}
      {t > fuego && t < T("rome called it", D) + 0.5 && [M6 - 300, M6 + 200, M6 + 600].map((x, i) => <React.Fragment key={i}>{[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: x - 70 + k * 50, top: TOP - 230 - Math.abs(Math.sin(t * 8 + k + i)) * 60, width: 90, height: 160, borderRadius: "50% 50% 30% 30%", background: k % 2 ? C.naranja : C.ambar, opacity: 0.9 }} />)}</React.Fragment>)}
      {t > T("and cut down a roman", D) - 0.3 && t < T("rome called it", D) + 0.5 && Array.from({ length: 7 }, (_, i) => <Soldadito key={i} x={M6 + 100 + i * 120} y={BASE} s={i === 3 ? 1.7 : 1.3} t={t} seed={210 + i} cae={T("and cut down a roman", D) + 0.6 + i * 0.12} />)}
      {/* los areani: salen al norte, vuelven con plata */}
      {t > T("rome had a group", D) - 0.3 && t < T("and you", 729) && [0, 1, 2].map((i) => {
        const x = M6 - 1200 + i * 260;
        const vende = t > traidor;
        return (
          <React.Fragment key={i}>
            <Persona x={x} y={TOP} h={220} t={t} seed={220 + i} ropa={{ ...CIVIL(i + 2), tunica: "#4a4a5a", tunica2: "#2a2a3a" }} flip={vende} mira={vende ? -0.8 : 0.4} {...gesto(t, [[T("rome had a group", D), "camina"], [T("whose job was to travel", D) + i * 0.3, "señala"], [traidor, "festeja"], [T("for profit", D), "carga"]])} />
            {vende && <Moneda x={x - 130} y={TOP - 150 - Math.abs(Math.sin(t * 4 + i)) * 40} r={30} t={t} gira={2} />}
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
  return <>{Array.from({ length: 8 }, (_, i) => <Picto key={i} x={bx - 450 + i * 200} y={310 + (i % 2) * 30} s={0.65} t={t} seed={240 + i} sube={T("ammianus says they", D) + i * 0.1} />)}{t > T("in the fog", D) && [0, 1, 2, 3, 4].map((i) => <Ojos key={"o" + i} x={TU6 * 0.62 - 600 + i * 260} y={280} t={t} t0={T("in the fog", D) + i * 0.25} s={0.55} seed={i + 30} />)}</>;
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
