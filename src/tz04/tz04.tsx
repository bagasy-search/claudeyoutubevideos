// tz04 · «The Monk Who Chose Love Over Lust» (Tenzo Films, Day 8-10). Voz 433,5 s = 13.004 cuadros.
// Plan D:/rtmp/tz04_PLAN_MxM.md. Cada plano = la frase de ese segundo; tramos en SEGUNDOS ABSOLUTOS de la voz.
// Chicago frío (el farol de Tenzo es la única luz cálida) · la parábola de Tanzan y Ekido, ámbar con lluvia dorada.
import React from "react";
import { AbsoluteFill, Audio, interpolate, random, staticFile } from "remotion";
import { mira, useF } from "../anikit/camara";
import { Actor } from "../anikit/actor";
import { Escena } from "../anikit/escena";
import { Halo, Lluvia } from "../anikit/luz";
import { Montaje } from "../anikit/montaje";
import { F_HUD, F_MANO, GranNumero, Globo, Pildora, RelojDia } from "../anikit/pantalla";
import { TelGrande } from "../tenzo/graficos";
import { Recuerdo, TarjetaFinal } from "../tenzo/tzc/chicago";
import { Libro } from "../anikit/props";
import { EXPRESIONES, Pose } from "../anikit/personaje";
import { ACENTO, ESC, FAROL, FRIO, LEO, MARA, ORO, PAL, PAL_ANT, PAL_DIA, TENZO } from "../tenzo/elenco";
import { AMRAPALI_VIEJA, CHICA_KIMONO, EKIDO, MAYA as MAYA_B, TANZAN } from "../tenzo/elenco_b";
// tz04: Maya con el ambo celeste a la vista y la bufanda verde gruesa (se tienen que leer de lejos)
const MAYA: typeof MAYA_B = { ...MAYA_B, camisa: "#7fb6c9", pantalon: "#7fb6c9", accesorios: [{ t: "pelo", forma: "bob", color: "#2a1a12" }, { t: "bufanda", color: "#3f9a6a", grande: true }] };
import { Frase, HudTenzo, MarcaTenzo, Rotulo } from "../tenzo/hud";
// texto recto y limpio en pastilla (se acomoda solo dentro del cuadro): reemplaza a la letra a mano, misma firma
import { ManoLeo, ManoMara } from "../tenzo/tzc/chicago";
import { BolsoRopa, Elefante, FarolPapel, Tel, TelMesa, Toalla } from "../tenzo/utileria";
import { Broadway, BWY_PISO, BWY_PUNTOS } from "../tenzo/sets/broadway";
import { COLCHON_ALTO, Cuarto, CTO_PISO, CTO_PUNTOS } from "../tenzo/sets/cuarto";
import { Lavadero, LAV_PISO, LAV_PUNTOS } from "../tenzo/sets/lavadero";
import { CaminoMontana, JAPON_PISO, PortonMonasterio, PORTON, RIO, RioCrecido, RioFrente } from "../tenzo/sets/rioJapon";
import { Vaishali, VAI_PUNTOS } from "../tenzo/sets/vaishali";
import { Colectivo36, COLECTIVO, COLECTIVO_PISO } from "../tenzo/sets/wilson";
import { ent, fr, Hoja, PantallaMacro, planosDe, Tibio, TramoS } from "../tenzo/tzb/comun";

type Clv = ReturnType<typeof mira>;
// expresiones locales de tz04 (se registran sólo en tiempo de ejecución; no tocan el kit)
EXPRESIONES.bostezo = { ...EXPRESIONES.neutral, abre: 0.12, parpado: 0.7, ceja: -14, cejaY: -6, bocaW: 11, bocaC: 3, bocaO: 26 };
EXPRESIONES.sereno = { ...EXPRESIONES.feliz, abre: 0.06, bocaC: 7, cejaY: -3 };
type KF<T> = { f: number; v: T }[];

// luces
const L_TEL = { lado: 1 as const, color: ACENTO, fuerza: 0.55 };
const L_FRIO = { lado: 1 as const, color: FRIO, fuerza: 0.4 };
const L_ORO_D = { lado: 1 as const, color: ORO, fuerza: 0.6 };
const L_ORO_I = { lado: -1 as const, color: ORO, fuerza: 0.9 };
const L_ANT = { lado: 1 as const, color: "#ffd890", fuerza: 0.8 };
const L_DIA = { lado: 1 as const, color: "#eef2f6", fuerza: 0.45 };

const Hud: React.FC<{ min: number | { f: number; v: number; d?: number }[]; dia: number; estado?: "sube" | "congelado" | "normal" }> = (p) => <HudTenzo {...p} sinMarca />;
const oscuro = <rect x={-900} y={-700} width={5200} height={2000} fill="#04060b" opacity={0.5} />;
const k01 = (f: number, a: number, b: number, v0: number, v1: number) => interpolate(f, [a, b], [v0, v1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ================= la parábola: coreografía del río en SEGUNDOS ABSOLUTOS (sirve para los insertos) =================
const JP = JAPON_PISO;
const hundir = (x: number) => RIO.hundir * 0.35 * Math.min(1, Math.max(0, Math.min(x - (RIO.orillaI + 40), RIO.orillaD - 40 - x) / 220));
const tanzanX = (t: number) => interpolate(t, [126, 131, 144.4, 147.7, 150.3, 154.8], [260, 780, 780, 920, 920, 2420], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ekidoX = (t: number) => interpolate(t, [126, 131], [100, 600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const alzada = (t: number) => t >= 149.6 && t < 155.0; // la chica va en brazos
const chicaX = (t: number) => (t < 149.6 ? RIO.chica : t < 155.0 ? tanzanX(t) + 70 : interpolate(t, [155, 155.5, 158.7, 160.2], [tanzanX(154.8) + 128, 2660, 2660, 3400], { extrapolateRight: "clamp" }));

// la chica en brazos: rotada sobre el pecho de Tanzan (cabeza hacia su hombro)
const ChicaEnBrazos: React.FC<{ x: number; y: number; caras?: KF<string>; op?: number; tinte?: boolean; esc?: number; rot?: number }> = ({ x, y, caras = [{ f: 0, v: "triste" }], op = 1, tinte, esc = 1, rot = -8 }) => (
  <g transform={`rotate(${rot} ${x} ${y})`} opacity={op}>
    <Actor look={tinte ? { ...CHICA_KIMONO, camisa: ORO, pantalon: ORO, piel: "#ffd9a0", miembro: "#ffd9a0" } : CHICA_KIMONO} escala={esc} seed={21} luz={L_ANT}
      ruta={[{ f: 0, x, y }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 0 }]} poses={[{ f: 0, v: { tronco: 14, pI: 70, rI: 80, pD: 76, rD: 86, hD: 150, cD: 40, hI: 120, cI: 50, cabeza: 10 } }]} caras={caras} />
  </g>
);
const POSE_CARGA: Partial<Pose> = { hD: 70, cD: 80, hI: 62, cI: 88, tronco: -8 };

// todo el río según t (absoluto); f = cuadro local para el agua
const RioMundo: React.FC<{ t: number; caraChica?: string; caraEkido?: string; caraTanzan?: string; habla?: [number, number][]; poseTanzan?: Partial<Pose>; dirTanzan?: 1 | -1; poseEkido?: Partial<Pose> }> = ({ t, caraChica, caraEkido = "neutral", caraTanzan = "feliz", poseTanzan, dirTanzan = 1, poseEkido }) => {
  const tx = tanzanX(t), cx = chicaX(t);
  const camina = (a: number, b: number) => t > a && t < b;
  const chicaDir: 1 | -1 = t < 134.8 ? -1 : 1;
  const ekDir: 1 | -1 = t < 142.3 ? 1 : -1;
  const ekGiro = t > 141.7 && t < 142.3 ? -((t - 141.7) / 0.6) * 0.9 : 0;
  const ekTapa = t > 143.0 && t < 147.8;
  const pasoT = camina(126, 131) || camina(144.4, 147.7) || camina(150.3, 154.8) ? "caminar" : undefined;
  return (
    <>
      <Actor look={EKIDO} escala={ESC} seed={23} luz={L_ANT} ruta={[{ f: 0, x: ekidoX(t), y: JP }]} dir={[{ f: 0, v: ekDir }]}
        poses={[{ f: 0, v: poseEkido ?? (ekTapa ? { hD: 20, cD: 120, hI: 50, cI: 145, cabeza: 18, tronco: -6 } : { hD: 20, cD: 120, hI: 20, cI: 120, cabeza: ekDir === -1 ? 14 : 10 }) }]} giros={[{ f: 0, v: ekGiro }]} caras={[{ f: 0, v: caraEkido }]} miradas={[{ f: 0, v: { x: 0.3, y: 0.8 } }]} />
      {!alzada(t) && (
        <Actor look={CHICA_KIMONO} escala={1.0} seed={21} luz={L_ANT} ruta={[{ f: 0, x: cx, y: JP - (t > 155 ? 0 : 0) }]} dir={[{ f: 0, v: t > 155 ? 1 : chicaDir }]}
          poses={[{ f: 0, v: t > 155.3 && t < 158.65 ? { tronco: 18 + 26 * Math.max(0, Math.sin(t * 5)), cabeza: 14 + 16 * Math.max(0, Math.sin(t * 5)), hD: 12, cD: 20, hI: 12, cI: 20 } : t >= 155 && t <= 155.3 ? { hD: 20, cD: 30, hI: 20, cI: 30 } : { hD: 100, cD: 150, hI: 95, cI: 150, cabeza: 12 } }]}
          caras={[{ f: 0, v: caraChica ?? (t > 155 ? "feliz" : "triste") }]} />
      )}
      <Actor look={TANZAN} escala={ESC} seed={22} luz={L_ANT} ruta={[{ f: 0, x: tx, y: JP + hundir(tx) }]} dir={[{ f: 0, v: dirTanzan }]}
        poses={[{ f: 0, v: alzada(t) ? POSE_CARGA : poseTanzan ?? (pasoT ? { hD: 15, cD: 25, hI: 15, cI: 25 } : { hD: 10, cD: 20, hI: 10, cI: 20 }) }]} caras={[{ f: 0, v: caraTanzan }]} />
      {alzada(t) && <ChicaEnBrazos x={tx + 128} y={JP + hundir(tx) - 96} caras={[{ f: 0, v: t < 152 ? "sorpresa" : "feliz" }]} />}
    </>
  );
};
const Rio: React.FC<{ T: number; claves: Clv[]; caraEkido?: string; caraTanzan?: string; hud?: React.ReactNode; vel?: number; poseTanzan?: (f: number) => Partial<Pose> | undefined; dirTanzan?: (f: number) => 1 | -1; extra?: React.ReactNode; poseEkido?: (f: number) => Partial<Pose> | undefined }> = ({ T, claves, caraEkido, caraTanzan, hud, vel = 1, poseTanzan, dirTanzan, extra, poseEkido }) => {
  const f = useF();
  const t = T + (f * vel) / 30;
  return <Escena Set={RioCrecido} pal={PAL_ANT} claves={claves} medio={<><RioMundo t={t} caraEkido={caraEkido} caraTanzan={caraTanzan} poseTanzan={poseTanzan?.(f)} dirTanzan={dirTanzan?.(f)} poseEkido={poseEkido?.(f)} />{extra}<RioFrente f={f} /></>} hud={hud} />;
};

// Ekido con la chica-fantasma (ámbar translúcida) colgada de la espalda
const EkidoCargando: React.FC<{ x: number; y: number; dir: 1 | -1; caras: KF<string>; poses?: KF<string | Partial<Pose>>; fantasma: number; camina?: boolean; habla?: [number, number][] }> = ({ x, y, dir, caras, poses, fantasma, habla }) => (
  <>
    {fantasma > 0 && <ChicaEnBrazos x={x - dir * 40} y={y - 190} rot={-70} op={0.55 * fantasma} tinte caras={[{ f: 0, v: "feliz" }]} />}
    {fantasma > 0 && <Halo x={x - dir * 70} y={y - 300} r={360} color={ORO} fuerza={0.35 * fantasma} />}
    <Actor look={EKIDO} escala={ESC} seed={23} luz={L_ANT} ruta={[{ f: 0, x, y }]} dir={[{ f: 0, v: dir }]} habla={habla}
      poses={poses ?? [{ f: 0, v: { hD: 20, cD: 120, hI: 20, cI: 120, tronco: 6 } }]} caras={caras} />
  </>
);

// ================= Chicago: piezas que se repiten =================
const BP = BWY_PISO;
const LEO_PARADA = BWY_PUNTOS.parada36 - 160, MAYA_X = BWY_PUNTOS.parada36 + 160;
const POSE_LIBRO: Partial<Pose> = { hD: 50, cD: 100, hI: 50, cI: 100, cabeza: 22 };
const Parada: React.FC<{ claves: Clv[]; dia: number; min: number; leoPoses?: KF<string | Partial<Pose>>; leoCara?: KF<string>; leoHabla?: [number, number][]; mayaPoses?: KF<string | Partial<Pose>>; mayaCara?: KF<string>; mayaHabla?: [number, number][]; mayaMira?: KF<{ x: number; y: number }>; libro?: boolean; mara?: React.ReactNode; hud?: React.ReactNode; leoX?: number; leoRuta?: { f: number; x: number; y: number }[]; mayaRuta?: { f: number; x: number; y: number }[]; leoMira?: KF<{ x: number; y: number }>; mayaDir?: KF<1 | -1>; delante?: React.ReactNode; leoMano?: React.ReactNode }> = ({ claves, dia, min, leoPoses = [{ f: 0, v: { hD: 20, cD: -40, hI: -20, cI: -40 } }], leoCara = [{ f: 0, v: "neutral" }], leoHabla, mayaPoses = [{ f: 0, v: POSE_LIBRO }], mayaCara = [{ f: 0, v: "neutral" }], mayaHabla, mayaMira, libro = true, mara, hud, leoX = LEO_PARADA, leoRuta, mayaRuta, leoMira, mayaDir, delante, leoMano }) => (
  <Escena Set={Broadway} pal={PAL_DIA} setProps={{ hora: "dia", nieve: true }} claves={claves}
    medio={<>
      {mara}
      <Actor look={LEO} escala={ESC} seed={1} luz={L_DIA} ruta={leoRuta ?? [{ f: 0, x: leoX, y: BP }]} dir={[{ f: 0, v: 1 }]} poses={leoPoses} caras={leoCara} habla={leoHabla} miradas={leoMira ?? [{ f: 0, v: { x: 1, y: 0 } }]} enManoD={leoMano} />
      <Actor look={MAYA} escala={ESC * 0.95} seed={8} luz={L_DIA} ruta={mayaRuta ?? [{ f: 0, x: MAYA_X, y: BP }]} dir={mayaDir ?? [{ f: 0, v: -1 }]} poses={mayaPoses} caras={mayaCara} habla={mayaHabla} miradas={mayaMira}
        enManoD={libro ? <g transform="scale(2.2)"><Libro color="#2e5a8a" /></g> : undefined} />
      {delante}
    </>}
    hud={<>{hud}<Hud min={min} dia={dia} /></>} />
);
const MaraParada: React.FC<{ esc: number; caras: KF<string>; x?: number; pose?: Partial<Pose> }> = ({ esc, caras, x = LEO_PARADA - 200, pose = { hD: 60, cD: 60, hI: 40, cI: 70, cabeza: 18 } }) => (
  <Actor look={MARA} escala={ESC * esc} seed={5} ruta={[{ f: 0, x, y: BP - 10 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: pose }]} caras={caras} opacidad={() => 0.92} />
);

// el lavadero: Tenzo en la mesa, Leo en la silla (o parado), el farol sobre la mesa
const LP = LAV_PISO;
const LEO_LAV = LAV_PUNTOS.leo + 120; // parado junto a la mesa
const Lav: React.FC<{ claves: Clv[]; leo?: "silla" | "parado" | "no"; leoPoses?: KF<string | Partial<Pose>>; leoCara?: KF<string>; leoHabla?: [number, number][]; leoRuta?: { f: number; x: number; y: number }[]; tenzoPoses?: KF<string | Partial<Pose>>; tenzoCara?: KF<string>; tenzoHabla?: [number, number][]; tenzoGiros?: KF<number>; doblez?: number; toallaFuera?: boolean; mara?: React.ReactNode; hud?: React.ReactNode; farol?: number; tenzo?: boolean; tenzoRuta?: { f: number; x: number; y: number }[]; tenzoDir?: KF<1 | -1>; tenzoMano?: React.ReactNode | ((f: number) => React.ReactNode); leoMano?: React.ReactNode | ((f: number) => React.ReactNode); leoDir?: KF<1 | -1>; leoMira?: KF<{ x: number; y: number }>; tenzoMira?: KF<{ x: number; y: number }>; delante?: React.ReactNode }> = ({ claves, leo = "parado", leoPoses, leoCara = [{ f: 0, v: "triste" }], leoHabla, leoRuta, tenzoPoses = [{ f: 0, v: { hD: 60, cD: 70, hI: 55, cI: 75, tronco: 8 } }], tenzoCara = [{ f: 0, v: "neutral" }], tenzoHabla, tenzoGiros, doblez = 0.5, mara, hud, farol = 1, tenzo = true, tenzoRuta, tenzoDir, tenzoMano, leoMano, leoDir, leoMira, tenzoMira, delante }) => {
  const f = useF();
  const silla = leo === "silla";
  return (
    <Escena Set={Lavadero} pal={PAL} setProps={{ girando: [2, 5, 11], nieve: true, luzFarol: farol * (0.94 + 0.06 * Math.sin(f / 7)) }} claves={claves}
      detras={<Tibio k={0.55 * farol} x={LAV_PUNTOS.farol} y={LP - 200} />}
      medio={<>
        {mara}
        {leo !== "no" && <Actor look={LEO} escala={ESC} seed={1} luz={L_ORO_D} ruta={leoRuta ?? [{ f: 0, x: silla ? LAV_PUNTOS.leo : LEO_LAV, y: LP }]} dir={leoDir ?? [{ f: 0, v: 1 }]} enManoD={leoMano} miradas={leoMira}
          asiento={silla ? [{ f: 0, v: 66 }] : undefined} poses={leoPoses ?? [{ f: 0, v: silla ? { tronco: 6, pI: 80, rI: 90, pD: 85, rD: 95, hD: 30, cD: 70, hI: 25, cI: 60 } : { hD: 15, cD: 30, hI: 15, cI: 30 } }]}
          caras={leoCara} habla={leoHabla} />}
        {tenzo && <Toalla x={LAV_PUNTOS.mesa} y={LP - 150} doblez={doblez} />}
        {tenzo && <Actor look={TENZO} escala={ESC} seed={2} luz={L_ORO_I} ruta={tenzoRuta ?? [{ f: 0, x: LAV_PUNTOS.tenzo, y: LP }]} dir={tenzoDir ?? [{ f: 0, v: -1 }]} poses={tenzoPoses} caras={tenzoCara} habla={tenzoHabla} giros={tenzoGiros} enManoD={tenzoMano} miradas={tenzoMira} />}
        {delante}
      </>}
      hud={hud} />
  );
};
const MaraLav: React.FC<{ esc: number; caras: KF<string>; pose?: Partial<Pose>; x?: number }> = ({ esc, caras, pose = { hD: 60, cD: 60, hI: 40, cI: 70, cabeza: 14 }, x = LAV_PUNTOS.leo - 200 }) => (
  <Actor look={MARA} escala={ESC * esc} seed={5} ruta={[{ f: 0, x, y: LP - 20 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: pose }]} caras={caras} opacidad={() => 0.92} />
);

// el cuarto de Leo
const CP = CTO_PISO;
const LX = 1240, MX = LX - 190;
const SENT_CEL: Partial<Pose> = { tronco: 10, pI: 70, rI: 120, pD: 75, rD: 125, hD: 30, cD: 125, cabeza: 22, hI: 8, cI: 30 };
const LeoCama: React.FC<{ caras?: KF<string>; poses?: KF<string | Partial<Pose>>; luz?: typeof L_TEL; tel?: boolean }> = ({ caras = [{ f: 0, v: "cansado" }], poses = [{ f: 0, v: SENT_CEL }], luz = L_TEL, tel = true }) => (
  <Actor look={LEO} escala={ESC} seed={1} luz={luz} ruta={[{ f: 0, x: LX, y: CP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: COLCHON_ALTO }]} poses={poses} caras={caras} enManoD={tel ? <Tel /> : undefined} />
);
const MaraCuarto: React.FC<{ esc: number | ((f: number) => number); caras: KF<string>; pose?: Partial<Pose> }> = ({ esc, caras, pose = { hD: 60, cD: 60, hI: 40, cI: 70, cabeza: 14 } }) => {
  const f = useF();
  const e = typeof esc === "number" ? esc : esc(f);
  return <Actor look={MARA} escala={ESC * e} seed={5} ruta={[{ f: 0, x: MX, y: CP - 34 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: pose }]} caras={caras} opacidad={() => 0.93} />;
};

// el 36 por dentro
const KP = COLECTIVO_PISO;
const Bus: React.FC<{ claves: Clv[]; leoCara?: KF<string>; leoHabla?: [number, number][]; mayaCara?: KF<string>; mayaHabla?: [number, number][]; mayaPoses?: KF<string | Partial<Pose>>; mayaRuta?: { f: number; x: number; y: number }[]; mayaSentada?: boolean; mayaDir?: KF<1 | -1>; hud?: React.ReactNode; vel?: number; delante?: React.ReactNode; leoPoses?: KF<string | Partial<Pose>>; leoMira?: KF<{ x: number; y: number }>; sinLibro?: boolean; mayaAsiento?: { f: number; v: number | undefined }[] }> = ({ claves, leoCara = [{ f: 0, v: "feliz" }], leoHabla, mayaCara = [{ f: 0, v: "feliz" }], mayaHabla, mayaPoses, mayaRuta, mayaSentada = true, mayaDir = [{ f: 0, v: -1 }], hud, vel = 6, delante, leoPoses, leoMira, sinLibro, mayaAsiento }) => (
  <Escena Set={Colectivo36} pal={PAL_DIA} setProps={{ vel, dia: true }} claves={claves}
    medio={<>
      <Actor look={LEO} escala={ESC} seed={1} luz={L_DIA} ruta={[{ f: 0, x: COLECTIVO.asientoLeo, y: KP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: COLECTIVO.asiento }]}
        poses={leoPoses ?? [{ f: 0, v: { tronco: 4, pI: 80, rI: 90, pD: 85, rD: 95, hD: 25, cD: 60, hI: 20, cI: 50 } }]} caras={leoCara} habla={leoHabla} miradas={leoMira ?? [{ f: 0, v: { x: 1, y: 0.1 } }]} />
      <Actor look={MAYA} escala={ESC * 0.95} seed={8} luz={L_DIA} ruta={mayaRuta ?? [{ f: 0, x: COLECTIVO.asientoMaya, y: KP }]} dir={mayaDir} asiento={mayaAsiento ?? (mayaSentada ? [{ f: 0, v: COLECTIVO.asiento }] : undefined)}
        poses={mayaPoses ?? [{ f: 0, v: { tronco: 4, pI: 80, rI: 90, pD: 85, rD: 95, ...POSE_LIBRO } }]} caras={mayaCara} habla={mayaHabla} enManoD={mayaSentada && !sinLibro ? <Libro abierto color="#2e5a8a" /> : undefined} />
      {delante}
    </>}
    hud={hud} />
);

// ================= 0 · CUADRO 0 = la miniatura sin texto (río dorado | Chicago con Mara) =================
const Cuadro0: React.FC = () => {
  const f = useF();
  const z = k01(f, 0, 216, 1.0, 0.9);
  const izq = "polygon(0 0, 53% 0, 47% 100%, 0 100%)", der = "polygon(53% 0, 100% 0, 100% 100%, 47% 100%)";
  const tx = 1200 + f * 0.6;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: izq }}>
        <Escena Set={RioCrecido} pal={PAL_ANT} claves={[mira(0, 1500, 700, 1.6 * z), mira(216, 1520, 700, 1.6 * 0.9)]}
          medio={<>
            <Actor look={TANZAN} escala={ESC * 1.3} seed={22} luz={L_ANT} ruta={[{ f: 0, x: tx, y: JP + 95 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: POSE_CARGA }]} caras={[{ f: 0, v: "risa" }]} />
            <ChicaEnBrazos x={tx + 166} y={JP + 95 - 125} esc={1.3} caras={[{ f: 0, v: "feliz" }]} />
            <RioFrente f={f} />
          </>} />
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: der }}>
        <Escena Set={Broadway} pal={PAL} setProps={{ nieve: false }} claves={[mira(0, 2300, 420, 0.95 * z), mira(216, 2300, 420, 0.95 * 0.9)]}
          medio={<>
            <Halo x={2450} y={BP - 420} r={800} color={ACENTO} fuerza={0.4} />
            <Actor look={MARA} escala={ESC * 1.9} seed={5} ruta={[{ f: 0, x: 2500, y: BP + 20 }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: { hD: 95 + Math.sin(f / 20) * 6, cD: 60, hI: 85, cI: 70, cabeza: 16, tronco: 10 } }]} caras={[{ f: 0, v: "risa" }]} opacidad={() => 0.95} />
            <Actor look={LEO} escala={ESC * 1.25} seed={1} luz={L_TEL} ruta={[{ f: 0, x: 2380, y: BP + 20 + k01(f, 0, 200, 0, 14) }]} dir={[{ f: 0, v: -1 }]}
              poses={[{ f: 0, v: { tronco: 22, pI: 0, rI: 90, pD: 90, rD: 90, hD: 30, cD: 125, hI: 50, cI: 10, cabeza: 22 } }]} caras={[{ f: 0, v: "miedo" }]} enManoD={<Tel />} />
          </>} />
      </AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M1018,0 L902,1080" stroke="#fff3dc" strokeWidth={6} opacity={0.85} /></svg>
      <Frase texto="Lust wants to take." desde={12} hasta={57} y={170} tam={92} />
      <Frase texto="Love wants to give." desde={58} hasta={118} y={170} tam={92} />
      <Frase texto="From far away, they look the same." desde={124} y={170} tam={72} />
    </AbsoluteFill>
  );
};

// ================= 1-3 · DAY 8 en la parada del 36 =================
const Dia8: React.FC = () => {
  const T = 7.6, f = useF(), L = (t: number) => fr(t, T);
  return (
    <Parada dia={8} min={230} claves={[mira(0, BWY_PUNTOS.parada36 - 300, 580, 0.85), mira(L(14.3), BWY_PUNTOS.parada36 - 200, 600, 1.05), mira(L(21.6), LEO_PARADA, 650, 1.6)]}
      leoPoses={[{ f: 0, v: { hD: 20, cD: -40, hI: -20, cI: -40 } }, { f: L(12.9), v: { hD: 20, cD: -40, hI: 80, cI: 120 } }, { f: L(14.3), v: { hD: 20, cD: -40, hI: -20, cI: -40 } }]}
      leoCara={[{ f: 0, v: "neutral" }, { f: L(17.5), v: "duda" }]}
      hud={<>
        <RelojDia min={460} x={1580} y={60} />
        <ManoLeo texto="coincidence." x={300} y={860} desde={L(17.6)} tam={70} />
        {f > L(19.9) && <div style={{ position: "absolute", left: 290, top: 880, height: 8, width: 470 * ent(f, L(19.9), L(20.5)), background: "#f4efe4", borderRadius: 4, transform: "rotate(-3deg)" }} />}
      </>} />
  );
};
const Maya2: React.FC = () => {
  const T = 21.6, L = (t: number) => fr(t, T);
  return (
    <Parada dia={8} min={230} claves={[mira(0, MAYA_X - 60, 640, 1.8), mira(L(29.2), MAYA_X, 650, 2.1), mira(L(34.2), MAYA_X + 10, 650, 2.2)]}
      mayaPoses={[{ f: 0, v: POSE_LIBRO }, { f: L(25.5), v: { ...POSE_LIBRO, hI: 85, cI: 60 } }, { f: L(27.5), v: POSE_LIBRO }]}
      hud={<>
        <Pildora texto="MAYA · 23" x={1300} y={240} desde={L(29.3)} color="#3f9a6a" tam={44} />
      </>} />
  );
};
const Truman2: React.FC = () => {
  const T = 34.2, L = (t: number) => fr(t, T);
  return (
    <Parada dia={8} min={230} claves={[mira(0, MAYA_X - 80, 600, 1.35), mira(L(40.2), MAYA_X - 120, 600, 1.4)]}
      hud={<>
        <Pildora texto="NURSING · TRUMAN COLLEGE" x={1260} y={250} desde={L(34.4)} color="#f4efe4" tam={36} />
        <Pildora texto="NIGHTS · SHERIDAN ROAD" x={1260} y={320} desde={L(37.2)} color="#f4efe4" tam={36} />
      </>} />
  );
};
const Sonrie2: React.FC = () => (
  <Parada dia={8} min={230} claves={[mira(0, BWY_PUNTOS.parada36, 600, 1.35), mira(102, BWY_PUNTOS.parada36, 595, 1.45)]}
    leoCara={[{ f: 0, v: "neutral" }, { f: 30, v: "sorpresa" }, { f: 66, v: "feliz" }]}
    mayaPoses={[{ f: 0, v: POSE_LIBRO }, { f: 8, v: { ...POSE_LIBRO, cabeza: -2 } }]} mayaCara={[{ f: 0, v: "neutral" }, { f: 14, v: "feliz" }]} />
);
const Mara3: React.FC = () => {
  // plano medio más cerrado; en «look at her» la sombra SEÑALA a Maya, en «imagine her» le aparece la foto de Maya en la mano; en «exactly what you want» Leo cambia la cara
  const T = 43.6, f = useF(), L = (t: number) => fr(t, T);
  const foto = ent(f, L(49.55), L(49.95));
  return (
    <Parada dia={8} min={230} claves={[mira(0, LEO_PARADA + 80, 640, 1.9), mira(L(46.75), LEO_PARADA + 70, 632, 1.98), mira(L(46.8), LEO_PARADA - 40, 560, 2.4), mira(L(52.9), LEO_PARADA - 50, 550, 2.6)]}
      leoCara={[{ f: 0, v: "feliz" }, { f: L(48.7), v: "duda" }, { f: L(50.7), v: "picaro" }]}
      mara={<g opacity={ent(f, 6, L(45.5))}><MaraParada esc={1.0 + 0.1 * ent(f, L(46.8), L(52))} caras={[{ f: 0, v: "picaro" }, { f: L(50.6), v: "feliz" }]}
        pose={f < L(48.65) ? { hD: 70, cD: 40, hI: 40, cI: 70, cabeza: 26, tronco: 14 } : f < L(49.5) ? { hD: 95, cD: 0, hI: 40, cI: 70, cabeza: 20, tronco: 10 } : { hD: 120, cD: 30, hI: 40, cI: 70, cabeza: 24, tronco: 14 }} /></g>}
      hud={<>
        <ManoMara texto={"look at her.\nimagine her."} x={1180} y={200} desde={L(48.8)} tam={80} />
        {foto > 0 && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><g opacity={foto}><FotoPlana x={1600} y={640} s={0.42 + 0.06 * foto} rot={-6} /></g></svg>}
      </>} />
  );
};
// ================= 4-5 · esa noche: cien fotos, chicas hechas de luz =================
const Noche4: React.FC = () => {
  const T = 52.9, L = (t: number) => fr(t, T);
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX - 80, 650, 1.5), mira(L(57.9), LX - 100, 620, 1.65)]} detras={oscuro}
      medio={<>
        <MaraCuarto esc={(f) => k01(f, 0, L(57.9), 1.0, 1.3)} caras={[{ f: 0, v: "picaro" }]} />
        <LeoCama caras={[{ f: 0, v: "triste" }, { f: L(55.5), v: "cansado" }]} />
      </>}
      hud={<Hud min={230} dia={8} />} />
  );
};
const Luz4: React.FC = () => {
  const f = useF();
  return (
    <AbsoluteFill style={{ background: "#07090e" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <circle cx={960} cy={540} r={700} fill={ACENTO} opacity={0.05 + 0.03 * Math.sin(f / 9)} />
      </svg>
      <PantallaMacro secuencia={["luz", "luz", "luz", "luz", "luz", "luz", "luz"]} periodo={20} />
      <Hud min={[{ f: 0, v: 230 }, { f: 150, v: 300, d: 60 }]} dia={8} estado="sube" />
    </AbsoluteFill>
  );
};
const Cara4: React.FC = () => {
  // la sombra ENTERA se inclina sobre Leo y le tapa el celular con la mano; la foto de la sonrisa de Maya (arriba a la derecha) se apaga en «never smile at him»
  const T = 65.6, f = useF(), L = (t: number) => fr(t, T);
  const apaga = ent(f, L(66.2), L(67.4));
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX - 110, 640, 1.6), mira(75, LX - 120, 636, 1.7, { curva: "in" })]} detras={oscuro}
      medio={<>
        <Actor look={MARA} escala={ESC * 1.45} seed={5} ruta={[{ f: 0, x: MX - 40, y: CP - 34 }]} dir={[{ f: 0, v: 1 }]} opacidad={() => 0.93}
          poses={[{ f: 0, v: { hD: 60, cD: 60, hI: 40, cI: 70, cabeza: 14 } }, { f: 20, v: { hD: 95, cD: 30, hI: 40, cI: 70, cabeza: 26, tronco: 16 } }, { f: L(67.2), v: { hD: 100, cD: 40, hI: 60, cI: 50, cabeza: 30, tronco: 20 } }]}
          caras={[{ f: 0, v: "feliz" }, { f: L(66.6), v: "risa" }]} />
        <LeoCama caras={[{ f: 0, v: "cansado" }, { f: L(66.3), v: "triste" }, { f: L(67.3), v: "cansado" }]} poses={[{ f: 0, v: SENT_CEL }, { f: L(66.2), v: { ...SENT_CEL, cabeza: -6 } }, { f: L(67.3), v: SENT_CEL }]} />
      </>}
      hud={<>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <g opacity={1 - 0.85 * apaga}><FotoPlana x={1600} y={330} s={0.48} rot={5} /></g>
        </svg>
        <Hud min={300} dia={8} />
      </>} />
  );
};
const Pantalla5: React.FC = () => (
  <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX - 70, 720, 2.2), mira(126, LX - 70, 722, 2.4)]} detras={oscuro}
    medio={<LeoCama caras={[{ f: 0, v: "cansado" }]} />}
    hud={<Hud min={[{ f: 0, v: 300 }, { f: 33, v: 320, d: 30 }]} dia={8} estado="sube" />} />
);

