// tz03 · «He Scrolled for 10 Years. Then the Monk Said Stop.» (Tenzo Films, Day 5-7). Voz 409,2 s = 12.276 cuadros.
// Plan D:/rtmp/tz03_PLAN_MxM.md. Cada plano = la frase de ese segundo; tramos en SEGUNDOS ABSOLUTOS de la voz.
// Chicago frío (el farol de Tenzo es la única luz cálida) · la parábola del caballo, toda ámbar.
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile } from "remotion";
import { mira, useF } from "../anikit/camara";
import { Actor } from "../anikit/actor";
import { Escena } from "../anikit/escena";
import { Halo } from "../anikit/luz";
import { Montaje } from "../anikit/montaje";
import { F_HUD, F_MANO, Globo, GranNumero, RelojDia } from "../anikit/pantalla";
import { TelGrande } from "../tenzo/graficos";
import { Recuerdo, TarjetaFinal } from "../tenzo/tzc/chicago";
import { Libro } from "../anikit/props";
import { Pose } from "../anikit/personaje";
import { ACENTO, ESC, FAROL, FRIO, LEO, LOTO, MARA, ORO, PAL, PAL_ANT, PAL_DIA, TENZO } from "../tenzo/elenco";
import { GRANJERO, JINETE, MAYA, MONJE_SHOUNJI } from "../tenzo/elenco_b";
import { Frase, HudTenzo, ManoLeo, ManoMara, MarcaTenzo } from "../tenzo/hud";
import { FarolMano, FarolPapel, Tel, TelMesa, Toalla } from "../tenzo/utileria";
import { Broadway, BWY_PISO, BWY_PUNTOS } from "../tenzo/sets/broadway";
import { CaminoChina, CHINA_PISO, CHINA_PUNTOS } from "../tenzo/sets/caminoChina";
import { COLCHON_ALTO, Cuarto, CTO_PISO, CTO_PUNTOS } from "../tenzo/sets/cuarto";
import { Lavadero, LAV_PISO, LAV_PUNTOS } from "../tenzo/sets/lavadero";
import { PortonMonasterio, JAPON_PISO } from "../tenzo/sets/rioJapon";
import { FachadaWilson, PasilloWilson, WILSON, WILSON_PISO } from "../tenzo/sets/wilson";
import { Alba, ent, fr, Montado, NubePolvo, PantallaMacro, planosDe, POSE_JINETE, Rayitas, Hoja, Rendija, Tibio, TramoS } from "../tenzo/tzb/comun";

const P = CTO_PISO;
const LX = 1240; // Leo sentado en el colchón
const TX = 1660; // Tenzo sentado en el piso (LOTO)
const FX = 1470; // el farol apoyado en el piso, entre los dos
const MX = LX - 190; // Mara detrás del hombro de Leo
const AS = COLCHON_ALTO;

// luces
const L_TEL = { lado: 1 as const, color: ACENTO, fuerza: 0.55 };
const L_FRIO = { lado: 1 as const, color: FRIO, fuerza: 0.45 };
const L_ORO_D = { lado: 1 as const, color: ORO, fuerza: 0.7 }; // luz cálida que viene de la derecha (Leo mira al farol)
const L_ORO_I = { lado: -1 as const, color: ORO, fuerza: 0.9 }; // Tenzo, del lado del farol
const L_ANT = { lado: 1 as const, color: "#ffd890", fuerza: 0.8 };

// poses de Leo sentado en el colchón (rodillas arriba)
const SENT: Partial<Pose> = { tronco: 4, pI: 70, rI: 120, pD: 75, rD: 125, hD: 35, cD: 60, hI: 25, cI: 50 };
const SENT_CEL: Partial<Pose> = { ...SENT, tronco: 10, hD: 30, cD: 125, cabeza: 22, hI: 8, cI: 30 };
const CABIZBAJO: Partial<Pose> = { tronco: 36, cabeza: 24, pI: 60, rI: 135, pD: 65, rD: 140, hD: 130, cD: 150, hI: 125, cI: 150 };
const MANDIBULA: Partial<Pose> = { ...SENT, hD: 40, cD: 150, cabeza: -4 };
const TENZO_DEDO: Partial<Pose> = { ...LOTO, hD: 150, cD: 30, cabeza: -4 };

// ---------- piezas que se repiten ----------
const Hud: React.FC<{ min: number | { f: number; v: number; d?: number }[]; dia: number; estado?: "sube" | "congelado" | "normal" | ((f: number) => "sube" | "congelado" | "normal") }> = (p) => <HudTenzo {...p} sinMarca />;
const oscuro = <rect x={-900} y={-700} width={5200} height={2000} fill="#04060b" opacity={0.5} />;

const MaraTras: React.FC<{ esc: number | ((f: number) => number); cara?: { f: number; v: string }[]; x?: number; y?: number; pose?: Partial<Pose>; asiento?: number; op?: number }> = ({ esc, cara = [{ f: 0, v: "feliz" }], x = MX, y = P - 34, pose = { hD: 60, cD: 60, hI: 40, cI: 70, cabeza: 14 }, asiento, op = 0.93 }) => {
  const f = useF();
  const e = typeof esc === "number" ? esc : esc(f);
  return <Actor look={MARA} escala={ESC * e} seed={5} ruta={[{ f: 0, x, y }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: pose }]} caras={cara} asiento={asiento !== undefined ? [{ f: 0, v: asiento }] : undefined} opacidad={() => op} />;
};
const LeoSentado: React.FC<{ poses?: { f: number; v: string | Partial<Pose> }[]; caras?: { f: number; v: string }[]; luz?: typeof L_TEL; tel?: boolean | ((f: number) => boolean); habla?: [number, number][]; miradas?: { f: number; v: { x: number; y: number } }[]; dir?: { f: number; v: 1 | -1 }[]; telI?: boolean }> = ({ poses = [{ f: 0, v: SENT_CEL }], caras = [{ f: 0, v: "cansado" }], luz = L_TEL, tel = true, habla, miradas, dir = [{ f: 0, v: 1 }], telI }) => {
  const f = useF();
  const conTel = typeof tel === "function" ? tel(f) : tel;
  return <Actor look={LEO} escala={ESC} seed={1} luz={luz} ruta={[{ f: 0, x: LX, y: P }]} dir={dir} asiento={[{ f: 0, v: AS }]} poses={poses} caras={caras} habla={habla} miradas={miradas}
    enManoD={conTel && !telI ? <Tel /> : undefined} enManoI={conTel && telI ? <Tel prendido={false} /> : undefined} />;
};
const TenzoSentado: React.FC<{ poses?: { f: number; v: string | Partial<Pose> }[]; caras?: { f: number; v: string }[]; habla?: [number, number][]; miradas?: { f: number; v: { x: number; y: number } }[] }> = ({ poses = [{ f: 0, v: LOTO }], caras = [{ f: 0, v: "feliz" }], habla, miradas }) => (
  <Actor look={TENZO} escala={ESC} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 8 }]} poses={poses} caras={caras} habla={habla} miradas={miradas} />
);
const FarolPiso: React.FC<{ luz?: number }> = ({ luz = 1 }) => {
  const f = useF();
  return <FarolPapel x={FX} y={P + 4} s={1.05} luz={luz * (0.94 + 0.06 * Math.sin(f / 7) * Math.sin(f / 3.1))} />;
};
// el cuarto cálido con los dos sentados (Tenzo ya apoyó el farol)
const CuartoCalido: React.FC<{ claves: ReturnType<typeof mira>[]; children: React.ReactNode; hud?: React.ReactNode; k?: number }> = ({ claves, children, hud, k = 1 }) => (
  <Escena Set={Cuarto} pal={PAL} setProps={{ nieve: true }} claves={claves} detras={<Tibio k={k} x={FX} y={P - 60} />}
    medio={<>{children}<FarolPiso /></>} hud={hud} />
);

// ---------- 0 · CUADRO 0 = la miniatura sin texto ----------
const T0 = 0;
const Cuadro0: React.FC = () => {
  const f = useF();
  const hx = 2780 - f * 5;
  return (
    <Escena Set={Broadway} pal={PAL} setProps={{ nieve: false }} claves={[mira(0, 2250, 520, 1.0), mira(90, 2330, 520, 1.06, { curva: "in" })]}
      medio={<>
        <NubePolvo x={hx + 420} piso={BWY_PISO + 130} k={0.6} f={f} color="#2a1a14" ancho={420} />
        <Montado x={hx} piso={BWY_PISO + 130} fase={(f % 14) / 14} dir={-1} s={1.8} variante="mara" look={LEO} cara="miedo" escala={ESC * 1.5} luz={L_TEL}
          pose={{ ...POSE_JINETE, hD: 60, cD: 125, cabeza: 18 }} enManoD={<Tel />} />
        <Halo x={hx - 40} y={BWY_PISO - 300} r={700} color={ACENTO} fuerza={0.35} />
        <Actor look={TENZO} escala={ESC * 2.6} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: 1640, y: BWY_PISO + 170 }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: { hD: 105, cD: 75, hI: 14, cI: 18, cabeza: -6 } }, { f: 70, v: { hD: 105, cD: 75, hI: 14, cI: 18, cabeza: -6 } }, { f: 88, v: { hD: 60, cD: 40, hI: 14, cI: 18 } }]}
          caras={[{ f: 0, v: "risa" }]} enManoI={<FarolMano />} />
      </>}
      hud={<ManoMara texto="just 10 minutes" x={1120} y={150} desde={18} />} />
  );
};

