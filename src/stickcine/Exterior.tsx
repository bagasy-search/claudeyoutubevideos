import React from "react";
import { AbsoluteFill } from "remotion";
import { Capa, Cam, F, SUELO, andar, clamp, curva, lerp, recorrido, rnd, suave } from "./lib";
import { Figura, PARADO, caminar, con, giros, mezclar, secuencia } from "./rig";
import { ERNESTO } from "./Cafe";

// La calle al atardecer: el sol cae fuera de cuadro a la izquierda (borde de luz desde la izquierda,
// sombras largas hacia la derecha). Ernesto camina hasta la puerta del café y entra.
const PUERTA = [470, 590] as const;

export const camExterior = (t: number): Cam => {
  const r = recorrido(t, [
    [0, -500, 0, 0],
    [3.5, -60, 0, 60],
    [6.2, 380, 10, 160],
    [7.3, 530, 120, 420],
    [7.9, 530, 150, 680],
  ]);
  return { ...r, foco: curva(t, [[0, 2600], [1.4, 2600], [2.6, F]]), ap: curva(t, [[0, 12], [3, 9], [7.3, 14]]) };
};

const ernestoExt = (t: number) => {
  const mov = andar(t, [[0.8, -900], [7.0, 530]], 240);
  const fase = (2 * Math.PI * mov.dist) / 210;
  const EMPUJA = con(PARADO, { brazo: [80, -3], ante: [86, 2], torso: 8 });
  let P = secuencia(t, [[0, PARADO], [6.95, EMPUJA, 0.3]]);
  if (mov.amp > 0.01) P = mezclar(P, caminar(fase, 1), clamp(mov.amp, 0, 1));
  P = { ...P, torso: P.torso + Math.sin(t * 2.1) * 0.8 };
  const { mira, bump } = giros(t, 1, []);
  // pasa el umbral y la puerta lo tapa
  const x = mov.x + 40 * suave(t, 7.3, 7.8);
  return { x, P, mira, bump, op: 1 - suave(t, 7.35, 7.7) };
};

