import React from "react";
import { AbsoluteFill } from "remotion";
import { F, SUELO, at as atG, clamp, lerp, seco, suave } from "./lib";
import { RECLUTA, LEGIO, LEGIO_ESC, CENTURION, LETRA, Lam, Linterna, Papiro, Cartel, Numero, fondo, util, PISOS, PisoCapas, Polvo, Palotes, Trazo } from "./kit";
import { Act, Actor, camara, sacudon, QUIETO, FIRME, ALZA_ARMA, GOLPE, GOLPE_BAJO, AGOTADO, NADA_A, NADA_B, LANZA_CARGA, LANZA_SUELTA, ESCUDO_FRENTE, ESTOCADA, RODILLA, TRISTE, SEÑALA, MANOS_CADERA } from "./actor";
import { con, mezclar, secuencia } from "./rig";

// ================= 165,6 → 185,1 · el campo: tyro, espada de madera que pesa el doble, el poste =================
export const Campo: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const tTyro = at("you are a tyro");
  const tSufre = at("your new job is to suffer");
  const tDos = at("Twice a day");
  const tMad = at("wooden sword");
  const tDoble = at("weigh twice as much");
  const tPoste = at("You hit a wooden post");
  const tCab = at("its head");
  const tRod = at("its knees");
  const tCost = at("its ribs");
  const tBraz = at("arms stop answering");
  const POSTE = 160;
  // golpes: cada palabra es un golpe; entre medio, golpes de relleno ("again and again")
  const golpes = [tPoste + 0.5, tPoste + 1.0, tPoste + 1.5, tCab, tRod, tCost, tCost + 0.55, tCost + 1.05];
  let pose = secuencia(t, [[t0, FIRME], [tMad, con(FIRME, { brazo: [40, 44], ante: [60, 64] }), 0.4], [tDoble + 0.2, con(AGOTADO, { brazo: [16, 30], ante: [16, 50] }), 0.6], [tPoste - 0.4, ESCUDO_FRENTE, 0.4]], true);
  let ultimo = -1;
  golpes.forEach((g) => {
    if (t > g - 0.35) ultimo = g;
  });
  if (ultimo > 0 && t < tBraz) {
    const u = t - (ultimo - 0.35);
    const bajo = ultimo === tRod;
    const G = bajo ? GOLPE_BAJO : GOLPE;
    pose = u < 0.22 ? mezclar(ESCUDO_FRENTE, ALZA_ARMA, u / 0.22) : u < 0.35 ? mezclar(ALZA_ARMA, G, (u - 0.22) / 0.13) : mezclar(G, ESCUDO_FRENTE, clamp((u - 0.35) / 0.3, 0, 1));
  }
  if (t >= tBraz) pose = mezclar(ESCUDO_FRENTE, AGOTADO, suave(t, tBraz, tBraz + 0.6));
  const tu: Actor = {
    look: { ...RECLUTA, arma: "madera", escudo: "#b08a4a" },
    ruta: [[0, POSTE - 120]],
    poses: [[0, pose]],
    cara: (tt) => ({ enojo: tt > tPoste && tt < tBraz ? 0.5 : 0, boca: tt > tBraz ? 0.6 : 0.12, parpado: tt > tBraz ? 0.5 : 0 }),
    seed: 2,
  };
  const instructor: Actor = { look: CENTURION, ruta: [[0, -320]], poses: [[0, MANOS_CADERA], [tSufre, SEÑALA, 0.4], [tDos + 1, MANOS_CADERA, 0.4]], seed: 9 };
  const ultimoG = golpes.filter((g) => g <= t).pop() ?? -10;
  const sac = t < tBraz ? sacudon(t, ultimoG, 5) : 0;
  const cam0 = camara(t, [
    [t0, -200, -60, 180],
    [tDos, -120, -60, 300],
    [tDoble + 0.3, 20, -40, 420],
    [tPoste + 0.4, 60, -40, 380],
    [tCost + 0.5, 90, -30, 470],
    [tBraz + 1.4, 60, -40, 400],
  ], 7);
  const cam = { ...cam0, cy: cam0.cy + sac };
  const astillas = golpes.map((g, i) => {
    const u = t - g;
    if (u < 0 || u > 0.7) return null;
    const yG = g === tCab ? 40 : g === tRod ? 220 : 130;
    return (
      <g key={i}>
        {[0, 1, 2, 3].map((k) => (
          <rect key={k} x={POSTE - 20 + 90 * u * (k % 2 ? 1 : -0.4) + k * 4} y={yG - 120 * u + 300 * u * u + k * 6} width={9} height={5} fill="#c99a5e" transform={`rotate(${k * 50 + u * 400} ${POSTE} ${yG})`} />
        ))}
      </g>
    );
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#22160c" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("campo", 0.8)]} />
      <PisoCapas cam={cam} piso={PISOS.tierra} />
      <Lam D={1000} cam={cam} sombra fotos={[util("poste", POSTE, 1000, 120)]}>
        <Act t={t} a={instructor} />
        <Act t={t} a={tu} />
        {astillas}
      </Lam>
      <Lam D={880} cam={cam}>
        <Cartel x={-420} y={-330} texto="TYRO" sub="FIRST 4 MONTHS" t={t} t0={tTyro} t1={tDos} fs={78} />
        <Cartel x={-60} y={-330} texto="TWICE A DAY" t={t} t0={tDos} t1={tDoble} fs={70} />
        <Numero x={20} y={-300} t={t} t0={tDoble + 0.3} t1={tPoste + 0.2} a={2} pre="×" suf=" WEIGHT" fs={120} color="#f3e6cf" />
      </Lam>
      <Lam D={1000} cam={cam}>
        {[
          [tCab, "HEAD", 30],
          [tRod, "KNEES", 230],
          [tCost, "RIBS", 140],
        ].map(([g, txt, y], i) => {
          const u = seco(t, g as number, (g as number) + 0.25);
          const v = suave(t, (g as number) + 1.1, (g as number) + 1.5);
          if (u <= 0 || v >= 1) return null;
          return (
            <text key={i} x={POSTE + 90} y={y as number} fontFamily={LETRA} fontWeight={700} fontSize={56 * u} fill="#f3e6cf" stroke="#2a1a10" strokeWidth={4} paintOrder="stroke" opacity={1 - v}>
              {txt as string}
            </text>
          );
        })}
      </Lam>
      <Lam D={760} cam={cam}>
        <Polvo t={t} n={24} seed={21} />
      </Lam>
      <Linterna x={lerp(-80, 120, suave(t, tDoble, tPoste))} y={60} r={720} osc={0.42} />
    </AbsoluteFill>
  );
};

