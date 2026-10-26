// lc03 · planos 2:46-6:25 (SEC 8-19 del plan MxM). Cuadros locales: l(segundo global).
import React from "react";
import { Easing, interpolate } from "remotion";
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
import { A, Rotulo, T, gestos, loc } from "./comun_ep";
import { TapaVitrina } from "./piezas_e3a";
import { POSES, alcanzar, articulaciones, pose } from "../../anikit/personaje";
import { Chispas, EscenaS, Escribe, ManoMarcador, Manometro, Onoma, Rueda, Salpica, Vaho, Hojas, ManoPunta, Cifra, Pastilla, rampa, Brazo, ManoDedos } from "./piezas_e3b";
import { BEN, DEV, LILY, MARCUS, NAN, NINO, Ore, PRIYA, ROSA } from "./elenco_lcb";
import { GRANJA_PISO, Granja, Papa } from "./granja";
import { Biblioteca, BIB_PISO, Bote, CartelVerde, Mesa, Techo, TECHO_PISO } from "./insertos";
import { LK_AGUA, LK_PISO, Lakewood } from "./lakewood";
import { LUCES } from "../mundo/hora";
import { Mirador } from "./mirador";
import { REP_PISO, Represa } from "./represa";
import { Cuesta, cuestaY, SUB_PISO, SUB_Y, Subsuelo } from "./subsuelo";
import { F_HUD } from "../../anikit/pantalla";
import { Helada4, Horquilla, MARCUS_VERANO } from "./tarjetas";
import { MAPA_LUGARES, VIS_MAPA, VIS_PISO, Visitantes } from "./visitantes";
import { mezclar, osc } from "../../anikit/sets/comun";
import { Comparacion, Velo } from "../../anikit/explica";
import { F_MANO } from "../../anikit/pantalla";

const ap = (f: number, a: number, d = 10) => interpolate(f, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const THEO_CASCO = conAcc({ ...THEO, accesorios: [] }, { t: "gorra", color: "#f2c230" }, { t: "bufanda", color: "#efe3c8" });
const LOS10 = [GUS, THEO_INV, JUNE_INV, MARCUS, ROSA, DEV, PRIYA, NAN, BEN, LILY];
const FILAS = ["WATER", "POWER", "SEWER", "HEAT", "ROADS", "FOOD"];

// SYSTEMS CHECKED n/6 (cuadros globales)
export const SISTEMAS = [{ f: 0, v: 0 }, { f: T(192.3) + 36, v: 1 }, { f: T(220.9) + 36, v: 2 }, { f: T(240.6), v: 3 }, { f: T(258.4), v: 4 }, { f: T(273.0), v: 5 }, { f: T(277.0), v: 6 }];

// ---------- la pizarra de los 6 sistemas (E25 / E29); `tachas` = segundo global de cada ✗ ya caída o que cae acá ----------
// Set de E22: Gus de cuerpo entero (~510 px) tacha la fila con el marcador (la ✗ se dibuja en 1,2 s), los otros 9 sentados en el banco.
// Al cerrar la ✗ el contador sube; después Gus se da vuelta hacia los sentados y niega con la cabeza. La vitrina se tapa con la misma pared.
const SEN_B = { tronco: -4, pI: 88, rI: 88, pD: 92, rD: 92, hI: 25, cI: 50, hD: 35, cD: 55 };
const X_DUR = 36; // 1,2 s por ✗
const PPizarra: React.FC<{ s0: number; s1: number; tachas: number[]; iconos?: boolean; pop?: string }> = ({ s0, s1, tachas, iconos }) => {
  const f = useF();
  const l = loc(s0);
  const nuevas = tachas.map((g, fila) => ({ g, fila })).filter((q) => q.g >= s0);
  const q = nuevas[nuevas.length - 1];
  const xa = l(q.g), xb = xa + X_DUR; // la ✗ nueva: de xa a xb
  const lit = (g: number | undefined) => (g === undefined ? 1 : 1 - ap(f, l(g) + X_DUR, 6));
  const aguaG = tachas[0], luzG = tachas[1];
  const BX = 220, BY = 250, BW = 680, BH = 420, P = VIS_PISO;
  const filaY = (i: number) => BY + 150 + i * 48;
  const TX = 470;
  const GX = 590;
  // Gus: señala la fila → tacha (dos trazos, la mano va y viene) → baja el brazo → gira hacia los sentados → niega
  const fy = q.fila;
  const alto = { hD: 150 - fy * 12, cD: 6 };
  const vuelta = xb + 8;
  const posesG: { f: number; v: any }[] = [{ f: 0, v: { hD: 120 - fy * 10, cD: 30 } }, { f: Math.max(1, xa - 6), v: alto },
    ...gestos(xa, xb, [{ ...alto, hD: alto.hD + 8, cD: 2, tronco: -3 }, { ...alto, hD: alto.hD - 10, cD: 14, tronco: 2 }], 9),
    { f: xb, v: { hD: 60, cD: 40 } }, { f: vuelta + 6, v: { hD: 20, cD: 30, hI: 20, cI: 30 } }];
  const niega = gestos(vuelta + 8, l(s1) + 2, [{ hD: 20, cD: 30, hI: 20, cI: 30, cabeza: 9 }, { hD: 20, cD: 30, hI: 20, cI: 30, cabeza: -9 }], 6);
  return (
    <EscenaS Set={Visitantes} pal={PAL} seed={Math.round(s0)} mano={1.5} sacudidas={[xb]} amp={10}
      setProps={{ hora: "dia", pizarra: [], tachas: [] }}
      claves={[mira(0, 520, 580, 1.1), mira(l(s1), 545, 590, 1.14)]}
      detras={<TapaVitrina />}
      medio={<>
        {/* pizarra propia */}
        <rect x={BX - 14} y={BY - 14} width={BW + 28} height={BH + 28} rx={8} fill="#a9b0ba" />
        <rect x={BX} y={BY} width={BW} height={BH} fill="#f4f6f6" />
        <rect x={BX} y={BY + BH} width={BW} height={14} fill="#8a909a" />
        {[0, 1, 2].map((k) => <rect key={k} x={BX + 40 + k * 40} y={BY + BH - 2} width={30} height={10} rx={3} fill={["#2a3a8a", "#c0352c", "#2a7a3a"][k]} />)}
        <text x={BX + 36} y={BY + 80} fontFamily={F_MANO} fontWeight={700} fontSize={60} fill="#c0352c">DULUTH</text>
        <path d={`M${BX + 36},${BY + 96} L${BX + 230},${BY + 92}`} stroke="#c0352c" strokeWidth={5} strokeLinecap="round" />
        {FILAS.map((t, i) => <text key={t} x={BX + 40} y={filaY(i)} fontFamily={F_MANO} fontWeight={700} fontSize={44} fill="#1d2a6a">{t}</text>)}
        {tachas.map((g, fila) => {
          const k = g < s0 ? 1 : Math.min(1, Math.max(0, (f - l(g)) / X_DUR));
          if (k <= 0) return null;
          const y = filaY(fila) - 16;
          const t1 = Math.min(1, k * 2), t2 = Math.max(0, k * 2 - 1);
          return <path key={fila} d={`M${TX},${y - 20} L${TX + 44 * t1},${y - 20 + 40 * t1}${t2 > 0 ? ` M${TX + 44},${y - 20} L${TX + 44 - 44 * t2},${y - 20 + 40 * t2}` : ""}`} stroke="#d8382c" strokeWidth={9} strokeLinecap="round" />;
        })}
        {iconos && <g>
          <g transform="translate(800,350) scale(0.72)" opacity={0.35 + 0.65 * lit(aguaG)}>
            <circle r={78} fill="#12202c" stroke="#9bd8ff" strokeWidth={6} />
            <path d="M0,-48 C26,-12 36,6 36,20 A36,36 0 0 1 -36,20 C-36,6 -26,-12 0,-48Z" fill={lit(aguaG) > 0.5 ? "#4ab8ff" : "#2a3e4e"} />
          </g>
          <g transform="translate(800,480) scale(0.72)" opacity={0.35 + 0.65 * lit(luzG)}>
            <circle r={78} fill="#2a2412" stroke="#ffcf6e" strokeWidth={6} />
            <path d="M10,-52 L-30,6 L-2,6 L-12,52 L32,-8 L4,-8Z" fill={lit(luzG) > 0.5 ? "#ffd34a" : "#4a4230"} />
            {lit(luzG) > 0.5 && <Halo x={0} y={0} r={130} color="#ffd34a" fuerza={0.45 * lit(luzG)} />}
          </g>
          {luzG !== undefined && <Chispas x={800} y={480} f0={l(luzG) + X_DUR} n={12} radio={110} />}
          {luzG !== undefined && f > l(luzG) + X_DUR && <g transform={`translate(800,600) scale(${1 + 0.3 * Math.exp(-(f - l(luzG) - X_DUR) / 5) * Math.cos((f - l(luzG) - X_DUR) * 0.5)})`}><rect x={-62} y={-38} width={124} height={76} rx={16} fill="#0e0a12" opacity={0.9} /><text x={0} y={16} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={56} fill="#ff5a4a">OFF</text></g>}
        </g>}
        {/* banco y los 9 sentados (Theo primero) */}
        <g><rect x={940} y={P - 112} width={720} height={18} rx={6} fill="#6a4a32" />{[960, 1290, 1630].map((x) => <rect key={x} x={x} y={P - 94} width={14} height={94} fill="#4a2e1e" />)}</g>
        {LOS10.slice(1).map((look, i) => <A key={i} look={look} escala={i >= 7 ? NINO : 1} seed={60 + i} asiento={[{ f: 0, v: 104 }]}
          ruta={[{ f: 0, x: 1010 + i * 76, y: P }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: SEN_B }, ...(i === 0 && iconos ? [{ f: xb, v: SEN_B }, { f: xb + 10, v: { ...SEN_B, cabeza: 22, tronco: 10, hD: 20, cD: 70 } }] : gestos(4 + i * 5, l(s1), [SEN_B, { ...SEN_B, tronco: -8, cabeza: 6 }, { ...SEN_B, hD: 40, cD: 85 }], 22 + i * 3))]}
          caras={[{ f: 0, v: "duda" }, { f: xb + 4, v: i === 0 && iconos ? "triste" : i % 2 ? "sorpresa" : "triste" }]} giros={[{ f: 0, v: 0.8 }]} />)}
        <A look={GUS} escala={1.55} ruta={[{ f: 0, x: GX, y: P }]} dir={[{ f: 0, v: -1 }, { f: vuelta, v: 1 }]}
          poses={[...posesG, ...niega]} caras={[{ f: 0, v: "determinado" }, { f: vuelta, v: "triste" }]} habla={iconos ? [[vuelta + 6, l(s1)]] : []}
          enManoD={<rect x={-6} y={-30} width={12} height={36} rx={4} fill="#c0352c" />} />
      </>}
    />
  );
};

// píldora que aparece en su lugar con fundido (sin deslizar desde fuera del cuadro)
const PildoraFija: React.FC<{ texto: string; x: number; y: number; desde: number; color: string; tam: number }> = ({ texto, x, y, desde, color, tam }) => {
  const f = useF();
  if (f < desde) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: "translateX(-50%)", opacity: ap(f, desde, 8), fontFamily: F_HUD, fontWeight: 500, fontSize: tam, color: "#f6f0e2", border: `3px solid ${color}`, borderRadius: 40, padding: "6px 22px", background: "rgba(10,14,30,0.75)", whiteSpace: "nowrap" }}>{texto}</div>;
};

