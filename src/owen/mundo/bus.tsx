// EL BUS 9 (CTA, ruta 9 Ashland). Dos piezas:
// - <Bus9>: el bus por fuera, de perfil (blanco con franjas azul y roja, cartel LED ámbar «9 ASHLAND», puertas que se
//   abren, kneeling, ruedas que giran, Owen al volante). Mide ~2.100 px a esc 1.
// - <BusInterior>: set de 3 capas (patrón cocina.tsx). Corte lateral mirando la pared de las PUERTAS (lado de la vereda):
//   adelante a la IZQUIERDA. Por las ventanas pasa Ashland (capa lejos) según `avance(f)`.
//   Piso BUS_PISO. Puntos en BUS_PUNTOS. Owen al volante: x = BUS_PUNTOS.chofer, asiento 58, IK con `alVolante`.
import React from "react";
import { interpolate, random } from "remotion";
import { Halo, Charco } from "../../anikit/luz";
import { F_HUD } from "../../anikit/pantalla";
import { SetProps, acl, osc, mezclar } from "../../anikit/sets/comun";
import { Pose, alcanzar, huesosDe } from "../../anikit/personaje";
import { Hora, LUCES } from "./hora";
import { ANCHO_LOTE, Auto, FarolChi, Lote, ParadaCTA, SkylineChi } from "./calle";

export const BUS_PISO = 900;
export const ASIENTO_X = (fila: number) => 820 + (fila - 1) * 236 + (fila >= 6 ? 236 : 0); // la puerta de atrás corta la fila 6
export const BUS_PUNTOS = { chofer: 250, volante: 150, volanteY: 175, espejo: 175, validador: 392, puertaF: 535, puertaT: 2120, pasillo: 700, fondo: 3500, asiento: 58 };
export const BUS_TECHO = BUS_PISO - 470;

// ---------- marcha del bus: claves de velocidad (px/cuadro) → distancia recorrida ----------
export const hacerMarcha = (claves: { f: number; v: number }[], fin = 30000) => {
  const n = Math.min(fin, claves[claves.length - 1].f + 3000);
  const acc = new Float64Array(n + 2);
  let d = 0;
  for (let f = 0; f <= n; f++) {
    let v = claves[0].v;
    for (let i = 1; i < claves.length; i++) {
      const a = claves[i - 1], b = claves[i];
      if (f >= a.f && f < b.f) { const u = (f - a.f) / Math.max(1, b.f - a.f); v = a.v + (b.v - a.v) * (u * u * (3 - 2 * u)); break; }
      if (f >= b.f) v = b.v;
    }
    acc[f] = d; d += v;
  }
  return (f: number) => { const k = Math.max(0, Math.min(n, Math.floor(f))); return acc[k] + (acc[Math.min(n, k + 1)] - acc[k]) * (f - k); };
};
// marcha típica: anda a `v` y frena en cada tramo [desde, hasta] (frenado/arranque de ~20 cuadros)
export const marchaParadas = (paradas: [number, number][], v = 16, total = 30000) => {
  const cl: { f: number; v: number }[] = [{ f: 0, v }];
  paradas.forEach(([a, b]) => { cl.push({ f: a - 22, v }, { f: a, v: 0 }, { f: b, v: 0 }, { f: b + 24, v }); });
  cl.push({ f: total, v });
  return hacerMarcha(cl.sort((p, q) => p.f - q.f), total);
};

// ---------- IK: las dos manos de Owen al volante ----------
const H = huesosDe("palo");
export const alVolante = (actorX: number, esc: number, giro: (f: number) => number = () => 0, manos: "ambas" | "D" | "I" = "ambas") => (p: Pose, f: number): Pose => {
  const dir = -1; // mira hacia adelante (izquierda)
  const cx = BUS_PUNTOS.volante, cy = BUS_PISO - BUS_PUNTOS.volanteY;
  const a = giro(f);
  const pt = (ang: number) => ({ x: ((cx + Math.cos(ang) * 46 - actorX) / (esc * dir)), y: (cy + Math.sin(ang) * 46 - BUS_PISO) / esc });
  const d = alcanzar(p, "D", pt(-2.4 + a), BUS_PUNTOS.asiento, H);
  const i = alcanzar(p, "I", pt(-0.8 + a), BUS_PUNTOS.asiento, H);
  return manos === "ambas" ? { ...p, ...d, ...i } : manos === "D" ? { ...p, ...d } : { ...p, ...i };
};

