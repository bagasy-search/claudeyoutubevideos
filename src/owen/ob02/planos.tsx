// ob02 · «Owen sees everyone's BATTERY» — los planos, tiempos = segundos de la voz (D:/rtmp/owena/ob02_frases.txt)
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Actor } from "../../anikit/actor";
import { Escena } from "../../anikit/escena";
import { Calendario, Contador, Globo, Pildora, F_HUD } from "../../anikit/pantalla";
import { Lata, Taza } from "../../anikit/props";
import { PAL, OWEN, OWEN_CASA, ROSA, TINY, ABERNATHY, LENA, ABRIGO, SCRUBS, OBRERO, NENE, ESTUDIANTE, SENORA, TEEN, OFICINISTA, VERDE } from "../elenco";
import { BusInterior, BUS_PISO, BUS_PUNTOS, ASIENTO_X, Bus9 } from "../mundo/bus";
import { Ashland, ASH_PISO, ASH_CARRIL } from "../mundo/ashland";
import { TwoFlatCorte, TwoFlatFuera, TF_PISO, TF_ARRIBA, TF_PUNTOS } from "../mundo/twoflat";
import { Garaje, GAR_PISO, GAR_PUNTOS, MostradorDespacho } from "../mundo/garaje";
import { MensajeCel, Pizarra } from "../ciencia";
import { Adenosina, Alcohol, BajonTarde, Choques, Combustible, MedioVida, Receptores, SiestaNasa } from "../ciencia2";
import { Etq, HudOwen, Marco, Mano } from "../comun";
import { Bat, BateriaSvg } from "../bateria";
import { EnBus as EnBus0, ESC, kDe, OwenAlVolante, Pas, Pasajero, VasoCafe } from "../ob01/base";
import { ROJO_OWEN } from "../ob01/planos1";
import { Participantes47 } from "../ob03/planos";

const P = TF_PISO, A = TF_ARRIBA;
const PART = "46/47";
const EnBus: React.FC<React.ComponentProps<typeof EnBus0>> = (p) => <EnBus0 part={PART} {...p} />;
const sent = (look: Pas["look"], fila: number, extra: Partial<Pas> = {}): Pas => ({ look, ruta: [{ f: 0, x: ASIENTO_X(fila), y: BUS_PISO }], dir: [{ f: 0, v: -1 }], sentado: 0, poses: [{ f: 0, v: "sentado" }], ...extra });
const parado = (look: Pas["look"], x: number, extra: Partial<Pas> = {}): Pas => ({ look, ruta: [{ f: 0, x, y: BUS_PISO }], dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "agarrarAlto" }], ...extra });
const OX = BUS_PUNTOS.chofer, OY = BUS_PISO - 268; // batería de Owen al volante
const SY = BUS_PISO - 262, PY = BUS_PISO - 335;     // batería de un sentado / un parado
const ROSA_COCINA = TF_PUNTOS.cocina + 90;
const SIT = { pI: 88, rI: 88, pD: 92, rD: 92 };
// se lava la cara, se toca la ojera, bosteza
const LAVA: { f: number; v: string | Record<string, number> }[] = [{ f: 0, v: "agacharse" }, ...Array.from({ length: 6 }).map((_, i) => ({ f: 8 + i * 8, v: i % 2 ? { tronco: 30, hD: 100, cD: 140, hI: 100, cI: 140 } : { tronco: 34, hD: 60, cD: 60, hI: 60, cI: 60 } })),
  { f: 60, v: "parado" }, { f: 90, v: { hD: 60, cD: 150, cabeza: 6 } }, { f: 120, v: "parado" }, { f: 150, v: { tronco: -8, hD: 150, cD: 30, hI: 150, cI: 30, cabeza: -12 } }, { f: 180, v: "parado" }, { f: 210, v: { tronco: -8, hD: 150, cD: 30, hI: 150, cI: 30, cabeza: -12 } }, { f: 236, v: "parado" }];

const Dona: React.FC = () => <g transform="translate(0,-8)"><circle r={24} fill="#c98a4a" /><circle r={18} fill="none" stroke="#ff7ab0" strokeWidth={11} /><circle r={7} fill="#2a2420" /></g>;
const Termo: React.FC = () => <g transform="translate(0,-20)"><rect x={-12} y={-34} width={24} height={60} rx={6} fill="#5a6a7a" /><rect x={-14} y={-42} width={28} height={12} rx={4} fill="#c23a2e" /></g>;
const Banana: React.FC = () => <path d="M-26,-6 q26,26 52,-4 q-26,14 -52,4 Z" fill="#f2d03a" stroke="#8a6a1a" strokeWidth={3} />;
const Bolsa: React.FC = () => <g transform="translate(0,-6)"><path d="M-22,-30 h44 l-4,44 h-36 Z" fill="#c9a06a" /><path d="M-22,-30 l6,-8 h32 l6,8" fill="#b08a54" /></g>;
const BolsaCompras: React.FC = () => <g transform="translate(0,10)"><path d="M-26,-10 h52 l-6,46 h-40 Z" fill="#f4efe4" stroke="#c9c2b2" strokeWidth={3} /><path d="M-14,-10 q14,-24 28,0" fill="none" stroke="#c9c2b2" strokeWidth={4} /><circle cx={-8} cy={-14} r={10} fill="#ff8a2a" /><circle cx={10} cy={-12} r={9} fill="#7ac943" /></g>;

// ---------- 1 · cuadro 0 = la miniatura sin texto: Owen dormitando al volante (1 %), Lena atrás con el café (4 %) ----------
export const P01Mini: React.FC = () => {
  const cl = [mira(0, 470, 660, 2.4), mira(30, 466, 660, 2.46)];
  const lena: Pas = { ...sent(LENA, 1, { seed: 4 }), caras: [{ f: 0, v: "cansado" }], enManoD: <VasoCafe />, poses: [{ f: 0, v: "sentado" }, { f: 6, v: { ...SIT, hD: 150, cD: 150, cabeza: -6 } }, { f: 22, v: "sentado" }] };
  return (
    <EnBus cl={cl} hora="ocaso" part={null} pas={[lena]} owen={{ caras: [{ f: 0, v: "cansado" }, { f: 18, v: "sorpresa" }], giro: (f) => (f < 16 ? f * 0.012 : Math.exp(-(f - 16) / 5) * Math.sin((f - 16) * 1.2) * 0.2), poses: [{ f: 0, v: "sentado" }, { f: 14, v: { ...SIT, tronco: 10, cabeza: 32 } }, { f: 18, v: { ...SIT, tronco: -6, cabeza: -10 } }, { f: 26, v: "sentado" }] }}
      hud={<>
        <Bat cl={cl} x={OX + 10} y={OY - 10} pct={1} tam={2.1} zz alerta />
        <Bat cl={cl} x={ASIENTO_X(1)} y={SY} pct={4} tam={1.6} />
      </>} />
  );
};

// ---------- 2 · la semana pasada: números verdes ----------
export const P02SemanaPasada: React.FC = () => {
  const k = kDe(1.0);
  const cl = [mira(0, (ASIENTO_X(3) + ASIENTO_X(5)) / 2, BUS_PISO - 250, 1.7), mira(k(2.6), (ASIENTO_X(3) + ASIENTO_X(5)) / 2 + 40, BUS_PISO - 250, 1.8)];
  const pas = [sent(ABERNATHY, 3, { n: 58, edad: 72, desde: 0, seed: 2, poses: [{ f: 0, v: "sentado" }, { f: 10, v: { ...SIT, hD: 150, cD: 30 } }, { f: 30, v: "sentado" }], caras: [{ f: 0, v: "feliz" }] }), sent(TEEN, 5, { n: 31, edad: 19, desde: 4, seed: 3, poses: [{ f: 0, v: "celular" }], caras: [{ f: 0, v: "risa" }] })];
  return (
    <AbsoluteFill>
      <EnBus cl={cl} hora="manana" part="47/47" pas={pas} owen={{ caras: [{ f: 0, v: "sorpresa" }] }} />
      <Calendario texto="LAST WEEK" x={760} y={70} desde={-10} tam={84} />
    </AbsoluteFill>
  );
};

// ---------- 3 · 5:12, se despierta ----------
export const P03Despierta: React.FC = () => {
  const k = kDe(2.62);
  const cl = [mira(0, 300, A - 200, 1.9), mira(k(5.5), 260, A - 190, 2.1, { curva: "inout" })];
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={3} setProps={{ hora: "noche", luzCocina: false, luzBaño: false, luzDorm: true, radiador: (ff: number) => ff % 12 < 6 }}
      medio={<Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: TF_PUNTOS.cama + 140, y: A }]} dir={[{ f: 0, v: 1 }]}
        poses={[{ f: 0, v: { tronco: 30, ...SIT, hI: 25, cI: 50, hD: 35, cD: 55 } }, { f: 14, v: { tronco: 22, ...SIT, hD: 95, cD: 5, hI: 25, cI: 50 } }, { f: 24, v: "sentado" }, { f: 34, v: { tronco: -10, ...SIT, hD: 165, cD: 10, hI: 165, cI: 10, cabeza: -14 } }, { f: 58, v: { tronco: -4, ...SIT, hD: 45, cD: 140 } }, { f: 76, v: "sentado" }]}
        asiento={[{ f: 0, v: 110 }]} caras={[{ f: 0, v: "cansado" }, { f: 34, v: "sorpresa" }, { f: 56, v: "cansado" }]} habla={[[34, 54]]} miradas={[{ f: 0, v: { x: 0.6, y: 0.2 } }]} />}
      hud={<><Mano texto="WEEK 2" x={960} y={150} desde={-8} color="#ffd27a" tam={140} /><HudOwen min={312} part={null} /></>} />
  );
};

