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

const P = TF_PISO, A = TF_ARRIBA;
const PART = "46/47";
const EnBus: React.FC<React.ComponentProps<typeof EnBus0>> = (p) => <EnBus0 part={PART} {...p} />;
const sent = (look: Pas["look"], fila: number, extra: Partial<Pas> = {}): Pas => ({ look, ruta: [{ f: 0, x: ASIENTO_X(fila), y: BUS_PISO }], dir: [{ f: 0, v: -1 }], sentado: 0, poses: [{ f: 0, v: "sentado" }], ...extra });
const parado = (look: Pas["look"], x: number, extra: Partial<Pas> = {}): Pas => ({ look, ruta: [{ f: 0, x, y: BUS_PISO }], dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "agarrarAlto" }], ...extra });
const OX = BUS_PUNTOS.chofer, OY = BUS_PISO - 268; // batería de Owen al volante
const SY = BUS_PISO - 262, PY = BUS_PISO - 335;     // batería de un sentado / un parado
const ROSA_COCINA = TF_PUNTOS.cocina + 90;

const Dona: React.FC = () => <g transform="translate(0,-8)"><circle r={24} fill="#c98a4a" /><circle r={18} fill="none" stroke="#ff7ab0" strokeWidth={11} /><circle r={7} fill="#2a2420" /></g>;
const Termo: React.FC = () => <g transform="translate(0,-20)"><rect x={-12} y={-34} width={24} height={60} rx={6} fill="#5a6a7a" /><rect x={-14} y={-42} width={28} height={12} rx={4} fill="#c23a2e" /></g>;
const Banana: React.FC = () => <path d="M-26,-6 q26,26 52,-4 q-26,14 -52,4 Z" fill="#f2d03a" stroke="#8a6a1a" strokeWidth={3} />;
const Bolsa: React.FC = () => <g transform="translate(0,-6)"><path d="M-22,-30 h44 l-4,44 h-36 Z" fill="#c9a06a" /><path d="M-22,-30 l6,-8 h32 l6,8" fill="#b08a54" /></g>;
const BolsaCompras: React.FC = () => <g transform="translate(0,10)"><path d="M-26,-10 h52 l-6,46 h-40 Z" fill="#f4efe4" stroke="#c9c2b2" strokeWidth={3} /><path d="M-14,-10 q14,-24 28,0" fill="none" stroke="#c9c2b2" strokeWidth={4} /><circle cx={-8} cy={-14} r={10} fill="#ff8a2a" /><circle cx={10} cy={-12} r={9} fill="#7ac943" /></g>;

// ---------- 1 · cuadro 0 = la miniatura sin texto: Owen dormitando al volante (1 %), Lena atrás con el café (4 %) ----------
export const P01Mini: React.FC = () => {
  const cl = [mira(0, 560, 640, 2.0), mira(30, 556, 640, 2.04)];
  const lena: Pas = { ...sent(LENA, 1, { seed: 4 }), caras: [{ f: 0, v: "cansado" }], enManoD: <VasoCafe /> };
  return (
    <EnBus cl={cl} hora="ocaso" part={null} pas={[lena]} owen={{ caras: [{ f: 0, v: "cansado" }], giro: (f) => Math.sin(f / 9) * 0.05, poses: [{ f: 0, v: "sentado" }] }}
      hud={<>
        <Bat cl={cl} x={OX + 10} y={OY - 10} pct={1} tam={1.25} zz alerta />
        <Bat cl={cl} x={ASIENTO_X(1)} y={SY} pct={4} tam={1.1} />
      </>} />
  );
};

// ---------- 2 · la semana pasada: números verdes ----------
export const P02SemanaPasada: React.FC = () => {
  const k = kDe(1.0);
  const cl = [mira(0, 1150, 640, 1.05), mira(k(2.6), 1250, 640, 1.1)];
  const pas = [sent(ABERNATHY, 3, { n: 58, edad: 72, desde: 0, seed: 2 }), sent(TEEN, 5, { n: 31, edad: 19, desde: 4, seed: 3 }), sent(SCRUBS, 7, { n: 52, edad: 44, desde: 8, seed: 11 })];
  return (
    <AbsoluteFill>
      <EnBus cl={cl} hora="manana" part="47/47" pas={pas} owen={{ caras: [{ f: 0, v: "sorpresa" }] }} />
      <AbsoluteFill style={{ background: "#e9dcc4", opacity: 0.22 }} />
      <Calendario texto="LAST WEEK" desde={0} />
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
        poses={[{ f: 0, v: { tronco: 30, pI: 88, rI: 88, pD: 92, rD: 92, hI: 25, cI: 50, hD: 35, cD: 55 } }, { f: 24, v: "sentado" }, { f: 50, v: { tronco: -4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 45, cD: 140 } }, { f: 70, v: "sentado" }]}
        asiento={[{ f: 0, v: 110 }]} caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: { x: 0.6, y: 0.2 } }]} />}
      hud={<><Pildora texto="WEEK 2" x={960} y={950} desde={6} color="#ffd27a" /><HudOwen min={312} part={null} /></>} />
  );
};

// ---------- 4 · cocina: el número de Rosa se va y aparece una batería: 91 % ----------
export const P04Rosa: React.FC = () => {
  const f = useF();
  const k = kDe(5.5);
  const cl = [mira(0, 640, P - 250, 1.35), mira(k(9.9), 480, P - 290, 1.9, { curva: "inout" }), mira(k(16.0), 450, P - 300, 2.2, { curva: "inout" })];
  const rev = Array.from({ length: 12 }).map((_, i) => ({ f: i * 18, v: { hD: 55 + (i % 2) * 18, cD: 60 - (i % 2) * 20 } }));
  const sale = k(8.0);
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={4} setProps={{ hora: "alba", luzBaño: false }}
      medio={<>
        <Actor look={ROSA} escala={ESC} seed={5} ruta={[{ f: 0, x: ROSA_COCINA, y: P }]} dir={[{ f: 0, v: -1 }]} poses={rev} caras={[{ f: 0, v: "feliz" }]} habla={[[0, 400]]} />
        <Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: 860, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "parado" }, { f: k(12.0), v: "manosCara" }, { f: k(13.4), v: "parado" }]} caras={[{ f: 0, v: "cansado" }, { f: k(8.6), v: "sorpresa" }]} />
      </>}
      hud={<>
        {f < sale + 10 && <Etq cl={cl} x={ROSA_COCINA} y={P - 300} n={64} desde={-30} hasta={sale + 10} tam={70} />}
        <Bat cl={cl} x={ROSA_COCINA} y={P - 300} pct={[{ f: k(9.9), v: 0 }, { f: k(16.2), v: 91 }]} desde={k(9.9)} />
        <Mano texto="like the one on a phone" x={1380} y={250} desde={k(12.4)} hasta={k(16.0)} color="#ffd27a" tam={58} />
        <HudOwen min={313} part={null} />
      </>} />
  );
};