// ---------- el bus por fuera ----------
export const Bus9: React.FC<{ x: number; y: number; esc?: number; dir?: 1 | -1; puertas?: number; kneel?: number; rueda?: number; hora?: Hora; chofer?: boolean; gente?: number; seed?: number }> = ({ x, y, esc = 1, dir = -1, puertas = 0, kneel = 0, rueda = 0, hora = "dia", chofer = true, gente = 0.5, seed = 0 }) => {
  const L = LUCES[hora];
  const noche = L.ventanas > 0.5;
  const vid = noche ? "#3a3a4a" : "#2a3a4a";
  const luzVid = noche ? "#e8f4ff" : "#9ec6dc";
  // dibujado mirando a la DERECHA (frente a +x) y se espeja con dir
  return (
    <g transform={`translate(${x},${y}) scale(${dir * esc},${esc})`}>
      <ellipse cx={0} cy={6} rx={1080} ry={22} fill="#000" opacity={0.25} />
      <g transform={`translate(0,${kneel})`}>
        <rect x={-1040} y={-560} width={2080} height={500} rx={46} fill="#f2f2ee" />
        <rect x={-1040} y={-130} width={2080} height={70} rx={10} fill="#e4e4e0" />
        <rect x={-1040} y={-178} width={2080} height={22} fill="#1f5fa8" />
        <rect x={-1040} y={-152} width={2080} height={10} fill="#d23a3a" />
        <rect x={-1000} y={-578} width={1500} height={30} rx={12} fill="#dcdcd6" />
        {/* ventanas laterales con pasajeros en silueta */}
        {Array.from({ length: 8 }).map((_, i) => {
          const vx = -960 + i * 205;
          if (i === 4) return null; // puerta de atrás
          return (
            <g key={i}>
              <rect x={vx} y={-470} width={185} height={220} rx={14} fill={vid} />
              <rect x={vx} y={-470} width={185} height={220} rx={14} fill={luzVid} opacity={noche ? 0.55 : 0.25} />
              {random(`bp${seed}${i}`) < gente && <g opacity={0.75}><circle cx={vx + 70 + random(`bpx${seed}${i}`) * 40} cy={-350} r={34} fill="#141418" /><rect x={vx + 40 + random(`bpx${seed}${i}`) * 40} y={-318} width={64} height={70} rx={20} fill="#141418" /></g>}
              <path d={`M${vx + 20},${-460} l40,0 l-60,80 z`} fill="#fff" opacity={0.12} />
            </g>
          );
        })}
        {/* puerta de atrás (doble hoja que se abre hacia los costados) */}
        <rect x={-140} y={-500} width={190} height={440} fill={osc(vid, 0.8)} />
        {[0, 1].map((k) => <rect key={k} x={-140 + k * 95 + (k ? 1 : -1) * puertas * 70} y={-496} width={92} height={434} rx={6} fill={vid} stroke="#c9c9c3" strokeWidth={6} opacity={0.95} />)}
        {/* puerta delantera */}
        <rect x={700} y={-500} width={180} height={440} fill={osc(vid, 0.75)} />
        {[0, 1].map((k) => <rect key={k} x={700 + k * 90 + (k ? 1 : -1) * puertas * 66} y={-496} width={88} height={434} rx={6} fill={vid} stroke="#c9c9c3" strokeWidth={6} opacity={0.95} />)}
        {puertas > 0.3 && <Halo x={790} y={-260} r={200} color={L.luz} fuerza={0.35 * puertas} />}
        {/* frente: parabrisas, chofer y cartel LED */}
        <path d="M900,-500 L1010,-500 Q1050,-500 1052,-440 L1060,-140 L900,-140 Z" fill={vid} />
        <path d="M900,-500 L1010,-500 Q1050,-500 1052,-440 L1060,-140 L900,-140 Z" fill={luzVid} opacity={0.3} />
        {chofer && <g><circle cx={960} cy={-330} r={36} fill="#141418" /><path d="M920,-352 q40,-36 82,0 l14,4 l-96,0 z" fill="#22305a" /><rect x={954} y={-370} width={12} height={8} fill="#e8c24a" /><rect x={930} y={-296} width={70} height={110} rx={22} fill="#22305a" /></g>}
        <rect x={880} y={-548} width={170} height={40} rx={6} fill="#141414" />
        <text x={965} y={-519} fontFamily={F_HUD} fontWeight={600} fontSize={26} fill="#ffb02e" textAnchor="middle">9 ASHLAND</text>
        <rect x={-960} y={-548} width={300} height={40} rx={6} fill="#141414" />
        <text x={-810} y={-519} fontFamily={F_HUD} fontWeight={600} fontSize={24} fill="#ffb02e" textAnchor="middle">9  ASHLAND</text>
        <text x={-500} y={-200} fontFamily={F_HUD} fontWeight={600} fontSize={30} fill="#1f5fa8">CTA</text>
        <text x={300} y={-200} fontFamily={F_HUD} fontWeight={500} fontSize={22} fill="#7a7a80">{1800 + (seed % 90)}</text>
        {/* faros y luces */}
        <rect x={1040} y={-120} width={20} height={34} rx={6} fill="#fff6d0" />
        {noche && <Halo x={1090} y={-100} r={220} color="#fff6d0" fuerza={0.7} />}
        <rect x={-1046} y={-130} width={14} height={40} rx={5} fill="#e23a2e" />
        {/* portabicis */}
        <path d="M1062,-90 h40 v-60 h-40" stroke="#5a5f66" strokeWidth={8} fill="none" />
      </g>
      {[-720, 640].map((cx) => (
        <g key={cx}>
          <path d={`M${cx - 110},${-60 + kneel} a110,110 0 0 1 220,0 z`} fill="#26262a" />
          <circle cx={cx} cy={0} r={78} fill="#161618" />
          <circle cx={cx} cy={0} r={40} fill="#b9bec4" />
          {[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={cx + Math.cos(((a + rueda) * Math.PI) / 180) * 24} cy={Math.sin(((a + rueda) * Math.PI) / 180) * 24} r={5} fill="#5a5f66" />)}
        </g>
      ))}
    </g>
  );
};

