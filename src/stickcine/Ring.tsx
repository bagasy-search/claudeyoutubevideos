import React from "react";
import { AbsoluteFill } from "remotion";
import { Capa, Cam, F, SUELO, at, clamp, curva, recorrido, rnd, seco, suave } from "./lib";
import { Figura, Look, PARADO, Pose, con, secuencia } from "./rig";

// Flashback: Ernesto joven en el ring. Sincronizado con "campeón sudamericano… treinta y dos peleas… ni una sola derrota".
const JOVEN: Look = { color: "#141318", ancho: 10, vincha: "#c8302a", guantes: "#c8302a" };
const RIVAL: Look = { color: "#18161c", ancho: 10.5, guantes: "#2f5fc8" };
const REFERI: Look = { color: "#1a1a1e", ancho: 9.5, mono: "#f2f2f2" };

const R = (() => {
  const campeon = at("campeon sudamericano");
  const peleas = at("peleas");
  const derrota = at("ni una sola derrota");
  return { campeon, peleas, derrota };
})();

export const camRing = (t: number): Cam => {
  const r = recorrido(t, [
    [37.0, 0, -40, 560],
    [39.4, 0, 0, 80],
    [41.2, 40, -10, 160],
    [43.0, 60, -40, 380],
  ]);
  return { ...r, foco: F, ap: curva(t, [[37, 12], [39.4, 10], [43, 14]]) };
};

const guardia = (t: number): Pose => con(PARADO, { brazo: [40, 30], ante: [150, 140], torso: 8 + Math.sin(t * 7) * 2, muslo: [14, -10], pierna: [4, -10], y: SUELO - 122 });

