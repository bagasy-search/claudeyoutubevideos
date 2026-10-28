// lc04 · planos 0:00-3:24,8 (SEC 1-8 del plan MxM: gancho, la granja, la primera cena, el reloj del verano,
// la cuenta de la papa, las semillas, Nan y los sobres, plantar). Cuadros locales: l(segundo global).
// v1 (director creativo): cada plano con personajes ACTUANDO (gestos) + dato/contador + componente de concepto.
import React from "react";
import { interpolate, random, spring } from "remotion";
import { Clave, mira, useF } from "../../anikit/camara";
import { Escena } from "../../anikit/escena";
import { Charco, Halo } from "../../anikit/luz";
import { PlanoM } from "../../anikit/montaje";
import { EtiquetaFlotante, F_HUD, F_MANO, Globo } from "../../anikit/pantalla";
import { Bolsa, Carrito, Lata } from "../../anikit/props";
import { COCINA_PISO, Cocina, Silla } from "../../anikit/sets/cocina";
import { SUPER_PISO, Supermercado } from "../../anikit/sets/super";
import { ActorProps } from "../../anikit/actor";
import { POSES } from "../../anikit/personaje";
import { GUS, JUNE, PAL, THEO, THEO_INV } from "../elenco";
import { Auto } from "../mundo/comun";
import { A, Rotulo, T, gestos, loc } from "./comun_ep";
import { BEN, DEV, LILY, NAN, NINO, Ore, PRIYA, ROSA } from "./elenco_lcb";
import { GRANJA_PISO, Granja, Papa, PARED, PUERTA_GRANERO, Tractor } from "./granja";
import { Balanza, Balde, Bidon, BusEscolar, Cancha, Llamita, Pala, Primer, Puesto, RelojLatas, Sobre, SolCruza, Brocha, FotoVieja, horaCiclo } from "./piezas4";
import { Aves, BarraHud, Cartel, SelloSobre, Casillas, Cuchillo, GotasCharco, Gotero, InsertoMano, LlamaQ, LupaGrande, ManoDedos, MapaMillas, MapaPin, Marca, Mazo, Nube, Num, PilaFardos, Plantitas, Ranas, Soplo, ap, cl } from "./piezas_e4a";
import { Helada4, Horquilla, MARCUS_VERANO } from "./tarjetas";

const P = GRANJA_PISO;
const Y = P + 60; // los pies sobre el camino de tierra
export const LOS10 = [MARCUS_VERANO, THEO, JUNE, GUS, ROSA, DEV, PRIYA, NAN, BEN, LILY];
const esNino = (i: number) => i >= 8;
type Pz = string | Record<string, number>;

// pastilla oscura detrás de un rótulo (HUD): legibilidad sobre cualquier fondo
const Past: React.FC<{ x: number; y: number; w: number; h: number; desde: number; hasta?: number }> = ({ x, y, w, h, desde, hasta }) => {
  const f = useF();
  return <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: h, borderRadius: 26, background: "rgba(14,10,18,0.74)", opacity: ap(f, desde, 8) * (hasta === undefined ? 1 : 1 - ap(f, hasta - 6, 6)) }} />;
};
// vaivén de ida y vuelta: ruta con tramos x0 → x1 → x0 … (cada tramo `per` cuadros)
const idaVuelta = (x0: number, x1: number, f0: number, per: number, n: number, y = Y) => {
  const r: { f: number; x: number; y: number; curva: "lineal" }[] = [{ f: f0, x: x0, y, curva: "lineal" }];
  for (let i = 1; i <= n; i++) r.push({ f: f0 + i * per, x: i % 2 ? x1 : x0, y, curva: "lineal" });
  return r;
};
// saltos: ruta con rebote vertical cada `per` cuadros
const saltos = (x: number, y: number, f0: number, f1: number, per: number, alto = 40) => {
  const r: { f: number; x: number; y: number }[] = [{ f: 0, x, y }];
  for (let f = f0, i = 0; f < f1; f += per, i++) r.push({ f, x, y: i % 2 ? y : y - alto });
  r.push({ f: f1, x, y });
  return r;
};

// grupo de los 10 en fila (x0 + i*paso); `extra(i)` = props por persona
const Grupo: React.FC<{ x0: number; paso: number; y?: number; dir?: 1 | -1; extra?: (i: number) => Partial<ActorProps>; seed?: number; solo?: number[]; escala?: number }> = ({ x0, paso, y = Y, dir = 1, extra, seed = 0, solo, escala = 1 }) => (
  <>{LOS10.map((look, i) => (solo && solo.indexOf(i) < 0 ? null : <A key={i} look={look} escala={(esNino(i) ? NINO : 1) * escala} seed={seed + i * 7} ruta={[{ f: 0, x: x0 + i * paso, y }]} dir={[{ f: 0, v: dir }]} {...(extra ? extra(i) : {})} />))}</>
);
const Cartel40: React.FC<{ x: number; pop?: number }> = ({ x, pop = 1 }) => (
  <g transform={`translate(${x},${P + 40}) scale(${pop})`}>
    <rect x={-8} y={-200} width={16} height={200} fill="#6a4a32" />
    <rect x={-150} y={-260} width={300} height={90} rx={6} fill="#f2e6cc" stroke="#6a4a32" strokeWidth={8} />
    <text x={0} y={-200} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={52} fill="#b8382c">40 ACRES</text>
  </g>
);

// granja lejana (granero + silo + tractor) para el fondo de la portada (copia de la portada: el cuadro 0 es idéntico)
const GranjaLejosQ: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M0,0 L0,-120 L40,-170 L160,-170 L200,-120 L200,0 Z" fill="#b8322c" />
    <path d="M-10,-118 L40,-176 L160,-176 L210,-118" stroke="#f0e6d2" strokeWidth={8} fill="none" />
    <rect x={70} y={-90} width={60} height={90} fill="#8a2420" /><path d="M70,-90 L130,0 M130,-90 L70,0" stroke="#f0e6d2" strokeWidth={6} />
    <rect x={230} y={-220} width={70} height={220} fill="#c9c4b8" /><ellipse cx={265} cy={-220} rx={35} ry={14} fill="#9aa0a8" />
    <Tractor x={420} y={0} s={0.55} />
  </g>
);

// cámara CONTINUA (copia del helper de lc03a): puntos de paso [cuadro, X, Y, zoom] → una clave por cuadro con spline de
// Hermite (tangentes de Catmull-Rom, zoom en escala log). Nunca llega a velocidad 0 a mitad de plano: sin lageos ni frenadas.
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
// ciclo de trabajo CONTINUO (palear, cavar): poses encadenadas cada `cada` cuadros desde antes del plano hasta después del
// último cuadro (nunca un cambio de pose por cuadro suelto ni un ciclo que se corta antes del final)
const ciclo = (f0: number, f1: number, lista: Pz[], cada: number, fase = 0) => gestos(f0 - 40 + (fase % cada), f1 + 40, lista, cada);
// fase 0..1 de un ciclo de `per` cuadros (para utilería que acompaña a la pose)
const fase = (f: number, per: number, off = 0) => (((f + off) % per) + per) % per / per;

// golpe amortiguado local (impacto que decae)
const golpeSuave =(f: number, f0: number) => (f < f0 ? 0 : 7 * Math.exp(-(f - f0) / 4) * Math.sin((f - f0) * 1.3));

// ---------- E1 · 0:00-4:9 · cuadro 0 = la miniatura; la promesa se desvanece y cada uno ACTÚA su susto; la cámara empuja a la fila ----------
const Q01: React.FC = () => {
  const f = useF();
  const av = interpolate(f, [0, 300], [0, 90]);
  const ve = interpolate(f, [T(1.2), T(1.2) + 30], [1, 0], cl);
  const susto = { tronco: 8, hD: 40, cD: 60, hI: -30, cI: 40 };
  const f0 = T(1.0), f1 = T(4.9);
  const secarFrente = { tronco: 4, hD: 165, cD: 135, hI: -20, cI: 40 };
  const alzar = { tronco: -6, hD: 150, cD: 20, hI: 140, cI: 25 };
  const rasca = { tronco: 4, hD: 150, cD: 125, hI: -10, cI: 30 };
  const listas: Pz[][] = [
    [susto, "encogerse", susto, "manosCara"],
    ["brazosCruzados", susto, "brazosCruzados", "pensar"],
    [secarFrente, susto, secarFrente, "encogerse"],
    ["manosCara", "encogerse"],
    [alzar, susto, alzar, "celebrar"],
    ["manosCintura", rasca, "manosCintura", susto],
    ["saludar", susto, "saludar", "encogerse"],
    [alzar, susto, "pensar", alzar],
    [rasca, "manosCara", rasca, susto],
    ["manosCintura", susto, "brazosCruzados", susto],
  ];
  // Lily (6) da 3 saltitos de festejo (arco ≤90 px, aterriza en ~6 cuadros) y Theo (7) le choca la mano; Gus (1) cruza los
  // brazos; Rosa (2) se seca la frente. Nadie queda en el aire: cada salto sube y baja en 12 cuadros.
  const sostiene = { tronco: 8, hD: 120, cD: 30, hI: -10, cI: 30, cabeza: 10 };
  const alzada: { f: number; x: number; y: number; curva?: "out" | "in" | "lineal" }[] = [{ f: 0, x: 3120, y: P + 80 }];
  [T(1.5), T(2.0), T(2.5)].forEach((s0, k) => { const x0 = 3120 + 0.6 * s0 + k * 4; alzada.push({ f: s0, x: x0, y: P + 80, curva: "lineal" }, { f: s0 + 6, x: x0 + 2, y: P + 80 - 90, curva: "out" }, { f: s0 + 12, x: x0 + 4, y: P + 80, curva: "in" }); });
  alzada.push({ f: 300, x: 3120 + 180, y: P + 80, curva: "lineal" });
  const lilyX = (ff: number) => interpolate(ff, alzada.map((a) => a.f), alzada.map((a) => a.x), cl);
  const lilyY = (ff: number) => interpolate(ff, alzada.map((a) => a.f), alzada.map((a) => a.y), cl) - 250 * NINO;
  const cuenta0 = T(1.7);
  const nContados = Math.min(10, Math.max(1, Math.floor((f - cuenta0) / 6) + 1));
  const caras2 = ["duda", "determinado", "cansado", "sorpresa", "feliz", "duda", "sorpresa", "determinado", "miedo", "determinado"];
  const fila = [
    { look: PRIYA, x: 2480 }, { look: GUS, x: 2580 }, { look: ROSA, x: 2690 }, { look: NAN, x: 2790 }, { look: BEN, x: 2900, nino: true },
    { look: DEV, x: 3010 }, { look: LILY, x: 3120, nino: true }, { look: THEO_INV, x: 3250 }, { look: JUNE, x: 3380 }, { look: MARCUS_VERANO, x: 3520, horq: true },
  ];
  return (
    <Escena Set={Granja} pal={PAL} setProps={{ hora: "ocaso", estacion: "verano", crec: 1, humo: 0.4 }} seed={404} mano={2}
      claves={camino([[0, 3180, 600, 0.88], [T(1.4), 3185, 625, 0.95], [T(3.2), 3130, 670, 1.18], [T(4.9) + 8, 3085, 705, 1.42]])}
      medio={<>
        <GranjaLejosQ x={2380} y={P - 60} s={0.45} />
        {ve > 0 && <g opacity={ve}>
          <Halo x={3100} y={460} r={800} color="#ffb04a" fuerza={0.45} />
          <Papa x={3180} y={P - 260} s={15} rot={-8} color="#c0813e" />
          {[[-260, -120, 22], [-120, -230, 16], [60, -160, 26], [210, -60, 18], [-30, 20, 14], [300, -220, 15], [-330, 40, 17], [140, 60, 20]].map(([dx, dy, r], i) => <ellipse key={i} cx={3180 + dx} cy={P - 260 + dy} rx={r} ry={r * 0.7} fill="#8a5426" opacity={0.55} />)}
        </g>}
        {[0, 1, 2, 3, 4, 5, 7, 8, 9, 6].map((i) => { const p = fila[i]; return <A key={i} look={p.look} escala={(p.nino ? NINO : 1) * 1.05} seed={90 + i} luz={{ lado: -1, color: "#ffb04a", fuerza: 0.9 }}
          ruta={i === 6 ? alzada : [{ f: 0, x: p.x + av, y: P + 80 }, { f: 300, x: p.x + av + 90, y: P + 80 }]} dir={[{ f: 0, v: 1 }]}
          poses={i === 7 ? [{ f: 0, v: susto }, { f: T(1.4), v: alzar }, { f: T(1.55), v: sostiene }, { f: T(3.1), v: sostiene }, { f: T(3.5), v: "celebrar" }, ...gestos(T(3.9), f1, ["manosCintura", "celebrar"], 16)]
            : i === 6 ? [{ f: 0, v: susto }, { f: T(1.5), v: "celebrar" }, ...gestos(T(1.8), T(3.2), ["celebrar", "saludar"], 9), { f: T(3.5), v: "saludar" }, ...gestos(T(3.9), f1, ["parado", "saludar"], 14)]
            : i === 1 ? [{ f: 0, v: susto }, { f: T(1.5), v: "brazosCruzados" }, { f: T(2.4), v: { ...POSES.brazosCruzados, cabeza: 10 } }, { f: T(2.7), v: "brazosCruzados" }, { f: T(3.3), v: "pensar" }, { f: T(3.9), v: "brazosCruzados" }]
            : i === 2 ? [{ f: 0, v: susto }, ...gestos(T(1.5), T(3.0), [secarFrente, { ...secarFrente, hD: 150, cD: 150 }], 8), ...gestos(T(3.0), f1, ["encogerse", "manosCintura"], 18)]
            : [{ f: 0, v: susto }, ...gestos(f0 + i * 3, f1, listas[i], 16 + (i % 3) * 3)]}
          caras={[{ f: 0, v: "miedo" }, { f: T(1.4) + i * 2, v: caras2[i] }]} miradas={[{ f: 0, v: { x: 0.7, y: -0.1 } }, { f: T(2.0) + i * 4, v: { x: (i % 2 ? 0.7 : -0.5), y: i % 3 === 0 ? -0.4 : 0.1 } }, { f: T(3.4), v: { x: 0.7, y: -0.1 } }]}
          enManoD={p.horq ? <Horquilla /> : undefined} />; })}
        {/* conteo visible: cada uno recibe su número al contarlo (el contador de abajo = los números que se ven) */}
        {fila.map((p, i) => { const k = ap(f, cuenta0 + i * 6, 5); if (k <= 0) return null; const xx = i === 6 ? lilyX(f) : p.x + 0.6 * f; const yy = i === 6 ? lilyY(f) - 40 : P + 80 - (p.nino ? 250 : 365); const pop = 1 + 0.4 * Math.max(0, 1 - k * 1.5);
          return <g key={`n${i}`} transform={`translate(${xx},${yy}) scale(${pop})`} opacity={k}><circle r={24} fill="#ffcf6e" stroke="#1c1416" strokeWidth={5} /><text y={10} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={28} fill="#1c1416">{i + 1}</text></g>; })}
        <Ore x={2380 + av} y={P + 80} s={1.05} dir={1} f={f} paso={f} cola={1} ladra={1} />
        {f < 6 && <g opacity={1 - ap(f, 2, 4)}><Helada4 x0={3640} piso={P + 40} f={f} /></g>}
      </>}
      hud={<><Past x={1240} y={892} w={1240} h={100} desde={T(1.6)} /><Rotulo texto="10 PEOPLE · 1 FARM · 1 SUMMER" x={1240} y={904} centro desde={T(1.6)} color="#f6ecd2" tam={66} brillo={false} /></>} />
  );
};

// ---------- E2 · 4:9-10:2 · la cámara llega a la pared del granero; Marcus PINTA «7,000,000» y el contador KCAL/YEAR rueda ----------
const Q02: React.FC = () => {
  const f = useF();
  const l = loc(4.9);
  // Marcus (escala 1,4) PINTA la cifra en la pared: la brocha va en el borde de la pintura (el trazo aparece donde está la
  // brocha), termina justo antes de «seven million» (9.28) y da un paso atrás para mirarla mientras pinta «KCAL / YEAR».
  const E = 1.4, TX = PARED.x + 14, TY = PARED.y + 270, TAM = 82;
  const p0 = l(6.0), p1 = l(9.0);
  const borde = interpolate(f, [p0, p1], [TX - 10, TX + 300], cl); // el borde de la pintura = la brocha
  const pintaK = ap(f, l(9.4), 18);
  const pinta = { hD: 98, cD: 10, tronco: 3, hI: 20, cI: 30 }, pinta2 = { hD: 108, cD: 18, tronco: 1, hI: 22, cI: 34 };
  return (
    <Escena Set={Granja} pal={PAL} seed={41} mano={2}
      setProps={{ hora: "ocaso", estacion: "verano", crec: 1, humo: 0.5 }}
      claves={camino([[0, 930, 640, 1.3], [l(7.4), 900, 645, 1.4], [l(10.2) + 6, 880, 640, 1.48]])}
      medio={<>
        <Aves f={f} x0={500} x1={2100} y={200} n={6} dur={150} />
        <defs><clipPath id="pinta7m"><rect x={TX - 20} y={TY - TAM} width={Math.max(0, borde - TX + 20)} height={TAM * 1.3} /></clipPath>
          <clipPath id="pintaKy"><rect x={TX + 30} y={PARED.y + 70} width={270 * pintaK} height={70} /></clipPath></defs>
        <g clipPath="url(#pinta7m)"><text x={TX} y={TY} fontFamily={F_MANO} fontWeight={700} fontSize={TAM} fill="#7a1612" stroke="#7a1612" strokeWidth={3} letterSpacing={-2}>7,000,000</text></g>
        <g clipPath="url(#pintaKy)"><text x={TX + 34} y={PARED.y + 126} fontFamily={F_MANO} fontWeight={700} fontSize={44} fill="#2a1c18">KCAL / YEAR</text></g>
        <A look={MARCUS_VERANO} escala={E} ruta={[{ f: 0, x: 690, y: Y }, { f: p0, x: TX - 120, y: Y }, { f: p1, x: TX + 190, y: Y, curva: "lineal" }, { f: l(9.7), x: 690, y: Y }, { f: l(10.4), x: 640, y: Y }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: l(9.4), v: "feliz" }]}
          miradas={[{ f: 0, v: { x: 0.8, y: -0.1 } }, { f: l(9.3), v: { x: 0.8, y: -0.4 } }]}
          poses={[{ f: 0, v: { hD: 60, cD: 40, tronco: 2 } }, { f: p0 - 8, v: pinta }, ...gestos(p0, p1, [pinta, pinta2], 7), { f: l(9.3), v: { hD: 100, cD: 20, tronco: -2 } }, ...gestos(l(9.7), l(10.6), [{ hD: 104, cD: 16, tronco: -2 }, { hD: 92, cD: 24, tronco: 0 }], 9)]}
          enManoD={<Brocha color="#7a1612" />} />
      </>} />
  );
};

// ---------- E3 · 10:2-13:2 · los 10 pasan cargando cosas; una llamita crece sobre cada uno y el total «2,000/day» suma ----------
const Q03: React.FC = () => {
  const f = useF();
  const l = loc(10.2);
  // los 10 (todos en cuadro, 160 px entre cabezas) caminan cargando cosas; a cada uno se le ENCIENDE su llamita sobre la
  // cabeza y el contador suma 2,000 en ese mismo cuadro → 20,000/DAY; después × 365 ≈ 7 MILLION / YEAR («in a year»)
  const PASO = 160, X0 = 2720, AV = 240;
  const dx = interpolate(f, [-20, l(13.2) + 20], [-16, AV + 16]);
  const cargan: Pz[] = ["tirarCarga", "parado"];
  const tL = (i: number) => l(10.45) + i * 4; // la llama de cada uno
  const nL = Math.max(0, Math.min(10, Math.floor((f - l(10.45)) / 4) + 1));
  const anio = ap(f, l(12.05), 8);
  return (
    <Escena Set={Granja} pal={PAL} seed={42} setProps={{ hora: "ocaso", estacion: "verano", crec: 1, humo: 0.5 }}
      claves={camino([[-10, X0 + 4.5 * PASO + 30, 650, 1.08], [l(11.7), X0 + 4.5 * PASO + 150, 640, 1.11], [l(13.2) + 10, X0 + 4.5 * PASO + AV + 20, 630, 1.14]])}
      medio={<>
        {LOS10.map((look, i) => { const n = esNino(i); const x = X0 + i * PASO + dx; const k = ap(f, tL(i), 6); const pulso = 1 + 0.12 * Math.sin(f / 4 + i) + 0.5 * Math.max(0, 1 - (f - tL(i)) / 6) * (f >= tL(i) ? 1 : 0); const yy = Y - (n ? 290 : 420); return <g key={i}>
          <A look={look} escala={n ? NINO : 1} seed={i * 5} ruta={[{ f: -20, x: X0 + i * PASO - 16, y: Y }, { f: l(13.2) + 20, x: X0 + i * PASO + AV + 16, y: Y, curva: "lineal" }]} dir={[{ f: 0, v: 1 }]}
            poses={i % 3 === 2 ? ciclo(0, l(13.2), ["hablar", "manosCintura"], 24, i * 5) : [{ f: 0, v: i % 3 === 0 ? "tirarCarga" : "parado" }, ...ciclo(0, l(13.2), cargan, 26 + (i % 4) * 3, i * 7)]}
            caras={[{ f: 0, v: "determinado" }, { f: tL(i), v: i % 2 ? "feliz" : "determinado" }]}
            enManoD={i % 3 === 0 ? <Bolsa color="#c9a26a" /> : i % 3 === 1 ? <Lata s={0.9} /> : undefined} />
          {k > 0 && <g transform={`translate(${x},${yy}) scale(${k * pulso}) translate(${-x},${-yy})`}><LlamaQ x={x} y={yy} f={f} o={k} lab={false} /></g>}
          <Nube x={x - 30} y={Y + 4} f={f + i * 5} n={4} ancho={40} alto={50} deriva={-50} r0={7} opac={0.45} seed={i} />
        </g>; })}
      </>}
      hud={<>
        <Past x={1240} y={100} w={900} h={190} desde={l(10.45)} />
        <div style={{ opacity: 1 - anio }}><Num x={1240} y={110} desde={l(10.45)} f0={0} f1={1} v0={2000 * nL} v1={2000 * nL} suf=" KCAL / DAY" tam={84} rotulo="10 PEOPLE × 2,000" /></div>
        {anio > 0 && <div style={{ opacity: anio }}><Num x={1240} y={110} desde={l(12.05)} f0={0} f1={1} v0={7} v1={7} pre="× 365 ≈ " suf=" MILLION" tam={84} rotulo="KCAL A YEAR" coma={false} /></div>}
      </>} />
  );
};

