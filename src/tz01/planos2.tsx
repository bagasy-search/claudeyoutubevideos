// tz01 · planos 29-45 (112,4 → 211 s): la parábola. Vaishali, Amrapali, los monjes, el Buda y los 500.
// Vuelta 2 (director): multitudes con función (pose/escala/profundidad/gesto distintos), componente por frase, cortes limpios.
// Vuelta 3 (director independiente): contraplanos / insertos / gráficos a pantalla completa en vez del mismo encuadre; el cuerpo hace lo que dice la voz; textos con placa.
import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { mira, useF } from "../anikit/camara";
import { Actor, ActorProps } from "../anikit/actor";
import { Calendario, Globo, Pildora, Temporizador } from "../anikit/pantalla";
import { Halo } from "../anikit/luz";
import { Multitud, ReaccionFx, conReaccion } from "../anikit/explica";
import { ACENTO, ALDEANA, ALDEANO, AMRAPALI, BUDA, ESC, LOTO, MONJE_JOVEN, ORO, REY } from "../tenzo/elenco";
import { Look } from "../anikit/personaje";
import { Rotulo } from "../tenzo/hud";
import { Cuenco, Elefante } from "../tenzo/utileria";
import { VAI_PISO, VAI_PUNTOS } from "../tenzo/sets/vaishali";
import { CEL_SENT, kDe, Lav, LAV_PUNTOS, SENTADO, Vai } from "./base";
import { Hud } from "./planos1";
import { Chispa, Collar, EspadaDe, Llamada, LlamadaMundo, Mango, Pensamiento, Rio, Salpica, lerp, usePantalla } from "./extras";
import { BudaPrimerTermino, CuatroMeses, HaloBuda, HumoCiudad, InsertoCuenco, NubesLluvia, PlacaContador, Revela } from "./extras_2";

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

