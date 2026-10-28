// lc02 · planos 1-40 (0 → 188,05 s): cuadro 0 = la miniatura (ventana escarchada, los dos bajo mantas junto a la estufa),
// enero a −28, un solo cuarto, la leña (cuerdas, motosierra de a dos, madera seca), el frío, el CO y la alarma de US$9, día 83.
// Rehechura 26-oct: cámara sin motion blur (EscenaL), sentados con asiento, cada acción que dice la voz se VE (puertas,
// mantas, plástico, leña a la estufa, el caño que revienta, vestirse, el hollín), un componente por escena que lleva el dato.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Cono, Haces, Halo } from "../../anikit/luz";
import { Calendario, Globo, Pildora } from "../../anikit/pantalla";
import { Carrito, Celular, Lata } from "../../anikit/props";
import { Cocina, COCINA_PISO, COCINA_PUNTOS, Silla } from "../../anikit/sets/cocina";
import { SUPER_PISO, SUPER_PUNTOS } from "../../anikit/sets/super";
import { alcanzar, Look, Pose, POSES } from "../../anikit/personaje";
import { AMBAR, BORDE_CALIDO, BORDE_FRIO, JUNE, JUNE_INV, PAL, THEO, THEO_CASA, THEO_INV } from "../elenco";
import { FRIO } from "../hud";
import { NieveCae } from "../mundo/comun";
import { Panorama, PANO_PISO } from "../mundo/panorama";
import { Superior, SUP_PISO } from "../mundo/superior";
import { Puente, PUENTE_PISO } from "../mundo/puente";
import { Barrio, BARRIO_PISO, Estufa, Living, LIV_PISO } from "../mundo/casa";
import { StMarys, SM_PISO } from "../mundo/hospital";
import { CuadernoGrande, CuadernoMano, kDe, Pj as PjBase } from "./base";
import { Manta, Motosierra, Pino, Tablas, Termometro } from "./lc02_props";
import {
  A_COLCHON, A_CUCLI, A_SILLA, A_SUELO, Aliento, AlarmaCO, aPantalla, Aserrin, BarraPower, CasaSeccion, Chispas, cl, CUCLI,
  EscarchaR, EscenaL, EtiquetaObj, HumoChim, io, Lenio, MarcoPeli, MedidorPPM,
  MantaVano, PlasticoVentana, pomo, Poste, Precio, Puerta, PuertaEstufa, RelojHielo, Rodajas, SENT, SUELO, Texto, Tic, Ventisca,
} from "./lc02_planos1_comp";
import { CalPared as CalParedE, Cota as CotaE, NotaReglas as NotaReglasE, PilaLena as PilaLenaE, puntaNota as puntaNotaE, RolloCinta as RolloCintaE, Rotulo3 as Rotulo3E, Servicio as ServicioE, TextoBarrido as TextoBarridoE, THEO_LINIERO as THEO_LINIERO_E, Tira90 as Tira90E } from "./v3e_v3"; // v3e (P01-P20): alias con sufijo E para no chocar con v3f
import { ManoLapiz as ManoLapizE } from "./lc01_planos2_comp"; // v3e
import { altoPila, BolsaDormir2, CanioPared, GasNube, Palotes, PilaLena, Rot, Volutas, XRoja } from "./v3f_v3";
import { FilaCuerdas as FilaCuerdasE4, HumoSierra as HumoSierraE4, LenaLiv as LenaLivE4, SierraViva as SierraVivaE4, Subtomas as SubtomasE4, SuperOscuro as SuperOscuroE4 } from "./v4e_v4"; // v4e (P01-P20)
import { Beep, Botas, CanioHollin, EscarchaCanio, Rama, SubFundido, TapaAlarma, TarjetaRopaV4, TermoPoste } from "./v4f_v4"; // v4f (P21-P40)
import { golpe } from "../../anikit/camara"; // v4f
import { FundidoSuave as FundidoV5, Linterna as LinternaV5, Miton as MitonV5, RotuloV5 } from "./v5a_v5"; // v5a (P03-P40)
import { RecuerdoV6 } from "./v6a_v6"; // v6a (P19, P32)

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
    <EscenaL Set={Living} pal={PAL} claves={[mira(0, 1500, P - 262, 1.5), mira(29, 1470, P - 258, 1.58, { curva: "inout" })]} seed={1} mano={1} setProps={{ ...LIV_INV, plastico: false, lena: 0, fuego: 0.8 + 0.2 * Math.abs(Math.sin(f / 1.7)) }}
      detras={<><EscarchaR x={V.x} y={V.y} w={V.w} h={V.h} o={0.9} /><Halo x={1900} y={P - 200} r={760} color="#ff9a4a" fuerza={0.4 + 0.06 * Math.sin(f / 2.3)} /></>}
      medio={<>
        {/* v3e: la miniatura con vida: Theo se sopla las manos, June se sube la manta y mira la ventana */}
        <Pj look={THEO} ruta={[{ f: 0, x: 1170, y: P }]} poses={[{ f: 0, v: SUELO }]} asiento={[{ f: 0, v: A_SUELO }]} caras={[{ f: 0, v: "miedo" }, { f: 16, v: "cansado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: 14, v: { x: 1, y: 0.3 } }]} luz={BORDE_CALIDO}
          ajuste={ik2(ik("D", (q) => q > 6 ? { x: 34, y: -150 } : null, A_SUELO), ik("I", (q) => q > 9 ? { x: 26, y: -140 } : null, A_SUELO))} />
        <Pj look={JUNE} ruta={[{ f: 0, x: 1360, y: P }]} poses={[{ f: 0, v: SUELO }]} asiento={[{ f: 0, v: A_SUELO }]} caras={[{ f: 0, v: "miedo" }, { f: 14, v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: 12, v: { x: -1, y: -0.4 } }]} luz={BORDE_CALIDO} seed={2}
          ajuste={ik("D", (q) => ({ x: 40, y: -96 - 30 * ramp(q, 4, 20) }), A_SUELO)} />
        <Manta x={1220} y={P + 8} w={210} h={92} id="t" />
        <Manta x={1410} y={P + 8 - 10 * ramp(f, 4, 20)} w={210} h={92 + 10 * ramp(f, 4, 20)} color="#3a4a7a" raya="#9a3a34" id="j" />
        <Aliento x={1170 + 40} y={P - A_SUELO - 150} f={f} />
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
      <EscenaL Set={Barrio} pal={PAL} claves={[mira(0, 1900, B - 420, 0.82), mira(54, 1880, B - 380, 1.25, { curva: "inout" })]} seed={2} setProps={{ hora: "tormenta", luces: 0, nieve: 1, cae: true, humo: 0, ventanaCasa: 0.85 + 0.15 * Math.sin(f / 3.1) }}
        medio={<>
          <HumoChim x={2090} y={B - 770} f={f} viento={1.6} />
          {/* las dos siluetas en la ventana encendida */}
          <circle cx={1722} cy={B - 150} r={11} fill="#3a2418" /><rect x={1712} y={B - 140} width={22} height={24} rx={8} fill="#3a2418" />
          <circle cx={1744} cy={B - 146} r={10} fill="#3a2418" /><rect x={1735} y={B - 137} width={20} height={21} rx={8} fill="#3a2418" />
        </>}
        frente={<Ventisca f={f} viento={11} n={220} />} />
      <Calendario texto="JANUARY" x={380} y={96} desde={k(1.08)} tam={50} />
      <Pildora texto="DULUTH, MINNESOTA" x={1540} y={130} desde={k(1.94)} color={FRIO} tam={36} />
    </AbsoluteFill>
  );
};

// ---------- 3 · −28 afuera: una mano limpia la escarcha y aparece el termómetro ----------
export const P03Termo: React.FC = () => {
  const f = useF();
  const k = kDe(2.98);
  const tw = ramp(f, k(3.0), k(4.0)); // avance de la limpieza
  // v5a: el hueco limpio es un óvalo prolijo que crece con la pasada (antes: 24 círculos = una mancha con forma de arbusto)
  const hx = 1240, hy = 560, hrx = 40 + 190 * tw, hry = 60 + 290 * tw;
  const aM = tw * Math.PI * 4 + 1;
  const m = tw > 0 ? { x: hx + hrx * 0.78 * Math.cos(aM), y: hy + hry * 0.78 * Math.sin(aM) } : { x: 1500, y: 900 };
  // v3e: después de limpiar, el guante golpea DOS veces el vidrio junto al termómetro y se va
  const tap = (q: number) => Math.max(0, Math.sin(Math.PI * ramp(q, k(4.38), k(4.58)))) + Math.max(0, Math.sin(Math.PI * ramp(q, k(4.62), k(4.82))));
  const mano = f < k(4.3) ? { x: m.x + 40, y: m.y + 40 } : f < k(4.88) ? { x: interpolate(f, [k(4.3), k(4.42)], [m.x + 40, 1440], cl) + 26 * tap(f), y: interpolate(f, [k(4.3), k(4.42)], [m.y + 40, 700], cl) + 10 * tap(f) } : { x: interpolate(f, [k(4.88), k(5.2)], [1440, 1900], cl), y: interpolate(f, [k(4.88), k(5.2)], [700, 1300], cl) };
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#c6d1e3, #e2e8f2)" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <defs><mask id="p03m"><rect x={0} y={0} width={1920} height={1080} fill="#fff" />{tw > 0 && <ellipse cx={hx} cy={hy} rx={hrx} ry={hry} fill="#000" />}</mask></defs>
        {/* afuera: la calle helada, gris de mediodía nublado (sin manchas oscuras detrás del termómetro) */}
        <rect x={0} y={790} width={1920} height={290} fill="#dfe6f2" />
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={i * 230 - 40} y={720 - ((i * 53) % 60)} width={190} height={80 + ((i * 53) % 60)} fill="#8e98b0" />)}
        {Array.from({ length: 9 }).map((_, i) => <rect key={`t${i}`} x={i * 230 - 44} y={714 - ((i * 53) % 60)} width={198} height={10} rx={4} fill="#eef2fa" />)}
        <NieveCae f={f} n={160} x0={0} w={1920} y0={0} h={1080} viento={3} />
        <Termometro temp={interpolate(f, [k(3.0), k(3.4)], [-12, -28], cl)} x={1240} y={560} />
        {/* la escarcha, con el hueco que deja la mano */}
        <g mask="url(#p03m)"><rect x={0} y={0} width={1920} height={1080} fill="#d8e4f6" opacity={0.78} /><EscarchaR x={0} y={0} w={1920} h={1080} o={0.9} /></g>
        {/* v5a: borde de escarcha del hueco (anillo blanco nítido, sin desenfoque) */}
        {tw > 0 && <g fill="none"><ellipse cx={hx} cy={hy} rx={hrx} ry={hry} stroke="#f4f8ff" strokeWidth={14} opacity={0.75} /><ellipse cx={hx} cy={hy} rx={hrx + 12} ry={hry + 12} stroke="#ffffff" strokeWidth={4} opacity={0.5} strokeDasharray="22 14" /></g>}
        {/* marco de la ventana */}
        <path d="M0,0 H1920 V1080 H0 Z M70,70 V1010 H1850 V70 Z" fill="#e8d9b5" fillRule="evenodd" />
        <rect x={810} y={70} width={24} height={940} fill="#e8d9b5" />
        <MitonV5 x={mano.x} y={mano.y} ang={-28} manga="#2f7f86" />
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
      {/* v3e: figuras grandes (zoom 1.3) a la izquierda, la ciudad que se apaga a la derecha; Theo se encoge, June señala */}
      <EscenaL Set={Panorama} pal={PAL} claves={[mira(0, 820, PANO_PISO - 300, 1.26), mira(k(6.2), 840, PANO_PISO - 300, 1.32, { curva: "inout" })]} seed={4} setProps={{ hora: "noche", luces, ventana: 0, nieve: 1, cae: true, vapor: 0.6 }}
        medio={<>
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 330, y: PANO_PISO }]} poses={[{ f: 0, v: "parado" }, { f: k(5.6), v: "manosCintura" }, { f: k(6.4), v: "encogerse" }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(5.5), v: "sorpresa" }, { f: k(6.4), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(5.5), v: { x: 1, y: -0.2 } }, { f: k(6.5), v: { x: 1, y: 0.3 } }]} luz={BORDE_FRIO} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 540, y: PANO_PISO }]} poses={[{ f: 0, v: "brazosCruzados" }, { f: k(5.98), v: "señalar" }, { f: k(6.9), v: "manosCara" }]} caras={[{ f: 0, v: "neutral" }, { f: k(5.6), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: 0.1 } }, { f: k(6.9), v: { x: -1, y: 0 } }]} luz={BORDE_FRIO} seed={2} />
          <Aliento {...boca(330, PANO_PISO)} f={f} /><Aliento {...boca(540, PANO_PISO)} f={f} desfase={23} />
        </>} />
      <BarraPower x={1240} y={96} v={luces} desde={0} />
      <Pildora texto="THE ENTIRE CITY" x={1440} y={190} desde={k(5.98)} color="#e2483a" tam={36} />
    </AbsoluteFill>
  );
};

// ---------- 5 · sin caldera, sin hospital, nadie a quien llamar ----------
export const P05Nadie: React.FC = () => {
  const f = useF();
  const k = kDe(7.26);
  const X0 = 620, X1 = 1000;
  const jx = (q: number) => interpolate(q, [0, k(8.05), k(9.15), k(9.6)], [X0, X1, X1, 700], cl);
  const claves = [mira(0, 1150, 360, 0.55), mira(k(8.0), 1060, 600, 0.95, { curva: "inout" }), mira(k(9.0), 1030, SM_PISO - 230, 1.55, { curva: "inout" }), mira(k(9.6), 860, SM_PISO - 230, 1.55, { curva: "inout" })];
  const tel = aPantalla(claves, f, jx(f) - 46, SM_PISO - 250);
  return (
    <AbsoluteFill>
      <EscenaL Set={StMarys} pal={PAL} claves={claves} seed={5} setProps={{ hora: "noche", luces: 0, ventana: ramp(f, k(8.24), k(8.7), 1, 0), nieve: 1, cae: true }}
        medio={<>
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: X0, y: SM_PISO }, { f: k(8.05), x: X1 }, { f: k(8.9), x: X1 }, { f: k(9.15), x: X1 }, { f: k(9.6), x: 700 }]}
            dir={[{ f: 0, v: 1 }, { f: k(8.95), v: -1 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(8.05), v: "empujar" }, { f: k(8.9), v: "parado" }, { f: k(9.05), v: "celular" }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(8.4), v: "sorpresa" }, { f: k(8.75), v: "miedo" }, { f: k(9.4), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(8.6), v: { x: -1, y: -0.2 } }, { f: k(9.05), v: { x: 1, y: 0.4 } }]}
            ajuste={ik2(ik("D", (q) => entre(q, k(8.05), k(8.9)) ? { x: 70, y: -200 + Math.sin(q / 2) * 6 } : null), ik("I", (q) => entre(q, k(8.05), k(8.9)) ? { x: 60, y: -150 } : null))}
            enManoD={(q: number) => q > k(9.0) ? <Celular brillo="#9bb7ff" /> : null} luz={BORDE_FRIO} seed={2} />
          <Aliento {...boca(jx(f), SM_PISO)} f={f} />
        </>} />
      {/* v3e: tarjetas cuya palabra queda legible (raya + X al costado), no un X que tapa el rótulo */}
      <ServicioE x={1500} y={150} icono="estufa" rotulo="FURNACE" desde={k(7.38)} tacha={k(7.7)} />
      <ServicioE x={1500} y={280} icono="hospital" rotulo="HOSPITAL" desde={k(8.24)} tacha={k(8.55)} />
      <ServicioE x={1500} y={410} icono="telefono" rotulo="CALL 911" desde={k(9.08)} tacha={k(9.4)} />
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
  // v3e: toma B = plano bajo junto a la estufa, los dos sentados en el piso frente al fuego (figuras ~40 % del cuadro)
  const clavesL = [mira(c, 1930, P - 250, 1.42), mira(k(14.5), 1950, P - 240, 1.55, { curva: "inout" })];
  const win = aPantalla(clavesB, f, 1732, B - 150);
  const est = aPantalla(clavesL, f, 1950, P - 200);
  const frote = (q: number) => Math.sin(q / 2.2) * 10;
  // v4e: en «wood stove» June agarra el leño de al lado, se acerca en cuclillas, abre la puerta, lo mete, chispas,
  // el fuego sube y la puerta se cierra (sin el «tick» escrito); los rótulos en la pared, entre la ventana y el caño
  const JX0 = 2270, JX1 = 2150, aga = k(13.75), cuc = k(13.95), llega = k(14.2), abreP = k(14.22), mete = k(14.45), suelta = k(14.58), cierra = k(14.9);
  const puerta = Math.min(ramp(f, abreP, abreP + 8), ramp(f, cierra, cierra + 8, 1, 0));
  const pomoX = (a: number) => 1950 - 76 + 152 * Math.cos(a * 1.3) * 0.98;
  const fuego = interpolate(f, [suelta + 2, suelta + 16], [0.5, 1], cl) * (0.88 + 0.12 * Math.sin(f / 2.4));
  const jx = (q: number) => interpolate(q, [cuc, llega], [JX0, JX1], cl);
  void est; void Tic;
  return (
    <SubtomasE4 f={f} cortes={[c]} tomas={[
      () => (
        <EscenaL Set={Barrio} pal={PAL} claves={clavesB} seed={6} setProps={{ hora: "noche", luces: 0, nieve: 1, cae: true, humo: 0, ventanaCasa: 1 }}
          medio={<HumoChim x={2090} y={B - 770} f={f} color="#5a6078" />} frente={<Ventisca f={f} viento={5} n={140} o={0.6} />}
          hud={<>
            <Pildora texto="YOUR ENTIRE SPECIES" x={620} y={120} desde={k(10.82)} hasta={k(11.45)} color={AMBAR} tam={44} />
            <EtiquetaObj texto="2 PEOPLE" desde={k(11.5)} px={win.x} py={win.y} tx={win.x + 300} ty={win.y - 220} tam={40} />
          </>} />
      ),
      () => (
        <EscenaL Set={Living} pal={PAL} claves={clavesL} seed={6} setProps={{ ...LIV_INV, hora: "noche", fuego }}
          detras={<><Halo x={1950} y={P - 160} r={700} color="#ff9a4a" fuerza={0.3 + 0.14 * fuego} /><PuertaEstufa x={1950} piso={P} abre={puerta} /></>}
          medio={<>
            {/* Theo se frota las manos hacia la estufa; cuando el fuego sube, sonríe y mira la llama */}
            <Pj look={THEO_CASA} ruta={[{ f: 0, x: 1640, y: P }]} poses={[{ f: 0, v: SUELO }]} asiento={[{ f: 0, v: A_SUELO }]}
              caras={[{ f: 0, v: "cansado" }, { f: k(13.1), v: "neutral" }, { f: suelta + 4, v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.2 } }, { f: k(13.1), v: { x: 1, y: -0.2 } }, { f: k(13.8), v: { x: 1, y: 0 } }, { f: suelta, v: { x: 1, y: 0.25 } }]} luz={BORDE_CALIDO}
              ajuste={ik2(ik("D", (q) => q < suelta ? { x: 92 + frote(q), y: -150 } : { x: 110, y: -130 }, A_SUELO), ik("I", (q) => q < suelta ? { x: 84 - frote(q), y: -140 } : { x: 100, y: -120 }, A_SUELO))} />
            {f < aga + 4 && <g transform={`translate(${JX0 - 110},${P - 16})`}><Lenio s={0.62} rot={4} /></g>}
            <Manta x={1690} y={P + 8} w={200} h={88} id="t6" />
            <Manta x={2220} y={P + 8} w={200} h={88} color="#3a4a7a" raya="#9a3a34" id="j6" />
            <Pj look={JUNE} ruta={[{ f: 0, x: JX0, y: P }, { f: cuc, x: JX0 }, { f: llega, x: JX1 }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: SUELO }, { f: aga, v: { ...SUELO, tronco: 22, cabeza: -10 } }, { f: cuc, v: CUCLI }]} asiento={[{ f: 0, v: A_SUELO }, { f: cuc, v: A_CUCLI }]}
              caras={[{ f: 0, v: "triste" }, { f: k(13.2), v: "duda" }, { f: aga, v: "determinado" }, { f: suelta + 4, v: "feliz" }]}
              miradas={[{ f: 0, v: { x: 1, y: -0.5 } }, { f: k(13.2), v: { x: -1, y: -0.2 } }, { f: k(13.5), v: { x: 1, y: 0.1 } }, { f: aga, v: { x: 1, y: 0.6 } }, { f: cuc, v: { x: 1, y: 0.1 } }]} luz={BORDE_CALIDO} seed={2}
              ajuste={ik2(
                ik("D", (q) => entre(q, aga, cuc) ? { x: 110, y: -14 } : entre(q, cuc, mete) ? { x: 80, y: -170 } : entre(q, mete, suelta + 2) ? { x: jx(q) - 1960 - 30 * ramp(q, mete, suelta), y: -185 } : null, q0(f, aga, cuc, A_SUELO, A_CUCLI)),
                ik("I", (q) => entre(q, abreP - 4, cierra + 10) ? { x: jx(q) - pomoX(entre(q, abreP, cierra) ? ramp(q, abreP, abreP + 8) : ramp(q, cierra, cierra + 8, 1, 0)) + 6, y: -185 } : null, A_CUCLI))}
              enManoD={(q: number) => q >= aga + 4 && q < suelta ? <Lenio s={0.62} rot={-6} /> : null} />
            <Chispas x={1950} y={P - 190} f={f} desde={suelta} />
            <Aliento {...boca(1640, P, 1, A_SUELO)} f={f} />
          </>}
          hud={<>
            <Rotulo3E texto="2 PEOPLE" x={640} y={130} desde={c} color={AMBAR} tam={40} />
            <Rotulo3E texto="1 ROOM" x={640} y={210} desde={k(13.0)} color={AMBAR} tam={40} />
            <Rotulo3E texto="1 WOOD STOVE" x={640} y={290} desde={k(14.4)} color="#ff8a3a" tam={40} />
          </>} />
      ),
    ]} />
  );
};
// asiento que pasa de a → b entre f0 y f1 (para el IK de un personaje que se acomoda)
const q0 = (f: number, f0: number, f1: number, a: number, b: number) => interpolate(f, [f0, f1], [a, b], cl);

