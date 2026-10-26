// lc04 · planos 3:24,8-6:24,9 (SEC 9-16 del plan MxM: escarabajos, agua, el sótano, casi, la helada, bajo tierra,
// Lily, CTA y la tarjeta del Ep.5). Cuadros locales: l(segundo global).
import React from "react";
import { interpolate, random } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Escena } from "../../anikit/escena";
import { Cono, Halo } from "../../anikit/luz";
import { PlanoM } from "../../anikit/montaje";
import { Calendario, Globo, Pildora, RelojDia } from "../../anikit/pantalla";
import { Lata } from "../../anikit/props";
import { GUS, JUNE, PAL, THEO } from "../elenco";
import { A, Rotulo, loc } from "./comun_ep";
import { BEN, DEV, LILY, NINO, Ore } from "./elenco_lcb";
import { GRANJA_PISO, GRANJA_PUNTOS, Granja, PARED, Papa, Termometro } from "./granja";
import { LOS10 } from "./lc04a";
import { AireFrio, Balde, Barril, Canasta, Escarabajo, Grietas, HojaMacro, HorquillaPapas, Manometro, Pala, PlantaCerca, Primer, SolCruza, Brocha, horaCiclo } from "./piezas4";
import { Helada4, MARCUS_VERANO, TarjetaEp5 } from "./tarjetas";
import { FarolMano } from "../lcc/piezas";
import { GR_HENIL, GR_PISO, GR_PUNTOS, Granero } from "../lcc/sets5";

const ap = (f: number, a: number, d = 10) => interpolate(f, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const P = GRANJA_PISO;
const Y = P + 60;
const MARCUS = MARCUS_VERANO;
const PAREDES_VERANO = [{ t: "7,000,000", desde: -99, x: PARED.x + 14, y: PARED.y + 70, tam: 46, color: "#b8382c" }];

// ---------- SEC 9 · 204:8-208:3 · las plantas altas; zoom extremo a una hoja ----------
const R01: React.FC = () => {
  const l = loc(204.8);
  return (
    <Escena Set={Granja} pal={PAL} seed={90} setProps={{ hora: "dia", estacion: "verano", crec: 0.75 }}
      claves={[mira(0, 3800, 640, 0.9), mira(l(206.0), 3800, 640, 0.95), mira(l(208.3), 3555, 830, 3.2, { curva: "in" })]}
      hud={<Rotulo texto="A WAR" x={1240} y={160} centro desde={l(205.6)} hasta={l(207.6)} color="#e23a2e" tam={110} />} />
  );
};

// ---------- 208:3-214:5 · macro: escarabajos rayados comen la hoja hasta dejarla de encaje ----------
const R02: React.FC = () => {
  const f = useF();
  const l = loc(208.3);
  const mord = interpolate(f, [l(208.6), l(214.0)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escena Set={Primer} pal={PAL} seed={91} setProps={{ fondo: "verde", luz: "#fff3c0" }} claves={[mira(0, 960, 540, 1.0), mira(l(214.5), 960, 540, 1.12)]}
      medio={<>
        <HojaMacro x={960} y={560} s={1.7} mordida={mord} seed={4} />
        {Array.from({ length: 7 }).map((_, i) => { const k = ap(f, l(208.8) + i * 8, 6); const x = 500 + random(`es${i}`) * 900 + Math.sin(f / 18 + i) * 30; const y = 340 + random(`ey${i}`) * 420; return k > 0 ? <Escarabajo key={i} x={x} y={y} s={1.5 * k} rot={random(`er${i}`) * 360 + Math.sin(f / 12 + i) * 20} f={f} seed={i} /> : null; })}
      </>}
      hud={<><Rotulo texto="COLORADO POTATO BEETLE" x={1240} y={140} centro desde={l(209.0)} color="#ffcf6e" tam={64} /><Rotulo texto="NO PESTICIDES" x={960} y={900} centro desde={l(212.4)} color="#e23a2e" tam={64} /></>} />
  );
};

// ---------- 214:5-221:8 · Ben y Lily, la patrulla: balde con agua jabonosa, los tiran con el dedo ----------
const R03: React.FC = () => {
  const f = useF();
  const l = loc(214.5);
  const flick = (i: number) => Math.floor((f + i * 11) / 22) % 2;
  return (
    <Escena Set={Granja} pal={PAL} seed={92} setProps={{ hora: "dia", estacion: "verano", crec: 0.8 }}
      claves={[mira(0, 3500, 700, 1.6), mira(l(221.8), 3800, 700, 1.65)]}
      medio={<>
        {[[BEN, 3360], [LILY, 3560]].map(([look, x], i) => <A key={i} look={look as typeof BEN} escala={NINO} ruta={[{ f: 0, x: x as number, y: Y }, { f: l(221.8), x: (x as number) + 420, y: Y }]} dir={[{ f: 0, v: 1 }]} seed={i * 9}
          poses={[{ f: 0, v: flick(i) ? "agacharse" : { hD: 70, cD: 20 } }]} caras={[{ f: 0, v: "determinado" }, { f: l(218.0), v: "risa" }]} enManoI={<Balde />} />)}
        {Array.from({ length: 10 }).map((_, i) => { const t = ((f + i * 13) % 40) / 40; const x0 = 3420 + i * 46 + interpolate(f, [0, l(221.8)], [0, 420]); return t < 0.6 ? <Escarabajo key={i} x={x0 + t * 60} y={Y - 160 + Math.sin(t * Math.PI) * -120 + t * 80} s={0.5} rot={t * 720} f={f} /> : null; })}
      </>}
      hud={<Rotulo texto="THE BEETLE PATROL" x={1240} y={150} centro desde={l(215.0)} color="#ffcf6e" tam={74} />} />
  );
};

// ---------- 221:8-223:5 · les pagan con duraznos en lata ----------
const R04: React.FC = () => {
  const l = loc(221.8);
  return (
    <Escena Set={Granja} pal={PAL} seed={93} setProps={{ hora: "ocaso", estacion: "verano", crec: 0.8 }} claves={[mira(0, 3300, 640, 1.6), mira(l(223.5), 3310, 640, 1.7)]}
      medio={<>
        <A look={MARCUS} ruta={[{ f: 0, x: 3120, y: Y }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 70, cD: 10 } }]} caras={[{ f: 0, v: "feliz" }]} enManoD={<Lata s={1.1} color="#f2a03a" />} />
        {[BEN, LILY].map((look, i) => <A key={i} look={look} escala={NINO} ruta={[{ f: 0, x: 3360 + i * 140, y: Y }]} dir={[{ f: 0, v: -1 }]} seed={i * 4} poses={[{ f: 0, v: "parado" }, { f: l(222.6), v: "celebrar" }]} caras={[{ f: 0, v: "sorpresa" }, { f: l(222.6), v: "risa" }]} />)}
      </>}
      hud={<Rotulo texto="PAID IN PEACHES" x={1240} y={160} centro desde={l(222.6)} color="#ffcf6e" tam={74} />} />
  );
};

