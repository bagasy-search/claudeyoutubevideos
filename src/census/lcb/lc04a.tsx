// lc04 · planos 0:00-3:24,8 (SEC 1-8 del plan MxM: gancho, la granja, la primera cena, el reloj del verano,
// la cuenta de la papa, las semillas, Nan y los sobres, plantar). Cuadros locales: l(segundo global).
import React from "react";
import { interpolate, random } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Escena } from "../../anikit/escena";
import { Charco, Halo } from "../../anikit/luz";
import { PlanoM } from "../../anikit/montaje";
import { EtiquetaFlotante, Globo } from "../../anikit/pantalla";
import { Bolsa, Lata } from "../../anikit/props";
import { COCINA_PISO, Cocina, Silla } from "../../anikit/sets/cocina";
import { SUPER_PISO, Supermercado } from "../../anikit/sets/super";
import { ActorProps } from "../../anikit/actor";
import { GUS, JUNE, PAL, THEO } from "../elenco";
import { Auto } from "../mundo/comun";
import { A, Rotulo, T, loc } from "./comun_ep";
import { BEN, DEV, LILY, NAN, NINO, Ore, PRIYA, ROSA } from "./elenco_lcb";
import { GRANJA_PISO, Granja, Papa, PARED, PUERTA_GRANERO, Tractor } from "./granja";
import { Balanza, Bidon, BusEscolar, Cancha, Llamita, Pala, Primer, Puesto, RelojLatas, Sobre, SolCruza, Brocha, FotoVieja, horaCiclo } from "./piezas4";
import { MARCUS_VERANO, PortadaLc04 } from "./tarjetas";

const ap = (f: number, a: number, d = 10) => interpolate(f, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const P = GRANJA_PISO;
const Y = P + 60; // los pies sobre el camino de tierra
export const LOS10 = [MARCUS_VERANO, THEO, JUNE, GUS, ROSA, DEV, PRIYA, NAN, BEN, LILY];
const esNino = (i: number) => i >= 8;

// grupo de los 10 en fila (x0 + i*paso); `extra(i)` = props por persona
const Grupo: React.FC<{ x0: number; paso: number; y?: number; dir?: 1 | -1; extra?: (i: number) => Partial<ActorProps>; seed?: number; solo?: number[]; escala?: number }> = ({ x0, paso, y = Y, dir = 1, extra, seed = 0, solo, escala = 1 }) => (
  <>{LOS10.map((look, i) => (solo && solo.indexOf(i) < 0 ? null : <A key={i} look={look} escala={(esNino(i) ? NINO : 1) * escala} seed={seed + i * 7} ruta={[{ f: 0, x: x0 + i * paso, y }]} dir={[{ f: 0, v: dir }]} {...(extra ? extra(i) : {})} />))}</>
);
const Cartel40: React.FC<{ x: number }> = ({ x }) => (
  <g transform={`translate(${x},${P + 40})`}>
    <rect x={-8} y={-200} width={16} height={200} fill="#6a4a32" />
    <rect x={-150} y={-260} width={300} height={90} rx={6} fill="#f2e6cc" stroke="#6a4a32" strokeWidth={8} />
    <text x={0} y={-200} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={52} fill="#b8382c">40 ACRES</text>
  </g>
);

// ---------- SEC 1 · 0:00-4:9 · cuadro 0 = la miniatura; la promesa se desvanece y la cámara vuela bajo sobre el campo ----------
const Q01: React.FC = () => (
  <PortadaLc04 s0={0} desvanece={T(1.2)} hora="ocaso"
    claves={[mira(0, 3180, 600, 0.88), mira(T(1.2), 3200, 610, 0.9), mira(T(4.9), 4300, 760, 1.25, { curva: "inout" })]} />
);

// ---------- 4:9-10:2 · la cámara llega a la pared del granero; «7,000,000» pintado ----------
const Q02: React.FC = () => {
  const l = loc(4.9);
  return (
    <Escena Set={Granja} pal={PAL} seed={41} mano={2}
      setProps={{ hora: "ocaso", estacion: "verano", crec: 1, humo: 0.5, pared: [{ t: "7,000,000", desde: l(9.0), x: PARED.x + 14, y: PARED.y + 200, tam: 50, color: "#b8382c", vel: 0.8 }, { t: "KCAL / YEAR", desde: l(9.6), x: PARED.x + 40, y: PARED.y + 270, tam: 32, vel: 0.8 }] }}
      claves={[mira(0, 3300, 640, 0.9), mira(l(8.7), 1010, 520, 1.9, { curva: "inout" }), mira(l(10.2), 1010, 515, 2.0)]} />
  );
};

// ---------- 10:2-13:2 · los 10 pasan cargando cosas, una llamita «2,000/day» sobre cada uno ----------
const Q03: React.FC = () => {
  const f = useF();
  const l = loc(10.2);
  const dx = interpolate(f, [0, l(13.2)], [0, 260]);
  return (
    <Escena Set={Granja} pal={PAL} seed={42} setProps={{ hora: "ocaso", estacion: "verano", crec: 1, humo: 0.5 }}
      claves={[mira(0, 3520, 600, 0.95), mira(l(13.2), 3640, 600, 0.98)]}
      medio={<>
        {LOS10.map((look, i) => { const x = 2700 + i * 165 + dx; const n = esNino(i); return <g key={i}>
          <A look={look} escala={n ? NINO : 1} seed={i * 5} ruta={[{ f: 0, x: 2700 + i * 165, y: Y }, { f: l(13.2), x: 2700 + i * 165 + 260, y: Y }]} dir={[{ f: 0, v: 1 }]}
            enManoD={i % 3 === 0 ? <Bolsa color="#c9a26a" /> : i % 3 === 1 ? <Lata s={0.9} /> : undefined} />
          <Llamita x={x} y={Y - (n ? 330 : 440)} f={f} o={ap(f, l(10.6) + i * 3, 6)} />
        </g>; })}
      </>}
    />
  );
};

// ---------- 13:2-16:9 · tilt abajo: el suelo en corte, las papas bajo tierra (KCAL rueda a 0) ----------
const Q04: React.FC = () => {
  const f = useF();
  const l = loc(13.2);
  return (
    <Escena Set={Granja} pal={PAL} seed={43} setProps={{ hora: "ocaso", estacion: "verano", crec: 1, corte: ap(f, l(13.6), 24), papas: 1 }}
      claves={[mira(0, 3800, 600, 1.0), mira(l(14.2), 3800, 640, 1.0), mira(l(16.0), 3800, 1010, 1.15, { curva: "inout" }), mira(l(16.9), 3820, 1020, 1.2)]}
      hud={<Rotulo texto="OUT OF THE GROUND" x={1240} y={170} centro desde={l(15.6)} color="#ffcf6e" tam={72} />} />
  );
};

// ---------- 16:9-22:9 · los 10 frente al campo pelado; la pregunta en el cielo ----------
const Q05: React.FC = () => {
  const l = loc(16.9);
  return (
    <Escena Set={Granja} pal={PAL} seed={44} setProps={{ hora: "dia", estacion: "barro", crec: 0, humo: 0.6 }}
      claves={[mira(0, 3300, 560, 0.85), mira(l(22.9), 3360, 540, 0.9)]}
      medio={<Grupo x0={2650} paso={150} extra={(i) => ({ caras: [{ f: 0, v: i === 0 ? "determinado" : "duda" }], miradas: [{ f: 0, v: { x: 0.7, y: 0.2 } }], poses: [{ f: 0, v: i % 3 === 0 ? "manosCintura" : i % 3 === 1 ? "brazosCruzados" : "parado" }] })} />}
      hud={<Rotulo texto={"Can 10 people grow\na year of food?"} x={1240} y={130} centro desde={l(17.6)} color="#f6ecd2" tam={80} />} />
  );
};

// ---------- SEC 2 · 23:0-28:0 · las 3 camionetas entran a la granja por el camino de tierra ----------
const Q06: React.FC = () => {
  const f = useF();
  const l = loc(23.0);
  const entra = (k: number) => interpolate(f, [l(23.2 + k * 0.5), l(27.0 + k * 0.4)], [-1400, 1700 - k * 560], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - (1 - t) * (1 - t) });
  return (
    <Escena Set={Granja} pal={PAL} seed={45} setProps={{ hora: "dia", estacion: "barro", crec: 0, humo: 1 }}
      claves={[mira(0, 400, 600, 0.75), mira(l(28.0), 1100, 600, 0.78, { curva: "inout" })]}
      frente={<>{[0, 1, 2].map((k) => <Auto key={k} x={entra(k)} y={P + 160} color={["#2f4a5e", "#6a2f36", "#c9b48a"][k]} tipo="pickup" s={1.6} dir={1} />)}</>} />
  );
};

