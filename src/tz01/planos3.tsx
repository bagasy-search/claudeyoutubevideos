// tz01 · planos 46-86 (211 → 460,6 s): Leo vuelve a mirar; las semanas en el pabellón; Amrapali se rinde; la ola; Tenzo se va; el CTA.
// Vuelta 2 (director): acción de cuerpo entero + componente-concepto de la frase de ESE segundo; cortes secos en vez de paneos rápidos.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../anikit/camara";
import { Actor, ActorProps } from "../anikit/actor";
import { Calendario, F_HUD, Globo, Pildora, Temporizador } from "../anikit/pantalla";
import { Halo } from "../anikit/luz";
import { Comparacion, Grafico, Medidor, Velo, conReaccion, ReaccionFx } from "../anikit/explica";
import { ACENTO, AMRAPALI, AMRAPALI_MONJA, ESC, FAROL, LOTO, LOTO_ENSENA, MONJE_JOVEN, ORO } from "../tenzo/elenco";
import { Look } from "../anikit/personaje";
import { ManoMara } from "../tenzo/hud";
import { Cuenco, FarolMano, Tel } from "../tenzo/utileria";
import { Llama, TelGrande } from "../tenzo/graficos";
import { VAI_PISO, VAI_PUNTOS } from "../tenzo/sets/vaishali";
import { CEL_SENT, DOBLA_A, DOBLA_B, doblando, kDe, Lav, LAV_PUNTOS, leoLav, LP, maraLav, rimTel, SENTADO, Vai } from "./base";
import { Fondo, Hud } from "./planos1";
import { Buda, HOMBRE, MONJE, MonjesCara, Notas } from "./planos2";
import { FarolNoche, OlaMundo, PapelVersos, PrincipeFull } from "./extras_4";
import { BrazoLeoOTS, FarolEnManos, NochesFila } from "./extras_3b";
import { PulgarTiembla, FarolCerca, HombroLeo, HombroTenzo, ManoTelTibio, MaraCaja, MaraPrimer, NieveCerca, NubesAbren, OjosTenzo, OpenDerecho, Pajaro, PalmaEspera, PanelOla, Placa, TelCenital, TresDedos, FarolApaga } from "./extras_3";
import { CajaComentario, CaraMara, Collar, Mango, DedosTel, FraseCaja, Hoja, Latido, LlamadaMundo, manoMundo, Pensamiento, TelVuelta, Tira30, lerp } from "./extras";

const VP = VAI_PISO, V = VAI_PUNTOS, L = LAV_PUNTOS;
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const A: React.FC<ActorProps> = (p) => <Actor escala={ESC} {...p} />;
const MX = V.pabellon - 200; // el monje sentado en el pabellón
const AMRA_SIN_JOYAS: Look = { ...AMRAPALI, accesorios: [{ t: "pelo", forma: "cola", color: "#1e1410" }, { t: "tunica", color: "#b8323a", largo: 1 }] };
const AMRA_VELO: Look = { ...AMRAPALI_MONJA, accesorios: [{ t: "capucha", color: "#e6dac2" }, { t: "pelo", forma: "bob", color: "#f6efe0" }, { t: "tunica", color: "#e9dcc4", largo: 1 }] };
const AMRA_VIEJA: Look = { ...AMRAPALI_MONJA, accesorios: [{ t: "pelo", forma: "bob", color: "#c9c2b6" }, { t: "tunica", color: "#e9dcc4", largo: 1 }] };
const MIRA_TENZO = { x: 0.9, y: 0 };
const H83 = { m: 583 }; // desde el plano 73 el contador queda en 9h 43m
const TINTA = "#221c18";
// corte seco: dos claves pegadas (el salto >90 px/cuadro no lleva blur)
const corte = (f: number, X: number, Y: number, z: number) => [mira(f, X, Y, z)];
// escala alrededor de un punto del mundo (la sombra que se agranda / se achica)
const Escalar: React.FC<{ x: number; y: number; s: number; children: React.ReactNode }> = ({ x, y, s, children }) => <g transform={`translate(${x},${y}) scale(${s}) translate(${-x},${-y})`}>{children}</g>;

// el monje en el pabellón (loto) y Amrapali bailando
const MonjePab: React.FC<{ o?: Partial<ActorProps> }> = ({ o = {} }) => (
  <A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: MX, y: VP - 40 }]} asiento={[{ f: 0, v: 8 }]} poses={[{ f: 0, v: LOTO }]} caras={[{ f: 0, v: "neutral" }]} dir={[{ f: 0, v: 1 }]} {...o} />
);
const BAILE_A = { hD: 125, cD: 40, hI: -60, cI: -30, tronco: 8, cabeza: 6 };
const BAILE_B = { hD: 60, cD: -30, hI: -125, cI: -40, tronco: -8, cabeza: -6 };
const bailando = (hasta: number, p = 30) => Array.from({ length: Math.ceil(hasta / p) }).map((_, i) => ({ f: i * p, v: i % 2 ? BAILE_B : BAILE_A }));
// respira: mano en el abdomen que sube y baja con el aire (lo que dice la voz: «and he breathed»)
const respira = (base: Record<string, number>, desde: number, hasta: number, p = 40) => {
  const out: { f: number; v: Record<string, number> }[] = [{ f: 0, v: base }];
  for (let f = desde; f < hasta; f += p) out.push({ f, v: { ...base, tronco: base.tronco - 5, cabeza: -4 } }, { f: f + p / 2, v: base });
  return out;
};

// ---------- dibujos para los globos de pensamiento (coords 0..w × 0..h) ----------
const BarDibujo: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const f = useF();
  const sw = 7 * Math.sin(f / 7);
  const k = h / 150; // el cantinero ocupa casi todo el alto
  const hic = (f % 40) < 16;
  return (
    <g>
      <rect width={w} height={h} fill="#3a2a22" />
      {/* estantes con botellas */}
      {[0, 1].map((r) => <g key={r}><rect x={0} y={60 + r * 110} width={w} height={10} fill="#5a3a2a" />
        {Array.from({ length: 13 }).map((_, j) => <g key={j}><rect x={24 + j * 62} y={60 + r * 110 - 70 + (j % 2) * 8} width={28} height={70 - (j % 2) * 8} rx={6} fill={["#7ab060", "#c8803a", "#4a7ab0", "#d9c060", "#a8322c"][(j + r) % 5]} /><rect x={33 + j * 62} y={60 + r * 110 - 86 + (j % 2) * 8} width={10} height={18} fill="#2a1a12" /></g>)}</g>)}
      {/* el cantinero: el borracho con delantal STAFF, se toma la botella */}
      <g transform={`translate(${w * 0.5},${h - 60}) rotate(${sw}) scale(${k * 0.55})`}>
        <circle cx={0} cy={-150} r={34} fill="#e9b88a" stroke={TINTA} strokeWidth={5} />
        <circle cx={-6} cy={-138} r={9} fill="#e2483a" opacity={0.6} /><circle cx={16} cy={-138} r={9} fill="#e2483a" opacity={0.6} />
        <path d="M-16,-156 l9,6 M16,-156 l-9,6" stroke={TINTA} strokeWidth={4} />
        <path d="M0,-116 L0,-30 M0,-104 L-40,-60 M0,-104 L36,-150" stroke={TINTA} strokeWidth={8} strokeLinecap="round" />
        <rect x={26} y={-196} width={18} height={50} rx={6} fill="#7ab060" stroke={TINTA} strokeWidth={3} transform="rotate(140 35 -170)" />
        <path d="M-24,-100 L24,-100 L30,-20 L-30,-20 Z" fill="#f4efe6" stroke={TINTA} strokeWidth={4} />
        <text x={0} y={-56} textAnchor="middle" fontSize={15} fontWeight={800} fill={TINTA}>STAFF</text>
      </g>
      {hic && <text x={w * 0.66} y={h * 0.42} fontSize={h * 0.11} fontWeight={800} fill="#f2d070">hic!</text>}
      {/* barra */}
      <rect x={0} y={h - 70} width={w} height={70} fill="#8a5a3a" stroke={TINTA} strokeWidth={4} />
      <g transform={`translate(${w * 0.07},${h - 150})`}><rect width={200} height={64} rx={8} fill="#f4efe6" stroke={TINTA} strokeWidth={4} /><text x={100} y={42} textAnchor="middle" fontSize={30} fontWeight={800} fill="#a8322c">NOW HIRING</text></g>
    </g>
  );
};
const MonjeIcono: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle cx={0} cy={-58} r={24} fill="#d9a273" stroke={TINTA} strokeWidth={4} />
    <path d="M-34,10 Q0,-46 34,10 Z" fill="#e07a2c" stroke={TINTA} strokeWidth={4} />
    <ellipse cx={0} cy={12} rx={48} ry={12} fill="#e07a2c" stroke={TINTA} strokeWidth={4} />
  </g>
);
const NoMonje: React.FC<{ tacha: number }> = ({ tacha }) => (
  <g>
    <MonjeIcono x={110} y={170} />
    <text x={220} y={128} fontSize={44} fontWeight={700} fill={TINTA}>≠</text>
    <g transform="translate(330,170)"><circle cx={0} cy={-58} r={24} fill="#e9c29a" stroke={TINTA} strokeWidth={4} /><path d="M-22,-74 l8,-14 l8,10 l8,-12 l8,12 l8,-10" fill="#1a1414" stroke={TINTA} strokeWidth={3} /><rect x={-26} y={-34} width={52} height={50} rx={10} fill="#2a2a30" stroke={TINTA} strokeWidth={4} /></g>
    <path d="M60,90 L170,200 M170,90 L60,200" stroke={ACENTO} strokeWidth={10} strokeLinecap="round" opacity={tacha} />
  </g>
);
const ArrozDibujo: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const f = useF();
  return (
    <g>
      <rect width={w} height={h} fill="#fbf2df" />
      {[0, 1, 2].map((k) => <path key={k} d={`M${w / 2 - 50 + k * 50},${h * 0.42} q${14 * Math.sin(f / 9 + k)},-30 0,-60 q${-14 * Math.sin(f / 9 + k)},-30 0,-60`} stroke="#c9b8a0" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.8} />)}
      <ellipse cx={w / 2} cy={h * 0.5} rx={120} ry={34} fill="#fffaf0" stroke={TINTA} strokeWidth={5} />
      {Array.from({ length: 14 }).map((_, k) => <ellipse key={k} cx={w / 2 - 90 + (k % 7) * 30} cy={h * 0.47 + Math.floor(k / 7) * 12} rx={7} ry={4} fill="#f4ede0" stroke="#b8ab95" strokeWidth={1.5} />)}
      <path d={`M${w / 2 - 120},${h * 0.5} Q${w / 2},${h * 0.95} ${w / 2 + 120},${h * 0.5}`} fill="#8a4a2a" stroke={TINTA} strokeWidth={5} />
      <path d={`M${w / 2 + 60},${h * 0.18} L${w / 2 + 150},${h * 0.62}`} stroke="#b8803a" strokeWidth={7} strokeLinecap="round" transform={`rotate(${10 * Math.sin(f / 6)} ${w / 2 + 100} ${h * 0.4})`} />
    </g>
  );
};
const PerroDibujo: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const f = useF();
  return (
    <g>
      <rect width={w} height={h} fill="#e9e4da" />
      <rect x={w - 120} y={30} width={90} height={h - 60} rx={6} fill="#8a6a4a" stroke={TINTA} strokeWidth={4} /><circle cx={w - 46} cy={h / 2} r={6} fill="#f2c14a" />
      <g transform={`translate(${w * 0.36},${h - 50})`}>
        <ellipse cx={0} cy={-26} rx={90} ry={30} fill="#3a3038" stroke={TINTA} strokeWidth={4} />
        <circle cx={-86} cy={-40} r={30} fill="#3a3038" stroke={TINTA} strokeWidth={4} />
        <path d="M-104,-62 l-10,-26 l22,14 Z" fill="#3a3038" stroke={TINTA} strokeWidth={3} />
        <path d="M-96,-44 q6,4 12,0" stroke="#ff8a4a" strokeWidth={3} fill="none" />
        <path d={`M86,-30 q30,${-10 + 6 * Math.sin(f / 10)} 40,-26`} stroke="#3a3038" strokeWidth={10} strokeLinecap="round" fill="none" />
      </g>
      {[0, 1, 2].map((k) => <text key={k} x={w * 0.2 + k * 26} y={60 - k * 20 - ((f / 3) % 12)} fontSize={26 + k * 6} fill="#6a707b" fontWeight={700}>z</text>)}
    </g>
  );
};
// lluvia de primer plano (pantalla) + el marco de la ventana que aparece con «from a window»
const LluviaCerca: React.FC<{ marco: number }> = ({ marco }) => {
  const f = useF();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {Array.from({ length: 70 }).map((_, k) => { const x = (k * 137) % 1980 - 30, y = ((k * 211 + f * 34) % 1300) - 150; return <line key={k} x1={x} y1={y} x2={x - 10} y2={y + 70} stroke="#f4dcb0" strokeWidth={3} opacity={0.45} />; })}
        <g opacity={marco}>
          <path d="M0,0 H1920 V1080 H0 Z M110,90 V990 H1810 V90 Z" fill="#3a2418" fillRule="evenodd" />
          <rect x={950} y={90} width={22} height={900} fill="#3a2418" /><rect x={110} y={520} width={1700} height={20} fill="#3a2418" />
          <rect x={90} y={980} width={1740} height={40} fill="#5a3a26" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
// pétalos de jazmín que caen (mundo)
const Jazmin: React.FC<{ x: number; y: number; desde: number }> = ({ x, y, desde }) => {
  const f = useF();
  if (f < desde) return null;
  return <g>{Array.from({ length: 14 }).map((_, k) => { const t = f - desde - k * 5; if (t < 0) return null; const yy = y + t * 1.3, xx = x + ((k * 97) % 520) - 260 + 14 * Math.sin(t / 10 + k); return <g key={k} transform={`translate(${xx},${yy}) rotate(${t * 4 + k * 30})`} opacity={lerp(t, 0, 8, 0, 1) * lerp(yy, 560, 600, 1, 0)}>{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-5} rx={3} ry={6} fill="#fffaf0" transform={`rotate(${a})`} />)}<circle r={2} fill="#f2c14a" /></g>; })}</g>;
};
// ondas del zumbido de la secadora (mundo)
const Zumbido: React.FC<{ x: number; y: number; desde: number }> = ({ x, y, desde }) => {
  const f = useF();
  if (f < desde) return null;
  const g = f - desde;
  return (
    <g transform={`translate(${x + 3 * Math.sin(g * 2.3)},${y})`}>
      {[0, 1, 2].map((k) => { const t = ((g / 10 + k / 3) % 1); return <g key={k} opacity={1 - t}><path d={`M${70 + t * 90},${-60 - t * 30} Q${100 + t * 110},0 ${70 + t * 90},${60 + t * 30}`} fill="none" stroke={ACENTO} strokeWidth={8} strokeLinecap="round" /><path d={`M${-70 - t * 90},${-60 - t * 30} Q${-100 - t * 110},0 ${-70 - t * 90},${60 + t * 30}`} fill="none" stroke={ACENTO} strokeWidth={8} strokeLinecap="round" /></g>; })}
      <text x={0} y={-120} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize={64} fill={ACENTO} opacity={lerp(g, 0, 4, 0, 1)}>BZZZ</text>
    </g>
  );
};
// campanita de la puerta que se hamaca (mundo)
const Campanita: React.FC<{ x: number; y: number; desde: number }> = ({ x, y, desde }) => {
  const f = useF();
  const g = Math.max(0, f - desde);
  const a = f < desde ? 0 : 28 * Math.exp(-g / 18) * Math.sin(g / 2.4);
  return (
    <g transform={`translate(${x},${y})`}>
      <line x1={0} y1={-40} x2={0} y2={0} stroke="#8a8f99" strokeWidth={4} />
      <g transform={`rotate(${a})`}><path d="M-22,34 Q-22,0 0,0 Q22,0 22,34 Z" fill="#e0b040" stroke={TINTA} strokeWidth={3} /><circle cx={0} cy={38} r={6} fill="#a8803a" /></g>
      {f >= desde && g < 40 && [0, 1].map((k) => <path key={k} d={`M${30 + k * 16},${-4 - k * 6} q12,20 0,40`} stroke="#ffe2a6" strokeWidth={4} fill="none" opacity={1 - g / 40} />)}
    </g>
  );
};