// ---------- 7 · la luz se fue el día 41: Theo en el puente cuando se apaga todo ----------
export const P07Dia41: React.FC = () => {
  const f = useF();
  const k = kDe(15.48);
  // v3e: cámara de UN movimiento inout largo (sin tirón), sin flash ni giro; Theo se frena a 200 px del farol,
  // las luces se van suaves, él mira arriba, se encoge; «lights out» se escribe con barrido en el cielo
  const luces = ramp(f, k(16.25), k(17.1), 1, 0);
  const tx = interpolate(f, [0, k(16.3)], [860, 1000], cl);
  return (
    <AbsoluteFill>
      <EscenaL Set={Puente} pal={PAL} claves={[mira(0, 1080, PUENTE_PISO - 300, 1.45), mira(k(17.4), 1110, PUENTE_PISO - 290, 1.58, { curva: "inout" })]} seed={7}
        setProps={{ hora: "noche", luces, nieve: 1, vapor: 1, hielo: 0.3, cae: true }}
        medio={<>
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 860, y: PUENTE_PISO }, { f: k(16.3), x: 1000 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(16.5), v: "manosCintura" }, { f: k(17.2), v: "encogerse" }]} caras={[{ f: 0, v: "neutral" }, { f: k(16.5), v: "sorpresa" }, { f: k(17.2), v: "miedo" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(16.45), v: { x: 1, y: -0.7 } }, { f: k(17.3), v: { x: -1, y: 0 } }]} luz={BORDE_FRIO} />
          <Aliento {...boca(tx, PUENTE_PISO)} f={f} />
        </>} />
      <TextoBarridoE texto="lights out" x={1180} y={250} desde={k(16.9)} dur={16} tam={84} color={AMBAR} id="p07" />
    </AbsoluteFill>
  );
};

// ---------- 8 · una ciudad llena de comida y 90 días de invierno ----------
export const P08Comida: React.FC = () => {
  const f = useF();
  const k = kDe(18.26);
  const SP = SUPER_PISO; void SUPER_PUNTOS;
  // v4e: el súper APAGADO (sin red: velo oscuro, tubos muertos, sin el carrito suelto del frente); la única luz es la de
  // la vidriera (fría, desde la izquierda) y el celular de June. Theo va a la pirámide, agarra una lata, la deja en el
  // carrito, vuelve por otra y en «90 days» se queda mirando la tira con la lata contra el pecho.
  const toma = k(19.1), gira = k(19.3), suelta = k(19.85), vuelve = k(20.15), toma2 = k(20.55), mira90 = k(20.84);
  const cx = (q: number) => interpolate(q, [0, k(19.4)], [1450, 1830], cl);
  const tx = (q: number) => interpolate(q, [0, k(18.75), gira, k(19.55), vuelve, k(20.4)], [1960, 2060, 2060, 2010, 2010, 2060], cl);
  const jxJ = (q: number) => cx(q) - 230;
  const lata1 = f > suelta + 2;
  return (
    <AbsoluteFill>
      <EscenaL Set={SuperOscuroE4} pal={PAL} claves={[mira(0, 2000, SP - 416, 1.15), mira(k(20.0), 2030, SP - 416, 1.17, { curva: "inout" }), mira(k(21.2), 2000, SP - 422, 1.14, { curva: "inout" })]} /* v5a: góndolas más abajo → techo libre para los textos */ seed={8} setProps={{}}
        detras={<>
          {/* luz fría de la vidriera (izquierda) en el piso y el aire */}
          <Haces x={900} y={SP - 760} ang={-38} largo={1500} n={4} ancho={110} color="#9fb4d8" fuerza={0.1} f={f} seed={8} />
          <Halo x={1300} y={SP - 60} r={900} color="#8aa2c8" fuerza={0.22} />
          {/* v5a: viga oscura del techo (tapa la franja de carteles del fondo): zona lisa para la tira de 90 días */}
          <rect x={-3000} y={SP - 820} width={9000} height={128} fill="#151926" />
          <rect x={-3000} y={SP - 696} width={9000} height={6} fill="#2a3044" />
        </>}
        medio={<>
          <Carrito x={cx(f)} y={SP} lleno={lata1 ? 0.4 : 0.3} rueda={f} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: jxJ(0), y: SP }, { f: k(19.4), x: jxJ(k(19.4)) }]} poses={[{ f: 0, v: { hD: 75, cD: 15, hI: 70, cI: 20, tronco: 8 } }, { f: k(19.6), v: { hD: 70, cD: 30, hI: 70, cI: 20, tronco: 2 } }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(19.95), v: "feliz" }, { f: mira90, v: "duda" }, { f: k(21.6), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: 0.1 } }, { f: k(19.0), v: { x: 1, y: 0.2 } }, { f: mira90 + 4, v: { x: 1, y: -0.5 } }]} seed={2}
            enManoD={<Celular brillo="#fff3c8" />} luz={BORDE_FRIO} />
          {/* el haz del celular de June hacia la pirámide */}
          <Cono x={jxJ(f) + 92} y={SP - 222} alto={1000} ancho={520} boca={18} color="#fff3c8" fuerza={0.2} ang={-74} />
          <Pj look={THEO_INV} ruta={[0, k(18.75), gira, k(19.55), vuelve, k(20.4)].map((q) => ({ f: q, x: tx(q), y: SP }))} dir={[{ f: 0, v: 1 }, { f: gira, v: -1 }, { f: vuelve, v: 1 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(18.8), v: { tronco: 12, cabeza: 6 } }, { f: gira, v: "parado" }, { f: k(20.4), v: { tronco: 12, cabeza: 6 } }, { f: mira90, v: { hD: 40, cD: 120, tronco: -2, cabeza: -6 } }, { f: k(21.7), v: "encogerse" }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(18.85), v: "feliz" }, { f: mira90, v: "duda" }, { f: k(21.6), v: "miedo" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.1 } }, { f: k(18.8), v: { x: 1, y: 0.4 } }, { f: gira, v: { x: 1, y: 0.4 } }, { f: vuelve, v: { x: 1, y: 0.3 } }, { f: mira90 + 2, v: { x: 1, y: -0.6 } }]}
            ajuste={ik("D", (q) => entre(q, k(18.8), toma + 4) ? { x: 140, y: -150 } : entre(q, k(19.55), suelta + 2) ? { x: 84, y: -158 } : entre(q, k(20.4), toma2 + 4) ? { x: 140, y: -150 } : null)}
            enManoD={(q: number) => (q > toma && q < suelta) || q > toma2 ? <Lata color="#c0352c" /> : null} luz={BORDE_FRIO} />
        </>} />
      <RotuloV5 texto="A CITY FULL OF FOOD" x={1100} y={118} desde={k(19.1)} hasta={k(20.6)} color={AMBAR} tam={42} />
      <AbsoluteFill style={{ transform: "scale(0.74)", transformOrigin: "1100px 118px" }}><Tira90E x={1100} y={118} desde={mira90} prog={ramp(f, k(20.9), k(22.6))} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- 9 · ¿pueden dos personas sobrevivir solas el primer invierno? ----------
export const P09Pregunta: React.FC = () => {
  const f = useF();
  const k = kDe(23.12);
  return (
    <AbsoluteFill>
      {/* v3e: plano de dos cerrado; al final se abre a un medio (no general) con la ventisca que los envuelve y se juntan */}
      <EscenaL Set={Panorama} pal={PAL} claves={[mira(0, 420, PANO_PISO - 250, 2.0), mira(k(25.0), 430, PANO_PISO - 250, 2.1, { curva: "inout" }), mira(k(28.2), 440, PANO_PISO - 262, 2.45, { curva: "inout" })]} seed={9}
        setProps={{ hora: "invierno", luces: 0, ventana: 0, nieve: 1, cae: true, vapor: 0.8 }}
        frente={<Ventisca f={f} viento={8} n={Math.round(interpolate(f, [k(26.8), k(28.2)], [40, 200], cl))} o={0.8} />}
        medio={<>
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 330, y: PANO_PISO }, { f: k(27.0), x: 330 }]} poses={[{ f: 0, v: "brazosCruzados" }, { f: k(25.6), v: "manosCintura" }, { f: k(27.5), v: "encogerse" }]}
            caras={[{ f: 0, v: "duda" }, { f: k(25.3), v: "miedo" }, { f: k(25.9), v: "determinado" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(25.4), v: { x: 1, y: 0.1 } }, { f: k(27.7), v: { x: 1, y: -0.2 } }]} luz={BORDE_FRIO}
            />
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
// v3e: la MANO de June (manga verde agua) agarra el borde de la tapa y la abre (antes se abría sola)
export const P10Cuenta: React.FC = () => {
  const f = useF();
  const z = interpolate(f, [0, 240], [1.04, 1.12], { extrapolateRight: "clamp" });
  const ab = interpolate(f, [6, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) });
  const borde = 960 + 660 * Math.cos(ab * Math.PI);
  const llega = ramp(f, 0, 6), va = ramp(f, 25, 31);
  const hx = interpolate(llega, [0, 1], [1900, 1610]);
  const mx = f < 6 ? hx : f <= 24 ? borde - 10 : borde - 10 + 900 * va;
  const my = f < 6 ? interpolate(llega, [0, 1], [1150, 600]) : f <= 24 ? 600 - 60 * Math.sin(ab * Math.PI) : 600 + 600 * va;
  return (
    <AbsoluteFill>
      <CuadernoGrande tapa abre={6} zoom={[0, 1.04, 1.12]} luz="#3a2c2a" vela />
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <g transform="rotate(-3 960 540)"><ManoLapizE x={mx} y={my} manga="#2f7f86" lapiz={false} s={0.8} /></g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

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
  // v4e: los 3 sub-planos se enlazan con fundido corto de 6 cuadros (no más tirón en 33,9); la pila es de troncos de
  // verdad; en los primeros 2 s Theo se despereza (los cuadros ini y mid ya no son iguales)
  const LIV11 = { ...LIV_INV, hora: "alba", mantas: false, plastico: false, lena: 0, fuego: 0.2, cae: false };
  const estira = (q: number) => Math.sin(Math.PI * ramp(q, k(30.0), k(31.2)));
  const tomaA = () => (
    <EscenaL Set={Living} pal={PAL} claves={[mira(0, 900, P - 270, 1.35), mira(c1, 980, P - 280, 1.42, { curva: "inout" })]} seed={11} setProps={LIV11}
      detras={<LenaLivE4 lena={0.25} />}
      medio={<>
        <EnColchon look={THEO_CASA} x={720} caras={[{ f: 0, v: "cansado" }, { f: k(30.3), v: "duda" }, { f: k(31.3), v: "cansado" }]} miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: k(30.2), v: { x: 1, y: -0.4 } }, { f: k(31.4), v: { x: 1, y: 0.2 } }, { f: k(32.6), v: { x: 1, y: 0 } }]}
          poses={[{ f: 0, v: { ...SENT, tronco: 14, cabeza: 22 } }, { f: k(30.0), v: { ...SENT, tronco: -8, cabeza: -10 } }, { f: k(31.3), v: { ...SENT, tronco: 6, cabeza: 8 } }]}
          ajuste={(p0, q) => { const e = estira(q); return e > 0.01 ? ({ ...p0, hD: p0.hD + (160 - p0.hD) * e, cD: p0.cD * (1 - e), hI: p0.hI + (150 - p0.hI) * e, cI: p0.cI * (1 - e) } as Pose) : p0; }} />
        <EnColchon look={JUNE} x={1060} seed={2} manta="#3a4a7a" f={f} sinManta={(q) => q > k(33.3)}
          ruta={[{ f: 0, x: 1060, y: P }, { f: k(33.5), x: 1060 }, { f: c1 + 6, x: 1300 }]}
          poses={[{ f: 0, v: SENT }, { f: k(33.3), v: "parado" }]} asiento={[{ f: 0, v: A_COLCHON }, { f: k(33.3), v: undefined }]}
          caras={[{ f: 0, v: "cansado" }, { f: k(31.8), v: "duda" }, { f: k(33.3), v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(31.8), v: { x: -1, y: -0.2 } }, { f: k(32.8), v: { x: 1, y: 0 } }]} />
        <Aliento {...boca(720, P, 1, A_COLCHON)} f={f} /><Aliento {...boca(1060, P, 1, A_COLCHON)} f={f} desfase={22} />
      </>}
      hud={<Pildora texto="THE MORNING AFTER THE BLACKOUT" x={660} y={110} desde={k(31.12)} color={AMBAR} tam={32} />} />
  );
  const tomaB = () => (
    <EscenaL Set={Living} pal={PAL} claves={[mira(c1, 3420, P - 300, 1.3), mira(c2, 3460, P - 300, 1.38, { curva: "inout" })]} seed={11} setProps={LIV11}
      medio={<>
        <Puerta x={3550} piso={P} abre={ab} der luzVano="#6a8ab0" />
        {ab > 0.3 && <NieveCae f={f} n={20} x0={3560} w={220} y0={P - 600} h={600} />}
        <Pj look={JUNE_INV} ruta={ruta2} caras={[{ f: 0, v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} seed={2}
          ajuste={ik("D", (q) => q > k(34.6) ? { x: pomo(3550, P, 240, ramp(q, k(34.75), k(35.5), 1, 0), true).x - jxPuerta(q), y: kn.y - P } : null)} />
      </>}
      hud={<Pildora texto="SHE CLOSES THE DOORS" x={700} y={100} desde={k(35.14)} color={AMBAR} tam={38} />} />
  );
  const fr = [cerr(36.2), cerr(37.1), cerr(38.0), cerr(36.45), cerr(36.7), 0];
  // al final la sección empuja (inout 24 cuadros) hasta el living: el único cuarto que queda vivo
  const push = ramp(f, k(38.3), k(38.3) + 24);
  const z = ramp(f, c2, c2 + 60, 1, 1.05) * (1 + 0.85 * push);
  const cx = 960 + 260 * push, cy = 540 + 170 * push;
  const tomaC = () => (
    <AbsoluteFill style={{ background: "linear-gradient(#1d2440, #4a5a78)" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(960 540) scale(${z}) translate(${-cx} ${-cy})`}>
          <NieveCae f={f} n={90} x0={0} w={1920} y0={0} h={1080} />
          <CasaSeccion f={f} frio={fr.map((v, i) => (i === 5 ? 0 : 0.25 + 0.75 * v))} cerrada={[...fr.slice(0, 5), 0]} temps={[...fr.slice(0, 5).map((v) => 48 - 30 * v), 61]}
            rotulos={[...fr.slice(0, 5).map((v) => Math.min(1, v * 3)), 1]} tachas={[...fr.slice(0, 5), 0]}>
            <Pj look={JUNE} ruta={[{ f: 0, x: 1160, y: 840 }]} escala={0.55} poses={[{ f: 0, v: "manosCintura" }, { f: k(38.4), v: "encogerse" }]} caras={[{ f: 0, v: "determinado" }, { f: k(38.4), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(38.5), v: { x: -1, y: -0.3 } }]} seed={2} />
          </CasaSeccion>
        </g>
      </svg>
    </AbsoluteFill>
  );
  return <SubtomasE4 f={f} cortes={[c1, c2]} tomas={[tomaA, tomaB, tomaC]} />;
};

// ---------- 12 · mantas en los vanos, plástico en las ventanas ----------
export const P12Plastico: React.FC = () => {
  const f = useF();
  const k = kDe(39.4);
  const c = k(41.14); // v5a: el corte en «and» (el cuadro mid ya no cae en el fundido)
  const cae = ramp(f, k(39.84), k(40.6), 0.6, 1);
  // v4e: corte interno con fundido de 6 cuadros; pila de troncos de verdad; la toma del plástico es un medio a June +
  // ventana (zoom 1,4: June ~40 % del alto) y la píldora va en la pared a la izquierda, lejos del marco
  const tomaA = () => (
    <EscenaL Set={Living} pal={PAL} claves={[mira(0, 60, P - 320, 1.45), mira(c + 6, 80, P - 320, 1.5, { curva: "inout" })]} seed={12} setProps={{ ...LIV_INV, mantas: false, plastico: false, hora: "invierno", cae: false, lena: 0 }}
      detras={<LenaLivE4 lena={0.45} />}
      medio={<>
        <MantaVano x={-260} piso={P} W={240} H={620} cae={cae} f={f} />
        <Pj look={JUNE_INV} ruta={[{ f: 0, x: -40, y: P }, { f: k(40.65), x: -40 }, { f: k(41.1), x: 130 }]} dir={[{ f: 0, v: -1 }, { f: k(40.9), v: 1 }]}
          poses={[{ f: 0, v: "parado" }, { f: k(40.95), v: "manosCintura" }]} caras={[{ f: 0, v: "determinado" }, { f: k(40.9), v: "feliz" }]}
          miradas={[{ f: 0, v: { x: 1, y: -0.2 } }, { f: k(40.9), v: { x: 1, y: 0 } }]} seed={2}
          ajuste={ik2(ik("D", (q) => q < k(40.65) ? { x: 120, y: P - 620 + 620 * ramp(q, k(39.84), k(40.6), 0.6, 1) - P - 4 } : null), ik("I", (q) => q < k(40.65) ? { x: 60, y: P - 620 + 620 * ramp(q, k(39.84), k(40.6), 0.6, 1) - P - 4 } : null))} />
      </>}
      hud={<Pildora texto="BLANKETS OVER THE DOORWAYS" x={1220} y={170} desde={k(39.84)} color={AMBAR} tam={40} />} />
  );
  const prog = ramp(f, k(41.5), k(42.3));
  // plano medio (June de pies a cabeza, ~40 % del alto): pega la cinta abajo a la izquierda, cruza y pega abajo a la
  // derecha, y alisa el plástico con la palma de una punta a la otra
  const cin = [ramp(f, k(42.3), k(42.4)), ramp(f, k(42.98), k(43.08)), ramp(f, k(42.2), k(42.3)), ramp(f, k(42.2), k(42.3))];
  const yC = V.y + V.h + 34 - P - 18;
  const alisa = ramp(f, k(43.12), k(43.5));
  const tomaB = () => (
    <EscenaL Set={Living} pal={PAL} claves={[mira(c, 1290, 556, 1.4), mira(k(42.9), 1300, 560, 1.42, { curva: "inout" }), mira(k(43.4), 1480, 660, 1.65, { curva: "inout" })]} seed={12} setProps={{ ...LIV_INV, plastico: false, hora: "tormenta", lena: 0 }}
      medio={<>
        <PlasticoVentana V={V} prog={prog} cintas={cin} f={f} />
        <Pj look={JUNE_INV} ruta={[{ f: 0, x: 965, y: P }, { f: k(42.42), x: 965 }, { f: k(42.9), x: 1620 }]}
          dir={[{ f: 0, v: 1 }, { f: k(42.86), v: -1 }]} poses={[{ f: 0, v: "parado" }]} caras={[{ f: 0, v: "determinado" }, { f: k(42.5), v: "duda" }, { f: k(43.15), v: "feliz" }]}
          miradas={[{ f: 0, v: { x: 1, y: -0.5 } }, { f: k(42.5), v: { x: 1, y: 0 } }, { f: k(42.9), v: { x: 1, y: -0.3 } }, { f: k(43.2), v: { x: 1, y: -0.6 } }]} seed={2}
          ajuste={ik("D", (q) => entre(q, k(42.1), k(42.45)) ? { x: V.x - 34 - 965 + 40, y: yC } : entre(q, k(42.88), k(43.1)) ? { x: 1620 - (V.x + V.w + 34 - 40), y: yC } : q < k(43.12) ? { x: 60, y: -160 } : { x: 1620 - (V.x + V.w - 20) + 120 * alisa, y: -330 - 40 * Math.sin(alisa * Math.PI * 2) })}
          enManoD={(q: number) => q < k(43.12) ? <RolloCintaE /> : null} />
      </>}
      hud={<Pildora texto="PLASTIC ON THE WINDOWS" x={420} y={300} desde={k(41.78)} hasta={k(42.8)} color={AMBAR} tam={28} />} />
  );
  return <FundidoV5 c={c} a={tomaA()} b={tomaB()} />; // v5a: fundido 8 en seno
};

// ---------- 13 · no se calienta una casa: se calienta un cuarto ----------
export const P13Corte: React.FC = () => {
  const f = useF();
  const k = kDe(43.58);
  const pierde = ramp(f, k(44.58), k(46.6));
  const cierra = ramp(f, k(47.75), k(48.2));
  const z = ramp(f, 0, k(46.4), 1, 1.12) * ramp(f, k(48.2), k(49.0), 1, 1.85); // v3e: se acerca mientras se escapa el calor y entra al living (figuras ≥30 %)
  const otros = [0, 1, 2, 3, 4].map(() => 0.2 + 0.8 * Math.max(pierde, cierra));
  const living = cierra > 0 ? 0.6 * (1 - cierra) : 0.2 + 0.4 * pierde;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#1d2440, #4a5a78)" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(1260 695) scale(${z}) translate(-1260 -695)`}>
          <NieveCae f={f} n={90} x0={0} w={1920} y0={0} h={1080} />
          <CasaSeccion f={f} frio={[...otros, living]} cerrada={[0, 1, 2, 3, 4].map(() => cierra).concat(0)} escape={pierde * (1 - cierra)}
            temps={[...otros.map((v) => 62 - 50 * v), 62 - 35 * living]} estufa={1}>
            <Pj look={THEO_CASA} ruta={[{ f: 0, x: 1130, y: 840 }]} escala={0.5} poses={[{ f: 0, v: "parado" }, { f: k(44.7), v: "encogerse" }, { f: k(48.2), v: "parado" }]} caras={[{ f: 0, v: "cansado" }, { f: k(45.5), v: "miedo" }, { f: k(48.2), v: "feliz" }]}
              miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(44.8), v: { x: -1, y: -0.4 } }, { f: k(48.3), v: { x: 1, y: 0 } }]} ajuste={ik("D", (q) => q > k(48.4) ? { x: 70, y: -170 } : null)} />
            <Pj look={JUNE} ruta={[{ f: 0, x: 1240, y: 840 }]} escala={0.5} poses={[{ f: 0, v: "brazosCruzados" }, { f: k(45.0), v: "encogerse" }, { f: k(48.25), v: "parado" }]} caras={[{ f: 0, v: "duda" }, { f: k(45.6), v: "miedo" }, { f: k(48.2), v: "feliz" }]}
              miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(45.0), v: { x: -1, y: -0.4 } }, { f: k(48.3), v: { x: 1, y: 0 } }]} seed={2} dir={[{ f: 0, v: -1 }]} ajuste={ik("D", (q) => q > k(48.45) ? { x: 70, y: -170 } : null)} />
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
  // v4e: ya no abre con el exterior de la casa roja (3ª vez): abre ADENTRO con un empuje lento (inout) del living entero
  // a la estufa; después la cámara va a cada objeto que nombra la voz; colchones en plano medio (Theo ~45 % del alto).
  const abre0 = [mira(0, 1500, P - 380, 0.72), mira(k(51.6), 1800, P - 290, 1.25, { curva: "inout" })];
  // v3e: general corto (≤2 s) y después la cámara va con inout a CADA objeto cuando la voz lo nombra; June recorre el cuarto
  const cEst = (t: number) => mira(k(t), 1860, P - 250, 1.5, { curva: "inout" });
  const cCol = (t: number) => mira(k(t), 900, 700, 1.8, { curva: "inout" });
  const cMesa = (t: number) => mira(k(t), 2560, P - 260, 1.4, { curva: "inout" });
  const cLat = (t: number) => mira(k(t), 2800, P - 280, 1.4, { curva: "inout" });
  const claves = [...abre0, cEst(53.25), cEst(53.6), cCol(54.1), cCol(55.25), cMesa(55.75), cMesa(56.2), cLat(56.7), cLat(57.6), mira(k(58.4), 2440, P - 240, 1.9, { curva: "inout" })];
  const at = (X: number, Y: number) => aPantalla(claves, f, X, Y);
  const est = at(1950, P - 230), col = at(1100, P - 60), mesa = at(2620, P - 170), est2 = at(2920, P - 420), cua = at(2475, P - 190);
  const toma = k(58.15), lata = k(56.95);
  const jr = [{ f: 0, x: 1770, y: P }, { f: k(54.6), x: 1770 }, { f: k(55.7), x: 2560 }, { f: k(56.5), x: 2720 }, { f: k(57.3), x: 2720 }, { f: k(57.85), x: 2390 }];
  const pat = (q: number) => entre(q, k(53.7), k(54.6)) ? Math.abs(Math.sin((q - k(53.7)) / 3)) * 26 : 0;
  return (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={claves} seed={14} setProps={{ ...LIV_INV, lena: 0 }}
        detras={<LenaLivE4 lena={0.15} />}
        medio={<>
          {f > toma + 6 && <rect x={2436} y={P - 190} width={78} height={20} fill="#5a4a5e" />}
          <EnColchon look={THEO_CASA} x={760} caras={[{ f: 0, v: "cansado" }, { f: k(53.7), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(53.7), v: { x: 1, y: 0.6 } }]}
            ajuste={ik2(ik("D", (q) => entre(q, k(53.7), k(54.6)) ? { x: 150, y: -70 - pat(q) } : { x: 92, y: -150 }, A_COLCHON), ik("I", () => ({ x: 80, y: -130 }), A_COLCHON))} />
          <Pj look={JUNE} ruta={jr} dir={[{ f: 0, v: 1 }, { f: k(57.3), v: -1 }, { f: k(57.85), v: 1 }]}
            poses={[{ f: 0, v: CUCLI }, { f: k(54.6), v: "parado" }]} asiento={[{ f: 0, v: A_CUCLI }, { f: k(54.6), v: undefined }]}
            caras={[{ f: 0, v: "cansado" }, { f: k(53.2), v: "feliz" }, { f: k(55.8), v: "duda" }, { f: k(57.0), v: "neutral" }, { f: k(58.3), v: "determinado" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.2 } }, { f: k(55.8), v: { x: 1, y: 0.5 } }, { f: k(56.6), v: { x: 1, y: -0.3 } }, { f: k(58.6), v: { x: 1, y: 0.2 } }]} luz={BORDE_CALIDO} seed={2}
            ajuste={ik("D", (q) => entre(q, k(53.0), k(54.5)) ? { x: 110, y: -120 } : entre(q, k(56.55), lata) ? { x: 80, y: -330 } : entre(q, k(57.9), toma + 6) ? { x: 85, y: -186 } : q >= toma + 6 ? { x: 70, y: -230 } : null, A_CUCLI)}
            enManoD={(q: number) => q >= toma + 6 ? <CuadernoMano /> : q > lata && q < k(57.9) ? <Lata color="#c0352c" /> : null} />
        </>} />
      <Pildora texto="THE BRICK HOUSE ON 7TH AVENUE EAST" x={960} y={986} desde={k(49.6)} hasta={k(51.8)} color={AMBAR} tam={38} />
      <Pildora texto="SHRINKS TO ONE ROOM" x={960} y={986} desde={k(51.95)} hasta={k(52.95)} color={FRIO} tam={38} />
      <EtiquetaObj texto="A WOOD STOVE" desde={k(53.06)} hasta={k(53.75)} px={est.x} py={est.y} tx={est.x - 360} ty={200} />
      <EtiquetaObj texto="TWO MATTRESSES" desde={k(54.15)} hasta={k(55.3)} px={col.x} py={col.y} tx={1000} ty={300} />
      <EtiquetaObj texto="A TABLE" desde={k(55.8)} hasta={k(56.3)} px={mesa.x} py={mesa.y} tx={mesa.x - 420} ty={300} />
      <EtiquetaObj texto="A SHELF OF CANS" desde={k(56.75)} hasta={k(57.6)} px={est2.x} py={est2.y} tx={est2.x - 560} ty={220} />
      <EtiquetaObj texto="THE RED NOTEBOOK" desde={k(58.45)} px={cua.x} py={cua.y - 60} tx={1150} ty={250} color="#e2483a" tam={40} />
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
            dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: k(60.45), v: "feliz" }, { f: k(61.04), v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: 0.2 } }, { f: k(60.3), v: { x: 1, y: -0.1 } }, { f: k(61.04), v: { x: -1, y: 0.3 } }]}
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
  // v3e: el MUNDO a escala (casa 520 px, Theo 307 px, 1 cuerda = 418 × 209 px = 8 × 4 ft): Theo deja su leño en su pilita
  // y aparecen 3 cuerdas de verdad en fila; arriba las 3 que pueden faltar (fantasma); él mira y se rasca la cabeza
  const suelta = k(63.5);
  const claves = [mira(0, 2280, B - 300, 1.32), mira(k(64.55), 2250, B - 310, 1.34, { curva: "inout" }), mira(k(65.3), 2790, B - 400, 0.98, { curva: "inout" })]; // v5a: Theo más grande en ini/mid
  const PX0 = 2330, CW = 418, CH = 209;
  return (
    <AbsoluteFill>
      <EscenaL Set={Barrio} pal={PAL} claves={claves} seed={16} setProps={{ hora: "invierno", luces: 0, nieve: 1, cae: true, humo: 0 }}
        medio={<>
          <HumoChim x={2090} y={B - 770} f={f} color="#b8bcd0" />
          <PilaLenaE x={1880} piso={B} w={240} h={70 + (f > suelta + 6 ? 8 : 0)} prog={1} seed={9} estacas={false} />
          {[0, 1, 2].map((i) => <PilaLenaE key={i} x={PX0 + i * CW} piso={B} w={CW} h={CH} prog={ramp(f, tres + i * 4, tres + i * 4 + 10)} seed={i} num={`${i + 1}`} prof={i === 2 ? 70 : 0} />)}
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 2560, y: B }, { f: k(63.3), x: 2240 }]} dir={[{ f: 0, v: -1 }, { f: k(64.6), v: 1 }]}
            poses={[{ f: 0, v: "parado" }, { f: suelta, v: "agacharse" }, { f: k(63.96), v: { hD: 122, cD: 0, hI: 20, cI: 30, tronco: -4, cabeza: -10 } }, { f: k(64.7), v: { hD: 70, cD: 40, hI: 55, cI: 45, tronco: 4 } }, { f: tres, v: "parado" }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(63.96), v: "duda" }, { f: k(64.7), v: "determinado" }, { f: tres, v: "sorpresa" }, { f: seis + 4, v: "duda" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: suelta, v: { x: 1, y: 0.6 } }, { f: k(63.96), v: { x: 0.5, y: -0.85 } }, { f: k(64.7), v: { x: 1, y: 0.15 } }, { f: tres, v: { x: 0.7, y: -0.7 } }, { f: seis, v: { x: 0.6, y: -0.8 } }]}
            ajuste={ik("D", (q) => q < suelta ? { x: 60, y: -150 } : q > seis + 6 ? { x: 10 + 6 * Math.sin(q / 2), y: -300 } : null)}
            enManoD={(q: number) => q < suelta + 2 ? <Lenio s={0.6} rot={0} /> : null} luz={BORDE_FRIO} />
          <Aliento {...boca(interpolate(f, [0, k(63.3)], [2560, 2240], cl), B, f < k(64.6) ? -1 : 1)} f={f} />
        </>} frente={<NieveCae f={f} n={50} x0={1000} w={3000} y0={B - 1200} h={1300} />} />
      <Pildora texto="ONE HOUSE · NORTHERN MINNESOTA" x={960} y={978} desde={k(62.26)} hasta={k(65.0)} color={FRIO} tam={38} />
      <RotuloV5 texto="3 – 6 CORDS" sub="OF WOOD · ONE WINTER" subDesde={seis + 4} x={960} y={118} desde={tres} color={AMBAR} tam={52} />
      {/* v4e: contador de cuerdas en el cielo (en vez de los bloques fantasma sobre las casas) */}
      <FilaCuerdasE4 x={960} y={238} desde={tres - 4} llenas={[tres, tres + 4, tres + 8]} fantasma={seis} />
    </AbsoluteFill>
  );
};