// ================= 6-7 · 3 a.m., Spin City: «I met a girl» =================
const Lav6: React.FC = () => {
  // seguimiento: Leo entra al lavadero de madrugada y camina hasta la mesa con las manos VACÍAS; en «laundry» abre las manos (no trae nada); Tenzo levanta la vista
  const T = 72.3, f = useF(), L = (t: number) => fr(t, T);
  const xLeo = (t: number) => interpolate(t, [72.3, 75.6], [2700, LEO_LAV], cl);
  return (
    <Lav claves={[mira(0, xLeo(72.3) - 60, 660, 2.0), mira(L(75.6), LEO_LAV + 120, 660, 2.0, { curva: "inout" }), mira(L(77), LEO_LAV + 160, 650, 2.15, { curva: "in" })]}
      leoRuta={[{ f: 0, x: 2700, y: LP }, { f: L(75.6), x: LEO_LAV, y: LP }]} leoCara={[{ f: 0, v: "cansado" }, { f: L(76.1), v: "triste" }]}
      leoPoses={[{ f: 0, v: { hD: 15, cD: 25, hI: 15, cI: 25 } }, { f: L(75.7), v: { hD: 15, cD: 25, hI: 15, cI: 25 } }, { f: L(76.1), v: { hD: 55, cD: 30, hI: 55, cI: 30, cabeza: 8 } }]}
      leoMira={[{ f: 0, v: { x: -1, y: 0 } }, { f: L(76.1), v: { x: 0, y: 0.8 } }]} leoDir={[{ f: 0, v: -1 }]}
      doblez={ent(f, L(74), L(77)) * 0.5} tenzoCara={[{ f: 0, v: "neutral" }, { f: L(76.3), v: "feliz" }]} tenzoGiros={[{ f: 0, v: 0 }]}
      hud={<><RelojDia min={180} x={1580} y={60} /><ManoLeo texto="no laundry." x={960} y={900} desde={L(76.1)} centro tam={66} /><Hud min={320} dia={8} /></>} />
  );
};
const Chica6: React.FC = () => {
  const T = 82.4, f = useF(), L = (t: number) => fr(t, T);
  return (
    <Lav claves={[mira(0, 1450, 640, 1.45), mira(L(87.9), LEO_LAV, 650, 1.9), mira(L(94), 1500, 640, 1.5)]}
      leoCara={[{ f: 0, v: "neutral" }, { f: L(86.5), v: "triste" }, { f: L(89.5), v: "asco" }]} leoHabla={[[0, L(84.7)], [L(86.5), L(94)]]}
      leoPoses={[{ f: 0, v: { hD: 15, cD: 30, hI: 15, cI: 30 } }, { f: L(88), v: "manosCara" }]}
      tenzoCara={[{ f: 0, v: "feliz" }, { f: L(86.5), v: "neutral" }]} tenzoHabla={[[L(84.7), L(86.4)]]}
      tenzoPoses={[{ f: 0, v: { hD: 60, cD: 70, hI: 55, cI: 75, tronco: 8 } }, { f: L(94), v: { hD: 10, cD: 20, hI: 10, cI: 20 } }]}
      doblez={0.9 + 0.1 * ent(f, 0, L(94))}
      hud={<><ManoLeo texto="i feel dirty." x={240} y={820} desde={L(92.6)} tam={70} /><Hud min={320} dia={8} /></>} />
  );
};
const Farol7: React.FC = () => {
  const T = 96.1, L = (t: number) => fr(t, T);
  return (
    <Lav claves={[mira(0, 1580, 640, 1.5), mira(L(99.1), LAV_PUNTOS.farol, LP - 200, 2.8), mira(L(102.7), LAV_PUNTOS.farol, LP - 200, 3.0)]}
      leoCara={[{ f: 0, v: "triste" }]} tenzoPoses={[{ f: 0, v: { hD: 10, cD: 20, hI: 10, cI: 20 } }]} tenzoCara={[{ f: 0, v: "feliz" }]} tenzoHabla={[[0, L(99.1)]]} doblez={1}
      hud={<Hud min={320} dia={8} />} />
  );
};

// ================= 8-14 · LA PARÁBOLA: Tanzan, Ekido y el río =================
const Camino8: React.FC<{ o?: number; cam?: number }> = ({ o = 0, cam = 0 }) => {
  const T = 102.7, fl = useF(), f = fl + o, L = (t: number) => fr(t, T);
  const x0 = 200 + f * 2.2;
  // el actor no ve el desplazamiento o: su x real en este cuadro
  const ax = (b: number) => 200 + o * 2.2 + b + fl * 4.4;
  const c0 = L(104.3);
  const cams = [
    [mira(0, 900, 600, 1.0), mira(c0 - 1, 900 + (c0 - 1) * 2.2, 610, 1.06), mira(c0, 200 + c0 * 2.2 + 130, JP - 200, 1.9), mira(L(105), 200 + L(105) * 2.2 + 130, JP - 200, 1.95)],
    [mira(0, ax(130), JP - 40, 2.9)],
    [mira(0, ax(130), JP - 190, 1.85)],
    [mira(0, ax(260), JP - 250, 2.4)],
    [mira(0, ax(120), JP - 250, 2.4)],
  ][cam];
  const charcos = Array.from({ length: 14 }).map((_, k) => 200 + k * 520);
  // plano 2: Ekido se seca la lluvia de la cara dos veces
  const seca = cam === 2 && ((fl > 14 && fl < 40) || (fl > 56 && fl < 82));
  const posEk = seca ? { hD: 20, cD: 120, hI: 150, cI: 150 + 18 * Math.sin(fl / 2.2), cabeza: 16 } : { hD: 20, cD: 120, hI: 20, cI: 120, cabeza: 12 };
  return (
    <Escena Set={CaminoMontana} pal={PAL_ANT} claves={cams}
      medio={<>
        {charcos.map((cx, k) => <ellipse key={k} cx={cx} cy={JP + 14} rx={150} ry={16} fill="#6b4a2a" opacity={0.85} />)}
        {charcos.map((cx, k) => <ellipse key={`b${k}`} cx={cx + 20} cy={JP + 10} rx={70} ry={5} fill="#f3dfb8" opacity={0.35 + 0.2 * Math.sin(f / 5 + k)} />)}
        <Actor look={TANZAN} escala={ESC} seed={22} luz={L_ANT} ruta={[{ f: 0, x: x0 + 260, y: JP + 10 }, { f: 2000, x: x0 + 260 + 2000 * 2.2, y: JP + 10 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "feliz" }]}
          miradas={[{ f: 0, v: { x: 0.5, y: -0.6 } }]} />
        <Actor look={EKIDO} escala={ESC} seed={23} luz={L_ANT} ruta={[{ f: 0, x: x0, y: JP + 10 }, { f: 2000, x: x0 + 2000 * 2.2, y: JP + 10 }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: posEk }]} caras={[{ f: 0, v: cam === 4 ? "determinado" : seca ? "asco" : "neutral" }]} miradas={[{ f: 0, v: { x: 0.3, y: 0.9 } }]} />
        {cam === 1 && Array.from({ length: 8 }).map((_, k) => { const ph = ((fl + k * 7) % 28) / 28; return <circle key={`s${k}`} cx={ax(130) - 120 + k * 34} cy={JP - 10 - 40 * Math.sin(ph * Math.PI)} r={6} fill="#8a6038" opacity={1 - ph} />; })}
      </>}
      hud={<>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><Lluvia f={fl} n={110} color="#f3dfb8" seed={4} /></svg>
        {cam === 0 && <Rotulo texto="JAPAN · A LONG TIME AGO" desde={6} hasta={L(105)} />}
        {cam === 1 && <ManoLeo texto="three days of rain." x={1250} y={260} desde={4} tam={62} />}
        {cam === 3 && <Pildora texto="TANZAN" x={960} y={170} desde={2} color="#ffd890" tam={40} />}
        {cam === 4 && <Pildora texto="EKIDO" x={960} y={170} desde={2} color="#f4efe4" tam={40} />}
      </>} />
  );
};
const Ekido8: React.FC = () => {
  const T = 116, f = useF(), L = (t: number) => fr(t, T);
  const x = 1200 + f * 1.2;
  return (
    <Escena Set={CaminoMontana} pal={PAL_ANT} claves={[mira(0, 1200, 620, 2.0), mira(L(126), 1200 + L(126) * 1.2, 620, 2.2)]}
      medio={<Actor look={EKIDO} escala={ESC} seed={23} luz={L_ANT} ruta={[{ f: 0, x, y: JP }, { f: 600, x: x + 720, y: JP }]} dir={[{ f: 0, v: 1 }]}
        poses={[{ f: 0, v: { hD: 20, cD: 120, hI: 20, cI: 120, cabeza: 14 } }]} caras={[{ f: 0, v: "neutral" }, { f: L(119.1), v: "enojo" }]}
        miradas={[{ f: 0, v: { x: 0.2, y: 1 } }]} giros={[{ f: 0, v: 0 }, { f: L(121), v: -0.6 }, { f: L(122), v: 0.6 }, { f: L(123), v: 0 }]} />} />
  );
};
const Rio9: React.FC = () => <Rio T={126} claves={[mira(0, 1000, 640, 1.2), mira(fr(127.7, 126), 1040, 645, 1.24), mira(fr(127.75, 126), 520, 660, 2.2), mira(fr(130, 126), 640, 660, 2.3, { curva: "inout" })]} caraTanzan="sorpresa" caraEkido="sorpresa" />;
const Rio9b: React.FC = () => <Rio T={130} claves={[mira(0, RIO.chica, JP - 230, 2.3), mira(fr(134.8, 130), RIO.chica - 20, JP - 230, 2.5)]} />;
const Rio9c: React.FC = () => <Rio T={134.8} claves={[mira(0, RIO.chica, JP - 110, 2.4), mira(fr(138.3, 134.8), RIO.chica + 20, JP - 115, 2.55)]} />;
const Rio9d: React.FC = () => <Rio T={138.3} claves={[mira(0, 1500, 620, 1.2), mira(fr(141.7, 138.3), 2900, 640, 1.25, { curva: "inout" })]} hud={<ManoLeo texto="before dark." x={620} y={260} desde={fr(140.2, 138.3)} tam={64} />} />;
const Mira10: React.FC = () => <Rio T={141.7} caraEkido="enojo" claves={[mira(0, 640, 640, 1.8), mira(fr(143.2, 141.7), 660, 640, 1.9), mira(fr(144.4, 141.7), 820, 620, 1.4), mira(fr(147.8, 141.7), 900, 620, 1.5)]} />;
const Cruza11: React.FC = () => {
  // + corte a la chica haciendo REVERENCIAS grandes (plano medio, «she bows and bows») y vuelta al general cuando «runs home»
  const T = 147.8, f = useF(), L = (t: number) => fr(t, T);
  const t = T + f / 30;
  return (
    <Rio T={T} claves={[mira(0, 950, 600, 1.6), mira(L(149.95), 960, 600, 1.62), mira(L(150.0), tanzanX(150) + 110, JP - 190, 2.4), mira(L(151.6), tanzanX(151.6) + 110, JP - 190, 2.5), mira(L(151.65), tanzanX(151.65) + 60, 640, 1.35), mira(L(154.8), tanzanX(154.8) + 60, 640, 1.35),
      mira(L(157.15), 2620, 630, 1.3), mira(L(157.2), 2560, 690, 2.4), mira(L(158.95), 2570, 686, 2.45), mira(L(159.0), 2800, 620, 1.3), mira(L(160.3), 2880, 620, 1.32)]}
      hud={<><Globo texto="Come on, girl." x={760} y={260} desde={4} hasta={L(149.5)} cola="abajo" tam={46} />{t > 150 && t < 155 && null}</>} />
  );
};
const Camina12: React.FC = () => {
  const T = 160.3, f = useF(), L = (t: number) => fr(t, T);
  const ex = 1300 + f * 0.9;
  const rojo = ent(f, L(164.8), L(172));
  return (
    <Escena Set={CaminoMontana} pal={PAL_ANT} claves={[mira(0, 1500, 580, 0.95), mira(L(164.8), ex, 640, 1.9), mira(L(174), ex + 40, 630, 2.2)]}
      medio={<>
        <Actor look={TANZAN} escala={ESC} seed={22} luz={L_ANT} ruta={[{ f: 0, x: ex + 280, y: JP }, { f: 600, x: ex + 280 + 540, y: JP }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "feliz" }]} />
        <Actor look={EKIDO} escala={ESC} seed={23} luz={L_ANT} ruta={[{ f: 0, x: ex, y: JP }, { f: 600, x: ex + 540, y: JP }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: { hD: 20, cD: 120, hI: 20, cI: 120, cabeza: 6 } }]} caras={[{ f: 0, v: "neutral" }, { f: L(166.3), v: "enojo" }]} />
        <Halo x={ex} y={JP - 330} r={220} color="#ff5a3a" fuerza={0.5 * rojo} />
      </>}
      hud={<>
        <ManoLeo texto="1 hour" x={1380} y={220} desde={L(162.3)} hasta={L(164)} tam={60} />
        <ManoLeo texto="2 hours" x={1380} y={220} desde={L(163.6)} hasta={L(172)} tam={60} />
        <ManoLeo texto="3 hours" x={1380} y={220} desde={L(172.2)} hasta={L(173.2)} tam={60} />
        <ManoLeo texto="4 hours" x={1380} y={220} desde={L(173.2)} tam={60} />
      </>} />
  );
};
const PX = PORTON.x;
const Porton12: React.FC = () => {
  const T = 174, f = useF(), L = (t: number) => fr(t, T);
  return (
    <Escena Set={PortonMonasterio} pal={PAL_ANT} setProps={{ hora: k01(f, 0, L(177.6), 0.2, 1) }} claves={[mira(0, PX, 560, 0.85), mira(L(177.7), PX - 100, 600, 1.0)]}
      medio={<>
        <Actor look={TANZAN} escala={ESC} seed={22} luz={L_ANT} ruta={[{ f: 0, x: PX - 700, y: JP }, { f: L(177.4), x: PX - 160, y: JP }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "feliz" }]} />
        <Actor look={EKIDO} escala={ESC} seed={23} luz={L_ANT} ruta={[{ f: 0, x: PX - 950, y: JP }, { f: L(177.4), x: PX - 420, y: JP }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: { hD: 20, cD: 120, hI: 20, cI: 120, cabeza: 6 } }]} caras={[{ f: 0, v: "enojo" }]} />
      </>} />
  );
};
const Grito13: React.FC = () => {
  const T = 177.7, L = (t: number) => fr(t, T);
  return (
    <Escena Set={PortonMonasterio} pal={PAL_ANT} setProps={{ hora: 1 }} claves={[mira(0, PX - 290, 640, 1.4), mira(L(180.05), PX - 295, 640, 1.45), mira(L(180.1), PX - 380, JP - 230, 2.3), mira(L(185.0), PX - 380, JP - 230, 2.4), mira(L(185.05), PX - 200, JP - 230, 2.3), mira(L(187.9), PX - 200, JP - 230, 2.45)]}
      medio={<>
        <Actor look={EKIDO} escala={ESC} seed={23} luz={L_ANT} ruta={[{ f: 0, x: PX - 420, y: JP }]} dir={[{ f: 0, v: 1 }]} habla={[[L(180.1), L(187.9)]]}
          poses={[{ f: 0, v: { hD: 20, cD: 120, hI: 20, cI: 120 } }, { f: L(180.1), v: "señalar" }, { f: L(185.1), v: { hD: 100, cD: 40, hI: 100, cI: 40, tronco: -6 } }]}
          caras={[{ f: 0, v: "enojo" }]} />
        <Actor look={TANZAN} escala={ESC} seed={22} luz={L_ANT} ruta={[{ f: 0, x: PX - 160, y: JP }]} dir={[{ f: 0, v: 1 }, { f: L(181), v: -1 }]} caras={[{ f: 0, v: "feliz" }, { f: L(181.2), v: "sorpresa" }]} />
      </>}
      hud={<>
        <Globo texto="How could you do that? We are monks!" x={1340} y={200} desde={L(180.1)} hasta={L(185.1)} cola="abajo" tam={46} />
        <Globo texto="You carried her in your arms!" x={560} y={200} desde={L(185.2)} hasta={L(187.9)} cola="abajo" tam={50} />
      </>} />
  );
};
const Tanzan14: React.FC = () => {
  const T = 187.9, f = useF(), L = (t: number) => fr(t, T);
  const fant = ent(f, L(196.7), L(197.8));
  return (
    <Escena Set={PortonMonasterio} pal={PAL_ANT} setProps={{ hora: 1 }} claves={[mira(0, PX - 160, 620, 2.3), mira(L(196.6), PX - 170, 620, 2.4), mira(L(197.6), PX - 300, 620, 1.35, { curva: "inout" }), mira(L(198.7), PX - 300, 620, 1.3)]}
      medio={<>
        <EkidoCargando x={PX - 420} y={JP} dir={1} fantasma={fant} caras={[{ f: 0, v: "enojo" }, { f: L(196.9), v: "sorpresa" }]} />
        <Actor look={TANZAN} escala={ESC} seed={22} luz={L_ANT} ruta={[{ f: 0, x: PX - 160, y: JP }]} dir={[{ f: 0, v: -1 }]} habla={[[L(192), L(198.7)]]}
          caras={[{ f: 0, v: "sorpresa" }, { f: L(193.3), v: "feliz" }]} poses={[{ f: 0, v: { hD: 10, cD: 20, hI: 10, cI: 20 } }, { f: L(196.7), v: { hD: 50, cD: 40, hI: 10, cI: 20 } }]} />
      </>}
      hud={<Frase texto="Why are you still carrying her?" desde={L(196.8)} y={170} tam={78} />} />
  );
};

// ================= 15-17 · el lavadero: ¿quién era el puro? =================
const Quieto15: React.FC = () => {
  const T = 198.7, L = (t: number) => fr(t, T);
  return (
    <Lav leo="silla" claves={[mira(0, 1450, 650, 1.3), mira(L(205.8), 1460, 645, 1.4)]} leoCara={[{ f: 0, v: "sorpresa" }, { f: 60, v: "neutral" }]}
      tenzoPoses={[{ f: 0, v: { hD: 10, cD: 20, hI: 10, cI: 20 } }]} tenzoCara={[{ f: 0, v: "feliz" }]} tenzoHabla={[[L(201.8), L(205.8)]]} doblez={1}
      hud={<Hud min={320} dia={8} />} />
  );
};
const Suelta15: React.FC = () => <Rio T={153.6} vel={0.8} claves={[mira(0, 2300, 610, 1.5), mira(fr(211.1, 205.8), 2440, 610, 1.6)]} />;
const Carga15: React.FC = () => {
  const f = useF();
  const x = 1200 + f * 1.6;
  return (
    <Escena Set={CaminoMontana} pal={PAL_ANT} claves={[mira(0, 1200, 600, 1.35), mira(213, 1200 + 213 * 1.6, 600, 1.45)]}
      medio={<EkidoCargando x={x} y={JP} dir={1} fantasma={1} caras={[{ f: 0, v: "enojo" }]} />} />
  );
};
const Puro15: React.FC = () => (
  <Lav leo="silla" claves={[mira(0, 1450, 650, 1.35), mira(87, 1450, 650, 1.4)]} leoCara={[{ f: 0, v: "duda" }]} tenzoCara={[{ f: 0, v: "neutral" }]} tenzoHabla={[[0, 70]]}
    tenzoPoses={[{ f: 0, v: { hD: 60, cD: 40, hI: 10, cI: 20 } }]} doblez={1} hud={<Hud min={320} dia={8} />} />
);
const Viejo16: React.FC = () => {
  const T = 219.0, L = (t: number) => fr(t, T);
  return (
    <Lav leo="silla" claves={[mira(0, LAV_PUNTOS.leo - 30, 700, 2.1), mira(L(221.6), LAV_PUNTOS.leo - 20, 700, 2.15), mira(L(225.6), 1460, 650, 1.4)]}
      leoCara={[{ f: 0, v: "neutral" }]} leoHabla={[[0, L(220.9)]]} tenzoCara={[{ f: 0, v: "feliz" }]} tenzoHabla={[[L(221.6), L(231.3)]]}
      tenzoPoses={[{ f: 0, v: { hD: 10, cD: 20, hI: 10, cI: 20 } }, { f: L(225.6), v: "señalar" }]} doblez={1} hud={<Hud min={320} dia={8} />} />
  );
};
// la foto plana de Maya que se arruga (inserto) contra el texto «the picture is not her.»
const Foto16: React.FC = () => {
  // Leo ENTERO sentado en la cama a oscuras, la foto grande en primer término a la derecha; la sonrisa se vuelve la cara de la sombra, se tapa los ojos, la foto se arruga
  const T = 231.3, f = useF(), L = (t: number) => fr(t, T);
  const arruga = ent(f, L(234.4), L(235.5));
  const sombra = ent(f, L(233.4), L(234.0));
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX + 170, 780, 1.75), mira(L(233.3), LX + 175, 778, 1.8), mira(L(233.35), LX + 60, 770, 2.0), mira(L(235.6), LX + 65, 766, 2.1, { curva: "in" })]} detras={oscuro}
      medio={<LeoCama luz={L_ANT} tel={false} caras={[{ f: 0, v: "triste" }, { f: L(233.4), v: "miedo" }, { f: L(234.6), v: "cansado" }]} poses={[{ f: 0, v: { ...SENT_CEL, hD: 60, cD: 60, cabeza: -4 } }, { f: L(233.45), v: { ...SENT_CEL, hD: 60, cD: 60, tronco: -6, cabeza: -10 } }, { f: L(234.4), v: { ...SENT_CEL, hI: 40, cI: 140, hD: 45, cD: 140, cabeza: 14 } }]} />}
      hud={<>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <circle cx={1400} cy={470} r={330} fill={ORO} opacity={0.08} />
          <g transform={`translate(1400,470) rotate(${-6 + arruga * 18}) scale(${0.66 * (1 - arruga * 0.45)},${0.66 * (1 - arruga * 0.65)})`}>
            <rect x={-260} y={-330} width={520} height={620} rx={10} fill="#f4efe4" />
            <rect x={-230} y={-300} width={460} height={500} fill="#2a3a3a" />
            <path d="M-200,200 L-185,30 C-170,-20 -100,-40 -40,-50 L40,-50 C100,-40 170,-20 185,30 L200,200 Z" fill="#4a4e58" />
            <path d="M-56,-46 L0,90 L56,-46 Z" fill="#7fb6c9" />
            <rect x={-26} y={-80} width={52} height={44} fill="#e0aa7c" />
            <ellipse cx={0} cy={-150} rx={78} ry={92} fill="#e0aa7c" />
            <path d="M-86,-150 C-92,-262 92,-262 86,-150 L86,-70 C74,-100 66,-178 0,-190 C-66,-178 -74,-100 -86,-70 Z" fill="#2a1a12" />
            <circle cx={-28} cy={-160} r={8} fill="#2a1a12" /><circle cx={28} cy={-160} r={8} fill="#2a1a12" />
            <path d="M-30,-112 Q0,-90 30,-112" stroke="#5a2a20" strokeWidth={7} fill="none" strokeLinecap="round" />
            <path d="M-96,-60 Q0,-10 96,-60 L104,-24 Q0,30 -104,-24 Z" fill="#3f9a6a" />
            <rect x={40} y={-24} width={44} height={150} rx={12} fill="#3f9a6a" />
            {sombra > 0 && <g opacity={sombra}>
              <ellipse cx={0} cy={-150} rx={80} ry={94} fill="#14100c" />
              <circle cx={-30} cy={-166} r={11} fill={ACENTO} /><circle cx={30} cy={-166} r={11} fill={ACENTO} />
              <path d="M-50,-120 Q0,-70 50,-120" stroke={ACENTO} strokeWidth={9} fill="none" strokeLinecap="round" />
            </g>}
            {arruga > 0.1 && [0, 1, 2, 3].map((k) => <path key={k} d={`M${-240 + k * 130},-320 L${-200 + k * 120},280`} stroke="#c9c2b4" strokeWidth={6} opacity={arruga} />)}
          </g>
        </svg>
        <ManoLeo texto="the picture is not her." x={960} y={930} desde={6} hasta={L(232.6)} centro tam={58} />
        <ManoLeo texto="only your hunger, wearing her face." x={960} y={930} desde={L(232.7)} centro tam={56} />
        <Hud min={320} dia={8} />
      </>} />
  );
};
const Real16: React.FC = () => {
  const T = 235.6, L = (t: number) => fr(t, T);
  return (
    <Lav leo="silla" claves={[mira(0, 1450, 650, 1.35), mira(L(243.1), LAV_PUNTOS.tenzo, 640, 2.0), mira(L(251.3), LAV_PUNTOS.tenzo + 10, 640, 2.2)]}
      leoCara={[{ f: 0, v: "duda" }]} leoHabla={[[0, L(237.2)]]} tenzoCara={[{ f: 0, v: "neutral" }, { f: L(238.2), v: "feliz" }, { f: L(249.9), v: "risa" }]}
      tenzoHabla={[[L(238.2), L(249.9)], [L(251.3), L(254.8)]]} tenzoPoses={[{ f: 0, v: { hD: 10, cD: 20, hI: 10, cI: 20 } }, { f: L(243.1), v: { hD: 60, cD: 40, hI: 10, cI: 20 } }]} doblez={1}
      hud={<Hud min={320} dia={8} />} />
  );
};
const Mara17: React.FC = () => {
  const T = 254.8, L = (t: number) => fr(t, T);
  return (
    <Lav leo="silla" claves={[mira(0, LAV_PUNTOS.leo - 120, 560, 1.4), mira(L(265.3), LAV_PUNTOS.leo - 140, 540, 1.6)]} leoCara={[{ f: 0, v: "triste" }]} tenzoCara={[{ f: 0, v: "feliz" }]} doblez={1}
      mara={<MaraLav esc={1.4} caras={[{ f: 0, v: "risa" }, { f: L(258.6), v: "picaro" }, { f: L(262.4), v: "feliz" }]} pose={{ hD: 80, cD: 40, hI: 60, cI: 50, cabeza: -10, tronco: -8 }} />}
      hud={<>
        <ManoMara texto="she'll never want you." x={1250} y={420} desde={L(258.7)} hasta={L(262.3)} tam={64} />
        <ManoMara texto="the pictures never say no." x={980} y={230} desde={L(262.4)} tam={64} />
        <Hud min={320} dia={8} />
      </>} />
  );
};