// ---------- 5 · el espejo: batería roja, 38 % ----------
export const P05Espejo: React.FC = () => {
  const k = kDe(17.42);
  const ESP = TF_PUNTOS.espejo;
  const cl = [mira(0, 1000, A - 240, 1.7), mira(k(20.0), 1080, A - 300, 2.5, { curva: "inout" })];
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={5} setProps={{ hora: "alba", luzBaño: true }}
      medio={<>
        <defs><clipPath id="esp2"><rect x={ESP - 80} y={A - 410} width={160} height={180} rx={10} /></clipPath></defs>
        <g clipPath="url(#esp2)">
          <rect x={ESP - 80} y={A - 410} width={160} height={180} fill="#cfe0e4" />
          <Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: ESP + 30, y: A }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "cansado" }, { f: k(21.7), v: "miedo" }]} />
          <rect x={ESP - 80} y={A - 410} width={160} height={180} fill="#aac6cf" opacity={0.22} />
        </g>
        <Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: TF_PUNTOS.puertaBaño - 60, y: A }, { f: k(19.0), x: ESP - 150, y: A }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "cansado" }, { f: k(21.7), v: "miedo" }]} />
      </>}
      hud={<>
        <Bat cl={cl} x={ESP + 30} y={A - 330} pct={38} desde={k(19.8)} tam={0.9} />
        <Pildora texto="5:15 AM · HE HASN'T DONE ANYTHING YET" x={960} y={950} desde={k(22.2)} color="#f4efe4" />
        <HudOwen min={315} part={null} />
      </>} />
  );
};

// ---------- 6 · semana 2 de Halden ----------
export const P06Semana: React.FC = () => {
  const k = kDe(26.04);
  return (
    <AbsoluteFill>
      <Pizarra><g /></Pizarra>
      <Mano texto="WEEK 2" x={960} y={330} desde={0} color="#f4efe4" tam={170} />
      <Pildora texto="PARTICIPANT 47" x={960} y={620} desde={k(28.2)} color={ROJO_OWEN} />
      <Pildora texto="ONLY 46 STILL IN THE TRIAL" x={960} y={720} desde={k(29.5)} color={VERDE} />
      <Mano texto="every week, one new change" x={960} y={820} desde={k(31.3)} hasta={k(33.4)} color="#ffd27a" tam={62} />
      <Mano texto="...on the outside." x={960} y={820} desde={k(34.2)} color={ROJO_OWEN} tam={70} />
      <HudOwen part={PART} />
    </AbsoluteFill>
  );
};

export const P07Combustible: React.FC = () => { const k = kDe(35.86); return <AbsoluteFill><Combustible dHigado={k(40.3)} dMusculo={k(43.9)} dCerebro={k(46.2)} /><HudOwen part={PART} /></AbsoluteFill>; };
export const P08Adenosina: React.FC = () => { const k = kDe(53.04); return <AbsoluteFill><Adenosina llenaHasta={k(61.8)} vaciaDesde={k(61.9)} vaciaHasta={k(63.3)} owenDesde={k(63.3)} /><HudOwen part={PART} /></AbsoluteFill>; };

// ---------- 9 · garaje: Tiny 62 % con la dona → 70 → 60 ----------
export const P09Tiny: React.FC = () => {
  const k = kDe(66.2);
  const muerde = [k(72.0), k(73.0), k(74.0)];
  const cl = [mira(0, 700, GAR_PISO - 300, 1.15), mira(k(69.0), 480, GAR_PISO - 330, 1.9, { curva: "inout" })];
  return (
    <Escena Set={Garaje} pal={PAL} claves={cl} seed={9} setProps={{ hora: "alba" }}
      medio={<>
        <Actor look={TINY} escala={ESC * 1.1} seed={7} ruta={[{ f: 0, x: GAR_PUNTOS.ventanilla, y: GAR_PISO }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: { hD: 40, cD: 100 } }, ...muerde.flatMap((m) => [{ f: m - 6, v: { hD: 70, cD: 140 } }, { f: m + 6, v: { hD: 40, cD: 100 } }])]} caras={[{ f: 0, v: "feliz" }, { f: k(75.6), v: "cansado" }]} habla={muerde.map((m) => [m - 4, m + 4] as [number, number])}
          enManoD={(ff: number) => (ff < k(75.0) ? <Dona /> : null)} />
        <MostradorDespacho />
        <Actor look={OWEN} escala={ESC} seed={6} ruta={[{ f: 0, x: 1250, y: GAR_PISO }, { f: k(69.0), x: GAR_PUNTOS.mostrador + 120, y: GAR_PISO }]} caras={[{ f: 0, v: "cansado" }, { f: k(74.4), v: "duda" }]} miradas={[{ f: 0, v: { x: -1, y: 0 } }]} />
      </>}
      hud={<>
        <Bat cl={cl} x={GAR_PUNTOS.ventanilla} y={GAR_PISO - 370} pct={[{ f: k(72.4), v: 62 }, { f: k(73.6), v: 70 }, { f: k(75.6), v: 70 }, { f: k(77.6), v: 60 }]} desde={k(68.5)} />
        <Calendario texto="+10 MIN" desde={k(75.5)} hasta={k(78)} />
        <Mano texto="fast sugar. fast drop." x={1320} y={820} desde={k(77.8)} color="#ffd27a" tam={66} />
        <HudOwen min={340} part={PART} />
      </>} />
  );
};

// ---------- 10 · la ruta 9 por fuera ----------
export const P10Ruta: React.FC = () => {
  const f = useF();
  const bx = (ff: number) => 400 + ff * 15;
  const cam = (ff: number) => 1300 + ff * 4;
  const cl = [mira(0, cam(0), 820, 0.6), mira(60, cam(60), 820, 0.6)];
  return (
    <Escena Set={Ashland} pal={PAL} claves={cl} seed={10} setProps={{ hora: "alba", centro: cam, paradas: [{ x: 2600, num: 1, refugio: true }] }}
      medio={<Bus9 x={bx(f)} y={ASH_CARRIL} esc={0.62} dir={1} hora="alba" rueda={f * 9} />}
      hud={<><Pildora texto="ROUTE 9 · ASHLAND AVENUE · FIRST STOP" x={960} y={950} desde={0} color="#ffb02e" /><HudOwen min={345} part={PART} /></>} />
  );
};