// ---------- 223:5-231:0 · la pared del granero: los palitos de cuenta crecen hasta 9,000 ----------
const R05: React.FC = () => {
  const f = useF();
  const l = loc(223.5);
  const n = Math.floor(interpolate(f, [l(224.0), l(229.6)], [0, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => t * t }));
  return (
    <Escena Set={Granja} pal={PAL} seed={94} mano={1.5}
      setProps={{ hora: "dia", estacion: "verano", crec: 0.8, pared: [{ t: "BEETLES", desde: -99, x: PARED.x + 20, y: PARED.y + 60, tam: 40 }, { t: "9,000", desde: l(229.8), x: PARED.x + 60, y: PARED.y + 320, tam: 70, color: "#b8382c", vel: 1.4 }] }}
      claves={[mira(0, 1010, 520, 1.6), mira(l(231.0), 1010, 510, 2.0, { curva: "inout" })]}
      medio={<g>{Array.from({ length: n }).map((_, i) => { const g = Math.floor(i / 5), k = i % 5; const gx = PARED.x + 22 + (g % 8) * 34, gy = PARED.y + 90 + Math.floor(g / 8) * 48; return k < 4 ? <rect key={i} x={gx + k * 6} y={gy} width={3} height={36} fill="#2a1c18" /> : <line key={i} x1={gx - 4} y1={gy + 30} x2={gx + 26} y2={gy + 6} stroke="#2a1c18" strokeWidth={3} />; })}</g>} />
  );
};

// ---------- SEC 10 · 231:0-236:9 · el cielo despejado, la tierra que se agrieta ----------
const R06: React.FC = () => {
  const f = useF();
  const l = loc(231.0);
  return (
    <Escena Set={Granja} pal={PAL} seed={95} setProps={{ hora: "dia", estacion: "verano", crec: 0.7, seca: ap(f, l(231.6), 80) }}
      claves={[mira(0, 3700, 560, 0.85), mira(l(234.0), 3700, 700, 1.3, { curva: "inout" }), mira(l(236.9), 3720, 720, 1.4)]}
      medio={<Grietas x0={3020} x1={4900} y={P + 40} k={ap(f, l(232.4), 60)} />}
      hud={<Rotulo texto="NOT ALWAYS WHEN YOU NEED IT" x={1240} y={150} centro desde={l(233.6)} color="#ffcf6e" tam={50} />} />
  );
};

// ---------- 236:9-240:1 · julio: tres semanas sin lluvia (el sol cruza 21 veces) ----------
const R07: React.FC = () => {
  const f = useF();
  const l = loc(236.9);
  const u = interpolate(f, [l(237.0), l(240.0)], [0, 21], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escena Set={Granja} pal={PAL} seed={96} setProps={{ hora: horaCiclo(f, l(237.0), l(240.0), 21), estacion: "verano", crec: 0.7, seca: 1 }} claves={[mira(0, 3700, 560, 0.75), mira(l(240.1), 3700, 560, 0.78)]}
      detras={u < 21 ? <SolCruza u={u} x0={2700} x1={4700} y={480} /> : undefined}
      medio={<Grietas x0={3020} x1={4900} y={P + 40} k={1} />}
      hud={<><Calendario texto="JULY" x={1500} y={150} desde={l(237.0)} /><Rotulo texto="3 WEEKS · NO RAIN" x={960} y={900} centro desde={l(237.6)} color="#ffcf6e" tam={64} /></>} />
  );
};

