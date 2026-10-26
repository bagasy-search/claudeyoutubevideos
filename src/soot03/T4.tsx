import React from "react";
import { Sala } from "./sets";
import { AbsoluteFill } from "remotion";
import { C, fontFamily, fontMano, ent, prog, Chip, Grande, Emote, cabeza, Zzz } from "./kit";
import { Papiro } from "./kit2";
import { Persona, CIVIL, CENTURION } from "./persona";
import { TOP, BASE, MC, K, Cam, Pal, Plano, CartelTrampa, pant } from "./mundo";
import { Gr, Cu, Ch, T, ck, TUNGRO, AUX, Guantes, Dado, Tablero, TablillaGrande, Carro, Jarro, gesto, Gesto } from "./kit3";

// TRAMPA 4 · EL ABURRIMIENTO (431,6-536,4 s). Mirar al norte: lomas, pasto, más pasto, una oveja (tal vez);
// el relevo; el cuartel de 8 en dos piecitas; la aduana de la puerta (¿quién? ¿qué? ¿peaje?); dados, tablero,
// guantes de box; la invitación de cumpleaños de Claudia Severa; y la oficina que no para de llenar partes.
const D = 431;
const M4 = MC(4);
const YO4 = M4 + 330;
const TU = 24000; // la torrecita (turret)
const FIESTA = M4 - 1600;

export const keys4: K[] = [
  [432.0, 19000, 560, 0.33], [433.9, YO4, 470, 1.5], ck("absolutely nothing", D, YO4, 470, 2.1), ck("you are posted", D, M4, 520, 1.0),
  ck("or worse", D, TU, 470, 0.9), ck("with just a handful", D, TU, 450, 1.3, 0.5), ck("your job is to stand", D, YO4, 470, 1.6, 0.5),
  ck("then you climb down", D, YO4, 560, 1.1), ck("and you go back", D, YO4 - 500, 640, 0.8), ck("there is a gate", D, M4, 760, 0.75),
  ck("who is crossing", D, M4 + 450, 700, 0.95), ck("many historians now", D, M4, 640, 0.5), ck("so the soldiers did", D, YO4, 760, 1.4),
  ck("at vindolanda", D, YO4, 760, 1.5), ck("and one letter", D, FIESTA, 720, 0.8), ck("a birthday party", D, FIESTA, 740, 1.0),
  ck("on the edge of the world", D, FIESTA, 640, 0.5), ck("because somebody had", D, FIESTA, 740, 1.2), ck("meanwhile", D, M4 - 300, 760, 0.9),
  ck("rome could not always", D, M4 - 250, 700, 1.15), ck("and that was the good part", D, M4 - 250, 700, 0.85), [536.3, 25500, 580, 0.42],
];
export const amb4: [number, Pal][] = [[432.0, "gris"], [447.6, "gris"], [495.0, "atardecer"], [513.0, "calido"], [518.1, "gris"]];
export const lluvia4: [number, number][] = [[432.0, 0.2], [447.6, 0.25], [463.0, 0.1], [478.4, 0.5], [480.0, 0.1], [495.0, 0], [518.0, 0.15], [536.3, 0.1]];