// ---------- 28:0-31:5 · travelling: «40 ACRES», el granero, la casa con humo ----------
const Q07: React.FC = () => {
  const l = loc(28.0);
  return (
    <Escena Set={Granja} pal={PAL} seed={46} setProps={{ hora: "dia", estacion: "barro", crec: 0, humo: 1 }}
      claves={[mira(0, -500, 600, 1.1), mira(l(29.4), 80, 560, 1.0, { curva: "inout" }), mira(l(31.5), 1250, 520, 0.95, { curva: "inout" })]}
      medio={<Cartel40 x={-560} />} />
  );
};

// ---------- 31:5-34:0 · Dev junto al tractor: 1974 / 20 ----------
const Q08: React.FC = () => {
  const l = loc(31.5);
  return (
    <Escena Set={Granja} pal={PAL} seed={47} setProps={{ hora: "dia", estacion: "barro", crec: 0 }}
      claves={[mira(0, 2160, 650, 1.35), mira(l(34.0), 2170, 650, 1.42)]}
      medio={<>
        <Tractor x={2000} y={Y} s={1.1} />
        <A look={DEV} ruta={[{ f: 0, x: 2330, y: Y }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "picaro" }]} poses={[{ f: 0, v: "manosCintura" }]} miradas={[{ f: 0, v: { x: -0.7, y: 0 } }]} />
      </>}
      hud={<>
        <Rotulo texto="TRACTOR · BUILT 1974" x={1240} y={150} centro desde={l(32.0)} color="#ffcf6e" tam={60} />
        <EtiquetaFlotante x={1560} y={330} rotulo="DEV · AGE" claves={20} desde={l(32.8)} color="#9bd8ff" tam={60} />
      </>} />
  );
};

// ---------- 34:0-37:5 · Marcus apoyado en el tractor; recuerdo de 20 años de fardos y choclo ----------
const Q09: React.FC = () => {
  const f = useF();
  const l = loc(34.0);
  const rec = ap(f, l(34.6), 14) * (1 - ap(f, l(37.0), 10));
  return (
    <Escena Set={Granja} pal={PAL} seed={48} setProps={{ hora: rec > 0.5 ? "ocaso" : "dia", estacion: rec > 0.5 ? "verano" : "barro", crec: rec > 0.5 ? 1 : 0 }}
      claves={[mira(0, 2100, 620, 1.25), mira(l(37.5), 2140, 620, 1.3)]}
      medio={<>
        {rec > 0 && <g opacity={rec}>{Array.from({ length: 7 }).map((_, i) => <g key={i}><rect x={2600 + i * 120} y={Y - 110} width={100} height={90} rx={30} fill="#e2c060" /><rect x={2600 + i * 120} y={Y - 75} width={100} height={6} fill="#c9a340" /></g>)}</g>}
        <Tractor x={2000} y={Y} s={1.1} />
        <A look={MARCUS_VERANO} ruta={[{ f: 0, x: 2230, y: Y }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "neutral" }]} poses={[{ f: 0, v: { tronco: -8, hI: 80, cI: 30, hD: 20, cD: 80 } }]} miradas={[{ f: 0, v: { x: 0.6, y: -0.1 } }]} />
      </>}
      hud={<Rotulo texto="20 YEARS · HAY & SWEET CORN" x={1240} y={170} centro desde={l(34.8)} hasta={l(37.4)} color="#ffcf6e" tam={64} />} />
  );
};

// ---------- 37:5-40:5 · plano medio de Marcus mirando a los 10 que bajan de las camionetas ----------
const Q10: React.FC = () => {
  const l = loc(37.5);
  return (
    <Escena Set={Granja} pal={PAL} seed={49} setProps={{ hora: "dia", estacion: "barro", crec: 0, humo: 1 }}
      claves={[mira(0, 2150, 640, 1.45), mira(l(40.5), 2160, 630, 1.52)]}
      medio={<>
        {[0, 1].map((k) => <Auto key={k} x={2500 + k * 560} y={P + 70} color={["#2f4a5e", "#6a2f36"][k]} tipo="pickup" s={1.2} dir={1} />)}
        <Grupo x0={2300} paso={95} solo={[1, 2, 3, 4, 5, 6, 7, 8, 9]} extra={(i) => ({ ruta: [{ f: 0, x: 2420 + i * 95, y: Y - 10 }, { f: l(40.5), x: 2380 + i * 95, y: Y - 10 }], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "cansado" }] })} escala={0.9} />
        <A look={MARCUS_VERANO} ruta={[{ f: 0, x: 1820, y: Y }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "duda" }, { f: l(39.0), v: "determinado" }]} poses={[{ f: 0, v: "brazosCruzados" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0 } }]} />
      </>}
      hud={<Rotulo texto="NOBODY HAS. NOT AROUND HERE." x={960} y={900} centro desde={l(38.8)} color="#f6ecd2" tam={56} brillo={false} />} />
  );
};

// ---------- SEC 3 · 40:5-43:5 · la foto vieja de la granja: «100 YEARS» ----------
const Q11: React.FC = () => {
  const l = loc(40.5);
  return (
    <Escena Set={Primer} pal={PAL} seed={50} setProps={{ fondo: "pared", luz: "#ffb46a" }}
      claves={[mira(0, 960, 520, 1.0), mira(l(43.5), 960, 520, 1.12)]}
      medio={<FotoVieja x={960} y={500} s={2.2} />}
      hud={<Rotulo texto="NOT FOR 100 YEARS" x={960} y={890} centro desde={l(40.8)} color="#ffcf6e" tam={76} />} />
  );
};

