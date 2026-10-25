import React from "react";
import { AbsoluteFill } from "remotion";
import { F, SUELO, at as atG, clamp, lerp, seco, suave } from "./lib";
import { RECLUTA, LEGIO, LEGIO_ESC, GERMANO, LETRA, Lam, Linterna, Papiro, Cartel, Numero, fondo, util, PISOS, PisoCapas, Polvo, Palotes, Trazo, Llama } from "./kit";
import { Act, Actor, camara, QUIETO, FIRME, AGOTADO, BEBE, CAVA_A, CAVA_B, SENTADO_SUELO, TRISTE, MANOS_CADERA, CARGA_HOMBRO, sacudon } from "./actor";
import { Look, con, mezclar } from "./rig";

// ================= 256,1 → 292,4 · el arsenal: lo que llevás encima, pieza por pieza =================
export const Taller: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const tCasco = at("Your helmet");
  const tArm = at("your armor");
  const t9 = at("9 kilos");
  const tEsc = at("your shield as tall");
  const tJab = at("two javelins");
  const tEsp = at("a sword");
  const tDaga = at("a dagger");
  const tPelea = at("just the fighting part");
  const tPalo = at("On a wooden pole");
  const tOlla = at("cooking pot");
  const tSierra = at("a saw");
  const tCesta = at("a basket");
  const tPico = at("a pickaxe");
  const tHoz = at("a sickle");
  const tBolsa = at("leather bag");
  const tCad = at("length of chain");
  const tEst = at("two wooden stakes");
  const tGrano = at("days of grain");
  const t30 = at("30 kilos");
  const tMulas = at("Marius's mules");
  const look: Look = {
    ...RECLUTA,
    tunica: "#a3241c",
    casco: t >= tCasco ? "#8a8f95" : undefined,
    armadura: t >= tArm ? "#7d8288" : undefined,
    escudo: t >= tEsc ? "#a3241c" : undefined,
    arma: t >= tJab && t < tPalo ? "pilum" : undefined,
    armaAng: 4,
    furca: t >= tPalo,
  };
  const carga = suave(t, tPalo, t30 + 1);
  const pose = mezclar(con(FIRME, { brazo: [16, 30], ante: [22, 50] }), con(AGOTADO, { brazo: [150, 30], ante: [196, 50], torso: 20 }), carga);
  const tu: Actor = { look, ruta: [[0, -120]], poses: [[0, t < tPalo ? con(FIRME, { brazo: [16, 30], ante: [22, 50] }) : pose]], cara: (tt) => ({ boca: tt > t30 ? 0.5 : 0.12, parpado: tt > t30 ? 0.3 : 0 }), seed: 5 };
  const sac = sacudon(t, tCasco, 3) + sacudon(t, tArm, 4) + sacudon(t, tEsc, 4) + sacudon(t, tPalo, 6);
  const cam0 = camara(t, [
    [t0, -60, -120, 340],
    [tCasco, -100, -170, 560],
    [tArm + 0.4, -100, -60, 520],
    [tJab, -60, -60, 360],
    [tPelea, -40, -60, 300],
    [tPalo + 0.4, 160, -120, 300],
    [tCad, 240, -100, 320],
    [t30, 60, -70, 260],
    [tMulas + 0.4, 200, -60, 240],
    [tMulas + 3.2, 230, -60, 300],
  ], 6);
  const cam = { ...cam0, cy: cam0.cy + sac };
  // espada y daga en la cintura (cartulina de colores, por código)
  const cin = (on: number, dx: number, L: number, c: string) =>
    on > 0 ? (
      <g opacity={on}>
        <rect x={-120 + dx} y={176} width={9} height={L} rx={3} fill={c} transform={`rotate(-14 ${-120 + dx} 176)`} />
        <rect x={-126 + dx} y={170} width={20} height={7} fill="#3a3430" transform={`rotate(-14 ${-120 + dx} 176)`} />
      </g>
    ) : null;
  return (
    <AbsoluteFill style={{ backgroundColor: "#22140b" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("taller", 0.8)]} />
      <PisoCapas cam={cam} piso={PISOS.piedra} />
      <Lam D={1000} cam={cam} sombra fotos={t > tMulas - 0.8 ? [util("mula", lerp(1100, 260, suave(t, tMulas - 0.8, tMulas + 1.2)), 1000, 330)] : []}>
        {cin(seco(t, tEsp, tEsp + 0.3), 0, 60, "#7d8288")}
        {cin(seco(t, tDaga, tDaga + 0.3), 30, 34, "#9aa0a6")}
        <Act t={t} a={tu} />
      </Lam>
      <Lam D={880} cam={cam}>
        <Numero x={-460} y={-260} t={t} t0={t9} t1={tEsc} a={9} suf=" KG OF IRON" fs={86} />
        <Cartel x={-440} y={-330} texto="JUST THE FIGHTING PART" t={t} t0={tPelea} t1={tPalo + 0.3} fs={56} />
        <Papiro
          x={560}
          y={-150}
          w={560}
          t={t}
          t0={tPalo - 0.2}
          titulo="ON THE POLE"
          fs={34}
          lineas={[
            { txt: "cooking pot", t: tOlla },
            { txt: "saw", t: tSierra },
            { txt: "basket for earth", t: tCesta },
            { txt: "pickaxe", t: tPico },
            { txt: "sickle", t: tHoz },
            { txt: "leather bag of clothes", t: tBolsa },
            { txt: "a length of chain", t: tCad },
            { txt: "two wooden stakes", t: tEst },
            { txt: "days of grain", t: tGrano },
          ]}
        />
        <Numero x={-380} y={-280} t={t} t0={t30} t1={tMulas - 0.2} a={0} b={30} dur={1} suf="+ KG" fs={130} color="#f3c27a" />
        <Cartel x={-60} y={-350} texto="MARIUS'S MULES" t={t} t0={tMulas + 0.2} fs={80} />
      </Lam>
      {/* el atado de la furca, grande, como inserto al lado del recluta */}
      <Lam D={900} cam={cam} sombra opacidad={suave(t, tPalo, tPalo + 0.5) * (1 - suave(t, t30 - 0.4, t30))} fotos={[util("furca", 160, 900, 300, -120)]} />
      <Linterna x={0} y={-20} r={lerp(640, 820, suave(t, tPalo, tPalo + 1))} osc={0.48} />
    </AbsoluteFill>
  );
};

