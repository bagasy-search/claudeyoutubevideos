// tz04 · «The Monk Who Chose Love Over Lust» (Tenzo Films, Day 8-10). Voz 433,5 s = 13.004 cuadros.
// Plan D:/rtmp/tz04_PLAN_MxM.md. Cada plano = la frase de ese segundo; tramos en SEGUNDOS ABSOLUTOS de la voz.
// Chicago frío (el farol de Tenzo es la única luz cálida) · la parábola de Tanzan y Ekido, ámbar con lluvia dorada.
import React from "react";
import { AbsoluteFill, Audio, interpolate, random, staticFile } from "remotion";
import { mira, useF } from "../anikit/camara";
import { Actor } from "../anikit/actor";
import { Escena } from "../anikit/escena";
import { Halo } from "../anikit/luz";
import { Montaje } from "../anikit/montaje";
import { F_HUD, F_MANO, GranNumero, Globo, Pildora, RelojDia } from "../anikit/pantalla";
import { TelGrande } from "../tenzo/graficos";
import { Recuerdo, TarjetaFinal } from "../tenzo/tzc/chicago";
import { Libro } from "../anikit/props";
import { Pose } from "../anikit/personaje";
import { ACENTO, ESC, FAROL, FRIO, LEO, MARA, ORO, PAL, PAL_ANT, PAL_DIA, TENZO } from "../tenzo/elenco";
import { AMRAPALI_VIEJA, CHICA_KIMONO, EKIDO, MAYA, TANZAN } from "../tenzo/elenco_b";
import { Frase, HudTenzo, ManoLeo, ManoMara, MarcaTenzo, Rotulo } from "../tenzo/hud";
import { Elefante, FarolPapel, Tel, Toalla } from "../tenzo/utileria";
import { Broadway, BWY_PISO, BWY_PUNTOS } from "../tenzo/sets/broadway";
import { COLCHON_ALTO, Cuarto, CTO_PISO } from "../tenzo/sets/cuarto";
import { Lavadero, LAV_PISO, LAV_PUNTOS } from "../tenzo/sets/lavadero";
import { CaminoMontana, JAPON_PISO, PortonMonasterio, PORTON, RIO, RioCrecido, RioFrente } from "../tenzo/sets/rioJapon";
import { Vaishali, VAI_PUNTOS } from "../tenzo/sets/vaishali";
import { Colectivo36, COLECTIVO, COLECTIVO_PISO } from "../tenzo/sets/wilson";
import { ent, fr, Hoja, PantallaMacro, planosDe, Tibio, TramoS } from "../tenzo/tzb/comun";

type Clv = ReturnType<typeof mira>;
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
const chicaX = (t: number) => (t < 149.6 ? RIO.chica : t < 155.0 ? tanzanX(t) + 70 : interpolate(t, [155, 157.4, 160.2], [2500, 2500, 3300], { extrapolateRight: "clamp" }));

// la chica en brazos: rotada sobre el pecho de Tanzan (cabeza hacia su hombro)
const ChicaEnBrazos: React.FC<{ x: number; y: number; caras?: KF<string>; op?: number; tinte?: boolean; esc?: number; rot?: number }> = ({ x, y, caras = [{ f: 0, v: "triste" }], op = 1, tinte, esc = 1, rot = -84 }) => (
  <g transform={`rotate(${rot} ${x} ${y})`} opacity={op}>
    <Actor look={tinte ? { ...CHICA_KIMONO, camisa: ORO, pantalon: ORO, piel: "#ffd9a0", miembro: "#ffd9a0" } : CHICA_KIMONO} escala={esc} seed={21} luz={L_ANT}
      ruta={[{ f: 0, x, y }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { pI: 80, rI: 110, pD: 85, rD: 115, hD: 120, cD: 60, hI: 40, cI: 90, cabeza: 20 } }]} caras={caras} />
  </g>
);
const POSE_CARGA: Partial<Pose> = { hD: 80, cD: 70, hI: 70, cI: 80, tronco: -4 };

// todo el río según t (absoluto); f = cuadro local para el agua
const RioMundo: React.FC<{ t: number; caraChica?: string; caraEkido?: string; caraTanzan?: string; habla?: [number, number][] }> = ({ t, caraChica, caraEkido = "neutral", caraTanzan = "feliz" }) => {
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
        poses={[{ f: 0, v: ekTapa ? { hD: 20, cD: 120, hI: 50, cI: 145, cabeza: 18, tronco: -6 } : { hD: 20, cD: 120, hI: 20, cI: 120, cabeza: ekDir === -1 ? 14 : 10 } }]} giros={[{ f: 0, v: ekGiro }]} caras={[{ f: 0, v: caraEkido }]} miradas={[{ f: 0, v: { x: 0.3, y: 0.8 } }]} />
      {!alzada(t) && (
        <Actor look={CHICA_KIMONO} escala={1.0} seed={21} luz={L_ANT} ruta={[{ f: 0, x: cx, y: JP - (t > 155 ? 0 : 0) }]} dir={[{ f: 0, v: t > 155 ? 1 : chicaDir }]}
          poses={[{ f: 0, v: t > 155 && t < 157.4 ? { tronco: 40 + 20 * Math.sin(t * 6), cabeza: 20, hD: 30, cD: 40, hI: 30, cI: 40 } : { hD: 100, cD: 150, hI: 95, cI: 150, cabeza: 12 } }]}
          caras={[{ f: 0, v: caraChica ?? (t > 155 ? "feliz" : "triste") }]} />
      )}
      <Actor look={TANZAN} escala={ESC} seed={22} luz={L_ANT} ruta={[{ f: 0, x: tx, y: JP + hundir(tx) }]} dir={[{ f: 0, v: 1 }]}
        poses={[{ f: 0, v: alzada(t) ? POSE_CARGA : pasoT ? { hD: 15, cD: 25, hI: 15, cI: 25 } : { hD: 10, cD: 20, hI: 10, cI: 20 } }]} caras={[{ f: 0, v: caraTanzan }]} />
      {alzada(t) && <ChicaEnBrazos x={tx + 140} y={JP + hundir(tx) - 105} caras={[{ f: 0, v: t < 152 ? "sorpresa" : "feliz" }]} />}
    </>
  );
};
const Rio: React.FC<{ T: number; claves: Clv[]; caraEkido?: string; caraTanzan?: string; hud?: React.ReactNode; vel?: number }> = ({ T, claves, caraEkido, caraTanzan, hud, vel = 1 }) => {
  const f = useF();
  const t = T + (f * vel) / 30;
  return <Escena Set={RioCrecido} pal={PAL_ANT} claves={claves} medio={<><RioMundo t={t} caraEkido={caraEkido} caraTanzan={caraTanzan} /><RioFrente f={f} /></>} hud={hud} />;
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
const Parada: React.FC<{ claves: Clv[]; dia: number; min: number; leoPoses?: KF<string | Partial<Pose>>; leoCara?: KF<string>; leoHabla?: [number, number][]; mayaPoses?: KF<string | Partial<Pose>>; mayaCara?: KF<string>; mayaHabla?: [number, number][]; mayaMira?: KF<{ x: number; y: number }>; libro?: boolean; mara?: React.ReactNode; hud?: React.ReactNode; leoX?: number; leoRuta?: { f: number; x: number; y: number }[] }> = ({ claves, dia, min, leoPoses = [{ f: 0, v: { hD: 20, cD: -40, hI: -20, cI: -40 } }], leoCara = [{ f: 0, v: "neutral" }], leoHabla, mayaPoses = [{ f: 0, v: POSE_LIBRO }], mayaCara = [{ f: 0, v: "neutral" }], mayaHabla, mayaMira, libro = true, mara, hud, leoX = LEO_PARADA, leoRuta }) => (
  <Escena Set={Broadway} pal={PAL_DIA} setProps={{ hora: "dia", nieve: true }} claves={claves}
    medio={<>
      {mara}
      <Actor look={LEO} escala={ESC} seed={1} luz={L_DIA} ruta={leoRuta ?? [{ f: 0, x: leoX, y: BP }]} dir={[{ f: 0, v: 1 }]} poses={leoPoses} caras={leoCara} habla={leoHabla} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} />
      <Actor look={MAYA} escala={ESC * 0.95} seed={8} luz={L_DIA} ruta={[{ f: 0, x: MAYA_X, y: BP }]} dir={[{ f: 0, v: -1 }]} poses={mayaPoses} caras={mayaCara} habla={mayaHabla} miradas={mayaMira}
        enManoD={libro ? <Libro abierto color="#2e5a8a" /> : undefined} />
    </>}
    hud={<>{hud}<Hud min={min} dia={dia} /></>} />
);
const MaraParada: React.FC<{ esc: number; caras: KF<string>; x?: number; pose?: Partial<Pose> }> = ({ esc, caras, x = LEO_PARADA - 200, pose = { hD: 60, cD: 60, hI: 40, cI: 70, cabeza: 18 } }) => (
  <Actor look={MARA} escala={ESC * esc} seed={5} ruta={[{ f: 0, x, y: BP - 10 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: pose }]} caras={caras} opacidad={() => 0.92} />
);

