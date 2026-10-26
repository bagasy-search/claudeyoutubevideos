import React from "react";
import { AbsoluteFill } from "remotion";
import { C, fontFamily, ent, prog, Chip, Grande, Emote, cabeza, Pergamino, MapaPuntos, lugar, Rayos } from "./kit";
import { Denario, Soldadito } from "./kit2";
import { Persona, CENTURION, LUCIUS, CIVIL } from "./persona";
import { TOP, BASE, MC, K, Cam, Pal, Plano, CartelTrampa, pant } from "./mundo";
import { Exterior } from "./escenas4";
import { Yo, Picto, DiplomaBronce, Gr, Cu, Sale, Ch, T, ck, Actua, gesto, Rayitas } from "./kit3";
import { Sala } from "./sets";
import { interpolate, Easing } from "remotion";

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
              beats={[[116.3, "sorpresa"], [117.7, "triste"], [T("not a legionary", D), "niega"], [T("you are an auxiliary", D) + 0.5, "sorpresa"], [T("you are an auxiliary", D) + 1.1, "encoge"], [T("a provincial", D), "habla"], [T("not a citizen of rome", D), "habla"], [T("not a citizen of rome", D) + 0.35, "miedo"], [T("not a citizen of rome", D) + 0.75, "triste"],
                [T("your pay is lower", D), "niega"], [147.7, "sorpresa"], [148.2, "niega"], [T("contract is the same", D), "encoge"], [T("and your reward", D), "sorpresa"], [T("called a diploma", D), "festeja"],
                [T("archaeologists have found", D), "lee"], [T("a quarter of a century", D), "duerme"], [T("two little pieces", D), "encoge"], [T("on paper", D), "festeja"], [T("in practice", D), "sorpresa"],
                [T("dampest corner", D), "tiembla"], [T("not consider you one of them", D), "triste"], [T("consider you the enemy", D), "miedo"]]} />
            {/* sello NOT A CITIZEN que cae sobre el pecho */}
            {t > T("not a citizen of rome", D) + 0.35 && t < T("rome recruited men", D) + 0.2 && (() => {
              const ts = T("not a citizen of rome", D) + 0.35, k = prog(t, ts, ts + 0.14);
              return (
                <>
                  {t < ts + 0.5 && <div style={{ position: "absolute", left: YOX - 110, top: TOP - 87 - 110, width: 220, height: 220, borderRadius: "50%", border: `${8 * (1 - prog(t, ts + 0.12, ts + 0.5))}px solid ${C.rojo}`, transform: `scale(${0.4 + 1.2 * prog(t, ts + 0.12, ts + 0.5)})`, opacity: 1 - prog(t, ts + 0.12, ts + 0.5) }} />}
                  <div style={{ position: "absolute", left: YOX - 66, top: TOP - 118, width: 132, height: 62, border: `6px solid ${C.rojo}`, borderRadius: 8, background: "rgba(255,240,230,.92)", boxSizing: "border-box", fontFamily, fontWeight: 700, fontSize: 22, lineHeight: "24px", color: C.rojo, textAlign: "center", paddingTop: 4, transform: `scale(${3 - 2 * k}) rotate(-9deg)`, opacity: 0.3 + 0.7 * k }}>NOT A<br />CITIZEN</div>
                </>
              );
            })()}
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
  const POSE = [0, 1, 3, 2, 4, 1, 0];
  return <>{Array.from({ length: 7 }, (_, i) => <PictoV key={i} x={bx - 600 + i * 190 + (i % 2) * 24} y={330 + (i % 2) * 20 + (i === 4 ? 10 : 0)} s={(t > 170 ? 1.05 : 0.7) * [1, 0.92, 1.12, 1.18, 0.86, 1.0, 0.95][i]} t={t} seed={i + 30} pose={POSE[i]} sube={(t > 170 ? 178.4 : 62.6) + i * 0.06} />)}</>;
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
      {/* vos: de Bélgica a Britania, con la huella punteada detrás */}
      {t > 124.3 && t < 130.4 && (() => {
        const g = lugar("GAUL"), u = 0.8 * prog(t, 126.2, 129.4);
        const x = g.x + (b.x - g.x) * u, y = g.y + (b.y - g.y) * u;
        return (
          <div style={{ position: "absolute", inset: 0, opacity: 1 - prog(t, 129.9, 130.4) }}>
            <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><line x1={g.x} y1={g.y} x2={x} y2={y} stroke={C.ambar} strokeWidth={7} strokeDasharray="4 16" strokeLinecap="round" /><circle cx={g.x} cy={g.y} r={12} fill={C.ambar} stroke="#fff" strokeWidth={4} /></svg>
            <Yo x={x} y={y + 6} h={104} t={t} aparece={124.3} camina={u > 0 && u < 0.8 ? 1.4 : 0} flip={u > 0} expr={u < 0.8 ? "triste" : "miedo"} />
            <Chip t={t} t0={124.4} text="YOU" color={C.teal} tinta={C.noche} x={x + 56} y={y - 56} size={30} />
          </div>
        );
      })()}
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
      {/* 0:48 · detrás de la cinta: un auxiliar cruza con la furca al hombro, rumbo al norte */}
      <Sale t={t} t0={48.3} t1={51.55}><Caminante t={t} t0={48.3} t1={51.7} /></Sale>
      <CartelTrampa t={t} t0={48.3} n={1} titulo="THE POSTING" color={C.rojo} />
      <Gr t={t} w="year 122" d={D} txt="AD 122" y={200} size={190} c={C.ambar} dur={2.4} />
      <Ch t={t} w="hadrian has just" d={D} txt="EMPEROR HADRIAN" y={140} c="#7a2a9a" dt={0.3} dur={2.3} />
      <Ch t={t} w="visited britain" d={D} txt="VISITS BRITAIN" y={230} c={C.teal} tinta={C.noche} size={50} dur={1.8} />
      {t > T("his biographer", D) && t < T("he was the first", D) + 0.2 && <Pergamino x={1440} y={520} w={480} abre={prog(t, T("his biographer", D), T("his biographer", D) + 0.6) * 0.7} titulo="HIS BIOGRAPHY" lineas={5} />}
      <Plano t={t} t0={T("he was the first", D) - 0.1} t1={T("80 miles long", D) - 0.45} desde={[960, 600]} fondo="#5fb4ea"><Adriano2 t={t} t0={T("he was the first", D) - 0.1} t1={T("80 miles long", D) - 0.45} /></Plano>
      <Ch t={t} w="he was the first" d={D} txt="“THE FIRST TO BUILD A WALL”" y={140} c={C.crema} tinta="#7a3d14" size={60} dur={2.5} />
      <Cu t={t} w="80 miles long" d={D} de={0} a={80} sube={0.8} dur={3.3} y={300} size={170} suf=" MILES" color={C.ambar} />
      {/* Adriano en primer plano señala la línea (de punta a punta) */}
      <Sale t={t} t0={T("80 miles long", D) - 0.4} t1={T("the legions build it", D) - 0.1}>
        <Actua t={t} x0={2150} x1={1640} y={1075} h={560} ropa={{ ...CIVIL(0), tunica: "#7a2a9a", tunica2: "#4a1a6a" }} casco={false} quien={48}
          beats={[[T("80 miles long", D) - 0.4, "camina"], [T("80 miles long", D) + 0.4, "señala"], [T("separate the romans", D), "habla"], [T("from the barbarians", D), "enojado"], [T("80 roman miles", D), "señala"], [T("73 of ours", D), "habla"]]} />
      </Sale>
      {/* 1:08 · la obra en plano medio: uno martilla, otro carga piedra, otro tira de la soga de la grúa */}
      <Plano t={t} t0={68.45} t1={T("a small fort every", D) - 0.15} fondo="#5fb4ea"><Obra t={t} t0={68.45} t1={T("a small fort every", D) - 0.15} /></Plano>
      {/* 1:18 · el capataz señala y las 2 torres se levantan con pop */}
      <Plano t={t} t0={T("two watchtowers", D) - 0.3} t1={T("behind it", D) - 0.1} fondo="#5fb4ea"><Torres t={t} t0={T("two watchtowers", D) - 0.3} /></Plano>
      {/* 1:28 · los fuertes caen sobre la línea con polvo */}
      <Plano t={t} t0={T("more than a dozen", D) - 0.15} t1={T("the wall was planned", D) - 0.2} fondo="#5fb4ea"><Fuertes t={t} t0={T("more than a dozen", D) - 0.15} /></Plano>
      {/* contador de obra: millas levantadas */}
      {t > 68.6 && t < 79.5 && (
        <div style={{ position: "absolute", right: 60, top: 40, padding: "14px 28px", borderRadius: 22, background: "#2a1530", border: "6px solid #fff", fontFamily, fontWeight: 700, color: "#fff", fontSize: 44, transform: `scale(${ent(t, 68.6)})` }}>
          🧱 MILES BUILT: <span style={{ color: C.ambar }}>{Math.round(80 * prog(t, 68.6, 79))}</span> / 80
        </div>
      )}
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
      <Plano t={t} t0={T("the wall was planned", D) - 0.1} t1={T("then the legions go home", D) - 0.2} desde={[960, 600]} fondo="#2d1b69"><Exterior t={t} tono="dia" horizonte={720} pasto={t < T("like a pair of trousers", D)}><Ancho2 t={t} /></Exterior></Plano>
      <Ch t={t} w="go home to their big" d={D} txt="→ YORK · CHESTER · CAERLEON" y={160} c={C.rojo} size={56} dur={3.0} />
      <Ch t={t} w="needs somebody" d={D} txt="SOMEBODY HAS TO STAND ON IT" y={160} c={C.violeta} size={58} dur={2.2} />
      <Gr t={t} w="that somebody is you" d={D} txt="YOU." y={190} size={200} c={C.ambar} dur={1.1} dt={0.3} />
      {/* legajo con sello AUXILIARY */}
      {t > T("not a legionary", D) && t < T("rome recruited men", D) && (
        <div style={{ position: "absolute", left: 1400, top: 420, width: 440, height: 500, background: "#f6e3b4", border: "8px solid #8a5a2a", borderRadius: 14, transform: `scale(${ent(t, T("not a legionary", D))}) rotate(${3 + (t > T("you are an auxiliary", D) + 0.5 ? Math.sin((t - T("you are an auxiliary", D) - 0.5) * 45) * Math.exp(-(t - T("you are an auxiliary", D) - 0.5) * 7) * 5 : 0)}deg) translateY(${t > T("you are an auxiliary", D) + 0.5 ? Math.exp(-(t - T("you are an auxiliary", D) - 0.5) * 9) * 18 : 0}px)`, fontFamily, fontWeight: 700, color: "#5a3418", padding: 30, boxSizing: "border-box" }}>
          <div style={{ fontSize: 40 }}>SERVICE RECORD</div>
          <div style={{ fontSize: 38, marginTop: 20, opacity: 0.85 }}>NAME: YOU<br />AGE: 19<br />FROM: BELGIUM</div>
          <div style={{ position: "absolute", left: 40, top: 300, fontSize: 60, color: C.rojo, border: `8px solid ${C.rojo}`, borderRadius: 12, padding: "4px 18px", transform: `rotate(-12deg) scale(${t > T("you are an auxiliary", D) + 0.3 ? 1 + 2.5 * (1 - prog(t, T("you are an auxiliary", D) + 0.3, T("you are an auxiliary", D) + 0.5)) : 0})`, opacity: t > T("you are an auxiliary", D) + 0.3 ? 1 : 0 }}>AUXILIARY</div>
          {t > T("you are an auxiliary", D) + 0.5 && t < T("you are an auxiliary", D) + 1.0 && (() => { const q = prog(t, T("you are an auxiliary", D) + 0.5, T("you are an auxiliary", D) + 1.0); return <>{Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return <div key={i} style={{ position: "absolute", left: 150 + Math.cos(a) * (60 + q * 170), top: 345 + Math.sin(a) * (30 + q * 90), width: 22, height: 22, borderRadius: "50%", background: "#d8c08a", opacity: 1 - q }} />; })}</>; })()}
        </div>
      )}
      {/* 2:50 · plano medio: tilda su plan de carrera con la pluma; «in practice» → la hoja se rompe */}
      <Plano t={t} t0={T("so on paper", D) - 0.1} t1={T("in practice", D) + 0.85} fondo="#a8622c"><Carrera t={t} /></Plano>
      <Ch t={t} w="not a legionary" d={D} txt="LEGIONARY ✗" x={560} y={220} c={C.rojo} size={64} dur={1.4} />
      <Ch t={t} w="you are an auxiliary" d={D} txt="AUXILIARY ✓" x={1360} y={220} c={C.teal} tinta={C.noche} size={64} dur={2.1} dt={0.4} />
      <Ch t={t} w="a provincial" d={D} txt="PROVINCIAL" x={1360} y={330} c={C.violeta} size={50} dur={1.4} />
      <Plano t={t} t0={T("rome recruited men", D)} t1={T("your pay is lower", D) - 0.2} desde={[yo[0], yo[1]]} fondo={C.noche}><Origenes t={t} /></Plano>
      <Ch t={t} w="a completely different edge" d={D} txt="→ THE OPPOSITE EDGE" y={1000} c={C.rojo} size={56} dur={2.2} />
      {/* la paga */}
      {t > T("your pay is lower", D) && t < T("and your reward", D) && (
        <>
          <Pila t={t} t0={T("your pay is lower", D) + 0.1} n={12} x={1300} y={820} />
          <Pila t={t} t0={T("your pay is lower", D) + 0.6} n={6} x={1620} y={820} />
          <MonedasCaen t={t} t0={T("your pay is lower", D) + 0.6} tc={147.62} x={1620} y={820} />
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
      {/* 2:40 · la familia entra en cuadro; el chico abraza el diploma */}
      <Plano t={t} t0={T("it says that you", D) - 0.1} t1={T("archaeologists have found", D) - 0.1} fondo="#a8622c"><Familia t={t} /></Plano>
      {t > T("it says that you", D) && t < T("archaeologists have found", D) && [["YOU", "it says that you", C.teal], ["YOUR WIFE", "your wife", C.rosa], ["YOUR KIDS", "your children", C.ambar]].map(([tx, w, col], i) => (
        <Chip key={i} t={t} t0={T(w, D)} text={`${tx} = ROMAN`} color={col} tinta={C.noche} x={1500} y={230 + i * 96} centro size={48} />
      ))}
      <Ch t={t} w="archaeologists have found" d={D} txt="FOUND IN BRITAIN" y={170} c={C.teal} tinta={C.noche} size={66} dur={2.5} />
      <Cu t={t} w="a quarter of a century" d={D} de={0} a={25} sube={0.9} dur={2.9} x={560} y={200} size={130} suf=" YEARS" color={C.ambar} />
      <Gr t={t} w="two little pieces" d={D} txt="= 2 PIECES OF METAL" y={330} x={560} size={70} c={C.crema} dur={1.6} />
      <Ch t={t} w="on paper" d={D} txt="ON PAPER: A CAREER ✓" y={160} c={C.teal} tinta={C.noche} size={62} dur={2.2} />
      <Ch t={t} w="in practice" d={D} txt="IN PRACTICE:" y={150} c={C.rojo} size={62} dur={1.0} />
      <Ch t={t} w="dampest corner" d={D} txt="THE DAMPEST CORNER OF THE KNOWN WORLD" y={150} c="#2a2350" size={52} dur={2.3} />
      <Ch t={t} w="not consider you one of them" d={D} txt="“NOT ONE OF US”" x={560} y={290} c={C.rojo} size={58} dur={2.0} dt={-0.6} />
      <Ch t={t} w="consider you the enemy" d={D} txt="“THE ENEMY”" x={1380} y={250} c="#2a2350" size={58} dur={1.9} dt={-0.4} />
      <Gr t={t} w="that was the good news" d={D} txt="THAT WAS THE GOOD NEWS." y={200} size={100} c={C.ambar} dur={1.4} />
      <Emote t={t} t0={T("that was the good news", D) + 0.4} t1={182.6} tipo="sudor" x={yo[0]} y={yo[1]} s={c.z * 0.4} />
    </>
  );
};
export { Denario, Picto };