// ---------- 17 · una cuerda: una pila de 4 × 4 × 8 pies ----------
// v3e: en el baldío (sin casas detrás), Theo arma la pila leño a leño, palmea arriba («4 ft high»), da un paso atrás y
// señala la profundidad («4 ft wide»), y camina a lo largo mientras se dibuja la cota («8 ft long»)
export const P17Cuerda: React.FC = () => {
  const f = useF();
  const k = kDe(66.82);
  const X = 2330, W = 418, H = 209, D = 100; // donde estaba la cuerda 1 de P16 (continuidad)
  const prog = ramp(f, k(67.0), k(67.6));
  const alto = k(67.78), ancho = k(69.42), largo = k(70.14);
  // v4e: Theo a la DERECHA de la pila (nunca metido en ella): la arma desde 2830, da un paso atrás a 2960 mientras la pila
  // toma profundidad, palmea arriba («high»), señala la cota de profundidad en el cielo («wide») y barre con el brazo el
  // largo («long»); las cotas: HIGH vertical en el hueco entre la casa de ladrillo y la cota, WIDE en el cielo con guía
  const tx = (q: number) => interpolate(q, [0, k(67.55), k(67.85)], [2830, 2830, 2960], cl);
  const pr = D * ramp(f, k(67.6), k(67.85));
  const WX = 3117, WY = B - 542; // v5a: «4 FT WIDE» más abajo, en el cielo entre el techo verde y el violeta (borde sup. ≥ 190 px)
  const barre = ramp(f, largo, largo + 22);
  return (
    <AbsoluteFill>
      <EscenaL Set={Barrio} pal={PAL} claves={[mira(0, 2600, B - 300, 1.2), mira(k(69.95), 2600, B - 300, 1.2), mira(k(70.6), 2570, B - 290, 1.22, { curva: "inout" })]} seed={17} setProps={{ hora: "invierno", luces: 0, nieve: 1, humo: 0 }}
        medio={<>
          <PilaLenaE x={X} piso={B} w={W} h={H} prog={prog} seed={7} prof={pr} />
          {/* 4 ft high: cota a la izquierda, texto vertical en el hueco con la casa de ladrillo */}
          <CotaE x1={X - 50} y1={B} x2={X - 50} y2={B - H} p={ramp(f, alto, alto + 10)} />
          <text x={0} y={0} transform={`translate(${X - 86},${B - H / 2}) rotate(-90)`} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={34} fill={AMBAR} stroke="#120f18" strokeWidth={6} paintOrder="stroke" opacity={ramp(f, alto + 4, alto + 12)}>4 FT HIGH</text>
          {/* 4 ft wide (profundidad): el canto oblicuo de arriba + guía punteada al cielo */}
          <CotaE x1={X + W + 8} y1={B - H - 22} x2={X + W + D + 8} y2={B - H - 22 - D * 0.62} p={ramp(f, ancho, ancho + 10)} />
          <line x1={X + W + D / 2 + 14} y1={B - H - 60} x2={X + W + D / 2 + 14 + (WX - 120 - X - W - D / 2 - 14) * ramp(f, ancho + 4, ancho + 14)} y2={B - H - 60 + (WY + 14 - B + H + 60) * ramp(f, ancho + 4, ancho + 14)} stroke={AMBAR} strokeWidth={3} strokeDasharray="8 7" opacity={ramp(f, ancho + 4, ancho + 8) * 0.9} />
          <text x={WX} y={WY + 12} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={36} fill={AMBAR} stroke="#120f18" strokeWidth={6} paintOrder="stroke" opacity={ramp(f, ancho + 8, ancho + 16)}>4 FT WIDE</text>
          {/* 8 ft long: cota abajo */}
          <CotaE x1={X} y1={B + 40} x2={X + W} y2={B + 40} p={ramp(f, largo, largo + 12)} />
          <text x={X + W / 2} y={B + 96} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={36} fill={AMBAR} stroke="#120f18" strokeWidth={6} paintOrder="stroke" opacity={ramp(f, largo + 4, largo + 12)}>8 FT LONG</text>
          <Pj look={THEO_INV} ruta={[0, k(67.55), k(67.85)].map((q) => ({ f: q, x: tx(q), y: B }))} dir={[{ f: 0, v: -1 }]}
            poses={[{ f: 0, v: "parado" }, { f: alto, v: "parado" }, { f: ancho, v: "señalar" }, { f: k(71.1), v: "manosCintura" }]}
            caras={[{ f: 0, v: "determinado" }, { f: alto, v: "feliz" }, { f: ancho, v: "neutral" }, { f: largo, v: "determinado" }, { f: k(71.1), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: alto, v: { x: 1, y: -0.1 } }, { f: ancho, v: { x: 0.3, y: -0.9 } }, { f: largo, v: { x: 1, y: 0.4 } }, { f: k(71.1), v: { x: 1, y: 0 } }]}
            ajuste={ik("D", (q) => q < k(67.55) ? { x: 90, y: -Math.max(50, H * ramp(q, k(67.0), k(67.6))) - 18 + ((q % 10) < 5 ? 0 : 8) }
              : q < alto ? null
              : q < ancho ? { x: 118, y: -H - 52 }
              : q < largo ? { x: 70, y: -360 }
              : q < k(71.1) ? { x: 150 - 40 * barre, y: -170 + 60 * barre } : null)}
            enManoD={(q: number) => q < k(67.6) ? <Lenio s={0.55} rot={0} /> : null} luz={BORDE_FRIO} />
          <Aliento {...boca(tx(f), B, -1)} f={f} />
        </>} />
      <RotuloV5 texto="ONE CORD" sub="4 × 4 × 8 FT" subDesde={k(70.5)} x={960} y={118} desde={k(66.98)} color={AMBAR} tam={46} />
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
          {/* v3e: el calendario de la pared pasa de OCTOBER a NOVEMBER (en el mundo, lejos de la alarma de CO) */}
          <CalParedE x={250} y={P - 520} de="OCTOBER" a="NOVEMBER" pasa={k(71.86)} f={f} s={1.15} />
          <Rodajas x={60} piso={P} />
          {f < toma && <g transform={`translate(390,${P - 14})`}><Lenio s={0.6} rot={0} /></g>}
          <Pj look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: -1 }]}
            poses={[{ f: 0, v: "manosCintura" }, { f: k(72.3), v: "arrodillado" }, { f: k(73.3), v: "parado" }]}
            caras={[{ f: 0, v: "duda" }, { f: k(72.6), v: "neutral" }, { f: k(73.1), v: "triste" }]} miradas={[{ f: 0, v: { x: -1, y: -0.3 } }, { f: k(72.1), v: { x: 1, y: 0.4 } }, { f: k(73.3), v: { x: 1, y: -0.1 } }, { f: k(74.0), v: { x: -1, y: 0.2 } }]}
            ajuste={ik("D", (q) => entre(q, k(72.4), toma + 2) ? { x: TX - 390, y: -16 } : q >= k(73.3) ? { x: 70, y: -230 } : null)}
            enManoD={(q: number) => q >= toma ? <Lenio s={0.6} rot={0} /> : null} />
        </>} />
      <Pildora texto="ALMOST NOTHING SPLIT" x={1000} y={180} desde={k(73.1)} color="#e2483a" tam={42} />
    </AbsoluteFill>
  );
};