// el lavadero: Tenzo en la mesa, Leo en la silla (o parado), el farol sobre la mesa
const LP = LAV_PISO;
const LEO_LAV = LAV_PUNTOS.leo + 120; // parado junto a la mesa
const Lav: React.FC<{ claves: Clv[]; leo?: "silla" | "parado" | "no"; leoPoses?: KF<string | Partial<Pose>>; leoCara?: KF<string>; leoHabla?: [number, number][]; leoRuta?: { f: number; x: number; y: number }[]; tenzoPoses?: KF<string | Partial<Pose>>; tenzoCara?: KF<string>; tenzoHabla?: [number, number][]; tenzoGiros?: KF<number>; doblez?: number; toallaFuera?: boolean; mara?: React.ReactNode; hud?: React.ReactNode; farol?: number; tenzo?: boolean }> = ({ claves, leo = "parado", leoPoses, leoCara = [{ f: 0, v: "triste" }], leoHabla, leoRuta, tenzoPoses = [{ f: 0, v: { hD: 60, cD: 70, hI: 55, cI: 75, tronco: 8 } }], tenzoCara = [{ f: 0, v: "neutral" }], tenzoHabla, tenzoGiros, doblez = 0.5, mara, hud, farol = 1, tenzo = true }) => {
  const f = useF();
  const silla = leo === "silla";
  return (
    <Escena Set={Lavadero} pal={PAL} setProps={{ girando: [2, 5, 11], nieve: true, luzFarol: farol * (0.94 + 0.06 * Math.sin(f / 7)) }} claves={claves}
      detras={<Tibio k={0.55 * farol} x={LAV_PUNTOS.farol} y={LP - 200} />}
      medio={<>
        {mara}
        {leo !== "no" && <Actor look={LEO} escala={ESC} seed={1} luz={L_ORO_D} ruta={leoRuta ?? [{ f: 0, x: silla ? LAV_PUNTOS.leo : LEO_LAV, y: LP }]} dir={[{ f: 0, v: 1 }]}
          asiento={silla ? [{ f: 0, v: 66 }] : undefined} poses={leoPoses ?? [{ f: 0, v: silla ? { tronco: 6, pI: 80, rI: 90, pD: 85, rD: 95, hD: 30, cD: 70, hI: 25, cI: 60 } : { hD: 15, cD: 30, hI: 15, cI: 30 } }]}
          caras={leoCara} habla={leoHabla} />}
        {tenzo && <Toalla x={LAV_PUNTOS.mesa} y={LP - 150} doblez={doblez} />}
        {tenzo && <Actor look={TENZO} escala={ESC} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: LAV_PUNTOS.tenzo, y: LP }]} dir={[{ f: 0, v: -1 }]} poses={tenzoPoses} caras={tenzoCara} habla={tenzoHabla} giros={tenzoGiros} />}
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
const Bus: React.FC<{ claves: Clv[]; leoCara?: KF<string>; leoHabla?: [number, number][]; mayaCara?: KF<string>; mayaHabla?: [number, number][]; mayaPoses?: KF<string | Partial<Pose>>; mayaRuta?: { f: number; x: number; y: number }[]; mayaSentada?: boolean; mayaDir?: KF<1 | -1>; hud?: React.ReactNode; vel?: number }> = ({ claves, leoCara = [{ f: 0, v: "feliz" }], leoHabla, mayaCara = [{ f: 0, v: "feliz" }], mayaHabla, mayaPoses, mayaRuta, mayaSentada = true, mayaDir = [{ f: 0, v: -1 }], hud, vel = 6 }) => (
  <Escena Set={Colectivo36} pal={PAL_DIA} setProps={{ vel, dia: true }} claves={claves}
    medio={<>
      <Actor look={LEO} escala={ESC} seed={1} luz={L_DIA} ruta={[{ f: 0, x: COLECTIVO.asientoLeo, y: KP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: COLECTIVO.asiento }]}
        poses={[{ f: 0, v: { tronco: 4, pI: 80, rI: 90, pD: 85, rD: 95, hD: 25, cD: 60, hI: 20, cI: 50 } }]} caras={leoCara} habla={leoHabla} miradas={[{ f: 0, v: { x: 1, y: 0.1 } }]} />
      <Actor look={MAYA} escala={ESC * 0.95} seed={8} luz={L_DIA} ruta={mayaRuta ?? [{ f: 0, x: COLECTIVO.asientoMaya, y: KP }]} dir={mayaDir} asiento={mayaSentada ? [{ f: 0, v: COLECTIVO.asiento }] : undefined}
        poses={mayaPoses ?? [{ f: 0, v: { tronco: 4, pI: 80, rI: 90, pD: 85, rD: 95, ...POSE_LIBRO } }]} caras={mayaCara} habla={mayaHabla} enManoD={mayaSentada ? <Libro abierto color="#2e5a8a" /> : undefined} />
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
            <ChicaEnBrazos x={tx + 250} y={JP + 95 - 105} esc={1.3} caras={[{ f: 0, v: "feliz" }]} />
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
  const T = 43.6, f = useF(), L = (t: number) => fr(t, T);
  return (
    <Parada dia={8} min={230} claves={[mira(0, LEO_PARADA - 60, 640, 1.5), mira(L(48.7), LEO_PARADA - 130, 560, 1.75), mira(L(52.9), LEO_PARADA - 140, 545, 1.9)]}
      leoCara={[{ f: 0, v: "feliz" }, { f: L(48.7), v: "duda" }]}
      mara={<g opacity={ent(f, 6, L(45.5))}><MaraParada esc={1.0 + 0.1 * ent(f, L(46.8), L(52))} caras={[{ f: 0, v: "picaro" }, { f: L(50.6), v: "feliz" }]} pose={{ hD: 70, cD: 40, hI: 40, cI: 70, cabeza: 26, tronco: 14 }} /></g>}
      hud={<ManoMara texto={"look at her.\nimagine her."} x={1180} y={200} desde={L(48.8)} tam={80} />} />
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
const Cara4: React.FC = () => (
  <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX - 110, 600, 1.55), mira(153, LX - 130, 590, 1.7)]} detras={oscuro}
    medio={<>
      <MaraCuarto esc={1.5} caras={[{ f: 0, v: "feliz" }, { f: 70, v: "risa" }]} pose={{ hD: 85, cD: 30, hI: 40, cI: 70, cabeza: 20 }} />
      <LeoCama caras={[{ f: 0, v: "cansado" }]} />
    </>}
    hud={<Hud min={300} dia={8} />} />
);
const Pantalla5: React.FC = () => (
  <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX - 70, 720, 2.2), mira(126, LX - 70, 722, 2.4)]} detras={oscuro}
    medio={<LeoCama caras={[{ f: 0, v: "cansado" }]} />}
    hud={<Hud min={[{ f: 0, v: 300 }, { f: 33, v: 320, d: 30 }]} dia={8} estado="sube" />} />
);