// ── VUELTA 7 · escenas re-animadas en plano medio ─────────────────────────────────────────────────────────────

// muro con textura de sillares (hiladas alternadas, tono que varía, musgo, sombra arriba)
const Sillares: React.FC<{ x: number; y: number; w: number; h: number; fila?: number; col?: number; seed?: number }> = ({ x, y, w, h, fila = 46, col = 92, seed = 1 }) => {
  if (w <= 0 || h <= 0) return null;
  const nf = Math.ceil(h / fila), nc = Math.ceil(w / col) + 1;
  const tono = (i: number) => ["#d8c8ae", "#cdbb9e", "#e2d4bc", "#c9b590"][Math.abs(Math.floor(Math.sin(i * 12.9898 + seed) * 43758)) % 4];
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "hidden" }} width={w} height={h}>
      <rect width={w} height={h} fill="#8a7a64" />
      {Array.from({ length: nf }, (_, r) => Array.from({ length: nc }, (_, c) => (
        <rect key={r + "-" + c} x={c * col - (r % 2) * (col / 2) + 2} y={h - (r + 1) * fila + 2} width={col - 4} height={fila - 4} rx={5} fill={tono(r * 31 + c)} />
      )))}
      {Array.from({ length: Math.floor(w / 140) }, (_, i) => <ellipse key={i} cx={60 + i * 140 + (i % 3) * 20} cy={h - 6} rx={30} ry={10} fill="#6f9a4a" opacity={0.7} />)}
      <rect width={w} height={12} fill="#fff" opacity={0.25} />
      <rect x={0} y={0} width={10} height={h} fill="#000" opacity={0.12} />
    </svg>
  );
};