// ---------- 240:1-246:6 · Dev sube barriles al techo del granero; la manguera con agujeros gotea en el surco ----------
const R08: React.FC = () => {
  const f = useF();
  const l = loc(240.1);
  const sube = (k: number) => interpolate(f, [l(240.6 + k * 1.1), l(241.6 + k * 1.1)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const agua = ap(f, l(244.2), 12);
  return (
    <Escena Set={Granja} pal={PAL} seed={97} setProps={{ hora: "dia", estacion: "verano", crec: 0.75, seca: 1 - agua * 0.6 }}
      claves={[mira(0, 1700, 420, 1.0), mira(l(243.8), 1800, 440, 1.0), mira(l(244.2), 2900, 640, 0.65, { curva: "inout" }), mira(l(246.6), 3200, 660, 0.7)]}
      medio={<>
        {[0, 1, 2].map((k) => <Barril key={k} x={1500 + k * 130} y={P - 470 - (1 - sube(k)) * 380} s={0.8} />)}
        <path d={`M1700,${P - 470} Q2200,${P - 300} 2900,${P - 70} L5000,${P - 70}`} stroke="#2a2a30" strokeWidth={10} fill="none" />
        {agua > 0 && Array.from({ length: 34 }).map((_, i) => { const x = 3060 + i * 56; const t = ((f + i * 7) % 18) / 18; return <ellipse key={i} cx={x} cy={P - 66 + t * 40} rx={5} ry={9} fill="#7ab8f0" opacity={agua * (1 - t)} />; })}
        <A look={DEV} ruta={[{ f: 0, x: 1900, y: P - 470 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "agarrarAlto" }, { f: l(243.8), v: "manosCintura" }]} caras={[{ f: 0, v: "determinado" }]} escala={0.8} />
      </>}
      hud={<Rotulo texto="GRAVITY" x={1240} y={150} centro desde={l(241.0)} hasta={l(244.0)} color="#9bd8ff" tam={90} />} />
  );
};

// ---------- 246:6-248:7 · «It's ugly.» / «It works.» ----------
const R09: React.FC = () => {
  const l = loc(246.6);
  return (
    <Escena Set={Granja} pal={PAL} seed={98} setProps={{ hora: "dia", estacion: "verano", crec: 0.8 }} claves={[mira(0, 3250, 620, 1.7), mira(l(248.7), 3260, 615, 1.78)]}
      medio={<>
        <A look={DEV} ruta={[{ f: 0, x: 3080, y: Y }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "brazosCruzados" }]} caras={[{ f: 0, v: "picaro" }]} />
        <A look={MARCUS} ruta={[{ f: 0, x: 3420, y: Y }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "manosCintura" }]} caras={[{ f: 0, v: "neutral" }, { f: l(247.8), v: "feliz" }]} />
      </>}
      hud={<><Globo texto="It's ugly." x={700} y={260} desde={l(246.7)} hasta={l(248.7)} cola="der" tam={60} /><Globo texto="It works." x={1260} y={330} desde={l(247.7)} hasta={l(248.7)} cola="izq" tam={60} /></>} />
  );
};

// ---------- SEC 11 · 248:7-253:0 · la loma detrás del granero ----------
const R10: React.FC = () => {
  const l = loc(248.7);
  return (
    <Escena Set={Granja} pal={PAL} seed={99} setProps={{ hora: "ocaso", estacion: "verano", crec: 0.85 }} claves={[mira(0, 2500, 560, 0.9), mira(l(253.0), 2500, 600, 1.1, { curva: "inout" })]}
      hud={<Rotulo texto="STORAGE" x={1240} y={160} centro desde={l(250.4)} color="#ffcf6e" tam={110} />} />
  );
};

// ---------- 253:0-256:9 · 20,000 lb que se pudren en octubre (la montaña se pone negra) ----------
const R11: React.FC = () => {
  const f = useF();
  const l = loc(253.0);
  const neg = ap(f, l(254.4), 50);
  return (
    <Escena Set={Primer} pal={PAL} seed={100} setProps={{ fondo: "oscuro", luz: "#ffb04a" }} claves={[mira(0, 960, 560, 1.0), mira(l(256.9), 960, 560, 1.1)]}
      medio={<>{Array.from({ length: 90 }).map((_, i) => { const fl = Math.floor(Math.sqrt(i)); return <Papa key={i} x={960 + (random(`rk${i}`) - 0.5) * Math.max(80, 900 - fl * 90)} y={860 - fl * 50 + random(`rq${i}`) * 14} s={2.2} rot={random(`rr${i}`) * 180} color={random(`rc${i}`) < neg ? "#2a2426" : "#c9935a"} />; })}</>}
      hud={<Rotulo texto="ROT BY OCTOBER" x={1240} y={150} centro desde={l(254.6)} color="#e23a2e" tam={80} />} />
  );
};