// ---------- el exterior que pasa por las ventanas (capa lejos del interior) ----------
const Exterior: React.FC<{ av: number; hora: Hora; f: number; paradas?: { a: number; num?: number }[] }> = ({ av, hora, f, paradas = [] }) => {
  const L = LUCES[hora];
  const esc = 0.62, w = ANCHO_LOTE * esc, piso = 860;
  const n0 = Math.floor((-2400 - av) / w), n1 = Math.ceil((4200 - av) / w);
  const lotes = [];
  for (let n = n0; n <= n1; n++) lotes.push(n);
  return (
    <g>
      <defs><linearGradient id="bxcielo" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={L.cielo[0]} /><stop offset="0.6" stopColor={L.cielo[1]} /><stop offset="1" stopColor={L.cielo[2]} /></linearGradient></defs>
      <rect x={-3000} y={-600} width={9000} height={1800} fill="url(#bxcielo)" />
      <Halo x={2200} y={L.solY} r={380} color={L.sol} fuerza={0.6} />
      <g transform={`translate(${(av * 0.15) % 2400 - 1200},0)`}><SkylineChi x0={-600} piso={piso - 120} hora={hora} esc={0.7} /><SkylineChi x0={1800} piso={piso - 120} hora={hora} esc={0.6} /></g>
      <g transform={`translate(${av},0)`}>
        {lotes.map((n) => <Lote key={n} n={n} piso={piso} hora={hora} f={f} esc={esc} />)}
        {lotes.filter((n) => n % 3 === 0).map((n) => <FarolChi key={`fa${n}`} x={n * w + 40} piso={piso + 40} hora={hora} esc={esc} />)}
      </g>
      {paradas.map((p, i) => <g key={i} transform={`translate(${BUS_PUNTOS.puertaF + 60 + (av - p.a)},0)`}><ParadaCTA x={0} piso={piso + 40} num={p.num} esc={0.8} refugio /></g>)}
      <rect x={-3000} y={piso} width={9000} height={60} fill={mezclar("#9a948a", L.cielo[1], 0.2)} />
      <rect x={-3000} y={piso + 40} width={9000} height={400} fill={L.calle} />
    </g>
  );
};

