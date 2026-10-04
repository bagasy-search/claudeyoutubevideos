// Fondos v2 — pintados con el Motor3D: perspectiva real, luz direccional con cel shading,
// sombras proyectadas, manchas de luz, bruma por distancia, mugre y temblor de línea.
import React from "react";
import {
  Ambiente, Arbol, Cam, Cara, Caja, CaraInfo, Filtros, H, LINEA, Mugre, Pasto, SombraCaja, V3, Ventanas, W,
  add, alPiso, mix, mul, norm, proyectar, pts, quad, rnd,
} from "./Motor3D";

const ALTO_U = 1.75 / 344; // metros por unidad de Personaje
export const enPiso = (cam: Cam, p: V3) => { const q = proyectar(cam, p); return { x: q.x, y: q.y, s: (cam.f * ALTO_U) / q.z }; };

// Grano + viñeta comunes (encima de todo)
export const Acabado: React.FC<{ vig?: number; id: string; tinte?: string; tinteOp?: number }> = ({ vig = 0.55, id, tinte, tinteOp = 0 }) => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    <defs>
      <radialGradient id={`vg${id}`} cx="50%" cy="48%" r="75%">
        <stop offset="50%" stopColor="#000" stopOpacity={0} />
        <stop offset="100%" stopColor="#140a08" stopOpacity={vig} />
      </radialGradient>
      <filter id={`gr${id}`}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={4} /><feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0.07 0" /></filter>
    </defs>
    {tinte && <rect width={W} height={H} fill={tinte} opacity={tinteOp} style={{ mixBlendMode: "soft-light" }} />}
    <rect width={W} height={H} filter={`url(#gr${id})`} />
    <rect width={W} height={H} fill={`url(#vg${id})`} />
  </svg>
);

/* ═══════════════════════════ 1. CALLE AL ATARDECER ═══════════════════════════ */
export const CAM_CALLE: Cam = { pos: [0, 1.6, 0], yaw: 0.3, pitch: -0.035, f: 1000 };
const AMB_CALLE: Ambiente = {
  luz: norm([0.6, 0.33, 0.75]), calido: "#ffb46b", frio: "#5b4a8a",
  bruma: "#f0b99a", brumaDesde: 14, brumaHasta: 110, sombraCol: "#3b2550", sombraOp: 0.38,
};
const EDIF_IZQ = [
  { z0: 1, z1: 9, h: 9.5, c: "#b8674c", t: "#7e3f2f" }, { z0: 9, z1: 16, h: 7, c: "#d8bb8f", t: "#a88a63" },
  { z0: 16, z1: 25, h: 12, c: "#6f8c7d", t: "#4c665a" }, { z0: 25, z1: 33, h: 8.5, c: "#c98d5b", t: "#9a6539" },
  { z0: 33, z1: 46, h: 14, c: "#a9a29e", t: "#7d7672" }, { z0: 46, z1: 60, h: 10, c: "#b8674c", t: "#7e3f2f" },
  { z0: 60, z1: 80, h: 16, c: "#c7b49a", t: "#957f64" },
];
const EDIF_DER = [
  { z0: 4, z1: 14, h: 8, c: "#7d8fa6", t: "#56677d" }, { z0: 14, z1: 22, h: 11, c: "#c79a6b", t: "#94693f" },
  { z0: 22, z1: 34, h: 7.5, c: "#9c5a4a", t: "#6d3a2f" }, { z0: 34, z1: 48, h: 13, c: "#d7c6a8", t: "#a6937a" },
  { z0: 48, z1: 70, h: 9, c: "#8a9a86", t: "#647361" },
];
const TOLDO = ["#3f7d6b", "#c4473a", "#e1b44c", "#3e5f93", "#7b4d7e", "#c4473a", "#3f7d6b"];

const Fachada: React.FC<{ cam: Cam; c: CaraInfo; e: (typeof EDIF_IZQ)[0]; i: number; lado: 1 | -1 }> = ({ cam, c, e, i, lado }) => {
  if (c.nombre !== (lado === 1 ? "der" : "izq")) {
    if (c.nombre === "frente") return <Ventanas cam={cam} c={c} cols={Math.max(1, Math.floor(c.ancho / 1.6))} filas={Math.floor((c.alto - 3.4) / 2.6)} mx={0.6} my={0.5} vw={0.9} vh={1.3} seed={i * 91} desdeY={3.4} />;
    return null;
  }
  const n = Math.max(1, Math.floor(c.ancho / 1.7));
  const pisoAlto = 3.4;
  const toldo = TOLDO[i % TOLDO.length];
  const P = (u: number, v: number, out = 0): V3 => add(add(add(c.o, mul(c.u, u)), mul(c.v, v)), mul(c.n, out));
  return (
    <g>
      <Mugre cam={cam} c={c} n={30} seed={i * 17} col={mix(e.t, "#000000", 0.3)} />
      {/* cornisa entre planta baja y pisos */}
      <Cara cam={cam} p={[P(0, pisoAlto), P(c.ancho, pisoAlto), P(c.ancho, pisoAlto + 0.25, 0.15), P(0, pisoAlto + 0.25, 0.15)]} fill={mix(e.t, "#ffffff", 0.1)} trazo={1.6} />
      <Ventanas cam={cam} c={c} cols={n} filas={Math.max(1, Math.floor((c.alto - pisoAlto - 0.8) / 2.6))} mx={0.6} my={0.6} vw={0.95} vh={1.35} seed={i * 53} desdeY={pisoAlto} />
      {/* vidriera */}
      <Cara cam={cam} p={quad(c.o, c.u, c.v, 0.5, c.ancho - 0.5, 0.25, 2.5)} fill={mix("#2e4352", c.color, 0.2)} trazo={1.8} />
      {[0.3, 0.55].map((k, j) => <Cara key={j} cam={cam} p={[P(0.7 + k * c.ancho * 0.6, 0.3), P(1.3 + k * c.ancho * 0.6, 0.3), P(2.1 + k * c.ancho * 0.6, 2.4), P(1.5 + k * c.ancho * 0.6, 2.4)]} fill="#d6e6ee" op={0.18} trazo={0} />)}
      <Cara cam={cam} p={quad(c.o, c.u, c.v, c.ancho * 0.45, c.ancho * 0.45 + 1, 0, 2.3)} fill="#5a3a2a" trazo={1.8} />
      {/* toldo inclinado + rayas */}
      <Cara cam={cam} p={[P(0.3, 2.85), P(c.ancho - 0.3, 2.85), P(c.ancho - 0.3, 2.45, 1.1), P(0.3, 2.45, 1.1)]} fill={mix(toldo, "#ffb46b", 0.15)} trazo={1.8} />
      {Array.from({ length: Math.floor(c.ancho / 0.6) }).map((_, k) => k % 2 === 0 && (
        <Cara key={k} cam={cam} p={[P(0.3 + k * 0.6, 2.85), P(0.6 + k * 0.6, 2.85), P(0.6 + k * 0.6, 2.45, 1.1), P(0.3 + k * 0.6, 2.45, 1.1)]} fill="#fff6e8" op={0.35} trazo={0} />
      ))}
      <Cara cam={cam} p={[P(0.3, 2.45, 1.1), P(c.ancho - 0.3, 2.45, 1.1), P(c.ancho - 0.3, 2.2, 1.1), P(0.3, 2.2, 1.1)]} fill={mix(toldo, "#000000", 0.25)} trazo={1.6} />
      {/* cartel (sin texto legible) */}
      {i % 2 === 0 && <Cara cam={cam} p={quad(c.o, c.u, c.v, 1, c.ancho - 1, 2.95, 3.3)} fill={mix("#efe6d2", c.color, 0.2)} trazo={1.4} />}
    </g>
  );
};