// ---------- 46 · Leo levanta la vista por primera vez → corte: se inclina hacia el viejo «wait, he just let him go?» ----------
const k46 = kDe(210.98);
// v3: el segundo tramo es CONTRAPLANO desde atrás de Tenzo (hombro en primer término); Leo baja el tel del todo hasta el regazo.
export const P46Levanta: React.FC = () => {
  const f = useF();
  const contra = f >= 97;
  return (
    <>
      <Lav cl={contra ? [mira(97, 1300, 650, 2.0), mira(180, 1290, 648, 2.1)] : [mira(0, 1180, 700, 2.7), mira(96, 1170, 690, 2.85)]} tenzo={contra ? { no: true } : { poses: doblando(0, 180, 40) }} mara={contra ? { no: true } : { opacidad: () => 0.85 }}
        leo={{ poses: [{ f: 0, v: CEL_SENT }, { f: k46(212.3), v: { ...CEL_SENT, cabeza: 0 } }, { f: k46(213.1), v: { ...SENTADO, hD: 12, cD: 40, hI: 8, cI: 30, cabeza: -4 } }, { f: k46(214.3), v: { ...SENTADO, tronco: 20, hD: 4, cD: 8, hI: 70, cI: 30, cabeza: -6 } }, { f: k46(215.4), v: { ...SENTADO, tronco: 24, hD: 2, cD: 4, hI: 110, cI: 40, cabeza: -10 } }, { f: k46(216.2), v: { ...SENTADO, tronco: 26, hD: 2, cD: 4, hI: 80, cI: 10, cabeza: -6 } }],
          enManoD: (fr: number) => <g transform={fr >= k46(214.0) ? "translate(0,10) rotate(80)" : undefined}><Tel prendido={fr < k46(214.6)} /></g>,
          miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }, { f: k46(212.4), v: MIRA_TENZO }], caras: [{ f: 0, v: "cansado" }, { f: k46(212.5), v: "sorpresa" }, { f: k46(215.5), v: "duda" }], habla: [[k46(214.24), k46(216.86)]] }}
        hud={<Hud />} />
      {contra && <HombroTenzo x={1660} y={730} r={225} lado={1} />}
      {contra && <Globo texto="He just… let him go?" x={760} y={210} desde={100} hasta={180} cola="abajo" tam={50} />}
    </>
  );
};
// ---------- 47 · el viejo asiente: «he let him go» y abre la mano como quien suelta un pájaro ----------
const k47 = kDe(216.98);
export const P47Asiente: React.FC = () => {
  const f = useF();
  // v3: plano lateral con el farol grande y desenfocado en primer término; asiente con todo el torso y al «he let him go» abre la mano y se suelta un pájaro
  return (
    <>
      <Lav cl={[mira(0, 1790, 640, 2.35), mira(76, 1795, 636, 2.45)]} leo={{ no: true }} toalla={0.5} sp={{ farol: false }}
        extra={<Halo x={1641} y={700} r={170 + 60 * Math.max(0, Math.sin((f - 8) / 4.5))} color={ORO} fuerza={0.35} />}
        tenzo={{ poses: [{ f: 0, v: DOBLA_A }, { f: 8, v: { ...DOBLA_A, cabeza: 30, tronco: 16 } }, { f: 20, v: { ...DOBLA_A, cabeza: 2, tronco: 2 } }, { f: 32, v: { ...DOBLA_A, cabeza: 28, tronco: 14 } }, { f: k47(218.1), v: { ...DOBLA_A, cabeza: 4, tronco: 0, hD: 70, cD: 60 } }, { f: k47(218.6), v: { ...DOBLA_A, cabeza: -10, tronco: -6, hD: 135, cD: 0 } }],
          habla: [[k47(218.14), k47(218.86)]], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }, { f: k47(218.6), v: { x: 0.5, y: -0.8 } }], caras: [{ f: 0, v: "feliz" }, { f: k47(218.6), v: "risa" }] }} hud={<Hud />} />
      <FarolCerca x={300} y={1000} s={4.2} blur={7} />
      <Pajaro x={500} y={660} desde={k47(218.55)} dx={1000} dy={-700} dur={40} s0={2.3} />
    </>
  );
};
// ---------- 48 · «that's insane… like sending an alcoholic to work in a bar»: globo con el bar; Leo hace el gesto de tomar ----------
const k48 = kDe(219.52);
// v3: Leo solo a la izquierda (sin la sombra: rompe el trío), se ríe con el cuerpo; el globo del bar entra con «that's like» y es grande, entero en cuadro
export const P48Bar: React.FC = () => (
  <Lav cl={[mira(0, 1500, 650, 1.9), mira(126, 1505, 650, 2.0)]} tenzo={{ no: true }}
    leo={{ poses: [{ f: 0, v: { ...CEL_SENT, cabeza: 0, hD: 12, cD: 40 } }, { f: 8, v: { ...SENTADO, tronco: -14, cabeza: -14, hD: 12, cD: 40, hI: 110, cI: 30 } }, { f: 16, v: { ...SENTADO, tronco: 10, cabeza: 6, hD: 12, cD: 40, hI: 30, cI: 60 } }, { f: 24, v: { ...SENTADO, tronco: -10, cabeza: -10, hD: 12, cD: 40, hI: 100, cI: 30 } }, { f: k48(221.1), v: { ...SENTADO, tronco: 6, cabeza: 0, hD: 12, cD: 40, hI: 40, cI: 60 } }, { f: k48(222.2), v: { ...SENTADO, tronco: -10, cabeza: -18, hD: 12, cD: 40, hI: 80, cI: 150 } }, { f: k48(222.9), v: { ...SENTADO, tronco: -4, cabeza: -10, hD: 12, cD: 40, hI: 80, cI: 150 } }, { f: k48(223.3), v: { ...SENTADO, tronco: 8, cabeza: 2, hD: 12, cD: 40, hI: 120, cI: 20 } }],
      enManoI: (fr: number) => (fr >= k48(222.0) && fr < k48(223.2) ? <rect x={-10} y={-34} width={20} height={34} rx={4} fill="#9fd0ff" opacity={0.7} /> : null),
      miradas: [{ f: 0, v: MIRA_TENZO }], caras: [{ f: 0, v: "sorpresa" }, { f: 10, v: "risa" }, { f: k48(221.2), v: "picaro" }], habla: [[0, 24], [40, 125]] }}
    hud={<><Hud /><Pensamiento x={1370} y={560} w={820} h={480} desde={k48(220.9)} cola={{ x: 760, y: 470 }} fondo="#fbe9cc"><BarDibujo w={820} h={480} /></Pensamiento>
      <Pildora texto="ALCOHOLIC → BAR" x={1370} y={890} desde={k48(221.8)} color="#ffe2a6" tam={40} /></>} />
);
// ---------- 49 · contraplano por encima del hombro de Leo: el viejo sonríe (se le arrugan los ojos) y sigue doblando con ganas, sacude la toalla ----------
export const P49Sigue: React.FC = () => {
  const f = useF();
  return (
    <>
      <Lav cl={[mira(0, 1690, 695, 2.25), mira(86, 1700, 688, 2.4)]} leo={{ no: true }} toalla={(fr) => interpolate(fr, [0, 86], [0.45, 0.85], cl)} sp={{ luzFarol: 1.3 }}
        tenzo={{ poses: [{ f: 0, v: DOBLA_A }, { f: 8, v: { ...DOBLA_B, hD: 95, cD: 50, hI: 88, cI: 60, tronco: -4 } }, { f: 20, v: DOBLA_A }, ...doblando(30, 86, 18).slice(1)],
          caras: [{ f: 0, v: "neutral" }, { f: 5, v: "feliz" }, { f: 16, v: "risa" }, { f: 46, v: "feliz" }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }, { f: 24, v: { x: -0.3, y: 0.7 } }],
          enManoD: (fr: number) => <g transform={`rotate(${-20 + 25 * Math.sin(fr / 3.2)})`}><path d={`M-6,0 L58,${-6 + 10 * Math.sin(fr / 2.5)} L62,${44 + 8 * Math.sin(fr / 2.5 + 1)} L-4,40 Z`} fill="#f1ece2" stroke="#b9b2a4" strokeWidth={3} strokeLinejoin="round" /></g> }}
        extra={<Halo x={1730} y={650} r={200} color={ORO} fuerza={0.18 + 0.08 * Math.sin(f / 7)} />} hud={<Hud />} />
      <HombroLeo x={300} y={800} r={250} lado={1} giro={0.4} />
    </>
  );
};
// ---------- 50 · la primera semana: ella baila → corte: él mira con la mano en el abdomen y respira ----------
const k50 = kDe(226.64);
export const P50Semana1: React.FC = () => (
  <Vai cl={[mira(0, V.pabellon + 60, 660, 1.75), mira(82, V.pabellon + 70, 660, 1.85), ...corte(83, MX + 120, 690, 2.3), mira(164, MX + 120, 690, 2.4)]} sp={{ noche: true }}
    medio={<>
      <MonjePab o={{ poses: respira({ ...LOTO, hD: 40, cD: 130 }, k50(230.9), 170), caras: [{ f: 0, v: "neutral" }, { f: k50(230.8), v: "cansado" }], miradas: [{ f: 0, v: { x: 0.8, y: 0 } }] }} />
      <A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: V.pabellon + 40, y: VP - 40 }, { f: 80, x: V.pabellon + 150, y: VP - 40 }, { f: 164, x: MX + 330, y: VP - 40 }]} dir={[{ f: 0, v: -1 }, { f: 40, v: 1 }, { f: 80, v: -1 }]}
        poses={bailando(170, 24)} caras={[{ f: 0, v: "feliz" }]} giros={[{ f: 0, v: 0.4 }, { f: 60, v: -0.3 }, { f: 120, v: 0.4 }]} />
    </>}
    hud={<Calendario texto="WEEK 1" x={1560} y={70} desde={6} acento={ORO} />} />
);
// ---------- 51 · la segunda semana: seda y jazmín; se sienta tan cerca que él oye su corazón (ondas al oído) ----------
const k51 = kDe(232.11);
export const P51Semana2: React.FC = () => (
  <Vai cl={[mira(0, MX + 110, 640, 2.0), mira(206, MX + 90, 650, 2.5)]} sp={{ noche: true }}
    medio={<>
      <MonjePab o={{ caras: [{ f: 0, v: "cansado" }, { f: k51(237.7), v: "sorpresa" }], miradas: [{ f: 0, v: { x: 0.8, y: 0 } }] }} />
      <A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: MX + 300, y: VP - 40 }, { f: k51(235.3), x: MX + 190, y: VP - 40 }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: undefined }, { f: k51(235.6), v: 40 }]}
        poses={[{ f: 0, v: { hD: 110, cD: 40, hI: -40, cI: 30 } }, { f: 40, v: { hD: 20, cD: 60, hI: -90, cI: 30 } }, { f: k51(235.6), v: { tronco: -14, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 50, hI: 20, cI: 30, cabeza: 10 } }]}
        caras={[{ f: 0, v: "feliz" }, { f: 110, v: "picaro" }]} giros={[{ f: 0, v: 0.3 }]} />
      <Jazmin x={MX + 120} y={420} desde={k51(234.1)} />
      <Latido x={MX + 150} y={735} hacia={{ x: MX + 30, y: 650 }} desde={k51(237.3)} s={0.7} />
    </>}
    hud={<Calendario texto="WEEK 2" x={1560} y={70} desde={6} acento={ORO} />} />
);
// ---------- 52 · sintió el fuego: aprieta las rodillas, la llama crece; a los veinte años; ni huyó ni obedeció ----------
const k52 = kDe(239.01);
export const P52Fuego: React.FC = () => {
  const f = useF();
  return (
    <Vai cl={[mira(0, MX + 160, 680, 1.9), mira(216, MX + 160, 690, 2.2)]} sp={{ noche: true }}
      medio={<>
        <MonjePab o={{ poses: [{ f: 0, v: LOTO }, ...Array.from({ length: 16 }).map((_, i) => ({ f: 14 + i * 5, v: { ...LOTO, hD: 30 + (i % 2) * 6, cD: 30 - (i % 2) * 8, hI: 26 + (i % 2) * 6, cI: 30 - (i % 2) * 8, tronco: 6 + (i % 2) * 3, cabeza: 12 - i * 1.4 } })), { f: k52(243.6), v: { ...LOTO, hD: 30, cD: 30, hI: 26, cI: 30, tronco: -4, cabeza: -8 } }, { f: k52(245.2), v: { ...LOTO, hD: 20, cD: 60, hI: 20, cI: 60, tronco: -6, cabeza: -4 } }],
          caras: [{ f: 0, v: "sorpresa" }, { f: 20, v: "determinado" }, { f: k52(244.6), v: "neutral" }], miradas: [{ f: 0, v: { x: 0.2, y: 0.5 } }, { f: 40, v: { x: 0.3, y: -0.4 } }, { f: k52(243.6), v: { x: 0.9, y: 0 } }] }} />
        <Llama x={MX + 6} y={VP - 70} t={interpolate(f, [0, 40, k52(243.6), 216], [0.1, 0.45, 0.5, 0.4], cl)} f={f} />
      </>}
      hud={<><Velo o={0.2} /><Placa x={1240} y={270} w={520} h={420} desde={6} /><Medidor x={1500} y={520} R={200} desde={6} claves={[{ f: 0, v: 20 }, { f: 40, v: 88 }, { f: 150, v: 84 }, { f: 205, v: 80 }]} rotulo="THE FIRE" />
        <Calendario texto="AGE 20" x={1360} y={70} desde={k52(242.1)} acento={ORO} />
        <Pildora texto="DID NOT RUN" x={1500} y={820} desde={k52(244.0)} hasta={k52(245.5)} color="#ffe2a6" tam={40} />
        <Pildora texto="DID NOT OBEY" x={1500} y={820} desde={k52(245.5)} color={ACENTO} tam={40} /></>} />
  );
};
// ---------- 53 · lo miraba como se mira la lluvia desde una ventana: Amrapali en la columna; aparece el marco ----------
const k53 = kDe(246.25);
export const P53Lluvia: React.FC = () => { const f = useF(); return (
  <Vai cl={[mira(0, MX + 260, 660, 1.8), mira(122, MX + 250, 660, 1.6)]} sp={{ noche: true, lluvia: true }}
    medio={<><MonjePab o={{ caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }] }} />
      <A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: MX + 470, y: VP - 40 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { tronco: -10, hD: 20, cD: 40, hI: 150, cI: 40, cabeza: -6 } }, { f: 70, v: { tronco: -12, hD: 30, cD: 90, hI: 150, cI: 40, cabeza: 6 } }]} caras={[{ f: 0, v: "duda" }, { f: 70, v: "triste" }]} miradas={[{ f: 0, v: { x: -0.9, y: 0.1 } }]} /></>}
    hud={<LluviaCerca marco={lerp(f, k53(248.9), k53(249.6), 0, 1)} />} />
); };
// ---------- 54 · cada noche el fuego un poco más chico: tres noches, tres tamaños de plano ----------
export const P54Achica: React.FC = () => {
  const f = useF();
  // v3: tres noches = tres planos distintos: general con ella bailando al fondo → perfil (giro) plano medio → primer plano de la cara, la llama chiquita, sonríe
  const t = f < 28 ? 0.42 : f < 56 ? 0.28 : 0.14;
  return (
    <Vai cl={[mira(0, MX + 200, 640, 1.35), mira(27, MX + 196, 640, 1.38), ...corte(28, MX + 140, 680, 1.85), mira(55, MX + 136, 680, 1.9), ...corte(56, MX - 10, 690, 3.0), mira(84, MX - 10, 688, 3.1)]} sp={{ noche: true }}
      medio={<>
        {f < 28 && <A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: MX + 380, y: VP - 40 }, { f: 28, x: MX + 470, y: VP - 40 }]} dir={[{ f: 0, v: -1 }]} poses={bailando(28, 10)} caras={[{ f: 0, v: "feliz" }]} giros={[{ f: 0, v: 0.4 }]} />}
        {f >= 28 && f < 56 && <A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: MX + 330, y: VP - 40 }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 40 }]} poses={[{ f: 0, v: { tronco: -14, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 50, hI: 20, cI: 30, cabeza: 10 } }]} caras={[{ f: 0, v: "duda" }]} />}
        <MonjePab o={{ giros: [{ f: 0, v: 0 }, { f: 28, v: 0.75 }, { f: 56, v: 0.15 }], poses: [{ f: 0, v: LOTO }, { f: 28, v: { ...LOTO, cabeza: -6, tronco: -2 } }, { f: 56, v: { ...LOTO, cabeza: 4 } }, { f: 70, v: { ...LOTO, cabeza: -2, tronco: -3 } }],
          caras: [{ f: 0, v: "determinado" }, { f: 28, v: "neutral" }, { f: 62, v: "feliz" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: 56, v: { x: 0.2, y: 0.6 } }] }} />
        <Llama x={MX + 6} y={VP - 70} t={t} f={f} />
      </>}
      hud={<><Calendario texto="NIGHT 9" x={1560} y={70} desde={0} hasta={28} acento={ORO} /><Calendario texto="NIGHT 17" x={1560} y={70} desde={28} hasta={56} acento={ORO} /><Calendario texto="NIGHT 26" x={1560} y={70} desde={56} acento={ORO} /></>} />
  );
};
// v4: sin barrido largo: general FIJO donde el monje cruza corriendo hasta el Buda → corte al dos tiros
// ---------- 55 · los monjes cuentan los días; cada semana uno corre al Buda: «está perdido, maestro» ----------
const k55 = kDe(253.15);
const CORRE = [{ hD: 70, cD: 80, hI: -50, cI: 30, tronco: 14 }, { hD: -50, cD: 30, hI: 70, cI: 80, tronco: 14 }];
export const P55Corren: React.FC = () => { const f = useF(); return (
  <Vai cl={[mira(0, 4640, 700, 1.45), mira(63, 4650, 700, 1.5), ...corte(64, 4900, 700, 1.2), mira(149, 4920, 700, 1.24), ...corte(150, 5230, 700, 1.6), mira(284, 5250, 705, 1.75)]} sp={{ murmullo: 0.6 }}
    medio={<>
      <MonjesCara caras={["duda", "neutral", "duda", "neutral", "duda"]} poses={[{ hD: 80, cD: 60 }, {}, { hI: 80, cI: 60 }, {}, { hD: 80, cD: 60 }]} />
      <Buda miradas={[{ f: 0, v: { x: -0.8, y: 0.1 } }]} />
      <A look={MONJE(1)} seed={81} ruta={[{ f: 0, x: 4000, y: VP }, { f: 64, x: 4150, y: VP }, { f: 150, x: 5080, y: VP, curva: "out" }]} dir={[{ f: 0, v: 1 }]}
        poses={[...Array.from({ length: 17 }).map((_, i) => ({ f: 64 + i * 5, v: CORRE[i % 2] })), { f: 0, v: { hD: 20, cD: 30, hI: 20, cI: 30 } }, { f: 152, v: { hD: 100, cD: 30, hI: 90, cI: 40, tronco: 10 } }, { f: k55(259.3), v: { hD: 130, cD: 20, hI: 40, cI: 60, tronco: 6 } }, { f: k55(260.4), v: { hD: 60, cD: 120, hI: 70, cI: 120, tronco: 8 } }].sort((a, b) => a.f - b.f)}
        caras={[{ f: 0, v: "duda" }, { f: 64, v: "miedo" }, { f: 140, v: "miedo" }, { f: k55(260.4), v: "enojo" }]} habla={[[k55(257.79), k55(262.43)]]} />
    </>}
    hud={<>
      {f < 64 && <Calendario texto={`DAY ${Math.min(40, 1 + Math.floor(f / 1.6))}`} x={1560} y={70} desde={4} acento={ORO} />}
      <Globo texto="He is lost, master!" x={700} y={290} desde={k55(257.8)} hasta={k55(259.2)} cola="abajo" tam={52} />
      <Globo texto="He has fallen!" x={700} y={290} desde={k55(259.3)} hasta={k55(260.4)} cola="abajo" tam={52} />
      <Globo texto="Music from her house!" x={700} y={290} desde={k55(260.4)} hasta={284} cola="abajo" tam={52} />
      {f > k55(260.8) && <Notas x={420} y={420} desde={k55(260.8)} />}
    </>} />
); };
// ---------- 56 · «cada semana el Buda decía lo mismo»: tres semanas, tres monjes distintos que llegan corriendo, el Buda levanta la mano igual cada vez ----------
// v3: nada del dos tiros de P43/P44: contraplano desde atrás del monje que llega (W2) → plano medio del Buda de frente (W6) → primer plano de la mano (W11)
const BudaMano = (desde: number) => [{ f: 0, v: LOTO }, { f: desde, v: LOTO_ENSENA }];
export const P56Espera: React.FC = () => {
  const f = useF();
  const tramo = f < 27 ? 0 : f < 54 ? 1 : 2;
  const t0 = [0, 27, 54][tramo];
  const cam = tramo === 0 ? [mira(0, V.buda - 240, 700, 1.7), mira(26, V.buda - 230, 700, 1.75)] : tramo === 1 ? [mira(27, V.buda - 150, 680, 2.1), mira(53, V.buda - 150, 678, 2.2)] : [mira(54, V.buda + 20, 730, 2.8), mira(82, V.buda + 20, 728, 2.9)];
  return (
    <Vai cl={cam}
      medio={<>
        <Buda poses={BudaMano(t0 + 8)} caras={[{ f: 0, v: "neutral" }, { f: t0 + 10, v: "feliz" }]} miradas={[{ f: 0, v: { x: -0.9, y: 0.1 } }]} giros={[{ f: 0, v: tramo === 1 ? 0 : -0.3 }]} />
        {tramo === 0 && <A look={MONJE(2)} seed={84} ruta={[{ f: 0, x: V.buda - 640, y: VP }, { f: 12, x: V.buda - 330, y: VP, curva: "out" }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: CORRE[0] }, { f: 5, v: CORRE[1] }, { f: 10, v: CORRE[0] }, { f: 14, v: { hD: 120, cD: 30, hI: 100, cI: 40, tronco: 14 } }, { f: 22, v: { hD: 110, cD: 40, hI: 95, cI: 50, tronco: 18, cabeza: 6 } }]} caras={[{ f: 0, v: "duda" }]} habla={[[10, 22]]} />}
        {/* v4: el 2.º monje ya llegó (entero en cuadro, nada cortado por el borde): se inclina, gesticula y se queda tieso con la respuesta */}
        {tramo === 1 && <A look={MONJE(3)} seed={85} ruta={[{ f: 0, x: V.buda - 360, y: VP }, { f: 53, x: V.buda - 345, y: VP }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: { hD: 120, cD: 30, hI: 100, cI: 40, tronco: 16 } }, { f: 33, v: { hD: 70, cD: 110, hI: 60, cI: 110, tronco: 4 } }, { f: 41, v: { hD: 30, cD: 30, hI: 30, cI: 30, tronco: -4, cabeza: -6 } }, { f: 53, v: { hD: 20, cD: 20, hI: 20, cI: 20, tronco: 0, cabeza: 4 } }]} caras={[{ f: 0, v: "miedo" }, { f: 40, v: "sorpresa" }]} habla={[[27, 38]]} />}
      </>}
      hud={<>
        <Calendario texto={["WEEK 2", "WEEK 6", "WEEK 11"][tramo]} x={1560} y={70} desde={t0} acento={ORO} />
        <Globo texto="Wait." x={[1290, 1180, 900][tramo]} y={[230, 170, 120][tramo]} desde={t0 + 10} hasta={t0 + 26} cola="abajo" tam={[48, 54, 64][tramo]} />
        <Pildora texto="THE SAME ANSWER" x={960} y={tramo === 2 ? 930 : 150} desde={tramo === 2 ? 56 : 30} color="#ffe2a6" tam={44} />
      </>} />
  );
};
// ---------- 57 · «Wait.» (inserto: la palma del Buda) → la lluvia para, las nubes se abren → seguimiento del monje que vuelve con la misma cara ----------
const k57 = kDe(265.33);
export const P57Vuelve: React.FC = () => {
  const f = useF();
  const sol = lerp(f, k57(267.4), k57(268.6), 0, 1);
  const RUTA = [{ f: 0, x: 3700, y: VP }, { f: 255, x: 4460, y: VP }];
  const mx = (fr: number) => interpolate(fr, [0, 255], [3700, 4460], cl);
  if (f < 30) return <PalmaEspera desde={0} />;
  return (
    <>
      <Vai cl={[mira(30, 3900, 430, 1.1), mira(98, 3900, 410, 1.15), ...corte(99, mx(99) + 120, 660, 1.8), mira(190, mx(190) + 120, 660, 1.85), ...corte(191, mx(191) + 30, 600, 2.9), mira(255, mx(255) + 30, 598, 3.0)]} sp={{ lluvia: f < k57(267.4) }}
        medio={<>
          <A look={MONJE_JOVEN} seed={74} ruta={RUTA} giros={[{ f: 0, v: 0.3 }, { f: 190, v: 0 }]} caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: { x: 0.9, y: 0 } }, { f: 200, v: { x: 0.4, y: 0 } }]} poses={[{ f: 0, v: { hD: 30, cD: 70, hI: 30, cI: 80 } }]} />
        </>}
        hud={<>{f >= 191 && <Pildora texto="THE SAME CALM FACE" x={960} y={930} desde={k57(271.9)} color="#ffe2a6" tam={44} />}</>} />
      {f < 99 && <NubesAbren p={sol} />}
      {/* v4: el rótulo va ENCIMA de las nubes (antes quedaba tapado, gris sobre gris) y entra cuando ya se abrieron; acento oscuro, letra grande */}
      <Calendario texto="4 MONTHS LATER" x={1340} y={60} desde={k57(268.3)} acento="#7a2a1a" tam={58} />
    </>
  );
};
// ---------- 58 · detrás, Amrapali: descalza (pies + joyas tiradas), sin joyas, la cabeza baja ----------
const k58 = kDe(273.85);
export const P58Detras: React.FC = () => {
  const f = useF();
  return (
    <Vai cl={[mira(0, 4350, 660, 1.35), mira(55, 4360, 660, 1.4), ...corte(56, 4300, 880, 3.2), mira(120, 4320, 880, 3.2), ...corte(121, 4370, 630, 2.5), mira(155, 4380, 630, 2.55)]}
      medio={<>
        <A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: 4480, y: VP }, { f: 155, x: 4800, y: VP }]} caras={[{ f: 0, v: "neutral" }]} poses={[{ f: 0, v: { hD: 30, cD: 70, hI: 30, cI: 80 } }]} />
        <A look={f < 100 ? AMRAPALI : AMRA_SIN_JOYAS} seed={12} ruta={[{ f: 0, x: 4140, y: VP }, { f: 155, x: 4420, y: VP }]} caras={[{ f: 0, v: "triste" }]} poses={[{ f: 0, v: { cabeza: 26, hD: 10, cD: 10, hI: 10, cI: 10 } }, { f: 140, v: { cabeza: 34, hD: 10, cD: 10, hI: 10, cI: 10 } }]} />
        {f >= 56 && <><g transform={`translate(4250,${VP + 4})`}><Collar s={2.2} /></g><g transform={`translate(4190,${VP + 6}) rotate(70)`}><Collar s={1.6} /></g></>}
      </>}
      hud={<>{f >= 56 && f < 121 && <LlamadaMundo cl={[mira(56, 4300, 880, 3.2), mira(120, 4320, 880, 3.2)]} X={4250} Y={VP + 10} dx={-120} dy={-90} texto="HER JEWELS" desde={k58(277.3)} />}</>} />
  );
};
// ---------- 59 · llega y se arrodilla ante el Buda; se saca el collar y lo deja en el piso («everything I had») → EVERYTHING vs NOTHING → primer plano: manos juntas, «I want what he has»; él sonríe ----------
const k59 = kDe(279.03);
const NIT = { foco: 1 }; // v4: todo el plano NÍTIDO (sin rack focus)
// v4: arrodillada de verdad: túnica corta (se ven muslo y pantorrilla plegados) y tronco ≤20 (con 30-34 el cuerpo se deformaba en una mancha roja)
const ARRO = { tronco: 4, pI: 0, rI: 92, pD: 6, rD: 96, hD: 20, cD: 40, hI: 10, cI: 30, cabeza: -4 };
const AMRA_ARRO: Look = { ...AMRAPALI, accesorios: [{ t: "pelo", forma: "cola", color: "#1e1410" }, { t: "tunica", color: "#b8323a", largo: 0.45 }] };
export const P59Arrodilla: React.FC = () => {
  const f = useF();
  const ax = V.buda - 330;
  const T2 = k59(286.6);
  const suelo = f >= k59(284.3);
  return (
    <Vai cl={[mira(0, V.buda - 260, 690, 1.6, NIT), mira(43, V.buda - 256, 690, 1.65, NIT), ...corte(44, ax + 110, 640, 2.5).map((k) => ({ ...k, ...NIT })), mira(k59(284.5), ax + 118, 640, 2.6, NIT), ...corte(k59(284.5) + 1, ax + 118, 640, 1.7).map((k) => ({ ...k, ...NIT })), mira(T2 - 1, ax + 118, 660, 1.72, NIT), mira(T2, V.buda - 165, 735, 2.5, NIT), mira(272, V.buda - 165, 732, 2.6, NIT)]}
      medio={<>
        <Buda miradas={[{ f: 0, v: { x: -0.9, y: 0.2 } }]} caras={[{ f: 0, v: "neutral" }, { f: k59(285.5), v: "feliz" }]} poses={[{ f: 0, v: LOTO }, { f: k59(285.4), v: LOTO_ENSENA }]} />
        <A look={f < 28 ? AMRA_SIN_JOYAS : AMRA_ARRO} seed={12} ruta={[{ f: 0, x: ax - 260, y: VP }, { f: 28, x: ax, y: VP, curva: "out" }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: { cabeza: 20 } }, { f: 30, v: { ...ARRO, tronco: 18, cabeza: 14, hD: 30, cD: 20, hI: 24, cI: 20 } }, { f: 44, v: ARRO },
            { f: k59(282.6), v: { ...ARRO, hD: 160, cD: 150, hI: 150, cI: 160, cabeza: 6 } }, { f: k59(283.6), v: { ...ARRO, hD: 100, cD: 30 } }, { f: k59(284.2), v: { ...ARRO, tronco: 18, hD: 40, cD: 10, cabeza: 12 } },
            { f: k59(285.0), v: ARRO }, { f: T2, v: { ...ARRO, hD: 45, cD: 85, hI: 42, cI: 88, tronco: -4, cabeza: -10 } }]}
          enManoD={(fr: number) => (fr >= k59(282.9) && fr < k59(284.3) ? <Collar s={2.2} /> : null)}
          miradas={[{ f: 0, v: { x: 0.9, y: 0.1 } }, { f: k59(283.6), v: { x: 0.6, y: 0.8 } }, { f: k59(285.0), v: { x: 0.9, y: -0.2 } }]}
          caras={[{ f: 0, v: "triste" }, { f: k59(284.8), v: "neutral" }, { f: T2, v: "determinado" }]} habla={[[k59(282.35), k59(286.57)], [k59(286.71), k59(287.85)]]} />
        {suelo && <g transform={`translate(${ax + 120},${VP + 2})`}><Collar s={2.4} /></g>}
        {f >= T2 && <Halo x={V.buda} y={700} r={260} color={ORO} fuerza={0.3} />}
      </>}
      hud={<>
        {f < T2 && <Comparacion x={960} y={225} w={430} h={350} desde={k59(284.6)} hasta={T2}
          izq={{ titulo: "EVERYTHING", dato: "LOST", color: "#b8323a", contenido: <g transform="translate(215,50)"><Collar s={4.4} /><g transform="translate(-120,40)"><Collar s={2.4} /></g><g transform="translate(120,40)"><Mango s={2.8} /></g></g> }}
          der={{ titulo: "NOTHING", dato: "WON", color: "#e0a63a", contenido: <g transform="translate(215,90)"><Cuenco s={4.4} /></g> }} vs="VS" />}
        {f < T2 && f >= k59(282.35) && <Pildora texto="ALL HER JEWELS" x={960} y={110} desde={k59(282.6)} hasta={k59(284.5)} color="#ffe2a6" />}
        <Globo texto="I want what he has." x={640} y={330} desde={T2 + 3} hasta={272} cola="abajo" tam={54} />
      </>} />
  );
};
// ---------- 60 · «the most desired woman in India»: posa, los hombres del fondo largan corazones → «became a nun»: cae la túnica blanca encima (barrido), junta las manos e inclina la cabeza; el rótulo se tacha ----------
const k60 = kDe(288.09);
const Corazon: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => <path transform={`translate(${x},${y}) scale(${s})`} opacity={o} d="M0,10 C-26,-8 -14,-30 0,-16 C14,-30 26,-8 0,10 Z" fill="#e2483a" />;
const RotuloTachado: React.FC<{ desde: number; tacha: number }> = ({ desde, tacha }) => {
  const f = useF();
  if (f < desde) return null;
  const e = lerp(f, desde, desde + 8, 0, 1);
  const t = lerp(f, tacha, tacha + 8, 0, 1);
  return (
    <div style={{ position: "absolute", left: 1180, top: 210, opacity: e, transform: `translateY(${(1 - e) * 20}px)` }}>
      <div style={{ position: "relative", padding: "14px 28px", borderRadius: 14, background: "#f8f3e8", fontFamily: F_HUD, fontWeight: 600, fontSize: 46, color: "#2a2420", letterSpacing: 2 }}>
        MOST DESIRED IN INDIA
        <div style={{ position: "absolute", left: 18, top: "52%", height: 8, width: `calc(${t * 100}% - ${t * 36}px)`, background: "#e2483a", borderRadius: 4 }} />
      </div>
      <div style={{ marginTop: 18, marginLeft: 120, fontFamily: F_HUD, fontWeight: 600, fontSize: 64, color: "#fff6dc", opacity: lerp(f, tacha + 6, tacha + 14, 0, 1), textShadow: "0 4px 14px rgba(0,0,0,0.45)" }}>→ A NUN</div>
    </div>
  );
};
export const P60Monja: React.FC = () => {
  const f = useF();
  const TM = k60(290.35); // v4: la monja entra antes y queda ≥1,5 s ya limpia
  const monja = f >= TM + 5;
  const barrido = lerp(f, TM - 2, TM + 8, 0, 1);
  return (
    <Vai cl={[mira(0, 4560, 640, 1.75), mira(TM + 4, 4570, 642, 1.85), ...corte(TM + 5, 4600, 640, 2.7), mira(119, 4600, 636, 2.8)]}
      medio={<>
        {!monja && [0, 1, 2].map((k) => <A key={k} look={HOMBRE(k + 2)} seed={95 + k} escala={ESC * 0.78} ruta={[{ f: 0, x: [4180, 4300, 4930][k], y: VP - 70 }]} dir={[{ f: 0, v: k === 2 ? -1 : 1 }]}
          caras={[{ f: 0, v: ["feliz", "risa", "feliz"][k] }]} poses={[{ f: 0, v: k === 1 ? "manosCara" : "parado" }]} />)}
        {!monja && [0, 1, 2, 3, 4, 5].map((i) => { const t = ((f + i * 13) % 50) / 50; const x0 = [4180, 4300, 4930][i % 3]; return <Corazon key={i} x={x0 + 20 * Math.sin(t * 7 + i)} y={VP - 330 - t * 220} s={1.4} o={Math.sin(t * Math.PI)} />; })}
        <A look={monja ? AMRA_VELO : AMRAPALI} seed={12} ruta={[{ f: 0, x: 4600, y: VP }]} giros={monja ? [{ f: 0, v: 0 }, { f: 110, v: 0.3 }] : [{ f: 0, v: -0.2 }]}
          caras={monja ? [{ f: 0, v: "feliz" }] : [{ f: 0, v: "picaro" }]}
          poses={monja ? [{ f: 0, v: { hD: 10, cD: 82, hI: 10, cI: 82, cabeza: 6 } }, { f: TM + 20, v: { hD: 10, cD: 82, hI: 10, cI: 82, cabeza: 16, tronco: 10 } }, { f: 110, v: { hD: 10, cD: 82, hI: 10, cI: 82, cabeza: 8, tronco: 2 } }]
            : [{ f: 0, v: { hD: 130, cD: 40, hI: -40, cI: -60 } }, { f: 26, v: "manosCintura" }, { f: 50, v: { hD: 150, cD: 60, hI: -30, cI: -50, tronco: -6 } }, { f: 74, v: "manosCintura" }]} />
        {barrido > 0 && barrido < 1 && (() => { const yb = VP - 470 + barrido * 470; const ola = 14 * Math.sin(f * 1.3); return <g>
          {/* v4: la tela blanca cae como un manto (borde de abajo ondulado, pliegues), opaca */}
          <path d={`M4500,${VP - 520} Q4600,${VP - 560} 4700,${VP - 520} L${4730},${yb} Q4690,${yb + 30 + ola} 4650,${yb} Q4600,${yb + 34 - ola} 4550,${yb} Q4510,${yb + 30 + ola} 4470,${yb} Z`} fill="#f3ead6" stroke="#b9ab8e" strokeWidth={5} strokeLinejoin="round" />
          {[4540, 4600, 4660].map((x) => <path key={x} d={`M${x},${VP - 520} Q${x + 10},${(VP - 520 + yb) / 2} ${x - 6},${yb - 6}`} stroke="#d8ccb2" strokeWidth={5} fill="none" strokeLinecap="round" />)}
        </g>; })()}
        {monja && <Halo x={4600} y={680} r={lerp(f, TM + 5, TM + 18, 600, 260)} color="#fff6dc" fuerza={lerp(f, TM + 5, TM + 16, 0.7, 0.15)} />}
      </>}
      hud={<><RotuloTachado desde={k60(289.0)} tacha={TM + 2} /></>} />
  );
};
// ---------- 61 · regala su jardín (señala, los monjes entran) → corte: años después escribe sus poemas ----------
const k61 = kDe(292.05);
export const P61Poemas: React.FC = () => {
  const f = useF();
  const AX = V.jardin + 240;
  const INS = k61(295.9), FIN = k61(298.4); // inserto: la hoja de palma con los versos, la mano vieja escribiendo
  return (
    <>
    <Vai cl={[mira(0, V.jardin, 640, 1.2), mira(88, V.jardin + 20, 640, 1.25), ...corte(89, AX - 100, 720, 2.3), mira(267, AX - 110, 716, 2.45)]}
      medio={<>
        {f < 89 && [0, 1, 2].map((k) => <A key={k} look={MONJE(k)} seed={90 + k} ruta={[{ f: 0, x: V.jardin - 700 + k * 170, y: VP }, { f: 88, x: V.jardin - 360 + k * 170, y: VP }]} caras={[{ f: 0, v: "feliz" }]} poses={[{ f: 0, v: { hD: 30, cD: 80, hI: 30, cI: 80 } }]} />)}
        {f < 89
          ? <A look={AMRAPALI_MONJA} seed={12} ruta={[{ f: 0, x: AX, y: VP }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 20, cD: 30 } }, { f: 14, v: { hD: 95, cD: 0, hI: 20, cI: 30 } }]} caras={[{ f: 0, v: "feliz" }]} />
          : <A look={AMRA_VIEJA} seed={12} ruta={[{ f: 0, x: AX, y: VP }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 8 }]}
              poses={[{ f: 0, v: { ...LOTO, hD: 60, cD: 120, hI: 40, cI: 100, cabeza: 18 } }, ...Array.from({ length: 14 }).map((_, i) => ({ f: 100 + i * 10, v: { ...LOTO, hD: i % 2 ? 66 : 56, cD: i % 2 ? 110 : 125, hI: 40, cI: 100, cabeza: 18 } }))]}
              enManoI={<Hoja s={1.6} />} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: -0.3, y: 0.8 } }]} />}
        {f < 89 && <LlamadaMundo cl={[mira(0, V.jardin, 640, 1.2), mira(88, V.jardin + 20, 640, 1.25)]} X={V.jardin - 200} Y={620} dx={-260} dy={-260} texto="HER MANGO GARDEN" desde={k61(292.6)} />}
      </>}
      hud={<>{f >= 89 && <Calendario texto="MANY YEARS LATER" x={1360} y={70} desde={89} hasta={k61(298.3)} acento={ORO} />}
        <FraseCaja texto="her poems are still read today" desde={k61(298.5)} y={110} color="#ffe2a6" /></>} />
    {f >= INS && f < FIN && <PapelVersos desde={INS} />}
    </>
  );
};
// ---------- 62 · el farol titila otra vez → corte: Leo bajo la luz blanca → corte: el tel tibio en la mano ----------
const k62 = kDe(300.95);
export const P62Vuelta: React.FC = () => {
  const f = useF();
  return (
    <>
      <Lav cl={[mira(0, L.farol, 690, 3.6), mira(62, L.farol, 690, 3.7), ...corte(63, 1190, 655, 2.0), mira(159, 1188, 652, 2.1), ...corte(160, 1215, 760, 3.6), mira(230, 1215, 756, 3.7)]} sp={{ luzFarol: f < 62 && f % 9 < 3 ? 0.3 : 1.2 }}
        tenzo={{ poses: doblando(0, 230, 40) }} mara={{ opacidad: () => 0.85 }}
        leo={{ luz: rimTel, caras: [{ f: 0, v: "duda" }, { f: 160, v: "cansado" }], miradas: [{ f: 0, v: { x: 0.6, y: -0.2 } }, { f: 110, v: { x: 0.3, y: 0.7 } }], poses: [{ f: 0, v: { ...CEL_SENT, cabeza: 4, cD: 100 } }, { f: 110, v: CEL_SENT }] }}
        extra={f >= 160 ? <Halo x={1215} y={765} r={150 + 20 * Math.sin(f / 6)} color="#ff8a4a" fuerza={0.4} /> : null}
        hud={<><Hud />{f >= 160 && <LlamadaMundo cl={[mira(160, 1215, 760, 3.6), mira(230, 1215, 756, 3.7)]} X={1215} Y={765} dx={420} dy={-200} texto="STILL WARM" desde={k62(307.0)} color="#ffb070" />}</>} />
      {f >= 63 && f < 160 && <AbsoluteFill style={{ background: "linear-gradient(180deg, #eaf2ff40, transparent 70%)", opacity: lerp(f, k62(305.4), k62(305.9), 0, 1) }} />}
      {f >= 160 && <><ManoTelTibio desde={160} /><Hud /><Pildora texto="STILL WARM" x={1420} y={300} desde={k62(306.9)} color="#ffb070" tam={50} /></>}
    </>
  );
};
// ---------- 63 · plano de dos, enteros: «okay» (asiente) · «but he was a monk, he trained for that» (le señala con la mano; globo monje ≠ Leo) → corte a Leo: «I'm not a monk» (se toca el pecho, niega con la cabeza) ----------
const k63 = kDe(308.63);
export const P63NoMonje: React.FC = () => {
  const f = useF();
  const TB = k63(312.8), TA = k63(310.45);
  const ots = f >= TA && f < TB; // v3: «but he was a monk…» = contraplano por encima del hombro de Leo hacia Tenzo
  return (
    <>
      <Lav cl={ots ? [mira(TA, 1640, 650, 2.0), mira(TB - 1, 1650, 646, 2.1)] : [mira(0, 1440, 650, 1.55), mira(TA - 1, 1445, 650, 1.6), mira(TB, 1190, 690, 2.3), mira(172, 1195, 688, 2.4)]}
        mara={ots ? { no: true } : { opacidad: () => 0.85, caras: [{ f: 0, v: "feliz" }], ruta: [{ f: 0, x: L.leo - 140, y: LP - 10 }] }} toalla={0.8}
        tenzo={{ poses: ots ? [{ f: 0, v: DOBLA_A }, { f: TA + 10, v: { ...DOBLA_A, cabeza: 0 } }] : doblando(0, 172, 36), caras: [{ f: 0, v: "neutral" }, { f: TA + 12, v: "feliz" }], miradas: ots ? [{ f: 0, v: { x: -0.9, y: 0 } }] : [{ f: 0, v: { x: -0.3, y: 0.7 } }] }}
        leo={ots ? { no: true } : { enManoD: () => null,
          poses: [{ f: 0, v: { ...SENTADO, cabeza: 0, hD: 12, cD: 40 } }, { f: 8, v: { ...SENTADO, cabeza: 14, hD: 12, cD: 40, tronco: 12 } }, { f: 16, v: { ...SENTADO, cabeza: 0, hD: 12, cD: 40 } },
            { f: TA, v: { ...SENTADO, tronco: 8, cabeza: -4, hD: 85, cD: 15, hI: 10, cI: 30 } },
            { f: TB, v: { ...SENTADO, tronco: 6, cabeza: 4, hD: 40, cD: 140, hI: 10, cI: 30 } }],
          giros: [{ f: 0, v: 0 }, { f: TB + 10, v: -0.35 }, { f: TB + 18, v: 0.3 }, { f: TB + 26, v: -0.3 }, { f: TB + 34, v: 0 }],
          miradas: [{ f: 0, v: MIRA_TENZO }], caras: [{ f: 0, v: "duda" }, { f: TB, v: "triste" }], habla: [[0, k63(310.41)], [k63(310.47), k63(314.17)]] }}
        hud={<Hud />} />
      {ots && <HombroLeo x={330} y={820} r={250} lado={1} giro={0.6} />}
      {/* v4: el brazo es manga de buzo + mano abierta que presenta al viejo (antes un palo negro de 56 px que parecía una barra) */}
      {ots && <BrazoLeoOTS sube={lerp(f, TA, TA + 10, 0, 1)} golpe={Math.max(0, Math.sin(Math.PI * lerp(f, k63(311.0), k63(311.4), 0, 1))) + Math.max(0, Math.sin(Math.PI * lerp(f, k63(311.55), k63(311.95), 0, 1)))} />}
      <Pensamiento x={f < TB ? 760 : 1340} y={f < TB ? 290 : 280} w={620} h={340} desde={k63(310.9)} cola={f < TB ? { x: 420, y: 620 } : { x: 1060, y: 470 }}><g transform="translate(37,10) scale(1.3)"><NoMonje tacha={lerp(f, k63(313.3), k63(313.6), 0, 1)} /></g></Pensamiento>
    </>
  );
};
// ---------- 64 · el viejo por fin lo mira → corte: los ojos, chiquitos y buenos, que se arrugan al sonreír ----------
const k64 = kDe(314.37);
export const P64Mira: React.FC = () => {
  const f = useF();
  const TC = k64(316.35);
  // v3: el corte es un primerísimo primer plano de los ojos (inserto propio): chiquitos, buenos, se achican y arrugan al sonreír con la luz lateral del farol
  if (f >= TC) return (
    <>
      <OjosTenzo sonrisa={lerp(f, k64(317.4), k64(318.0), 0, 1)} mira={lerp(f, TC, TC + 20, 0.6, -0.4)} />
      <Hud />
      <Pildora texto="VERY SMALL · VERY KIND" x={960} y={60} desde={k64(317.0)} color="#ffe2a6" tam={46} />
    </>
  );
  return (
    <Lav cl={[mira(0, 1700, 690, 2.4), mira(TC - 1, 1710, 686, 2.6)]} leo={{ no: true }} toalla={0.8} sp={{ luzFarol: 1.6 }}
      extra={<Halo x={1600} y={690} r={260} color={ORO} fuerza={0.35} />}
      tenzo={{ poses: [{ f: 0, v: DOBLA_A }, { f: 18, v: { ...DOBLA_A, cabeza: 0, tronco: -4, hD: 40, cD: 50 } }], miradas: [{ f: 0, v: { x: -0.3, y: 0.6 } }, { f: 22, v: { x: -0.9, y: 0 } }], giros: [{ f: 0, v: 0.5 }, { f: 22, v: 0 }], caras: [{ f: 0, v: "neutral" }, { f: 40, v: "feliz" }] }}
      hud={<Hud />} />
  );
};
// ---------- 65 · «neither was he at first»: Tenzo y su recuerdo (globo: el joven monje inquieto, sudando, WEEK 1) → corte a plano bajo de dos: «do you know what he knew…?» levanta el índice y se inclina; Leo se adelanta y espera ----------
const k65 = kDe(319.59);
const Inquieto: React.FC<{ f: number }> = ({ f }) => {
  const sx = 6 * Math.sin(f / 2.2);
  return (
    <g>
      <g transform={`translate(${sx},0)`}><MonjeIcono x={170} y={225} s={1.6} /></g>
      {[0, 1, 2].map((i) => { const t = ((f + i * 9) % 26) / 26; return <path key={i} transform={`translate(${200 + i * 18 + sx},${100 + t * 40})`} d="M0,0 q5,9 0,13 q-5,-4 0,-13 Z" fill="#6ab0e0" opacity={1 - t} />; })}
      <path d={`M${110 + sx},70 l-14,-10 M${232 + sx},70 l14,-10`} stroke={TINTA} strokeWidth={4} strokeLinecap="round" />
      <text x={330} y={150} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill={TINTA}>WEEK 1</text>
      <text x={330} y={196} fontFamily={F_HUD} fontWeight={500} fontSize={30} fill="#a8322c">restless</text>
    </g>
  );
};
export const P65Sabia: React.FC = () => {
  const f = useF();
  const TB = k65(321.35), TL = k65(323.5);
  // tres encuadres: Tenzo de perfil con el farol (su recuerdo del monje inquieto) → sobre el hombro de Leo, el dedo en alto → Leo de cerca, inclinado, espera
  const c65 = f < TB ? [mira(0, 1700, 690, 2.4), mira(TB - 1, 1706, 688, 2.5)] : f < TL ? [mira(TB, 1600, 700, 2.2), mira(TL - 1, 1610, 696, 2.28)] : [mira(TL, 1190, 660, 2.6), mira(161, 1192, 662, 2.7)];
  return (
    <>
    <Lav cl={c65} toalla={0.8} sp={{ luzFarol: 1.3 }}
      leo={f >= TB && f < TL ? { no: true } : { enManoD: () => null, poses: [{ f: 0, v: { ...SENTADO, cabeza: 0, hD: 12, cD: 40 } }, { f: k65(322.6), v: { ...SENTADO, tronco: 18, cabeza: -4, hD: 30, cD: 60, hI: 20, cI: 50 } }], miradas: [{ f: 0, v: MIRA_TENZO }], caras: [{ f: 0, v: "duda" }, { f: k65(322.8), v: "sorpresa" }, { f: k65(323.7), v: "neutral" }] }}
      tenzo={{ poses: [{ f: 0, v: { ...DOBLA_A, cabeza: 0 } }, { f: 12, v: { ...DOBLA_A, cabeza: -6, hD: 40, cD: 70 } }, { f: TB + 4, v: { ...SENTADO, tronco: 24, cabeza: -4, hD: 150, cD: -10, hI: 30, cI: 60 } }, { f: TB + 50, v: { ...SENTADO, tronco: 26, cabeza: -6, hD: 140, cD: -6, hI: 30, cI: 60 } }],
        miradas: [{ f: 0, v: { x: -0.4, y: -0.6 } }, { f: TB, v: { x: -0.9, y: 0 } }], habla: [[0, k65(320.6)], [k65(321.41), k65(323.63)]], caras: [{ f: 0, v: "feliz" }, { f: TB, v: "picaro" }] }}
      hud={<><Hud />
        {f < TB && <Pensamiento x={560} y={330} w={540} h={260} desde={6} cola={{ x: 900, y: 360 }}><Inquieto f={f} /></Pensamiento>}
        <Globo texto="?" x={600} y={290} desde={k65(323.7)} hasta={161} tam={110} />
      </>} />
    {f >= TB && f < TL && <HombroLeo x={330} y={860} r={250} />}
    </>
  );
};
// ---------- 66 · DESIRE IS LOUD. IT IS NOT STRONG. — megáfono enorme contra una pesa que no sube ----------
const k66 = kDe(324.97);
const T66 = k66(326.2);
// megáfono en el mundo (boca hacia la derecha)
const MegafonoMundo: React.FC<{ x: number; y: number; f: number; s?: number }> = ({ x, y, f, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s * (1 + 0.05 * Math.sin(f / 2))})`}>
    <rect x={-40} y={-14} width={34} height={28} rx={6} fill="#2a2e36" stroke="#6a707b" strokeWidth={4} />
    <path d="M-8,-18 L70,-58 L70,58 L-8,18 Z" fill="#3a3f48" stroke="#6a707b" strokeWidth={5} />
    <ellipse cx={70} cy={0} rx={12} ry={58} fill="#4a505a" stroke="#7a808b" strokeWidth={4} />
    {[0, 1, 2, 3].map((k) => { const t = ((f / 9 + k / 4) % 1); return <path key={k} d={`M${95 + t * 230},${-60 - t * 50} Q${130 + t * 270},0 ${95 + t * 230},${60 + t * 50}`} fill="none" stroke={ACENTO} strokeWidth={12 * (1 - t) + 2} opacity={1 - t} strokeLinecap="round" />; })}
  </g>
);
// pesa con la que la sombra no puede
const PesaMundo: React.FC<{ x: number; y: number; alto: number }> = ({ x, y, alto }) => (
  <g transform={`translate(${x},${y - alto})`}>
    <rect x={-190} y={-12} width={380} height={24} rx={10} fill="#8a909b" stroke="#2a2e36" strokeWidth={4} />
    {[-160, 160].map((dx) => <rect key={dx} x={dx - 28} y={-78} width={56} height={156} rx={14} fill="#2a2e36" stroke="#9aa0aa" strokeWidth={5} />)}
    {[-205, 205].map((dx) => <rect key={dx} x={dx - 14} y={-46} width={28} height={92} rx={8} fill="#3a3f48" stroke="#9aa0aa" strokeWidth={4} />)}
    <rect x={-120} y={92} width={240} height={52} rx={12} fill="#14161b" stroke="#cfd4dc" strokeWidth={3} />
    <text x={0} y={128} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={32} fill="#f4efe6" letterSpacing={4}>STRENGTH</text>
  </g>
);
export const P66Fuerte: React.FC = () => {
  const f = useF();
  const g = f - T66;
  const MX66 = L.leo - 330;
  const gritaP = { hD: 100, cD: 40, hI: 20, cI: 40, tronco: -10, cabeza: -8 };
  const tiraP = (k: number) => (g > 44 ? { hD: 4, cD: 0, hI: 4, cI: 0, tronco: 30, cabeza: 26 } : { hD: 8 + (k % 2 ? 6 : 0), cD: 30 + (k % 2 ? 10 : 0), hI: 8 + (k % 2 ? 6 : 0), cI: 30 + (k % 2 ? 10 : 0), tronco: 8 + (k % 2 ? 4 : 0), cabeza: -16 });
  const mara = maraLav({
    escala: ESC * 1.15, opacidad: () => 0.97, dir: [{ f: 0, v: 1 }], ruta: [{ f: 0, x: MX66, y: LP - 10 }],
    caras: [{ f: 0, v: "enojo" }, { f: T66, v: "enojo" }, { f: T66 + 30, v: "cansado" }], habla: [[0, T66 - 2]],
    poses: g < 0 ? [{ f: 0, v: gritaP }, { f: 12, v: { ...gritaP, tronco: -16, cabeza: -14 } }, { f: 24, v: gritaP }] : Array.from({ length: 12 }).map((_, k) => ({ f: T66 + k * 4, v: tiraP(k) })),
  });
  const mano = manoMundo(mara, f, 30);
  const manoI = manoMundo(mara, f, 30, "I");
  const barY = g > 44 ? LP - 70 : (mano.y + manoI.y) / 2 + 6 + (g > 0 ? Math.sin(g * 1.7) * 4 : 0);
  return (
    <Lav cl={g < 0 ? [mira(0, L.leo - 150, 640, 1.75), mira(T66 - 1, L.leo - 140, 640, 1.85)] : [mira(T66, MX66 + 120, 640, 1.85), mira(T66 + 50, MX66 + 120, 640, 1.95)]} tenzo={{ no: true }}
      extra={<><Actor {...mara} />
        {g < 0 && <MegafonoMundo x={mano.x + 10} y={mano.y - 20} f={f} s={1.15} />}
        {g >= 0 && <PesaMundo x={(mano.x + manoI.x) / 2} y={barY} alto={0} />}
        {g >= 0 && <CaraMara a={mara} desde={T66} enojo={1} />}
        {g >= 0 && [0, 1].map((i) => { const t = ((g + i * 9) % 18) / 18; return <path key={i} d={`M${MX66 + (i ? 70 : -60)},${LP - 330 + t * 60} q6,10 0,16 q-6,-6 0,-16`} fill="#bfe3f5" opacity={1 - t} transform={`scale(1)`} />; })}
      </>}
      leo={{ poses: [{ f: 0, v: { ...CEL_SENT, tronco: -14, cabeza: -10 } }, { f: T66, v: { ...SENTADO, tronco: 0, cabeza: 0, hD: 20, cD: 50, hI: 20, cI: 50 } }], miradas: [{ f: 0, v: { x: -0.9, y: -0.2 } }], caras: [{ f: 0, v: "miedo" }, { f: T66 + 30, v: "duda" }] }}
      hud={<><Hud />
        <div style={{ position: "absolute", left: 120, top: 120, fontFamily: F_HUD, fontWeight: 600, fontSize: 88, color: "#fff3d6", opacity: g < 0 ? lerp(f, 2, 8, 0, 1) : 0, textShadow: "0 4px 14px #000" }}>DESIRE IS LOUD.</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, fontFamily: F_HUD, fontWeight: 600, fontSize: 80, color: ACENTO, opacity: lerp(f, k66(326.6), k66(326.9), 0, 1), textAlign: "center", textShadow: "0 4px 14px #000" }}>IT IS NOT STRONG.</div>
      </>} />
  );
};
// ---------- 67 · más amplio: levanta el farol, «a fire made of paper»; Leo lo mira ----------
const tenzoFarol = (o: Partial<ActorProps> = {}) => ({ poses: [{ f: 0, v: DOBLA_A }, { f: 24, v: { ...DOBLA_A, hD: 70, cD: 20, cabeza: 0 } }], enManoD: (f: number) => (f >= 22 ? <FarolMano luz={1.3} /> : null), miradas: [{ f: 0, v: { x: -0.9, y: -0.1 } }], ...o });
const k67 = kDe(327.95);
const FX = 1510, FY = 760; // el farol en la mano de Tenzo (mundo)
export const P67Papel: React.FC = () => {
  const f = useF();
  // v3: inserto bajo, a la altura de la mesa: el farol sube en la mano de Tenzo hasta tapar media cara; adentro se ve la llama y el papel
  // v4: «lifts the lantern a little» = general bajo desde el lado de Leo (no el encuadre de P68) · «a fire made of paper» = INSERTO: el farol en las dos manos,
  // los pulgares hunden el papel y la llama se ve adentro
  const TI = 52;
  const c67 = [mira(0, 1530, 760, 1.95), mira(TI - 1, 1545, 740, 2.1)];
  if (f >= TI) return <><FarolEnManos desde={TI} aprieta={lerp(f, k67(330.7), k67(331.1), 0, 1) * (0.85 + 0.15 * Math.sin((f - TI) / 5))} /><Hud /><Pildora texto="A FIRE MADE OF PAPER" x={960} y={110} desde={k67(330.3)} color="#ffe2a6" tam={52} /></>;
  return (
    <Lav cl={c67} toalla={0.8} sp={{ farol: f < 22 }} leo={{ no: true }}
      tenzo={tenzoFarol({ habla: [[k67(329.99), k67(331.87)]], caras: [{ f: 0, v: "feliz" }], poses: [{ f: 0, v: DOBLA_A }, { f: 24, v: { ...DOBLA_A, hD: 70, cD: 20, cabeza: 0 } }, { f: 50, v: { ...DOBLA_A, hD: 95, cD: 20, cabeza: -6, tronco: -4 } }], miradas: [{ f: 0, v: { x: -0.9, y: -0.1 } }, { f: 40, v: { x: -0.6, y: 0.4 } }] })}
      hud={<><Hud /><Pildora texto="A FIRE MADE OF PAPER" x={560} y={250} desde={k67(330.6)} color="#ffe2a6" tam={46} /></>} />
  );
};
// ---------- 68 · «feed it or it will eat you… just watch it»: la llama de papel crece, él la mira, se apaga sola ----------
const k68 = kDe(331.93);
export const P68Mirar: React.FC = () => {
  const f = useF();
  // v3: «feed it or it will eat you» = la llama se agiganta y Tenzo se echa atrás siguiéndola con los ojos (contrapicado desde el otro lado);
  // «but if you only watch it» = comparación FEED IT / WATCH IT; «burns itself out» = vuelta a él, la llama se achica y la mirada baja con ella
  const TC = k68(334.38), TD = k68(336.9);
  const t = interpolate(f, [0, k68(332.6), k68(333.5), TC, TD, k68(337.8)], [0.25, 0.5, 1.15, 1.05, 0.5, 0.08], cl);
  const comp = f >= TC && f < TD;
  return (
    <>
      <Lav cl={f < TC ? [mira(0, 1600, 700, 2.4), mira(TC - 1, 1605, 694, 2.55)] : [mira(TD, 1650, 660, 2.9), mira(167, 1652, 664, 3.0)]} leo={{ no: true }} mara={{ no: true }} toalla={0.8} sp={{ farol: false }}
        extra={<Llama x={FX + 8} y={FY + 45} t={t} f={f} />}
        tenzo={{ ...tenzoFarol(), poses: [{ f: 0, v: { ...DOBLA_A, hD: 70, cD: 20, cabeza: 0 } }, { f: k68(333.3), v: { ...DOBLA_A, hD: 60, cD: 20, hI: 120, cI: 30, cabeza: 12, tronco: -12 } }, { f: TD, v: { ...DOBLA_A, hD: 70, cD: 20, cabeza: 4 } }, { f: k68(337.6), v: { ...DOBLA_A, hD: 70, cD: 20, cabeza: -8, tronco: 6 } }], enManoD: <FarolMano luz={1.3} />,
          miradas: [{ f: 0, v: { x: -0.9, y: 0 } }, { f: k68(333.2), v: { x: -0.5, y: -0.9 } }, { f: TD, v: { x: -0.6, y: -0.3 } }, { f: k68(337.6), v: { x: -0.6, y: 0.5 } }],
          habla: [[0, k68(334.41)], [k68(334.6), 167]], caras: [{ f: 0, v: "neutral" }, { f: k68(333.2), v: "miedo" }, { f: TD, v: "feliz" }] }}
        hud={<><Hud />{f < TC && <Pildora texto="FEED IT…" x={560} y={250} desde={k68(332.5)} color="#ffb070" tam={46} />}{f >= TD && <Pildora texto="IT BURNS ITSELF OUT" x={560} y={250} desde={k68(337.0)} color="#ffe2a6" tam={46} />}</>} />
      {comp && <><Velo desde={TC} o={0.72} />
        <Comparacion x={960} y={560} w={560} h={560} desde={TC} hasta={TD}
          izq={{ titulo: "FEED IT", dato: "IT GROWS", color: "#b8323a", contenido: <g transform="translate(280,400)"><Llama x={0} y={0} t={1.3 + 0.4 * lerp(f, TC, TC + 40, 0, 1)} f={f} /></g> }}
          der={{ titulo: "WATCH IT", dato: "IT BURNS OUT", color: "#e0a63a", contenido: <g transform="translate(280,400)"><Llama x={0} y={0} t={lerp(f, TC + 20, TD - 10, 1.4, 0.15)} f={f} color="#ffc93c" /></g> }} vs="VS" /><Hud /></>}
    </>
  );
};
// ---------- 69 · la sombra ya no sonríe: se agranda y se inclina sobre Leo; él la mira y se corre en el asiento ----------
const k69 = kDe(337.5);
export const P69SinSonrisa: React.FC = () => {
  const f = useF();
  // v3: «burns itself out every time» = inserto del farol que se apaga y humea · «behind Leo's shoulder» = corte a Leo con la sombra detrás, cara SERIA desde que aparece (boca recta),
  // «not smiling anymore» = se enoja en ese segundo · «don't listen to him» = contraplano bajo: la sombra se agranda y se inclina sobre Leo; textos en caja, enteros
  const TB = k69(339.3), TR = k69(343.0);
  const s = interpolate(f, [TR, k69(346)], [1.15, 1.4], cl);
  const mara = maraLav({ opacidad: () => 0.97, dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "neutral" }], habla: [[k69(343.07), k69(346.1)]],
    ruta: [{ f: 0, x: L.leo - 330, y: LP - 10 }, { f: TR - 1, x: L.leo - 300, y: LP - 10 }, { f: TR, x: L.leo - 250, y: LP - 10 }, { f: 290, x: L.leo - 225, y: LP - 10 }],
    poses: [{ f: 0, v: { hD: 20, cD: 20, hI: 20, cI: 20, tronco: 4, cabeza: 4 } }, { f: k69(341.9), v: { hD: 30, cD: 60, hI: 30, cI: 60, tronco: 14, cabeza: 14 } }, { f: TR, v: { hD: 100, cD: 50, hI: 60, cI: 50, tronco: 26, cabeza: 22 } }, { f: k69(344.8), v: { hD: 125, cD: 30, hI: 80, cI: 40, tronco: 34, cabeza: 26 } }] });
  if (f < TB) {
    const t = interpolate(f, [0, k69(338.2), k69(339.0)], [0.55, 0.3, 0], cl);
    return <><FarolApaga t={t} humo={lerp(f, k69(338.6), k69(339.1), 0, 1)} /><Hud /><Pildora texto="EVERY TIME" x={960} y={180} desde={k69(338.1)} color="#ffe2a6" tam={46} /></>;
  }
  // v4: «behind Leo's shoulder» = Leo CERRADO (zoom 2,4) que aprieta el tel contra el pecho, la sombra asoma detrás de su hombro ·
  // «not smiling anymore» = corte a la cara de la sombra que se pone seria · «don't listen to him» = el contrapicado de siempre, la sombra crece
  const T1 = k69(341.25);
  const cam = f < T1 ? [mira(TB, L.leo - 90, 650, 2.3), mira(T1 - 1, L.leo - 96, 646, 2.4)] : f < TR ? [...corte(T1, L.leo - 300, 470, 2.7), mira(TR - 1, L.leo - 300, 462, 2.85)] : [...corte(TR, L.leo - 90, 565, 1.9), mira(293, L.leo - 95, 555, 2.05)];
  return (
    <Lav cl={cam} tenzo={{ no: true }}
      extra={<Escalar x={L.leo - 290} y={LP} s={f < TR ? 1.15 : s}><Actor {...mara} /><CaraMara a={mara} desde={TB} enojo={0} /><CaraMara a={mara} desde={k69(341.8)} enojo={1} /></Escalar>}
      leo={{ poses: [{ f: 0, v: { ...CEL_SENT, cabeza: 6 } }, { f: TB + 6, v: { ...SENTADO, hD: 24, cD: 150, hI: 30, cI: 120, cabeza: 10, tronco: 12 } }, { f: k69(340.4), v: { ...SENTADO, hD: 20, cD: 158, hI: 34, cI: 128, cabeza: 4, tronco: 16 } }, { f: T1 - 2, v: { ...SENTADO, hD: 22, cD: 154, hI: 32, cI: 124, cabeza: 0, tronco: 18 } }, { f: k69(341.5), v: { ...CEL_SENT, cabeza: -10, tronco: 14 } }, { f: TR, v: { ...CEL_SENT, cabeza: -6, tronco: 22, hI: 60, cI: 90 } }, { f: k69(344.9), v: { ...CEL_SENT, cabeza: 8, tronco: 8, hI: 30, cI: 60 } }],
        miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }, { f: k69(340.6), v: { x: -0.7, y: -0.3 } }, { f: k69(341.5), v: { x: -0.6, y: -0.8 } }, { f: k69(344.9), v: { x: 0.9, y: 0.2 } }],
        caras: [{ f: 0, v: "cansado" }, { f: k69(340.6), v: "duda" }, { f: k69(341.9), v: "miedo" }, { f: k69(344.9), v: "duda" }] }}
      hud={<><Hud />
        {f >= T1 && f < TR && <Pildora texto="NOT SMILING ANYMORE" x={960} y={930} desde={k69(341.95)} color="#ff8a5a" tam={48} />}
        <MaraCaja texto="don't listen to him" x={40} y={170} desde={k69(343.07)} hasta={k69(344.8)} tam={66} />
        <MaraCaja texto="he's old" x={40} y={170} desde={k69(344.83)} hasta={k69(345.7)} tam={80} />
        <MaraCaja texto="he doesn't understand" x={40} y={170} desde={k69(345.75)} tam={62} /></>} />
  );
};
// ---------- 70 · de perfil, a la altura de la mesa: «how long?» → «how long what?» → «to burn out?» ----------
const k70 = kDe(347.31);
export const P70Cuanto: React.FC = () => {
  const f = useF();
  // v3: «How long? Leo asks» = Leo en plano propio, se inclina · «How long what?» = dos de perfil a la altura de la mesa con el farol al medio · «to burn out?» = Leo cerrado señalando el farol
  const TT = k70(349.3), TL = k70(350.65);
  // v4: el tramo del medio deja el general de los dos sentados: PERFIL a la altura de la mesa, el farol en el centro del cuadro entre las dos caras ·
  // «to burn out?» = Leo con el farol grande y desenfocado en primer término, lo señala
  // v6: el del medio = plano de dos a la altura de la mesa, los dos ENTEROS; el último = Leo cerrado, el farol en el borde (Tenzo fuera de cuadro)
  const cam = f < TT ? [mira(0, 1200, 690, 2.5), mira(TT - 1, 1206, 692, 2.6)] : f < TL ? [...corte(TT, 1450, 720, 1.75), mira(TL - 1, 1452, 716, 1.8)] : [...corte(TL, 1220, 680, 2.4), mira(165, 1216, 678, 2.5)];
  return (
    <>
    <Lav cl={cam} toalla={0.8} sp={{ farol: false }} mara={{ no: true }}
      leo={{ enManoD: () => null, poses: [{ f: 0, v: { ...SENTADO, tronco: 4, cabeza: 0, hD: 12, cD: 40, hI: 30, cI: 60 } }, { f: 10, v: { ...SENTADO, tronco: 18, cabeza: -4, hD: 12, cD: 40, hI: 30, cI: 60 } }, { f: TL, v: { ...SENTADO, tronco: 20, cabeza: -6, hD: 100, cD: 10, hI: 30, cI: 60 } }, { f: TL + 30, v: { ...SENTADO, tronco: 22, cabeza: -2, hD: 95, cD: 14, hI: 30, cI: 60 } }],
        miradas: [{ f: 0, v: MIRA_TENZO }, { f: TL + 4, v: { x: 0.9, y: 0.3 } }, { f: TL + 30, v: MIRA_TENZO }], caras: [{ f: 0, v: "duda" }, { f: TL, v: "determinado" }], habla: [[0, k70(348.11)], [k70(350.73), k70(352.77)]] }}
      tenzo={{ ...tenzoFarol(), poses: [{ f: 0, v: { ...DOBLA_A, hD: 70, cD: 20, cabeza: 0 } }, { f: TT, v: { ...DOBLA_A, hD: 70, cD: 20, cabeza: -14, tronco: -4 } }], enManoD: <FarolMano luz={1.2} />, habla: [[k70(349.39), k70(350.57)]], caras: [{ f: 0, v: "feliz" }, { f: TT, v: "duda" }],
        miradas: [{ f: 0, v: { x: -0.9, y: 0 } }, { f: TT, v: { x: -0.9, y: -0.2 } }] }}
      hud={<><Hud />{f < TT && <Globo texto="How long?" x={1300} y={300} desde={4} hasta={TT} cola="abajo" tam={60} />}{f >= TT && f < TL && <Globo texto="How long what?" x={1300} y={200} desde={TT + 3} hasta={TL - 1} cola="abajo" tam={54} />}</>} />
    {f >= TL && <><Hud /><Temporizador seg={0} x={1600} y={150} desde={TL + 6} tam={54} /><Pildora texto="TO BURN OUT?" x={1300} y={170} desde={TL + 8} color="#ffb070" tam={46} /></>}
    </>
  );
};
// ---------- 71 · lo piensa (se rasca la barba, mira arriba) · inserto: la mano pasa sobre la llama y la achica · «less than you are afraid of» → gráfico grande ----------
const k71 = kDe(352.81);
export const P71Menos: React.FC = () => {
  const f = useF();
  const TI = k71(356.2), TG = TI; // v6: sin inserto de la mano (quedaba muerto); el gráfico entra en 356,2 y queda entero hasta el corte
  return (
    <Lav cl={f < TI ? [mira(0, 1660, 690, 2.6), mira(TI - 1, 1668, 684, 2.8)] : [mira(TG, 1640, 660, 2.5), mira(208, 1645, 656, 2.6)]} toalla={0.8} sp={{ farol: false }} mara={{ no: true }}
      leo={f < TI ? { enManoD: () => null, poses: [{ f: 0, v: { ...SENTADO, tronco: 20, cabeza: -4, hD: 12, cD: 40, hI: 30, cI: 60 } }, { f: 60, v: { ...SENTADO, tronco: 10, cabeza: 4, hD: 12, cD: 40, hI: 12, cI: 40 } }], miradas: [{ f: 0, v: MIRA_TENZO }], caras: [{ f: 0, v: "duda" }] } : { no: true }}
      extra={<Llama x={FX + 8} y={FY + 45} t={f < TI ? 0.4 : 0.12} f={f} />}
      tenzo={{ ...tenzoFarol(), poses: [{ f: 0, v: { ...DOBLA_A, hD: 70, cD: 20, cabeza: 0 } }, { f: 14, v: { ...DOBLA_A, hD: 70, cD: 20, cabeza: -16, hI: 50, cI: 140 } }, { f: 40, v: { ...DOBLA_A, hD: 70, cD: 20, cabeza: -18, hI: 56, cI: 132 } }, { f: 66, v: { ...DOBLA_A, hD: 70, cD: 20, cabeza: -14, hI: 50, cI: 140 } }, { f: 96, v: { ...DOBLA_A, hD: 70, cD: 20, cabeza: -6, hI: 56, cI: 132 } }, { f: TG, v: { ...DOBLA_A, hD: 70, cD: 20, cabeza: 4, hI: 80, cI: 0 } }],
        enManoD: <FarolMano luz={f < TI ? 1.2 : 0.6} />, miradas: [{ f: 0, v: { x: -0.9, y: 0 } }, { f: 14, v: { x: -0.3, y: -0.9 } }, { f: 96, v: { x: -0.8, y: -0.2 } }, { f: TG, v: { x: -0.9, y: 0.1 } }],
        caras: [{ f: 0, v: "neutral" }, { f: 14, v: "duda" }, { f: k71(356.0), v: "feliz" }], habla: [[k71(357.23), k71(359.77)]] }}
      hud={<><Hud />{f < TI && <Pildora texto="NOBODY EVER ASKED HIM THAT" x={960} y={170} desde={k71(354.4)} color="#ffe2a6" tam={42} />}
        {f >= TG && <><Velo desde={TG} o={0.7} /><Placa x={360} y={150} w={1200} h={780} desde={TG} /><Grafico x={420} y={210} w={1080} h={660} desde={TG} titulo="HOW LONG IT BURNS" unidad=" min" datos={[{ rotulo: "YOU FEAR", v: 60 }, { rotulo: "REAL", v: 2 }]} dec={0} destacar={1} acento="#ffc93c" tema="oscuro" paso={10} /></>}</>} />
  );
};
// ---------- 72 · la ola sobre el lavadero: sube y baja en 90 segundos; «you only have to not jump in» ----------
const k72 = kDe(359.79);
export const P72Ola: React.FC = () => {
  const f = useF();
  // v3: Leo grande adelante ACTUANDO la ola (se echa atrás cuando sube, se afloja cuando baja); Tenzo la dibuja con la mano; la ola va en un panel con fondo propio arriba
  const TU = k72(362.67), TD = k72(363.75);
  const p = interpolate(f, [0, k72(363.8)], [0, 1], cl);
  return (
    <>
      <Lav cl={[mira(0, 1430, 540, 1.5), mira(217, 1434, 544, 1.56, { curva: "inout" })]} toalla={0.8} sp={{ farol: false }} mara={{ no: true }}
        detras={<OlaMundo x={1140} y={212} w={800} h={336} p={p} seg={Math.round(interpolate(f, [0, k72(363.8)], [0, 90], cl))} titulo={f < k72(361.0) ? "90 SECONDS" : f < k72(361.9) ? "MAYBE 2 MINUTES" : f < TD ? "THE WAVE GOES UP…" : "…AND DOWN"} />}
        leo={{ enManoD: () => null, poses: [{ f: 0, v: { ...SENTADO, tronco: 14, cabeza: 0, hD: 12, cD: 40, hI: 30, cI: 60 } }, { f: k72(362.1), v: { ...SENTADO, tronco: -8, cabeza: -16, hD: 40, cD: 90, hI: 40, cI: 90 } }, { f: TU, v: { ...SENTADO, tronco: -12, cabeza: -20, hD: 50, cD: 100, hI: 50, cI: 100 } }, { f: TD, v: { ...SENTADO, tronco: 18, cabeza: 8, hD: 12, cD: 40, hI: 14, cI: 40 } }, { f: k72(365.3), v: { ...SENTADO, tronco: 12, cabeza: 2, hD: 12, cD: 40, hI: 14, cI: 40 } }],
          miradas: [{ f: 0, v: MIRA_TENZO }, { f: k72(361.9), v: { x: 0.4, y: -0.9 } }, { f: TD, v: { x: 0.5, y: 0.5 } }, { f: k72(364.6), v: MIRA_TENZO }], caras: [{ f: 0, v: "duda" }, { f: k72(362.1), v: "miedo" }, { f: TD, v: "sorpresa" }, { f: k72(364.6), v: "determinado" }] }}
        tenzo={{ ...tenzoFarol(), poses: [{ f: 0, v: { ...DOBLA_A, hD: 70, cD: 20, hI: 40, cI: 40, cabeza: 0 } }, { f: k72(362.1), v: { ...DOBLA_A, hD: 70, cD: 20, hI: 150, cI: 20, cabeza: -10 } }, { f: TD, v: { ...DOBLA_A, hD: 70, cD: 20, hI: 50, cI: 30, cabeza: 4 } }, { f: k72(364.5), v: { ...DOBLA_A, hD: 70, cD: 20, hI: 95, cI: 0, cabeza: 6 } }],
          enManoD: <FarolMano luz={1.2} />, miradas: [{ f: 0, v: { x: -0.9, y: 0 } }], habla: [[0, 200]], caras: [{ f: 0, v: "feliz" }] }} hud={<Hud />} />
      <FraseCaja texto="you only have to not jump in" desde={k72(364.4)} y={900} />
    </>
  );
};
// ---------- 73 · Leo mira el tel, lo levanta → corte: 9h 43m, el pulgar duda; la sombra chiquita en la pantalla: «just one more» ----------
const k73 = kDe(367.01);
const MaraMini: React.FC<{ x: number; y: number; desde: number }> = ({ x, y, desde }) => {
  const f = useF();
  if (f < desde) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}><svg width={1920} height={1080} style={{ position: "absolute" }}>
      <Actor {...maraLav({ escala: ESC * 0.55, ruta: [{ f: 0, x, y }], opacidad: () => lerp(f, desde, desde + 8, 0, 1), dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "picaro" }],
        poses: [{ f: 0, v: { hD: 100, cD: 20, hI: 90, cI: 30, tronco: -10 } }, { f: desde + 14, v: { hD: 110, cD: 10, hI: 100, cI: 20, tronco: -20 } }, { f: desde + 28, v: { hD: 100, cD: 20, hI: 90, cI: 30, tronco: -10 } }, { f: desde + 42, v: { hD: 110, cD: 10, hI: 100, cI: 20, tronco: -20 } }] })} />
    </svg></AbsoluteFill>
  );
};
export const P73Pantalla: React.FC = () => {
  const f = useF();
  // v3: «looks at the phone · the screen is still on» = cenital de la mesa: el tel encendido, la mano entra y lo levanta
  if (f < 99) return <><TelCenital levanta={lerp(f, k73(368.4), k73(369.6), 0, 1)} texto="9h 42m" /><Hud {...H83} /><Pildora texto="STILL ON" x={1500} y={880} desde={k73(368.9)} color="#ffb070" tam={44} /></>;
  const g = f - 99;
  const duda = 14 * Math.sin(g / 6) * lerp(g, 0, 20, 0, 1);
  return (
    <Fondo>
      <TelGrande modo="screentime" min={582} minHasta={583} x={960} y={560} s={0.86} desde={90} />
      <div style={{ position: "absolute", inset: 0, transform: `translate(${duda}px, ${-Math.abs(duda) * 0.6}px)` }}><DedosTel x={960} y={560} s={0.86} /></div>
      <MaraMini x={1010} y={940} desde={k73(372.6)} />
      <Hud {...H83} /><MaraCaja texto="just one more" x={1300} y={260} desde={k73(372.79)} tam={74} />
    </Fondo>
  );
};
// ---------- 74 · contraplano: la sombra en primer término; Leo, nítido, por primera vez en diez años no le contesta ----------
const k74 = kDe(374.27);
export const P74NoResponde: React.FC = () => {
  const f = useF();
  const T = k74(376.29);
  // v3: contraplano de verdad: la sombra grande y desenfocada en primer término (izq), Leo nítido; deja el tel, se da vuelta y NO contesta; textos en caja, sin pisar
  const ene = lerp(f, T + 10, T + 30, 0, 1);
  return (
    <>
      <Lav cl={[mira(0, L.leo - 60, 640, 2.4), mira(117, L.leo - 50, 636, 2.55)]} tenzo={{ no: true }} mara={{ no: true }}
        leo={{ poses: [{ f: 0, v: CEL_SENT }, { f: T - 4, v: { ...CEL_SENT, cabeza: 4, tronco: 0 } }, { f: T + 8, v: { ...SENTADO, hD: 12, cD: 40, hI: 20, cI: 40, cabeza: -6, tronco: -6 } }, { f: T + 40, v: { ...SENTADO, hD: 12, cD: 40, hI: 20, cI: 40, cabeza: -10, tronco: -8 } }],
          enManoD: (fr: number) => (fr < T + 8 ? <Tel /> : null),
          giros: [{ f: 0, v: 0 }, { f: T, v: 0 }, { f: T + 10, v: 0.55 }], caras: [{ f: 0, v: "cansado" }, { f: T, v: "determinado" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }, { f: T, v: { x: 0.9, y: 0 } }] }}
        hud={<Hud {...H83} />} />
      <MaraPrimer x={190 + 30 * Math.sin(f / 14)} y={660 - 20 * lerp(f, T, T + 20, 0, 1)} r={360} enojo={ene} blur={10} />
      <MaraCaja texto="hey… Leo" x={620} y={120} desde={2} hasta={k74(375.4)} tam={70} />
      <MaraCaja texto="just one more" x={620} y={120} desde={k74(375.45)} hasta={T + 20} tam={70} />
      <Calendario texto="FIRST TIME IN 10 YEARS" x={1120} y={150} desde={k74(374.7)} acento={ACENTO} />
      <Globo texto="…" x={1450} y={420} desde={T + 6} hasta={116} tam={70} />
    </>
  );
};
// ---------- 75 · cerca: gira, da vuelta el tel sobre la mesa (golpe) y se echa atrás a mirarlo ----------
const k75 = kDe(378.19);
export const P75BocaAbajo: React.FC = () => {
  const f = useF();
  const T0 = k75(378.85), T1 = k75(379.35);
  const g = f - T1;
  const TX = L.leo + 230, TY = LP - 168;
  return (
    <Lav cl={[mira(0, L.leo + 110, 690, 2.3), mira(T0 - 4, L.leo + 115, 690, 2.4), ...corte(T0 - 3, TX - 20, TY + 10, 4.2), mira(T1 + 22, TX - 24, TY + 8, 4.3), ...corte(T1 + 23, L.leo + 90, 680, 2.6), mira(127, L.leo + 95, 678, 2.7)]} tenzo={{ no: true }} telMesa={f >= T1 ? { bocaAbajo: true } : undefined}
      extra={<>
        {f >= T0 && f < T1 && <TelVuelta x={TX - 25} y={TY - 26} giro={lerp(f, T0, T1, 0, 1)} s={0.9} />}
        {g >= 0 && g < 22 && <g opacity={1 - g / 22}>{[0, 1, 2, 3, 4, 5, 6].map((k) => { const a = -Math.PI + (k / 6) * Math.PI; return <line key={k} x1={TX + Math.cos(a) * (40 + g * 3)} y1={TY + 10 + Math.sin(a) * (20 + g * 2)} x2={TX + Math.cos(a) * (70 + g * 4)} y2={TY + 10 + Math.sin(a) * (40 + g * 3)} stroke="#fff3d6" strokeWidth={5} strokeLinecap="round" />; })}</g>}
      </>}
      leo={{ poses: [{ f: 0, v: CEL_SENT }, { f: k75(378.3), v: { ...CEL_SENT, cabeza: 10, tronco: 6 } }, { f: T0, v: { ...SENTADO, hD: 98, cD: 4, cabeza: 10, tronco: -16 } }, { f: T1, v: { ...SENTADO, hD: 96, cD: 0, cabeza: 12, tronco: -20 } }, { f: T1 + 14, v: { ...SENTADO, hD: 60, cD: 20, cabeza: 10, tronco: -10 } }, { f: k75(380.9), v: { ...SENTADO, hD: 20, cD: 50, hI: 20, cI: 50, cabeza: 8, tronco: -8 } }],
        enManoD: (fr: number) => (fr < T0 ? <Tel /> : null), caras: [{ f: 0, v: "determinado" }, { f: k75(380.9), v: "neutral" }], miradas: [{ f: 0, v: { x: 0.6, y: 0.6 } }, { f: T0, v: { x: 0.8, y: 0.6 } }, { f: k75(380.9), v: { x: 0.9, y: 0.4 } }] }}
      hud={<><Hud {...H83} /><Pildora texto="FACE DOWN" x={1500} y={170} desde={T1 + 2} color="#fff3d6" tam={40} /></>} />
  );
};
// ---------- 76 · la ola sube sobre la escena → corte: pecho apretado (mano al pecho), el pulgar tiembla hacia el tel ----------
const k76 = kDe(382.45);
const leoMira = { poses: [{ f: 0, v: DOBLA_A }], enManoD: () => null, miradas: [{ f: 0, v: { x: 0.6, y: 0.8 } }] };
export const P76Sube: React.FC = () => {
  const f = useF();
  // v3: «the wave goes up» = la ola en su panel y Leo tenso (no fondo negro) · «chest is tight» = se agarra el pecho · «his thumb wants the screen» = inserto del pulgar que tiembla hacia el tel boca abajo
  const TP = k76(385.6), TV = k76(388.15);
  const tiembla = (k: number) => ({ ...SENTADO, tronco: 14 + (k % 2 ? 2 : 0), cabeza: 16, hD: 30, cD: 150, hI: 40, cI: 60 });
  if (f >= TP && f < TV) return <><PulgarTiembla desde={TP} /><Hud {...H83} /><Pildora texto="SO BADLY IT ALMOST HURTS" x={960} y={150} desde={k76(386.9)} color="#ff8a5a" tam={42} /></>;
  return (
    <>
      <Lav cl={f < 55 ? [mira(0, 1240, 600, 1.9), mira(54, 1245, 598, 2.0)] : [...corte(55, 1250, 690, 2.5), mira(TP - 1, 1254, 686, 2.65), ...corte(TV, 1235, 670, 2.2), mira(201, 1238, 668, 2.3)]} tenzo={{ no: true }} mara={{ opacidad: () => 0.75 }} telMesa={{ bocaAbajo: true }}
        leo={{ ...leoMira, poses: [{ f: 0, v: { ...DOBLA_A, hD: 50, cD: 60 } }, { f: 30, v: { ...SENTADO, tronco: -6, cabeza: -14, hD: 40, cD: 70, hI: 40, cI: 70 } }, { f: k76(384.2), v: { ...SENTADO, tronco: 12, cabeza: 16, hD: 30, cD: 150, hI: 40, cI: 60 } }, ...Array.from({ length: 14 }).map((_, k) => ({ f: k76(384.5) + k * 3, v: tiembla(k) })), { f: TV, v: { ...SENTADO, tronco: 18, cabeza: 20, hD: 30, cD: 150, hI: 50, cI: 110 } }],
          miradas: [{ f: 0, v: { x: 0.4, y: -0.8 } }, { f: k76(384.2), v: { x: 0.6, y: 0.8 } }], caras: [{ f: 0, v: "neutral" }, { f: 28, v: "miedo" }] }}
        hud={<><Hud {...H83} />{f >= 55 && <><Placa x={1310} y={330} w={440} h={420} desde={55} /><Medidor x={1530} y={560} R={190} desde={55} claves={[{ f: 0, v: 40 }, { f: 60, v: 70 }, { f: 140, v: 78 }]} rotulo="URGE" /></>}{f >= 55 && f < TP && <Pildora texto="CHEST TIGHT" x={560} y={250} desde={k76(384.3)} color="#ff8a5a" tam={42} />}</>} />
      {f < 55 && <PanelOla p={interpolate(f, [0, 54], [0.05, 0.3], cl)} x={940} y={150} s={0.48} reloj={false} desde={0} />}
    </>
  );
};
// ---------- 77 · treinta, sesenta (temporizador); la sombra se agiganta y se inclina: «you'll fail anyway»; Leo cierra los puños ----------
const k77 = kDe(389.17);
export const P77Sesenta: React.FC = () => {
  const f = useF();
  // v4: «thirty, sixty» = Leo aprieta los puños con la sombra detrás (temporizador) · «the shadow leans closer» = CONTRAPLANO en contrapicado desde atrás de Leo:
  // su nuca en primer término y la sombra que se agiganta encima; pose sana (tronco ≤20, cabeza ≤14: con 30-36 el torso se volvía un barrilete)
  const TC = k77(391.1);
  const s = interpolate(f, [TC, k77(393.0), 197], [1.15, 1.42, 1.48], cl);
  const puno = (k: number) => ({ ...SENTADO, tronco: 16 + (k % 2 ? 2 : -1), cabeza: 20, hD: 50 + (k % 2 ? 4 : 0), cD: 125, hI: 46 + (k % 2 ? 0 : 4), cI: 125 });
  const contra = f >= TC;
  const sombra = maraLav({ opacidad: () => 0.97, caras: [{ f: 0, v: "enojo" }, { f: k77(393), v: "picaro" }], habla: [[k77(392.97), k77(395.69)]],
    ruta: [{ f: 0, x: L.leo - 320, y: LP - 10 }, { f: k77(392.9), x: L.leo - 290, y: LP - 10 }],
    poses: [{ f: 0, v: { hD: 100, cD: 40, hI: 60, cI: 50, tronco: 12, cabeza: 10 } }, { f: k77(392), v: { hD: 120, cD: 30, hI: 80, cI: 40, tronco: 18, cabeza: 12 } }, { f: k77(394.2), v: { hD: 135, cD: 24, hI: 100, cI: 30, tronco: 20, cabeza: 14 } }, { f: 197, v: { hD: 128, cD: 30, hI: 96, cI: 34, tronco: 19, cabeza: 13 } }] });
  return (
    <>
      <Lav cl={contra ? [...corte(TC, L.leo - 190, 600, 1.8), mira(k77(393.0), L.leo - 196, 560, 1.95), mira(197, L.leo - 198, 552, 2.0)] : [mira(0, L.leo - 140, 660, 1.55), mira(TC - 1, L.leo - 140, 650, 1.6)]} tenzo={{ no: true }} telMesa={{ bocaAbajo: true }}
        extra={<Escalar x={L.leo - 300} y={LP} s={contra ? s : 1.15}><Actor {...sombra} /></Escalar>}
        leo={contra ? { no: true } : { ...leoMira, poses: [{ f: 0, v: DOBLA_A }, { f: k77(389.6), v: puno(0) }, ...Array.from({ length: 14 }).map((_, k) => ({ f: k77(389.9) + k * 3, v: puno(k) }))], caras: [{ f: 0, v: "miedo" }],
          miradas: [{ f: 0, v: { x: 0.6, y: 0.8 } }, { f: k77(390.3), v: { x: -0.6, y: -0.7 } }] }}
        hud={<><Hud {...H83} /><Temporizador seg={f < k77(390.2) ? interpolate(f, [k77(389.4), k77(390.2)], [30, 60], cl) : 60 + (f - k77(390.2)) / 30} x={1560} y={130} desde={0} tam={52} />
          <MaraCaja texto="you'll fail anyway" x={640} y={880} desde={k77(392.97)} hasta={k77(394.1)} tam={68} /><MaraCaja texto="you always do" x={700} y={880} desde={k77(394.19)} tam={72} /></>} />
      {contra && <HombroLeo x={1560} y={900} r={270} lado={-1} giro={0.3 + 0.2 * lerp(f, k77(393.6), k77(394.4), 0, 1)} />}
    </>
  );
};
// ---------- 78 · noventa: la ola baja sobre la escena → la sombra se encoge y se echa como un perro aburrido; Leo exhala ----------
const k78 = kDe(395.77);
export const P78Baja: React.FC = () => {
  const f = useF();
  const TG = k78(397.55), TC = k78(402.2);
  // la ola: del pico (0,45) baja; «not all the way» se frena a mitad; «down» sigue
  const pOla = interpolate(f, [TG, k78(399.1), k78(399.8), k78(400.3), k78(401.6), k78(402.15)], [0.42, 0.47, 0.58, 0.6, 0.62, 0.8], cl);
  // v3: la sombra se achica DURANTE la bajada de la ola (no después), Leo exhala; la ola va en un panel arriba, la escena nunca se va
  const s = interpolate(f, [TG, k78(399.1), k78(400.3), k78(401.6), k78(402.6), 235], [1.12, 1.08, 0.95, 0.92, 0.8, 0.62], cl);
  const tumba = interpolate(f, [228, 252], [0, -84], cl);
  const MX78 = L.leo - 330;
  const mara = maraLav({ opacidad: (fr: number) => interpolate(fr, [TC, 280], [0.95, 0.7], cl), dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "enojo" }], habla: [[0, 30]], ruta: [{ f: 0, x: MX78, y: LP - 10 }],
    poses: [{ f: 0, v: { hD: 110, cD: 30, hI: 70, cI: 40, tronco: 22, cabeza: 18 } }, { f: TC, v: { hD: 30, cD: 20, hI: 30, cI: 20, tronco: 10, cabeza: 24 } }, { f: 225, v: { hD: 10, cD: 10, hI: 10, cI: 10, tronco: 0, cabeza: 30 } }] });
  const leo = leoLav({ ...leoMira, poses: [{ f: 0, v: { ...SENTADO, tronco: 6, cabeza: 10, hD: 50, cD: 120, hI: 46, cI: 120 } }, { f: k78(399.1), v: { ...SENTADO, tronco: 10, cabeza: 12, hD: 50, cD: 120, hI: 46, cI: 120 } }, { f: k78(401.7), v: { ...SENTADO, tronco: -4, cabeza: -8, hD: 40, cD: 100, hI: 40, cI: 100 } }, { f: TC, v: { ...SENTADO, tronco: 2, cabeza: 4, hD: 40, cD: 90, hI: 40, cI: 90 } }, { f: 244, v: { ...SENTADO, tronco: 4, cabeza: 8, hD: 30, cD: 60, hI: 30, cI: 60 } }, { f: 256, v: { ...SENTADO, tronco: -10, cabeza: -10, hD: 14, cD: 30, hI: 14, cI: 30 } }],
    miradas: [{ f: 0, v: { x: -0.9, y: -0.3 } }, { f: 230, v: { x: -0.8, y: 0.6 } }], caras: [{ f: 0, v: "determinado" }, { f: TC, v: "sorpresa" }, { f: 260, v: "feliz" }] });
  const leoOk = { ...leo, caras: (leo.caras ?? []).map((k) => (k.v === "alivio" ? { ...k, v: "feliz" } : k)) }; // el kit no trae la cara «alivio»
  return (
    <>
    <Lav cl={f < TG ? [mira(0, L.leo - 120, 620, 1.8), mira(TG - 1, L.leo - 125, 615, 1.9)] : f < TC ? [...corte(TG, L.leo - 170, 610, 1.6), mira(TC - 1, L.leo - 160, 606, 1.68)] : [mira(TC, L.leo - 160, 700, 1.7), mira(301, L.leo - 150, 700, 1.8)]} tenzo={{ no: true }} telMesa={{ bocaAbajo: true }}
      extra={<><g transform={`rotate(${tumba} ${MX78} ${LP})`}><Escalar x={MX78} y={LP} s={s}><Actor {...mara} />{f >= TC && <CaraMara a={mara} desde={TC} enojo={0} />}</Escalar></g>
        {f >= 252 && [0, 1, 2].map((k) => <text key={k} x={MX78 - 190 + k * 28} y={LP - 110 - k * 26 - ((f / 3) % 12)} fontSize={30 + k * 8} fill="#ffb38a" fontWeight={700} fontFamily={F_HUD}>z</text>)}
        {((f >= 246 && f < 280) || (f >= k78(401.7) && f < k78(401.7) + 34)) && [0, 1, 2].map((k) => { const t = (f >= 246 ? f - 246 : f - k78(401.7)) / 34; return <path key={k} d={`M${L.leo + 50 + t * 70},${LP - 300 + k * 14 - t * 20} q20,-8 40,0`} stroke="#ffffff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8 * (1 - t)} />; })}</>}
      leo={leoOk}
      hud={<><Hud {...H83} /><Temporizador seg={f < TG ? 90 : 90} x={1560} y={130} desde={0} hasta={TG} tam={56} />
        {f >= TC && <Pensamiento x={1400} y={200} w={480} h={250} desde={k78(402.7)} cola={{ x: 1290, y: 420 }}><PerroDibujo w={480} h={260} /></Pensamiento>}</>} />
    {f >= TG && f < TC && <><PanelOla p={pOla} seg={90} x={620} y={16} s={0.36} reloj={false} desde={TG} />
      <Pildora texto="THE WAVE GOES DOWN" x={1440} y={330} desde={k78(399.1)} hasta={k78(400.25)} color="#ffe2a6" tam={42} />
      <Pildora texto="NOT ALL THE WAY" x={1440} y={330} desde={k78(400.3)} hasta={k78(401.7)} color="#ff8a5a" tam={42} />
      <Pildora texto="…BUT DOWN" x={1440} y={330} desde={k78(401.73)} color="#ffe2a6" tam={42} /></>}
    </>
  );
};
// ---------- 79 · la secadora zumba (tiembla, ondas, BZZZ) y Leo salta ----------
export const P79Zumba: React.FC = () => (
  <Lav cl={[mira(0, L.secadoraLeo + 60, 640, 1.9), mira(73, L.secadoraLeo + 70, 640, 2.0)]} tenzo={{ no: true }} telMesa={{ bocaAbajo: true }}
    extra={<><Zumbido x={L.secadoraLeo - 10} y={560} desde={2} /><ReaccionFx tipo="sorpresa" f0={8} x={L.leo - 30} y={LP - 330} /></>}
    leo={conReaccion(leoLav({ enManoD: () => null, poses: [{ f: 0, v: DOBLA_A }], caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }] }), "sorpresa", 8)}
    hud={<Hud {...H83} />} />
);
// ---------- 80-84 · Tenzo en la puerta con el farol hamacándose, nieve detrás ----------
const farolHamaca = (luz: number | ((f: number) => number) = 1.3) => (f: number) => <g transform={`rotate(${7 * Math.sin(f / 13)})`}><FarolMano luz={typeof luz === "function" ? luz(f) : luz} /></g>;
const tenzoPuerta = (o: Partial<ActorProps> = {}) => ({
  ruta: [{ f: 0, x: L.puerta - 80, y: LP }], dir: [{ f: 0, v: -1 as const }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: { ...FAROL, hI: 10, cI: 10 } }],
  enManoD: farolHamaca(), caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }], ...o,
});
const leoParado = (o: Partial<ActorProps> = {}) => ({ ruta: [{ f: 0, x: L.leo + 160, y: LP }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: "parado" }], enManoD: () => null, dir: [{ f: 0, v: 1 as const }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }], ...o });
// v3: el farol se hamaca de verdad (más amplio y más rápido) y el cartel OPEN se lee al derecho en todos los planos de puerta
const farolVaiven = (luz: number | ((f: number) => number) = 1.3, amp = 14) => (f: number) => <g transform={`rotate(${amp * Math.sin(f / 7.5)})`}><FarolMano luz={typeof luz === "function" ? luz(f) : luz} /></g>;
const k80 = kDe(408.25);
export const P80Puerta: React.FC = () => {
  const f = useF();
  // v3: Leo se para y gira (plano propio) → contraplano por encima de su hombro: el viejo YA está en la puerta, entero, el farol hamacándose → plano medio de Tenzo con la nieve delante
  const TO = k80(410.05), TM = k80(413.75);
  const cam = f < TO ? [mira(0, L.leo + 40, 650, 2.1), mira(TO - 1, L.leo + 60, 646, 2.2)] : f < TM ? [...corte(TO, L.puerta - 170, 700, 1.75), mira(TM - 1, L.puerta - 160, 700, 1.82)] : [...corte(TM, L.puerta - 110, 735, 2.25), mira(252, L.puerta - 108, 732, 2.35)];
  return (
    <>
      <Lav cl={cam} toalla={1} sp={{ farol: false, nieve: true }} telMesa={{ bocaAbajo: true }} extra={<OpenDerecho />}
        leo={f < TO ? leoParado({ ruta: [{ f: 0, x: L.leo - 40, y: LP }, { f: 24, x: L.leo - 40, y: LP }, { f: 50, x: L.leo + 50, y: LP }], dir: [{ f: 0, v: -1 }, { f: 16, v: 1 }], poses: [{ f: 0, v: { hD: 20, cD: 30, hI: 20, cI: 30 } }, { f: 10, v: { hD: 40, cD: 60, hI: 40, cI: 60, tronco: 8 } }, { f: 22, v: { hD: 30, cD: 50, hI: 20, cI: 30, tronco: -6, cabeza: -8 } }],
          giros: [{ f: 0, v: 0 }, { f: 18, v: 0.5 }, { f: 30, v: 0.15 }], // v4: gira la cabeza hacia la puerta al oír la campana y da dos pasos
          miradas: [{ f: 0, v: { x: -0.9, y: 0 } }, { f: 16, v: { x: 0.9, y: -0.1 } }], caras: [{ f: 0, v: "neutral" }, { f: 18, v: "sorpresa" }, { f: 40, v: "duda" }] }) : { no: true }}
        tenzo={tenzoPuerta({ enManoD: farolVaiven(1.4), caras: [{ f: 0, v: "feliz" }], poses: [{ f: 0, v: { ...FAROL, hI: 10, cI: 10 } }, { f: TM + 10, v: { ...FAROL, hI: 10, cI: 10, cabeza: 8 } }, { f: TM + 30, v: { ...FAROL, hI: 10, cI: 10, cabeza: -2 } }] })}
        hud={<Hud {...H83} />} />
      {f >= TO && f < TM && <HombroLeo x={330} y={860} r={270} lado={1} />}
      {f >= TM && <NieveCerca n={46} o={0.85} />}
      {f >= TO && f < TM && <Pildora texto="ALREADY AT THE DOOR" x={1300} y={170} desde={TO + 4} color="#ffe2a6" tam={40} />}
    </>
  );
};
// ---------- 81 · Leo (plano propio): «what's your name?» → primer plano bajo del viejo: lo piensa (se rasca la cabeza, mira arriba) → «Tenzo»: levanta el farol a la cara y se enciende ----------
const k81 = kDe(416.67);
export const P81Nombre: React.FC = () => {
  const f = useF();
  const luz = (fr: number) => interpolate(fr, [k81(422.8), k81(423.3)], [1.2, 2.6], cl);
  const TT = k81(422.6);
  return (
    <>
      <Lav cl={[mira(0, L.leo + 160, 640, 2.4), mira(74, L.leo + 160, 636, 2.5), ...corte(75, L.puerta - 200, 700, 2.0), mira(TT - 1, L.puerta - 196, 698, 2.08), ...corte(TT, L.puerta - 95, 640, 2.7), mira(216, L.puerta - 95, 636, 2.8)]} toalla={1} sp={{ farol: false, nieve: true }} telMesa={{ bocaAbajo: true }}
        extra={<><OpenDerecho />{f >= k81(422.8) && <Halo x={L.puerta - 40} y={640} r={lerp(f, k81(422.8), k81(423.4), 100, 360)} color={ORO} fuerza={0.5} />}</>}
        leo={leoParado({ caras: [{ f: 0, v: "neutral" }, { f: 30, v: "duda" }], habla: [[0, k81(418.97)]], poses: [{ f: 0, v: "parado" }, { f: 10, v: { hD: 80, cD: 30 } }, { f: 40, v: { hD: 60, cD: 120, hI: 20, cI: 20 } }, { f: 74, v: { hD: 20, cD: 20 } }] })}
        tenzo={tenzoPuerta({ enManoD: farolVaiven(luz, 6), habla: [[k81(421.35), k81(423.27)]], caras: [{ f: 0, v: "neutral" }, { f: 90, v: "duda" }, { f: k81(421.3), v: "feliz" }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }, { f: 90, v: { x: -0.4, y: -0.9 } }, { f: k81(421.2), v: { x: -0.9, y: 0 } }],
          poses: [{ f: 0, v: { ...FAROL, hI: 10, cI: 10, cabeza: 0 } }, { f: 90, v: { ...FAROL, hI: 80, cI: 150, cabeza: -14 } }, { f: 104, v: { ...FAROL, hI: 86, cI: 140, cabeza: -16 } }, { f: 118, v: { ...FAROL, hI: 80, cI: 150, cabeza: -14 } }, { f: k81(421.2), v: { ...FAROL, hI: 10, cI: 10 } }, { f: TT, v: { ...FAROL, hD: 120, cD: 60, hI: 10, cI: 10, cabeza: -4 } }] })}
        hud={<><Hud {...H83} />{f < 75 && <Globo texto="Hey… what's your name?" x={1250} y={300} desde={4} hasta={74} cola="abajo" tam={52} />}<Pildora texto="TENZO" x={960} y={950} desde={k81(422.9)} color="#ffe2a6" tam={50} /></>} />
      {f >= 75 && <NieveCerca n={30} o={0.7} />}
      {f >= 75 && f < TT && <HombroLeo x={360} y={870} r={250} />}
    </>
  );
};
// ---------- 82 · «what does that mean?» · «the cook» — sonríe, revuelve el aire — «I made the rice» (globo con el cuenco, abajo a la izquierda) ----------
const k82 = kDe(423.91);
export const P82Arroz: React.FC = () => {
  const f = useF();
  const TQ = k82(425.0); // «What does that mean?» = Leo, sobre el hombro de Tenzo
  return (
  <>
  <Lav cl={f < TQ ? [mira(0, L.leo + 240, 660, 2.0), mira(TQ - 1, L.leo + 236, 662, 2.08)] : [mira(TQ, 4060, 700, 1.9), mira(132, 4066, 696, 2.0)]} toalla={1} sp={{ farol: false, nieve: true }} extra={<OpenDerecho />}
    leo={f < TQ ? leoParado({ caras: [{ f: 0, v: "duda" }], habla: [[0, TQ - 2]], giros: [{ f: 0, v: 0.3 }], miradas: [{ f: 0, v: { x: 0.9, y: -0.1 } }], poses: [{ f: 0, v: "parado" }, { f: 4, v: { hD: 60, cD: 70, hI: 50, cI: 70, tronco: 6, cabeza: -6 } }, { f: 18, v: { hD: 70, cD: 50, hI: 60, cI: 50, tronco: 4, cabeza: 4 } }] }) : { no: true }}
    tenzo={tenzoPuerta({ enManoD: farolVaiven(1.3, 8), habla: [[k82(424.3), k82(425.4)], [k82(426.91), k82(428.21)]], caras: [{ f: 0, v: "neutral" }, { f: k82(425.5), v: "risa" }, { f: k82(426.9), v: "feliz" }],
      miradas: [{ f: 0, v: { x: -0.9, y: 0 } }, { f: k82(426.0), v: { x: -0.5, y: 0.6 } }, { f: k82(427.6), v: { x: -0.9, y: 0 } }],
      poses: [{ f: 0, v: { ...FAROL, hI: 10, cI: 10 } }, { f: k82(425.4), v: { ...FAROL, hI: 10, cI: 10, cabeza: 10, tronco: 6 } }, ...Array.from({ length: 10 }).map((_, i) => ({ f: k82(425.9) + i * 5, v: { ...FAROL, hI: 40 + (i % 2) * 70, cI: 120 - (i % 2) * 90, cabeza: 6, tronco: 4 + (i % 2) * 4 } }))] })}
    hud={<><Hud {...H83} /><Globo texto="What does that mean?" x={720} y={220} desde={2} hasta={TQ} cola="abajo" tam={50} /><Pildora texto="THE COOK" x={1500} y={160} desde={k82(425.3)} color="#ffe2a6" tam={44} />
      <Pensamiento x={480} y={720} w={480} h={290} desde={k82(426.6)} cola={{ x: 930, y: 450 }}><ArrozDibujo w={480} h={290} /></Pensamiento></>} />
  {f < TQ && <HombroTenzo x={1640} y={760} r={225} lado={1} />}
  </>
  );
};
// ---------- 83 · Leo: «will you be here tomorrow?» → Tenzo asiente: «every night» → inserto: tres dedos + 3:00 AM → Leo con el tel: «bring the phone» → «a prince» ----------
const k83 = kDe(428.33);
export const P83Manana: React.FC = () => {
  const f = useF();
  const T3 = k83(432.17), TF = k83(433.9), TP = k83(435.15);
  if (f >= T3 && f < TF) return <><TresDedos desde={T3} /><Hud {...H83} /></>;
  // v6: «every night» = inserto del farol hamacándose en la mano vieja, de noche (sin el cartel OPEN), y las noches que se prenden
  if (f >= 28 && f < T3) return <><FarolNoche desde={28} /><Hud {...H83} /><Pildora texto="EVERY NIGHT" x={960} y={1000} desde={k83(429.4)} color="#ffe2a6" tam={48} /><NochesFila x={960} y={830} desde={k83(429.6)} paso={9} /></>;
  const cam = f < 28 ? [mira(0, L.leo + 160, 640, 2.4), mira(27, L.leo + 160, 638, 2.45)] : f < T3 ? [...corte(28, L.puerta - 120, 900, 3.2), mira(T3 - 1, L.puerta - 118, 898, 3.3)] : f < TP ? [...corte(TF, L.leo + 170, 660, 2.9), mira(TP - 1, L.leo + 172, 656, 3.0)] : [...corte(TP, L.puerta - 170, 720, 2.2), mira(299, L.puerta - 176, 716, 2.35)];
  return (
    <>
      <Lav cl={cam} toalla={1} sp={{ farol: false, nieve: true }} telMesa={{ bocaAbajo: true }} extra={<OpenDerecho />}
        leo={leoParado({ ruta: [{ f: 0, x: L.leo + 160, y: LP }], caras: [{ f: 0, v: "duda" }, { f: TF, v: "neutral" }, { f: TF + 20, v: "sorpresa" }], habla: [[0, k83(429.75)]], enManoD: (fr: number) => (fr >= TF ? <Tel prendido={false} /> : null),
          poses: [{ f: 0, v: "parado" }, { f: 6, v: { hD: 30, cD: 60, hI: 30, cI: 60, tronco: 6 } }, { f: TF, v: { hD: 70, cD: 110 } }, { f: TF + 14, v: { hD: 90, cD: 100, cabeza: 6 } }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: TF, v: { x: 0.5, y: 0.8 } }, { f: TF + 20, v: { x: 0.9, y: 0 } }] })}
        tenzo={tenzoPuerta({ enManoD: farolVaiven(1.3, 10), habla: [[k83(429.4), k83(432.17)], [k83(432.3), k83(435.15)], [k83(435.2), k83(438.3)]],
          poses: [{ f: 0, v: { ...FAROL, hI: 10, cI: 10 } }, ...Array.from({ length: 4 }).map((_, i) => ({ f: k83(429.4) + i * 8, v: { ...FAROL, hI: 10, cI: 10, cabeza: i % 2 ? -4 : 12 } })), { f: k83(431.4), v: { ...FAROL, hI: 10, cI: 10, cabeza: 0 } }, { f: TP, v: { ...FAROL, hI: 60, cI: 50 } }, { f: TP + 30, v: { ...FAROL, hI: 120, cI: 20, cabeza: -6 } }] })}
        hud={<><Hud {...H83} />
          {f < 28 && <Globo texto="Will you be here tomorrow?" x={1250} y={300} desde={2} hasta={27} cola="abajo" tam={50} />}
          {/* v4: «every night» = plano bajo NUEVO (desde el piso, nieve, el farol hamacándose) + fila de noches que se prenden una por una */}
          {f >= 28 && f < T3 && <><Pildora texto="EVERY NIGHT" x={1420} y={140} desde={k83(429.4)} color="#ffe2a6" tam={48} /><NochesFila x={1420} y={230} desde={k83(429.6)} paso={9} /></>}
          {f >= TF && f < TP && <Pildora texto="BRING THE PHONE" x={960} y={950} desde={TF + 2} color="#ffb070" tam={44} />}
          {/* v4: el príncipe del próximo capítulo, GRANDE y legible: se asoma por la puerta del palacio a un mundo que nunca vio */}
        </>} />
      {/* v6: el príncipe del próximo capítulo a PANTALLA COMPLETA (reemplaza el 5º plano de Tenzo con OPEN) */}
      {f >= TP + 4 && <><PrincipeFull desde={TP + 4} abre={lerp(f, k83(436.1), k83(437.3), 0, 1)} /><Pildora texto="A PRINCE WHO HAD NEVER SEEN ONE" x={960} y={960} desde={k83(436.2)} color="#ffe2a6" tam={44} /><Hud {...H83} /></>}
      {f >= 28 && f < T3 && <NieveCerca n={34} o={0.8} />}
    </>
  );
};
// ---------- 84 · Leo grande; detrás la puerta se cierra, suena la campanita, el viejo se va con el farol, pasa el tren ----------
const k84 = kDe(438.33);
export const P84Cierra: React.FC = () => {
  const f = useF();
  // v3: Leo GRANDE; la puerta se cierra detrás (campanita), el reflejo del farol cruza el vidrio y él lo sigue con los ojos; baja el tel; pasa el tren
  const rx = interpolate(f, [0, k84(440.4)], [4040, 3400], cl);
  return (
    <Lav cl={[mira(0, L.puerta - 470, 640, 2.4), mira(112, L.puerta - 478, 638, 2.5)]} toalla={1} sp={{ farol: false, tren: k84(440.7), nieve: true }} telMesa={{ bocaAbajo: true }}
      extra={<><OpenDerecho /><Campanita x={L.puerta - 60} y={470} desde={k84(439.6)} />
        <g opacity={0.55 * lerp(f, 0, 8, 0, 1) * lerp(f, k84(440.0), k84(440.5), 1, 0)}><g transform={`translate(${rx},${455 + 10 * Math.sin(f / 6)}) scale(-0.9,0.9)`}><FarolMano luz={1.1} /></g><Halo x={rx} y={495} r={130} color={ORO} fuerza={0.35} /></g></>}
      leo={leoParado({ ruta: [{ f: 0, x: L.puerta - 520, y: LP }], caras: [{ f: 0, v: "neutral" }, { f: k84(440.6), v: "duda" }], enManoD: <Tel prendido={false} />,
        miradas: [{ f: 0, v: { x: 0.9, y: -0.4 } }, { f: k84(439.3), v: { x: 0.2, y: -0.6 } }, { f: k84(440.3), v: { x: -0.7, y: -0.5 } }, { f: k84(441.0), v: { x: 0.3, y: 0.8 } }],
        poses: [{ f: 0, v: { hD: 30, cD: 60 } }, { f: k84(439.6), v: { hD: 40, cD: 70, cabeza: -6 } }, { f: k84(441.0), v: { hD: 60, cD: 100, cabeza: 10, tronco: 4 } }] })}
      tenzo={{ no: true }} hud={<Hud {...H83} />} />
  );
};
// ---------- 85 · DAY 1 · screen time congelado; la sombra, más grande a su espalda, se inclina y susurra «tomorrow.»; él NO se da vuelta ----------
const k85 = kDe(442.09);
const HudCongelado: React.FC = () => <Hud m={583} est="congelado" />;
export const P85Dia1: React.FC = () => {
  const TS = k85(444.85);
  // v4: la sombra con un rig SANO: escala ESC*1,15 (a 1,5 con tronco 40 la cabeza se despegaba y el torso era un barrilete naranja), tronco ≤18, cabeza ≤14;
  // nace del piso detrás de Leo (como su propia sombra que se levanta), entra entera en cuadro y susurra con la cabeza inclinada y la mano junto a la boca
  const sombraSube = (fr: number) => interpolate(fr, [k85(445), k85(447.3)], [0, 0.88], cl);
  return (
    <Lav cl={[mira(0, L.puerta - 560, 640, 1.7), mira(TS - 1, L.puerta - 565, 640, 1.75), ...corte(TS, L.puerta - 640, 600, 1.85), mira(271, L.puerta - 630, 596, 1.95)]} toalla={1} sp={{ farol: false, nieve: true }} tenzo={{ no: true }} telMesa={{ bocaAbajo: true }}
      extra={<OpenDerecho />}
      leo={leoParado({ ruta: [{ f: 0, x: L.puerta - 520, y: LP }], caras: [{ f: 0, v: "neutral" }, { f: k85(450.3), v: "determinado" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.8 } }, { f: k85(443.2), v: { x: 0.9, y: 0 } }, { f: k85(450.3), v: { x: 0.9, y: -0.1 } }], enManoD: <Tel prendido={false} />,
        poses: [{ f: 0, v: { hD: 60, cD: 100, cabeza: 10 } }, { f: k85(443.2), v: { hD: 30, cD: 60, cabeza: 0 } }, { f: k85(450.3), v: { hD: 25, cD: 50, cabeza: -4, tronco: -2 } }] })}
      mara={{ ruta: [{ f: 0, x: L.puerta - 800, y: LP - 10 }, { f: k85(449.5), x: L.puerta - 700, y: LP - 10 }], escala: ESC * 1.15, opacidad: sombraSube, caras: [{ f: 0, v: "picaro" }], dir: [{ f: 0, v: 1 }],
        poses: [{ f: 0, v: { hD: 20, cD: 20, hI: 20, cI: 20, tronco: 6, cabeza: 4, bajar: 60 } }, { f: k85(447.3), v: { hD: 60, cD: 80, hI: 30, cI: 50, tronco: 10, cabeza: 8 } }, { f: k85(449.5), v: { hD: 95, cD: 135, hI: 30, cI: 60, tronco: 16, cabeza: 14 } }, { f: 271, v: { hD: 98, cD: 138, hI: 30, cI: 60, tronco: 18, cabeza: 14 } }], habla: [[k85(450.03), k85(450.85)]] }}
      hud={<><HudCongelado /><Pildora texto="DAY 1 · SCREEN TIME FROZEN" x={430} y={1010} desde={k85(442.6)} color="#c9ced6" /><MaraCaja texto="tomorrow." x={1180} y={180} desde={k85(450.03)} tam={86} /></>} />
  );
};
// ---------- 86 · CTA: Leo sentado, el tel boca abajo, la sombra chiquita a sus pies; «what is your shadow whispering…» ----------
const k86 = kDe(451.17);
export const P86Cta: React.FC = () => {
  const f = useF();
  const TD = k86(453.55), TT = k86(455.6), TS = k86(458.0);
  const o = interpolate(f, [TS, TS + 12], [0, 1], cl);
  const saluda = (k: number) => ({ ...SENTADO, hD: 92 + (k % 2 ? 14 : 0), cD: 50 + (k % 2 ? 40 : 0), hI: 20, cI: 40, cabeza: 4 });
  return (
    <>
      <Lav cl={[mira(0, L.leo - 20, 640, 2.0), mira(TD - 1, L.leo - 10, 640, 2.15), mira(TD, L.leo - 230, 600, 1.85), mira(283, L.leo - 240, 595, 1.95, { curva: "inout" })]} toalla={1} tenzo={{ no: true }} sp={{ luzFarol: 1.4 }} telMesa={{ bocaAbajo: true }}
        leo={{ poses: [{ f: 0, v: { ...SENTADO, hD: 30, cD: 50, hI: 20, cI: 40, cabeza: 6 } }, { f: 22, v: { ...SENTADO, hD: 30, cD: 50, hI: 20, cI: 40, cabeza: 12, tronco: -6 } }, { f: TD, v: { ...SENTADO, hD: 40, cD: -10, hI: 20, cI: 40, cabeza: 10 } }, { f: TT, v: { ...SENTADO, hD: 60, cD: 130, hI: 20, cI: 40, cabeza: -8 } }, ...Array.from({ length: 8 }).map((_, k) => ({ f: TS + k * 6, v: saluda(k) })), { f: TS + 50, v: { ...SENTADO, hD: 30, cD: 50, hI: 20, cI: 40, cabeza: 4 } }],
          enManoD: () => null, caras: [{ f: 0, v: "duda" }, { f: TD - 8, v: "neutral" }, { f: TT, v: "duda" }, { f: TS, v: "feliz" }],
          miradas: [{ f: 0, v: { x: -0.8, y: -0.2 } }, { f: 26, v: { x: 0, y: 0 } }, { f: TD, v: { x: 0.2, y: 0.7 } }, { f: TD + 20, v: { x: 0, y: 0 } }] }}
        extra={<Actor {...maraLav({ escala: ESC * 0.5, opacidad: () => 0.9, dir: [{ f: 0, v: -1 }], ruta: [{ f: 0, x: L.leo - 215, y: LP - 80 }], caras: [{ f: 0, v: "picaro" }], habla: [[0, k86(452.8)]],
          poses: [{ f: 0, v: { hD: 100, cD: 40, hI: 40, cI: 60, tronco: 26, cabeza: 20 } }, { f: 14, v: { hD: 110, cD: 30, hI: 40, cI: 60, tronco: 32, cabeza: 24 } }, { f: 28, v: { hD: 100, cD: 40, hI: 40, cI: 60, tronco: 26, cabeza: 20 } }, { f: TD, v: { hD: 20, cD: 20, hI: 20, cI: 20, tronco: 10, cabeza: 10 } }] })} />} />
      <AbsoluteFill style={{ background: "#0b0c0f", opacity: 0.25 }} />
      <ManoMara texto="psst…" x={420} y={330} desde={2} tam={70} hasta={k86(452.9)} />
      <FraseCaja texto="What is your shadow whispering to you tonight?" desde={4} hasta={TD} y={100} tam={60} />
      <CajaComentario x={110} y={800} desde={TD + 2} texto="my shadow says: just one more…" />
      <Tira30 x={390} y={150} desde={TT} hecho={1} />
      <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "flex-start", padding: "250px 110px 0 0", opacity: o }}>
        <div style={{ padding: "20px 48px", borderRadius: 999, background: ACENTO, color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 50, letterSpacing: 4, transform: `scale(${1 + 0.04 * Math.sin(f / 8)})` }}>SUBSCRIBE · DAY 2 TOMORROW</div>
      </AbsoluteFill>
    </>
  );
};
