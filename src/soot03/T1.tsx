import React from "react";
import { AbsoluteFill } from "remotion";
import { C, fontFamily, ent, prog, Chip, Grande, Emote, cabeza, Pergamino, MapaPuntos, lugar, Rayos } from "./kit";
import { Denario, Soldadito } from "./kit2";
import { Persona, CENTURION, LUCIUS, CIVIL } from "./persona";
import { TOP, BASE, MC, K, Cam, Pal, Plano, CartelTrampa, pant } from "./mundo";
import { Exterior } from "./escenas4";
import { Adriano } from "./escenas5";
import { Yo, Picto, DiplomaBronce, Gr, Cu, Sale, Ch, T, ck, Actua } from "./kit3";

// TRAMPA 1 · EL DESTINO (48,3-182,6 s). El muro se DESARMA al año 122 y lo levantan las legiones delante nuestro;
// corte transversal (zanja · muro · camino · vallum); fuertes que se encienden; el muro que "encogió en el lavado";
// el protagonista cae del cielo en su puesto; mapa de los orígenes; la paga y el diploma; atrapado entre dos lados.
const D = 48;
const M1 = MC(1);
const OB0 = 600, OB1 = 7600;
const u1 = (t: number) => (t < 50.6 ? 1 : t < 68.4 ? 1 - prog(t, 50.6, 51.6) : prog(t, 68.4, 78.6));
export const obra1 = (t: number): [number, number, number] | null => (t > 49 && t < 80 ? [OB0, OB1, u1(t)] : null);
const frente = (t: number) => OB0 + (OB1 - OB0) * u1(t);
const YOX = M1 + 330;

export const keys1: K[] = [
  [48.6, M1, 520, 0.62], ck("year 122", D, M1 - 300, 600, 0.45), ck("hadrian has just", D, 3150, 700, 1.45), ck("biographer", D, 3260, 770, 1.9),
  ck("he was the first", D, 3260, 770, 1.9), ck("80 miles long", D, 4000, 600, 0.4, 0.5), ck("to separate the", D, 4000, 520, 0.42),
  ck("80 roman miles", D, 4000, 560, 0.35), [68.6, 487, 700, 1.1], [70.0, 1448, 700, 1.05], [71.5, 2477, 700, 1.0], [73.0, 3507, 700, 1.0], [74.5, 4536, 700, 0.95], ck("a small fort every", D, M1, 560, 0.48), ck("two watchtowers", D, 7000, 520, 0.2),
  ck("behind it", D, 7000, 520, 0.2, -0.3), ck("and eventually", D, 19000, 600, 0.036), ck("changed their minds", D, 6900, 640, 0.9),
  ck("the wall was planned", D, 6900, 640, 0.9), ck("then the legions go home", D, 5600, 640, 0.6), ck("needs somebody", D, M1 + 200, 560, 0.62),
  ck("that somebody is you", D, YOX, 470, 1.9), ck("you are an auxiliary", D, YOX + 60, 470, 1.6), ck("not a citizen of rome", D, YOX + 60, 470, 1.8),
  ck("rome recruited men", D, YOX - 120, 500, 1.35), ck("your pay is lower", D, YOX + 200, 480, 1.4), ck("and your reward", D, YOX + 160, 460, 1.6),
  ck("so on paper", D, YOX + 100, 470, 1.4), ck("in practice", D, YOX, 480, 1.0), ck("who do not consider", D, YOX - 200, 500, 1.25),
  ck("to protect them", D, YOX, 470, 1.15), ck("that was the good news", D, YOX, 440, 1.5), [182.3, YOX, 450, 1.3],
];
export const amb1: [number, Pal][] = [[48.4, "gris"], [50.6, "dia"], [110.8, "gris"], [171.9, "tormenta"]];
export const lluvia1: [number, number][] = [[48.5, 0.25], [50.6, 0], [171.6, 0], [173, 0.85], [182.5, 0.7]];
export const sol1: [number, number, number][] = [[50.6, 1500, 220], [110.8, -999, 0]];

const LEGION = [{ t: "II AUGUSTA", c: "#c81d2e" }, { t: "VI VICTRIX", c: "#2b6fd6" }, { t: "XX VALERIA VICTRIX", c: "#2e9b5a" }];
const FUERTES = [-6800, -3200, 1000, 9600, 13200, 16400, 20600, 23400, 27800, 31200, 34800, 38600, 41600, 45000];

// legionario constructor con un bloque al hombro
const Obrero: React.FC<{ t: number; x: number; i: number; carga: boolean }> = ({ t, x, i, carga }) => (
  <Persona x={x} y={BASE} h={200} t={t} seed={60 + i} ropa={LUCIUS} casco="legion" camina={carga ? 1.2 : 0} flip={i % 2 === 1}
    bD={carga ? 160 : 40 + Math.sin(t * 6 + i) * 30} cD={carga ? 30 : 60}
    manoD={carga ? <rect x={-50} y={-70} width={100} height={56} rx={6} fill="#c9b8a0" stroke="#8a7a64" strokeWidth={6} /> : undefined} expr={i % 3 === 0 ? "enojado" : "neutro"} />
);
export const Laurel: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <svg style={{ position: "absolute", left: x - 120 * s, top: y - 60 * s, overflow: "visible" }} width={240 * s} height={120 * s} viewBox="-120 -60 240 120">
    {[-1, 1].map((k) => Array.from({ length: 6 }, (_, i) => <ellipse key={k + "" + i} cx={k * (30 + i * 15)} cy={-18 + i * 9} rx={16} ry={8} fill="#5fa23a" transform={`rotate(${k * (20 + i * 12)} ${k * (30 + i * 15)} ${-18 + i * 9})`} />))}
  </svg>
);