// ---------- 11 · un muro de baterías: chicos 80-90, cuadrilla 70 con termos ----------
export const P11Muro: React.FC = () => {
  const k = kDe(81.56);
  const cl = [mira(0, 1100, 640, 1.0), mira(k(84.2), 1050, 640, 1.35, { curva: "inout" }), mira(k(87.4), 1900, 640, 1.3, { curva: "inout" })];
  const pas: Pas[] = [
    sent(NENE, 1, { seed: 21, caras: [{ f: 0, v: "feliz" }] }), sent(ESTUDIANTE, 2, { seed: 22, caras: [{ f: 0, v: "risa" }] }), parado(NENE, 1240, { seed: 23, caras: [{ f: 0, v: "feliz" }] }),
    parado(OBRERO, 1840, { seed: 24, enManoD: <Termo /> }), parado(OBRERO, 2040, { seed: 25, enManoD: <Termo />, caras: [{ f: 0, v: "cansado" }] }), sent(OBRERO, 8, { seed: 26, enManoD: <Termo /> }),
  ];
  return (
    <EnBus cl={cl} hora="manana" min={362} avance={(f) => 1000 + f * 12} pas={pas} owen={{ caras: [{ f: 0, v: "sorpresa" }] }}
      hud={<>
        <Bat cl={cl} x={ASIENTO_X(1)} y={SY + 40} pct={92} desde={k(84.3)} />
        <Bat cl={cl} x={ASIENTO_X(2)} y={SY} pct={86} desde={k(84.7)} />
        <Bat cl={cl} x={1240} y={PY + 70} pct={95} desde={k(85.1)} />
        <Bat cl={cl} x={1840} y={PY} pct={74} desde={k(89.6)} />
        <Bat cl={cl} x={2040} y={PY} pct={71} desde={k(90.0)} />
        <Bat cl={cl} x={ASIENTO_X(8)} y={SY} pct={77} desde={k(90.4)} />
        <Pildora texto="47TH STREET" x={960} y={950} desde={k(87.4)} color="#f4efe4" />
        <HudOwen part={PART} />
      </>} />
  );
};

// ---------- 12 · la enfermera del turno noche: 12 %, se duerme ----------
export const P12Scrubs: React.FC = () => {
  const k = kDe(91.9);
  const cl = [mira(0, 600, 650, 1.6), mira(k(95.2), 700, 640, 2.0, { curva: "inout" })];
  const sc: Pas = { look: SCRUBS, seed: 11, aparece: 0, ruta: [{ f: 0, x: BUS_PUNTOS.validador + 60, y: BUS_PISO }, { f: k(94.0), x: ASIENTO_X(1), y: BUS_PISO }], dir: [{ f: 0, v: 1 }, { f: k(94.0), v: -1 }], sentado: k(94.2), caras: [{ f: 0, v: "cansado" }, { f: k(96.2), v: "zombi" }], poses: [{ f: 0, v: "parado" }, { f: k(96.4), v: { tronco: 14, cabeza: 24, pI: 88, rI: 88, pD: 92, rD: 92, hI: 25, cI: 50, hD: 35, cD: 55 } }] };
  return (
    <EnBus cl={cl} hora="manana" min={366} avance={(f) => 3000 + f * 10} pas={[sc]} owen={{ caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: 1, y: 0 } }], giros: [{ f: 0, v: 0.4 }] }}
      hud={<>
        <Bat cl={cl} x={ASIENTO_X(1)} y={SY + 20} pct={12} desde={k(95.4)} zz={false} />
        <Bat cl={cl} x={ASIENTO_X(1) + 60} y={SY - 80} pct={12} desde={k(96.1)} hasta={k(96.1)} />
        <Pildora texto="OFF A NIGHT SHIFT" x={960} y={950} desde={k(92.6)} hasta={k(96.0)} color="#f4efe4" />
        <Mano texto="asleep before the next stop" x={1300} y={860} desde={k(96.3)} color="#f4efe4" tam={58} />
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
    <EnBus cl={cl} hora="manana" min={370} avance={(f) => 5000 + f * 8} owen={{ manos: "I", caras: [{ f: 0, v: "cansado" }, { f: abre + 10, v: "feliz" }], poses: [{ f: 0, v: "sentado" }], enManoD: <Lata color="#2fd16a" /> }}
      hud={<>
        <Bat cl={cl} x={OX} y={OY} pct={38} capa={[{ f: k(102.7), v: 0 }, { f: k(104.6), v: 17 }]} desde={0} tam={1.1} />
        <Mano texto="pssht!" x={760} y={420} desde={abre} hasta={abre + 30} color="#2fd16a" tam={80} />
        <Mano texto="38 → 55" x={1250} y={300} desde={k(103.0)} color="#ffd27a" tam={86} />
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
        <BateriaSvg pct={38} capa={17} f={f} />
      </div>
      <Mano texto="it just LOOKS full" x={960} y={180} desde={k(108.0)} color="#fff6c8" tam={70} />
      {corte > 0 && <Mano texto="underneath: the same red" x={960} y={860} desde={k(110.6)} color={ROJO_OWEN} tam={70} />}
      <HudOwen part={PART} />
    </AbsoluteFill>
  );
};

export const P15Receptores: React.FC = () => { const k = kDe(114.11); return <AbsoluteFill><Receptores tapaDesde={k(117.4)} /><HudOwen part={PART} /></AbsoluteFill>; };
export const P16MedioVida: React.FC = () => { const k = kDe(123.14); return <AbsoluteFill><MedioVida d50={k(127.8)} d25={k(130.6)} /><HudOwen part={PART} /></AbsoluteFill>; };

// ---------- 17 · Abernathy: 72 años, 88 %, banana y huevo, a la cama a las 9 ----------
export const P17Abernathy: React.FC = () => {
  const k = kDe(132.57);
  const ab: Pas = { look: ABERNATHY, seed: 2, aparece: 0, ruta: [{ f: 0, x: BUS_PUNTOS.puertaF + 40, y: BUS_PISO }, { f: k(135.5), x: BUS_PUNTOS.validador + 40, y: BUS_PISO }, { f: k(137.5), x: ASIENTO_X(3), y: BUS_PISO }], dir: [{ f: 0, v: 1 }, { f: k(137.5), v: -1 }], sentado: k(137.7), caras: [{ f: 0, v: "feliz" }], enManoD: <Banana />, enManoI: <Bolsa />, habla: [[k(142.9), k(146.6)]] };
  const cl = [mira(0, 560, 650, 1.5), mira(k(136.0), 900, 650, 1.6, { curva: "inout" }), mira(k(142.8), 760, 640, 1.45, { curva: "inout" })];
  return (
    <EnBus cl={cl} hora="manana" min={380} avance={() => 6000} puertaF={() => 1} paradas={[{ a: 6000, num: 4 }]} pas={[ab]} owen={{ caras: [{ f: 0, v: "feliz" }], giros: [{ f: 0, v: 0.6 }], miradas: [{ f: 0, v: { x: 1, y: 0 } }] }}
      hud={<>
        <Etq cl={cl} x={(ff) => (ff < k(137.5) ? interpolate(ff, [0, k(135.5), k(137.5)], [BUS_PUNTOS.puertaF + 40, BUS_PUNTOS.validador + 40, ASIENTO_X(3)], { extrapolateRight: "clamp" }) : ASIENTO_X(3))} y={-9999} n={0} desde={1e9} />
        <Bat cl={cl} x={ASIENTO_X(3)} y={SY} pct={88} desde={k(136.4)} />
        <Pildora texto="STOP 4 · MR. ABERNATHY · 72" x={960} y={950} desde={k(133.6)} hasta={k(141)} color="#f4efe4" />
        <Pildora texto="IN BED BY 9 PM. EVERY NIGHT." x={960} y={950} desde={k(141.1)} color="#ffd27a" />
        <Globo texto="Coffee after noon is for people who don't want to sleep." x={1100} y={300} desde={k(142.9)} hasta={k(146.7)} cola="abajo" tam={38} />
        <HudOwen min={382} part={PART} />
      </>} />
  );
};

