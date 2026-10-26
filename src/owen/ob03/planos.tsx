// ob03 · «Owen can't feel TIRED anymore» — los planos, tiempos = segundos de la voz (D:/rtmp/owena/ob03_frases.txt)
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Actor } from "../../anikit/actor";
import { Escena } from "../../anikit/escena";
import { Calendario, Contador, Globo, Pildora, F_HUD } from "../../anikit/pantalla";
import { Lata, Libro, Taza } from "../../anikit/props";
import { PAL, OWEN, OWEN_CASA, ROSA, ABERNATHY, LENA, ABRIGO, OFICINISTA, ESTUDIANTE, SENORA, TEEN, OBRERO, VERDE } from "../elenco";
import { BusInterior, BUS_PISO, BUS_PUNTOS, ASIENTO_X, Bus9 } from "../mundo/bus";
import { Ashland, ASH_PISO, ASH_CARRIL } from "../mundo/ashland";
import { SkylineChi } from "../mundo/calle";
import { TwoFlatCorte, TF_PISO, TF_ARRIBA, TF_PUNTOS, escalon } from "../mundo/twoflat";
import { MensajeCel, Pizarra } from "../ciencia";
import { Adenosina } from "../ciencia2";
import { Factura, Gardner, Glinfatico, Hipocampo, NoLaSiente, SentirVsSer } from "../ciencia3";
import { HudOwen, Marco, Mano, ManoMundo } from "../comun";
import { Bat, Cansa, Tag } from "../bateria";
import { EnBus as EnBus0, ESC, kDe, OwenAlVolante, Pas, VasoCafe } from "../ob01/base";
import { ROJO_OWEN } from "../ob01/planos1";

const P = TF_PISO, A = TF_ARRIBA;
const PART = "45/47";
const EnBus: React.FC<React.ComponentProps<typeof EnBus0>> = (p) => <EnBus0 part={PART} {...p} />;
const sent = (look: Pas["look"], fila: number, extra: Partial<Pas> = {}): Pas => ({ look, ruta: [{ f: 0, x: ASIENTO_X(fila), y: BUS_PISO }], dir: [{ f: 0, v: -1 }], sentado: 0, poses: [{ f: 0, v: "sentado" }], ...extra });
const parado = (look: Pas["look"], x: number, extra: Partial<Pas> = {}): Pas => ({ look, ruta: [{ f: 0, x, y: BUS_PISO }], dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "agarrarAlto" }], ...extra });
const OX = BUS_PUNTOS.chofer, OY = BUS_PISO - 268;
const CAMA = TF_PUNTOS.cama + 140;
// sentado en la escalera: los pies en el escalón k, la cola dos escalones más arriba
const ESC_K = 4;
const PIES = escalon(ESC_K);
const SENT_ESC = { tronco: -2, pI: 92, rI: 92, pD: 88, rD: 88 };
const CARA_ESC = { ...SENT_ESC, tronco: 8, hD: 55, cD: 130, hI: 55, cI: 130 }; // sentado, las manos en la cara

// sentado en la escalera con las manos en la cara: el cuadro 0 y el día 3
const OwenEscalera: React.FC<{ caras?: { f: number; v: string }[]; poses?: { f: number; v: string | Record<string, number> }[]; enManoD?: React.ReactNode; dir?: 1 | -1; tiembla?: number; giros?: { f: number; v: number }[]; miradas?: { f: number; v: { x: number; y: number } }[] }> = ({ caras, poses, enManoD, dir = 1, tiembla = 0, giros, miradas }) => (
  <Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: PIES.x, y: PIES.y }]} dir={[{ f: 0, v: dir }]} poses={poses ?? [{ f: 0, v: CARA_ESC }]} asiento={[{ f: 0, v: 74 }]} caras={caras ?? [{ f: 0, v: "miedo" }]} enManoD={enManoD} giros={giros} miradas={miradas}
    ajuste={tiembla ? (q, ff) => ({ ...q, hD: q.hD + Math.sin(ff * 2.9) * tiembla, hI: q.hI + Math.sin(ff * 3.3 + 1) * tiembla, cabeza: q.cabeza + Math.sin(ff * 0.21) * 3 }) : undefined} />
);
const Trastos: React.FC<{ rueda?: number }> = ({ rueda }) => {
  const f = useF();
  const e = escalon(ESC_K + 1);
  const u = rueda === undefined ? 1 : interpolate(f, [rueda, rueda + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 2) });
  return <><g transform={`translate(${e.x + 70},${e.y})`}><Taza vapor={0} /></g><g transform={`translate(${e.x + 30 + 100 * u},${e.y - 6}) rotate(${80 + 400 * u})`}><Lata color="#2f6ad1" /></g></>;
};

// ---------- 1 · cuadro 0 = la miniatura sin texto: la escalera a las 3 AM, 0 % TIRED, día 3 ----------
export const P01Mini: React.FC = () => {
  const cl = [mira(0, PIES.x + 30, PIES.y - 190, 2.4), mira(30, PIES.x + 30, PIES.y - 192, 2.45)];
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={1} setProps={{ hora: "noche", luzCocina: true, luzBaño: false, luzDorm: false }}
      medio={<><OwenEscalera tiembla={6} caras={[{ f: 0, v: "miedo" }, { f: 16, v: "cansado" }]} /><Trastos rueda={4} /></>}
      hud={<>
        <Cansa cl={cl} x={PIES.x + 10} y={PIES.y - 74 - 240} pct={0} tam={1.3} glitch />
        <Calendario texto="DAY 3" desde={0} />
        <HudOwen min={180} part={null} />
      </>} />
  );
};

// ---------- 2 · la semana pasada: casi se duerme al volante ----------
export const P02Recap: React.FC = () => {
  const f = useF();
  const cl = [mira(0, 330, BUS_PISO - 290, 2.6), mira(90, 330, BUS_PISO - 290, 2.8)];
  const despierta = 58;
  const sac = f > despierta ? Math.exp(-(f - despierta) / 8) * Math.sin((f - despierta) * 1.3) * 0.5 : 0;
  return (
    <AbsoluteFill style={{ transform: `translate(${sac * 30}px,${Math.abs(sac) * 10}px)` }}>
      <EnBus cl={cl} hora="tarde" part="46/47" min={921} avance={(ff) => 21000 + ff * 11}
        owen={{ caras: [{ f: 0, v: "zombi" }, { f: despierta, v: "miedo" }], poses: [{ f: 0, v: "sentado" }, { f: 40, v: { tronco: 6, cabeza: 34 } }, { f: despierta, v: { tronco: -8, cabeza: -10 } }, { f: despierta + 14, v: "sentado" }], giro: (ff) => (ff < despierta ? Math.sin(ff / 9) * 0.08 + (ff > 40 ? (ff - 40) * 0.01 : 0) : sac * 1.6) }}
        hud={<Bat cl={cl} x={OX} y={OY} pct={5} alerta tam={1.9} />} />
      <Calendario texto="LAST WEEK" desde={0} />
    </AbsoluteFill>
  );
};

// ---------- 3 · cuatro palabras ----------
export const P03Palabras: React.FC = () => {
  const f = useF();
  const k = kDe(4.0);
  const txt = "I never want to be tired.";
  const n = Math.max(0, Math.floor((f - k(7.6)) * 1.1));
  const zoom = interpolate(f, [0, 150], [1.0, 1.22]);
  const rebote = (d: number) => (f < d ? 0 : 1 + Math.exp(-(f - d) / 4) * Math.sin((f - d) * 0.9) * 0.25);
  const tipea = f >= k(5.4) && f < k(7.6) + 30;
  const pulgar = tipea ? Math.sin(f * 1.7) * 18 : 40;
  return (
    <AbsoluteFill style={{ background: "#0a0e18" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "55% 40%" }}>
        <rect x={660} y={60} width={600} height={1100} rx={70} fill="#111317" />
        <rect x={685} y={90} width={550} height={1050} rx={50} fill="#0f1a2c" />
        <g transform={`translate(720,200) scale(${rebote(2)})`}>
          <rect x={0} y={0} width={480} height={150} rx={24} fill="#dfeaff" />
          <text x={25} y={45} fontFamily={F_HUD} fontSize={27} fill="#14203a">Is there anything you would like</text>
          <text x={25} y={82} fontFamily={F_HUD} fontSize={27} fill="#14203a">to change about your body</text>
          <text x={25} y={119} fontFamily={F_HUD} fontSize={27} fill="#14203a">for week three?</text>
        </g>
        {f >= k(5.4) && f < k(7.6) && <g transform="translate(1080,460)">{[0, 1, 2].map((i) => <circle key={i} cx={i * 34} cy={-Math.max(0, Math.sin(f / 4 - i)) * 10} r={11} fill="#8fa8d8" />)}</g>}
        <g transform={`translate(1200,465) scale(${rebote(k(7.6))}) translate(-340,-45)`} opacity={f >= k(7.6) ? 1 : 0}>
          <rect x={0} y={0} width={340} height={90} rx={24} fill="#2f7bf6" />
          <text x={25} y={55} fontFamily={F_HUD} fontWeight={600} fontSize={34} fill="#fff">{txt.slice(0, n)}</text>
        </g>
        <rect x={700} y={760} width={520} height={300} rx={20} fill="#1b2840" />
        {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={716 + (i % 10) * 50} y={780 + Math.floor(i / 10) * 70} width={42} height={56} rx={8} fill={tipea && (Math.floor(f / 3) + i * 7) % 30 === 0 ? "#6fa8ff" : "#2c3c5c"} />)}
        <g transform={`translate(${1010 + pulgar},${900 + Math.abs(pulgar) * 0.6})`}><ellipse cx={0} cy={0} rx={52} ry={130} fill="#1a1a1a" transform="rotate(-28)" /></g>
      </svg>
      <Pildora texto="FOUR WORDS" x={960} y={980} desde={k(5.6)} color="#6fa8ff" />
      <HudOwen part="45/47" />
    </AbsoluteFill>
  );
};