// ---------- 4 · cocina: el número de Rosa se va y aparece una batería: 91 % ----------
export const P04Rosa: React.FC = () => {
  const f = useF();
  const k = kDe(5.5);
  const cl = [mira(0, 700, P - 270, 1.75), mira(k(9.9), 480, P - 290, 2.0, { curva: "inout" }), mira(k(16.0), 450, P - 300, 2.3, { curva: "inout" })];
  const rev = Array.from({ length: 12 }).map((_, i) => ({ f: i * 18, v: { hD: 55 + (i % 2) * 18, cD: 60 - (i % 2) * 20 } }));
  const sale = k(8.0);
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={4} setProps={{ hora: "alba", luzBaño: false }}
      medio={<>
        <Actor look={ROSA} escala={ESC} seed={5} ruta={[{ f: 0, x: ROSA_COCINA, y: P }]} dir={[{ f: 0, v: -1 }, { f: k(10.6), v: 1 }, { f: k(13.2), v: -1 }]} poses={[...rev.filter((q) => q.f < k(10.6)), { f: k(10.6), v: { hD: 60, cD: 150, cabeza: -6 } }, { f: k(11.6), v: { hD: 40, cD: 70, hI: 30, cI: 40, cabeza: 8 } }, { f: k(13.2), v: "parado" }, ...rev.map((q) => ({ ...q, f: q.f + k(13.4) }))]} caras={[{ f: 0, v: "feliz" }, { f: k(10.6), v: "risa" }, { f: k(13.2), v: "feliz" }]} habla={[[0, 400]]} />
        <Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: 1120, y: P }, { f: 50, x: 820, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "parado" }, { f: 56, v: { hD: 60, cD: 150, cabeza: 6 } }, { f: 90, v: "parado" }, { f: k(12.0), v: "manosCara" }, { f: k(13.4), v: "parado" }, { f: k(14.2), v: "señalar" }, { f: k(15.4), v: "pensar" }]} caras={[{ f: 0, v: "cansado" }, { f: k(8.6), v: "sorpresa" }, { f: k(14.2), v: "duda" }]} miradas={[{ f: 0, v: { x: -1, y: 0 } }]} />
      </>}
      hud={<>
        {f < sale + 10 && <Etq cl={cl} x={ROSA_COCINA} y={P - 300} n={64} desde={-30} hasta={sale + 10} tam={130} />}
        <Bat cl={cl} x={ROSA_COCINA} y={P - 300} pct={[{ f: k(9.9), v: 0 }, { f: k(16.2), v: 91 }]} desde={k(9.9)} />
        <Mano texto="like the one on a phone" x={1300} y={170} desde={k(12.4)} hasta={k(16.0)} color="#ffd27a" tam={80} vel={5} />
        <HudOwen min={313} part={null} />
      </>} />
  );
};

// ---------- 5 · el espejo: batería roja, 38 % ----------
export const P05Espejo: React.FC = () => {
  const k = kDe(17.42);
  const ESP = TF_PUNTOS.espejo;
  const cl = [mira(0, 960, A - 240, 1.8), mira(k(20.0), 1000, A - 300, 2.4, { curva: "inout" })];
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={5} setProps={{ hora: "alba", luzBaño: true }}
      medio={<>
        <defs><clipPath id="esp2"><rect x={ESP - 80} y={A - 410} width={160} height={180} rx={10} /></clipPath></defs>
        <g clipPath="url(#esp2)">
          <rect x={ESP - 80} y={A - 410} width={160} height={180} fill="#cfe0e4" />
          <Actor look={OWEN_CASA} escala={ESC} seed={6} vivo={0} ruta={[{ f: 0, x: ESP + 30, y: A }]} dir={[{ f: 0, v: -1 }]} poses={LAVA.map((q) => ({ ...q, f: q.f + 6 }))} caras={[{ f: 0, v: "cansado" }, { f: k(21.7) + 6, v: "miedo" }]} />
          <rect x={ESP - 80} y={A - 410} width={160} height={180} fill="#aac6cf" opacity={0.22} />
        </g>
        <Actor look={OWEN_CASA} escala={ESC} seed={6} vivo={0} ruta={[{ f: 0, x: ESP - 150, y: A }]} dir={[{ f: 0, v: 1 }]} poses={LAVA} caras={[{ f: 0, v: "cansado" }, { f: k(21.7), v: "miedo" }]} habla={[[150, 172], [210, 230]]} />
      </>}
      hud={<>
        <Bat cl={cl} x={ESP - 150} y={A - 340} pct={38} desde={k(19.8)} tam={1.8} />
        <Pildora texto="5:15 AM · HE HASN'T DONE ANYTHING YET" x={960} y={930} desde={k(22.2)} color="#f4efe4" tam={72} />
        <HudOwen min={315} part={null} />
      </>} />
  );
};

// ---------- 6 · semana 2 de Halden ----------
export const P06Semana: React.FC = () => {
  const k = kDe(26.04);
  return (
    <AbsoluteFill>
      <Pizarra><Participantes47 desde={6} apaga={k(29.5)} owen={k(28.2)} fuera={[19]} /></Pizarra>
      <Mano texto="WEEK 2" x={960} y={170} desde={-10} color="#f4efe4" tam={150} />
      <Pildora texto="PARTICIPANT 47" x={960} y={880} desde={k(28.2)} hasta={k(29.4)} color={ROJO_OWEN} />
      <Pildora texto="ONLY 46 STILL IN THE TRIAL" x={960} y={880} desde={k(29.5)} hasta={k(31.2)} color={VERDE} />
      <Mano texto="every week, one new change" x={960} y={880} desde={k(31.3)} hasta={k(33.4)} color="#ffd27a" tam={80} vel={5} />
      <Mano texto="...on the outside." x={960} y={880} desde={k(34.2)} color={ROJO_OWEN} tam={90} />
      <HudOwen part={PART} />
    </AbsoluteFill>
  );
};

export const P07Combustible: React.FC = () => { const k = kDe(35.86); return <AbsoluteFill><Combustible dHigado={k(40.3)} dMusculo={k(43.9)} dCerebro={k(46.2)} /><HudOwen part={PART} /></AbsoluteFill>; };
export const P08Adenosina: React.FC = () => { const k = kDe(53.04); return <AbsoluteFill><Adenosina llenaHasta={k(61.8)} vaciaDesde={k(61.9)} vaciaHasta={k(63.3)} owenDesde={k(63.3)} /><HudOwen part={PART} /></AbsoluteFill>; };

// ---------- 9 · garaje: Tiny 62 % con la dona → 70 → 60 ----------
export const P09Tiny: React.FC = () => {
  const f = useF();
  const k = kDe(66.2);
  const muerde = [k(72.0), k(73.0), k(74.0)];
  const cl = [mira(0, 640, GAR_PISO - 330, 1.9), mira(k(69.0), 500, GAR_PISO - 340, 2.2, { curva: "inout" })];
  return (
    <Escena Set={Garaje} pal={PAL} claves={cl} seed={9} setProps={{ hora: "alba" }}
      medio={<>
        <Actor look={TINY} escala={ESC * 1.1} seed={7} ruta={[{ f: 0, x: GAR_PUNTOS.ventanilla, y: GAR_PISO }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: { hD: 40, cD: 100 } }, ...muerde.flatMap((m) => [{ f: m - 6, v: { hD: 70, cD: 140 } }, { f: m + 6, v: { hD: 40, cD: 100 } }])]} caras={[{ f: 0, v: "feliz" }, { f: k(75.6), v: "cansado" }]} habla={muerde.map((m) => [m - 4, m + 4] as [number, number])}
          enManoD={(ff: number) => (ff < k(75.0) ? <Dona /> : null)} />
        <MostradorDespacho />
        <Actor look={OWEN} escala={ESC} seed={6} ruta={[{ f: 0, x: 1250, y: GAR_PISO }, { f: k(69.0), x: GAR_PUNTOS.mostrador + 120, y: GAR_PISO }]} caras={[{ f: 0, v: "cansado" }, { f: k(74.4), v: "duda" }, { f: k(77.8), v: "triste" }]} miradas={[{ f: 0, v: { x: -1, y: 0 } }]} poses={[{ f: 0, v: "parado" }, { f: k(74.4), v: "pensar" }, { f: k(77.8), v: { cabeza: 22, tronco: 6 } }]} />
        {f > k(72.0) && f < k(75.0) && Array.from({ length: 5 }).map((_, i) => { const t = (f - k(72.0) - i * 6) / 20; return t > 0 && t < 1 ? <circle key={i} cx={GAR_PUNTOS.ventanilla + 30 + i * 8} cy={GAR_PISO - 190 + t * 190} r={5} fill="#c98a4a" /> : null; })}
      </>}
      hud={<>
        <Bat cl={cl} x={GAR_PUNTOS.ventanilla} y={GAR_PISO - 370} pct={[{ f: k(72.4), v: 62 }, { f: k(73.6), v: 70 }, { f: k(75.6), v: 70 }, { f: k(77.6), v: 60 }]} desde={k(68.5)} />
        <Calendario texto="+10 MIN" desde={k(75.5)} hasta={k(78)} />
        <Mano texto="fast sugar. fast drop." x={1300} y={170} desde={k(77.8)} color="#ffd27a" tam={84} />
        <HudOwen min={340} part={PART} />
      </>} />
  );
};

// ---------- 10 · la ruta 9 por fuera ----------
export const P10Ruta: React.FC = () => {
  const f = useF();
  const bx = (ff: number) => interpolate(ff, [0, 52], [700, 1690], { extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 2.2) });
  const cam = () => 2380;
  const cl = [mira(0, 2250, ASH_PISO - 290, 1.45), mira(52, 2480, ASH_PISO - 300, 1.85, { curva: "inout" })];
  return (
    <Escena Set={Ashland} pal={PAL} claves={cl} seed={10} setProps={{ hora: "alba", centro: cam, paradas: [{ x: 2600, num: 1, refugio: true }] }}
      medio={<>
        {[0, 1, 2].map((i) => <Actor key={i} look={[ESTUDIANTE, OBRERO, SENORA][i]} escala={ESC} seed={70 + i} ruta={[{ f: 0, x: 2470 + i * 170, y: ASH_PISO - 30 }, { f: 54 + i * 6, x: 2470 + i * 170, y: ASH_PISO - 30 }, { f: 84 + i * 10, x: 2440 + i * 20, y: ASH_PISO - 30 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "celular" }, { f: 14 + i * 8, v: "saludar" }, { f: 44 + i * 8, v: "parado" }]} caras={[{ f: 0, v: "cansado" }, { f: 14 + i * 8, v: "feliz" }]} />)}
        <Bus9 x={bx(f)} y={ASH_CARRIL} esc={0.8} dir={1} hora="alba" rueda={bx(f) / 3} kneel={f > 54 ? Math.min(14, (f - 54) * 1.5) : 0} puertas={f > 58 ? Math.min(1, (f - 58) / 10) : 0} />
      </>}
      hud={<><Pildora texto="ROUTE 9 · ASHLAND AVENUE · FIRST STOP" x={960} y={190} desde={0} color="#ffb02e" tam={68} /><HudOwen min={345} part={PART} /></>} />
  );
};

