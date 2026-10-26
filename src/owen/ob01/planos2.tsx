// ob01 · planos 21-46 (128,5 → 408,3 s): Abernathy, agarre, fumador, Lena, caminata, soledad, el hombre del abrigo gris,
// Rosa, Dee, los relojes se mueven, la escalera, el mensaje 46/47, la ventana, gancho y CTA.
import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import { enPantalla, mira, useF } from "../../anikit/camara";
import { Actor, posRuta } from "../../anikit/actor";
import { Escena } from "../../anikit/escena";
import { Contador, Globo, Pildora, F_HUD } from "../../anikit/pantalla";
import { Taza } from "../../anikit/props";
import { PAL, OWEN, OWEN_CASA, ROSA, DEE, ABERNATHY, LENA, ABRIGO, FUMADOR, OFICINISTA, SENORA, ESTUDIANTE, OBRERO, TEEN, RUNNER, SCRUBS, VERDE } from "../elenco";
import { BusInterior, BUS_PISO, BUS_PUNTOS, ASIENTO_X, Bus9 } from "../mundo/bus";
import { Ashland, ASH_PISO, ASH_CARRIL } from "../mundo/ashland";
import { TwoFlatCorte, TwoFlatFuera, TF_PISO, TF_ARRIBA, TF_PUNTOS, escalon } from "../mundo/twoflat";
import { LogoHalden } from "../mundo/halden";
import { Cigarrillos, Dinamometro, DosRelojes, ListaDia, MensajeCel, Velocimetro } from "../ciencia";
import { Etq, HudOwen, ManoMundo, Marco, Mano } from "../comun";
import { EnBus, ESC, kDe, OwenAlVolante, Pas, VasoCafe } from "./base";
import { ROJO_OWEN } from "./planos1";

const P = TF_PISO, A = TF_ARRIBA;
const sent = (look: Pas["look"], fila: number, extra: Partial<Pas> = {}): Pas => ({ look, ruta: [{ f: 0, x: ASIENTO_X(fila), y: BUS_PISO }], dir: [{ f: 0, v: -1 }], sentado: 0, ...extra });

