// tz04 · «The Monk Who Chose Love Over Lust» (Tenzo Films, Day 8-10). Voz 433,5 s = 13.004 cuadros.
// Plan D:/rtmp/tz04_PLAN_MxM.md. Cada plano = la frase de ese segundo; tramos en SEGUNDOS ABSOLUTOS de la voz.
// Chicago frío (el farol de Tenzo es la única luz cálida) · la parábola de Tanzan y Ekido, ámbar con lluvia dorada.
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile } from "remotion";
import { mira, useF } from "../anikit/camara";
import { Actor } from "../anikit/actor";
import { Escena } from "../anikit/escena";
import { Halo } from "../anikit/luz";
import { Montaje } from "../anikit/montaje";
import { Globo, Pildora, RelojDia } from "../anikit/pantalla";
import { Libro } from "../anikit/props";
import { Pose } from "../anikit/personaje";
import { ACENTO, ESC, FAROL, FRIO, LEO, MARA, ORO, PAL, PAL_ANT, PAL_DIA, TENZO } from "../tenzo/elenco";
import { AMRAPALI_VIEJA, CHICA_KIMONO, EKIDO, MAYA, TANZAN } from "../tenzo/elenco_b";
import { Frase, HudTenzo, ManoLeo, ManoMara, MarcaTenzo, Rotulo } from "../tenzo/hud";
import { FarolPapel, Tel, Toalla } from "../tenzo/utileria";
import { Broadway, BWY_PISO, BWY_PUNTOS } from "../tenzo/sets/broadway";
import { COLCHON_ALTO, Cuarto, CTO_PISO } from "../tenzo/sets/cuarto";
import { Lavadero, LAV_PISO, LAV_PUNTOS } from "../tenzo/sets/lavadero";
import { CaminoMontana, JAPON_PISO, PortonMonasterio, PORTON, RIO, RioCrecido, RioFrente } from "../tenzo/sets/rioJapon";
import { Vaishali, VAI_PUNTOS } from "../tenzo/sets/vaishali";
import { Colectivo36, COLECTIVO, COLECTIVO_PISO } from "../tenzo/sets/wilson";
import { ent, fr, PantallaMacro, planosDe, Tibio, TramoS } from "../tenzo/tzb/comun";

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
  const ekDir: 1 | -1 = t < 141.7 ? 1 : -1;
  const pasoT = camina(126, 131) || camina(144.4, 147.7) || camina(150.3, 154.8) ? "caminar" : undefined;
  return (
    <>
      <Actor look={EKIDO} escala={ESC} seed={23} luz={L_ANT} ruta={[{ f: 0, x: ekidoX(t), y: JP }]} dir={[{ f: 0, v: ekDir }]}
        poses={[{ f: 0, v: { hD: 20, cD: 120, hI: 20, cI: 120, cabeza: ekDir === -1 ? 14 : 10 } }]} caras={[{ f: 0, v: caraEkido }]} miradas={[{ f: 0, v: { x: 0.3, y: 0.8 } }]} />
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
const Parada: React.FC<{ claves: Clv[]; dia: number; min: number; leoPoses?: KF<string | Partial<Pose>>; leoCara?: KF<string>; leoHabla?: [number, number][]; mayaPoses?: KF<string | Partial<Pose>>; mayaCara?: KF<string>; mayaHabla?: [number, number][]; mayaMira?: KF<{ x: number; y: number }>; libro?: boolean; mara?: React.ReactNode; hud?: React.ReactNode; leoX?: number }> = ({ claves, dia, min, leoPoses = [{ f: 0, v: { hD: 20, cD: -40, hI: -20, cI: -40 } }], leoCara = [{ f: 0, v: "neutral" }], leoHabla, mayaPoses = [{ f: 0, v: POSE_LIBRO }], mayaCara = [{ f: 0, v: "neutral" }], mayaHabla, mayaMira, libro = true, mara, hud, leoX = LEO_PARADA }) => (
  <Escena Set={Broadway} pal={PAL_DIA} setProps={{ hora: "dia", nieve: true }} claves={claves}
    medio={<>
      {mara}
      <Actor look={LEO} escala={ESC} seed={1} luz={L_DIA} ruta={[{ f: 0, x: leoX, y: BP }]} dir={[{ f: 0, v: 1 }]} poses={leoPoses} caras={leoCara} habla={leoHabla} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} />
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
        <ManoMara texto="she'll never want you." x={980} y={230} desde={L(258.7)} hasta={L(262.3)} tam={64} />
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

// ================= el montaje =================
const TRAMOS: TramoS[] = [
  { t0: 0, t1: 7.6, el: <Cuadro0 /> },
  { t0: 7.6, t1: 21.6, el: <Dia8 />, trans: { tipo: "fundido", d: 12 } },
  { t0: 21.6, t1: 34.2, el: <Maya2 /> },
  { t0: 34.2, t1: 40.2, el: <Truman2 /> },
  { t0: 40.2, t1: 43.6, el: <Sonrie2 /> },
  { t0: 43.6, t1: 52.9, el: <Mara3 /> },
  { t0: 52.9, t1: 57.9, el: <Noche4 />, trans: { tipo: "fundido", d: 14 } },
  { t0: 57.9, t1: 63.0, el: <Luz4 /> },
  { t0: 63.0, t1: 68.1, el: <Cara4 /> },
  { t0: 68.1, t1: 72.3, el: <Pantalla5 /> },
  { t0: 72.3, t1: 82.4, el: <Lav6 />, trans: { tipo: "barrido", lado: 1 } },
  { t0: 82.4, t1: 96.1, el: <Chica6 /> },
  { t0: 96.1, t1: 102.7, el: <Farol7 /> },
  { t0: 102.7, t1: 116.0, el: <Camino8 />, trans: { tipo: "luz", d: 18 } },
  { t0: 116.0, t1: 126.0, el: <Ekido8 /> },
  { t0: 126.0, t1: 141.7, el: <Rio9 />, trans: { tipo: "fundido", d: 12 } },
  { t0: 141.7, t1: 147.8, el: <Mira10 /> },
  { t0: 147.8, t1: 160.3, el: <Cruza11 /> },
  { t0: 160.3, t1: 174.0, el: <Camina12 />, trans: { tipo: "fundido", d: 14 } },
  { t0: 174.0, t1: 177.7, el: <Porton12 />, trans: { tipo: "fundido", d: 12 } },
  { t0: 177.7, t1: 187.9, el: <Grito13 /> },
  { t0: 187.9, t1: 198.7, el: <Tanzan14 /> },
  { t0: 198.7, t1: 205.8, el: <Quieto15 />, trans: { tipo: "luz", d: 16 } },
  { t0: 205.8, t1: 211.1, el: <Suelta15 />, trans: { tipo: "luz", d: 10 } },
  { t0: 211.1, t1: 216.0, el: <Carga15 /> },
  { t0: 216.0, t1: 219.0, el: <Puro15 />, trans: { tipo: "luz", d: 10 } },
  { t0: 219.0, t1: 231.3, el: <Viejo16 /> },
  { t0: 231.3, t1: 235.6, el: <Foto16 /> },
  { t0: 235.6, t1: 254.8, el: <Real16 /> },
  { t0: 254.8, t1: 265.3, el: <Mara17 /> },
  { t0: 265.3, t1: 272.8, el: <Dia9 />, trans: { tipo: "cortina", lado: 1 } },
  { t0: 272.8, t1: 280.1, el: <Libro18 /> },
  { t0: 280.1, t1: 287.4, el: <Cuello18 /> },
  { t0: 287.4, t1: 291.4, el: <Stop18 /> },
  { t0: 291.4, t1: 299.3, el: <Habla19 /> },
  { t0: 299.3, t1: 306.7, el: <Monja19 /> },
  { t0: 306.7, t1: 313.1, el: <Amrapali19 /> },
  { t0: 313.1, t1: 318.1, el: <Monje19 /> },
  { t0: 318.1, t1: 325.9, el: <Mano19 /> },
  { t0: 325.9, t1: 337.6, el: <Bus20 />, trans: { tipo: "barrido", lado: 1 } },
  { t0: 337.6, t1: 343.3, el: <Poema20 />, trans: { tipo: "luz", d: 12 } },
  { t0: 343.3, t1: 347.5, el: <Bolsillo20 />, trans: { tipo: "luz", d: 10 } },
  { t0: 347.5, t1: 354.2, el: <Puerta21 /> },
  { t0: 354.2, t1: 359.8, el: <Bajo22 /> },
  { t0: 359.8, t1: 380.3, el: <Cuenta23 />, trans: { tipo: "fundido", d: 14 } },
  { t0: 380.3, t1: 384.5, el: <Suelta23 />, trans: { tipo: "luz", d: 10 } },
  { t0: 384.5, t1: 385.1, el: <Junto23 /> },
  { t0: 385.1, t1: 395.0, el: <Dia10 />, trans: { tipo: "fundido", d: 12 } },
  { t0: 395.0, t1: 408.9, el: <Notif25 /> },
  { t0: 408.9, t1: 412.5, el: <Vuelve25 /> },
  { t0: 412.5, t1: 419.7, el: <Truco26 /> },
  { t0: 419.7, t1: 433.5, el: <Cierre27 />, trans: { tipo: "fundido", d: 16 } },
];
export const TZ04_DUR = 13004; // 433,5 s de voz
const PLANOS = planosDe(TRAMOS);

export const Tz04: React.FC<{ audio?: boolean }> = ({ audio = true }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Montaje planos={PLANOS} />
    <MarcaTenzo />
    {audio && <Audio src={staticFile("tz04.wav")} />}
  </AbsoluteFill>
);
void LEO_LAV; void FAROL; void L_FRIO;