// mesa larga de la cocina con los 10 sentados (opcional: Marcus de pie en la cabecera)
const MesaLarga: React.FC<{ f: number; marcusDePie?: number; levanta?: number; caras?: (i: number) => string }> = ({ f, marcusDePie, levanta, caras }) => {
  const PS = COCINA_PISO;
  const lugares = [[1880, -1], [520, 1], [700, 1], [880, 1], [1060, 1], [1240, -1], [1420, -1], [1600, -1], [1000, 1], [1300, -1]];
  return (
    <>
      {[560, 760, 960, 1180, 1380, 1580].map((sx, i) => <Silla key={i} x={sx} piso={PS} dir={i < 3 ? 1 : -1} color="#b07a4a" />)}
      {LOS10.map((look, i) => {
        if (i >= 8) return null;
        const [x, d] = lugares[i];
        const dePie = i === 0 && marcusDePie !== undefined && f >= marcusDePie;
        return <A key={i} look={look} seed={i * 3} ruta={[{ f: 0, x, y: PS }]} dir={[{ f: 0, v: d as 1 | -1 }]} asiento={dePie ? undefined : [{ f: 0, v: 104 }]}
          poses={[{ f: 0, v: dePie ? (levanta !== undefined && f >= levanta ? { hD: 160, cD: 20 } : "parado") : { tronco: 6, pI: 88, rI: 88, pD: 92, rD: 92, hD: 50, cD: 70 } }]}
          caras={[{ f: 0, v: (caras ? caras(i) : "neutral") as never }]} miradas={[{ f: 0, v: { x: i === 0 ? -0.8 : d * 0.6, y: 0.2 } }]}
          enManoD={i === 0 && levanta !== undefined && f >= levanta ? <Lata s={1.2} color="#e0563a" /> : undefined} />;
      })}
      {/* mellizos de pie al costado, más chicos */}
      <A look={BEN} escala={NINO} ruta={[{ f: 0, x: 380, y: PS }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "feliz" }]} enManoD={<Lata s={0.8} />} />
      <A look={LILY} escala={NINO} ruta={[{ f: 0, x: 300, y: PS }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "feliz" }]} />
      <rect x={480} y={PS - 190} width={1340} height={22} rx={6} fill="#8a5e3c" />
      <rect x={500} y={PS - 168} width={16} height={168} fill="#6a4a32" /><rect x={1784} y={PS - 168} width={16} height={168} fill="#6a4a32" />
      {Array.from({ length: 9 }).map((_, i) => <Lata key={i} x={560 + i * 140} y={PS - 190} s={0.8} color={["#e0563a", "#f1c24a", "#5aa0d8", "#7fc46a"][i % 4]} />)}
      <Halo x={1150} y={PS - 520} r={700} color="#ffcf8a" fuerza={0.4} />
    </>
  );
};

// ---------- 43:5-47:0 · los 10 en la mesa larga, comiendo de latas ----------
const Q12: React.FC = () => {
  const f = useF();
  const l = loc(43.5);
  return (
    <Escena Set={Cocina} pal={PAL} seed={51} claves={[mira(0, 1150, 600, 0.95), mira(l(47.0), 1150, 610, 1.0)]}
      medio={<MesaLarga f={f} caras={(i) => (i % 2 ? "feliz" : "neutral")} />}
      hud={<Rotulo texto="NOT GOING TO STARVE THIS YEAR" x={1240} y={160} centro desde={l(44.8)} color="#7cd36a" tam={52} />} />
  );
};

// ---------- 47:0-50:2 · recuerdo: las góndolas de Duluth siguen llenas ----------
const Q13: React.FC = () => {
  const l = loc(47.0);
  return (
    <Escena Set={Supermercado} pal={PAL} seed={52} claves={[mira(0, 700, 540, 0.95), mira(l(50.2), 2500, 540, 0.95, { curva: "inout" })]}
      hud={<Rotulo texto="CANS · RICE · PASTA" x={1240} y={160} centro desde={l(47.6)} color="#ffcf6e" tam={70} />} />
  );
};

// ---------- 50:2-57:5 · Marcus se para en la cabecera, levanta una lata: «The cans are not food.» ----------
const Q14: React.FC = () => {
  const f = useF();
  const l = loc(50.2);
  return (
    <Escena Set={Cocina} pal={PAL} seed={53}
      claves={[mira(0, 1250, 600, 1.05), mira(l(51.0), 1300, 600, 1.1), mira(l(54.0), 1880, 580, 1.7, { curva: "inout" }), mira(l(57.5), 1885, 575, 1.78)]}
      medio={<MesaLarga f={f} marcusDePie={l(50.8)} levanta={l(54.2)} caras={(i) => (i === 0 ? "determinado" : "duda")} />}
      hud={<Globo texto="The cans are not food." x={760} y={260} desde={l(55.0)} hasta={l(57.5)} cola="der" tam={64} />} />
  );
};