// ---------- 21 · parada 4: Abernathy (72 → 58) ----------
export const P21Abernathy: React.FC = () => {
  const k = kDe(128.5);
  const llega = k(129.3);
  const avance = (ff: number) => 3200 - Math.max(0, llega - ff) ** 2 * 0.08;
  const puertaF = (ff: number) => interpolate(ff, [llega + 2, llega + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ab: Pas = {
    look: ABERNATHY, seed: 2, aparece: k(129.8),
    ruta: [{ f: k(129.8), x: BUS_PUNTOS.puertaF + 40, y: BUS_PISO + 20 }, { f: k(133.5), x: BUS_PUNTOS.puertaF - 20, y: BUS_PISO, curva: "inout" }, { f: k(134.4), x: BUS_PUNTOS.validador + 40, y: BUS_PISO }, { f: k(139.4), x: ASIENTO_X(4), y: BUS_PISO }],
    poses: [{ f: 0, v: "agarrarAlto" }, { f: k(133.6), v: "parado" }], caras: [{ f: 0, v: "determinado" }, { f: k(139.5), v: "feliz" }], sentado: k(139.6),
    n: 58, edad: 72, desde: k(140.2),
  };
  const cl = [mira(0, 460, 650, 1.6), mira(k(134.4), 600, 650, 1.5, { curva: "inout" }), mira(k(139.4), 1350, 650, 1.4, { curva: "inout" })];
  return (
    <EnBus cl={cl} hora="manana" min={392} avance={avance} puertaF={puertaF} paradas={[{ a: 3200, num: 4 }]} pas={[sent(TEEN, 7, { n: 31, edad: 19, seed: 3 }), ab]}
      owen={{ caras: [{ f: 0, v: "neutral" }, { f: k(136), v: "sorpresa" }], miradas: [{ f: 0, v: { x: 1, y: 0 } }], giros: [{ f: 0, v: 0.5 }] }}
      hud={<Pildora texto="STOP 4 · MR. ABERNATHY · RETIRED MAILMAN, 72" x={960} y={950} desde={k(129.4)} hasta={k(137)} color="#f4efe4" />} />
  );
};

// ---------- 22 · Owen se ríe ----------
export const P22Rie: React.FC = () => (
  <EnBus cl={[mira(0, 330, BUS_PISO - 250, 2.3), mira(93, 320, BUS_PISO - 260, 2.45)]} hora="manana" min={394} avance={() => 3200}
    owen={{ caras: [{ f: 0, v: "risa" }], habla: [[4, 60]], miradas: [{ f: 0, v: { x: 1, y: 0 } }], giros: [{ f: 0, v: 0.6 }] }} />
);

export const P23Agarre: React.FC = () => <AbsoluteFill><Dinamometro lb={90} caida={11} desdeCaida={kDe(145.0)(154.7)} /><HudOwen part="47/47" /></AbsoluteFill>;

// ---------- 24 · las manos de Abernathy en el caño ----------
export const P24Manos: React.FC = () => {
  const k = kDe(159.3);
  const cl = [mira(0, ASIENTO_X(4) - 40, BUS_PISO - 230, 2.4), mira(160, ASIENTO_X(4) - 20, BUS_PISO - 220, 2.7)];
  return (
    <EnBus cl={cl} hora="manana" min={396} avance={(f) => 3200 + f * 12} owen={null}
      pas={[sent(ABERNATHY, 4, { poses: [{ f: 0, v: { tronco: -4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 120, cD: 20, hI: 25, cI: 50 } }], caras: [{ f: 0, v: "feliz" }], n: 58, edad: 72, desde: -20, seed: 2 })]}
      hud={<><Mano texto="YOUR HANDS ARE A GAUGE" x={960} y={170} desde={0} color="#ffd27a" tam={64} /><Mano texto="40 years of mailbags" x={1300} y={860} desde={k(161.6)} color="#f4efe4" tam={58} /></>} />
  );
};

// ---------- 25 · las manos de Owen: blandas, con un café de estación de servicio ----------
export const P25Cafe: React.FC = () => (
  <EnBus cl={[mira(0, 300, BUS_PISO - 220, 2.6), mira(140, 280, BUS_PISO - 230, 2.8)]} hora="manana" min={398} avance={(f) => 4000 + f * 12}
    owen={{ manos: "I", poses: [{ f: 0, v: { tronco: -4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 30, cD: 115, hI: 25, cI: 50 } }], enManoD: <VasoCafe />, caras: [{ f: 0, v: "duda" }], miradas: [{ f: 0, v: { x: 0.2, y: 0.8 } }] }}
    hud={<Mano texto="soft." x={1280} y={760} desde={kDe(164.6)(166.8)} color="#ffd27a" tam={70} />} />
);

// ---------- 26 · parada 12: el fumador (+9) ----------
export const P26Fumador: React.FC = () => {
  const f = useF();
  const k = kDe(169.3);
  const BX = 1900; // el bus parado; la puerta delantera (dir 1, frente a la derecha) queda cerca de BX + 760·esc
  const PUERTA = BX + 560;
  const tira = k(172.6);
  const cl = [mira(0, PUERTA - 250, 760, 0.95), mira(k(174.3), PUERTA - 120, 760, 1.15, { curva: "inout" })];
  const ruta = [{ f: 0, x: PUERTA - 520, y: ASH_PISO + 40 }, { f: tira, x: PUERTA - 300, y: ASH_PISO + 40 }, { f: tira + 30, x: PUERTA - 300, y: ASH_PISO + 40 }, { f: k(175.6), x: PUERTA, y: ASH_PISO + 40 }];
  const pucho = f < tira ? null : { x: PUERTA - 270 + (f - tira) * 9, y: ASH_PISO - 150 + (f - tira) ** 2 * 0.6 };
  return (
    <Escena Set={Ashland} pal={PAL} claves={cl} seed={26} setProps={{ hora: "manana", centro: () => PUERTA, paradas: [{ x: PUERTA - 120, num: 12, refugio: false }], autos: 3 }}
      medio={<>
        <Bus9 x={BX} y={ASH_CARRIL - 120} esc={0.62} dir={1} hora="manana" puertas={1} kneel={8} />
        <Actor look={FUMADOR} escala={ESC * 0.75} seed={13} ruta={ruta} poses={[{ f: 0, v: { hD: 40, cD: 120 } }, { f: tira - 8, v: { hD: 60, cD: 60 } }, { f: tira, v: { hD: 95, cD: -10 } }, { f: tira + 14, v: "parado" }]} caras={[{ f: 0, v: "picaro" }]} opacidad={(ff) => (ff > k(175.6) ? 0 : 1)} />
        {pucho && pucho.y < ASH_PISO + 150 && <g transform={`translate(${pucho.x},${pucho.y}) rotate(${(f - tira) * 30})`}><rect x={-12} y={-3} width={24} height={6} fill="#f4efe4" /><circle cx={-12} r={4} fill="#ff6a2a" /></g>}
        {f < tira && <path d={`M${PUERTA - 520 + (f / tira) * 220 + 30},${ASH_PISO - 150} q12,-24 0,-48 q-12,-24 4,-46`} stroke="#c9d3e0" strokeWidth={5} fill="none" opacity={0.6} />}
      </>}
      hud={<>
        <Pildora texto="STOP 12" x={960} y={950} desde={0} hasta={k(173)} color="#f4efe4" />
        {f >= k(174.4) && f < k(176) && <ManoMundo cl={cl} x={PUERTA - 300} y={ASH_PISO - 230} texto="+9" desde={k(174.4)} color={ROJO_OWEN} tam={110} />}
        <Pildora texto="SMOKING = ONE OF THE STRONGEST CLOCK ACCELERATORS" x={960} y={950} desde={k(175.8)} color="#ffd27a" />
        <HudOwen min={430} part="47/47" />
      </>} />
  );
};

const ReflejoOwen: React.FC<{ hora?: "ocaso" | "manana" | "dia" | "tarde"; cara?: string }> = ({ hora = "manana", cara = "duda" }) => (
  <Escena Set={BusInterior} pal={PAL} claves={[mira(0, BUS_PUNTOS.chofer - 10, BUS_PISO - 300, 3.2)]} setProps={{ hora }} medio={<OwenAlVolante o={{ caras: [{ f: 0, v: cara }] }} />} />
);
export const P26bEspejo: React.FC = () => {
  const k = kDe(179.5);
  return (
    <AbsoluteFill>
      <EnBus cl={[mira(0, 300, BUS_PISO - 260, 2.0)]} hora="manana" min={432} avance={(f) => 6000 + f * 10} owen={{ caras: [{ f: 0, v: "duda" }], miradas: [{ f: 0, v: { x: -0.4, y: -1 } }] }} />
      <div style={{ position: "absolute", left: 1080, top: 120 }}>
        <Marco x={0} y={0} w={700} h={390} radio={80} espejar><ReflejoOwen /></Marco>
        <div style={{ position: "absolute", left: 470, top: 40, fontFamily: F_HUD, fontWeight: 600, fontSize: 110, color: ROJO_OWEN, textShadow: "0 4px 12px rgba(0,0,0,0.6)" }}>47?</div>
      </div>
      <Mano texto="He doesn't smoke." x={560} y={860} desde={k(179.6)} color="#f4efe4" tam={60} />
    </AbsoluteFill>
  );
};

// ---------- 27 · parada 18: Café 18, Lena (27 → 24) ----------
const CAFE = 1700;
export const P27Lena: React.FC = () => {
  const k = kDe(182.2);
  const LX = CAFE + 640, OX = CAFE + 420;
  const cl = [mira(0, 1450, ASH_PISO - 250, 0.72), mira(k(185.5), CAFE + 540, ASH_PISO - 260, 1.45, { curva: "inout" }), mira(k(192.0), LX - 40, ASH_PISO - 300, 1.9, { curva: "inout" }), mira(k(195.6), CAFE + 540, ASH_PISO - 270, 1.6, { curva: "inout" })];
  return (
    <Escena Set={Ashland} pal={PAL} claves={cl} seed={27} setProps={{ hora: "manana", centro: () => 1500, cafe: CAFE, paradas: [{ x: 1000, num: 18, refugio: true }], autos: 2 }}
      medio={<>
        <Bus9 x={150} y={ASH_CARRIL - 120} esc={0.62} dir={1} hora="manana" puertas={1} chofer={false} />
        <Actor look={LENA} escala={ESC * 0.8} seed={4} ruta={[{ f: 0, x: LX, y: ASH_PISO - 30 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 50, cD: 70 } }, { f: k(190), v: { hD: 80, cD: 20 } }, { f: k(191), v: "parado" }]} caras={[{ f: 0, v: "feliz" }, { f: k(195.8), v: "picaro" }, { f: k(197.3), v: "risa" }]} habla={[[k(195.8), k(197.2)]]} />
        <g><rect x={CAFE + 60} y={ASH_PISO - 150} width={980} height={150} fill="#6a4630" /><rect x={CAFE + 50} y={ASH_PISO - 160} width={1000} height={18} rx={4} fill="#e9dcc4" /></g>
        <Actor look={OWEN} escala={ESC * 0.8} seed={1} ruta={[{ f: 0, x: 900, y: ASH_PISO + 40 }, { f: k(186.2), x: OX, y: ASH_PISO + 20 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "parado" }, { f: k(190.4), v: { hD: 40, cD: 110 } }]} caras={[{ f: 0, v: "feliz" }, { f: k(197.3), v: "risa" }]} habla={[[k(197.3), k(198.5)]]} enManoD={(ff: number) => (ff > k(190.4) ? <VasoCafe /> : null)} />
      </>}
      hud={<>
        <Pildora texto="STOP 18 · ASHLAND & 18TH" x={960} y={950} desde={0} hasta={k(186)} color="#f4efe4" />
        <Pildora texto="LENA ORTIZ · 27" x={960} y={950} desde={k(186.3)} hasta={k(191.8)} color="#f4efe4" />
        <Etq cl={cl} x={LX} y={ASH_PISO - 30 - 280} n={24} edad={27} desde={k(192.2)} tam={84} />
        <Globo texto="What are you smiling at?" x={1250} y={250} desde={k(195.8)} hasta={k(197.3)} cola="abajo" tam={40} />
        <Globo texto="The coffee is great." x={700} y={300} desde={k(197.3)} hasta={k(199.7)} cola="abajo" tam={40} />
        <Mano texto="(he hasn't tasted it)" x={720} y={880} desde={k(198.6)} color="#ffd27a" tam={52} />
        <HudOwen min={555} part="47/47" />
      </>} />
  );
};

// ---------- 28 · 10 AM: los de número bajo caminan rápido ----------
export const P28Caminan: React.FC = () => {
  const k = kDe(199.7);
  const Y = ASH_PISO + 40;
  const peat = [
    { look: OFICINISTA, a: 200, b: 2700, n: 34, edad: 41, seed: 21 },
    { look: SENORA, a: 1100, b: 1450, n: 78, edad: 66, seed: 22 },
    { look: ESTUDIANTE, a: 500, b: 2900, n: 22, edad: 25, seed: 23 },
    { look: OBRERO, a: 1700, b: 2050, n: 61, edad: 48, seed: 24 },
  ];
  const fin = k(206.8);
  const cl = [mira(0, 1200, ASH_PISO - 200, 0.8), mira(fin, 1700, ASH_PISO - 200, 0.8)];
  return (
    <Escena Set={Ashland} pal={PAL} claves={cl} seed={28} setProps={{ hora: "dia", centro: (ff: number) => 1200 + (ff / fin) * 500, autos: 5 }}
      medio={<>{peat.map((p, i) => <Actor key={i} look={p.look} escala={ESC * 0.8} seed={p.seed} ruta={[{ f: 0, x: p.a, y: Y }, { f: fin, x: p.b, y: Y, curva: "lineal" }]} caras={[{ f: 0, v: p.n < 40 ? "feliz" : "cansado" }]} />)}</>}
      hud={<>
        {peat.map((p, i) => <Etq key={i} cl={cl} x={(ff) => p.a + (p.b - p.a) * Math.min(1, ff / fin)} y={Y - 270} n={p.n} edad={p.edad} desde={k(201.6) + i * 12} tam={52} />)}
        <Pildora texto="10:00 AM · OWEN HAS A THEORY" x={960} y={950} desde={0} hasta={k(203.4)} color="#f4efe4" />
        <Pildora texto="LOW NUMBERS WALK FAST" x={960} y={950} desde={k(203.5)} color={VERDE} />
        <HudOwen min={600} part="47/47" />
      </>} />
  );
};

export const P29Velocidad: React.FC = () => <AbsoluteFill><Velocimetro ms={1.3} etiqueta="WALKING SPEED" /><Mano texto="faster pace → longer life" x={960} y={180} desde={kDe(206.8)(212.7)} color={VERDE} tam={56} /><HudOwen part="47/47" /></AbsoluteFill>;

export const P30SuDia: React.FC = () => {
  const k = kDe(215.7);
  return (
    <AbsoluteFill>
      <ListaDia items={["5 h sleep", "12 h sitting", "3 energy drinks", "dinner at 11 p.m."]} tiempos={[k(217.2), k(218.5), k(220.6), k(222.2)]} />
      <Mano texto="HE BUILT IT." x={960} y={930} desde={k(226.3)} color={ROJO_OWEN} tam={96} />
      <HudOwen part="47/47" />
    </AbsoluteFill>
  );
};

// ---------- 31 · mediodía: los solos marcan más, los que se ríen marcan menos · CTA 1 ----------
export const P31Mediodia: React.FC = () => {
  const k = kDe(227.4);
  const pas: Pas[] = [
    sent(SENORA, 2, { caras: [{ f: 0, v: "triste" }], n: 71, edad: 58, desde: k(231.6), seed: 31 }),
    sent(OBRERO, 4, { caras: [{ f: 0, v: "cansado" }], n: 63, edad: 49, desde: k(232.4), seed: 32 }),
    sent(ESTUDIANTE, 6, { caras: [{ f: 0, v: "risa" }], habla: [[0, 300]], n: 21, edad: 26, desde: k(234.9), seed: 33 }),
    sent(OFICINISTA, 7, { caras: [{ f: 0, v: "risa" }], habla: [[20, 280]], n: 33, edad: 39, desde: k(235.3), seed: 34 }),
    { look: RUNNER, ruta: [{ f: 0, x: 1640, y: BUS_PISO }], poses: [{ f: 0, v: "agarrarAlto" }], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "neutral" }], seed: 35 },
  ];
  const cl = [mira(0, 1000, 640, 1.05), mira(k(234.6), 2050, 640, 1.1, { curva: "inout" }), mira(k(236.2), 2150, 640, 1.12)];
  return (
    <EnBus cl={cl} hora="dia" min={720} avance={(f) => 9000 + f * 10} pas={pas} owen={{ caras: [{ f: 0, v: "neutral" }] }}
      hud={<>
        <Pildora texto="NOON" x={960} y={170} desde={0} hasta={k(230)} color="#f4efe4" />
        <Pildora texto="What number floats over YOUR head? Comment it ↓" x={960} y={940} desde={k(228.6)} hasta={k(236.2)} color={VERDE} tam={46} />
      </>} />
  );
};