// ---------- 29 · «2,500 years ago» → INSERTO: el farol en primer plano y su humo dorado dibuja la ciudad · «the old man says» → Tenzo de cerca, mano en alto ----------
const T29 = 50;
export const P29Cuenta: React.FC = () => {
  const f = useF();
  return (
    <>
      {f < T29 ? <HumoCiudad /> : (
        <Lav cl={[mira(T29, 1690, 690, 3.0), mira(79, 1695, 688, 3.15, { curva: "inout" })]} leo={{ no: true }} sp={{ luzFarol: 1.4 }} toalla={0.5}
          tenzo={{ habla: [[T29, 79]], caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: { x: -0.8, y: -0.4 } }], giros: [{ f: 0, v: -0.3 }],
            poses: [{ f: 0, v: { ...SENTADO, hD: 60, cD: 40, hI: 40, cI: 40, cabeza: -2 } }, { f: T29 + 4, v: { ...SENTADO, hD: 160, cD: 10, hI: 40, cI: 40, cabeza: -6 } }, { f: T29 + 18, v: { ...SENTADO, hD: 150, cD: 30, hI: 40, cI: 40, cabeza: -6 } }] }}
          hud={<Hud />} />
      )}
      <Calendario texto="2,500 YEARS AGO" x={1420} y={70} desde={4} acento={ORO} />
    </>
  );
};
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
// ---------- 30 · «a woman named Amrapali»: plano medio, se levanta y baila con giros; rótulo con su nombre al decirlo ----------
const k30 = kDe(121.5);
export const P30Amrapali: React.FC = () => (
  <Vai cl={[mira(0, V.pabellon, 630, 1.5), mira(110, V.pabellon + 10, 650, 1.9, { curva: "inout" })]} sp={{ noche: true }}
    medio={<>
      <A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: V.pabellon, y: VP - 40 }]} asiento={[{ f: 0, v: 40 }, { f: 20, v: undefined }]}
        dir={[{ f: 0, v: 1 }, { f: 44, v: -1 }, { f: 49, v: 1 }, { f: 78, v: -1 }, { f: 83, v: 1 }]}
        poses={[{ f: 0, v: { tronco: -4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 30, cD: 60, hI: 20, cI: 40 } }, { f: 24, v: "parado" }, { f: 34, v: { hD: 150, cD: 40, hI: 40, cI: 90, tronco: -6 } }, { f: 46, v: { hD: 160, cD: 20, hI: 160, cI: 20, pD: 20, rD: 40 } }, { f: 58, v: { hD: 40, cD: 90, hI: 150, cI: 40, tronco: 6 } }, { f: 80, v: { hD: 160, cD: 20, hI: 160, cI: 20, pI: -20, rI: 40 } }, { f: 92, v: { hD: 120, cD: 60, hI: 120, cI: 60 } }]}
        caras={[{ f: 0, v: "feliz" }, { f: 40, v: "risa" }, { f: 70, v: "picaro" }]} giros={[{ f: 0, v: 0.3 }, { f: 44, v: -0.5 }, { f: 60, v: 0.4 }, { f: 92, v: 0 }]} miradas={[{ f: 0, v: { x: 0.6, y: -0.2 } }, { f: 70, v: { x: 0, y: 0 } }]} />
      <Notas x={V.pabellon + 170} y={VP - 330} desde={8} />
      <Notas x={V.pabellon - 260} y={VP - 300} desde={30} />
    </>}
    hud={<Rotulo texto="AMRAPALI · VAISHALI" desde={k30(123.68)} />} />
);
// ---------- 31 · «the lantern flickers» → inserto del farol que titila, Leo levanta la vista · «and the laundromat disappears» → la llama se abre en un círculo y adentro está Vaishali ----------
const C31 = [mira(0, 1600, 700, 3.2), mira(14, 1600, 700, 3.25), mira(36, 1470, 690, 2.0, { curva: "inout" }), mira(73, 1520, 690, 2.1, { curva: "inout" })];
export const P31Titila: React.FC = () => {
  const f = useF();
  const p = usePantalla(C31, 1640, 700);
  const r = interpolate(f, [40, 70], [0, 2300], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  return (
    <>
      <Lav cl={C31} sp={{ luzFarol: f % 9 < 3 ? 0.35 : f % 13 < 2 ? 0.7 : 1.7 }} toalla={0.5}
        leo={{ miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }, { f: 20, v: { x: 0.9, y: -0.1 } }], caras: [{ f: 0, v: "cansado" }, { f: 22, v: "sorpresa" }], poses: [{ f: 0, v: CEL_SENT }, { f: 22, v: { ...CEL_SENT, hD: 20, cD: 60, cabeza: 0, tronco: -10 } }] }}
        tenzo={{ habla: [[0, 30]], caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }], poses: [{ f: 0, v: { ...SENTADO, hD: 60, cD: 40, hI: 40, cI: 40 } }] }}
        extra={<Halo x={LAV_PUNTOS.farol} y={700} r={lerp(f, 20, 60, 200, 900)} color={ORO} fuerza={lerp(f, 20, 60, 0.35, 0.9)} />} hud={<Hud />} />
      <Revela x={p.x} y={p.y} r={r}>
        <Vai cl={[mira(0, 760, 620, 1.15)]} medio={<Elefante x={230 + 3.6 * (f - 73)} piso={VP} dir={1} s={1.15} paso={f / 28} />} />
      </Revela>
      {r > 0 && r < 2200 && <AbsoluteFill style={{ pointerEvents: "none" }}><svg width={1920} height={1080}><circle cx={p.x} cy={p.y} r={r} fill="none" stroke={ORO} strokeWidth={40} opacity={0.55} style={{ filter: "blur(8px)" }} /></svg></AbsoluteFill>}
    </>
  );
};
// ---------- 31b · «hot wind, elephants in the street»: un elefante ENTERO cruza; un hombre distraído lo ve encima y salta para atrás; ella se ríe ----------
const k31 = kDe(127.6);
// rachas de viento caliente (MUNDO, capa de adelante)
const Viento: React.FC<{ f: number; desde: number }> = ({ f, desde }) => (
  <g opacity={lerp(f, desde, desde + 10, 0, 0.7)}>
    {[0, 1, 2, 3, 4, 5].map((k) => { const x = ((f * 26 + k * 420) % 2600) - 300; const y = 260 + k * 95; return <path key={k} d={`M${x},${y} q60,-24 120,0 t120,0 t120,0`} stroke="#fff4dc" strokeWidth={6} fill="none" strokeLinecap="round" />; })}
  </g>
);
export const P31Elefantes: React.FC = () => {
  const f = useF();
  const ex = 230 + 3.6 * f;
  const fv = k31(130.5); // lo ve
  return (
    <Vai cl={[mira(0, 760, 620, 1.15), mira(117, 860, 620, 1.2, { curva: "inout" })]} sp={{}}
      medio={<>
        <Elefante x={ex} piso={VP} dir={1} s={1.15} paso={f / 28} />
        <A {...conReaccion({ look: HOMBRE(3), seed: 41, escala: ESC * 1.05, ruta: [{ f: 0, x: 1120, y: VP + 20 }, { f: fv, x: 960, y: VP + 20, curva: "lineal" }, { f: fv + 8, x: 1060, y: VP - 50, curva: "out" }, { f: fv + 16, x: 1150, y: VP + 20, curva: "in" }],
          dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: { x: -0.4, y: -0.7 } }, { f: fv, v: { x: -1, y: 0 } }], poses: [{ f: 0, v: { hD: 140, cD: 130 } }, { f: fv + 18, v: "manosCara" }] }, "miedo", fv, 30)} />
        <A look={HOMBRE(2)} seed={40} escala={ESC * 0.95} ruta={[{ f: 0, x: 1330, y: VP - 30 }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "cansado" }, { f: fv + 6, v: "sorpresa" }]} poses={[{ f: 0, v: { hD: 150, cD: 140, cabeza: -6 } }, { f: fv + 6, v: "señalar" }]} />
        <A look={ALDEANA} seed={42} escala={ESC * 0.95} ruta={[{ f: 0, x: 1460, y: VP - 10 }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }, { f: fv + 10, v: "risa" }]} poses={[{ f: 0, v: "parado" }, { f: fv + 10, v: "manosCintura" }]} />
      </>}
      frente={<Viento f={f} desde={k31(129.7)} />}
      hud={<Pildora texto="HOT WIND · ELEPHANTS IN THE STREET" x={960} y={120} desde={k31(129.74)} color="#ffe2a6" />} />
  );
};
// ---------- 32 · el jardín de mangos: arranca un mango, lo huele; los hombres del portón se dan vuelta con un salto de sorpresa ----------
const k32 = kDe(131.5);
export const P32Mangos: React.FC = () => (
  <Vai cl={[mira(0, 2400, 520, 1.15), mira(70, 2480, 540, 1.22, { curva: "inout" }), mira(71, 2640, 640, 2.0), mira(160, 2660, 650, 2.15)]}
    medio={<>
      {[0, 1].map((k) => <A key={k} {...conReaccion({ look: HOMBRE(k + 1), seed: 45 + k, escala: ESC * 0.85, ruta: [{ f: 0, x: 2250 + k * 110, y: VP - 30 }], dir: [{ f: 0, v: -1 }, { f: k32(134.6) + k * 6, v: 1 }], caras: [{ f: 0, v: "neutral" }], poses: [{ f: 0, v: "parado" }] }, "sorpresa", k32(134.7) + k * 6, 70)} />)}
      {[0, 1].map((k) => <ReaccionFx key={"fx" + k} tipo="sorpresa" f0={k32(134.7) + k * 6} x={2250 + k * 110} y={590} />)}
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
      hud={<PlacaContador x={70} y={60} tam={50} lineas={[{ etiqueta: "RIVERS CROSSED", claves: [{ f: 0, v: 0 }, { f: 12, v: 7, d: 40 }], color: "#ffd27a" }, { etiqueta: "WARS", claves: [{ f: T33, v: 0 }, { f: T33 + 10, v: 1, d: 6 }, { f: T33 + 34, v: 2, d: 6 }], color: "#ff7a4a", desde: T33 }]} />} />
  );
};
// ---------- 34 · «every man in Vaishali knew her name»: la ola de su nombre recorre a todos los hombres de la ciudad (Multitud, ya abierta en el cuadro 0) → «and every man wanted the same thing»: la calle entera avanza hacia ella con los brazos estirados; ella retrocede ----------
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
        {f < T34 && <Multitud x={960} y={500} w={1500} h={600} desde={-18} hasta={T34} n={600} modo="ola" dur={50} color="#d9c7a8" acento={ACENTO} rotulo="AMRAPALI" contador="MEN WHO KNEW HER NAME" />}
        {f >= T34 && <><Globo texto="Amrapali!" x={430} y={330} desde={T34 + 8} hasta={T34 + 60} cola="abajo" /><Globo texto="Amrapali…" x={820} y={260} desde={T34 + 22} hasta={T34 + 80} cola="abajo" /><Globo texto="Amrapali!!" x={1120} y={330} desde={T34 + 40} hasta={173} cola="abajo" />
          <Pildora texto="THE SAME THING" x={960} y={120} desde={k34(144.6)} color="#ffe2a6" /></>}
      </>} />
  );
};
// ---------- 35 · «a group of monks walked through her street» (general: 5 monjes distintos, paso y escala propios; uno se frena en una puerta y una vecina le sirve) → «shaved heads, orange robes» (seguimiento en plano medio con llamadas) → «bowls in their hands» (INSERTO del cuenco que recibe arroz) ----------
const k35 = kDe(146.8);
const T35B = 90, T35C = k35(152.2);
// monjes del general: [look, x0, px/cuadro, escala, dy, pose]
const FILA35: [Look, number, number, number, number, Record<string, number>][] = [
  [MONJE(3), -340, 2.1, 0.86, -64, PARADO_CUENCO],
  [MONJE(1), 300, 0, 0.92, -36, PARADO_CUENCO],
  [MONJE_JOVEN, -60, 2.5, 1.0, 0, PARADO_CUENCO],
  [MONJE(2), 140, 2.8, 1.07, 26, { hD: 66, cD: 112, hI: 60, cI: 112, cabeza: 6 }],
  [MONJE(0), -540, 2.4, 0.97, 12, OFRECE],
];
export const P35Monjes: React.FC = () => {
  const f = useF();
  if (f >= T35C) return <InsertoCuenco desde={T35C} />;
  if (f >= T35B) {
    const B0 = 520, B1 = 700;
    const cl = [mira(T35B, B0, 650, 1.9), mira(T35C, B1, 650, 1.9, { curva: "inout" })];
    return (
      <Vai cl={cl}
        medio={<>
          <A look={MONJE_JOVEN} seed={72} escala={ESC * 0.95} ruta={[{ f: T35B, x: B0 - 230, y: VP - 20 }, { f: T35C, x: B1 - 230, y: VP - 20, curva: "inout" }]} caras={[{ f: 0, v: "neutral" }]} poses={[{ f: 0, v: PARADO_CUENCO }]} enManoD={<Cuenco />} miradas={[{ f: 0, v: { x: 0.6, y: 0.4 } }]} />
          <A look={MONJE(2)} seed={73} ruta={[{ f: T35B, x: B0, y: VP }, { f: T35C, x: B1, y: VP, curva: "inout" }]} caras={[{ f: 0, v: "neutral" }]} poses={[{ f: 0, v: PARADO_CUENCO }]} enManoD={<Cuenco />} miradas={[{ f: 0, v: { x: 0.8, y: 0.2 } }]} />
        </>}
        hud={<><Llamada px={985} py={505} lx={1400} ly={250} texto="SHAVED HEADS" desde={k35(149.88)} hasta={T35C} tam={46} />
          <Llamada px={990} py={830} lx={1420} ly={720} texto="ORANGE ROBES" desde={k35(151.08)} hasta={T35C} tam={46} /></>} />
    );
  }
  return (
    <Vai cl={[mira(0, 700, 600, 1.02), mira(T35B, 820, 600, 1.08, { curva: "inout" })]}
      medio={<>
        {FILA35.map(([look, x0, v, s, dy, pose], k) => {
          const quieto = v === 0;
          const ruta = quieto ? [{ f: 0, x: x0, y: VP + dy }, { f: 26, x: 500, y: VP + dy, curva: "out" as const }] : [{ f: 0, x: x0, y: VP + dy }, { f: T35B, x: x0 + v * T35B, y: VP + dy, curva: "lineal" as const }];
          return <A key={k} look={look} seed={70 + k} escala={ESC * s} ruta={ruta} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: quieto ? "feliz" : "neutral" }]}
            poses={quieto ? [{ f: 0, v: PARADO_CUENCO }, { f: 30, v: OFRECE }] : [{ f: 0, v: pose }]} enManoD={<Cuenco />} miradas={[{ f: 0, v: { x: 0.5, y: 0.4 } }]}
            ajuste={quieto ? undefined : (p, fr) => ({ ...p, cabeza: (p.cabeza ?? 0) + 3 * Math.sin(fr / 9 + k) })} />;
        })}
        <A look={ALDEANA} seed={77} escala={ESC * 0.92} ruta={[{ f: 0, x: 720, y: VP - 36 }, { f: 18, x: 660, y: VP - 36 }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }]}
          poses={[{ f: 0, v: "parado" }, { f: 30, v: { hD: 88, cD: 10, hI: 30, cI: 60 } }, { f: 44, v: { hD: 96, cD: 30, hI: 30, cI: 60 } }, { f: 58, v: { hD: 88, cD: 10, hI: 30, cI: 60 } }]} enManoD={<Cuenco s={0.8} />} />
      </>} />
  );
};
// ---------- 36 · «a young one, barely twenty, so calm» (seguimiento en plano medio, él solo) → «so quiet» (contraplano: ella en su portón lo ve venir) → «Amrapali stopped him at her gate» (plano de dos de perfil: ella le toca el cuenco y él se frena) ----------
const k36 = kDe(154.0);
const T36B = k36(157.9), T36C = k36(159.2), F36 = k36(159.92);
export const P36Joven: React.FC = () => {
  const f = useF();
  if (f < T36B) {
    const cl = [mira(0, 900, 660, 2.4), mira(T36B, 1100, 660, 2.4, { curva: "inout" })];
    return (
      <Vai cl={cl} medio={<A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: 900, y: VP }, { f: T36B, x: 1100, y: VP, curva: "inout" }]} caras={[{ f: 0, v: "neutral" }, { f: k36(156.9), v: "feliz" }]} poses={[{ f: 0, v: PARADO_CUENCO }]} enManoD={<Cuenco />} miradas={[{ f: 0, v: { x: 0.5, y: 0.6 } }]} />}
        hud={<><Pildora texto="BARELY TWENTY" x={960} y={120} desde={k36(155.6)} hasta={k36(156.8)} color="#ffe2a6" tam={50} /><Pildora texto="SO CALM" x={960} y={120} desde={k36(156.9)} color="#ffe2a6" tam={50} /></>} />
    );
  }
  if (f < T36C) {
    return (
      <Vai cl={[mira(T36B, V.portal + 60, 650, 2.0), mira(T36C, V.portal + 40, 650, 2.1, { curva: "inout" })]}
        medio={<>
          <A look={MONJE_JOVEN} seed={74} escala={ESC * 0.9} ruta={[{ f: T36B, x: 1500, y: VP - 30 }, { f: T36C, x: 1620, y: VP - 30, curva: "lineal" }]} caras={[{ f: 0, v: "neutral" }]} poses={[{ f: 0, v: PARADO_CUENCO }]} enManoD={<Cuenco />} />
          <A look={AMRAPALI} seed={12} escala={ESC * 1.05} ruta={[{ f: 0, x: V.portal + 130, y: VP + 20 }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "neutral" }, { f: T36B + 14, v: "picaro" }]}
            poses={[{ f: 0, v: { tronco: -8, hD: 30, cD: 140, hI: -20, cI: 30 } }, { f: T36B + 16, v: { tronco: 4, hD: 20, cD: 30, hI: -10, cI: 20 } }]} miradas={[{ f: 0, v: { x: -1, y: 0.1 } }]} giros={[{ f: 0, v: 0.2 }, { f: T36B + 16, v: -0.2 }]} />
        </>} />
    );
  }
  return (
    <Vai cl={[mira(T36C, V.portal - 160, 650, 1.95), mira(222, V.portal - 150, 655, 2.05, { curva: "inout" })]}
      medio={<>
        <A look={MONJE_JOVEN} seed={74} ruta={[{ f: T36C, x: 1640, y: VP }, { f: F36, x: 1690, y: VP, curva: "out" }]} caras={[{ f: 0, v: "neutral" }, { f: F36 + 2, v: "sorpresa" }]}
          poses={[{ f: 0, v: PARADO_CUENCO }, { f: F36 + 2, v: { ...PARADO_CUENCO, tronco: -8, cabeza: -6 } }]} enManoD={<Cuenco />} miradas={[{ f: 0, v: { x: 0.5, y: 0.6 } }, { f: F36, v: { x: 1, y: 0 } }]} />
        <A look={AMRAPALI} seed={12} ruta={[{ f: T36C, x: V.portal - 20, y: VP }, { f: F36 - 2, x: V.portal - 55, y: VP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }, { f: F36, v: "picaro" }]}
          poses={[{ f: 0, v: "parado" }, { f: F36 - 6, v: { hD: 58, cD: 18, tronco: 8 } }]} />
        <ReaccionFx tipo="sorpresa" f0={F36} x={1700} y={630} />
      </>} />
  );
};
// ---------- 37 · «The rainy season is coming» (contrapicado: ella señala el cielo y entran nubes negras) → «monks stay in one place for four months» (gráfico: 4 hojas del monzón) → «stay here, in my house» (ya llueve: ella lo invita y señala su portón) ----------
const k37 = kDe(161.4);
const T37B = k37(163.95), T37C = k37(166.3);
export const P37Lluvias: React.FC = () => {
  const f = useF();
  const cl = f < T37C ? [mira(0, V.portal - 140, 500, 1.45), mira(T37B, V.portal - 140, 520, 1.6, { curva: "inout" })] : [mira(T37C, V.portal - 110, 640, 2.15), mira(213, V.portal - 105, 645, 2.3, { curva: "inout" })];
  return (
    <>
      <Vai cl={cl} sp={{ lluvia: f >= T37B }}
        medio={<>
          {f < T37C && <NubesLluvia desde={k37(162.0)} x0={1350} x1={2250} y0={170} llueve={44} />}
          <A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: V.portal - 220, y: VP }]} caras={[{ f: 0, v: "neutral" }, { f: 40, v: "duda" }]} poses={[{ f: 0, v: PARADO_CUENCO }]} enManoD={<Cuenco />}
            miradas={[{ f: 0, v: { x: 0.9, y: 0 } }, { f: 26, v: { x: 0.4, y: -0.9 } }, { f: T37C, v: { x: 0.9, y: 0 } }]} />
          <A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: V.portal - 50, y: VP }]} dir={[{ f: 0, v: -1 }, { f: k37(167.3), v: 1 }, { f: k37(168.1), v: -1 }]} caras={[{ f: 0, v: "feliz" }, { f: T37C, v: "picaro" }]} habla={[[0, 60], [T37C + 4, 213]]}
            poses={[{ f: 0, v: "parado" }, { f: 12, v: { hD: 165, cD: 8, cabeza: -14 } }, { f: T37C, v: { hD: 70, cD: 20, hI: 60, cI: 30 } }, { f: k37(167.3), v: { hD: 110, cD: 5, tronco: -4 } }, { f: k37(168.1), v: { hD: 60, cD: 120 } }]}
            miradas={[{ f: 0, v: { x: -0.4, y: -0.9 } }, { f: T37C, v: { x: -0.9, y: 0 } }]} />
        </>}
        hud={f >= T37C ? <Pildora texto="STAY HERE · IN MY HOUSE" x={960} y={120} desde={T37C + 6} color="#ffe2a6" tam={46} /> : null} />
      <CuatroMeses desde={T37B} hasta={T37C} />
    </>
  );
};
// ---------- 38 · toda la calle contiene el aliento: la gente en primer término (de costado), uno le tira de la manga al otro; atrás se tapan la boca ----------
export const P38Aliento: React.FC = () => (
  <Vai cl={[mira(0, 1540, 640, 1.3), mira(76, 1620, 650, 1.48, { curva: "inout" })]}
    medio={<>
      {[0, 1, 2, 3].map((k) => <A key={"a" + k} look={HOMBRE(k + 5)} seed={80 + k} escala={ESC * 0.72} ruta={[{ f: 0, x: 1180 + k * 120, y: VP - 80 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "sorpresa" }]} poses={[{ f: 0, v: "parado" }, { f: 10 + k * 8, v: "manosCara" }]} />)}
      <A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: V.portal - 220, y: VP }]} caras={[{ f: 0, v: "neutral" }]} enManoD={<Cuenco />} poses={[{ f: 0, v: PARADO_CUENCO }]} />
      <A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: V.portal - 50, y: VP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "picaro" }]} />
      {/* primer término: tres de costado mirando a la pareja */}
      <A look={ALDEANA} seed={86} escala={ESC * 1.35} ruta={[{ f: 0, x: 960, y: VP + 150 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "sorpresa" }]} poses={[{ f: 0, v: "parado" }, { f: 8, v: "manosCara" }]} />
      <A look={HOMBRE(1)} seed={87} escala={ESC * 1.35} ruta={[{ f: 0, x: 1340, y: VP + 160 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "sorpresa" }, { f: 30, v: "duda" }]} giros={[{ f: 0, v: 0 }, { f: 30, v: -0.8 }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: 30, v: { x: -1, y: 0.2 } }]} poses={[{ f: 0, v: "parado" }, { f: 30, v: { hD: 30, cD: 140, hI: 20, cI: 30 } }]} />
      <A look={HOMBRE(4)} seed={88} escala={ESC * 1.3} ruta={[{ f: 0, x: 1170, y: VP + 140 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "sorpresa" }, { f: 20, v: "miedo" }]} habla={[[20, 50]]}
        poses={[{ f: 0, v: "parado" }, { f: 18, v: { hD: 84, cD: 6, tronco: 8 } }, { f: 30, v: { hD: 78, cD: 20, tronco: 10 } }, { f: 40, v: { hD: 86, cD: 4, tronco: 8 } }]} />
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
// el Buda con halo (sólo en planos2; el <Buda> exportado queda igual para planos3)
const CAB_BUDA = { x: V.buda, y: 734 };
const BudaH: React.FC<Partial<ActorProps> & { brillo?: number }> = ({ brillo = 1, ...o }) => <><HaloBuda x={CAB_BUDA.x} y={CAB_BUDA.y} r={105} fuerza={brillo} /><Buda {...o} /></>;
const MANOS_JUNTAS = { hD: 38, cD: 100, hI: 34, cI: 100 };
// gesto al hablar (alterna dos poses cada `p` cuadros)
const gesticula = (desde: number, hasta: number, a: Record<string, number>, b: Record<string, number>, p = 16) => {
  const o: { f: number; v: Record<string, number> }[] = [];
  for (let g = desde, i = 0; g < hasta; g += p, i++) o.push({ f: g, v: i % 2 ? b : a });
  return o;
};
// la casa de Amrapali bajo la lluvia (dibujo para el globo de pensamiento, coords 0..w × 0..h)
const CasaLluvia: React.FC<{ w: number; h: number; f: number }> = ({ w, h, f }) => (
  <g>
    <rect x={0} y={0} width={w} height={h} fill="#c9b8a0" />
    <path d={`M${w * 0.3},${h} L${w * 0.3},${h * 0.42} Q${w * 0.5},${h * 0.12} ${w * 0.7},${h * 0.42} L${w * 0.7},${h} Z`} fill="#e8b84a" stroke="#6a4a2a" strokeWidth={6} />
    <rect x={w * 0.42} y={h * 0.6} width={w * 0.16} height={h * 0.4} rx={18} fill="#8a3a2a" />
    <circle cx={w * 0.5} cy={h * 0.5} r={16} fill="#b8323a" />
    {Array.from({ length: 22 }).map((_, k) => { const t = ((f * 1.4 + k * 9) % 30) / 30; return <line key={k} x1={(k * 37) % w} y1={t * h - 20} x2={((k * 37) % w) - 6} y2={t * h + 10} stroke="#4a6a9a" strokeWidth={5} strokeLinecap="round" />; })}
  </g>
);
// ---------- 40 · «he walked back to the grove» (seguimiento) → «where the Buddha was sitting» (Buda plano medio con halo) → «five hundred monks were waiting» (contraplano de los 500, contador) → «he said, Master…» (plano de dos de perfil y primer plano del monje que gesticula; globo con la casa bajo la lluvia) ----------
const k40 = kDe(174.4);
const T40B = k40(175.85), T40C = k40(177.3), T40D = k40(180.4), T40E = k40(182.9);
export const P40Arboleda: React.FC = () => {
  const f = useF();
  if (f < T40B) {
    return <Vai cl={[mira(0, 4300, 660, 1.9), mira(T40B, 4430, 660, 1.9, { curva: "inout" })]}
      medio={<A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: 4300, y: VP }, { f: T40B, x: 4430, y: VP, curva: "inout" }]} caras={[{ f: 0, v: "duda" }]} poses={[{ f: 0, v: PARADO_CUENCO }]} enManoD={<Cuenco />} miradas={[{ f: 0, v: { x: 1, y: 0.1 } }]} />} />;
  }
  if (f < T40C) {
    return <Vai cl={[mira(T40B, V.buda - 10, 740, 2.5), mira(T40C, V.buda - 10, 742, 2.65, { curva: "inout" })]}
      medio={<BudaH caras={[{ f: 0, v: "neutral" }, { f: T40B + 14, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0, y: 0.5 } }, { f: T40B + 18, v: { x: -0.9, y: 0 } }]} giros={[{ f: 0, v: 0.3 }, { f: T40B + 18, v: -0.3 }]} />} />;
  }
  if (f < T40D) {
    return <Vai cl={[mira(T40C, 5050, 790, 1.3), mira(T40D, 5180, 795, 1.38, { curva: "inout" })]} sp={{ murmullo: 0.3 }}
      medio={<>
        <BudaH miradas={[{ f: 0, v: { x: -0.9, y: 0.1 } }]} />
        <A look={MONJE_JOVEN} seed={74} ruta={[{ f: T40C, x: 4620, y: VP }, { f: T40D, x: 4980, y: VP, curva: "lineal" }]} caras={[{ f: 0, v: "duda" }]} poses={[{ f: 0, v: PARADO_CUENCO }]} enManoD={<Cuenco />} />
        <MonjesCara caras={["neutral", "duda", "neutral", "duda", "neutral"]} giran={T40C + 20} />
      </>}
      hud={<PlacaContador x={960 - 230} y={56} tam={56} desde={T40C + 2} lineas={[{ etiqueta: "MONKS WAITING", claves: [{ f: 0, v: 0 }, { f: T40C + 4, v: 500, d: 36 }], color: "#ffc46a" }]} />} />;
  }
  const clD = f < T40E ? [mira(T40D, V.buda - 160, 730, 1.85), mira(T40E, V.buda - 165, 732, 1.95, { curva: "inout" })] : [mira(T40E, V.buda - 300, 730, 2.7), mira(373, V.buda - 300, 728, 2.85, { curva: "inout" })];
  return (
    <Vai cl={clD}
      medio={<>
        {f < T40E && <BudaH miradas={[{ f: 0, v: { x: -0.9, y: 0.1 } }]} caras={[{ f: 0, v: "neutral" }]} />}
        <A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: V.buda - 300, y: VP }]} asiento={[{ f: 0, v: 8 }]} caras={[{ f: 0, v: "duda" }, { f: k40(182.98), v: "neutral" }]}
          poses={[{ f: 0, v: { ...LOTO, tronco: 18, ...MANOS_JUNTAS } }, ...gesticula(k40(181.6), k40(186.0), { ...LOTO, tronco: 14, hD: 72, cD: 40, hI: 40, cI: 70 }, { ...LOTO, tronco: 10, hD: 96, cD: 20, hI: 60, cI: 50 }), { f: k40(186.1), v: { ...LOTO, tronco: 20, ...MANOS_JUNTAS } }]}
          habla={[[k40(180.46), k40(180.9)], [k40(181.6), k40(186.0)]]} miradas={[{ f: 0, v: { x: 0.9, y: -0.1 } }]} />
      </>}
      hud={<>
        <Globo texto="Master…" x={1240} y={300} desde={k40(181.5)} hasta={T40E} cola="izq" tam={56} />
        <PensamientoCasa desde={T40E + 4} />
      </>} />
  );
};
const PensamientoCasa: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useF();
  return <Pensamiento x={1380} y={290} w={520} h={300} desde={desde} cola={{ x: 1060, y: 470 }} fondo="#f4efe6"><CasaLluvia w={520} h={300} f={f} /></Pensamiento>;
};
// ---------- 41 · los monjes cuchichean; unos se ríen, otros se enojan, uno codea al de al lado ----------
export const P41Murmullo: React.FC = () => (
  <Vai cl={[mira(0, 4700, 800, 1.6), mira(135, 4900, 800, 1.7, { curva: "inout" })]} sp={{ murmullo: 1 }}
    medio={<MonjesCara caras={["risa", "enojo", "picaro", "risa", "enojo"]} habla={[[[0, 60]], [[20, 100]], [[30, 90]], [[40, 130]], [[10, 90]]]} giran={10} poses={[{ hD: 40, cD: 120 }, { tronco: -8 }, { hI: 70, cI: 20, tronco: 10 }, { hD: 30, cD: 140 }, {}]} />}
    hud={<><Globo texto="?!" x={420} y={300} desde={10} hasta={80} tam={60} /><Globo texto="a courtesan?" x={900} y={250} desde={50} hasta={135} tam={56} /><Globo texto="ha!" x={1500} y={320} desde={70} hasta={135} tam={60} /></>} />
);
// ---------- 42 · «a monk, in the house of a courtesan, for four months?» (primer plano de dos que cuchichean, globos) → «it was a scandal» (uno se para y señala) → «it was the end of him» (primer plano del joven, cabeza gacha) ----------
const k42 = kDe(191.38);
const T42B = k42(194.8), T42C = k42(196.2);
export const P42Escandalo: React.FC = () => {
  const f = useF();
  if (f < T42B) {
    return (
      <Vai cl={[mira(0, 4705, 770, 2.6), mira(T42B, 4712, 772, 2.72, { curva: "inout" })]} sp={{ murmullo: 0.8 }}
        medio={<MonjesCara caras={["enojo", "asco", "enojo", "duda", "enojo"]} habla={[[], [[0, 60], [k42(193.5), k42(194.3)]], [[60, 100]], [], []]} giran={4} poses={[{}, { hD: 60, cD: 130, tronco: 10 }, { tronco: -6, hI: 40, cI: 120 }, {}, {}]} />}
        hud={<><Globo texto="a monk… in HER house?" x={560} y={230} desde={2} hasta={k42(193.4)} tam={58} cola="abajo" /><Globo texto="for FOUR months?!" x={1180} y={230} desde={k42(193.5)} hasta={T42B} tam={58} cola="abajo" /></>} />
    );
  }
  if (f < T42C) {
    return (
      <Vai cl={[mira(T42B, 4900, 700, 1.4), mira(T42C, 4950, 700, 1.48, { curva: "inout" })]} sp={{ murmullo: 0.8 }}
        medio={<>
          <MonjesCara caras={["enojo", "asco", "enojo", "duda", "enojo"]} habla={[[[T42B, T42C]], [], [], [], [[T42B + 10, T42C]]]} />
          <A look={MONJE(1)} seed={29} ruta={[{ f: 0, x: 4980, y: VP + 30 }]} asiento={[{ f: 0, v: 8 }, { f: T42B + 2, v: undefined }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "enojo" }]}
            poses={[{ f: 0, v: LOTO }, { f: T42B + 4, v: "señalar" }]} habla={[[T42B + 4, T42C]]} />
        </>}
        hud={<Pildora texto="SCANDAL" x={960} y={120} desde={T42B + 2} color={ACENTO} tam={64} />} />
    );
  }
  return (
    <Vai cl={[mira(T42C, V.buda - 300, 740, 3.0), mira(198, V.buda - 300, 742, 3.2, { curva: "inout" })]}
      medio={<A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: V.buda - 300, y: VP }]} asiento={[{ f: 0, v: 8 }]} caras={[{ f: 0, v: "duda" }, { f: T42C + 10, v: "triste" }]}
        poses={[{ f: 0, v: { ...LOTO, tronco: 14, ...MANOS_JUNTAS } }, { f: T42C + 8, v: { ...LOTO, tronco: 22, cabeza: 18, ...MANOS_JUNTAS } }]} miradas={[{ f: 0, v: { x: 0.4, y: 0.3 } }, { f: T42C + 8, v: { x: 0.2, y: 0.9 } }]} />}
      hud={<Pildora texto="THE END OF HIM" x={960} y={120} desde={T42C + 4} color={ACENTO} tam={56} />} />
  );
};
// ---------- 43 · «the Buddha looked at the young monk» (primer plano del Buda con halo) → «for a long time» (contraplano: el monje transpira, el silencio corre en un reloj grande) → «Do you want to go?» (general de perfil con monjes en primer término) ----------
const k43 = kDe(197.96);
const T43B = k43(199.6), T43C = k43(202.9);
export const P43Pregunta: React.FC = () => {
  const f = useF();
  if (f < T43B) {
    return <Vai cl={[mira(0, V.buda - 20, 725, 3.1), mira(T43B, V.buda - 20, 727, 3.3, { curva: "inout" })]}
      medio={<BudaH caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: { x: -0.5, y: 0.2 } }, { f: 16, v: { x: -1, y: 0.15 } }]} giros={[{ f: 0, v: 0.1 }, { f: 16, v: -0.35 }]} />} />;
  }
  if (f < T43C) {
    return <Vai cl={[mira(T43B, V.buda - 290, 745, 3.0), mira(T43C, V.buda - 290, 747, 3.2, { curva: "inout" })]}
      medio={<A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: V.buda - 300, y: VP }]} asiento={[{ f: 0, v: 8 }]} caras={[{ f: 0, v: "duda" }, { f: T43B + 50, v: "miedo" }]}
        poses={[{ f: 0, v: { ...LOTO, tronco: 12, ...MANOS_JUNTAS } }, { f: T43B + 30, v: { ...LOTO, tronco: 16, cabeza: 10, ...MANOS_JUNTAS } }, { f: T43B + 70, v: { ...LOTO, tronco: 10, cabeza: -2, ...MANOS_JUNTAS } }]}
        miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: T43B + 28, v: { x: 0.3, y: 0.8 } }, { f: T43B + 70, v: { x: 1, y: -0.1 } }]} />}
      hud={<Temporizador seg={(f - T43B) / 30 * 2.6} x={1460} y={70} tam={64} desde={T43B} />} />;
  }
  return <Vai cl={[mira(T43C, V.buda - 150, 780, 1.6), mira(200, V.buda - 150, 784, 1.72, { curva: "inout" })]}
    medio={<>
      <BudaH habla={[[k43(203.1), k43(204.0)]]} poses={[{ f: 0, v: LOTO }, { f: k43(203.1), v: { ...LOTO, tronco: 8, hD: 60, cD: 60 } }]} miradas={[{ f: 0, v: { x: -0.9, y: 0.1 } }]} />
      <A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: V.buda - 300, y: VP }]} asiento={[{ f: 0, v: 8 }]} poses={[{ f: 0, v: { ...LOTO, tronco: 10, ...MANOS_JUNTAS } }]} caras={[{ f: 0, v: "duda" }, { f: k43(203.8), v: "sorpresa" }]} />
    </>}
    hud={<Globo texto="Do you want to go?" x={1180} y={250} desde={k43(203.1)} hasta={200} tam={60} cola="abajo" />} />;
};
// ---------- 44 · «I will do what you say» (contraplano por encima del hombro del Buda: el monje se inclina con las manos juntas) → «Then go» (el Buda de frente levanta la palma: permiso; el halo se enciende) ----------
const k44 = kDe(204.62);
const T44B = k44(207.3);
export const P44Ve: React.FC = () => {
  const f = useF();
  if (f < T44B) {
    return (
      <>
        <Vai cl={[mira(0, V.buda - 330, 745, 2.25), mira(T44B, V.buda - 322, 747, 2.4, { curva: "inout" })]}
          medio={<A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: V.buda - 300, y: VP }]} asiento={[{ f: 0, v: 8 }]} habla={[[0, k44(205.5)]]} caras={[{ f: 0, v: "neutral" }, { f: k44(205.6), v: "feliz" }]}
            poses={[{ f: 0, v: { ...LOTO, tronco: 14, ...MANOS_JUNTAS } }, { f: 8, v: { ...LOTO, tronco: 42, cabeza: 16, ...MANOS_JUNTAS } }, { f: 44, v: { ...LOTO, tronco: 18, ...MANOS_JUNTAS } }]}
            miradas={[{ f: 0, v: { x: 1, y: -0.1 } }, { f: 8, v: { x: 0.3, y: 0.9 } }, { f: 44, v: { x: 1, y: -0.2 } }]} />} />
        <BudaPrimerTermino x={1700} y={500} r={240} />
      </>
    );
  }
  return (
    <Vai cl={[mira(T44B, V.buda + 10, 715, 2.7), mira(119, V.buda + 10, 713, 2.85, { curva: "inout" })]}
      medio={<BudaH brillo={lerp(f, T44B, T44B + 20, 1, 1.6)} habla={[[k44(207.42), k44(207.95)]]} caras={[{ f: 0, v: "neutral" }, { f: k44(207.4), v: "feliz" }]}
        poses={[{ f: 0, v: LOTO }, { f: T44B + 4, v: { ...LOTO, hD: 135, cD: 35 } }]} miradas={[{ f: 0, v: { x: -0.9, y: 0.1 } }]} giros={[{ f: 0, v: -0.3 }, { f: T44B + 10, v: -0.1 }]} />}
      hud={<Globo texto="Then go." x={760} y={260} desde={k44(207.45)} hasta={119} tam={64} cola="der" />} />
  );
};
// ---------- 45 · quinientos monjes no lo pueden creer: primera fila, sorpresa a destiempo (salto, bocas abiertas), uno se cae para atrás ----------
const PIERNAS_LOTO = { pI: LOTO.pI, rI: LOTO.rI, pD: LOTO.pD, rD: LOTO.rD };
const F45 = [3, 14, 8, 22, 30];
export const P45NoCreen: React.FC = () => (
  <Vai cl={[mira(0, 4700, 820, 1.9), mira(71, 4730, 818, 2.05, { curva: "inout" })]} sp={{ murmullo: 1 }}
    medio={<>{[0, 1, 2, 3, 4].map((k) => {
      const x = V.monjes - 420 + k * 150 + (k > 2 ? 820 : 0);
      const cae = k === 1;
      const base: ActorProps = { look: MONJE(k), seed: 20 + k, escala: ESC * 0.92, ruta: [{ f: 0, x, y: VP + 60 }], asiento: [{ f: 0, v: 8 }], dir: [{ f: 0, v: k > 2 ? -1 : 1 }],
        poses: [{ f: 0, v: LOTO }, ...(cae ? [{ f: F45[k] + 28, v: { ...LOTO, tronco: -38, cabeza: -16, hD: 150, cD: 20, hI: 140, cI: 30 } }] : [])], caras: [{ f: 0, v: "neutral" }],
        habla: [[F45[k] + 4, F45[k] + 22]], ajuste: (p) => ({ ...p, ...PIERNAS_LOTO }) };
      return <A key={k} {...conReaccion(base, cae ? "miedo" : "sorpresa", F45[k], cae ? 24 : 60)} />;
    })}
      {[0, 2, 3].map((k) => <ReaccionFx key={"fx" + k} tipo="sorpresa" f0={F45[k]} x={V.monjes - 420 + k * 150 + (k > 2 ? 820 : 0)} y={650} />)}
    </>}
    hud={<><Globo texto="WHAT?!" x={600} y={250} desde={6} hasta={70} tam={64} cola="abajo" /><Globo texto="HER house?!" x={1300} y={280} desde={24} hasta={72} tam={56} cola="abajo" /></>} />
);
