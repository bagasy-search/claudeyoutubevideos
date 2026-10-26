import React from "react";
import { Sala } from "./sets";
import { Exterior } from "./escenas4";
import { Aduana } from "./escenas5";
import { AbsoluteFill } from "remotion";
import { C, fontFamily, fontMano, ent, prog, Chip, Grande, Emote, cabeza, Zzz } from "./kit";
import { Papiro } from "./kit2";
import { Persona, CIVIL, CENTURION } from "./persona";
import { TOP, BASE, MC, K, Cam, Pal, Plano, CartelTrampa, pant } from "./mundo";
import { Gr, Cu, Ch, T, ck, TUNGRO, AUX, Guantes, Dado, Tablero, TablillaGrande, Carro, Jarro, gesto, Gesto, Termometro } from "./kit3";

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

// lo que ves cuando mirás al norte (reemplazado por MiraNorte en la vuelta 4)
export const Norte: React.FC<{ t: number }> = ({ t }) => {
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
      <Papiro t={t} x={900} y={580} w={820} t0={T("the officers file", D) + 0.2} tacha={false} titulo="TODAY · CENTURY OF FLAVIUS" items={[{ txt: "CENTURY OF FLAVIUS · 80 MEN", t0: T("the officers file", D) + 0.5, monto: "✓" }, { txt: "PRESENT AND FIT: 74", t0: T("the officers file", D) + 1.0, monto: "✓" }, ...it.map(([w, tx]) => ({ txt: tx, t0: T(w, D), monto: "✓" }))]} />
    </AbsoluteFill>
  );
};

// ═══════════ VUELTA 7 (t3t4): escenas re-animadas en plano medio ═══════════
const cl = (v: number) => Math.max(0, Math.min(1, v));
const OvejaT4: React.FC<{ x: number; y: number; s?: number; t: number; anda?: boolean; flip?: boolean; come?: boolean }> = ({ x, y, s = 1, t, anda, flip, come }) => {
  const p = anda ? Math.sin(t * 9) * 14 : 0;
  const cab = come ? -60 + Math.abs(Math.sin(t * 2.2)) * 40 : -92 + Math.sin(t * 3) * 4;
  return (
    <svg style={{ position: "absolute", left: x - 160 * s, top: y - 170 * s, overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }} width={320 * s} height={200 * s} viewBox="-160 -170 320 200">
      <ellipse cx={0} cy={22} rx={120} ry={12} fill="#000" opacity={0.18} />
      {[-60, -30, 30, 60].map((xx, i) => <rect key={i} x={xx - 8} y={-40} width={16} height={60} rx={6} fill="#2a2a2a" transform={`rotate(${(i % 2 ? 1 : -1) * p} ${xx} -40)`} />)}
      {[[-60, -80], [-20, -100], [25, -95], [60, -75], [-40, -55], [10, -60], [50, -50]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={42} fill="#f4f1ea" stroke="#d6d0c4" strokeWidth={4} />)}
      <ellipse cx={108} cy={cab} rx={32} ry={40} fill="#2a2a2a" />
      <ellipse cx={92} cy={cab - 28} rx={18} ry={9} fill="#2a2a2a" transform={`rotate(-30 92 ${cab - 28})`} />
      <circle cx={118} cy={cab - 8} r={6} fill="#fff" /><circle cx={120} cy={cab - 8} r={3} fill="#000" />
    </svg>
  );
};
const Almena: React.FC = () => (
  <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
    <rect x={-20} y={930} width={820} height={170} fill="#b9ad98" stroke="#6a5e4a" strokeWidth={6} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={i * 200} y={880} width={120} height={60} rx={6} fill="#b9ad98" stroke="#6a5e4a" strokeWidth={6} />)}
    <rect x={-20} y={930} width={820} height={18} fill="#d8ccb6" />
  </svg>
);
// 7:30 · arriba del muro al viento: lomas, pasto, más pasto… y la oveja, que ya pastaba lejos, se le acerca; él la mira
const MiraNorte4: React.FC<{ t: number; t0: number; tViento: number; tNorte: number; tLomas: number; tPasto: number; tMas: number; tOveja: number }> = ({ t, t0, tViento, tNorte, tLomas, tPasto, tMas, tOveja }) => {
  const k = prog(t, tOveja - 0.4, tOveja + 1.3);
  const ox = 1560 - 330 * k + 40 * Math.sin(t * 0.3), oy = 690 + 170 * k, os = 0.42 + 0.7 * k;
  const G = gesto(t, [[t0, "habla"], [tViento, "tiembla"], [tNorte, "señala"], [tPasto, "encoge"], [tMas, "triste"], [tOveja, "sorpresa"], [tOveja + 0.8, "señala"]]);
  const mira = t > tOveja ? 1 : t > tNorte ? 0.9 : 0;
  const gorro = t > tViento && t < tNorte;
  return (
    <Exterior t={t} tono="gris" viento={t > tViento ? 2.6 : 1.4}>
      <OvejaT4 x={ox} y={oy} s={os} t={t} anda={t > tOveja - 0.4 && t < tOveja + 1.3} flip come={t < tOveja - 0.4 || t > tOveja + 1.6} />
      <Almena />
      <Persona x={380} y={935} h={560} t={t} seed={3} ropa={TUNGRO} casco="legion" malla pantalon="#6b4a2f" capa="#3f6b2a" {...G} mira={mira} miraY={t > tOveja ? 0.3 : 0}
        bI={gorro ? 165 : G.bI} cI={gorro ? 150 : G.cI} />
      {[0, 1, 2].map((i) => { const q = ((t * 0.7 + i / 3) % 1); return <div key={i} style={{ position: "absolute", left: 470 + q * 120, top: 470 - q * 50, width: 40 + q * 60, height: 26 + q * 34, borderRadius: "50%", background: "#fff", opacity: 0.45 * (1 - q) }} />; })}
      {t > tViento && t < tNorte + 1 && <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>{Array.from({ length: 7 }, (_, i) => { const q = ((t * 1.6 + i / 7) % 1); return <path key={i} d={`M ${1920 - q * 2200} ${260 + i * 80} q 60 -20 120 0 t 120 0`} stroke="#fff" strokeWidth={6} fill="none" opacity={0.5 * Math.sin(q * Math.PI)} strokeLinecap="round" />; })}</svg>}
      {t > tLomas && <Chip t={t} t0={tLomas} text="HILLS" color="#5a6e8a" x={1000} y={420} centro size={58} />}
      {t > tPasto && <Chip t={t} t0={tPasto} text="GRASS" color="#3f7a2a" x={1640} y={420} centro size={58} />}
      {t > tMas && <Chip t={t} t0={tMas} text="MORE GRASS" color="#2f5a20" x={1640} y={980} centro size={58} />}
      {t > tOveja && <Chip t={t} t0={tOveja} text="A SHEEP. POSSIBLY." color={C.ambar} tinta={C.noche} x={1150} y={560} centro size={62} />}
    </Exterior>
  );
};