// ---------- E4 · 13:2-16:9 · tilt abajo: el suelo en corte; Marcus desentierra una papa (KCAL rueda a 0) ----------
const Q04: React.FC = () => {
  const f = useF();
  const l = loc(13.2);
  const arr = POSES.arrodillado;
  const cava = { ...arr, tronco: 26, hD: 40, cD: 10, hI: 30, cI: 20, cabeza: 10 }, cava2 = { ...arr, tronco: 30, hD: 15, cD: 30, hI: 10, cI: 40, cabeza: 14 };
  const alza = { ...arr, tronco: -2, hD: 112, cD: 0, hI: 20, cI: 40, cabeza: -8 };
  const enMano = f >= l(15.5);
  return (
    <Escena Set={Granja} pal={PAL} seed={43} setProps={{ hora: "ocaso", estacion: "verano", crec: 1, corte: ap(f, l(13.6), 24), papas: 1 }}
      claves={[mira(0, 3700, 700, 1.3), mira(l(14.2), 3700, 800, 1.5), mira(l(16.0), 3720, 810, 1.58, { curva: "inout" }), mira(l(16.9), 3730, 810, 1.62)]}
      medio={<>
        <A look={MARCUS_VERANO} ruta={[{ f: 0, x: 3640, y: Y }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: l(15.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.6, y: 0.6 } }, { f: l(15.6), v: { x: 0.7, y: -0.3 } }]}
          poses={[{ f: 0, v: "parado" }, { f: l(13.7), v: "arrodillado" }, ...gestos(l(14.1), l(15.4), [cava, cava2], 7), { f: l(15.5), v: alza }]}
          enManoD={enMano ? <Papa x={0} y={0} s={2.3} rot={-20} /> : undefined} />
        <Nube x={3770} y={Y + 10} f={f} n={5} ancho={60} alto={70} deriva={30} r0={8} color="#7a5a3a" opac={0.6} />
      </>}
      hud={<><Past x={1240} y={105} w={1020} h={118} desde={l(15.6)} /><Rotulo texto="OUT OF THE GROUND" x={1240} y={118} centro desde={l(15.6)} color="#ffcf6e" tam={76} /></>} />
  );
};

// ---------- E5 · 16:9-22:9 · los 10 frente al campo pelado; cada uno se rasca / se encoge; la pregunta en el cielo ----------
const Q05: React.FC = () => {
  const f = useF();
  const l = loc(16.9);
  // NO es la fila de E01: dos profundidades (adultos atrás escalonados, los mellizos adelante mirando los «?»), cámara que
  // entra en curva al centro. Cada uno hace SU gesto: Gus se encoge de hombros (19.9), Theo se rasca la cabeza (20.9),
  // June mira a Marcus, Rosa se cruza de brazos, los mellizos señalan arriba.
  const rasca = { hD: 150, cD: 125, tronco: 3 };
  const pos = [[2700, 0], [2860, 1], [3020, 0], [3180, 1], [3340, 0], [3500, 1], [3660, 0], [3820, 1], [3130, 2], [3330, 2]]; // [x, fila]
  const yF = (r: number) => (r === 1 ? Y - 46 : r === 2 ? Y + 70 : Y);
  const eF = (r: number, i: number) => (esNino(i) ? NINO * 1.15 : r === 1 ? 0.9 : 1);
  const listas: Pz[][] = [["manosCintura", "pensar"], [rasca, "parado"], ["pensar", "manosCintura"], ["brazosCruzados", "encogerse"], ["brazosCruzados", "manosCara"], ["manosCintura", rasca], ["pensar", "encogerse"], ["manosCara", "brazosCruzados"], ["señalar", "parado"], ["señalar", "encogerse"]];
  const gesto = (i: number): { f: number; v: Pz }[] => {
    if (i === 3) return [{ f: 0, v: "brazosCruzados" }, { f: l(19.9), v: "encogerse" }, { f: l(20.4), v: "manosCintura" }, { f: l(20.8), v: "encogerse" }, ...ciclo(l(21.3), l(22.9), ["brazosCruzados", "pensar"], 22)];
    if (i === 1) return [{ f: 0, v: "manosCintura" }, { f: l(20.9), v: rasca }, { f: l(21.2), v: { ...rasca, cD: 140 } }, { f: l(21.5), v: rasca }, { f: l(21.8), v: { ...rasca, cD: 140 } }, { f: l(22.2), v: "pensar" }];
    if (i >= 8) return [{ f: 0, v: "parado" }, { f: l(18.0) + (i - 8) * 6, v: "señalar" }, ...ciclo(l(19.4) + (i - 8) * 6, l(22.9), listas[i], 20)];
    return [{ f: 0, v: "parado" }, ...ciclo(l(17.4) + i * 9, l(22.9), listas[i], 18 + (i % 3) * 4, i * 5)];
  };
  return (
    <Escena Set={Granja} pal={PAL} seed={44} setProps={{ hora: "dia", estacion: "barro", crec: 0, humo: 0.6 }}
      claves={camino([[-12, 3200, 600, 0.98], [l(19.0), 3240, 630, 1.1], [l(21.2), 3270, 670, 1.26], [l(22.9) + 12, 3285, 690, 1.36]])}
      medio={<>{pos.map(([x, r], i) => { const k = ap(f, l(17.8) + i * 6, 8); if (k <= 0) return null; const pop = 1 + 0.5 * Math.max(0, 1 - k * 1.6); const e = eF(r, i); const y = yF(r) - (esNino(i) ? 250 * e : 365 * e) - 50 + Math.sin(f / 7 + i) * 6;
        return <text key={`q${i}`} x={x} y={y} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={60 * pop} fill={i % 2 ? "#ffcf6e" : "#f6ecd2"} stroke="#1c1416" strokeWidth={9} paintOrder="stroke" opacity={k}>?</text>; })}
        {[1, 3, 5, 7, 0, 2, 4, 6, 8, 9].map((i) => { const [x, r] = pos[i]; return <A key={i} look={LOS10[i]} escala={eF(r, i)} seed={i * 7} ruta={[{ f: 0, x, y: yF(r) }, { f: l(22.9) + 30, x: x + (i % 2 ? 14 : -10), y: yF(r) }]} dir={[{ f: 0, v: x < 3260 ? 1 : -1 }]}
          caras={[{ f: 0, v: i === 0 ? "determinado" : "duda" }, { f: l(20.0) + i * 3, v: i % 3 === 0 ? "cansado" : i === 3 ? "picaro" : "triste" }]}
          miradas={i >= 8 ? [{ f: 0, v: { x: 0.2, y: -0.9 } }] : [{ f: 0, v: { x: (i % 2 ? 0.8 : -0.6), y: 0.2 } }, { f: l(19.4) + i * 5, v: { x: (i % 3 - 1) * 0.7, y: -0.3 } }, { f: l(21.4), v: { x: i === 2 ? -0.9 : x < 3260 ? 0.7 : -0.7, y: 0.1 } }]}
          poses={gesto(i)} />; })}</>}
      hud={<Rotulo texto={"Can 10 people grow\na year of food?"} x={1240} y={110} centro desde={l(17.6)} color="#f6ecd2" tam={80} />} />
  );
};

// ---------- E6 · 23:0-28:0 · las 3 camionetas entran por el camino de tierra: polvo, y los 10 asoman saludando ----------
const Asomado: React.FC<{ f: number; k: number; pelo: string; camisa?: string }> = ({ f, k, pelo, camisa = "#c9604a" }) => {
  const a = Math.sin(f / 3 + k * 2) * 18;
  return (
    <g transform="translate(24,-84)">
      <rect x={-17} y={-6} width={34} height={64} rx={14} fill={camisa} stroke="#1c1416" strokeWidth={2} />
      <path d={`M-4,10 Q40,-20 ${46 + a},-60`} stroke="#e8c4a0" strokeWidth={9} fill="none" strokeLinecap="round" />
      <circle cx={46 + a} cy={-62} r={8} fill="#e8c4a0" />
      <circle r={17} fill="#e8c4a0" stroke="#1c1416" strokeWidth={2} /><path d="M-17,-2 Q0,-26 17,-2 Q0,-12 -17,-2 Z" fill={pelo} />
      <circle cx={5} cy={-1} r={2.4} fill="#1c1416" /><path d="M-2,7 Q5,12 11,6" stroke="#1c1416" strokeWidth={2.4} fill="none" />
    </g>
  );
};

const Q06: React.FC = () => {
  const f = useF();
  const l = loc(23.0);
  // la primera camioneta YA entra al cuadro 0 (x 300); las otras vienen detrás
  const X = (k: number) => interpolate(f, [0, l(27.0 + k * 0.4)], [300 - k * 640, 1750 - k * 700], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - (1 - t) * (1 - t) });
  const SC = 2.0, YY = P + 200;
  const cols = ["#2f4a5e", "#6a2f36", "#c9b48a"], pelos = ["#241612", "#8a5a2a", "#d8c8a0"], camisas = ["#c9604a", "#4a8ac9", "#e0b84a"];
  return (
    <Escena Set={Granja} pal={PAL} seed={45} setProps={{ hora: "dia", estacion: "barro", crec: 0, humo: 1 }}
      claves={[mira(0, 500, 720, 1.0), mira(l(28.0), 1150, 740, 1.0, { curva: "inout" })]}
      detras={<>{[0, 1, 2].map((k) => <Nube key={k} x={X(k) - 180} y={YY - 6} f={f + k * 9} n={16} ancho={200} alto={130} deriva={-160} r0={20} color="#cdb894" opac={0.85} seed={k} />)}</>}
      frente={<>{[0, 1, 2].map((k) => <g key={k}>
        <Auto x={X(k)} y={YY} color={cols[k]} tipo="pickup" s={SC} dir={1} />
        <g transform={`translate(${X(k)},${YY}) scale(${SC})`}><g transform="scale(1.5) translate(-8,10)"><Asomado f={f} k={k} pelo={pelos[k]} camisa={camisas[k]} /></g></g>
        <Nube x={X(k) + 150} y={YY + 20} f={f + k * 5} n={7} ancho={40} alto={60} deriva={-70} r0={12} color="#cdb894" opac={0.7} seed={k + 5} />
      </g>)}</>}
      hud={<><Past x={1240} y={110} w={900} h={104} desde={l(23.6)} /><Rotulo texto="DAY 201 · ARRIVAL" x={1240} y={120} centro desde={l(23.6)} color="#ffcf6e" tam={72} /></>} />
  );
};

// ---------- E7 · 28:0-31:5 · travelling: el contorno de «40 ACRES» se dibuja sobre el campo; alguien señala el cartel ----------
const Q07: React.FC = () => {
  const f = useF();
  const l = loc(28.0);
  const pop = 0.55 + 0.45 * Math.min(1, ap(f, l(28.2), 10)) + (f > l(28.2) ? 0.14 * Math.max(0, 1 - Math.abs(f - l(28.5)) / 6) : 0);
  const pop2 = 0.5 + 0.5 * ap(f, l(30.85), 8) + 0.2 * Math.max(0, 1 - Math.abs(f - l(31.2)) / 6) * (f > l(30.85) ? 1 : 0);
  const trazo = ap(f, l(28.3), 84);
  const th = interpolate(f, [0, l(29.4), l(31.5)], [-400, -40, 520], cl);
  return (
    <Escena Set={Granja} pal={PAL} seed={46} setProps={{ hora: "dia", estacion: "barro", crec: 0, humo: 1 }}
      claves={camino([[-10, -420, 650, 1.15], [l(29.4), 200, 610, 1.05], [l(31.5) + 10, 1290, 560, 0.95]])}
      medio={<>
        {/* un solo «40 ACRES» a la vez: el cartel del lindero aparece cuando el contador llega a 40 (y el contador se va) */}
        <Cartel40 x={1880} pop={f > l(30.85) ? pop2 : 0} />
        <path d={`M-220,${P + 18} L2500,${P + 18} L2500,${P + 120} L-220,${P + 120} Z`} fill="none" stroke="#ffcf6e" strokeWidth={18} pathLength={1000} strokeLinecap="round" style={{ strokeDasharray: `${44 * Math.round(10 * trazo)} 1000` }} opacity={0.95} />
        {[[-220, P + 18], [2500, P + 18], [2500, P + 120], [-220, P + 120]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={22 * ap(f, l(28.3) + i * 14, 8)} fill="#f2c14a" stroke="#1c1416" strokeWidth={4} />)}
        <A look={THEO} escala={1.45} ruta={[{ f: -10, x: -420, y: Y }, { f: l(29.4), x: -40, y: Y, curva: "lineal" }, { f: l(31.5) + 10, x: 600, y: Y, curva: "lineal" }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.3 } }, { f: l(29.4), v: { x: 0.8, y: 0 } }]}
          poses={[{ f: 0, v: "señalar" }, ...gestos(l(28.4), l(29.3), ["señalar", "hablar", "señalar"], 20), ...gestos(l(30.0), l(31.5), ["hablar", "señalar", "manosCintura"], 20)]} />
      </>}
      hud={<Num x={1240} y={130} desde={l(28.6)} hasta={l(31.0)} f0={l(28.8)} f1={l(30.7)} v0={0} v1={40} suf=" ACRES" tam={96} />} />
  );
};

// ---------- E8 · 31:5-34:0 · Dev golpea la rueda y el tractor rebota: 1974 → 20 años ----------
const Q08: React.FC = () => {
  const f = useF();
  const l = loc(31.5);
  // Dev palmea la rueda delantera a los 1,8 s (y otra vez a los 2,2 s): el tractor rebota ~6 px
  const tP = l(33.3), tP2 = l(33.7);
  const rebote = golpeSuave(f, tP) + 0.6 * golpeSuave(f, tP2);
  return (
    <Escena Set={Granja} pal={PAL} seed={47} setProps={{ hora: "dia", estacion: "barro", crec: 0 }}
      claves={[mira(0, 2160, 650, 1.35), mira(l(34.0), 2170, 650, 1.42)]}
      medio={<>
        <Tractor x={2000 + rebote * 0.6} y={Y - Math.abs(rebote) * 0.8} s={1.1} />
        <A look={DEV} escala={1.2} ruta={[{ f: 0, x: 2330, y: Y }, { f: l(32.6), x: 2185, y: Y }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "duda" }, { f: l(32.3), v: "picaro" }, { f: tP + 2, v: "risa" }]}
          giros={[{ f: 0, v: -0.6 }, { f: l(32.0), v: 0.8 }, { f: l(32.7), v: -0.5 }]} miradas={[{ f: 0, v: { x: -0.7, y: 0 } }, { f: l(32.0), v: { x: 0.6, y: -0.1 } }, { f: l(32.7), v: { x: -0.8, y: 0.3 } }]}
          poses={[{ f: 0, v: "manosCintura" }, { f: l(31.9), v: "señalar" }, { f: l(32.4), v: "hablar" }, { f: tP - 7, v: { hD: 150, cD: 30, tronco: -2 } }, { f: tP, v: { hD: 8, cD: 0, tronco: 34, cabeza: -12 } }, { f: tP2 - 5, v: { hD: 110, cD: 25, tronco: 14 } }, { f: tP2, v: { hD: 8, cD: 0, tronco: 34, cabeza: -12 } }, { f: tP2 + 7, v: "manosCintura" }]} />
        <Nube x={2200} y={Y + 6} f={f} n={4} ancho={50} alto={40} deriva={30} r0={6} opac={0.4} />
      </>}
      hud={<>
        <Past x={1240} y={105} w={760} h={104} desde={l(31.8)} /><Rotulo texto="OLDER THAN DEV" x={1240} y={118} centro desde={l(31.8)} color="#ffcf6e" tam={72} />
        <BarraHud x={1580} y={330} w={460} k={0.42 * ap(f, l(32.4), 18)} desde={l(32.3)} color="#9bd8ff" rotulo="DEV" />
        <BarraHud x={1580} y={460} w={460} k={0.97 * ap(f, l(32.8), 26)} desde={l(32.7)} color="#7cd36a" rotulo="TRACTOR" />
      </>} />
  );
};

// ---------- E9 · 34:0-37:5 · Marcus carga fardos y la pila crece; recuerdo de 20 años de heno y choclo ----------
const Q09: React.FC = () => {
  const f = useF();
  const l = loc(34.0);
  const rec = ap(f, l(34.6), 14) * (1 - ap(f, l(37.0), 10));
  // ciclo CONTINUO de 30 cuadros (arranca a mitad de camino: Marcus YA tiene el fardo en el cuadro 0):
  // 0-9 levanta el fardo · 9-13 lo lanza · 13-25 el fardo vuela en arco a la pila y rebota · 22-30 se agacha por el siguiente
  const PER = 30, OFF = 6;
  const cyc = (ff: number) => Math.floor((ff + OFF) / PER), ph = (ff: number) => fase(ff, PER, OFF) * PER;
  const XM = 2330, PX = 2520, PY = Y - 58;
  const apilados = Math.max(0, Math.min(9, cyc(f - 25) + 1)); // el fardo cuenta cuando aterriza
  const slot = (i: number) => { const fila = i < 3 ? 0 : i < 5 ? 1 : 2, col = fila === 0 ? i : fila === 1 ? i - 3 + 0.5 : 1; return { x: PX + col * 124 + 59, y: PY - fila * 62 + 29 }; };
  const bale = <g transform="translate(-4,-18)"><rect x={-40} y={-26} width={80} height={44} rx={9} fill="#e2c060" stroke="#a78428" strokeWidth={4} /><path d="M-14,-26 L-14,18 M14,-26 L14,18" stroke="#a78428" strokeWidth={3} /></g>;
  const vuela = ph(f) >= 13 && ph(f) < 25 ? (() => { const u = (ph(f) - 13) / 12, d = slot(Math.min(8, cyc(f))), x0 = XM + 70, y0 = Y - 330; return { x: x0 + (d.x - x0) * u, y: y0 + (d.y - y0) * u - 160 * Math.sin(u * Math.PI), r: u * 200 }; })() : null;
  const poses: { f: number; v: any }[] = [];
  for (let c = -1; c * PER - OFF < l(37.5) + 30; c++) { const b = c * PER - OFF; poses.push({ f: b, v: "agacharse" }, { f: b + 4, v: "agarrarAlto" }, { f: b + 10, v: "tirarCarga" }, { f: b + 13, v: "tirarSuelta" }, { f: b + 22, v: "agacharse" }); }
  return (
    <Escena Set={Granja} pal={PAL} seed={48} setProps={{ hora: "dia", estacion: rec > 0.5 ? "verano" : "barro", crec: rec > 0.5 ? 1 : 0 }}
      claves={camino([[-10, 2290, 705, 1.38], [l(35.8), 2340, 700, 1.43], [l(37.5) + 10, 2400, 690, 1.5]])}
      medio={<>
        <PilaFardos x={PX} y={PY} n={apilados} t={ph(f) - 25 + (ph(f) < 25 ? PER : 0)} />
        {/* pila de origen a la izquierda (de donde saca los fardos) */}
        {[0, 1, 2].map((i) => <g key={i} transform={`translate(${XM - 230 + i * 70},${Y - 30 - (i === 1 ? 44 : 0)})`}><rect x={-44} y={-26} width={88} height={48} rx={9} fill="#d8b456" stroke="#a78428" strokeWidth={4} /></g>)}
        <Tractor x={1980} y={Y} s={1.1} />
        <A look={MARCUS_VERANO} escala={1.1} ruta={[{ f: 0, x: XM, y: Y }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }]} miradas={[{ f: 0, v: { x: 0.6, y: 0.1 } }]}
          poses={poses} enManoD={(ff: number) => (ph(ff) < 13 ? bale : null)} />
        {vuela && <g transform={`translate(${vuela.x},${vuela.y}) rotate(${vuela.r})`}>{bale}</g>}
        <Nube x={2420} y={Y + 8} f={f} n={4} ancho={70} alto={40} deriva={30} r0={7} opac={0.4} />
      </>}
      hud={<><Past x={1240} y={105} w={900} h={104} desde={4} hasta={l(37.5) + 6} /><Rotulo texto="HAY & SWEET CORN" x={1240} y={118} centro desde={4} color="#ffcf6e" tam={64} />
        <Num x={1500} y={250} desde={l(34.8)} f0={l(34.9)} f1={l(36.8)} v0={0} v1={20} suf=" YEARS" tam={90} /></>} />
  );
};

