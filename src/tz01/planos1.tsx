// tz01 · planos 1-28 (0 → 112,4 s): el cuadro 0, el cuarto de Leo, Mara, la caminata, el Spin City, Tenzo.
// Vuelta 2 (director): cada plano = acción de cuerpo entero + un componente que lleva la frase de ESE segundo.
import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { mira, useF } from "../anikit/camara";
import { Actor } from "../anikit/actor";
import { Escena } from "../anikit/escena";
import { Calendario, Contador, Pildora, RelojDia } from "../anikit/pantalla";
import { Halo, Polvo } from "../anikit/luz";
import { ACENTO, ESC, FAROL, LEO, LEO_CAPUCHA, MARA, ORO, PAL, PAL_DIA, TENZO } from "../tenzo/elenco";
import { HudTenzo, ManoMara, Rotulo } from "../tenzo/hud";
import { BolsoRopa, FarolMano, Tel, TelMesa } from "../tenzo/utileria";
import { TelGrande } from "../tenzo/graficos";
import { Broadway } from "../tenzo/sets/broadway";
import { CTO_PUNTOS, COLCHON_ALTO } from "../tenzo/sets/cuarto";
import { CAMA, CEL_SENT, CP, Cto, DOBLA_A, doblando, kDe, Lav, LAV_PUNTOS, LP, rimFrio, rimOro, rimTel, SENTADO } from "./base";
import { CajaRegalo, CartelNeon, DedosTel, DisplaySecadora, FraseCaja, LlamadaMundo, Notifs, Pensamiento, PrimerTermino, TelMano, ToallaCenital, Vaho, lerp } from "./extras";
import { Espejo, ManosCenital, PalmaToalla, PanelSusurro, TextoPlaca } from "./extras_1";

const L = LAV_PUNTOS;
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const fade = (a: number, b: number, o = 0.96) => (f: number) => interpolate(f, [a, b], [0, o], cl);
// Mara de frente, encima de Leo, con los brazos abiertos sobre él
export const maraCuarto = (escala: number, x: number, extra: Record<string, unknown> = {}) => (
  <Actor look={MARA} escala={escala} seed={5} ruta={[{ f: 0, x, y: CP }]} dir={[{ f: 0, v: 1 }]} giros={[{ f: 0, v: 0 }]}
    poses={[{ f: 0, v: { tronco: 0, cabeza: 8, hD: 105, cD: 55, hI: -105, cI: -55 } }]} caras={[{ f: 0, v: "risa" }]} opacidad={() => 0.96} {...extra} />
);
const LX = CTO_PUNTOS.colchon - 120; // x de Leo en la cama (cabeza ≈ 1065,735 · tel ≈ 1130,795)
export const Hud = ({ m = 582, d = 0, est = "normal", dia = 1 }: { m?: number; d?: number; est?: "sube" | "normal" | "congelado"; dia?: number }) => <HudTenzo min={m} dia={dia} estado={est} desde={d} />;
export const Fondo: React.FC<{ children: React.ReactNode }> = ({ children }) => <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%, #23272f, #0c0d10)" }}>{children}</AbsoluteFill>;
// pulgar que scrollea: el antebrazo de adelante oscila cada `p` cuadros
type PoseN = Record<string, number>;
const scroll = (base: PoseN, desde: number, hasta: number, p = 18, amp = 10) => {
  const out: { f: number; v: PoseN }[] = [{ f: 0, v: base }];
  for (let f = desde; f < hasta; f += p) out.push({ f, v: { ...base, cD: base.cD + amp } }, { f: f + p / 2, v: base });
  return out;
};
const Bolso: React.FC<{ desde?: number }> = ({ desde = 0 }) => { const f = useF(); return f >= desde ? <g transform={`translate(${L.leo - 110},${LP - 10})`}><BolsoRopa s={1.1} /></g> : null; };

