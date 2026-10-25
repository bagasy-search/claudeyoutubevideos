import React from "react";
import { AbsoluteFill } from "remotion";
import { C, fontFamily, ent, prog, Chip, Grande, Emote, cabeza, Moneda, Bota, Pergamino } from "./kit";
import { Soldadito, Mula, Bolsa } from "./kit2";
import { Persona } from "./persona";
import { TOP, BASE, MC, K, Cam, Pal, Plano, CartelTrampa } from "./mundo";
import { Gr, Ch, T, ck, Yo, Otro, Carro, Barril, Burbuja, DiplomaBronce, Pin } from "./kit3";

// TRAMPA 7 · EL FINAL (746,5-822 s). La línea de abastecimiento vuelve: hacia el 400 Roma saca ejércitos de Britania,
// dejan de llegar monedas nuevas y se cae la cadena (sin monedas no hay paga, ni cerveza, ni botas, ni convoy); la carta
// de Honorio en el 410; vos, ya viejo en el muro, con la ciudadanía que te prometieron; el imperio que deja de
// contestar; ni batalla final: una carta y silencio. Y el repaso: el muro entero con los 7 pines que se encienden.
const D = 746;
const M7 = MC(7);
const YO7 = M7 + 330;

export const keys7: K[] = [
  [746.7, 36000, 560, 0.5], ck("remember the supply line", D, M7 - 1200, 600, 0.75), ck("by around the year 400", D, M7 - 600, 640, 0.55),
  ck("armies are being pulled", D, M7 + 400, 700, 0.7), ck("and something very small", D, M7, 600, 0.9), ck("think about what that means", D, YO7, 520, 1.2),
  ck("you have spent your whole life", D, YO7, 500, 1.45), ck("and now", D, YO7, 500, 1.6, 0), ck("no great final battle", D, YO7, 520, 1.0),
  ck("just a letter and then silence", D, YO7 - 200, 540, 0.6), [801.9, YO7 - 300, 540, 0.45], ck("why did nobody want", D, 22000, 430, 0.044),
  [818.0, 22000, 430, 0.045], [821.9, 22000, 430, 0.046],
];
export const amb7: [number, Pal][] = [[746.6, "atardecer"], [783.7, "atardecer"], [797.3, "gris"], [802.2, "dia"]];
export const lluvia7: [number, number][] = [[746.6, 0.15], [783.7, 0.05], [797.3, 0.3], [802.2, 0.1], [821.9, 0.1]];
export const sol7: [number, number, number, boolean?][] = [[746.6, 1500, 500], [797.3, -999, 0], [802.2, 1400, 180]];