export const FondoCalle: React.FC = () => {
  const cam = CAM_CALLE, amb = AMB_CALLE;
  const sol = proyectar(cam, add(cam.pos, mul(amb.luz, 1000)));
  const postes = [6, 18, 30, 44, 60];
  const arboles = [11.5, 27, 40];
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <Filtros id="calle" temblor={1.4} />
      <defs>
        <linearGradient id="cieloC" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8f9fd0" /><stop offset="0.35" stopColor="#c9a7c4" /><stop offset="0.62" stopColor="#f2b9a0" /><stop offset="1" stopColor="#f9d4a0" />
        </linearGradient>
        <radialGradient id="solC" cx={sol.x} cy={sol.y} r={900} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff4d6" stopOpacity={0.95} /><stop offset="0.25" stopColor="#ffd39a" stopOpacity={0.5} /><stop offset="1" stopColor="#ffb07a" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="asfalto" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#4a4650" /><stop offset="1" stopColor="#9a8a8e" /></linearGradient>
      </defs>
      <g filter="url(#manocalle)">
        <rect width={W} height={H} fill="url(#cieloC)" />
        {/* nubes pintadas */}
        {[[300, 170, 1.3], [820, 95, 1], [1480, 230, 0.9], [1150, 140, 0.7]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <path d="M-150,25 Q-140,-20 -80,-12 Q-60,-50 -5,-30 Q40,-60 90,-20 Q150,-25 150,25 Z" fill="#f9d9cc" opacity={0.85} />
            <path d="M-150,25 Q-30,10 150,25 Q60,40 -150,25 Z" fill="#d9979c" opacity={0.6} />
          </g>
        ))}
        {/* skyline lejano */}
        {Array.from({ length: 16 }).map((_, i) => {
          const z = 140 + rnd(i) * 80, x = -10 + i * 3.2, h = 15 + rnd(i + 5) * 30;
          return <polygon key={i} points={pts(cam, [[x, 0, z], [x + 3, 0, z], [x + 3, h, z], [x, h, z]])} fill={mix("#b48aa0", "#f0b99a", 0.45)} />;
        })}
        {/* grúa lejana */}
        <polyline points={pts(cam, [[22, 0, 120], [22, 38, 120], [8, 38, 120], [34, 38, 120]])} fill="none" stroke="#a37d92" strokeWidth={3} />
        <rect width={W} height={H} fill="url(#solC)" />
        {/* piso: calzada + veredas */}
        <Cara cam={cam} p={[[1.8, 0, 0.8], [9.8, 0, 0.8], [9.8, 0, 300], [1.8, 0, 300]]} fill="url(#asfalto)" trazo={0} />
        <Caja cam={cam} amb={amb} x0={-1.5} x1={1.8} y1={0.15} z0={0.5} z1={300} col="#cdb59a" trazo={1.6} />
        <Caja cam={cam} amb={amb} x0={9.8} x1={13} y1={0.15} z0={0.5} z1={300} col="#cdb59a" trazo={1.6} />
        {/* juntas de vereda */}
        {Array.from({ length: 40 }).map((_, i) => <polyline key={i} points={pts(cam, [[-1.5, 0.151, 1.5 + i * 1.6], [1.8, 0.151, 1.5 + i * 1.6]])} stroke="#9d876d" strokeWidth={1.3} />)}
        {Array.from({ length: 30 }).map((_, i) => <polyline key={`d${i}`} points={pts(cam, [[9.8, 0.151, 2 + i * 1.8], [13, 0.151, 2 + i * 1.8]])} stroke="#9d876d" strokeWidth={1.3} />)}
        {/* grietas en asfalto */}
        {Array.from({ length: 14 }).map((_, i) => { const z = 3 + rnd(i) * 30, x = 2.4 + rnd(i * 3) * 6.5; return <polyline key={i} points={pts(cam, [[x, 0.01, z], [x + 0.4, 0.01, z + 0.5], [x + 0.2, 0.01, z + 1.1], [x + 0.7, 0.01, z + 1.6]])} fill="none" stroke="#2d2a30" strokeWidth={1.2} opacity={0.6} />; })}
        {/* líneas de carril */}
        {Array.from({ length: 30 }).map((_, i) => <Cara key={i} cam={cam} p={[[5.72, 0.01, 2 + i * 4], [5.88, 0.01, 2 + i * 4], [5.88, 0.01, 4 + i * 4], [5.72, 0.01, 4 + i * 4]]} fill="#e8c35b" trazo={0} />)}
        {/* senda peatonal */}
        {Array.from({ length: 10 }).map((_, i) => <Cara key={i} cam={cam} p={[[2.1 + i * 0.78, 0.012, 6.5], [2.5 + i * 0.78, 0.012, 6.5], [2.5 + i * 0.78, 0.012, 9], [2.1 + i * 0.78, 0.012, 9]]} fill="#ece6da" op={0.9} trazo={0} />)}
        {/* sombras proyectadas de edificios de la derecha sobre la calle */}
        {EDIF_DER.map((e, i) => <SombraCaja key={i} cam={cam} amb={amb} x0={13} x1={19} y1={e.h} z0={e.z0} z1={e.z1} />)}
        {/* sombras de postes/árboles */}
        {postes.map((z, i) => <polygon key={i} points={pts(cam, [[1.3, 0.16, z], [1.45, 0.16, z], alPiso([1.45, 6, z], amb.luz, 0.16), alPiso([1.3, 6, z], amb.luz, 0.16)])} fill={amb.sombraCol} opacity={0.3} />)}
        {/* edificios */}
        {[...EDIF_DER].reverse().map((e, i) => (
          <Caja key={`r${i}`} cam={cam} amb={amb} x0={13} x1={19} y1={e.h} z0={e.z0} z1={e.z1} col={e.c} techo={e.t}
            deco={(c) => <Fachada cam={cam} c={c} e={e} i={i + 20} lado={-1} />} />
        ))}
        {[...EDIF_IZQ].reverse().map((e, i) => (
          <Caja key={`l${i}`} cam={cam} amb={amb} x0={-8} x1={-1.5} y1={e.h} z0={e.z0} z1={e.z1} col={e.c} techo={e.t}
            deco={(c) => <Fachada cam={cam} c={c} e={e} i={EDIF_IZQ.length - i} lado={1} />} />
        ))}
        {/* cornisas superiores */}
        {EDIF_IZQ.map((e, i) => <Cara key={i} cam={cam} p={[[-1.5, e.h, e.z0], [-1.5, e.h, e.z1], [-1.1, e.h + 0.3, e.z1], [-1.1, e.h + 0.3, e.z0]]} fill={mix(e.t, "#ffb46b", 0.3)} trazo={1.6} />)}
        {/* pasto crecido al pie de las fachadas (nadie corta nada) */}
        <Pasto cam={cam} amb={amb} desde={[-1.35, 0.15, 3]} hasta={[-1.35, 0.15, 40]} n={260} alto={0.55} col="#8a8a3e" seed={3} ancho={0.35} />
        <Pasto cam={cam} amb={amb} desde={[1.75, 0.15, 3]} hasta={[1.75, 0.15, 40]} n={160} alto={0.35} col="#7d8a3a" seed={9} ancho={0.12} />
        <Pasto cam={cam} amb={amb} desde={[9.9, 0.15, 6]} hasta={[9.9, 0.15, 60]} n={120} alto={0.4} col="#7d8a3a" seed={19} ancho={0.15} />
        {/* árboles en la vereda */}
        {[...arboles].reverse().map((z, i) => (
          <g key={i}>
            <Caja cam={cam} amb={amb} x0={0.7} x1={1.5} y0={0.15} y1={0.6} z0={z - 0.4} z1={z + 0.4} col="#8b6a4e" trazo={1.4} />
            <Arbol cam={cam} base={[1.1, 0.6, z]} alto={5.2} radio={1.6} col="#6f8b45" amb={amb} seed={i * 7 + 2} />
          </g>
        ))}
        {/* faroles */}
        {[...postes].reverse().map((z, i) => {
          const b = proyectar(cam, [1.4, 0.15, z]), t = proyectar(cam, [1.4, 6, z]), a = proyectar(cam, [2.4, 6.1, z]);
          const w = Math.max(2, 2600 / b.z / 10);
          return (
            <g key={i}>
              <path d={`M${b.x},${b.y} L${t.x},${t.y} Q${(t.x + a.x) / 2},${t.y - w * 2} ${a.x},${a.y}`} stroke="#2c3236" strokeWidth={w} fill="none" />
              <path d={`M${b.x + w * 0.25},${b.y} L${t.x + w * 0.25},${t.y}`} stroke="#ffcf99" strokeWidth={w * 0.25} opacity={0.6} />
              <ellipse cx={a.x} cy={a.y + w} rx={w * 2.2} ry={w * 0.9} fill="#3a4248" stroke={LINEA} strokeWidth={1.2} />
            </g>
          );
        })}
        {/* cables */}
        {[0, 1].map((k) => {
          const a = proyectar(cam, [1.4, 5.6 - k * 0.4, 6]), b = proyectar(cam, [11.8, 7 - k * 0.4, 30]), c = proyectar(cam, [-1.5, 8, 1]);
          return <path key={k} d={`M${c.x - 300},${c.y - 40} Q${(c.x + a.x) / 2},${a.y + 90} ${a.x},${a.y} Q${(a.x + b.x) / 2},${(a.y + b.y) / 2 + 60} ${b.x},${b.y}`} stroke="#3a2f38" strokeWidth={2.2 - k * 0.5} fill="none" />;
        })}
        {/* auto viejo estacionado */}
        <Caja cam={cam} amb={amb} x0={8.1} x1={9.7} y0={0.3} y1={1.0} z0={16} z1={20.3} col="#9b3b32" trazo={1.6} />
        <Caja cam={cam} amb={amb} x0={8.25} x1={9.55} y0={1.0} y1={1.5} z0={17} z1={19.4} col="#3c5865" trazo={1.6} />
        {[16.8, 19.5].map((z, i) => { const q = proyectar(cam, [8.05, 0.32, z]); return <ellipse key={i} cx={q.x} cy={q.y} rx={1000 / q.z * 0.12} ry={1000 / q.z * 0.32} fill="#1d1c1f" />; })}
        {/* hojas y papeles sueltos */}
        {Array.from({ length: 22 }).map((_, i) => { const p = proyectar(cam, [2 + rnd(i) * 7.5, 0.02, 3 + rnd(i * 5) * 18]); const s = 1000 / p.z * 0.12; return <ellipse key={i} cx={p.x} cy={p.y} rx={s} ry={s * 0.4} fill={["#c58a3e", "#a85e33", "#e4d7b8"][i % 3]} opacity={0.85} />; })}
        {/* resplandor del sol en el fondo de la calle + luz rasante */}
        <rect width={W} height={H} fill="#ffb46b" opacity={0.07} />
      </g>
    </svg>
  );
};