// ---------- 4 · lunes 5:12: sin niebla ----------
export const P04Lunes: React.FC = () => {
  const k = kDe(9.0);
  const cl = [mira(0, 300, A - 200, 2.0), mira(k(12.0), 340, A - 210, 1.6, { curva: "inout" }), mira(k(17.0), 300, A - 220, 2.2, { curva: "inout" })];
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={4} setProps={{ hora: "noche", luzCocina: false, luzBaño: false, luzDorm: true }}
      medio={<Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: CAMA, y: A }, { f: k(19.3), x: CAMA }, { f: k(20.3), x: CAMA + 260 }]} dir={[{ f: 0, v: 1 }]}
        poses={[{ f: 0, v: { tronco: 30, pI: 88, rI: 88, pD: 92, rD: 92, hI: 25, cI: 50, hD: 35, cD: 55 } }, { f: k(10.0), v: { tronco: 22, pI: 88, rI: 88, pD: 92, rD: 92, hD: 95, cD: 5, hI: 25, cI: 50 } }, { f: k(11.0), v: "sentado" },
          { f: k(13.0), v: { tronco: 40, pI: 70, rI: 110, pD: 92, rD: 92, hD: 70, cD: 20, hI: 70, cI: 20, cabeza: 10 } }, { f: k(14.6), v: { tronco: 40, pI: 92, rI: 92, pD: 70, rD: 110, hD: 70, cD: 20, hI: 70, cI: 20, cabeza: 10 } }, { f: k(15.8), v: "sentado" },
          { f: k(16.8), v: { tronco: -6, pI: 88, rI: 88, pD: 92, rD: 92, hD: 150, cD: 20, hI: 150, cI: 20 } }, { f: k(18.6), v: "sentado" }, { f: k(19.3), v: "parado" }]}
        asiento={[{ f: 0, v: 110 }, { f: k(19.0), v: 110 }, { f: k(19.3), v: undefined }]} caras={[{ f: 0, v: "neutral" }, { f: k(11.0), v: "sorpresa" }, { f: k(14.0), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.6, y: -0.2 } }, { f: k(13.0), v: { x: 0.2, y: 0.6 } }, { f: k(16.0), v: { x: 0.6, y: -0.2 } }]} />}
      hud={<>
        <Pildora texto="MONDAY · 5:12 AM" x={960} y={950} desde={0} hasta={k(12.5)} color="#ffd27a" />
        {[["no fog", 12.6], ["no heavy head", 13.8], ["no snooze button", 15.2]].map(([t, a], i) => <Mano key={i} texto={t as string} x={560} y={260 + i * 110} desde={k(a as number)} hasta={k(16.7)} color={VERDE} tam={60} />)}
        <Mano texto="like walking out of a cold shower" x={960} y={180} desde={k(16.9)} color="#6fa8ff" tam={64} />
        <HudOwen min={312} part={PART} />
      </>} />
  );
};

// ---------- 5 · el espejo: un cerebrito y un número que no se mueve: 0 % TIRED ----------
export const P05Espejo: React.FC = () => {
  const k = kDe(20.36);
  const ESP = TF_PUNTOS.espejo;
  // se lava la cara (manos arriba y abajo), se toca la mejilla, se acerca al espejo
  const LAVA: { f: number; v: string | Record<string, number> }[] = [{ f: 0, v: "agacharse" }, ...Array.from({ length: 6 }).map((_, i) => ({ f: 8 + i * 8, v: i % 2 ? { tronco: 30, hD: 100, cD: 140, hI: 100, cI: 140 } : { tronco: 34, hD: 60, cD: 60, hI: 60, cI: 60 } })),
    { f: 60, v: "parado" }, { f: k(22.3), v: { hD: 60, cD: 150, cabeza: 6 } }, { f: k(23.8), v: "parado" }, { f: k(25.0), v: { tronco: -6, hD: 30, cD: 40, hI: 30, cI: 40 } }];
  const cl = [mira(0, 1000, A - 240, 1.8), mira(k(24.8), 1060, A - 320, 2.6, { curva: "inout" })];
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={5} setProps={{ hora: "alba", luzBaño: true }}
      medio={<>
        <defs><clipPath id="esp3"><rect x={ESP - 80} y={A - 410} width={160} height={180} rx={10} /></clipPath></defs>
        <g clipPath="url(#esp3)">
          <rect x={ESP - 80} y={A - 410} width={160} height={180} fill="#cfe0e4" />
          <Actor look={OWEN_CASA} escala={ESC} seed={6} vivo={0} ruta={[{ f: 0, x: ESP + 30, y: A }]} dir={[{ f: 0, v: -1 }]} poses={LAVA.map((q) => ({ ...q, f: q.f + 8 }))} caras={[{ f: 0, v: "feliz" }, { f: k(25.0) + 10, v: "sorpresa" }]} />
          <rect x={ESP - 80} y={A - 410} width={160} height={180} fill="#aac6cf" opacity={0.22} />
        </g>
        <Actor look={OWEN_CASA} escala={ESC} seed={6} vivo={0} ruta={[{ f: 0, x: ESP - 150, y: A }]} dir={[{ f: 0, v: 1 }]} poses={LAVA} caras={[{ f: 0, v: "feliz" }, { f: k(25.0), v: "sorpresa" }]} />
      </>}
      hud={<>
        <Cansa cl={cl} x={ESP + 30} y={A - 330} pct={0} desde={k(22.3)} tam={1.1} />
        <Mano texto="a number that won't move" x={960} y={170} desde={k(24.8)} color="#f4efe4" tam={64} />
        <HudOwen min={313} part={PART} />
      </>} />
  );
};

// los 47 del ensayo en grilla: se encienden uno por uno, el 47 (Owen) se marca, dos se apagan
const Participantes47: React.FC<{ desde: number; apaga: number; owen: number }> = ({ desde, apaga, owen }) => {
  const f = useF();
  return (
    <g transform="translate(450,440)">
      {Array.from({ length: 47 }).map((_, i) => {
        const x = (i % 16) * 68, y = Math.floor(i / 16) * 120;
        const on = f >= desde + i * 0.8;
        const fuera = (i === 11 || i === 29) && f >= apaga + (i === 29 ? 8 : 0);
        const es47 = i === 46;
        const c = fuera ? "#3a4560" : es47 && f >= owen ? ROJO_OWEN : "#f4efe4";
        const s = on ? 1 + (es47 && f >= owen ? 0.25 + Math.sin((f - owen) / 5) * 0.08 : 0) : 0;
        return <g key={i} transform={`translate(${x},${y + (fuera ? Math.min(30, (f - apaga) * 2) : 0)}) scale(${s})`} opacity={fuera ? 0.5 : 1}><circle cx={0} cy={-30} r={16} fill={c} /><rect x={-9} y={-12} width={18} height={44} rx={8} fill={c} /></g>;
      })}
    </g>
  );
};

// ---------- 6 · semana 3 ----------
export const P06Semana: React.FC = () => {
  const k = kDe(28.42);
  return (
    <AbsoluteFill>
      <Pizarra><Participantes47 desde={6} apaga={k(31.5)} owen={k(30.1)} /></Pizarra>
      <Mano texto="WEEK 3" x={960} y={170} desde={0} color="#f4efe4" tam={150} />
      <Pildora texto="PARTICIPANT 47" x={960} y={880} desde={k(30.1)} hasta={k(31.4)} color={ROJO_OWEN} />
      <Pildora texto="ONLY 45 STILL IN THE TRIAL" x={960} y={880} desde={k(31.5)} color={VERDE} />
      <HudOwen part={PART} />
    </AbsoluteFill>
  );
};

export const P07Adenosina: React.FC = () => { const k = kDe(32.98); return <AbsoluteFill><Adenosina llenaHasta={k(50.9)} vaciaDesde={k(53.3)} vaciaHasta={k(56.0)} owenDesde={1e9} /><Mano texto="what IS tiredness?" x={480} y={300} desde={k(33.5)} hasta={k(36.6)} color="#ffd27a" tam={64} /><HudOwen part={PART} /></AbsoluteFill>; };
export const P08NoSiente: React.FC = () => { const k = kDe(56.28); return <AbsoluteFill><NoLaSiente dCorte={k(60.4)} /><HudOwen part={PART} /></AbsoluteFill>; };