// ---------- E10 · 37:5-40:5 · Marcus gira la cabeza hacia los 10 que bajan de las camionetas (todos en cuadro) ----------
const Q10: React.FC = () => {
  const l = loc(37.5);
  const f = useF();
  const abre = { hD: 98, cD: 8, hI: 98, cI: 8, tronco: -3 };
  return (
    <Escena Set={Granja} pal={PAL} seed={49} setProps={{ hora: "dia", estacion: "barro", crec: 0, humo: 1 }}
      claves={camino([[-10, 2650, 650, 1.28], [l(39.2), 2690, 640, 1.31], [l(40.5) + 10, 2720, 630, 1.36]])}
      medio={<>
        {[0, 1].map((k) => <Auto key={k} x={3300 + k * 520} y={P + 30} color={["#2f4a5e", "#6a2f36"][k]} tipo="pickup" s={1.2} dir={1} />)}
        <Nube x={3500} y={P + 36} f={f} n={6} ancho={120} alto={60} deriva={-90} r0={12} color="#cdb894" opac={0.5} />
        <Grupo x0={2300} paso={105} solo={[1, 2, 3, 4, 5, 6, 7, 8, 9]} extra={(i) => ({ ruta: [{ f: 0, x: 2440 + (i - 1) * 105 + 200, y: Y - 10 }, { f: l(39.4), x: 2440 + (i - 1) * 105, y: Y - 10 }], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "cansado" }],
          poses: [{ f: 0, v: "parado" }, ...gestos(l(39.4), l(40.5), i % 2 ? ["encogerse", "parado"] : ["saludar", "manosCintura"], 16)] })} escala={1.12} />
        <A look={MARCUS_VERANO} escala={1.1} ruta={[{ f: 0, x: 2110, y: Y }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "duda" }, { f: l(39.0), v: "determinado" }]}
          giros={[{ f: 0, v: -0.8 }, { f: l(38.2), v: 0.9 }]} miradas={[{ f: 0, v: { x: -0.6, y: 0.1 } }, { f: l(38.2), v: { x: 0.9, y: 0 } }]}
          poses={[{ f: 0, v: "brazosCruzados" }, { f: l(38.4), v: "manosCintura" }, { f: l(38.9), v: abre }, { f: l(39.9), v: "manosCintura" }]} />
      </>}
      hud={<><Past x={1240} y={918} w={1100} h={104} desde={l(38.8)} /><Rotulo texto="NOBODY HAS. NOT AROUND HERE." x={1240} y={930} centro desde={l(38.8)} color="#f6ecd2" tam={56} brillo={false} />
        <MapaPin x={1330} y={40} w={480} desde={l(37.8)} rotulo="10 FED HERE: NEVER" /></>} />
  );
};

// ---------- E11 · 40:5-43:5 · la foto vieja de la granja: siluetas que parpadean en sepia; el contador cuenta años hacia atrás ----------
const Q11: React.FC = () => {
  const f = useF();
  const l = loc(40.5);
  // la foto ENTRA con resorte (cae y se asienta), después Ken Burns lento 1.0 → 1.08; Marcus se acerca y golpea el marco
  // dos veces con el nudillo en «not for 100 years»
  const ent = spring({ frame: f - 2, fps: 30, config: { damping: 11, stiffness: 120 } });
  const kb = interpolate(f, [10, l(43.5) + 10], [1.0, 1.08], cl);
  const fy = 500 - (1 - ent) * 700, sc = 1.85 * kb;
  const golpe = { hD: 72, cD: 40, tronco: 6, hI: 20, cI: 30 }, atras = { hD: 92, cD: 70, tronco: 2, hI: 20, cI: 30 };
  const g0 = l(41.1);
  return (
    <Escena Set={Primer} pal={PAL} seed={50} setProps={{ fondo: "pared", luz: "#ffb46a" }}
      claves={camino([[-10, 940, 545, 1.0], [l(41.6), 900, 550, 1.06], [l(43.5) + 10, 960, 545, 1.12]])}
      medio={<>
        <g transform={`rotate(${(1 - ent) * -8} 930 ${fy})`}><FotoVieja x={930} y={fy} s={sc} />
        <g transform={`translate(930,${fy}) scale(${sc})`}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => { const o = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(f / 5 + i * 1.9)); const bx = -170 + i * 56, sw = Math.sin(f / 9 + i) * 1.6; return <g key={i} opacity={o} transform={`translate(${bx + sw},${44 + (i % 2) * 6})`}>
            <circle r={12} cy={-6} fill="#3a2814" /><rect x={-10} y={4} width={20} height={52} rx={8} fill="#3a2814" /><rect x={-14} y={8} width={28} height={8} rx={4} fill="#3a2814" transform={`rotate(${Math.sin(f / 7 + i) * 8})`} />
          </g>; })}
          <rect x={-205} y={-145} width={410} height={290} fill="#c9a06a" opacity={0.18 + 0.1 * Math.sin(f / 6)} />
        </g></g>
        <A look={MARCUS_VERANO} escala={1.5} ruta={[{ f: 0, x: 220, y: 995 }, { f: g0 - 4, x: 380, y: 995 }, { f: l(42.6), x: 370, y: 995 }, { f: l(43.5) + 20, x: 320, y: 995 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "duda" }, { f: l(41.4), v: "determinado" }]} miradas={[{ f: 0, v: { x: 0.8, y: -0.3 } }]}
          poses={[{ f: 0, v: "brazosCruzados" }, { f: g0 - 10, v: atras }, { f: g0, v: golpe }, { f: g0 + 6, v: atras }, { f: g0 + 12, v: golpe }, { f: g0 + 18, v: atras }, { f: l(42.0), v: "señalar" }, ...gestos(l(42.4), l(43.5) + 30, ["hablar", "manosCintura"], 22)]} />
      </>}
      hud={<>
        <Cartel texto="NOT FOR 100 YEARS" x={1180} y={905} desde={l(40.8)} color="#ffcf6e" tam={76} />
        <Num x={1650} y={300} desde={l(40.6)} f0={l(40.8)} f1={l(43.2)} v0={0} v1={100} coma={false} tam={150} color="#e8c88a" rotulo="YEARS BACK" />
      </>} />
  );
};

// mesa larga de la cocina con los 10 sentados (opcional: Marcus de pie en la cabecera)
const SENT = { tronco: 6, pI: 88, rI: 88, pD: 92, rD: 92, hD: 50, cD: 70 };
const MesaLarga: React.FC<{ f: number; marcusDePie?: number; levanta?: number; caras?: (i: number) => string; acciones?: (i: number) => { f: number; v: any }[]; piramide?: boolean; giran?: number; abrelatas?: boolean; latasN?: number; cuchara?: boolean; lug?: number[][]; ninosX?: number[]; marcusPoses?: { f: number; v: any }[]; cuencos?: boolean }> = ({ f, marcusDePie, levanta, caras, acciones, piramide, giran, abrelatas, latasN = 9, cuchara, lug, ninosX = [380, 300], marcusPoses, cuencos }) => {
  const PS = COCINA_PISO;
  const lugares = lug ?? [[1880, -1], [520, 1], [700, 1], [880, 1], [1060, 1], [1240, -1], [1420, -1], [1600, -1], [1000, 1], [1300, -1]];
  const xk = levanta !== undefined ? interpolate(f, [levanta + 4, levanta + 26], [0, 1], cl) : 1;
  const pA = Math.max(0, Math.min(1, xk * 2)), pB = Math.max(0, Math.min(1, xk * 2 - 1));
  const lataEnMano = levanta !== undefined && f >= levanta - 24;
  // poses de Marcus de pie con CLAVES (resorte), nunca un valor recalculado por cuadro (eso daba tirones)
  const posesPie = marcusPoses ?? (levanta === undefined ? [{ f: 0, v: "parado" }] : [{ f: 0, v: "parado" }, { f: levanta - 24, v: { hD: 105, cD: 30 } }, { f: levanta, v: { hD: 88, cD: 62 } }]);
  return (
    <>
      {[560, 760, 960, 1180, 1380, 1580].map((sx, i) => <Silla key={i} x={sx} piso={PS} dir={i < 3 ? 1 : -1} color="#b07a4a" />)}
      {(marcusDePie === undefined || f < marcusDePie) && <Silla x={1860} piso={PS} dir={-1} color="#b07a4a" />}
      {LOS10.map((look, i) => {
        if (i >= 8) return null;
        const [x, d] = lugares[i];
        const dePie = i === 0 && marcusDePie !== undefined && f >= marcusDePie;
        const poses = acciones && !dePie ? acciones(i) : dePie ? posesPie : [{ f: 0, v: SENT }];
        return <A key={i} look={look} seed={i * 3} ruta={[{ f: 0, x, y: PS }]} dir={[{ f: 0, v: d as 1 | -1 }]} asiento={dePie ? undefined : [{ f: 0, v: 104 }]}
          poses={poses}
          caras={[{ f: 0, v: (caras ? caras(i) : "neutral") as never }]} miradas={[{ f: 0, v: { x: i === 0 ? -0.8 : d * 0.6, y: 0.2 } }, ...(giran !== undefined && i > 0 ? [{ f: giran + i * 3, v: { x: x < 1880 ? 0.95 : -0.95, y: -0.1 } }] : [])]}
          enManoD={cuchara && i > 0 ? <g transform="rotate(160) scale(1.6)"><rect x={-3} y={-4} width={6} height={44} rx={3} fill="#c9cfd6" stroke="#4a4a52" strokeWidth={2} /><ellipse cx={0} cy={46} rx={9} ry={12} fill="#c9cfd6" stroke="#4a4a52" strokeWidth={2} /></g> : i === 0 && lataEnMano ? <g><Lata s={2.2} color="#e0563a" /><g transform="translate(0,-14) scale(1.9)">
            {[["M-14,-12 L14,16", pA], ["M14,-12 L-14,16", pB]].map(([d2, p], j) => (p as number) > 0 ? <g key={j}><path d={d2 as string} pathLength={1} strokeDasharray={`${p} 1`} stroke="#1c1416" strokeWidth={9} strokeLinecap="round" fill="none" /><path d={d2 as string} pathLength={1} strokeDasharray={`${p} 1`} stroke="#e23a2e" strokeWidth={5} strokeLinecap="round" fill="none" /></g> : null)}</g></g> : undefined} />;
      })}
      {/* mellizos de pie al costado, más chicos */}
      <A look={BEN} escala={NINO} ruta={[{ f: 0, x: ninosX[0], y: PS }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "feliz" }]} enManoD={<Lata s={0.8} />} poses={acciones ? gestos(0, 1200, ["celebrar", "parado"], 26) : undefined} />
      <A look={LILY} escala={NINO} ruta={[{ f: 0, x: ninosX[1], y: PS }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "feliz" }]} poses={acciones ? gestos(0, 1200, ["parado", "saludar"], 22) : undefined} />
      <rect x={480} y={PS - 190} width={1340} height={22} rx={6} fill="#8a5e3c" />
      <rect x={500} y={PS - 168} width={16} height={168} fill="#6a4a32" /><rect x={1784} y={PS - 168} width={16} height={168} fill="#6a4a32" />
      {cuencos && lugares.slice(1, 8).map(([x, d], j) => <g key={`c${j}`} transform={`translate(${x + d * 62},${PS - 214})`}><path d="M-34,-4 Q-30,26 0,28 Q30,26 34,-4 Z" fill="#f2e6cf" stroke="#1c1416" strokeWidth={4} /><ellipse cx={0} cy={-4} rx={34} ry={8} fill="#c8763a" stroke="#1c1416" strokeWidth={3} />{[0, 1, 2].map((k) => <path key={k} d={`M${-12 + k * 12},${-16 - ((f + j * 9 + k * 7) % 30)} q6,-8 0,-16`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.5 * (1 - ((f + j * 9 + k * 7) % 30) / 30)} />)}</g>)}
      {Array.from({ length: 9 }).map((_, i) => { if (i >= latasN) return null; const pop = latasN < 9 && i === latasN - 1 ? 1.25 : 1; return <Lata key={i} x={560 + i * 140} y={PS - 190} s={0.8 * pop} color={["#e0563a", "#f1c24a", "#5aa0d8", "#7fc46a"][i % 4]} />; })}
      {/* pirámide de latas en el hueco entre dos comensales (no tapa ninguna cara) */}
      {piramide && [[0, 0], [1, 0], [2, 0], [0.5, 1], [1.5, 1], [1, 2]].map(([c, r], i) => <Lata key={i} x={1112 + c * 38} y={PS - 190 - 8 - r * 40} s={1.0} color={["#e0563a", "#f1c24a", "#5aa0d8"][i % 3]} />)}
      {abrelatas && <g>
        <Lata x={1730} y={PS - 190} s={1.5} color="#e0563a" />
        <g transform={`translate(1730,${PS - 190 - 98})`}><circle r={15} fill="#c9cfd6" stroke="#1c1416" strokeWidth={4} /><g transform={`rotate(${f * 16})`}><rect x={-4} y={-38} width={8} height={38} fill="#6a6a72" /><circle cy={-40} r={10} fill="#d8382c" stroke="#1c1416" strokeWidth={3} /></g></g>
      </g>}
      <Halo x={1150} y={PS - 520} r={700} color="#ffcf8a" fuerza={0.4} />
    </>
  );
};
const comer = (i: number) => {
  const mano = { ...SENT, hD: 28, cD: 150, cabeza: -4, tronco: 2 }, plato = { ...SENT, hD: 64, cD: 30, tronco: 12, cabeza: 10 };
  return gestos((i * 7) % 20, 1500, [plato, mano], 16);
};

// ---------- E12 · 43:5-47:0 · cámara 2x sobre tres comensales: la cuchara a la boca; las latas apiladas al centro con contador ----------
const Q12: React.FC = () => {
  const f = useF();
  const l = loc(43.5);
  const abre = (i: number) => (i === 0 ? gestos(0, 1500, [{ ...SENT, hD: 55, cD: 95, hI: 50, cI: 100, tronco: 10 }, { ...SENT, hD: 78, cD: 70, hI: 70, cI: 82, tronco: 6 }], 10) : comer(i));
  // las latas aparecen sobre la mesa de a una (sin contador: lo cuentan las latas mismas); cada uno COME de su cuenco
  const nLatas = Math.min(9, Math.max(0, Math.floor(interpolate(f, [l(44.4), l(46.2)], [0, 9.99], cl))));
  return (
    <Escena Set={Cocina} pal={PAL} seed={51} claves={camino([[-10, 1120, 600, 1.0], [l(45.0), 1080, 620, 1.1], [l(47.0) + 10, 1140, 615, 1.18]])}
      medio={<MesaLarga f={f} caras={(i) => (i % 2 ? "feliz" : "neutral")} acciones={abre} abrelatas latasN={nLatas} cuchara cuencos ninosX={[400, 330]} />}
      hud={<>
        <Past x={1240} y={105} w={1060} h={96} desde={l(44.8)} /><Rotulo texto="NOT GOING TO STARVE THIS YEAR" x={1240} y={118} centro desde={l(44.8)} color="#7cd36a" tam={52} />
      </>} />
  );
};

// el Supermercado sin el carrito vacío de primer término (se cruzaba con la protagonista y su propio carro)
const SuperSinCarro: React.FC<any> = (p) => (p.capa === "frente" ? null : <Supermercado {...p} />);

// ---------- E13 · 47:0-50:2 · recuerdo: las góndolas de Duluth siguen llenas; una clienta empuja el carrito lleno («STILL FULL») ----------
const Q13: React.FC = () => {
  const f = useF();
  const l = loc(47.0);
  const X = interpolate(f, [0, l(50.2)], [820, 2060], cl);
  return (
    <Escena Set={SuperSinCarro} pal={PAL} seed={52} claves={[mira(0, 1100, 640, 1.75), mira(l(50.2), 2120, 640, 1.8, { curva: "inout" })]}
      medio={<>
        {/* el cartel de precio del Set queda tapado: el guion no da precios («still full of canned food») */}
        <rect x={2260} y={SUPER_PISO - 380} width={180} height={50} rx={6} fill="#ffcf3a" />
        <text x={2350} y={SUPER_PISO - 344} fontFamily={F_HUD} fontWeight={600} fontSize={30} fill="#7a2016" textAnchor="middle">CANS</text>
        <Carrito x={X + 230} y={SUPER_PISO} dir={1} lleno={ap(f, l(48.4), 60)} rueda={X * 0.5} />
        <A look={PRIYA} ruta={[{ f: 0, x: 820, y: SUPER_PISO }, { f: l(50.2), x: 2060, y: SUPER_PISO, curva: "lineal" }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "empujar" }]} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.8, y: -0.1 } }]} />
      </>}
      hud={<>
        <Past x={1240} y={105} w={900} h={104} desde={l(47.6)} /><Rotulo texto="CANS · RICE · PASTA" x={1240} y={118} centro desde={l(47.6)} color="#ffcf6e" tam={70} />
        <Cartel texto="STILL FULL" x={1000} y={236} desde={l(49.0)} color="#ff6a4a" tam={100} />
      </>} />
  );
};

// ---------- E14 · 50:2-57:5 · Marcus se para en la cabecera, levanta una lata (zoom a la lata con X): «The cans are not food.» ----------
const Q14: React.FC = () => {
  const f = useF();
  const l = loc(50.2);
  // Marcus se para, levanta la lata (la X se dibuja), la sostiene (se balancea apenas) y la GOLPEA contra la mesa en «not food»
  const lv = l(53.8), gp = l(56.55);
  const alto = { hD: 88, cD: 62 }, alto2 = { hD: 84, cD: 68, tronco: 2 };
  const mp = [{ f: 0, v: "parado" }, { f: lv - 24, v: { hD: 105, cD: 30 } }, { f: lv, v: alto }, ...gestos(lv + 20, gp - 14, [alto2, alto], 22),
    { f: gp - 8, v: { hD: 112, cD: 30, tronco: -4 } }, { f: gp, v: { hD: 40, cD: 24, tronco: 16 } }, { f: gp + 7, v: { hD: 58, cD: 30, tronco: 10 } }, { f: gp + 16, v: "manosCintura" }];
  return (
    <Escena Set={Cocina} pal={PAL} seed={53}
      claves={camino([[-10, 1330, 600, 1.05], [l(51.0), 1380, 600, 1.1], [l(53.4), 1880, 590, 1.55], [l(57.5) + 10, 1890, 585, 1.7]])}
      medio={<MesaLarga f={f} marcusDePie={l(50.8)} levanta={lv} marcusPoses={mp} giran={l(54.0)} caras={(i) => (i === 0 ? "determinado" : "duda")} acciones={(i) => gestos(0, 1500, i % 2 ? [SENT, { ...SENT, hD: 70, cD: 100 }] : [{ ...SENT, hD: 70, cD: 100 }, SENT], 36 + i * 3)} />}
      hud={<Globo texto="The cans are not food." x={1100} y={400} desde={l(55.0)} hasta={l(57.5)} cola="der" tam={76} />} />
  );
};

// ---------- E15 · 57:5-64:0 · la pila de latas se vuelve reloj de arena; caen de a una; Marcus lo da vuelta; CANS = TIME · A FEW YEARS (sin contador) ----------
const Q15: React.FC = () => {
  const f = useF();
  const l = loc(57.5);
  const k = interpolate(f, [l(58.6), l(63.8)], [0, 0.85], cl);
  const u = ap(f, 8, 30), e = u * u * (3 - 2 * u);
  return (
    <Escena Set={Primer} pal={PAL} seed={54} setProps={{ fondo: "madera" }}
      claves={camino([[-10, 1060, 570, 1.12], [l(59.9), 1110, 565, 1.2], [l(64.0) + 10, 1150, 560, 1.28]])}
      medio={<>
        <g transform={`rotate(${180 * (1 - e)} 900 540)`}><RelojLatas x={900} y={540} s={0.95} k={k} f={f} /></g>
        {/* Marcus DA VUELTA el reloj con las dos manos (0-1 s), camina a su lado, lo señala y al final cruza los brazos */}
        <A look={MARCUS_VERANO} escala={1.7} ruta={[{ f: 0, x: 1140, y: 1010 }, { f: 40, x: 1150, y: 1010 }, { f: l(59.9), x: 1400, y: 1010 }, { f: l(64.0) + 30, x: 1440, y: 1010 }]}
          dir={[{ f: 0, v: -1 }, { f: 40, v: 1 }, { f: l(59.9), v: -1 }]} caras={[{ f: 0, v: "determinado" }, { f: l(61.0), v: "duda" }, { f: l(62.8), v: "determinado" }]}
          miradas={[{ f: 0, v: { x: 0.6, y: 0.1 } }, { f: 40, v: { x: 0.8, y: 0 } }, { f: l(59.9), v: { x: 0.8, y: -0.1 } }]}
          poses={[{ f: 0, v: { tronco: 12, hD: 100, cD: 12, hI: 96, cI: 14, cabeza: -6 } }, { f: 38, v: { tronco: 12, hD: 100, cD: 12, hI: 96, cI: 14, cabeza: -6 } }, { f: 44, v: "parado" },
            { f: l(60.1), v: "señalar" }, { f: l(61.3), v: "pensar" }, { f: l(62.4), v: "manosCintura" }, { f: l(62.9), v: "brazosCruzados" }]} />
      </>}
      hud={<><Past x={1440} y={100} w={760} h={240} desde={l(58.0)} />
        <Rotulo texto="CANS = TIME" x={1440} y={112} centro desde={l(58.0)} color="#ffcf6e" tam={100} />
        <Rotulo texto="A FEW YEARS OF IT" x={1440} y={240} centro desde={l(59.4)} color="#f6ecd2" tam={56} brillo={false} /></>} />
  );
};