// ---------- 256:9-262:1 · termómetro grande: 38-40 °F ----------
const R12: React.FC = () => {
  const f = useF();
  const l = loc(256.9);
  return (
    <Escena Set={Primer} pal={PAL} seed={101} setProps={{ fondo: "oscuro", luz: "#9bb7ff" }} claves={[mira(0, 960, 560, 1.0), mira(l(262.1), 960, 540, 1.12)]}
      medio={<Termometro x={960} y={820} temp={interpolate(f, [l(257.2), l(259.6)], [70, 39], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} s={3.4} marca={[38, 40]} />}
      hud={<><Rotulo texto="DARK · COOL · HUMID" x={1240} y={140} centro desde={l(257.4)} color="#f6ecd2" tam={64} brillo={false} /><Rotulo texto="38-40 °F" x={1380} y={560} desde={l(259.8)} color="#7cd36a" tam={90} /></>} />
  );
};

// ---------- 262:1-266:3 · muy caliente: brotan · muy frío: se endulzan y se arruinan ----------
const R13: React.FC = () => {
  const f = useF();
  const l = loc(262.1);
  return (
    <Escena Set={Primer} pal={PAL} seed={102} setProps={{ fondo: "oscuro" }} claves={[mira(0, 960, 540, 1.0), mira(l(266.3), 960, 540, 1.05)]}
      medio={<>
        <rect x={-500} y={-600} width={1460} height={2400} fill="#4a2a1e" /><rect x={960} y={-600} width={1600} height={2400} fill="#1e2a44" />
        <Papa x={500} y={600} s={5} brotes={ap(f, l(262.6), 30) * 2} rot={-10} />
        <Papa x={1420} y={600} s={5} color={`rgb(${Math.round(201 - 80 * ap(f, l(264.4), 30))},${Math.round(147 - 20 * ap(f, l(264.4), 30))},${Math.round(90 + 100 * ap(f, l(264.4), 30))})`} rot={8} />
      </>}
      hud={<><Rotulo texto="TOO WARM · SPROUT" x={500} y={160} centro desde={l(262.4)} color="#ffb04a" tam={54} /><Rotulo texto="TOO COLD · SPOIL" x={1420} y={160} centro desde={l(264.4)} color="#9bd8ff" tam={54} /></>} />
  );
};

// ---------- 266:3-273:5 · la loma en corte: Theo cava, Gus pone las piedras de un muro viejo ----------
const R14: React.FC = () => {
  const f = useF();
  const l = loc(266.3);
  const cav = (i: number) => (Math.floor((f + i * 9) / 15) % 2 ? "agacharse" : "tirarCarga");
  return (
    <Escena Set={Granja} pal={PAL} seed={103} setProps={{ hora: "ocaso", estacion: "verano", crec: 0.85, sotano: ap(f, l(266.6), 24), tSot: 39 }}
      claves={[mira(0, 2500, 640, 1.15), mira(l(273.5), 2500, 650, 1.25)]}
      medio={<>
        <A look={THEO} ruta={[{ f: 0, x: 2330, y: P - 30 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: cav(0) as never }]} caras={[{ f: 0, v: "cansado" }]} enManoD={<Pala tierra />} escala={0.85} />
        <A look={GUS} ruta={[{ f: 0, x: 2650, y: P - 30 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "agacharse" }, { f: l(269.0), v: { hD: 60, cD: 60, hI: 60, cI: 60 } }, { f: l(271.0), v: "agacharse" }]} caras={[{ f: 0, v: "determinado" }]} escala={0.85}
          enManoD={<ellipse rx={30} ry={18} fill="#8a8580" />} />
      </>}
      hud={<Rotulo texto="A ROOT CELLAR" x={1240} y={150} centro desde={l(266.8)} color="#ffcf6e" tam={80} />} />
  );
};

// ---------- 273:5-279:3 · Gus lo revisa como los manómetros de los barcos: dos veces por día ----------
const R15: React.FC = () => {
  const f = useF();
  const l = loc(273.5);
  const flash = ap(f, l(275.4), 8) * (1 - ap(f, l(277.4), 8));
  return (
    <Escena Set={Granja} pal={PAL} seed={104} setProps={{ hora: "noche", estacion: "verano", crec: 0.85, sotano: 1, tSot: 39 }}
      claves={[mira(0, 2640, 700, 2.2), mira(l(279.3), 2650, 700, 2.35)]}
      medio={<>
        <A look={GUS} ruta={[{ f: 0, x: 2560, y: P - 30 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 60, cD: 40, tronco: 8 } }]} caras={[{ f: 0, v: "determinado" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.3 } }]} escala={0.85} enManoD={<FarolMano f={f} s={0.9} />} />
        {flash > 0 && <g opacity={flash}><rect x={2300} y={300} width={800} height={700} fill="#1c2430" /><Manometro x={2700} y={640} s={1.6} aguja={0.55 + 0.05 * Math.sin(f / 5)} /></g>}
      </>}
      hud={<><Rotulo texto="TWICE A DAY. EVERY DAY." x={1240} y={150} centro desde={l(277.6)} color="#ffcf6e" tam={64} />{flash > 0.3 && <Rotulo texto="ORE BOATS" x={1560} y={960} centro desde={l(275.6)} hasta={l(277.4)} color="#9bd8ff" tam={56} />}</>} />
  );
};

// ---------- SEC 12 · 279:3-281:9 · día 320, mediados de agosto: el campo verde y alto ----------
const R16: React.FC = () => {
  const l = loc(279.3);
  return (
    <Escena Set={Granja} pal={PAL} seed={105} setProps={{ hora: "dia", estacion: "verano", crec: 1 }} claves={[mira(0, 3900, 600, 0.75), mira(l(281.9), 4000, 600, 0.8)]}
      hud={<Rotulo texto="MID-AUGUST" x={1240} y={170} centro desde={l(279.8)} color="#f6ecd2" tam={72} />} />
  );
};

// ---------- 281:9-286:3 · el maíz más alto que Theo; los zapallos sobre el alambrado ----------
const R17: React.FC = () => {
  const l = loc(281.9);
  return (
    <Escena Set={Granja} pal={PAL} seed={106} setProps={{ hora: "dia", estacion: "verano", crec: 1 }}
      claves={[mira(0, 4800, 560, 1.3), mira(l(284.2), 4780, 560, 1.32), mira(l(284.4), 2980, 780, 1.9, { curva: "inout" }), mira(l(286.3), 2990, 780, 1.95)]}
      medio={<A look={THEO} ruta={[{ f: 0, x: 4660, y: Y }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "manosCintura" }]} caras={[{ f: 0, v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 0.5, y: -0.8 } }]} />} />
  );
};