// ---------- 9 · el mejor lunes de su vida: se acuerda de todo ----------
export const P09Memoria: React.FC = () => {
  const k = kDe(61.78);
  const cl = [mira(0, 700, 650, 1.15), mira(k(67.4), 1700, 640, 1.4, { curva: "inout" }), mira(k(70.6), 520, 640, 1.6, { curva: "inout" })];
  const tel: Pas = sent(OFICINISTA, 7, { seed: 61, caras: [{ f: 0, v: "triste" }], poses: [{ f: 0, v: "celular" }], habla: [[k(67.4), k(70.4)]] });
  const sube: Pas = { look: ESTUDIANTE, seed: 65, ruta: [{ f: 0, x: BUS_PUNTOS.puertaF + 40, y: BUS_PISO }, { f: 40, x: BUS_PUNTOS.validador + 60, y: BUS_PISO }, { f: 70, x: BUS_PUNTOS.validador + 60, y: BUS_PISO }, { f: 120, x: ASIENTO_X(5), y: BUS_PISO }], dir: [{ f: 0, v: 1 }], sentado: 124, poses: [{ f: 0, v: "parado" }, { f: 42, v: "saludar" }, { f: 66, v: "parado" }], caras: [{ f: 0, v: "neutral" }, { f: 44, v: "feliz" }] };
  const pas = [sent(SENORA, 2, { seed: 62, caras: [{ f: 0, v: "feliz" }] }), parado(OBRERO, 1300, { seed: 63, poses: [{ f: 0, v: "agarrarAlto" }, { f: 90, v: "hablar" }, { f: 140, v: "agarrarAlto" }] }), sent(TEEN, 4, { seed: 64 }), tel, sube];
  return (
    <EnBus cl={cl} hora="manana" min={(f) => (f < k(70.6) ? 360 + Math.round(f / 60) : 600 + Math.round((f - k(70.6)) / 60))} avance={(f) => 2000 + f * 12} pas={pas} owen={{ caras: [{ f: 0, v: "feliz" }], habla: [[38, 60], [k(71.0), k(72.5)]], manos: "I", poses: [{ f: 0, v: "sentado" }, { f: 40, v: { hD: 150, cD: 30 } }, { f: 64, v: "sentado" }], giros: [{ f: 0, v: 0 }, { f: 36, v: 0.7 }, { f: 70, v: 0 }] }}
      hud={<>
        <Cansa cl={cl} x={OX} y={OY - 10} pct={0} desde={0} />
        {[["every stop", 64.0], ["every face", 64.9], ["every transfer", 66.0]].map(([t, a], i) => <Pildora key={i} texto={t as string} x={1400} y={230 + i * 80} desde={k(a as number)} hasta={k(67.3)} color={VERDE} />)}
        <Globo texto="...Biscuit won't eat. The vet says..." x={1200} y={300} desde={k(68.0)} hasta={k(70.5)} cola="abajo" tam={38} />
        <Pildora texto="4 HOURS LATER" x={960} y={950} desde={k(70.6)} color="#ffd27a" />
        <Globo texto="How's Biscuit doing?" x={760} y={330} desde={k(71.0)} hasta={k(72.7)} cola="abajo" tam={40} />
      </>} />
  );
};

// ---------- 10 · Abernathy: lo saluda por su vieja ruta de cartero ----------
export const P10Abernathy: React.FC = () => {
  const k = kDe(72.62);
  const ab: Pas = { look: ABERNATHY, seed: 2, aparece: 0, ruta: [{ f: 0, x: BUS_PUNTOS.puertaF + 40, y: BUS_PISO }, { f: k(75.0), x: BUS_PUNTOS.validador + 80, y: BUS_PISO }], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "feliz" }, { f: k(78.2), v: "sorpresa" }, { f: k(80.7), v: "duda" }], miradas: [{ f: 0, v: { x: -1, y: 0 } }], poses: [{ f: 0, v: "parado" }, { f: 10, v: "saludar" }, { f: 40, v: "parado" }, { f: k(78.2), v: "manosCara" }, { f: k(79.4), v: "pensar" }] };
  const cl = [mira(0, 520, 650, 1.5), mira(k(75.5), 420, 620, 2.0, { curva: "inout" }), mira(k(80.6), 520, 600, 2.6, { curva: "inout" })];
  return (
    <EnBus cl={cl} hora="manana" min={(f) => 601 + f / 60} avance={() => 6000} puertaF={() => 1} paradas={[{ a: 6000, num: 4 }]} pas={[ab]} owen={{ caras: [{ f: 0, v: "feliz" }], giros: [{ f: 0, v: 0.7 }], miradas: [{ f: 0, v: { x: 1, y: 0 } }], habla: [[k(75.5), k(78.0)]], manos: "I", poses: [{ f: 0, v: "sentado" }, { f: k(75.5), v: { hD: 150, cD: 30 } }, { f: k(76.6), v: "sentado" }] }}
      hud={<>
        <Cansa cl={cl} x={OX} y={OY - 10} pct={0} desde={0} />
        <Pildora texto="STOP 4" x={960} y={950} desde={0} hasta={k(75.4)} color="#f4efe4" />
        <Globo texto="Morning, Mr. Abernathy! Route 14, Bridgeport, right?" x={820} y={260} desde={k(75.5)} hasta={k(80.5)} cola="abajo" tam={36} />
        <Pildora texto="HE MENTIONED IT ONCE · 2 YEARS AGO" x={960} y={950} desde={k(78.2)} color="#ffd27a" />
      </>} />
  );
};

// ---------- 11 · Café 18: Lena y las tarjetas de química ----------
const CAFE = 1700;
const Tarjetas: React.FC<{ n?: number }> = ({ n = 4 }) => <g>{Array.from({ length: n }).map((_, i) => <rect key={i} x={-34 + i * 4} y={-24 - i * 4} width={68} height={44} rx={4} fill="#fffdf4" stroke="#c9c2b2" strokeWidth={2} />)}</g>;
export const P11Lena: React.FC = () => {
  const f = useF();
  const k = kDe(83.16);
  const LX = CAFE + 640;
  const cl = [mira(0, 1500, ASH_PISO - 320, 1.15), mira(k(85.6), CAFE + 540, ASH_PISO - 300, 1.5, { curva: "inout" }), mira(k(91.6), CAFE + 560, ASH_PISO - 300, 1.75, { curva: "inout" })];
  const baraja = Array.from({ length: 10 }).map((_, i) => ({ f: i * 14, v: i % 2 ? { hD: 90, cD: 40, hI: 60, cI: 90 } : { hD: 60, cD: 80, hI: 80, cI: 50 } }));
  return (
    <Escena Set={Ashland} pal={PAL} claves={cl} seed={11} setProps={{ hora: "manana", centro: () => 1500, cafe: CAFE, paradas: [{ x: 1000, num: 18, refugio: true }], autos: 2 }}
      medio={<>
        <Actor look={LENA} escala={ESC * 0.8} seed={4} ruta={[{ f: 0, x: LX, y: ASH_PISO - 30 }]} dir={[{ f: 0, v: -1 }]} poses={[...baraja, { f: k(88.2), v: { hD: 95, cD: 10, hI: 40, cI: 60 } }, { f: k(91.6), v: "manosCintura" }, { f: k(93.4), v: "señalar" }]}
          caras={[{ f: 0, v: "cansado" }, { f: k(88.2), v: "sorpresa" }, { f: k(91.6), v: "risa" }]} habla={[[k(91.7), k(95.4)]]} enManoD={<Tarjetas />} />
        <g><rect x={CAFE + 60} y={ASH_PISO - 150} width={980} height={150} fill="#6a4630" /><rect x={CAFE + 50} y={ASH_PISO - 160} width={1000} height={18} rx={4} fill="#e9dcc4" /></g>
        <Actor look={OWEN} escala={ESC * 0.8} seed={1} ruta={[{ f: 0, x: 1000, y: ASH_PISO + 40 }, { f: k(86.5), x: CAFE + 440, y: ASH_PISO + 20 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "parado" }, { f: k(88.2), v: "señalar" }]} caras={[{ f: 0, v: "feliz" }]} habla={[[k(88.3), k(91.5)]]} />
      </>}
      hud={<>
        <Cansa cl={cl} x={(ff) => (ff < k(86.5) ? interpolate(ff, [0, k(86.5)], [1000, CAFE + 440]) : CAFE + 440)} y={ASH_PISO + 20 - 270} pct={0} desde={k(85.6)} tam={0.9} />
        <Pildora texto="STOP 18 · LENA · CHEM EXAM TONIGHT" x={960} y={950} desde={0} hasta={k(88.0)} color="#f4efe4" />
        <Globo texto="Covalent bonds share electrons, ionic ones steal them, so..." x={1000} y={260} desde={k(88.3)} hasta={k(91.5)} cola="abajo" tam={34} />
        <Pildora texto="10 SECONDS · THE WHOLE PAGE" x={960} y={950} desde={k(89.0)} hasta={k(91.5)} color="#ffd27a" />
        <Globo texto="Who ARE you? What did you do with my bus driver?" x={1250} y={250} desde={k(91.7)} hasta={k(95.6)} cola="abajo" tam={36} />
        <HudOwen min={640} part={PART} />
        {f < 0 && <VasoCafe />}
      </>} />
  );
};