// 0:48 · auxiliar que cruza con la furca (palo al hombro con el atado y la olla) rumbo al norte
const Caminante: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const x = interpolate(t, [t0, t1], [-260, 2180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = 1072, h = 290, S = h / 560;
  const bote = Math.abs(Math.sin(t * 1.3 * Math.PI * 2)) * -10 * S;
  return (
    <>
      {/* cartel NORTH → clavado en el pasto */}
      <svg style={{ position: "absolute", left: 1560, top: 845, overflow: "visible" }} width={1} height={1}>
        <rect x={-10} y={0} width={20} height={240} fill="#6b3a1f" />
        <path d="M -150 20 L 120 20 L 170 70 L 120 120 L -150 120 Z" fill="#c98f4a" stroke="#6b3a1f" strokeWidth={8} />
        <text x={0} y={90} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={56} fill="#2a1530">NORTH</text>
      </svg>
      <Yo x={x} y={y} h={h} t={t} camina={1.3} frio expr="triste" bI={60} cI={100} mira={0.4} />
      {/* furca: palo apoyado en el hombro, el atado y la olla atrás */}
      <svg style={{ position: "absolute", left: x, top: y + bote, overflow: "visible" }} width={1} height={1}>
        <g transform={`scale(${S}) rotate(${Math.sin(t * 8) * 2} -60 -330)`}>
          <line x1={-60} y1={-330} x2={-250} y2={-470} stroke="#6b3a1f" strokeWidth={14} strokeLinecap="round" />
          <line x1={-60} y1={-330} x2={20} y2={-272} stroke="#6b3a1f" strokeWidth={14} strokeLinecap="round" />
          <g transform={`translate(-235 -460) rotate(${Math.sin(t * 8.2) * 10})`}>
            <line x1={0} y1={0} x2={0} y2={40} stroke="#3a2418" strokeWidth={5} />
            <ellipse cx={0} cy={90} rx={62} ry={56} fill="#b5895a" stroke="#6b4a2f" strokeWidth={7} />
            <path d="M -40 60 Q 0 80 40 60" stroke="#6b4a2f" strokeWidth={6} fill="none" />
          </g>
          <g transform={`translate(-170 -415) rotate(${Math.sin(t * 8 + 1) * 14})`}>
            <line x1={0} y1={0} x2={0} y2={30} stroke="#3a2418" strokeWidth={4} />
            <path d="M -30 30 L 30 30 L 24 76 L -24 76 Z" fill="#8a8f9a" stroke="#4a4f5a" strokeWidth={6} />
          </g>
        </g>
      </svg>
    </>
  );
};

// 0:58 · Adriano traza el muro con la vara: muro de sillares con textura; poses que cambian con la voz
const Adriano2: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const tr = 59.6;
  const k = prog(t, tr, t1 + 0.2);
  const punta = 380 + 1150 * k;
  const hx = t < tr ? 700 : Math.max(700, punta - 60);
  const fase = t < 59.58 ? 0 : t < 60.34 ? 1 : 2; // 0 orgullo (mano al pecho) · 1 lee el rollo · 2 traza con la vara
  const ropa = { ...CIVIL(0), tunica: "#7a2a9a", tunica2: "#4a1a6a" };
  const h = 540, cb = cabeza(hx, 1010, h);
  const G = fase === 0 ? { expr: "orgullo" as const, bD: 30, cD: 130, bI: 12, cI: 10, habla: true, inclina: -4 }
    : fase === 1 ? { expr: "neutro" as const, bD: 80, cD: 95, bI: 75, cI: 95, habla: true, inclina: 6 }
      : { expr: "enojado" as const, bD: 100, cD: 30, bI: 20, cI: 10, habla: true, inclina: 8 };
  return (
    <Exterior t={t} tono="dia" horizonte={600}>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <line x1={300} y1={905} x2={Math.max(punta, 380)} y2={905} stroke="#7a4a22" strokeWidth={10} strokeDasharray="30 18" />
      </svg>
      {Array.from({ length: 17 }, (_, i) => {
        const x = 120 + i * 104;
        if (x > punta - 150) return null;
        const e = Math.min(1, (punta - 150 - x) / 200), hh = 300 * e;
        return (
          <React.Fragment key={i}>
            <Sillares x={x} y={900 - hh} w={104} h={hh} fila={50} col={52} seed={i} />
            {e > 0.9 && i % 2 === 0 && <Sillares x={x + 14} y={900 - hh - 56} w={74} h={58} fila={29} col={37} seed={i + 40} />}
            {e > 0 && e < 1 && [0, 1, 2].map((j) => <div key={j} style={{ position: "absolute", left: x + 20 + j * 30 - 26, top: 900 - hh - 36 - j * 8, width: 52 - j * 10, height: 52 - j * 10, borderRadius: "50%", background: "#e8dcc6", opacity: 0.8 * (1 - e) }} />)}
          </React.Fragment>
        );
      })}
      <Persona x={hx} y={1010} h={h} t={t} seed={88} ropa={ropa} viejo {...G} mira={fase === 1 ? -0.2 : 0.6} salta={fase === 0 ? t0 + 0.05 : undefined}
        manoI={fase === 1 ? <g><rect x={-60} y={-30} width={120} height={80} rx={10} fill="#f6e3b4" stroke="#8a5a2a" strokeWidth={6} />{[0, 1, 2].map((r) => <line key={r} x1={-40} y1={-8 + r * 20} x2={40} y2={-8 + r * 20} stroke="#8a5a2a" strokeWidth={5} />)}</g> : undefined} />
      <Laurel x={cb.x} y={cb.y - 70 * cb.s} s={cb.s} />
      {fase === 2 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
          <line x1={hx + 150} y1={640} x2={punta} y2={905} stroke="#6b4a2f" strokeWidth={12} strokeLinecap="round" />
          {[0, 1, 2].map((i) => { const q = ((t * 3 + i / 3) % 1); return <circle key={i} cx={punta - q * 60} cy={900 - q * 30} r={8 + q * 10} fill="#c9a36a" opacity={0.7 * (1 - q)} />; })}
        </svg>
      )}
    </Exterior>
  );
};