// ================= 292,4 → 306,8 · Siria en julio: el enemigo de verdad es el calor =================
export const Desierto: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const tSeis = at("six hours");
  const tJul = at("in July");
  const tSiria = at("road in Syria");
  const tHacha = at("barbarian with an axe");
  const tCalor = at("It was heat");
  const tAmp = at("blisters");
  const tTob = at("twisted ankle");
  const tAgua = at("dirty water");
  const tSed = at("too thirsty to care");
  const tu: Actor = {
    look: { ...LEGIO_ESC, furca: true },
    ruta: [[t0, -700], [tAgua - 0.5, 60]],
    lenta: true,
    vel: 120,
    poses: [[0, con(QUIETO, { torso: 14, cabeza: 16 })], [tTob, con(AGOTADO, { muslo: [10, -20] }), 0.3], [tAgua + 0.3, con(QUIETO, { brazo: [40, -4], ante: [176, 4], torso: -6, cabeza: -16 }), 0.4]],
    dy: (tt) => (tt > tTob && tt < tAgua ? 4 * Math.abs(Math.sin(tt * 4)) : 0),
    cara: () => ({ parpado: 0.4, boca: 0.5 }),
    seed: 8,
  };
  const barb: Actor = { look: GERMANO, ruta: [[0, 420]], mira: -1, op: (tt) => tri(tt, tHacha - 0.3, tHacha, tHacha + 1.0, tHacha + 1.6) * 0.95, seed: 9 };
  const cam = camara(t, [
    [t0, -620, -80, 200],
    [tHacha, -260, -60, 230],
    [tCalor, -200, -40, 320],
    [tAgua, 40, -60, 430],
    [tSed + 1.4, 40, -40, 380],
  ], 6);
  const calor = 0.5 + 0.5 * Math.sin(t * 2);
  return (
    <AbsoluteFill style={{ backgroundColor: "#3a2410" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("desierto", 0.8)]} filtro={`brightness(${1.04 + 0.02 * calor})`} />
      <PisoCapas cam={cam} piso={PISOS.arena} />
      <Lam D={1000} cam={cam} sombra>
        <Act t={t} a={barb} />
        {t > tHacha + 0.4 && t < tHacha + 1.6 && (
          <path d="M340,-20 L500,300 M500,-20 L340,300" stroke="#a3241c" strokeWidth={14} strokeLinecap="round" opacity={tri(t, tHacha + 0.4, tHacha + 0.6, tHacha + 1.0, tHacha + 1.6)} />
        )}
        <Act t={t} a={tu} />
      </Lam>
      <Lam D={880} cam={cam}>
        <Cartel x={-760} y={-340} texto="6 HOURS · JULY · SYRIA" t={t} t0={tSeis} t1={tHacha - 0.4} fs={62} />
        {/* una palabra por vez, en el mismo lugar: cada una reemplaza a la anterior cuando la voz la dice */}
        <Cartel x={-260} y={-330} texto="HEAT" t={t} t0={tCalor} t1={tAmp - 0.45} fs={66} color="#f3e6cf" fondoC="#b5532f" />
        <Cartel x={-260} y={-330} texto="BLISTERS" t={t} t0={tAmp} t1={tTob - 0.45} fs={66} />
        <Cartel x={-260} y={-330} texto="ANKLE" t={t} t0={tTob} fs={66} />
        <Cartel x={420} y={-350} texto="DIRTY WATER" t={t} t0={tAgua} fs={58} color="#f3e6cf" fondoC="#55603a" />
      </Lam>
      <Lam D={800} cam={cam}>
        <Polvo t={t} n={50} seed={31} color="#fff1c8" />
      </Lam>
      <Linterna x={0} y={0} r={1000} osc={0.18} />
      <AbsoluteFill style={{ background: "rgba(255,170,60,0.10)", mixBlendMode: "soft-light" }} />
    </AbsoluteFill>
  );
};
const tri = (t: number, a: number, b: number, c: number, d: number) => Math.min(suave(t, a, b), 1 - suave(t, c, d));