// ---------- 18 · Café 18: Lena al 4 %, seis bebidas a la vez ----------
const CAFE = 1700;
const CafeEsc: React.FC<{ cl: ReturnType<typeof mira>[]; t0: number; children?: React.ReactNode; hud?: React.ReactNode; owenRuta?: { f: number; x: number; y: number }[]; lenaCaras?: { f: number; v: string }[]; lenaHabla?: [number, number][]; owenHabla?: [number, number][]; owenPoses?: { f: number; v: string | Record<string, number> }[] }> = ({ cl, children, hud, owenRuta, lenaCaras, lenaHabla, owenHabla, owenPoses }) => {
  const f = useF();
  const LX = CAFE + 640;
  const prep = Array.from({ length: 20 }).map((_, i) => ({ f: i * 14, v: i % 2 ? { hD: 80, cD: 30, hI: 60, cI: 50 } : { hD: 50, cD: 70, hI: 90, cI: 20 } }));
  return (
    <Escena Set={Ashland} pal={PAL} claves={cl} seed={18} setProps={{ hora: "manana", centro: () => 1500, cafe: CAFE, paradas: [{ x: 1000, num: 18, refugio: true }], autos: 2 }}
      medio={<>
        <Actor look={LENA} escala={ESC * 0.8} seed={4} ruta={[{ f: 0, x: LX, y: ASH_PISO - 30 }]} dir={[{ f: 0, v: -1 }]} poses={prep} caras={lenaCaras ?? [{ f: 0, v: "feliz" }]} habla={lenaHabla} />
        {[0, 1, 2, 3, 4, 5].map((i) => <g key={i} transform={`translate(${CAFE + 380 + i * 70},${ASH_PISO - 160})`}><Taza vapor={1} f={f + i * 7} /></g>)}
        <g><rect x={CAFE + 60} y={ASH_PISO - 150} width={980} height={150} fill="#6a4630" /><rect x={CAFE + 50} y={ASH_PISO - 160} width={1000} height={18} rx={4} fill="#e9dcc4" /></g>
        <Actor look={OWEN} escala={ESC * 0.8} seed={1} ruta={owenRuta ?? [{ f: 0, x: CAFE + 420, y: ASH_PISO + 20 }]} dir={[{ f: 0, v: 1 }]} poses={owenPoses ?? [{ f: 0, v: "parado" }]} caras={[{ f: 0, v: "duda" }]} habla={owenHabla} />
        {children}
      </>}
      hud={<>{hud}<Bat cl={cl} x={LX} y={ASH_PISO - 30 - 270} pct={4} desde={-10} tam={1.3} /><HudOwen min={555} part={PART} /></>} />
  );
};
export const P18Cafe: React.FC = () => {
  const k = kDe(146.69);
  const cl = [mira(0, 1450, ASH_PISO - 250, 0.72), mira(k(149.6), CAFE + 540, ASH_PISO - 260, 1.4, { curva: "inout" }), mira(k(153.9), CAFE + 600, ASH_PISO - 300, 1.9, { curva: "inout" })];
  return (
    <CafeEsc cl={cl} t0={146.69} owenRuta={[{ f: 0, x: 1000, y: ASH_PISO + 40 }, { f: k(151.5), x: CAFE + 420, y: ASH_PISO + 20 }]} lenaCaras={[{ f: 0, v: "risa" }, { f: k(156), v: "feliz" }, { f: k(157.5), v: "risa" }]} lenaHabla={[[k(156.5), k(159)]]}
      hud={<>
        <Pildora texto="STOP 18 · CAFÉ 18" x={960} y={950} desde={0} hasta={k(152.8)} color="#f4efe4" />
        <Pildora texto="LENA · 6 DRINKS AT ONCE · STILL SMILING" x={960} y={950} desde={k(154.2)} color="#ffd27a" />
      </>} />
  );
};
export const P19Lena: React.FC = () => {
  const k = kDe(159.84);
  const cl = [mira(0, CAFE + 540, ASH_PISO - 270, 1.6), mira(k(169.6), CAFE + 470, ASH_PISO - 250, 1.75, { curva: "inout" })];
  const f = useF();
  const deja = k(170.4);
  return (
    <CafeEsc cl={cl} t0={159.84} lenaCaras={[{ f: 0, v: "feliz" }, { f: k(161.4), v: "risa" }, { f: k(164), v: "feliz" }]} lenaHabla={[[k(161.4), k(167.8)]]} owenHabla={[[0, k(161.3)]]}
      owenPoses={[{ f: 0, v: "parado" }, { f: deja - 10, v: { hD: 80, cD: 10 } }, { f: deja + 14, v: "parado" }]}
      hud={<>
        <Globo texto="You okay?" x={1000} y={330} desde={0} hasta={k(161.4)} cola="abajo" tam={42} />
        <Globo texto="Great! Just did a double." x={1250} y={250} desde={k(161.4)} hasta={k(163.8)} cola="abajo" tam={42} />
        <Pildora texto="CLOSING LAST NIGHT" x={420} y={250} desde={k(163.8)} color="#f4efe4" />
        <Pildora texto="OPENING THIS MORNING" x={420} y={340} desde={k(165.0)} color="#f4efe4" />
        <Pildora texto="CHEM EXAM TONIGHT" x={420} y={430} desde={k(166.4)} color="#ffd27a" />
        <Mano texto="4% and still going." x={960} y={880} desde={k(167.9)} hasta={k(169.6)} color={ROJO_OWEN} tam={70} />
        <Mano texto="biggest tip of his life. won't help at all." x={960} y={880} desde={k(170.0)} color="#f4efe4" tam={58} />
        {f > deja && f < deja + 40 && <div style={{ position: "absolute", left: 1010, top: 610 + (f - deja) * 2, width: 70, height: 36, background: "#7ac943", borderRadius: 4, transform: "rotate(-12deg)", border: "3px solid #3a6a20" }} />}
      </>} />
  );
};

