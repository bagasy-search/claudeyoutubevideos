// tz02 · planos 1-42 (0 → 198 s): el cuadro 0, día 2 en el lavadero, la mandarina, «one night», el palacio de Siddhartha, la entrega del tel.
// v2 (26-oct): cada plano con ACCIÓN de cuerpo entero + un componente que lleva la frase (ver D:/rtmp/tenzo/ojo/v1/director_tz02.md).
import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import { Clave, enPantalla, mira, useF } from "../anikit/camara";
import { Contador, F_HUD, GranNumero, Pildora, TextoMano } from "../anikit/pantalla";
import { ALDEANA, ALDEANO, ASITA, ESC, FAROL, LEO, LEO_CAPUCHA, MARA, REY, SIDDHARTHA, TENZO, VIEJO, PAL } from "../tenzo/elenco";
import { ManoLeo, ManoMara, Rotulo } from "../tenzo/hud";
import { BolsoRopa, Elefante, FarolMano, Mandarina, Tel } from "../tenzo/utileria";
import { TelGrande } from "../tenzo/graficos";
import { Escena } from "../anikit/escena";
import { Comparacion, Mapa, Velo } from "../anikit/explica";
import { Broadway } from "../tenzo/sets/broadway";
import { CEL_SENT, DOBLA_A, kDe, Lav, LAV_PUNTOS, LP, rimFrio, rimOro, SENTADO } from "../tz01/base";
import { Fondo, fade } from "../tz01/planos1";
import { A, Hud2, K, Kap, KP, PRINCESA } from "./base";
import {
  Bandeja, BebeMano, BebeVivo, Burbuja, cl, Divan, Etiqueta, FlorMarchita, FlorMuertaMano, Guirnalda, GuirnaldaColgante, Hielo, Icono, Lagrimas, lerp, Lienzo,
  ManoGrande, MiniPalacio, Notas, osc01, Recto, Sitar, suave, Tambor, TarjetaIcono, TelMarco, TelSvg, Trazo, TxtSvg, Uva, Uvas, usePop,
} from "./extras";

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
const Silueta: React.FC<{ lado: "izq" | "der"; pelo?: "puntas" | "calvo"; borde: string }> = ({ lado, pelo = "puntas", borde }) => {
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
  <Lav cl={[mira(0, 1430, 560, 1.38), mira(60, 1435, 560, 1.43)]} toalla={-1} sp={{ farol: false }}
    tenzo={{ ruta: [{ f: 0, x: 1230, y: LP }], dir: [{ f: 0, v: 1 }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: { hD: 82, cD: 4, hI: 30, cI: 40, tronco: 6 } }],
      enManoI: <FarolMano luz={1.4} />, caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: { x: 0.8, y: 0.1 } }] }}
    leo={{ ruta: [{ f: 0, x: 1600, y: LP }], dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: AFERRA }, { f: 40, v: AFERRA2 }], caras: [{ f: 0, v: "miedo" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }] }}
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
  <Kap cl={[mira(0, 1340, 600, 0.98), mira(153, 1300, 640, 1.12, { curva: "inout" })]} sp={{ flores: 0.6 }}
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
export const Q04Dia2: React.FC = () => (
  <Escena Set={Broadway} pal={PAL} claves={[mira(0, 1560, 600, 1.2), mira(168, 1000, 620, 1.35, { curva: "inout" })]} setProps={{ tren: 10, nieve: true }}
    medio={<A look={LEO_CAPUCHA} seed={1} luz={rimFrio} ruta={[{ f: 0, x: 1700, y: 900 }, { f: 168, x: 880, y: 900, curva: "lineal" }]} poses={[{ f: 0, v: { hD: 10, cD: 20 } }]} enManoI={<BolsoRopa />} caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: { x: -0.4, y: -0.6 } }, { f: 60, v: { x: -0.9, y: 0.1 } }]}
      ajuste={(p) => ({ ...p, hI: 10, cI: 20 })} />}
    hud={<><Hud2 /><Rotulo texto="DAY 2 · 3:00 AM · BROADWAY" desde={8} /></>} />
);
// ---------- 5 · Leo entra con el bolso y el tel en la mano, como le pidió el viejo ----------
export const Q05Entra: React.FC = () => {
  const f = useF();
  return (
    <Lav cl={[mira(0, 2250, 620, 1.35), mira(150, 1500, 620, 1.3), mira(229, L.leo + 120, 640, 1.55, { curva: "inout" })]} toalla={-1} sp={{ tren: 30 }}
      extra={f >= 182 ? <g transform={`translate(${L.leo - 120},${LP - 4 - Math.max(0, 10 - (f - 182)) * 3})`}><BolsoRopa s={1.3} /></g> : null}
      tenzo={tenzoPela({ caras: [{ f: 0, v: "neutral" }, { f: 150, v: "feliz" }], miradas: [{ f: 0, v: { x: -0.3, y: 0.6 } }, { f: 120, v: MIRA_L }] })}
      leo={{ ruta: [{ f: 0, x: 2500, y: LP }, { f: 170, x: L.leo, y: LP }], dir: [{ f: 0, v: -1 }, { f: 175, v: 1 }], asiento: [{ f: 0, v: undefined }, { f: 185, v: 66 }],
        poses: [{ f: 0, v: { hD: 30, cD: 110, hI: 10, cI: 10 } }, { f: 176, v: { hD: 10, cD: 10, hI: -40, cI: 10, tronco: 10 } }, { f: 186, v: { ...SENTADO, hD: 20, cD: 20 } }, { f: 205, v: { ...CEL_SENT, cabeza: 6 } }],
        enManoI: (fr: number) => (fr < 182 ? <BolsoRopa /> : null), enManoD: (fr: number) => (fr < 120 || fr > 196 ? <Tel /> : null), caras: [{ f: 0, v: "cansado" }, { f: 205, v: "neutral" }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }, { f: 200, v: { x: 0.3, y: 0.7 } }] }} hud={<Hud2 />} />
  );
};
// ---------- 6 · Tenzo ya está: mismo rincón, misma túnica, el farol en la mesa ----------
export const Q06YaEsta: React.FC = () => (
  <Lav cl={[mira(0, 1560, 600, 1.45), mira(227, 1610, 610, 1.6, { curva: "inout" })]} toalla={-1} sp={{ luzFarol: 1.3 }}
    leo={{ poses: [{ f: 0, v: { ...CEL_SENT, cabeza: 4 } }, { f: 60, v: { ...CEL_SENT, cabeza: -4, cD: 110 } }], miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }, { f: 60, v: MIRA_T }] }}
    tenzo={tenzoPela({ enManoD: <Mandarina s={1.2} />, poses: [{ f: 0, v: PELA }, { f: 50, v: { ...PELA, cabeza: 0 } }, { f: 70, v: { ...SENTADO, hD: 150, cD: 30, hI: 40, cI: 90, cabeza: -4 } }, { f: 130, v: PELA }], miradas: [{ f: 0, v: { x: -0.3, y: 0.6 } }, { f: 50, v: MIRA_L }, { f: 140, v: { x: -0.3, y: 0.6 } }], caras: [{ f: 0, v: "neutral" }, { f: 60, v: "feliz" }] })}
    hud={<><Hud2 /><Etiqueta texto="SAME CORNER" x={1300} y={170} desde={40} tam={42} /><Etiqueta texto="SAME ROBE" x={1300} y={230} desde={95} tam={42} /><Etiqueta texto="SAME LANTERN" x={1300} y={290} desde={150} tam={42} color="#ffd38a" /></>} />
);
// ---------- 7 · hoy no dobla toallas: pela una mandarina, despacio, en una sola espiral ----------
export const Q07Mandarina: React.FC = () => {
  const f = useF();
  const p = lerp(f, 20, 220, 0, 1);
  const tir = Math.sin(f / 9) * 6; // la mano derecha tira de la cáscara, despacio
  const hx = 1095 + tir, hy = 360 - tir * 0.5;
  const pts: string[] = [];
  const N = Math.floor(6 + p * 60);
  for (let i = 0; i <= N; i++) { const t = i / 66; const a = t * 14 + f / 40; pts.push(`${hx + 10 + Math.cos(a) * (14 + t * 70)},${hy + 30 + t * 560 + Math.sin(a) * 16}`); }
  return (
    <Fondo>
      <Lienzo>
        <defs>
          <radialGradient id="farolQ7" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffc46a" stopOpacity={0.55} /><stop offset="1" stopColor="#ffc46a" stopOpacity={0} /></radialGradient>
          <clipPath id="peladoQ7"><rect x={-160} y={-160} width={320} height={320 * p} /></clipPath>
        </defs>
        <rect width={1920} height={1080} fill="#2a2620" />
        <circle cx={1500} cy={300} r={520} fill="url(#farolQ7)" />
        <rect x={0} y={800} width={1920} height={280} fill="#4a4840" />
        <g transform={`translate(960,480) rotate(${f * 0.4})`}>
          <circle r={150} fill="#ff8a2a" stroke="#c8501a" strokeWidth={6} />
          {Array.from({ length: 26 }).map((_, k) => <circle key={k} cx={Math.cos(k * 2.3) * 115} cy={Math.sin(k * 3.1) * 115} r={4} fill="#e0701a" />)}
          <g clipPath="url(#peladoQ7)">
            <circle r={146} fill="#ffc87a" stroke="#f0a050" strokeWidth={4} />
            {Array.from({ length: 9 }).map((_, k) => <path key={k} d={`M0,-140 Q${Math.cos(k * 0.7) * 120},0 0,140`} stroke="#fff0d0" strokeWidth={4} fill="none" opacity={0.8} />)}
          </g>
          <path d="M-8,-150 q10,-30 30,-36" stroke="#4a7a2a" strokeWidth={8} fill="none" opacity={1 - p} />
        </g>
        <polyline points={pts.join(" ")} stroke="#c8501a" strokeWidth={40} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={pts.join(" ")} stroke="#ff8a2a" strokeWidth={32} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={pts.join(" ")} stroke="#ffd09a" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.6} transform="translate(-6,0)" />
        <ManoGrande x={850} y={610} ang={40} piel="#f2bf8f" manga="#8e8a82" />
        <ManoGrande x={hx} y={hy} ang={-140} piel="#f2bf8f" manga="#8e8a82" s={0.85} />
      </Lienzo>
      <Contador x={90} y={190} alinear="der" tam={48} lineas={[{ etiqueta: "PEEL", claves: "1", color: "#ffb060" }, { etiqueta: "BREAKS", claves: "0", color: "#ffb060" }]} desde={30} />
      <Etiqueta texto="SLOWLY" x={420} y={300} desde={90} tam={46} color="#fff2c8" hasta={170} />
      <Etiqueta texto="ONE SINGLE SPIRAL" x={420} y={300} desde={172} tam={46} color="#ffb060" />
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
export const Q09Mano: React.FC = () => {
  const c0 = mira(0, 1440, 650, 1.9);
  return (
    <Lav cl={[c0, mira(99, 1450, 650, 2.1, { curva: "inout" })]} leo={{ no: true }} toalla={-1}
      tenzo={{ poses: [{ f: 0, v: DOBLA_A }, { f: 14, v: OFRECE }], caras: [{ f: 0, v: "neutral" }, { f: 20, v: "feliz" }], miradas: [{ f: 0, v: MIRA_L }] }}
      hud={<><HombroLeo /><Hud2 /><Etiqueta texto="OPEN" x={700} y={200} desde={34} tam={46} /><Etiqueta texto="PATIENT" x={700} y={270} desde={64} tam={46} color="#ffd38a" /></>} />
  );
};
// ---------- 10 · Leo se ríe: «no way» · «one night» ----------
const k10 = kDe(45.18);
export const Q10NoWay: React.FC = () => {
  const RIE = { ...SENTADO, tronco: -20, cabeza: -10, hD: 40, cD: 135, hI: 70, cI: 60 };
  return (
    <Lav cl={[mira(0, L.leo + 160, 620, 1.75), mira(97, L.leo + 170, 620, 1.9)]} toalla={-1}
      tenzo={{ poses: [{ f: 0, v: OFRECE }], caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: MIRA_L }], habla: [[k10(47.38), k10(47.9)]] }}
      leo={leoSent({ poses: [{ f: 0, v: AFERRA }, ...ciclo(RIE, { ...RIE, hI: 95, cI: 40 }, 10, 60, 6), { f: 64, v: AFERRA2 }], giros: [{ f: 0, v: 0 }, { f: 8, v: -0.3 }, { f: 16, v: 0.3 }, { f: 24, v: -0.3 }, { f: 32, v: 0.2 }, { f: 40, v: 0 }],
        caras: [{ f: 0, v: "risa" }, { f: 62, v: "duda" }], habla: [[0, k10(46.38)], [k10(46.42), k10(46.92)]] })} hud={<><Hud2 /><ManoLeo texto="no way" x={250} y={200} desde={4} hasta={70} tam={120} /></>} />
  );
};
// ---------- 11 · «I need it. For work. For… everything» ----------
const k11 = kDe(48.4);
const ICONOS11: { t: "trabajo" | "mapa" | "chat" | "musica"; d: number; a: number }[] = [{ t: "trabajo", d: k11(49.1), a: -1.75 }, { t: "mapa", d: k11(50.0), a: -1.1 }, { t: "chat", d: k11(50.4), a: -0.45 }, { t: "musica", d: k11(50.8), a: 0.2 }];
export const Q11Necesito: React.FC = () => {
  const f = useF();
  const { fps } = useVideoConfig();
  const cl11 = [mira(0, L.leo + 80, 620, 2.1), mira(95, L.leo + 80, 615, 2.25)];
  const t = enPantalla(cl11, f, fps, L.leo + 70, LP - 150);
  return (
    <Lav cl={cl11} tenzo={{ no: true }} toalla={-1}
      leo={leoSent({ poses: [{ f: 0, v: AFERRA }, { f: 50, v: AFERRA2 }], caras: [{ f: 0, v: "duda" }, { f: 50, v: "triste" }], habla: [[0, 70]], miradas: [{ f: 0, v: MIRA_T }, { f: 40, v: { x: 0.4, y: 0.7 } }] })}
      hud={<><Hud2 /><Lienzo>{ICONOS11.map(({ t: ic, d, a }, i) => {
        if (f < d) return null;
        const s = interpolate(f - d, [0, 12], [0, 1], cl);
        const R = 400, x = t.x + Math.cos(a) * R * s, y = t.y + Math.sin(a) * R * 0.8 * s;
        const links = 9;
        const ang = (Math.atan2(y - t.y, x - t.x) * 180) / Math.PI;
        return (
          <g key={i}>
            {Array.from({ length: links }).map((_, j) => { const u = (j + 0.5) / links; const cx = t.x + (x - t.x) * u, cy = t.y + (y - t.y) * u + Math.sin(u * Math.PI) * 30; return <ellipse key={j} cx={cx} cy={cy} rx={16} ry={9} fill="none" stroke="#c9ccd2" strokeWidth={5} transform={`rotate(${ang + (j % 2) * 90} ${cx} ${cy})`} opacity={s} />; })}
            <g transform={`translate(${x},${y}) scale(${s})`}><circle r={62} fill="#ff6a2b" stroke="#fff2e0" strokeWidth={5} /><g transform="translate(-40,-40) scale(0.8)"><Icono t={ic} /></g></g>
          </g>
        );
      })}</Lienzo></>} />
  );
};
// ---------- 12 · «one night. Tomorrow at three I give it back… a prince who had never seen a phone» ----------
const k12 = kDe(51.56);
const Cuenta24: React.FC = () => {
  const f = useF();
  const s = usePop(k12(51.8));
  const t = Math.max(0, 24 * 3600 - Math.max(0, f - k12(52.2)) * 220);
  const p = (n: number) => String(Math.floor(n)).padStart(2, "0");
  return <div style={{ position: "absolute", left: 1560, top: 150, transform: `translate(-50%,0) scale(${0.8 + 0.2 * s})`, opacity: s, textAlign: "center", fontFamily: F_HUD, background: "#16151acc", borderRadius: 24, padding: "14px 30px", border: "3px solid #ff6a2b" }}>
    <div style={{ fontSize: 26, letterSpacing: 6, color: "#f4efe6", fontWeight: 600, textShadow: "0 2px 8px #000" }}>ONE NIGHT</div>
    <div style={{ fontSize: 78, color: "#ff6a2b", fontWeight: 700, fontVariantNumeric: "tabular-nums", textShadow: "0 0 24px #ff6a2b88, 0 3px 0 #0008" }}>{p(t / 3600)}:{p((t % 3600) / 60)}:{p(t % 60)}</div>
  </div>;
};
export const Q12UnaNoche: React.FC = () => {
  const f = useF();
  const { fps } = useVideoConfig();
  const cl12 = [mira(0, 1500, 630, 1.75), mira(252, 1520, 630, 1.95, { curva: "inout" })];
  const cab = enPantalla(cl12, f, fps, 1690, LP - 250);
  return (
    <Lav cl={cl12} toalla={-1}
      leo={leoSent({ poses: [{ f: 0, v: AFERRA }], caras: [{ f: 0, v: "duda" }], miradas: [{ f: 0, v: MIRA_T }] })}
      tenzo={{ poses: [{ f: 0, v: OFRECE }, { f: 6, v: { ...SENTADO, hD: 150, cD: 12, hI: 20, cI: 40 } }, { f: k12(53.6), v: OFRECE }, { f: k12(55.4), v: { ...SENTADO, hD: 100, cD: 80, hI: 20, cI: 40 } }, { f: k12(56.2), v: { ...SENTADO, hD: 60, cD: 40, hI: 20, cI: 40 } }],
        caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: MIRA_L }, { f: k12(56.2), v: { x: -0.4, y: -0.5 } }], habla: [[0, k12(53.74)], [k12(53.8), k12(55.9)], [k12(56), k12(59.9)]] }}
      hud={<><Hud2 /><Cuenta24 />
        <Burbuja x={930} y={330} r={180} desde={k12(56.4)} cx={cab.x - 60} cy={cab.y - 60}>
          <rect x={-120} y={-120} width={240} height={240} fill="#ffd9a0" /><rect x={-120} y={50} width={240} height={80} fill="#e2b47e" />
          <g transform="translate(0,20)"><MiniPalacio s={0.8} /></g>
          <g transform="translate(0,62)"><circle cx={0} cy={-46} r={14} fill="#dfa877" stroke="#2a2622" strokeWidth={3} /><path d="M-14,-32 L14,-32 L18,10 L-18,10 Z" fill="#f1e2c0" stroke="#2a2622" strokeWidth={3} /><path d="M-10,-60 L-6,-70 L0,-62 L6,-70 L10,-60 Z" fill="#e0b040" /></g>
        </Burbuja>
        <Etiqueta texto="NEVER SEEN A PHONE" x={930} y={110} desde={k12(57.4)} tam={40} color="#ffd38a" /></>} />
  );
};
// ---------- 13 · detrás de Leo algo se estira, bosteza y sonríe ----------
export const Q13Estira: React.FC = () => (
  <Lav cl={[mira(0, L.leo - 40, 590, 1.75), mira(139, L.leo - 70, 570, 1.95, { curva: "inout" })]} tenzo={{ no: true }} toalla={-1}
    mara={{ opacidad: fade(0, 40, 0.96), poses: [{ f: 0, v: { tronco: 10, cabeza: 20, hD: 10, cD: 10, hI: 10, cI: 10 } }, { f: 40, v: { tronco: -8, cabeza: -14, hD: 170, cD: 20, hI: -170, cI: -20 } }, { f: 90, v: { hD: 70, cD: 80, hI: 30, cI: 60, tronco: 16, cabeza: 18 } }],
      caras: [{ f: 0, v: "cansado" }, { f: 40, v: "sorpresa" }, { f: 90, v: "picaro" }] }}
    leo={leoSent({ poses: [{ f: 0, v: AFERRA }, { f: 66, v: { ...SENTADO, hD: 40, cD: 125, hI: 45, cI: 115, cabeza: 14, tronco: 16 } }], caras: [{ f: 0, v: "duda" }, { f: 70, v: "miedo" }], miradas: [{ f: 0, v: MIRA_T }, { f: 74, v: { x: -0.9, y: -0.3 } }], giros: [{ f: 0, v: 0 }, { f: 74, v: -0.5 }] })} hud={<Hud2 />} />
);
// ---------- 14 · «don't give it to him… you hate being alone with yourself» ----------
const k14 = kDe(64.6);
export const Q14NoSelo: React.FC = () => (
  <Lav cl={[mira(0, L.leo + 20, 560, 1.85), mira(141, L.leo + 10, 550, 2.0)]} tenzo={{ no: true }} toalla={-1}
    mara={{ opacidad: () => 0.96, ruta: [{ f: 0, x: L.leo - 40, y: LP - 10 }], poses: [{ f: 0, v: { hD: 100, cD: 40, hI: 60, cI: 50, tronco: 24, cabeza: 24 } }, { f: 30, v: { hD: 70, cD: 95, hI: 75, cI: 90, tronco: 30, cabeza: 26 } }], caras: [{ f: 0, v: "picaro" }], habla: [[0, k14(65.46)], [k14(65.76), k14(69.2)]] }}
    leo={leoSent({ poses: [{ f: 0, v: AFERRA }, { f: 40, v: AFERRA2 }], caras: [{ f: 0, v: "miedo" }, { f: 90, v: "triste" }] })}
    hud={<><Hud2 /><ManoMara texto="don't give it to him" x={1180} y={250} desde={2} hasta={k14(65.7)} tam={78} /><ManoMara texto={"you hate being\nalone with yourself"} x={1180} y={230} desde={k14(67.3)} tam={72} /></>} />
);
// ---------- 15 · el farol titila y el lavadero desaparece ----------
export const Q15Titila: React.FC = () => {
  const f = useF();
  const { fps } = useVideoConfig();
  const cl15 = [mira(0, 1450, 620, 1.5), mira(101, 1560, 640, 1.85, { curva: "inout" })];
  const fp = enPantalla(cl15, f, fps, L.farol, LP - 170);
  const r = interpolate(f, [48, 98], [0, 2300], { ...cl, easing: (t) => t * t });
  return (
    <>
      <Lav cl={cl15} toalla={-1} sp={{ luzFarol: f % 9 < 3 ? 0.4 : 1.4 + f / 60 }} tenzo={tenzoPela({ miradas: [{ f: 0, v: { x: -0.3, y: 0.6 } }, { f: 30, v: { x: 0.5, y: -0.4 } }], caras: [{ f: 0, v: "feliz" }] })}
        leo={leoSent({ poses: [{ f: 0, v: AFERRA }], caras: [{ f: 0, v: "duda" }, { f: 30, v: "sorpresa" }], miradas: [{ f: 0, v: MIRA_T }, { f: 26, v: { x: 0.8, y: -0.2 } }] })} hud={<Hud2 />} />
      <Lienzo><defs><radialGradient id="iris15"><stop offset="0.7" stopColor="#fff2d0" /><stop offset="1" stopColor="#fff2d0" stopOpacity={0} /></radialGradient></defs><circle cx={fp.x} cy={fp.y} r={r} fill="url(#iris15)" /></Lienzo>
    </>
  );
};
// ---------- 16 · Kapilavastu, al pie del Himalaya ----------
export const Q16Kapila: React.FC = () => {
  const f = useF();
  return (
    <Kap cl={[mira(0, 1750, 560, 1.0), mira(147, 1250, 600, 1.15, { curva: "inout" })]} sp={{ flores: 0.4 }}
      medio={<>
        <Elefante x={interpolate(f, [0, 147], [2250, 1750])} piso={KP} dir={-1} s={0.95} paso={f / 34} />
        <A look={ALDEANA} seed={46} ruta={[{ f: 0, x: 560, y: KP }, { f: 147, x: 1100, y: KP, curva: "lineal" }]} poses={[{ f: 0, v: { hD: 160, cD: 20 } }]} enManoD={<Recto ang={180}><g transform="translate(0,-26)"><path d="M-20,0 Q-24,-36 0,-40 Q24,-36 20,0 Z" fill="#c8703a" stroke="#6a3a1a" strokeWidth={3} /></g></Recto>} caras={[{ f: 0, v: "feliz" }]} ajuste={(p) => ({ ...p, hD: 160, cD: 20 })} />
        <A look={ALDEANO} seed={47} ruta={[{ f: 0, x: 380, y: KP }, { f: 147, x: 860, y: KP, curva: "lineal" }]} caras={[{ f: 0, v: "feliz" }]} />
        <A look={ALDEANO} seed={48} escala={ESC * 0.72} ruta={[{ f: 0, x: 1400, y: KP }, { f: 147, x: 900, y: KP, curva: "lineal" }]} correr={0.6} caras={[{ f: 0, v: "risa" }]} />
      </>}
      hud={<><Etiqueta texto="2,500 YEARS AGO" x={960} y={150} desde={30} tam={64} color="#fff2c8" /><Rotulo texto="KAPILAVASTU · FOOT OF THE HIMALAYAS" desde={8} /></>} />
  );
};
// rey en el trono (sala)
const Rey: React.FC<{ o?: object }> = ({ o = {} }) => <A look={REY} seed={31} ruta={[{ f: 0, x: K.trono, y: KP }]} asiento={[{ f: 0, v: 56 }]} poses={[{ f: 0, v: SENTADO }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }]} {...o} />;
// ---------- 17 · un rey llamado Suddhodana acaba de tener un hijo ----------
export const Q17Rey: React.FC = () => (
  <Kap cl={[mira(0, K.trono - 60, 610, 1.55), mira(93, K.trono - 60, 590, 1.7, { curva: "inout" })]}
    medio={<A look={REY} seed={31} ruta={[{ f: 0, x: K.trono, y: KP }, { f: 20, x: K.trono, y: KP }, { f: 40, x: K.trono - 90, y: KP }]} asiento={[{ f: 0, v: 56 }, { f: 14, v: undefined }]} dir={[{ f: 0, v: -1 }]}
      poses={[{ f: 0, v: { ...SENTADO, hD: 60, cD: 80, hI: 50, cI: 90 } }, { f: 16, v: { hD: 70, cD: 80, hI: 60, cI: 90 } }, { f: 44, v: { hD: 125, cD: 30, hI: 120, cI: 30, cabeza: -12, tronco: -6 } }]}
      caras={[{ f: 0, v: "feliz" }, { f: 44, v: "risa" }]} miradas={[{ f: 0, v: { x: -0.6, y: 0.5 } }, { f: 44, v: { x: -0.2, y: -0.9 } }]}
      enManoD={(fr: number) => <Recto ang={fr < 30 ? 140 : 149}><BebeMano s={1.2} /></Recto>} />}
    hud={<Pildora texto="KING SUDDHODANA" x={960} y={110} desde={10} color="#ffe2a6" tam={40} />} />
);
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
export const Q19Asita: React.FC = () => {
  const f = useF();
  return (
    <Kap cl={[mira(0, -1000, 600, 1.25), mira(120, -820, 600, 1.4, { curva: "inout" }), mira(213, -800, 600, 1.45)]}
      medio={<>
        <BebeVivo x={K.cuna} piso={KP} brazo={0.3} ojos={1} />
        <Rey o={{ poses: [{ f: 0, v: SENTADO }, { f: 160, v: { hD: 60, cD: 40, hI: 50, cI: 40 } }], asiento: [{ f: 0, v: 56 }, { f: 150, v: undefined }], caras: [{ f: 0, v: "feliz" }, { f: 150, v: "sorpresa" }] }} />
        <A look={ASITA} seed={32} ruta={[{ f: 0, x: -1500, y: KP }, { f: 110, x: K.cuna - 190, y: KP }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: "parado" }, { f: 115, v: { tronco: 22, cabeza: 18, hD: 40, cD: 40, hI: 30, cI: 30 } }, { f: 170, v: { hD: 40, cD: 150, hI: 30, cI: 100, cabeza: 10, tronco: 8 } }]} caras={[{ f: 0, v: "feliz" }, { f: 140, v: "triste" }]} />
        <Lagrimas x={K.cuna - 172} y={KP - 262} f={f} desde={145} dx={20} />
      </>}
      hud={<Pildora texto="DAY 7 · THE SAGE ASITA" x={960} y={110} desde={8} color="#ffe2a6" tam={38} />} />
  );
};
// ---------- 20 · «why are you crying? is something wrong with my son?» ----------
const k20 = kDe(90.56);
export const Q20PorQue: React.FC = () => {
  const f = useF();
  return (
    <Kap cl={[mira(0, -640, 610, 1.45), mira(44, -960, 610, 1.85, { curva: "inout" }), mira(140, -960, 615, 1.95)]}
      medio={<>
        <BebeVivo x={K.cuna} piso={KP} brazo={0.3} ojos={1} />
        <A look={ASITA} seed={32} ruta={[{ f: 0, x: K.cuna - 190, y: KP }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 40, cD: 150, hI: 30, cI: 100, cabeza: 10, tronco: 8 } }, { f: 60, v: { hD: 30, cD: 60, hI: 20, cI: 40, cabeza: 0 } }]} caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: { x: 0.4, y: 0.6 } }, { f: 50, v: { x: 0.9, y: 0 } }]} />
        <Lagrimas x={K.cuna - 172} y={KP - 262} f={f} desde={0} dx={20} />
        <A look={REY} seed={31} ruta={[{ f: 0, x: K.trono - 60, y: KP }, { f: 36, x: K.cuna - 40, y: KP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "miedo" }]} habla={[[0, k20(91.68)], [k20(92.98), k20(94.96)]]}
          poses={[{ f: 0, v: { hD: 60, cD: 40, hI: 50, cI: 40 } }, { f: 38, v: { hD: 95, cD: 20, hI: 60, cI: 50, tronco: 8 } }, { f: 80, v: { hD: 85, cD: 30, hI: 40, cI: 120, tronco: 10 } }]} />
      </>} />
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
    : <Kap cl={[mira(0, 2780, 600, 1.15), mira(80, 2880, 600, 1.25, { curva: "inout" })]} sp={{ noche: true, portonAbierto: 1 }}
      medio={<A look={SIDDHARTHA} seed={30} luz={rimOro} ruta={[{ f: 0, x: 2560, y: KP }, { f: 78, x: 3020, y: KP, curva: "lineal" }]} caras={[{ f: 0, v: "neutral" }]} opacidad={(fr) => interpolate(fr, [50, 76], [1, 0], cl)} />}
      hud={<Etiqueta texto="HE WILL WALK AWAY" x={960} y={140} desde={6} tam={50} color="#fff2c8" />} />;
};
// ---------- 23 · el rey decide: su hijo nunca verá sufrimiento ----------
const k23 = kDe(108.96);
export const Q23Decision: React.FC = () => (
  <Kap cl={[mira(0, K.trono - 60, 600, 1.55), mira(141, K.trono - 60, 590, 1.8, { curva: "inout" })]}
    medio={<A look={REY} seed={31} ruta={[{ f: 0, x: K.trono - 200, y: KP }, { f: 50, x: K.trono - 60, y: KP }]} dir={[{ f: 0, v: 1 }, { f: 54, v: -1 }]} caras={[{ f: 0, v: "duda" }, { f: 54, v: "determinado" }, { f: k23(110.8), v: "enojo" }]}
      poses={[{ f: 0, v: "pensar" }, { f: 54, v: { hD: 70, cD: 70, hI: 65, cI: 85 } }, { f: k23(110.6), v: { hD: 110, cD: 110, hI: 65, cI: 85 } }, { f: k23(110.9), v: { hD: 70, cD: 80, hI: 65, cI: 85, tronco: 6 } }]} />}
    hud={<><Etiqueta texto="NEVER." x={640} y={150} desde={k23(110.9)} tam={64} color="#fff2c8" /><Etiqueta texto="SEE." x={960} y={150} desde={k23(111.6)} tam={64} color="#fff2c8" /><Etiqueta texto="SUFFERING." x={1320} y={150} desde={k23(112.3)} tam={64} color="#ffb060" /></>} />
);
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
      hud={<><Etiqueta texto="MUSIC · DAY AND NIGHT" x={960} y={130} desde={10} hasta={k25(123)} tam={48} color="#fff2c8" /><Etiqueta texto="EVERY DEAD FLOWER · GONE BEFORE DAWN" x={960} y={130} desde={k25(124.2)} tam={44} color="#fff2c8" /></>} />
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
// ---------- 28 · Siddhartha crece entre caras jóvenes, música y jardines perfectos ----------
export const Q28Crece: React.FC = () => {
  const f = useF();
  const e = lerp(f, 0, 140, 0.68, 1);
  return (
    <Kap cl={[mira(0, 1420, 650, 1.5), mira(150, 1480, 640, 1.6, { curva: "inout" })]} sp={{ flores: 0.8 }}
      medio={<>
        <A look={ALDEANA} seed={60} ruta={[{ f: 0, x: 1120, y: KP }]} dir={[{ f: 0, v: 1 }]} poses={ciclo({ hD: 60, cD: 80, hI: 50, cI: 90 }, { hD: 75, cD: 60, hI: 65, cI: 70 }, 10, 150)} caras={[{ f: 0, v: "risa" }]} />
        <A look={ALDEANO} seed={61} ruta={[{ f: 0, x: 1820, y: KP }]} dir={[{ f: 0, v: -1 }]} poses={ciclo({ hD: 60, cD: 80, hI: 50, cI: 90 }, { hD: 75, cD: 60, hI: 65, cI: 70 }, 12, 150)} caras={[{ f: 0, v: "feliz" }]} />
        <A look={SIDDHARTHA} seed={30} escala={ESC * e} ruta={[{ f: 0, x: 1200, y: KP }, { f: 40, x: 1700, y: KP }, { f: 80, x: 1350, y: KP }, { f: 130, x: 1560, y: KP }]} caras={[{ f: 0, v: "risa" }, { f: 90, v: "feliz" }]} />
        <A look={ALDEANO} seed={62} escala={ESC * e * 0.98} ruta={[{ f: 0, x: 1050, y: KP }, { f: 44, x: 1550, y: KP }, { f: 84, x: 1200, y: KP }, { f: 134, x: 1380, y: KP }]} caras={[{ f: 0, v: "risa" }]} />
      </>}
      hud={<Contador x={90} y={200} alinear="der" tam={54} lineas={[{ etiqueta: "AGE", claves: [{ f: 0, v: 6 }, { f: 30, v: 10, d: 30 }, { f: 80, v: 15, d: 30 }, { f: 120, v: 19, d: 24 }], color: "#ffd38a" }]} />} />
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
export const Q31Callado: React.FC = () => {
  const c0 = mira(0, L.leo + 170, 650, 2.05);
  return (
    <Lav cl={[c0, mira(88, L.leo + 175, 650, 2.15)]} toalla={-1} tenzo={{ no: true }}
      leo={leoSent({ poses: [{ f: 0, v: { ...CEL_SENT, cabeza: 10 } }], caras: [{ f: 0, v: "triste" }], miradas: [{ f: 0, v: { x: 0.2, y: 0.9 } }, { f: 40, v: { x: 0.6, y: 0.2 } }] })}
      hud={<><HombroTenzo /><Hud2 /><Etiqueta texto="VERY QUIET" x={1300} y={200} desde={20} tam={44} /></>} />
  );
};
// ---------- 32 · «the palace… it's the feed» ----------
const k32 = kDe(150.67);
const FEED = ["cara", "cuerpo", "comida", "cara", "cuerpo", "comida", "cara", "cuerpo"] as const;
export const Q32Feed: React.FC = () => {
  const f = useF();
  const m = lerp(f, 10, 48, 0, 1);
  return (
    <Fondo>
      <TelMarco x={1260} y={540} s={0.9}>
        <div style={{ position: "absolute", inset: 0, opacity: m }}>{FEED.slice(0, 3).map((t, i) => <TarjetaIcono key={i} y={60 + i * 420 - lerp(f, 30, 88, 0, 260)} t={t} likes={1200 + i * 830 + f * 7} />)}</div>
      </TelMarco>
      <Lienzo>
        <g transform={`translate(${lerp(f, 0, 44, 520, 1260)},520) scale(${lerp(f, 0, 44, 2.2, 1.1)})`} opacity={1 - m}><MiniPalacio /></g>
        <Trazo d="M640,760 Q900,860 1080,700" p={lerp(f, 4, 30, 0, 1)} color="#f4efe6" w={7} />
      </Lienzo>
      <ManoLeo texto="the palace…" x={150} y={230} desde={4} tam={104} />
      <ManoLeo texto="it's the feed" x={150} y={370} desde={k32(152.3)} tam={104} />
      <Hud2 />
    </Fondo>
  );
};
// ---------- 33 · Tenzo sonríe y se come un gajo ----------
const Gajo: React.FC = () => <path d="M-14,0 Q0,-20 14,0 Q0,8 -14,0 Z" fill="#ffa040" stroke="#c8601a" strokeWidth={2} />;
export const Q33Gajo: React.FC = () => (
  <Lav cl={[mira(0, 1450, 660, 1.75), mira(112, 1470, 660, 1.85, { curva: "inout" })]} toalla={-1}
    leo={leoSent({ poses: [{ f: 0, v: { ...CEL_SENT, cabeza: 10 } }, { f: 70, v: { ...CEL_SENT, cabeza: -2 } }], miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }, { f: 66, v: { x: 0.9, y: 0.1 } }], caras: [{ f: 0, v: "triste" }, { f: 80, v: "duda" }] })}
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
export const Q35Scroll: React.FC = () => {
  const f = useF();
  const sw = lerp(f, 52, 62, 0, 1);
  return (
    <Fondo>
      <TelMarco x={960} y={540} s={0.92}><Feed vel={3} desde={-120} triste={2} salto={[54, 66]} /></TelMarco>
      <Lienzo o={lerp(f, 40, 48, 0, 1)}><ManoGrande x={1180} y={940 - sw * 280 + (f > 62 ? lerp(f, 62, 80, 0, 280) : 0)} ang={-18} piel="#ecc9a3" manga="#24242a" s={0.75} /></Lienzo>
      <Etiqueta texto="SOMETHING SAD…" x={430} y={420} desde={24} hasta={70} tam={44} color="#c9ccd2" />
      <Etiqueta texto="SKIP" x={1500} y={420} desde={58} tam={86} color="#ff6a2b" />
      <Hud2 />
    </Fondo>
  );
};
// ---------- 36 · «hmm. And are you happy, in your palace?» ----------
const k36 = kDe(170.33);
export const Q36Feliz: React.FC = () => {
  const c0 = mira(0, 1500, 640, 2.15);
  return (
    <Lav cl={[c0, mira(124, 1510, 635, 2.4, { curva: "inout" })]} leo={{ no: true }} toalla={-1}
      tenzo={tenzoPela({ poses: [{ f: 0, v: PELA }, { f: k36(171.2), v: { ...SENTADO, hD: 40, cD: 50, hI: 30, cI: 60, cabeza: -2 } }], miradas: [{ f: 0, v: { x: -0.3, y: 0.5 } }, { f: k36(171.2), v: { x: 0, y: 0 } }], giros: [{ f: 0, v: 0.5 }, { f: k36(171.2), v: 0 }], habla: [[0, k36(171)], [k36(172.21), k36(174.47)]], caras: [{ f: 0, v: "neutral" }, { f: k36(172.1), v: "feliz" }] })}
      hud={<><HombroLeo /><Hud2 /><Etiqueta texto="ARE YOU HAPPY?" x={760} y={200} desde={k36(172.6)} tam={52} color="#ffd38a" /></>} />
  );
};
// ---------- 37 · Leo no contesta ----------
export const Q37NoContesta: React.FC = () => (
  <Lav cl={[mira(0, L.leo + 60, 650, 2.3), mira(49, L.leo + 60, 650, 2.36)]} tenzo={{ no: true }} toalla={-1}
    leo={leoSent({ poses: [{ f: 0, v: CEL_SENT }, { f: 18, v: { ...CEL_SENT, hD: 20, cD: 90, cabeza: 26 } }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: 14, v: { x: 0.2, y: 0.9 } }], caras: [{ f: 0, v: "duda" }, { f: 16, v: "triste" }] })} hud={<Hud2 />} />
);
// ---------- 38 · el contador sigue: 9h 12m ayer · 6 h ya hoy ----------
export const Q38Contador: React.FC = () => {
  const f = useF();
  const k = kDe(176.09);
  return (
    <Fondo>
      {f < k(181.85) ? <TelGrande modo="screentime" min={552} sub="YESTERDAY" x={1250} desde={0} pulgar /> : <TelGrande modo="screentime" min={300} minHasta={360} x={1250} desde={k(181.85)} pulgar />}
      <ManoLeo texto="9h 12m yesterday" x={110} y={330} desde={k(179.2)} tam={100} />
      <ManoLeo texto="6 hours already today" x={110} y={480} desde={k(182.0)} tam={100} />
      <Hud2 />
    </Fondo>
  );
};
// ---------- 39-40 · «one night» — y Leo, muy despacio, le pone el tel en la mano · la pantalla se apaga ----------
const k39 = kDe(183.87);
const ManosEntrega: React.FC<{ t: number; tiembla: number; apaga: number; f: number }> = ({ t, tiembla, apaga, f }) => {
  const trem = Math.sin(f * 1.9) * 5 * tiembla;
  const suelta = t > 0.82;
  const lx = 420 + t * 420 + trem, ly = 560 + trem * 0.6;
  const telY = suelta ? 580 + Math.min(1, (t - 0.82) * 10) * 60 : ly - 30;
  return (
    <Lienzo>
      <defs><radialGradient id="farol39"><stop offset="0" stopColor="#ffc46a" stopOpacity={0.5} /><stop offset="1" stopColor="#ffc46a" stopOpacity={0} /></radialGradient></defs>
      <rect width={1920} height={1080} fill="#26231f" /><circle cx={1500} cy={260} r={560} fill="url(#farol39)" /><rect y={820} width={1920} height={260} fill="#45423b" />
      <ManoGrande x={1340} y={680} ang={-100} piel="#f2bf8f" manga="#8e8a82" palma />
      <TelSvg x={suelta ? 1130 : lx + 150} y={suelta ? telY : ly - 40} w={170} ang={suelta ? -86 : -80 + trem} prendido={1 - apaga} reflejo={apaga} />
      <g opacity={suelta ? Math.max(0, 1 - (t - 0.82) * 4) : 1}><ManoGrande x={suelta ? lx - (t - 0.82) * 900 : lx} y={ly + 40} ang={95} piel="#ecc9a3" manga="#24242a" /></g>
    </Lienzo>
  );
};
export const Q39Entrega: React.FC = () => {
  const f = useF();
  const ins = k39(184.7);
  if (f < ins) return (
    <Lav cl={[mira(0, 1450, 630, 1.6), mira(ins, 1450, 630, 1.66)]} toalla={-1}
      tenzo={{ poses: [{ f: 0, v: OFRECE }], caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: MIRA_L }], habla: [[0, k39(184.6)]] }}
      leo={leoSent({ poses: [{ f: 0, v: AFERRA }], caras: [{ f: 0, v: "miedo" }] })} hud={<Hud2 />} />
  );
  const t = lerp(f, ins + 10, 170, 0, 1);
  return <AbsoluteFill><ManosEntrega t={suave(t)} tiembla={1 - lerp(f, 140, 160, 0, 1)} apaga={0} f={f} /><Etiqueta texto="VERY SLOWLY" x={420} y={180} desde={ins + 30} tam={46} color="#fff2c8" /><Hud2 /></AbsoluteFill>;
};
export const Q40Negro: React.FC = () => {
  const f = useF();
  return <AbsoluteFill><ManosEntrega t={1} tiembla={0} apaga={lerp(f, 4, 22, 0, 1)} f={f} /><Hud2 /></AbsoluteFill>;
};
// ---------- 41 · detrás del hombro de Leo, la sombra sisea ----------
export const Q41Sisea: React.FC = () => {
  const f = useF();
  const sac = f > 50 && f < 66 ? Math.sin(f * 2.4) * 6 : 0;
  return (
    <Lav cl={[mira(0, L.leo - 40, 540, 1.9), mira(92, L.leo - 30, 540, 2.05)]} tenzo={{ no: true }} toalla={-1}
      mara={{ opacidad: () => 0.97, ruta: [{ f: 0, x: L.leo - 150, y: LP - 10 }], poses: [{ f: 0, v: { hD: 140, cD: 60, hI: 120, cI: 60, tronco: 24, cabeza: 24 } }], caras: [{ f: 0, v: "enojo" }], habla: [[8, 70]] }}
      leo={leoSent({ poses: [{ f: 0, v: { ...SENTADO, hD: 30, cD: 20 } }, { f: 24, v: { ...SENTADO, hD: 160, cD: 140, cabeza: 14, tronco: 8 } }, { f: 48, v: { ...SENTADO, hD: 30, cD: 20 } }], enManoD: () => null,
        caras: [{ f: 0, v: "neutral" }, { f: 20, v: "duda" }, { f: 50, v: "asco" }], miradas: [{ f: 0, v: MIRA_T }, { f: 24, v: { x: -0.5, y: 0.3 } }], ajuste: (p: { tronco: number }) => ({ ...p, tronco: p.tronco + sac }) })}
      hud={<><Hud2 /><ManoMara texto="sssss" x={420} y={220} desde={8} tam={96} /></>} />
  );
};
// ---------- 42 · DAY 2 · SCREEN TIME… ZERO ----------
export const Q42Cero: React.FC = () => {
  const f = useF();
  const hi = lerp(f, 30, 80, 0, 1);
  return (
    <Fondo>
      <TelMarco x={1300} y={520} s={0.86} halo={0.4}>
        <div style={{ position: "absolute", inset: 0, padding: 40, fontFamily: F_HUD }}>
          <div style={{ color: "#9aa0aa", fontSize: 38, marginTop: 40, fontWeight: 600 }}>SCREEN TIME</div>
          <div style={{ color: "#9aa0aa", fontSize: 30 }}>Today</div>
          <div style={{ color: hi > 0.5 ? "#bfe6ff" : "#ff6a2b", fontSize: 180, fontWeight: 700, marginTop: 30 }}>0m</div>
        </div>
        <svg viewBox="0 0 476 956" width={476} height={956} style={{ position: "absolute", inset: 0 }}><Hielo x={20} y={150} w={436} h={300} p={hi} /></svg>
      </TelMarco>
      <Etiqueta texto="FROZEN" x={560} y={440} desde={70} tam={70} color="#bfe6ff" />
      <Hud2 m={0} est="congelado" />
      <Rotulo texto="DAY 2 · SCREEN TIME… ZERO" desde={4} />
    </Fondo>
  );
};

export { TENZO, LEO, MARA, FAROL, rimOro };