export const W1: React.FC<{ t: number; c: Cam }> = ({ t }) => {
  if (t < 48 || t > 183) return null;
  const f = frente(t);
  return (
    <>
      {/* Adriano entra caminando y señala */}
      {t > 52.8 && t < 68.6 && (() => {
        const x = 2500 + 700 * prog(t, 53.0, 56.0);
        const cb = cabeza(x, BASE, 330);
        return (
          <>
            <Persona x={x} y={BASE} h={330} t={t} seed={88} ropa={{ ...CIVIL(0), tunica: "#7a2a9a", tunica2: "#4a1a6a" }} viejo camina={t < 56 ? 1.3 : 0}
              expr={t > 62.5 && t < 65 ? "enojado" : "orgullo"} habla={t > 58.8 && t < 64.5} bD={t > 58.8 ? 120 : 10} cD={t > 58.8 ? 10 : 10} mira={0.6} />
            <Laurel x={cb.x} y={cb.y - 70 * cb.s} s={cb.s} />
          </>
        );
      })()}
      {/* línea punteada donde va a ir el muro */}
      {t > 58.8 && t < 68.6 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
          <line x1={OB0} y1={BASE - 6} x2={OB0 + (OB1 - OB0) * prog(t, 60.3, 62.2)} y2={BASE - 6} stroke={C.rojo} strokeWidth={22} strokeDasharray="60 40" />
        </svg>
      )}
      {/* obreros que levantan el muro en el frente de obra */}
      {t > 68.3 && t < 80 && [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <Obrero key={i} t={t} i={i} x={f - 1300 + i * 230 + (i % 2 ? Math.sin(t * 2 + i) * 60 : 0)} carga={i % 2 === 0} />)}
      {/* andamio y grúa de rueda (treadwheel) en el frente de obra */}
      {t > 68.3 && t < 80 && (
        <svg style={{ position: "absolute", left: f - 80, top: TOP - 520, overflow: "visible" }} width={1} height={1}>
          <line x1={0} y1={820} x2={60} y2={0} stroke="#7a4a22" strokeWidth={22} /><line x1={60} y1={0} x2={360} y2={60} stroke="#7a4a22" strokeWidth={18} />
          <line x1={340} y1={60} x2={340} y2={60 + 300 + Math.sin(t * 3) * 120} stroke="#3a2a1a" strokeWidth={6} />
          <rect x={290} y={360 + Math.sin(t * 3) * 120} width={100} height={60} rx={6} fill="#d8c8ae" stroke="#8a7a64" strokeWidth={6} />
          <g transform={`translate(-60 700) rotate(${t * 140})`}><circle r={120} fill="none" stroke="#7a4a22" strokeWidth={16} />{[0, 45, 90, 135].map((a) => <line key={a} x1={-120} y1={0} x2={120} y2={0} stroke="#7a4a22" strokeWidth={10} transform={`rotate(${a})`} />)}</g>
        </svg>
      )}
      {t > 68.3 && t < 79 && [0, 1, 2].map((i) => {
        const k = ((t * 1.6 + i / 3) % 1);
        return <div key={"b" + i} style={{ position: "absolute", left: f - 40 + i * 30, top: TOP - 900 + k * (900 + 60), width: 110, height: 60, borderRadius: 8, background: "#d8c8ae", border: "6px solid #8a7a64", transform: `rotate(${(1 - k) * 90}deg)`, opacity: k < 0.95 ? 1 : 0 }} />;
      })}
      {/* polvo del derrumbe al año 122 */}
      {t > 50.5 && t < 52.6 && Array.from({ length: 18 }, (_, i) => {
        const k = prog(t, 50.5 + i * 0.05, 52.4);
        return <div key={"p" + i} style={{ position: "absolute", left: OB0 + i * 390 + Math.sin(i) * 80, top: TOP + 100 - k * 300, width: 260 + k * 200, height: 260 + k * 200, borderRadius: "50%", background: "#e8dcc8", opacity: 0.7 * (1 - k) }} />;
      })}
      {/* los fuertes enchufados a la línea (vista lejana) */}
      {t > 88 && t < 93 && FUERTES.map((x, i) => {
        const e = ent(t, 89.16 + i * 0.12);
        return <div key={x} style={{ position: "absolute", left: x - 1300, top: TOP - 700, width: 2600, height: 1700, transform: `scale(${e})`, transformOrigin: "50% 100%", background: "#e0cfa8", border: "120px solid #8a6a4a", borderRadius: 160, boxShadow: "0 0 0 60px #fff" }}>{[0, 1, 2, 3].map((k) => <div key={k} style={{ position: "absolute", left: 160, right: 160, top: 160 + k * 340, height: 200, background: k % 2 ? "#b5452c" : "#c9673f", borderRadius: 30 }} />)}</div>;
      })}
      {/* cartel de "se busca" en el muro vacío */}
      {t > 113.5 && t < 117.5 && (
        <div style={{ position: "absolute", left: M1 + 600, top: TOP + 60, width: 260, height: 200, background: "#f6e3b4", border: "8px solid #8a5a2a", transform: `scale(${ent(t, 114.1)}) rotate(-4deg)`, fontFamily, fontWeight: 700, fontSize: 40, color: C.rojo, textAlign: "center", paddingTop: 30, lineHeight: 1.1 }}>GUARD<br />WANTED</div>
      )}
      {/* el protagonista cae del cielo */}
      {t > 116.3 && t < 183 && (() => {
        const caida = Math.max(0, 1 - (t - 116.46) / 0.35);
        const yy = TOP - caida * caida * 1400;
        const cold = t > 171.9;
        return (
          <>
            <Actua t={t} x0={YOX} x1={YOX} y={yy} h={230} frio={cold}
              beats={[[116.3, "sorpresa"], [117.7, "triste"], [T("not a legionary", D), "niega"], [T("you are an auxiliary", D), "encoge"], [T("a provincial", D), "habla"], [T("not a citizen of rome", D), "triste"],
                [T("your pay is lower", D), "niega"], [T("contract is the same", D), "encoge"], [T("and your reward", D), "sorpresa"], [T("called a diploma", D), "festeja"],
                [T("archaeologists have found", D), "lee"], [T("a quarter of a century", D), "duerme"], [T("two little pieces", D), "encoge"], [T("on paper", D), "festeja"], [T("in practice", D), "sorpresa"],
                [T("dampest corner", D), "tiembla"], [T("not consider you one of them", D), "triste"], [T("consider you the enemy", D), "miedo"]]} />
            {/* la familia aparece con el diploma */}
            {t > T("your wife", D) && t < T("archaeologists have found", D) + 0.3 && <Persona x={YOX + 190} y={TOP} h={210} t={t} seed={71} ropa={CIVIL(2)} aparece={T("your wife", D)} expr="feliz" bD={140} cD={30} habla />}
            {t > T("your children", D) && t < T("archaeologists have found", D) + 0.3 && [0, 1].map((k) => <Persona key={k} x={YOX + 320 + k * 110} y={TOP} h={140} t={t} seed={72 + k} ropa={CIVIL(3 + k)} aparece={T("your children", D) + k * 0.15} expr="feliz" salta={T("your children", D) + 0.3 + k * 0.2} bD={150} bI={150} />)}
          </>
        );
      })()}
      {/* el oficial romano que te mira de arriba */}
      {t > 176.2 && t < 183 && <Persona x={YOX - 520} y={TOP} h={250} t={t} seed={91} ropa={CENTURION} casco="centurion" expr="enojado" aparece={176.46} mira={0.8} bD={70} cD={90} />}
    </>
  );
};
export const N1: React.FC<{ t: number; c: Cam }> = ({ t, c }) => {
  const vis = (t > 62.5 && t < 65.2) || (t > 178.2 && t < 183);
  if (!vis) return null;
  const bx = c.x * 0.62;
  return <>{Array.from({ length: 7 }, (_, i) => <Picto key={i} x={bx - 600 + i * 190} y={330 + (i % 2) * 20} s={t > 170 ? 1.05 : 0.7} t={t} seed={i + 30} sube={(t > 170 ? 178.4 : 62.6) + i * 0.06} grita />)}</>;
};