export const P32Soledad: React.FC = () => <AbsoluteFill><Cigarrillos n={15} /><HudOwen part="47/47" /></AbsoluteFill>;

// ---------- 33 · Owen no llamó a un amigo en 3 meses ----------
export const P33Solo: React.FC = () => {
  const k = kDe(244.8);
  return (
    <EnBus cl={[mira(0, 520, 640, 1.6), mira(160, 360, BUS_PISO - 250, 2.2, { curva: "inout" })]} hora="dia" min={760} avance={(f) => 10000 + f * 10}
      pas={[sent(ESTUDIANTE, 1, { caras: [{ f: 0, v: "risa" }], habla: [[0, 160]], seed: 41 }), sent(SENORA, 2, { caras: [{ f: 0, v: "feliz" }], habla: [[30, 160]], seed: 42 })]}
      owen={{ caras: [{ f: 0, v: "triste" }], miradas: [{ f: 0, v: { x: -1, y: 0.2 } }] }}
      hud={<>
        <Mano texto="last call with a friend: 3 months ago" x={1250} y={470} desde={k(244.9)} color="#ffd27a" tam={52} />
        <Mano texto="400 people a day. talks to ~0." x={1250} y={580} desde={k(247.2)} color="#f4efe4" tam={52} />
      </>} />
  );
};

