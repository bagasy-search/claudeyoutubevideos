// ycn02 · planos 43-100 (178.8 → 449 s): cómo funciona un pinsetter, el plan de la pista 16, los trabajos, 3:10,
// Gus sale y se da vuelta hacia Rafi, la estática del walkie de Nell, la barra de barrido, el conteo del freezer,
// el delantal con la llave TRASH, el helado de la cena, la venda de Marlon y la pantalla final.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { F_HUD, Pildora } from "../../anikit/pantalla";
import { Walkie, Bolsa } from "../../anikit/props";
import { NELL, CAL, DOT, RAFI, MARLON, GUS, LIGA, RIM, ROJO, AMARILLO, zombi } from "../elenco";
import { pistaX, PISTAS_PUNTOS as PP } from "../sets/pistas";
import { COCINA_YCN_PUNTOS as CP } from "../sets/cocina";
import { FREEZER_PUNTOS as FP } from "../sets/freezer";
import { PIN_X, PIN_PUNTOS } from "../sets/pinsetters";
import { Bola, Linterna, Pino, PoteHelado, Tiza, Venda } from "../utileria";
import { Mapa, Velo as VeloX } from "../../anikit/explica";
import { A, Afuera, Cocina, Dice, EnFreezer, Final, HudDia, kDe, Lista, Maquinas, P, Recuerdo, Rotulo, Sacude, Sala, Velo } from "../base";
import { D9, N9 } from "./planos1";

const X16 = pistaX(16), ZA = PP.zapatos, SN = PP.snack, PC = PP.puertaCocina;
const YB = P - 300; // cubierta de pinos (fondo de la pista)
const N9C = { ...N9, cerradas: [16] };
const ZGUS = zombi(GUS);
const TOALLA = <g transform="translate(-6,-6)"><rect x={-22} y={-14} width={44} height={26} rx={8} fill="#f1ece2" /><rect x={-22} y={-2} width={44} height={8} rx={4} fill="#c9c2b4" /></g>;
const ladrillo = { hD: 70, cD: 70, hI: 70, cI: 70, tronco: 4 }; // Lorraine sostenida con las dos manos
const brazoZ = { hD: 80, cD: 10, hI: 74, cI: 14 }; // brazos adelante, lentos
const levantaLinterna = { hD: 160, cD: 10, hI: 20, cI: 20 };
const tecleo = (n: number) => Array.from({ length: n }).flatMap((_, i) => [{ f: i * 10, v: { hD: 60, cD: 60, hI: 55, cI: 65, tronco: 8 } }, { f: i * 10 + 5, v: { hD: 62, cD: 56, hI: 52, cI: 70, tronco: 8 } }]);

// barra de barrido sobre el pozo de la pista 16 (mundo de Pistas): baja con `baja` 0..1, `cerrada` pinta el candado
const BarraBarrido: React.FC<{ baja: number; cerrada?: boolean }> = ({ baja, cerrada }) => {
  const y = YB - 130 + baja * 100;
  return (
    <g>
      <rect x={X16 - 84} y={y} width={168} height={20} rx={4} fill="#c9c2b4" stroke="#2a2a30" strokeWidth={3} />
      {[-60, -20, 20, 60].map((d) => <rect key={d} x={X16 + d - 4} y={y + 20} width={8} height={14} fill="#8a8a92" />)}
      {cerrada && <g transform={`translate(${X16 + 96},${y + 6})`}><rect x={-12} y={-4} width={24} height={20} rx={3} fill={AMARILLO} /><path d="M-7,-4 v-8 a7,7 0 0 1 14,0 v8" stroke={AMARILLO} strokeWidth={4} fill="none" /></g>}
    </g>
  );
};
// vapor frío que sale del freezer
const Vaho: React.FC<{ x: number; y: number; u: number }> = ({ x, y, u }) => (
  <g opacity={0.55 * u}>{[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={x - 60 - i * 70 * u} cy={y - 60 - i * 30} rx={90 + i * 30} ry={46 + i * 12} fill="#e6f0ff" opacity={0.5 - i * 0.08} />)}</g>
);

// ---------- 43 · cómo funciona un pinsetter: Cal me lo explicó muy despacio ----------
export const P43Explica: React.FC = () => {
  const k = kDe(178.79);
  return (
    <Maquinas cl={[mira(0, PIN_PUNTOS.banco, 717, 1.5), mira(k(184.9), PIN_PUNTOS.banco + 300, 702, 1.7, { curva: "inout" })]} sp={{ encendidas: [], luz: "prendida" }}
      gente={[{ l: CAL, x: PIN_PUNTOS.banco + 100, p: [{ f: 0, v: "hablar" }, { f: 60, v: "señalar" }, { f: 120, v: "hablar" }], c: "determinado", d: 1, habla: [[0, 180]] }, { l: RAFI, x: PIN_PUNTOS.banco - 250, p: "pensar", c: "duda", d: 1 }]}
      hud={<><Dice quien="rafi" t="very slowly. like I was five." x={1100} y={200} desde={k(182.4)} tam={60} /><Lista x={120} y={170} tam={50} lineas={[{ t: "1 · BALL HITS PINS", desde: 20 }, { t: "2 · RAKE SWEEPS", desde: 50 }, { t: "3 · BELT LIFTS", desde: 80 }, { t: "4 · TURRET RESETS", desde: 110, color: AMARILLO }]} /><HudDia dia={9} rayas={9} /></>} />
  );
};

// ---------- 44 · detrás de cada pista, una máquina del tamaño de un auto ----------
export const P44Auto: React.FC = () => (
  <Maquinas cl={[mira(0, PIN_X(3) + 40, 600, 1.5), mira(98, PIN_X(3) + 120, 580, 1.15, { curva: "inout" })]} sp={{ encendidas: [], luz: "prendida" }}
    gente={[{ l: CAL, x: PIN_X(3) - 120, p: "señalar", c: "determinado", d: 1 }]}
    hud={<Rotulo t="the size of a car" x={1120} y={180} desde={14} flecha="izq" />} />
);

// ---------- 45 · la bola pega en los pinos: todo cae al pozo ----------
export const P45Pozo: React.FC = () => {
  const k = kDe(188.25);
  return (
    <Sala cl={[mira(0, pistaX(8) - 120, 660, 1.7), mira(k(190.2), pistaX(8) - 60, 620, 2.1, { curva: "inout" })]} sp={{ ...D9, luz: "liga", tiros: [{ pista: 8, f0: 4 }] }}
      gente={[{ l: CAL, x: pistaX(8) - 330, p: [{ f: 0, v: "parado" }, { f: k(189.6), v: "señalar" }], c: "determinado", d: 1, habla: [[k(189.6), k(191.5)]], mI: <Linterna />, luz: RIM.linterna }]}
      hud={<><Rotulo t="THE PIT" x={1180} y={360} desde={k(190.6)} flecha="izq" color={AMARILLO} /><HudDia dia={9} rayas={9} /></>} />
  );
};

// ---------- 46-47 · un rastrillo barre el pozo; una cinta sube pinos y bola ----------
// en el mundo de Maquinas: el rastrillo (barra amarilla gruesa) barre el pozo de la 8 de punta a punta, los pinos caen y ruedan en la cinta
const XM = PIN_X(8), PM = 900;
const PozoVivo: React.FC<{ f: number; t0?: number }> = ({ f, t0 = 0 }) => {
  const u = (f - t0) / 40; const sw = Math.max(0, Math.min(1, u)); // rastrillo: va y vuelve cada 40 cuadros
  const rx = XM - 96 + (Math.floor(u) % 2 === 0 ? (u % 1) : 1 - (u % 1)) * 160;
  return (
    <g>
      {/* pinos cayendo al pozo y rodando por la cinta */}
      {[0, 1, 2, 3, 4].map((i) => {
        const t = ((f - t0) + i * 17) % 85;
        const cae = Math.min(1, t / 20);
        const x = XM - 70 + i * 30 + Math.max(0, t - 20) * 2.2;
        const y = PM - 330 + cae * cae * 200;
        return x < XM + 110 ? <Pino key={i} x={x} y={y} s={0.55} rot={t * 9 + i * 40} /> : null;
      })}
      <rect x={rx} y={PM - 178} width={16} height={120} rx={4} fill="#ffd23a" stroke="#2a2a30" strokeWidth={4} opacity={sw > 0 ? 1 : 0} />
      <rect x={XM - 104} y={PM - 182} width={208} height={10} rx={4} fill="#ffd23a" opacity={0.8} />
    </g>
  );
};
export const P46Rastrillo: React.FC = () => {
  const f = useF();
  return (
    <Maquinas cl={[mira(0, XM - 60, 700, 2.0), mira(46, XM - 40, 690, 2.3, { curva: "inout" })]} sp={{ encendidas: [8], luz: "prendida" }}
      gente={[{ l: CAL, x: XM - 230, p: [{ f: 0, v: "señalar" }, { f: 24, v: { hD: 120, cD: 20 } }], c: "determinado", d: 1, habla: [[0, 40]], mI: <Linterna />, luz: RIM.linterna }]}
      extra={<PozoVivo f={f} />}
      hud={<><Rotulo t="RAKE" x={1180} y={300} desde={6} flecha="izq" color={AMARILLO} /><HudDia dia={9} rayas={9} /></>} />
  );
};
export const P47Cinta: React.FC = () => {
  const f = useF();
  return (
    <Maquinas cl={[mira(0, XM - 20, 660, 1.9), mira(84, XM + 20, 696, 1.8, { curva: "inout" })]} sp={{ encendidas: [8], luz: "prendida" }}
      gente={[{ l: RAFI, x: XM - 260, p: "pensar", c: [{ f: 0, v: "duda" }, { f: 40, v: "sorpresa" }], d: 1, mir: [{ f: 0, v: { x: 1, y: 0.4 } }, { f: 40, v: { x: 1, y: -0.6 } }], luz: RIM.linterna }]}
      extra={<PozoVivo f={f + 40} />}
      hud={<><Rotulo t="BELT · up and around" x={1150} y={260} desde={10} flecha="izq" color={AMARILLO} /><HudDia dia={9} rayas={9} /></>} />
  );
};

