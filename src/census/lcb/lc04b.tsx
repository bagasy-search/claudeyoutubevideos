// lc04 · planos 3:24,8-6:24,9 (SEC 9-16 del plan MxM: escarabajos, agua, el sótano, casi, la helada, bajo tierra,
// Lily, CTA y la tarjeta del Ep.5). Cuadros locales: l(segundo global). v1: cada plano con personajes ACTUANDO + dato + componente.
import React from "react";
import { interpolate, random } from "remotion";
import { Clave, enPantalla, mira, useF } from "../../anikit/camara";
import { Escena } from "../../anikit/escena";
import { Halo } from "../../anikit/luz";
import { PlanoM } from "../../anikit/montaje";
import { F_HUD, Globo, Pildora, RelojDia } from "../../anikit/pantalla";
import { Lata } from "../../anikit/props";
import type { Pose } from "../../anikit/personaje";
import { GUS, JUNE, JUNE_MOCHI, PAL, THEO, THEO_INV } from "../elenco";
import { A, Rotulo, gestos, loc } from "./comun_ep";
import { BEN, DEV, LILY, NINO, Ore, ROSA } from "./elenco_lcb";
import { GRANJA_PISO, GRANJA_PUNTOS, Granja, PARED, Papa, Termometro } from "./granja";
import { LOS10 } from "./lc04a";
import { Balde, Barril, Canasta, Grietas, HojaMacro, HorquillaPapas, Manometro, Pala, PlantaCerca, Primer, SolCruza, Brocha } from "./piezas4";
import { Barra, CalTachas, CaraPapa, Carretilla, Cristal, Dato, Destello, EscarabajoM, Estrellitas, FlechasFrio, Gotas, Hojitas, ManoBrocha, ManoPinza, Larvas, ManoSacaPapa, Moscas, Muro, PlantaSeca, Pip, Polvo, SiluetasVentana, TermoFiebre, ease } from "./piezas_e4b";
import { Helada4, MARCUS_VERANO } from "./tarjetas";
import { FarolMano, Vial } from "../lcc/piezas";
import { GR_HENIL, GR_PISO, GR_PUNTOS, Granero, PasilloFarmacia } from "../lcc/sets5";
import { Escarabajo } from "./piezas4";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ap = (f: number, a: number, d = 10) => interpolate(f, [a, a + d], [0, 1], cl);
const P = GRANJA_PISO;
const Y = P + 60;
const MARCUS = MARCUS_VERANO;
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

// cámara CONTINUA (vuelta 4, idea de lc03a): puntos de paso [cuadro, X, Y, zoom] → una clave por cuadro con spline de
// Hermite (tangentes Catmull-Rom, zoom en escala log). Nunca llega a velocidad 0 a mitad de plano: sin lageos ni frenadas.
// El último punto va SIEMPRE pasado el corte (L + 10) para que la cámara siga viva hasta el último cuadro.
type KP = [number, number, number, number];
const camino = (kp: KP[]): Clave[] => {
  const n = kp.length;
  const v = (i: number) => [kp[i][1], kp[i][2], Math.log(kp[i][3])];
  const tan = (i: number) => {
    const a = Math.max(0, i - 1), b = Math.min(n - 1, i + 1);
    const va = v(a), vb = v(b), dt = kp[b][0] - kp[a][0];
    return va.map((x, j) => (vb[j] - x) / dt);
  };
  const out: Clave[] = [];
  let i = 0;
  for (let f = Math.floor(kp[0][0]); f <= Math.ceil(kp[n - 1][0]); f++) {
    while (i < n - 2 && f > kp[i + 1][0]) i++;
    const h = kp[i + 1][0] - kp[i][0];
    const s = Math.min(1, Math.max(0, (f - kp[i][0]) / h));
    const p0 = v(i), p1 = v(i + 1), m0 = tan(i), m1 = tan(i + 1);
    const h00 = 2 * s ** 3 - 3 * s ** 2 + 1, h10 = s ** 3 - 2 * s ** 2 + s, h01 = -2 * s ** 3 + 3 * s ** 2, h11 = s ** 3 - s ** 2;
    const q = p0.map((x, j) => h00 * x + h10 * h * m0[j] + h01 * p1[j] + h11 * h * m1[j]);
    out.push(mira(f, q[0], q[1], Math.exp(q[2])));
  }
  return out;
};
// barrido dentro del plano: tramo A continuo → paneo rápido (inout) → tramo B continuo
const conBarrido = (a: KP[], b: KP[]): Clave[] => [...camino(a), mira(b[0][0], b[0][1], b[0][2], b[0][3], { curva: "inout" }), ...camino(b).slice(1)];

// el sótano todavía VACÍO (E59-E60): tapa las canastas que el set dibuja en los estantes; quedan sólo las tablas
const TapaCajones: React.FC<{ o?: number }> = ({ o = 1 }) => (
  <g opacity={o}>
    {Array.from({ length: 12 }).map((_, i) => { const r = Math.floor(i / 6), c = i % 6; return <rect key={i} x={2270 + c * 78} y={P - 150 + r * 90 - 62} width={80} height={62} fill="#241c1e" />; })}
    {[0, 1].map((r) => <rect key={`t${r}`} x={2260} y={P - 150 + r * 90} width={480} height={10} fill="#7a5a3e" />)}
  </g>
);
// cartel en píldora OSCURA opaca (texto siempre legible sobre tallos, heno o cielo); x = centro
const Cartel: React.FC<{ texto: string; x: number; y: number; desde: number; hasta?: number; color?: string; tam?: number; borde?: string }> = ({ texto, x, y, desde, hasta, color = "#ffcf6e", tam = 64, borde }) => {
  const f = useF();
  if (f < desde || (hasta !== undefined && f > hasta)) return null;
  const o = Math.min(ap(f, desde, 8), hasta !== undefined ? 1 - ap(f, hasta - 8, 8) : 1);
  return <div style={{ position: "absolute", left: x, top: y, transform: `translateX(-50%) scale(${0.92 + 0.08 * o})`, opacity: o, background: "rgba(14,10,18,0.88)", border: `4px solid ${borde ?? color}`, borderRadius: tam * 0.45, padding: `${tam * 0.1}px ${tam * 0.42}px ${tam * 0.16}px`, fontFamily: F_HUD, fontWeight: 600, fontSize: tam, lineHeight: 1.1, color, whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(0,0,0,0.4)" }}>{texto}</div>;
};

// ---------- E46 · 204:8-208:3 · las plantas altas: una columna de escarabajos entra marchando por la derecha; zoom a una hoja ----------
const R01: React.FC = () => {
  const f = useF();
  const l = loc(204.8);
  return (
    <Escena Set={Granja} pal={PAL} seed={90} setProps={{ hora: "dia", estacion: "verano", crec: 0.75 }}
      claves={[mira(0, 3520, 690, 1.4), mira(l(206.0), 3500, 700, 1.45), mira(l(208.3), 3420, 720, 1.75, { curva: "in" })]}
      medio={<>
        <A look={MARCUS} escala={1.35} ruta={[{ f: 0, x: 3380, y: Y }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "manosCintura" }, ...gestos(10, l(206.0), ["pensar", "hablar", { hD: 100, cD: 10, tronco: 6 }], 20), { f: l(206.0), v: "agacharse" }, { f: l(206.7), v: { hD: 92, cD: 18, tronco: 2 } }, ...gestos(l(207.1), l(208.3), [{ hD: 100, cD: 12, cabeza: 8 }, { hD: 92, cD: 22, cabeza: 2 }], 12)]} caras={[{ f: 0, v: "neutral" }, { f: l(205.4), v: "duda" }, { f: l(206.8), v: "sorpresa" }]}
          enManoD={(fr: number) => (fr > l(206.5) ? <g transform="translate(30,10) rotate(30)"><path d="M0,40 Q-60,0 0,-70 Q60,0 0,40 Z" fill="#5aa040" stroke="#2f5a22" strokeWidth={4} /><path d="M0,40 L0,-60" stroke="#2f5a22" strokeWidth={3} />{[[-18, -20], [16, -6], [-10, 12], [14, -38], [-4, -44]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7 + (i % 2) * 3} fill="#c9d8a0" stroke="#2f5a22" strokeWidth={2} />)}</g> : null)} />
        {Array.from({ length: 18 }).map((_, i) => {
          const x = 5000 + i * 85 - f * 17;
          return <Escarabajo key={i} x={x} y={P + 14 + (i % 3) * 18} s={1.5} rot={-90} f={f + i * 3} seed={i} />;
        })}
      </>}
      hud={<>
        <Rotulo texto="A WAR" x={1460} y={130} centro desde={l(205.6)} hasta={l(207.9)} color="#e23a2e" tam={110} />
        <Dato x={1460} y={290} rotulo="BEETLES ARRIVING" de={0} a={18} desde={l(205.4)} fin={l(208.0)} color="#f0b23a" tam={78} />
      </>} />
  );
};

// ---------- E47 · 208:3-214:5 · macro: los escarabajos MASTICAN la hoja hasta dejarla de encaje ----------
const R02: React.FC = () => {
  const f = useF();
  const l = loc(208.3);
  const mord = interpolate(f, [l(208.6), l(214.0)], [0, 1], cl);
  const vol = interpolate(f, [l(210.6), l(212.4)], [0, 1], { ...cl, easing: (t) => t * t * (3 - 2 * t) });
  const sy = Math.cos(vol * Math.PI);
  const hy = 560 + 476 * sy;
  return (
    <Escena Set={Primer} pal={PAL} seed={91} setProps={{ fondo: "verde", luz: "#fff3c0" }} claves={[mira(0, 960, 540, 1.0), mira(l(214.5), 960, 540, 1.12)]}
      medio={<>
        <g transform={`translate(960,560) scale(1.7,${sy * 1.7})`}><HojaMacro x={0} y={0} s={1} mordida={mord} seed={4} />{sy < 0 && <Larvas n={14} k={Math.min(1, -sy * 3)} />}</g>
        <ManoPinza x={960} y={hy} k={ap(f, l(210.2), 10) * (1 - ap(f, l(212.9), 10))} />
        {Array.from({ length: 7 }).map((_, i) => { const k = ap(f, l(208.8) + i * 8, 6); const x = 500 + random(`es${i}`) * 900 + Math.sin(f / 18 + i) * 30; const y = 340 + random(`ey${i}`) * 420; return k > 0 ? <EscarabajoM key={i} x={x} y={y} s={1.5 * k} rot={random(`er${i}`) * 360 + Math.sin(f / 12 + i) * 20} f={f} seed={i} /> : null; })}
      </>}
      hud={<>
        {/* banda opaca arriba (fuera del HUD): los rótulos nunca quedan sobre larvas ni escarabajos */}
        <div style={{ position: "absolute", left: 680, top: 72, width: 1160, height: 128, borderRadius: 22, background: "rgba(14,10,18,0.86)", border: "3px solid #ffcf6e55", opacity: ap(f, l(208.9), 8) }} />
        <Rotulo texto="COLORADO POTATO BEETLE" x={1260} y={100} centro desde={l(209.0)} hasta={l(212.3)} color="#ffcf6e" tam={64} />
        <Rotulo texto="NO PESTICIDES" x={1260} y={90} centro desde={l(212.4)} color="#e23a2e" tam={84} />
        <Barra x={560} y={950} w={620} rotulo="LEAF" de={0} a={1} desde={l(208.9)} fin={l(213.0)} color="#7cd36a" texto={(v) => (v < 0.98 ? "CHEWED..." : "LACE")} />
        {/* inserto: Ben entero mira la hoja con asco (el que va a patrullar) */}
        {f > l(212.6) && <Pip><g opacity={ap(f, l(212.6), 8)}>
          <rect x={1430} y={480} width={380} height={470} rx={22} fill="#2c4a2a" stroke="#f6ecd2" strokeWidth={8} />
          <rect x={1438} y={830} width={364} height={112} rx={4} fill="#4a7a34" />
          <A look={BEN} escala={1.5} ruta={[{ f: 0, x: 1620, y: 905 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "parado" }, ...gestos(l(212.8), l(214.5), ["manosCara", { hD: 40, cD: 120, hI: 40, cI: 120, tronco: -8, cabeza: -10 }, "encogerse"], 10)]} caras={[{ f: 0, v: "asco" }]} miradas={[{ f: 0, v: { x: -0.8, y: 0.1 } }]} />
        </g></Pip>}
      </>} />
  );
};

// ---------- E48 · 214:5-221:8 · Ben y Lily: balde de agua jabonosa; los escarabajos vuelan con arco al balde ----------
const R03: React.FC = () => {
  const f = useF();
  const l = loc(214.5);
  const L = l(221.8);
  const px = [3380, 3770];
  let nb = 0;
  for (let i = 0; i < 2; i++) for (let j = 0; j < 6; j++) nb += Math.max(0, Math.floor((f + j * 7 + i * 4) / 42 - 0.94) + 1);
  return (
    <Escena Set={Granja} pal={PAL} seed={92} setProps={{ hora: "dia", estacion: "verano", crec: 0.8 }}
      claves={[mira(0, 3640, 800, 2.1), mira(L, 3680, 810, 2.25)]}
      medio={<>
        {[BEN, LILY].map((look, i) => <A key={i} look={look} escala={NINO * 1.25} ruta={[{ f: 0, x: px[i], y: Y }]} dir={[{ f: 0, v: 1 }]} seed={i * 9}
          poses={[{ f: 0, v: "parado" }, ...gestos(6 + i * 9, L, ["agacharse", { hD: 20, cD: 30, tronco: -4, hI: 50, cI: 30 }, { hD: 75, cD: 15 }], 18)]} caras={[{ f: 0, v: "determinado" }, { f: l(218.0), v: "risa" }]} />)}
        {px.map((x0, i) => <g key={`b${i}`} transform={`translate(${x0 + 215},${Y - 76}) scale(1.9)`}><Balde /></g>)}
        {[0, 1].map((i) => Array.from({ length: 6 }).map((_, j) => {
          const t = ((f + j * 7 + i * 4) % 42) / 42;
          const x = px[i] + 75 + t * 140, y = Y - 160 + t * 70 - Math.sin(t * Math.PI) * 90;
          return t < 0.94 ? <Escarabajo key={`${i}${j}`} x={x} y={y} s={0.55} rot={t * 700} f={f} seed={j} /> : <g key={`${i}${j}`} opacity={1 - (t - 0.94) * 16}><ellipse cx={px[i] + 215} cy={Y - 92} rx={20 + (t - 0.94) * 700} ry={6 + (t - 0.94) * 120} fill="none" stroke="#cfe6f0" strokeWidth={4} /></g>;
        }))}
      </>}
      hud={<>
        <Rotulo texto="THE BEETLE PATROL" x={1300} y={50} centro desde={l(215.0)} color="#ffcf6e" tam={74} />
        <Dato x={1500} y={150} rotulo="IN THE BUCKET · THIS MORNING" de={0} a={99} v={nb} desde={l(215.2)} color="#f0b23a" tam={80} vivo={false} />
      </>} />
  );
};

