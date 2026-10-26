// Portadas en código. Ep.4 (miniatura lc04 sin texto: papa gigante, la granja al ocaso lejos, los 10 + Ore cruzando
// el campo con caras de susto, a la derecha la helada con cristales y plantas negras) = cuadro 0 del Ep.4 y tarjeta
// final del Ep.3. Ep.5 (miniatura lc05 sin texto: June con el último frasco que brilla, Theo con el farol al fondo)
// = tarjeta final del Ep.4.
import React from "react";
import { interpolate } from "remotion";
import { Clave, mira, useF } from "../../anikit/camara";
import { Escena } from "../../anikit/escena";
import { Halo } from "../../anikit/luz";
import { Pildora } from "../../anikit/pantalla";
import { GUS, JUNE, JUNE_MOCHI, PAL, THEO_INV, conAcc } from "../elenco";
import { A, Rotulo, loc } from "./comun_ep";
import { BEN, DEV, LILY, MARCUS, NAN, NINO, Ore, PRIYA, ROSA } from "./elenco_lcb";
import { GRANJA_PISO, Granja, Papa, Tractor } from "./granja";
import { FarolMano, Vial } from "../lcc/piezas";
import { PasilloFarmacia } from "../lcc/sets5";

// Marcus de verano (miniatura Ep.4): sombrero de paja + horquilla
export const MARCUS_VERANO = conAcc({ ...MARCUS }, { t: "sombrero", color: "#d8b46a" });
export const Horquilla: React.FC = () => (
  <g>
    <rect x={-4} y={-150} width={8} height={190} rx={3} fill="#7a5532" />
    <path d="M-22,-150 L-22,-200 M-7,-150 L-7,-206 M7,-150 L7,-206 M22,-150 L22,-200 M-24,-150 L24,-150" stroke="#9aa0a8" strokeWidth={6} strokeLinecap="round" fill="none" />
  </g>
);

// helada: cristales de hielo + plantas negras desde x0 hacia la derecha. k 0..1 = cuánto avanzó
export const Helada4: React.FC<{ x0: number; piso: number; f: number; k?: number }> = ({ x0, piso, f, k = 1 }) => {
  const W = Math.max(1, 2600 * k);
  return (
    <g>
      <defs><linearGradient id="hel4" x1="0" x2="1"><stop offset="0" stopColor="#bfe0ff" stopOpacity={0} /><stop offset="0.18" stopColor="#bfe0ff" stopOpacity={0.55} /><stop offset="1" stopColor="#e8f4ff" stopOpacity={0.9} /></linearGradient></defs>
      <defs><linearGradient id="cielo4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0f1838" /><stop offset="0.7" stopColor="#2a4a8a" stopOpacity={0.85} /><stop offset="1" stopColor="#6fa0e0" stopOpacity={0} /></linearGradient></defs>
      <rect x={x0 + 120} y={-800} width={W + 200} height={piso + 500} fill="url(#cielo4)" opacity={Math.min(1, k * 1.4)} />
      <rect x={x0} y={-800} width={W + 200} height={piso + 1600} fill="url(#hel4)" />
      {Array.from({ length: 26 }).map((_, i) => { const x = x0 + 60 + (i * 113) % W; const y = piso - 10 + (i % 4) * 46; return x < x0 + W ? <g key={`p${i}`} transform={`translate(${x},${y}) scale(${0.9 + (i % 3) * 0.25})`}>{[-50, -20, 15, 45].map((a, j) => <path key={j} d={`M0,0 Q${a * 0.6},-40 ${a},-${50 + j * 8} Q${a * 0.3},-30 0,0`} fill="#1a1d24" />)}</g> : null; })}
      {Array.from({ length: 70 }).map((_, i) => { const x = x0 + 40 + (i * 61) % W; const h = (140 + (i * 53) % 420) * (i % 7 === 0 ? 1.5 : 1) * Math.min(1, 0.55 + (x - x0) / 900); const y = piso + 60 - (i % 5) * 18; const b = 26 + (i % 4) * 10; const s = 1 + 0.03 * Math.sin(f / 9 + i); return x < x0 + W ? <g key={`c${i}`} transform={`translate(${x},${y}) scale(${s}) rotate(${((i * 37) % 30) - 15})`}><path d={`M${-b},0 L0,${-h} L${b},0 Z`} fill="#e8f6ff" opacity={0.85} /><path d={`M0,0 L0,${-h} L${b},0 Z`} fill="#a8d4f8" opacity={0.7} /></g> : null; })}
      {Array.from({ length: 50 }).map((_, i) => <circle key={`n${i}`} cx={x0 + 30 + ((i * 97 + f * 3) % W)} cy={-200 + ((i * 131 + f * 2) % (piso + 260))} r={3 + (i % 3) * 3} fill="#ffffff" opacity={0.75} />)}
    </g>
  );
};

// granja lejana (granero rojo + silo + tractor) para el fondo de la portada
const GranjaLejos: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M0,0 L0,-120 L40,-170 L160,-170 L200,-120 L200,0 Z" fill="#b8322c" />
    <path d="M-10,-118 L40,-176 L160,-176 L210,-118" stroke="#f0e6d2" strokeWidth={8} fill="none" />
    <rect x={70} y={-90} width={60} height={90} fill="#8a2420" /><path d="M70,-90 L130,0 M130,-90 L70,0" stroke="#f0e6d2" strokeWidth={6} />
    <rect x={230} y={-220} width={70} height={220} fill="#c9c4b8" /><ellipse cx={265} cy={-220} rx={35} ry={14} fill="#9aa0a8" />
    <Tractor x={420} y={0} s={0.55} />
  </g>
);