// ---------- E16 · 64:0-69:1 · los 10 se miran; Theo asiente dos veces (zoom 1.3 a Theo) ----------
const Q16: React.FC = () => {
  const f = useF();
  const l = loc(64.0);
  // Marcus DE PIE en la cabecera; Theo sentado a su lado (cambia de lugar con Nan); los mellizos detrás de Marcus.
  // «on purpose» (67.46): Marcus golpea la mesa con el dedo tres veces y Theo asiente dos veces
  const lug = [[1880, -1], [1600, -1], [700, 1], [880, 1], [1060, 1], [1240, -1], [1420, -1], [520, 1], [1000, 1], [1300, -1]];
  const t0 = l(67.3), dedoA = { hD: 52, cD: 26, tronco: 16, hI: 20, cI: 40 }, dedoB = { hD: 66, cD: 18, tronco: 12, hI: 20, cI: 40 };
  const mp = [{ f: 0, v: "manosCintura" }, ...gestos(l(64.6), t0 - 12, ["hablar", "manosCintura", "señalar", "hablar"], 20), { f: t0 - 6, v: dedoB },
    { f: t0, v: dedoA }, { f: t0 + 6, v: dedoB }, { f: t0 + 12, v: dedoA }, { f: t0 + 18, v: dedoB }, { f: t0 + 24, v: dedoA }, { f: t0 + 32, v: dedoB }, ...gestos(t0 + 44, l(69.1) + 30, ["brazosCruzados", "hablar"], 24)];
  const nod = (i: number) => {
    if (i !== 1) return gestos(0, 1500, i % 2 ? [SENT, { ...SENT, hD: 70, cD: 100 }] : [{ ...SENT, hD: 70, cD: 100 }, SENT], 40 + i * 3);
    const d = { ...SENT, cabeza: 18, tronco: 10 }, u = { ...SENT, cabeza: -4 };
    return [{ f: 0, v: SENT }, { f: t0 + 4, v: d }, { f: t0 + 11, v: u }, { f: t0 + 18, v: d }, { f: t0 + 25, v: u }, ...gestos(t0 + 40, l(69.1) + 30, [SENT, { ...SENT, hD: 70, cD: 100 }], 26)];
  };
  return (
    <Escena Set={Cocina} pal={PAL} seed={55} claves={camino([[-10, 1300, 620, 1.05], [l(65.5), 1560, 630, 1.3], [l(67.2), 1750, 630, 1.5], [l(69.1) + 10, 1780, 625, 1.56]])}
      medio={<MesaLarga f={f} marcusDePie={-99} marcusPoses={mp} lug={lug} ninosX={[2070, 2160]} cuencos caras={(i) => (i === 0 ? "determinado" : i === 1 && f > t0 ? "determinado" : i === 1 ? "feliz" : "duda")} acciones={nod} />}
      hud={<>
        <Past x={1240} y={105} w={1060} h={96} desde={l(65.0)} /><Rotulo texto="A FULL YEAR OF FOOD. ON PURPOSE." x={1240} y={118} centro desde={l(65.0)} color="#ffcf6e" tam={50} />
        <Num x={1600} y={230} desde={l(65.4)} f0={l(65.5)} f1={l(66.6)} v0={0} v1={365} suf=" DAYS" tam={86} rotulo="× 10 PEOPLE" />
      </>} />
  );
};

// ---------- E17 · 69:1-71:8 · día 240, fines de mayo: charcos con ranas y gotas, sale el sol, los días corren ----------
const Q17: React.FC = () => {
  const f = useF();
  const l = loc(69.1);
  const sy = interpolate(f, [0, l(71.8)], [720, 300], cl);
  return (
    <Escena Set={Granja} pal={PAL} seed={56} setProps={{ hora: "dia", estacion: "barro", crec: 0, humo: 0.4 }}
      claves={[mira(0, 3250, 700, 1.1), mira(l(71.8), 2750, 700, 1.15)]}
      detras={<><Halo x={3000} y={sy} r={620} color="#fff0a0" fuerza={0.7} /><circle cx={3000} cy={sy} r={64} fill="#fff2b0" /></>}
      medio={<>
        {[[2500, 150], [2950, 200], [3400, 170], [3850, 140]].map(([x, r], i) => <ellipse key={i} cx={x} cy={Y + 30 + (i % 2) * 20} rx={r} ry={22} fill="#8ab4d8" opacity={0.75} />)}
        <Charco x={3100} y={Y} rx={900} color="#fff3d6" fuerza={0.2} />
        <Ranas f={f} xs={[2560, 3000, 3440, 3880]} y={Y + 26} s={3} />
        <GotasCharco f={f} x={3000} y={Y + 40} n={3} />
        <Aves f={f} x0={2200} x1={4000} y={260} n={4} dur={110} />
        <A look={MARCUS_VERANO} escala={1.3} ruta={[{ f: 0, x: 3550, y: Y - 10 }, { f: l(71.8), x: 2650, y: Y - 10, curva: "lineal" }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "determinado" }]} miradas={[{ f: 0, v: { x: -0.8, y: 0.1 } }]} enManoD={<Lata s={1.3} color="#b8382c" />} />
      </>}
      hud={<><Rotulo texto="LATE MAY" x={1240} y={120} centro desde={l(69.6)} color="#f6ecd2" tam={72} />
        <Num x={1240} y={260} desde={l(69.4)} f0={l(69.5)} f1={l(71.5)} v0={201} v1={240} pre="DAY " tam={110} color="#ffcf6e" cubica /></>} />
  );
};

// ---------- E18 · 71:8-88:8 · el reloj del verano en la puerta del granero; Marcus pinta sin parar; el contador baja 240 → 115 ----------
const D = PUERTA_GRANERO;
const Q18: React.FC = () => {
  const f = useF();
  const l = loc(71.8);
  // Marcus pinta la línea del verano (72-81.8), da un paso atrás y la mira («110-120 days»), vuelve y pinta DAYS LEFT /
  // IN SUMMER / 115 (84.3-87.3); al final se aleja, mira la puerta y mete la brocha en el tarro. Sin contador 120→115:
  // el número lo PINTA él.
  const x0 = D.x + 26, x1 = D.x + D.w - 26, yb = D.y + 70;
  const sol = interpolate(f, [l(79.6), l(81.8)], [0, 1], cl);
  const copo = (x: number, a: number, t: string) => { const k = ap(f, a, 8); return k > 0 ? <g opacity={k} transform={`translate(${x},${yb - 30}) scale(${0.6 + 0.4 * k})`}>{[0, 60, 120].map((r) => <rect key={r} x={-2} y={-18} width={4} height={36} fill="#5a9ad8" transform={`rotate(${r})`} />)}<text y={44} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={28} fill="#2a1c18">{t}</text></g> : null; };
  const bx = D.x + D.w + 70;
  const pA = { hD: 105, cD: 22, tronco: 3 }, pB = { hD: 140, cD: 15, tronco: 1 }, bajo = { hD: 92, cD: 30, tronco: 4 }, bajo2 = { hD: 118, cD: 20, tronco: 2 };
  const meter = l(87.9);
  return (
    <Escena Set={Granja} pal={PAL} seed={57} mano={1.5}
      setProps={{ hora: "dia", estacion: "barro", crec: 0, pared: [{ t: "DAYS LEFT", desde: l(84.3), x: D.x + 30, y: D.y + 190, tam: 34, vel: 0.9 }, { t: "IN SUMMER", desde: l(85.0), x: D.x + 24, y: D.y + 232, tam: 34, vel: 0.9 }, { t: "115", desde: l(86.6), x: D.x + 56, y: D.y + 330, tam: 84, color: "#b8382c", vel: 1.6 }] }}
      claves={camino([[-10, D.x + 110, 600, 2.3], [l(76.6), D.x + 190, 575, 2.5], [l(79.4), D.x + 130, 580, 2.3], [l(82.6), D.x + 200, 610, 1.95], [l(84.6), D.x + 170, 640, 1.75], [l(86.8), D.x + 200, 650, 1.7], [l(88.8) + 10, D.x + 250, 655, 1.82]])}
      medio={<>
        <rect x={x0} y={yb - 6} width={x1 - x0} height={12} rx={6} fill="#c9b48a" />
        <rect x={x0} y={yb - 6} width={(x1 - x0) * sol} height={12} rx={6} fill="#f2b81e" />
        {sol > 0 && <Halo x={x0 + (x1 - x0) * sol} y={yb} r={60} color="#fff0a0" fuerza={0.7} />}
        {copo(x0, l(72.4), "MAY 20")}{copo(x1, l(76.6), "SEP 15")}
        {/* tarro de pintura en el piso */}
        <g transform={`translate(${bx + 150},${P - 20})`}><path d="M-34,-70 L34,-70 L30,0 L-30,0 Z" fill="#b8382c" stroke="#1c1416" strokeWidth={5} /><ellipse cx={0} cy={-70} rx={34} ry={9} fill="#7a1612" stroke="#1c1416" strokeWidth={4} /><path d="M-34,-62 Q0,-120 34,-62" stroke="#4a4a52" strokeWidth={4} fill="none" /></g>
        <A look={MARCUS_VERANO} ruta={[{ f: 0, x: bx, y: P - 20 }, { f: l(81.9), x: bx + 10, y: P - 20 }, { f: l(82.7), x: bx + 140, y: P - 20 }, { f: l(83.7), x: bx + 120, y: P - 20 }, { f: l(84.3), x: bx, y: P - 20 }, { f: l(87.3), x: bx + 10, y: P - 20 }, { f: l(87.9), x: bx + 110, y: P - 20 }, { f: l(88.8) + 30, x: bx + 100, y: P - 20 }]}
          dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "determinado" }, { f: l(82.6), v: "duda" }, { f: l(84.2), v: "determinado" }, { f: l(87.6), v: "feliz" }]}
          miradas={[{ f: 0, v: { x: 0.8, y: -0.3 } }, { f: l(87.4), v: { x: 0.8, y: -0.1 } }, { f: meter - 2, v: { x: -0.6, y: 0.7 } }, { f: meter + 14, v: { x: 0.8, y: -0.3 } }]}
          poses={[{ f: 0, v: "parado" }, ...gestos(l(72.0), l(81.8), [pA, pB], 12), { f: l(82.0), v: "parado" }, { f: l(82.8), v: "manosCintura" }, { f: l(83.5), v: "pensar" },
            ...gestos(l(84.3), l(87.2), [bajo, bajo2], 10), { f: l(87.5), v: "parado" }, { f: meter, v: "agacharse" }, { f: meter + 12, v: "parado" }, { f: meter + 20, v: "manosCintura" }]}
          enManoD={(ff: number) => (ff < meter + 4 ? <Brocha /> : null)} />
        {f >= meter + 4 && <g transform={`translate(${bx + 150},${P - 20 - 70}) rotate(-12)`}><Brocha /></g>}
      </>}
      hud={<Rotulo texto="110-120 DAYS" x={1240} y={140} centro desde={l(80.4)} hasta={l(83.8)} color="#ffcf6e" tam={88} />} />
  );
};

// ---------- E19 · 88:8-90:4 · Marcus se da vuelta y corre hacia el campo (más grande, con polvo de pasos) ----------
const Q19: React.FC = () => {
  const f = useF();
  const l = loc(88.8);
  const xm = interpolate(f, [l(89.2), l(90.4)], [1800, 2150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fl = ap(f, 14, 18);
  return (
    <Escena Set={Granja} pal={PAL} seed={58} setProps={{ hora: "dia", estacion: "barro", crec: 0, pared: [{ t: "DAYS LEFT", desde: -99, x: D.x + 30, y: D.y + 190, tam: 34 }, { t: "IN SUMMER", desde: -99, x: D.x + 24, y: D.y + 232, tam: 34 }, { t: "115", desde: -99, x: D.x + 56, y: D.y + 330, tam: 84, color: "#b8382c" }] }}
      claves={[mira(0, 1900, 640, 1.3), mira(l(90.4), 2300, 650, 1.2, { curva: "inout" })]}
      medio={<>
        <A look={MARCUS_VERANO} escala={1.3} ruta={[{ f: 0, x: 1800, y: P - 20 }, { f: l(89.2), x: 1800, y: P - 20 }, { f: l(90.4), x: 2300, y: Y }]} dir={[{ f: 0, v: -1 }, { f: l(89.2), v: 1 }]} caras={[{ f: 0, v: "determinado" }]} />
        {f > l(89.2) && <Nube x={xm - 40} y={Y + 8} f={f} n={9} ancho={110} alto={60} deriva={-110} r0={13} color="#cdb894" opac={0.75} />}
        <g opacity={fl}><path d={`M2480,${P - 330} L2900,${P - 330} M2820,${P - 380} L2900,${P - 330} L2820,${P - 280}`} stroke="#ffcf6e" strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" fill="none" /></g>
      </>}
      hud={<Cartel texto="THE CROP?" x={1240} y={110} desde={14} color="#ffcf6e" tam={110} />} />
  );
};

// ---------- E20 · 90:4-95:0 · una papa gigante rueda y rebota al centro del campo; Gus y Theo la miran con asombro ----------
const Q20: React.FC = () => {
  const f = useF();
  const l = loc(90.4);
  const x = interpolate(f, [l(91.0), l(93.6)], [5600, 4180], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  const bote = Math.abs(Math.sin(interpolate(f, [l(91.0), l(93.6)], [0, Math.PI * 3], cl))) * 40 * (1 - ap(f, l(93.0), 18));
  const asombro = (k: number): { f: number; v: Pz }[] => [{ f: 0, v: "parado" }, { f: l(92.6) + k * 6, v: "encogerse" }, ...gestos(l(93.4) + k * 4, l(95.0), ["manosCara", "saludar", "encogerse"], 16)];
  return (
    <Escena Set={Granja} pal={PAL} seed={59} setProps={{ hora: "dia", estacion: "barro", crec: 0 }}
      claves={[mira(0, 3780, 640, 1.1), mira(l(93.6), 3790, 630, 1.2), mira(l(95.0), 3800, 620, 1.28)]}
      medio={<>
        <Halo x={x} y={P - 220} r={500} color="#ffb04a" fuerza={0.3} />
        <Papa x={x} y={P - 230 - bote} s={10} rot={-(5600 - x) / 3} />
        {(() => { const k = ap(f, l(93.8), 10); return k > 0 ? <g transform={`translate(${x},${P - 470 - (1 - k) * 60}) scale(${0.5 + 0.5 * k})`} opacity={k}>
          <path d="M-80,40 L-90,-30 L-45,5 L0,-50 L45,5 L90,-30 L80,40 Z" fill="#ffcf3a" stroke="#8a5a10" strokeWidth={6} strokeLinejoin="round" />
          {[-90, 0, 90].map((cx, q) => <circle key={q} cx={cx} cy={q === 1 ? -50 : -30} r={10} fill="#e23a2e" stroke="#8a5a10" strokeWidth={4} />)}
          <rect x={-80} y={28} width={160} height={16} rx={4} fill="#e8a91e" stroke="#8a5a10" strokeWidth={4} /></g> : null; })()}
        {f > l(93.4) && Array.from({ length: 8 }).map((_, i) => { const t = ap(f, l(93.4), 20); return <circle key={i} cx={4180 + (i - 4) * 60 * (0.4 + t)} cy={P - 20 - t * 60 * (1 + (i % 3))} r={20 * (1 - t) + 6} fill="#8a6a48" opacity={1 - t} />; })}
        {f > l(91.0) && f < l(93.5) && <Nube x={x + 160} y={P + 60} f={f} n={6} ancho={120} alto={70} deriva={120} r0={14} color="#cdb894" opac={0.6} />}
        <A look={GUS} escala={1.5} ruta={[{ f: 0, x: 3410, y: Y }, { f: l(92.7), x: 3410, y: Y }, { f: l(93.4), x: 3350, y: Y }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "neutral" }, { f: l(92.6), v: "sorpresa" }]} poses={asombro(0)} miradas={[{ f: 0, v: { x: 0.8, y: 0 } }, { f: l(91.4), v: { x: 0.8, y: -0.3 } }]} />
        <A look={THEO} escala={1.5} ruta={[{ f: 0, x: 3640, y: Y }, { f: l(92.9), x: 3640, y: Y }, { f: l(93.6), x: 3580, y: Y }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "neutral" }, { f: l(92.8), v: "sorpresa" }]} poses={asombro(1)} miradas={[{ f: 0, v: { x: 0.8, y: 0 } }, { f: l(91.4), v: { x: 0.8, y: -0.3 } }]} />
      </>}
      hud={<Rotulo texto="THE POTATO" x={1000} y={110} centro desde={l(94.0)} color="#ffcf6e" tam={100} />} />
  );
};

// ---------- E21 · 95:0-98:8 · balanza: Rosa pone la papa en el plato y la aguja sube a 1 LB = 350 KCAL ----------
const Q21: React.FC = () => {
  const f = useF();
  const l = loc(95.0);
  const puesta = ap(f, l(95.9), 8);
  const aguja = 0.7 * ap(f, l(96.0), 50);
  return (
    <Escena Set={Primer} pal={PAL} seed={60} setProps={{ fondo: "madera" }} claves={[mira(0, 960, 600, 1.0), mira(l(98.8), 960, 600, 1.12)]}
      medio={<>
        <Balanza x={960} y={900} s={1.7} aguja={aguja} />
        {puesta > 0 && <Papa x={960} y={900 - 1.7 * 206 - 40 + (1 - puesta) * -30 + 0} s={3.6} rot={-10} />}
        <A look={ROSA} escala={2.4} ruta={[{ f: 0, x: 640, y: 1130 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: l(96.2), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.2 } }]}
          poses={[{ f: 0, v: { hD: 150, cD: 40 } }, { f: l(95.5), v: { hD: 88, cD: 12 } }, { f: l(96.2), v: { hD: 60, cD: 30 } }, ...gestos(l(97.0), l(98.8), ["hablar", "señalar"], 26)]}
          enManoD={f < l(95.9) ? <Papa x={0} y={0} s={0.8} /> : undefined} />
      </>}
      hud={<><Cartel texto="1 LB = 350 KCAL" x={1240} y={110} desde={l(96.4)} color="#ffcf6e" tam={90} pastilla={false} />
        <Num x={1440} y={300} desde={l(96.0)} f0={l(96.0)} f1={l(97.6)} v0={0} v1={350} suf=" KCAL" tam={110} color="#f6ecd2" /></>} />
  );
};