type BusProps = SetProps & { hora?: Hora; avance?: (f: number) => number; puertaF?: (f: number) => number; puertaT?: (f: number) => number; timbre?: (f: number) => boolean; paradas?: { a: number; num?: number }[]; gente?: boolean };

export const BusInterior: React.FC<BusProps> = ({ capa, f, hora = "dia", avance = () => 0, puertaF = () => 0, puertaT = () => 0, timbre = () => false, paradas }) => {
  const P = BUS_PISO, T = BUS_TECHO;
  const L = LUCES[hora];
  const av = avance(f);
  const noche = L.ventanas > 0.5;
  if (capa === "lejos") return <Exterior av={av} hora={hora} f={f} paradas={paradas} />;
  if (capa === "frente") {
    return (
      <g>
        {/* reflejo del tubo sobre el vidrio del frente y un caño en primer término al fondo del bus */}
        <rect x={2950} y={T - 200} width={20} height={P - T + 400} rx={10} fill="#e8b830" />
        <rect x={2953} y={T - 200} width={5} height={P - T + 400} fill="#fff3b0" opacity={0.6} />
      </g>
    );
  }
  const pared = noche ? "#c9d2d8" : "#dfe5e8";
  const vidrio = (x: number, y: number, w: number, h: number) => `M${x},${y} h${w} v${h} h${-w} Z`;
  const ventanas: string[] = [];
  for (let i = 0; i < 10; i++) { const vx = 700 + i * 280; if (vx > 1990 && vx < 2380) continue; ventanas.push(vidrio(vx, T + 110, 250, 220)); }
  const pf = puertaF(f), pt = puertaT(f);
  return (
    <g>
      {/* pared con huecos (ventanas, parabrisas, puertas): por los huecos se ve la capa lejos */}
      <defs>
        <clipPath id="bipared"><path clipRule="evenodd" d={`M-800,-600 H4400 V${P + 400} H-800 Z M-120,${T + 20} H112 V${P - 120} H-120 Z ${ventanas.join(" ")} M445,${T + 40} H${625} V${P} H445 Z M2030,${T + 40} H2210 V${P} H2030 Z`} /></clipPath>
        <linearGradient id="bitecho" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#9aa4ac" /><stop offset="1" stopColor={pared} /></linearGradient>
      </defs>
      <g clipPath="url(#bipared)">
        <rect x={-800} y={-600} width={5200} height={P + 1000} fill={pared} />
        <rect x={-800} y={-600} width={5200} height={T + 600} fill="url(#bitecho)" />
        <rect x={-800} y={T + 340} width={5200} height={P - T - 340} fill={osc(pared, 0.82)} />
        <rect x={-800} y={T + 336} width={5200} height={8} fill="#1f5fa8" />
        <Halo x={1600} y={T + 120} r={1500} color="#f2fffa" fuerza={noche ? 0.35 : 0.15} />
      </g>
      {/* marcos de ventanas y parantes */}
      {ventanas.map((_, i) => null)}
      {Array.from({ length: 11 }).map((_, i) => { const vx = 690 + i * 280; return vx > 1990 && vx < 2380 ? null : <rect key={i} x={vx} y={T + 100} width={12} height={240} fill="#9aa2a8" />; })}
      <rect x={680} y={T + 96} width={2900} height={12} fill="#a9b0b5" />
      <rect x={680} y={T + 330} width={2900} height={14} fill="#a9b0b5" />
      {/* carteles de publicidad sobre las ventanas */}
      {Array.from({ length: 9 }).map((_, i) => {
        const ax = 700 + i * 320;
        const c = ["#2f6b4a", "#c23a2e", "#1f5fa8", "#e7b240", "#6a3a8a"][i % 5];
        const t = ["RIDE THE 9", "VENTRA", "FLU SHOTS $0", "LEARN ENGLISH", "SEE SOMETHING SAY SOMETHING", "CITY COLLEGES", "INJURED? CALL", "DIVVY", "PRIORITY SEATING"][i];
        return <g key={i}><rect x={ax} y={T + 30} width={290} height={56} rx={4} fill={c} /><text x={ax + 145} y={T + 66} fontFamily={F_HUD} fontWeight={600} fontSize={i === 4 ? 13 : 20} fill="#fff" textAnchor="middle">{t}</text></g>;
      })}
      {/* techo: tubos fluorescentes y pasamanos */}
      <rect x={-200} y={T - 30} width={4000} height={34} fill="#8f989f" />
      {Array.from({ length: 7 }).map((_, i) => <g key={i}><rect x={160 + i * 520} y={T - 2} width={360} height={14} rx={7} fill="#fbfff8" /><Halo x={340 + i * 520} y={T + 30} r={300} color="#eafff6" fuerza={noche ? 0.55 : 0.25} /></g>)}
      <rect x={640} y={T + 16} width={2960} height={9} rx={4} fill="#e8b830" />
      {Array.from({ length: 14 }).map((_, i) => <g key={i}><path d={`M${700 + i * 210},${T + 20} v30`} stroke="#3a3a3a" strokeWidth={4} /><ellipse cx={700 + i * 210} cy={T + 60} rx={14} ry={18} fill="none" stroke="#e8b830" strokeWidth={6} /></g>)}
      {/* cartel STOP REQUESTED */}
      <rect x={720} y={T - 24} width={250} height={34} rx={6} fill="#141414" />
      <text x={845} y={T - 1} fontFamily={F_HUD} fontWeight={600} fontSize={20} fill={timbre(f) ? "#ff3a2e" : "#3a2020"} textAnchor="middle">STOP REQUESTED</text>
      {timbre(f) && <Halo x={845} y={T - 8} r={160} color="#ff3a2e" fuerza={0.35} />}
      {/* puerta delantera: dos hojas de vidrio que se pliegan */}
      <rect x={440} y={T + 34} width={190} height={P - T - 34} fill="none" stroke="#7a8288" strokeWidth={10} />
      {[0, 1].map((k) => <rect key={k} x={445 + k * 90 + (k ? 1 : -1) * pf * 70} y={T + 40} width={88 * (1 - pf * 0.55)} height={P - T - 44} rx={4} fill="#b8d8e6" opacity={0.35} stroke="#8a9298" strokeWidth={6} />)}
      <rect x={440} y={P - 18} width={190} height={18} fill="#e8b830" />
      {/* puerta de atrás */}
      <rect x={2025} y={T + 34} width={190} height={P - T - 34} fill="none" stroke="#7a8288" strokeWidth={10} />
      {[0, 1].map((k) => <rect key={k} x={2030 + k * 90 + (k ? 1 : -1) * pt * 70} y={T + 40} width={88 * (1 - pt * 0.55)} height={P - T - 44} rx={4} fill="#b8d8e6" opacity={0.35} stroke="#8a9298" strokeWidth={6} />)}
      <rect x={2025} y={P - 18} width={190} height={18} fill="#e8b830" />
      {/* frente: parabrisas, tablero, volante, espejo, validador Ventra */}
      <rect x={-130} y={T + 10} width={250} height={P - T - 120} fill="none" stroke="#5a6066" strokeWidth={16} />
      <rect x={-140} y={P - 150} width={330} height={150} rx={14} fill="#2a2e34" />
      <rect x={-60} y={P - 140} width={150} height={40} rx={8} fill="#141418" />
      <text x={15} y={P - 112} fontFamily={F_HUD} fontWeight={600} fontSize={20} fill="#7dff6a" textAnchor="middle">9 · N</text>
      <rect x={BUS_PUNTOS.espejo - 70} y={T + 26} width={140} height={44} rx={18} fill="#2a2e34" />
      <rect x={BUS_PUNTOS.espejo - 62} y={T + 32} width={124} height={32} rx={14} fill="#a9c8d8" />
      <rect x={BUS_PUNTOS.espejo - 4} y={T + 4} width={8} height={24} fill="#2a2e34" />
      {/* asiento del chofer */}
      <g>
        <rect x={BUS_PUNTOS.chofer - 60} y={P - 66} width={130} height={18} rx={8} fill="#2a2e34" />
        <rect x={BUS_PUNTOS.chofer + 52} y={P - 250} width={24} height={200} rx={10} fill="#2a2e34" />
        <rect x={BUS_PUNTOS.chofer - 10} y={P - 50} width={20} height={50} fill="#4a4e54" />
      </g>
      {/* validador (farebox) */}
      <g>
        <rect x={BUS_PUNTOS.validador - 34} y={P - 240} width={68} height={240} rx={8} fill="#3a3f46" />
        <rect x={BUS_PUNTOS.validador - 26} y={P - 230} width={52} height={60} rx={6} fill="#1d1f24" />
        <circle cx={BUS_PUNTOS.validador} cy={P - 200} r={18} fill="none" stroke="#7dff6a" strokeWidth={4} opacity={0.8} />
        <text x={BUS_PUNTOS.validador} y={P - 150} fontFamily={F_HUD} fontWeight={600} fontSize={12} fill="#e9e3d6" textAnchor="middle">VENTRA</text>
      </g>
      {/* asientos de la pared (perfil, mirando adelante) + caños */}
      {Array.from({ length: 11 }).map((_, i) => {
        const x = ASIENTO_X(i + 1);
        if (x > 3450) return null;
        return (
          <g key={i}>
            <rect x={x - 46} y={P - 66} width={108} height={22} rx={10} fill="#2f4f8a" />
            <rect x={x + 50} y={P - 230} width={26} height={180} rx={12} fill="#2f4f8a" />
            <rect x={x + 54} y={P - 226} width={8} height={170} rx={4} fill="#4a6fb0" />
            <rect x={x - 6} y={P - 46} width={12} height={46} fill="#5a6066" />
            <rect x={x + 82} y={T + 20} width={10} height={P - T - 20} fill="#e8b830" />
          </g>
        );
      })}
      {/* piso con banda antideslizante */}
      <rect x={-800} y={P} width={5200} height={500} fill="#3a3d44" />
      <rect x={-800} y={P} width={5200} height={10} fill="#55595f" />
      {Array.from({ length: 70 }).map((_, i) => <rect key={i} x={-700 + i * 70} y={P + 30} width={36} height={4} fill="#4a4e55" />)}
      <Charco x={1700} y={P + 40} rx={1700} ry={60} color="#eafff6" fuerza={noche ? 0.25 : 0.12} />
      {/* luz de la calle que entra por las ventanas (barras que corren con el avance) */}
      {!noche && Array.from({ length: 5 }).map((_, i) => {
        const bx = ((i * 900 + av * 0.9) % 4500) - 500;
        return <path key={i} d={`M${bx},${T + 110} l220,0 l260,${P - T - 110} l-240,0 Z`} fill={L.sol} opacity={0.07} />;
      })}
    </g>
  );
};

// ---------- volante (encima del cuerpo de Owen, debajo de las manos no importa a esta escala) ----------
export const Volante: React.FC<{ giro?: number }> = ({ giro = 0 }) => {
  const cx = BUS_PUNTOS.volante, cy = BUS_PISO - BUS_PUNTOS.volanteY;
  return (
    <g transform={`translate(${cx},${cy}) rotate(${giro * 30})`}>
      <rect x={10} y={-8} width={150} height={16} rx={8} fill="#2a2e34" transform="rotate(38)" />
      <ellipse cx={0} cy={0} rx={20} ry={56} fill="none" stroke="#1d1f24" strokeWidth={13} transform="rotate(-24)" />
      <rect x={-4} y={-6} width={60} height={12} rx={6} fill="#1d1f24" transform="rotate(62)" />
    </g>
  );
};

export const kneelEn = (f: number, a: number, b: number) => interpolate(f, [a, a + 14, b - 10, b], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
export { Auto };