// ---------- 286:3-292:9 · Marcus clava la horquilla, levanta una planta: ocho papas, grandes como puños ----------
const R18: React.FC = () => {
  const f = useF();
  const l = loc(286.3);
  const n = Math.min(8, Math.floor(interpolate(f, [l(291.0), l(292.4)], [0, 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  const arriba = f > l(289.0);
  return (
    <Escena Set={Granja} pal={PAL} seed={107} setProps={{ hora: "ocaso", estacion: "verano", crec: 1 }}
      claves={[mira(0, 3500, 640, 1.3), mira(l(289.0), 3520, 640, 1.4), mira(l(290.8), 3560, 680, 1.6, { curva: "inout" }), mira(l(292.9), 3560, 675, 1.66)]}
      medio={<A look={MARCUS} ruta={[{ f: 0, x: 3300, y: Y }, { f: l(287.8), x: 3500, y: Y }]} dir={[{ f: 0, v: 1 }]}
        poses={[{ f: 0, v: "parado" }, { f: l(287.8), v: "agacharse" }, { f: l(289.0), v: { hD: 170, cD: 10, hI: 150, cI: 20 } }]} caras={[{ f: 0, v: "determinado" }, { f: l(289.4), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 0.6, y: 0.4 } }, { f: l(289.0), v: { x: 0.3, y: -0.8 } }]}
        enManoD={<HorquillaPapas papas={arriba ? Math.max(n, 1) : 0} />} />}
      hud={<Rotulo texto={n > 0 ? `${n}` : ""} x={1400} y={240} desde={l(291.0)} color="#ffcf6e" tam={140} />} />
  );
};

// ---------- 292:9-298:0 · la primera sonrisa del verano: lo van a lograr ----------
const R19: React.FC = () => {
  const l = loc(292.9);
  return (
    <Escena Set={Granja} pal={PAL} seed={108} setProps={{ hora: "ocaso", estacion: "verano", crec: 1 }} claves={[mira(0, 3500, 520, 2.4), mira(l(298.0), 3500, 515, 2.55)]}
      medio={<A look={MARCUS} ruta={[{ f: 0, x: 3500, y: Y }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "neutral" }, { f: l(293.6), v: "risa" }]} poses={[{ f: 0, v: { hD: 150, cD: 30 } }]} enManoD={<HorquillaPapas papas={8} />} />}
      hud={<Rotulo texto="THEY'RE GOING TO MAKE IT" x={960} y={900} centro desde={l(296.0)} color="#7cd36a" tam={62} />} />
  );
};

// ---------- 298:0-301:6 · casi siete millones, en la tierra, listos ----------
const R20: React.FC = () => {
  const l = loc(298.0);
  return (
    <Escena Set={Granja} pal={PAL} seed={109} setProps={{ hora: "ocaso", estacion: "verano", crec: 1, corte: 1, papas: 1 }} claves={[mira(0, 3900, 880, 1.0), mira(l(301.6), 3900, 860, 1.06)]}
      medio={<>{LOS10.map((look, i) => <A key={i} look={look} escala={i >= 8 ? NINO : 1} seed={i * 3} ruta={[{ f: 0, x: 3200 + i * 150, y: P - 40 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "feliz" }]} />)}</>}
      hud={<Rotulo texto="IN THE GROUND. READY." x={960} y={950} centro desde={l(299.0)} color="#ffcf6e" tam={60} />} />
  );
};

// ---------- SEC 13 · 301:6-305:2 · 29 de agosto: noche despejada, estrellas ----------
const R21: React.FC = () => {
  const l = loc(301.6);
  return (
    <Escena Set={Granja} pal={PAL} seed={110} setProps={{ hora: "noche", estacion: "verano", crec: 1, humo: 0.2 }} claves={[mira(0, 2600, 420, 0.7), mira(l(305.2), 2700, 440, 0.74)]}
      hud={<Calendario texto="AUG 29" x={1500} y={150} desde={l(302.0)} />} />
  );
};

// ---------- 305:2-309:5 · el aire frío baja por la loma y llena el campo ----------
const R22: React.FC = () => {
  const f = useF();
  const l = loc(305.2);
  return (
    <Escena Set={Granja} pal={PAL} seed={111} setProps={{ hora: "noche", estacion: "verano", crec: 1 }} claves={[mira(0, 2600, 620, 0.72), mira(l(309.5), 3600, 640, 0.75, { curva: "inout" })]}
      medio={<AireFrio k={interpolate(f, [l(305.6), l(309.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} f={f} piso={P} />}
      hud={<Rotulo texto="COLD AIR SLIDES DOWN" x={1240} y={150} centro desde={l(306.4)} color="#9bd8ff" tam={64} />} />
  );
};

// ---------- 309:5-313:8 · el termómetro del porche: 31 °F a las 3 de la mañana ----------
const R23: React.FC = () => {
  const f = useF();
  const l = loc(309.5);
  const t = interpolate(f, [l(309.8), l(312.6)], [44, 31], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escena Set={Granja} pal={PAL} seed={112} setProps={{ hora: "noche", estacion: "verano", crec: 1, temp: t }} claves={[mira(0, GRANJA_PUNTOS.termometro, P - 110, 4.2), mira(l(313.8), GRANJA_PUNTOS.termometro, P - 112, 4.5)]}
      hud={<><RelojDia min={180} x={1560} y={60} desde={l(310.0)} /><Rotulo texto={`${Math.round(t)} °F`} x={1300} y={480} desde={l(310.2)} color={t <= 32 ? "#9bd8ff" : "#f6ecd2"} tam={110} /></>} />
  );
};

// ---------- 313:8-314:7 · «Frost.» la escarcha se extiende por el campo como en la miniatura ----------
const R24: React.FC = () => {
  const f = useF();
  const l = loc(313.8);
  const k = interpolate(f, [0, l(314.7)], [0, 1], { extrapolateRight: "clamp" });
  return (
    <Escena Set={Granja} pal={PAL} seed={113} setProps={{ hora: "noche", estacion: "verano", crec: 1, helada: k }} claves={[mira(0, 3900, 600, 0.8), mira(l(314.7), 3900, 600, 0.86)]}
      medio={<Helada4 x0={5200 - 2400 * k} piso={P + 40} f={f} k={k} />}
      hud={<Rotulo texto="FROST." x={960} y={380} centro desde={0} color="#e8f6ff" tam={160} />} />
  );
};

// ---------- 314:7-321:4 · a la mañana: porotos negros, tomates papilla, zapallos caídos ----------
const Planta3: React.FC<{ s0: number; s1: number; tipo: "poroto" | "tomate" | "zapallo"; txt: string }> = ({ s0, s1, tipo, txt }) => {
  const f = useF();
  const l = loc(s0);
  return (
    <Escena Set={Primer} pal={PAL} seed={Math.round(s0)} setProps={{ fondo: "cielo", luz: "#ffd8a0" }} claves={[mira(0, 960, 600, 1.0), mira(l(s1), 960, 600, 1.08)]}
      medio={<PlantaCerca tipo={tipo} x={960} y={900} s={1.3} helada={0.4 + 0.6 * ap(f, l(s0 + 0.3), 40)} f={f} />}
      hud={<Rotulo texto={txt} x={1240} y={140} centro desde={l(s0 + 0.2)} color="#e8f6ff" tam={72} />} />
  );
};

// ---------- 321:4-325:1 · medio jardín perdido en una noche; los 10 en silencio al borde ----------
const R26: React.FC = () => {
  const l = loc(321.4);
  return (
    <Escena Set={Granja} pal={PAL} seed={114} setProps={{ hora: "alba", estacion: "verano", crec: 1, helada: 1 }} claves={[mira(0, 3300, 600, 0.9), mira(l(325.1), 3320, 600, 0.95)]}
      medio={<>{LOS10.map((look, i) => <A key={i} look={look} escala={i >= 8 ? NINO : 1} seed={i * 3} ruta={[{ f: 0, x: 2650 + i * 120, y: Y }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "triste" }]} poses={[{ f: 0, v: i % 3 === 0 ? "encogerse" : i % 3 === 1 ? "manosCara" : "parado" }]} />)}</>}
      hud={<Rotulo texto="TWO WEEKS EARLY" x={1240} y={160} centro desde={l(322.4)} color="#e23a2e" tam={80} />} />
  );
};

// ---------- SEC 14 · 325:1-334:8 · tilt abajo: las papas, intactas bajo tierra ----------
const R27: React.FC = () => {
  const f = useF();
  const l = loc(325.1);
  return (
    <Escena Set={Granja} pal={PAL} seed={115} setProps={{ hora: "dia", estacion: "verano", crec: 1, helada: 1, corte: ap(f, l(325.8), 24), papas: 1 }}
      claves={[mira(0, 3800, 600, 1.0), mira(l(326.2), 3800, 620, 1.0), mira(l(328.4), 3800, 1010, 1.3, { curva: "inout" }), mira(l(334.8), 3820, 1030, 1.5)]}
      hud={<><Rotulo texto="THE POTATOES ARE FINE" x={1240} y={150} centro desde={l(329.0)} color="#f6ecd2" tam={72} /><Rotulo texto="hidden in the dirt" x={960} y={900} centro desde={l(331.0)} color="#f6ecd2" tam={60} brillo={false} /></>} />
  );
};

// ---------- 334:8-339:9 · los diez cavan en fila, nueve días seguidos (DAY 321 → 330) ----------
const R28: React.FC = () => {
  const f = useF();
  const l = loc(334.8);
  const u = interpolate(f, [l(335.0), l(339.6)], [0, 9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escena Set={Granja} pal={PAL} seed={116} setProps={{ hora: horaCiclo(f, l(335.0), l(339.6), 9), estacion: "verano", crec: 1, helada: 1 }} claves={[mira(0, 3800, 600, 0.78), mira(l(339.9), 3820, 600, 0.82)]}
      detras={u < 9 ? <SolCruza u={u} x0={2800} x1={4800} y={480} /> : undefined}
      medio={<>{LOS10.map((look, i) => <A key={i} look={look} escala={i >= 8 ? NINO : 1} seed={i * 3} ruta={[{ f: 0, x: 3150 + i * 150, y: Y }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "cansado" }]} poses={[{ f: 0, v: (Math.floor((f + i * 5) / 9) % 2 ? "agacharse" : "parado") as never }]} enManoD={i < 8 ? <Pala tierra /> : <Canasta s={0.5} papas={u / 9} />} />)}</>} />
  );
};

// ---------- 339:9-345:1 · la última canasta entra al sótano; Marcus escribe el número final ----------
const R29: React.FC = () => {
  const l = loc(339.9);
  return (
    <Escena Set={Granja} pal={PAL} seed={117} setProps={{ hora: "ocaso", estacion: "verano", crec: 1, helada: 1, sotano: 1 }}
      claves={[mira(0, 2500, 640, 1.3), mira(l(342.4), 2480, 640, 1.32), mira(l(342.6), 1300, 560, 1.2, { curva: "inout" }), mira(l(345.1), 1100, 520, 1.5, { curva: "inout" })]}
      medio={<>
        <A look={THEO} ruta={[{ f: 0, x: 2100, y: P - 30 }, { f: l(342.0), x: 2480, y: P - 30 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "cansado" }]} escala={0.85} enManoD={<Canasta s={0.9} papas={1} />} />
        <A look={MARCUS} ruta={[{ f: 0, x: 1250, y: P - 20 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 130, cD: 40 } }]} caras={[{ f: 0, v: "determinado" }]} enManoD={<Brocha />} />
      </>} />
  );
};

// ---------- 345:1-352:4 · «6,100,000» en la pared; con las latas: ENOUGH ----------
const R30: React.FC = () => {
  const f = useF();
  const l = loc(345.1);
  return (
    <Escena Set={Granja} pal={PAL} seed={118} mano={1.5}
      setProps={{ hora: "ocaso", estacion: "verano", crec: 1, helada: 1, pared: [{ t: "6,100,000", desde: l(345.6), x: PARED.x + 14, y: PARED.y + 120, tam: 50, color: "#2a1c18", vel: 0.9 }, { t: "+ CANS", desde: l(349.0), x: PARED.x + 60, y: PARED.y + 200, tam: 46, vel: 0.9 }, { t: "ENOUGH", desde: l(350.3), x: PARED.x + 30, y: PARED.y + 300, tam: 64, color: "#3f8a3a", vel: 0.9 }] }}
      claves={[mira(0, 1010, 500, 1.9), mira(l(352.4), 1010, 500, 2.0)]}
      medio={<>{Array.from({ length: 6 }).map((_, i) => { const k = ap(f, l(349.0) + i * 3, 6); return k > 0 ? <Lata key={i} x={PARED.x + 200 + (i % 3) * 36} y={PARED.y + 205 - Math.floor(i / 3) * 44 - (1 - k) * 30} s={0.8} color={["#e0563a", "#f1c24a", "#5aa0d8"][i % 3]} /> : null; })}</>}
      hud={<Rotulo texto="SHORT OF THE GOAL · ENOUGH FOR WINTER 2" x={960} y={950} centro desde={l(347.4)} color="#ffcf6e" tam={50} />} />
  );
};

// ---------- SEC 15 · 352:4-357:1 · el henil de noche: June sube con el farol; Lily dormida junto a Ore ----------
const R31: React.FC = () => {
  const f = useF();
  const l = loc(352.4);
  return (
    <Escena Set={Granero} pal={PAL} seed={119} setProps={{ farol: 1, hora: "noche" }}
      claves={[mira(0, GR_PUNTOS.escalera - 100, 700, 1.0), mira(l(354.6), GR_PUNTOS.escalera - 160, 560, 1.15, { curva: "inout" }), mira(l(357.1), GR_PUNTOS.lily, GR_HENIL - 80, 1.8, { curva: "inout" })]}
      medio={<>
        <A look={JUNE} ruta={[{ f: 0, x: GR_PUNTOS.escalera, y: GR_PISO }, { f: l(354.6), x: GR_PUNTOS.escalera, y: GR_HENIL }, { f: l(356.4), x: GR_PUNTOS.lily + 220, y: GR_HENIL }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: "agarrarAlto" }, { f: l(354.6), v: "parado" }]} caras={[{ f: 0, v: "neutral" }, { f: l(356.0), v: "duda" }]} enManoD={<FarolMano f={f} s={1} />} />
        <A look={LILY} escala={NINO} ruta={[{ f: 0, x: GR_PUNTOS.lily, y: GR_HENIL }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "sentadoSuelo" }]} caras={[{ f: 0, v: "cansado" }]} ajuste={(p) => ({ ...p, tronco: (p.tronco ?? 0) + 40 })} />
        <Ore x={GR_PUNTOS.lily - 120} y={GR_HENIL} s={0.8} dir={1} f={f} echado={1} cola={0.3} />
      </>} />
  );
};

// ---------- 357:1-366:2 · la mano en la frente: arde; 102 °F; se agarra el costado derecho ----------
const R32: React.FC = () => {
  const f = useF();
  const l = loc(357.1);
  const lat = 1 + 0.04 * Math.max(0, Math.sin(f / 4)) * ap(f, l(360.8), 10);
  return (
    <Escena Set={Granero} pal={PAL} seed={120} setProps={{ farol: 1, hora: "noche" }} claves={[mira(0, GR_PUNTOS.lily + 60, GR_HENIL - 140, 2.6), mira(l(366.2), GR_PUNTOS.lily + 60, GR_HENIL - 150, 2.8 * lat)]}
      medio={<>
        <A look={LILY} escala={NINO} ruta={[{ f: 0, x: GR_PUNTOS.lily, y: GR_HENIL }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "sentadoSuelo" }, { f: l(361.6), v: { hD: 30, cD: 140, hI: 20, cI: 120, tronco: 18 } }]} caras={[{ f: 0, v: "cansado" }, { f: l(361.6), v: "triste" }]} ajuste={(p) => ({ ...p, tronco: (p.tronco ?? 0) + 30 })} />
        <A look={JUNE} ruta={[{ f: 0, x: GR_PUNTOS.lily + 200, y: GR_HENIL }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "agacharse" }, { f: l(358.0), v: { tronco: 30, hD: 100, cD: 20 } }]} caras={[{ f: 0, v: "duda" }, { f: l(359.4), v: "miedo" }]} />
        <Halo x={GR_PUNTOS.lily} y={GR_HENIL - 120} r={220} color="#e23a2e" fuerza={0.35 * ap(f, l(360.8), 20)} />
      </>}
      hud={<Rotulo texto="RIGHT SIDE" x={1250} y={960} desde={l(362.6)} hasta={l(366.0)} color="#e23a2e" tam={56} />} />
  );
};

