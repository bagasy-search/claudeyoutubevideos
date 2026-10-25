import React from "react";
import { AbsoluteFill } from "remotion";
import { F, SUELO, at, clamp, lerp, seco, suave } from "./lib";
import { CIVIL, OFICIAL, LETRA, Lam, Linterna, Papiro, Trazo, Cartel, fondo, util, suelo, PISOS, PisoCapas, Polvo } from "./kit";
import { Act, Actor, camara, FIRMA, JURA, QUIETO, FIRME, TRISTE, sacudon } from "./actor";
import { SENTADO, con } from "./rig";
import { MesaMadera } from "./comun";

// ================= 0 → 4 s · el mapa: "Roma conquistó casi todo el mundo conocido con un ejército de voluntarios" =================
const FICHAS: [number, number][] = [
  [-60, -40], [-230, -150], [-420, -60], [-560, 80], [120, 60], [300, -120], [460, 40], [620, 150], [-130, 200], [260, 230], [-720, -200], [700, -60],
];
export const Mapa: React.FC<{ t: number }> = ({ t }) => {
  const cam = camara(t, [[0, -40, -10, 60], [4.2, -20, 0, 240]], 4);
  const tVol = at("army of volunteers");
  return (
    <AbsoluteFill style={{ backgroundColor: "#24170e" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("mapa", 0.8, 0, 0)]}>
        {/* las rutas de la conquista salen de Roma y se dibujan mientras habla */}
        {FICHAS.map(([x, y], i) => {
          const t0 = 0.3 + i * 0.22;
          const u = seco(t, t0, t0 + 0.9);
          const d = `M-60,-40 Q${(x - 60) / 2},${(y - 40) / 2 - 80} ${x},${y}`;
          return <Trazo key={i} d={d} u={u} w={7} largo={900} guiones />;
        })}
        {FICHAS.map(([x, y], i) => {
          const t0 = 1.0 + i * 0.22;
          const u = seco(t, t0, t0 + 0.35);
          if (u <= 0) return null;
          return (
            <g key={"f" + i} transform={`translate(${x},${y}) scale(${u})`}>
              <ellipse cx={6} cy={34} rx={20} ry={6} fill="#1a0c04" opacity={0.4} />
              <path d="M-18,-30 L18,-30 L18,22 Q0,36 -18,22 Z" fill="#a3241c" />
              <path d="M-18,-30 L18,-30" stroke="#d8473a" strokeWidth={4} />
              <circle cx={0} cy={-2} r={6} fill="#d8b04a" />
            </g>
          );
        })}
      </Lam>
      <Lam D={900} cam={cam}>
        <Cartel x={-60} y={-330} texto="VOLUNTEERS" sub="NOT SLAVES · NOT CONSCRIPTS" t={t} t0={tVol + 0.1} fs={70} />
      </Lam>
      <Linterna x={0} y={0} r={760} osc={0.35} />
    </AbsoluteFill>
  );
};

