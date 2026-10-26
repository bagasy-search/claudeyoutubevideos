// lc03 · planos 2:46-6:25 (SEC 8-19 del plan MxM). Cuadros locales: l(segundo global).
import React from "react";
import { interpolate } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Escena } from "../../anikit/escena";
import { Cono, Halo } from "../../anikit/luz";
import { PlanoM } from "../../anikit/montaje";
import { EtiquetaFlotante, Globo, GranNumero, Pildora } from "../../anikit/pantalla";
import { Lata, Libro } from "../../anikit/props";
import { GUS, JUNE, JUNE_INV, PAL, THEO, THEO_INV, conAcc } from "../elenco";
import { Lobby, LOBBY_PISO, LOBBY_PUNTOS } from "../mundo/hospital";
import { CANAL_PISO, CANAL_PUNTOS, CanalPark } from "../mundo/puente";
import { Auto } from "../mundo/comun";
import { SUP_PISO, Superior } from "../mundo/superior";
import { A, Rotulo, T, loc } from "./comun_ep";
import { BEN, DEV, LILY, MARCUS, NAN, NINO, Ore, PRIYA, ROSA } from "./elenco_lcb";
import { GRANJA_PISO, Granja } from "./granja";
import { Biblioteca, BIB_PISO, Bote, CartelVerde, Mesa, Techo, TECHO_PISO } from "./insertos";
import { LK_PISO, Lakewood } from "./lakewood";
import { PCuaderno } from "./lc03a";
import { Mirador } from "./mirador";
import { REP_PISO, Represa } from "./represa";
import { Cuesta, cuestaY, SUB_PISO, Subsuelo } from "./subsuelo";
import { TarjetaSiguiente } from "./tarjetas";
import { VIS_MAPA, VIS_PISO, Visitantes } from "./visitantes";

const ap = (f: number, a: number, d = 10) => interpolate(f, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const THEO_CASCO = conAcc({ ...THEO, accesorios: [] }, { t: "gorra", color: "#f2c230" }, { t: "bufanda", color: "#efe3c8" });
const LOS10 = [GUS, THEO_INV, JUNE_INV, MARCUS, ROSA, DEV, PRIYA, NAN, BEN, LILY];
const FILAS = ["WATER", "POWER", "SEWER", "HEAT", "ROADS", "FOOD"];

// SYSTEMS CHECKED n/6 (cuadros globales)
export const SISTEMAS = [{ f: 0, v: 0 }, { f: T(192.6), v: 1 }, { f: T(221.4), v: 2 }, { f: T(240.6), v: 3 }, { f: T(258.4), v: 4 }, { f: T(273.0), v: 5 }, { f: T(277.0), v: 6 }];

// ---------- la pizarra de los 6 sistemas; `tachas` = segundo global de cada ✗ ya caída o que cae acá ----------
const PPizarra: React.FC<{ s0: number; s1: number; tachas: number[] }> = ({ s0, s1, tachas }) => {
  const l = loc(s0);
  return (
    <Escena Set={Visitantes} pal={PAL} seed={Math.round(s0)} mano={1.5}
      setProps={{ hora: "dia", pizarra: [{ t: "DULUTH", desde: -999, fila: -1, tam: 64, color: "#c0352c" }, ...FILAS.map((t, i) => ({ t, desde: -999, fila: i }))], tachas: tachas.map((g) => Math.max(0, l(g))) }}
      claves={[mira(0, 470, 420, 1.5), mira(l(s1), 480, 425, 1.6)]} />
  );
};

// ---------- 23 · 165:8-184:9 · Lakewood: la toma, el agua por el caño, las bombas que se frenan, la planta entera ----------
const P23: React.FC = () => {
  const f = useF();
  const l = loc(165.8);
  const marca = (g: number, x: number, y: number, r: number) => { const k = ap(f, l(g), 6) * (1 - ap(f, l(g + 1.6), 14)); return k > 0 ? <Halo key={g} x={x} y={y} r={r} color="#ffcf6e" fuerza={0.7 * k} /> : null; };
  return (
    <Escena Set={Lakewood} pal={PAL} setProps={{ hora: "invierno", corte: ap(f, l(171.2), 24), flujo: 1 - ap(f, l(174.6), 30), aguja: 0.2 + ap(f, l(183.0), 30) * 0.75, nieve: 0.7 }} seed={33}
      claves={[mira(0, 2300, 520, 0.55), mira(l(167.1), 1900, 600, 0.6), mira(l(168.0), 60, 900, 1.0, { curva: "inout" }), mira(l(172.5), 1550, 860, 0.95, { curva: "inout" }), mira(l(174.6), 1820, 760, 1.1), mira(l(176.4), 2050, 720, 1.6, { curva: "inout" }), mira(l(177.2), 2120, 600, 0.75, { curva: "inout" }), mira(l(179.5), 2140, 620, 0.72), mira(l(182.0), 3100, 620, 1.0, { curva: "inout" }), mira(l(184.9), 3800, 580, 1.15)]}
      medio={<>{marca(180.6, 3520, 700, 260)}{marca(181.5, 2950, 720, 330)}{marca(182.8, 3950, 570, 200)}</>}
      hud={<>
        <Rotulo texto="LAKE SUPERIOR" x={300} y={260} desde={l(168.6)} hasta={l(172)} color="#9bd8ff" tam={70} rot={-2} />
        <Rotulo texto="NO POWER = NO PUMPS" x={960} y={170} centro desde={l(175.0)} hasta={l(177)} color="#ffcf6e" tam={74} rot={0} />
      </>}
    />
  );
};

// ---------- 24 · 184:9-192:0 · Dev y los manuales (3 días), Theo y el tablero, los tres se miran ----------
const P24: React.FC = () => {
  const f = useF();
  const l = loc(184.9);
  const P = LK_PISO;
  return (
    <Escena Set={Lakewood} pal={PAL} setProps={{ hora: "invierno", corte: 1, flujo: 0, aguja: 0.95, manuales: interpolate(f, [0, l(187.0)], [0.2, 1], { extrapolateRight: "clamp" }) }} seed={34}
      claves={[mira(0, 2300, 680, 1.5), mira(l(187.1), 2330, 660, 1.55), mira(l(187.4), 3700, 640, 1.45, { curva: "inout" }), mira(l(189.3), 3700, 640, 1.5), mira(l(189.6), 3150, 650, 1.0, { curva: "inout" }), mira(l(192.0), 3150, 640, 1.08)]}
      medio={<>
        <A look={DEV} ruta={[{ f: 0, x: 2380, y: P }, { f: l(189.4), x: 2380, y: P }, { f: l(190.6), x: 2950, y: P }]} dir={[{ f: 0, v: -1 }, { f: l(189.4), v: 1 }]}
          poses={[{ f: 0, v: "sentadoSuelo" }, { f: l(189.4), v: "parado" }]}
          caras={[{ f: 0, v: "cansado" }, { f: l(190.8), v: "triste" }]} enManoD={(ff) => (ff < l(189.4) ? <Libro color="#3a5a8a" abierto /> : null)} />
        <A look={THEO_INV} ruta={[{ f: 0, x: 3640, y: P }, { f: l(189.6), x: 3640, y: P }, { f: l(190.8), x: 3250, y: P }]} dir={[{ f: 0, v: 1 }, { f: l(189.6), v: -1 }]}
          poses={[{ f: 0, v: { hD: 100, cD: 20 } }, { f: l(189.6), v: "parado" }]} caras={[{ f: 0, v: "duda" }, { f: l(190.8), v: "triste" }]} />
        {f > l(187.2) && f < l(189.6) && <Cono x={3700} y={P - 330} alto={300} ancho={170} color="#fff2c0" fuerza={0.45} ang={60} />}
        <A look={JUNE_INV} ruta={[{ f: 0, x: 3100, y: P }]} dir={[{ f: 0, v: 1 }]} opacidad={(ff) => ap(ff, l(189.3), 6)} caras={[{ f: 0, v: "triste" }]} seed={2} poses={[{ f: 0, v: "brazosCruzados" }]} />
      </>}
      hud={<>
        <Rotulo texto="3 DAYS" x={1200} y={220} desde={l(185.6)} hasta={l(187.2)} color="#ffcf6e" tam={90} rot={-3} />
        <Rotulo texto="NO." x={960} y={200} centro desde={l(189.8)} color="#e23a2e" tam={130} rot={0} />
      </>}
    />
  );
};

// ---------- 29 · 194:1-201:1 · Theo con el casco de liniero → la represa de Thomson ----------
const P29: React.FC = () => {
  const l = loc(194.1);
  return (
    <Escena Set={Represa} pal={PAL} setProps={{ hora: "invierno", nieve: 0.8 }} seed={35}
      claves={[mira(0, 1640, 640, 1.45), mira(l(197.2), 1600, 650, 1.5), mira(l(197.4), 600, 480, 0.6, { curva: "inout" }), mira(l(201.1), 720, 470, 0.66)]}
      medio={<A look={THEO_CASCO} ruta={[{ f: 0, x: 1620, y: REP_PISO }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 150, cD: 120 } }, { f: l(195.4), v: "manosCintura" }]} caras={[{ f: 0, v: "determinado" }]} />}
      hud={<Rotulo texto="THOMSON DAM" x={1200} y={230} desde={l(197.8)} color="#ffcf6e" tam={74} rot={-3} />}
    />
  );
};

