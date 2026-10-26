// lc02 · planos 1-40 (0 → 188,05 s): cuadro 0 = la miniatura (ventana escarchada, los dos bajo mantas junto a la estufa),
// enero a −28, un solo cuarto, la leña (cuerdas, motosierra de a dos, madera seca), el frío, el CO y la alarma de US$9, día 83.
// Rehechura 26-oct: cámara sin motion blur (EscenaL), sentados con asiento, cada acción que dice la voz se VE (puertas,
// mantas, plástico, leña a la estufa, el caño que revienta, vestirse, el hollín), un componente por escena que lleva el dato.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Halo } from "../../anikit/luz";
import { Calendario, Globo, Pildora, TextoMano } from "../../anikit/pantalla";
import { Carrito, Celular, Lata } from "../../anikit/props";
import { Cocina, COCINA_PISO, COCINA_PUNTOS, Silla } from "../../anikit/sets/cocina";
import { Supermercado, SUPER_PISO, SUPER_PUNTOS } from "../../anikit/sets/super";
import { alcanzar, Look, Pose } from "../../anikit/personaje";
import { AMBAR, BORDE_CALIDO, BORDE_FRIO, JUNE, JUNE_INV, PAL, THEO, THEO_CASA, THEO_INV } from "../elenco";
import { FRIO } from "../hud";
import { NieveCae } from "../mundo/comun";
import { Panorama, PANO_PISO } from "../mundo/panorama";
import { Superior, SUP_PISO } from "../mundo/superior";
import { Puente, PUENTE_PISO } from "../mundo/puente";
import { Barrio, BARRIO_PISO, Estufa, Living, LIV_PISO } from "../mundo/casa";
import { StMarys, SM_PISO } from "../mundo/hospital";
import { CuadernoGrande, CuadernoMano, kDe, Pj as PjBase } from "./base";
import { BolsaDormir, Manta, Motosierra, Pino, Tablas, Termometro } from "./lc02_props";
import {
  A_COLCHON, A_CUCLI, A_SILLA, A_SUELO, Aliento, AlarmaCO, aPantalla, Aserrin, BarraPower, BloqueCuerda, Cal90, CanioCorte, CasaSeccion, Chispas, cl, CUCLI,
  EscarchaR, EscenaL, EtiquetaObj, GasCO, HollinCorte, HumoChim, IconoTachado, io, Lenio, ManoGuante, MarcoPeli, MedidorPPM, MitadHumanidad, MoleculaCO,
  MantaVano, PlasticoVentana, pomo, Poste, Precio, Puerta, PuertaEstufa, RelojHielo, Rodajas, SENT, SUELO, TarjetaRopa, Texto, Tic, Ventisca,
} from "./lc02_planos1_comp";

const P = LIV_PISO;
const B = BARRIO_PISO;
const V = { x: 1060, y: 230, w: 480, h: 420 }; // ventana del living
// el living en pleno invierno (mantas en las puertas, plástico en la ventana, ventisca afuera)
export const LIV_INV = { hora: "tormenta", luces: 0, fuego: 1, lena: 0.45, latas: 0.8, mantas: true, plastico: true, reglas: 2, cae: true };
const VOS: Look = { estilo: "palo", camisa: "#8a8f9a", manga: "larga", pantalon: "#3a3f4a", zapatos: "#1a1410" };
const THEO_REMERA: Look = { ...THEO_CASA, camisa: "#d8d2c4", manga: "corta" };
const THEO_LANA: Look = { ...THEO_CASA, camisa: "#7a6656", manga: "larga" };

// Pj con mano en función del cuadro
type Mano = React.ReactNode | ((f: number) => React.ReactNode);
const Pj: React.FC<Omit<React.ComponentProps<typeof PjBase>, "enManoD" | "enManoI"> & { enManoD?: Mano; enManoI?: Mano }> = ({ enManoD, enManoI, ...r }) => {
  const f = useF();
  return <PjBase {...r} enManoD={typeof enManoD === "function" ? enManoD(f) : enManoD} enManoI={typeof enManoI === "function" ? enManoI(f) : enManoI} />;
};
// IK: la mano `lado` va al punto `obj(f)` (local: x adelante, y desde los pies; null = sin tocar)
type Pt = { x: number; y: number } | null;
const ik = (lado: "D" | "I", obj: (f: number) => Pt, asiento?: number) => (p: Pose, f: number): Pose => { const o = obj(f); return o ? ({ ...p, ...alcanzar(p, lado, o, asiento) } as Pose) : p; };
const ik2 = (...a: ((p: Pose, f: number) => Pose)[]) => (p: Pose, f: number) => a.reduce((q, fn) => fn(q, f), p);
const entre = (f: number, a: number, b: number) => f >= a && f < b;
const ramp = (f: number, a: number, b: number, v0 = 0, v1 = 1) => interpolate(f, [a, b], [v0, v1], io);

// los dos sentados en el piso bajo mantas escocesas (coordenadas del mundo) — firma intacta (lo usa lc02_planos2)
export const DosMantas: React.FC<{ x: number; caras?: [string, string]; theo?: Look; june?: Look; f?: number; manos?: [React.ReactNode, React.ReactNode] }> = ({ x, caras = ["neutral", "neutral"], theo = THEO, june = JUNE, manos }) => (
  <>
    <Pj look={theo} ruta={[{ f: 0, x, y: P }]} poses={[{ f: 0, v: SUELO }]} asiento={[{ f: 0, v: A_SUELO }]} caras={[{ f: 0, v: caras[0] }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} enManoD={manos?.[0]} />
    <Pj look={june} ruta={[{ f: 0, x: x + 190, y: P }]} poses={[{ f: 0, v: SUELO }]} asiento={[{ f: 0, v: A_SUELO }]} caras={[{ f: 0, v: caras[1] }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} seed={2} enManoD={manos?.[1]} />
    <Manta x={x + 50} y={P + 8} w={210} h={92} id="t" />
    <Manta x={x + 240} y={P + 8} w={210} h={92} color="#3a4a7a" raya="#9a3a34" id="j" />
  </>
);
// sentado en el colchón con la manta en las piernas
const EnColchon: React.FC<{ look: Look; x: number; dir?: 1 | -1; caras?: { f: number; v: string }[]; miradas?: { f: number; v: { x: number; y: number } }[]; poses?: { f: number; v: string | Partial<Pose> }[]; asiento?: { f: number; v: number | undefined }[]; ruta?: { f: number; x: number; y?: number }[]; ajuste?: (p: Pose, f: number) => Pose; seed?: number; manta?: string; enManoD?: React.ReactNode | ((f: number) => React.ReactNode); habla?: [number, number][]; sinManta?: (f: number) => boolean; f?: number }> = (p) => (
  <>
    <Pj look={p.look} ruta={p.ruta ?? [{ f: 0, x: p.x, y: P }]} dir={[{ f: 0, v: p.dir ?? 1 }]} poses={p.poses ?? [{ f: 0, v: SENT }]} asiento={p.asiento ?? [{ f: 0, v: A_COLCHON }]} caras={p.caras ?? [{ f: 0, v: "cansado" }]} miradas={p.miradas} luz={BORDE_CALIDO} seed={p.seed} ajuste={p.ajuste} enManoD={p.enManoD} habla={p.habla} />
    {!(p.sinManta && p.f !== undefined && p.sinManta(p.f)) && <Manta x={p.x + (p.dir ?? 1) * 52} y={P - 40} w={150} h={60} color={p.manta ?? "#9a3a34"} id={`em${p.x}`} />}
  </>
);
// boca de un personaje de pie (para el aliento)
const boca = (x: number, piso: number, dir = 1, asiento?: number) => ({ x: x + dir * 22, y: asiento !== undefined ? piso - asiento - 140 : piso - 252 });

// ---------- 1 · CUADRO 0 = la miniatura sin texto ----------
export const P01Mini: React.FC = () => {
  const f = useF();
  return (
    <EscenaL Set={Living} pal={PAL} claves={[mira(0, 1270, P - 290, 1.5), mira(30, 1272, P - 290, 1.51)]} seed={1} mano={1} setProps={{ ...LIV_INV, plastico: false, lena: 0.6 }}
      detras={<><EscarchaR x={V.x} y={V.y} w={V.w} h={V.h} o={0.9} /><Halo x={1900} y={P - 200} r={760} color="#ff9a4a" fuerza={0.4 + 0.04 * Math.sin(f / 3)} /></>}
      medio={<>
        <DosMantas x={1170} caras={["miedo", "miedo"]} />
        <Aliento {...boca(1170, P, 1, A_SUELO)} f={f} />
        <Aliento {...boca(1360, P, 1, A_SUELO)} f={f} desfase={20} />
      </>} />
  );
};

// ---------- 2 · enero en Duluth: la ventisca y una sola ventana encendida ----------
export const P02Enero: React.FC = () => {
  const f = useF();
  const k = kDe(0.98);
  return (
    <AbsoluteFill>
      <EscenaL Set={Barrio} pal={PAL} claves={[mira(0, 1900, B - 420, 0.82), mira(60, 1770, B - 190, 1.55, { curva: "inout" })]} seed={2} setProps={{ hora: "tormenta", luces: 0, nieve: 1, cae: true, humo: 0, ventanaCasa: 1 }}
        medio={<>
          <HumoChim x={2090} y={B - 770} f={f} viento={1.6} />
          {/* las dos siluetas en la ventana encendida */}
          <circle cx={1722} cy={B - 150} r={11} fill="#3a2418" /><rect x={1712} y={B - 140} width={22} height={24} rx={8} fill="#3a2418" />
          <circle cx={1744} cy={B - 146} r={10} fill="#3a2418" /><rect x={1735} y={B - 137} width={20} height={21} rx={8} fill="#3a2418" />
        </>}
        frente={<Ventisca f={f} viento={11} n={220} />} />
      <Calendario texto="JANUARY" x={1480} y={90} desde={k(1.08)} tam={50} />
      <Pildora texto="DULUTH, MINNESOTA" x={760} y={150} desde={k(1.94)} color={FRIO} tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 3 · −28 afuera: una mano limpia la escarcha y aparece el termómetro ----------
export const P03Termo: React.FC = () => {
  const f = useF();
  const k = kDe(2.98);
  const tw = ramp(f, k(3.0), k(4.0)); // avance de la limpieza
  const pts = Array.from({ length: 24 }).map((_, i) => i / 23).filter((t) => t <= tw).map((t) => ({ x: 1240 + 150 * Math.cos(t * Math.PI * 4 + 1), y: 560 + 230 * Math.sin(t * Math.PI * 4 + 1) * (0.6 + 0.4 * t) }));
  const m = pts[pts.length - 1] ?? { x: 1500, y: 900 };
  const mano = f < k(4.3) ? { x: m.x + 40, y: m.y + 40 } : { x: interpolate(f, [k(4.3), k(4.9)], [m.x + 40, 1900], cl), y: interpolate(f, [k(4.3), k(4.9)], [m.y + 40, 1300], cl) };
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#1a2440, #3a4a6e)" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <defs><mask id="p03m"><rect x={0} y={0} width={1920} height={1080} fill="#fff" />{pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={120} fill="#000" />)}</mask></defs>
        {/* afuera: la calle helada */}
        <rect x={0} y={760} width={1920} height={320} fill="#cfd8e8" />
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={i * 230 - 40} y={560 - ((i * 53) % 120)} width={190} height={220 + ((i * 53) % 120)} fill="#2a2f44" />)}
        <NieveCae f={f} n={160} x0={0} w={1920} y0={0} h={1080} viento={3} />
        <Termometro temp={interpolate(f, [k(3.0), k(3.4)], [-12, -28], cl)} x={1240} y={560} />
        {/* la escarcha, con el hueco que deja la mano */}
        <g mask="url(#p03m)"><rect x={0} y={0} width={1920} height={1080} fill="#d8e4f6" opacity={0.78} /><EscarchaR x={0} y={0} w={1920} h={1080} o={0.9} /></g>
        {/* marco de la ventana */}
        <path d="M0,0 H1920 V1080 H0 Z M70,70 V1010 H1850 V70 Z" fill="#e8d9b5" fillRule="evenodd" />
        <rect x={810} y={70} width={24} height={940} fill="#e8d9b5" />
        <ManoGuante x={mano.x} y={mano.y} ang={-28} manga="#2f7f86" />
      </svg>
      <Texto x={440} y={420} desde={k(3.2)} tam={170} color="#eaf6ff" peso={600}>−28°F</Texto>
      <Texto x={440} y={630} desde={k(3.4)} tam={44} color="#eaf6ff">OUTSIDE · AT NOON</Texto>
    </AbsoluteFill>
  );
};

// ---------- 4 · sin luz en toda la ciudad: se apaga barrio por barrio ----------
export const P04SinLuz: React.FC = () => {
  const f = useF();
  const k = kDe(5.24);
  const luces = ramp(f, k(5.34), k(6.6), 1, 0);
  return (
    <AbsoluteFill>
      <EscenaL Set={Panorama} pal={PAL} claves={[mira(0, 820, 640, 1.0), mira(60, 850, 640, 1.04)]} seed={4} setProps={{ hora: "noche", luces, ventana: 0, nieve: 1, cae: true, vapor: 0.6 }}
        medio={<>
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 330, y: PANO_PISO }]} caras={[{ f: 0, v: "neutral" }, { f: k(5.5), v: "sorpresa" }, { f: k(6.4), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} luz={BORDE_FRIO} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 520, y: PANO_PISO }]} poses={[{ f: 0, v: "parado" }, { f: k(5.98), v: "señalar" }]} caras={[{ f: 0, v: "neutral" }, { f: k(5.6), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: 0.1 } }]} luz={BORDE_FRIO} seed={2} />
          <Aliento {...boca(330, PANO_PISO)} f={f} /><Aliento {...boca(520, PANO_PISO)} f={f} desfase={23} />
        </>} />
      <BarraPower x={1400} y={110} v={luces} desde={0} />
      <Pildora texto="THE ENTIRE CITY" x={1610} y={262} desde={k(5.98)} color="#e2483a" tam={36} />
    </AbsoluteFill>
  );
};