// ---------- E22 · 98:8-107:3 · Marcus estaca las 4 esquinas del pie cuadrado (martillo) → la grilla se multiplica hasta el acre ----------
const Q22: React.FC = () => {
  const f = useF();
  const l = loc(98.8);
  const L = 300; // 1 pie
  const CX = 1000, CY = 620; // centro del cuadrito
  const grilla = ap(f, l(104.4), 30);
  const esq: [number, number][] = [[0, 0], [1, 0], [1, 1], [0, 1]];
  const per = 26, f0 = 6;
  const tHit = (i: number) => f0 + i * per + 14;
  // Marcus (escala 1.3) se para al costado de cada esquina: la maza cae justo sobre la estaca (y rebota un segundo golpe corto)
  const ex = (i: number) => CX - L / 2 + esq[i][0] * L, ey = (i: number) => CY - L / 2 + esq[i][1] * L;
  const dd = [1, -1, -1, 1];
  const px = esq.map((_, i) => ex(i) - dd[i] * 150), py = esq.map((_, i) => ey(i) + 120);
  // ruta SIN quedarse quieto: entre golpes se sigue acomodando (deriva de 10-14 px) y camina a la siguiente esquina
  const ruta: { f: number; x: number; y: number }[] = [{ f: 0, x: px[0] - 30, y: py[0] }];
  esq.forEach((_, i) => { ruta.push({ f: Math.max(1, tHit(i) - 12), x: px[i], y: py[i] }, { f: tHit(i) + 6, x: px[i] + dd[i] * 12, y: py[i] + 4 }); });
  ruta.push({ f: l(103.2), x: px[3] - 40, y: py[3] }, { f: l(104.3), x: 260, y: py[3] });
  const dirs = [{ f: 0, v: 1 as const }, { f: tHit(1) - 14, v: -1 as const }, { f: tHit(3) - 14, v: 1 as const }, { f: l(103.2), v: -1 as const }];
  const arriba = { hD: 175, cD: 0, tronco: -6, cabeza: 6 }, golpe = { hD: 38, cD: 0, tronco: 26, cabeza: 14 }, medio = { hD: 90, cD: 10, tronco: 12, cabeza: 8 };
  const poses: { f: number; v: any }[] = [{ f: 0, v: medio }];
  esq.forEach((_, i) => poses.push({ f: tHit(i) - 9, v: arriba }, { f: tHit(i), v: golpe }, { f: tHit(i) + 6, v: medio }, { f: tHit(i) + 10, v: golpe }, { f: tHit(i) + 16, v: "parado" }));
  poses.push({ f: l(102.2), v: "señalar" }, { f: l(103.0), v: "manosCintura" }, { f: l(103.4), v: "parado" });
  // cámara CONTINUA (camino): una clave por esquina en el golpe, sin mesetas; después cae al cuadrito y se abre en la grilla
  const camE = esq.map((_, i) => [tHit(i), (px[i] + ex(i)) / 2, py[i] - 296, i % 2 ? 1.2 : 1.15] as KP);
  const cam = camino([[-10, (px[0] + ex(0)) / 2 - 40, py[0] - 290, 1.12], ...camE, [l(102.7), CX - 120, CY + 10, 1.2], [l(103.6), CX, CY - 20, 1.4], [l(104.4), CX, CY, 1.8], [l(105.2), CX, CY, 1.05], [l(106.0), CX, CY, 0.45], [l(106.7), CX, CY, 0.19], [l(107.3) + 10, CX, CY, 0.085]]);
  // dos papas CAEN dentro del cuadro y rebotan
  const papa = (t0: number) => { const u = f - t0; if (u < 0) return null; const sp = spring({ frame: u, fps: 30, config: { damping: 7, stiffness: 160 } }); return { dy: (1 - sp) * -420, k: Math.min(1, u / 4) }; };
  return (
    <Escena Set={Primer} pal={PAL} seed={61} setProps={{ fondo: "tierra" }} mano={1}
      claves={cam}
      medio={<>
        <rect x={-30000} y={-30000} width={62000} height={62000} fill="#5a3a28" />
        {/* surcos: franjas onduladas más oscuras y más claras (textura de campo arado) */}
        {Array.from({ length: 70 }).map((_, i) => { const y = -2400 + i * 90; return <path key={`s${i}`} d={`M-4000,${y} Q-2000,${y + 18} 0,${y} T4000,${y} T8000,${y}`} stroke={i % 2 ? "#4a2e1e" : "#6e4a34"} strokeWidth={i % 2 ? 26 : 14} fill="none" opacity={0.75} />; })}
        {Array.from({ length: 180 }).map((_, i) => <ellipse key={`t${i}`} cx={-600 + random(`gx${i}`) * 3200} cy={-500 + random(`gy${i}`) * 2200} rx={5 + random(`gr${i}`) * 12} ry={3 + random(`gq${i}`) * 7} fill={random(`gc${i}`) > 0.5 ? "#4a2e1e" : "#76513a"} />)}
        {grilla > 0 && <g opacity={grilla}>{Array.from({ length: 121 }).map((_, i) => <g key={i}><rect x={CX - L / 2 + (i - 60) * L - 4} y={-25000} width={8 + 30 * grilla} height={50000} fill="#e9dcc0" opacity={0.55} /><rect y={CY - L / 2 + (i - 60) * L - 4} x={-25000} height={8 + 30 * grilla} width={50000} fill="#e9dcc0" opacity={0.55} /></g>)}</g>}
        {esq.map((_, i) => { const k = ap(f, tHit(i), 5), k2 = ap(f, tHit(i) + 10, 4); return <g key={i} opacity={k}><rect x={ex(i) - 9} y={ey(i) - 30 + (1 - k) * -24 + k2 * 8} width={18} height={30 + 14 * (1 - k) - k2 * 8} fill="#c9a36a" stroke="#6a4a32" strokeWidth={4} />{f >= tHit(i) && f < tHit(i) + 12 && <circle cx={ex(i)} cy={ey(i) - 30} r={10 + (f - tHit(i)) * 4} fill="none" stroke="#f6efe0" strokeWidth={4} opacity={1 - (f - tHit(i)) / 12} />}</g>; })}
        <rect x={CX - L / 2} y={CY - L / 2} width={L} height={L} fill="none" stroke="#f6efe0" strokeWidth={5} strokeDasharray={`${4 * L * ap(f, l(102.2), 30)} 9999`} />
        {[[CX - 60, CY - 20, 0.9, l(103.0)], [CX + 60, CY + 60, 1.1, l(103.45)]].map(([x, y, s, t0], i) => { const p = papa(t0); return p ? <g key={i} opacity={p.k}><ellipse cx={x} cy={y + 26} rx={40 * s} ry={9} fill="#2a1a10" opacity={0.4 * (1 + p.dy / 420)} /><Papa x={x} y={y + p.dy} s={s * 2} rot={i * 50 + p.dy * 0.2} /></g> : null; })}
        {f >= l(103.6) && <text x={CX + L / 2 + 24} y={CY + 16} fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={46} fill="#ffcf6e" stroke="#1c1416" strokeWidth={8} paintOrder="stroke" opacity={ap(f, l(103.6), 8) * (1 - grilla)}>½ – 1 LB</text>}
        {f < l(104.4) && <A look={MARCUS_VERANO} escala={1.3} ruta={ruta} dir={dirs} caras={[{ f: 0, v: "determinado" }, { f: l(102.2), v: "feliz" }]} poses={poses} enManoD={(ff: number) => (ff < l(102.1) ? <g transform="rotate(-120)"><Mazo /></g> : null)} />}
      </>}
      hud={<>
        <Rotulo texto="1 SQ FT = ½ – 1 LB" x={1240} y={96} centro desde={l(100.4)} hasta={l(104.4)} color="#ffcf6e" tam={76} />
        <Num x={1180} y={330} desde={l(104.2)} f0={l(104.4)} f1={l(106.6)} v0={1} v1={43560} suf=" SQ FT" tam={120} />
        <Rotulo texto="= 1 ACRE" x={1180} y={540} centro desde={l(106.3)} color="#f6ecd2" tam={64} brillo={false} />
        {/* Marcus GRANDE en primer plano: entra a pie y mira cómo la grilla se multiplica hasta el acre; no se detiene */}
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <A look={MARCUS_VERANO} escala={1.35} ruta={[{ f: 0, x: -260, y: 1050 }, { f: l(104.5), x: -260, y: 1050 }, { f: l(105.6), x: 470, y: 1050 }, { f: l(107.3) + 30, x: 600, y: 1050, curva: "lineal" }]} dir={[{ f: 0, v: 1 }]}
            caras={[{ f: 0, v: "determinado" }, { f: l(105.8), v: "sorpresa" }, { f: l(106.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0 } }, { f: l(105.6), v: { x: 0.7, y: -0.6 } }]}
            poses={[{ f: 0, v: "parado" }, { f: l(105.7), v: "manosCintura" }, { f: l(106.2), v: "señalar" }, { f: l(106.9), v: "celebrar" }]} />
        </svg>
      </>} />
  );
};

// ---------- E23 · 107:3-116:8 · Marcus y Theo cargan papas a la montaña (ida y vuelta); el total sube a ~20,000 LB ----------
// canasta de mimbre (llena o vacía) para E23
const Canasta: React.FC<{ lleno: boolean; rot?: number }> = ({ lleno, rot = 0 }) => (
  <g transform={`rotate(${rot}) translate(0,6)`}>
    {lleno && [[-20, -10], [0, -18], [20, -10], [-8, -2], [12, -4]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={15} ry={11} fill="#c9935a" stroke="#6a4424" strokeWidth={3} />)}
    <path d="M-40,-6 L40,-6 L32,40 L-32,40 Z" fill="#b8863e" stroke="#5a3a1a" strokeWidth={4} />
    {[4, 16, 28].map((y) => <path key={y} d={`M${-38 + y * 0.2},${y} L${38 - y * 0.2},${y}`} stroke="#7a5424" strokeWidth={3} />)}
    <path d="M-34,-6 Q0,-58 34,-6" stroke="#7a5424" strokeWidth={5} fill="none" />
  </g>
);
const Q23: React.FC = () => {
  const f = useF();
  const l = loc(107.3);
  // Marcus y Theo van y vuelven con canastas; cada VUELCO en la pila suma 4,000 LB en ese mismo cuadro (cada ~1,2 s):
  // vuelcos en 36, 72, 108, 144, 180 → 20,000 en 113.3. Marcus tira la última papa a la cima y se sacude las manos.
  const PER = 72, XC = 1200, XP = 1690, PX = 2060;
  const vuelcos = [36, 72, 108, 144, 180];
  const hechos = vuelcos.filter((t) => f >= t).length;
  const NB = 30; // papas por canasta
  // montaña de papas en hileras (24, 22, 20…): forma de pila, no nube
  const slot = (i: number) => { let r = 0, j = i; while (j >= 24 - 2 * r && r < 11) { j -= 24 - 2 * r; r++; } const cap = 24 - 2 * r; return { x: PX + (j - (cap - 1) / 2) * 26 + (random(`mx${i}`) - 0.5) * 8 + (r % 2) * 6, y: Y - 14 - r * 21 + random(`my${i}`) * 6 }; };
  // b = cuadro en que arranca cada viaje; off = primer vuelco; el último viaje NO vuelve (se queda en la pila)
  const B = (off: number, k: number) => off - 37 + k * PER;
  const rutaDe = (off: number, n: number, ini: number, fin: { f: number; x: number }[]) => {
    const r: { f: number; x: number; y: number }[] = [{ f: -10, x: ini, y: Y }, { f: B(off, 0) - 2, x: XC, y: Y }];
    for (let k = 0; k < n; k++) { const b = B(off, k); r.push({ f: b + 6, x: XC, y: Y }, { f: b + 34, x: XP, y: Y }, { f: b + 40, x: XP, y: Y }); if (k < n - 1) r.push({ f: b + 68, x: XC, y: Y }); }
    return [...r, ...fin.map((p) => ({ ...p, y: Y }))];
  };
  const posesDe = (off: number, n: number) => {
    const p: { f: number; v: any }[] = [{ f: 0, v: "parado" }];
    for (let k = 0; k < n; k++) { const b = B(off, k); p.push({ f: b, v: "agacharse" }, { f: b + 7, v: "tirarCarga" }, { f: b + 34, v: "tirarCarga" }, { f: b + 37, v: "tirarSuelta" }, { f: b + 44, v: "parado" }); }
    return p;
  };
  const dirDe = (off: number, n: number, d0: 1 | -1) => { const d: { f: number; v: 1 | -1 }[] = [{ f: 0, v: d0 }]; for (let k = 0; k < n; k++) { const b = B(off, k); d.push({ f: b + 2, v: 1 }); if (k < n - 1) d.push({ f: b + 40, v: -1 }); } return d; };
  const lleva = (off: number, n: number) => (ff: number) => { for (let k = 0; k < n; k++) { const b = B(off, k); if (ff >= b + 6 && ff < b + 46) return <Canasta lleno={ff < b + 37} rot={ff >= b + 34 ? Math.min(110, (ff - b - 34) * 22) : 0} />; } return null; };
  const fUlt = 199, sacude = 216;
  const mPoses = [...posesDe(36, 3), { f: 190, v: "agacharse" }, { f: 195, v: "tirarCarga" }, { f: fUlt, v: "tirarSuelta" }, { f: 206, v: "parado" },
    ...gestos(sacude, sacude + 40, [{ hD: 70, cD: 80, hI: 70, cI: 80, tronco: 4 }, { hD: 62, cD: 96, hI: 76, cI: 70, tronco: 2 }], 5), { f: sacude + 44, v: "manosCintura" }];
  const ultima = f >= fUlt && f < fUlt + 16 ? (() => { const u = (f - fUlt) / 16; const x0 = XP - 30, y0 = Y - 300, x1 = PX, y1 = Y - 14 - 11 * 21 - 14; return { x: x0 + (x1 - x0) * u, y: y0 + (y1 - y0) * u - 220 * Math.sin(u * Math.PI) }; })() : null;
  return (
    <Escena Set={Granja} pal={PAL} seed={62} setProps={{ hora: "ocaso", estacion: "verano", crec: 1 }}
      claves={camino([[-10, 1560, 640, 1.22], [l(110.0), 1620, 630, 1.27], [l(113.4), 1720, 615, 1.34], [l(116.8) + 10, 1780, 610, 1.4]])}
      medio={<>
        {Array.from({ length: Math.min(150, hechos * NB) }).map((_, i) => { const k = Math.floor(i / NB), t0 = vuelcos[k]; const u = Math.min(1, (f - t0 - (i % NB) * 0.3) / 9); if (u <= 0) return null; const s = slot(i), x0 = XP + 50, y0 = Y - 260; return <Papa key={i} x={x0 + (s.x - x0) * u} y={y0 + (s.y - y0) * u - 120 * Math.sin(u * Math.PI)} s={1.1} rot={random(`mr${i}`) * 180 + (1 - u) * 300} />; })}
        {f >= fUlt + 16 && <Papa x={PX} y={Y - 14 - 11 * 21 - 14} s={1.3} rot={40} />}
        {ultima && <Papa x={ultima.x} y={ultima.y} s={1.6} rot={(f - fUlt) * 30} />}
        {vuelcos.map((t, k) => (f >= t && f < t + 26 ? <text key={k} x={PX + 40} y={P - 250 - (f - t) * 3} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={46} fill="#ffcf6e" stroke="#1c1416" strokeWidth={8} paintOrder="stroke" opacity={1 - (f - t) / 26}>+4,000 LB</text> : null))}
        <A look={THEO} ruta={rutaDe(72, 2, XC - 300, [{ f: 190, x: 1400 }, { f: l(116.8) + 30, x: 1450 }])} dir={[...dirDe(72, 2, 1), { f: 150, v: -1 }]} poses={[...posesDe(72, 2), { f: 176, v: "manosCara" }, ...gestos(196, l(116.8) + 30, ["manosCintura", "parado"], 24)]}
          caras={[{ f: 0, v: "cansado" }, { f: 200, v: "feliz" }]} enManoD={lleva(72, 2)} />
        <A look={MARCUS_VERANO} ruta={rutaDe(36, 3, XC - 60, [{ f: 196, x: XP + 10 }, { f: 240, x: XP - 20 }, { f: l(116.8) + 30, x: XP - 90 }])} dir={dirDe(36, 3, 1)} poses={mPoses}
          caras={[{ f: 0, v: "determinado" }, { f: sacude, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0 } }, { f: sacude, v: { x: 0.7, y: -0.5 } }]} enManoD={lleva(36, 3)} />
        <Nube x={1500} y={Y + 6} f={f} n={5} ancho={400} alto={40} deriva={30} r0={9} opac={0.35} />
      </>}
      hud={<>
        <Past x={1240} y={110} w={640} h={140} desde={20} />
        <Num x={1240} y={120} desde={20} f0={0} f1={1} v0={4000 * hechos} v1={4000 * hechos} pre="~" suf=" LB" tam={100} />
        <Cartel texto="≈ 7,000,000 KCAL · WHAT 10 PEOPLE NEED" x={1300} y={290} desde={l(113.8)} color="#7cd36a" tam={50} />
      </>} />
  );
};

// ---------- E24 · 116:8-120:1 · vista aérea: el acre se llena de surcos; un muñeco cruza el acre y otro la cancha ----------
const Q24: React.FC = () => {
  const f = useF();
  const l = loc(116.8);
  // acre y cancha FUERA de la franja del HUD (x<640 · y<360): todo arranca en y 380
  return (
    <Escena Set={Primer} pal={PAL} seed={63} setProps={{ fondo: "verde" }} claves={[mira(0, 960, 540, 1.0), mira(l(120.1), 960, 545, 0.97)]}
      medio={<>
        <rect x={120} y={380} width={480} height={480} fill="#5a3a28" stroke="#f2c14a" strokeWidth={8} />
        {Array.from({ length: 11 }).map((_, i) => <rect key={i} x={132} y={470 + i * 34} width={456 * ap(f, l(117.2) + i * 4, 14)} height={16} rx={8} fill="#4f9a3c" />)}
        <Cancha x={800} y={400} w={880} h={440} />
        <A look={THEO} escala={1.35} ruta={[{ f: l(117.4), x: 140, y: 960 }, { f: l(119.0), x: 580, y: 960, curva: "lineal" }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: l(119.0), v: "feliz" }]} poses={[{ f: 0, v: "parado" }, { f: l(119.1), v: "celebrar" }]} />
        <A look={GUS} escala={1.35} ruta={[{ f: l(117.4), x: 820, y: 960 }, { f: l(120.1), x: 1640, y: 960, curva: "lineal" }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "cansado" }]} />
      </>}
      hud={<>
        <Past x={1100} y={98} w={1300} h={110} desde={l(118.0)} /><Rotulo texto="SMALLER THAN A FOOTBALL FIELD" x={1100} y={112} centro desde={l(118.0)} color="#ffcf6e" tam={70} />
        <Rotulo texto="1 ACRE" x={360} y={392} centro desde={l(117.0)} color="#ffcf6e" tam={64} />
        <Rotulo texto="FOOTBALL FIELD" x={1240} y={412} centro desde={l(118.2)} color="#f6ecd2" tam={56} brillo={false} />
      </>} />
  );
};

// ---------- E25 · 120:1-124:3 · la mano de Marcus corta la papa (cuchillo baja-sube); las mitades abren y brotan los ojos ----------
const Q25: React.FC = () => {
  const f = useF();
  const l = loc(120.1);
  const tCorte = l(122.1);
  const abre = ap(f, tCorte, 12);
  const brote = ap(f, l(122.6), 20);
  // Marcus ENTERO junto a la mesa: cuchillo arriba → baja y parte la papa en 2 a los 2 s; las mitades se abren y brotan los ojos
  const arriba = { hD: 150, cD: 30, tronco: 2, cabeza: 8 }, abajo = { hD: 72, cD: 4, tronco: 14, cabeza: 14 };
  const poses: { f: number; v: any }[] = [{ f: 0, v: "parado" }, { f: l(120.6), v: { hD: 95, cD: 20, tronco: 6, cabeza: 10 } }, { f: l(121.2), v: abajo }, { f: l(121.5), v: arriba }, { f: tCorte - 4, v: arriba }, { f: tCorte, v: abajo }, { f: l(122.8), v: { hD: 60, cD: 30, tronco: 6, cabeza: 6 } }, { f: l(123.4), v: "señalar" }];
  const mesa = 740;
  return (
    <Escena Set={Primer} pal={PAL} seed={64} setProps={{ fondo: "madera" }} claves={[mira(0, 980, 560, 1.0), mira(l(124.3), 990, 560, 1.06)]}
      medio={<>
        <rect x={0} y={1005} width={2000} height={400} fill="#5a3e2a" opacity={0.55} />
        <rect x={700} y={mesa} width={560} height={22} rx={6} fill="#a8774a" stroke="#4a301e" strokeWidth={5} />
        {[730, 1210].map((x) => <rect key={x} x={x} y={mesa + 20} width={20} height={1005 - mesa - 20} fill="#7a5232" />)}
        <rect x={850} y={mesa - 18} width={340} height={20} rx={6} fill="#d9b07a" stroke="#6a4a2e" strokeWidth={4} />
        {f < tCorte
          ? <Papa x={1020} y={mesa - 18 - 80} s={4} rot={-4} />
          : [-1, 1].map((d) => <Papa key={d} x={1020 + d * (34 + 70 * abre)} y={mesa - 18 - 70 + 10 * abre} s={3.3} rot={d * 18 * abre} brotes={brote} />)}
        {f >= tCorte && f < tCorte + 8 && <line x1={1020} y1={mesa - 200} x2={1020} y2={mesa - 20} stroke="#ffffff" strokeWidth={10} opacity={1 - (f - tCorte) / 8} />}
        <A look={MARCUS_VERANO} escala={1.9} ruta={[{ f: 0, x: 1520, y: 1005 }, { f: l(120.5), x: 1330, y: 1005 }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "determinado" }, { f: l(122.3), v: "feliz" }]} miradas={[{ f: 0, v: { x: -0.8, y: 0.6 } }]}
          poses={poses} enManoD={(ff: number) => (ff < l(123.2) ? <g transform={`rotate(${ff < l(121.0) ? 0 : 75})`}><Cuchillo /></g> : null)} />
        {brote > 0 && <g opacity={brote}><path d={`M640,520 L${880},${mesa - 190}`} stroke="#9bd87a" strokeWidth={8} strokeLinecap="round" /><path d={`M${880},${mesa - 190} l-30,-4 m30,4 l-14,-26`} stroke="#9bd87a" strokeWidth={8} strokeLinecap="round" fill="none" /></g>}
      </>}
      hud={<>
        <Past x={1240} y={88} w={820} h={104} desde={l(120.4)} />
        <Rotulo texto="NO POTATO SEEDS" x={1240} y={98} centro desde={l(120.4)} color="#f6ecd2" tam={76} brillo={false} />
        <Rotulo texto="EYES" x={600} y={430} centro desde={l(122.7)} color="#9bd87a" tam={72} />
        <Rotulo texto="YOU PLANT POTATOES" x={760} y={880} centro desde={l(122.6)} color="#ffcf6e" tam={80} />
      </>} />
  );
};

// ---------- E26 · 124:3-127:7 · papa de supermercado: TREATED ✗; Rosa niega con la cabeza y la arroja ----------
const Q26: React.FC = () => {
  const f = useF();
  const l = loc(124.3);
  const x = ap(f, l(125.6), 8);
  const u = ap(f, l(126.7), 24);
  const dx = 490 * u, dy = -300 * Math.sin(u * Math.PI) + 130 * u * u, rt = u * 360; // cae ENTERA en x 1450 (no sale de cuadro)
  const s = 1 + 1.3 * Math.max(0, 1 - (f - l(124.8)) / 7) * (f >= l(124.8) ? 1 : 0);
  const sacude = f >= l(124.8) && f < l(124.8) + 12 ? 8 * Math.sin((f - l(124.8)) * 2.4) * (1 - (f - l(124.8)) / 12) : 0;
  const ue = u * u * (3 - 2 * u);
  return (
    <Escena Set={Primer} pal={PAL} seed={65} setProps={{ fondo: "madera" }} claves={[mira(0, 960, 560, 1.0), mira(l(127.7), 960, 560, 1.04)]}
      medio={<>
        {<g transform={`translate(${dx},${dy + sacude}) rotate(${rt} 960 600)`}>
          <Papa x={960} y={600} s={6} rot={-6} />
          {x > 0 && <path d={`M760,340 L${760 + 400 * x},${340 + 460 * x} M1160,340 L${1160 - 400 * x},${340 + 460 * x}`} stroke="#e23a2e" strokeWidth={30} strokeLinecap="round" />}
        </g>}
        <g transform={`translate(${960 + 490 * ue},${520 - 120 * ue}) rotate(-8) scale(${s})`} opacity={ap(f, l(124.8), 4)}><rect x={-190} y={-50} width={380} height={100} rx={10} fill="rgba(246,239,224,0.92)" stroke="#c0352c" strokeWidth={10} /><text y={26} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={72} fill="#c0352c">TREATED</text></g>
        <A look={ROSA} escala={2.0} ruta={[{ f: 0, x: 430, y: 1028 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "duda" }, { f: l(125.0), v: "asco" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.1 } }]}
          giros={[{ f: 0, v: 0 }, ...gestos(l(125.2), l(126.5), [-0.8, 0.8] as any, 8), { f: l(126.6), v: 0 }]}
          poses={[{ f: 0, v: "manosCintura" }, { f: l(126.3), v: "tirarCarga" }, { f: l(126.7), v: "tirarSuelta" }, { f: l(127.3), v: "brazosCruzados" }]} />
      </>}
      hud={<Rotulo texto="WON'T SPROUT" x={1240} y={150} centro desde={l(126.0)} color="#e23a2e" tam={96} />} />
  );
};