// ================= 306,8 → 328,9 · el campamento de cada noche: zanja, muro, estacas, carpa =================
export const Campamento: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const tDesc = at("do you rest");
  const tNo = at("Of course not");
  const tNoche = at("Every single night");
  const tZanja = at("dig a ditch");
  const tMuro = at("throw the earth up");
  const tEst = at("plant those two stakes");
  const tCarpa = at("pitch your leather tent");
  const tSiete = at("seven other men");
  const cava = t > tZanja - 0.2 && t < tEst - 0.3;
  const pose = cava ? mezclar(CAVA_A, CAVA_B, (Math.sin(t * 5.5) + 1) / 2) : t < tNo + 0.3 ? SENTADO_SUELO : QUIETO;
  const tu: Actor = {
    look: { ...LEGIO, arma: cava ? "pala" : undefined },
    ruta: [[0, -200]],
    poses: [[0, pose]],
    cara: (tt) => ({ boca: tt > tDesc && tt < tNo + 0.4 ? 0.6 : 0.12, sonrisa: tt > tDesc && tt < tNo ? 0.4 : 0.05 }),
    seed: 10,
  };
  const otros: Actor[] = [0, 1, 2].map((i) => ({
    look: { ...LEGIO, arma: "pala", barba: i === 1 },
    ruta: [[0, -560 - i * 170]],
    poses: [[0, t > tNoche ? mezclar(CAVA_A, CAVA_B, (Math.sin(t * 5 + i * 1.7) + 1) / 2) : QUIETO]],
    seed: 11 + i,
  }));
  const muro = seco(t, tMuro, tMuro + 1.6);
  const estacas = seco(t, tEst + 0.3, tEst + 0.9);
  const carpa = seco(t, tCarpa + 0.2, tCarpa + 0.6);
  const cam = camara(t, [
    [t0, -260, -40, 260],
    [tNoche, -420, -80, 160],
    [tZanja + 0.4, -300, -40, 300],
    [tEst + 0.3, -60, -110, 340],
    [tCarpa + 0.4, 280, -60, 300],
    [tSiete + 1.5, 330, -60, 360],
  ], 7);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f1220" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("campamento", 0.8)]} />
      <PisoCapas cam={cam} piso={PISOS.noche} />
      <Lam D={1000} cam={cam} sombra fotos={carpa > 0 ? [{ ...util("carpa_ext", 420, 1000, 300), h: util("carpa_ext", 420, 1000, 300).h * carpa, y: SUELO - (util("carpa_ext", 420, 1000, 300).h * carpa) / 2 }] : []}>
        {/* el muro de tierra crece detrás de la zanja, y arriba las estacas */}
        <path d={`M-900,${SUELO} L-860,${SUELO - 120 * muro} L60,${SUELO - 130 * muro} L100,${SUELO} Z`} fill="#4a3424" />
        <path d={`M-860,${SUELO - 120 * muro} L60,${SUELO - 130 * muro}`} stroke="#6e5238" strokeWidth={5} />
        {estacas > 0 &&
          Array.from({ length: 14 }, (_, i) => {
            const x = -830 + i * 64;
            const h = 70 * seco(t, tEst + 0.3 + i * 0.04, tEst + 0.7 + i * 0.04);
            return <path key={i} d={`M${x - 7},${SUELO - 124 * muro} L${x},${SUELO - 124 * muro - h} L${x + 7},${SUELO - 124 * muro} Z`} fill="#8a5a2e" />;
          })}
        <Llama x={-980} y={SUELO - 150} t={t} palo={150} seed={2} />
        <Llama x={640} y={SUELO - 150} t={t} palo={150} seed={5} />
        {otros.map((a, i) => (
          <Act key={i} t={t} a={a} />
        ))}
        <Act t={t} a={tu} />
      </Lam>
      <Lam D={860} cam={cam}>
        <Cartel x={-500} y={-340} texto="EVERY NIGHT" sub="A NEW FORT FROM NOTHING" t={t} t0={tNoche} t1={tZanja + 1} fs={72} />
        <Cartel x={300} y={-350} texto="8 MEN · 1 TENT · 1 MULE" t={t} t0={tSiete} fs={60} />
      </Lam>
      <Linterna x={-80} y={20} r={760} osc={0.6} frio />
    </AbsoluteFill>
  );
};