// ---------- 5 · sin caldera, sin hospital, nadie a quien llamar ----------
export const P05Nadie: React.FC = () => {
  const f = useF();
  const k = kDe(7.26);
  const X0 = 620, X1 = 1000;
  const jx = (q: number) => interpolate(q, [0, k(8.05)], [X0, X1], cl);
  const claves = [mira(0, 1150, 360, 0.55), mira(k(8.0), 1060, 600, 0.95, { curva: "inout" }), mira(k(9.0), 1030, SM_PISO - 230, 1.55, { curva: "inout" })];
  const tel = aPantalla(claves, f, 1030 - 46, SM_PISO - 250);
  return (
    <AbsoluteFill>
      <EscenaL Set={StMarys} pal={PAL} claves={claves} seed={5} setProps={{ hora: "noche", luces: 0, ventana: ramp(f, k(8.24), k(8.7), 1, 0), nieve: 1, cae: true }}
        medio={<>
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: X0, y: SM_PISO }, { f: k(8.05), x: X1 }, { f: k(8.9), x: X1 }, { f: k(9.1), x: X1 + 30 }]}
            dir={[{ f: 0, v: 1 }, { f: k(8.95), v: -1 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(8.05), v: "empujar" }, { f: k(8.9), v: "parado" }, { f: k(9.05), v: "celular" }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(8.4), v: "miedo" }, { f: k(9.2), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(9.05), v: { x: 1, y: 0.4 } }]}
            ajuste={ik2(ik("D", (q) => entre(q, k(8.05), k(8.9)) ? { x: 70, y: -200 + Math.sin(q / 2) * 6 } : null), ik("I", (q) => entre(q, k(8.05), k(8.9)) ? { x: 60, y: -150 } : null))}
            enManoD={(q: number) => q > k(9.0) ? <Celular brillo="#9bb7ff" /> : null} luz={BORDE_FRIO} seed={2} />
          <Aliento {...boca(jx(f), SM_PISO)} f={f} />
        </>} />
      <IconoTachado x={1640} y={290} icono="estufa" rotulo="FURNACE" desde={k(7.38)} tacha={k(7.7)} />
      <IconoTachado x={1640} y={480} icono="hospital" rotulo="HOSPITAL" desde={k(8.24)} tacha={k(8.55)} />
      <IconoTachado x={1640} y={670} icono="telefono" rotulo="CALL 911" desde={k(9.08)} tacha={k(9.4)} />
      {f > k(9.2) && <Globo texto="NO SERVICE" x={tel.x - 40} y={tel.y - 120} desde={k(9.2)} hasta={k(11)} tam={34} />}
    </AbsoluteFill>
  );
};

// ---------- 6 · toda tu especie: una sola ventana encendida → dos personas, un cuarto, una estufa que hace tic ----------
export const P06Cuarto: React.FC = () => {
  const f = useF();
  const k = kDe(10.38);
  const c = k(12.55);
  const clavesB = [mira(0, 1800, B - 380, 0.5), mira(c, 1732, B - 150, 2.6, { curva: "inout" })];
  const clavesL = [mira(c, 1150, P - 300, 1.05), mira(k(14.3), 1500, P - 280, 1.05, { curva: "inout" })];
  const win = aPantalla(clavesB, f, 1732, B - 150);
  const est = aPantalla(clavesL, f, 1950, P - 200);
  const mira2 = { x: 1, y: 0 };
  return (
    <AbsoluteFill>
      {f < c ? (
        <EscenaL Set={Barrio} pal={PAL} claves={clavesB} seed={6} setProps={{ hora: "noche", luces: 0, nieve: 1, cae: true, humo: 0, ventanaCasa: 1 }}
          medio={<HumoChim x={2090} y={B - 770} f={f} color="#5a6078" />} frente={<Ventisca f={f} viento={5} n={140} o={0.6} />} />
      ) : (
        <EscenaL Set={Living} pal={PAL} claves={clavesL} seed={6} setProps={{ ...LIV_INV, hora: "noche" }}
          medio={<>
            <EnColchon look={THEO_CASA} x={730} caras={[{ f: 0, v: "cansado" }, { f: k(14.64), v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(14.64), v: mira2 }]} />
            <EnColchon look={JUNE} x={1070} seed={2} manta="#3a4a7a" caras={[{ f: 0, v: "triste" }, { f: k(14.7), v: "duda" }]} miradas={[{ f: 0, v: { x: -1, y: 0.2 } }, { f: k(14.64), v: mira2 }]} dir={1} />
          </>} />
      )}
      <Pildora texto="YOUR ENTIRE SPECIES" x={1240} y={150} desde={k(10.82)} hasta={c - 6} color={AMBAR} tam={44} />
      {f < c && <EtiquetaObj texto="2 PEOPLE" desde={k(11.5)} px={win.x} py={win.y} tx={win.x + 300} ty={win.y - 220} tam={40} />}
      {f >= c && <>
        <Pildora texto="ONE ROOM" x={760} y={150} desde={k(13.0)} color={AMBAR} tam={40} />
        <Pildora texto="ONE STOVE" x={1260} y={150} desde={k(14.64)} color={AMBAR} tam={40} />
        <Tic x={est.x - 60} y={est.y - 260} f={f} en={[k(14.9), k(15.1), k(15.3)]} />
      </>}
    </AbsoluteFill>
  );
};

// ---------- 7 · la luz se fue el día 41: Theo en el puente cuando se apaga todo ----------
export const P07Dia41: React.FC = () => {
  const f = useF();
  const k = kDe(15.48);
  const luces = ramp(f, k(16.2), k(16.8), 1, 0);
  const tx = interpolate(f, [0, k(16.4)], [1020, 1160], cl);
  return (
    <AbsoluteFill>
      <EscenaL Set={Puente} pal={PAL} claves={[mira(0, 1150, PUENTE_PISO - 300, 1.45), mira(84, 1190, PUENTE_PISO - 280, 1.6)]} seed={7}
        setProps={{ hora: "noche", luces, nieve: 1, vapor: 1, hielo: 0.3, cae: true }}
        medio={<>
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 1020, y: PUENTE_PISO }, { f: k(16.4), x: 1160 }]} dir={[{ f: 0, v: 1 }, { f: k(16.75), v: -1 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(16.75), v: "encogerse" }]} caras={[{ f: 0, v: "neutral" }, { f: k(16.65), v: "sorpresa" }, { f: k(17.3), v: "miedo" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(16.65), v: { x: 1, y: -0.6 } }]} luz={BORDE_FRIO} />
          <Aliento {...boca(tx, PUENTE_PISO)} f={f} />
        </>} />
      {f > k(16.6) && f < k(16.75) && <AbsoluteFill style={{ background: "#fff6e0", opacity: interpolate(f, [k(16.6), k(16.75)], [0.5, 0], cl) }} />}
      <TextoMano texto="lights out" x={1300} y={230} desde={k(16.7)} color={AMBAR} tam={72} />
    </AbsoluteFill>
  );
};

// ---------- 8 · una ciudad llena de comida y 90 días de invierno ----------
export const P08Comida: React.FC = () => {
  const f = useF();
  const k = kDe(18.26);
  const SP = SUPER_PISO, PX = SUPER_PUNTOS.piramide;
  const toma = k(19.1), suelta = k(19.85);
  return (
    <AbsoluteFill>
      <EscenaL Set={Supermercado} pal={PAL} claves={[mira(0, PX - 260, SP - 330, 1.25), mira(146, PX - 220, SP - 340, 1.35)]} seed={8} setProps={{}}
        medio={<>
          <Carrito x={interpolate(f, [0, k(19.6)], [PX - 900, PX - 520], cl)} y={SP} lleno={f > suelta + 4 ? 0.5 : 0.3} rueda={f} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: PX - 1040, y: SP }, { f: k(19.6), x: PX - 660 }]} poses={[{ f: 0, v: { hD: 75, cD: 15, hI: 70, cI: 20, tronco: 8 } }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(20.8), v: "duda" }, { f: k(21.5), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(20.9), v: { x: 1, y: -0.4 } }]} seed={2} />
          <Pj look={THEO_INV} ruta={[{ f: 0, x: PX - 230, y: SP }]} dir={[{ f: 0, v: 1 }, { f: k(19.5), v: -1 }, { f: k(20.4), v: 1 }]}
            caras={[{ f: 0, v: "feliz" }, { f: k(20.84), v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(20.9), v: { x: 1, y: -0.4 } }]}
            ajuste={ik("D", (q) => entre(q, k(18.8), toma + 6) ? { x: 80, y: -110 } : entre(q, k(19.5), suelta + 4) ? { x: 90, y: -150 } : null)}
            enManoD={(q: number) => q > toma && q < suelta ? <Lata color="#c0352c" /> : null} />
        </>} />
      <Pildora texto="A CITY FULL OF FOOD" x={760} y={150} desde={k(19.1)} color={AMBAR} tam={44} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, opacity: interpolate(f, [k(20.8), k(21.0)], [0, 1], cl) }}>
        <Cal90 x={1380} y={250} prog={ramp(f, k(20.9), k(22.6))} s={1.1} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 9 · ¿pueden dos personas sobrevivir solas el primer invierno? ----------
export const P09Pregunta: React.FC = () => {
  const f = useF();
  const k = kDe(23.12);
  return (
    <AbsoluteFill>
      <EscenaL Set={Panorama} pal={PAL} claves={[mira(0, 420, PANO_PISO - 250, 2.0), mira(k(25.0), 430, PANO_PISO - 250, 2.1), mira(k(28.0), 1500, 520, 0.62, { curva: "inout" })]} seed={9}
        setProps={{ hora: "invierno", luces: 0, ventana: 0, nieve: 1, cae: true, vapor: 0.8 }}
        medio={<>
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 330, y: PANO_PISO }]} caras={[{ f: 0, v: "duda" }, { f: k(25.6), v: "determinado" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(25.4), v: { x: 1, y: 0.1 } }]} dir={[{ f: 0, v: 1 }, { f: k(25.5), v: 1 }]} luz={BORDE_FRIO} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 520, y: PANO_PISO }]} dir={[{ f: 0, v: 1 }, { f: k(25.3), v: -1 }, { f: k(26.9), v: 1 }]}
            poses={[{ f: 0, v: "brazosCruzados" }, { f: k(25.3), v: "hablar" }, { f: k(26.9), v: "encogerse" }]} habla={[[k(25.3), k(26.6)]]}
            caras={[{ f: 0, v: "neutral" }, { f: k(25.3), v: "miedo" }, { f: k(27.4), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} luz={BORDE_FRIO} seed={2} />
          <Aliento {...boca(330, PANO_PISO)} f={f} /><Aliento {...boca(520, PANO_PISO, f > k(25.3) && f < k(26.9) ? -1 : 1)} f={f} desfase={20} />
        </>} />
      <Pildora texto="CAN TWO PEOPLE SURVIVE" x={1180} y={150} desde={k(25.2)} hasta={k(27.2)} color={AMBAR} tam={44} />
      <Pildora texto="THE FIRST WINTER · ALONE" x={1180} y={150} desde={k(27.38)} color={FRIO} tam={44} />
    </AbsoluteFill>
  );
};

// ---------- 10 · contémoslo: el cuaderno rojo se abre ----------
export const P10Cuenta: React.FC = () => <CuadernoGrande tapa abre={6} zoom={[0, 1.04, 1.12]} luz="#3a2c2a" vela />;