// ---------- 57:5-64:0 · la pila de latas se vuelve reloj de arena; caen de a una ----------
const Q15: React.FC = () => {
  const f = useF();
  const l = loc(57.5);
  return (
    <Escena Set={Primer} pal={PAL} seed={54} setProps={{ fondo: "madera" }}
      claves={[mira(0, 960, 540, 0.86), mira(l(64.0), 960, 540, 0.98, { curva: "inout" })]}
      medio={<RelojLatas x={820} y={540} s={0.95} k={interpolate(f, [l(58.6), l(63.8)], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} f={f} />}
      hud={<><Rotulo texto="TIME" x={1400} y={300} desde={l(58.0)} color="#ffcf6e" tam={110} /><Rotulo texto="A FEW YEARS OF IT" x={1400} y={430} desde={l(59.4)} color="#f6ecd2" tam={48} brillo={false} /></>} />
  );
};

// ---------- 64:0-69:1 · los 10 se miran; Theo asiente ----------
const Q16: React.FC = () => {
  const f = useF();
  const l = loc(64.0);
  return (
    <Escena Set={Cocina} pal={PAL} seed={55} claves={[mira(0, 1150, 580, 1.15), mira(l(69.1), 1150, 570, 1.22)]}
      medio={<MesaLarga f={f} caras={(i) => (i === 1 && f > l(66.8) ? "determinado" : "duda")} />}
      hud={<Rotulo texto="A FULL YEAR OF FOOD. ON PURPOSE." x={1240} y={150} centro desde={l(65.0)} color="#ffcf6e" tam={50} />} />
  );
};

// ---------- SEC 4 · 69:1-71:8 · día 240, fines de mayo: charcos y pasto nuevo ----------
const Q17: React.FC = () => {
  const l = loc(69.1);
  return (
    <Escena Set={Granja} pal={PAL} seed={56} setProps={{ hora: "dia", estacion: "barro", crec: 0, humo: 0.4 }}
      claves={[mira(0, 3400, 640, 0.8), mira(l(71.8), 3300, 640, 0.84)]}
      medio={<>{[[3200, 160], [3700, 220], [4300, 140], [2700, 120]].map(([x, r], i) => <ellipse key={i} cx={x} cy={Y + 30 + (i % 2) * 20} rx={r} ry={22} fill="#8ab4d8" opacity={0.75} />)}<Charco x={3600} y={Y} rx={900} color="#fff3d6" fuerza={0.2} /></>}
      hud={<Rotulo texto="LATE MAY" x={1240} y={170} centro desde={l(69.6)} color="#f6ecd2" tam={72} />} />
  );
};

// ---------- 71:8-88:8 · el reloj del verano en la puerta del granero; Marcus pinta DAYS LEFT 115 ----------
const D = PUERTA_GRANERO;
const Q18: React.FC = () => {
  const f = useF();
  const l = loc(71.8);
  const x0 = D.x + 26, x1 = D.x + D.w - 26, yb = D.y + 70;
  const sol = interpolate(f, [l(79.6), l(81.8)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const copo = (x: number, a: number, t: string) => { const k = ap(f, a, 8); return k > 0 ? <g opacity={k} transform={`translate(${x},${yb - 30}) scale(${0.6 + 0.4 * k})`}>{[0, 60, 120].map((r) => <rect key={r} x={-2} y={-18} width={4} height={36} fill="#5a9ad8" transform={`rotate(${r})`} />)}<text y={44} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={16} fill="#2a1c18">{t}</text></g> : null; };
  const brocha = f > l(84.0) && f < l(88.0);
  return (
    <Escena Set={Granja} pal={PAL} seed={57} mano={1.5}
      setProps={{ hora: "dia", estacion: "barro", crec: 0, pared: [{ t: "DAYS LEFT", desde: l(84.3), x: D.x + 30, y: D.y + 190, tam: 34, vel: 0.9 }, { t: "IN SUMMER", desde: l(85.0), x: D.x + 24, y: D.y + 232, tam: 34, vel: 0.9 }, { t: "115", desde: l(86.6), x: D.x + 56, y: D.y + 330, tam: 84, color: "#b8382c", vel: 1.6 }] }}
      claves={[mira(0, D.x + 40, 560, 2.6), mira(l(72.6), D.x + 40, 560, 2.7), mira(l(76.6), D.x + 190, 560, 2.7, { curva: "inout" }), mira(l(79.4), D.x + 115, 580, 2.3, { curva: "inout" }), mira(l(83.6), D.x + 115, 585, 2.35), mira(l(84.4), D.x + 190, 680, 1.45, { curva: "inout" }), mira(l(88.8), D.x + 190, 670, 1.5)]}
      medio={<>
        <rect x={x0} y={yb - 6} width={x1 - x0} height={12} rx={6} fill="#c9b48a" />
        <rect x={x0} y={yb - 6} width={(x1 - x0) * sol} height={12} rx={6} fill="#f2b81e" />
        {sol > 0 && <Halo x={x0 + (x1 - x0) * sol} y={yb} r={60} color="#fff0a0" fuerza={0.7} />}
        {copo(x0, l(72.4), "MAY 20")}{copo(x1, l(76.6), "SEP 15")}
        <A look={MARCUS_VERANO} ruta={[{ f: 0, x: D.x + D.w + 120, y: P - 20 }]} dir={[{ f: 0, v: -1 }]} opacidad={(ff) => ap(ff, l(83.8), 6)}
          poses={[{ f: 0, v: brocha ? { hD: 120 + Math.sin(f / 3) * 14, cD: 40 } : "parado" }]} caras={[{ f: 0, v: "determinado" }]} enManoD={<Brocha />} />
      </>}
      hud={<Rotulo texto="110-120 DAYS" x={1240} y={140} centro desde={l(80.4)} hasta={l(83.8)} color="#ffcf6e" tam={88} />} />
  );
};

// ---------- 88:8-90:4 · Marcus se da vuelta hacia el campo ----------
const Q19: React.FC = () => {
  const l = loc(88.8);
  return (
    <Escena Set={Granja} pal={PAL} seed={58} setProps={{ hora: "dia", estacion: "barro", crec: 0, pared: [{ t: "DAYS LEFT", desde: -99, x: D.x + 30, y: D.y + 190, tam: 34 }, { t: "IN SUMMER", desde: -99, x: D.x + 24, y: D.y + 232, tam: 34 }, { t: "115", desde: -99, x: D.x + 56, y: D.y + 330, tam: 84, color: "#b8382c" }] }}
      claves={[mira(0, 1900, 620, 1.2), mira(l(90.4), 2500, 620, 1.0, { curva: "inout" })]}
      medio={<A look={MARCUS_VERANO} ruta={[{ f: 0, x: 1800, y: P - 20 }, { f: l(89.2), x: 1800, y: P - 20 }, { f: l(90.4), x: 2050, y: Y }]} dir={[{ f: 0, v: -1 }, { f: l(89.2), v: 1 }]} caras={[{ f: 0, v: "determinado" }]} enManoD={<Brocha />} />} />
  );
};

// ---------- SEC 5 · 90:4-95:0 · una papa gigante rueda al centro del campo ----------
const Q20: React.FC = () => {
  const f = useF();
  const l = loc(90.4);
  const x = interpolate(f, [l(91.0), l(93.6)], [5600, 3900], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  const bote = Math.abs(Math.sin(interpolate(f, [l(91.0), l(93.6)], [0, Math.PI * 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))) * 40 * (1 - ap(f, l(93.0), 18));
  return (
    <Escena Set={Granja} pal={PAL} seed={59} setProps={{ hora: "dia", estacion: "barro", crec: 0 }}
      claves={[mira(0, 3900, 600, 0.82), mira(l(93.6), 3900, 580, 0.88), mira(l(95.0), 3900, 560, 0.95)]}
      medio={<>
        <Halo x={x} y={P - 220} r={500} color="#ffb04a" fuerza={0.3} />
        <Papa x={x} y={P - 230 - bote} s={10} rot={-(5600 - x) / 3} />
        {f > l(93.4) && Array.from({ length: 8 }).map((_, i) => { const t = ap(f, l(93.4), 20); return <circle key={i} cx={3900 + (i - 4) * 60 * (0.4 + t)} cy={P - 20 - t * 60 * (1 + (i % 3))} r={20 * (1 - t) + 6} fill="#8a6a48" opacity={1 - t} />; })}
      </>}
      hud={<Rotulo texto="THE POTATO" x={1240} y={150} centro desde={l(94.0)} color="#ffcf6e" tam={100} />} />
  );
};

// ---------- 95:0-98:8 · balanza: 1 LB = 350 KCAL ----------
const Q21: React.FC = () => {
  const f = useF();
  const l = loc(95.0);
  return (
    <Escena Set={Primer} pal={PAL} seed={60} setProps={{ fondo: "madera" }} claves={[mira(0, 960, 600, 1.0), mira(l(98.8), 960, 600, 1.12)]}
      medio={<>
        <Balanza x={960} y={900} s={1.7} aguja={0.5 * ap(f, l(95.6), 14)} />
        <Papa x={960} y={900 - 1.7 * 206 - 40 - (1 - ap(f, l(95.4), 8)) * 300} s={3.6} rot={-10} />
      </>}
      hud={<Rotulo texto="1 LB = 350 KCAL" x={1240} y={150} centro desde={l(96.4)} color="#ffcf6e" tam={90} />} />
  );
};

// ---------- 98:8-107:3 · el pie cuadrado con hilo y estacas → la grilla se multiplica hasta el acre ----------
const Q22: React.FC = () => {
  const f = useF();
  const l = loc(98.8);
  const L = 360; // 1 pie
  const grilla = ap(f, l(104.4), 30);
  return (
    <Escena Set={Primer} pal={PAL} seed={61} setProps={{ fondo: "tierra" }} mano={1}
      claves={[mira(0, 960, 540, 1.6), mira(l(99.6), 960, 540, 1.8), mira(l(104.4), 960, 540, 2.0), mira(l(107.3), 960, 540, 0.1, { curva: "inout" })]}
      medio={<>
        <rect x={-30000} y={-30000} width={62000} height={62000} fill="#5a3a28" />
        {grilla > 0 && <g opacity={grilla}>{Array.from({ length: 121 }).map((_, i) => <g key={i}><rect x={960 - L / 2 + (i - 60) * L - 4} y={-25000} width={8 + 30 * grilla} height={50000} fill="#e9dcc0" opacity={0.55} /><rect y={540 - L / 2 + (i - 60) * L - 4} x={-25000} height={8 + 30 * grilla} width={50000} fill="#e9dcc0" opacity={0.55} /></g>)}</g>}
        {[[0, 0], [1, 0], [1, 1], [0, 1]].map(([a, b], i) => { const k = ap(f, l(99.0) + i * 4, 6); return <g key={i} opacity={k}><rect x={960 - L / 2 + a * L - 9} y={540 - L / 2 + b * L - 9} width={18} height={18} fill="#c9a36a" stroke="#6a4a32" strokeWidth={4} /></g>; })}
        <rect x={960 - L / 2} y={540 - L / 2} width={L} height={L} fill="none" stroke="#f6efe0" strokeWidth={5} strokeDasharray={`${4 * L * ap(f, l(99.6), 20)} 9999`} />
        {[[900, 500, 0.9], [1030, 600, 1.1]].map(([x, y, s], i) => { const k = ap(f, l(101.6) + i * 14, 8); return k > 0 ? <Papa key={i} x={x} y={y} s={(s as number) * 2 * k} rot={i * 50} /> : null; })}
      </>}
      hud={<>
        <Rotulo texto="1 SQ FT = ½ – 1 LB" x={1240} y={96} centro desde={l(100.4)} hasta={l(104.4)} color="#ffcf6e" tam={76} />
        <Rotulo texto="43,560 SQ FT" x={960} y={440} centro desde={l(105.6)} color="#ffcf6e" tam={120} />
        <Rotulo texto="= 1 ACRE" x={960} y={590} centro desde={l(106.3)} color="#f6ecd2" tam={64} brillo={false} />
      </>} />
  );
};

// ---------- 107:3-116:8 · una montaña de papas al lado del granero (la barra KCAL se llena en el HUD) ----------
const Q23: React.FC = () => {
  const f = useF();
  const l = loc(107.3);
  const n = Math.floor(interpolate(f, [l(107.8), l(111.6)], [0, 150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <Escena Set={Granja} pal={PAL} seed={62} setProps={{ hora: "ocaso", estacion: "verano", crec: 1 }}
      claves={[mira(0, 2050, 560, 1.0), mira(l(111.6), 2050, 520, 1.08), mira(l(116.8), 2050, 510, 1.12)]}
      medio={<>
        {Array.from({ length: n }).map((_, i) => { const fl = Math.floor(Math.sqrt(i)); const ancho = Math.max(60, 520 - fl * 40); return <Papa key={i} x={2000 + (random(`mx${i}`) - 0.5) * ancho} y={P + 30 - fl * 26 + random(`my${i}`) * 10} s={1.4} rot={random(`mr${i}`) * 180} />; })}
      </>}
      hud={<>
        <Rotulo texto="~20,000 LB" x={1240} y={170} centro desde={l(109.6)} color="#ffcf6e" tam={100} />
        <Rotulo texto="≈ WHAT 10 PEOPLE NEED" x={960} y={900} centro desde={l(113.8)} color="#7cd36a" tam={60} />
      </>} />
  );
};

// ---------- 116:8-120:1 · vista aérea: el acre al lado de una cancha de fútbol americano ----------
const Q24: React.FC = () => {
  const l = loc(116.8);
  return (
    <Escena Set={Primer} pal={PAL} seed={63} setProps={{ fondo: "verde" }} claves={[mira(0, 960, 560, 1.0), mira(l(120.1), 960, 560, 0.92)]}
      medio={<>
        <rect x={280} y={300} width={500} height={500} fill="#5a3a28" stroke="#f2c14a" strokeWidth={8} />
        {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={290} y={320 + i * 40} width={480} height={18} rx={9} fill="#4f9a3c" />)}
        <Cancha x={900} y={330} w={860} h={440} />
      </>}
      hud={<>
        <Rotulo texto="1 ACRE" x={530} y={150} centro desde={l(117.0)} color="#ffcf6e" tam={70} />
        <Rotulo texto="FOOTBALL FIELD" x={1330} y={150} centro desde={l(118.2)} color="#f6ecd2" tam={60} brillo={false} />
      </>} />
  );
};

// ---------- SEC 6 · 120:1-124:3 · no se plantan semillas: se planta la papa cortada con ojos ----------
const Q25: React.FC = () => {
  const f = useF();
  const l = loc(120.1);
  const abre = ap(f, l(121.6), 14);
  return (
    <Escena Set={Primer} pal={PAL} seed={64} setProps={{ fondo: "madera" }} claves={[mira(0, 960, 560, 1.0), mira(l(124.3), 960, 560, 1.1)]}
      medio={<>
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <Papa key={i} x={960 + a * 110 * abre} y={560 + b * 70 * abre} s={4.6} rot={i * 20} brotes={abre} />)}
        <g transform={`translate(${1400 - abre * 80},${360 + abre * 60}) rotate(${-30 + abre * 20})`}><rect x={-14} y={-200} width={28} height={110} rx={8} fill="#3a2a22" /><path d="M-12,-90 L12,-90 L8,160 L-12,120 Z" fill="#c9cfd6" /></g>
      </>}
      hud={<Rotulo texto="YOU PLANT POTATOES" x={1240} y={150} centro desde={l(122.4)} color="#ffcf6e" tam={80} />} />
  );
};

// ---------- 124:3-127:7 · papa de supermercado: TREATED ✗ ----------
const Q26: React.FC = () => {
  const f = useF();
  const l = loc(124.3);
  const x = ap(f, l(125.6), 8);
  return (
    <Escena Set={Primer} pal={PAL} seed={65} setProps={{ fondo: "madera" }} claves={[mira(0, 960, 560, 1.0), mira(l(127.7), 960, 560, 1.08)]}
      medio={<>
        <Papa x={960} y={600} s={6} rot={-6} />
        <g transform="translate(960,520) rotate(-8)" opacity={ap(f, l(124.8), 6)}><rect x={-190} y={-50} width={380} height={100} rx={10} fill="none" stroke="#c0352c" strokeWidth={10} /><text y={26} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={72} fill="#c0352c">TREATED</text></g>
        {x > 0 && <path d={`M760,340 L${760 + 400 * x},${340 + 460 * x} M1160,340 L${1160 - 400 * x},${340 + 460 * x}`} stroke="#e23a2e" strokeWidth={30} strokeLinecap="round" />}
      </>}
      hud={<Rotulo texto="WON'T SPROUT" x={1240} y={150} centro desde={l(126.0)} color="#e23a2e" tam={80} />} />
  );
};

// ---------- 127:7-135:5 · Rosa revisa bolsas en un puesto de ruta, buscando ojos ----------
const Q27: React.FC = () => {
  const f = useF();
  const l = loc(127.7);
  return (
    <Escena Set={Granja} pal={PAL} seed={66} setProps={{ hora: "dia", estacion: "barro", crec: 0 }}
      claves={[mira(0, 3500, 620, 1.35), mira(l(131.5), 3520, 640, 1.5, { curva: "inout" }), mira(l(135.5), 3560, 650, 1.55)]}
      medio={<>
        <Puesto x={3500} y={Y - 10} cartel="FARM STAND" />
        <A look={ROSA} ruta={[{ f: 0, x: 3200, y: Y }, { f: l(129.6), x: 3380, y: Y }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: "parado" }, { f: l(129.6), v: "agacharse" }, { f: l(131.4), v: { hD: 120, cD: 60 } }]} caras={[{ f: 0, v: "duda" }, { f: l(131.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.6, y: 0.4 } }, { f: l(131.4), v: { x: 0.3, y: -0.4 } }]}
          enManoD={(ff) => (ff > l(131.2) ? <Papa x={0} y={0} s={1.3} brotes={ap(f, l(131.8), 14)} /> : null)} />
      </>}
      hud={<><Rotulo texto="20 MILES" x={1240} y={150} centro desde={l(130.0)} color="#ffcf6e" tam={74} /><Rotulo texto="LOOKING FOR EYES" x={960} y={900} centro desde={l(132.0)} color="#7cd36a" tam={58} /></>} />
  );
};

// ---------- 135:5-139:8 · tres lugares: ORGANIC · GARDEN CENTER · PROCTOR FARM SUPPLY ----------
const Lugar: React.FC<{ s0: number; s1: number; cartel: string; color: string; sup?: boolean }> = ({ s0, s1, cartel, color, sup }) => {
  const l = loc(s0);
  const rosa = <A look={ROSA} ruta={[{ f: 0, x: sup ? 1300 : 3160, y: sup ? SUPER_PISO : Y }, { f: l(s1), x: sup ? 1450 : 3260, y: sup ? SUPER_PISO : Y }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }]} enManoD={<Bolsa color="#c9a26a" />} enManoI={<Bolsa color="#b08a5a" />} />;
  return sup ? (
    <Escena Set={Supermercado} pal={PAL} seed={Math.round(s0)} claves={[mira(0, 1400, 560, 1.2), mira(l(s1), 1460, 560, 1.25)]}
      medio={<>{rosa}<g transform="translate(1400,200)"><rect x={-180} y={-50} width={360} height={90} rx={8} fill="#f6efe0" stroke={color} strokeWidth={6} /><text y={18} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={54} fill={color}>{cartel}</text></g></>} />
  ) : (
    <Escena Set={Granja} pal={PAL} seed={Math.round(s0)} setProps={{ hora: "dia", estacion: "barro", crec: 0 }} claves={[mira(0, 3480, 620, 1.3), mira(l(s1), 3520, 620, 1.35)]}
      medio={<><Puesto x={3560} y={Y - 10} cartel={cartel} color={color} />{rosa}</>} />
  );
};

// ---------- 139:8-144:3 · el bus escolar amarillo con 1,100 LB de papa semilla; Rosa al volante ----------
const Q29: React.FC = () => {
  const f = useF();
  const l = loc(139.8);
  const x = interpolate(f, [l(140.0), l(142.6)], [-900, 1500], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  const frena = ap(f, l(142.4), 8) * (1 - ap(f, l(142.8), 8));
  return (
    <Escena Set={Granja} pal={PAL} seed={67} setProps={{ hora: "dia", estacion: "barro", crec: 0, humo: 1 }}
      claves={[mira(0, 900, 600, 0.85), mira(l(142.6), 1300, 600, 0.9, { curva: "inout" }), mira(l(144.3), 1320, 600, 0.92)]}
      frente={<g transform={`rotate(${frena * 2} ${x} ${P + 150})`}><BusEscolar x={x} y={P + 150} s={1.15} rueda={x * 0.6} chofer={<g><circle r={22} fill="#141016" /><path d="M-24,-6 Q0,-34 24,-6" fill="#241612" /></g>} /></g>}
      hud={<EtiquetaFlotante x={1240} y={200} rotulo="SEED POTATOES" claves={[{ f: 0, v: 0 }, { f: l(141.6), v: 1100, d: 30 }]} sufijo=" LB" desde={l(141.4)} color="#ffcf6e" tam={70} />} />
  );
};

// ---------- 144:3-150:3 · los sobres caen en la mesa, uno por palabra ----------
const SOBRES: { t: string; g: number; d: "poroto" | "zapallo" | "zanahoria" | "repollo" | "choclo"; c: string; x: number; y: number; r: number }[] = [
  { t: "BEANS", g: 146.3, d: "poroto", c: "#7cc46a", x: 520, y: 520, r: -8 }, { t: "SQUASH", g: 147.1, d: "zapallo", c: "#f2a03a", x: 820, y: 600, r: 6 },
  { t: "CARROTS", g: 147.9, d: "zanahoria", c: "#f08a3c", x: 1110, y: 500, r: -4 }, { t: "CABBAGE", g: 148.5, d: "repollo", c: "#8acb6a", x: 1400, y: 610, r: 9 }, { t: "CORN", g: 149.2, d: "choclo", c: "#f2d04a", x: 1660, y: 520, r: -6 },
];
const Q30: React.FC = () => {
  const f = useF();
  const l = loc(144.3);
  return (
    <Escena Set={Primer} pal={PAL} seed={68} setProps={{ fondo: "madera" }} claves={[mira(0, 1090, 560, 0.95), mira(l(150.3), 1090, 560, 1.02)]}
      medio={<>{SOBRES.map((s, i) => { const k = ap(f, l(s.g), 6); return k > 0 ? <Sobre key={i} x={s.x} y={s.y - (1 - k) * 60} s={1.4 * (1.3 - 0.3 * k)} rot={s.r} t={s.t} color={s.c} dibujo={s.d} /> : null; })}</>}
      hud={<Rotulo texto="EVERYTHING ELSE" x={1240} y={150} centro desde={l(144.8)} color="#ffcf6e" tam={74} />} />
  );
};

// ---------- SEC 7 · 150:3-156:5 · el sobre con la fecha: PACKED FOR 2025 ----------
const Q31: React.FC = () => {
  const l = loc(150.3);
  return (
    <Escena Set={Primer} pal={PAL} seed={69} setProps={{ fondo: "madera" }} claves={[mira(0, 960, 560, 1.0), mira(l(156.5), 960, 600, 1.35, { curva: "inout" })]}
      medio={<Sobre x={960} y={560} s={2.6} rot={-4} t="BEANS" color="#7cc46a" dibujo="poroto" fecha="PACKED FOR 2025" />}
      hud={<Rotulo texto="GOOD FOR A FEW YEARS · COOL & DRY" x={1240} y={140} centro desde={l(153.0)} color="#ffcf6e" tam={58} />} />
  );
};

// ---------- 156:5-160:6 · el sobre de cebolla pierde el poder: se pone gris ----------
const Q32: React.FC = () => {
  const f = useF();
  const l = loc(156.5);
  return (
    <Escena Set={Primer} pal={PAL} seed={70} setProps={{ fondo: "madera" }} claves={[mira(0, 960, 560, 1.05), mira(l(160.6), 960, 560, 1.15)]}
      medio={<Sobre x={960} y={560} s={2.4} rot={5} t="ONIONS" color="#c99ad8" dibujo="cebolla" fecha="PACKED FOR 2025" gris={ap(f, l(157.6), 40)} />}
      hud={<Rotulo texto="ONIONS · 1-2 YEARS" x={1240} y={140} centro desde={l(157.0)} color="#e23a2e" tam={72} />} />
  );
};

// ---------- 160:6-165:6 · Nan, la bibliotecaria, ordena cada sobre por tipo y fecha ----------
const Q33: React.FC = () => {
  const f = useF();
  const l = loc(160.6);
  const PS = COCINA_PISO;
  const pilas = Math.floor(interpolate(f, [l(161.0), l(165.4)], [0, 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <Escena Set={Cocina} pal={PAL} seed={71} claves={[mira(0, 1150, 620, 1.55), mira(l(165.6), 1160, 610, 1.65)]}
      medio={<>
        <Silla x={980} piso={PS} dir={1} color="#b07a4a" />
        <A look={NAN} ruta={[{ f: 0, x: 980, y: PS }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 104 }]} caras={[{ f: 0, v: "determinado" }]} miradas={[{ f: 0, v: { x: 0.6, y: 0.5 } }]}
          poses={[{ f: 0, v: { tronco: 10, pI: 88, rI: 88, pD: 92, rD: 92, hD: 60 + Math.sin(f / 5) * 20, cD: 70 } }]} />
        <rect x={1060} y={PS - 190} width={460} height={20} rx={6} fill="#8a5e3c" />
        {Array.from({ length: pilas }).map((_, i) => { const c = i % 4, h = Math.floor(i / 4); return <Sobre key={i} x={1120 + c * 100} y={PS - 216 - h * 10} s={0.3} rot={(i % 3) - 1} t="" color={["#7cc46a", "#f2a03a", "#f08a3c", "#c99ad8"][c]} />; })}
        {[0, 1, 2, 3].map((c) => <rect key={c} x={1092 + c * 100} y={PS - 260 - Math.floor(pilas / 4) * 10} width={56} height={34} fill="#f6efe0" stroke="#c9b48a" strokeWidth={2} opacity={ap(f, l(161.4) + c * 8, 6)} />)}
      </>}
      hud={<Rotulo texto="BY TYPE · BY DATE" x={1240} y={150} centro desde={l(162.6)} color="#ffcf6e" tam={70} />} />
  );
};

// ---------- 165:6-169:8 · surco en corte: semilla vieja al doble de densidad ----------
const Q34: React.FC = () => {
  const f = useF();
  const l = loc(165.6);
  const semilla = (x0: number, n: number, a: number) => Array.from({ length: n }).map((_, i) => { const k = ap(f, a + i * 2, 4); return k > 0 ? <ellipse key={i} cx={x0 + (i / n) * 640} cy={600 - (1 - k) * 80} rx={9} ry={6} fill="#e9d6a6" stroke="#8a6a42" strokeWidth={2} /> : null; });
  return (
    <Escena Set={Primer} pal={PAL} seed={72} setProps={{ fondo: "tierra" }} claves={[mira(0, 960, 560, 1.0), mira(l(169.8), 960, 560, 1.05)]}
      medio={<>
        <rect x={-500} y={-600} width={3000} height={900} fill="#9ab8d8" /><rect x={-500} y={300} width={3000} height={90} fill="#4f9a3c" />
        {[140, 1140].map((x0) => <path key={x0} d={`M${x0 - 40},390 L${x0 + 680},390 L${x0 + 640},620 L${x0},620 Z`} fill="#3e2a1e" />)}
        {semilla(160, 8, l(166.0))}{semilla(1160, 16, l(166.8))}
      </>}
      hud={<><Rotulo texto="NEW SEED" x={780} y={900} centro desde={l(165.9)} color="#f6ecd2" tam={58} brillo={false} /><Rotulo texto="OLD SEED · 2× THICK" x={1500} y={900} centro desde={l(166.8)} color="#ffcf6e" tam={58} /></>} />
  );
};

// ---------- SEC 8 · 169:8-172:6 · día 250: el campo arado ----------
const Q35: React.FC = () => {
  const l = loc(169.8);
  return (
    <Escena Set={Granja} pal={PAL} seed={73} setProps={{ hora: "alba", estacion: "verano", crec: 0 }} claves={[mira(0, 3700, 620, 0.78), mira(l(172.6), 3650, 620, 0.82)]}
      hud={<Rotulo texto="PLANTING" x={1240} y={170} centro desde={l(170.6)} color="#ffcf6e" tam={96} />} />
  );
};

// ---------- 172:6-177:9 · Marcus arranca el tractor, humo negro, todos festejan ----------
const Q36: React.FC = () => {
  const f = useF();
  const l = loc(172.6);
  return (
    <Escena Set={Granja} pal={PAL} seed={74} setProps={{ hora: "dia", estacion: "verano", crec: 0 }}
      claves={[mira(0, 3150, 600, 1.4), mira(l(174.2), 3150, 600, 1.45), mira(l(175.0), 3400, 620, 0.85, { curva: "inout" }), mira(l(177.9), 3420, 620, 0.88)]}
      medio={<>
        <Tractor x={3150} y={Y} s={1.15} humo={ap(f, l(173.2), 6)} f={f} rueda={0} />
        <Grupo x0={3450} paso={130} solo={[1, 2, 3, 4, 5, 6, 7, 8, 9]} seed={4}
          extra={(i) => ({ ruta: [{ f: 0, x: 3330 + i * 120, y: Y + 20 }], dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "parado" }, { f: l(173.8) + i * 2, v: "celebrar" }], caras: [{ f: 0, v: "duda" }, { f: l(173.8) + i * 2, v: "risa" }] })} />
        <A look={MARCUS_VERANO} ruta={[{ f: 0, x: 3070, y: Y - 120 }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 90 }]} poses={[{ f: 0, v: "sentado" }, { f: l(174.0), v: { tronco: 4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 160, cD: 20 } }]} caras={[{ f: 0, v: "determinado" }, { f: l(174.0), v: "feliz" }]} />
      </>} />
  );
};

// ---------- 177:9-183:5 · el bidón rojo: DIESEL ~1 YEAR ----------
const Q37: React.FC = () => {
  const l = loc(177.9);
  return (
    <Escena Set={Granja} pal={PAL} seed={75} setProps={{ hora: "dia", estacion: "verano", crec: 0 }} claves={[mira(0, 2900, 760, 2.3), mira(l(183.5), 2920, 760, 2.45)]}
      medio={<><Tractor x={3150} y={Y} s={1.15} /><Bidon x={2880} y={Y} s={1.3} /></>}
      hud={<EtiquetaFlotante x={1240} y={170} rotulo="FARM DIESEL · USABLE" claves={1} sufijo=" YEAR" desde={l(179.0)} color="#ffcf6e" tam={72} />} />
  );
};

// ---------- 183:5-186:7 · el tractor se aleja; es la última primavera garantizada ----------
const Q38: React.FC = () => {
  const f = useF();
  const l = loc(183.5);
  const x = interpolate(f, [0, l(186.7)], [3200, 5000]);
  return (
    <Escena Set={Granja} pal={PAL} seed={76} setProps={{ hora: "ocaso", estacion: "verano", crec: 0.05 }} claves={[mira(0, 3700, 620, 0.85), mira(l(186.7), 4000, 620, 0.88)]}
      medio={<Tractor x={x} y={Y} s={1.0} humo={1 - ap(f, l(185.0), 40)} f={f} rueda={x * 0.8} />}
      hud={<Rotulo texto="THE LAST GUARANTEED SPRING" x={960} y={900} centro desde={l(184.0)} color="#f6ecd2" tam={60} brillo={false} />} />
  );
};

// ---------- 186:7-191:8 · Marcus reparte palas a todos ----------
const Q39: React.FC = () => {
  const f = useF();
  const l = loc(186.7);
  return (
    <Escena Set={Granja} pal={PAL} seed={77} setProps={{ hora: "dia", estacion: "verano", crec: 0.05 }} claves={[mira(0, 2900, 600, 1.0), mira(l(191.8), 3000, 600, 1.05)]}
      medio={<>
        <A look={MARCUS_VERANO} ruta={[{ f: 0, x: 2250, y: Y }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }]} poses={[{ f: 0, v: { hD: 90 + Math.sin(f / 4) * 20, cD: 20 } }]} enManoD={<Pala />} />
        <Grupo x0={2400} paso={130} solo={[1, 2, 3, 4, 5, 6, 7, 8, 9]} seed={9} extra={(i) => ({ ruta: [{ f: 0, x: 2300 + i * 135, y: Y }], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: i % 2 ? "duda" : "determinado" }], enManoD: (ff: number) => (ff > l(187.6) + i * 9 ? <Pala /> : null) })} />
      </>}
      hud={<Rotulo texto="LEARN BOTH WAYS" x={1240} y={150} centro desde={l(189.6)} color="#ffcf6e" tam={74} />} />
  );
};