// ================= 328,9 → 336,9 · dentro de la carpa: ocho hombres, cada noche, veinticinco años =================
export const Carpa: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const t25 = at("for 25 years");
  const tMañ = at("Tomorrow morning");
  const tOtra = at("do it all again");
  const durmientes: Actor[] = Array.from({ length: 8 }, (_, i) => ({
    look: { ...LEGIO, armadura: undefined, casco: undefined, tunica: "#a3241c", barba: i % 3 === 1 },
    ruta: [[0, -640 + i * 165]],
    poses: [[0, con(QUIETO, { brazo: [20, -10], ante: [40, 10], cabeza: 6 })]],
    rot: () => -90,
    dy: () => -6,
    sinSombra: true,
    cara: () => ({ parpado: 1, boca: 0.1 }),
    seed: 90 + i,
  }));
  const cam = camara(t, [
    [t0, -60, -40, 180],
    [t25, -20, -20, 300],
    [tMañ + 0.4, 0, -60, 220],
  ], 5);
  const vuelta = seco(t, tOtra - 0.2, tOtra + 0.8);
  return (
    <AbsoluteFill style={{ backgroundColor: "#120d0a" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("carpa", 0.8)]} />
      <PisoCapas cam={cam} piso={PISOS.barro} />
      <Lam D={1000} cam={cam} sombra>
        {durmientes.map((a, i) => (
          <g key={i} transform={`translate(${-210 + Math.sin(t * 1.3 + i) * 0},${-40 + 1.5 * Math.sin(t * 1.4 + i * 0.8)})`}>
            <Act t={t} a={a} />
          </g>
        ))}
        <Llama x={0} y={-330} t={t} s={0.6} seed={7} />
      </Lam>
      <Lam D={860} cam={cam}>
        <Palotes x={-560} y={-360} n={25} u={seco(t, t25 - 0.2, t25 + 1.2)} h={60} />
        {vuelta > 0 && (
          <g transform="translate(360,-300)" opacity={1 - suave(t, tOtra + 2.4, tOtra + 2.8)}>
            <Trazo d="M0,-90 A90,90 0 1,1 -88,20" u={vuelta} color="#f3e6cf" w={14} largo={560} />
            <path d="M-88,20 l-24,-30 l44,-6 Z" fill="#f3e6cf" opacity={vuelta > 0.95 ? 1 : 0} />
            <text x={0} y={18} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={44} fill="#f3e6cf">
              AGAIN
            </text>
          </g>
        )}
      </Lam>
      <Linterna x={0} y={-60} r={700} osc={0.62} />
    </AbsoluteFill>
  );
};