// ---------- 19 · Theo fue liniero: sabe de motosierras y de árboles ----------
export const P19Liniero: React.FC = () => {
  const f = useF();
  const k = kDe(74.62);
  const TX = 2440;
  const fb = k(76.06);
  const on = f > k(77.55);
  const corta = f > k(78.14);
  const corte = ramp(f, k(78.14), k(78.9));
  const SX = TX + 90; // mango trasero de la sierra (la mano derecha de Theo)
  const sierraY = (q: number) => interpolate(q, [k(77.6), k(77.85)], [26, 165], cl); // altura del mango sobre el piso
  // v3e: «Theo is a lineman» se VE: recuerdo (velo cálido) de Theo con casco y chaleco trepado al poste, chispas en el
  // transformador; corte seco al presente: tira de la cuerda de arranque, humo de escape, la sierra vibra y corta
  if (f < fb) return (
    <AbsoluteFill>
      <RecuerdoV6>{/* v6a: sin velo crema encima (lavaba el cuadro): filtro + tinte multiply + viñeta */}
      <EscenaL Set={Barrio} pal={PAL} claves={[mira(0, 2190, B - 480, 1.3), mira(fb, 2200, B - 500, 1.38, { curva: "inout" })]} seed={19} setProps={{ hora: "dia", luces: 0, nieve: 0.4, humo: 0 }}
        medio={<>
          <Poste x={2120} piso={B} />
          <Pj look={THEO_LINIERO_E} ruta={[{ f: 0, x: 2178, y: B - 330 }, { f: k(75.2), x: 2178, y: B - 360 }]} dir={[{ f: 0, v: -1 }]}
            poses={[{ f: 0, v: "agarrarAlto" }, { f: k(75.36), v: "parado" }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(75.4), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: -0.6 } }, { f: k(75.4), v: { x: -1, y: 0.1 } }]}
            ajuste={ik2(ik("I", () => ({ x: 52, y: -280 })), ik("D", (q) => q < k(75.36) ? { x: 60, y: -320 } : { x: 70, y: -230 }))} />
          <Chispas x={2120} y={B - 700} f={f} desde={k(74.9)} />
        </>} />
      </RecuerdoV6>
      <Pildora texto="THEO WAS A LINEMAN" x={1240} y={150} desde={k(74.9)} color={AMBAR} tam={44} />
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill>
      <EscenaL Set={Barrio} pal={PAL} claves={[mira(fb, 2400, B - 370, 1.35), mira(k(77.0), 2420, B - 370, 1.35), mira(k(77.6), 2600, B - 300, 1.6, { curva: "inout" })]} seed={19} setProps={{ hora: "invierno", luces: 0, nieve: 1, humo: 0 }}
        medio={<>
          {/* el tronco caído sobre dos caballetes */}
          {[2620, 2900].map((x) => <path key={x} d={`M${x - 40},${B} L${x + 40},${B - 160} M${x + 40},${B} L${x - 40},${B - 160}`} stroke="#5a3a24" strokeWidth={14} />)}
          <rect x={2560} y={B - 200} width={500} height={60} rx={28} fill="#7a5034" />
          {corte > 0 && <rect x={2640} y={B - 202} width={8 + corte * 16} height={64 * corte} fill="#3a2a22" />}
          <ellipse cx={3060} cy={B - 170} rx={14} ry={30} fill="#c89a6a" />
          <Aserrin x={2650} y={B - 170} f={f} on={corta && corte < 1} />
          <Pj look={THEO_INV} ruta={[{ f: 0, x: TX, y: B }]} dir={[{ f: 0, v: 1 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(76.9), v: "agacharse" }, { f: k(77.25), v: "tirarCarga" }, { f: k(77.55), v: "parado" }]}
            caras={[{ f: 0, v: "feliz" }, { f: k(76.9), v: "determinado" }, { f: k(77.6), v: "picaro" }, { f: k(78.2), v: "determinado" }]} miradas={[{ f: 0, v: { x: -1, y: 0 } }, { f: k(76.5), v: { x: 1, y: 0.4 } }, { f: k(77.6), v: { x: 1, y: 0.2 } }]}
            ajuste={ik("D", (q) => q < k(76.9) ? null : { x: SX - TX, y: -sierraY(q) + (entre(q, k(77.25), k(77.55)) ? -200 * Math.sin(Math.PI * ramp(q, k(77.25), k(77.5))) : 0) })}
            giros={on ? Array.from({ length: 30 }).map((_, i) => ({ f: k(77.6) + i * 3, v: i % 2 ? 0.03 : -0.03 })) : undefined} />
          {/* v4e: la sierra en el mundo: en el piso → tira de la cuerda de arranque → la levanta al tronco, vibra 2 px y echa humo */}
          {entre(f, k(77.25), k(77.55)) && <line x1={SX - 26} y1={B - sierraY(f) - 20} x2={SX} y2={B - sierraY(f) - 200 * Math.sin(Math.PI * ramp(f, k(77.25), k(77.5)))} stroke="#2a2228" strokeWidth={3} />}
          <SierraVivaE4 x={SX} y={B - sierraY(f)} f={f} on={on} />
          <HumoSierraE4 x={SX - 24} y={B - sierraY(f) + 18} f={f} desde={k(77.55)} dir={-1} n={10} />
          <Aliento {...boca(TX, B, 1)} f={f} />
        </>} />
      <Pildora texto="HE KNOWS CHAINSAWS · AND TREES" x={720} y={104} desde={k(77.2)} color={AMBAR} tam={36} />{/* v6a: una sola línea, tamaño normal */}
    </AbsoluteFill>
  );
};

// ---------- 20 · la regla de June en la heladera: nada de motosierra a solas ----------
// v3e: general (June va a la heladera y señala la nota; Theo entra con la sierra) → CORTE al inserto de la nota con la
// mano de June (manga verde agua + lápiz) que subraya y encierra «no chainsaws» → CORTE: June lo señala, Theo baja la sierra
export const P20Regla: React.FC = () => {
  const f = useF();
  const k = kDe(79.5);
  const i0 = k(81.5), i1 = k(83.0);
  if (f >= i0 && f < i1) {
    const marca = ramp(f, k(81.7), k(82.3));
    const circ = ramp(f, k(82.35), k(82.95));
    const pt = puntaNotaE(marca, circ);
    const llega = ramp(f, i0, k(81.7));
    const hx = f < k(81.7) ? interpolate(llega, [0, 1], [1500, 680]) : pt.x;
    const hy = f < k(81.7) ? interpolate(llega, [0, 1], [1200, 744]) : pt.y;
    return (
      <AbsoluteFill>
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <NotaReglasE marca={marca} circ={circ} />
          <g transform="rotate(-2 960 560)"><ManoLapizE x={hx} y={hy} manga="#2f7f86" s={0.7} /></g>
        </svg>
        <Rotulo3E texto="JUNE'S RULE" sub="FROM THE FIRST MONTH" x={1560} y={96} desde={i0 + 4} color="#e2483a" tam={40} />
      </AbsoluteFill>
    );
  }
  const despues = f >= i1;
  return (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={despues ? [mira(i1, 2930, P - 290, 1.38)] : [mira(0, 2900, P - 300, 1.3), mira(k(81.4), 2930, P - 300, 1.36, { curva: "inout" })]} seed={20} setProps={{ ...LIV_INV, reglas: 2 }}
        medio={<>
          <Pj look={JUNE} ruta={[{ f: 0, x: 2900, y: P }, { f: k(80.6), x: 3060 }]} dir={[{ f: 0, v: 1 }, { f: i1, v: -1 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(80.9), v: "señalar" }, { f: i1, v: "señalar" }]} caras={[{ f: 0, v: "determinado" }, { f: k(80.9), v: "neutral" }, { f: i1, v: "enojo" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(80.7), v: { x: 1, y: -0.7 } }, { f: i1, v: { x: 1, y: 0 } }]} seed={2} luz={BORDE_CALIDO}
            ajuste={ik("D", (q) => entre(q, k(80.9), i0) ? { x: 120, y: -400 } : null)} />
          <Pj look={THEO_CASA} ruta={[{ f: 0, x: 2560, y: P }, { f: k(80.2), x: 2560 }, { f: k(81.2), x: 2760 }]} dir={[{ f: 0, v: 1 }]}
            poses={[{ f: 0, v: "parado" }, { f: i1 + 4, v: "encogerse" }]} caras={[{ f: 0, v: "feliz" }, { f: k(80.9), v: "duda" }, { f: i1 + 2, v: "triste" }]}
            miradas={[{ f: 0, v: { x: -1, y: 0 } }, { f: k(80.3), v: { x: 1, y: 0 } }, { f: k(80.95), v: { x: 1, y: -0.5 } }, { f: i1 + 2, v: { x: 1, y: 0.4 } }]}
            ajuste={ik("D", (q) => q > i1 + 2 ? { x: 50, y: -70 } : null)}
            enManoD={<Motosierra />} luz={BORDE_CALIDO} />
        </>} />
    </AbsoluteFill>
  );
};

// ---------- 21 · cortan de a dos: uno pasa la sierra, el otro mira ----------
// v3: rótulos sobre la nieve del frente (zona lisa), líneas al pecho / a la sierra (nunca a la cara); June alerta → aprueba
export const P21DeADos: React.FC = () => {
  const f = useF();
  const k = kDe(83.64);
  const postes = [2560, 2620, 2680];
  const cortes = [k(84.2), k(85.4), k(86.6)];
  const actual = cortes.filter((c) => f >= c - 14).length - 1;
  const TX = postes[Math.max(0, actual)] - 120;
  const ruta = [{ f: 0, x: postes[0] - 120, y: B }, { f: cortes[1] - 14, x: postes[0] - 120 }, { f: cortes[1] - 4, x: postes[1] - 120 }, { f: cortes[2] - 14, x: postes[1] - 120 }, { f: cortes[2] - 4, x: postes[2] - 120 }];
  const cae = (i: number) => ramp(f, cortes[i] + 10, cortes[i] + 22);
  const claves = [mira(0, 2400, B - 270, 1.35), mira(118, 2430, B - 270, 1.4)];
  const sierra = aPantalla(claves, f, TX + 150, B - 150);
  const pechoJ = aPantalla(claves, f, 2130, B - 190);
  return (
    <AbsoluteFill>
      <EscenaL Set={Barrio} pal={PAL} claves={claves} seed={21} setProps={{ hora: "invierno", luces: 0, nieve: 1, humo: 0 }}
        medio={<>
          {[2740, 2800, 2860, 2920].map((x) => <rect key={x} x={x} y={B - 220} width={34} height={220} fill="#a8875a" stroke="#6a5030" strokeWidth={3} />)}
          <rect x={2550} y={B - 190} width={420} height={16} fill="#8f7048" opacity={0.6} />
          {postes.map((x, i) => <g key={x}>
            <rect x={x} y={B - 150} width={34} height={150} fill="#a8875a" stroke="#6a5030" strokeWidth={3} />
            <g transform={`rotate(${cae(i) * 80} ${x + 34} ${B - 150})`}><rect x={x} y={B - 220} width={34} height={70} fill="#a8875a" stroke="#6a5030" strokeWidth={3} /></g>
            <Aserrin x={x + 6} y={B - 150} f={f} on={f >= cortes[i] && f < cortes[i] + 12} />
          </g>)}
          <Pj look={THEO_INV} ruta={ruta} poses={[{ f: 0, v: "parado" }, { f: cortes[0] + 14, v: { tronco: 10 } }, { f: cortes[1] + 14, v: { tronco: 6 } }, { f: cortes[2] + 14, v: { tronco: 12, cabeza: -6 } }]}
            caras={[{ f: 0, v: "determinado" }, { f: cortes[0] + 16, v: "feliz" }, { f: cortes[1], v: "determinado" }, { f: cortes[1] + 16, v: "feliz" }, { f: cortes[2], v: "determinado" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: cortes[0] + 18, v: { x: -1, y: 0 } }, { f: cortes[1] - 6, v: { x: 1, y: 0.3 } }]}
            ajuste={ik("D", (q) => ({ x: 0 + (entre(q, cortes[0], cortes[0] + 12) || entre(q, cortes[1], cortes[1] + 12) || entre(q, cortes[2], cortes[2] + 12) ? Math.sin(q * 2) * 4 : -10), y: -118 }))}
            enManoD={(q: number) => <Motosierra f={q} on />} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 2130, y: B }]} poses={[{ f: 0, v: "brazosCruzados" }, { f: cortes[0], v: "encogerse" }, { f: cortes[0] + 14, v: "manosCintura" }, { f: k(86.56), v: "señalar" }, { f: k(87.2), v: { hD: 120, cD: 40, hI: -6, cI: 10 } }]}
            caras={[{ f: 0, v: "determinado" }, { f: cortes[0], v: "sorpresa" }, { f: cortes[0] + 14, v: "duda" }, { f: k(86.56), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.1 } }, { f: cortes[0], v: { x: 1, y: 0.4 } }, { f: k(86.56), v: { x: 1, y: 0 } }]} seed={2} />
          <Aliento {...boca(2130, B)} f={f} desfase={10} /><Aliento {...boca(TX, B)} f={f} />
        </>} />
      <Rot texto="ALWAYS TOGETHER" x={960} y={1000} desde={k(83.96)} hasta={k(85.1)} color={AMBAR} tam={42} />
      <EtiquetaObj texto="RUNS THE SAW" desde={k(85.32)} px={sierra.x} py={sierra.y} tx={1380} ty={1020} />
      <EtiquetaObj texto="WATCHES" desde={k(86.56)} px={pechoJ.x} py={pechoJ.y} tx={620} ty={1020} color={FRIO} />
    </AbsoluteFill>
  );
};

// ---------- 22 · lo inteligente no es lo de la película: no talar árboles verdes en el bosque ----------
// v3: (A) Theo llega al pino con la sierra · (B) CORTE a «la película»: tala y el árbol cae LEJOS de él ·
// (C) CORTE a la realidad: June entra y lo frena con la palma, Theo baja la sierra; la X sólo sobre el árbol
const Bosque: React.FC<any> = ({ capa, f }) => {
  if (capa === "lejos") return <g><rect x={-2000} y={-2000} width={8000} height={5000} fill="#9fb4cc" /><path d="M-2000,620 L-600,420 L200,560 L1100,380 L2100,560 L3000,420 L4600,600 V1400 H-2000 Z" fill="#c8d4e4" /></g>;
  if (capa === "frente") return null;
  return (
    <g>
      {Array.from({ length: 16 }).map((_, i) => <Pino key={i} x={-300 + i * 190 + ((i * 53) % 60)} piso={880 - (i % 3) * 14} h={300 + ((i * 71) % 140)} color={i % 2 ? "#4a7a5a" : "#5a8a64"} nieve={0.4} />)}
      <rect x={-2000} y={880} width={8000} height={600} fill="#eef2fa" />
      <NieveCae f={f} n={60} x0={-200} w={3000} y0={0} h={900} />
    </g>
  );
};
export const P22Bosque: React.FC = () => {
  const f = useF();
  const k = kDe(87.56);
  const peli = k(90.1), no = k(91.14);
  const enPeli = f >= peli && f < no;
  const cae = enPeli ? ramp(f, peli + 8, peli + 24) : 0;
  const claves = [mira(0, 1300, 600, 1.12), mira(peli - 1, 1260, 600, 1.2, { curva: "inout" }), mira(peli, 1180, 610, 1.05), mira(no - 1, 1170, 610, 1.08), mira(no, 1300, 600, 1.2), mira(167, 1320, 600, 1.24, { curva: "inout" })];
  // Theo: llega (A) · en la película al pie del árbol (B) · en la realidad a 500 px del árbol (C)
  const ruta = f < peli ? [{ f: 0, x: 1880, y: 880 }, { f: k(89.2), x: 1520 }] : f < no ? [{ f: 0, x: 1140, y: 880 }] : [{ f: 0, x: 1520, y: 880 }];
  const theoPoses: { f: number; v: string | Partial<Pose> }[] = f < peli
    ? [{ f: 0, v: { hD: 30, cD: 30 } }, { f: k(89.3), v: "pensar" }, { f: k(89.9), v: { hD: 110, cD: 10 } }]
    : f < no ? [{ f: 0, v: { tronco: 14, hD: 70, cD: 10, hI: 40, cI: 30 } }, { f: peli + 16, v: "celebrar" }]
      : [{ f: 0, v: { hD: 110, cD: 10 } }, { f: no + 14, v: { hD: 100, cD: 20, tronco: -6 } }, { f: k(91.9), v: { hD: 15, cD: 25, cabeza: 8 } }, { f: k(92.6), v: { hD: 15, cD: 25, hI: 40, cI: 100 } }];
  const theoCaras = f < peli ? [{ f: 0, v: "neutral" }, { f: k(88.0), v: "duda" }, { f: k(89.3), v: "picaro" }]
    : f < no ? [{ f: 0, v: "determinado" }, { f: peli + 16, v: "risa" }]
      : [{ f: 0, v: "determinado" }, { f: no + 14, v: "sorpresa" }, { f: k(91.9), v: "duda" }, { f: k(92.6), v: "triste" }];
  const theoDir: { f: number; v: 1 | -1 }[] = f < no ? [{ f: 0, v: -1 }] : [{ f: 0, v: -1 }, { f: no + 12, v: 1 }];
  const xTree = ramp(f, k(91.56), k(92.1));
  return (
    <AbsoluteFill>
      <EscenaL Set={Bosque} pal={PAL} claves={claves} seed={22}
        medio={<>
          {/* el pino verde: en la película cae hacia la IZQUIERDA (lejos de Theo); en la realidad queda en pie */}
          <g transform={`rotate(${-cae * 84} 980 880)`}><Pino x={980} piso={880} h={560} color="#2f7a44" nieve={0} /></g>
          {f >= no && <XRoja x={790} y={360} w={380} h={460} prog={xTree} grosor={26} />}
          <Pj look={THEO_INV} ruta={ruta} dir={theoDir} enManoD={(q: number) => <Motosierra f={q} on={q >= peli && q < no} />}
            poses={theoPoses} caras={theoCaras} miradas={[{ f: 0, v: { x: 1, y: -0.4 } }, { f: no + 12, v: { x: 1, y: 0 } }]} luz={BORDE_FRIO} />
          {f >= no && <Pj look={JUNE_INV} ruta={[{ f: 0, x: 2200, y: 880 }, { f: no, x: 2200 }, { f: no + 16, x: 1820 }]} dir={[{ f: 0, v: -1 }]}
            poses={[{ f: 0, v: "parado" }, { f: no + 12, v: { hD: 95, cD: -25, tronco: -4 } }, { f: k(92.6), v: "manosCintura" }]}
            caras={[{ f: 0, v: "enojo" }, { f: k(92.6), v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} luz={BORDE_FRIO} seed={2} />}
          <Aliento {...boca(f < peli ? 1520 : 1140, 880, -1)} f={f} dir={-1} />
        </>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <MarcoPeli x={300} y={170} w={1320} h={700} o={enPeli ? 1 : 0} rotulo="IN THE MOVIES" />
      </svg>
      <Rot texto="THE SMART THING" x={960} y={995} desde={k(88.02)} hasta={peli - 6} color={AMBAR} tam={42} />
      {enPeli && <Globo texto="TIMBER!" x={700} y={420} desde={peli + 14} hasta={no} tam={50} />}
      <Rot texto="NO GREEN TREES FROM THE FOREST" x={960} y={995} desde={k(91.56)} color="#e2483a" tam={42} />
    </AbsoluteFill>
  );
};

// ---------- 23 · madera seca: cercos, pallets, muebles viejos de casas vacías ----------
// v3: June adelante con el pallet a la cadera, Theo con las tablas al hombro tira del trineo con la silla vieja;
// rótulos abajo, sobre la nieve, con la línea a la carga (nunca a una cara); separados 300 px todo el plano
const Pallet: React.FC = () => <g transform="translate(30,40) rotate(-4)">{[0, 1, 2, 3].map((i) => <rect key={i} x={-80 + i * 46} y={-60} width={30} height={120} fill="#c8a070" stroke="#8a6a3a" strokeWidth={2} />)}<rect x={-86} y={-40} width={180} height={18} fill="#a88050" /><rect x={-86} y={20} width={180} height={18} fill="#a88050" /></g>;
const SillaVieja: React.FC = () => <g transform="translate(0,-30) rotate(8)"><rect x={-40} y={-10} width={80} height={14} fill="#8a5a3a" /><rect x={-40} y={-90} width={12} height={160} fill="#7a4a2e" /><rect x={28} y={0} width={12} height={70} fill="#7a4a2e" /><rect x={-40} y={-80} width={60} height={10} fill="#8a5a3a" /><rect x={-40} y={-56} width={60} height={10} fill="#8a5a3a" /></g>;
const Trineo: React.FC<{ x: number; piso: number; f: number }> = ({ x, piso, f }) => (
  <g>
    <path d={`M${x - 130},${piso - 8} H${x + 110} q30,0 34,-26`} stroke="#4a3a30" strokeWidth={8} fill="none" strokeLinecap="round" />
    <rect x={x - 120} y={piso - 40} width={230} height={24} rx={6} fill="#a04a32" stroke="#5a2a1a" strokeWidth={3} />
    <g transform={`translate(${x - 40},${piso - 40})`}><SillaVieja /></g>
    <g transform={`translate(${x + 50},${piso - 40})`}><rect x={-40} y={-56} width={80} height={56} rx={4} fill="#7a5032" stroke="#4a2e1c" strokeWidth={3} /><rect x={-30} y={-46} width={60} height={18} fill="#8f6040" /><circle cx={0} cy={-37} r={4} fill="#e0c080" /></g>
    {[0, 1].map((i) => <circle key={i} cx={x - 100 + ((f * 3 + i * 90) % 200)} cy={piso - 4} r={4} fill="#ffffff" opacity={0.7} />)}
  </g>
);
export const P23Seca: React.FC = () => {
  const f = useF();
  const k = kDe(93.14);
  const claves = [mira(0, 1060, B - 280, 1.18), mira(178, 1500, B - 280, 1.22, { curva: "inout" })];
  const tx = (q: number) => interpolate(q, [0, 178], [980, 1500], cl);
  const jx = (q: number) => tx(q) + 480; // v4: 150 px más lejos (no se pisan)
  const sx = (q: number) => tx(q) - 260;
  const tablas = aPantalla(claves, f, tx(f) + 120, B - 120);
  const pallet = aPantalla(claves, f, jx(f) + 90, B - 70);
  const trineo = aPantalla(claves, f, sx(f) - 40, B - 100);
  return (
    <AbsoluteFill>
      <EscenaL Set={Barrio} pal={PAL} claves={claves} seed={23} setProps={{ hora: "invierno", luces: 0, nieve: 1, humo: 0 }}
        medio={<>
          <Trineo x={sx(f)} piso={B} f={f} />
          <path d={`M${sx(f) + 144},${B - 34} Q${(sx(f) + tx(f)) / 2 + 40},${B - 40} ${tx(f) - 26},${B - 150}`} stroke="#d8c8a0" strokeWidth={4} fill="none" />
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 980, y: B }, { f: 178, x: 1500 }]}
            poses={[{ f: 0, v: { hD: 18, cD: 30, hI: -30, cI: 10, tronco: 8 } }, { f: k(97.04), v: { hD: 18, cD: 30, hI: -30, cI: 10, tronco: 14 } }, { f: k(97.9), v: { hD: 18, cD: 30, hI: -30, cI: 10, tronco: 6 } }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(94.54), v: "feliz" }, { f: k(97.04), v: "picaro" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(97.04), v: { x: -1, y: 0.3 } }, { f: k(98.0), v: { x: 1, y: 0 } }]}
            enManoD={<g transform="translate(30,40) rotate(10)"><Tablas /></g>} luz={BORDE_FRIO} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 1460, y: B }, { f: 178, x: 1980 }]}
            poses={[{ f: 0, v: { hD: 15, cD: 20, hI: 10, cI: 30 } }, { f: k(95.42), v: { hD: 22, cD: 30, hI: 10, cI: 30, tronco: 4 } }, { f: k(96.3), v: { hD: 15, cD: 20, hI: 10, cI: 30 } }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(95.42), v: "determinado" }, { f: k(97.6), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(95.5), v: { x: 1, y: 0.5 } }, { f: k(96.4), v: { x: -1, y: 0 } }, { f: k(97.6), v: { x: 1, y: 0 } }]}
            enManoD={<Pallet />} seed={2} luz={BORDE_FRIO} />
          <Aliento {...boca(tx(f), B)} f={f} /><Aliento {...boca(jx(f), B)} f={f} desfase={20} />
        </>} />
      <Rot texto="ONLY DRY WOOD" x={960} y={140} desde={0} hasta={k(94.45)} color={AMBAR} tam={42} />
      <EtiquetaObj texto="OLD FENCES" desde={k(94.54)} px={tablas.x} py={tablas.y} tx={tablas.x} ty={1010} />
      <EtiquetaObj texto="PALLETS · HARDWARE STORE" desde={k(95.42)} px={pallet.x} py={pallet.y} tx={Math.min(1500, pallet.x + 60)} ty={1010} tam={32} />
      <EtiquetaObj texto="OLD FURNITURE · EMPTY HOUSES" desde={k(97.04)} px={trineo.x} py={trineo.y} tx={Math.max(420, trineo.x - 40)} ty={1010} tam={32} />
    </AbsoluteFill>
  );
};