// ================= 4 → 10,9 s y 33,3 → 39,2 s · la mesa de reclutamiento en la plaza de armas =================
const MESA_X = 330;
export const Parada: React.FC<{ t: number }> = ({ t }) => {
  const tCad = at("in chains");
  const tWalk = at("They walked up");
  const tSign = at("they signed");
  const tOath = at("swore an oath");
  const tContrato = at("read the contract");
  const tMitad = at("roughly half");
  const tNunca = at("never lived long");
  const insertoFin = tMitad - 0.05;
  const vuelta = t >= insertoFin;
  // primera parte: la fila llega a la mesa; segunda: diez reclutas en fila, la mitad no llega
  const cam = !vuelta
    ? camara(t, [
        [4.0, -560, -10, 220],
        [tWalk, -380, -20, 260],
        [tSign + 0.6, 80, -40, 380],
        [tOath + 1.2, 140, -60, 300],
        [tContrato + 0.8, MESA_X - 40, -10, 640],
      ], 7)
    : camara(t, [
        [insertoFin, 20, -60, 120],
        [tNunca + 2.5, 0, -50, 220],
      ], 5);
  const fila: Actor[] = !vuelta
    ? [0, 1, 2, 3, 4].map((i) => ({
        look: { ...CIVIL, tunica: ["#c9a26a", "#b8875a", "#d1b07a", "#a97a4e", "#c7a575"][i], barba: i % 2 === 1 },
        ruta: [[4.0, -980 - i * 170], [tWalk - 0.1, -980 - i * 170], [tSign - 0.1, MESA_X - 180 - i * 140]],
        poses: i === 0 ? [[0, QUIETO], [tSign + 0.25, FIRMA, 0.35], [tSign + 1.2, QUIETO, 0.4], [tOath + 0.3, JURA, 0.4]] : [[0, QUIETO], [tOath + 0.3 + i * 0.08, JURA, 0.4]],
        seed: i + 2,
      }))
    : Array.from({ length: 10 }, (_, i) => {
        const cae = i % 2 === 1;
        const tc = tNunca + 0.2 + [0, 0.5, 0.2, 0.9, 0.35, 1.2, 0.7, 0.1, 1.0, 0.55][i];
        return {
          look: { ...CIVIL, tunica: ["#c9a26a", "#b8875a", "#d1b07a", "#a97a4e", "#c7a575"][i % 5], barba: i % 3 === 0 },
          ruta: [[0, -760 + i * 170]],
          poses: [[0, FIRME]],
          rot: cae ? (tt: number) => -86 * seco(tt, tc, tc + 0.45) : undefined,
          op: cae ? (tt: number) => 1 - 0.75 * suave(tt, tc + 0.5, tc + 1.4) : undefined,
          seed: i + 7,
        } as Actor;
      });
  const oficial: Actor = { look: OFICIAL, ruta: [[0, MESA_X + 110]], mira: -1, poses: [[0, con(SENTADO, { brazo: [40, 20], ante: [80, 60] })], [tSign + 0.3, con(SENTADO, { brazo: [70, 20], ante: [60, 60], torso: 6 }), 0.4]], seed: 9, sinSombra: true };
  return (
    <AbsoluteFill style={{ backgroundColor: "#22150c" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("parada", 0.8)]} />
      <PisoCapas cam={cam} piso={PISOS.tierra} />
      {!vuelta && (
        <Lam D={1000} cam={cam} sombra fotos={[util("mesa", MESA_X, 1000, 300)]}>
          {/* cadenas rotas tiradas en el piso: a nadie lo trajeron encadenado */}
          <g opacity={seco(t, tCad - 0.4, tCad)}>
            {Array.from({ length: 9 }, (_, i) => (
              <ellipse key={i} cx={-820 + i * 24} cy={SUELO - 6 - (i % 2) * 3} rx={14} ry={8} fill="none" stroke="#5d5f63" strokeWidth={6} transform={`rotate(${i % 2 ? 70 : 0} ${-820 + i * 24} ${SUELO - 6})`} />
            ))}
            <ellipse cx={-590} cy={SUELO - 6} rx={14} ry={8} fill="none" stroke="#5d5f63" strokeWidth={6} strokeDasharray="60 30" />
          </g>
          <Act t={t} a={oficial} />
          {fila.map((a, i) => (
            <Act key={i} t={t} a={a} />
          ))}
        </Lam>
      )}
      {vuelta && (
        <Lam D={1000} cam={cam} sombra>
          {fila.map((a, i) => (
            <Act key={i} t={t} a={a} />
          ))}
          <Cartel x={0} y={-330} texto="1 IN 2" sub="NEVER COLLECTED" t={t} t0={tNunca + 0.4} color="#f3e6cf" fondoC="#a3241c" fs={86} />
        </Lam>
      )}
      <Lam D={800} cam={cam}>
        <Polvo t={t} n={30} seed={4} />
      </Lam>
      <Linterna
        x={!vuelta ? lerp(lerp(-260, 100, suave(t, tWalk, tSign)), 60, suave(t, tOath, tOath + 0.6)) : 0}
        y={!vuelta ? 40 : 30}
        r={!vuelta ? lerp(640, 900, suave(t, tOath, tOath + 0.6)) : lerp(1000, 760, suave(t, tNunca, tNunca + 1.5))}
        osc={!vuelta ? 0.42 : lerp(0.3, 0.6, suave(t, tNunca, tNunca + 1.5))}
      />
    </AbsoluteFill>
  );
};