// ---------- 23 · 165:8-184:9 · Lakewood: la toma, el agua por el caño, las bombas que se frenan, la planta entera ----------
const P23: React.FC = () => {
  const f = useF();
  const l = loc(165.8);
  const P = LK_PISO;
  const marca = (g: number, x: number, y: number, r: number) => { const k = ap(f, l(g), 6) * (1 - ap(f, l(g + 1.6), 14)); return k > 0 ? <Halo key={g} x={x} y={y} r={r} color="#ffcf6e" fuerza={0.7 * k} /> : null; };
  const giro = [{ hD: 85, cD: 15, hI: 75, cI: 15, tronco: 9 }, { hD: 115, cD: 15, hI: 105, cI: 15, tronco: 3 }];
  return (
    <Escena Set={Lakewood} pal={PAL} setProps={{ hora: "invierno", corte: ap(f, l(171.2), 24), flujo: 1 - ap(f, l(174.6), 30), aguja: 0.2 + ap(f, l(183.0), 30) * 0.75, nieve: 0.7 }} seed={33}
      claves={[mira(0, 2100, 640, 0.8), mira(l(167.3), 2110, 630, 0.82), mira(l(168.2), 60, 900, 1.0, { curva: "inout" }), mira(l(172.5), 1550, 860, 0.95, { curva: "inout" }), mira(l(174.6), 1900, 760, 1.2), mira(l(176.4), 2100, 720, 1.6, { curva: "inout" }), mira(l(177.2), 2120, 600, 0.8, { curva: "inout" }), mira(l(179.5), 2140, 620, 0.75), mira(l(182.0), 3100, 620, 1.0, { curva: "inout" }), mira(l(184.9), 3800, 580, 1.15)]}
      medio={<>
        {/* malecón recto entre el lago y la planta (tapa la cuña diagonal de la costa del set) */}
        <rect x={1494} y={LK_AGUA - 6} width={48} height={P - 24 - LK_AGUA} fill={mezclar("#5a5048", LUCES.invierno.tinte, 0.3)} />
        <rect x={1488} y={LK_AGUA - 12} width={58} height={12} rx={3} fill={osc(mezclar("#5a5048", LUCES.invierno.tinte, 0.3), 0.8)} />
        {/* Theo y Dev llegan caminando a la puerta de la planta y entran */}
        {f < l(168.0) && <>
          <A look={DEV} escala={1.1} ruta={[{ f: 0, x: 1160, y: P }, { f: l(167.6), x: 1520, y: P, curva: "lineal" }]} dir={[{ f: 0, v: 1 }]} opacidad={(ff) => 1 - ap(ff, l(167.5), 6)} caras={[{ f: 0, v: "duda" }]} seed={3} />
          <A look={THEO_INV} escala={1.1} ruta={[{ f: 0, x: 1290, y: P }, { f: l(167.3), x: 1600, y: P, curva: "lineal" }]} dir={[{ f: 0, v: 1 }]} opacidad={(ff) => 1 - ap(ff, l(167.2), 6)}
            poses={[{ f: 0, v: "parado" }, { f: l(166.4), v: "señalar" }, { f: l(166.9), v: "parado" }]} caras={[{ f: 0, v: "determinado" }]} habla={[[l(166.3), l(166.9)]]} />
        </>}
        {f > l(172.4) && <Rueda x={2220} y={P - 235} r={60} ang={f < l(177.4) ? f * 7 : l(177.4) * 7} />}
        {f > l(172.4) && f < l(179) && <A look={THEO_INV} escala={1.15} ruta={[{ f: l(172.2), x: 1700, y: P }, { f: l(174.0), x: 2060, y: P }]} dir={[{ f: 0, v: 1 }]}
          poses={f < l(177.6) ? gestos(l(174.0), l(177.6), giro, 9) : [{ f: 0, v: "manosCara" }]} caras={[{ f: 0, v: "determinado" }, { f: l(176.0), v: "miedo" }]} />}
        {f >= l(179) && <A look={THEO_INV} escala={1.15} ruta={[{ f: l(179), x: 2260, y: P }, { f: l(181.4), x: 3720, y: P }]} dir={[{ f: 0, v: 1 }]}
          poses={f < l(181.6) ? [{ f: 0, v: "parado" }] : gestos(l(181.6), l(184.9), ["señalar", "manosCintura"], 22)} caras={[{ f: 0, v: "miedo" }]} />}
        {marca(180.6, 3520, 700, 260)}{marca(181.5, 2950, 720, 330)}{marca(182.8, 3950, 570, 200)}
        {/* manómetro pegado a la pared de la planta (mundo): cae con las bombas; al final otro junto al tablero marca 0 */}
        {f > l(173.0) && f < l(179.2) && <g opacity={ap(f, l(173.0), 8)}>
          <rect x={2330} y={P - 520} width={200} height={215} rx={14} fill="#1c2028" stroke="#0e0a12" strokeWidth={5} />
          <Manometro x={2430} y={P - 430} r={70} v={rampa(f, l(174.4), l(178.8), 0.78, 0.02)} texto="PSI" />
          <text x={2430} y={P - 328} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={34} fill="#ffcf6e" stroke="#0e0a12" strokeWidth={7} paintOrder="stroke">PRESSURE</text>
        </g>}
        {f >= l(179.2) && <g opacity={ap(f, l(179.2), 8)}>
          <rect x={3070} y={P - 520} width={230} height={235} rx={14} fill="#1c2028" stroke="#0e0a12" strokeWidth={5} />
          <Manometro x={3185} y={P - 435} r={72} v={0.02 + 0.015 * Math.sin(f * 0.9) * (1 - ap(f, l(180.2), 10))} texto="PSI" />
          <text x={3185} y={P - 318} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={ 50 * (1 + 0.25 * Math.exp(-(f - l(179.6)) / 5) * Math.cos((f - l(179.6)) * 0.5)) } fill="#e23a2e" stroke="#0e0a12" strokeWidth={8} paintOrder="stroke">EMPTY</text>
        </g>}
      </>}
      hud={<>
        <Rotulo texto="LAKE SUPERIOR" x={760} y={420} desde={l(168.6)} hasta={l(172)} color="#9bd8ff" tam={70} rot={-2} />
        <Rotulo texto="NO POWER, NO PUMPS" x={960} y={930} centro desde={l(175.0)} hasta={l(177.6)} color="#ffcf6e" tam={64} rot={0} />
      </>}
    />
  );
};

// ---------- 24 · 184:9-192:0 · Dev y los manuales (3 días), Theo y el tablero, los tres se miran ----------
const P24: React.FC = () => {
  const f = useF();
  const l = loc(184.9);
  const P = LK_PISO;
  const lee = [{ ...POSES.sentadoSuelo }, { ...POSES.sentadoSuelo, hD: 85, cD: 80 }, { ...POSES.sentadoSuelo, hD: 30, cD: 100, cabeza: 8 }];
  return (
    <EscenaS Set={Lakewood} pal={PAL} setProps={{ hora: "invierno", corte: 1, flujo: 0, aguja: 0.95, manuales: interpolate(f, [0, l(187.0)], [0.2, 1], { extrapolateRight: "clamp" }) }} seed={34} sacudidas={[l(189.8), l(190.3)]} amp={18}
      claves={[mira(0, 2300, 680, 1.5), mira(l(187.1), 2330, 660, 1.55), mira(l(187.4), 3700, 640, 1.45, { curva: "inout" }), mira(l(189.3), 3700, 640, 1.5), mira(l(189.6), 3150, 650, 1.0, { curva: "inout" }), mira(l(192.0), 3150, 640, 1.08)]}
      medio={<>
        {f < l(189.4) && <g>
          <rect x={2318} y={P - 64} width={130} height={64} rx={4} fill="#a67c4a" stroke="#0e0a12" strokeWidth={4} />
          <path d={`M2318,${P - 42} L2448,${P - 42} M2318,${P - 21} L2448,${P - 21}`} stroke="#7a5630" strokeWidth={4} />
        </g>}
        <A look={DEV} escala={1.3} ruta={[{ f: 0, x: 2380, y: P }, { f: l(189.4), x: 2380, y: P }, { f: l(190.6), x: 2950, y: P }]} dir={[{ f: 0, v: -1 }, { f: l(189.4), v: 1 }]}
          asiento={[{ f: 0, v: 52 }, { f: l(189.3), v: 52 }, { f: l(189.4), v: undefined }]}
          poses={[...gestos(0, l(189.2), lee, 16), { f: l(189.4), v: "parado" }]}
          caras={[{ f: 0, v: "cansado" }, { f: l(190.8), v: "triste" }]} enManoD={(ff) => (ff < l(189.4) ? <Libro color="#3a5a8a" abierto /> : null)} />
        <A look={THEO_INV} escala={1.3} ruta={[{ f: 0, x: 3790, y: P }, { f: l(189.6), x: 3790, y: P }, { f: l(190.8), x: 3250, y: P }]} dir={[{ f: 0, v: 1 }, { f: l(189.6), v: -1 }]}
          poses={[...gestos(0, l(189.4), [{ hD: 100, cD: 20 }, { hD: 80, cD: 10, tronco: 4 }, { hD: 110, cD: 30 }], 18), { f: l(189.6), v: "parado" }, { f: l(191.0), v: "manosCara" }]} caras={[{ f: 0, v: "duda" }, { f: l(190.8), v: "triste" }]}
          enManoD={(ff) => (ff < l(189.6) ? <g><rect x={-9} y={-34} width={18} height={44} rx={5} fill="#3a3a44" stroke="#0e0a12" strokeWidth={3} /><rect x={-11} y={-40} width={22} height={10} rx={3} fill="#c9c2b0" /><Halo x={0} y={-44} r={60} color="#fff2c0" fuerza={0.7} /></g> : null)} />
        <A look={JUNE_INV} escala={1.3} ruta={[{ f: 0, x: 3100, y: P }]} dir={[{ f: 0, v: 1 }]} opacidad={(ff) => ap(ff, l(189.3), 6)} caras={[{ f: 0, v: "triste" }]} seed={2} poses={[{ f: 0, v: "brazosCruzados" }, { f: l(190.5), v: "encogerse" }]} />
      </>}
      hud={<>
        <EtiquetaFlotante x={1080} y={430} rotulo="DAYS OF MANUALS" claves={[{ f: l(185.0), v: 0 }, { f: l(185.8), v: 1, d: 8 }, { f: l(186.4), v: 2, d: 8 }, { f: l(187.0), v: 3, d: 8 }]} desde={l(185.0)} hasta={l(187.5)} color="#ffcf6e" tam={84} />
        <Rotulo texto="NO." x={960} y={130} centro desde={l(189.8)} color="#e23a2e" tam={150} rot={0} />
      </>}
    />
  );
};

// ---------- 29 · 194:1-201:1 · Theo con el casco de liniero → la represa de Thomson ----------
const THEO_SIN = conAcc({ ...THEO, accesorios: [] }, { t: "bufanda", color: "#efe3c8" });
const P29: React.FC = () => {
  const f = useF();
  const l = loc(194.1);
  const P = REP_PISO;
  const casco = f >= l(195.3);
  return (
    <Escena Set={Represa} pal={PAL} setProps={{ hora: "invierno", nieve: 0.8 }} seed={35}
      claves={[mira(0, 1640, 640, 2.0), mira(l(197.2), 1600, 650, 2.1), mira(l(197.4), 1100, 560, 0.85, { curva: "inout" }), mira(l(201.1), 1130, 550, 0.9)]}
      medio={<>
        <A look={casco ? THEO_CASCO : THEO_SIN} ruta={[{ f: 0, x: 1620, y: P }, { f: l(197.4), x: 1620, y: P }, { f: l(198.6), x: 1190, y: P }]} dir={[{ f: 0, v: -1 }]} escala={f > l(197.4) ? 1.7 : 1}
          poses={[{ f: 0, v: { hD: 30, cD: 30 } }, { f: l(194.7), v: { hD: 165, cD: 95, cabeza: -4 } }, { f: l(195.4), v: { hD: 165, cD: 60 } }, { f: l(195.9), v: "manosCintura" }, ...gestos(l(196.3), l(197.3), [{ hD: 95, cD: 0 }, { hD: 105, cD: 10, tronco: 3 }], 16), { f: l(198.8), v: { hD: 95, cD: 0 } }, ...gestos(l(199.6), l(201.1), [{ hD: 100, cD: 0 }, { hD: 110, cD: 0, tronco: 2 }], 16)]}
          giros={[{ f: 0, v: 0 }, { f: l(199.2), v: 0 }, { f: l(199.7), v: 0.9 }]}
          caras={[{ f: 0, v: "determinado" }]} habla={[[l(196.2), l(197.3)], [l(198.9), l(200.6)]]} />
      </>}
      hud={<>
        <Rotulo texto="THOMSON DAM" x={1240} y={170} centro desde={l(197.8)} color="#ffcf6e" tam={74} rot={0} />
        <GranNumero rotulo="MONTHS OF STORMS & ICE" claves={[{ f: l(198.0), v: 0 }, { f: l(198.4), v: 6, d: 60 }]} x={1640} y={330} desde={l(198.0)} color="#ffffff" tam={130} />
      </>}
    />
  );
};

// ---------- 31 · 201:1-213:5 · turbina → subestación → kilómetros de línea; después: cables caídos y banderas rojas ----------
const P31: React.FC = () => {
  const f = useF();
  const l = loc(201.1);
  const P = REP_PISO;
  const marca = (g: number, x: number, y: number, r: number, t: string, ty?: number) => { const k = ap(f, l(g), 6) * (1 - ap(f, l(g + 1.0), 6)); return k > 0 ? <g key={g} opacity={k}><Halo x={x} y={y} r={r} color="#ffcf6e" fuerza={0.7} /><text x={x} y={ty ?? y - r * 0.6 - 230} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={44} fill="#ffcf6e" stroke="#0e0a12" strokeWidth={8} paintOrder="stroke">{t}</text></g> : null; };
  const quedo = f > l(207.9);
  return (
    <Escena Set={Represa} pal={PAL} setProps={{ hora: "invierno", corte: 1, caida: ap(f, l(207.8), 40), banderas: l(209.5), zumbido: 1 - ap(f, l(207.4), 10), nieve: 0.8 }} seed={36}
      claves={[mira(0, 1230, 640, 1.2), mira(l(203.2), 1250, 620, 1.1), mira(l(205.0), 2000, 640, 1.05, { curva: "inout" }), mira(l(207.8), 3300, 560, 0.95, { curva: "inout" }), mira(l(209.4), 3400, 700, 1.0), mira(l(210.8), 3420, 700, 1.35, { curva: "inout" }), mira(l(213.5), 3560, 700, 1.4)]}
      medio={<>
        {marca(203.0, 1230, 680, 220, "SWITCHES")}{marca(203.9, 1950, 660, 260, "TRANSFORMERS")}{marca(205.2, 2200, 700, 220, "PROTECTION")}{marca(206.4, 3000, 420, 300, "", 330)}
        {f > l(207.8) && <path d={`M3560,${P - 4} q60,${-20 - 26 * Math.max(0, Math.sin((f - l(211.2)) * 0.52)) * (f > l(211.2) ? 1 : 0)} 120,-4 t110,${-6 - 20 * Math.max(0, Math.sin((f - l(211.2)) * 0.52)) * (f > l(211.2) ? 1 : 0)} t110,8`} stroke="#17131a" strokeWidth={8} fill="none" strokeLinecap="round" />}
        <A look={THEO_CASCO} escala={1.4} ruta={[{ f: 0, x: 1020, y: P }, { f: l(202.6), x: 1020, y: P }, { f: l(205.0), x: 1900, y: P }, { f: l(207.6), x: 3200, y: P }, { f: l(209.0), x: 3330, y: P }, { f: l(213.5), x: 3600, y: P }]} dir={[{ f: 0, v: 1 }]}
          poses={[...gestos(0, l(202.5), [{ hD: 95, cD: 0 }, { hD: 110, cD: 10 }], 20), { f: l(202.6), v: "parado" }, { f: l(209.2), v: "manosCara" }, { f: l(211.0), v: { hD: 100, cD: 0, tronco: 4 } }, ...gestos(l(211.2), l(213.5), [{ pD: 0, hD: 40, cD: 20 }, { pD: 58, rD: 8, tronco: -6, hD: 60, cD: 30, hI: -40 }], 12)]}
          caras={[{ f: 0, v: "determinado" }, { f: l(207.8), v: "miedo" }]} />
      </>}
      hud={<>
        <Pastilla texto="MILES OF LINES" x={1240} y={185} desde={l(206.3)} hasta={l(207.9)} tam={48} color="#ffcf6e" />
        {quedo && <Cifra rotulo="PLACES THE LINES ARE DOWN" valor="HUNDREDS" golpes={[l(208.2)]} x={1560} y={120} desde={l(207.9)} color="#ff5a3a" tam={110} rotuloTam={34} />}
      </>}
    />
  );
};