// corte transversal norte ↔ sur
const Corte: React.FC<{ t: number }> = ({ t }) => {
  const a = T("behind it", D), b = T("in front of it", D);
  const lab = (t0: number, txt: string, x: number, y: number, col: string) => t > t0 ? <Chip t={t} t0={t0} text={txt} color={col} x={x} y={y} centro size={48} /> : null;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#79c0e8,#cdeaf2)" }}>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <path d="M 0 640 L 330 640 L 400 760 L 520 760 L 590 640 L 760 640 L 760 640 L 1240 640 L 1320 600 L 1380 640 L 1440 760 L 1560 760 L 1620 640 L 1680 600 L 1760 640 L 1920 640 L 1920 1080 L 0 1080 Z" fill="#7fb34a" />
        <path d="M 0 700 L 1920 700 L 1920 1080 L 0 1080 Z" fill="#8a5a2a" opacity={0.35} />
        {/* muro (sube) */}
        <rect x={700} y={640 - 340 * prog(t, a - 0.6, a)} width={90} height={340 * prog(t, a - 0.6, a)} fill="#d8c8ae" stroke="#8a7a64" strokeWidth={6} />
        <rect x={900} y={632} width={260} height={16} fill="#c9a36a" opacity={prog(t, a, a + 0.4)} />
        {/* vallum */}
        {t > a + 0.8 && <path d={`M 1300 640 Q 1320 ${640 - 50 * prog(t, a + 0.8, a + 1.3)} 1360 640 M 1640 640 Q 1660 ${640 - 50 * prog(t, a + 0.8, a + 1.3)} 1700 640`} stroke="#5f8a3a" strokeWidth={30} fill="none" />}
        {t > a + 0.6 && <path d="M 1400 642 L 1450 755 L 1550 755 L 1600 642" fill="#4a3018" opacity={prog(t, a + 0.6, a + 1.2)} />}
        {t > b && <path d="M 340 642 L 400 755 L 520 755 L 580 642" fill="#4a3018" opacity={prog(t, b, b + 0.5)} />}
      </svg>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily, fontWeight: 700, fontSize: 54, color: "#2a2350" }}>← NORTH</div>
      <div style={{ position: "absolute", right: 40, top: 40, fontFamily, fontWeight: 700, fontSize: 54, color: "#2a2350" }}>SOUTH →</div>
      <Persona x={745} y={300 + 640 - 340 * prog(t, a - 0.6, a) - 300} h={140} t={t} seed={3} ropa={LUCIUS} casco="legion" aparece={a} />
      {lab(a - 0.4, "THE WALL", 745, 230, C.violeta)}
      {lab(a + 0.3, "MILITARY ROAD", 1030, 560, C.ambar)}
      {lab(T("called the vallum", D), "THE VALLUM", 1500, 860, C.rojo)}
      {lab(b + 0.3, "ANOTHER DITCH", 460, 860, C.rojo)}
    </AbsoluteFill>
  );
};
// el muro ancho que se angosta (vista de arriba) y los pantalones encogidos
const Ancho: React.FC<{ t: number }> = ({ t }) => {
  const n = T("built narrower", D), p = T("like a pair of trousers", D), t0 = T("the wall was planned", D);
  const w = 600 - 180 * prog(t, n - 0.1, n + 0.9);
  const tf = T("thick foundations", D);
  return (
    <AbsoluteFill style={{ background: t < p ? "transparent" : "radial-gradient(circle at 50% 40%, #9b7bf0, #2d1b69 75%)" }}>
      {t < p && (
        <>
          <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
            <rect x={0} y={900} width={1920} height={180} fill="#5f8a3a" />
            {/* cimientos anchos (10 pies) que quedan */}
            <rect x={660} y={840} width={600} height={60} fill="#a8967a" stroke={t > tf ? C.teal : "#6a5a44"} strokeWidth={t > tf ? 12 : 6} />
            {/* muro: hiladas que bajan al levantarse */}
            {Array.from({ length: 8 }, (_, k) => {
              const ek = prog(t, t0 + 0.2 + k * 0.12, t0 + 0.5 + k * 0.12);
              return <rect key={k} x={960 - w / 2} y={785 - k * 55 - (1 - ek) * 300} width={w} height={55} fill={k % 2 ? "#d8c8ae" : "#cdbb9e"} stroke="#8a7a64" strokeWidth={5} opacity={ek} />;
            })}
            {/* cota */}
            <line x1={960 - w / 2} y1={965} x2={960 + w / 2} y2={965} stroke="#fff" strokeWidth={8} />
            <line x1={960 - w / 2} y1={940} x2={960 - w / 2} y2={990} stroke="#fff" strokeWidth={8} />
            <line x1={960 + w / 2} y1={940} x2={960 + w / 2} y2={990} stroke="#fff" strokeWidth={8} />
            {/* piedras que vuelan cuando lo angostan */}
            {t > n - 0.1 && t < n + 1.6 && Array.from({ length: 8 }, (_, i) => {
              const k = prog(t, n - 0.1 + i * 0.1, n + 0.7 + i * 0.1);
              const sx = i % 2 ? 1 : -1;
              return <rect key={i} x={960 + sx * (300 - 40) + sx * k * (260 + i * 30)} y={420 + i * 45 - Math.sin(k * Math.PI) * 220 + k * 300} width={60} height={34} rx={4} fill="#cdbb9e" stroke="#8a7a64" strokeWidth={4} transform={`rotate(${k * 400 * sx} ${960 + sx * 300} 430)`} opacity={1 - prog(t, n + 1.2, n + 1.6)} />;
            })}
          </svg>
          {/* obrero arriba del muro que pica piedra */}
          <Actua t={t} x0={960 - w / 2 + 80} x1={960 - w / 2 + 80} y={345} h={170} quien={1} beats={[[t0, "habla"], [n - 0.4, "cava"], [n + 1.5, "festeja"]]} />
          {/* soldado al lado: la escala humana */}
          <Actua t={t} x0={1900} x1={1480} y={900} h={330} quien={3} beats={[[t0 + 0.2, "camina"], [t0 + 1.2, "señala"], [n, "sorpresa"], [n + 1.0, "niega"], [tf, "señala"]]} />
          {t < n && <Grande t={t} t0={T("10 roman feet", D)} text="10 ROMAN FEET" y={110} size={96} color={C.ambar} />}
          {t > n && <Grande t={t} t0={n} text="→ 6-8 FEET" y={110} size={96} color={C.rojo} borde="#fff" />}
          {t > tf && <Chip t={t} t0={tf} text="← FOUNDATIONS: STILL 10 FT" color={C.teal} tinta={C.noche} x={1560} y={1030} centro size={46} />}
        </>
      )}
      {t >= p && (() => {
        const k = prog(t, p + 0.6, p + 1.6);
        return (
          <>
            <svg style={{ position: "absolute", left: 960 - 300, top: 260, overflow: "visible" }} width={600} height={600} viewBox="-300 -300 600 600">
              <ellipse cx={0} cy={210} rx={290} ry={70} fill="#7d8796" />
              <path d="M -290 210 L -250 -40 L 250 -40 L 290 210 Z" fill="#9aa4b4" />
              {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={-200 + i * 45 + Math.sin(t * 3 + i) * 8} cy={-60 - ((t * 60 + i * 30) % 160)} r={20 + (i % 3) * 8} fill="#fff" opacity={0.8} />)}
              <g transform={`translate(0 ${-80 + Math.sin(t * 7) * 6}) scale(${1 - 0.45 * k})`}>
                <path d="M -110 -160 L 110 -160 L 120 160 L 30 160 L 0 -10 L -30 160 L -120 160 Z" fill="#3d7fc9" stroke="#25548f" strokeWidth={10} />
              </g>
            </svg>
            <Chip t={t} t0={p} text="SHRANK IN THE WASH" color={C.rosa} x={960} y={170} centro size={70} />
            <Actua t={t} x0={1950} x1={1460} y={980} h={420} quien={0} casco={false} beats={[[p, "camina"], [p + 0.8, "sorpresa"], [p + 1.6, "triste"]]} />
          </>
        );
      })()}
    </AbsoluteFill>
  );
};
// mapa de los orígenes: rutas DESDE cada borde HACIA Britania
const ORIG: { w: string; a: string; txt: string; dx?: number }[] = [
  { w: "belgians", a: "GAUL", txt: "BELGIANS" }, { w: "dutch", a: "GERMANY", txt: "DUTCH", dx: -170 }, { w: "spaniards", a: "SPAIN", txt: "SPANIARDS" },
  { w: "germans", a: "GERMANY", txt: "GERMANS", dx: 170 }, { w: "romanians from dacia", a: "DANUBE", txt: "DACIANS" }, { w: "archers from syria", a: "SYRIA", txt: "SYRIAN ARCHERS" },
  { w: "moors from north africa", a: "AFRICA", txt: "MOORS" }, { w: "a unit of boatmen", a: "SYRIA", txt: "TIGRIS BOATMEN", dx: 160 },
];
const Origenes: React.FC<{ t: number }> = ({ t }) => {
  const b = lugar("BRITAIN");
  const z = 1 + 2.2 * prog(t, T("stationed at the mouth", D), T("stationed at the mouth", D) + 1.6);
  return (
    <AbsoluteFill style={{ transformOrigin: `${b.x}px ${b.y}px`, transform: `scale(${z})` }}>
      <MapaPuntos t={t} enciende={[T("rome recruited", D), T("rome recruited", D) + 2]} desde="ROME" brillo={C.ambar} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {ORIG.map((o, i) => {
          const t0 = T(o.w, D);
          if (t < t0) return null;
          const l = lugar(o.a), x0 = l.x + (o.dx ?? 0) * 0.3, y0 = l.y + (o.dx ?? 0) * 0.2;
          const u = prog(t, t0, t0 + 0.6);
          const mx = (x0 + b.x) / 2, my = Math.min(y0, b.y) - 120;
          return <g key={i}><path d={`M ${x0} ${y0} Q ${mx} ${my} ${b.x} ${b.y}`} stroke={i === 7 ? C.teal : "#fff"} strokeWidth={6} fill="none" pathLength={1000} strokeDasharray={`${u * 1000} 1000`} /><circle cx={x0} cy={y0} r={14} fill={C.rojo} stroke="#fff" strokeWidth={4} /></g>;
        })}
        <circle cx={b.x} cy={b.y} r={18 + Math.sin(t * 6) * 4} fill={C.ambar} stroke="#fff" strokeWidth={5} />
      </svg>
      {/* un soldadito marcha por cada ruta hasta Britania */}
      {ORIG.map((o, i) => {
        const t0 = T(o.w, D);
        if (t < t0 + 0.2) return null;
        const l = lugar(o.a), x0 = l.x + (o.dx ?? 0) * 0.3, y0 = l.y + (o.dx ?? 0) * 0.2;
        const mx = (x0 + b.x) / 2, my = Math.min(y0, b.y) - 120;
        const u = prog(t, t0 + 0.2, t0 + 3.2), q = 1 - u;
        const px = q * q * x0 + 2 * q * u * mx + u * u * b.x, py = q * q * y0 + 2 * q * u * my + u * u * b.y;
        return u < 1 ? <Soldadito key={i} x={px} y={py + 10} s={0.32} t={t} seed={i + 5} avanza={1} color={i === 7 ? C.teal : undefined} /> : null;
      })}
      {z < 1.15 && ORIG.map((o, i) => { const l = lugar(o.a); const t0 = T(o.w, D); return t > t0 ? <Chip key={i} t={t} t0={t0} text={o.txt} color={i === 7 ? C.teal : C.violeta} tinta={i === 7 ? C.noche : "#fff"} x={Math.max(200, Math.min(1720, l.x + (o.dx ?? 0)))} y={l.y + 50 + (i === 7 ? 60 : (i % 2) * 50)} centro size={42} /> : null; })}
      {t > T("stationed at the mouth", D) + 0.8 && <Chip t={t} t0={T("stationed at the mouth", D) + 0.8} text="ARBEIA · SOUTH SHIELDS" color={C.rojo} x={b.x + 30} y={b.y + 46} size={22} />}
    </AbsoluteFill>
  );
};
const Pila: React.FC<{ t: number; t0: number; n: number; x: number; y: number }> = ({ t, t0, n, x, y }) => (
  <>{Array.from({ length: n }, (_, i) => t > t0 + i * 0.05 ? <div key={i} style={{ position: "absolute", left: x - 110, top: y - i * 34 - 56, width: 220, height: 56, borderRadius: "50%", background: "linear-gradient(180deg,#f4f6fa,#b9c0cc)", border: "7px solid #6a7383", transform: `translateY(${(1 - ent(t, t0 + i * 0.05)) * -300}px)` }} /> : null)}</>
);