// ---------- 24 · la seca arde fuerte; la verde silba, humea y apenas calienta ----------
// v3: humo en volutas con degradé; Theo de la verde tose doblado con la mano en la boca; el de la seca se calienta las manos
const Termito2: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  const h = interpolate(t, [20, 80], [10, 150], cl);
  const col = t > 55 ? "#e2483a" : "#3a8adf";
  return <g><rect x={x - 30} y={y - 10} width={60} height={210} rx={16} fill="#f6f1e6" /><rect x={x - 7} y={y + 4} width={14} height={160} rx={7} fill="#fff" stroke="#c8c0b0" strokeWidth={2} /><rect x={x - 5} y={y + 164 - h} width={10} height={h} fill={col} /><circle cx={x} cy={y + 176} r={14} fill={col} /><text x={x} y={y + 236} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight={800} fontSize={30} fill="#f6ecd2">{Math.round(t)}°F</text></g>;
};
export const P24DosEstufas: React.FC = () => {
  // v4: plano MEDIO de cada mitad (escala 1,5: Theo ~45 % del alto); la seca: Theo se acerca, se frota las manos y se ríe;
  // la verde: silba, se asoma, el humo le da en la cara, tose doblado con la mano en la boca y lo espanta con la mano
  const f = useF();
  const k = kDe(99.09);
  const verde = k(100.67);
  const tSeca = interpolate(f, [k(99.3), k(100.6)], [45, 74], cl);
  const tVerde = interpolate(f, [verde, k(102.7)], [45, 49], cl);
  const tos = k(101.97), espanta = k(102.55);
  const frota = (q: number) => q > k(100.2) && q < k(101.3) ? Math.sin(q / 2.2) * 14 : 0;
  const S = 1.5;
  return (
    <AbsoluteFill style={{ background: "#2a2028" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <defs><clipPath id="p24i"><rect x={0} y={0} width={958} height={1080} /></clipPath><clipPath id="p24d"><rect x={962} y={0} width={958} height={1080} /></clipPath></defs>
        <g clipPath="url(#p24i)">
          <rect x={0} y={0} width={958} height={1080} fill="#4a3030" />
          <g transform={`translate(480 880) scale(${S}) translate(-480 -880)`}>
            <rect x={-200} y={880} width={1400} height={300} fill="#3a2a22" />
            <Estufa x={600} piso={880} f={f} fuego={1} />
            <Halo x={600} y={700} r={600} color="#ff9a4a" fuerza={0.45} />
            <Chispas x={600} y={640} f={f} desde={k(99.69)} n={14} />
            <Pj look={THEO_CASA} ruta={[{ f: 0, x: 300, y: 880 }, { f: k(99.6), x: 300 }, { f: k(100.0), x: 380 }]}
              poses={[{ f: 0, v: { hD: 30, cD: 20, hI: 20, cI: 30 } }, { f: k(99.69), v: { hD: 80, cD: 10, hI: 75, cI: 15, tronco: 8 } }, { f: k(100.2), v: { hD: 75, cD: 40, hI: 70, cI: 45, tronco: 4 } }, { f: k(101.3), v: { hD: 150, cD: 20, hI: 20, cI: 30, tronco: -4 } }, { f: k(102.4), v: { hD: 80, cD: 10, hI: 75, cI: 15, tronco: 10 } }]}
              caras={[{ f: 0, v: "cansado" }, { f: k(99.6), v: "sorpresa" }, { f: k(99.9), v: "feliz" }, { f: k(101.3), v: "risa" }, { f: k(102.4), v: "feliz" }]}
              miradas={[{ f: 0, v: { x: 1, y: 0.2 } }, { f: k(101.3), v: { x: -0.2, y: -0.1 } }, { f: k(102.4), v: { x: 1, y: 0.3 } }]} luz={BORDE_CALIDO}
              ajuste={(p, q) => { const d = frota(q); return d ? ({ ...p, cD: p.cD + d, cI: p.cI - d } as Pose) : p; }} />
          </g>
        </g>
        <g clipPath="url(#p24d)">
          <rect x={962} y={0} width={958} height={1080} fill="#2a2e38" />
          <g transform={`translate(1440 880) scale(${S}) translate(-1440 -880)`}>
            <rect x={700} y={880} width={1400} height={300} fill="#2e2620" />
            <Estufa x={1560} piso={880} f={f} fuego={f > verde ? 0.18 : 0} />
            {f > verde && <Volutas id="p24v" x={1500} y={640} f={f} n={5} color="#dfe6f2" o={interpolate(f, [verde, verde + 10], [0, 0.7], cl)} viento={-0.3} alto={160} r0={10} per={40} />}
            {f > verde && <Volutas id="p24h" x={1520} y={630} f={f} n={12} color="#8a8f9a" o={interpolate(f, [verde, verde + 20], [0, 1], cl)} viento={-0.75} alto={420} ancho={1.3} per={70} r0={26} />}
            <Pj look={THEO_CASA} ruta={[{ f: 0, x: 1290, y: 880 }, { f: k(101.15), x: 1290 }, { f: k(101.6), x: 1340 }, { f: espanta, x: 1340 }, { f: espanta + 14, x: 1270 }]}
              poses={[{ f: 0, v: { hD: 30, cD: 20 } }, { f: verde + 4, v: { hD: 70, cD: 20, tronco: 6 } }, { f: k(101.6), v: { hD: 75, cD: 15, tronco: 14, cabeza: 8 } }, { f: tos, v: { hD: 50, cD: 145, tronco: 30, cabeza: 14, hI: 30, cI: 40 } }, { f: espanta, v: { hD: 130, cD: 40, hI: 40, cI: 70, tronco: -10, cabeza: -6 } }, { f: espanta + 8, v: { hD: 100, cD: -20, hI: 40, cI: 70, tronco: -10, cabeza: -6 } }, { f: espanta + 16, v: { hD: 130, cD: 40, hI: 40, cI: 70, tronco: -10, cabeza: -6 } }, { f: espanta + 24, v: { hD: 100, cD: -20, hI: 40, cI: 70, tronco: -8 } }, { f: espanta + 34, v: "encogerse" }]}
              caras={[{ f: 0, v: "duda" }, { f: k(101.15), v: "sorpresa" }, { f: tos - 6, v: "asco" }, { f: espanta, v: "enojo" }, { f: espanta + 34, v: "triste" }]}
              miradas={[{ f: 0, v: { x: 1, y: 0.2 } }, { f: k(101.6), v: { x: 1, y: 0.5 } }, { f: espanta, v: { x: 1, y: -0.3 } }, { f: espanta + 34, v: { x: -1, y: 0.2 } }]}
              giros={Array.from({ length: 6 }).map((_, i) => ({ f: tos + i * 4, v: i === 5 ? 0 : i % 2 ? 0.25 : -0.25 }))} luz={BORDE_FRIO} />
            {/* golpes de tos: tres soplidos cortos que salen de la boca */}
            {[0, 10].map((d) => { const t = (f - tos - d) / 12; return t > 0 && t < 1 ? <g key={d} opacity={1 - t}>{[-18, 0, 18].map((a) => <path key={a} d={`M${1250 - t * 30},${668 + t * 10} l${-(30 + t * 26)},${a * (0.6 + t)}`} stroke="#f6ecd2" strokeWidth={6} strokeLinecap="round" />)}</g> : null; })}
          </g>
        </g>
        <Termito2 x={860} y={420} t={tSeca} />
        <Termito2 x={1830} y={420} t={f > verde ? tVerde : 45} />
        <rect x={958} y={0} width={4} height={1080} fill="#120f18" />
      </svg>
      <Rot texto="DRY · BURNS HOT" x={560} y={1012} desde={k(99.3)} color={AMBAR} tam={36} />
      <Rot texto="GREEN · HISSES & SMOKES" x={1440} y={1012} desde={verde} color="#b8bcc4" tam={36} />
      <Tic x={1640} y={560} f={f} en={[k(101.15), k(101.35), k(101.55)]} texto="hsss" color="#cfd4e4" />
    </AbsoluteFill>
  );
};

// ---------- 25 · día 60: la pila contra la pared de atrás, más alta que Theo ----------
// v3: leña DE VERDAD (troncos distintos, estacas); Theo trae un leño, lo tira arriba, palmea la pila, estira el brazo y no
// llega; June entra y chocan las manos. Cotas sobre la pared (no la ventana).
export const P25Pila: React.FC = () => {
  // v4: la alarma de la pared tapada; pila de 11 columnas (no llega al colchón); Theo y June caminan POR DELANTE de los
  // colchones (pies 50 px más abajo); la cota THEO va sobre la pared libre entre la pila y Theo; el choque de manos en el medio
  const f = useF();
  const k = kDe(103.65);
  const tira = k(104.93), pal = k(105.47), alto = k(106.39), rie = k(106.95), cho = k(107.45);
  const vuelo = ramp(f, tira, tira + 12);
  const FIL = 9, PX = 40, COLS = 11, PW = COLS * 50 + 30;
  const top = P - altoPila(FIL);
  const TX = 800, DY = 50, PF = P + DY;
  const cota = ramp(f, alto, alto + 12);
  const claves = [mira(0, 640, P - 240, 1.2), mira(129, 660, P - 250, 1.27, { curva: "inout" })];
  return (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={claves} seed={25} setProps={{ ...LIV_INV, lena: 0, mantas: true, alarma: false }}
        medio={<>
          <TapaAlarma piso={P} />
          <PilaLena x={PX} piso={P} cols={COLS} filas={FIL} prog={interpolate(f, [tira + 9, tira + 13], [0.985, 1], cl)} seed={3} />
          {f >= tira && vuelo < 1 && <g transform={`translate(${interpolate(vuelo, [0, 1], [TX - 70, 420])},${interpolate(vuelo, [0, 1], [PF - 250, top + 12]) - 240 * Math.sin(vuelo * Math.PI)})`}><Lenio s={0.7} rot={vuelo * 320} /></g>}
          <Pj look={THEO_CASA} ruta={[{ f: 0, x: 1120, y: PF }, { f: k(104.55), x: TX, y: PF }]} dir={[{ f: 0, v: -1 }, { f: rie, v: 1 }]}
            poses={[{ f: 0, v: { hD: 60, cD: 70 } }, { f: tira - 10, v: "tirarCarga" }, { f: tira, v: "tirarSuelta" }, { f: tira + 12, v: "parado" }, { f: pal, v: { hD: 70, cD: 20 } }, { f: alto, v: { hD: 168, cD: 0, tronco: -6, pI: -2, pD: 2, bajar: -10 } }, { f: rie, v: { hD: 20, cD: 30, hI: -10, cI: 20 } }, { f: cho - 8, v: { hD: 150, cD: 10 } }]}
            caras={[{ f: 0, v: "determinado" }, { f: tira, v: "feliz" }, { f: alto, v: "sorpresa" }, { f: rie, v: "risa" }]}
            miradas={[{ f: 0, v: { x: 1, y: -0.2 } }, { f: tira, v: { x: 1, y: -0.7 } }, { f: alto, v: { x: 1, y: -1 } }, { f: rie, v: { x: 1, y: 0 } }]}
            ajuste={ik("D", (q) => entre(q, pal, alto - 4) ? { x: TX - (PX + PW) - 10 + Math.sin(q / 2) * 6, y: -200 } : null)}
            enManoD={(q: number) => q < tira ? <Lenio s={0.7} /> : null} luz={BORDE_CALIDO} />
          <Pj look={JUNE} ruta={[{ f: 0, x: 1500, y: PF }, { f: k(106.6), x: 1500, y: PF }, { f: cho - 2, x: 1010, y: PF }]} dir={[{ f: 0, v: -1 }]}
            poses={[{ f: 0, v: "parado" }, { f: cho - 8, v: { hD: 150, cD: 10 } }, { f: cho + 10, v: "celebrar" }]}
            caras={[{ f: 0, v: "feliz" }, { f: k(106.95), v: "picaro" }, { f: cho, v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: -0.4 } }, { f: k(106.95), v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} seed={2} />
          {/* cotas sobre la pared */}
          <g opacity={cota}>
            <path d={`M${PX - 10},${top - 8} H${PX + PW + 10}`} stroke={AMBAR} strokeWidth={5} strokeDasharray="16 10" />
            <text x={PX + PW / 2} y={top - 24} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={34} fill={AMBAR}>THE STACK</text>
            <path d={`M${PX + PW + 14},${PF - 330} H${TX - 40}`} stroke="#f6ecd2" strokeWidth={4} strokeDasharray="10 8" />
            <text x={(PX + PW + TX) / 2 - 2} y={PF - 344} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={26} fill="#f6ecd2">THEO</text>
          </g>
          {f >= cho && f < cho + 10 && <g opacity={1 - (f - cho) / 10}>{[0, 1, 2, 3, 4, 5].map((i) => { const a = (i / 6) * Math.PI * 2; const r = 20 + (f - cho) * 5; return <path key={i} d={`M${905 + Math.cos(a) * r},${PF - 400 + Math.sin(a) * r} l${Math.cos(a) * 18},${Math.sin(a) * 18}`} stroke="#ffd27a" strokeWidth={5} strokeLinecap="round" />; })}</g>}
        </>} />
      <Rot texto="AGAINST THE BACK WALL" x={760} y={150} desde={k(105.21)} hasta={alto - 6} color={AMBAR} tam={40} />
      <Rot texto="TALLER THAN THEO" x={760} y={150} desde={alto} color={AMBAR} tam={44} />
    </AbsoluteFill>
  );
};

// ---------- 26 · ahora, el frío en sí ----------
// v3: caminan frente a la comisaría (lejos de la marquesina y del farol), encorvados con los brazos cruzados; ráfaga;
// rótulo abajo, sobre la vereda nevada; sin «tallos» de escarcha
export const P26Frio: React.FC = () => {
  const f = useF();
  const k = kDe(107.97);
  const rafaga = k(110.3);
  const tx = (q: number) => interpolate(q, [0, 142], [2620, 2840], cl);
  const jx = (q: number) => interpolate(q, [0, 142], [2380, 2600], cl);
  const inclina: Partial<Pose> = { tronco: 18, cabeza: 10, hI: 30, cI: 118, hD: 36, cD: 112 };
  return (
    <AbsoluteFill>
      <EscenaL Set={Superior} pal={PAL} claves={[mira(0, 2560, SUP_PISO - 300, 1.42), mira(142, 2700, SUP_PISO - 300, 1.48, { curva: "inout" })]} seed={26} setProps={{ hora: "tormenta", luces: 0, nieve: 1, cae: true }}
        medio={<>
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 2620, y: SUP_PISO }, { f: 142, x: 2840 }]} poses={[{ f: 0, v: inclina }, { f: rafaga, v: { ...inclina, tronco: 32, cabeza: 16 } }, { f: rafaga + 22, v: inclina }]}
            caras={[{ f: 0, v: "cansado" }, { f: rafaga, v: "miedo" }, { f: k(111.43), v: "determinado" }]} luz={BORDE_FRIO}
            miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(111.43), v: { x: -1, y: 0 } }, { f: k(112.2), v: { x: 1, y: 0.3 } }]}
            giros={[{ f: rafaga, v: 0 }, { f: rafaga + 4, v: -0.5 }, { f: rafaga + 22, v: 0 }]} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 2380, y: SUP_PISO }, { f: 142, x: 2600 }]} poses={[{ f: 0, v: inclina }, { f: rafaga, v: "manosCara" }, { f: rafaga + 24, v: inclina }]}
            caras={[{ f: 0, v: "triste" }, { f: rafaga, v: "miedo" }, { f: k(111.73), v: "determinado" }]} luz={BORDE_FRIO} seed={2}
            miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(109.11), v: { x: 1, y: -0.3 } }]} />
          <Aliento {...boca(tx(f), SUP_PISO)} f={f} /><Aliento {...boca(jx(f), SUP_PISO)} f={f} desfase={20} />
        </>}
        frente={<Ventisca f={f} viento={f > rafaga && f < rafaga + 30 ? 18 : 10} n={240} />} />
      <Rot texto="NOW · THE COLD ITSELF" x={960} y={1030} desde={k(109.11)} color={FRIO} tam={42} />
    </AbsoluteFill>
  );
};

// ---------- 27 · promedio de enero: bajo cero; las peores noches, −30 ----------
// v3: 3/4 más cerca (figuras ~45 %), tiritan; en «−30» Theo la abraza; la cifra que se narra vive sólo en el termómetro
export const P27Bajo: React.FC = () => {
  // v4: el HUD queda en −28 todo el plano; la caída la cuenta el TERMÓMETRO atado a la farola del puente (mercurio, sin
  // dígitos grandes): en «below zero» baja de 14 a −4; en «the worst nights» la cámara empuja a 3/4 de los dos (inout)
  // y el mercurio se desploma a la franja roja (−31) y brilla; Theo la abraza
  const f = useF();
  const k = kDe(112.69);
  const peor = k(116.71), abraza = k(118.05), cae = k(117.39);
  const temp = f < cae ? interpolate(f, [k(113.0), k(115.2)], [14, -4], cl) : interpolate(f, [cae, k(118.43)], [-4, -31], cl);
  const tirita = (s: number) => (p: Pose, q: number): Pose => ({ ...p, tronco: p.tronco + Math.sin(q * 0.9 + s) * (q > peor ? 2.4 : 1.2) });
  const PP = PUENTE_PISO;
  return (
    <AbsoluteFill>
      <EscenaL Set={Puente} pal={PAL} claves={[mira(0, 900, PP - 250, 1.75), mira(peor, 905, PP - 252, 1.8, { curva: "inout" }), mira(peor + 22, 940, PP - 265, 2.35, { curva: "inout" }), mira(194, 950, PP - 265, 2.42, { curva: "inout" })]} seed={27} setProps={{ hora: "noche", luces: 0, nieve: 1, vapor: 1, cae: true, hielo: 0.6 }}
        medio={<>
          <TermoPoste x={1200} y0={PP - 400} temp={temp} f={f} brilla={interpolate(temp, [-31, -29], [1, 0], cl)} />
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 760, y: PP }, { f: abraza - 10, x: 760, y: PP }, { f: abraza + 6, x: 840, y: PP }]} poses={[{ f: 0, v: "parado" }, { f: k(114.7), v: "brazosCruzados" }, { f: cae, v: "encogerse" }, { f: abraza, v: { tronco: 8, hD: 60, cD: 40 } }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(113.6), v: "duda" }, { f: k(114.7), v: "triste" }, { f: cae, v: "miedo" }, { f: abraza + 6, v: "determinado" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(113.4), v: { x: 1, y: -0.3 } }, { f: k(114.7), v: { x: 1, y: 0 } }, { f: cae, v: { x: 1, y: -0.2 } }, { f: abraza, v: { x: 1, y: 0.2 } }]} luz={BORDE_FRIO}
            ajuste={ik2(tirita(0), ik("D", (q) => q > abraza + 4 ? { x: 1000 - 840 - 20, y: -250 } : null))} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 1000, y: PP }]} dir={[{ f: 0, v: -1 }, { f: k(115.0), v: 1 }, { f: k(116.0), v: -1 }]} poses={[{ f: 0, v: "brazosCruzados" }, { f: k(115.0), v: "manosCara" }, { f: k(116.0), v: "brazosCruzados" }, { f: cae, v: "encogerse" }]}
            caras={[{ f: 0, v: "triste" }, { f: k(115.0), v: "sorpresa" }, { f: k(116.0), v: "triste" }, { f: cae, v: "miedo" }, { f: abraza + 8, v: "cansado" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(115.0), v: { x: 1, y: -0.4 } }, { f: k(116.0), v: { x: 1, y: 0 } }, { f: abraza + 6, v: { x: 1, y: 0.2 } }]} luz={BORDE_FRIO} seed={2} ajuste={tirita(2)} />
          <Aliento {...boca(f > abraza ? 840 : 760, PP)} f={f} /><Aliento {...boca(1000, PP, -1)} f={f} desfase={20} dir={-1} />
        </>} frente={<Ventisca f={f} viento={6} n={120} o={0.6} />} />
      <Rot texto="AVERAGE JANUARY LOW · BELOW ZERO" x={960} y={120} desde={k(112.85)} hasta={peor - 8} color="#f6ecd2" tam={40} />
      <Rot texto="THE WORST NIGHTS" x={960} y={120} desde={peor} color={FRIO} tam={44} />
    </AbsoluteFill>
  );
};