// ---------- 12 · lunes a la noche: no duerme. Lee, limpia, arregla el radiador ----------
export const P12Noche: React.FC = () => {
  const f = useF();
  const k = kDe(95.5);
  const lee = k(98.7), limpia = k(102.2), radia = k(103.8);
  const x = f < lee ? interpolate(f, [0, lee - 10], [CAMA - 300, CAMA], { extrapolateRight: "clamp" }) : f < limpia ? CAMA : f < radia ? 600 : 60;
  const y = f < limpia ? A : f < radia ? P : A;
  const cl = [mira(0, 380, A - 200, 1.6), mira(lee, CAMA, A - 200, 2.0, { curva: "inout" }), mira(limpia, 600, P - 250, 1.6, { curva: "inout" }), mira(radia, 260, A - 180, 1.9, { curva: "inout" })];
  const barre = Array.from({ length: 8 }).map((_, i) => ({ f: limpia + i * 6, v: i % 2 ? { hD: 120, cD: 30, hI: 110, cI: 40, tronco: 10 } : { hD: 80, cD: 50, hI: 70, cI: 60, tronco: 14 } }));
  const llave = Array.from({ length: 12 }).map((_, i) => ({ f: radia + 6 + i * 7, v: i % 2 ? { hD: 70, cD: 80, tronco: 20 } : { hD: 40, cD: 110, tronco: 22 } }));
  const min = Math.round(interpolate(f, [0, k(107.5)], [1320, 1700])) % 1440;
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={12} setProps={{ hora: "noche", luzCocina: f >= limpia && f < radia, luzBaño: false, luzDorm: true, radiador: (ff: number) => ff < radia + 40 && ff % 12 < 6 }}
      medio={<Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x, y }]} dir={[{ f: 0, v: f < radia ? 1 : -1 }]}
        poses={[{ f: 0, v: "parado" }, { f: lee, v: "sentado" }, { f: limpia, v: "parado" }, ...barre, { f: radia, v: "agacharse" }, ...llave]} asiento={f >= lee && f < limpia ? [{ f: 0, v: 110 }] : undefined}
        caras={[{ f: 0, v: "feliz" }, { f: lee, v: "determinado" }, { f: radia + 60, v: "risa" }]} enManoD={f >= lee && f < limpia ? <Libro abierto /> : undefined} />}
      hud={<>
        <Pildora texto="MONDAY NIGHT · HE DOESN'T SLEEP" x={960} y={950} desde={0} hasta={lee} color="#f4efe4" />
        <Pildora texto="THE HUMAN BRAIN · COVER TO COVER" x={960} y={950} desde={lee} hasta={limpia} color="#ffd27a" />
        <Pildora texto="THE WHOLE APARTMENT" x={960} y={950} desde={limpia} hasta={radia} color="#ffd27a" />
        <Pildora texto="THE RADIATOR · 3 WINTERS OF BANGING" x={960} y={950} desde={radia} color="#ffd27a" />
        <HudOwen min={min} part={PART} />
      </>} />
  );
};

// ---------- 13 · martes 5:12: todavía 0 %. Pero algo cambió ----------
export const P13Martes: React.FC = () => {
  const k = kDe(107.56);
  const cl = [mira(0, 1060, A - 280, 2.1), mira(k(110.9), 1080, A - 300, 2.4, { curva: "inout" })];
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={13} setProps={{ hora: "alba", luzBaño: true }}
      medio={<Actor look={OWEN_CASA} escala={ESC} seed={6} vivo={0} ruta={[{ f: 0, x: TF_PUNTOS.espejo - 190, y: A }, { f: k(109.8), x: TF_PUNTOS.espejo - 190 }, { f: k(110.6), x: TF_PUNTOS.espejo - 120 }]} dir={[{ f: 0, v: 1 }]}
        poses={[...Array.from({ length: 12 }).map((_, i) => ({ f: i * 6, v: i % 2 ? { hD: 105, cD: 150, cabeza: -3 } : { hD: 95, cD: 160, cabeza: 3 } })), { f: 74, v: "parado" }, { f: k(110.6), v: "señalar" }, { f: k(111.4), v: { hD: 80, cD: 20 } }, { f: k(111.8), v: "pensar" }]}
        caras={[{ f: 0, v: "feliz" }, { f: k(110.9), v: "duda" }]} />}
      hud={<>
        <Cansa cl={cl} x={(ff) => (ff < k(110.6) ? TF_PUNTOS.espejo - 190 : TF_PUNTOS.espejo - 120)} y={A - 330} pct={0} desde={0} tam={1.2} glitch={(ff) => ff > k(110.9) && ff < k(111.5)} />
        <Pildora texto="TUESDAY · 5:12 AM · STILL 0%" x={960} y={950} desde={0} color="#ffd27a" />
        <Mano texto="but something is different" x={1350} y={300} desde={k(110.9)} color="#f4efe4" tam={58} />
        <HudOwen min={312} part={PART} />
      </>} />
  );
};

// ---------- 14 · se pasa una parada: medio bloque. Un pasajero grita ----------
export const P14Parada: React.FC = () => {
  const k = kDe(112.44);
  const grita: Pas = parado(SENORA, BUS_PUNTOS.puertaT - 120, { seed: 71, poses: [{ f: 0, v: "agarrarAlto" }, { f: k(116.2), v: "señalar" }], caras: [{ f: 0, v: "neutral" }, { f: k(116.2), v: "enojo" }], habla: [[k(116.2), k(117.8)]] });
  const cl = [mira(0, 700, 640, 1.4), mira(k(116.0), BUS_PUNTOS.puertaT - 120, BUS_PISO - 300, 2.0, { curva: "inout" }), mira(k(117.8), 380, BUS_PISO - 280, 2.3, { curva: "inout" })];
  return (
    <EnBus cl={cl} hora="manana" min={400} avance={(f) => 8000 + f * 14} paradas={[{ a: 8000 + k(114.3) * 14 - 300, num: 12 }]} timbre={(f) => f > k(113) && f < k(115)} pas={[grita, sent(ESTUDIANTE, 3, { seed: 72 })]}
      owen={{ caras: [{ f: 0, v: "feliz" }, { f: k(116.4), v: "sorpresa" }, { f: k(117.8), v: "triste" }], habla: [[k(117.9), k(119.5)]], poses: [{ f: 0, v: "sentado" }, { f: k(116.4), v: { tronco: 18, cabeza: 10 } }, { f: k(117.0), v: "sentado" }, { f: k(118.0), v: { tronco: 6, cabeza: 14 } }], giro: (f) => (f > k(116.4) && f < k(117.4) ? Math.sin((f - k(116.4)) * 0.6) * 0.3 : 0) }}
      hud={<>
        <Cansa cl={cl} x={OX} y={OY - 10} pct={0} desde={0} />
        <Pildora texto="STOP 12 · MISSED BY HALF A BLOCK" x={960} y={950} desde={k(114.4)} hasta={k(117.7)} color={ROJO_OWEN} />
        <Globo texto="HEY! That was my stop!" x={1050} y={220} desde={k(116.2)} hasta={k(117.8)} cola="abajo" tam={60} />
        <Globo texto="I'm so sorry—" x={760} y={330} desde={k(117.9)} hasta={k(119.6)} cola="abajo" tam={42} />
        <Mano texto="he felt completely awake" x={1300} y={300} desde={k(119.6)} hasta={k(122.0)} color="#f4efe4" tam={58} />
        <Mano texto="he just didn't SEE it." x={1300} y={300} desde={k(122.1)} color={ROJO_OWEN} tam={64} />
      </>} />
  );
};

export const P15Sentir: React.FC = () => { const k = kDe(123.62); return <AbsoluteFill><SentirVsSer dCurvas={k(124.4)} d05={k(141.0)} /><Mano texto="your body keeps the score" x={960} y={1000} desde={k(144.9)} color="#ffd27a" tam={58} /><HudOwen part={PART} /></AbsoluteFill>; };

// ---------- 16 · el hombre del abrigo: nada sobre su cabeza. Sólo la pulsera ----------
export const P16Abrigo: React.FC = () => {
  const k = kDe(147.82);
  const ab: Pas = {
    look: ABRIGO, seed: 51, aparece: k(148.6), caras: [{ f: 0, v: "neutral" }],
    ruta: [{ f: k(148.6), x: BUS_PUNTOS.puertaF + 40, y: BUS_PISO }, { f: k(149.6), x: BUS_PUNTOS.validador + 60, y: BUS_PISO }, { f: k(158.8), x: BUS_PUNTOS.validador + 60, y: BUS_PISO }, { f: k(161.0), x: ASIENTO_X(8), y: BUS_PISO }],
    dir: [{ f: 0, v: 1 }, { f: k(161.0), v: -1 }], sentado: k(161.2), poses: [{ f: 0, v: "parado" }, { f: k(156.6), v: { hI: 60, cI: 40 } }, { f: k(158.8), v: "parado" }],
  };
  const cl = [mira(0, 520, 650, 1.4), mira(k(150.6), 520, 600, 2.2, { curva: "inout" }), mira(k(156.4), 560, 720, 3.2, { curva: "inout" }), mira(k(159.0), 1300, 640, 1.0, { curva: "inout" })];
  return (
    <EnBus cl={cl} hora="tarde" min={880} avance={() => 16000} puertaF={(f) => (f < k(150.5) ? 1 : 0)} paradas={[{ a: 16000, num: 30 }]} pas={[ab]} owen={{ caras: [{ f: 0, v: "neutral" }, { f: k(151.7), v: "sorpresa" }, { f: k(156.6), v: "duda" }], giros: [{ f: 0, v: 0.6 }, { f: k(159.0), v: 0.9 }], miradas: [{ f: 0, v: { x: 1, y: 0 } }, { f: k(156.6), v: { x: 1, y: 0.5 } }] }}
      hud={<>
        <Pildora texto="TUESDAY · STOP 30" x={960} y={950} desde={0} hasta={k(151.6)} color="#f4efe4" />
        <Mano texto="nothing over his head." x={1350} y={260} desde={k(151.7)} hasta={k(156.5)} color="#f4efe4" tam={60} />
        {[["no number", 153.9], ["no battery", 154.7], ["no brain", 155.6]].map(([t, a], i) => <Pildora key={i} texto={t as string} x={1350} y={370 + i * 80} desde={k(a as number)} hasta={k(156.5)} color={ROJO_OWEN} />)}
        <Pildora texto="HALDEN CLINIC" x={960} y={950} desde={k(156.7)} hasta={k(159.2)} color="#6fa8ff" />
      </>} />
  );
};