/* ═══════════════════════════ 2. ESCONDITE (interior 3/4) ═══════════════════════════ */
export const CAM_ESC: Cam = { pos: [0.4, 1.55, -4.2], yaw: 0.2, pitch: -0.1, f: 1050 };
const AMB_ESC: Ambiente = { luz: norm([-0.3, 0.9, -0.4]), calido: "#ffc277", frio: "#3d3058", bruma: "#2a1d18", brumaDesde: 30, brumaHasta: 60, sombraCol: "#1a0f14", sombraOp: 0.45 };
export const LAMPARA: V3 = [0.6, 2.65, 2.6];

export const FondoEscondite: React.FC<{ luz: number }> = ({ luz }) => {
  const cam = CAM_ESC, amb = AMB_ESC;
  const X0 = -4, X1 = 4.5, Z1 = 5.5, Y1 = 3.1;
  const lamp = proyectar(cam, LAMPARA);
  // ventanuco alto en la pared izquierda: entra un haz de sol
  const sol = norm([0.85, -0.55, 0.35]);
  const ven: V3[] = [[X0, 2.85, 0.6], [X0, 2.85, 1.8], [X0, 2.35, 1.8], [X0, 2.35, 0.6]];
  const parche = ven.map((p) => { const t = -p[1] / sol[1]; return add(p, mul(sol, t)) as V3; });
  const tabla = (x: number, k: number) => ["#7f4c37", "#8b5641", "#704332", "#85503b"][k % 4];
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <Filtros id="esc" temblor={1.3} />
      <defs>
        <radialGradient id="glowE" cx={lamp.x} cy={lamp.y + 120} r={1100} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffd88f" stopOpacity={0.55 * luz} /><stop offset="0.35" stopColor="#e39a50" stopOpacity={0.18 * luz} /><stop offset="1" stopColor="#0d0608" stopOpacity={0.72} />
        </radialGradient>
        <linearGradient id="hazE" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff1c9" stopOpacity={0.5} /><stop offset="1" stopColor="#fff1c9" stopOpacity={0.04} /></linearGradient>
      </defs>
      <g filter="url(#manoesc)">
        {/* pared del fondo: tablas */}
        {Array.from({ length: 14 }).map((_, k) => { const x = X0 + k * 0.62; return <Cara key={k} cam={cam} p={[[x, 0, Z1], [x + 0.62, 0, Z1], [x + 0.62, Y1, Z1], [x, Y1, Z1]]} fill={tabla(x, k)} trazo={1.6} />; })}
        {/* pared izquierda */}
        {Array.from({ length: 16 }).map((_, k) => { const z = -4 + k * 0.62; return <Cara key={k} cam={cam} p={[[X0, 0, z], [X0, 0, z + 0.62], [X0, Y1, z + 0.62], [X0, Y1, z]]} fill={mix(tabla(z, k + 1), "#2b1a20", 0.3)} trazo={1.6} />; })}
        {/* pared derecha */}
        {Array.from({ length: 16 }).map((_, k) => { const z = -4 + k * 0.62; return <Cara key={`d${k}`} cam={cam} p={[[X1, 0, z + 0.62], [X1, 0, z], [X1, Y1, z], [X1, Y1, z + 0.62]]} fill={mix(tabla(z, k + 2), "#2b1a20", 0.45)} trazo={1.6} />; })}
        {/* techo */}
        <Cara cam={cam} p={[[X0, Y1, -4], [X1, Y1, -4], [X1, Y1, Z1], [X0, Y1, Z1]]} fill="#3b2620" trazo={1.6} />
        {[-2, -0.5, 1, 2.5, 4].map((z) => <Cara key={z} cam={cam} p={[[X0, Y1 - 0.2, z], [X1, Y1 - 0.2, z], [X1, Y1, z + 0.25], [X0, Y1, z + 0.25]]} fill="#5a3a2b" trazo={1.4} />)}
        {/* nudos, clavos, garabatos */}
        {Array.from({ length: 40 }).map((_, i) => { const q = proyectar(cam, [X0 + 0.3 + rnd(i) * 8, 0.3 + rnd(i * 3) * 2.6, Z1 - 0.01]); return <ellipse key={i} cx={q.x} cy={q.y} rx={3 + rnd(i) * 4} ry={2} fill="#3d2318" opacity={0.6} />; })}
        {/* marcas de conteo de días en la pared */}
        <g stroke="#2b1812" strokeWidth={2} opacity={0.8}>
          {Array.from({ length: 4 }).map((_, g) => { const o = proyectar(cam, [X0 + 0.5 + g * 0.35, 1.6, Z1 - 0.02]); return <path key={g} d={`M${o.x},${o.y} v24 m6,-24 v24 m6,-24 v24 m6,-24 v24 M${o.x - 3},${o.y + 18} l26,-12`} />; })}
        </g>
        {/* zócalo */}
        <Cara cam={cam} p={[[X0, 0, Z1 - 0.01], [X1, 0, Z1 - 0.01], [X1, 0.3, Z1 - 0.01], [X0, 0.3, Z1 - 0.01]]} fill="#4a2c22" trazo={1.6} />
        {/* ventanuco con pinos (pared del fondo) */}
        <Cara cam={cam} p={[[-2.6, 1.3, Z1 - 0.02], [-0.9, 1.3, Z1 - 0.02], [-0.9, 2.3, Z1 - 0.02], [-2.6, 2.3, Z1 - 0.02]]} fill="#26405a" trazo={3} />
        {[-2.4, -2.0, -1.6, -1.2].map((x, i) => <polygon key={i} points={pts(cam, [[x, 1.3, Z1 - 0.03], [x + 0.18, 1.85 + rnd(i) * 0.3, Z1 - 0.03], [x + 0.36, 1.3, Z1 - 0.03]])} fill="#2f5c47" stroke="#16261d" strokeWidth={1.2} />)}
        <polyline points={pts(cam, [[-2.6, 1.8, Z1 - 0.04], [-0.9, 1.8, Z1 - 0.04]])} stroke={LINEA} strokeWidth={4} />
        {/* lámpara de emergencia enjaulada en la pared */}
        <Cara cam={cam} p={[[-3.3, 1.6, Z1 - 0.02], [-2.9, 1.6, Z1 - 0.02], [-2.9, 2.2, Z1 - 0.02], [-3.3, 2.2, Z1 - 0.02]]} fill="#58626e" trazo={1.8} />
        {(() => { const q = proyectar(cam, [-3.1, 1.9, Z1 - 0.03]); return <ellipse cx={q.x} cy={q.y} rx={12} ry={20} fill="#ffcf73" opacity={0.6 + 0.4 * luz} />; })()}
        {/* pizarra con mapa, notas e hilos */}
        {(() => {
          const o: V3 = [0.9, 0.9, Z1 - 0.03], u: V3 = [1, 0, 0], v: V3 = [0, 1, 0];
          const P = (a: number, b: number) => add(add(o, mul(u, a)), mul(v, b));
          const notas = [[0.2, 1.7], [0.9, 1.75], [2.6, 1.7], [3.1, 1.0], [0.15, 0.3], [2.2, 0.25], [1.5, 1.2]];
          return (
            <g>
              <Cara cam={cam} p={quad(o, u, v, -0.08, 3.68, -0.08, 2.08)} fill="#5a3b28" trazo={2} />
              <Cara cam={cam} p={quad(o, u, v, 0, 3.6, 0, 2)} fill="#e9dfc6" trazo={1.6} />
              <polygon points={pts(cam, [P(0.3, 1.5), P(0.8, 1.75), P(1.4, 1.5), P(2.0, 1.7), P(2.7, 1.45), P(3.3, 1.2), P(3.2, 0.5), P(2.5, 0.3), P(1.7, 0.45), P(0.9, 0.3), P(0.35, 0.7)])} fill="#e3be4c" stroke="#9c7c1f" strokeWidth={2} />
              <polyline points={pts(cam, [P(0.8, 1.1), P(1.5, 0.9), P(2.4, 1.0), P(3.0, 0.8)])} fill="none" stroke="#b08a2a" strokeWidth={2} />
              {notas.map(([a, b], i) => <polygon key={i} points={pts(cam, quad(o, u, v, a, a + 0.42, b, b + 0.3))} fill={["#fdf6dd", "#cfe3ef", "#f3d0c5"][i % 3]} stroke={LINEA} strokeWidth={1.2} transform={`rotate(${(rnd(i) - 0.5) * 8} ${proyectar(cam, P(a + 0.2, b + 0.15)).x} ${proyectar(cam, P(a + 0.2, b + 0.15)).y})`} />)}
              <polyline points={pts(cam, [P(0.41, 2.0), P(1.71, 1.5), P(3.31, 1.3), P(2.41, 0.55), P(0.36, 0.6)])} fill="none" stroke="#c0392b" strokeWidth={1.8} />
              {notas.map(([a, b], i) => { const q = proyectar(cam, P(a + 0.21, b + 0.27)); return <circle key={i} cx={q.x} cy={q.y} r={4} fill="#c0392b" stroke={LINEA} strokeWidth={1} />; })}
            </g>
          );
        })()}
        {/* caño vertical en la esquina */}
        <Caja cam={cam} amb={amb} x0={-0.4} x1={-0.15} y1={Y1} z0={Z1 - 0.35} z1={Z1 - 0.1} col="#8f949a" trazo={1.6} />
        {/* piso de baldosas */}
        <Cara cam={cam} p={[[X0, 0, -4], [X1, 0, -4], [X1, 0, Z1], [X0, 0, Z1]]} fill="#8a8170" trazo={0} />
        {Array.from({ length: 12 }).map((_, i) => <polyline key={i} points={pts(cam, [[X0 + i * 0.75, 0, -4], [X0 + i * 0.75, 0, Z1]])} stroke="#4a4438" strokeWidth={1.5} />)}
        {Array.from({ length: 14 }).map((_, i) => <polyline key={`z${i}`} points={pts(cam, [[X0, 0, -4 + i * 0.75], [X1, 0, -4 + i * 0.75]])} stroke="#4a4438" strokeWidth={1.5} />)}
        {Array.from({ length: 10 }).map((_, i) => { const x = X0 + rnd(i) * 8, z = -2 + rnd(i * 4) * 7; return <polyline key={`g${i}`} points={pts(cam, [[x, 0.001, z], [x + 0.2, 0.001, z + 0.15], [x + 0.25, 0.001, z + 0.4]])} fill="none" stroke="#3a352c" strokeWidth={1.2} />; })}
        {/* mancha de sol en el piso + haz volumétrico */}
        <polygon points={pts(cam, [ven[0], ven[1], parche[1], parche[0]])} fill="url(#hazE)" opacity={0.35} />
        <polygon points={pts(cam, [ven[3], ven[2], parche[2], parche[3]])} fill="url(#hazE)" opacity={0.25} />
        <polygon points={pts(cam, parche)} fill="#ffe7b0" opacity={0.42} />
        <Cara cam={cam} p={ven} fill="#fff1c9" trazo={2} />
        {/* cajones apilados (con sombra) */}
        <SombraCaja cam={cam} amb={amb} x0={-3.9} x1={-2.6} y1={1.6} z0={2.6} z1={3.9} />
        <Caja cam={cam} amb={amb} x0={-3.9} x1={-2.6} y1={0.8} z0={2.6} z1={3.9} col="#a87b4f" deco={(c) => c.nombre !== "techo" ? <polyline points={pts(cam, [c.o, add(add(c.o, mul(c.u, c.ancho)), mul(c.v, c.alto))])} stroke="#6f4d2f" strokeWidth={5} /> : null} />
        <Caja cam={cam} amb={amb} x0={-3.8} x1={-2.8} y0={0.8} y1={1.6} z0={2.8} z1={3.8} col="#b98a5b" deco={(c) => c.nombre !== "techo" ? <polyline points={pts(cam, [c.o, add(add(c.o, mul(c.u, c.ancho)), mul(c.v, c.alto))])} stroke="#6f4d2f" strokeWidth={4} /> : null} />
        <Caja cam={cam} amb={amb} x0={-2.5} x1={-1.7} y1={0.6} z0={3.3} z1={4.1} col="#9c7046" />
        {/* banco de madera y balde */}
        <Caja cam={cam} amb={amb} x0={2.3} x1={4.1} y0={0.45} y1={0.55} z0={2.2} z1={2.8} col="#9c6c47" />
        {[2.4, 4.0].map((x) => <Caja key={x} cam={cam} amb={amb} x0={x - 0.05} x1={x + 0.05} y1={0.45} z0={2.3} z1={2.4} col="#5a3a26" trazo={1.2} />)}
        <Caja cam={cam} amb={amb} x0={3.2} x1={3.6} y1={0.4} z0={0.6} z1={1.0} col="#7a8a96" />
        {/* papeles tirados */}
        {Array.from({ length: 6 }).map((_, i) => { const x = -2 + rnd(i) * 5, z = -1.5 + rnd(i * 2) * 4; return <polygon key={i} points={pts(cam, [[x, 0.005, z], [x + 0.3, 0.005, z + 0.05], [x + 0.28, 0.005, z + 0.25], [x - 0.02, 0.005, z + 0.2]])} fill="#efe8d5" stroke={LINEA} strokeWidth={1} />; })}
        {/* lámpara colgante */}
        {(() => { const top = proyectar(cam, [LAMPARA[0], Y1, LAMPARA[2]]); return (
          <g>
            <path d={`M${top.x},${top.y} L${lamp.x},${lamp.y - 26}`} stroke={LINEA} strokeWidth={2.4} />
            <ellipse cx={lamp.x} cy={lamp.y} rx={26} ry={32} fill="#ffe7a8" opacity={0.65 + 0.35 * luz} />
            <path d={`M${lamp.x - 22},${lamp.y - 14} Q${lamp.x},${lamp.y - 40} ${lamp.x + 22},${lamp.y - 14} V${lamp.y + 14} Q${lamp.x},${lamp.y + 38} ${lamp.x - 22},${lamp.y + 14} Z M${lamp.x - 22},${lamp.y} H${lamp.x + 22} M${lamp.x},${lamp.y - 28} V${lamp.y + 34}`} fill="none" stroke={LINEA} strokeWidth={3} />
          </g>
        ); })()}
      </g>
      <rect width={W} height={H} fill="url(#glowE)" />
    </svg>
  );
};