// ================= 10,9 → 33,3 s · el contrato: cada cláusula se escribe cuando la voz la dice =================
export const Contrato: React.FC<{ t: number }> = ({ t }) => {
  const L = [
    { txt: "Service: 25 years", t: at("25 years of service") },
    { txt: "Marriage: forbidden", t: at("no wife"), rojo: true },
    { txt: "Pay, minus your food", t: at("your own food") },
    { txt: "minus your boots", t: at("your own boots") },
    { txt: "minus your tent", t: at("your own tent") },
    { txt: "Your centurion may beat you", t: at("beat you with a stick") },
    { txt: "Asleep on watch: death", t: at("fall asleep"), rojo: true },
    { txt: "Retirement package: real", t: at("retirement package") },
  ];
  const tGen = at("Generous even");
  const fs = 54;
  const paso = fs * 1.25;
  const top = -((L.length + 1.6) * paso + 40) / 2;
  const yLinea = (i: number) => top + (i + 2.2) * paso;
  // la cámara baja con la línea que se está escribiendo (de cerca), y al final se aleja para leer todo
  let idx = 0;
  L.forEach((l, i) => {
    if (t >= l.t - 0.2) idx = i;
  });
  const cyObj = yLinea(idx) - 40;
  const t0 = L[0].t - 1.0;
  const cam = camara(t, [
    [t0, -80, yLinea(0) - 120, 300],
    [L[0].t, -60, yLinea(0) - 40, 420],
    ...L.slice(1).map((l, i) => [l.t + 0.3, -40 + (i % 2) * 30, yLinea(i + 1) - 40, 430] as [number, number, number, number]),
    [tGen + 0.2, 0, -20, 140],
  ], 4);
  void cyObj;
  // pluma: va a la línea activa y escribe
  const l = L[idx];
  const pluma = seco(t, l.t - 0.15, l.t + 0.45);
  const px = -380 + pluma * Math.min(820, l.txt.length * fs * 0.42);
  const py = yLinea(idx) - 10 + Math.sin(t * 30) * 3 * (pluma < 1 ? 1 : 0);
  const fueraPluma = suave(t, tGen - 0.6, tGen);
  const sello = seco(t, tGen, tGen + 0.25);
  return (
    <AbsoluteFill style={{ backgroundColor: "#2a170b" }}>
      <MesaMadera cam={cam} />
      <Lam D={1000} cam={cam} sombra>
        <Papiro x={0} y={0} w={940} t={t} t0={t0} titulo="SACRAMENTUM · CONTRACT" lineas={L} fs={fs} />
        {/* la pluma de caña */}
        <g transform={`translate(${px + 40 * fueraPluma},${py - 300 * fueraPluma}) rotate(-35)`} opacity={1 - fueraPluma}>
          <path d="M0,0 L-8,-150 Q-2,-210 18,-260 Q22,-200 10,-150 Z" fill="#efe3cc" />
          <path d="M0,0 L-8,-150" stroke="#8a5a2e" strokeWidth={4} />
          <path d="M-3,-4 L3,-4 L0,8 Z" fill="#1a120a" />
        </g>
        {sello > 0 && (
          <g transform={`translate(260,${yLinea(L.length - 1) + 10}) rotate(-9) scale(${lerp(1.8, 1, sello)})`} opacity={sello}>
            <rect x={-150} y={-46} width={300} height={84} rx={8} fill="none" stroke="#a3241c" strokeWidth={8} />
            <text x={0} y={18} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={52} fill="#a3241c" letterSpacing={4}>
              GENEROUS
            </text>
          </g>
        )}
      </Lam>
      <Linterna x={0} y={0} r={820} osc={0.5} />
    </AbsoluteFill>
  );
};

export const _usa = { F, clamp, suelo, TRISTE, sacudon };