// ---------- E49 · 221:8-223:5 · Marcus entrega las latas de duraznos, los niños las reciben ----------
const R04: React.FC = () => {
  const l = loc(221.8);
  const L = l(223.5);
  return (
    <Escena Set={Granja} pal={PAL} seed={93} setProps={{ hora: "ocaso", estacion: "verano", crec: 0.8 }} claves={[mira(0, 3310, 720, 1.95), mira(L, 3330, 722, 2.1)]}
      medio={<>
        <A look={MARCUS} ruta={[{ f: 0, x: 3250, y: Y }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 60, cD: 20 } }, ...gestos(8, L, [{ hD: 100, cD: 4, tronco: 6 }, { hD: 70, cD: 20 }], 14)]} caras={[{ f: 0, v: "feliz" }]} enManoD={<Lata s={1.1} color="#f2a03a" />} />
        {[BEN, LILY].map((look, i) => <A key={i} look={look} escala={NINO} ruta={[{ f: 0, x: 3400 + i * 130, y: Y }]} dir={[{ f: 0, v: -1 }]} seed={i * 4}
          poses={[{ f: 0, v: "parado" }, { f: l(222.1) + i * 5, v: { hD: 90, cD: 8 } }, { f: l(222.5) + i * 5, v: "celebrar" }, ...gestos(l(222.8), L, ["saludar", "celebrar"], 9)]} caras={[{ f: 0, v: "sorpresa" }, { f: l(222.5), v: "risa" }]}
          enManoD={i === 0 ? ((fr: number) => (fr > l(222.3) ? <Lata s={1} color="#f2a03a" /> : null)) : undefined} />)}
        {[0, 1, 2, 3, 4].map((i) => <Lata key={i} x={3150 + i * 34} y={Y - 2} s={0.7} color="#f2a03a" />)}
      </>}
      hud={<>
        <Rotulo texto="PAID IN PEACHES" x={1200} y={70} centro desde={l(221.9)} color="#ffcf6e" tam={96} />
        <g transform="translate(1700,190) scale(1.5)"><rect x={-34} y={-46} width={68} height={92} rx={8} fill="#c9ced4" stroke="#1c1416" strokeWidth={4} /><rect x={-34} y={-30} width={68} height={60} fill="#f2a03a" /><circle cx={0} cy={0} r={20} fill="#f6b27a" stroke="#c8602a" strokeWidth={3} /><path d="M0,-18 Q10,-30 20,-24 Q12,-12 0,-16 Z" fill="#4f9a3c" /><rect x={-34} y={-48} width={68} height={8} rx={4} fill="#9aa0a8" /></g>
        <Dato x={1500} y={250} rotulo="CANS PAID" de={0} a={6} desde={l(222.0)} fin={l(223.2)} color="#f2a03a" tam={74} />
      </>} />
  );
};

// ---------- E50 · 223:5-231:0 · la pared del granero: una mano con brocha pinta cada grupo de 5 hasta 9,000 ----------
const R05: React.FC = () => {
  const f = useF();
  const l = loc(223.5);
  const n = Math.floor(interpolate(f, [l(224.0), l(229.6)], [0, 120], { ...cl, easing: (t) => t * t }));
  const g = Math.max(0, Math.floor((n - 1) / 5));
  const gx = PARED.x + 22 + (g % 8) * 34 + 12, gy = PARED.y + 90 + Math.floor(g / 8) * 48 + 18;
  const fin = f > l(229.6);
  const L5 = l(231.0);
  const hx = fin ? 960 + ap(f, l(229.8), 14) * 70 : gx, hy = fin ? PARED.y + 305 : gy;
  const bx = 1081 + 110 * ap(f, l(229.3), 12); // Ben en el cajón (x≈1050 en pantalla); antes del «9,000» se corre a la derecha para no taparlo
  return (
    <Escena Set={Granja} pal={PAL} seed={94} mano={1.5}
      setProps={{ hora: "dia", estacion: "verano", crec: 0.8, pared: [{ t: "BEETLES", desde: -99, x: PARED.x + 20, y: PARED.y + 60, tam: 40 }, { t: "9,000", desde: l(229.8), x: PARED.x + 60, y: PARED.y + 320, tam: 70, color: "#b8382c", vel: 1.4 }] }}
      claves={[mira(0, 1050, 600, 1.35), mira(l(231.0), 1030, 630, 1.75, { curva: "inout" })]}
      medio={<>
        <g>{Array.from({ length: n }).map((_, i) => { const gg = Math.floor(i / 5), k = i % 5; const x = PARED.x + 22 + (gg % 8) * 34, y = PARED.y + 90 + Math.floor(gg / 8) * 48; return k < 4 ? <rect key={i} x={x + k * 6} y={y} width={3} height={36} fill="#2a1c18" /> : <line key={i} x1={x - 4} y1={y + 30} x2={x + 26} y2={y + 6} stroke="#2a1c18" strokeWidth={3} />; })}</g>
        <rect x={1011} y={P - 100} width={250} height={110} rx={6} fill="#b08a5a" stroke="#6a4a2a" strokeWidth={5} /><rect x={1011} y={P - 60} width={250} height={8} fill="#8a6a42" />
        <A look={BEN} escala={1.15} ruta={[{ f: 0, x: bx, y: P - 100 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "manosCintura" }]} caras={[{ f: 0, v: "determinado" }, { f: l(229.8), v: "risa" }]} />
        <A look={LILY} escala={1.1} ruta={[{ f: 0, x: 1367, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "parado" }, ...gestos(10, L5, ["hablar", { hD: 90, cD: 20 }, "manosCintura"], 22)]} caras={[{ f: 0, v: "feliz" }]} enManoD={<Lata s={1.2} color="#f2a03a" />} />
        {n > 0 && <ManoBrocha x={hx} y={hy} f={f} manga="#e0b030" ox={bx - hx + 20} oy={P - 420 - hy} o={1 - ap(f, l(230.4), 10)} />}
      </>}
      hud={<Dato x={1590} y={90} rotulo="BEETLES KILLED" de={0} a={9000} v={fin ? 9000 : (n / 120) * 9000} desde={l(224.0)} color="#e23a2e" tam={84} vivo={false} />} />
  );
};

// ---------- E51 · 231:0-236:9 · el cielo despejado: Theo mira arriba, la tierra se agrieta ----------
const R06: React.FC = () => {
  const f = useF();
  const l = loc(231.0);
  return (
    <Escena Set={Granja} pal={PAL} seed={95} setProps={{ hora: "dia", estacion: "verano", crec: 0.7, seca: ap(f, l(231.6), 80) }}
      claves={camino([[0, 3630, 716, 1.62], [l(232.6), 3670, 722, 1.68], [l(234.4), 3700, 730, 1.74], [l(236.9) + 10, 3720, 742, 1.86]])}
      medio={<>
        <Grietas x0={3020} x1={4900} y={P + 40} k={ap(f, l(232.4), 60)} />
        <Grietas x0={3420} x1={3960} y={P + 70} k={ap(f, l(233.4), 50)} />
        {/* la patada levanta un terrón seco (234.2); al agacharse se le deshace la tierra en la mano (235.6) */}
        <Polvo x={3770} y={Y - 6} f={f} f0={l(234.25)} s={1.4} color="#8a6a42" />
        {f > l(234.2) && f < l(235.0) && (() => { const u = (f - l(234.2)) / 24; return <g transform={`translate(${3760 + u * 260},${Y - 20 - Math.sin(u * Math.PI) * 120}) rotate(${u * 400})`}><path d="M-18,-8 L6,-16 L20,0 L10,14 L-14,12 Z" fill="#8a6a42" stroke="#5a4028" strokeWidth={3} /></g>; })()}
        {[0, 1, 2, 3].map((i) => <Polvo key={i} x={3770 + i * 8} y={Y - 70 + i * 16} f={f} f0={l(235.7) + i * 5} s={0.7} color="#a8865a" />)}
        <A look={THEO} ruta={[{ f: 0, x: 3560, y: Y }, { f: l(232.3), x: 3690, y: Y }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: "parado" }, { f: l(232.0), v: { hD: 150, cD: 105 } }, ...gestos(l(232.4), l(234.0), [{ hD: 160, cD: 125, cabeza: -6 }, { hD: 150, cD: 60, cabeza: -10 }, { hD: 150, cD: 100, cabeza: -10 }], 13), { f: l(234.05), v: { hD: 40, cD: 20, hI: 50, cI: 20, pD: 60, rD: 5, tronco: -8 } }, { f: l(234.5), v: "manosCintura" }, { f: l(235.2), v: "agacharse" }, ...gestos(l(235.5), l(236.3), [{ tronco: 20, hD: 95, cD: 40, hI: 40, cI: 30, pI: 30, rI: 50, pD: 30, rD: 50 }, { tronco: 22, hD: 90, cD: 55, hI: 40, cI: 30, pI: 30, rI: 50, pD: 30, rD: 50 }], 8), { f: l(236.3), v: { hD: 150, cD: 100, cabeza: -10 } }, ...gestos(l(236.6), l(237.3), [{ hD: 145, cD: 120, cabeza: -6 }, { hD: 150, cD: 100, cabeza: -10 }], 10)]}
          caras={[{ f: 0, v: "neutral" }, { f: l(232.4), v: "cansado" }, { f: l(234.1), v: "enojo" }, { f: l(235.4), v: "triste" }]} miradas={[{ f: 0, v: { x: 0.6, y: -0.2 } }, { f: l(232.2), v: { x: 0.2, y: -0.9 } }, { f: l(235.2), v: { x: 0.5, y: 0.7 } }, { f: l(236.3), v: { x: 0.2, y: -0.9 } }]} />
      </>}
      hud={<>
        <Rotulo texto="NOT ALWAYS WHEN YOU NEED IT" x={1240} y={140} centro desde={l(233.6)} color="#ffcf6e" tam={50} />
        <Dato x={1240} y={250} rotulo="JULY · DAYS WITHOUT RAIN" de={0} a={21} desde={l(232.0)} fin={l(236.6)} color="#ffcf6e" tam={76} />
      </>} />
  );
};

// ---------- E52 · 236:9-240:1 · julio: tres semanas sin lluvia; la luz cambia SUAVE (sin parpadeo), el sol cruza con estela ----------
const R07: React.FC = () => {
  const f = useF();
  const l = loc(236.9);
  const u = interpolate(f, [l(237.0), l(240.0)], [0, 21], cl);
  const k = ap(f, l(237.0), 70);
  return (
    <Escena Set={Granja} pal={PAL} seed={96} setProps={{ hora: "dia", estacion: "verano", crec: 0.7, seca: 1 }} claves={[mira(0, 3640, 800, 1.95), mira(l(240.1), 3660, 810, 2.05)]}
      detras={u < 21 ? <g>{[0, 1, 2, 3].map((j) => <g key={j} opacity={1 - j * 0.28}><SolCruza u={Math.max(0, u - j * 0.07)} x0={2700} x1={4700} y={480} /></g>)}</g> : undefined}
      medio={<>
        <Grietas x0={3020} x1={4900} y={P + 40} k={1} />
        <PlantaSeca x={3330} y={P + 96} s={1.5} k={k} f={f} />
        <A look={ROSA} ruta={[{ f: 0, x: 3560, y: Y }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "parado" }, ...gestos(4, l(240.1), [{ hD: 120, cD: 100 }, { hD: 150, cD: 55 }], 5)]} caras={[{ f: 0, v: "cansado" }, { f: l(238.4), v: "asco" }]} />
        <A look={GUS} ruta={[{ f: 0, x: 3800, y: Y }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "manosCintura" }, ...gestos(l(237.2), l(240.1), [{ hD: 150, cD: 8 }, "manosCintura"], 22)]} caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: { x: 0.8, y: -0.7 } }]} />
      </>}
      hud={<>
        <div style={{ position: "absolute", inset: 0, background: "#ff9a3a", opacity: 0.1 * k, mixBlendMode: "multiply" }} />
        <CalTachas x={1570} y={190} titulo="JULY" n={21} cols={7} k={u} desde={l(237.0)} tam={44} />
        <Rotulo texto="3 WEEKS · NO RAIN" x={960} y={900} centro desde={l(237.6)} color="#ffcf6e" tam={64} />
      </>} />
  );
};

// ---------- E53 · 240:1-246:6 · Dev sube los barriles (cargar-empujar); corte a primer plano: la manguera gotea en el surco ----------
const R08: React.FC = () => {
  const f = useF();
  const l = loc(240.1);
  const sube = (k: number) => interpolate(f, [l(240.5 + k * 0.9), l(241.4 + k * 0.9)], [0, 1], cl);
  const agua = ap(f, l(244.2), 12);
  // el contador cuenta los barriles que YA están sobre el techo (pasaron el alero): 1, 2, 3 = lo que se ve
  const nb = [0, 1, 2].filter((k) => sube(k) >= 0.35).length;
  return (
    <Escena Set={Granja} pal={PAL} seed={97} setProps={{ hora: "dia", estacion: "verano", crec: 0.75, seca: 1 - agua * 0.6 }}
      claves={conBarrido([[0, 1290, 112, 1.5], [l(241.6), 1250, 118, 1.53], [l(243.0), 1215, 80, 1.56], [l(243.7), 1205, 44, 1.57]], [[l(244.25), 3230, 735, 1.42], [l(245.5), 3300, 738, 1.5], [l(246.6) + 10, 3380, 742, 1.62]])}
      medio={<>
        {/* los barriles suben al TECHO DEL GRANERO (faldón izquierdo: 930,260 → 1250,180), no al silo */}
        {[0, 1, 2].map((k) => { const u = sube(k); if (u <= 0) return null; const bxr = 1200 - k * 100, byr = 180 + (1250 - bxr) * 0.25; const a = Math.min(1, u / 0.35), c = Math.max(0, (u - 0.35) / 0.65); const x = u < 0.35 ? 805 + 125 * a : 930 + (bxr - 930) * c, y = u < 0.35 ? 430 - 168 * a : 262 + (byr - 262) * c; return <g key={k} opacity={Math.min(1, u * 6)} transform={`rotate(${u < 0.35 ? -53 : -14},${x},${y})`}><Barril x={x} y={y} s={0.7} /></g>; })}
        {/* la manguera baja por el faldón y la esquina del granero y corre por el suelo (nunca cruza el silo) */}
        <path d={`M1200,${P - 712} Q1460,${P - 650} 1690,${P - 470} Q1716,${P - 300} 1708,${P - 40} Q2300,${P - 18} 2900,${P - 70} L5000,${P - 70}`} stroke="#2a2a30" strokeWidth={12} fill="none" strokeLinecap="round" />
        <Gotas x0={3060} x1={4300} y0={P - 62} y1={P - 14} n={22} f={f} k={agua} tam={1.7} />
        {agua > 0 && <ellipse cx={3680} cy={P - 8} rx={620 * agua} ry={16} fill="#2a1c14" opacity={0.45} />}
        <A look={DEV} ruta={[{ f: 0, x: 1380, y: P - 688 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "agarrarAlto" }, ...gestos(0, l(243.8), ["agarrarAlto", "empujar", "tirarCarga", "empujar"], 11), { f: l(243.8), v: "manosCintura" }]} caras={[{ f: 0, v: "determinado" }, { f: l(243.8), v: "feliz" }]} escala={1.2} />
        {f > l(244.0) && <A look={DEV} escala={1.3} ruta={[{ f: 0, x: 3300, y: Y }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "manosCintura" }, ...gestos(l(244.4), l(246.6), [{ hD: 100, cD: 10, tronco: 6 }, "manosCintura", { hD: 60, cD: 60, hI: 60, cI: 60, tronco: 10, cabeza: 14 }], 16)]} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.5 } }]} />}
      </>}
      hud={<>
        <Rotulo texto="GRAVITY" x={1520} y={110} centro desde={l(241.0)} hasta={l(244.0)} color="#9bd8ff" tam={90} />
        <Dato x={1520} y={240} rotulo="BARRELS ON THE ROOF" de={0} a={3} v={nb} desde={l(240.5)} hasta={l(244.0)} color="#9bd8ff" tam={70} vivo={false} />
        <Rotulo texto="A HOSE WITH HOLES POKED IN IT" x={1240} y={930} centro desde={l(244.8)} color="#9bd8ff" tam={56} />
      </>} />
  );
};