/* ═══════════════════════════ 3. CUARTO DEL STREAMER ═══════════════════════════ */
export const CAM_CUARTO: Cam = { pos: [0.2, 1.25, -1.2], yaw: -0.12, pitch: -0.05, f: 900 };
const AMB_CUARTO: Ambiente = { luz: norm([-0.7, 0.4, -0.3]), calido: "#ffd9a0", frio: "#405070", bruma: "#5a6070", brumaDesde: 30, brumaHasta: 60, sombraCol: "#151a26", sombraOp: 0.4 };
export const FondoCuarto: React.FC = () => {
  const cam = CAM_CUARTO, amb = AMB_CUARTO;
  const X0 = -2.6, X1 = 3.4, Z1 = 3.6, Y1 = 2.7;
  const sol = norm([-0.75, -0.45, 0.2]);
  const ven: V3[] = [[X1, 2.2, 1.0], [X1, 2.2, 2.6], [X1, 0.9, 2.6], [X1, 0.9, 1.0]];
  const parche = ven.map((p) => { const t = -p[1] / sol[1]; return add(p, mul(sol, t)) as V3; });
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <Filtros id="cuarto" temblor={1.2} />
      <defs>
        <radialGradient id="velador" cx="80%" cy="38%" r="40%"><stop offset="0" stopColor="#ffcf86" stopOpacity={0.45} /><stop offset="1" stopColor="#ffcf86" stopOpacity={0} /></radialGradient>
        <linearGradient id="hazC" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4f8ff" stopOpacity={0.4} /><stop offset="1" stopColor="#f4f8ff" stopOpacity={0.03} /></linearGradient>
      </defs>
      <g filter="url(#manocuarto)">
        <Cara cam={cam} p={[[X0, 0, Z1], [X1, 0, Z1], [X1, Y1, Z1], [X0, Y1, Z1]]} fill="#868b92" trazo={1.8} />
        <Cara cam={cam} p={[[X0, 0, -2], [X0, 0, Z1], [X0, Y1, Z1], [X0, Y1, -2]]} fill="#6d7179" trazo={1.8} />
        <Cara cam={cam} p={[[X1, 0, Z1], [X1, 0, -2], [X1, Y1, -2], [X1, Y1, Z1]]} fill="#5c6068" trazo={1.8} />
        <Cara cam={cam} p={[[X0, Y1, -2], [X1, Y1, -2], [X1, Y1, Z1], [X0, Y1, Z1]]} fill="#a3a7ad" trazo={1.8} />
        {/* manchas de humedad y garabatos */}
        <Mugre cam={cam} c={{ nombre: "frente", o: [X0, 0, Z1 - 0.01], u: [1, 0, 0], v: [0, 1, 0], ancho: X1 - X0, alto: Y1, color: "#868b92", n: [0, 0, -1] }} n={40} seed={8} />
        {/* ventana derecha (luz fría) */}
        <Cara cam={cam} p={ven} fill="#d9e6f2" trazo={3} />
        <polyline points={pts(cam, [[X1 - 0.01, 2.2, 1.8], [X1 - 0.01, 0.9, 1.8]])} stroke={LINEA} strokeWidth={3} />
        {/* piso */}
        <Cara cam={cam} p={[[X0, 0, -2], [X1, 0, -2], [X1, 0, Z1], [X0, 0, Z1]]} fill="#b5ae9f" trazo={0} />
        {Array.from({ length: 10 }).map((_, i) => <polyline key={i} points={pts(cam, [[X0 + i * 0.6, 0, -2], [X0 + i * 0.6, 0, Z1]])} stroke="#8a8476" strokeWidth={1.4} />)}
        {Array.from({ length: 10 }).map((_, i) => <polyline key={`z${i}`} points={pts(cam, [[X0, 0, -2 + i * 0.6], [X1, 0, -2 + i * 0.6]])} stroke="#8a8476" strokeWidth={1.4} />)}
        <polygon points={pts(cam, parche)} fill="#f2f6ff" opacity={0.35} />
        <polygon points={pts(cam, [ven[0], ven[1], parche[1], parche[0]])} fill="url(#hazC)" opacity={0.3} />
        {/* puerta con póster */}
        <Cara cam={cam} p={[[-0.3, 0, Z1 - 0.02], [0.6, 0, Z1 - 0.02], [0.6, 2.05, Z1 - 0.02], [-0.3, 2.05, Z1 - 0.02]]} fill="#a7a8a6" trazo={2.2} />
        <Cara cam={cam} p={[[-0.15, 1.2, Z1 - 0.03], [0.45, 1.2, Z1 - 0.03], [0.45, 1.75, Z1 - 0.03], [-0.15, 1.75, Z1 - 0.03]]} fill="#2b2c30" trazo={1.6} />
        {(() => { const q = proyectar(cam, [0.5, 1.0, Z1 - 0.03]); return <circle cx={q.x} cy={q.y} r={5} fill="#333" />; })()}
        {/* póster rojo en la pared izquierda del fondo */}
        <Cara cam={cam} p={[[-2.2, 1.4, Z1 - 0.02], [-1.6, 1.4, Z1 - 0.02], [-1.6, 2.2, Z1 - 0.02], [-2.2, 2.2, Z1 - 0.02]]} fill="#9e2b28" trazo={1.8} />
        {(() => { const q = proyectar(cam, [-1.9, 1.85, Z1 - 0.03]); return <circle cx={q.x} cy={q.y} r={26} fill="#cf5a43" stroke={LINEA} strokeWidth={1.4} />; })()}
        {/* perchero con campera */}
        {(() => { const b = proyectar(cam, [1.1, 0, Z1 - 0.3]), t = proyectar(cam, [1.1, 1.8, Z1 - 0.3]); return (
          <g stroke="#3a2c25" strokeWidth={5} fill="none" strokeLinecap="round">
            <path d={`M${b.x},${b.y} L${t.x},${t.y} M${t.x},${t.y + 10} l-26,-24 M${t.x},${t.y + 14} l26,-28 M${b.x - 26},${b.y + 6} L${b.x},${b.y - 10} L${b.x + 26},${b.y + 6}`} />
            <path d={`M${t.x + 18},${t.y - 8} q22,30 8,120 l-22,-4 q6,-60 14,-116 Z`} fill="#4b5a3d" stroke={LINEA} strokeWidth={1.6} />
          </g>
        ); })()}
        {/* mueble bajo con cajas */}
        <SombraCaja cam={cam} amb={amb} x0={-2.55} x1={-0.8} y1={0.9} z0={2.6} z1={3.55} />
        <Caja cam={cam} amb={amb} x0={-2.55} x1={-0.8} y1={0.85} z0={2.6} z1={3.55} col="#c7a77c" deco={(c) => c.nombre === "frente" ? (
          <g>
            <Cara cam={cam} p={quad(c.o, c.u, c.v, 0.1, 0.8, 0.1, 0.7)} fill={mix(c.color, "#000000", 0.25)} trazo={1.4} />
            <Cara cam={cam} p={quad(c.o, c.u, c.v, 0.95, 1.65, 0.1, 0.7)} fill={mix(c.color, "#000000", 0.1)} trazo={1.4} />
            <Cara cam={cam} p={quad(c.o, c.u, c.v, 0.15, 0.75, 0.15, 0.45)} fill="#d8c19a" trazo={1.2} />
          </g>) : null} />
        <Caja cam={cam} amb={amb} x0={-2.4} x1={-1.9} y0={0.85} y1={1.1} z0={2.9} z1={3.4} col="#5d5f63" />
        <Caja cam={cam} amb={amb} x0={-1.7} x1={-1.1} y0={0.85} y1={0.88} z0={2.9} z1={3.3} col="#efe9dc" trazo={1.2} />
        {/* cama a la derecha */}
        <Caja cam={cam} amb={amb} x0={1.6} x1={3.4} y1={0.5} z0={0.6} z1={3.0} col="#3e4a46" />
        <Caja cam={cam} amb={amb} x0={1.65} x1={3.35} y0={0.5} y1={0.62} z0={0.7} z1={2.9} col="#5f706a" trazo={1.6} />
        <Caja cam={cam} amb={amb} x0={2.2} x1={3.2} y0={0.62} y1={0.78} z0={2.4} z1={2.85} col="#d9d4c4" trazo={1.6} />
        {/* velador */}
        <Caja cam={cam} amb={amb} x0={2.9} x1={3.35} y1={0.6} z0={3.05} z1={3.5} col="#7a5a3e" />
        {(() => { const q = proyectar(cam, [3.1, 1.0, 3.25]); return <path d={`M${q.x - 30},${q.y} h60 l-14,-46 h-32 Z M${q.x},${q.y} v40`} fill="#d8b26a" stroke={LINEA} strokeWidth={1.8} />; })()}
        {/* ropa y envoltorio en el piso */}
        {(() => { const a = proyectar(cam, [-0.6, 0, 1.2]), b = proyectar(cam, [0.8, 0, 0.4]); return (
          <g>
            <path d={`M${a.x},${a.y} q30,-14 52,4 q-8,22 -46,14 Z`} fill="#6f7a4d" stroke={LINEA} strokeWidth={1.4} />
            <rect x={b.x} y={b.y} width={46} height={20} fill="#d8573a" stroke={LINEA} strokeWidth={1.4} transform={`rotate(14 ${b.x} ${b.y})`} />
          </g>
        ); })()}
      </g>
      <rect width={W} height={H} fill="url(#velador)" />
      <rect width={W} height={H} fill="#22293a" opacity={0.18} />
    </svg>
  );
};

