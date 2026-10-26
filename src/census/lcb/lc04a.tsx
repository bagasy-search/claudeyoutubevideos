// lc04 · planos 0:00-3:24,8 (SEC 1-8 del plan MxM: gancho, la granja, la primera cena, el reloj del verano,
// la cuenta de la papa, las semillas, Nan y los sobres, plantar). Cuadros locales: l(segundo global).
// v1 (director creativo): cada plano con personajes ACTUANDO (gestos) + dato/contador + componente de concepto.
import React from "react";
import { interpolate, random } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Escena } from "../../anikit/escena";
import { Charco, Halo } from "../../anikit/luz";
import { PlanoM } from "../../anikit/montaje";
import { EtiquetaFlotante, F_HUD, Globo } from "../../anikit/pantalla";
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
import { Aves, BarraHud, Cartel, Casillas, Cuchillo, GotasCharco, Gotero, InsertoMano, LlamaQ, LupaGrande, ManoDedos, MapaMillas, MapaPin, Marca, Mazo, Nube, Num, PilaFardos, Plantitas, Ranas, Soplo, ap, cl } from "./piezas_e4a";
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

// golpe amortiguado local (impacto que decae)
const golpeSuave = (f: number, f0: number) => (f < f0 ? 0 : 7 * Math.exp(-(f - f0) / 4) * Math.sin((f - f0) * 1.3));

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
  // Theo (7) alza a Lily (6) entre 1,4 y 3,3 s; Gus (1) cruza los brazos; Rosa (2) se seca la frente
  const sostiene = { tronco: -6, hD: 168, cD: 8, hI: 162, cI: 12, cabeza: -14 };
  const LY = P + 80 - 340; // pies de Lily en alto, sobre las manos de Theo
  const alzada = [{ f: 0, x: 3120, y: P + 80 }, { f: T(1.4), x: 3145, y: P + 80, curva: "lineal" as const }, { f: T(1.75), x: 3307, y: LY }, { f: T(3.1), x: 3331, y: LY, curva: "lineal" as const }, { f: T(3.5), x: 3300, y: P + 80 }, { f: 300, x: 3417, y: P + 80, curva: "lineal" as const }];
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
      claves={[mira(0, 3180, 600, 0.88), mira(T(1.2), 3200, 610, 0.9), mira(T(4.9), 3090, 700, 1.4, { curva: "inout" })]}
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
      hud={<><Past x={1240} y={892} w={1240} h={100} desde={T(1.6)} /><Num x={1240} y={900} desde={T(1.6)} f0={0} f1={1} v0={nContados} v1={nContados} suf={`${nContados === 1 ? " PERSON" : " PEOPLE"} · 1 FARM · 1 SUMMER`} tam={68} color="#f6ecd2" coma={false} /></>} />
  );
};

// ---------- E2 · 4:9-10:2 · la cámara llega a la pared del granero; Marcus PINTA «7,000,000» y el contador KCAL/YEAR rueda ----------
const Q02: React.FC = () => {
  const f = useF();
  const l = loc(4.9);
  return (
    <Escena Set={Granja} pal={PAL} seed={41} mano={2}
      setProps={{ hora: "ocaso", estacion: "verano", crec: 1, humo: 0.5, pared: [{ t: "7,000,000", desde: l(9.0), x: PARED.x + 14, y: PARED.y + 200, tam: 50, color: "#b8382c", vel: 0.8 }, { t: "KCAL / YEAR", desde: l(9.6), x: PARED.x + 40, y: PARED.y + 270, tam: 32, vel: 0.8 }] }}
      claves={[mira(0, 1180, 610, 1.3), mira(l(6.4), 1190, 605, 1.38, { curva: "inout" }), mira(l(10.2), 1200, 605, 1.42)]}
      medio={<>
        <Aves f={f} x0={500} x1={2100} y={200} n={6} dur={150} />
        <A look={MARCUS_VERANO} escala={0.9} ruta={[{ f: 0, x: 845, y: Y }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }]} miradas={[{ f: 0, v: { x: 0.8, y: -0.4 } }]}
          poses={[{ f: 0, v: "parado" }, ...gestos(l(5.1), l(10.2), [{ hD: 105, cD: 18, tronco: 4 }, { hD: 150, cD: 12, tronco: 2 }], 12)]} enManoD={<Brocha color="#b8382c" />} />
      </>}
      hud={<Num x={1440} y={760} desde={l(5.4)} hasta={l(8.8)} f0={l(5.6)} f1={l(8.4)} v0={0} v1={7000000} tam={104} rotulo="KCAL / YEAR" />} />
  );
};