// ---------- E54 · 246:6-248:7 · «It's ugly.» / «It works.»: se ven los dos de cuerpo entero, gesticulan; la manguera gotea atrás ----------
const R09: React.FC = () => {
  const f = useF();
  const l = loc(246.6);
  const L = l(248.7);
  return (
    <Escena Set={Granja} pal={PAL} seed={98} setProps={{ hora: "dia", estacion: "verano", crec: 0.8 }} claves={[mira(0, 3265, 760, 1.55), mira(L, 3265, 760, 1.62)]}
      medio={<>
        <path d={`M2700,${P - 70} L4600,${P - 70}`} stroke="#2a2a30" strokeWidth={10} />
        <Gotas x0={3000} x1={4400} y0={P - 64} y1={P - 16} n={16} f={f} tam={1.2} />
        <A look={DEV} ruta={[{ f: 0, x: 3090, y: Y }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "brazosCruzados" }, ...gestos(l(246.7), L, ["encogerse", { hD: 70, cD: 60, hI: 70, cI: 60, tronco: -4, cabeza: 8 }, "encogerse", "hablar"], 10)]} caras={[{ f: 0, v: "picaro" }]} habla={[[l(246.7), l(247.5)]]} />
        <A look={MARCUS} ruta={[{ f: 0, x: 3440, y: Y }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "manosCintura" }, { f: l(247.6), v: "hablar" }, ...gestos(l(247.7), L, [{ hD: 150, cD: 8 }, { hD: 160, cD: 6, tronco: -3 }], 9)]} caras={[{ f: 0, v: "neutral" }, { f: l(247.8), v: "feliz" }]} habla={[[l(247.7), L]]} enManoD={((fr: number) => (fr > l(247.7) ? <g><ellipse rx={13} ry={11} fill="#3a2a24" /><rect x={-5} y={-30} width={10} height={24} rx={5} fill="#3a2a24" /></g> : null))} />
      </>}
      hud={<>
        <Globo texto="It's ugly." x={870} y={260} desde={0} hasta={l(248.7)} cola="der" tam={64} />
        <Globo texto="It works." x={1330} y={260} desde={l(247.6)} hasta={l(248.7)} cola="izq" tam={64} />
        <Dato x={1500} y={930} rotulo="DRIPS ON THE ROW" de={0} a={16} desde={l(246.8)} fin={l(248.3)} color="#7ab8f0" tam={60} />
      </>} />
  );
};

// ---------- E55 · 248:7-253:0 · la loma: Theo y Gus llegan con la carretilla de papas; la puerta del sótano se abre ----------
const R10: React.FC = () => {
  const f = useF();
  const l = loc(248.7);
  const L = l(253.0);
  const cx = interpolate(f, [0, l(250.4)], [1850, 2300], { ...cl });
    return (
    <Escena Set={Granja} pal={PAL} seed={99} setProps={{ hora: "ocaso", estacion: "verano", crec: 0.85, sotano: 0 }} claves={camino([[0, 1660, 640, 1.5], [l(250.4), 2080, 636, 1.56], [L + 10, 2215, 628, 1.68]])}
      medio={<>
        <Carretilla x={cx} y={P - 28} dir={1} rueda={cx * 1.6} />
        {/* Theo suelta las manijas al llegar y señala la loma (¿dónde las guardamos?); Gus viene detrás, a 250 px: cabezas separadas */}
        <A look={THEO} ruta={[{ f: 0, x: 1850 - 110, y: P - 30 }, { f: l(250.4), x: 2300 - 110, y: P - 30 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "empujar" }, { f: l(250.5), v: "parado" }, ...gestos(l(250.8), L + 12, [{ hD: 105, cD: 8, tronco: 3, cabeza: -4 }, { hD: 96, cD: 14, tronco: 1 }, "manosCintura", { hD: 70, cD: 70, hI: 70, cI: 70, cabeza: 8 }], 16)]} caras={[{ f: 0, v: "determinado" }, { f: l(251.0), v: "duda" }]} escala={1.15} />
        <A look={GUS} ruta={[{ f: 0, x: 1850 - 360, y: P - 30 }, { f: l(250.6), x: 2300 - 360, y: P - 30 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "parado" }, ...gestos(l(250.8), L + 12, [{ hD: 60, cD: 80, tronco: 4 }, { hD: 70, cD: 70, cabeza: 6 }], 18)]} caras={[{ f: 0, v: "cansado" }, { f: l(251.4), v: "duda" }]} miradas={[{ f: 0, v: { x: 0.9, y: 0 } }]} escala={1.15} enManoD={<Canasta s={0.7} papas={1} />} />
        <Polvo x={2200} y={P - 30} f={f} f0={l(249.8)} s={1.2} />
      </>}
      hud={<>
        <Rotulo texto="STORAGE" x={1240} y={130} centro desde={l(250.4)} color="#ffcf6e" tam={110} />
        <Cartel texto="NO PLACE TO KEEP THEM" x={1470} y={262} desde={l(250.9)} color="#ffcf6e" tam={44} />
        <Dato x={1470} y={350} rotulo="POTATOES" de={0} a={20000} sufijo=" LB" desde={l(251.0)} fin={l(252.6)} color="#ffcf6e" tam={62} />
      </>} />
  );
};

// ---------- E56 · 253:0-256:9 · 20,000 lb que se pudren en octubre: Rosa se tapa la nariz y retrocede; moscas ----------
const R11: React.FC = () => {
  const f = useF();
  const l = loc(253.0);
  const neg = ap(f, l(254.4), 50);
  return (
    <Escena Set={Primer} pal={PAL} seed={100} setProps={{ fondo: "oscuro", luz: "#ffb04a" }} claves={[mira(0, 960, 560, 1.0), mira(l(256.9), 1000, 560, 1.1)]}
      medio={<>
        {Array.from({ length: 90 }).map((_, i) => { const fl = Math.floor(Math.sqrt(i)); return <Papa key={i} x={960 + (random(`rk${i}`) - 0.5) * Math.max(80, 900 - fl * 90)} y={860 - fl * 50 + random(`rq${i}`) * 14} s={2.2} rot={random(`rr${i}`) * 180} color={random(`rc${i}`) < neg ? "#2a2426" : "#c9935a"} />; })}
        <Moscas x={960} y={600} r={430} n={16} f={f} o={ap(f, l(254.6), 20)} />
        <A look={ROSA} escala={1.55} ruta={[{ f: 0, x: 520, y: 1030 }, { f: l(254.6), x: 520, y: 1030 }, { f: l(255.5), x: 250, y: 1030 }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: "manosCintura" }, { f: l(254.4), v: "pensar" }, ...gestos(l(255.6), l(256.9), ["pensar", { hD: 25, cD: 150, cabeza: 14, hI: 80, cI: 30 }], 12)]} caras={[{ f: 0, v: "neutral" }, { f: l(254.4), v: "asco" }, { f: l(255.5), v: "miedo" }]} />
      </>}
      hud={<>
        <Rotulo texto="ROT BY OCTOBER" x={1240} y={130} centro desde={l(254.6)} color="#e23a2e" tam={80} />
        <Dato x={1640} y={420} rotulo="GOOD POTATOES" de={20000} a={0} sufijo=" LB" desde={l(253.4)} fin={l(256.5)} color="#e23a2e" tam={64} />
      </>} />
  );
};

// ---------- E57 · 256:9-262:1 · termómetro grande: el mercurio baja, rebota y vibra en la zona verde 38-40; Gus lo lee ----------
const R12: React.FC = () => {
  const f = useF();
  const l = loc(256.9);
  const t0 = interpolate(f, [l(257.0), l(259.6)], [70, 39], { ...cl, easing: (u) => 1 - (1 - u) * (1 - u) });
  const t = t0 + (f > l(259.6) ? Math.sin(f / 5) * 0.8 * ap(f, l(259.6), 10) : 0);
  const enZona = t >= 38 && t <= 40;
  return (
    <Escena Set={Primer} pal={PAL} seed={101} setProps={{ fondo: "oscuro", luz: "#9bb7ff" }} claves={[mira(0, 960, 560, 1.0), mira(l(262.1), 960, 540, 1.12)]}
      medio={<>
        <Termometro x={960} y={820} temp={t} s={3.4} marca={[38, 40]} />
        <A look={GUS} escala={2.35} ruta={[{ f: 0, x: 470, y: 1050 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "parado" }, ...gestos(l(257.1), l(262.1), [{ hD: 85, cD: 20, cabeza: 8 }, { hD: 70, cD: 35, cabeza: -4 }, "pensar", { hD: 95, cD: 10, cabeza: 10 }], 22)]}
          caras={[{ f: 0, v: "neutral" }, { f: l(257.6), v: "sorpresa" }, { f: l(259.8), v: "determinado" }, { f: l(260.8), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.9, y: -0.3 } }]}
          enManoD={<Termometro x={0} y={-20} temp={t} s={0.55} marca={[38, 40]} />} />
      </>}
      hud={<>
        <Rotulo texto="DARK · COOL · HUMID" x={1420} y={90} centro desde={l(257.4)} color="#f6ecd2" tam={64} brillo={false} />
        {t > 40.2 ? (f >= l(257.2) ? <div style={{ position: "absolute", left: 1550, top: 330, transform: "translateX(-50%)", textAlign: "center", fontFamily: F_HUD, whiteSpace: "nowrap", background: "rgba(14,10,18,0.78)", border: "3px solid #ff8a6a", borderRadius: 26, padding: "10px 32px 13px", opacity: ap(f, l(257.2), 8) }}>
            <div style={{ fontWeight: 500, fontSize: 27, letterSpacing: 3, color: "#f3ead2" }}>NOW · TOO WARM</div>
            <div style={{ fontWeight: 600, fontSize: 80, lineHeight: 1.02, color: "#ff8a6a" }}>&gt;40 °F</div></div> : null)
          : <Dato x={1550} y={330} rotulo="NOW" de={39} a={39} v={t} dec={1} sufijo=" °F" desde={l(257.2)} color={enZona ? "#7cd36a" : "#ff8a6a"} tam={80} vivo={false} />}
        <Rotulo texto="38-40 °F" x={1380} y={580} desde={l(259.8)} color="#7cd36a" tam={90} />
      </>} />
  );
};

// ---------- E58 · 262:1-266:3 · muy caliente: brotan y sufren · muy frío: tiritan y se arruinan; termómetros laterales ----------
const R13: React.FC = () => {
  const f = useF();
  const l = loc(262.1);
  const kc = ap(f, l(262.6), 40), kf = ap(f, l(264.4), 40);
  const tc = interpolate(f, [l(262.6), l(265.8)], [40, 78], cl), tf = interpolate(f, [l(264.4), l(266.0)], [38, 20], cl); // sólo gráfico: en pantalla no hay °F propios
  return (
    <Escena Set={Primer} pal={PAL} seed={102} setProps={{ fondo: "oscuro" }} claves={[mira(0, 960, 540, 1.0), mira(l(266.3), 960, 540, 1.04)]}
      medio={<>
        <rect x={-500} y={-600} width={1460} height={2400} fill="#4a2a1e" /><rect x={960} y={-600} width={1600} height={2400} fill="#1e2a44" />
        <Papa x={650} y={610} s={6.6} brotes={kc * 2} rot={-10} />
        <CaraPapa x={650} y={610} s={6.6} rot={-10} tipo="calor" f={f} k={ap(f, l(262.9), 20)} />
        <Papa x={1330 + Math.sin(f * 2.2) * 3 * kf} y={610} s={6.6}
          color={`rgb(${Math.round(201 - 80 * kf)},${Math.round(147 - 20 * kf)},${Math.round(90 + 100 * kf)})`} rot={8} />
        <CaraPapa x={1330 + Math.sin(f * 2.2) * 3 * kf} y={610} s={6.6} rot={8} tipo="frio" f={f} k={ap(f, l(264.7), 20)} />
        <A look={GUS} escala={1.9} ruta={[{ f: 0, x: 960, y: 1070 }]} dir={[{ f: 0, v: -1 }, { f: l(264.2), v: 1 }]} poses={[{ f: 0, v: "parado" }, ...gestos(l(262.4), l(266.3), [{ hD: 100, cD: 6 }, { hD: 115, cD: 8 }], 12)]} caras={[{ f: 0, v: "neutral" }, { f: l(264.2), v: "duda" }]} />
        <Termometro x={250} y={930} temp={tc} s={2.5} />
        <Termometro x={1700} y={930} temp={tf} s={2.5} />
      </>}
      hud={<>
        <Rotulo texto={"TOO WARM\nSPROUT"} x={860} y={110} centro desde={l(262.4)} color="#ffb04a" tam={56} />
        <Rotulo texto={"TOO COLD\nSPOIL"} x={1440} y={110} centro desde={l(264.4)} color="#9bd8ff" tam={56} />
        <div style={{ position: "absolute", left: 650, top: 880, transform: "translateX(-50%)", opacity: ap(f, l(262.8), 8), background: "rgba(14,10,18,0.8)", border: "3px solid #ffb04a", borderRadius: 24, padding: "6px 26px 10px", fontFamily: F_HUD, fontWeight: 600, fontSize: 60, color: "#ffb04a", whiteSpace: "nowrap" }}>ABOVE 40 °F</div>
        <div style={{ position: "absolute", left: 1330, top: 880, transform: "translateX(-50%)", opacity: ap(f, l(264.5), 8), background: "rgba(14,10,18,0.8)", border: "3px solid #9bd8ff", borderRadius: 24, padding: "6px 26px 10px", fontFamily: F_HUD, fontWeight: 600, fontSize: 60, color: "#9bd8ff", whiteSpace: "nowrap" }}>BELOW 38 °F</div>
      </>} />
  );
};

// ---------- E59 · 266:3-273:5 · la loma en corte: Theo cava (tierra al aire), Gus levanta el muro de piedras ----------
const R14: React.FC = () => {
  const f = useF();
  const l = loc(266.3);
  const L = l(273.5);
  const wall = interpolate(f, [l(267.4), l(272.8)], [0, 1], cl);
  return (
    <Escena Set={Granja} pal={PAL} seed={103} setProps={{ hora: "ocaso", estacion: "verano", crec: 0.85, sotano: ap(f, l(266.6), 24), tSot: 39 }}
      claves={camino([[0, 2430, 688, 1.62], [l(270.0), 2460, 690, 1.72], [L + 10, 2490, 692, 1.85]])}
      medio={<>
        <TapaCajones o={ap(f, l(266.6), 24)} />
        <Muro x={2690} y={P - 28} k={wall} w={208} filas={4} />
        <A look={THEO} ruta={[{ f: 0, x: 2320, y: P - 30 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "agacharse" }, ...gestos(0, L, ["agacharse", "tirarCarga", "tirarSuelta"], 14)]} caras={[{ f: 0, v: "cansado" }]} enManoD={<Pala tierra />} escala={1.0} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <Polvo key={i} x={2470} y={P - 60} f={f} f0={l(266.9) + i * 42} s={1.1} color="#6a4a32" />)}
        <A look={GUS} ruta={[{ f: 0, x: 2610, y: P - 30 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "agacharse" }, ...gestos(l(267.0), L, ["agacharse", { hD: 85, cD: 50, hI: 80, cI: 50, tronco: 6 }, { hD: 60, cD: 60, hI: 60, cI: 60 }], 20)]} caras={[{ f: 0, v: "determinado" }]} escala={1.1}
          enManoD={<ellipse rx={28} ry={18} fill="#8a8580" />} />
      </>}
      hud={<>
        <Rotulo texto="A ROOT CELLAR" x={1240} y={130} centro desde={l(266.8)} color="#ffcf6e" tam={80} />
        <Barra x={1240} y={968} w={600} rotulo="STONE WALL" de={0} a={1} desde={l(267.3)} fin={l(272.8)} color="#c9b48a" />
      </>} />
  );
};