// ---------- 33 · 213:5-220:2 · Theo y Marcus ante los postes caídos → docenas de camiones (lo que haría falta) → uno solo: Theo en la escalera, Marcus abajo ----------
const Camion: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => (
  <g>
    <Auto x={x} y={y} color="#eceae4" tipo="pickup" s={s} dir={1} />
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-124} y={-62} width={100} height={30} fill="#d8d4ca" stroke="#0e0a12" strokeWidth={2} />
      <path d="M-128,-74 L28,-74 M-128,-88 L28,-88" stroke="#9aa0a8" strokeWidth={5} />
      {Array.from({ length: 11 }).map((_, i) => <path key={i} d={`M${-124 + i * 15},-88 L${-124 + i * 15},-74`} stroke="#9aa0a8" strokeWidth={4} />)}
      <rect x={4} y={-108} width={46} height={9} rx={3} fill={Math.floor(f / 6) % 2 ? "#ffb04a" : "#ff7a2a"} />
    </g>
  </g>
);
const P33: React.FC = () => {
  const f = useF();
  const l = loc(213.5);
  const P = REP_PISO;
  const fant = 1 - ap(f, l(217.2), 12);
  const XT = 3150; // la camioneta de Theo (la única que queda)
  const llega = (i: number) => { const t0 = l(214.9) + i * 3; return interpolate(f, [t0, t0 + 22], [1100, XT + (i - 5) * 270], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }); };
  const sube = f >= l(217.3);
  return (
    <Escena Set={Represa} pal={PAL} setProps={{ hora: "invierno", caida: 1, nieve: 0.8 }} seed={37}
      claves={[mira(0, 3480, 620, 1.0), mira(l(214.6), 3460, 620, 1.04), mira(l(215.3), 3300, 600, 0.6, { curva: "inout" }), mira(l(217.2), 3320, 600, 0.62), mira(l(218.0), 3420, 560, 1.3, { curva: "inout" }), mira(l(220.2), 3400, 540, 1.4)]}
      medio={<>
        {fant > 0.01 && <g opacity={fant}>{Array.from({ length: 12 }).map((_, i) => (i === 5 || f < l(214.9) + i * 3 ? null : <Camion key={i} x={llega(i)} y={P + 10} s={1.0} f={f + i * 3} />))}</g>}
        <Camion x={XT} y={P + 10} s={1.6} f={f} />
        <path d={`M3320,${P} L3400,${P - 470} M3380,${P} L3460,${P - 470}`} stroke="#c9c4b8" strokeWidth={10} />
        {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${3328 + i * 8},${P - 30 - i * 50} l58,0`} stroke="#c9c4b8" strokeWidth={8} />)}
        <path d={`M3470,${P - 480} Q3560,${P - 330} 3640,${P - 420 + 40 * Math.sin(f / 5)}`} stroke="#17131a" strokeWidth={7} fill="none" />
        <A look={THEO_CASCO} ruta={[{ f: 0, x: 3330, y: P }, { f: l(217.3), x: 3330, y: P }, { f: l(217.9), x: 3440, y: P - 400 }]} dir={[{ f: 0, v: 1 }]}
          poses={sube ? [...gestos(l(217.3), l(219.0), ["agarrarAlto", { hD: 150, cD: 50, tronco: 4 }, { hD: 120, cD: 5 }], 10), { f: l(219.1), v: "celebrar" }] : [{ f: 0, v: "manosCintura" }, ...gestos(l(213.9), l(214.8), [{ hD: 80, cD: 0, cabeza: -6 }, { hD: 80, cD: 0, cabeza: 6 }], 7), { f: l(214.9), v: "señalar" }, { f: l(216.4), v: "manosCintura" }]}
          caras={[{ f: 0, v: "triste" }, { f: l(217.3), v: "determinado" }, { f: l(219.2), v: "feliz" }]} sombra={sube ? 0 : 1} habla={[[l(215.0), l(216.2)]]} />
        <Chispas x={3480} y={P - 480} f0={l(219.0)} />
        <A look={MARCUS} ruta={[{ f: 0, x: 3170, y: P }, { f: l(217.0), x: 3170, y: P }, { f: l(217.6), x: 3250, y: P }]} dir={[{ f: 0, v: 1 }]}
          poses={f < l(217.4) ? gestos(0, l(217.4), ["manosCara", { hD: 160, cD: 135, hI: 160, cI: 135, cabeza: 6 }, "encogerse"], 18) : [{ f: 0, v: "empujar" }]} caras={[{ f: 0, v: "miedo" }]} ajuste={(p, ff) => ({ ...p, tronco: (p.tronco ?? 0) + 2 * Math.sin(ff * 0.9) })} />
      </>}
      hud={<>
        <Rotulo texto="DOZENS OF TRUCKS" x={1240} y={150} centro desde={l(215.0)} hasta={l(217.2)} color="#ffb04a" tam={80} rot={0} />
        <Rotulo texto="A NORMAL UTILITY CREW" x={1240} y={245} centro desde={l(215.3)} hasta={l(217.2)} color="#f6ecd2" tam={42} rot={0} brillo={false} />
        <Cifra rotulo="THEO'S CREW" valor="1 TRUCK" x={1560} y={300} desde={l(217.6)} golpes={[l(217.7)]} color="#ffcf6e" tam={84} rotuloTam={32} />
      </>}
    />
  );
};

// ---------- 36 · 223:5-239:6 · la tapa de la cloaca; el caño que saca; cuando paran las bombas, sube ----------
const Fl: React.FC<{ x: number; y: number; rot: number; col: string; s?: number; o?: number }> = ({ x, y, rot, col, s = 1, o = 1 }) => (
  <path transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} d="M-30,-16 L8,-16 L8,-32 L44,0 L8,32 L8,16 L-30,16Z" fill={col} opacity={o} stroke="#0e0a12" strokeWidth={4} />
);
const P36: React.FC = () => {
  const f = useF();
  const l = loc(223.5);
  const P = SUB_PISO;
  const tapar = { hD: 40, cD: 140, cabeza: 6 };
  const para = l(233.8);
  const corre = f > l(228.4) && f < para;
  const sube = f >= para;
  return (
    <Escena Set={Subsuelo} pal={PAL} setProps={{ hora: "invierno", luz: { cloaca: ap(f, l(227.6), 10), agua: ap(f, l(228.6), 10) }, flujo: 1 - ap(f, l(233.8), 20), sube: ap(f, l(233.8), 150), nieve: 0.4 }} seed={38}
      claves={[mira(0, 1200, 480, 1.3), mira(l(227.0), 1220, 480, 1.35), mira(l(228.2), 1900, 760, 0.75, { curva: "inout" }), mira(l(233.6), 2600, 760, 0.8, { curva: "inout" }), mira(l(236.0), 1250, 640, 1.2, { curva: "inout" }), mira(l(239.6), 1220, 600, 1.35)]}
      medio={<>
        {corre && Array.from({ length: 9 }).map((_, i) => { const x = 700 + ((i * 260 + f * 9) % 2340); return <Fl key={i} x={x} y={SUB_Y.cloaca} rot={0} col="#7cc8ff" o={0.9 * Math.min(1, ap(f, l(228.4), 10))} />; })}
        {sube && Array.from({ length: 4 }).map((_, i) => { const u = ((i / 4) + f * 0.012) % 1; return <Fl key={i} x={1200} y={880 - u * 300} rot={-90} col="#a0784a" s={1.3} o={Math.min(1, ap(f, para + 6, 10)) * (1 - u * 0.6)} />; })}
        <A look={THEO_INV} ruta={[{ f: 0, x: 1040, y: P }]} dir={[{ f: 0, v: 1 }]} poses={gestos(0, l(239.6), [{ hD: 110, cD: 0, tronco: 4 }, { ...tapar, hD: 120, cD: 10 }, "señalar", tapar], 26)} caras={[{ f: 0, v: "asco" }]} habla={[[l(224.0), l(226.8)], [l(236.2), l(239.0)]]} />
        <A look={JUNE_INV} ruta={[{ f: 0, x: 1360, y: P }]} dir={[{ f: 0, v: -1 }]} poses={gestos(0, l(239.6), [tapar, { hD: 50, cD: 135, cabeza: 12 }, tapar, { hD: 30, cD: 130, tronco: 6 }], 20)} caras={[{ f: 0, v: "asco" }]} seed={2} />
        <A look={DEV} ruta={[{ f: 0, x: 1470, y: P }]} dir={[{ f: 0, v: -1 }]} poses={gestos(0, l(239.6), ["manosCara", { hI: 60, cI: 130, hD: 50, cD: 140, tronco: 12 }, "manosCara", "encogerse"], 22)} caras={[{ f: 0, v: "asco" }]} seed={3} />
      </>}
      hud={<>
        <Rotulo texto="CHOLERA · TYPHOID" x={960} y={880} centro desde={l(236.6)} color="#b8d86a" tam={84} rot={0} />
        {f >= para && <div style={{ position: "absolute", left: 1440, top: 250, width: 300, textAlign: "center", opacity: ap(f, para, 8), background: "rgba(14,10,18,0.62)", borderRadius: 22, padding: "14px 10px 18px", fontFamily: F_HUD, fontWeight: 600 }}>
          <div style={{ fontSize: 34, letterSpacing: 3, color: "#fff", WebkitTextStroke: "3px rgba(14,10,18,0.9)", paintOrder: "stroke fill" }}>PUMPS OFF</div>
          <svg width={260} height={190} viewBox="0 0 260 190"><rect x={20} y={20} width={220} height={36} rx={18} fill="#2a2430" stroke="#f6ecd2" strokeWidth={4} /><rect x={24} y={24} width={Math.max(8, 212 * rampa(f, para + 6, l(239.2), 0.04, 1))} height={28} rx={14} fill="#a0784a" />
            <text x={130} y={112} textAnchor="middle" fontSize={44} fill="#b8d86a" stroke="#0e0a12" strokeWidth={7} paintOrder="stroke" fontFamily="Fredoka, sans-serif">SEWER</text>
            <text x={130} y={166} textAnchor="middle" fontSize={44} fill="#b8d86a" stroke="#0e0a12" strokeWidth={7} paintOrder="stroke" fontFamily="Fredoka, sans-serif">BACKS UP</text></svg>
        </div>}
      </>}
    />
  );
};

// ---------- 38 · 239:6-243:6 · June pega el cartel: NEVER DRINK THE TAP ----------
const P38: React.FC = () => {
  const f = useF();
  const l = loc(239.6);
  const P = VIS_PISO;
  const k = ap(f, l(241.2), 8);
  const pr = f >= l(241.45) && f < l(241.45) + 4 ? 1 : 0; // la palma aplasta el cartel 2-3 cuadros
  return (
    <Escena Set={Visitantes} pal={PAL} setProps={{ hora: "dia" }} seed={39}
      claves={[mira(0, 2640, 600, 1.4), mira(l(243.6), 2680, 560, 1.5)]}
      medio={<>
        <g transform={`translate(3010,${P - 520}) rotate(${-2 + (1 - k) * 8}) scale(${(0.8 + 0.2 * k) * 0.88 * (pr ? 1.07 : 1)},${(0.8 + 0.2 * k) * 0.88 * (pr ? 0.88 : 1)})`} opacity={k}>
          <rect x={-190} y={-120} width={380} height={240} fill="#f6ecd2" />
          <text x={0} y={-30} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={62} fill="#c0352c">NEVER DRINK</text>
          <text x={0} y={60} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={62} fill="#c0352c">THE TAP</text>
          {[-180, 180].map((x) => <rect key={x} x={x - 30} y={-130} width={60} height={22} fill="#d8ccb0" opacity={0.8} transform={`rotate(${x > 0 ? 30 : -30} ${x} -120)`} />)}
        </g>
        <A look={JUNE} ruta={[{ f: 0, x: 2760, y: P }, { f: l(240.6), x: 2760, y: P }, { f: l(241.3), x: 2800, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 120, cD: 30, hI: 110, cI: 30 } }, { f: l(241.2), v: { hD: 150, cD: 10, hI: 20, cI: 30 } }, ...gestos(l(241.5), l(242.5), [{ hD: 135, cD: 8 }, { hD: 155, cD: 8 }], 6), { f: l(242.6), v: "celebrar" }]} caras={[{ f: 0, v: "determinado" }, { f: l(242.6), v: "feliz" }]} />
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
const rem = (ff: number) => (1 - Math.cos((2 * Math.PI * ff) / 24)) / 2; // 0 = brazos estirados, 1 = remada tirada
// E32: el remo hace vaivén −30/+30° alrededor de 35° (20 cuadros por lado); Priya lo agarra con las dos manos (IK) y se inclina con la remada
const bx39 = (ff: number) => 2000 + ff * 4.6;
const LOCK = { x: (ff: number) => bx39(ff) - 10, y: 890 };
const TH39 = (ff: number) => 35 + 30 * Math.sin((2 * Math.PI * ff) / 40);
const PRI39 = { dx: 80, y: 956, esc: 0.95 };
const priyaPose = (ff: number) => {
  const th = TH39(ff), r = (th * Math.PI) / 180;
  const H = { x: LOCK.x(ff) + 95 * Math.sin(r), y: LOCK.y - 95 * Math.cos(r) };
  const px = bx39(ff) + PRI39.dx;
  const loc39 = { x: (px - H.x) / PRI39.esc, y: (H.y - PRI39.y) / PRI39.esc }; // mira a −x
  const base = pose({ ...POSES.sentado, tronco: -16 + 28 * ((th - 5) / 60), cabeza: 6 - 10 * ((th - 5) / 60) });
  const conD = { ...base, ...alcanzar(base, "D", loc39, 60) };
  return { ...conD, ...alcanzar(conD, "I", loc39, 60) };
};
const manoPriya = (ff: number) => {
  const j = articulaciones(priyaPose(ff), 60);
  return { x: bx39(ff) + PRI39.dx - PRI39.esc * j.bD.mano.x, y: PRI39.y + PRI39.esc * j.bD.mano.y };
};
const marcusPose = (ff: number) => {
  const w = (1 + Math.sin((2 * Math.PI * ff) / 40)) / 2;
  const base = pose({ ...POSES.sentado, tronco: -6 + 8 * w, cabeza: 4 - 6 * w });
  const conD = { ...base, ...alcanzar(base, "D", { x: 64, y: (884 - 956) / 0.95 }, 60) };
  return { ...conD, ...alcanzar(conD, "I", { x: 40, y: (886 - 956) / 0.95 }, 60) };
};
const P39: React.FC = () => {
  const f = useF();
  const l = loc(243.6);
  const y = 960;
  const bx = (ff: number) => 2000 + ff * 4.6;
  const X = bx(f);
  return (
    <Escena Set={CanalPark} pal={PAL} setProps={{ hora: "dia", luces: 0, nieve: 0.3, hielo: 0, ventanaGus: 0 }} seed={40}
      claves={[mira(0, 2000, 800, 1.5), mira(l(245.6), 2110, 790, 1.6)]}
      medio={<>
        <Lago y={y} x0={800} w={3400} f={f} />
        {[900, 1010, 1120].map((x) => <rect key={x} x={x} y={y - 120} width={22} height={150} fill="#4a3426" />)}
        <rect x={880} y={y - 130} width={280} height={24} fill="#7a5a3a" />
        {/* el muelle de donde salieron: queda atrás */}
        <rect x={1360} y={y - 100} width={430} height={22} fill="#7a5a3a" />
        {[1390, 1520, 1650, 1770].map((x) => <rect key={x} x={x} y={y - 90} width={20} height={120} fill="#4a3426" />)}
        {/* estela detrás del bote */}
        {Array.from({ length: 6 }).map((_, i) => <ellipse key={i} cx={X - 280 - i * 70} cy={y + 18 + (i % 2) * 6} rx={70 + i * 16} ry={7} fill="none" stroke="#e4f2ff" strokeWidth={5} opacity={Math.max(0, 0.75 - i * 0.12) * Math.min(1, f / 14)} />)}
        <defs><clipPath id="botecl39"><rect x={0} y={-2000} width={8000} height={y + 2008} /></clipPath></defs>
        <g clipPath="url(#botecl39)">
        <A look={MARCUS} ruta={[{ f: 0, x: bx(0) - 130, y: y - 4 }, { f: l(245.6), x: bx(l(245.6)) - 130, y: y - 4, curva: "lineal" }]} dir={[{ f: 0, v: 1 }]} escala={0.95} asiento={[{ f: 0, v: 60 }]}
          poses={[{ f: 0, v: POSES.sentado }]} ajuste={(_, ff) => marcusPose(ff)} caras={[{ f: 0, v: "determinado" }]} sombra={0} />
        <A look={PRIYA} ruta={[{ f: 0, x: bx(0) + 80, y: y - 4 }, { f: l(245.6), x: bx(l(245.6)) + 80, y: y - 4, curva: "lineal" }]} dir={[{ f: 0, v: -1 }]} escala={0.95} asiento={[{ f: 0, v: 60 }]}
          poses={[{ f: 0, v: POSES.sentado }]} ajuste={(_, ff) => priyaPose(ff)} caras={[{ f: 0, v: "determinado" }]} sombra={0} seed={2} />
        </g>
        <Bote x={X} y={y} s={0.9} f={f} />
        {(() => { // remo de Priya: sale de SUS manos (posición real de la mano) y pasa por el tolete de la borda; la pala entra al agua junto al casco
          const Hm = manoPriya(f);
          const dx = LOCK.x(f) - Hm.x, dy = LOCK.y - Hm.y, d = Math.hypot(dx, dy) || 1;
          const T = { x: LOCK.x(f) + (dx / d) * 200, y: LOCK.y + (dy / d) * 200 };
          const ang = Math.atan2(dy, dx) * 180 / Math.PI;
          return <g>
            <path d={`M${Hm.x - (dx / d) * 18},${Hm.y - (dy / d) * 18} L${T.x},${T.y}`} stroke="#c9a26a" strokeWidth={11} strokeLinecap="round" />
            <rect x={T.x - 15} y={T.y - 8} width={30} height={62} rx={9} fill="#a8844e" transform={`rotate(${ang - 90} ${T.x} ${T.y})`} />
            <rect x={LOCK.x(f) - 6} y={LOCK.y - 4} width={12} height={16} rx={3} fill="#2a2430" />
            {/* las dos manos de Priya encima del mango (puño cerrado) */}
            <circle cx={Hm.x} cy={Hm.y} r={8} fill="#17100d" />
            {[0, 1, 2].map((k) => <Salpica key={k} x={T.x} y={y + 22} f0={14 + k * 40} color={k % 2 ? "#9bd8ff" : "#bfe6ff"} />)}
          </g>;
        })()}
      </>}
      hud={<>
        <Rotulo texto="far from shore" x={1300} y={330} desde={l(244.0)} color="#9bd8ff" tam={62} rot={-3} brillo={false} />
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><g transform={`translate(${520 - f * 5},800)`}><Fl x={0} y={0} rot={180} col="#ffcf6e" s={1.2} o={0.9} /></g></svg>
        <Rotulo texto="SHORE" x={300 - f * 2} y={880} desde={l(243.7)} color="#ffcf6e" tam={54} rot={0} />
      </>}
    />
  );
};

// ---------- 40 · 245:6-247:3 · la olla hierve ----------
const P40: React.FC = () => {
  const f = useF();
  const l = loc(245.6);
  const grados = rampa(f, 0, 30, 70, 100);
  const hg = rampa(f, 0, 30, 0.62, 1);
  return (
    <EscenaS Set={Mesa} pal={PAL} setProps={{ obj: "olla", hervor: 1 }} seed={56} claves={[mira(0, 900, 600, 0.9), mira(l(247.3), 920, 590, 0.98)]} sacudidas={[30]} amp={8}
      medio={<>
        <Vaho x={960} y={300} n={7} r={26} alto={190} vel={0.035} />
        {/* burbujas grandes una vez que llega a 100 */}
        {f > 30 && Array.from({ length: 9 }).map((_, i) => { const u = ((f - 30) * 0.09 + i * 0.37) % 1; const x = 720 + ((i * 137) % 480); return <circle key={i} cx={x} cy={426 - u * 22} r={10 + 22 * u} fill="none" stroke="#e8f6ff" strokeWidth={5} opacity={1 - u} />; })}
        <Vaho x={860} y={330} n={5} r={20} alto={150} vel={0.028} />
        <A look={GUS} escala={1.5} ruta={[{ f: 0, x: 600, y: 1010 }]} dir={[{ f: 0, v: 1 }]} poses={gestos(0, l(247.3), [{ hD: 100, cD: 20, tronco: 8 }, { hD: 125, cD: 10, tronco: 4 }, { hD: 95, cD: 30, tronco: 10 }], 9)} caras={[{ f: 0, v: "determinado" }, { f: 30, v: "sorpresa" }]} habla={[[l(246.0), l(247.2)]]}
          enManoD={(ff) => <g transform={`rotate(${-50 + 55 * Math.sin(ff * 0.63)})`}><rect x={-5} y={-8} width={10} height={90} fill="#c9c9c4" /><ellipse cx={0} cy={86} rx={22} ry={14} fill="#c9c9c4" /></g>} />
      </>}
      hud={<>
        <Rotulo texto="boil everything" x={1350} y={200} desde={l(245.9)} color="#ffcf6e" tam={66} rot={-3} />
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <g transform="translate(1660,420)">
            <rect x={-26} y={0} width={52} height={400} rx={26} fill="#f1ecdc" stroke="#0e0a12" strokeWidth={6} />
            <rect x={-14} y={400 - 380 * hg} width={28} height={380 * hg} rx={14} fill="#e23a2e" />
            <circle cx={0} cy={410} r={42} fill="#e23a2e" stroke="#0e0a12" strokeWidth={6} />
          </g>
        </svg>
        <div style={{ position: "absolute", left: 1520, top: 330, width: 280, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 84, color: grados > 99 ? "#e23a2e" : "#ffcf6e", WebkitTextStroke: "6px rgba(14,10,18,0.92)", paintOrder: "stroke fill" }}>{Math.round(grados)}°C</div>
      </>}
    />
  );
};

// ---------- 41 · 247:3-256:1 · la hornalla de gas: la llama azul se achica; el manómetro cae ----------
const P41: React.FC = () => {
  const f = useF();
  const l = loc(247.3);
  const k = interpolate(f, [l(250.3), l(251.5), l(254.4), l(255.6)], [1, 0.5, 0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const golpes = [l(250.4), l(250.4) + 8, l(250.4) + 16];
  return (
    <Escena Set={Mesa} pal={PAL} setProps={{ obj: "hornalla", llama: 0.15 + 0.85 * k, aguja: 0.1 + 0.6 * k, tono: "frio" }} seed={57} claves={[mira(0, 1040, 620, 1.0), mira(l(251.6), 1040, 630, 1.02), mira(l(256.1), 1040, 660, 1.0, { curva: "inout" })]}
      medio={<>
        <g transform="translate(560,700)">
          <circle r={74} fill="#2a2e38" stroke="#0e0a12" strokeWidth={6} /><circle r={58} fill="#c9c9c4" />
          <g transform={`rotate(${-130 + (1 - k) * 200 + Math.sin(f * 0.5) * 3 + golpes.reduce((a, g) => a + (f >= g && f < g + 8 ? 14 * Math.exp(-(f - g) / 2.5) * Math.cos((f - g) * 1.6) : 0), 0)})`}><rect x={-7} y={-62} width={14} height={62} rx={6} fill="#c0352c" /></g>
        </g>
        <A look={GUS} escala={1.5} ruta={[{ f: 0, x: 330, y: 1010 }]} dir={[{ f: 0, v: 1 }]} poses={[...gestos(0, l(250.0), [{ hD: 90, cD: 10, tronco: 6 }, { hD: 100, cD: 20, tronco: 8 }], 22), { f: l(250.2), v: { hD: 110, cD: 30, tronco: 10 } }, ...golpes.flatMap((g) => [{ f: g - 3, v: { hD: 112, cD: 40, tronco: 9 } }, { f: g, v: { hD: 96, cD: 12, tronco: 12 } }]), { f: golpes[2] + 6, v: { hD: 104, cD: 30, tronco: 8 } }, ...gestos(l(251.6), l(253.8), [{ hD: 92, cD: 5, tronco: 8 }, { hD: 100, cD: 15, tronco: 6 }], 14), { f: l(254.3), v: { hD: 165, cD: 140, cabeza: -8, tronco: 2 } }, ...gestos(l(254.8), l(256.1), [{ hD: 168, cD: 128, cabeza: -6 }, { hD: 160, cD: 140, cabeza: -10 }], 7)]} caras={[{ f: 0, v: "determinado" }, { f: l(250.4), v: "duda" }, { f: l(252.5), v: "triste" }]} />
      </>}
      hud={<><Cifra rotulo="GAS PRESSURE" valor={f < l(250.3) ? "FULL" : f < l(254.4) ? "FADING" : "GONE"} golpes={[l(250.3), l(254.4)]} x={1360} y={150} color={f < l(254.4) ? "#7cc8ff" : "#ff6a5a"} tam={110} rotuloTam={34} />
        <Onoma texto="TAP" x={560} y={470} golpes={golpes} dur={7} tam={64} rot={-4} color="#f6ecd2" /></>}
    />
  );
};

// ---------- 42 · 256:1-261:4 · el caño de gas, kilómetros, hasta la compresora apagada ----------
const P42: React.FC = () => {
  const f = useF();
  const l = loc(256.1);
  const P = REP_PISO;
  const corta = l(259.2);
  return (
    <Escena Set={Represa} pal={PAL} setProps={{ hora: "invierno", nieve: 0.9, corte: 1 }} seed={41}
      claves={[mira(0, 2600, 640, 1.0), mira(l(259.0), 5500, 600, 1.0, { curva: "inout" }), mira(l(261.4), 5750, 620, 1.1)]}
      medio={<>
        <rect x={2000} y={P - 60} width={4200} height={26} rx={13} fill="#e8c040" />
        {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={2100 + i * 340} y={P - 66} width={14} height={38} fill="#b8902a" />)}
        {f < corta && Array.from({ length: 14 }).map((_, i) => <Fl key={i} x={2000 + ((i * 300 + f * 14) % 4200)} y={P - 47} rot={0} col="#fff0a0" s={0.5} o={0.9} />)}
        {f >= corta && <g><circle cx={5300} cy={P - 47} r={54} fill="#e23a2e" stroke="#0e0a12" strokeWidth={6} /><path d={`M5276,${P - 71} l48,48 M5324,${P - 71} l-48,48`} stroke="#fff" strokeWidth={12} strokeLinecap="round" /></g>}
        <g transform={`translate(5700,${P})`}>
          <rect x={0} y={-320} width={560} height={320} fill="#6a6e78" />
          <rect x={60} y={-260} width={120} height={160} fill="#2a2e38" /><rect x={240} y={-260} width={120} height={160} fill="#2a2e38" />
          <rect x={420} y={-480} width={50} height={180} fill="#55525e" />
          <rect x={30} y={-380} width={500} height={50} fill="#2a2430" /><text x={280} y={-343} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={30} fill="#f6ecd2" letterSpacing={3}>COMPRESSOR STATION</text>
          <circle cx={520} cy={-100} r={16} fill={f < corta ? "#3ad06a" : "#5a2020"} />
          {f < corta && <rect x={60} y={-260} width={120} height={160} fill="#7cc8ff" opacity={0.25 + 0.2 * Math.sin(f)} />}
        </g>
        <A look={THEO_CASCO} escala={1.4} ruta={[{ f: l(256.4), x: 2300, y: P }, { f: l(258.3), x: 5210, y: P }, { f: l(259.5), x: 5210, y: P }, { f: l(260.3), x: 5560, y: P }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: "parado" }, { f: l(258.3), v: { ...POSES.agacharse, tronco: 48, cabeza: -42, hD: 15, cD: 20, hI: 30, cI: 40 } }, { f: l(259.4), v: { tronco: 8, hD: 120, cD: 40, hI: -20 } }, ...gestos(l(260.3), l(261.4), [{ hD: 120, cD: 30, tronco: 8 }, { hD: 85, cD: 20, tronco: 14 }], 9)]} caras={[{ f: 0, v: "determinado" }, { f: l(258.4), v: "sorpresa" }, { f: corta, v: "miedo" }]}
          enManoD={(ff) => (ff >= l(260.3) ? <g transform="rotate(-30)"><rect x={-5} y={-4} width={10} height={74} fill="#8a8e98" /><circle cx={0} cy={-6} r={16} fill="none" stroke="#8a8e98" strokeWidth={10} /></g> : null)} />
      </>}
      hud={<Pastilla texto="THE GAS HAS STOPPED" x={960} y={905} desde={corta} color="#ff7a2a" tam={62} />}
    />
  );
};

// ---------- 43 · 261:4-275:1 · la cuesta: grieta → río de deshielo → falta el tramo ----------
const P43: React.FC = () => {
  const f = useF();
  const l = loc(261.4);
  const vis = (ff: number) => ap(ff, 0, 8);
  const cy = cuestaY(1650) - 120;
  return (
    <Escena Set={Cuesta} pal={PAL} setProps={{ hora: "dia", grieta: ap(f, l(262.0), 90), rio: ap(f, l(265.8), 40) * (1 - ap(f, l(271.4), 20) * 0.6), hueco: ap(f, l(271.6), 24), nieve: 1 - ap(f, l(265.6), 120) }} seed={42}
      claves={[mira(0, 1600, cy, 1.4), mira(l(265.6), 1650, cy, 1.5), mira(l(271.4), 1650, cy, 1.45, { curva: "inout" }), mira(l(275.1), 1680, cy, 1.55)]}
      medio={<>
        {(() => { // un auto intenta subir tres veces, patina y retrocede hasta el borde del pozo
          const xs = [2060, 2330, 2060, 2300, 2050, 2250, 1990];
          const ts = [0, l(263.2), l(264.4), l(267.0), l(268.2), l(270.6), l(271.8)];
          const cx = interpolate(f, ts, xs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const vib = f > l(262.4) && f < l(271.6) ? Math.sin(f * 1.7) * 2.5 : 0;
          return <g transform={`rotate(-19.8 ${cx} ${cuestaY(cx) - 20})`}><Auto x={cx} y={cuestaY(cx) - 20 + vib} color="#c9573a" nieve={0.2} />{f < l(271.8) && Math.abs(cx - xs[Math.max(0, ts.findIndex((q) => q > f) - 1)]) > 4 && <circle cx={cx - 150} cy={cuestaY(cx) - 8} r={18 + 6 * Math.sin(f)} fill="#f3f0ea" opacity={0.5} />}</g>;
        })()}
        <A look={THEO_INV} escala={1.2} ruta={[{ f: 0, x: 1400, y: cuestaY(1400) }, { f: l(268), x: 1400, y: cuestaY(1400) }, { f: l(270.5), x: 1440, y: cuestaY(1440) }]} dir={[{ f: 0, v: 1 }]} opacidad={vis} poses={gestos(0, l(275.1), ["manosCintura", { hD: 100, cD: 0 }, { hD: 115, cD: 0, tronco: 5 }, "manosCintura"], 28)} caras={[{ f: 0, v: "sorpresa" }]} />
        <A look={DEV} escala={1.2} ruta={[{ f: 0, x: 1290, y: cuestaY(1290) }]} dir={[{ f: 0, v: 1 }]} opacidad={vis} poses={[...gestos(0, l(262.4), ["manosCara", "pensar", { hD: 100, cD: 0 }, "encogerse"], 24), ...gestos(l(262.4), l(275.1), [{ hI: 160, cI: 135, hD: 160, cD: 135, tronco: 4, cabeza: 4 }, "encogerse", { hI: 165, cI: 125, hD: 155, cD: 140, tronco: 8 }], 20)]} caras={[{ f: 0, v: "miedo" }]} seed={3} />
      </>}
      hud={<>
        <Rotulo texto="LATE APRIL" x={1250} y={190} centro desde={l(272.0)} color="#f6ecd2" tam={84} rot={-3} brillo={false} />
        <Hojas x={1560} y={330} texto="APRIL" desde={l(272.4)} dia={Math.floor(rampa(f, l(272.6), l(274.8), 1, 14))} w={380} />
      </>}
    />
  );
};

// ---------- 44 · 275:1-290:0 · la cuenta honesta: miles de trabajadores fantasma → IT TAKES THOUSANDS vs WE HAVE 10 → se apiñan los 10 ----------
const Obreritos: React.FC<{ f: number; n: number; w: number; h: number }> = ({ f, n, w, h }) => {
  const cols = 25, filas = Math.ceil(n / cols), dx = w / cols, dy = h / filas;
  return <g>{Array.from({ length: n }).map((_, i) => {
    const c = i % cols, r = Math.floor(i / cols); const o = Math.min(1, Math.max(0, (f - i * 0.12) / 6));
    const x = dx * (c + 0.5) + (r % 2 ? dx * 0.25 : 0), y = dy * (r + 0.5);
    return o > 0 ? <g key={i} opacity={o} transform={`translate(${x},${y})`}><rect x={-3.5} y={-1} width={7} height={10} rx={2} fill={["#e8803a", "#3a6a9a", "#7a7c84", "#c0352c"][i % 4]} /><circle cy={-5} r={3.6} fill="#2a2420" /><rect x={-4.5} y={-10} width={9} height={3} rx={1.5} fill="#f2c230" /></g> : null;
  })}</g>;
};
const P44: React.FC = () => {
  const f = useF();
  const l = loc(275.1);
  const ghost = interpolate(f, [l(275.6), l(281), l(286.4), l(286.7)], [0, 0.45, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ciclo = ["parado", "manosCintura", "brazosCruzados", "pensar"];
  // apiñado final: fila de atrás (5 adultos) y fila de adelante (3 adultos + mellizos) corridos medio lugar
  const atras = [0, 1, 2, 3, 7], delante = [4, 8, 9, 5, 6];
  const fin = (i: number) => { const a = atras.indexOf(i); return a >= 0 ? { x: 300 + a * 80, y: 955 } : { x: 260 + delante.indexOf(i) * 80, y: 1000 }; };
  const t0 = l(283.0), cmpH = l(287.4);
  return (
    <Escena Set={Mirador} pal={PAL} setProps={{ luces: 0.06, nieve: 0.9, ghost, noche: 0.25 }} seed={43}
      claves={[mira(0, 960, 520, 0.95), mira(l(277.0), 960, 500, 0.95), mira(l(278.4), 700, 720, 1.35, { curva: "inout" }), mira(l(281.2), 700, 720, 1.38), mira(l(282.8), 960, 480, 0.85, { curva: "inout" }), mira(l(287.2), 960, 470, 0.82), mira(l(288.0), 460, 840, 2.1, { curva: "inout" }), mira(l(290.0), 460, 845, 2.22)]}
      medio={<>{[...LOS10.keys()].sort((p, q) => fin(p).y - fin(q).y).map((i) => { const look = LOS10[i]; const q = fin(i); return <A key={i} look={look} escala={(i >= 8 ? NINO : 1) * 0.8} seed={90 + i} ruta={[{ f: 0, x: 250 + i * 70, y: 975 }, { f: l(286.9), x: 250 + i * 70, y: 975 }, { f: l(288.0), x: q.x, y: q.y }]} dir={[{ f: 0, v: 1 }]}
        poses={[...gestos(i * 5, l(286.9), [ciclo[i % 4], ciclo[(i + 1) % 4], ciclo[(i + 2) % 4]], 40 + (i % 3) * 6), ...gestos(l(288.0), l(290.0), [i % 2 ? "encogerse" : "brazosCruzados", { hD: 60, cD: 30, hI: 60, cI: 30, cabeza: i % 2 ? 6 : -6 }], 22 + i)]} caras={[{ f: 0, v: "duda" }, { f: l(287.8), v: i % 3 ? "triste" : "miedo" }]} miradas={[{ f: 0, v: { x: 0.5, y: -0.4 } }, { f: l(288.0), v: { x: 0, y: 0 } }]} sombra={0} />; })}</>}
      hud={<>
        <Cifra rotulo="CITY WORKERS IT TAKES" valor={f < l(282.8) ? "HUNDREDS" : "THOUSANDS"} golpes={[l(278.0), l(282.8)]} x={1300} y={60} desde={l(277.9)} hasta={t0 + 6} color="#ff8a2a" tam={110} rotuloTam={34} />
        {f >= t0 && f < cmpH + 2 && <><Velo desde={t0} hasta={cmpH} o={0.5} />
          <Comparacion x={1130} y={420} desde={t0} hasta={cmpH} w={440} h={470} acento="#ffcf6e" vs="VS"
            izq={{ titulo: "IT TAKES", dato: "THOUSANDS", color: "#e8803a", contenido: <g transform="translate(20,20)"><Obreritos f={f - t0 - 6} n={300} w={400} h={205} /></g> }}
            der={{ titulo: "WE HAVE", dato: "10", color: "#ffcf6e", contenido: <g transform="translate(20,30)">{LOS10.map((lk, k) => { const x = 22 + (k % 5) * 89, y = k < 5 ? 30 : 125; const o = Math.min(1, Math.max(0, (f - t0 - 14 - k * 2) / 5)); return <g key={k} opacity={o} transform={`translate(${x},${y}) scale(${k >= 8 ? 0.8 : 1})`}><rect x={-16} y={-4} width={32} height={54} rx={10} fill={lk.camisa} /><circle cy={-24} r={20} fill="#2a2420" /><rect x={-14} y={48} width={10} height={30} fill={lk.pantalon} /><rect x={4} y={48} width={10} height={30} fill={lk.pantalon} /></g>; })}</g> }} /></>}
        <Cifra rotulo="WORKERS WE HAVE" valor="10" golpes={[l(288.0)]} x={1400} y={60} desde={l(287.6)} color="#ffcf6e" tam={140} rotuloTam={40} />
      </>}
    />
  );
};

// ---------- 45 · 290:0-301:1 · Gus levanta el marcador amarillo; los 10 frente al mapa; rodea la biblioteca ----------
const P45: React.FC = () => {
  const f = useF();
  const l = loc(290.0);
  const P = VIS_PISO;
  const marcas = [{ g: 293.8, i: 0 }, { g: 295.4, i: 1 }, { g: 297.0, i: 2 }, { g: 298.6, i: 3 }];
  const gx = [2640, 2770, 2830, 2740, 2640]; // Gus junto a cada punto
  const ruta = [{ f: 0, x: 2520, y: P }, { f: l(292.6), x: 2520, y: P }, ...marcas.map((m, k) => ({ f: l(m.g - 0.5), x: MAPA_LUGARES[m.i].x - 130, y: P }))];
  const posesGus = [{ f: 0, v: { hD: 150, cD: 40 } }, { f: l(292.6), v: { hD: 120, cD: 30 } }, ...marcas.flatMap((m) => [{ f: l(m.g - 0.3), v: { hD: 125, cD: 5, tronco: 3 } }, ...gestos(l(m.g), l(m.g + 0.5), [{ hD: 135, cD: 5 }, { hD: 118, cD: 5 }], 5), { f: l(m.g + 0.6), v: { hD: 110, cD: 40 } }])];
  void gx;
  return (
    <Escena Set={Visitantes} pal={PAL} setProps={{ hora: "ocaso", mapa: { desde: [l(300.1), 99999, 99999, 99999], apagar: 0 } }} seed={44}
      claves={[mira(0, 2270, 680, 1.6), mira(l(292.2), 2290, 680, 1.65), mira(l(292.6), 2500, 580, 1.1, { curva: "inout" }), mira(l(297.6), 2510, 570, 1.12), mira(l(298.4), 2490, 560, 1.14, { curva: "inout" }), mira(l(301.1), 2480, 560, 1.16)]}
      medio={<>
        {marcas.map((m) => { const p = MAPA_LUGARES[m.i]; const u = ap(f, l(m.g), 14); const R = 46; return u > 0 ? <circle key={m.i} cx={p.x} cy={p.y} r={R} fill="none" stroke="#ffd34a" strokeWidth={10} strokeLinecap="round" strokeDasharray={2 * Math.PI * R} strokeDashoffset={2 * Math.PI * R * (1 - u)} transform={`rotate(-90 ${p.x} ${p.y})`} /> : null; })}
        {LOS10.map((look, i) => <A key={i} look={look} escala={i >= 8 ? NINO : 1} seed={60 + i} ruta={i === 0 ? ruta : [{ f: 0, x: 1785 + (i - 1) * 70, y: P }]} dir={[{ f: 0, v: 1 }]}
          poses={i === 0 ? posesGus : i === 2 ? gestos(0, l(301.1), ["brazosCruzados", "pensar", "brazosCruzados"], 50) : gestos(i * 4, l(301.1), ["parado", i % 2 ? "manosCintura" : "brazosCruzados", "parado", "señalar"], 36 + i * 3)}
          caras={[{ f: 0, v: i === 0 ? "determinado" : "triste" }]} miradas={[{ f: 0, v: { x: 0.4, y: -0.6 } }]}
          enManoD={i === 0 ? <rect x={-7} y={-34} width={14} height={40} rx={4} fill="#f2c230" /> : undefined} />)}
        <Ore x={3120} y={P} s={0.9} dir={-1} f={f} sentado={1} cola={0.2} />
      </>}
    />
  );
};

// ---------- 47-51 · lo que se llevan: biblioteca · farmacia · radio · botes; lo demás se apaga ----------
const Salva: React.FC<{ n: number; t: string; desde: number }> = ({ n, t, desde }) => <Pildora texto={`SAVE ${n} · ${t}`} x={1540} y={70} desde={desde} color="#ffcf6e" tam={36} />;
const P47: React.FC = () => {
  const f = useF();
  const l = loc(301.1);
  const P = BIB_PISO;
  return (
    <Escena Set={Biblioteca} pal={PAL} seed={45} claves={[mira(0, 1100, 520, 0.85), mira(l(305.5), 1180, 540, 1.0, { curva: "inout" })]}
      medio={<><rect x={710} y={P - 640} width={780} height={90} fill="#2a2430" /><text x={1100} y={P - 580} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={50} letterSpacing={6} fill="#f6ecd2">DULUTH PUBLIC LIBRARY</text>
        <A look={NAN} escala={1.8} ruta={[{ f: 0, x: 850, y: P }, { f: l(304.0), x: 1500, y: P, curva: "lineal" }]} poses={[{ f: 0, v: { hD: 30, cD: 80, hI: 25, cI: 80, cabeza: 4 } }, { f: l(304.1), v: { hD: 30, cD: 85, hI: 25, cI: 85, tronco: -3, cabeza: 8 } }]} caras={[{ f: 0, v: "determinado" }, { f: l(303.4), v: "feliz" }]} habla={[[l(302.4), l(304.7)]]}
        ajuste={(p, ff) => (ff > l(304.0) ? p : { ...p, bajar: (p.bajar ?? 0) + Math.abs(Math.sin(ff * 0.42)) * 9, tronco: (p.tronco ?? 0) - 4 + Math.sin(ff * 0.42) * 3 })}
        enManoD={<g>{["#3a5a8a", "#c0352c", "#e8c040", "#2a7a5a", "#7a4a8a"].map((c, k) => <rect key={k} x={-50} y={-10 - k * 18} width={100} height={17} rx={2} fill={c} />)}</g>} /></>}
      hud={<><Rotulo texto="knowledge doesn't rot" x={960} y={930} centro desde={l(303.1)} color="#ffcf6e" tam={66} rot={0} />
        <Cifra rotulo="THINGS THEY CAN SAVE" valor="1 OF 4" golpes={[l(302.0)]} x={1560} y={190} desde={l(301.8)} color="#ffcf6e" tam={100} rotuloTam={32} /></>} />
  );
};
const P48: React.FC = () => {
  const f = useF();
  const l = loc(305.5);
  const P = LOBBY_PISO;
  const X = LOBBY_PUNTOS.mostrador;
  const n = Math.min(12, Math.floor(f / 9) + 1);
  return (
    <Escena Set={Lobby} pal={PAL} setProps={{ luces: 0.3, afuera: "dia", monitores: false }} seed={46} claves={[mira(0, X, 640, 1.3), mira(l(309.3), X + 60, 620, 1.45)]}
      medio={<>
        <g transform={`translate(${X - 720},350)`}>
          <rect width={560} height={290} fill="#1f5a44" stroke="#0e0a12" strokeWidth={8} />
          <rect x={250} y={36} width={60} height={60} fill="#f6ecd2" /><rect x={265} y={21} width={30} height={90} fill="#f6ecd2" />
          <text x={280} y={190} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={54} fill="#f6ecd2">PHARMACY</text>
          <text x={280} y={240} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={500} fontSize={30} fill="#9bd8b8">ST. LUKE'S</text>
        </g>
        <rect x={X + 80} y={P - 140} width={220} height={140} fill="#c9a26a" /><rect x={X + 80} y={P - 150} width={220} height={18} fill="#a8844e" />
        {Array.from({ length: n }).map((_, k) => <rect key={k} x={X + 96 + (k % 4) * 48} y={P - 190 - Math.floor(k / 4) * 46} width={30} height={42} rx={6} fill={["#e8a040", "#f6ecd2", "#c0352c", "#7cc0e8"][k % 4]} />)}
        {/* estante de frascos (arriba a la derecha de June): ella agarra de ahí y deja en la caja */}
        {[P - 380, P - 470].map((yy, r) => <rect key={yy} x={X + 62} y={yy} width={262} height={14} rx={4} fill="#6a4a32" />)}
        {Array.from({ length: 12 }).map((_, k) => (k < n - 1 ? null : <rect key={k} x={X + 76 + (k % 6) * 40} y={(k < 6 ? P - 380 : P - 470) - 44} width={28} height={44} rx={6} fill={["#e8a040", "#f6ecd2", "#c0352c", "#7cc0e8"][k % 4]} />))}
        <A look={JUNE} escala={1.1} ruta={[{ f: 0, x: X - 40, y: P }]} dir={[{ f: 0, v: 1 }]} poses={gestos(0, l(309.3), [{ hD: 128, cD: 8, tronco: -2 }, { hD: 62, cD: 20, tronco: 14 }], 4.5)} caras={[{ f: 0, v: "determinado" }]}
          enManoD={(ff) => (Math.floor(ff / 4.5) % 2 === 1 ? <rect x={-14} y={-20} width={28} height={40} rx={6} fill="#e8a040" /> : null)} />
      </>}
      hud={<><Salva n={2} t="PHARMACY" desde={l(305.6)} />
        <div style={{ position: "absolute", left: 1500, top: 170, transform: "translateX(-50%)", opacity: ap(f, l(305.7), 8), background: "rgba(14,10,18,0.86)", borderRadius: 22, padding: "12px 26px 18px", textAlign: "center", fontFamily: F_HUD, fontWeight: 600 }}>
          <div style={{ fontSize: 40, letterSpacing: 4, color: "#fff" }}>PACKED</div>
          <div style={{ marginTop: 10, width: 300, height: 34, borderRadius: 17, border: "4px solid #f6ecd2", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(100 * n) / 12}%`, background: "#ffcf6e" }} /></div>
          {n >= 12 && <div style={{ marginTop: 8, transform: `scale(${1 + 0.4 * Math.exp(-(f - 99) / 4) * Math.cos((f - 99) * 0.5)})` }}><svg width={80} height={64} viewBox="0 0 80 64"><path d="M10,34 L30,54 L70,10" stroke="#0e0a12" strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d="M10,34 L30,54 L70,10" stroke="#7ce07c" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg></div>}
        </div></>} />
  );
};
const P49: React.FC = () => {
  const f = useF();
  const l = loc(309.3);
  const ease = Easing.inOut(Easing.cubic);
  const t0 = l(309.9);
  const gx = (ff: number) => 1250 + (700 - 1250) * ease(Math.min(1, Math.max(0, (ff - t0) / (l(312.4) - t0))));
  const rota = f > l(310.8);
  const AX = 1420;
  const sag = Math.max(0, 110 - (AX - gx(f)) * 0.4);
  return (
    <Escena Set={Techo} pal={PAL} setProps={{ onda: [] }} seed={47} claves={[mira(0, 1250, 680, 1.4), mira(l(312.4), 850, 700, 1.4)]}
      medio={<>
        {!rota && <path d={`M${AX},${TECHO_PISO - 60} Q${(AX + gx(f)) / 2},${TECHO_PISO - 65 + sag * 0.5 + Math.sin(f) * (sag > 5 ? 4 : 0.6)} ${gx(f) + 20},${TECHO_PISO - 70}`} stroke="#c0352c" strokeWidth={8} fill="none" strokeLinecap="round" />}
        {rota && <><path d={`M${AX},${TECHO_PISO - 60} q-20,40 -50,66`} stroke="#c0352c" strokeWidth={8} fill="none" strokeLinecap="round" /><path d={`M${gx(f) + 20},${TECHO_PISO - 70} q40,50 ${100 + 20 * Math.sin(f * 0.5)},46`} stroke="#c0352c" strokeWidth={8} fill="none" strokeLinecap="round" /></>}
        <Chispas x={AX} y={TECHO_PISO - 60} f0={l(310.8)} n={12} />
        <A look={GUS} escala={1.15} ruta={[{ f: 0, x: 1250, y: TECHO_PISO }, { f: t0, x: 1250, y: TECHO_PISO }, { f: l(312.4), x: 700, y: TECHO_PISO }]} poses={[{ f: 0, v: { hD: 70, cD: 100, hI: 70, cI: 100 } }, { f: l(310.8), v: { hD: 80, cD: 100, hI: 80, cI: 100, tronco: 12 } }]} caras={[{ f: 0, v: "triste" }, { f: l(310.8), v: "determinado" }]}
          enManoD={<g><rect x={-70} y={-60} width={140} height={60} rx={8} fill="#2a2a30" /><rect x={-56} y={-50} width={70} height={30} fill="#3a6a4a" /></g>} />
      </>}
      hud={<Salva n={3} t="GUS'S RADIO" desde={l(309.4)} />} />
  );
};
const P50: React.FC = () => {
  const f = useF();
  const l = loc(312.4);
  const y = 990;
  return (
    <Escena Set={CanalPark} pal={PAL} setProps={{ hora: "dia", luces: 0, nieve: 0.3, hielo: 0, ventanaGus: 0 }} seed={48} claves={[mira(0, 1650, 760, 1.1), mira(l(316.1), 1800, 800, 1.35, { curva: "inout" })]}
      medio={<>
        <Lago y={y} x0={800} w={3400} f={f} />
        {[1450, 1950, 2450].map((x, i) => <Bote key={x} x={x} y={y} s={0.8} f={f + i * 30} color={["#9aa0a8", "#c0352c", "#e8e2d6"][i]} />)}
        <rect x={800} y={y - 120} width={1000} height={34} fill="#7a5a3a" /><rect x={800} y={y - 90} width={1000} height={10} fill="#4a3426" />
        {[860, 1100, 1340, 1580, 1780].map((x) => <rect key={x} x={x} y={y - 90} width={22} height={160} fill="#4a3426" />)}
        {/* la amarra: del poste del muelle a la proa del bote rojo; Marcus la desata al final y cae al agua */}
        {(() => { const k = ap(f, l(315.75), 10); const bx = 1885, by = y - 34; const px = 1791 + 40 * k, py = y - 100 + 110 * k; const d = `M${px},${py} Q${(px + bx) / 2},${Math.max(py, by) + 28 - 10 * k} ${bx},${by}`; return <g><path d={d} stroke="#2a1c12" strokeWidth={13} fill="none" strokeLinecap="round" /><path d={d} stroke="#f0e2c0" strokeWidth={7} fill="none" strokeLinecap="round" /></g>; })()}
        {[0, 2, 5].map((d, k) => <Salpica key={k} x={1930 + k * 40} y={y - 6} f0={l(315.1) + d} color={k === 1 ? "#ffffff" : "#e8f6ff"} />)}
        {f > l(315.1) && f < l(315.1) + 16 && <ellipse cx={1950} cy={y - 2} rx={150 + (f - l(315.1)) * 10} ry={16} fill="none" stroke="#ffffff" strokeWidth={7} opacity={1 - (f - l(315.1)) / 16} />}
        <A look={MARCUS} escala={1.4} ruta={[{ f: 0, x: 1720, y: y - 120 }, { f: l(314.6), x: 1720, y: y - 120 }, { f: l(315.1), x: 1950, y: y - 70 }, { f: l(315.4), x: 1950, y: y - 70 }, { f: l(315.6), x: 1880, y: y - 70 }]} dir={[{ f: 0, v: 1 }, { f: l(315.4), v: -1 }]}
          poses={[...gestos(0, l(314.4), ["empujar", "agacharse"], 14), { f: l(314.5), v: "tirarSuelta" }, { f: l(315.1), v: "agacharse" }, { f: l(315.3), v: "celebrar" }, ...gestos(l(315.5), l(316.1), ["agacharse", "tirarSuelta"], 6)]} caras={[{ f: 0, v: "determinado" }, { f: l(315.2), v: "feliz" }, { f: l(315.5), v: "determinado" }]} />
      </>}
      hud={<><Salva n={4} t="THE BOATS" desde={l(312.6)} /><Rotulo texto="the only road that never breaks" x={960} y={850} centro desde={l(313.8)} color="#9bd8ff" tam={60} rot={0} />
</>} />
  );
};
const IconoMapa: React.FC<{ k: number; x: number; y: number; t0: number }> = ({ k, x, y, t0 }) => {
  const f = useF();
  const t = f - t0;
  if (t < 0) return null;
  const sc = interpolate(t, [0, 5, 10], [0, 1.35, 1], { extrapolateRight: "clamp" });
  const bob = Math.sin(f / 6 + k) * 4;
  return (
    <g transform={`translate(${x},${y - 80 + bob}) scale(${sc})`}>
      <circle r={44} fill="#17131a" stroke="#ffcf6e" strokeWidth={6} />
      {k === 0 && <g><rect x={-20} y={-16} width={16} height={32} fill="#c0352c" /><rect x={-3} y={-20} width={16} height={36} fill="#3a5a8a" /><rect x={12} y={-14} width={10} height={30} fill="#e8c040" /></g>}
      {k === 1 && <g><rect x={-12} y={-12} width={24} height={30} rx={5} fill="#e8a040" /><rect x={-9} y={-22} width={18} height={10} fill="#f6ecd2" /></g>}
      {k === 2 && <g><rect x={-22} y={-10} width={44} height={26} rx={5} fill="#3a6a4a" /><line x1={8} y1={-10} x2={18} y2={-26} stroke="#f6ecd2" strokeWidth={4} /></g>}
      {k === 3 && <g><path d="M-24,0 L24,0 L16,16 L-18,16Z" fill="#c0352c" /><path d="M0,-24 L0,0 M0,-24 L16,-4 L0,-4Z" stroke="#f6ecd2" strokeWidth={4} fill="#f6ecd2" /></g>}
    </g>
  );
};
const P51: React.FC = () => {
  const f = useF();
  const l = loc(316.1);
  const orden = [0, 1, 2, 3];
  return (
    <EscenaS Set={Visitantes} pal={PAL} setProps={{ hora: "ocaso", mapa: { desde: [-99, -99, -99, -99], apagar: ap(f, l(316.6), 24) } }} seed={49}
      sacudidas={[l(316.5), l(316.7), l(316.9), l(317.1)]} amp={5}
      claves={[mira(0, VIS_MAPA.x + 400, VIS_MAPA.y + 235, 1.9), mira(l(318.7), VIS_MAPA.x + 400, VIS_MAPA.y + 240, 1.55)]}
      medio={<>{orden.map((k) => <IconoMapa key={k} k={k} x={MAPA_LUGARES[k].x} y={MAPA_LUGARES[k].y} t0={l(316.5 + k * 0.2)} />)}</>}
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
  const lugar = [X - 150, X - 330, X - 470, X - 610, X - 750, X + 330, X + 470, X + 610, X + 760, X - 60];
  return (
    <Escena Set={CanalPark} pal={PAL} setProps={{ hora: "noche", luces: 0, nieve: 0.4, hielo: 0, ventanaGus: 0 }} seed={50}
      claves={[mira(0, X - 60, 700, 1.5), mira(l(322.0), X - 100, 700, 1.4), mira(l(322.2), X, 690, 1.2, { curva: "inout" }), mira(l(326.0), X + 40, 680, 1.25), mira(l(330.6), 2600, 300, 0.75, { curva: "inout" }), mira(l(331.0), X - 70, 700, 1.9, { curva: "inout" }), mira(l(334.4), X - 70, 700, 1.95), mira(l(334.8), X - 120, 670, 2.3, { curva: "inout" }), mira(l(337.5), X - 130, 660, 2.4)]}
      medio={<>
        <Tambor x={X} y={P} f={f} />
        {LOS10.map((look, i) => { const x = lugar[i]; const izq = x < X; return <A key={i} look={look} escala={i >= 8 ? NINO : 1} seed={70 + i} luz={{ lado: izq ? 1 : -1, color: "#ff9a3a", fuerza: 0.9 }} ruta={[{ f: 0, x, y: P }]} dir={[{ f: 0, v: i === 9 ? -1 : izq ? 1 : -1 }]}
          poses={i === 9 ? [...gestos(0, l(329.4), ["parado", "manosCintura"], 40), ...gestos(l(329.4), l(330.9), [{ hD: 95, cD: 0, tronco: 4 }, { hD: 60, cD: 10, tronco: -6 }], 6), ...gestos(l(331.0), l(337.5), ["parado", { hD: 70, cD: 60, hI: 70, cI: 60 }, "manosCintura"], 50)] : gestos(i * 11, l(337.5), i % 2 ? [{ hD: 70, cD: 60, hI: 70, cI: 60 }, "parado", "brazosCruzados", "manosCintura"] : ["parado", { hD: 70, cD: 60, hI: 70, cI: 60 }, "manosCintura", "pensar"], 66 + (i % 4) * 9)} caras={[{ f: 0, v: i === 9 ? "duda" : "cansado" }]}
          habla={i === 9 ? [[l(331.0), l(333.6)]] : i === 0 ? [[l(334.6), l(337.3)]] : []} miradas={i === 0 ? [{ f: 0, v: { x: 0.5, y: -0.3 } }] : undefined} />; })}
        <Ore x={X + 900} y={P} s={0.9} dir={-1} f={f} echado={1} cola={0.3} />
      </>}
      hud={<>
        <Globo texto="How long will the bridge stand?" x={1010} y={300} desde={l(331.0)} hasta={l(334.4)} cola="abajo" tam={60} />
        <Globo texto={"Longer than us, kid.\nBut not forever."} x={800} y={280} desde={l(334.6)} hasta={l(337.5)} cola="abajo" tam={60} />
      </>}
    />
  );
};

// ---------- 56 · 337:5-345:0 · a la mañana cargan todo en 3 camionetas y salen al norte, a Hermantown (travelling con la 1ª camioneta) ----------
const P56: React.FC = () => {
  const f = useF();
  const l = loc(337.5);
  const P = SUP_PISO;
  const N = Math.round(l(345.0)) + 2;
  const avance = (ff: number) => 12 * ff + (ff > l(341.4) ? 0.04 * (ff - l(341.4)) ** 2 : 0);
  const sale = (k: number) => avance(f) + 0 * k;
  const rebote = (k: number) => 5 * Math.abs(Math.sin(f * 0.55 + k * 1.7));
  const colores = ["#4a8ab8", "#d2603f", "#d9c28a"];
  const slots = [[-285, -215, -145, -75], [-265, -170, -75], [-265, -170, -75]]; // lugares en la caja de cada camioneta
  const cart = ap(f, l(341.4), 18);
  const X0 = 1500;
  // cámara pegada a la 1ª camioneta (capa frente, paralaje 1.4): un cuadro clave por cuadro
  const Z = 1.3, zf = 1 + (Z - 1) * 1.4;
  const camX = (ff: number) => 960 + (X0 + avance(ff) + 260 - 960) * zf / (1.4 * Z);
  const claves = Array.from({ length: N }).map((_, ff) => mira(ff, camX(ff), 700, Z, ff ? { curva: "inout" } : {}));
  return (
    <Escena Set={Superior} pal={PAL} setProps={{ hora: "alba", luces: 0, rotulos: true }} seed={51} mano={1}
      claves={claves}
      frente={<>
        {[0, 1, 2].map((k) => { const x = X0 + k * 620 + sale(k); return <g key={k} transform={`translate(0,${-rebote(k)})`}>
          <Auto x={x} y={P + 170} color={colores[k]} tipo="pickup" s={2.3} dir={1} faros />
          <rect x={x - 300} y={P - 2} width={44} height={34} fill={["#c9a26a", "#3a5a8a", "#e8c040"][k]} stroke="#0e0a12" strokeWidth={3} />
        </g>; })}
        {LOS10.map((look, i) => { const k = i < 4 ? 0 : i < 7 ? 1 : 2; const j = k === 0 ? i : k === 1 ? i - 4 : i - 7; const x = X0 + k * 620 + sale(k) + slots[k][j];
          return <A key={i} look={look} escala={(i >= 8 ? NINO * 1.15 : 1) * 1.2} seed={100 + i} sombra={0} ruta={[{ f: 0, x, y: P + 62 - rebote(k) }]} dir={[{ f: 0, v: 1 }]}
            poses={gestos(i * 3, l(345.0), [{ hD: 165, cD: 25 }, { hD: 150, cD: 40, hI: 20, cI: 10 }, { hD: 170, cD: 15, hI: 150, cI: 20 }], 9 + (i % 3) * 2)} giros={[{ f: 0, v: 0.8 }]} caras={[{ f: 0, v: "feliz" }]} />; })}
        {[0, 1, 2].map((k) => { const x = X0 + k * 620 + sale(k); return <g key={k} transform={`translate(${x},${P + 170 - rebote(k)}) scale(2.3)`}><path d="M-130,-30 L-130,-62 L-20,-62 L-20,-30 Z" fill={colores[k]} stroke="#0e0a12" strokeWidth={1.6} /></g>; })}
      </>}
      hud={<svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: cart }}><g transform={`translate(${1500 + (1 - cart) * 420},790)`}>
        <rect x={-150} y={-10} width={14} height={260} fill="#6a6a72" /><rect x={136} y={-10} width={14} height={260} fill="#6a6a72" />
        <rect x={-260} y={-200} width={520} height={200} rx={16} fill="#1f6a3e" stroke="#f6ecd2" strokeWidth={6} />
        <text x={0} y={-112} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={60} fill="#f6ecd2" letterSpacing={3}>HERMANTOWN</text>
        <text x={-10} y={-40} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={500} fontSize={42} fill="#f6ecd2" letterSpacing={3}>NORTH</text>
        <path d="M70,-54 L110,-54 L110,-66 L134,-44 L110,-22 L110,-34 L70,-34 Z" fill="#f6ecd2" transform="rotate(-90 102 -44)" />
      </g></svg>}
    />
  );
};