// ---------- 20 · 10:30, el bus tranquilo, se le va el efecto: 41 % ----------
export const P20Quieto: React.FC = () => {
  const k = kDe(173.28);
  const cl = [mira(0, 640, 650, 1.3), mira(k(176.0), 360, BUS_PISO - 280, 2.3, { curva: "inout" })];
  return (
    <EnBus cl={cl} hora="dia" min={630} avance={(f) => 9000 + f * 8} pas={[sent(SENORA, 5, { seed: 31, caras: [{ f: 0, v: "cansado" }] })]} owen={{ caras: [{ f: 0, v: "neutral" }, { f: k(176.4), v: "cansado" }] }}
      hud={<>
        <Bat cl={cl} x={OX} y={OY} pct={[{ f: 0, v: 50 }, { f: k(176.96), v: 41 }]} capa={[{ f: 0, v: 8 }, { f: k(176.4), v: 0 }]} />
        <Pildora texto="10:30 AM · THE BUS IS QUIET" x={960} y={950} desde={0} color="#f4efe4" />
      </>} />
  );
};

// ---------- 21 · 2 PM: todas las baterías caen a la vez ----------
export const P21Caida: React.FC = () => {
  const k = kDe(178.25);
  const cl = [mira(0, 1250, 640, 1.0), mira(k(186.8), 1450, 640, 1.08, { curva: "inout" }), mira(k(189.8), 420, BUS_PISO - 270, 2.2, { curva: "inout" })];
  const gente: [Pas, number, number][] = [
    [sent(NENE, 2, { seed: 41, caras: [{ f: 0, v: "feliz" }, { f: k(183.7), v: "cansado" }] }), 84, 76],
    [sent(OFICINISTA, 4, { seed: 42, caras: [{ f: 0, v: "neutral" }, { f: k(184.3), v: "cansado" }] }), 63, 55],
    [parado(OBRERO, 1520, { seed: 43, enManoD: <Termo />, caras: [{ f: 0, v: "neutral" }, { f: k(184.3), v: "cansado" }] }), 70, 61],
    [sent(SENORA, 7, { seed: 44, enManoD: <BolsaCompras />, caras: [{ f: 0, v: "feliz" }, { f: k(185.1), v: "cansado" }] }), 58, 51],
    [sent(SENORA, 8, { seed: 45, enManoD: <BolsaCompras />, caras: [{ f: 0, v: "neutral" }, { f: k(185.1), v: "cansado" }] }), 66, 57],
  ];
  const caida = (a: number, b: number) => [{ f: k(180.8), v: a }, { f: k(189.7), v: b }];
  return (
    <EnBus cl={cl} hora="tarde" min={(f) => 840 + Math.round(f / 30)} avance={(f) => 12000 + f * 10} pas={gente.map((g) => g[0])} owen={{ caras: [{ f: 0, v: "cansado" }, { f: k(189.8), v: "duda" }], miradas: [{ f: 0, v: { x: 0.4, y: -0.6 } }] }}
      hud={<>
        {gente.map(([p, a, b], i) => <Bat key={i} cl={cl} x={p.ruta[0].x} y={p.sentado !== undefined ? SY : PY} pct={caida(a, b)} desde={k(179.0) + i * 3} />)}
        <Bat cl={cl} x={OX} y={OY} pct={caida(30, 22)} desde={0} />
        <Pildora texto="2 PM · EVERYONE DROPS" x={960} y={950} desde={k(180.8)} hasta={k(189.6)} color="#ffd27a" />
        <Mano texto="is the power broken?" x={1250} y={820} desde={k(189.9)} color="#f4efe4" tam={62} />
      </>} />
  );
};

export const P22Bajon: React.FC = () => { const k = kDe(192.07); return <AbsoluteFill><BajonTarde pozoDesde={k(197.0)} /><Mano texto="sleepy-driver crashes peak here" x={960} y={980} desde={k(199.4)} color="#ffd27a" tam={58} /><HudOwen part={PART} /></AbsoluteFill>; };

// ---------- 23 · Owen es chofer, y está al 19 % ----------
export const P23Chofer: React.FC = () => {
  const k = kDe(202.99);
  const cl = [mira(0, 600, 640, 1.5), mira(k(205.4), 330, BUS_PISO - 280, 2.6, { curva: "inout" })];
  return (
    <EnBus cl={cl} hora="tarde" min={858} avance={(f) => 14000 + f * 11} owen={{ caras: [{ f: 0, v: "cansado" }], giro: (f) => Math.sin(f / 14) * 0.08 }}
      hud={<>
        <Bat cl={cl} x={OX} y={OY} pct={[{ f: 0, v: 22 }, { f: k(207.0), v: 19 }]} tam={1.1} />
        <Mano texto="the battery stops being funny" x={1250} y={330} desde={k(203.2)} hasta={k(205.3)} color="#f4efe4" tam={58} />
        <Pildora texto="OWEN IS A DRIVER" x={960} y={950} desde={k(205.4)} color={ROJO_OWEN} />
        <Pildora texto="What's YOUR battery at 2 PM? Comment it ↓" x={960} y={170} desde={k(203.4)} color={VERDE} />
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
    <EnBus cl={cl} hora="tarde" min={872} avance={avance} puertaF={puertaF} paradas={[{ a: 16000, num: 30 }]} pas={[ab]} owen={{ caras: [{ f: 0, v: "cansado" }, { f: k(232.0), v: "miedo" }], giros: [{ f: 0, v: 0.5 }], miradas: [{ f: 0, v: { x: 1, y: 0.2 } }] }}
      hud={<>
        <Pildora texto="STOP 30 · 2:40 PM" x={960} y={950} desde={0} hasta={k(233)} color="#f4efe4" />
        <Pildora texto="HALDEN CLINIC" x={960} y={950} desde={k(236.2)} color="#6fa8ff" />
        <Mano texto="last week: no number at all" x={1250} y={250} desde={k(237.0)} color="#f4efe4" tam={58} />
      </>} />
  );
};
// el abrigo sentado al fondo, en el espejo: 100 % que no se mueve (ni al sentarse, ni al frenar, ni al bostezar)
export const P27Cien: React.FC = () => {
  const f = useF();
  const k = kDe(239.33);
  const freno = k(244.4);
  const sac = f > freno && f < freno + 14 ? Math.sin((f - freno) * 2) * 12 * (1 - (f - freno) / 14) : 0;
  const cl = [mira(0, ASIENTO_X(4) - 40, BUS_PISO - 260, 1.9)];
  return (
    <AbsoluteFill style={{ transform: `translateX(${sac}px)` }}>
      <Escena Set={BusInterior} pal={PAL} claves={cl} setProps={{ hora: "tarde" }}
        medio={<Actor look={ABRIGO} escala={ESC} seed={51} ruta={[{ f: 0, x: ASIENTO_X(4), y: BUS_PISO }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "sentado" }, { f: k(245.5), v: { tronco: -8, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 140, hI: 25, cI: 50 } }, { f: k(246.6), v: "sentado" }]}
          asiento={[{ f: 0, v: BUS_PUNTOS.asiento }]} caras={[{ f: 0, v: "neutral" }, { f: k(245.5), v: "sorpresa" }, { f: k(246.6), v: "neutral" }, { f: k(246.7), v: "picaro" }]} miradas={[{ f: 0, v: { x: -1, y: -0.2 } }]} habla={[[k(245.5), k(246.4)]]} />}
        hud={<>
          <Bat cl={cl} x={ASIENTO_X(4)} y={SY} pct={100} desde={k(240.0)} tam={1.2} />
          <Pildora texto="IT DOESN'T MOVE." x={960} y={950} desde={k(241.4)} hasta={k(248.8)} color="#f4efe4" />
          <Pildora texto="not when he sits" x={1450} y={300} desde={k(243.2)} hasta={k(244.3)} color="#ffd27a" />
          <Pildora texto="not when the bus brakes" x={1450} y={300} desde={k(244.3)} hasta={k(245.5)} color="#ffd27a" />
          <Pildora texto="not when he yawns" x={1450} y={300} desde={k(245.5)} hasta={k(246.6)} color="#ffd27a" />
          <Pildora texto="OFF AT STOP 38 · LIKE LAST TIME" x={960} y={950} desde={k(248.9)} color="#f4efe4" />
          <HudOwen min={880} part={PART} />
        </>} />
      {f >= k(246.6) && f < k(248.9) && <Marco x={1300} y={640} w={560} h={320} radio={70} espejar><Escena Set={BusInterior} pal={PAL} claves={[mira(0, BUS_PUNTOS.chofer - 10, BUS_PISO - 300, 3.2)]} setProps={{ hora: "tarde" }} medio={<OwenAlVolante o={{ caras: [{ f: 0, v: "miedo" }] }} />} /></Marco>}
    </AbsoluteFill>
  );
};