export const S1: React.FC<{ t: number; c: Cam }> = ({ t, c }) => {
  if (t < 48 || t > 183) return null;
  const yo = pant(YOX, cabeza(YOX, TOP, 230).y, c);
  return (
    <>
      <CartelTrampa t={t} t0={48.3} n={1} titulo="THE POSTING" color={C.rojo} />
      <Gr t={t} w="year 122" d={D} txt="AD 122" y={200} size={190} c={C.ambar} dur={2.4} />
      <Ch t={t} w="hadrian has just" d={D} txt="EMPEROR HADRIAN" y={140} c="#7a2a9a" dt={0.3} dur={2.3} />
      <Ch t={t} w="visited britain" d={D} txt="VISITS BRITAIN" y={230} c={C.teal} tinta={C.noche} size={50} dur={1.8} />
      {t > T("his biographer", D) && t < T("he was the first", D) + 0.2 && <Pergamino x={1440} y={520} w={480} abre={prog(t, T("his biographer", D), T("his biographer", D) + 0.6) * 0.7} titulo="HIS BIOGRAPHY" lineas={5} />}
      <Plano t={t} t0={T("he was the first", D) - 0.1} t1={T("80 miles long", D) - 0.45} desde={[960, 600]} fondo="#5fb4ea"><Adriano t={t} t0={T("he was the first", D) - 0.1} t1={T("80 miles long", D) - 0.45} /></Plano>
      <Ch t={t} w="he was the first" d={D} txt="“THE FIRST TO BUILD A WALL”" y={140} c={C.crema} tinta="#7a3d14" size={60} dur={2.5} />
      <Cu t={t} w="80 miles long" d={D} de={0} a={80} sube={0.8} dur={3.3} y={300} size={170} suf=" MILES" color={C.ambar} />
      {/* Adriano en primer plano señala la línea (de punta a punta) */}
      <Sale t={t} t0={T("80 miles long", D) - 0.4} t1={T("the legions build it", D) - 0.1}>
        <Actua t={t} x0={2150} x1={1640} y={1075} h={560} ropa={{ ...CIVIL(0), tunica: "#7a2a9a", tunica2: "#4a1a6a" }} casco={false} quien={48}
          beats={[[T("80 miles long", D) - 0.4, "camina"], [T("80 miles long", D) + 0.4, "señala"], [T("separate the romans", D), "habla"], [T("from the barbarians", D), "enojado"], [T("80 roman miles", D), "señala"], [T("73 of ours", D), "habla"]]} />
      </Sale>
      {/* contador de obra: millas levantadas */}
      {t > 68.6 && t < 79.5 && (
        <div style={{ position: "absolute", right: 60, top: 40, padding: "14px 28px", borderRadius: 22, background: "#2a1530", border: "6px solid #fff", fontFamily, fontWeight: 700, color: "#fff", fontSize: 44, transform: `scale(${ent(t, 68.6)})` }}>
          🧱 MILES BUILT: <span style={{ color: C.ambar }}>{Math.round(80 * prog(t, 68.6, 79))}</span> / 80
        </div>
      )}
      {/* capataz en primer plano que cuenta torres con los dedos */}
      <Sale t={t} t0={T("two watchtowers", D) - 0.2} t1={T("and eventually", D) - 0.2}>
        <Actua t={t} x0={-200} x1={300} y={1075} h={520} quien={2} beats={[[T("two watchtowers", D) - 0.2, "camina"], [T("two watchtowers", D) + 0.5, "señala"], [T("between each pair", D), "habla"]]} />
      </Sale>
      <Sale t={t} t0={T("more than a dozen", D) - 0.2} t1={T("the wall was planned", D) - 0.2}>
        <Actua t={t} x0={2100} x1={1600} y={1075} h={520} quien={4} beats={[[T("more than a dozen", D) - 0.2, "camina"], [T("more than a dozen", D) + 0.5, "sorpresa"], [T("changed their minds", D), "encoge"]]} />
      </Sale>
      <Ch t={t} w="separate the romans" d={D} txt="ROMANS" x={560} y={930} c={C.rojo} size={70} dur={2.2} />
      <Ch t={t} w="from the barbarians" d={D} txt="BARBARIANS" x={1360} y={170} c="#2a2350" size={70} dur={1.8} />
      <Ch t={t} w="80 roman miles" d={D} txt="80 ROMAN MILES" y={160} c={C.violeta} size={70} dur={3.2} />
      <Ch t={t} w="73 of ours" d={D} txt="= 73 MILES · 117 KM" y={260} c={C.ambar} tinta={C.noche} size={56} dur={1.6} />
      <Ch t={t} w="the legions build it" d={D} txt="THE LEGIONS BUILD IT" y={140} c={C.rojo} size={70} dur={1.2} />
      {LEGION.map((l, i) => <Ch key={i} t={t} w="three of them" d={D} dt={i * 0.25} txt={l.t} x={480 + i * 480} y={260} c={l.c} size={46} dur={1.9 - i * 0.2} />)}
      <Cu t={t} w="in about six years" d={D} de={0} a={6} sube={0.8} dur={0.95} y={170} size={160} suf=" YEARS" color={C.ambar} dt={0.3} />
      <Gr t={t} w="a stone curtain" d={D} txt="A STONE CURTAIN" y={180} size={120} dur={1.1} />
      <Ch t={t} w="as wide as a modern" d={D} txt="UP TO 3 METERS THICK" y={170} c={C.teal} tinta={C.noche} size={62} dur={2.6} />
      <Ch t={t} w="a small fort every" d={D} txt="EVERY ROMAN MILE" y={150} c={C.violeta} size={64} dur={2.1} />
      <Gr t={t} w="called a mile castle" d={D} txt="MILECASTLE" y={260} size={130} c={C.ambar} dur={1.4} />
      <Ch t={t} w="two watchtowers" d={D} txt="+ 2 WATCHTOWERS" y={160} c={C.rojo} size={64} dur={2.5} />
      <Plano t={t} t0={T("behind it", D) - 0.1} t1={T("and eventually", D) - 0.2} desde={[960, 700]} fondo="#79c0e8"><Corte t={t} /></Plano>
      <Ch t={t} w="more than a dozen" d={D} txt="12+ FORTS" y={200} c={C.rojo} size={110} dur={3.2} />
      <Emote t={t} t0={T("changed their minds", D)} t1={T("the wall was planned", D)} tipo="preg" x={960} y={330} s={1.2} />
      <Ch t={t} w="changed their minds" d={D} txt="CHANGE OF PLANS" y={150} c={C.violeta} size={66} dur={2.4} />
      <Plano t={t} t0={T("the wall was planned", D) - 0.1} t1={T("then the legions go home", D) - 0.2} desde={[960, 600]} fondo="#2d1b69"><Exterior t={t} tono="dia" horizonte={720} pasto={t < T("like a pair of trousers", D)}><Ancho t={t} /></Exterior></Plano>
      <Ch t={t} w="go home to their big" d={D} txt="→ YORK · CHESTER · CAERLEON" y={160} c={C.rojo} size={56} dur={3.0} />
      <Ch t={t} w="needs somebody" d={D} txt="SOMEBODY HAS TO STAND ON IT" y={160} c={C.violeta} size={58} dur={2.2} />
      <Gr t={t} w="that somebody is you" d={D} txt="YOU." y={190} size={200} c={C.ambar} dur={1.1} dt={0.3} />
      {/* legajo con sello AUXILIARY */}
      {t > T("not a legionary", D) && t < T("rome recruited men", D) && (
        <div style={{ position: "absolute", left: 1400, top: 420, width: 440, height: 500, background: "#f6e3b4", border: "8px solid #8a5a2a", borderRadius: 14, transform: `scale(${ent(t, T("not a legionary", D))}) rotate(3deg)`, fontFamily, fontWeight: 700, color: "#5a3418", padding: 30, boxSizing: "border-box" }}>
          <div style={{ fontSize: 40 }}>SERVICE RECORD</div>
          <div style={{ fontSize: 38, marginTop: 20, opacity: 0.85 }}>NAME: YOU<br />AGE: 19<br />FROM: BELGIUM</div>
          <div style={{ position: "absolute", left: 40, top: 300, fontSize: 60, color: C.rojo, border: `8px solid ${C.rojo}`, borderRadius: 12, padding: "4px 18px", transform: `rotate(-12deg) scale(${t > T("you are an auxiliary", D) ? 1 + 2 * (1 - prog(t, T("you are an auxiliary", D), T("you are an auxiliary", D) + 0.18)) : 0})`, opacity: t > T("you are an auxiliary", D) ? 1 : 0 }}>AUXILIARY</div>
        </div>
      )}
      {/* "una carrera" en papel que se rompe con el viento */}
      {t > T("on paper", D) && t < T("dampest corner", D) + 0.6 && (() => {
        const r = prog(t, T("in practice", D), T("in practice", D) + 1.2);
        return [0, 1].map((k) => (
          <div key={k} style={{ position: "absolute", left: 1300 + k * 230, top: 330, width: 230, height: 420, overflow: "hidden", transform: `translate(${r * (k ? 700 : -200)}px, ${r * (k ? -300 : 500)}px) rotate(${r * (k ? 70 : -50)}deg) scale(${ent(t, T("on paper", D))})`, opacity: 1 - prog(t, T("dampest corner", D), T("dampest corner", D) + 0.6) }}>
            <div style={{ position: "absolute", left: -k * 230, width: 460, height: 420, background: "#f6e3b4", border: "8px solid #8a5a2a", boxSizing: "border-box", fontFamily, fontWeight: 700, color: "#5a3418", padding: 28 }}>
              <div style={{ fontSize: 50 }}>CAREER PLAN</div><div style={{ fontSize: 40, marginTop: 18, lineHeight: 1.5 }}>✓ 25 YEARS<br />✓ STEADY PAY<br />✓ CITIZENSHIP<br />✓ FAMILY</div>
            </div>
          </div>
        ));
      })()}
      <Ch t={t} w="not a legionary" d={D} txt="LEGIONARY ✗" x={560} y={220} c={C.rojo} size={64} dur={1.4} />
      <Ch t={t} w="you are an auxiliary" d={D} txt="AUXILIARY ✓" x={1360} y={220} c={C.teal} tinta={C.noche} size={64} dur={2.1} dt={0.4} />
      <Ch t={t} w="a provincial" d={D} txt="PROVINCIAL" x={1360} y={330} c={C.violeta} size={50} dur={1.4} />
      <Gr t={t} w="not a citizen of rome" d={D} txt="NOT A CITIZEN" y={880} size={110} c={C.rojo} borde="#fff" dur={1.6} dt={0.35} />
      <Plano t={t} t0={T("rome recruited men", D)} t1={T("your pay is lower", D) - 0.2} desde={[yo[0], yo[1]]} fondo={C.noche}><Origenes t={t} /></Plano>
      <Ch t={t} w="a completely different edge" d={D} txt="→ THE OPPOSITE EDGE" y={1000} c={C.rojo} size={56} dur={2.2} />
      {/* la paga */}
      {t > T("your pay is lower", D) && t < T("and your reward", D) && (
        <>
          <Pila t={t} t0={T("your pay is lower", D) + 0.1} n={12} x={1300} y={820} />
          <Pila t={t} t0={T("your pay is lower", D) + 0.6} n={9} x={1620} y={820} />
          <Chip t={t} t0={T("your pay is lower", D) + 0.2} text="LEGIONARY" color={C.rojo} x={1300} y={880} centro size={36} />
          <Chip t={t} t0={T("your pay is lower", D) + 0.7} text="YOU" color={C.teal} tinta={C.noche} x={1620} y={880} centro size={36} />
          <Chip t={t} t0={T("contract is the same", D)} text="SAME 25 YEARS" color={C.violeta} x={1460} y={170} centro size={60} />
        </>
      )}
      {t > T("and your reward", D) && t < T("so on paper", D) && (
        <>
          <Rayos t={t} x={1380} y={470} color="#ffe27a" op={0.16} />
          <DiplomaBronce x={1380} y={470} t={t} t0={T("and your reward", D)} abre={prog(t, T("small folded sheet", D), T("small folded sheet", D) + 1)} s={0.85} />
        </>
      )}
      <Gr t={t} w="called a diploma" d={D} txt="DIPLOMA" y={170} size={140} c={C.oro} dur={1.4} />
      {t > T("it says that you", D) && t < T("archaeologists have found", D) && [["YOU", "it says that you", C.teal], ["YOUR WIFE", "your wife", C.rosa], ["YOUR KIDS", "your children", C.ambar]].map(([tx, w, col], i) => (
        <Chip key={i} t={t} t0={T(w, D)} text={`${tx} = ROMAN`} color={col} tinta={C.noche} x={1380} y={750 + i * 90} centro size={46} />
      ))}
      <Ch t={t} w="archaeologists have found" d={D} txt="FOUND IN BRITAIN" y={170} c={C.teal} tinta={C.noche} size={66} dur={2.5} />
      <Cu t={t} w="a quarter of a century" d={D} de={0} a={25} sube={0.9} dur={2.9} x={560} y={200} size={130} suf=" YEARS" color={C.ambar} />
      <Gr t={t} w="two little pieces" d={D} txt="= 2 PIECES OF METAL" y={330} x={560} size={70} c={C.crema} dur={1.6} />
      <Ch t={t} w="on paper" d={D} txt="ON PAPER: A CAREER ✓" y={160} c={C.teal} tinta={C.noche} size={62} dur={2.2} />
      <Ch t={t} w="in practice" d={D} txt="IN PRACTICE:" y={150} c={C.rojo} size={62} dur={1.0} />
      <Ch t={t} w="dampest corner" d={D} txt="THE DAMPEST CORNER OF THE KNOWN WORLD" y={150} c="#2a2350" size={52} dur={2.3} />
      <Ch t={t} w="not consider you one of them" d={D} txt="“NOT ONE OF US”" x={560} y={290} c={C.rojo} size={58} dur={2.0} dt={-0.6} />
      <Ch t={t} w="consider you the enemy" d={D} txt="“THE ENEMY”" x={1380} y={250} c="#2a2350" size={58} dur={2.4} dt={-0.4} />
      <Gr t={t} w="that was the good news" d={D} txt="THAT WAS THE GOOD NEWS." y={200} size={100} c={C.ambar} dur={1.4} />
      <Emote t={t} t0={T("that was the good news", D) + 0.4} t1={182.6} tipo="sudor" x={yo[0]} y={yo[1]} s={c.z * 0.4} />
    </>
  );
};
export { Denario, Picto };