// ---------- E60 · 273:5-279:3 · Gus lo revisa «como los manómetros de los barcos»: asiente, la aguja oscila ----------
const R15: React.FC = () => {
  const f = useF();
  const l = loc(273.5);
  const L = l(279.3);
  const o = ap(f, l(275.2), 10);
  return (
    <Escena Set={Granja} pal={PAL} seed={104} setProps={{ hora: "noche", estacion: "verano", crec: 0.85, sotano: 1, tSot: 39 }}
      claves={camino([[0, 2640, 650, 1.55], [L + 10, 2658, 656, 1.67]])}
      medio={<><TapaCajones />
        <A look={GUS} ruta={[{ f: 0, x: 2560, y: P - 30 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 60, cD: 40, tronco: 8, hI: 75, cI: 45 } }, ...gestos(0, L, [{ hD: 60, cD: 40, tronco: 10, cabeza: 16, hI: 70, cI: 50 }, { hD: 60, cD: 40, tronco: 2, cabeza: -6, hI: 85, cI: 40 }], 25)]}
          caras={[{ f: 0, v: "determinado" }, { f: l(276.0), v: "neutral" }, { f: l(277.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.3 } }]} escala={1.25} enManoD={<FarolMano f={f} s={0.9} />} enManoI={<g><rect x={-24} y={-34} width={48} height={38} rx={3} fill="#efe6d2" stroke="#6a5240" strokeWidth={3} />{[-22, -12, -2].map((y) => <line key={y} x1={-16} y1={y} x2={16} y2={y} stroke="#6a5240" strokeWidth={2} />)}</g>} /></>}
      hud={<>
        <Rotulo texto="TWICE A DAY. EVERY DAY." x={1240} y={130} centro desde={l(277.6)} color="#ffcf6e" tam={64} />
        {o > 0 && <g><Pip><g opacity={o}><circle cx={1500} cy={520} r={250} fill="#1c2430" stroke="#9bd8ff" strokeWidth={6} /><Manometro x={1500} y={520} s={1.5} aguja={0.55 + 0.07 * Math.sin(f / 5) + 0.02 * Math.sin(f * 1.7)} /></g></Pip>
          <div style={{ opacity: o }}><Rotulo texto="ORE BOATS" x={1500} y={800} centro desde={0} color="#9bd8ff" tam={88} /></div></g>}
        <Dato x={1500} y={930} rotulo="CHECKS TODAY" de={0} a={2} desde={l(275.4)} fin={l(278.0)} color="#ffcf6e" tam={50} />
      </>} />
  );
};

// ---------- E61 · 279:3-281:9 · día 320, mediados de agosto: la cámara baja al maíz que crece y Theo lo mide con la mano ----------
const R16: React.FC = () => {
  const f = useF();
  const l = loc(279.3);
  const L = l(281.9);
  return (
    <Escena Set={Granja} pal={PAL} seed={105} setProps={{ hora: "dia", estacion: "verano", crec: 0.45 + 0.55 * ap(f, 0, 70) }} claves={[mira(0, 4600, 800, 1.9), mira(L, 4640, 790, 2.1, { curva: "inout" })]}
      medio={<A look={THEO} ruta={[{ f: 0, x: 4540, y: Y }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "manosCintura" }, ...gestos(l(279.6), l(280.7), [{ hD: 85, cD: 6 }, { hD: 110, cD: 6 }], 14), { f: l(280.8), v: { hD: 145, cD: 0, hI: 60, cI: 20, cabeza: -14 } }, ...gestos(l(281.1), L, [{ hD: 150, cD: 0, hI: 55, cI: 15, cabeza: -18 }, { hD: 140, cD: 6, hI: 65, cI: 25, cabeza: -12 }], 8)]} caras={[{ f: 0, v: "neutral" }, { f: l(280.2), v: "sorpresa" }, { f: l(281.0), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.7, y: -0.5 } }, { f: l(280.8), v: { x: 0.4, y: -0.9 } }]} ajuste={(p, g) => ({ ...p, bajar: p.bajar - 26 * ap(g, l(280.8), 8) })} />}
      hud={<>
        <Rotulo texto="MID-AUGUST" x={1240} y={130} centro desde={l(279.8)} color="#f6ecd2" tam={72} />
        {/* misma curva que el HUD (Lc04 DIA: 312 → 320 out-cubic de T(279.5) a T(281.2)) → mismo número en el mismo cuadro */}
        <Dato x={1240} y={270} rotulo="DAY" de={312} a={320} v={312 + 8 * ease(f, l(279.5), l(281.2))} desde={l(279.4)} color="#7cd36a" tam={100} vivo={false} />
      </>} />
  );
};

// ---------- E62 · 281:9-286:3 · el maíz más alto que Theo (se pone en puntas, regla de altura); los zapallos trepan el alambre ----------
const R17: React.FC = () => {
  const f = useF();
  const l = loc(281.9);
  const reg = ap(f, l(282.5), 14);
  const tip = (g: number) => (f > l(282.4) && f < l(284.3) ? Math.max(0, Math.sin(((g - l(282.4)) / 22) * Math.PI)) : 0);
  const vid = ap(f, l(284.5), 50);
  return (
    <Escena Set={Granja} pal={PAL} seed={106} setProps={{ hora: "dia", estacion: "verano", crec: 1 }}
      claves={conBarrido([[0, 4600, 742, 1.92], [l(283.2), 4618, 732, 2.02], [l(284.15), 4632, 728, 2.06]], [[l(284.5), 3225, 736, 1.86], [l(285.4), 3240, 734, 1.92], [l(286.3) + 10, 3262, 730, 2.0]])}
      medio={<>
        <g opacity={reg}>
          <rect x={4585} y={Y - 430} width={14} height={430} fill="#efe6d2" stroke="#6a5240" strokeWidth={3} />
          {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={4585} y={Y - 52 * (i + 1)} width={i % 2 ? 22 : 34} height={4} fill="#6a5240" />)}
          <path d={`M4570,${Y - 190} L5150,${Y - 190}`} stroke="#7cd36a" strokeWidth={4} strokeDasharray="14 10" />
          <text x={4545} y={Y - 182} textAnchor="end" fontFamily="sans-serif" fontWeight={700} fontSize={36} fill="#f6ecd2" stroke="#1c1416" strokeWidth={7} paintOrder="stroke">THEO</text>
          <path d={`M4560,${Y - 400} L5150,${Y - 400}`} stroke="#ffcf6e" strokeWidth={4} strokeDasharray="14 10" />
          <text x={4545} y={Y - 392} textAnchor="end" fontFamily="sans-serif" fontWeight={700} fontSize={36} fill="#ffcf6e" stroke="#1c1416" strokeWidth={7} paintOrder="stroke">CORN</text>
        </g>
        <A look={THEO} ruta={[{ f: 0, x: 4650, y: Y }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "manosCintura" }, { f: l(282.3), v: { hD: 100, cD: 10 } }, ...gestos(l(282.5), l(284.3), [{ hD: 160, cD: 4, cabeza: -16 }, { hD: 150, cD: 10, cabeza: -20 }], 11)]}
          caras={[{ f: 0, v: "sorpresa" }, { f: l(283.4), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.5, y: -0.8 } }]} ajuste={(p, g) => ({ ...p, bajar: p.bajar - 18 * tip(g) })} />
        <A look={ROSA} escala={1.2} ruta={[{ f: 0, x: 3460, y: P + 30 }, { f: l(284.45), x: 3460, y: P + 30 }, { f: l(285.3), x: 3400, y: P + 30 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "parado" }, ...gestos(l(284.3), l(286.3) + 12, ["agarrarAlto", "tirarCarga", { hD: 120, cD: 20 }, { hD: 100, cD: 40, tronco: 6 }], 12)]} caras={[{ f: 0, v: "neutral" }, { f: l(285.0), v: "feliz" }]} />
        {vid > 0 && <g>
          <path d={`M2960,${P - 40} Q3100,${P - 150 - 30 * vid} ${2960 + 520 * vid},${P - 110}`} stroke="#5a9a3c" strokeWidth={12} fill="none" strokeLinecap="round" />
          {[0, 1, 2].map((i) => { const k = ap(f, l(284.9) + i * 12, 14); return <g key={i} transform={`translate(${3140 + i * 130},${P - 62}) scale(${k})`}><ellipse rx={44} ry={34} fill="#e8a040" /><path d="M-20,-26 Q0,-36 20,-26 M0,-34 L0,28 M-26,-18 Q-12,0 -26,18 M26,-18 Q12,0 26,18" stroke="#b87020" strokeWidth={3} fill="none" /><rect x={-4} y={-46} width={8} height={14} fill="#5a7a30" /></g>; })}
        </g>}
      </>}
      hud={<>
        <Cartel texto="TALLER THAN THEO" x={1280} y={36} desde={l(282.8)} hasta={l(284.3)} color="#ffcf6e" tam={66} />
        <Cartel texto="SQUASH ON THE WIRE" x={1240} y={90} desde={l(284.8)} color="#e8a040" tam={70} />
      </>} />
  );
};

// ---------- E63 · 286:3-292:9 · Marcus clava la horquilla, tira de la planta (agacharse-levantar) y caen ocho papas: 1..8 ----------
const R18: React.FC = () => {
  const f = useF();
  const l = loc(286.3);
  const n = Math.min(8, Math.floor(interpolate(f, [l(291.0), l(292.4)], [0, 8], cl)));
  const arriba = f > l(289.0);
  return (
    <Escena Set={Granja} pal={PAL} seed={107} setProps={{ hora: "ocaso", estacion: "verano", crec: 1 }}
      claves={camino([[0, 2950, 692, 1.45], [l(287.8), 3060, 682, 1.54], [l(290.8), 3090, 680, 1.6], [l(292.9) + 10, 3110, 702, 1.8]])}
      medio={<>
        {Array.from({ length: 8 }).map((_, i) => {
          const f0 = l(291.0) + i * 5;
          if (f < f0) return null;
          const u = Math.min(1, (f - f0) / 12);
          // «big as fists»: papas grandes (1.35) que caen a una pila al frente, donde la cámara termina de empujar
          const gx = 3175 + (i % 4) * 58 + (Math.floor(i / 4) ? 29 : 0), gy = Y - 26 - Math.floor(i / 4) * 38;
          return <Papa key={i} x={3080 + (gx - 3080) * u} y={Y - 330 + (gy - (Y - 330)) * u * u + (u >= 1 ? -Math.abs(Math.sin((f - f0 - 12) / 3)) * 16 * Math.exp(-(f - f0 - 12) / 5) : 0)} s={1.35} rot={u * 300 + i * 40} />;
        })}
        <A look={MARCUS} escala={1.35} ruta={[{ f: 0, x: 2830, y: Y }, { f: l(287.8), x: 2990, y: Y }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: "parado" }, { f: l(287.8), v: "agacharse" }, ...gestos(l(287.9), l(289.0), [{ tronco: 8, hD: 120, cD: 10, hI: 100, cI: 10 }, "agacharse"], 9), { f: l(289.0), v: { hD: 40, cD: 18, hI: 104, cI: 10, cabeza: -6 } }, ...gestos(l(289.4), l(292.9) + 12, [{ hD: 62, cD: 10, hI: 106, cI: 8, cabeza: -8 }, { hD: 56, cD: 18, hI: 100, cI: 14, cabeza: 2 }], 14)]}
          caras={[{ f: 0, v: "determinado" }, { f: l(289.4), v: "sorpresa" }, { f: l(291.5), v: "risa" }]} miradas={[{ f: 0, v: { x: 0.6, y: 0.4 } }, { f: l(289.0), v: { x: 0.3, y: -0.8 } }]}
          enManoD={<HorquillaPapas papas={arriba ? Math.max(0, 8 - n) : 0} />} />
      </>}
      hud={<Dato x={1450} y={150} rotulo="POTATOES FROM ONE PLANT" de={0} a={8} v={n} total="/ 8" desde={l(290.8)} color="#ffcf6e" tam={120} />} />
  );
};

// ---------- E64 · 292:9-298:0 · la primera sonrisa del verano: Marcus entero al centro, papas en brazos, lluvia de hojas ----------
const R19: React.FC = () => {
  const f = useF();
  const l = loc(292.9);
  const L = l(298.0);
  return (
    <Escena Set={Granja} pal={PAL} seed={108} setProps={{ hora: "ocaso", estacion: "verano", crec: 1 }} claves={[mira(0, 3500, 740, 1.3), mira(l(294.2), 3510, 720, 1.45, { curva: "inout" }), mira(L, 3510, 660, 1.9, { curva: "inout" })]}
      medio={<>
        <A look={MARCUS} escala={1.35} ruta={[{ f: 0, x: 3500, y: Y }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "neutral" }, { f: l(293.6), v: "risa" }]} poses={[{ f: 0, v: { hD: 55, cD: 95, hI: 55, cI: 95 } }, ...gestos(l(293.4), L, [{ hD: 55, cD: 95, hI: 55, cI: 95, tronco: -3, cabeza: -4 }, { hD: 62, cD: 88, hI: 60, cI: 90, tronco: 2, cabeza: 4 }], 14)]}
          enManoD={<g>{[[-30, -10], [0, -16], [30, -8], [-16, -40], [16, -42], [-40, -32], [40, -34], [0, -66]].map(([x, y], i) => <Papa key={i} x={x} y={y} s={0.75} rot={i * 47} />)}</g>} />
      </>}
      frente={<Hojitas x0={3100} x1={3900} y0={P - 700} y1={P + 120} n={26} f={f} vel={80} tam={1.1} />}
      hud={<>
        <Rotulo texto="THEY'RE GOING TO MAKE IT" x={960} y={930} centro desde={l(296.0)} color="#7cd36a" tam={104} />
        {/* la cuenta del guion, sin aritmética falsa: 8 papas por planta (lo que ve) → un acre ≈ 7 millones (la cuenta de la puerta) */}
        <Cartel texto="8 POTATOES / PLANT" x={1400} y={40} desde={l(293.4)} color="#ffcf6e" tam={56} />
        <Cartel texto="1 ACRE ≈ 7,000,000 KCAL" x={1400} y={130} desde={l(294.8)} color="#7cd36a" tam={56} />
      </>} />
  );
};

// ---------- E65 · 298:0-301:6 · casi siete millones, en la tierra: uno por uno alzan SU papa a la altura del hombro (resorte) ----------
// v4: fila abierta (158 entre pies → ~185 px entre cabezas), papas al costado de la cabeza (nunca delante de la cara), cámara que
// recorre la fila; sin barra grande (el HUD ya lleva KCAL): arriba lo que se dice, abajo IN THE GROUND sobre las papas enterradas.
const R20: React.FC = () => {
  const l = loc(298.0);
  const L = l(301.6);
  const f = useF();
  return (
    <Escena Set={Granja} pal={PAL} seed={109} setProps={{ hora: "ocaso", estacion: "verano", crec: 1, corte: 1, papas: 1 }}
      claves={camino([[0, 3880, 566, 1.16], [l(299.8), 3925, 568, 1.19], [L + 10, 3975, 572, 1.23]])}
      medio={<>{LOS10.map((look, i) => {
        const t0 = l(298.2) + i * 5;
        const alza = { hD: 128, cD: 62, cabeza: -6 }, alza2 = { hD: 136, cD: 50, cabeza: -2, tronco: -2 };
        return <A key={i} look={look} escala={i >= 8 ? NINO : 1} seed={i * 3} ruta={[{ f: 0, x: 3230 + i * 158, y: P - 40 }]} dir={[{ f: 0, v: 1 }]}
          caras={[{ f: 0, v: "neutral" }, { f: t0, v: "feliz" }, { f: t0 + 12, v: "risa" }]}
          poses={[{ f: 0, v: "parado" }, { f: t0, v: alza }, ...gestos(t0 + 14, L + 14, [alza2, alza], 16)]}
          enManoD={f > t0 + 2 ? <Papa x={0} y={-14} s={1.1 * Math.min(1, (f - t0 - 2) / 6)} rot={i * 20} /> : undefined} />;
      })}</>}
      hud={<>
        <Cartel texto="CLOSE TO 7 MILLION CALORIES" x={1280} y={60} desde={l(298.3)} color="#ffcf6e" tam={58} />
        <Rotulo texto="IN THE GROUND. READY." x={960} y={950} centro desde={l(299.8)} color="#ffcf6e" tam={76} />
      </>} />
  );
};