// ---------- 11 · un muro de baterías: chicos 80-90, cuadrilla 70 con termos ----------
export const P11Muro: React.FC = () => {
  const k = kDe(81.56);
  const cl = [mira(0, 1000, 650, 1.6), mira(k(84.2), 1050, 650, 1.7, { curva: "inout" }), mira(k(87.4), 1900, 650, 1.7, { curva: "inout" })];
  const pas: Pas[] = [
    sent(NENE, 1, { seed: 21, caras: [{ f: 0, v: "feliz" }, { f: 40, v: "risa" }], habla: [[30, 70], [120, 160]], poses: [{ f: 0, v: "sentado" }, { f: 30, v: { ...SIT, hD: 150, cD: 20, hI: 150, cI: 20, tronco: -6 } }, { f: 70, v: "sentado" }] }),
    sent(ESTUDIANTE, 2, { seed: 22, caras: [{ f: 0, v: "risa" }], habla: [[10, 50], [90, 140]], poses: [{ f: 0, v: "sentado" }, { f: 40, v: { ...SIT, tronco: 14, hD: 30, cD: 120, hI: 30, cI: 120 } }, { f: 90, v: "sentado" }] }),
    parado(NENE, 1240, { seed: 23, caras: [{ f: 0, v: "feliz" }], poses: [{ f: 0, v: "agarrarAlto" }, { f: 60, v: "celebrar" }, { f: 100, v: "agarrarAlto" }] }),
    parado(OBRERO, 1840, { seed: 24, enManoD: <Termo />, poses: [{ f: 0, v: "agarrarAlto" }, { f: k(89.0), v: { hD: 150, cD: 150, cabeza: -10 } }, { f: k(90.2), v: "agarrarAlto" }] }),
    parado(OBRERO, 2040, { seed: 25, enManoD: <Termo />, caras: [{ f: 0, v: "cansado" }], poses: [{ f: 0, v: "agarrarAlto" }, { f: k(89.6), v: { hD: 150, cD: 150, cabeza: -10 } }, { f: k(90.8), v: "agarrarAlto" }] }),
    sent(OBRERO, 8, { seed: 26, enManoD: <Termo />, habla: [[k(88.0), k(89.4)]] }),
  ];
  return (
    <EnBus cl={cl} hora="manana" min={362} avance={(f) => 1000 + f * 12} pas={pas} owen={{ caras: [{ f: 0, v: "sorpresa" }] }}
      hud={<>
        <Bat cl={cl} x={ASIENTO_X(1)} y={SY + 40} pct={92} desde={k(84.3)} tam={1.25} />
        <Bat cl={cl} x={ASIENTO_X(2)} y={SY} pct={86} desde={k(84.7)} tam={1.25} />
        <Bat cl={cl} x={1240} y={PY + 70} pct={95} desde={k(85.1)} tam={1.25} />
        <Bat cl={cl} x={1840} y={PY} pct={74} desde={k(89.6)} tam={1.25} />
        <Bat cl={cl} x={2040} y={PY} pct={71} desde={k(90.0)} tam={1.25} />
        <Bat cl={cl} x={ASIENTO_X(8)} y={SY} pct={77} desde={k(90.4)} tam={1.25} />
        <Pildora texto="47TH STREET" x={960} y={950} desde={k(87.4)} color="#f4efe4" tam={70} />
        <HudOwen part={PART} />
      </>} />
  );
};

// ---------- 12 · la enfermera del turno noche: 12 %, se duerme ----------
export const P12Scrubs: React.FC = () => {
  const k = kDe(91.9);
  const cl = [mira(0, 760, 640, 1.65), mira(k(95.2), 720, 630, 1.9, { curva: "inout" })];
  const sc: Pas = { look: SCRUBS, seed: 11, aparece: 0, ruta: [{ f: 0, x: BUS_PUNTOS.validador + 60, y: BUS_PISO }, { f: k(94.0), x: ASIENTO_X(1), y: BUS_PISO }], dir: [{ f: 0, v: 1 }, { f: k(94.0), v: -1 }], sentado: k(94.2), caras: [{ f: 0, v: "cansado" }, { f: k(96.2), v: "zombi" }], poses: [{ f: 0, v: "parado" }, { f: k(96.4), v: { tronco: 14, cabeza: 24, pI: 88, rI: 88, pD: 92, rD: 92, hI: 25, cI: 50, hD: 35, cD: 55 } }] };
  return (
    <EnBus cl={cl} hora="manana" min={366} avance={(f) => 3000 + f * 10} pas={[sc]} owen={{ caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: 1, y: 0 } }], giros: [{ f: 0, v: 0.4 }] }}
      hud={<>
        <Bat cl={cl} x={ASIENTO_X(1)} y={SY + 20} pct={12} desde={k(95.4)} zz={false} tam={1.3} />
        <Bat cl={cl} x={ASIENTO_X(1) + 60} y={SY - 80} pct={12} desde={k(96.1)} hasta={k(96.1)} />
        <Pildora texto="OFF A NIGHT SHIFT" x={960} y={950} desde={k(92.6)} hasta={k(96.0)} color="#f4efe4" tam={70} />
        <Mano texto="asleep before the next stop" x={1200} y={170} desde={k(96.3)} color="#f4efe4" tam={80} />
        <HudOwen min={367} part={PART} />
      </>} />
  );
};

// ---------- 13 · la primera bebida energizante: 38 → 55 ----------
export const P13Lata: React.FC = () => {
  const k = kDe(98.52);
  const abre = k(101.6);
  const cl = [mira(0, 380, BUS_PISO - 260, 2.0), mira(k(102.7), 300, BUS_PISO - 300, 2.6, { curva: "inout" })];
  return (
    <EnBus cl={cl} hora="manana" min={370} avance={(f) => 5000 + f * 8} owen={{ manos: "I", caras: [{ f: 0, v: "cansado" }, { f: abre + 26, v: "sorpresa" }, { f: abre + 50, v: "feliz" }], poses: [{ f: 0, v: "sentado" }, { f: abre - 14, v: { hD: 70, cD: 70 } }, { f: abre + 6, v: { hD: 150, cD: 155, cabeza: -14 } }, { f: abre + 26, v: { hD: 70, cD: 70, tronco: -6 } }, { f: abre + 60, v: "sentado" }], giro: (f) => (f > abre + 22 && f < abre + 36 ? Math.sin((f - abre - 22) * 1.4) * 0.15 : 0), enManoD: <Lata color="#2fd16a" /> }}
      hud={<>
        <Bat cl={cl} x={OX} y={OY} pct={38} capa={[{ f: k(102.7), v: 0 }, { f: k(104.6), v: 17 }]} desde={0} tam={1.1} />
        <Mano texto="pssht!" x={760} y={420} desde={abre} hasta={abre + 30} color="#2fd16a" tam={80} />
              </>} />
  );
};