// ---------- 1 · CUADRO 0 = la miniatura sin texto ----------
export const P01Mini: React.FC = () => (
  <Cto cl={[mira(0, 705, 590, 1.42), mira(60, 712, 590, 1.47)]} sp={{ luzPuerta: 1 }}
    detras={maraCuarto(ESC * 1.65, CTO_PUNTOS.colchon - 130)}
    medio={<Actor look={TENZO} escala={ESC} seed={2} luz={rimOro} ruta={[{ f: 0, x: CTO_PUNTOS.puerta, y: CP }]} dir={[{ f: 0, v: 1 }]}
      poses={[{ f: 0, v: FAROL }]} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.6, y: 0.2 } }]} enManoD={<FarolMano />} />} />
);
// ---------- 2 · la mano vacía: plano detalle cenital; la izquierda se cierra en el vacío, la mano que nunca llega se borra ----------
export const P02Mano: React.FC = () => (
  <>
    <ManosCenital />
    <FraseCaja texto="HANDS HELD: 0" desde={34} y={70} tam={52} />
  </>
);
// ---------- 3 · Uptown, Chicago: la cámara busca la única ventana prendida ----------
const Ventana: React.FC = () => {
  const f = useF();
  const t = 0.85 + 0.15 * Math.sin(f / 7) * Math.sin(f / 3.1);
  return (
    <g>
      <rect x={2517} y={123} width={90} height={104} fill="#2a1a14" />
      <Halo x={2580} y={190} r={120} color={ACENTO} fuerza={0.55 * t} />
      <rect x={2517} y={123} width={90} height={104} fill={ACENTO} opacity={0.18 * t} />
      <path d="M2548,227 q-6,-46 16,-56 q22,-6 26,26 l4,30 Z" fill="#141217" />
      <circle cx={2565} cy={158} r={17} fill="#141217" />
      <path d="M2550,146 l6,-14 l6,12 l6,-14 l6,13 l7,-10 l2,14 Z" fill="#141217" />
      <rect x={2584} y={170} width={9} height={14} rx={2} fill="#ffb07a" />
      <Halo x={2588} y={177} r={26} color="#ffd2b0" fuerza={0.7 * t} />
      <rect x={2517} y={123} width={90} height={104} fill="none" stroke="#4a505a" strokeWidth={6} />
      <line x1={2562} y1={123} x2={2562} y2={227} stroke="#4a505a" strokeWidth={4} />
    </g>
  );
};
export const P03Uptown: React.FC = () => (
  <Escena Set={Broadway} pal={PAL} claves={[mira(0, 2350, 330, 0.66), mira(118, 2565, 205, 2.7, { curva: "inout" })]} setProps={{ tren: 30, nieve: true }}
    medio={<Ventana />} hud={<Rotulo texto="LEO MARSH · 24 · UPTOWN, CHICAGO" desde={12} />} />
);
// ---------- 4 · 3:00 AM: la mano sostiene el tel; vibra con notificaciones ----------
export const P04Tres: React.FC = () => {
  const f = useF();
  const vib = f > 6 && (f - 6) % 12 < 5 ? 2.2 * Math.sin(f * 2.6) : 0;
  return (
    <Fondo>
      <TelGrande modo="hora" texto="3:00" sub="AM" y={500} s={0.8} inclina={vib} />
      <DedosTel x={960} y={500} s={0.8} />
      <Notifs x={960 + vib * 3} y={560} s={0.8} desde={8} textos={["12 new videos for you", "Your feed is ready", "LIVE now: don't miss it"]} cada={10} />
    </Fondo>
  );
};
// ---------- 5 · el tel dice 9h 42m: Leo en la cama a la izquierda, la pantalla a la derecha ----------
const B05 = { ...CAMA, cabeza: 24 };
export const P05Pantalla: React.FC = () => (
  <>
    <Cto cl={[mira(0, 1280, 770, 2.1), mira(118, 1290, 770, 2.25)]}
      leo={{ poses: scroll(B05, 10, 118, 16, 12), luz: { lado: 1, color: ACENTO, fuerza: 1 }, caras: [{ f: 0, v: "cansado" }], miradas: [{ f: 0, v: { x: 0.5, y: 0.7 } }] }}
      medio={<Halo x={1140} y={780} r={260} color={ACENTO} fuerza={0.35} />} />
    <TelGrande modo="screentime" min={300} minHasta={582} x={1440} y={540} s={0.74} desde={4} />
    <Hud d={50} />
  </>
);
// ---------- 6 · nueve horas de un día: la barra de 24 h se llena y a Leo (grande, al lado) cada hora le hunde los hombros ----------
const B0 = 150, BW = 1180, BG = 6, BLK = (BW - 23 * BG) / 24;
export const P06Dia: React.FC = () => {
  const f = useF();
  const lleno = interpolate(f, [4, 52], [0, 9.7], { ...cl, easing: (t: number) => t * t * (3 - 2 * t) });
  const caida = (k: number) => interpolate(f, [4 + k * 5, 8 + k * 5], [0, 1], cl);
  const hund = Array.from({ length: 9 }).reduce<number>((a, _, k) => a + caida(k) / 9, 0);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 70% 60%, #23272f, #0c0d10)" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {Array.from({ length: 24 }).map((_, k) => {
          const v = Math.max(0, Math.min(1, lleno - k));
          const x = B0 + k * (BLK + BG);
          return <g key={k}><rect x={x} y={560} width={BLK} height={150} rx={9} fill="#2b2f37" /><rect x={x} y={560} width={BLK * v} height={150} rx={9} fill={ACENTO} /></g>;
        })}
        {[0, 6, 12, 18, 24].map((hh) => <text key={hh} x={B0 + hh * (BLK + BG) - (hh === 24 ? BG : 0)} y={750} fontSize={30} fill="#7d838d" textAnchor="middle" fontWeight={600}>{hh}h</text>)}
        <text x={B0 + 9.7 * (BLK + BG) * Math.min(1, lleno / 9.7)} y={520} fontSize={92} fontWeight={700} fill={ACENTO} textAnchor="middle" opacity={lerp(f, 6, 12, 0, 1)}>{`${Math.floor(lleno)}h ${String(Math.round((lleno % 1) * 60)).padStart(2, "0")}m`}</text>
        <Actor look={LEO} escala={ESC * 1.75} seed={1} luz={rimTel} ruta={[{ f: 0, x: 1600, y: 1010 }]} dir={[{ f: 0, v: -1 }]} enManoD={<Tel s={1.1} />}
          poses={[{ f: 0, v: { tronco: 2 + 22 * hund, cabeza: 14 + 16 * hund, hD: 30, cD: 125, hI: 8 + 30 * hund, cI: 20, bajar: 14 * hund } }]}
          caras={[{ f: 0, v: "cansado" }, { f: 40, v: "triste" }]} miradas={[{ f: 0, v: { x: -0.9, y: -0.3 } }, { f: 20, v: { x: 0.5, y: 0.8 } }]} />
      </svg>
      <Pildora texto="ONE DAY · 24 HOURS" x={B0 + BW / 2} y={800} desde={2} color="#c9ced6" tam={40} />
      <Hud />
    </AbsoluteFill>
  );
};
// ---------- 7 · no se acuerda de ninguna: los videos se borran en el globo ----------
const Miniaturas: React.FC = () => {
  const f = useF();
  return (
    <g>{[0, 1, 2].map((k) => {
      const x = 60 + k * 150, borra = lerp(f, 14 + k * 12, 22 + k * 12, 1, 0);
      return (
        <g key={k}>
          <rect x={x} y={50} width={128} height={160} rx={14} fill="none" stroke="#9aa0aa" strokeWidth={4} strokeDasharray="10 8" />
          <text x={x + 64} y={150} textAnchor="middle" fontSize={64} fontWeight={700} fill="#9aa0aa" opacity={1 - borra}>?</text>
          <g opacity={borra}>
            <rect x={x} y={50} width={128} height={160} rx={14} fill={["#3a3f48", "#4c525d", "#353a43"][k]} />
            <circle cx={x + 64} cy={118} r={26} fill={k === 1 ? ACENTO : "#6a707b"} />
            <path d={`M${x + 56},${104} l20,14 l-20,14 Z`} fill="#f4efe6" />
            <rect x={x + 16} y={172} width={96} height={10} rx={5} fill="#6a707b" />
          </g>
        </g>
      );
    })}</g>
  );
};
// contraplano: el cuarto espejado, más cerca; en el «doesn't remember» suelta el tel de una mano y se rasca la cabeza
export const P07Vacio: React.FC = () => (
  <>
    <Espejo>
      <Cto cl={[mira(0, 1090, 700, 3.0), mira(58, 1090, 705, 3.15)]}
        leo={{ poses: [...scroll(CAMA, 0, 26, 12, 10), { f: 30, v: { ...CAMA, hI: 150, cI: 125, cabeza: 6, tronco: -12 } }, { f: 40, v: { ...CAMA, hI: 156, cI: 105, cabeza: 2, tronco: -12 } }, { f: 48, v: { ...CAMA, hI: 150, cI: 128, cabeza: 4, tronco: -12 } }],
          caras: [{ f: 0, v: "cansado" }, { f: 26, v: "duda" }], miradas: [{ f: 0, v: { x: 0.4, y: 0.8 } }, { f: 24, v: { x: 0.6, y: -0.7 } }] }} />
    </Espejo>
    <Hud />
    <Pensamiento x={470} y={300} w={520} h={270} desde={4} cola={{ x: 880, y: 470 }}><Miniaturas /></Pensamiento>
  </>
);
// ---------- 8 · el pulgar ----------
const vistos = Array.from({ length: 10 }).map((_, i) => ({ f: i * 4, v: 312 + i * 3, d: 4 }));
export const P08Pulgar: React.FC = () => {
  const f = useF();
  return (
    <Fondo>
      <TelGrande modo="feed" vel={20 + f * 0.6} pulgar y={520} s={0.92} inclina={-3} />
      <Contador lineas={[{ etiqueta: "VIDEOS TODAY", claves: vistos, color: ACENTO }]} x={110} y={480} tam={52} alinear="der" />
      <Hud />
    </Fondo>
  );
};
// ---------- 9 · la pantalla brilla: contraplano desde el tel (su dorso en primer término), la cara lavada por la luz que cambia con cada video ----------
const FEED = ["#ff6a2b", "#5aa0ff", "#ff5fae", "#ffd27a", "#7be0c0"];
export const P09Brillo: React.FC = () => {
  const f = useF();
  const i = Math.floor(f / 11), t = Math.min(1, (f % 11) / 4);
  const c0 = FEED[(i + FEED.length - 1) % FEED.length], c1 = FEED[i % FEED.length];
  return (
    <>
      <Cto cl={[mira(0, 1066, 770, 3.7), mira(46, 1066, 772, 3.8)]}
        leo={{ caras: [{ f: 0, v: "cansado" }], miradas: [{ f: 0, v: { x: 0.15, y: 0.55 } }], luz: { lado: 1, color: c1, fuerza: 1.2 }, poses: scroll(CAMA, 0, 47, 12, 6) }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 52% 105%, ${c0}${Math.round(150 * (1 - t)).toString(16).padStart(2, "0")}, transparent 60%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 52% 105%, ${c1}${Math.round(150 * t).toString(16).padStart(2, "0")}, transparent 60%)` }} />
      {/* el dorso del tel, desenfocado, en primer término */}
      <div style={{ position: "absolute", left: 1180, top: 610, width: 380, height: 640, borderRadius: 60, background: "#0e0f12", transform: "rotate(-9deg)", filter: "blur(3px)", boxShadow: `0 0 70px ${c1}88` }}>
        <div style={{ position: "absolute", left: 34, top: 34, width: 120, height: 120, borderRadius: 34, background: "#1b1d22" }} />
        <div style={{ position: "absolute", left: 52, top: 52, width: 40, height: 40, borderRadius: 20, background: "#2c3038" }} />
      </div>
      <Hud />
    </>
  );
};
// ---------- 10 · algo sonríe detrás del hombro ----------
export const P10Sombra: React.FC = () => (
  <Cto cl={[mira(0, LX + 20, 700, 2.8), mira(80, LX - 20, 520, 1.4, { curva: "inout" })]}
    leo={{ poses: scroll(CAMA, 0, 40, 16, 10), miradas: [{ f: 0, v: { x: 0.4, y: 0.8 } }, { f: 36, v: { x: -0.9, y: -0.3 } }, { f: 70, v: { x: 0.4, y: 0.8 } }], caras: [{ f: 0, v: "cansado" }, { f: 36, v: "duda" }, { f: 74, v: "cansado" }] }}
    detras={maraCuarto(ESC * 1.45, CTO_PUNTOS.colchon - 130, { opacidad: fade(10, 60), caras: [{ f: 0, v: "neutral" }, { f: 66, v: "picaro" }] })} hud={<Hud />} />
);
// ---------- 11 · «just one more»: se inclina al oído ----------
export const P11UnaMas: React.FC = () => (
  <Cto cl={[mira(0, 870, 590, 1.6), mira(40, 885, 600, 1.7)]}
    leo={{ poses: scroll(CAMA, 0, 41, 10, 12), miradas: [{ f: 0, v: { x: 0.4, y: 0.8 } }, { f: 16, v: { x: -0.7, y: -0.4 } }, { f: 30, v: { x: 0.4, y: 0.8 } }], caras: [{ f: 0, v: "cansado" }, { f: 18, v: "duda" }, { f: 30, v: "feliz" }] }}
    detras={maraCuarto(ESC * 1.65, LX - 330, { dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "picaro" }], habla: [[2, 34]], poses: [{ f: 0, v: { tronco: 30, cabeza: 10, hD: 70, cD: 60, hI: -40, cI: -30 } }, { f: 12, v: { tronco: 50, cabeza: 20, hD: 40, cD: 110, hI: -20, cI: -40 } }] })}
    hud={<><Hud /><ManoMara texto="just one more" x={1400} y={280} desde={1} tam={84} vel={2.4} /></>} />
);
// ---------- 12-13 · el recuerdo: Leo de 14 abre su primer tel; de la luz sale Mara chiquita y se le sube al hombro ----------
const KX = 1350, KESC = ESC * 0.6;
const KidLeo: React.FC<{ abre?: (f: number) => number; tel?: (f: number) => boolean; o?: Record<string, unknown> }> = ({ abre = () => 1, tel = () => true, o = {} }) => (
  <Actor look={LEO} escala={KESC} seed={1} luz={rimTel} ruta={[{ f: 0, x: KX, y: CP }]} dir={[{ f: 0, v: 1 }]}
    enManoD={(f: number) => (tel(f) ? <TelMano s={1.3} /> : <CajaRegalo abre={abre(f)} s={1.2} />)}
    poses={[{ f: 0, v: { hD: 40, cD: 70, hI: 30, cI: 80, cabeza: 14 } }]} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.5, y: 0.7 } }]} {...o} />
);
// guirnalda de cumpleaños en la pared (mundo): una letra por banderín
const Guirnalda: React.FC<{ x: number; y: number; texto: string }> = ({ x, y, texto }) => {
  const n = texto.length, paso = 74;
  const x0 = x - ((n - 1) * paso) / 2;
  return (
    <g>
      <path d={`M${x0 - 60},${y - 10} Q${x},${y + 50} ${x0 + (n - 1) * paso + 60},${y - 10}`} stroke="#d8d2c4" strokeWidth={4} fill="none" />
      {texto.split("").map((c, i) => {
        const bx = x0 + i * paso, by = y + 30 * (1 - Math.pow((i - (n - 1) / 2) / ((n - 1) / 2 + 0.6), 2)) - 6;
        return c === " " ? null : (
          <g key={i} transform={`translate(${bx},${by})`}>
            <path d="M-30,0 L30,0 L0,62 Z" fill={["#e2483a", "#f1d36b", "#5aa0ff", "#7be0c0"][i % 4]} />
            <text x={0} y={30} textAnchor="middle" fontSize={30} fontWeight={800} fill="#221c18">{c}</text>
          </g>
        );
      })}
    </g>
  );
};
const MaraChica: React.FC<{ ruta: { f: number; x: number; y: number }[]; o?: Record<string, unknown> }> = ({ ruta, o = {} }) => (
  <Actor look={MARA} escala={ESC * 0.44} seed={5} ruta={ruta} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 60, cD: 90, tronco: 20, cabeza: 16 } }]} caras={[{ f: 0, v: "picaro" }]} {...o} />
);
export const P12Catorce: React.FC = () => (
  <>
    <Cto cl={[mira(0, KX - 20, 640, 1.75), mira(36, KX, 650, 1.85), mira(37, KX + 20, 750, 3.0), mira(93, KX + 25, 745, 3.15)]} pal={PAL_DIA} sp={{ nieve: false }} leo={false}
      medio={<>
        <Guirnalda x={KX} y={CP - 470} texto="HAPPY 14" />
        <KidLeo abre={(f) => lerp(f, 14, 26, 0, 1)} tel={(f) => f >= 34} o={{ caras: [{ f: 0, v: "feliz" }, { f: 20, v: "sorpresa" }, { f: 40, v: "risa" }], poses: [{ f: 0, v: { hD: 40, cD: 70, hI: 30, cI: 80, cabeza: 14 } }, { f: 20, v: { hD: 30, cD: 60, hI: 60, cI: 30, cabeza: 4, tronco: -6 } }, { f: 26, v: { hD: 40, cD: 70, hI: 150, cI: 30, cabeza: -6, tronco: -6, bajar: -14 } }, { f: 36, v: { hD: 40, cD: 110, hI: 30, cI: 80, cabeza: 16 } }] }} />
        <MaraChica ruta={[{ f: 0, x: KX + 40, y: 790 }, { f: 46, x: KX + 40, y: 790 }, { f: 80, x: KX - 70, y: 800 }]} o={{ opacidad: fade(44, 58, 0.95) }} />
      </>} />
    <AbsoluteFill style={{ background: "#b9bec6", opacity: 0.14 }} />
    <Calendario texto="2014 · AGE 14" x={1500} y={70} desde={4} acento={ACENTO} />
  </>
);
export const P13NoGrita: React.FC = () => (
  <>
    <Cto cl={[mira(0, KX - 60, 760, 3.0), mira(95, KX - 60, 755, 3.15)]} pal={PAL_DIA} sp={{ nieve: false }} leo={false}
      medio={<>
        <KidLeo o={{ caras: [{ f: 0, v: "feliz" }, { f: 50, v: "neutral" }], miradas: [{ f: 0, v: { x: 0.5, y: 0.7 } }, { f: 30, v: { x: -0.6, y: -0.2 } }, { f: 50, v: { x: 0.5, y: 0.7 } }],
          poses: [...scroll({ hD: 40, cD: 110, hI: 30, cI: 80, cabeza: 18, tronco: 4 }, 0, 28, 18, 10), { f: 32, v: { hD: 40, cD: 110, hI: 30, cI: 80, cabeza: -8, tronco: -4 } }, { f: 52, v: { hD: 40, cD: 110, hI: 30, cI: 80, cabeza: 20, tronco: 6 } }] }} />
        <MaraChica ruta={[{ f: 0, x: KX - 120, y: 885 }, { f: 22, x: KX - 80, y: 872 }]} o={{ habla: [[8, 30], [52, 72]], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { hD: 120, cD: 140, tronco: 30, cabeza: 22 } }, { f: 24, v: { hD: 130, cD: 150, tronco: 40, cabeza: 26 } }] }} />
      </>} />
    <AbsoluteFill style={{ background: "#b9bec6", opacity: 0.14 }} />
    <PanelSusurro x={1350} y={230} desde={6} tachar={26} />
  </>
);
// ---------- 14 · «you deserve it» · «nobody will know»: la sombra lo envuelve y él se hunde ----------
export const P14Merece: React.FC = () => (
  <>
    <Cto cl={[mira(0, 1000, 640, 1.75), mira(98, 1010, 655, 1.9)]}
      leo={{ poses: scroll(CAMA, 0, 60, 18, 10).concat([{ f: 66, v: { ...CAMA, tronco: -30, cabeza: 32 } }, { f: 98, v: { ...CAMA, tronco: -32, cabeza: 34 } }]), caras: [{ f: 0, v: "cansado" }, { f: 40, v: "duda" }, { f: 70, v: "feliz" }], miradas: [{ f: 0, v: { x: 0.4, y: 0.8 } }, { f: 38, v: { x: -0.6, y: -0.3 } }, { f: 66, v: { x: 0.5, y: 0.9 } }] }}
      detras={maraCuarto(ESC * 1.3, LX - 220, { dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "picaro" }, { f: 60, v: "risa" }], habla: [[0, 14], [36, 56], [66, 96]],
        ruta: [{ f: 0, x: LX - 260, y: CP }, { f: 60, x: LX - 190, y: CP }],
        poses: [{ f: 0, v: { tronco: 24, cabeza: 14, hD: 80, cD: 40, hI: -40, cI: -40 } }, { f: 40, v: { tronco: 38, cabeza: 20, hD: 70, cD: 70, hI: 60, cI: 50 } }, { f: 80, v: { tronco: 46, cabeza: 24, hD: 60, cD: 100, hI: 70, cI: 90 } }] })} />
    <Hud />
    <TextoPlaca texto="just one more" x={1250} y={140} desde={0} hasta={40} />
    <TextoPlaca texto="you deserve it" x={1220} y={300} desde={36} />
    <TextoPlaca texto="nobody will know" x={1330} y={450} desde={64} tam={70} vel={1.8} />
  </>
);
// ---------- 15 · 3:20, el cuarto queda muy callado: deja el tel, mira el cuarto, se para y va por el bolso ----------
const TelColchon: React.FC<{ desde: number }> = ({ desde }) => { const f = useF(); return f >= desde ? <TelMesa x={1150} y={846} /> : null; };
// general del cuarto entero (nuevo encuadre): el cuarto en silencio; deja el tel, se para, agarra el bolso y mira la puerta
export const P15Silencio: React.FC = () => (
  <Cto cl={[mira(0, 1560, 600, 1.05), mira(70, 1540, 610, 1.1), mira(123, 1440, 640, 1.4, { curva: "inout" })]}
    leo={{ asiento: [{ f: 0, v: COLCHON_ALTO }, { f: 70, v: COLCHON_ALTO }, { f: 84, v: undefined }], ruta: [{ f: 0, x: LX, y: CP }, { f: 74, x: LX + 30, y: CP }, { f: 104, x: 1560, y: CP }],
      enManoD: (f: number) => (f < 28 ? <Tel s={1.3} /> : null), enManoI: (f: number) => (f >= 108 ? <BolsoRopa /> : null),
      poses: [{ f: 0, v: CAMA }, { f: 24, v: { ...CAMA, hD: 10, cD: 30, tronco: -10 } }, { f: 40, v: { ...CAMA, hD: 10, cD: 20, hI: 10, cI: 20, cabeza: -4, tronco: -6 } }, { f: 60, v: { ...SENTADO, tronco: 18, hD: 30, cD: 20, hI: 20, cI: 20 } }, { f: 86, v: "parado" }, { f: 104, v: "agacharse" }, { f: 112, v: "parado" }],
      dir: [{ f: 0, v: 1 }, { f: 114, v: -1 }],
      caras: [{ f: 0, v: "cansado" }, { f: 34, v: "duda" }, { f: 80, v: "cansado" }], miradas: [{ f: 0, v: { x: 0.4, y: 0.8 } }, { f: 34, v: { x: -0.8, y: -0.2 } }, { f: 50, v: { x: 0.9, y: -0.2 } }, { f: 66, v: { x: 0.9, y: 0 } }, { f: 114, v: { x: 0.9, y: 0 } }] }}
    medio={<TelColchon desde={28} />}
    hud={<><Hud /><RelojDia min={200} x={1560} y={70} desde={4} tam={56} /></>} />
);
// ---------- 16 · cuatro cuadras por Wilson, con el bolso: vaho, nieve, el contador de cuadras ----------
const x16 = (f: number) => interpolate(f, [0, 117], [3300, 4200], { ...cl, easing: Easing.inOut(Easing.cubic) });
export const P16Wilson: React.FC = () => (
  <Escena Set={Broadway} pal={PAL} claves={[mira(0, 3600, 690, 1.4), mira(117, 3880, 690, 1.45, { curva: "inout" })]} setProps={{ nieve: true }}
    medio={<>
      <Actor look={LEO_CAPUCHA} escala={ESC} seed={1} luz={rimFrio} ruta={[{ f: 0, x: 3300, y: 900 }, { f: 117, x: 4200, y: 900, curva: "inout" }]}
        caras={[{ f: 0, v: "cansado" }, { f: 70, v: "duda" }, { f: 90, v: "cansado" }]} enManoI={<BolsoRopa />} miradas={[{ f: 0, v: { x: 0.6, y: 0.5 } }, { f: 66, v: { x: 0.9, y: -0.6 } }, { f: 90, v: { x: 0.6, y: 0.5 } }]}
        poses={[{ f: 0, v: { hI: 10, cI: 10, cabeza: 12, tronco: 8 } }, { f: 8, v: { hI: 10, cI: 10, hD: 150, cD: 120, cabeza: 4, tronco: 6 } }, { f: 30, v: { hI: 10, cI: 10, hD: 140, cD: 135, cabeza: 14, tronco: 10 } }, { f: 40, v: { hI: 10, cI: 10, hD: 30, cD: 120, cabeza: 14, tronco: 10 } }, { f: 66, v: { hI: 10, cI: 10, hD: 35, cD: 120, cabeza: -10, tronco: 2 } }, { f: 90, v: { hI: 10, cI: 10, hD: 35, cD: 120, cabeza: 16, tronco: 12 } }]} />
      <Vaho x={(f) => x16(f) + 40} y={() => 670} dir={1} p={30} desde={6} />
    </>}
    hud={<><Hud /><Contador lineas={[{ etiqueta: "WILSON AVE · BLOCK", claves: [{ f: 0, v: 1 }, { f: 30, v: 2, d: 6 }, { f: 60, v: 3, d: 6 }, { f: 92, v: 4, d: 6 }], color: "#9fd0ff" }]} x={110} y={960} tam={46} alinear="der" /></>} />
);
// ---------- 17 · el único lugar de Uptown que nunca cierra: se frena, mira el cartel, empuja la puerta ----------
export const P17NuncaCierra: React.FC = () => (
  <Escena Set={Broadway} pal={PAL} claves={[mira(0, 850, 650, 1.6), mira(97, 700, 660, 1.85, { curva: "inout" })]} setProps={{ nieve: true }}
    medio={<>
      <CartelNeon x={300} y={640} texto="OPEN" desde={-100} tam={46} color={ACENTO} />
      <Actor look={LEO_CAPUCHA} escala={ESC} seed={1} luz={rimFrio} ruta={[{ f: 0, x: 1180, y: 900 }, { f: 52, x: 850, y: 900 }, { f: 74, x: 850, y: 900 }, { f: 97, x: 790, y: 900 }]}
        caras={[{ f: 0, v: "cansado" }, { f: 56, v: "neutral" }]} enManoD={<BolsoRopa />} miradas={[{ f: 0, v: { x: -0.9, y: 0 } }, { f: 54, v: { x: -0.4, y: -0.9 } }, { f: 74, v: { x: -0.9, y: 0 } }]}
        poses={[{ f: 0, v: { hD: 10, cD: 10, cabeza: 10 } }, { f: 54, v: { hD: 10, cD: 10, cabeza: -18, tronco: -4 } }, { f: 78, v: "empujar" }, { f: 97, v: { tronco: 26, hD: 85, cD: 10, hI: 80, cI: 15, pI: -28, rI: 4, pD: 22, rD: 25, cabeza: 6 } }]} />
    </>}
    hud={<Hud />} />
);
// ---------- 18 · SPIN CITY se prende letra por letra; pasa la capucha de Leo ----------
export const P18Cartel: React.FC = () => (
  <Escena Set={Broadway} pal={PAL} claves={[mira(0, 450, 520, 2.15), mira(36, 450, 520, 2.3)]} setProps={{ nieve: true }}
    medio={<>
      <CartelNeon x={450} y={478} texto="SPIN CITY" sub="24 HOURS" desde={1} paso={2} tam={58} />
    </>}
    hud={<Hud />} />
);
// ---------- 19 · 24 horas, 40 máquinas, la expendedora rota (le pega) y el tren ----------
const k19 = kDe(47.94);
export const P19Cuarenta: React.FC = () => {
  const f = useF();
  return (
    <Lav cl={[mira(0, 1100, 700, 1.0), mira(85, 1150, 700, 1.03, { curva: "inout" }), mira(86, 2230, 660, 1.5), mira(k19(53.5), 2290, 655, 1.58, { curva: "inout" }), mira(k19(53.5) + 1, 3250, 520, 1.0), mira(252, 3320, 520, 1.06, { curva: "inout" })]}
      tenzo={{ no: true }} sp={{ tren: k19(53.9), farol: false }} toalla={-1}
      leo={{ look: LEO_CAPUCHA, asiento: undefined, ruta: [{ f: 0, x: 120, y: LP }, { f: k19(52.4), x: 2320, y: LP, curva: "inout" }], dir: [{ f: 0, v: 1 }],
        enManoD: () => null, enManoI: <BolsoRopa />,
        poses: [{ f: 0, v: "parado" }, { f: k19(52.5), v: { tronco: 20, hD: 85, cD: 10, hI: 10, cI: 10, pI: -20, pD: 18 } }, { f: k19(52.75), v: "parado" }, { f: k19(52.95), v: { tronco: 22, hD: 90, cD: 5, hI: 10, cI: 10, pI: -20, pD: 18 } }, { f: k19(53.2), v: { hD: 10, cD: 60, hI: 10, cI: 10 } }],
        caras: [{ f: 0, v: "cansado" }, { f: k19(52.45), v: "enojo" }, { f: k19(53.3), v: "cansado" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }] }}
      hud={<><Hud /><Contador x={110} y={130} tam={44} alinear="der" lineas={[
        { etiqueta: "OPEN", claves: "24 H", color: "#9fd0ff" },
        { etiqueta: "MACHINES", claves: [{ f: 0, v: 0 }, { f: k19(49.24), v: 40, d: 30 }], color: "#9fd0ff" },
        ...(f >= k19(50.8) ? [{ etiqueta: "VENDING", claves: "BROKEN", color: ACENTO }] : []),
        ...(f >= k19(53.6) ? [{ etiqueta: "TRAIN", claves: "EVERY 11 MIN", color: "#9fd0ff" }] : []),
      ]} /></>} />
  );
};
// ---------- 20 · esta noche no está solo: se da vuelta y lo frena una luz cálida ----------
export const P20NoSolo: React.FC = () => {
  const f = useF();
  return (
    <Lav cl={[mira(0, 2230, 690, 2.0), mira(56, 2160, 690, 2.12)]} tenzo={{ no: true }} sp={{ farol: false }} toalla={-1}
      leo={{ look: LEO_CAPUCHA, asiento: undefined, ruta: [{ f: 0, x: 2320, y: LP }, { f: 26, x: 2120, y: LP, curva: "out" }, { f: 29, x: 2132, y: LP - 26, curva: "out" }, { f: 34, x: 2140, y: LP, curva: "in" }], dir: [{ f: 0, v: -1 }], enManoD: () => null, enManoI: <BolsoRopa />,
        luz: { lado: -1, color: ORO, fuerza: 1.1 }, miradas: [{ f: 0, v: { x: -0.4, y: 0.8 } }, { f: 27, v: { x: -0.9, y: -0.1 } }],
        poses: [{ f: 0, v: "parado" }, { f: 28, v: { hI: 40, cI: 120, hD: 45, cD: 115, cabeza: 12, tronco: 10, rI: 10, rD: 10, bajar: 6 } }, { f: 36, v: { hD: 10, cD: 20, hI: 10, cI: 10, tronco: -6, cabeza: -6 } }],
        caras: [{ f: 0, v: "cansado" }, { f: 27, v: "sorpresa" }] }}
      frente={<AbsoluteFill style={{ background: `linear-gradient(90deg, ${ORO}${Math.round(lerp(f, 12, 36, 0, 150)).toString(16).padStart(2, "0")}, transparent 38%)` }} />}
      extra={<Halo x={1880} y={640} r={lerp(f, 10, 40, 120, 520)} color={ORO} fuerza={lerp(f, 10, 40, 0, 0.6)} />}
      hud={<Hud />} />
  );
};
// ---------- 21 · el tubo que titila → la cámara baja al rincón y descubre al viejo; cada rasgo con su gesto: túnica, calva (brillo), cejas (las levanta), cuentas (las pasa) ----------
const k21 = kDe(58.26);
const c21 = [mira(0, 1300, -60, 2.2), mira(14, 1305, -52, 2.25), mira(52, 1745, 700, 1.9, { curva: "inout" }), mira(110, 1760, 712, 1.95, { curva: "inout" }), mira(148, 1770, 705, 2.05, { curva: "inout" }), mira(166, 1795, 652, 2.8, { curva: "inout" }), mira(205, 1797, 650, 2.85), mira(226, 1790, 735, 2.7, { curva: "inout" }), mira(247, 1790, 738, 2.75)];
const CUENTAS = (k: number) => ({ ...SENTADO, hI: 60, cI: 30, hD: 30, cD: 128 + (k % 2 ? 16 : 0), tronco: 4, cabeza: 10 });
export const P21Rincon: React.FC = () => {
  const f = useF();
  const brillo = lerp(f, k21(63.3), k21(64.1), 0, 1);
  return (
    <Lav cl={c21} leo={{ no: true }}
      tenzo={{ poses: [...doblando(0, k21(65.2), 44), ...Array.from({ length: 6 }).map((_, i) => ({ f: k21(65.3) + i * 6, v: CUENTAS(i) }))],
        caras: [{ f: 0, v: "neutral" }, { f: k21(64.24), v: "sorpresa" }, { f: k21(64.9), v: "feliz" }], miradas: [{ f: 0, v: { x: -0.3, y: 0.6 } }, { f: k21(61.6), v: { x: -0.7, y: 0.1 } }, { f: k21(65.3), v: { x: -0.2, y: 0.8 } }] }}
      toalla={(fr) => Math.min(1, fr / 247) * 0.4}
      extra={<>
        {brillo > 0 && brillo < 1 && <ellipse cx={1700 + 60 * brillo} cy={640} rx={9} ry={20} fill="#fffaf0" opacity={0.8 * Math.sin(brillo * Math.PI)} transform={`rotate(-35 ${1700 + 60 * brillo} 640)`} />}
        {f >= k21(65.3) && <Halo x={1722} y={770} r={90} color={ORO} fuerza={0.35} />}
      </>}
      hud={<><Hud />
        <LlamadaMundo cl={c21} X={1790} Y={830} dx={300} dy={40} texto="GREY ROBE" desde={k21(62.1)} hasta={k21(63.25)} />
        <LlamadaMundo cl={c21} X={1728} Y={652} dx={-420} dy={-80} texto="BALD HEAD" desde={k21(63.3)} hasta={k21(65.2)} />
        <LlamadaMundo cl={c21} X={1752} Y={640} dx={330} dy={-200} texto="WHITE EYEBROWS" desde={k21(64.24)} hasta={k21(65.25)} />
        <LlamadaMundo cl={c21} X={1722} Y={771} dx={-430} dy={-120} texto="WOODEN BEADS" desde={k21(65.3)} />
      </>} />
  );
};
// ---------- 22 · las cuentas → la mesa → el farol con el loto que se enciende como a media tarde ----------
const k22 = kDe(66.5);
const c22 = [mira(0, 1725, 760, 3.2), mira(k22(67.9), 1700, 745, 3.2), mira(k22(69.1), 1645, 715, 3.6, { curva: "inout" }), mira(k22(70.9), 1641, 700, 5.2, { curva: "inout" }), mira(k22(72.5), 1641, 700, 5.2), mira(k22(74.2), 1560, 690, 1.7, { curva: "inout" }), mira(259, 1560, 690, 1.75)];
export const P22Farol: React.FC = () => {
  const f = useF();
  const tarde = lerp(f, k22(72.5), k22(74), 0, 1);
  return (
    <>
      <Lav cl={c22} leo={{ no: true }} sp={{ luzFarol: 1 + 0.8 * tarde }}
        tenzo={{ poses: [{ f: 0, v: { ...DOBLA_A, hI: 70, cI: 130, hD: 50, cD: 120 } }, { f: 14, v: { ...DOBLA_A, hI: 70, cI: 120, hD: 50, cD: 130 } }, { f: 28, v: { ...DOBLA_A, hI: 70, cI: 130, hD: 50, cD: 120 } }, { f: 42, v: { ...DOBLA_A, hI: 70, cI: 120, hD: 50, cD: 130 } }, ...doblando(60, 260, 44).slice(1)], caras: [{ f: 0, v: "feliz" }] }}
        toalla={0.45} extra={<><Polvo x={1300} y={420} w={700} h={420} n={40} f={f} color="#fff3d6" /><Halo x={1641} y={700} r={300 + 500 * tarde} color={ORO} fuerza={0.15 + 0.35 * tarde} /></>}
        hud={<><Hud />
          <LlamadaMundo cl={c22} X={1641} Y={660} dx={-360} dy={-140} texto="PAPER LANTERN" desde={k22(69.3)} hasta={k22(70.8)} />
          <LlamadaMundo cl={c22} X={1641} Y={703} dx={-380} dy={-220} texto="LOTUS" desde={k22(71.1)} hasta={k22(72.5)} />
        </>} />
      <AbsoluteFill style={{ background: `linear-gradient(160deg, ${ORO}55, transparent 65%)`, opacity: tarde * 0.8 }} />
    </>
  );
};
// ---------- 23 · dobla una toalla, puntas con puntas: cenital de las manos, y después el viejo, contento ----------
export const P23Toalla: React.FC = () => {
  const f = useF();
  if (f < 90) return <><ToallaCenital p={interpolate(f, [6, 40, 48, 86], [0, 0.5, 0.5, 1], cl)} f={f} /><Hud /></>;
  return (
    <Lav cl={[mira(90, 1600, 780, 3.6), mira(140, 1610, 770, 3.6), mira(200, 1650, 740, 3.0, { curva: "inout" }), mira(239, 1652, 736, 3.05)]} leo={{ no: true }}
      tenzo={{ poses: [...doblando(90, 200, 30), { f: 206, v: { ...DOBLA_A, hD: 66, cD: 30, cabeza: -4 } }], caras: [{ f: 0, v: "neutral" }, { f: 196, v: "feliz" }], miradas: [{ f: 0, v: { x: -0.4, y: 0.8 } }, { f: 200, v: { x: -0.6, y: 0.2 } }] }}
      toalla={(fr) => lerp(fr, 90, 200, 0.2, 1)} hud={<Hud />} />
  );
};
// ---------- 24 · se sienta, saca el tel (claro que sí); la sombra aparece; el viejo, sin mirarlo: «you look hungry» ----------
const k24 = kDe(83.08);
export const P24Sienta: React.FC = () => (
  <Lav cl={[mira(0, 1500, 660, 1.2), mira(80, 1450, 670, 1.3), mira(81, 1110, 640, 2.2), mira(140, 1115, 635, 2.35), mira(141, 1730, 720, 2.7), mira(266, 1735, 712, 2.95)]} toalla={0.2}
    leo={{ ruta: [{ f: 0, x: 2100, y: LP }, { f: 52, x: L.leo, y: LP }], dir: [{ f: 0, v: -1 }, { f: 56, v: 1 }], asiento: [{ f: 0, v: undefined }, { f: 62, v: 66 }],
      poses: [{ f: 0, v: "parado" }, { f: 64, v: SENTADO }, { f: 72, v: { ...SENTADO, hD: 20, cD: 40, tronco: 10 } }, { f: 86, v: CEL_SENT }], enManoD: (f: number) => (f > 80 ? <Tel /> : null), enManoI: (f: number) => (f < 58 ? <BolsoRopa /> : null), caras: [{ f: 0, v: "cansado" }, { f: 92, v: "feliz" }] }}
    mara={{ opacidad: fade(k24(85.9), k24(86.8), 0.9) }} extra={<Bolso desde={58} />}
    tenzo={{ poses: doblando(0, 266, 40), habla: [[k24(90.5), k24(91.6)]], caras: [{ f: 0, v: "neutral" }, { f: k24(90.4), v: "feliz" }], miradas: [{ f: 0, v: { x: -0.3, y: 0.7 } }] }} hud={<Hud />} />
);
// ---------- 25 · «I just ate»: plano de dos; levanta el tel como excusa ----------
const k25 = kDe(91.94);
export const P25Comi: React.FC = () => (
  <>
    <Lav cl={[mira(0, 1130, 690, 2.3), mira(70, 1120, 690, 2.42)]} mara={{ opacidad: () => 0.9 }} toalla={-1} extra={<Bolso />} tenzo={{ no: true }}
      leo={{ caras: [{ f: 0, v: "risa" }], habla: [[k25(92.1), k25(92.6)], [k25(92.98), k25(93.7)]], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: 34, v: { x: 0.9, y: 0.2 } }],
        poses: [{ f: 0, v: { ...CEL_SENT, cabeza: 0, tronco: -6 } }, { f: 8, v: { ...CEL_SENT, cabeza: -8, tronco: -16 } }, { f: 18, v: { ...CEL_SENT, cabeza: -2, tronco: -8 } }, { f: 30, v: { ...CEL_SENT, cabeza: 0, hD: 95, cD: 60, tronco: -4 } }] }} hud={<Hud />} />
    <PrimerTermino x={1780} y={640} r={230} quien="tenzo" lado={-1} />
  </>
);
// ---------- 26 · alisa la toalla con la palma; «not that kind of hunger»: se toca el pecho ----------
const k26 = kDe(94.28);
const Hambres: React.FC = () => {
  const f = useF();
  const t = lerp(f, k26(97.6), k26(98.0), 0, 1);
  return (
    <g>
      <g opacity={1 - t * 0.7}>
        <ellipse cx={120} cy={130} rx={70} ry={58} fill="#e9b88a" stroke="#221c18" strokeWidth={5} />
        <path d="M80,120 q40,30 80,0" stroke="#221c18" strokeWidth={5} fill="none" />
        <path d="M60,70 L180,190 M180,70 L60,190" stroke={ACENTO} strokeWidth={10} strokeLinecap="round" opacity={t} />
      </g>
      <g transform={`translate(300,128) scale(${2.4 + 0.2 * Math.sin(f / 5) * t})`} opacity={lerp(f, k26(97.8), k26(98.3), 0, 1)}>
        <path d="M0,14 C-26,-4 -24,-26 -10,-26 C-3,-26 0,-20 0,-16 C0,-20 3,-26 10,-26 C24,-26 26,-4 0,14 Z" fill="none" stroke={ACENTO} strokeWidth={3.5} strokeDasharray="5 3" />
      </g>
    </g>
  );
};
export const P26Hambre: React.FC = () => {
  const f = useF();
  if (f < 84) return <><PalmaToalla hasta={82} /><Hud /></>;
  return (
  <Lav cl={[mira(84, 1700, 700, 3.4), mira(137, 1705, 695, 3.5)]} leo={{ no: true }} toalla={1}
    tenzo={{ poses: [{ f: 0, v: DOBLA_A }, { f: 18, v: { ...DOBLA_A, hD: 62, cD: 28 } }, { f: 30, v: { ...DOBLA_A, hD: 78, cD: 2 } }, { f: 42, v: { ...DOBLA_A, hD: 62, cD: 28 } }, { f: 54, v: { ...DOBLA_A, hD: 78, cD: 2 } }, { f: 66, v: DOBLA_A }, { f: k26(97.1), v: { ...DOBLA_A, hD: 30, cD: 150, cabeza: 4 } }],
      habla: [[k26(97.2), k26(98.8)]], caras: [{ f: 0, v: "neutral" }, { f: k26(97.2), v: "feliz" }], miradas: [{ f: 0, v: { x: -0.3, y: 0.7 } }, { f: k26(97.0), v: { x: -0.9, y: 0 } }] }}
    hud={<><Hud /><Pensamiento x={470} y={300} w={440} h={260} desde={k26(97.3)} cola={{ x: 900, y: 420 }}><Hambres /></Pensamiento></>} />
  );
};
// ---------- 27 · se le va la risa; quiere irse: contraplano desde el viejo, mira el bolso, la sombra le pone la mano ----------
// (98,86 s)
export const P27Deja: React.FC = () => (
  <>
    <Lav cl={[mira(0, 1100, 690, 2.6), mira(122, 1090, 680, 2.7)]} tenzo={{ no: true }} toalla={-1} extra={<Bolso />}
      mara={{ opacidad: () => 0.92, ruta: [{ f: 0, x: L.leo - 170, y: LP - 10 }, { f: 70, x: L.leo - 110, y: LP - 10 }], poses: [{ f: 0, v: { hD: 70, cD: 80, hI: 30, cI: 60, tronco: 16, cabeza: 18 } }, { f: 64, v: { hD: 70, cD: 80, hI: 30, cI: 60, tronco: 16, cabeza: 18 } }, { f: 78, v: { hD: 95, cD: 15, hI: 30, cI: 60, tronco: 30, cabeza: 22 } }], caras: [{ f: 0, v: "picaro" }], habla: [[78, 100]] }}
      leo={{ caras: [{ f: 0, v: "risa" }, { f: 8, v: "neutral" }, { f: 40, v: "duda" }, { f: 100, v: "cansado" }],
        miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: 40, v: { x: -0.6, y: 0.8 } }, { f: 62, v: { x: 0.9, y: -0.1 } }, { f: 100, v: { x: 0.3, y: 0.7 } }],
        asiento: [{ f: 0, v: 66 }, { f: 44, v: 66 }, { f: 58, v: 104 }, { f: 84, v: 104 }, { f: 100, v: 66 }],
        poses: [{ f: 0, v: { ...CEL_SENT, cabeza: 0 } }, { f: 8, v: { ...CEL_SENT, cabeza: 10, tronco: 4 } }, { f: 44, v: { ...SENTADO, tronco: 34, hD: 40, cD: 30, hI: -40, cI: 10, cabeza: -4, pI: 60, pD: 64, rI: 70, rD: 70 } }, { f: 70, v: { ...SENTADO, tronco: 26, hD: 40, cD: 30, hI: -50, cI: 10, pI: 60, pD: 64, rI: 70, rD: 70 } }, { f: 100, v: { ...SENTADO, tronco: 8, hD: 30, cD: 60, cabeza: 14 } }, { f: 110, v: CEL_SENT }] }} hud={<Hud />} />
  </>
);
// ---------- 28 · la secadora: 38 minutos; Leo bufa; el viejo ya empezó a contar ----------
const k28 = kDe(102.96);
const Techos: React.FC = () => (
  <g>
    <rect x={0} y={0} width={440} height={240} fill="#f2d7a8" />
    {[[40, 150, 90], [150, 120, 120], [290, 140, 100]].map(([x, y, w], i) => <g key={i}><rect x={x} y={y} width={w} height={240 - y} fill="#c9853a" /><path d={`M${x - 8},${y} L${x + w / 2},${y - 40} L${x + w + 8},${y} Z`} fill="#a85a2a" /></g>)}
    <path d="M220,100 q30,-60 60,0 Z" fill="#e0a040" />
    <text x={220} y={44} textAnchor="middle" fontSize={30} fontWeight={700} fill="#6a3a1a" letterSpacing={4}>LONG AGO…</text>
  </g>
);
const c28 = [mira(0, 1110, 640, 2.6), mira(70, 1110, 635, 2.75), mira(71, 1390, 670, 1.42), mira(282, 1410, 670, 1.52)];
export const P28Secadora: React.FC = () => {
  const f = useF();
  return (
    <Lav cl={c28} toalla={0.35} extra={<><Bolso /><DisplaySecadora x={1300} y={560} seg={2280 - Math.floor(f / 30)} s={1.1} /></>}
      tenzo={{ poses: [...doblando(0, 70, 44), { f: k28(105.4), v: { ...SENTADO, hD: 45, cD: 70, hI: 20, cI: 40, tronco: 8 } }, { f: k28(107), v: { ...SENTADO, hD: 75, cD: 40, hI: 30, cI: 60, tronco: 10 } }, { f: k28(108.6), v: { ...SENTADO, hD: 50, cD: 80, hI: 40, cI: 70, tronco: 6 } }, { f: k28(110.2), v: { ...SENTADO, hD: 85, cD: 30, hI: 20, cI: 40, tronco: 12 } }],
        habla: [[k28(105.4), k28(112.3)]], caras: [{ f: 0, v: "neutral" }, { f: k28(105.4), v: "feliz" }], miradas: [{ f: 0, v: { x: -0.3, y: 0.7 } }, { f: k28(105.4), v: { x: -0.9, y: 0 } }] }}
      mara={{ opacidad: () => 0.85 }}
      leo={{ miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }, { f: k28(103.3), v: { x: -0.5, y: -0.8 } }, { f: 70, v: { x: 0.3, y: 0.7 } }, { f: k28(106.4), v: { x: 0.9, y: 0 } }],
        poses: [{ f: 0, v: CEL_SENT }, { f: k28(104.4), v: { ...CEL_SENT, tronco: 14, cabeza: 10, hI: 40, cI: 120 } }, { f: k28(105.1), v: { ...CEL_SENT, tronco: -4, cabeza: 26 } }, { f: k28(106.4), v: { ...CEL_SENT, cabeza: 4, tronco: -8 } }],
        caras: [{ f: 0, v: "cansado" }, { f: k28(104.3), v: "duda" }, { f: k28(106), v: "cansado" }] }}
      hud={<><Hud /><Pensamiento x={1560} y={300} w={440} h={240} desde={k28(109.4)} cola={{ x: 1300, y: 470 }}><Techos /></Pensamiento></>} />
  );
};