// ---------- 1 · las 2 → las 6:11, la ventana se pone gris ----------
const Alba1: React.FC = () => {
  const T = 5.7, f = useF(), L = (t: number) => fr(t, T);
  const reloj = interpolate(f, [0, L(9.6)], [140, 371], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX + 200, 640, 1.35), mira(L(7.4), LX + 400, 600, 1.2), mira(L(8.8), 2760, 420, 1.2), mira(L(10), 2770, 420, 1.24)]}
      detras={<>{oscuro}<Alba t={ent(f, 0, L(9.4))} /></>}
      medio={<LeoSentado poses={[{ f: 0, v: SENT_CEL }, { f: 8, v: { ...SENT_CEL, cabeza: -14, cD: 100 } }]} caras={[{ f: 0, v: "cansado" }, { f: 10, v: "sorpresa" }, { f: 60, v: "triste" }]} miradas={[{ f: 8, v: { x: 1, y: -0.7 } }]} />}
      hud={<RelojDia min={reloj} x={1580} y={60} />} />
  );
};
// ---------- 2 · cuatro horas, once minutos ----------
const Cara2: React.FC = () => {
  const T = 13.1, L = (t: number) => fr(t, T);
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX - 70, 720, 2.3), mira(L(15.8), LX - 70, 725, 2.55)]}
      detras={<Alba t={1} />}
      medio={<LeoSentado caras={[{ f: 0, v: "cansado" }, { f: 20, v: "triste" }]} miradas={[{ f: 0, v: { x: 0.4, y: 0.6 } }, { f: 20, v: { x: 1, y: -0.2 } }]} />}
      hud={<>
        <RelojDia min={371} x={1580} y={60} />
        <ManoLeo texto={"not one thing\ni remember."} x={110} y={560} desde={10} />
      </>} />
  );
};
// ---------- 3 · DAY 5: el contador sube y la sombra crece ----------
const Dia5: React.FC = () => {
  const T = 21.1, L = (t: number) => fr(t, T);
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX - 40, 660, 1.6), mira(L(26), LX - 100, 560, 1.1)]}
      detras={oscuro}
      medio={<>
        <MaraTras esc={(f) => interpolate(f, [L(21.1), L(25.8)], [1.0, 1.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
          cara={[{ f: 0, v: "picaro" }, { f: L(28.3), v: "feliz" }]} />
        <LeoSentado />
      </>}
      hud={<Hud min={390} dia={5} estado="sube" />} />
  );
};
// ---------- 4 · «See? This is who you are.» ----------
const Mara4: React.FC = () => (
  <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX - 110, 560, 1.7), mira(75, LX - 130, 550, 1.85)]}
    detras={oscuro}
    medio={<>
      <MaraTras esc={1.5} cara={[{ f: 0, v: "feliz" }, { f: 30, v: "picaro" }]} pose={{ hD: 85, cD: 30, hI: 40, cI: 70, cabeza: 20 }} />
      <LeoSentado caras={[{ f: 0, v: "triste" }]} />
    </>}
    hud={<>
      <Hud min={390} dia={5} estado="sube" />
      <ManoMara texto={"see?\nthis is\nwho you are."} x={1330} y={380} desde={3} />
    </>} />
);
// ---------- 5 · no va al lavadero: Tenzo solo con el farol ----------
const Lavadero5: React.FC = () => {
  const T = 31.7, f = useF(), L = (t: number) => fr(t, T);
  const LP = LAV_PISO;
  return (
    <Escena Set={Lavadero} pal={PAL} setProps={{ girando: [3, 12], nieve: true }} claves={[mira(0, 1600, 640, 1.45), mira(L(36.3), 1700, 650, 1.6)]}
      medio={<>
        <Toalla x={LAV_PUNTOS.mesa} y={LP - 150} doblez={ent(f, 10, L(34))} />
        <Actor look={TENZO} escala={ESC} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: LAV_PUNTOS.tenzo, y: LP }]} dir={[{ f: 0, v: -1 }, { f: L(34.3), v: 1 }]}
          poses={[...alterna({ hD: 60, cD: 70, hI: 55, cI: 75, tronco: 8 }, { hD: 95, cD: 30, hI: 90, cI: 35, tronco: 4 }, 0, L(34.3), 20), { f: L(34.3), v: { hD: 10, cD: 20, hI: 10, cI: 20 } }]}
          caras={[{ f: 0, v: "neutral" }, { f: L(34.3), v: "triste" }]} />
      </>}
      hud={<><Hud min={390} dia={5} /><RelojDia min={180} x={1580} y={60} /></>} />
  );
};
// ---------- 6 · en la cama, a oscuras, la pantalla a dos pulgadas ----------
const Cama6: React.FC = () => (
  <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX - 60, 720, 2.4), mira(129, LX - 70, 725, 2.65)]}
    detras={<rect x={-900} y={-700} width={5200} height={2000} fill="#02030a" opacity={0.75} />}
    medio={<>
      <LeoSentado poses={[{ f: 0, v: { ...SENT_CEL, cabeza: 30, tronco: 18, cD: 135 } }]} caras={[{ f: 0, v: "cansado" }]} luz={{ lado: 1, color: ACENTO, fuerza: 0.85 }} />
      <Halo x={LX + 90} y={P - 300} r={260} color={ACENTO} fuerza={0.35} />
    </>}
    hud={<Hud min={390} dia={5} />} />
);
const Pulgar6: React.FC = () => (
  <AbsoluteFill style={{ background: "#07070b" }}>
    <PantallaMacro secuencia={["video", "chica", "perro", "video", "grito"]} periodo={22} s={0.95} />
    <Hud min={390} dia={5} estado="sube" />
  </AbsoluteFill>
);
// ---------- 7 · diez años, veinte mil horas ----------
const Diez7: React.FC = () => {
  const T = 44.3, f = useF(), L = (t: number) => fr(t, T);
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX - 150, 600, 1.5), mira(L(55.2), LX - 170, 590, 1.4)]}
      detras={<>{oscuro}<Rayitas n={interpolate(f, [L(47.6), L(53.3)], [0, 75], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} x={LX - 470} y={400} color="#9aa3b2" porFila={25} /></>}
      medio={<LeoSentado tel={false} poses={[{ f: 0, v: { ...SENT, cabeza: -18, hD: 30, cD: 40 } }]} caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: { x: 0.2, y: -1 } }]} luz={L_FRIO} />}
      hud={<>
        <Hud min={390} dia={5} />
        <GranNumero rotulo="HOURS ON A SCREEN" claves={[{ f: L(50.1), v: 0 }, { f: L(51.0), v: 20000, d: 45 }]} desde={L(50.1)} y={70} color="#f4efe6" tam={110} />
        <ManoLeo texto="more than med school." x={1180} y={860} desde={L(53.3)} />
      </>} />
  );
};
// ---------- 8 · tercera noche, 3 a.m.: un golpe suave en la puerta ----------
const Golpe8: React.FC = () => {
  const T = 55.2, f = useF(), L = (t: number) => fr(t, T);
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, 760, 640, 1.1), mira(L(60.3), 700, 650, 1.2)]}
      detras={<>{oscuro}<Rendija x={CTO_PUNTOS.puerta} piso={P} k={ent(f, L(57), L(58.6))} /></>}
      medio={<><Golpes x={CTO_PUNTOS.puerta} y={P - 330} f0={L(57)} /><LeoSentado dir={[{ f: 0, v: 1 }, { f: L(59.7), v: -1 }]} caras={[{ f: 0, v: "cansado" }, { f: L(57.4), v: "sorpresa" }]} /></>}
      hud={<>
        <Hud min={390} dia={5} />
        <RelojDia min={180} x={1580} y={60} />
      </>} />
  );
};
// ---------- 9 · la puerta se abre: en el pasillo, con nieve en los hombros, Tenzo ----------
const NieveHombros: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g fill="#f4f6fa">{[[-44, 0, 9], [-26, -6, 7], [34, -2, 8], [48, 4, 6], [-6, -10, 5]].map(([dx, dy, r], i) => <circle key={i} cx={x + dx} cy={y + dy} r={r} />)}</g>
);
const Pasillo9: React.FC = () => {
  const T = 60.4, f = useF(), L = (t: number) => fr(t, T);
  const W = WILSON_PISO;
  return (
    <Escena Set={PasilloWilson} pal={PAL} setProps={{ apertura: ent(f, 4, 44) }}
      claves={[mira(0, WILSON.leo + 40, 590, 1.35), mira(L(64.5), WILSON.tenzo - 40, 580, 1.3), mira(L(67.6), WILSON.tenzo + 10, 690, 1.9)]}
      medio={<>
        <Actor look={LEO} escala={ESC} seed={1} luz={L_FRIO} ruta={[{ f: 0, x: WILSON.leo, y: W }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "sorpresa" }]} enManoD={<Tel />} poses={[{ f: 0, v: { hD: 20, cD: 60 } }]} />
        <Actor look={TENZO} escala={ESC} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: WILSON.tenzo, y: W }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: FAROL }]} caras={[{ f: 0, v: "feliz" }]} enManoD={<FarolMano />} />
        <NieveHombros x={WILSON.tenzo} y={W - 228} />
        <Halo x={WILSON.tenzo - 50} y={W - 160} r={700} color={ORO} fuerza={0.35} />
      </>}
      hud={<Hud min={390} dia={5} />} />
  );
};
// ---------- 10 · «How did you find me?» / la única ventana azul ----------
const Como10: React.FC = () => (
  <Escena Set={PasilloWilson} pal={PAL} setProps={{ apertura: 1 }} claves={[mira(0, WILSON.leo + 20, 520, 2.1), mira(48, WILSON.leo + 10, 515, 2.2)]}
    medio={<>
      <Actor look={LEO} escala={ESC} seed={1} luz={L_FRIO} ruta={[{ f: 0, x: WILSON.leo, y: WILSON_PISO }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "duda" }]} habla={[[0, 42]]} enManoD={<Tel />} poses={[{ f: 0, v: { hD: 20, cD: 60 } }]} />
      <Halo x={WILSON.tenzo} y={WILSON_PISO - 200} r={500} color={ORO} fuerza={0.3} />
    </>}
    hud={<><Hud min={390} dia={5} /><ManoLeo texto="how did you find me?" x={1180} y={260} desde={4} /></>} />
);
const Fachada10: React.FC = () => (
  <Escena Set={FachadaWilson} pal={PAL} claves={[mira(0, 1650, 560, 0.85), mira(162, 1720, 520, 1.0)]} hud={<Hud min={390} dia={5} />} />
);
// ---------- 11 · Tenzo mira el celular prendido · «May I come in? It is cold and I am old» ----------
const Pasar11: React.FC = () => {
  const T = 76.3, L = (t: number) => fr(t, T);
  const W = WILSON_PISO;
  return (
    <Escena Set={PasilloWilson} pal={PAL} setProps={{ apertura: 1 }} claves={[mira(0, 1360, 600, 1.45), mira(L(80.4), 1400, 580, 1.6)]}
      medio={<>
        <Actor look={LEO} escala={ESC} seed={1} luz={L_FRIO} ruta={[{ f: 0, x: WILSON.leo, y: W }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "duda" }]} enManoD={<Tel />} poses={[{ f: 0, v: { hD: 20, cD: 60 } }, { f: L(79), v: { hD: 10, cD: 30 } }]} />
        <Actor look={TENZO} escala={ESC} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: WILSON.tenzo, y: W }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: FAROL }, { f: L(81.5), v: { ...FAROL, hI: 70, cI: 110 } }]} caras={[{ f: 0, v: "neutral" }, { f: L(80.4), v: "feliz" }]}
          miradas={[{ f: 0, v: { x: -0.7, y: 0.8 } }, { f: L(80.4), v: { x: -0.8, y: 0 } }]} habla={[[L(80.4), L(83.3)]]} enManoD={<FarolMano />} />
        <NieveHombros x={WILSON.tenzo} y={W - 228} />
        <Halo x={WILSON.tenzo - 50} y={W - 160} r={700} color={ORO} fuerza={0.35} />
      </>}
      hud={<Hud min={390} dia={5} />} />
  );
};
// ---------- 12 · el cuarto chico: cajas de pizza, el bolso, los dibujos · Tenzo entra ----------
const Cuarto12: React.FC = () => {
  const T = 83.4, f = useF(), L = (t: number) => fr(t, T);
  return (
    <Escena Set={Cuarto} pal={PAL} setProps={{ luzPuerta: 1 }} claves={[mira(0, 900, 600, 0.9), mira(L(85.6), 900, 600, 0.92), mira(L(86.6), 660, 760, 1.7), mira(L(88.4), 1600, 760, 1.6), mira(L(89.6), 2050, 640, 1.3), mira(L(91.8), 2050, 630, 1.35)]}
      detras={<>{oscuro}<Tibio k={0.55} x={interpolate(f, [L(84.5), L(91.5)], [200, 1500], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={P - 120} /></>}
      medio={<>
        <LeoSentado caras={[{ f: 0, v: "triste" }]} />
        <Actor look={TENZO} escala={ESC} seed={2} luz={L_ORO_I} ruta={[{ f: L(84.5), x: 200, y: P }, { f: L(91.5), x: TX, y: P }]} poses={[{ f: 0, v: FAROL }]} caras={[{ f: 0, v: "feliz" }]} enManoD={<FarolMano />} />
      </>}
      hud={<Hud min={390} dia={5} />} />
  );
};
// ---------- 13 · se sienta en el piso, apoya el farol, el cuarto se entibia ----------
const Tibio13: React.FC = () => {
  const T = 92.0, f = useF(), L = (t: number) => fr(t, T);
  const apoyado = f >= L(95.2);
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, 1460, 650, 1.35), mira(L(95.4), 1460, 660, 1.45), mira(L(96.4), 1500, 560, 0.9), mira(L(98.7), 1500, 560, 0.95)]}
      detras={<>{oscuro}<Tibio k={0.25 + 0.75 * ent(f, L(95.2), L(98))} x={apoyado ? FX : TX - 60} y={P - 80} /></>}
      medio={<>
        <LeoSentado caras={[{ f: 0, v: "triste" }, { f: L(96), v: "sorpresa" }]} luz={apoyado ? L_ORO_D : L_TEL} />
        <Actor look={TENZO} escala={ESC} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: -1 }]}
          asiento={[{ f: 0, v: undefined }, { f: L(93.6), v: 8, d: 30 }]} poses={[{ f: 0, v: FAROL }, { f: L(93.6), v: { ...LOTO, hD: 50, cD: 30, tronco: 14 } }, { f: L(95.6), v: LOTO }]}
          caras={[{ f: 0, v: "feliz" }]} enManoD={apoyado ? undefined : <FarolMano />} />
        {apoyado && <FarolPiso />}
      </>}
      hud={<Hud min={390} dia={5} />} />
  );
};
// ---------- 14 · «I failed… I'm always the same.» · Tenzo asiente ----------
const Falle14: React.FC = () => {
  const T = 98.7, L = (t: number) => fr(t, T);
  return (
    <CuartoCalido claves={[mira(0, 1450, 660, 1.4), mira(L(113.1), 1400, 660, 1.55)]}
      hud={<><Hud min={390} dia={5} /><ManoLeo texto="i'm always the same." x={250} y={820} desde={L(108.6)} /></>}>
      <LeoSentado tel={false} luz={L_ORO_D} poses={[{ f: 0, v: SENT }, { f: L(106.5), v: CABIZBAJO }]} caras={[{ f: 0, v: "triste" }]} habla={[[0, L(106.4)], [L(106.5), L(108.2)]]} />
      <TenzoSentado poses={[{ f: 0, v: LOTO }, { f: L(111.0), v: { ...LOTO, cabeza: 16 } }, { f: L(111.6), v: LOTO }, { f: L(112.0), v: { ...LOTO, cabeza: 14 } }, { f: L(112.6), v: LOTO }]} caras={[{ f: 0, v: "neutral" }, { f: L(111), v: "feliz" }]} />
    </CuartoCalido>
  );
};
// ---------- 15 · «Let me tell you about a man on a horse.» · el farol parpadea ----------
const Farol15: React.FC = () => {
  const T = 113.1, L = (t: number) => fr(t, T);
  return (
    <CuartoCalido claves={[mira(0, 1450, 610, 1.25), mira(L(115.4), FX, P - 70, 2.9), mira(L(118.7), FX, P - 70, 3.1)]} hud={<Hud min={390} dia={5} />}>
      <LeoSentado tel={false} luz={L_ORO_D} poses={[{ f: 0, v: CABIZBAJO }, { f: 30, v: SENT }]} caras={[{ f: 0, v: "triste" }]} />
      <TenzoSentado habla={[[0, L(115.4)]]} />
    </CuartoCalido>
  );
};