// ================= 185,1 → 200,6 · el río: nadar con armadura, saltar al caballo, tirar el pilum (que se dobla) =================
export const Rio: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const tNada = at("learn to swim");
  const tArm = at("in armor");
  const tCab = at("vault onto a horse");
  const tLados = at("from both sides");
  const tPil = at("throw the pilum");
  const tDobla = at("designed to bend");
  const tVuelve = at("cannot throw it back");
  const CAB = 620;
  const LANZ = 1180;
  const BLANCO = 1780;
  // nadando (antes del salto al caballo), luego camina al caballo, después al punto de lanzamiento
  const nadando = t < tCab - 0.9;
  const fase = t * 4.2;
  const nado = mezclar(NADA_A, NADA_B, (Math.sin(fase) + 1) / 2);
  const salto = suave(t, tCab - 0.1, tCab + 0.55);
  const sube = seco(t, tCab, tCab + 0.45);
  const baja = suave(t, tLados + 0.6, tLados + 1.1);
  const lanza = (() => {
    if (t < tPil - 0.2) return con(QUIETO, { brazo: [40, -4], ante: [80, 4] });
    const u = t - (tPil + 0.3);
    if (u < 0) return mezclar(QUIETO, LANZA_CARGA, suave(t, tPil - 0.2, tPil + 0.3));
    return u < 0.18 ? mezclar(LANZA_CARGA, LANZA_SUELTA, u / 0.18) : LANZA_SUELTA;
  })();
  const tu: Actor = {
    look: { ...LEGIO, arma: t < tPil + 0.48 && t > tPil - 0.5 ? "pilum" : undefined, armaAng: t < tPil + 0.3 ? 72 : undefined },
    ruta: nadando ? [[0, lerp(-700, -260, suave(t, t0, tCab - 1))]] : [[tCab - 0.9, -60], [tCab - 0.1, CAB - 90], [tLados + 1.1, CAB - 90], [tPil - 0.4, LANZ]],
    poses: nadando ? [[0, nado]] : t < tLados + 1.1 ? [[0, con(QUIETO, { muslo: [80, -60], pierna: [10, -10], brazo: [60, 40], ante: [90, 80] })]] : [[0, lanza]],
    dy: nadando ? () => 40 + 6 * Math.sin(fase * 2) : (tt) => (tt < tLados + 1.1 ? -110 * sube * (1 - baja) - 60 * Math.sin(Math.PI * clamp((tt - tCab + 0.1) / 0.65, 0, 1)) * (1 - salto * 0) : 0),
    sinSombra: nadando,
    cara: (tt) => ({ boca: tt < tCab ? 0.5 : 0.12, sonrisa: tt > tCab + 0.6 && tt < tPil ? 0.5 : 0.1 }),
    seed: 3,
  };
  // el pilum vuela en arco y se clava en el escudo blanco; ahí se dobla el cuello de hierro
  const vuelo = clamp((t - (tPil + 0.48)) / 0.8, 0, 1);
  const px = lerp(LANZ + 40, BLANCO - 30, vuelo);
  const py = lerp(60, 120, vuelo) - 260 * Math.sin(Math.PI * vuelo) * 0.9;
  const ang = Math.atan2(lerp(-1, 1, vuelo) * 0.9, 1) * (180 / Math.PI);
  const dobla = suave(t, tDobla, tDobla + 0.6);
  const cam = camara(t, [
    [t0, -480, -20, 220],
    [tArm + 0.4, -360, 0, 360],
    [tCab - 0.4, CAB - 300, -50, 260],
    [tLados + 0.6, CAB - 180, -80, 330],
    [tPil + 0.6, LANZ + 160, -60, 220],
    [tDobla + 0.3, BLANCO - 220, -40, 420],
    [tVuelve + 1.6, BLANCO - 280, -40, 380],
  ], 7);
  return (
    <AbsoluteFill style={{ backgroundColor: "#1d2422" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("rio", 0.8, 300)]} />
      <PisoCapas cam={cam} piso={PISOS.pasto} />
      <Lam D={1000} cam={cam} sombra fotos={[util("caballo", CAB, 1000, 260)]}>
        <Act t={t} a={tu} />
        {/* el escudo blanco del tiro al blanco */}
        <g>
          <rect x={BLANCO - 8} y={SUELO - 190} width={16} height={190} fill="#5a3a22" />
          <ellipse cx={BLANCO} cy={SUELO - 140} rx={70} ry={86} fill="#e8dcc4" />
          <ellipse cx={BLANCO} cy={SUELO - 140} rx={42} ry={54} fill="none" stroke="#a3241c" strokeWidth={8} />
          <circle cx={BLANCO} cy={SUELO - 140} r={12} fill="#a3241c" />
        </g>
        {vuelo > 0 && (
          <g transform={`translate(${vuelo < 1 ? px : BLANCO - 30},${vuelo < 1 ? py : SUELO - 140}) rotate(${vuelo < 1 ? ang : 8})`}>
            <path d="M-170,0 L20,0" stroke="#8a5a2e" strokeWidth={6} strokeLinecap="round" />
            <rect x={14} y={-5} width={12} height={10} fill="#3a3430" />
            <path d={`M26,0 Q${60},${-dobla * 30} ${86 - dobla * 10},${dobla * 46}`} stroke="#7d8288" strokeWidth={3.4} fill="none" />
            <path d={`M${86 - dobla * 10},${dobla * 46} l8,-4 l-3,10 Z`} fill="#5d6166" />
          </g>
        )}
      </Lam>
      {/* el agua delante del nadador: tapa el cuerpo de la cintura para abajo */}
      <Lam D={990} cam={cam}>
        <path d={`M-1400,${SUELO - 40 + 4 * Math.sin(t * 2)} Q-1000,${SUELO - 48} -600,${SUELO - 40} T-120,${SUELO - 42} L-120,${SUELO + 600} L-1400,${SUELO + 600} Z`} fill="#2f5d66" opacity={0.92} />
        <path d={`M-1400,${SUELO - 40 + 4 * Math.sin(t * 2)} Q-1000,${SUELO - 48} -600,${SUELO - 40} T-120,${SUELO - 42}`} stroke="#9cc4c8" strokeWidth={5} fill="none" />
        {nadando && [0, 1, 2].map((k) => <ellipse key={k} cx={lerp(-700, -260, suave(t, t0, tCab - 1)) + 30 - k * 40 - ((t * 60) % 40)} cy={SUELO - 40} rx={18 - k * 4} ry={4} fill="#dfeef0" opacity={0.7 - k * 0.2} />)}
      </Lam>
      <Lam D={880} cam={cam}>
        <Cartel x={-420} y={-330} texto="IN ARMOR" t={t} t0={tArm} t1={tCab - 0.5} fs={72} />
        <Cartel x={CAB - 180} y={-360} texto="BOTH SIDES" sub="SWORD IN HAND" t={t} t0={tLados} t1={tPil} fs={66} />
        <Cartel x={BLANCO - 260} y={-360} texto="PILUM" sub="BENDS ON IMPACT" t={t} t0={tDobla} fs={70} />
      </Lam>
      <Linterna x={0} y={40} r={760} osc={0.4} />
    </AbsoluteFill>
  );
};