// ================= 18-19 · DAY 9: «Is it good? The book?» =================
const Dia9: React.FC = () => {
  // general corto (1,6 s) → Leo llega caminando a la parada (medio) → INSERTO de las manos que tiemblan con su cara arriba
  const T = 265.3, f = useF(), L = (t: number) => fr(t, T);
  const tiembla = f > L(269.8) ? Math.sin(f * 1.1) * 8 : 0;
  return (
    <Parada dia={9} min={0} claves={[mira(0, 3300, 600, 1.0), mira(L(266.9), 3330, 600, 1.03), mira(L(266.95), LEO_PARADA - 200, 660, 2.0), mira(L(269.0), LEO_PARADA + 40, 660, 2.05, { curva: "inout" }), mira(L(269.75), LEO_PARADA + 40, 666, 2.1), mira(L(269.8), LEO_PARADA + 30, 700, 3.0), mira(L(272.8), LEO_PARADA + 30, 696, 3.1)]}
      leoRuta={[{ f: 0, x: LEO_PARADA - 640, y: BP }, { f: L(266.9), x: LEO_PARADA - 520, y: BP }, { f: L(269.0), x: LEO_PARADA, y: BP }]}
      leoPoses={[{ f: 0, v: BOLSILLOS }, { f: L(269.2), v: BOLSILLOS }, { f: L(269.7), v: { hD: 42 + tiembla, cD: 105, hI: 40 - tiembla, cI: 105, cabeza: 16 } }, { f: L(271.4), v: { hD: 38 + tiembla, cD: 110, hI: 36 - tiembla, cI: 110, cabeza: 4 } }]}
      leoCara={[{ f: 0, v: "neutral" }, { f: L(269.6), v: "miedo" }]}
      leoMira={[{ f: 0, v: { x: 1, y: 0 } }, { f: L(269.6), v: { x: 0.2, y: 0.9 } }, { f: L(271.4), v: { x: 1, y: 0.1 } }]}
      hud={<RelojDia min={460} x={1580} y={60} />} />
  );
};
const Libro18: React.FC = () => {
  const T = 272.8, L = (t: number) => fr(t, T);
  return (
    <Parada dia={9} min={0} claves={[mira(0, MAYA_X + 10, 650, 1.9), mira(L(280.1), MAYA_X + 30, 640, 2.2)]}
      hud={<Pildora texto="POEMS · TRANSLATED" x={1240} y={300} desde={L(276)} color="#f4efe4" tam={36} />} />
  );
};
const Cuello18: React.FC = () => {
  // el aliento ámbar de la sombra le llega al cuello («breathing») y Leo se encoge; corte cerrado a la oreja en «don't»; en «go home» baja la cabeza y mete las manos
  const T = 280.1, f = useF(), L = (t: number) => fr(t, T);
  const c = L(283.55);
  const BX = LEO_PARADA - 200, BY = 560, NX = LEO_PARADA - 40, NY = 700;
  return (
    <Parada dia={9} min={0} claves={[mira(0, LEO_PARADA - 60, 600, 2.0), mira(c - 1, LEO_PARADA - 64, 598, 2.08), mira(c, LEO_PARADA - 110, 600, 3.0), mira(219, LEO_PARADA - 116, 596, 3.1, { curva: "in" })]}
      leoCara={[{ f: 0, v: "miedo" }, { f: L(285.4), v: "triste" }]}
      leoPoses={[{ f: 0, v: BOLSILLOS }, { f: L(282.2), v: BOLSILLOS }, { f: L(282.45), v: "encogerse" }, { f: L(285.3), v: "encogerse" }, { f: L(285.6), v: { ...BOLSILLOS, cabeza: 16 } }]}
      mara={<MaraParada esc={1.15} x={LEO_PARADA - 120} caras={[{ f: 0, v: "picaro" }]} pose={{ hD: 90 + Math.sin(f / 9) * 4, cD: 30, hI: 40, cI: 70, cabeza: 30, tronco: 18 }} />}
      delante={<>{[0, 1, 2, 3].map((k) => {
        const a = L(281.9) + k * 9, p = ent(f, a, a + 22);
        if (p <= 0 || p >= 1) return null;
        return <ellipse key={k} cx={BX + (NX - BX) * p} cy={BY + (NY - BY) * p - 20 * Math.sin(p * Math.PI)} rx={18 + 22 * p} ry={10 + 10 * p} fill={ACENTO} opacity={0.5 * Math.sin(p * Math.PI)} />;
      })}</>}
      hud={<>
        <ManoMara texto="don't." x={1180} y={260} desde={L(283.7)} hasta={L(285.4)} tam={76} />
        <ManoMara texto="go home. open the phone." x={980} y={260} desde={L(285.4)} tam={62} />
      </>} />
  );
};
const Stop18: React.FC = () => {
  const T = 287.4, L = (t: number) => fr(t, T);
  return (
    <Parada dia={9} min={0} claves={[mira(0, LEO_PARADA, 650, 2.1), mira(L(291.4), LEO_PARADA, 650, 2.25)]}
      leoCara={[{ f: 0, v: "cansado" }, { f: L(289.5), v: "determinado" }]}
      hud={<ManoLeo texto={"Stop.\nWhere am I going?"} x={1100} y={300} desde={L(289.6)} tam={70} />} />
  );
};
const Habla19: React.FC = () => {
  const T = 291.4, L = (t: number) => fr(t, T);
  return (
    <Parada dia={9} min={0} claves={[mira(0, BWY_PUNTOS.parada36, 610, 1.4), mira(L(299.3), BWY_PUNTOS.parada36, 605, 1.5)]}
      leoCara={[{ f: 0, v: "determinado" }, { f: L(295.4), v: "feliz" }]} leoHabla={[[L(292.4), L(295.1)]]}
      mayaPoses={[{ f: 0, v: POSE_LIBRO }, { f: L(295.4), v: { ...POSE_LIBRO, cabeza: -2 } }]} mayaCara={[{ f: 0, v: "neutral" }, { f: L(295.6), v: "sorpresa" }, { f: L(296.6), v: "risa" }]}
      hud={<Globo texto="Is it good? The book?" x={760} y={250} desde={L(292.4)} hasta={L(295.6)} cola="abajo" tam={46} />} />
  );
};
const Monja19: React.FC = () => {
  const T = 299.3, L = (t: number) => fr(t, T);
  return (
    <Parada dia={9} min={0} claves={[mira(0, MAYA_X + 10, 640, 1.9), mira(L(306.7), MAYA_X + 10, 640, 2.0)]}
      mayaPoses={[{ f: 0, v: { ...POSE_LIBRO, cabeza: -2 } }]} mayaCara={[{ f: 0, v: "feliz" }]} mayaHabla={[[L(300.9), L(306.7)]]}
      hud={<Globo texto="Poems by a nun. Two thousand years ago. In India." x={1000} y={240} desde={L(302.5)} hasta={L(306.7)} cola="abajo" tam={42} />} />
  );
};
const Amrapali19: React.FC = () => {
  const T = 306.7, L = (t: number) => fr(t, T);
  return (
    <Parada dia={9} min={0} claves={[mira(0, LEO_PARADA, 650, 2.1), mira(L(313.1), LEO_PARADA + 10, 650, 2.2)]}
      leoCara={[{ f: 0, v: "sorpresa" }, { f: L(308.8), v: "duda" }]} leoHabla={[[L(308.8), L(311.5)]]}
      hud={<Globo texto="Was her name Amrapali?" x={1050} y={260} desde={L(308.8)} hasta={L(313.1)} cola="abajo" tam={46} />} />
  );
};
const Monje19: React.FC = () => {
  const T = 313.1, L = (t: number) => fr(t, T);
  return (
    <Parada dia={9} min={0} claves={[mira(0, BWY_PUNTOS.parada36, 610, 1.45), mira(L(318.1), BWY_PUNTOS.parada36, 610, 1.55)]}
      leoCara={[{ f: 0, v: "neutral" }, { f: L(314.4), v: "feliz" }]} leoHabla={[[L(314.4), L(318.1)]]}
      mayaPoses={[{ f: 0, v: { ...POSE_LIBRO, cabeza: -2 } }]} mayaCara={[{ f: 0, v: "sorpresa" }]} mayaHabla={[[0, L(314.4)]]}
      hud={<>
        <Globo texto="How do you know that?" x={1260} y={240} desde={0} hasta={L(314.4)} cola="abajo" tam={44} />
        <Globo texto="An old monk told me. In a laundromat." x={640} y={240} desde={L(314.5)} hasta={L(318.1)} cola="abajo" tam={42} />
      </>} />
  );
};
const Mano19: React.FC = () => {
  const T = 318.1, L = (t: number) => fr(t, T);
  return (
    <Parada dia={9} min={0} claves={[mira(0, BWY_PUNTOS.parada36, 620, 1.3), mira(L(325.9), BWY_PUNTOS.parada36, 615, 1.4)]}
      leoCara={[{ f: 0, v: "feliz" }]} leoHabla={[[L(325.3), L(325.9)]]} leoPoses={[{ f: 0, v: { hD: 20, cD: -40, hI: -20, cI: -40 } }, { f: L(324.6), v: { hD: 75, cD: 10, hI: -20, cI: -40 } }]}
      mayaPoses={[{ f: 0, v: { ...POSE_LIBRO, cabeza: -2 } }, { f: L(323.6), v: { hD: 50, cD: 100, hI: 75, cI: 10 } }]} mayaCara={[{ f: 0, v: "risa" }, { f: L(321), v: "feliz" }]} mayaHabla={[[0, L(321)], [L(324), L(325.3)]]}
      hud={<>
        <Globo texto="I'm Maya." x={1180} y={260} desde={L(324)} hasta={L(325.9)} cola="abajo" tam={46} />
        <Globo texto="Leo." x={760} y={260} desde={L(325.3)} hasta={L(325.9) + 20} cola="abajo" tam={46} />
      </>} />
  );
};

// ================= 20-22 · el 36: once paradas, el poema =================
const Bus20: React.FC = () => {
  const T = 325.9, f = useF(), L = (t: number) => fr(t, T);
  const parada = Math.min(11, 1 + Math.floor(Math.max(0, f - L(329.2)) / ((L(347.5) - L(329.2)) / 10.5)));
  return (
    <Bus claves={[mira(0, 1440, 560, 0.95), mira(L(329.2), 1440, 620, 1.35), mira(L(337.6), 1450, 630, 1.55)]}
      mayaHabla={[[L(330), L(333)], [L(334.5), L(337)]]} leoHabla={[[L(333), L(334.4)]]}
      hud={<>
        <Pildora texto={`STOP ${parada} / 11`} x={960} y={90} desde={L(329.3)} color="#f4efe4" tam={36} />
        <Hud min={0} dia={9} />
      </>} />
  );
};
const Poema20: React.FC = () => {
  const T = 337.6, L = (t: number) => fr(t, T);
  return (
    <Escena Set={Vaishali} pal={PAL_ANT} setProps={{ monjes: false }} claves={[mira(0, VAI_PUNTOS.jardin, 600, 1.5), mira(L(345.5), VAI_PUNTOS.jardin + 40, 610, 1.7)]}
      medio={<Actor look={AMRAPALI_VIEJA} escala={ESC} seed={31} luz={L_ANT} ruta={[{ f: 0, x: VAI_PUNTOS.jardin, y: 900 }]} dir={[{ f: 0, v: 1 }]}
        poses={[{ f: 0, v: { hD: 70, cD: 120, hI: 10, cI: 20, cabeza: 8 } }]} caras={[{ f: 0, v: "neutral" }, { f: L(341.5), v: "feliz" }]} />}
      hud={<>
        <ManoLeo texto="her hair, once black like bees," x={260} y={230} desde={L(339.3)} tam={58} />
        <ManoLeo texto="now white like hemp." x={420} y={320} desde={L(341.4)} tam={58} />
      </>} />
  );
};
const Bolsillo20: React.FC = () => (
  <Bus claves={[mira(0, COLECTIVO.asientoLeo - 20, 650, 1.9), mira(60, COLECTIVO.asientoLeo - 20, 650, 2.0)]} leoCara={[{ f: 0, v: "feliz" }]}
    hud={<><Pildora texto="STOP 11 / 11" x={960} y={90} desde={0} color="#f4efe4" tam={36} /><Hud min={0} dia={9} /></>} />
);
const Puerta21: React.FC = () => {
  const T = 347.5, L = (t: number) => fr(t, T);
  return (
    <Bus vel={0} claves={[mira(0, 2300, 600, 1.0), mira(L(351.5), COLECTIVO.puerta - 200, 620, 1.35)]}
      mayaSentada={false} mayaRuta={[{ f: 0, x: COLECTIVO.asientoMaya, y: KP }, { f: L(349.6), x: COLECTIVO.puerta - 40, y: KP }]}
      mayaDir={[{ f: 0, v: 1 }, { f: L(349.6), v: -1 }]} mayaPoses={[{ f: 0, v: { hD: 15, cD: 30, hI: 15, cI: 30 } }]} mayaCara={[{ f: 0, v: "feliz" }]} mayaHabla={[[L(351.5), L(353.1)]]}
      leoHabla={[[L(353.1), L(354.2)]]}
      hud={<>
        <Globo texto="Same time tomorrow?" x={1300} y={260} desde={L(351.5)} hasta={L(353.2)} cola="abajo" tam={46} />
        <Globo texto="Same time." x={700} y={300} desde={L(353.1)} hasta={L(354.2)} cola="abajo" tam={46} />
      </>} />
  );
};
const Bajo22: React.FC = () => (
  <Bus vel={3} claves={[mira(0, COLECTIVO.asientoLeo - 20, 650, 1.8), mira(168, COLECTIVO.asientoLeo - 20, 650, 1.95)]} leoCara={[{ f: 0, v: "feliz" }]} mayaRuta={[{ f: 0, x: 5000, y: KP }]} mayaSentada={false}
    hud={<Hud min={[{ f: 0, v: 320 }, { f: 33, v: 110, d: 40 }]} dia={9} estado="normal" />} />
);

// ================= 23 · esa noche: «put her down at the river» =================
const Cuenta23: React.FC = () => {
  const T = 359.8, f = useF(), L = (t: number) => fr(t, T);
  return (
    <Lav leo="parado" claves={[mira(0, 1500, 600, 1.0), mira(L(366.8), 1500, 640, 1.3), mira(L(371.4), 1460, 650, 1.4)]}
      leoCara={[{ f: 0, v: "risa" }, { f: L(366), v: "feliz" }, { f: L(371.4), v: "neutral" }, { f: L(375.8), v: "determinado" }]} leoHabla={[[0, L(366.5)], [L(375.8), L(380.3)]]}
      leoPoses={[{ f: 0, v: "celebrar" }, { f: 40, v: "señalar" }, { f: 90, v: { hD: 60, cD: 40, hI: 60, cI: 40 } }, { f: L(366), v: { hD: 15, cD: 30, hI: 15, cI: 30 } }]}
      tenzoCara={[{ f: 0, v: "feliz" }]} tenzoHabla={[[L(371.4), L(373.9)]]} tenzoGiros={[{ f: 0, v: 0 }]} doblez={ent(f, 0, L(366)) * 0.8}
      tenzoPoses={[{ f: 0, v: { hD: 60, cD: 70, hI: 55, cI: 75, tronco: 8, cabeza: 6 + 6 * Math.sin(f / 10) } }]}
      hud={<Hud min={110} dia={9} />} />
  );
};
const Suelta23: React.FC = () => <Rio T={154.4} vel={0.7} claves={[mira(0, 2350, 610, 1.45), mira(fr(384.5, 380.3), 2420, 610, 1.55)]} />;
const Junto23: React.FC = () => (
  <Lav leo="parado" claves={[mira(0, 1460, 650, 1.45), mira(18, 1460, 650, 1.5)]} leoCara={[{ f: 0, v: "feliz" }]} tenzoCara={[{ f: 0, v: "feliz" }]} tenzoHabla={[[0, 18]]} doblez={0.8} hud={<Hud min={110} dia={9} />} />
);

// ================= 24-26 · DAY 10: feliz… y la notificación =================
const Dia10: React.FC = () => {
  const T = 385.1, f = useF(), L = (t: number) => fr(t, T);
  const plano = f < L(391.1) ? 0 : f < L(393) ? 1 : 2;
  const claves = [[mira(0, LX - 40, 620, 1.25), mira(L(391.1), LX - 40, 600, 1.35)], [mira(0, LX - 40, 600, 2.1), mira(60, LX - 40, 600, 2.2)], [mira(0, 760, 650, 1.4), mira(60, 760, 650, 1.5)]][plano];
  const pose: KF<string | Partial<Pose>> = plano === 0 ? [{ f: 0, v: "celebrar" }] : plano === 1 ? [{ f: 0, v: { hD: 120, cD: 130, hI: 10, cI: 20, cabeza: -10 } }] : [{ f: 0, v: "agacharse" }];
  return (
    <Escena Set={Cuarto} pal={PAL_DIA} setProps={{ nieve: false }} claves={claves}
      medio={<Actor look={LEO} escala={ESC} seed={1} luz={L_DIA} ruta={[{ f: 0, x: plano === 2 ? 820 : LX, y: CP }]} dir={[{ f: 0, v: plano === 2 ? -1 : 1 }]} poses={pose} caras={[{ f: 0, v: plano === 1 ? "picaro" : "feliz" }]} />}
      hud={<><RelojDia min={360} x={1580} y={60} /><Hud min={0} dia={10} /></>} />
  );
};
const Notif25: React.FC = () => {
  const T = 395.0, f = useF(), L = (t: number) => fr(t, T);
  return (
    <AbsoluteFill style={{ background: "#0d1016" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><circle cx={960} cy={560} r={640} fill={ACENTO} opacity={0.04 + 0.07 * ent(f, L(399), L(405))} /></svg>
      <PantallaMacro secuencia={["luz"]} periodo={100000} desde={L(399.2)} />
      {f < L(399.2) && <RelojDia min={362} x={830} y={420} tam={90} />}
      <Hud min={4} dia={10} />
    </AbsoluteFill>
  );
};
const Vuelve25: React.FC = () => {
  // la cámara se ABRE desde Leo con el celular y la sombra CRECE detrás de su hombro hasta llenar el cuadro (entera, dentro)
  const T = 408.9, f = useF(), L = (t: number) => fr(t, T);
  const crece = ent(f, L(409.3), L(412.1));
  return (
    <Escena Set={Cuarto} pal={PAL_DIA} setProps={{ nieve: false }} claves={[mira(0, LX - 40, 640, 2.4), mira(L(410.3), LX - 90, 600, 1.6, { curva: "inout" }), mira(L(412.5), LX - 140, 540, 1.15, { curva: "inout" })]}
      medio={<>
        <Actor look={MARA} escala={ESC * (0.9 + 0.95 * crece)} seed={5} ruta={[{ f: 0, x: MX - 80, y: CP - 20 }]} dir={[{ f: 0, v: 1 }]} opacidad={() => 0.3 + 0.64 * ent(f, 0, 20)}
          poses={[{ f: 0, v: { hD: 30, cD: 40, hI: 30, cI: 40, cabeza: 10 } }, { f: L(410.9), v: { hD: 110, cD: 40, hI: 100, cI: 40, cabeza: 18, tronco: 10 } }]} caras={[{ f: 0, v: "picaro" }, { f: L(411.6), v: "risa" }]} />
        <Actor look={LEO} escala={ESC} seed={1} luz={L_TEL} ruta={[{ f: 0, x: LX, y: CP }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 30, cD: 125, cabeza: 22, hI: 10, cI: 20 } }]} caras={[{ f: 0, v: "cansado" }]} enManoD={<Tel />} />
      </>}
      hud={<><ManoMara texto="missed me?" x={1560} y={260} desde={L(410.4)} centro tam={70} /><Hud min={12} dia={10} /></>} />
  );
};
const Truco26: React.FC = () => {
  const T = 412.5, L = (t: number) => fr(t, T);
  return (
    <Escena Set={Cuarto} pal={PAL_DIA} setProps={{ nieve: false }} detras={oscuro} claves={[mira(0, MX - 80, 380, 2.0), mira(L(419.7), MX - 80, 370, 2.3)]}
      medio={<Actor look={MARA} escala={ESC * 2.0} seed={5} ruta={[{ f: 0, x: MX - 80, y: CP - 20 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 70, cD: 50, hI: 50, cI: 70, cabeza: 16 } }]} caras={[{ f: 0, v: "picaro" }, { f: L(417.8), v: "risa" }]} opacidad={() => 0.95} />}
      hud={<Frase texto="It waits until you are happy." desde={L(417.9)} y={880} tam={80} />} />
  );
};
// ================= 27 · CTA + gancho del día 11: el farol sobre la mesa se apaga =================
const Cierre27: React.FC = () => {
  const T = 419.7, f = useF(), L = (t: number) => fr(t, T);
  const luz = 1 - ent(f, L(428), L(433.2));
  return (
    <Escena Set={Lavadero} pal={PAL} setProps={{ girando: [], nieve: true, luzFarol: luz }} claves={[mira(0, 1500, 600, 1.0), mira(L(433.5), LAV_PUNTOS.farol, LP - 220, 1.8)]}
      detras={<Tibio k={0.6 * luz} x={LAV_PUNTOS.farol} y={LP - 200} />}
      medio={<Toalla x={LAV_PUNTOS.mesa} y={LP - 150} doblez={1} />}
      hud={<>
        <Frase texto="Have you ever carried someone who was never there?" desde={L(419.9)} hasta={L(423.6)} y={250} tam={58} />
        <Frase texto="Tell me below." desde={L(423.7)} hasta={L(425.5)} y={250} tam={64} />
        <Frase texto="Watch Day 11 next" desde={L(425.6)} y={880} tam={60} />
      </>} />
  );
};

// ===================== VUELTA OJO 1 (26-oct): plano/contraplano + un componente que lleve el concepto en cada frase =====================
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
// gesto real: alterna dos poses cada `paso` cuadros (manos que hablan, toalla que se dobla, cabeza que asiente)
const alterna = (a: Partial<Pose>, b: Partial<Pose>, f0: number, f1: number, paso = 16): KF<Partial<Pose>> =>
  Array.from({ length: Math.max(1, Math.ceil((f1 - f0) / paso)) }, (_, k) => ({ f: f0 + k * paso, v: k % 2 ? b : a }));
const BOLSILLOS: Partial<Pose> = { hD: 20, cD: -40, hI: -20, cI: -40 };
const T_DOBLA_A: Partial<Pose> = { hD: 60, cD: 70, hI: 55, cI: 75, tronco: 8 };
const T_DOBLA_B: Partial<Pose> = { hD: 88, cD: 36, hI: 82, cI: 40, tronco: 4 };
const T_HABLA_A: Partial<Pose> = { hD: 60, cD: 40, hI: 10, cI: 20 };
const T_HABLA_B: Partial<Pose> = { hD: 92, cD: 22, hI: 28, cI: 44, cabeza: 4 };
const L_HABLA_A: Partial<Pose> = { tronco: 6, pI: 80, rI: 90, pD: 85, rD: 95, hD: 60, cD: 50, hI: 25, cI: 60 };
const L_HABLA_B: Partial<Pose> = { tronco: 4, pI: 80, rI: 90, pD: 85, rD: 95, hD: 85, cD: 30, hI: 40, cI: 50 };

// planos cortos en la parada (Leo a la izquierda mirando a Maya, Maya a la derecha)
type PCorto = { dur: number; z?: number; dia?: number; min?: number; cara?: KF<string>; habla?: [number, number][]; poses?: KF<string | Partial<Pose>>; hud?: React.ReactNode; mara?: React.ReactNode };
const LeoP: React.FC<PCorto> = ({ dur, z = 2.4, dia = 9, min = 0, cara, habla, poses, hud, mara }) => (
  <Parada dia={dia} min={min} claves={[mira(0, LEO_PARADA + 20, 715, z), mira(dur, LEO_PARADA + 20, 711, z + 0.1, { curva: "in" })]} leoCara={cara} leoHabla={habla} leoPoses={poses} hud={hud} mara={mara} />
);
const MayaP: React.FC<PCorto & { mira?: KF<{ x: number; y: number }>; dx?: number }> = ({ dur, z = 2.4, dia = 9, min = 0, cara, habla, poses, hud, mira: m, dx = 0 }) => (
  <Parada dia={dia} min={min} claves={[mira(0, MAYA_X - 20 + dx, 715, z), mira(dur, MAYA_X - 20 + dx, 711, z + 0.1, { curva: "in" })]} mayaCara={cara} mayaHabla={habla} mayaPoses={poses} mayaMira={m} hud={hud} />
);
// planos cortos en el lavadero
type LCorto = { dur: number; z?: number; cara?: KF<string>; habla?: [number, number][]; poses?: KF<string | Partial<Pose>>; hud?: React.ReactNode; dia?: number; min?: number; doblez?: number; mara?: React.ReactNode };
const LeoLav: React.FC<LCorto & { silla?: boolean; claves?: Clv[] }> = ({ dur, z = 2.0, cara, habla, poses, hud, dia = 8, min = 320, silla = true, mara, claves }) => (
  <Lav leo={silla ? "silla" : "parado"} claves={claves ?? [mira(0, silla ? LAV_PUNTOS.leo - 80 : LEO_LAV - 200, 650, z), mira(dur, silla ? LAV_PUNTOS.leo - 80 : LEO_LAV - 200, 646, z + 0.1, { curva: "in" })]}
    leoCara={cara} leoHabla={habla} leoPoses={poses} doblez={1} mara={mara} hud={<>{hud}<Hud min={min} dia={dia} /></>} />
);
const TenzoLav: React.FC<LCorto & { leo?: "silla" | "parado" }> = ({ dur, z = 1.9, cara, habla, poses, hud, dia = 8, min = 320, doblez = 1 }) => (
  <Lav leo="silla" claves={[mira(0, LAV_PUNTOS.tenzo + 60, 640, z), mira(dur, LAV_PUNTOS.tenzo + 60, 636, z + 0.1, { curva: "in" })]}
    tenzoCara={cara} tenzoHabla={habla} tenzoPoses={poses} doblez={doblez} hud={<>{hud}<Hud min={min} dia={dia} /></>} />
);

// lista de datos (voto / qué hizo cada monje): título chico + renglones que entran en su palabra; tachado = «no es eso»
const Lista: React.FC<{ x: number; y: number; titulo?: string; items: { t: string; desde: number; tacha?: boolean; color?: string; cruz?: boolean }[]; tam?: number; ancho?: number }> = ({ x, y, titulo, items, tam = 46, ancho = 640 }) => {
  const f = useF();
  const o0 = Math.min(...items.map((i) => i.desde));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: ancho, padding: "22px 30px 26px", borderRadius: 22, background: "rgba(10,12,16,0.62)", opacity: interpolate(f, [o0 - 8, o0 + 4], [0, 1], cl), fontFamily: F_HUD }}>
      {titulo && <div style={{ fontSize: tam * 0.55, letterSpacing: 5, color: "#c9c2b4", marginBottom: 10 }}>{titulo}</div>}
      {items.map((it, k) => {
        const e = ent(f, it.desde, it.desde + 10);
        const t = it.tacha ? ent(f, it.desde + 14, it.desde + 26) : 0;
        return (
          <div key={k} style={{ position: "relative", display: "flex", alignItems: "center", gap: 18, fontSize: tam, fontWeight: 600, color: it.color ?? "#f4efe6", opacity: e, transform: `translateX(${(1 - e) * -24}px)`, marginTop: 8, whiteSpace: "nowrap" }}>
            {it.cruz && <span style={{ color: ACENTO, fontSize: tam * 1.05 }}>✕</span>}
            <span style={{ position: "relative" }}>{it.t}
              {t > 0 && <span style={{ position: "absolute", left: 0, top: "52%", height: 7, width: `${100 * t}%`, background: ACENTO, borderRadius: 4 }} />}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// polaroids: la sonrisa de Maya convertida en cien fotos que rodean a Leo (o que orbitan a la sombra)
const Polaroids: React.FC<{ desde: number; hasta: number; n: number; contador?: boolean; cx?: number; cy?: number; r0?: number }> = ({ desde, hasta, n, contador = true, cx = 960, cy = 560, r0 = 360 }) => {
  const f = useF();
  const k = Math.round(interpolate(f, [desde, hasta], [0, n], cl));
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: k }).map((_, i) => {
          const a = random(`pa${i}`) * Math.PI * 2, r = r0 + random(`pr${i}`) * 520;
          const x = cx + Math.cos(a + f * 0.004) * r * 1.3, y = cy + Math.sin(a + f * 0.004) * r * 0.62;
          const nace = interpolate(f, [desde + (i / n) * (hasta - desde), desde + (i / n) * (hasta - desde) + 6], [1.6, 1], cl);
          return (
            <g key={i} transform={`translate(${x},${y}) rotate(${(random(`pt${i}`) - 0.5) * 40}) scale(${(0.5 + random(`ps${i}`) * 0.45) * nace})`}>
              <rect x={-62} y={-72} width={124} height={146} rx={4} fill="#f4efe4" />
              <rect x={-52} y={-62} width={104} height={104} fill="#3a1e18" />
              <circle cx={0} cy={-26} r={17} fill={ACENTO} />
              <path d="M-28,42 C-28,2 28,2 28,42 Z" fill={ACENTO} />
            </g>
          );
        })}
      </svg>
      {contador && <GranNumero rotulo="PICTURES" claves={[{ f: 0, v: 0 }, { f: desde, v: n, d: hasta - desde }]} x={1560} y={44} color={ACENTO} tam={84} desde={desde - 4} />}
    </AbsoluteFill>
  );
};

// la foto plana de Maya (siempre la misma sonrisa)
const FotoPlana: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = -3 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-215} y={-250} width={430} height={520} rx={8} fill="#f4efe4" />
    <rect x={-190} y={-225} width={380} height={400} fill="#3a4a52" />
    <path d="M-150,175 L-140,40 C-130,0 -80,-14 -30,-22 L30,-22 C80,-14 130,0 140,40 L150,175 Z" fill="#4a4e58" />
    <path d="M-44,-20 L0,70 L44,-20 Z" fill="#7fb6c9" />
    <rect x={-22} y={-50} width={44} height={36} fill="#d9a27a" />
    <ellipse cx={0} cy={-96} rx={60} ry={72} fill="#d9a27a" />
    <path d="M-66,-96 C-70,-180 70,-180 66,-96 L66,-40 C56,-60 50,-120 0,-130 C-50,-120 -56,-60 -66,-40 Z" fill="#2a1a12" />
    <path d="M-74,-30 Q0,10 74,-30 L82,0 Q0,44 -82,0 Z" fill="#3f9a6a" />
    <rect x={30} y={0} width={34} height={110} rx={10} fill="#3f9a6a" />
    <path d="M-22,-62 Q0,-46 22,-62" stroke="#5a2a20" strokeWidth={6} fill="none" strokeLinecap="round" />
    <circle cx={-20} cy={-92} r={6} fill="#2a1a12" /><circle cx={20} cy={-92} r={6} fill="#2a1a12" />
  </g>
);