// ---------- 28 · la piel expuesta se congela en minutos ----------
// v3: temporizador con dígitos que corre (10:00 → 0:00), escarcha que crece en la mejilla y la nariz, Theo se tapa
export const P28Piel: React.FC = () => {
  const f = useF();
  const k = kDe(119.15);
  const hielo = ramp(f, k(120.55), k(121.9));
  const cubre = k(121.67);
  const seg = Math.max(0, Math.round(interpolate(f, [k(120.8), k(122.6)], [600, 0], cl)));
  const mmss = `${Math.floor(seg / 60)}:${seg % 60 < 10 ? "0" : ""}${seg % 60}`;
  const cristal = (x: number, y: number, r: number, i: number) => <g key={i} transform={`translate(${x},${y}) rotate(${i * 23})`} opacity={0.95}>{[0, 60, 120].map((a) => <path key={a} d={`M${-r},0 H${r}`} stroke="#f2fbff" strokeWidth={3} transform={`rotate(${a})`} strokeLinecap="round" />)}</g>;
  return (
    <AbsoluteFill>
      <EscenaL Set={Barrio} pal={PAL} claves={[mira(0, 1640, B - 250, 2.3), mira(110, 1650, B - 250, 2.45, { curva: "inout" })]} seed={28} setProps={{ hora: "tormenta", luces: 0, nieve: 1, cae: true }}
        medio={<>
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 1560, y: B }]} poses={[{ f: 0, v: "encogerse" }, { f: k(120.55), v: { hI: 40, cI: 120, hD: 45, cD: 115, cabeza: 4, tronco: 4 } }, { f: cubre, v: { hD: 60, cD: 130, hI: 40, cI: 120, cabeza: 10 } }]}
            caras={[{ f: 0, v: "cansado" }, { f: k(120.0), v: "duda" }, { f: k(120.81), v: "miedo" }, { f: cubre + 6, v: "determinado" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(120.0), v: { x: 1, y: -0.4 } }, { f: k(120.81), v: { x: 1, y: 0.3 } }]} luz={BORDE_FRIO}
            ajuste={ik("D", (q) => q > cubre ? { x: 28, y: -250 } : null)} />
          {hielo > 0 && [[1592, B - 268, 10], [1604, B - 254, 8], [1580, B - 260, 7], [1608, B - 276, 6], [1598, B - 282, 5], [1585, B - 248, 6]].map(([x, y, r], i) => cristal(x, y, r * hielo, i))}
          <Aliento {...boca(1560, B)} f={f} />
        </>} frente={<Ventisca f={f} viento={12} n={200} />} />
      <RelojHielo x={1460} y={330} desde={k(120.55)} prog={ramp(f, k(120.8), k(122.6))} rotulo="EXPOSED SKIN" valor={mmss} />
      <Rot texto="FREEZES IN MINUTES" x={1460} y={690} desde={k(121.39)} color={FRIO} tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 29 · los caños revientan en las casas vacías: un crack como un tiro ----------
// v3: (A) diagrama: el caño en la pared de la casa vacía, el hielo crece de los dos lados, se hincha y se RAJA con chorro;
// (B) CORTE seco a la calle: plano medio de los dos que escuchan, el CRACK los encoge, giran, Theo señala y la cámara
// acompaña (inout 24 cuadros) hasta la casa del fondo donde revienta el caño contra la pared
const ChorroPared: React.FC<{ x: number; y: number; f: number; d: number; dir?: number }> = ({ x, y, f, d, dir = -1 }) => {
  if (f < d) return null;
  const t = Math.min(1, (f - d) / 12);
  const fl = f - d;
  return (
    <g>
      <rect x={x - 6} y={y - 10} width={30 * -dir} height={20} fill="#c8783a" stroke="#7a4420" strokeWidth={3} />
      {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M${x},${y} q${dir * (60 + i * 26) * t},${-50 * t + i * 6} ${dir * (120 + i * 40) * t},${(40 + i * 30) * t}`} stroke="#dff2ff" strokeWidth={9 - i * 0.6} fill="none" strokeLinecap="round" opacity={0.9} />)}
      {Array.from({ length: 10 }).map((_, i) => { const u = ((fl / 18) + i / 10) % 1; return <circle key={i} cx={x + dir * (40 + i * 22) * (0.4 + u)} cy={y + 20 + u * 140} r={5} fill="#eaf6ff" opacity={1 - u} />; })}
      {fl < 20 && <circle cx={x} cy={y} r={30 + fl * 18} fill="none" stroke="#ffffff" strokeWidth={10 - fl * 0.45} opacity={1 - fl / 20} />}
      {/* carámbanos que se forman */}
      {[0, 1, 2, 3].map((i) => <path key={`c${i}`} d={`M${x + dir * (30 + i * 24)},${y + 12} l-7,${(30 + i * 9) * Math.min(1, fl / 40)} l14,0 Z`} fill="#eaf6ff" />)}
    </g>
  );
};
export const P29Canios: React.FC = () => {
  // v4: (A) diagrama: la escarcha avanza por FUERA del caño desde el cuadro 0, el caño se hincha, se abre una fisura y
  // REVIENTA con golpe(); (B) fundido de 6 cuadros a la calle: plano medio de los dos; el CRACK los encoge, Theo señala y
  // la cámara (inout) abre a 3/4 con los dos grandes a la izquierda y los dos chorros (casa verde y la del fondo) a la derecha
  const f = useF();
  const k = kDe(122.81);
  const c = k(125.95);
  const raja = k(124.11);
  const hielo = ramp(f, 0, k(124.0), 0.28, 1); // v5a: la escarcha ya entró por las puntas en el cuadro 0 y se ve avanzar
  const crack1 = k(127.55), crack2 = k(129.63), seña = k(128.17);
  const A = (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${golpe(f, raja, 16)} ${golpe(f, raja + 1, 9)}) translate(1000 600) scale(${interpolate(f, [0, c], [1, 1.08], io)}) translate(-1000 -600)`}>
          <CanioPared f={f} hielo={hielo} raja={f >= raja ? f - raja : -1} />
          <EscarchaCanio hielo={hielo} fisura={ramp(f, k(123.7), raja)} roto={f >= raja} />
        </g>
      </svg>
      <Rot texto="WATER PIPES · EMPTY HOUSES" x={960} y={152} desde={0} hasta={k(124.35)} color={FRIO} tam={40} />
      <Rot texto="ICE EXPANDS" x={1500} y={820} desde={k(123.03)} hasta={raja - 2} color="#ff5a4a" tam={36} />
      {f >= raja && <Globo texto="BURST!" x={1520} y={330} desde={raja} hasta={c} tam={64} />}
      <Rot texto="ALL OVER THE CITY" x={960} y={152} desde={k(124.51)} color={FRIO} tam={40} />
    </AbsoluteFill>
  );
  const claves = [mira(c, 2380, B - 280, 1.42), mira(seña, 2400, B - 280, 1.44, { curva: "inout" }), mira(seña + 24, 2640, B - 275, 1.36, { curva: "inout" }), mira(236, 2660, B - 272, 1.4, { curva: "inout" })];
  const g2 = aPantalla(claves, f, 3000, B - 300);
  const Bt = (
    <AbsoluteFill>
      <EscenaL Set={Barrio} pal={PAL} claves={claves} seed={29} setProps={{ hora: "noche", luces: 0, nieve: 1, humo: 0, ventanaCasa: 1 }}
        medio={<>
          <ChorroPared x={3215} y={B - 130} f={f} d={crack1} />
          <ChorroPared x={3000} y={B - 210} f={f} d={crack2} dir={1} />
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 2280, y: B }]} dir={[{ f: 0, v: 1 }]}
            poses={[{ f: 0, v: "brazosCruzados" }, { f: crack1 + 2, v: "encogerse" }, { f: seña, v: "señalar" }, { f: crack2 + 2, v: "encogerse" }, { f: crack2 + 22, v: { hD: 60, cD: 40, hI: 50, cI: 50 } }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(126.33), v: "duda" }, { f: crack1 + 2, v: "sorpresa" }, { f: seña, v: "determinado" }, { f: crack2 + 2, v: "miedo" }]}
            miradas={[{ f: 0, v: { x: -1, y: 0 } }, { f: k(126.2), v: { x: 1, y: -0.2 } }, { f: crack1 + 2, v: { x: 1, y: 0 } }]} luz={BORDE_FRIO} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 2480, y: B }]} dir={[{ f: 0, v: -1 }, { f: crack1 + 3, v: 1 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(126.01), v: { hD: 150, cD: 40, cabeza: -6 } }, { f: crack1 + 3, v: "manosCara" }, { f: seña + 8, v: "brazosCruzados" }, { f: crack2 + 3, v: "manosCara" }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(126.01), v: "duda" }, { f: crack1 + 3, v: "miedo" }, { f: seña + 8, v: "triste" }, { f: crack2 + 3, v: "miedo" }]}
            miradas={[{ f: 0, v: { x: 1, y: -0.4 } }, { f: crack1 + 3, v: { x: 1, y: 0 } }]} luz={BORDE_FRIO} seed={2} />
          <Aliento {...boca(2280, B)} f={f} /><Aliento {...boca(2480, B, -1)} f={f} dir={-1} desfase={22} />
        </>} frente={<NieveCae f={f} n={80} x0={-400} w={4400} y0={-300} h={1300} />} />
      <Rot texto="YOU HEAR THEM AT NIGHT" x={960} y={1010} desde={c + 6} hasta={crack1 - 2} color={FRIO} tam={40} />
      {f >= crack1 && f < seña + 30 && <Globo texto="CRACK!" x={1780} y={235} desde={crack1} hasta={seña + 30} tam={64} />}
      {f >= crack2 && <Globo texto="CRACK!" x={Math.min(1640, g2.x)} y={260} desde={crack2} hasta={236} tam={64} />}
      <Rot texto="LIKE A GUNSHOT" x={960} y={1010} desde={crack2} color="#e2483a" tam={44} />
    </AbsoluteFill>
  );
  return <FundidoV5 c={c} a={A} b={Bt} />; // v5a: fundido 8 en seno (el lineal de 6 medía lageo en 126,17)
};

// ---------- 30 · cada salida, una misión: capas, lana sí, algodón no ----------
const Prenda: React.FC<{ color: string; remera?: boolean }> = ({ color, remera }) => <g transform="translate(10,-30)"><path d={remera ? "M-30,-26 L-12,-32 Q0,-24 12,-32 L30,-26 L38,-10 L26,-4 L26,32 L-26,32 L-26,-4 L-38,-10 Z" : "M-32,-26 L-12,-32 Q0,-22 12,-32 L32,-26 L42,6 L28,10 L26,-4 L26,32 L-26,32 L-26,-4 L-28,10 L-42,6 Z"} fill={color} stroke="#00000044" strokeWidth={2} /></g>;
export const P30Capas: React.FC = () => {
  const f = useF();
  const k = kDe(130.67);
  const da = k(133.9), puesto = k(134.75);
  return (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={[mira(0, 2900, P - 340, 1.4), mira(254, 2920, P - 340, 1.46, { curva: "inout" })]} seed={30} setProps={{ ...LIV_INV }}
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
      <Rot texto="EVERY TRIP OUTSIDE = A MISSION" x={960} y={92} desde={k(131.0)} color={AMBAR} tam={38} />
      <TarjetaRopaV4 x={400} y={360} desde={k(133.57)} rotulo="WOOL LAYERS" ok color="#7a6656" />
      <TarjetaRopaV4 x={400} y={540} desde={k(135.17)} rotulo="COTTON" ok={false} color="#d8d2c4" prenda="remera" gotas={ramp(f, k(136.49), k(137.3))} />
      <TarjetaRopaV4 x={400} y={720} desde={k(137.59)} rotulo="WET = COLD" ok={false} color="#5aa8e8" prenda="remera" gotas={1} calor={ramp(f, k(138.23), k(138.6))} />
    </AbsoluteFill>
  );
};

// ---------- 31 · la cara tapada, nunca solos, nunca de noche: de vuelta antes de las 4:45 ----------
// v3: la checklist abajo, sobre la nieve (fila de 3), y la cámara entra a los dos (inout) cuando se dan vuelta
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
  const jx = (q: number) => tx(q) + 200;
  const ruta = (fx: (q: number) => number) => Array.from({ length: 24 }).map((_, i) => ({ f: Math.round((i * 235) / 23), x: fx((i * 235) / 23), y: B }));
  const tapa = (x: number, dir: number) => <rect x={x + dir * 2 - 26} y={B - 262} width={52} height={30} rx={12} fill="#efe3c8" opacity={ramp(f, k(139.4), k(139.8))} />;
  return (
    <AbsoluteFill>
      <EscenaL Set={Barrio} pal={PAL} claves={[mira(0, 2280, B - 280, 1.3), mira(vuelve - 2, 1880, B - 280, 1.3, { curva: "inout" }), mira(235, 1980, B - 270, 1.55, { curva: "inout" })]} seed={31} setProps={{ hora: "invierno", luces: 0, nieve: 1, cae: true, humo: 0 }}
        medio={<>
          <Pj look={THEO_INV} ruta={ruta(tx)} dir={[{ f: 0, v: -1 }, { f: vuelve, v: 1 }]} poses={[{ f: 0, v: "parado" }, { f: k(139.2), v: "manosCara" }, { f: k(139.8), v: "parado" }, { f: k(141.31), v: { hD: 60, cD: 40 } }, { f: k(142.0), v: "parado" }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(141.31), v: "duda" }, { f: vuelve, v: "miedo" }, { f: k(145.0), v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(140.13), v: { x: -1, y: 0 } }, { f: k(141.0), v: { x: 1, y: 0 } }, { f: vuelve, v: { x: 1, y: -0.5 } }]} />
          {tapa(tx(f), f < vuelve ? -1 : 1)}
          <Pj look={JUNE_INV} ruta={ruta(jx)} dir={[{ f: 0, v: -1 }, { f: vuelve, v: 1 }]} poses={[{ f: 0, v: "parado" }, { f: k(139.2), v: "manosCara" }, { f: k(139.8), v: "parado" }, { f: k(140.13), v: { hI: 50, cI: 30 } }, { f: k(141.0), v: "parado" }, { f: k(142.73), v: "señalar" }, { f: k(143.6), v: "parado" }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(142.73), v: "duda" }, { f: k(144.4), v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(142.73), v: { x: 1, y: -0.5 } }]} seed={2} />
          {tapa(jx(f), f < vuelve ? -1 : 1)}
        </>} />
      {["FACE COVERED", "NEVER ALONE", "NEVER AFTER DARK"].map((t, i) => <Rot key={t} texto={`✓ ${t}`} x={[560, 950, 1380][i]} y={1012} desde={k([139.13, 140.13, 141.13][i])} color="#f6ecd2" tam={34} />)}
      <SolCard x={1560} y={230} desde={k(142.73)} baja={ramp(f, k(143.97), k(145.6))} />
    </AbsoluteFill>
  );
};

// ---------- 32 · el peligro que más le preocupa a June: invisible ----------
// v3: (A) June despierta, cerca (≥45 %), mira la estufa; (B) CORTE a cámara BAJA desde el piso: el CO (masa violeta)
// sale de la estufa y avanza por el piso hacia los colchones; las cabezas cabecean; June se despierta de golpe en «CO»
export const P32Invisible: React.FC = () => {
  // v4: (A) June despierta, cerca, mira la estufa; (B) fundido de 6 cuadros a cámara AL RAS DEL PISO (otro ángulo del
  // living: botas en primer término, mucho piso): el CO violeta se arrastra por el piso hacia cámara, la cámara baja con
  // las cabezas que caen y los párpados que se cierran; en «carbon monoxide» June se despierta de golpe
  const f = useF();
  const k = kDe(146.95);
  const inv = k(150.07), co = k(151.15);
  const gas = ramp(f, inv - 6, co + 30);
  const sp = { ...LIV_INV, hora: "noche", fuego: 0.6, lena: 0, alarma: false };
  const theo = (
    <EnColchon look={THEO_CASA} x={720} poses={[{ f: 0, v: { ...SENT, tronco: 14, cabeza: 22 } }, { f: inv + 10, v: { ...SENT, tronco: 22, cabeza: 34 } }, { f: co - 6, v: { ...SENT, tronco: 28, cabeza: 44 } }]}
      caras={[{ f: 0, v: "cansado" }, { f: inv + 8, v: "dormido" }]} miradas={[{ f: 0, v: { x: 1, y: 0.7 } }]} />
  );
  const june = (
    <EnColchon look={JUNE} x={1070} seed={2} manta="#3a4a7a"
      poses={[{ f: 0, v: SENT }, { f: k(147.79), v: "pensar" }, { f: k(149.19), v: SENT }, { f: inv + 6, v: { ...SENT, tronco: 20, cabeza: 32 } }, { f: co, v: { ...SENT, tronco: -6, cabeza: -8, hD: 70, cD: 30 } }]}
      caras={[{ f: 0, v: "cansado" }, { f: k(147.37), v: "duda" }, { f: k(149.19), v: "miedo" }, { f: inv + 6, v: "cansado" }, { f: inv + 18, v: "dormido" }, { f: co, v: "sorpresa" }]}
      miradas={[{ f: 0, v: { x: -1, y: 0.2 } }, { f: k(147.8), v: { x: 1, y: 0 } }, { f: k(149.19), v: { x: 1, y: 0.2 } }, { f: inv + 6, v: { x: 1, y: 0.7 } }, { f: co, v: { x: 1, y: 0.3 } }]} />
  );
  // v5a: (A) OTRO lugar del living (no el frontal de colchones): June de rodillas junto a la estufa, de noche, revisa
  // con la luz del celular la puerta y el caño (el peligro que más teme); en «cold» mira atrás a la ventana helada y
  // vuelve, acerca la palma a la estufa; en «invisible» olfatea → fundido 8 en seno al plano al ras del piso
  // v6a: (A) la linterna SUBE por el caño (la cámara la sigue con mira inout), June mira atrás a la ventana helada, acerca
  // la palma a la estufa, OLFATEA y se le cierran los ojos: cabecea (la cabeza cae, se sacude, vuelve a caer) mientras la
  // cámara baja hacia el piso → fundido seno de 8 al plano al ras del piso con el gas
  const JX = 1690; const POSES_ARR = POSES.arrodillado;
  const t1 = k(147.79), t2 = k(148.65), t3 = k(149.19), t4 = k(149.5);
  const tA = [0, t1, t2, t3];
  const dA = [1, 22, 12, 12];
  const manoD = [{ x: 112, y: -170 }, { x: 136, y: -262 }, { x: 96, y: -150 }, { x: 100, y: -156 }];
  const haz = [{ x: 1950, y: P - 190 }, { x: 1950, y: P - 660 }, { x: 1870, y: P - 20 }, { x: 1900, y: P - 34 }];
  const tramo = (q: number, v: { x: number; y: number }[]) => {
    let i = 0; while (i + 1 < tA.length && q >= tA[i + 1]) i++;
    const u = i === 0 ? 0 : interpolate(q, [tA[i], tA[i] + dA[i]], [0, 1], io);
    const a = v[Math.max(0, i - 1)], b = v[i];
    return i === 0 ? v[0] : { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u };
  };
  const mD = tramo(f, manoD), hz0 = tramo(f, haz);
  const hz = { x: hz0.x + 6 * Math.sin(f / 7), y: hz0.y + 5 * Math.sin(f / 5.3) }; // pulso de mano: el haz nunca queda clavado
  const A = (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={[mira(0, 1840, P - 240, 1.8), mira(t1 + 22, 1900, P - 330, 1.55, { curva: "inout" }), mira(t2 + 16, 1810, P - 260, 1.8, { curva: "inout" }), mira(t3 + 14, 1850, P - 250, 1.85, { curva: "inout" }), mira(inv + 8, 1800, P - 130, 2.0, { curva: "inout" })]} seed={32} setProps={sp}
        medio={<>
          <Pj look={JUNE} ruta={[{ f: 0, x: JX, y: P }]} dir={[{ f: 0, v: 1 }]}
            poses={[{ f: 0, v: "arrodillado" }, { f: t1, v: { ...POSES_ARR, tronco: -8, cabeza: -24 }, d: 16 }, { f: t2, v: { ...POSES_ARR, tronco: 2, cabeza: 4 }, d: 12 }, { f: t3, v: { ...POSES_ARR, tronco: 10, cabeza: -6 }, d: 12 }, { f: t4, v: { ...POSES_ARR, tronco: 6, cabeza: -14 }, d: 10 }, { f: k(149.7), v: { ...POSES_ARR, tronco: 18, cabeza: 36 }, d: 12 }, { f: k(149.93), v: { ...POSES_ARR, tronco: 10, cabeza: 8 }, d: 8 }] as any}
            caras={[{ f: 0, v: "duda" }, { f: t1, v: "miedo" }, { f: t2, v: "triste" }, { f: t3, v: "determinado" }, { f: t4, v: "duda" }, { f: k(149.62), v: "cansado" }, { f: k(149.72), v: "dormido" }, { f: k(149.93), v: "cansado" }, { f: k(150.03), v: "dormido" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.1 } }, { f: t1, v: { x: 0.3, y: -1 } }, { f: t2, v: { x: -1, y: -0.15 } }, { f: t3, v: { x: 1, y: 0 } }, { f: t4, v: { x: 0.6, y: -0.3 } }, { f: k(149.62), v: { x: 0.8, y: 0.7 } }]}
            ajuste={ik2(ik("D", () => mD), ik("I", (q) => q >= t3 + 4 ? { x: 150 * interpolate(q, [t3 + 4, t3 + 16], [0.5, 1], io), y: -170 + 40 * ramp(q, k(149.65), k(149.95)) } : null))}
            enManoD={<Celular brillo="#fff3c8" />} seed={2} luz={BORDE_CALIDO} />
          <LinternaV5 x0={JX + mD.x + 14} y0={P + mD.y} x1={hz.x} y1={hz.y} fuerza={0.3} />
        </>} />
      <Rot texto="JUNE'S BIGGEST FEAR" x={750} y={172} desde={t1} hasta={inv - 6} color={AMBAR} tam={32} />{/* v6a: entre la ventana y el caño */}
    </AbsoluteFill>
  );
  const Bt = (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={[mira(inv, 990, P - 150, 1.66), mira(co - 4, 1000, P - 120, 1.75, { curva: "inout" }), mira(143, 1005, P - 125, 1.78, { curva: "inout" })]} seed={321} setProps={sp}
        medio={<>
          <TapaAlarma piso={P} />
          <PilaLena x={40} piso={P} cols={10} filas={6} seed={3} />
          <GasNube id="p32b" x0={1900} x1={420} piso={P} alto={420} avance={gas} f={f} />
          {theo}{june}
          <Botas x={560} piso={P + 160} s={1.35} />
          <GasNube id="p32c" x0={2100} x1={300} piso={P + 230} alto={240} avance={ramp(f, inv, co + 20)} f={f} o={0.8} moleculas={false} />
        </>} />
      <Rot texto="INVISIBLE" x={620} y={150} desde={inv + 4} hasta={co - 14} color="#c8b4f0" tam={44} />
      <Rot texto="CARBON MONOXIDE" x={620} y={150} desde={co - 4} color="#e2483a" tam={44} />
    </AbsoluteFill>
  );
  return <FundidoV5 c={inv} a={A} b={Bt} />; // v5a
};