// 1) la línea de abastecimiento, otra vez: el camino del sur con carros
const Linea: React.FC<{ t: number }> = ({ t }) => {
  const a = T("remember the supply line", D);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#f2b880,#f7d9a8 60%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, bottom: 0, background: "#7fa05a" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 760, height: 90, background: "#b08a5a" }} />
      {[0, 1, 2].map((i) => {
        const x = -400 + ((t - a) * 260 + i * 700) % 2700;
        return (
          <React.Fragment key={i}>
            <Mula x={x + 300} y={760} s={0.55} t={t} camina={1} carga={false} />
            <Carro x={x} y={770} s={0.6} t={t} carga={i === 1 ? "barril" : "grano"} />
          </React.Fragment>
        );
      })}
      <Chip t={t} t0={a} text="THE SUPPLY LINE" color={C.ambar} tinta={C.noche} x={960} y={180} centro size={64} />
      <Grande t={t} t0={T("here is where it comes back", D)} text="← TRAP #3 IS BACK" y={340} size={90} color={C.crema} />
    </AbsoluteFill>
  );
};
// 2) la cadena: sin monedas no hay nada
const Cadena: React.FC<{ t: number }> = ({ t }) => {
  const m = T("new roman coins", D);
  const pasos: [string, string, React.ReactNode][] = [
    ["no coins", "COINS", <Moneda x={0} y={0} r={70} t={t} />],
    ["no pay", "PAY", <Bolsa x={0} y={0} s={0.6} txt="PAY" />],
    ["no beer", "BEER", <Barril x={0} y={0} s={0.55} />],
    ["no boots", "BOOTS", <Bota x={-60} y={-60} s={1.2} />],
    ["no convoy", "CONVOY", <Carro x={0} y={0} s={0.35} t={0} />],
  ];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #f6efe2, #d8c8ae 90%)" }}>
      {/* el chorro de monedas que se corta */}
      {t < T("no coins means", D) + 0.3 && Array.from({ length: 9 }, (_, i) => {
        const k = ((t - 755) * 0.7 + i / 9) % 1;
        if (t > m + 0.8 && k > prog(t, m + 0.8, m + 2.2) * -1 + 1) return null;
        return <Moneda key={i} x={200 + k * 1520} y={420 - Math.sin(k * Math.PI) * 180} r={44} t={t} gira={2} />;
      })}
      {t > m && t < T("no coins means", D) + 0.3 && <Grande t={t} t0={m + 0.6} text="NEW COINS: STOPPED." y={820} size={100} color={C.rojo} borde="#fff" />}
      {pasos.map(([w, tx, ico], i) => {
        const t0 = i === 0 ? T("no coins means", D) : T(w, D);
        if (t < t0) return null;
        const x = 260 + i * 350;
        const tacha = prog(t, t0 + 0.3, t0 + 0.6);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 470, width: 0, height: 0, transform: `scale(${ent(t, t0)})` }}>
            <div style={{ position: "absolute", left: -140, top: -140, width: 280, height: 280, borderRadius: 40, background: "#fff", border: "8px solid #1b1240" }} />
            <div style={{ position: "absolute", left: 0, top: 0 }}>{ico}</div>
            <svg style={{ position: "absolute", left: -140, top: -140, overflow: "visible" }} width={280} height={280}>
              <line x1={30} y1={30} x2={250} y2={250} stroke={C.rojo} strokeWidth={26} strokeLinecap="round" pathLength={1} strokeDasharray={`${tacha} 1`} />
              <line x1={250} y1={30} x2={30} y2={250} stroke={C.rojo} strokeWidth={26} strokeLinecap="round" pathLength={1} strokeDasharray={`${tacha} 1`} />
            </svg>
            <div style={{ position: "absolute", left: -160, width: 320, top: 160, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 48, color: "#1b1240" }}>NO {tx}</div>
            {i > 0 && <div style={{ position: "absolute", left: -215, top: -40, fontFamily, fontWeight: 700, fontSize: 70, color: C.rojo }}>→</div>}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
// 3) la carta de Honorio
const Carta: React.FC<{ t: number }> = ({ t }) => {
  const a = T("the emperor honoros", D), s = T("it says", D);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #7a2a9a, #1b1240 85%)" }}>
      <Pergamino x={960} y={560} w={1100} abre={prog(t, a + 0.2, a + 1.2)} lineas={t > s ? 0 : 7} titulo="TO THE CITIES OF BRITAIN" />
      {t > T("you are on your own now", D) && <Grande t={t} t0={T("you are on your own now", D)} text="YOU ARE ON YOUR OWN NOW." y={520} size={84} color="#1b1240" borde="#f6efe2" />}
      {t > T("look after your own", D) && <Grande t={t} t0={T("look after your own", D)} text="LOOK AFTER YOUR OWN DEFENSE." y={660} size={70} color={C.rojo} borde="#f6efe2" />}
      <Chip t={t} t0={T("according to a later", D)} t1={a} text="A LATER HISTORIAN SAYS…" color={C.violeta} x={960} y={160} centro size={56} />
      {t > a && <Chip t={t} t0={a} text="EMPEROR HONORIUS" color={C.oro} tinta={C.noche} x={960} y={160} centro size={60} />}
      {t > T("more or less", D) && t < T("you are on your own now", D) + 0.4 && <Chip t={t} t0={T("more or less", D)} text="(MORE OR LESS)" color="#2a2350" x={960} y={250} centro size={44} />}
    </AbsoluteFill>
  );
};

export const W7: React.FC<{ t: number; c: Cam }> = ({ t }) => {
  if (t < 746 || t > 822.95) return null;
  const sacan = T("armies are being pulled", D);
  const viejo = T("think about what that means", D);
  const calla = T("just a letter and then silence", D);
  return (
    <>
      {/* los ejércitos se van del muro, hacia el sur (a la derecha) */}
      {t > sacan - 0.4 && t < viejo && Array.from({ length: 12 }, (_, i) => {
        const k = Math.max(0, t - sacan - i * 0.15);
        return <Soldadito key={i} x={M7 - 900 + (i % 6) * 170 + k * 240} y={BASE - (i < 6 ? 0 : 60)} s={1.2} t={t} seed={300 + i} avanza={1} />;
      })}
      {/* el puñado que queda en el muro */}
      {t > sacan && t < viejo && [0, 1].map((i) => <Otro key={i} i={i + 2} x={M7 - 300 + i * 260} y={TOP} t={t} expr="triste" mira={0.7} />)}
      {/* vos, ya viejo, en el muro */}
      {t > viejo - 0.4 && t < 802.2 && (
        <>
          <Yo x={YO7} y={TOP} h={250} t={t} frio viejo casco={false} expr={t > T("and now", 793) ? "triste" : t > T("and you got it", D) ? "orgullo" : "neutro"} habla={false} mira={t > calla ? 0.6 : 0} inclina={t > calla ? 6 : 0} />
          <Burbuja t={t} t0={T("you were promised citizenship", D)} t1={T("your father got it", D) - 0.1} x={YO7 - 420} y={TOP - 250} r={170}>
            <AbsoluteFill style={{ background: "linear-gradient(180deg,#ffe0a0,#ffb347)" }} /><DiplomaBronce x={156} y={156} t={t} t0={T("you were promised citizenship", D)} abre={1} s={0.4} />
          </Burbuja>
          <Burbuja t={t} t0={T("your father got it", D)} t1={T("and now", 793) - 0.1} x={YO7 - 420} y={TOP - 250} r={170}>
            <AbsoluteFill style={{ background: "linear-gradient(180deg,#bfe0f5,#7fa05a)" }} /><Persona x={156} y={300} h={250} t={t} seed={4} ropa={{ tunica: "#2e9b8f", tunica2: "#1c6a62", cinto: "#5a3418", piel: "#f2c09a", piel2: "#d99a72", pelo: "#a0602c" }} casco="legion" malla viejo expr="orgullo" />
          </Burbuja>
          {t > T("has simply stopped writing", D) && <Emote t={t} t0={T("has simply stopped writing", D) + 0.4} t1={T("no great final battle", D)} tipo="preg" {...cabeza(YO7, TOP, 250)} s={0.5} />}
        </>
      )}
      {/* los 7 pines sobre los milecastles (igual que en el gancho), que se encienden con la lista */}
      {t > 802.4 && ["POSTING", "WEATHER", "SUPPLY", "BOREDOM", "NEIGHBORS", "THE NORTH", "THE END"].map((ic, i) => {
        const L = ["a posting at the edge", "rain that never stops", "beer that might not come", "boredom that lasts", "neighbors who might stab", "enemies who might be paid", "and an empire that might"];
        const t0 = T(L[i], D);
        const act = t > t0 && (i === 6 || t < T(L[i + 1], D));
        return <Pin key={i} t={t} t0={802.6 + i * 0.12} n={i + 1} x={MC(i + 1)} y={TOP - 520} s={act ? 26 : 19} icono={ic} act={act} />;
      })}
    </>
  );
};

export const S7: React.FC<{ t: number; c: Cam }> = ({ t }) => {
  if (t < 746 || t > 823) return null;
  const L: [string, string, string][] = [
    ["a posting at the edge", "THE EDGE OF THE WORLD", C.violeta], ["rain that never stops", "RAIN. FOREVER.", "#3d7fc9"],
    ["beer that might not come", "MAYBE-BEER", C.ambar], ["boredom that lasts", "YEARS OF BOREDOM", "#4a4a5a"],
    ["neighbors who might stab", "STABBY NEIGHBORS", C.rojo], ["enemies who might be paid", "PAID-OFF SCOUTS", "#2a2350"],
    ["and an empire that might", "AN EMPIRE THAT FORGETS YOU", C.rojo],
  ];
  return (
    <>
      <CartelTrampa t={t} t0={746.49} n={7} titulo="THE ENDING" color={C.rojo} />
      <Plano t={t} t0={T("remember the supply line", D) - 0.1} t1={T("by around the year 400", D) - 0.15} desde={[960, 700]} fondo="#f2b880"><Linea t={t} /></Plano>
      <Gr t={t} w="by around the year 400" d={D} txt="AD 400" y={220} size={170} c={C.ambar} dur={1.6} />
      <Ch t={t} w="rome is in deep trouble" d={D} txt="ROME: IN DEEP TROUBLE EVERYWHERE" y={150} c={C.rojo} size={58} dur={1.9} />
      <Ch t={t} w="armies are being pulled" d={D} txt="ARMIES PULLED OUT OF BRITAIN →" y={150} c={C.violeta} size={56} dur={2.3} />
      {["EMPEROR?", "EMPEROR?", "EMPEROR?"].map((x, i) => <Ch key={i} t={t} w="to fight for one" d={D} txt={"👑 " + x} x={560 + i * 400} y={290} c={C.oro} tinta={C.noche} size={46} dur={2.6 - i * 0.35} dt={i * 0.35} />)}
      <Ch t={t} w="and something very small" d={D} txt="SOMETHING VERY SMALL…" y={150} c="#2a2350" size={60} dur={1.8} />
      <Gr t={t} w="very deadly" d={D} txt="…AND VERY DEADLY" y={280} size={90} c={C.rojo} borde="#fff" dur={1.6} />
      <Plano t={t} t0={T("new roman coins", D) - 0.1} t1={T("around the year 410", D) - 0.15} desde={[960, 540]} fondo="#d8c8ae"><Cadena t={t} /></Plano>
      <Gr t={t} w="around the year 410" d={D} txt="AD 410" y={540} size={220} c={C.crema} dur={1.6} />
      <Plano t={t} t0={T("according to a later", D) - 0.1} t1={T("think about what that means", D) - 0.15} desde={[960, 540]} fondo="#1b1240"><Carta t={t} /></Plano>
      <Ch t={t} w="think about what that means" d={D} txt="WHAT THAT MEANS FOR YOU" y={150} c={C.violeta} size={56} dur={2.0} />
      <Gr t={t} w="you have spent your whole life" d={D} txt="YOUR WHOLE LIFE · ON THIS WALL" y={160} size={70} c={C.crema} dur={2.8} />
      <Ch t={t} w="you were promised citizenship" d={D} txt="CITIZENSHIP: PROMISED" y={150} c={C.oro} tinta={C.noche} size={56} dur={1.7} />
      <Ch t={t} w="and you got it" d={D} txt="✓ AND YOU GOT IT" y={250} c={C.lima} tinta={C.noche} size={56} dur={0.95} />
      <Ch t={t} w="your father got it" d={D} txt="✓ SO DID YOUR FATHER" y={150} c={C.lima} tinta={C.noche} size={56} dur={2.2} />
      <Gr t={t} w="has simply stopped writing" d={D} txt="ROME STOPPED WRITING BACK." y={160} size={84} c="#fff" dur={2.8} />
      <Ch t={t} w="no great final battle" d={D} txt="✗ NO GREAT FINAL BATTLE" y={150} c="#4a4a5a" size={56} dur={2.5} />
      <Ch t={t} w="no last stand" d={D} txt="✗ NO LAST STAND" y={250} c="#4a4a5a" size={56} dur={1.15} />
      <Gr t={t} w="just a letter and then silence" d={D} txt="JUST A LETTER. THEN SILENCE." y={200} size={80} c="#fff" dur={2.0} />
      <Gr t={t} w="why did nobody want" d={D} txt="WHY DID NOBODY WANT TO GUARD IT?" y={880} size={86} c={C.crema} dur={2.9} />
      <Ch t={t} w="look at the list" d={D} txt="LOOK AT THE LIST." y={150} c={C.rojo} size={60} dur={1.1} />
      {L.map(([w, tx, col], i) => <Ch key={i} t={t} w={w} d={D} txt={`#${i + 1} · ${tx}`} y={880} c={col} tinta={col === C.ambar ? C.noche : "#fff"} size={64} dur={(i < 6 ? T(L[i + 1][0], D) : 822.0) - T(w, D) - 0.1} />)}
    </>
  );
};