export const Ring: React.FC<{ t: number }> = ({ t }) => {
  const cam = camRing(t);
  const c0 = R.campeon + 0.6;
  // combinación: jab, recto, gancho
  const golpes = [c0, c0 + 0.45, c0 + 0.9];
  const G = guardia(t);
  const JAB = con(G, { brazo: [95, 30], ante: [92, 140], torso: 14 });
  const RECTO = con(G, { brazo: [40, 95], ante: [150, 92], torso: 20 });
  const GANCHO = con(G, { brazo: [110, 30], ante: [40, 140], torso: 22 });
  const BRAZO_ARRIBA = con(PARADO, { brazo: [6, 172], ante: [10, 176] });
  const eP = secuencia(t, [
    [0, G],
    [golpes[0], JAB, 0.09],
    [golpes[0] + 0.2, G, 0.15],
    [golpes[1], RECTO, 0.09],
    [golpes[1] + 0.2, G, 0.15],
    [golpes[2], GANCHO, 0.1],
    [golpes[2] + 0.4, G, 0.3],
    [R.derrota + 0.1, BRAZO_ARRIBA, 0.4],
  ]);
  const ex = -80 + 18 * Math.sin(t * 3) * (1 - suave(t, R.derrota - 0.4, R.derrota));
  // el rival recibe y cae
  const pega = golpes.map((g) => Math.sin(clamp((t - g - 0.06) / 0.3, 0, 1) * Math.PI));
  const cae = seco(t, golpes[2] + 0.15, golpes[2] + 0.75);
  const rP = con(guardia(t + 1.3), { torso: 8 - 20 * (pega[0] + pega[1]) - 30 * pega[2], cabeza: -20 * (pega[0] + pega[1] + pega[2]) });
  const rRot = 88 * cae; // de espaldas, hacia la derecha
  const rx = 130 + 20 * (pega[0] + pega[1]) + 50 * cae;
  // réferi entra a levantar el brazo
  const refX = 520 - 420 * suave(t, R.derrota - 0.9, R.derrota - 0.1);
  const refP = secuencia(t, [[0, PARADO], [R.derrota + 0.1, con(PARADO, { brazo: [6, 160], ante: [10, 172] }), 0.4]]);

  const flashes = Array.from({ length: 70 }, (_, i) => {
    const rr = rnd(300 + i);
    return { x: -2600 + rr() * 5200, y: -260 + rr() * 380, t0: 37 + rr() * 6, d: 0.14 + rr() * 0.1 };
  });
  const r = rnd(9);
  const publico = Array.from({ length: 140 }, () => ({ x: -2800 + r() * 5600, y: -120 + r() * 300, s: 0.8 + r() * 0.5, f: r() * 6 }));

  // carteles del marcador
  const c32 = suave(t, R.peleas - 0.5, R.peleas - 0.15);
  const c0d = suave(t, R.derrota, R.derrota + 0.35);

  return (
    <AbsoluteFill style={{ backgroundColor: "#07070c" }}>
      {/* público con flashes suaves (rampa de subida y bajada, sin parpadeo duro) */}
      <Capa D={1800} cam={cam}>
        <rect x={-4000} y={-1600} width={8000} height={3000} fill="#0b0b14" />
        {publico.map((p, i) => (
          <g key={i} transform={`translate(${p.x},${p.y + Math.sin(t * 5 + p.f) * 4}) scale(${p.s})`}>
            <circle cx={0} cy={0} r={22} fill="#15151f" />
            <rect x={-26} y={20} width={52} height={90} rx={18} fill="#15151f" />
          </g>
        ))}
        {flashes.map((f, i) => {
          const u = (t - f.t0) / f.d;
          const op = u > 0 && u < 1 ? Math.sin(u * Math.PI) : 0;
          return op > 0 ? <circle key={i} cx={f.x} cy={f.y} r={18} fill="#eef2ff" opacity={op * 0.8} /> : null;
        })}
      </Capa>

      {/* marcador colgante */}
      <Capa D={1300} cam={cam}>
        <line x1={-260} y1={-1400} x2={-260} y2={-330} stroke="#222" strokeWidth={6} />
        <line x1={260} y1={-1400} x2={260} y2={-330} stroke="#222" strokeWidth={6} />
        <rect x={-330} y={-330} width={660} height={230} rx={10} fill="#111118" stroke="#2a2a36" strokeWidth={6} />
        <text x={0} y={-230} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={84} fill="#ffd27a" opacity={c32}>
          32 PELEAS
        </text>
        <text x={0} y={-135} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={70} fill="#ff6a5a" opacity={c0d}>
          0 DERROTAS
        </text>
      </Capa>

      {/* cuerdas de atrás */}
      <Capa D={1100} cam={cam}>
        {[150, 205, 260].map((y, i) => (
          <line key={i} x1={-900} x2={900} y1={y - 120} y2={y - 120} stroke="#b02a2a" strokeWidth={7} opacity={0.8} />
        ))}
        <rect x={-920} y={-60} width={26} height={360} fill="#1e1e26" />
        <rect x={894} y={-60} width={26} height={360} fill="#1e1e26" />
      </Capa>

      {/* conos de luz desde arriba */}
      <Capa D={1050} cam={cam} mezcla="screen" extra={8}>
        {[-260, 0, 260].map((lx, i) => (
          <polygon key={i} points={`${lx - 40},-1000 ${lx + 40},-1000 ${lx + 380},${SUELO} ${lx - 380},${SUELO}`} fill="#9fb6ff" opacity={0.12} />
        ))}
      </Capa>

      {/* lona y peleadores */}
      <Capa D={F} cam={cam}>
        <defs>
          <radialGradient id="lona" cx="0.5" cy="0.3" r="0.7">
            <stop offset="0" stopColor="#d8d4ce" />
            <stop offset="1" stopColor="#5a5a64" />
          </radialGradient>
          <filter id="sombraR" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        <rect x={-1500} y={SUELO - 6} width={3000} height={600} fill="url(#lona)" />
        {[ex, rx, refX].map((sx, i) => (
          <ellipse key={i} cx={sx} cy={SUELO + 3} rx={i === 1 ? 50 + 60 * cae : 44} ry={7} fill="#000" opacity={0.5} filter="url(#sombraR)" />
        ))}
        <Figura x={refX} P={refP} mira={-1} look={REFERI} t={t} cara={{ giro: 0.3, sonrisa: 0.3, parpado: 0 }} bordes={[{ dx: 0, dy: -2.6, color: "#bcd0ff", op: 0.8 }]} />
        <Figura
          x={rx}
          P={rP}
          mira={-1}
          look={RIVAL}
          rot={rRot}
          t={t}
          cara={{ giro: 0, sonrisa: 0, parpado: cae > 0.5 ? 1 : 0, enojo: 0.6 * (1 - cae) }}
          bordes={[{ dx: 0, dy: -2.6, color: "#bcd0ff", op: 0.85 }]}
        />
        <Figura
          x={ex}
          P={eP}
          mira={1}
          look={JOVEN}
          t={t}
          cara={{ giro: suave(t, R.derrota, R.derrota + 0.4) * 0.8, sonrisa: suave(t, R.derrota, R.derrota + 0.4), parpado: 0, enojo: 0.7 * (1 - suave(t, R.derrota, R.derrota + 0.4)) }}
          bordes={[
            { dx: 0, dy: -2.8, color: "#cfdcff", op: 0.9 },
            { dx: 2.4, dy: -0.4, color: "#ff8a6a", op: 0.5 },
          ]}
        />
      </Capa>

      {/* cuerdas de adelante, desenfocadas */}
      <Capa D={820} cam={cam}>
        {[230, 300].map((y, i) => (
          <line key={i} x1={-2000} x2={2000} y1={y} y2={y} stroke="#8a1e1e" strokeWidth={12} />
        ))}
      </Capa>
    </AbsoluteFill>
  );
};