// ================= 6-7 · 3 a.m., Spin City: «I met a girl» =================
const Lav6: React.FC = () => {
  const T = 72.3, f = useF(), L = (t: number) => fr(t, T);
  return (
    <Lav claves={[mira(0, 1500, 560, 0.85), mira(L(77), 1520, 600, 1.0), mira(L(82.4), 1450, 640, 1.3)]}
      leoRuta={[{ f: 0, x: 2900, y: LP }, { f: L(77.4), x: LEO_LAV, y: LP }]} leoCara={[{ f: 0, v: "cansado" }]}
      doblez={ent(f, L(77), L(80)) * 0.9} tenzoGiros={[{ f: 0, v: 0 }]}
      hud={<><RelojDia min={180} x={1580} y={60} /><Hud min={320} dia={8} /></>} />
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
const Camino8: React.FC = () => {
  const T = 102.7, f = useF(), L = (t: number) => fr(t, T);
  const x0 = 200 + f * 2.2;
  return (
    <Escena Set={CaminoMontana} pal={PAL_ANT} claves={[mira(0, 900, 560, 0.8), mira(L(116), 900 + L(116) * 2.2, 600, 0.95, { curva: "inout" })]}
      medio={<>
        <Actor look={TANZAN} escala={ESC} seed={22} luz={L_ANT} ruta={[{ f: 0, x: x0 + 260, y: JP }, { f: 2000, x: x0 + 260 + 2000 * 2.2, y: JP }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "feliz" }]}
          miradas={[{ f: 0, v: { x: 0.5, y: -0.6 } }]} />
        <Actor look={EKIDO} escala={ESC} seed={23} luz={L_ANT} ruta={[{ f: 0, x: x0, y: JP }, { f: 2000, x: x0 + 2000 * 2.2, y: JP }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: { hD: 20, cD: 120, hI: 20, cI: 120, cabeza: 12 } }]} caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: { x: 0.3, y: 0.9 } }]} />
      </>}
      hud={<>
        <Rotulo texto="JAPAN · A LONG TIME AGO" desde={6} hasta={L(108)} />
        <Pildora texto="TANZAN" x={1180} y={260} desde={L(111.3)} hasta={L(116)} color="#ffd890" tam={34} />
        <Pildora texto="EKIDO" x={760} y={260} desde={L(113)} hasta={L(116)} color="#f4efe4" tam={34} />
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
const Rio9: React.FC = () => <Rio T={126} claves={[mira(0, 700, 560, 0.85), mira(fr(134.8, 126), 1000, 600, 1.15), mira(fr(141.7, 126), 960, 630, 1.4)]} />;
const Mira10: React.FC = () => <Rio T={141.7} caraEkido="enojo" claves={[mira(0, 640, 640, 1.8), mira(fr(143.2, 141.7), 660, 640, 1.9), mira(fr(144.4, 141.7), 820, 620, 1.4), mira(fr(147.8, 141.7), 900, 620, 1.5)]} />;
const Cruza11: React.FC = () => {
  const T = 147.8, f = useF(), L = (t: number) => fr(t, T);
  const t = T + f / 30;
  return (
    <Rio T={T} claves={[mira(0, 950, 600, 1.6), mira(L(150.3), 1000, 610, 1.3), mira(L(154.8), tanzanX(154.8) - 60, 620, 1.2, { curva: "inout" }), mira(L(160.3), 2700, 600, 1.0)]}
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
    <Escena Set={PortonMonasterio} pal={PAL_ANT} setProps={{ hora: 1 }} claves={[mira(0, PX - 290, 640, 1.4), mira(L(181.2), PX - 300, 640, 1.55), mira(L(187.9), PX - 300, 650, 1.6)]}
      medio={<>
        <Actor look={EKIDO} escala={ESC} seed={23} luz={L_ANT} ruta={[{ f: 0, x: PX - 420, y: JP }]} dir={[{ f: 0, v: 1 }]} habla={[[L(180.1), L(187.9)]]}
          poses={[{ f: 0, v: { hD: 20, cD: 120, hI: 20, cI: 120 } }, { f: L(180.1), v: "señalar" }, { f: L(185.1), v: { hD: 100, cD: 40, hI: 100, cI: 40, tronco: -6 } }]}
          caras={[{ f: 0, v: "enojo" }]} />
        <Actor look={TANZAN} escala={ESC} seed={22} luz={L_ANT} ruta={[{ f: 0, x: PX - 160, y: JP }]} dir={[{ f: 0, v: 1 }, { f: L(181), v: -1 }]} caras={[{ f: 0, v: "feliz" }, { f: L(181.2), v: "sorpresa" }]} />
      </>}
      hud={<>
        <Globo texto="How could you do that? We are monks!" x={560} y={240} desde={L(180.1)} hasta={L(185.1)} cola="abajo" tam={46} />
        <Globo texto="You carried her in your arms!" x={560} y={240} desde={L(185.2)} hasta={L(187.9)} cola="abajo" tam={50} />
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
  const T = 231.3, f = useF(), L = (t: number) => fr(t, T);
  const arruga = ent(f, L(232.8), L(234.6));
  return (
    <AbsoluteFill style={{ background: "#0b0d12" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <circle cx={960} cy={500} r={520} fill={ACENTO} opacity={0.08} />
        <g transform={`translate(960,500) rotate(${-4 + arruga * 18}) scale(${1 - arruga * 0.55},${1 - arruga * 0.75})`}>
          <rect x={-260} y={-330} width={520} height={620} rx={10} fill="#f4efe4" />
          <rect x={-230} y={-300} width={460} height={500} fill="#2a3a3a" />
          <path d="M0,-240 C60,-240 78,-180 70,-130 C64,-90 40,-76 34,-60 C90,-46 120,0 104,80 L104,200 L-104,200 L-104,80 C-120,0 -90,-46 -34,-60 C-40,-76 -64,-90 -70,-130 C-78,-180 -60,-240 0,-240 Z" fill="#ffb27a" opacity={0.9} />
          <rect x={-140} y={-40} width={280} height={60} rx={20} fill="#3f9a6a" />
          {arruga > 0.1 && [0, 1, 2, 3].map((k) => <path key={k} d={`M${-240 + k * 130},-320 L${-200 + k * 120},280`} stroke="#c9c2b4" strokeWidth={6} opacity={arruga} />)}
        </g>
      </svg>
      <ManoLeo texto="the picture is not her." x={560} y={900} desde={6} tam={72} />
      <Hud min={320} dia={8} />
    </AbsoluteFill>
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
  const T = 265.3, f = useF(), L = (t: number) => fr(t, T);
  const tiembla = f > L(269.7) ? Math.sin(f * 1.9) * 6 : 0;
  return (
    <Parada dia={9} min={0} claves={[mira(0, BWY_PUNTOS.parada36 - 200, 600, 0.95), mira(L(269.7), LEO_PARADA + 20, 720, 2.1), mira(L(272.8), LEO_PARADA + 20, 720, 2.2)]}
      leoPoses={[{ f: 0, v: { hD: 20, cD: -40, hI: -20, cI: -40 } }, { f: L(269.7), v: { hD: 40 + tiembla, cD: 90, hI: 40 - tiembla, cI: 90 } }]} leoCara={[{ f: 0, v: "neutral" }, { f: L(269.7), v: "miedo" }]}
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
  const T = 280.1, f = useF(), L = (t: number) => fr(t, T);
  return (
    <Parada dia={9} min={0} claves={[mira(0, LEO_PARADA - 60, 600, 2.0), mira(L(287.4), LEO_PARADA - 70, 590, 2.2)]}
      leoCara={[{ f: 0, v: "miedo" }]}
      mara={<MaraParada esc={1.15} x={LEO_PARADA - 120} caras={[{ f: 0, v: "picaro" }]} pose={{ hD: 90 + Math.sin(f / 9) * 4, cD: 30, hI: 40, cI: 70, cabeza: 30, tronco: 18 }} />}
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
  const T = 408.9, L = (t: number) => fr(t, T);
  return (
    <Escena Set={Cuarto} pal={PAL_DIA} setProps={{ nieve: false }} claves={[mira(0, LX - 200, 540, 1.0), mira(L(412.5), LX - 220, 520, 1.1)]}
      medio={<>
        <Actor look={MARA} escala={ESC * 2.0} seed={5} ruta={[{ f: 0, x: MX - 80, y: CP - 20 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 70, cD: 50, hI: 50, cI: 70, cabeza: 16 } }]} caras={[{ f: 0, v: "picaro" }]} opacidad={() => 0.94} />
        <Actor look={LEO} escala={ESC} seed={1} luz={L_TEL} ruta={[{ f: 0, x: LX, y: CP }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 30, cD: 125, cabeza: 22, hI: 10, cI: 20 } }]} caras={[{ f: 0, v: "sorpresa" }]} enManoD={<Tel />} />
      </>}
      hud={<><ManoMara texto="missed me?" x={300} y={220} desde={L(409.5)} tam={76} /><Hud min={4} dia={10} /></>} />
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
const MayaP: React.FC<PCorto & { mira?: KF<{ x: number; y: number }> }> = ({ dur, z = 2.4, dia = 9, min = 0, cara, habla, poses, hud, mira: m }) => (
  <Parada dia={dia} min={min} claves={[mira(0, MAYA_X - 20, 715, z), mira(dur, MAYA_X - 20, 711, z + 0.1, { curva: "in" })]} mayaCara={cara} mayaHabla={habla} mayaPoses={poses} mayaMira={m} hud={hud} />
);
// planos cortos en el lavadero
type LCorto = { dur: number; z?: number; cara?: KF<string>; habla?: [number, number][]; poses?: KF<string | Partial<Pose>>; hud?: React.ReactNode; dia?: number; min?: number; doblez?: number; mara?: React.ReactNode };
const LeoLav: React.FC<LCorto & { silla?: boolean }> = ({ dur, z = 2.0, cara, habla, poses, hud, dia = 8, min = 320, silla = true, mara }) => (
  <Lav leo={silla ? "silla" : "parado"} claves={[mira(0, silla ? LAV_PUNTOS.leo - 80 : LEO_LAV - 200, 650, z), mira(dur, silla ? LAV_PUNTOS.leo - 80 : LEO_LAV - 200, 646, z + 0.1, { curva: "in" })]}
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
    <path d="M0,-170 C50,-170 66,-120 60,-80 C56,-50 36,-40 30,-28 C80,-16 104,24 92,90 L92,175 L-92,175 L-92,90 C-104,24 -80,-16 -30,-28 C-36,-40 -56,-50 -60,-80 C-66,-120 -50,-170 0,-170 Z" fill="#d9a27a" />
    <path d="M-62,-110 C-60,-176 60,-176 62,-110 L62,-86 C40,-130 -40,-130 -62,-86 Z" fill="#2a1a12" />
    <rect x={-120} y={-4} width={240} height={52} rx={20} fill="#3f9a6a" />
    <path d="M-22,-62 Q0,-46 22,-62" stroke="#5a2a20" strokeWidth={6} fill="none" strokeLinecap="round" />
    <circle cx={-20} cy={-92} r={6} fill="#2a1a12" /><circle cx={20} cy={-92} r={6} fill="#2a1a12" />
  </g>
);

// ---------- 7,6-21,6 · DAY 8 en la parada ----------
const Dia8b: React.FC = () => {
  const T = 7.6, L = (t: number) => fr(t, T);
  return (
    <Parada dia={8} min={230} claves={[mira(0, BWY_PUNTOS.parada36 - 320, 560, 0.85), mira(L(14.3), BWY_PUNTOS.parada36 - 220, 590, 1.0, { curva: "inout" })]}
      leoRuta={[{ f: 0, x: LEO_PARADA - 1100, y: BP }, { f: L(10.4), x: LEO_PARADA - 1100, y: BP }, { f: L(13.4), x: LEO_PARADA, y: BP }]}
      leoPoses={[{ f: 0, v: BOLSILLOS }]} leoCara={[{ f: 0, v: "neutral" }]}
      hud={<RelojDia min={460} x={1580} y={60} />} />
  );
};
// «he was there yesterday too, and the day before»: tres días, la misma hora, el mismo lugar
const TresDias: React.FC = () => {
  const f = useF();
  return (
    <AbsoluteFill style={{ background: "#0d0f14" }}>
      {[6, 7, 8].map((d, k) => {
        const e = ent(f, 4 + k * 22, 16 + k * 22);
        const x = 380 + k * 580;
        const hoy = d === 8;
        const mira_ = interpolate(f, [16 + k * 22, 26 + k * 22], [0, 1], cl); // Leo gira la cabeza hacia la chica
        return (
          <div key={d} style={{ position: "absolute", left: x - 240, top: 220, width: 480, height: 600, opacity: e, transform: `translateY(${(1 - e) * 40}px)`, borderRadius: 26, background: "#1b1f27", border: `6px solid ${hoy ? ACENTO : "#3a404b"}`, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 24, width: "100%", textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 58, color: hoy ? ACENTO : "#c9ced6" }}>DAY {d}</div>
            <div style={{ position: "absolute", top: 98, width: "100%", textAlign: "center", fontFamily: F_HUD, fontWeight: 500, fontSize: 40, color: "#f4efe4" }}>7:40 AM</div>
            <svg width={480} height={600} style={{ position: "absolute", inset: 0 }}>
              <rect x={0} y={500} width={480} height={100} fill="#2a2f38" />
              <rect x={330} y={262} width={10} height={240} fill="#8a919c" />
              <rect x={298} y={222} width={74} height={74} rx={10} fill="#e9e6e0" />
              <text x={335} y={274} fontSize={38} fontWeight={800} textAnchor="middle" fill="#22262d" fontFamily="sans-serif">36</text>
              <g transform={`translate(170,0)`}>
                <circle cx={0} cy={330} r={36} fill="#e2b48c" />
                <circle cx={10 * mira_ + 8} cy={326} r={5} fill="#1d1a18" />
                <path d="M-38,326 C-40,282 40,282 38,326 C24,310 -24,310 -38,326 Z" fill="#1d1a18" />
                <rect x={-42} y={370} width={84} height={92} rx={24} fill="#3a4a62" />
                <rect x={-36} y={456} width={30} height={50} rx={10} fill="#2a2a34" /><rect x={6} y={456} width={30} height={50} rx={10} fill="#2a2a34" />
              </g>
              {hoy && <g opacity={ent(f, 70, 84)}><circle cx={430} cy={330} r={30} fill="#d9a27a" /><rect x={402} y={366} width={70} height={18} rx={8} fill="#3f9a6a" /><rect x={404} y={382} width={66} height={90} rx={22} fill="#4a4e58" /></g>}
              {[0, 1, 2, 3, 4, 5].map((q) => <circle key={q} cx={30 + ((q * 97 + f * 0.6) % 420)} cy={(q * 131 + f * 2.2) % 500} r={4} fill="#ffffff" opacity={0.6} />)}
            </svg>
          </div>
        );
      })}
      <Hud min={230} dia={8} />
    </AbsoluteFill>
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
const LibroMacro: React.FC<{ dobla?: number; titulo?: string; sub?: string; dia: number; min: number }> = ({ dobla = 40, titulo, sub, dia, min }) => {
  const f = useF();
  const d = ent(f, dobla, dobla + 22);
  const z = 1 + 0.05 * ent(f, 0, 170);
  const s = 120 * d;
  const pasa = ent(f, 120, 150); // el pulgar acomoda la hoja
  return (
    <AbsoluteFill style={{ background: "#4a4e58" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: "50% 55%" }}>
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
        </g>
      </svg>
      <Hud min={min} dia={dia} />
    </AbsoluteFill>
  );
};
// 29,2-34,2 · la ficha que Leo se arma en la cabeza: nombre (lo sabrá el día 9) y edad
const FichaMaya: React.FC = () => {
  const T = 29.2, f = useF(), L = (t: number) => fr(t, T);
  const a = ent(f, L(29.6), L(30.4)), b = ent(f, L(32.8), L(33.4));
  return (
    <Parada dia={8} min={230} claves={[mira(0, MAYA_X + 300, 600, 1.7), mira(150, MAYA_X + 300, 596, 1.78, { curva: "in" })]}
      mayaPoses={alterna(POSE_LIBRO, { ...POSE_LIBRO, hI: 70, cI: 82 }, 0, 150, 48)}
      hud={
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <Hoja x={1390} y={560} w={720} h={520} rot={-2}>
            <text x={1090} y={420} fontSize={44} fill="#5a544a" fontFamily={F_MANO}>her name</text>
            <text x={1090} y={510} fontSize={110} fill="#2a2622" fontFamily={F_MANO} fontWeight={700} opacity={a}>Maya</text>
            <text x={1390} y={505} fontSize={36} fill={ACENTO} fontFamily={F_MANO} opacity={a}>(he learns it on day 9)</text>
            <text x={1090} y={620} fontSize={44} fill="#5a544a" fontFamily={F_MANO} opacity={b}>age</text>
            <text x={1090} y={720} fontSize={110} fill="#2a2622" fontFamily={F_MANO} fontWeight={700} opacity={b}>23</text>
          </Hoja>
        </svg>
      } />
  );
};
// 34,2-40,2 · el mapa de Uptown: la parada, Truman College, el hogar de ancianos en Sheridan (de noche)
const MapaUptown: React.FC = () => {
  const T = 34.2, f = useF(), L = (t: number) => fr(t, T);
  const r1 = ent(f, L(34.8), L(36.6)), r2 = ent(f, L(37.4), L(39.4));
  const P = { stop: [905, 470], col: [600, 640], hogar: [1340, 560] };
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
  return (
    <AbsoluteFill style={{ background: "#141a22" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.04 * ent(f, 0, 180)})`, transformOrigin: "50% 50%" }}>
        <path d="M1560,0 C1520,260 1600,520 1540,760 C1500,900 1560,1000 1540,1080 L1920,1080 L1920,0 Z" fill="#1e3550" />
        <text x={1740} y={560} fontSize={34} textAnchor="middle" fill="#6f8fb4" fontFamily={F_HUD} letterSpacing={6} transform="rotate(90 1740 560)">LAKE MICHIGAN</text>
        {[180, 330, 640, 800, 950].map((y) => <rect key={y} x={0} y={y - 3} width={1560} height={6} fill="#262d38" />)}
        {[260, 440, 1120].map((x) => <rect key={x} x={x - 3} y={0} width={6} height={1080} fill="#262d38" />)}
        <rect x={0} y={636} width={1560} height={10} fill="#3a424f" />
        <text x={150} y={624} fontSize={28} fill="#8a929e" fontFamily={F_HUD} letterSpacing={4}>WILSON</text>
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
      </svg>
      <GranNumero rotulo="MAYA" claves={[{ f: 0, v: 23 }]} sufijo=" yrs" x={960} y={60} color="#f4efe6" tam={70} desde={2} />
      <Hud min={230} dia={8} />
    </AbsoluteFill>
  );
};
const SonrieMaya: React.FC = () => (
  <MayaP dur={51} dia={8} min={230} poses={[{ f: 0, v: POSE_LIBRO }, { f: 6, v: { ...POSE_LIBRO, cabeza: -4 } }]} cara={[{ f: 0, v: "neutral" }, { f: 12, v: "feliz" }]} />
);
const SonrieLeo: React.FC = () => (
  <LeoP dur={51} dia={8} min={230} cara={[{ f: 0, v: "sorpresa" }, { f: 20, v: "feliz" }]} poses={[{ f: 0, v: BOLSILLOS }, { f: 16, v: { ...BOLSILLOS, cabeza: -6 } }]} />
);

// ---------- 52,9-72,3 · cien fotos, mil chicas, el contador ----------
const Noche4b: React.FC = () => {
  const T = 52.9, L = (t: number) => fr(t, T);
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX - 80, 650, 1.5), mira(L(57.9), LX - 100, 620, 1.6)]} detras={oscuro}
      medio={<>
        <MaraCuarto esc={(f) => k01(f, 0, L(57.9), 1.0, 1.3)} caras={[{ f: 0, v: "picaro" }]} pose={{ hD: 120, cD: 30, hI: 40, cI: 70, cabeza: 14 }} />
        <LeoCama caras={[{ f: 0, v: "triste" }, { f: L(55.5), v: "cansado" }]} poses={alterna(SENT_CEL, { ...SENT_CEL, cD: 136 }, 0, L(57.9), 10)} />
      </>}
      hud={<><Polaroids desde={L(54.6)} hasta={L(57.6)} n={100} r0={380} /><Hud min={230} dia={8} /></>} />
  );
};
const TelFeed: React.FC = () => (
  <AbsoluteFill style={{ background: "#07090e" }}>
    <TelGrande modo="feed" vel={20} pulgar x={960} y={560} s={0.95} desde={0} />
    <Hud min={[{ f: 0, v: 230 }, { f: 30, v: 280, d: 70 }]} dia={8} estado="sube" />
  </AbsoluteFill>
);
// mil chicas hechas de luz… y en el medio la única de verdad, que se apaga
const MilChicas: React.FC = () => {
  const f = useF();
  const C = 50, R = 20;
  const ella = 1 - 0.75 * ent(f, 40, 110);
  return (
    <AbsoluteFill style={{ background: "#07090e" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: C * R }).map((_, i) => {
          const x = 205 + (i % C) * 30.8, y = 300 + Math.floor(i / C) * 34;
          if (Math.abs(x - 960) < 70 && Math.abs(y - 610) < 90) return null;
          const t0 = 8 + random(`mc${i}`) * 92;
          const o = interpolate(f, [t0, t0 + 6], [0, 1], cl);
          if (o <= 0) return null;
          return <g key={i} opacity={o * (0.6 + 0.4 * Math.sin(f / 6 + i))}><circle cx={x} cy={y - 8} r={6} fill={ACENTO} /><path d={`M${x - 8},${y + 12} C${x - 8},${y - 2} ${x + 8},${y - 2} ${x + 8},${y + 12} Z`} fill={ACENTO} /></g>;
        })}
        <g opacity={ella}>
          <circle cx={960} cy={576} r={26} fill="#d9a27a" />
          <path d="M934,570 C932,538 988,538 986,570 C976,556 944,556 934,570 Z" fill="#2a1a12" />
          <rect x={934} y={600} width={52} height={14} rx={6} fill="#3f9a6a" />
          <path d="M932,672 C932,614 988,614 988,672 Z" fill="#4a4e58" />
        </g>
      </svg>
      <GranNumero rotulo="GIRLS WHO ARE NOT HER" claves={[{ f: 0, v: 0 }, { f: 8, v: 1000, d: 92 }]} x={960} y={70} color={ACENTO} tam={96} desde={2} />
      <Hud min={[{ f: 0, v: 280 }, { f: 40, v: 300, d: 60 }]} dia={8} estado="sube" />
    </AbsoluteFill>
  );
};
const Cuenta8: React.FC = () => (
  <AbsoluteFill style={{ background: "#0d0f14" }}>
    <TelGrande modo="screentime" min={0} minHasta={320} x={760} y={560} s={0.92} desde={2} />
    <GranNumero rotulo="DAY OF 30" claves={[{ f: 0, v: 8 }]} x={1440} y={300} color="#f4efe6" tam={230} desde={10} />
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
const FarolMesa: React.FC = () => (
  <Lav claves={[mira(0, LAV_PUNTOS.farol - 40, LP - 230, 2.4), mira(72, LAV_PUNTOS.farol - 30, LP - 232, 2.55, { curva: "in" })]} leoCara={[{ f: 0, v: "cansado" }]}
    tenzoPoses={alterna(T_DOBLA_A, T_DOBLA_B, 0, 72, 22)} doblez={1} hud={<Hud min={320} dia={8} />} />
);
const Chica6a: React.FC = () => {
  const T = 82.4, L = (t: number) => fr(t, T);
  return (
    <Lav claves={[mira(0, 1510, 640, 1.85), mira(L(86.5), 1510, 636, 1.95, { curva: "in" })]}
      leoCara={[{ f: 0, v: "neutral" }, { f: L(84.0), v: "feliz" }]} leoHabla={[[0, L(84.7)]]} leoPoses={[{ f: 0, v: { hD: 15, cD: 30, hI: 15, cI: 30 } }, { f: 10, v: { hD: 55, cD: 50, hI: 15, cI: 30 } }, { f: 50, v: { hD: 15, cD: 30, hI: 15, cI: 30 } }]}
      tenzoCara={[{ f: 0, v: "neutral" }, { f: L(84.7), v: "feliz" }]} tenzoHabla={[[L(84.7), L(86.4)]]} tenzoPoses={alterna(T_DOBLA_A, T_DOBLA_B, 0, L(84.7), 22)} tenzoGiros={[{ f: 0, v: 0 }, { f: L(84.6), v: -0.5 }]}
      doblez={0.7}
      hud={<>
        <Globo texto="I met a girl." x={560} y={200} desde={4} hasta={L(84.7)} cola="abajo" tam={50} />
        <Globo texto="Ah." x={1360} y={200} desde={L(84.8)} hasta={L(86.5)} cola="abajo" tam={50} />
        <Hud min={320} dia={8} />
      </>} />
  );
};
const Chica6b: React.FC = () => {
  const T = 86.5, L = (t: number) => fr(t, T);
  return (
    <LeoLav silla={false} dur={L(94)} cara={[{ f: 0, v: "triste" }, { f: L(89.5), v: "asco" }]} habla={[[0, L(94)]]}
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
  const T = 96.1, L = (t: number) => fr(t, T);
  return (
    <Lav claves={[mira(0, 1520, 640, 1.5), mira(L(99.1), 1540, 630, 1.62, { curva: "in" })]} leoCara={[{ f: 0, v: "triste" }, { f: L(97.5), v: "duda" }]}
      tenzoPoses={alterna(T_HABLA_A, T_HABLA_B, 0, L(99.1), 24)} tenzoCara={[{ f: 0, v: "feliz" }]} tenzoHabla={[[0, L(99.1)]]} doblez={1}
      hud={<><Globo texto="Let me tell you about two monks… and a river." x={1180} y={240} desde={4} hasta={L(99.1)} cola="abajo" tam={44} /><Hud min={320} dia={8} /></>} />
  );
};
// el farol parpadea y el lavadero se apaga: sólo queda la llama, que se vuelve el sol de Japón
const Farol7b: React.FC = () => {
  const f = useF();
  const negro = ent(f, 24, 74), oro = ent(f, 70, 108);
  return (
    <AbsoluteFill>
      <Lav claves={[mira(0, 1580, 640, 1.5), mira(54, LAV_PUNTOS.farol, LP - 200, 2.6), mira(108, LAV_PUNTOS.farol, LP - 200, 3.3)]}
        leoCara={[{ f: 0, v: "duda" }]} tenzoPoses={[{ f: 0, v: { hD: 10, cD: 20, hI: 10, cI: 20 } }]} tenzoCara={[{ f: 0, v: "feliz" }]} doblez={1}
        farol={f > 20 && f < 30 ? 0.4 : f > 36 && f < 40 ? 0.5 : 1} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, transparent 0px, transparent 130px, rgba(0,0,0,0.92) 520px)", opacity: negro }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${ORO} 0px, ${ORO}cc ${200 + 900 * oro}px, transparent ${400 + 1300 * oro}px)`, opacity: oro }} />
    </AbsoluteFill>
  );
};

// ---------- 116-174 · la parábola ----------
const Ekido8b: React.FC = () => {
  const T = 116, f = useF(), L = (t: number) => fr(t, T);
  const x = 1200 + f * 1.2;
  return (
    <Escena Set={CaminoMontana} pal={PAL_ANT} claves={[mira(0, 1150, 560, 1.25), mira(L(126), 1150 + L(126) * 1.2, 566, 1.35)]}
      medio={<Actor look={EKIDO} escala={ESC} seed={23} luz={L_ANT} ruta={[{ f: 0, x, y: JP }, { f: 600, x: x + 720, y: JP }]} dir={[{ f: 0, v: 1 }]}
        poses={[{ f: 0, v: { hD: 20, cD: 120, hI: 20, cI: 120, cabeza: 14 } }]} caras={[{ f: 0, v: "neutral" }, { f: L(119.1), v: "enojo" }]}
        miradas={[{ f: 0, v: { x: 0.2, y: 1 } }]} giros={[{ f: 0, v: 0 }, { f: L(120.5), v: -0.6 }, { f: L(122.1), v: 0.6 }, { f: L(123.8), v: 0 }]} />}
      hud={<Lista x={1180} y={210} titulo="EKIDO'S VOWS · NEVER" ancho={600} items={[
        { t: "look at women", desde: L(120.4), cruz: true },
        { t: "speak to women", desde: L(122.0), cruz: true },
        { t: "touch women", desde: L(123.7), cruz: true },
        { t: "EVER.", desde: L(124.8), color: ACENTO },
      ]} />} />
  );
};
const EkidoAparta: React.FC = () => <Rio T={141.7} caraEkido="enojo" claves={[mira(0, 640, 590, 1.5), mira(81, 650, 590, 1.62, { curva: "in" })]} />;
const TanzanVa: React.FC = () => <Rio T={144.4} caraEkido="enojo" claves={[mira(0, 760, 600, 1.15), mira(fr(147.8, 144.4), 900, 610, 1.3)]} />;
const Camina12b: React.FC = () => {
  const T = 160.3, f = useF(), L = (t: number) => fr(t, T);
  const ex = 1300 + f * 0.9;
  const rojo = ent(f, L(164.8), L(172));
  const sol = interpolate(f, [0, L(174)], [170, 520], cl);
  return (
    <Escena Set={CaminoMontana} pal={PAL_ANT} claves={[mira(0, 1500, 580, 0.95), mira(L(164.8), ex + 120, 600, 1.3), mira(L(174), ex + 160, 600, 1.42)]}
      medio={<>
        <Actor look={TANZAN} escala={ESC} seed={22} luz={L_ANT} ruta={[{ f: 0, x: ex + 280, y: JP }, { f: 600, x: ex + 280 + 540, y: JP }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "feliz" }]} />
        <Actor look={EKIDO} escala={ESC} seed={23} luz={L_ANT} ruta={[{ f: 0, x: ex, y: JP }, { f: 600, x: ex + 540, y: JP }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: { hD: 20, cD: 120, hI: 20, cI: 120, cabeza: 6 } }, { f: L(166.3), v: { hD: 8, cD: 150, hI: 8, cI: 150, cabeza: 16, tronco: 8 } }]} caras={[{ f: 0, v: "neutral" }, { f: L(166.3), v: "enojo" }]} />
        <Halo x={ex} y={JP - 330} r={220} color="#ff5a3a" fuerza={0.5 * rojo} />
      </>}
      hud={<>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><circle cx={1660} cy={sol} r={120} fill="#ffcf7a" opacity={0.25} /><circle cx={1660} cy={sol} r={58} fill="#ffd890" opacity={0.95} /></svg>
        <GranNumero rotulo="HOURS WALKING" claves={[{ f: 0, v: 0 }, { f: L(162.3), v: 1 }, { f: L(163.6), v: 2 }, { f: L(172.2), v: 3 }, { f: L(173.2), v: 4 }]} x={960} y={60} color="#fff3dc" tam={110} desde={L(162.1)} />
      </>} />
  );
};

// ---------- 198,7-265,3 · el lavadero: ¿quién era el puro? ----------
const LeoQuieto: React.FC = () => <LeoLav dur={93} cara={[{ f: 0, v: "sorpresa" }, { f: 50, v: "neutral" }]} poses={[{ f: 0, v: { tronco: 6, pI: 80, rI: 90, pD: 85, rD: 95, hD: 30, cD: 110, hI: 25, cI: 110, cabeza: 10 } }]} />;
const TenzoLimpio: React.FC = () => {
  const T = 201.8, L = (t: number) => fr(t, T);
  return (
    <TenzoLav dur={120} cara={[{ f: 0, v: "feliz" }]} habla={[[0, L(205.8)]]} poses={alterna(T_HABLA_A, T_HABLA_B, 0, 120, 26)}
      hud={<Lista x={120} y={260} titulo="TANZAN" ancho={560} items={[{ t: "touched her", desde: L(202.3) }, { t: "heart: clean", desde: L(204.6), color: ORO }]} />} />
  );
};
const Suelta15b: React.FC = () => (
  <Rio T={153.6} vel={0.8} claves={[mira(0, 2300, 610, 1.4), mira(fr(211.1, 205.8), 2440, 610, 1.5)]}
    hud={<Lista x={110} y={200} titulo="TANZAN" ancho={720} items={[{ t: "saw a person who needed help", desde: 6 }, { t: "gave her something", desde: fr(208.0, 205.8) }, { t: "let her go", desde: fr(210.5, 205.8), color: ORO }]} tam={42} />} />
);
const Carga15b: React.FC = () => {
  const f = useF();
  const x = 1200 + f * 1.6;
  return (
    <Escena Set={CaminoMontana} pal={PAL_ANT} claves={[mira(0, 1260, 600, 1.3), mira(162, 1260 + 162 * 1.6, 600, 1.4)]}
      medio={<EkidoCargando x={x} y={JP} dir={1} fantasma={ent(f, 0, 20)} caras={[{ f: 0, v: "enojo" }]} />}
      hud={<Lista x={1170} y={200} titulo="EKIDO" ancho={660} tam={42} items={[{ t: "never touched her", desde: fr(212.3, 211.1) }, { t: "carried her 4 hours", desde: fr(214.9, 211.1), color: ACENTO }, { t: "on his back", desde: fr(216.2, 211.1), color: ACENTO }]} />} />
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
        <Pildora texto="TANZAN · CARRIED HER 5 MINUTES" x={480} y={110} desde={2} color="#fff3dc" tam={32} />
        <Pildora texto="EKIDO · CARRIED HER 4 HOURS" x={1440} y={110} desde={8} color={ACENTO} tam={32} />
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
  const T = 221.6, L = (t: number) => fr(t, T);
  return (
    <TenzoLav dur={120} cara={[{ f: 0, v: "neutral" }, { f: L(223.6), v: "feliz" }]} habla={[[0, L(225.6)]]} poses={[...alterna(T_HABLA_A, T_HABLA_B, 0, L(223.9), 26), { f: L(223.9), v: "señalar" }]}
      hud={<Lista x={110} y={250} titulo="LUST IS…" ancho={600} items={[{ t: "in the body", desde: L(222.3), tacha: true }, { t: "in the carrying", desde: L(224.4), color: ACENTO }]} tam={50} />} />
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
      {f > L(229.5) && <ManoLeo texto="and use, and use." x={1050} y={150} desde={L(229.5)} tam={62} />}
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
  const T = 238.2, L = (t: number) => fr(t, T);
  return (
    <TenzoLav dur={147} cara={[{ f: 0, v: "feliz" }]} habla={[[0, L(243.1)]]} poses={alterna(T_HABLA_A, T_HABLA_B, 0, 147, 26)}
      hud={<>
        <Globo texto="Meet the real one." x={1380} y={260} desde={2} hasta={L(240.3)} cola="abajo" tam={50} />
        <Globo texto="She's much more interesting than the picture." x={1300} y={260} desde={L(240.4)} hasta={147} cola="abajo" tam={42} />
      </>} />
  );
};
// la foto contra la de verdad: tres «nunca» de la foto; la real bosteza, se ríe, pregunta
const FotoVsReal: React.FC = () => {
  const T = 243.1, f = useF(), L = (t: number) => fr(t, T);
  const filas = [{ t: "never has a bad day", d: L(243.5) }, { t: "never surprises you", d: L(245.4) }, { t: "never asks you anything", d: L(247.8) }];
  return (
    <AbsoluteFill style={{ background: "#0b0c10" }}>
      <AbsoluteFill style={{ clipPath: "inset(0 0 0 964px)" }}>
        <Parada dia={8} min={320} leoX={-5000} claves={[mira(0, MAYA_X - 270, 600, 1.8), mira(204, MAYA_X - 270, 596, 1.86)]}
          mayaPoses={[{ f: 0, v: POSE_LIBRO }, { f: L(243.4), v: { ...POSE_LIBRO, hI: 40, cI: 145, cabeza: 6 } }, { f: L(244.7), v: POSE_LIBRO }, { f: L(245.5), v: { ...POSE_LIBRO, cabeza: -8, tronco: -8 } }, { f: L(246.4), v: { ...POSE_LIBRO, cabeza: -2, tronco: -2 } }, { f: L(247.0), v: { ...POSE_LIBRO, cabeza: -8, tronco: -8 } }, { f: L(247.7), v: { hD: 60, cD: 60, hI: 30, cI: 40, cabeza: -4 } }]}
          mayaCara={[{ f: 0, v: "cansado" }, { f: L(245.3), v: "risa" }, { f: L(247.6), v: "duda" }]} mayaHabla={[[L(247.9), L(249.5)]]}
          hud={<Globo texto="And you?" x={1500} y={300} desde={L(248.0)} hasta={L(249.9)} cola="abajo" tam={50} />} />
      </AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={0} width={960} height={1080} fill="#14171d" />
        <FotoPlana x={480} y={440} s={0.9} rot={-3} />
        <rect x={958} y={0} width={6} height={1080} fill="#f4efe6" opacity={0.8} />
      </svg>
      <div style={{ position: "absolute", left: 0, width: 960, top: 46, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 44, letterSpacing: 6, color: "#c9c2b4" }}>THE PICTURE</div>
      <div style={{ position: "absolute", left: 960, width: 960, top: 46, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 44, letterSpacing: 6, color: "#3f9a6a", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>THE REAL ONE</div>
      {filas.map((r, k) => {
        const e = ent(f, r.d, r.d + 10);
        return <div key={k} style={{ position: "absolute", left: 130, top: 780 + k * 78, fontFamily: F_HUD, fontWeight: 600, fontSize: 46, color: "#f4efe6", opacity: e, transform: `translateX(${(1 - e) * -24}px)`, whiteSpace: "nowrap" }}><span style={{ color: ACENTO, marginRight: 18 }}>✕</span>{r.t}</div>;
      })}
    </AbsoluteFill>
  );
};
const TenzoRisa: React.FC = () => {
  const T = 249.9, L = (t: number) => fr(t, T);
  return (
    <TenzoLav dur={147} cara={[{ f: 0, v: "risa" }, { f: 40, v: "feliz" }]} habla={[[L(251.3), L(254.8)]]} poses={[{ f: 0, v: { hD: 40, cD: 60, hI: 40, cI: 60, tronco: -6, cabeza: -8 } }, { f: 14, v: { hD: 30, cD: 50, hI: 30, cI: 50, tronco: 2 } }, { f: 28, v: { hD: 40, cD: 60, hI: 40, cI: 60, tronco: -6, cabeza: -8 } }, { f: 44, v: T_HABLA_A }]}
      hud={<Frase texto="Pictures are very boring when you know the real thing." desde={L(251.3)} y={200} tam={52} />} />
  );
};
const Mara17a: React.FC = () => {
  const T = 254.8, L = (t: number) => fr(t, T);
  return (
    <Lav leo="silla" claves={[mira(0, LAV_PUNTOS.leo - 120, 560, 1.4), mira(L(259.9), LAV_PUNTOS.leo - 140, 540, 1.6)]} leoCara={[{ f: 0, v: "triste" }]} tenzoCara={[{ f: 0, v: "feliz" }]} doblez={1}
      mara={<MaraLav esc={1.4} caras={[{ f: 0, v: "risa" }, { f: L(257.7), v: "picaro" }]} pose={{ hD: 80, cD: 40, hI: 60, cI: 50, cabeza: -10, tronco: -8 }} />}
      hud={<>
        <ManoMara texto="the real one?" x={1250} y={420} desde={L(257.7)} hasta={L(258.6)} tam={66} />
        <ManoMara texto="she'll never want you." x={1250} y={420} desde={L(258.6)} tam={66} />
        <Hud min={320} dia={8} />
      </>} />
  );
};
const Mara17b: React.FC = () => (
  <LeoLav dur={75} cara={[{ f: 0, v: "triste" }]} poses={[{ f: 0, v: { tronco: 14, pI: 80, rI: 90, pD: 85, rD: 95, hD: 30, cD: 100, hI: 25, cI: 100, cabeza: 20 } }]}
    hud={<><ManoMara texto="a delivery guy" x={1180} y={200} desde={2} tam={64} /><ManoMara texto="who lives on a mattress." x={1180} y={290} desde={22} tam={64} /></>} />
);
const Mara17c: React.FC = () => {
  const T = 262.4, L = (t: number) => fr(t, T);
  return (
    <Lav leo="silla" claves={[mira(0, LAV_PUNTOS.leo - 200, 520, 1.7), mira(87, LAV_PUNTOS.leo - 210, 510, 1.8)]} leoCara={[{ f: 0, v: "triste" }]} doblez={1}
      mara={<MaraLav esc={1.45} caras={[{ f: 0, v: "feliz" }, { f: 30, v: "risa" }]} pose={{ hD: 130, cD: 20, hI: 120, cI: 30, cabeza: -6, tronco: -4 }} />}
      hud={<>
        <Polaroids desde={0} hasta={12} n={36} contador={false} r0={300} cx={760} cy={480} />
        <ManoMara texto="stay with the pictures." x={1060} y={760} desde={2} hasta={L(263.6)} tam={64} />
        <ManoMara texto="they never say no." x={1060} y={760} desde={L(263.6)} tam={64} />
        <Hud min={320} dia={8} />
      </>} />
  );
};

// ---------- 272,8-326 · DAY 9: el libro, el «stop», la presentación ----------
const Libro18a: React.FC = () => (
  <MayaP dur={42} poses={alterna(POSE_LIBRO, { ...POSE_LIBRO, hI: 75, cI: 78 }, 0, 42, 30)} />
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
  const T = 291.4, L = (t: number) => fr(t, T);
  return <LeoP dur={120} cara={[{ f: 0, v: "determinado" }, { f: L(292.4), v: "feliz" }]} habla={[[L(292.4), L(295.1)]]} poses={[{ f: 0, v: BOLSILLOS }, { f: L(292.4), v: { hD: 45, cD: 60, hI: -20, cI: -40 } }]}
    hud={<Globo texto="Is it good? The book?" x={480} y={300} desde={L(292.4)} hasta={L(295.4)} cola="abajo" tam={50} />} />;
};
const Habla19b: React.FC = () => (
  <MayaP dur={117} poses={[{ f: 0, v: POSE_LIBRO }, { f: 8, v: { ...POSE_LIBRO, cabeza: -6 } }, { f: 34, v: { ...POSE_LIBRO, cabeza: -10, tronco: -8 } }, { f: 50, v: { ...POSE_LIBRO, cabeza: -2, tronco: -2 } }, { f: 66, v: { ...POSE_LIBRO, cabeza: -10, tronco: -8 } }, { f: 86, v: { ...POSE_LIBRO, cabeza: -4 } }]}
    cara={[{ f: 0, v: "neutral" }, { f: 10, v: "sorpresa" }, { f: 30, v: "risa" }]} />
);
const Monja19a: React.FC = () => {
  const T = 299.3, L = (t: number) => fr(t, T);
  return <MayaP dur={96} poses={[{ f: 0, v: { ...POSE_LIBRO, cabeza: -4 } }, { f: L(300.9), v: { hD: 50, cD: 100, hI: 70, cI: 40, cabeza: -2 } }]} cara={[{ f: 0, v: "sorpresa" }, { f: L(300.9), v: "feliz" }]} habla={[[L(300.9), L(302.5)]]}
    hud={<Globo texto="It's weird, actually." x={1440} y={300} desde={L(300.9)} hasta={96} cola="abajo" tam={50} />} />;
};
// los poemas de una monja, hace dos mil años, en la India (inserto de recuerdo: escribe en hoja de palma)
const Monja19b: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0d0f14" }}>
      <Recuerdo desde={0}>
        <Escena Set={Vaishali} pal={PAL_ANT} setProps={{ monjes: false }} claves={[mira(0, VAI_PUNTOS.jardin, 640, 1.6), mira(126, VAI_PUNTOS.jardin + 20, 640, 1.7)]}
          medio={<Actor look={AMRAPALI_VIEJA} escala={ESC} seed={31} luz={L_ANT} ruta={[{ f: 0, x: VAI_PUNTOS.jardin, y: 900 }]} dir={[{ f: 0, v: 1 }]}
            poses={alterna({ hD: 70, cD: 100, hI: 50, cI: 90, cabeza: 18 }, { hD: 64, cD: 112, hI: 50, cI: 90, cabeza: 18 }, 0, 126, 9)} caras={[{ f: 0, v: "feliz" }]}
            enManoI={<rect x={-60} y={-14} width={150} height={30} rx={6} fill="#c9a86a" />} />} />
      </Recuerdo>
      <Pildora texto="POEMS BY A NUN · INDIA · 2,000 YEARS AGO" x={960} y={880} desde={6} color="#ffd890" tam={36} />
      <Hud min={0} dia={9} />
    </AbsoluteFill>
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
  const T = 308.8, L = (t: number) => fr(t, T);
  return <LeoP dur={81} cara={[{ f: 0, v: "duda" }]} habla={[[0, L(311.2)]]} poses={[{ f: 0, v: BOLSILLOS }, { f: 6, v: { hD: 50, cD: 60, hI: -20, cI: -40 } }]}
    hud={<Globo texto="Was her name Amrapali?" x={480} y={300} desde={2} hasta={81} cola="abajo" tam={50} />} />;
};
const MayaMira19: React.FC = () => {
  const T = 311.5, L = (t: number) => fr(t, T);
  return <MayaP dur={87} poses={[{ f: 0, v: { ...POSE_LIBRO, cabeza: -6 } }, { f: 20, v: { hD: 20, cD: 80, hI: 20, cI: 80, cabeza: -6 } }]} cara={[{ f: 0, v: "sorpresa" }]} habla={[[L(313.1), L(314.4)]]}
    hud={<Globo texto="How do you know that?" x={1440} y={300} desde={L(313.1)} hasta={87} cola="abajo" tam={50} />} />;
};
const Monje19b: React.FC = () => (
  <LeoP dur={111} cara={[{ f: 0, v: "neutral" }, { f: 20, v: "feliz" }]} habla={[[0, 106]]} poses={[{ f: 0, v: BOLSILLOS }, { f: 10, v: { hD: 50, cD: 60, hI: -20, cI: -40 } }, { f: 60, v: { hD: 30, cD: 30, hI: -20, cI: -40, cabeza: -4 } }]}
    hud={<>
      <Globo texto="An old monk told me about her." x={480} y={300} desde={2} hasta={60} cola="abajo" tam={46} />
      <Globo texto="In a laundromat." x={480} y={300} desde={61} hasta={111} cola="abajo" tam={50} />
    </>} />
);
const Risa19: React.FC = () => (
  <Parada dia={9} min={0} claves={[mira(0, BWY_PUNTOS.parada36, 610, 1.45), mira(177, BWY_PUNTOS.parada36, 605, 1.55, { curva: "in" })]}
    leoCara={[{ f: 0, v: "duda" }, { f: 120, v: "feliz" }]} leoPoses={[{ f: 0, v: BOLSILLOS }]}
    mayaPoses={[{ f: 0, v: { ...POSE_LIBRO, cabeza: -10, tronco: -8 } }, { f: 16, v: { ...POSE_LIBRO, cabeza: -2 } }, { f: 30, v: { ...POSE_LIBRO, cabeza: -10, tronco: -8 } }, { f: 50, v: { ...POSE_LIBRO, cabeza: -2 } }]}
    mayaCara={[{ f: 0, v: "risa" }, { f: 120, v: "feliz" }]} mayaHabla={[[10, 160]]}
    hud={<>
      <Globo texto="Okay, that's the strangest thing" x={1240} y={240} desde={10} hasta={90} cola="abajo" tam={42} />
      <Globo texto="anyone has ever said to me at a bus stop." x={1180} y={240} desde={91} hasta={177} cola="abajo" tam={40} />
    </>} />
);
const Mano19b: React.FC = () => {
  const T = 324.0, L = (t: number) => fr(t, T);
  return (
    <Parada dia={9} min={0} claves={[mira(0, BWY_PUNTOS.parada36, 640, 1.75), mira(57, BWY_PUNTOS.parada36, 636, 1.82, { curva: "in" })]}
      leoCara={[{ f: 0, v: "feliz" }]} leoHabla={[[L(325.3), L(325.9)]]} leoPoses={[{ f: 0, v: BOLSILLOS }, { f: 14, v: { hD: 75, cD: 10, hI: -20, cI: -40 } }]}
      mayaPoses={[{ f: 0, v: { hD: 50, cD: 100, hI: 75, cI: 10 } }]} mayaCara={[{ f: 0, v: "feliz" }]} mayaHabla={[[0, L(325.3)]]}
      hud={<>
        <Globo texto="I'm Maya." x={1200} y={280} desde={0} hasta={L(325.3)} cola="abajo" tam={50} />
        <Globo texto="Leo." x={760} y={280} desde={L(325.3)} hasta={57} cola="abajo" tam={50} />
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
const Bus20a: React.FC = () => (
  <Bus claves={[mira(0, 1440, 600, 1.3), mira(99, 1440, 610, 1.42, { curva: "inout" })]} hud={<><Paradas11 t0={325.9} /><Hud min={0} dia={9} /></>} />
);
const Bus20b: React.FC = () => (
  <Bus claves={[mira(0, COLECTIVO.asientoMaya - 40, 640, 1.9), mira(114, COLECTIVO.asientoMaya - 40, 636, 2.0, { curva: "in" })]} mayaHabla={[[0, 114]]} mayaCara={[{ f: 0, v: "feliz" }, { f: 50, v: "risa" }, { f: 80, v: "feliz" }]}
    mayaPoses={alterna({ tronco: 4, pI: 80, rI: 90, pD: 85, rD: 95, ...POSE_LIBRO }, { tronco: 4, pI: 80, rI: 90, pD: 85, rD: 95, hD: 50, cD: 100, hI: 80, cI: 40, cabeza: 6 }, 0, 114, 30)}
    hud={<><Paradas11 t0={329.2} /><Hud min={0} dia={9} /></>} />
);
const Bus20c: React.FC = () => (
  <Bus claves={[mira(0, COLECTIVO.asientoLeo + 40, 640, 1.9), mira(45, COLECTIVO.asientoLeo + 40, 636, 2.0, { curva: "in" })]} leoHabla={[[0, 42]]} leoCara={[{ f: 0, v: "risa" }]}
    hud={<><Paradas11 t0={333.0} /><Hud min={0} dia={9} /></>} />
);
const Bus20d: React.FC = () => (
  <Bus claves={[mira(0, 1440, 630, 1.5), mira(93, 1450, 628, 1.58, { curva: "in" })]} mayaHabla={[[0, 70]]} mayaCara={[{ f: 0, v: "feliz" }]} leoCara={[{ f: 0, v: "feliz" }]}
    hud={<><Paradas11 t0={334.5} /><Hud min={0} dia={9} /></>} />
);
// el poema: «her hair, once black like bees, now white like hemp» — el pelo se vuelve blanco al decirlo
const Poema20b: React.FC = () => {
  const T = 337.6, f = useF(), L = (t: number) => fr(t, T);
  const vieja = ent(f, L(341.3), L(342.6));
  const JOVEN = { ...AMRAPALI_VIEJA, ceja: "#2a1a12", accesorios: [{ t: "pelo" as const, forma: "bob" as const, color: "#17100d" }, { t: "tunica" as const, color: "#e9dcc4", largo: 1 }], alto: 1 };
  return (
    <Escena Set={Vaishali} pal={PAL_ANT} setProps={{ monjes: false }} claves={[mira(0, VAI_PUNTOS.jardin + 250, 600, 1.5), mira(L(343.3), VAI_PUNTOS.jardin + 280, 606, 1.66)]}
      medio={<>
        <Actor look={JOVEN as typeof AMRAPALI_VIEJA} escala={ESC} seed={31} luz={L_ANT} ruta={[{ f: 0, x: VAI_PUNTOS.jardin, y: 900 }]} dir={[{ f: 0, v: 1 }]} opacidad={() => 1 - vieja}
          poses={[{ f: 0, v: { hD: 70, cD: 120, hI: 10, cI: 20, cabeza: -6 } }]} caras={[{ f: 0, v: "feliz" }]} />
        <Actor look={AMRAPALI_VIEJA} escala={ESC} seed={31} luz={L_ANT} ruta={[{ f: 0, x: VAI_PUNTOS.jardin, y: 900 }]} dir={[{ f: 0, v: 1 }]} opacidad={() => vieja}
          poses={[{ f: 0, v: { hD: 70, cD: 120, hI: 10, cI: 20, cabeza: 8 } }]} caras={[{ f: 0, v: "neutral" }, { f: L(342.6), v: "feliz" }]} />
      </>}
      hud={<>
        <ManoLeo texto="her hair," x={1060} y={250} desde={L(339.3)} tam={62} />
        <ManoLeo texto="once black like bees," x={1060} y={340} desde={L(339.9)} tam={62} />
        <ManoLeo texto="now white like hemp." x={1060} y={500} desde={L(341.4)} tam={62} />
      </>} />
  );
};
const Bolsillo20b: React.FC = () => (
  <Bus claves={[mira(0, COLECTIVO.asientoLeo + 40, 640, 1.85), mira(126, COLECTIVO.asientoLeo + 40, 636, 1.95, { curva: "in" })]} leoCara={[{ f: 0, v: "feliz" }, { f: 60, v: "risa" }]} mayaHabla={[[0, 120]]}
    hud={<><Paradas11 t0={343.3} /><GranNumero rotulo="TIMES HE LOOKED AT HIS PHONE" claves={[{ f: 0, v: 0 }]} x={1520} y={250} color={ACENTO} tam={110} desde={fr(345.5, 343.3)} /><Hud min={0} dia={9} /></>} />
);
const Puerta21a: React.FC = () => {
  const T = 347.5, L = (t: number) => fr(t, T);
  return (
    <Bus vel={0} claves={[mira(0, 2200, 600, 1.0), mira(L(351.5), COLECTIVO.puerta - 240, 620, 1.3)]}
      mayaSentada={false} mayaRuta={[{ f: 0, x: COLECTIVO.asientoMaya, y: KP }, { f: L(349.6), x: COLECTIVO.puerta - 40, y: KP }]}
      mayaDir={[{ f: 0, v: 1 }, { f: L(349.6), v: -1 }]} mayaPoses={[{ f: 0, v: { hD: 15, cD: 30, hI: 15, cI: 30 } }]} mayaCara={[{ f: 0, v: "feliz" }]}
      hud={<><Paradas11 t0={347.5} /><Hud min={0} dia={9} /></>} />
  );
};
const Puerta21b: React.FC = () => (
  <Bus vel={0} claves={[mira(0, COLECTIVO.puerta - 100, 620, 1.85), mira(48, COLECTIVO.puerta - 100, 616, 1.95, { curva: "in" })]}
    mayaSentada={false} mayaRuta={[{ f: 0, x: COLECTIVO.puerta - 40, y: KP }]} mayaDir={[{ f: 0, v: -1 }]} mayaPoses={[{ f: 0, v: { hD: 60, cD: 60, hI: 15, cI: 30, cabeza: -4 } }]} mayaCara={[{ f: 0, v: "feliz" }]} mayaHabla={[[0, 46]]}
    hud={<><Globo texto="Same time tomorrow?" x={960} y={290} desde={0} hasta={48} cola="abajo" tam={50} /><Hud min={0} dia={9} /></>} />
);
const Puerta21c: React.FC = () => (
  <Bus vel={0} claves={[mira(0, COLECTIVO.asientoLeo + 40, 640, 1.9), mira(33, COLECTIVO.asientoLeo + 40, 636, 1.95)]} mayaSentada={false} mayaRuta={[{ f: 0, x: 5000, y: KP }]} leoHabla={[[0, 30]]} leoCara={[{ f: 0, v: "risa" }]}
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
  const L = (t: number) => fr(t, 363.4);
  const f = useF();
  const cartas = [{ t: "THE BOOK", d: L(363.4) }, { t: "THE POEM", d: L(364.3) }, { t: "11 STOPS", d: L(365.1) }];
  return (
    <LeoLav silla={false} dur={102} dia={9} min={110} cara={[{ f: 0, v: "risa" }]} habla={[[0, 100]]} poses={alterna({ hD: 60, cD: 40, hI: 15, cI: 30 }, { hD: 30, cD: 70, hI: 60, cI: 40 }, 0, 102, 26)}
      hud={<>{cartas.map((c, k) => {
        const e = ent(f, c.d, c.d + 10);
        return <div key={k} style={{ position: "absolute", left: 110 + k * 230, top: 190, width: 210, height: 150, borderRadius: 18, background: "#f4efe4", border: "5px solid #3f9a6a", opacity: e, transform: `translateY(${(1 - e) * 30}px) rotate(${(k - 1) * 4}deg)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 34, color: "#22262d", textAlign: "center" }}>{c.t}</div>;
      })}</>} />
  );
};
const TenzoEscucha: React.FC = () => (
  <TenzoLav dur={138} leo="parado" dia={9} min={110} cara={[{ f: 0, v: "feliz" }]} poses={alterna({ hD: 10, cD: 20, hI: 10, cI: 20, cabeza: 2 }, { hD: 10, cD: 20, hI: 10, cI: 20, cabeza: 14 }, 0, 138, 14)} />
);
const TenzoPregunta: React.FC = () => (
  <TenzoLav dur={75} leo="parado" dia={9} min={110} cara={[{ f: 0, v: "neutral" }]} habla={[[0, 60]]} poses={[{ f: 0, v: T_HABLA_A }, { f: 20, v: T_HABLA_B }]}
    hud={<Globo texto="And the pictures?" x={1350} y={260} desde={2} hasta={75} cola="abajo" tam={50} />} />
);
const LeoPiensa: React.FC = () => {
  const L = (t: number) => fr(t, 373.9);
  return <LeoLav silla={false} dur={102} dia={9} min={110} cara={[{ f: 0, v: "duda" }, { f: L(375.8), v: "determinado" }]} habla={[[L(375.8), 102]]}
    poses={[{ f: 0, v: { hD: 100, cD: 140, hI: 15, cI: 30, cabeza: 8 } }, { f: L(375.8), v: { hD: 15, cD: 30, hI: 15, cI: 30 } }]}
    hud={<Globo texto="I didn't want them today." x={640} y={290} desde={L(375.8)} hasta={102} cola="abajo" tam={50} />} />;
};
const LeoReal: React.FC = () => (
  <LeoLav silla={false} dur={90} dia={9} min={110} cara={[{ f: 0, v: "determinado" }]} habla={[[0, 88]]} poses={[{ f: 0, v: { hD: 45, cD: 50, hI: 15, cI: 30 } }]}
    hud={<Globo texto="It felt like cheating on someone real." x={640} y={290} desde={2} hasta={90} cola="abajo" tam={46} />} />
);
const Suelta23b: React.FC = () => (
  <Rio T={154.2} vel={0.7} claves={[mira(0, 2350, 610, 1.45), mira(87, 2400, 610, 1.52)]}
    hud={<Frase texto="You put her down at the river." desde={6} y={930} tam={64} />} />
);
// «now you can walk next to her»: Leo y Maya caminando juntos por Broadway
const Junto23b: React.FC = () => {
  const f = useF();
  const x0 = BWY_PUNTOS.parada36 - 500 + f * 3.2;
  return (
    <Escena Set={Broadway} pal={PAL_DIA} setProps={{ hora: "dia", nieve: true }} claves={[mira(0, x0 + 80, 600, 1.35), mira(57, x0 + 80 + 57 * 3.2, 600, 1.4)]}
      medio={<>
        <Actor look={LEO} escala={ESC} seed={1} luz={L_DIA} ruta={[{ f: 0, x: x0, y: BP }, { f: 300, x: x0 + 960, y: BP }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} />
        <Actor look={MAYA} escala={ESC * 0.95} seed={8} luz={L_DIA} ruta={[{ f: 0, x: x0 + 170, y: BP }, { f: 300, x: x0 + 170 + 960, y: BP }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "risa" }]} />
      </>}
      hud={<Frase texto="Now you can walk next to her." desde={0} y={930} tam={64} />} />
  );
};

// ---------- 385,1-408,9 · DAY 10: la rutina… y la notificación ----------
const AS10 = COLCHON_ALTO;
const Despierta10: React.FC = () => {
  const T = 385.1, f = useF(), L = (t: number) => fr(t, T);
  const r = interpolate(f, [L(386.2), L(387.2)], [-90, 0], cl);
  return (
    <Escena Set={Cuarto} pal={PAL_DIA} setProps={{ nieve: false }} claves={[mira(0, LX - 40, 640, 1.4), mira(L(391.1), LX - 20, 620, 1.5)]}
      detras={<Halo x={2780} y={500} r={900} color="#fff1cc" fuerza={0.5} />}
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
  return (
    <Escena Set={Cuarto} pal={PAL_DIA} setProps={{ nieve: false }} claves={[mira(0, LX + 40, 520, 2.3), mira(30, LX + 40, 518, 2.36)]} detras={<Azulejos />}
      medio={<>
        <rect x={LX + 120} y={CP - 700} width={300} height={380} rx={20} fill="#e9f1f5" stroke="#8a949c" strokeWidth={8} />
        <Actor look={LEO} escala={ESC} seed={1} luz={L_DIA} ruta={[{ f: 0, x: LX, y: CP }]} dir={[{ f: 0, v: 1 }]}
          poses={alterna({ hD: 120, cD: 130, hI: 10, cI: 20, cabeza: -8 }, { hD: 110, cD: 145, hI: 10, cI: 20, cabeza: -12 }, 0, 30, 8)} caras={[{ f: 0, v: "feliz" }]}
          enManoD={<g><rect x={-6} y={-60} width={12} height={70} rx={5} fill="#3a6aa0" /><rect x={-26} y={-74} width={52} height={16} rx={4} fill="#c9ced6" /></g>} />
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
      <TelGrande modo="hora" texto="6:42" sub="AM" x={960} y={560} s={0.95} desde={0} />
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
  const f = useF();
  return (
    <AbsoluteFill style={{ background: "#0d1016" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><circle cx={960} cy={560} r={640} fill={ACENTO} opacity={0.05 + 0.08 * ent(f, 20, 120)} /></svg>
      <PantallaMacro secuencia={["luz"]} periodo={100000} desde={0} />
      <ManoMara texto="a face you know." x={1260} y={260} desde={2} hasta={fr(404.2, 402.5)} tam={60} />
      <ManoMara texto="a body you know." x={1260} y={260} desde={fr(404.2, 402.5)} hasta={fr(405.7, 402.5)} tam={60} />
      <ManoMara texto="waiting." x={1260} y={260} desde={fr(406.6, 402.5)} tam={66} />
      <Hud min={[{ f: 0, v: 4 }, { f: 60, v: 12, d: 60 }]} dia={10} estado="sube" />
    </AbsoluteFill>
  );
};
// 412,5-419,7 · el truco más viejo: nunca ataca cuando estás débil, espera a que estés feliz
const Truco26b: React.FC = () => {
  const T = 412.5, f = useF(), L = (t: number) => fr(t, T);
  const p = ent(f, L(415.7), L(417.6));
  const dias = [0.25, 0.2, 0.3, 0.32, 0.45, 0.5, 0.55, 0.6, 0.8, 0.95];
  const X0 = 140, X1 = 900, Y0 = 900, Hh = 380;
  const pts = dias.map((v, k) => [X0 + ((X1 - X0) * k) / 9, Y0 - v * Hh]);
  const n = Math.max(1, Math.round(1 + 9 * p));
  return (
    <Escena Set={Cuarto} pal={PAL_DIA} setProps={{ nieve: false }} detras={oscuro} claves={[mira(0, MX - 380, 420, 1.9), mira(L(419.7), MX - 380, 410, 2.1)]}
      medio={<Actor look={MARA} escala={ESC * 2.0} seed={5} ruta={[{ f: 0, x: MX - 80, y: CP - 20 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 70, cD: 50, hI: 50, cI: 70, cabeza: 16 } }, { f: L(417.8), v: { hD: 120, cD: 30, hI: 110, cI: 40, cabeza: 8 } }]} caras={[{ f: 0, v: "picaro" }, { f: L(417.8), v: "risa" }]} opacidad={() => 0.95} />}
      hud={<>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <rect x={90} y={440} width={880} height={560} rx={26} fill="rgba(10,12,16,0.7)" />
          <text x={140} y={500} fontSize={34} fill="#c9c2b4" fontFamily={F_HUD} letterSpacing={4}>HOW LEO FEELS · DAY 1-10</text>
          <polyline points={pts.slice(0, n).map((q) => q.join(",")).join(" ")} fill="none" stroke="#f4efe6" strokeWidth={7} strokeLinejoin="round" />
          {pts.slice(0, n).map((q, k) => <circle key={k} cx={q[0]} cy={q[1]} r={9} fill={k === 9 ? ACENTO : "#f4efe6"} />)}
          <text x={X0} y={960} fontSize={30} fill="#9aa0aa" fontFamily={F_HUD}>weak</text>
          <text x={X1} y={960} fontSize={30} fill="#9aa0aa" fontFamily={F_HUD} textAnchor="end">happy</text>
          {f > L(417.8) && <g opacity={ent(f, L(417.8), L(418.4))}><circle cx={pts[9][0]} cy={pts[9][1]} r={34} fill="none" stroke={ACENTO} strokeWidth={6} /><text x={pts[9][0] - 50} y={pts[9][1] + 80} fontSize={40} fill={ACENTO} fontFamily={F_HUD} fontWeight={600} textAnchor="end">it attacks here</text></g>}
        </svg>
        <Hud min={12} dia={10} />
      </>} />
  );
};
// CTA sobre negro, legible; después el gancho del día 11 (la elefanta y la soga chiquita)
const Pregunta27: React.FC = () => {
  const f = useF();
  return (
    <AbsoluteFill style={{ background: "#0b0c10" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <Halo x={960} y={330} r={420} color={ORO} fuerza={0.3 + 0.04 * Math.sin(f / 9)} />
        <FarolPapel x={960} y={330} s={1.4} luz={0.9 + 0.1 * Math.sin(f / 7)} />
      </svg>
      <Frase texto="Have you ever carried someone in your head" desde={4} y={640} tam={62} />
      <Frase texto="who was never really there?" desde={14} y={730} tam={62} color={ORO} />
      <Frase texto="Tell me below." desde={fr(422.8, 419.7)} y={880} tam={56} />
    </AbsoluteFill>
  );
};
const Gancho27: React.FC = () => {
  const f = useF();
  return (
    <AbsoluteFill>
      <TarjetaFinal proximo="The Elephant and the Tiny Rope" frase="why the biggest animal stays tied · Day 11" />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g opacity={ent(f, 30, 60)}><Elefante x={480} piso={930} dir={1} s={0.55} paso={0} adorno={false} /></g>
        <path d={`M600,880 C660,900 700,930 760,930`} stroke="#c9a86a" strokeWidth={5} fill="none" opacity={ent(f, 50, 70)} />
        <rect x={756} y={900} width={12} height={34} rx={4} fill="#8a6a4a" opacity={ent(f, 50, 70)} />
      </svg>
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [250, 294], [0, 1], cl) }} />
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
  { t0: 102.7, t1: 116.0, el: <Camino8 />, trans: { tipo: "luz", d: 18 } },
  { t0: 116.0, t1: 126.0, el: <Ekido8b /> },
  { t0: 126.0, t1: 141.7, el: <Rio9 />, trans: { tipo: "fundido", d: 12 } },
  { t0: 141.7, t1: 144.4, el: <EkidoAparta /> },
  { t0: 144.4, t1: 147.8, el: <TanzanVa /> },
  { t0: 147.8, t1: 160.3, el: <Cruza11 /> },
  { t0: 160.3, t1: 174.0, el: <Camina12b />, trans: { tipo: "fundido", d: 14 } },
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
