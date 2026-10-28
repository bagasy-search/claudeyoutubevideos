// tz02 · planos 1-42 (0 → 198 s): el cuadro 0, día 2 en el lavadero, la mandarina, «one night», el palacio de Siddhartha, la entrega del tel.
// v2 (26-oct): cada plano con ACCIÓN de cuerpo entero + un componente que lleva la frase (ver D:/rtmp/tenzo/ojo/v1/director_tz02.md).
import React from "react";
import { AbsoluteFill, interpolate, random, useVideoConfig } from "remotion";
import { Clave, enPantalla, mira, useF } from "../anikit/camara";
import { Contador, F_HUD, GranNumero, Pildora, TextoMano } from "../anikit/pantalla";
import { ALDEANA, ALDEANO, ASITA, ESC, FAROL, LEO, LEO_CAPUCHA, MARA, REY, SIDDHARTHA, TENZO, VIEJO, PAL } from "../tenzo/elenco";
import { ManoLeo, Rotulo } from "../tenzo/hud";
import { BolsoRopa, Elefante, FarolMano, Mandarina, Tel } from "../tenzo/utileria";
import { TelGrande } from "../tenzo/graficos";
import { Escena } from "../anikit/escena";
import { Comparacion, LineaTiempo, Mapa, Velo, conReaccion, ReaccionFx } from "../anikit/explica";
import { Broadway } from "../tenzo/sets/broadway";
import { CEL_SENT, DOBLA_A, kDe, Lav, LAV_PUNTOS, LP, rimFrio, rimOro, SENTADO } from "../tz01/base";
import { Fondo, fade } from "../tz01/planos1";
import { A, Hud2, K, Kap, KP, PRINCESA } from "./base";
import {
  Bandeja, BebeVivo, Burbuja, cl, Divan, Etiqueta, FlorMarchita, FlorMuertaMano, Guirnalda, GuirnaldaColgante, Hielo, Icono, Lagrimas, lerp, Lienzo,
  ManoGrande, MiniPalacio, Notas, osc01, Petalos, BebeAlzado, Recto, Sitar, suave, Tambor, TarjetaIcono, TelMarco, TelSvg, Trazo, TxtSvg, Uva, Uvas,
} from "./extras";
import { InsertoMandarina, InsertoPalma, PalacioAFeed, Placa, Sacude, TrenFrente, Desarma } from "./extras_a";