// lo que ves cuando mirás al norte
const Norte: React.FC<{ t: number }> = ({ t }) => {
  const ov = T("at a sheep", D);
  const z = 1 + 0.25 * prog(t, T("at hills", D), T("at a sheep", D) + 1.5);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#8b95aa,#c9d2de)" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "1300px 780px" }}>
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          <path d="M 0 600 Q 300 470 640 560 T 1300 520 T 1920 560 L 1920 1080 L 0 1080 Z" fill="#6d8a5a" />
          <path d="M 0 760 Q 400 680 900 740 T 1920 720 L 1920 1080 L 0 1080 Z" fill="#7fa05a" />
          {Array.from({ length: 60 }, (_, i) => <path key={i} d={`M ${(i * 131) % 1920} ${800 + ((i * 53) % 260)} l 6 -26 l 6 26`} stroke="#5a7a3a" strokeWidth={5} fill="none" />)}
        </svg>
        {t > ov && (
          <svg style={{ position: "absolute", left: 1220, top: 700, overflow: "visible", transform: `scale(${ent(t, ov)})`, transformOrigin: "80px 80px" }} width={160} height={120}>
            <ellipse cx={80} cy={60} rx={70} ry={42} fill="#f6f2ea" /><circle cx={30} cy={40} r={34} fill="#f6f2ea" /><circle cx={70} cy={30} r={34} fill="#f6f2ea" /><circle cx={115} cy={38} r={30} fill="#f6f2ea" />
            <ellipse cx={150} cy={52} rx={22} ry={18} fill="#2a2530" /><circle cx={156} cy={48} r={4} fill="#fff" />
            {[40, 70, 100, 125].map((x) => <rect key={x} x={x} y={90} width={10} height={30} fill="#2a2530" />)}
          </svg>
        )}
      </AbsoluteFill>
      {[["at hills", "HILLS", 380, C.violeta], ["at grass", "GRASS", 960, "#5a7a3a"], ["at more grass", "MORE GRASS", 1500, "#3f6b2a"]].map(([w, tx, x, col], i) => t > T(w as string, D) ? <Chip key={i} t={t} t0={T(w as string, D)} text={tx as string} color={col as string} x={x as number} y={170} centro size={64} /> : null)}
      {t > ov && <Grande t={t} t0={ov} text="A SHEEP." y={420} size={120} color="#fff" />}
      {t > T("possibly", D) && <Chip t={t} t0={T("possibly", D)} text="(POSSIBLY)" color="#2a2350" x={960} y={540} centro size={50} />}
      <Chip t={t} t0={T("and look north", D)} t1={T("at hills", D)} text="LOOK NORTH." color="#2a2350" x={960} y={170} centro size={70} />
    </AbsoluteFill>
  );
};
// cuartel: 8 hombres, 2 piecitas
const Cuartel8: React.FC<{ t: number }> = ({ t }) => {
  const a = T("where eight of you", D);
  return (
    <AbsoluteFill style={{ background: "#3a2418" }}>
      {[0, 1].map((r) => (
        <div key={r} style={{ position: "absolute", left: 200 + r * 780, top: 200, width: 740, height: 700, background: r ? "#7a5a3a" : "#8a6a4a", border: "16px solid #2a1a10" }}>
          {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 30, right: 30, top: 120 + k * 200, height: 30, background: "#5a3a22" }} />)}
        </div>
      ))}
      {Array.from({ length: 8 }, (_, i) => {
        const r = i < 4 ? 0 : 1, j = i % 4;
        return <Persona key={i} x={300 + r * 780 + j * 150} y={300 + Math.floor(j / 2) * 200 + 280 - (j % 2) * 30} h={200} t={t} seed={100 + i} ropa={i === 0 ? TUNGRO : AUX(i)} expr={i % 3 ? "triste" : "dormido"} aparece={a - 1.4 + i * 0.08} inclina={(j - 1.5) * 8} />;
      })}
      {[0, 3, 6].map((i) => <Zzz key={i} x={360 + (i < 4 ? 0 : 780) + (i % 4) * 150} y={340} t={t} />)}
      <Persona x={1900 - 500 * prog(t, a - 0.6, a + 1)} y={940} h={260} t={t} seed={27} ropa={AUX(4)} casco="legion" flip camina={t < a + 1 ? 1.4 : 0} {...gesto(t, [[a - 0.6, "tiembla"], [a + 1, "encoge"]])} />
      <Chip t={t} t0={a} text="8 MEN · 2 TINY ROOMS" color={C.rojo} x={960} y={110} centro size={70} />
    </AbsoluteFill>
  );
};
// dados, fichas, tablero
const Juegos: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill>
    <Sala t={t} tono="piedra" />
    <Tablero x={760} y={560} s={1.7} t={t} t0={T("at vindolanda", D)} />
    {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1220 + (i % 3) * 90, top: 420 + Math.floor(i / 3) * 90, width: 70, height: 70, borderRadius: "50%", background: i % 2 ? "#2a1530" : "#fff6e8", border: "6px solid #6a5a40", transform: `scale(${ent(t, T("and counters", D) + i * 0.06)})` }} />)}
    <Dado x={1300 + Math.sin(t * 9) * 10} y={760} s={1.3} t={t} t0={T("and dice", D)} n={6} rot={t * 140} />
    <Dado x={1500} y={760} s={1.3} t={t} t0={T("and dice", D) + 0.15} n={3} rot={-t * 110} />
    <Persona x={230} y={1060} h={440} t={t} seed={3} ropa={TUNGRO} casco="legion" malla {...gesto(t, [[T("archaeologists found gaming", D), "habla"], [T("and dice", D), "festeja"]])} />
    <Persona x={1760} y={1060} h={440} t={t} seed={25} ropa={AUX(2)} casco="legion" flip {...gesto(t, [[T("archaeologists found gaming", D), "lee"], [T("and dice", D), "enojado"]])} />
    <Chip t={t} t0={T("archaeologists found gaming", D)} text="GAMING BOARDS" color={C.violeta} x={760} y={200} centro size={60} />
    {t > T("and counters", D) && <Chip t={t} t0={T("and counters", D)} text="COUNTERS" color={C.teal} tinta={C.noche} x={1360} y={300} centro size={54} />}
    {t > T("and dice", D) && <Chip t={t} t0={T("and dice", D)} text="DICE" color={C.ambar} tinta={C.noche} x={1400} y={920} centro size={60} />}
  </AbsoluteFill>
);
// boxeo con los guantes más viejos del mundo romano
const Box: React.FC<{ t: number }> = ({ t }) => {
  const a = T("a pair of leather boxing", D);
  const golpe = Math.sin((t - a) * 7) > 0.6;
  const g = <g transform="scale(0.45)"><path d="M -50 -80 Q 40 -110 60 -20 Q 70 50 20 80 L -40 80 Q -70 0 -50 -80 Z" fill="#8a4a20" /></g>;
  return (
    <AbsoluteFill>
      <Sala t={t} tono="calido" />
      <Guantes x={960} y={300} s={1.1} t={t} t0={a} />
      <Persona x={700 + (golpe ? 40 : 0)} y={960} h={420} t={t} seed={3} ropa={TUNGRO} expr={golpe ? "enojado" : "orgullo"} bD={golpe ? 95 : 60} cD={golpe ? 10 : 110} bI={70} cI={110} manoD={g} manoI={g} />
      <Persona x={1240} y={960} h={420} t={t} seed={25} ropa={AUX(2)} flip expr={golpe ? "sorpresa" : "enojado"} bD={70} cD={110} bI={60} cI={110} manoD={g} manoI={g} inclina={golpe ? 10 : 0} />
      {golpe && <div style={{ position: "absolute", left: 1080, top: 520, fontFamily, fontWeight: 700, fontSize: 90, color: C.ambar, WebkitTextStroke: "10px #2a1530", paintOrder: "stroke fill", transform: "rotate(-12deg)" }}>POW!</div>}
      <Chip t={t} t0={T("the oldest ever found", D)} text="OLDEST IN THE ROMAN WORLD" color={C.violeta} x={960} y={110} centro size={60} />
    </AbsoluteFill>
  );
};
// la invitación de Claudia Severa
const Cumple: React.FC<{ t: number }> = ({ t }) => {
  const a = T("and one letter", D), h = T("it is one of the oldest surviving", D);
  return (
    <AbsoluteFill>
      <Sala t={t} tono="rosa" />
      {t > T("come to my birthday", D) && <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={200}>{Array.from({ length: 16 }, (_, i) => <path key={i} d={`M ${i * 124} ${40 + Math.sin(i * 0.8) * 6} l 62 ${20 + 6 * Math.sin(t * 3 + i)} l 62 -20 Z`} fill={[C.ambar, C.rosa, C.teal, C.lima][i % 4]} opacity={prog(t, T("come to my birthday", D) + i * 0.04, T("come to my birthday", D) + 0.3 + i * 0.04)} />)}<path d="M 0 40 Q 960 90 1920 40" stroke="#fff" strokeWidth={4} fill="none" /></svg>}
      {t > T("come to my birthday", D) && t < h && <svg style={{ position: "absolute", left: 760, top: 760, overflow: "visible", transform: `scale(${ent(t, T("come to my birthday", D) + 0.3)})`, transformOrigin: "120px 220px" }} width={240} height={220}><rect x={20} y={110} width={200} height={100} rx={14} fill="#f6d8e4" stroke="#8a2a5a" strokeWidth={6} /><rect x={50} y={50} width={140} height={70} rx={12} fill="#ffe9f1" stroke="#8a2a5a" strokeWidth={6} />{[80, 120, 160].map((x) => <g key={x}><rect x={x - 5} y={18} width={10} height={34} fill="#fff" /><ellipse cx={x} cy={8 + Math.sin(t * 12 + x) * 2} rx={7} ry={12} fill="#ffb020" /></g>)}</svg>}
      <Persona x={1810} y={1050} h={380} t={t} seed={78} mujer flip ropa={{ ...CIVIL(4), tunica: C.teal, tunica2: "#1c6a62", pelo: "#2a1a10" }} aparece={T("writes to her friend", D)} {...gesto(t, [[T("writes to her friend", D), "lee"], [T("come to my birthday", D) + 0.4, "festeja"], [h, "habla"]])} />
      <Persona x={230} y={1050} h={460} t={t} seed={77} mujer ropa={{ ...CIVIL(1), tunica: C.violeta, tunica2: "#3a1a7a", pelo: "#6b3a1f" }} {...gesto(t, [[a, "habla"], [T("writes to her friend", D), "escribe"], [T("come to my birthday", D), "festeja"], [h, "lee"]])} />
      <TablillaGrande t={t} t0={T("writes to her friend", D)} x={1030} y={450} w={1220} vel={34} titulo="CLAUDIA SEVERA → SULPICIA LEPIDINA"
        lineas={["“On the 11th of September, sister,", "for the day of my birthday,", "come to us… you will make the day", "more pleasant by your presence.”"]} />
      {t > h && <div style={{ position: "absolute", left: 480, right: 120, top: 890, height: 110, background: "#fff", borderRadius: 20, transform: `scale(${ent(t, h)}) rotate(-1.5deg)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontMano, fontWeight: 700, fontSize: 56, color: "#3a1a5a" }}>“Farewell, sister, my dearest soul.”</div>}
      <Chip t={t} t0={a} t1={T("writes to her friend", D)} text="A BIRTHDAY INVITATION" color={C.rosa} x={1100} y={460} centro size={80} />
      <Chip t={t} t0={T("a woman named", D)} t1={T("writes to her friend", D) + 0.2} text="CLAUDIA SEVERA · A COMMANDER'S WIFE" color={C.violeta} x={1100} y={600} centro size={52} />
      {t > h && <Chip t={t} t0={h + 0.3} text="A WOMAN'S OWN HANDWRITING · LATIN" color={C.ambar} tinta={C.noche} x={1100} y={130} centro size={54} />}
    </AbsoluteFill>
  );
};
// la oficina que no para
const Partes: React.FC<{ t: number }> = ({ t }) => {
  const it: [string, string][] = [["strength reports", "STRENGTH REPORT"], ["duty reports", "DUTY REPORT"], ["lists of who was sent", "→ THE BATHHOUSE"], ["who was sent to the workshops", "→ THE WORKSHOPS"], ["who was sent to collect", "→ COLLECT CLAY"]];
  return (
    <AbsoluteFill>
      <Sala t={t} tono="violeta" />
      {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: 120 + (i % 2) * 60, top: 900 - i * 34 - (1 - ent(t, T("the officers file", D) + i * 0.08)) * 600, width: 380, height: 40, background: i % 2 ? "#c9a46a" : "#d8b87a", border: "4px solid #8a6a3a", borderRadius: 6 }} />)}
      {Array.from({ length: 14 }, (_, i) => <div key={"b" + i} style={{ position: "absolute", left: 1420 + (i % 2) * 40, top: 900 - i * 34 - (1 - ent(t, T("duty reports", D) + i * 0.08)) * 600, width: 380, height: 40, background: i % 2 ? "#c9a46a" : "#d8b87a", border: "4px solid #8a6a3a", borderRadius: 6 }} />)}
      <Persona x={1640} y={1060} h={400} t={t} seed={91} ropa={CENTURION} casco="centurion" {...gesto(t, [[T("the officers file", D), "escribe"], [T("duty reports", D), "golpea"], [T("who was sent to the workshops", D), "escribe"], [T("who was sent to collect", D), "señala"]])} />
      <Cu t={t} w="the officers file" d={D} de={12} a={37} sube={6} dur={9} x={960} y={120} size={70} pre="REPORTS TODAY: " color="#fff" />
      <Papiro t={t} x={900} y={580} w={820} t0={T("the officers file", D) + 0.2} tacha={false} titulo="TODAY · CENTURY OF FLAVIUS" items={it.map(([w, tx]) => ({ txt: tx, t0: T(w, D), monto: "✓" }))} />
    </AbsoluteFill>
  );
};

export const W4: React.FC<{ t: number; c: Cam }> = ({ t }) => {
  if (t < 431 || t > 537) return null;
  const abajo = t > T("then you climb down", D) + 0.6;
  const aduana = t > T("there is a gate", D) - 0.5 && t < T("so the soldiers did", D);
  const fiesta = t > T("and one letter", D) - 1 && t < T("meanwhile", D) + 0.5;
  return (
    <>
      {/* vos, de guardia arriba (y bajando) */}
      {!aduana && (t < T("and one letter", D) || t > T("rome could not always", D) - 0.3) && <Persona x={YO4} y={abajo ? BASE : TOP + (t > T("then you climb down", D) ? 300 * prog(t, T("then you climb down", D), T("then you climb down", D) + 0.6) : 0)} h={230} t={t} seed={3} ropa={TUNGRO} casco="legion" malla pantalon="#6b4a2f" capa="#3f6b2a"
        {...gesto(t, [[432, "encoge"], [T("absolutely nothing", D), "duerme"], [T("you are posted", D), "triste"], [T("your job is to stand", D), "habla"], [T("in the wind", D), "tiembla"], [T("then you climb down", D), "encoge"], [T("so the soldiers did", D), "duerme"], [T("they invented ways", D), "festeja"], [T("rome could not always", D) - 0.3, "tiembla"], [T("it could always keep", D), "lee"], [T("and that was the good part", D), "festeja"]])} />}
      {t > T("someone else climbs up", D) && t < T("there is a gate", D) && <Persona x={YO4 + 250} y={TOP} h={230} t={t} seed={27} ropa={AUX(4)} casco="legion" expr="triste" aparece={T("someone else climbs up", D)} />}
      {/* la guarnición del milecastle */}
      {t > T("you are posted", D) && t < T("or worse", D) + 0.4 && Array.from({ length: 14 }, (_, i) => <Persona key={i} x={M4 - 640 + i * 98} y={TOP - 120} h={170} t={t} seed={110 + i} ropa={AUX(i)} casco="legion" aparece={T("you are posted", D) + 0.6 + i * 0.07} {...gesto(t, [[T("you are posted", D), ["habla", "duerme", "encoge", "triste"][i % 4] as Gesto]])} />)}
      {/* la torrecita con su puñadito */}
      {t > T("or worse", D) && t < T("your job is to stand", D) + 0.4 && [0, 1, 2].map((i) => <Persona key={i} x={TU - 100 + i * 100} y={TOP - 290} h={140} t={t} seed={120 + i} ropa={AUX(i + 3)} casco="legion" aparece={T("or worse", D) + i * 0.15} expr="triste" />)}
      {/* la aduana: fila de viajeros en la puerta */}
      {aduana && (
        <>
          <Persona x={M4 + 280} y={BASE} h={240} t={t} seed={3} ropa={TUNGRO} casco="legion" malla pantalon="#6b4a2f" capa="#3f6b2a" {...gesto(t, [[T("there is a gate", D), "escribe"], [T("who is crossing", D), "habla"], [T("what are they carrying", D), "señala"], [T("are they paying the toll", D), "golpea"], [T("many historians now", D), "escribe"], [T("more like a border", D), "triste"]])} manoD={<rect x={-60} y={-80} width={120} height={80} rx={6} fill="#c9a46a" stroke="#8a6a3a" strokeWidth={5} />} />
          <div style={{ position: "absolute", left: M4 + 120, top: BASE - 120, width: 320, height: 120, background: "#8a5a2a", borderRadius: 8 }} />
          {[0, 1, 2, 3].map((i) => <Persona key={i} x={M4 + 700 + i * 260} y={BASE} h={220} t={t} seed={130 + i} ropa={CIVIL(i)} flip {...gesto(t, [[T("there is a gate", D), i === 0 ? "habla" : "encoge"], [T("are they paying the toll", D), i === 0 ? "niega" : "triste"], [T("many historians now", D), i % 2 ? "tiembla" : "habla"]])} manoD={i % 2 ? <g transform="translate(0 -20) scale(0.45)"><path d="M -60 -40 Q -90 70 0 76 Q 90 70 60 -40 Z" fill="#a8783a" /></g> : undefined} />)}
          <Carro x={M4 + 1900} y={BASE - 120} s={0.8} t={0} carga="barril" />
        </>
      )}
      {/* la fiesta de cumpleaños al pie del muro */}
      {fiesta && (
        <>
          <svg style={{ position: "absolute", left: FIESTA - 900, top: BASE - 420, overflow: "visible" }} width={1} height={1}>
            <path d="M 0 0 Q 450 140 900 0 Q 1350 140 1800 0" stroke="#3f8a3a" strokeWidth={14} fill="none" />
            {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={60 + i * 110} cy={60 + Math.sin((i / 8) * Math.PI) * 50} r={18} fill={[C.rosa, C.ambar, C.lima, C.teal][i % 4]} />)}
          </svg>
          <div style={{ position: "absolute", left: FIESTA - 500, top: BASE - 130, width: 1000, height: 40, background: "#8a5a2a", borderRadius: 10 }} />
          <Jarro x={FIESTA - 300} y={BASE - 200} s={0.5} /><Jarro x={FIESTA + 260} y={BASE - 200} s={0.5} />
          {[0, 1, 2, 3, 4].map((i) => <Persona key={i} x={FIESTA - 640 + i * 320} y={BASE} h={i === 2 ? 250 : 230} t={t} seed={140 + i} ropa={i === 2 ? { ...CIVIL(1), tunica: C.rosa, tunica2: "#c94a6a" } : i === 1 ? { ...CIVIL(2), tunica: C.violeta, tunica2: "#3a1a7a" } : i === 4 ? TUNGRO : AUX(i)} casco={i === 4 ? "legion" : "no"}
            expr="feliz" habla={i === 2} bD={i === 2 ? 150 : 40 + Math.sin(t * 4 + i) * 30} salta={Math.abs(Math.sin(t * 5 + i)) * 14} />)}
        </>
      )}
      {/* el centurión con su pila de partes */}
      {t > T("meanwhile", D) - 0.4 && t < T("rome could not always", D) + 1 && <Persona x={M4 - 300} y={BASE} h={250} t={t} seed={91} ropa={CENTURION} casco="centurion" {...gesto(t, [[T("meanwhile", D) - 0.4, "carga"], [T("rome could not always", D), "tiembla"], [T("but it could always", D), "festeja"]])} manoD={<rect x={-60} y={-200} width={120} height={200} rx={6} fill="#c9a46a" stroke="#8a6a3a" strokeWidth={5} />} />}
    </>
  );
};

export const S4: React.FC<{ t: number; c: Cam }> = ({ t, c }) => {
  if (t < 431 || t > 537) return null;
  const yo = pant(YO4, cabeza(YO4, TOP, 230).y, c);
  return (
    <>
      <CartelTrampa t={t} t0={431.64} n={4} titulo="THE BOREDOM" color={C.violeta} />
      <Gr t={t} w="nothing happens" d={D} txt="NOTHING HAPPENS." y={200} size={130} c={C.crema} dur={1.3} />
      <Gr t={t} w="absolutely nothing" d={D} txt="ABSOLUTELY NOTHING." y={880} size={100} c="#9aa4b4" dur={1.3} />
      {t > T("absolutely nothing", D) && t < T("you are posted", D) && <div style={{ position: "absolute", left: yo[0] + 120 + Math.sin(t * 13) * 60, top: yo[1] - 60 + Math.cos(t * 9) * 40, width: 16, height: 12, borderRadius: "50%", background: "#1a1020" }} />}
      <Cu t={t} w="somewhere between eight" d={D} de={8} a={30} sube={1.4} dur={2.6} y={190} size={130} pre="8 → " suf=" MEN" color="#fff" />
      <Ch t={t} w="or worse" d={D} txt="OR WORSE…" y={150} c={C.rojo} size={64} dur={1.1} />
      <Ch t={t} w="the turrets" d={D} txt="THE TURRET" y={150} c={C.violeta} size={70} dur={1.0} />
      <Ch t={t} w="with just a handful" d={D} txt="JUST A HANDFUL" y={260} c="#2a2350" size={56} dur={0.9} />
      <Ch t={t} w="your job is to stand" d={D} txt="YOUR JOB: STAND HERE" y={150} c={C.teal} tinta={C.noche} size={62} dur={1.6} />
      <Ch t={t} w="in the wind" d={D} txt="IN THE WIND" y={260} c="#3d7fc9" size={50} dur={0.8} />
      <Plano t={t} t0={T("and look north", D) - 0.1} t1={T("then you climb down", D) - 0.15} desde={[yo[0], yo[1]]} fondo="#8b95aa"><Norte t={t} /></Plano>
      <Ch t={t} w="then you climb down" d={D} txt="CLIMB DOWN" x={560} y={150} c={C.violeta} size={56} dur={1.6} />
      <Ch t={t} w="someone else climbs up" d={D} txt="SOMEONE ELSE CLIMBS UP" x={1300} y={150} c={C.ambar} tinta={C.noche} size={56} dur={1.6} />
      <Plano t={t} t0={T("and you go back", D)} t1={T("there is a gate", D) - 0.15} desde={[960, 700]} fondo="#3a2418"><Cuartel8 t={t} /></Plano>
      <Ch t={t} w="there is a gate" d={D} txt="A GATE IN EVERY MILECASTLE" y={150} c={C.violeta} size={60} dur={1.6} />
      <Ch t={t} w="so a lot of your day" d={D} txt="NOT FIGHTING…" y={150} c={C.rojo} size={60} dur={2.2} />
      <Gr t={t} w="it is paperwork" d={D} txt="PAPERWORK." y={200} size={150} c={C.crema} dur={1.2} />
      {[["who is crossing", "WHO?", 500], ["what are they carrying", "WHAT?", 960], ["are they paying the toll", "TOLL?", 1420]].map(([w, tx, x], i) => <Ch key={i} t={t} w={w as string} d={D} txt={tx as string} x={x as number} y={170} c={[C.teal, C.ambar, C.rojo][i]} tinta={i < 2 ? C.noche : "#fff"} size={80} dur={3.6 - i * 1.1} />)}
      <Ch t={t} w="many historians now" d={D} txt="A CUSTOMS BARRIER" x={560} y={160} c={C.teal} tinta={C.noche} size={58} dur={3.7} />
      <Ch t={t} w="as a battle" d={D} txt="AS MUCH AS A BATTLE LINE" x={1340} y={160} c={C.rojo} size={52} dur={1.0} />
      <Ch t={t} w="less like a castle" d={D} txt="LESS LIKE A CASTLE" y={150} c="#2a2350" size={58} dur={1.2} />
      <Gr t={t} w="more like a border" d={D} txt="A BORDER CROSSING… IN THE RAIN" y={200} size={84} c={C.ambar} dur={1.7} />
      <Ch t={t} w="so the soldiers did" d={D} txt="WHAT BORED PEOPLE ALWAYS DO" y={150} c={C.violeta} size={56} dur={2.9} />
      {t > T("so the soldiers did", D) + 0.5 && t < T("at vindolanda", D) && <Zzz x={yo[0] + 40} y={yo[1] - 40} t={t} />}
      <Gr t={t} w="they invented ways" d={D} txt="INVENT WAYS TO PASS THE TIME" y={200} size={74} c={C.lima} dur={2.3} />
      <Plano t={t} t0={T("at vindolanda", D) - 0.1} t1={T("they found a pair", D) - 0.15} desde={[yo[0], yo[1]]} fondo="#6b4a2f"><Juegos t={t} /></Plano>
      <Plano t={t} t0={T("they found a pair", D) - 0.05} t1={T("and one letter", D) - 0.15} desde={[960, 600]} fondo="#8a2a3a"><Box t={t} /></Plano>
      <Plano t={t} t0={T("and one letter", D)} t1={T("a birthday party", D) - 0.15} desde={[960, 600]} fondo="#8a2a5a"><Cumple t={t} /></Plano>
      <Gr t={t} w="a birthday party" d={D} txt="A BIRTHDAY PARTY." y={200} size={130} c={C.rosa} dur={1.6} />
      <Gr t={t} w="on the edge of the world" d={D} txt="…ON THE EDGE OF THE WORLD" y={880} size={84} c={C.crema} dur={1.4} />
      <Ch t={t} w="because somebody had" d={D} txt="SOMEBODY HAD TO MAKE IT FEEL LIKE HOME" y={150} c={C.violeta} size={52} dur={1.8} />
      <Plano t={t} t0={T("the officers file", D) - 0.2} t1={T("rome could not always", D) - 0.15} desde={[960, 700]} fondo="#1b1240"><Partes t={t} /></Plano>
      <Ch t={t} w="rome could not always" d={D} txt="WARM ✗" x={620} y={170} c="#3d7fc9" size={80} dur={3.9} />
      <Ch t={t} w="but it could always" d={D} txt="ORGANIZED ✓" x={1300} y={170} c={C.teal} tinta={C.noche} size={80} dur={1.9} />
      <Ch t={t} w="and that was the good part" d={D} txt="THAT WAS THE GOOD PART…" y={150} c={C.ambar} tinta={C.noche} size={56} dur={2.5} />
      <Gr t={t} w="meet the neighbors" d={D} txt="MEET THE NEIGHBORS." y={880} size={100} c={C.rojo} borde="#fff" dur={1.6} />
    </>
  );
};
