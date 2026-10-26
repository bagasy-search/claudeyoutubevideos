import React from "react";
import { AbsoluteFill } from "remotion";
import { C, fontFamily, ent, prog, Chip, Grande, Emote, cabeza, Bota, Moneda } from "./kit";
import { Papiro, Item, Mula } from "./kit2";
import { Persona, CIVIL } from "./persona";
import { TOP, BASE, MC, K, Cam, Pal, Plano, CartelTrampa, pant } from "./mundo";
import { Gr, Cu, Ch, T, ck, TUNGRO, AUX, Carro, Barril, Jarro, TablillaGrande, Picto, gesto } from "./kit3";

// TRAMPA 3 · LA LÍNEA DE SUMINISTRO (331,2-431,6 s). Un campo donde no crece nada; el convoy que sube por el camino
// (grano, vino, sal, clavos, cuero… cerveza); la tablilla de Masclus; la lista de compras; la lluvia de zapatos;
// las familias; y la trampa: el convoy que llega tarde, que no llega, que un día deja de venir.
const D = 331;
const M3 = MC(3);
const CV0 = M3 + 2600; // el convoy entra desde acá y avanza hacia la izquierda
const YO3 = M3 - 600; // vos, al pie del muro, esperando
const conv = (t: number) => {
  // posición del carro de cabeza: llega, se para, se va (al final ya no vuelve)
  const a = T("so everything has to come", D), b = T("but here is the trap", D);
  if (t < a) return CV0 + 2400;
  if (t < b) return CV0 + 2400 - 2400 * prog(t, a, a + 4.5) - 300 * prog(t, a + 5, b);
  return CV0 - 300 - 2600 * prog(t, b + 1, b + 7);
};

export const keys3: K[] = [
  [331.4, M3 - 2000, 560, 0.4], ck("here is the thing", D, M3 + 200, 720, 0.9), ck("nothing grows there", D, M3 + 200, 740, 1.3),
  ck("so everything has to come", D, CV0 + 900, 720, 0.95), ck("grain", D, CV0 + 300, 740, 1.1), ck("and above all", D, CV0 - 100, 740, 1.2),
  ck("yes", D, CV0, 700, 1.4), ck("the soldiers on the northern", D, YO3, 720, 1.1), ck("they took it extremely", D, YO3, 700, 1.4),
  ck("one of the most famous", D, YO3, 700, 1.0), ck("that is it", D, YO3, 720, 1.5), ck("other tablets read", D, YO3 + 300, 700, 0.9),
  ck("and shoes", D, YO3, 720, 1.0), ck("because the wall", D, M3 - 1000, 680, 0.55), ck("was never just a place", D, M3 - 1200, 700, 0.7),
  ck("but here is the trap", D, CV0 - 400, 680, 0.55), ck("past people who would", D, CV0 - 1800, 600, 0.38), ck("if the convoy is late", D, YO3, 720, 1.3),
  ck("if the beer does not come", D, YO3, 720, 1.5), ck("and if a whole province", D, M3, 600, 0.4), ck("the convoy simply stops", D, M3 + 1200, 680, 0.5),
  ck("remember that", D, YO3, 700, 1.2), [431.3, YO3, 640, 0.9],
];
export const amb3: [number, Pal][] = [[331.4, "gris"], [345.6, "dia"], [404.2, "dia"], [407.9, "gris"], [421.7, "tormenta"]];
export const lluvia3: [number, number][] = [[331.4, 0], [345.4, 0], [407.9, 0], [409.6, 0.7], [414.5, 0.4], [421.7, 0.6], [431.5, 0.4]];
export const sol3: [number, number, number][] = [[331.3, -999, 0], [345.6, 1400, 240], [407.9, -999, 0]];