// ---------- 28 · 3:20, la batería a punto de llegar a cero es la suya: 6 → 5 ----------
export const P28Suya: React.FC = () => {
  const k = kDe(251.51);
  const cl = [mira(0, 700, 640, 1.3), mira(k(254.0), 330, BUS_PISO - 290, 2.8, { curva: "inout" })];
  return (
    <EnBus cl={cl} hora="tarde" min={920} avance={(f) => 20000 + f * 11} owen={{ caras: [{ f: 0, v: "cansado" }, { f: k(256.7), v: "miedo" }, { f: k(258), v: "zombi" }] }}
      hud={<>
        <Bat cl={cl} x={OX} y={OY} pct={[{ f: k(257.5), v: 6 }, { f: k(257.8), v: 5 }]} desde={k(253.0)} tam={1.2} alerta />
        <Pildora texto="3:20 PM" x={960} y={950} desde={0} hasta={k(256.5)} color="#f4efe4" />
        <Mano texto="it's his own." x={1250} y={300} desde={k(256.7)} color={ROJO_OWEN} tam={72} />
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
  const cl = [mira(0, bx(k(262.2)) + 700, 860, 0.8), mira(k(265.3), bx(k(265.3)) + 600, 860, 0.85)];
  return (
    <AbsoluteFill>
      {!ext ? <EnBus cl={[mira(0, 330, BUS_PISO - 290, 2.8)]} hora="tarde" min={921} avance={(ff) => 21000 + ff * 11} owen={{ caras: [{ f: 0, v: "zombi" }], giro: () => 0.1 }} hud={<Bat cl={[mira(0, 330, BUS_PISO - 290, 2.8)]} x={OX} y={OY} pct={5} alerta tam={1.2} />} />
        : <Escena Set={Ashland} pal={PAL} claves={cl} seed={29} setProps={{ hora: "tarde", centro: (ff: number) => bx(ff) + 650, autos: 0 }}
          medio={<g transform={`rotate(${-interpolate(f, [k(262.2), k(265.3)], [0, 2.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} ${bx(f) + 1000} ${by(f)})`}><Bus9 x={bx(f)} y={by(f)} esc={0.62} dir={1} hora="tarde" rueda={f * 9} /></g>}
          hud={<><Pildora texto="DRIFTING TOWARD THE PARKED CARS" x={960} y={950} desde={k(262.4)} color={ROJO_OWEN} /><HudOwen min={921} part={PART} /></>} />}
      <AbsoluteFill style={{ background: "#000", opacity: cierra }} />
      {cierra > 0.6 && <div style={{ position: "absolute", left: 0, right: 0, top: 500, textAlign: "center", fontFamily: F_HUD, fontWeight: 700, fontSize: 120, color: "#f4efe4", transform: `scale(${1 + 0.04 * Math.sin(f / 3)})` }}>1 second... 2...</div>}
    </AbsoluteFill>
  );
};

// ---------- 30 · frena fuerte, ruedan las compras ----------
export const P30Frena: React.FC = () => {
  const f = useF();
  const k = kDe(265.35);
  const sac = f < 16 ? Math.sin(f * 2.2) * 26 * (1 - f / 16) : 0;
  const cl = [mira(0, 1000, 650, 1.1), mira(k(266.5), 1250, 720, 1.4, { curva: "inout" })];
  const rueda = (i: number) => { const t = Math.max(0, f - k(266.45) - i * 4); return { x: 1700 - t * (9 - i), y: BUS_PISO - 18 - Math.abs(Math.sin(t / 5)) * 8 * Math.exp(-t / 40), r: t * (12 - i) }; };
  return (
    <AbsoluteFill style={{ transform: `translate(${sac}px,${sac * 0.3}px)` }}>
      <EnBus cl={cl} hora="tarde" min={922} avance={() => 22000} pas={[sent(SENORA, 7, { seed: 44, caras: [{ f: 0, v: "miedo" }, { f: k(268.3), v: "neutral" }] }), sent(ESTUDIANTE, 4, { seed: 22, caras: [{ f: 0, v: "miedo" }] })]} owen={{ caras: [{ f: 0, v: "miedo" }] }}
        medio={<>{[0, 1, 2, 3].map((i) => { const p = rueda(i); return <circle key={i} cx={p.x} cy={p.y} r={16} fill={i % 2 ? "#ff8a2a" : "#7ac943"} stroke="#00000033" strokeWidth={3} />; })}</>}
        hud={<Pildora texto="NOBODY'S HURT" x={960} y={950} desde={k(268.2)} color={VERDE} />} />
    </AbsoluteFill>
  );
};

// ---------- 31 · micro-sueño: el nombre ----------
export const P31Micro: React.FC = () => {
  const f = useF();
  const k = kDe(269.13);
  const parpado = (ff: number) => { const t = (ff - k(272.3)) % 60; return ff < k(272.3) ? 0 : t < 30 ? Math.min(1, t / 6) : Math.max(0, 1 - (t - 30) / 6); };
  const p = parpado(f);
  return (
    <AbsoluteFill>
      <Pizarra titulo="MICRO-SLEEP">
        <g transform="translate(960,560)">
          <ellipse rx={300} ry={160} fill="#f4efe4" />
          <circle r={110} fill="#3a6a9a" /><circle r={50} fill="#111" />
          <path d={`M-310,0 Q0,${-170 + 340 * p} 310,0 L310,-200 L-310,-200 Z`} fill="#c98a6a" />
          <path d={`M-310,0 Q0,${-170 + 340 * p} 310,0`} fill="none" stroke="#2a1a14" strokeWidth={12} />
        </g>
      </Pizarra>
      <Mano texto="1-2 seconds. your brain just switches off." x={960} y={860} desde={k(272.3)} color="#ffd27a" tam={60} />
      <Mano texto="you often don't even notice." x={960} y={960} desde={k(275.6)} color="#f4efe4" tam={58} />
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
  const cl = [mira(0, 700, 650, 1.1), mira(k(283.2), lx, BUS_PISO - 200, 1.7, { curva: "inout" }), mira(k(287.4), lx + 40, BUS_PISO - 230, 2.3, { curva: "inout" })];
  const min = f < acuesta ? 1000 : f < despierta ? 1000 + Math.round(interpolate(f, [acuesta, despierta], [0, 20])) : 1020;
  return (
    <EnBus cl={cl} hora="tarde" min={min} avance={() => 30000} owen={f < k(282.6) ? { caras: [{ f: 0, v: "cansado" }] } : null}
      medio={f >= k(282.6) && <g transform={f >= acuesta ? `rotate(-82 ${lx} ${BUS_PISO - 150})` : undefined}>
        <Actor look={OWEN} escala={ESC} seed={1} ruta={[{ f: 0, x: f >= acuesta ? lx : ASIENTO_X(10), y: f >= acuesta ? BUS_PISO - 150 : BUS_PISO }]} dir={[{ f: 0, v: 1 }]}
          caras={[{ f: 0, v: "cansado" }, { f: despierta, v: "sorpresa" }, { f: despierta + 30, v: "feliz" }]} poses={[{ f: 0, v: "parado" }]} />
      </g>}
      hud={<>
        <Pildora texto="95TH STREET · END OF THE LINE · 25 MIN LAYOVER" x={960} y={950} desde={0} hasta={k(283.2)} color="#f4efe4" />
        {f >= acuesta && f < despierta && <Pildora texto="⏰ 20 MIN" x={960} y={950} desde={acuesta} color="#ffd27a" />}
        <Bat cl={cl} x={lx + 60} y={BUS_PISO - 250} tam={1.3} pct={[{ f: acuesta, v: 4 }, { f: despierta, v: 40 }]} desde={acuesta} zz={f < despierta} />
        <Mano texto="something he's never done" x={1250} y={250} desde={k(281.7)} hasta={k(284.3)} color="#f4efe4" tam={58} />
      </>} />
  );
};

export const P33Nasa: React.FC = () => { const k = kDe(289.33); return <AbsoluteFill><SiestaNasa dAlerta={k(300.6)} /><HudOwen part={PART} /></AbsoluteFill>; };

// ---------- 34 · maneja el resto al 40 %: despacio, con cuidado ----------
export const P34Despacio: React.FC = () => {
  const f = useF();
  const bx = (ff: number) => 600 + ff * 6;
  const cl = [mira(0, 1500, 820, 0.62), mira(130, 1700, 820, 0.62)];
  return (
    <Escena Set={Ashland} pal={PAL} claves={cl} seed={34} setProps={{ hora: "tarde", centro: (ff: number) => 1500 + ff * 1.5 }}
      medio={<Bus9 x={bx(f)} y={ASH_CARRIL} esc={0.62} dir={1} hora="tarde" rueda={f * 4} />}
      hud={<><Bat cl={cl} x={bx(f) + 1700} y={ASH_CARRIL - 560} pct={40} tam={1.7} /><Pildora texto="SLOW. CAREFUL." x={960} y={950} desde={45} color={VERDE} /><HudOwen min={1040} part={PART} /></>} />
  );
};

// ---------- 35 · Rosa a la tarde: 81 años, 65 % a las 6 ----------
export const P35Rosa: React.FC = () => {
  const k = kDe(311.79);
  const cl = [mira(0, 650, P - 250, 1.4), mira(k(327.8), 640, P - 250, 1.45)];
  const cose = Array.from({ length: 24 }).map((_, i) => ({ f: i * 16, v: { tronco: -4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 60 + (i % 2) * 14, cD: 70 - (i % 2) * 20, hI: 40, cI: 60 } }));
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={35} setProps={{ hora: "tarde", luzBaño: false }}
      medio={<>
        <Actor look={ROSA} escala={ESC} seed={5} ruta={[{ f: 0, x: TF_PUNTOS.sillaRosa, y: P }]} dir={[{ f: 0, v: 1 }]} poses={cose} asiento={[{ f: 0, v: 110 }]} caras={[{ f: 0, v: "feliz" }]} />
        <Actor look={OWEN} escala={ESC} seed={6} ruta={[{ f: 0, x: TF_PUNTOS.sillaOwen, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "sentado" }]} asiento={[{ f: 0, v: 110 }]} caras={[{ f: 0, v: "cansado" }, { f: k(327.8), v: "triste" }]} />
      </>}
      hud={<>
        <Bat cl={cl} x={TF_PUNTOS.sillaRosa} y={P - 250} pct={[{ f: 0, v: 66 }, { f: k(327.7), v: 65 }]} desde={k(314.6)} />
        <Bat cl={cl} x={TF_PUNTOS.sillaOwen} y={P - 250} pct={[{ f: 0, v: 24 }, { f: k(329.8), v: 18 }]} desde={k(327.8)} />
        <Pildora texto="ROSA · 81 · 65% AT 6 PM" x={960} y={950} desde={k(314.6)} hasta={k(319)} color="#f4efe4" />
        {[["a walk in the morning", 316.9], ["real food, regular times", 319.1], ["water, not soda", 320.9], ["a nap after lunch", 322.1], ["in bed by 9:30", 323.3]].map(([t, a], i) => (
          <Mano key={i} texto={t as string} x={1450} y={180 + i * 100} desde={k(a as number)} hasta={k(327.6)} color="#ffd27a" tam={52} />
        ))}
        <Mano texto="spent on purpose" x={500} y={250} desde={k(325.2)} color={VERDE} tam={60} />
        <Mano texto="Owen: a hole in a bucket" x={960} y={880} desde={k(327.9)} color={ROJO_OWEN} tam={64} />
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
      <Escena Set={TwoFlatCorte} pal={PAL} claves={[mira(0, 380, A - 200, 2.0)]} seed={36} setProps={{ hora: "noche", luzCocina: false, luzBaño: false, luzDorm: false }}
        medio={<Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: TF_PUNTOS.cama + 140, y: A }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "celular" }]} asiento={[{ f: 0, v: 110 }]} caras={[{ f: 0, v: "cansado" }]} />} />
      <AbsoluteFill style={{ background: "#05070d", opacity: 0.55 }} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <MensajeCel de="Halden Clinic · Dr. Imani Hale" texto={"Week 2 complete.\nThank you, participant 47."} extra="PARTICIPANTS 45/47" desde={k(330.3)} extraDesde={cambio} />
        {f >= preg && <g><rect x={770} y={790} width={380} height={170} rx={24} fill="#dfeaff" />{lineas.map((l, i) => <text key={i} x={790} y={832 + i * 36} fontFamily={F_HUD} fontSize={27} fill="#14203a">{l}</text>)}</g>}
      </svg>
      <Contador lineas={[{ etiqueta: "PARTICIPANTS", claves: "46/47", color: VERDE }]} tam={38} hasta={cambio} />
      <Contador lineas={[{ etiqueta: "PARTICIPANTS", claves: "45/47", color: ROJO_OWEN }]} tam={38} desde={cambio} />
      <Mano texto="another one gone" x={1460} y={900} desde={k(340.9)} hasta={k(344.5)} color="#f4efe4" tam={54} />
      <Mano texto="a question he's never been asked" x={1460} y={900} desde={k(342.2)} color="#ffd27a" tam={50} />
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
      <div style={{ position: "absolute", left: x, top: 330 + (1 - e) * 60, width: 460, height: 420, marginLeft: -230, opacity: e, background: "rgba(14,20,40,0.85)", border: `6px solid ${col}`, borderRadius: 30, textAlign: "center", fontFamily: F_HUD }}>
        <div style={{ marginTop: 60, display: "inline-block" }}><BateriaSvg pct={pct} f={f} tam={1.4} alerta={pct < 8} /></div>
        <div style={{ marginTop: 40, fontSize: 40, fontWeight: 600, color: "#f4efe4", padding: "0 20px" }}>{t}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Escena Set={TwoFlatCorte} pal={PAL} claves={[mira(0, 380, A - 200, 2.0)]} seed={37} setProps={{ hora: "noche", luzCocina: false, luzBaño: false, luzDorm: false }}
        medio={<Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: TF_PUNTOS.cama + 140, y: A }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "pensar" }]} asiento={[{ f: 0, v: 110 }]} caras={[{ f: 0, v: "triste" }]} />} />
      <AbsoluteFill style={{ background: "#05070d", opacity: 0.6 }} />
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
  return (
    <AbsoluteFill style={{ background: "#0a0e18" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
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
        <rect x={720} y={900} width={480} height={200} rx={20} fill="#1a2234" />
      </svg>
      <Pildora texto="SENT" x={960} y={980} desde={k(358.6)} color="#6fa8ff" />
      <HudOwen part="45/47" />
    </AbsoluteFill>
  );
};

// ---------- 39 · la semana que viene: el cerebro no se cansa más ----------
export const P39Gancho: React.FC = () => {
  const f = useF();
  const k = kDe(359.51);
  const noche = Math.min(3, Math.floor(interpolate(f, [k(366.0), k(368.8)], [0, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })) + 1);
  const cl = [mira(0, 300, A - 200, 1.8), mira(k(368.9), 200, A - 230, 2.5, { curva: "inout" })];
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={39} setProps={{ hora: "noche", luzCocina: false, luzBaño: false, luzDorm: true }}
      medio={<Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: TF_PUNTOS.cama + 140, y: A }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "sentado" }]} asiento={[{ f: 0, v: 110 }]} caras={[{ f: 0, v: "sorpresa" }, { f: k(368.9), v: "miedo" }]} miradas={[{ f: 0, v: { x: 0, y: 0 } }]} />}
      hud={<>
        <Pildora texto="NEXT WEEK" x={960} y={170} desde={0} color="#ffd27a" />
        <Bat cl={cl} x={TF_PUNTOS.cama + 140} y={A - 360} pct={100} desde={k(360.5)} />
        <Mano texto="no yawning. no fog. no sleep." x={560} y={420} desde={k(362.2)} hasta={k(370.2)} color="#f4efe4" tam={58} />
        {f >= k(366.0) && <Calendario texto={`NIGHT ${noche}`} desde={k(366.0)} />}
        <Mano texto="why we sleep at all" x={960} y={900} desde={k(370.4)} color={ROJO_OWEN} tam={70} />
        <HudOwen min={(ff) => (1380 + Math.round(ff * 3)) % 1440} part="45/47" />
      </>} />
  );
};