// lupa para buscar ojos
const Lupa: React.FC = () => (
  <g transform="rotate(-25)"><circle r={30} fill="rgba(200,232,255,0.35)" stroke="#5a4a3a" strokeWidth={7} /><line x1={22} y1={22} x2={58} y2={60} stroke="#5a4a3a" strokeWidth={9} strokeLinecap="round" /></g>
);

// ---------- E27 · 127:7-135:5 · Rosa revuelve bolsas en el puesto (agacha-levanta) y busca ojos con una lupa; el mapa de 20 MILES ----------
const Q27: React.FC = () => {
  const f = useF();
  const l = loc(127.7);
  return (
    <Escena Set={Granja} pal={PAL} seed={66} setProps={{ hora: "dia", estacion: "barro", crec: 0 }}
      claves={[mira(0, 3560, 650, 1.3), mira(l(131.5), 3580, 650, 1.45, { curva: "inout" }), mira(l(135.5), 3600, 655, 1.5)]}
      medio={<>
        <Puesto x={3500} y={Y - 10} cartel="FARM STAND" />
        <A look={ROSA} escala={1.25} ruta={[{ f: 0, x: 4150, y: Y }, { f: l(129.4), x: 3790, y: Y }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: "parado" }, ...gestos(l(129.6), l(131.2), ["agacharse", "parado"], 20), { f: l(131.4), v: { hD: 82, cD: 36, hI: 72, cI: 44, tronco: 6 } }, ...gestos(l(133.0), l(135.5), [{ hD: 82, cD: 36, hI: 72, cI: 44, tronco: 6 }, { hD: 74, cD: 30, hI: 80, cI: 52, tronco: 9 }], 22)]}
          caras={[{ f: 0, v: "duda" }, { f: l(131.6), v: "determinado" }, { f: l(134.0), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.6, y: 0.4 } }, { f: l(131.4), v: { x: 0.5, y: -0.2 } }]}
          enManoD={(ff) => (ff > l(131.0) ? <g transform={`scale(${ap(ff, l(131.0), 10)})`}><Papa x={0} y={0} s={1.3} brotes={ap(f, l(131.8), 14)} /></g> : null)} />
      </>}
      hud={<><Past x={1500} y={40} w={420} h={96} desde={l(130.0)} /><Rotulo texto="20 MILES" x={1500} y={50} centro desde={l(130.0)} color="#ffcf6e" tam={74} /><Rotulo texto="LOOKING FOR EYES" x={1000} y={930} centro desde={l(132.0)} color="#7cd36a" tam={58} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "scale(1.3)", transformOrigin: "1150px 170px" }}><MapaMillas x={1150} y={170} k={ap(f, l(130.2), 70)} desde={l(130.0)} puntos={[l(132.4), l(133.6), l(134.8)]} /></div>
        <LupaGrande x={300} y={700} r={112} desde={l(131.9)} Papa={Papa} brotes={ap(f, l(132.4), 20)} /></>} />
  );
};

// ---------- E28-E30 · 135:5-139:8 · tres lugares: ORGANIC · GARDEN CENTER · PROCTOR FARM SUPPLY ----------
const Lugar: React.FC<{ s0: number; s1: number; cartel: string; color: string; sup?: boolean; marca?: "x" | "tilde"; medioPlano?: boolean; n: number }> = ({ s0, s1, cartel, color, sup, marca, medioPlano, n }) => {
  const f = useF();
  const l = loc(s0);
  // tres lugares DISTINTOS: súper (ORGANIC), vivero con invernadero/macetas/bolsas de tierra (GARDEN CENTER) y galpón de
  // chapa con bolsas de arpillera «SEED POTATOES» (PROCTOR, encuadre espejado: Rosa a la derecha saliendo con 2 bolsas).
  // Cabezas siempre fuera de la franja del HUD (x<640 · y<380).
  const proctor = !!medioPlano;
  const esc = sup ? 1.5 : 1.3;
  const x0 = sup ? 1060 : proctor ? 3700 : 3410, x1 = sup ? 1160 : proctor ? 3880 : 3470;
  const saco = (lab: boolean) => <g transform="translate(0,-6)"><path d="M-34,-40 Q-38,10 -30,44 L30,44 Q38,10 34,-40 Q0,-50 -34,-40 Z" fill="#c8a46a" stroke="#6a4a24" strokeWidth={4} /><path d="M-30,-40 Q0,-30 30,-40" stroke="#6a4a24" strokeWidth={3} fill="none" />{lab && <text y={10} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={13} fill="#5a3a1a">SEED</text>}</g>;
  const rosa = <A look={ROSA} escala={esc} ruta={[{ f: -10, x: x0, y: sup ? SUPER_PISO : Y }, { f: l(s1) + 20, x: x1, y: sup ? SUPER_PISO : Y, curva: "lineal" }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: l(s0 + 0.7), v: marca === "x" ? "triste" : "feliz" }]}
    poses={proctor ? [{ f: 0, v: "parado" }] : [{ f: 0, v: "parado" }, { f: l(s0 + 0.8), v: "celebrar" }, { f: l(s0 + 1.2), v: "parado" }]}
    enManoD={proctor ? saco(true) : <Bolsa color="#c9a26a" />} enManoI={proctor ? saco(false) : <Bolsa color="#b08a5a" />} />;
  const caida = ap(f, 2, 12);
  const stops = sup ? <Cartel texto={`STOPS ${n}/3`} x={1560} y={940} desde={6} color="#ffcf6e" tam={64} /> : <Cartel texto={`STOPS ${n}/3`} x={1240} y={110} desde={16} color="#ffcf6e" tam={64} />;
  if (sup) return (
    <Escena Set={SuperSinCarro} pal={PAL} seed={Math.round(s0)} claves={camino([[-10, 1180, 720, 1.45], [l(s1) + 10, 1210, 715, 1.5]])}
      medio={<>{rosa}<g transform={`translate(1500,${560 - (1 - caida) * 420}) scale(0.85)`}><rect x={-190} y={-52} width={380} height={96} rx={8} fill="#f6efe0" stroke={color} strokeWidth={7} /><text y={20} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={58} fill={color}>{cartel}</text></g>{marca && <Marca x={1720} y={560} k={ap(f, l(s0 + 0.5), 10)} tilde={marca === "tilde"} s={0.8} />}</>}
      hud={stops} />
  );
  const cartelEn = (x: number, y: number, w: number, tam = 50) => <g transform={`translate(${x},${y - (1 - caida) * 300})`}><rect x={-w / 2} y={-44} width={w} height={88} rx={8} fill="#f6efe0" stroke={color} strokeWidth={7} /><text y={tam * 0.36} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={tam} fill={color}>{cartel}</text></g>;
  if (!proctor) {
    // VIVERO: invernadero de vidrio, estantes con macetas que se mecen, pila de bolsas de tierra
    const GX = 3500, GW = 520;
    return (
      <Escena Set={Granja} pal={PAL} seed={Math.round(s0)} setProps={{ hora: "dia", estacion: "barro", crec: 0 }} claves={camino([[-10, 3600, 650, 1.42], [l(s1) + 10, 3630, 645, 1.48]])}
        medio={<>
          <path d={`M${GX},${Y} L${GX},${Y - 300} L${GX + GW / 2},${Y - 420} L${GX + GW},${Y - 300} L${GX + GW},${Y} Z`} fill="#cfe6ee" opacity={0.75} stroke="#e9f2f2" strokeWidth={8} />
          {[1, 2, 3].map((i) => <line key={i} x1={GX + (GW / 4) * i} y1={Y} x2={GX + (GW / 4) * i} y2={Y - 300 - (i === 2 ? 120 : 60)} stroke="#e9f2f2" strokeWidth={6} />)}
          <line x1={GX} y1={Y - 150} x2={GX + GW} y2={Y - 150} stroke="#e9f2f2" strokeWidth={6} />
          {[0, 1].map((r) => <g key={r}><rect x={GX + 30} y={Y - 120 - r * 130} width={GW - 60} height={12} fill="#8a5e3c" />{[0, 1, 2, 3, 4, 5].map((c) => { const x = GX + 70 + c * 76, y = Y - 120 - r * 130, sw = Math.sin(f / 11 + c + r * 2) * 5; return <g key={c} transform={`translate(${x},${y})`}><path d="M-17,0 L17,0 L22,-34 L-22,-34 Z" fill="#c0603a" stroke="#6a2a1a" strokeWidth={3} /><g transform={`rotate(${sw} 0 -34)`}><ellipse cx={-10} cy={-52} rx={12} ry={20} fill="#4f9a3a" /><ellipse cx={10} cy={-56} rx={12} ry={22} fill="#5aae44" /><ellipse cx={0} cy={-66} rx={10} ry={18} fill="#6cbf52" /></g></g>; })}</g>)}
          {[[4060, 0], [4156, 0], [4108, 1]].map(([x, r], i) => <g key={`b${i}`} transform={`translate(${x},${Y - 24 - (r as number) * 52})`}><rect x={-46} y={-26} width={92} height={52} rx={10} fill="#6a4a2e" stroke="#2a1c12" strokeWidth={4} /><text y={9} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={22} fill="#f2e2b8">SOIL</text></g>)}
          {cartelEn(GX + GW / 2, Y - 470, 470)}
          {rosa}
          {marca && <Marca x={GX + GW + 110} y={Y - 330} k={ap(f, l(s0 + 0.5), 10)} tilde={marca === "tilde"} s={0.9} />}
        </>}
        hud={stops} />
    );
  }
  // PROCTOR: galpón de chapa acanalada con techo rojo; bolsas de arpillera apiladas «SEED POTATOES»; Rosa sale cargando dos
  const SX = 3120, SW = 520;
  return (
    <Escena Set={Granja} pal={PAL} seed={Math.round(s0)} setProps={{ hora: "dia", estacion: "barro", crec: 0 }} claves={camino([[-10, 3500, 650, 1.42], [l(s1) + 10, 3560, 645, 1.48]])}
      medio={<>
        <rect x={SX} y={Y - 360} width={SW} height={360} fill="#9aa3ab" />
        {Array.from({ length: 26 }).map((_, i) => <rect key={i} x={SX + i * 20} y={Y - 360} width={9} height={360} fill="#7f8891" />)}
        <path d={`M${SX - 30},${Y - 350} L${SX + SW / 2},${Y - 440} L${SX + SW + 30},${Y - 350} Z`} fill="#a83a2c" stroke="#5a1a12" strokeWidth={5} />
        <rect x={SX + 150} y={Y - 245} width={220} height={245} fill="#3a3430" />
        {[[3300, 0], [3380, 0], [3460, 0], [3340, 1], [3420, 1], [3380, 2]].map(([x, r], i) => <g key={i} transform={`translate(${x},${Y - 46 - (r as number) * 80})`}><path d="M-44,-40 Q-48,10 -40,44 L40,44 Q48,10 44,-40 Q0,-52 -44,-40 Z" fill="#c8a46a" stroke="#6a4a24" strokeWidth={4} /><text y={0} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={15} fill="#5a3a1a">SEED</text><text y={18} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={13} fill="#5a3a1a">POTATOES</text></g>)}
        {cartelEn(SX + SW / 2, Y - 300, 490, 40)}
        {rosa}
        {marca && <Marca x={3590} y={Y - 220} k={ap(f, l(s0 + 0.5), 10)} tilde={marca === "tilde"} s={0.85} />}
      </>}
      hud={<><Rotulo texto="SEED POTATOES" x={1180} y={930} centro desde={l(s0 + 0.4)} color="#f6ecd2" tam={56} />{stops}</>} />
  );
};

// ---------- E31 · 139:8-144:3 · el bus escolar con 1,100 LB de papa semilla; Rosa al volante saluda por la ventana ----------
const Q29: React.FC = () => {
  const f = useF();
  const l = loc(139.8);
  const x = interpolate(f, [0, l(142.6)], [-150, 1500], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  const frena = ap(f, l(142.4), 8) * (1 - ap(f, l(142.8), 8));
  const a = Math.sin(f / 3) * 16;
  const rosa = <g transform="translate(0,-10) scale(3)">
    <path d={`M8,-8 Q48,-44 ${52 + a},-84`} stroke="#6a4a3a" strokeWidth={13} fill="none" strokeLinecap="round" />
    <circle cx={52 + a} cy={-86} r={9} fill="#6a4a3a" />
    <circle cy={-34} r={22} fill="#6a4a3a" stroke="#1c1416" strokeWidth={2} /><path d="M-24,-34 Q0,-70 24,-34 Q0,-48 -24,-34 Z" fill="#241612" />
    <circle cx={7} cy={-36} r={2.8} fill="#f6efe0" /><circle cx={-6} cy={-36} r={2.8} fill="#f6efe0" /><path d="M-6,-24 Q3,-16 12,-24" stroke="#f6efe0" strokeWidth={2.6} fill="none" />
  </g>;
  return (
    <Escena Set={Granja} pal={PAL} seed={67} setProps={{ hora: "dia", estacion: "barro", crec: 0, humo: 1 }}
      claves={[mira(0, 900, 640, 0.95), mira(l(142.6), 1400, 700, 1.25, { curva: "inout" }), mira(l(144.3), 1420, 700, 1.32)]}
      detras={<Nube x={x - 480} y={P + 150} f={f} n={8} ancho={120} alto={90} deriva={-100} r0={16} color="#cdb894" opac={0.6} />}
      frente={<g transform={`rotate(${frena * 2} ${x} ${P + 150})`}><BusEscolar x={x} y={P + 150} s={1.15} rueda={x * 0.6} chofer={rosa} /></g>}
      hud={<><Num x={1240} y={66} desde={l(141.0)} f0={l(141.1)} f1={l(142.6)} v0={0} v1={1100} suf=" LB" tam={104} rotulo="SEED POTATOES" />
        <BarraHud x={1240} y={266} w={640} k={ap(f, l(141.1), 45)} desde={l(141.0)} color="#ffcf6e" rotulo="BUS LOAD" />
        <Cartel texto="STOLEN SCHOOL BUS" x={1240} y={950} desde={l(142.8)} color="#ffcf3a" tam={60} /></>} />
  );
};

// ---------- E32 · 144:3-150:3 · la mano de Nan reparte los sobres (lanza uno cada 0,9 s), el primero a los 0,2 s ----------
const SOBRES: { t: string; g: number; d: "poroto" | "zapallo" | "zanahoria" | "repollo" | "choclo" | "cebolla"; c: string; x: number; y: number; r: number }[] = [
  { t: "BEANS", g: 144.6, d: "poroto", c: "#7cc46a", x: 800, y: 560, r: -8 }, { t: "SQUASH", g: 145.2, d: "zapallo", c: "#f2a03a", x: 990, y: 720, r: 6 },
  { t: "CARROTS", g: 145.8, d: "zanahoria", c: "#f08a3c", x: 1180, y: 560, r: -4 }, { t: "CABBAGE", g: 146.4, d: "repollo", c: "#8acb6a", x: 1370, y: 720, r: 9 },
  { t: "CORN", g: 147.0, d: "choclo", c: "#f2d04a", x: 1560, y: 560, r: -6 }, { t: "ONIONS", g: 147.6, d: "cebolla", c: "#c99ad8", x: 1750, y: 720, r: 5 },
];

const Q30: React.FC = () => {
  const f = useF();
  const l = loc(144.3);
  const poses: { f: number; v: string }[] = [{ f: 0, v: "parado" }];
  SOBRES.forEach((s) => poses.push({ f: l(s.g) - 12, v: "tirarCarga" }, { f: l(s.g) - 2, v: "tirarSuelta" }, { f: l(s.g) + 8, v: "parado" }));
  poses.push({ f: l(148.6), v: "hablar" }, { f: l(149.3), v: "señalar" });
  return (
    <Escena Set={Primer} pal={PAL} seed={68} setProps={{ fondo: "madera" }} claves={[mira(0, 1090, 560, 0.95), mira(l(150.3), 1090, 560, 1.02)]}
      medio={<>
        {SOBRES.map((s, i) => { const k = ap(f, l(s.g) - 4, 14); if (k <= 0) return null; const e = 1 - Math.pow(1 - k, 2); const x = 560 + (s.x - 560) * e, y = 620 + (s.y - 620) * e - 190 * Math.sin(k * Math.PI);
          return <Sobre key={i} x={x} y={y} s={1.15 * (0.55 + 0.45 * e)} rot={s.r + (1 - e) * -60} t={s.t} color={s.c} dibujo={s.d} />; })}
        <A look={NAN} escala={2.0} ruta={[{ f: 0, x: 404, y: 1050 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: l(147.5), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.2 } }]} poses={poses} />
      </>}
      hud={<Rotulo texto="EVERYTHING ELSE" x={1240} y={120} centro desde={l(144.8)} color="#ffcf6e" tam={74} />} />
  );
};

// ---------- E33 · 150:3-156:5 · el sobre crece; zoom 2x al sello «PACKED FOR 2025» con golpe y el calendario 2025 ----------
const Calendario2025: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => (
  <g transform={`translate(${x},${y}) scale(${0.6 + 0.4 * k}) rotate(${(1 - k) * -14})`} opacity={k}>
    <rect x={-140} y={-170} width={280} height={340} rx={14} fill="#f6efe0" stroke="#1c1416" strokeWidth={6} />
    <rect x={-140} y={-170} width={280} height={84} rx={14} fill="#c0352c" />
    <text y={-104} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={64} fill="#f6efe0">2025</text>
    {Array.from({ length: 28 }).map((_, i) => <rect key={i} x={-120 + (i % 7) * 35} y={-66 + Math.floor(i / 7) * 52} width={28} height={40} rx={5} fill={i === 11 ? "#c0352c" : "#e6dcc4"} />)}
  </g>
);
const Q31: React.FC = () => {
  const f = useF();
  const l = loc(150.3);
  const k = ap(f, l(150.4), 24);
  const sello = f > l(152.2);
  const golpe = sello ? 0.12 * Math.max(0, 1 - (f - l(152.2)) / 7) : 0;
  const g = ap(f, l(151.5), 18); // Nan da vuelta el sobre para mostrar la fecha
  const sx = Math.max(0.04, Math.abs(Math.cos(g * Math.PI)));
  const S = 0.55 * (0.45 + 0.55 * k) * (1 + golpe);
  const sostener = { hD: 84, cD: 22, tronco: 4 };
  return (
    <Escena Set={Primer} pal={PAL} seed={69} setProps={{ fondo: "madera" }}
      claves={[mira(0, 960, 560, 1.0), mira(l(152.0), 960, 580, 1.02), mira(l(154.6), 900, 600, 1.2, { curva: "inout" }), mira(l(156.5), 905, 605, 1.22)]}
      medio={<>
        <A look={NAN} escala={2.5} ruta={[{ f: 0, x: 420, y: 1250 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: l(152.3), v: "sorpresa" }, { f: l(153.2), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.8, y: -0.1 } }, { f: l(152.4), v: { x: 0.7, y: 0.3 } }]}
          poses={[{ f: 0, v: { hD: 40, cD: 30 } }, { f: l(150.6), v: sostener }, { f: l(151.5), v: { ...sostener, hD: 92, cD: 30 } }, { f: l(152.1), v: sostener }, ...gestos(l(153.4), l(156.5), [sostener, { ...sostener, hD: 90, cD: 14 }], 20)]}
          enManoD={<g transform={`rotate(94) scale(${sx},1)`}><Sobre x={74} y={60} s={S} rot={-4 * k} t="BEANS" color="#7cc46a" dibujo="poroto" /><SelloSobre x={74} y={60} s={S} rot={-4 * k} t="PACKED FOR 2025" k={sello ? ap(f, l(152.2), 6) : 0} /></g>} />
      </>}
      hud={<>
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><Calendario2025 x={1560} y={740} k={ap(f, l(153.0), 14)} /></svg>
        <Past x={1240} y={90} w={1220} h={96} desde={l(153.0)} /><Rotulo texto="GOOD FOR A FEW YEARS · COOL & DRY" x={1240} y={100} centro desde={l(153.0)} color="#ffcf6e" tam={58} />
      </>} />
  );
};

