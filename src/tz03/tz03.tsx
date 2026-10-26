// tz03 · «He Scrolled for 10 Years. Then the Monk Said Stop.» (Tenzo Films, Day 5-7). Voz 409,2 s = 12.276 cuadros.
// Plan D:/rtmp/tz03_PLAN_MxM.md. Cada plano = la frase de ese segundo; tramos en SEGUNDOS ABSOLUTOS de la voz.
// Chicago frío (el farol de Tenzo es la única luz cálida) · la parábola del caballo, toda ámbar.
import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, staticFile } from "remotion";
import { Caballo } from "../tenzo/sets/caballo";
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
import { PortonMonasterio, JAPON_PISO, RIO, RioCrecido } from "../tenzo/sets/rioJapon";
import { FachadaWilson, PasilloWilson, WILSON, WILSON_PISO } from "../tenzo/sets/wilson";
import { Alba, ent, fr, Montado, NubePolvo, PantallaMacro, planosDe, POSE_JINETE, Rayitas, Hoja, Rendija, Tibio, TramoS } from "../tenzo/tzb/comun";

const P = CTO_PISO;
const LX = 1240; // Leo sentado en el colchón
const TX = 1660; // Tenzo sentado en el piso (LOTO)
const FX = 1470; // el farol apoyado en el piso, entre los dos
const MX = LX - 190; // Mara detrás del hombro de Leo
const AS = COLCHON_ALTO;
const LEO3 = { ...LEO, accesorios: (LEO.accesorios ?? []).filter((a: { t: string }) => a.t !== "auriculares") }; // sin el trazo blanco de los auriculares cruzando la cara

// luces
const L_TEL = { lado: 1 as const, color: ACENTO, fuerza: 0.55 };
const L_FRIO = { lado: 1 as const, color: FRIO, fuerza: 0.45 };
const L_ORO_D = { lado: 1 as const, color: ORO, fuerza: 0.7 }; // luz cálida que viene de la derecha (Leo mira al farol)
const L_ORO_I = { lado: -1 as const, color: ORO, fuerza: 0.9 }; // Tenzo, del lado del farol
const L_ANT = { lado: 1 as const, color: "#ffd890", fuerza: 0.8 };

// poses de Leo sentado en el colchón (rodillas arriba)
const SENT: Partial<Pose> = { tronco: -2, pI: 85, rI: 0, pD: 72, rD: 100, hD: 35, cD: 60, hI: 25, cI: 50 }; // sentado SOBRE el colchón (piernas adelante), no flotando
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
  return <Actor look={LEO3} escala={ESC} seed={1} luz={luz} ruta={[{ f: 0, x: LX, y: P }]} dir={dir} asiento={[{ f: 0, v: AS }]} poses={poses} caras={caras} habla={habla} miradas={miradas}
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
    <Escena Set={Broadway} pal={PAL} setProps={{ nieve: false }} claves={[mira(0, 2370, 540, 1.0), mira(90, 2440, 540, 1.06, { curva: "in" })]}
      medio={<>
        <NubePolvo x={hx + 420} piso={BWY_PISO + 130} k={0.6} f={f} color="#2a1a14" ancho={420} />
        <Montado x={hx} piso={BWY_PISO + 130} fase={(f % 14) / 14} dir={-1} s={1.8} variante="mara" look={LEO3} cara="miedo" escala={ESC * 1.5} luz={L_TEL}
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
        <Actor look={LEO3} escala={ESC} seed={1} luz={L_FRIO} ruta={[{ f: 0, x: WILSON.leo, y: W }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "sorpresa" }]} enManoD={<Tel />} poses={[{ f: 0, v: { hD: 20, cD: 60 } }]} />
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
      <Actor look={LEO3} escala={ESC} seed={1} luz={L_FRIO} ruta={[{ f: 0, x: WILSON.leo, y: WILSON_PISO }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "duda" }]} habla={[[0, 42]]} enManoD={<Tel />} poses={[{ f: 0, v: { hD: 20, cD: 60 } }]} />
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
        <Actor look={LEO3} escala={ESC} seed={1} luz={L_FRIO} ruta={[{ f: 0, x: WILSON.leo, y: W }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "duda" }]} enManoD={<Tel />} poses={[{ f: 0, v: { hD: 20, cD: 60 } }, { f: L(79), v: { hD: 10, cD: 30 } }]} />
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
        <Montado x={hx} piso={BWY_PISO + 30} fase={(f % 14) / 14} dir={-1} s={1.3} variante="mara" look={LEO3} cara={asustado ? (f % 50 < 25 ? "miedo" : "duda") : f < 160 ? "miedo" : "cansado"} escala={ESC} luz={L_TEL}
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
    <Escena Set={PortonMonasterio} pal={PAL_ANT} setProps={{ hora: 0.5 }} claves={[mira(0, 1600, 720, 1.3), mira(156, 1640, 720, 1.42)]}
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
      <Actor look={LEO3} escala={ESC} seed={1} luz={L_DIA} ruta={[{ f: 0, x: LEO_PARADA, y: BP }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 20, cD: -40, hI: -20, cI: -40 } }]} caras={leoCara} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} />
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
          <Actor look={LEO3} escala={ESC} seed={1} luz={{ lado: 1, color: ACENTO, fuerza: 0.9 }} ruta={[{ f: 0, x: LX, y: P }]} dir={[{ f: 0, v: 1 }]}
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
  const p = interpolate(f, [0, 80], [0.2, 1], cl);
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
          poses={[{ f: 0, v: FAROL }, ...alterna({ ...FAROL, hI: 80, cI: 120 }, { ...FAROL, hI: 70, cI: 100 }, 30, 90, 6)]} caras={[{ f: 0, v: "cansado" }, { f: 70, v: "feliz" }]}
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
          medio={<Actor look={LEO3} escala={ESC} seed={1} luz={L_TEL} ruta={[{ f: 0, x: LX, y: P }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: AS }]}
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

// ===================== VUELTA OJO 2 (26-oct): primeros planos, sobre el hombro, insertos y un recurso por imagen de la voz =====================
const LEO_CARA_Y = P - 203; // centro de la cara de Leo sentado en el colchón (medido en la planilla ojo_v1)
const TENZO_CARA_Y = P - 119; // centro de la cara de Tenzo en loto
// primer plano de Leo (la cara llena el cuadro; mira a la derecha, aire adelante)
const PPLeo: React.FC<{ leo: LeoP; hud?: React.ReactNode; z?: number; dur?: number; dx?: number; dy?: number; antes?: React.ReactNode; despues?: React.ReactNode }> = ({ leo, hud, z = 4.1, dur = 120, dx = 110, dy = 20, antes, despues }) => (
  <CuartoCalido claves={[mira(0, LX + dx, LEO_CARA_Y + dy, z), mira(dur, LX + dx, LEO_CARA_Y + dy, z + 0.18, { curva: "in" })]} hud={hud}>
    {antes}
    <LeoSentado tel={false} luz={L_ORO_D} {...leo} />
    {despues}
  </CuartoCalido>
);
const PPTenzo: React.FC<{ tenzo: TenzoP; hud?: React.ReactNode; z?: number; dur?: number; dx?: number; dy?: number; despues?: React.ReactNode }> = ({ tenzo, hud, z = 3.3, dur = 120, dx = -110, dy = 30, despues }) => (
  <CuartoCalido claves={[mira(0, TX + dx, TENZO_CARA_Y + dy, z), mira(dur, TX + dx, TENZO_CARA_Y + dy, z + 0.18, { curva: "in" })]} hud={hud}>
    <TenzoSentado {...tenzo} />
    {despues}
  </CuartoCalido>
);
// el hombro del otro en primer término (sobre el hombro): silueta oscura con borde de farol
const Hombro: React.FC<{ lado: "izq" | "der"; quien: "tenzo" | "leo" }> = ({ lado, quien }) => {
  const s = lado === "izq" ? 1 : -1;
  const cab = quien === "tenzo" ? "#5a4636" : "#16161b", cue = quien === "tenzo" ? "#8e8a82" : "#121216";
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <g transform={`translate(${lado === "izq" ? 0 : 1920},0) scale(${s},1)`}>
        <path d="M-60,1080 L-60,700 Q40,600 250,610 Q440,625 520,800 L560,1080 Z" fill={cue} />
        {quien === "leo" ? <path d="M40,640 Q20,330 220,300 Q420,290 430,520 Q440,640 380,690 Z" fill={cab} /> : <g><rect x={170} y={600} width={130} height={90} fill="#d9a274" /><ellipse cx={230} cy={460} rx={185} ry={200} fill="#e0aa7c" /><ellipse cx={405} cy={480} rx={30} ry={52} fill="#d9a274" /><path d="M60,520 Q230,600 410,520" stroke="#c99068" strokeWidth={6} fill="none" opacity={0.6} /><path d="M-60,700 Q120,640 230,700 Q340,640 540,700 L540,760 L-60,760 Z" fill="#8e8a82" /><path d="M150,700 L300,1080" stroke="#7a2f22" strokeWidth={26} /></g>}
        <path d={quien === "leo" ? "M420,470 Q440,600 380,690" : "M405,400 Q440,500 400,600"} stroke={ORO} strokeWidth={10} fill="none" opacity={0.55} strokeLinecap="round" />
        <path d="M500,760 Q530,850 545,1080" stroke={ORO} strokeWidth={8} fill="none" opacity={0.4} />
      </g>
    </svg>
  );
};
// Leo (colchón) por encima del hombro de Tenzo · Tenzo por encima del hombro de Leo
const SobreLeo: React.FC<{ leo: LeoP; hud?: React.ReactNode; dur?: number; z?: number; antes?: React.ReactNode }> = ({ leo, hud, dur = 120, z = 2.7, antes }) => (
  <CuartoCalido claves={[mira(0, LX + 150, LEO_CARA_Y + 70, z), mira(dur, LX + 140, LEO_CARA_Y + 70, z + 0.12, { curva: "in" })]} hud={<><Hombro lado="der" quien="tenzo" />{hud}</>}>
    {antes}
    <LeoSentado tel={false} luz={L_ORO_D} {...leo} />
  </CuartoCalido>
);
const SobreTenzo: React.FC<{ tenzo: TenzoP; hud?: React.ReactNode; dur?: number; z?: number }> = ({ tenzo, hud, dur = 120, z = 2.7 }) => (
  <CuartoCalido claves={[mira(0, TX - 150, TENZO_CARA_Y + 20, z), mira(dur, TX - 140, TENZO_CARA_Y + 20, z + 0.12, { curva: "in" })]} hud={<><Hombro lado="izq" quien="leo" />{hud}</>}>
    <TenzoSentado {...tenzo} />
  </CuartoCalido>
);
const svgP = { width: 1920, height: 1080, style: { position: "absolute" as const, left: 0, top: 0 } };
const SINGLE = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], cl);

