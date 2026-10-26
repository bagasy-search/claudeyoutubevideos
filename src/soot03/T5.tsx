import React from "react";
import { AbsoluteFill } from "remotion";
import { C, fontFamily, ent, prog, Chip, Grande, Emote, cabeza, Casa } from "./kit";
import { Fuerte, Bolsa } from "./kit2";
import { Persona, CIVIL } from "./persona";
import { TOP, BASE, MC, K, Cam, Pal, Plano, CartelTrampa, pant, FUERTE_H } from "./mundo";
import { Gr, Ch, T, ck, TUNGRO, AUX, Esqueleto, TablillaGrande, Picto, Ojos, gesto } from "./kit3";

// TRAMPA 5 · LOS VECINOS (536,4-618,5 s). El vicus que crece afuera de Housesteads (tabernas, tiendas, talleres,
// familias que la ley no reconoce, comerciantes); "suena acogedor" → no siempre: los dos esqueletos bajo el piso con
// la punta del cuchillo entre las costillas; los britanos sin armadura y la palabra "Brittunculi"; y por qué conviene
// no despreciar a quien conoce el terreno.
const D = 536;
const HX = FUERTE_H; // Housesteads
const VI = HX - 1700; // el vicus
const CASAS = [VI - 900, VI - 560, VI - 220, VI + 120, VI + 460, VI + 800];
const ROT: [string, string][] = [["pubs", "PUB"], ["shops", "SHOP"], ["workshops", "WORKSHOP"]];

export const keys5: K[] = [
  [536.6, 25200, 580, 0.42], ck("outside the gates", D, VI, 760, 0.8), ck("a small town grows", D, VI, 740, 0.95), ck("pubs", D, VI - 400, 740, 1.0),
  ck("families that the law", D, VI + 300, 760, 1.2), ck("traders who came", D, VI + 700, 760, 1.25), ck("it sounds cozy", D, VI, 700, 0.7),
  ck("it was not always", D, VI + 400, 700, 0.55), ck("at the fort of", D, HX, 660, 0.5), ck("nobody knows who", D, HX - 800, 760, 0.9),
  ck("the wall had a murder", D, HX - 800, 740, 1.2), ck("then there are the locals", D, HX, 380, 0.5), ck("one roman report", D, HX, 400, 0.6),
  ck("but here is the problem", D, HX, 400, 0.6), ck("they know the land", D, HX, 380, 0.9), ck("which brings us", D, HX + 2000, 420, 0.4), [618.4, 33000, 500, 0.4],
];
export const amb5: [number, Pal][] = [[536.6, "gris"], [538.8, "dia"], [553.3, "calido"], [554.6, "noche"], [581.7, "gris"], [602.3, "tormenta"], [615.0, "gris"]];
export const lluvia5: [number, number][] = [[536.6, 0.1], [538.8, 0], [581.7, 0], [602.3, 0.4], [618.4, 0.3]];
export const sol5: [number, number, number, boolean?][] = [[538.8, 1450, 220], [553.3, 1500, 520], [554.6, 1500, 180, true], [581.7, -999, 0]];