// 7:40 · el cuartel: dos literas con lámpara y haz de luz, 8 dormidos, él entra y no hay lugar; uno se da vuelta y se tapa la cabeza
const Durmiente: React.FC<{ t: number; x: number; y: number; h: number; seed: number; i: number; tapa?: number }> = ({ t, x, y, h, seed, i, tapa }) => {
  const S = h / 560;
  const tp = tapa === undefined ? 0 : cl((t - tapa) / 0.5);
  const rueda = tapa === undefined ? 0 : Math.sin(cl((t - tapa) / 0.6) * Math.PI) * 14;
  const hx = x - 470 * S; // cabeza
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `rotate(${-90 + rueda}deg)`, transformOrigin: `${x}px ${y}px` }}>
        <Persona x={x} y={y} h={h} t={t} seed={seed} ropa={i === 0 ? TUNGRO : AUX(i)} expr={tp > 0.5 ? "enojado" : "dormido"} />
      </div>
      {/* manta: tapa del pecho para abajo; al taparse sube hasta la coronilla */}
      <div style={{ position: "absolute", left: hx + 120 * S - tp * 190 * S, top: y - 130 * S - tp * 20 * S, width: x - hx - 80 * S + tp * 190 * S, height: 230 * S + tp * 40 * S, borderRadius: 30 * S, background: ["#7a3a4a", "#3a5a7a", "#6a5a2a", "#4a6a3a"][i % 4], border: `${6 * S}px solid rgba(0,0,0,.3)`, transform: `rotate(${rueda * 0.3}deg)` }} />
      <div style={{ position: "absolute", left: hx - 80 * S, top: y + 70 * S, width: 120 * S, height: 50 * S, borderRadius: 20 * S, background: "#e8dcc6" }} />
    </>
  );
};
const Cuartel8b: React.FC<{ t: number }> = ({ t }) => {
  const a = T("and you go back", D), b = T("where eight of you", D), c = T("two tiny rooms", D);
  const lit = (x0: number) => (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
      <rect x={x0} y={300} width={22} height={720} fill="#4a2a17" /><rect x={x0 + 678} y={300} width={22} height={720} fill="#4a2a17" />
      {[560, 930].map((y) => <g key={y}><rect x={x0} y={y} width={700} height={36} rx={6} fill="#6b4a2f" /><rect x={x0 + 10} y={y - 18} width={680} height={22} rx={8} fill="#c9b48a" /></g>)}
    </svg>
  );
  const camas: [number, number][] = [[470, 520], [820, 520], [470, 890], [820, 890], [1430, 520], [1780, 520], [1430, 890], [1780, 890]];
  const S8 = 290 / 560;
  return (
    <AbsoluteFill>
      <Sala t={t} tono="noche" ventana="izq" estante={false} lampara={false} />
      {/* tabique entre las dos piecitas */}
      <div style={{ position: "absolute", left: 930, top: 0, width: 60, height: 840, background: "#241f48", boxShadow: "inset -10px 0 0 rgba(0,0,0,.25)" }} />
      {lit(120)}{lit(1100)}
      {camas.map(([x, y], i) => <Durmiente key={i} t={t} x={x} y={y - 18 - 100 * S8} h={290} seed={100 + i} i={i} tapa={i === 2 ? c : undefined} />)}
      {/* lámpara colgada con su cono de luz */}
      <div style={{ position: "absolute", left: 960 - 520, top: 170, width: 1040, height: 910, background: "radial-gradient(ellipse at 50% 0%, rgba(255,214,140,.38), rgba(255,200,120,.12) 45%, rgba(255,200,120,0) 75%)", clipPath: "polygon(46% 0, 54% 0, 100% 100%, 0 100%)", transform: `scale(${1 + 0.03 * Math.sin(t * 13)})`, transformOrigin: "50% 0%" }} />
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <line x1={960} y1={0} x2={960} y2={140} stroke="#2a1a10" strokeWidth={6} />
        <path d="M 920 140 L 1000 140 L 984 180 L 936 180 Z" fill="#a8783a" stroke="#5a3418" strokeWidth={5} />
        <ellipse cx={960} cy={192 - 4 * Math.sin(t * 17)} rx={10} ry={20 + 3 * Math.sin(t * 17)} fill="#ffcf5a" />
        <circle cx={960} cy={190} r={60 + 4 * Math.sin(t * 13)} fill="#ffd27a" opacity={0.25} />
      </svg>
      <Zzz x={300} y={420} t={t} /><Zzz x={1640} y={420} t={t + 1} /><Zzz x={1640} y={790} t={t + 0.5} />
      {/* él entra, busca lugar, no hay */}
      <Persona x={1300 - 340 * prog(t, a, a + 1.2)} y={1050} h={520} t={t} seed={27} ropa={TUNGRO} casco="legion" malla pantalon="#6b4a2f" capa="#3f6b2a" camina={t < a + 1.2 ? 1.3 : 0} flip={t < a + 1.2}
        {...gesto(t, [[a, "camina"], [b, "encoge"], [c, "sorpresa"], [c + 0.6, "triste"]])} mira={t > b && t < c ? Math.sin(t * 3) * 0.9 : t > c ? -0.8 : 0} />
      {camas.map(([x, y], i) => { const t0 = b + 0.1 + i * 0.16; return t > t0 ? <div key={"n" + i} style={{ position: "absolute", left: x - 470 * S8 - 26, top: y - 18 - 100 * S8 - 150, width: 52, height: 52, borderRadius: 26, background: C.ambar, border: "4px solid #2a1530", fontFamily, fontWeight: 700, fontSize: 32, color: C.noche, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${ent(t, t0)})` }}>{i + 1}</div> : null; })}
      <Chip t={t} t0={b} text="8 MEN · 2 TINY ROOMS" color={C.rojo} x={960} y={100} centro size={64} />
    </AbsoluteFill>
  );
};

// 8:08 · uno agita el cubilete y tira los dados; caen 6-6 y el otro festeja
const Juegos2: React.FC<{ t: number }> = ({ t }) => {
  const a = T("at vindolanda", D), gb = T("gaming boards", D), co = T("and counters", D), di = T("and dice", D);
  const agita = di - 1.1, tira = di - 0.35, cae = di + 0.15;
  const cub = <g transform="rotate(170) scale(0.6)"><path d="M -40 -60 L 40 -60 L 30 60 L -30 60 Z" fill="#8a5a2a" stroke="#4a2a14" strokeWidth={6} /></g>;
  const tiro = (i: number) => {
    const u = cl((t - tira) / (cae - tira));
    const x0 = 650, y0 = 540, x1 = 930 + i * 130, y1 = 930;
    const bote = t > cae ? -Math.abs(Math.sin((t - cae) * 16)) * Math.exp(-(t - cae) * 7) * 30 : 0;
    return { x: x0 + (x1 - x0) * u, y: y0 + (y1 - y0) * u - Math.sin(u * Math.PI) * 220 + bote, r: t < cae ? u * 720 + i * 40 : i * 8 };
  };
  const mueve = prog(t, a + 0.6, a + 1.4);
  return (
    <AbsoluteFill>
      <Sala t={t} tono="piedra" ventana="der" />
      <Persona x={560} y={1070} h={560} t={t} seed={3} ropa={TUNGRO} casco="legion" malla
        {...gesto(t, [[a, "habla"], [a + 0.5, "lee"], [agita, "golpea"], [tira, "señala"], [cae + 0.1, "sorpresa"]])}
        bD={t > a + 0.5 && t < agita ? 55 + 10 * mueve : t > agita && t < tira ? 140 + Math.sin(t * 34) * 18 : t > tira && t < cae ? 70 : undefined}
        cD={t > a + 0.5 && t < agita ? 40 : t > agita && t < tira ? 60 : undefined}
        manoD={t > agita && t < tira + 0.15 ? cub : undefined} mira={0.6} />
      <Persona x={1380} y={1070} h={540} t={t} seed={25} ropa={AUX(2)} casco="legion" flip
        {...gesto(t, [[a, "lee"], [gb, "habla"], [agita, "encoge"], [cae + 0.05, "festeja"]])} mira={t < cae ? 0.7 : 0} />
      {/* mesa con el tablero acostado */}
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <rect x={280} y={872} width={1360} height={240} rx={10} fill="#7a4a22" />
        <rect x={280} y={860} width={1360} height={30} rx={10} fill="#a8703a" />
      </svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "scaleY(0.5)", transformOrigin: "960px 760px" }}>
        <Tablero x={760} y={1170} s={1.5} t={t} t0={a - 0.2} />
        {/* la ficha que mueve */}
        <div style={{ position: "absolute", left: 600 + 80 * mueve - 26, top: 1110 - 26, width: 52, height: 52, borderRadius: 26, background: "#fff6e8", border: "6px solid #6a5a40" }} />
      </div>
      {t > co && Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1180 + (i % 3) * 58, top: 850 - Math.floor(i / 3) * 14, width: 54, height: 26, borderRadius: "50%", background: i % 2 ? "#2a1530" : "#fff6e8", border: "5px solid #6a5a40", transform: `translateY(${(1 - cl(ent(t, co + i * 0.06))) * -200}px)` }} />)}
      {t > tira && [0, 1].map((i) => { const p = tiro(i); return <Dado key={i} x={p.x} y={p.y} s={0.75} rot={p.r} n={t > cae ? 6 : 1 + ((Math.floor(t * 20) + i * 3) % 6)} />; })}
      {t > cae && <div style={{ position: "absolute", left: 960 - 120, top: 640, width: 240, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 70, color: C.ambar, WebkitTextStroke: "10px #2a1530", paintOrder: "stroke fill", transform: `scale(${ent(t, cae)}) rotate(-6deg)` }}>6 + 6!</div>}
      <Chip t={t} t0={gb} text="GAMING BOARDS" color={C.violeta} x={480} y={110} centro size={54} />
      {t > co && <Chip t={t} t0={co} text="COUNTERS" color={C.teal} tinta={C.noche} x={960} y={110} centro size={54} />}
      {t > di && <Chip t={t} t0={di} text="DICE" color={C.ambar} tinta={C.noche} x={1380} y={110} centro size={54} />}
    </AbsoluteFill>
  );
};

// 8:18-8:28 · Claudia sostiene la tablilla, escribe, la SELLA y se la manda; la hermana la agarra, la lee y sonríe
const Cumple2: React.FC<{ t: number }> = ({ t }) => {
  const a = T("and one letter", D), w = T("writes to her friend", D), se = T("on the 11th of", D) + 0.9, cb = T("come to my birthday", D), pl = T("you will make the day", D), h = T("it is one of the oldest surviving", D);
  const vuela = cl((t - (cb + 0.2)) / 0.7);
  const tab = (s: number) => <g transform={`scale(${s})`}><rect x={-60} y={-40} width={120} height={80} rx={6} fill="#d9b878" stroke="#8a6a3a" strokeWidth={5} />{[0, 1, 2].map((j) => <rect key={j} x={-46} y={-26 + j * 18} width={80} height={6} rx={3} fill="#4a2a14" />)}{t > se && <circle cx={34} cy={22} r={16} fill={C.rojo} stroke="#7a1020" strokeWidth={4} />}</g>;
  const sello = <g><rect x={-14} y={0} width={28} height={50} rx={6} fill="#6b3a1f" /><rect x={-26} y={46} width={52} height={20} rx={4} fill="#a8783a" /></g>;
  const SX = 330, SY = 1050;
  const G = gesto(t, [[a, "habla"], [w, "escribe"], [se - 0.4, "golpea"], [se + 0.4, "habla"], [cb + 0.2, "señala"], [cb + 1.2, "festeja"], [h, "lee"]]);
  // tablilla que viaja de la mano de Claudia a la hermana
  const fx = 520 + (1560 - 520) * vuela, fy = 720 + (760 - 720) * vuela - Math.sin(vuela * Math.PI) * 260;
  const tiene = t > cb + 0.9;
  const G2 = gesto(t, [[w, "habla"], [cb + 0.2, "sorpresa"], [cb + 0.9, "lee"], [pl, "festeja"], [h, "habla"]]);
  return (
    <AbsoluteFill>
      <Sala t={t} tono="rosa" ventana="der" />
      {t > cb && <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={200}>{Array.from({ length: 16 }, (_, i) => <path key={i} d={`M ${i * 124} ${40 + Math.sin(i * 0.8) * 6} l 62 ${20 + 6 * Math.sin(t * 3 + i)} l 62 -20 Z`} fill={[C.ambar, C.rosa, C.teal, C.lima][i % 4]} opacity={prog(t, cb + i * 0.04, cb + 0.3 + i * 0.04)} />)}<path d="M 0 40 Q 960 90 1920 40" stroke="#fff" strokeWidth={4} fill="none" /></svg>}
      <Persona x={SX} y={SY} h={500} t={t} seed={77} mujer ropa={{ ...CIVIL(1), tunica: C.violeta, tunica2: "#3a1a7a", pelo: "#6b3a1f" }} {...G}
        bI={t < cb + 0.2 ? 95 : G.bI} cI={t < cb + 0.2 ? 75 : G.cI} bD={t > se - 0.4 && t < se + 0.15 ? 150 - 90 * cl((t - (se - 0.4)) / 0.45) : G.bD}
        manoI={t < cb + 0.2 ? <g transform="rotate(-80)">{tab(1)}</g> : undefined} manoD={t > w && t < se + 0.4 ? (t > se - 0.4 ? sello : <line x1={0} y1={-6} x2={10} y2={70} stroke="#4a2a14" strokeWidth={8} strokeLinecap="round" />) : undefined} />
      {t > se && t < se + 0.5 && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>{[0, 1, 2, 3, 4].map((i) => { const an = i * 1.25; const q = (t - se) / 0.5; return <line key={i} x1={250 + Math.cos(an) * (40 + q * 60)} y1={700 + Math.sin(an) * (40 + q * 60)} x2={250 + Math.cos(an) * (70 + q * 90)} y2={700 + Math.sin(an) * (70 + q * 90)} stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={1 - q} />; })}</svg>}
      {t > cb + 0.2 && !tiene && <svg style={{ position: "absolute", left: fx, top: fy, overflow: "visible" }} width={1} height={1}><g transform={`rotate(${vuela * 360})`}>{tab(1.2)}</g></svg>}
      <Persona x={1720} y={1050} h={440} t={t} seed={78} mujer flip ropa={{ ...CIVIL(4), tunica: C.teal, tunica2: "#1c6a62", pelo: "#2a1a10" }} aparece={w} {...G2}
        expr={t > pl ? "feliz" : G2.expr} bD={tiene && t < pl ? 70 : G2.bD} cD={tiene && t < pl ? 100 : G2.cD} bI={tiene && t < pl ? 70 : G2.bI} cI={tiene && t < pl ? 100 : G2.cI}
        manoD={tiene ? <g transform="rotate(-100)">{tab(1)}</g> : undefined} mira={t > cb && t < cb + 0.9 ? -0.8 : 0} />
      <Emote t={t} t0={pl + 0.2} t1={h} tipo="brillos" x={1720} y={1050 - 450 * 440 / 560} s={0.9} />
      {t > cb && t < h && <svg style={{ position: "absolute", left: 760, top: 780, overflow: "visible", transform: `scale(${ent(t, cb + 0.3)})`, transformOrigin: "120px 220px" }} width={240} height={220}><rect x={20} y={110} width={200} height={100} rx={14} fill="#f6d8e4" stroke="#8a2a5a" strokeWidth={6} /><rect x={50} y={50} width={140} height={70} rx={12} fill="#ffe9f1" stroke="#8a2a5a" strokeWidth={6} />{[80, 120, 160].map((x) => <g key={x}><rect x={x - 5} y={18} width={10} height={34} fill="#fff" /><ellipse cx={x} cy={8 + Math.sin(t * 12 + x) * 2} rx={7} ry={12} fill="#ffb020" /></g>)}</svg>}
      <TablillaGrande t={t} t0={w} x={990} y={460} w={1060} vel={34} titulo="CLAUDIA SEVERA → SULPICIA LEPIDINA"
        lineas={["“On the 11th of September, sister,", "for the day of my birthday,", "come to us… you will make the day", "more pleasant by your presence.”"]} />
      {t > se && <div style={{ position: "absolute", left: 1400, top: 600, width: 110, height: 110, borderRadius: 55, background: C.rojo, border: "8px solid #7a1020", boxShadow: "6px 8px 0 rgba(20,8,40,.35)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 700, fontSize: 40, color: "#ffd0d0", transform: `scale(${ent(t, se, 0, { damping: 8, stiffness: 260 }) * (1 + 0.5 * Math.exp(-(t - se) * 10))}) rotate(-12deg)` }}>CS</div>}
      {t > h && <div style={{ position: "absolute", left: 440, width: 1060, top: 890, height: 110, background: "#fff", borderRadius: 20, transform: `scale(${ent(t, h)}) rotate(-1.5deg)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontMano, fontWeight: 700, fontSize: 54, color: "#3a1a5a" }}>“Farewell, sister, my dearest soul.”</div>}
      <Chip t={t} t0={a} t1={w} text="A BIRTHDAY INVITATION" color={C.rosa} x={1100} y={420} centro size={80} />
      <Chip t={t} t0={T("a woman named", D)} t1={w + 0.2} text="CLAUDIA SEVERA · A COMMANDER'S WIFE" color={C.violeta} x={1100} y={580} centro size={50} />
      {t > h && <Chip t={t} t0={h + 0.3} text="A WOMAN'S OWN HANDWRITING · LATIN" color={C.ambar} tinta={C.noche} x={1000} y={96} centro size={52} />}
    </AbsoluteFill>
  );
};

// 8:38 · la oficina: las tablillas caen sobre la mesa (nada flota) y el centurión sella cada parte; el último, de un golpe
const Partes2: React.FC<{ t: number }> = ({ t }) => {
  const of = T("the officers file", D);
  const it: [string, string][] = [["strength reports", "STRENGTH REPORT"], ["duty reports", "DUTY REPORT"], ["lists of who was sent", "→ THE BATHHOUSE"], ["who was sent to the workshops", "→ THE WORKSHOPS"], ["who was sent to collect", "→ COLLECT CLAY"]];
  const items = [{ txt: "CENTURY OF FLAVIUS · 80 MEN", t0: of + 0.5 }, { txt: "PRESENT AND FIT: 74", t0: of + 1.0 }, ...it.map(([w, tx]) => ({ txt: tx, t0: T(w, D) }))];
  const ult = items[items.length - 1].t0 + 0.5;
  const PX = 900, PW = 800, H = 160 + items.length * 80, PT = 600 - H / 2;
  const rowY = (i: number) => PT + 110 + i * 80 + 35;
  const CX = 1560, CH = 520, S = CH / 560, SX = CX - 66 * S, SY = 1060 - 322 * S;
  let k = -1; items.forEach((x, i) => { if (t > x.t0 - 0.3) k = i; });
  const dt = k >= 0 ? t - items[k].t0 : 9;
  const base = k >= 0 ? 90 + (Math.atan2(SY - rowY(k), SX - (PX + PW / 2 - 50)) * 180) / Math.PI : 30;
  const golpe = dt > -0.3 && dt < 0 ? 40 * (1 + dt / 0.3) : dt >= 0 && dt < 0.12 ? 40 * (1 - dt / 0.12) : 0;
  const slam = t > ult - 0.35 ? (t < ult ? 70 * cl((t - (ult - 0.35)) / 0.25) : 0) : 0;
  const tiembla = t > ult && t < ult + 0.4 ? Math.sin(t * 80) * 8 * (1 - (t - ult) / 0.4) : 0;
  const nT = items.filter((x) => t > x.t0).length * 2;
  const sello = <g transform="rotate(180)"><rect x={-14} y={-50} width={28} height={50} rx={6} fill="#6b3a1f" /><rect x={-30} y={-6} width={60} height={22} rx={4} fill={C.rojo} /></g>;
  return (
    <AbsoluteFill>
      <Sala t={t} tono="violeta" ventana="izq" />
      {/* mesa con las pilas de tablillas (caen de a una y se apilan) */}
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <rect x={20} y={880} width={460} height={220} rx={10} fill="#7a4a22" /><rect x={20} y={868} width={460} height={26} rx={8} fill="#a8703a" />
      </svg>
      {Array.from({ length: Math.min(14, nT + 2) }, (_, i) => { const tl = i < 2 ? of : items[Math.floor((i - 2) / 2)].t0 + (i % 2) * 0.12; const u = cl((t - tl) / 0.25); return <div key={i} style={{ position: "absolute", left: 60 + (i % 2) * 200, top: 828 - Math.floor(i / 2) * 36 - (1 - u * u) * 500, width: 180, height: 38, background: i % 2 ? "#c9a46a" : "#d8b87a", border: "4px solid #8a6a3a", borderRadius: 6, opacity: u > 0 ? 1 : 0 }} />; })}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${tiembla}px, ${Math.abs(tiembla) * 0.5}px)` }}>
        <Papiro t={t} x={PX} y={600} w={PW} t0={of + 0.2} tacha={false} titulo="TODAY · CENTURY OF FLAVIUS" items={items.map((x) => ({ ...x, monto: "✓" }))} />
      </div>
      <Persona x={CX} y={1060} h={CH} t={t} seed={91} ropa={CENTURION} casco="centurion" flip expr={t > ult ? "orgullo" : k >= 0 ? "enojado" : "neutro"} habla={t < ult}
        bD={base + golpe + slam} cD={4} bI={t > ult ? 150 : 30} cI={t > ult ? 20 : 40} manoD={sello} inclina={slam > 0 ? -8 : golpe > 0 ? -4 : 0} mira={0.7} salta={t > ult ? ult : undefined} />
      {t > ult && <div style={{ position: "absolute", left: PX + PW / 2 - 150, top: rowY(items.length - 1) - 90, width: 180, height: 180, borderRadius: 90, border: `12px solid ${C.rojo}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 700, fontSize: 30, color: C.rojo, background: "rgba(255,240,230,.85)", transform: `scale(${1 + 1.5 * Math.exp(-(t - ult) * 9)}) rotate(-14deg)`, opacity: cl((t - ult) / 0.1) }}>APPROVED ✓</div>}
      {t > ult && t < ult + 0.5 && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>{Array.from({ length: 8 }, (_, i) => { const an = (i / 8) * Math.PI * 2, q = (t - ult) / 0.5, cx = PX + PW / 2 - 60, cy = rowY(items.length - 1); return <line key={i} x1={cx + Math.cos(an) * (110 + q * 60)} y1={cy + Math.sin(an) * (110 + q * 60)} x2={cx + Math.cos(an) * (150 + q * 90)} y2={cy + Math.sin(an) * (150 + q * 90)} stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={1 - q} />; })}</svg>}
      <Cu t={t} w="the officers file" d={D} de={12} a={37} sube={6} dur={9} x={960} y={110} size={64} pre="REPORTS TODAY: " color="#fff" />
    </AbsoluteFill>
  );
};