// 0-3 · CUADRO 0 con el temporizador: «10:00» se rompe y pasa a «4:11»
const Cuadro0b: React.FC = () => {
  // (cámara corrida a la derecha: el cartel GREEN ya no queda mordido)
  const f = useF();
  const roto = f >= 46;
  const golpe = roto ? interpolate(f, [46, 54], [1.35, 1], cl) : 1;
  const tiembla = f >= 36 && f < 46 ? Math.sin(f * 2.4) * 6 : 0;
  return (
    <AbsoluteFill>
      <Escena Set={Broadway} pal={PAL} setProps={{ nieve: false }} claves={[mira(0, 2250, 520, 1.0), mira(90, 2330, 520, 1.06, { curva: "in" })]}
        medio={<>
          <NubePolvo x={2780 - f * 5 + 420} piso={BWY_PISO + 130} k={0.6} f={f} color="#2a1a14" ancho={420} />
          <Montado x={2780 - f * 5} piso={BWY_PISO + 130} fase={(f % 14) / 14} dir={-1} s={1.8} variante="mara" look={LEO3} cara="miedo" escala={ESC * 1.5} luz={L_TEL}
            pose={{ ...POSE_JINETE, hD: 60, cD: 125, cabeza: 18 }} enManoD={<Tel />} />
          <Halo x={2780 - f * 5 - 40} y={BWY_PISO - 300} r={700} color={ACENTO} fuerza={0.35} />
          <Actor look={TENZO} escala={ESC * 2.6} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: 1760, y: BWY_PISO + 170 }]} dir={[{ f: 0, v: 1 }]}
            poses={[{ f: 0, v: { hD: 105, cD: 75, hI: 14, cI: 18, cabeza: -6 } }, { f: 70, v: { hD: 105, cD: 75, hI: 14, cI: 18, cabeza: -6 } }, { f: 88, v: { hD: 60, cD: 40, hI: 14, cI: 18 } }]}
            caras={[{ f: 0, v: "risa" }]} enManoI={<FarolMano />} />
        </>}
        hud={<ManoMara texto="just 10 minutes" x={1120} y={260} desde={18} />} />
      <div style={{ position: "absolute", left: 1150 + tiembla, top: 50, fontFamily: F_HUD, fontWeight: 600, fontSize: 120, color: roto ? ACENTO : "#f4efe6", transform: `scale(${golpe})`, transformOrigin: "left center", letterSpacing: 4, textShadow: "0 4px 18px rgba(0,0,0,.6)" }}>
        {roto ? "4:11:00" : `0:${String(Math.max(0, 10 - Math.floor(f / 4))).padStart(2, "0")}:00`}
      </div>
    </AbsoluteFill>
  );
};
// 3-5,7 · las dos de la mañana: primer plano de la cara azul, el reloj de la mesa de luz
const RelojLuz: React.FC<{ txt: string; x: number; y: number }> = ({ txt, x, y }) => (
  <svg {...svgP}>
    <rect x={x} y={y} width={300} height={130} rx={18} fill="#0c0d11" stroke="#2a2d34" strokeWidth={6} />
    <text x={x + 150} y={y + 96} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={92} fill="#ff4a3d">{txt}</text>
    <text x={x + 268} y={y + 40} textAnchor="end" fontFamily={F_HUD} fontWeight={600} fontSize={22} fill="#ff4a3d">AM</text>
  </svg>
);
const AlbaTel2: React.FC = () => (
  <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX + 120, LEO_CARA_Y + 20, 3.9), mira(81, LX + 115, LEO_CARA_Y + 20, 4.1)]}
    detras={oscuro}
    medio={<><LeoSentado poses={alterna(SENT_CEL, { ...SENT_CEL, cD: 135 }, 0, 81, 8)} luz={{ lado: 1, color: ACENTO, fuerza: 0.85 }} /><Halo x={LX + 120} y={LEO_CARA_Y + 30} r={220} color="#7fb0ff" fuerza={0.25} /></>}
    hud={<RelojLuz txt="2:00" x={1480} y={820} />} />
);
// 10-13,1 · «four hours… and eleven minutes»: el contador corre sobre la cara de ojos rojos
const Cuenta4h2: React.FC = () => {
  const f = useF();
  const m = Math.round(interpolate(f, [0, 33, 72], [0, 240, 251], cl));
  const punch = interpolate(f, [72, 80], [1.3, 1], cl);
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX + 180, LEO_CARA_Y + 30, 3.0), mira(93, LX + 170, LEO_CARA_Y + 30, 3.2, { curva: "in" })]}
      detras={<Alba t={1} />}
      medio={<><LeoSentado poses={[...alterna(SENT_CEL, { ...SENT_CEL, cD: 138, cabeza: 26 }, 0, 70, 7), { f: 72, v: { ...SENT_CEL, cabeza: 8 } }]} caras={[{ f: 0, v: "cansado" }, { f: 74, v: "sorpresa" }]} /><Halo x={LX + 20} y={LEO_CARA_Y - 10} r={90} color="#ff3a2a" fuerza={0.3} /></>}
      hud={<>
        <svg {...svgP}><Halo x={1380} y={520} r={420} color={ACENTO} fuerza={0.22} /></svg>
        <div style={{ position: "absolute", left: 1040, top: 330, width: 760, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 230, color: f >= 72 ? ACENTO : "#f4efe6", transform: `scale(${punch})`, textShadow: "0 6px 24px rgba(0,0,0,.6)" }}>{`${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`}</div>
        <div style={{ position: "absolute", left: 1040, top: 610, width: 760, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 44, letterSpacing: 8, color: "#c9c2b4" }}>HOURS · MINUTES</div>
      </>} />
  );
};
// 13,1-15,8 · «could not remember a single thing»: la burbuja se vacía hasta el «?»
const Burbuja: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => {
  const cs = ["#e46a5a", "#5aa0e4", "#e4c25a", "#7ad08a", "#c27ae4", "#e48ac2"];
  return (
    <svg {...svgP}>
      <circle cx={x - 330} cy={y + 300} r={22} fill="#f4efe6" /><circle cx={x - 270} cy={y + 230} r={34} fill="#f4efe6" />
      <ellipse cx={x} cy={y} rx={330} ry={210} fill="#f4efe6" />
      {cs.map((c, i) => {
        const o = 1 - SINGLE(f, 14 + i * 9, 22 + i * 9);
        const cx = x - 210 + (i % 3) * 140, cy = y - 80 + Math.floor(i / 3) * 130;
        return <g key={i} opacity={o}><rect x={cx - 55} y={cy - 45} width={110} height={90} rx={10} fill={c} /><path d={`M${cx - 12},${cy - 18} L${cx + 18},${cy} L${cx - 12},${cy + 18} Z`} fill="#fff" opacity={0.85} /></g>;
      })}
      <text x={x} y={y + 70} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={220} fill="#2a2622" opacity={SINGLE(f, 66, 74)}>?</text>
    </svg>
  );
};
const Cara2b: React.FC = () => {
  const f = useF();
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX - 60, LEO_CARA_Y + 60, 2.6), mira(81, LX - 60, LEO_CARA_Y + 60, 2.75)]}
      detras={<Alba t={1} />}
      medio={<LeoSentado tel={false} poses={[{ f: 0, v: { ...SENT, cabeza: -10 } }, { f: 50, v: { ...SENT, cabeza: -10, hD: 30, cD: 150 } }]} caras={[{ f: 0, v: "cansado" }, { f: 40, v: "duda" }]} miradas={[{ f: 0, v: { x: 0.6, y: -0.8 } }]} luz={L_FRIO} />}
      hud={<><RelojDia min={371} x={1580} y={60} /><Burbuja x={1360} y={330} f={f} /></>} />
  );
};
// 15,8-21,1 · DAY 5: el HUD y el celular suben juntos 4h11 → 6h30
const Dia5a2: React.FC = () => (
  <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX + 330, 650, 2.0), mira(159, LX + 320, 640, 2.1)]}
    detras={oscuro}
    medio={<LeoSentado poses={alterna(SENT_CEL, { ...SENT_CEL, cD: 138 }, 0, 159, 9)} />}
    hud={<>
      <Hud min={[{ f: 0, v: 251 }, { f: 78, v: 390, d: 40 }]} dia={5} estado="sube" />
      <TelGrande modo="screentime" min={251} minHasta={390} x={1460} y={560} s={0.62} desde={-10} />
    </>} />
);
// 21,1-25,8 · la sombra crece en vivo detrás del hombro; Leo se achica
const Dia5b: React.FC = () => {
  const T = 21.1, f = useF(), L = (t: number) => fr(t, T);
  const k = interpolate(f, [0, L(25.6)], [1.0, 1.7], cl);
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX - 100, 640, 1.5), mira(L(25.8), LX - 120, 560, 1.15)]}
      detras={<>{oscuro}<Halo x={MX} y={P - 400 * k} r={500 * k} color={ACENTO} fuerza={0.18} /></>}
      medio={<>
        <MaraTras esc={k} cara={[{ f: 0, v: "picaro" }]} pose={{ hD: 70, cD: 40, hI: 60, cI: 50, cabeza: 18 }} />
        <LeoSentado poses={[{ f: 0, v: SENT_CEL }, { f: L(23), v: { ...CABIZBAJO, hD: 40, cD: 130 } }]} caras={[{ f: 0, v: "cansado" }, { f: L(23), v: "triste" }]} />
      </>}
      hud={<Hud min={390} dia={5} estado={(ff) => (Math.floor(ff / 12) % 2 ? "sube" : "normal")} />} />
  );
};
// 25,8-29,2 · contrapicado de la sonrisa: ya ni susurra
const Sonrisa5: React.FC = () => {
  const T = 25.8, L = (t: number) => fr(t, T);
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, MX + 40, P - 560, 2.0), mira(L(29.2), MX + 40, P - 560, 2.3, { curva: "in" })]}
      detras={oscuro}
      medio={<>
        <MaraTras esc={1.7} cara={[{ f: 0, v: "neutral" }, { f: L(28.3), v: "risa" }]} pose={{ hD: 70, cD: 40, hI: 60, cI: 50, cabeza: 18 }} />
        <LeoSentado poses={[{ f: 0, v: { ...CABIZBAJO, hD: 40, cD: 130 } }]} caras={[{ f: 0, v: "triste" }]} />
      </>}
      hud={<><Hud min={390} dia={5} estado="sube" /><ManoMara texto="..." x={1300} y={300} desde={L(26)} hasta={L(28.2)} /></>} />
  );
};
// 31,7-36,3 · el lavadero sin Leo: Tenzo mira el reloj, después la puerta; la silla vacía
const Lavadero5b: React.FC = () => {
  const T = 31.7, f = useF(), L = (t: number) => fr(t, T);
  const LP = LAV_PISO;
  const noche = f < L(33.6) ? 1 : 2;
  return (
    <Escena Set={Lavadero} pal={PAL} setProps={{ girando: [3, 12], nieve: true }} claves={[mira(0, (LAV_PUNTOS.tenzo + LAV_PUNTOS.leo) / 2, 640, 1.3), mira(L(36.3), (LAV_PUNTOS.tenzo + LAV_PUNTOS.leo) / 2 + 40, 650, 1.45)]}
      medio={<>
        <Toalla x={LAV_PUNTOS.mesa} y={LP - 150} doblez={ent(f, 10, L(34))} />
        <Actor look={TENZO} escala={ESC} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: LAV_PUNTOS.tenzo, y: LP }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: { hD: 60, cD: 70, hI: 55, cI: 75, tronco: 8 } }, { f: L(32.6), v: { hD: 10, cD: 20, hI: 10, cI: 20, cabeza: -14 } }, { f: L(34.3), v: { hD: 10, cD: 20, hI: 10, cI: 20, cabeza: 6 } }]}
          miradas={[{ f: 0, v: { x: -0.3, y: 0.6 } }, { f: L(32.6), v: { x: 0.2, y: -1 } }, { f: L(33.8), v: { x: -1, y: 0 } }]}
          caras={[{ f: 0, v: "neutral" }, { f: L(34.3), v: "triste" }]} />
      </>}
      hud={<>
        <Hud min={390} dia={5} />
        <div style={{ position: "absolute", left: 120, top: 150, fontFamily: F_HUD, fontWeight: 600, fontSize: 64, letterSpacing: 6, color: "#f4efe6", textShadow: "0 3px 12px rgba(0,0,0,.6)" }}>NIGHT {noche}</div>
        <ManoLeo texto="his chair. empty." x={140} y={880} desde={L(34.4)} tam={58} />
      </>} />
  );
};
// 36,3-40,6 · en la cama a oscuras, tapado, la pantalla a cinco centímetros de la cara
const PIERNAS_CAMA: Partial<Pose> = { pI: 85, rI: 0, pD: 85, rD: 0 };
const Acostado6b: React.FC = () => {
  const f = useF();
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX + 60, LEO_CARA_Y + 60, 3.0), mira(129, LX + 70, LEO_CARA_Y + 60, 3.3)]}
      detras={<rect x={-900} y={-700} width={5200} height={2000} fill="#02030a" opacity={0.78} />}
      medio={<>
        <rect x={LX - 170} y={P - AS - 230} width={110} height={190} rx={40} fill="#5a6070" transform={`rotate(-14 ${LX - 115} ${P - AS - 135})`} />
        <Actor look={LEO3} escala={ESC} seed={1} luz={{ lado: 1, color: ACENTO, fuerza: 0.95 }} ruta={[{ f: 0, x: LX, y: P }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: AS }]}
          poses={alterna({ ...PIERNAS_CAMA, tronco: -26, cabeza: 6, hD: 100, cD: 150, hI: 20, cI: 40 }, { ...PIERNAS_CAMA, tronco: -26, cabeza: 6, hD: 100, cD: 156, hI: 20, cI: 40 }, 0, 129, 7)}
          caras={[{ f: 0, v: "cansado" }]} enManoD={<Tel />} />
        <path d={`M${LX - 40},${P - AS - 40} Q${LX + 120},${P - AS - 120} ${LX + 420},${P - AS - 60} L${LX + 460},${P - AS + 10} L${LX - 60},${P - AS + 10} Z`} fill="#3a4152" />
        <path d={`M${LX - 20},${P - AS - 50} Q${LX + 140},${P - AS - 128} ${LX + 400},${P - AS - 70}`} stroke="#4d566a" strokeWidth={8} fill="none" />
        <Halo x={LX + 100} y={LEO_CARA_Y + 10} r={200 + 10 * Math.sin(f / 5)} color="#7fb0ff" fuerza={0.4} />
      </>}
      hud={<Hud min={390} dia={5} estado="sube" />} />
  );
};
// 40,6-44,3 · el pulgar con hilos: lo mueve otro (la sombra, arriba, de titiritero)
const Titere: React.FC = () => {
  const f = useF();
  const a = Math.sin(f / 4) * 14; // el palo de la cruceta se balancea
  const pul = 20 + Math.sin(f / 4 - 0.6) * 22; // el pulgar sube y baja con el hilo
  const px = 1080, py = 700; // base del pulgar
  const tip = { x: px + Math.cos(((-90 + pul) * Math.PI) / 180) * 170, y: py + Math.sin(((-90 + pul) * Math.PI) / 180) * 170 };
  return (
    <AbsoluteFill style={{ background: "#07070b" }}>
      <svg {...svgP}>
        <Halo x={960} y={640} r={600} color="#7fb0ff" fuerza={0.22} />
        {/* el celular y la mano */}
        <g transform="rotate(-8 900 760)">
          <rect x={650} y={430} width={420} height={760} rx={50} fill="#15171c" stroke="#5a5f68" strokeWidth={8} />
          <rect x={680} y={470} width={360} height={680} rx={24} fill="#3b6fb6" />
          {[0, 1, 2].map((k) => <rect key={k} x={710} y={500 + ((k * 230 + f * 9) % 690)} width={300} height={190} rx={14} fill={["#e46a5a", "#e4c25a", "#7ad08a"][k]} opacity={0.85} />)}
          <path d="M600,1080 Q560,860 650,800 L1080,780 Q1180,820 1170,1080 Z" fill="#ecc9a3" />
        </g>
        <path d={`M${px - 30},${py + 40} L${tip.x},${tip.y}`} stroke="#ecc9a3" strokeWidth={84} strokeLinecap="round" />
        <path d={`M${px - 30},${py + 40} L${tip.x},${tip.y}`} stroke="#c9a582" strokeWidth={6} strokeLinecap="round" opacity={0.5} />
        {/* la cruceta y la mano de la sombra */}
        <g transform={`rotate(${a} 1180 150)`}>
          <rect x={980} y={140} width={400} height={22} rx={10} fill="#1a1420" stroke={ACENTO} strokeWidth={4} />
          <path d="M1120,40 Q1180,-20 1260,40 L1300,150 L1100,150 Z" fill="#100c14" stroke={ACENTO} strokeWidth={5} />
        </g>
        {[[-120, 0], [0, 0], [130, 0]].map(([dx], i) => {
          const sx = 1180 + dx * Math.cos((a * Math.PI) / 180), sy = 150 + dx * Math.sin((a * Math.PI) / 180);
          const tx = i === 1 ? tip.x : tip.x + dx * 0.2, ty = i === 1 ? tip.y : tip.y + 40;
          return <path key={i} d={`M${sx},${sy} L${tx},${ty}`} stroke="#f4efe6" strokeWidth={2.5} opacity={0.8} />;
        })}
      </svg>
      <ManoLeo texto="like it belongs to somebody else." x={110} y={250} desde={56} tam={58} />
      <Hud min={390} dia={5} estado="sube" />
    </AbsoluteFill>
  );
};
// 44,3-47,5 · la línea 14 → 24 con un Leo que crece en cada celular
const MiniLeo: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-30,0 L-26,-70 Q0,-84 26,-70 L30,0 Z" fill="#24242a" />
    <circle cx={0} cy={-110} r={38} fill="#ecc9a3" />
    <path d="M-40,-112 Q-36,-160 0,-160 Q36,-160 40,-112 L30,-130 L20,-118 L6,-140 L-8,-120 L-22,-136 Z" fill="#16141a" />
    <rect x={14} y={-60} width={20} height={34} rx={4} fill="#15171c" stroke={ACENTO} strokeWidth={3} />
  </g>
);
const Linea10b: React.FC = () => {
  const f = useF();
  const p = interpolate(f, [6, 80], [0, 1], cl);
  const X0 = 300, X1 = 1620, Y = 700;
  const edad = Math.round(14 + 10 * p);
  return (
    <AbsoluteFill style={{ background: "#0d0f14" }}>
      <svg {...svgP}>
        <rect x={X0} y={Y - 6} width={X1 - X0} height={12} rx={6} fill="#2b2f37" />
        <rect x={X0} y={Y - 6} width={(X1 - X0) * p} height={12} rx={6} fill={ACENTO} />
        {[0, 2, 4, 6, 8, 10].map((k, i) => {
          const x = X0 + ((X1 - X0) * k) / 10;
          const s = k <= 2 ? 1 : interpolate(f, [k * 7.4 - 14, k * 7.4 - 6], [0, 1], cl);
          return <g key={k}>
            <rect x={x - 3} y={Y + 14} width={6} height={26} fill={p >= k / 10 ? ACENTO : "#4a4f58"} />
            <text x={x} y={Y + 84} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={40} fill={p >= k / 10 ? "#f4efe6" : "#6a6f78"}>{14 + k}</text>
            {s > 0 && <MiniLeo x={x} y={Y - 20} s={(0.9 + i * 0.16) * s} />}
          </g>;
        })}
        <text x={960} y={250} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={92} fill="#f4efe6" opacity={1}>10 YEARS</text>
        <text x={1640} y={410} textAnchor="end" fontFamily={F_HUD} fontWeight={600} fontSize={64} fill={ACENTO} opacity={SINGLE(f, 30, 40)}>AGE {edad}</text>
      </svg>
      <Hud min={390} dia={5} />
    </AbsoluteFill>
  );
};
// 47,5-50,1 · hace la cuenta acostado: los números se escriben en el techo
const Cuenta7b: React.FC = () => (
  <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX + 260, LEO_CARA_Y - 40, 2.2), mira(78, LX + 260, LEO_CARA_Y - 40, 2.35)]}
    detras={oscuro}
    medio={<LeoSentado tel={false} luz={L_FRIO} poses={[{ f: 0, v: { ...SENT, tronco: -20, cabeza: -24, hD: 120, cD: 140 } }, { f: 20, v: { ...SENT, tronco: -20, cabeza: -24, hD: 130, cD: 120 } }, { f: 40, v: { ...SENT, tronco: -20, cabeza: -24, hD: 120, cD: 140 } }]} caras={[{ f: 0, v: "duda" }, { f: 60, v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 0.5, y: -1 } }]} />}
    hud={<>
      <Hud min={390} dia={5} />
      <ManoLeo texto="6 h" x={820} y={180} desde={4} tam={110} />
      <ManoLeo texto="× 365" x={1060} y={300} desde={22} tam={110} />
      <ManoLeo texto="× 10" x={1330} y={420} desde={40} tam={110} />
      <ManoLeo texto="= ?" x={1500} y={560} desde={60} tam={110} />
    </>} />
);
// 50,1-53,3 · 20.000 horas: cada rayita del fondo es una noche
const Horas20kb: React.FC = () => {
  const f = useF();
  return (
    <AbsoluteFill style={{ background: "#0d0f14" }}>
      <svg {...svgP}>
        <Halo x={960} y={560} r={700} color={ACENTO} fuerza={0.2} />
        <Rayitas n={interpolate(f, [0, 60], [0, 300], cl)} x={140} y={620} color="#3b3f48" alto={40} paso={11} porFila={150} />
      </svg>
      <GranNumero rotulo="HOURS ON A SCREEN" claves={[{ f: 0, v: 0 }, { f: 6, v: 20000, d: 56 }]} y={250} color={ACENTO} tam={230} />
      <Hud min={390} dia={5} />
    </AbsoluteFill>
  );
};
// 53,3-55,2 · la balanza: el título de médico contra el pulgar
const Medicina7b: React.FC = () => {
  const f = useF();
  const ang = interpolate(f, [8, 34], [0, 14], { ...cl, easing: Easing.out(Easing.back(2)) });
  const cx = 960, cy = 380, L2 = 520;
  const pl = { x: cx - L2 * Math.cos((ang * Math.PI) / 180), y: cy - L2 * Math.sin((ang * Math.PI) / 180) };
  const pr = { x: cx + L2 * Math.cos((ang * Math.PI) / 180), y: cy + L2 * Math.sin((ang * Math.PI) / 180) };
  const Plato: React.FC<{ x: number; y: number; children: React.ReactNode; t: string; n: string; c: string }> = ({ x, y, children, t, n, c }) => (
    <g>
      <path d={`M${x},${y} L${x - 150},${y + 230} M${x},${y} L${x + 150},${y + 230}`} stroke="#9aa0aa" strokeWidth={4} />
      <path d={`M${x - 190},${y + 230} Q${x},${y + 320} ${x + 190},${y + 230} Z`} fill="#3a3f48" />
      <g transform={`translate(${x},${y + 200})`}>{children}</g>
      <text x={x} y={y + 380} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#e9e3d6">{t}</text>
      <text x={x} y={y + 440} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={52} fill={c}>{n}</text>
    </g>
  );
  return (
    <AbsoluteFill style={{ background: "#0d0f14" }}>
      <svg {...svgP}>
        <path d={`M${cx},${cy} L${cx},${cy + 560}`} stroke="#6a6f78" strokeWidth={14} /><rect x={cx - 160} y={cy + 560} width={320} height={22} rx={8} fill="#6a6f78" />
        <path d={`M${pl.x},${pl.y} L${pr.x},${pr.y}`} stroke="#c9c2b4" strokeWidth={14} strokeLinecap="round" /><circle cx={cx} cy={cy} r={20} fill={ACENTO} />
        <Plato x={pl.x} y={pl.y} t="BECOMING A DOCTOR" n="~15,000 h" c="#8fb4e8">
          <rect x={-70} y={-60} width={140} height={90} rx={6} fill="#f4efe6" /><circle cx={40} cy={10} r={16} fill="#c23a3a" />
          <path d="M-90,-20 Q-120,40 -60,50 Q-10,60 -20,10" stroke="#5a8ad0" strokeWidth={8} fill="none" />
        </Plato>
        <Plato x={pr.x} y={pr.y} t="LEO'S THUMB" n="20,000 h" c={ACENTO}>
          <rect x={-45} y={-90} width={90} height={150} rx={14} fill="#15171c" stroke={ACENTO} strokeWidth={5} />
        </Plato>
      </svg>
      <Hud min={390} dia={5} />
    </AbsoluteFill>
  );
};
// 55,2-58,9 · 3 a.m., la rendija de luz; «knock knock» hace temblar la puerta
const Golpe8b: React.FC = () => {
  const T = 55.2, f = useF(), L = (t: number) => fr(t, T);
  const tiembla = f >= L(58.9) && f < L(59.9) ? Math.sin(f * 3) * 6 : 0;
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, 700, 620, 1.25), mira(L(58.9), CTO_PUNTOS.puerta + 260, 580, 1.6, { curva: "in" })]}
      detras={<>{oscuro}<Rendija x={CTO_PUNTOS.puerta} piso={P} k={ent(f, L(57), L(58.6))} /></>}
      medio={<><g transform={`translate(${tiembla},0)`}><Golpes x={CTO_PUNTOS.puerta} y={P - 330} f0={L(58.9)} /></g><LeoSentado caras={[{ f: 0, v: "cansado" }]} /></>}
      hud={<>
        <Hud min={390} dia={5} />
        <RelojLuz txt="3:00" x={1480} y={820} />
        <ManoLeo texto="knock" x={330 + tiembla} y={300} desde={L(58.9)} tam={90} />
        <ManoLeo texto="knock." x={420 - tiembla} y={420} desde={L(59.3)} tam={90} />
      </>} />
  );
};
// 58,9-60,4 · primer plano: Leo levanta la cabeza, asustado, y gira a la puerta
const Susto8: React.FC = () => (
  <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX - 60, LEO_CARA_Y + 40, 3.4), mira(45, LX - 60, LEO_CARA_Y + 30, 3.6)]}
    detras={oscuro}
    medio={<LeoSentado poses={[{ f: 0, v: SENT_CEL }, { f: 6, v: { ...SENT_CEL, cabeza: -12, tronco: -6 } }]} dir={[{ f: 0, v: 1 }, { f: 26, v: -1 }]} caras={[{ f: 0, v: "cansado" }, { f: 6, v: "miedo" }]} />}
    hud={<Hud min={390} dia={5} />} />
);
// 60,4-64,5 · la puerta se abre: el pasillo vacío y una luz cálida que se acerca (Tenzo todavía no)
const Pasillo9b: React.FC = () => {
  const T = 60.4, f = useF(), L = (t: number) => fr(t, T);
  const W = WILSON_PISO;
  return (
    <Escena Set={PasilloWilson} pal={PAL} setProps={{ apertura: ent(f, 4, 44) }}
      claves={[mira(0, WILSON.leo + 40, 590, 1.35), mira(L(64.5), WILSON.leo + 160, 600, 1.5)]}
      medio={<>
        <Actor look={LEO3} escala={ESC} seed={1} luz={L_FRIO} ruta={[{ f: 0, x: WILSON.leo, y: W }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "sorpresa" }, { f: 50, v: "duda" }]} enManoD={<Tel />} poses={[{ f: 0, v: { hD: 20, cD: 60 } }, { f: 20, v: { hD: 70, cD: 20 } }, { f: 50, v: { hD: 20, cD: 60 } }]} />
        <Halo x={WILSON.tenzo + 260 - 140 * ent(f, 30, L(64.5))} y={W - 200} r={260 + 300 * ent(f, 20, L(64.5))} color={ORO} fuerza={0.45} />
      </>}
      hud={<Hud min={390} dia={5} />} />
  );
};
// 64,5-69,3 · de abajo hacia arriba: el farol en la mano, la nieve en los hombros… y en «is Tenzo», la cara
const TenzoPuerta2: React.FC = () => {
  const T = 64.5, f = useF(), L = (t: number) => fr(t, T);
  const W = WILSON_PISO;
  const luz = 0.5 + 0.5 * ent(f, L(66.8), L(67.4));
  return (
    <Escena Set={PasilloWilson} pal={PAL} setProps={{ apertura: 1 }} claves={[mira(0, WILSON.tenzo + 60, W - 120, 3.0), mira(L(65.6), WILSON.tenzo + 20, W - 230, 2.8), mira(L(66.8), WILSON.tenzo + 10, W - 230, 2.7), mira(L(67.6), WILSON.tenzo - 10, W - 300, 2.6), mira(L(69.3), WILSON.tenzo - 10, W - 300, 2.7)]}
      medio={<>
        <Actor look={TENZO} escala={ESC} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: WILSON.tenzo, y: W }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: FAROL }, { f: L(67.4), v: { ...FAROL, hD: 60, cD: 30 } }]} caras={[{ f: 0, v: "neutral" }, { f: L(67.2), v: "feliz" }]} enManoD={<FarolMano luz={luz} />} />
        <NieveHombros x={WILSON.tenzo} y={W - 228} />
        <Halo x={WILSON.tenzo - 50} y={W - 160} r={600} color={ORO} fuerza={0.25 + 0.25 * luz} />
      </>}
      hud={<Hud min={390} dia={5} />} />
  );
};
// 69,3-70,9 · «How did you find me?» (el manuscrito en la pared libre)
const Como10b: React.FC = () => (
  <Escena Set={PasilloWilson} pal={PAL} setProps={{ apertura: 1 }} claves={[mira(0, WILSON.leo + 120, WILSON_PISO - 280, 2.3), mira(48, WILSON.leo + 120, WILSON_PISO - 285, 2.4)]}
    medio={<>
      <Actor look={LEO3} escala={ESC} seed={1} luz={L_FRIO} ruta={[{ f: 0, x: WILSON.leo, y: WILSON_PISO }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "duda" }]} habla={[[0, 42]]} enManoD={<Tel />} poses={[{ f: 0, v: { hD: 20, cD: 60 } }]} />
      <Halo x={WILSON.tenzo} y={WILSON_PISO - 200} r={500} color={ORO} fuerza={0.3} />
    </>}
    hud={<><Hud min={390} dia={5} /><ManoLeo texto="how did you find me?" x={1100} y={200} desde={4} /></>} />
);
// 70,9-76,3 · la única ventana azul: Tenzo la señala y la cámara sube hasta ella
const Fachada10c: React.FC = () => {
  const T = 70.9, L = (t: number) => fr(t, T);
  const VX = 1905, VY = 465;
  return (
    <Escena Set={FachadaWilson} pal={PAL} claves={[mira(0, 1500, 640, 1.0), mira(L(73.4), 1600, 600, 1.05), mira(L(76.3), VX, VY + 40, 2.2, { curva: "in" })]}
      medio={<>
        <Actor look={TENZO} escala={ESC} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: 1200, y: WILSON_PISO }, { f: L(72.6), x: 1560, y: WILSON_PISO }]}
          poses={[{ f: 0, v: FAROL }, { f: L(73.4), v: { ...FAROL, hI: 150, cI: 10, cabeza: -14 } }]} caras={[{ f: 0, v: "neutral" }, { f: L(73.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: L(72.8), v: { x: 0.5, y: -1 } }]} enManoD={<FarolMano />} />
      </>}
      hud={<><Hud min={390} dia={5} /><ManoLeo texto="one blue window." x={120} y={250} desde={L(74.2)} tam={62} /></>} />
  );
};
// 76,3-78,7 · Tenzo baja la vista al celular (la luz azul le pega desde abajo)
const MiraTel11: React.FC = () => {
  const W = WILSON_PISO;
  return (
    <Escena Set={PasilloWilson} pal={PAL} setProps={{ apertura: 1 }} claves={[mira(0, WILSON.tenzo - 60, W - 290, 3.1), mira(72, WILSON.tenzo - 60, W - 290, 3.25)]}
      medio={<>
        <Actor look={TENZO} escala={ESC} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: WILSON.tenzo, y: W }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { ...FAROL, cabeza: 14 } }]}
          caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: { x: -0.6, y: 0.9 } }]} enManoD={<FarolMano />} />
        <NieveHombros x={WILSON.tenzo} y={W - 228} />
        <Halo x={WILSON.tenzo - 140} y={W - 200} r={260} color="#7fb0ff" fuerza={0.35} />
      </>}
      hud={<Hud min={390} dia={5} />} />
  );
};
// 78,7-80,4 · el celular, todavía prendido (entra encendido, sin negro)
const TelPrendido2: React.FC = () => (
  <AbsoluteFill style={{ background: "#1b1a1e" }}>
    <svg {...svgP}><Halo x={200} y={300} r={700} color={ORO} fuerza={0.35} /><Halo x={1060} y={600} r={500} color="#7fb0ff" fuerza={0.25} /></svg>
    <TelGrande modo="feed" vel={5} x={1060} y={600} s={0.92} desde={-30} inclina={-8} pulgar />
    <Hud min={390} dia={5} />
  </AbsoluteFill>
);
// 80,4-83,4 · «May I come in? It is cold and I am old»: tirita, se frota las manos, le sale vaho
const Vaho: React.FC<{ x: number; y: number; f0: number }> = ({ x, y, f0 }) => {
  const f = useF();
  return <g>{[0, 26, 52].map((d, i) => { const t = f - f0 - d; if (t < 0 || t > 30) return null; return <circle key={i} cx={x - t * 3} cy={y - t * 1.6} r={10 + t * 1.3} fill="#eef2f6" opacity={0.8 * (1 - t / 30)} />; })}</g>;
};
const PasarCorto2: React.FC = () => {
  const W = WILSON_PISO;
  return (
    <Escena Set={PasilloWilson} pal={PAL} setProps={{ apertura: 1 }} claves={[mira(0, WILSON.tenzo - 10, W - 260, 2.5), mira(90, WILSON.tenzo - 10, W - 260, 2.65)]}
      medio={<>
        <Actor look={TENZO} escala={ESC} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: WILSON.tenzo, y: W }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: FAROL }, ...alterna({ ...FAROL, hI: 80, cI: 120, tronco: 4 }, { ...FAROL, hI: 70, cI: 100, tronco: -2 }, 30, 90, 4)]} caras={[{ f: 0, v: "feliz" }, { f: 32, v: "cansado" }, { f: 70, v: "feliz" }]}
          habla={[[0, 26], [32, 86]]} enManoD={<FarolMano />} />
        <NieveHombros x={WILSON.tenzo} y={W - 228} />
        <Vaho x={WILSON.tenzo - 60} y={W - 280} f0={6} />
      </>}
      hud={<Hud min={390} dia={5} />} />
  );
};
// 83,4-92 · el inventario: la cámara se para en cada cosa con su palabra
const Cuarto12b: React.FC = () => {
  const T = 83.4, f = useF(), L = (t: number) => fr(t, T);
  return (
    <Escena Set={Cuarto} pal={PAL} setProps={{ luzPuerta: 1 }}
      claves={[mira(0, 1200, 600, 0.95), mira(L(84.9), 1200, 600, 1.0), mira(L(85.4), CTO_PUNTOS.colchon, 800, 1.8), mira(L(86.3), CTO_PUNTOS.colchon, 800, 1.85), mira(L(86.7), CTO_PUNTOS.cajas, 790, 1.9), mira(L(87.7), CTO_PUNTOS.cajas, 790, 1.95), mira(L(88.1), CTO_PUNTOS.bolso, 780, 1.9), mira(L(89.0), CTO_PUNTOS.bolso, 780, 1.95), mira(L(89.5), CTO_PUNTOS.dibujos, 560, 1.5), mira(L(92), CTO_PUNTOS.dibujos, 560, 1.6)]}
      detras={<>{oscuro}<Tibio k={0.45} x={200} y={P - 120} /></>}
      medio={<LeoSentado caras={[{ f: 0, v: "triste" }]} />}
      hud={<>
        <Hud min={390} dia={5} />
        <ManoLeo texto="a mattress." x={140} y={250} desde={L(85.1)} hasta={L(86.4)} tam={70} />
        <ManoLeo texto="pizza boxes." x={140} y={250} desde={L(86.7)} hasta={L(87.9)} tam={70} />
        <ManoLeo texto="the delivery bag." x={140} y={250} desde={L(88.1)} hasta={L(89.3)} tam={70} />
        <ManoLeo texto="drawings he never finished." x={140} y={900} desde={L(89.8)} tam={66} />
      </>} />
  );
};
// 92-98,7 · apoya el farol y una ola tibia barre el cuarto; Leo levanta la vista
const Tibio13b: React.FC = () => {
  const T = 92.0, f = useF(), L = (t: number) => fr(t, T);
  const apoyado = f >= L(95.2);
  const ola = ent(f, L(95.3), L(97.6));
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, 1460, 650, 1.35), mira(L(95.4), 1460, 660, 1.45), mira(L(96.4), 1500, 560, 0.9), mira(L(98.7), 1500, 560, 0.95)]}
      detras={<>{oscuro}<Tibio k={0.25 + 0.75 * ola} x={apoyado ? FX : TX - 60} y={P - 80} /></>}
      medio={<>
        <LeoSentado caras={[{ f: 0, v: "triste" }, { f: L(96.4), v: "sorpresa" }]} luz={apoyado ? L_ORO_D : L_TEL} poses={[{ f: 0, v: SENT_CEL }, { f: L(96.4), v: { ...SENT_CEL, cabeza: -10 } }]} miradas={[{ f: L(96.4), v: { x: 1, y: -0.2 } }]} />
        <Actor look={TENZO} escala={ESC} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: -1 }]}
          asiento={[{ f: 0, v: undefined }, { f: L(93.6), v: 8, d: 30 }]} poses={[{ f: 0, v: FAROL }, { f: L(93.6), v: { ...LOTO, hD: 50, cD: 30, tronco: 14 } }, { f: L(95.6), v: LOTO }]}
          caras={[{ f: 0, v: "feliz" }]} enManoD={apoyado ? undefined : <FarolMano />} />
        {apoyado && <FarolPiso />}
        {ola > 0 && ola < 1 && <circle cx={FX} cy={P - 60} r={60 + 2600 * ola} fill="none" stroke={ORO} strokeWidth={40 * (1 - ola) + 4} opacity={0.55 * (1 - ola)} />}
      </>}
      hud={<Hud min={390} dia={5} />} />
  );
};
// 106,5-111 · «every night since… always the same»: tres Leos idénticos, tres noches
const Mismo14: React.FC = () => {
  const f = useF();
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, 1240, 640, 1.05), mira(135, 1240, 640, 1.12)]}
      detras={<>{oscuro}{oscuro}</>}
      medio={<>{[-440, 0, 440].map((dx, i) => (
        <g key={i} opacity={SINGLE(f, i * 12, i * 12 + 10)}>
          <Actor look={LEO3} escala={ESC} seed={1} luz={L_TEL} ruta={[{ f: 0, x: LX + dx, y: P }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: AS }]} poses={alterna(SENT_CEL, { ...SENT_CEL, cD: 136 }, 0, 135, 8)} caras={[{ f: 0, v: "cansado" }]} enManoD={<Tel />} />
          <Halo x={LX + dx + 60} y={LEO_CARA_Y} r={150} color="#7fb0ff" fuerza={0.3} />
        </g>
      ))}</>}
      hud={<>
        <Hud min={390} dia={5} />
        {["night 5", "night 6", "night 7"].map((t, i) => <ManoLeo key={i} texto={t} x={430 + i * 470} y={830} desde={i * 12} tam={52} />)}
        <ManoLeo texto="always the same." x={1180} y={180} desde={60} tam={70} />
      </>} />
  );
};
// 111-113,1 · Tenzo asiente despacio (primer plano) y el farol titila
const Asiente14: React.FC = () => (
  <PPTenzo dur={63} tenzo={{ poses: [{ f: 0, v: LOTO }, { f: 10, v: { ...LOTO, cabeza: 22 } }, { f: 30, v: LOTO }, { f: 42, v: { ...LOTO, cabeza: 18 } }, { f: 58, v: LOTO }], caras: [{ f: 0, v: "feliz" }] }} hud={<Hud min={390} dia={5} />} />
);
// 113,1-118,7 · «Let me tell you about a man on a horse» · el farol titila y el cuarto se disuelve en el camino
const Farol15b: React.FC = () => {
  const T = 113.1, f = useF(), L = (t: number) => fr(t, T);
  const r = interpolate(f, [L(115.6), L(118.4)], [0, 1300], { ...cl, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill>
      <CuartoCalido claves={[mira(0, 1450, 610, 1.25), mira(L(115.4), FX, P - 70, 2.9), mira(L(118.7), FX, P - 70, 3.1)]} hud={<Hud min={390} dia={5} />}>
        <LeoSentado tel={false} luz={L_ORO_D} poses={[{ f: 0, v: CABIZBAJO }, { f: 30, v: SENT }]} caras={[{ f: 0, v: "triste" }, { f: 40, v: "duda" }]} miradas={[{ f: 40, v: { x: 1, y: 0 } }]} />
        <TenzoSentado habla={[[0, L(115.4)]]} poses={[{ f: 0, v: LOTO_ENSENA_ }]} />
      </CuartoCalido>
      {r > 0 && (
        <AbsoluteFill style={{ clipPath: `circle(${r}px at 960px 540px)` }}>
          <Escena Set={CaminoChina} pal={PAL_ANT} claves={[mira(0, 300, 560, 0.9), mira(L(118.7), 300, 560, 0.8)]} />
        </AbsoluteFill>
      )}
      {r > 0 && <svg {...svgP}><circle cx={960} cy={540} r={r} fill="none" stroke={ORO} strokeWidth={14} opacity={0.6} /></svg>}
    </AbsoluteFill>
  );
};
// 118,7-128 · el camino: «OLD CHINA», el granjero apoyado en la azada (vertical) bosteza
const AzadaPie: React.FC<{ x: number }> = ({ x }) => (
  <g>
    <path d={`M${x},${CP - 300} L${x},${CP}`} stroke="#7a5230" strokeWidth={10} strokeLinecap="round" />
    <path d={`M${x - 8},${CP - 6} L${x + 42},${CP - 2} L${x + 40},${CP + 16} L${x - 10},${CP + 12} Z`} fill="#6a6a70" />
  </g>
);
const Camino16b: React.FC = () => {
  const T = 118.7, f = useF(), L = (t: number) => fr(t, T);
  const GX = CHINA_PUNTOS.granjero;
  const APOYO = { tronco: 6, hD: 70, cD: 40, hI: 75, cI: 50, cabeza: 4 };
  return (
    <Escena Set={CaminoChina} pal={PAL_ANT} claves={[mira(0, 300, 560, 0.72), mira(L(122.6), 1000, 600, 0.85), mira(L(125.4), GX + 60, CP - 260, 1.9), mira(L(128), GX + 80, CP - 260, 2.0)]}
      medio={<>
        <AzadaPie x={GX + 70} />
        <Actor look={GRANJERO} escala={1.1} seed={11} luz={L_ANT} ruta={[{ f: 0, x: GX, y: CP }]} dir={[{ f: 0, v: 1 }, { f: L(126.5), v: -1 }]}
          poses={[{ f: 0, v: APOYO }, { f: L(123.4), v: { ...APOYO, hI: 160, cI: 150, tronco: -6, cabeza: -10 } }, { f: L(125.0), v: APOYO }]}
          caras={[{ f: 0, v: "feliz" }, { f: L(123.4), v: "sorpresa" }, { f: L(124.6), v: "cansado" }, { f: L(126.5), v: "sorpresa" }]} />
        <NubePolvo x={-700} piso={CP + 40} k={ent(f, L(125.5), L(128))} f={f} ancho={500} />
      </>}
      hud={<div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 84, letterSpacing: 24, color: "#3a2a1a", opacity: SINGLE(f, 10, 30) * (1 - SINGLE(f, L(122.4), L(123.2))) }}>OLD CHINA</div>} />
  );
};
// velocidad: líneas que cruzan el cuadro
const Lineas: React.FC<{ dir?: 1 | -1; color?: string; n?: number }> = ({ dir = 1, color = "#fff4dc", n = 14 }) => {
  const f = useF();
  return <svg {...svgP}>{Array.from({ length: n }).map((_, k) => { const y = 120 + ((k * 197) % 840), len = 160 + (k % 4) * 90; const x = ((k * 389 + f * 70 * dir) % 2400 + 2400) % 2400 - 240; return <rect key={k} x={dir > 0 ? 1920 - x : x} y={y} width={len} height={5} rx={2} fill={color} opacity={0.35} />; })}</svg>;
};
// 128-131,5 · el polvo, general · 131,5-133,9 · contrapicado de las patas · 133,9-138,1 · el muchacho agarrado con las dos manos
const Galope17a: React.FC = () => {
  const T = 128.0, f = useF(), t = T + f / 30;
  const ks = Array.from({ length: 5 }, (_, k) => { const tt = T + k; return mira((tt - T) * 30, hxDe(tt) + 260, 600, 0.9); });
  return <Escena Set={CaminoChina} pal={PAL_ANT} claves={ks} medio={<><Granjero /><ChinaJinete t={t} f={f} cara="sorpresa" /></>} hud={<Lineas dir={-1} n={8} />} />;
};
const Galope17b: React.FC = () => {
  const T = 131.5, f = useF(), t = T + f / 30;
  const ks = Array.from({ length: 4 }, (_, k) => { const tt = T + k; return mira((tt - T) * 30, hxDe(tt) + 40, CP - 60, 2.6); });
  return <Escena Set={CaminoChina} pal={PAL_ANT} claves={ks} medio={<ChinaJinete t={t} f={f} cara="miedo" />} hud={<Lineas dir={-1} />} />;
};
const Galope17c: React.FC = () => {
  const T = 133.9, f = useF(), t = T + f / 30;
  const ks = Array.from({ length: 6 }, (_, k) => { const tt = T + k; return mira((tt - T) * 30, hxDe(tt) - 10, CP - 360, 1.9); });
  return <Escena Set={CaminoChina} pal={PAL_ANT} claves={ks} medio={<ChinaJinete t={t} f={f} cara="miedo" pose={{ ...POSE_JINETE, tronco: 24, hD: 70, cD: 70, hI: 75, cI: 65 }} />} hud={<Lineas dir={-1} />} />;
};
// 138,1-144,3 · la cara se pone roja en «red», los ojos se abren en «wide»
const CaraRoja17b: React.FC = () => {
  const T = 138.1, f = useF(), t = T + f / 30, L = (tt: number) => fr(tt, T);
  const cl2 = Array.from({ length: 8 }, (_, k) => { const tt = T + k; return mira((tt - T) * 30, hxDe(tt) + 10, CP - 380, 2.3); });
  const rojo = ent(f, L(138.6), L(139.2));
  return (
    <Escena Set={CaminoChina} pal={PAL_ANT} claves={cl2}
      medio={<>
        <ChinaJinete t={t} f={f} cara={f < L(139.6) ? "cansado" : "miedo"} pose={{ ...POSE_JINETE, tronco: 26, hI: f > L(141) ? 110 + Math.sin(f / 3) * 30 : 60, cI: 40 }} />
        <Halo x={hxDe(t) - 4} y={CP - 335} r={62} color="#ff2a1a" fuerza={0.2 + 0.7 * rojo} />
      </>}
      hud={<Lineas dir={-1} n={10} />} />
  );
};
// 144,3-151,6 · el grito del granjero y, en 148,2, el muchacho que mira por encima del hombro
const Grito18b: React.FC = () => {
  const T = 144.3, f = useF(), t = T + f / 30, L = (tt: number) => fr(tt, T);
  return (
    <Escena Set={CaminoChina} pal={PAL_ANT} claves={[mira(0, 1500, 600, 0.82), mira(L(148.2), 1800, 600, 0.86), mira(L(148.6), hxDe(148.6) - 60, CP - 330, 1.6), mira(L(151.6), hxDe(151.6) - 60, CP - 330, 1.6)]}
      medio={<>
        <Granjero dir={[{ f: 0, v: -1 }, { f: L(145.6), v: 1 }]} poses={[{ f: 0, v: { tronco: 8, hD: 40, cD: 60, hI: 45, cI: 70 } }, { f: L(146.2), v: { tronco: -6, hD: 40, cD: 60, hI: 120, cI: 150, cabeza: -10 } }]}
          caras={[{ f: 0, v: "sorpresa" }, { f: L(146.2), v: "risa" }]} habla={[[L(146.2), L(148.2)]]} />
        <ChinaJinete t={t} f={f} cara="miedo" giro={f > L(148.6) ? -0.9 : 0} pose={f > L(148.6) ? { ...POSE_JINETE, cabeza: -6 } : undefined} />
      </>}
      hud={<Globo texto="Hey! Where are you going?!" x={720} y={250} desde={L(146.2)} hasta={L(148.3)} cola="abajo" tam={46} />} />
  );
};
// 151,6-154 · «I don't know! Ask the horse!» · 154-156,9 · el granjero en la nube de polvo, tose y se rasca la cabeza
const Pregunta19b: React.FC = () => {
  const T = 151.6, f = useF(), t = T + f / 30, L = (tt: number) => fr(tt, T);
  const cl2 = [0, 1, 2, 2.4].map((k) => mira(k * 30, hxDe(Math.min(T + k, 154)) + 40, CP - 330, 1.45));
  return (
    <Escena Set={CaminoChina} pal={PAL_ANT} claves={cl2}
      medio={<>
        <ChinaJinete t={t} f={f} cara={f < L(153.3) ? "miedo" : "risa"} giro={-0.9} pose={{ ...POSE_JINETE, cabeza: -6 }} />
      </>}
      hud={<Globo texto="I DON'T KNOW! ASK THE HORSE!" x={760} y={170} desde={2} hasta={L(154)} cola="abajo" tam={48} />} />
  );
};
const Tos19: React.FC = () => {
  const f = useF();
  const GX = CHINA_PUNTOS.granjero;
  return (
    <Escena Set={CaminoChina} pal={PAL_ANT} claves={[mira(0, GX - 40, CP - 240, 1.9), mira(87, GX - 40, CP - 240, 2.05)]}
      medio={<>
        <Granjero dir={[{ f: 0, v: 1 }]} poses={[...alterna({ tronco: 24, hD: 40, cD: 120, hI: 45, cI: 70, cabeza: 10 }, { tronco: 10, hD: 40, cD: 110, hI: 45, cI: 70 }, 0, 44, 7), { f: 48, v: { tronco: 0, hD: 40, cD: 60, hI: 165, cI: 145, cabeza: 6 } }]}
          caras={[{ f: 0, v: "asco" }, { f: 48, v: "duda" }]} />
        <NubePolvo x={GX + 200} piso={CP + 40} k={1 - SINGLE(f, 10, 80) * 0.6} f={f + 200} ancho={900} />
      </>} />
  );
};
// 156,9-161,5 · Leo se ríe (una vez, con el cuerpo) y corta en seco
const Risa20b: React.FC = () => (
  <PPLeo dur={138} z={3.0} leo={{ poses: [...alterna({ ...SENT, tronco: -16, cabeza: -18 }, { ...SENT, tronco: -6, cabeza: -6 }, 6, 40, 7), { f: 42, v: SENT }, { f: 100, v: { ...SENT, cabeza: 12 } }], caras: [{ f: 0, v: "feliz" }, { f: 6, v: "risa" }, { f: 40, v: "neutral" }, { f: 100, v: "triste" }] }}
    hud={<><Hud min={390} dia={5} /><ManoLeo texto="ha!" x={1260} y={260} desde={8} hasta={40} tam={120} /></>} />
);
// 161,5-165,2 · «I'm the guy on the horse»: el jinete fantasma galopa detrás de él
const Fantasma20: React.FC = () => {
  const f = useF();
  return (
    <CuartoCalido claves={[mira(0, LX - 60, 640, 1.9), mira(111, LX - 60, 640, 2.0)]} hud={<><Hud min={390} dia={5} /><ManoLeo texto={"i'm the guy"} x={1200} y={180} desde={69} /><ManoLeo texto={"on the horse."} x={1260} y={270} desde={78} /></>}>
      <g opacity={0.55 * SINGLE(f, 10, 30)}><Montado x={LX - 120} piso={P - 10} fase={(f % 14) / 14} dir={1} s={1.15} variante="mara" look={LEO3} cara="miedo" escala={ESC} luz={L_TEL} pose={{ ...POSE_JINETE, hD: 60, cD: 125, cabeza: 18 }} /></g>
      <LeoSentado tel={false} luz={L_ORO_D} poses={[{ f: 0, v: { ...SENT, cabeza: 12 } }, { f: 70, v: { ...SENT, cabeza: 12, hD: 120, cD: 150 } }]} caras={[{ f: 0, v: "triste" }]} habla={[[0, 108]]} />
    </CuartoCalido>
  );
};
// 165,2-170,1 · «The horse is habit»: Tenzo dibuja un caballo de humo en el aire · HABIT · 10 YEARS
const CaballoAire: React.FC<{ f0: number; x: number; y: number; s?: number; dur?: number; neon?: string }> = ({ f0, x, y, s = 0.9, dur = 50, neon = ORO }) => {
  const f = useF();
  const k = SINGLE(f, f0, f0 + dur);
  if (k <= 0) return null;
  const w = 700 * s;
  return (
    <svg {...svgP}>
      <defs><clipPath id={`ca${f0}`}><rect x={x - w / 2 - 40} y={y - 400 * s} width={(w + 80) * k} height={700 * s} /></clipPath></defs>
      <g clipPath={`url(#ca${f0})`} opacity={0.55}><Caballo x={x} piso={y} fase={0.25} s={s} variante="mara" neon={neon} quieto /></g>
      {k < 1 && <circle cx={x - w / 2 + (w + 40) * k} cy={y - 200 * s} r={14} fill="#fff4dc" />}
    </svg>
  );
};
const Habito20: React.FC = () => {
  const T = 165.2, L = (t: number) => fr(t, T);
  return (
    <SobreTenzo dur={147} tenzo={{ poses: [{ f: 0, v: HABLA_A }, { f: L(167.4), v: { ...LOTO, hD: 120, cD: 20 } }, { f: L(168.4), v: { ...LOTO, hD: 100, cD: 30 } }, { f: L(169.2), v: HABLA_B }], caras: [{ f: 0, v: "feliz" }, { f: L(167.5), v: "neutral" }], habla: [[0, 140]] }}
      hud={<>
        <Hud min={390} dia={5} />
        <CaballoAire f0={L(167.4)} x={720} y={470} s={0.95} dur={40} />
        <div style={{ position: "absolute", left: 520, top: 150, width: 500, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 70, letterSpacing: 10, color: ORO, opacity: SINGLE(useF(), L(167.8), L(168.2)) }}>HABIT</div>
        <div style={{ position: "absolute", left: 520, top: 240, width: 500, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 46, letterSpacing: 6, color: "#f4efe6", opacity: SINGLE(useF(), L(168.8), L(169.2)) }}>10 YEARS</div>
      </>} />
  );
};
// 170,1-174,5 · el hábito: Leo agarrado con las dos manos, estelas de luz
const Habito21b: React.FC<{ o?: number; z?: number; y?: number; asustado?: boolean }> = ({ o = 0, z = 1.05, y = 620, asustado }) => {
  const f = useF() + o;
  const hx = 4300 - f * 6.5;
  const ks = Array.from({ length: 13 }, (_, k) => mira(k * 30, 4300 - (k * 30 + o) * 6.5 - 120, y, z));
  return (
    <Escena Set={Broadway} pal={PAL} claves={ks}
      medio={<>
        <NubePolvo x={hx + 300} piso={BWY_PISO + 30} k={0.5} f={f} color="#1e1414" ancho={360} />
        {[0, 1, 2].map((k) => <rect key={k} x={hx + 220} y={BWY_PISO - 260 + k * 70} width={700 - k * 120} height={8} rx={4} fill={ACENTO} opacity={0.35 - k * 0.08} />)}
        <Montado x={hx} piso={BWY_PISO + 30} fase={(f % 14) / 14} dir={-1} s={1.3} variante="mara" look={LEO3} cara={asustado ? (f % 50 < 25 ? "miedo" : "duda") : "miedo"} escala={ESC} luz={L_TEL}
          pose={asustado ? { ...POSE_JINETE, tronco: 14, hD: 70, cD: 60, hI: 75, cI: 55, cabeza: 22 } : { ...POSE_JINETE, tronco: 20, hD: 70, cD: 70, hI: 75, cI: 65, cabeza: 6 }} />
        <Halo x={hx} y={BWY_PISO - 250} r={500} color={ACENTO} fuerza={0.3} />
      </>}
      hud={<><Hud min={390} dia={5} estado="sube" /><Lineas dir={1} n={10} /></>} />
  );
};
// 177,8-181,4 · no sabe cómo bajarse: mira el piso que corre, las manos no se sueltan
const Bajarse21: React.FC = () => {
  const f = useF() + 300;
  const hx = 4300 - f * 6.5;
  return (
    <Escena Set={Broadway} pal={PAL} claves={[mira(0, hx - 30, BWY_PISO - 220, 1.9), ...Array.from({ length: 4 }, (_, k) => mira(k * 30 + 30, 4300 - (300 + k * 30 + 30) * 6.5 - 30, BWY_PISO - 220, 1.95))]}
      medio={<Montado x={hx} piso={BWY_PISO + 30} fase={(f % 14) / 14} dir={-1} s={1.3} variante="mara" look={LEO3} cara={f % 40 < 20 ? "miedo" : "duda"} escala={ESC} luz={L_TEL}
        pose={{ ...POSE_JINETE, tronco: 26, hD: 70, cD: 60, hI: 75, cI: 55, cabeza: 30, pD: 40 + Math.sin(f / 4) * 20 }} />}
      hud={<><Hud min={390} dia={5} estado="sube" /><Lineas dir={1} /><ManoLeo texto="how do you get off?" x={120} y={250} desde={50} tam={64} /></>} />
  );
};
// 181,4-183,4 · inserto: un solo dedo que sube, con brillo
const Dedo22b: React.FC = () => {
  const f = useF();
  const up = ent(f, 4, 22);
  return (
    <AbsoluteFill style={{ background: "#2a2018" }}>
      <svg {...svgP}>
        <Halo x={960} y={500} r={700} color={ORO} fuerza={0.35} />
        <path d="M700,1080 Q690,760 820,700 L1120,700 Q1220,760 1210,1080 Z" fill="#8e8a82" />
        <path d="M760,820 Q770,650 900,640 L1110,650 Q1170,690 1160,820 Q1100,880 940,880 Q800,880 760,820 Z" fill="#f2bf8f" />
        {[0, 1, 2].map((k) => <path key={k} d={`M${1000 + k * 50},660 Q${1020 + k * 50},610 ${1050 + k * 50},650`} stroke="#d9a274" strokeWidth={6} fill="none" />)}
        <g transform={`translate(905,660) rotate(${(1 - up) * 80})`}><rect x={-34} y={-300} width={68} height={300} rx={34} fill="#f2bf8f" /><path d="M-22,-270 Q0,-292 22,-270" stroke="#fff3e3" strokeWidth={8} fill="none" /></g>
        {up > 0.9 && <g opacity={SINGLE(f, 22, 28) * (1 - SINGLE(f, 44, 58))}>{[0, 45, 90, 135].map((a) => <rect key={a} x={-4} y={-60} width={8} height={120} rx={4} fill="#fff4dc" transform={`translate(905,330) rotate(${a})`} />)}</g>}
      </svg>
      <Hud min={390} dia={5} />
    </AbsoluteFill>
  );
};
// 185,5-190,7 · la primera palabra: los «antes» se escriben y se subrayan, Leo se asoma a leer
const Antes22b: React.FC = () => {
  const T = 183.4, f = useF(), L = (t: number) => fr(t, T);
  const items = [{ t: "before the sitting", a: L(186.9) }, { t: "before the chanting", a: L(188.0) }, { t: "before anything", a: L(189.2) }];
  return (
    <CuartoCalido claves={[mira(0, LX + 300, LEO_CARA_Y + 60, 2.3), mira(L(190.7), LX + 280, LEO_CARA_Y + 40, 2.5, { curva: "in" })]} hud={<>
      <svg {...svgP}>
        <Hoja x={1260} y={520} w={1040} h={720} rot={-1.5}><g transform="translate(560,0)">
          <text x={200} y={180} fontFamily={F_MANO} fontSize={66} fontWeight={700} fill="#2a2622" opacity={SINGLE(f, 0, 10)}>the first word:</text>
          <rect x={720} y={120} width={240} height={96} rx={10} fill="none" stroke={ACENTO} strokeWidth={6} opacity={SINGLE(f, 10, 20)} />
          <text x={840} y={190} textAnchor="middle" fontFamily={F_MANO} fontSize={70} fontWeight={700} fill={ACENTO} opacity={SINGLE(f, L(189.6), L(190.2))}>?</text>
          {items.map((it, i) => (
            <g key={i} opacity={SINGLE(f, it.a, it.a + 6)}>
              <text x={240} y={330 + i * 120} fontFamily={F_MANO} fontSize={58} fontWeight={700} fill="#5a4e42">{"— " + it.t}</text>
              <rect x={240} y={346 + i * 120} width={640 * SINGLE(f, it.a + 4, it.a + 20)} height={6} rx={3} fill={ACENTO} />
            </g>
          ))}
        </g></Hoja>
      </svg>
      <Hud min={390} dia={5} />
    </>}>
      <LeoSentado tel={false} luz={L_ORO_D} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: SENT }, { f: 20, v: { ...SENT, tronco: 22, cabeza: 14 } }, ...items.flatMap((it) => [{ f: it.a, v: { ...SENT, tronco: 28, cabeza: 22, hD: 60, cD: 40 } }, { f: it.a + 14, v: { ...SENT, tronco: 20, cabeza: 10 } }]), { f: L(189.6), v: { ...SENT, tronco: 30, cabeza: 4, hD: 100, cD: 60 } }]} caras={[{ f: 0, v: "duda" }, { f: L(189.6), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: -1, y: 0.3 } }, ...items.map((it, i) => ({ f: it.a, v: { x: -1, y: 0.1 + i * 0.25 } })), { f: L(189.6), v: { x: -1, y: -0.4 } }]} />
    </CuartoCalido>
  );
};
// 190,7-193,2 · STOP. (el HUD se congela)
const StopNegro2: React.FC = () => {
  const f = useF();
  const s = interpolate(f, [0, 8], [1.25, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#07080b", alignItems: "center", justifyContent: "center" }}>
      <svg {...svgP}><Halo x={960} y={540} r={520} color={ORO} fuerza={0.18} /><circle cx={960} cy={540} r={260 + f * 9} fill="none" stroke={ORO} strokeWidth={6} opacity={Math.max(0, 0.6 - f / 60)} /></svg>
      <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: 300, color: "#f4efe6", letterSpacing: 10, transform: `scale(${s})`, opacity: SINGLE(f, 40, 44) }}>STOP.</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0 }}><Hud min={390} dia={5} estado="congelado" /></div>
    </AbsoluteFill>
  );
};
// 193,2-195,3 · «That's it? Just… stop?»: se echa para atrás con las manos abiertas
const Solo23: React.FC = () => (
  <PPLeo dur={63} z={3.0} leo={{ poses: [{ f: 0, v: SENT }, { f: 6, v: { ...SENT, tronco: -14, cabeza: -14, hD: 135, cD: 35, hI: 128, cI: 40 } }], caras: [{ f: 0, v: "sorpresa" }, { f: 30, v: "duda" }], habla: [[0, 60]] }} hud={<Hud min={390} dia={5} />} />
);
// 195,3-199,8 · «you cannot stop the horse, he is bigger than you»: Leo diminuto ante un caballo gigante
const Gigante24: React.FC = () => {
  const T = 195.3, f = useF(), L = (t: number) => fr(t, T);
  const fa = (f % 20) / 20;
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, 1500, 560, 0.7), mira(L(199.8), 1500, 600, 0.78, { curva: "in" })]}
      detras={<Halo x={760} y={P - 100} r={700} color={ORO} fuerza={0.3} />}
      medio={<>
        <Caballo x={1680} piso={P} fase={f < L(198.3) ? fa : 0.25} s={3.2} variante="mara" quieto={f >= L(198.3)} />
        <Actor look={LEO3} escala={ESC * 0.9} seed={1} luz={L_TEL} ruta={[{ f: 0, x: 760, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 40, cD: 30, hI: 30, cI: 30 } }, { f: L(197.2), v: { hD: 130, cD: 40, hI: 120, cI: 40, tronco: -8 } }]} caras={[{ f: 0, v: "sorpresa" }, { f: L(197.2), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: -1 } }]} />
      </>}
      hud={<><Hud min={390} dia={5} /><ManoLeo texto="bigger than you." x={140} y={250} desde={L(198.4)} tam={70} /></>} />
  );
};
// 199,8-204,8 · «stop you. for one breath»: el círculo de una respiración sobre la cara de Leo
const Respiro24: React.FC = () => {
  const T = 199.8, f = useF(), L = (t: number) => fr(t, T);
  const a = L(202.2), b = L(204.6);
  const k = f < a ? 0 : Math.sin(Math.PI * SINGLE(f, a, b));
  return (
    <PPLeo dur={150} z={3.3} dx={-40} leo={{ poses: [{ f: 0, v: SENT }, { f: L(202.2), v: { ...SENT, cabeza: -6, tronco: -4 } }], caras: [{ f: 0, v: "duda" }, { f: L(202.0), v: "cansado" }, { f: L(203.6), v: "feliz" }] }}
      hud={<>
        <Hud min={390} dia={5} />
        <svg {...svgP}>
          <circle cx={1092} cy={420} r={300 + 160 * k} fill={ORO} opacity={0.06 + 0.08 * k} />
          <circle cx={1092} cy={420} r={300 + 160 * k} fill="none" stroke={ORO} strokeWidth={10} opacity={f >= a ? 0.9 : 0.25} />
          <text x={1092} y={960} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={52} fill="#f4efe6" opacity={SINGLE(f, a, a + 10)}>1 BREATH</text>
        </svg>
        <ManoLeo texto="stop you." x={1120} y={140} desde={L(200.7)} hasta={L(202.1)} tam={80} />
      </>} />
  );
};
// 204,8-212,8 · Leo se desdobla: uno sigue arriba del caballo (cámara lenta), el otro se baja al costado y lo mira
const Ve24b: React.FC = () => {
  const T = 204.8, f = useF(), L = (t: number) => fr(t, T);
  const fl = f * 0.22;
  const hx = 1300 + fl * 3;
  const sale = ent(f, L(207.8), L(209.6));
  const ox = interpolate(sale, [0, 1], [hx, hx - 520]), oy = interpolate(sale, [0, 1], [CP - (250 - 16) - 20, CP]);
  return (
    <Escena Set={CaminoChina} pal={PAL_ANT} claves={[mira(0, hx - 60, CP - 330, 1.5), mira(L(207.8), hx - 160, CP - 300, 1.35), mira(L(212.8), hx - 260, CP - 280, 1.3)]}
      medio={<>
        <NubePolvo x={hx - 330} piso={CP + 40} k={0.4} f={fl} />
        <Montado x={hx} piso={CP + 40} fase={(fl % 14) / 14} look={LEO3} cara={f < L(206.3) ? "cansado" : "sorpresa"} escala={1.0} luz={L_ANT}
          pose={f < L(205.8) ? POSE_JINETE : { ...POSE_JINETE, tronco: 0, cabeza: 26, hD: 40, cD: 100, hI: 40, cI: 100 }} />
        {sale > 0 && <Actor look={LEO3} escala={1.0} seed={4} luz={L_ANT} ruta={[{ f: 0, x: ox, y: oy }]} dir={[{ f: 0, v: 1 }]} opacidad={() => 0.4 + 0.6 * sale}
          poses={[{ f: 0, v: { hD: 10, cD: 20, hI: 10, cI: 20 } }]} caras={[{ f: 0, v: "neutral" }, { f: L(210.8), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: -0.4 } }]} />}
      </>}
      hud={<>
        <ManoLeo texto="you, on the horse." x={1180} y={150} desde={L(205)} hasta={L(207.8)} tam={60} />
        <ManoLeo texto="you, seeing the horse." x={120} y={250} desde={L(210.8)} tam={60} />
      </>} />
  );
};
// 212,8-216,3 · la sonrisa de la sombra se afina · 216,3-221,9 · se inclina al oído de Leo
const Aburrido25b: React.FC = () => {
  const T = 212.8, f = useF(), L = (t: number) => fr(t, T);
  const x = interpolate(f, [L(215.6), L(217)], [MX, LX - 150], cl);
  return (
    <CuartoCalido claves={[mira(0, LX - 80, 600, 1.5), mira(L(216.3), LX - 90, 600, 1.6), mira(L(216.8), LX - 90, LEO_CARA_Y - 130, 2.0), mira(L(221.9), LX - 90, LEO_CARA_Y - 130, 2.12)]}
      hud={<><Hud min={390} dia={5} /><ManoMara texto={"stop is boring."} x={1150} y={150} desde={L(217.6)} /><ManoMara texto={"stop is empty."} x={1180} y={240} desde={L(218.6)} /></>}>
      <MaraTras esc={1.3} x={x} cara={[{ f: 0, v: "feliz" }, { f: L(213.6), v: "neutral" }, { f: L(214.6), v: "duda" }, { f: L(216.3), v: "enojo" }]}
        pose={f < L(215.6) ? { hD: 70, cD: 50, hI: 40, cI: 70, cabeza: 18, tronco: 4 } : { hD: 100, cD: 60, hI: 40, cI: 70, cabeza: 34, tronco: 30 }} />
      <LeoSentado tel={false} luz={L_ORO_D} poses={[{ f: 0, v: SENT }, { f: L(217.5), v: { ...SENT, cabeza: 10 } }]} caras={[{ f: 0, v: "neutral" }, { f: L(217), v: "duda" }]} />
    </CuartoCalido>
  );
};
// 221,9-225,6 · «Let us try. Pick up the phone»: Tenzo empuja el celular por el piso hasta Leo
const Empuja26: React.FC = () => {
  const T = 221.9, f = useF(), L = (t: number) => fr(t, T);
  const tx = interpolate(f, [L(223.9), L(225.0)], [TX - 160, LX + 160], { ...cl, easing: Easing.out(Easing.cubic) });
  return (
    <CuartoCalido claves={[mira(0, 1450, 760, 1.7), mira(L(225.6), 1430, 770, 1.8)]} hud={<Hud min={390} dia={5} />}>
      <LeoSentado tel={false} luz={L_ORO_D} poses={[{ f: 0, v: SENT }]} caras={[{ f: 0, v: "neutral" }, { f: L(225), v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: L(224.4), v: { x: 0.6, y: 1 } }]} />
      <TenzoSentado poses={[{ f: 0, v: LOTO_ENSENA_ }, { f: L(223.6), v: { ...LOTO, tronco: 30, hD: 85, cD: 10 } }, { f: L(225.2), v: LOTO_ENSENA_ }]} habla={[[0, L(223.4)], [L(224.0), L(225.3)]]} />
      <TelMesa x={tx} y={P - 2} />
    </CuartoCalido>
  );
};
// 225,6-229,3 · Leo lo levanta a medias, desconfiado (sobre el hombro de Tenzo)
const Duda26: React.FC = () => (
  <SobreLeo dur={111} leo={{ tel: true, poses: [{ f: 0, v: { ...SENT, hD: 40, cD: 70 } }, { f: 20, v: { ...SENT_CEL, cabeza: 4 } }], caras: [{ f: 0, v: "duda" }, { f: 60, v: "sorpresa" }], habla: [[63, 108]], miradas: [{ f: 0, v: { x: 1, y: 0 } }] }} hud={<Hud min={390} dia={5} />} />
);
// 229,3-231,5 · «Open it. Do what you always do» (Tenzo, sobre el hombro de Leo, hace el gesto de «adelante»)
const Adelante26: React.FC = () => (
  <SobreTenzo dur={66} tenzo={{ poses: alterna({ ...LOTO, hD: 70, cD: 40 }, { ...LOTO, hD: 90, cD: 10 }, 0, 66, 10), caras: [{ f: 0, v: "feliz" }], habla: [[0, 60]] }} hud={<Hud min={390} dia={5} />} />
);
// 231,5-235,5 · primer plano real: la cara iluminada por la pantalla que cambia de color
const Abre27: React.FC = () => {
  const f = useF();
  const cs = ["#7fb0ff", "#e46a5a", "#e4c25a", "#7ad08a", "#c27ae4"];
  return (
    <PPLeo dur={120} z={4.0} dx={60} dy={30} leo={{ tel: true, luz: L_TEL, poses: alterna(SENT_CEL, { ...SENT_CEL, cD: 138 }, 0, 120, 7), caras: [{ f: 0, v: "neutral" }, { f: 50, v: "cansado" }] }}
      despues={<Halo x={LX + 110} y={LEO_CARA_Y + 30} r={180} color={cs[Math.floor(f / 14) % cs.length]} fuerza={0.4} />}
      hud={<Hud min={[{ f: 0, v: 390 }, { f: 110, v: 398, d: 60 }]} dia={5} estado="sube" />} />
  );
};
// 235,5-245,7 · el feed acelera; en «the thumb is the horse» el pulgar se vuelve cabeza de caballo
const Scroll27b: React.FC = () => {
  const T = 235.5, f = useF(), L = (t: number) => fr(t, T);
  return (
    <AbsoluteFill style={{ background: "#120d0a" }}>
      <PantallaMacro secuencia={[...SEC, ...SEC]} periodo={f < L(239.6) ? 24 : 14} desde={20} />
      <CaballoAire f0={L(243.8)} x={1420} y={900} s={0.8} dur={10} neon={ACENTO} />
      <ManoLeo texto="the thumb is the horse." x={110} y={250} desde={L(243.6)} tam={66} />
      <Hud min={390 + Math.floor(Math.max(0, f - 20) / 26)} dia={5} estado="sube" />
    </AbsoluteFill>
  );
};
// 245,7-251,1 · «Stop», muy suave: el pulgar se congela en el aire
const Congela28b: React.FC = () => {
  const T = 245.7, L = (t: number) => fr(t, T);
  return (
    <AbsoluteFill style={{ background: "#120d0a" }}>
      <PantallaMacro secuencia={["choque", "chica", "perro", "baile"]} periodo={18} congela={L(248.7)} s={1.06} />
      <ManoLeo texto="stop." x={140} y={250} desde={4} tam={90} />
      <Hud min={406} dia={5} estado={(f) => (f < L(248.7) ? "sube" : "congelado")} />
    </AbsoluteFill>
  );
};
// 251,1-253,1 · «Now, where are you?» (Tenzo sobre el hombro de Leo)
const Donde29b: React.FC = () => (
  <SobreTenzo dur={60} tenzo={{ poses: [{ f: 0, v: { ...LOTO, cabeza: 10, hD: 60, cD: 40 } }], caras: [{ f: 0, v: "feliz" }], habla: [[0, 56]] }} hud={<Hud min={406} dia={5} estado="congelado" />} />
);
// 253,1-256,7 · «I'm in my room»: la cámara gira con su mirada por el cuarto
const MiCuarto29: React.FC = () => {
  const T = 253.1, L = (t: number) => fr(t, T);
  return (
    <CuartoCalido claves={[mira(0, LX + 60, LEO_CARA_Y + 40, 2.8), mira(L(254.5), LX + 60, LEO_CARA_Y + 40, 2.8), mira(L(255.6), CTO_PUNTOS.escritorio, 560, 1.3), mira(L(256.7), CTO_PUNTOS.ventana - 200, 520, 1.25)]}
      hud={<><Hud min={406} dia={5} estado="congelado" /><ManoLeo texto="my room." x={140} y={250} desde={L(254.6)} tam={70} /></>}>
      <LeoSentado telI tel luz={L_ORO_D} poses={[{ f: 0, v: { ...SENT_CEL, hD: 25, cD: 40 } }]} caras={[{ f: 0, v: "neutral" }, { f: 30, v: "duda" }]} habla={[[0, 42]]}
        miradas={[{ f: 0, v: { x: -1, y: 0 } }, { f: 30, v: { x: 1, y: -0.4 } }]} />
    </CuartoCalido>
  );
};
// 256,7-260,1 · «what do you feel?»: hace años que no se lo pregunta (le saca el polvo a la pregunta)
const Pregunta29: React.FC = () => {
  const f = useF();
  return (
    <PPLeo dur={102} z={3.2} dx={200} leo={{ poses: [{ f: 0, v: SENT }, { f: 40, v: { ...SENT, cabeza: -8, hD: 40, cD: 150 } }], caras: [{ f: 0, v: "neutral" }, { f: 30, v: "duda" }] }}
      hud={<>
        <Hud min={406} dia={5} estado="congelado" />
        <svg {...svgP}>
          <g transform={`translate(1380,330) rotate(${-3 + Math.sin(f / 30)})`}>
            <rect x={-300} y={-110} width={600} height={220} rx={20} fill="#f4efe6" />
            <text x={0} y={22} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={64} fill="#2a2622">what do i feel?</text>
            <rect x={-300} y={-110} width={600} height={220} rx={20} fill="#8a7a66" opacity={0.75 * (1 - SINGLE(f, 20, 70))} />
            {[0, 1, 2, 3, 4, 5].map((k) => { const t = SINGLE(f, 20 + k * 6, 60 + k * 6); return t > 0 && t < 1 ? <circle key={k} cx={-200 + k * 80 + t * 260} cy={-60 + (k % 3) * 50 - t * 140} r={10 + k % 3 * 4} fill="#8a7a66" opacity={1 - t} /> : null; })}
          </g>
        </svg>
        <ManoLeo texto="not in years." x={1180} y={560} desde={50} tam={56} />
      </>} />
  );
};
// 260,1-267,2 · el cuerpo: mandíbula, ojos, el pecho vacío y una espera que no llega
const Cuerpo29b: React.FC = () => {
  const T = 260.1, f = useF(), L = (t: number) => fr(t, T);
  const dibujo = SINGLE(f, 0, 18);
  const pts = [
    { x: 960, y: 340, t: "jaw tight", f0: L(260.3), lx: 1180, ly: 330 },
    { x: 935, y: 255, t: "eyes hurt", f0: L(261.5), lx: 470, ly: 230 },
  ];
  const hueco = SINGLE(f, L(263.5), L(264.2));
  const espera = f >= L(264.4);
  const z = interpolate(f, [0, L(267.2)], [1, 1.1]);
  return (
    <AbsoluteFill style={{ background: "#16130f" }}>
      <svg {...svgP}>
        <g transform={`translate(960,540) scale(${z}) translate(-960,-540)`}>
          <Halo x={1500} y={600} r={800} color={ORO} fuerza={0.22} />
          <g fill="none" stroke="#e9e3d6" strokeWidth={7} strokeLinecap="round" strokeDasharray={3000} strokeDashoffset={3000 * (1 - dibujo)}>
            <ellipse cx={960} cy={270} rx={120} ry={140} />
            <path d="M890,390 Q960,420 1030,390 L1050,420 Q1180,450 1220,560 L1260,820 M870,420 Q740,450 700,560 L660,820 M800,500 L800,900 M1120,500 L1120,900" />
          </g>
          {pts.map((p, i) => {
            const o = SINGLE(f, p.f0, p.f0 + 8);
            const pul = f - p.f0 < 30 ? 1 + 0.5 * Math.sin(((f - p.f0) / 30) * Math.PI) : 1;
            return (
              <g key={i} opacity={o}>
                {i === 0 ? <path d="M880,330 Q960,420 1040,330" stroke="#ff4a3d" strokeWidth={14 * pul} fill="none" strokeLinecap="round" /> : <g>{[-45, 45].map((dx) => <ellipse key={dx} cx={960 + dx} cy={255} rx={26 * pul} ry={16 * pul} fill="#ff4a3d" opacity={0.85} />)}</g>}
                <path d={`M${p.x},${p.y} L${p.lx - (p.lx > p.x ? 16 : -16)},${p.ly - 14}`} stroke="#e9e3d6" strokeWidth={3} />
              </g>
            );
          })}
          {hueco > 0 && <g>
            <circle cx={960} cy={600} r={110 * hueco} fill="#07060a" stroke="#e9e3d6" strokeWidth={5} strokeDasharray="14 12" />
            {espera && <g transform={`translate(960,600) rotate(${f * 8})`}>{Array.from({ length: 8 }).map((_, k) => <circle key={k} cx={Math.cos((k / 8) * 2 * Math.PI) * 60} cy={Math.sin((k / 8) * 2 * Math.PI) * 60} r={10} fill={ORO} opacity={(k + 1) / 8} />)}</g>}
          </g>}
        </g>
      </svg>
      {pts.map((p, i) => <ManoLeo key={i} texto={p.t} x={p.lx > p.x ? p.lx : p.lx - 300} y={p.ly - 60} desde={p.f0 + 4} tam={62} />)}
      <ManoLeo texto="empty." x={1220} y={560} desde={L(263.6)} tam={62} />
      <ManoLeo texto="waiting for something that isn't coming." x={330} y={930} desde={L(264.6)} tam={52} />
      <Hud min={406} dia={5} estado="congelado" />
    </AbsoluteFill>
  );
};
// 267,2-271,9 · «Good. That is the first true thing you have said to me» (primer plano, inclina la cabeza)
const Bien30: React.FC = () => {
  const T = 267.2, L = (t: number) => fr(t, T);
  return (
    <PPTenzo dur={141} tenzo={{ poses: [{ f: 0, v: LOTO }, { f: L(268.1), v: { ...LOTO, cabeza: 16, tronco: 6 } }, { f: L(269.4), v: { ...LOTO, cabeza: 6, hD: 60, cD: 40 } }], caras: [{ f: 0, v: "feliz" }, { f: L(267.4), v: "risa" }, { f: L(268.6), v: "feliz" }], habla: [[0, 136]] }}
      hud={<><Hud min={406} dia={5} estado="congelado" /><ManoLeo texto="the first true thing." x={140} y={250} desde={L(269.6)} tam={66} /></>} />
  );
};
// 271,9-274,6 · «Now, do you want to keep riding?» · detrás de Leo relincha el caballo de neón
const Seguir30: React.FC = () => {
  const f = useF();
  return (
    <SobreLeo dur={81} z={2.2} leo={{ tel: true, poses: [{ f: 0, v: SENT_CEL }], caras: [{ f: 0, v: "neutral" }, { f: 50, v: "duda" }], miradas: [{ f: 0, v: { x: 1, y: 0.2 } }] }}
      antes={<g opacity={0.35 + 0.15 * Math.sin(f / 4)}><Caballo x={LX - 260} piso={P - 6} fase={(f % 30) / 30 * 0.2 + 0.2} s={1.0} variante="mara" neon={ACENTO} quieto /></g>}
      hud={<><Hud min={406} dia={5} estado="congelado" /><ManoLeo texto="keep riding?" x={140} y={250} desde={18} tam={72} /></>} />
  );
};
// 274,6-278,8 · otra chica, otro perro: cada vez más rápido y más gris
const Otra30b: React.FC = () => {
  const f = useF();
  return (
    <AbsoluteFill style={{ background: "#120d0a" }}>
      <AbsoluteFill style={{ filter: `grayscale(${SINGLE(f, 0, 110)})` }}>
        <PantallaMacro secuencia={["chica", "perro", "grito", "chica", "perro", "grito", "chica"]} periodo={f < 60 ? 22 : 13} s={1.02} />
      </AbsoluteFill>
      <ManoLeo texto="another. another. another." x={130} y={250} desde={10} tam={60} />
      <Hud min={406} dia={5} estado="congelado" />
    </AbsoluteFill>
  );
};
// 278,8-280,6 · «No.» (empuje de cámara)
const No30b: React.FC = () => (
  <CuartoCalido claves={[mira(0, LX + 100, LEO_CARA_Y + 40, 3.4), mira(20, LX + 100, LEO_CARA_Y + 30, 4.0, { curva: "out" }), mira(54, LX + 100, LEO_CARA_Y + 30, 4.05)]} hud={<Hud min={406} dia={5} estado="congelado" />}>
    <LeoSentado luz={L_ORO_D} poses={[{ f: 0, v: SENT_CEL }, { f: 4, v: { ...SENT_CEL, cabeza: 4 } }]} caras={[{ f: 0, v: "determinado" }]} habla={[[0, 20]]} />
  </CuartoCalido>
);
// 280,6-284,8 · inserto cenital: la mano da vuelta el celular sobre el colchón; la luz se apaga
const BocaAbajo31b: React.FC = () => {
  const f = useF();
  const g = ent(f, 14, 30);
  const sy = Math.cos(g * Math.PI);
  const luz = 1 - SINGLE(f, 26, 34);
  const golpe = f >= 30 && f < 36 ? Math.sin((f - 30) * 1.5) * 5 : 0;
  return (
    <AbsoluteFill style={{ background: "#4a4f5c" }}>
      <svg {...svgP}>
        {Array.from({ length: 9 }).map((_, k) => <path key={k} d={`M0,${120 * k + 40} Q960,${120 * k + 80} 1920,${120 * k + 30}`} stroke="#3e4350" strokeWidth={22} fill="none" />)}
        <Halo x={1500} y={200} r={900} color={ORO} fuerza={0.35} />
        <Halo x={960} y={560} r={500} color="#7fb0ff" fuerza={0.35 * luz} />
        <g transform={`translate(960,${560 + golpe}) scale(1,${sy}) rotate(-12)`}>
          <rect x={-200} y={-360} width={400} height={720} rx={50} fill={sy >= 0 ? "#15171c" : "#2a2d34"} stroke="#5a5f68" strokeWidth={8} />
          {sy >= 0 ? <rect x={-170} y={-320} width={340} height={640} rx={24} fill="#3b6fb6" /> : <><circle cx={-110} cy={-270} r={30} fill="#15171c" /><circle cx={-110} cy={-270} r={14} fill="#3a3f48" /></>}
        </g>
        <g transform={`translate(${1180 - 120 * g},${700 - 80 * g})`}>
          <path d="M0,0 Q120,-60 300,-20 L520,120 L480,300 L120,240 Q-20,160 0,0 Z" fill="#ecc9a3" />
          <path d="M20,10 Q-60,-40 -90,30 Q-60,90 30,70" fill="#ecc9a3" />
        </g>
      </svg>
      <Hud min={406} dia={5} estado="congelado" />
    </AbsoluteFill>
  );
};
// 284,8-292,3 · silencio: «no train, no music» (se tachan), la nieve contra la ventana, el farol
const Silencio31b: React.FC = () => {
  const T = 284.8, f = useF(), L = (t: number) => fr(t, T);
  const VX = CTO_PUNTOS.ventana;
  return (
    <CuartoCalido claves={[mira(0, 1700, 620, 1.05), mira(L(289.0), 1900, 580, 1.15), mira(L(291.0), VX, 470, 1.9), mira(L(292.3), VX, 470, 2.0)]}
      hud={<>
        <Hud min={406} dia={5} estado="congelado" />
        <ManoLeo texto="no train." x={140} y={300} desde={L(288.0)} tam={66} />
        <ManoLeo texto="no music." x={140} y={390} desde={L(288.9)} tam={66} />
        <svg {...svgP}>
          <rect x={130} y={330} width={330 * SINGLE(f, L(288.6), L(289.0))} height={8} fill={ACENTO} />
          <rect x={130} y={420} width={330 * SINGLE(f, L(289.6), L(290.0))} height={8} fill={ACENTO} />
        </svg>
      </>}>
      <TelMesa x={LX + 150} y={P - AS + 2} bocaAbajo />
      <LeoSentado tel={false} luz={L_ORO_D} poses={[{ f: 0, v: SENT }, { f: L(287), v: { ...SENT, cabeza: -10 } }]} caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: { x: 1, y: -0.3 } }]} />
      <TenzoSentado />
      <Copos x={VX - 300} y={260} w={600} h={420} n={30} />
    </CuartoCalido>
  );
};
// 292,3-300,7 · el farol y su respiración; la sombra se sienta y se le apaga el borde, como un caballo que paró
const Sienta31b: React.FC = () => {
  const T = 292.3, f = useF(), L = (t: number) => fr(t, T);
  const op = interpolate(f, [L(297.0), L(298.4)], [0.9, 0.45], cl);
  return (
    <CuartoCalido claves={[mira(0, FX, P - 70, 2.8), mira(L(294.4), FX - 60, P - 120, 2.4), mira(L(294.9), MX - 20, 640, 1.7), mira(L(300.7), MX + 40, 660, 1.85)]} hud={<Hud min={406} dia={5} estado="congelado" />}>
      <g opacity={0.35 * SINGLE(f, L(298.6), L(299.4))}><Caballo x={MX - 360} piso={P - 6} fase={0.25} s={1.0} variante="mara" quieto /></g>
      <Actor look={MARA} escala={ESC * 0.9} seed={5} ruta={[{ f: 0, x: MX - 60, y: P - 34 }]} dir={[{ f: 0, v: 1 }]}
        asiento={[{ f: 0, v: undefined }, { f: L(297.0), v: 8, d: 40 }]} poses={[{ f: 0, v: { hD: 50, cD: 60, hI: 40, cI: 70 } }, { f: L(297.0), v: LOTO }]}
        caras={[{ f: 0, v: "duda" }, { f: L(296.6), v: "cansado" }]} opacidad={() => op} />
      <LeoSentado tel={false} luz={L_ORO_D} poses={[{ f: 0, v: SENT }, { f: L(293.4), v: { ...SENT, tronco: -4, cabeza: -10 } }]} caras={[{ f: 0, v: "neutral" }]} />
      <TelMesa x={LX + 150} y={P - AS + 2} bocaAbajo />
    </CuartoCalido>
  );
};
// 300,7-305 · «only in your head»: Tenzo se toca la sien
const Sien32: React.FC = () => {
  const T = 300.7, L = (t: number) => fr(t, T);
  return (
    <PPTenzo dur={129} tenzo={{ poses: [{ f: 0, v: HABLA_A }, { f: L(303.3), v: HABLA_B }, { f: L(304.3), v: { ...LOTO, hD: 150, cD: 150, cabeza: -6 } }], caras: [{ f: 0, v: "feliz" }], habla: [[0, 125]] }}
      hud={<><Hud min={406} dia={5} /><ManoLeo texto="say the word." x={140} y={250} desde={L(303.3)} tam={64} /></>} />
  );
};
// 305-315,5 · el diagrama se arma en vivo y un Leo chiquito lo recorre (rama roja con el caballo)
const Diagrama32b: React.FC<{ o?: number }> = ({ o: off = 0 }) => {
  const T = 305.0, f = useF() + off, L = (t: number) => fr(t, T);
  const o = (a: number) => SINGLE(f, a, a + 10);
  const Caja: React.FC<{ x: number; y: number; w: number; t: string; a: number; c?: string }> = ({ x, y, w, t, a, c = "#2a2622" }) => (
    <g opacity={o(a)} transform={`translate(${x},${y}) scale(${0.85 + 0.15 * o(a)}) translate(${-x},${-y})`}>
      <rect x={x - w / 2} y={y - 56} width={w} height={112} rx={20} fill="#fbf6ea" stroke={c} strokeWidth={6} />
      <text x={x} y={y + 18} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={52} fill={c}>{t}</text>
    </g>
  );
  const Flecha: React.FC<{ x1: number; y1: number; x2: number; y2: number; a: number }> = ({ x1, y1, x2, y2, a }) => {
    const k = SINGLE(f, a, a + 12);
    return <path d={`M${x1},${y1} L${x1 + (x2 - x1) * k},${y1 + (y2 - y1) * k}`} stroke="#2a2622" strokeWidth={6} fill="none" strokeLinecap="round" />;
  };
  // el recorrido del Leo chiquito: STOP → pregunta → (sabe) go → vuelve → (pregunta al caballo) put it down
  const ruta = [{ f: L(305.6), x: 890, y: 180 }, { f: L(307.2), x: 1420, y: 180 }, { f: L(309.6), x: 820, y: 490 }, { f: L(310.8), x: 1420, y: 180 }, { f: L(312.4), x: 1360, y: 530 }];
  const pos = (() => { let p = ruta[0]; for (let i = 1; i < ruta.length; i++) { if (f >= ruta[i].f) { p = ruta[i]; continue; } const a = ruta[i - 1], b = ruta[i]; const k = ent(f, a.f + (b.f - a.f) * 0.4, b.f); return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k }; } return p; })();
  return (
    <AbsoluteFill style={{ background: "#3e3226" }}>
      <svg {...svgP}>
        <Halo x={1400} y={200} r={900} color="#e9e4d8" fuerza={0.25} />
        <Hoja x={960} y={560} w={1500} h={820} rot={-1}>
          <Caja x={420} y={250} w={340} t="pick it up" a={0} c="#5a4e42" />
          <Flecha x1={600} y1={250} x2={740} y2={250} a={L(305.4)} />
          <Caja x={890} y={250} w={240} t="STOP." a={L(305.6)} c={ACENTO} />
          <Flecha x1={1020} y1={250} x2={1160} y2={250} a={L(306.6)} />
          <Caja x={1420} y={250} w={480} t="where am i going?" a={L(307.4)} />
          <Flecha x1={1330} y1={320} x2={940} y2={494} a={L(308.8)} />
          <Caja x={820} y={560} w={300} t="i know → go" a={L(309.6)} c="#3f7a4a" />
          <Flecha x1={1440} y1={320} x2={1400} y2={534} a={L(311.4)} />
          <Caja x={1360} y={600} w={600} t="ask the horse → put it down" a={L(312.2)} c="#8a3a2a" />
          {f >= L(312.6) && <g opacity={o(L(312.6))}><Caballo x={1360} piso={860} fase={(f % 14) / 14} s={0.7} variante="mara" neon="#8a3a2a" /></g>}
        </Hoja>
        {f >= L(305.6) && <g transform={`translate(${pos.x + 30},${pos.y + 60})`}><MiniLeo x={0} y={0} s={0.55} /></g>}
      </svg>
      <Hud min={406} dia={5} />
    </AbsoluteFill>
  );
};
// 315,5-316,6 · «And if I forget?» (contraplano de Leo)
const SiOlvido32: React.FC = () => (
  <SobreLeo dur={33} leo={{ poses: [{ f: 0, v: { ...SENT, hD: 60, cD: 40, cabeza: 6 } }], caras: [{ f: 0, v: "duda" }], habla: [[0, 30]] }} hud={<><Hud min={406} dia={5} /><ManoLeo texto="and if i forget?" x={140} y={250} desde={2} tam={66} /></>} />
);
// 316,6-322 · «you will forget many times a day… every time you remember, that is the practice»: las rayitas suman
const Olvida32b: React.FC = () => {
  const f = useF();
  return (
    <SobreTenzo dur={162} z={2.5} tenzo={{ poses: [...alterna(HABLA_A, HABLA_B, 0, 100, 20), { f: 100, v: { ...LOTO, hD: 150, cD: 30 } }], caras: [{ f: 0, v: "risa" }, { f: 50, v: "feliz" }], habla: [[0, 156]] }}
      hud={<>
        <Hud min={406} dia={5} />
        <ManoLeo texto="every time you remember:" x={110} y={250} desde={80} tam={56} />
        <div style={{ position: "absolute", left: 120, top: 260 }}><Rayitas2 n={Math.floor(interpolate(f, [86, 150], [0, 12], cl))} /></div>
      </>} />
  );
};
// 322-327,2 · los monjes de Shōun-ji cabecean y se despiertan en cadena · FORGOT: 10,000
const Monjes33b: React.FC = () => {
  const f = useF();
  const JP = JAPON_PISO + 60;
  return (
    <Escena Set={PortonMonasterio} pal={PAL_ANT} setProps={{ hora: 0.5 }} claves={[mira(0, 1600, 650, 0.95), mira(156, 1650, 660, 1.08)]}
      medio={<>
        {[0, 1, 2, 3, 4].map((k) => {
          const c = (f - 8 - k * 14) % 70;
          const dormido = f > 8 + k * 14 && c < 30;
          const salto = c >= 30 && c < 36;
          return <Actor key={k} look={MONJE_SHOUNJI} escala={1.05} seed={30 + k} luz={L_ANT} ruta={[{ f: 0, x: 1180 + k * 210, y: JP }]} asiento={[{ f: 0, v: 8 }]} dir={[{ f: 0, v: 1 }]}
            poses={[{ f: 0, v: dormido ? { ...LOTO, cabeza: 34, tronco: 12 } : salto ? { ...LOTO, cabeza: -10, tronco: -8, hD: 60, cD: 30 } : LOTO }]} caras={[{ f: 0, v: dormido ? "cansado" : salto ? "sorpresa" : "neutral" }]} />;
        })}
      </>}
      hud={<GranNumero rotulo="TIMES THEY FORGOT" claves={[{ f: 0, v: 0 }, { f: 20, v: 10000, d: 50 }]} y={110} color="#3a2a1a" tam={120} />} />
  );
};
// 327,2-329,6 · se para despacio, apoyando la mano · 329,6-331,8 · las rodillas: «crack»
const Parado34b: React.FC = () => {
  const T = 327.2, L = (t: number) => fr(t, T);
  return (
    <CuartoCalido claves={[mira(0, TX - 40, P - 60, 2.2), mira(L(329.6), TX - 40, P - 200, 2.3)]} hud={<Hud min={406} dia={5} />}>
      <TelMesa x={LX + 150} y={P - AS + 2} bocaAbajo />
      <Actor look={TENZO} escala={ESC} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 8 }, { f: L(328.4), v: 8 }, { f: L(329.4), v: undefined, d: 50 }]}
        poses={[{ f: 0, v: LOTO }, { f: L(327.8), v: { ...LOTO, tronco: 30, hD: 70, cD: 10, hI: 60, cI: 20 } }, { f: L(329.4), v: { tronco: 20, hD: 40, cD: 60, hI: 30, cI: 50, pI: 20, rI: 30, pD: 30, rD: 40 } }]} caras={[{ f: 0, v: "feliz" }, { f: L(328), v: "cansado" }]} />
    </CuartoCalido>
  );
};
const Rodillas34: React.FC = () => {
  const f = useF();
  return (
    <CuartoCalido claves={[mira(0, TX - 20, P - 120, 3.2), mira(66, TX - 20, P - 130, 3.3)]} hud={<><Hud min={406} dia={5} /><ManoLeo texto="crack." x={1180} y={360} desde={4} tam={110} /><ManoLeo texto="crack." x={600} y={520} desde={18} tam={90} /></>}>
      <Actor look={TENZO} escala={ESC} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: undefined }]}
        poses={[{ f: 0, v: { tronco: 20, hD: 40, cD: 60, hI: 30, cI: 50, pI: 20, rI: 30, pD: 30, rD: 40 } }, { f: 30, v: { tronco: 6, hD: 20, cD: 40, hI: 20, cI: 40, pI: 6, rI: 8, pD: 8, rD: 10 } }]} caras={[{ f: 0, v: "cansado" }]} />
      {f >= 4 && f < 16 && <circle cx={TX - 30} cy={P - 150} r={20 + (f - 4) * 6} fill="none" stroke="#f4efe6" strokeWidth={5} opacity={1 - (f - 4) / 12} />}
      {f >= 18 && f < 30 && <circle cx={TX + 10} cy={P - 140} r={20 + (f - 18) * 6} fill="none" stroke="#f4efe6" strokeWidth={5} opacity={1 - (f - 18) / 12} />}
    </CuartoCalido>
  );
};
// 331,8-335,2 · «why do you even care? you don't know me» (Leo, desde abajo)
const Porque35b: React.FC = () => (
  <PPLeo dur={102} z={3.0} dy={-10} leo={{ poses: [{ f: 0, v: { ...SENT, cabeza: -14, hD: 70, cD: 40 } }, { f: 50, v: { ...SENT, cabeza: -14, hD: 90, cD: 20 } }], caras: [{ f: 0, v: "duda" }, { f: 60, v: "triste" }], habla: [[0, 100]], miradas: [{ f: 0, v: { x: 1, y: -0.9 } }] }}
    hud={<><Hud min={406} dia={5} /><ManoLeo texto="why do you even care?" x={1000} y={170} desde={6} tam={62} /></>} />
);
// 335,2-342 · los ojos de Tenzo: un recuerdo (el caballo) le cruza la cara y se va
const Cruza35b: React.FC = () => {
  const T = 335.2, f = useF(), L = (t: number) => fr(t, T);
  const fl = SINGLE(f, L(337.5), L(337.9)) * (1 - SINGLE(f, L(338.6), L(339.3)));
  return (
    <CuartoCalido claves={[mira(0, TX - 20, P - 285, 2.9), mira(L(342), TX - 20, P - 290, 3.2, { curva: "in" })]}
      hud={<><Hud min={406} dia={5} />{fl > 0 && <svg {...svgP} style={{ position: "absolute", left: 0, top: 0, opacity: fl }}><Caballo x={760} piso={900} fase={0.4} s={1.6} variante="mara" neon={ORO} /></svg>}</>}>
      <TenzoParado caras={[{ f: 0, v: "neutral" }, { f: L(337.6), v: "triste" }, { f: L(339.4), v: "neutral" }]} poses={[{ f: 0, v: { hD: 10, cD: 20, hI: 10, cI: 20 } }, { f: L(337.6), v: { hD: 10, cD: 20, hI: 10, cI: 20, cabeza: 12 } }, { f: L(339.6), v: { hD: 10, cD: 20, hI: 10, cI: 20 } }]} />
    </CuartoCalido>
  );
};
// 346,6-350,4 · levanta el farol: la luz se va del cuarto y Leo queda en penumbra
const SeVa36b: React.FC = () => {
  const T = 346.6, f = useF(), L = (t: number) => fr(t, T);
  const conFarol = f >= L(347.6);
  const x = interpolate(f, [L(348.0), L(350.4)], [TX, 1050], cl);
  const sube = ent(f, L(347.0), L(347.6));
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, FX + 40, P - 160, 2.2), mira(L(347.8), FX + 20, P - 260, 2.0), mira(L(350.4), 1250, 640, 1.5)]}
      detras={<>{oscuro}{f > L(348.6) && oscuro}<Tibio k={1 - 0.6 * ent(f, L(348), L(350.4))} x={conFarol ? x - 30 : FX} y={P - 60 - 200 * sube} /></>}
      medio={<>
        <TelMesa x={LX + 150} y={P - AS + 2} bocaAbajo />
        <LeoSentado tel={false} luz={{ lado: 1, color: ORO, fuerza: 0.7 * (1 - ent(f, L(348.4), L(350.4))) }} poses={[{ f: 0, v: SENT }]} caras={[{ f: 0, v: "neutral" }, { f: L(349), v: "triste" }]} />
        <Actor look={TENZO} escala={ESC} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: TX, y: P }, { f: L(348.0), x: TX, y: P }, { f: L(350.4), x: 1050, y: P }]}
          poses={[{ f: 0, v: { hD: 10, cD: 20 } }, { f: L(346.9), v: { tronco: 40, hD: 70, cD: 10, hI: 20, cI: 30, pI: 30, rI: 50, pD: 40, rD: 60 } }, { f: L(347.7), v: FAROL }]}
          dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }]} habla={[[L(348.3), L(350.3)]]} enManoD={conFarol ? <FarolMano /> : undefined} />
        {!conFarol && <FarolPiso />}
      </>}
      hud={<Hud min={406} dia={5} />} />
  );
};
// 350,4-358,3 · DAY 6: Leo marca rayitas en la pared, como un preso (41)
const Pared37: React.FC = () => {
  const T = 350.4, f = useF(), L = (t: number) => fr(t, T);
  const n = interpolate(f, [L(352.4), L(357.6)], [0, 41], cl);
  const WX = CTO_PUNTOS.cajon - 120;
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, WX + 280, 640, 2.0), mira(L(358.3), WX + 260, 630, 2.2)]}
      detras={<><Alba t={0.6} /><Rayitas n={n} x={WX + 60} y={540} color="#1c1e24" alto={46} paso={13} porFila={20} />{n >= 41 && <text x={WX + 370} y={600} fontFamily={F_MANO} fontWeight={700} fontSize={70} fill="#1c1e24">41</text>}</>}
      medio={<Actor look={LEO3} escala={ESC} seed={1} luz={L_FRIO} ruta={[{ f: 0, x: WX + 470, y: P }]} dir={[{ f: 0, v: -1 }]}
        poses={[{ f: 0, v: { hD: 20, cD: 40 } }, ...alterna({ hD: 120, cD: 40, cabeza: -8 }, { hD: 105, cD: 55, cabeza: -6 }, L(352.4), L(357.6), 4), { f: L(357.6), v: { hD: 20, cD: 40 } }]} caras={[{ f: 0, v: "determinado" }]} miradas={[{ f: 0, v: { x: -1, y: -0.4 } }]} />}
      hud={<><Hud min={406} dia={6} /><div style={{ position: "absolute", left: 120, top: 150, fontFamily: F_HUD, fontWeight: 600, fontSize: 70, letterSpacing: 6, color: "#f4efe6" }}>DAY 6</div><ManoLeo texto="like a prisoner." x={1120} y={870} desde={L(355.8)} tam={60} /></>} />
  );
};
// 358,3-364,4 · DAY 7: 33 · y el contador baja a 3 h 50 m
const Dia7: React.FC = () => {
  const T = 358.3, f = useF(), L = (t: number) => fr(t, T);
  const n7 = interpolate(f, [L(359.4), L(360.6)], [0, 33], cl);
  return (
    <AbsoluteFill style={{ background: "#3e3226" }}>
      <svg {...svgP}>
        <Halo x={1500} y={150} r={900} color="#e9e4d8" fuerza={0.25} />
        <Hoja x={960} y={440} w={1120} h={440} rot={-2}>
          <text x={420} y={300} fontFamily={F_MANO} fontSize={58} fontWeight={700} fill="#2a2622">day 7</text>
          <Rayitas n={n7} x={520} y={330} color="#2a2622" alto={50} paso={13} />
          {n7 >= 33 && <text x={1300} y={380} fontFamily={F_MANO} fontSize={66} fontWeight={700} fill="#2a2622">33</text>}
        </Hoja>
      </svg>
      <GranNumero rotulo="SCREEN TIME" claves={[{ f: L(361.0), v: 406 }, { f: L(362.2), v: 230, d: 40 }]} desde={L(361.0)} y={760} color={ACENTO} tam={110} sufijo=" min" />
      <Hud min={f < L(362.2) ? 406 : 230} dia={7} estado={f >= L(362.2) ? "normal" : "congelado"} />
    </AbsoluteFill>
  );
};
// la parada sin Maya (llega en «a girl»)
const ParadaSola: React.FC<{ claves: ReturnType<typeof mira>[]; leoCara?: { f: number; v: string }[]; leoPose?: Partial<Pose>; miradas?: { f: number; v: { x: number; y: number } }[]; hud?: React.ReactNode }> = ({ claves, leoCara = [{ f: 0, v: "neutral" }], leoPose = { hD: 20, cD: -40, hI: -20, cI: -40 }, miradas = [{ f: 0, v: { x: 1, y: 0 } }], hud }) => (
  <Escena Set={Broadway} pal={PAL_DIA} setProps={{ hora: "dia", nieve: true }} claves={claves}
    medio={<Actor look={LEO3} escala={ESC} seed={1} luz={L_DIA} ruta={[{ f: 0, x: LEO_PARADA, y: BP }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: leoPose }]} caras={leoCara} miradas={miradas} />}
    hud={<>{hud}<Hud min={230} dia={7} /></>} />
);
// 364,4-368,8 · la parada del 36 en Broadway, de mañana
const Parada38b: React.FC = () => (
  <ParadaSola claves={[mira(0, BWY_PUNTOS.parada36 - 200, 620, 0.95), mira(132, BWY_PUNTOS.parada36 - 160, 620, 1.02)]} leoCara={[{ f: 0, v: "cansado" }]}
    hud={<div style={{ position: "absolute", left: 120, top: 150, fontFamily: F_HUD, fontWeight: 600, fontSize: 56, letterSpacing: 6, color: "#2a2f38" }}>36 · BROADWAY · DAY 7</div>} />
);
// 368,8-372,2 · las manos vacías: «without his phone in his hand»
const Manos38: React.FC = () => {
  const f = useF();
  return (
    <ParadaSola claves={[mira(0, LEO_PARADA + 20, BP - 200, 3.0), mira(102, LEO_PARADA + 20, BP - 210, 3.15)]} leoPose={{ hD: 30, cD: 60, hI: 20, cI: 50 }} leoCara={[{ f: 0, v: "neutral" }]}
      hud={<><ManoLeo texto="no phone." x={1180} y={220} desde={8} tam={80} /><div style={{ position: "absolute", left: 1160, top: 330, padding: "10px 22px", background: "rgba(14,16,22,.82)", borderRadius: 12, fontFamily: F_HUD, fontWeight: 600, fontSize: 52, letterSpacing: 4, color: ACENTO }}>FIRST TIME IN 10 YEARS</div>{f < 0 && null}</>} />
  );
};
// 372,2-376,4 · levanta la vista: algo que se perdió cada mañana durante dos años
const Nota38: React.FC = () => (
  <ParadaSola claves={[mira(0, LEO_PARADA + 120, BP - 300, 2.6), mira(126, LEO_PARADA + 140, BP - 300, 2.75)]} leoCara={[{ f: 0, v: "neutral" }, { f: 30, v: "sorpresa" }]}
    miradas={[{ f: 0, v: { x: 0.3, y: 0.8 } }, { f: 10, v: { x: 1, y: 0 } }]} hud={<ManoLeo texto="every single morning." x={1080} y={180} desde={50} tam={60} />} />
);
// 376,4-384,5 · Maya en insertos: bufanda verde · ambo · libro de papel · la esquina doblada
const Maya38b: React.FC<{ o?: number }> = ({ o = 0 }) => {
  const T = 376.4, f = useF() + o, L = (t: number) => fr(t, T);
  const dob = f >= L(382.0);
  if (dob) {
    const k = ent(f, L(382.4), L(383.2));
    return (
      <AbsoluteFill style={{ background: "#e9e6e0" }}>
        <svg {...svgP}>
          <rect x={260} y={140} width={1400} height={820} rx={10} fill="#fbf6ea" />
          <path d="M960,140 L960,960" stroke="#d8d0c0" strokeWidth={6} />
          {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={340 + (i % 2 ? 0 : 0)} y={230 + i * 58} width={520} height={14} rx={7} fill="#c9c0ae" />)}
          {Array.from({ length: 12 }).map((_, i) => <rect key={`d${i}`} x={1040} y={230 + i * 58} width={i === 11 ? 300 : 520} height={14} rx={7} fill="#c9c0ae" />)}
          <path d={`M1660,140 L${1660 - 220 * k},140 L1660,${140 + 220 * k} Z`} fill="#e3dccb" />
          <path d={`M${1660 - 220 * k},140 L${1660 - 220 * k},${140 + 220 * k} L1660,${140 + 220 * k} Z`} fill="#fbf6ea" stroke="#c9c0ae" strokeWidth={3} />
        </svg>
        <ManoLeo texto="the corner folded down." x={300} y={990} desde={L(382.4)} tam={56} />
      </AbsoluteFill>
    );
  }
  return (
    <Escena Set={Broadway} pal={PAL_DIA} setProps={{ hora: "dia", nieve: true }}
      claves={[mira(0, MAYA_X - 20, BP - 290, 1.6), mira(L(377.2), MAYA_X - 10, BP - 300, 2.0), mira(L(377.4), MAYA_X - 10, BP - 250, 3.6), mira(L(378.4), MAYA_X - 10, BP - 250, 3.7), mira(L(378.5), MAYA_X - 10, BP - 170, 3.4), mira(L(380.2), MAYA_X - 10, BP - 170, 3.5), mira(L(380.3), MAYA_X + 60, BP - 190, 3.6), mira(L(382), MAYA_X + 60, BP - 190, 3.7)]}
      medio={<Actor look={MAYA} escala={ESC * 0.95} seed={8} luz={L_DIA} ruta={[{ f: 0, x: MAYA_X, y: BP }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 50, cD: 100, hI: 50, cI: 100, cabeza: 22 } }]} caras={[{ f: 0, v: "neutral" }]} enManoD={<Libro abierto color="#2e5a8a" />} />}
      hud={<>
        <Hud min={230} dia={7} />
        <ManoLeo texto="a girl." x={140} y={250} desde={0} hasta={L(377.2)} tam={70} />
        <ManoLeo texto="green scarf." x={140} y={250} desde={L(377.4)} hasta={L(378.4)} tam={70} />
        <ManoLeo texto="nursing scrubs." x={140} y={250} desde={L(378.5)} hasta={L(380.2)} tam={70} />
        <ManoLeo texto="a real paper book." x={140} y={250} desde={L(380.3)} tam={70} />
      </>} />
  );
};
// 384,5-386,9 · ella levanta la vista y sonríe (primer plano) · 386,9-388,2 · Leo se pone colorado
const Sonrie39b: React.FC = () => (
  <Escena Set={Broadway} pal={PAL_DIA} setProps={{ hora: "dia", nieve: true }} claves={[mira(0, MAYA_X - 60, BP - 300, 3.0), mira(72, MAYA_X - 60, BP - 300, 3.15)]}
    medio={<Actor look={MAYA} escala={ESC * 0.95} seed={8} luz={L_DIA} ruta={[{ f: 0, x: MAYA_X, y: BP }]} dir={[{ f: 0, v: -1 }]}
      poses={[{ f: 0, v: { hD: 50, cD: 100, hI: 50, cI: 100, cabeza: 22 } }, { f: 8, v: { hD: 40, cD: 90, hI: 40, cI: 90, cabeza: -2 } }]} caras={[{ f: 0, v: "neutral" }, { f: 12, v: "sorpresa" }, { f: 40, v: "feliz" }]} enManoD={<Libro abierto color="#2e5a8a" />} />}
    hud={<Hud min={230} dia={7} />} />
);
const Colorado39: React.FC = () => {
  const f = useF();
  return (
    <ParadaSola claves={[mira(0, LEO_PARADA + 90, BP - 300, 3.0), mira(39, LEO_PARADA + 90, BP - 300, 3.1)]} leoCara={[{ f: 0, v: "sorpresa" }, { f: 12, v: "feliz" }]}
      hud={<svg {...svgP} style={{ position: "absolute", left: 0, top: 0, opacity: SINGLE(f, 6, 18) }}><Halo x={830} y={560} r={130} color="#ff6a7a" fuerza={0.5} /></svg>} />
  );
};
// 388,2-392,5 · detrás del hombro de Leo, la sombra se despierta y se relame
const Relame40b: React.FC = () => {
  const T = 388.2, f = useF(), L = (t: number) => fr(t, T);
  return (
    <Escena Set={Broadway} pal={PAL_DIA} setProps={{ hora: "dia", nieve: true }} claves={[mira(0, LEO_PARADA - 120, BP - 330, 2.0), mira(L(390.2), LEO_PARADA - 160, BP - 440, 2.4), mira(L(392.5), LEO_PARADA - 170, BP - 450, 2.6)]}
      medio={<>
        <Actor look={MARA} escala={ESC * 1.2} seed={5} ruta={[{ f: 0, x: LEO_PARADA - 210, y: BP - 10 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 50, cD: 60, hI: 40, cI: 70, cabeza: 18 } }, { f: L(390.3), v: { hD: 60, cD: 50, hI: 50, cI: 60, cabeza: -4, tronco: -6 } }]}
          caras={[{ f: 0, v: "cansado" }, { f: L(390.3), v: "sorpresa" }, { f: L(391.0), v: "picaro" }]} opacidad={() => 0.92} />
        <Actor look={LEO3} escala={ESC} seed={1} luz={L_DIA} ruta={[{ f: 0, x: LEO_PARADA, y: BP }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 20, cD: -40, hI: -20, cI: -40 } }]} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} />
      </>}
      hud={<><Hud min={230} dia={7} /><ManoMara texto="mmm." x={1240} y={200} desde={L(391.3)} tam={90} /></>} />
  );
};
// 392,5-398,7 · CTA: Leo mira a cámara · «When was the last time you said stop?» · «tell me what you felt ↓»
const Cierre41b: React.FC = () => {
  const T = 392.5, L = (t: number) => fr(t, T);
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX + 30, LEO_CARA_Y + 70, 2.6), mira(L(398.7), LX + 30, LEO_CARA_Y + 70, 2.8, { curva: "in" })]}
      detras={<Alba t={1} />}
      medio={<><TelMesa x={LX + 150} y={P - AS + 2} bocaAbajo /><LeoSentado tel={false} luz={L_ORO_D} poses={[{ f: 0, v: SENT }]} caras={[{ f: 0, v: "neutral" }, { f: L(395.5), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0, y: 0 } }]} /></>}
      hud={<>
        <Frase texto="When was the last time you said stop?" desde={L(392.7)} hasta={L(395.4)} y={130} tam={62} />
        <Frase texto="Try it once today." desde={L(395.5)} y={130} tam={62} />
        <ManoLeo texto="tell me what you felt ↓" x={1060} y={880} desde={L(396.9)} tam={64} />
      </>} />
  );
};
// 398,7-404,2 · el gancho del día 8: dos monjes, un río y una mujer (el mayor la carga)
const Gancho41b: React.FC = () => {
  const f = useF();
  const s = (a: number) => interpolate(f, [a, a + 8], [1.3, 1], cl);
  return (
    <AbsoluteFill>
      <Escena Set={RioCrecido} pal={PAL_ANT} claves={[mira(0, RIO.orillaI + 300, 640, 0.95), mira(165, RIO.orillaI + 420, 640, 1.02)]}
        medio={<>
          <Actor look={MONJE_SHOUNJI} escala={1.05} seed={40} luz={L_ANT} ruta={[{ f: 0, x: RIO.orillaI + 200, y: RIO.sup + 20 }, { f: 165, x: RIO.orillaI + 520, y: RIO.sup + 20 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 120, cD: 60, hI: 110, cI: 70, tronco: 8 } }]} caras={[{ f: 0, v: "determinado" }]} />
          <g transform={`translate(${interpolate(f, [0, 165], [RIO.orillaI + 200, RIO.orillaI + 520])},${RIO.sup - 210}) rotate(-80)`}>
            <Actor look={MAYA} escala={0.95} seed={41} ruta={[{ f: 0, x: 0, y: 0 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 60, cD: 40, hI: 40, cI: 40, pI: 10, pD: 14 } }]} caras={[{ f: 0, v: "sorpresa" }]} />
          </g>
          <Actor look={MONJE_SHOUNJI} escala={1.0} seed={42} luz={L_ANT} ruta={[{ f: 0, x: RIO.orillaI - 140, y: JAPON_PISO }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 10, cD: 20, hI: 10, cI: 20 } }]} caras={[{ f: 0, v: "sorpresa" }]} />
        </>} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 64, letterSpacing: 8, color: "#f4efe6", textShadow: "0 4px 16px rgba(0,0,0,.6)", opacity: SINGLE(f, 6, 10), transform: `scale(${s(6)})` }}>DAY 8 · TOMORROW NIGHT</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 84, color: ORO, textShadow: "0 4px 16px rgba(0,0,0,.6)", opacity: SINGLE(f, 40, 44), transform: `scale(${s(40)})` }}>Two Monks, a River and a Woman</div>
    </AbsoluteFill>
  );
};
// 404,2-409,2 · la tarjeta final y el negro
const Gancho41c: React.FC = () => {
  const f = useF();
  return (
    <AbsoluteFill>
      <TarjetaFinal proximo="Two Monks, a River and a Woman" frase="lust is not love · Day 8" />
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [100, 150], [0, 1], cl) }} />
    </AbsoluteFill>
  );
};