// ---------- 34 · 2 PM, parada 30: el hombre del abrigo gris, SIN número ----------
const FILA_ABRIGO = 10;
const AbrigoAtras: React.FC<{ cara?: string; mira?: number }> = ({ cara = "neutral" }) => (
  <Escena Set={BusInterior} pal={PAL} claves={[mira(0, ASIENTO_X(FILA_ABRIGO) - 60, BUS_PISO - 260, 1.9)]} setProps={{ hora: "tarde" }}
    medio={<Actor look={ABRIGO} escala={ESC} seed={51} ruta={[{ f: 0, x: ASIENTO_X(FILA_ABRIGO), y: BUS_PISO }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "sentado" }]} asiento={[{ f: 0, v: BUS_PUNTOS.asiento }]} caras={[{ f: 0, v: cara }]} miradas={[{ f: 0, v: { x: -1, y: -0.2 } }]} />} />
);
export const P34Abrigo: React.FC = () => {
  const f = useF();
  const k = kDe(250.2);
  const llega = k(251.6);
  const avance = (ff: number) => 14000 - Math.max(0, llega - ff) ** 2 * 0.08;
  const puertaF = (ff: number) => interpolate(ff, [llega, llega + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ab: Pas = {
    look: ABRIGO, seed: 51, aparece: k(252.5), caras: [{ f: 0, v: "neutral" }],
    ruta: [{ f: k(252.5), x: BUS_PUNTOS.puertaF + 40, y: BUS_PISO }, { f: k(253.4), x: BUS_PUNTOS.validador + 40, y: BUS_PISO }, { f: k(254.2), x: BUS_PUNTOS.validador + 40, y: BUS_PISO }, { f: k(257.6), x: ASIENTO_X(FILA_ABRIGO), y: BUS_PISO }],
    sentado: k(257.7),
  };
  const cl = [mira(0, 480, 650, 1.5), mira(k(254.2), 700, 650, 1.35, { curva: "inout" }), mira(k(257.5), 2700, 650, 1.1, { curva: "inout" })];
  const espejo = f >= k(257.9);
  return (
    <AbsoluteFill>
      <EnBus cl={cl} hora="tarde" min={840} avance={avance} puertaF={puertaF} paradas={[{ a: 14000, num: 30 }]} pas={[ab]}
        owen={{ caras: [{ f: 0, v: "neutral" }, { f: k(258.3), v: "miedo" }], miradas: [{ f: 0, v: { x: 1, y: 0 } }, { f: k(257.8), v: { x: -0.3, y: -1 } }] }}
        hud={<Pildora texto="2:00 PM · STOP 30" x={960} y={950} desde={0} hasta={k(254)} color="#f4efe4" />} />
      {espejo && <div style={{ position: "absolute", left: 260, top: 110, opacity: interpolate(f, [k(257.9), k(258.3)], [0, 1], { extrapolateRight: "clamp" }) }}>
        <Marco x={0} y={0} w={1400} h={760} radio={160}><AbrigoAtras /></Marco>
      </div>}
      <Mano texto="not zero." x={960} y={150} desde={k(259.1)} color="#f4efe4" tam={70} />
      <Mano texto="nothing." x={960} y={890} desde={k(259.9)} color={ROJO_OWEN} tam={80} />
    </AbsoluteFill>
  );
};

// ---------- 35 · la pulsera blanca de la Halden Clinic; baja en la 38 ----------
const Pulsera: React.FC<{ o: number }> = ({ o }) => (
  <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, opacity: o }}>
    <rect width={1920} height={1080} fill="#1d2230" opacity={0.85} />
    <path d="M-50,760 C400,700 760,640 1100,600 L1180,860 C820,900 420,960 -50,1000 Z" fill="#7d8086" />
    <path d="M1080,560 q160,-30 300,30 q60,40 40,120 q-20,90 -120,120 q-120,20 -200,-40 Z" fill="#c98e6a" />
    <path d="M1000,585 q40,-10 70,-4 l70,270 q-30,8 -70,4 Z" fill="#f6f6f2" stroke="#d6dae0" strokeWidth={4} />
    <g transform="translate(1040,720) rotate(-76)"><LogoHalden x={-120} y={0} s={0.55} /></g>
  </svg>
);
export const P35Pulsera: React.FC = () => {
  const f = useF();
  const k = kDe(262.9);
  const sale = k(273.0);
  const puertaT = (ff: number) => interpolate(ff, [sale, sale + 14, k(275.3), k(275.4)], [0, 1, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ab: Pas = {
    look: ABRIGO, seed: 51, caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: -1, y: -0.2 } }],
    ruta: [{ f: 0, x: ASIENTO_X(FILA_ABRIGO), y: BUS_PISO }, { f: sale, x: ASIENTO_X(FILA_ABRIGO), y: BUS_PISO }, { f: k(275.0), x: BUS_PUNTOS.puertaT + 40, y: BUS_PISO }],
    sentado: 0, levanta: sale, seVa: k(275.1),
  };
  const pulsera = interpolate(f, [k(267.2), k(267.6), k(272.4), k(272.8)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      {f < k(267.2) ? (
        <Marco x={0} y={0} w={1920} h={1080} radio={0} borde="#2a2e34"><AbrigoAtras cara="picaro" /></Marco>
      ) : (
        <EnBus cl={[mira(0, 2600, 650, 1.2), mira(k(275.4), 2300, 650, 1.25)]} hora="tarde" min={866} avance={() => 17000} puertaT={puertaT} paradas={[{ a: 17000, num: 38 }]}
          pas={[{ ...ab, poses: [{ f: 0, v: "sentado" }, { f: sale, v: "parado" }] }]} owen={{ caras: [{ f: 0, v: "miedo" }] }}
          hud={<Pildora texto="STOP 38" x={960} y={950} desde={k(272.7)} color="#f4efe4" />} />
      )}
      <Pulsera o={pulsera} />
      {pulsera > 0.5 && <Mano texto="Owen has the same one." x={560} y={200} desde={k(269.7)} color="#ffd27a" tam={60} />}
    </AbsoluteFill>
  );
};

