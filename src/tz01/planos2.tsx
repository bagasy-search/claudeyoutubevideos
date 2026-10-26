// tz01 · planos 29-45 (112,4 → 211 s): la parábola. Vaishali, Amrapali, los monjes, el Buda y los 500.
// Vuelta 2 (director): multitudes con función (pose/escala/profundidad/gesto distintos), componente por frase, cortes limpios.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../anikit/camara";
import { Actor, ActorProps } from "../anikit/actor";
import { Calendario, Contador, GranNumero, Globo, Pildora, Temporizador } from "../anikit/pantalla";
import { Halo } from "../anikit/luz";
import { Multitud } from "../anikit/explica";
import { ACENTO, ALDEANA, ALDEANO, AMRAPALI, BUDA, ESC, LOTO, LOTO_ENSENA, MONJE_JOVEN, ORO, REY } from "../tenzo/elenco";
import { Look } from "../anikit/personaje";
import { Rotulo } from "../tenzo/hud";
import { Cuenco, Elefante } from "../tenzo/utileria";
import { VAI_PISO, VAI_PUNTOS } from "../tenzo/sets/vaishali";
import { CEL_SENT, kDe, Lav, LAV_PUNTOS, SENTADO, Vai } from "./base";
import { Hud } from "./planos1";
import { Chispa, Collar, EspadaDe, LlamadaMundo, Mango, Pensamiento, Rio, Salpica, lerp } from "./extras";

const VP = VAI_PISO, V = VAI_PUNTOS;
const A: React.FC<ActorProps> = (p) => <Actor escala={ESC} {...p} />;
// monjes de la arboleda / de la fila: variantes del joven (más viejos, otra piel)
export const MONJE = (k: number): Look => ({ ...MONJE_JOVEN, piel: ["#c98e5e", "#d9a273", "#b9855a", "#e0b080"][k % 4], miembro: ["#c98e5e", "#d9a273", "#b9855a", "#e0b080"][k % 4], accesorios: [{ t: "pelo", forma: "calvo", color: ["#c98e5e", "#d9a273", "#b9855a", "#e0b080"][k % 4] }, { t: "tunica", color: ["#e07a2c", "#d8702a", "#e88a34", "#d06a24"][k % 4], largo: 0.9 }] });
export const HOMBRE = (k: number): Look => ({ ...ALDEANO, camisa: ["#d9a86e", "#c8603a", "#a8723a", "#e0b040", "#8a6a4a"][k % 5], accesorios: [{ t: "pelo", forma: "corto", color: "#22160e" }, ...(k % 2 ? [{ t: "barba" as const, color: "#22160e" }] : [])] });
// el Buda bajo el árbol y el joven (posiciones fijas de la arboleda)
export const Buda: React.FC<Partial<ActorProps>> = (o) => <A look={BUDA} seed={11} ruta={[{ f: 0, x: V.buda, y: VP }]} asiento={[{ f: 0, v: 8 }]} poses={[{ f: 0, v: LOTO }]} caras={[{ f: 0, v: "neutral" }]} dir={[{ f: 0, v: -1 }]} {...o} />;
// monjes sentados con cara (primera fila de la arboleda)
export const MonjesCara: React.FC<{ caras?: string[]; habla?: [number, number][][]; giran?: number; poses?: Record<string, number>[] }> = ({ caras = [], habla = [], giran = 0, poses = [] }) => (
  <>{[0, 1, 2, 3, 4].map((k) => {
    const x = V.monjes - 420 + k * 150 + (k > 2 ? 820 : 0);
    return <A key={k} look={MONJE(k)} seed={20 + k} escala={ESC * 0.92} ruta={[{ f: 0, x, y: VP + 60 }]} asiento={[{ f: 0, v: 8 }]} poses={[{ f: 0, v: { ...LOTO, ...(poses[k] ?? {}) } }]}
      caras={[{ f: 0, v: caras[k] ?? "neutral" }]} dir={[{ f: 0, v: k > 2 ? -1 : 1 }]} habla={habla[k]} giros={giran ? [{ f: 0, v: 0 }, { f: giran, v: k % 2 ? 0.5 : -0.5 }] : undefined} />;
  })}</>
);
const PARADO_CUENCO = { hD: 60, cD: 70, hI: 50, cI: 80 };
const OFRECE = { hD: 82, cD: 8, hI: 50, cI: 80, tronco: 6 }; // extiende el cuenco
// notas de música que suben de una ventana
export const Notas: React.FC<{ x: number; y: number; desde: number }> = ({ x, y, desde }) => {
  const f = useF() - desde;
  if (f < 0) return null;
  return <g>{[0, 1, 2, 3].map((k) => { const t = ((f + k * 14) % 56) / 56; return <text key={k} x={x + k * 26 + Math.sin(t * 6 + k) * 18} y={y - t * 160} fontSize={44} fill="#7a3a1a" opacity={Math.sin(t * Math.PI)}>{k % 2 ? "♪" : "♫"}</text>; })}</g>;
};
const Velo: React.FC<{ a: number; b: number; color?: string; max?: number }> = ({ a, b, color = ORO, max = 1 }) => { const f = useF(); return <AbsoluteFill style={{ background: color, opacity: lerp(f, a, b, 0, max) }} />; };