const L = LAV_PUNTOS;
const MIRA_T = { x: 0.9, y: 0 }, MIRA_L = { x: -0.9, y: 0 };
const PELA = { ...DOBLA_A, hD: 50, cD: 110, hI: 45, cI: 100, cabeza: 18 }; // pela la mandarina frente al pecho
const OFRECE = { ...SENTADO, hD: 85, cD: 5, hI: 20, cI: 40, tronco: 4, cabeza: 2 }; // tiende la mano abierta
const AFERRA = { ...CEL_SENT, hD: 40, cD: 130, hI: 40, cI: 120, cabeza: 4, tronco: -6 }; // abraza el tel contra el pecho
const AFERRA2 = { ...AFERRA, hD: 50, cD: 145, hI: 50, cI: 140, tronco: -12, cabeza: 8 }; // lo aprieta más
const tenzoPela = (o = {}) => ({ poses: [{ f: 0, v: PELA }], enManoD: (fr: number) => <Mandarina pelada={Math.min(1, 0.3 + fr / 400)} s={1.2} />, caras: [{ f: 0, v: "feliz" }], ...o });
const leoSent = (o = {}) => ({ poses: [{ f: 0, v: { ...CEL_SENT, cabeza: 0 } }], miradas: [{ f: 0, v: MIRA_T }], caras: [{ f: 0, v: "neutral" }], ...o });
// keyframes que alternan dos poses cada `per` cuadros (tocar, aplaudir, barrer)
export const ciclo = (a: object, b: object, per: number, hasta: number, desde = 0) => {
  const out: { f: number; v: object }[] = [{ f: 0, v: a }];
  for (let f = desde; f < hasta; f += per) out.push({ f, v: b }, { f: f + per / 2, v: a });
  return out;
};
// dónde poner en la capa de FRENTE (z 1,4) algo que tiene que caer en (sx, sy) de pantalla con la cámara c
export const aFrente = (c: Clave, sx: number, sy: number) => { const Z = 1 + (c.zoom - 1) * 1.4; return { x: 960 + (sx - 960 + 1.4 * c.x) / Z, y: 540 + (sy - 540 + 1.4 * c.y) / Z }; };
// hombro en primer término (plano por encima del hombro): silueta oscura desenfocada con borde de luz, en pantalla
export const Silueta: React.FC<{ lado: "izq" | "der"; pelo?: "puntas" | "calvo"; borde: string }> = ({ lado, pelo = "puntas", borde }) => {
  const sx = lado === "izq" ? 1 : -1, x0 = lado === "izq" ? 0 : 1920;
  const T = (x: number) => x0 + sx * x;
  const cuerpo = `M${T(-40)},1080 L${T(-40)},860 Q${T(120)},760 ${T(330)},800 Q${T(520)},840 ${T(600)},1080 Z`;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, filter: "blur(7px)" }}>
      <path d={cuerpo} fill="#121117" stroke={borde} strokeWidth={10} strokeOpacity={0.55} />
      <ellipse cx={T(250)} cy={690} rx={170} ry={185} fill="#121117" stroke={borde} strokeWidth={10} strokeOpacity={0.55} />
      {pelo === "puntas" && <path d={`M${T(90)},640 L${T(120)},470 L${T(190)},560 L${T(250)},450 L${T(300)},555 L${T(380)},480 L${T(400)},640 Z`} fill="#121117" />}
    </svg>
  );
};
const HombroLeo: React.FC<{ c?: Clave }> = () => <Silueta lado="izq" borde="#8fb4ff" />;
const HombroTenzo: React.FC<{ c?: Clave }> = () => <Silueta lado="der" pelo="calvo" borde="#ffc46a" />;
// ---------- 1 · CUADRO 0 = la miniatura sin texto: Tenzo tiende la mano, Leo aferrado al tel, Mara detrás ----------
export const Q01Mini: React.FC = () => (
  <Lav cl={[mira(0, 1430, 560, 1.38), mira(8, 1430, 560, 1.38), mira(60, 1440, 640, 1.85, { curva: "inout" })]} toalla={-1} sp={{ farol: false }}
    tenzo={{ ruta: [{ f: 0, x: 1230, y: LP }], dir: [{ f: 0, v: 1 }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: { hD: 82, cD: 4, hI: 30, cI: 40, tronco: 6 } }],
      enManoI: <FarolMano luz={1.4} />, caras: [{ f: 0, v: "feliz" }, { f: 30, v: "risa" }], miradas: [{ f: 0, v: { x: 0.8, y: 0.1 } }, { f: 28, v: { x: 0.7, y: -0.5 } }], giros: [{ f: 0, v: 0 }, { f: 30, v: 0.3 }] }}
    leo={{ ruta: [{ f: 0, x: 1600, y: LP }], dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: AFERRA }, { f: 30, v: AFERRA }, { f: 45, v: { ...AFERRA2, tronco: -16, cabeza: 12 } }], caras: [{ f: 0, v: "miedo" }],
      miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: 34, v: { x: 0.5, y: 0.7 } }], ajuste: (p, fr) => (fr > 45 ? { ...p, tronco: p.tronco + Math.sin(fr * 2.3) * 2 } : p) }}
    mara={{ ruta: [{ f: 0, x: 1770, y: LP - 10 }], escala: ESC * 1.5, giros: [{ f: 0, v: 0 }], poses: [{ f: 0, v: { tronco: 0, cabeza: 8, hD: 105, cD: 55, hI: -105, cI: -55 } }, { f: 45, v: { tronco: 4, cabeza: 10, hD: 115, cD: 70, hI: -115, cI: -70 } }], caras: [{ f: 0, v: "risa" }], opacidad: () => 0.96 }} />
);
// ---------- 2 · un príncipe que vivió adentro de un palacio de placer ----------
const RECOSTADO = { tronco: -48, cabeza: 18, pI: 88, rI: 20, pD: 80, rD: 30, hI: 20, cI: 30 };
const COME_A = { ...RECOSTADO, hD: 40, cD: 70 }, COME_B = { ...RECOSTADO, hD: 30, cD: 155 };
const SENT_PIERNAS = { tronco: 4, pI: 70, rI: 150, pD: 100, rD: 160 };
// músico sentado con su instrumento: el brazo toca en ciclo
const Musico: React.FC<{ x: number; inst: "sitar" | "tambor" | "flauta"; seed: number; look?: typeof ALDEANO; per?: number; dir?: 1 | -1 }> = ({ x, inst, seed, look = ALDEANO, per = 10, dir = 1 }) => {
  const f = useF();
  const a = inst === "sitar" ? { ...SENT_PIERNAS, hD: 55, cD: 60, hI: 70, cI: 110, cabeza: 6 } : inst === "tambor" ? { ...SENT_PIERNAS, hD: 70, cD: 30, hI: 60, cI: 40, cabeza: 10 } : { ...SENT_PIERNAS, hD: 60, cD: 150, hI: 70, cI: 140, cabeza: -6 };
  const b = inst === "sitar" ? { ...a, hD: 40, cD: 80 } : inst === "tambor" ? { ...a, hD: 45, cD: 65, hI: 80, cI: 20 } : { ...a, hD: 64, cD: 146, cabeza: -10 };
  const g = inst === "tambor" ? osc01(f, per) : 0;
  return (
    <g>
      {inst === "sitar" && <Sitar x={x + dir * 34} y={KP - 70} vibra={Math.sin(f) * 2} />}
      {inst === "tambor" && <Tambor x={x + dir * 62} y={KP} golpe={g} />}
      <A look={look} seed={seed} ruta={[{ f: 0, x, y: KP }]} dir={[{ f: 0, v: dir }]} asiento={[{ f: 0, v: 8 }]} poses={ciclo(a, b, per, 2000)} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.2, y: 0.3 } }]}
        enManoD={inst === "flauta" ? <g transform="rotate(100)"><g transform="translate(0,-40)"><rect x={-4} y={-6} width={8} height={90} rx={4} fill="#c8a060" stroke="#6a4a2a" strokeWidth={2} /></g></g> : null} />
      <Notas x={x + dir * 40} y={KP - 230} f={f + seed * 7} n={2} />
    </g>
  );
};
export const Q02Palacio: React.FC = () => (
  <Kap cl={[mira(0, 1170, 690, 2.3), mira(40, 1180, 680, 2.2), mira(153, 1330, 640, 1.3, { curva: "inout" })]} sp={{ flores: 0.6 }}
    medio={<>
      <Musico x={1600} inst="sitar" seed={41} />
      <Musico x={1760} inst="tambor" seed={42} look={ALDEANA} per={9} />
      <Musico x={1930} inst="flauta" seed={43} />
      <Divan x={1150} piso={KP} />
      <A look={SIDDHARTHA} seed={30} ruta={[{ f: 0, x: 1110, y: KP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 74 }]} poses={ciclo(COME_A, COME_B, 46, 153, 10)} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.6, y: 0.2 } }]} enManoD={<Uvas s={1.1} />} />
      <A look={ALDEANA} seed={45} ruta={[{ f: 0, x: 1560, y: KP }, { f: 70, x: 1290, y: KP }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 80, cD: 20, hI: 70, cI: 30 } }, { f: 75, v: { hD: 70, cD: 10, hI: 60, cI: 20, tronco: 14, cabeza: 10 } }]} caras={[{ f: 0, v: "feliz" }]} enManoD={<Recto ang={100}><Bandeja s={1.1} /></Recto>} />
    </>}
    hud={<Etiqueta texto="A PLEASURE PALACE" x={960} y={130} desde={18} tam={58} color="#fff2c8" />} />
);
// ---------- 3 · hoy ese palacio cabe en tu bolsillo ----------
export const Q03Bolsillo: React.FC = () => {
  const f = useF();
  const enc = lerp(f, 0, 38, 0, 1);
  const baja = lerp(f, 56, 86, 0, 1);
  const ty = 520 + baja * baja * 520;
  return (
    <Fondo>
      <TelMarco x={960} y={ty} s={0.62 + 0.12 * Math.min(1, f / 30)} rot={baja * -8} o={lerp(f, 6, 22, 0, 1)}>
        <svg viewBox="0 0 476 956" width={476} height={956}>
          <rect width={476} height={956} fill="#f2c48a" /><rect width={476} height={520} fill="#ffd9a0" /><circle cx={360} cy={170} r={50} fill="#fff6dc" />
          <g transform="translate(238,520)" opacity={enc}><MiniPalacio s={1.8} /></g>
          {[0, 1, 2].map((k) => <g key={k} transform={`translate(${90 + k * 150},${780})`} opacity={lerp(f, 40 + k * 5, 48 + k * 5, 0, 1)}><Icono t="corazon" c="#ff6a2b" /></g>)}
        </svg>
      </TelMarco>
      {enc < 1 && <Lienzo><g transform={`translate(960,${lerp(f, 0, 38, 470, 540)}) scale(${lerp(f, 0, 38, 3.6, 1.2)})`} opacity={1 - enc * 0.9}><MiniPalacio /></g></Lienzo>}
      <Lienzo o={lerp(f, 48, 60, 0, 1)}>
        <path d="M0,820 Q960,760 1920,820 L1920,1080 L0,1080 Z" fill="#2c3a5a" />
        <path d="M560,800 Q960,880 1360,800" stroke="#1a2440" strokeWidth={14} fill="none" />
        <path d="M560,800 Q960,880 1360,800" stroke="#e0a040" strokeWidth={4} strokeDasharray="14 12" fill="none" />
        <path d="M0,820 Q960,760 1920,820" stroke="#e0a040" strokeWidth={4} strokeDasharray="14 12" fill="none" />
      </Lienzo>
      <Lienzo o={lerp(f, 50, 58, 0, 1) * (1 - lerp(f, 80, 90, 0, 1))}><ManoGrande x={960 + 60} y={ty - 300} ang={170} piel="#ecc9a3" manga="#24242a" s={0.8} /></Lienzo>
      <Etiqueta texto="IN YOUR POCKET" x={960} y={140} desde={44} tam={56} color="#fff2c8" />
      <Hud2 />
    </Fondo>
  );
};
// ---------- 4 · día dos, tres de la mañana, el tren ----------
// v3: 3 planos — A) PRIMER PLANO de Leo con capucha caminando bajo la nieve (cámara lo acompaña); B) «Spin City laundromat»: corte al
// letrero SPIN CITY 24H, Leo entra a cuadro y va a la puerta; C) «Broadway and Lawrence»: el tren pasa en PRIMER TÉRMINO y barre el cuadro.
const k04 = kDe(10.14);
export const Q04Dia2: React.FC = () => {
  const f = useF();
  const cB = k04(12.6), cC = k04(14.1);
  const leo = (ruta: { f: number; x: number; y: number; curva?: "lineal" }[]) => <A look={LEO_CAPUCHA} seed={1} luz={rimFrio} ruta={ruta} poses={[{ f: 0, v: { hD: 10, cD: 20 } }]} enManoI={<BolsoRopa />} caras={[{ f: 0, v: "cansado" }]}
    miradas={[{ f: 0, v: { x: -0.4, y: -0.6 } }, { f: 40, v: { x: -0.9, y: 0.1 } }, { f: cB + 10, v: { x: -0.6, y: -0.7 } }, { f: cB + 30, v: { x: -0.9, y: 0 } }]} ajuste={(p) => ({ ...p, hI: 10, cI: 20 })} />;
  if (f < cB) return (
    <Escena Set={Broadway} pal={PAL} claves={[mira(0, 2440, 700, 2.3), mira(cB, 2330, 700, 2.4)]} setProps={{ tren: -1, nieve: true }}
      medio={leo([{ f: 0, x: 2520, y: 900 }, { f: cB, x: 2370, y: 900, curva: "lineal" }])}
      hud={<><Hud2 /><Rotulo texto="DAY 2 · 3:00 AM" desde={8} /></>} />
  );
  return (
    <Escena Set={Broadway} pal={PAL} claves={[mira(cB, 640, 600, 1.45), mira(168, 600, 610, 1.55, { curva: "inout" })]} setProps={{ tren: -1, nieve: true }}
      medio={leo([{ f: cB, x: 1040, y: 900 }, { f: 168, x: 800, y: 900, curva: "lineal" }])}
      hud={<><TrenFrente desde={cC} y={190} vel={110} alto={250} /><Hud2 /><Placa texto="BROADWAY & LAWRENCE" x={1180} y={140} desde={cC} tam={46} /></>} />
  );
};
// ---------- 5 · Leo entra con el bolso y el tel en la mano, como le pidió el viejo ----------
// v3: 3 planos sin que los cuerpos se pisen — A) puerta y ventana: pasa el tren, Leo entra con el bolso; B) Leo llega a su silla
// (Tenzo queda fuera de cuadro), DEJA CAER el bolso de un golpe (sacudón) y levanta el tel «in his hand»; C) primer plano de Tenzo que
// levanta la vista y asiente «like the old man asked».
const k05 = kDe(15.72);
export const Q05Entra: React.FC = () => {
  const f = useF();
  const cB = k05(18.75), cC = k05(21.5), cae = k05(19.45);
  // v3ra: la cámara entra con él por la puerta (zoom 1,9, lo acompaña): antes era el general detrás de la vidriera con Leo a 1/6 del alto
  if (f < cB) return (
    <Lav cl={[mira(0, 4120, 640, 1.9), mira(30, 4100, 640, 1.9), mira(cB, 3560, 650, 1.95, { curva: "inout" })]} toalla={-1} sp={{ tren: 0 }} tenzo={{ no: true }}
      leo={{ ruta: [{ f: 0, x: 4300, y: LP }, { f: 40, x: 4180, y: LP }, { f: cB, x: 3420, y: LP, curva: "lineal" }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: undefined }],
        poses: [{ f: 0, v: { hD: 30, cD: 110, hI: 10, cI: 10 } }], enManoI: <BolsoRopa />, enManoD: <Tel />, caras: [{ f: 0, v: "cansado" }], miradas: [{ f: 0, v: { x: -0.9, y: 0.1 } }, { f: 10, v: { x: 0.6, y: -0.5 } }, { f: 40, v: { x: -0.9, y: 0 } }] }}
      hud={<><Hud2 /><Placa texto="THE TRAIN GOES BY" x={960} y={170} desde={6} hasta={k05(17.4)} tam={40} /></>} />
  );
  // v3ra: sin el primer plano de Tenzo (C): el plano B sigue hasta el corte y Leo, ya sentado, mira hacia el rincón del viejo «like the old man asked»
  if (f < 999) return (
    <Sacude f0={[cae + 4]} amp={10}>
      <Lav cl={[mira(cB, 1120, 640, 1.85), mira(cC, 1110, 650, 1.95), mira(229, 1180, 650, 2.1, { curva: "inout" })]} toalla={-1} tenzo={{ no: true }}
        extra={f >= cae ? <g transform={`translate(${L.leo - 150},${LP - 160 - Math.max(0, 4 - (f - cae)) * 30})`}><BolsoRopa s={1.5} /></g> : null}
        leo={{ ruta: [{ f: cB, x: 1400, y: LP }, { f: cae - 4, x: L.leo, y: LP }], dir: [{ f: 0, v: -1 }, { f: cae + 6, v: 1 }], asiento: [{ f: 0, v: undefined }, { f: cae + 14, v: 66 }],
          poses: [{ f: 0, v: { hD: 30, cD: 110, hI: 10, cI: 10 } }, { f: cae - 2, v: { hD: 30, cD: 110, hI: -50, cI: 10, tronco: 12 } }, { f: cae + 14, v: { ...SENTADO, hD: 30, cD: 110 } }, { f: k05(20.1), v: { ...SENTADO, hD: 120, cD: 40, cabeza: -4 } }, { f: k05(21.0), v: { ...CEL_SENT, cabeza: 6 } }],
          enManoI: (fr: number) => (fr < cae ? <BolsoRopa /> : null), enManoD: <Tel s={1.2} />, caras: [{ f: 0, v: "cansado" }, { f: cae + 4, v: "neutral" }, { f: cC + 6, v: "duda" }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }, { f: cae + 10, v: { x: 0.2, y: -0.4 } }, { f: k05(21.0), v: { x: 0.3, y: 0.7 } }, { f: cC + 4, v: { x: 0.9, y: -0.1 } }],
          giros: [{ f: 0, v: 0 }, { f: cC + 4, v: 0.35 }] }}
        hud={<><Hud2 /><Placa texto="PHONE IN HAND" x={1300} y={230} desde={k05(20.2)} hasta={cC} tam={42} color="#ffd38a" /><Placa texto="LIKE THE OLD MAN ASKED" x={1300} y={230} desde={cC + 4} tam={40} /></>} />
    </Sacude>
  );
  return (
    <Lav cl={[mira(cC, 1760, 640, 2.6), mira(229, 1750, 645, 2.7)]} toalla={-1} leo={{ no: true }}
      tenzo={tenzoPela({ poses: [{ f: 0, v: PELA }, { f: cC + 10, v: { ...PELA, cabeza: 0 } }, { f: cC + 26, v: { ...PELA, cabeza: 14 } }, { f: cC + 38, v: { ...PELA, cabeza: 2 } }],
        caras: [{ f: 0, v: "neutral" }, { f: cC + 8, v: "feliz" }], miradas: [{ f: 0, v: { x: -0.3, y: 0.6 } }, { f: cC + 8, v: MIRA_L }] })}
      hud={<><Hud2 /><Placa texto="LIKE THE OLD MAN ASKED" x={960} y={170} desde={cC + 4} tam={40} /></>} />
  );
};
// ---------- 6 · Tenzo ya está: mismo rincón, misma túnica, el farol en la mesa ----------
// v3: un plano por cada «same»: A) Tenzo saluda con la mandarina; B) gran general del lavadero con aro sobre SU rincón;
// C+D) v3ra: un solo detalle extremo del farol, entra la manga gris de Tenzo con la palma abierta; detalle del farol que brilla sobre la mesa plegable.
const k06 = kDe(23.38);
export const Q06YaEsta: React.FC = () => {
  const f = useF();
  const { fps } = useVideoConfig();
  const cB = k06(25.1), cC = k06(26.2), cD = k06(27.55);
  if (f < cB) return (
    <Lav cl={[mira(0, 1620, 660, 1.75), mira(cB, 1630, 660, 1.82)]} toalla={-1} leo={{ no: true }}
      tenzo={tenzoPela({ enManoD: <Mandarina s={1.3} />, poses: [{ f: 0, v: PELA }, { f: 10, v: { ...SENTADO, hD: 105, cD: 40, hI: 40, cI: 90, cabeza: -4 } }, ...ciclo({ ...SENTADO, hD: 105, cD: 40, hI: 40, cI: 90, cabeza: -4 }, { ...SENTADO, hD: 95, cD: 75, hI: 40, cI: 90, cabeza: -2 }, 12, cB, 16)],
        miradas: [{ f: 0, v: { x: -0.3, y: 0.6 } }, { f: 8, v: MIRA_L }], caras: [{ f: 0, v: "neutral" }, { f: 10, v: "risa" }] })}
      hud={<><Hud2 /><Placa texto="ALREADY THERE" x={760} y={220} desde={k06(23.9)} tam={44} /></>} />
  );
  if (f < cC) {
    const clB = [mira(cB, 1320, 690, 0.86), mira(cC, 1350, 690, 0.9)];
    const t = enPantalla(clB, f, fps, 1700, LP - 150);
    const s = suave(lerp(f, cB + 2, cB + 14, 0, 1));
    return (
      <Lav cl={clB} toalla={-1} tenzo={tenzoPela({})} leo={{ no: true }}
        hud={<><Hud2 /><Lienzo><circle cx={t.x} cy={t.y} r={120 + (1 - s) * 200} fill="none" stroke="#ffd38a" strokeWidth={8} opacity={s} strokeDasharray="22 14" /></Lienzo>
          <Placa texto="SAME CORNER" x={t.x} y={t.y - 190} desde={cB + 4} tam={46} color="#ffd38a" /></>} />
    );
  }
  // v3ra: sin el detalle de la túnica (era otro primer plano del monje): el farol en primerísimo arranca en «same gray robe» con la MANGA gris que entra
  return (
    // v3ra: el farol en PRIMERÍSIMO (llena el cuadro) y la mano de Tenzo entra y lo gira apenas; sin su cara (no repetir el monje con farol)
    <Lav cl={[mira(cC, L.farol + 120, LP - 120, 4.3), mira(cD + 12, L.farol + 10, LP - 205, 5.0, { curva: "inout" }), mira(226, L.farol, LP - 210, 5.6, { curva: "inout" })]} toalla={-1} leo={{ no: true }} sp={{ luzFarol: 1.25 + 0.25 * osc01(f, 22) + 0.55 * suave(lerp(f, cD, 226, 0, 1)) }}
      tenzo={{ ruta: [{ f: 0, x: L.tenzo + 520, y: LP }], poses: [{ f: 0, v: DOBLA_A }] }}
      extra={(() => { const u = suave(lerp(f, cC + 2, cC + 34, 0, 1)); const w = suave(lerp(f, cD, 226, 0, 1)); return <ManoGrande x={L.farol + 70 + (1 - u) * 160 - 26 * w} y={LP - 150 + (1 - u) * 140 - 8 * w} ang={-38 + 6 * w} piel="#e0b48c" manga="#8a8c90" s={0.3} palma largo={1400} />; })()}
      hud={<><Hud2 /><Placa texto="SAME GRAY ROBE" x={560} y={880} desde={cC + 3} hasta={cD} tam={46} /><Placa texto="SAME LITTLE LANTERN" x={600} y={230} desde={cD + 3} tam={46} color="#ffd38a" /></>} />
  );
};
// ---------- 7 · hoy no dobla toallas: pela una mandarina, despacio, en una sola espiral ----------
// v3: inserto que SIEMPRE se mueve (toallas que se van → mandarina que entra rodando → cáscara en espiral que crece y se balancea);
// corte a Tenzo pelando en «very slowly» (otro tamaño) y vuelta al inserto en «one long spiral» con la espiral completa.
const k07 = kDe(30.92);
export const Q07Mandarina: React.FC = () => {
  const f = useF();
  const t1 = k07(35.5), t2 = k07(36.6);
  const toallas = 1 - lerp(f, 8, 44, 0, 1);
  const entra = lerp(f, 36, 70, 0, 1);
  // v3ra: sin el corte al primer plano del monje en «very slowly»: el inserto de las manos pelando sigue de corrido
  if (f < 0) return (
    // v3ra: las MANOS pelando, de cerca y a la altura de la mesa (la cara apenas asoma arriba): no otro primer plano del monje
    <Lav cl={[mira(t1, 1700, 760, 3.7, { rot: 2 }), mira(t2, 1705, 755, 3.85, { rot: 2 })]} toalla={-1} leo={{ no: true }} sp={{ farol: false }}
      tenzo={tenzoPela({ poses: ciclo(PELA, { ...PELA, hD: 60, cD: 95, cabeza: 20 }, 16, t2, t1), enManoD: <Mandarina pelada={0.6} s={1.3} />, caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: { x: -0.2, y: 0.8 } }] })}
      hud={<><Hud2 /><Placa texto="VERY SLOWLY" x={700} y={210} desde={t1 + 2} tam={46} color="#fff2c8" /></>} />
  );
  const p = lerp(f, k07(33.3), 222, 0, 1);
  return (
    <Fondo>
      <InsertoMandarina f={f} p={p} toallas={toallas} entra={entra} zoom={lerp(f, 0, 228, 1, 1.12)} />
      <Placa texto="NOT FOLDING TOWELS" x={480} y={200} desde={k07(31.4)} hasta={k07(33.2)} tam={44} />
      <Placa texto="PEELING A MANDARIN" x={480} y={200} desde={k07(33.9)} hasta={k07(35.4)} tam={44} color="#ffb060" />
      <Placa texto="VERY SLOWLY" x={480} y={200} desde={k07(35.5)} hasta={k07(36.7)} tam={46} color="#fff2c8" />
      {f >= t2 && <Placa texto="1 PEEL · 0 BREAKS" x={1520} y={200} desde={t2 + 4} tam={44} color="#ffb060" />}
      <Placa texto="ONE LONG SPIRAL" x={480} y={200} desde={k07(36.8)} tam={48} color="#fff2c8" />
      <Hud2 />
    </Fondo>
  );
};
// ---------- 8 · «you came» · «you said bring the phone» ----------
const k08 = kDe(38.5);
export const Q08Viniste: React.FC = () => {
  const f = useF();
  return f < k08(39.95)
    ? <Lav cl={[mira(0, 1470, 640, 2.0), mira(k08(39.95), 1480, 640, 2.08)]} toalla={-1}
      tenzo={tenzoPela({ poses: [{ f: 0, v: PELA }, { f: 10, v: { ...SENTADO, hD: 30, cD: 60, hI: 30, cI: 60, cabeza: -6, tronco: -4 } }], giros: [{ f: 0, v: 0.6 }, { f: 12, v: 0 }], habla: [[10, k08(39.2)]], miradas: [{ f: 0, v: { x: -0.2, y: 0.7 } }, { f: 10, v: MIRA_L }] })}
      leo={{ no: true }} hud={<><HombroLeo /><Hud2 /></>} />
    : <Lav cl={[mira(0, L.leo + 170, 640, 2.0), mira(60, L.leo + 180, 640, 2.08)]} toalla={-1} tenzo={{ no: true }}
      leo={leoSent({ poses: [{ f: 0, v: { ...CEL_SENT, cabeza: 0 } }, { f: k08(40.2), v: { ...SENTADO, hD: 110, cD: 60, hI: 20, cI: 30, tronco: -4 } }], caras: [{ f: 0, v: "duda" }], habla: [[k08(40.04), k08(41.16)]] })}
      hud={<><HombroTenzo /><Hud2 /></>} />;
};
// ---------- 9 · Tenzo tiende la mano. Abierta. Paciente ----------
// v3 (sin silueta): A) plano medio de Tenzo de frente que TIENDE el brazo hacia Leo «holds out his hand»; B) INSERTO de la palma:
// de puño a palma abierta en «Open», quieta y firme en «patient» mientras la mano de Leo con el tel se echa atrás.
const k09 = kDe(41.86);
export const Q09Mano: React.FC = () => {
  const f = useF();
  const cB = k09(43.45);
  if (f < cB) return (
    // v3ra: DOS-SHOT de perfil a la altura de la mesa (antes: otro primer plano del monje con el farol). Tenzo tiende el brazo por encima
    // de la mesa y Leo se echa atrás apretando el tel: la distancia entre los dos ES la escena.
    <Lav cl={[mira(0, 1440, 700, 1.55), mira(cB, 1450, 705, 1.68, { curva: "inout" })]} toalla={-1} sp={{ luzFarol: 1.1 }}
      tenzo={{ poses: [{ f: 0, v: DOBLA_A }, { f: k09(42.4), v: { ...DOBLA_A, cabeza: -6 } }, { f: k09(42.9), v: { ...OFRECE, tronco: 14 } }], caras: [{ f: 0, v: "neutral" }, { f: k09(42.6), v: "feliz" }], miradas: [{ f: 0, v: { x: -0.3, y: 0.5 } }, { f: k09(42.3), v: MIRA_L }], giros: [{ f: 0, v: 0 }] }}
      leo={leoSent({ poses: [{ f: 0, v: { ...CEL_SENT, cabeza: 4 } }, { f: k09(42.7), v: { ...CEL_SENT, cabeza: -4, tronco: -2 } }, { f: k09(43.0), v: { ...AFERRA, tronco: -14, cabeza: -6 } }],
        caras: [{ f: 0, v: "neutral" }, { f: k09(42.75), v: "sorpresa" }, { f: k09(43.1), v: "duda" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }, { f: k09(42.7), v: MIRA_T }] })}
      hud={<><Hud2 /><Placa texto="HE HOLDS OUT HIS HAND" x={960} y={170} desde={k09(42.3)} tam={44} /></>} />
  );
  const abre = suave(lerp(f, k09(43.55), k09(44.0), 0, 1));
  const retro = suave(lerp(f, k09(44.3), k09(44.9), 0, 1));
  return (
    <>
      <InsertoPalma f={f} abre={abre} retro={retro} />
      <Hud2 />
      <Placa texto="OPEN" x={1240} y={150} desde={k09(43.62)} tam={64} />
      <Placa texto="PATIENT" x={1240} y={250} desde={k09(44.22)} tam={64} color="#ffd38a" />
    </>
  );
};
// ---------- 10 · Leo se ríe: «no way» · «one night» ----------
const k10 = kDe(45.18);
// v3: A) Leo SOLO en plano medio: se ríe echando el torso atrás y NIEGA con la mano libre «no way»; B) corte a Tenzo que levanta UN dedo «one night».
// v3: Leo SOLO en plano medio (sin el general de 2): se ríe echando el torso atrás y NIEGA con la mano del tel «no way»; en «one night»
// (Tenzo fuera de cuadro, a la derecha — su primer plano con el dedo llega en Q12) Leo corta la risa, baja la mano y lo mira con duda.
export const Q10NoWay: React.FC = () => {
  const cB = k10(47.3);
  const RIE = { ...SENTADO, tronco: -22, cabeza: -12, hD: 40, cD: 135, hI: 110, cI: 30 };
  const NIEGA_A = { ...SENTADO, tronco: -8, cabeza: -4, hD: 125, cD: 5, hI: 20, cI: 30 }, NIEGA_B = { ...NIEGA_A, hD: 100, cD: 45 };
  return (
    <Lav cl={[mira(0, L.leo + 60, 700, 2.2), mira(cB, L.leo + 60, 700, 2.35), mira(97, L.leo + 110, 690, 2.6, { curva: "inout" })]} toalla={-1} tenzo={{ no: true }}
      leo={leoSent({ poses: [{ f: 0, v: AFERRA }, ...ciclo(RIE, { ...RIE, tronco: -14, cabeza: -4 }, 7, k10(46.35), 4), ...ciclo(NIEGA_A, NIEGA_B, 5, cB, k10(46.4)), { f: cB + 6, v: { ...AFERRA, cabeza: 6 } }],
        giros: [{ f: 0, v: 0 }], caras: [{ f: 0, v: "risa" }, { f: cB + 2, v: "duda" }], habla: [[0, k10(46.38)], [k10(46.42), k10(46.92)]], miradas: [{ f: 0, v: { x: 0.9, y: -0.3 } }, { f: cB, v: { x: 1, y: 0 } }] })}
      hud={<><Hud2 /><Placa texto="NO WAY" x={1300} y={200} desde={k10(46.42)} hasta={cB} tam={70} /><Placa texto="«ONE NIGHT.»" x={1450} y={200} desde={k10(47.38)} tam={60} color="#ffd38a" /></>} />
  );
};
// ---------- 11 · «I need it. For work. For… everything» ----------
const k11 = kDe(48.4);
// v3: 4 íconos (trabajo, mapa, chat, música) brotan DEL TEL, uno por palabra, hacia la DERECHA (nunca sobre la cara); cada uno queda
// atado al tel con una cadena; en «everything» las cadenas se tensan y tiran: Leo se encorva sobre el tel.
const ICONOS11: { t: "trabajo" | "mapa" | "chat" | "musica"; d: number; x: number; y: number }[] = [
  { t: "trabajo", d: k11(49.2), x: 1330, y: 300 }, { t: "mapa", d: k11(49.85), x: 1640, y: 470 }, { t: "chat", d: k11(50.2), x: 1680, y: 760 }, { t: "musica", d: k11(50.55), x: 1400, y: 930 }];