// ---------- 11 · día 42: June se levanta y cierra puertas; la casa se cierra cuarto por cuarto ----------
export const P11Puertas: React.FC = () => {
  const f = useF();
  const k = kDe(29.58);
  const c1 = k(33.95), c2 = k(35.9);
  // puerta derecha (bisagra derecha): June la tira hasta cerrarla
  const ab = ramp(f, k(34.75), k(35.5), 1, 0);
  const kn = pomo(3550, P, 240, ab, true);
  const jxPuerta = (q: number) => q < k(34.7) ? interpolate(q, [c1, k(34.7)], [3330, pomo(3550, P, 240, 1, true).x - 66], cl) : pomo(3550, P, 240, ramp(q, k(34.75), k(35.5), 1, 0), true).x - 66;
  const ruta2 = Array.from({ length: 20 }).map((_, i) => { const q = c1 + (i * (c2 - c1)) / 19; return { f: Math.round(q), x: jxPuerta(q), y: P }; });
  const cerr = (t: number) => ramp(f, k(t), k(t) + 9);
  if (f < c1) return (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={[mira(0, 900, P - 270, 1.35), mira(c1, 980, P - 280, 1.42)]} seed={11} setProps={{ ...LIV_INV, hora: "alba", mantas: false, plastico: false, lena: 0.25, fuego: 0.2, cae: false }}
        medio={<>
          <EnColchon look={THEO_CASA} x={720} caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: { x: 1, y: 0.4 } }]} poses={[{ f: 0, v: { ...SENT, tronco: 14, cabeza: 22 } }]} />
          <EnColchon look={JUNE} x={1060} seed={2} manta="#3a4a7a" f={f} sinManta={(q) => q > k(33.3)}
            ruta={[{ f: 0, x: 1060, y: P }, { f: k(33.5), x: 1060 }, { f: c1, x: 1260 }]}
            poses={[{ f: 0, v: SENT }, { f: k(33.3), v: "parado" }]} asiento={[{ f: 0, v: A_COLCHON }, { f: k(33.3), v: undefined }]}
            caras={[{ f: 0, v: "cansado" }, { f: k(31.8), v: "duda" }, { f: k(33.3), v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(31.8), v: { x: -1, y: -0.2 } }]} />
          <Aliento {...boca(720, P, 1, A_COLCHON)} f={f} /><Aliento {...boca(1060, P, 1, A_COLCHON)} f={f} desfase={22} />
        </>} />
      <Pildora texto="THE MORNING AFTER THE BLACKOUT" x={1180} y={150} desde={k(31.12)} color={AMBAR} tam={40} />
    </AbsoluteFill>
  );
  if (f < c2) return (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={[mira(c1, 3420, P - 300, 1.3), mira(c2, 3460, P - 300, 1.38)]} seed={11} setProps={{ ...LIV_INV, hora: "alba", mantas: false, plastico: false, lena: 0.25, fuego: 0.2, cae: false }}
        medio={<>
          <Puerta x={3550} piso={P} abre={ab} der luzVano="#6a8ab0" />
          {ab > 0.3 && <NieveCae f={f} n={20} x0={3560} w={220} y0={P - 600} h={600} />}
          <Pj look={JUNE_INV} ruta={ruta2} caras={[{ f: 0, v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} seed={2}
            ajuste={ik("D", (q) => q > k(34.6) ? { x: pomo(3550, P, 240, ramp(q, k(34.75), k(35.5), 1, 0), true).x - jxPuerta(q), y: kn.y - P } : null)} />
        </>} />
      <Pildora texto="SHE CLOSES THE DOORS" x={1180} y={150} desde={k(35.14)} color={AMBAR} tam={40} />
    </AbsoluteFill>
  );
  const fr = [cerr(36.2), cerr(37.1), cerr(38.0), cerr(36.45), cerr(36.7), 0];
  const z = ramp(f, c2, c2 + 60, 1, 1.05);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#1d2440, #4a5a78)" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(960 540) scale(${z}) translate(-960 -540)`}>
          <NieveCae f={f} n={90} x0={0} w={1920} y0={0} h={1080} />
          <CasaSeccion f={f} frio={fr.map((v, i) => (i === 5 ? 0 : 0.25 + 0.75 * v))} cerrada={[...fr.slice(0, 5), 0]} temps={[...fr.slice(0, 5).map((v) => 48 - 30 * v), 61]}
            rotulos={[...fr.slice(0, 5).map((v) => Math.min(1, v * 3)), 1]} tachas={[...fr.slice(0, 5), 0]}>
            <Pj look={JUNE} ruta={[{ f: 0, x: 1160, y: 840 }]} escala={0.55} caras={[{ f: 0, v: "determinado" }]} seed={2} />
          </CasaSeccion>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 12 · mantas en los vanos, plástico en las ventanas ----------
export const P12Plastico: React.FC = () => {
  const f = useF();
  const k = kDe(39.4);
  const c = k(41.35);
  const cae = ramp(f, k(39.84), k(40.6), 0.6, 1);
  const borde = P - 620 + 620 * cae;
  if (f < c) return (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={[mira(0, 60, P - 320, 1.45), mira(c, 80, P - 320, 1.5)]} seed={12} setProps={{ ...LIV_INV, mantas: false, plastico: false, hora: "invierno", cae: false }}
        medio={<>
          <MantaVano x={-260} piso={P} W={240} H={620} cae={cae} f={f} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: -40, y: P }, { f: k(40.65), x: -40 }, { f: k(41.1), x: 130 }]} dir={[{ f: 0, v: -1 }, { f: k(40.9), v: 1 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(40.95), v: "manosCintura" }]} caras={[{ f: 0, v: "determinado" }, { f: k(40.9), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: -0.2 } }]} seed={2}
            ajuste={ik2(ik("D", (q) => q < k(40.65) ? { x: 120, y: P - 620 + 620 * ramp(q, k(39.84), k(40.6), 0.6, 1) - P - 4 } : null), ik("I", (q) => q < k(40.65) ? { x: 60, y: P - 620 + 620 * ramp(q, k(39.84), k(40.6), 0.6, 1) - P - 4 } : null))} />
        </>} />
      <Pildora texto="BLANKETS OVER THE DOORWAYS" x={1220} y={170} desde={k(39.84)} color={AMBAR} tam={40} />
      {borde > -1e9 && null}
    </AbsoluteFill>
  );
  const prog = ramp(f, k(41.5), k(42.3));
  const cin = [ramp(f, k(42.45), k(42.55)), ramp(f, k(42.8), k(42.9)), 1, 1];
  return (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={[mira(c, 1240, P - 430, 1.35), mira(125, 1250, P - 430, 1.42)]} seed={12} setProps={{ ...LIV_INV, plastico: false, hora: "tormenta" }}
        medio={<>
          <PlasticoVentana V={V} prog={prog} cintas={cin} f={f} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 965, y: P }, { f: k(42.6), x: 965 }, { f: k(42.75), x: 1000 }, { f: k(43.4), x: 1000 }]}
            dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "parado" }, { f: k(42.95), v: "manosCintura" }]} caras={[{ f: 0, v: "determinado" }, { f: k(42.95), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: -0.5 } }, { f: k(42.95), v: { x: -1, y: 0 } }]} seed={2}
            ajuste={ik("D", (q) => entre(q, k(42.2), k(42.6)) ? { x: V.x - 34 - 965 + 40, y: V.y + V.h + 34 - P - 18 } : null)} />
        </>} />
      <Pildora texto="PLASTIC ON THE WINDOWS" x={500} y={330} desde={k(41.78)} color={AMBAR} tam={34} />
    </AbsoluteFill>
  );
};

// ---------- 13 · no se calienta una casa: se calienta un cuarto ----------
export const P13Corte: React.FC = () => {
  const f = useF();
  const k = kDe(43.58);
  const pierde = ramp(f, k(44.58), k(46.6));
  const cierra = ramp(f, k(47.75), k(48.2));
  const z = ramp(f, k(48.2), k(49.3), 1, 1.75);
  const otros = [0, 1, 2, 3, 4].map(() => 0.2 + 0.8 * Math.max(pierde, cierra));
  const living = cierra > 0 ? 0.6 * (1 - cierra) : 0.2 + 0.4 * pierde;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#1d2440, #4a5a78)" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(1260 695) scale(${z}) translate(-1260 -695)`}>
          <NieveCae f={f} n={90} x0={0} w={1920} y0={0} h={1080} />
          <CasaSeccion f={f} frio={[...otros, living]} cerrada={[0, 1, 2, 3, 4].map(() => cierra).concat(0)} escape={pierde * (1 - cierra)}
            temps={[...otros.map((v) => 62 - 50 * v), 62 - 35 * living]} estufa={1}>
            <Pj look={THEO_CASA} ruta={[{ f: 0, x: 1130, y: 840 }]} escala={0.5} caras={[{ f: 0, v: "cansado" }, { f: k(48.2), v: "feliz" }]} />
            <Pj look={JUNE} ruta={[{ f: 0, x: 1240, y: 840 }]} escala={0.5} caras={[{ f: 0, v: "duda" }, { f: k(48.2), v: "feliz" }]} seed={2} dir={[{ f: 0, v: -1 }]} />
          </CasaSeccion>
        </g>
      </svg>
      <Pildora texto="YOU CAN'T HEAT A HOUSE" x={960} y={960} desde={k(45.48)} hasta={k(47.5)} color={FRIO} tam={46} />
      <Pildora texto="YOU CAN HEAT ONE ROOM" x={960} y={960} desde={k(47.78)} color={AMBAR} tam={50} />
    </AbsoluteFill>
  );
};

// ---------- 14 · la casa se achica a un living: el inventario, objeto por objeto ----------
export const P14Inventario: React.FC = () => {
  const f = useF();
  const k = kDe(49.44);
  const c = k(52.0);
  if (f < c) {
    const enc = ramp(f, k(51.38), k(51.95));
    const r = { x0: 1600 + (1704 - 1600) * enc, x1: 2200 + (1760 - 2200) * enc, y0: B - 520 + (716 - (B - 520)) * enc, y1: B + (784 - B) * enc };
    return (
      <AbsoluteFill>
        <EscenaL Set={Barrio} pal={PAL} claves={[mira(0, 1900, B - 400, 0.95), mira(k(51.3), 1860, B - 330, 1.15, { curva: "inout" }), mira(c, 1732, B - 150, 1.9, { curva: "inout" })]} seed={14}
          setProps={{ hora: "invierno", luces: 0, nieve: 1, cae: true, humo: 0, ventanaCasa: 1 }}
          medio={<>
            <HumoChim x={2090} y={B - 770} f={f} />
            {f > k(51.3) && <rect x={r.x0} y={r.y0} width={r.x1 - r.x0} height={r.y1 - r.y0} fill="none" stroke={AMBAR} strokeWidth={8} strokeDasharray="22 14" />}
          </>} frente={<Ventisca f={f} viento={4} n={110} o={0.6} />} />
        <Pildora texto="A BRICK HOUSE · 7TH AVENUE EAST" x={1100} y={150} desde={k(50.0)} color={AMBAR} tam={40} />
      </AbsoluteFill>
    );
  }
  const claves = [mira(c, 1760, 400, 0.72), mira(k(57.6), 1760, 400, 0.72), mira(k(58.45), 2440, P - 240, 1.8, { curva: "inout" })];
  const at = (X: number, Y: number) => aPantalla(claves, f, X, Y);
  const fin = k(57.5);
  const est = at(1950, P - 230), col = at(900, P - 60), mesa = at(2620, P - 170), est2 = at(2920, P - 420), cua = at(2475, P - 190);
  const toma = k(58.15);
  return (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={claves} seed={14} setProps={{ ...LIV_INV, lena: 0.15 }}
        medio={<>
          {f > toma + 6 && <rect x={2436} y={P - 190} width={78} height={20} fill="#5a4a5e" />}
          <EnColchon look={THEO_CASA} x={760} caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]}
            ajuste={ik2(ik("D", () => ({ x: 92, y: -150 }), A_COLCHON), ik("I", () => ({ x: 80, y: -130 }), A_COLCHON))} />
          <Pj look={JUNE} ruta={[{ f: 0, x: 2390, y: P }]} poses={[{ f: 0, v: "parado" }]} caras={[{ f: 0, v: "neutral" }, { f: k(58.3), v: "determinado" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: k(58.6), v: { x: 1, y: 0.2 } }]} luz={BORDE_CALIDO} seed={2}
            ajuste={ik("D", (q) => entre(q, k(57.9), toma + 6) ? { x: 85, y: -186 } : q >= toma + 6 ? { x: 70, y: -230 } : null)}
            enManoD={(q: number) => q >= toma + 6 ? <CuadernoMano /> : null} />
        </>} />
      <EtiquetaObj texto="A WOOD STOVE" desde={k(53.06)} hasta={fin} px={est.x} py={est.y} tx={1330} ty={250} />
      <EtiquetaObj texto="TWO MATTRESSES" desde={k(53.66)} hasta={fin} px={col.x} py={col.y} tx={500} ty={300} />
      <EtiquetaObj texto="A TABLE" desde={k(55.8)} hasta={fin} px={mesa.x} py={mesa.y} tx={1450} ty={330} />
      <EtiquetaObj texto="A SHELF OF CANS" desde={k(56.66)} hasta={fin} px={est2.x} py={est2.y} tx={1700} ty={190} />
      <EtiquetaObj texto="THE RED NOTEBOOK" desde={k(58.3)} px={cua.x} py={cua.y - 60} tx={1150} ty={330} color="#e2483a" tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 15 · la estufa necesita leña: Theo abre, mete el leño, chispas, cierra ----------
export const P15Lenia: React.FC = () => {
  const f = useF();
  const k = kDe(59.16);
  const TX = 1800;
  const abre = Math.min(ramp(f, k(59.5), k(59.85)), ramp(f, k(60.85), k(61.2), 1, 0));
  const suelta = k(60.15);
  const vuelo = ramp(f, suelta, suelta + 8);
  const fuego = interpolate(f, [suelta + 8, k(61.1)], [0.3, 1], cl);
  return (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={[mira(0, 1840, P - 250, 2.0), mira(86, 1850, P - 245, 2.1)]} seed={15} setProps={{ ...LIV_INV, fuego, lena: 0.2 }}
        detras={<PuertaEstufa x={1950} piso={P} abre={abre} />}
        medio={<>
          <Pj look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} poses={[{ f: 0, v: CUCLI }]} asiento={[{ f: 0, v: A_CUCLI }]}
            dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: k(61.04), v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: 0.2 } }, { f: k(61.04), v: { x: -1, y: 0.3 } }]}
            ajuste={ik2(
              ik("I", (q) => entre(q, k(59.4), k(59.95)) ? { x: 1874 + 152 - 152 * Math.cos(ramp(q, k(59.5), k(59.85)) * 1.3) - TX + 6, y: -185 } : entre(q, k(60.8), k(61.25)) ? { x: 1874 + 152 - 152 * Math.cos(ramp(q, k(60.85), k(61.2), 1, 0) * 1.3) - TX + 6, y: -185 } : null, A_CUCLI),
              ik("D", (q) => entre(q, k(59.9), suelta + 2) ? { x: 150, y: -180 } : null, A_CUCLI))}
            enManoD={(q: number) => q < suelta ? <Lenio s={0.7} rot={-10} /> : null} luz={BORDE_CALIDO} />
          {f >= suelta && vuelo < 1 && <g transform={`translate(${TX + 120 + 50 * vuelo},${P - 185 - 30 * Math.sin(vuelo * Math.PI)})`}><Lenio s={0.7 - 0.2 * vuelo} rot={-10} /></g>}
          <Chispas x={1950} y={P - 200} f={f} desde={suelta + 8} />
        </>} />
      <Pildora texto="IT NEEDS WOOD. A LOT." x={620} y={200} desde={k(60.0)} color={AMBAR} tam={44} />
    </AbsoluteFill>
  );
};

// ---------- 16 · una casa en el norte de Minnesota quema de 3 a 6 cuerdas por invierno ----------
export const P16Cuerdas: React.FC = () => {
  const f = useF();
  const k = kDe(62.02);
  const tres = k(65.46), seis = k(65.94);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#24304e, #5a6a8e 70%, #8a9ab8)" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <NieveCae f={f} n={70} x0={0} w={1920} y0={0} h={1080} />
        <rect x={0} y={880} width={1920} height={200} fill="#e9eef8" />
        {/* la casa */}
        <g>
          <rect x={250} y={640} width={300} height={240} fill="#8a3a2e" /><path d="M220,640 L400,520 L580,640 Z" fill="#2a1e22" /><path d="M220,640 L400,520 L580,640 L566,646 L400,540 L234,646 Z" fill="#f4f6fa" />
          <rect x={480} y={540} width={36} height={80} fill="#6a2a22" /><rect x={300} y={700} width={60} height={60} fill={AMBAR} opacity={0.8} /><rect x={420} y={780} width={56} height={100} fill="#3a2418" />
          <HumoChim x={498} y={530} f={f} color="#b8bcd0" />
        </g>
        <Pj look={THEO_INV} ruta={[{ f: 0, x: 640, y: 900 }]} poses={[{ f: 0, v: "parado" }, { f: tres, v: "señalar" }, { f: seis + 6, v: "manosCara" }]}
          caras={[{ f: 0, v: "neutral" }, { f: k(64.7), v: "duda" }, { f: seis, v: "sorpresa" }]} miradas={[{ f: 0, v: { x: -1, y: 0 } }, { f: k(64.6), v: { x: 1, y: -0.2 } }]} dir={[{ f: 0, v: -1 }, { f: k(64.6), v: 1 }]} />
        {/* las cuerdas: 3 llenas + 3 posibles */}
        {[0, 1, 2].map((i) => <BloqueCuerda key={i} x={860 + i * 340} y={880} w={300} h={150} prog={ramp(f, tres + i * 4, tres + i * 4 + 8)} seed={i} />)}
        {[0, 1, 2].map((i) => <BloqueCuerda key={`g${i}`} x={860 + i * 340} y={700} w={300} h={150} prog={ramp(f, seis + i * 4, seis + i * 4 + 8)} fantasma seed={i + 3} />)}
      </svg>
      <Pildora texto="ONE HOUSE · NORTHERN MINNESOTA" x={1180} y={150} desde={k(62.26)} hasta={k(65.2)} color={FRIO} tam={40} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: "Fredoka, sans-serif", fontWeight: 600, fontSize: 140, color: AMBAR, textShadow: "0 6px 20px rgba(0,0,0,.6)", letterSpacing: 2, paddingLeft: 300 }}>
        <span style={{ opacity: interpolate(f, [tres, tres + 6], [0, 1], cl) }}>3</span>
        <span style={{ opacity: interpolate(f, [seis, seis + 6], [0, 1], cl) }}> – 6</span>
        <span style={{ opacity: interpolate(f, [k(66.18), k(66.18) + 6], [0, 1], cl), fontSize: 90 }}> CORDS</span>
      </div>
      <Texto x={1110} y={330} desde={k(66.3)} tam={36} color="#f6ecd2">OF WOOD · ONE WINTER</Texto>
    </AbsoluteFill>
  );
};

