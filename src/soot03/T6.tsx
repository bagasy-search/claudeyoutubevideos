import React from "react";
import { AbsoluteFill } from "remotion";
import { C, fontFamily, ent, prog, Chip, Grande, Emote, cabeza, Moneda } from "./kit";
import { Soldadito, Barco } from "./kit2";
import { Persona, CIVIL } from "./persona";
import { TOP, BASE, MC, K, Cam, Pal, Plano, CartelTrampa, pant, Relampago } from "./mundo";
import { Gr, Cu, Ch, T, ck, TUNGRO, AUX, Picto, Ojos } from "./kit3";

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
const BRIT = "M 905 70 L 960 60 L 1010 90 L 990 150 L 1030 190 L 1010 260 L 1060 300 L 1040 350 L 1080 400 L 1050 440 L 1100 520 L 1120 600 L 1160 660 L 1200 720 L 1230 790 L 1180 840 L 1240 880 L 1200 940 L 1100 960 L 980 980 L 880 990 L 800 1000 L 760 960 L 840 920 L 900 880 L 860 840 L 820 800 L 870 760 L 880 700 L 840 640 L 860 580 L 900 540 L 880 500 L 840 470 L 860 420 L 820 380 L 830 330 L 800 290 L 840 240 L 810 200 L 850 150 L 830 110 Z";
const IRL = "M 600 470 L 690 450 L 740 500 L 730 600 L 700 690 L 620 720 L 560 680 L 540 590 L 570 520 Z";
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
      <Cu t={t} w="only 20 years after" d={D} de={0} a={20} sube={0.8} dur={2.6} x={460} y={200} size={110} suf=" YEARS LATER" color="#fff" />
      {t > a && <Chip t={t} t0={a + 0.3} text="THE ANTONINE WALL" color="#7a5a2a" x={540} y={360} centro size={50} />}
      {t > T("made mostly of turf", D) && <Chip t={t} t0={T("made mostly of turf", D)} t1={g} text="MOSTLY TURF" color={C.lima} tinta={C.noche} x={540} y={440} centro size={42} />}
      <Flecha t={t} t0={g + 1.2} d="M 940 410 L 940 500" col={C.ambar} />
      {t > T("to your wall", D) && <Chip t={t} t0={T("to your wall", D)} text="BACK TO YOUR WALL" color={C.ambar} tinta={C.noche} x={1460} y={560} centro size={50} />}
      <Chip t={t} t0={T("further north", D)} t1={T("within about a generation", D)} text="↑ FURTHER NORTH · SCOTLAND" color={C.violeta} x={940} y={150} centro size={50} />
    </Mapa>
  );
};
// 2) Severo: marcha a Escocia, ciénagas, muere en York
const Severo: React.FC<{ t: number }> = ({ t }) => {
  const a = T("in the year 208", D), m = T("he marched deep", D), f = T("the tribes simply melted", D), l = T("and the romans lost", D), y = T("severus fell ill", D);
  return (
    <Mapa t={t}>
      <Flecha t={t} t0={m} d={`M ${YORK[0]} ${YORK[1]} Q 1040 420 960 200`} col={C.rojo} w={30} dur={1.6} />
      {t > a - 0.3 && t < f + 1.6 && Array.from({ length: 12 }, (_, i) => {
        const k = t > f ? prog(t, f + i * 0.08, f + 0.9 + i * 0.08) : 0;
        return <div key={i} style={{ position: "absolute", left: 860 + (i % 4) * 50, top: 180 + Math.floor(i / 4) * 50, width: 26, height: 26, borderRadius: "50%", background: "#2a2350", border: "4px solid #4fb0d8", opacity: 1 - k, transform: `scale(${1 - k * 0.6})` }} />;
      })}
      {t > f && [0, 1, 2, 3, 4].map((i) => <div key={"b" + i} style={{ position: "absolute", left: 830 + i * 40, top: 230 + (i % 2) * 40, width: 90, height: 30, borderRadius: "50%", background: "#4a5a3a", opacity: prog(t, f + 0.4, f + 1) }} />)}
      <Gr t={t} w="in the year 208" d={D} txt="AD 208" y={150} x={460} size={130} c={C.ambar} dur={2.2} />
      <Chip t={t} t0={T("the emperor septimius", D)} t1={m} text="EMPEROR SEPTIMIUS SEVERUS" color="#7a2a9a" x={1460} y={180} centro size={46} />
      {t > T("with a huge army", D) && t < f && <Chip t={t} t0={T("with a huge army", D)} text="+ A HUGE ARMY" color={C.rojo} x={1460} y={260} centro size={46} />}
      {t > f && t < y && <Chip t={t} t0={f} text="MELTED INTO HILLS & BOGS" color="#2a2350" x={460} y={260} centro size={46} />}
      {t > l && t < y && <Chip t={t} t0={l} text="THOUSANDS OF ROMANS LOST" color={C.rojo} x={1460} y={360} centro size={46} />}
      {t > y && <div style={{ position: "absolute", left: YORK[0] - 40, top: YORK[1] - 110, fontFamily, fontWeight: 700, fontSize: 90, color: "#fff", WebkitTextStroke: "10px #1b1240", paintOrder: "stroke fill", transform: `scale(${ent(t, y)})` }}>†</div>}
      {t > y && <Chip t={t} t0={y + 0.3} text="DIES AT YORK · AD 211" color="#2a2350" x={1500} y={700} centro size={50} />}
    </Mapa>
  );
};
// 3) el consejo de Severo a sus hijos
const Consejo: React.FC<{ t: number }> = ({ t }) => {
  const r: [string, string, string][] = [["get along with each other", "GET ALONG WITH EACH OTHER", C.teal], ["make the soldiers rich", "MAKE THE SOLDIERS RICH", C.oro], ["and ignore everyone else", "IGNORE EVERYONE ELSE", C.rojo]];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #7a2a9a, #1b1240 85%)" }}>
      <div style={{ position: "absolute", left: 180, top: 640, width: 760, height: 140, background: "#8a5a2a", borderRadius: 30 }} />
      <div style={{ position: "absolute", left: 200, top: 590, width: 700, height: 90, background: "#f6efe2", borderRadius: 40 }} />
      <Persona x={360} y={760} h={320} t={t} seed={88} ropa={{ ...CIVIL(0), tunica: "#7a2a9a", tunica2: "#4a1a6a" }} viejo expr="triste" habla inclina={-62} bD={100} cD={20} />
      {[0, 1].map((i) => <Persona key={i} x={1040 + i * 220} y={900} h={330} t={t} seed={160 + i} ropa={{ ...CIVIL(i + 1), tunica: i ? "#3d7fc9" : "#c93d6a", tunica2: i ? "#25548f" : "#8f2547" }} flip expr={i ? "enojado" : "orgullo"} mira={-0.6} />)}
      {r.map(([w, tx, col], i) => t > T(w, D) ? <Chip key={i} t={t} t0={T(w, D)} text={`${i + 1}. ${tx}`} color={col} tinta={i === 1 ? C.noche : "#fff"} x={1200} y={180 + i * 110} centro size={54} /> : null)}
      <Chip t={t} t0={T("his last advice", D)} t1={T("get along with each other", D)} text="HIS LAST ADVICE TO HIS SONS" color={C.violeta} x={1200} y={180} centro size={54} />
    </AbsoluteFill>
  );
};
// 4) vos en la ciénaga, aprobando
const Cienaga: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#5c6f8f,#8b95aa)" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 720, bottom: 0, background: "#4a4a2a" }} />
    <Persona x={960} y={960} h={520} t={t} seed={3} ropa={TUNGRO} casco="legion" malla pantalon="#6b4a2f" capa="#3f6b2a" expr={t > T("is the first piece", D) ? "feliz" : "triste"} bD={t > T("is the first piece", D) ? 150 : 20} cD={t > T("is the first piece", D) ? 160 : 0} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 820, bottom: 0, background: "#3a3a20" }} />
    {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 200 + i * 220, top: 830 + Math.sin(t * 3 + i) * 6, width: 120, height: 16, borderRadius: 8, background: "#6a6a3a" }} />)}
    <Chip t={t} t0={T("if you are the soldier freezing", D)} text="A BOG · SCOTLAND" color="#4a4a2a" x={960} y={140} centro size={56} />
    {t > T("is the first piece", D) && <Grande t={t} t0={T("genuinely useful", D)} text="GENUINELY USEFUL." y={260} size={110} color={C.lima} />}
  </AbsoluteFill>
);
// 5) la conspiración del 367
const Conspira: React.FC<{ t: number }> = ({ t }) => {
  const p = T("picts from the north", D), s = T("scots from ireland", D), x = T("saxons from the sea", D), a = T("all at once", D);
  const pulse = t > a ? 1 + 0.08 * Math.sin(t * 12) : 1;
  return (
    <Mapa t={t}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${pulse})`, transformOrigin: "960px 600px" }}>
        <Flecha t={t} t0={p} d="M 930 120 Q 960 330 960 500" col="#4fb0d8" w={34} />
        <Flecha t={t} t0={s} d="M 600 560 Q 760 540 860 580" col={C.lima} w={34} />
        <Flecha t={t} t0={x} d="M 1560 760 Q 1380 720 1200 730" col={C.ambar} w={34} />
      </div>
      {t > p && <Chip t={t} t0={p} text="PICTS · NORTH" color="#2a2350" x={620} y={160} centro size={50} />}
      {t > s && <Chip t={t} t0={s} text="SCOTS · IRELAND" color="#3f8a3a" x={420} y={760} centro size={50} />}
      {t > x && <Chip t={t} t0={x} text="SAXONS · THE SEA" color={C.naranja} x={1560} y={870} centro size={50} />}
      {t > a && <Grande t={t} t0={a} text="ALL AT ONCE." y={1000} size={100} color={C.rojo} borde="#fff" />}
      <Chip t={t} t0={T("the historian ammianus", D)} t1={p} text="“A BARBARIAN CONSPIRACY”" color={C.rojo} x={960} y={150} centro size={60} />
      {t > T("the roman commander of the coast", D) && <Chip t={t} t0={T("the roman commander of the coast", D)} text="COAST COMMANDER · KILLED" color={C.rojo} x={1500} y={300} centro size={44} />}
      {t > T("the general in charge", D) && <Chip t={t} t0={T("the general in charge", D)} text="FRONTIER GENERAL · CAPTURED" color={C.rojo} x={1500} y={390} centro size={44} />}
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
      <Chip t={t} t0={a} text="GENERAL THEODOSIUS" color={C.violeta} x={1460} y={180} centro size={54} />
      {t > r && <Chip t={t} t0={r} text="TOWN BY TOWN" color={C.rojo} x={1460} y={270} centro size={48} />}
      {t > d2 && <Chip t={t} t0={d2} text="SCOUTS: DISBANDED ✗" color="#2a2350" x={560} y={270} centro size={50} />}
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
        return <Picto key={i} x={M6 - 1200 + i * 260} y={TOP - 10 + k * 310} s={1.1} t={t} seed={200 + i} sube={cruza + i * 0.12} grita />;
      })}
      {t > fuego && t < T("rome called it", D) + 0.5 && [M6 - 300, M6 + 200, M6 + 600].map((x, i) => <React.Fragment key={i}>{[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: x - 70 + k * 50, top: TOP - 230 - Math.abs(Math.sin(t * 8 + k + i)) * 60, width: 90, height: 160, borderRadius: "50% 50% 30% 30%", background: k % 2 ? C.naranja : C.ambar, opacity: 0.9 }} />)}</React.Fragment>)}
      {t > T("and cut down a roman", D) - 0.3 && t < T("rome called it", D) + 0.5 && Array.from({ length: 7 }, (_, i) => <Soldadito key={i} x={M6 + 100 + i * 120} y={BASE} s={1.3} t={t} seed={210 + i} cae={T("and cut down a roman", D) + 0.6 + i * 0.12} />)}
      {/* los areani: salen al norte, vuelven con plata */}
      {t > T("rome had a group", D) - 0.3 && t < T("and you", 729) && [0, 1, 2].map((i) => {
        const x = M6 - 1200 + i * 260;
        const vende = t > traidor;
        return (
          <React.Fragment key={i}>
            <Persona x={x} y={TOP} h={220} t={t} seed={220 + i} ropa={{ ...CIVIL(i + 2), tunica: "#4a4a5a", tunica2: "#2a2a3a" }} expr={vende ? "orgullo" : "neutro"} flip={vende} mira={vende ? -0.8 : 0.4} bD={vende ? 110 : 10} cD={20} />
            {vende && <Moneda x={x - 130} y={TOP - 150 - Math.abs(Math.sin(t * 4 + i)) * 40} r={30} t={t} gira={2} />}
          </React.Fragment>
        );
      })}
      {/* vos en la torre, en la niebla */}
      {t > T("and you", 729) - 0.5 && t < 742 && <Persona x={TU6} y={TOP - 290} h={200} t={t} seed={3} ropa={TUNGRO} casco="legion" malla pantalon="#6b4a2f" capa="#3f6b2a" expr={t > T("would have been the very last", D) ? "miedo" : "neutro"} mira={0.3} />}
    </>
  );
};
export const N6: React.FC<{ t: number; c: Cam }> = ({ t, c }) => {
  const a = T("and the worst part", D), b = 742;
  if (t < a || t > b) return null;
  const bx = M6 * 0.62;
  return <>{Array.from({ length: 8 }, (_, i) => <Picto key={i} x={bx - 800 + i * 220} y={310 + (i % 2) * 30} s={0.65} t={t} seed={240 + i} sube={T("ammianus says they", D) + i * 0.1} />)}{t > T("in the fog", D) && [0, 1, 2, 3, 4].map((i) => <Ojos key={"o" + i} x={TU6 * 0.62 - 600 + i * 260} y={280} t={t} t0={T("in the fog", D) + i * 0.25} s={0.55} seed={i + 30} />)}</>;
};

export const S6: React.FC<{ t: number; c: Cam }> = ({ t, c }) => {
  if (t < 618 || t > 747) return null;
  return (
    <>
      <CartelTrampa t={t} t0={618.48} n={6} titulo="THE NORTH" color="#2a2350" />
      <Ch t={t} w="did not stay politely" d={D} txt="THEY DID NOT STAY ON THEIR SIDE" y={150} c={C.rojo} size={56} dur={3.6} />
      <Gr t={t} w="around the year 180" d={D} txt="AD 180" y={200} size={180} c={C.ambar} dur={1.55} />
      <Ch t={t} w="the historian cassius" d={D} txt="HISTORIAN CASSIUS DIO" y={150} c={C.violeta} size={56} dur={2.2} />
      <Ch t={t} w="crossed the wall" d={D} txt="CROSSED THE WALL" y={260} c={C.rojo} size={56} dur={1.6} />
      <Ch t={t} w="did a great deal" d={D} txt="GREAT DAMAGE" y={150} c={C.naranja} size={60} dur={1.4} />
      <Ch t={t} w="and cut down a roman" d={D} txt="A ROMAN GENERAL + HIS TROOPS · CUT DOWN" y={150} c={C.rojo} size={50} dur={3.1} />
      <Gr t={t} w="its greatest war" d={D} txt="ROME'S GREATEST WAR OF THE TIME" y={200} size={80} c={C.crema} dur={2.2} />
      <Plano t={t} t0={T("and the frontier", D)} t1={T("then", 655) - 0.15} desde={[960, 540]} fondo="#1b3a6a"><Frontera t={t} /></Plano>
      <Plano t={t} t0={T("then", 655)} t1={T("his last advice", D) - 0.15} desde={[960, 540]} fondo="#1b3a6a"><Severo t={t} /></Plano>
      <Plano t={t} t0={T("his last advice", D) - 0.05} t1={T("which", 685) - 0.1} desde={[960, 540]} fondo="#1b1240"><Consejo t={t} /></Plano>
      <Plano t={t} t0={T("if you are the soldier freezing", D) - 0.1} t1={T("and then came the worst", D) - 0.15} desde={[960, 700]} fondo="#5c6f8f"><Cienaga t={t} /></Plano>
      <Ch t={t} w="and then came the worst" d={D} txt="THE WORST YEAR OF ALL" y={150} c={C.rojo} size={64} dur={1.6} dt={0.45} />
      <Gr t={t} w="367" d={D} txt="AD 367" y={540} size={260} c={C.rojo} borde="#fff" dur={1.6} />
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