// 1:08 · la obra: un tramo de muralla que crece; martillo, piedra al hombro, soga de la grúa
const Obra: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const k = prog(t, t0 + 0.2, t1);
  const front = 140 + 1000 * k;
  const per = 2.2, q = ((t - t0) % per) / per; // ciclo de la grúa
  const lift = q < 0.8 ? q / 0.8 : 1;
  const tiro = Math.sin(q * Math.PI * 2 * 3);
  const golpe = Math.abs(Math.sin(t * 9));
  return (
    <Exterior t={t} tono="dia" horizonte={600}>
      {/* muro que crece: columnas completas + la del frente subiendo */}
      {Array.from({ length: 12 }, (_, i) => {
        const x = 140 + i * 92;
        if (x > front) return null;
        const e = Math.min(1, (front - x) / 92);
        const hh = 340 * Math.min(1, 0.25 + e);
        return <React.Fragment key={i}><Sillares x={x} y={880 - hh} w={92} h={hh} seed={i * 3} />{e >= 1 && i % 2 === 0 && <Sillares x={x + 10} y={880 - hh - 50} w={72} h={52} fila={26} col={36} seed={i + 9} />}</React.Fragment>;
      })}
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        {/* andamio en el frente */}
        <g stroke="#7a4a22" strokeWidth={12} strokeLinecap="round">
          <line x1={front + 10} y1={880} x2={front + 10} y2={520} /><line x1={front + 90} y1={880} x2={front + 90} y2={520} />
          <line x1={front + 10} y1={700} x2={front + 90} y2={700} /><line x1={front + 10} y1={560} x2={front + 90} y2={560} />
        </g>
        {/* grúa de pluma fija */}
        <g stroke="#6b3a1f" strokeLinecap="round">
          <line x1={1300} y1={880} x2={1370} y2={300} strokeWidth={22} /><line x1={1440} y1={880} x2={1370} y2={300} strokeWidth={22} />
          <line x1={1370} y1={300} x2={1220} y2={260} strokeWidth={16} />
        </g>
        <circle cx={1225} cy={262} r={18} fill="#3a2418" />
        <line x1={1225} y1={262} x2={1225} y2={820 - 400 * lift} stroke="#3a2418" strokeWidth={6} />
        <line x1={1225} y1={262} x2={1500 + tiro * 8} y2={745} stroke="#3a2418" strokeWidth={6} />
        <g transform={`translate(1225 ${850 - 400 * lift}) rotate(${Math.sin(t * 4) * 4})`}><rect x={-55} y={-30} width={110} height={60} rx={6} fill="#d8c8ae" stroke="#8a7a64" strokeWidth={6} /></g>
        {/* chispas del martillo */}
        {golpe > 0.9 && [0, 1, 2, 3].map((j) => <line key={j} x1={330} y1={700} x2={330 - 40 + j * 26} y2={650 - j * 10} stroke="#ffd36a" strokeWidth={7} strokeLinecap="round" />)}
      </svg>
      {/* 1 · martilla la cara del muro */}
      <Persona x={500} y={985} h={440} t={t} seed={61} ropa={LUCIUS} casco="legion" flip expr="enojado" habla={golpe > 0.9}
        bD={60 + golpe * 80} cD={40} bI={50} cI={60} inclina={6}
        manoD={<g><rect x={-6} y={-10} width={12} height={90} fill="#6b3a1f" /><rect x={-34} y={70} width={68} height={40} rx={6} fill="#7d8796" stroke="#4a4f5a" strokeWidth={5} /></g>} />
      {/* 2 · carga una piedra sobre la cabeza y camina hacia la obra */}
      <Persona x={interpolate(t, [t0, t1], [1100, 760], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={995} h={430} t={t} seed={62} ropa={LUCIUS} casco="legion" flip camina={1.0}
        bD={45} cD={85} bI={45} cI={85} expr="triste" inclina={8}
        manoD={<rect x={-80} y={-30} width={140} height={78} rx={8} fill="#cdbb9e" stroke="#8a7a64" strokeWidth={7} />} />
      {/* 3 · tira de la soga de la grúa */}
      <Persona x={1660} y={1000} h={440} t={t} seed={63} ropa={LUCIUS} casco="legion" flip expr="enojado" habla
        bD={78 + tiro * 10} cD={20} bI={72 + tiro * 10} cI={20} inclina={-12 - tiro * 5} />
      {/* polvo al pie de la obra */}
      {[0, 1, 2].map((j) => { const qq = ((t * 0.8 + j / 3) % 1); return <div key={j} style={{ position: "absolute", left: front - 40 + j * 40, top: 840 - qq * 120, width: 60 + qq * 60, height: 60 + qq * 60, borderRadius: "50%", background: "#efe3cc", opacity: 0.6 * (1 - qq) }} />; })}
    </Exterior>
  );
};

// 1:18 · el capataz entra, señala, y cada torre se levanta con pop cuando la señala
const Torres: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const tp = [79.75, 80.4];
  const TX = [930, 1290];
  return (
    <Exterior t={t} tono="dia" horizonte={560}>
      <Sillares x={-20} y={600} w={1960} h={90} fila={30} col={60} seed={5} />
      {Array.from({ length: 24 }, (_, i) => <div key={i} style={{ position: "absolute", left: i * 84, top: 578, width: 46, height: 26, background: "#cdbb9e", border: "4px solid #8a7a64", boxSizing: "border-box" }} />)}
      {/* milecastles en los dos extremos */}
      {[560, 1700].map((x, i) => (
        <React.Fragment key={i}>
          <Sillares x={x - 120} y={430} w={240} h={260} fila={32} col={64} seed={20 + i} />
          <div style={{ position: "absolute", left: x - 40, top: 590, width: 80, height: 100, borderRadius: "40px 40px 0 0", background: "#3a2418" }} />
          <div style={{ position: "absolute", left: x - 4, top: 360, width: 8, height: 80, background: "#6b3a1f" }} />
          <div style={{ position: "absolute", left: x + 4, top: 360, width: 60, height: 36, background: C.rojo }} />
        </React.Fragment>
      ))}
      {/* las 2 torres: brotan con rebote y polvo */}
      {TX.map((x, i) => {
        if (t < tp[i]) return null;
        const e = ent(t, tp[i], 0, { damping: 9, stiffness: 200 });
        const d = t - tp[i];
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x - 70, top: 400, width: 140, height: 220, transform: `scaleY(${e})`, transformOrigin: "50% 100%" }}>
              <Sillares x={0} y={0} w={140} h={220} fila={30} col={46} seed={50 + i} />
              <div style={{ position: "absolute", left: 50, top: 60, width: 40, height: 56, borderRadius: "20px 20px 0 0", background: "#3a2418" }} />
            </div>
            {d < 0.8 && [0, 1, 2, 3, 4].map((j) => <div key={j} style={{ position: "absolute", left: x - 90 + j * 40 - d * (j - 2) * 60, top: 600 - d * 70, width: 70 + d * 60, height: 70 + d * 60, borderRadius: "50%", background: "#efe3cc", opacity: 0.8 * (1 - d / 0.8) }} />)}
            <Chip t={t} t0={tp[i] + 0.15} text={`TOWER ${i + 1}`} color={C.rojo} x={x} y={350} centro size={34} />
          </React.Fragment>
        );
      })}
      <Actua t={t} x0={-160} x1={300} y={1045} h={560} quien={2}
        beats={[[t0, "camina"], [tp[0] - 0.12, "señala"], [tp[0] + 0.45, "habla"], [tp[1] - 0.12, "señala"], [80.98, "habla"], [81.5, "festeja"]]} />
    </Exterior>
  );
};