// ---------- 17 · la libreta en el espejo: nombres tachados… y el último: MARSH, O. — 47 ----------
const NOMBRES = ["KOWALSKI, D. — 12", "REYES, M. — 03", "OKAFOR, T. — 29", "LINDQVIST, A. — 41", "PATEL, R. — 18", "MORENO, J. — 44"];
export const P17Libreta: React.FC = () => {
  const f = useF();
  const k = kDe(161.97);
  const e = interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const zoom = interpolate(f, [k(168.3), k(171.5)], [1, 1.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ult = f >= k(168.3);
  return (
    <AbsoluteFill style={{ background: "#14161c" }}>
      <AbsoluteFill style={{ opacity: f < k(173.4) ? 1 : 0 }}>
        <Marco x={340} y={110} w={1240} h={860} radio={120} borde="#2a2d34">
          <AbsoluteFill style={{ background: "#3a3f48" }} />
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 760, height: 760, transform: `translate(-50%,-50%) scale(${zoom * e}) rotate(-3deg)`, transformOrigin: ult ? "50% 92%" : "50% 50%", background: "#f6f1e2", borderRadius: 10, boxShadow: "0 10px 40px rgba(0,0,0,0.5)", fontFamily: "'Courier New', monospace" }}>
            {Array.from({ length: 16 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 60 + i * 44, height: 2, background: "#c9d6e8" }} />)}
            <div style={{ position: "absolute", left: 60, top: 20, fontSize: 30, fontWeight: 700, color: "#2a2a2a" }}>HALDEN · WK 3</div>
            {NOMBRES.map((n, i) => {
              const tach = interpolate(f, [k(166.6) + i * 4, k(166.6) + i * 4 + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return <div key={n} style={{ position: "absolute", left: 70, top: 100 + i * 88, fontSize: 40, color: "#2a2a2a" }}>{n}<div style={{ position: "absolute", left: -10, top: 22, height: 6, width: `${tach * 105}%`, background: "#c23a2e", transform: "rotate(-2deg)" }} /></div>;
            })}
            <div style={{ position: "absolute", left: 70, top: 100 + 6 * 88 + 20, fontSize: 48, fontWeight: 700, color: ult ? "#c23a2e" : "#2a2a2a" }}>MARSH, O. — 47</div>
            {ult && <div style={{ position: "absolute", left: 40, top: 100 + 6 * 88, width: 520, height: 100, border: "6px solid #c23a2e", borderRadius: "50%", opacity: interpolate(f, [k(168.5), k(169.5)], [0, 1], { extrapolateRight: "clamp" }) }} />}
          </div>
        </Marco>
        <Pildora texto="READ IN THE MIRROR · 20 FEET AWAY" x={960} y={1010} desde={k(162.5)} hasta={k(166.5)} color="#f4efe4" />
        <Pildora texto="NOT CROSSED OUT" x={960} y={1010} desde={k(169.0)} color={ROJO_OWEN} />
        {f >= k(170.0) && <div style={{ position: "absolute", left: 1290, top: 640, transform: `rotate(-14deg) scale(${Math.max(1, 2.2 - (f - k(170.0)) / 4)})`, opacity: Math.min(1, (f - k(170.0)) / 4), border: "10px solid #c23a2e", borderRadius: 20, padding: "6px 26px", fontFamily: F_HUD, fontWeight: 800, fontSize: 90, color: "#c23a2e" }}>47</div>}
      </AbsoluteFill>
      {f >= k(173.4) && <EnBus cl={[mira(0, 520, BUS_PISO - 300, 2.0), mira(36, 760, BUS_PISO - 320, 1.6, { curva: "inout" })]} hora="tarde" min={905} avance={() => 18000} paradas={[{ a: 18000, num: 38 }]} puertaT={() => 1}
        pas={[{ look: ABRIGO, seed: 51, ruta: [{ f: k(173.4), x: BUS_PUNTOS.puertaT - 200, y: BUS_PISO }, { f: k(175.2), x: BUS_PUNTOS.puertaT + 60, y: BUS_PISO }], dir: [{ f: 0, v: 1 }], seVa: k(175.0) }]}
        owen={{ caras: [{ f: 0, v: "miedo" }], giros: [{ f: 0, v: 0.2 }, { f: k(174.2), v: 0.9 }], miradas: [{ f: 0, v: { x: 1, y: 0 } }] }}
        hud={<Pildora texto="STOP 38 · HE GETS OFF. OWEN DOESN'T." x={960} y={950} desde={k(173.4)} color="#f4efe4" />} />}
      <HudOwen part={PART} sinReloj />
    </AbsoluteFill>
  );
};

// ---------- 18 · martes a la noche: la dirección de la clínica ----------
export const P18Direccion: React.FC = () => {
  const k = kDe(176.49);
  const cl = [mira(0, 380, A - 200, 2.0), mira(k(179.5), 340, A - 200, 2.4, { curva: "inout" })];
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={18} setProps={{ hora: "noche", luzCocina: false, luzBaño: false, luzDorm: false }}
      medio={<Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: CAMA, y: A }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { tronco: 30, pI: 88, rI: 88, pD: 92, rD: 92, hI: 25, cI: 50, hD: 35, cD: 55 } }, { f: 14, v: "sentado" }, { f: 30, v: { hD: 95, cD: 5, tronco: 10 } }, { f: 52, v: "pensar" }, { f: k(179.5), v: "celular" }]} asiento={[{ f: 0, v: 110 }]} caras={[{ f: 0, v: "neutral" }, { f: 30, v: "duda" }, { f: k(179.6), v: "determinado" }]} miradas={[{ f: 0, v: { x: 0.8, y: -0.3 } }, { f: 30, v: { x: 1, y: 0.3 } }, { f: 60, v: { x: 0.8, y: -0.3 } }]} />}
      hud={<>
        <Cansa cl={cl} x={CAMA} y={A - 300} pct={0} desde={0} />
        <Pildora texto="TUESDAY NIGHT · STILL DOESN'T WANT TO SLEEP" x={960} y={950} desde={0} hasta={k(179.4)} color="#f4efe4" />
        <Pildora texto="THE ONLY CLUE: THE CLINIC'S ADDRESS" x={960} y={950} desde={k(179.5)} color="#6fa8ff" />
        <HudOwen min={(f) => 1410 + Math.round(f / 10)} part={PART} />
      </>} />
  );
};