// ---------- 36 · las puertas cierran, le tiemblan las manos ----------
export const P36Tiembla: React.FC = () => {
  const k = kDe(275.4);
  return (
    <EnBus cl={[mira(0, 290, BUS_PISO - 230, 2.7)]} hora="tarde" min={868} avance={(f) => 17000 + Math.max(0, f - 30) * 4}
      owen={{ caras: [{ f: 0, v: "miedo" }], giro: (f) => Math.sin(f * 1.9) * 0.06, miradas: [{ f: 0, v: { x: 0.1, y: 0.9 } }] }}
      hud={<Mano texto="his hands are shaking" x={1300} y={820} desde={k(276.4)} color="#f4efe4" tam={54} />} />
  );
};

// ---------- 37 · 4:30, fin del turno: vuelve a Paulina St ----------
export const P37Casa: React.FC = () => {
  const k = kDe(277.9);
  const fin = k(283.0);
  return (
    <Escena Set={TwoFlatFuera} pal={PAL} claves={[mira(0, 800, 560, 0.8), mira(fin, 1100, 560, 0.85, { curva: "inout" })]} seed={37} setProps={{ hora: "tarde" }}
      medio={<Actor look={OWEN} escala={ESC * 0.85} seed={1} ruta={[{ f: 0, x: 200, y: TF_PISO + 40 }, { f: k(281.6), x: TF_PUNTOS.puerta - 20, y: TF_PISO + 40 }, { f: fin, x: TF_PUNTOS.puerta, y: TF_PISO - 60 }]} caras={[{ f: 0, v: "cansado" }]} />}
      hud={<><Pildora texto="4:30 PM · SHIFT OVER" x={960} y={950} desde={k(278.0)} color="#f4efe4" /><HudOwen min={990} part="47/47" /></>} />
  );
};