// ---------- E66 · 301:6-305:2 · 29 de agosto: noche despejada, estrellas, luna, perro que ladra; Marcus en el porche mira el cielo ----------
const R21: React.FC = () => {
  const f = useF();
  const l = loc(301.6);
  const L = l(305.2);
  const min = interpolate(f, [0, L], [22 * 60, 24 * 60 + 5], cl);
  return (
    <Escena Set={Granja} pal={PAL} seed={110} setProps={{ hora: "noche", estacion: "verano", crec: 1, humo: 0.2 }} claves={[mira(0, 540, 540, 1.6), mira(L, 560, 550, 1.72)]}
      detras={<>
        <Estrellitas f={f} n={34} x0={-100} x1={2500} y0={-20} y1={380} tam={1.3} />
        
      </>}
      medio={<>
        <A look={MARCUS} escala={1.45} ruta={[{ f: 0, x: 380, y: P - 40 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "manosCintura" }, ...gestos(l(302.2), L, [{ hD: 140, cD: 40 }, "brazosCruzados", { hD: 120, cD: 120, hI: 120, cI: 120, tronco: 5 }, "brazosCruzados"], 14)]} caras={[{ f: 0, v: "neutral" }, { f: l(302.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.4, y: -0.9 } }]} />
        <Ore x={560} y={P - 40} s={0.9} dir={-1} f={f} sentado={1} cola={1} ladra={Math.max(0, Math.sin(f / 4.5)) * (f > l(302.4) ? 1 : 0)} />
      </>}
      hud={<>
        <RelojDia min={min} x={1560} y={60} desde={l(301.8)} />
        <Rotulo texto="AUGUST 29" x={1240} y={210} centro desde={l(301.9)} color="#f6ecd2" tam={84} />
        <Rotulo texto="CLEAR · NO WIND" x={1240} y={320} centro desde={l(302.8)} color="#9bd8ff" tam={60} />
      </>} />
  );
};

// ---------- E67 · 305:2-309:5 · el aire frío baja por la loma en flechas y niebla y llena el campo; Theo tirita; termómetro creciendo ----------
const R22: React.FC = () => {
  const f = useF();
  const l = loc(305.2);
  const L = l(309.5);
  const k = interpolate(f, [l(305.6), l(309.4)], [0, 1], cl);
  const t = interpolate(f, [0, L], [52, 34], cl);
  const s = 1.0 + 0.5 * k;
  return (
    <Escena Set={Granja} pal={PAL} seed={111} setProps={{ hora: "noche", estacion: "verano", crec: 1 }} claves={[mira(0, 3150, 760, 1.6), mira(L, 3420, 810, 2.05, { curva: "inout" })]}
      medio={<>
        <FlechasFrio f={f} k={ap(f, l(305.5), 20)} piso={P} />
        <A look={THEO} ruta={[{ f: 0, x: 3420, y: Y }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "encogerse" }, { f: l(306.6), v: "brazosCruzados" }]} caras={[{ f: 0, v: "neutral" }, { f: l(307.0), v: "miedo" }]}
          ajuste={(p, g) => ({ ...p, tronco: p.tronco + Math.sin(g * 2.4) * 2.5, cabeza: p.cabeza + Math.sin(g * 3.1) * 3, hI: p.hI + Math.sin(g * 2.7) * 4 })} />
        {[0, 1, 2].map((i) => { const u = ((f / 30 + i / 3) % 1); return <circle key={i} cx={3350 - u * 40} cy={Y - 150 - u * 34} r={6 + u * 12} fill="#e8f4ff" opacity={0.7 * (1 - u)} />; })}
      </>}
      hud={<>
        <Rotulo texto="COLD AIR SLIDES DOWN" x={1240} y={130} centro desde={l(306.0)} color="#c8ecff" tam={72} />
        <Pip><Termometro x={1730} y={940} temp={t} s={s} marca={[30, 34]} /></Pip>
        <Cartel texto="COLD AIR → LOW FIELDS" x={1180} y={905} desde={l(307.6)} color="#9bd8ff" tam={56} />
      </>} />
  );
};

// ---------- E68 · 309:5-313:8 · el termómetro del porche (31 °F a las 3 AM) tiembla; Marcus mira por la ventana, la escarcha avanza en el vidrio ----------
const R23: React.FC = () => {
  const f = useF();
  const l = loc(309.5);
  const L = l(313.8);
  const t = interpolate(f, [l(309.8), l(312.4)], [35, 31], cl);
  const fr = ap(f, l(310.4), 70);
  const tem = (t <= 36 ? Math.sin(f * 2.1) * 3 : 0);
  return (
    <Escena Set={Granja} pal={PAL} seed={112} setProps={{ hora: "noche", estacion: "verano", crec: 1, temp: t }} claves={camino([[0, 330, 640, 1.72], [l(311.0), 370, 645, 1.82], [L + 10, 400, 652, 1.94]])}
      medio={<A look={MARCUS} escala={1.25} ruta={[{ f: 0, x: 215, y: P - 40 }, { f: l(310.8), x: 320, y: P - 40 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "brazosCruzados" }, { f: l(310.9), v: { hD: 75, cD: 30, tronco: 8, cabeza: 10 } }, ...gestos(l(311.4), L + 12, [{ hD: 78, cD: 24, tronco: 10, cabeza: 12 }, { hD: 70, cD: 70, hI: 70, cI: 70, tronco: 6 }, "brazosCruzados", { hD: 60, cD: 90, hI: 60, cI: 90, tronco: 4 }], 16)]} caras={[{ f: 0, v: "cansado" }, { f: l(311.2), v: "sorpresa" }, { f: l(312.3), v: "miedo" }]} miradas={[{ f: 0, v: { x: 0.9, y: 0.1 } }, { f: l(310.9), v: { x: 0.8, y: 0.5 } }]}
        ajuste={(p, g) => ({ ...p, tronco: p.tronco + Math.sin(g * 1.9) * 1.6 * ap(g, l(312.2), 10) })} />}
      hud={<>
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${tem}px,${Math.cos(f * 2.7) * 2 * (tem ? 1 : 0)}px)` }}>
          <Rotulo texto={`${Math.round(t)} °F`} x={1080} y={400} desde={l(310.2)} color={t <= 32 ? "#9bd8ff" : "#f6ecd2"} tam={120} />
        </div>
        {/* «by three in the morning»: el reloj grande junto al 31 °F */}
        <Cartel texto="3:00 AM" x={1250} y={560} desde={l(309.7)} color="#f6ecd2" tam={56} />
        <Pip>
          <rect x={1470} y={330} width={360} height={470} rx={12} fill="#2a1c14" stroke="#efe6d2" strokeWidth={14} />
          <rect x={1484} y={344} width={332} height={442} fill="#3a2410" />
          <Halo x={1650} y={600} r={260} color="#ffcf6e" fuerza={0.55} />
          <rect x={1642} y={330} width={16} height={470} fill="#efe6d2" /><rect x={1470} y={558} width={360} height={14} fill="#efe6d2" />
          <circle cx={1650 + 30} cy={520} r={30 + 18 * Math.max(0, Math.sin(f / 18))} fill="#fff" opacity={0.12} />
          {[[1484, 344, 0], [1816, 344, 90], [1484, 786, -90], [1816, 786, 180]].map(([cx, cy, r], i) => <Cristal key={i} x={cx as number} y={cy as number} s={fr * (1.5 - (i % 2) * 0.25)} rot={r as number} o={fr} />)}
          {Array.from({ length: 14 }).map((_, i) => <Cristal key={`c${i}`} x={1490 + random(`cx${i}`) * 320} y={350 + random(`cy${i}`) * 430} s={Math.max(0, fr * 1.6 - random(`cs${i}`) * 1.1) * 0.5} rot={random(`cr${i}`) * 90} o={0.9} />)}
        </Pip>
      </>} />
  );
};

// ---------- E69 · 313:8-314:7 · «Frost.»: destello blanco y cristales que avanzan de izquierda a derecha cubriendo las plantas ----------
const R24: React.FC = () => {
  const f = useF();
  const l = loc(313.8);
  const k = interpolate(f, [0, l(314.7)], [0.05, 1], cl);
  const frente = 2800 + 2600 * k;
  return (
    <Escena Set={Granja} pal={PAL} seed={113} setProps={{ hora: "noche", estacion: "verano", crec: 1, helada: k }} claves={[mira(0, 3700, 660, 0.9), mira(l(314.7), 3900, 660, 1.05)]}
      medio={<>
        <Helada4 x0={2800} piso={P + 40} f={f} k={k} />
        {Array.from({ length: 18 }).map((_, i) => { const x = 2850 + i * 150; return x < frente ? <Cristal key={i} x={x} y={P - 20 + (i % 3) * 30} s={Math.min(1.6, (frente - x) / 200) * (1 + (i % 3) * 0.25)} rot={i * 25} o={0.95} /> : null; })}
      </>}
      hud={<>
        <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(0, 0.85 - f / 8) }} />
        {/* la ventana de la casa: la silueta de Marcus ve la helada y RETROCEDE un paso */}
        <Pip>{(() => { const k = ap(f, 3, 22); const sx = 1640 + 50 * k, sy = 450 + 40 * k, sc = 1.05 - 0.33 * k; return <g>
          <rect x={1470} y={320} width={360} height={450} rx={12} fill="#2a1c14" stroke="#efe6d2" strokeWidth={14} />
          <rect x={1484} y={334} width={332} height={422} fill="#ffcf6e" opacity={0.85} />
          <Halo x={1650} y={540} r={240} color="#ffcf6e" fuerza={0.5} />
          <clipPath id="vtn69"><rect x={1484} y={334} width={332} height={422} /></clipPath>
          <g clipPath="url(#vtn69)"><g transform={`translate(${sx},${sy}) scale(${sc})`} fill="#1c120e">
            <ellipse cx={0} cy={-118} rx={78} ry={14} /><path d="M-40,-118 Q-38,-170 0,-172 Q38,-170 40,-118 Z" />
            <circle cx={0} cy={-88} r={38} />
            <path d="M-26,-56 L26,-56 Q86,-44 96,40 L104,300 L-104,300 L-96,40 Q-86,-44 -26,-56 Z" />
            <path d={`M-70,0 Q-60,${60 - 40 * k} -20,${70 - 50 * k}`} stroke="#1c120e" strokeWidth={26} strokeLinecap="round" fill="none" />
          </g></g>
          <rect x={1642} y={320} width={16} height={450} fill="#efe6d2" /><rect x={1470} y={538} width={360} height={14} fill="#efe6d2" />
          {[[1484, 334, 0], [1816, 334, 90], [1484, 756, -90], [1816, 756, 180]].map(([cx, cy, r], i) => <Cristal key={i} x={cx} y={cy} s={1.2 + 0.4 * k} rot={r} o={0.95} />)}
        </g>; })()}</Pip>
        <Rotulo texto="FROST." x={900} y={380} centro desde={0} color="#e8f6ff" tam={160} />
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${Math.sin(f * 2.3) * 4}px,${Math.cos(f * 2.9) * 3}px)` }}><Dato x={1560} y={160} rotulo="PORCH" de={31} a={31} sufijo=" °F" desde={2} color="#9bd8ff" tam={80} /></div>
      </>} />
  );
};

// ---------- E70-E72 · 314:7-321:4 · a la mañana: porotos negros, tomates papilla, zapallos caídos (con quien lo sufre) ----------
const Planta3: React.FC<{ s0: number; s1: number; tipo: "poroto" | "tomate" | "zapallo"; txt: string }> = ({ s0, s1, tipo, txt }) => {
  const f = useF();
  const l = loc(s0);
  const L = l(s1);
  const h = 0.4 + 0.6 * ap(f, l(s0 + 0.3), 40);
  const d0 = tipo === "poroto" ? 0 : tipo === "tomate" ? 20 : 35, d1 = tipo === "poroto" ? 20 : tipo === "tomate" ? 35 : 50;
  return (
    <Escena Set={Primer} pal={PAL} seed={Math.round(s0)} setProps={{ fondo: "cielo", luz: "#ffd8a0" }} claves={[mira(0, 960, 600, 1.0), mira(L, 960, 600, 1.08)]}
      medio={<>
        <PlantaCerca tipo={tipo} x={tipo === "tomate" ? 1180 : 960} y={tipo === "tomate" ? 740 : 900} s={tipo === "tomate" ? 1.15 : 1.3} helada={h} f={f} />
        {tipo === "poroto" && <>
          <Hojitas x0={760} x1={1180} y0={500} y1={960} n={9} f={f} vel={60} colores={["#2a2a22", "#1d2018"]} tam={1.7} />
          <A look={LILY} escala={NINO * 3.1} ruta={[{ f: 0, x: 640, y: 1050 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "parado" }, { f: l(s0 + 0.3), v: { hD: 85, cD: 12 } }, ...gestos(l(s0 + 0.6), L, [{ hD: 95, cD: 8 }, { hD: 80, cD: 18 }, { hD: 150, cD: 80 }], 12)]} caras={[{ f: 0, v: "sorpresa" }, { f: l(s0 + 1.0), v: "triste" }]} miradas={[{ f: 0, v: { x: 0.8, y: -0.2 } }]} />
        </>}
        {tipo === "tomate" && <>
          {[0, 1, 2, 3].map((i) => { const f0 = l(s0 + 0.5) + i * 9; const u = Math.min(1, Math.max(0, (f - f0) / 14)); return f > f0 ? <g key={i}><ellipse cx={1270 + i * 62 + u * 36} cy={500 + u * u * 250} rx={30} ry={28 * (1 - 0.4 * u)} fill="#d8382c" />{u >= 1 && <ellipse cx={1306 + i * 62} cy={750} rx={Math.min(70, (f - f0 - 14) * 7)} ry={12} fill="#a82a20" opacity={0.8} />}</g> : null; })}
          <A look={ROSA} escala={2.15} ruta={[{ f: 0, x: 840, y: 1040 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "parado" }, { f: l(s0 + 0.3), v: "manosCara" }, ...gestos(l(s0 + 0.9), L, ["manosCara", { hD: 45, cD: 140, hI: 40, cI: 140, tronco: 12, cabeza: 10 }], 14)]} caras={[{ f: 0, v: "sorpresa" }, { f: l(s0 + 0.5), v: "miedo" }]} />
        </>}
        {tipo === "zapallo" && <A look={GUS} escala={1.8} ruta={[{ f: 0, x: 620, y: 1050 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "parado" }, { f: l(s0 + 0.3), v: "agacharse" }, { f: l(s0 + 0.9), v: { hD: 100, cD: 25, tronco: 14 } }, ...gestos(l(s0 + 1.3), L, [{ hD: 130, cD: 25, tronco: 6 }, { hD: 85, cD: 40, tronco: 12, cabeza: 10 }], 14)]} caras={[{ f: 0, v: "duda" }, { f: l(s0 + 0.5), v: "asco" }]}
          enManoD={f > l(s0 + 0.35) ? <g><path d="M0,-6 Q30,10 46,60 Q20,52 6,70 Q-6,40 -30,58 Q-22,20 0,-6 Z" fill="#3a4a26" stroke="#1d2614" strokeWidth={4} /><path d="M0,-6 L10,58" stroke="#1d2614" strokeWidth={3} /></g> : undefined} />}
      </>}
      hud={<>
        <Rotulo texto={txt} x={1240} y={130} centro desde={l(s0 + 0.2)} color="#e8f6ff" tam={72} />
        <Dato x={1580} y={320} rotulo="GARDEN LOST" de={d0} a={d1} sufijo="%" desde={l(s0 + 0.4)} fin={l(s1 - 0.2)} color="#e23a2e" tam={86} />
      </>} />
  );
};