// ---------- 33 · generadores y parrillas adentro: sin olor, sin aviso, sólo sueño ----------
// v3: de NOCHE con tormenta (no el atardecer dorado). (A) general medio: el «vos» prende el generador y la parrilla
// adentro, el gas violeta se junta; (B) CORTE a primer plano sentado: huele, no hay nada, bosteza y se duerme
const Parrilla: React.FC<{ f: number; humo: number }> = ({ f, humo }) => (
  <g>
    <rect x={-70} y={-120} width={140} height={70} rx={20} fill="#2a2a30" /><rect x={-60} y={-130} width={120} height={14} fill="#5a5a62" />
    {[-40, 40].map((d) => <rect key={d} x={d - 4} y={-50} width={8} height={50} fill="#2a2a30" />)}
    <rect x={-50} y={-128} width={100} height={6} fill="#ff8a3a" opacity={humo} />
    {humo > 0 && <Halo x={0} y={-130} r={180} color="#ff8a3a" fuerza={0.5 * humo} />}
  </g>
);
const Generador: React.FC<{ f: number; on: boolean }> = ({ f, on }) => (
  <g transform={`translate(${on ? Math.sin(f * 1.3) * 1.5 : 0},0)`}>
    <rect x={-80} y={-130} width={160} height={110} rx={10} fill="#e0b020" stroke="#7a5a10" strokeWidth={4} /><rect x={-90} y={-140} width={180} height={14} rx={6} fill="#3a3440" />
    <rect x={-60} y={-110} width={60} height={50} rx={6} fill="#3a3440" /><circle cx={40} cy={-80} r={18} fill="#3a3440" />
    {[-60, 60].map((d) => <circle key={d} cx={d} cy={-12} r={14} fill="#2a2228" />)}
  </g>
);
// la cocina del «vos» de noche: el ventanal muestra la tormenta (no el atardecer); sin haces de sol
const CocinaNoche: React.FC<any> = (p) => {
  if (p.capa === "lejos") return <g><rect x={300} y={-100} width={1700} height={900} fill="#1d2338" /><rect x={300} y={560} width={1700} height={340} fill="#3a4258" />{Array.from({ length: 12 }).map((_, i) => <rect key={i} x={360 + i * 140} y={500 - ((i * 37) % 60)} width={110} height={70 + ((i * 37) % 60)} fill="#262a3e" />)}<NieveCae f={p.f} n={90} x0={300} w={1700} y0={-100} h={900} viento={6} /></g>;
  if (p.capa === "frente") return null;
  return <Cocina {...p} />;
};
export const P33Parrilla: React.FC = () => {
  const f = useF();
  const k = kDe(151.73);
  const X = COCINA_PUNTOS.cocina, CP = COCINA_PISO;
  const gen = k(155.31), grill = k(155.77), corte = k(157.45), duerme = k(159.83);
  const ppm = interpolate(f, [gen + 10, k(160.6)], [0, 420], cl);
  const VX = X - 600; // v4f: la silla lejos del generador (en B el generador queda fuera de cuadro)
  const gas = interpolate(f, [gen + 10, k(160.6)], [0, 1], cl);
  const oGas = interpolate(f, [gen + 8, gen + 20], [0, 1], cl); // v4f: el gas entra con fundido de 12 cuadros
  const oGen = interpolate(f, [gen + 4, gen + 14], [0, 1], cl);
  const oGrill = interpolate(f, [grill, grill + 10], [0, 1], cl);
  const maquinas = (
    <>
      <g transform={`translate(${X - 160},${CP})`}><Generador f={f} on={f > gen + 4} /></g>
      {f > gen + 4 && <g opacity={oGen}><Volutas id="p33g" x={X - 70} y={CP - 70} f={f} n={9} color="#8a8f9e" o={0.8} viento={-0.6} alto={380} per={60} r0={16} /></g>}
      <g transform={`translate(${X + 60},${CP})`}><Parrilla f={f} humo={oGrill} /></g>
      {f > grill && <g opacity={oGrill}><Volutas id="p33p" x={X + 60} y={CP - 140} f={f} n={8} color="#a0a4ac" o={0.7} viento={-0.2} alto={420} per={70} r0={18} /></g>}
    </>
  );
  const A = (
    <AbsoluteFill>
      <EscenaL Set={CocinaNoche} pal={PAL} claves={[mira(0, X - 330, CP - 300, 1.75), mira(gen - 8, X - 250, CP - 295, 1.85, { curva: "inout" }), mira(corte, X - 240, CP - 290, 1.88, { curva: "inout" })]} seed={33} setProps={{}}
        medio={<>
          {maquinas}
          <g opacity={oGas}><GasNube id="p33" x0={X - 60} x1={X - 1300} piso={CP} alto={640} avance={gas} f={f} o={0.85} /></g>
          <Pj look={VOS} ruta={[{ f: 0, x: X - 520, y: CP }, { f: gen - 30, x: X - 270 }, { f: grill + 20, x: X - 270 }, { f: corte - 10, x: X - 380 }]}
            dir={[{ f: 0, v: 1 }, { f: grill + 22, v: -1 }, { f: corte - 8, v: 1 }]}
            poses={[{ f: 0, v: "parado" }, { f: gen - 26, v: "agacharse" }, { f: gen - 6, v: "tirarCarga" }, { f: gen + 4, v: "parado" }, { f: grill + 6, v: { hD: 80, cD: 20, hI: 70, cI: 30 } }, { f: corte - 14, v: "parado" }]}
            caras={[{ f: 0, v: "neutral" }, { f: gen + 6, v: "feliz" }, { f: grill + 6, v: "risa" }, { f: corte - 14, v: "neutral" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.3 } }]} seed={4}
            ajuste={ik("D", (q) => entre(q, gen - 22, gen - 8) ? { x: 90, y: -60 } : null)} />
        </>} />
      <Rot texto="AFTER EVERY BIG STORM" x={760} y={160} desde={k(152.93)} hasta={k(154.0)} color={AMBAR} tam={40} />
      <Rot texto="PEOPLE DIE · EVERY YEAR" x={760} y={160} desde={k(154.03)} hasta={gen - 2} color="#e2483a" tam={40} />
      <Rot texto="GENERATORS & GRILLS · INDOORS" x={760} y={160} desde={gen} color="#e2483a" tam={34} />
      <MedidorPPM x={360} y={240} ppm={ppm} desde={gen + 8} />
    </AbsoluteFill>
  );
  const Bt = (
    <AbsoluteFill>
      <EscenaL Set={CocinaNoche} pal={PAL} claves={[mira(corte, VX - 170, CP - 265, 1.9), mira(283, VX - 185, CP - 255, 2.05, { curva: "inout" })]} seed={331} setProps={{}}
        medio={<>
          {maquinas}
          <Silla x={VX - 90} piso={CP} dir={1} />
          <GasNube id="p33b" x0={X - 60} x1={X - 1300} piso={CP} alto={640} avance={gas} f={f} o={0.85} />
          <Pj look={VOS} ruta={[{ f: 0, x: VX - 80, y: CP }]} dir={[{ f: 0, v: 1 }]}
            poses={[{ f: 0, v: { ...SENT, tronco: -4, cabeza: -14 } }, { f: k(158.31), v: { ...SENT, hD: 110, cD: 40, hI: 100, cI: 40 } }, { f: k(159.1), v: SENT }, { f: k(159.6), v: { ...SENT, hD: 150, cD: 120, cabeza: -10, tronco: -8 } }, { f: duerme + 8, v: { ...SENT, tronco: 8, cabeza: 28, hD: 10, cD: 10, hI: 10, cI: 10 } }]}
            asiento={[{ f: 0, v: A_SILLA }]}
            caras={[{ f: 0, v: "duda" }, { f: k(158.31), v: "neutral" }, { f: k(159.33), v: "cansado" }, { f: duerme + 6, v: "dormido" }]}
            miradas={[{ f: 0, v: { x: 1, y: -0.5 } }, { f: k(158.31), v: { x: -1, y: 0 } }, { f: k(158.8), v: { x: 1, y: 0 } }, { f: k(159.33), v: { x: 1, y: 0.6 } }]}
            habla={[[k(159.6), k(159.95)]]} seed={4} />
        </>} />
      <AbsoluteFill style={{ background: "#0a0810", opacity: interpolate(f, [k(160.1), k(161.17)], [0, 0.55], cl) }} />
      <Rot texto="NO SMELL" x={520} y={300} desde={k(157.63)} color="#f6ecd2" tam={40} />
      <Rot texto="NO WARNING" x={520} y={400} desde={k(158.31)} color="#f6ecd2" tam={40} />
      <Rot texto="YOU JUST GET SLEEPY" x={560} y={500} desde={k(159.33)} color="#c8b4f0" tam={40} />
      <MedidorPPM x={1250} y={120} ppm={ppm} desde={corte} />
    </AbsoluteFill>
  );
  return <SubFundido c={corte} a={A} b={Bt} />;
};

// ---------- 34 · June saquea la ferretería: alarmas de CO a pila ----------
// v3: sin luz (la ciudad no tiene red): local a oscuras con techo, June entra, baja dos alarmas, las aprieta contra el pecho
export const P34Ferreteria: React.FC = () => {
  const f = useF();
  const k = kDe(161.17);
  const SP = SUPER_PISO;
  const SX = 1500;
  const t1 = k(162.85), t2 = k(163.6);
  const JX = (q: number) => interpolate(q, [0, k(162.5)], [1240, SX - 70], cl);
  // v4f: la ciudad no tiene luz → ferretería a oscuras (SuperOscuro + velo propio); June la recorre con una linterna
  const objX = interpolate(f, [0, k(162.3), t1 - 4, t1 + 6, t2 - 4], [SX + 300, SX + 160, SX + 10, SX + 130, SX + 130], cl);
  const objY = interpolate(f, [0, k(162.3), t1 - 4], [SP - 200, SP - 300, SP - 336], cl);
  const manoX = JX(f) + 70, manoY = SP - 215;
  const dx = objX - manoX, dy = objY - manoY, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  const enciende = interpolate(f, [4, 14], [0, 1], cl);
  return (
    <AbsoluteFill>
      <EscenaL Set={SuperOscuroE4} pal={PAL} claves={[mira(0, SX + 20, SP - 280, 1.6), mira(100, SX + 50, SP - 280, 1.68, { curva: "inout" })]} seed={34} setProps={{}}
        detras={<g>
          <rect x={-2000} y={-2000} width={8000} height={6000} fill="#0d1020" opacity={0.55} />
          <rect x={-2000} y={-2000} width={8000} height={2000 + SP - 520} fill="#17141f" />
          <rect x={-2000} y={SP - 530} width={8000} height={14} fill="#2a2433" />
          <rect x={SX - 40} y={SP - 420} width={420} height={420} fill="#5a4a3a" />
          {[SP - 300, SP - 160].map((y) => <rect key={y} x={SX - 50} y={y} width={440} height={14} fill="#3a2a22" />)}
          {Array.from({ length: 6 }).map((_, i) => (i === 0 && f > t1) || (i === 1 && f > t2) ? null : <AlarmaCO key={i} x={SX + 10 + (i % 3) * 120} y={(i < 3 ? SP - 340 : SP - 200) + 4} s={0.7} caja />)}
          <rect x={SX - 20} y={SP - 470} width={380} height={44} rx={8} fill="#a8352c" /><text x={SX + 170} y={SP - 438} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={28} fill="#f6ecd2">HARDWARE · CO ALARMS</text>
          <rect x={SX - 60} y={SP - 480} width={460} height={480} fill="#0b0f1e" opacity={0.62} />
          <g opacity={enciende}>
            <path d={`M${manoX},${manoY} L${objX + nx * 110},${objY + ny * 110} L${objX - nx * 110},${objY - ny * 110} Z`} fill="#fff6c8" opacity={0.2} />
            <Halo x={objX} y={objY} r={190} color="#fff2b8" fuerza={0.55} />
          </g>
        </g>}
        medio={<Pj look={JUNE_INV} ruta={[{ f: 0, x: 1240, y: SP }, { f: k(162.5), x: SX - 70 }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: { hI: 70, cI: 10 } }, { f: k(162.5), v: { hI: 75, cI: 15 } }, { f: t2 + 6, v: { hD: 40, cD: 120, hI: 70, cI: 10 } }, { f: k(164.1), v: { hD: 150, cD: 30, hI: 70, cI: 10 } }]}
          caras={[{ f: 0, v: "determinado" }, { f: t1, v: "duda" }, { f: t2 + 4, v: "feliz" }, { f: k(164.1), v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(162.4), v: { x: 1, y: -0.6 } }, { f: t2 + 6, v: { x: -1, y: 0.2 } }]} seed={2}
          ajuste={ik("D", (q) => entre(q, t1 - 8, t1 + 2) ? { x: SX + 10 - JX(q), y: -320 + 4 } : entre(q, t2 - 8, t2 + 2) ? { x: SX + 130 - JX(q), y: -320 + 4 } : entre(q, t1 + 2, t2 - 8) ? { x: 40, y: -170 } : null)}
          enManoI={<g transform="rotate(-90)"><rect x={-22} y={-7} width={40} height={14} rx={4} fill="#2a2a32" /><rect x={16} y={-10} width={9} height={20} rx={2} fill="#fff2b8" /></g>}
          enManoD={(q: number) => q > t1 + 2 && q < t2 + 6 ? <g transform="translate(0,-10)"><AlarmaCO s={0.55} caja />{q > t2 + 2 && <g transform="translate(14,10)"><AlarmaCO s={0.55} caja /></g>}</g> : null} />} />
      <Rot texto="JUNE RAIDS THE HARDWARE STORE" x={960} y={1015} desde={k(161.33)} hasta={k(162.7)} color={AMBAR} tam={38} />
      <Rot texto="BATTERY CO ALARMS" x={960} y={1015} desde={k(162.79)} color="#e2483a" tam={42} />
    </AbsoluteFill>
  );
};

// ---------- 35 · dos alarmas al lado de los colchones ----------
// v3: June sentada en el piso (no en el aire), pone una y otra, cara concentrada → alivio en el click
export const P35Alarmas: React.FC = () => {
  const f = useF();
  const k = kDe(164.5);
  const p1 = k(164.95), p2 = k(165.75);
  const JX = 1400;
  return (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={[mira(0, 1080, P - 250, 1.75), mira(92, 1110, P - 245, 1.85, { curva: "inout" })]} seed={35} setProps={{ ...LIV_INV, lena: 0, alarma: false }}
        medio={<>
          <TapaAlarma piso={P} />
          <PilaLena x={40} piso={P} cols={10} filas={6} seed={3} />
          {f > p1 && <AlarmaCO x={1262} y={P - 32} s={0.75} on={false} f={f} />}
          {f > p2 && <AlarmaCO x={1262} y={P - 108} s={0.75} on={false} f={f} />}
          <EnColchon look={THEO_CASA} x={720} poses={[{ f: 0, v: { ...SENT, tronco: 10, cabeza: 18 } }, { f: k(165.9), v: SENT }, { f: k(166.4), v: { ...SENT, hD: 120, cD: 30 } }]}
            caras={[{ f: 0, v: "cansado" }, { f: k(165.9), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.2 } }, { f: k(165.9), v: { x: 1, y: 0.5 } }]} />
          <Pj look={JUNE} ruta={[{ f: 0, x: JX, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: SUELO }, { f: k(166.3), v: { ...SUELO, tronco: -6 } }]} asiento={[{ f: 0, v: A_SUELO }]}
            caras={[{ f: 0, v: "determinado" }, { f: p1 + 2, v: "feliz" }, { f: p2 - 14, v: "determinado" }, { f: p2 + 2, v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: 0.6 } }, { f: p2 + 6, v: { x: 1, y: -0.1 } }]} seed={2}
            ajuste={ik("D", (q) => q < p1 + 2 ? { x: JX - 1262, y: -30 - 60 * (1 - ramp(q, p1 - 14, p1)) } : entre(q, p2 - 14, p2 + 2) ? { x: JX - 1262, y: -108 - 50 * (1 - ramp(q, p2 - 14, p2)) } : null, A_SUELO)}
            enManoD={(q: number) => q < p1 || entre(q, p2 - 16, p2) ? <AlarmaCO s={0.5} /> : null} />
        </>} />
      <Tic x={1180} y={760} f={f} en={[p1, p2]} texto="click" color="#5ad07a" />
      <Rot texto="TWO, NEXT TO THE MATTRESSES" x={560} y={310} desde={k(164.81)} color={AMBAR} tam={36} />
    </AbsoluteFill>
  );
};