// excavación de 1930: piso de arcilla, los dos esqueletos y el cuchillo
const Piso: React.FC<{ t: number }> = ({ t }) => {
  const a = T("archaeologists in the 1930s", D), b = T("under the clay floor", D), c = T("they found two skeletons", D), k = T("and the man still had", D);
  const cav = prog(t, b, c);
  return (
    <AbsoluteFill style={{ background: "#2a1a10" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 360, background: "linear-gradient(180deg,#e8b98a,#c98a5a)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, height: 90, background: "#a8783a" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 450, bottom: 0, background: "repeating-linear-gradient(180deg,#5a3a22 0 60px,#4a3018 60px 120px)" }} />
      <div style={{ position: "absolute", left: 360, top: 360, width: 1200, height: 520 * cav, background: "rgba(10,6,4,.6)", borderRadius: "0 0 60px 60px" }} />
      {t > c - 0.2 && <Esqueleto x={760} y={640} s={1.1} t={t} t0={c} />}
      {t > c && <Esqueleto x={1240} y={720} s={1.1} t={t} t0={c + 0.4} rot={180} cuchillo={t > k} />}
      <Persona x={330} y={430} h={300} t={t} seed={77} ropa={CIVIL(2)} {...gesto(t, [[a, "cava"], [c, "sorpresa"], [c + 1.4, "miedo"], [k, "señala"]])} />
      <Chip t={t} t0={a} text="HOUSESTEADS · 1930s" color={C.violeta} x={960} y={110} centro size={60} />
      {t > b && t < c + 1 && <Chip t={t} t0={b} text="UNDER THE CLAY FLOOR" color="#a8783a" x={960} y={410} centro size={50} />}
      {t > T("a man and a woman", D) && <Chip t={t} t0={T("a man and a woman", D)} text="A MAN" color="#3d7fc9" x={1240} y={880} centro size={54} />}
      {t > T("a man and a woman", D) + 0.5 && <Chip t={t} t0={T("a man and a woman", D) + 0.5} text="A WOMAN" color={C.rosa} x={760} y={880} centro size={54} />}
      {t > T("hidden there", D) && <Chip t={t} t0={T("hidden there", D)} text="HIDDEN · NOT BURIED" color={C.rojo} x={960} y={240} centro size={58} />}
      {t > k + 1.6 && <Grande t={t} t0={k + 1.6} text="A KNIFE." y={1000} size={110} color={C.rojo} borde="#fff" />}
      {t > k + 1.6 && <div style={{ position: "absolute", left: 1060, top: 560, width: 220, height: 220, borderRadius: "50%", border: `12px solid ${C.rojo}`, transform: `scale(${ent(t, k + 1.6)})` }} />}
    </AbsoluteFill>
  );
};
// el informe sobre los britanos (Brittunculi)
const Informe: React.FC<{ t: number }> = ({ t }) => {
  const a = T("one roman report", D), b = T("and the report gives", D), w = T("wretched little britons", D);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #6b4ac9, #1b1240 80%)" }}>
      <Persona x={230} y={1050} h={440} t={t} seed={95} ropa={{ ...AUX(4), tunica: "#c9a23d", tunica2: "#8f7025" }} casco="legion" malla {...gesto(t, [[a, "escribe"], [T("they have no armor", D), "festeja"], [b, "señala"], [T("it is the only time", D), "habla"]])} />
      <TablillaGrande t={t} t0={a + 0.5} x={1100} y={470} w={1360} vel={30} titulo="VINDOLANDA · A REPORT ON THE BRITONS"
        lineas={["“…the Britons are unprotected by armour.", "There are very many cavalry…", "…nor do the Brittunculi mount", "in order to throw javelins.”"]} />
      {[["they have no armor", "NO ARMOR", 520, C.rojo], ["they have lots of cavalry", "LOTS OF CAVALRY", 1400, C.teal]].map(([p, tx, x, col], i) => t > T(p as string, D) && t < b ? <Chip key={i} t={t} t0={T(p as string, D)} text={tx as string} color={col as string} tinta={i ? C.noche : "#fff"} x={(x as number) === 520 ? 820 : 1460} y={900} centro size={60} /> : null)}
      {t > b && <div style={{ position: "absolute", left: 560, right: 160, top: 780, height: 150, background: C.ambar, borderRadius: 24, transform: `scale(${ent(t, b + 0.4)}) rotate(-2deg)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 700, fontSize: 96, color: C.noche, letterSpacing: 4 }}>BRITTUNCULI</div>}
      {t > w && <Chip t={t} t0={w} t1={T("and it was written", D) - 0.2} text="= “WRETCHED LITTLE BRITONS”" color={C.rojo} x={1100} y={990} centro size={60} />}
      {t > T("it is the only time", D) && <Chip t={t} t0={T("it is the only time", D)} text="THE ONLY TIME THIS WORD EVER APPEARS" color="#fff" tinta={C.noche} x={1100} y={130} centro size={52} />}
    </AbsoluteFill>
  );
};
// lo que saben los vecinos: mapa del terreno con inundación, patrulla floja, niebla
const Terreno: React.FC<{ t: number }> = ({ t }) => {
  const a = T("they know the land", D), f = T("they know which valleys", D), p = T("they know when the patrol", D), n = T("and they know exactly", D);
  return (
    <AbsoluteFill style={{ background: "#7fa05a" }}>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M -40 ${180 + i * 130} Q 480 ${120 + i * 130 + (i % 2) * 80} 960 ${190 + i * 130} T 1960 ${160 + i * 130}`} stroke="#6b8a4a" strokeWidth={10} fill="none" />)}
        <path d="M 0 980 L 1920 980" stroke="#c9b8a0" strokeWidth={50} />
        {t > f && <path d={`M 300 620 Q 600 ${560 - 80 * prog(t, f, f + 1.2)} 900 640 Q 600 ${720 + 60 * prog(t, f, f + 1.2)} 300 620 Z`} fill="#3d7fc9" opacity={0.85} />}
        {t > p && <path d="M 1000 900 Q 1250 700 1500 880" stroke="#fff" strokeWidth={10} strokeDasharray="20 20" fill="none" />}
        {t > n && <path d={`M 1460 980 L ${1460 - 500} ${980 - 600} A 700 700 0 0 1 ${1460 + 500} ${980 - 600} Z`} fill="#fff6c8" opacity={0.25} />}
        {t > n && <rect x={0} y={0} width={1920} height={1080} fill="#e8eef4" opacity={0.65 * prog(t, n + 1.2, n + 2.6)} mask="url(#nb)" />}
        <defs><radialGradient id="nbg"><stop offset="0.25" stopColor="#000" /><stop offset="0.6" stopColor="#fff" /></radialGradient><mask id="nb"><rect width={1920} height={1080} fill="url(#nbg)" transform="translate(1460 980) scale(1.4) translate(-1460 -980)" /></mask></defs>
        <rect x={1420} y={900} width={80} height={80} fill="#c9b8a0" stroke="#8a7a64" strokeWidth={6} />
      </svg>
      {t > p && <Persona x={1250} y={790} h={180} t={t} seed={27} ropa={AUX(4)} casco="legion" expr="dormido" />}
      {[0, 1, 2].map((i) => <Picto key={i} x={160 + i * 120 + 700 * prog(t, f + 0.4, p + 2.5) + 300 * prog(t, n, n + 3)} y={640 + (i % 2) * 30 - 60 * prog(t, n, n + 3)} s={1.1} t={t} seed={70 + i} sube={a + i * 0.2} />)}
      {[[a, "THEY KNOW THE LAND", C.violeta, 160], [f, "WHICH VALLEYS FLOOD", "#3d7fc9", 260], [p, "WHEN THE PATROL IS LAZY", C.ambar, 160], [n, "HOW FAR YOUR TOWER SEES IN FOG", "#2a2350", 260]].map(([t0, tx, col, y], i) => t > (t0 as number) ? <Chip key={i} t={t} t0={t0 as number} t1={i === 0 ? f : i === 1 ? n - 0.1 : 1e9} text={tx as string} color={col as string} tinta={i === 2 ? C.noche : "#fff"} x={i === 1 ? 600 : i === 3 ? 1300 : 960} y={y as number} centro size={56} /> : null)}
      <Chip t={t} t0={T("and you do not", D)} t1={f} text="YOU DON'T" color={C.rojo} x={960} y={260} centro size={56} />
    </AbsoluteFill>
  );
};

export const W5: React.FC<{ t: number; c: Cam }> = ({ t }) => {
  if (t < 536 || t > 619) return null;
  const crece = T("outside the gates", D) + 0.6;
  const noche = t > T("it was not always", D);
  return (
    <>
      <Fuerte x={HX} y={BASE - 190} s={0.9} w={1700} piedra />
      {t > T("at the fort of", D) - 0.5 && t < T("archaeologists in the 1930s", D) && <div style={{ position: "absolute", left: HX - 520, top: BASE - 560, width: 1040, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 110, color: "#fff", WebkitTextStroke: "14px #2a1530", paintOrder: "stroke fill", transform: `scale(${ent(t, T("at the fort of", D))})` }}>HOUSESTEADS</div>}
      {/* el pueblo crece casa por casa */}
      {CASAS.map((x, i) => t > crece + i * 0.25 ? (
        <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `scale(${ent(t, crece + i * 0.25)})`, transformOrigin: `${x}px ${BASE}px` }}>
          <Casa x={x} y={BASE - 110} s={1.1} tono={["#e8b98a", "#d8a878", "#f0c89a", "#c99a6a", "#e0b080", "#d0a070"][i]} techo={i % 2 ? "#8a5a2a" : "#b5452c"} luz={noche} />
        </div>
      ) : null)}
      {ROT.map(([w, tx], i) => t > T(w, D) && t < T("it was not always", D) ? <div key={i} style={{ position: "absolute", left: CASAS[i * 2] - 140, top: BASE - 380, width: 280, height: 80, background: "#f6e3b4", border: "7px solid #8a5a2a", borderRadius: 10, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 46, lineHeight: "66px", color: C.rojo, transform: `scale(${ent(t, T(w, D))}) rotate(${(i - 1) * 4}deg)` }}>{tx}</div> : null)}
      {/* chimeneas */}
      {t > crece + 2 && CASAS.map((x, i) => [0, 1, 2].map((k) => { const kk = (t * 0.4 + k / 3 + i * 0.1) % 1; return <div key={i + "-" + k} style={{ position: "absolute", left: x + 40 + kk * 40, top: BASE - 330 - kk * 260, width: 60 + kk * 70, height: 60 + kk * 70, borderRadius: "50%", background: "#d8d0c8", opacity: 0.5 * (1 - kk) }} />; }))}
      {/* familias, comerciantes, soldados */}
      {t > T("families that the law", D) - 0.3 && t < T("at the fort of", D) && (
        <>
          <Persona x={VI + 150} y={BASE} h={230} t={t} seed={3} ropa={TUNGRO} casco="no" malla pantalon="#6b4a2f" capa="#3f6b2a" {...gesto(t, [[T("families that the law", D) - 0.3, "festeja"], [T("traders who came", D), "habla"], [T("it sounds cozy", D), "festeja"], [T("it was not always", D), "miedo"]])} />
          <Persona x={VI + 330} y={BASE} h={215} t={t} seed={150} ropa={{ ...CIVIL(1), tunica: C.rosa, tunica2: "#c94a6a" }} {...gesto(t, [[T("families that the law", D), "habla"], [T("it sounds cozy", D), "festeja"], [T("it was not always", D), "miedo"]])} />
          <Persona x={VI + 470} y={BASE} h={120} t={t} seed={151} ropa={CIVIL(3)} expr="feliz" salta={noche ? 0 : Math.abs(Math.sin(t * 6)) * 16} />
        </>
      )}
      {t > T("traders who came", D) - 0.3 && t < T("at the fort of", D) && <><Persona x={VI + 900} y={BASE} h={240} t={t} seed={152} ropa={CIVIL(4)} flip {...gesto(t, [[T("traders who came", D), "señala"], [T("and stayed", D), "festeja"], [T("it was not always", D), "encoge"]])} /><Bolsa x={VI + 760} y={BASE - 150} s={0.5} t={t} t0={T("traders who came", D)} txt="$" /></>}
      {/* jinetes britanos en la loma del frente del muro (al norte, detrás) */}
    </>
  );
};
export const N5: React.FC<{ t: number; c: Cam }> = ({ t, c }) => {
  const vis = t > T("then there are the locals", D) - 0.3 && t < 618.5;
  if (!vis) return null;
  const bx = HX * 0.62;
  return (
    <>
      {Array.from({ length: 9 }, (_, i) => {
        const x = bx - 700 + i * 170 + Math.sin(t * 2 + i) * 6, y = 300 + (i % 3) * 24;
        const montado = i % 3 !== 1;
        return (
          <React.Fragment key={i}>
            {montado && <svg style={{ position: "absolute", left: x - 90, top: y - 90, overflow: "visible" }} width={180} height={110}><ellipse cx={90} cy={50} rx={80} ry={34} fill="#5a3a26" /><path d="M 150 40 L 190 0 L 200 20 L 168 56 Z" fill="#5a3a26" />{[30, 60, 120, 150].map((xx) => <rect key={xx} x={xx} y={70} width={12} height={40} fill="#3a2418" />)}</svg>}
            <Picto x={x} y={y - (montado ? 60 : 0)} s={0.7} t={t} seed={80 + i} sube={T("then there are the locals", D) + i * 0.08} grita={t > 602.3} />
          </React.Fragment>
        );
      })}
      {t > T("but here is the problem", D) && [0, 1, 2, 3].map((i) => <Ojos key={i} x={bx - 500 + i * 330} y={250} t={t} t0={T("but here is the problem", D) + i * 0.2} s={0.6} seed={i + 9} />)}
    </>
  );
};