// ---------- 16-19 · LA PARÁBOLA: el camino de tierra, el granjero, el caballo ----------
const CP = CHINA_PISO;
const hxDe = (t: number) => -2000 + (t - 128) * 200; // x del caballo según el segundo de la voz
const Azada: React.FC = () => (
  <g>
    <path d="M0,-70 L0,250" stroke="#7a5230" strokeWidth={8} strokeLinecap="round" />
    <path d="M-6,240 L36,246 L34,262 L-8,256 Z" fill="#6a6a70" />
  </g>
);
const Granjero: React.FC<{ dir?: { f: number; v: 1 | -1 }[]; poses?: { f: number; v: string | Partial<Pose> }[]; caras?: { f: number; v: string }[]; habla?: [number, number][] }> = ({ dir = [{ f: 0, v: 1 }], poses = [{ f: 0, v: { tronco: 8, hD: 40, cD: 60, hI: 45, cI: 70 } }], caras = [{ f: 0, v: "neutral" }], habla }) => (
  <Actor look={GRANJERO} escala={1.1} seed={11} luz={L_ANT} ruta={[{ f: 0, x: CHINA_PUNTOS.granjero, y: CP }]} dir={dir} poses={poses} caras={caras} habla={habla} enManoD={<Azada />} />
);
const ChinaJinete: React.FC<{ t: number; f: number; cara: string; giro?: number; pose?: Partial<Pose> }> = ({ t, f, cara, giro, pose }) => (
  <>
    <NubePolvo x={hxDe(t) - 330} piso={CP + 40} k={0.45} f={f} />
    <Montado x={hxDe(t)} piso={CP + 40} fase={(f % 14) / 14} look={JINETE} cara={cara} escala={1.0} luz={L_ANT} giro={giro} pose={pose} />
  </>
);
const Camino16: React.FC = () => {
  const T = 118.7, f = useF(), L = (t: number) => fr(t, T);
  return (
    <Escena Set={CaminoChina} pal={PAL_ANT} claves={[mira(0, 300, 560, 0.72), mira(L(122.6), 900, 590, 0.78), mira(L(126.5), 1450, 620, 0.95), mira(L(128), 1470, 610, 1.05)]}
      medio={<>
        <Granjero caras={[{ f: 0, v: "feliz" }, { f: L(126.5), v: "sorpresa" }]} poses={[{ f: 0, v: { tronco: 8, hD: 40, cD: 60, hI: 45, cI: 70 } }, { f: L(122.6), v: { tronco: 0, hD: 40, cD: 60, hI: 150, cI: 160, cabeza: -6 } }, { f: L(124.4), v: { tronco: 10, hD: 50, cD: 50, hI: 50, cI: 60 } }]} dir={[{ f: 0, v: 1 }, { f: L(126.5), v: -1 }]} />
        <NubePolvo x={-700} piso={CP + 40} k={ent(f, L(125.5), L(128))} f={f} ancho={500} />
      </>} />
  );
};
// 128,0-138,1 · el caballo llega galopando (la cámara lo sigue con resorte)
const Galope17: React.FC = () => {
  const T = 128.0, f = useF(), t = T + f / 30;
  const cl = Array.from({ length: 12 }, (_, k) => { const tt = T + k; return mira((tt - T) * 30, hxDe(tt) + 260, 600, 0.9); });
  return (
    <Escena Set={CaminoChina} pal={PAL_ANT} claves={cl}
      medio={<>
        <Granjero />
        <ChinaJinete t={t} f={f} cara={f > 200 ? "miedo" : "sorpresa"} />
      </>} />
  );
};
// 138,1-144,3 · la cara roja, los ojos grandes
const CaraRoja17: React.FC = () => {
  const T = 138.1, f = useF(), t = T + f / 30;
  const cl = Array.from({ length: 8 }, (_, k) => { const tt = T + k; return mira((tt - T) * 30, hxDe(tt) + 10, CP - 380, 2.1); });
  return (
    <Escena Set={CaminoChina} pal={PAL_ANT} claves={cl}
      medio={<>
        <ChinaJinete t={t} f={f} cara="miedo" pose={{ ...POSE_JINETE, tronco: 26 }} />
        <Halo x={hxDe(t) - 10} y={CP - 400} r={120} color="#ff5a3a" fuerza={0.35} />
      </>} />
  );
};
// 144,3-151,6 · pasa volando; el granjero grita «Hey! Where are you going?»
const Grito18: React.FC = () => {
  const T = 144.3, f = useF(), t = T + f / 30, L = (tt: number) => fr(tt, T);
  return (
    <Escena Set={CaminoChina} pal={PAL_ANT} claves={[mira(0, 1500, 600, 0.82), mira(L(151.6), 1900, 600, 0.82)]}
      medio={<>
        <Granjero dir={[{ f: 0, v: -1 }, { f: L(145.6), v: 1 }]} poses={[{ f: 0, v: { tronco: 8, hD: 40, cD: 60, hI: 45, cI: 70 } }, { f: L(146.2), v: { tronco: -6, hD: 40, cD: 60, hI: 120, cI: 150, cabeza: -10 } }]}
          caras={[{ f: 0, v: "sorpresa" }, { f: L(146.2), v: "risa" }]} habla={[[L(146.2), L(148.2)]]} />
        <ChinaJinete t={t} f={f} cara="miedo" />
      </>}
      hud={<Globo texto="Hey! Where are you going?!" x={720} y={250} desde={L(146.2)} hasta={L(151.6)} cola="abajo" tam={46} />} />
  );
};
// 151,6-156,9 · «I don't know! Ask the horse!» y se va en una nube de polvo
const Pregunta19: React.FC = () => {
  const T = 151.6, f = useF(), t = T + f / 30, L = (tt: number) => fr(tt, T);
  const quieta = L(154.0);
  const camT = (tt: number) => Math.min(tt, 154.0);
  const cl = [0, 1, 2, 2.4].map((k) => mira(k * 30, hxDe(camT(T + k)) + 40, CP - 330, 1.45)).concat([mira(L(156.9), hxDe(154) + 120, 600, 1.0)]);
  return (
    <Escena Set={CaminoChina} pal={PAL_ANT} claves={cl}
      medio={<>
        <ChinaJinete t={t} f={f} cara={f < L(153.3) ? "miedo" : "risa"} giro={-0.9} pose={{ ...POSE_JINETE, cabeza: -6 }} />
        <NubePolvo x={hxDe(t) - 200} piso={CP + 40} k={ent(f, quieta, L(156.6))} f={f} ancho={900} />
      </>}
      hud={<Globo texto="I DON'T KNOW! ASK THE HORSE!" x={760} y={170} desde={4} hasta={L(155.2)} cola="abajo" tam={48} />} />
  );
};