// mini fuerte vectorial: muralla redondeada, 4 torres en las esquinas, puerta y barracas
const MiniFuerte: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 60 * s, top: y - 60 * s, overflow: "visible" }} width={120 * s} height={120 * s} viewBox="-60 -60 120 120">
    <ellipse cx={4} cy={44} rx={62} ry={12} fill="#000" opacity={0.25} />
    <rect x={-50} y={-30} width={100} height={70} rx={14} fill="#e0cfa8" stroke="#8a6a4a" strokeWidth={6} />
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <g key={i}><rect x={a * 44 - 12} y={b * 30 + 4 - 22} width={24} height={34} rx={4} fill="#d8c8ae" stroke="#8a6a4a" strokeWidth={4} /><path d={`M ${a * 44 - 14} ${b * 30 - 18} L ${a * 44} ${b * 30 - 32} L ${a * 44 + 14} ${b * 30 - 18} Z`} fill="#b5452c" /></g>)}
    <rect x={-26} y={-14} width={52} height={14} rx={3} fill="#b5452c" /><rect x={-26} y={6} width={52} height={14} rx={3} fill="#c9673f" />
    <path d="M -10 40 L -10 26 Q 0 16 10 26 L 10 40 Z" fill="#3a2418" />
  </svg>
);
// 1:28 · los 12+ fuertes caen sobre la línea del muro en PERSPECTIVA (grandes adelante, chicos al horizonte), con polvo
const Fuertes: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const N: [number, number] = [230, 905], V: [number, number] = [1260, 575];
  const P = (z: number): [number, number] => [V[0] + (N[0] - V[0]) / z, V[1] + (N[1] - V[1]) / z];
  const Z = Array.from({ length: 12 }, (_, i) => 1 + i * 0.5);
  const [a0, b0] = P(0.8), [a1, b1] = P(9);
  return (
    <Exterior t={t} tono="dia" horizonte={560}>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <polygon points={`${a0},${b0 - 70} ${a1},${b1 - 8} ${a1},${b1 + 2} ${a0},${b0 + 30}`} fill="#d8c8ae" stroke="#8a7a64" strokeWidth={5} />
        <polygon points={`${a0},${b0 - 70} ${a1},${b1 - 8} ${a1},${b1 - 4} ${a0},${b0 - 52}`} fill="#efe3cc" />
        <line x1={a0} y1={b0 - 10} x2={a1} y2={b1} stroke="#8a7a64" strokeWidth={3} strokeDasharray="40 20" />
      </svg>
      {Z.map((_, k) => Z.length - 1 - k).map((i) => {
        const z = Z[i], [x, y] = P(z), sc = 2.2 / z;
        const ti = 89.3 + i * 0.2;
        if (t < ti - 0.35) return null;
        const f = Math.min(1, (t - (ti - 0.35)) / 0.35);
        const dy = (1 - f * f) * -900;
        const d = t - ti;
        const sq = d > 0 && d < 0.3 ? 1 - Math.sin((d / 0.3) * Math.PI) * 0.2 : 1;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: 0, top: dy, width: 1920, height: 1080, transform: `scale(${2 - sq}, ${sq})`, transformOrigin: `${x}px ${y}px` }}><MiniFuerte x={x} y={y - 44 * sc} s={sc} /></div>
            {d > 0 && d < 0.7 && [0, 1, 2].map((j) => <div key={j} style={{ position: "absolute", left: x - 70 * sc + j * 45 * sc + (j - 1) * d * 80 * sc, top: y - 20 * sc - d * 50 * sc, width: (50 + d * 50) * sc, height: (40 + d * 40) * sc, borderRadius: "50%", background: "#efe3cc", opacity: 0.85 * (1 - d / 0.7) }} />)}
          </React.Fragment>
        );
      })}
      <Actua t={t} x0={1641} x1={1640} y={1050} h={560} quien={4}
        beats={[[t0, "señala"], [90.1, "sorpresa"], [91.3, "festeja"], [92.66, "habla"], [93.42, "encoge"], [94.3, "niega"]]} />
    </Exterior>
  );
};

// 2:28 · las 3 monedas de arriba de TU pila se resbalan, caen y ruedan lejos
const MonedasCaen: React.FC<{ t: number; t0: number; tc: number; x: number; y: number }> = ({ t, t0, tc, x, y }) => (
  <>{[6, 7, 8].map((i, k) => {
    const ta = t0 + i * 0.05;
    if (t < ta) return null;
    const y0 = y - i * 34 - 56;
    const d = Math.max(0, t - tc - k * 0.12);
    const vx = 260 + k * 120, piso = 850 - k * 6;
    let px = x - 110 + d * vx, py = y0 + 900 * d * d;
    let rot = Math.sin(d * 12 + k) * 35;
    if (py > piso) { // rebota y rueda
      const tl = Math.sqrt((piso - y0) / 900);
      const dr = d - tl;
      py = piso - Math.abs(Math.sin(dr * 9)) * Math.exp(-dr * 5) * 50;
      px = x - 110 + tl * vx + dr * vx * 0.9;
      rot = 0;
    }
    const enEje = d > 0 && py >= piso - 60;
    return (
      <div key={i} style={{ position: "absolute", left: px, top: py, width: enEje ? 70 : 220, height: enEje ? 70 : 56, borderRadius: "50%", background: "linear-gradient(180deg,#f4f6fa,#b9c0cc)", border: "7px solid #6a7383", transform: `translateY(${(1 - ent(t, ta)) * -300}px) rotate(${enEje ? d * 720 : rot}deg)`, opacity: 1 - prog(t, tc + 1.6, tc + 2.0) }} />
    );
  })}</>
);