// ---------- 7,6-21,6 · DAY 8 en la parada ----------
const Dia8b: React.FC = () => {
  // general CORTO (≤2 s, carteles enteros) → seguimiento en plano medio de Leo que camina hasta la parada, se frena, mete las manos y mira de reojo
  const T = 7.6, L = (t: number) => fr(t, T);
  const xLeo = (t: number) => interpolate(t, [7.6, 13.2], [2700, LEO_PARADA], cl);
  return (
    <Parada dia={8} min={230} claves={[mira(0, 3300, 600, 1.0), mira(L(9.4), 3320, 600, 1.03), mira(L(9.45), xLeo(9.45) + 80, 660, 1.9), mira(L(13.2), LEO_PARADA + 120, 660, 1.95, { curva: "inout" }), mira(L(14.3), LEO_PARADA + 130, 656, 2.05, { curva: "in" })]}
      leoRuta={[{ f: 0, x: 2700, y: BP }, { f: L(13.2), x: LEO_PARADA, y: BP }]}
      leoPoses={[{ f: 0, v: { hD: 15, cD: 25, hI: 15, cI: 25 } }, { f: L(13.0), v: { hD: 15, cD: 25, hI: 15, cI: 25 } }, { f: L(13.4), v: BOLSILLOS }]} leoCara={[{ f: 0, v: "neutral" }, { f: L(13.5), v: "duda" }]}
      leoMira={[{ f: 0, v: { x: 1, y: 0 } }, { f: L(13.4), v: { x: 1, y: 0.3 } }]}
      hud={<><RelojDia min={460} x={1580} y={60} /><GranNumero rotulo="DAY" claves={[{ f: 0, v: 8 }]} x={960} y={300} tam={170} desde={0} hasta={L(9.4)} color="#fff3dc" /></>} />
  );
};
// «he was there yesterday too, and the day before»: tres días, la misma hora, el mismo lugar
const TresDias: React.FC = () => {
  // EN EL MUNDO: la misma parada tres días (8 → 7 → 6), cada día un encuadre y una pose distinta de Leo; el día va en una pastilla
  const f = useF(), L = (t: number) => fr(t, 14.3);
  const c1 = L(14.8), c2 = L(16.0);
  const dia = f < c1 ? 8 : f < c2 ? 7 : 6;
  return (
    <Parada dia={dia} min={230} claves={[mira(0, LEO_PARADA + 80, 660, 2.0), mira(c1 - 1, LEO_PARADA + 80, 658, 2.05), mira(c1, (LEO_PARADA + MAYA_X) / 2, 650, 2.3), mira(c2 - 1, (LEO_PARADA + MAYA_X) / 2, 646, 2.38), mira(c2, BWY_PUNTOS.parada36, 700, 1.6), mira(96, BWY_PUNTOS.parada36, 696, 1.65)]}
      leoPoses={[{ f: 0, v: BOLSILLOS }, { f: c1, v: { hD: 70, cD: 130, hI: 70, cI: 130, tronco: -2 } }, { f: c2, v: { hD: 15, cD: 120, hI: -20, cI: -40, cabeza: 6 } }]}
      leoCara={[{ f: 0, v: "duda" }, { f: c1, v: "neutral" }, { f: c2, v: "feliz" }]}
      leoMira={[{ f: 0, v: { x: 1, y: 0.2 } }, { f: c1, v: { x: 1, y: 0 } }, { f: c2, v: { x: 0.3, y: 0.8 } }]}
      mayaPoses={[{ f: 0, v: POSE_LIBRO }, { f: c1, v: { ...POSE_LIBRO, cabeza: 10 } }, { f: c2, v: { hD: 20, cD: 40, hI: 15, cI: 30 } }]} libro={f < c2}
      hud={<>
        <ManoLeo texto="DAY 8" x={960} y={140} desde={0} hasta={c1} centro tam={66} />
        <ManoLeo texto="DAY 7 · yesterday" x={960} y={140} desde={c1} hasta={c2} centro tam={66} />
        <ManoLeo texto="DAY 6 · the day before" x={960} y={140} desde={c2} centro tam={66} />
        <RelojDia min={460} x={1580} y={60} />
      </>} />
  );
};
const Coinc8: React.FC = () => {
  const T = 17.5, f = useF(), L = (t: number) => fr(t, T);
  return (
    <LeoP dur={123} dia={8} min={230} cara={[{ f: 0, v: "duda" }, { f: L(19.8), v: "feliz" }]}
      poses={[{ f: 0, v: BOLSILLOS }, { f: 14, v: { hD: 45, cD: 70, hI: 40, cI: 70, cabeza: -4 } }, { f: 44, v: BOLSILLOS }]}
      hud={<>
        <ManoLeo texto="coincidence." x={140} y={300} desde={8} tam={76} />
        {f > L(19.9) && <div style={{ position: "absolute", left: 130, top: 326, height: 8, width: 420 * ent(f, L(19.9), L(20.5)), background: ACENTO, borderRadius: 4, transform: "rotate(-3deg)" }} />}
      </>} />
  );
};
// 21,6-24,8 · la bufanda verde, el ambo bajo el abrigo: Leo anota cada detalle
const MayaVerde: React.FC = () => (
  <MayaP dur={96} dia={8} min={230} poses={[{ f: 0, v: POSE_LIBRO }, { f: 30, v: { ...POSE_LIBRO, hI: 85, cI: 60 } }, { f: 64, v: POSE_LIBRO }]}
    hud={<>
      <ManoLeo texto="green scarf." x={1300} y={330} desde={8} tam={62} />
      <ManoLeo texto="nursing scrubs." x={1300} y={600} desde={44} tam={62} />
    </>} />
);
// 24,8-29,2 / 274,2-280,1 · el libro de papel en macro: la esquina de la hoja se dobla
const LibroMacro: React.FC<{ dobla?: number; titulo?: string; sub?: string; dia: number; min: number }> = ({ dobla = 8, titulo, sub, dia, min }) => {
  const f = useF();
  const d = ent(f, dobla, dobla + 22);
  const z = 1 + (titulo ? 0.35 : 0.18) * ent(f, 0, 150);
  const hoja = ent(f, titulo ? 112 : 72, titulo ? 140 : 104); // la hoja derecha pasa a la izquierda
  const sello = titulo ? ent(f, 69, 76) : 0;
  const s = 120 * d;
  const pasa = ent(f, 120, 150); // el pulgar acomoda la hoja
  return (
    <AbsoluteFill style={{ background: "#4a4e58" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, transform: `scale(${z}) rotate(${-3 + 3 * ent(f, 0, 150)}deg)`, transformOrigin: titulo ? "33% 45%" : "50% 55%" }}>
        <path d="M0,0 L1920,0 L1920,70 C1500,120 420,40 0,110 Z" fill="#3f9a6a" />
        <g transform="translate(960,590) rotate(-3)">
          <rect x={-650} y={-350} width={1300} height={720} rx={16} fill="#2e5a8a" />
          <path d="M-620,-330 L-12,-310 L-12,340 L-620,330 Z" fill="#f1ead9" />
          <path d="M12,-310 L620,-330 L620,330 L12,340 Z" fill="#f4eee0" />
          <rect x={-14} y={-312} width={28} height={652} fill="#d8cfbb" />
          {titulo ? (
            <g>
              <text x={-316} y={-120} fontSize={70} textAnchor="middle" fill="#2a2622" fontFamily="Georgia, serif" fontWeight={700} letterSpacing={6}>{titulo}</text>
              <rect x={-470} y={-90} width={308} height={4} fill="#8a6a4a" />
              {sub && sub.split("\n").map((l, k) => <text key={k} x={-316} y={-20 + k * 48} fontSize={38} textAnchor="middle" fill="#4a423a" fontFamily="Georgia, serif" fontStyle="italic">{l}</text>)}
            </g>
          ) : Array.from({ length: 13 }).map((_, k) => <rect key={k} x={-560} y={-270 + k * 44} width={480 - (k % 4) * 40} height={9} rx={4} fill="#a49d90" />)}
          {Array.from({ length: 13 }).map((_, k) => <rect key={k} x={70} y={-270 + k * 44} width={500 - ((k + 2) % 5) * 36} height={9} rx={4} fill="#a49d90" />)}
          {s > 1 && <path d={`M620,-330 L${620 - s},-330 L620,${-330 + s} Z`} fill="#2e5a8a" />}
          {s > 1 && <path d={`M${620 - s},-330 L620,${-330 + s} L${620 - s},${-330 + s} Z`} fill="#d9cfb9" stroke="#bfb4a0" strokeWidth={2} />}
          <ellipse cx={-590} cy={300 - pasa * 12} rx={70} ry={46} fill="#d9a27a" stroke="#8a5a3a" strokeWidth={4} />
          <ellipse cx={600} cy={290} rx={70} ry={46} fill="#d9a27a" stroke="#8a5a3a" strokeWidth={4} />
          {hoja > 0 && hoja < 1 && <g transform={`translate(12,0) scale(${Math.cos(Math.PI * hoja)},1)`}>
            <path d="M0,-310 L608,-330 L608,330 L0,340 Z" fill={hoja < 0.5 ? "#efe7d4" : "#e4dac4"} stroke="#c9bfa9" strokeWidth={3} />
            {Array.from({ length: 10 }).map((_, k) => <rect key={k} x={60} y={-260 + k * 50} width={440} height={8} rx={4} fill="#b4ab9c" opacity={hoja < 0.5 ? 1 : 0.3} />)}
          </g>}
          {sello > 0 && <g transform={`translate(-316,170) rotate(-8) scale(${1.8 - 0.8 * sello})`} opacity={sello}>
            <rect x={-250} y={-46} width={500} height={92} rx={10} fill="none" stroke="#a8322a" strokeWidth={8} />
            <text x={0} y={16} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={42} letterSpacing={4} fill="#a8322a">TRANSLATED FROM PALI</text>
          </g>}
        </g>
      </svg>
      <Hud min={min} dia={dia} />
    </AbsoluteFill>
  );
};
// 29,2-34,2 · la ficha que Leo se arma en la cabeza: nombre (lo sabrá el día 9) y edad
const FichaMaya: React.FC = () => {
  // plano de Maya → INSERTO de su credencial de enfermería («MAYA») → vuelve a su cara en «twenty-three»
  const T = 29.2, f = useF(), L = (t: number) => fr(t, T);
  const BX = MAYA_X - 14, BY = 772;
  const a = ent(f, L(31.6), L(31.9));
  return (
    <Parada dia={8} min={230} claves={[mira(0, MAYA_X + 20, 660, 2.4), mira(L(31.2), MAYA_X + 20, 664, 2.5), mira(L(31.6), BX, BY - 20, 4.2, { curva: "inout" }), mira(L(32.6), BX, BY - 24, 4.3), mira(L(33.0), MAYA_X + 10, 640, 2.8, { curva: "inout" }), mira(150, MAYA_X + 10, 636, 2.9)]}
      leoX={-5000} mayaPoses={[{ f: 0, v: POSE_LIBRO }, { f: L(30.6), v: { ...POSE_LIBRO, hI: 70, cI: 82 } }, { f: L(32.9), v: { ...POSE_LIBRO, cabeza: -4 } }]}
      mayaCara={[{ f: 0, v: "neutral" }, { f: L(33.0), v: "feliz" }]}
      delante={<g transform={`translate(${BX},${BY})`}>
        <path d="M-10,-40 L0,-14 L10,-40" stroke="#2e5a8a" strokeWidth={3} fill="none" />
        <rect x={-26} y={-16} width={52} height={34} rx={4} fill="#f4efe4" stroke="#2e5a8a" strokeWidth={2.5} />
        <rect x={-26} y={-16} width={52} height={8} rx={3} fill="#3f9a6a" />
        <circle cx={-15} cy={4} r={6} fill="#d9a27a" />
        <text x={8} y={8} fontSize={11} fontWeight={800} textAnchor="middle" fill="#22262d" fontFamily="sans-serif" opacity={0.4 + 0.6 * a}>MAYA</text>
        <text x={8} y={15} fontSize={3.6} fontWeight={700} textAnchor="middle" fill="#2e5a8a" fontFamily="sans-serif">STUDENT NURSE</text>
      </g>}
      hud={<>
        <ManoLeo texto="her name: Maya" x={960} y={900} desde={L(31.7)} hasta={L(32.65)} centro tam={62} />
        <ManoLeo texto="23 years old" x={960} y={900} desde={L(32.9)} centro tam={62} />
      </>} />
  );
};
// 34,2-40,2 · el mapa de Uptown: la parada, Truman College, el hogar de ancianos en Sheridan (de noche)
const MapaUptown: React.FC = () => {
  // pantalla partida: a la izquierda Maya EN EL MUNDO (lee → levanta la vista en «nurse» → bosteza en «nights» → se gira hacia el mapa en «Sheridan»); a la derecha el mapa con su recorrido
  const T = 34.2, f = useF(), L = (t: number) => fr(t, T);
  const r1 = ent(f, L(34.8), L(36.6)), r2 = ent(f, L(37.4), L(39.4));
  const P = { stop: [905, 420], col: [760, 700], hogar: [1360, 560] };
  const lerp = (a: number[], b: number[], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const maya = f < L(37.4) ? lerp(P.stop, P.col, r1) : lerp(P.col, P.hogar, r2);
  const Pin: React.FC<{ p: number[]; t: string; d: number; c: string; arriba?: boolean }> = ({ p, t, d, c, arriba }) => {
    const e = ent(f, d, d + 10);
    return (
      <g opacity={e} transform={`translate(${p[0]},${p[1]}) scale(${0.6 + 0.4 * e})`}>
        <path d="M0,0 C-26,-34 -30,-50 -30,-62 A30,30 0 1 1 30,-62 C30,-50 26,-34 0,0 Z" fill={c} stroke="#0d0f14" strokeWidth={4} />
        <circle cx={0} cy={-62} r={11} fill="#0d0f14" />
        <rect x={-t.length * 12.5 - 18} y={arriba ? -150 : 14} width={t.length * 25 + 36} height={54} rx={14} fill="#0d0f14" stroke={c} strokeWidth={3} />
        <text x={0} y={arriba ? -112 : 52} fontSize={34} textAnchor="middle" fill="#f4efe6" fontFamily={F_HUD} fontWeight={600} letterSpacing={2}>{t}</text>
      </g>
    );
  };
  const LIB = { tronco: 0, ...POSE_LIBRO };
  return (
    <AbsoluteFill style={{ background: "#141a22" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(637.5,${120 - 10 * ent(f, 0, 180)}) scale(${0.75 + 0.02 * ent(f, 0, 180)})`}>
          <path d="M1560,0 C1520,260 1600,520 1540,760 C1500,900 1560,1000 1540,1080 L1920,1080 L1920,0 Z" fill="#1e3550" />
          <text x={1630} y={560} fontSize={34} textAnchor="middle" fill="#6f8fb4" fontFamily={F_HUD} letterSpacing={6} transform="rotate(90 1630 560)">LAKE MICHIGAN</text>
          {[180, 330, 640, 800, 950].map((y) => <rect key={y} x={0} y={y - 3} width={1560} height={6} fill="#262d38" />)}
          {[260, 440, 1120].map((x) => <rect key={x} x={x - 3} y={0} width={6} height={1080} fill="#262d38" />)}
          <rect x={0} y={636} width={1560} height={10} fill="#3a424f" />
          <text x={560} y={624} fontSize={28} fill="#8a929e" fontFamily={F_HUD} letterSpacing={4}>WILSON</text>
          <path d="M870,0 L940,1080" stroke="#59606b" strokeWidth={18} />
          <text x={870} y={250} fontSize={30} fill="#aab2be" fontFamily={F_HUD} letterSpacing={5} transform="rotate(86 870 250)">BROADWAY</text>
          <path d="M1320,0 C1270,380 1400,700 1350,1080" stroke="#59606b" strokeWidth={14} fill="none" />
          <text x={1290} y={860} fontSize={28} fill="#aab2be" fontFamily={F_HUD} letterSpacing={4} transform="rotate(84 1290 860)">SHERIDAN RD</text>
          {r1 > 0 && <path d={`M${P.stop[0]},${P.stop[1]} L${lerp(P.stop, P.col, r1).join(",")}`} stroke="#3f9a6a" strokeWidth={8} strokeDasharray="18 14" strokeLinecap="round" />}
          {r2 > 0 && <path d={`M${P.col[0]},${P.col[1]} L${lerp(P.col, P.hogar, r2).join(",")}`} stroke="#3f9a6a" strokeWidth={8} strokeDasharray="18 14" strokeLinecap="round" opacity={0.9} />}
          <circle cx={maya[0]} cy={maya[1]} r={16} fill="#3f9a6a" stroke="#f4efe6" strokeWidth={4} opacity={r1 > 0 ? 1 : 0} />
          <Pin p={P.stop} t="36 BUS STOP" d={4} c="#e9e6e0" arriba />
          <Pin p={P.col} t="TRUMAN COLLEGE · NURSING" d={L(34.8)} c="#3f9a6a" />
          <Pin p={P.hogar} t="NIGHTS · NURSING HOME" d={L(37.4)} c={ACENTO} arriba />
        </g>
      </svg>
      <AbsoluteFill style={{ clipPath: "inset(0px 960px 0px 0px)" }}>
        <Parada dia={8} min={230} leoX={-5000} claves={[mira(0, MAYA_X + 190, 700, 2.5), mira(180, MAYA_X + 196, 696, 2.6, { curva: "in" })]}
          mayaPoses={[{ f: 0, v: LIB }, { f: L(35.3), v: { ...LIB, cabeza: -4 } }, { f: L(37.4), v: { hD: 50, cD: 100, hI: 165, cI: 30, cabeza: -14 } }, { f: L(38.5), v: { ...LIB, cabeza: 0 } }]}
          mayaCara={[{ f: 0, v: "neutral" }, { f: L(35.3), v: "feliz" }, { f: L(37.4), v: "bostezo" }, { f: L(38.5), v: "feliz" }]}
          mayaDir={[{ f: 0, v: -1 }, { f: L(38.85), v: 1 }]} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 957, top: 0, width: 6, height: 1080, background: "#0d0f14" }} />
      <GranNumero rotulo="MAYA" claves={[{ f: 0, v: 23 }]} sufijo=" yrs" x={1440} y={60} color="#f4efe6" tam={70} desde={2} />
    </AbsoluteFill>
  );
};
const SonrieMaya: React.FC = () => (
  <MayaP dur={51} dia={8} min={230} z={3.0} dx={110} poses={[{ f: 0, v: POSE_LIBRO }, { f: 6, v: { ...POSE_LIBRO, cabeza: -4 } }]} cara={[{ f: 0, v: "neutral" }, { f: 10, v: "risa" }]} />
);
const SonrieLeo: React.FC = () => (
  <LeoP dur={51} dia={8} min={230} cara={[{ f: 0, v: "sorpresa" }, { f: 20, v: "feliz" }]} poses={[{ f: 0, v: BOLSILLOS }, { f: 16, v: { ...BOLSILLOS, cabeza: -6 } }]} />
);

// ---------- 52,9-72,3 · cien fotos, mil chicas, el contador ----------
const Noche4b: React.FC = () => {
  // más cerca de Leo; la sombra estira la mano hacia el celular en «takes the smile» y las cien fotos SALEN DEL TELÉFONO
  const T = 52.9, f = useF(), L = (t: number) => fr(t, T);
  const PX = 1300, PY = 780; // celular (mundo)
  const corte = L(56.2);
  const z = f < corte ? 1.9 : 2.3;
  const cam = f < corte ? { x: LX - 90, y: 670 } : { x: LX - 20, y: 650 };
  const sx = 960 + (PX - cam.x) * z, sy = 540 + (PY - cam.y) * z;
  const d0 = L(56.3), d1 = L(57.6), n = 100;
  const k = Math.round(interpolate(f, [d0, d1], [0, n], cl));
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX - 90, 670, 1.9), mira(corte - 1, LX - 90, 668, 1.98), mira(corte, LX - 20, 650, 2.3), mira(150, LX - 20, 646, 2.38, { curva: "in" })]} detras={oscuro}
      medio={<>
        <MaraCuarto esc={(fx) => k01(fx, 0, L(57.9), 1.0, 1.15)} caras={[{ f: 0, v: "picaro" }, { f: L(55.4), v: "feliz" }]}
          pose={f < L(54.6) ? { hD: 120, cD: 30, hI: 40, cI: 70, cabeza: 14 } : f < L(56.2) ? { hD: 82, cD: 8, hI: 40, cI: 70, cabeza: 22, tronco: 14 } : { hD: 140, cD: 20, hI: 130, cI: 20, cabeza: 6 }} />
        <LeoCama caras={[{ f: 0, v: "triste" }, { f: L(55.5), v: "cansado" }]} poses={alterna(SENT_CEL, { ...SENT_CEL, cD: 136 }, 0, L(57.9), 10)} />
      </>}
      hud={<>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: k }).map((_, i) => {
            const t0 = d0 + (i / n) * (d1 - d0), v = ent(f, t0, t0 + 8);
            const a = random(`pa${i}`) * Math.PI * 2, r = 260 + random(`pr${i}`) * 560;
            const x = sx + (Math.cos(a) * r * 1.3) * v, y = sy + (Math.sin(a) * r * 0.62) * v;
            return (
              <g key={i} transform={`translate(${x},${y}) rotate(${(random(`pt${i}`) - 0.5) * 40}) scale(${(0.3 + random(`ps${i}`) * 0.4) * (0.4 + 0.6 * v)})`}>
                <rect x={-50} y={-60} width={100} height={120} rx={4} fill="#f4efe4" />
                <rect x={-42} y={-52} width={84} height={84} fill={ACENTO} />
                <circle cx={0} cy={-20} r={14} fill="#f4efe4" /><path d="M-24,32 C-24,6 24,6 24,32 Z" fill="#f4efe4" />
              </g>
            );
          })}
        </svg>
        {k > 0 && <GranNumero rotulo="PICTURES" claves={[{ f: 0, v: 0 }, { f: d0, v: 100, d: d1 - d0 }]} x={1600} y={70} color={ACENTO} tam={70} desde={d0} />}
        <Hud min={230} dia={8} />
      </>} />
  );
};
const TelFeed: React.FC = () => {
  // primer plano de Leo en la cama: el celular se ENCIENDE y le pinta la cara → corte a la pantalla, el pulgar baja el feed
  const T = 57.9, f = useF(), L = (t: number) => fr(t, T);
  const c = L(59.95);
  const prende = ent(f, L(58.9), L(59.3));
  return f < c ? (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX + 10, 690, 2.5), mira(c, LX + 10, 686, 2.6, { curva: "in" })]} detras={oscuro}
      medio={<LeoCama luz={{ ...L_TEL, fuerza: 0.1 + 0.6 * prende }} caras={[{ f: 0, v: "cansado" }, { f: L(59.1), v: "sorpresa" }, { f: L(59.6), v: "cansado" }]} poses={[{ f: 0, v: { ...SENT_CEL, hD: 10, cD: 60, cabeza: 4 } }, { f: L(58.9), v: SENT_CEL }]} />}
      hud={<Hud min={230} dia={8} />} />
  ) : (
    <AbsoluteFill style={{ background: "#07090e" }}>
      <TelGrande modo="feed" vel={20} pulgar x={960} y={560} s={0.95} desde={-30} />
      <Hud min={[{ f: 0, v: 230 }, { f: 30, v: 280, d: 70 }]} dia={8} estado="sube" />
    </AbsoluteFill>
  );
};
// mil chicas hechas de luz… y en el medio la única de verdad, que se apaga
const MilChicas: React.FC = () => {
  // en el cuarto a oscuras: Leo pasa con el pulgar y la pared se llena de mil chicas de luz; en «made of light» brillan y corte al rostro iluminado
  const T = 61.6, f = useF(), L = (t: number) => fr(t, T);
  const C = 50, R = 20, luz = ent(f, L(64.75), L(65.1));
  const corte = L(63.9);
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX - 20, 760, 1.45), mira(corte - 1, LX - 20, 756, 1.55), mira(corte, LX + 40, 700, 2.6), mira(120, LX + 40, 696, 2.7, { curva: "in" })]}
      detras={<>
        {oscuro}{oscuro}
        {Array.from({ length: C * R }).map((_, i) => {
          const x = 560 + (i % C) * 26, y = 330 + Math.floor(i / C) * 30;
          if (Math.abs(x - 1230) < 170 && y > 560) return null;
          const t0 = 6 + random(`mc${i}`) * 90;
          const o = interpolate(f, [t0, t0 + 6], [0, 1], cl);
          if (o <= 0) return null;
          return <g key={i} opacity={o * (0.45 + 0.25 * Math.sin(f / 6 + i) + 0.3 * luz)}><circle cx={x} cy={y - 7} r={5} fill={ACENTO} /><path d={`M${x - 7},${y + 10} C${x - 7},${y - 2} ${x + 7},${y - 2} ${x + 7},${y + 10} Z`} fill={ACENTO} /></g>;
        })}
        <Halo x={LX + 40} y={720} r={260} color={ACENTO} fuerza={0.15 + 0.3 * luz} />
      </>}
      medio={<LeoCama caras={[{ f: 0, v: "cansado" }, { f: L(64.7), v: "zombi" }]} poses={alterna(SENT_CEL, { ...SENT_CEL, cD: 138 }, 0, 120, 8)} />}
      hud={<>
        <GranNumero rotulo="GIRLS WHO ARE NOT HER" claves={[{ f: 0, v: 0 }, { f: 6, v: 1000, d: 90 }]} x={960} y={70} color={ACENTO} tam={96} desde={2} />
        <Hud min={[{ f: 0, v: 280 }, { f: 40, v: 300, d: 60 }]} dia={8} estado="sube" />
      </>} />
  );
};
const Cuenta8: React.FC = () => (
  <AbsoluteFill style={{ background: "#0d0f14" }}>
    <TelGrande modo="screentime" min={0} minHasta={320} x={760} y={560} s={0.92} desde={2} />
    <GranNumero rotulo="DAY" claves={[{ f: 0, v: 8 }]} x={1440} y={300} color="#f4efe6" tam={230} desde={10} /><Pildora texto="OF 30" x={1440} y={640} desde={20} color="#c9c2b4" tam={44} />
    <Hud min={320} dia={8} />
  </AbsoluteFill>
);

// ---------- 72,3-102,7 · Spin City: «I met a girl» ----------
const TenzoDobla: React.FC = () => {
  const f = useF();
  return (
    <TenzoLav dur={90} leo="parado" cara={[{ f: 0, v: "feliz" }]} poses={alterna(T_DOBLA_A, T_DOBLA_B, 0, 90, 22)} doblez={ent(f, 0, 88)}
      hud={<RelojDia min={180} x={1580} y={60} />} />
  );
};
const FarolMesa: React.FC = () => {
  const f = useF();
  return (
    <Lav leo="no" tenzo={false} claves={[mira(0, LAV_PUNTOS.farol, LP - 230, 3.4), mira(72, LAV_PUNTOS.farol, LP - 232, 3.6, { curva: "in" })]}
      doblez={1} farol={0.92 + 0.08 * Math.sin(f / 3)} hud={<Hud min={320} dia={8} />} />
  );
};
const Chica6a: React.FC = () => {
  // primer plano de Leo (se rasca la nuca, mira al piso, sonríe) «I met a girl» → corte al primer plano de Tenzo que DEJA de doblar y levanta las cejas «Ah»
  const T = 82.4, f = useF(), L = (t: number) => fr(t, T);
  const c = L(84.7);
  return (
    <Lav claves={[mira(0, LEO_LAV + 40, 650, 2.5), mira(c - 1, LEO_LAV + 40, 646, 2.6, { curva: "in" }), mira(c, LAV_PUNTOS.tenzo - 70, 650, 2.6), mira(L(86.5), LAV_PUNTOS.tenzo - 70, 646, 2.7, { curva: "in" })]}
      leoDir={[{ f: 0, v: 1 }]} leoCara={[{ f: 0, v: "neutral" }, { f: L(83.6), v: "feliz" }]} leoHabla={[[0, L(84.7)]]}
      leoPoses={[{ f: 0, v: { hD: 15, cD: 30, hI: 15, cI: 30 } }, { f: 10, v: { hD: 150, cD: 150, hI: 15, cI: 30, cabeza: 12 } }, { f: L(84.0), v: { hD: 30, cD: 70, hI: 15, cI: 30, cabeza: 4 } }]}
      leoMira={[{ f: 0, v: { x: 0.4, y: 0.8 } }, { f: L(84.0), v: { x: 1, y: 0 } }]}
      tenzoCara={[{ f: 0, v: "neutral" }, { f: c + 4, v: "sorpresa" }, { f: c + 30, v: "feliz" }]} tenzoHabla={[[c + 4, L(86.4)]]} tenzoPoses={[...alterna(T_DOBLA_A, T_DOBLA_B, 0, c, 22), { f: c + 2, v: { hD: 20, cD: 40, hI: 20, cI: 40, cabeza: -8 } }]}
      doblez={0.7}
      hud={<>
        {f < c && <Globo texto="I met a girl." x={560} y={240} desde={4} hasta={c} cola="abajo" tam={50} />}
        <Globo texto="Ah." x={1100} y={240} desde={c + 4} hasta={L(86.5)} cola="abajo" tam={56} />
        <Hud min={320} dia={8} />
      </>} />
  );
};
const Chica6b: React.FC = () => {
  const T = 86.5, L = (t: number) => fr(t, T);
  return (
    <LeoLav silla={false} dur={L(94)} claves={[mira(0, LEO_LAV - 200, 650, 2.0), mira(L(91.35), LEO_LAV - 200, 646, 2.1), mira(L(91.4), LEO_LAV - 60, 600, 2.7), mira(L(94), LEO_LAV - 60, 596, 2.8)]} cara={[{ f: 0, v: "triste" }, { f: L(89.5), v: "asco" }]} habla={[[0, L(94)]]}
      poses={[{ f: 0, v: { hD: 15, cD: 30, hI: 15, cI: 30 } }, { f: L(87.9), v: { hD: 50, cD: 60, hI: 45, cI: 60 } }, { f: L(90.8), v: "manosCara" }]}
      hud={<>
        <Globo texto="And then I ruined it." x={640} y={250} desde={2} hasta={L(87.9)} cola="abajo" tam={48} />
        <Globo texto="I can't even look at her now." x={640} y={250} desde={L(88.6)} hasta={L(91.4)} cola="abajo" tam={46} />
        <Globo texto="I see her… and I feel dirty." x={640} y={250} desde={L(91.5)} hasta={L(94)} cola="abajo" tam={48} />
      </>} />
  );
};
const Chica6c: React.FC = () => {
  const f = useF();
  return (
    <TenzoLav dur={63} cara={[{ f: 0, v: "neutral" }, { f: 36, v: "feliz" }]} doblez={0.9 + 0.1 * ent(f, 0, 30)}
      poses={[{ f: 0, v: T_DOBLA_A }, { f: 14, v: { hD: 30, cD: 60, hI: 28, cI: 60, tronco: 10 } }, { f: 34, v: { hD: 10, cD: 20, hI: 10, cI: 20 } }]} />
  );
};
const Farol7a: React.FC = () => {
  // plano de los dos, cámara baja: Tenzo levanta un dedo («let me tell you»), muestra DOS dedos («two monks») y barre la mano como un río («and a river»); Leo se inclina
  const T = 96.1, L = (t: number) => fr(t, T);
  return (
    <Lav claves={[mira(0, 1530, 720, 1.7), mira(L(99.1), 1560, 716, 1.8, { curva: "in" })]} leoCara={[{ f: 0, v: "triste" }, { f: L(97.5), v: "duda" }]}
      leoPoses={[{ f: 0, v: { hD: 15, cD: 30, hI: 15, cI: 30 } }, { f: L(97.6), v: { hD: 30, cD: 50, hI: 30, cI: 50, tronco: 10, cabeza: 6 } }]}
      tenzoPoses={[{ f: 0, v: T_HABLA_A }, { f: 8, v: { hD: 150, cD: 10, hI: 10, cI: 20, cabeza: -4 } }, { f: L(97.4), v: { hD: 120, cD: 20, hI: 10, cI: 20 } }, { f: L(98.4), v: { hD: 90, cD: 0, hI: 10, cI: 20, tronco: 6 } }, { f: L(98.9), v: { hD: 70, cD: 0, hI: 10, cI: 20, tronco: 8 } }]}
      tenzoCara={[{ f: 0, v: "feliz" }]} tenzoHabla={[[0, L(99.1)]]} doblez={1}
      hud={<><Globo texto="Let me tell you about two monks… and a river." x={1100} y={200} desde={4} hasta={L(99.1)} cola="abajo" tam={44} /><Hud min={320} dia={8} /></>} />
  );
};
// el farol parpadea y el lavadero se apaga: sólo queda la llama, que se vuelve el sol de Japón
const Farol7b: React.FC = () => {
  const f = useF();
  const negro = ent(f, 24, 74), oro = ent(f, 70, 108);
  return (
    <AbsoluteFill>
      <Lav claves={[mira(0, LAV_PUNTOS.farol - 40, LP - 210, 2.2), mira(54, LAV_PUNTOS.farol, LP - 200, 2.6), mira(108, LAV_PUNTOS.farol, LP - 200, 3.3)]}
        leoCara={[{ f: 0, v: "duda" }]} tenzoPoses={[{ f: 0, v: { hD: 10, cD: 20, hI: 10, cI: 20 } }]} tenzoCara={[{ f: 0, v: "feliz" }]} doblez={1}
        farol={f > 20 && f < 30 ? 0.4 : f > 36 && f < 40 ? 0.5 : 1} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, transparent 0px, transparent 130px, rgba(0,0,0,0.92) 520px)", opacity: negro }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${ORO} 0px, ${ORO}cc ${200 + 900 * oro}px, transparent ${400 + 1300 * oro}px)`, opacity: oro }} />
    </AbsoluteFill>
  );
};

// ---------- 116-174 · la parábola ----------
const Ekido8b: React.FC = () => {
  // un gesto por voto: se tapa los OJOS («look»), la BOCA («speak»), cruza los brazos («touch»); corte al ceño en «ever»
  const T = 116, f = useF(), L = (t: number) => fr(t, T);
  const para = L(120.2);
  const x = 1200 + Math.min(f, para) * 1.2;
  const HX = x - 15, HY = 650;
  const ojos = ent(f, L(120.35), L(120.6)) * (1 - ent(f, L(121.5), L(121.75)));
  const boca = ent(f, L(121.95), L(122.2)) * (1 - ent(f, L(123.2), L(123.45)));
  const cruza = f >= L(123.7);
  const Mano: React.FC<{ dx: number; dy: number; r: number; k: number }> = ({ dx, dy, r, k }) => (
    <g transform={`translate(${HX + dx},${HY + dy + (1 - k) * 70}) rotate(${r})`} opacity={k}>
      <ellipse cx={0} cy={0} rx={24} ry={30} fill="#e2b58c" stroke="#3a2a20" strokeWidth={3} />
      {[-12, -4, 4, 12].map((xx) => <path key={xx} d={`M${xx},-20 L${xx},-34`} stroke="#3a2a20" strokeWidth={2.4} strokeLinecap="round" />)}
    </g>
  );
  const xc = 1200 + para * 1.2;
  return (
    <Escena Set={CaminoMontana} pal={PAL_ANT} claves={[mira(0, 1230, JP - 230, 2.0), mira(L(120.25), 1230 + para * 1.2, JP - 235, 2.05), mira(L(120.3), xc + 40, 650, 2.9), mira(L(124.75), xc + 30, 650, 3.0), mira(L(124.8), xc - 10, 640, 3.6), mira(L(126), xc - 10, 636, 3.7)]}
      medio={<>
        <Actor look={EKIDO} escala={ESC} seed={23} luz={L_ANT} ruta={[{ f: 0, x: 1200, y: JP }, { f: para, x: xc, y: JP }]} dir={[{ f: 0, v: 1 }]}
          poses={cruza ? [{ f: 0, v: { hD: 4, cD: 0, hI: 4, cI: 0, cabeza: 10 } }] : ojos > 0.05 || boca > 0.05 ? [{ f: 0, v: { hD: 75, cD: 150, hI: 70, cI: 150, cabeza: 10 } }] : [{ f: 0, v: { hD: 20, cD: 120, hI: 20, cI: 120, cabeza: 14 } }]}
          caras={[{ f: 0, v: "neutral" }, { f: L(119.1), v: "enojo" }]} miradas={[{ f: 0, v: { x: 0.2, y: 1 } }]} />
        {ojos > 0 && <><Mano dx={-16} dy={-14} r={-8} k={ojos} /><Mano dx={18} dy={-14} r={8} k={ojos} /></>}
        {boca > 0 && <Mano dx={2} dy={34} r={88} k={boca} />}
        {cruza && <g opacity={ent(f, L(123.7), L(123.95))} transform={`translate(${HX + 10},${HY + 125})`}>
          {[-16, 16].map((r) => <g key={r} transform={`rotate(${r})`}><rect x={-78} y={-17} width={156} height={34} rx={17} fill="#4a4a4e" stroke="#26262a" strokeWidth={3} /><circle cx={r > 0 ? 80 : -80} cy={0} r={18} fill="#e2b58c" stroke="#3a2a20" strokeWidth={3} /></g>)}
        </g>}
      </>}
      hud={<Lista x={1180} y={210} titulo="EKIDO'S VOWS · NEVER" ancho={600} items={[
        { t: "look at women", desde: L(120.4), cruz: true },
        { t: "speak to women", desde: L(122.0), cruz: true },
        { t: "touch women", desde: L(123.7), cruz: true },
        { t: "EVER.", desde: L(124.8), color: ACENTO },
      ]} />} />
  );
};
const EkidoAparta: React.FC = () => {
  // primer plano de Ekido: mira a la chica con el ceño fruncido, se da vuelta («looks away») y se TAPA LA CARA con las dos manos; corte más cerrado en «of course he does»
  const T = 141.7, f = useF(), L = (t: number) => fr(t, T);
  const tapa = ent(f, L(142.35), L(142.6));
  const HX = 645, HY = 665;
  const Mano: React.FC<{ dx: number; r: number }> = ({ dx, r }) => (
    <g transform={`translate(${HX + dx},${HY - 12 + (1 - tapa) * 60}) rotate(${r})`}>
      <ellipse cx={0} cy={0} rx={24} ry={30} fill="#e2b58c" stroke="#3a2a20" strokeWidth={3} />
      {[-12, -4, 4, 12].map((x) => <path key={x} d={`M${x},-20 L${x},-34`} stroke="#3a2a20" strokeWidth={2.4} strokeLinecap="round" />)}
    </g>
  );
  return (
    <Rio T={T} caraEkido="enojo" claves={[mira(0, ekidoX(141.7) + 60, 640, 2.9), mira(L(143.15), ekidoX(141.7) + 50, 640, 3.0), mira(L(143.2), HX - 10, 660, 3.6), mira(81, HX - 10, 656, 3.7, { curva: "in" })]}
      poseEkido={(fr0) => (fr0 < L(142.25) ? { hD: 20, cD: 120, hI: 20, cI: 120, cabeza: 4 } : { hI: 75, cI: 150, hD: 80, cD: 150, cabeza: 16, tronco: 8 })}
      extra={tapa > 0 ? <g opacity={tapa}><Mano dx={-16} r={-8} /><Mano dx={18} r={8} /></g> : null}
      hud={<ManoLeo texto="of course he does." x={960} y={110} desde={L(143.25)} centro tam={60} />} />
  );
};
const TanzanVa: React.FC = () => <Rio T={144.4} caraEkido="enojo" caraTanzan="feliz" claves={[mira(0, 860, 650, 2.1), mira(fr(147.8, 144.4), 960, 650, 2.2)]}
  poseTanzan={(f) => (f > fr(147.4, 144.4) ? { hD: 70, cD: 20, hI: 15, cI: 25, cabeza: 8 } : undefined)} />;
const Camina12b: React.FC<{ o?: number; cerca?: boolean }> = ({ o = 0, cerca }) => {
  const T = 160.3, fl = useF(), f = fl + o, L = (t: number) => fr(t, T);
  const ex = 1300 + f * 0.9;
  const rojo = ent(f, L(164.8), L(172));
  const sol = interpolate(f, [0, L(174)], [170, 520], cl);
  return (
    <Escena Set={CaminoMontana} pal={PAL_ANT} claves={cerca ? [mira(0, ex + fl * 0.9 + 40, JP - 250, 2.3)] : o > 0 ? [mira(0, ex + fl * 0.9 + 60, JP - 230, 2.0)] : [mira(0, 1500, 580, 1.15), mira(L(164.8), ex + fl * 0.9 + 140, 600, 1.5), mira(L(174), ex + fl * 0.9 + 160, 600, 1.6)]}
      medio={<>
        <Actor look={TANZAN} escala={ESC} seed={22} luz={L_ANT} ruta={[{ f: 0, x: ex + 280, y: JP }, { f: 600, x: ex + 280 + 540, y: JP }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "feliz" }]} />
        <Actor look={EKIDO} escala={ESC} seed={23} luz={L_ANT} ruta={[{ f: 0, x: ex, y: JP }, { f: 600, x: ex + 540, y: JP }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: { hD: 20, cD: 120, hI: 20, cI: 120, cabeza: 6 } }, { f: L(166.3), v: { hD: 8, cD: 150, hI: 8, cI: 150, cabeza: 16, tronco: 8 } }]} caras={[{ f: 0, v: "neutral" }, { f: L(166.3), v: "enojo" }]} />
        <Halo x={ex + fl * 0.9} y={JP - 300} r={130} color="#ff3a2a" fuerza={0.6 * rojo} />
      </>}
      hud={<>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><circle cx={1660} cy={sol} r={120} fill="#ffcf7a" opacity={0.25} /><circle cx={1660} cy={sol} r={58} fill="#ffd890" opacity={0.95} /></svg>
        <GranNumero rotulo="HOURS WALKING" claves={[{ f: -999, v: o > 0 ? 2 : 0 }, { f: L(162.3) - o, v: 1 }, { f: L(163.6) - o, v: 2 }, { f: L(172.2) - o, v: 3 }, { f: L(173.2) - o, v: 4 }].filter((k) => k.f >= -999)} x={960} y={60} color="#fff3dc" tam={110} desde={o > 0 ? -30 : L(162.1)} />
      </>} />
  );
};