// la tablilla de Masclus (la frase de la cerveza aparece al final, subrayada)
const Masclus: React.FC<{ t: number }> = ({ t }) => {
  const a = T("one of the most famous", D), b = T("my fellow soldiers have", D), c = T("please order some", D);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #6b4ac9, #1b1240 80%)" }}>
      <Persona x={230} y={1040} h={430} t={t} seed={95} ropa={{ ...AUX(4), tunica: "#c9a23d", tunica2: "#8f7025" }} casco="legion" malla {...gesto(t, [[a, "escribe"], [b - 0.3, "triste"], [c, "habla"]])} />
      <div style={{ position: "absolute", inset: 0 }}><TablillaGrande t={t} t0={a + 0.3} x={1090} y={420} w={1380} vel={30} titulo="MASCLUS, CAVALRY OFFICER → CERIALIS, COMMANDER"
        lineas={["“Masclus to Cerialis, his king, greetings.", "Please, my lord, give instructions", "for what you want done tomorrow…”"]} /></div>
      {t > b && <div style={{ position: "absolute", left: 420, right: 60, top: 760, height: 130, background: C.ambar, borderRadius: 20, transform: `scale(${ent(t, b)}) rotate(-2deg)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 700, fontSize: 64, color: C.noche }}>“MY FELLOW SOLDIERS HAVE NO BEER.”</div>}
      {t > c && <div style={{ position: "absolute", left: 560, right: 180, top: 910, height: 100, background: "#fff", borderRadius: 20, transform: `scale(${ent(t, c)}) rotate(1.5deg)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 700, fontSize: 54, color: C.noche }}>“PLEASE ORDER SOME TO BE SENT.”</div>}
      <Chip t={t} t0={T("it is a work request", D)} t1={T("he adds the real reason", D)} text="A WORK REQUEST…" color={C.teal} tinta={C.noche} x={1090} y={130} centro size={56} />
      <Chip t={t} t0={T("he adds the real reason", D)} text="…AND THE REAL REASON:" color={C.rojo} x={1090} y={130} centro size={56} />
    </AbsoluteFill>
  );
};
// la lista de compras de un pueblo chico
const LISTA: [string, string][] = [["barley", "BARLEY"], ["pork fat", "PORK FAT"], ["salt", "SALT"], ["fish sauce", "FISH SAUCE"], ["spices", "SPICES"], ["chickens", "CHICKENS"], ["vintage wine", "VINTAGE WINE · OFFICERS"], ["celtic beer", "CELTIC BEER · EVERYONE ELSE"], ["and grain in", "GRAIN… STAGGERING AMOUNTS"]];
const Lista: React.FC<{ t: number }> = ({ t }) => {
  const m = T("one merchant mentions", D);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #ffcf7a, #c9773a 85%)" }}>
      <Chip t={t} t0={T("other tablets read", D) + 0.3} t1={T("barley", 374)} text="A SHOPPING LIST FOR A SMALL TOWN" color={C.violeta} x={960} y={120} centro size={56} />
      {t < m + 0.2 && <Persona x={1700} y={1040} h={420} t={t} seed={3} ropa={TUNGRO} casco="legion" malla pantalon="#6b4a2f" {...gesto(t, [[T("other tablets read", D), "lee"], [T("barley", 374), "señala"], [T("vintage wine", 374), "festeja"], [T("celtic beer", 374), "festeja"], [T("and grain in", 374), "sorpresa"]])} />}
      {t < m + 0.2 && <Papiro t={t} x={820} y={560} w={1000} t0={T("other tablets read", D) + 0.2} tacha={false} titulo="VINDOLANDA · SHOPPING LIST" items={LISTA.map(([w, tx]) => ({ txt: tx, t0: T(w, 374) }))} />}
      {t > m && (
        <>
          {Array.from({ length: 27 }, (_, i) => <Item key={i} k="grano" x={140 + (i % 9) * 170} y={1000 - Math.floor(i / 9) * 150 - (1 - ent(t, m + i * 0.04)) * 900} s={0.7} />)}
          <Cu t={t} w="one merchant mentions" d={D} de={0} a={5000} sube={1.2} dur={5} y={190} size={150} suf=" MEASURES" color="#fff" dt={0.3} />
          {t > T("worrying about how", D) && <Persona x={1640} y={660} h={360} t={t} seed={81} ropa={CIVIL(3)} expr="miedo" bD={150} cD={150} bI={150} cI={150} aparece={T("worrying about how", D)} />}
          <Emote t={t} t0={T("worrying about how", D) + 0.2} tipo="sudor" x={1650} y={420} s={0.9} />
        </>
      )}
    </AbsoluteFill>
  );
};
// lluvia de zapatos: botas, sandalias, zapatitos
const Zapatos: React.FC<{ t: number }> = ({ t }) => {
  const a = T("and shoes", D), b = T("archaeologists have pulled", D);
  const n = Math.min(160, Math.floor(Math.max(0, t - a) * (t > b ? 60 : 12)));
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#9fc6e0,#e0eef6)" }}>
      {Array.from({ length: n }, (_, i) => {
        const t0 = a + i / (i < 16 ? 12 : 60) + (i < 16 ? 0 : (b - a) - 16 / 60);
        const k = Math.min(1, Math.max(0, (t - t0) / 0.5));
        const x = 60 + ((i * 211) % 1800), yF = 1000 - Math.floor(i / 12) * 34 - ((i * 37) % 40);
        const s = i % 5 === 4 ? 0.45 : i % 3 === 0 ? 0.7 : 0.9;
        return <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(0px, ${(k - 1) * 1100}px) rotate(${(i * 47) % 60 - 30}deg)`, transformOrigin: `${x}px ${yF}px` }}><Bota x={x} y={yF} s={s} /></div>;
      })}
      <Persona x={960} y={1060 + 260 * prog(t, b, b + 3.5)} h={360} t={t} seed={3} ropa={TUNGRO} casco="legion" malla {...gesto(t, [[a, "sorpresa"], [a + 0.9, "señala"], [b, "miedo"]])} />
      {t > b && <Cu t={t} w="archaeologists have pulled" d={D} de={0} a={5000} sube={2.4} dur={4.2} y={200} size={140} pre="" suf="+ SHOES" color="#fff" dt={0.2} />}
      {[["mens boots", "MEN'S BOOTS", 400], ["womens sandals", "WOMEN'S SANDALS", 960], ["tiny shoes for children", "TINY SHOES FOR CHILDREN", 1500]].map(([w, tx, x], i) => t > T(w as string, D) ? <Chip key={i} t={t} t0={T(w as string, D)} text={tx as string} color={[C.violeta, C.rosa, C.ambar][i]} tinta={i === 2 ? C.noche : "#fff"} x={x as number} y={360 + i * 90} centro size={50} /> : null)}
    </AbsoluteFill>
  );
};

export const W3: React.FC<{ t: number; c: Cam }> = ({ t }) => {
  if (t < 331 || t > 432) return null;
  const x0 = conv(t);
  const anda = t > T("so everything has to come", D) && t < T("so everything has to come", D) + 4.5 || (t > T("but here is the trap", D) + 1 && t < T("but here is the trap", D) + 7);
  const sinConv = t > T("the convoy simply stops", D);
  const feliz = t > T("yes", D) && t < T("one of the most famous", D);
  return (
    <>
      {/* el campo pelado donde no crece nada */}
      {t < 342 && [0, 1, 2, 3, 4, 5].map((i) => <g key={i}><svg style={{ position: "absolute", left: M3 - 300 + i * 180, top: BASE - 60, overflow: "visible" }} width={1} height={1}><path d="M 0 60 Q -4 20 6 0 M 0 60 Q 14 30 26 26" stroke="#6b8a3a" strokeWidth={6} fill="none" /><ellipse cx={0} cy={62} rx={50} ry={10} fill="#6b4a2f" /></svg></g>)}
      {/* el convoy */}
      {!sinConv && [0, 1, 2].map((i) => (
        <React.Fragment key={i}>
          <Carro x={x0 + i * 900} y={BASE - 120} t={anda ? t : 0} s={0.9} carga={i === 1 ? "barril" : "grano"} />
          <div style={{ position: "absolute", left: 0, top: 0, transform: "scaleX(-1)", transformOrigin: `${x0 + i * 900 - 470}px 0px` }}><Mula x={x0 + i * 900 - 470} y={BASE - 150} t={t} camina={anda ? 1.5 : 0} s={0.75} carga={false} /></div>
        </React.Fragment>
      ))}
      {!sinConv && <Persona x={x0 - 800} y={BASE} h={220} t={t} seed={83} ropa={CIVIL(1)} camina={anda ? 1.4 : 0} flip expr={t > 409 ? "miedo" : "neutro"} />}
      {/* vos y tus compañeros al pie del muro */}
      {[-560, -300].map((dx, i) => <Persona key={i} x={YO3 + dx} y={BASE} h={220} t={t} seed={50 + i} ropa={AUX(i + 1)} casco="legion" malla={i === 1} pantalon="#5a4a3a"
        {...gesto(t, [[331, "triste"], [T("so everything has to come", D) + 4.6, "carga"], [T("yes", D), "festeja"], [T("one of the most famous", D), "habla"], [T("because the wall", D), "habla"], [T("but here is the trap", D), "encoge"], [T("if the convoy is late", D), "triste"], [418, "tiembla"]])}
        manoD={feliz ? <g transform="translate(0 -40) scale(0.5)"><path d="M -60 -90 L 60 -90 L 50 100 L -50 100 Z" fill="#e8a83a" /><ellipse cx={0} cy={-92} rx={66} ry={22} fill="#fff8e8" /></g> : undefined} />)}
      <Persona x={YO3} y={BASE} h={240} t={t} seed={3} ropa={TUNGRO} casco="legion" malla pantalon="#6b4a2f" capa="#3f6b2a"
        expr={t < 342 ? "triste" : feliz ? "feliz" : t < 372 ? "neutro" : t < 374.7 ? "sorpresa" : t < 414 ? "neutro" : t < 418 ? "triste" : t < 421.7 ? "orgullo" : "miedo"}
        bD={t > T("you eat what you have", D) && t < T("if the beer does not come", D) ? 140 : t > T("you write a polite", D) && t < 421.7 ? 100 : feliz ? 160 : 12}
        cD={t > T("you eat what you have", D) && t < T("if the beer does not come", D) ? 130 : 20} salta={feliz ? Math.abs(Math.sin(t * 6)) * 24 : 0}
        manoD={t > T("you eat what you have", D) && t < T("if the beer does not come", D) ? <g transform="translate(0 -30) scale(0.6)"><ellipse rx={80} ry={40} fill="#a8621f" /><ellipse cy={-6} rx={74} ry={34} fill="#d98a35" /></g>
          : t > T("you write a polite", D) && t < 421.7 ? <rect x={-60} y={-80} width={120} height={80} rx={6} fill="#c9a46a" stroke="#8a6a3a" strokeWidth={5} /> : undefined} />
      {/* familias del muro */}
      {t > T("was never just a place", D) - 0.4 && t < 408.2 && [0, 1, 2, 3].map((i) => <Persona key={i} x={M3 - 1500 + i * 260} y={BASE} h={i % 2 ? 130 : 210} t={t} seed={90 + i} ropa={CIVIL(i + 2)} expr="feliz" aparece={T("was never just a place", D) - 0.4 + i * 0.15} mira={0.5} />)}
      {/* ladrones en la loma */}
      {t > T("past people who would", D) - 0.2 && t < 415 && [0, 1, 2].map((i) => <Picto key={i} x={CV0 - 2600 + i * 220} y={BASE - 10} s={1.1} t={t} seed={60 + i} sube={T("past people who would", D) + i * 0.15} />)}
    </>
  );
};

export const S3: React.FC<{ t: number; c: Cam }> = ({ t, c }) => {
  if (t < 331 || t > 432) return null;
  const yo = pant(YO3, cabeza(YO3, BASE, 240).y, c);
  const cargas: [string, string, React.ReactNode][] = [
    ["grain", "GRAIN", <Item k="grano" x={0} y={0} s={0.8} />], ["wine", "WINE", <Item k="olla" x={0} y={0} s={0.8} />], ["salt", "SALT", <Item k="saco" x={0} y={0} s={0.8} />],
    ["nails", "NAILS", <Item k="cadena" x={0} y={0} s={0.7} />], ["leather", "LEATHER", <Bota x={0} y={0} s={0.8} />],
  ];
  return (
    <>
      <CartelTrampa t={t} t0={331.18} n={3} titulo="THE SUPPLY LINE" color={C.naranja} />
      <Ch t={t} w="here is the thing" d={D} txt="THE END OF THE WORLD…" y={150} c="#2a2350" size={60} dur={2.3} />
      <Ch t={t} w="nothing grows there" d={D} txt="NOTHING YOU WANT TO EAT GROWS HERE" y={150} c={C.rojo} size={54} dur={2.4} />
      <Ch t={t} w="so everything has to come" d={D} txt="EVERYTHING COMES UP THE ROADS" y={150} c={C.violeta} size={60} dur={2.2} />
      {cargas.map(([w, tx, ic], i) => t > T(w, D) && t < T("and above all", D) + 0.3 ? (
        <div key={i} style={{ position: "absolute", left: 230 + i * 365 - 110, top: 760, width: 220, height: 220, transform: `scale(${ent(t, T(w, D))})` }}>
          <div style={{ position: "absolute", left: 110, top: 90 }}>{ic}</div>
          <Chip t={t} t0={T(w, D)} text={tx} color={[C.ambar, C.rojo, "#fff", "#5d6577", C.tierra][i]} tinta={i === 0 || i === 2 ? C.noche : "#fff"} x={110} y={210} centro size={44} />
        </div>
      ) : null)}
      <Ch t={t} w="and above all" d={D} txt="AND ABOVE ALL…" y={150} c={C.teal} tinta={C.noche} size={60} dur={0.9} />
      {t > T("beer", 345) && t < T("the soldiers on the northern", D) + 0.2 && <Barril x={960} y={600} s={1.6} t={t} t0={T("beer", 345)} />}
      <Gr t={t} w="yes beer" d={D} txt="YES. BEER." y={200} size={170} c={C.ambar} dur={1.6} />
      <Ch t={t} w="a local beer called" d={D} txt="CERVESA" y={150} c={C.ambar} tinta={C.noche} size={90} dur={3.6} dt={0.6} />
      <Ch t={t} w="they took it extremely" d={D} txt="TAKEN EXTREMELY SERIOUSLY" y={150} c={C.rojo} size={60} dur={2.0} />
      <Plano t={t} t0={T("one of the most famous", D) - 0.1} t1={T("that is it", D) - 0.1} desde={[960, 600]} fondo="#1b1240"><Masclus t={t} /></Plano>
      <Ch t={t} w="that is it" d={D} txt="THAT'S IT." y={150} c="#2a2350" size={70} dur={1.0} />
      <Gr t={t} w="that is the emergency" d={D} txt="THE EMERGENCY." y={200} size={150} c={C.rojo} borde="#fff" dur={1.6} />
      {t > T("that is the emergency", D) && t < T("other tablets read", D) + 0.2 && <Barril x={yo[0] + 340} y={yo[1] + 120} s={0.9 * c.z} t={t} t0={T("that is the emergency", D)} vacio />}
      <Plano t={t} t0={T("other tablets read", D) - 0.1} t1={T("and shoes", D) - 0.15} desde={[960, 600]} fondo="#c9773a"><Lista t={t} /></Plano>
      <Plano t={t} t0={T("and shoes", D) - 0.05} t1={T("because the wall", D) - 0.1} desde={[960, 1000]} fondo="#9fc6e0"><Zapatos t={t} /></Plano>
      <Gr t={t} w="was never just a place" d={D} txt="NOT JUST SOLDIERS." y={200} size={120} c={C.lima} dur={2.2} />
      <Gr t={t} w="but here is the trap" d={D} txt="BUT HERE'S THE TRAP." y={200} size={120} c={C.rojo} borde="#fff" dur={1.3} />
      <Ch t={t} w="all of this travels" d={D} txt="LONG ROADS" x={560} y={150} c={C.violeta} size={60} dur={3.6} />
      <Ch t={t} w="in carts" d={D} txt="CARTS" x={1000} y={150} c={C.tierra} size={60} dur={2.9} />
      <Ch t={t} w="in the rain" d={D} txt="RAIN" x={1380} y={150} c="#3d7fc9" size={60} dur={2.1} />
      <Ch t={t} w="past people who would" d={D} txt="THIEVES" y={260} c={C.rojo} size={70} dur={1.6} />
      <Ch t={t} w="if the convoy is late" d={D} txt="CONVOY LATE?" y={150} c={C.ambar} tinta={C.noche} size={66} dur={1.9} />
      <Ch t={t} w="you eat what you have" d={D} txt="EAT WHAT YOU HAVE" y={260} c="#2a2350" size={54} dur={1.6} />
      <Ch t={t} w="if the beer does not come" d={D} txt="NO BEER?" y={150} c={C.rojo} size={66} dur={1.5} />
      <Ch t={t} w="you write a polite" d={D} txt="WRITE A POLITE LETTER… AND WAIT" y={260} c={C.teal} tinta={C.noche} size={52} dur={2.2} />
      {t > T("and if a whole province", D) && t < T("remember that", D) && (
        <>
          {Array.from({ length: 8 }, (_, i) => { const k = (t * 0.9 + i / 8) % 1; const corta = t > T("the convoy simply stops", D); return corta && k > 0.5 ? null : <Moneda key={i} x={300 + k * 1320} y={380 + Math.sin(k * Math.PI) * -120} r={36} t={t} gira={2} />; })}
          <Ch t={t} w="and if a whole province" d={D} txt="A PROVINCE STOPS PAYING" y={150} c={C.rojo} size={60} dur={3.4} />
          {t > T("the convoy simply stops", D) && <Grande t={t} t0={T("the convoy simply stops", D)} text="…NO MORE CONVOYS" y={880} size={90} color="#fff" borde={C.noche} />}
        </>
      )}
      <Gr t={t} w="remember that" d={D} txt="REMEMBER THAT." y={200} size={140} c={C.ambar} dur={2.0} />
      <Ch t={t} w="we are going to come" d={D} txt="→ TRAP #7" y={330} c={C.rojo} size={64} dur={1.5} />
      <Emote t={t} t0={T("if the beer does not come", D)} t1={T("and if a whole province", D)} tipo="lagrimas" x={yo[0]} y={yo[1]} s={c.z * 0.5} />
    </>
  );
};