// ---------- 366:2-372:1 · la cara de June, seria; la cámara se aleja hasta el granero solo en la noche ----------
const R33: React.FC = () => {
  const l = loc(366.2);
  return (
    <Escena Set={Granja} pal={PAL} seed={121} setProps={{ hora: "noche", estacion: "verano", crec: 0.6, helada: 1 }}
      claves={[mira(0, 1250, 270, 3.2), mira(l(367.4), 1250, 280, 3.0), mira(l(372.1), 1300, 500, 0.7, { curva: "inout" })]}
      hud={<Rotulo texto="NEVER ALONE. UNTIL NOW." x={960} y={900} centro desde={l(369.0)} color="#f6ecd2" tam={56} brillo={false} />} />
  );
};

// ---------- SEC 16 · 372:1-380:0 · CTA: el campo de día, «What would you plant?» + suscribirse ----------
const R34: React.FC = () => {
  const f = useF();
  const l = loc(372.1);
  return (
    <Escena Set={Granja} pal={PAL} seed={122} setProps={{ hora: "dia", estacion: "verano", crec: 1 }} claves={[mira(0, 3400, 600, 0.85), mira(l(380.0), 3500, 600, 0.9)]}
      medio={<>{LOS10.map((look, i) => <A key={i} look={look} escala={i >= 8 ? NINO : 1} seed={i * 3} ruta={[{ f: 0, x: 2850 + i * 140, y: Y }]} dir={[{ f: 0, v: i % 2 ? 1 : -1 }]} caras={[{ f: 0, v: "feliz" }]} poses={[{ f: 0, v: i === 0 ? "saludar" : "parado" }]} />)}<Ore x={2700} y={Y} s={1} dir={1} f={f} cola={1} /></>}
      hud={<><Rotulo texto={"One acre. One summer.\nWhat would you plant?"} x={1240} y={120} centro desde={l(372.6)} color="#ffcf6e" tam={74} /><Pildora texto="Subscribe · the census continues" x={960} y={960} desde={l(376.6)} hasta={l(380.0)} color="#ffcf6e" tam={40} /></>} />
  );
};