// ---------- 38 · Rosa: no hay secreto, hay todos los días ----------
const SENT_POSE = { tronco: -4, pI: 88, rI: 88, pD: 92, rD: 92, hI: 30, cI: 95, hD: 40, cD: 90 };
export const P38Rosa: React.FC = () => {
  const f = useF();
  const k = kDe(283.1);
  const cose = Array.from({ length: 40 }).map((_, i) => ({ f: i * 20, v: { ...SENT_POSE, hD: 40 + (i % 2) * 14, cD: 90 - (i % 2) * 20 } }));
  const cl = [mira(0, 640, P - 260, 1.45), mira(k(287.5), 560, P - 260, 1.6, { curva: "inout" }), mira(k(302.6), 640, P - 260, 1.5, { curva: "inout" }), mira(k(307.7), 560, P - 270, 1.85, { curva: "inout" })];
  const notas: [string, number, number][] = [["2 miles to the market, every day", 287.6, 291.7], ["never owned a car", 291.8, 293.2], ["dinner at 5:00", 293.3, 294.6], ["bed 9:30 → up at 5:00", 294.7, 297.3], ["talks to half the block", 297.4, 299.4], ["sews with the same strong hands", 299.5, 302.6]];
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={38} setProps={{ hora: "tarde", luzBaño: false }}
      medio={<>
        <Actor look={ROSA} escala={ESC} seed={5} ruta={[{ f: 0, x: TF_PUNTOS.sillaRosa - 40, y: P }]} dir={[{ f: 0, v: 1 }]} poses={cose} asiento={[{ f: 0, v: 62 }]} caras={[{ f: 0, v: "feliz" }, { f: k(307.8), v: "risa" }]} habla={[[k(307.8), k(311.6)]]} miradas={[{ f: 0, v: { x: 0.4, y: 0.6 } }, { f: k(307.6), v: { x: 1, y: -0.2 } }]} />
        <Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: TF_PUNTOS.sillaOwen + 40, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "sentado" }, { f: k(296), v: { ...SENT_POSE, hD: 30, cD: 140, hI: 25, cI: 50 } }]} asiento={[{ f: 0, v: 62 }]} caras={[{ f: 0, v: "duda" }, { f: k(304), v: "feliz" }]} habla={[[k(305.8), k(307.6)]]} />
      </>}
      hud={<>
        <Etq cl={cl} x={TF_PUNTOS.sillaRosa - 40} y={P - 270} n={64} edad={81} desde={-20} tam={54} />
        {notas.map(([t, a, b], i) => <Mano key={i} texto={t} x={1380} y={240 + (i % 3) * 120} desde={k(a)} hasta={k(b) + 8} color="#ffd27a" tam={52} />)}
        <Mano texto="none of it is special." x={960} y={200} desde={k(302.7)} hasta={k(305.8)} color="#f4efe4" tam={64} />
        <Mano texto="all of it adds up." x={960} y={300} desde={k(304.2)} hasta={k(305.8)} color={VERDE} tam={64} />
        <Globo texto="What's your secret?" x={1150} y={330} desde={k(305.8)} hasta={k(307.7)} cola="abajo" tam={40} />
        <Globo texto="Mijo, there is no secret. There is just every day." x={760} y={300} desde={k(307.8)} hasta={k(311.9)} cola="abajo" tam={40} />
        <HudOwen min={1000 + Math.floor(f / 30) * 0} part="47/47" />
      </>} />
  );
};

// ---------- 39 · Dee (38, tiene 34) ----------
export const P39Dee: React.FC = () => {
  const k = kDe(311.9);
  const cl = [mira(0, 760, P - 250, 1.3), mira(k(315), 640, P - 260, 1.5, { curva: "inout" }), mira(k(320.0), 520, P - 280, 1.9, { curva: "inout" }), mira(k(325.8), 600, P - 260, 1.6, { curva: "inout" })];
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={39} setProps={{ hora: "noche", luzBaño: false }}
      medio={<>
        <Actor look={DEE} escala={ESC} seed={14} ruta={[{ f: 0, x: 1150, y: P }, { f: k(314.2), x: TF_PUNTOS.sillaRosa - 40, y: P }]} poses={[{ f: 0, v: "parado" }, { f: k(314.4), v: "sentado" }, { f: k(317.5), v: { ...SENT_POSE, hD: 30, cD: 115, hI: 30, cI: 115 } }, { f: k(327.6), v: { ...SENT_POSE, hD: 45, cD: 140, hI: 40, cI: 140 } }]} dir={[{ f: 0, v: -1 }, { f: k(314.3), v: 1 }]} asiento={[{ f: 0, v: undefined }, { f: k(314.3), v: 62 }]}
          caras={[{ f: 0, v: "cansado" }, { f: k(315.1), v: "duda" }, { f: k(321.3), v: "sorpresa" }, { f: k(326.0), v: "triste" }]} habla={[[k(315.5), k(317.4)]]} />
        <Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: TF_PUNTOS.sillaOwen + 60, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "parado" }, { f: k(318.5), v: "señalar" }, { f: k(320.6), v: "parado" }, { f: k(323.5), v: "hablar" }]} caras={[{ f: 0, v: "determinado" }]} habla={[[k(318.5), k(326.4)]]} />
      </>}
      hud={<>
        <Pildora texto="DEE · ER NURSE AT RUSH" x={960} y={950} desde={k(312.2)} hasta={k(318)} color="#f4efe4" />
        <Globo texto="Prove it." x={620} y={300} desde={k(315.5)} hasta={k(317.8)} cola="abajo" tam={40} />
        <Etq cl={cl} x={TF_PUNTOS.sillaRosa - 40} y={P - 280} n={38} edad={34} desde={k(320.2)} />
        <Mano texto="night shifts" x={1350} y={300} desde={k(323.5)} color="#ffd27a" tam={56} />
        <Mano texto="4 hours of sleep" x={1350} y={410} desde={k(324.7)} color="#ffd27a" tam={56} />
        <Mano texto="her doctor said the same thing last week" x={960} y={900} desde={k(327.7)} color="#f4efe4" tam={50} />
        <HudOwen min={1290} part="47/47" />
      </>} />
  );
};