// ---------- 191:8-194:5 · dos surcos: el tractor rápido contra la gente con palas ----------
const Q40: React.FC = () => {
  const f = useF();
  const l = loc(191.8);
  const tx = interpolate(f, [0, l(194.5)], [3100, 4800]);
  const golpe = (i: number) => (Math.floor((f + i * 7) / 14) % 2 ? "agacharse" : "parado");
  return (
    <Escena Set={Granja} pal={PAL} seed={78} setProps={{ hora: "dia", estacion: "verano", crec: 0.05 }} claves={[mira(0, 3900, 620, 0.62), mira(l(194.5), 3950, 620, 0.64)]}
      medio={<>
        <rect x={3080} y={P - 70} width={tx - 3080} height={20} fill="#3a2418" />
        <Tractor x={tx} y={P - 30} s={0.8} humo={0.6} f={f} rueda={tx} />
        {[0, 1, 2, 3, 4].map((i) => <A key={i} look={LOS10[i + 1]} ruta={[{ f: 0, x: 3200 + i * 110, y: Y + 40 }, { f: l(194.5), x: 3260 + i * 110, y: Y + 40 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: golpe(i) as never }]} caras={[{ f: 0, v: "cansado" }]} enManoD={<Pala />} />)}
      </>}
      hud={<><Rotulo texto="TRACTOR" x={1500} y={170} centro desde={l(192.0)} color="#f6ecd2" tam={52} brillo={false} /><Rotulo texto="SHOVEL" x={600} y={880} centro desde={l(192.6)} color="#ffcf6e" tam={52} /></>} />
  );
};