// ================= 200,6 → 231,2 · el camino: la marcha (20 millas en 5 horas) y la cebada de caballo =================
export const Ruta: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const t20 = at("20 Roman miles");
  const t24 = at("faster pace");
  const t35 = at("35 kilometers");
  const tMes = at("three times a month");
  const tIda = at("10 miles out");
  const tHab = at("keep the habit");
  const tCeb = at("wheat to barley");
  const tCab = at("Barley was horse food");
  const tIns = at("did not insult you");
  const tMula = at("fed you like a mule");
  const PARA = tCeb - 0.6; // la columna se detiene para la ración
  const vel = 150; // px/s de marcha
  const xCol = (tt: number) => -900 + vel * (Math.min(tt, PARA) - t0) + vel * 0.4 * suave(tt, PARA - 0.6, PARA);
  const columna: Actor[] = Array.from({ length: 6 }, (_, i) => ({
    look: { ...LEGIO_ESC, furca: true, barba: i === 3 },
    ruta: [[t0, xCol(t0) - i * 150], [PARA, xCol(PARA) - i * 150]],
    lenta: true,
    poses: [[0, QUIETO], [tMula, i === 0 ? con(QUIETO, { torso: 34, cabeza: 30, brazo: [60, 50], ante: [90, 80] }) : QUIETO, 0.6]],
    cara: (tt) => ({ boca: 0.2, parpado: tt > tHab ? 0.3 : 0 }),
    seed: 30 + i,
  }));
  const xF = xCol(t);
  const cam = camara(t, [
    [t0, xCol(t0) - 300, -50, 160],
    [t24, xCol(t24) - 260, -70, 300],
    [tMes, xCol(tMes) - 380, -60, 220],
    [tCeb, xCol(PARA) - 280, -50, 340],
    [tMula + 0.5, xCol(PARA) - 120, -10, 480],
    [tMula + 3.2, xCol(PARA) - 140, -20, 430],
  ], 6);
  const XC = xCol(PARA);
  const swap = suave(t, tCeb + 0.4, tCeb + 1.2);
  return (
    <AbsoluteFill style={{ backgroundColor: "#22180e" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("ruta", 0.8, 0), fondo("ruta", 0.8, 2624 * 0.8 - 2, -40)].slice(0, 1)} />
      <PisoCapas cam={cam} piso={PISOS.piedra} />
      <Lam D={1000} cam={cam} sombra>
        {/* el comedero de la ración: trigo dorado → cebada parda */}
        {t > tCeb - 0.8 && (
          <g opacity={suave(t, tCeb - 0.8, tCeb - 0.2)}>
            <path d={`M${XC + 30},${SUELO - 50} L${XC + 170},${SUELO - 50} L${XC + 150},${SUELO} L${XC + 50},${SUELO} Z`} fill="#6e4a2e" />
            <ellipse cx={XC + 100} cy={SUELO - 50} rx={70} ry={10} fill={swap < 0.5 ? "#e0b44c" : "#8f7a4e"} />
            <text x={XC + 100} y={SUELO - 70} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={32} fill="#f3e6cf" stroke="#2a1a10" strokeWidth={3} paintOrder="stroke">
              {swap < 0.5 ? "WHEAT" : "BARLEY"}
            </text>
          </g>
        )}
        {columna.map((a, i) => (
          <Act key={i} t={t} a={a} />
        ))}
      </Lam>
      <Lam D={880} cam={cam}>
        <Numero x={xF - 380} y={-300} t={t} t0={t20} t1={t24 - 0.1} a={20} suf=" MILES · 5 HOURS" fs={84} />
        <Numero x={xF - 380} y={-300} t={t} t0={t24} t1={t35 - 0.1} a={20} b={24} dur={0.6} suf=" MILES · FAST PACE" fs={84} color="#f3c27a" />
        <Numero x={xF - 380} y={-300} t={t} t0={t35} t1={tMes} a={0} b={35} dur={0.9} pre="≈ " suf=" KM BEFORE LUNCH" fs={84} />
        <Cartel x={xCol(tMes) - 360} y={-340} texto="3× A MONTH" sub="10 MILES OUT · 10 MILES BACK · FULL GEAR" t={t} t0={tMes} t1={tCeb - 0.3} fs={70} />
        <Cartel x={XC - 280} y={-340} texto="HORSE FOOD" t={t} t0={tCab} t1={tIns + 1} color="#f3e6cf" fondoC="#6e4a2e" fs={76} />
      </Lam>
      <Lam D={780} cam={cam}>
        <Polvo t={t} n={40} seed={5} color="#f1d7a6" />
      </Lam>
      <Linterna x={0} y={60} r={lerp(900, 640, suave(t, tMula, tMula + 1))} osc={lerp(0.32, 0.5, suave(t, tMula, tMula + 1))} />
    </AbsoluteFill>
  );
};