export const P40SeMueven: React.FC = () => <AbsoluteFill><DosRelojes cal={50} bio={44} titulo="NOT A LIFE SENTENCE" /><HudOwen part="47/47" /></AbsoluteFill>;
export const P41Lista: React.FC = () => {
  const k = kDe(337.8);
  return (
    <AbsoluteFill>
      <ListaDia check titulo="WHAT READS YOUNGER" items={["sleep enough", "move every day", "don't smoke", "stay close to people"]} tiempos={[k(340.2), k(341.3), k(342.0), k(342.9)]} />
      <Mano texto="not overnight — but it moves." x={960} y={950} desde={k(344.7)} color={VERDE} tam={64} />
      <HudOwen part="47/47" />
    </AbsoluteFill>
  );
};

// ---------- 42 · 11 PM: 14 escalones y se queda sin aire ----------
export const P42Escalera: React.FC = () => {
  const f = useF();
  const k = kDe(346.8);
  const para = k(352.6);
  const ruta = [{ f: 0, x: 1150, y: P }, { f: k(347.8), ...escalon(0), curva: "lineal" as const }, ...[2, 4, 6].map((s, i) => ({ f: k(347.8) + Math.round(((i + 1) / 4) * (para - k(347.8))), ...escalon(s), curva: "lineal" as const })), { f: para, ...escalon(7), curva: "out" as const }];
  const jadeo = Math.sin(f / 4) * 3;
  const cl = [mira(0, 1350, P - 300, 1.2), mira(para, 1650, (P + A) / 2 - 220, 1.5, { curva: "inout" }), mira(k(361.5), 1660, (P + A) / 2 - 230, 1.9, { curva: "inout" })];
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={42} setProps={{ hora: "noche", luzCocina: false, luzBaño: false }}
      medio={<Actor look={OWEN} escala={ESC} seed={1} ruta={ruta} poses={[{ f: 0, v: "parado" }, { f: para, v: { tronco: 32, hD: 55, cD: 25, hI: 45, cI: 30, cabeza: -18 } }]} caras={[{ f: 0, v: "cansado" }, { f: para, v: "miedo" }]} ajuste={(p, ff) => (ff > para ? { ...p, tronco: p.tronco + jadeo } : p)} />}
      hud={<>
        <ManoMundo cl={cl} x={1460} y={P - 340} texto="14 steps" desde={k(349.7)} hasta={k(355)} color="#f4efe4" tam={56} />
        <Mano texto="17 miles × 2 — sitting down" x={960} y={920} desde={k(356.3)} color="#ffd27a" tam={56} />
        <HudOwen min={1380} part="47/47" />
      </>} />
  );
};

// ---------- 43 · el mensaje de la Dra. Hale · PARTICIPANTS 46/47 ----------
export const P43Mensaje: React.FC = () => {
  const k = kDe(361.6);
  const cambio = k(375.7);
  return (
    <AbsoluteFill>
      <Escena Set={TwoFlatCorte} pal={PAL} claves={[mira(0, 380, A - 200, 2.0)]} seed={43} setProps={{ hora: "noche", luzCocina: false, luzBaño: false, luzDorm: false }}
        medio={<Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: TF_PUNTOS.cama + 140, y: A }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "celular" }]} asiento={[{ f: 0, v: 110 }]} caras={[{ f: 0, v: "miedo" }]} />} />
      <AbsoluteFill style={{ background: "#05070d", opacity: 0.55 }} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <MensajeCel de="Halden Clinic · Dr. Imani Hale" texto={"Week 1 complete.\nThank you, participant 47.\nPlease do not discuss\nyour symptoms with anyone."} extra="PARTICIPANTS 46/47" desde={k(361.9)} extraDesde={cambio} />
      </svg>
      <Contador lineas={[{ etiqueta: "PARTICIPANTS", claves: "47/47", color: VERDE }]} tam={38} hasta={cambio} />
      <Contador lineas={[{ etiqueta: "PARTICIPANTS", claves: "46/47", color: ROJO_OWEN }]} tam={38} desde={cambio} />
      <Mano texto="someone dropped out today" x={1460} y={900} desde={k(377.3)} color="#f4efe4" tam={50} />
    </AbsoluteFill>
  );
};