// ---------- E3 · 10:2-13:2 · los 10 pasan cargando cosas; una llamita crece sobre cada uno y el total «2,000/day» suma ----------
const Q03: React.FC = () => {
  const f = useF();
  const l = loc(10.2);
  const dx = interpolate(f, [0, l(13.2)], [0, 260]);
  const cargan: Pz[] = ["parado", "tirarCarga"];
  const cxc = interpolate(f, [0, l(13.2)], [3560, 3720]), zz = interpolate(f, [0, l(13.2)], [1.15, 1.2]);
  return (
    <Escena Set={Granja} pal={PAL} seed={42} setProps={{ hora: "ocaso", estacion: "verano", crec: 1, humo: 0.5 }}
      claves={[mira(0, 3560, 640, 1.15), mira(l(13.2), 3720, 640, 1.2)]}
      medio={<>
        {LOS10.map((look, i) => { const x = 2700 + i * 165 + dx; const n = esNino(i); const k = ap(f, l(10.6) + i * 6, 12); const pulso = 1 + 0.18 * Math.sin(f / 4 + i); const yy = Y - (n ? 330 : 440); const sx = 960 + (x - cxc) * zz; return <g key={i}>
          <A look={look} escala={n ? NINO : 1} seed={i * 5} ruta={[{ f: 0, x: 2700 + i * 165, y: Y }, { f: l(13.2), x: 2700 + i * 165 + 260, y: Y, curva: "lineal" }]} dir={[{ f: 0, v: 1 }]}
            poses={[{ f: 0, v: i % 3 === 0 ? "tirarCarga" : "parado" }, ...gestos(0, l(13.2), i % 3 === 2 ? ["hablar", "manosCintura"] : cargan, 22 + (i % 4) * 3)]}
            enManoD={i % 3 === 0 ? <Bolsa color="#c9a26a" /> : i % 3 === 1 ? <Lata s={0.9} /> : undefined} />
          <g transform={`translate(${x},${yy}) scale(${(0.5 + 0.7 * k) * pulso}) translate(${-x},${-yy})`}><LlamaQ x={x} y={yy} f={f} o={sx > 150 && sx < 1770 ? k : 0} lab={k > 0.85 && sx > 190 && sx < 1730} /></g>
          <Nube x={x - 30} y={Y + 4} f={f + i * 5} n={4} ancho={40} alto={50} deriva={-50} r0={7} opac={0.45} seed={i} />
        </g>; })}
      </>}
      hud={<Num x={1240} y={130} desde={l(10.6)} f0={l(10.7)} f1={l(12.9)} v0={0} v1={20000} suf="/DAY" tam={96} rotulo="10 PEOPLE × 2,000 KCAL" />} />
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
  const rebote = 1 + 0.2 * Math.abs(Math.sin(f / 8));
  const rasca = { hD: 150, cD: 125, tronco: 3 };
  const listas: Pz[][] = [["manosCintura", "pensar"], ["brazosCruzados", "encogerse"], [rasca, "parado"], ["encogerse", "manosCara"], ["parado", "saludar"], ["manosCintura", rasca], ["pensar", "encogerse"], [rasca, "brazosCruzados"], ["encogerse", "parado"], ["manosCintura", "pensar"]];
  // cada uno reacciona en su propio turno (cada 15 cuadros arranca el siguiente); Gus (1) se encoge de hombros, Theo (0) mira a Marcus
  return (
    <Escena Set={Granja} pal={PAL} seed={44} setProps={{ hora: "dia", estacion: "barro", crec: 0, humo: 0.6 }}
      claves={[mira(0, 3310, 620, 1.0), mira(l(22.9), 3310, 690, 1.3, { curva: "inout" })]}
      medio={<>{LOS10.map((_, i) => { const k = ap(f, l(17.8) + i * 6, 8); if (k <= 0) return null; const pop = 1 + 0.5 * Math.max(0, 1 - k * 1.6); const x = 2680 + i * 140, y = Y - (esNino(i) ? 270 : 362) + Math.sin(f / 7 + i) * 6;
        return <text key={i} x={x} y={y} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={64 * pop} fill={i % 2 ? "#ffcf6e" : "#f6ecd2"} stroke="#1c1416" strokeWidth={9} paintOrder="stroke" opacity={k}>?</text>; })}
        <Grupo x0={2680} paso={140} extra={(i) => ({ caras: [{ f: 0, v: i === 0 ? "determinado" : "duda" }, { f: l(20.0) + i * 3, v: i % 3 === 0 ? "cansado" : "triste" }],
        miradas: [{ f: 0, v: { x: (i % 2 ? 0.8 : -0.6), y: 0.2 } }, { f: l(19.4) + i * 5, v: { x: (i % 3 - 1) * 0.7, y: -0.3 } }, { f: l(21.4), v: { x: i === 1 ? 0.8 : -0.8, y: 0.1 } }],
        poses: i === 3 ? [{ f: 0, v: "brazosCruzados" }, { f: l(19.9), v: "encogerse" }, { f: l(20.4), v: "manosCintura" }, { f: l(20.8), v: "encogerse" }, { f: l(21.4), v: "brazosCruzados" }]
          : [{ f: 0, v: "parado" }, ...gestos(l(17.4) + i * 15, l(22.9), listas[i], 15 + (i % 3) * 3)] })} /></>}
      hud={<>
        <Rotulo texto={"Can 10 people grow\na year of food?"} x={1240} y={120} centro desde={l(17.6)} color="#f6ecd2" tam={80} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${rebote})`, transformOrigin: "960px 930px", pointerEvents: "none" }}><Rotulo texto="10 PEOPLE = 1 YEAR?" x={1240} y={900} centro desde={l(19.0)} color="#ffcf6e" tam={74} /></div>
      </>} />
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
  const pop2 = 0.5 + 0.5 * ap(f, l(30.4), 8) + 0.2 * Math.max(0, 1 - Math.abs(f - l(31.3)) / 6) * (f > l(30.4) ? 1 : 0);
  const trazo = ap(f, l(29.0), 70);
  const th = interpolate(f, [0, l(29.4), l(31.5)], [-400, -40, 520], cl);
  return (
    <Escena Set={Granja} pal={PAL} seed={46} setProps={{ hora: "dia", estacion: "barro", crec: 0, humo: 1 }}
      claves={[mira(0, -380, 640, 1.15), mira(l(29.4), 200, 600, 1.05, { curva: "inout" }), mira(l(31.5), 1250, 560, 0.95, { curva: "inout" })]}
      medio={<>
        <Cartel40 x={-560} pop={pop} />
        <Cartel40 x={1880} pop={f > l(30.4) ? pop2 : 0} />
        <path d={`M-220,${P + 18} L2500,${P + 18} L2500,${P + 120} L-220,${P + 120} Z`} fill="none" stroke="#ffcf6e" strokeWidth={18} pathLength={1000} strokeLinecap="round" style={{ strokeDasharray: `${44 * Math.round(10 * trazo)} 1000` }} opacity={0.95} />
        {[[-220, P + 18], [2500, P + 18], [2500, P + 120], [-220, P + 120]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={22 * ap(f, l(29.0) + i * 12, 8)} fill="#f2c14a" stroke="#1c1416" strokeWidth={4} />)}
        <A look={THEO} escala={1.45} ruta={[{ f: 0, x: -400, y: Y }, { f: l(29.4), x: th, y: Y }, { f: l(31.5), x: 520, y: Y, curva: "lineal" }]} dir={[{ f: 0, v: -1 }, { f: l(29.3), v: 1 }]} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: -0.8, y: -0.5 } }, { f: l(29.4), v: { x: 0.8, y: 0 } }]}
          poses={[{ f: 0, v: "señalar" }, ...gestos(l(28.4), l(29.3), ["señalar", "hablar", "señalar"], 20), ...gestos(l(30.0), l(31.5), ["hablar", "señalar", "manosCintura"], 20)]} />
      </>}
      hud={<Num x={1240} y={130} desde={l(28.6)} f0={l(28.8)} f1={l(30.8)} v0={0} v1={40} suf=" ACRES" tam={96} />} />
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
  const ciclo = Math.floor(f / 18) % 3; // 0 agacha · 1 levanta · 2 lanza
  const n = Math.min(8, Math.floor(f / 18));
  const bale = <g transform="translate(-4,-18)"><rect x={-40} y={-26} width={80} height={44} rx={9} fill="#e2c060" stroke="#a78428" strokeWidth={4} /><path d="M-14,-26 L-14,18 M14,-26 L14,18" stroke="#a78428" strokeWidth={3} /></g>;
  return (
    <Escena Set={Granja} pal={PAL} seed={48} setProps={{ hora: "dia", estacion: rec > 0.5 ? "verano" : "barro", crec: rec > 0.5 ? 1 : 0 }}
      claves={[mira(0, 2300, 700, 1.4), mira(l(37.5), 2340, 700, 1.45)]}
      medio={<>
        <PilaFardos x={2520} y={Y - 58} n={n} t={f % 18} />
        <Tractor x={1980} y={Y} s={1.1} />
        <A look={MARCUS_VERANO} escala={1.1} ruta={[{ f: 0, x: 2330, y: Y }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }]} miradas={[{ f: 0, v: { x: 0.6, y: 0.1 } }]}
          poses={[{ f: 0, v: "agacharse" }, ...gestos(0, l(37.5), ["agacharse", "agarrarAlto", "tirarSuelta"], 18)]} enManoD={ciclo > 0 ? bale : undefined} />
        <Nube x={2420} y={Y + 8} f={f} n={4} ancho={70} alto={40} deriva={30} r0={7} opac={0.4} />
      </>}
      hud={<><Past x={1240} y={105} w={900} h={104} desde={4} hasta={l(37.5)} /><Rotulo texto="HAY & SWEET CORN" x={1240} y={118} centro desde={4} hasta={l(37.4)} color="#ffcf6e" tam={64} />
        <Num x={1500} y={250} desde={l(34.8)} hasta={l(37.4)} f0={l(34.9)} f1={l(36.8)} v0={0} v1={20} suf=" YEARS" tam={90} /></>} />
  );
};

// ---------- E10 · 37:5-40:5 · Marcus gira la cabeza hacia los 10 que bajan de las camionetas (todos en cuadro) ----------
const Q10: React.FC = () => {
  const l = loc(37.5);
  const f = useF();
  const abre = { hD: 98, cD: 8, hI: 98, cI: 8, tronco: -3 };
  return (
    <Escena Set={Granja} pal={PAL} seed={49} setProps={{ hora: "dia", estacion: "barro", crec: 0, humo: 1 }}
      claves={[mira(0, 2680, 640, 1.3), mira(l(40.5), 2700, 640, 1.33)]}
      medio={<>
        {[0, 1].map((k) => <Auto key={k} x={3300 + k * 520} y={P + 30} color={["#2f4a5e", "#6a2f36"][k]} tipo="pickup" s={1.2} dir={1} />)}
        <Nube x={3500} y={P + 36} f={f} n={6} ancho={120} alto={60} deriva={-90} r0={12} color="#cdb894" opac={0.5} />
        <Grupo x0={2300} paso={105} solo={[1, 2, 3, 4, 5, 6, 7, 8, 9]} extra={(i) => ({ ruta: [{ f: 0, x: 2440 + (i - 1) * 105 + 200, y: Y - 10 }, { f: l(39.4), x: 2440 + (i - 1) * 105, y: Y - 10 }], dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "cansado" }],
          poses: [{ f: 0, v: "parado" }, ...gestos(l(39.4), l(40.5), i % 2 ? ["encogerse", "parado"] : ["saludar", "manosCintura"], 16)] })} escala={1.12} />
        <A look={MARCUS_VERANO} escala={1.1} ruta={[{ f: 0, x: 2110, y: Y }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "duda" }, { f: l(39.0), v: "determinado" }]}
          giros={[{ f: 0, v: -0.8 }, { f: l(38.2), v: 0.9 }]} miradas={[{ f: 0, v: { x: -0.6, y: 0.1 } }, { f: l(38.2), v: { x: 0.9, y: 0 } }]}
          poses={[{ f: 0, v: "brazosCruzados" }, { f: l(38.4), v: "manosCintura" }, { f: l(38.9), v: abre }, { f: l(39.9), v: "manosCintura" }]} />
      </>}
      hud={<><Past x={1240} y={105} w={1100} h={104} desde={l(38.8)} /><Rotulo texto="NOBODY HAS. NOT AROUND HERE." x={1240} y={118} centro desde={l(38.8)} color="#f6ecd2" tam={56} brillo={false} />
        <MapaPin x={1600} y={232} w={300} desde={l(37.9)} rotulo="10 FED HERE: NEVER" /></>} />
  );
};

// ---------- E11 · 40:5-43:5 · la foto vieja de la granja: siluetas que parpadean en sepia; el contador cuenta años hacia atrás ----------
const Q11: React.FC = () => {
  const f = useF();
  const l = loc(40.5);
  return (
    <Escena Set={Primer} pal={PAL} seed={50} setProps={{ fondo: "pared", luz: "#ffb46a" }}
      claves={[mira(0, 960, 540, 1.0), mira(l(43.5), 990, 540, 1.1)]}
      medio={<>
        <FotoVieja x={1000} y={500} s={2.1} />
        <g transform="translate(1000,500) scale(2.1)">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => { const o = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(f / 5 + i * 1.9)); const bx = -170 + i * 56, sw = Math.sin(f / 9 + i) * 1.6; return <g key={i} opacity={o} transform={`translate(${bx + sw},${44 + (i % 2) * 6})`}>
            <circle r={12} cy={-6} fill="#3a2814" /><rect x={-10} y={4} width={20} height={52} rx={8} fill="#3a2814" /><rect x={-14} y={8} width={28} height={8} rx={4} fill="#3a2814" transform={`rotate(${Math.sin(f / 7 + i) * 8})`} />
          </g>; })}
          <rect x={-205} y={-145} width={410} height={290} fill="#c9a06a" opacity={0.18 + 0.1 * Math.sin(f / 6)} />
        </g>
        <A look={MARCUS_VERANO} escala={1.5} ruta={[{ f: 0, x: 290, y: 995 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "duda" }, { f: l(41.4), v: "determinado" }]} miradas={[{ f: 0, v: { x: 0.8, y: -0.3 } }]}
          poses={[{ f: 0, v: "brazosCruzados" }, { f: l(40.9), v: "señalar" }, ...gestos(l(41.3), l(43.5), ["señalar", "hablar", "señalar", "manosCintura"], 22)]} />
      </>}
      hud={<>
        <Cartel texto="NOT FOR 100 YEARS" x={1180} y={905} desde={l(40.8)} color="#ffcf6e" tam={76} />
        <Num x={1640} y={380} desde={l(40.6)} f0={l(40.8)} f1={l(43.2)} v0={0} v1={100} coma={false} tam={150} color="#e8c88a" rotulo="YEARS BACK" />
      </>} />
  );
};

// mesa larga de la cocina con los 10 sentados (opcional: Marcus de pie en la cabecera)
const SENT = { tronco: 6, pI: 88, rI: 88, pD: 92, rD: 92, hD: 50, cD: 70 };
const MesaLarga: React.FC<{ f: number; marcusDePie?: number; levanta?: number; caras?: (i: number) => string; acciones?: (i: number) => { f: number; v: any }[]; piramide?: boolean; giran?: number; abrelatas?: boolean; latasN?: number; cuchara?: boolean }> = ({ f, marcusDePie, levanta, caras, acciones, piramide, giran, abrelatas, latasN = 9, cuchara }) => {
  const PS = COCINA_PISO;
  const lugares = [[1880, -1], [520, 1], [700, 1], [880, 1], [1060, 1], [1240, -1], [1420, -1], [1600, -1], [1000, 1], [1300, -1]];
  const xk = levanta !== undefined ? interpolate(f, [levanta + 4, levanta + 26], [0, 1], cl) : 1;
  const pA = Math.max(0, Math.min(1, xk * 2)), pB = Math.max(0, Math.min(1, xk * 2 - 1));
  const lataEnMano = levanta !== undefined && f >= levanta - 24;
  const brazoMarcus = levanta === undefined ? "parado" : f >= levanta ? { hD: 88, cD: 62 } : f >= levanta - 24 ? { hD: 105, cD: 30 } : "parado";
  return (
    <>
      {[560, 760, 960, 1180, 1380, 1580].map((sx, i) => <Silla key={i} x={sx} piso={PS} dir={i < 3 ? 1 : -1} color="#b07a4a" />)}
      {(marcusDePie === undefined || f < marcusDePie) && <Silla x={1860} piso={PS} dir={-1} color="#b07a4a" />}
      {LOS10.map((look, i) => {
        if (i >= 8) return null;
        const [x, d] = lugares[i];
        const dePie = i === 0 && marcusDePie !== undefined && f >= marcusDePie;
        const poses = acciones && !dePie ? acciones(i) : [{ f: 0, v: dePie ? brazoMarcus : SENT }];
        return <A key={i} look={look} seed={i * 3} ruta={[{ f: 0, x, y: PS }]} dir={[{ f: 0, v: d as 1 | -1 }]} asiento={dePie ? undefined : [{ f: 0, v: 104 }]}
          poses={poses}
          caras={[{ f: 0, v: (caras ? caras(i) : "neutral") as never }]} miradas={[{ f: 0, v: { x: i === 0 ? -0.8 : d * 0.6, y: 0.2 } }, ...(giran !== undefined && i > 0 ? [{ f: giran + i * 3, v: { x: x < 1880 ? 0.95 : -0.95, y: -0.1 } }] : [])]}
          enManoD={cuchara && i > 0 ? <g transform="rotate(160)"><rect x={-3} y={-4} width={6} height={44} rx={3} fill="#c9cfd6" stroke="#4a4a52" strokeWidth={2} /><ellipse cx={0} cy={46} rx={9} ry={12} fill="#c9cfd6" stroke="#4a4a52" strokeWidth={2} /></g> : i === 0 && lataEnMano ? <g><Lata s={2.2} color="#e0563a" /><g transform="translate(0,-14) scale(1.9)">
            {[["M-14,-12 L14,16", pA], ["M14,-12 L-14,16", pB]].map(([d2, p], j) => (p as number) > 0 ? <g key={j}><path d={d2 as string} pathLength={1} strokeDasharray={`${p} 1`} stroke="#1c1416" strokeWidth={9} strokeLinecap="round" fill="none" /><path d={d2 as string} pathLength={1} strokeDasharray={`${p} 1`} stroke="#e23a2e" strokeWidth={5} strokeLinecap="round" fill="none" /></g> : null)}</g></g> : undefined} />;
      })}
      {/* mellizos de pie al costado, más chicos */}
      <A look={BEN} escala={NINO} ruta={[{ f: 0, x: 380, y: PS }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "feliz" }]} enManoD={<Lata s={0.8} />} poses={acciones ? gestos(0, 1200, ["celebrar", "parado"], 26) : undefined} />
      <A look={LILY} escala={NINO} ruta={[{ f: 0, x: 300, y: PS }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "feliz" }]} poses={acciones ? gestos(0, 1200, ["parado", "saludar"], 22) : undefined} />
      <rect x={480} y={PS - 190} width={1340} height={22} rx={6} fill="#8a5e3c" />
      <rect x={500} y={PS - 168} width={16} height={168} fill="#6a4a32" /><rect x={1784} y={PS - 168} width={16} height={168} fill="#6a4a32" />
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
  const mano = { ...SENT, hD: 34, cD: 140, cabeza: 6 }, plato = { ...SENT, hD: 70, cD: 40, tronco: 10 };
  return gestos((i * 7) % 20, 1500, [plato, mano], 10);
};

// ---------- E12 · 43:5-47:0 · cámara 2x sobre tres comensales: la cuchara a la boca; las latas apiladas al centro con contador ----------
const Q12: React.FC = () => {
  const f = useF();
  const l = loc(43.5);
  const abre = (i: number) => (i === 0 ? gestos(0, 1500, [{ ...SENT, hD: 55, cD: 95, hI: 50, cI: 100, tronco: 10 }, { ...SENT, hD: 78, cD: 70, hI: 70, cI: 82, tronco: 6 }], 10) : comer(i));
  // las latas aparecen sobre la mesa de a una (conteo visible): 0 → 9
  const nLatas = Math.min(9, Math.max(0, Math.floor(interpolate(f, [l(44.4), l(46.2)], [0, 9.99], cl))));
  return (
    <Escena Set={Cocina} pal={PAL} seed={51} claves={[mira(0, 1150, 640, 1.1), mira(l(44.3), 1060, 640, 1.4, { curva: "inout" }), mira(l(47.0), 1180, 630, 1.45, { curva: "inout" })]}
      medio={<MesaLarga f={f} caras={(i) => (i % 2 ? "feliz" : "neutral")} acciones={abre} abrelatas latasN={nLatas} cuchara />}
      hud={<>
        <Past x={1240} y={105} w={1060} h={96} desde={l(44.8)} /><Rotulo texto="NOT GOING TO STARVE THIS YEAR" x={1240} y={118} centro desde={l(44.8)} color="#7cd36a" tam={52} />
        <Past x={1700} y={868} w={330} h={150} desde={l(44.4)} /><Num x={1700} y={880} desde={l(44.4)} f0={l(44.4)} f1={l(44.5)} v0={nLatas} v1={nLatas} suf={nLatas === 1 ? " CAN" : " CANS"} tam={72} rotulo="ON THE TABLE" />
      </>} />
  );
};

// ---------- E13 · 47:0-50:2 · recuerdo: las góndolas de Duluth siguen llenas; una clienta empuja el carrito lleno («STILL FULL») ----------
const Q13: React.FC = () => {
  const f = useF();
  const l = loc(47.0);
  const X = interpolate(f, [0, l(50.2)], [820, 2060], cl);
  return (
    <Escena Set={Supermercado} pal={PAL} seed={52} claves={[mira(0, 1100, 640, 1.75), mira(l(50.2), 2120, 640, 1.8, { curva: "inout" })]}
      medio={<>
        {/* el cartel de precio del Set queda tapado: el guion no da precios («still full of canned food») */}
        <rect x={2260} y={SUPER_PISO - 380} width={180} height={50} rx={6} fill="#ffcf3a" />
        <text x={2350} y={SUPER_PISO - 344} fontFamily={F_HUD} fontWeight={600} fontSize={30} fill="#7a2016" textAnchor="middle">CANS</text>
        <Carrito x={X + 230} y={SUPER_PISO} dir={1} lleno={ap(f, l(48.4), 60)} rueda={X * 0.5} />
        <A look={PRIYA} ruta={[{ f: 0, x: 820, y: SUPER_PISO }, { f: l(50.2), x: 2060, y: SUPER_PISO, curva: "lineal" }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "empujar" }]} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.8, y: -0.1 } }]} />
      </>}
      hud={<>
        <Past x={1240} y={105} w={900} h={104} desde={l(47.6)} /><Rotulo texto="CANS · RICE · PASTA" x={1240} y={118} centro desde={l(47.6)} color="#ffcf6e" tam={70} />
        <Cartel texto="STILL FULL" x={1300} y={300} desde={l(49.0)} color="#ff6a4a" tam={100} />
      </>} />
  );
};

// ---------- E14 · 50:2-57:5 · Marcus se para en la cabecera, levanta una lata (zoom a la lata con X): «The cans are not food.» ----------
const Q14: React.FC = () => {
  const f = useF();
  const l = loc(50.2);
  return (
    <Escena Set={Cocina} pal={PAL} seed={53}
      claves={[mira(0, 1250, 600, 1.05), mira(l(51.0), 1300, 600, 1.1), mira(l(53.4), 1880, 590, 1.6, { curva: "inout" }), mira(l(57.5), 1885, 585, 1.72)]}
      medio={<MesaLarga f={f} marcusDePie={l(50.8)} levanta={l(53.8)} giran={l(54.0)} caras={(i) => (i === 0 ? "determinado" : "duda")} acciones={(i) => gestos(0, 1500, i % 2 ? [SENT, { ...SENT, hD: 70, cD: 100 }] : [{ ...SENT, hD: 70, cD: 100 }, SENT], 36 + i * 3)} />}
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
      claves={[mira(0, 1040, 560, 0.9), mira(l(64.0), 1040, 560, 1.0, { curva: "inout" })]}
      medio={<>
        <g transform={`rotate(${180 * (1 - e)} 900 540)`}><RelojLatas x={900} y={540} s={0.95} k={k} f={f} /></g>
        {/* Marcus DA VUELTA el reloj con las dos manos (0-1 s), camina a su lado, lo señala y al final cruza los brazos */}
        <A look={MARCUS_VERANO} escala={1.7} ruta={[{ f: 0, x: 1140, y: 1010 }, { f: 40, x: 1140, y: 1010 }, { f: l(59.9), x: 1480, y: 1010 }]}
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
  const nod = (i: number) => {
    if (i === 0) return [{ f: 0, v: SENT }, ...gestos(l(67.0), l(69.1), [{ ...SENT, hD: 68, cD: 40, hI: 30, cI: 60, tronco: 8 }, { ...SENT, hD: 90, cD: 10, hI: 30, cI: 60, tronco: 12 }], 7)];
    if (i !== 1) return gestos(0, 1500, i % 2 ? [SENT, { ...SENT, hD: 70, cD: 100 }] : [{ ...SENT, hD: 70, cD: 100 }, SENT], 40 + i * 3);
    const d = { ...SENT, cabeza: 18, tronco: 10 }, u = { ...SENT, cabeza: -4 };
    return [{ f: 0, v: SENT }, { f: l(65.8), v: d }, { f: l(66.0), v: u }, { f: l(66.2), v: d }, { f: l(66.4), v: u }, { f: l(67.2), v: d }, { f: l(67.4), v: u }];
  };
  return (
    <Escena Set={Cocina} pal={PAL} seed={55} claves={[mira(0, 1150, 640, 1.1), mira(l(65.2), 900, 650, 1.3, { curva: "inout" }), mira(l(67.0), 860, 650, 1.35), mira(l(68.2), 1700, 640, 1.5, { curva: "inout" }), mira(l(69.1), 1720, 640, 1.55)]}
      medio={<MesaLarga f={f} caras={(i) => (i === 0 ? "determinado" : i === 1 && f > l(66.8) ? "determinado" : i === 1 ? "feliz" : "duda")} acciones={nod} />}
      hud={<>
        <Past x={1240} y={105} w={1060} h={96} desde={l(65.0)} /><Rotulo texto="A FULL YEAR OF FOOD. ON PURPOSE." x={1240} y={118} centro desde={l(65.0)} color="#ffcf6e" tam={50} />
        <Num x={1600} y={230} desde={l(65.4)} f0={l(65.5)} f1={l(68.0)} v0={0} v1={365} suf=" DAYS" tam={86} rotulo="× 10 PEOPLE" />
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
  const x0 = D.x + 26, x1 = D.x + D.w - 26, yb = D.y + 70;
  const sol = interpolate(f, [l(79.6), l(81.8)], [0, 1], cl);
  const copo = (x: number, a: number, t: string) => { const k = ap(f, a, 8); return k > 0 ? <g opacity={k} transform={`translate(${x},${yb - 30}) scale(${0.6 + 0.4 * k})`}>{[0, 60, 120].map((r) => <rect key={r} x={-2} y={-18} width={4} height={36} fill="#5a9ad8" transform={`rotate(${r})`} />)}<text y={44} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={16} fill="#2a1c18">{t}</text></g> : null; };
  const bx = D.x + D.w + 70;
  return (
    <Escena Set={Granja} pal={PAL} seed={57} mano={1.5}
      setProps={{ hora: "dia", estacion: "barro", crec: 0, pared: [{ t: "DAYS LEFT", desde: l(84.3), x: D.x + 30, y: D.y + 190, tam: 34, vel: 0.9 }, { t: "IN SUMMER", desde: l(85.0), x: D.x + 24, y: D.y + 232, tam: 34, vel: 0.9 }, { t: "115", desde: l(86.6), x: D.x + 56, y: D.y + 330, tam: 84, color: "#b8382c", vel: 1.6 }] }}
      claves={[mira(0, D.x + 110, 600, 2.3), mira(l(72.6), D.x + 110, 600, 2.4), mira(l(76.6), D.x + 190, 570, 2.6, { curva: "inout" }), mira(l(79.4), D.x + 115, 580, 2.3, { curva: "inout" }), mira(l(83.6), D.x + 115, 585, 2.35), mira(l(84.4), D.x + 190, 680, 1.45, { curva: "inout" }), mira(l(88.8), D.x + 210, 670, 1.5)]}
      medio={<>
        <rect x={x0} y={yb - 6} width={x1 - x0} height={12} rx={6} fill="#c9b48a" />
        <rect x={x0} y={yb - 6} width={(x1 - x0) * sol} height={12} rx={6} fill="#f2b81e" />
        {sol > 0 && <Halo x={x0 + (x1 - x0) * sol} y={yb} r={60} color="#fff0a0" fuerza={0.7} />}
        {copo(x0, l(72.4), "MAY 20")}{copo(x1, l(76.6), "SEP 15")}
        <A look={MARCUS_VERANO} ruta={[{ f: 0, x: bx, y: P - 20 }, { f: l(84.6), x: bx, y: P - 20 }, { f: l(85.7), x: bx + 90, y: P - 20 }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "determinado" }, { f: l(86.2), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.8, y: -0.3 } }, { f: l(85.7), v: { x: -0.8, y: -0.4 } }]}
          poses={[{ f: 0, v: "parado" }, ...gestos(l(72.0), l(84.5), [{ hD: 105, cD: 22, tronco: 3 }, { hD: 140, cD: 15, tronco: 1 }], 12), { f: l(85.5), v: "brazosCruzados" }, { f: l(87.8), v: "manosCintura" }]} enManoD={(ff: number) => (ff < l(85.3) ? <Brocha /> : null)} />
      </>}
      hud={<>
        <Rotulo texto="110-120 DAYS" x={1240} y={140} centro desde={l(80.4)} hasta={l(83.8)} color="#ffcf6e" tam={88} />
        <><Past x={420} y={500} w={420} h={250} desde={l(72.6)} hasta={l(84.2)} /><Num x={420} y={520} desde={l(72.6)} hasta={l(84.2)} f0={l(79.6)} f1={l(81.8)} v0={120} v1={115} tam={120} rotulo="DAYS LEFT" color="#ffb04a" /></>
      </>} />
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
        <A look={MARCUS_VERANO} escala={1.3} ruta={[{ f: 0, x: 1800, y: P - 20 }, { f: l(89.2), x: 1800, y: P - 20 }, { f: l(90.4), x: 2300, y: Y }]} dir={[{ f: 0, v: -1 }, { f: l(89.2), v: 1 }]} caras={[{ f: 0, v: "determinado" }]} enManoD={<Brocha />} />
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
  // Marcus (escala 1.3) se para al costado de cada esquina: la maza cae justo sobre la estaca
  const ex = (i: number) => CX - L / 2 + esq[i][0] * L, ey = (i: number) => CY - L / 2 + esq[i][1] * L;
  const dd = [1, -1, -1, 1];
  const px = esq.map((_, i) => ex(i) - dd[i] * 150), py = esq.map((_, i) => ey(i) + 120);
  const ruta: { f: number; x: number; y: number }[] = [{ f: 0, x: px[0], y: py[0] }];
  esq.forEach((_, i) => { ruta.push({ f: Math.max(1, tHit(i) - 14), x: px[i], y: py[i] }, { f: tHit(i) + 6, x: px[i], y: py[i] }); });
  ruta.push({ f: l(103.2), x: px[3], y: py[3] }, { f: l(104.3), x: 260, y: py[3] });
  const dirs = [{ f: 0, v: 1 as const }, { f: tHit(1) - 14, v: -1 as const }, { f: tHit(3) - 14, v: 1 as const }, { f: l(103.2), v: -1 as const }];
  const arriba = { hD: 160, cD: 14, tronco: -4, cabeza: -6 }, golpe = { hD: 62, cD: 0, tronco: 22, cabeza: 10 };
  const poses: { f: number; v: any }[] = [{ f: 0, v: "parado" }];
  esq.forEach((_, i) => poses.push({ f: tHit(i) - 9, v: arriba }, { f: tHit(i), v: golpe }, { f: tHit(i) + 8, v: "parado" }));
  poses.push({ f: l(102.2), v: "señalar" }, { f: l(103.2), v: "parado" });
  return (
    <Escena Set={Primer} pal={PAL} seed={61} setProps={{ fondo: "tierra" }} mano={1}
      claves={[mira(0, 980, 560, 1.0), mira(l(99.6), 985, 560, 1.02), mira(l(103.6), CX, CY - 20, 1.4, { curva: "inout" }), mira(l(104.4), CX, CY, 1.8, { curva: "inout" }), mira(l(107.3), CX, CY, 0.1, { curva: "inout" })]}
      medio={<>
        <rect x={-30000} y={-30000} width={62000} height={62000} fill="#5a3a28" />
        {Array.from({ length: 180 }).map((_, i) => <ellipse key={`t${i}`} cx={-600 + random(`gx${i}`) * 3200} cy={-500 + random(`gy${i}`) * 2200} rx={5 + random(`gr${i}`) * 12} ry={3 + random(`gq${i}`) * 7} fill={random(`gc${i}`) > 0.5 ? "#4a2e1e" : "#76513a"} />)}
        {grilla > 0 && <g opacity={grilla}>{Array.from({ length: 121 }).map((_, i) => <g key={i}><rect x={CX - L / 2 + (i - 60) * L - 4} y={-25000} width={8 + 30 * grilla} height={50000} fill="#e9dcc0" opacity={0.55} /><rect y={CY - L / 2 + (i - 60) * L - 4} x={-25000} height={8 + 30 * grilla} width={50000} fill="#e9dcc0" opacity={0.55} /></g>)}</g>}
        {esq.map((_, i) => { const k = ap(f, tHit(i), 5); return <g key={i} opacity={k}><rect x={ex(i) - 9} y={ey(i) - 30 + (1 - k) * -24} width={18} height={30 + 14 * (1 - k)} fill="#c9a36a" stroke="#6a4a32" strokeWidth={4} />{f >= tHit(i) && f < tHit(i) + 12 && <circle cx={ex(i)} cy={ey(i) - 30} r={10 + (f - tHit(i)) * 4} fill="none" stroke="#f6efe0" strokeWidth={4} opacity={1 - (f - tHit(i)) / 12} />}</g>; })}
        <rect x={CX - L / 2} y={CY - L / 2} width={L} height={L} fill="none" stroke="#f6efe0" strokeWidth={5} strokeDasharray={`${4 * L * ap(f, l(102.2), 30)} 9999`} />
        {[[CX - 60, CY - 30, 0.9], [CX + 60, CY + 50, 1.1]].map(([x, y, s], i) => { const k = ap(f, l(103.0) + i * 14, 8); return k > 0 ? <Papa key={i} x={x} y={y} s={(s as number) * 2 * k} rot={i * 50} /> : null; })}
        <A look={MARCUS_VERANO} escala={1.3} ruta={ruta} dir={dirs} caras={[{ f: 0, v: "determinado" }, { f: l(102.2), v: "feliz" }]} poses={poses} enManoD={(ff: number) => (ff < l(102.1) ? <Mazo /> : null)} />
      </>}
      hud={<>
        <Rotulo texto="1 SQ FT = ½ – 1 LB" x={1240} y={96} centro desde={l(100.4)} hasta={l(104.4)} color="#ffcf6e" tam={76} />
        <Num x={1060} y={330} desde={l(104.2)} f0={l(104.4)} f1={l(106.6)} v0={1} v1={43560} suf=" SQ FT" tam={120} />
        <Rotulo texto="= 1 ACRE" x={1060} y={540} centro desde={l(106.3)} color="#f6ecd2" tam={64} brillo={false} />
        {/* Marcus queda en cuadro: entra a pie y mira cómo la grilla se multiplica hasta el acre */}
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <A look={MARCUS_VERANO} escala={1.0} ruta={[{ f: 0, x: -200, y: 1010 }, { f: l(104.6), x: -200, y: 1010 }, { f: l(105.6), x: 520, y: 1010 }]} dir={[{ f: 0, v: 1 }]}
            caras={[{ f: 0, v: "determinado" }, { f: l(105.8), v: "sorpresa" }, { f: l(106.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0 } }, { f: l(105.6), v: { x: 0.7, y: -0.6 } }]}
            poses={[{ f: 0, v: "parado" }, { f: l(105.7), v: "manosCintura" }, { f: l(106.2), v: "señalar" }, { f: l(106.9), v: "celebrar" }]} />
        </svg>
      </>} />
  );
};

// ---------- E23 · 107:3-116:8 · Marcus y Theo cargan papas a la montaña (ida y vuelta); el total sube a ~20,000 LB ----------
const Q23: React.FC = () => {
  const f = useF();
  const l = loc(107.3);
  const n = Math.floor(interpolate(f, [l(107.8), l(111.6)], [0, 150], cl));
  const L1 = l(116.8);
  const trayecto = (off: number) => idaVuelta(1280, 1720, off, 54, Math.ceil((L1 - off) / 54));
  return (
    <Escena Set={Granja} pal={PAL} seed={62} setProps={{ hora: "ocaso", estacion: "verano", crec: 1 }}
      claves={[mira(0, 1900, 600, 1.12), mira(l(111.6), 1900, 560, 1.15), mira(l(116.8), 1900, 550, 1.18)]}
      medio={<>
        {Array.from({ length: n }).map((_, i) => { const fl = Math.floor(Math.sqrt(i)); const ancho = Math.max(60, 520 - fl * 40); return <Papa key={i} x={2000 + (random(`mx${i}`) - 0.5) * ancho} y={P + 30 - fl * 26 + random(`my${i}`) * 10} s={1.4} rot={random(`mr${i}`) * 180} />; })}
        <A look={MARCUS_VERANO} ruta={trayecto(0)} poses={[{ f: 0, v: "tirarCarga" }]} caras={[{ f: 0, v: "determinado" }]} enManoD={<Bolsa color="#c9a26a" />} />
        <A look={THEO} ruta={trayecto(27)} poses={[{ f: 0, v: "tirarCarga" }]} caras={[{ f: 0, v: "cansado" }]} enManoD={<Bolsa color="#b08a5a" />} />
        <Nube x={1500} y={Y + 6} f={f} n={5} ancho={400} alto={40} deriva={30} r0={9} opac={0.35} />
      </>}
      hud={<>
        <Num x={1240} y={130} desde={l(109.6)} f0={l(109.7)} f1={l(113.0)} v0={0} v1={20000} pre="~" suf=" LB" tam={100} />
        <Cartel texto="≈ 7,000,000 KCAL · WHAT 10 PEOPLE NEED" x={1300} y={250} desde={l(113.8)} color="#7cd36a" tam={50} />
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
          poses={poses} enManoD={(ff: number) => (ff < l(123.2) ? <Cuchillo /> : null)} />
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
  const dx = 900 * u, dy = -330 * Math.sin(u * Math.PI) + 120 * u * u, rt = u * 540;
  const s = 1 + 1.3 * Math.max(0, 1 - (f - l(124.8)) / 7) * (f >= l(124.8) ? 1 : 0);
  const sacude = f >= l(124.8) && f < l(124.8) + 12 ? 8 * Math.sin((f - l(124.8)) * 2.4) * (1 - (f - l(124.8)) / 12) : 0;
  const ue = u * u * (3 - 2 * u);
  return (
    <Escena Set={Primer} pal={PAL} seed={65} setProps={{ fondo: "madera" }} claves={[mira(0, 960, 560, 1.0), mira(l(127.7), 960, 560, 1.08)]}
      medio={<>
        {u < 1 && <g transform={`translate(${dx},${dy + sacude}) rotate(${rt} 960 600)`}>
          <Papa x={960} y={600} s={6} rot={-6} />
          {x > 0 && <path d={`M760,340 L${760 + 400 * x},${340 + 460 * x} M1160,340 L${1160 - 400 * x},${340 + 460 * x}`} stroke="#e23a2e" strokeWidth={30} strokeLinecap="round" />}
        </g>}
        <g transform={`translate(${960 + 540 * ue},${520 - 120 * ue}) rotate(-8) scale(${s})`} opacity={ap(f, l(124.8), 4)}><rect x={-190} y={-50} width={380} height={100} rx={10} fill="rgba(246,239,224,0.92)" stroke="#c0352c" strokeWidth={10} /><text y={26} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={72} fill="#c0352c">TREATED</text></g>
        <A look={ROSA} escala={2.4} ruta={[{ f: 0, x: 320, y: 1160 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "duda" }, { f: l(125.0), v: "asco" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.1 } }]}
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
          poses={[{ f: 0, v: "parado" }, ...gestos(l(129.6), l(131.2), ["agacharse", "parado"], 20), { f: l(131.4), v: { hD: 120, cD: 60, hI: 105, cI: 75, tronco: 4 } }, ...gestos(l(133.0), l(135.5), [{ hD: 120, cD: 60, hI: 105, cI: 75, tronco: 4 }, { hD: 110, cD: 50, hI: 115, cI: 85, tronco: 8 }], 22)]}
          caras={[{ f: 0, v: "duda" }, { f: l(131.6), v: "determinado" }, { f: l(134.0), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.6, y: 0.4 } }, { f: l(131.4), v: { x: 0.5, y: -0.2 } }]}
          enManoD={(ff) => (ff > l(131.2) ? <Papa x={0} y={0} s={1.3} brotes={ap(f, l(131.8), 14)} /> : null)} enManoI={(ff) => (ff > l(131.2) ? <g transform="scale(2)"><Lupa /></g> : null)} />
      </>}
      hud={<><Rotulo texto="20 MILES" x={1240} y={130} centro desde={l(130.0)} color="#ffcf6e" tam={74} /><Rotulo texto="LOOKING FOR EYES" x={1000} y={930} centro desde={l(132.0)} color="#7cd36a" tam={58} />
        <MapaMillas x={1330} y={200} k={ap(f, l(130.2), 70)} desde={l(130.0)} puntos={[l(132.4), l(133.6), l(134.8)]} />
        <LupaGrande x={330} y={660} r={170} desde={l(131.8)} Papa={Papa} brotes={ap(f, l(132.4), 20)} /></>} />
  );
};

// ---------- E28-E30 · 135:5-139:8 · tres lugares: ORGANIC · GARDEN CENTER · PROCTOR FARM SUPPLY ----------
const Lugar: React.FC<{ s0: number; s1: number; cartel: string; color: string; sup?: boolean; marca?: "x" | "tilde"; medioPlano?: boolean; n: number }> = ({ s0, s1, cartel, color, sup, marca, medioPlano, n }) => {
  const f = useF();
  const l = loc(s0);
  const levanta = !!medioPlano;
  const rosa = <A look={ROSA} escala={1.5} ruta={[{ f: 0, x: sup ? 1180 : (medioPlano ? 3420 : 3380), y: sup ? SUPER_PISO : Y }, { f: l(s1), x: sup ? 1420 : (medioPlano ? 3470 : 3430), y: sup ? SUPER_PISO : Y }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: l(s0 + 0.7), v: marca === "x" ? "triste" : "feliz" }]}
    poses={levanta ? [{ f: 0, v: "parado" }, ...gestos(l(s0 + 0.2), l(s1), ["agarrarAlto", "parado"], 14)] : undefined} enManoD={<Bolsa color="#c9a26a" />} enManoI={<Bolsa color="#b08a5a" />} />;
  const caida = ap(f, 2, 12);
  const stops = <Cartel texto={`STOPS ${n}/3`} x={1240} y={110} desde={6} color="#ffcf6e" tam={64} />;
  return sup ? (
    <Escena Set={Supermercado} pal={PAL} seed={Math.round(s0)} claves={[mira(0, 1150, 600, 1.25), mira(l(s1), 1200, 600, 1.3)]}
      medio={<>{rosa}<g transform={`translate(1650,${580 - (1 - caida) * 420})`}><rect x={-190} y={-52} width={380} height={96} rx={8} fill="#f6efe0" stroke={color} strokeWidth={7} /><text y={20} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={58} fill={color}>{cartel}</text></g>{marca && <Marca x={1650} y={430} k={ap(f, l(s0 + 0.5), 10)} tilde={marca === "tilde"} s={1.1} />}</>}
      hud={stops} />
  ) : (
    <Escena Set={Granja} pal={PAL} seed={Math.round(s0)} setProps={{ hora: "dia", estacion: "barro", crec: 0 }} claves={medioPlano ? [mira(0, 3540, 650, 1.55), mira(l(s1), 3560, 650, 1.6)] : [mira(0, 3540, 680, 1.45), mira(l(s1), 3570, 680, 1.52)]}
      medio={<><Puesto x={3700} y={Y - 10} cartel={cartel} color={color} />{rosa}{marca && <Marca x={3960} y={Y - 10 - 330} k={ap(f, l(s0 + 0.5), 10)} tilde={marca === "tilde"} s={1.1} />}</>}
      hud={stops} />
  );
};

// ---------- E31 · 139:8-144:3 · el bus escolar con 1,100 LB de papa semilla; Rosa al volante saluda por la ventana ----------
const Q29: React.FC = () => {
  const f = useF();
  const l = loc(139.8);
  const x = interpolate(f, [0, l(142.6)], [-150, 1500], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  const frena = ap(f, l(142.4), 8) * (1 - ap(f, l(142.8), 8));
  const a = Math.sin(f / 3) * 16;
  const rosa = <g transform="translate(0,-10) scale(2)">
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
      hud={<><Num x={1240} y={90} desde={l(141.0)} f0={l(141.1)} f1={l(142.6)} v0={0} v1={1100} suf=" LB" tam={104} rotulo="SEED POTATOES" />
        <BarraHud x={1240} y={270} w={640} k={ap(f, l(141.1), 45)} desde={l(141.0)} color="#ffcf6e" rotulo="BUS LOAD" /></>} />
  );
};

// ---------- E32 · 144:3-150:3 · la mano de Nan reparte los sobres (lanza uno cada 0,9 s), el primero a los 0,2 s ----------
const SOBRES: { t: string; g: number; d: "poroto" | "zapallo" | "zanahoria" | "repollo" | "choclo" | "cebolla"; c: string; x: number; y: number; r: number }[] = [
  { t: "BEANS", g: 144.6, d: "poroto", c: "#7cc46a", x: 600, y: 500, r: -8 }, { t: "SQUASH", g: 145.2, d: "zapallo", c: "#f2a03a", x: 860, y: 640, r: 6 },
  { t: "CARROTS", g: 145.8, d: "zanahoria", c: "#f08a3c", x: 1120, y: 500, r: -4 }, { t: "CABBAGE", g: 146.4, d: "repollo", c: "#8acb6a", x: 1380, y: 640, r: 9 },
  { t: "CORN", g: 147.0, d: "choclo", c: "#f2d04a", x: 1640, y: 500, r: -6 }, { t: "ONIONS", g: 147.6, d: "cebolla", c: "#c99ad8", x: 1840, y: 640, r: 5 },
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
        {SOBRES.map((s, i) => { const k = ap(f, l(s.g) - 4, 14); if (k <= 0) return null; const e = 1 - Math.pow(1 - k, 2); const x = 460 + (s.x - 460) * e, y = 580 + (s.y - 580) * e - 190 * Math.sin(k * Math.PI);
          return <Sobre key={i} x={x} y={y} s={1.15 * (0.55 + 0.45 * e)} rot={s.r + (1 - e) * -60} t={s.t} color={s.c} dibujo={s.d} />; })}
        <A look={NAN} escala={2.6} ruta={[{ f: 0, x: 330, y: 1270 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: l(147.5), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.2 } }]} poses={poses} />
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
  const S = 0.6 * (0.45 + 0.55 * k) * (1 + golpe);
  const sostener = { hD: 84, cD: 22, tronco: 4 };
  return (
    <Escena Set={Primer} pal={PAL} seed={69} setProps={{ fondo: "madera" }}
      claves={[mira(0, 960, 560, 1.0), mira(l(152.0), 960, 580, 1.02), mira(l(154.6), 900, 600, 1.2, { curva: "inout" }), mira(l(156.5), 905, 605, 1.22)]}
      medio={<>
        <A look={NAN} escala={2.5} ruta={[{ f: 0, x: 420, y: 1250 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: l(152.3), v: "sorpresa" }, { f: l(153.2), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.8, y: -0.1 } }, { f: l(152.4), v: { x: 0.7, y: 0.3 } }]}
          poses={[{ f: 0, v: { hD: 40, cD: 30 } }, { f: l(150.6), v: sostener }, { f: l(151.5), v: { ...sostener, hD: 92, cD: 30 } }, { f: l(152.1), v: sostener }, ...gestos(l(153.4), l(156.5), [sostener, { ...sostener, hD: 90, cD: 14 }], 20)]}
          enManoD={<g transform={`scale(${sx},1)`}><Sobre x={74} y={60} s={S} rot={-4 * k} t="BEANS" color="#7cc46a" dibujo="poroto" fecha={sello ? "PACKED FOR 2025" : undefined} /></g>} />
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
        <Sobre x={1060} y={560} s={2.3} rot={5 + (f > l(157.2) && f < l(159.2) ? 7 * Math.sin((f - l(157.2)) * 0.7) : 0)} t="ONIONS" color="#c99ad8" dibujo="cebolla" fecha="PACKED FOR 2025" gris={ap(f, l(157.6), 40)} />
        <A look={NAN} escala={2.5} ruta={[{ f: 0, x: 300, y: 1250 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: l(158.2), v: "duda" }, { f: l(159.4), v: "asco" }]} miradas={[{ f: 0, v: { x: 0.8, y: -0.2 } }]}
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
  const pilas = Math.min(12, Math.floor(interpolate(f, [l(161.0), l(165.4)], [0, 12], cl)));
  const mano = { tronco: 10, pI: 88, rI: 88, pD: 92, rD: 92, cD: 60 };
  const nombres = ["BEANS", "SQUASH", "CARROTS", "ONIONS"];
  return (
    <Escena Set={Cocina} pal={PAL} seed={71} claves={[mira(0, 1200, 680, 1.7), mira(l(165.6), 1240, 670, 1.9)]}
      medio={<>
        <Silla x={980} piso={PS} dir={1} color="#b07a4a" />
        <A look={NAN} escala={1.5} ruta={[{ f: 0, x: 960, y: PS }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 104 }]} caras={[{ f: 0, v: "determinado" }]} miradas={[{ f: 0, v: { x: 0.6, y: 0.6 } }]}
          poses={gestos(0, 400, [{ ...mano, hD: 30 }, { ...mano, hD: 100, cD: 8 }], 10)} enManoD={Math.floor(f / 10) % 2 === 0 ? <Sobre x={0} y={-6} s={0.28} t="" color="#f2a03a" /> : undefined} />
        <rect x={1060} y={PS - 190} width={500} height={20} rx={6} fill="#8a5e3c" />
        {Array.from({ length: pilas }).map((_, i) => { const c = i % 4, h = Math.floor(i / 4); return <Sobre key={i} x={1130 + c * 110} y={PS - 232 - h * 14} s={0.42} rot={(i % 3) - 1} t="" color={["#7cc46a", "#f2a03a", "#f08a3c", "#c99ad8"][c]} />; })}
        {[0, 1, 2, 3].map((c) => <g key={c} opacity={ap(f, l(161.4) + c * 8, 6)}><rect x={1090 + c * 110} y={PS - 330 - Math.floor(pilas / 4) * 14} width={80} height={34} rx={4} fill="#f6efe0" stroke="#c9b48a" strokeWidth={2} /><text x={1130 + c * 110} y={PS - 306 - Math.floor(pilas / 4) * 14} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={15} fill="#2a1c18">{nombres[c]}</text></g>)}
        <g opacity={ap(f, l(163.4), 8)}><path d={`M1100,${PS - 150} L1520,${PS - 150}`} stroke="#ffcf6e" strokeWidth={6} /><text x={1310} y={PS - 118} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={26} fill="#ffcf6e">2025 → 2027 · BY DATE</text></g>
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
      claves={[mira(0, 960, 540, 1.0), mira(l(169.8), 980, 560, 1.06)]}
      medio={<>
        <rect x={-600} y={-700} width={3200} height={1260} fill="#9ab8d8" /><rect x={-600} y={556} width={3200} height={G - 556} fill="#4f9a3c" />
        {filas.map(({ x0 }) => <path key={x0} d={`M${x0 - 20},${G} L${x0 + 540},${G} L${x0 + 500},${G + 220} L${x0 + 20},${G + 220} Z`} fill="#3e2a1e" />)}
        {semillas.map((xs, r) => xs.map((x, i) => { const u = ap(f, tDe(x), 9); if (u <= 0) return null; return <ellipse key={`${r}${i}`} cx={x + (1 - u) * 10} cy={G - 170 + u * (170 + 110 + (i % 3) * 16)} rx={11} ry={8} fill="#e9d6a6" stroke="#8a6a42" strokeWidth={2.5} />; }))}
        <Plantitas x0={680} ancho={520} y={G + 2} n={8} f={f} desde={l(167.4)} s={1.8} />
        <Plantitas x0={1320} ancho={520} y={G + 2} n={16} f={f} desde={l(168.6)} s={1.8} cada={2} />
        <A look={NAN} escala={1.5} ruta={[{ f: 0, x: XA, y: G }, { f: F0, x: XA, y: G }, { f: F1, x: XB, y: G, curva: "lineal" }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: l(168.8), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.5, y: 0.7 } }]}
          poses={[{ f: 0, v: siembra }, ...gestos(F0, F1, [siembra, tira], 6), { f: F1 + 2, v: "manosCintura" }]} enManoI={<Bolsa color="#c9a26a" />} />
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
  const dx = interpolate(f, [l(174.4), l(177.9)], [0, 330], cl);
  const humo = ap(f, l(173.2), 14);
  return (
    <Escena Set={Granja} pal={PAL} seed={74} setProps={{ hora: "dia", estacion: "verano", crec: 0 }}
      claves={[mira(0, 3150, 600, 1.4), mira(l(174.2), 3200, 600, 1.45), mira(l(175.2), 3700, 680, 1.0, { curva: "inout" }), mira(l(177.9), 3760, 680, 1.02)]}
      medio={<>
        <rect x={2990} y={Y - 14} width={dx + 160} height={26} rx={10} fill="#3a2418" />
        <Tractor x={3150 + dx} y={Y} s={1.15} humo={humo} f={f} rueda={dx * 0.8} />
        {humo > 0 && <g opacity={humo}><Nube x={3150 + dx + 77} y={Y - 213} f={f} n={11} ancho={30} alto={380} deriva={-200} r0={22} color="#16121a" opac={0.9} seed={3} /></g>}
        <g transform={`translate(${dx},0)`}>
          <A look={MARCUS_VERANO} ruta={[{ f: 0, x: 3070, y: Y - 120 }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 90 }]} poses={[{ f: 0, v: "sentado" }, { f: l(174.0), v: { tronco: 4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 160, cD: 20 } }]} caras={[{ f: 0, v: "determinado" }, { f: l(174.0), v: "feliz" }]} />
        </g>
        <Grupo x0={3700} paso={100} escala={1.3} solo={[1, 2, 3, 4, 5, 6, 7, 8, 9]} seed={4}
          extra={(i) => ({ ruta: saltos(3700 + (i - 1) * 100, Y + 20, l(173.8) + i * 2, l(177.9), 10, 34 + (i % 3) * 8), dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: "parado" }, ...gestos(l(173.8) + i * 2, l(177.9), ["celebrar", "saludar"], 10)], caras: [{ f: 0, v: "duda" }, { f: l(173.8) + i * 2, v: "risa" }] })} />
      </>}
      hud={<Cartel texto="40 ACRES · 1 TRACTOR" x={1240} y={900} desde={l(175.0)} color="#f6ecd2" tam={72} />} />
  );
};

// ---------- E39 · 177:9-183:5 · Marcus golpea el bidón vacío (se inclina, sale una gota); la barra de 1 AÑO se vacía ----------
const Q37: React.FC = () => {
  const f = useF();
  const l = loc(177.9);
  const golpes = [l(179.4), l(180.6), l(181.8)];
  const w = golpes.reduce((a, g) => a + (f < g ? 0 : 5 * Math.exp(-(f - g) / 5) * Math.sin((f - g) * 1.2)), 0);
  const gota = ((f - l(180.0)) % 40) / 40;
  const BX = 2780;
  return (
    <Escena Set={Granja} pal={PAL} seed={75} setProps={{ hora: "dia", estacion: "verano", crec: 0 }} claves={[mira(0, 2955, 740, 1.65), mira(l(183.5), 2955, 740, 1.65)]}
      medio={<>
        <Tractor x={3200} y={Y} s={1.15} />
        <g transform={`rotate(${w} ${BX} ${Y})`}><Bidon x={BX} y={Y} s={1.3} /></g>
        {f > l(180.0) && <ellipse cx={BX + 80} cy={Y - 130 + gota * 130} rx={7} ry={11 + gota * 6} fill="#1c1416" />}
        <A look={MARCUS_VERANO} ruta={[{ f: 0, x: BX - 240, y: Y }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: l(179.4), v: "cansado" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.2 } }]}
          poses={[{ f: 0, v: "manosCintura" }, ...gestos(l(179.0), l(183.5), ["tirarCarga", "tirarSuelta", "manosCintura"], 12)]} />
      </>}
      hud={<><Num x={1240} y={90} desde={l(179.0)} f0={l(179.0)} f1={l(179.1)} v0={1} v1={1} suf=" YEAR" tam={100} rotulo="FARM DIESEL · USABLE" />
        <BarraHud x={1240} y={270} w={620} k={1 - 0.93 * ap(f, l(179.4), 100)} desde={l(179.2)} color="#f2b81e" rotulo="TANK" /></>} />
  );
};

// ---------- E40 · 183:5-186:7 · el tractor se aleja; los 10 lo miran irse en primer plano; es la última primavera garantizada ----------
const Q38: React.FC = () => {
  const f = useF();
  const l = loc(183.5);
  const x = interpolate(f, [0, l(186.7)], [3560, 5000]);
  const listas: Pz[][] = [["manosCintura", "pensar"], ["brazosCruzados", "encogerse"], ["saludar", "parado"], ["manosCara", "brazosCruzados"], ["encogerse", "manosCintura"]];
  return (
    <Escena Set={Granja} pal={PAL} seed={76} setProps={{ hora: "ocaso", estacion: "verano", crec: 0.05 }} claves={[mira(0, 3650, 680, 1.1), mira(l(186.7), 3900, 680, 1.05)]}
      medio={<>
        <Tractor x={x} y={Y} s={1.0} humo={1 - ap(f, l(185.0), 40)} f={f} rueda={x * 0.8} />
        <Nube x={x - 220} y={Y - 4} f={f} n={8} ancho={100} alto={60} deriva={-120} r0={14} color="#cdb894" opac={0.5} />
        {[1, 2, 3, 4, 5].map((i, k) => <A key={i} look={LOS10[i]} escala={1.35} seed={i * 5} ruta={[{ f: 0, x: 3160 + k * 140, y: Y + 70 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: k % 2 ? "cansado" : "triste" }]} miradas={[{ f: 0, v: { x: 0.9, y: -0.1 } }]}
          giros={[{ f: 0, v: 0.2 }, { f: l(186.7), v: 0.9 }]}
          poses={[{ f: 0, v: "parado" }, ...gestos(l(183.9) + k * 5, l(186.7), listas[k], 24)]} />)}
      </>}
      hud={<><Past x={1240} y={95} w={1020} h={96} desde={l(184.0)} /><Rotulo texto="THE LAST GUARANTEED SPRING" x={1240} y={106} centro desde={l(184.0)} color="#f6ecd2" tam={60} brillo={false} /></>} />
  );
};

// ---------- E41 · 186:7-191:8 · Marcus reparte palas: cada una vuela en arco y la atrapa el siguiente (zoom 1.4 a Marcus y Lily) ----------
const Q39: React.FC = () => {
  const f = useF();
  const l = loc(186.7);
  const orden = [9, 8, 1, 2, 3, 4, 5, 6, 7];
  const XK = (k: number) => 2490 + k * 125;
  const th = (k: number) => l(187.2) + k * 15;
  const dur = (k: number) => 12 + k * 2;
  return (
    <Escena Set={Granja} pal={PAL} seed={77} setProps={{ hora: "dia", estacion: "verano", crec: 0.05 }} claves={[mira(0, 2640, 700, 1.4), mira(l(190.0), 2780, 700, 1.3), mira(l(191.8), 2980, 700, 1.15)]}
      medio={<>
        <A look={MARCUS_VERANO} escala={1.25} ruta={[{ f: 0, x: 2250, y: Y }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }]} poses={[{ f: 0, v: "parado" }, ...gestos(l(187.0), l(191.8), ["tirarCarga", "tirarSuelta"], 8)]} enManoD={<Pala />} />
        {orden.map((i, k) => <A key={i} look={LOS10[i]} escala={esNino(i) ? NINO * 1.4 : 1.1} seed={i * 3} ruta={[{ f: 0, x: XK(k), y: Y }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: i % 2 ? "duda" : "determinado" }, { f: th(k) + dur(k), v: "feliz" }]}
          poses={[{ f: 0, v: "parado" }, { f: th(k) + dur(k) - 10, v: "agarrarAlto" }, { f: th(k) + dur(k) + 8, v: "parado" }]} enManoD={(ff: number) => (ff >= th(k) + dur(k) ? <Pala /> : null)} />)}
        {orden.map((i, k) => { const u = ap(f, th(k), dur(k)); if (u <= 0 || u >= 1) return null; const x = 2300 + (XK(k) - 2300) * u, y = Y - 240 - 150 * Math.sin(u * Math.PI) * (1 + k * 0.03); return <g key={i} transform={`translate(${x},${y}) rotate(${-60 + u * 420}) scale(0.8)`}><Pala /></g>; })}
      </>}
      hud={<><Past x={1240} y={105} w={720} h={104} desde={l(189.6)} /><Rotulo texto="LEARN BOTH WAYS" x={1240} y={118} centro desde={l(189.6)} color="#ffcf6e" tam={74} /></>} />
  );
};

// ---------- E42 · 191:8-194:5 · dos surcos en vista lateral: el tractor rápido contra la gente con palas, con barras y marcador ----------
const Q40: React.FC = () => {
  const f = useF();
  const l = loc(191.8);
  const k = ap(f, l(192.2), l(194.4) - l(192.2));
  const tx = 3100 + 1700 * k;
  const progP = 0.06 * k;
  const golpe = (i: number) => (Math.floor((f + i * 7) / 12) % 2 ? "agacharse" : "tirarCarga");
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 540, overflow: "hidden" }}>
        <Escena Set={Granja} pal={PAL} seed={78} setProps={{ hora: "dia", estacion: "verano", crec: 0.05 }} claves={[mira(0, 3900, 930, 1.0), mira(l(194.5), 3950, 930, 1.0)]}
          medio={<>
            <rect x={3080} y={P - 8} width={Math.max(0, tx - 3080)} height={22} fill="#3a2418" />
            {Array.from({ length: 18 }).map((_, i) => <rect key={i} x={3100 + i * 100} y={P + 24} width={4} height={i % 5 === 0 ? 34 : 18} fill="#f6ecd2" opacity={0.7} />)}
            <Tractor x={tx} y={P + 10} s={0.95} humo={0.9} f={f} rueda={tx} />
            <Nube x={tx - 200} y={P} f={f} n={7} ancho={100} alto={60} deriva={-120} r0={12} color="#cdb894" opac={0.55} />
          </>} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 540, width: 1920, height: 540, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: -540, width: 1920, height: 1080 }}>
          <Escena Set={Granja} pal={PAL} seed={79} setProps={{ hora: "dia", estacion: "verano", crec: 0.05 }} claves={[mira(0, 3640, 680, 1.7), mira(l(194.5), 3660, 680, 1.7)]}
            medio={<>
              <rect x={3300} y={Y + 18} width={Math.max(0, 140 + 1700 * progP * 3)} height={18} fill="#3a2418" />
              {[0, 1, 2].map((i) => <A key={i} look={LOS10[i + 1]} escala={1.0} ruta={[{ f: 0, x: 3500 + i * 150, y: Y }, { f: l(194.5), x: 3520 + i * 150, y: Y }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: golpe(i) as never }]} caras={[{ f: 0, v: "cansado" }]} enManoD={<Pala tierra={Math.floor((f + i * 7) / 12) % 2 === 0} />} />)}
              <Nube x={3560} y={Y + 8} f={f} n={5} ancho={160} alto={50} deriva={30} r0={9} color="#cdb894" opac={0.4} />
            </>} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 536, width: 1920, height: 8, background: "#f6ecd2", boxShadow: "0 0 14px rgba(0,0,0,0.6)" }} />
      <Cartel texto="TRACTOR" x={1500} y={40} desde={l(192.0)} color="#f6ecd2" tam={72} />
      <BarraHud x={1500} y={160} w={520} k={k} desde={l(192.0)} color="#7cd36a" />
      <Cartel texto="SHOVEL" x={1620} y={566} desde={l(192.6)} color="#ffcf6e" tam={72} />
      <BarraHud x={1620} y={680} w={460} k={progP * 6} desde={l(192.6)} color="#ffcf6e" />
    </>
  );
};

// ---------- E43 · 194:5-197:1 · palear de cerca, con caras de esfuerzo; sube el contador de metros de surco ----------
const Q41: React.FC = () => {
  const f = useF();
  const ciclo = (i: number) => (Math.floor((f + i * 9) / 16) % 2 ? "agacharse" : "tirarCarga");
  return (
    <Escena Set={Granja} pal={PAL} seed={79} setProps={{ hora: "dia", estacion: "verano", crec: 0.05 }} claves={[mira(0, 3560, 720, 1.7), mira(T(2.6), 3600, 720, 1.78)]}
      medio={<>{[[THEO, 3380], [JUNE, 3600], [ROSA, 3820]].map(([look, x], i) => <A key={i} look={look as typeof THEO} ruta={[{ f: 0, x: x as number, y: Y }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: ciclo(i) as never }]} caras={[{ f: 0, v: "cansado" }]} enManoD={<Pala tierra={Math.floor((f + i * 9) / 16) % 2 === 0} />} />)}</>}
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
  return (
    <Escena Set={Granja} pal={PAL} seed={80} setProps={{ hora: "dia", estacion: "verano", crec: 0.05 + 0.1 * (u / 6) }}
      claves={[mira(0, 3660, 690, 1.25), mira(l(198.4), 3660, 690, 1.28), mira(l(198.9), 3650, 745, 1.6, { curva: "inout" }), mira(l(201.6), 3650, 745, 1.62)]}
      detras={<>
        <rect x={-30000} y={-30000} width={62000} height={62000} fill="#0a1230" opacity={noche} />
        {u < 6 && fr < 0.5 && <SolCruza u={fr * 2} x0={2800} x1={4600} y={480} />}
        {u < 6 && fr >= 0.5 && <SolCruza u={(fr - 0.5) * 2} x0={2800} x1={4600} y={480} luna />}
      </>}
      medio={<Grupo x0={3150} paso={110} extra={(i) => ({ poses: [{ f: 0, v: (Math.floor((f + i * 5) / 8) % 2 ? "agacharse" : "parado") as never }], caras: [{ f: 0, v: "cansado" }, { f: l(199.2) + i * 2, v: i % 3 === 0 ? "triste" : "cansado" }], enManoD: <Pala tierra={Math.floor((f + i * 5) / 8) % 2 === 0} /> })} />}
      hud={<>
        <Cartel texto="10 PEOPLE · 6 DAYS · BLISTERS" x={1240} y={105} desde={l(200.4)} color="#ffcf6e" tam={60} />
        <Num x={1240} y={230} desde={l(197.3)} f0={l(197.3)} f1={l(200.4)} v0={250} v1={256} pre="DAY " tam={100} color="#f6ecd2" cubica />
        <InsertoMano x={1560} y={560} r={110} desde={l(199.3)} f={f} /><InsertoMano x={1760} y={700} r={90} desde={l(199.7)} f={f} />
      </>} />
  );
};

// ---------- E45 · 201:6-204:8 · Gus de cuerpo entero apoyado en la pala, suspira; «Not since 1972.»; contador de manos ampolladas ----------
const Q43: React.FC = () => {
  const f = useF();
  const l = loc(201.6);
  const base = { tronco: 12, hD: 40, cD: 60, hI: -20, cI: 90 };
  const mira2 = { tronco: 18, cabeza: 22, hD: 62, cD: 118, hI: 58, cI: 122 };
  const gx = 3400;
  const t = f - l(202.6);
  const cae = t < 0 ? 0 : Math.min(1, t / 14);
  return (
    <Escena Set={Granja} pal={PAL} seed={81} setProps={{ hora: "ocaso", estacion: "verano", crec: 0.15 }} claves={[mira(0, 3420, 740, 1.4), mira(l(204.8), 3430, 735, 1.48)]}
      medio={<>
        <A look={GUS} ruta={[{ f: 0, x: gx, y: Y }]} dir={[{ f: 0, v: 1 }]}
          poses={[...gestos(0, l(202.6), [{ ...base, cabeza: 8 }, { ...base, tronco: 6, cabeza: -4, hI: -10 }], 26), { f: l(202.6), v: mira2 }, ...gestos(l(203.0), l(204.9), [{ ...mira2, hD: 70, hI: 66, cabeza: 26 }, mira2], 12)]}
          caras={[{ f: 0, v: "cansado" }, { f: l(202.8), v: "picaro" }]} enManoD={(ff: number) => (ff < l(202.6) ? <Pala /> : null)} />
        {t >= 0 && <g transform={`translate(${gx + 60 + 70 * cae},${Y - 220 + 220 * cae * cae}) rotate(${40 * cae})`}><Pala /></g>}
        {f > l(203.1) && <Soplo x={gx + 50} y={Y - 190} f={f} />}
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
  [135.5, <Lugar s0={135.5} s1={136.9} cartel="ORGANIC" color="#3f8a3a" sup marca="tilde" n={1} />, { tipo: "barrido", d: 8 }], [136.9, <Lugar s0={136.9} s1={138.4} cartel="GARDEN CENTER" color="#2f6a3a" marca="x" n={2} />, { tipo: "barrido", d: 8 }],
  [138.4, <Lugar s0={138.4} s1={139.8} cartel="PROCTOR FARM SUPPLY" color="#8a3a2e" marca="tilde" medioPlano n={3} />, { tipo: "barrido", d: 8 }], [139.8, <Q29 />, { tipo: "barrido", d: 10 }],
  [144.3, <Q30 />, { tipo: "luz", d: 12 }], [150.3, <Q31 />], [156.5, <Q32 />, { tipo: "corte" }], [160.6, <Q33 />, { tipo: "fundido", d: 14 }], [165.6, <Q34 />, { tipo: "barrido", d: 10 }],
  [169.8, <Q35 />, { tipo: "cortina", d: 14, color: "#0b0810" }], [172.6, <Q36 />], [177.9, <Q37 />], [183.5, <Q38 />, { tipo: "fundido", d: 14 }], [186.7, <Q39 />, { tipo: "barrido", d: 10 }],
  [191.8, <Q40 />], [194.5, <Q41 />], [197.1, <Q42 />, { tipo: "luz", d: 12 }], [201.6, <Q43 />],
];