/* ═══════════════════════════ 4. RUTA DEL DESIERTO (cámara que viaja) ═══════════════════════════ */
const AMB_DES: Ambiente = { luz: norm([0.5, 0.8, 0.3]), calido: "#fff0c8", frio: "#7a6aa0", bruma: "#e6dccb", brumaDesde: 40, brumaHasta: 420, sombraCol: "#5a3a3a", sombraOp: 0.3 };
export const FondoDesierto: React.FC<{ t: number }> = ({ t }) => {
  // la camioneta va hacia la cámara: el mundo de atrás se aleja
  const avance = t; // metros recorridos
  const cam: Cam = { pos: [0, 2.6, -8], yaw: 0, pitch: -0.02, f: 1000 };
  const Z = (z: number) => z + avance; // posición relativa a la cámara
  const postes = Array.from({ length: 10 }).map((_, i) => i * 40 + 30 - (avance % 40));
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <Filtros id="des" temblor={1.2} />
      <defs>
        <linearGradient id="cieloD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5c93cc" /><stop offset="0.55" stopColor="#b9dbea" /><stop offset="0.78" stopColor="#efe4cc" /></linearGradient>
        <linearGradient id="arena" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9bb92" /><stop offset="1" stopColor="#a8784e" /></linearGradient>
      </defs>
      <g filter="url(#manodes)">
        <rect width={W} height={H} fill="url(#cieloD)" />
        <circle cx={1500} cy={170} r={34} fill="#fffbe9" /><circle cx={1500} cy={170} r={95} fill="#fffbe9" opacity={0.22} />
        {[[260, 190, 1.2], [920, 120, 0.9], [1350, 260, 0.8]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x - avance * 0.4} ${y}) scale(${s})`}>
            <path d="M-150,25 Q-140,-15 -80,-10 Q-60,-45 -5,-28 Q40,-55 90,-18 Q150,-22 150,25 Z" fill="#fff" opacity={0.75} />
            <path d="M-150,25 Q0,12 150,25 Q60,38 -150,25 Z" fill="#c9d9e6" opacity={0.7} />
          </g>
        ))}
        {/* mesetas lejanas (fijas: están al infinito) */}
        <path d="M0,560 L120,520 L300,520 L340,470 L520,470 L560,530 L800,540 L900,500 L1040,500 L1080,545 L1320,540 L1380,480 L1600,480 L1650,535 L1920,530 L1920,620 L0,620 Z" fill="#cdb3a0" opacity={0.75} />
        <path d="M0,600 Q300,560 600,590 T1200,580 T1920,600 L1920,640 L0,640 Z" fill="#c9a27a" stroke={LINEA} strokeWidth={1.4} />
        {/* desierto */}
        <rect y={proyectar(cam, [0, 0, 600]).y} width={W} height={H} fill="url(#arena)" />
        {/* ruta que se aleja */}
        <Cara cam={cam} p={[[-4, 0, -6], [4, 0, -6], [4, 0, 900], [-4, 0, 900]]} fill="#5d5658" trazo={0} />
        <Cara cam={cam} p={[[-4.3, 0, -6], [-4, 0, -6], [-4, 0, 900], [-4.3, 0, 900]]} fill="#c9b79a" trazo={0} />
        <Cara cam={cam} p={[[4, 0, -6], [4.3, 0, -6], [4.3, 0, 900], [4, 0, 900]]} fill="#c9b79a" trazo={0} />
        {Array.from({ length: 50 }).map((_, i) => { const z = i * 12 - (avance % 12) - 6; return <Cara key={i} cam={cam} p={[[-0.12, 0.01, z], [0.12, 0.01, z], [0.12, 0.01, z + 5], [-0.12, 0.01, z + 5]]} fill="#efd06a" trazo={0} />; })}
        {/* matas y piedras al costado */}
        {Array.from({ length: 40 }).map((_, i) => {
          const z = ((i * 17 + rnd(i) * 10 - avance) % 680 + 680) % 680 - 6, x = (rnd(i * 3) > 0.5 ? 1 : -1) * (6 + rnd(i * 7) * 30);
          const q = proyectar(cam, [x, 0, z]); const s = 1000 / q.z;
          if (q.z < 1) return null;
          return <path key={i} d={`M${q.x},${q.y} l${-0.5 * s},${-0.8 * s} M${q.x},${q.y} l0,${-1 * s} M${q.x},${q.y} l${0.5 * s},${-0.75 * s} M${q.x},${q.y} l${-0.8 * s},${-0.35 * s} M${q.x},${q.y} l${0.8 * s},${-0.4 * s}`} stroke="#6b5a2c" strokeWidth={Math.max(1, s * 0.06)} strokeLinecap="round" />;
        })}
        {/* postes de teléfono a la derecha + cable */}
        {(() => {
          const top = postes.map((z) => proyectar(cam, [9, 8, z]));
          return (
            <g>
              <path d={top.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y + 10}`).join(" ")} stroke="#3a2c25" strokeWidth={1.6} fill="none" />
              {postes.map((z, i) => {
                const b = proyectar(cam, [9, 0, z]), t2 = top[i]; const w = Math.max(1.5, 1000 / b.z * 0.25);
                if (b.z < 1) return null;
                return (
                  <g key={i}>
                    <polygon points={pts(cam, [[9, 0, z], [9.2, 0, z], alPiso([9.2, 8, z], AMB_DES.luz), alPiso([9, 8, z], AMB_DES.luz)])} fill="#6a4a3a" opacity={0.25} />
                    <path d={`M${b.x},${b.y} L${t2.x},${t2.y}`} stroke="#5b3f2b" strokeWidth={w} />
                    <path d={`M${t2.x - w * 4},${t2.y + w * 2} H${t2.x + w * 4}`} stroke="#5b3f2b" strokeWidth={w * 0.8} />
                  </g>
                );
              })}
            </g>
          );
        })()}
        {/* calor que sube del asfalto */}
        <rect y={proyectar(cam, [0, 0, 300]).y - 6} width={W} height={14} fill="#f3e6cf" opacity={0.5} />
      </g>
    </svg>
  );
};