export const PLANOS_B: [number, React.ReactNode, PlanoM["trans"]?][] = [
  [204.8, <R01 />, { tipo: "cortina", d: 14, color: "#0b0810" }], [208.3, <R02 />, { tipo: "luz", d: 10 }], [214.5, <R03 />, { tipo: "barrido", d: 10 }], [221.8, <R04 />], [223.5, <R05 />, { tipo: "barrido", d: 10 }],
  [231.0, <R06 />, { tipo: "fundido", d: 16 }], [236.9, <R07 />], [240.1, <R08 />, { tipo: "barrido", d: 10 }], [246.6, <R09 />],
  [248.7, <R10 />, { tipo: "cortina", d: 14, color: "#0b0810" }], [253.0, <R11 />, { tipo: "fundido", d: 12 }], [256.9, <R12 />, { tipo: "barrido", d: 10 }], [262.1, <R13 />, { tipo: "barrido", d: 10 }], [266.3, <R14 />, { tipo: "luz", d: 12 }], [273.5, <R15 />, { tipo: "fundido", d: 14 }],
  [279.3, <R16 />, { tipo: "luz", d: 14 }], [281.9, <R17 />, { tipo: "barrido", d: 10 }], [286.3, <R18 />, { tipo: "barrido", d: 10 }], [292.9, <R19 />], [298.0, <R20 />, { tipo: "fundido", d: 12 }],
  [301.6, <R21 />, { tipo: "fundido", d: 20 }], [305.2, <R22 />], [309.5, <R23 />, { tipo: "fundido", d: 12 }], [313.8, <R24 />, { tipo: "luz", d: 8, color: "#e8f6ff" }],
  [314.7, <Planta3 s0={314.7} s1={316.9} tipo="poroto" txt="BEANS · BLACK" />, { tipo: "fundido", d: 10 }], [316.9, <Planta3 s0={316.9} s1={319.1} tipo="tomate" txt="TOMATOES · MUSH" />], [319.1, <Planta3 s0={319.1} s1={321.4} tipo="zapallo" txt="SQUASH · COLLAPSED" />], [321.4, <R26 />, { tipo: "fundido", d: 12 }],
  [325.1, <R27 />, { tipo: "luz", d: 12 }], [334.8, <R28 />, { tipo: "barrido", d: 10 }], [339.9, <R29 />, { tipo: "barrido", d: 10 }], [345.1, <R30 />],
  [352.4, <R31 />, { tipo: "cortina", d: 16, color: "#0b0810" }], [357.1, <R32 />], [366.2, <R33 />, { tipo: "fundido", d: 14 }],
  [372.1, <R34 />, { tipo: "luz", d: 16 }], [380.0, <TarjetaEp5 s0={380.0} />, { tipo: "fundido", d: 18 }],
];