// ---------- 14 · la capa fina: parece llena, abajo sigue el rojo ----------
export const P14Capa: React.FC = () => {
  const f = useF();
  const k = kDe(104.86);
  const zoom = interpolate(f, [0, k(110.6)], [2.2, 3.4], { extrapolateRight: "clamp" });
  const corte = interpolate(f, [k(110.6), k(112.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Pizarra titulo="WHAT OWEN SEES"><g /></Pizarra>
      <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) scale(${zoom})` }}>
        <BateriaSvg pct={38} capa={interpolate(f, [12, 80], [0, 17], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} f={f} />
      </div>
      {f > 4 && f < 90 && <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}><g transform={`translate(1080,${300 - Math.min(1, f / 10) * 40}) rotate(${-40 - Math.min(1, f / 14) * 60})`}><rect x={-34} y={-70} width={68} height={140} rx={14} fill="#2fd16a" /><rect x={-34} y={-70} width={68} height={22} fill="#1a8a44" /></g>{Array.from({ length: 8 }).map((_, i) => { const t = ((f + i * 5) % 20) / 20; return <circle key={i} cx={1010 - t * 20} cy={300 + t * 160} r={9} fill="#ffe04a" opacity={1 - t} />; })}</svg>}
      <Mano texto="it just LOOKS full" x={700} y={860} desde={k(108.0)} hasta={k(110.5)} color="#fff6c8" tam={88} />
      {corte > 0 && <Mano texto="underneath: the same red" x={700} y={860} desde={k(110.6)} color={ROJO_OWEN} tam={88} />}
      <HudOwen part={PART} />
    </AbsoluteFill>
  );
};

export const P15Receptores: React.FC = () => { const k = kDe(114.11); return <AbsoluteFill><Receptores tapaDesde={k(117.4)} /><HudOwen part={PART} /></AbsoluteFill>; };
export const P16MedioVida: React.FC = () => { const k = kDe(123.14); return <AbsoluteFill><MedioVida d50={k(127.8)} d25={k(130.6)} /><HudOwen part={PART} /></AbsoluteFill>; };

// ---------- 17 · Abernathy: 72 años, 88 %, banana y huevo, a la cama a las 9 ----------
export const P17Abernathy: React.FC = () => {
  const k = kDe(132.57);
  const ab: Pas = { look: ABERNATHY, seed: 2, aparece: 0, ruta: [{ f: 0, x: BUS_PUNTOS.puertaF + 40, y: BUS_PISO }, { f: k(135.5), x: BUS_PUNTOS.validador + 40, y: BUS_PISO }, { f: k(137.5), x: ASIENTO_X(3), y: BUS_PISO }], dir: [{ f: 0, v: 1 }, { f: k(137.5), v: -1 }], sentado: k(137.7), caras: [{ f: 0, v: "feliz" }], enManoD: <Banana />, enManoI: <Bolsa />, habla: [[k(142.9), k(146.6)]], poses: [{ f: 0, v: "parado" }, { f: k(134.0), v: "saludar" }, { f: k(135.2), v: "parado" }, { f: k(137.7), v: "sentado" }, { f: k(139.5), v: { ...SIT, hD: 60, cD: 130 } }, { f: k(141.0), v: "sentado" }, { f: k(142.9), v: { ...SIT, hD: 120, cD: 60 } }, { f: k(144.4), v: { ...SIT, hD: 90, cD: 20 } }, { f: k(146.0), v: "sentado" }] };
  const cl = [mira(0, 640, 650, 1.5), mira(k(136.0), 860, 650, 1.6, { curva: "inout" }), mira(k(142.8), 760, 640, 1.45, { curva: "inout" })];
  return (
    <EnBus cl={cl} hora="manana" min={380} avance={() => 6000} puertaF={() => 1} paradas={[{ a: 6000, num: 4 }]} pas={[ab]} owen={{ caras: [{ f: 0, v: "feliz" }, { f: k(142.9), v: "risa" }], giros: [{ f: 0, v: 0.6 }], miradas: [{ f: 0, v: { x: 1, y: 0 } }], habla: [[k(134.0), k(135.4)]], manos: "I", poses: [{ f: 0, v: "sentado" }, { f: k(134.0), v: { hD: 150, cD: 30 } }, { f: k(135.4), v: "sentado" }] }}
      hud={<>
        <Etq cl={cl} x={(ff) => (ff < k(137.5) ? interpolate(ff, [0, k(135.5), k(137.5)], [BUS_PUNTOS.puertaF + 40, BUS_PUNTOS.validador + 40, ASIENTO_X(3)], { extrapolateRight: "clamp" }) : ASIENTO_X(3))} y={-9999} n={0} desde={1e9} />
        <Bat cl={cl} x={ASIENTO_X(3)} y={SY} pct={88} desde={k(136.4)} />
        <Pildora texto="STOP 4 · MR. ABERNATHY · 72" x={960} y={950} desde={k(133.6)} hasta={k(141)} color="#f4efe4" tam={66} />
        <Pildora texto="IN BED BY 9 PM. EVERY NIGHT." x={960} y={950} desde={k(141.1)} color="#ffd27a" tam={70} />
        <Globo texto="Coffee after noon is for people who don't want to sleep." x={1100} y={250} desde={k(142.9)} hasta={k(146.7)} cola="abajo" tam={72} />
        <HudOwen min={382} part={PART} />
      </>} />
  );
};

// ---------- 18 · Café 18: Lena al 4 %, seis bebidas a la vez ----------
const CAFE = 1700;
const CafeEsc: React.FC<{ tazas?: number; cl: ReturnType<typeof mira>[]; t0: number; children?: React.ReactNode; hud?: React.ReactNode; owenRuta?: { f: number; x: number; y: number }[]; lenaCaras?: { f: number; v: string }[]; lenaHabla?: [number, number][]; owenHabla?: [number, number][]; owenPoses?: { f: number; v: string | Record<string, number> }[] }> = ({ tazas, cl, children, hud, owenRuta, lenaCaras, lenaHabla, owenHabla, owenPoses }) => {
  const f = useF();
  const LX = CAFE + 640;
  // Lena no para: va de la máquina a la caja y vuelve (cada ~3 s), siempre con las manos ocupadas
  const LRUTA = Array.from({ length: 12 }).flatMap((_, i) => [{ f: i * 100 + 60, x: i % 2 ? LX - 180 : LX, y: ASH_PISO - 30 }, { f: i * 100 + 90, x: i % 2 ? LX : LX - 180, y: ASH_PISO - 30 }]);
  LRUTA.unshift({ f: 0, x: LX, y: ASH_PISO - 30 });
  const LDIR = [{ f: 0, v: -1 as 1 | -1 }, ...Array.from({ length: 12 }).map((_, i) => ({ f: i * 100 + 60, v: (i % 2 ? 1 : -1) as 1 | -1 })), ];
  const lx = (ff: number) => { const i = Math.floor((ff - 60) / 100); if (ff < 60) return LX; const t = Math.min(1, Math.max(0, (ff - 60 - i * 100) / 30)); return i % 2 ? LX - 180 + 180 * t : LX - 180 * t; };
  const prep = Array.from({ length: 70 }).map((_, i) => ({ f: i * 14, v: i % 2 ? { hD: 80, cD: 30, hI: 60, cI: 50 } : { hD: 50, cD: 70, hI: 90, cI: 20 } }));
  return (
    <Escena Set={Ashland} pal={PAL} claves={cl} seed={18} setProps={{ hora: "manana", centro: () => 1500, cafe: CAFE, paradas: [{ x: 1000, num: 18, refugio: true }], autos: 2 }}
      medio={<>
        <Actor look={LENA} escala={ESC} seed={4} ruta={LRUTA} dir={LDIR} poses={prep} caras={lenaCaras ?? [{ f: 0, v: "feliz" }]} habla={lenaHabla} />
        {[0, 1, 2, 3, 4, 5].map((i) => { const t0 = tazas === undefined ? -1 : tazas + i * 14; const s = f < t0 ? 0 : Math.min(1, (f - t0) / 6) * (1 + Math.max(0, 1 - (f - t0) / 10) * 0.25); return <g key={i} transform={`translate(${CAFE + 380 + i * 70},${ASH_PISO - 160}) scale(${s})`}><Taza vapor={1} f={f + i * 7} /></g>; })}
        <g><rect x={CAFE + 60} y={ASH_PISO - 150} width={980} height={150} fill="#6a4630" /><rect x={CAFE + 50} y={ASH_PISO - 160} width={1000} height={18} rx={4} fill="#e9dcc4" /></g>
        <Actor look={OWEN} escala={ESC} seed={1} ruta={owenRuta ?? [{ f: 0, x: CAFE + 420, y: ASH_PISO + 20 }]} dir={[{ f: 0, v: 1 }]} poses={owenPoses ?? [{ f: 0, v: "parado" }]} caras={[{ f: 0, v: "duda" }]} habla={owenHabla} />
        {children}
      </>}
      hud={<>{hud}<Bat cl={cl} x={lx} y={ASH_PISO - 30 - 330} pct={4} desde={-10} tam={1.3} /><HudOwen min={555} part={PART} /></>} />
  );
};
export const P18Cafe: React.FC = () => {
  const k = kDe(146.69);
  const cl = [mira(0, 1500, ASH_PISO - 300, 1.6), mira(k(149.6), CAFE + 540, ASH_PISO - 330, 1.75, { curva: "inout" }), mira(k(153.9), CAFE + 620, ASH_PISO - 300, 2.0, { curva: "inout" })];
  return (
    <CafeEsc tazas={k(153.9)} cl={cl} t0={146.69} owenRuta={[{ f: 0, x: 1000, y: ASH_PISO + 40 }, { f: k(151.5), x: CAFE + 420, y: ASH_PISO + 20 }]} lenaCaras={[{ f: 0, v: "risa" }, { f: k(156), v: "feliz" }, { f: k(157.5), v: "risa" }]} lenaHabla={[[k(156.5), k(159)]]}
      hud={<>
        <Pildora texto="STOP 18 · CAFÉ 18" x={960} y={950} desde={0} hasta={k(152.8)} color="#f4efe4" />
        <Pildora texto="LENA · 6 DRINKS AT ONCE · STILL SMILING" x={960} y={950} desde={k(154.2)} color="#ffd27a" />
      </>} />
  );
};
export const P19Lena: React.FC = () => {
  const k = kDe(159.84);
  // 26-oct v6 (ojo 5/10: tirones y globos translúcidos sobre caras): plano fijo de los dos, globos arriba, textos en la banda de abajo
  const cl = [mira(0, CAFE + 470, ASH_PISO - 330, 1.6), mira(k(173), CAFE + 480, ASH_PISO - 335, 1.68, { curva: "inout" })];
  const f = useF();
  const deja = k(170.4);
  return (
    <CafeEsc cl={cl} t0={159.84} owenRuta={[{ f: 0, x: CAFE + 300, y: ASH_PISO + 20 }]} lenaCaras={[{ f: 0, v: "feliz" }, { f: k(161.4), v: "risa" }, { f: k(164), v: "feliz" }]} lenaHabla={[[k(161.4), k(167.8)]]} owenHabla={[[0, k(161.3)]]}
      owenPoses={[{ f: 0, v: "parado" }, { f: deja - 10, v: { hD: 80, cD: 10 } }, { f: deja + 14, v: "parado" }]}
      hud={<>
        <Globo texto="You okay?" x={640} y={200} desde={0} hasta={k(161.4)} cola="abajo" tam={72} />
        <Globo texto="Great! Just did a double." x={1320} y={200} desde={k(161.4)} hasta={k(163.8)} cola="abajo" tam={70} />
        <Pildora texto="CLOSING LAST NIGHT" x={960} y={950} desde={k(163.8)} hasta={k(165.0)} color="#f4efe4" tam={66} />
        <Pildora texto="OPENING THIS MORNING" x={960} y={950} desde={k(165.0)} hasta={k(166.4)} color="#f4efe4" tam={66} />
        <Pildora texto="CHEM EXAM TONIGHT" x={960} y={950} desde={k(166.4)} hasta={k(167.8)} color="#ffd27a" tam={66} />
        <Mano texto="4% and still going." x={960} y={960} desde={k(167.9)} hasta={k(169.6)} color={ROJO_OWEN} tam={70} />
        <Mano texto="biggest tip of his life. won't help at all." x={960} y={960} desde={k(170.0)} color="#f4efe4" tam={66} />
        {f > deja && f < deja + 40 && <div style={{ position: "absolute", left: 860, top: 610 + (f - deja) * 2, width: 70, height: 36, background: "#7ac943", borderRadius: 4, transform: "rotate(-12deg)", border: "3px solid #3a6a20" }} />}
      </>} />
  );
};

// ---------- 20 · 10:30, el bus tranquilo, se le va el efecto: 41 % ----------
export const P20Quieto: React.FC = () => {
  const k = kDe(173.28);
  const cl = [mira(0, 640, 650, 1.3), mira(k(176.0), 360, BUS_PISO - 280, 2.3, { curva: "inout" })];
  return (
    <EnBus cl={cl} hora="dia" min={630} avance={(f) => 9000 + f * 8} pas={[sent(SENORA, 5, { seed: 31, caras: [{ f: 0, v: "cansado" }], poses: [{ f: 0, v: "sentado" }, { f: 40, v: { ...SIT, tronco: 10, cabeza: 26 } }] })]} owen={{ caras: [{ f: 0, v: "neutral" }, { f: 30, v: "cansado" }, { f: 70, v: "zombi" }, { f: 76, v: "sorpresa" }, { f: 90, v: "cansado" }], miradas: [{ f: 0, v: { x: 0.2, y: 0 } }, { f: 20, v: { x: 0.5, y: -0.8 } }, { f: 50, v: { x: 0.2, y: 0 } }], poses: [{ f: 0, v: "sentado" }, { f: 66, v: { tronco: 8, cabeza: 26 } }, { f: 76, v: { tronco: -6, cabeza: -8 } }, { f: 86, v: "sentado" }] }}
      hud={<>
        <Bat cl={cl} x={OX} y={OY} pct={[{ f: 0, v: 50 }, { f: k(176.96), v: 41 }]} capa={[{ f: 0, v: 8 }, { f: k(176.4), v: 0 }]} />
        <Pildora texto="10:30 AM · THE BUS IS QUIET" x={960} y={150} desde={0} color="#f4efe4" tam={68} />
      </>} />
  );
};

// ---------- 21 · 2 PM: todas las baterías caen a la vez ----------
export const P21Caida: React.FC = () => {
  const k = kDe(178.25);
  const cl = [mira(0, 1150, 650, 1.5), mira(k(186.8), 1400, 650, 1.55, { curva: "inout" }), mira(k(189.8), 470, BUS_PISO - 250, 1.85, { curva: "inout" })];
  const gente: [Pas, number, number][] = [
    [sent(NENE, 2, { seed: 41, caras: [{ f: 0, v: "feliz" }, { f: k(183.7), v: "cansado" }], poses: [{ f: 0, v: "sentado" }, { f: k(184.0), v: { ...SIT, tronco: 12, cabeza: 24 } }] }), 84, 76],
    [sent(OFICINISTA, 4, { seed: 42, caras: [{ f: 0, v: "neutral" }, { f: k(184.3), v: "cansado" }], poses: [{ f: 0, v: "celular" }, { f: k(184.6), v: { ...SIT, hD: 150, cD: 20, hI: 150, cI: 20, tronco: -8 } }, { f: k(185.8), v: { ...SIT, tronco: 10, cabeza: 22 } }], habla: [[k(184.6), k(185.6)]] }), 63, 55],
    [parado(OBRERO, 2000, { seed: 43, enManoD: <Termo />, caras: [{ f: 0, v: "neutral" }, { f: k(184.3), v: "cansado" }] }), 70, 61],
    [sent(SENORA, 7, { seed: 44, enManoD: <BolsaCompras />, caras: [{ f: 0, v: "feliz" }, { f: k(185.1), v: "cansado" }] }), 58, 51],
    [sent(SENORA, 8, { seed: 45, enManoD: <BolsaCompras />, caras: [{ f: 0, v: "neutral" }, { f: k(185.1), v: "cansado" }] }), 66, 57],
  ];
  const caida = (a: number, b: number) => [{ f: k(180.8), v: a }, { f: k(189.7), v: b }];
  return (
    <EnBus cl={cl} hora="tarde" min={(f) => 840 + Math.round(f / 30)} avance={(f) => 12000 + f * 10} pas={gente.map((g) => g[0])} owen={{ caras: [{ f: 0, v: "cansado" }, { f: k(189.8), v: "duda" }], miradas: [{ f: 0, v: { x: 0.4, y: -0.6 } }] }}
      hud={<>
        {gente.map(([p, a, b], i) => <Bat key={i} cl={cl} x={p.ruta[0].x} y={p.sentado !== undefined ? SY : PY} pct={caida(a, b)} desde={k(179.0) + i * 3} tam={1.3} alerta={false} />)}
        <Bat cl={cl} x={OX} y={OY} pct={caida(30, 22)} desde={0} />
        <Pildora texto="2 PM · EVERYONE DROPS" x={960} y={950} desde={k(180.8)} hasta={k(189.6)} color="#ffd27a" tam={70} />
        <Mano texto="is the power broken?" x={1250} y={170} desde={k(189.9)} color="#f4efe4" tam={80} />
      </>} />
  );
};

export const P22Bajon: React.FC = () => { const k = kDe(192.07); return <AbsoluteFill><BajonTarde pozoDesde={k(197.0)} /><Mano texto="sleepy-driver crashes peak here" x={960} y={840} desde={k(199.4)} color="#ffd27a" tam={64} /><HudOwen part={PART} /></AbsoluteFill>; };

// ---------- 23 · Owen es chofer, y está al 19 % ----------
export const P23Chofer: React.FC = () => {
  const k = kDe(202.99);
  const cl = [mira(0, 600, 640, 1.5), mira(k(205.4), 330, BUS_PISO - 280, 2.6, { curva: "inout" })];
  return (
    <EnBus cl={cl} hora="tarde" min={858} avance={(f) => 14000 + f * 11} owen={{ caras: [{ f: 0, v: "cansado" }, { f: 60, v: "zombi" }, { f: 70, v: "sorpresa" }, { f: 86, v: "cansado" }], giro: (f) => (f > 70 && f < 84 ? Math.sin((f - 70) * 1.3) * 0.2 : Math.sin(f / 14) * 0.05), miradas: [{ f: 0, v: { x: 0.3, y: 0 } }, { f: 100, v: { x: 0.5, y: -0.8 } }, { f: 130, v: { x: 0.3, y: 0 } }], poses: [{ f: 0, v: "sentado" }, { f: 56, v: { tronco: 10, cabeza: 30 } }, { f: 70, v: { tronco: -6, cabeza: -8 } }, { f: 84, v: "sentado" }] }}
      hud={<>
        <Bat cl={cl} x={OX} y={OY} pct={[{ f: 0, v: 22 }, { f: k(207.0), v: 19 }]} tam={1.3} alerta />
        <Mano texto="the battery stops being funny" x={1250} y={180} desde={k(203.2)} hasta={k(205.3)} color="#f4efe4" tam={80} />
        <Mano texto="and Owen is a DRIVER" x={1250} y={180} desde={k(205.4)} color={ROJO_OWEN} tam={92} />
        <Pildora texto="What's YOUR battery at 2 PM? Comment it ↓" x={960} y={950} desde={k(203.4)} color={VERDE} tam={60} />
      </>} />
  );
};

export const P24Choques: React.FC = () => { const k = kDe(209.33); return <AbsoluteFill><Choques dMuertes={k(217.6)} /><HudOwen part={PART} /></AbsoluteFill>; };
export const P25Alcohol: React.FC = () => { const k = kDe(219.39); return <AbsoluteFill><Alcohol d24={k(224.6)} /><HudOwen part={PART} /></AbsoluteFill>; };

// ---------- 26 · parada 30: vuelve el hombre del abrigo gris ----------
const FILA_ABRIGO = 10;
export const P26Abrigo: React.FC = () => {
  const k = kDe(228.75);
  const llega = k(230.0);
  const avance = (ff: number) => 16000 - Math.max(0, llega - ff) ** 2 * 0.08;
  const puertaF = (ff: number) => interpolate(ff, [llega, llega + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ab: Pas = {
    look: ABRIGO, seed: 51, aparece: k(230.6), caras: [{ f: 0, v: "neutral" }],
    ruta: [{ f: k(230.6), x: BUS_PUNTOS.puertaF + 40, y: BUS_PISO }, { f: k(231.6), x: BUS_PUNTOS.validador + 40, y: BUS_PISO }, { f: k(236.5), x: BUS_PUNTOS.validador + 40, y: BUS_PISO }, { f: k(239.2), x: ASIENTO_X(4), y: BUS_PISO }],
    poses: [{ f: 0, v: "parado" }, { f: k(232.6), v: { hI: 60, cI: 40 } }],
  };
  const cl = [mira(0, 480, 650, 1.5), mira(k(232.4), 420, 640, 2.4, { curva: "inout" }), mira(k(235.6), 470, 610, 3.2, { curva: "inout" })];
  return (
    <EnBus cl={cl} hora="tarde" min={872} avance={avance} puertaF={puertaF} paradas={[{ a: 16000, num: 30 }]} pas={[ab]} owen={{ caras: [{ f: 0, v: "cansado" }, { f: k(232.0), v: "miedo" }], giros: [{ f: 0, v: 0.5 }, { f: k(231.0), v: 0.9 }, { f: k(236.5), v: 0.9 }, { f: k(239.0), v: 0.4 }], miradas: [{ f: 0, v: { x: 1, y: 0.2 } }, { f: k(236.5), v: { x: 1, y: 0 } }, { f: k(239.0), v: { x: 0.6, y: -0.6 } }] }}
      hud={<>
        <Pildora texto="STOP 30 · 2:40 PM" x={960} y={950} desde={0} hasta={k(233)} color="#f4efe4" tam={70} />
        <Pildora texto="HALDEN CLINIC" x={960} y={950} desde={k(236.2)} color="#6fa8ff" tam={76} />
        <Mano texto="last week: no number at all" x={1250} y={200} desde={k(237.0)} color="#f4efe4" tam={80} />
      </>} />
  );
};
// el abrigo sentado al fondo, en el espejo: 100 % que no se mueve (ni al sentarse, ni al frenar, ni al bostezar)
export const P27Cien: React.FC = () => {
  const f = useF();
  const k = kDe(239.33);
  const freno = k(244.4);
  const sac = f > freno && f < freno + 14 ? Math.sin((f - freno) * 1.2) * 6 * (1 - (f - freno) / 14) : 0;
  const cl = [mira(0, ASIENTO_X(4) + 40, BUS_PISO - 170, 2.5), mira(k(242.6), ASIENTO_X(4) - 20, BUS_PISO - 270, 2.0, { curva: "inout" })];
  const hoja = (ff: number) => [k(240.6), k(247.4), k(249.8)].some((t) => ff > t && ff < t + 16);
  return (
    <AbsoluteFill style={{ transform: `translateX(${sac}px)` }}>
      <Escena Set={BusInterior} pal={PAL} claves={cl} setProps={{ hora: "tarde" }}
        medio={<Actor look={ABRIGO} escala={ESC} seed={51} ruta={[{ f: 0, x: ASIENTO_X(4), y: BUS_PISO }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { ...SIT, hD: 70, cD: 40, hI: 70, cI: 40 } }, { f: k(244.4), v: { ...SIT, tronco: 14, hD: 70, cD: 40, hI: 70, cI: 40 } }, { f: k(244.9), v: { ...SIT, hD: 70, cD: 40, hI: 70, cI: 40 } }, { f: k(245.5), v: { tronco: -8, ...SIT, hD: 70, cD: 140, hI: 25, cI: 50 } }, { f: k(246.6), v: { ...SIT, hD: 70, cD: 40, hI: 70, cI: 40 } }]}
          enManoD={(ff: number) => (ff < k(245.4) || ff > k(246.7) ? <g transform="translate(-20,-10)"><rect x={-60} y={-46} width={hoja(ff) ? 60 : 120} height={80} fill="#ece6d6" stroke="#b8b0a0" strokeWidth={2} />{[0, 1, 2, 3].map((i) => <rect key={i} x={-50} y={-34 + i * 16} width={hoja(ff) ? 40 : 98} height={5} fill="#9a9284" />)}</g> : null)}
          asiento={[{ f: 0, v: BUS_PUNTOS.asiento }]} caras={[{ f: 0, v: "neutral" }, { f: k(245.5), v: "sorpresa" }, { f: k(246.6), v: "neutral" }, { f: k(246.7), v: "picaro" }]} miradas={[{ f: 0, v: { x: -1, y: -0.2 } }]} habla={[[k(245.5), k(246.4)]]} />}
        hud={<>
          <Bat cl={cl} x={ASIENTO_X(4)} y={SY} pct={100} desde={k(240.0)} tam={1.2} />
          <Pildora texto="IT DOESN'T MOVE." x={960} y={950} desde={k(240.3)} hasta={k(248.8)} color="#f4efe4" tam={72} />
          <Pildora tam={66} texto="not when he sits" x={1400} y={220} desde={k(243.2)} hasta={k(244.3)} color="#ffd27a" />
          <Pildora tam={66} texto="not when the bus brakes" x={1400} y={220} desde={k(244.3)} hasta={k(245.5)} color="#ffd27a" />
          <Pildora tam={66} texto="not when he yawns" x={1400} y={220} desde={k(245.5)} hasta={k(246.6)} color="#ffd27a" />
          <Pildora texto="OFF AT STOP 38 · LIKE LAST TIME" x={960} y={950} desde={k(248.9)} color="#f4efe4" tam={66} />
          <HudOwen min={880} part={PART} />
        </>} />
      {false && <Marco x={1300} y={640} w={560} h={320} radio={70} espejar><Escena Set={BusInterior} pal={PAL} claves={[mira(0, BUS_PUNTOS.chofer - 10, BUS_PISO - 300, 3.2)]} setProps={{ hora: "tarde" }} medio={<OwenAlVolante o={{ caras: [{ f: 0, v: "miedo" }] }} />} /></Marco>}
    </AbsoluteFill>
  );
};

// ---------- 28 · 3:20, la batería a punto de llegar a cero es la suya: 6 → 5 ----------
export const P28Suya: React.FC = () => {
  const k = kDe(251.51);
  const cl = [mira(0, 430, BUS_PISO - 280, 2.1), mira(k(254.0), 330, BUS_PISO - 290, 2.8, { curva: "inout" })];
  return (
    <EnBus cl={cl} hora="tarde" min={920} avance={(f) => 20000 + f * 11} owen={{ caras: [{ f: 0, v: "cansado" }, { f: 40, v: "zombi" }, { f: 52, v: "cansado" }, { f: k(256.7), v: "miedo" }, { f: k(258), v: "zombi" }], poses: [{ f: 0, v: "sentado" }, { f: 36, v: { tronco: 8, cabeza: 24, hD: 20, cD: 40 } }, { f: 52, v: "sentado" }, { f: k(258), v: { tronco: 10, cabeza: 30, hD: 20, cD: 40 } }], giro: (f) => (f > 48 && f < 60 ? Math.sin((f - 48) * 1.3) * 0.12 : 0) }}
      hud={<>
        <Bat cl={cl} x={OX} y={OY} pct={[{ f: k(257.5), v: 6 }, { f: k(257.8), v: 5 }]} desde={k(253.0)} tam={1.2} alerta />
        <Pildora texto="3:20 PM" x={960} y={950} desde={0} hasta={k(256.5)} color="#f4efe4" tam={76} />
        <Mano texto="it's his own." x={1250} y={220} desde={k(256.7)} color={ROJO_OWEN} tam={100} />
      </>} />
  );
};

// ---------- 29 · micro-sueño: los ojos se cierran, el bus se va hacia los autos estacionados ----------
export const P29Deriva: React.FC = () => {
  const f = useF();
  const k = kDe(259.49);
  const cierra = interpolate(f, [k(259.6), k(260.4), k(261.6), k(262.2)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ext = f >= k(262.2);
  const bx = (ff: number) => 900 + ff * 12;
  const by = (ff: number) => ASH_CARRIL - interpolate(ff, [k(262.2), k(265.3)], [0, 70], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cl = [mira(0, bx(k(262.2)) + 420, ASH_CARRIL - 340, 1.0), mira(k(262.2), bx(k(262.2)) + 420, ASH_CARRIL - 340, 1.0), mira(k(265.3), bx(k(265.3)) + 520, ASH_CARRIL - 320, 1.15)];
  return (
    <AbsoluteFill>
      {!ext ? <EnBus cl={[mira(0, 330, BUS_PISO - 290, 2.8), mira(k(262.2), 320, BUS_PISO - 280, 3.2)]} hora="tarde" min={921} avance={(ff) => 21000 + ff * 11} owen={{ caras: [{ f: 0, v: "zombi" }], poses: [{ f: 0, v: "sentado" }, { f: 30, v: { tronco: 12, cabeza: 34, hD: 10, cD: 20 } }], giro: (ff) => 0.1 + ff * 0.002 }} hud={f < k(259.6) ? <Bat cl={[mira(0, 330, BUS_PISO - 290, 2.8)]} x={OX} y={OY} pct={5} alerta tam={1.2} /> : null} />
        : <Escena Set={Ashland} pal={PAL} claves={cl} seed={29} setProps={{ hora: "tarde", centro: (ff: number) => bx(ff) + 650, autos: 0 }}
          medio={<g transform={`rotate(${-interpolate(f, [k(262.2), k(265.3)], [0, 2.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} ${bx(f) + 1000} ${by(f)})`}><Bus9 x={bx(f)} y={by(f)} esc={0.85} dir={1} hora="tarde" rueda={f * 9} /></g>}
          hud={<><Pildora texto="DRIFTING TOWARD THE PARKED CARS" x={960} y={130} desde={k(262.4)} color={ROJO_OWEN} tam={70} /><HudOwen min={921} part={PART} /></>} />}
      {cierra > 0 && <>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 540 * cierra * 0.8, background: "linear-gradient(#0d0a10 85%, rgba(13,10,16,0))" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 540 * cierra * 0.8, background: "linear-gradient(rgba(13,10,16,0), #0d0a10 15%)" }} />
      </>}
      {cierra > 0.25 && <div style={{ position: "absolute", left: 0, right: 0, top: 455, textAlign: "center", fontFamily: F_HUD, fontWeight: 900, fontSize: 140, lineHeight: 1, color: "#fff", WebkitTextStroke: "6px #ff3d2e", opacity: Math.min(1, (cierra - 0.25) * 4), textShadow: "0 6px 20px rgba(0,0,0,0.8)" }}>{f < k(260.9) ? "1 second..." : "2..."}</div>}
    </AbsoluteFill>
  );
};

// ---------- 30 · frena fuerte, ruedan las compras ----------
export const P30Frena: React.FC = () => {
  const f = useF();
  const k = kDe(265.35);
  const sac = f < 16 ? Math.sin(f * 2.2) * 26 * (1 - f / 16) : 0;
  const cl = [mira(0, 380, BUS_PISO - 280, 2.2), mira(k(266.4), 1550, BUS_PISO - 180, 1.9, { curva: "inout" })];
  const rueda = (i: number) => { const t = Math.max(0, f - k(266.45) - i * 4); return { x: 1700 - t * (9 - i), y: BUS_PISO - 18 - Math.abs(Math.sin(t / 5)) * 8 * Math.exp(-t / 40), r: t * (12 - i) }; };
  return (
    <AbsoluteFill style={{ transform: `translate(${sac}px,${sac * 0.3}px)` }}>
      <EnBus cl={cl} hora="tarde" min={922} avance={() => 22000} pas={[sent(SENORA, 7, { seed: 44, caras: [{ f: 0, v: "miedo" }, { f: k(268.3), v: "neutral" }] }), sent(ESTUDIANTE, 4, { seed: 22, caras: [{ f: 0, v: "miedo" }] })]} owen={{ caras: [{ f: 0, v: "miedo" }], poses: [{ f: 0, v: { tronco: 26, cabeza: -10, hD: 80, cD: 10, hI: 80, cI: 10 } }, { f: 12, v: { tronco: -8, hD: 70, cD: 20, hI: 70, cI: 20 } }, { f: 24, v: "sentado" }] }}
        medio={<>{[0, 1, 2, 3].map((i) => { const p = rueda(i); return <g key={i} transform={`translate(${p.x},${p.y - 10}) rotate(${p.r})`}><circle r={44} fill={["#ff8a2a", "#7ac943", "#e83a3a", "#f2d03a"][i]} stroke="#00000044" strokeWidth={5} /><path d="M0,-44 q8,-16 20,-18" stroke="#3a6a20" strokeWidth={5} fill="none" /></g>; })}</>}
        hud={<Pildora texto="NOBODY'S HURT" x={960} y={190} desde={k(268.2)} color={VERDE} tam={80} />} />
    </AbsoluteFill>
  );
};

// ---------- 31 · micro-sueño: el nombre ----------
export const P31Micro: React.FC = () => {
  const f = useF();
  const k = kDe(269.13);
  const parpado = (ff: number) => { const t = ff % 60; return t < 30 ? Math.min(1, t / 9) : Math.max(0, 1 - (t - 30) / 9); }; // parpadeo lento desde el cuadro 0
  const p = parpado(f);
  return (
    <AbsoluteFill>
      <Pizarra titulo="MICRO-SLEEP">
        <g transform={`translate(760,${560 + p * 30 + Math.sin(f / 9) * 8}) rotate(${p * 14 + Math.sin(f / 14) * 5})`}>
          <circle r={300} fill="#111" />
          {[-110, 110].map((ex) => <g key={ex} transform={`translate(${ex},-30)`}>
            <ellipse rx={78} ry={92} fill="#f4efe4" />
            <circle cx={10} cy={14} r={34} fill="#111" />
            <rect x={-90} y={-104} width={180} height={196 * p} fill="#111" />
          </g>)}
          <path d="M-60,150 q60,18 120,0" stroke="#f4efe4" strokeWidth={10} fill="none" opacity={0.6} />
        </g>
        {[0, 1].map((i) => <g key={i} opacity={0.35 + 0.65 * Math.max(0, Math.sin(((f - i * 30) / 60) * Math.PI * 2))} transform={`translate(${1220 + i * 180},500) scale(${1 + 0.12 * Math.max(0, Math.sin(((f - i * 30) / 60) * Math.PI * 2))}) translate(${-(1220 + i * 180)},-500)`}><circle cx={1220 + i * 180} cy={500} r={70} fill="none" stroke="#ffd27a" strokeWidth={10} /><text x={1220 + i * 180} y={530} fontFamily={F_HUD} fontWeight={800} fontSize={84} fill="#ffd27a" textAnchor="middle">{i + 1}</text></g>)}
        <text x={1310} y={640} fontFamily={F_HUD} fontWeight={700} fontSize={40} fill="#f4efe4" textAnchor="middle">SECONDS · LIGHTS OUT</text>
        {p > 0.5 && [0, 1, 2].map((i) => { const t = ((f + i * 14) % 42) / 42; return <text key={i} x={1000 + t * 120} y={330 - t * 160} fontFamily={F_HUD} fontWeight={800} fontSize={60 + i * 20} fill="#ffe04a" opacity={Math.sin(t * Math.PI)}>Z</text>; })}
      </Pizarra>
      <Mano texto="your brain just switches off." x={960} y={900} desde={k(272.3)} hasta={k(275.5)} color="#ffd27a" tam={82} />
      <Mano texto="you often don't even notice." x={960} y={900} desde={k(275.6)} color="#f4efe4" tam={82} />
      <HudOwen part={PART} />
    </AbsoluteFill>
  );
};

// ---------- 32 · fin de la línea, 95th St: se acuesta en los asientos de atrás 20 min → 40 % ----------
export const P32Siesta: React.FC = () => {
  const f = useF();
  const k = kDe(277.77);
  const acuesta = k(284.4), despierta = k(287.5);
  const lx = ASIENTO_X(11) - 60;
  const cl = [mira(0, 560, 640, 1.5), mira(k(283.2), lx - 140, BUS_PISO - 200, 2.2, { curva: "inout" }), mira(k(287.4), lx - 100, BUS_PISO - 200, 2.6, { curva: "inout" })];
  const min = f < acuesta ? 1000 : f < despierta ? 1000 + Math.round(interpolate(f, [acuesta, despierta], [0, 20])) : 1020;
  return (
    <EnBus cl={cl} hora="tarde" min={min} avance={() => 30000} owen={f < k(282.6) ? { caras: [{ f: 0, v: "cansado" }, { f: k(280.0), v: "feliz" }], poses: [{ f: 0, v: "sentado" }, { f: k(280.0), v: { hD: 160, cD: 10, hI: 160, cI: 10, tronco: -10 } }, { f: k(281.4), v: "sentado" }] } : null}
      medio={f >= k(282.6) && <g transform={f >= acuesta ? `rotate(-82 ${lx} ${BUS_PISO - 150})` : undefined}>
        <Actor look={OWEN} escala={ESC} seed={1} ruta={[{ f: 0, x: f >= acuesta ? lx : ASIENTO_X(10), y: f >= acuesta ? BUS_PISO - 150 : BUS_PISO }]} dir={[{ f: 0, v: 1 }]}
          caras={[{ f: 0, v: "cansado" }, { f: despierta, v: "sorpresa" }, { f: despierta + 30, v: "feliz" }]} poses={[{ f: 0, v: "parado" }]} />
      </g>}
      hud={<>
        <Pildora texto="95TH STREET · END OF THE LINE · 25 MIN LAYOVER" x={960} y={950} desde={0} hasta={k(283.2)} color="#f4efe4" tam={60} />
        {f >= acuesta && f < despierta && <Pildora texto="⏰ 20 MIN" x={960} y={950} desde={acuesta} color="#ffd27a" tam={80} />}
        <Bat cl={cl} x={lx + 60} y={BUS_PISO - 250} tam={1.3} pct={[{ f: acuesta, v: 4 }, { f: despierta, v: 40 }]} desde={acuesta} zz={f < despierta} />
        <Mano texto="something he's never done" x={1250} y={200} desde={k(281.7)} hasta={k(284.3)} color="#f4efe4" tam={80} />
        {f >= acuesta && f < despierta && [0, 1, 2].map((i) => { const t = ((f + i * 20) % 60) / 60; return <div key={i} style={{ position: "absolute", left: 900 + t * 140, top: 420 - t * 200, fontFamily: F_HUD, fontWeight: 800, fontSize: 70 + i * 20, color: "#ffe04a", opacity: Math.sin(t * Math.PI), textShadow: "0 4px 10px rgba(0,0,0,0.5)" }}>Z</div>; })}
      </>} />
  );
};

export const P33Nasa: React.FC = () => { const k = kDe(289.33); return <AbsoluteFill><SiestaNasa dAlerta={k(300.6)} /><HudOwen part={PART} /></AbsoluteFill>; };

// ---------- 34 · maneja el resto al 40 %: despacio, con cuidado ----------
export const P34Despacio: React.FC = () => {
  const f = useF();
  const bx = (ff: number) => 900 + ff * 5;
  const cl = [mira(0, bx(0) + 420, ASH_CARRIL - 380, 1.3), mira(130, bx(130) + 620, ASH_CARRIL - 400, 1.6, { curva: "inout" })];
  return (
    <Escena Set={Ashland} pal={PAL} claves={cl} seed={34} setProps={{ hora: "tarde", centro: (ff: number) => bx(ff) + 500 }}
      medio={<Bus9 x={bx(f)} y={ASH_CARRIL} esc={0.85} dir={1} hora="tarde" rueda={f * 4} />}
      hud={<><Bat cl={cl} x={(ff) => bx(ff) + 420} y={ASH_CARRIL - 400} pct={40} tam={1.5} /><Pildora texto="SLOW. CAREFUL." x={960} y={960} desde={45} color={VERDE} tam={76} /><HudOwen min={1040} part={PART} /></>} />
  );
};

// ---------- 35 · Rosa a la tarde: 81 años, 65 % a las 6 ----------
export const P35Rosa: React.FC = () => {
  const k = kDe(311.79);
  const cl = [mira(0, 640, P - 260, 1.75), mira(k(327.8), 640, P - 260, 1.9, { curva: "inout" })];
  const come = Array.from({ length: 30 }).map((_, i) => ({ f: i * 18, v: i % 2 ? { ...SIT, hD: 140, cD: 150, cabeza: -4 } : { ...SIT, hD: 60, cD: 80, cabeza: 8 } }));
  const cose = Array.from({ length: 24 }).map((_, i) => ({ f: i * 16, v: { tronco: -4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 60 + (i % 2) * 14, cD: 70 - (i % 2) * 20, hI: 40, cI: 60 } }));
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={35} setProps={{ hora: "tarde", luzBaño: false }}
      medio={<>
        <Actor look={ROSA} escala={ESC} seed={5} ruta={[{ f: 0, x: TF_PUNTOS.sillaRosa, y: P }]} dir={[{ f: 0, v: 1 }]} poses={cose} asiento={[{ f: 0, v: 110 }]} caras={[{ f: 0, v: "feliz" }]} />
        <Actor look={OWEN} escala={ESC} seed={6} ruta={[{ f: 0, x: TF_PUNTOS.sillaOwen, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[...come.filter((q) => q.f < k(327.0)), { f: k(327.8), v: { ...SIT, tronco: 10, cabeza: 22 } }]} asiento={[{ f: 0, v: 110 }]} caras={[{ f: 0, v: "cansado" }, { f: k(327.8), v: "triste" }]} habla={come.filter((q, i) => i % 2 === 1 && q.f < k(327)).map((q) => [q.f, q.f + 8] as [number, number])} enManoD={<path d="M0,-30 v40 M-6,-30 v12 M6,-30 v12" stroke="#c9c2b2" strokeWidth={4} />} />
      </>}
      hud={<>
        <Bat cl={cl} x={TF_PUNTOS.sillaRosa - 150} y={P - 250} pct={[{ f: 0, v: 66 }, { f: k(327.7), v: 65 }]} desde={k(314.6)} tam={1.2} />
        <Bat cl={cl} x={TF_PUNTOS.sillaOwen + 160} y={P - 190} pct={[{ f: 0, v: 24 }, { f: k(329.8), v: 18 }]} desde={k(327.8)} tam={1.2} alerta />
        <Pildora texto="ROSA · 81 · 65% AT 6 PM" x={960} y={960} desde={k(314.6)} hasta={k(327.6)} color="#f4efe4" tam={68} />
        {/* 26-oct v5 (ojo: los manuscritos pisaban baterías y calendario): una nota por vez, arriba al centro */}
        {[["a walk in the morning", 316.9, 319.0], ["real food, regular times", 319.1, 320.8], ["water, not soda", 320.9, 322.0], ["a nap after lunch", 322.1, 323.2], ["in bed by 9:30", 323.3, 325.1]].map(([t, a, b], i) => (
          <Mano key={i} texto={t as string} x={960} y={150} desde={k(a as number) - 3} hasta={k(b as number)} color="#ffd27a" tam={80} vel={9} />
        ))}
        <Mano texto="spent on purpose" x={960} y={150} desde={k(325.2) - 3} hasta={k(327.7)} color={VERDE} tam={84} vel={8} />
        <Pildora texto="OWEN: A HOLE IN A BUCKET" x={960} y={960} desde={k(327.9)} color={ROJO_OWEN} tam={70} />
        <HudOwen min={1080} part={PART} />
      </>} />
  );
};

// ---------- 36 · el mensaje: 45/47 y la pregunta ----------
export const P36Mensaje: React.FC = () => {
  const f = useF();
  const k = kDe(329.99);
  const cambio = k(337.7);
  const preg = k(344.85);
  const txt = "Is there anything you would like to change about your body for week three?";
  const n = Math.max(0, Math.floor((f - preg) * 1.6));
  const lineas = txt.slice(0, n).match(/.{1,26}(\s|$)/g) ?? [];
  return (
    <AbsoluteFill>
      <Escena Set={TwoFlatCorte} pal={PAL} claves={[mira(0, TF_PUNTOS.cama + 300, A - 200, 2.3), mira(k(345), TF_PUNTOS.cama + 280, A - 210, 2.6, { curva: "inout" })]} seed={36} setProps={{ hora: "noche", luzCocina: false, luzBaño: false, luzDorm: false, reloj: "10:52" }}
        medio={<Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: TF_PUNTOS.cama + 140, y: A }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "celular" }, { f: cambio, v: { ...SIT, hD: 30, cD: 125, cabeza: 26, tronco: 10 } }, { f: cambio + 50, v: "celular" }]} asiento={[{ f: 0, v: 110 }]} caras={[{ f: 0, v: "cansado" }, { f: cambio, v: "sorpresa" }, { f: cambio + 50, v: "triste" }, { f: preg, v: "duda" }]} />} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 28% 45%, rgba(111,168,255,0.28) 0%, rgba(5,7,13,0.55) 45%)" }} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform="translate(560,0)"><MensajeCel de="Halden Clinic · Dr. Imani Hale" texto={"Week 2 complete.\nThank you, participant 47."} extra="PARTICIPANTS 45/47" desde={k(330.3)} extraDesde={cambio} s={0.9} /></g>
        {f >= preg && <g><rect x={1330} y={760} width={420} height={190} rx={24} fill="#dfeaff" />{lineas.map((l, i) => <text key={i} x={1352} y={806 + i * 38} fontFamily={F_HUD} fontSize={30} fill="#14203a">{l}</text>)}</g>}
      </svg>
      <Contador lineas={[{ etiqueta: "PARTICIPANTS", claves: "46/47", color: VERDE }]} tam={38} hasta={cambio} />
      <Contador lineas={[{ etiqueta: "PARTICIPANTS", claves: "45/47", color: ROJO_OWEN }]} tam={38} desde={cambio} />
      <Mano texto="another one gone" x={1300} y={200} desde={k(340.9)} hasta={k(342.1)} color="#f4efe4" tam={84} />
      <Mano texto="a question he's never been asked" x={1300} y={200} desde={k(342.2)} color="#ffd27a" tam={80} />
    </AbsoluteFill>
  );
};

// ---------- 37 · piensa: el bus a la deriva, Lena al 4 %, el abrigo clavado en 100 ----------
export const P37Piensa: React.FC = () => {
  const k = kDe(348.31);
  const f = useF();
  const tarjeta = (t: string, pct: number, x: number, d: number, col: string) => {
    const e = interpolate(f, [d, d + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <div style={{ position: "absolute", left: x, top: 90 + (1 - e) * 40 + Math.sin((f + x) / 22) * 6, width: 440, height: 380, marginLeft: -220, opacity: e, background: "rgba(14,20,40,0.85)", border: `6px solid ${col}`, borderRadius: 30, textAlign: "center", fontFamily: F_HUD }}>
        <div style={{ marginTop: 34, display: "inline-block" }}><BateriaSvg pct={pct} f={f} tam={1.5} alerta={pct < 8} /></div>
        <div style={{ marginTop: 24, fontSize: 52, fontWeight: 700, color: "#f4efe4", padding: "0 16px" }}>{t}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Escena Set={TwoFlatCorte} pal={PAL} claves={[mira(0, TF_PUNTOS.cama + 140, A - 260, 2.1), mira(k(354), TF_PUNTOS.cama + 140, A - 250, 2.4, { curva: "inout" })]} seed={37} setProps={{ hora: "noche", luzCocina: false, luzBaño: false, luzDorm: true, reloj: "11:04" }}
        medio={<Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: TF_PUNTOS.cama + 140, y: A }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "pensar" }, { f: k(351.2), v: "manosCara" }, { f: k(352.3), v: "pensar" }, { f: k(354.2), v: { ...SIT, hD: 40, cD: 80, hI: 40, cI: 80, cabeza: 14 } }]} asiento={[{ f: 0, v: 110 }]} caras={[{ f: 0, v: "triste" }, { f: k(351.2), v: "miedo" }, { f: k(352.3), v: "duda" }, { f: k(354.2), v: "determinado" }]} miradas={[{ f: 0, v: { x: -0.6, y: -0.6 } }, { f: k(351.2), v: { x: 0, y: -0.7 } }, { f: k(352.3), v: { x: 0.6, y: -0.6 } }, { f: k(354.2), v: { x: 0, y: 0 } }]} />} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 60%, rgba(5,7,13,0) 30%, rgba(5,7,13,0.5) 80%)" }} />
      {tarjeta("the bus drifting", 5, 420, k(348.4), ROJO_OWEN)}
      {tarjeta("Lena", 4, 960, k(351.2), "#ffc24a")}
      {tarjeta("the gray coat", 100, 1500, k(352.3), "#6fa8ff")}
      <HudOwen part="45/47" />
    </AbsoluteFill>
  );
};

// ---------- 38 · escribe cuatro palabras ----------
export const P38Escribe: React.FC = () => {
  const f = useF();
  const k = kDe(355.67);
  const txt = "I never want to be tired.";
  const n = Math.max(0, Math.floor((f - k(356.9)) * 0.75));
  const env = f >= k(358.45);
  const zoom = interpolate(f, [0, 110], [1.15, 1.5], { extrapolateRight: "clamp" });
  const tipea = f >= k(356.9) && !env;
  const pulgar = tipea ? Math.sin(f * 1.7) * 18 : 40;
  return (
    <AbsoluteFill style={{ background: "#0a0e18" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 65%" }}>
        <rect x={660} y={60} width={600} height={1100} rx={70} fill="#111317" />
        <rect x={685} y={90} width={550} height={1050} rx={50} fill="#0f1a2c" />
        <rect x={720} y={180} width={480} height={150} rx={24} fill="#dfeaff" />
        <text x={745} y={225} fontFamily={F_HUD} fontSize={27} fill="#14203a">Is there anything you would like</text>
        <text x={745} y={262} fontFamily={F_HUD} fontSize={27} fill="#14203a">to change about your body</text>
        <text x={745} y={299} fontFamily={F_HUD} fontSize={27} fill="#14203a">for week three?</text>
        <g transform={`translate(0,${env ? -Math.min(1, (f - k(358.45)) / 8) * 360 : 0})`}>
          <rect x={env ? 860 : 720} y={env ? 760 : 780} width={env ? 340 : 480} height={90} rx={24} fill={env ? "#2f7bf6" : "#1d2a44"} />
          <text x={env ? 885 : 745} y={env ? 815 : 835} fontFamily={F_HUD} fontWeight={600} fontSize={34} fill="#fff">{txt.slice(0, n)}{!env && f % 20 < 10 ? "|" : ""}</text>
        </g>
        <rect x={700} y={900} width={520} height={220} rx={20} fill="#1b2840" />
        {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={716 + (i % 10) * 50} y={916 + Math.floor(i / 10) * 66} width={42} height={54} rx={8} fill={tipea && (Math.floor(f / 3) + i * 7) % 30 === 0 ? "#6fa8ff" : "#2c3c5c"} />)}
        <g transform={`translate(${1010 + pulgar},${1010 + Math.abs(pulgar) * 0.6})`}><ellipse cx={0} cy={0} rx={52} ry={130} fill="#1a1a1a" transform="rotate(-28)" /></g>
        {env && f < k(358.45) + 12 && <circle cx={1030} cy={445} r={40 + (f - k(358.45)) * 8} fill="none" stroke="#6fa8ff" strokeWidth={6} opacity={1 - (f - k(358.45)) / 12} />}
      </svg>
      <Pildora texto="SENT ✓" x={1500} y={540} desde={k(358.6)} color="#6fa8ff" tam={80} />
      <HudOwen part="45/47" />
    </AbsoluteFill>
  );
};

// ---------- 39 · la semana que viene: el cerebro no se cansa más ----------
export const P39Gancho: React.FC = () => {
  const f = useF();
  const k = kDe(359.51);
  const noche = Math.min(3, Math.floor(interpolate(f, [k(366.0), k(368.8)], [0, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })) + 1);
  const ox = (ff: number) => interpolate(ff, [0, 70, 130, 200, 260, 330], [TF_PUNTOS.cama + 140, TF_PUNTOS.cama + 140, 60, 60, TF_PUNTOS.cama + 220, TF_PUNTOS.cama + 220], { extrapolateRight: "clamp" });
  const cl = [mira(0, 300, A - 210, 1.6), mira(k(368.9), TF_PUNTOS.cama + 120, A - 230, 1.9, { curva: "inout" })];
  const reloj = ["12:30", "2:00", "3:30"][noche - 1];
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={39} setProps={{ hora: "noche", luzCocina: false, luzBaño: false, luzDorm: true, reloj: f >= k(366.0) ? reloj : "11:58" }}
      medio={<Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: TF_PUNTOS.cama + 140, y: A }, { f: 70, x: TF_PUNTOS.cama + 140, y: A }, { f: 130, x: 60, y: A }, { f: 200, x: 60, y: A }, { f: 260, x: TF_PUNTOS.cama + 220, y: A }]} dir={[{ f: 0, v: -1 }, { f: 200, v: 1 }]}
        poses={[{ f: 0, v: "sentado" }, { f: 60, v: "parado" }, { f: 132, v: { hD: 120, cD: 40, cabeza: -6 } }, { f: 196, v: "parado" }, { f: 262, v: { tronco: 14, hD: 70, cD: 20, cabeza: 18 } }, { f: k(368.9) + 6, v: "brazosCruzados" }]}
        asiento={[{ f: 0, v: 110 }, { f: 58, v: undefined }]} caras={[{ f: 0, v: "sorpresa" }, { f: 132, v: "duda" }, { f: 262, v: "sorpresa" }, { f: k(368.9), v: "miedo" }]} miradas={[{ f: 0, v: { x: 0, y: 0 } }, { f: 132, v: { x: -1, y: -0.3 } }, { f: 262, v: { x: 1, y: 0.4 } }]} />}
      hud={<>
        <Calendario texto="NEXT WEEK" x={110} y={130} desde={-12} hasta={k(365.9)} tam={88} />
        <Bat cl={cl} x={ox} y={A - 360} pct={100} desde={k(360.5)} tam={1.1} />
        <Mano texto="no yawning. no fog. no sleep." x={1000} y={170} desde={k(362.2)} hasta={k(369.9)} color="#f4efe4" tam={80} />
        {f >= k(366.0) && <Calendario texto={`NIGHT ${noche} · ${reloj} AM`} x={110} y={130} desde={k(366.0)} tam={72} />}
        <Mano texto="why we sleep at all" x={1000} y={170} desde={k(370.0)} color={ROJO_OWEN} tam={76} vel={5} />
        <HudOwen min={(ff) => (ff < k(366.0) ? 1438 : [30, 120, 210][noche - 1])} part="45/47" />
      </>} />
  );
};

// ---------- 40 · CTA final: ¿a cuánto está tu batería? ----------
export const P40Cta: React.FC = () => {
  const k = kDe(372.91);
  const cl = [mira(0, 560, 640, 1.5), mira(k(381), 600, 640, 1.62)];
  const f = useF();
  return (
    <EnBus cl={cl} hora="ocaso" part="45/47" min={1110} avance={() => 30000} puertaF={() => 1}
      pas={[{ look: ESTUDIANTE, seed: 77, ruta: [{ f: 0, x: BUS_PUNTOS.puertaF + 40, y: BUS_PISO }, { f: 40, x: BUS_PUNTOS.validador + 60, y: BUS_PISO }, { f: 80, x: BUS_PUNTOS.validador + 60, y: BUS_PISO }, { f: 130, x: ASIENTO_X(3), y: BUS_PISO }], dir: [{ f: 0, v: 1 }], sentado: 134, poses: [{ f: 0, v: "parado" }, { f: 44, v: "saludar" }, { f: 74, v: "parado" }], caras: [{ f: 0, v: "feliz" }] }]}
      owen={{ caras: [{ f: 0, v: "feliz" }, { f: 44, v: "risa" }, { f: 80, v: "feliz" }], giros: [{ f: 0, v: 0.5 }, { f: 90, v: 0 }, { f: 120, v: 1 }], miradas: [{ f: 0, v: { x: 1, y: 0 } }, { f: 120, v: { x: 0, y: 0 } }], habla: [[44, 70]], manos: "I", poses: [{ f: 0, v: "sentado" }, { f: 44, v: { hD: 150, cD: 30 } }, { f: 76, v: "sentado" }, { f: 130, v: { hD: 120, cD: 60 } }, { f: 170, v: "sentado" }] }}
      hud={<>
        <div style={{ position: "absolute", left: 960 + (ASIENTO_X(1) - 560) * 1.5, top: 540 + (BUS_PISO - 270 - 640) * 1.5, transform: "translate(-50%,-100%) scale(2.2)", transformOrigin: "50% 100%" }}>
          <BateriaSvg pct={Math.round(interpolate(f, [130, 220], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))} f={f} />
        </div>
        <div style={{ position: "absolute", left: 960 + (ASIENTO_X(1) - 560) * 1.5, top: 540 + (BUS_PISO - 200 - 640) * 1.5, transform: "translate(-50%,0)", fontFamily: F_HUD, fontWeight: 800, fontSize: 84, color: "#ffd27a", textShadow: "0 3px 10px rgba(0,0,0,0.7)" }}>YOU?</div>
        <Pildora texto="What's YOUR battery at right now?" x={960} y={960} desde={k(373.2)} hasta={k(377.0)} color={VERDE} tam={68} />
        <Pildora texto="TELL US IN THE COMMENTS · WEEK 3 IS NEXT" x={960} y={960} desde={k(377.1)} color="#f4efe4" tam={58} />
        {f > k(378.5) && <div style={{ position: "absolute", left: 960, top: 60, transform: `translateX(-50%) scale(${Math.min(1, (f - k(378.5)) / 6) * (1 + Math.max(0, Math.sin((f - k(378.5)) / 6)) * 0.05)})`, display: "flex", alignItems: "center", gap: 18, background: "#e22a2a", color: "#fff", fontFamily: F_HUD, fontWeight: 800, fontSize: 66, padding: "16px 44px", borderRadius: 18, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>SUBSCRIBE <span style={{ display: "inline-block", fontSize: 46, transform: `rotate(${Math.sin(f / 3) * 14}deg)` }}>🔔</span></div>}
      </>} />
  );
};