export const Exterior: React.FC<{ t: number }> = ({ t }) => {
  const cam = camExterior(t);
  const E = ernestoExt(t);
  const abre = suave(t, 7.0, 7.4);
  const r = rnd(11);
  const ventanas = Array.from({ length: 90 }, () => ({ x: -3200 + r() * 6400, y: -900 + r() * 700, on: 1 + r() * 6, c: r() }));
  const torres = Array.from({ length: 26 }, (_, i) => ({ x: -3400 + i * 270, w: 180 + r() * 140, h: 500 + r() * 700 }));
  const luzCartel = 0.55 + 0.45 * suave(t, 2.0, 2.8);

  return (
    <AbsoluteFill style={{ backgroundColor: "#2a1a2e" }}>
      {/* cielo */}
      <Capa D={6000} cam={cam} sinDesenfoque>
        <defs>
          <linearGradient id="cielo" x1="0" y1={-2600} x2="0" y2={400} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#1e1838" />
            <stop offset="0.45" stopColor="#6a3a5e" />
            <stop offset="0.75" stopColor="#e2745a" />
            <stop offset="1" stopColor="#ffc07a" />
          </linearGradient>
          <radialGradient id="solHalo">
            <stop offset="0" stopColor="#ffe2a8" stopOpacity="0.95" />
            <stop offset="0.25" stopColor="#ffab6a" stopOpacity="0.45" />
            <stop offset="1" stopColor="#ff7a50" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x={-6000} y={-3000} width={12000} height={4000} fill="url(#cielo)" />
        <circle cx={-2300} cy={60} r={1300} fill="url(#solHalo)" />
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx={-600 + i * 1500 + t * 6} cy={-900 + i * 200} rx={700} ry={50} fill="#ffb08a" opacity={0.18} />
        ))}
      </Capa>

      {/* ciudad lejana con ventanas que se van prendiendo */}
      <Capa D={2600} cam={cam}>
        {torres.map((b, i) => (
          <rect key={i} x={b.x} y={SUELO - b.h} width={b.w} height={b.h + 400} fill={i % 2 ? "#3a2440" : "#2e1d36"} />
        ))}
        {ventanas.map((v, i) => (
          <rect key={i} x={v.x} y={v.y} width={14} height={20} fill={v.c > 0.5 ? "#ffd59a" : "#ffb870"} opacity={0.85 * suave(t, v.on, v.on + 0.6)} />
        ))}
      </Capa>

      {/* edificio de ladrillo a la izquierda y vereda */}
      <Capa D={1300} cam={cam}>
        <rect x={-2600} y={-900} width={1200} height={1300} fill="#4a2a24" />
        {Array.from({ length: 30 }, (_, i) => (
          <line key={i} x1={-2600} x2={-1400} y1={-880 + i * 40} y2={-880 + i * 40} stroke="#3a1f1a" strokeWidth={3} opacity={0.6} />
        ))}
        {[0, 1, 2].map((i) => (
          <rect key={i} x={-2450 + i * 360} y={-500} width={200} height={260} fill="#ffcf8a" opacity={0.25 + 0.35 * suave(t, 1 + i, 1.6 + i)} />
        ))}
        <rect x={-1400} y={-200} width={180} height={600} fill="#2e1c22" />
      </Capa>

      {/* PLANO DEL PERSONAJE: vereda + fachada del café */}
      <Capa D={F} cam={cam}>
        <defs>
          <linearGradient id="vereda" x1="0" y1={SUELO} x2="0" y2={900} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#8a5a4a" />
            <stop offset="0.3" stopColor="#5a3a36" />
            <stop offset="1" stopColor="#24161c" />
          </linearGradient>
          <linearGradient id="fachada" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f0c89a" />
            <stop offset="1" stopColor="#c89a7a" />
          </linearGradient>
          <linearGradient id="vidrio" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffd9a0" />
            <stop offset="1" stopColor="#ff9f5a" />
          </linearGradient>
          <filter id="glowE" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id="sombraE" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        <rect x={-5000} y={SUELO} width={10000} height={2000} fill="url(#vereda)" />
        {Array.from({ length: 30 }, (_, i) => (
          <line key={i} x1={-3000 + i * 220} x2={-3000 + i * 220 - 90} y1={SUELO} y2={SUELO + 120} stroke="#4a2e2c" strokeWidth={2} opacity={0.5} />
        ))}
        <rect x={-5000} y={SUELO + 120} width={10000} height={10} fill="#3a2428" />
        {/* fachada */}
        <rect x={250} y={-420} width={900} height={720} fill="url(#fachada)" />
        <rect x={250} y={-420} width={900} height={720} fill="#2a1420" opacity={0.25} />
        {/* toldo a rayas */}
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M${250 + i * 100},-160 L${350 + i * 100},-160 L${360 + i * 100},-80 L${260 + i * 100},-80 Z`} fill={i % 2 ? "#f2e6d6" : "#a8332a"} />
        ))}
        {/* cartel CAFÉ */}
        <text x={700} y={-240} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={130} fill="#ffcf7a" filter="url(#glowE)" opacity={luzCartel}>
          CAFÉ
        </text>
        <text x={700} y={-240} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={130} fill="#fff1d0" opacity={0.6 + 0.4 * luzCartel}>
          CAFÉ
        </text>
        {/* vidriera con el interior cálido y siluetas de clientes */}
        <rect x={680} y={-50} width={420} height={330} fill="url(#vidrio)" />
        <rect x={680} y={-50} width={420} height={330} fill="#ffc47a" filter="url(#glowE)" opacity={0.5} />
        {[760, 900, 1010].map((sx, i) => (
          <g key={i} opacity={0.35} filter="url(#glowE)">
            <circle cx={sx} cy={130} r={16} fill="#5a3018" />
            <path d={`M${sx},146 L${sx},230 M${sx},170 L${sx + 22},190`} stroke="#5a3018" strokeWidth={8} strokeLinecap="round" />
          </g>
        ))}
        <rect x={680} y={-50} width={420} height={330} fill="none" stroke="#2a1410" strokeWidth={12} />
        {/* puerta de vidrio (se abre hacia adentro: se angosta) */}
        <rect x={PUERTA[0]} y={-30} width={PUERTA[1] - PUERTA[0]} height={330} fill="#2a1a16" />
        <rect
          x={PUERTA[0]}
          y={-30}
          width={(PUERTA[1] - PUERTA[0]) * (1 - 0.8 * abre)}
          height={330}
          fill="url(#vidrio)"
          stroke="#2a1410"
          strokeWidth={10}
          opacity={0.9}
        />
        {/* charco de luz cálida en la vereda */}
        <ellipse cx={890} cy={SUELO + 30} rx={330} ry={40} fill="#ffb870" opacity={0.35} filter="url(#glowE)" />

        {/* sombra larga hacia la derecha y de contacto */}
        <g opacity={0.45 * E.op}>
          <ellipse cx={E.x + 150} cy={SUELO + 5} rx={170} ry={9} fill="#1a0c14" filter="url(#sombraE)" />
          <ellipse cx={E.x} cy={SUELO + 3} rx={42} ry={7} fill="#000" filter="url(#sombraE)" />
        </g>
        <Figura
          x={E.x}
          P={E.P}
          mira={E.mira}
          look={ERNESTO}
          t={t}
          opacidad={E.op}
          cara={{ giro: E.bump, sonrisa: 0.5, parpado: Math.max(0, 1 - Math.abs(t - 3.3) / 0.08) }}
          bordes={[
            { dx: -2.8, dy: -0.8, color: "#ffb07a", op: 0.9 },
            { dx: 0, dy: -2.2, color: "#ffd0a0", op: 0.4 },
          ]}
        />
        {/* marco de la puerta por delante del personaje cuando entra */}
        <rect x={PUERTA[1]} y={-40} width={20} height={340} fill="#2a1410" opacity={suave(t, 7.1, 7.3)} />
      </Capa>

      {/* primer plano desenfocado: farol y macetero */}
      <Capa D={560} cam={cam}>
        <rect x={-640} y={-1200} width={30} height={1800} fill="#1a1016" />
        <circle cx={-625} cy={-520} r={60} fill="#ffd59a" opacity={0.4 + 0.5 * suave(t, 1.5, 2.6)} />
        <rect x={1150} y={360} width={260} height={260} rx={10} fill="#1e1216" />
        {Array.from({ length: 7 }, (_, i) => (
          <ellipse
            key={i}
            cx={1280 + Math.cos((i / 7) * Math.PI) * 120}
            cy={340 - Math.sin((i / 7) * Math.PI) * 90}
            rx={80}
            ry={26}
            transform={`rotate(${-180 + (i / 7) * 180 + 90} ${1280 + Math.cos((i / 7) * Math.PI) * 120} ${340 - Math.sin((i / 7) * Math.PI) * 90})`}
            fill="#1a2412"
          />
        ))}
      </Capa>

      {/* polvo en la luz del sol */}
      <Capa D={800} cam={cam} mezcla="screen" sinDesenfoque>
        {Array.from({ length: 40 }, (_, i) => {
          const rr = rnd(100 + i);
          const x0 = -1400 + rr() * 2800;
          const y0 = -500 + rr() * 900;
          return (
            <circle
              key={i}
              cx={x0 + Math.sin(t * 0.4 + i) * 30 + t * 8}
              cy={y0 + Math.cos(t * 0.3 + i) * 20}
              r={1.5 + rr() * 2}
              fill="#ffe2b0"
              opacity={lerp(0.15, 0.45, rr())}
            />
          );
        })}
      </Capa>
    </AbsoluteFill>
  );
};