// ================= 231,2 → 253,8 · Josefo: el ejercicio es una batalla sin sangre, la batalla un ejercicio con sangre =================
export const Josefo: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const tJos = at("historian Josephus");
  const tPerd = at("from the losing side");
  const tSin = at("bloodless battles");
  const tCon = at("bloody drills");
  const tCump = at("did not mean it as a compliment");
  const tMil = at("a thousand times");
  const tMuere = at("except for the dying part");
  const sangre = suave(t, tCon - 0.2, tCon + 0.4);
  // dos filas que chocan una y otra vez (el ejercicio); en "bloody drills" las espadas de madera son de hierro
  const choque = (i: number) => (tt: number) => 60 * Math.sin(tt * 3.2 + i * 0.6);
  const filaA: Actor[] = [0, 1, 2].map((i) => ({
    look: { ...LEGIO_ESC, arma: sangre > 0.5 ? "gladio" : "madera", escudo: sangre > 0.5 ? "#a3241c" : "#b08a4a" },
    ruta: [[0, -360 - i * 150]],
    poses: [[0, ESTOCADA]],
    dy: () => 0,
    seed: 70 + i,
  }));
  const filaB: Actor[] = [0, 1, 2].map((i) => ({
    look: { ...LEGIO_ESC, tunica: "#3f5a7a", arma: sangre > 0.5 ? "gladio" : "madera", escudo: sangre > 0.5 ? "#3f5a7a" : "#b08a4a" },
    ruta: [[0, -140 + i * 150]],
    mira: -1,
    poses: [[0, ESCUDO_FRENTE]],
    seed: 80 + i,
  }));
  const vaiven = (tt: number) => (Math.sin(tt * 3.2) + 1) / 2;
  const v = vaiven(t);
  filaA.forEach((a) => (a.poses = [[0, mezclar(ESCUDO_FRENTE, ESTOCADA, v)]]));
  filaB.forEach((a) => (a.poses = [[0, mezclar(ESCUDO_FRENTE, con(ESCUDO_FRENTE, { torso: -8 }), v)]]));
  const muere = suave(t, tMuere, tMuere + 0.8);
  const caido: Actor = { ...filaB[0], rot: () => 80 * seco(t, tMuere + 0.1, tMuere + 0.6) };
  const cam = camara(t, [
    [t0, -260, -60, 160],
    [tSin, -250, -100, 300],
    [tCon + 0.4, -250, -60, 420],
    [tMil, -250, -50, 300],
    [tMuere + 1.6, -250, -30, 470],
  ], 6);
  return (
    <AbsoluteFill style={{ backgroundColor: "#1d1c1a" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("batalla", 0.8)]} filtro={`saturate(${lerp(1, 0.7, muere)})`} />
      <PisoCapas cam={cam} piso={PISOS.pasto} />
      <Lam D={1000} cam={cam} sombra>
        {filaA.map((a, i) => (
          <Act key={i} t={t} a={{ ...a, ruta: [[0, (a.ruta[0][1] as number) + choque(i)(t) * 0]] }} />
        ))}
        {filaB.slice(1).map((a, i) => (
          <Act key={i} t={t} a={a} />
        ))}
        <Act t={t} a={muere > 0 ? caido : filaB[0]} />
      </Lam>
      <Lam D={860} cam={cam}>
        <Cartel x={-520} y={-360} texto="JOSEPHUS" sub="HISTORIAN · WATCHED FROM THE LOSING SIDE" t={t} t0={tJos} t1={tSin - 0.9} fs={70} />
        <Papiro
          x={-260}
          y={-280}
          w={820}
          t={t}
          t0={tSin - 0.5}
          fs={46}
          lineas={[
            { txt: "Their drills are bloodless battles,", t: tSin },
            { txt: "and their battles are bloody drills.", t: tCon, rojo: true },
          ]}
        />
        {t > tMil - 0.2 && t < tMuere + 0.3 && <Palotes x={-700} y={-120} n={40} u={seco(t, tMil, tMil + 1.4)} h={44} color="#f3e6cf" />}
        <Cartel x={-260} y={-340} texto="×1000" sub="EVERYTHING BUT THE DYING" t={t} t0={tMil + 1.2} t1={tMuere + 2.4} fs={80} />
      </Lam>
      <Linterna x={-120} y={30} r={lerp(800, 560, muere)} osc={lerp(0.4, 0.66, muere)} />
    </AbsoluteFill>
  );
};

export const _t2 = { F, CENTURION, RODILLA, TRISTE, Polvo, Trazo, tPerdUso: 0 };