// ---------- 19 · la línea rosa sobre la ciudad de noche ----------
const TrenL: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x},${y})`}>
    {[0, 1, 2, 3].map((i) => (
      <g key={i} transform={`translate(${i * 330},0)`}>
        <rect x={0} y={-130} width={320} height={130} rx={14} fill="#c9ced6" stroke="#7a8290" strokeWidth={4} />
        <rect x={0} y={-130} width={320} height={16} rx={8} fill="#ff7ab0" />
        {[0, 1, 2, 3, 4].map((w) => <rect key={w} x={20 + w * 60} y={-100} width={44} height={50} rx={6} fill="#ffe9a8" />)}
        {i === 1 && <circle cx={152} cy={-70} r={12} fill="#1a1a1a" />}
      </g>
    ))}
  </g>
);
export const P19Rosa: React.FC = () => {
  const f = useF();
  const k = kDe(179.53);
  const tx = interpolate(f, [k(182.6), k(189.0)], [-1400, 1900], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const paradas = ["18TH", "POLK", "ASHLAND", "MORGAN"];
  const p = Math.min(3, Math.floor(interpolate(f, [k(182.6), k(188.5)], [0, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#0a1030,#1d2350 70%,#2a2a40)" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <circle cx={1600} cy={180} r={50} fill="#f4efe4" opacity={0.9} />
        <SkylineChi x0={0} piso={760} hora="noche" />
        <rect x={0} y={760} width={1920} height={320} fill="#151826" />
        <rect x={0} y={640} width={1920} height={26} fill="#3a3f4e" />
        {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={i * 210 + 40} y={666} width={18} height={420} fill="#3a3f4e" />)}
        <TrenL x={tx} y={640} />
        <Actor look={OWEN_CASA} escala={1.1} seed={6} ruta={[{ f: 0, x: 260, y: 1010 }, { f: k(182.8), x: 1500, curva: "lineal" }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }]} />
      </svg>
      <Pildora texto="PINK LINE · 18TH STREET → WEST LOOP" x={960} y={950} desde={k(182.8)} color="#ff7ab0" />
      {f >= k(182.6) && <div style={{ position: "absolute", left: 960, top: 160, transform: "translateX(-50%)", fontFamily: F_HUD, fontWeight: 700, fontSize: 40, color: "#ff7ab0", letterSpacing: 4 }}>{paradas.map((s, i) => <span key={s} style={{ opacity: i <= p ? 1 : 0.3 }}>{i ? " · " : ""}{s}</span>)}</div>}
      <Mano texto="following the only clue he has" x={960} y={240} desde={0} hasta={k(182.5)} color="#f4efe4" tam={64} />
      <HudOwen min={(ff) => 85 + Math.round(ff / 12)} part={PART} />
    </AbsoluteFill>
  );
};

// ---------- 20 · Fulton Market, 2 AM: un edificio blanco sin cartel; el 4º piso entero prendido ----------
export const P20Edificio: React.FC = () => {
  const f = useF();
  const k = kDe(189.05);
  const z = interpolate(f, [0, k(192.6)], [1.0, 1.35], { extrapolateRight: "clamp" });
  const sube = interpolate(f, [k(190.6), k(192.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#0b0f24" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, transform: `scale(${z}) translateY(${sube * 180}px)`, transformOrigin: `50% ${80 - sube * 40}%` }}>
        <SkylineChi x0={-200} piso={820} hora="noche" />
        <rect x={0} y={820} width={1920} height={260} fill="#1a1d2a" />
        <rect x={0} y={880} width={1920} height={8} fill="#2c3040" />
        <g transform="translate(660,820)">
          <rect x={0} y={-620} width={600} height={620} fill="#e9ecef" />
          {[0, 1, 2, 3, 4].map((fl) => [0, 1, 2, 3, 4].map((w) => {
            const on = fl === 3;
            return <rect key={`${fl}-${w}`} x={40 + w * 110} y={-110 - fl * 120} width={80} height={80} fill={on ? "#fff3b0" : "#3a4256"} opacity={on ? 0.85 + 0.15 * Math.sin(f / 7 + w) : 1} />;
          }))}
          <rect x={250} y={-90} width={100} height={90} fill="#2a3040" />
          {[0, 1, 2, 3, 4].map((w) => <rect key={w} x={40 + w * 110} y={-470} width={80} height={80} fill="#fff3b0" opacity={0.25} filter="blur(8px)" />)}
        </g>
        <Actor look={OWEN_CASA} escala={0.75} seed={6} ruta={[{ f: 0, x: 200, y: 885 }, { f: k(190.6), x: 900 }]} caras={[{ f: 0, v: "determinado" }]} poses={[{ f: 0, v: "parado" }, { f: k(190.7), v: "agarrarAlto" }]} miradas={[{ f: k(190.7), v: { x: 0, y: -1 } }]} />
      </svg>
      <Pildora texto="FULTON MARKET · NO SIGN" x={960} y={950} desde={0} hasta={k(190.8)} color="#f4efe4" />
      <Pildora texto="2 AM · 4TH FLOOR · EVERY LIGHT ON" x={960} y={950} desde={k(190.9)} color="#fff3b0" />
      <HudOwen min={120} part={PART} />
    </AbsoluteFill>
  );
};

// ---------- 21 · miércoles: café en el cereal, se olvida la credencial ----------
export const P21Grietas: React.FC = () => {
  const f = useF();
  const k = kDe(192.61);
  const sirve = k(198.1);
  const cl = [mira(0, 640, P - 260, 1.4), mira(sirve - 10, 560, P - 230, 2.2, { curva: "inout" }), mira(k(199.97), 760, P - 250, 1.5, { curva: "inout" })];
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={21} setProps={{ hora: "alba", luzBaño: false }}
      medio={<>
        <Actor look={OWEN} escala={ESC} seed={6} ruta={[{ f: 0, x: 500, y: P }, { f: k(199.97), x: 500, y: P }, { f: k(201.8), x: 1250, y: P }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: "parado" }, { f: 20, v: { hD: 80, cD: 30, hI: 70, cI: 40, tronco: 8 } }, { f: 70, v: { hD: 110, cD: 20, hI: 60, cI: 50, tronco: 12 } }, { f: 120, v: "parado" }, { f: sirve - 8, v: { hD: 85, cD: 30, tronco: 8 } }, { f: sirve + 30, v: "manosCara" }, { f: sirve + 52, v: "parado" }]} caras={[{ f: 0, v: "cansado" }, { f: sirve + 20, v: "duda" }, { f: k(199.9), v: "neutral" }]}
          enManoD={f > sirve - 10 && f < sirve + 28 ? <g transform="rotate(-60)"><Taza /></g> : f > 15 && f < 125 ? <g transform="rotate(-40)"><rect x={-22} y={-60} width={44} height={70} rx={4} fill="#e8a83a" /><rect x={-22} y={-60} width={44} height={16} fill="#c23a2e" /></g> : undefined} />
        {f > sirve && f < sirve + 30 && <path d={`M${TF_PUNTOS.mesa - 50},${P - 230} q 20,40 20,58`} stroke="#6a4630" strokeWidth={10} fill="none" strokeLinecap="round" />}
        <g transform={`translate(${TF_PUNTOS.mesa - 30},${P - 172})`}><path d="M-40,0 h80 l-10,30 h-60 Z" fill="#f4efe4" /><ellipse cx={0} cy={0} rx={40} ry={8} fill={f > sirve + 6 ? "#6a4630" : "#f2d07a"} /></g>
        <g transform={`translate(${TF_PUNTOS.mesa + 60},${P - 176})`} opacity={f > k(199.97) ? 1 : 0.9}><rect x={-26} y={-16} width={52} height={34} rx={4} fill="#f4efe4" stroke="#2a6fd6" strokeWidth={3} /><rect x={-20} y={-10} width={16} height={18} fill="#c9a06a" /></g>
      </>}
      hud={<>
        <Cansa cl={cl} x={(ff) => (ff < k(199.97) ? 500 : interpolate(ff, [k(199.97), k(201.8)], [500, 1250], { extrapolateRight: "clamp" }))} y={P - 330} pct={0} desde={0} glitch={(ff) => ff > k(196)} />
        <Pildora texto="WEDNESDAY · 5:12 · STILL 0%" x={960} y={950} desde={0} hasta={k(196.0)} color="#ffd27a" />
        <Mano texto="now the cracks show up" x={960} y={880} desde={k(196.0)} hasta={sirve + 8} color={ROJO_OWEN} tam={62} />
        <Mano texto="coffee... in the cereal" x={960} y={880} desde={sirve + 10} hasta={k(199.9)} color="#f4efe4" tam={58} />
        <Mano texto="his ID badge stays on the table" x={960} y={880} desde={k(200.1)} color="#f4efe4" tam={58} />
        <HudOwen min={312} part={PART} />
      </>} />
  );
};

// ---------- 22 · el turno entero sin una sola cara: todos con «?» ----------
export const P22Caras: React.FC = () => {
  const k = kDe(201.83);
  const cl = [mira(0, 1000, 640, 1.35), mira(k(206.5), 1500, 640, 1.45, { curva: "inout" })];
  const filas = [2, 3, 4, 5, 7, 8];
  const looks = [SENORA, TEEN, OFICINISTA, ESTUDIANTE, OBRERO, ABERNATHY];
  const pas = filas.map((fl, i) => sent(looks[i], fl, { seed: 80 + i, caras: [{ f: 0, v: "neutral" }, { f: k(203.6) + i * 10, v: "duda" }] }));
  return (
    <EnBus cl={cl} hora="tarde" min={(f) => 900 + Math.round(f / 2)} avance={(f) => 9000 + f * 12} pas={pas} owen={{ caras: [{ f: 0, v: "duda" }] }}
      hud={<>
        {filas.map((fl, i) => <Tag key={fl} cl={cl} x={ASIENTO_X(fl)} y={BUS_PISO - 250} texto="?" desde={k(203.6) + i * 10} color="#9aa6c8" tam={1.4} />)}
        <Pildora texto="THE WHOLE ROUTE · NOT ONE FACE REMEMBERED" x={960} y={950} desde={0} hasta={k(203.3)} color="#f4efe4" />
        <Pildora texto="How many faces do YOU remember from this morning? Comment it ↓" x={960} y={950} desde={k(203.4)} color={VERDE} tam={40} />
        <Mano texto="Monday's memory: gone." x={960} y={260} desde={k(206.6)} color={ROJO_OWEN} tam={64} />
      </>} />
  );
};

// ---------- 23 · pasa por el café: ¿de qué hablamos ayer? ----------
export const P23PasaCafe: React.FC = () => {
  const f = useF();
  const k = kDe(209.45);
  const bx = (ff: number) => 900 + ff * 9;
  const cl = [mira(0, 2100, ASH_PISO - 300, 1.0), mira(k(213.4), 2300, ASH_PISO - 300, 1.05)];
  return (
    <Escena Set={Ashland} pal={PAL} claves={cl} seed={23} setProps={{ hora: "tarde", centro: (ff: number) => 1800 + ff * 1.6, cafe: 1700 }}
      medio={<>
        <Actor look={LENA} escala={ESC * 0.8} seed={4} ruta={[{ f: 0, x: 2340, y: ASH_PISO - 30 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "parado" }, { f: 20, v: "saludar" }, ...Array.from({ length: 6 }).map((_, i) => ({ f: 30 + i * 8, v: i % 2 ? { hD: 150, cD: 30 } : { hD: 130, cD: 60 } })), { f: 90, v: "manosCintura" }]} caras={[{ f: 0, v: "feliz" }, { f: 90, v: "triste" }]} />
        <Bus9 x={bx(f)} y={ASH_CARRIL} esc={0.8} dir={1} hora="tarde" rueda={f * 6} />
      </>}
      hud={<>
        <Mano texto="what did they talk about yesterday?" x={1300} y={720} desde={k(210.4)} color="#f4efe4" tam={60} />
        <HudOwen min={930} part={PART} />
      </>} />
  );
};

export const P24Hipocampo: React.FC = () => { const k = kDe(213.47); return <AbsoluteFill><Hipocampo dArchiva={k(222.0)} dTres={k(229.7)} /><Mano texto="memory is made while you SLEEP" x={960} y={860} desde={k(215.7)} hasta={k(219.6)} color="#ffd27a" tam={64} /><HudOwen part={PART} /></AbsoluteFill>; };

// ---------- 25 · miércoles 3 AM en la escalera: el dolor de cabeza, las manos que tiemblan ----------
export const P25Escalera: React.FC = () => {
  const f = useF();
  const k = kDe(232.85);
  const tiembla = f > k(241.2) ? Math.sin(f * 3.1) * 7 : 0;
  const cl = [mira(0, PIES.x - 260, PIES.y - 120, 1.35), mira(k(236.0), PIES.x + 40, PIES.y - 210, 1.8, { curva: "inout" }), mira(k(241.2), PIES.x + 30, PIES.y - 170, 3.0, { curva: "inout" })];
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={25} setProps={{ hora: "noche", luzCocina: false, luzBaño: false, luzDorm: false }}
      medio={<><OwenEscalera tiembla={f > k(239.3) ? 9 : 3} caras={[{ f: 0, v: "cansado" }, { f: k(239.3), v: "miedo" }]} poses={[{ f: 0, v: { ...SENT_ESC, hD: 30, cD: 60, hI: 30, cI: 60 } }, { f: 40, v: { ...SENT_ESC, tronco: 20, hD: 120, cD: 140, cabeza: 12 } }, { f: 90, v: { ...SENT_ESC, hD: 30, cD: 60, hI: 30, cI: 60 } }, { f: k(239.3), v: CARA_ESC }, { f: k(241.2), v: { hD: 60, cD: 110, hI: 60, cI: 110, ...SENT_ESC } }]} />
        {f > k(241.2) && <g transform={`translate(${PIES.x + 40 + tiembla},${PIES.y - 74 - 150})`}><rect x={-18} y={-30} width={36} height={62} rx={7} fill="#111" /><rect x={-14} y={-25} width={28} height={50} rx={4} fill="#8fd0ff" /></g>}
        <Trastos /></>}
      hud={<>
        <Cansa cl={cl} x={PIES.x + 10} y={PIES.y - 74 - 240} pct={0} glitch={(ff) => ff > k(236)} />
        <Pildora texto="WEDNESDAY · 3 AM · FULLY AWAKE" x={960} y={950} desde={0} hasta={k(239.2)} color="#f4efe4" />
        <Mano texto="a deep, slow ache" x={1400} y={280} desde={k(239.4)} color={ROJO_OWEN} tam={62} />
        <Calendario texto="DAY 3" desde={k(234.0)} />
        <HudOwen min={180} part={PART} />
      </>} />
  );
};

export const P26Glinfa: React.FC = () => { const k = kDe(243.15); return <AbsoluteFill><Glinfatico dCrece={k(248.5)} dLava={k(252.0)} dNombre={k(258.9)} dOwen={k(263.4)} /><HudOwen part={PART} /></AbsoluteFill>; };
export const P27Gardner: React.FC = () => { const k = kDe(266.11); return <AbsoluteFill><Gardner dDias={k(272.0)} dHoras={k(273.7)} dSintomas={k(275.4)} dMant={k(280.3)} /><HudOwen part={PART} /></AbsoluteFill>; };

// ---------- 28 · 4 AM: Rosa lo encuentra en la escalera, leche tibia ----------
export const P28Leche: React.FC = () => {
  const f = useF();
  const k = kDe(285.07);
  const baja = k(288.8), sienta = k(290.2);
  const rx = (ff: number) => interpolate(ff, [0, baja], [PIES.x - 420, PIES.x - 120], { extrapolateRight: "clamp" });
  const cl = [mira(0, PIES.x - 260, PIES.y - 200, 1.8), mira(sienta, PIES.x - 80, PIES.y - 190, 2.1, { curva: "inout" }), mira(k(294.6), PIES.x - 50, PIES.y - 200, 2.3, { curva: "inout" })];
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={28} setProps={{ hora: "noche", luzCocina: f > k(289), luzBaño: false, luzDorm: false }}
      medio={<>
        <OwenEscalera tiembla={3} caras={[{ f: 0, v: "miedo" }, { f: k(288.0), v: "sorpresa" }, { f: k(292), v: "triste" }]} poses={[{ f: 0, v: CARA_ESC }, { f: k(287.6), v: { ...SENT_ESC, hD: 40, cD: 80, hI: 40, cI: 80 } }, { f: sienta + 10, v: { hD: 60, cD: 100, ...SENT_ESC } }]} enManoD={f > sienta + 10 ? <Taza vapor={1} f={f} /> : undefined} giros={[{ f: 0, v: 0 }, { f: k(287.6), v: -0.7 }, { f: sienta + 20, v: -0.3 }]} />
        <Actor look={ROSA} escala={ESC} seed={5} ruta={[{ f: 0, x: rx(0), y: P }, { f: baja, x: PIES.x - 120, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "parado" }, { f: sienta, v: "sentado" }]} asiento={f >= sienta ? [{ f: 0, v: 62 }] : undefined}
          caras={[{ f: 0, v: "triste" }, { f: k(292), v: "feliz" }]} enManoD={f < sienta + 10 ? <Taza vapor={1} f={f} /> : undefined} />
        <Trastos />
      </>}
      hud={<>
        <Cansa cl={cl} x={PIES.x + 10} y={PIES.y - 74 - 240} pct={0} glitch />
        <Pildora texto="4 AM · ROSA" x={960} y={950} desde={0} hasta={k(290.1)} color="#f4efe4" />
        <Pildora texto="WARM MILK · LIKE WHEN HE WAS SEVEN" x={960} y={950} desde={k(290.3)} color="#ffd27a" />
        <HudOwen min={240} part={PART} />
      </>} />
  );
};

// ---------- 29 · el sobre en el delantal ----------
export const P29Sobre: React.FC = () => {
  const f = useF();
  const k = kDe(294.63);
  const cl = [mira(0, PIES.x - 90, PIES.y - 170, 2.2), mira(k(298.6), PIES.x - 110, PIES.y - 150, 2.6, { curva: "inout" })];
  const esconde = interpolate(f, [k(300.2), k(300.9)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={29} setProps={{ hora: "noche", luzCocina: true, luzBaño: false, luzDorm: false }}
      medio={<>
        <Actor look={ROSA} escala={ESC} seed={5} ruta={[{ f: 0, x: PIES.x - 120, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "sentado" }, { f: k(300.0), v: { tronco: 4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 30, cD: 110, hI: 25, cI: 50 } }, { f: k(301.0), v: "sentado" }]} asiento={[{ f: 0, v: 62 }]} caras={[{ f: 0, v: "feliz" }, { f: k(299.6), v: "sorpresa" }, { f: k(300.8), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: -0.3 } }, { f: k(299.6), v: { x: 0.4, y: 0.6 } }, { f: k(300.8), v: { x: 1, y: -0.3 } }]} />
        <g transform={`translate(${PIES.x - 100},${P - 150 + esconde * 40}) rotate(${-12 + esconde * 20}) scale(1.7)`} opacity={1 - esconde * 0.7}><rect x={-34} y={-24} width={68} height={44} fill="#fbf8f0" stroke="#c9c2b2" strokeWidth={2} /><circle cx={-18} cy={-8} r={8} fill="#2a6fd6" opacity={0.3 + 0.7 * Math.min(1, Math.max(0, (f - k(298.6)) / 12))} /><rect x={-4} y={-14} width={30} height={4} fill="#9aa" /><rect x={-4} y={-4} width={24} height={4} fill="#9aa" /></g>
        <OwenEscalera caras={[{ f: 0, v: "triste" }, { f: k(298.6), v: "sorpresa" }]} poses={[{ f: 0, v: { hD: 60, cD: 100, ...SENT_ESC } }]} enManoD={<Taza vapor={1} f={f} />} />
      </>}
      hud={<>
        <Pildora texto="ST. ANTHONY HOSPITAL" x={960} y={950} desde={k(300.0)} color="#6fa8ff" />
        <HudOwen min={244} part={PART} />
      </>} />
  );
};

export const P30Factura: React.FC = () => { const k = kDe(301.33); return <AbsoluteFill><Factura dTotal={k(309.9)} dSexto={k(312.1)} /><HudOwen part={PART} /></AbsoluteFill>; };

// ---------- 31 · Rosa le saca la carta: «Mijo, los números en un papel son sólo números» ----------
export const P31Mijo: React.FC = () => {
  const f = useF();
  const k = kDe(314.45);
  const cl = [mira(0, PIES.x - 40, PIES.y - 120, 2.4), mira(k(316.5), PIES.x - 30, PIES.y - 120, 2.9, { curva: "inout" }), mira(k(321.1), PIES.x + 10, PIES.y - 200, 2.2, { curva: "inout" })];
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={31} setProps={{ hora: "noche", luzCocina: true, luzBaño: false, luzDorm: false }}
      medio={<>
        <Actor look={ROSA} escala={ESC} seed={5} ruta={[{ f: 0, x: PIES.x - 120, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 90, cD: 20 } }, { f: k(316.5), v: "sentado" }]} asiento={[{ f: 0, v: 62 }]}
          caras={[{ f: 0, v: "triste" }, { f: k(317.6), v: "feliz" }]} habla={[[k(317.7), k(321.0)]]} enManoD={f < k(316.5) ? <rect x={-30} y={-20} width={60} height={40} fill="#fbf8f0" /> : undefined} />
        <OwenEscalera caras={[{ f: 0, v: "triste" }, { f: k(316.6), v: "sorpresa" }, { f: k(321.2), v: "triste" }, { f: k(323.8), v: "miedo" }]} poses={[{ f: 0, v: { hD: 60, cD: 100, ...SENT_ESC } }, { f: k(316.0), v: { ...SENT_ESC, hD: 75, cD: 20 } }, { f: k(317.4), v: { hD: 60, cD: 100, ...SENT_ESC } }, { f: k(323.8), v: CARA_ESC }]} enManoD={f > k(316.5) && f < k(323.8) ? <rect x={-30} y={-20} width={60} height={40} fill="#fbf8f0" /> : undefined} giros={[{ f: 0, v: -0.5 }]} />
      </>}
      hud={<>
        <Globo texto="Mijo, numbers on paper are just numbers." x={760} y={230} desde={k(317.7)} hasta={k(321.1)} cola="abajo" tam={54} />
        <Mano texto="he knows something she doesn't" x={1350} y={280} desde={k(321.2)} hasta={k(323.7)} color="#f4efe4" tam={56} />
        <Mano texto="numbers are the only thing he can see now." x={960} y={880} desde={k(323.8)} color={ROJO_OWEN} tam={60} />
        <HudOwen min={252} part={PART} />
      </>} />
  );
};

// ---------- 32 · 5:12, el mensaje: 44/47 ----------
export const P32Mensaje: React.FC = () => {
  const k = kDe(326.12);
  const cambio = k(335.8);
  return (
    <AbsoluteFill>
      <Escena Set={TwoFlatCorte} pal={PAL} claves={[mira(0, PIES.x - 260, PIES.y - 200, 2.4), mira(k(334), PIES.x - 300, PIES.y - 210, 2.7, { curva: "inout" })]} seed={32} setProps={{ hora: "alba", luzCocina: false, luzBaño: false, luzDorm: false }}
        medio={<OwenEscalera caras={[{ f: 0, v: "cansado" }, { f: k(330.0), v: "sorpresa" }, { f: k(332.5), v: "duda" }, { f: k(335.8), v: "miedo" }]} poses={[{ f: 0, v: "celular" }, { f: k(332.5), v: { ...SENT_ESC, hD: 30, cD: 125, cabeza: 26, tronco: 10 } }, { f: k(335.8), v: "celular" }]} giros={[{ f: 0, v: 0.3 }]} />} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 72% 45%, rgba(111,168,255,0.28) 0%, rgba(5,7,13,0.55) 45%)" }} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <MensajeCel de="Halden Clinic · Dr. Imani Hale" texto={"Week 3 complete.\nPlease sleep now,\nparticipant 47.\nYour next change\nbegins when you wake up."} desde={k(326.4)} x={520} s={0.95} />
      </svg>
      <Contador lineas={[{ etiqueta: "PARTICIPANTS", claves: "45/47", color: VERDE }]} tam={38} hasta={cambio} />
      <Contador lineas={[{ etiqueta: "PARTICIPANTS", claves: "44/47", color: ROJO_OWEN }]} tam={38} desde={cambio} />
    </AbsoluteFill>
  );
};

// ---------- 33 · por primera vez en tres días el número se mueve: 0 → 100. Dormido antes de tocar la almohada ----------
export const P33Duerme: React.FC = () => {
  const f = useF();
  const k = kDe(338.65);
  const salta = k(342.4), duerme = k(345.9);
  const cl = [mira(0, PIES.x + 20, PIES.y - 240, 2.2), mira(salta, PIES.x + 20, PIES.y - 260, 2.6, { curva: "inout" }), mira(duerme, PIES.x - 40, PIES.y - 180, 1.6, { curva: "inout" })];
  const cae = interpolate(f, [duerme - 8, duerme + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={33} setProps={{ hora: "alba", luzCocina: false, luzBaño: false, luzDorm: false }}
      medio={<g transform={`rotate(${-70 * cae} ${PIES.x} ${PIES.y - 74}) translate(0,${f > duerme + 10 ? Math.exp(-(f - duerme - 10) / 3) * Math.sin((f - duerme - 10) * 2) * 14 : 0})`}>
        <OwenEscalera caras={[{ f: 0, v: "neutral" }, { f: salta, v: "sorpresa" }, { f: salta + 30, v: "cansado" }, { f: duerme, v: "zombi" }]} poses={[{ f: 0, v: "celular" }, { f: salta + 20, v: { hD: 20, cD: 20, hI: 20, cI: 20, ...SENT_ESC } }]} />
      </g>}
      hud={<>
        <Cansa cl={cl} x={PIES.x + 10} y={PIES.y - 74 - 240} pct={[{ f: salta, v: 0 }, { f: salta + 8, v: 100 }]} desde={0} hasta={duerme + 4} tam={1.2} />
        <Mano texto="for the first time in 3 days, it moves" x={960} y={860} desde={k(339.0)} hasta={salta} color="#f4efe4" tam={64} />
        {f > salta && f < duerme && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 35%, #fff3d8 0%, #ff3d2e 60%)", opacity: Math.max(0, 0.45 - (f - salta) / 30) }} />}
        <Mano texto="asleep before his head hits the pillow" x={960} y={880} desde={duerme + 6} color="#6fa8ff" tam={56} />
        <HudOwen min={314} part="44/47" />
      </>} />
  );
};

// ---------- 34 · la semana que viene: etiquetas de precio ----------
export const P34Precios: React.FC = () => {
  const k = kDe(348.25);
  const cl = [mira(0, 1000, 640, 1.35), mira(k(352.3), 1350, 640, 1.4, { curva: "inout" }), mira(k(355.0), ASIENTO_X(8), BUS_PISO - 280, 1.9, { curva: "inout" })];
  const reac = ["sorpresa", "risa", "duda", "feliz", "enojo", "neutral"];
  const brazos: Record<string, number>[] = [{ hI: 140, cI: 20, hD: 150, cD: 15 }, { hD: 25, cD: 150 }, { hI: 40, cI: 140, hD: 45, cD: 140 }, { hD: 95, cD: 0 }, { hI: 30, cI: 115, hD: 35, cD: 110 }, {}];
  const filas = [2, 3, 4, 5, 7, 8];
  const looks = [SENORA, TEEN, OFICINISTA, ESTUDIANTE, OBRERO, ABRIGO];
  const precios = ["$1.2M", "$640K", "$3.4M", "$880K", "$2.1M", "$ ???"];
  return (
    <EnBus cl={cl} hora="manana" part="44/47" min={380} avance={(f) => 4000 + f * 10} pas={filas.map((fl, i) => sent(looks[i], fl, { seed: 90 + i, caras: [{ f: 0, v: "neutral" }, { f: k(349.0) + i * 14 + 4, v: reac[i] }], poses: [{ f: 0, v: "sentado" }, { f: k(349.0) + i * 14 + 4, v: { tronco: -4, pI: 88, rI: 88, pD: 92, rD: 92, ...brazos[i] } }] }))} owen={{ caras: [{ f: 0, v: "sorpresa" }] }}
      hud={<>
        {filas.map((fl, i) => <Tag key={fl} cl={cl} x={ASIENTO_X(fl)} y={BUS_PISO - 250} texto={precios[i]} desde={k(349.0) + i * 14} color={i === 5 ? "#ffd27a" : VERDE} tam={i === 5 ? 1.5 : 1.25} />)}
        <Pildora texto="NEXT WEEK · EVERYONE HAS A PRICE TAG" x={960} y={170} desde={0} color="#ffd27a" />
        <Mano texto="not what they earn. what they're WORTH." x={960} y={900} desde={k(352.3)} hasta={k(354.3)} color="#f4efe4" tam={56} />
        <Mano texto="the most expensive one: the last he'd expect" x={960} y={900} desde={k(354.4)} color="#ffd27a" tam={54} />
      </>} />
  );
};

// ---------- 35 · CTA final: ¿cuántas horas dormiste anoche? ----------
export const P35Cta: React.FC = () => {
  const k = kDe(358.06);
  const f = useF();
  const cl = [mira(0, CAMA - 60, A - 120, 2.4), mira(k(366), CAMA - 40, A - 120, 2.6)];
  const resp = Math.sin(f / 18);
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={35} setProps={{ hora: "dia", luzCocina: false, luzBaño: false, luzDorm: false }}
      medio={<g transform={`rotate(-90 ${CAMA} ${A - 60})`}><Actor look={OWEN_CASA} escala={ESC} seed={6} vivo={0} ruta={[{ f: 0, x: CAMA, y: A - 60 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "zombi" }]} ajuste={(q) => ({ ...q, tronco: q.tronco + resp * 3, cabeza: q.cabeza + resp * 4, hD: q.hD + resp * 5 })} /></g>}
      hud={<>
        {[0, 1, 2].map((i) => { const t = ((f + i * 20) % 60) / 60; return <div key={i} style={{ position: "absolute", left: 1000 + t * 140, top: 420 - t * 200, fontFamily: F_HUD, fontWeight: 800, fontSize: 80 + i * 22, color: "#ffe04a", opacity: Math.sin(t * Math.PI), textShadow: "0 4px 10px rgba(0,0,0,0.5)" }}>Z</div>; })}
        {f > k(361.6) && <div style={{ position: "absolute", left: 960, top: 800, transform: `translateX(-50%) scale(${1 + Math.max(0, Math.sin((f - k(361.6)) / 6)) * 0.05})`, display: "flex", alignItems: "center", gap: 18, background: "#e22a2a", color: "#fff", fontFamily: F_HUD, fontWeight: 800, fontSize: 56, padding: "14px 40px", borderRadius: 18, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>SUBSCRIBE <span style={{ display: "inline-block", fontSize: 50, transform: `rotate(${Math.sin(f / 3) * 14}deg)` }}>🔔</span></div>}
        <Cansa cl={cl} x={CAMA + 260} y={A - 140} pct={100} desde={k(359.0)} tam={1.2} />
        <Pildora texto="Honest answer: how many hours did YOU sleep last night?" x={960} y={170} desde={k(358.3)} color={VERDE} tam={44} />
        <Pildora texto="TELL US IN THE COMMENTS · WEEK 4 IS NEXT" x={960} y={960} desde={k(361.6)} color="#f4efe4" tam={40} />
        <HudOwen part="44/47" />
      </>} />
  );
};