// ---------- 17 · una cuerda: una pila de 4 × 4 × 8 pies ----------
export const P17Cuerda: React.FC = () => {
  const f = useF();
  const k = kDe(66.82);
  const X = 2300, W = 418, H = 209;
  const prog = ramp(f, k(67.3), k(68.4));
  const cota = (a: number) => interpolate(f, [a, a + 8], [0, 1], cl);
  return (
    <AbsoluteFill>
      <EscenaL Set={Barrio} pal={PAL} claves={[mira(0, 2480, B - 300, 1.3), mira(137, 2500, B - 300, 1.38)]} seed={17} setProps={{ hora: "invierno", luces: 0, nieve: 1, humo: 0 }}
        medio={<>
          <BloqueCuerda x={X} y={B} w={W} h={H} prog={prog} />
          {/* profundidad (4 pies hacia atrás) */}
          <path d={`M${X},${B - H} l70,-50 h${W} l-70,50 Z M${X + W},${B - H} l70,-50 v${H} l-70,50 Z`} fill="#6a4228" opacity={prog > 0.98 ? 0.9 : 0} />
          {/* cotas */}
          <g opacity={cota(k(67.78))} stroke={AMBAR} strokeWidth={5} fill="none"><path d={`M${X + W + 110},${B} V${B - H} M${X + W + 95},${B} h30 M${X + W + 95},${B - H} h30`} /></g>
          <text x={X + W + 130} y={B - H / 2 + 12} fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={34} fill={AMBAR} opacity={cota(k(67.78))}>4 FT HIGH</text>
          <g opacity={cota(k(69.42))} stroke={AMBAR} strokeWidth={5} fill="none"><path d={`M${X + W + 10},${B - H - 20} l70,-50`} /></g>
          <text x={X + W + 40} y={B - H - 90} fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={34} fill={AMBAR} opacity={cota(k(69.42))}>4 FT DEEP</text>
          <g opacity={cota(k(70.14))} stroke={AMBAR} strokeWidth={5} fill="none"><path d={`M${X},${B + 40} H${X + W} M${X},${B + 25} v30 M${X + W},${B + 25} v30`} /></g>
          <text x={X + W / 2} y={B + 90} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={34} fill={AMBAR} opacity={cota(k(70.14))}>8 FT LONG</text>
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 2210, y: B }]} poses={[{ f: 0, v: "parado" }, { f: k(68.5), v: "manosCintura" }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(68.6), v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(68.5), v: { x: 1, y: -0.2 } }]}
            ajuste={ik("D", (q) => q < k(68.4) ? { x: 80 + ((q % 12) < 6 ? 0 : 10), y: -Math.max(40, H * ramp(q, k(67.3), k(68.4))) - 10 } : null)}
            enManoD={(q: number) => q < k(68.4) ? <Lenio s={0.55} rot={0} /> : null} />
          <Aliento {...boca(2210, B)} f={f} />
        </>} />
      <Pildora texto="ONE CORD" x={1650} y={150} desde={k(66.98)} color={AMBAR} tam={46} />
    </AbsoluteFill>
  );
};

// ---------- 18 · noviembre: casi nada partido ----------
export const P18Noviembre: React.FC = () => {
  const f = useF();
  const k = kDe(71.4);
  const TX = 540;
  const toma = k(72.75);
  return (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={[mira(0, 440, P - 300, 1.5), mira(97, 470, P - 290, 1.62)]} seed={18} setProps={{ ...LIV_INV, lena: 0.04, hora: "invierno", mantas: false, plastico: false, cae: false }}
        medio={<>
          <Rodajas x={60} piso={P} />
          {f < toma && <g transform={`translate(390,${P - 14})`}><Lenio s={0.6} rot={0} /></g>}
          <Pj look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: -1 }]}
            poses={[{ f: 0, v: "manosCintura" }, { f: k(72.3), v: "arrodillado" }, { f: k(73.3), v: "parado" }]}
            caras={[{ f: 0, v: "duda" }, { f: k(73.1), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: k(73.3), v: { x: 1, y: -0.1 } }]}
            ajuste={ik("D", (q) => entre(q, k(72.4), toma + 2) ? { x: TX - 390, y: -16 } : q >= k(73.3) ? { x: 70, y: -230 } : null)}
            enManoD={(q: number) => q >= toma ? <Lenio s={0.6} rot={0} /> : null} />
        </>} />
      <Calendario texto="NOVEMBER" x={1480} y={90} desde={k(71.86)} tam={50} />
      <Pildora texto="ALMOST NOTHING SPLIT" x={1240} y={300} desde={k(73.1)} color="#e2483a" tam={42} />
    </AbsoluteFill>
  );
};

// ---------- 19 · Theo fue liniero: sabe de motosierras y de árboles ----------
export const P19Liniero: React.FC = () => {
  const f = useF();
  const k = kDe(74.62);
  const TX = 2440;
  const on = f > k(77.55);
  const corta = f > k(78.14);
  const corte = ramp(f, k(78.14), k(78.9));
  return (
    <AbsoluteFill>
      <EscenaL Set={Barrio} pal={PAL} claves={[mira(0, 2250, B - 330, 1.15), mira(k(76.9), 2280, B - 330, 1.2), mira(k(77.5), 2600, B - 240, 1.6, { curva: "inout" })]} seed={19} setProps={{ hora: "invierno", luces: 0, nieve: 1, humo: 0 }}
        medio={<>
          <Poste x={2120} piso={B} />
          {/* el tronco caído sobre dos caballetes */}
          {[2620, 2900].map((x) => <path key={x} d={`M${x - 40},${B} L${x + 40},${B - 160} M${x + 40},${B} L${x - 40},${B - 160}`} stroke="#5a3a24" strokeWidth={14} />)}
          <rect x={2560} y={B - 200} width={500 - (corta ? 0 : 0)} height={60} rx={28} fill="#7a5034" />
          {corte > 0 && <rect x={2640} y={B - 202} width={8 + corte * 16} height={64 * corte} fill="#3a2a22" />}
          <ellipse cx={3060} cy={B - 170} rx={14} ry={30} fill="#c89a6a" />
          <Aserrin x={2650} y={B - 170} f={f} on={corta && corte < 1} />
          <Pj look={THEO_INV} ruta={[{ f: 0, x: TX, y: B }]} dir={[{ f: 0, v: -1 }, { f: k(76.9), v: 1 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(75.36), v: "señalar" }, { f: k(76.6), v: "parado" }, { f: k(77.25), v: "tirarCarga" }, { f: k(77.55), v: "parado" }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(75.36), v: "feliz" }, { f: k(77.3), v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: -0.7 } }, { f: k(76.9), v: { x: 1, y: 0.2 } }]}
            ajuste={ik("D", (q) => q > k(77.6) ? { x: 2650 - 120 - TX + (corta ? Math.sin(q) * 3 : 0), y: -118 } : null)}
            enManoD={(q: number) => q > k(76.9) ? <Motosierra f={q} on={q > k(77.55)} /> : null} giros={on ? Array.from({ length: 30 }).map((_, i) => ({ f: k(77.6) + i * 3, v: i % 2 ? 0.03 : -0.03 })) : undefined} />
          <Aliento {...boca(TX, B, f < k(76.9) ? -1 : 1)} f={f} />
        </>} />
      <Pildora texto="THEO WAS A LINEMAN" x={1240} y={150} desde={k(75.36)} hasta={k(77.2)} color={AMBAR} tam={44} />
      <Pildora texto="HE KNOWS CHAINSAWS · AND TREES" x={1200} y={150} desde={k(77.4)} color={AMBAR} tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 20 · la regla de June en la heladera: nada de motosierra a solas ----------
export const P20Regla: React.FC = () => {
  const f = useF();
  const k = kDe(79.5);
  const esc = ramp(f, k(81.6), k(82.9));
  const JX = interpolate(f, [k(81.6), k(82.9)], [3130, 3190], cl);
  const xs = 3176, ys = P - 250;
  return (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={[mira(0, 3120, P - 300, 1.5), mira(k(81.4), 3080, P - 300, 1.62, { curva: "inout" })]} seed={20} setProps={{ ...LIV_INV, reglas: 2 }}
        medio={<>
          {/* nota nueva, más abajo en la puerta de la heladera */}
          <g transform={`rotate(2 ${xs + 80} ${ys})`}>
            <rect x={xs} y={ys - 50} width={170} height={96} fill="#fdf6d8" stroke="#e0d6b0" strokeWidth={2} />
            <rect x={xs + 70} y={ys - 58} width={30} height={14} fill="#e2483a" opacity={0.8} />
            <clipPath id="p20c"><rect x={xs} y={ys - 50} width={14 + 156 * esc} height={96} /></clipPath>
            <g clipPath="url(#p20c)">
              <text x={xs + 10} y={ys - 12} fontFamily="Caveat, cursive" fontWeight={700} fontSize={26} fill="#c0352c">NO CHAINSAWS</text>
              <text x={xs + 10} y={ys + 28} fontFamily="Caveat, cursive" fontWeight={700} fontSize={26} fill="#c0352c">ALONE!</text>
            </g>
          </g>
          <Pj look={JUNE} ruta={[{ f: 0, x: 3080, y: P }, { f: k(81.5), x: 3130 }, { f: k(82.9), x: 3190 }, { f: k(83.1), x: 3150 }]} dir={[{ f: 0, v: 1 }, { f: k(83.0), v: -1 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(83.0), v: "señalar" }]} caras={[{ f: 0, v: "determinado" }, { f: k(83.0), v: "enojo" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.1 } }]} seed={2} luz={BORDE_CALIDO}
            ajuste={ik("D", (q) => entre(q, k(81.5), k(82.95)) ? { x: xs + 20 + 150 * ramp(q, k(81.6), k(82.9)) - interpolate(q, [k(81.6), k(82.9)], [3130, 3190], cl), y: ys - P - 14 + (ramp(q, k(81.6), k(82.9)) > 0.55 ? 40 : 0) } : null)}
            enManoD={<g transform="rotate(-30)"><rect x={-4} y={-40} width={8} height={40} fill="#1a1a1a" /></g>} />
          <Pj look={THEO_CASA} ruta={[{ f: 0, x: 2620, y: P }, { f: k(81.4), x: 2620 }, { f: k(82.2), x: 2780 }]} dir={[{ f: 0, v: 1 }]}
            poses={[{ f: 0, v: "parado" }]} caras={[{ f: 0, v: "feliz" }, { f: k(82.6), v: "duda" }, { f: k(83.1), v: "triste" }]}
            enManoD={<Motosierra />} luz={BORDE_CALIDO} />
        </>} />
      <Pildora texto="JUNE'S RULE" x={1700} y={330} desde={k(81.28)} color={AMBAR} tam={40} />
      {JX > 0 && null}
    </AbsoluteFill>
  );
};

// ---------- 21 · cortan de a dos: uno pasa la sierra, el otro mira ----------
export const P21DeADos: React.FC = () => {
  const f = useF();
  const k = kDe(83.64);
  const postes = [2560, 2620, 2680];
  const cortes = [k(84.2), k(85.4), k(86.6)];
  const actual = cortes.filter((c) => f >= c - 14).length - 1;
  const TX = postes[Math.max(0, actual)] - 120;
  const ruta = [{ f: 0, x: postes[0] - 120, y: B }, { f: cortes[1] - 14, x: postes[0] - 120 }, { f: cortes[1] - 4, x: postes[1] - 120 }, { f: cortes[2] - 14, x: postes[1] - 120 }, { f: cortes[2] - 4, x: postes[2] - 120 }];
  const cae = (i: number) => ramp(f, cortes[i] + 10, cortes[i] + 22);
  return (
    <AbsoluteFill>
      <EscenaL Set={Barrio} pal={PAL} claves={[mira(0, 2400, B - 270, 1.35), mira(118, 2430, B - 270, 1.4)]} seed={21} setProps={{ hora: "invierno", luces: 0, nieve: 1, humo: 0 }}
        medio={<>
          {[2740, 2800, 2860, 2920].map((x) => <rect key={x} x={x} y={B - 220} width={34} height={220} fill="#a8875a" stroke="#6a5030" strokeWidth={3} />)}
          <rect x={2550} y={B - 190} width={420} height={16} fill="#8f7048" opacity={0.6} />
          {postes.map((x, i) => <g key={x}>
            <rect x={x} y={B - 150} width={34} height={150} fill="#a8875a" stroke="#6a5030" strokeWidth={3} />
            <g transform={`rotate(${cae(i) * 80} ${x + 34} ${B - 150})`}><rect x={x} y={B - 220} width={34} height={70} fill="#a8875a" stroke="#6a5030" strokeWidth={3} /></g>
            <Aserrin x={x + 6} y={B - 150} f={f} on={f >= cortes[i] && f < cortes[i] + 12} />
          </g>)}
          <Pj look={THEO_INV} ruta={ruta} poses={[{ f: 0, v: "parado" }]} caras={[{ f: 0, v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }]}
            ajuste={ik("D", (q) => ({ x: 0 + (entre(q, cortes[0], cortes[0] + 12) || entre(q, cortes[1], cortes[1] + 12) || entre(q, cortes[2], cortes[2] + 12) ? Math.sin(q * 2) * 4 : -10), y: -118 }))}
            enManoD={(q: number) => <Motosierra f={q} on />} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 2130, y: B }]} poses={[{ f: 0, v: "brazosCruzados" }, { f: k(86.56), v: "señalar" }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(86.56), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.1 } }]} seed={2} />
          <Aliento {...boca(2130, B)} f={f} desfase={10} /><Aliento {...boca(TX, B)} f={f} />
        </>} />
      <Pildora texto="ALWAYS TOGETHER" x={1200} y={150} desde={k(83.96)} color={AMBAR} tam={44} />
      <EtiquetaObj texto="RUNS THE SAW" desde={k(85.32)} px={960 + (TX - 2410) * 1.37} py={540 + (B - 300 - 630) * 1.37} tx={1250} ty={300} />
      <EtiquetaObj texto="WATCHES" desde={k(86.56)} px={960 + (2130 - 2420) * 1.4} py={540 + (B - 300 - 630) * 1.4} tx={520} ty={330} color={FRIO} />
    </AbsoluteFill>
  );
};