// ---------- 36 · una noche de diciembre, una grita ----------
// v3: general quieto; en el grito CORTE seco a medio cerca: la pared late en rojo con el BEEP, los dos se incorporan
export const P36Grita: React.FC = () => {
  const f = useF();
  const k = kDe(167.57);
  const al = k(169.61);
  const on = f > al;
  // v4f: latido rojo SUAVE (seno, un bip cada 14 cuadros) que entra en 8 cuadros; push inout de 14 cuadros + golpe de cámara
  const lat = on ? ramp(f, al, al + 8) * (0.5 - 0.5 * Math.cos(((f - al) / 14) * 2 * Math.PI)) : 0;
  const claves = [mira(0, 1050, P - 260, 1.5), mira(al, 1060, P - 258, 1.56, { curva: "inout" }), mira(al + 14, 1010, P - 240, 1.95, { curva: "inout" }), mira(96, 1030, P - 240, 2.05, { curva: "inout" })];
  const sx = golpe(f, al, 9), sy = golpe(f, al + 1, 6);
  const beeps = [0, 1, 2, 3, 4, 5].map((i) => al + 3 + i * 14);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate(${sx}px,${sy}px) scale(1.01)` }}>
        <EscenaL Set={Living} pal={PAL} claves={claves} seed={36} setProps={{ ...LIV_INV, lena: 0, hora: "noche", fuego: 0.3, alarma: false }}
          medio={<>
            <TapaAlarma piso={P} />
            <PilaLena x={40} piso={P} cols={10} filas={6} seed={3} />
            {on && <rect x={-200} y={-400} width={3000} height={P + 400} fill="#ff2a2a" opacity={0.22 * lat} />}
            <AlarmaCO x={1262} y={P - 32} s={0.75} on={false} f={f} /><AlarmaCO x={1262} y={P - 108} s={0.75} on={false} f={f} />
            {on && <><Halo x={1262} y={P - 70} r={760} color="#ff2a2a" fuerza={0.12 + 0.4 * lat} /><circle cx={1288} cy={P - 25} r={7} fill="#ff3a2e" opacity={0.3 + 0.7 * lat} /><circle cx={1288} cy={P - 101} r={7} fill="#ff3a2e" opacity={0.3 + 0.7 * lat} /></>}
            <EnColchon look={THEO_CASA} x={720} poses={[{ f: 0, v: { ...SENT, tronco: 16, cabeza: 26 } }, { f: al + 4, v: SENT }, { f: al + 22, v: { ...SENT, hD: 100, cD: 10 } }, { f: al + 46, v: { ...SENT, tronco: -6, hD: 130, cD: 40, hI: 60, cI: 30 } }]}
              caras={[{ f: 0, v: "cansado" }, { f: al + 4, v: "sorpresa" }, { f: al + 20, v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: 0.5 } }, { f: al + 4, v: { x: 1, y: 0.3 } }, { f: al + 40, v: { x: 1, y: 0 } }]} />
            <EnColchon look={JUNE} x={1070} seed={2} manta="#3a4a7a" poses={[{ f: 0, v: { ...SENT, tronco: 16, cabeza: 26 } }, { f: al + 4, v: SENT }, { f: al + 16, v: "manosCara" }, { f: al + 40, v: { ...SENT, tronco: -4, hI: 120, cI: 20 } }]}
              caras={[{ f: 0, v: "cansado" }, { f: al + 3, v: "sorpresa" }, { f: al + 16, v: "miedo" }]} miradas={[{ f: 0, v: { x: -1, y: 0.4 } }, { f: al + 4, v: { x: 1, y: 0.5 } }, { f: al + 40, v: { x: -1, y: 0 } }]} />
          </>} />
      </AbsoluteFill>
      <Calendario texto="DECEMBER" x={420} y={130} desde={k(168.07)} hasta={al - 2} tam={46} />
      <Rot texto="ONE NIGHT IN DECEMBER" x={640} y={400} desde={k(167.71)} hasta={al - 2} color={FRIO} tam={36} />
      <Beep x={1450} y={740} en={beeps} />
      <Rot texto="ONE OF THEM SCREAMS" x={600} y={200} desde={al + 6} color="#e2483a" tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 37 · el caño de la estufa, tapado de hollín ----------
export const P37Hollin: React.FC = () => {
  const f = useF();
  const k = kDe(170.81);
  // v4f: en el MUNDO (no inserto suelto): el living de noche, la alarma sigue latiendo, el caño de la estufa abierto en corte
  // muestra la costra de hollín; el humo que no sube vuelve y sale por la puerta de la estufa hacia June, que tose
  const hollin = ramp(f, 0, k(171.9), 0.3, 1), vuelve = ramp(f, k(171.5), k(172.2));
  const lat = 0.5 - 0.5 * Math.cos((f / 14) * 2 * Math.PI);
  const tos = k(171.95);
  return (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={[mira(0, 1490, P - 300, 1.5), mira(56, 1505, P - 302, 1.56, { curva: "inout" })]} seed={37} setProps={{ ...LIV_INV, lena: 0, hora: "noche", fuego: 0.3, alarma: false }}
        medio={<>
          <TapaAlarma piso={P} />
          <rect x={-200} y={-400} width={3000} height={P + 400} fill="#ff2a2a" opacity={0.14 * lat} />
          <AlarmaCO x={1262} y={P - 32} s={0.75} on={false} f={f} /><AlarmaCO x={1262} y={P - 108} s={0.75} on={false} f={f} />
          <Halo x={1262} y={P - 70} r={600} color="#ff2a2a" fuerza={0.1 + 0.3 * lat} />
          <circle cx={1288} cy={P - 25} r={7} fill="#ff3a2e" opacity={0.3 + 0.7 * lat} /><circle cx={1288} cy={P - 101} r={7} fill="#ff3a2e" opacity={0.3 + 0.7 * lat} />
          <CanioHollin x={1950} y0={P - 575} y1={P - 405} f={f} hollin={hollin} vuelve={vuelve} />
          <g opacity={0.35 + 0.65 * vuelve}><Volutas id="p37a" x={1880} y={P - 200} f={f} n={10} color="#a4a8b4" o={1} viento={-1.8} alto={320} per={56} r0={30} /></g>
          <g opacity={vuelve}><Volutas id="p37b" x={1700} y={P - 420} f={f} n={8} color="#8a8e9a" o={0.8} viento={-2.4} alto={220} per={70} r0={34} /></g>
          <EnColchon look={JUNE} x={1070} seed={2} manta="#3a4a7a"
            poses={[{ f: 0, v: { ...SENT, tronco: -4, hI: 120, cI: 20 } }, { f: k(171.4), v: { ...SENT, tronco: 4, cabeza: 10 } }, { f: tos, v: { ...SENT, tronco: 18, cabeza: 14, hD: 150, cD: 130 } }, { f: tos + 10, v: { ...SENT, tronco: 6, hD: 150, cD: 130 } }, { f: k(172.4), v: { ...SENT, tronco: -6, hD: 100, cD: 20, hI: 60, cI: 30 } }]}
            caras={[{ f: 0, v: "miedo" }, { f: k(171.4), v: "duda" }, { f: tos, v: "asco" }, { f: k(172.4), v: "miedo" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(171.2), v: { x: 1, y: -0.4 } }, { f: tos, v: { x: 1, y: 0.4 } }, { f: k(172.4), v: { x: 1, y: -0.2 } }]} />
        </>} />
      <Rot texto="THE STOVEPIPE" x={1285} y={200} desde={k(170.87)} color={AMBAR} tam={36} />
      <Rot texto="CLOGGED WITH SOOT" x={1285} y={290} desde={k(171.61)} color="#e2483a" tam={32} />
    </AbsoluteFill>
  );
};

// ---------- 38 · abren la puerta a −20 y se sientan en la nieve en bolsas de dormir ----------
// v3: afuera, más cerca: bolsas de dormir con capucha, el humo sale por la puerta y se va limpiando, rótulos sobre la nieve
export const P38Nieve: React.FC = () => {
  const f = useF();
  const k = kDe(172.69);
  const c = k(173.95);
  const ab = ramp(f, k(172.75), k(173.3));
  let A: React.ReactNode = null;
  {
    const JX = (q: number) => pomo(3550, P, 240, ramp(q, k(172.75), k(173.3)), true).x - 66;
    A = (
      <AbsoluteFill>
        <EscenaL Set={Living} pal={PAL} claves={[mira(0, 3400, P - 300, 1.3), mira(c - 1, 3430, P - 300, 1.36, { curva: "inout" })]} seed={38} setProps={{ ...LIV_INV, hora: "noche", mantas: false, alarma: true, fuego: 0.2 }}
          medio={<>
            <Puerta x={3550} piso={P} abre={ab} der luzVano="#3a4a7a" />
            {ab > 0.3 && <NieveCae f={f} n={40} x0={3300} w={500} y0={P - 600} h={600} viento={-4} />}
            <Pj look={THEO_INV} ruta={[{ f: 0, x: 3200, y: P }, { f: k(173.3), x: 3200 }, { f: c, x: 3300 }]} poses={[{ f: 0, v: { hD: 60, cD: 60, hI: 50, cI: 70 } }]} caras={[{ f: 0, v: "miedo" }, { f: k(173.3), v: "determinado" }]} enManoD={<BolsaRoll color="#2f5a8a" />} />
            <Pj look={JUNE_INV} ruta={Array.from({ length: 12 }).map((_, i) => { const q = (i * c) / 11; return { f: Math.round(q), x: JX(q), y: P }; })} caras={[{ f: 0, v: "determinado" }]} seed={2}
              ajuste={ik("D", (q) => q < k(173.4) ? { x: pomo(3550, P, 240, ramp(q, k(172.75), k(173.3)), true).x - JX(q), y: pomo(3550, P, 240, ramp(q, k(172.75), k(173.3)), true).y - P } : null)} />
          </>} />
        <Rot texto="OPEN THE DOOR · −20°F" x={960} y={120} desde={k(172.71)} color={FRIO} tam={38} />
      </AbsoluteFill>
    );
  }
  const limpia = ramp(f, k(176.0), k(177.6));
  const TX = 2240, JX2 = 2460;
  const Bt = (
    <AbsoluteFill>
      <EscenaL Set={Barrio} pal={PAL} claves={[mira(c, 2250, B - 240, 1.55), mira(175, 2290, B - 230, 1.65, { curva: "inout" })]} seed={38} setProps={{ hora: "noche", luces: 0, nieve: 1, cae: true, humo: 0, ventanaCasa: 1 }}
        medio={<>
          <rect x={1870} y={B - 130} width={60} height={130} fill="#ffcf6e" opacity={0.85} />
          <Volutas id="p38" x={1915} y={B - 110} f={f} n={9} color="#8a8f9e" o={0.75 * (1 - limpia)} viento={1.2} alto={360} per={70} r0={18} />
          <BolsaDormir2 x={TX} piso={B} color="#2f5a8a" parte="atras" dir={-1} alto={112} />
          <BolsaDormir2 x={JX2} piso={B} color="#7a3a3a" parte="atras" dir={-1} alto={112} />
          <Pj look={THEO_INV} ruta={[{ f: 0, x: TX, y: B }]} poses={[{ f: 0, v: SUELO }, { f: k(176.51), v: { ...SUELO, tronco: -4 } }, { f: k(177.31), v: { ...SUELO, hD: 120, cD: 20 } }]} asiento={[{ f: 0, v: A_SUELO }]}
            caras={[{ f: 0, v: "cansado" }, { f: k(175.83), v: "triste" }, { f: k(177.15), v: "feliz" }]} luz={BORDE_FRIO} miradas={[{ f: 0, v: { x: -1, y: 0 } }, { f: k(176.6), v: { x: 1, y: 0 } }]} dir={[{ f: 0, v: -1 }]} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: JX2, y: B }]} poses={[{ f: 0, v: SUELO }, { f: k(176.6), v: { ...SUELO, tronco: -6 } }]} asiento={[{ f: 0, v: A_SUELO }]}
            caras={[{ f: 0, v: "triste" }, { f: k(176.0), v: "duda" }, { f: k(177.3), v: "feliz" }]} luz={BORDE_FRIO} seed={2} dir={[{ f: 0, v: -1 }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(176.6), v: { x: 1, y: 0.2 } }]} />
          <BolsaDormir2 x={TX} piso={B} color="#2f5a8a" parte="frente" dir={-1} alto={112} />
          <BolsaDormir2 x={JX2} piso={B} color="#7a3a3a" parte="frente" dir={-1} alto={112} />
          <Aliento {...boca(TX, B, -1, A_SUELO)} f={f} dir={-1} /><Aliento {...boca(JX2, B, -1, A_SUELO)} f={f} dir={-1} desfase={20} />
        </>} frente={<NieveCae f={f} n={70} x0={1000} w={2400} y0={-200} h={1200} />} />
      <Rot texto="SLEEPING BAGS · IN THE SNOW" x={960} y={1015} desde={k(175.01)} hasta={k(177.1)} color={FRIO} tam={38} />
      <Rot texto="UNTIL THE ROOM CLEARS" x={960} y={1015} desde={k(177.15)} color="#5ad07a" tam={38} />
      <MedidorPPM x={230} y={950} w={400} ppm={interpolate(f, [k(176.0), k(177.6)], [320, 8], cl)} desde={k(175.9)} />
    </AbsoluteFill>
  );
  return <SubFundido c={c} a={A} b={Bt} />;
};
const BolsaRoll: React.FC<{ color: string }> = ({ color }) => <g transform="translate(0,-20)"><ellipse cx={0} cy={0} rx={60} ry={34} fill={color} /><ellipse cx={-54} cy={0} rx={10} ry={30} fill="#00000033" /><rect x={-50} y={-6} width={100} height={8} fill="#00000033" /></g>;

// ---------- 39 · esa alarma costó 9 dólares: salvó a media humanidad ----------
// v3: primer plano de June (Theo fuera de cuadro), el $9 en la pared vacía, cara preocupada → alivio; inout al plano de los dos
export const P39Nueve: React.FC = () => {
  const f = useF();
  const k = kDe(178.53);
  const mitad = k(181.03), abre = k(181.2);
  const claves = [mira(0, 1250, P - 240, 2.4), mira(abre, 1260, P - 240, 2.45), mira(abre + 22, 900, P - 250, 1.6, { curva: "inout" })];
  return (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={claves} seed={39} setProps={{ ...LIV_INV, hora: "alba", fuego: 0.4, cae: false, lena: 0 }}
        detras={<LenaLivE4 lena={0.45} />} /* v5a: troncos de verdad (no la grilla de lunares del set) */
        medio={<>
          <AlarmaCO x={1262} y={P - 32} s={0.75} on={false} f={f} />
          <EnColchon look={THEO_CASA} x={720} poses={[{ f: 0, v: SENT }, { f: mitad + 10, v: { ...SENT, hD: 130, cD: 20 } }]} caras={[{ f: 0, v: "cansado" }, { f: mitad, v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.1 } }]} />
          <EnColchon look={JUNE} x={1070} seed={2} manta="#3a4a7a" poses={[{ f: 0, v: { ...SENT, hD: 60, cD: 60 } }, { f: k(179.6), v: { ...SENT, hD: 70, cD: 70, cabeza: 10 } }, { f: mitad + 6, v: { ...SENT, hD: 60, cD: 60, hI: 120, cI: 20 } }]}
            caras={[{ f: 0, v: "triste" }, { f: k(178.95), v: "sorpresa" }, { f: k(179.6), v: "feliz" }, { f: mitad, v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: 0.6 } }, { f: k(178.95), v: { x: 1, y: 0.2 } }, { f: mitad + 10, v: { x: -1, y: 0 } }]}
            enManoD={(q: number) => <g transform={`rotate(${interpolate(q, [0, k(179.6), k(179.6) + 10, mitad + 6, mitad + 16], [110, 110, 130, 130, 110], cl)})`}><AlarmaCO s={0.5} /><Precio x={20} y={18} texto="$9" f={q} s={0.55} /></g>} /> {/* v5a: la alarma y la etiqueta derechas (antes el $9 se leía «6$», girado con el antebrazo) */}
        </>} />
      <Texto x={1480} y={690} desde={k(178.67)} hasta={abre} tam={150} color={AMBAR}>$9</Texto>
      <Texto x={1480} y={880} desde={k(178.95)} hasta={abre} tam={40} color="#f6ecd2">ONE CO ALARM</Texto>
      <Rot texto="SAVED HALF OF HUMANITY" x={960} y={1015} desde={abre + 4} color="#5ad07a" tam={42} />
    </AbsoluteFill>
  );
};

// ---------- 40 · día 83: Navidad, probablemente ----------
// v3: (A) inserto: la mano con manga (ManoLapiz) traza la raya 83 en el cuaderno; (B) CORTE: Theo trae una rama
// de pino de Navidad, calendario DEC 25 ? en la pared, June levanta la vista y se encoge de hombros en «not sure»
export const P40Dia83: React.FC = () => {
  const f = useF();
  const k = kDe(182.89);
  const c = k(184.19);
  let A: React.ReactNode = null;
  {
    const u = ramp(f, k(183.07), k(183.9));
    const PX = 300, PY = 300, paso = 16, alto = 64, porFila = 25;
    const n = 83, i = n - 1, fila = Math.floor(i / porFila), j = i % porFila, g = Math.floor(j / 5), m = j % 5;
    const bx = PX + g * (paso * 4 + 26), by = PY + fila * (alto + 22);
    const punta = m === 4 ? { x: bx - 6 + (paso * 3 + 16) * u, y: by + 4 + (alto - 8) * (1 - u) } : { x: bx + m * paso, y: by + alto * u };
    const s = interpolate(f, [0, c], [1, 1.05], cl);
    const sale = interpolate(f, [k(183.95), c - 2], [0, 1], io); // v5a: la mano con el lápiz sale de cuadro antes del corte
    A = (
      <AbsoluteFill style={{ background: "#2a2026" }}>
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <g transform={`translate(960 600) scale(${s * 0.9}) translate(-960 -580)`}> {/* v5a: cuaderno más chico y más abajo → el rótulo DAY 83 en zona libre */}
            <rect x={180} y={170} width={1560} height={820} rx={14} fill="#f4ecd6" />
            {Array.from({ length: 12 }).map((_, r) => <rect key={r} x={180} y={230 + r * 64} width={1560} height={2} fill="#c9d4e4" />)}
            <rect x={300 - 50} y={170} width={3} height={820} fill="#e2a0a0" />
            <Palotes x={PX} y={PY} n={n} ult={u} alto={alto} paso={paso} porFila={porFila} color="#2a2228" grosor={5} />
            <ManoLapizE x={punta.x + 700 * sale} y={punta.y + 520 * sale} manga="#2f7f86" s={0.55} />
          </g>
        </svg>
        <Rot texto="DAY 83" x={960} y={150} desde={k(182.95)} color={AMBAR} tam={44} />
      </AbsoluteFill>
    );
  }
  const JX = 2330;
  const Bt = (
    <AbsoluteFill>
      <EscenaL Set={Living} pal={PAL} claves={[mira(c, 2560, P - 250, 1.7), mira(155, 2580, P - 250, 1.78, { curva: "inout" })]} seed={40} setProps={{ ...LIV_INV, hora: "noche", vela: true }}
        medio={<>
          <Silla x={JX - 20} piso={P} dir={1} />
          <Pj look={JUNE} ruta={[{ f: 0, x: JX, y: P }]} poses={[{ f: 0, v: { ...SENT, cabeza: 12, hD: 70, cD: 60 } }, { f: k(184.55), v: { ...SENT, tronco: -6, cabeza: -6 } }, { f: k(184.97), v: { ...SENT, hD: 150, cD: 150, cabeza: -4 } }, { f: k(186.03), v: { ...SENT, hI: 60, cI: -70, hD: 60, cD: -70, cabeza: 6 } }, { f: k(186.8), v: { ...SENT, tronco: -8, hD: 95, cD: 10 } }]} asiento={[{ f: 0, v: A_SILLA }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(184.55), v: "feliz" }, { f: k(184.97), v: "duda" }, { f: k(186.03), v: "picaro" }, { f: k(186.8), v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: 0.5 } }, { f: k(184.5), v: { x: 1, y: -0.2 } }, { f: k(184.97), v: { x: -1, y: -0.6 } }, { f: k(186.03), v: { x: 1, y: 0 } }, { f: k(186.8), v: { x: 1, y: -0.3 } }]} seed={2} luz={BORDE_CALIDO} />
          <Pj look={THEO_CASA} ruta={[{ f: 0, x: 2900, y: P }, { f: k(184.9), x: 2830 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 62, cD: 30 } }, { f: k(184.97), v: { hD: 62, cD: 30, hI: 40, cI: 30 } }, { f: k(186.03), v: { hD: 62, cD: 30, hI: 60, cI: -70 } }, { f: k(186.8), v: { hD: 50, cD: -15, hI: 30, cI: 20, tronco: -6 } }]}
            caras={[{ f: 0, v: "feliz" }, { f: k(184.97), v: "duda" }, { f: k(186.79), v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: 0.2 } }, { f: k(185.5), v: { x: 1, y: -0.4 } }]} luz={BORDE_CALIDO}
            enManoD={<Rama s={1.15} />} />
        </>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, opacity: interpolate(f, [c, c + 9], [0, 1], cl) }}>
        <g transform="translate(860 128)">
          <rect x={0} y={0} width={300} height={250} rx={18} fill="#f6f1e6" /><rect x={0} y={0} width={300} height={64} rx={18} fill="#c0352c" />
          <text x={150} y={46} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={36} fill="#fff" letterSpacing={3}>DEC</text>
          <text x={120} y={190} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={120} fill="#2a2228">25</text>
          <text x={250} y={200} textAnchor="middle" fontFamily="Caveat, cursive" fontWeight={700} fontSize={130} fill="#e2483a" opacity={interpolate(f, [k(184.97), k(185.25)], [0, 1], cl)}>?</text>
        </g>
      </svg>
      <Rot texto="CHRISTMAS · PROBABLY" x={960} y={1015} desde={k(184.97)} color={AMBAR} tam={38} />
    </AbsoluteFill>
  );
  return <FundidoV5 c={c} a={A} b={Bt} />; // v5a: fundido 8 en seno (184,2)
};