// ---------- 48 · la bola vuelve rodando hasta vos ----------
export const P48Vuelve: React.FC = () => {
  const f = useF();
  const x = interpolate(f, [0, 46], [pistaX(8) + 700, pistaX(8) + 120], { extrapolateRight: "clamp" });
  return (
    <Sala cl={[mira(0, pistaX(8) + 300, P - 120, 2.2), mira(48, pistaX(8) + 150, P - 120, 2.5, { curva: "inout" })]} sp={{ ...D9, luz: "liga" }}
      gente={[{ l: CAL, x: pistaX(8) - 80, p: [{ f: 0, v: "parado" }, { f: 36, v: "agacharse" }], c: "feliz", d: 1 }]}
      sobre={<Bola x={x} y={P - 30} s={1.1} rot={-f * 9} />} />
  );
};

// ---------- 49 · los pinos suben a una torreta que gira, caen uno por uno a la mesa, y la mesa baja diez en triángulo ----------
const Triangulo: React.FC<{ u: number }> = ({ u }) => (
  <svg width={260} height={240} style={{ position: "absolute", left: 1300, top: 600, opacity: u }}>
    {[[0], [1, 2], [3, 4, 5], [6, 7, 8, 9]].map((fila, r) => fila.map((_, c) => <circle key={`${r}${c}`} cx={130 + (c - r / 2 * 1) * 54 - (0)} cy={200 - r * 50} r={18} fill="#f4efe4" stroke="#ff4a3d" strokeWidth={4} />))}
  </svg>
);
export const P49Torreta: React.FC = () => {
  const k = kDe(197.81);
  const f = useF();
  return (
    <AbsoluteFill>
      <Maquinas cl={[mira(0, PIN_X(8) - 60, 696, 1.8), mira(k(202), PIN_X(8) - 60, 685, 2.0, { curva: "inout" }), mira(k(206.1), PIN_X(8) - 80, 620, 1.7, { curva: "inout" })]} sp={{ encendidas: [8], luz: "prendida" }}
        gente={[{ l: CAL, x: PIN_X(8) - 250, p: [{ f: 0, v: { hD: 165, cD: 10 } }, { f: k(202.4), v: { hD: 120, cD: 10 } }, { f: k(204.4), v: { hD: 60, cD: 20, hI: 60, cI: 20 } }], c: [{ f: 0, v: "determinado" }, { f: k(204.6), v: "feliz" }], d: 1, habla: [[k(204.8), k(206)]], mir: [{ f: 0, v: { x: 0.6, y: -1 } }, { f: k(202.4), v: { x: 1, y: 0 } }], luz: RIM.linterna }]}
        extra={<PozoVivo f={f} />} />
      <Rotulo t="TURRET" x={1180} y={180} desde={k(199.4)} hasta={k(202.4)} flecha="izq" color={AMARILLO} />
      <Rotulo t="DECK" x={1180} y={320} desde={k(202.6)} flecha="izq" color={AMARILLO} />
      <Triangulo u={interpolate(f, [k(204.5), k(205.3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      <Dice quien="cal" t="10 pins. perfect triangle." x={1150} y={860} desde={k(204.8)} tam={56} />
    </AbsoluteFill>
  );
};

// ---------- 50 · es ruidoso: lo más ruidoso de una bolera. Clank, rumble, crash, cada diez segundos ----------
export const P50Ruido: React.FC = () => {
  const k = kDe(206.17);
  return (
    <Sacude en={[k(209.3), k(210.3), k(211.3)]} amp={7}>
      <Maquinas cl={[mira(0, PIN_X(6) + 80, 640, 1.9), mira(k(210.3), PIN_X(6) + 120, 620, 1.5, { curva: "inout" }), mira(k(212.5), PIN_X(7), 580, 1.1, { curva: "inout" })]} sp={{ encendidas: true, luz: "prendida" }}
        gente={[{ l: RAFI, x: PIN_X(6), p: "manosCara", c: "sorpresa", d: 1 }]}
        hud={<><Dice quien="otro" t="CLANK" x={260} y={200} desde={k(209.3)} tam={96} rot={-8} /><Dice quien="otro" t="RUMBLE" x={760} y={330} desde={k(210.3)} tam={96} rot={4} /><Dice quien="otro" t="CRASH" x={1300} y={200} desde={k(211.3)} tam={110} rot={-5} /></>} />
    </Sacude>
  );
};

// ---------- 51 · el plan de Cal: la pista 16, la punta del edificio ----------
export const P51Pista16: React.FC = () => {
  const k = kDe(212.57);
  return (
    <Sala cl={[mira(0, pistaX(12), 540, 0.9), mira(k(216.2), X16, 736, 1.3, { curva: "inout" })]} sp={D9}
      gente={[{ l: CAL, x: pistaX(8) + 200, p: "señalar", c: "determinado", d: 1 }]}
      hud={<><Rotulo t="LANE 16" x={1150} y={180} desde={k(214.4)} flecha="izq" color={AMARILLO} /><HudDia dia={9} rayas={9} /></>} />
  );
};

// ---------- 52 · prendería sólo esa máquina ----------
export const P52Una: React.FC = () => (
  <Maquinas cl={[mira(0, PIN_X(16) - 300, 590, 1.45), mira(80, PIN_X(16) - 140, 600, 1.7, { curva: "inout" })]} sp={{ encendidas: [16], luz: "prendida" }}
    gente={[{ l: CAL, x: PIN_X(16) - 220, p: [{ f: 0, v: "parado" }, { f: 18, v: { hD: 95, cD: 0 } }], c: "determinado", d: 1, habla: [[12, 40]], mI: <Linterna />, luz: RIM.linterna }]}
    hud={<><Dice quien="cal" t="just that one." x={300} y={200} desde={12} tam={72} /><HudDia dia={9} rayas={9} /></>} />
);

// plano cenital de la bolera: freezer → puerta de la cocina → alfombra → pie de la pista 16 → por la pista hasta el pozo
const PlanoRuta: React.FC<{ desde: number; dur: number }> = ({ desde, dur }) => (
  <Mapa x={960} y={560} w={1120} h={660} desde={desde} dur={dur} estilo="plano" titulo="CAL'S PLAN" acento={ROJO}
    ambientes={[
      { x: 40, y: 70, w: 240, h: 220, rotulo: "FREEZER", puertas: [{ lado: "s", pos: 0.5 }],
        dibujo: <g fill="none" stroke="#9fd6ff" strokeOpacity={0.7} strokeWidth={3}>{[0, 1, 2].map((i) => <rect key={i} x={24} y={40 + i * 50} width={190} height={30} rx={5} />)}</g> },
      { x: 40, y: 310, w: 240, h: 300, rotulo: "KITCHEN", puertas: [{ lado: "n", pos: 0.5 }, { lado: "e", pos: 0.6 }],
        dibujo: <g fill="none" stroke="#cfe0ff" strokeOpacity={0.55} strokeWidth={3}><rect x={24} y={60} width={80} height={60} rx={6} /><rect x={130} y={60} width={86} height={60} rx={6} /></g> },
      { x: 300, y: 70, w: 260, h: 540, rotulo: "CARPET" },
      { x: 580, y: 70, w: 500, h: 540, rotulo: "LANES",
        dibujo: <g>{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={20 + i * 60} y={70} width={40} height={430} rx={4} fill="none" stroke={i === 7 ? ROJO : "#cfe0ff"} strokeOpacity={i === 7 ? 1 : 0.5} strokeWidth={i === 7 ? 5 : 3} />)}<rect x={452} y={44} width={56} height={34} rx={4} fill={ROJO} opacity={0.85} /><text x={480} y={530} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={30} fill={ROJO}>16</text></g> },
    ]}
    puntos={[{ x: 160, y: 190, rotulo: "GUS", lado: "der" }, { x: 160, y: 300, via: true }, { x: 160, y: 490, via: true }, { x: 290, y: 490, via: true }, { x: 430, y: 570, via: true }, { x: 1040, y: 570, via: true }, { x: 1040, y: 130, rotulo: "PIT · 3 FT", lado: "izq" }]} />
);

// ---------- 53 · Gus saldría del freezer, seguiría el ruido por la alfombra y la pista 16 hasta el pozo ----------
export const P53Ruta: React.FC = () => {
  const k = kDe(218.57);
  const f = useF();
  const u = interpolate(f, [k(219.5), k(225.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // recorrido punteado que se va dibujando: alfombra hasta la 16, después por la pista hasta el pozo
  const L1 = X16 - PC, L2 = P + 40 - (YB - 20), s = u * (L1 + L2);
  const xe = PC + Math.min(s, L1), ye = s <= L1 ? P + 40 : P + 40 - (s - L1);
  const d = s <= L1 ? `M${PC},${P + 40} L${xe},${ye}` : `M${PC},${P + 40} L${X16},${P + 40} L${xe},${ye}`;
  return (
    <Sala cl={[mira(0, PC + 300, 640, 1.5), mira(k(226), PC + 360, 650, 1.6, { curva: "lineal" })]} sp={D9}
      gente={[{ l: ZGUS, ruta: [{ f: 0, x: PC - 80, y: P + 40 }, { f: k(219.5), x: PC, y: P + 40 }, { f: k(219.5) + (k(225.6) - k(219.5)) * L1 / (L1 + L2), x: X16, y: P + 40, curva: "lineal" }, { f: k(225.6), x: X16, y: YB - 20, curva: "lineal" }], p: "zombi", c: "zombi", d: 1, luz: RIM.frio }]}
      sobre={u > 0 && <g><path d={d} stroke={AMARILLO} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="44 30" /><circle cx={xe} cy={ye} r={30} fill={ROJO} stroke="#fff" strokeWidth={6} /></g>}
      hud={<><VeloX desde={k(219)} o={0.55} /><PlanoRuta desde={k(219.1)} dur={Math.round(k(225.6) - k(219.1) - 30)} /></>} />
  );
};

// ---------- 54 · el pozo tiene tres pies de hondo ----------
// corte del pozo: Gus (silueta zombi) adentro le llega a la cintura, la regla marca 3 FT
const CortePozo: React.FC<{ f: number; left?: number; top?: number; esc?: number }> = ({ f, left = 980, top = 280, esc = 1 }) => {
  const u = interpolate(f, [4, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const g = interpolate(f, [18, 40], [-260, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg width={860} height={560} viewBox="0 0 860 560" style={{ position: "absolute", left, top, transform: `scale(${esc})`, transformOrigin: "0 0" }}>
      <rect x={0} y={0} width={860} height={560} rx={24} fill="#141820" stroke="#e8dcc0" strokeWidth={5} opacity={0.94} />
      <rect x={40} y={170} width={680} height={20} fill="#c9a36a" />
      <rect x={180} y={190} width={400} height={300} fill="#2a3240" stroke="#8a969a" strokeWidth={6} />
      <g opacity={u} transform={`translate(380,${490 + g})`}>
        <rect x={-34} y={-150} width={68} height={150} rx={20} fill="#7a8a6a" />
        <circle cx={0} cy={-210} r={58} fill="#9fb08a" />
        <rect x={-70} y={-150} width={18} height={70} rx={9} fill="#7a8a6a" transform="rotate(-30 -60 -150)" />
        <rect x={52} y={-150} width={18} height={70} rx={9} fill="#7a8a6a" transform="rotate(30 60 -150)" />
      </g>
      <g opacity={u}>
        <line x1={640} y1={190} x2={640} y2={490} stroke="#ffd23a" strokeWidth={8} />
        <line x1={620} y1={190} x2={660} y2={190} stroke="#ffd23a" strokeWidth={8} />
        <line x1={620} y1={490} x2={660} y2={490} stroke="#ffd23a" strokeWidth={8} />
        <text x={672} y={352} fontFamily={F_HUD} fontWeight={800} fontSize={54} fill="#ffd23a">3 FT</text>
      </g>
      <text x={40} y={80} fontFamily={F_HUD} fontWeight={700} fontSize={40} fill="#e8dcc0">THE PIT · LANE 16</text>
      <text x={40} y={130} fontFamily={F_HUD} fontWeight={500} fontSize={30} fill="#9aa4a8">he walks in. he can't climb out.</text>
    </svg>
  );
};
export const P54Hondo: React.FC = () => {
  const f = useF();
  return (
    <AbsoluteFill>
      <Sala cl={[mira(0, X16 - 200, YB + 20, 2.2), mira(54, X16 - 160, YB + 20, 2.5, { curva: "inout" })]} sp={D9} />
      <CortePozo f={f} />
      <Dice quien="cal" t="3 FEET DEEP" x={120} y={860} desde={8} tam={96} />
      <HudDia dia={9} rayas={9} />
    </AbsoluteFill>
  );
};

// ---------- 55 · Cal bajaría la barra de barrido y la trabaría: Gus atrás, a salvo, y nosotros también ----------
export const P55Barra: React.FC = () => {
  const k = kDe(227.99);
  const f = useF();
  const b = interpolate(f, [k(229.6), k(230.3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // 1º Cal en el cuarto de máquinas tirando la palanca de la barra hacia abajo; corte en el golpe a la barra trabada sobre el pozo
  if (f < k(230.2)) return (
    <Maquinas cl={[mira(0, PIN_X(16) - 160, 560, 1.9), mira(k(230.2), PIN_X(16) - 170, 580, 2.2, { curva: "inout" })]} sp={{ encendidas: [16], luz: "noche" }}
      gente={[{ l: CAL, x: PIN_X(16) - 230, p: [{ f: 0, v: { hD: 170, cD: 0, hI: 160, cI: 10 } }, { f: k(229.6), v: { hD: 170, cD: 0, hI: 160, cI: 10 } }, { f: k(230.1), v: { hD: 110, cD: 10, hI: 100, cI: 20, tronco: 10 } }], c: "determinado", d: 1, luz: RIM.linterna }]}
      hud={<><Rotulo t="pull it down" x={1200} y={260} desde={k(228.4)} flecha="izq" color={AMARILLO} /><HudDia dia={9} rayas={9} /></>} />
  );
  return (
    <Sala cl={[mira(0, X16, YB, 2.4), mira(k(234.1), X16, YB + 40, 2.0, { curva: "inout" })]} sp={D9}
      sobre={<BarraBarrido baja={b} cerrada={f > k(231)} />}
      hud={<><Rotulo t="SWEEP BAR · locked" x={1250} y={300} desde={k(231)} flecha="izq" color={AMARILLO} /><Dice quien="rafi" t="safe. and so would we." x={960} y={860} desde={k(232.6)} centro tam={60} /></>} />
  );
};

// ---------- 56-57 · mi trabajo era la puerta; el de Dot, Nell ----------
export const P56Puerta: React.FC = () => (
  <Cocina cl={[mira(0, CP.manija - 200, 640, 2.0), mira(50, CP.manija - 220, 650, 2.3, { curva: "inout" })]} sp={{ luz: "prendida" }}
    gente={[{ l: RAFI, x: CP.manija - 300, p: [{ f: 0, v: "parado" }, { f: 20, v: { hD: 88, cD: 8 } }], c: "miedo", d: 1 }]}
    hud={<><Pildora texto="RAFI · THE DOOR" x={960} y={150} desde={4} /><HudDia dia={9} rayas={9} hora="3:10 AM" /></>} />
);
export const P57Nell: React.FC = () => (
  <Sala cl={[mira(0, ZA - 100, 560, 1.8), mira(46, ZA - 120, 680, 2.1, { curva: "inout" })]} zapatos sp={D9}
    gente={[{ l: DOT, x: ZA - 300, p: "manosCintura", c: "determinado", d: 1 }, { l: NELL, x: ZA - 100, p: "parado", c: "duda", d: -1, mD: <Walkie s={0.8} /> }]}
    hud={<Pildora texto="DOT · NELL" x={960} y={150} desde={4} color="#ff8fb8" />} />
);

// ---------- 58 · Nell, a más de cuarenta pies, detrás del mostrador de zapatos con una linterna ----------
export const P58Cuarenta: React.FC = () => {
  const k = kDe(237.44);
  return (
    <Sala cl={[mira(0, ZA + 20, 620, 1.6), mira(k(242.2), ZA + 50, 640, 2.1, { curva: "inout" })]} zapatos sp={N9}
      gente={[{ l: NELL, x: ZA + 60, p: [{ f: 0, v: "parado" }, { f: k(241), v: { hD: 80, cD: 10 } }], c: "miedo", d: -1, mD: <Linterna />, luz: RIM.linterna }]}
      hud={<><Rotulo t="40 ft" x={300} y={200} desde={k(238.5)} flecha="der" color={ROJO} /><HudDia dia={9} rayas={9} hora="3:00 AM" /></>} />
  );
};

// ---------- 59 · Dot delante, con Lorraine en las dos manos como un ladrillo ----------
export const P59Lorraine: React.FC = () => {
  const k = kDe(242.2);
  return (
    <Sala cl={[mira(0, ZA - 200, 620, 1.8), mira(k(245.5), ZA - 240, 650, 2.6, { curva: "inout" }), mira(k(247.8), ZA - 200, 640, 2.2, { curva: "inout" })]} zapatos sp={N9}
      sobre={<A l={NELL} x={ZA + 60} p={{ hD: 80, cD: 10 }} c="miedo" d={-1} mD={<Linterna />} luz={RIM.linterna} />}
      gente={[{ l: DOT, ruta: [{ f: 0, x: ZA - 500 }, { f: k(243.6), x: ZA - 260 }], p: [{ f: 0, v: "parado" }, { f: k(243.7), v: ladrillo }], c: "determinado", d: 1, mD: <Bola s={1.0} /> }]}
      hud={<Rotulo t="LORRAINE" x={1150} y={620} desde={k(243.8)} flecha="izq" color="#ff8fb8" />} />
  );
};

// ---------- 60-61 · Marlon sostendría la puerta de la cocina: «sí» · «tengo el hombro mal» · «bueno» ----------
export const P60Marlon: React.FC = () => {
  const k = kDe(247.88);
  return (
    <Sala cl={[mira(0, PC + 200, 600, 1.6), mira(k(251.6), PC + 160, 640, 2.0, { curva: "inout" })]} sp={N9}
      gente={[{ l: MARLON, x: PC + 160, p: [{ f: 0, v: "brazosCruzados" }, { f: k(250.4), v: "hablar" }], c: "picaro", d: 1, habla: [[k(250.4), k(251.5)]] }]}
      hud={<><Rotulo t="hold the kitchen door" x={1150} y={200} desde={k(248.6)} flecha="izq" /><Dice quien="marlon" t="Yes." x={350} y={240} desde={k(250.5)} tam={80} /></>} />
  );
};
export const P61Hombro: React.FC = () => {
  const k = kDe(251.62);
  return (
    <Sala cl={[mira(0, PC + 160, 650, 2.4), mira(k(254.8), PC + 160, 655, 2.7, { curva: "inout" })]} sp={N9}
      gente={[{ l: MARLON, x: PC + 160, p: [{ f: 0, v: { hI: 40, cI: 140, hD: 20, cD: 20 } }, { f: k(253.6), v: { hD: 60, cD: 100, hI: 60, cI: 100 } }], c: [{ f: 0, v: "cansado" }, { f: k(253.6), v: "picaro" }], d: 1, habla: [[0, k(254.8)]] }]}
      hud={<><Dice quien="marlon" t="Bad shoulder." x={260} y={200} desde={k(251.8)} tam={72} /><Dice quien="marlon" t="…fine." x={460} y={320} desde={k(253.7)} tam={72} /><HudDia dia={9} rayas={9} /></>} />
  );
};

// ---------- 62 · no se sacó el saco, abotonado, aunque la cocina hervía por la freidora ----------
export const P62Saco: React.FC = () => {
  const k = kDe(254.91);
  return (
    <Cocina cl={[mira(0, CP.freidora, 560, 1.4), mira(k(257.5), 700, 660, 2.3, { curva: "inout" }), mira(k(260), 700, 670, 2.6, { curva: "lineal" })]} sp={{ luz: "prendida" }}
      gente={[{ l: MARLON, x: 700, p: { hI: 50, cI: 120, hD: 10, cD: 20 }, c: "cansado", d: 1, luz: RIM.cocina }]}
      extra={<g>{[0, 1, 2].map((i) => <path key={i} d={`M${CP.freidora - 40 + i * 40},${P - 260} q12,-40 0,-80 q-12,-40 0,-80`} stroke="#fff" strokeWidth={6} fill="none" opacity={0.25} />)}</g>}
      hud={<><Rotulo t="buttoned. the whole time." x={1150} y={240} desde={k(256.2)} flecha="izq" /><Rotulo t="hot" x={150} y={180} desde={k(258.6)} flecha="der" color={ROJO} /><HudDia dia={9} rayas={9} /></>} />
  );
};

// ---------- 63 · me pareció raro; no lo pensé más ----------
export const P63Raro: React.FC = () => {
  const k = kDe(260);
  return (
    <Cocina cl={[mira(0, 1000, 600, 1.6), mira(k(263.8), 1050, 610, 1.9, { curva: "inout" })]} sp={{ luz: "prendida" }}
      gente={[{ l: MARLON, x: 700, p: { hI: 50, cI: 120 }, c: "neutral", d: 1 }, { l: RAFI, x: 1300, p: "parado", c: [{ f: 0, v: "duda" }, { f: k(262.2), v: "neutral" }], d: -1, mir: [{ f: 0, v: { x: -1, y: 0 } }, { f: k(262.2), v: { x: 1, y: 0 } }] }]}
      hud={<Dice quien="rafi" t="weird." x={1250} y={240} desde={k(261)} tam={80} />} />
  );
};

// ---------- 64 · esperamos hasta las 3:10 ----------
export const P64Espera: React.FC = () => {
  const k = kDe(263.81);
  const f = useF();
  const min = Math.round(interpolate(f, [0, k(265.5)], [2, 10], { extrapolateRight: "clamp" }));
  return (
    <AbsoluteFill>
      <Cocina cl={[mira(0, CP.puerta - 300, 726, 1.4), mira(k(265.6), CP.puerta - 200, 709, 1.6, { curva: "inout" })]} sp={{ luz: "noche" }}
        gente={[{ l: RAFI, x: CP.manija - 300, p: "parado", c: "miedo", d: 1, mD: <Linterna />, luz: RIM.linterna }]} />
      <div style={{ position: "absolute", right: 120, top: 120, fontFamily: F_HUD, fontWeight: 600, fontSize: 120, color: ROJO, fontVariantNumeric: "tabular-nums", textShadow: "0 0 30px rgba(255,74,61,0.6)" }}>3:{String(min).padStart(2, "0")} AM</div>
      <HudDia dia={9} rayas={9} />
    </AbsoluteFill>
  );
};

// ---------- 65 · toc, toc, toc: puntual ----------
export const P65Toc: React.FC = () => {
  const k = kDe(265.61);
  const gs = [k(265.8), k(266.4), k(267)];
  return (
    <Sacude en={gs} amp={6}>
      <Cocina cl={[mira(0, CP.puerta, 470, 2.3), mira(k(268.3), CP.puerta, 470, 2.6, { curva: "lineal" })]} sp={{ luz: "noche", golpes: gs }}
        hud={<><Dice quien="otro" t="knock." x={300} y={260} desde={gs[0]} tam={72} /><Dice quien="otro" t="knock." x={480} y={370} desde={gs[1]} tam={72} /><Dice quien="otro" t="knock." x={660} y={480} desde={gs[2]} tam={72} /><Dice quien="rafi" t="right on time." x={1200} y={820} desde={k(267.4)} tam={62} /><HudDia dia={9} hora="3:10 AM" /></>} />
    </Sacude>
  );
};

// ---------- 66 · Cal corre a la pista 16 y tira la llave ----------
export const P66Llave: React.FC = () => {
  const k = kDe(268.4);
  const f = useF();
  return (
    <Maquinas cl={[mira(0, PIN_X(12) + 60, 660, 1.6), mira(k(270.6), PIN_X(16) - 100, 709, 1.7, { curva: "inout" })]} sp={{ encendidas: f > k(270.8) ? [16] : [], luz: "noche" }}
      gente={[{ l: CAL, ruta: [{ f: 0, x: PIN_X(12) }, { f: k(270.4), x: PIN_X(16) - 160, curva: "out" }], correr: 1, p: [{ f: 0, v: "parado" }, { f: k(270.4), v: "agarrarAlto" }, { f: k(270.9), v: { hD: 60, cD: 30, tronco: 10 } }], c: "determinado", d: 1, mI: <Linterna />, luz: RIM.linterna }]}
      hud={<HudDia dia={9} rayas={9} hora="3:10 AM" />} />
  );
};

// ---------- 67 · la máquina despierta como un tren ----------
export const P67Tren: React.FC = () => {
  const gs = [6, 30, 54, 78];
  return (
    <Sacude en={gs} amp={8}>
      <Maquinas cl={[mira(0, PIN_X(16) - 80, 640, 1.8), mira(96, PIN_X(16) - 60, 660, 1.6, { curva: "inout" })]} sp={{ encendidas: [16], luz: "noche" }}
        gente={[{ l: CAL, x: PIN_X(16) - 220, p: [{ f: 0, v: { hD: 60, cD: 30, tronco: 10 } }, { f: 20, v: "señalar" }], c: "determinado", d: 1, mI: <Linterna />, luz: RIM.linterna, mir: { x: 1, y: -0.4 } }]}
        hud={<><Dice quien="otro" t="CLANK" x={260} y={220} desde={6} tam={100} rot={-8} /><Dice quien="otro" t="RUMBLE" x={1180} y={300} desde={40} tam={100} rot={5} /><HudDia dia={9} rayas={9} hora="3:10 AM" /></>} />
    </Sacude>
  );
};

// ---------- 68 · levanta la linterna: la señal ----------
export const P68Senal: React.FC = () => {
  const k = kDe(274.64);
  return (
    <Sala cl={[mira(0, X16 + 120, 620, 2.0), mira(k(277.5), X16 + 60, 600, 1.5, { curva: "inout" })]} sp={N9}
      gente={[{ l: CAL, x: X16 + 150, p: [{ f: 0, v: "parado" }, { f: k(275.6), v: levantaLinterna }], c: "determinado", d: -1, mD: <Linterna />, luz: RIM.linterna }]}
      hud={<><Rotulo t="the signal" x={1180} y={180} desde={k(276)} flecha="izq" color={AMARILLO} /><HudDia dia={9} hora="3:10 AM" /></>} />
  );
};

// ---------- 69 · tiro de la manija ----------
export const P69Tiro: React.FC = () => {
  const k = kDe(277.61);
  return (
    <Cocina cl={[mira(0, CP.manija - 150, 620, 2.6), mira(k(279.3), CP.puerta - 100, 600, 1.8, { curva: "inout" })]} sp={{ luz: "noche", puerta: (ff: number) => interpolate(ff, [k(278.4), k(279.3)], [0, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}
      gente={[{ l: RAFI, ruta: [{ f: 0, x: CP.manija - 300 }, { f: k(279.3), x: CP.manija - 420 }], p: [{ f: 0, v: { hD: 88, cD: 8, tronco: -8 } }, { f: k(278.4), v: { hD: 86, cD: 4, tronco: -18 } }], c: "miedo", d: 1, luz: RIM.linterna }]}
      hud={<HudDia dia={9} rayas={9} hora="3:10 AM" />} />
  );
};

// ---------- 70 · primero salió el frío, como un aliento; después, Gus ----------
export const P70Frio: React.FC = () => {
  const k = kDe(279.32);
  const f = useF();
  const u = interpolate(f, [0, k(281)], [0, 1], { extrapolateRight: "clamp" });
  return (
    <Cocina cl={[mira(0, CP.puerta - 380, 640, 1.6), mira(k(282.8), CP.puerta - 330, 650, 1.85, { curva: "inout" })]} sp={{ luz: "noche", puerta: 0.8 }}
      gente={[{ l: RAFI, x: CP.puerta - 700, p: "encogerse", c: "miedo", d: 1, luz: RIM.linterna }, { l: ZGUS, x: CP.puerta + 20, p: brazoZ, c: "zombi", d: -1, mD: TOALLA, luz: RIM.frio, op: (ff: number) => interpolate(ff, [k(281.6), k(282.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }]}
      extra={<Vaho x={CP.puerta} y={P} u={u} />}
      hud={<Dice quien="rafi" t="like breath." x={300} y={200} desde={k(280.6)} tam={70} />} />
  );
};

// ---------- 71 · se movía más lento que los de afuera: ocho días a diez bajo cero ----------
export const P71Lento: React.FC = () => {
  const k = kDe(282.87);
  return (
    <Cocina cl={[mira(0, CP.puerta - 200, 580, 1.5), mira(k(289), CP.puerta - 420, 600, 1.8, { curva: "inout" })]} sp={{ luz: "noche", puerta: 0.8 }}
      gente={[{ l: ZGUS, ruta: [{ f: 0, x: CP.puerta + 20 }, { f: k(289), x: CP.puerta - 260, curva: "lineal" }], p: brazoZ, c: "zombi", d: -1, mD: TOALLA, luz: RIM.frio }]}
      extra={<Vaho x={CP.puerta} y={P} u={0.6} />}
      hud={<><Rotulo t="-10°F · 8 days" x={250} y={200} desde={k(287)} flecha="der" color="#9fd3ff" /><HudDia dia={9} hora="3:10 AM" /></>} />
  );
};

// ---------- 72 · todavía con la chomba de Hollis Lanes y su credencial; la mano en un repasador blanco ----------
export const P72Chomba: React.FC = () => {
  const k = kDe(289.12);
  return (
    <Cocina cl={[mira(0, CP.puerta - 260, 660, 3.0), mira(k(292.6), CP.puerta - 240, 720, 3.0, { curva: "inout" }), mira(k(295), CP.puerta - 220, 720, 3.3, { curva: "lineal" })]} sp={{ luz: "noche", puerta: 0.8 }}
      gente={[{ l: ZGUS, x: CP.puerta - 260, p: brazoZ, c: "zombi", d: -1, mD: TOALLA, luz: RIM.frio }]}
      hud={<><Rotulo t="GUS · HOLLIS LANES" x={1180} y={220} desde={k(290.2)} hasta={k(292.6)} flecha="izq" /><Rotulo t="the bar towel" x={1180} y={640} desde={k(293)} flecha="izq" /></>} />
  );
};

// ---------- 73 · REVELACIÓN: se dio vuelta, muy despacio, no hacia el ruido… hacia mí ----------
export const P73Hacia: React.FC = () => {
  const k = kDe(295.11);
  return (
    <Cocina cl={[mira(0, CP.puerta - 260, 660, 2.6), mira(k(298.3), CP.puerta - 260, 680, 3.6, { curva: "inout" }), mira(k(299.7), CP.puerta - 260, 685, 3.8, { curva: "lineal" })]} sp={{ luz: "noche", puerta: 0.8 }}
      gente={[{ l: ZGUS, x: CP.puerta - 260, p: brazoZ, c: "zombi", d: [{ f: 0, v: 1 }, { f: k(297.8), v: -1 }], mir: [{ f: 0, v: { x: 1, y: 0 } }, { f: k(297.8), v: { x: -1, y: 0 } }], mD: TOALLA, luz: RIM.frio }]}
      hud={<Dice quien="rafi" t="toward me." x={300} y={820} desde={k(298.4)} tam={86} />} />
  );
};

// ---------- 74 · yo era lo más cercano; mi respiración. Retrocedí hasta la freidora, no me podía mover ----------
export const P74Freidora: React.FC = () => {
  const k = kDe(299.79);
  return (
    <Cocina cl={[mira(0, CP.freidora + 300, 717, 1.5), mira(k(304.4), CP.freidora + 200, 696, 1.8, { curva: "inout" }), mira(k(306.9), CP.freidora + 80, 669, 2.4, { curva: "inout" })]} sp={{ luz: "noche", puerta: 0.8 }}
      gente={[
        { l: RAFI, ruta: [{ f: 0, x: CP.freidora + 280 }, { f: k(305.1), x: CP.freidora - 40, curva: "out" }], p: [{ f: 0, v: "parado" }, { f: k(305.1), v: { hD: 30, cD: 20, hI: 30, cI: 20, tronco: -10 } }], c: "miedo", d: 1, luz: RIM.linterna },
        { l: ZGUS, ruta: [{ f: 0, x: CP.puerta - 400 }, { f: k(306.9), x: CP.freidora + 420, curva: "lineal" }], p: brazoZ, c: "zombi", d: -1, mD: TOALLA, luz: RIM.frio },
      ]}
      hud={<><Dice quien="rafi" t="my breathing." x={250} y={200} desde={k(303.3)} tam={70} /><Dice quien="rafi" t="I couldn't move." x={1150} y={820} desde={k(305.8)} tam={66} /></>} />
  );
};

// ---------- 75 · la 16 rugía en la otra punta y a Gus no le importaba ----------
export const P75Rugia: React.FC = () => (
  <Sacude en={[10, 40, 70]} amp={5}>
    <Maquinas cl={[mira(0, PIN_X(15), 600, 1.7), mira(80, PIN_X(15) + 80, 610, 1.9, { curva: "inout" })]} sp={{ encendidas: [16], luz: "noche" }}
      gente={[{ l: ZGUS, ruta: [{ f: 0, x: PIN_X(14) - 100 }, { f: 120, x: PIN_X(16) - 120, curva: "lineal" }], p: brazoZ, c: "zombi", d: 1, mD: TOALLA, luz: RIM.frio }]}
      hud={<><Dice quien="rafi" t="…and Gus didn't care." x={960} y={150} desde={84} centro tam={64} /><HudDia dia={9} rayas={9} hora="3:12 AM" /></>} />
  </Sacude>
);

// ---------- 76 · porque yo estaba ahí ----------
export const P76Ahi: React.FC = () => {
  const k = kDe(310.9);
  return (
    <Cocina cl={[mira(0, CP.freidora + 160, 660, 2.6), mira(k(313), CP.freidora + 160, 665, 3.0, { curva: "lineal" })]} sp={{ luz: "noche", puerta: 0.8 }}
      gente={[{ l: RAFI, x: CP.freidora - 40, p: { hD: 30, cD: 20, hI: 30, cI: 20, tronco: -14 }, c: "miedo", d: 1, luz: RIM.linterna }, { l: ZGUS, ruta: [{ f: 0, x: CP.freidora + 420 }, { f: k(313), x: CP.freidora + 300, curva: "lineal" }], p: brazoZ, c: "zombi", d: -1, mD: TOALLA, luz: RIM.frio }]} />
  );
};

// ---------- 77 · desde atrás del mostrador de zapatos: el walkie hace clic, estática a todo volumen ----------
export const P77Clic: React.FC = () => {
  const k = kDe(313.0);
  const f = useF();
  return (
    <Sala cl={[mira(0, ZA, 600, 1.3), mira(k(315), ZA + 60, 700, 2.4, { curva: "inout" }), mira(k(318.7), ZA + 60, 710, 2.8, { curva: "lineal" })]} zapatos sp={N9}
      sobre={<A l={NELL} x={ZA + 60} p={{ hD: 100, cD: 60, hI: 60, cI: 90 }} c="determinado" d={-1} luz={RIM.linterna} mD={<Walkie s={1.0} luz={f > k(314.7) && f % 6 < 3} />} />}
      gente={[{ l: DOT, x: ZA - 260, p: ladrillo, c: "sorpresa", d: 1, mD: <Bola s={1.0} /> }]}
      hud={<><Dice quien="otro" t="CLICK" x={1150} y={220} desde={k(314.8)} tam={90} /><Dice quien="otro" t="KSSSHHHHH" x={1050} y={360} desde={k(316.4)} tam={96} rot={-6} /></>} />
  );
};

// ---------- 78 · REVELACIÓN: Nell apretó el botón y lo sostuvo, la estática salió como un grito ----------
export const P78Grito: React.FC = () => {
  const k = kDe(318.7);
  const f = useF();
  return (
    <Sacude en={[k(321), k(322.6)]} amp={4}>
      <Sala cl={[mira(0, ZA + 60, 720, 3.0), mira(k(324.2), ZA + 60, 730, 3.6, { curva: "inout" })]} zapatos sp={N9}
        gente={[{ l: NELL, x: ZA + 60, p: { hD: 100, cD: 60, hI: 60, cI: 90 }, c: "determinado", d: -1, mD: <Walkie s={1.0} luz={f % 6 < 3} />, luz: RIM.linterna }]}
        hud={<Dice quien="rafi" t="like a scream." x={300} y={820} desde={k(322.6)} tam={80} />} />
    </Sacude>
  );
};

// ---------- 79 · Gus se dio vuelta hacia ella; Dot se puso delante con Lorraine arriba ----------
export const P79Ella: React.FC = () => {
  const k = kDe(324.31);
  return (
    <Sala cl={[mira(0, X16 - 200, 560, 0.8), mira(k(328.5), ZA - 200, 736, 1.3, { curva: "inout" })]} zapatos banco sp={N9}
      gente={[
        { l: NELL, x: ZA + 60, p: "encogerse", c: "miedo", d: -1, mD: <Walkie s={0.9} />, luz: RIM.linterna },
        { l: ZGUS, ruta: [{ f: 0, x: X16 - 600 }, { f: k(328.5), x: X16 - 200, curva: "lineal" }], p: brazoZ, c: "zombi", d: 1, mD: TOALLA, luz: RIM.frio },
        { l: DOT, ruta: [{ f: 0, x: ZA - 120 }, { f: k(327.5), x: ZA - 360 }], p: [{ f: 0, v: ladrillo }, { f: k(327.6), v: { hD: 160, cD: 20, hI: 150, cI: 30 } }], c: "determinado", d: -1, mD: <Bola s={1.0} /> },
      ]}
      hud={<Rotulo t="toward her" x={300} y={200} desde={k(325.5)} flecha="der" color={ROJO} />} />
  );
};

// ---------- 80 · la estática se apagó, el pinsetter estalló, y Gus giró otra vez: hacia la 16 ----------
export const P80Otra: React.FC = () => {
  const k = kDe(328.5);
  return (
    <Sacude en={[k(330.9)]} amp={9}>
      <Sala cl={[mira(0, X16 - 200, 640, 1.8), mira(k(332.4), X16 - 200, 650, 2.1, { curva: "inout" }), mira(k(335.6), X16 - 100, 620, 1.6, { curva: "inout" })]} zapatos banco sp={N9}
        gente={[{ l: ZGUS, x: X16 - 200, p: brazoZ, c: "zombi", d: [{ f: 0, v: 1 }, { f: k(332.4), v: -1 }], mir: [{ f: 0, v: { x: 1, y: 0 } }, { f: k(332.4), v: { x: 0, y: -1 } }], mD: TOALLA, luz: RIM.frio }]}
        hud={<><Dice quien="otro" t="CRASH" x={1250} y={180} desde={k(330.9)} tam={110} rot={-6} /><Dice quien="rafi" t="the loudest thing in the room." x={960} y={860} desde={k(333.3)} centro tam={60} /></>} />
    </Sacude>
  );
};

// ---------- 81 · caminó por la alfombra: pasó la 12, pasó la 14, despacio ----------
export const P81Alfombra: React.FC = () => {
  const k = kDe(335.74);
  return (
    <Sala cl={[mira(0, pistaX(11) - 40, 650, 1.75), mira(k(342.2), pistaX(15) + 60, 650, 1.75, { curva: "lineal" })]} sp={N9}
      gente={[{ l: ZGUS, ruta: [{ f: 0, x: pistaX(11) - 100 }, { f: k(342.2), x: pistaX(15) + 40, curva: "lineal" }], p: brazoZ, c: "zombi", d: 1, mD: TOALLA, luz: RIM.frio }]}
      hud={<><Rotulo t="lane 12" x={700} y={240} desde={k(338.6)} hasta={k(339.8)} flecha="abajo" /><Rotulo t="lane 14" x={1060} y={240} desde={k(339.9)} flecha="abajo" /><HudDia dia={9} hora="3:12 AM" /></>} />
  );
};

// ---------- 82 · y por la madera lustrada de la 16, por el medio, como si hubiera jugado mil veces (lo había hecho) ----------
export const P82Madera: React.FC = () => {
  const k = kDe(342.2);
  return (
    <Sala cl={[mira(0, X16, 620, 1.3), mira(k(348.4), X16, 685, 2.0, { curva: "inout" })]} sp={N9}
      gente={[{ l: ZGUS, ruta: [{ f: 0, x: X16, y: P }, { f: k(348.4), x: X16, y: YB + 20, curva: "lineal" }], esc: 0.62, p: brazoZ, c: "zombi", d: 1, mD: TOALLA, luz: RIM.frio }]}
      hud={<Dice quien="rafi" t="…which he had." x={1200} y={820} desde={k(347.6)} tam={70} />} />
  );
};

// ---------- 83 · entró al pozo. Cal bajó la barra: clang, trabada ----------
export const P83Clang: React.FC = () => {
  const k = kDe(348.54);
  const f = useF();
  const b = interpolate(f, [k(350.6), k(351.2)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (f >= k(352.5)) return (
    <Maquinas cl={[mira(0, PIN_X(16) - 170, 600, 2.3), mira(60, PIN_X(16) - 170, 610, 2.5, { curva: "inout" })]} sp={{ encendidas: [16], luz: "noche" }}
      gente={[{ l: CAL, x: PIN_X(16) - 230, p: { hD: 110, cD: 10, hI: 100, cI: 20, tronco: 10 }, c: "determinado", d: 1, habla: [[k(352.6) - k(352.5), k(353.5) - k(352.5)]], mI: <Linterna />, luz: RIM.linterna }]}
      hud={<><Dice quien="cal" t="locked." x={1200} y={240} desde={0} tam={96} /><HudDia dia={9} rayas={9} hora="3:13 AM" /></>} />
  );
  return (
    <Sacude en={[k(351.2)]} amp={12}>
      <Sala cl={[mira(0, X16, YB - 60, 2.4), mira(k(351.2), X16, YB - 40, 2.8, { curva: "inout" }), mira(k(353.7), X16, YB, 2.2, { curva: "inout" })]} sp={{ ...N9, cerradas: f > k(352.6) ? [16] : [] }}
        gente={[{ l: ZGUS, ruta: [{ f: 0, x: X16, y: YB + 20 }, { f: k(350), x: X16, y: YB - 10 }], esc: 0.62, p: brazoZ, c: "zombi", d: 1, luz: RIM.frio, op: (ff: number) => interpolate(ff, [k(349.4), k(350.4)], [1, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }]}
        sobre={<BarraBarrido baja={b} cerrada={f > k(352.4)} />}
        hud={<><Dice quien="otro" t="CLANG." x={1250} y={200} desde={k(351.2)} tam={110} rot={-5} /></>} />
      {f >= k(348.9) && f < k(350.8) && <CortePozo f={f - k(348.9)} left={50} top={430} esc={0.8} />}
    </Sacude>
  );
};

// ---------- 84 · Nell me salvó la vida con un walkie-talkie. Tenía nueve ----------
export const P84Salvo: React.FC = () => {
  const k = kDe(353.78);
  return (
    <Sala cl={[mira(0, ZA - 200, 560, 1.6), mira(k(357.4), ZA - 120, 673, 2.3, { curva: "inout" })]} zapatos sp={N9C}
      gente={[{ l: RAFI, x: ZA - 360, p: "parado", c: "triste", d: 1 }, { l: NELL, x: ZA - 100, p: "parado", c: "neutral", d: -1, mD: <Walkie s={0.9} />, luz: RIM.linterna }]}
      hud={<><Dice quien="rafi" t="She was nine." x={1200} y={200} desde={k(356.4)} tam={74} /><HudDia dia={9} rayas={9} /></>} />
  );
};

// ---------- 85 · se encogió de hombros: «respirabas muy fuerte» ----------
export const P85Fuerte: React.FC = () => {
  const k = kDe(357.48);
  return (
    <Sala cl={[mira(0, ZA - 100, 720, 2.6), mira(k(362), ZA - 100, 730, 3.0, { curva: "inout" })]} zapatos sp={N9C}
      gente={[{ l: NELL, x: ZA - 100, p: [{ f: 0, v: "parado" }, { f: k(359), v: "encogerse" }, { f: k(359.8), v: "hablar" }], c: [{ f: 0, v: "neutral" }, { f: k(360), v: "picaro" }], d: -1, mD: <Walkie s={0.9} />, habla: [[k(360), k(361.9)]], luz: RIM.linterna }]}
      hud={<Dice quien="nell" t="You were breathing too loud." x={960} y={150} desde={k(360.1)} centro tam={80} />} />
  );
};

// ---------- 86 · entramos al freezer con linternas, los cinco, y contamos ----------
export const P86Entramos: React.FC = () => {
  const k = kDe(362.06);
  const xs = [FP.puerta - 40, FP.puerta + 160, FP.puerta + 360, FP.puerta + 540, FP.puerta + 720];
  const ls = [RAFI, CAL, DOT, NELL, MARLON];
  return (
    <EnFreezer cl={[mira(0, FP.puerta + 60, 600, 1.8), mira(k(366.5), 1300, 600, 1.4, { curva: "inout" })]} sp={{ puerta: 1, vacio: 0, delantal: true }}
      gente={ls.map((l, i) => ({ l, ruta: [{ f: i * 8, x: FP.puerta - 200 }, { f: k(366) - 20 + i * 4, x: xs[i] }], c: "determinado", d: 1 as const, mD: i < 3 ? <Linterna /> : undefined, luz: RIM.linterna }))}
      hud={<HudDia dia={9} rayas={9} hora="3:20 AM" />} />
  );
};

// ---------- 87 · el conteo, uno por uno ----------
export const P87Conteo: React.FC = () => {
  const k = kDe(366.56);
  return (
    <AbsoluteFill>
      <EnFreezer cl={[mira(0, 300, 702, 1.7), mira(k(369.8), 620, 702, 1.7, { curva: "inout" }), mira(k(369.9), 900, 663, 2.6), mira(k(372.8), 1000, 658, 2.8, { curva: "lineal" }), mira(k(372.9), 1150, 640, 2.5), mira(k(377.2), 1650, 640, 2.6, { curva: "inout" })]} sp={{ puerta: 1, vacio: 0, delantal: true }}
        gente={[{ l: RAFI, ruta: [{ f: 0, x: 300 }, { f: k(377), x: 1600 }], p: "celular", c: "determinado", d: 1, luz: RIM.linterna }]} />
      <Lista x={1150} y={140} tam={56} lineas={[{ t: "212  PATTIES", desde: k(367.7) }, { t: "6  CASES OF FRIES", desde: k(369.9) }, { t: "30  PACKS HOT DOGS", desde: k(371.3) }, { t: "40  BUNS (solid)", desde: k(372.9) }, { t: "14  TUBS VANILLA", desde: k(375) }]} />
    </AbsoluteFill>
  );
};

// ---------- 88 · Dot hace la cuenta en la pared con la tiza de Nell: 40 días, 50 con cuidado ----------
export const P88Cuenta: React.FC = () => {
  const k = kDe(377.26);
  return (
    <AbsoluteFill>
      <Sala cl={[mira(0, 1700, 560, 1.5), mira(k(384.2), 1760, 685, 2.0, { curva: "inout" })]} sp={{ ...N9C, luz: "liga" }}
        gente={[{ l: DOT, x: 1780, p: [{ f: 0, v: "agarrarAlto" }, { f: 30, v: { hD: 140, cD: 30 } }, { f: 60, v: "agarrarAlto" }], c: "determinado", d: 1, mD: <Tiza /> }, { l: NELL, x: 1560, p: "parado", c: "feliz", d: 1 }]} />
      <Lista x={160} y={150} tam={64} lineas={[{ t: "5 PEOPLE", desde: k(379.7) }, { t: "× 2 MEALS A DAY", desde: k(380.6) }, { t: "= 40 DAYS", desde: k(381.2), color: AMARILLO }, { t: "careful: 50", desde: k(382.6), color: "#9be3a6" }]} />
      <HudDia dia={9} rayas={9} />
    </AbsoluteFill>
  );
};

// ---------- 89 · en el piso del freezer, junto a la puerta, el delantal de Gus ----------
export const P89Delantal: React.FC = () => {
  const k = kDe(384.3);
  return (
    <EnFreezer cl={[mira(0, FP.delantal, 600, 1.6), mira(k(388.5), FP.delantal + 20, 700, 2.8, { curva: "inout" })]} sp={{ puerta: 1, vacio: 0.3, delantal: true }}
      gente={[{ l: RAFI, ruta: [{ f: 0, x: FP.delantal - 500 }, { f: k(386.6), x: FP.delantal - 160 }], p: [{ f: 0, v: "parado" }, { f: k(386.8), v: "agacharse" }], c: "triste", d: 1, mD: <Linterna />, luz: RIM.linterna }]}
      hud={<Rotulo t="Gus's apron" x={1180} y={760} desde={k(387.6)} flecha="izq" />} />
  );
};

// ---------- 90 · en el bolsillo, la llave del contenedor, etiqueta naranja: TRASH ----------
export const P90Llave: React.FC = () => {
  const k = kDe(388.56);
  const f = useF();
  const u = interpolate(f, [k(389.4), k(390.2)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <EnFreezer cl={[mira(0, FP.delantal - 120, 620, 2.2), mira(k(393.3), FP.delantal - 120, 630, 2.5, { curva: "lineal" })]} sp={{ puerta: 1, vacio: 0.3, delantal: true }}
        gente={[{ l: RAFI, x: FP.delantal - 300, p: [{ f: 0, v: "parado" }, { f: k(389.2), v: { hD: 100, cD: 0 } }, { f: k(390.4), v: { hD: 60, cD: 80 } }], c: [{ f: 0, v: "duda" }, { f: k(390.4), v: "sorpresa" }], d: 1, mI: <Linterna />, luz: RIM.linterna }]} />
      <Velo color="#0b0a0c" o={0.35 * u} />
      <svg width={700} height={420} viewBox="0 0 700 420" style={{ position: "absolute", left: 980, top: 300 - (1 - u) * 60, opacity: u, transform: `rotate(${-8 + Math.sin(f / 14) * 2}deg)` }}>
        <circle cx={150} cy={210} r={70} fill="none" stroke="#c9b27a" strokeWidth={22} />
        <rect x={210} y={196} width={260} height={30} rx={8} fill="#c9b27a" />
        {[0, 1, 2].map((i) => <rect key={i} x={400 + i * 24} y={226} width={16} height={30 + (i % 2) * 14} fill="#c9b27a" />)}
        <path d="M80,210 L20,150" stroke="#8a8a92" strokeWidth={6} />
        <g transform="translate(-40,40) rotate(-20)"><rect x={0} y={60} width={150} height={86} rx={12} fill="#ff7a1a" /><circle cx={22} cy={103} r={9} fill="#2a2420" /><text x={84} y={118} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#2a1a10">TRASH</text></g>
      </svg>
      <Dice quien="rafi" t="the dumpster key." x={960} y={150} desde={k(390.6)} centro tam={70} />
    </AbsoluteFill>
  );
};

// ---------- 91 · Gus sacaba la basura todas las noches a las 7:55, quince minutos antes de que yo lo mandara ----------
export const P91Basura: React.FC = () => {
  const k = kDe(393.34);
  return (
    <AbsoluteFill>
      <Afuera cl={[mira(0, 3000, 560, 1.2), mira(k(398.6), 2700, 560, 1.5, { curva: "inout" })]} sp={{ persiana: 0, neon: 1 }}
        gente={[{ l: GUS, ruta: [{ f: 0, x: 2400 }, { f: k(398.6), x: 3200 }], p: { hD: 30, cD: 20 }, c: "cansado", d: 1, mD: <Bolsa color="#2a2a30" />, luz: RIM.neon }]} />
      <Recuerdo />
      <HudDia dia={1} rayas={1} desde={9999} hora="7:55 PM" />
      <Rotulo t="15 min before I sent him in" x={240} y={760} desde={k(396.4)} flecha="der" />
    </AbsoluteFill>
  );
};

// ---------- 92 · algo allá afuera le agarró la mano; se la envolvió en un repasador y no le dijo a nadie ----------
export const P92Mano: React.FC = () => {
  const k = kDe(398.72);
  return (
    <AbsoluteFill>
      <Cocina cl={[mira(0, 900, 620, 2.0), mira(k(403.9), 950, 640, 2.4, { curva: "inout" })]} sp={{ luz: "prendida" }}
        gente={[{ l: GUS, x: 900, p: [{ f: 0, v: { hD: 60, cD: 120, hI: 60, cI: 110 } }, { f: k(401.5), v: { hD: 40, cD: 90, hI: 50, cI: 100 } }], c: [{ f: 0, v: "miedo" }, { f: k(402.6), v: "neutral" }], d: 1, mD: TOALLA }]} />
      <Recuerdo />
      <Dice quien="rafi" t="He didn't tell anybody." x={960} y={150} desde={k(402.5)} centro tam={70} />
      <HudDia dia={1} rayas={1} desde={9999} hora="7:58 PM" />
    </AbsoluteFill>
  );
};

// ---------- 93 · esa noche cenamos helado: un pote, cinco cucharas ----------
const Cuchara: React.FC = () => <g transform="rotate(-30)"><rect x={-3} y={-30} width={6} height={30} rx={3} fill="#d9d9e0" /><ellipse cx={0} cy={-34} rx={7} ry={10} fill="#d9d9e0" /></g>;
export const P93Helado: React.FC = () => {
  const k = kDe(403.96);
  const xs = [SN - 700, SN - 450, SN - 200, SN + 60, SN + 320];
  const ls = [MARLON, NELL, DOT, CAL, RAFI];
  return (
    <Sala cl={[mira(0, SN - 200, 520, 1.1), mira(k(408.8), SN - 200, 717, 1.5, { curva: "inout" })]} snack sp={N9C}
      detras={ls.map((l, i) => ({ l, x: xs[i], p: [{ f: 0, v: "parado" }, { f: 30 + i * 10, v: { hD: 70, cD: 70 } }], c: "feliz", d: (i < 2 ? 1 : -1) as 1 | -1, mD: <Cuchara />, luz: RIM.cocina }))}
      sobre={<PoteHelado s={2.2} />}
      hud={<><Dice quien="rafi" t="one tub. five spoons." x={960} y={150} desde={k(407)} centro tam={70} /><HudDia dia={9} rayas={9} hora="8:00 PM" /></>} />
  );
};

// ---------- 94 · la primera vez que alguien se rió desde el día uno, hasta Marlon ----------
export const P94Risa: React.FC = () => {
  const xs = [SN - 700, SN - 450, SN - 200, SN + 60, SN + 320];
  const ls = [MARLON, NELL, DOT, CAL, RAFI];
  return (
    <Sala cl={[mira(0, SN - 250, 600, 2.0), mira(98, SN - 450, 600, 2.4, { curva: "inout" })]} snack sp={N9C}
      detras={ls.map((l, i) => ({ l, x: xs[i], p: [{ f: 0, v: "celebrar" }, { f: 40 + i * 6, v: { hD: 70, cD: 70 } }], c: "risa", d: (i < 2 ? 1 : -1) as 1 | -1, habla: [[0, 90]], mD: <Cuchara />, luz: RIM.cocina }))}
      hud={<Rotulo t="even Marlon" x={240} y={200} desde={50} flecha="der" />} />
  );
};

// ---------- 95 · estira el brazo para la cuchara de servir y la manga se le corre ----------
export const P95Manga: React.FC = () => {
  const k = kDe(412.18);
  return (
    <Sala cl={[mira(0, SN - 600, 620, 2.0), mira(k(415.4), SN - 600, 660, 2.8, { curva: "inout" }), mira(k(418.5), SN - 600, 670, 3.1, { curva: "lineal" })]} snack sp={N9C}
      detras={[
        { l: MARLON, x: SN - 700, p: [{ f: 0, v: { hD: 70, cD: 70 } }, { f: k(413), v: { hI: 95, cI: 5, hD: 30, cD: 30, tronco: 14 } }], c: "feliz", d: 1, mI: (ff: number) => (ff > k(415.1) ? <Venda /> : null), luz: RIM.cocina },
      ]}
      gente={[{ l: NELL, x: SN - 420, p: { hD: 70, cD: 70 }, c: [{ f: 0, v: "feliz" }, { f: k(416.4), v: "sorpresa" }], d: -1, mir: { x: -0.6, y: -0.2 }, luz: RIM.cocina }]}
      hud={<Rotulo t="his sleeve slid back" x={1150} y={220} desde={k(414.8)} flecha="izq" />} />
  );
};

// ---------- 96 · REVELACIÓN: Nell le ve la muñeca: una venda, marrón en los bordes, igual que la mano de Gus ----------
export const P96Venda: React.FC = () => {
  const k = kDe(418.4);
  const f = useF();
  const g = f > k(422.2);
  return (
    <AbsoluteFill>
      <Sala cl={[mira(0, SN - 450, 700, 3.4), mira(k(420.6), SN - 450, 710, 4.0, { curva: "inout" }), mira(k(423.9), SN - 450, 712, 4.2, { curva: "lineal" })]} snack sp={N9C}
        gente={[{ l: NELL, x: SN - 450, p: { hD: 70, cD: 70 }, c: "miedo", d: -1, mir: { x: -0.6, y: -0.2 }, luz: RIM.cocina }]} />
      <svg width={520} height={300} viewBox="0 0 520 300" style={{ position: "absolute", left: 1240, top: 560, opacity: interpolate(f, [k(419.6), k(420.2)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: "rotate(-6deg)", boxShadow: "0 18px 40px rgba(0,0,0,0.55)", background: "#2c3e6a", borderRadius: 18 }}>
        <rect x={0} y={90} width={520} height={130} fill="#e9c9a4" />
        <rect x={120} y={84} width={260} height={142} rx={14} fill="#efe9dc" />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${130 + i * 62},86 l40,138`} stroke="#d7cfbf" strokeWidth={6} />)}
        <path d="M120,86 q30,20 0,140 M380,86 q-30,20 0,140" stroke="#8a5a32" strokeWidth={10} fill="none" opacity={0.8} />
        <rect x={0} y={0} width={110} height={300} fill="#2c3e6a" />
      </svg>
      {g && <Velo color="#ffd38a" o={0.08} />}
      <Rotulo t="same as Gus's hand" x={1180} y={420} desde={k(422)} flecha="abajo" color={ROJO} />
      <HudDia dia={9} rayas={9} hora="8:00 PM" />
    </AbsoluteFill>
  );
};

// ---------- 97 · Marlon se baja la manga, mira a Nell y se lleva un dedo a los labios ----------
export const P97Dedo: React.FC = () => {
  const k = kDe(423.92);
  return (
    <Sala cl={[mira(0, SN - 580, 620, 2.4), mira(k(426.6), SN - 620, 625, 2.8, { curva: "inout" }), mira(k(428.7), SN - 630, 625, 3.0, { curva: "lineal" })]} snack sp={N9C}
      detras={[
        { l: MARLON, x: SN - 700, p: [{ f: 0, v: { hI: 60, cI: 120, hD: 50, cD: 110 } }, { f: k(426.6), v: { hD: 30, cD: 160, hI: 20, cI: 30 } }], c: [{ f: 0, v: "miedo" }, { f: k(425.6), v: "neutral" }], d: 1, mir: { x: 1, y: 0 }, luz: RIM.cocina },
      ]}
      gente={[{ l: NELL, x: SN - 420, p: { hD: 70, cD: 70 }, c: "miedo", d: -1, mir: { x: -1, y: -0.3 }, luz: RIM.cocina }]}
      hud={<Dice quien="marlon" t="shh." x={300} y={220} desde={k(426.8)} tam={90} />} />
  );
};

// ---------- 98 · CTA final: contame en los comentarios ----------
export const P98Comentarios: React.FC = () => {
  const k = kDe(428.72);
  return (
    <AbsoluteFill>
      <Cocina cl={[mira(0, CP.puerta - 470, 670, 2.4), mira(k(432.3), CP.puerta - 450, 660, 2.8, { curva: "inout" })]} sp={{ luz: "noche", puerta: 0.8 }}
        gente={[
          { l: RAFI, x: CP.puerta - 560, p: { hD: 60, cD: 40 }, c: "duda", d: 1, mir: { x: 0, y: 0 }, habla: [[0, 20]], luz: RIM.linterna, mD: <Linterna /> },
          { l: NELL, x: CP.puerta - 380, p: { hI: 20, cI: 30 }, c: "determinado", d: -1, mir: [{ f: 0, v: { x: 1, y: 0 } }, { f: k(430.4), v: { x: 0, y: 0 } }], luz: RIM.linterna, mD: <Walkie s={0.8} /> },
        ]} />
      <Velo color="#0b0a0c" o={0.2} />
      <Pildora texto="TELL ME IN THE COMMENTS" x={960} y={160} desde={k(428.9)} />
      <Dice quien="nell" t={"Would you have opened\nthat freezer?"} x={960} y={240} desde={k(430.3)} centro tam={96} rot={-2} />
      <HudDia dia={9} rayas={9} />
    </AbsoluteFill>
  );
};

// ---------- 99 · el día 21 Nell tiene que decidir si se lo cuenta a su papá. Y ese fue el día nueve ----------
export const P99Nueve: React.FC = () => {
  const k = kDe(432.34);
  return (
    <AbsoluteFill>
      <Sala cl={[mira(0, 1600, 600, 1.4), mira(k(436.5), 1800, 600, 1.9, { curva: "inout" }), mira(k(438.9), pistaX(8), 300, 1.6, { curva: "inout" })]} sp={N9C}
        gente={[{ l: CAL, x: 1500, p: "brazosCruzados", c: "cansado", d: 1, luz: RIM.pantalla }, { l: NELL, x: 1860, sent: 0, p: { tronco: -6, pI: 30, rI: 140, pD: 40, rD: 150, hD: 30, cD: 40 }, c: "triste", d: -1, mir: { x: -1, y: -0.2 }, mD: <Walkie s={0.8} /> }]} />
      <Pildora texto="SUBSCRIBE · DAY 21" x={960} y={150} desde={k(432.5)} color={ROJO} />
      <Rotulo t="tell her dad?" x={300} y={260} desde={k(434.6)} flecha="der" color={AMARILLO} />
      <Dice quien="nell" t="DAY NINE" x={960} y={760} desde={k(437.6)} centro tam={150} rot={-2} />
      <HudDia dia={9} rayas={9} />
    </AbsoluteFill>
  );
};

// ---------- 100 · pantalla final: el Ep. 3 ----------
export const P100Final: React.FC = () => (
  <Final ep={3} titulo={"One Of Us Was Bitten\nAnd Didn't Tell Anyone"} fondo={<Sala cl={[mira(0, SN - 600, 600, 2.0), mira(300, SN - 560, 600, 1.9, { curva: "inout" })]} snack sp={N9C}
    gente={[{ l: NELL, x: SN - 300, p: Array.from({ length: 12 }).flatMap((_, i) => [{ f: i * 24, v: { hD: 150, cD: 20, cabeza: -6 } }, { f: i * 24 + 12, v: { hD: 160, cD: 35, cabeza: -6 } }]), c: "determinado", d: 1, mD: <Tiza />, luz: RIM.cocina }]} />} />
);