// ---------- 22 · lo inteligente no es lo de la película: no talar árboles verdes en el bosque ----------
const Bosque: React.FC<any> = ({ capa, f }) => {
  if (capa === "lejos") return <g><rect x={-2000} y={-2000} width={8000} height={5000} fill="#9fb4cc" /><path d="M-2000,620 L-600,420 L200,560 L1100,380 L2100,560 L3000,420 L4600,600 V1400 H-2000 Z" fill="#c8d4e4" /></g>;
  if (capa === "frente") return null;
  return (
    <g>
      {Array.from({ length: 16 }).map((_, i) => <Pino key={i} x={-300 + i * 190 + ((i * 53) % 60)} piso={880 - (i % 3) * 14} h={360 + ((i * 71) % 200)} color={i % 2 ? "#4a7a5a" : "#5a8a64"} nieve={0.4} />)}
      <rect x={-2000} y={880} width={8000} height={600} fill="#eef2fa" />
      <NieveCae f={f} n={60} x0={-200} w={3000} y0={0} h={900} />
    </g>
  );
};
export const P22Bosque: React.FC = () => {
  const f = useF();
  const k = kDe(87.56);
  const peli = k(90.1), no = k(91.14);
  const cae = ramp(f, peli + 6, peli + 26);
  const marco = interpolate(f, [peli, peli + 6], [0, 1], cl);
  const x = interpolate(f, [no, no + 10], [0, 1], cl);
  return (
    <AbsoluteFill>
      <EscenaL Set={Bosque} pal={PAL} claves={[mira(0, 1000, 600, 0.9), mira(k(89.9), 1100, 600, 1.0), mira(k(92.3), 1250, 640, 1.25, { curva: "inout" })]} seed={22}
        medio={<>
          {/* el árbol verde de la película */}
          <g transform={`rotate(${cae * 82} 980 880)`}><Pino x={980} piso={880} h={600} color="#2f7a44" nieve={0} /></g>
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 1700, y: 880 }, { f: k(89.4), x: 1420 }]} dir={[{ f: 0, v: -1 }]} enManoD={<Motosierra />}
            poses={[{ f: 0, v: "parado" }, { f: k(89.5), v: "pensar" }, { f: no, v: "parado" }, { f: k(92.36), v: "señalar" }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(88.0), v: "duda" }, { f: no, v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: -0.2 } }]}
            giros={Array.from({ length: 8 }).map((_, i) => ({ f: no + i * 4, v: i === 7 ? 0 : i % 2 ? 0.3 : -0.3 }))} />
        </>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <MarcoPeli x={420} y={200} w={1080} h={640} o={marco * (f < no + 40 ? 1 : 0)} rotulo="IN THE MOVIES" />
        <g opacity={x} stroke="#e2483a" strokeWidth={34} strokeLinecap="round"><path d={`M500,280 L${500 + 920 * x},${280 + 480 * x}`} /><path d={`M1420,280 L${1420 - 920 * x},${280 + 480 * x}`} /></g>
      </svg>
      <Pildora texto="THE SMART THING" x={1200} y={130} desde={k(88.02)} hasta={peli - 4} color={AMBAR} tam={44} />
      {f > peli + 18 && f < no && <Globo texto="TIMBER!" x={700} y={330} desde={peli + 18} hasta={no} tam={44} />}
      <Pildora texto="NO GREEN TREES FROM THE FOREST" x={1060} y={960} desde={no + 6} color="#e2483a" tam={44} />
    </AbsoluteFill>
  );
};

// ---------- 23 · madera seca: cercos, pallets, muebles viejos de casas vacías ----------
const Pallet: React.FC = () => <g transform="translate(-10,-20) rotate(-6)">{[0, 1, 2, 3].map((i) => <rect key={i} x={-80 + i * 46} y={-60} width={30} height={120} fill="#c8a070" stroke="#8a6a3a" strokeWidth={2} />)}<rect x={-86} y={-40} width={180} height={18} fill="#a88050" /><rect x={-86} y={20} width={180} height={18} fill="#a88050" /></g>;
const SillaVieja: React.FC = () => <g transform="translate(0,-30) rotate(8)"><rect x={-40} y={-10} width={80} height={14} fill="#8a5a3a" /><rect x={-40} y={-90} width={12} height={160} fill="#7a4a2e" /><rect x={28} y={0} width={12} height={70} fill="#7a4a2e" /><rect x={-40} y={-80} width={60} height={10} fill="#8a5a3a" /><rect x={-40} y={-56} width={60} height={10} fill="#8a5a3a" /></g>;
export const P23Seca: React.FC = () => {
  const f = useF();
  const k = kDe(93.14);
  const claves = [mira(0, 1000, B - 270, 1.2), mira(178, 1480, B - 270, 1.2)];
  const tx = (q: number) => interpolate(q, [0, 178], [880, 1560], cl);
  const jx = (q: number) => interpolate(q, [0, 178], [640, 1320], cl);
  const t = aPantalla(claves, f, tx(f) + 40, B - 200), j = aPantalla(claves, f, jx(f) + 40, B - 200);
  return (
    <AbsoluteFill>
      <EscenaL Set={Barrio} pal={PAL} claves={claves} seed={23} setProps={{ hora: "invierno", luces: 0, nieve: 1, humo: 0 }}
        medio={<>
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 880, y: B }, { f: 178, x: 1560 }]} poses={[{ f: 0, v: { hD: 60, cD: 60, hI: 50, cI: 70 } }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(97.04), v: "feliz" }]} enManoD={(q: number) => q < k(96.9) ? <Tablas /> : <SillaVieja />} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 640, y: B }, { f: 178, x: 1320 }]} poses={[{ f: 0, v: { hD: 60, cD: 60, hI: 50, cI: 70 } }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(95.42), v: "determinado" }]} enManoD={(q: number) => q > k(95.3) ? <Pallet /> : null} seed={2} />
          <Aliento {...boca(tx(f), B)} f={f} /><Aliento {...boca(jx(f), B)} f={f} desfase={20} />
        </>} />
      <Pildora texto="ONLY DRY WOOD" x={1200} y={130} desde={k(93.46)} color={AMBAR} tam={46} />
      <EtiquetaObj texto="OLD FENCES" desde={k(94.54)} hasta={k(96.8)} px={t.x} py={t.y} tx={t.x + 140} ty={300} />
      <EtiquetaObj texto="PALLETS · HARDWARE STORE" desde={k(95.42)} px={j.x} py={j.y} tx={j.x + 40} ty={390} tam={32} />
      <EtiquetaObj texto="OLD FURNITURE · EMPTY HOUSES" desde={k(97.04)} px={t.x} py={t.y - 30} tx={Math.min(1500, t.x + 160)} ty={250} tam={32} />
    </AbsoluteFill>
  );
};

// ---------- 24 · la seca arde fuerte; la verde silba, humea y apenas calienta ----------
const Termito2: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  const h = interpolate(t, [20, 80], [10, 150], cl);
  const col = t > 55 ? "#e2483a" : "#3a8adf";
  return <g><rect x={x - 30} y={y - 10} width={60} height={210} rx={16} fill="#f6f1e6" /><rect x={x - 7} y={y + 4} width={14} height={160} rx={7} fill="#fff" stroke="#c8c0b0" strokeWidth={2} /><rect x={x - 5} y={y + 164 - h} width={10} height={h} fill={col} /><circle cx={x} cy={y + 176} r={14} fill={col} /><text x={x} y={y + 236} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight={800} fontSize={30} fill="#f6ecd2">{Math.round(t)}°F</text></g>;
};
export const P24DosEstufas: React.FC = () => {
  const f = useF();
  const k = kDe(99.09);
  const verde = k(100.67);
  const tSeca = interpolate(f, [k(99.3), k(100.6)], [45, 74], cl);
  const tVerde = interpolate(f, [verde, k(102.7)], [45, 49], cl);
  return (
    <AbsoluteFill style={{ background: "#2a2028" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={0} width={958} height={1080} fill="#4a3030" /><rect x={962} y={0} width={958} height={1080} fill="#2a2e38" />
        <rect x={0} y={880} width={1920} height={200} fill="#3a2a22" />
        <Estufa x={560} piso={880} f={f} fuego={1} />
        <Halo x={560} y={700} r={600} color="#ff9a4a" fuerza={0.45} />
        <Estufa x={1520} piso={880} f={f} fuego={f > verde ? 0.18 : 0} />
        {f > verde && Array.from({ length: 10 }).map((_, i) => { const t = ((f - verde) * 2 + i * 20) % 200; return <circle key={i} cx={1520 + Math.sin(i + t / 20) * 50 - t * 0.6} cy={640 - t * 2.2} r={26 + t / 4} fill="#8a8a92" opacity={0.6 * (1 - t / 200)} />; })}
        <Pj look={THEO_CASA} ruta={[{ f: 0, x: 300, y: 880 }]} poses={[{ f: 0, v: { hD: 80, cD: 10, hI: 70, cI: 20 } }]} caras={[{ f: 0, v: "feliz" }]} luz={BORDE_CALIDO} />
        <Pj look={THEO_CASA} ruta={[{ f: 0, x: 1250, y: 880 }]} poses={[{ f: 0, v: "parado" }, { f: k(101.97), v: "manosCara" }, { f: k(102.4), v: "encogerse" }]}
          caras={[{ f: 0, v: "duda" }, { f: k(101.97), v: "asco" }, { f: k(102.4), v: "triste" }]} giros={Array.from({ length: 10 }).map((_, i) => ({ f: k(101.97) + i * 4, v: i % 2 ? 0.2 : -0.2 }))} />
        <Termito2 x={820} y={420} t={tSeca} />
        <Termito2 x={1800} y={420} t={f > verde ? tVerde : 45} />
        <rect x={958} y={0} width={4} height={1080} fill="#120f18" />
      </svg>
      <Pildora texto="DRY · BURNS HOT" x={560} y={290} desde={k(99.3)} color={AMBAR} tam={44} />
      <Pildora texto="GREEN · HISSES & SMOKES" x={1440} y={150} desde={verde} color="#b8bcc4" tam={40} />
      <Tic x={1600} y={560} f={f} en={[k(101.15), k(101.35), k(101.55)]} texto="hsss" color="#cfd4e4" />
    </AbsoluteFill>
  );
};

// ---------- 25 · día 60: la pila contra la pared de atrás, más alta que Theo ----------
export const P25Pila: React.FC = () => {
  const f = useF();
  const k = kDe(103.65);
  const tira = k(104.93);
  const vuelo = ramp(f, tira, tira + 12);
  const lena = interpolate(f, [0, tira + 12], [0.86, 1], cl);
  const alto = 14 * 44 + 2;
  const cota = ramp(f, k(106.39), k(106.39) + 10);
  return (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={[mira(0, 800, P - 360, 1.08), mira(130, 820, P - 370, 1.12)]} seed={25} setProps={{ ...LIV_INV, lena, mantas: true }}
        medio={<>
          <Pj look={THEO_CASA} ruta={[{ f: 0, x: 1300, y: P }, { f: k(105.9), x: 1300 }, { f: k(106.3), x: 1330 }]} dir={[{ f: 0, v: -1 }]}
            poses={[{ f: 0, v: "parado" }, { f: tira - 10, v: "tirarCarga" }, { f: tira, v: "tirarSuelta" }, { f: k(106.39), v: { hD: 170, cD: 0, hI: 20, cI: 30 } }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(106.39), v: "sorpresa" }, { f: k(106.95), v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: -0.4 } }, { f: k(106.4), v: { x: 1, y: -0.9 } }]}
            enManoD={(q: number) => q < tira ? <Lenio s={0.7} /> : null} luz={BORDE_CALIDO} />
          {f >= tira && vuelo < 1 && <g transform={`translate(${1240 - 760 * vuelo},${P - 240 - 380 * Math.sin(vuelo * Math.PI * 0.8) - 140 * vuelo})`}><Lenio s={0.7} rot={vuelo * 300} /></g>}
          <g opacity={cota}>
            <path d={`M20,${P - alto} H700`} stroke={AMBAR} strokeWidth={5} strokeDasharray="16 10" />
            <path d={`M700,${P - 312} H1290`} stroke="#f6ecd2" strokeWidth={5} strokeDasharray="16 10" />
            <text x={720} y={P - alto - 18} fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={34} fill={AMBAR}>THE STACK</text>
            <text x={1380} y={P - 300} fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={34} fill="#f6ecd2">THEO</text>
          </g>
        </>} />
      <Pildora texto="AGAINST THE BACK WALL" x={1340} y={170} desde={k(105.47)} hasta={k(106.3)} color={AMBAR} tam={40} />
      <Pildora texto="TALLER THAN THEO" x={1340} y={170} desde={k(106.39)} color={AMBAR} tam={46} />
    </AbsoluteFill>
  );
};