// 8:48 · el frío: acerca las manos al brasero y la llama crece… una ráfaga la apaga; pero las tablillas, ordenadas
const Frio4: React.FC<{ t: number; t0: number; tCal: number; tOrg: number }> = ({ t, t0, tCal, tOrg }) => {
  const llega = t0 + 0.8, manos = llega + 0.1;
  const crece = prog(t, manos, manos + 0.5), baja = prog(t, tCal, tCal + 0.4);
  const fuego = (0.75 + 0.75 * crece - 0.95 * baja) * (1 + 0.15 * Math.sin(t * 13) + 0.1 * Math.sin(t * 21 + 1));
  const rafaga = t > tCal - 0.1 && t < tCal + 1.0;
  const x = 520 + 200 * prog(t, t0, llega);
  const G = gesto(t, [[t0, "camina"], [manos, "habla"], [tCal + 0.1, "tiembla"], [tOrg - 0.1, "lee"], [tOrg + 1.4, "festeja"]]);
  const calienta = t > manos && t < tCal + 0.1;
  return (
    <AbsoluteFill>
      <Sala t={t} tono="noche" ventana="der" estante={false} lampara={false} />
      {Array.from({ length: 30 }, (_, i) => { const v = rafaga ? 2.2 : 0.25; const q = (t * v + i * 0.137) % 1; return <div key={i} style={{ position: "absolute", left: 1500 + ((i * 97) % 260) + Math.sin(t + i) * 12 - q * (rafaga ? 900 : 160), top: 170 + q * (rafaga ? 360 : 520), width: 10, height: 10, borderRadius: 5, background: "#fff", opacity: 0.85 * (1 - q) }} />; })}
      <div style={{ position: "absolute", left: 980 - 300, top: 660 - 300, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,150,60,.5), rgba(255,120,40,0) 62%)", transform: `scale(${Math.max(0.2, fuego)})`, mixBlendMode: "screen" }} />
      <svg style={{ position: "absolute", left: 980 - 140, top: 560, overflow: "visible" }} width={280} height={300}>
        <g transform={`translate(140 110) scale(${Math.max(0.15, fuego)}) translate(-140 -110)`}>
          <path d={`M 70 120 Q ${100 + 10 * Math.sin(t * 9)} 10 140 -30 Q ${180 + 8 * Math.sin(t * 11)} 30 210 120 Z`} fill="#ff8a3a" />
          <path d={`M 110 120 Q 130 40 140 20 Q 156 60 170 120 Z`} fill="#ffe08a" />
        </g>
        <path d="M 40 110 L 240 110 L 210 170 L 70 170 Z" fill="#4a3a30" stroke="#2a1a10" strokeWidth={6} />
        <rect x={86} y={170} width={14} height={110} fill="#2a1a10" /><rect x={180} y={170} width={14} height={110} fill="#2a1a10" />
      </svg>
      <Persona x={x} y={1010} h={520} t={t} seed={3} ropa={TUNGRO} casco="legion" malla pantalon="#6b4a2f" capa="#3f6b2a" camina={t < llega ? 1.3 : 0} {...G}
        expr={calienta ? "feliz" : G.expr} habla={false} bD={calienta ? 82 + Math.sin(t * 8) * 4 : G.bD} cD={calienta ? 8 : G.cD} bI={calienta ? -60 + Math.sin(t * 8) * 4 : G.bI} cI={calienta ? -20 : G.cI} mira={calienta ? 0.8 : t > tOrg ? 0.9 : 0} />
      {[0, 1, 2].map((i) => { const q = ((t * 0.8 + i / 3) % 1); return <div key={i} style={{ position: "absolute", left: x + 80 + q * 110, top: 560 - q * 60, width: 34 + q * 56, height: 22 + q * 30, borderRadius: "50%", background: "#fff", opacity: 0.5 * (1 - q) }} />; })}
      {rafaga && <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>{Array.from({ length: 6 }, (_, i) => { const q = ((t * 2 + i / 6) % 1); return <path key={i} d={`M ${1500 - q * 1100} ${300 + i * 70} q 60 -20 120 0 t 120 0`} stroke="#cfe0ff" strokeWidth={6} fill="none" opacity={0.6 * Math.sin(q * Math.PI)} strokeLinecap="round" />; })}</svg>}
      <Termometro t={t} t0={tCal} de={12} a={-4} x={250} y={560} s={0.9} />
      {t > tOrg && Array.from({ length: 8 }, (_, i) => {
        const e = ent(t, tOrg + i * 0.12);
        return (
          <div key={i} style={{ position: "absolute", left: 1330 + (i % 2) * 230, top: 420 + Math.floor(i / 2) * 110, width: 210, height: 90, borderRadius: 10, background: "#d9b878", border: "5px solid #8a6a3a", transform: `scale(${e})`, boxShadow: "0 8px 0 rgba(0,0,0,.25)" }}>
            {[0, 1, 2].map((j) => <div key={j} style={{ position: "absolute", left: 16, top: 16 + j * 20, width: 120, height: 6, borderRadius: 3, background: "#6b4a2f" }} />)}
            <div style={{ position: "absolute", right: 12, top: 10, fontSize: 52, fontWeight: 700, color: C.teal, fontFamily: "sans-serif" }}>✓</div>
          </div>
        );
      })}
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
      <Plano t={t} t0={T("your job is to stand", D) + 0.2} t1={T("then you climb down", D) - 0.15} desde={[yo[0], yo[1]]} fondo="#8b95aa"><MiraNorte4 t={t} t0={T("your job is to stand", D) + 0.2} tViento={T("in the wind", D)} tNorte={T("and look north", D)} tLomas={T("at hills", D)} tPasto={T("at grass", D)} tMas={T("at more grass", D)} tOveja={T("at a sheep", D)} /></Plano>
      {t > T("and look north", D) && t < T("at hills", D) && <Chip t={t} t0={T("and look north", D)} text="LOOK NORTH." color="#2a2350" x={1300} y={300} centro size={70} />}
      <Ch t={t} w="then you climb down" d={D} txt="CLIMB DOWN" x={560} y={150} c={C.violeta} size={56} dur={1.6} />
      <Ch t={t} w="someone else climbs up" d={D} txt="SOMEONE ELSE CLIMBS UP" x={1300} y={150} c={C.ambar} tinta={C.noche} size={56} dur={1.6} />
      <Plano t={t} t0={T("and you go back", D)} t1={T("there is a gate", D) - 0.15} desde={[960, 700]} fondo="#141030"><Cuartel8b t={t} /></Plano>
      <Ch t={t} w="there is a gate" d={D} txt="A GATE IN EVERY MILECASTLE" y={150} c={C.violeta} size={60} dur={1.6} />
      <Ch t={t} w="so a lot of your day" d={D} txt="NOT FIGHTING…" y={150} c={C.rojo} size={60} dur={2.2} />
      <Gr t={t} w="it is paperwork" d={D} txt="PAPERWORK." y={200} size={150} c={C.crema} dur={1.2} />
      {[["who is crossing", "WHO?", 500], ["what are they carrying", "WHAT?", 960], ["are they paying the toll", "TOLL?", 1420]].map(([w, tx, x], i) => <Ch key={i} t={t} w={w as string} d={D} txt={tx as string} x={x as number} y={170} c={[C.teal, C.ambar, C.rojo][i]} tinta={i < 2 ? C.noche : "#fff"} size={80} dur={3.6 - i * 1.1} />)}
      <Plano t={t} t0={T("who is crossing", D) - 0.2} t1={T("less like a castle", D) - 0.15} desde={[960, 600]} fondo="#b9a98e"><Aduana t={t} t0={T("who is crossing", D) - 0.2} tQue={T("what are they carrying", D)} tPeaje={T("are they paying the toll", D)} /></Plano>
      <Ch t={t} w="many historians now" d={D} txt="A CUSTOMS BARRIER" x={560} y={160} c={C.teal} tinta={C.noche} size={58} dur={3.7} />
      <Ch t={t} w="as a battle" d={D} txt="AS MUCH AS A BATTLE LINE" x={1340} y={160} c={C.rojo} size={52} dur={1.0} />
      <Ch t={t} w="less like a castle" d={D} txt="LESS LIKE A CASTLE" y={150} c="#2a2350" size={58} dur={1.2} />
      <Gr t={t} w="more like a border" d={D} txt="A BORDER CROSSING… IN THE RAIN" y={200} size={84} c={C.ambar} dur={1.7} />
      <Ch t={t} w="so the soldiers did" d={D} txt="WHAT BORED PEOPLE ALWAYS DO" y={150} c={C.violeta} size={56} dur={2.9} />
      {t > T("so the soldiers did", D) + 0.5 && t < T("at vindolanda", D) && <Zzz x={yo[0] + 40} y={yo[1] - 40} t={t} />}
      <Gr t={t} w="they invented ways" d={D} txt="INVENT WAYS TO PASS THE TIME" y={200} size={74} c={C.lima} dur={2.3} />
      <Plano t={t} t0={T("at vindolanda", D) - 0.1} t1={T("they found a pair", D) - 0.15} desde={[yo[0], yo[1]]} fondo="#6b4a2f"><Juegos2 t={t} /></Plano>
      <Plano t={t} t0={T("they found a pair", D) - 0.05} t1={T("and one letter", D) - 0.15} desde={[960, 600]} fondo="#8a2a3a"><Box t={t} /></Plano>
      <Plano t={t} t0={T("and one letter", D)} t1={T("a birthday party", D) - 0.15} desde={[960, 600]} fondo="#8a2a5a"><Cumple2 t={t} /></Plano>
      <Gr t={t} w="a birthday party" d={D} txt="A BIRTHDAY PARTY." y={200} size={130} c={C.rosa} dur={1.6} />
      <Gr t={t} w="on the edge of the world" d={D} txt="…ON THE EDGE OF THE WORLD" y={880} size={84} c={C.crema} dur={1.4} />
      <Ch t={t} w="because somebody had" d={D} txt="SOMEBODY HAD TO MAKE IT FEEL LIKE HOME" y={150} c={C.violeta} size={52} dur={1.8} />
      <Plano t={t} t0={T("the officers file", D) - 0.2} t1={T("rome could not always", D) - 0.15} desde={[960, 700]} fondo="#1b1240"><Partes2 t={t} /></Plano>
      <Plano t={t} t0={T("rome could not always", D) - 0.1} t1={T("and that was the good part", D) - 0.1} desde={[960, 600]} fondo="#141030"><Frio4 t={t} t0={T("rome could not always", D)} tCal={T("the wall warm", D)} tOrg={T("but it could always", D)} /></Plano>
      <Ch t={t} w="rome could not always" d={D} txt="WARM ✗" x={620} y={170} c="#3d7fc9" size={80} dur={3.9} />
      <Ch t={t} w="but it could always" d={D} txt="ORGANIZED ✓" x={1300} y={170} c={C.teal} tinta={C.noche} size={80} dur={1.9} />
      <Ch t={t} w="and that was the good part" d={D} txt="THAT WAS THE GOOD PART…" y={150} c={C.ambar} tinta={C.noche} size={56} dur={2.5} />
      <Gr t={t} w="meet the neighbors" d={D} txt="MEET THE NEIGHBORS." y={880} size={100} c={C.rojo} borde="#fff" dur={1.6} />
    </>
  );
};