// ---------- 57-60 · la granja: latas que se acaban, semillas que vencen, 7.000.000 kcal, la tierra ----------
const P57: React.FC = () => {
  const f = useF();
  const l = loc(345.0);
  const P = GRANJA_PISO;
  const val = rampa(f, l(346.5), l(350.0), 15, 0);
  const quedan = Math.ceil(val - 1e-6);
  return (
    <Escena Set={Granja} pal={PAL} setProps={{ hora: "dia", estacion: "barro", crec: 0, humo: 0.6 }} seed={52}
      claves={[mira(0, 1270, 680, 1.4), mira(l(346.4), 1300, 690, 1.4), mira(l(346.9), 1360, 700, 1.38, { curva: "inout" }), mira(l(350.1), 1420, 700, 1.5)]}
      medio={<g>
        {[330, 230, 130].map((dy) => <rect key={dy} x={1440} y={P - dy} width={220} height={12} fill="#6a4a32" />)}
        {Array.from({ length: quedan }).map((_, i) => <Lata key={i} x={1468 + (i % 5) * 44} y={P - 330 + Math.floor(i / 5) * 100} color={["#e0563a", "#e8c040", "#7cb85a", "#c9c9c4"][i % 4]} s={1.0} />)}
        <A look={MARCUS} escala={1.25} ruta={[{ f: 0, x: 1210, y: P }, { f: l(346.4), x: 1330, y: P }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: "parado" }, ...gestos(l(346.5), l(349.2), [{ hD: 120, cD: 10, tronco: 3 }, { hD: 60, cD: 125, cabeza: 10 }, { hD: 105, cD: 10 }, { hD: 55, cD: 130, cabeza: 12 }], 20), ...gestos(l(349.3), l(350.1), [{ hD: 115, cD: 55, cabeza: 10 }, { hD: 125, cD: 45, cabeza: 14 }], 4)]}
          caras={[{ f: 0, v: "neutral" }, { f: l(347.0), v: "duda" }, { f: l(348.6), v: "miedo" }]}
          enManoD={(ff) => (ff > l(347.0) ? <Lata x={0} y={-8} color="#e0563a" s={1.0} /> : null)} />
      </g>}
      hud={<>
        <Rotulo texto="canned food won't last" x={960} y={900} centro desde={l(347.4)} color="#f6ecd2" tam={64} rot={0} brillo={false} />
        <div style={{ position: "absolute", left: 1500, top: 200, transform: "translateX(-50%)", opacity: ap(f, l(346.4), 8), background: "rgba(14,10,18,0.86)", borderRadius: 22, padding: "12px 26px 18px", textAlign: "center", fontFamily: F_HUD, fontWeight: 600 }}>
          <div style={{ fontSize: 40, letterSpacing: 4, color: "#fff" }}>CANS LEFT</div>
          <div style={{ marginTop: 10, width: 300, height: 34, borderRadius: 17, border: "4px solid #f6ecd2", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(100 * val) / 15}%`, background: val < 4 ? "#e23a2e" : "#e0563a" }} /></div>
        </div>
      </>} />
  );
};
const P58: React.FC = () => {
  const f = useF();
  const l = loc(350.1);
  const sellos = [{ g: 351.1, x: 560, r: -14 }, { g: 351.4, x: 960, r: 6 }, { g: 351.7, x: 1360, r: -4 }];
  const tachaCal = ap(f, l(353.3), 8);
  return (
    <EscenaS Set={Mesa} pal={PAL} setProps={{ obj: "semillas", tono: "calido", fecha: "" }} seed={53} sacudidas={sellos.map((q) => l(q.g))} amp={7}
      claves={[mira(0, 812, 500, 1.15), mira(l(354.3), 840, 510, 1.2)]}
      medio={<>
        {sellos.map((q) => { const t = f - l(q.g); if (t < 0) return null; const sc = interpolate(t, [0, 4, 7], [2.2, 0.92, 1], { extrapolateRight: "clamp" }); return <g key={q.g} transform={`rotate(${q.r} ${q.x} 560) translate(${q.x},748) rotate(-10) scale(${sc})`} opacity={Math.min(1, t / 2)}>
          <rect x={-128} y={-38} width={256} height={64} rx={8} fill="none" stroke="#c0352c" strokeWidth={7} />
          <text x={0} y={12} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={44} letterSpacing={5} fill="#c0352c">EXPIRES</text></g>; })}
        {/* Marcus detrás de la mesa, de cintura arriba: levanta un sobre, lo mira, niega con la cabeza y señala el calendario */}
        <A look={MARCUS} escala={2.5} ruta={[{ f: 0, x: 330, y: 1080 }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: { hD: 95, cD: 5, tronco: 8 } }, { f: l(350.5), v: { hD: 80, cD: 50, tronco: 2, cabeza: 10 } }, ...gestos(l(351.0), l(351.9), [{ hD: 82, cD: 48, cabeza: 12 }, { hD: 78, cD: 55, cabeza: -6 }], 6), { f: l(352.2), v: { hD: 75, cD: 50, hI: 20, cI: 60 } }, { f: l(352.6), v: { hD: 150, cD: 10, cabeza: -6 } }, ...gestos(l(353.3), l(354.3), [{ hD: 150, cD: 10, cabeza: -6 }, { hD: 140, cD: 20, cabeza: -2 }], 8)]}
          caras={[{ f: 0, v: "neutral" }, { f: l(350.6), v: "duda" }, { f: l(351.2), v: "triste" }, { f: l(353.3), v: "miedo" }]}
          enManoD={(ff) => (ff > l(350.4) && ff < l(352.5) ? <g transform="rotate(10)"><rect x={-26} y={-44} width={52} height={78} rx={5} fill="#f4ecd8" stroke="#0e0a12" strokeWidth={2} /><rect x={-21} y={-39} width={42} height={42} rx={4} fill="#e8c040" /></g> : null)} />
      </>}
      hud={<>
        <Rotulo texto="short summer" x={1100} y={950} centro desde={l(352.4)} color="#ffcf6e" tam={74} rot={0} />
        <Hojas x={1600} y={70} texto="SUMMER" desde={l(351.8)} dia={Math.floor(rampa(f, l(352.2), l(353.2), 0, 14))} w={300} />
        {tachaCal > 0 && <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><g stroke="#e23a2e" strokeWidth={16} strokeLinecap="round">
          <path d={`M1400,90 L${1400 + 400 * Math.min(1, tachaCal * 2)},${90 + 140 * Math.min(1, tachaCal * 2)}`} />
          {tachaCal > 0.5 && <path d={`M1800,90 L${1800 - 400 * (tachaCal * 2 - 1)},${90 + 140 * (tachaCal * 2 - 1)}`} />}</g></svg>}
      </>} />
  );
};
const P59: React.FC = () => {
  const f = useF();
  const l = loc(354.3);
  const P = GRANJA_PISO;
  return (
    <Escena Set={Granja} pal={PAL} seed={54}
      setProps={{ hora: "dia", estacion: "barro", crec: 0, humo: 0.6 }}
      claves={[mira(0, 1010, 520, 1.6), mira(l(359.4), 1000, 540, 1.25), mira(l(359.6), 3300, 700, 1.4, { curva: "inout" }), mira(l(361.9), 3320, 720, 1.6)]}
      medio={<>
        <A look={MARCUS} escala={1.15} ruta={[{ f: 0, x: 1220, y: P }, { f: l(359.4), x: 1220, y: P }, { f: l(359.6), x: 3300, y: P }]} dir={[{ f: 0, v: -1 }, { f: l(359.6), v: 1 }]}
          poses={gestos(0, l(361.9), [{ hD: 135, cD: 5, tronco: -7, pI: 8, pD: -6 }, { hD: 55, cD: 5, tronco: 24, pI: -12, pD: 14 }], 12)}
          caras={[{ f: 0, v: "determinado" }, { f: l(360.8), v: "feliz" }]} enManoD={<g transform="rotate(-20)"><rect x={-4} y={-10} width={9} height={120} fill="#8a6a3e" /><path d="M-30,108 L30,108 L22,140 L-22,140Z" fill="#9aa0a8" /></g>} />
        {/* tierra que salta en cada azadonazo */}
        {Array.from({ length: 10 }).map((_, k) => <Salpica key={k} x={3300 + 150} y={P - 6} f0={l(359.6) + 12 * k + 6} color="#7a5a3a" />)}
        {f > l(359.6) && <Halo x={3360} y={P - 140} r={240} color="#ffcf6e" fuerza={0.35} />}
      </>}
      hud={<>
        <Rotulo texto="grow it themselves" x={1240} y={215} centro desde={l(360.0)} color="#ffcf6e" tam={70} rot={0} />
        <Cifra rotulo="KCAL / YEAR NEEDED" valor={Math.round(rampa(f, l(355.3), l(358.8), 0, 7000000)).toLocaleString("en-US")} golpes={[l(358.8)]} x={1400} y={10} desde={l(355.2)} color="#ff8a4a" tam={92} rotuloTam={30} />
      </>} />
  );
};

// ---------- 49 · 361:9-372:3 · el cuaderno: la mano escribe POPULATION, DAYS UNTIL FIRST FROST y el 147 con golpe ----------
const PCuaderno49: React.FC = () => {
  const f = useF();
  const l = loc(361.9);
  const escritos = [{ t: "POPULATION: 10", g: 362.4, x: 520, y: 330, tam: 64 }, { t: "DAYS UNTIL FIRST FROST:", g: 365.8, x: 520, y: 520, tam: 58, color: "#2a4a8a" }, { t: "147", g: 370.6, x: 1000, y: 720, tam: 170, sub: [371.4], color: "#c0352c" }];
  const ts = [l(361.9), l(362.4), l(364.4), l(365.4), l(365.8), l(368.4), l(370.2), l(370.6), l(371.3), l(371.4), l(371.9), l(372.2)];
  const px = interpolate(f, ts, [1150, 520, 1020, 520, 520, 1260, 1000, 1000, 1330, 1000, 1330, 1250], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const py = interpolate(f, ts, [900, 380, 380, 575, 575, 575, 800, 800, 800, 940, 940, 1020], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) + (f > l(362.4) && f < l(364.4) ? Math.sin(f * 1.5) * 9 : f > l(365.8) && f < l(368.4) ? Math.sin(f * 1.5) * 9 : f > l(370.6) && f < l(371.3) ? Math.sin(f * 1.8) * 12 : 0);
  const pop = f >= l(370.6) ? 1 + 0.5 * Math.exp(-(f - l(370.6)) / 5) * Math.cos((f - l(370.6)) * 0.6) : 1;
  return (
    <EscenaS Set={Mesa} pal={PAL} setProps={{ obj: "cuaderno", escritos: escritos.map((e) => ({ t: e.t, desde: l(e.g), x: e.x, y: e.y, tam: e.tam, color: e.color, sub: (e.sub ?? []).map(l) })) }} seed={362} mano={1.5} sacudidas={[l(370.6), l(371.4)]} amp={14}
      claves={[mira(0, 980, 540, 1.15, { rot: -1.2 }), mira(l(370.0), 1010, 530, 1.25, { rot: 0.2 }), mira(l(372.3), 1060, 520, 1.4, { rot: 1.6 })]}
      medio={<>
        <ManoPunta x={px} y={py} lapiz manga="#2f9aa0" op={ap(f, l(362.0), 6) * (1 - ap(f, l(372.0), 8))} />
              </>}
      hud={<Onoma texto="147" x={1500} y={300} golpes={[l(370.7)]} dur={26} color="#ff6a4a" tam={170} rot={0} />} />
  );
};

// ---------- 62 · 372:3-379:7 · CTA: los 10 en la granja al atardecer ----------
const P62: React.FC = () => {
  const f = useF();
  const l = loc(372.3);
  const P = GRANJA_PISO;
  return (
    <Escena Set={Granja} pal={PAL} setProps={{ hora: "ocaso", estacion: "barro", crec: 0, humo: 0.6 }} seed={55}
      claves={[mira(0, 2480, 660, 1.0), mira(l(379.7), 2500, 640, 1.18, { curva: "inout" })]}
      medio={<>
        {LOS10.map((look, i) => {
          const giros: { f: number; v: number }[] = [{ f: 0, v: 0 }];
          for (let c = 0; c < 3; c++) { const t = l(373.4) + i * 11 + c * 70; giros.push({ f: t, v: 0.9 }, { f: t + 30, v: 0 }); }
          return <A key={i} look={look} escala={(i >= 8 ? NINO : 1) * 1.3} seed={80 + i} luz={{ lado: -1, color: "#ff9a3a", fuerza: 0.9 }} ruta={[{ f: 0, x: 1800 + i * 135, y: P }]} dir={[{ f: 0, v: i % 2 ? -1 : 1 }]}
            poses={[{ f: 0, v: "parado" }, ...gestos(l(373.0) + i * 12, l(379.7), ["señalar", "parado", { hD: 110, cD: 10, tronco: 3 }, "manosCintura"], 34)]}
            giros={giros} caras={[{ f: 0, v: i % 3 === 1 ? "duda" : "feliz" }]} />;
        })}
        <Ore x={3115} y={P} s={0.9} dir={-1} f={f} sentado={1} cola={1} />
      </>}
      hud={<>
        <Rotulo texto={"What 3 would\nyou save?"} x={1240} y={110} centro desde={l(372.6)} color="#ffcf6e" tam={84} rot={0} />
      </>}
    />
  );
};

// ---------- 51 · 379:7-384:9 · tarjeta del próximo episodio: los 10 retroceden ante la helada, 147 DAYS late ----------
const Siguiente51: React.FC = () => {
  const f = useF();
  const l = loc(379.7);
  const P = GRANJA_PISO;
  const p = 1 + 0.09 * Math.max(0, Math.sin(((f - l(380.4)) / 30) * Math.PI * 2 - 0.4)) * ap(f, l(380.4), 6);
  const prog = ap(f, l(380.6), 100); // la helada avanza ~150 px
  const ret = interpolate(f, [l(381.6), l(382.4)], [0, 70], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fila = [
    { look: PRIYA, x: 2480 }, { look: GUS, x: 2580, d: -1 }, { look: ROSA, x: 2690 }, { look: LILY, x: 2790, nino: true }, { look: NAN, x: 2865 },
    { look: BEN, x: 2940, nino: true, d: -1 }, { look: DEV, x: 3050 }, { look: THEO_INV, x: 3170 }, { look: JUNE, x: 3290 }, { look: MARCUS, x: 3420, horq: true },
  ];
  const agarre = { tronco: 4, hD: 92, cD: 8, hI: 88, cI: 12 }; // los mellizos se agarran de Nan
  const alto = { tronco: -2, hD: 155, cD: 15, hI: -20, cI: 30 }; // Gus le levanta la mano a Ore: quieto
  const reac = (i: number) => (i === 3 || i === 5 ? [{ f: 0, v: susto }, { f: l(380.7), v: agarre }, ...gestos(l(381.0), l(384.9), [agarre, { ...agarre, tronco: 8, cabeza: 6 }], 10)]
    : i === 1 ? [{ f: 0, v: susto }, { f: l(380.8), v: alto }, ...gestos(l(381.2), l(384.9), [alto, { ...alto, hD: 165, cD: 5 }], 9)]
    : [{ f: 0, v: susto }, ...gestos(l(380.7) + i * 2, l(384.9), [susto, { ...susto, tronco: 12, hD: 60, cD: 80, hI: 50, cI: 90 }, { ...susto, hD: 30, cD: 50 }], 12 + (i % 3) * 3)]);
  const susto = { tronco: 8, hD: 40, cD: 60, hI: -30, cI: 40 };
  return (
    <>
      <Escena Set={Granja} pal={PAL} setProps={{ hora: "ocaso", estacion: "verano", crec: 1, humo: 0.4 }} seed={404} mano={2}
        claves={[mira(0, 2980, 640, 1.15), mira(l(384.9), 3030, 640, 1.25)]}
        medio={<>
          <Halo x={3100} y={460} r={800} color="#ffb04a" fuerza={0.45} />
          <Papa x={3180} y={P - 260} s={15} rot={-8} color="#c0813e" />
          {fila.map((q, i) => <A key={i} look={q.look} escala={(q.nino ? NINO : 1) * 1.05} seed={90 + i} luz={{ lado: -1, color: "#ffb04a", fuerza: 0.9 }}
            ruta={[{ f: 0, x: q.x, y: P + 80 }, { f: l(381.6), x: q.x, y: P + 80 }, { f: l(382.4), x: q.x - ret, y: P + 80 }]} dir={[{ f: 0, v: 1 }, { f: l(380.6), v: (q.d ?? 1) as 1 | -1 }]} poses={reac(i)}
            ajuste={(pp, ff) => ({ ...pp, tronco: (pp.tronco ?? 0) + 2.2 * Math.sin(ff * 1.1 + i) })}
            caras={[{ f: 0, v: "miedo" }]} miradas={[{ f: 0, v: { x: 0.7, y: -0.1 } }]} enManoD={q.horq ? <Horquilla /> : undefined} />)}
          <Ore x={2380 - ret} y={P + 80} s={1.05} dir={1} f={f} paso={0} cola={1} ladra={1} />
          <Helada4 x0={3640 - 150 * prog} piso={P + 40} f={f} />
        </>}
      />
      <PildoraFija texto="NEXT · EP. 4" x={960} y={30} desde={l(379.9)} color="#ffcf6e" tam={44} />
      <Rotulo texto="Could 10 people grow enough food?" x={960} y={990} centro desde={l(380.3)} color="#f6ecd2" tam={58} rot={0} brillo={false} />
      <div style={{ position: "absolute", left: 1300, top: 190, transform: `translateX(-50%) scale(${p})`, opacity: ap(f, l(380.4), 8), fontFamily: F_HUD, fontWeight: 600, fontSize: 130, color: "#ff7a5a", whiteSpace: "nowrap", WebkitTextStroke: "9px rgba(14,10,18,0.92)", paintOrder: "stroke fill", textShadow: "0 6px 0 rgba(10,8,14,0.85), 0 0 34px #ff7a5a88" }}>147 DAYS</div>
    </>
  );
};

export const PLANOS_B: [number, React.ReactNode, PlanoM["trans"]?][] = [
  [165.8, <P23 />, { tipo: "cortina", d: 14, color: "#0b0810" }], [184.9, <P24 />],
  [192.0, <PPizarra s0={192.0} s1={194.1} tachas={[192.3]} />],
  [194.1, <P29 />, { tipo: "cortina", d: 14, color: "#0b0810", lado: -1 }], [201.1, <P31 />, { tipo: "barrido", d: 10 }], [213.5, <P33 />],
  [220.2, <PPizarra s0={220.2} s1={223.5} tachas={[218.0, 220.9]} iconos />],
  [223.5, <P36 />, { tipo: "cortina", d: 14, color: "#0b0810" }], [239.6, <P38 />], [243.6, <P39 />], [245.6, <P40 />],
  [247.3, <P41 />], [256.1, <P42 />, { tipo: "barrido", d: 10 }], [261.4, <P43 />, { tipo: "cortina", d: 14, color: "#0b0810" }],
  [275.1, <P44 />, { tipo: "fundido", d: 16 }], [290.0, <P45 />],
  [301.1, <P47 />, { tipo: "luz", d: 12 }], [305.5, <P48 />], [309.3, <P49 />], [312.4, <P50 />], [316.1, <P51 />, { tipo: "luz", d: 12 }],
  [318.7, <P52 />, { tipo: "fundido", d: 20 }], [337.5, <P56 />, { tipo: "fundido", d: 18 }],
  [345.0, <P57 />, { tipo: "luz", d: 16 }], [350.1, <P58 />], [354.3, <P59 />],
  [361.9, <PCuaderno49 />, { tipo: "fundido", d: 14 }],
  [372.3, <P62 />, { tipo: "fundido", d: 16 }], [379.7, <Siguiente51 />, { tipo: "fundido", d: 18 }],
];