// 2:40 · la familia: el soldado sostiene el diploma, entra la esposa, entran los hijos corriendo, el chico lo abraza
const Familia: React.FC<{ t: number }> = ({ t }) => {
  const tw = T("your wife", D), tk = T("your children", D), ty = T("it says that you", D);
  const xs = 600, h = 520, S = h / 560;
  const xw = interpolate(t, [tw - 0.2, tw + 0.6], [2150, 930], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const xk1 = interpolate(t, [tk, tk + 0.6, tk + 0.9, tk + 1.3], [2200, 1180, 1180, 790], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const xk2 = interpolate(t, [tk + 0.15, tk + 0.8], [2300, 1270], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const abraza = t > tk + 1.3;
  const sube = prog(t, ty + 0.4, ty + 0.8);
  return (
    <AbsoluteFill>
      <Sala t={t} tono="calido" ventana="der" />
      {/* halo dorado detrás del diploma */}
      <Rayos t={t} x={xs + 60} y={720} color="#ffe27a" op={0.16} />
      <Persona x={xs} y={1000} h={h} t={t} seed={3} ropa={{ tunica: "#2e9b8f", tunica2: "#1c6a62", cinto: "#5a3418", piel: "#f2c09a", piel2: "#d99a72", pelo: "#a0602c" }} casco="legion" malla
        expr={abraza ? "feliz" : t > ty + 0.4 ? "orgullo" : "neutro"} habla={t < tw} bD={75 + sube * 10} cD={95 - sube * 20} bI={75 + sube * 10} cI={95 - sube * 20} mira={t > tw ? 0.6 : 0.1} salta={ty + 0.45} />
      <div style={{ position: "absolute", left: 0, top: -sube * 40 }}><DiplomaBronce x={xs + 70} y={760} t={t} s={0.34} abre={1} /></div>
      {/* la esposa */}
      {t > tw - 0.2 && <Persona x={xw} y={1000} h={480} t={t} seed={71} ropa={CIVIL(2)} mujer flip camina={t < tw + 0.6 ? 1.3 : 0} expr="feliz" habla={t > tw + 0.6 && t < tk}
        bD={t > tw + 0.6 ? 110 : 10} cD={t > tw + 0.6 ? 30 : 10} mira={-0.5} />}
      {/* los hijos: uno abraza el diploma, el otro salta */}
      {t > tk && <Persona x={xk1} y={1000} h={300} t={t} seed={72} ropa={CIVIL(3)} flip camina={!abraza && (t < tk + 0.6 || t > tk + 0.9) ? 1.6 : 0}
        expr="feliz" bD={abraza ? 150 : 20} bI={abraza ? 150 : 20} cD={abraza ? 40 : 10} cI={abraza ? 40 : 10} mira={-0.6} inclina={abraza ? -6 : 0} />}
      {t > tk + 0.15 && <Persona x={xk2} y={1000} h={270} t={t} seed={73} ropa={CIVIL(4)} mujer flip camina={t < tk + 0.8 ? 1.6 : 0}
        expr="feliz" salta={tk + 0.85 + Math.floor(Math.max(0, t - tk - 0.85) / 0.7) * 0.7} bD={160} bI={160} cD={20} cI={20} habla />}
      {abraza && <Emote t={t} t0={tk + 1.35} tipo="brillos" x={800} y={560} s={0.7} />}
    </AbsoluteFill>
  );
};

// 2:50 · plano medio: tilda su plan de carrera con la pluma; «in practice» → oscurece, rayo y la hoja se parte y vuela
const Carrera: React.FC<{ t: number }> = ({ t }) => {
  const tp = T("so on paper", D), ti = T("in practice", D);
  const ticks = [tp + 0.3, tp + 0.7, tp + 1.1, tp + 1.5];
  const r = prog(t, ti, ti + 0.9);
  const oscuro = prog(t, ti - 0.05, ti + 0.25);
  const ITEMS = ["25 YEARS", "STEADY PAY", "CITIZENSHIP", "FAMILY"];
  return (
    <AbsoluteFill>
      <Sala t={t} tono="calido" ventana="izq" />
      {/* la hoja del plan (se parte en dos al «in practice») */}
      {[0, 1].map((k) => (
        <div key={k} style={{ position: "absolute", left: 1040 + k * 300, top: 270, width: 300, height: 560, overflow: "hidden", transform: `translate(${r * (k ? 760 : -120)}px, ${r * (k ? -420 : 560)}px) rotate(${r * (k ? 70 : -55)}deg)` }}>
          <div style={{ position: "absolute", left: -k * 300, width: 600, height: 560, background: "linear-gradient(180deg,#fbeccb,#efd8a8)", border: "8px solid #8a5a2a", borderRadius: 14, boxSizing: "border-box", fontFamily, fontWeight: 700, color: "#5a3418", padding: "30px 40px" }}>
            <div style={{ fontSize: 60, textAlign: "center" }}>CAREER PLAN</div>
            {ITEMS.map((it, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 30, fontSize: 48 }}>
                <div style={{ width: 62, height: 62, border: "6px solid #5a3418", borderRadius: 10, position: "relative", flexShrink: 0, background: "#fff8e6" }}>
                  {t > ticks[i] && <div style={{ position: "absolute", left: -6, top: -24, fontSize: 84, lineHeight: "84px", color: "#2e9b5a", transform: `scale(${ent(t, ticks[i], 0, { damping: 9, stiffness: 240 })})` }}>✓</div>}
                </div>
                {it}
              </div>
            ))}
          </div>
        </div>
      ))}
      <Actua t={t} x0={820} x1={821} y={1000} h={520}
        manoD={<g transform="rotate(-30)"><path d="M 0 0 L 6 -90 Q 30 -60 14 -10 Z" fill="#fff" stroke="#8a8a9a" strokeWidth={4} /><line x1={0} y1={0} x2={10} y2={-80} stroke="#5a3418" strokeWidth={4} /></g>}
        beats={[[tp - 0.1, "escribe"], [tp + 1.9, "festeja"], [ti, "sorpresa"], [ti + 0.45, "triste"]]} />
      {/* «in practice»: oscurece, rayo y lluvia */}
      <AbsoluteFill style={{ background: "#141030", opacity: 0.55 * oscuro }} />
      {t > ti && t < ti + 0.18 && <AbsoluteFill style={{ background: "#fff", opacity: 0.6 }} />}
      {oscuro > 0 && Array.from({ length: 40 }, (_, i) => { const q = ((t * 1.5 + i * 0.137) % 1); const x = (i * 53) % 1960; return <div key={i} style={{ position: "absolute", left: x, top: q * 1100 - 40, width: 4, height: 34, background: "#bcd0ff", opacity: 0.6 * oscuro, transform: "rotate(14deg)" }} />; })}
    </AbsoluteFill>
  );
};

// 1:36-1:50 · el muro que se angosta (corte con regla que se llena) y el pantalón que encogió en la tina
const Ancho2: React.FC<{ t: number }> = ({ t }) => {
  const n = T("built narrower", D), p = T("like a pair of trousers", D), t0 = T("the wall was planned", D);
  const tf = T("thick foundations", D), t10 = T("10 roman feet", D);
  const X = 760, U = 60; // 1 pie = 60 px
  const w = 600 - 240 * prog(t, n - 0.1, n + 0.9);
  const top = 840 - 6 * 55;
  if (t >= p) return <Pantalon t={t} p={p} />;
  const mira = t > n - 0.1 && t < tf;
  // obrero de arriba: coloca sillares, después saluda asustado mientras el muro se angosta
  const G = gesto(t, [[t0 + 1.0, "habla"], [T("partway through", D), "cava"], [n - 0.15, "miedo"], [tf, "festeja"]]);
  const saluda = t > n + 0.25 && t < tf;
  return (
    <>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <rect x={0} y={900} width={1920} height={180} fill="#5f8a3a" />
        <rect x={X - 300} y={840} width={600} height={60} fill="#a8967a" stroke={t > tf ? C.teal : "#6a5a44"} strokeWidth={t > tf ? 12 : 6} />
        {t > n - 0.1 && t < n + 1.6 && Array.from({ length: 8 }, (_, i) => {
          const k = prog(t, n - 0.1 + i * 0.1, n + 0.7 + i * 0.1);
          const sx = 1;
          return <rect key={i} x={X - 300 + w + k * (260 + i * 30)} y={560 + i * 35 - Math.sin(k * Math.PI) * 220 + k * 280} width={60} height={34} rx={4} fill="#cdbb9e" stroke="#8a7a64" strokeWidth={4} transform={`rotate(${k * 400 * sx} ${X + 60} 560)`} opacity={1 - prog(t, n + 1.2, n + 1.6)} />;
        })}
      </svg>
      {/* hiladas que bajan al levantarse, con textura */}
      {Array.from({ length: 6 }, (_, k) => {
        const ek = prog(t, t0 + 0.2 + k * 0.12, t0 + 0.5 + k * 0.12);
        return ek > 0 ? <div key={k} style={{ position: "absolute", left: 0, top: -(1 - ek) * 300, opacity: ek }}><Sillares x={X - 300} y={785 - k * 55} w={w} h={55} fila={55} col={92} seed={k + 3} /></div> : null;
      })}
      {/* regla: las marcas de a 1 pie se llenan una por una; al angostar, las que sobran se ponen rojas y caen */}
      {t > t10 - 0.3 && t < tf && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
          <rect x={X - 300 - 10} y={915} width={620} height={46} rx={8} fill="#ffd34a" stroke="#8a6a1a" strokeWidth={5} />
          {Array.from({ length: 10 }, (_, i) => {
            const on = t > t10 - 0.3 + i * 0.1;
            const xr = X - 300 + (i + 1) * U;
            const fuera = t > n && i >= 6;
            const cae = fuera ? prog(t, n + 0.1 + (9 - i) * 0.08, n + 0.6 + (9 - i) * 0.08) : 0;
            return on ? (
              <g key={i} transform={`translate(0 ${cae * 160})`} opacity={1 - cae}>
                <rect x={xr - U + 3} y={919} width={U - 6} height={38} fill={fuera ? "#ff7a6a" : "#ffe58a"} />
                <line x1={xr} y1={915} x2={xr} y2={945} stroke="#2a1530" strokeWidth={5} />
                <text x={xr - U / 2} y={1003} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={30} fill={fuera ? C.rojo : "#fff"} stroke="#2a1530" strokeWidth={6} paintOrder="stroke">{i + 1}</text>
              </g>
            ) : null;
          })}
        </svg>
      )}
      {/* el obrero de arriba, grande */}
      {t > t0 + 0.9 && <Persona x={X - 300 + w / 2} y={top + 8} h={300} t={t} seed={41} ropa={AUXR} casco="legion" aparece={t0 + 0.9}
        {...G} expr={saluda ? "miedo" : G.expr} bD={saluda ? 150 + Math.sin(t * 14) * 25 : G.bD} cD={saluda ? 40 + Math.sin(t * 14) * 20 : G.cD}
        inclina={saluda || mira ? Math.sin(t * 6) * 7 : G.inclina} mira={0.3} />}
      {/* soldado al lado: la escala humana */}
      <Actua t={t} x0={1950} x1={1500} y={970} h={430} quien={3} beats={[[t0 + 0.2, "camina"], [t0 + 1.2, "señala"], [n, "sorpresa"], [n + 1.0, "niega"], [tf, "señala"]]} />
      {t < n && <Grande t={t} t0={t10} text="10 ROMAN FEET" x={1400} y={170} size={88} color={C.ambar} />}
      {t > n && <Grande t={t} t0={n} text="→ 6-8 FEET" x={1400} y={170} size={88} color={C.rojo} borde="#fff" />}
      {t > tf && <Chip t={t} t0={tf} text="↑ FOUNDATIONS: STILL 10 FT" color={C.teal} tinta={C.noche} x={X} y={985} centro size={44} />}
    </>
  );
};
const AUXR = { tunica: "#c95a3d", tunica2: "#8f3a25", cinto: "#4a2a17", piel: "#5a3a26", piel2: "#3f2618", pelo: "#1d1410" };
// el pantalón sale de la tina, encoge 50 % con pop, salta a las piernas del soldado y le llega a las rodillas
const Pantalon: React.FC<{ t: number; p: number }> = ({ t, p }) => {
  const ts = T("shrank in the wash", D), tv = ts + 0.45, tl = tv + 0.3;
  const sube = prog(t, p + 0.05, p + 0.6);
  const esc = t < ts ? 1 : 1 - 0.5 * ent(t, ts, 0, { damping: 8, stiffness: 260 });
  const xs = 1380, ys = 1000, h = 500, S = h / 560;
  const vuelo = prog(t, tv, tl);
  const px = interpolate(vuelo, [0, 1], [620, xs]), py = interpolate(vuelo, [0, 1], [560 - Math.sin(0) * 0, ys - 150 * S]) - Math.sin(vuelo * Math.PI) * 220;
  const puesto = t > tl;
  return (
    <>
      <Sala t={t} tono="calido" ventana="der" estante={false} />
      {/* tina con espuma */}
      <svg style={{ position: "absolute", left: 620, top: 900, overflow: "visible" }} width={1} height={1}>
        <path d="M -250 -150 L 250 -150 L 210 60 L -210 60 Z" fill="#a8622c" stroke="#5a3418" strokeWidth={10} />
        {[-110, -30, 50, 130].map((x) => <line key={x} x1={x} y1={-150} x2={x * 0.85} y2={60} stroke="#7a4520" strokeWidth={6} />)}
        <rect x={-235} y={-90} width={470} height={18} fill="#5d6577" /><rect x={-222} y={0} width={444} height={18} fill="#5d6577" />
        <ellipse cx={0} cy={-150} rx={250} ry={40} fill="#7ab8e0" />
        {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={-200 + i * 36 + Math.sin(t * 3 + i) * 8} cy={-160 - ((t * 50 + i * 23) % 70)} r={18 + (i % 3) * 8} fill="#fff" opacity={0.85} />)}
      </svg>
      {/* el soldado que se los prueba */}
      <Persona x={xs} y={ys} h={h} t={t} seed={3} ropa={{ tunica: "#2e9b8f", tunica2: "#1c6a62", cinto: "#5a3418", piel: "#f2c09a", piel2: "#d99a72", pelo: "#a0602c" }} casco="no" malla flip
        expr={puesto ? "sorpresa" : t > ts ? "sorpresa" : "neutro"} salta={puesto ? tl : t > ts ? ts : undefined}
        miraY={puesto ? 1 : 0} mira={puesto ? 0 : -0.6} bD={puesto ? 40 : 20} bI={puesto ? 40 : 20} cD={puesto ? 20 : 10} cI={puesto ? 20 : 10} />
      {/* pantalón: en la tina → encoge → vuela → puesto (sólo hasta las rodillas) */}
      {!puesto && (
        <svg style={{ position: "absolute", left: px, top: t < tv ? 840 - sube * 380 : py, overflow: "visible" }} width={1} height={1}>
          <g transform={`scale(${esc}) rotate(${vuelo * 360 + Math.sin(t * 7) * 3})`}>
            <path d="M -110 -160 L 110 -160 L 120 160 L 30 160 L 0 -10 L -30 160 L -120 160 Z" fill="#3d7fc9" stroke="#25548f" strokeWidth={10} />
            <rect x={-110} y={-160} width={220} height={26} fill="#25548f" />
          </g>
        </svg>
      )}
      {t > p + 0.05 && t < tv && Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 620 - 100 + i * 40, top: 840 - sube * 380 + 170 + ((t * 300 + i * 40) % 160), width: 12, height: 18, borderRadius: "50%", background: "#7ab8e0" }} />)}
      {puesto && (
        <svg style={{ position: "absolute", left: xs - 300 * S, top: ys - 640 * S, overflow: "visible" }} width={600 * S} height={680 * S} viewBox="-300 -640 600 680">
          <g transform={`translate(0 ${t - tl < 0.7 ? -Math.abs(Math.sin((t - tl) * 9)) * Math.exp(-(t - tl) * 4) * 80 : 0})`}>
            <path d="M -62 -205 L 62 -205 L 64 -100 L 8 -100 L 0 -150 L -8 -100 L -64 -100 Z" fill="#3d7fc9" stroke="#25548f" strokeWidth={8} />
          </g>
        </svg>
      )}
      {t > ts && <Chip t={t} t0={ts + 0.05} text="−50%" color={C.rojo} x={860} y={380} centro size={56} />}
      {puesto && <Chip t={t} t0={tl + 0.05} text="KNEE-LENGTH" color={C.violeta} x={xs} y={300} centro size={44} />}
      <Chip t={t} t0={p} text="SHRANK IN THE WASH" color={C.rosa} x={960} y={150} centro size={70} />
    </>
  );
};