// ---------- E34 · 156:5-160:6 · el sobre de cebolla pierde el poder: se pone gris y el termómetro baja a 0 ----------
const Q32: React.FC = () => {
  const f = useF();
  const l = loc(156.5);
  const apaga = ap(f, l(157.6), 70);
  return (
    <Escena Set={Primer} pal={PAL} seed={70} setProps={{ fondo: "madera" }} claves={[mira(0, 960, 560, 1.05), mira(l(160.6), 960, 560, 1.15)]}
      medio={<>
        {(() => { const rt = 5 + (f > l(157.2) && f < l(159.2) ? 7 * Math.sin((f - l(157.2)) * 0.7) : 0), g = ap(f, l(157.6), 40);
          return <><Sobre x={920} y={560} s={2.0} rot={rt} t="ONIONS" color="#c99ad8" dibujo="cebolla" gris={g} /><SelloSobre x={920} y={560} s={2.0} rot={rt} t="PACKED FOR 2025" gris={g} /></>; })()}
        <A look={NAN} escala={1.8} ruta={[{ f: 0, x: 520, y: 995 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: l(158.2), v: "duda" }, { f: l(159.4), v: "asco" }]} miradas={[{ f: 0, v: { x: 0.8, y: -0.2 } }]}
          poses={[{ f: 0, v: "pensar" }, ...gestos(l(157.2), l(159.2), [{ hD: 100, cD: 15, tronco: 10 }, { hD: 125, cD: 20, tronco: 4 }], 9), ...(apaga > 0.95 ? [] : []), { f: l(159.5), v: "encogerse" }, { f: l(160.2), v: "manosCintura" }]} />
      </>}
      hud={<><Rotulo texto="ONIONS · 1-2 YEARS" x={1300} y={110} centro desde={l(157.0)} color="#e23a2e" tam={72} />
        <Gotero x={1640} y={300} k={1 - apaga} desde={l(157.2)} rotulo="POWER" color="#c99ad8" /></>} />
  );
};

// ---------- E35 · 160:6-165:6 · Nan, la bibliotecaria, coloca cada sobre (brazo baja cada 20 cuadros): BY TYPE · BY DATE ----------
const Q33: React.FC = () => {
  const f = useF();
  const l = loc(160.6);
  const PS = COCINA_PISO;
  // Nan, DE PIE en la punta de la mesa, toma cada sobre de la pila y lo TIRA en arco a su columna (1 cada ~0,5 s):
  // BEANS · SQUASH · CARROTS · ONIONS; abajo 2025, arriba 2027 → «by type, by date»
  const nombres = ["BEANS", "SQUASH", "CARROTS", "ONIONS"];
  const dib = ["poroto", "zapallo", "zanahoria", "cebolla"] as const;
  const colores = ["#7cc46a", "#f2a03a", "#f08a3c", "#c99ad8"];
  const CX = (c: number) => 1330 + c * 140, S = 0.6, TOPE = PS - 190;
  const N = 8, PER = 16, T0 = l(161.0);
  const tk = (k: number) => T0 + k * PER;
  const agarra = { hD: 38, cD: 34, tronco: 14, hI: 20, cI: 40 }, tira = { hD: 122, cD: 8, tronco: -3, hI: 30, cI: 30 }, medio = { hD: 72, cD: 40, tronco: 6, hI: 24, cI: 40 };
  const poses: { f: number; v: any }[] = [{ f: 0, v: medio }];
  for (let k = 0; k < N; k++) poses.push({ f: tk(k), v: agarra }, { f: tk(k) + 6, v: tira }, { f: tk(k) + 11, v: medio });
  poses.push({ f: tk(N) + 4, v: "manosCintura" }, { f: tk(N) + 30, v: "señalar" }, { f: tk(N) + 50, v: "manosCintura" });
  const fecha = (k: number) => (k < 4 ? "2025" : "2027");
  return (
    <Escena Set={Cocina} pal={PAL} seed={71} claves={camino([[-10, 1400, 560, 1.3], [l(163.4), 1420, 560, 1.35], [l(165.6) + 10, 1440, 556, 1.4]])}
      medio={<>
        <rect x={1150} y={TOPE} width={680} height={22} rx={6} fill="#8a5e3c" />
        <rect x={1170} y={TOPE + 22} width={16} height={168} fill="#6a4a32" /><rect x={1794} y={TOPE + 22} width={16} height={168} fill="#6a4a32" />
        {/* pila de origen (baja de a uno) */}
        {Array.from({ length: N }).map((_, k) => (f < tk(k) ? <g key={`p${k}`} transform={`translate(1215,${TOPE - 6 - (N - 1 - k) * 7}) scale(1,0.35)`}><Sobre x={0} y={0} s={0.42} t="" color={colores[k % 4]} /></g> : null))}
        {/* sobres ya ubicados: aterrizan con un rebote chico */}
        {Array.from({ length: N }).map((_, k) => { const t1 = tk(k) + PER; const c = k % 4, h = Math.floor(k / 4); const xf = CX(c), yf = TOPE - 77 - h * 30;
          if (f < tk(k) + 6) return null;
          if (f < t1) { const u = (f - tk(k) - 6) / (PER - 6); const x0 = 1150, y0 = TOPE - 330; return <Sobre key={k} x={x0 + (xf - x0) * u} y={y0 + (yf - y0) * u - 130 * Math.sin(u * Math.PI)} s={S} rot={-30 + u * 30 + Math.sin(u * 9) * 8} t="" color={colores[c]} dibujo={dib[c]} fecha={fecha(k)} />; }
          const b = Math.max(0, 1 - (f - t1) / 8); return <Sobre key={k} x={xf} y={yf - Math.sin((f - t1) * 0.8) * 10 * b} s={S} rot={(h ? 3 : -2)} t="" color={colores[c]} dibujo={dib[c]} fecha={fecha(k)} />; })}
        {/* rótulos de columna en el canto de la mesa, 28 px */}
        {[0, 1, 2, 3].map((c) => <g key={c} opacity={ap(f, l(161.4) + c * 6, 6)}><rect x={CX(c) - 64} y={TOPE + 26} width={128} height={40} rx={5} fill="#f6efe0" stroke="#c9b48a" strokeWidth={2} /><text x={CX(c)} y={TOPE + 56} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={28} fill="#2a1c18">{nombres[c]}</text></g>)}
        <g opacity={ap(f, l(163.4), 8)}><path d={`M1260,${TOPE + 92} L1800,${TOPE + 92}`} stroke="#ffcf6e" strokeWidth={6} /><text x={1530} y={TOPE + 132} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={32} fill="#ffcf6e" stroke="#1c1416" strokeWidth={5} paintOrder="stroke">BOTTOM 2025 · TOP 2027</text></g>
        <A look={NAN} escala={1.35} ruta={[{ f: -10, x: 1060, y: PS }, { f: l(165.6) + 20, x: 1085, y: PS }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: tk(N) + 4, v: "feliz" }]}
          miradas={[{ f: 0, v: { x: 0.6, y: 0.5 } }, ...Array.from({ length: N }).map((_, k) => ({ f: tk(k) + 5, v: { x: 0.9, y: 0.1 - (k % 4) * 0.05 } }))]}
          poses={poses} enManoD={(ff: number) => { for (let k = 0; k < N; k++) if (ff >= tk(k) && ff < tk(k) + 6) return <Sobre x={0} y={-6} s={0.3} t="" color={colores[k % 4]} />; return null; }} />
      </>}
      hud={<Cartel texto="BY TYPE · BY DATE" x={1240} y={110} desde={l(162.6)} color="#ffcf6e" tam={70} />} />
  );
};

// ---------- E36 · 165:6-169:8 · surco en corte: una mano siembra el doble de semilla vieja; las plantitas brotan; cámara de un surco al otro ----------
const TxM: React.FC<{ x: number; y: number; t: string; tam: number; color: string; k: number }> = ({ x, y, t, tam, color, k }) => (
  <text x={x} y={y + (1 - k) * 20} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={tam} fill={color} stroke="#1c1416" strokeWidth={tam * 0.14} paintOrder="stroke" opacity={k}>{t}</text>
);
const Q34: React.FC = () => {
  const f = useF();
  const l = loc(165.6);
  // Nan camina los dos surcos tirando semilla: el nuevo ralo (8), el viejo el doble de tupido (16); brota la mitad del viejo
  const G = 640, F0 = 4, F1 = l(168.6), XA = 720, XB = 1760;
  const xn = interpolate(f, [F0, F1], [XA, XB], cl);
  const tDe = (x: number) => F0 + ((x - 40 - XA) / (XB - XA)) * (F1 - F0);
  const filas = [{ x0: 680, n: 8 }, { x0: 1320, n: 16 }];
  const semillas = filas.map(({ x0, n }) => Array.from({ length: n }).map((_, i) => x0 + (i + 0.5) * (520 / n)));
  const caidas = semillas.map((xs) => xs.filter((x) => f >= tDe(x)).length);
  const siembra = { hD: 58, cD: 26, hI: 40, cI: 70, tronco: 6 }, tira = { hD: 76, cD: 6, hI: 40, cI: 70, tronco: 9 };
  return (
    <Escena Set={Primer} pal={PAL} seed={72} setProps={{ fondo: "tierra" }}
      claves={camino([[-10, 930, 545, 1.0], [l(167.4), 990, 552, 1.04], [l(169.8) + 10, 1060, 562, 1.08]])}
      medio={<>
        <rect x={-600} y={-700} width={3200} height={1260} fill="#9ab8d8" /><rect x={-600} y={556} width={3200} height={G - 556} fill="#4f9a3c" />
        {filas.map(({ x0 }) => <path key={x0} d={`M${x0 - 20},${G} L${x0 + 540},${G} L${x0 + 500},${G + 220} L${x0 + 20},${G + 220} Z`} fill="#3e2a1e" />)}
        {semillas.map((xs, r) => xs.map((x, i) => { const u = ap(f, tDe(x), 9); if (u <= 0) return null; return <ellipse key={`${r}${i}`} cx={x + (1 - u) * 10} cy={G - 170 + u * (170 + 110 + (i % 3) * 16)} rx={11} ry={8} fill="#e9d6a6" stroke="#8a6a42" strokeWidth={2.5} />; }))}
        <Plantitas x0={680} ancho={520} y={G + 2} n={8} f={f} desde={l(167.4)} s={1.8} />
        <Plantitas x0={1320} ancho={520} y={G + 2} n={16} f={f} desde={l(168.6)} s={1.8} cada={2} />
        <A look={NAN} escala={1.5} ruta={[{ f: -10, x: XA - 30, y: G }, { f: F0, x: XA, y: G }, { f: F1, x: XB, y: G, curva: "lineal" }, { f: l(169.8) + 30, x: XB + 230, y: G }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: l(168.8), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.5, y: 0.7 } }, { f: F1, v: { x: -0.6, y: 0.5 } }]}
          poses={[{ f: 0, v: siembra }, ...gestos(F0, l(169.8) + 30, [siembra, tira], 6)]} enManoI={<Bolsa color="#c9a26a" />} />
        <TxM x={940} y={930} t={`NEW SEED · ${caidas[0]}`} tam={70} color="#f6ecd2" k={ap(f, l(165.8), 10)} />
        <TxM x={1580} y={930} t={`OLD SEED · ${caidas[1]}`} tam={70} color="#ffcf6e" k={ap(f, l(167.4), 10)} />
        <TxM x={1580} y={1010} t="2× THICK" tam={60} color="#ffcf6e" k={ap(f, l(167.8), 10)} />
      </>} />
  );
};

// ---------- E37 · 169:8-172:6 · día 250: los 10 entran caminando con herramientas, polvo y pájaros ----------
const Q35: React.FC = () => {
  const f = useF();
  const l = loc(169.8);
  const herr = (i: number) => (i % 3 === 0 ? <Pala /> : i % 3 === 1 ? <Horquilla /> : <Balde />);
  const x0 = (ff: number) => interpolate(ff, [0, l(172.6)], [2600, 3160]);
  const PA = 125;
  return (
    <Escena Set={Granja} pal={PAL} seed={73} setProps={{ hora: "alba", estacion: "verano", crec: 0 }} claves={[mira(0, 3040, 690, 1.35), mira(l(172.6), 3600, 690, 1.35)]}
      medio={<>
        <Aves f={f} x0={2600} x1={4800} y={230} n={6} dur={120} />
        {LOS10.map((look, i) => <g key={i}>
          <A look={look} escala={(esNino(i) ? NINO : 1) * 1.2} seed={i * 11} ruta={[{ f: 0, x: 2600 + i * PA, y: Y }, { f: l(172.6), x: 3160 + i * PA, y: Y, curva: "lineal" }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }]}
            poses={[{ f: 0, v: "parado" }]} enManoD={herr(i)} />
          <Nube x={x0(f) + i * PA - 10} y={Y + 6} f={f + i * 4} n={4} ancho={30} alto={40} deriva={-50} r0={7} opac={0.4} seed={i} />
        </g>)}
      </>}
      hud={<><Rotulo texto="PLANTING" x={1240} y={110} centro desde={l(170.6)} color="#ffcf6e" tam={96} />
        <Num x={1240} y={250} desde={l(169.9)} f0={l(170.0)} f1={l(171.8)} v0={240} v1={250} pre="DAY " tam={100} color="#f6ecd2" cubica /></>} />
  );
};

// ---------- E38 · 172:6-177:9 · Marcus arranca el tractor, humo negro grande, avanza arando; el grupo salta y aplaude ----------
const Q36: React.FC = () => {
  const f = useF();
  const l = loc(172.6);
  // tractor GRANDE (1,5) con Marcus al volante; arranca con humo negro y ara; los 9 de la derecha SALTAN con los brazos
  // arriba desde «cheers» (174.4), escalonados; a 176 el mini DIESEL > GASOLINE (dos bidones)
  const TS = 1.5, TX0 = 3860;
  const dx = interpolate(f, [l(174.4), l(177.9) + 20], [0, 300], cl);
  const humo = ap(f, l(173.2), 14);
  // brazos ARRIBA y hacia atrás (más de 180°): no pasan por delante de la cara
  const arriba = { hD: 202, cD: -14, hI: 212, cI: -10, tronco: -8, cabeza: -12 }, arriba2 = { hD: 188, cD: -4, hI: 198, cI: -20, tronco: -3, cabeza: -6 };
  const gente = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <Escena Set={Granja} pal={PAL} seed={74} setProps={{ hora: "dia", estacion: "verano", crec: 0 }}
      claves={camino([[-10, 3360, 600, 1.18], [l(174.4), 3420, 600, 1.22], [l(177.9) + 10, 3500, 596, 1.27]])}
      medio={<>
        <rect x={TX0 - 200} y={Y - 14} width={dx + 200} height={26} rx={10} fill="#3a2418" />
        <Tractor x={TX0 + dx} y={Y} s={TS} humo={humo} f={f} rueda={dx * 0.8} />
        {humo > 0 && <g opacity={humo}><Nube x={TX0 + dx + 77 * TS / 1.15} y={Y - 213 * TS / 1.15} f={f} n={11} ancho={36} alto={420} deriva={-220} r0={26} color="#16121a" opac={0.9} seed={3} /></g>}
        <g transform={`translate(${dx},0)`}><A look={MARCUS_VERANO} escala={TS / 1.15} ruta={[{ f: 0, x: TX0 - 80 * TS / 1.15, y: Y - 120 * TS / 1.15 }]}
          dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 90 }]} poses={[{ f: 0, v: { tronco: 4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 80, cD: 40, hI: 70, cI: 40 } }, { f: l(174.6), v: { tronco: 4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 130, cD: 50, hI: 70, cI: 40 } }, ...gestos(l(175.2), l(177.9) + 30, [{ tronco: 4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 118, cD: 62, hI: 70, cI: 40 }, { tronco: 2, pI: 88, rI: 88, pD: 92, rD: 92, hD: 132, cD: 44, hI: 70, cI: 40 }], 12)]}
          caras={[{ f: 0, v: "determinado" }, { f: l(174.2), v: "feliz" }]} miradas={[{ f: 0, v: { x: -0.8, y: 0 } }, { f: l(175.0), v: { x: -0.9, y: -0.2 } }]} /></g>
        {gente.map((i, k) => { const fila = k % 2, x = 2600 + k * 112, y = fila ? Y - 120 : Y + 40, e = (esNino(i) ? NINO * 1.15 : 1) * (fila ? 0.95 : 1.25); const t0 = l(174.4) + k * 3;
          const salto = f > t0 ? (30 + (k % 3) * 10) * Math.abs(Math.sin((Math.PI * (f - t0)) / 18)) : 0;
          return <g key={i} transform={`translate(0,${-salto})`}><A look={LOS10[i]} escala={e} seed={i * 7} ruta={[{ f: 0, x, y }]} dir={[{ f: 0, v: 1 }]}
            poses={[{ f: 0, v: "parado" }, { f: l(173.4) + k, v: "señalar" }, ...gestos(t0, l(177.9) + 30, [arriba, arriba2], 9)]}
            caras={[{ f: 0, v: "duda" }, { f: l(173.4), v: "sorpresa" }, { f: t0, v: "risa" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0 } }]} /></g>; })}
      </>}
      hud={<>
        <Cartel texto="40 ACRES · 1 TRACTOR" x={1240} y={110} desde={l(175.0)} color="#f6ecd2" tam={72} />
        {f >= l(176.0) && <svg width={560} height={220} style={{ position: "absolute", left: 700, top: 186, overflow: "visible", opacity: ap(f, l(176.0), 8), transform: "scale(0.82)", transformOrigin: "280px 0px" }}>
          <rect x={0} y={0} width={560} height={210} rx={18} fill="rgba(14,10,18,0.72)" />
          <g transform="translate(110,160) scale(0.6)"><BidonLiso color="#2f8a4a" t="DIESEL" /></g>
          <text x={280} y={120} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={80} fill="#ffcf6e">&gt;</text>
          <g transform="translate(450,160) scale(0.6)"><BidonLiso color="#d8382c" t="GAS" /></g>
          <text x={110} y={198} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={28} fill="#f6ecd2">DIESEL</text>
          <text x={450} y={198} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={28} fill="#f6ecd2">GASOLINE</text>
        </svg>}
      </>} />
  );
};

// ---------- E39 · 177:9-183:5 · Marcus golpea el bidón vacío (se inclina, sale una gota); la barra de 1 AÑO se vacía ----------
// bidón LISO (sin la X del de piezas4): costillas horizontales, pico, manija
const BidonLiso: React.FC<{ color?: string; t?: string }> = ({ color = "#d8382c", t = "DIESEL" }) => (
  <g>
    <ellipse cx={0} cy={4} rx={80} ry={10} fill="#000" opacity={0.3} />
    <path d="M-70,0 L-70,-150 L-40,-180 L60,-180 L70,-170 L70,0 Z" fill={color} stroke="#1c1416" strokeWidth={5} />
    {[-130, -100, -70].map((y) => <rect key={y} x={-62} y={y} width={124} height={7} rx={3} fill="#000" opacity={0.18} />)}
    <rect x={-20} y={-206} width={40} height={30} fill="#f2c14a" stroke="#1c1416" strokeWidth={4} />
    <path d="M30,-180 L30,-210 L60,-210" stroke="#1c1a1c" strokeWidth={10} fill="none" />
    <text x={0} y={-24} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={26} fill="#f6ecd2">{t}</text>
  </g>
);
const Q37: React.FC = () => {
  const f = useF();
  const l = loc(177.9);
  // Marcus llega al bidón, le da DOS palmadas (lleno: suena macizo), a los ~3 s lo palmea y mira el tractor; la barra
  // «1 YEAR» se LLENA (el gasoil de la granja alcanza un año)
  const golpes = [l(179.6), l(180.9)];
  const w = golpes.reduce((a, g) => a + (f < g ? 0 : 2.5 * Math.exp(-(f - g) / 5) * Math.sin((f - g) * 1.2)), 0);
  const BX = 3120;
  const alto = { hD: 120, cD: 40, tronco: 2, cabeza: -2 }, palma = { hD: 78, cD: 10, tronco: 12, cabeza: 8 };
  return (
    <Escena Set={Granja} pal={PAL} seed={75} setProps={{ hora: "dia", estacion: "verano", crec: 0 }} claves={camino([[-10, 3180, 742, 1.6], [l(180.9), 3225, 736, 1.65], [l(183.5) + 10, 3300, 728, 1.7]])}
      medio={<>
        <Tractor x={3470} y={Y} s={1.15} />
        <g transform={`rotate(${w} ${BX} ${Y}) translate(${BX},${Y}) scale(1.3)`}><BidonLiso color="#2f8a4a" t="DIESEL" /></g>
        <A look={MARCUS_VERANO} ruta={[{ f: -10, x: BX - 330, y: Y }, { f: l(179.2), x: BX - 175, y: Y }, { f: l(182.0), x: BX - 165, y: Y }, { f: l(183.5) + 20, x: BX - 150, y: Y }]} dir={[{ f: 0, v: 1 }]}
          caras={[{ f: 0, v: "determinado" }, { f: l(181.4), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.2 } }, { f: l(181.3), v: { x: 0.9, y: -0.1 } }]}
          poses={[{ f: 0, v: "parado" }, ...golpes.flatMap((g) => [{ f: g - 8, v: alto }, { f: g, v: palma }, { f: g + 8, v: { ...alto, hD: 96 } }]), { f: l(181.5), v: "señalar" }, { f: l(182.4), v: "manosCintura" }, { f: l(183.1), v: "señalar" }]} />
      </>}
      hud={<><Past x={1240} y={78} w={700} h={170} desde={l(179.0)} /><Num x={1240} y={90} desde={l(179.0)} f0={l(179.0)} f1={l(179.1)} v0={1} v1={1} suf=" YEAR" tam={100} rotulo="FARM DIESEL · USABLE" />
        <BarraHud x={1240} y={270} w={620} k={0.06 + 0.94 * ap(f, l(179.4), 90)} desde={l(179.2)} color="#f2b81e" rotulo="1 YEAR" /></>} />
  );
};

