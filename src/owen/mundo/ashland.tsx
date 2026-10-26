// ASHLAND AVENUE (exterior): la avenida de la ruta 9, de perfil. Vereda en ASH_PISO; el bus anda por el carril
// (ruedas en ASH_CARRIL). Lotes procedurales (calle.tsx) en todo x; se dibuja sólo cerca de `centro(f)`.
// setProps: hora, centro (f → x de cámara), paradas [{x, num}], cafe (x del café de Lena en la 18th), autos.
import React from "react";
import { random } from "remotion";
import { Halo, Polvo } from "../../anikit/luz";
import { F_HUD, F_MANO } from "../../anikit/pantalla";
import { Planta, SetProps, acl, osc, mezclar } from "../../anikit/sets/comun";
import { Hora, LUCES } from "./hora";
import { ANCHO_LOTE, Auto, FarolChi, Lote, ParadaCTA, SkylineChi } from "./calle";

export const ASH_PISO = 900;
export const ASH_CARRIL = 1200; // ruedas del bus (carril de la derecha); autos que pasan en P+540, estacionados en P+175

// Café de la esquina de Ashland y la 18th (Lena Ortiz): vidriera grande para ver adentro, barra y máquina de espresso
export const Cafe18: React.FC<{ x: number; piso: number; hora: Hora; f: number }> = ({ x, piso, hora, f }) => {
  const L = LUCES[hora];
  const w = 1100;
  return (
    <g>
      <rect x={x} y={piso - 900} width={w} height={906} fill="#2f4a46" />
      <rect x={x - 10} y={piso - 916} width={w + 20} height={22} fill="#243a37" />
      {[0, 1, 2].map((k) => <rect key={k} x={x + 90 + k * 340} y={piso - 840} width={180} height={170} fill={mezclar(L.luz, "#6a8a9a", 0.5)} stroke="#e7c08a" strokeWidth={10} />)}
      <rect x={x + 40} y={piso - 620} width={w - 80} height={92} rx={8} fill="#1d302d" />
      <text x={x + w / 2} y={piso - 556} fontFamily={F_HUD} fontWeight={600} fontSize={58} letterSpacing={6} fill="#ffe39a" textAnchor="middle">CAFÉ 18</text>
      {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M${x + 40 + i * 64},${piso - 520} h64 l6,70 q-38,22 -76,0 Z`} fill={i % 2 ? "#f3ece0" : "#2f6b4a"} />)}
      {/* interior visible: pared cálida, estantes, barra y máquina */}
      <rect x={x + 40} y={piso - 450} width={w - 80} height={450} fill="#f2d7a6" />
      <Halo x={x + w / 2} y={piso - 260} r={600} color={L.luz} fuerza={0.6} />
      {[0, 1].map((r) => (
        <g key={r}>
          <rect x={x + 90} y={piso - 400 + r * 80} width={500} height={8} fill="#8a5a36" />
          {Array.from({ length: 10 }).map((_, k) => <rect key={k} x={x + 100 + k * 48} y={piso - 432 + r * 80} width={30} height={32} rx={4} fill={["#f2efe8", "#c94f3a", "#5b8fd6", "#e7b240"][(k + r) % 4]} />)}
        </g>
      ))}
      <rect x={x + 700} y={piso - 420} width={260} height={110} rx={8} fill="#1d1d24" />
      {["LATTE 4.25", "DRIP 2.50", "HORCHATA 4"].map((t, i) => <text key={i} x={x + 720} y={piso - 385 + i * 30} fontFamily={F_MANO} fontSize={26} fill="#fff">{t}</text>)}
      <rect x={x + 120} y={piso - 250} width={240} height={110} rx={10} fill="#c0c6cc" />
      <rect x={x + 140} y={piso - 236} width={200} height={20} fill="#8a9096" />
      {[0, 1].map((k) => <path key={k} d={`M${x + 200 + k * 80},${piso - 262} q12,-26 0,-50 q-12,-24 4,-46`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.3 + 0.2 * Math.sin(f / 9 + k)} />)}
      {/* barra (los personajes se paran detrás o delante) */}
      <rect x={x + 60} y={piso - 150} width={w - 120} height={150} fill="#6a4630" />
      <rect x={x + 50} y={piso - 160} width={w - 100} height={18} rx={4} fill="#e9dcc4" />
      <rect x={x + 40} y={piso - 450} width={w - 80} height={450} fill="none" stroke="#1d302d" strokeWidth={14} />
      <rect x={x + w / 2 - 6} y={piso - 450} width={12} height={300} fill="#1d302d" opacity={0.6} />
      <Planta x={x - 70} y={piso} s={1} f={f} seed={8} />
      <Planta x={x + w + 70} y={piso} s={0.9} f={f} seed={9} />
    </g>
  );
};

type AshProps = SetProps & { hora?: Hora; centro?: (f: number) => number; paradas?: { x: number; num?: number; refugio?: boolean }[]; cafe?: number; autos?: number; nieve?: boolean };

export const Ashland: React.FC<AshProps> = ({ capa, f, hora = "dia", centro = () => 960, paradas = [], cafe, autos = 6 }) => {
  const L = LUCES[hora];
  const P = ASH_PISO;
  const cx = centro(f);
  if (capa === "lejos") {
    return (
      <g>
        <defs><linearGradient id="ashcielo" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={L.cielo[0]} /><stop offset="0.6" stopColor={L.cielo[1]} /><stop offset="1" stopColor={L.cielo[2]} /></linearGradient></defs>
        <rect x={cx * 0.25 - 4000} y={-1400} width={8000} height={3000} fill="url(#ashcielo)" />
        <Halo x={cx * 0.25 + 900} y={L.solY} r={520} color={L.sol} fuerza={0.75} />
        <circle cx={cx * 0.25 + 900} cy={L.solY} r={hora === "noche" ? 44 : 70} fill={acl(L.sol, 0.5)} />
        {[-1, 0, 1].map((k) => <SkylineChi key={k} x0={Math.floor(cx * 0.25 / 2200) * 2200 + k * 2200 - 400} piso={P - 80} hora={hora} esc={0.85} />)}
        {Array.from({ length: 6 }).map((_, i) => <ellipse key={i} cx={((i * 830 + f * 0.4) % 5000) + cx * 0.25 - 2400} cy={120 + (i % 3) * 70} rx={170} ry={24} fill="#fff" opacity={hora === "noche" ? 0.08 : 0.4} />)}
      </g>
    );
  }
  if (capa === "frente") {
    const n0 = Math.floor((cx - 2600) / 1500), n1 = Math.ceil((cx + 2600) / 1500);
    const r = [];
    for (let n = n0; n <= n1; n++) r.push(n);
    return <g>{r.map((n) => <FarolChi key={n} x={n * 1500 + 300} piso={P + 420} hora={hora} esc={1.15} />)}{L.ventanas < 0.3 && <Polvo x={cx - 1200} y={200} w={2400} h={700} n={24} f={f} seed={4} />}</g>;
  }
  const w = ANCHO_LOTE;
  const n0 = Math.floor((cx - 2400) / w), n1 = Math.ceil((cx + 2400) / w);
  const lotes = [];
  for (let n = n0; n <= n1; n++) if (cafe === undefined || n * w + w < cafe - 20 || n * w > cafe + 1120) lotes.push(n);
  return (
    <g>
      {lotes.map((n) => <Lote key={n} n={n} piso={P} hora={hora} f={f} />)}
      {cafe !== undefined && Math.abs(cafe - cx) < 3200 && <Cafe18 x={cafe} piso={P} hora={hora} f={f} />}
      {/* vereda, cordón y calle */}
      <rect x={cx - 3000} y={P} width={6000} height={80} fill={mezclar("#b3aca0", L.cielo[1], 0.15)} />
      {Array.from({ length: 50 }).map((_, i) => { const bx = Math.floor((cx - 3000) / 140) * 140 + i * 140; return <rect key={i} x={bx} y={P} width={3} height={80} fill="#8f897e" />; })}
      <rect x={cx - 3000} y={P + 76} width={6000} height={14} fill="#d9d3c7" />
      <rect x={cx - 3000} y={P + 90} width={6000} height={600} fill={L.calle} />
      {Array.from({ length: 30 }).map((_, i) => { const bx = Math.floor((cx - 3000) / 260) * 260 + i * 260; return <rect key={i} x={bx} y={P + 300} width={140} height={10} fill="#e8d45a" opacity={0.75} />; })}
      {lotes.filter((n) => n % 3 === 1).map((n) => <FarolChi key={`f${n}`} x={n * w + 60} piso={P + 40} hora={hora} />)}
      {paradas.filter((p) => Math.abs(p.x - cx) < 3000).map((p, i) => <ParadaCTA key={i} x={p.x} piso={P + 40} num={p.num} refugio={p.refugio} />)}
      {/* autos estacionados y que pasan por el carril de afuera */}
      {Array.from({ length: autos }).map((_, i) => {
        const c = ["#c23a2e", "#2a5a9a", "#e7e2d6", "#3a3f46", "#e7b240", "#2f6b4a"][i % 6];
        const x = ((i * 1170 + f * (9 + (i % 3) * 3)) % 6000) + cx - 3000;
        return <Auto key={i} x={x} y={P + 540} color={c} dir={1} rueda={f * 12} noche={L.farol > 0.5} />;
      })}
      {Array.from({ length: 3 }).map((_, i) => { const x = Math.floor(cx / 2900) * 2900 + i * 2900 - 2400 + random(`ap${i}`) * 400; return <Auto key={`e${i}`} x={x} y={P + 175} color={["#7a8a9a", "#9a3a3a", "#e9e4d8"][i]} dir={-1} />; })}
    </g>
  );
};