// 3:00 · pictos con poses distintas: lanza en alto, puño, uno que saluda burlón, uno en jarras, uno agachado
const PictoV: React.FC<{ x: number; y: number; s?: number; t: number; seed: number; pose: number; sube: number }> = ({ x, y, s = 1, t, seed, pose, sube }) => {
  const u = Math.min(1, Math.max(0, (t - sube) / 0.4));
  if (u <= 0) return null;
  const ph = seed * 1.3;
  const bob = Math.sin(t * 5 + ph) * 4;
  const agacha = pose === 4 ? 30 : 0;
  const sw = Math.sin(t * 12 + ph);
  // brazos [hombroD, hombroI] en grados desde abajo (positivo = afuera/arriba)
  const bD = pose === 0 ? 150 : pose === 1 ? 160 + sw * 12 : pose === 2 ? 150 + sw * 30 : pose === 3 ? 40 : 70;
  const bI = pose === 0 ? 20 : pose === 1 ? 30 : pose === 2 ? 30 : pose === 3 ? 40 : 60;
  const cD = pose === 3 ? -110 : pose === 2 ? 20 : 10, cI = pose === 3 ? -110 : 10;
  const brazo = (sd: 1 | -1, a: number, c: number, mano: React.ReactNode) => (
    <g transform={`translate(${sd * 28} -118) rotate(${-sd * a})`}>
      <line x1={0} y1={0} x2={0} y2={46} stroke="#2a2350" strokeWidth={16} strokeLinecap="round" />
      <g transform={`translate(0 46) rotate(${-sd * c})`}><line x1={0} y1={0} x2={0} y2={42} stroke="#2a2350" strokeWidth={14} strokeLinecap="round" /><g transform="translate(0 46)">{mano}</g></g>
    </g>
  );
  return (
    <svg style={{ position: "absolute", left: x - 70 * s, top: y - 240 * s, overflow: "visible" }} width={140 * s} height={240 * s} viewBox="-70 -240 140 240">
      <g transform={`translate(0 ${(1 - u) * 240 + bob + agacha})`}>
        {pose === 0 && <g transform={`rotate(${Math.sin(t * 6 + ph) * 10} 0 -120)`}><rect x={-5} y={-250} width={10} height={210} rx={5} fill="#3a2418" transform="translate(44 -20)" /><path d="M 44 -276 L 56 -246 L 32 -246 Z" fill="#9aa4b4" /></g>}
        {brazo(1, bD, cD, pose === 1 ? <circle r={11} fill="#2a2350" /> : <circle r={9} fill="#2a2350" />)}
        {brazo(-1, bI, cI, <circle r={9} fill="#2a2350" />)}
        <rect x={-30} y={-130} width={60} height={118 - agacha * 0.5} rx={20} fill="#2a2350" />
        <path d="M -20 -110 q 10 20 0 40 M 10 -100 q 14 10 4 40" stroke="#4fb0d8" strokeWidth={6} fill="none" />
        <circle cx={0} cy={-158} r={32} fill="#2a2350" />
        <path d="M -34 -170 Q -46 -214 -14 -196 Q 0 -226 16 -198 Q 46 -214 34 -170 Z" fill="#a0602c" />
        <circle cx={-11} cy={-160} r={7} fill="#fff" /><circle cx={11} cy={-160} r={7} fill="#fff" />
        {pose === 2 ? <>
          <path d="M -20 -168 Q -11 -176 -2 -168 M 2 -168 Q 11 -176 20 -168" stroke="#fff" strokeWidth={4} fill="none" />
          <path d="M -14 -146 Q 0 -126 14 -146 Z" fill="#5a1a22" /><ellipse cx={4} cy={-136} rx={6} ry={7} fill="#e87a8a" />
        </> : <>
          <line x1={-20} y1={-174} x2={-4} y2={-168} stroke="#fff" strokeWidth={4} /><line x1={20} y1={-174} x2={4} y2={-168} stroke="#fff" strokeWidth={4} />
          {pose !== 3 && <ellipse cx={0} cy={-140} rx={9} ry={8 + Math.abs(Math.sin(t * 12 + ph)) * 6} fill="#5a1a22" />}
          {pose === 3 && <path d="M -10 -142 Q 0 -148 10 -142" stroke="#fff" strokeWidth={4} fill="none" />}
        </>}
        <rect x={-22} y={-14} width={16} height={14} fill="#2a2350" /><rect x={6} y={-14} width={16} height={14} fill="#2a2350" />
      </g>
    </svg>
  );
};