// ---------- 29 · «2,500 years ago, the old man says»: levanta la mano y en el aire se dibuja la ciudad ----------
const k29 = kDe(112.36);
const Ciudad: React.FC = () => (
  <g>
    <rect x={0} y={0} width={480} height={250} fill="#f6d79a" />
    <circle cx={380} cy={70} r={34} fill="#ffe7a8" />
    {[[20, 150, 100], [130, 110, 120], [262, 135, 90], [360, 160, 100]].map(([x, y, w], i) => <g key={i}><rect x={x} y={y} width={w} height={250 - y} fill="#d9944a" /><path d={`M${x - 8},${y} L${x + w / 2},${y - 36} L${x + w + 8},${y} Z`} fill="#b0602e" /><rect x={x + w / 2 - 12} y={220} width={24} height={30} rx={10} fill="#ffcf4a" /></g>)}
  </g>
);
export const P29Cuenta: React.FC = () => (
  <Lav cl={[mira(0, 1640, 680, 2.3), mira(78, 1640, 682, 2.5)]} leo={{ no: true }} sp={{ luzFarol: 1.3 }} toalla={0.5}
    tenzo={{ habla: [[0, k29(115)]], caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: { x: -0.7, y: -0.5 } }],
      poses: [{ f: 0, v: { ...SENTADO, hD: 50, cD: 60, hI: 40, cI: 40 } }, { f: 14, v: { ...SENTADO, hD: 140, cD: 30, hI: 40, cI: 40, cabeza: -6 } }, { f: 60, v: { ...SENTADO, hD: 150, cD: 20, hI: 40, cI: 40, cabeza: -6 } }] }}
    hud={<><Hud /><Calendario texto="2,500 YEARS AGO" x={1420} y={70} desde={4} acento={ORO} /><Pensamiento x={600} y={250} w={480} h={250} desde={18} cola={{ x: 1060, y: 420 }} fondo="#fff4dc"><Ciudad /></Pensamiento></>} />
);
// ---------- 29b · Vaishali: rica, oro en las puertas, música cada noche ----------
const k29b = kDe(115.0);
const c29b = [mira(0, 700, 420, 0.78), mira(k29b(118.4), 620, 560, 1.05, { curva: "inout" }), mira(k29b(119.4), 602, 700, 2.0, { curva: "inout" }), mira(195, 640, 690, 2.1)];
export const P29Calle: React.FC = () => (
  <Vai cl={c29b} sp={{ noche: false }}
    medio={<>
      {[0, 1, 2, 3, 4].map((k) => <A key={k} look={k % 2 ? ALDEANA : HOMBRE(k)} seed={30 + k} escala={ESC * (k === 2 ? 1.08 : 0.95)} ruta={[{ f: 0, x: (k % 2 ? 1300 : -200) + k * 300, y: VP }, { f: 200, x: (k % 2 ? 900 : 120) + k * 300, y: VP, curva: "lineal" }]} dir={[{ f: 0, v: k % 2 ? -1 : 1 }]}
        caras={[{ f: 0, v: k === 3 ? "risa" : "feliz" }]} poses={[{ f: 0, v: k === 1 ? { hD: 120, cD: 30 } : k === 4 ? "brazosCruzados" : "parado" }]} />)}
      <Notas x={880} y={560} desde={k29b(120.8)} />
    </>}
    hud={<><Rotulo texto="VAISHALI, INDIA · 2,500 YEARS AGO" desde={8} />
      <LlamadaMundo cl={c29b} X={602} Y={770} dx={360} dy={-250} texto="GOLD ON THE DOORS" desde={k29b(119.6)} />
      <LlamadaMundo cl={c29b} X={900} Y={560} dx={330} dy={-120} texto="MUSIC EVERY NIGHT" desde={k29b(120.9)} color="#ffe2a6" /></>} />
);
// ---------- 30 · una mujer llamada Amrapali: se levanta y baila ----------
const k30 = kDe(121.5);
export const P30Amrapali: React.FC = () => (
  <Vai cl={[mira(0, V.pabellon, 560, 1.15), mira(110, V.pabellon, 640, 1.75, { curva: "inout" })]} sp={{ noche: true }}
    medio={<A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: V.pabellon, y: VP - 40 }]} asiento={[{ f: 0, v: 40 }, { f: 30, v: undefined }]}
      poses={[{ f: 0, v: { tronco: -4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 30, cD: 60, hI: 20, cI: 40 } }, { f: 36, v: "parado" }, { f: 52, v: { hD: 150, cD: 40, hI: 40, cI: 90, tronco: -6 } }, { f: 70, v: { hD: 40, cD: 90, hI: 150, cI: 40, tronco: 6 } }, { f: 88, v: { hD: 150, cD: 40, hI: 40, cI: 90, tronco: -6 } }, { f: 106, v: { hD: 120, cD: 60, hI: 120, cI: 60 } }]}
      caras={[{ f: 0, v: "feliz" }, { f: 50, v: "risa" }]} giros={[{ f: 0, v: 0.3 }, { f: 60, v: -0.4 }, { f: 80, v: 0.4 }, { f: 100, v: 0 }]} />}
    hud={<Pildora texto="AMRAPALI" x={960} y={120} desde={k30(123.7)} color="#ffe2a6" tam={52} />} />
);
// ---------- 31 · el farol titila y el lavadero desaparece: plano de dos, Leo deja de mirar el tel ----------
export const P31Titila: React.FC = () => {
  const f = useF();
  return (
    <>
      <Lav cl={[mira(0, 1450, 690, 1.7), mira(72, 1560, 690, 2.4, { curva: "inout" })]} sp={{ luzFarol: f % 9 < 3 ? 0.4 : 1.6 }} toalla={0.5}
        leo={{ miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }, { f: 14, v: { x: 0.9, y: -0.1 } }], caras: [{ f: 0, v: "cansado" }, { f: 16, v: "sorpresa" }], poses: [{ f: 0, v: CEL_SENT }, { f: 18, v: { ...CEL_SENT, cabeza: 0, tronco: -8 } }] }}
        tenzo={{ habla: [[0, 40]], caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }] }}
        extra={<Halo x={LAV_PUNTOS.farol} y={700} r={lerp(f, 30, 73, 200, 1400)} color={ORO} fuerza={lerp(f, 30, 73, 0.3, 0.9)} />} hud={<Hud />} />
      <Velo a={50} b={73} max={0.85} />
    </>
  );
};
// ---------- 31b · viento caliente, elefantes en la calle: uno de los hombres salta para no ser pisado ----------
export const P31Elefantes: React.FC = () => {
  const f = useF();
  return (
    <Vai cl={[mira(0, 380, 560, 0.95), mira(118, 600, 560, 1.0, { curva: "inout" })]} sp={{}}
      medio={<>
        <Elefante x={-300 + f * 4.4} piso={VP} dir={1} s={1.3} paso={f / 28} />
        <Elefante x={-900 + f * 4.4} piso={VP + 20} dir={1} s={1.1} paso={f / 28 + 0.4} />
        <A look={HOMBRE(2)} seed={40} ruta={[{ f: 0, x: 1250, y: VP }, { f: 40, x: 1150, y: VP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }]} poses={[{ f: 0, v: "parado" }]} />
        <A look={HOMBRE(3)} seed={41} ruta={[{ f: 0, x: 520, y: VP + 30 }, { f: 64, x: 640, y: VP + 30 }, { f: 72, x: 720, y: VP - 60 }, { f: 82, x: 860, y: VP + 30, curva: "out" }]} dir={[{ f: 0, v: 1 }]}
          caras={[{ f: 0, v: "feliz" }, { f: 58, v: "miedo" }]} poses={[{ f: 0, v: "parado" }, { f: 62, v: "celebrar" }, { f: 84, v: "manosCara" }]} />
        <A look={ALDEANA} seed={42} escala={ESC * 0.9} ruta={[{ f: 0, x: 1500, y: VP - 20 }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "sorpresa" }]} poses={[{ f: 0, v: "señalar" }]} />
      </>}
      hud={<Pildora texto="HOT WIND · ELEPHANTS IN THE STREET" x={960} y={120} desde={50} color="#ffe2a6" />} />
  );
};
// ---------- 32 · el jardín de mangos: arranca un mango, lo huele; los hombres del portón se dan vuelta ----------
const k32 = kDe(131.5);
export const P32Mangos: React.FC = () => (
  <Vai cl={[mira(0, 2400, 520, 1.15), mira(70, 2480, 540, 1.22, { curva: "inout" }), mira(71, 2640, 640, 2.0), mira(160, 2660, 650, 2.15)]}
    medio={<>
      {[0, 1].map((k) => <A key={k} look={HOMBRE(k + 1)} seed={45 + k} escala={ESC * 0.85} ruta={[{ f: 0, x: 2250 + k * 110, y: VP - 30 }]} dir={[{ f: 0, v: -1 }, { f: k32(134.6) + k * 6, v: 1 }]} caras={[{ f: 0, v: "neutral" }, { f: k32(134.7) + k * 6, v: "sorpresa" }]} />)}
      <A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: 2560, y: VP }, { f: 56, x: 2700, y: VP }]} enManoD={(f: number) => (f > 84 ? <Mango s={1.4} /> : null)}
        poses={[{ f: 0, v: { hD: 30, cD: 50, hI: 20, cI: 30 } }, { f: 70, v: { hD: 160, cD: 10, hI: 20, cI: 30, cabeza: -10 } }, { f: 86, v: { hD: 160, cD: 30 } }, { f: 100, v: { hD: 60, cD: 140, cabeza: 6 } }]}
        caras={[{ f: 0, v: "feliz" }, { f: 104, v: "risa" }]} miradas={[{ f: 0, v: { x: 0.6, y: -0.6 } }, { f: 100, v: { x: 0.5, y: 0.2 } }]} />
    </>}
    hud={<Pildora texto="THE MOST BEAUTIFUL WOMAN IN INDIA" x={960} y={120} desde={k32(134.5)} color="#ffe2a6" />} />
);
// ---------- 33 · «princes crossed rivers»: dos príncipes vadean un río con regalos en alto → corte: «kings fought wars»: dos reyes se baten a espada, chispas; ella mira aburrida ----------
const PRINCIPE = (c: string): Look => ({ ...REY, camisa: c, pantalon: c, accesorios: [{ t: "pelo", forma: "corto", color: "#2a1a10" }, { t: "tunica", color: c, largo: 1 }, { t: "vincha", color: "#e0b040" }] });
const ALTO_REGALO = { hD: 105, cD: 45, hI: 100, cI: 50, tronco: -4, cabeza: -6 };
const REY_ALTO = { hD: 150, cD: 25, hI: 30, cI: 40, tronco: -6, cabeza: -4 };
const REY_GOLPE = { hD: 78, cD: 6, hI: 20, cI: 30, tronco: 16, cabeza: 6, pI: -20, pD: 24, rD: 20 };
const T33 = 65; // corte a los reyes
const golpes = (desde: number, fase: number) => { const o: { f: number; v: typeof REY_ALTO }[] = [{ f: 0, v: REY_ALTO }]; for (let g = desde + fase; g < 125; g += 16) o.push({ f: g, v: REY_GOLPE }, { f: g + 8, v: REY_ALTO }); return o; };
const angRey = (fase: number) => (f: number) => { const g = (f - T33 - fase + 1600) % 16; return g < 8 ? -25 + (g / 8) * 105 : 80 - ((g - 8) / 8) * 105; };
export const P33Reyes: React.FC = () => {
  const f = useF();
  const reyA: ActorProps = { look: REY, escala: ESC * 1.05, seed: 50, ruta: [{ f: 0, x: 1440, y: VP }], dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "enojo" }], poses: golpes(T33 + 2, 0), habla: [[T33, 125]] };
  const reyB: ActorProps = { look: { ...REY, camisa: "#3a5a8a", pantalon: "#3a5a8a", accesorios: [{ t: "barba", color: "#2a1a10" }, { t: "pelo", forma: "corto", color: "#2a1a10" }, { t: "tunica", color: "#3a5a8a", largo: 1 }, { t: "corona", color: "#e0b040" }] } as Look, escala: ESC * 1.05, seed: 51, ruta: [{ f: 0, x: 1790, y: VP }], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "determinado" }, { f: T33 + 20, v: "enojo" }], poses: golpes(T33 + 2, 8) };
  const choques = Array.from({ length: 8 }).map((_, i) => T33 + 2 + 4 + i * 8);
  return (
    <Vai cl={[mira(0, 900, 620, 1.3), mira(T33 - 1, 960, 620, 1.36), mira(T33, 1730, 640, 1.6), mira(125, 1730, 636, 1.7)]}
      medio={f < T33 ? <>
        {[0, 1].map((k) => {
          const x0 = [520, 230][k], x1 = [1080, 760][k];
          const x = interpolate(f, [0, T33], [x0, x1]);
          return <g key={k}>
            <A look={PRINCIPE(["#2e7a5a", "#7a3a8a"][k])} seed={52 + k} escala={ESC * (k ? 0.95 : 1.05)} ruta={[{ f: 0, x: x0, y: VP + 20 + k * 20 }, { f: T33, x: x1, y: VP + 20 + k * 20, curva: "lineal" }]} dir={[{ f: 0, v: 1 }]}
              enManoD={k ? <Mango s={1.6} /> : <Collar s={1.8} />} caras={[{ f: 0, v: "determinado" }]} poses={[{ f: 0, v: ALTO_REGALO }]} ajuste={(p) => ({ ...p, ...ALTO_REGALO, hD: ALTO_REGALO.hD + 6 * Math.sin(f / 5 + k) })} />
            <Salpica x={x} y={VP - 40} f={f + k * 7} />
          </g>;
        })}
        <Rio y={VP - 30} />
      </> : <>
        <A look={AMRAPALI} seed={12} escala={ESC * 0.85} ruta={[{ f: 0, x: 2080, y: VP - 50 }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "duda" }]} poses={[{ f: 0, v: "brazosCruzados" }]} miradas={[{ f: 0, v: { x: 0, y: 0.2 } }]} />
        <A {...reyA} /><A {...reyB} />
        <EspadaDe a={reyA} ang={angRey(0)} /><EspadaDe a={reyB} ang={angRey(8)} />
        {choques.map((c) => <Chispa key={c} x={1615} y={VP - 330} f0={c} f={f} />)}
      </>}
      hud={<Contador x={110} y={130} tam={46} alinear="der" lineas={[{ etiqueta: "RIVERS CROSSED", claves: [{ f: 0, v: 0 }, { f: 12, v: 7, d: 40 }], color: "#ffe2a6" }, ...(f >= T33 ? [{ etiqueta: "WARS", claves: [{ f: T33, v: 0 }, { f: T33 + 10, v: 1, d: 6 }, { f: T33 + 34, v: 2, d: 6 }], color: ACENTO }] : [])]} />} />
  );
};
// ---------- 34 · «every man in Vaishali knew her name»: la ola de su nombre recorre a todos los hombres de la ciudad (Multitud) → «and every man wanted the same thing»: la calle entera avanza hacia ella con los brazos estirados; ella retrocede ----------
const k34 = kDe(141.02);
const T34 = k34(143.0);
const QUIERE = { hD: 92, cD: 8, hI: 86, cI: 14, tronco: 10, cabeza: 4 };
export const P34Todos: React.FC = () => {
  const f = useF();
  return (
    <Vai cl={[mira(0, 1350, 600, 1.15), mira(T34 - 1, 1360, 600, 1.17), mira(T34, 1480, 620, 1.3), mira(173, 1590, 625, 1.42, { curva: "inout" })]}
      medio={f < T34 ? null : <>
        {[0, 1, 2, 3, 4, 5].map((k) => {
          const lejos = k % 3 === 2;
          const x0 = 700 + k * 150, x1 = 1320 + k * 70;
          return <A key={k} look={HOMBRE(k)} seed={60 + k} escala={ESC * (lejos ? 0.8 : k === 1 ? 1.1 : 0.98)} ruta={[{ f: T34 + k * 3, x: x0, y: VP + (lejos ? -60 : k === 1 ? 40 : 0) }, { f: 165, x: x1, y: VP + (lejos ? -60 : k === 1 ? 40 : 0), curva: "lineal" }]}
            dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: ["feliz", "picaro", "sorpresa", "feliz", "picaro", "risa"][k] }]} ajuste={(p, fr) => ({ ...p, ...QUIERE, hD: QUIERE.hD + 8 * Math.sin(fr / 4 + k), hI: QUIERE.hI + 8 * Math.sin(fr / 4 + k + 1.5) })}
            habla={[[T34 + 10 + k * 7, T34 + 40 + k * 7]]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} />;
        })}
        <A look={AMRAPALI} seed={12} ruta={[{ f: T34, x: V.portal, y: VP }, { f: T34 + 30, x: V.portal + 40, y: VP }, { f: 160, x: V.portal + 110, y: VP }]} dir={[{ f: 0, v: -1 }]}
          caras={[{ f: 0, v: "feliz" }, { f: T34 + 30, v: "duda" }]} ajuste={(p, fr) => (fr > T34 + 24 ? { ...p, hD: 100, cD: 35, tronco: -10, cabeza: -6 } : p)} />
      </>}
      hud={<>
        {f < T34 && <Multitud x={960} y={500} w={1500} h={600} desde={0} hasta={T34} n={600} modo="ola" dur={42} color="#d9c7a8" acento={ACENTO} rotulo="AMRAPALI" contador="MEN WHO KNEW HER NAME" />}
        {f >= T34 && <><Globo texto="Amrapali!" x={430} y={330} desde={T34 + 8} hasta={T34 + 60} cola="abajo" /><Globo texto="Amrapali…" x={820} y={260} desde={T34 + 22} hasta={T34 + 80} cola="abajo" /><Globo texto="Amrapali!!" x={1120} y={330} desde={T34 + 40} hasta={173} cola="abajo" />
          <Pildora texto="THE SAME THING" x={960} y={120} desde={k34(144.6)} color="#ffe2a6" /></>}
      </>} />
  );
};
// ---------- 35 · una fila de monjes con cuencos por su calle ----------
export const P35Monjes: React.FC = () => (
  <Vai cl={[mira(0, 900, 600, 1.2), mira(216, 1300, 600, 1.2, { curva: "inout" })]}
    medio={<>{[0, 1, 2, 3, 4].map((k) => (
      <A key={k} look={k === 0 ? MONJE_JOVEN : MONJE(k)} seed={70 + k} escala={ESC * (k === 0 ? 1 : 0.94 + (k % 2) * 0.05)} ruta={[{ f: 0, x: 600 - k * 200, y: VP }, { f: 216, x: 1500 - k * 200, y: VP, curva: "lineal" }]}
        caras={[{ f: 0, v: "neutral" }]} poses={[{ f: 0, v: k % 2 ? OFRECE : PARADO_CUENCO }]} enManoD={<Cuenco />} miradas={[{ f: 0, v: { x: 0.4, y: 0.5 } }]} />
    ))}</>}
    hud={<Pildora texto="SHAVED HEADS · ORANGE ROBES · BOWLS" x={960} y={120} desde={20} hasta={150} color="#ffe2a6" />} />
);
// ---------- 36 · el joven, tan calmo; ella lo para en su portón ----------
export const P36Joven: React.FC = () => (
  <Vai cl={[mira(0, V.portal - 330, 640, 2.2), mira(110, V.portal - 300, 640, 2.3, { curva: "inout" }), mira(111, V.portal - 130, 650, 1.6), mira(222, V.portal - 125, 650, 1.7)]}
    medio={<>
      <A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: V.portal - 420, y: VP }, { f: 160, x: V.portal - 220, y: VP }]} caras={[{ f: 0, v: "neutral" }, { f: 176, v: "sorpresa" }]} poses={[{ f: 0, v: PARADO_CUENCO }]} enManoD={<Cuenco />} miradas={[{ f: 0, v: { x: 0.5, y: 0.6 } }, { f: 170, v: { x: 0.9, y: 0 } }]} />
      <A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: V.portal + 120, y: VP }, { f: 150, x: V.portal + 120, y: VP }, { f: 175, x: V.portal - 50, y: VP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }, { f: 176, v: "picaro" }]} poses={[{ f: 0, v: "parado" }, { f: 176, v: { hD: 80, cD: 10 } }]} />
    </>}
    hud={<Pildora texto="BARELY TWENTY · SO CALM" x={960} y={120} desde={30} hasta={110} color="#ffe2a6" />} />
);
// ---------- 37 · «The rainy season is coming… stay here, in my house» ----------
const k37 = kDe(161.4);
export const P37Lluvias: React.FC = () => (
  <Vai cl={[mira(0, V.portal - 140, 620, 1.9), mira(213, V.portal - 140, 625, 2.1, { curva: "inout" })]}
    medio={<>
      <A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: V.portal - 220, y: VP }]} caras={[{ f: 0, v: "neutral" }]} poses={[{ f: 0, v: PARADO_CUENCO }]} enManoD={<Cuenco />} />
      <A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: V.portal - 50, y: VP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }, { f: 100, v: "picaro" }]} habla={[[0, 80], [90, 200]]}
        poses={[{ f: 0, v: { hD: 150, cD: 20, cabeza: -10 } }, { f: 60, v: { hD: 40, cD: 60 } }, { f: k37(166.2), v: { hD: 100, cD: 20, tronco: -6 } }]} miradas={[{ f: 0, v: { x: -0.4, y: -0.8 } }, { f: 60, v: { x: -0.9, y: 0 } }]} />
    </>}
    hud={<Calendario texto="RAINY SEASON · 4 MONTHS" x={1300} y={70} desde={k37(164.4)} acento="#4a7ab0" />} />
);
// ---------- 38 · toda la calle contiene el aliento: dos filas, se tapan la boca; la cámara empuja al monje ----------
export const P38Aliento: React.FC = () => (
  <Vai cl={[mira(0, 1450, 600, 1.05), mira(76, 1640, 640, 1.5, { curva: "inout" })]}
    medio={<>
      {[0, 1, 2, 3].map((k) => <A key={"a" + k} look={HOMBRE(k + 5)} seed={80 + k} escala={ESC * 0.75} ruta={[{ f: 0, x: 1050 + k * 140, y: VP - 70 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "sorpresa" }]} poses={[{ f: 0, v: k % 2 ? "manosCara" : "parado" }, { f: 14 + k * 6, v: "manosCara" }]} />)}
      {[0, 1, 2].map((k) => <A key={"b" + k} look={k === 1 ? ALDEANA : HOMBRE(k)} seed={60 + k} escala={ESC * 1.02} ruta={[{ f: 0, x: 980 + k * 190, y: VP + 30 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "sorpresa" }]} poses={[{ f: 0, v: "parado" }, { f: 8 + k * 7, v: "manosCara" }]} />)}
      <A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: V.portal - 220, y: VP }]} caras={[{ f: 0, v: "neutral" }]} enManoD={<Cuenco />} poses={[{ f: 0, v: PARADO_CUENCO }]} />
      <A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: V.portal - 50, y: VP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "picaro" }]} />
    </>} />
);
// ---------- 39 · se inclina: «I will ask my teacher» (monje en el tercio izquierdo) ----------
const k39 = kDe(171.04);
export const P39Reverencia: React.FC = () => (
  <Vai cl={[mira(0, V.portal - 90, 640, 2.0), mira(100, V.portal - 90, 640, 2.15, { curva: "inout" })]}
    medio={<>
      <A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: V.portal - 220, y: VP }]} caras={[{ f: 0, v: "neutral" }, { f: 50, v: "feliz" }]} poses={[{ f: 0, v: PARADO_CUENCO }, { f: 20, v: { tronco: 38, cabeza: 10, hD: 60, cD: 100, hI: 60, cI: 100 } }, { f: 46, v: PARADO_CUENCO }]} habla={[[k39(172.7), k39(174.4)]]} enManoD={<Cuenco />} />
      <A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: V.portal - 50, y: VP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }, { f: k39(173.2), v: "picaro" }]} poses={[{ f: 0, v: "parado" }, { f: k39(173.4), v: "manosCintura" }]} />
    </>} />
);
// ---------- 40 · vuelve a la arboleda: el Buda y 500 monjes esperan ----------
const k40 = kDe(174.4);
export const P40Arboleda: React.FC = () => (
  <Vai cl={[mira(0, 4900, 430, 0.72), mira(120, 5050, 600, 0.9, { curva: "inout" }), mira(230, 5230, 700, 1.4, { curva: "inout" }), mira(373, 5250, 705, 1.55)]}
    medio={<>
      <Buda miradas={[{ f: 0, v: { x: -0.8, y: 0.1 } }]} />
      <A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: 4300, y: VP }, { f: 200, x: V.buda - 300, y: VP }]} asiento={[{ f: 0, v: undefined }, { f: 215, v: 8 }]}
        poses={[{ f: 0, v: "parado" }, { f: 215, v: { ...LOTO, tronco: 20 } }]} habla={[[k40(181), k40(186.2)]]} caras={[{ f: 0, v: "neutral" }]} />
    </>}
    hud={<GranNumero rotulo="MONKS WAITING" claves={[{ f: 0, v: 0 }, { f: k40(175.6), v: 500, d: 40 }]} x={960} y={70} desde={k40(175.5)} hasta={k40(181)} color="#ffe2a6" tam={110} />} />
);
// ---------- 41 · los monjes cuchichean; unos se ríen, otros se enojan, uno codea al de al lado ----------
export const P41Murmullo: React.FC = () => (
  <Vai cl={[mira(0, 4700, 800, 1.6), mira(135, 4900, 800, 1.7, { curva: "inout" })]} sp={{ murmullo: 1 }}
    medio={<MonjesCara caras={["risa", "enojo", "picaro", "risa", "enojo"]} habla={[[[0, 60]], [[20, 100]], [[30, 90]], [[40, 130]], [[10, 90]]]} giran={10} poses={[{ hD: 40, cD: 120 }, { tronco: -8 }, { hI: 70, cI: 20, tronco: 10 }, { hD: 30, cD: 140 }, {}]} />}
    hud={<><Globo texto="?!" x={420} y={300} desde={10} hasta={80} tam={60} /><Globo texto="a courtesan?" x={900} y={250} desde={50} hasta={135} tam={56} /><Globo texto="ha!" x={1500} y={320} desde={70} hasta={135} tam={60} /></>} />
);
// ---------- 42 · ¿un monje en la casa de una cortesana? uno se para y señala: escándalo ----------
const k42 = kDe(191.38);
export const P42Escandalo: React.FC = () => (
  <Vai cl={[mira(0, 4650, 790, 1.9), mira(k42(194.8), 4700, 790, 2.0, { curva: "inout" }), mira(k42(194.8) + 1, 4900, 700, 1.4), mira(197, 4950, 700, 1.5)]} sp={{ murmullo: 0.8 }}
    medio={<>
      <MonjesCara caras={["enojo", "asco", "enojo", "duda", "enojo"]} habla={[[[0, 90]], [[60, 140]], [], [], [[120, 197]]]} />
      <A look={MONJE(1)} seed={29} ruta={[{ f: 0, x: 4980, y: VP + 30 }]} asiento={[{ f: 0, v: 8 }, { f: k42(194.4), v: undefined }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "enojo" }]}
        poses={[{ f: 0, v: LOTO }, { f: k42(194.6), v: "señalar" }]} habla={[[k42(194.8), k42(197.6)]]} />
    </>}
    hud={<><Globo texto="a monk… in HER house?" x={760} y={250} desde={k42(191.4)} hasta={k42(194.8)} tam={56} /><Pildora texto="SCANDAL" x={960} y={120} desde={k42(194.9)} color={ACENTO} tam={60} /></>} />
);
// ---------- 43 · el Buda lo mira mucho rato (el silencio corre): «Do you want to go?» ----------
const k43 = kDe(197.96);
export const P43Pregunta: React.FC = () => {
  const f = useF();
  return (
    <Vai cl={[mira(0, V.buda - 150, 700, 1.8), mira(150, V.buda - 150, 715, 2.2, { curva: "inout" }), mira(151, V.buda - 20, 740, 2.6), mira(200, V.buda - 20, 745, 2.75)]}
      medio={<>
        <Buda habla={[[k43(203.1), k43(204.4)]]} miradas={[{ f: 0, v: { x: -0.9, y: 0.1 } }]} />
        <A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: V.buda - 300, y: VP }]} asiento={[{ f: 0, v: 8 }]} poses={[{ f: 0, v: { ...LOTO, tronco: 10 } }, { f: 90, v: { ...LOTO, tronco: 14, cabeza: 14 } }]} caras={[{ f: 0, v: "neutral" }, { f: 80, v: "duda" }]} />
      </>}
      hud={f < k43(203.1) ? <Temporizador seg={f / 30} x={1640} y={70} desde={k43(199.5)} /> : null} />
  );
};
// ---------- 44 · «I will do what you say» · «Then go» (corte limpio de contraplano) ----------
const k44 = kDe(204.62);
export const P44Ve: React.FC = () => (
  <Vai cl={[mira(0, V.buda - 300, 740, 2.4), mira(80, V.buda - 300, 742, 2.5, { curva: "inout" }), mira(81, V.buda - 30, 750, 2.4), mira(119, V.buda - 30, 752, 2.55)]}
    medio={<>
      <Buda habla={[[k44(207.4), k44(208.4)]]} poses={[{ f: 0, v: LOTO }, { f: k44(207.3), v: LOTO_ENSENA }]} caras={[{ f: 0, v: "neutral" }, { f: k44(207.4), v: "feliz" }]} miradas={[{ f: 0, v: { x: -0.9, y: 0.1 } }]} />
      <A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: V.buda - 300, y: VP }]} asiento={[{ f: 0, v: 8 }]} poses={[{ f: 0, v: { ...LOTO, tronco: 22 } }]} habla={[[0, k44(207.4)]]} caras={[{ f: 0, v: "neutral" }]} />
    </>} />
);
// ---------- 45 · quinientos monjes no lo pueden creer: primera fila, sorpresa escalonada, uno se cae para atrás ----------
export const P45NoCreen: React.FC = () => (
  <Vai cl={[mira(0, 4630, 800, 2.1), mira(71, 4650, 800, 2.2, { curva: "inout" })]} sp={{ murmullo: 1 }}
    medio={<MonjesCara caras={["sorpresa", "miedo", "sorpresa", "sorpresa", "sorpresa"]} poses={[{ hD: 120, cD: 40, hI: 120, cI: 40 }, { tronco: -34, cabeza: -14, hD: 140, cD: 20 }, { hD: 60, cD: 150 }, { hI: 150, cI: 20 }, {}]} />}
    hud={<GranNumero rotulo="500 MONKS" claves={[{ f: 0, v: 500 }]} x={960} y={70} desde={4} color="#ffe2a6" tam={90} />} />
);