export const Q11Necesito: React.FC = () => {
  const f = useF();
  const { fps } = useVideoConfig();
  // v3ra: otro encuadre que Q10: Leo en el TERCIO IZQUIERDO, de cuerpo entero sentado (zoom 1,6), y las cadenas cruzan todo el cuadro
  const cl11 = [mira(0, L.leo + 360, 640, 1.6), mira(95, L.leo + 340, 650, 1.7, { curva: "inout" })];
  const t = enPantalla(cl11, f, fps, L.leo + 100, LP - 156);
  const tira = lerp(f, k11(50.6), k11(51.2), 0, 1);
  return (
    <Lav cl={cl11} tenzo={{ no: true }} toalla={-1}
      leo={leoSent({ poses: [{ f: 0, v: AFERRA }, { f: 26, v: { ...AFERRA, tronco: -2, cabeza: -4 } }, { f: k11(50.6), v: { ...AFERRA2, tronco: 14, cabeza: 18 } }], caras: [{ f: 0, v: "duda" }, { f: 40, v: "triste" }, { f: k11(50.7), v: "miedo" }], habla: [[0, 70]],
        miradas: [{ f: 0, v: MIRA_T }, { f: k11(49.3), v: { x: 0.8, y: -0.5 } }, { f: k11(50.0), v: { x: 0.9, y: 0 } }, { f: k11(50.7), v: { x: 0.4, y: 0.8 } }],
        ajuste: (p: { tronco: number }, fr: number) => (fr > k11(50.6) ? { ...p, tronco: p.tronco + Math.sin(fr * 2.2) * 2 } : p) })}
      hud={<><Hud2 /><Lienzo>{ICONOS11.map(({ t: ic, d, x: x1, y: y1 }, i) => {
        if (f < d) return null;
        const s = interpolate(f - d, [0, 12], [0, 1], { ...cl, easing: (u) => 1 - (1 - u) * (1 - u) });
        // tensión: los íconos se acercan un poco al tel
        const x = t.x + (x1 - t.x) * s * (1 - tira * 0.18), y = t.y + (y1 - t.y) * s * (1 - tira * 0.18);
        const links = 11;
        const ang = (Math.atan2(y - t.y, x - t.x) * 180) / Math.PI;
        const comba = (1 - tira) * 40;
        return (
          <g key={i}>
            {Array.from({ length: links }).map((_, j) => { const u = (j + 0.5) / links; const cx = t.x + (x - t.x) * u, cy = t.y + (y - t.y) * u + Math.sin(u * Math.PI) * comba; return <ellipse key={j} cx={cx} cy={cy} rx={17} ry={9} fill="none" stroke="#2a2c32" strokeWidth={9} transform={`rotate(${ang + (j % 2) * 90} ${cx} ${cy})`} opacity={s} />; })}
            {Array.from({ length: links }).map((_, j) => { const u = (j + 0.5) / links; const cx = t.x + (x - t.x) * u, cy = t.y + (y - t.y) * u + Math.sin(u * Math.PI) * comba; return <ellipse key={`b${j}`} cx={cx} cy={cy} rx={17} ry={9} fill="none" stroke="#d6d9de" strokeWidth={5} transform={`rotate(${ang + (j % 2) * 90} ${cx} ${cy})`} opacity={s} />; })}
            <g transform={`translate(${x},${y}) scale(${s})`}><circle r={72} fill="#ff6a2b" stroke="#fff2e0" strokeWidth={6} /><g transform="translate(-44,-44) scale(0.88)"><Icono t={ic} /></g></g>
          </g>
        );
      })}
        {/* v4: las 4 cadenas terminan en un GRILLETE que se cierra de golpe en la muñeca de Leo (con destello) */}
        {f >= k11(50.3) && (() => {
          const c = suave(lerp(f, k11(50.3), k11(50.55), 0, 1)), ab = (1 - c) * 70, fl = lerp(f, k11(50.55), k11(50.85), 1, 0);
          return (
            <g transform={`translate(${t.x - 10},${t.y + 40})`}>
              {[-1, 1].map((sd) => <path key={sd} d="M0,-58 A58,58 0 0 1 0,58" transform={`scale(${sd},1) rotate(${-sd * ab})`} fill="none" stroke="#2a2c32" strokeWidth={24} strokeLinecap="round" />)}
              {[-1, 1].map((sd) => <path key={`b${sd}`} d="M0,-58 A58,58 0 0 1 0,58" transform={`scale(${sd},1) rotate(${-sd * ab})`} fill="none" stroke="#c9ced6" strokeWidth={12} strokeLinecap="round" />)}
              <rect x={-14} y={-74} width={28} height={30} rx={6} fill="#8a8f98" stroke="#2a2c32" strokeWidth={5} />
              {fl > 0 && [0, 1, 2, 3, 4, 5].map((k) => { const a = (k / 6) * Math.PI * 2; return <line key={k} x1={Math.cos(a) * 80} y1={Math.sin(a) * 80} x2={Math.cos(a) * (80 + 50 * fl)} y2={Math.sin(a) * (80 + 50 * fl)} stroke="#fff6dc" strokeWidth={8} strokeLinecap="round" opacity={fl} />; })}
            </g>
          );
        })()}
      </Lienzo>
        <Placa texto="FOR WORK" x={1330} y={190} desde={k11(49.25)} tam={36} />
        <Placa texto="FOR EVERYTHING" x={1560} y={1010} desde={k11(50.2)} tam={36} color="#ffb060" /></>} />
  );
};
// ---------- 12 · «one night. Tomorrow at three I give it back… a prince who had never seen a phone» ----------
const k12 = kDe(51.56);
// v3: cortado en 3 — Tenzo levanta UN dedo (primer plano) → cronómetro de pantalla completa «24:00:00 · TOMORROW 3:00 AM» →
// Tenzo cuenta (manos abiertas) y en «prince» brota la burbuja del príncipe en su palacio; en «phone» un tel con «?» entra a la burbuja.
const CUENTA_A = { ...SENTADO, hD: 70, cD: 50, hI: 70, cI: 50, tronco: 8, cabeza: 2 }, CUENTA_B = { ...SENTADO, hD: 100, cD: 30, hI: 95, cI: 35, tronco: 4, cabeza: -6 };
export const Q12UnaNoche: React.FC = () => {
  const f = useF();
  const { fps } = useVideoConfig();
  const c1 = k12(53.6), c2 = k12(55.45);
  // v3ra: A) PRIMERÍSIMO de Leo (antes: otro primer plano del monje): oye «one night» otra vez, aprieta el tel y mira al viejo de reojo
  if (f < c1) return (
    <Lav cl={[mira(0, L.leo + 40, 680, 3.0), mira(c1, L.leo + 50, 670, 3.2)]} toalla={-1} tenzo={{ no: true }}
      leo={leoSent({ poses: [{ f: 0, v: AFERRA }, { f: 18, v: AFERRA2 }, { f: 40, v: { ...AFERRA2, tronco: -8, cabeza: 2 } }], caras: [{ f: 0, v: "duda" }, { f: 16, v: "triste" }, { f: 42, v: "determinado" }],
        miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }, { f: 12, v: MIRA_T }, { f: 34, v: { x: 0.4, y: 0.8 } }, { f: 50, v: MIRA_T }] })}
      hud={<><Hud2 /><Placa texto="«ONE NIGHT.»" x={1400} y={230} desde={4} tam={58} color="#ffd38a" /></>} />
  );
  // B) el RELOJ de la pared corre (las agujas dan la vuelta hasta las 3) y Leo, abajo, lo mira
  if (f < c2) {
    const u = lerp(f, c1, c2, 0, 1);
    const ang = u * 720;
    return (
      <Lav cl={[mira(c1, L.leo + 150, 590, 1.55), mira(c2, L.leo + 150, 580, 1.62)]} toalla={-1} tenzo={{ no: true }}
        extra={<g transform={`translate(${L.leo + 330},${LP - 545})`}>
          <circle r={128} fill="#f4efe6" stroke="#2a2c32" strokeWidth={14} />
          {Array.from({ length: 12 }).map((_, k) => <line key={k} x1={0} y1={-108} x2={0} y2={k % 3 ? -96 : -84} stroke="#2a2c32" strokeWidth={k % 3 ? 5 : 9} transform={`rotate(${k * 30})`} />)}
          <line x1={0} y1={10} x2={0} y2={-60} stroke="#2a2c32" strokeWidth={12} strokeLinecap="round" transform={`rotate(${90 + ang / 12})`} />
          <line x1={0} y1={14} x2={0} y2={-92} stroke="#ff6a2b" strokeWidth={7} strokeLinecap="round" transform={`rotate(${ang})`} />
          <circle r={11} fill="#2a2c32" />
        </g>}
        leo={leoSent({ poses: [{ f: 0, v: AFERRA }], caras: [{ f: 0, v: "duda" }, { f: c1 + 30, v: "triste" }], miradas: [{ f: 0, v: { x: 0.5, y: -0.8 } }], giros: [{ f: 0, v: 0.2 }] })}
        hud={<><Hud2 /><Pildora texto="TOMORROW · 3:00 AM" x={1380} y={900} tam={44} desde={c1 + 4} color="#ff6a2b" /></>} />
    );
  }
  // C) Tenzo en el TERCIO IZQUIERDO, de cuerpo entero sentado, y la burbuja del príncipe ocupa la derecha
  const cl12 = [mira(c2, L.tenzo + 330, 610, 1.7), mira(252, L.tenzo + 310, 620, 1.8, { curva: "inout" })];
  const cab = enPantalla(cl12, f, fps, 1700, LP - 270);
  const tel = lerp(f, k12(58.5), k12(59.2), 0, 1);
  return (
    <Lav cl={cl12} toalla={-1} leo={{ no: true }}
      tenzo={{ poses: [{ f: 0, v: CUENTA_A }, ...ciclo(CUENTA_A, CUENTA_B, 34, k12(57.6), c2 + 6), { f: k12(57.8), v: { ...SENTADO, hD: 150, cD: 30, hI: 20, cI: 40, cabeza: -10 } }, { f: k12(58.6), v: { ...SENTADO, hD: 90, cD: 80, hI: 80, cI: 70, tronco: 10 } }],
        caras: [{ f: 0, v: "feliz" }, { f: k12(57.8), v: "risa" }], miradas: [{ f: 0, v: MIRA_L }, { f: k12(57.8), v: { x: -0.5, y: -0.6 } }], habla: [[0, k12(56.0)], [k12(56.8), k12(59.3)]] }}
      hud={<><Hud2 />
        <Burbuja x={1340} y={420} r={230} desde={k12(57.7)} cx={cab.x - 80} cy={cab.y - 40}>
          <rect x={-120} y={-120} width={240} height={240} fill="#ffd9a0" /><rect x={-120} y={50} width={240} height={80} fill="#e2b47e" />
          <g transform="translate(0,20)"><MiniPalacio s={0.8} /></g>
          <g transform="translate(-40,62)"><circle cx={0} cy={-46} r={14} fill="#dfa877" stroke="#2a2622" strokeWidth={3} /><path d="M-14,-32 L14,-32 L18,10 L-18,10 Z" fill="#f1e2c0" stroke="#2a2622" strokeWidth={3} /><path d="M-10,-60 L-6,-70 L0,-62 L6,-70 L10,-60 Z" fill="#e0b040" /></g>
          {tel > 0 && <g transform={`translate(${30 + (1 - tel) * 120},${10 - (1 - tel) * 60}) rotate(${(1 - tel) * 40})`}><rect x={-16} y={-30} width={32} height={60} rx={6} fill="#15171c" stroke="#f4efe6" strokeWidth={3} /><text x={0} y={-40} fontSize={34} fontWeight={700} textAnchor="middle" fill="#c8403a">?</text></g>}
        </Burbuja>
        <Placa texto="A PRINCE WHO HAD NEVER SEEN A PHONE" x={960} y={110} desde={k12(58.3)} tam={40} color="#ffd38a" /></>} />
  );
};
// ---------- 13 · detrás de Leo algo se estira, bosteza y sonríe ----------
// v3: más cerrado sobre Leo; Leo SIENTE algo detrás en «stretches» (mira de reojo), y en «smiles» le corre un ESCALOFRÍO
// (reacción de miedo: se encoge, tiembla, gotas de sudor) y gira la cabeza hacia atrás.
const k13 = kDe(59.98);
export const Q13Estira: React.FC = () => {
  const esc = k13(63.4);
  return (
    // v3ra: otro encuadre que Q10/Q11: plano abierto y bajo, Leo a la DERECHA y la sombra que se estira enorme a la izquierda, separada
    <Lav cl={[mira(0, L.leo - 230, 560, 1.45), mira(139, L.leo - 200, 600, 1.6, { curva: "inout" })]} tenzo={{ no: true }} toalla={-1}
      mara={{ ruta: [{ f: 0, x: L.leo - 380, y: LP - 10 }], escala: ESC * 1.35, opacidad: fade(0, 40, 0.96), poses: [{ f: 0, v: { tronco: 10, cabeza: 20, hD: 10, cD: 10, hI: 10, cI: 10 } }, { f: k13(61.8), v: { tronco: -8, cabeza: -14, hD: 170, cD: 20, hI: -170, cI: -20 } }, { f: k13(63.3), v: { hD: 70, cD: 80, hI: 30, cI: 60, tronco: 16, cabeza: 18 } }],
        caras: [{ f: 0, v: "cansado" }, { f: k13(62.8), v: "sorpresa" }, { f: k13(63.32), v: "picaro" }] }}
      leo={conReaccion(leoSent({ poses: [{ f: 0, v: AFERRA }, { f: k13(61.9), v: { ...AFERRA, cabeza: -6 } }], caras: [{ f: 0, v: "duda" }],
        miradas: [{ f: 0, v: MIRA_T }, { f: k13(61.9), v: { x: -0.6, y: -0.2 } }, { f: k13(62.6), v: MIRA_T }, { f: esc + 14, v: { x: -0.9, y: -0.4 } }], giros: [{ f: 0, v: 0 }, { f: esc + 14, v: -0.5 }] }) as Parameters<typeof conReaccion>[0], "miedo", esc, 60)}
      hud={<><Hud2 /><Lienzo><ReaccionFx tipo="miedo" f0={esc} x={1330} y={420} dir={-1} s={1.4} /></Lienzo></>} />
  );
};
// ---------- 14 · «don't give it to him… you hate being alone with yourself» ----------
const k14 = kDe(64.6);
// v3: dos-tiros cerrado de perfil, Mara a la IZQUIERDA y separada (su cabeza ya no pisa la de Leo); lo ABRAZA con los dos brazos
// desde atrás y le susurra; Leo se encoge con el tel apretado. Las frases van en placa (antes letra naranja sin contraste).
export const Q14NoSelo: React.FC = () => (
  <Lav cl={[mira(0, L.leo - 70, 690, 2.25), mira(141, L.leo - 80, 690, 2.45, { curva: "inout" })]} tenzo={{ no: true }} toalla={-1}
    mara={{ opacidad: () => 0.96, ruta: [{ f: 0, x: L.leo - 165, y: LP - 10 }], poses: [{ f: 0, v: { hD: 60, cD: 40, hI: 50, cI: 50, tronco: 18, cabeza: 18 } },
      { f: 20, v: { hD: 52, cD: 30, hI: 46, cI: 36, tronco: 32, cabeza: 24 } }, ...ciclo({ hD: 52, cD: 30, hI: 46, cI: 36, tronco: 32, cabeza: 24 }, { hD: 56, cD: 24, hI: 50, cI: 30, tronco: 36, cabeza: 28 }, 18, 141, 24)],
      caras: [{ f: 0, v: "picaro" }], habla: [[0, k14(65.46)], [k14(65.76), k14(69.2)]] }}
    leo={leoSent({ poses: [{ f: 0, v: AFERRA }, { f: 24, v: { ...AFERRA2, tronco: 14, cabeza: 12 } }, { f: k14(67.3), v: { ...AFERRA2, tronco: 20, cabeza: 18 } }], caras: [{ f: 0, v: "miedo" }, { f: k14(67.6), v: "triste" }],
      miradas: [{ f: 0, v: { x: -0.4, y: 0.2 } }, { f: 30, v: { x: 0.3, y: 0.8 } }] })}
    hud={<><Hud2 /><Placa texto="«DON'T GIVE IT TO HIM.»" x={1300} y={200} desde={2} hasta={k14(65.7)} tam={50} color="#ff8a4a" />
      <Placa texto="«YOU'LL BE ALONE WITH YOURSELF.»" x={1250} y={200} desde={k14(65.76)} hasta={k14(67.2)} tam={46} color="#ff8a4a" />
      <Placa texto="«YOU HATE BEING ALONE WITH YOURSELF.»" x={1200} y={200} desde={k14(67.28)} tam={46} color="#ff8a4a" /></>} />
);
// ---------- 15 · el farol titila y el lavadero desaparece ----------
// v3: A) detalle del farol que TITILA fuerte (con la cara de Tenzo al borde); B) «the laundromat disappears»: plano medio de los dos y el
// lavadero se DESARMA por capas desde el farol (cuadritos de luz: arriba los lavarropas, después sillas y piso, al final ellos) → blanco.
const k15 = kDe(69.3);
export const Q15Titila: React.FC = () => {
  const f = useF();
  const { fps } = useVideoConfig();
  const cB = k15(70.6);
  const cl15 = f < cB ? [mira(0, L.farol - 20, LP - 210, 3.2), mira(cB, L.farol - 30, LP - 210, 3.35)] : [mira(cB, L.leo + 90, 660, 2.5), mira(101, L.leo + 90, 650, 2.75)];
  const fp = enPantalla(cl15, f, fps, L.farol, LP - 170);
  const r = interpolate(f, [k15(71.9), 101], [0, 2300], { ...cl, easing: (t) => t * t });
  const titila = f < k15(69.8) ? 1.2 : f % 7 < 2 ? 0.25 : f % 11 < 3 ? 0.6 : 1.8;
  return (
    <>
      <Lav cl={cl15} toalla={-1} sp={{ luzFarol: titila }} tenzo={tenzoPela({ miradas: [{ f: 0, v: { x: -0.3, y: 0.6 } }, { f: k15(69.9), v: { x: -0.6, y: -0.6 } }], caras: [{ f: 0, v: "feliz" }] })}
        leo={leoSent({ poses: [{ f: 0, v: AFERRA }, { f: cB + 4, v: { ...AFERRA, tronco: -10, cabeza: -10 } }, { f: cB + 16, v: { ...AFERRA2, tronco: -14, cabeza: -6 } }, { f: cB + 30, v: { ...AFERRA2, tronco: -4, cabeza: 6 } }],
          caras: [{ f: 0, v: "duda" }, { f: cB + 2, v: "sorpresa" }, { f: cB + 26, v: "miedo" }],
          miradas: [{ f: 0, v: MIRA_T }, { f: cB + 2, v: { x: 0.2, y: -0.9 } }, { f: cB + 12, v: { x: -0.9, y: -0.3 } }, { f: cB + 22, v: { x: 0.9, y: -0.2 } }, { f: cB + 30, v: { x: 0.1, y: -0.8 } }],
          giros: [{ f: 0, v: 0 }, { f: cB + 12, v: -0.5 }, { f: cB + 22, v: 0.5 }, { f: cB + 30, v: 0 }] })} hud={<Hud2 />} />
      <Desarma x={fp.x} y={fp.y} desde={k15(70.75)} dur={44} capas={[[0, 420, 0], [420, 760, 0.45], [760, 1080, 0.8]]} />
      <Lienzo><defs><radialGradient id="iris15"><stop offset="0.7" stopColor="#fff2d0" /><stop offset="1" stopColor="#fff2d0" stopOpacity={0} /></radialGradient></defs><circle cx={fp.x} cy={fp.y} r={r} fill="url(#iris15)" /></Lienzo>
      {f >= cB && <Placa texto="THE LAUNDROMAT DISAPPEARS" x={960} y={140} desde={k15(70.75)} hasta={k15(72.2)} tam={42} />}
    </>
  );
};
// ---------- 16 · Kapilavastu, al pie del Himalaya · «2,500 years ago» = línea de tiempo que viaja de hoy al pasado ----------
export const Q16Kapila: React.FC = () => {
  const f = useF();
  const LT = 46; // v4: «2,500» cae en 75.4 s = cuadro 82; el cursor llega al pasado en el cuadro LT+42 = 88 → legible ~2 s antes del corte
  return (
    <>
      <Kap cl={[mira(0, 1500, 650, 1.38), mira(147, 1300, 650, 1.5, { curva: "inout" })]} sp={{ flores: 0.6 }}
        medio={<>
          <Elefante x={interpolate(f, [0, 147], [2150, 1720])} piso={KP} dir={-1} s={0.95} paso={f / 34} />
          <A look={ALDEANO} seed={47} ruta={[{ f: 0, x: 1980, y: KP }, { f: 60, x: 1880, y: KP }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 30, cD: 20 } }, { f: 20, v: { hD: 150, cD: 30, hI: 20, cI: 20 } }, { f: 40, v: { hD: 120, cD: 50, hI: 20, cI: 20 } }, { f: 60, v: { hD: 150, cD: 30, hI: 20, cI: 20 } }]} caras={[{ f: 0, v: "risa" }]} miradas={[{ f: 0, v: { x: -0.9, y: -0.1 } }]} />
          <A look={ALDEANA} seed={46} ruta={[{ f: 0, x: 860, y: KP }, { f: 147, x: 1330, y: KP, curva: "lineal" }]} poses={[{ f: 0, v: { hD: 160, cD: 20 } }]} enManoD={<Recto ang={180}><g transform="translate(0,-26)"><path d="M-20,0 Q-24,-36 0,-40 Q24,-36 20,0 Z" fill="#c8703a" stroke="#6a3a1a" strokeWidth={3} /></g></Recto>} caras={[{ f: 0, v: "feliz" }]} ajuste={(p) => ({ ...p, hD: 160, cD: 20 })} />
          <A look={ALDEANO} seed={48} escala={ESC * 0.72} ruta={[{ f: 0, x: 1650, y: KP }, { f: 147, x: 1020, y: KP, curva: "lineal" }]} correr={0.7} caras={[{ f: 0, v: "risa" }]} />
        </>}
        frente={<A look={ALDEANA} seed={52} escala={ESC * 1.75} ruta={[{ f: 0, x: 2300, y: KP + 170 }, { f: 64, x: 560, y: KP + 170, curva: "lineal" }]} opacidad={(fr: number) => (fr > 66 ? 0 : 1)} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 160, cD: 20 } }]} ajuste={(p) => ({ ...p, hD: 160, cD: 20 })}
          enManoD={<Recto ang={180}><g transform="translate(0,-26)"><path d="M-20,0 Q-24,-36 0,-40 Q24,-36 20,0 Z" fill="#c8703a" stroke="#6a3a1a" strokeWidth={3} /></g></Recto>} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.3, y: 0.2 } }]} />}
        hud={<Rotulo texto="KAPILAVASTU · FOOT OF THE HIMALAYAS" desde={8} hasta={LT + 12} />} />
      <Velo desde={LT} o={0.62} />
      <div style={{ position: "absolute", inset: 0, transform: "scale(1.3)", transformOrigin: "960px 540px" }}>
        <LineaTiempo y={560} desde={LT} paso={10} viaje={16} espacio={760} x0={360} ancho={1240} acento="#ffd38a"
          eventos={[{ año: "TODAY", texto: "New York" }, { año: "2,500 YEARS AGO", texto: "Kapilavastu", color: "#ffd38a" }]} />
      </div>
    </>
  );
};
// rey en el trono (sala)
const Rey: React.FC<{ o?: object }> = ({ o = {} }) => <A look={REY} seed={31} ruta={[{ f: 0, x: K.trono, y: KP }]} asiento={[{ f: 0, v: 56 }]} poses={[{ f: 0, v: SENTADO }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }]} {...o} />;
// ---------- 17 · un rey llamado Suddhodana acaba de tener un hijo: se para del trono y lo alza; la corte festeja ----------
export const Q17Rey: React.FC = () => {
  const f = useF();
  return (
    <>
      <Kap cl={[mira(0, K.trono - 30, 700, 2.5), mira(40, K.trono - 50, 680, 2.3), mira(68, K.trono - 60, 590, 1.5, { curva: "inout", rot: 3 }), mira(93, K.trono - 60, 585, 1.6, { rot: 3 })]}
        medio={<>
          <A look={ALDEANA} seed={49} ruta={[{ f: 0, x: K.trono - 470, y: KP }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 30, cD: 30, hI: 30, cI: 30 } }, ...ciclo({ hD: 70, cD: 70, hI: 60, cI: 80 }, { hD: 60, cD: 40, hI: 50, cI: 40 }, 8, 93, 50)]} caras={[{ f: 0, v: "feliz" }, { f: 50, v: "risa" }]} miradas={[{ f: 0, v: { x: 0.9, y: -0.2 } }]} />
          <A look={ALDEANO} seed={50} ruta={[{ f: 0, x: K.trono + 330, y: KP }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 20, cD: 20 } }, { f: 64, v: { hD: 160, cD: 20, hI: 160, cI: 20 } }, { f: 76, v: { hD: 140, cD: 40, hI: 140, cI: 40 } }, { f: 88, v: { hD: 160, cD: 20, hI: 160, cI: 20 } }]} caras={[{ f: 0, v: "sorpresa" }, { f: 60, v: "risa" }]} miradas={[{ f: 0, v: { x: -0.9, y: -0.3 } }]} />
          <A look={REY} seed={31} ruta={[{ f: 0, x: K.trono - 30, y: KP }]} asiento={[{ f: 0, v: 56 }, { f: 14, v: undefined }]} dir={[{ f: 0, v: -1 }]}
            poses={[{ f: 0, v: { ...SENTADO, hD: 60, cD: 80, hI: 50, cI: 90 } }, { f: 16, v: { hD: 60, cD: 80, hI: 50, cI: 90 } }, { f: 32, v: { hD: 60, cD: 80, hI: 50, cI: 90 } }, { f: 44, v: { hD: 150, cD: 20, hI: 150, cI: 20, cabeza: -14, tronco: -8 } }, { f: 80, v: { hD: 160, cD: 10, hI: 160, cI: 10, cabeza: -16, tronco: -10 } }]}
            caras={[{ f: 0, v: "feliz" }, { f: 44, v: "risa" }]} miradas={[{ f: 0, v: { x: -0.6, y: 0.5 } }, { f: 44, v: { x: -0.1, y: -0.9 } }]}
            enManoD={(fr: number) => <Recto ang={interpolate(fr, [32, 44], [120, 170], cl)} dy={-20}><BebeAlzado s={1.55} f={fr} /></Recto>} />
        </>}
        hud={<><Pildora texto="KING SUDDHODANA" x={960} y={110} desde={10} color="#ffe2a6" tam={40} /><Pildora texto="A SON!" x={1500} y={330} desde={68} tam={72} color="#ffd38a" /></>} />
      <Petalos f={f} desde={66} />
    </>
  );
};
// ---------- 18 · un bebé hermoso. Le dicen Siddhartha ----------
export const Q18Bebe: React.FC = () => {
  const f = useF();
  const b = lerp(f, 8, 34, 0, 1);
  return (
    <Kap cl={[mira(0, K.cuna + 40, 690, 2.3), mira(84, K.cuna + 40, 700, 2.55, { curva: "inout" })]}
      medio={<>
        <BebeVivo x={K.cuna} piso={KP} brazo={b} ojos={f > 30 ? 1 : 0} />
        <A look={ALDEANA} seed={49} ruta={[{ f: 0, x: K.cuna + 175, y: KP }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { tronco: 28, cabeza: 14, hD: 74, cD: 6, hI: 20, cI: 30 } }]} caras={[{ f: 0, v: "feliz" }, { f: 36, v: "risa" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.6 } }]} />
      </>}
      hud={<TextoMano texto="Siddhartha" x={960} y={150} desde={44} tam={110} color="#fff2c8" rot={0} brillo={false} centro />} />
  );
};
// ---------- 19 · al séptimo día un viejo sabio mira al bebé… y se pone a llorar ----------
// v3: 3 planos — A) general con el rey ENTERO en el trono y Asita entrando por la izquierda; B) «looks at the baby»: plano cerrado de Asita
// inclinado sobre la cuna; C) «starts to cry»: primer plano de Asita llorando con las manos a la cara, lágrimas que caen.
const k19 = kDe(83.48);
export const Q19Asita: React.FC = () => {
  const f = useF();
  const cB = k19(87.7), cC = k19(88.75);
  const cl = f < cB ? [mira(0, -770, 640, 1.4), mira(cB, -820, 640, 1.5, { curva: "inout" })]
    : f < cC ? [mira(cB, K.cuna - 90, 650, 2.5), mira(cC, K.cuna - 95, 650, 2.6)]
    : [mira(cC, K.cuna - 165, 680, 2.9), mira(213, K.cuna - 165, 680, 3.0)];
  return (
    <Kap cl={cl}
      medio={<>
        <BebeVivo x={K.cuna} piso={KP} brazo={0.3 + 0.2 * Math.sin(f / 9)} ojos={1} />
        <Rey o={{ poses: [{ f: 0, v: SENTADO }, { f: k19(85.5), v: { ...SENTADO, hD: 60, cD: 60, tronco: 6 } }], caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }] }} />
        <A look={ASITA} seed={32} ruta={[{ f: 0, x: -1290, y: KP }, { f: k19(87.4), x: K.cuna - 190, y: KP }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: "parado" }, { f: k19(87.5), v: { tronco: 22, cabeza: 18, hD: 40, cD: 40, hI: 30, cI: 30 } }, { f: k19(88.4), v: { tronco: 26, cabeza: 22, hD: 50, cD: 50, hI: 40, cI: 40 } },
            { f: cC + 2, v: { hD: 40, cD: 150, hI: 30, cI: 100, cabeza: 10, tronco: 8 } }, { f: cC + 30, v: { hD: 46, cD: 140, hI: 36, cI: 110, cabeza: 14, tronco: 12 } }, { f: cC + 50, v: { hD: 40, cD: 150, hI: 30, cI: 100, cabeza: 8, tronco: 6 } }]}
          caras={[{ f: 0, v: "feliz" }, { f: k19(87.9), v: "duda" }, { f: cC, v: "triste" }]} miradas={[{ f: 0, v: { x: 0.9, y: 0 } }, { f: k19(87.5), v: { x: 0.5, y: 0.9 } }]} />
        <Lagrimas x={K.cuna - 172} y={KP - 262} f={f} desde={cC + 2} dx={20} />
      </>}
      hud={<>{f < cB && <Placa texto="DAY 7 · THE SAGE ASITA" x={960} y={110} desde={8} tam={40} color="#ffe2a6" />}
        {f >= cB && f < cC && <Placa texto="HE LOOKS AT THE BABY" x={960} y={110} desde={cB + 2} tam={40} />}
        {f >= cC && <Placa texto="…AND STARTS TO CRY" x={960} y={110} desde={cC + 2} tam={44} color="#bfe6ff" />}</>} />
  );
};
// ---------- 20 · «why are you crying? is something wrong with my son?» ----------
const k20 = kDe(90.56);
// v3: A) el rey SALTA del trono y CORRE hacia Asita (la cámara lo acompaña); B) dos-tiros cerrado: le AGARRA el hombro a Asita,
// lo sacude con la pregunta y en «my son» SEÑALA la cuna con la otra mano.
export const Q20PorQue: React.FC = () => {
  const f = useF();
  const cB = k20(91.55), hijo = k20(94.0);
  const AGARRA = { hD: 72, cD: 14, hI: 40, cI: 40, tronco: 8, cabeza: 4 }, AGARRA_B = { ...AGARRA, hD: 66, cD: 22, tronco: 13, cabeza: 8 };
  const cl = f < cB ? [mira(0, -480, 620, 1.35), mira(cB, -820, 620, 1.55, { curva: "inout" })] : [mira(cB, K.cuna - 120, 660, 2.25), mira(140, K.cuna - 120, 660, 2.4)];
  return (
    <Kap cl={cl}
      medio={<>
        <BebeVivo x={K.cuna} piso={KP} brazo={0.3} ojos={1} />
        <A look={ASITA} seed={32} ruta={[{ f: 0, x: K.cuna - 190, y: KP }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: { hD: 40, cD: 150, hI: 30, cI: 100, cabeza: 10, tronco: 8 } }, { f: cB + 6, v: { hD: 30, cD: 60, hI: 20, cI: 40, cabeza: 0, tronco: -6 } }, ...ciclo({ hD: 30, cD: 60, hI: 20, cI: 40, cabeza: 0, tronco: -6 }, { hD: 30, cD: 60, hI: 20, cI: 40, cabeza: 4, tronco: -2 }, 6, k20(93.0), cB + 12)]}
          caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: { x: 0.4, y: 0.6 } }, { f: 20, v: { x: 0.9, y: 0 } }]} />
        <Lagrimas x={K.cuna - 172} y={KP - 262} f={f} desde={0} dx={20} />
        <A look={REY} seed={31} ruta={[{ f: 0, x: K.trono, y: KP }, { f: 6, x: K.trono, y: KP }, { f: cB - 2, x: K.cuna - 20, y: KP }]} correr={1} asiento={[{ f: 0, v: 56 }, { f: 5, v: undefined }]} dir={[{ f: 0, v: -1 }, { f: hijo + 2, v: 1 }]}
          caras={[{ f: 0, v: "sorpresa" }, { f: 10, v: "miedo" }]} habla={[[0, k20(91.0)], [k20(92.98), k20(94.96)]]} miradas={[{ f: 0, v: { x: -0.9, y: 0 } }, { f: hijo, v: { x: 0.5, y: 0.8 } }]}
          poses={[{ f: 0, v: SENTADO }, { f: 6, v: { hD: 120, cD: 40, hI: 110, cI: 40, tronco: 14 } }, { f: cB, v: AGARRA }, ...ciclo(AGARRA, AGARRA_B, 6, hijo, cB + 4),
            { f: hijo + 4, v: { hD: 55, cD: 0, hI: 30, cI: 30, tronco: 2, cabeza: 14 } }, { f: 140, v: { hD: 58, cD: 0, hI: 30, cI: 30, tronco: 0, cabeza: 8 } }]} />
      </>}
      hud={<>{f >= cB && <Placa texto="«WHY ARE YOU CRYING?»" x={960} y={110} desde={cB} hasta={k20(92.9)} tam={42} />}
        <Placa texto="«…MY SON?»" x={960} y={110} desde={hijo} tam={50} color="#ffd38a" /></>} />
  );
};
// ---------- 21 · «nothing is wrong… one of two things: a king of the whole world, or a holy man» ----------
const k21 = kDe(95.22);
export const Q21DosCosas: React.FC = () => {
  const f = useF();
  return (
    <Kap cl={[mira(0, K.cuna - 120, 560, 1.4), mira(268, K.cuna - 140, 560, 1.32, { curva: "inout" })]}
      medio={<><BebeVivo x={K.cuna} piso={KP} brazo={0.2} ojos={1} /><A look={ASITA} seed={32} ruta={[{ f: 0, x: K.cuna - 190, y: KP }]} dir={[{ f: 0, v: 1 }, { f: k21(98.4), v: -1 }, { f: k21(101.3), v: 1 }]}
        poses={[{ f: 0, v: { hD: 40, cD: 30, hI: 20, cI: 20 } }, { f: k21(98.5), v: { hD: 145, cD: 15, hI: 20, cI: 20, cabeza: -10 } }, { f: k21(101.4), v: { hD: 145, cD: 15, hI: 20, cI: 20, cabeza: -10 } }]}
        caras={[{ f: 0, v: "triste" }, { f: 40, v: "neutral" }, { f: k21(101.4), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.9, y: 0 } }, { f: k21(98.5), v: { x: 0.6, y: -0.7 } }]} habla={[[k21(95.3), k21(96.4)], [k21(97.6), k21(103.6)]]} /></>}
      hud={<><Etiqueta texto="ONE OF TWO THINGS" x={960} y={120} desde={k21(97.6)} hasta={k21(98.8)} tam={52} color="#fff2c8" />
        {f >= k21(98.6) && <><Velo desde={k21(98.6)} /><Comparacion x={960} y={590} w={540} h={540} desde={k21(98.7)} vs="OR"
          izq={{ titulo: "KING OF THE WORLD", color: "#e0b040", contenido: <g transform="translate(270,230) scale(1.05)">
            <circle cx={0} cy={-10} r={110} fill="#7ab8c8" stroke="#3a6a7a" strokeWidth={5} /><path d="M-80,-50 Q-30,-80 10,-40 Q40,-10 80,-40 M-90,30 Q-20,10 20,50 Q60,70 90,30" stroke="#6a9a4a" strokeWidth={22} fill="none" strokeLinecap="round" />
            <g transform={`translate(0,${-130 + Math.sin(f / 8) * 4})`}><path d="M-80,30 L-60,-40 L-30,0 L0,-60 L30,0 L60,-40 L80,30 Z" fill="#e0b040" stroke="#8a5a2a" strokeWidth={5} />{[-50, 0, 50].map((d) => <circle key={d} cx={d} cy={18} r={9} fill="#c8403a" />)}</g></g> }}
          der={{ titulo: "A HOLY MAN", color: "#e07a2c", contenido: <g transform="translate(270,230) scale(1.15)">
            <circle cx={0} cy={-30} r={120} fill="#ffe2a6" opacity={0.7} /><circle cx={0} cy={-60} r={34} fill="#d9a273" stroke="#2a2622" strokeWidth={4} />
            <path d="M-60,80 Q-60,-10 0,-20 Q60,-10 60,80 Z" fill="#e07a2c" stroke="#2a2622" strokeWidth={4} />
            <g transform="translate(0,60)"><path d="M-44,-8 Q-40,30 0,34 Q40,30 44,-8 Z" fill="#5a3a24" /><ellipse cx={0} cy={-8} rx={44} ry={10} fill="#3a2414" /></g></g> }} /></>}</>} />
  );
};
// ---------- 22 · «if he ever sees the suffering of this world, he will walk away from your throne» ----------
const k22 = kDe(104.18);
export const Q22Sufrimiento: React.FC = () => {
  const f = useF();
  const cambio = k22(106.4);
  return f < cambio
    ? <Kap cl={[mira(0, K.trono - 180, 620, 2.0), mira(cambio, K.trono - 120, 610, 2.2)]}
      medio={<A look={REY} seed={31} ruta={[{ f: 0, x: K.trono - 260, y: KP }, { f: 50, x: K.trono - 70, y: KP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "miedo" }]} miradas={[{ f: 0, v: { x: -0.9, y: 0.1 } }]}
        poses={[{ f: 0, v: { hD: 30, cD: 60, hI: 30, cI: 60 } }, { f: 50, v: { hD: 60, cD: 20, hI: -40, cI: 10, tronco: -10, cabeza: -6 } }]} />}
      hud={<Etiqueta texto="THE SUFFERING OF THIS WORLD" x={960} y={140} desde={10} tam={46} color="#fff2c8" />} />
    : <Kap cl={[mira(cambio, 2470, 640, 2.0), mira(cambio + 76, 2740, 630, 2.2, { curva: "inout" })]} sp={{ noche: true, portonAbierto: 1 }}
      medio={<A look={SIDDHARTHA} seed={30} luz={rimOro} ruta={[{ f: cambio, x: 2300, y: KP }, { f: cambio + 76, x: 2820, y: KP, curva: "lineal" }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: cambio + 40, v: "triste" }]} miradas={[{ f: 0, v: { x: 0.9, y: 0 } }, { f: cambio + 30, v: { x: -0.6, y: -0.1 } }, { f: cambio + 48, v: { x: 0.9, y: 0 } }]} opacidad={(fr) => interpolate(fr, [cambio + 64, cambio + 76], [1, 0], cl)} />}
      hud={<Etiqueta texto="HE WILL WALK AWAY" x={960} y={140} desde={6} tam={50} color="#fff2c8" />} />;
};
// ---------- 23 · el rey decide: su hijo nunca verá sufrimiento ----------
const k23 = kDe(108.96);
// v3: CONTRAPICADO nuevo (cámara baja e inclinada, el rey de cuerpo entero domina el cuadro, la cuna chica al fondo): el rey camina,
// se planta y en «decision» golpea el puño contra la palma (sacudón + destello); después «NEVER · SEE · SUFFERING» con placa, cada palabra con un golpe del dedo.
const PUNO_A = { hD: 80, cD: 100, hI: 70, cI: 70, tronco: -4, cabeza: -6 }, PUNO_B = { hD: 70, cD: 70, hI: 70, cI: 70, tronco: 6, cabeza: 4 };
const SENALA = { hD: 95, cD: 10, hI: 40, cI: 60, tronco: 6, cabeza: 0 }, SENALA_B = { hD: 80, cD: 20, hI: 40, cI: 60, tronco: 10, cabeza: 4 };
export const Q23Decision: React.FC = () => {
  const f = useF();
  const g = k23(109.85);
  const flash = f >= g ? Math.exp(-(f - g) / 4) : 0;
  return (
    <Sacude f0={[g, k23(111.45), k23(111.69), k23(112.0)]} amp={8}>
      <Kap cl={[mira(0, K.trono - 160, 700, 1.5, { rot: -6 }), mira(k23(111.4) - 1, K.trono - 145, 692, 1.68, { rot: -6, curva: "inout" }), mira(k23(111.4), K.trono - 60, 760, 2.9), mira(k23(112.0) - 1, K.trono - 62, 758, 3.0), mira(k23(112.0), K.trono - 330, 640, 1.15, { rot: 3 }), mira(141, K.trono - 300, 645, 1.25, { rot: 3, curva: "inout" })]}
        medio={<A look={REY} seed={31} ruta={[{ f: 0, x: K.trono - 330, y: KP }, { f: 26, x: K.trono - 130, y: KP }]} dir={[{ f: 0, v: 1 }, { f: 30, v: -1 }]}
          caras={[{ f: 0, v: "duda" }, { f: 24, v: "determinado" }, { f: g, v: "enojo" }]} miradas={[{ f: 0, v: { x: 0.5, y: 0.4 } }, { f: 30, v: { x: -0.4, y: -0.2 } }]} habla={[[k23(110.85), k23(113.2)]]}
          poses={[{ f: 0, v: "pensar" }, { f: 28, v: PUNO_A }, { f: g - 4, v: { ...PUNO_A, hD: 110, cD: 120 } }, { f: g, v: PUNO_B }, { f: k23(111.2), v: PUNO_B },
            { f: k23(111.45), v: SENALA }, { f: k23(111.6), v: SENALA_B }, { f: k23(111.7), v: SENALA }, { f: k23(111.9), v: SENALA_B }, { f: k23(112.05), v: SENALA }, { f: k23(113.0), v: { ...SENALA, hD: 60, cD: 30 } }]} />}
        hud={<>
          {flash > 0.02 && <Lienzo><circle cx={960} cy={540} r={260 + (1 - flash) * 300} fill="none" stroke="#fff2c8" strokeWidth={22 * flash} opacity={flash} /></Lienzo>}
          <Placa texto="A DECISION" x={960} y={160} desde={g} hasta={k23(111.3)} tam={60} color="#ffd38a" />
          <Placa texto="NEVER." x={560} y={160} desde={k23(111.45)} tam={60} />
          <Placa texto="SEE." x={900} y={160} desde={k23(111.69)} tam={60} />
          <Placa texto="SUFFERING." x={1300} y={160} desde={k23(112.0)} tam={60} color="#ffb060" /></>} />
    </Sacude>
  );
};
// ---------- 24 · tres palacios: verano, invierno, lluvias ----------
export const Q24TresPalacios: React.FC = () => {
  return (
    <Kap cl={[mira(0, 1000, 420, 0.62), mira(160, 1500, 430, 0.68, { curva: "inout" })]} sp={{ flores: 0.3 }}
      hud={<><Velo /><Mapa x={960} y={580} w={1180} h={680} desde={0} dur={110} titulo="THREE PALACES" acento="#c8403a" seed={5}
        viajero={<g transform="scale(0.32) translate(0,-60)"><MiniPalacio /></g>}
        puntos={[{ x: 200, y: 470, rotulo: "SUMMER" }, { x: 600, y: 230, rotulo: "WINTER" }, { x: 980, y: 460, rotulo: "RAINY SEASON" }]} /></>} />
  );
};
// ---------- 25 · músicos día y noche; flores; los jardineros sacan cada flor muerta antes del alba ----------
const k25 = kDe(119.01);
export const Q25Musicos: React.FC = () => {
  const f = useF();
  const arr = lerp(f, k25(123.6), k25(124.0), 0, 1);
  return (
    <Kap cl={[mira(0, 1420, 640, 1.45), mira(k25(123.0) - 1, 1470, 640, 1.5), mira(k25(123.0), K.flores + 110, 650, 1.75), mira(213, K.flores + 120, 650, 1.9)]} sp={{ flores: 0.8 }}
      medio={<>
        <Musico x={1180} inst="sitar" seed={41} />
        <Musico x={1420} inst="tambor" seed={42} look={ALDEANA} per={9} />
        <Musico x={1660} inst="flauta" seed={43} />
        <FlorMarchita x={K.flores + 190} piso={KP} arrancada={arr} />
        <A look={ALDEANO} seed={44} ruta={[{ f: 0, x: K.flores - 20, y: KP }, { f: k25(123.0), x: K.flores + 90, y: KP }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: { tronco: 30, cabeza: 10, hD: 60, cD: 40, hI: 20, cI: 30 } }, { f: k25(123.3), v: { tronco: 36, cabeza: 14, hD: 80, cD: 10, hI: 20, cI: 30 } }, { f: k25(124.0), v: { tronco: 4, cabeza: -4, hD: 20, cD: 30, hI: -60, cI: 40 } }]}
          enManoD={(fr: number) => (fr >= k25(123.6) && fr < k25(124.3) ? <FlorMuertaMano /> : null)} enManoI={(fr: number) => (fr >= k25(124.3) ? <FlorMuertaMano /> : null)}
          caras={[{ f: 0, v: "neutral" }, { f: k25(124.2), v: "duda" }]} miradas={[{ f: 0, v: { x: 0.7, y: 0.6 } }, { f: k25(124.3), v: { x: -0.8, y: 0 } }]} />
      </>}
      hud={<><Pildora texto="MUSIC · DAY AND NIGHT" x={960} y={80} desde={10} hasta={k25(123)} tam={44} color="#fff2c8" /><Pildora texto="EVERY DEAD FLOWER · GONE BEFORE DAWN" x={960} y={80} desde={k25(124.2)} tam={40} color="#fff2c8" /></>} />
  );
};
// ---------- 26 · ni sirvientes viejos ni enfermos ----------
export const Q26SinViejos: React.FC = () => {
  const f = useF();
  const fila = (t: string, i: number, ok: boolean, d: number) => (
    <g key={t + i} transform={`translate(1360,${330 + i * 74})`} opacity={lerp(f, d - 6, d, 0, 1)}>
      <TxtSvg x={0} y={0} t={t} tam={40} color="#3a2414" anchor="start" mano />
      <TxtSvg x={300} y={0} t={ok ? "✓" : "✗"} tam={46} color={ok ? "#4a8a3a" : "#c8403a"} />
      {!ok && <line x1={-10} y1={-14} x2={-10 + 250 * lerp(f, d, d + 8, 0, 1)} y2={-14} stroke="#c8403a" strokeWidth={6} />}
    </g>
  );
  return (
    <Kap cl={[mira(0, 1100, 600, 1.25), mira(79, 1140, 600, 1.32)]} sp={{ flores: 0.5 }}
      medio={<>
        <A look={ALDEANA} seed={50} ruta={[{ f: 0, x: 700, y: KP }, { f: 79, x: 1040, y: KP, curva: "lineal" }]} poses={[{ f: 0, v: { hD: 80, cD: 20 } }]} caras={[{ f: 0, v: "feliz" }]} enManoD={<Recto ang={100}><Bandeja /></Recto>} ajuste={(p) => ({ ...p, hD: 80, cD: 20 })} />
        <A look={ALDEANO} seed={51} ruta={[{ f: 0, x: 1500, y: KP }, { f: 79, x: 1220, y: KP, curva: "lineal" }]} poses={[{ f: 0, v: { hD: 80, cD: 20 } }]} caras={[{ f: 0, v: "feliz" }]} enManoD={<Recto ang={100}><Bandeja /></Recto>} ajuste={(p) => ({ ...p, hD: 80, cD: 20 })} />
        <A look={ALDEANA} seed={52} escala={ESC * 0.95} ruta={[{ f: 0, x: 880, y: KP }]} dir={[{ f: 0, v: 1 }]} poses={ciclo({ tronco: 30, hD: 80, cD: 30 }, { tronco: 34, hD: 60, cD: 50 }, 16, 79)} caras={[{ f: 0, v: "feliz" }]} />
      </>}
      hud={<Lienzo>
        <rect x={1300} y={230} width={420} height={380} rx={20} fill="#f4e4c0" stroke="#8a5a2a" strokeWidth={6} opacity={lerp(f, 0, 6, 0, 1)} />
        <TxtSvg x={1510} y={280} t="PALACE SERVANTS" tam={32} color="#5a3418" o={lerp(f, 0, 6, 0, 1)} />
        {fila("young", 0, true, 6)}{fila("young", 1, true, 12)}{fila("old", 2, false, 22)}{fila("sick", 3, false, 40)}
      </Lienzo>} />
  );
};
// ---------- 27 · si alguien envejecía o enfermaba, desaparecía del palacio de noche ----------
export const Q27Noche: React.FC = () => {
  const f = useF();
  const ab = interpolate(f, [118, 150], [1, 0], cl);
  return (
    <Kap cl={[mira(0, 2620, 590, 1.35), mira(159, 2860, 600, 1.2, { curva: "inout" })]} sp={{ noche: true, portonAbierto: ab }}
      medio={<>
        <A look={VIEJO} seed={53} ruta={[{ f: 0, x: 2450, y: KP }, { f: 60, x: 2700, y: KP }, { f: 100, x: 2700, y: KP }, { f: 140, x: 3040, y: KP }]} dir={[{ f: 0, v: 1 }, { f: 64, v: -1 }, { f: 100, v: 1 }]}
          poses={[{ f: 0, v: { tronco: 10, cabeza: 10, hD: 10, cD: 10, hI: 10, cI: 10 } }]} caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: { x: 0.6, y: 0.4 } }, { f: 64, v: { x: 0.9, y: -0.2 } }]} opacidad={(fr) => interpolate(fr, [118, 136], [1, 0], cl)} />
        <A look={ALDEANO} seed={54} ruta={[{ f: 0, x: 2290, y: KP }, { f: 60, x: 2540, y: KP }, { f: 100, x: 2540, y: KP }, { f: 140, x: 2880, y: KP }]} poses={[{ f: 0, v: { hD: 80, cD: 20 } }, { f: 64, v: { hD: 30, cD: 20 } }, { f: 100, v: { hD: 80, cD: 20 } }]} caras={[{ f: 0, v: "neutral" }]} ajuste={(p, fr) => (fr > 100 || fr < 60 ? { ...p, hD: 80, cD: 20 } : p)} />
      </>}
      hud={<Etiqueta texto="GONE BY MORNING" x={960} y={140} desde={110} tam={48} color="#f4efe6" />} />
  );
};
// ---------- 28 · Siddhartha crece entre caras jóvenes (juega con amigos) · música (sitar y tambor) · jardines perfectos (florecen) ----------
// v3: Siddhartha AL CENTRO crece A SALTOS (cada «AGE» lo agranda con un pop), los dos amigos SEPARADOS a los lados se pasan una pelota
// por encima de él (nadie se pisa); flores que brotan en «perfect gardens».
const escalon = (f: number, pasos: [number, number][]) => { let v = pasos[0][1]; for (let i = 1; i < pasos.length; i++) v = lerp(f, pasos[i][0], pasos[i][0] + 6, v, pasos[i][1]); return v; };
const JUEGA_A = { hD: 150, cD: 30, hI: 150, cI: 30, tronco: 0, cabeza: -6 }, JUEGA_B = { hD: 40, cD: 60, hI: 40, cI: 60, tronco: 4, cabeza: 4 };
export const Q28Crece: React.FC = () => {
  const f = useF();
  const e = escalon(f, [[0, 0.7], [30, 0.82], [80, 0.92], [120, 1.04]]);
  const flor = lerp(f, 100, 130, 0, 1); // «perfect gardens» 137.6 s = cuadro 107
  // pelota: va de un amigo al otro cada 30 cuadros pasando por arriba de Siddhartha
  const ciclo30 = (f % 30) / 30, ida = Math.floor(f / 30) % 2 === 0;
  const bx = ida ? lerp(ciclo30, 0, 1, 1160, 1720) : lerp(ciclo30, 0, 1, 1720, 1160);
  const by = KP - 300 * e - Math.sin(ciclo30 * Math.PI) * 260;
  return (
    <Kap cl={[mira(0, 1440, 640, 1.55), mira(150, 1440, 625, 1.62, { curva: "inout" })]} sp={{ flores: 0.5 + flor * 0.5 }}
      medio={<>
        <Musico x={930} inst="sitar" seed={60} look={ALDEANA} />
        <Musico x={1990} inst="tambor" seed={61} dir={-1} per={9} />
        {f >= 60 && <><Notas x={950} y={KP - 330} f={f} /><Notas x={1970} y={KP - 320} f={f + 30} color="#ffd38a" /></>}
        {[1080, 1290, 1600, 1830].map((x, k) => <g key={x} transform={`translate(${x},${KP - 4}) scale(${1.7 * suave(lerp(f, 104 + k * 5, 118 + k * 5, 0, 1))})`}><path d="M0,0 L0,-60" stroke="#4a8a3a" strokeWidth={6} /><circle cy={-66} r={18} fill={["#e85a6a", "#f2c14a", "#fff2c8", "#e8833a"][k]} /><circle cy={-66} r={7} fill="#7a4a1a" /></g>)}
        <A look={ALDEANO} seed={62} escala={ESC * e * 0.95} ruta={[{ f: 0, x: 1160, y: KP }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "risa" }]}
          poses={ciclo(JUEGA_A, JUEGA_B, 30, 150, 0)} miradas={[{ f: 0, v: { x: 0.8, y: -0.5 } }]} />
        <A look={ALDEANA} seed={63} escala={ESC * e * 0.93} ruta={[{ f: 0, x: 1720, y: KP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "risa" }]}
          poses={ciclo(JUEGA_B, JUEGA_A, 30, 150, 0)} miradas={[{ f: 0, v: { x: -0.8, y: -0.5 } }]} />
        <A look={SIDDHARTHA} seed={30} escala={ESC * e} ruta={[{ f: 0, x: 1440, y: KP }]} caras={[{ f: 0, v: "risa" }, { f: 90, v: "feliz" }]}
          poses={ciclo({ hD: 130, cD: 40, hI: 130, cI: 40, cabeza: -10 }, { hD: 60, cD: 40, hI: 60, cI: 40, cabeza: 0 }, 15, 150, 0)} miradas={[{ f: 0, v: { x: ida ? 0.6 : -0.6, y: -0.8 } }]} />
        <circle cx={bx} cy={by} r={20} fill="#e85a3a" stroke="#7a2a1a" strokeWidth={4} />
      </>}
      hud={<><Contador x={90} y={200} alinear="der" tam={54} lineas={[{ etiqueta: "AGE", claves: [{ f: 0, v: 6 }, { f: 30, v: 10, d: 6 }, { f: 80, v: 15, d: 6 }, { f: 120, v: 19, d: 6 }], color: "#ffd38a" }]} />
        <Placa texto="YOUNG FACES" x={420} y={110} desde={20} tam={34} />
        <Placa texto="BEAUTIFUL MUSIC" x={960} y={110} desde={74} tam={34} />
        <Placa texto="PERFECT GARDENS" x={1500} y={110} desde={106} tam={34} /></>} />
  );
};
// ---------- 29 · se casa con una princesa; tiene todo lo que un hombre puede querer ----------
export const Q29Princesa: React.FC = () => {
  const f = useF();
  const SX = 1240;
  return (
    <Kap cl={[mira(0, 1320, 590, 1.45), mira(110, 1320, 600, 1.65, { curva: "inout" })]} sp={{ flores: 1 }}
      medio={<>
        <GuirnaldaColgante x0={760} x1={1880} y={420} caida={lerp(f, 0, 24, 0, 1)} f={f} />
        <A look={ALDEANO} seed={64} ruta={[{ f: 0, x: 960, y: KP }]} dir={[{ f: 0, v: 1 }]} poses={ciclo({ hD: 70, cD: 70, hI: 60, cI: 80 }, { hD: 60, cD: 40, hI: 50, cI: 40 }, 9, 110, 60)} caras={[{ f: 0, v: "risa" }]} />
        <A look={ALDEANA} seed={65} ruta={[{ f: 0, x: 1700, y: KP }]} dir={[{ f: 0, v: -1 }]} poses={ciclo({ hD: 70, cD: 70, hI: 60, cI: 80 }, { hD: 60, cD: 40, hI: 50, cI: 40 }, 8, 110, 62)} caras={[{ f: 0, v: "risa" }]} />
        <A look={SIDDHARTHA} seed={30} ruta={[{ f: 0, x: SX, y: KP }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "feliz" }, { f: 60, v: "risa" }]} poses={[{ f: 0, v: { hD: 30, cD: 30, cabeza: 4 } }, { f: 44, v: { hD: 20, cD: 20, cabeza: 10, tronco: 8 } }, { f: 66, v: { hD: 30, cD: 30 } }]} />
        {f >= 64 && <g transform={`translate(${SX + 4},${KP - 210})`}><Guirnalda s={1.1} r={30} /></g>}
        <A look={PRINCESA} seed={33} ruta={[{ f: 0, x: SX + 165, y: KP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }]} poses={[{ f: 0, v: { hD: 60, cD: 50, hI: 40, cI: 40 } }, { f: 36, v: { hD: 150, cD: 30, hI: 40, cI: 40 } }, { f: 64, v: { hD: 40, cD: 40, hI: 40, cI: 40 } }]}
          enManoD={(fr: number) => (fr < 64 ? <Recto ang={fr < 36 ? 110 : 180}><g transform="translate(0,6)"><Guirnalda s={0.9} r={28} /></g></Recto> : null)} />
      </>}
      hud={<Etiqueta texto="EVERYTHING A MAN COULD WANT" x={960} y={140} desde={70} tam={44} color="#fff2c8" />} />
  );
};
// ---------- 30 · y se aburría. Hondo, raro. Y no sabía por qué ----------
export const Q30Aburrido: React.FC = () => {
  const f = useF();
  const cae = lerp(f, 46, 64, 0, 1);
  return (
    <Kap cl={[mira(0, K.trono - 40, 640, 1.8), mira(151, K.trono - 30, 650, 2.25, { curva: "inout" })]}
      medio={<>
        <A look={SIDDHARTHA} seed={30} ruta={[{ f: 0, x: K.trono, y: KP }]} asiento={[{ f: 0, v: 56 }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: { ...SENTADO, hD: 30, cD: 150, hI: 20, cI: 40, cabeza: 0 } }, { f: 40, v: { ...SENTADO, hD: 60, cD: 40, hI: 20, cI: 40, cabeza: 6 } }, { f: 80, v: { ...SENTADO, hD: 20, cD: 30, hI: 15, cI: 30, tronco: 18, cabeza: 18 } }]}
          caras={[{ f: 0, v: "neutral" }, { f: 30, v: "cansado" }, { f: 90, v: "triste" }]} miradas={[{ f: 0, v: { x: -0.4, y: 0.2 } }, { f: 50, v: { x: -0.5, y: 0.8 } }, { f: 90, v: { x: -0.6, y: 0.4 } }]}
          enManoD={(fr: number) => (fr < 46 ? <Uva /> : null)} />
        {f >= 46 && <Uva x={K.trono - 82 - cae * 30} y={KP - 150 + cae * 140} />}
        <g transform={`translate(${K.trono + 90},${KP - 104})`}><Uvas s={1.4} /></g>
      </>}
      hud={<TextoMano texto="why?" x={1340} y={200} desde={104} tam={110} color="#fff2c8" rot={0} brillo={false} />} />
  );
};
// ---------- 31 · en el lavadero, Leo está muy callado ----------
// v3 (sin silueta, sin general): primer plano FRONTAL de Leo, la mirada perdida; el tel BAJA despacio hasta el regazo y la pantalla
// se apaga; parpadeo lento; detrás el lavarropas gira. «VERY QUIET» sobre placa en zona limpia.
const k31 = kDe(147.75);
export const Q31Callado: React.FC = () => {
  const BAJO = { ...SENTADO, hD: 20, cD: 70, hI: 20, cI: 60, cabeza: 14 };
  return (
    <Lav cl={[mira(0, L.leo + 10, 680, 2.7), mira(88, L.leo + 10, 680, 2.8)]} toalla={-1} tenzo={{ no: true }}
      leo={leoSent({ poses: [{ f: 0, v: { ...CEL_SENT, cabeza: 8 } }, { f: k31(149.0), v: { ...CEL_SENT, cabeza: 10 } }, { f: k31(150.2), v: BAJO }], giros: [{ f: 0, v: 0.7 }],
        caras: [{ f: 0, v: "triste" }, { f: k31(149.35), v: "cansado" }], miradas: [{ f: 0, v: { x: 0.1, y: 0.8 } }, { f: k31(148.9), v: { x: -0.3, y: 0.2 } }, { f: k31(149.9), v: { x: -0.5, y: 0.4 } }] })}
      hud={<><Hud2 /><Placa texto="VERY QUIET" x={1450} y={240} desde={k31(149.35)} tam={50} /></>} />
  );
};
// ---------- 32 · «the palace… it's the feed» ----------
const k32 = kDe(150.67);
const FEED = ["cara", "cuerpo", "comida", "cara", "cuerpo", "comida", "cara", "cuerpo"] as const;
// v3: el palacio GRANDE (izq.) vuela y entra en la pantalla del teléfono; adentro se encoge hasta ser la 1ª tarjeta y suben las otras (fondo claro, nunca negro).
export const Q32Feed: React.FC = () => {
  const f = useF();
  const vuela = suave(lerp(f, 6, 30, 0, 1));
  const m = lerp(f, 28, 62, 0, 1);
  const Tarj: React.FC<{ y: number; i: number }> = ({ y, i }) => <TarjetaIcono y={y} t={FEED[i % FEED.length]} likes={1200 + i * 830 + f * 7} />;
  const latido = f >= 28 && f < 40 ? 1 + Math.sin(((f - 28) / 12) * Math.PI) * 0.04 : 1;
  return (
    <Fondo>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${latido})`, transformOrigin: "1260px 540px" }}>
        <TelMarco x={1260} y={540} s={0.9}>
          <div style={{ position: "absolute", inset: 0, background: "#f4efe6" }} />
          {f < 34 && <div style={{ position: "absolute", inset: 0, opacity: 1 - lerp(f, 24, 34, 0, 1) }}>{[0, 1, 2, 3].map((i) => { const sc = f * 22, n = Math.floor(sc / 420); return <Tarj key={i + n} y={40 + i * 420 - (sc % 420)} i={i + n} />; })}</div>}{/* v3ra: el feed ya corre antes de que llegue el palacio */}
          {f >= 26 && <PalacioAFeed m={m} f={f} Tarjeta={Tarj} />}
        </TelMarco>
      </div>
      <Lienzo>
        {f < 30 && <g transform={`translate(${520 + vuela * 740},${560 - vuela * 40}) scale(${2.6 - vuela * 1.6})`} opacity={1 - Math.max(0, vuela - 0.8) * 5}><MiniPalacio /></g>}
        {f < 34 && <Trazo d="M560,800 Q900,900 1100,640" p={lerp(f, 4, 26, 0, 1)} color="#f4efe6" w={7} />}
      </Lienzo>
      <Placa texto="THE PALACE…" x={420} y={250} desde={4} tam={70} />
      <Placa texto="…IS THE FEED" x={420} y={380} desde={k32(152.3)} tam={70} color="#ffd38a" />
      <Hud2 />
    </Fondo>
  );
};
// ---------- 33 · Tenzo sonríe y se come un gajo ----------
// v3: ya no el general de 2 (repetido): primer plano de Tenzo que sonríe, se lleva el gajo a la boca, mastica y le ofrece otro a Leo.
const Gajo: React.FC = () => <path d="M-14,0 Q0,-20 14,0 Q0,8 -14,0 Z" fill="#ffa040" stroke="#c8601a" strokeWidth={2} />;
export const Q33Gajo: React.FC = () => (
  <Lav cl={[mira(0, 1690, 720, 2.6), mira(112, 1690, 720, 2.75, { curva: "inout" })]} toalla={-1} leo={{ no: true }}
    tenzo={{ poses: [{ f: 0, v: PELA }, { f: 14, v: { ...PELA, hD: 30, cD: 150, cabeza: -4 } }, { f: 40, v: PELA }, { f: 62, v: OFRECE }], caras: [{ f: 0, v: "feliz" }, { f: 20, v: "risa" }, { f: 44, v: "feliz" }], habla: [[22, 36]],
      miradas: [{ f: 0, v: { x: -0.3, y: 0.5 } }, { f: 60, v: MIRA_L }], enManoD: (fr: number) => (fr < 26 || fr > 50 ? <Gajo /> : null), enManoI: <Mandarina pelada={1} s={1.1} /> }}
    hud={<Hud2 />} />
);
// ---------- 34-35 · «the algorithm… young faces, perfect bodies… when something sad shows up, I scroll» ----------
const k34 = kDe(157.35);
const Feed: React.FC<{ vel: number; desde?: number; triste?: number; salto?: [number, number] }> = ({ vel, desde = 0, triste, salto }) => {
  const f = useF();
  let off = (f - desde) * vel;
  if (salto) off += interpolate(f, salto, [0, 900], { ...cl, easing: (t) => 1 - (1 - t) * (1 - t) });
  return <>{Array.from({ length: 12 }).map((_, i) => {
    const y = 60 + i * 420 - off;
    if (y < -420 || y > 980) return null;
    const esTriste = triste !== undefined && i === triste;
    return <TarjetaIcono key={i} y={y} t={esTriste ? (i % 2 ? "abuela" : "noticia") : FEED[i % FEED.length]} likes={esTriste ? 3 : 1200 + ((i * 3797) % 9000) + f * 11} triste={esTriste} />;
  })}</>;
};
export const Q34Algoritmo: React.FC = () => {
  const f = useF();
  return (
    <Fondo>
      <TelMarco x={960} y={540} s={0.92}><Feed vel={4.2} /></TelMarco>
      <Lienzo>{Array.from({ length: 10 }).map((_, k) => { const t = ((f + k * 17) % 70) / 70; return <g key={k} transform={`translate(${1220 + Math.sin(k * 2 + t * 4) * 60},${820 - t * 600}) scale(${0.5 + t * 0.3})`} opacity={1 - t}><Icono t="corazon" c="#ff6a2b" /></g>; })}</Lienzo>
      <Etiqueta texto="THE ALGORITHM" x={430} y={300} desde={6} tam={48} color="#ffb060" />
      <Etiqueta texto="YOUNG FACES" x={430} y={420} desde={k34(159.6)} tam={44} />
      <Etiqueta texto="PERFECT BODIES" x={430} y={500} desde={k34(160.8)} tam={44} />
      <Etiqueta texto="PERFECT FOOD" x={430} y={580} desde={k34(162.2)} tam={44} />
      <GranNumero rotulo="LIKES" x={1560} y={360} claves={[{ f: 0, v: 1204 }, { f: 10, v: 98400, d: 250 }]} color="#ff6a2b" tam={84} />
      <Hud2 />
    </Fondo>
  );
};
// v3: el feed corre y FRENA en «something sad» con la tarjeta GRIS (la abuela, 3 likes) al centro, bien legible; en «I scroll» el pulgar
// la barre hacia la izquierda: sale del tel, queda flotando afuera, se achica y en «disappears» se deshace en polvo. El feed sigue de colores.
const k35 = kDe(166.13);
export const Q35Scroll: React.FC = () => {
  const f = useF();
  const sw = k35(168.2), pf = k35(169.2);
  const SAD = 4, stop = 60 + SAD * 420 - 268;
  const off = stop * (1 - Math.pow(1 - lerp(f, 0, k35(166.95), 0, 1), 3)) + 628 * suave(lerp(f, sw + 4, sw + 14, 0, 1)) + Math.max(0, f - (sw + 14)) * 3;
  const fuera = suave(lerp(f, sw, sw + 8, 0, 1)); // la tarjeta triste sale por la izquierda
  const vuela = lerp(f, sw + 8, pf, 0, 1);
  const polvo = lerp(f, pf, pf + 18, 0, 1);
  const { fps } = useVideoConfig();
  // v7 (estructural): en «disappears» CORTE a primerísimo de Leo con el feed REFLEJADO en la cara (luces de colores que cambian
  // con cada tarjeta); antes el plano terminaba igual que Q34 (tel centrado, texto al costado, fondo liso).
  if (f >= pf) {
    const cl35 = [mira(pf, L.leo + 10, 610, 3.0), mira(140, L.leo + 14, 606, 3.15)];
    const cab = enPantalla(cl35, f, fps, L.leo + 10, LP - 300);
    const COL = ["#ff6a2b", "#ff4f8a", "#4fa8ff", "#ffd34a", "#7ad97a"];
    const c0 = COL[Math.floor((f - pf) / 7) % COL.length];
    return (
      <Lav cl={cl35} tenzo={{ no: true }} toalla={-1}
        leo={leoSent({ poses: [{ f: 0, v: { ...CEL_SENT, cabeza: 14 } }], caras: [{ f: 0, v: "neutral" }, { f: pf + 16, v: "cansado" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.9 } }] })}
        hud={<><Lienzo><circle cx={cab.x - 170} cy={cab.y + 230} r={230} fill={c0} opacity={0.13} /><circle cx={cab.x - 150} cy={cab.y + 250} r={130} fill={c0} opacity={0.11} /></Lienzo>
          <Placa texto="GONE." x={1480} y={220} desde={pf} tam={64} /><Hud2 /></>} />
    );
  }
  return (
    <Fondo>
      {/* v7: el tel INCLINADO y más grande (no el encuadre de Q34) */}
      <div style={{ position: "absolute", inset: 0, transform: "rotate(-9deg) scale(1.12)", transformOrigin: "1160px 600px" }}>
      <TelMarco x={1160} y={540} s={0.92}>
        <div style={{ position: "absolute", inset: 0, background: "#1b1d22" }} />
        {Array.from({ length: 12 }).map((_, i) => {
          const y = 60 + i * 420 - off + (i > SAD ? 0 : 0);
          if (y < -420 || y > 980) return null;
          if (i === SAD) return <div key={i} style={{ position: "absolute", inset: 0, transform: `translateX(${-fuera * 560}px)` }}><TarjetaIcono y={y} t="abuela" likes={3} triste /></div>;
          return <TarjetaIcono key={i} y={y} t={FEED[i % FEED.length]} likes={1200 + ((i * 3797) % 9000) + f * 11} />;
        })}
      </TelMarco>
      </div>
      <Lienzo>
        {f >= sw + 6 && polvo < 1 && <g transform={`translate(${lerp(vuela, 0, 1, 700, 420)},${540 - vuela * 60}) scale(${(1 - vuela * 0.45) * (1 - polvo)}) rotate(${-vuela * 8})`} opacity={1 - polvo}>
          <rect x={-190} y={-160} width={380} height={320} rx={22} fill="#3a3d44" stroke="#5a5d64" strokeWidth={5} />
          <g transform="translate(-70,-110) scale(1.4)"><Icono t="abuela" /></g>
          <text x={-150} y={130} fontSize={30} fill="#9a9ca2" fontFamily="sans-serif" fontWeight={700}>♥ 3</text>
        </g>}
        {polvo > 0 && polvo < 1 && Array.from({ length: 26 }).map((_, k) => { const an = k * 2.4, d = 40 + polvo * (120 + (k % 5) * 40);
          return <circle key={k} cx={420 + Math.cos(an) * d} cy={480 + Math.sin(an) * d - polvo * 60} r={10 * (1 - polvo) + 2} fill="#b8aea4" opacity={1 - polvo} />; })}
        {f >= sw - 14 && f < sw + 20 && <ManoGrande x={lerp(f, sw - 2, sw + 8, 1420, 940)} y={lerp(f, sw - 14, sw - 2, 1120, 640)} ang={-60} piel="#ecc9a3" manga="#24242a" s={0.75} />}
      </Lienzo>
      <Placa texto="SOMETHING SAD…" x={460} y={190} desde={k35(166.91)} hasta={sw} tam={46} color="#c9ccd2" />
      <Placa texto="SCROLL" x={460} y={190} desde={sw} hasta={pf} tam={60} color="#ff6a2b" />
      <Hud2 />
    </Fondo>
  );
};
// ---------- 36 · «hmm. And are you happy, in your palace?» ----------
const k36 = kDe(170.33);
// v3 (sin silueta): contraplano NUEVO — Tenzo de FRENTE en plano medio: «Hmm» asiente masticando; en «are you happy» se INCLINA hacia
// adelante, y en «palace» aparece la burbuja del palacio dorado junto a su cabeza.
export const Q36Feliz: React.FC = () => {
  const INCLINA = { ...SENTADO, hD: 40, cD: 50, hI: 30, cI: 60, tronco: 16, cabeza: 6 };
  return (
    <Lav cl={[mira(0, 1700, 750, 2.4), mira(124, 1700, 750, 2.55, { curva: "inout" })]} leo={{ no: true }} toalla={-1}
      tenzo={tenzoPela({ poses: [{ f: 0, v: PELA }, { f: 8, v: { ...PELA, cabeza: 24 } }, { f: 16, v: PELA }, { f: 24, v: { ...PELA, cabeza: 24 } }, { f: k36(171.6), v: { ...SENTADO, hD: 40, cD: 50, hI: 30, cI: 60, cabeza: -2 } }, { f: k36(172.45), v: INCLINA }],
        miradas: [{ f: 0, v: { x: -0.3, y: 0.5 } }, { f: k36(171.6), v: { x: 0, y: 0 } }], giros: [{ f: 0, v: 0.7 }], habla: [[0, k36(171)], [k36(172.21), k36(174.47)]], caras: [{ f: 0, v: "neutral" }, { f: k36(172.1), v: "feliz" }] })}
      hud={<><Hud2 />
        <Burbuja x={640} y={360} r={200} desde={k36(173.4)}>
          <rect x={-120} y={-120} width={240} height={240} fill="#ffd9a0" /><rect x={-120} y={50} width={240} height={80} fill="#e2b47e" />
          <g transform="translate(0,20)"><MiniPalacio s={0.8} /></g>
        </Burbuja>
        <Placa texto="«ARE YOU HAPPY?»" x={1500} y={170} desde={k36(172.47)} tam={52} color="#ffd38a" /></>} />
  );
};
// ---------- 37 · Leo no contesta ----------
export const Q37NoContesta: React.FC = () => (
  <Lav cl={[mira(0, L.leo + 60, 650, 2.3), mira(49, L.leo + 60, 650, 2.36)]} tenzo={{ no: true }} toalla={-1}
    leo={leoSent({ poses: [{ f: 0, v: CEL_SENT }, { f: 18, v: { ...CEL_SENT, hD: 20, cD: 90, cabeza: 26 } }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: 14, v: { x: 0.2, y: 0.9 } }], caras: [{ f: 0, v: "duda" }, { f: 16, v: "triste" }] })} hud={<Hud2 />} />
);
// ---------- 38 · el contador sigue: 9h 12m ayer · 6 h ya hoy ----------
// v7 (estructural): 2 planos distintos. A) el tel a PANTALLA COMPLETA, inclinado, con las barras creciendo y el pulgar (9h 12m ayer);
// B) contraplano: primer plano de Leo mirando su historial, con la cara iluminada por el tel; «6 hours already today» a mano.
export const Q38Contador: React.FC = () => {
  const f = useF();
  const k = kDe(176.09);
  const cB = k(181.85);
  if (f >= cB) {
    const MIRA_HIST = { ...CEL_SENT, cabeza: 16 };
    return (
      <Lav cl={[mira(cB, L.leo - 150, 620, 2.6), mira(cB + 62, L.leo - 140, 615, 2.8, { curva: "inout" })]} tenzo={{ no: true }} toalla={-1}
        leo={leoSent({ poses: [{ f: 0, v: MIRA_HIST }, { f: cB + 20, v: { ...MIRA_HIST, cabeza: 4, tronco: -6 } }, { f: cB + 40, v: { ...MIRA_HIST, cabeza: 22, tronco: 6 } }],
          caras: [{ f: 0, v: "duda" }, { f: cB + 20, v: "sorpresa" }, { f: cB + 40, v: "triste" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.9 } }, { f: cB + 20, v: { x: 0.9, y: -0.1 } }, { f: cB + 40, v: { x: 0.3, y: 0.9 } }] })}
        hud={<><ManoLeo texto="6 hours already today" x={110} y={480} desde={cB + 4} tam={96} /><Hud2 /></>} />
    );
  }
  return (
    <Fondo>
      {f < k(179.2) ? <TelGrande modo="screentime" min={552} sub="YESTERDAY" x={1180} y={560} s={1.06} inclina={-5} desde={0} />
        : <TelGrande modo="screentime" min={552} sub="YESTERDAY" x={lerp(f, k(179.2), cB, 1060, 1000)} y={lerp(f, k(179.2), cB, 820, 860)} s={lerp(f, k(179.2), cB, 1.9, 2.05)} inclina={6} desde={-30} />}{/* v3ra: 2º cuadro = macro de la cifra, otro ángulo */}
      {/* la mano de Leo sostiene el tel por el costado (las barras quedan a la vista) */}
      {f < k(179.2) && <Lienzo><ManoGrande x={lerp(f, 0, 90, 955, 965)} y={905} ang={22} piel="#ecc9a3" manga="#24242a" s={1.15} /></Lienzo>}
      <Pildora texto="9h 12m YESTERDAY" x={f < k(179.2) ? 470 : 400} y={f < k(179.2) ? 420 : 250} desde={k(179.2)} color="#ffe2a6" tam={60} />
      <Hud2 />
    </Fondo>
  );
};
// ---------- 39-40 · «one night» — y Leo, muy despacio, le pone el tel en la mano · la pantalla se apaga ----------
const k39 = kDe(183.87);
// inserto macro (pantalla): la mano de Tenzo abierta abajo a la derecha; la de Leo entra desde la izquierda con el tel
// agarrado, temblando; lo deja sobre la palma y se va. apaga 0..1 = la pantalla colapsa en una raya y queda negra con
// el reflejo de la cara de Leo. zoom = empuje lento hacia el tel.
const ManosEntrega: React.FC<{ t: number; tiembla: number; apaga: number; f: number; zoom?: number }> = ({ t, tiembla, apaga, f, zoom = 1 }) => {
  const trem = Math.sin(f * 1.9) * 6 * tiembla + Math.sin(f * 3.1) * 3 * tiembla;
  const tr = suave(Math.min(1, t / 0.82)); // viaje de la mano de Leo
  const sol = suave(Math.min(1, Math.max(0, (t - 0.82) / 0.13))); // el tel pasa de mano
  const lx = 180 + tr * 800 + trem, ly = 430 + tr * 120 + trem * 0.5;
  const peso = Math.sin(Math.min(1, Math.max(0, (t - 0.9) / 0.1)) * Math.PI) * 14; // la palma baja con el peso
  const PX = 1330, PY = 870 + peso;
  const tx = (lx + 70) * (1 - sol) + (PX - 60) * sol, ty = (ly - 70) * (1 - sol) + (PY - 100) * sol;
  const ta = (-8 + trem * 0.4) * (1 - sol) + -62 * sol;
  const a1 = Math.min(1, apaga * 2), a2 = Math.max(0, apaga * 2 - 1);
  const W = 150, H = W * 1.95;
  return (
    <Lienzo>
      <defs>
        <radialGradient id="farol39"><stop offset="0" stopColor="#ffc46a" stopOpacity={0.55} /><stop offset="1" stopColor="#ffc46a" stopOpacity={0} /></radialGradient>
        <filter id="bok39"><feGaussianBlur stdDeviation="14" /></filter>
      </defs>
      <rect width={1920} height={1080} fill="#2a2621" />
      <g filter="url(#bok39)" opacity={0.55}>{[0, 1, 2, 3, 4].map((k) => <g key={k}><rect x={-60 + k * 420} y={40} width={360} height={420} rx={20} fill="#d8d4cc" opacity={0.35} /><circle cx={120 + k * 420} cy={250} r={120} fill="#1e1d1f" opacity={0.7} /></g>)}</g>
      <circle cx={1500} cy={300} r={620} fill="url(#farol39)" />
      <g transform={`translate(${tx} ${ty}) scale(${zoom}) translate(${-tx} ${-ty})`}>
        <rect x={-200} y={880} width={2400} height={400} fill="#4a463e" />
        <ManoGrande x={PX} y={PY} ang={-40} piel="#f2bf8f" manga="#8e8a82" palma s={1.5} />
        <TelSvg x={tx} y={ty} w={W} ang={ta} prendido={apaga > 0 ? 0 : 1} reflejo={a2}>
          {apaga > 0 && a2 < 1 && <rect x={-(W - 20) / 2 * (1 - a2)} y={-Math.max(3, (H - 20) / 2 * (1 - a1))} width={(W - 20) * (1 - a2)} height={Math.max(6, (H - 20) * (1 - a1))} rx={6} fill={a1 < 1 ? "#ffb48a" : "#ffffff"} opacity={1 - a2 * 0.8} />}
        </TelSvg>
        <g opacity={1 - sol}><ManoGrande x={sol > 0 ? lx - sol * 700 : lx} y={ly} ang={100} piel="#ecc9a3" manga="#24242a" s={1.2} /></g>
      </g>
    </Lienzo>
  );
};
const AFERRA_MIRA = { ...AFERRA, cabeza: 14 };
export const Q39Entrega: React.FC = () => {
  const f = useF();
  const c1 = k39(185.5), ins = k39(186.35); // plano medio → primer plano de Leo (decide) → inserto de manos en «very slowly»
  if (f < c1) return (
    <Lav cl={[mira(0, 1450, 630, 1.6), mira(c1, 1450, 630, 1.68)]} toalla={-1}
      tenzo={{ poses: [{ f: 0, v: OFRECE }], caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: MIRA_L }], habla: [[0, k39(184.6)]] }}
      leo={leoSent({ poses: [{ f: 0, v: AFERRA }], caras: [{ f: 0, v: "miedo" }] })} hud={<Hud2 />} />
  );
  if (f < ins) return (
    <Lav cl={[mira(c1, L.leo + 30, 600, 2.5), mira(ins, L.leo + 50, 600, 2.65)]} toalla={-1}
      tenzo={{ poses: [{ f: 0, v: OFRECE }], caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: MIRA_L }] }}
      leo={leoSent({ poses: [{ f: 0, v: AFERRA_MIRA }, { f: c1 + 8, v: AFERRA_MIRA }, { f: ins - 4, v: { ...CEL_SENT, hD: 70, cD: 30, cabeza: 2 } }], caras: [{ f: 0, v: "miedo" }, { f: c1 + 12, v: "triste" }], miradas: [{ f: 0, v: { x: 0.2, y: 0.8 } }, { f: c1 + 12, v: MIRA_T }] })} hud={<Hud2 />} />
  );
  const t = lerp(f, ins + 4, k39(189.2), 0, 1);
  return <AbsoluteFill><ManosEntrega t={t} tiembla={1 - lerp(f, k39(188.4), k39(188.9), 0, 1)} apaga={0} f={f} zoom={lerp(f, ins, 184, 1, 1.12)} /><Etiqueta texto="VERY SLOWLY" x={500} y={200} desde={ins + 4} tam={54} color="#fff2c8" /><Hud2 /></AbsoluteFill>;
};
export const Q40Negro: React.FC = () => {
  const f = useF();
  return <AbsoluteFill><ManosEntrega t={1} tiembla={0} apaga={lerp(f, 13, 26, 0, 1)} f={f} zoom={lerp(f, 0, 48, 1.12, 1.55)} /><Hud2 /></AbsoluteFill>;
};
// ---------- 41 · detrás del hombro de Leo, la sombra sisea ----------
// v3: dos-tiros cerrado, Mara SEPARADA detrás a la izquierda: crece asomándose en «behind Leo's shoulder»; en «hisses» le SISEA en la nuca
// (ondas que llegan a Leo), Leo siente el escalofrío, se RASCA la nuca y se sacude; Mara se achica, satisfecha.
const k41 = kDe(191.61);
export const Q41Sisea: React.FC = () => {
  const f = useF();
  const h = k41(193.55);
  const crece = lerp(f, 0, k41(192.4), 0.8, 1.05) + lerp(f, h - 6, h, 0, 0.08) - lerp(f, h + 4, h + 20, 0, 0.26); // se infla para sisear y se encoge, satisfecha
  const RASCA_A = { ...SENTADO, hD: 165, cD: 150, cabeza: 16, tronco: 10 }, RASCA_B = { ...RASCA_A, cD: 120, cabeza: 12 };
  return (
    <Lav cl={[mira(0, L.leo - 80, 680, 2.2), mira(92, L.leo - 80, 680, 2.35)]} tenzo={{ no: true }} toalla={-1}
      mara={{ opacidad: () => 0.97, escala: ESC * crece, ruta: [{ f: 0, x: L.leo - 230, y: LP - 10 }, { f: k41(192.4), x: L.leo - 185, y: LP - 10 }], poses: [{ f: 0, v: { hD: 40, cD: 40, hI: 30, cI: 40, tronco: 10, cabeza: 10 } }, { f: h - 6, v: { hD: 60, cD: 80, hI: 50, cI: 80, tronco: 30, cabeza: 28 } }],
        caras: [{ f: 0, v: "picaro" }, { f: h - 4, v: "enojo" }, { f: h + 20, v: "picaro" }], habla: [[h, h + 22]] }}
      leo={conReaccion(leoSent({ poses: [{ f: 0, v: { ...SENTADO, hD: 30, cD: 20 } }, { f: h - 1, v: { ...SENTADO, hD: 30, cD: 20 } }, { f: h + 3, v: { ...SENTADO, hD: 26, cD: 30, hI: 30, cI: 40, tronco: 18, cabeza: -10 } }, ...ciclo(RASCA_A, RASCA_B, 8, 92, h + 9)], enManoD: () => null,
        caras: [{ f: 0, v: "neutral" }, { f: h + 1, v: "miedo" }, { f: h + 22, v: "asco" }], miradas: [{ f: 0, v: MIRA_T }, { f: h + 3, v: { x: -0.6, y: -0.2 } }],
        ajuste: (p: { tronco: number; cabeza: number }, fr: number) => (fr > h + 1 && fr < h + 12 ? { ...p, tronco: p.tronco + Math.sin(fr * 2.6) * 6, cabeza: p.cabeza + Math.sin(fr * 3.1) * 5 } : p) }) as Parameters<typeof conReaccion>[0], "miedo", h, 26)}
      hud={<><Hud2 />
        {f >= h && f < h + 24 && <Lienzo>{[0, 1, 2].map((k) => { const u = ((f - h) / 8 + k / 3) % 1; return <path key={k} d={`M${760 + u * 260},${380 - 70} Q${800 + u * 280},380 ${760 + u * 260},${380 + 70}`} stroke="#ff8a4a" strokeWidth={8} fill="none" opacity={1 - u} />; })}</Lienzo>}
        <Lienzo><ReaccionFx tipo="miedo" f0={h + 1} x={1180} y={420} dir={-1} s={1.3} /></Lienzo>
        <Placa texto="«SSSSS…»" x={420} y={200} desde={h} tam={70} color="#ff8a4a" /></>} />
  );
};
// ---------- 42 · DAY 2 · SCREEN TIME… ZERO ----------
// v3: el tel APOYADO en la palma de Tenzo (manga gris): en «screen time» el contador baja de 6h a 0m; en «zero» clava, se pone azul hielo
// con un golpe, y la ESCARCHA crece desde los bordes con cristales; la mano baja despacio con el tel congelado.
const k42 = kDe(194.67);
export const Q42Cero: React.FC = () => {
  const f = useF();
  const z = k42(196.99);
  const min = Math.round(lerp(f, k42(196.0), z, 360, 0));
  const hi = lerp(f, z - 6, z + 14, 0, 1);
  const baja = suave(lerp(f, z + 6, z + 24, 0, 1)) * 70;
  const txt = min >= 60 ? `${Math.floor(min / 60)}h ${(min % 60 < 10 ? "0" : "") + (min % 60)}m` : `${min}m`;
  const cristales = Array.from({ length: 22 }).map((_, k) => {
    const lado = k % 4, t = random(`q42${k}`), L0 = 70 + random(`q42l${k}`) * 160;
    const [x0, y0, ang] = lado === 0 ? [t * 476, 0, 90] : lado === 1 ? [476, t * 956, 180] : lado === 2 ? [t * 476, 956, -90] : [0, t * 956, 0];
    const Lk = L0 * suave(Math.min(1, Math.max(0, hi * 1.4 - random(`q42d${k}`) * 0.4)));
    const r = (ang * Math.PI) / 180, x1 = x0 + Math.cos(r) * Lk, y1 = y0 + Math.sin(r) * Lk;
    const rx = Math.cos(r + 0.6) * Lk * 0.45, ry = Math.sin(r + 0.6) * Lk * 0.45, lx = Math.cos(r - 0.6) * Lk * 0.45, ly = Math.sin(r - 0.6) * Lk * 0.45;
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    return <g key={k} stroke="#f2fbff" strokeWidth={7} strokeLinecap="round" opacity={0.9}><path d={`M${x0},${y0} L${x1},${y1}`} /><path d={`M${mx},${my} l${rx},${ry} M${mx},${my} l${lx},${ly}`} /></g>;
  });
  return (
    <Sacude f0={[z]} amp={9}>
      <Fondo>
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${baja}px)` }}>
          <Lienzo><ManoGrande x={1300} y={1010} ang={0} piel="#f2bf8f" manga="#8e8a82" s={1.5} /></Lienzo>
          <TelMarco x={1300} y={500} s={0.8} halo={0.4} rot={-4}>
            <div style={{ position: "absolute", inset: 0, padding: 40, fontFamily: F_HUD }}>
              <div style={{ color: "#9aa0aa", fontSize: 38, marginTop: 60, fontWeight: 600 }}>SCREEN TIME</div>
              <div style={{ color: "#9aa0aa", fontSize: 30 }}>Today</div>
              <div style={{ color: f >= z ? "#bfe6ff" : "#ff6a2b", fontSize: min >= 60 ? 120 : 180, fontWeight: 700, marginTop: 40, whiteSpace: "nowrap" }}>{txt}</div>
            </div>
            <svg viewBox="0 0 476 956" width={476} height={956} style={{ position: "absolute", inset: 0 }}>
              <defs><radialGradient id="escq42" cx="50%" cy="50%" r="70%"><stop offset={`${100 - hi * 55}%`} stopColor="#dff2ff" stopOpacity={0} /><stop offset="100%" stopColor="#e6f6ff" stopOpacity={0.95 * hi} /></radialGradient></defs>
              <rect width={476} height={956} fill="url(#escq42)" />
              {cristales}
              <Hielo x={20} y={150} w={436} h={300} p={hi} />
            </svg>
          </TelMarco>
        </div>
        {f >= z && f < z + 10 && <Lienzo><circle cx={1300} cy={500} r={200 + (f - z) * 40} fill="none" stroke="#bfe6ff" strokeWidth={14 * (1 - (f - z) / 10)} /></Lienzo>}
        <Placa texto="SCREEN TIME" x={560} y={360} desde={k42(196.01)} tam={52} />
        <Placa texto="ZERO." x={560} y={470} desde={z} tam={80} color="#bfe6ff" />
        <Placa texto="FROZEN" x={560} y={590} desde={z + 8} tam={56} color="#bfe6ff" />
        <Hud2 m={min} est={f >= z ? "congelado" : "normal"} />
        <Rotulo texto="DAY 2" desde={4} />
      </Fondo>
    </Sacude>
  );
};

export { TENZO, LEO, MARA, FAROL, rimOro };