// ---------- 31 · 201:1-213:5 · turbina → subestación → kilómetros de línea; después: cables caídos y banderas rojas ----------
const P31: React.FC = () => {
  const f = useF();
  const l = loc(201.1);
  const marca = (g: number, x: number, y: number, r: number, t: string) => { const k = ap(f, l(g), 6) * (1 - ap(f, l(g + 1.4), 12)); return k > 0 ? <g key={g} opacity={k}><Halo x={x} y={y} r={r} color="#ffcf6e" fuerza={0.7} /><text x={x} y={y - r * 0.6} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={44} fill="#ffcf6e">{t}</text></g> : null; };
  return (
    <Escena Set={Represa} pal={PAL} setProps={{ hora: "invierno", corte: 1, caida: ap(f, l(207.8), 40), banderas: l(209.5), zumbido: 1 - ap(f, l(207.4), 10), nieve: 0.8 }} seed={36}
      claves={[mira(0, 1230, 640, 1.2), mira(l(203.2), 1250, 620, 1.1), mira(l(205.0), 2000, 640, 1.05, { curva: "inout" }), mira(l(207.8), 3300, 560, 0.9, { curva: "inout" }), mira(l(213.5), 3900, 440, 0.4, { curva: "inout" })]}
      medio={<>{marca(203.0, 1230, 680, 220, "SWITCHES")}{marca(203.9, 1950, 660, 260, "TRANSFORMERS")}{marca(205.2, 2200, 700, 220, "PROTECTION")}{marca(206.4, 3000, 420, 300, "MILES OF LINES")}</>}
      hud={<Rotulo texto="DOWN IN HUNDREDS OF PLACES" x={960} y={170} centro desde={l(211.0)} color="#e23a2e" tam={70} rot={0} />}
    />
  );
};