// ---------- 44 · el número en la ventana oscura ----------
export const P44Ventana: React.FC = () => {
  const k = kDe(378.8);
  const cl = [mira(0, 60, A - 280, 2.2), mira(k(385), -20, A - 300, 2.8, { curva: "inout" })];
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={cl} seed={44} setProps={{ hora: "noche", luzCocina: false, luzBaño: false, luzDorm: true }}
      medio={<>
        <defs><clipPath id="ventnoche"><rect x={-120} y={A - 400} width={200} height={200} /></clipPath></defs>
        <g clipPath="url(#ventnoche)">
          <rect x={-120} y={A - 400} width={200} height={200} fill="#101830" />
          <Actor look={OWEN_CASA} escala={ESC * 0.9} seed={6} ruta={[{ f: 0, x: -10, y: A + 40 }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "triste" }, { f: k(382.6), v: "determinado" }]} opacidad={() => 0.55} />
        </g>
        <Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: 220, y: A }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "triste" }, { f: k(382.6), v: "determinado" }]} />
      </>}
      hud={<><Etq cl={cl} x={-10} y={A - 260} n={47} desde={k(381.6)} color={ROJO_OWEN} /><HudOwen min={1395} part="46/47" /></>} />
  );
};

// ---------- 45 · la semana que viene: baterías ----------
const BatMundo: React.FC<{ cl: ReturnType<typeof mira>[]; x: number; y: number; pct: number; desde: number; alerta?: boolean }> = ({ cl, x, y, pct, desde, alerta }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const p = enPantalla(cl, f, fps, x, y);
  const col = pct < 10 ? "#ff3d2e" : pct < 40 ? "#ffc24a" : VERDE;
  const on = !alerta || f % 16 < 10;
  const s = Math.min(1, (f - desde) / 8);
  return (
    <div style={{ position: "absolute", left: p.x, top: p.y, transform: `translate(-50%,-100%) scale(${s})`, textAlign: "center", fontFamily: F_HUD, opacity: on ? 1 : 0.35 }}>
      <svg width={110} height={50} viewBox="0 0 110 50"><rect x={3} y={3} width={94} height={44} rx={9} fill="rgba(10,12,18,0.7)" stroke={col} strokeWidth={5} /><rect x={99} y={16} width={8} height={18} rx={3} fill={col} /><rect x={10} y={10} width={80 * pct / 100} height={30} rx={5} fill={col} /></svg>
      <div style={{ fontWeight: 600, fontSize: 30, color: col, textShadow: "0 3px 8px rgba(0,0,0,0.7)" }}>{pct}%</div>
    </div>
  );
};
export const P45Baterias: React.FC = () => {
  const k = kDe(385.0);
  const cl = [mira(0, 1100, 640, 1.05), mira(k(393.4), 1900, 640, 1.3, { curva: "inout" })];
  const pas: Pas[] = [sent(SCRUBS, 2, { seed: 61 }), sent(OBRERO, 4, { seed: 62 }), sent(ESTUDIANTE, 6, { caras: [{ f: 0, v: "feliz" }], seed: 63 }), sent(SENORA, 7, { caras: [{ f: 0, v: "cansado" }], seed: 64 })];
  return (
    <EnBus cl={cl} hora="manana" part="46/47" min={400} avance={(f) => 2000 + f * 12} pas={pas} owen={{ caras: [{ f: 0, v: "sorpresa" }] }}
      hud={<>
        <Pildora texto="NEXT WEEK" x={960} y={170} desde={k(385.2)} color="#ffd27a" />
        <BatMundo cl={cl} x={ASIENTO_X(2)} y={BUS_PISO - 260} pct={72} desde={k(387.7)} />
        <BatMundo cl={cl} x={ASIENTO_X(4)} y={BUS_PISO - 260} pct={45} desde={k(388.2)} />
        <BatMundo cl={cl} x={ASIENTO_X(6)} y={BUS_PISO - 260} pct={91} desde={k(388.7)} />
        <BatMundo cl={cl} x={ASIENTO_X(7)} y={BUS_PISO - 260} pct={3} desde={k(393.5)} alerta />
      </>} />
  );
};

// ---------- 46 · CTA final ----------
export const P46Cta: React.FC = () => {
  const k = kDe(396.8);
  const cl = [mira(0, 560, 640, 1.5), mira(k(408), 600, 640, 1.62)];
  return (
    <EnBus cl={cl} hora="ocaso" part="46/47" min={1110} avance={() => 30000}
      pas={[sent(ABERNATHY, 3, { n: 58, edad: 72, desde: -10, caras: [{ f: 0, v: "feliz" }], seed: 2 })]}
      owen={{ caras: [{ f: 0, v: "feliz" }], giros: [{ f: 0, v: 0 }, { f: 30, v: 1 }], miradas: [{ f: 0, v: { x: 0, y: 0 } }] }}
      hud={<>
        <div style={{ position: "absolute", left: 960 + (ASIENTO_X(1) - 560) * 1.5, top: 540 + (BUS_PISO - 260 - 640) * 1.5, transform: "translate(-50%,-100%)", textAlign: "center", fontFamily: F_HUD, textShadow: "0 3px 10px rgba(0,0,0,0.7)" }}>
          <div style={{ fontWeight: 600, fontSize: 96, color: VERDE }}>??</div>
          <div style={{ fontWeight: 500, fontSize: 30, letterSpacing: 3, color: "#f4efe4" }}>YOUR REAL AGE</div>
        </div>
        <Pildora texto="What number would float over YOUR head?" x={960} y={170} desde={k(397.2)} color={VERDE} />
        <Pildora texto="TELL US IN THE COMMENTS · SUBSCRIBE" x={960} y={960} desde={k(402.8)} color="#f4efe4" />
      </>} />
  );
};

export { posRuta };