// ---------- 26 · ahora, el frío en sí ----------
export const P26Frio: React.FC = () => {
  const f = useF();
  const k = kDe(107.97);
  const rafaga = k(110.3);
  const tx = (q: number) => interpolate(q, [0, 142], [1800, 2160], cl);
  const jx = (q: number) => interpolate(q, [0, 142], [1600, 1960], cl);
  const inclina: Partial<Pose> = { tronco: 18, cabeza: 10, hI: 40, cI: 120, hD: 45, cD: 115 };
  const esc = ramp(f, k(109.11), k(112.4));
  return (
    <AbsoluteFill>
      <EscenaL Set={Superior} pal={PAL} claves={[mira(0, 1900, SUP_PISO - 280, 1.45), mira(142, 2080, SUP_PISO - 280, 1.5)]} seed={26} setProps={{ hora: "tormenta", luces: 0, nieve: 1, cae: true }}
        medio={<>
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 1800, y: SUP_PISO }, { f: 142, x: 2160 }]} poses={[{ f: 0, v: inclina }, { f: rafaga, v: { ...inclina, tronco: 30 } }, { f: rafaga + 20, v: inclina }]}
            caras={[{ f: 0, v: "cansado" }, { f: rafaga, v: "miedo" }, { f: k(111.43), v: "determinado" }]} luz={BORDE_FRIO}
            giros={[{ f: k(111.3), v: 0 }, { f: k(111.5), v: -0.5 }, { f: k(112.2), v: 0 }]} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 1600, y: SUP_PISO }, { f: 142, x: 1960 }]} poses={[{ f: 0, v: inclina }, { f: rafaga, v: "manosCara" }, { f: rafaga + 24, v: inclina }]}
            caras={[{ f: 0, v: "triste" }, { f: rafaga, v: "miedo" }]} luz={BORDE_FRIO} seed={2} />
          <Aliento {...boca(tx(f), SUP_PISO)} f={f} /><Aliento {...boca(jx(f), SUP_PISO)} f={f} desfase={20} />
        </>}
        frente={<Ventisca f={f} viento={f > rafaga && f < rafaga + 30 ? 18 : 10} n={240} />} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g opacity={esc}><EscarchaR x={0} y={0} w={1920} h={1080} o={0.8} /></g>
      </svg>
      <Pildora texto="NOW · THE COLD ITSELF" x={1200} y={170} desde={k(109.11)} color={FRIO} tam={48} />
    </AbsoluteFill>
  );
};

// ---------- 27 · promedio de enero: bajo cero; las peores noches, −30 ----------
export const P27Bajo: React.FC = () => {
  const f = useF();
  const k = kDe(112.69);
  const peor = k(116.71);
  const temp = f < peor ? interpolate(f, [k(112.9), k(115.0)], [12, -4], cl) : interpolate(f, [k(117.39), k(118.43)], [-4, -31], cl);
  return (
    <AbsoluteFill>
      <EscenaL Set={Puente} pal={PAL} claves={[mira(0, 1100, PUENTE_PISO - 300, 1.3), mira(194, 1120, PUENTE_PISO - 290, 1.42)]} seed={27} setProps={{ hora: "noche", luces: 0, nieve: 1, vapor: 1, cae: true, hielo: 0.6 }}
        medio={<>
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 960, y: PUENTE_PISO }]} poses={[{ f: 0, v: "parado" }, { f: k(117.39), v: "encogerse" }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(114.7), v: "duda" }, { f: k(118.05), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(118.1), v: { x: 1, y: -0.4 } }]} luz={BORDE_FRIO} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 1150, y: PUENTE_PISO }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "brazosCruzados" }, { f: k(117.39), v: "encogerse" }]}
            caras={[{ f: 0, v: "triste" }, { f: k(118.05), v: "miedo" }]} luz={BORDE_FRIO} seed={2} />
          <Aliento {...boca(960, PUENTE_PISO)} f={f} /><Aliento {...boca(1150, PUENTE_PISO, -1)} f={f} desfase={20} dir={-1} />
        </>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform="translate(1650 590) scale(0.78) translate(-960 -540)"><Termometro temp={temp} x={960} y={540} /></g>
      </svg>
      <Texto x={1180} y={140} desde={k(112.85)} hasta={peor - 6} tam={40} color="#f6ecd2">AVERAGE JANUARY LOW</Texto>
      <Texto x={1180} y={140} desde={peor} tam={40} color="#f6ecd2">THE WORST NIGHTS</Texto>
      {f > k(114.67) && <Texto x={1180} y={200} desde={k(114.67)} tam={120} color={FRIO}>{`${Math.round(temp) < 0 ? "−" : ""}${Math.abs(Math.round(temp))}°F`}</Texto>}
    </AbsoluteFill>
  );
};

// ---------- 28 · la piel expuesta se congela en minutos ----------
export const P28Piel: React.FC = () => {
  const f = useF();
  const k = kDe(119.15);
  const hielo = ramp(f, k(120.55), k(121.4));
  const cubre = k(121.45);
  return (
    <AbsoluteFill>
      <EscenaL Set={Barrio} pal={PAL} claves={[mira(0, 1640, B - 250, 2.3), mira(110, 1650, B - 250, 2.5)]} seed={28} setProps={{ hora: "tormenta", luces: 0, nieve: 1, cae: true }}
        medio={<>
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 1560, y: B }]} poses={[{ f: 0, v: "encogerse" }, { f: cubre, v: { hD: 60, cD: 130, hI: 40, cI: 120, cabeza: 10 } }]}
            caras={[{ f: 0, v: "cansado" }, { f: k(120.55), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} luz={BORDE_FRIO}
            ajuste={ik("D", (q) => q > cubre ? { x: 28, y: -250 } : null)} />
          {hielo > 0 && [[1590, B - 270, 12], [1600, B - 252, 9], [1578, B - 262, 8], [1606, B - 275, 7]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r * hielo} fill="#eaf6ff" opacity={0.9} />)}
          <Aliento {...boca(1560, B)} f={f} />
        </>} frente={<Ventisca f={f} viento={12} n={200} />} />
      <RelojHielo x={1480} y={360} desde={k(120.55)} prog={ramp(f, k(121.0), k(122.8))} rotulo="EXPOSED SKIN" valor="MIN" />
      <Pildora texto="FREEZES IN MINUTES" x={1480} y={700} desde={k(121.39)} color={FRIO} tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 29 · los caños revientan en las casas vacías: un crack como un tiro ----------