export const S5: React.FC<{ t: number; c: Cam }> = ({ t, c }) => {
  if (t < 536 || t > 619) return null;
  return (
    <>
      <CartelTrampa t={t} t0={536.41} n={5} titulo="THE NEIGHBORS" color={C.rosa} />
      <Ch t={t} w="outside the gates" d={D} txt="OUTSIDE EVERY BIG FORT…" y={150} c={C.violeta} size={60} dur={2.1} />
      <Ch t={t} w="a small town grows" d={D} txt="…A SMALL TOWN GROWS" y={150} c={C.teal} tinta={C.noche} size={60} dur={1.7} />
      <Gr t={t} w="the romans called it" d={D} txt="VICUS" y={200} size={190} c={C.ambar} dur={1.9} dt={0.8} />
      <Ch t={t} w="families that the law" d={D} txt="FAMILIES THE LAW DID NOT RECOGNIZE" y={150} c={C.rosa} size={54} dur={2.9} />
      <Ch t={t} w="traders who came" d={D} txt="TRADERS: CAME FOR THE SILVER, STAYED" y={150} c={C.oro} tinta={C.noche} size={54} dur={2.7} />
      <Gr t={t} w="it sounds cozy" d={D} txt="COZY?" y={200} size={170} c={C.lima} dur={1.2} />
      <Gr t={t} w="it was not always" d={D} txt="NOT ALWAYS." y={200} size={150} c={C.rojo} borde="#fff" dur={1.0} />
      <Ch t={t} w="in the middle of the wall" d={D} txt="THE MIDDLE OF THE WALL" y={150} c={C.violeta} size={56} dur={1.4} />
      <Plano t={t} t0={T("archaeologists in the 1930s", D) - 0.1} t1={T("nobody knows who", D) - 0.15} desde={[960, 760]} fondo="#2a1a10"><Piso t={t} /></Plano>
      {t > T("nobody knows who", D) && t < T("then there are the locals", D) && (
        <>
          <div style={{ position: "absolute", left: 480, top: 700, width: 1000, height: 220, borderRadius: "50%", background: "rgba(20,10,6,.75)" }} />
          <Esqueleto x={760} y={760} s={0.9} t={t} t0={T("nobody knows who", D)} />
          <Esqueleto x={1180} y={840} s={0.9} t={t} t0={T("nobody knows who", D) + 0.2} rot={180} cuchillo />
          {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 640 + i * 260, top: 480 + Math.sin(t * 3 + i) * 14, fontFamily, fontWeight: 700, fontSize: 140, color: "#fff", WebkitTextStroke: "12px #2a1530", paintOrder: "stroke fill", transform: `scale(${ent(t, T("nobody knows who", D) + 0.3 + i * 0.15)})` }}>?</div>)}
        </>
      )}
      <Ch t={t} w="nobody knows who" d={D} txt="NOBODY KNOWS WHO" y={150} c="#2a2350" size={60} dur={1.5} />
      <Ch t={t} w="nobody ever reported" d={D} txt="NOBODY REPORTED IT" y={150} c={C.rojo} size={60} dur={1.5} />
      <Gr t={t} w="the wall had a murder" d={D} txt="A MURDER MYSTERY" y={220} size={130} c={C.rojo} borde="#fff" dur={3.6} />
      {t > T("still unsolved", D) && t < T("then there are the locals", D) && <div style={{ position: "absolute", left: 960 - 300, top: 330, width: 600, height: 150, border: `14px solid ${C.rojo}`, borderRadius: 20, fontFamily, fontWeight: 700, fontSize: 100, color: C.rojo, textAlign: "center", lineHeight: "122px", transform: `rotate(-8deg) scale(${1.6 - 0.6 * ent(t, T("still unsolved", D))})`, opacity: ent(t, T("still unsolved", D)) }}>UNSOLVED</div>}
      <Ch t={t} w="then there are the locals" d={D} txt="THE LOCALS BEYOND THE WALL" y={150} c={C.violeta} size={58} dur={2.2} />
      <Plano t={t} t0={T("one roman report", D) - 0.1} t1={T("but here is the problem", D) - 0.15} desde={[960, 400]} fondo="#1b1240"><Informe t={t} /></Plano>
      <Ch t={t} w="and it was written" d={D} txt="BY A SOLDIER · ABOUT THE PEOPLE HE KEPT OUT" y={1000} c={C.teal} tinta={C.noche} size={46} dur={3.8} />
      <Ch t={t} w="but here is the problem" d={D} txt="THE PROBLEM WITH “WRETCHED”…" y={150} c={C.rojo} size={58} dur={2.6} />
      <Plano t={t} t0={T("they know the land", D) - 0.1} t1={T("which brings us", D) - 0.15} desde={[960, 360]} fondo="#7fa05a"><Terreno t={t} /></Plano>
      <Ch t={t} w="which brings us" d={D} txt="THE REASON THE WALL WAS BUILT…" y={150} c="#2a2350" size={58} dur={3.2} />
    </>
  );
};