// ---------- 198,7-265,3 · el lavadero: ¿quién era el puro? ----------
const LeoQuieto: React.FC = () => {
  // «very still»: la mano que gesticulaba cae a la rodilla, baja la cabeza; corte a primer plano con la mirada al piso en «still»
  const L = (t: number) => fr(t, 198.7);
  const B = { tronco: 6, pI: 80, rI: 90, pD: 85, rD: 95 };
  return (
    <Lav leo="silla" claves={[mira(0, LAV_PUNTOS.leo - 60, 660, 2.2), mira(L(200.5), LAV_PUNTOS.leo - 64, 656, 2.28), mira(L(200.55), 1160, 690, 3.4), mira(93, 1160, 688, 3.5, { curva: "in" })]}
      leoCara={[{ f: 0, v: "sorpresa" }, { f: L(199.9), v: "triste" }]} leoMira={[{ f: 0, v: { x: 1, y: 0 } }, { f: L(200.3), v: { x: 0.2, y: 1 } }]}
      leoPoses={[{ f: 0, v: { ...B, hD: 75, cD: 60, hI: 25, cI: 60 } }, { f: L(199.85), v: { ...B, hD: 75, cD: 60, hI: 25, cI: 60 } }, { f: L(200.3), v: { ...B, tronco: 12, hD: 25, cD: 110, hI: 25, cI: 110, cabeza: 22 } }]}
      doblez={1} hud={<Hud min={320} dia={8} />} />
  );
};
const TenzoLimpio: React.FC = () => {
  // plano de los dos (Leo sentado de espaldas a la izquierda): Tenzo sacude una toalla en «touched her» → CORTE a primer plano de Tenzo: mano al corazón en «heart», levanta la toalla blanca junto a la cara en «clean» y sonríe con los ojos cerrados
  const T = 201.8, L = (t: number) => fr(t, T);
  const c = L(203.95);
  const TOALLA = <g transform="rotate(-8)"><rect x={-56} y={-16} width={112} height={140} rx={8} fill="#fbfaf6" stroke="#c9c2b4" strokeWidth={3} /><path d="M-56,34 L56,34 M-56,80 L56,80" stroke="#d9d4ca" strokeWidth={4} /></g>;
  return (
    <Lav leo="silla" claves={[mira(0, 1500, 650, 1.9), mira(c - 1, 1520, 646, 2.0, { curva: "in" }), mira(c, LAV_PUNTOS.tenzo - 50, 600, 3.1), mira(L(205.8), LAV_PUNTOS.tenzo - 50, 596, 3.2, { curva: "in" })]} doblez={1}
      leoCara={[{ f: 0, v: "neutral" }]} leoMira={[{ f: 0, v: { x: 1, y: 0 } }]}
      tenzoCara={[{ f: 0, v: "neutral" }, { f: L(202.6), v: "feliz" }, { f: L(204.8), v: "sereno" }]} tenzoHabla={[[L(203.1), L(204.7)]]}
      tenzoMano={(fr0: number) => (fr0 >= L(202.1) && (fr0 < L(204.2) || fr0 >= L(204.75)) ? TOALLA : null)}
      tenzoPoses={[{ f: 0, v: { hD: 60, cD: 70, hI: 55, cI: 75, tronco: 8 } }, { f: L(202.2), v: { hD: 120, cD: 20, hI: 20, cI: 40, tronco: -2, cabeza: -6 } }, { f: L(202.6), v: { hD: 100, cD: 50, hI: 20, cI: 40 } }, { f: L(202.9), v: { hD: 125, cD: 15, hI: 20, cI: 40 } }, { f: L(203.3), v: { hD: 95, cD: 50, hI: 20, cI: 40 } },
        { f: L(204.25), v: { hD: 40, cD: 135, hI: 20, cI: 40, cabeza: 8 } }, { f: L(204.75), v: { hD: 140, cD: 40, hI: 20, cI: 40, cabeza: -6 } }]}
      hud={<><ManoLeo texto="clean." x={960} y={910} desde={L(204.8)} centro tam={66} /><Hud min={320} dia={8} /></>} />
  );
};
const Suelta15b: React.FC = () => {
  // primer plano de Tanzan con la chica ya en la orilla: la mira («saw a person»), le apoya la mano en el hombro («gave her something»), la saluda y se da vuelta («let her go»)
  const T = 205.8, L = (t: number) => fr(t, T);
  return (
    <Rio T={155.0} vel={0.75} claves={[mira(0, 2540, 650, 2.3), mira(L(209.8), 2560, 650, 2.35), mira(L(211.1), 2700, 640, 1.9, { curva: "inout" })]}
      poseTanzan={(f) => (f < L(207.6) ? { hD: 40, cD: 30, hI: 15, cI: 25, cabeza: 10 } : f < L(209.9) ? { hD: 75, cD: 10, hI: 15, cI: 25, cabeza: 6 } : { hD: 150, cD: 30, hI: 15, cI: 25, cabeza: -4 })}
      dirTanzan={(f) => (f < L(210.6) ? 1 : -1)}
      hud={<ManoLeo texto="and he let her go." x={960} y={910} desde={L(210.3)} centro tam={60} />} />
  );
};
const Carga15b: React.FC = () => {
  // «not with one finger»: levanta UN dedo; corte a contrapicado cerrado en «carried her», más encorvado bajo el fantasma
  const f = useF(), L = (t: number) => fr(t, 211.1);
  const x = 1200 + f * 1.6, c = L(214.85);
  const base = { hD: 20, cD: 120, hI: 20, cI: 120, tronco: 18, cabeza: 10 };
  return (
    <Escena Set={CaminoMontana} pal={PAL_ANT} claves={[mira(0, 1200, JP - 230, 1.9), mira(c - 1, 1200 + (c - 1) * 1.6, JP - 234, 1.95), mira(c, 1200 + c * 1.6 + 60, JP - 170, 2.4), mira(162, 1200 + 162 * 1.6 + 60, JP - 172, 2.5)]}
      medio={<EkidoCargando x={x} y={JP} dir={1} fantasma={1} caras={[{ f: 0, v: "enojo" }, { f: c, v: "cansado" }]}
        poses={[{ f: 0, v: base }, { f: L(212.95), v: base }, { f: L(213.15), v: { hD: 165, cD: 8, hI: 20, cI: 120, tronco: 10, cabeza: 2 } }, { f: L(214.0), v: { hD: 160, cD: 8, hI: 20, cI: 120, tronco: 10, cabeza: 2 } }, { f: L(214.3), v: base }, { f: c, v: { ...base, tronco: 30, cabeza: 18 } }]} />}
      hud={<Lista x={1170} y={200} titulo="EKIDO" ancho={660} tam={42} items={[{ t: "never touched her", desde: L(212.3) }, { t: "carried her 4 hours", desde: L(214.9), color: ACENTO }, { t: "on his back", desde: L(216.2), color: ACENTO }]} />} />
  );
};
// la balanza: Tanzan con las manos libres | Ekido con la chica-fantasma en la espalda
const Balanza: React.FC = () => {
  const f = useF();
  return (
    <Escena Set={CaminoMontana} pal={PAL_ANT} claves={[mira(0, 1500, 600, 1.3), mira(75, 1500, 598, 1.36, { curva: "in" })]}
      medio={<>
        <Actor look={TANZAN} escala={ESC} seed={22} luz={L_ANT} ruta={[{ f: 0, x: 1131, y: JP }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 40, cD: 30, hI: 40, cI: 30, cabeza: -4 } }]} caras={[{ f: 0, v: "feliz" }]} />
        <EkidoCargando x={1869} y={JP} dir={-1} fantasma={1} caras={[{ f: 0, v: "enojo" }]} poses={[{ f: 0, v: { hD: 20, cD: 120, hI: 20, cI: 120, tronco: 12, cabeza: 10 } }]} />
      </>}
      hud={<>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><rect x={956} y={120} width={8} height={760} rx={4} fill="#fff3dc" opacity={0.8 * ent(f, 0, 10)} /></svg>
        <Pildora texto="TANZAN · LET HER GO" x={480} y={110} desde={2} color="#fff3dc" tam={32} />
        <Pildora texto="EKIDO · STILL CARRYING HER" x={1440} y={110} desde={8} color={ACENTO} tam={32} />
        <Frase texto="Who was the pure one?" desde={fr(217.3, 216.5)} y={930} tam={72} />
      </>} />
  );
};
const LeoViejo: React.FC = () => {
  const T = 219.0, L = (t: number) => fr(t, T);
  return <LeoLav dur={78} cara={[{ f: 0, v: "neutral" }, { f: L(220.9), v: "feliz" }]} habla={[[0, L(220.9)]]} poses={[{ f: 0, v: L_HABLA_A }]}
    hud={<Globo texto="The old one." x={560} y={300} desde={4} hasta={78} cola="abajo" tam={50} />} />;
};
const TenzoCarga: React.FC = () => {
  // primer plano bajo de Tenzo: niega con el dedo («not in the body») → se agacha, levanta del piso un BOLSO de lona con correa, se lo cruza al hombro y se encorva bajo el peso («in the carrying»)
  const T = 221.6, f = useF(), L = (t: number) => fr(t, T);
  const agarra = L(223.75), carga = L(224.5);
  const k = ent(f, agarra, carga);
  const bx = 1600 + 90 * k, by = 860 - 30 * k, rot = (1 - k) * -6 + Math.sin(f / 9) * 2 * k;
  const correa = k > 0.55;
  return (
    <Lav leo="no" claves={[mira(0, LAV_PUNTOS.tenzo - 40, 660, 2.6), mira(L(223.6), LAV_PUNTOS.tenzo - 40, 662, 2.65), mira(L(223.65), LAV_PUNTOS.tenzo - 70, 720, 2.2), mira(L(225.6), LAV_PUNTOS.tenzo - 70, 716, 2.3, { curva: "in" })]} doblez={1}
      tenzoCara={[{ f: 0, v: "neutral" }, { f: L(222.0), v: "duda" }, { f: carga, v: "cansado" }]} tenzoHabla={[[0, L(223.6)], [L(224.2), L(225.4)]]}
      tenzoPoses={[{ f: 0, v: { hD: 30, cD: 40, hI: 15, cI: 30 } }, { f: L(221.9), v: { hD: 95, cD: 70, hI: 15, cI: 30, cabeza: -4 } }, { f: L(222.2), v: { hD: 95, cD: 80, hI: 15, cI: 30, cabeza: 6 } }, { f: L(222.5), v: { hD: 95, cD: 70, hI: 15, cI: 30, cabeza: -6 } }, { f: L(222.8), v: { hD: 95, cD: 80, hI: 15, cI: 30, cabeza: 6 } },
        { f: L(223.4), v: { hD: 20, cD: 30, hI: 15, cI: 30 } }, { f: agarra, v: { hD: 30, cD: 20, hI: 25, cI: 20, tronco: 30, cabeza: -10, bajar: 14 } }, { f: carga, v: { hD: 40, cD: 130, hI: 15, cI: 30, tronco: 12, cabeza: 12, bajar: 8 } }]}
      delante={f >= L(223.0) ? <g>
        {correa && <path d={`M1762,742 Q1748,790 ${bx + 52},${by - 34}`} stroke="#2f3d4d" strokeWidth={9} fill="none" strokeLinecap="round" />}
        <g transform={`translate(${bx},${by}) rotate(${rot})`}>
          <rect x={-70} y={-40} width={140} height={84} rx={22} fill="#4f6a86" stroke="#22262d" strokeWidth={4} />
          <path d="M-70,-12 Q0,6 70,-12 L70,-26 Q66,-40 50,-40 L-50,-40 Q-66,-40 -70,-26 Z" fill="#3c536b" stroke="#22262d" strokeWidth={3} />
          <rect x={-12} y={-6} width={24} height={16} rx={4} fill="#c9a86a" stroke="#22262d" strokeWidth={2} />
          <path d="M-52,-40 Q-40,-64 -20,-40 M20,-40 Q40,-64 52,-40" stroke="#2f3d4d" strokeWidth={7} fill="none" strokeLinecap="round" />
          <path d="M-58,26 L58,26" stroke="#3c536b" strokeWidth={3} strokeDasharray="8 6" />
        </g>
      </g> : null}
      hud={<><ManoLeo texto="not in the body." x={960} y={910} desde={L(222.3)} hasta={L(223.9)} centro tam={60} /><ManoLeo texto="in the carrying." x={960} y={910} desde={L(224.4)} centro tam={64} /><Hud min={320} dia={8} /></>} />
  );
};
// una persona real → una foto que se lleva encima → y se usa, y se usa
const PersonaFoto: React.FC = () => {
  const T = 225.6, f = useF(), L = (t: number) => fr(t, T);
  const p = ent(f, L(227.2), L(228.1));
  const g = ent(f, L(228.3), L(229.2));
  const X0 = 660, Y0 = 150, W = 600, H = 700;
  const s = 1 - 0.5 * g, tx = -560 * g, ty = 60 * g;
  return (
    <AbsoluteFill style={{ background: "#0b0c10" }}>
      <AbsoluteFill style={{ transform: `translate(${tx}px,${ty}px) scale(${s})` }}>
        <AbsoluteFill style={{ clipPath: `inset(${Y0 * p}px ${(1920 - X0 - W) * p}px ${(1080 - Y0 - H) * p}px ${X0 * p}px)`, filter: `saturate(${1 - 0.85 * p})` }}>
          <Parada dia={8} min={320} leoX={-5000} claves={[mira(0, MAYA_X, 590, 1.75), mira(171, MAYA_X, 586, 1.82)]}
            mayaPoses={[{ f: 0, v: POSE_LIBRO }, { f: 10, v: { ...POSE_LIBRO, cabeza: -4 } }]} mayaCara={[{ f: 0, v: "neutral" }, { f: 16, v: "risa" }, { f: L(227.6), v: "feliz" }]} />
        </AbsoluteFill>
        {p > 0 && <div style={{ position: "absolute", left: X0 - 20, top: Y0 - 20, width: W + 40, height: H + 20 + 96, border: "20px solid #f4efe4", borderBottomWidth: 96, boxSizing: "border-box", opacity: p, borderRadius: 6 }} />}
      </AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {[L(229.6), L(230.3)].map((c, k) => f > c && <g key={k} opacity={ent(f, c, c + 6)}><FotoPlana x={1060 + k * 420} y={560 + k * 30} s={0.75} rot={k ? 7 : -5} /></g>)}
      </svg>
      {f > L(229.5) && <ManoLeo texto="and use, and use." x={1050} y={240} desde={L(229.5)} tam={62} />}
      <Hud min={320} dia={8} />
    </AbsoluteFill>
  );
};
const LeoComo: React.FC = () => {
  const T = 235.6, L = (t: number) => fr(t, T);
  return <LeoLav dur={78} cara={[{ f: 0, v: "duda" }]} habla={[[0, L(237.2)]]} poses={alterna(L_HABLA_A, L_HABLA_B, 0, L(237.2), 20)}
    hud={<Globo texto="So how do I stop carrying her?" x={560} y={300} desde={2} hasta={78} cola="abajo" tam={46} />} />;
};
const TenzoReal: React.FC = () => {
  // plano de los dos: Tenzo deja la mesa, rodea y se acerca a Leo con las manos abiertas; en «picture» levanta una foto chiquita y la deja caer
  const T = 238.2, f = useF(), L = (t: number) => fr(t, T);
  const suelta = L(242.4);
  const cae = ent(f, suelta, suelta + 14);
  return (
    <Lav leo="silla" claves={[mira(0, 1500, 640, 1.65), mira(L(240.4), 1420, 650, 1.9, { curva: "inout" }), mira(L(243.1), 1410, 646, 2.0)]} doblez={1}
      tenzoRuta={[{ f: 0, x: LAV_PUNTOS.tenzo, y: LP }, { f: L(238.6), x: LAV_PUNTOS.tenzo, y: LP }, { f: L(240.2), x: 1450, y: LP }]}
      leoCara={[{ f: 0, v: "duda" }, { f: L(241.0), v: "sorpresa" }]} leoMira={[{ f: 0, v: { x: 1, y: -0.2 } }]}
      tenzoCara={[{ f: 0, v: "feliz" }]} tenzoHabla={[[0, L(243.1)]]}
      tenzoMano={(fr0: number) => (fr0 > L(240.6) && fr0 < suelta ? <g transform="scale(0.2) rotate(-90)"><FotoPlana x={0} y={0} s={1} rot={0} /></g> : null)}
      tenzoPoses={[{ f: 0, v: T_HABLA_A }, { f: L(238.8), v: { hD: 15, cD: 25, hI: 15, cI: 25 } }, { f: L(240.2), v: { hD: 60, cD: 40, hI: 55, cI: 40, tronco: 6 } }, { f: L(240.8), v: { hD: 120, cD: 20, hI: 40, cI: 40, cabeza: -6 } }, { f: suelta, v: { hD: 70, cD: 20, hI: 40, cI: 40 } }]}
      delante={f > suelta && f < suelta + 20 ? <g transform={`translate(${1395 - 30 * cae},${640 + 250 * cae}) rotate(${-20 + 200 * cae}) scale(0.2)`} opacity={1 - ent(f, suelta + 12, suelta + 20)}><FotoPlana x={0} y={0} s={1} rot={0} /></g> : null}
      hud={<>
        <Globo texto="Meet the real one." x={1380} y={230} desde={2} hasta={L(240.3)} cola="abajo" tam={50} />
        <Globo texto="She's much more interesting than the picture." x={1240} y={230} desde={L(240.4)} hasta={147} cola="abajo" tam={42} />
        <Hud min={320} dia={8} />
      </>} />
  );
};
// la foto contra la de verdad: tres «nunca» de la foto; la real bosteza, se ríe, pregunta
const FotoVsReal: React.FC = () => {
  // pantalla partida EN EL MUNDO: izquierda el cuarto oscuro de Leo con la foto clavada en la pared (todo quieto); derecha Maya de verdad en la parada (bosteza, se ríe, pregunta)
  const T = 243.1, f = useF(), L = (t: number) => fr(t, T);
  const filas = [{ t: "never has a bad day", d: L(243.5) }, { t: "never surprises you", d: L(245.4) }, { t: "never asks you anything", d: L(247.8) }];
  return (
    <AbsoluteFill style={{ background: "#0b0c10" }}>
      <AbsoluteFill style={{ clipPath: "inset(0 960px 0 0)" }}>
        <Escena Set={Cuarto} pal={PAL} claves={[mira(0, 1450, 600, 1.6)]} detras={oscuro}
          medio={<>
            <g transform="translate(1400,560)"><FotoPlana x={0} y={0} s={0.34} rot={-3} /></g>
            <LeoCama tel={false} luz={L_ANT} caras={[{ f: 0, v: "cansado" }]} poses={[{ f: 0, v: { ...SENT_CEL, hD: 20, cD: 40, cabeza: -6 } }]} />
          </>} />
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: "inset(0 0 0 964px)" }}>
        <Parada dia={8} min={320} leoX={-5000} claves={[mira(0, MAYA_X - 180, 680, 2.6), mira(204, MAYA_X - 180, 676, 2.68)]}
          mayaPoses={[{ f: 0, v: POSE_LIBRO }, { f: L(243.4), v: { ...POSE_LIBRO, hI: 40, cI: 145, cabeza: 6 } }, { f: L(244.7), v: POSE_LIBRO }, { f: L(245.5), v: { ...POSE_LIBRO, cabeza: -8, tronco: -8 } }, { f: L(246.4), v: { ...POSE_LIBRO, cabeza: -2, tronco: -2 } }, { f: L(247.0), v: { ...POSE_LIBRO, cabeza: -8, tronco: -8 } }, { f: L(247.7), v: { hD: 60, cD: 60, hI: 30, cI: 40, cabeza: -4 } }]}
          mayaCara={[{ f: 0, v: "neutral" }, { f: L(243.6), v: "cansado" }, { f: L(245.3), v: "risa" }, { f: L(247.6), v: "duda" }]} mayaHabla={[[L(247.9), L(249.5)]]}
          hud={<Globo texto="And you?" x={1560} y={260} desde={L(248.0)} hasta={L(249.9)} cola="abajo" tam={50} />} />
      </AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><rect x={958} y={0} width={6} height={1080} fill="#f4efe6" opacity={0.8} /></svg>
      <div style={{ position: "absolute", left: 300, width: 360, top: 70, padding: "8px 0", textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 44, letterSpacing: 6, color: "#c9c2b4", background: "rgba(10,12,16,.85)", borderRadius: 12 }}>THE PICTURE</div>
      <div style={{ position: "absolute", left: 1240, width: 400, top: 70, padding: "8px 0", textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 44, letterSpacing: 6, color: "#7fe0a6", background: "rgba(10,12,16,.85)", borderRadius: 12 }}>THE REAL ONE</div>
      {filas.map((r, k) => {
        const e = ent(f, r.d, r.d + 10);
        return <div key={k} style={{ position: "absolute", left: 90, top: 790 + k * 76, padding: "2px 18px", borderRadius: 12, background: "rgba(10,12,16,.75)", fontFamily: F_HUD, fontWeight: 600, fontSize: 44, color: "#f4efe6", opacity: e, transform: `translateX(${(1 - e) * -24}px)`, whiteSpace: "nowrap" }}><span style={{ color: ACENTO, marginRight: 18 }}>✕</span>{r.t}</div>;
      })}
    </AbsoluteFill>
  );
};
const TenzoRisa: React.FC = () => {
  // Tenzo se ríe con la foto en la mano → en «boring» CORTE a primer plano: BOSTEZO enorme con los brazos estirados → en «real thing» CORTE a la mesa: la deja boca abajo
  const T = 249.9, f = useF(), L = (t: number) => fr(t, T);
  const bz = L(251.95), deja = L(253.4);
  return (
    <Lav leo="no" claves={[mira(0, LAV_PUNTOS.tenzo - 90, 660, 2.6), mira(bz - 1, LAV_PUNTOS.tenzo - 95, 662, 2.7, { curva: "in" }), mira(bz, LAV_PUNTOS.tenzo - 30, 640, 3.0), mira(deja - 1, LAV_PUNTOS.tenzo - 30, 636, 3.1), mira(deja, LAV_PUNTOS.tenzo - 140, 700, 2.4), mira(147, LAV_PUNTOS.tenzo - 140, 704, 2.5, { curva: "in" })]} doblez={1}
      tenzoCara={[{ f: 0, v: "risa" }, { f: L(251.2), v: "feliz" }, { f: bz, v: "bostezo" }, { f: L(252.9), v: "cansado" }, { f: deja + 6, v: "feliz" }]} tenzoHabla={[[L(251.3), bz], [L(252.95), L(254.0)]]}
      tenzoMano={(fr0: number) => (fr0 < deja + 4 ? <g transform="scale(0.24) rotate(-90)"><FotoPlana x={0} y={0} s={1} rot={0} /></g> : null)}
      tenzoPoses={[{ f: 0, v: { hD: 40, cD: 60, hI: 40, cI: 60, tronco: -8, cabeza: -10 } }, { f: 14, v: { hD: 30, cD: 50, hI: 30, cI: 50, tronco: 2 } }, { f: 28, v: { hD: 40, cD: 60, hI: 40, cI: 60, tronco: -8, cabeza: -10 } }, { f: L(251.3), v: { hD: 95, cD: 40, hI: 20, cI: 30 } },
        { f: bz, v: { hD: 165, cD: 25, hI: 165, cI: 25, tronco: -8, cabeza: -14 } }, { f: L(252.8), v: { hD: 160, cD: 35, hI: 160, cI: 35, tronco: -6, cabeza: -12 } }, { f: L(253.0), v: { hD: 80, cD: 50, hI: 20, cI: 30 } }, { f: deja, v: { hD: 55, cD: 80, hI: 20, cI: 30, tronco: 14, cabeza: 10 } }, { f: deja + 14, v: { hD: 25, cD: 40, hI: 20, cI: 30, cabeza: 4 } }]}
      delante={f >= deja + 4 ? <g transform={`translate(${LAV_PUNTOS.mesa + 120},748)`}><path d="M-60,-12 L60,-12 L70,0 L-70,0 Z" fill="#f4efe4" stroke="#c9c2b4" strokeWidth={2} /><path d="M-48,-9 L48,-9 L54,-3 L-54,-3 Z" fill="#e2dccd" /></g> : null}
      hud={<><ManoLeo texto="Pictures are very boring" x={960} y={910} desde={L(251.3)} hasta={L(253.1)} centro tam={58} /><ManoLeo texto="when you know the real thing." x={960} y={910} desde={L(253.1)} centro tam={58} /><Hud min={320} dia={8} /></>} />
  );
};
const Mara17a: React.FC = () => {
  const T = 254.8, L = (t: number) => fr(t, T);
  return (
    <Lav leo="silla" claves={[mira(0, LAV_PUNTOS.leo - 260, 560, 1.45), mira(L(259.9), LAV_PUNTOS.leo - 270, 545, 1.6)]} leoCara={[{ f: 0, v: "triste" }]} tenzoCara={[{ f: 0, v: "feliz" }]} doblez={1}
      mara={<MaraLav esc={1.4} caras={[{ f: 0, v: "risa" }, { f: L(257.7), v: "picaro" }]} pose={{ hD: 80, cD: 40, hI: 60, cI: 50, cabeza: -10, tronco: -8 }} />}
      hud={<>
        <ManoMara texto="the real one?" x={1250} y={420} desde={L(257.7)} hasta={L(258.6)} tam={66} />
        <ManoMara texto="she'll never want you." x={1250} y={420} desde={L(258.6)} tam={66} />
        <Hud min={320} dia={8} />
      </>} />
  );
};
const Mara17b: React.FC = () => {
  // INSERTO del cuarto de Leo: la sombra señala el colchón en el piso y la mochila de reparto («a delivery guy who lives on a mattress»)
  const f = useF();
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, 1230, 700, 1.4), mira(75, 1210, 706, 1.5, { curva: "in" })]} setProps={{ lampara: true }}
      medio={<>
        <g transform={`translate(${CTO_PUNTOS.bolso - 120},${CP - 262})`}><BolsoRopa s={2.4} /></g>
        <Actor look={MARA} escala={ESC * 1.25} seed={5} ruta={[{ f: 0, x: 940, y: CP - 20 }]} dir={[{ f: 0, v: 1 }]} opacidad={() => 0.93}
          poses={[{ f: 0, v: { hD: 95, cD: 0, hI: 30, cI: 60, tronco: -6 } }, { f: 30, v: { hD: 95, cD: 0, hI: 120, cI: 30, tronco: -10, cabeza: -8 } }]} caras={[{ f: 0, v: "picaro" }, { f: 28, v: "risa" }]} />
      </>}
      hud={<>
        <ManoMara texto="a delivery guy" x={960} y={880} desde={2} hasta={26} centro tam={64} />
        <ManoMara texto="who lives on a mattress." x={960} y={880} desde={27} centro tam={64} />
        <Hud min={320} dia={8} />
      </>} />
  );
};
const Mara17c: React.FC = () => {
  // la sombra le abre un abanico de fotos delante de la cara a Leo (sentado); él baja la vista
  const T = 262.4, f = useF(), L = (t: number) => fr(t, T);
  const abre = ent(f, 4, 22);
  return (
    <Lav leo="silla" claves={[mira(0, LAV_PUNTOS.leo - 110, 640, 1.95), mira(87, LAV_PUNTOS.leo - 120, 636, 2.05, { curva: "in" })]} leoCara={[{ f: 0, v: "triste" }, { f: L(263.8), v: "cansado" }]} doblez={1}
      leoMira={[{ f: 0, v: { x: -1, y: 0 } }, { f: L(263.8), v: { x: -0.4, y: 0.9 } }]}
      mara={<MaraLav esc={1.35} x={LAV_PUNTOS.leo - 260} caras={[{ f: 0, v: "feliz" }, { f: 30, v: "risa" }]} pose={{ hD: 100, cD: 20, hI: 60, cI: 50, cabeza: -6, tronco: -4 }} />}
      delante={<g opacity={abre}>{[-2, -1, 0, 1, 2].map((k) => <g key={k} transform={`translate(${LAV_PUNTOS.leo - 120 + k * 26 * abre},${600 + Math.abs(k) * 6}) rotate(${k * 14 * abre}) scale(0.2)`}><FotoPlana x={0} y={0} s={1} rot={0} /></g>)}</g>}
      hud={<>
        <ManoMara texto="stay with the pictures." x={960} y={900} desde={2} hasta={L(263.6)} centro tam={64} />
        <ManoMara texto="they never say no." x={960} y={900} desde={L(263.6)} centro tam={64} />
        <Hud min={320} dia={8} />
      </>} />
  );
};
// ---------- 272,8-326 · DAY 9: el libro, el «stop», la presentación ----------
const Libro18a: React.FC = () => (
  // contraplano SOBRE EL HOMBRO de Leo (su espalda entra por la izquierda): Maya lee y da vuelta la hoja
  <Parada dia={9} min={0} claves={[mira(0, MAYA_X + 40, 650, 2.7), mira(42, MAYA_X + 40, 646, 2.8, { curva: "in" })]}
    leoPoses={[{ f: 0, v: BOLSILLOS }]} leoCara={[{ f: 0, v: "miedo" }]}
    mayaPoses={[{ f: 0, v: POSE_LIBRO }, { f: 14, v: { ...POSE_LIBRO, hI: 80, cI: 70, cabeza: 24 } }, { f: 24, v: { ...POSE_LIBRO, hI: 30, cI: 110, cabeza: 22 } }, { f: 34, v: POSE_LIBRO }]}
    mayaCara={[{ f: 0, v: "neutral" }, { f: 26, v: "feliz" }]} />
);
const Stop18b: React.FC = () => {
  const T = 287.4, L = (t: number) => fr(t, T);
  return (
    <LeoP dur={120} cara={[{ f: 0, v: "cansado" }, { f: L(289.5), v: "determinado" }]} poses={[{ f: 0, v: BOLSILLOS }, { f: L(289.4), v: { ...BOLSILLOS, cabeza: -6, tronco: -3 } }]}
      hud={<>
        <ManoLeo texto="Stop." x={120} y={250} desde={L(289.5)} tam={92} />
        <ManoLeo texto="Where am I going?" x={120} y={370} desde={L(290.1)} tam={64} />
      </>} />
  );
};
const Habla19a: React.FC = () => {
  // de perfil, plano medio de los dos: Leo saca las manos, da un paso hacia ella y señala el libro en «book?»
  const T = 291.4, L = (t: number) => fr(t, T);
  return (
    <Parada dia={9} min={0} claves={[mira(0, BWY_PUNTOS.parada36 - 20, 680, 1.9), mira(L(293.5), BWY_PUNTOS.parada36 + 10, 690, 2.0), mira(L(295.4), BWY_PUNTOS.parada36 + 20, 694, 2.15, { curva: "in" })]}
      leoRuta={[{ f: 0, x: LEO_PARADA, y: BP }, { f: L(292.0), x: LEO_PARADA, y: BP }, { f: L(293.2), x: LEO_PARADA + 80, y: BP }]}
      leoCara={[{ f: 0, v: "determinado" }, { f: L(292.4), v: "feliz" }]} leoHabla={[[L(292.4), L(295.1)]]}
      leoPoses={[{ f: 0, v: BOLSILLOS }, { f: L(292.0), v: { hD: 20, cD: 40, hI: -10, cI: 20, tronco: 4 } }, { f: L(294.3), v: { hD: 80, cD: 10, hI: -10, cI: 20, tronco: 6 } }]}
      mayaPoses={[{ f: 0, v: POSE_LIBRO }]} mayaCara={[{ f: 0, v: "neutral" }]}
      hud={<Globo texto="Is it good? The book?" x={760} y={240} desde={L(292.4)} hasta={L(295.4)} cola="abajo" tam={50} />} />
  );
};
const Habla19b: React.FC = () => {
  // primer plano de Maya SOLA: levanta la vista, baja el libro, parpadea y se ríe (se dobla, mano a la boca)
  const T = 295.4, L = (t: number) => fr(t, T);
  return (
    <Parada dia={9} min={0} claves={[mira(0, MAYA_X - 10, 660, 3.0), mira(L(299.3), MAYA_X - 10, 654, 3.1, { curva: "in" })]}
      mayaPoses={[{ f: 0, v: POSE_LIBRO }, { f: L(295.8), v: { ...POSE_LIBRO, cabeza: -6 } }, { f: L(296.4), v: { hD: 25, cD: 70, hI: 20, cI: 40, cabeza: -4 } }, { f: L(297.6), v: { hD: 25, cD: 70, hI: 70, cI: 140, cabeza: -12, tronco: -10 } }, { f: L(298.1), v: { hD: 25, cD: 70, hI: 70, cI: 140, cabeza: 4, tronco: 6 } }, { f: L(298.5), v: { hD: 25, cD: 70, hI: 60, cI: 130, cabeza: -10, tronco: -8 } }, { f: L(299.0), v: { hD: 25, cD: 70, hI: 40, cI: 90, cabeza: -2 } }]}
      mayaCara={[{ f: 0, v: "neutral" }, { f: L(296.0), v: "sorpresa" }, { f: L(297.6), v: "risa" }]}
      mayaMira={[{ f: 0, v: { x: 0, y: 0.9 } }, { f: L(295.8), v: { x: -1, y: 0 } }]} />
  );
};
const Monja19a: React.FC = () => {
  // plano medio de perfil, cámara baja: Maya le extiende el libro a Leo; él se inclina a mirar la tapa
  const T = 299.3, L = (t: number) => fr(t, T);
  return (
    <Parada dia={9} min={0} claves={[mira(0, BWY_PUNTOS.parada36 + 40, 720, 2.0), mira(96, BWY_PUNTOS.parada36 + 20, 716, 2.1, { curva: "in" })]}
      leoX={LEO_PARADA + 80} leoMira={[{ f: 0, v: { x: 1, y: 0 } }, { f: L(300.7), v: { x: 1, y: 0.5 } }]}
      leoPoses={[{ f: 0, v: { hD: 20, cD: 40, hI: -10, cI: 20 } }, { f: L(300.7), v: { hD: 25, cD: 60, hI: -10, cI: 20, tronco: 12, cabeza: 10 } }]} leoCara={[{ f: 0, v: "feliz" }, { f: L(301.2), v: "sorpresa" }]}
      mayaPoses={[{ f: 0, v: { hD: 25, cD: 70, hI: 40, cI: 90, cabeza: -4 } }, { f: L(300.4), v: { hD: 95, cD: 15, hI: 40, cI: 80, cabeza: -6 } }, { f: L(301.9), v: { hD: 88, cD: 30, hI: 60, cI: 40, cabeza: 2 } }]}
      mayaCara={[{ f: 0, v: "sorpresa" }, { f: L(300.9), v: "feliz" }]} mayaHabla={[[L(300.9), L(302.5)]]}
      hud={<Globo texto="It's weird, actually." x={1240} y={240} desde={L(300.9)} hasta={96} cola="abajo" tam={50} />} />
  );
};
// los poemas de una monja, hace dos mil años, en la India (inserto de recuerdo: escribe en hoja de palma)
const Monja19b: React.FC = () => {
  // a pantalla llena en Vaishali: la monja vieja ESCRIBE en la hoja de palma; corte a su cara en «nun»; el rótulo entra en «India»
  const T = 302.5, f = useF(), L = (t: number) => fr(t, T);
  const c = L(303.7), X = VAI_PUNTOS.jardin;
  return (
    <Escena Set={Vaishali} pal={PAL_ANT} setProps={{ monjes: false }} claves={[mira(0, X + 60, 720, 2.0), mira(c - 1, X + 64, 716, 2.08), mira(c, X + 40, 660, 3.0), mira(126, X + 44, 656, 3.1, { curva: "in" })]}
      medio={<Actor look={AMRAPALI_VIEJA} escala={ESC} seed={31} luz={L_ANT} ruta={[{ f: 0, x: X, y: 900 }]} dir={[{ f: 0, v: 1 }]}
        poses={alterna({ hD: 70, cD: 100, hI: 50, cI: 90, cabeza: 22 }, { hD: 60, cD: 118, hI: 50, cI: 90, cabeza: 24 }, 0, 126, 6)} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.6, y: 0.9 } }]}
        enManoI={<rect x={-60} y={-14} width={150} height={30} rx={6} fill="#c9a86a" stroke="#7a5a2a" strokeWidth={3} />}
        enManoD={<path d="M0,0 L-6,-56" stroke="#5a3a1a" strokeWidth={6} strokeLinecap="round" />} />}
      hud={<><Pildora texto="POEMS BY A NUN · INDIA · 2,000 YEARS AGO" x={960} y={110} desde={L(305.9)} color="#ffd890" tam={36} /><Hud min={0} dia={9} /></>} />
  );
};
// el corazón de Leo se detiene un segundo (la línea del pulso se aplana y vuelve)
const Corazon19: React.FC = () => {
  const f = useF();
  const plano = f > 12 && f < 46;
  const pts = Array.from({ length: 120 }, (_, i) => {
    const x = 160 + i * 13.4;
    const fase = (i * 13.4 - f * 22) % 400;
    const pico = !plano && Math.abs(fase) < 30 ? (fase < 0 ? -1 : 1) * (30 - Math.abs(fase)) * 7 * (fase < 0 ? 1 : -0.5) : 0;
    return `${x},${930 - pico}`;
  });
  return (
    <LeoP dur={63} z={2.5} cara={[{ f: 0, v: "sorpresa" }]} poses={[{ f: 0, v: BOLSILLOS }]}
      hud={<svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <rect x={130} y={840} width={1660} height={180} rx={24} fill="rgba(10,12,16,0.6)" />
        <polyline points={pts.join(" ")} fill="none" stroke={plano ? "#f4efe6" : ACENTO} strokeWidth={6} strokeLinejoin="round" />
      </svg>} />
  );
};
const Amrapali19b: React.FC = () => {
  // plano medio cerrado de los dos: Leo se inclina hacia ella, manos abiertas; Maya se congela y baja el libro
  const T = 308.8, L = (t: number) => fr(t, T);
  return (
    <Parada dia={9} min={0} claves={[mira(0, BWY_PUNTOS.parada36 - 60, 650, 2.2), mira(81, BWY_PUNTOS.parada36 - 40, 646, 2.3, { curva: "in" })]}
      leoX={LEO_PARADA + 70} leoCara={[{ f: 0, v: "duda" }]} leoHabla={[[0, L(311.2)]]}
      leoPoses={[{ f: 0, v: { hD: 20, cD: 40, hI: -10, cI: 20 } }, { f: 8, v: { hD: 55, cD: 50, hI: 50, cI: 50, tronco: 12, cabeza: -4 } }, { f: L(309.6), v: { hD: 60, cD: 40, hI: 55, cI: 40, tronco: 14, cabeza: -8 } }]}
      mayaPoses={[{ f: 0, v: { hD: 90, cD: 35, hI: 60, cI: 40 } }, { f: L(309.7), v: { hD: 20, cD: 60, hI: 15, cI: 40, tronco: -4 } }]}
      mayaCara={[{ f: 0, v: "feliz" }, { f: L(309.7), v: "sorpresa" }]}
      hud={<Globo texto="Was her name Amrapali?" x={660} y={250} desde={2} hasta={81} cola="abajo" tam={50} />} />
  );
};
const MayaMira19: React.FC = () => {
  // baja el libro y se le queda mirando («stares»), entrecierra los ojos; corte a su cara con la cabeza ladeada en «How do you know that?»
  const T = 311.5, L = (t: number) => fr(t, T);
  const c = L(312.9);
  return (
    <Parada dia={9} min={0} claves={[mira(0, MAYA_X + 140, 700, 2.3), mira(c - 1, MAYA_X + 140, 696, 2.38), mira(c, MAYA_X + 70, 690, 3.6), mira(87, MAYA_X + 72, 688, 3.7, { curva: "in" })]}
      mayaPoses={[{ f: 0, v: { ...POSE_LIBRO, cabeza: -6 } }, { f: 16, v: { hD: 20, cD: 80, hI: 20, cI: 80, cabeza: -6 } }, { f: c, v: { hD: 20, cD: 80, hI: 20, cI: 80, cabeza: -16 } }]}
      mayaCara={[{ f: 0, v: "sorpresa" }, { f: L(312.3), v: "duda" }]} mayaHabla={[[L(313.1), 87]]}
      hud={<Globo texto="How do you know that?" x={1440} y={260} desde={L(313.1)} hasta={87} cola="abajo" tam={50} />} />
  );
};
const Monje19b: React.FC = () => {
  // Leo sobre el hombro de Maya, se encoge de hombros; en «laundromat» RECUERDO de Tenzo doblando con el farol
  const T = 314.4, f = useF(), L = (t: number) => fr(t, T);
  const c = L(316.1);
  return (
    <AbsoluteFill>
      <Parada dia={9} min={0} claves={[mira(0, LEO_PARADA - 10, 650, 2.5), mira(c, LEO_PARADA - 10, 646, 2.6, { curva: "in" })]}
        leoX={LEO_PARADA + 70} leoCara={[{ f: 0, v: "neutral" }, { f: 20, v: "feliz" }]} leoHabla={[[0, 106]]}
        leoPoses={[{ f: 0, v: { hD: 20, cD: 40, hI: -10, cI: 20 } }, { f: 10, v: { hD: 50, cD: 60, hI: 50, cI: 60, tronco: 4 } }, { f: 26, v: { hD: 30, cD: 90, hI: 30, cI: 90, cabeza: -8, tronco: -4 } }, { f: 44, v: { hD: 60, cD: 40, hI: -10, cI: 20 } }]}
        mayaPoses={[{ f: 0, v: { hD: 20, cD: 60, hI: 15, cI: 40 } }]} mayaCara={[{ f: 0, v: "sorpresa" }]}
        hud={<Globo texto="An old monk told me about her." x={560} y={240} desde={2} hasta={c + 10} cola="abajo" tam={46} />} />
      {f >= c && (
        <AbsoluteFill style={{ background: "rgba(8,9,12,0.55)" }}>
          <Recuerdo desde={c}>
            <Lav leo="no" claves={[mira(0, LAV_PUNTOS.tenzo - 120, 640, 1.9)]} doblez={0.4 + 0.5 * ent(f, c, c + 50)} tenzoCara={[{ f: 0, v: "feliz" }]}
              tenzoPoses={alterna({ hD: 60, cD: 70, hI: 55, cI: 75, tronco: 8 }, { hD: 75, cD: 50, hI: 70, cI: 55, tronco: 10 }, 0, 120, 14)} />
          </Recuerdo>
          <Globo texto="In a laundromat." x={960} y={900} desde={c + 2} hasta={9999} cola="abajo" tam={52} />
        </AbsoluteFill>
      )}
      <Hud min={0} dia={9} />
    </AbsoluteFill>
  );
};
const Risa19: React.FC = () => {
  // 3 planos: dos (Maya se ríe tapándose con el libro) → Leo se rasca la cabeza, avergonzado → Maya baja el libro y sonríe («but she is smiling»)
  const L = (t: number) => fr(t, 318.1);
  const c1 = L(320.0), c2 = L(322.2);
  const P = BWY_PUNTOS.parada36;
  return (
    <Parada dia={9} min={0} claves={[mira(0, P, 680, 2.0), mira(c1 - 1, P, 676, 2.06), mira(c1, LEO_PARADA + 60, 700, 3.0), mira(c2 - 1, LEO_PARADA + 64, 696, 3.08), mira(c2, MAYA_X + 60, 720, 3.4), mira(177, MAYA_X + 64, 716, 3.5, { curva: "in" })]}
      leoCara={[{ f: 0, v: "duda" }, { f: L(321.3), v: "feliz" }]} leoPoses={[{ f: 0, v: BOLSILLOS }, { f: L(321.1), v: BOLSILLOS }, { f: L(321.35), v: { hD: 165, cD: 150, hI: -20, cI: -40, cabeza: 8 } }]}
      mayaPoses={[{ f: 0, v: { ...POSE_LIBRO, cabeza: -10, tronco: -8 } }, { f: 16, v: { ...POSE_LIBRO, cabeza: -2 } }, { f: 30, v: { ...POSE_LIBRO, cabeza: -10, tronco: -8 } }, { f: 50, v: { ...POSE_LIBRO, cabeza: -2 } }, { f: c2, v: { hD: 20, cD: 80, hI: 20, cI: 80, cabeza: -4 } }]}
      mayaCara={[{ f: 0, v: "risa" }, { f: c2, v: "feliz" }]} mayaHabla={[[10, c2 - 4]]}
      hud={<>
        <Globo texto="Okay, that's the strangest thing" x={1240} y={240} desde={10} hasta={90} cola="abajo" tam={42} />
        <Globo texto="anyone has ever said to me at a bus stop." x={1440} y={250} desde={91} hasta={177} cola="abajo" tam={42} />
      </>} />
  );
};
const Mano19b: React.FC = () => {
  // plano medio cerrado: los dos dan un paso y se dan la mano (dos sacudidas) en «I'm Maya. — Leo.»
  const T = 324.0, f = useF(), L = (t: number) => fr(t, T);
  const sac = f > 14 ? Math.sin((f - 14) / 3) * 8 : 0;
  const P36 = BWY_PUNTOS.parada36;
  return (
    <Parada dia={9} min={0} claves={[mira(0, P36, 690, 2.3), mira(57, P36, 684, 2.4, { curva: "in" })]}
      leoRuta={[{ f: 0, x: LEO_PARADA + 40, y: BP }, { f: 12, x: P36 - 105, y: BP }]} mayaRuta={[{ f: 0, x: MAYA_X - 30, y: BP }, { f: 12, x: P36 + 105, y: BP }]} libro={false}
      leoCara={[{ f: 0, v: "feliz" }]} leoHabla={[[L(325.3), L(325.9)]]} leoPoses={[{ f: 0, v: { hD: 30, cD: 30, hI: -10, cI: 20 } }, { f: 12, v: { hD: 80 + sac, cD: 8, hI: -10, cI: 20, tronco: 4 } }]}
      mayaPoses={[{ f: 0, v: { hD: 20, cD: 60, hI: 30, cI: 30 } }, { f: 12, v: { hD: 80 - sac, cD: 8, hI: 15, cI: 30, tronco: 4 } }]} mayaCara={[{ f: 0, v: "feliz" }, { f: 30, v: "risa" }]} mayaHabla={[[0, L(325.3)]]}
      hud={<>
        <Globo texto="I'm Maya." x={1300} y={240} desde={0} hasta={L(325.3)} cola="abajo" tam={50} />
        <Globo texto="Leo." x={640} y={240} desde={L(325.3)} hasta={57} cola="abajo" tam={50} />
      </>} />
  );
};
// ---------- 325,9-359,8 · el 36: once paradas, el poema, 1 h 50 m ----------
// la línea de las once paradas (arriba al centro): cada parada se enciende al pasar
const Paradas11: React.FC<{ t0: number }> = ({ t0 }) => {
  const f = useF();
  const t = t0 + f / 30;
  const n = Math.max(0, Math.min(11, Math.floor(interpolate(t, [329.2, 347.5], [0, 11], cl) + 0.0001)));
  return (
    <div style={{ position: "absolute", left: 960 - 420, top: 40, width: 840, height: 90, borderRadius: 20, background: "rgba(10,12,16,0.62)", fontFamily: F_HUD }}>
      <svg width={840} height={90} style={{ position: "absolute", inset: 0 }}>
        <rect x={60} y={52} width={720} height={6} rx={3} fill="#4a505b" />
        {Array.from({ length: 11 }).map((_, k) => <circle key={k} cx={60 + k * 72} cy={55} r={k < n ? 13 : 10} fill={k < n ? "#3f9a6a" : "#22262d"} stroke="#f4efe6" strokeWidth={3} />)}
      </svg>
      <div style={{ position: "absolute", top: 4, width: "100%", textAlign: "center", fontSize: 26, letterSpacing: 4, color: "#f4efe6" }}>{n < 11 ? `STOP ${Math.max(1, n)} OF 11` : "LAWRENCE · STOP 11"}</div>
    </div>
  );
};
const Bus20a: React.FC = () => {
  // «the bus comes. They sit next to each other»: Maya entra por el pasillo y SE SIENTA junto a Leo, que la mira y sonríe
  const L = (t: number) => fr(t, 325.9);
  const s = L(327.45);
  return (
    <Bus claves={[mira(0, 1560, 620, 1.8), mira(99, 1490, 616, 1.92, { curva: "inout" })]}
      mayaRuta={[{ f: 0, x: 2140, y: KP }, { f: s, x: COLECTIVO.asientoMaya, y: KP }]} mayaAsiento={[{ f: 0, v: undefined }, { f: s, v: undefined }, { f: s + 6, v: COLECTIVO.asiento }]}
      mayaPoses={[{ f: 0, v: { hD: 15, cD: 30, hI: 15, cI: 30 } }, { f: s, v: { hD: 15, cD: 30, hI: 15, cI: 30 } }, { f: s + 6, v: { tronco: 4, pI: 80, rI: 90, pD: 85, rD: 95, ...POSE_LIBRO } }]}
      leoCara={[{ f: 0, v: "neutral" }, { f: s + 6, v: "feliz" }]} leoMira={[{ f: 0, v: { x: 1, y: 0 } }]}
      hud={<><Paradas11 t0={325.9} /><Hud min={0} dia={9} /></>} />
  );
};
const Bus20b: React.FC = () => {
  // Maya sola con el libro abierto → en «two-thousand-year-old woman» se abre el RECUERDO: Amrapali joven en Vaishali
  const T = 329.2, f = useF(), L = (t: number) => fr(t, T);
  const c = L(331.1);
  const JOVEN = { ...AMRAPALI_VIEJA, ceja: "#2a1a12", accesorios: [{ t: "pelo" as const, forma: "bob" as const, color: "#17100d" }, { t: "tunica" as const, color: "#e9dcc4", largo: 1 }], alto: 1 };
  return (
    <AbsoluteFill>
      <Bus claves={[mira(0, COLECTIVO.asientoMaya - 40, 640, 2.0), mira(114, COLECTIVO.asientoMaya - 40, 636, 2.1, { curva: "in" })]} mayaHabla={[[0, 114]]} mayaCara={[{ f: 0, v: "feliz" }, { f: 50, v: "risa" }, { f: 80, v: "feliz" }]}
        mayaPoses={alterna({ tronco: 4, pI: 80, rI: 90, pD: 85, rD: 95, ...POSE_LIBRO }, { tronco: 4, pI: 80, rI: 90, pD: 85, rD: 95, hD: 50, cD: 100, hI: 80, cI: 40, cabeza: 6 }, 0, 114, 30)}
        hud={<><Paradas11 t0={329.2} /><Hud min={0} dia={9} /></>} />
      {f >= c && (
        <AbsoluteFill style={{ background: "rgba(8,9,12,0.5)" }}>
          <Recuerdo desde={c}>
            <Escena Set={Vaishali} pal={PAL_ANT} setProps={{ monjes: false }} claves={[mira(0, VAI_PUNTOS.jardin + 40, 660, 1.9), mira(60, VAI_PUNTOS.jardin + 40, 656, 2.0)]}
              medio={<Actor look={JOVEN as typeof AMRAPALI_VIEJA} escala={ESC} seed={31} luz={L_ANT} ruta={[{ f: 0, x: VAI_PUNTOS.jardin, y: 900 }]} dir={[{ f: 0, v: 1 }]}
                poses={[{ f: 0, v: { hD: 70, cD: 120, hI: 10, cI: 20, cabeza: -6 } }, { f: c + 30, v: { hD: 140, cD: 30, hI: 10, cI: 20, cabeza: -10 } }]} caras={[{ f: 0, v: "feliz" }]} />} />
          </Recuerdo>
          <Pildora texto="AMRAPALI · INDIA · 2,000 YEARS AGO" x={960} y={900} desde={c + 4} color="#ffd890" tam={36} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
const Bus20c: React.FC = () => (
  <Bus claves={[mira(0, COLECTIVO.asientoLeo + 40, 640, 1.9), mira(45, COLECTIVO.asientoLeo + 40, 636, 2.0, { curva: "in" })]} leoHabla={[[0, 42]]} leoCara={[{ f: 0, v: "risa" }]}
    hud={<><Paradas11 t0={333.0} /><Hud min={0} dia={9} /></>} />
);
const Bus20d: React.FC = () => {
  // INSERTO del libro abierto entre los dos (la monja vieja dibujada + los versos, el dedo de Maya recorre el renglón) → en «getting old» se abre a los dos: Leo se inclina sorprendido
  const T = 334.5, f = useF(), L = (t: number) => fr(t, T);
  const c = L(336.3);
  const BX = 1440, BY = 690;
  const dedo = interpolate(f, [4, c], [0, 1], cl);
  return (
    <Bus sinLibro claves={[mira(0, BX, BY - 6, 4.4), mira(c - 1, BX + 4, BY - 8, 4.6, { curva: "in" }), mira(c, 1440, 600, 2.5), mira(93, 1440, 596, 2.6, { curva: "in" })]}
      mayaHabla={[[c, 93]]} mayaCara={[{ f: 0, v: "feliz" }, { f: c + 10, v: "risa" }]} leoCara={[{ f: 0, v: "feliz" }, { f: c, v: "sorpresa" }]}
      leoPoses={[{ f: 0, v: { tronco: 14, pI: 80, rI: 90, pD: 85, rD: 95, hD: 25, cD: 60, hI: 20, cI: 50, cabeza: 12 } }]} leoMira={[{ f: 0, v: { x: 1, y: 0.7 } }, { f: c, v: { x: 1, y: 0 } }]}
      mayaPoses={[{ f: 0, v: { tronco: 4, pI: 80, rI: 90, pD: 85, rD: 95, hD: 60, cD: 60, hI: 55, cI: 70, cabeza: 10 } }]}
      delante={<g transform={`translate(${BX},${BY})`}>
        <path d="M0,-44 L-74,-50 L-78,40 L0,46 Z" fill="#f6f1e4" stroke="#2e5a8a" strokeWidth={3} />
        <path d="M0,-44 L74,-50 L78,40 L0,46 Z" fill="#f2ecdd" stroke="#2e5a8a" strokeWidth={3} />
        <line x1={0} y1={-44} x2={0} y2={46} stroke="#c9c2b4" strokeWidth={2} />
        <g transform="translate(-38,-2)">
          <ellipse cx={0} cy={-14} rx={11} ry={12} fill="#e8d2b4" stroke="#5a4a3a" strokeWidth={1.4} />
          <path d="M-12,-14 C-13,-30 13,-30 12,-14 C9,-22 -9,-22 -12,-14 Z" fill="#f2efe8" stroke="#8a8478" strokeWidth={1} />
          <path d="M-5,-12 L-3,-12 M3,-12 L5,-12 M-4,-6 Q0,-4 4,-6" stroke="#5a4a3a" strokeWidth={1.2} />
          <path d="M-18,30 C-18,6 18,6 18,30 Z" fill="#e9dcc4" stroke="#8a7a62" strokeWidth={1.2} />
        </g>
        {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={10} y={-30 + k * 13} width={k === 4 ? 36 : 56} height={3.2} rx={1.5} fill={k === 1 ? "#2e5a8a" : "#9a9384"} />)}
        <text x={-38} y={-34} fontSize={7} textAnchor="middle" fill="#8a7a62" fontFamily="serif" fontStyle="italic">Therigatha</text>
        {f < c && <g transform={`translate(${14 + 50 * dedo},${-20})`}><ellipse cx={0} cy={0} rx={6} ry={4} fill="#c98e62" stroke="#5a3a2a" strokeWidth={1} /><rect x={-2} y={2} width={22} height={9} rx={4} fill="#c98e62" stroke="#5a3a2a" strokeWidth={1} /></g>}
      </g>}
      hud={<><Paradas11 t0={334.5} /><ManoLeo texto="poems about getting old." x={960} y={910} desde={c} centro tam={60} /><Hud min={0} dia={9} /></>} />
  );
};
// el poema: «her hair, once black like bees, now white like hemp» — el pelo se vuelve blanco al decirlo
const Poema20b: React.FC = () => {
  // más cerca: la joven se toca el pelo negro («her hair»), le zumban abejas («like bees»), corte al primer plano de la vieja de pelo blanco («now white»)
  const T = 337.6, f = useF(), L = (t: number) => fr(t, T);
  const vieja = ent(f, L(341.3), L(342.0));
  const c = L(341.45), X = VAI_PUNTOS.jardin;
  const abejas = ent(f, L(340.5), L(340.9)) * (1 - ent(f, L(341.4), L(341.7)));
  const JOVEN = { ...AMRAPALI_VIEJA, ceja: "#2a1a12", accesorios: [{ t: "pelo" as const, forma: "bob" as const, color: "#17100d" }, { t: "tunica" as const, color: "#e9dcc4", largo: 1 }], alto: 1 };
  const pelo = f >= L(339.3) ? { hD: 150, cD: 140, hI: 10, cI: 20 } : { hD: 70, cD: 120, hI: 10, cI: 20 };
  return (
    <Escena Set={Vaishali} pal={PAL_ANT} setProps={{ monjes: false }} claves={[mira(0, X + 220, 690, 2.0), mira(c - 1, X + 230, 686, 2.1), mira(c, X + 130, 700, 2.8), mira(L(343.3), X + 134, 696, 2.9, { curva: "in" })]}
      medio={<>
        <Actor look={JOVEN as typeof AMRAPALI_VIEJA} escala={ESC} seed={31} luz={L_ANT} ruta={[{ f: 0, x: X, y: 900 }]} dir={[{ f: 0, v: 1 }]} opacidad={() => 1 - vieja}
          poses={[{ f: 0, v: { ...pelo, cabeza: -6 } }]} caras={[{ f: 0, v: "feliz" }]} />
        <Actor look={AMRAPALI_VIEJA} escala={ESC} seed={31} luz={L_ANT} ruta={[{ f: 0, x: X, y: 900 }]} dir={[{ f: 0, v: 1 }]} opacidad={() => vieja}
          poses={[{ f: 0, v: { ...pelo, cabeza: 8 } }]} caras={[{ f: 0, v: "neutral" }, { f: L(342.4), v: "feliz" }]} />
        {abejas > 0 && Array.from({ length: 6 }).map((_, i) => {
          const a = f / 5 + i * 1.05;
          const bx = X + Math.cos(a) * 110, by = 600 + Math.sin(a * 1.3) * 50;
          return <g key={i} opacity={abejas} transform={`translate(${bx},${by})`}><ellipse rx={11} ry={7} fill="#e0b040" stroke="#2a1a10" strokeWidth={2} /><path d="M-3,-6 L-3,6 M3,-6 L3,6" stroke="#2a1a10" strokeWidth={2.5} /><ellipse cx={-2} cy={-9} rx={7} ry={4} fill="#f4f0ff" opacity={0.8} /></g>;
        })}
      </>}
      hud={<>
        <div style={{ position: "absolute", left: 1010, top: 160, width: 840, height: 400, borderRadius: 26, background: "rgba(10,12,16,.62)", opacity: ent(f, L(339.0), L(339.4)) }} />
        <ManoLeo texto="her hair," x={1060} y={250} desde={L(339.3)} tam={62} />
        <ManoLeo texto="once black like bees," x={1060} y={340} desde={L(339.9)} tam={62} />
        <ManoLeo texto="now white like hemp." x={1060} y={480} desde={L(341.4)} tam={62} />
      </>} />
  );
};
const Bolsillo20b: React.FC = () => {
  // Leo riéndose (plano medio) → INSERTO del bolsillo: el celular asoma y vibra, la mano de Leo NI lo toca → contador 0
  const T = 343.3, f = useF(), L = (t: number) => fr(t, T);
  const c = L(345.3);
  const vib = f > c + 6 && f < c + 40 ? Math.sin(f * 2.2) * 2 : 0;
  const X = COLECTIVO.asientoLeo;
  return (
    <Bus claves={f < c ? [mira(0, X + 60, 640, 2.0), mira(c, X + 60, 636, 2.1, { curva: "in" })] : [mira(0, X + 20, 790, 3.0), mira(126, X + 20, 786, 3.1, { curva: "in" })]}
      leoCara={[{ f: 0, v: "feliz" }, { f: 30, v: "risa" }]} mayaHabla={[[0, 120]]} leoMira={[{ f: 0, v: { x: 1, y: 0.1 } }]}
      delante={f >= c ? <g transform={`translate(${X + 6 + vib},${KP - 92}) rotate(-12)`}><rect x={-15} y={-34} width={30} height={52} rx={6} fill="#15151a" stroke="#3a3a44" strokeWidth={2} /><rect x={-11} y={-30} width={22} height={16} rx={3} fill={ACENTO} opacity={vib !== 0 ? 0.9 : 0.25} /></g> : null}
      hud={<><Paradas11 t0={343.3} />{f >= c && <GranNumero rotulo="TIMES HE LOOKED AT HIS PHONE" claves={[{ f: 0, v: 0 }]} x={1640} y={760} color={ACENTO} tam={100} desde={c + 8} />}<Hud min={0} dia={9} /></>} />
  );
};
const Puerta21a: React.FC = () => {
  // camina a la puerta, se DA VUELTA justo en «turns around» y levanta la mano
  const T = 347.5, L = (t: number) => fr(t, T);
  return (
    <Bus vel={0} claves={[mira(0, COLECTIVO.puerta - 300, 640, 1.6), mira(L(351.5), COLECTIVO.puerta - 220, 636, 1.75)]}
      mayaSentada={false} mayaRuta={[{ f: 0, x: COLECTIVO.puerta - 420, y: KP }, { f: L(350.0), x: COLECTIVO.puerta - 40, y: KP }]}
      mayaDir={[{ f: 0, v: 1 }, { f: L(350.25), v: -1 }]} mayaPoses={[{ f: 0, v: { hD: 15, cD: 30, hI: 15, cI: 30 } }, { f: L(350.5), v: { hD: 15, cD: 30, hI: 15, cI: 30 } }, { f: L(350.8), v: { hD: 150, cD: 30, hI: 15, cI: 30, cabeza: -4 } }]} mayaCara={[{ f: 0, v: "neutral" }, { f: L(350.3), v: "feliz" }]}
      hud={<><Paradas11 t0={347.5} /><Hud min={0} dia={9} /></>} />
  );
};
const Puerta21b: React.FC = () => (
  <Bus vel={0} claves={[mira(0, COLECTIVO.puerta - 100, 620, 1.85), mira(48, COLECTIVO.puerta - 100, 616, 1.95, { curva: "in" })]}
    mayaSentada={false} mayaRuta={[{ f: 0, x: COLECTIVO.puerta - 40, y: KP }]} mayaDir={[{ f: 0, v: -1 }]} mayaPoses={[{ f: 0, v: { hD: 60, cD: 60, hI: 15, cI: 30, cabeza: -4 } }]} mayaCara={[{ f: 0, v: "feliz" }]} mayaHabla={[[0, 46]]}
    hud={<><Globo texto="Same time tomorrow?" x={960} y={290} desde={0} hasta={48} cola="abajo" tam={50} /><Hud min={0} dia={9} /></>} />
);
const Puerta21c: React.FC = () => (
  // «Same time.»: Leo le devuelve el saludo con la mano en alto
  <Bus vel={0} claves={[mira(0, COLECTIVO.asientoLeo + 40, 640, 1.9), mira(33, COLECTIVO.asientoLeo + 40, 636, 1.95)]} mayaSentada={false} mayaRuta={[{ f: 0, x: 5000, y: KP }]} leoHabla={[[0, 30]]} leoCara={[{ f: 0, v: "risa" }]}
    leoPoses={[{ f: 0, v: { tronco: 4, pI: 80, rI: 90, pD: 85, rD: 95, hD: 60, cD: 40, hI: 20, cI: 50 } }, { f: 8, v: { tronco: 4, pI: 80, rI: 90, pD: 85, rD: 95, hD: 150, cD: 30, hI: 20, cI: 50 } }]}
    hud={<><Globo texto="Same time." x={1200} y={290} desde={0} hasta={33} cola="abajo" tam={50} /><Hud min={0} dia={9} /></>} />
);
// DAY 9: 1 h 50 m — la barra más baja de todas
const Cuenta9: React.FC = () => {
  const f = useF();
  const L = (t: number) => fr(t, 354.2);
  const b8 = 320, b9 = Math.round(interpolate(f, [L(356.4), L(357.8)], [320, 110], cl));
  const H = 520 / 320;
  return (
    <AbsoluteFill style={{ background: "#0d0f14" }}>
      <TelGrande modo="screentime" min={320} minHasta={110} x={600} y={560} s={0.9} desde={L(356.0)} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <rect x={1080} y={860} width={720} height={6} fill="#4a505b" />
        <rect x={1160} y={860 - b8 * H} width={200} height={b8 * H} rx={10} fill="#5a606b" />
        <rect x={1500} y={860 - b9 * H} width={200} height={b9 * H} rx={10} fill="#3f9a6a" />
        <text x={1260} y={920} fontSize={40} textAnchor="middle" fill="#c9ced6" fontFamily={F_HUD} fontWeight={600}>DAY 8</text>
        <text x={1600} y={920} fontSize={40} textAnchor="middle" fill="#f4efe6" fontFamily={F_HUD} fontWeight={600}>DAY 9</text>
        <text x={1260} y={860 - b8 * H - 20} fontSize={42} textAnchor="middle" fill="#c9ced6" fontFamily={F_HUD} fontWeight={600}>5h 20m</text>
        <text x={1600} y={860 - b9 * H - 20} fontSize={42} textAnchor="middle" fill="#3f9a6a" fontFamily={F_HUD} fontWeight={600}>{`${Math.floor(b9 / 60)}h ${String(b9 % 60).padStart(2, "0")}m`}</text>
      </svg>
      <Pildora texto="THE LOWEST IT HAS EVER BEEN" x={1440} y={150} desde={L(358.2)} color="#3f9a6a" tam={36} />
      <Hud min={[{ f: 0, v: 320 }, { f: L(356.4), v: 110, d: 42 }]} dia={9} estado="normal" />
    </AbsoluteFill>
  );
};

// ---------- 359,8-385,1 · Leo le cuenta todo a Tenzo ----------
const Cuenta23a: React.FC = () => {
  const f = useF();
  return (
    <Lav leo="parado" claves={[mira(0, 1510, 640, 1.6), mira(108, 1510, 640, 1.72, { curva: "in" })]}
      leoCara={[{ f: 0, v: "risa" }]} leoHabla={[[0, 108]]} leoPoses={[{ f: 0, v: "celebrar" }, { f: 36, v: "señalar" }, { f: 70, v: { hD: 60, cD: 40, hI: 60, cI: 40 } }]}
      tenzoCara={[{ f: 0, v: "feliz" }]} tenzoPoses={alterna(T_DOBLA_A, T_DOBLA_B, 0, 108, 24)} doblez={ent(f, 0, 108) * 0.6}
      hud={<Hud min={110} dia={9} />} />
  );
};
const TresCosas: React.FC = () => {
  // cada palabra = Leo lanza una tarjeta desde la mano a su lugar (el libro, el poema, las 11 paradas), con un gesto distinto
  const L = (t: number) => fr(t, 363.4);
  const f = useF();
  const cartas = [{ t: "THE BOOK", d: L(363.55) }, { t: "THE POEM", d: L(364.35) }, { t: "11 STOPS", d: L(365.45) }];
  const MX0 = 1290, MY0 = 760;
  return (
    <LeoLav silla={false} dur={102} dia={9} min={110} cara={[{ f: 0, v: "risa" }, { f: L(365.5), v: "feliz" }]} habla={[[0, 100]]}
      poses={[{ f: 0, v: { hD: 30, cD: 60, hI: 15, cI: 30 } }, { f: cartas[0].d, v: { hD: 120, cD: 20, hI: 15, cI: 30 } }, { f: cartas[0].d + 12, v: { hD: 40, cD: 60, hI: 15, cI: 30 } }, { f: cartas[1].d, v: { hD: 15, cD: 30, hI: 125, cI: 20 } }, { f: cartas[1].d + 12, v: { hD: 30, cD: 60, hI: 30, cI: 50 } }, { f: cartas[2].d, v: "celebrar" }]}
      hud={<>{cartas.map((c, k) => {
        const e = ent(f, c.d, c.d + 9);
        if (e <= 0) return null;
        const tx = 140 + k * 240, ty = 300;
        const x = MX0 + (tx - MX0) * e, y = MY0 + (ty - MY0) * e - Math.sin(e * Math.PI) * 120;
        return <div key={k} style={{ position: "absolute", left: x, top: y, width: 210, height: 150, borderRadius: 18, background: "#f4efe4", border: "5px solid #3f9a6a", transform: `scale(${0.4 + 0.6 * e}) rotate(${(k - 1) * 4 + (1 - e) * 30}deg)`, transformOrigin: "0 0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 34, color: "#22262d", textAlign: "center" }}>{c.t}</div>;
      })}</>} />
  );
};
const TenzoEscucha: React.FC = () => {
  // sobre el hombro de Leo (que cuenta con las manos) → CORTE a primer plano de Tenzo con los OJOS CERRADOS: sonríe en «smiling» y asiente fuerte en cada parte
  const T = 366.8, f = useF(), L = (t: number) => fr(t, T);
  const c = L(367.9);
  const nods = [L(369.8), L(370.15), L(370.5), L(370.85)];
  const BASE = { hD: 30, cD: 110, hI: 30, cI: 110 };
  const asiente = nods.flatMap((n) => [{ f: n, v: { ...BASE, cabeza: 0 } }, { f: n + 5, v: { ...BASE, cabeza: 20 } }]);
  return (
    <Lav leo="parado" claves={[mira(0, 1450, 640, 2.0), mira(c - 1, 1460, 636, 2.1, { curva: "in" }), mira(c, LAV_PUNTOS.tenzo - 40, 650, 3.0), mira(138, LAV_PUNTOS.tenzo - 40, 646, 3.1, { curva: "in" })]} doblez={1}
      leoRuta={[{ f: 0, x: LEO_LAV + 40, y: LP }]} leoCara={[{ f: 0, v: "risa" }, { f: 50, v: "feliz" }, { f: 100, v: "risa" }]} leoHabla={[[0, 138]]}
      leoPoses={alterna({ hD: 70, cD: 40, hI: 20, cI: 30 }, { hD: 40, cD: 80, hI: 70, cI: 40 }, 0, 138, 22)}
      tenzoCara={[{ f: 0, v: "neutral" }, { f: c - 6, v: "sereno" }]} tenzoMira={[{ f: 0, v: { x: -1, y: 0.2 } }]}
      tenzoPoses={[{ f: 0, v: { ...BASE, cabeza: 0 } }, { f: L(369.1), v: { ...BASE, cabeza: -6 } }, ...asiente, { f: nods[3] + 10, v: { ...BASE, cabeza: 2 } }]}
      hud={<><ManoLeo texto="eyes closed. smiling. nodding." x={960} y={910} desde={c + 4} centro tam={58} /><Hud min={110} dia={9} /></>} />
  );
};
const TenzoPregunta: React.FC = () => (
  // por encima del hombro de Leo: Tenzo deja la toalla y le señala el bolsillo («the pictures?»); Leo baja la mirada al bolsillo
  <Lav leo="silla" claves={[mira(0, LAV_PUNTOS.leo + 290, 640, 2.2), mira(75, LAV_PUNTOS.leo + 300, 636, 2.28, { curva: "in" })]} leoCara={[{ f: 0, v: "duda" }, { f: 30, v: "triste" }]}
    leoMira={[{ f: 0, v: { x: 1, y: 0 } }, { f: 30, v: { x: 0.4, y: 1 } }]} leoPoses={[{ f: 0, v: { tronco: 6, pI: 80, rI: 90, pD: 85, rD: 95, hD: 30, cD: 70, hI: 25, cI: 60 } }, { f: 32, v: { tronco: 14, pI: 80, rI: 90, pD: 85, rD: 95, hD: 20, cD: 30, hI: 25, cI: 60, cabeza: 18 } }]}
    tenzoCara={[{ f: 0, v: "neutral" }, { f: 6, v: "sorpresa" }, { f: 40, v: "neutral" }]} tenzoHabla={[[0, 50]]} tenzoPoses={[{ f: 0, v: T_HABLA_A }, { f: 6, v: { hD: 85, cD: 10, hI: 15, cI: 30, tronco: 4 } }, { f: 50, v: T_HABLA_B }]} doblez={1}
    hud={<><Globo texto="And the pictures?" x={1420} y={200} desde={2} hasta={75} cola="abajo" tam={50} /><Hud min={110} dia={9} /></>} />
);
const LeoPiensa: React.FC = () => {
  const L = (t: number) => fr(t, 373.9);
  return <LeoLav silla={false} dur={102} dia={9} min={110} cara={[{ f: 0, v: "duda" }, { f: L(375.8), v: "determinado" }]} habla={[[L(375.8), 102]]}
    poses={[{ f: 0, v: { hD: 100, cD: 140, hI: 15, cI: 30, cabeza: 8 } }, { f: L(375.8), v: { hD: 15, cD: 30, hI: 15, cI: 30 } }]}
    hud={<Globo texto="I didn't want them today." x={640} y={290} desde={L(375.8)} hasta={102} cola="abajo" tam={50} />} />;
};
const LeoReal: React.FC = () => {
  // Leo llega a la mesa con el celular encendido («it felt like cheating») → INSERTO grande: el celular cae BOCA ABAJO sobre la mesa, la luz se apaga debajo, la mano se retira → corte a la cara de Leo, firme («real»)
  const T = 377.3, f = useF(), L = (t: number) => fr(t, T);
  const deja = L(378.45), vuelve = L(379.55);
  const PX = 1470, PY = 750;
  const cae = ent(f, deja, deja + 5);
  const luz = 1 - ent(f, deja + 4, deja + 16);
  const mano = ent(f, deja + 8, deja + 22);
  return (
    <Lav leo="parado" claves={[mira(0, 1400, 640, 2.3), mira(deja - 1, 1415, 650, 2.4, { curva: "in" }), mira(deja, PX + 6, PY - 18, 5.6), mira(vuelve - 1, PX + 6, PY - 20, 5.8), mira(vuelve, 1395, 590, 3.2), mira(90, 1395, 586, 3.3, { curva: "in" })]} doblez={1}
      leoRuta={[{ f: 0, x: LEO_LAV, y: LP }, { f: L(378.3), x: 1395, y: LP }]} leoCara={[{ f: 0, v: "triste" }, { f: vuelve, v: "determinado" }]} leoHabla={[[0, deja], [vuelve, 88]]}
      leoMano={(fr0: number) => (fr0 < deja ? <Tel /> : null)} leoMira={[{ f: 0, v: { x: 0.6, y: 0.6 } }, { f: vuelve, v: { x: 1, y: 0 } }]}
      leoPoses={[{ f: 0, v: { hD: 45, cD: 90, hI: 15, cI: 30, cabeza: 10 } }, { f: L(378.3), v: { hD: 70, cD: 30, hI: 15, cI: 30, tronco: 14, cabeza: 14 } }, { f: vuelve, v: { hD: 15, cD: 30, hI: 15, cI: 30, cabeza: -2 } }]}
      tenzoCara={[{ f: 0, v: "feliz" }]}
      delante={f >= deja ? <g transform={`translate(${PX},${PY - 2 - 16 * (1 - cae)})`}>
        {luz > 0.02 && <ellipse cx={0} cy={2} rx={70} ry={6} fill={ACENTO} opacity={0.55 * luz} />}
        <path d="M-46,-15 L46,-15 L54,0 L-54,0 Z" fill="#17181d" stroke="#3a3a44" strokeWidth={1.4} />
        <rect x={-54} y={0} width={108} height={3} rx={1.5} fill="#0c0d10" />
        <rect x={22} y={-13} width={18} height={9} rx={3} fill="#2a2b33" stroke="#4a4a56" strokeWidth={0.8} />
        <circle cx={27} cy={-8.5} r={2.6} fill="#0c0d10" stroke="#5a5a66" strokeWidth={0.6} /><circle cx={35} cy={-8.5} r={2.6} fill="#0c0d10" stroke="#5a5a66" strokeWidth={0.6} />
        {mano < 1 && <g transform={`translate(${-14 - 60 * mano},${-22 - 30 * mano})`} opacity={1 - mano * 0.8}>
          <ellipse cx={0} cy={0} rx={18} ry={9} fill="#e0aa7c" stroke="#7a4a32" strokeWidth={1.2} />
          {[0, 1, 2, 3].map((k) => <rect key={k} x={10} y={-8 + k * 4.6} width={16} height={4} rx={2} fill="#e0aa7c" stroke="#7a4a32" strokeWidth={0.8} />)}
        </g>}
      </g> : null}
      hud={<><Globo texto="It felt like cheating on someone real." x={960} y={230} desde={2} hasta={deja} cola="abajo" tam={46} /><ManoLeo texto="face down." x={960} y={910} desde={deja + 6} hasta={vuelve} centro tam={62} /><Globo texto="…on someone real." x={760} y={240} desde={vuelve} hasta={90} cola="abajo" tam={46} /><Hud min={110} dia={9} /></>} />
  );
};
const Suelta23b: React.FC = () => (
  // «you have put her down at the river»: Tanzan la apoya en la orilla (de cerca), ella hace la reverencia
  <Rio T={154.2} vel={0.6} claves={[mira(0, 2500, 650, 2.2), mira(87, 2560, 650, 2.3, { curva: "in" })]}
    hud={<ManoLeo texto="You put her down at the river." x={960} y={910} desde={6} centro tam={60} />} />
);
// «now you can walk next to her»: Leo y Maya caminando juntos por Broadway
const Junto23b: React.FC = () => {
  // más cerca: caminan juntos, Maya lo mira y se ríe en «next to her», Leo le devuelve la mirada; texto arriba (banda libre)
  const f = useF();
  const x0 = (g: number) => BWY_PUNTOS.parada36 - 500 + g * 3.2;
  return (
    <Escena Set={Broadway} pal={PAL_DIA} setProps={{ hora: "dia", nieve: true }} claves={[mira(0, x0(0) + 85, 650, 2.0), mira(57, x0(57) + 85, 650, 2.06)]}
      medio={<>
        <Actor look={LEO} escala={ESC} seed={1} luz={L_DIA} ruta={[{ f: 0, x: x0(0), y: BP }, { f: 300, x: x0(300), y: BP }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "feliz" }, { f: 26, v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} />
        <Actor look={MAYA} escala={ESC * 0.95} seed={8} luz={L_DIA} ruta={[{ f: 0, x: x0(0) + 170, y: BP }, { f: 300, x: x0(300) + 170, y: BP }]} dir={[{ f: 0, v: 1 }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: 18, v: { x: -1, y: 0.1 } }]} caras={[{ f: 0, v: "feliz" }, { f: 18, v: "risa" }]} />
      </>}
      hud={<Frase texto="Now you can walk next to her." desde={0} y={150} tam={64} />} />
  );
};
// ---------- 385,1-408,9 · DAY 10: la rutina… y la notificación ----------
const AS10 = COLCHON_ALTO;
const Despierta10: React.FC = () => {
  const T = 385.1, f = useF(), L = (t: number) => fr(t, T);
  const r = interpolate(f, [L(386.2), L(387.2)], [-90, 0], cl);
  return (
    <Escena Set={Cuarto} pal={PAL_DIA} setProps={{ nieve: false }} claves={[mira(0, LX - 40, 640, 1.4), mira(L(391.1), LX - 20, 620, 1.5)]}
      detras={<Halo x={LX + 460} y={420} r={1000} color="#fff1cc" fuerza={0.95} />}
      medio={<g transform={`rotate(${r} ${LX} ${CP - AS10})`}>
        <Actor look={LEO} escala={ESC} seed={1} luz={L_DIA} ruta={[{ f: 0, x: LX, y: CP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: AS10 }, { f: L(388.4), v: 0 }]}
          poses={[{ f: 0, v: { hD: 10, cD: 20, hI: 10, cI: 20, pI: 0, rI: 0, pD: 0, rD: 0 } }, { f: L(387.0), v: { tronco: 6, pI: 80, rI: 90, pD: 85, rD: 95, hD: 30, cD: 70, hI: 25, cI: 60 } }, { f: L(388.4), v: "celebrar" }, { f: L(389.6), v: { hI: 140, cI: 20, hD: 60, cD: 30, cabeza: -6 } }]}
          caras={[{ f: 0, v: "cansado" }, { f: L(386.6), v: "sorpresa" }, { f: L(388.2), v: "risa" }]} />
      </g>}
      hud={<>
        <GranNumero rotulo="DAY" claves={[{ f: 0, v: 10 }]} x={960} y={50} color="#f4efe6" tam={110} desde={0} hasta={L(388)} />
        <RelojDia min={360} x={1580} y={60} desde={L(386.8)} />
        <Hud min={0} dia={10} />
      </>} />
  );
};
// el baño (azulejos): ducha, afeitada
const Azulejos: React.FC = () => (
  <g>
    <rect x={-400} y={-400} width={3600} height={1600} fill="#cfd8de" />
    {Array.from({ length: 30 }).map((_, i) => <rect key={`v${i}`} x={-400 + i * 120} y={-400} width={4} height={1600} fill="#aab6be" />)}
    {Array.from({ length: 14 }).map((_, i) => <rect key={`h${i}`} x={-400} y={-400 + i * 120} width={3600} height={4} fill="#aab6be" />)}
  </g>
);
const Ducha10: React.FC = () => {
  const f = useF();
  return (
    <Escena Set={Cuarto} pal={PAL_DIA} setProps={{ nieve: false }} claves={[mira(0, LX, 600, 1.7), mira(30, LX, 596, 1.76)]} detras={<Azulejos />}
      medio={<>
        <rect x={LX - 30} y={CP - 820} width={60} height={30} rx={12} fill="#8a949c" />
        <Actor look={LEO} escala={ESC} seed={1} luz={L_DIA} ruta={[{ f: 0, x: LX, y: CP }]} dir={[{ f: 0, v: 1 }]}
          poses={alterna({ hD: 150, cD: 60, hI: 150, cI: 60, cabeza: -10 }, { hD: 140, cD: 85, hI: 145, cI: 75, cabeza: -6 }, 0, 30, 7)} caras={[{ f: 0, v: "risa" }]} />
        {Array.from({ length: 40 }).map((_, i) => <rect key={i} x={LX - 120 + random(`d${i}`) * 240} y={CP - 790 + ((random(`e${i}`) * 900 + f * 38) % 820)} width={5} height={28} rx={3} fill="#7fb6e0" opacity={0.85} />)}
      </>}
      hud={<><Pildora texto="SHOWER" x={960} y={60} desde={0} color="#f4efe6" tam={36} /><Hud min={0} dia={10} /></>} />
  );
};
const Afeita10: React.FC = () => {
  // Leo entero de cintura arriba frente al espejo; el espejo devuelve su reflejo afeitándose
  const pose = alterna({ hD: 120, cD: 130, hI: 10, cI: 20, cabeza: -8 }, { hD: 110, cD: 145, hI: 10, cI: 20, cabeza: -12 }, 0, 30, 8);
  const navaja = <g><rect x={-6} y={-60} width={12} height={70} rx={5} fill="#3a6aa0" /><rect x={-26} y={-74} width={52} height={16} rx={4} fill="#c9ced6" /></g>;
  const EX = LX + 150, EY = CP - 570, EW = 300, EH = 380;
  return (
    <Escena Set={Cuarto} pal={PAL_DIA} setProps={{ nieve: false }} claves={[mira(0, LX + 150, 560, 2.0), mira(30, LX + 150, 558, 2.05)]} detras={<Azulejos />}
      medio={<>
        <defs><clipPath id="espejoAfeita"><rect x={EX} y={EY} width={EW} height={EH} rx={20} /></clipPath></defs>
        <rect x={EX} y={EY} width={EW} height={EH} rx={20} fill="#dfe9ee" />
        <g clipPath="url(#espejoAfeita)" opacity={0.9}>
          <Actor look={LEO} escala={ESC} seed={1} luz={L_DIA} ruta={[{ f: 0, x: EX + 170, y: CP }]} dir={[{ f: 0, v: -1 }]} poses={pose} caras={[{ f: 0, v: "feliz" }]} enManoD={navaja} />
          <rect x={EX} y={EY} width={EW} height={EH} fill="#bcd6e2" opacity={0.25} />
        </g>
        <rect x={EX} y={EY} width={EW} height={EH} rx={20} fill="none" stroke="#8a949c" strokeWidth={8} />
        <Actor look={LEO} escala={ESC} seed={1} luz={L_DIA} ruta={[{ f: 0, x: LX, y: CP }]} dir={[{ f: 0, v: 1 }]} poses={pose} caras={[{ f: 0, v: "feliz" }]} enManoD={navaja} />
      </>}
      hud={<><Pildora texto="SHAVE" x={960} y={60} desde={0} color="#f4efe6" tam={36} /><Hud min={0} dia={10} /></>} />
  );
};
const Cajas10: React.FC = () => {
  const f = useF();
  const quedan = 5 - Math.min(5, Math.floor(f / 11));
  return (
    <Escena Set={Cuarto} pal={PAL_DIA} setProps={{ nieve: false }} claves={[mira(0, LX + 120, 650, 1.5), mira(57, LX + 120, 646, 1.56)]}
      medio={<>
        {Array.from({ length: quedan }).map((_, k) => <g key={k}><rect x={LX + 170} y={CP - 40 - k * 34} width={240} height={34} rx={4} fill="#c79a5a" stroke="#8a6a3a" strokeWidth={3} /><text x={LX + 290} y={CP - 16 - k * 34} fontSize={18} textAnchor="middle" fill="#8a2a1a" fontFamily="sans-serif" fontWeight={800}>PIZZA</text></g>)}
        <path d={`M${LX + 480},${CP} C${LX + 440},${CP - 170} ${LX + 620},${CP - 170} ${LX + 580},${CP} Z`} fill="#22262d" />
        <Actor look={LEO} escala={ESC} seed={1} luz={L_DIA} ruta={[{ f: 0, x: LX + 60, y: CP }]} dir={[{ f: 0, v: 1 }]}
          poses={alterna(POSES_AGACHA, { hD: 90, cD: 40, hI: 80, cI: 40, tronco: 6 }, 0, 57, 11)} caras={[{ f: 0, v: "risa" }]} />
      </>}
      hud={<><Pildora texto="EVEN THE PIZZA BOXES" x={960} y={60} desde={0} color="#f4efe6" tam={36} /><Hud min={0} dia={10} /></>} />
  );
};
const POSES_AGACHA: Partial<Pose> = { tronco: 38, pI: 70, rI: 115, pD: 80, rD: 120, hD: 50, cD: 20, hI: 35, cI: 25, cabeza: -20 };
const TelHora10: React.FC = () => {
  const L = (t: number) => fr(t, 395.0);
  return (
    <Escena Set={Cuarto} pal={PAL_DIA} setProps={{ nieve: false }} claves={[mira(0, LX + 200, 620, 1.6), mira(L(399.2), LX + 220, 610, 1.75, { curva: "in" })]}
      medio={<LeoCama caras={[{ f: 0, v: "feliz" }]} luz={L_DIA} poses={[{ f: 0, v: { tronco: 6, pI: 80, rI: 90, pD: 85, rD: 95, hD: 30, cD: 70, hI: 25, cI: 60 } }, { f: 24, v: SENT_CEL }]} />}
      hud={<><TelGrande modo="hora" texto="6:42" sub="AM" x={1440} y={560} s={0.62} desde={L(396.6)} inclina={-3} /><Hud min={0} dia={10} /></>} />
  );
};
// la notificación que no pidió: baja desde arriba sobre la pantalla de la hora
const Notif10: React.FC = () => {
  const f = useF();
  const e = ent(f, 6, 18);
  return (
    <AbsoluteFill style={{ background: "#0d1016" }}>
      <TelGrande modo="hora" texto="6:42" sub="AM" x={960} y={560} s={0.95} desde={-30} />
      <div style={{ position: "absolute", left: 960 - 230, top: 150 + (1 - e) * -120, width: 460, height: 120, borderRadius: 28, background: "#2d323b", border: `3px solid ${ACENTO}`, opacity: e, boxShadow: `0 0 40px ${ACENTO}66`, fontFamily: F_HUD }}>
        <div style={{ position: "absolute", left: 18, top: 18, width: 84, height: 84, borderRadius: 18, background: `radial-gradient(circle, ${ACENTO}, #5a1e10)` }} />
        <div style={{ position: "absolute", left: 120, top: 20, fontSize: 30, fontWeight: 600, color: "#f4efe6" }}>New for you ✦</div>
        <div style={{ position: "absolute", left: 120, top: 64, fontSize: 24, color: "#9aa0aa" }}>someone is waiting…</div>
      </div>
      <Hud min={4} dia={10} />
    </AbsoluteFill>
  );
};
const Luz10: React.FC = () => {
  // la notificación (cara, cuerpo) → corte al primer plano de Leo con la cara pintada de naranja, congelado («smiling, waiting»)
  const f = useF(), L = (t: number) => fr(t, 402.5);
  const c = L(405.6);
  return f < c ? (
    <AbsoluteFill style={{ background: "#0d1016" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><circle cx={960} cy={560} r={640} fill={ACENTO} opacity={0.05 + 0.08 * ent(f, 20, 120)} /></svg>
      <PantallaMacro secuencia={["luz"]} periodo={100000} desde={0} />
      <ManoMara texto="a face he knows." x={1260} y={200} desde={2} hasta={L(404.2)} tam={60} />
      <ManoMara texto="a body he knows." x={1260} y={200} desde={L(404.2)} tam={60} />
      <Hud min={[{ f: 0, v: 4 }, { f: 60, v: 12, d: 60 }]} dia={10} estado="sube" />
    </AbsoluteFill>
  ) : (
    <Escena Set={Cuarto} pal={PAL_DIA} setProps={{ nieve: false }} claves={[mira(0, LX - 20, 640, 2.6), mira(L(408.9), LX - 20, 636, 2.75, { curva: "in" })]}
      medio={<Actor look={LEO} escala={ESC} seed={1} luz={{ ...L_TEL, fuerza: 0.9 }} ruta={[{ f: 0, x: LX, y: CP }]} dir={[{ f: 0, v: 1 }]}
        poses={[{ f: 0, v: { hD: 30, cD: 125, cabeza: 22, hI: 10, cI: 20 } }, { f: L(407.2), v: { hD: 30, cD: 125, cabeza: 26, hI: 10, cI: 20, tronco: 4 } }]} caras={[{ f: 0, v: "sorpresa" }, { f: L(407.2), v: "cansado" }]} enManoD={<Tel />} />}
      hud={<><ManoMara texto="a girl made of light." x={1300} y={200} desde={0} hasta={L(407.1)} tam={60} /><ManoMara texto="smiling. waiting." x={1300} y={200} desde={L(407.1)} tam={60} /><Hud min={12} dia={10} /></>} />
  );
};
// 412,5-419,7 · el truco más viejo: nunca ataca cuando estás débil, espera a que estés feliz
const Truco26b: React.FC = () => {
  // la sombra ENTERA a la derecha, de cara al gráfico del ánimo (velo a la izquierda): lo recorre con el dedo y en «happy» SEÑALA el pico
  const T = 412.5, f = useF(), L = (t: number) => fr(t, T);
  const p = ent(f, L(415.7), L(417.6));
  const dias = [0.25, 0.2, 0.3, 0.32, 0.45, 0.5, 0.55, 0.6, 0.8, 0.95];
  const X0 = 150, X1 = 900, Y0 = 880, Hh = 400;
  const pts = dias.map((v, k) => [X0 + ((X1 - X0) * k) / 9, Y0 - v * Hh]);
  const n = Math.round(9 + p);
  return (
    <Escena Set={Cuarto} pal={PAL_DIA} setProps={{ nieve: false }} detras={oscuro} claves={[mira(0, MX - 40, 540, 1.15), mira(L(419.7), MX - 20, 536, 1.2, { curva: "in" })]}
      medio={<Actor look={MARA} escala={ESC * 1.9} seed={5} ruta={[{ f: 0, x: MX + 470, y: CP - 20 }, { f: L(415.6), x: MX + 470, y: CP - 20 }, { f: L(417.4), x: MX + 380, y: CP - 20 }]} dir={[{ f: 0, v: -1 }]}
        poses={[{ f: 0, v: { hD: 30, cD: 110, hI: 30, cI: 110, cabeza: 12 } }, { f: L(413.6), v: { hD: 60, cD: 60, hI: 30, cI: 110, cabeza: 6 } }, { f: L(415.8), v: { hD: 30, cD: 110, hI: 30, cI: 110, cabeza: -6, tronco: -6 } }, { f: L(417.8), v: { hD: 95, cD: 0, hI: 40, cI: 60, cabeza: 4, tronco: 6 } }]}
        caras={[{ f: 0, v: "picaro" }, { f: L(415.8), v: "feliz" }, { f: L(417.8), v: "risa" }]} opacidad={() => 0.95} />}
      hud={<>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <rect x={80} y={300} width={900} height={720} rx={26} fill="rgba(10,12,16,0.72)" />
          <text x={130} y={370} fontSize={44} fill="#e8e2d6" fontFamily={F_HUD} fontWeight={600} letterSpacing={3}>HOW LEO FEELS · DAY 1-10</text>
          <polyline points={pts.slice(0, n).map((q) => q.join(",")).join(" ")} fill="none" stroke="#f4efe6" strokeWidth={8} strokeLinejoin="round" />
          {pts.slice(0, n).map((q, k) => <circle key={k} cx={q[0]} cy={q[1]} r={10} fill={k === 9 ? ACENTO : "#f4efe6"} />)}
          <text x={X0} y={960} fontSize={44} fill="#c9ced6" fontFamily={F_HUD} fontWeight={600}>weak</text>
          <text x={X1} y={960} fontSize={44} fill="#c9ced6" fontFamily={F_HUD} fontWeight={600} textAnchor="end">happy</text>
          {f > L(417.8) && <g opacity={ent(f, L(417.8), L(418.4))}><circle cx={pts[9][0]} cy={pts[9][1]} r={36} fill="none" stroke={ACENTO} strokeWidth={7} /><text x={pts[9][0] - 56} y={pts[9][1] + 20} fontSize={50} fill={ACENTO} fontFamily={F_HUD} fontWeight={700} textAnchor="end">it attacks here</text></g>}
        </svg>
        <Hud min={12} dia={10} />
      </>} />
  );
};
// CTA sobre negro, legible; después el gancho del día 11 (la elefanta y la soga chiquita)
const Pregunta27: React.FC = () => {
  // Leo de espaldas (silueta) mira el farol; en «who was never» estira la mano y el farol se desvanece («never really there»)
  const T = 419.7, f = useF(), L = (t: number) => fr(t, T);
  const sube = ent(f, 0, 16);
  const mano = ent(f, L(421.3), L(421.9));
  const fant = ent(f, L(421.95), L(422.5));
  const FX = 1300, FY = 400, SX = 440, SY = 1080 + (1 - sube) * 80;
  const hx = 700 + (FX - 120 - 700) * mano, hy = 960 + (FY + 90 - 960) * mano;
  const rim = "rgba(244,200,120,0.55)";
  return (
    <AbsoluteFill style={{ background: "#0b0c10" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g opacity={1 - 0.7 * fant}>
          <Halo x={FX} y={FY} r={420} color={ORO} fuerza={0.32 + 0.04 * Math.sin(f / 9)} />
          <FarolPapel x={FX} y={FY} s={1.5} luz={0.9 + 0.1 * Math.sin(f / 7)} />
        </g>
        <g transform={`translate(0,${SY - 1080})`}>
          <path d={`M${SX + 200},880 Q${(SX + 200 + hx) / 2},${Math.min(880, hy) - 40} ${hx},${hy}`} stroke={rim} strokeWidth={56} fill="none" strokeLinecap="round" />
          <path d={`M${SX + 200},880 Q${(SX + 200 + hx) / 2},${Math.min(880, hy) - 40} ${hx},${hy}`} stroke="#07080b" strokeWidth={50} fill="none" strokeLinecap="round" />
          <circle cx={hx} cy={hy} r={32} fill="#07080b" stroke={rim} strokeWidth={3} />
          <path d={`M${SX - 300},1080 C${SX - 290},900 ${SX - 190},830 ${SX},820 C${SX + 190},830 ${SX + 290},900 ${SX + 300},1080 Z`} fill="#07080b" stroke={rim} strokeWidth={3} />
          <rect x={SX - 46} y={720} width={92} height={110} fill="#07080b" />
          <circle cx={SX} cy={620} r={140} fill="#07080b" stroke={rim} strokeWidth={4} />
          <path d={`M${SX - 140},600 L${SX - 120},500 L${SX - 80},540 L${SX - 50},460 L${SX - 10},520 L${SX + 30},450 L${SX + 60},520 L${SX + 110},480 L${SX + 120},560 L${SX + 146},600 Z`} fill="#07080b" stroke={rim} strokeWidth={3} strokeLinejoin="round" />
        </g>
      </svg>
      <Frase texto="Have you ever carried someone in your head" desde={4} y={100} tam={58} color="#f4efe6" />
      <Frase texto="who was never really there?" desde={L(421.35)} y={180} tam={58} color={ORO} />
      <Frase texto="Tell me below." desde={L(422.8)} y={1000} tam={52} />
    </AbsoluteFill>
  );
};
const Gancho27: React.FC = () => {
  // 3 planos: el elefante grande tira de la soga (en «tied» se tensa) → inserto de la soga diminuta y la estaca («tiny rope») → Leo atado al celular cada mañana
  const T = 423.7, f = useF(), L = (t: number) => fr(t, T);
  const c2 = L(429.0), c3 = L(430.1);
  const tira = f > L(428.1);
  const PISO = 1000, ST = 360, S = 1.4;
  const ex = tira ? 1120 + 22 * Math.abs(Math.sin(((f - L(428.1)) * Math.PI) / 22)) : 960 + 160 * ent(f, 0, L(428.1));
  const pie = { x: ex - 110 * S, y: PISO - 34 };
  const zoom = f >= c2 ? { cx: 660, cy: 900, z: 2.3 + 0.08 * ent(f, c2, c3) } : { cx: 960, cy: 540, z: 1 };
  const wig = tira ? 5 * Math.sin(f / 2.6) : 0;
  return (
    <AbsoluteFill style={{ background: "#0b0c10" }}>
      {f < c3 && (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <defs><linearGradient id="g27c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#141824" /><stop offset="1" stopColor="#3a2e34" /></linearGradient></defs>
            <g transform={`translate(${960 - zoom.cx * zoom.z},${540 - zoom.cy * zoom.z}) scale(${zoom.z})`}>
              <rect x={-200} y={-200} width={2400} height={1400} fill="url(#g27c)" />
              <path d="M-200,760 C200,690 520,730 900,700 C1300,670 1600,720 2200,690 L2200,1100 L-200,1100 Z" fill="#2a2228" />
              <rect x={-200} y={PISO} width={2400} height={300} fill="#4a3626" />
              <ellipse cx={ex + 100} cy={PISO + 6} rx={360} ry={22} fill="#000" opacity={0.3} />
              <Elefante x={ex} piso={PISO} dir={1} s={S} paso={tira ? 0 : (f % 30) / 30} adorno={false} />
              <path d={`M${ST + 6},${PISO - 26} C${(ST + pie.x) / 2},${tira ? PISO - 30 : PISO - 4} ${(ST + pie.x) / 2 + 60},${tira ? PISO - 32 : PISO + 2} ${pie.x},${pie.y}`} stroke="#c9a86a" strokeWidth={5} fill="none" />
              <ellipse cx={pie.x} cy={pie.y} rx={30} ry={9} fill="none" stroke="#c9a86a" strokeWidth={5} />
              <g transform={`rotate(${wig} ${ST} ${PISO})`}><rect x={ST - 8} y={PISO - 44} width={16} height={52} rx={4} fill="#8a6a4a" stroke="#3a2a1a" strokeWidth={3} /></g>
            </g>
          </svg>
          {f < c2 && <><Frase texto="TOMORROW NIGHT" desde={2} y={92} tam={30} color="#c9c2b4" />
          <Frase texto="The Elephant and the Tiny Rope" desde={8} y={168} tam={66} /></>}
          {f >= c2 && <ManoLeo texto="a tiny rope." x={960} y={300} desde={c2 + 2} centro tam={58} />}
        </>
      )}
      {f >= c3 && (
        <Escena Set={Cuarto} pal={PAL_DIA} setProps={{ nieve: false }} claves={[mira(0, LX - 10, 760, 2.0), mira(294, LX - 10, 752, 2.12, { curva: "in" })]}
          medio={<>
            <LeoCama caras={[{ f: 0, v: "cansado" }]} poses={alterna(SENT_CEL, { ...SENT_CEL, cD: 136 }, c3, 294, 12)} />
            <path d={`M1560,${CP + 4} C1500,${CP - 30} 1420,${CP - 90} 1330,780`} stroke={ACENTO} strokeWidth={4} fill="none" opacity={ent(f, c3 + 4, c3 + 18)} />
            <rect x={1552} y={CP - 40} width={16} height={46} rx={4} fill="#8a6a4a" stroke="#3a2a1a" strokeWidth={3} opacity={ent(f, c3 + 4, c3 + 18)} />
          </>}
          hud={<ManoLeo texto="every morning. 10 years." x={960} y={110} desde={L(431.7)} centro tam={60} />} />
      )}
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [268, 294], [0, 1], cl) }} />
    </AbsoluteFill>
  );
};
// ================= el montaje =================
const TRAMOS: TramoS[] = [
  { t0: 0, t1: 7.6, el: <Cuadro0 /> },
  { t0: 7.6, t1: 14.3, el: <Dia8b />, trans: { tipo: "fundido", d: 12 } },
  { t0: 14.3, t1: 17.5, el: <TresDias /> },
  { t0: 17.5, t1: 21.6, el: <Coinc8 /> },
  { t0: 21.6, t1: 24.8, el: <MayaVerde /> },
  { t0: 24.8, t1: 29.2, el: <LibroMacro dia={8} min={230} /> },
  { t0: 29.2, t1: 34.2, el: <FichaMaya /> },
  { t0: 34.2, t1: 40.2, el: <MapaUptown /> },
  { t0: 40.2, t1: 41.9, el: <SonrieMaya /> },
  { t0: 41.9, t1: 43.6, el: <SonrieLeo /> },
  { t0: 43.6, t1: 52.9, el: <Mara3 /> },
  { t0: 52.9, t1: 57.9, el: <Noche4b />, trans: { tipo: "fundido", d: 14 } },
  { t0: 57.9, t1: 61.6, el: <TelFeed /> },
  { t0: 61.6, t1: 65.6, el: <MilChicas /> },
  { t0: 65.6, t1: 68.1, el: <Cara4 /> },
  { t0: 68.1, t1: 72.3, el: <Cuenta8 /> },
  { t0: 72.3, t1: 77.0, el: <Lav6 />, trans: { tipo: "barrido", lado: 1 } },
  { t0: 77.0, t1: 80.0, el: <TenzoDobla /> },
  { t0: 80.0, t1: 82.4, el: <FarolMesa /> },
  { t0: 82.4, t1: 86.5, el: <Chica6a /> },
  { t0: 86.5, t1: 94.0, el: <Chica6b /> },
  { t0: 94.0, t1: 96.1, el: <Chica6c /> },
  { t0: 96.1, t1: 99.1, el: <Farol7a /> },
  { t0: 99.1, t1: 102.7, el: <Farol7b /> },
  { t0: 102.7, t1: 105, el: <Camino8 />, trans: { tipo: "luz", d: 18 } },
  { t0: 105, t1: 108, el: <Camino8 o={69} cam={1} /> },
  { t0: 108, t1: 111.3, el: <Camino8 o={159} cam={2} /> },
  { t0: 111.3, t1: 113, el: <Camino8 o={258} cam={3} /> },
  { t0: 113, t1: 116, el: <Camino8 o={309} cam={4} /> },
  { t0: 116.0, t1: 126.0, el: <Ekido8b /> },
  { t0: 126.0, t1: 130.0, el: <Rio9 />, trans: { tipo: "fundido", d: 12 } },
  { t0: 130.0, t1: 134.8, el: <Rio9b /> },
  { t0: 134.8, t1: 138.3, el: <Rio9c /> },
  { t0: 138.3, t1: 141.7, el: <Rio9d /> },
  { t0: 141.7, t1: 144.4, el: <EkidoAparta /> },
  { t0: 144.4, t1: 147.8, el: <TanzanVa /> },
  { t0: 147.8, t1: 160.3, el: <Cruza11 /> },
  { t0: 160.3, t1: 166.3, el: <Camina12b />, trans: { tipo: "fundido", d: 14 } },
  { t0: 166.3, t1: 170.0, el: <Camina12b o={180} cerca /> },
  { t0: 170.0, t1: 174.0, el: <Camina12b o={291} /> },
  { t0: 174.0, t1: 177.7, el: <Porton12 />, trans: { tipo: "fundido", d: 12 } },
  { t0: 177.7, t1: 187.9, el: <Grito13 /> },
  { t0: 187.9, t1: 198.7, el: <Tanzan14 /> },
  { t0: 198.7, t1: 201.8, el: <LeoQuieto />, trans: { tipo: "luz", d: 16 } },
  { t0: 201.8, t1: 205.8, el: <TenzoLimpio /> },
  { t0: 205.8, t1: 211.1, el: <Suelta15b />, trans: { tipo: "luz", d: 10 } },
  { t0: 211.1, t1: 216.5, el: <Carga15b /> },
  { t0: 216.5, t1: 219.0, el: <Balanza /> },
  { t0: 219.0, t1: 221.6, el: <LeoViejo />, trans: { tipo: "luz", d: 10 } },
  { t0: 221.6, t1: 225.6, el: <TenzoCarga /> },
  { t0: 225.6, t1: 231.3, el: <PersonaFoto /> },
  { t0: 231.3, t1: 235.6, el: <Foto16 /> },
  { t0: 235.6, t1: 238.2, el: <LeoComo /> },
  { t0: 238.2, t1: 243.1, el: <TenzoReal /> },
  { t0: 243.1, t1: 249.9, el: <FotoVsReal /> },
  { t0: 249.9, t1: 254.8, el: <TenzoRisa /> },
  { t0: 254.8, t1: 259.9, el: <Mara17a /> },
  { t0: 259.9, t1: 262.4, el: <Mara17b /> },
  { t0: 262.4, t1: 265.3, el: <Mara17c /> },
  { t0: 265.3, t1: 272.8, el: <Dia9 />, trans: { tipo: "cortina", lado: 1 } },
  { t0: 272.8, t1: 274.2, el: <Libro18a /> },
  { t0: 274.2, t1: 280.1, el: <LibroMacro dia={9} min={0} dobla={9999} titulo="THERIGATHA" sub="verses of the first nuns" /> },
  { t0: 280.1, t1: 287.4, el: <Cuello18 /> },
  { t0: 287.4, t1: 291.4, el: <Stop18b /> },
  { t0: 291.4, t1: 295.4, el: <Habla19a /> },
  { t0: 295.4, t1: 299.3, el: <Habla19b /> },
  { t0: 299.3, t1: 302.5, el: <Monja19a /> },
  { t0: 302.5, t1: 306.7, el: <Monja19b />, trans: { tipo: "luz", d: 10 } },
  { t0: 306.7, t1: 308.8, el: <Corazon19 /> },
  { t0: 308.8, t1: 311.5, el: <Amrapali19b /> },
  { t0: 311.5, t1: 314.4, el: <MayaMira19 /> },
  { t0: 314.4, t1: 318.1, el: <Monje19b /> },
  { t0: 318.1, t1: 324.0, el: <Risa19 /> },
  { t0: 324.0, t1: 325.9, el: <Mano19b /> },
  { t0: 325.9, t1: 329.2, el: <Bus20a />, trans: { tipo: "barrido", lado: 1 } },
  { t0: 329.2, t1: 333.0, el: <Bus20b /> },
  { t0: 333.0, t1: 334.5, el: <Bus20c /> },
  { t0: 334.5, t1: 337.6, el: <Bus20d /> },
  { t0: 337.6, t1: 343.3, el: <Poema20b />, trans: { tipo: "luz", d: 12 } },
  { t0: 343.3, t1: 347.5, el: <Bolsillo20b />, trans: { tipo: "luz", d: 10 } },
  { t0: 347.5, t1: 351.5, el: <Puerta21a /> },
  { t0: 351.5, t1: 353.1, el: <Puerta21b /> },
  { t0: 353.1, t1: 354.2, el: <Puerta21c /> },
  { t0: 354.2, t1: 359.8, el: <Cuenta9 />, trans: { tipo: "fundido", d: 12 } },
  { t0: 359.8, t1: 363.4, el: <Cuenta23a /> },
  { t0: 363.4, t1: 366.8, el: <TresCosas /> },
  { t0: 366.8, t1: 371.4, el: <TenzoEscucha /> },
  { t0: 371.4, t1: 373.9, el: <TenzoPregunta /> },
  { t0: 373.9, t1: 377.3, el: <LeoPiensa /> },
  { t0: 377.3, t1: 380.3, el: <LeoReal /> },
  { t0: 380.3, t1: 383.2, el: <Suelta23b />, trans: { tipo: "luz", d: 10 } },
  { t0: 383.2, t1: 385.1, el: <Junto23b /> },
  { t0: 385.1, t1: 391.1, el: <Despierta10 />, trans: { tipo: "fundido", d: 12 } },
  { t0: 391.1, t1: 392.1, el: <Ducha10 /> },
  { t0: 392.1, t1: 393.1, el: <Afeita10 /> },
  { t0: 393.1, t1: 395.0, el: <Cajas10 /> },
  { t0: 395.0, t1: 399.2, el: <TelHora10 /> },
  { t0: 399.2, t1: 402.5, el: <Notif10 /> },
  { t0: 402.5, t1: 408.9, el: <Luz10 /> },
  { t0: 408.9, t1: 412.5, el: <Vuelve25 /> },
  { t0: 412.5, t1: 419.7, el: <Truco26b /> },
  { t0: 419.7, t1: 423.7, el: <Pregunta27 />, trans: { tipo: "fundido", d: 16 } },
  { t0: 423.7, t1: 433.5, el: <Gancho27 />, trans: { tipo: "fundido", d: 12 } },
];
const MarcaHasta: React.FC = () => (useF() < Math.round(423.7 * 30) ? <MarcaTenzo /> : null);
export const TZ04_DUR = 13004; // 433,5 s de voz
const PLANOS = planosDe(TRAMOS);

export const Tz04: React.FC<{ audio?: boolean }> = ({ audio = true }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Montaje planos={PLANOS} />
    <MarcaHasta />
    {audio && <Audio src={staticFile("tz04.wav")} />}
  </AbsoluteFill>
);
void LEO_LAV; void FAROL; void L_FRIO;
// vuelta 0 (reemplazadas por la vuelta OJO 1; quedan para comparar)
void Dia8; void Maya2; void Truman2; void Sonrie2; void Noche4; void Luz4; void Pantalla5; void Chica6; void Farol7; void Ekido8; void Mira10; void Camina12; void Quieto15; void Suelta15; void Carga15; void Puro15; void Viejo16; void Real16; void Mara17; void Libro18; void Stop18; void Habla19; void Monja19; void Amrapali19; void Monje19; void Mano19; void Bus20; void Poema20; void Bolsillo20; void Puerta21; void Bajo22; void Cuenta23; void Suelta23; void Junto23; void Dia10; void Notif25; void Truco26; void Cierre27;