// ================= 336,9 → 362 · la muralla de Adriano: la empresa constructora más grande del mundo antiguo =================
export const Muralla: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const tSinG = at("no war at all");
  const tEmp = at("biggest construction company");
  const tCam = at("built the roads");
  const tPuen = at("bridges");
  const tCan = at("canals");
  const tFuer = at("forts, and aqueducts");
  const tAcu = at("aqueducts");
  const tAdr = at("Hadrian's Wall");
  const t73 = at("73 miles");
  const tLeg = at("mostly by legionaries");
  const tPala = at("the shovel you were issued");
  const tTrab = at("your real job");
  const obreros: Actor[] = Array.from({ length: 5 }, (_, i) => ({
    look: { ...LEGIO, armadura: undefined, casco: i % 2 ? undefined : "#8a8f95", arma: i % 2 ? "pala" : "madera", barba: i === 2 },
    ruta: [[0, -700 + i * 220]],
    mira: i % 2 ? 1 : -1,
    poses: [[0, mezclar(CAVA_A, CAVA_B, (Math.sin(t * (4.5 + i * 0.4) + i * 1.3) + 1) / 2)]],
    seed: 100 + i,
  }));
  const tu: Actor = {
    look: { ...LEGIO, arma: "pala", armaAng: 6 },
    ruta: [[0, 380]],
    mira: -1,
    poses: [[0, mezclar(CAVA_A, CAVA_B, (Math.sin(t * 5) + 1) / 2)], [tPala, con(FIRME, { brazo: [30, -4], ante: [150, 4] }), 0.5]],
    cara: (tt) => ({ parpado: tt > tTrab ? 0.3 : 0 }),
    seed: 120,
  };
  const cam = camara(t, [
    [t0, -300, -150, 120],
    [tCam, -200, -120, 200],
    [tAdr, -100, -160, 140],
    [t73 + 1, 0, -120, 200],
    [tPala - 0.2, 300, -80, 380],
    [tTrab + 1.6, 340, -100, 470],
  ], 6);
  const lista = [
    [tCam, "ROADS"],
    [tPuen, "BRIDGES"],
    [tCan, "CANALS"],
    [tFuer, "FORTS"],
    [tAcu, "AQUEDUCTS"],
  ] as [number, string][];
  return (
    <AbsoluteFill style={{ backgroundColor: "#1b1d1f" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("muralla", 0.8)]} />
      <PisoCapas cam={cam} piso={PISOS.pasto} />
      <Lam D={1000} cam={cam} sombra>
        {obreros.map((a, i) => (
          <Act key={i} t={t} a={a} />
        ))}
        <Act t={t} a={tu} />
      </Lam>
      <Lam D={860} cam={cam}>
        <Cartel x={-520} y={-430} texto="NO WAR? STILL NO REST" t={t} t0={tSinG} t1={tEmp + 0.4} fs={60} />
        <Cartel x={-380} y={-430} texto="ROME'S CONSTRUCTION CO." t={t} t0={tEmp + 0.3} t1={tCam - 0.1} fs={60} />
        {lista.map(([tt, txt], i) => (
          <Cartel key={i} x={-760 + i * 330} y={-420 + (i % 2) * 40} texto={txt} t={t} t0={tt} t1={tAdr - 0.2} fs={50} />
        ))}
        <Numero x={-100} y={-350} t={t} t0={t73} t1={tPala - 0.4} a={0} b={73} dur={1.2} suf=" MILES OF STONE" fs={100} />
        <Cartel x={-100} y={-470} texto="HADRIAN'S WALL" t={t} t0={tAdr} t1={tPala - 0.4} fs={66} />
        <Cartel x={340} y={-420} texto="YOUR REAL JOB" t={t} t0={tTrab} fs={80} color="#f3e6cf" fondoC="#a3241c" />
      </Lam>
      <Linterna x={lerp(-100, 160, suave(t, tPala - 0.5, tPala + 0.6))} y={0} r={lerp(1000, 700, suave(t, tPala - 0.5, tPala + 0.6))} osc={0.36} />
    </AbsoluteFill>
  );
};

export const _t3 = { F, clamp, lerp, TRISTE, MANOS_CADERA, CARGA_HOMBRO, BEBE, Polvo, tLeg: 0 };