export const PortadaLc04: React.FC<{ s0?: number; caminan?: boolean; desvanece?: number; claves?: Clave[]; hora?: "ocaso" | "dia" }> = ({ s0 = 0, caminan = true, desvanece, claves, hora = "ocaso" }) => {
  const f = useF();
  const l = loc(s0);
  const P = GRANJA_PISO;
  const av = caminan ? interpolate(f, [0, 300], [0, 90]) : 0;
  const ve = desvanece === undefined ? 1 : interpolate(f, [desvanece, desvanece + 30], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const susto = { tronco: 8, hD: 40, cD: 60, hI: -30, cI: 40 };
  const fila = [
    { look: PRIYA, x: 2480 }, { look: GUS, x: 2580 }, { look: ROSA, x: 2690 }, { look: NAN, x: 2790 }, { look: BEN, x: 2900, nino: true },
    { look: DEV, x: 3010 }, { look: LILY, x: 3120, nino: true }, { look: THEO_INV, x: 3250 }, { look: JUNE, x: 3380 }, { look: MARCUS_VERANO, x: 3520, horq: true },
  ];
  return (
    <Escena Set={Granja} pal={PAL} setProps={{ hora, estacion: "verano", crec: 1, humo: 0.4 }} seed={404} mano={2}
      claves={claves ?? [mira(0, 3180, 600, 0.88), mira(Math.max(1, l(s0 + 6)), 3210, 610, 0.91)]}
      medio={<>
        <GranjaLejos x={2380} y={P - 60} s={0.45} />
        {ve > 0 && <g opacity={ve}>
          <Halo x={3100} y={460} r={800} color="#ffb04a" fuerza={0.45} />
          <Papa x={3180} y={P - 260} s={15} rot={-8} color="#c0813e" />
          {[[-260, -120, 22], [-120, -230, 16], [60, -160, 26], [210, -60, 18], [-30, 20, 14], [300, -220, 15], [-330, 40, 17], [140, 60, 20]].map(([dx, dy, r], i) => <ellipse key={i} cx={3180 + dx} cy={P - 260 + dy} rx={r} ry={r * 0.7} fill="#8a5426" opacity={0.55} />)}
        </g>}
        {fila.map((p, i) => <A key={i} look={p.look} escala={(p.nino ? NINO : 1) * 1.05} seed={90 + i} luz={{ lado: -1, color: "#ffb04a", fuerza: 0.9 }}
          ruta={[{ f: 0, x: p.x + av, y: P + 80 }, { f: 300, x: p.x + av + 90, y: P + 80 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: susto }]}
          caras={[{ f: 0, v: "miedo" }]} miradas={[{ f: 0, v: { x: 0.7, y: -0.1 } }]} enManoD={p.horq ? <Horquilla /> : undefined} />)}
        <Ore x={2380 + av} y={P + 80} s={1.05} dir={1} f={f} paso={caminan ? f : 0} cola={1} ladra={1} />
        {ve > 0 && <g opacity={ve}><Helada4 x0={3640} piso={P + 40} f={f} /></g>}
      </>}
    />
  );
};

export const TarjetaSiguiente: React.FC<{ ep: number; s0: number }> = ({ ep, s0 }) => {
  const l = loc(s0);
  return (
    <>
      <PortadaLc04 s0={s0} />
      <Pildora texto={`NEXT · EP. ${ep}`} x={960} y={90} desde={l(s0 + 0.2)} color="#ffcf6e" tam={44} />
      <Rotulo texto="Could 10 people grow enough food?" x={960} y={990} centro desde={l(s0 + 0.6)} color="#f6ecd2" tam={58} rot={0} brillo={false} />
    </>
  );
};

export const PortadaLc05: React.FC<{ s0: number }> = ({ s0 }) => {
  const f = useF();
  const l = loc(s0);
  return (
    <Escena Set={PasilloFarmacia} pal={PAL} setProps={{ llenado: 0.25, fondoLuz: 0.5, luzFarol: { x: 560, y: 760, on: 1 } }} seed={505}
      claves={[mira(0, 960, 560, 1.0), mira(Math.max(1, l(s0 + 5)), 980, 560, 1.06)]}
      medio={<>
        <A look={THEO_INV} escala={0.5} ruta={[{ f: 0, x: 540, y: 860 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "duda" }]} enManoI={<FarolMano f={f} s={1.4} />} />
        <A look={JUNE_MOCHI} escala={2.2} ruta={[{ f: 0, x: 1120, y: 1500 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 150, cD: 120 } }]} caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: { x: 0.5, y: -0.3 } }]}
          luz={{ lado: 1, color: "#ffcf6e", fuerza: 1 }} enManoD={<g><Halo x={0} y={-30} r={240} color="#ffcf6e" fuerza={0.8} /><Vial s={1.4} brillo={1} /></g>} />
      </>}
    />
  );
};
export const TarjetaEp5: React.FC<{ s0: number }> = ({ s0 }) => {
  const l = loc(s0);
  return (
    <>
      <PortadaLc05 s0={s0} />
      <Pildora texto="NEXT · EP. 5" x={960} y={90} desde={l(s0 + 0.2)} color="#ffcf6e" tam={44} />
      <Rotulo texto="Could 10 people rebuild medicine?" x={960} y={990} centro desde={l(s0 + 0.6)} color="#f6ecd2" tam={56} rot={0} brillo={false} />
    </>
  );
};