// ===================== VUELTA OJO 3 (26-oct) =====================
// 5,7-10 · «the sky over Lake Michigan was turning gray»: la ventana grande pasa de noche a gris; Leo levanta la cabeza
const mezcla = (a: string, b: string, k: number) => { const h = (c: string, i: number) => parseInt(c.slice(1 + i * 2, 3 + i * 2), 16); return "#" + [0, 1, 2].map((i) => Math.round(h(a, i) + (h(b, i) - h(a, i)) * k).toString(16).padStart(2, "0")).join(""); };
const Alba1b: React.FC = () => {
  const T = 5.7, f = useF(), L = (t: number) => fr(t, T);
  const k = ent(f, L(6.4), L(9.6));
  const reloj = interpolate(f, [0, L(9.6)], [140, 371], cl);
  return (
    <AbsoluteFill>
      <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX + 300, LEO_CARA_Y + 60, 2.3), mira(L(10), LX + 320, LEO_CARA_Y + 50, 2.45, { curva: "in" })]}
        detras={oscuro}
        medio={<LeoSentado poses={[{ f: 0, v: SENT_CEL }, { f: L(7.2), v: { ...SENT_CEL, cabeza: -16, cD: 100 } }]} caras={[{ f: 0, v: "cansado" }, { f: L(7.4), v: "sorpresa" }, { f: L(8.9), v: "triste" }]}
          miradas={[{ f: 0, v: { x: 0.4, y: 0.8 } }, { f: L(7.2), v: { x: 1, y: -0.5 } }]} luz={{ lado: 1, color: mezcla("#3a5a9a", "#c9ccd2", k), fuerza: 0.6 + 0.3 * k }} />}
        hud={<>
          <svg {...svgP}>
            <rect x={820} y={90} width={1000} height={720} rx={8} fill="#15161b" />
            <defs><linearGradient id="cieloA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={mezcla("#0b1430", "#8d96a3", k)} /><stop offset="1" stopColor={mezcla("#1c2a52", "#d6cfc4", k)} /></linearGradient></defs>
            <rect x={850} y={120} width={940} height={660} fill="url(#cieloA)" />
            <rect x={850} y={560} width={940} height={220} fill={mezcla("#0a1224", "#7d8794", k)} />
            {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={900 + i * 150} y={590 + (i % 3) * 40} width={90 + (i % 2) * 40} height={4} rx={2} fill="#e9eef4" opacity={0.25 * k} />)}
            <path d="M850,560 L900,520 L960,540 L1020,470 L1090,500 L1150,430 L1230,480 L1300,450 L1380,520 L1470,490 L1560,530 L1640,470 L1720,520 L1790,500 L1790,560 Z" fill={mezcla("#06080f", "#4a4f58", k)} />
            <rect x={1310} y={120} width={14} height={660} fill="#15161b" /><rect x={850} y={440} width={940} height={14} fill="#15161b" />
          </svg>
          <ManoLeo texto="lake michigan. gray." x={900} y={860} desde={L(8.2)} tam={60} />
          <RelojDia min={reloj} x={1580} y={60} />
        </>} />
    </AbsoluteFill>
  );
};
// 13,1-15,8 · la burbuja en el aire libre, la cola hacia la cabeza
const Cara2c: React.FC = () => {
  const f = useF();
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, LX + 250, LEO_CARA_Y + 40, 2.5), mira(81, LX + 250, LEO_CARA_Y + 40, 2.65)]}
      detras={<Alba t={1} />}
      medio={<LeoSentado tel={false} poses={[{ f: 0, v: { ...SENT, cabeza: -10 } }, { f: 40, v: { ...SENT, cabeza: -10, hD: 30, cD: 150 } }, { f: 60, v: { ...SENT, cabeza: -6, hD: 40, cD: 160 } }]} caras={[{ f: 0, v: "cansado" }, { f: 40, v: "duda" }]} miradas={[{ f: 0, v: { x: 0.8, y: -0.8 } }]} luz={L_FRIO} />}
      hud={<><RelojDia min={371} x={1580} y={60} /><Burbuja x={1360} y={360} f={f} /></>} />
  );
};
// 83,4-92 · el inventario con luz de calle: la cámara se para en cada cosa, rótulos enteros y lejos del HUD
const Cuarto12c: React.FC = () => {
  const T = 83.4, L = (t: number) => fr(t, T);
  return (
    <Escena Set={Cuarto} pal={PAL} setProps={{ luzPuerta: 1 }}
      claves={[mira(0, 1200, 640, 1.15), mira(L(84.9), 1220, 650, 1.2), mira(L(85.4), CTO_PUNTOS.colchon, 800, 1.9), mira(L(86.3), CTO_PUNTOS.colchon - 20, 800, 1.95), mira(L(86.7), CTO_PUNTOS.cajas, 790, 2.0), mira(L(87.7), CTO_PUNTOS.cajas + 20, 790, 2.05), mira(L(88.1), CTO_PUNTOS.bolso, 760, 2.0), mira(L(89.0), CTO_PUNTOS.bolso - 20, 760, 2.05), mira(L(89.5), CTO_PUNTOS.dibujos, 560, 1.6), mira(L(92), CTO_PUNTOS.dibujos + 30, 560, 1.7)]}
      detras={<><Tibio k={0.9} x={200} y={P - 120} /><Halo x={CTO_PUNTOS.ventana} y={420} r={900} color="#9fb4d8" fuerza={0.3} /></>}
      medio={<LeoSentado caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: { x: -1, y: 0.4 } }]} luz={L_FRIO} />}
      hud={<>
        <Hud min={390} dia={5} />
        <ManoLeo texto="a mattress." x={200} y={300} desde={L(85.1)} hasta={L(86.4)} tam={72} />
        <ManoLeo texto="pizza boxes." x={200} y={300} desde={L(86.7)} hasta={L(87.9)} tam={72} />
        <ManoLeo texto="the delivery bag." x={200} y={300} desde={L(88.1)} hasta={L(89.3)} tam={72} />
        <ManoLeo texto="drawings he never finished." x={220} y={820} desde={L(89.8)} tam={64} />
      </>} />
  );
};
// 106,5-111 · tres noches, el mismo gesto a la vez (el pulgar baja sincronizado)
const Mismo14b: React.FC = () => {
  const f = useF();
  return (
    <Escena Set={Cuarto} pal={PAL} claves={[mira(0, 1240, 660, 1.35), mira(135, 1240, 660, 1.45)]}
      detras={oscuro}
      medio={<>{[-380, 0, 380].map((dx, i) => (
        <g key={i} opacity={SINGLE(f, i * 10, i * 10 + 8)}>
          <Actor look={LEO3} escala={ESC} seed={1} luz={L_TEL} ruta={[{ f: 0, x: LX + dx, y: P }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: AS }]} poses={alterna(SENT_CEL, { ...SENT_CEL, cD: 140, cabeza: 26 }, 0, 135, 9)} caras={[{ f: 0, v: "cansado" }]} enManoD={<Tel />} />
          <Halo x={LX + dx + 60} y={LEO_CARA_Y} r={170} color="#7fb0ff" fuerza={0.4} />
        </g>
      ))}</>}
      hud={<>
        <Hud min={390} dia={5} />
        {["night 5", "night 6", "night 7"].map((t, i) => <ManoLeo key={i} texto={t} x={420 + i * 500} y={880} desde={i * 10} tam={54} />)}
        <ManoLeo texto="always the same." x={1180} y={250} desde={60} tam={70} />
      </>} />
  );
};
// 113,1-118,7 · el farol titila y el cuarto se disuelve en el camino (sin HUD durante el portal)
const Farol15c: React.FC = () => {
  const T = 113.1, f = useF(), L = (t: number) => fr(t, T);
  const r = interpolate(f, [L(115.6), L(118.4)], [0, 1300], { ...cl, easing: Easing.in(Easing.cubic) });
  const tit = f > L(114.6) && f < L(115.6) ? 0.6 + 0.4 * Math.abs(Math.sin(f * 1.7)) : 1;
  return (
    <AbsoluteFill>
      <CuartoCalido claves={[mira(0, LX + 200, LEO_CARA_Y + 120, 2.0), mira(L(114.4), LX + 220, LEO_CARA_Y + 140, 2.1), mira(L(115.4), FX, P - 140, 2.6), mira(L(118.7), FX, P - 140, 2.8)]} hud={r > 0 ? undefined : <Hud min={390} dia={5} />}>
        <LeoSentado tel={false} luz={L_ORO_D} poses={[{ f: 0, v: SENT }, { f: 20, v: { ...SENT, tronco: 8, cabeza: 6 } }]} caras={[{ f: 0, v: "triste" }, { f: 40, v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: L(115), v: { x: 1, y: 0.5 } }]} />
        <TenzoSentado habla={[[0, L(115.4)]]} poses={[{ f: 0, v: LOTO_ENSENA_ }]} />
        <Halo x={FX} y={P - 90} r={260} color={ORO} fuerza={0.35 * tit} />
      </CuartoCalido>
      {r > 0 && (
        <AbsoluteFill style={{ clipPath: `circle(${r}px at 960px 600px)` }}>
          <AbsoluteFill style={{ background: "#f0c88a" }} />
          <Escena Set={CaminoChina} pal={PAL_ANT} claves={[mira(0, 300, 600, 1.05), mira(L(118.7), 300, 600, 1.0)]} />
        </AbsoluteFill>
      )}
      {r > 0 && <svg {...svgP}><circle cx={960} cy={600} r={r} fill="none" stroke={ORO} strokeWidth={14} opacity={0.6} /></svg>}
    </AbsoluteFill>
  );
};
// 144,3-148,2 · el granjero grita con las manos en la boca
const Grito18c: React.FC = () => {
  const T = 144.3, f = useF(), L = (tt: number) => fr(tt, T);
  const GX = CHINA_PUNTOS.granjero;
  return (
    <Escena Set={CaminoChina} pal={PAL_ANT} claves={[mira(0, GX - 120, CP - 250, 1.6), mira(L(148.2), GX - 140, CP - 260, 1.85, { curva: "in" })]}
      medio={<>
        <Granjero dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { tronco: 8, hD: 40, cD: 60, hI: 45, cI: 70 } }, { f: L(145.6), v: { tronco: -8, hD: 150, cD: 165, hI: 150, cI: 165, cabeza: -10 } }]}
          caras={[{ f: 0, v: "sorpresa" }, { f: L(145.8), v: "enojo" }]} habla={[[L(146.0), L(148.2)]]} />
        <NubePolvo x={GX - 900} piso={CP + 40} k={0.7} f={f} ancho={700} />
      </>}
      hud={<Globo texto="Hey! Where are you going?!" x={420} y={220} desde={L(146.0)} hasta={L(148.2) + 5} cola="abajo" tam={52} />} />
  );
};
// 148,2-151,6 · el muchacho mira por encima del hombro, sin soltar la crin
const MiraAtras18: React.FC = () => {
  const T = 148.2, f = useF(), t = T + f / 30;
  const ks = Array.from({ length: 5 }, (_, k) => { const tt = T + k; return mira((tt - T) * 30, hxDe(tt) - 40, CP - 340, 2.0); });
  return <Escena Set={CaminoChina} pal={PAL_ANT} claves={ks} medio={<ChinaJinete t={t} f={f} cara="miedo" giro={-0.9} pose={{ ...POSE_JINETE, cabeza: -6 }} />} hud={<Lineas dir={-1} n={10} />} />;
};
// 177,8-181,4 · primer plano nítido: mira el piso que corre (cámara pegada al caballo, sin carteles arriba)
const Bajarse21b: React.FC = () => {
  const f = useF() + 300;
  const hx = 4300 - f * 6.5;
  const ks = Array.from({ length: 5 }, (_, k) => mira(k * 30, 4300 - (300 + k * 30) * 6.5 - 10, BWY_PISO - 330, 1.45));
  return (
    <Escena Set={Broadway} pal={PAL} claves={ks}
      medio={<Montado x={hx} piso={BWY_PISO + 30} fase={(f % 14) / 14} dir={-1} s={1.3} variante="mara" look={LEO3} cara={f % 40 < 20 ? "miedo" : "duda"} escala={ESC} luz={L_TEL}
        pose={{ ...POSE_JINETE, tronco: 26, hD: 70, cD: 60, hI: 75, cI: 55, cabeza: 30 }} />}
      hud={<><Hud min={390} dia={5} estado="sube" /><Lineas dir={1} n={10} /><ManoLeo texto="how do you get off?" x={1120} y={860} desde={50} tam={64} /></>} />
  );
};
// 312,2-313,9 · «he shrugs»: Tenzo encoge los hombros
const Hombros32: React.FC = () => (
  <SobreTenzo dur={51} tenzo={{ poses: [{ f: 0, v: HABLA_A }, { f: 8, v: { ...LOTO, hD: 30, cD: 140, hI: 30, cI: 140, cabeza: 8, tronco: -6 } }, { f: 34, v: HABLA_B }], caras: [{ f: 0, v: "feliz" }, { f: 8, v: "risa" }], habla: [[0, 48]] }}
    hud={<><Hud min={406} dia={5} /><ManoLeo texto="ask the horse." x={1080} y={250} desde={4} tam={66} /></>} />
);
// 329,6-331,8 · inserto de las rodillas: «crack»
const Rodillas34b: React.FC = () => {
  const f = useF();
  return (
    <CuartoCalido claves={[mira(0, TX - 10, P - 110, 3.4), mira(66, TX - 10, P - 115, 3.55)]} hud={<><Hud min={406} dia={5} /><ManoLeo texto="crack." x={1300} y={720} desde={4} tam={110} /><ManoLeo texto="crack." x={300} y={760} desde={18} tam={90} /></>}>
      <Actor look={TENZO} escala={ESC} seed={2} luz={L_ORO_I} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: undefined }]}
        poses={[{ f: 0, v: { tronco: 20, hD: 40, cD: 60, hI: 30, cI: 50, pI: 20, rI: 30, pD: 30, rD: 40 } }, { f: 30, v: { tronco: 6, hD: 20, cD: 40, hI: 20, cI: 40, pI: 6, rI: 8, pD: 8, rD: 10 } }]} caras={[{ f: 0, v: "cansado" }]} />
      {f >= 4 && f < 16 && <circle cx={TX - 25} cy={P - 95} r={20 + (f - 4) * 6} fill="none" stroke="#f4efe6" strokeWidth={5} opacity={1 - (f - 4) / 12} />}
      {f >= 18 && f < 30 && <circle cx={TX + 15} cy={P - 95} r={20 + (f - 18) * 6} fill="none" stroke="#f4efe6" strokeWidth={5} opacity={1 - (f - 18) / 12} />}
    </CuartoCalido>
  );
};
// 358,3-364,4 · DAY 7: 33, y el contador baja a «3h 50m» (como lo dice la voz)
const Dia7b: React.FC = () => {
  const T = 358.3, f = useF(), L = (t: number) => fr(t, T);
  const n7 = interpolate(f, [L(359.4), L(360.6)], [0, 33], cl);
  const m = Math.round(interpolate(f, [L(361.0), L(362.2)], [406, 230], cl));
  const golpe = interpolate(f, [L(362.2), L(362.5)], [1.25, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#3e3226" }}>
      <svg {...svgP}>
        <Halo x={1500} y={150} r={900} color="#e9e4d8" fuerza={0.25} />
        <Hoja x={960} y={420} w={1120} h={440} rot={-2 + Math.sin(f / 40) * 0.6}>
          <text x={420} y={300} fontFamily={F_MANO} fontSize={58} fontWeight={700} fill="#2a2622">day 7</text>
          <Rayitas n={n7} x={520} y={330} color="#2a2622" alto={50} paso={13} />
          {n7 >= 33 && <text x={1300} y={380} fontFamily={F_MANO} fontSize={66} fontWeight={700} fill="#2a2622">33</text>}
        </Hoja>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 40, letterSpacing: 8, color: "#e9e3d6", opacity: SINGLE(f, L(360.8), L(361.2)) }}>SCREEN TIME</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 750, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 140, color: f >= L(362.2) ? ACENTO : "#f4efe6", transform: `scale(${golpe})`, opacity: SINGLE(f, L(360.8), L(361.2)) }}>{`${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`}</div>
      <Hud min={f < L(362.2) ? 406 : 230} dia={7} estado={f >= L(362.2) ? "normal" : "congelado"} />
    </AbsoluteFill>
  );
};
// 376,4-384,5 · Maya: un plano medio y los detalles en insertos (bufanda verde · ambo celeste · libro de papel · la esquina doblada)
const InsBufanda: React.FC = () => {
  const f = useF();
  return (
    <AbsoluteFill style={{ background: "#c9ced6" }}>
      <svg {...svgP}>
        <Halo x={1300} y={200} r={900} color="#ffffff" fuerza={0.35} />
        <path d="M420,1080 Q500,700 960,640 Q1420,700 1500,1080 Z" fill="#9fd3e0" />
        <ellipse cx={960} cy={330} rx={230} ry={260} fill="#e8b98f" />
        <g transform={`translate(0,${Math.sin(f / 9) * 3})`}>
          <path d="M640,560 Q960,720 1280,560 L1300,700 Q960,860 620,700 Z" fill="#3f9a6a" />
          {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${680 + i * 70},${600 - Math.abs(4 - i) * 8} l0,110`} stroke="#2f7a52" strokeWidth={10} strokeLinecap="round" />)}
          <path d="M1120,690 L1180,1000 L1060,1000 Z" fill="#3f9a6a" /><path d="M1070,1000 l0,40 M1100,1000 l0,48 M1130,1000 l0,44 M1160,1000 l0,40" stroke="#2f7a52" strokeWidth={8} />
        </g>
      </svg>
      <ManoLeo texto="green scarf." x={150} y={250} desde={4} tam={74} />
    </AbsoluteFill>
  );
};
const InsAmbo: React.FC = () => {
  const f = useF();
  return (
    <AbsoluteFill style={{ background: "#c9ced6" }}>
      <svg {...svgP}>
        <Halo x={1300} y={200} r={900} color="#ffffff" fuerza={0.35} />
        <g transform={`translate(0,${Math.sin(f / 10) * 4})`}>
          <path d="M300,1080 L360,180 Q960,90 1560,180 L1620,1080 Z" fill="#8cc4d6" />
          <path d="M760,180 L960,460 L1160,180" fill="#6aa9bd" />
          <rect x={1130} y={560} width={260} height={220} rx={14} fill="#7ab6c9" stroke="#5f9fb3" strokeWidth={6} />
          <rect x={1190} y={500} width={18} height={140} rx={8} fill="#2a2f38" /><rect x={1240} y={510} width={18} height={120} rx={8} fill="#c23a3a" />
          <rect x={560} y={520} width={220} height={60} rx={10} fill="#f4efe6" /><text x={670} y={562} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={30} fill="#2a2f38">RN · MAYA</text>
        </g>
      </svg>
      <ManoLeo texto="nursing scrubs." x={150} y={250} desde={4} tam={74} />
    </AbsoluteFill>
  );
};
const InsLibro: React.FC = () => {
  const f = useF();
  return (
    <AbsoluteFill style={{ background: "#c9ced6" }}>
      <svg {...svgP}>
        <Halo x={1300} y={200} r={900} color="#ffffff" fuerza={0.35} />
        <g transform={`rotate(${-6 + Math.sin(f / 20) * 1.5} 960 560)`}>
          <rect x={620} y={250} width={680} height={620} rx={14} fill="#2e5a8a" /><rect x={1270} y={250} width={40} height={620} fill="#f4efe6" />
          <rect x={700} y={380} width={520} height={14} rx={7} fill="#e8c86a" /><rect x={760} y={420} width={400} height={10} rx={5} fill="#e8c86a" opacity={0.7} />
          <path d="M600,880 Q620,780 700,760 L760,900 Z" fill="#e8b98f" /><path d="M1330,880 Q1320,780 1260,760 L1200,900 Z" fill="#e8b98f" />
        </g>
      </svg>
      <ManoLeo texto="a real paper book." x={150} y={250} desde={4} tam={74} />
    </AbsoluteFill>
  );
};
const MayaPlano: React.FC = () => (
  <Escena Set={Broadway} pal={PAL_DIA} setProps={{ hora: "dia", nieve: true }} claves={[mira(0, MAYA_X - 120, BP - 250, 2.0), mira(27, MAYA_X - 120, BP - 250, 2.1)]}
    medio={<>
      <Actor look={MAYA} escala={ESC * 0.95} seed={8} luz={L_DIA} ruta={[{ f: 0, x: MAYA_X + 220, y: BP }, { f: 27, x: MAYA_X, y: BP }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 50, cD: 100, hI: 50, cI: 100, cabeza: 22 } }]} caras={[{ f: 0, v: "neutral" }]} enManoD={<Libro abierto color="#2e5a8a" />} />
      <Actor look={LEO3} escala={ESC} seed={1} luz={L_DIA} ruta={[{ f: 0, x: LEO_PARADA, y: BP }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 20, cD: -40, hI: -20, cI: -40 } }]} caras={[{ f: 0, v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} />
    </>}
    hud={<><Hud min={230} dia={7} /><ManoLeo texto="a girl." x={200} y={250} desde={0} tam={74} /></>} />
);
// 398,7-404,2 · el monje carga a la mujer y cruza el río (plano más cerrado)
const Gancho41d: React.FC = () => {
  const f = useF();
  const s = (a: number) => interpolate(f, [a, a + 8], [1.3, 1], cl);
  const mx = interpolate(f, [0, 165], [RIO.orillaI + 200, RIO.orillaI + 520]);
  return (
    <AbsoluteFill>
      <Escena Set={RioCrecido} pal={PAL_ANT} claves={[mira(0, RIO.orillaI + 260, RIO.sup - 220, 1.5), mira(165, RIO.orillaI + 520, RIO.sup - 220, 1.6)]}
        medio={<>
          <Actor look={MONJE_SHOUNJI} escala={1.05} seed={42} luz={L_ANT} ruta={[{ f: 0, x: RIO.orillaI - 60, y: JAPON_PISO }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 10, cD: 20, hI: 10, cI: 20 } }]} caras={[{ f: 0, v: "sorpresa" }, { f: 90, v: "enojo" }]} />
          <Actor look={MONJE_SHOUNJI} escala={1.05} seed={40} luz={L_ANT} ruta={[{ f: 0, x: mx, y: RIO.sup + 20 }]} dir={[{ f: 0, v: 1 }]} poses={alterna({ hD: 95, cD: 70, hI: 95, cI: 70, tronco: 6 }, { hD: 95, cD: 70, hI: 95, cI: 70, tronco: 2 }, 0, 165, 12)} caras={[{ f: 0, v: "determinado" }]} />
          <g transform={`translate(${mx + 30},${RIO.sup - 190}) rotate(-78)`}>
            <Actor look={MAYA} escala={0.9} seed={41} ruta={[{ f: 0, x: 0, y: 0 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 160, cD: 30, hI: 40, cI: 40, pI: 10, pD: 14 } }]} caras={[{ f: 0, v: "sorpresa" }]} />
          </g>
        </>} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 64, letterSpacing: 8, color: "#f4efe6", textShadow: "0 4px 16px rgba(0,0,0,.6)", opacity: SINGLE(f, 6, 10), transform: `scale(${s(6)})` }}>DAY 8 · TOMORROW NIGHT</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 180, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 84, color: ORO, textShadow: "0 4px 16px rgba(0,0,0,.6)", opacity: SINGLE(f, 40, 44), transform: `scale(${s(40)})` }}>Two Monks, a River and a Woman</div>
    </AbsoluteFill>
  );
};
// 404,2-409,2 · el farol se acerca; en «the hard way» se apaga
const Cierre8: React.FC = () => {
  const f = useF();
  const k = interpolate(f, [0, 90], [0.6, 1.25], cl);
  const luz = 1 - SINGLE(f, 88, 100);
  const s = (a: number) => interpolate(f, [a, a + 8], [1.3, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#07070b" }}>
      <svg {...svgP}>
        <Halo x={960} y={520} r={520 * k} color={ORO} fuerza={0.45 * luz} />
        <g transform={`translate(960,${520 + Math.sin(f / 12) * 6}) scale(${k}) rotate(${Math.sin(f / 18) * 3})`}>
          <path d="M0,-200 L0,-130" stroke="#3a2a1a" strokeWidth={6} />
          <ellipse cx={0} cy={0} rx={95} ry={130} fill={mezcla("#2a2622", "#ffd08a", luz)} />
          {[-60, -20, 20, 60].map((y) => <path key={y} d={`M${-Math.sqrt(1 - (y / 130) ** 2) * 95},${y} Q0,${y + 10} ${Math.sqrt(1 - (y / 130) ** 2) * 95},${y}`} stroke="#c98a3a" strokeWidth={3} fill="none" opacity={0.6} />)}
          <rect x={-60} y={-142} width={120} height={18} rx={6} fill="#3a2a1a" /><rect x={-60} y={124} width={120} height={18} rx={6} fill="#3a2a1a" />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 72, color: "#f4efe6", opacity: SINGLE(f, 6, 10), transform: `scale(${s(6)})` }}>Two Monks, a River and a Woman</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 920, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 40, letterSpacing: 6, color: ORO, opacity: SINGLE(f, 36, 40), transform: `scale(${s(36)})` }}>lust is not love · Day 8</div>
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [118, 150], [0, 1], cl) }} />
    </AbsoluteFill>
  );
};

// ---------- el montaje ----------
const TRAMOS: TramoS[] = [
  { t0: 0, t1: 3.0, el: <Cuadro0b /> },
  { t0: 3.0, t1: 5.7, el: <AlbaTel2 /> },
  { t0: 5.7, t1: 10.0, el: <Alba1b /> },
  { t0: 10.0, t1: 13.1, el: <Cuenta4h2 /> },
  { t0: 13.1, t1: 15.8, el: <Cara2c /> },
  { t0: 15.8, t1: 21.1, el: <Dia5a2 />, trans: { tipo: "fundido", d: 12 } },
  { t0: 21.1, t1: 25.8, el: <Dia5b /> },
  { t0: 25.8, t1: 29.2, el: <Sonrisa5 /> },
  { t0: 29.2, t1: 31.7, el: <Mara4 /> },
  { t0: 31.7, t1: 36.3, el: <Lavadero5b />, trans: { tipo: "barrido", lado: 1 } },
  { t0: 36.3, t1: 40.6, el: <Acostado6b />, trans: { tipo: "fundido", d: 10 } },
  { t0: 40.6, t1: 44.3, el: <Titere /> },
  { t0: 44.3, t1: 47.5, el: <Linea10b /> },
  { t0: 47.5, t1: 50.1, el: <Cuenta7b /> },
  { t0: 50.1, t1: 53.3, el: <Horas20kb /> },
  { t0: 53.3, t1: 55.2, el: <Medicina7b /> },
  { t0: 55.2, t1: 58.9, el: <Golpe8b />, trans: { tipo: "fundido", d: 12 } },
  { t0: 58.9, t1: 60.4, el: <Susto8 /> },
  { t0: 60.4, t1: 64.5, el: <Pasillo9b /> },
  { t0: 64.5, t1: 69.3, el: <TenzoPuerta2 /> },
  { t0: 69.3, t1: 70.9, el: <Como10b /> },
  { t0: 70.9, t1: 76.3, el: <Fachada10c /> },
  { t0: 76.3, t1: 78.7, el: <MiraTel11 /> },
  { t0: 78.7, t1: 80.4, el: <TelPrendido2 /> },
  { t0: 80.4, t1: 83.4, el: <PasarCorto2 /> },
  { t0: 83.4, t1: 92.0, el: <Cuarto12c /> },
  { t0: 92.0, t1: 98.7, el: <Tibio13b /> },
  { t0: 98.7, t1: 100.7, el: <PPLeo dur={60} leo={{ tel: false, poses: [{ f: 0, v: SENT }, { f: 20, v: { ...SENT, cabeza: 10 } }], caras: [{ f: 0, v: "triste" }], habla: [[0, 56]] }} hud={<Hud min={390} dia={5} />} /> },
  { t0: 100.7, t1: 106.5, el: <Recuerdo14 />, trans: { tipo: "fundido", d: 10 } },
  { t0: 106.5, t1: 111.0, el: <Mismo14b /> },
  { t0: 111.0, t1: 113.1, el: <Asiente14 /> },
  { t0: 113.1, t1: 118.7, el: <Farol15c /> },
  { t0: 118.7, t1: 128.0, el: <Camino16b /> },
  { t0: 128.0, t1: 131.5, el: <Galope17a /> },
  { t0: 131.5, t1: 133.9, el: <Galope17b /> },
  { t0: 133.9, t1: 138.1, el: <Galope17c /> },
  { t0: 138.1, t1: 144.3, el: <CaraRoja17b /> },
  { t0: 144.3, t1: 148.2, el: <Grito18c /> },
  { t0: 148.2, t1: 151.6, el: <MiraAtras18 /> },
  { t0: 151.6, t1: 154.0, el: <Pregunta19b /> },
  { t0: 154.0, t1: 156.9, el: <Tos19 /> },
  { t0: 156.9, t1: 161.5, el: <Risa20b /> },
  { t0: 161.5, t1: 165.2, el: <Fantasma20 /> },
  { t0: 165.2, t1: 170.1, el: <Habito20 /> },
  { t0: 170.1, t1: 174.5, el: <Habito21b />, trans: { tipo: "barrido", lado: -1 } },
  { t0: 174.5, t1: 177.8, el: <Habito21b o={132} z={1.8} y={560} asustado /> },
  { t0: 177.8, t1: 181.4, el: <Bajarse21b /> },
  { t0: 181.4, t1: 183.4, el: <Dedo22b /> },
  { t0: 183.4, t1: 190.7, el: <Antes22b /> },
  { t0: 190.7, t1: 193.2, el: <StopNegro2 /> },
  { t0: 193.2, t1: 195.3, el: <Solo23 /> },
  { t0: 195.3, t1: 199.8, el: <Gigante24 /> },
  { t0: 199.8, t1: 204.8, el: <Respiro24 /> },
  { t0: 204.8, t1: 212.8, el: <Ve24b />, trans: { tipo: "fundido", d: 14 } },
  { t0: 212.8, t1: 221.9, el: <Aburrido25b />, trans: { tipo: "fundido", d: 14 } },
  { t0: 221.9, t1: 225.6, el: <Empuja26 /> },
  { t0: 225.6, t1: 229.3, el: <Duda26 /> },
  { t0: 229.3, t1: 231.5, el: <Adelante26 /> },
  { t0: 231.5, t1: 235.5, el: <Abre27 /> },
  { t0: 235.5, t1: 245.7, el: <Scroll27b /> },
  { t0: 245.7, t1: 251.1, el: <Congela28b /> },
  { t0: 251.1, t1: 253.1, el: <Donde29b /> },
  { t0: 253.1, t1: 256.7, el: <MiCuarto29 /> },
  { t0: 256.7, t1: 260.1, el: <Pregunta29 /> },
  { t0: 260.1, t1: 267.2, el: <Cuerpo29b />, trans: { tipo: "fundido", d: 10 } },
  { t0: 267.2, t1: 271.9, el: <Bien30 /> },
  { t0: 271.9, t1: 274.6, el: <Seguir30 /> },
  { t0: 274.6, t1: 278.8, el: <Otra30b /> },
  { t0: 278.8, t1: 280.6, el: <No30b /> },
  { t0: 280.6, t1: 284.8, el: <BocaAbajo31b /> },
  { t0: 284.8, t1: 292.3, el: <Silencio31b /> },
  { t0: 292.3, t1: 300.7, el: <Sienta31b /> },
  { t0: 300.7, t1: 305.0, el: <Sien32 /> },
  { t0: 305.0, t1: 312.2, el: <Diagrama32b />, trans: { tipo: "fundido", d: 10 } },
  { t0: 312.2, t1: 313.9, el: <Hombros32 /> },
  { t0: 313.9, t1: 315.5, el: <Diagrama32b o={Math.round((313.9 - 305.0) * 30)} /> },
  { t0: 315.5, t1: 316.6, el: <SiOlvido32 /> },
  { t0: 316.6, t1: 322.0, el: <Olvida32b /> },
  { t0: 322.0, t1: 327.2, el: <Monjes33b />, trans: { tipo: "luz", d: 14 } },
  { t0: 327.2, t1: 329.6, el: <Parado34b />, trans: { tipo: "luz", d: 12 } },
  { t0: 329.6, t1: 331.8, el: <Rodillas34b /> },
  { t0: 331.8, t1: 335.2, el: <Porque35b /> },
  { t0: 335.2, t1: 342.0, el: <Cruza35b /> },
  { t0: 342.0, t1: 346.6, el: <TenzoJoven />, trans: { tipo: "fundido", d: 10 } },
  { t0: 346.6, t1: 350.4, el: <SeVa36b />, trans: { tipo: "fundido", d: 8 } },
  { t0: 350.4, t1: 358.3, el: <Pared37 />, trans: { tipo: "fundido", d: 12 } },
  { t0: 358.3, t1: 364.4, el: <Dia7b /> },
  { t0: 364.4, t1: 368.8, el: <Parada38b />, trans: { tipo: "cortina", lado: 1 } },
  { t0: 368.8, t1: 372.2, el: <Manos38 /> },
  { t0: 372.2, t1: 376.4, el: <Nota38 /> },
  { t0: 376.4, t1: 377.3, el: <MayaPlano /> },
  { t0: 377.3, t1: 378.5, el: <InsBufanda /> },
  { t0: 378.5, t1: 380.3, el: <InsAmbo /> },
  { t0: 380.3, t1: 382.0, el: <InsLibro /> },
  { t0: 382.0, t1: 384.5, el: <Maya38b o={Math.round((382.0 - 376.4) * 30)} /> },
  { t0: 384.5, t1: 386.9, el: <Sonrie39b /> },
  { t0: 386.9, t1: 388.2, el: <Colorado39 /> },
  { t0: 388.2, t1: 392.5, el: <Relame40b /> },
  { t0: 392.5, t1: 398.7, el: <Cierre41b />, trans: { tipo: "fundido", d: 16 } },
  { t0: 398.7, t1: 404.2, el: <Gancho41d />, trans: { tipo: "fundido", d: 12 } },
  { t0: 404.2, t1: 409.2, el: <Cierre8 /> },
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