export const P29Canios: React.FC = () => {
  const f = useF();
  const k = kDe(122.81);
  const c = k(125.0);
  if (f < c) return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(960 560) scale(${ramp(f, 0, c, 1, 1.12)}) translate(-960 -560)`}>
          <CanioCorte f={f} hielo={ramp(f, k(122.9), k(124.05))} desde={k(124.11)} />
        </g>
      </svg>
      <Pildora texto="WATER PIPES · EMPTY HOUSES" x={1100} y={150} desde={k(122.9)} color={FRIO} tam={42} />
      {f > k(124.11) && <Globo texto="BURST!" x={1350} y={820} desde={k(124.11)} hasta={c} tam={70} />}
    </AbsoluteFill>
  );
  const crack1 = k(127.55), crack2 = k(129.63);
  const claves = [mira(c, 1900, B - 330, 0.62), mira(crack1, 1950, B - 330, 0.64), mira(k(128.9), 2900, B - 280, 1.0, { curva: "inout" })];
  const anillo = (x: number, y: number, d: number) => f >= d && f < d + 20 ? <circle cx={x} cy={y} r={40 + (f - d) * 22} fill="none" stroke="#ffffff" strokeWidth={12 - (f - d) * 0.5} opacity={1 - (f - d) / 20} /> : null;
  const chorro = (x: number, y: number, d: number) => f < d ? null : <g>{Array.from({ length: 9 }).map((_, i) => { const t = Math.min(1, (f - d) / 10); return <path key={i} d={`M${x},${y} q${(i - 4) * 30 * t},${-120 * t} ${(i - 4) * 60 * t},${-40 * t + 140 * t * t}`} stroke="#eaf6ff" strokeWidth={10} fill="none" strokeLinecap="round" />; })}<path d={`M${x - 60},${y + 20} l-10,${60 * Math.min(1, (f - d) / 20)} M${x + 40},${y + 20} l8,${80 * Math.min(1, (f - d) / 20)}`} stroke="#eaf6ff" strokeWidth={14} strokeLinecap="round" /></g>;
  const p1 = aPantalla(claves, f, 3220, B - 200);
  return (
    <AbsoluteFill>
      <EscenaL Set={Barrio} pal={PAL} claves={claves} seed={29} setProps={{ hora: "noche", luces: 0, nieve: 1, humo: 0, ventanaCasa: 1 }}
        medio={<>
          {chorro(3220, B - 200, crack1)}
          {anillo(3220, B - 200, crack1)}
          {anillo(3620, B - 260, crack2)}{chorro(3620, B - 260, crack2)}
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 2280, y: B }]} dir={[{ f: 0, v: -1 }, { f: crack1 + 2, v: 1 }]} poses={[{ f: 0, v: "parado" }, { f: crack1 + 2, v: "encogerse" }, { f: k(128.6), v: "señalar" }]}
            caras={[{ f: 0, v: "neutral" }, { f: crack1 + 2, v: "sorpresa" }, { f: crack2 + 2, v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} luz={BORDE_FRIO} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 2470, y: B }]} dir={[{ f: 0, v: -1 }, { f: crack1 + 3, v: 1 }, { f: crack2 + 3, v: -1 }]} poses={[{ f: 0, v: "brazosCruzados" }, { f: crack1 + 3, v: "manosCara" }]}
            caras={[{ f: 0, v: "neutral" }, { f: crack1 + 3, v: "miedo" }]} luz={BORDE_FRIO} seed={2} />
          <Aliento {...boca(2280, B)} f={f} /><Aliento {...boca(2470, B, -1)} f={f} dir={-1} desfase={22} />
        </>} frente={<NieveCae f={f} n={80} x0={-400} w={4400} y0={-300} h={1300} />} />
      <Pildora texto="YOU HEAR THEM AT NIGHT" x={1150} y={150} desde={k(126.15)} hasta={crack1 - 2} color={FRIO} tam={40} />
      {f >= crack1 && <Globo texto="CRACK!" x={Math.min(1700, p1.x)} y={Math.max(320, p1.y - 260)} desde={crack1} hasta={k(129.3)} tam={70} />}
      <Pildora texto="LIKE A GUNSHOT" x={1100} y={150} desde={crack2} color="#e2483a" tam={46} />
    </AbsoluteFill>
  );
};

// ---------- 30 · cada salida, una misión: capas, lana sí, algodón no ----------
const Prenda: React.FC<{ color: string; remera?: boolean }> = ({ color, remera }) => <g transform="translate(10,-30)"><path d={remera ? "M-30,-26 L-12,-32 Q0,-24 12,-32 L30,-26 L38,-10 L26,-4 L26,32 L-26,32 L-26,-4 L-38,-10 Z" : "M-32,-26 L-12,-32 Q0,-22 12,-32 L32,-26 L42,6 L28,10 L26,-4 L26,32 L-26,32 L-26,-4 L-28,10 L-42,6 Z"} fill={color} stroke="#00000044" strokeWidth={2} /></g>;
export const P30Capas: React.FC = () => {
  const f = useF();
  const k = kDe(130.67);
  const da = k(133.9), puesto = k(134.75);
  return (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={[mira(0, 2900, P - 340, 1.4), mira(254, 2920, P - 340, 1.46)]} seed={30} setProps={{ ...LIV_INV }}
        medio={<>
          <Pj look={f < puesto ? THEO_REMERA : THEO_LANA} ruta={[{ f: 0, x: 2960, y: P }]}
            poses={[{ f: 0, v: "parado" }, { f: da - 6, v: { hD: 70, cD: 20 } }, { f: da + 6, v: "agarrarAlto" }, { f: da + 12, v: { hD: 150, cD: 10, hI: 150, cI: 10 } }, { f: puesto, v: "firme" }, { f: k(137.6), v: "encogerse" }, { f: k(138.6), v: "parado" }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(132.69), v: "determinado" }, { f: puesto, v: "feliz" }, { f: k(137.6), v: "miedo" }, { f: k(138.6), v: "determinado" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 3250, y: P }, { f: k(133.4), x: 3250 }, { f: da, x: 3130 }, { f: da + 12, x: 3130 }, { f: da + 30, x: 3250 }]} dir={[{ f: 0, v: -1 }]}
            poses={[{ f: 0, v: "hablar" }, { f: k(133.4), v: { hD: 70, cD: 10 } }, { f: da + 12, v: "hablar" }, { f: k(135.17), v: { hD: 130, cD: 10 } }, { f: k(136.3), v: "hablar" }]}
            habla={[[k(131.0), k(133.4)], [k(134.4), k(139.0)]]} caras={[{ f: 0, v: "determinado" }, { f: k(135.17), v: "enojo" }, { f: k(136.4), v: "determinado" }]}
            giros={Array.from({ length: 8 }).map((_, i) => ({ f: k(135.3) + i * 4, v: i === 7 ? 0 : i % 2 ? 0.25 : -0.25 }))}
            enManoD={(q: number) => q < da + 2 ? <Prenda color="#7a6656" /> : q > k(135.0) && q < k(136.4) ? <Prenda color="#d8d2c4" remera /> : null} luz={BORDE_CALIDO} seed={2} />
        </>} />
      <Pildora texto="EVERY TRIP OUTSIDE = A MISSION" x={1120} y={140} desde={k(131.0)} color={AMBAR} tam={40} />
      <TarjetaRopa x={400} y={360} desde={k(133.57)} rotulo="LAYERS · WOOL" ok color="#7a6656" />
      <TarjetaRopa x={400} y={520} desde={k(135.17)} rotulo="COTTON" ok={false} color="#d8d2c4" prenda="remera" gotas={ramp(f, k(136.49), k(137.3))} />
      <TarjetaRopa x={400} y={680} desde={k(137.59)} rotulo="WET = COLD" ok={false} color="#5aa8e8" prenda="remera" gotas={1} calor={ramp(f, k(138.23), k(138.6))} />
    </AbsoluteFill>
  );
};

// ---------- 31 · la cara tapada, nunca solos, nunca de noche: de vuelta antes de las 4:45 ----------
const SolCard: React.FC<{ x: number; y: number; desde: number; baja: number }> = ({ x, y, desde, baja }) => {
  const f = useF();
  if (f < desde) return null;
  const o = interpolate(f, [desde, desde + 8], [0, 1], cl);
  return (
    <svg width={380} height={230} viewBox="0 0 380 230" style={{ position: "absolute", left: x - 190, top: y - 115, opacity: o }}>
      <defs><clipPath id="solc"><rect x={0} y={0} width={380} height={150} rx={24} /></clipPath><linearGradient id="solg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#3e4f74" /><stop offset="1" stopColor="#f2924a" /></linearGradient></defs>
      <rect x={0} y={0} width={380} height={230} rx={24} fill="#120f18" opacity={0.88} />
      <g clipPath="url(#solc)"><rect x={0} y={0} width={380} height={150} fill="url(#solg)" /><circle cx={190} cy={70 + baja * 110} r={40} fill="#ffcf8a" /><rect x={0} y={130} width={380} height={30} fill="#e9eef8" /></g>
      <text x={190} y={206} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={34} fill="#f6ecd2" letterSpacing={2}>SUNSET · 4:45 PM</text>
    </svg>
  );
};
export const P31Salida: React.FC = () => {
  const f = useF();
  const k = kDe(139.13);
  const vuelve = k(143.97);
  const tx = (q: number) => q < k(140.0) ? 2280 : q < vuelve ? interpolate(q, [k(140.0), vuelve], [2280, 1700], cl) : interpolate(q, [vuelve, 235], [1700, 1960], cl);
  const jx = (q: number) => tx(q) + 180;
  const ruta = (fx: (q: number) => number) => Array.from({ length: 24 }).map((_, i) => ({ f: Math.round((i * 235) / 23), x: fx((i * 235) / 23), y: B }));
  const tapa = (x: number, dir: number) => <rect x={x + dir * 2 - 26} y={B - 262} width={52} height={30} rx={12} fill="#efe3c8" opacity={ramp(f, k(139.4), k(139.8))} />;
  return (
    <AbsoluteFill>
      <EscenaL Set={Barrio} pal={PAL} claves={[mira(0, 2200, B - 300, 1.25), mira(vuelve, 1880, B - 300, 1.25), mira(235, 2000, B - 300, 1.3)]} seed={31} setProps={{ hora: "invierno", luces: 0, nieve: 1, cae: true, humo: 0 }}
        medio={<>
          <Pj look={THEO_INV} ruta={ruta(tx)} dir={[{ f: 0, v: -1 }, { f: vuelve, v: 1 }]} poses={[{ f: 0, v: "parado" }, { f: k(139.2), v: "manosCara" }, { f: k(139.8), v: "parado" }]}
            caras={[{ f: 0, v: "determinado" }, { f: vuelve, v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} />
          {tapa(tx(f), f < vuelve ? -1 : 1)}
          <Pj look={JUNE_INV} ruta={ruta(jx)} dir={[{ f: 0, v: -1 }, { f: vuelve, v: 1 }]} poses={[{ f: 0, v: "parado" }, { f: k(139.2), v: "manosCara" }, { f: k(139.8), v: "parado" }, { f: k(142.73), v: "señalar" }, { f: k(143.6), v: "parado" }]}
            caras={[{ f: 0, v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(142.73), v: { x: 1, y: -0.5 } }]} seed={2} />
          {tapa(jx(f), f < vuelve ? -1 : 1)}
        </>} />
      {["FACE COVERED", "NEVER ALONE", "NEVER AFTER DARK"].map((t, i) => <Pildora key={t} texto={`✓ ${t}`} x={560} y={330 + i * 78} desde={k([139.13, 140.13, 141.13][i])} color="#f6ecd2" tam={36} />)}
      <SolCard x={1560} y={230} desde={k(142.73)} baja={ramp(f, k(143.97), k(145.6))} />
    </AbsoluteFill>
  );
};

// ---------- 32 · el peligro que más le preocupa a June: invisible ----------
export const P32Invisible: React.FC = () => {
  const f = useF();
  const k = kDe(146.95);
  const inv = k(150.07), co = k(151.15);
  return (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={[mira(0, 960, P - 300, 1.35), mira(143, 1000, P - 300, 1.5)]} seed={32} setProps={{ ...LIV_INV, hora: "noche", fuego: 0.6 }}
        medio={<>
          <EnColchon look={THEO_CASA} x={720} poses={[{ f: 0, v: { ...SENT, tronco: 16, cabeza: 26 } }]} caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: { x: 1, y: 0.5 } }]} />
          <EnColchon look={JUNE} x={1070} seed={2} manta="#3a4a7a"
            poses={[{ f: 0, v: SENT }, { f: k(147.79), v: "pensar" }, { f: k(149.19), v: SENT }]}
            caras={[{ f: 0, v: "cansado" }, { f: k(147.37), v: "duda" }, { f: inv, v: "miedo" }]}
            miradas={[{ f: 0, v: { x: -1, y: 0.2 } }, { f: k(147.8), v: { x: 0, y: 0.3 } }, { f: inv, v: { x: 1, y: -0.7 } }]}
            ajuste={ik("I", (q) => entre(q, k(149.19), inv) ? { x: 60, y: -110 } : null, A_COLCHON)} />
          {f > inv && Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={1150 + i * 120 + Math.sin(f / 20 + i) * 30} cy={P - 340 + Math.cos(f / 25 + i) * 30} r={60} fill="none" stroke="#cfd4e4" strokeWidth={3} strokeDasharray="8 10" opacity={interpolate(f, [inv, inv + 10], [0, 0.6], cl)} />)}
          {f > co && [0, 1, 2, 3].map((i) => <MoleculaCO key={i} x={1180 + i * 130} y={P - 340 + Math.sin(f / 15 + i) * 24} s={0.7} rot={f * 2 + i * 50} o={interpolate(f, [co + i * 3, co + i * 3 + 8], [0, 1], cl)} />)}
          <Aliento {...boca(1070, P, 1, A_COLCHON)} f={f} desfase={10} />
        </>} />
      <Pildora texto="THE DANGER JUNE FEARS MOST" x={1180} y={150} desde={k(147.79)} hasta={inv - 4} color={AMBAR} tam={40} />
      <Pildora texto="INVISIBLE" x={1260} y={150} desde={inv} color="#cfd4e4" tam={46} />
      <Pildora texto="CARBON MONOXIDE" x={1260} y={230} desde={co} color="#e2483a" tam={46} />
    </AbsoluteFill>
  );
};

// ---------- 33 · generadores y parrillas adentro: sin olor, sin aviso, sólo sueño ----------
const Parrilla: React.FC<{ f: number; humo: number }> = ({ f, humo }) => (
  <g>
    <rect x={-70} y={-120} width={140} height={70} rx={20} fill="#2a2a30" /><rect x={-60} y={-130} width={120} height={14} fill="#5a5a62" />
    {[-40, 40].map((d) => <rect key={d} x={d - 4} y={-50} width={8} height={50} fill="#2a2a30" />)}
    <rect x={-50} y={-128} width={100} height={6} fill="#ff8a3a" opacity={humo} />
    {humo > 0 && Array.from({ length: 6 }).map((_, i) => { const t = (f * 1.5 + i * 25) % 150; return <circle key={i} cx={Math.sin(i + t / 18) * 50} cy={-140 - t * 2} r={30 + t / 3} fill="#a0a4ac" opacity={0.3 * humo * (1 - t / 150)} />; })}
  </g>
);
const Generador: React.FC<{ f: number; on: boolean }> = ({ f, on }) => (
  <g transform={`translate(${on ? Math.sin(f * 3) * 2 : 0},0)`}>
    <rect x={-80} y={-130} width={160} height={110} rx={10} fill="#e0b020" stroke="#7a5a10" strokeWidth={4} /><rect x={-90} y={-140} width={180} height={14} rx={6} fill="#3a3440" />
    <rect x={-60} y={-110} width={60} height={50} rx={6} fill="#3a3440" /><circle cx={40} cy={-80} r={18} fill="#3a3440" />
    {[-60, 60].map((d) => <circle key={d} cx={d} cy={-12} r={14} fill="#2a2228" />)}
    {on && Array.from({ length: 5 }).map((_, i) => { const t = (f * 2 + i * 30) % 150; return <circle key={i} cx={90 + t * 0.8} cy={-60 - t * 1.2} r={14 + t / 4} fill="#8a8f9e" opacity={0.4 * (1 - t / 150)} />; })}
  </g>
);
export const P33Parrilla: React.FC = () => {
  const f = useF();
  const k = kDe(151.73);
  const X = COCINA_PUNTOS.cocina, CP = COCINA_PISO;
  const gen = k(155.31), grill = k(155.77), duerme = k(159.83);
  const ppm = interpolate(f, [gen + 10, k(160.6)], [0, 420], cl);
  const VX = X - 420;
  return (
    <AbsoluteFill>
      <EscenaL Set={Cocina} pal={PAL} claves={[mira(0, X - 250, CP - 330, 1.15), mira(k(155.0), X - 250, CP - 300, 1.2), mira(k(159.6), X - 330, CP - 230, 1.75, { curva: "inout" })]} seed={33} setProps={{}}
        medio={<>
          <g transform={`translate(${X - 160},${CP})`}><Generador f={f} on={f > gen + 4} /></g>
          <g transform={`translate(${X + 60},${CP})`}><Parrilla f={f} humo={f > grill ? 1 : 0} /></g>
          <Silla x={VX - 90} piso={CP} dir={1} />
          <GasCO x={X - 1200} w={2400} techo={CP - 900} piso={CP} n={interpolate(f, [gen + 10, k(160.6)], [0, 0.85], cl)} f={f} />
          <Pj look={VOS} ruta={[{ f: 0, x: X - 260, y: CP }, { f: gen - 6, x: X - 260 }, { f: k(156.6), x: VX }, { f: duerme, x: VX }, { f: duerme + 10, x: VX - 80 }]}
            dir={[{ f: 0, v: 1 }, { f: k(156.0), v: -1 }, { f: k(157.0), v: 1 }]}
            poses={[{ f: 0, v: "parado" }, { f: gen - 4, v: "tirarCarga" }, { f: gen + 4, v: "parado" }, { f: k(157.51), v: { cabeza: -20, tronco: -4 } }, { f: k(158.4), v: "parado" }, { f: duerme + 8, v: { ...SENT, tronco: 24, cabeza: 34, hD: 10, cD: 10, hI: 10, cI: 10 } }]}
            asiento={[{ f: 0, v: undefined }, { f: duerme + 8, v: A_SILLA }]}
            caras={[{ f: 0, v: "neutral" }, { f: grill, v: "feliz" }, { f: k(157.5), v: "duda" }, { f: duerme, v: "cansado" }]} seed={4}
            ajuste={ik("D", (q) => entre(q, gen - 12, gen - 4) ? { x: 60, y: -110 } : null)} />
        </>} />
      <AbsoluteFill style={{ background: "#0a0810", opacity: interpolate(f, [k(160.0), k(161.17)], [0, 0.75], cl) }} />
      <Pildora texto="AFTER EVERY BIG STORM" x={1180} y={150} desde={k(152.93)} hasta={k(155.1)} color={AMBAR} tam={40} />
      <Pildora texto="PEOPLE DIE" x={1180} y={230} desde={k(154.03)} hasta={k(155.1)} color="#e2483a" tam={44} />
      <Pildora texto="GENERATORS & GRILLS · INDOORS" x={1180} y={150} desde={k(155.31)} color="#e2483a" tam={38} />
      <MedidorPPM x={600} y={210} ppm={ppm} desde={gen + 8} />
      <Pildora texto="NO SMELL" x={500} y={340} desde={k(157.51)} color="#f6ecd2" tam={40} />
      <Pildora texto="NO WARNING" x={500} y={420} desde={k(158.31)} color="#f6ecd2" tam={40} />
      <Pildora texto="YOU JUST GET SLEEPY" x={500} y={500} desde={duerme} color="#cfd4e4" tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 34 · June saquea la ferretería: alarmas de CO a pila ----------
export const P34Ferreteria: React.FC = () => {
  const f = useF();
  const k = kDe(161.17);
  const SP = SUPER_PISO;
  const SX = 1500;
  const t1 = k(162.85), t2 = k(163.6);
  const JX = (q: number) => interpolate(q, [0, k(162.5)], [1100, SX - 70], cl);
  return (
    <AbsoluteFill>
      <EscenaL Set={Supermercado} pal={PAL} claves={[mira(0, SX - 120, SP - 300, 1.5), mira(100, SX - 80, SP - 300, 1.6)]} seed={34} setProps={{}}
        detras={<g>
          <rect x={SX - 40} y={SP - 420} width={420} height={420} fill="#5a4a3a" />
          {[SP - 300, SP - 160].map((y) => <rect key={y} x={SX - 50} y={y} width={440} height={14} fill="#3a2a22" />)}
          {Array.from({ length: 6 }).map((_, i) => (i === 0 && f > t1) || (i === 1 && f > t2) ? null : <AlarmaCO key={i} x={SX + 10 + (i % 3) * 120} y={(i < 3 ? SP - 340 : SP - 200) + 4} s={0.7} caja />)}
          <rect x={SX - 20} y={SP - 470} width={380} height={44} rx={8} fill="#e2483a" /><text x={SX + 170} y={SP - 438} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={28} fill="#fff">HARDWARE · CO ALARMS</text>
        </g>}
        medio={<Pj look={JUNE_INV} ruta={[{ f: 0, x: 1100, y: SP }, { f: k(162.5), x: SX - 70 }]} poses={[{ f: 0, v: "parado" }]}
          caras={[{ f: 0, v: "determinado" }, { f: t2 + 4, v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: -0.3 } }]} seed={2}
          ajuste={ik("D", (q) => entre(q, t1 - 8, t1 + 2) ? { x: SX + 10 - JX(q), y: -320 + 4 } : entre(q, t2 - 8, t2 + 2) ? { x: SX + 130 - JX(q), y: -320 + 4 } : q > t1 + 2 ? { x: 40, y: -170 } : null)}
          enManoD={(q: number) => q > t1 + 2 ? <g transform="translate(0,-10)"><AlarmaCO s={0.55} caja />{q > t2 + 2 && <g transform="translate(14,10)"><AlarmaCO s={0.55} caja /></g>}</g> : null} />} />
      <Pildora texto="JUNE RAIDS THE HARDWARE STORE" x={1140} y={150} desde={k(161.33)} hasta={k(162.7)} color={AMBAR} tam={38} />
      <Pildora texto="BATTERY CO ALARMS" x={1140} y={150} desde={k(162.79)} color="#e2483a" tam={42} />
    </AbsoluteFill>
  );
};

// ---------- 35 · dos alarmas al lado de los colchones ----------
export const P35Alarmas: React.FC = () => {
  const f = useF();
  const k = kDe(164.5);
  const p1 = k(164.95), p2 = k(165.75);
  const JX = 1340;
  return (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={[mira(0, 1080, P - 260, 1.75), mira(92, 1110, P - 250, 1.9)]} seed={35} setProps={{ ...LIV_INV }}
        medio={<>
          {f > p1 && <AlarmaCO x={1262} y={P - 32} s={0.75} on={false} f={f} />}
          {f > p2 && <AlarmaCO x={1262} y={P - 108} s={0.75} on={false} f={f} />}
          <EnColchon look={THEO_CASA} x={720} caras={[{ f: 0, v: "cansado" }, { f: k(166.0), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.2 } }]} />
          <Pj look={JUNE} ruta={[{ f: 0, x: JX, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "arrodillado" }, { f: k(166.3), v: "arrodillado" }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(166.1), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.6 } }, { f: k(166.1), v: { x: 1, y: 0 } }]} seed={2}
            ajuste={ik("D", (q) => q < p1 + 2 ? { x: JX - 1262, y: -30 - 60 * (1 - ramp(q, p1 - 14, p1)) } : entre(q, p2 - 14, p2 + 2) ? { x: JX - 1262, y: -108 - 50 * (1 - ramp(q, p2 - 14, p2)) } : null)}
            enManoD={(q: number) => q < p1 || entre(q, p2 - 16, p2) ? <AlarmaCO s={0.5} /> : null} />
        </>} />
      <Pildora texto="TWO, NEXT TO THE MATTRESSES" x={1150} y={150} desde={k(164.81)} color={AMBAR} tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 36 · una noche de diciembre, una grita ----------
export const P36Grita: React.FC = () => {
  const f = useF();
  const k = kDe(167.57);
  const al = k(169.61);
  const on = f > al;
  return (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={[mira(0, 1050, P - 260, 1.5), mira(al, 1060, P - 260, 1.55), mira(al + 14, 1200, P - 200, 2.2, { curva: "inout" })]} seed={36} setProps={{ ...LIV_INV, hora: "noche", fuego: 0.3, alarma: on }}
        medio={<>
          <AlarmaCO x={1262} y={P - 32} s={0.75} on={on} f={f} /><AlarmaCO x={1262} y={P - 108} s={0.75} on={on} f={f + 3} />
          <EnColchon look={THEO_CASA} x={720} poses={[{ f: 0, v: { ...SENT, tronco: 16, cabeza: 26 } }, { f: al + 4, v: SENT }]}
            caras={[{ f: 0, v: "cansado" }, { f: al + 4, v: "sorpresa" }, { f: al + 20, v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: 0.5 } }, { f: al + 4, v: { x: 1, y: 0.3 } }]} />
          <EnColchon look={JUNE} x={1070} seed={2} manta="#3a4a7a" poses={[{ f: 0, v: { ...SENT, tronco: 16, cabeza: 26 } }, { f: al + 4, v: "manosCara" }]}
            caras={[{ f: 0, v: "cansado" }, { f: al + 3, v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: 0.5 } }, { f: al + 4, v: { x: 1, y: 0.5 } }]} />
          {on && <Halo x={1262} y={P - 70} r={700} color="#ff2a2a" fuerza={0.3 + 0.2 * Math.sin(f / 2)} />}
        </>} />
      <Calendario texto="DECEMBER" x={1480} y={90} desde={k(168.07)} tam={46} />
      <Tic x={1240} y={420} f={f} en={[al, al + 10, al + 20, al + 30, al + 40]} texto="BEEP" color="#ff5a4a" />
    </AbsoluteFill>
  );
};

// ---------- 37 · el caño de la estufa, tapado de hollín ----------
export const P37Hollin: React.FC = () => {
  const f = useF();
  const k = kDe(170.81);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(960 400) scale(${ramp(f, 0, 56, 1, 1.08)}) translate(-960 -400)`}>
          <HollinCorte f={f} hollin={ramp(f, 0, k(171.9), 0.25, 1)} vuelve={ramp(f, k(171.7), k(172.3))} />
        </g>
      </svg>
      <Pildora texto="THE STOVEPIPE" x={520} y={330} desde={k(170.87)} color={AMBAR} tam={44} />
      <Pildora texto="CLOGGED WITH SOOT" x={520} y={420} desde={k(171.61)} color="#e2483a" tam={44} />
      <EtiquetaObj texto="SOOT" desde={k(172.0)} px={1060} py={260} tx={1460} ty={260} color="#e2483a" />
    </AbsoluteFill>
  );
};