// ---------- 20-21 · «That's me. I'm the guy on the horse.» / «We all are.» ----------
const Risa20: React.FC = () => {
  const T = 156.9, L = (t: number) => fr(t, T);
  return (
    <CuartoCalido claves={[mira(0, 1450, 650, 1.4), mira(L(167.5), 1360, 640, 1.6)]}
      hud={<><Hud min={390} dia={5} /><ManoLeo texto="i'm the guy on the horse." x={180} y={830} desde={L(163.8)} /></>}>
      <LeoSentado tel={false} luz={L_ORO_D} poses={[{ f: 0, v: SENT }, { f: L(161.5), v: { ...SENT, cabeza: 12 } }]}
        caras={[{ f: 0, v: "feliz" }, { f: L(157.6), v: "risa" }, { f: L(160.2), v: "neutral" }, { f: L(161.5), v: "triste" }]} habla={[[L(161.5), L(165.1)]]} />
      <TenzoSentado />
    </CuartoCalido>
  );
};
const Todos21: React.FC = () => (
  <CuartoCalido claves={[mira(0, TX - 20, 700, 1.9), mira(78, TX - 20, 700, 2.0)]} hud={<Hud min={390} dia={5} />}>
    <LeoSentado tel={false} luz={L_ORO_D} poses={[{ f: 0, v: SENT }]} caras={[{ f: 0, v: "triste" }]} />
    <TenzoSentado habla={[[0, 78]]} />
  </CuartoCalido>
);
// 170,1-181,4 · el hábito: Leo montado en el caballo-Mara por Broadway, con el celular en la mano
const Habito21: React.FC<{ o?: number; z?: number; y?: number; asustado?: boolean }> = ({ o = 0, z = 1.05, y = 620, asustado }) => {
  const f = useF() + o;
  const hx = 4300 - f * 6.5;
  const ks = Array.from({ length: 13 }, (_, k) => mira(k * 30, 4300 - (k * 30 + o) * 6.5 - 120, y, z));
  return (
    <Escena Set={Broadway} pal={PAL} claves={ks}
      medio={<>
        <NubePolvo x={hx + 300} piso={BWY_PISO + 30} k={0.5} f={f} color="#1e1414" ancho={360} />
        <Montado x={hx} piso={BWY_PISO + 30} fase={(f % 14) / 14} dir={-1} s={1.3} variante="mara" look={LEO} cara={asustado ? (f % 50 < 25 ? "miedo" : "duda") : f < 160 ? "miedo" : "cansado"} escala={ESC} luz={L_TEL}
          pose={asustado ? { ...POSE_JINETE, tronco: -8, hD: 60, cD: 125, hI: 150, cI: 40, cabeza: (f % 50 < 25 ? -14 : 14) } : { ...POSE_JINETE, hD: 60, cD: 125, cabeza: 18 }} enManoD={<Tel />} />
        <Halo x={hx} y={BWY_PISO - 250} r={500} color={ACENTO} fuerza={0.3} />
      </>}
      hud={<Hud min={390} dia={5} estado="sube" />} />
  );
};
// ---------- 22-24 · el dedo · STOP. ----------
const Dedo22: React.FC = () => {
  const T = 181.4, L = (t: number) => fr(t, T);
  return (
    <CuartoCalido claves={[mira(0, TX - 40, 700, 1.7), mira(L(186), TX - 60, 680, 2.0), mira(L(190.7), TX - 60, 680, 2.15)]} hud={<Hud min={390} dia={5} />}>
      <LeoSentado tel={false} luz={L_ORO_D} poses={[{ f: 0, v: SENT }]} caras={[{ f: 0, v: "duda" }]} />
      <TenzoSentado poses={[{ f: 0, v: LOTO }, { f: L(182.4), v: TENZO_DEDO }]} habla={[[L(183.4), L(190.6)]]} />
    </CuartoCalido>
  );
};
const Stop23: React.FC = () => {
  const T = 190.7, L = (t: number) => fr(t, T);
  return (
    <CuartoCalido claves={[mira(0, LX - 60, 650, 2.4), mira(L(195.3), LX - 60, 650, 2.5)]}
      hud={<><Hud min={390} dia={5} /><Frase texto="STOP." desde={10} hasta={L(193.4)} tam={200} y={170} /></>}>
      <LeoSentado tel={false} luz={L_ORO_D} poses={[{ f: 0, v: SENT }]} caras={[{ f: 0, v: "sorpresa" }, { f: L(193.2), v: "duda" }]} habla={[[L(193.2), L(195.2)]]} />
    </CuartoCalido>
  );
};
const NoElCaballo24: React.FC = () => {
  const T = 195.3, L = (t: number) => fr(t, T);
  return (
    <CuartoCalido claves={[mira(0, 1450, 640, 1.45), mira(L(204.8), 1480, 630, 1.6)]} hud={<Hud min={390} dia={5} />}>
      <LeoSentado tel={false} luz={L_ORO_D} poses={[{ f: 0, v: SENT }]} caras={[{ f: 0, v: "duda" }, { f: L(201), v: "neutral" }]} />
      <TenzoSentado poses={[{ f: 0, v: TENZO_DEDO }, { f: 40, v: LOTO_ENSENA_ }]} caras={[{ f: 0, v: "neutral" }, { f: L(200.2), v: "risa" }, { f: L(201.6), v: "feliz" }]} habla={[[0, L(200.2)], [L(201.6), L(204.7)]]} />
    </CuartoCalido>
  );
};
const LOTO_ENSENA_ = { ...LOTO, hD: 70, cD: 80 };
// 204,8-212,8 · en cámara lenta, el jinete se da cuenta de que va arriba de un caballo
const Ve24: React.FC = () => {
  const T = 204.8, f = useF(), L = (t: number) => fr(t, T);
  const fl = f * 0.22; // el mundo en cámara lenta
  const hx = 1300 + fl * 3;
  return (
    <Escena Set={CaminoChina} pal={PAL_ANT} tiempo={(x) => x * 0.22} claves={[mira(0, hx, CP - 360, 1.6), mira(L(212.8), hx + 40, CP - 330, 1.9)]}
      medio={<>
        <NubePolvo x={hx - 330} piso={CP + 40} k={0.4} f={fl} />
        <Montado x={hx} piso={CP + 40} fase={(fl % 14) / 14} look={JINETE} cara={f < L(207.8) ? "sorpresa" : "feliz"} escala={1.0} luz={L_ANT}
          pose={f < L(205.8) ? POSE_JINETE : { ...POSE_JINETE, tronco: 0, cabeza: 26, hD: 40, cD: 100, hI: 40, cI: 100 }} />
      </>} />
  );
};
// ---------- 25-26 · la sombra se achica · «Pick up the phone.» ----------
const Aburrido25: React.FC = () => {
  const T = 212.8, L = (t: number) => fr(t, T);
  return (
    <CuartoCalido claves={[mira(0, LX - 60, 560, 1.35), mira(L(221.9), LX - 110, 520, 1.6)]}
      hud={<><Hud min={390} dia={5} /><ManoMara texto={"stop is boring.\nstop is empty."} x={980} y={150} desde={L(216.3)} /></>}>
      <MaraTras esc={(f) => interpolate(f, [0, L(216)], [1.0, 0.9], { extrapolateRight: "clamp" })} cara={[{ f: 0, v: "feliz" }, { f: L(214.5), v: "duda" }, { f: L(216.3), v: "enojo" }]}
        pose={{ hD: 70, cD: 50, hI: 40, cI: 70, cabeza: 30, tronco: 14 }} />
      <LeoSentado tel={false} luz={L_ORO_D} poses={[{ f: 0, v: SENT }]} caras={[{ f: 0, v: "neutral" }, { f: L(217), v: "duda" }]} />
    </CuartoCalido>
  );
};
const Agarra26: React.FC = () => {
  const T = 221.9, L = (t: number) => fr(t, T);
  return (
    <CuartoCalido claves={[mira(0, 1450, 650, 1.4), mira(L(231.5), 1380, 640, 1.6)]} hud={<Hud min={390} dia={5} />}>
      <LeoSentado tel={(f) => f >= L(225.4)} luz={L_ORO_D} poses={[{ f: 0, v: SENT }, { f: L(225.4), v: SENT_CEL }]} caras={[{ f: 0, v: "neutral" }, { f: L(225.6), v: "duda" }, { f: L(229.3), v: "sorpresa" }]} habla={[[L(227.7), L(229.2)]]} />
      <TenzoSentado poses={[{ f: 0, v: LOTO_ENSENA_ }]} habla={[[0, L(225.2)], [L(229.3), L(231)]]} />
    </CuartoCalido>
  );
};
// ---------- 27-28 · la pantalla en macro: el pulgar es el caballo · «Stop.» y el pulgar se congela ----------
const SEC = ["video", "video", "baile", "grito", "perro", "choque", "chica", "video", "baile", "perro", "grito"] as const;
const Scroll27: React.FC = () => {
  const f = useF();
  return (
    <AbsoluteFill style={{ background: "#120d0a" }}>
      <PantallaMacro secuencia={[...SEC]} periodo={f < 300 ? 28 : 20} desde={40} />
      <Hud min={390 + Math.floor(Math.max(0, f - 40) / 26)} dia={5} estado="sube" />
    </AbsoluteFill>
  );
};
const Congela28: React.FC = () => {
  const T = 245.7, L = (t: number) => fr(t, T);
  return (
    <AbsoluteFill style={{ background: "#120d0a" }}>
      <PantallaMacro secuencia={["choque", "chica", "perro", "baile"]} periodo={18} congela={L(248.7)} s={1.06} />
      <Hud min={406} dia={5} estado={(f) => (f < L(248.7) ? "sube" : "congelado")} />
    </AbsoluteFill>
  );
};
// ---------- 29-31 · ¿dónde estás? · «No.» · el celular boca abajo ----------
const Donde29: React.FC = () => {
  const T = 251.1, L = (t: number) => fr(t, T);
  return (
    <CuartoCalido claves={[mira(0, LX - 60, 710, 2.2), mira(L(267.2), LX - 70, 715, 2.45)]}
      hud={<><Hud min={406} dia={5} estado="congelado" /><ManoLeo texto={"jaw tight. eyes hurt.\nempty."} x={1080} y={250} desde={L(260.4)} /></>}>
      <LeoSentado telI luz={L_ORO_D} poses={[{ f: 0, v: { ...SENT_CEL, hD: 25, cD: 40 } }, { f: L(260.4), v: MANDIBULA }]} caras={[{ f: 0, v: "sorpresa" }, { f: L(253), v: "neutral" }, { f: L(256.7), v: "duda" }, { f: L(262), v: "triste" }]}
        habla={[[L(253.1), L(254.6)]]} miradas={[{ f: 0, v: { x: 0.2, y: 0.5 } }, { f: L(254.6), v: { x: -0.4, y: -0.6 } }]} />
    </CuartoCalido>
  );
};
const No30: React.FC = () => {
  const T = 267.2, L = (t: number) => fr(t, T);
  return (
    <CuartoCalido claves={[mira(0, 1450, 650, 1.4), mira(L(274.6), 1350, 630, 1.75), mira(L(280.6), LX + 40, 600, 2.2)]} hud={<Hud min={406} dia={5} estado="congelado" />}>
      <LeoSentado luz={L_ORO_D} poses={[{ f: 0, v: SENT_CEL }]} caras={[{ f: 0, v: "neutral" }, { f: L(275.3), v: "cansado" }, { f: L(278.8), v: "determinado" }]} habla={[[L(278.8), L(279.4)]]} />
      <TenzoSentado habla={[[0, L(274.3)]]} />
    </CuartoCalido>
  );
};
const BocaAbajo31: React.FC = () => {
  const T = 280.6, f = useF(), L = (t: number) => fr(t, T);
  const abajo = f >= L(281.7);
  return (
    <CuartoCalido claves={[mira(0, LX + 80, 640, 1.6), mira(L(284.8), 1500, 600, 1.05), mira(L(300.7), 1700, 560, 0.86)]}
      hud={<Hud min={406} dia={5} estado="congelado" />}>
      <MaraTras esc={(ff) => interpolate(ff, [L(294.5), L(297.6)], [0.9, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} x={MX - 60}
        asiento={undefined} pose={f < L(296.6) ? { hD: 50, cD: 60, hI: 40, cI: 70 } : { ...LOTO }} cara={[{ f: 0, v: "duda" }, { f: L(296.6), v: "cansado" }]} op={0.85} />
      <LeoSentado tel={(ff) => ff < L(281.7)} luz={L_ORO_D} poses={[{ f: 0, v: SENT_CEL }, { f: L(280.9), v: { ...SENT, hD: 70, cD: 20, tronco: 18 } }, { f: L(282.4), v: SENT }]} caras={[{ f: 0, v: "determinado" }, { f: L(283.4), v: "neutral" }]} />
      {abajo && <TelMesa x={LX + 150} y={P - AS + 2} bocaAbajo />}
      <TenzoSentado />
    </CuartoCalido>
  );
};
// ---------- 32-34 · la práctica · los monjes de Shōun-ji · Tenzo se para ----------
const Practica32: React.FC = () => {
  const T = 300.7, L = (t: number) => fr(t, T);
  return (
    <CuartoCalido claves={[mira(0, 1450, 650, 1.3), mira(L(312), 1520, 630, 1.45), mira(L(322), 1560, 610, 1.6)]}
      hud={<><Hud min={406} dia={5} /><ManoLeo texto={"stop.\nwhere am i going?"} x={1120} y={220} desde={L(305.4)} hasta={L(316)} /></>}>
      <TelMesa x={LX + 150} y={P - AS + 2} bocaAbajo />
      <LeoSentado tel={false} luz={L_ORO_D} poses={[{ f: 0, v: SENT }]} caras={[{ f: 0, v: "neutral" }, { f: L(316.2), v: "duda" }]} habla={[[L(315.5), L(316.6)]]} />
      <TenzoSentado poses={[{ f: 0, v: LOTO_ENSENA_ }, { f: L(313.6), v: { ...LOTO, hD: 45, cD: 115, hI: 40, cI: 120, cabeza: 10 } }, { f: L(314.6), v: LOTO_ENSENA_ }]}
        caras={[{ f: 0, v: "feliz" }, { f: L(316.8), v: "risa" }, { f: L(318.5), v: "feliz" }]} habla={[[0, L(313.2)], [L(314.2), L(315.4)], [L(316.7), L(322)]]} />
    </CuartoCalido>
  );
};
const Monjes33: React.FC = () => {
  const f = useF();
  const JP = JAPON_PISO + 60;
  return (
    <Escena Set={PortonMonasterio} pal={PAL_ANT} setProps={{ hora: 0.5 }} claves={[mira(0, 1600, 650, 0.95), mira(156, 1650, 660, 1.08)]}
      medio={<>
        {[0, 1, 2, 3, 4].map((k) => {
          const distraido = k === 3 && f > 30 && f < 110;
          return <Actor key={k} look={MONJE_SHOUNJI} escala={1.05} seed={30 + k} luz={L_ANT} ruta={[{ f: 0, x: 1180 + k * 210, y: JP }]} asiento={[{ f: 0, v: 8 }]} dir={[{ f: 0, v: 1 }]}
            poses={[{ f: 0, v: LOTO }]} caras={[{ f: 0, v: distraido ? "duda" : "cansado" }]} giros={[{ f: 0, v: distraido ? Math.sin(f / 10) * 0.9 : 0 }]} />;
        })}
      </>} />
  );
};
const Parado34: React.FC = () => {
  const T = 327.2, L = (t: number) => fr(t, T);
  return (
    <CuartoCalido claves={[mira(0, 1500, 640, 1.2), mira(L(331.8), 1540, 580, 1.3)]} hud={<Hud min={406} dia={5} />}>
      <TelMesa x={LX + 150} y={P - AS + 2} bocaAbajo />
      <LeoSentado tel={false} luz={L_ORO_D} poses={[{ f: 0, v: SENT }]} caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: { x: 1, y: -0.6 } }]} />
      <Actor look={TENZO} escala={ESC} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 8 }, { f: L(328.4), v: 8 }, { f: L(330.6), v: undefined, d: 60 }]}
        poses={[{ f: 0, v: LOTO }, { f: L(328.4), v: { ...LOTO, tronco: 22, hD: 40, cD: 60 } }, { f: L(330.6), v: { hD: 10, cD: 20, hI: 10, cI: 20 } }]} caras={[{ f: 0, v: "feliz" }, { f: L(329.7), v: "cansado" }, { f: L(331.2), v: "feliz" }]} />
    </CuartoCalido>
  );
};
// ---------- 35-36 · «why do you even care?» · algo le cruza la cara · se lleva el farol ----------
const TenzoParado: React.FC<{ caras?: { f: number; v: string }[]; habla?: [number, number][]; poses?: { f: number; v: string | Partial<Pose> }[] }> = ({ caras = [{ f: 0, v: "feliz" }], habla, poses = [{ f: 0, v: { hD: 10, cD: 20, hI: 10, cI: 20 } }] }) => (
  <Actor look={TENZO} escala={ESC} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: -1 }]} poses={poses} caras={caras} habla={habla} />
);
const Porque35: React.FC = () => (
  <CuartoCalido claves={[mira(0, 1450, 610, 1.55), mira(102, 1450, 600, 1.65)]} hud={<Hud min={406} dia={5} />}>
    <LeoSentado tel={false} luz={L_ORO_D} poses={[{ f: 0, v: { ...SENT, cabeza: -10, hD: 70, cD: 40 } }, { f: 50, v: { ...SENT, cabeza: -10, hD: 90, cD: 20 } }]} caras={[{ f: 0, v: "duda" }]} habla={[[0, 100]]} miradas={[{ f: 0, v: { x: 1, y: -0.8 } }]} />
    <TenzoParado />
  </CuartoCalido>
);
const Cruza35: React.FC = () => {
  const T = 335.2, f = useF(), L = (t: number) => fr(t, T);
  const sx = interpolate(f, [L(337.4), L(339.6)], [TX - 500, TX + 500], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <CuartoCalido claves={[mira(0, TX - 10, 690, 2.0), mira(L(346.6), TX - 10, 690, 2.2)]} hud={<Hud min={406} dia={5} />}>
      <TenzoParado caras={[{ f: 0, v: "neutral" }, { f: L(337.6), v: "triste" }, { f: L(339.4), v: "neutral" }, { f: L(343), v: "feliz" }]} habla={[[L(342), L(346.5)]]} />
      {f > L(337.2) && f < L(339.8) && <rect x={sx - 160} y={-200} width={320} height={1400} fill="#0a0c12" opacity={0.42} transform={`skewX(-12)`} />}
    </CuartoCalido>
  );
};
const SeVa36: React.FC = () => {
  const T = 346.6, f = useF(), L = (t: number) => fr(t, T);
  const conFarol = f >= L(347.6);
  const x = interpolate(f, [L(348.0), L(350.4)], [TX, 1050], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, 1480, 650, 1.15), mira(L(350.4), 1300, 640, 1.0)]}
      detras={<>{oscuro}<Tibio k={1 - 0.4 * ent(f, L(348), L(350.4))} x={conFarol ? x - 30 : FX} y={P - (conFarol ? 200 : 60)} /></>}
      medio={<>
        <TelMesa x={LX + 150} y={P - AS + 2} bocaAbajo />
        <LeoSentado tel={false} luz={L_ORO_D} poses={[{ f: 0, v: SENT }]} caras={[{ f: 0, v: "neutral" }]} />
        <Actor look={TENZO} escala={ESC} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: TX, y: P }, { f: L(348.0), x: TX, y: P }, { f: L(350.4), x: 1050, y: P }]}
          poses={[{ f: 0, v: { hD: 10, cD: 20 } }, { f: L(346.9), v: { tronco: 40, hD: 70, cD: 10, hI: 20, cI: 30, pI: 30, rI: 50, pD: 40, rD: 60 } }, { f: L(347.7), v: FAROL }]}
          dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }]} habla={[[L(348.3), L(350.3)]]} enManoD={conFarol ? <FarolMano /> : undefined} />
        {!conFarol && <FarolPiso />}
      </>}
      hud={<Hud min={406} dia={5} />} />
  );
};
// ---------- 37 · DAY 6: 41 rayitas · DAY 7: 33 · 3h 50m ----------
const Rayas37: React.FC = () => {
  const T = 350.4, f = useF(), L = (t: number) => fr(t, T);
  const n6 = interpolate(f, [L(352.4), L(357.6)], [0, 41], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const n7 = interpolate(f, [L(359.4), L(360.9)], [0, 33], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dia = f < L(358.3) ? 6 : 7;
  const z = interpolate(f, [0, L(364.4)], [1.0, 1.08]);
  const mano = f < L(358.3) ? { x: 520 + (n6 % 25) * 17, y: 330 + Math.floor(n6 / 25) * 70 } : { x: 520 + (n7 % 25) * 17, y: 560 + Math.floor(n7 / 25) * 70 };
  return (
    <AbsoluteFill style={{ background: "#3e3226" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(960,540) scale(${z}) translate(-960,-540)`}>
          {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={0} y={i * 80} width={1920} height={3} fill="#33291f" />)}
          <Halo x={1500} y={150} r={900} color="#e9e4d8" fuerza={0.25} />
          <Hoja x={940} y={540} w={1120} h={640} rot={-2}>
            <text x={420} y={300} fontFamily={F_MANO} fontSize={52} fontWeight={700} fill="#2a2622">day 6</text>
            <Rayitas n={n6} x={520} y={330} color="#2a2622" alto={50} paso={13} />
            {n6 >= 41 && <text x={1300} y={380} fontFamily={F_MANO} fontSize={60} fontWeight={700} fill="#2a2622">41</text>}
            {f >= L(358.3) && <text x={420} y={530} fontFamily={F_MANO} fontSize={52} fontWeight={700} fill="#2a2622">day 7</text>}
            <Rayitas n={n7} x={520} y={560} color="#2a2622" alto={50} paso={13} />
            {n7 >= 33 && <text x={1300} y={610} fontFamily={F_MANO} fontSize={60} fontWeight={700} fill="#2a2622">33</text>}
          </Hoja>
          {/* el lápiz que marca */}
          <g transform={`translate(${mano.x + 30},${mano.y + 30 + Math.sin(f / 2) * 6}) rotate(35)`}>
            <rect x={-12} y={-10} width={24} height={260} rx={4} fill="#e0b040" />
            <path d="M-12,-10 L0,-50 L12,-10 Z" fill="#e9d2a8" /><path d="M-4,-38 L0,-50 L4,-38 Z" fill="#2a2622" />
          </g>
        </g>
      </svg>
      <Hud min={f < L(362.2) ? 406 : 230} dia={dia} estado={f >= L(362.2) ? "normal" : "congelado"} />
    </AbsoluteFill>
  );
};
// ---------- 38-40 · la parada del 36, de mañana, sin celular · Maya · la sombra se relame ----------
const BP = BWY_PISO;
const LEO_PARADA = BWY_PUNTOS.parada36 - 160, MAYA_X = BWY_PUNTOS.parada36 + 160;
const L_DIA = { lado: 1 as const, color: "#eef2f6", fuerza: 0.45 };
const Parada: React.FC<{ claves: ReturnType<typeof mira>[]; leoCara?: { f: number; v: string }[]; mayaCabeza?: { f: number; v: string | Partial<Pose> }[]; mayaCara?: { f: number; v: string }[]; mara?: React.ReactNode; hud?: React.ReactNode }> = ({ claves, leoCara = [{ f: 0, v: "neutral" }], mayaCabeza = [{ f: 0, v: { hD: 50, cD: 100, hI: 50, cI: 100, cabeza: 22 } }], mayaCara = [{ f: 0, v: "neutral" }], mara, hud }) => (
  <Escena Set={Broadway} pal={PAL_DIA} setProps={{ hora: "dia", nieve: true }} claves={claves}
    medio={<>
      {mara}
      <Actor look={LEO} escala={ESC} seed={1} luz={L_DIA} ruta={[{ f: 0, x: LEO_PARADA, y: BP }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 20, cD: -40, hI: -20, cI: -40 } }]} caras={leoCara} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} />
      <Actor look={MAYA} escala={ESC * 0.95} seed={8} luz={L_DIA} ruta={[{ f: 0, x: MAYA_X, y: BP }]} dir={[{ f: 0, v: -1 }]} poses={mayaCabeza} caras={mayaCara} enManoD={<Libro abierto color="#2e5a8a" />} />
    </>}
    hud={<>{hud}<Hud min={230} dia={7} /></>} />
);
const Parada38: React.FC = () => {
  const T = 364.4, L = (t: number) => fr(t, T);
  return <Parada claves={[mira(0, BWY_PUNTOS.parada36 - 300, 600, 0.8), mira(L(376.4), BWY_PUNTOS.parada36, 600, 0.98)]} leoCara={[{ f: 0, v: "cansado" }, { f: L(372), v: "neutral" }]} />;
};
const Maya38: React.FC = () => <Parada claves={[mira(0, MAYA_X + 10, 660, 1.7), mira(243, MAYA_X + 10, 650, 1.95)]}
  mayaCabeza={[{ f: 0, v: { hD: 50, cD: 100, hI: 50, cI: 100, cabeza: 22 } }, { f: 110, v: { hD: 95, cD: 40, hI: 50, cI: 100, cabeza: 18 } }, { f: 128, v: { hD: 50, cD: 100, hI: 50, cI: 100, cabeza: 22 } }, { f: 200, v: { hD: 55, cD: 95, hI: 50, cI: 100, cabeza: 26 } }]}
  mayaCara={[{ f: 0, v: "neutral" }, { f: 140, v: "feliz" }, { f: 190, v: "neutral" }]} hud={<ManoLeo texto="a real paper book." x={110} y={300} desde={150} tam={60} />} />;
const Sonrie39: React.FC = () => (
  <Parada claves={[mira(0, BWY_PUNTOS.parada36, 590, 1.35), mira(111, BWY_PUNTOS.parada36, 580, 1.45)]}
    leoCara={[{ f: 0, v: "neutral" }, { f: 30, v: "sorpresa" }, { f: 70, v: "feliz" }]}
    mayaCabeza={[{ f: 0, v: { hD: 50, cD: 100, hI: 50, cI: 100, cabeza: 22 } }, { f: 8, v: { hD: 40, cD: 90, hI: 40, cI: 90, cabeza: -2 } }]}
    mayaCara={[{ f: 0, v: "neutral" }, { f: 12, v: "sorpresa" }, { f: 34, v: "feliz" }]} />
);
const Relame40: React.FC = () => (
  <Parada claves={[mira(0, LEO_PARADA - 40, 520, 1.55), mira(129, LEO_PARADA - 60, 510, 1.7)]} leoCara={[{ f: 0, v: "feliz" }]}
    mara={<Actor look={MARA} escala={ESC * 1.2} seed={5} ruta={[{ f: 0, x: LEO_PARADA - 210, y: BP - 10 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 50, cD: 60, hI: 40, cI: 70, cabeza: 18 } }]}
      caras={[{ f: 0, v: "cansado" }, { f: 30, v: "picaro" }, { f: 70, v: "risa" }, { f: 100, v: "picaro" }]} opacidad={() => 0.92} />} />
);
// ---------- 41 · CTA + gancho del día 8: el farol en el piso del cuarto vacío se apaga ----------
const Cierre41: React.FC = () => {
  const T = 392.5, f = useF(), L = (t: number) => fr(t, T);
  const luz = 1 - ent(f, L(404.2), L(409.0));
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, 1500, 680, 1.15), mira(L(409.2), FX, 760, 1.7)]}
      detras={<>{oscuro}<Tibio k={luz} x={FX} y={P - 60} /></>}
      medio={<FarolPapel x={FX} y={P + 4} s={1.05} luz={luz} halo={luz} />}
      hud={<>
        <Frase texto="When was the last time you said stop?" desde={L(392.7)} hasta={L(398.5)} y={250} tam={64} />
        <Frase texto="Watch Day 8 next" desde={L(398.9)} y={880} tam={60} />
      </>} />
  );
};

// ===================== VUELTA OJO 1 (26-oct): plano/contraplano + un componente que lleve el concepto en cada frase =====================
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
type LeoP = React.ComponentProps<typeof LeoSentado>;
type TenzoP = React.ComponentProps<typeof TenzoSentado>;
// plano corto de Leo (colchón) y de Tenzo (piso) en el cuarto tibio
const CortoLeo: React.FC<{ leo: LeoP; hud?: React.ReactNode; z?: number; dur?: number; mara?: React.ReactNode; dx?: number }> = ({ leo, hud, z = 2.2, dur = 150, mara, dx = -30 }) => (
  <CuartoCalido claves={[mira(0, LX + dx, 690, z), mira(dur, LX + dx, 688, z + 0.12, { curva: "in" })]} hud={hud}>
    {mara}
    <LeoSentado tel={false} luz={L_ORO_D} {...leo} />
  </CuartoCalido>
);
const CortoTenzo: React.FC<{ tenzo: TenzoP; hud?: React.ReactNode; z?: number; dur?: number }> = ({ tenzo, hud, z = 2.3, dur = 150 }) => (
  <CuartoCalido claves={[mira(0, TX - 10, 735, z), mira(dur, TX - 10, 733, z + 0.12, { curva: "in" })]} hud={hud}>
    <TenzoSentado {...tenzo} />
  </CuartoCalido>
);
// gesto: alterna dos poses cada `paso` cuadros entre a y b (manos que hablan, pulgar que baja, toallas que se doblan)
const alterna = (a: Partial<Pose>, b: Partial<Pose>, f0: number, f1: number, paso = 16) =>
  Array.from({ length: Math.max(1, Math.ceil((f1 - f0) / paso)) }, (_, k) => ({ f: f0 + k * paso, v: k % 2 ? b : a }));
const HABLA_A: Partial<Pose> = { ...LOTO, hD: 60, cD: 70, hI: 30, cI: 80 };
const HABLA_B: Partial<Pose> = { ...LOTO, hD: 95, cD: 40, hI: 40, cI: 70, cabeza: 6 };
const ANCHO: Partial<Pose> = { ...LOTO, hD: 140, cD: 15, hI: 140, cI: 15, cabeza: -6 }; // brazos abiertos: «más grande que vos»

// 3,0-5,7 · las dos de la mañana: el celular gigante al lado de la cara
const AlbaTel: React.FC = () => (
  <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX + 260, 690, 1.9), mira(81, LX + 250, 690, 2.0)]}
    detras={oscuro}
    medio={<LeoSentado poses={alterna(SENT_CEL, { ...SENT_CEL, cD: 135 }, 0, 81, 10)} />}
    hud={<TelGrande modo="hora" texto="2:00" sub="AM" x={1440} y={560} s={0.66} desde={4} inclina={-4} />} />
);
// 10,0-13,1 · cuatro horas, once minutos: el contador del celular a pantalla llena
const Cuenta4h: React.FC = () => (
  <AbsoluteFill style={{ background: "#0d0f14" }}>
    <TelGrande modo="screentime" min={0} minHasta={251} x={960} y={560} s={0.96} desde={2} />
    <RelojDia min={371} x={1580} y={60} />
  </AbsoluteFill>
);
// 15,8-21,1 · DAY 5 · 6 h 30 m: Leo scrollea, el contador sube al lado
const Dia5a: React.FC = () => (
  <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX + 300, 660, 1.6), mira(159, LX + 280, 650, 1.7)]}
    detras={oscuro}
    medio={<LeoSentado poses={alterna(SENT_CEL, { ...SENT_CEL, cD: 138 }, 0, 159, 9)} />}
    hud={<>
      <Hud min={[{ f: 30, v: 240 }, { f: 135, v: 390, d: 50 }]} dia={5} estado="sube" />
      <TelGrande modo="screentime" min={240} minHasta={390} x={1460} y={560} s={0.62} desde={20} />
    </>} />
);
// 36,3-40,6 · acostado a oscuras, la pantalla a dos pulgadas de la cara
const Acostado6: React.FC = () => {
  const f = useF();
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX - 40, P - 120, 2.0), mira(129, LX - 30, P - 115, 2.25)]}
      detras={<rect x={-900} y={-700} width={5200} height={2000} fill="#02030a" opacity={0.78} />}
      medio={<>
        <g transform={`rotate(-90 ${LX} ${P - AS - 20})`}>
          <Actor look={LEO} escala={ESC} seed={1} luz={{ lado: 1, color: ACENTO, fuerza: 0.9 }} ruta={[{ f: 0, x: LX, y: P }]} dir={[{ f: 0, v: 1 }]}
            poses={alterna({ hD: 70, cD: 120, hI: 10, cI: 20, cabeza: -8 }, { hD: 74, cD: 128, hI: 10, cI: 20, cabeza: -8 }, 0, 129, 8)} caras={[{ f: 0, v: "cansado" }]} enManoD={<Tel />} />
        </g>
        <Halo x={LX - 40} y={P - AS - 260} r={240 + 10 * Math.sin(f / 5)} color={ACENTO} fuerza={0.4} />
      </>}
      hud={<Hud min={390} dia={5} estado="sube" />} />
  );
};
// 44,3-47,5 · diez años: la línea de 14 a 24 con los celulares que fue teniendo
const Linea10: React.FC = () => {
  const f = useF();
  const p = interpolate(f, [6, 80], [0, 1], cl);
  const X0 = 300, X1 = 1620, Y = 640;
  const tels = [14, 16, 18, 20, 22, 24];
  return (
    <AbsoluteFill style={{ background: "#0d0f14" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <rect x={X0} y={Y - 6} width={X1 - X0} height={12} rx={6} fill="#2b2f37" />
        <rect x={X0} y={Y - 6} width={(X1 - X0) * p} height={12} rx={6} fill={ACENTO} />
        {Array.from({ length: 11 }).map((_, k) => {
          const x = X0 + ((X1 - X0) * k) / 10, edad = 14 + k;
          const on = p >= k / 10;
          const t = tels.indexOf(edad);
          const s = t < 0 ? 0 : interpolate(f, [6 + k * 7.4, 14 + k * 7.4], [0, 1], cl);
          return (
            <g key={k}>
              <rect x={x - 3} y={Y + 14} width={6} height={26} fill={on ? ACENTO : "#4a4f58"} />
              <text x={x} y={Y + 84} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={40} fill={on ? "#f4efe6" : "#6a6f78"}>{edad}</text>
              {t >= 0 && (
                <g transform={`translate(${x},${Y - 60}) scale(${s})`}>
                  <rect x={-(22 + t * 6)} y={-(90 + t * 22)} width={44 + t * 12} height={90 + t * 22} rx={10} fill="#15171c" stroke="#5a5f68" strokeWidth={4} />
                  <rect x={-(16 + t * 6)} y={-(82 + t * 22)} width={32 + t * 12} height={74 + t * 22} rx={6} fill={ACENTO} opacity={0.85} />
                </g>
              )}
            </g>
          );
        })}
        <text x={960} y={300} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={92} fill="#f4efe6" opacity={interpolate(f, [0, 12], [0, 1], cl)}>10 YEARS</text>
        <text x={X0} y={Y + 150} fontFamily={F_HUD} fontWeight={500} fontSize={34} fill="#9aa0aa" opacity={interpolate(f, [30, 44], [0, 1], cl)}>first phone · age 14</text>
      </svg>
      <Hud min={390} dia={5} />
    </AbsoluteFill>
  );
};
// 47,5-50,1 · hace la cuenta acostado en la oscuridad
const Cuenta7: React.FC = () => (
  <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX - 20, 650, 2.1), mira(78, LX - 20, 648, 2.2)]}
    detras={oscuro}
    medio={<LeoSentado tel={false} luz={L_FRIO} poses={[{ f: 0, v: { ...SENT, cabeza: -18 } }, { f: 30, v: { ...SENT, cabeza: -18, hD: 120, cD: 140 } }]} caras={[{ f: 0, v: "duda" }, { f: 46, v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 0.3, y: -1 } }]} />}
    hud={<><Hud min={390} dia={5} /><ManoLeo texto={"6 h × 365\n× 10 years"} x={110} y={330} desde={6} tam={66} /></>} />
);
// 50,1-53,3 · veinte mil horas
const Horas20k: React.FC = () => (
  <AbsoluteFill style={{ background: "#0d0f14" }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><Halo x={960} y={560} r={700} color={ACENTO} fuerza={0.25} /></svg>
    <GranNumero rotulo="HOURS ON A SCREEN" claves={[{ f: 0, v: 0 }, { f: 6, v: 20000, d: 56 }]} y={330} color={ACENTO} tam={230} />
    <Hud min={390} dia={5} />
  </AbsoluteFill>
);
// 53,3-55,2 · más que la carrera de medicina: dos barras
const Medicina7: React.FC = () => {
  const f = useF();
  const a = interpolate(f, [2, 30], [0, 1], cl), b = interpolate(f, [8, 40], [0, 1], cl);
  const Barra: React.FC<{ y: number; w: number; k: number; txt: string; n: string; c: string }> = ({ y, w, k, txt, n, c }) => (
    <g>
      <text x={260} y={y - 22} fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#e9e3d6">{txt}</text>
      <rect x={260} y={y} width={w} height={96} rx={18} fill="#22262d" />
      <rect x={260} y={y} width={w * k} height={96} rx={18} fill={c} />
      <text x={280 + w * k} y={y + 66} fontFamily={F_HUD} fontWeight={600} fontSize={52} fill={c} opacity={k}>{n}</text>
    </g>
  );
  return (
    <AbsoluteFill style={{ background: "#0d0f14" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <Barra y={380} w={1000} k={a} txt="BECOMING A DOCTOR" n="~15,000 h" c="#8fb4e8" />
        <Barra y={640} w={1333} k={b} txt="LEO'S THUMB" n="20,000 h" c={ACENTO} />
      </svg>
      <Hud min={390} dia={5} />
    </AbsoluteFill>
  );
};
// 55,2-60,4 · toc toc: ondas en la puerta
const Golpes: React.FC<{ x: number; y: number; f0: number }> = ({ x, y, f0 }) => {
  const f = useF();
  return <g>{[0, 9, 18].map((d, i) => { const t = f - f0 - d; if (t < 0 || t > 26) return null; return <circle key={i} cx={x} cy={y} r={30 + t * 6} fill="none" stroke="#e9e3d6" strokeWidth={6 - t * 0.2} opacity={1 - t / 26} />; })}</g>;
};
// 64,5-69,3 · Tenzo en el pasillo, de cerca, con la nieve que le cae
const Copos: React.FC<{ x: number; y: number; w: number; h: number; n?: number }> = ({ x, y, w, h, n = 40 }) => {
  const f = useF();
  return <g fill="#f4f6fa">{Array.from({ length: n }).map((_, k) => { const sx = (k * 7919) % w, vy = 1.2 + (k % 5) * 0.35; const yy = ((k * 131 + f * vy) % h); return <circle key={k} cx={x + sx + Math.sin(f / 20 + k) * 14} cy={y + yy} r={3 + (k % 3)} opacity={0.85} />; })}</g>;
};
const TenzoPuerta: React.FC = () => {
  const W = WILSON_PISO;
  return (
    <Escena Set={PasilloWilson} pal={PAL} setProps={{ apertura: 1 }} claves={[mira(0, WILSON.tenzo - 10, 690, 2.1), mira(144, WILSON.tenzo - 10, 680, 2.3, { curva: "in" })]}
      medio={<>
        <Actor look={TENZO} escala={ESC} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: WILSON.tenzo, y: W }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: FAROL }, { f: 40, v: { ...FAROL, hD: 60, cD: 30 } }]} caras={[{ f: 0, v: "neutral" }, { f: 34, v: "feliz" }]} enManoD={<FarolMano />} />
        <NieveHombros x={WILSON.tenzo} y={W - 228} />
        <Halo x={WILSON.tenzo - 50} y={W - 160} r={600} color={ORO} fuerza={0.4} />
        <Copos x={WILSON.tenzo - 420} y={W - 620} w={840} h={620} />
      </>}
      hud={<Hud min={390} dia={5} />} />
  );
};
// 70,9-76,3 · «había una sola ventana azul»: Tenzo en la vereda mira para arriba
const Fachada10b: React.FC = () => (
  <Escena Set={FachadaWilson} pal={PAL} claves={[mira(0, 1650, 560, 0.85), mira(162, 1720, 520, 1.0)]}
    medio={<>
      <Actor look={TENZO} escala={ESC * 0.8} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: 1050, y: WILSON_PISO }, { f: 80, x: 1500, y: WILSON_PISO }]}
        poses={[{ f: 0, v: FAROL }]} caras={[{ f: 0, v: "neutral" }, { f: 90, v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: 84, v: { x: 0.4, y: -1 } }]} enManoD={<FarolMano />} />
    </>}
    hud={<Hud min={390} dia={5} />} />
);
// 76,3-80,4 · el celular en la mano de Leo, todavía prendido
const TelPrendido: React.FC = () => (
  <AbsoluteFill style={{ background: "#14161c" }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><Halo x={200} y={300} r={700} color={ORO} fuerza={0.3} /></svg>
    <TelGrande modo="feed" vel={5} x={1060} y={600} s={0.92} desde={0} inclina={-8} pulgar />
    <Hud min={390} dia={5} />
  </AbsoluteFill>
);
// 80,4-83,4 · «May I come in? It is cold and I am old»: se frota las manos
const PasarCorto: React.FC = () => {
  const W = WILSON_PISO;
  return (
    <Escena Set={PasilloWilson} pal={PAL} setProps={{ apertura: 1 }} claves={[mira(0, WILSON.tenzo - 10, 700, 2.2), mira(90, WILSON.tenzo - 10, 700, 2.3)]}
      medio={<>
        <Actor look={TENZO} escala={ESC} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: WILSON.tenzo, y: W }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: FAROL }, ...alterna({ ...FAROL, hI: 80, cI: 120 }, { ...FAROL, hI: 70, cI: 100 }, 30, 90, 6)]} caras={[{ f: 0, v: "feliz" }, { f: 32, v: "cansado" }, { f: 70, v: "feliz" }]}
          habla={[[0, 26], [32, 86]]} enManoD={<FarolMano />} />
        <NieveHombros x={WILSON.tenzo} y={W - 228} />
        <Copos x={WILSON.tenzo - 420} y={W - 620} w={840} h={620} n={26} />
      </>}
      hud={<Hud min={390} dia={5} />} />
  );
};
// 100,7-106,5 · recuerdo del día 4: llama a la mamá (feliz) … y scrollea hasta las 6
const Recuerdo14: React.FC = () => {
  const f = useF();
  const llamada = f < 78;
  return (
    <AbsoluteFill style={{ background: "#2a2622" }}>
      <Recuerdo>
        <Escena Set={Cuarto} pal={PAL} setProps={{ lampara: true }} claves={[mira(0, LX + 60, 690, 2.2)]}
          medio={<Actor look={LEO} escala={ESC} seed={1} luz={L_TEL} ruta={[{ f: 0, x: LX, y: P }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: AS }]}
            poses={llamada ? [{ f: 0, v: { ...SENT, hD: 150, cD: 150, cabeza: -6 } }] : alterna(SENT_CEL, { ...SENT_CEL, cD: 136 }, 78, 174, 8)}
            caras={[{ f: 0, v: "risa" }, { f: 78, v: "neutral" }, { f: 130, v: "cansado" }]} habla={llamada ? [[6, 70]] : undefined} enManoD={<Tel />} />}
          hud={<RelojDia min={llamada ? 1290 : interpolate(f, [80, 170], [1320, 1800], cl)} x={1500} y={60} />} />
      </Recuerdo>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 46, letterSpacing: 6, color: "#e9e3d6" }}>DAY 4</div>
      <ManoLeo texto="called mom ♥" x={1500} y={880} desde={14} hasta={78} tam={62} />
      <ManoLeo texto="...until 6 a.m." x={1460} y={880} desde={90} tam={62} />
    </AbsoluteFill>
  );
};
// 166-170 · «STOP.» a pantalla llena, en negro
const StopNegro: React.FC = () => {
  const f = useF();
  const s = interpolate(f, [0, 8], [1.25, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#07080b", alignItems: "center", justifyContent: "center" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><Halo x={960} y={540} r={520} color={ORO} fuerza={0.18} /></svg>
      <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: 300, color: "#f4efe6", letterSpacing: 10, transform: `scale(${s})` }}>STOP.</div>
    </AbsoluteFill>
  );
};
// 185-190,7 · la primera palabra: antes de sentarse, antes de cantar, antes de todo
const Antes22: React.FC = () => {
  const f = useF();
  const items = ["before the sitting", "before the chanting", "before anything"];
  return (
    <AbsoluteFill style={{ background: "#3e3226" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <Halo x={1400} y={200} r={900} color="#e9e4d8" fuerza={0.25} />
        <Hoja x={960} y={540} w={1100} h={700} rot={-1.5}>
          <text x={430} y={300} fontFamily={F_MANO} fontSize={58} fontWeight={700} fill="#2a2622">the first word:</text>
          {items.map((t, i) => <text key={i} x={470} y={420 + i * 110} fontFamily={F_MANO} fontSize={52} fontWeight={700} fill="#5a4e42" opacity={interpolate(f, [20 + i * 34, 30 + i * 34], [0, 1], cl)}>{"— " + t}</text>)}
          <rect x={1060} y={240} width={260} height={90} rx={10} fill="none" stroke={ACENTO} strokeWidth={6} opacity={interpolate(f, [128, 140], [0, 1], cl)} />
          <text x={1190} y={305} textAnchor="middle" fontFamily={F_MANO} fontSize={64} fontWeight={700} fill={ACENTO} opacity={interpolate(f, [128, 140], [0, 1], cl)}>?</text>
        </Hoja>
      </svg>
      <Hud min={390} dia={5} />
    </AbsoluteFill>
  );
};
// 256,7-267,2 · el cuerpo de Leo: mandíbula apretada, ojos que duelen, vacío en el pecho
const Cuerpo29: React.FC = () => {
  const f = useF();
  const pts = [
    { x: 960, y: 330, t: "jaw tight", f0: 102, lx: 1180, ly: 300 },
    { x: 935, y: 255, t: "eyes hurt", f0: 147, lx: 520, ly: 230 },
    { x: 960, y: 560, t: "empty", f0: 204, lx: 1180, ly: 580 },
  ];
  return (
    <AbsoluteFill style={{ background: "#16130f" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <Halo x={1500} y={600} r={800} color={ORO} fuerza={0.22} />
        {/* la silueta de Leo de frente, contorno a mano */}
        <g fill="none" stroke="#e9e3d6" strokeWidth={7} strokeLinecap="round" opacity={interpolate(f, [0, 20], [0, 1], cl)}>
          <ellipse cx={960} cy={270} rx={120} ry={140} />
          <path d="M890,390 Q960,420 1030,390 L1050,420 Q1180,450 1220,560 L1260,820 M870,420 Q740,450 700,560 L660,820 M800,500 L800,900 M1120,500 L1120,900" />
        </g>
        {pts.map((p, i) => {
          const o = interpolate(f, [p.f0, p.f0 + 12], [0, 1], cl);
          const r = 26 + 8 * Math.sin((f - p.f0) / 5);
          return (
            <g key={i} opacity={o}>
              <circle cx={p.x} cy={p.y} r={r} fill={ACENTO} opacity={0.35} />
              <circle cx={p.x} cy={p.y} r={10} fill={ACENTO} />
              <path d={`M${p.x},${p.y} L${p.lx - (p.lx > p.x ? 16 : -16)},${p.ly - 14}`} stroke="#e9e3d6" strokeWidth={3} />
            </g>
          );
        })}
      </svg>
      {pts.map((p, i) => <ManoLeo key={i} texto={p.t} x={p.lx > p.x ? p.lx : p.lx - 300} y={p.ly - 60} desde={p.f0 + 6} tam={62} />)}
      <Hud min={406} dia={5} estado="congelado" />
    </AbsoluteFill>
  );
};
// 274,6-278,8 · otra chica, otro perro, otro tipo gritando
const Otra30: React.FC = () => (
  <AbsoluteFill style={{ background: "#120d0a" }}>
    <PantallaMacro secuencia={["chica", "perro", "grito", "chica"]} periodo={30} s={1.02} />
    <Hud min={406} dia={5} estado="congelado" />
  </AbsoluteFill>
);
// 280,6-284,8 · la mano da vuelta el celular sobre el colchón (de cerca)
const DaVuelta31: React.FC = () => {
  const f = useF();
  return (
    <CuartoCalido claves={[mira(0, LX + 110, P - AS - 80, 2.8), mira(126, LX + 120, P - AS - 70, 3.0)]} hud={<Hud min={406} dia={5} estado="congelado" />}>
      <LeoSentado tel={(ff) => ff < 33} luz={L_ORO_D} poses={[{ f: 0, v: SENT_CEL }, { f: 10, v: { ...SENT, hD: 70, cD: 20, tronco: 18 } }, { f: 54, v: SENT }]} caras={[{ f: 0, v: "determinado" }, { f: 84, v: "neutral" }]} />
      {f >= 33 && <TelMesa x={LX + 150} y={P - AS + 2} bocaAbajo />}
    </CuartoCalido>
  );
};
// 284,8-292,3 · el cuarto en silencio: la nieve contra la ventana
const Silencio31: React.FC = () => (
  <CuartoCalido claves={[mira(0, 2100, 600, 1.0), mira(225, 2600, 520, 1.35, { curva: "in" })]} hud={<Hud min={406} dia={5} estado="congelado" />}>
    <TelMesa x={LX + 150} y={P - AS + 2} bocaAbajo />
    <LeoSentado tel={false} luz={L_ORO_D} poses={[{ f: 0, v: SENT }, { f: 110, v: { ...SENT, cabeza: -8 } }]} caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: { x: 1, y: -0.3 } }]} />
    <TenzoSentado />
  </CuartoCalido>
);
// 292,3-300,7 · la sombra se sienta, como un caballo que paró de correr
const Sienta31: React.FC = () => {
  const f = useF();
  return (
    <CuartoCalido claves={[mira(0, MX - 20, 640, 1.7), mira(252, MX + 40, 660, 1.85)]} hud={<Hud min={406} dia={5} estado="congelado" />}>
      <Actor look={MARA} escala={ESC * 0.9} seed={5} ruta={[{ f: 0, x: MX - 60, y: P - 34 }]} dir={[{ f: 0, v: 1 }]}
        asiento={[{ f: 0, v: undefined }, { f: 130, v: 8, d: 40 }]} poses={[{ f: 0, v: { hD: 50, cD: 60, hI: 40, cI: 70 } }, { f: 130, v: LOTO }]}
        caras={[{ f: 0, v: "duda" }, { f: 120, v: "cansado" }]} opacidad={() => 0.85} />
      <LeoSentado tel={false} luz={L_ORO_D} poses={[{ f: 0, v: SENT }, { f: 60, v: { ...SENT, tronco: -4, cabeza: -10 } }, { f: 100, v: SENT }]} caras={[{ f: 0, v: "neutral" }]} />
      <TelMesa x={LX + 150} y={P - AS + 2} bocaAbajo />
      {f > 0 && null}
    </CuartoCalido>
  );
};
// 300,7-316 · la práctica en un diagrama: STOP → WHERE AM I GOING? → go / put it down
const Diagrama32: React.FC = () => {
  const f = useF();
  const o = (a: number) => interpolate(f, [a, a + 12], [0, 1], cl);
  const Caja: React.FC<{ x: number; y: number; w: number; t: string; a: number; c?: string }> = ({ x, y, w, t, a, c = "#2a2622" }) => (
    <g opacity={o(a)}>
      <rect x={x - w / 2} y={y - 56} width={w} height={112} rx={20} fill="#fbf6ea" stroke={c} strokeWidth={6} />
      <text x={x} y={y + 18} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={52} fill={c}>{t}</text>
    </g>
  );
  const Flecha: React.FC<{ d: string; a: number }> = ({ d, a }) => <path d={d} stroke="#2a2622" strokeWidth={6} fill="none" strokeLinecap="round" opacity={o(a)} />;
  return (
    <AbsoluteFill style={{ background: "#3e3226" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <Halo x={1400} y={200} r={900} color="#e9e4d8" fuerza={0.25} />
        <Hoja x={960} y={560} w={1500} h={820} rot={-1}>
          <Caja x={420} y={250} w={340} t="pick it up" a={0} c="#5a4e42" />
          <Flecha d="M600,250 L740,250 M720,236 L740,250 L720,264" a={10} />
          <Caja x={890} y={250} w={240} t="STOP." a={16} c={ACENTO} />
          <Flecha d="M1020,250 L1140,250 M1120,236 L1140,250 L1120,264" a={66} />
          <Caja x={1420} y={250} w={480} t="where am i going?" a={72} />
          <Flecha d="M1330,320 L940,494" a={120} />
          <Flecha d="M1440,320 L1400,534" a={186} />
          <Caja x={820} y={560} w={360} t="i know → go" a={126} c="#3f7a4a" />
          <Caja x={1360} y={600} w={600} t="ask the horse → put it down" a={192} c="#8a3a2a" />
        </Hoja>
      </svg>
      <Hud min={406} dia={5} />
    </AbsoluteFill>
  );
};
// 316-322 · «you will forget many times a day»: el contador de veces que se acuerda
const Olvida32: React.FC = () => {
  const f = useF();
  return (
    <CortoTenzo dur={180} z={2.1} tenzo={{ poses: alterna(HABLA_A, HABLA_B, 0, 180, 18), caras: [{ f: 0, v: "risa" }, { f: 50, v: "feliz" }], habla: [[0, 170]] }}
      hud={<><Hud min={406} dia={5} /><div style={{ position: "absolute", left: 120, top: 300 }}><Rayitas2 n={Math.floor(interpolate(f, [40, 170], [0, 12], cl))} /></div><ManoLeo texto="every time you remember" x={110} y={200} desde={60} tam={56} /></>} />
  );
};
const Rayitas2: React.FC<{ n: number }> = ({ n }) => (
  <svg width={700} height={160}><Rayitas n={n} x={10} y={40} color="#f4efe6" alto={70} paso={18} /></svg>
);
// 342-346,6 · «yo también anduve a caballo mucho tiempo»: Tenzo joven en el recuerdo
const TenzoJoven: React.FC = () => {
  const f = useF();
  const hx = 900 + f * 5;
  return (
    <AbsoluteFill style={{ background: "#2a2622" }}>
      <Recuerdo>
        <Escena Set={CaminoChina} pal={PAL_ANT} claves={[mira(0, 900 - 250, 560, 1.7), mira(138, 900 + 138 * 5 - 250, 560, 1.7)]}
          medio={<>
            <NubePolvo x={hx - 330} piso={CP + 40} k={0.5} f={f} />
            <Montado x={hx} piso={CP + 40} fase={(f % 14) / 14} look={TENZO_JOVEN} cara="enojo" escala={1.0} luz={L_ANT} />
          </>} />
      </Recuerdo>
      <ManoLeo texto="too long." x={1440} y={880} desde={70} tam={62} />
    </AbsoluteFill>
  );
};
const TENZO_JOVEN = { ...TENZO, piel: "#e2ad78" };
// 398,7-409,2 · gancho del día 8: la tarjeta del próximo y el farol que se apaga
const Gancho41: React.FC = () => {
  const f = useF();
  return (
    <AbsoluteFill>
      <TarjetaFinal proximo="Two Monks, a River and a Woman" frase="lust is not love · Day 8" />
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [250, 314], [0, 1], cl) }} />
    </AbsoluteFill>
  );
};

// ---------- el montaje ----------
const TRAMOS: TramoS[] = [
  { t0: 0, t1: 3.0, el: <Cuadro0 /> },
  { t0: 3.0, t1: 5.7, el: <AlbaTel /> },
  { t0: 5.7, t1: 10.0, el: <Alba1 /> },
  { t0: 10.0, t1: 13.1, el: <Cuenta4h /> },
  { t0: 13.1, t1: 15.8, el: <Cara2 /> },
  { t0: 15.8, t1: 21.1, el: <Dia5a />, trans: { tipo: "fundido", d: 12 } },
  { t0: 21.1, t1: 29.2, el: <Dia5 /> },
  { t0: 29.2, t1: 31.7, el: <Mara4 /> },
  { t0: 31.7, t1: 36.3, el: <Lavadero5 />, trans: { tipo: "barrido", lado: 1 } },
  { t0: 36.3, t1: 40.6, el: <Acostado6 />, trans: { tipo: "fundido", d: 10 } },
  { t0: 40.6, t1: 44.3, el: <Pulgar6 /> },
  { t0: 44.3, t1: 47.5, el: <Linea10 /> },
  { t0: 47.5, t1: 50.1, el: <Cuenta7 /> },
  { t0: 50.1, t1: 53.3, el: <Horas20k /> },
  { t0: 53.3, t1: 55.2, el: <Medicina7 /> },
  { t0: 55.2, t1: 60.4, el: <Golpe8 />, trans: { tipo: "fundido", d: 12 } },
  { t0: 60.4, t1: 64.5, el: <Pasillo9 /> },
  { t0: 64.5, t1: 69.3, el: <TenzoPuerta /> },
  { t0: 69.3, t1: 70.9, el: <Como10 /> },
  { t0: 70.9, t1: 76.3, el: <Fachada10b /> },
  { t0: 76.3, t1: 80.4, el: <TelPrendido /> },
  { t0: 80.4, t1: 83.4, el: <PasarCorto /> },
  { t0: 83.4, t1: 92.0, el: <Cuarto12 /> },
  { t0: 92.0, t1: 98.7, el: <Tibio13 /> },
  { t0: 98.7, t1: 100.7, el: <CortoLeo dur={60} leo={{ poses: [{ f: 0, v: SENT }], caras: [{ f: 0, v: "triste" }], habla: [[0, 56]] }} hud={<Hud min={390} dia={5} />} /> },
  { t0: 100.7, t1: 106.5, el: <Recuerdo14 />, trans: { tipo: "fundido", d: 10 } },
  { t0: 106.5, t1: 111.0, el: <CortoLeo dur={135} z={2.0} dx={60} leo={{ poses: [{ f: 0, v: SENT }, { f: 40, v: CABIZBAJO }], caras: [{ f: 0, v: "triste" }], habla: [[0, 50]] }} hud={<><Hud min={390} dia={5} /><ManoLeo texto={"always\nthe same."} x={1250} y={240} desde={50} /></>} />, trans: { tipo: "fundido", d: 8 } },
  { t0: 111.0, t1: 113.1, el: <CortoTenzo dur={63} tenzo={{ poses: [{ f: 0, v: LOTO }, { f: 6, v: { ...LOTO, cabeza: 16 } }, { f: 22, v: LOTO }, { f: 34, v: { ...LOTO, cabeza: 14 } }, { f: 50, v: LOTO }], caras: [{ f: 0, v: "feliz" }] }} hud={<Hud min={390} dia={5} />} /> },
  { t0: 113.1, t1: 118.7, el: <Farol15 /> },
  { t0: 118.7, t1: 128.0, el: <Camino16 />, trans: { tipo: "luz", d: 18 } },
  { t0: 128.0, t1: 138.1, el: <Galope17 /> },
  { t0: 138.1, t1: 144.3, el: <CaraRoja17 /> },
  { t0: 144.3, t1: 151.6, el: <Grito18 /> },
  { t0: 151.6, t1: 156.9, el: <Pregunta19 /> },
  { t0: 156.9, t1: 161.5, el: <CortoLeo dur={138} leo={{ poses: alterna(SENT, { ...SENT, tronco: -6, cabeza: -10 }, 0, 60, 8), caras: [{ f: 0, v: "feliz" }, { f: 6, v: "risa" }, { f: 66, v: "neutral" }, { f: 110, v: "triste" }] }} hud={<Hud min={390} dia={5} />} />, trans: { tipo: "luz", d: 16 } },
  { t0: 161.5, t1: 165.2, el: <CortoLeo dur={111} z={2.0} dx={60} leo={{ poses: [{ f: 0, v: { ...SENT, cabeza: 12 } }, { f: 70, v: { ...SENT, cabeza: 12, hD: 120, cD: 150 } }], caras: [{ f: 0, v: "triste" }], habla: [[0, 108]] }} hud={<><Hud min={390} dia={5} /><ManoLeo texto={"i'm the guy\non the horse."} x={1250} y={220} desde={69} /></>} /> },
  { t0: 165.2, t1: 170.1, el: <CortoTenzo dur={147} tenzo={{ poses: alterna(HABLA_A, HABLA_B, 0, 147, 18), caras: [{ f: 0, v: "feliz" }, { f: 70, v: "neutral" }], habla: [[0, 140]] }} hud={<Hud min={390} dia={5} />} /> },
  { t0: 170.1, t1: 174.5, el: <Habito21 />, trans: { tipo: "barrido", lado: -1 } },
  { t0: 174.5, t1: 181.4, el: <Habito21 o={132} z={1.8} y={560} asustado /> },
  { t0: 181.4, t1: 185.5, el: <CortoTenzo dur={123} tenzo={{ poses: [{ f: 0, v: LOTO }, { f: 30, v: TENZO_DEDO }], caras: [{ f: 0, v: "neutral" }, { f: 30, v: "feliz" }], habla: [[60, 120]] }} hud={<Hud min={390} dia={5} />} />, trans: { tipo: "barrido", lado: 1 } },
  { t0: 185.5, t1: 190.7, el: <Antes22 /> },
  { t0: 190.7, t1: 193.2, el: <StopNegro /> },
  { t0: 193.2, t1: 195.3, el: <CortoLeo dur={63} leo={{ poses: [{ f: 0, v: { ...SENT, hD: 90, cD: 30 } }], caras: [{ f: 0, v: "sorpresa" }, { f: 30, v: "duda" }], habla: [[0, 60]] }} hud={<Hud min={390} dia={5} />} /> },
  { t0: 195.3, t1: 200.2, el: <CortoTenzo dur={147} z={2.0} tenzo={{ poses: [{ f: 0, v: TENZO_DEDO }, { f: 40, v: HABLA_A }, { f: 80, v: ANCHO }, { f: 130, v: HABLA_B }], caras: [{ f: 0, v: "neutral" }, { f: 80, v: "sorpresa" }], habla: [[0, 140]] }} hud={<Hud min={390} dia={5} />} /> },
  { t0: 200.2, t1: 204.8, el: <CortoTenzo dur={138} tenzo={{ poses: [{ f: 0, v: HABLA_B }, { f: 40, v: TENZO_DEDO }, { f: 90, v: { ...LOTO, tronco: -8, cabeza: -10, hD: 40, cD: 90, hI: 40, cI: 90 } }], caras: [{ f: 0, v: "risa" }, { f: 40, v: "feliz" }, { f: 90, v: "neutral" }], habla: [[42, 88]] }} hud={<Hud min={390} dia={5} />} /> },
  { t0: 204.8, t1: 212.8, el: <Ve24 />, trans: { tipo: "fundido", d: 14 } },
  { t0: 212.8, t1: 221.9, el: <Aburrido25 />, trans: { tipo: "fundido", d: 14 } },
  { t0: 221.9, t1: 225.6, el: <CortoTenzo dur={111} tenzo={{ poses: [{ f: 0, v: HABLA_A }, { f: 63, v: { ...LOTO, hD: 100, cD: 10 } }], caras: [{ f: 0, v: "feliz" }], habla: [[0, 100]] }} hud={<Hud min={390} dia={5} />} /> },
  { t0: 225.6, t1: 229.3, el: <CortoLeo dur={111} leo={{ tel: true, poses: [{ f: 0, v: SENT_CEL }], caras: [{ f: 0, v: "duda" }, { f: 60, v: "sorpresa" }], habla: [[63, 108]] }} hud={<Hud min={390} dia={5} />} /> },
  { t0: 229.3, t1: 231.5, el: <CortoTenzo dur={66} tenzo={{ poses: [{ f: 0, v: HABLA_B }], caras: [{ f: 0, v: "feliz" }], habla: [[0, 60]] }} hud={<Hud min={390} dia={5} />} /> },
  { t0: 231.5, t1: 235.5, el: <CortoLeo dur={120} z={2.5} leo={{ tel: true, luz: L_TEL, poses: alterna(SENT_CEL, { ...SENT_CEL, cD: 138 }, 0, 120, 7), caras: [{ f: 0, v: "neutral" }, { f: 50, v: "cansado" }] }} hud={<Hud min={[{ f: 0, v: 390 }, { f: 110, v: 398, d: 60 }]} dia={5} estado="sube" />} /> },
  { t0: 235.5, t1: 245.7, el: <Scroll27 /> },
  { t0: 245.7, t1: 251.1, el: <Congela28 /> },
  { t0: 251.1, t1: 253.1, el: <CortoTenzo dur={60} tenzo={{ poses: [{ f: 0, v: HABLA_A }], caras: [{ f: 0, v: "feliz" }], habla: [[0, 56]] }} hud={<Hud min={406} dia={5} estado="congelado" />} /> },
  { t0: 253.1, t1: 256.7, el: <CortoLeo dur={108} leo={{ telI: true, tel: true, poses: [{ f: 0, v: { ...SENT_CEL, hD: 25, cD: 40 } }], caras: [{ f: 0, v: "neutral" }, { f: 50, v: "duda" }], habla: [[0, 42]], miradas: [{ f: 0, v: { x: -1, y: 0 } }, { f: 30, v: { x: 1, y: -0.4 } }, { f: 60, v: { x: -0.4, y: -1 } }, { f: 90, v: { x: 0.4, y: 0.6 } }] }} hud={<Hud min={406} dia={5} estado="congelado" />} /> },
  { t0: 256.7, t1: 267.2, el: <Cuerpo29 />, trans: { tipo: "fundido", d: 10 } },
  { t0: 267.2, t1: 274.6, el: <CortoTenzo dur={222} z={2.1} tenzo={{ poses: alterna(HABLA_A, HABLA_B, 0, 222, 22), caras: [{ f: 0, v: "feliz" }, { f: 150, v: "neutral" }], habla: [[0, 210]] }} hud={<Hud min={406} dia={5} estado="congelado" />} />, trans: { tipo: "fundido", d: 8 } },
  { t0: 274.6, t1: 278.8, el: <Otra30 /> },
  { t0: 278.8, t1: 280.6, el: <CortoLeo dur={54} z={2.5} leo={{ tel: true, poses: [{ f: 0, v: SENT_CEL }], caras: [{ f: 0, v: "determinado" }], habla: [[0, 20]] }} hud={<Hud min={406} dia={5} estado="congelado" />} /> },
  { t0: 280.6, t1: 284.8, el: <DaVuelta31 /> },
  { t0: 284.8, t1: 292.3, el: <Silencio31 /> },
  { t0: 292.3, t1: 300.7, el: <Sienta31 /> },
  { t0: 300.7, t1: 305.0, el: <CortoTenzo dur={129} tenzo={{ poses: alterna(HABLA_A, HABLA_B, 0, 129, 20), caras: [{ f: 0, v: "feliz" }], habla: [[0, 125]] }} hud={<Hud min={406} dia={5} />} /> },
  { t0: 305.0, t1: 316.0, el: <Diagrama32 />, trans: { tipo: "fundido", d: 10 } },
  { t0: 316.0, t1: 322.0, el: <Olvida32 />, trans: { tipo: "fundido", d: 10 } },
  { t0: 322.0, t1: 327.2, el: <Monjes33 />, trans: { tipo: "luz", d: 14 } },
  { t0: 327.2, t1: 331.8, el: <Parado34 />, trans: { tipo: "luz", d: 12 } },
  { t0: 331.8, t1: 335.2, el: <Porque35 /> },
  { t0: 335.2, t1: 342.0, el: <Cruza35 /> },
  { t0: 342.0, t1: 346.6, el: <TenzoJoven />, trans: { tipo: "fundido", d: 10 } },
  { t0: 346.6, t1: 350.4, el: <SeVa36 />, trans: { tipo: "fundido", d: 8 } },
  { t0: 350.4, t1: 364.4, el: <Rayas37 />, trans: { tipo: "fundido", d: 12 } },
  { t0: 364.4, t1: 376.4, el: <Parada38 />, trans: { tipo: "cortina", lado: 1 } },
  { t0: 376.4, t1: 384.5, el: <Maya38 /> },
  { t0: 384.5, t1: 388.2, el: <Sonrie39 /> },
  { t0: 388.2, t1: 392.5, el: <Relame40 /> },
  { t0: 392.5, t1: 398.7, el: <Cierre41 />, trans: { tipo: "fundido", d: 16 } },
  { t0: 398.7, t1: 409.2, el: <Gancho41 />, trans: { tipo: "fundido", d: 12 } },
];
export const TZ03_DUR = Math.round(409.2 * 30); // 12.276
const PLANOS = planosDe(TRAMOS);

export const Tz03: React.FC<{ audio?: boolean }> = ({ audio = true }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Montaje planos={PLANOS} />
    <MarcaTenzo />
    {audio && <Audio src={staticFile("tz03.wav")} />}
  </AbsoluteFill>
);
void T0;