// ---------- E73 · 321:4-325:1 · medio jardín perdido en una noche: los 10 caen uno tras otro; Theo se deja caer sobre un cajón ----------
// v4: fila abierta (150 entre pies → ~195 px entre cabezas, reacciones con el torso); Theo SENTADO sobre un cajón dibujado
// (asiento real, nada de silla invisible), codos en las rodillas frente a la planta helada.
const R26: React.FC = () => {
  const l = loc(321.4);
  const L = l(325.1);
  const triste = { tronco: 10, cabeza: 22, hI: 4, cI: 10, hD: 4, cD: 10 };
  const triste2 = { tronco: 6, cabeza: 16, hI: 8, cI: 14, hD: 8, cD: 14 };
  const sent = { tronco: 6, pI: 88, rI: 88, pD: 92, rD: 92, hI: 35, cI: 55, hD: 40, cD: 60, cabeza: 4 };
  const sentCae = { tronco: 22, pI: 84, rI: 92, pD: 88, rD: 96, hI: 62, cI: 118, hD: 66, cD: 122, cabeza: 26 };
  const sentCae2 = { tronco: 18, pI: 84, rI: 92, pD: 88, rD: 96, hI: 58, cI: 112, hD: 62, cD: 116, cabeza: 18 };
  const TX = 2850;
  return (
    <Escena Set={Granja} pal={PAL} seed={114} setProps={{ hora: "alba", estacion: "verano", crec: 1, helada: 1 }} claves={camino([[0, 3350, 640, 1.26], [l(323.2), 3370, 645, 1.3], [L + 10, 3392, 652, 1.36]])}
      medio={<>
        <PlantaSeca x={TX + 105} y={Y + 8} s={0.9} k={1} f={0} />
        {/* cajón dado vuelta donde se sienta Theo */}
        <g><rect x={TX - 52} y={Y - 64} width={104} height={64} rx={4} fill="#a07a4a" stroke="#5a3e22" strokeWidth={5} /><rect x={TX - 52} y={Y - 40} width={104} height={7} fill="#7a5a36" /><rect x={TX - 52} y={Y - 18} width={104} height={7} fill="#7a5a36" /></g>
        {LOS10.map((look, i) => {
          const t0 = l(321.8) + i * 7;
          if (i === 1) return <A key={i} look={look} seed={i * 3} ruta={[{ f: 0, x: TX, y: Y }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 64 }]} caras={[{ f: 0, v: "triste" }, { f: l(323.4), v: "cansado" }]} miradas={[{ f: 0, v: { x: 0.6, y: 0.7 } }]}
            poses={[{ f: 0, v: sent }, { f: t0, v: { ...sent, tronco: 12, cabeza: 14 } }, { f: l(323.0), v: sentCae }, ...gestos(l(323.5), L + 14, [sentCae2, sentCae], 18)]} />;
          return <A key={i} look={look} escala={i >= 8 ? NINO : 1} seed={i * 3} ruta={[{ f: 0, x: 2700 + i * 150, y: Y }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "neutral" }, { f: t0, v: "triste" }, { f: t0 + 40, v: i % 2 ? "cansado" : "miedo" }]}
            poses={[{ f: 0, v: "parado" }, { f: t0, v: i % 3 === 0 ? "encogerse" : i % 3 === 1 ? "manosCara" : triste }, ...gestos(t0 + 20, L + 14, i % 3 === 2 ? [triste2, triste] : [i % 3 === 0 ? "encogerse" : "manosCara", i % 3 === 0 ? { hI: 46, cI: 112, hD: 50, cD: 110, cabeza: 16, tronco: 12, rI: 10, rD: 10, bajar: 8 } : { hI: 36, cI: 146, hD: 42, cD: 146, cabeza: 12, tronco: 10 }], 20)]} />;
        })}
      </>}
      hud={<>
        <Rotulo texto="TWO WEEKS EARLY" x={1240} y={130} centro desde={l(322.4)} color="#e23a2e" tam={80} />
        <Barra x={960} y={960} w={760} rotulo="GARDEN ALIVE" de={1} a={0.5} desde={l(321.8)} fin={l(324.0)} color="#e23a2e" />
      </>} />
  );
};

// ---------- E74 · 325:1-334:8 · tilt abajo: las papas, intactas bajo tierra; brillan una a una; una mano saca una sana ----------
const R27: React.FC = () => {
  const f = useF();
  const l = loc(325.1);
  const brilla = (i: number) => { const f0 = l(330.0) + i * 12; return Math.max(0, Math.sin(Math.min(1, Math.max(0, (f - f0) / 30)) * Math.PI)); };
  const mano = ap(f, l(331.0), 50);
  return (
    <Escena Set={Granja} pal={PAL} seed={115} setProps={{ hora: "dia", estacion: "verano", crec: 1, helada: 1, corte: ap(f, l(325.3), 24), papas: 1 }}
      claves={camino([[0, 3870, 650, 1.55], [l(326.6), 3830, 760, 1.32], [l(330.0), 3810, 770, 1.26], [l(334.8) + 10, 3830, 742, 1.36]])}
      medio={<>
        {f > l(329.5) && [0, 1, 2, 3, 4, 5].map((i) => <Destello key={i} x={3560 + i * 120} y={P + 70} k={brilla(i)} r={52} />)}
        {f > l(331.0) && f < l(332.6) && <Papa x={3990} y={P + 70 - 60 * ap(f, l(331.4), 30)} s={1.1} rot={f * 3} />}
        {/* v4: Theo a la derecha (x 3900): la cabeza queda siempre en x>700 de pantalla, lejos del HUD */}
        <A look={THEO} escala={1.7} ruta={[{ f: 0, x: 3900, y: P + 4 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "triste" }, { f: l(329.4), v: "sorpresa" }, { f: l(332.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.5, y: 0.8 } }, { f: l(332.6), v: { x: 0.6, y: -0.3 } }]}
          poses={[{ f: 0, v: { tronco: 14, pI: 0, rI: 90, pD: 90, rD: 90, hD: 30, cD: 30, cabeza: 12 } }, ...gestos(2, l(326.0), [{ tronco: 18, pI: 0, rI: 90, pD: 90, rD: 90, hD: 36, cD: 20, cabeza: 18 }, { tronco: 12, pI: 0, rI: 90, pD: 90, rD: 90, hD: 28, cD: 34, cabeza: 10 }], 12), { f: l(326.0), v: { tronco: 24, pI: 0, rI: 90, pD: 90, rD: 90, hD: 40, cD: 10, cabeza: 14 } }, ...gestos(l(327.2), l(331.2), [{ tronco: 28, pI: 0, rI: 90, pD: 90, rD: 90, hD: 30, cD: 6, cabeza: 16 }, { tronco: 24, pI: 0, rI: 90, pD: 90, rD: 90, hD: 45, cD: 14, cabeza: 10 }], 18), { f: l(331.6), v: { tronco: 20, pI: 0, rI: 90, pD: 90, rD: 90, hD: 20, cD: 4, cabeza: 18 } }, { f: l(332.6), v: { tronco: 0, pI: 0, rI: 90, pD: 90, rD: 90, hD: 150, cD: 20, cabeza: -6 } }, ...gestos(l(333.2), l(334.8) + 12, [{ tronco: 0, pI: 0, rI: 90, pD: 90, rD: 90, hD: 155, cD: 15, cabeza: -6 }, { tronco: -3, pI: 0, rI: 90, pD: 90, rD: 90, hD: 145, cD: 30, cabeza: -10 }], 14)]}
          enManoD={(fr: number) => (fr > l(332.6) ? <Papa x={0} y={-10} s={1.0} rot={20} /> : null)} />
      </>}
      hud={<>
        <Rotulo texto="THE POTATOES ARE FINE" x={960} y={900} centro desde={l(329.0)} color="#f6ecd2" tam={76} />
        <Rotulo texto="HIDDEN IN THE DIRT" x={1300} y={110} centro desde={l(331.0)} color="#ffcf6e" tam={76} />
        <Dato x={1560} y={300} rotulo="LOST UNDERGROUND" de={0} a={0} desde={l(329.4)} color="#7cd36a" tam={70} total="LB" />
      </>} />
  );
};

// ---------- E75 · 334:8-339:9 · los diez cavan nueve días seguidos; tachas de DAY 334 → 343 ----------
// v4: ciclo de cavar CONTINUO hasta el último cuadro (resorte entre poses cada 14 cuadros, desfasado por persona: nunca se
// congela), arranca en plano medio (no en el abierto), palas inclinadas hacia adelante (el mango no cruza la cara) y fila a 165.
const R28: React.FC = () => {
  const f = useF();
  const l = loc(334.8);
  const L = l(339.9);
  const u = interpolate(f, [l(335.0), l(339.6)], [0, 9], cl);
  const cesta = (i: number) => Math.abs(Math.sin((f + i * 14) / 24));
  const X0 = 2960, D = 165;
  const clava = { tronco: 30, pI: 66, rI: 108, pD: 78, rD: 112, hD: 44, cD: 18, hI: 36, cI: 24, cabeza: -14 };
  const saca = { tronco: 6, pI: 10, rI: 20, pD: 16, rD: 24, hD: 62, cD: 36, hI: 50, cI: 30, cabeza: -6 };
  return (
    <Escena Set={Granja} pal={PAL} seed={116} setProps={{ hora: "dia", estacion: "verano", crec: 1, helada: 1 }}
      claves={camino([[0, 3560, 702, 1.45], [l(336.4), 3700, 706, 1.52], [l(337.4), 3420, 714, 1.84], [L + 10, 3470, 716, 1.98]])}
      detras={u < 9 ? <SolCruza u={u} x0={2720} x1={4720} y={480} /> : undefined}
      medio={<>
        {LOS10.map((look, i) => <A key={i} look={look} escala={i >= 8 ? NINO : 1} seed={i * 3} ruta={[{ f: 0, x: X0 + i * D, y: Y }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "cansado" }, { f: l(337.6) + i * 3, v: i % 2 ? "determinado" : "cansado" }]}
          poses={i < 8 ? [{ f: 0, v: i % 2 ? saca : clava }, ...gestos(1 + (i % 4) * 4, L + 16, i % 2 ? [clava, saca] : [saca, clava], 14)] : [{ f: 0, v: "parado" }, ...gestos(2 + i * 5, L + 16, [{ hD: 70, cD: 40, tronco: 6 }, { hD: 90, cD: 30, tronco: -2 }], 16)]}
          enManoD={i < 8 ? <g transform="rotate(32)"><Pala tierra /></g> : <Canasta s={0.5} papas={u / 9} />} />)}
        {[1, 2, 3].map((i) => <Canasta key={i} x={X0 + i * D + 82} y={Y - 14 - cesta(i) * 60} s={0.5} papas={Math.min(1, u / 6)} />)}
      </>}
      hud={<CalTachas x={1570} y={170} titulo="DAY" n={10} cols={5} k={u + 0.4} ini={334} desde={l(335.0)} tam={50} />} />
  );
};

// ---------- E76a · 339:9-342:5 · Rosa lleva el cajón a la escalera del sótano (camina, deja el cajón) ----------
const R29a: React.FC = () => {
  const f = useF();
  const l = loc(339.9);
  const L = l(342.5);
  return (
    <Escena Set={Granja} pal={PAL} seed={117} setProps={{ hora: "ocaso", estacion: "verano", crec: 1, helada: 1, sotano: 1 }}
      claves={camino([[0, 2150, 572, 1.4], [l(341.4), 2390, 584, 1.5], [L + 10, 2470, 592, 1.57]])}
      medio={<>
        <A look={ROSA} ruta={[{ f: 0, x: 1950, y: P - 30 }, { f: l(341.4), x: 2440, y: P - 30 }, { f: L, x: 2440, y: P - 30 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "cansado" }, { f: l(341.5), v: "feliz" }]} escala={1.35}
          poses={[{ f: 0, v: { hD: 22, cD: 62, hI: 18, cI: 62, tronco: -6 } }, ...gestos(6, l(341.3), [{ hD: 24, cD: 58, hI: 20, cI: 60, tronco: -8 }, { hD: 20, cD: 66, hI: 16, cI: 64, tronco: -5 }], 9), { f: l(341.4), v: "agacharse" }, { f: l(342.0), v: "manosCintura" }, { f: l(342.3), v: { hD: 150, cD: 40, tronco: -4 } }]} enManoD={f < l(341.5) ? <Canasta s={1.2} papas={1} y={40} /> : undefined} />
        {f >= l(341.5) && <Canasta x={2540} y={P - 30} s={1.2} papas={1} />}
        <Polvo x={2440} y={P - 30} f={f} f0={l(341.5)} s={1} />
      </>}
      hud={<Dato x={1500} y={250} rotulo="KCAL IN THE CELLAR" de={5400000} a={6100000} desde={l(340.2)} fin={l(342.2)} color="#ffcf6e" tam={68} />} />
  );
};

// ---------- E76b · 342:5-345:1 · corte limpio: Marcus escribe el número final con la mano ----------
const R29b: React.FC = () => {
  const f = useF();
  const l = loc(342.5);
  const L = l(345.1);
  const px = Math.min(1, Math.max(0, (f - l(343.0)) / 40));
  return (
    <Escena Set={Granja} pal={PAL} seed={117} mano={1.5}
      setProps={{ hora: "ocaso", estacion: "verano", crec: 1, helada: 1, pared: [{ t: "6,100,000", desde: l(342.7), x: PARED.x + 14, y: PARED.y + 120, tam: 50, color: "#2a1c18", vel: 5 }] }}
      claves={[mira(0, 1010, 590, 1.65), mira(L, 1010, 600, 1.75)]}
      medio={<A look={MARCUS} escala={1.25} ruta={[{ f: 0, x: 1190, y: P - 20 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 130, cD: 40 } }, ...gestos(l(343.0), L, [{ hD: 120, cD: 40, tronco: 4 }, { hD: 140, cD: 20, tronco: 6 }, { hD: 128, cD: 55 }], 7)]} caras={[{ f: 0, v: "determinado" }]} miradas={[{ f: 0, v: { x: -0.7, y: -0.2 } }]} enManoD={<Brocha />} />}
      hud={<Dato x={1520} y={110} rotulo="KCAL STORED" de={6000000} a={6100000} desde={l(343.0)} fin={l(344.6)} color="#ffcf6e" tam={68} />} />
  );
};