// ---------- 38 · abren la puerta a −20 y se sientan en la nieve en bolsas de dormir ----------
export const P38Nieve: React.FC = () => {
  const f = useF();
  const k = kDe(172.69);
  const c = k(173.95);
  const ab = ramp(f, k(172.75), k(173.3));
  if (f < c) {
    const JX = (q: number) => pomo(3550, P, 240, ramp(q, k(172.75), k(173.3)), true).x - 66;
    return (
      <AbsoluteFill>
        <EscenaL Set={Living} pal={PAL} claves={[mira(0, 3400, P - 300, 1.3), mira(c, 3430, P - 300, 1.36)]} seed={38} setProps={{ ...LIV_INV, hora: "noche", mantas: false, alarma: true, fuego: 0.2 }}
          medio={<>
            <Puerta x={3550} piso={P} abre={ab} der luzVano="#3a4a7a" />
            {ab > 0.3 && <NieveCae f={f} n={40} x0={3300} w={500} y0={P - 600} h={600} viento={-4} />}
            <Pj look={THEO_INV} ruta={[{ f: 0, x: 3200, y: P }]} poses={[{ f: 0, v: { hD: 60, cD: 60, hI: 50, cI: 70 } }]} caras={[{ f: 0, v: "miedo" }]} enManoD={<BolsaRoll color="#2f5a8a" />} />
            <Pj look={JUNE_INV} ruta={Array.from({ length: 12 }).map((_, i) => { const q = (i * c) / 11; return { f: Math.round(q), x: JX(q), y: P }; })} caras={[{ f: 0, v: "determinado" }]} seed={2}
              ajuste={ik("D", (q) => q < k(173.4) ? { x: pomo(3550, P, 240, ramp(q, k(172.75), k(173.3)), true).x - JX(q), y: pomo(3550, P, 240, ramp(q, k(172.75), k(173.3)), true).y - P } : null)} />
          </>} />
      </AbsoluteFill>
    );
  }
  const limpia = ramp(f, k(176.0), k(177.6));
  return (
    <AbsoluteFill>
      <EscenaL Set={Barrio} pal={PAL} claves={[mira(c, 2100, B - 280, 1.1), mira(175, 2220, B - 250, 1.3)]} seed={38} setProps={{ hora: "noche", luces: 0, nieve: 1, cae: true, humo: 0, ventanaCasa: 1 }}
        medio={<>
          <rect x={1870} y={B - 130} width={60} height={130} fill="#ffcf6e" opacity={0.85} />
          {Array.from({ length: 8 }).map((_, i) => { const t = ((f / 40) + i / 8) % 1; return <circle key={i} cx={1900 + t * 220} cy={B - 80 - t * 240} r={30 + t * 50} fill="#8a8f9e" opacity={(1 - t) * 0.55 * (1 - limpia)} />; })}
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 2260, y: B }]} poses={[{ f: 0, v: SUELO }]} asiento={[{ f: 0, v: A_SUELO }]} caras={[{ f: 0, v: "cansado" }, { f: k(177.15), v: "feliz" }]} luz={BORDE_FRIO} miradas={[{ f: 0, v: { x: -1, y: 0 } }]} dir={[{ f: 0, v: -1 }]} />
          <BolsaDormir x={2260} y={B + 60} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 2470, y: B }]} poses={[{ f: 0, v: SUELO }]} asiento={[{ f: 0, v: A_SUELO }]} caras={[{ f: 0, v: "triste" }, { f: k(177.3), v: "feliz" }]} luz={BORDE_FRIO} seed={2} dir={[{ f: 0, v: -1 }]} />
          <BolsaDormir x={2470} y={B + 60} color="#7a3a3a" />
          <Aliento {...boca(2260, B, -1, A_SUELO)} f={f} dir={-1} /><Aliento {...boca(2470, B, -1, A_SUELO)} f={f} dir={-1} desfase={20} />
        </>} frente={<NieveCae f={f} n={70} x0={1000} w={2400} y0={-200} h={1200} />} />
      <Pildora texto="SITTING IN THE SNOW" x={1200} y={150} desde={k(175.01)} color={FRIO} tam={40} />
      <MedidorPPM x={1340} y={220} ppm={interpolate(f, [k(176.0), k(177.6)], [320, 8], cl)} desde={k(175.9)} />
      <Pildora texto="UNTIL THE ROOM CLEARS" x={960} y={960} desde={k(177.15)} color="#5ad07a" tam={34} />
    </AbsoluteFill>
  );
};
const BolsaRoll: React.FC<{ color: string }> = ({ color }) => <g transform="translate(0,-20)"><ellipse cx={0} cy={0} rx={60} ry={34} fill={color} /><ellipse cx={-54} cy={0} rx={10} ry={30} fill="#00000033" /><rect x={-50} y={-6} width={100} height={8} fill="#00000033" /></g>;

// ---------- 39 · esa alarma costó 9 dólares: salvó a media humanidad ----------
export const P39Nueve: React.FC = () => {
  const k = kDe(178.53);
  const mitad = k(181.03);
  return (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={[mira(0, 1110, P - 240, 2.4), mira(k(180.7), 1120, P - 240, 2.5), mira(k(181.6), 980, P - 280, 1.35, { curva: "inout" })]} seed={39} setProps={{ ...LIV_INV, hora: "alba", fuego: 0.4, cae: false }}
        medio={<>
          <EnColchon look={THEO_CASA} x={720} caras={[{ f: 0, v: "cansado" }, { f: mitad, v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.1 } }]} />
          <EnColchon look={JUNE} x={1070} seed={2} manta="#3a4a7a" poses={[{ f: 0, v: { ...SENT, hD: 60, cD: 60 } }]}
            caras={[{ f: 0, v: "triste" }, { f: mitad, v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.6 } }, { f: mitad + 10, v: { x: -1, y: 0 } }]}
            enManoD={(q: number) => <g><AlarmaCO s={0.5} /><Precio x={20} y={18} texto="$9" f={q} s={0.55} /></g>} />
        </>} />
      <Texto x={470} y={230} desde={k(178.67)} tam={150} color={AMBAR}>$9</Texto>
      <Texto x={470} y={400} desde={k(178.95)} tam={40} color="#f6ecd2">ONE CO ALARM</Texto>
      <MitadHumanidad x={1540} y={330} desde={mitad} />
    </AbsoluteFill>
  );
};

// ---------- 40 · día 83: Navidad, probablemente ----------
export const P40Dia83: React.FC = () => {
  const f = useF();
  const k = kDe(182.89);
  const nX = 2440, nY = P - 176;
  const rayas = Math.round(interpolate(f, [k(183.0), k(184.0)], [78, 83], cl));
  const pen = (q: number) => { const r = Math.round(interpolate(q, [k(183.0), k(184.0)], [78, 83], cl)); return { x: nX + 14 + ((r - 1) % 20) * 5, y: nY + 8 + Math.floor((r - 1) / 20) * 0 }; };
  const JX = 2330;
  return (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={[mira(0, 2500, P - 250, 1.8), mira(155, 2520, P - 250, 1.95)]} seed={40} setProps={{ ...LIV_INV, hora: "noche", vela: true }}
        medio={<>
          <Silla x={JX - 20} piso={P} dir={1} />
          {/* el cuaderno rojo abierto con las rayitas de los días */}
          <rect x={nX - 4} y={nY - 14} width={140} height={22} rx={2} fill="#f4ecd6" stroke="#c9bfa6" strokeWidth={2} />
          <rect x={nX + 66} y={nY - 14} width={2} height={22} fill="#c9bfa6" />
          {Array.from({ length: Math.min(20, rayas - 63) }).map((_, i) => <path key={i} d={`M${nX + 6 + (i % 5) * 4 + Math.floor(i / 5) * 26},${nY - 10} v14`} stroke="#2a2228" strokeWidth={2} />)}
          <Pj look={JUNE} ruta={[{ f: 0, x: JX, y: P }]} poses={[{ f: 0, v: SENT }, { f: k(186.23), v: { ...SENT, hI: 60, cI: -70, hD: 60, cD: -70 } }]} asiento={[{ f: 0, v: A_SILLA }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(184.97), v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: 0.6 } }, { f: k(184.2), v: { x: 1, y: 0 } }]} seed={2} luz={BORDE_CALIDO}
            ajuste={ik("D", (q) => q < k(184.1) ? { x: pen(q).x - JX, y: pen(q).y - P - 4 } : null, A_SILLA)} enManoD={<g transform="rotate(-30)"><rect x={-3} y={-34} width={6} height={34} fill="#e0a23a" /></g>} />
          <Pj look={THEO_CASA} ruta={[{ f: 0, x: 2830, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "parado" }, { f: k(184.19), v: { hD: 110, cD: 20 } }, { f: k(186.23), v: { hD: 110, cD: 20, hI: 60, cI: -70 } }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(184.19), v: "feliz" }, { f: k(186.23), v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: 0.2 } }]} luz={BORDE_CALIDO}
            enManoD={<g transform="translate(0,-30)"><path d="M0,40 L0,-30" stroke="#5a3a24" strokeWidth={5} />{[-20, -5, 10].map((y, i) => <path key={i} d={`M0,${y} l-26,16 M0,${y} l26,16`} stroke="#3a7a50" strokeWidth={7} strokeLinecap="round" />)}<path d="M0,-44 l5,10 h10 l-8,7 l3,10 l-10,-6 l-10,6 l3,-10 l-8,-7 h10 Z" fill="#ffcf6e" /></g>} />
        </>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, opacity: interpolate(f, [k(184.19), k(184.4)], [0, 1], cl) }}>
        <g transform="translate(1010 110)">
          <rect x={0} y={0} width={300} height={250} rx={18} fill="#f6f1e6" /><rect x={0} y={0} width={300} height={64} rx={18} fill="#c0352c" />
          <text x={150} y={46} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={36} fill="#fff" letterSpacing={3}>DEC</text>
          <text x={120} y={190} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={120} fill="#2a2228">25</text>
          <text x={250} y={200} textAnchor="middle" fontFamily="Caveat, cursive" fontWeight={700} fontSize={130} fill="#e2483a" opacity={interpolate(f, [k(184.97), k(185.2)], [0, 1], cl)}>?</text>
        </g>
      </svg>
      <Pildora texto="CHRISTMAS · PROBABLY" x={1160} y={420} desde={k(184.97)} color={AMBAR} tam={36} />
    </AbsoluteFill>
  );
};