// ---------- E40 · 183:5-186:7 · el tractor se aleja; los 10 lo miran irse en primer plano; es la última primavera garantizada ----------
const Q38: React.FC = () => {
  const f = useF();
  const l = loc(183.5);
  const x = interpolate(f, [0, l(186.7)], [3800, 5200]);
  const listas: Pz[][] = [["manosCintura", "pensar"], ["brazosCruzados", "encogerse"], ["saludar", "parado"], ["manosCara", "brazosCruzados"], ["encogerse", "manosCintura"]];
  return (
    <Escena Set={Granja} pal={PAL} seed={76} setProps={{ hora: "ocaso", estacion: "verano", crec: 0.05 }} claves={[mira(0, 3500, 640, 1.1), mira(l(186.7), 3530, 640, 1.1)]}
      medio={<>
        <Tractor x={x} y={Y} s={1.0} humo={1 - ap(f, l(185.0), 40)} f={f} rueda={x * 0.8} />
        <Nube x={x - 220} y={Y - 4} f={f} n={8} ancho={100} alto={60} deriva={-120} r0={14} color="#cdb894" opac={0.5} />
        {[1, 2, 3, 4, 5].map((i, k) => <A key={i} look={LOS10[i]} escala={1.7} seed={i * 5} ruta={[{ f: 0, x: 2990 + k * 160, y: Y + 70 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: k % 2 ? "cansado" : "triste" }]} miradas={[{ f: 0, v: { x: 0.5, y: 0 } }, { f: l(184.4) + k * 4, v: { x: 0.9, y: -0.1 } }]}
          giros={[{ f: 0, v: 0.1 }, { f: l(184.4) + k * 4, v: 0.5 }, { f: l(185.8) + k * 4, v: 0.95 }]}
          poses={[{ f: 0, v: "parado" }, ...gestos(l(183.9) + k * 5, l(186.7), listas[k], 24)]} />)}
      </>}
      hud={<><Past x={1240} y={95} w={1020} h={96} desde={l(184.0)} /><Rotulo texto="THE LAST GUARANTEED SPRING" x={1240} y={106} centro desde={l(184.0)} color="#f6ecd2" tam={60} brillo={false} /></>} />
  );
};

// ---------- E41 · 186:7-191:8 · Marcus reparte palas: cada una vuela en arco y la atrapa el siguiente (zoom 1.4 a Marcus y Lily) ----------
const Q39: React.FC = () => {
  const f = useF();
  const l = loc(186.7);
  // Marcus saca palas de su pila y las tira en arco; cada uno la atrapa ABAJO (horizontal, a la altura de la cintura) y la
  // CLAVA en la tierra a su costado: ninguna pala cruza una cara. 150 px entre cabezas, mellizos separados.
  const orden = [9, 8, 1, 2, 3, 4, 5, 6, 7];
  const XK = (k: number) => 2560 + k * 150;
  const th = (k: number) => l(187.1) + k * 13;
  const dur = (k: number) => 14 + k;
  const MX = 2330;
  const mPoses: { f: number; v: any }[] = [{ f: 0, v: "parado" }];
  orden.forEach((_, k) => mPoses.push({ f: th(k) - 9, v: "agacharse" }, { f: th(k) - 4, v: "tirarCarga" }, { f: th(k), v: "tirarSuelta" }));
  mPoses.push({ f: th(8) + 10, v: "manosCintura" });
  const atrapa = { hD: 40, cD: 50, hI: 40, cI: 50, tronco: 6 };
  return (
    <Escena Set={Granja} pal={PAL} seed={77} setProps={{ hora: "dia", estacion: "verano", crec: 0.05 }} claves={camino([[-10, 2880, 662, 1.18], [l(189.6), 2940, 660, 1.2], [l(191.8) + 10, 3000, 656, 1.22]])}
      medio={<>
        {/* pila de palas de Marcus (baja de a una) */}
        {orden.map((_, k) => (f < th(k) - 4 ? <g key={`pp${k}`} transform={`translate(${MX - 110 + k * 7},${Y - 30}) rotate(${-70 + k * 3})`}><Pala /></g> : null))}
        <A look={MARCUS_VERANO} escala={1.25} ruta={[{ f: -10, x: MX - 10, y: Y }, { f: l(191.8) + 20, x: MX + 10, y: Y }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: th(8) + 10, v: "feliz" }]} poses={mPoses}
          enManoD={(ff: number) => { for (let k = 0; k < 9; k++) if (ff >= th(k) - 4 && ff < th(k)) return <g transform="rotate(-40)"><Pala /></g>; return null; }} />
        {orden.map((i, k) => { const tc = th(k) + dur(k), tp = tc + 9; const n = esNino(i); const e = n ? NINO * 1.4 : 1.1;
          return <g key={i}>
            {f >= tp && <g transform={`translate(${XK(k) + 62 * e},${Y - 70 * e + 26 * e * Math.max(0, 1 - (f - tp) / 4)}) scale(${e * 0.95})`}><Pala /></g>}
            <A look={LOS10[i]} escala={e} seed={i * 3} ruta={[{ f: -10, x: XK(k) + 12, y: Y }, { f: l(191.8) + 20, x: XK(k) - 6, y: Y }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: i % 2 ? "duda" : "determinado" }, { f: tc, v: "feliz" }]}
              miradas={[{ f: 0, v: { x: -0.8, y: -0.1 } }, { f: tc + 2, v: { x: 0.4, y: 0.4 } }, { f: tp + 6, v: { x: -0.7, y: 0 } }]}
              poses={[{ f: 0, v: "parado" }, { f: tc - 8, v: atrapa }, { f: tc + 4, v: { ...atrapa, tronco: 14 } }, { f: tp, v: { hD: 30, cD: 20, tronco: 4 } }, ...gestos(tp + 10, l(191.8) + 30, ["manosCintura", "parado"], 26 + k * 2)]}
              enManoD={(ff: number) => (ff >= tc && ff < tp ? <g transform="rotate(90)"><Pala /></g> : null)} />
          </g>; })}
        {orden.map((i, k) => { const u = ap(f, th(k), dur(k)); if (u <= 0 || u >= 1) return null; const x = MX + 70 + (XK(k) - 30 - MX - 70) * u, y = Y - 260 + 90 * u - 170 * Math.sin(u * Math.PI); return <g key={`v${i}`} transform={`translate(${x},${y}) rotate(${-60 + u * 330}) scale(0.8)`}><Pala /></g>; })}
      </>}
      hud={<><Past x={1240} y={105} w={720} h={104} desde={l(189.6)} /><Rotulo texto="LEARN BOTH WAYS" x={1240} y={118} centro desde={l(189.6)} color="#ffcf6e" tam={74} /></>} />
  );
};

// ---------- E42 · 191:8-194:5 · dos surcos en vista lateral: el tractor rápido contra la gente con palas, con barras y marcador ----------
// ciclo de palear con CLAVES (resorte entre agacharse ↔ tirarCarga), nunca un valor elegido por cuadro (eso daba tirones);
// la tierra está en la pala desde que la clava hasta que la vuelca
const cavar = (f0: number, f1: number, per: number, off: number, a: Pz = "agacharse", b: Pz = "tirarCarga") => {
  const k: { f: number; v: Pz }[] = [];
  for (let t = f0 - per + (((off % per) + per) % per); t < f1 + per; t += per) k.push({ f: t, v: a }, { f: t + per / 2, v: b });
  return k;
};
const conTierra = (f: number, f0: number, per: number, off: number) => { const p = ((((f - f0 - (((off % per) + per) % per)) % per) + per) % per) / per; return p > 0.3 && p < 0.85; };
const Q40: React.FC = () => {
  const f = useF();
  const l = loc(191.8);
  // arriba: Marcus MANEJA el tractor (arranca suave desde el cuadro 0, sin salto en 192); abajo: tres a pala (Theo
  // arrodillado poniendo semilla en el surco), cámara más arriba para que se vean las caras
  const F1 = l(194.5) + 10;
  const kk = (ff: number) => { const u = Math.max(0, Math.min(1, ff / F1)); return u * u * (1.6 - 0.6 * u); };
  const k = kk(f);
  const tx = 3060 + 1700 * k;
  const progP = 0.06 * k;
  const camT = camino(Array.from({ length: 9 }).map((_, q) => { const fq = -10 + q * ((F1 + 20) / 8); return [fq, 3060 + 1700 * kk(fq) - 30, 950, 1.2] as KP; }));
  const PERc = 26;
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 540, overflow: "hidden" }}>
        <Escena Set={Granja} pal={PAL} seed={78} setProps={{ hora: "dia", estacion: "verano", crec: 0.05 }} claves={camT}
          medio={<>
            <rect x={3040} y={P - 8} width={Math.max(0, tx - 3040)} height={22} fill="#3a2418" />
            {Array.from({ length: 20 }).map((_, i) => <rect key={i} x={3100 + i * 100} y={P + 24} width={4} height={i % 5 === 0 ? 34 : 18} fill="#f6ecd2" opacity={0.7} />)}
            <Tractor x={tx} y={P + 10} s={1.0} humo={0.9} f={f} rueda={tx} />
            <A look={MARCUS_VERANO} escala={0.87} ruta={[{ f: 0, x: tx - 70, y: P + 10 - 104 }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 90 }]} caras={[{ f: 0, v: "determinado" }]} miradas={[{ f: 0, v: { x: 0.9, y: 0 } }]}
              poses={gestos(-20, F1 + 30, [{ tronco: 6, pI: 88, rI: 88, pD: 92, rD: 92, hD: 82, cD: 40, hI: 76, cI: 44 }, { tronco: 4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 76, cD: 46, hI: 82, cI: 38 }], 14)} />
            <Nube x={tx - 200} y={P} f={f} n={7} ancho={100} alto={60} deriva={-120} r0={12} color="#cdb894" opac={0.55} />
          </>} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 540, width: 1920, height: 540, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: -540, width: 1920, height: 1080 }}>
          <Escena Set={Granja} pal={PAL} seed={79} setProps={{ hora: "dia", estacion: "verano", crec: 0.05 }} claves={camino([[-10, 3640, 560, 1.3], [F1 + 10, 3670, 556, 1.32]])}
            medio={<>
              <rect x={3300} y={Y + 18} width={Math.max(0, 140 + 1700 * progP * 3)} height={18} fill="#3a2418" />
              {/* Theo arrodillado deja papas semilla en el surco */}
              <A look={THEO} escala={1.0} ruta={[{ f: -10, x: 3440, y: Y }, { f: F1 + 20, x: 3470, y: Y }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: { x: 0.5, y: 0.8 } }]}
                poses={cavar(0, F1, 24, 4, "arrodillado", { ...{ tronco: 30, cabeza: 18, hD: 30, cD: 20, pI: 100, rI: 120, pD: 80, rD: 120 } })} enManoD={(ff: number) => (conTierra(ff, 0, 24, 4) ? null : <Papa x={0} y={6} s={0.8} />)} />
              {[JUNE, GUS].map((look, i) => <A key={i} look={look} escala={1.0} ruta={[{ f: -10, x: 3640 + i * 170, y: Y }, { f: F1 + 20, x: 3665 + i * 170, y: Y }]} dir={[{ f: 0, v: 1 }]}
                poses={cavar(0, F1, PERc, i * 9)} caras={[{ f: 0, v: "cansado" }]} enManoD={(ff: number) => <Pala tierra={conTierra(ff, 0, PERc, i * 9)} />} />)}
              <Nube x={3600} y={Y + 8} f={f} n={5} ancho={200} alto={50} deriva={30} r0={9} color="#cdb894" opac={0.4} />
            </>} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 536, width: 1920, height: 8, background: "#f6ecd2", boxShadow: "0 0 14px rgba(0,0,0,0.6)" }} />
      <Cartel texto="TRACTOR" x={1580} y={40} desde={l(192.0)} color="#f6ecd2" tam={72} />
      <BarraHud x={1580} y={160} w={480} k={k} desde={l(192.0)} color="#7cd36a" />
      <Cartel texto="SHOVEL" x={1600} y={566} desde={l(192.6)} color="#ffcf6e" tam={72} />
      <BarraHud x={1600} y={680} w={420} k={progP * 6} desde={l(192.6)} color="#ffcf6e" />
    </>
  );
};

// ---------- E43 · 194:5-197:1 · palear de cerca, con caras de esfuerzo; sube el contador de metros de surco ----------
const Q41: React.FC = () => {
  const f = useF();
  const PER = 30;
  return (
    <Escena Set={Granja} pal={PAL} seed={79} setProps={{ hora: "dia", estacion: "verano", crec: 0.05 }} claves={camino([[-10, 3550, 722, 1.68], [T(1.3), 3580, 718, 1.73], [T(2.6) + 10, 3615, 714, 1.79]])}
      medio={<>{[[THEO, 3380], [JUNE, 3600], [ROSA, 3820]].map(([look, x], i) => <A key={i} look={look as typeof THEO} ruta={[{ f: -10, x: x as number, y: Y }, { f: T(2.6) + 20, x: (x as number) + 22, y: Y }]} dir={[{ f: 0, v: 1 }]}
        poses={cavar(0, T(2.6), PER, i * 11)} caras={[{ f: 0, v: "cansado" }]} enManoD={(ff: number) => <Pala tierra={conTierra(ff, 0, PER, i * 11)} />} />)}</>}
      hud={<><Num x={1500} y={150} desde={4} f0={6} f1={T(2.5)} v0={1} v1={6} suf=" DAYS" tam={96} rotulo="1 ACRE · BY SHOVEL" color="#ffcf6e" />
        <Cartel texto="BY HAND" x={1500} y={330} desde={14} color="#f6ecd2" tam={72} /></>} />
  );
};

// ---------- E44 · 197:1-201:6 · seis días: sol y luna cruzan SIN parpadeo (oscurece suave); corte a 2x con manos ampolladas; DAY 250 → 256 ----------
const Q42: React.FC = () => {
  const f = useF();
  const l = loc(197.1);
  const u = interpolate(f, [l(197.3), l(200.4)], [0, 6], cl);
  const fr = u % 1;
  const noche = u >= 6 ? 0 : 0.34 * Math.pow(Math.sin(Math.PI * Math.max(0, Math.min(1, (fr - 0.3) / 0.6))), 2);
  // dos filas (atrás 0,85 más arriba · adelante 1,0), 170 px entre cabezas de la misma fila; Marcus adelante al centro
  // (pantalla x≈760, cabeza bajo la franja del HUD); cada uno palea con su propio ciclo continuo
  const atras = [6, 5, 4, 3].map((i, k) => ({ i, x: 3555 + k * 170, y: Y - 150, e: 0.85 }));
  const adelante = [1, 0, 7, 8, 9, 2].map((i, k) => ({ i, x: 3300 + k * 170, y: Y + 14, e: 1.0 }));
  const todos = [...atras, ...adelante];
  return (
    <Escena Set={Granja} pal={PAL} seed={80} setProps={{ hora: "dia", estacion: "verano", crec: 0.05 + 0.1 * (u / 6) }}
      claves={camino([[-10, 3640, 690, 1.24], [l(198.4), 3660, 695, 1.3], [l(199.0), 3680, 700, 1.4], [l(201.6) + 10, 3690, 705, 1.48]])}
      detras={<>
        <rect x={-30000} y={-30000} width={62000} height={62000} fill="#0a1230" opacity={noche} />
        {u < 6 && fr < 0.5 && <SolCruza u={fr * 2} x0={2800} x1={4600} y={480} />}
        {u < 6 && fr >= 0.5 && <SolCruza u={(fr - 0.5) * 2} x0={2800} x1={4600} y={480} luna />}
      </>}
      medio={<>{todos.map(({ i, x, y, e }, k) => { const per = 26 + (k % 3) * 4, off = k * 7; return <A key={i} look={LOS10[i]} escala={(esNino(i) ? NINO * 1.15 : 1) * e} seed={i * 7} ruta={[{ f: -10, x, y }, { f: l(201.6) + 20, x: x + 18, y }]} dir={[{ f: 0, v: 1 }]}
        poses={cavar(0, l(201.6), per, off)} caras={[{ f: 0, v: "cansado" }, { f: l(199.2) + k * 2, v: k % 3 === 0 ? "triste" : "cansado" }]} enManoD={(ff: number) => <Pala tierra={conTierra(ff, 0, per, off)} />} />; })}</>}
      hud={<>
        <Cartel texto="10 PEOPLE · 6 DAYS · BLISTERS" x={1240} y={105} desde={l(200.4)} color="#ffcf6e" tam={60} />
        <Num x={1240} y={230} desde={l(197.3)} f0={l(197.3)} f1={l(200.4)} v0={250} v1={256} pre="DAY " tam={100} color="#f6ecd2" cubica />
        <InsertoMano x={1700} y={330} r={100} desde={l(199.3)} f={f} /><InsertoMano x={1830} y={500} r={80} desde={l(199.7)} f={f} />
      </>} />
  );
};

// ---------- E45 · 201:6-204:8 · Gus de cuerpo entero apoyado en la pala, suspira; «Not since 1972.»; contador de manos ampolladas ----------
const Q43: React.FC = () => {
  const f = useF();
  const l = loc(201.6);
  const E = 1.35;
  // 0-1,2 s apoyado en la pala, suspira · 1,2 s la suelta · 1,5-2,3 s se mira las palmas · 2,3-3,2 s se sopla las manos
  const base = { tronco: 12, hD: 40, cD: 60, hI: -20, cI: 90 };
  const mira2 = { tronco: 18, cabeza: 22, hD: 62, cD: 118, hI: 58, cI: 122 };
  const sopla = { tronco: 10, cabeza: 6, hD: 40, cD: 150, hI: 36, cI: 150 };
  const gx = 3400;
  const tSuelta = l(202.8);
  const t = f - tSuelta;
  const cae = t < 0 ? 0 : Math.min(1, t / 14);
  const sus = ap(f, l(202.0), 10) * (1 - ap(f, l(202.5), 8));
  return (
    <Escena Set={Granja} pal={PAL} seed={81} setProps={{ hora: "ocaso", estacion: "verano", crec: 0.15 }} claves={[mira(0, 3420, 636, 1.45), mira(l(204.8), 3430, 630, 1.5)]}
      medio={<>
        <A look={GUS} escala={E} ruta={[{ f: 0, x: gx, y: Y }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: { ...base, cabeza: 8 } }, { f: l(202.1), v: { ...base, tronco: 4, cabeza: -10, hI: -10 } }, { f: l(202.5), v: { ...base, tronco: 16, cabeza: 14 } }, { f: tSuelta, v: { tronco: 6, hD: 20, cD: 10, hI: 15, cI: 10, cabeza: 4 } },
            { f: l(203.1), v: mira2 }, { f: l(203.5), v: { ...mira2, hD: 70, hI: 66, cabeza: 26 } }, { f: l(203.8), v: mira2 }, ...gestos(l(203.9), l(204.9), [sopla, { ...sopla, cabeza: 2, tronco: 8 }], 10)]}
          caras={[{ f: 0, v: "cansado" }, { f: l(203.1), v: "sorpresa" }, { f: l(203.9), v: "picaro" }]} enManoD={(ff: number) => (ff < tSuelta ? <Pala /> : null)} />
        {t >= 0 && <g transform={`translate(${gx + 60 * E + 90 * cae},${Y - 220 * E + 150 * E * cae * cae}) rotate(${62 * cae}) scale(${E})`}><Pala /></g>}
        {sus > 0 && <g opacity={sus}><Soplo x={gx + 40 * E} y={Y - 262 * E} f={f} /></g>}
        {f > l(203.9) && <Soplo x={gx + 44 * E} y={Y - 246 * E} f={f} />}
      </>}
      hud={<><Globo texto="Not since 1972." x={1380} y={330} desde={l(202.4)} hasta={l(204.8)} cola="izq" tam={96} />
        <Num x={1560} y={760} desde={l(201.8)} f0={l(202.0)} f1={l(204.0)} v0={0} v1={20} suf=" HANDS" tam={96} rotulo="BLISTERED" color="#e8908a" /></>} />
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
  [135.5, <Lugar s0={135.5} s1={136.9} cartel="ORGANIC" color="#3f8a3a" sup marca="tilde" n={1} />, { tipo: "barrido", d: 8 }], [136.9, <Lugar s0={136.9} s1={138.4} cartel="GARDEN CENTER" color="#2f6a3a" marca="tilde" n={2} />, { tipo: "barrido", d: 8 }],
  [138.4, <Lugar s0={138.4} s1={139.8} cartel="PROCTOR FARM SUPPLY" color="#8a3a2e" marca="tilde" medioPlano n={3} />, { tipo: "barrido", d: 8 }], [139.8, <Q29 />, { tipo: "barrido", d: 10 }],
  [144.3, <Q30 />, { tipo: "luz", d: 12 }], [150.3, <Q31 />], [156.5, <Q32 />, { tipo: "corte" }], [160.6, <Q33 />, { tipo: "fundido", d: 14 }], [165.6, <Q34 />, { tipo: "barrido", d: 10 }],
  [169.8, <Q35 />, { tipo: "cortina", d: 14, color: "#0b0810" }], [172.6, <Q36 />], [177.9, <Q37 />], [183.5, <Q38 />, { tipo: "fundido", d: 14 }], [186.7, <Q39 />, { tipo: "barrido", d: 10 }],
  [191.8, <Q40 />], [194.5, <Q41 />], [197.1, <Q42 />, { tipo: "luz", d: 12 }], [201.6, <Q43 />],
];