// ---------- E78 (R30) · 345:1-352:4 · «6,100,000» en la pared; Marcus retrocede a mirarlo, vuelve y ESCRIBE «+ CANS» y «ENOUGH» ----------
// v4: la mano con la brocha recorre cada palabra mientras se pinta (el cuerpo se corre con el borde del trazo, el brazo da
// pinceladas cortas); al terminar suelta la brocha y se cruza de brazos. Latas que caen apiladas cuando dice «canned food».
const R30: React.FC = () => {
  const f = useF();
  const l = loc(345.1);
  const L = l(352.4);
  const C0 = l(349.0), C1 = l(350.0), E0 = l(350.45), E1 = l(351.45);
  const wC = 6 * 46 * 0.62, wE = 6 * 64 * 0.62; // ancho del trazo (Pintado: n · tam · 0.62)
  const RC = 104, RE = 132; // cuerpo → punta de la brocha (escala 1.25): arriba el brazo va más vertical
  const brazo = (f0: number, f1: number, alto: boolean) => gestos(f0, f1, alto ? [{ hD: 132, cD: 6, tronco: -4 }, { hD: 126, cD: 14, tronco: -2 }] : [{ hD: 108, cD: 4, tronco: -6 }, { hD: 100, cD: 12, tronco: -3 }], 4);
  // mientras pinta, el brazo manda sobre la caminata (pinceladas cortas y rápidas)
  const pinta = (p: Pose, g: number) => {
    const enC = g >= C0 - 2 && g <= C1 + 1, enE = g >= E0 - 2 && g <= E1 + 1;
    if (!enC && !enE) return p;
    const b = Math.sin(g * 1.4);
    return { ...p, hD: (enC ? 130 : 104) + 5 * b, cD: 8 + 6 * Math.cos(g * 1.4), tronco: -4 };
  };
  return (
    <Escena Set={Granja} pal={PAL} seed={118} mano={1.5}
      setProps={{ hora: "ocaso", estacion: "verano", crec: 1, helada: 1, pared: [{ t: "6,100,000", desde: -99, x: PARED.x + 14, y: PARED.y + 120, tam: 50, color: "#2a1c18" }, { t: "+ CANS", desde: C0, x: PARED.x + 60, y: PARED.y + 228, tam: 46, vel: 5 }, { t: "ENOUGH", desde: E0, x: PARED.x + 30, y: PARED.y + 300, tam: 64, color: "#3f8a3a", vel: 5 }] }}
      claves={camino([[0, 1070, 598, 1.45], [l(347.0), 1110, 600, 1.42], [l(349.0), 1075, 600, 1.5], [l(350.5), 1060, 602, 1.53], [L + 10, 1110, 604, 1.5]])}
      medio={<>
        {Array.from({ length: 6 }).map((_, i) => { const k = ap(f, l(349.0) + i * 3, 6); return k > 0 ? <Lata key={i} x={1400 + (i % 3) * 40 + (Math.floor(i / 3) ? 20 : 0)} y={P - 22 - Math.floor(i / 3) * 44 - (1 - k) * 60} s={0.9} color={["#e0563a", "#f1c24a", "#5aa0d8"][i % 3]} /> : null; })}
        <A look={MARCUS} escala={1.25} dir={[{ f: 0, v: -1 }]}
          ruta={[{ f: 0, x: 1290, y: P - 20 }, { f: l(345.5), x: 1290, y: P - 20 }, { f: l(346.6), x: 1380, y: P - 20 }, { f: l(347.9), x: 1380, y: P - 20 }, { f: C0, x: PARED.x + 60 + RC, y: P - 20 },
            { f: C1, x: PARED.x + 60 + wC + RC, y: P - 20, curva: "lineal" }, { f: E0, x: PARED.x + 30 + RE, y: P - 20 }, { f: E1, x: PARED.x + 30 + wE + RE, y: P - 20, curva: "lineal" }, { f: l(352.1), x: PARED.x + 30 + wE + RE + 70, y: P - 20 }]}
          poses={[{ f: 0, v: { hD: 120, cD: 30 } }, { f: l(345.5), v: { hD: 40, cD: 30, tronco: -4 } }, { f: l(346.6), v: "manosCintura" }, ...gestos(l(347.0), l(347.9), [{ hD: 95, cD: 0, tronco: 3 }, { hD: 100, cD: 6, tronco: 4, cabeza: 6 }], 10),
            { f: l(348.2), v: { hD: 60, cD: 40 } }, { f: l(348.6), v: { hD: 128, cD: 10 } }, ...brazo(C0, C1, true), { f: C1 + 1, v: { hD: 110, cD: 10, tronco: 2 } }, ...brazo(E0, E1, false), { f: l(351.6), v: { hD: 40, cD: 30, tronco: 4 } }, { f: l(351.9), v: "brazosCruzados" }, ...gestos(l(352.1), L + 14, ["brazosCruzados", { hI: 30, cI: 115, hD: 35, cD: 110, cabeza: 6, tronco: 2 }], 10)]}
          caras={[{ f: 0, v: "determinado" }, { f: l(346.4), v: "duda" }, { f: l(348.2), v: "determinado" }, { f: l(350.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: -0.7, y: -0.3 } }]}
          ajuste={pinta} enManoD={(fr: number) => (fr < l(351.6) ? <Brocha /> : null)} />
        {f >= l(351.6) && <g transform={`translate(${PARED.x + 30 + wE + RE - 40},${Math.min(P - 4, P - 190 + (f - l(351.6)) * 26)}) rotate(${Math.min(80, (f - l(351.6)) * 9)})`}><Brocha /></g>}
      </>}
      hud={<>
        <Barra x={1500} y={190} w={640} rotulo="KCAL STORED" de={0} a={6.1 / 7} desde={l(346.0)} fin={l(348.2)} color="#ffcf6e" tam={36} texto={(v) => `${(v * 7).toFixed(1)}M / 7M`} />
        <Cartel texto="SHORT OF THE GOAL · ENOUGH FOR WINTER 2" x={1240} y={90} desde={l(347.4)} color="#ffcf6e" tam={46} />
      </>} />
  );
};

// ---------- E79 (R31) · 352:4-357:1 · el henil de noche: June sube la escalera con el farol; Lily dormida, hecha un ovillo junto a Ore ----------
// v4: cámara continua que acompaña la subida (zoom 2: June ocupa >30 % del alto) y termina cerca de Lily; Lily ACURRUCADA
// (rodillas abrazadas, cabeza gacha), se revuelve una vez; Ore levanta la cabeza cuando llega June.
const R31: React.FC = () => {
  const f = useF();
  const l = loc(352.4);
  const L = l(357.1);
  const bal = 9 * Math.sin(f / 9);
  const pier = { pI: 50, rI: 120, pD: 55, rD: 125 };
  const ovillo = { ...pier, tronco: 18, cabeza: 26, hD: 40, cD: 128, hI: 46, cI: 122 };
  const ovillo2 = { ...pier, tronco: 22, cabeza: 32, hD: 36, cD: 134, hI: 40, cI: 128 };
  return (
    <Escena Set={Granero} pal={PAL} seed={119} setProps={{ farol: 1, hora: "noche" }}
      claves={camino([[0, GR_PUNTOS.escalera - 40, GR_PISO - 200, 2.0], [l(354.6), GR_PUNTOS.escalera - 70, GR_HENIL - 70, 2.0], [l(356.0), GR_PUNTOS.lily + 170, GR_HENIL - 120, 2.3], [L + 10, GR_PUNTOS.lily + 120, GR_HENIL - 130, 2.6]])}
      medio={<>
        <A look={JUNE} ruta={[{ f: 0, x: GR_PUNTOS.escalera, y: GR_PISO }, { f: l(354.6), x: GR_PUNTOS.escalera, y: GR_HENIL }, { f: l(356.6), x: GR_PUNTOS.lily + 250, y: GR_HENIL }, { f: L + 20, x: GR_PUNTOS.lily + 225, y: GR_HENIL }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: "agarrarAlto" }, ...gestos(0, l(354.6), [{ hD: 60, cD: 40, hI: 150, cI: 10 }, { hD: 60, cD: 40, hI: 60, cI: 40, tronco: 4 }], 9), { f: l(354.6), v: { hD: 70, cD: 30, tronco: 4 } },
            ...gestos(l(356.6), L + 14, [{ hD: 80, cD: 24, tronco: 14, cabeza: 10 }, { hD: 74, cD: 30, tronco: 18, cabeza: 14 }], 12)]}
          caras={[{ f: 0, v: "neutral" }, { f: l(355.9), v: "duda" }]} miradas={[{ f: 0, v: { x: 0, y: -0.6 } }, { f: l(355.6), v: { x: -0.9, y: 0.4 } }]}
          enManoD={<g transform={`rotate(${bal})`}><FarolMano f={f} s={1} /></g>} />
        <A look={LILY} escala={NINO} ruta={[{ f: 0, x: GR_PUNTOS.lily, y: GR_HENIL }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: "sentadoSuelo" }, { f: 1, v: ovillo }, ...gestos(l(353.0), l(355.2), [ovillo2, ovillo], 26), { f: l(355.2), v: { ...pier, tronco: 4, cabeza: 6, hD: 70, cD: 60, hI: 46, cI: 122 } }, ...gestos(l(355.8), L + 14, [ovillo, ovillo2], 22)]}
          caras={[{ f: 0, v: "cansado" }, { f: l(355.2), v: "triste" }, { f: l(355.9), v: "cansado" }]} asiento={[{ f: 0, v: 8 }]} ajuste={(p) => ({ ...p, tronco: (p.tronco ?? 0) + 14 })} />
        <Ore x={GR_PUNTOS.lily - 175} y={GR_HENIL} s={0.8} dir={1} f={f} echado={1} cola={0.3 + 0.5 * ap(f, l(355.6), 10)} cabeza={0.5 * ap(f, l(355.6), 14)} />
        <Hojitas x0={GR_PUNTOS.lily - 200} x1={GR_PUNTOS.lily + 420} y0={GR_HENIL - 330} y1={GR_HENIL - 20} n={24} f={f} vel={150} tam={0.35} colores={["#e2c060", "#f6e6a0"]} />
      </>}
      hud={<Cartel texto="LILY · ASLEEP" x={1100} y={930} desde={l(354.4)} color="#ffb04a" tam={60} />} />
  );
};

// ---------- E80 (R32) · 357:1-366:2 · June se arrodilla PEGADA a Lily, le apoya la mano en la frente (arde, 102 °F) y después en la espalda;
// Lily se agarra el costado derecho y respira agitada. Cámara continua con un empuje en el 102 (sin lageo en 364).
const R32: React.FC = () => {
  const f = useF();
  const l = loc(357.1);
  const L = l(366.2);
  const t = interpolate(f, [l(358.0), l(360.8)], [98.6, 102.0], { ...cl, easing: (u) => 1 - (1 - u) * (1 - u) }); // sólo el mercurio; el número aparece en 102 junto con el HUD (T 360.8)
  const rod = { pI: 0, rI: 90, pD: 90, rD: 90 };
  const pier = { pI: 50, rI: 120, pD: 55, rD: 125 };
  const jadeo = (g: number) => Math.sin(g / 5) * 3 * ap(g, l(360.0), 20);
  return (
    <Escena Set={Granero} pal={PAL} seed={120} setProps={{ farol: 1, hora: "noche" }}
      claves={camino([[0, GR_PUNTOS.lily + 110, GR_HENIL - 150, 2.45], [l(358.4), GR_PUNTOS.lily + 80, GR_HENIL - 140, 2.6], [l(360.8), GR_PUNTOS.lily + 60, GR_HENIL - 135, 2.75], [l(361.6), GR_PUNTOS.lily + 50, GR_HENIL - 132, 2.95], [l(364.0), GR_PUNTOS.lily + 40, GR_HENIL - 128, 3.05], [L + 10, GR_PUNTOS.lily + 30, GR_HENIL - 125, 3.15]])}
      medio={<>
        <A look={LILY} escala={NINO} ruta={[{ f: 0, x: GR_PUNTOS.lily, y: GR_HENIL }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: { ...pier, tronco: 18, cabeza: 26, hD: 40, cD: 128, hI: 46, cI: 122 } }, ...gestos(6, l(359.9), [{ ...pier, tronco: 14, cabeza: 18, hD: 40, cD: 120, hI: 46, cI: 116 }, { ...pier, tronco: 18, cabeza: 24, hD: 44, cD: 126, hI: 42, cI: 122 }], 20),
            { f: l(359.9), v: { ...pier, hD: 20, cD: 60, hI: 30, cI: 40, tronco: 6, cabeza: -6 } }, ...gestos(l(360.6), l(363.2), [{ ...pier, hD: 24, cD: 64, hI: 30, cI: 46, tronco: 8, cabeza: -2 }, { ...pier, hD: 18, cD: 56, hI: 34, cI: 40, tronco: 4, cabeza: -8 }], 16),
            { f: l(363.2), v: { ...pier, hD: 30, cD: 140, hI: 20, cI: 120, tronco: 18 } }, ...gestos(l(363.6), L + 14, [{ ...pier, hD: 34, cD: 135, hI: 20, cI: 120, tronco: 22, cabeza: 8 }, { ...pier, hD: 28, cD: 145, hI: 24, cI: 115, tronco: 14, cabeza: -4 }], 12)]}
          caras={[{ f: 0, v: "cansado" }, { f: l(361.6), v: "triste" }, { f: l(363.4), v: "miedo" }]} asiento={[{ f: 0, v: 8 }]} ajuste={(p, g) => ({ ...p, tronco: (p.tronco ?? 0) - 12 + jadeo(g) })} />
        <A look={JUNE} ruta={[{ f: 0, x: GR_PUNTOS.lily + 210, y: GR_HENIL }, { f: l(357.6), x: GR_PUNTOS.lily + 100, y: GR_HENIL }, { f: L + 20, x: GR_PUNTOS.lily + 94, y: GR_HENIL }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: { ...rod, tronco: 10, hD: 60, cD: 30, hI: 40, cI: 30, cabeza: 8 } }, { f: l(357.6), v: { ...rod, tronco: 36, hD: 44, cD: 4, hI: 40, cI: 30, cabeza: 16 } },
            ...gestos(l(358.1), l(360.9), [{ ...rod, tronco: 38, hD: 40, cD: 2, hI: 44, cI: 34, cabeza: 18 }, { ...rod, tronco: 34, hD: 46, cD: 8, hI: 40, cI: 30, cabeza: 14 }], 14),
            { f: l(361.1), v: { ...rod, tronco: 30, hD: 46, cD: 20, hI: 50, cI: 40, cabeza: 12 } }, ...gestos(l(361.6), L + 14, [{ ...rod, tronco: 32, hD: 42, cD: 14, hI: 52, cI: 44, cabeza: 14 }, { ...rod, tronco: 28, hD: 50, cD: 24, hI: 48, cI: 38, cabeza: 10 }], 10)]}
          caras={[{ f: 0, v: "duda" }, { f: l(359.6), v: "miedo" }, { f: l(363.6), v: "determinado" }]} miradas={[{ f: 0, v: { x: -0.9, y: 0.3 } }]} />
        <Halo x={GR_PUNTOS.lily} y={GR_HENIL - 120} r={220} color="#e23a2e" fuerza={0.35 * ap(f, l(360.8), 20)} />
        {Array.from({ length: 4 }).map((_, i) => { const u = ((f / 26 + i / 4) % 1); return <ellipse key={i} cx={GR_PUNTOS.lily + 6 + i * 9 - 14} cy={GR_HENIL - 150 + u * 70} rx={4} ry={7} fill="#9bd8ff" opacity={(1 - u) * ap(f, l(358.4), 14)} />; })}
      </>}
      hud={<>
        <Pip><TermoFiebre x={1680} y={900} temp={t} f={f} s={1.0} /></Pip>
        <Cartel texto="BURNING HOT" x={960} y={130} desde={l(359.7)} hasta={l(360.8)} color="#ff8a4a" tam={72} />
        <Dato x={960} y={130} rotulo="LILY" de={102} a={102} sufijo=" °F" desde={l(360.8)} color="#e23a2e" tam={96} />
        <Cartel texto="RIGHT SIDE" x={960} y={890} desde={l(363.6)} hasta={l(366.0)} color="#ffffff" borde="#e23a2e" tam={96} />
      </>} />
  );
};