// ---------- 33 · 213:5-220:2 · docenas de camiones (fantasma) → uno solo: Theo en la escalera, Marcus abajo ----------
const P33: React.FC = () => {
  const f = useF();
  const l = loc(213.5);
  const P = REP_PISO;
  const fant = 1 - ap(f, l(217.2), 12);
  const dx = interpolate(f, [0, l(217.2)], [0, 380], { extrapolateRight: "clamp" });
  return (
    <Escena Set={Represa} pal={PAL} setProps={{ hora: "invierno", caida: 1, nieve: 0.8 }} seed={37}
      claves={[mira(0, 3400, 600, 0.55), mira(l(217.2), 4700, 620, 0.6), mira(l(218.0), 3420, 560, 1.3, { curva: "inout" }), mira(l(220.2), 3400, 540, 1.4)]}
      medio={<>
        {fant > 0.01 && <g opacity={0.45 * fant} transform={`translate(${dx},0)`}>{Array.from({ length: 22 }).map((_, i) => <Auto key={i} x={1600 + i * 270} y={P + 40} color="#ffb04a" tipo="pickup" s={1.3} dir={1} />)}</g>}
        <g opacity={ap(f, l(217.0), 10)}>
          <Auto x={3150} y={P + 10} color="#e8e2d6" tipo="pickup" s={1.6} dir={1} nieve={0.4} />
          <path d={`M3320,${P} L3400,${P - 470} M3380,${P} L3460,${P - 470}`} stroke="#c9c4b8" strokeWidth={10} />
          {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${3328 + i * 8},${P - 30 - i * 50} l58,0`} stroke="#c9c4b8" strokeWidth={8} />)}
          <A look={THEO_CASCO} ruta={[{ f: 0, x: 3440, y: P - 400 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "agarrarAlto" }]} caras={[{ f: 0, v: "determinado" }]} sombra={0} />
          <A look={MARCUS} ruta={[{ f: 0, x: 3250, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "empujar" }]} caras={[{ f: 0, v: "miedo" }]} ajuste={(p, ff) => ({ ...p, tronco: (p.tronco ?? 0) + 2 * Math.sin(ff * 0.9) })} />
        </g>
      </>}
      hud={<>
        <EtiquetaFlotante x={960} y={200} rotulo="UTILITY CREWS" claves={[{ f: 0, v: 0 }, { f: l(214.2), v: 36, d: 40 }]} sufijo=" TRUCKS" color="#ffb04a" hasta={l(217.2)} tam={64} />
        <EtiquetaFlotante x={960} y={200} rotulo="US" claves={1} sufijo=" TRUCK" color="#ffcf6e" desde={l(217.6)} tam={64} />
      </>}
    />
  );
};

// ---------- 36 · 223:5-239:6 · la tapa de la cloaca; el caño que saca; cuando paran las bombas, sube ----------
const P36: React.FC = () => {
  const f = useF();
  const l = loc(223.5);
  const P = SUB_PISO;
  const tapar = { hD: 40, cD: 140, cabeza: 6 };
  return (
    <Escena Set={Subsuelo} pal={PAL} setProps={{ hora: "invierno", luz: { cloaca: ap(f, l(227.6), 10), agua: ap(f, l(228.6), 10) }, flujo: 1 - ap(f, l(233.8), 20), sube: ap(f, l(233.8), 150), nieve: 0.4 }} seed={38}
      claves={[mira(0, 1200, 480, 1.3), mira(l(227.0), 1220, 480, 1.35), mira(l(228.2), 1900, 760, 0.75, { curva: "inout" }), mira(l(233.6), 2600, 760, 0.8, { curva: "inout" }), mira(l(236.0), 1250, 640, 1.2, { curva: "inout" }), mira(l(239.6), 1220, 600, 1.35)]}
      medio={<>
        <A look={THEO_INV} ruta={[{ f: 0, x: 1040, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: tapar }]} caras={[{ f: 0, v: "asco" }]} />
        <A look={JUNE_INV} ruta={[{ f: 0, x: 1360, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: tapar }]} caras={[{ f: 0, v: "asco" }]} seed={2} />
        <A look={DEV} ruta={[{ f: 0, x: 1470, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "manosCara" }]} caras={[{ f: 0, v: "asco" }]} seed={3} />
      </>}
      hud={<Rotulo texto="CHOLERA · TYPHOID" x={960} y={880} centro desde={l(236.6)} color="#b8d86a" tam={84} rot={0} />}
    />
  );
};

// ---------- 38 · 239:6-243:6 · June pega el cartel: NEVER DRINK THE TAP ----------
const P38: React.FC = () => {
  const f = useF();
  const l = loc(239.6);
  const P = VIS_PISO;
  const k = ap(f, l(241.2), 8);
  return (
    <Escena Set={Visitantes} pal={PAL} setProps={{ hora: "dia" }} seed={39}
      claves={[mira(0, 3050, 600, 1.4), mira(l(243.6), 3080, 560, 1.6)]}
      medio={<>
        <g transform={`translate(3150,${P - 520}) rotate(${-2 + (1 - k) * 8}) scale(${0.8 + 0.2 * k})`} opacity={k}>
          <rect x={-190} y={-120} width={380} height={240} fill="#f6ecd2" />
          <text x={0} y={-30} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={62} fill="#c0352c">NEVER DRINK</text>
          <text x={0} y={60} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={62} fill="#c0352c">THE TAP</text>
          {[-180, 180].map((x) => <rect key={x} x={x - 30} y={-130} width={60} height={22} fill="#d8ccb0" opacity={0.8} transform={`rotate(${x > 0 ? 30 : -30} ${x} -120)`} />)}
        </g>
        <A look={JUNE} ruta={[{ f: 0, x: 2900, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 120, cD: 30, hI: 110, cI: 30 } }, { f: l(241.4), v: { hD: 140, cD: 10 } }, { f: l(242.4), v: "manosCintura" }]} caras={[{ f: 0, v: "determinado" }]} />
      </>}
    />
  );
};

// ---------- 39/50 · el agua del lago, botes ----------
const Lago: React.FC<{ y: number; x0: number; w: number; f: number }> = ({ y, x0, w, f }) => (
  <g>
    <rect x={x0} y={y - 30} width={w} height={800} fill="#3a5a7a" />
    {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={x0 + ((i * 210 + f * 2) % w)} y={y - 10 + (i % 4) * 34} width={110} height={5} rx={3} fill="#9bd8ff" opacity={0.6} />)}
  </g>
);
const P39: React.FC = () => {
  const f = useF();
  const l = loc(243.6);
  const y = 960;
  return (
    <Escena Set={CanalPark} pal={PAL} setProps={{ hora: "dia", luces: 0, nieve: 0.3, hielo: 0, ventanaGus: 0 }} seed={40}
      claves={[mira(0, 2000, 660, 0.75), mira(l(245.6), 2100, 720, 0.9)]}
      medio={<>
        <Lago y={y} x0={800} w={3400} f={f} />
        <A look={MARCUS} ruta={[{ f: 0, x: 2000, y: y - 40 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "agacharse" }]} caras={[{ f: 0, v: "determinado" }]} sombra={0} />
        <A look={PRIYA} ruta={[{ f: 0, x: 2180, y: y - 40 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 60, cD: 40, hI: 50, cI: 40 } }]} caras={[{ f: 0, v: "feliz" }]} sombra={0} seed={2} />
        <Bote x={2100} y={y} s={0.9} f={f} />
      </>}
      hud={<Rotulo texto="far from shore" x={1300} y={230} desde={l(244.0)} color="#9bd8ff" tam={62} rot={-3} brillo={false} />}
    />
  );
};

// ---------- 40 · 245:6-247:3 · la olla hierve ----------
const P40: React.FC = () => {
  const l = loc(245.6);
  return <Escena Set={Mesa} pal={PAL} setProps={{ obj: "olla", hervor: 1 }} seed={56} claves={[mira(0, 960, 560, 1.1), mira(l(247.3), 960, 520, 1.3)]} hud={<Rotulo texto="boil everything" x={1350} y={200} desde={l(245.9)} color="#ffcf6e" tam={66} rot={-3} />} />;
};

// ---------- 41 · 247:3-256:1 · la hornalla de gas: la llama azul se achica; el manómetro cae ----------
const P41: React.FC = () => {
  const f = useF();
  const l = loc(247.3);
  const k = interpolate(f, [l(251.4), l(256.0)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <Escena Set={Mesa} pal={PAL} setProps={{ obj: "hornalla", llama: 0.15 + 0.85 * k, aguja: 0.1 + 0.6 * k, tono: "frio" }} seed={57} claves={[mira(0, 960, 600, 1.1), mira(l(251.6), 1000, 620, 1.25), mira(l(256.1), 1300, 820, 1.7, { curva: "inout" })]} />;
};

// ---------- 42 · 256:1-261:4 · el caño de gas, kilómetros, hasta la compresora apagada ----------
const P42: React.FC = () => {
  const l = loc(256.1);
  const P = REP_PISO;
  return (
    <Escena Set={Represa} pal={PAL} setProps={{ hora: "invierno", nieve: 0.9, corte: 1 }} seed={41}
      claves={[mira(0, 2600, 640, 1.0), mira(l(261.4), 5900, 560, 0.85, { curva: "inout" })]}
      medio={<>
        <rect x={2000} y={P - 60} width={4200} height={26} rx={13} fill="#e8c040" />
        {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={2100 + i * 340} y={P - 66} width={14} height={38} fill="#b8902a" />)}
        <g transform={`translate(5700,${P})`}>
          <rect x={0} y={-320} width={560} height={320} fill="#6a6e78" />
          <rect x={60} y={-260} width={120} height={160} fill="#2a2e38" /><rect x={240} y={-260} width={120} height={160} fill="#2a2e38" />
          <rect x={420} y={-480} width={50} height={180} fill="#55525e" />
          <rect x={30} y={-380} width={500} height={50} fill="#2a2430" /><text x={280} y={-343} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={30} fill="#f6ecd2" letterSpacing={3}>COMPRESSOR STATION</text>
          <circle cx={520} cy={-100} r={16} fill="#5a2020" />
        </g>
      </>}
      hud={<Rotulo texto="THE GAS HAS STOPPED" x={960} y={180} centro desde={l(259.2)} color="#ff7a2a" tam={78} rot={0} />}
    />
  );
};

// ---------- 43 · 261:4-275:1 · la cuesta: grieta → río de deshielo → falta el tramo ----------
const P43: React.FC = () => {
  const f = useF();
  const l = loc(261.4);
  const vis = (ff: number) => ap(ff, l(272.2), 8);
  return (
    <Escena Set={Cuesta} pal={PAL} setProps={{ hora: "dia", grieta: ap(f, l(262.0), 90), rio: ap(f, l(265.8), 40) * (1 - ap(f, l(271.4), 20) * 0.6), hueco: ap(f, l(271.6), 24), nieve: 1 - ap(f, l(265.6), 120) }} seed={42}
      claves={[mira(0, 1700, 520, 0.8), mira(l(265.6), 1750, 480, 0.95), mira(l(271.4), 1700, 500, 0.75, { curva: "inout" }), mira(l(275.1), 1720, 500, 0.8)]}
      medio={<>
        <A look={THEO_INV} ruta={[{ f: 0, x: 1400, y: cuestaY(1400) }]} dir={[{ f: 0, v: 1 }]} opacidad={vis} poses={[{ f: 0, v: "manosCintura" }]} caras={[{ f: 0, v: "sorpresa" }]} />
        <A look={DEV} ruta={[{ f: 0, x: 1290, y: cuestaY(1290) }]} dir={[{ f: 0, v: 1 }]} opacidad={vis} poses={[{ f: 0, v: "manosCara" }]} caras={[{ f: 0, v: "miedo" }]} seed={3} />
      </>}
      hud={<Rotulo texto="LATE APRIL" x={1260} y={220} desde={l(272.0)} color="#f6ecd2" tam={84} rot={-3} brillo={false} />}
    />
  );
};

// ---------- 44 · 275:1-290:0 · la cuenta honesta: miles de trabajadores fantasma → quedan los 10 ----------
const P44: React.FC = () => {
  const f = useF();
  const l = loc(275.1);
  const ghost = interpolate(f, [l(275.6), l(281), l(286.4), l(286.7)], [0, 0.45, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escena Set={Mirador} pal={PAL} setProps={{ luces: 0.06, nieve: 0.9, ghost, noche: 0.25 }} seed={43}
      claves={[mira(0, 960, 520, 0.95), mira(l(281.0), 960, 480, 0.85), mira(l(286.6), 960, 470, 0.8), mira(l(288.4), 470, 900, 2.4, { curva: "inout" }), mira(l(290.0), 470, 900, 2.5)]}
      medio={<>{LOS10.map((look, i) => <A key={i} look={look} escala={(i >= 8 ? NINO : 1) * 0.32} ruta={[{ f: 0, x: 400 + i * 17, y: 975 }]} dir={[{ f: 0, v: 1 }]} sombra={0} />)}</>}
      hud={<GranNumero rotulo="WORKERS IT TAKES" claves={[{ f: 0, v: 0 }, { f: l(276.0), v: 400, d: 60 }, { f: l(281), v: 3000, d: 120 }]} sufijo="+" desde={l(276)} hasta={l(286.7)} color="#ff8a2a" />}
    />
  );
};

// ---------- 45 · 290:0-301:1 · Gus levanta el marcador amarillo; los 10 frente al mapa; rodea la biblioteca ----------
const P45: React.FC = () => {
  const f = useF();
  const l = loc(290.0);
  const P = VIS_PISO;
  return (
    <Escena Set={Visitantes} pal={PAL} setProps={{ hora: "ocaso", mapa: { desde: [l(300.1), 99999, 99999, 99999], apagar: 0 } }} seed={44}
      claves={[mira(0, 2400, 680, 2.0), mira(l(292.2), 2420, 680, 2.1), mira(l(292.6), 2800, 640, 0.95, { curva: "inout" }), mira(l(297.6), 2780, 600, 1.0), mira(l(298.4), VIS_MAPA.x + 400, VIS_MAPA.y + 240, 1.6, { curva: "inout" }), mira(l(301.1), VIS_MAPA.x + 420, VIS_MAPA.y + 230, 1.7)]}
      medio={<>
        {LOS10.map((look, i) => <A key={i} look={look} escala={i >= 8 ? NINO : 1} seed={60 + i} ruta={[{ f: 0, x: 2150 + i * 125 + (i === 0 ? 250 : 0), y: P }]} dir={[{ f: 0, v: 1 }]}
          poses={i === 0 ? [{ f: 0, v: { hD: 150, cD: 40 } }, { f: l(292.6), v: { hD: 120, cD: 30 } }] : i === 2 ? [{ f: 0, v: "brazosCruzados" }] : [{ f: 0, v: "parado" }]}
          caras={[{ f: 0, v: i === 0 ? "determinado" : "triste" }]} miradas={[{ f: 0, v: { x: 0.4, y: -0.6 } }]}
          enManoD={i === 0 ? <rect x={-7} y={-34} width={14} height={40} rx={4} fill="#f2c230" /> : undefined} />)}
        <Ore x={3500} y={P} s={0.9} dir={-1} f={f} sentado={1} cola={0.2} />
      </>}
    />
  );
};

// ---------- 47-51 · lo que se llevan: biblioteca · farmacia · radio · botes; lo demás se apaga ----------
const Salva: React.FC<{ n: number; t: string; desde: number }> = ({ n, t, desde }) => <Pildora texto={`SAVE ${n} · ${t}`} x={1540} y={70} desde={desde} color="#ffcf6e" tam={36} />;
const P47: React.FC = () => {
  const l = loc(301.1);
  const P = BIB_PISO;
  return (
    <Escena Set={Biblioteca} pal={PAL} seed={45} claves={[mira(0, 1100, 560, 0.75), mira(l(305.5), 1150, 700, 1.25, { curva: "inout" })]}
      medio={<A look={NAN} ruta={[{ f: 0, x: 1100, y: P }, { f: l(304.0), x: 1500, y: P, curva: "out" }]} poses={[{ f: 0, v: { hD: 70, cD: 110, hI: 60, cI: 110 } }]} caras={[{ f: 0, v: "determinado" }, { f: l(303.4), v: "feliz" }]} habla={[[l(302.4), l(304.7)]]}
        enManoD={<g>{["#3a5a8a", "#c0352c", "#e8c040", "#2a7a5a", "#7a4a8a"].map((c, k) => <rect key={k} x={-50} y={-30 - k * 18} width={100} height={17} rx={2} fill={c} />)}</g>} />}
      hud={<><Salva n={1} t="LIBRARY" desde={l(301.2)} /><Rotulo texto="knowledge doesn't rot" x={960} y={930} centro desde={l(303.1)} color="#ffcf6e" tam={66} rot={0} /></>} />
  );
};
const P48: React.FC = () => {
  const f = useF();
  const l = loc(305.5);
  const P = LOBBY_PISO;
  const X = LOBBY_PUNTOS.mostrador;
  return (
    <Escena Set={Lobby} pal={PAL} setProps={{ luces: 0.3, afuera: "dia", monitores: false }} seed={46} claves={[mira(0, X, 640, 1.3), mira(l(309.3), X + 60, 620, 1.45)]}
      medio={<>
        <rect x={X + 80} y={P - 140} width={220} height={140} fill="#c9a26a" /><rect x={X + 80} y={P - 150} width={220} height={18} fill="#a8844e" />
        {Array.from({ length: Math.min(8, Math.floor(f / 12)) }).map((_, k) => <rect key={k} x={X + 100 + (k % 4) * 48} y={P - 190 - Math.floor(k / 4) * 46} width={30} height={42} rx={6} fill={["#e8a040", "#f6ecd2", "#c0352c", "#7cc0e8"][k % 4]} />)}
        <A look={JUNE} ruta={[{ f: 0, x: X - 40, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 70, cD: 30, tronco: 14 } }]} ajuste={(p, ff) => ({ ...p, hD: (p.hD ?? 0) + 20 * Math.sin(ff / 6) })} caras={[{ f: 0, v: "determinado" }]}
          enManoD={<rect x={-14} y={-20} width={28} height={40} rx={6} fill="#e8a040" />} />
      </>}
      hud={<Salva n={2} t="PHARMACY" desde={l(305.6)} />} />
  );
};
const P49: React.FC = () => {
  const l = loc(309.3);
  return (
    <Escena Set={Techo} pal={PAL} setProps={{ onda: [] }} seed={47} claves={[mira(0, 1200, 700, 1.4), mira(l(312.4), 900, 700, 1.25)]}
      medio={<A look={GUS} ruta={[{ f: 0, x: 1250, y: TECHO_PISO }, { f: l(312.4), x: 700, y: TECHO_PISO }]} poses={[{ f: 0, v: { hD: 70, cD: 100, hI: 70, cI: 100 } }]} caras={[{ f: 0, v: "triste" }]}
        enManoD={<g><rect x={-70} y={-60} width={140} height={60} rx={8} fill="#2a2a30" /><rect x={-56} y={-50} width={70} height={30} fill="#3a6a4a" /></g>} />}
      hud={<Salva n={3} t="GUS'S RADIO" desde={l(309.4)} />} />
  );
};
const P50: React.FC = () => {
  const f = useF();
  const l = loc(312.4);
  const y = 990;
  return (
    <Escena Set={CanalPark} pal={PAL} setProps={{ hora: "dia", luces: 0, nieve: 0.3, hielo: 0, ventanaGus: 0 }} seed={48} claves={[mira(0, 1700, 640, 0.7), mira(l(316.1), 1750, 720, 0.95, { curva: "inout" })]}
      medio={<>
        <Lago y={y} x0={800} w={3400} f={f} />
        {[1450, 1950, 2450].map((x, i) => <Bote key={x} x={x} y={y} s={0.8} f={f + i * 30} color={["#9aa0a8", "#c0352c", "#e8e2d6"][i]} />)}
        <rect x={800} y={y - 120} width={1000} height={34} fill="#7a5a3a" /><rect x={800} y={y - 90} width={1000} height={10} fill="#4a3426" />
        {[860, 1100, 1340, 1580, 1780].map((x) => <rect key={x} x={x} y={y - 90} width={22} height={160} fill="#4a3426" />)}
        <path d={`M1730,${y - 230} Q1640,${y - 60} 1500,${y - 40}`} stroke="#d8ccb0" strokeWidth={5} fill="none" />
        <A look={MARCUS} ruta={[{ f: 0, x: 1720, y: y - 120 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "agacharse" }, { f: l(314.8), v: "tirarSuelta" }]} caras={[{ f: 0, v: "determinado" }]} />
      </>}
      hud={<><Salva n={4} t="THE BOATS" desde={l(312.6)} /><Rotulo texto="the only road that never breaks" x={960} y={180} centro desde={l(313.8)} color="#9bd8ff" tam={60} rot={0} /></>} />
  );
};
const P51: React.FC = () => {
  const f = useF();
  const l = loc(316.1);
  return (
    <Escena Set={Visitantes} pal={PAL} setProps={{ hora: "ocaso", mapa: { desde: [-99, -99, -99, -99], apagar: ap(f, l(316.6), 24) } }} seed={49}
      claves={[mira(0, VIS_MAPA.x + 400, VIS_MAPA.y + 235, 1.9), mira(l(318.7), VIS_MAPA.x + 400, VIS_MAPA.y + 240, 1.55)]}
      hud={<Rotulo texto="everything else, they leave" x={960} y={960} centro desde={l(316.4)} color="#f6ecd2" tam={60} rot={0} brillo={false} />} />
  );
};

// ---------- 52-55 · DÍA 200, la última noche en el muelle: tambor con fuego, el puente levantado ----------
const Tambor: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => (
  <g>
    <Halo x={x} y={y - 170} r={560} color="#ff9a3a" fuerza={0.6} />
    <rect x={x - 50} y={y - 130} width={100} height={130} rx={8} fill="#4a3a3a" /><rect x={x - 52} y={y - 90} width={104} height={8} fill="#3a2a2a" /><rect x={x - 52} y={y - 40} width={104} height={8} fill="#3a2a2a" />
    {Array.from({ length: 6 }).map((_, i) => { const h = 70 + 30 * Math.sin(f / 2.5 + i * 2); return <path key={i} d={`M${x - 44 + i * 17},${y - 128} Q${x - 36 + i * 17},${y - 128 - h} ${x - 28 + i * 17},${y - 128} Z`} fill={i % 2 ? "#ff7a2a" : "#ffcf6e"} />; })}
  </g>
);
const P52: React.FC = () => {
  const f = useF();
  const l = loc(318.7);
  const P = CANAL_PISO;
  const X = CANAL_PUNTOS.muelle;
  // Gus a la izquierda del tambor, Lily a la derecha; el resto en ronda
  const lugar = [X - 150, X - 330, X - 470, X - 610, X - 750, X + 330, X + 470, X + 610, X + 760, X + 160];
  return (
    <Escena Set={CanalPark} pal={PAL} setProps={{ hora: "noche", luces: 0, nieve: 0.4, hielo: 0, ventanaGus: 0 }} seed={50}
      claves={[mira(0, 2300, 420, 0.6), mira(l(322.0), 2100, 480, 0.66), mira(l(322.2), X, 690, 1.2, { curva: "inout" }), mira(l(326.0), X + 40, 680, 1.25), mira(l(330.6), 2600, 300, 0.75, { curva: "inout" }), mira(l(331.0), X + 160, 700, 1.9, { curva: "inout" }), mira(l(334.4), X + 140, 700, 1.95), mira(l(334.8), X - 120, 670, 2.3, { curva: "inout" }), mira(l(337.5), X - 130, 660, 2.4)]}
      medio={<>
        <Tambor x={X} y={P} f={f} />
        {LOS10.map((look, i) => { const x = lugar[i]; const izq = x < X; return <A key={i} look={look} escala={i >= 8 ? NINO : 1} seed={70 + i} luz={{ lado: izq ? 1 : -1, color: "#ff9a3a", fuerza: 0.9 }} ruta={[{ f: 0, x, y: P }]} dir={[{ f: 0, v: izq ? 1 : -1 }]}
          poses={[{ f: 0, v: i % 3 === 0 ? { hD: 70, cD: 60, hI: 70, cI: 60 } : "parado" }]} caras={[{ f: 0, v: i === 9 ? "duda" : "cansado" }]}
          habla={i === 9 ? [[l(331.0), l(333.6)]] : i === 0 ? [[l(334.6), l(337.3)]] : []} miradas={i === 0 ? [{ f: 0, v: { x: 0.5, y: -0.3 } }] : undefined} />; })}
        <Ore x={X + 900} y={P} s={0.9} dir={-1} f={f} echado={1} cola={0.3} />
      </>}
      hud={<>
        <Globo texto="How long will the bridge stand?" x={1250} y={300} desde={l(331.0)} hasta={l(334.4)} cola="abajo" tam={60} />
        <Globo texto={"Longer than us, kid.\nBut not forever."} x={800} y={280} desde={l(334.6)} hasta={l(337.5)} cola="abajo" tam={60} />
      </>}
    />
  );
};

// ---------- 56 · 337:5-345:0 · a la mañana cargan todo en 3 camionetas y salen al norte, a Hermantown ----------
const P56: React.FC = () => {
  const f = useF();
  const l = loc(337.5);
  const P = SUP_PISO;
  const sale = (k: number) => interpolate(f, [l(339.4 + k * 0.5), l(345.0)], [0, 2600], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => t * t });
  return (
    <Escena Set={Superior} pal={PAL} setProps={{ hora: "alba", luces: 0, rotulos: true }} seed={51}
      claves={[mira(0, 2400, 620, 0.7), mira(l(339.4), 2500, 620, 0.72), mira(l(345.0), 4800, 600, 0.8, { curva: "inout" })]}
      frente={<>
        {[0, 1, 2].map((k) => { const x = 2100 + k * 620 + sale(k); return <g key={k}>
          <Auto x={x} y={P + 170} color={["#2f4a5e", "#6a2f36", "#c9b48a"][k]} tipo="pickup" s={2.3} dir={1} faros />
          {k === 0 && <g transform="translate(0,95)">{["#3a5a8a", "#c0352c", "#e8c040"].map((c, j) => <rect key={j} x={x - 160 + j * 40} y={P - 50 - j * 6} width={36} height={60} fill={c} />)}</g>}
          {k === 1 && <g transform="translate(0,95)"><rect x={x - 170} y={P - 60} width={140} height={70} fill="#c9a26a" /><rect x={x - 150} y={P - 110} width={100} height={50} fill="#2a2a30" /></g>}
          {k === 2 && <g transform="translate(0,95)"><path d={`M${x - 560},${P + 20} L${x - 220},${P + 20} L${x - 250},${P + 60} L${x - 540},${P + 60} Z`} fill="#9aa0a8" /><rect x={x - 220} y={P + 30} width={60} height={6} fill="#3a3a3a" /></g>}
        </g>; })}
        <CartelVerde x={4600} y={P - 40} s={0.7} l1="HERMANTOWN" l2="NORTH 53" />
      </>}
    />
  );
};

// ---------- 57-60 · la granja: latas que se acaban, semillas que vencen, 7.000.000 kcal, la tierra ----------
const P57: React.FC = () => {
  const f = useF();
  const l = loc(345.0);
  const P = GRANJA_PISO;
  const quedan = Math.max(2, 15 - Math.floor(interpolate(f, [l(346.5), l(350.0)], [0, 13], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  return (
    <Escena Set={Granja} pal={PAL} setProps={{ hora: "dia", estacion: "barro", crec: 0, humo: 0.6 }} seed={52}
      claves={[mira(0, 1250, 560, 0.62), mira(l(346.4), 1250, 600, 0.7), mira(l(347.0), 1540, 690, 1.8, { curva: "inout" }), mira(l(350.1), 1550, 690, 1.9)]}
      medio={<g>
        {[330, 230, 130].map((dy) => <rect key={dy} x={1440} y={P - dy} width={220} height={12} fill="#6a4a32" />)}
        {Array.from({ length: quedan }).map((_, i) => <Lata key={i} x={1468 + (i % 5) * 44} y={P - 330 + Math.floor(i / 5) * 100} color={["#e0563a", "#e8c040", "#7cb85a", "#c9c9c4"][i % 4]} s={1.0} />)}
      </g>}
      hud={<Rotulo texto="canned food won't last" x={960} y={180} centro desde={l(347.4)} color="#f6ecd2" tam={64} rot={0} brillo={false} />} />
  );
};
const P58: React.FC = () => {
  const l = loc(350.1);
  return <Escena Set={Mesa} pal={PAL} setProps={{ obj: "semillas", tono: "calido", fecha: "BEST BY: THIS SPRING" }} seed={53} claves={[mira(0, 960, 540, 1.05), mira(l(354.3), 980, 640, 1.4)]} hud={<Rotulo texto="short summer" x={1350} y={180} desde={l(352.4)} color="#ffcf6e" tam={74} rot={-3} />} />;
};
const P59: React.FC = () => {
  const f = useF();
  const l = loc(354.3);
  const P = GRANJA_PISO;
  return (
    <Escena Set={Granja} pal={PAL} seed={54}
      setProps={{ hora: "dia", estacion: "barro", crec: 0, humo: 0.6, pared: [{ t: "7,000,000", desde: l(355.2), x: 10, y: 90, tam: 54, color: "#c0352c" }, { t: "KCAL / YEAR", desde: l(356.4), x: 10, y: 170, tam: 40, color: "#2a2430" }] }}
      claves={[mira(0, 1010, 520, 1.6), mira(l(359.4), 1000, 540, 1.25), mira(l(359.6), 3300, 700, 1.4, { curva: "inout" }), mira(l(361.9), 3320, 720, 1.6)]}
      medio={<>
        <A look={MARCUS} ruta={[{ f: 0, x: 1220, y: P }, { f: l(359.4), x: 1220, y: P }, { f: l(359.6), x: 3300, y: P }]} dir={[{ f: 0, v: -1 }, { f: l(359.6), v: 1 }]}
          poses={[{ f: 0, v: { hD: 120, cD: 40 } }, { f: l(358.6), v: "manosCintura" }, { f: l(359.6), v: "arrodillado" }]}
          caras={[{ f: 0, v: "determinado" }]} enManoD={(ff) => ff > l(360.6) ? <circle r={16} fill="#4a3426" /> : ff < l(358.6) ? <rect x={-7} y={-34} width={14} height={40} rx={4} fill="#c0352c" /> : null} />
        {f > l(359.6) && <Halo x={3360} y={P - 140} r={240} color="#ffcf6e" fuerza={0.35} />}
      </>}
      hud={<Rotulo texto="grow it themselves" x={960} y={170} centro desde={l(360.0)} color="#ffcf6e" tam={70} rot={0} />} />
  );
};

// ---------- 62 · 372:3-379:7 · CTA: los 10 en la granja al atardecer ----------
const P62: React.FC = () => {
  const f = useF();
  const l = loc(372.3);
  const P = GRANJA_PISO;
  return (
    <Escena Set={Granja} pal={PAL} setProps={{ hora: "ocaso", estacion: "barro", crec: 0, humo: 0.6 }} seed={55}
      claves={[mira(0, 2500, 600, 0.9), mira(l(379.7), 2550, 620, 1.0, { curva: "inout" })]}
      medio={<>
        {LOS10.map((look, i) => <A key={i} look={look} escala={i >= 8 ? NINO : 1} seed={80 + i} luz={{ lado: -1, color: "#ff9a3a", fuerza: 0.9 }} ruta={[{ f: 0, x: 1950 + i * 120, y: P }]} dir={[{ f: 0, v: i % 2 ? -1 : 1 }]} caras={[{ f: 0, v: i % 3 === 1 ? "duda" : "feliz" }]} />)}
        <Ore x={3250} y={P} s={0.9} dir={-1} f={f} sentado={1} cola={1} />
      </>}
      hud={<>
        <Rotulo texto="What 3 would you save?" x={960} y={170} centro desde={l(372.6)} color="#ffcf6e" tam={88} rot={0} />
        <Pildora texto="Subscribe · the census continues" x={960} y={980} desde={l(376.9)} color="#ffcf6e" tam={38} />
      </>}
    />
  );
};

export const PLANOS_B: [number, React.ReactNode, PlanoM["trans"]?][] = [
  [165.8, <P23 />, { tipo: "cortina", d: 14, color: "#0b0810" }], [184.9, <P24 />],
  [192.0, <PPizarra s0={192.0} s1={194.1} tachas={[192.3]} />],
  [194.1, <P29 />, { tipo: "cortina", d: 14, color: "#0b0810", lado: -1 }], [201.1, <P31 />, { tipo: "barrido", d: 10 }], [213.5, <P33 />],
  [220.2, <PPizarra s0={220.2} s1={223.5} tachas={[218.0, 221.1]} />],
  [223.5, <P36 />, { tipo: "cortina", d: 14, color: "#0b0810" }], [239.6, <P38 />], [243.6, <P39 />], [245.6, <P40 />],
  [247.3, <P41 />], [256.1, <P42 />, { tipo: "barrido", d: 10 }], [261.4, <P43 />, { tipo: "cortina", d: 14, color: "#0b0810" }],
  [275.1, <P44 />, { tipo: "fundido", d: 16 }], [290.0, <P45 />],
  [301.1, <P47 />, { tipo: "luz", d: 12 }], [305.5, <P48 />], [309.3, <P49 />], [312.4, <P50 />], [316.1, <P51 />, { tipo: "luz", d: 12 }],
  [318.7, <P52 />, { tipo: "fundido", d: 20 }], [337.5, <P56 />, { tipo: "fundido", d: 18 }],
  [345.0, <P57 />, { tipo: "luz", d: 16 }], [350.1, <P58 />], [354.3, <P59 />],
  [361.9, <PCuaderno s0={361.9} s1={372.3} escritos={[{ t: "POPULATION: 10", g: 362.4, x: 520, y: 330, tam: 64 }, { t: "DAYS UNTIL FIRST FROST:", g: 365.8, x: 520, y: 520, tam: 58, color: "#2a4a8a" }, { t: "147", g: 370.6, x: 1000, y: 720, tam: 170, sub: [371.4], color: "#c0352c" }]} />, { tipo: "fundido", d: 14 }],
  [372.3, <P62 />, { tipo: "fundido", d: 16 }], [379.7, <TarjetaSiguiente ep={4} s0={379.7} />, { tipo: "fundido", d: 18 }],
];