// ---------- 40 · CTA final: ¿a cuánto está tu batería? ----------
export const P40Cta: React.FC = () => {
  const k = kDe(372.91);
  const cl = [mira(0, 560, 640, 1.5), mira(k(381), 600, 640, 1.62)];
  const f = useF();
  return (
    <EnBus cl={cl} hora="ocaso" part="45/47" min={1110} avance={() => 30000}
      owen={{ caras: [{ f: 0, v: "feliz" }], giros: [{ f: 0, v: 0 }, { f: 30, v: 1 }], miradas: [{ f: 0, v: { x: 0, y: 0 } }] }}
      hud={<>
        <div style={{ position: "absolute", left: 960 + (ASIENTO_X(1) - 560) * 1.5, top: 540 + (BUS_PISO - 270 - 640) * 1.5, transform: "translate(-50%,-100%) scale(1.3)", transformOrigin: "50% 100%" }}>
          <BateriaSvg pct={(f * 7) % 100} f={f} />
        </div>
        <div style={{ position: "absolute", left: 960 + (ASIENTO_X(1) - 560) * 1.5, top: 540 + (BUS_PISO - 200 - 640) * 1.5, transform: "translate(-50%,0)", fontFamily: F_HUD, fontWeight: 700, fontSize: 42, color: "#f4efe4", textShadow: "0 3px 10px rgba(0,0,0,0.7)" }}>YOU?</div>
        <Pildora texto="What's YOUR battery at right now?" x={960} y={170} desde={k(373.2)} color={VERDE} />
        <Pildora texto="TELL US IN THE COMMENTS · SUBSCRIBE FOR WEEK 3" x={960} y={960} desde={k(377.1)} color="#f4efe4" />
      </>} />
  );
};