// ---------- E80 · 366:2-372:1 · la ventana iluminada del granero: June junto a Lily; la cámara se aleja con la ventana pulsando ----------
const R33: React.FC = () => {
  const f = useF();
  const l = loc(366.2);
  const L = l(372.1);
  const C = l(368.4); // corte: plano medio adentro → la ventana desde afuera
  if (f < C) return (
    <Escena Set={Granero} pal={PAL} seed={121} setProps={{ farol: 1, hora: "noche" }} claves={[mira(0, GR_PUNTOS.lily + 90, GR_HENIL - 140, 2.15), mira(C, GR_PUNTOS.lily + 100, GR_HENIL - 145, 2.3)]}
      medio={<>
        <A look={LILY} escala={NINO} ruta={[{ f: 0, x: GR_PUNTOS.lily, y: GR_HENIL }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { pI: 50, rI: 120, pD: 55, rD: 125, hD: 30, cD: 140, hI: 20, cI: 120, tronco: 18 } }]} caras={[{ f: 0, v: "triste" }]} asiento={[{ f: 0, v: 8 }]} ajuste={(p, g) => ({ ...p, tronco: (p.tronco ?? 0) + 14 + Math.sin(g / 6) * 2 })} />
        <A look={JUNE} ruta={[{ f: 0, x: GR_PUNTOS.lily + 175, y: GR_HENIL }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "arrodillado" }, { f: 6, v: { tronco: 14, pI: 0, rI: 90, pD: 90, rD: 90, hD: 95, cD: 25, hI: 40, cI: 30, cabeza: 10 } }, ...gestos(l(366.9), C, [{ tronco: 18, pI: 0, rI: 90, pD: 90, rD: 90, hD: 100, cD: 20, hI: 70, cI: 40, cabeza: 14 }, { tronco: 10, pI: 0, rI: 90, pD: 90, rD: 90, hD: 85, cD: 30, hI: 40, cI: 30, cabeza: 4 }], 16)]}
          caras={[{ f: 0, v: "duda" }, { f: l(367.2), v: "determinado" }]} miradas={[{ f: 0, v: { x: -0.9, y: 0.3 } }]} />
        <Halo x={GR_PUNTOS.lily + 60} y={GR_HENIL - 120} r={240} color="#e23a2e" fuerza={0.22} />
      </>}
      hud={<>
        <Cartel texto="SEEN IT A HUNDRED TIMES · THE ER" x={1240} y={80} desde={l(366.7)} color="#f6ecd2" tam={52} />
        <Dato x={1560} y={210} rotulo="FEVER" de={102} a={102} sufijo=" °F" desde={l(366.4)} color="#e23a2e" tam={80} />
      </>} />
  );
  return (
    <Escena Set={Granja} pal={PAL} seed={121} setProps={{ hora: "noche", estacion: "verano", crec: 0.6, helada: 1 }}
      claves={[mira(0, 1250, 335, 3.0), mira(C + 6, 1250, 340, 2.9), mira(L, 1300, 520, 0.7, { curva: "inout" })]}
      medio={<>
        <SiluetasVentana x={1250} y={335} f={f} />
        <Halo x={1250} y={335} r={260 + 40 * Math.sin(f / 10)} color="#ffcf6e" fuerza={0.35 + 0.2 * Math.sin(f / 10)} />
      </>}
      hud={<>
        <div style={{ position: "absolute", left: 0, top: 900, width: 1920, height: 150, background: "linear-gradient(rgba(10,8,14,0), rgba(10,8,14,0.7))", opacity: ap(f, C, 10) }} />
        <Rotulo texto="NEVER ALONE. UNTIL NOW." x={960} y={930} centro desde={C + 4} color="#ffffff" tam={64} brillo={false} />
        <Dato x={1560} y={210} rotulo="FEVER" de={102} a={102} sufijo=" °F" desde={C} color="#e23a2e" tam={80} vivo={false} />
      </>} />
  );
};

// ---------- E82 (R34) · 372:1-380:0 · CTA: de a uno alzan SU cosecha (papa, choclo, zapallo, frasco) con resorte; Ben aprieta un
// botón SUBSCRIBE gigante en un poste (se hunde y pasa a SUBSCRIBED); cierre: todos saludan, Ore corre. Lily no está.
const Choclo: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s}) rotate(-20)`}>
    <path d="M-4,10 Q-22,-10 -6,-40 Q-8,-12 0,8 Z" fill="#6aa848" />
    <ellipse cx={2} cy={-22} rx={11} ry={28} fill="#f1c24a" stroke="#c99a2a" strokeWidth={2} />
    {[-38, -28, -18, -8, 2].map((y) => <line key={y} x1={-7} x2={11} y1={y} y2={y} stroke="#d9a830" strokeWidth={1.5} />)}
    <path d="M8,10 Q24,-8 10,-36 Q8,-10 2,8 Z" fill="#7cc45a" />
  </g>
);
const Zapallo: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <ellipse cx={0} cy={-20} rx={30} ry={22} fill="#e8822a" stroke="#b85a1a" strokeWidth={2} />
    {[-14, 0, 14].map((x) => <path key={x} d={`M${x},-41 Q${x * 1.5},-20 ${x},1`} stroke="#c8641e" strokeWidth={2} fill="none" />)}
    <rect x={-3} y={-50} width={6} height={11} rx={2} fill="#5a7a2a" />
  </g>
);
const BotonSub: React.FC<{ x: number; y: number; f: number; t: number }> = ({ x, y, f, t }) => {
  const k = ap(f, t, 4), vuelta = ap(f, t + 4, 8);
  const hundido = k * (1 - vuelta) * 12;
  const on = f >= t + 3;
  const rebote = on ? 1 + 0.1 * Math.sin((f - t) / 2.2) * Math.exp(-(f - t) / 12) : 1;
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-6} y={0} width={12} height={GRANJA_PISO + 60 - y} fill="#7a5a3e" />
      <rect x={-110} y={-58} width={220} height={70} rx={14} fill="#3a2a22" />
      <g transform={`translate(0,${hundido - 22}) scale(${rebote})`}>
        <rect x={-102} y={-30} width={204} height={56} rx={28} fill={on ? "#5a5a62" : "#e23a2e"} stroke="#ffffff" strokeWidth={4} />
        <text x={on ? 14 : 0} y={9} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={on ? 24 : 28} fill="#ffffff">{on ? "SUBSCRIBED" : "SUBSCRIBE"}</text>
        {on && <path d="M-90,-2 l8,9 l14,-17" stroke="#ffffff" strokeWidth={5} fill="none" strokeLinecap="round" />}
      </g>
    </g>
  );
};
const R34: React.FC = () => {
  const f = useF();
  const l = loc(372.1);
  const L = l(380.0);
  const T = l(376.7); // «subscribe»: Ben aprieta
  const X0 = 2780, D = 160;
  const BX = X0 + 8 * D;
  const cosecha = (i: number, k: number) => {
    const s = Math.min(1.15, k * 1.15);
    if (i % 4 === 0) return <Papa x={0} y={-14} s={1.2 * s} rot={i * 20} />;
    if (i % 4 === 1) return <Choclo s={1.1 * s} />;
    if (i % 4 === 2) return <Zapallo s={0.95 * s} />;
    return <Lata s={1.1 * s} color={["#e0563a", "#f1c24a"][i % 2]} />;
  };
  return (
    <Escena Set={Granja} pal={PAL} seed={122} setProps={{ hora: "dia", estacion: "verano", crec: 1 }}
      claves={camino([[0, 3330, 712, 1.22], [l(374.4), 3420, 724, 1.3], [l(376.2), 3740, 738, 1.48], [l(377.6), 3800, 742, 1.56], [L + 10, 3720, 742, 1.6]])}
      medio={<>
        <BotonSub x={BX + 120} y={Y - 210} f={f} t={T} />
        {LOS10.map((look, i) => {
          if (i === 9) return null;
          const t0 = l(372.5) + i * 7;
          const alza = { hD: 104, cD: 52, cabeza: -6 }, alza2 = { hD: 112, cD: 44, cabeza: -2, tronco: -2 };
          const esBen = i === 8;
          const fin = l(378.1) + (i % 3) * 3;
          return <A key={i} look={look} escala={i >= 8 ? NINO : 1} seed={i * 3}
            ruta={esBen ? [{ f: 0, x: BX, y: Y }, { f: l(375.9), x: BX, y: Y }, { f: T - 4, x: BX + 40, y: Y }, { f: L + 20, x: BX + 40, y: Y }] : [{ f: 0, x: X0 + i * D, y: Y }]}
            dir={[{ f: 0, v: 1 }]}
            caras={[{ f: 0, v: "neutral" }, { f: t0, v: "feliz" }, { f: t0 + 12, v: "risa" }]}
            poses={esBen
              ? [{ f: 0, v: "parado" }, { f: t0, v: alza }, ...gestos(t0 + 14, l(375.8), [alza2, alza], 14), { f: l(376.1), v: { hD: 70, cD: 10, tronco: 4 } }, { f: T - 3, v: { hD: 92, cD: 0, tronco: 8 } }, { f: T + 3, v: { hD: 80, cD: 12, tronco: 2 } }, { f: T + 9, v: "celebrar" }, ...gestos(T + 16, L + 14, ["celebrar", "saludar"], 12)]
              : [{ f: 0, v: "parado" }, { f: t0, v: alza }, ...gestos(t0 + 14, fin, [alza2, alza], 16), ...gestos(fin, L + 14, ["saludar", { hD: 120, cD: 30 }], 12)]}
            enManoD={(fr: number) => (fr > t0 + 2 && (!esBen || fr < l(375.9)) && fr < fin ? cosecha(i, Math.min(1, (fr - t0 - 2) / 6)) : null)} />;
        })}
        <Ore x={2690 + ap(f, l(375.0), 70) * 1300} y={Y} s={1} dir={1} f={f} cola={1} cabeza={Math.max(0, Math.sin(f / 7)) * 0.6} />
      </>}
      hud={<>
        <Rotulo texto={"One acre. One summer.\nWhat would you plant?"} x={1240} y={40} centro desde={l(372.6)} color="#ffcf6e" tam={66} />
        <Dato x={1500} y={215} rotulo="KCAL IN THE CELLAR" de={5000000} a={6100000} desde={l(373.6)} fin={l(376.0)} color="#7cd36a" tam={52} />
      </>} />
  );
};

// ---------- E82 · 380:0-384:9 · teaser Ep.5: el pasillo de la farmacia; la luz del farol avanza con quien camina; la cámara entra ----------
const R35: React.FC<{ s0: number }> = ({ s0 }) => {
  const f = useF();
  const l = loc(s0);
  const L = l(s0 + 4.9);
  const x = interpolate(f, [0, L], [470, 780], cl);
  return (
    <Escena Set={PasilloFarmacia} pal={PAL} setProps={{ llenado: 0.25, fondoLuz: 0.5, luzFarol: { x: x + 40, y: 740, on: 1 } }} seed={505}
      claves={[mira(0, 960, 565, 1.15), mira(L, 900, 640, 1.35)]}
      medio={<>
        <A look={THEO_INV} escala={interpolate(f, [0, L], [1.5, 1.75], cl)} ruta={[{ f: 0, x: 520, y: 900 }, { f: L, x: 760, y: 990 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "duda" }, { f: l(s0 + 2.5), v: "determinado" }]} miradas={[{ f: 0, v: { x: 0.8, y: -0.1 } }]} enManoI={<FarolMano f={f} s={1.2} />} />
        <A look={JUNE_MOCHI} escala={1.5} ruta={[{ f: 0, x: 1380, y: 960 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 90, cD: 40 } }, ...gestos(l(s0 + 1.0), L, [{ hD: 120, cD: 30 }, { hD: 105, cD: 40, cabeza: 6 }], 18)]} caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: { x: 0.5, y: -0.3 } }]}
          luz={{ lado: 1, color: "#ffcf6e", fuerza: 1 }} enManoD={<g><Halo x={0} y={-30} r={130} color="#ffcf6e" fuerza={0.6} /><Vial s={1.2} brillo={1} /></g>} />
      </>}
      hud={<>
        <Pildora texto="NEXT · EP. 5" x={960} y={90} desde={l(s0 + 0.2)} color="#ffcf6e" tam={44} />
        <Rotulo texto="PHARMACY" x={1230} y={160} centro desde={l(s0 + 0.5)} color="#9bd8ff" tam={96} />
        <Rotulo texto="Could 10 people rebuild medicine?" x={960} y={990} centro desde={l(s0 + 0.6)} color="#f6ecd2" tam={56} brillo={false} />
      </>} />
  );
};

export const PLANOS_B: [number, React.ReactNode, PlanoM["trans"]?][] = [
  [204.8, <R01 />, { tipo: "cortina", d: 14, color: "#0b0810" }], [208.3, <R02 />, { tipo: "luz", d: 10 }], [214.5, <R03 />, { tipo: "barrido", d: 10 }], [221.8, <R04 />], [223.5, <R05 />, { tipo: "barrido", d: 10 }],
  [231.0, <R06 />, { tipo: "fundido", d: 16 }], [236.9, <R07 />, { tipo: "fundido", d: 12 }], [240.1, <R08 />, { tipo: "barrido", d: 10 }], [246.6, <R09 />],
  [248.7, <R10 />, { tipo: "cortina", d: 14, color: "#0b0810" }], [253.0, <R11 />, { tipo: "fundido", d: 12 }], [256.9, <R12 />, { tipo: "barrido", d: 10 }], [262.1, <R13 />, { tipo: "barrido", d: 10 }], [266.3, <R14 />, { tipo: "luz", d: 12 }], [273.5, <R15 />, { tipo: "fundido", d: 14 }],
  [279.3, <R16 />, { tipo: "luz", d: 14 }], [281.9, <R17 />, { tipo: "barrido", d: 10 }], [286.3, <R18 />, { tipo: "barrido", d: 10 }], [292.9, <R19 />], [298.0, <R20 />, { tipo: "fundido", d: 12 }],
  [301.6, <R21 />, { tipo: "fundido", d: 20 }], [305.2, <R22 />], [309.5, <R23 />, { tipo: "fundido", d: 12 }], [313.8, <R24 />, { tipo: "luz", d: 8, color: "#e8f6ff" }],
  [314.7, <Planta3 s0={314.7} s1={316.9} tipo="poroto" txt="BEANS · BLACK" />, { tipo: "fundido", d: 10 }], [316.9, <Planta3 s0={316.9} s1={319.1} tipo="tomate" txt="TOMATOES · MUSH" />], [319.1, <Planta3 s0={319.1} s1={321.4} tipo="zapallo" txt="SQUASH · COLLAPSED" />], [321.4, <R26 />, { tipo: "fundido", d: 12 }],
  [325.1, <R27 />, { tipo: "luz", d: 12 }], [334.8, <R28 />, { tipo: "barrido", d: 10 }], [339.9, <R29a />, { tipo: "barrido", d: 10 }], [342.5, <R29b />], [345.1, <R30 />],
  [352.4, <R31 />, { tipo: "cortina", d: 16, color: "#0b0810" }], [357.1, <R32 />], [366.2, <R33 />, { tipo: "fundido", d: 14 }],
  [372.1, <R34 />, { tipo: "luz", d: 16 }], [380.0, <R35 s0={380.0} />, { tipo: "cortina", d: 16, color: "#0b0810" }],
];