// ---------- 194:5-197:1 · palear de cerca ----------
const Q41: React.FC = () => {
  const f = useF();
  const ciclo = (i: number) => (Math.floor((f + i * 9) / 16) % 2 ? "agacharse" : "tirarCarga");
  return (
    <Escena Set={Granja} pal={PAL} seed={79} setProps={{ hora: "dia", estacion: "verano", crec: 0.05 }} claves={[mira(0, 3560, 720, 1.7), mira(T(2.6), 3600, 720, 1.78)]}
      medio={<>{[[THEO, 3380], [JUNE, 3600], [ROSA, 3820]].map(([look, x], i) => <A key={i} look={look as typeof THEO} ruta={[{ f: 0, x: x as number, y: Y }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: ciclo(i) as never }]} caras={[{ f: 0, v: "cansado" }]} enManoD={<Pala tierra={Math.floor((f + i * 9) / 16) % 2 === 0} />} />)}</>} />
  );
};

// ---------- 197:1-201:6 · seis días: sol y luna cruzan; ampollas en cada mano (DAY 250 → 256) ----------
const Q42: React.FC = () => {
  const f = useF();
  const l = loc(197.1);
  const u = interpolate(f, [l(197.3), l(200.4)], [0, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hora = horaCiclo(f, l(197.3), l(200.4), 6);
  return (
    <Escena Set={Granja} pal={PAL} seed={80} setProps={{ hora, estacion: "verano", crec: 0.05 + 0.1 * (u / 6) }} claves={[mira(0, 3700, 600, 0.8), mira(l(201.6), 3700, 600, 0.84)]}
      detras={u < 6 ? <SolCruza u={u} x0={2800} x1={4600} y={480} luna={hora === "noche"} /> : undefined}
      medio={<Grupo x0={3150} paso={140} extra={(i) => ({ poses: [{ f: 0, v: (Math.floor((f + i * 5) / 8) % 2 ? "agacharse" : "parado") as never }], caras: [{ f: 0, v: "cansado" }], enManoD: <Pala /> })} />}
      hud={<Rotulo texto="10 PEOPLE · 6 DAYS · BLISTERS" x={960} y={900} centro desde={l(200.4)} color="#ffcf6e" tam={60} />} />
  );
};

// ---------- 201:6-204:8 · Gus apoyado en la pala: «Not since 1972.» ----------
const Q43: React.FC = () => {
  const l = loc(201.6);
  return (
    <Escena Set={Granja} pal={PAL} seed={81} setProps={{ hora: "ocaso", estacion: "verano", crec: 0.15 }} claves={[mira(0, 3420, 560, 2.0), mira(l(204.8), 3430, 555, 2.1)]}
      medio={<A look={GUS} ruta={[{ f: 0, x: 3400, y: Y }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { tronco: 12, hD: 40, cD: 60, hI: -20, cI: 90 } }]} caras={[{ f: 0, v: "cansado" }, { f: l(202.8), v: "picaro" }]} enManoD={<Pala />} />}
      hud={<Globo texto="Not since 1972." x={1300} y={280} desde={l(202.4)} hasta={l(204.8)} cola="izq" tam={64} />} />
  );
};

export const PLANOS_A: [number, React.ReactNode, PlanoM["trans"]?][] = [
  [0, <Q01 />], [4.9, <Q02 />, { tipo: "barrido", d: 12 }], [10.2, <Q03 />, { tipo: "corte" }], [13.2, <Q04 />], [16.9, <Q05 />, { tipo: "luz", d: 14 }],
  [23.0, <Q06 />, { tipo: "fundido", d: 18 }], [28.0, <Q07 />, { tipo: "barrido", d: 10 }], [31.5, <Q08 />], [34.0, <Q09 />], [37.5, <Q10 />],
  [40.5, <Q11 />, { tipo: "fundido", d: 14 }], [43.5, <Q12 />, { tipo: "cortina", d: 14, color: "#0b0810" }], [47.0, <Q13 />, { tipo: "fundido", d: 14 }], [50.2, <Q14 />, { tipo: "fundido", d: 14 }],
  [57.5, <Q15 />, { tipo: "luz", d: 12 }], [64.0, <Q16 />, { tipo: "fundido", d: 14 }],
  [69.1, <Q17 />, { tipo: "cortina", d: 14, color: "#0b0810" }], [71.8, <Q18 />, { tipo: "barrido", d: 10 }], [88.8, <Q19 />],
  [90.4, <Q20 />, { tipo: "luz", d: 12 }], [95.0, <Q21 />, { tipo: "barrido", d: 10 }], [98.8, <Q22 />, { tipo: "barrido", d: 10 }], [107.3, <Q23 />, { tipo: "luz", d: 12 }], [116.8, <Q24 />, { tipo: "barrido", d: 10 }],
  [120.1, <Q25 />, { tipo: "cortina", d: 14, color: "#0b0810" }], [124.3, <Q26 />], [127.7, <Q27 />, { tipo: "barrido", d: 10 }],
  [135.5, <Lugar s0={135.5} s1={136.9} cartel="ORGANIC" color="#3f8a3a" sup />, { tipo: "barrido", d: 8 }], [136.9, <Lugar s0={136.9} s1={138.4} cartel="GARDEN CENTER" color="#2f6a3a" />, { tipo: "barrido", d: 8 }],
  [138.4, <Lugar s0={138.4} s1={139.8} cartel="PROCTOR FARM SUPPLY" color="#8a3a2e" />, { tipo: "barrido", d: 8 }], [139.8, <Q29 />, { tipo: "barrido", d: 10 }],
  [144.3, <Q30 />, { tipo: "luz", d: 12 }], [150.3, <Q31 />], [156.5, <Q32 />, { tipo: "corte" }], [160.6, <Q33 />, { tipo: "fundido", d: 14 }], [165.6, <Q34 />, { tipo: "barrido", d: 10 }],
  [169.8, <Q35 />, { tipo: "cortina", d: 14, color: "#0b0810" }], [172.6, <Q36 />], [177.9, <Q37 />], [183.5, <Q38 />, { tipo: "fundido", d: 14 }], [186.7, <Q39 />, { tipo: "barrido", d: 10 }],
  [191.8, <Q40 />], [194.5, <Q41 />], [197.1, <Q42 />, { tipo: "luz", d: 12 }], [201.6, <Q43 />],
];
