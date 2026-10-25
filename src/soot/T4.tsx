import React from "react";
import { AbsoluteFill } from "remotion";
import { F, SUELO, at as atG, clamp, lerp, seco, suave } from "./lib";
import { LEGIO, LEGIO_ESC, CENTURION, OFICIAL, LETRA, MANO, Lam, Linterna, Papiro, Cartel, Numero, fondo, util, PISOS, PisoCapas, Polvo, Palotes, Llama, Lluvia, CANTO_FUEGO } from "./kit";
import { Act, Actor, camara, sacudon, QUIETO, FIRME, ALZA_ARMA, GOLPE, MANOS_CADERA, TRISTE, CUBRE, SENTADO_SUELO, LEE, SEÑALA, CAVA_A, CAVA_B, AGOTADO, PALOS, JURA } from "./actor";
import { Look, con, mezclar } from "./rig";
import { MesaMadera } from "./comun";

const TRIBUNO: Look = { ...LEGIO, armadura: "#c9a64a", casco: "#c9a64a", cresta: "#efe6d2", capa: "#efe6d2", tunica: "#efe6d2", arma: "garrote", escala: 1.05 };
// golpe repetido: devuelve la pose de un golpe con el palo en cada instante de `golpes`
const golpeando = (t: number, golpes: number[], reposo = MANOS_CADERA) => {
  let ult = -1;
  golpes.forEach((g) => {
    if (t > g - 0.32) ult = g;
  });
  if (ult < 0) return reposo;
  const u = t - (ult - 0.32);
  return u < 0.2 ? mezclar(reposo, ALZA_ARMA, u / 0.2) : u < 0.32 ? mezclar(ALZA_ARMA, GOLPE, (u - 0.2) / 0.12) : mezclar(GOLPE, reposo, clamp((u - 0.32) / 0.4, 0, 1));
};

// ================= 364,3 → 393,2 · el centurión: 80 hombres, 20 años de cicatrices, la vara de vid =================
export const Cuartel: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const tUno = at("run by one man");
  const t80 = at("commands 80 soldiers");
  const t20 = at("20 years of scars");
  const tVid = at("vine wood");
  const tDeco = at("not decoration");
  const tHabla = at("how he speaks to you");
  const tTac = at("historian Tacitus");
  const tLuc = at("called Lucilius");
  const tPega = at("beat his men so often");
  const tRompe = at("snapped across");
  const tOtra = at("shout for a new one");
  const tCito = at("Cito alterum");
  const tApodo = at("as a nickname");
  const CX = 120;
  const golpes = [tHabla + 0.1, tPega + 0.3, tPega + 1.1, tPega + 1.9, tRompe + 0.15, tCito + 0.15];
  const roto = t > tRompe + 0.15 && t < tCito - 0.4;
  const cent: Actor = {
    look: { ...CENTURION, arma: roto ? undefined : "vara" },
    ruta: [[0, CX]],
    mira: -1,
    poses: [[0, t < tDeco ? MANOS_CADERA : golpeando(t, golpes)], [tOtra, t > tOtra && t < tCito ? con(SEÑALA, { brazo: [140, -4], ante: [150, 4] }) : golpeando(t, golpes), 0.3]],
    cara: (tt) => ({ enojo: 0.8, boca: tt > tOtra && tt < tCito + 1 ? 0.9 : 0.15, sonrisa: 0 }),
    seed: 2,
  };
  const ultimoG = golpes.filter((g) => g <= t).pop() ?? -10;
  const dolor = Math.exp(-Math.max(0, t - ultimoG) * 3);
  const tu: Actor = {
    look: LEGIO_ESC,
    ruta: [[0, CX - 190]],
    poses: [[0, FIRME], [tHabla, con(FIRME, { torso: 12 * dolor, cabeza: 18 * dolor }), 0.1]],
    cara: () => ({ parpado: 0.6 * dolor, boca: 0.12 + 0.5 * dolor }),
    seed: 3,
  };
  const cam0 = camara(t, [
    [t0, CX - 80, -90, 260],
    [t80, CX - 80, -120, 120],
    [t20, CX + 20, -150, 520],
    [tVid + 0.3, CX + 60, -60, 560],
    [tHabla, CX - 40, -70, 380],
    [tTac, CX - 60, -60, 260],
    [tPega + 0.3, CX - 70, -70, 380],
    [tRompe + 0.2, CX - 40, -80, 460],
    [tCito + 0.3, CX + 10, -150, 520],
    [tApodo + 2, CX, -80, 330],
  ], 7);
  const cam = { ...cam0, cy: cam0.cy + sacudon(t, ultimoG, 6) };
  // los 80 hombres: una grilla de muñequitos que aparece detrás
  const ochenta = tri(t, t80 - 0.2, t80 + 0.3, t20 - 0.4, t20);
  // las dos mitades de la vara rota
  const rU = clamp((t - (tRompe + 0.15)) / 0.9, 0, 1);
  return (
    <AbsoluteFill style={{ backgroundColor: "#1f150d" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("cuartel", 0.8, 200)]} />
      <PisoCapas cam={cam} piso={PISOS.piedra} />
      <Lam D={1250} cam={cam} opacidad={ochenta}>
        {Array.from({ length: 80 }, (_, i) => {
          const c = i % 20;
          const f = Math.floor(i / 20);
          const x = -900 + c * 95 + f * 30;
          const y = 186 - f * 30;
          const u = seco(t, t80 - 0.2 + i * 0.008, t80 + 0.1 + i * 0.008);
          return (
            <g key={i} transform={`translate(${x},${y}) scale(${u * 0.32})`}>
              <circle cx={0} cy={-200} r={26} fill="#17130f" />
              <path d="M0,-180 L0,-90 M0,-160 L-26,-110 M0,-160 L26,-110 M0,-90 L-20,0 M0,-90 L20,0" stroke="#17130f" strokeWidth={14} strokeLinecap="round" />
              <path d="M-16,-100 L16,-100 L22,-56 L-22,-56 Z" fill="#a3241c" />
            </g>
          );
        })}
      </Lam>
      <Lam D={1000} cam={cam} sombra>
        <Act t={t} a={tu} />
        <Act t={t} a={cent} />
        {rU > 0 && rU < 1 && (
          <g>
            <rect x={CX - 60 - 160 * rU} y={-40 + 300 * rU * rU} width={46} height={7} fill="#7a4a24" transform={`rotate(${400 * rU} ${CX - 60} 40)`} />
            <rect x={CX - 20 + 120 * rU} y={-60 + 340 * rU * rU} width={44} height={7} fill="#7a4a24" transform={`rotate(${-300 * rU} ${CX} 40)`} />
          </g>
        )}
        {/* le alcanzan una vara nueva */}
        {t > tCito - 0.4 && t < tCito + 0.2 && <rect x={CX + 240 - 120 * suave(t, tCito - 0.4, tCito)} y={60} width={8} height={96} fill="#7a4a24" transform={`rotate(-20 ${CX + 200} 100)`} />}
      </Lam>
      <Lam D={860} cam={cam}>
        <Cartel x={CX - 80} y={-380} texto="THE CENTURION" t={t} t0={tUno} t1={t80 - 0.2} fs={76} />
        <Numero x={CX - 80} y={-330} t={t} t0={t80} t1={t20 - 0.2} a={0} b={80} dur={0.8} suf=" MEN" fs={110} />
        <Cartel x={CX + 260} y={-380} texto="20 YEARS OF SCARS" t={t} t0={t20} t1={tDeco} fs={62} />
        <Cartel x={CX + 260} y={-380} texto="VITIS · THE VINE STICK" t={t} t0={tVid + 0.2} t1={tTac - 0.2} fs={56} />
        <Cartel x={CX - 360} y={-400} texto="TACITUS" sub="ANNALS, BOOK 1" t={t} t0={tTac} t1={tLuc - 0.1} fs={70} />
        <Cartel x={CX - 360} y={-400} texto="LUCILIUS" sub="CENTURION" t={t} t0={tLuc} t1={tCito - 0.3} fs={74} />
        <Cartel x={CX - 40} y={-420} texto="«CEDO ALTERAM!»" sub="BRING ME ANOTHER" t={t} t0={tCito} fs={84} color="#f3e6cf" fondoC="#a3241c" />
      </Lam>
      <Linterna x={-30} y={0} r={lerp(820, 600, suave(t, tPega, tPega + 1))} osc={lerp(0.45, 0.62, suave(t, tPega, tPega + 1))} />
    </AbsoluteFill>
  );
};
const tri = (t: number, a: number, b: number, c: number, d: number) => Math.min(suave(t, a, b), 1 - suave(t, c, d));

// ================= 393,2 → 415,4 · el Danubio: el motín (a Lucilius lo matan primero) y las coimas =================
export const Danubio: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const tMot = at("finally mutinied");
  const tMata = at("first men they killed");
  const tSist = at("how the system really worked");
  const tCoima = at("centurions bribes");
  const tLetr = at("skip latrine duty");
  const tLic = at("a day of leave");
  const tNo = at("pay and somehow") - 0.8;
  const tZanja = at("cleaning the ditch");
  const parte2 = t > tSist - 0.3;
  const CX = 200;
  // parte 1: los amotinados con antorchas rodean al centurión y cae
  const amot: Actor[] = Array.from({ length: 6 }, (_, i) => ({
    look: { ...LEGIO, barba: i % 2 === 0, arma: i % 3 === 0 ? "gladio" : undefined },
    ruta: [[0, CX - 900 + i * 110], [tMot + 0.2, CX - 900 + i * 110], [tMata, CX - 520 + i * 70 + (i > 3 ? 560 : 0)]],
    corre: true,
    poses: [[0, con(QUIETO, { brazo: [150, -4], ante: [170, 4] })]],
    cara: () => ({ enojo: 0.8, boca: 0.7 }),
    bordes: CANTO_FUEGO,
    seed: 140 + i,
  }));
  const cent: Actor = { look: CENTURION, ruta: [[0, CX]], mira: -1, poses: [[0, MANOS_CADERA], [tMata - 0.3, CUBRE, 0.3]], rot: (tt) => -84 * seco(tt, tMata + 0.4, tMata + 0.9), bordes: CANTO_FUEGO, seed: 150 };
  // parte 2: pagás → te salvás de la letrina / día libre; no pagás → la zanja
  const pagaU = (tt: number, a: number) => seco(tt, a, a + 0.8);
  const tu: Actor = {
    look: { ...LEGIO, arma: t > tNo + 0.4 ? "pala" : undefined },
    ruta: [[0, -120]],
    poses: [[0, QUIETO], [tCoima, con(QUIETO, { brazo: [80, -4], ante: [84, 4] }), 0.4], [tNo + 0.3, mezclar(CAVA_A, CAVA_B, (Math.sin(t * 5) + 1) / 2), 0.4]],
    cara: (tt) => ({ sonrisa: tt > tLetr && tt < tNo ? 0.5 : 0.05, enojo: tt > tZanja ? 0.4 : 0 }),
    bordes: CANTO_FUEGO,
    seed: 151,
  };
  const cent2: Actor = { look: { ...CENTURION, cresta: "#c9b98e" }, ruta: [[0, 120]], mira: -1, poses: [[0, con(QUIETO, { brazo: [70, 38], ante: [84, -60] })], [tNo + 0.2, MANOS_CADERA, 0.4]], cara: (tt) => ({ sonrisa: tt < tNo ? 0.6 : 0, enojo: tt > tNo ? 0.5 : 0 }), bordes: CANTO_FUEGO, seed: 152 };
  const cam = !parte2
    ? camara(t, [[t0, CX - 520, -60, 200], [tMot + 0.4, CX - 380, -60, 260], [tMata + 0.2, CX - 120, -50, 360], [tSist, CX - 140, -40, 300]], 7)
    : camara(t, [[tSist - 0.3, 0, -60, 220], [tCoima + 0.4, -20, -70, 380], [tLic, 0, -60, 360], [tZanja + 1.6, -100, -40, 430]], 7);
  // monedas que pasan de mano en mano
  const moneda = (a: number) => {
    const u = pagaU(t, a);
    if (u <= 0 || u >= 1) return null;
    return <circle cx={lerp(-60, 60, u)} cy={70 - 60 * Math.sin(Math.PI * u)} r={10} fill="#d4d8dc" stroke="#7d8288" strokeWidth={2} />;
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0f1a" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("danubio", 0.8, parte2 ? 600 : 0)]} />
      <PisoCapas cam={cam} piso={PISOS.noche} />
      <Lam D={1000} cam={cam} sombra>
        {!parte2 && (
          <>
            <Act t={t} a={cent} />
            {amot.map((a, i) => (
              <g key={i}>
                <Act t={t} a={a} />
              </g>
            ))}
            {amot.map((a, i) => {
              const s = a.ruta;
              const x = t < s[1][0] ? s[0][1] : lerp(s[1][1], s[2][1], clamp((t - s[1][0]) / (s[2][0] - s[1][0]), 0, 1));
              return <Llama key={"ll" + i} x={x + 60} y={-30} t={t} s={0.7} seed={i} />;
            })}
          </>
        )}
        {parte2 && (
          <>
            <Act t={t} a={cent2} />
            <Act t={t} a={tu} />
            {moneda(tLetr - 0.3)}
            {moneda(tLic - 0.3)}
            <Llama x={-560} y={SUELO - 160} t={t} palo={160} seed={3} />
            <Llama x={520} y={SUELO - 160} t={t} palo={160} seed={4} />
          </>
        )}
      </Lam>
      <Lam D={860} cam={cam}>
        <Cartel x={CX - 420} y={-380} texto="MUTINY" sub="DANUBE · AD 14" t={t} t0={tMot} t1={tSist - 0.4} fs={80} color="#f3e6cf" fondoC="#a3241c" />
        <Cartel x={-420} y={-380} texto="BRIBES" t={t} t0={tCoima} t1={tLetr - 0.1} fs={80} />
        <Cartel x={-420} y={-380} texto="PAY → NO LATRINES" t={t} t0={tLetr} t1={tLic - 0.1} fs={60} color="#f3e6cf" fondoC="#3f7a3a" />
        <Cartel x={-420} y={-380} texto="PAY → A DAY OFF" t={t} t0={tLic} t1={tNo - 0.1} fs={60} color="#f3e6cf" fondoC="#3f7a3a" />
        <Cartel x={-420} y={-380} texto="DON'T PAY → THE DITCH" t={t} t0={tNo} fs={60} color="#f3e6cf" fondoC="#a3241c" />
      </Lam>
      <Linterna x={0} y={0} r={720} osc={0.62} frio />
    </AbsoluteFill>
  );
};

// ================= 415,4 → 454,3 · la guardia: fustuarium y diezmado =================
export const Guardia: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const tDorm = at("caught asleep");
  const tFus = at("Fustuarium");
  const tTrib = at("The Tribune touches you");
  const tComp = at("your tent mates");
  const tPalos = at("sticks and stones");
  const tSobre = at("most men did not survive");
  const tCasa = at("never go home again");
  const tDiez = at("decimation");
  const tDecimo = at("every tenth man");
  const tSuerte = at("chosen by lot");
  const tNueve = at("killed by the other nine");
  const t71 = at("71 before christ");
  const tCras = at("crassus");
  const tEsp = at("spartacus");
  const tJusto = at("not every day was like that");
  const parte2 = t > tDiez - 0.2;
  const TX = 0;
  // parte 1: dormido en la guardia → el tribuno lo toca → lo rodean sus compañeros
  const tu: Actor = {
    look: LEGIO_ESC,
    ruta: [[0, TX]],
    poses: [[0, SENTADO_SUELO], [tTrib + 0.6, con(SENTADO_SUELO, { cabeza: -10 }), 0.3], [tComp, CUBRE, 0.4]],
    cara: (tt) => ({ parpado: tt < tTrib + 0.4 ? 1 : 0, boca: tt > tTrib + 0.5 ? 0.8 : 0.1 }),
    op: (tt) => 1 - 0.6 * suave(tt, tSobre, tCasa + 0.6),
    seed: 4,
  };
  const trib: Actor = { look: TRIBUNO, ruta: [[0, TX + 900], [tTrib - 1.3, TX + 900], [tTrib - 0.1, TX + 200], [tComp - 0.2, TX + 200], [tComp + 1.2, TX + 900]], mira: -1, poses: [[0, QUIETO], [tTrib + 0.2, con(QUIETO, { brazo: [100, -4], ante: [110, 4] }), 0.3], [tTrib + 0.9, QUIETO, 0.3]], seed: 5 };
  const golpesC = (i: number) => Array.from({ length: 10 }, (_, k) => tComp + 0.4 + k * 0.62 + i * 0.17);
  const comps: Actor[] = Array.from({ length: 5 }, (_, i) => ({
    look: { ...LEGIO, armadura: undefined, casco: undefined, arma: "garrote", barba: i % 2 === 1 },
    ruta: [[0, i < 3 ? TX - 900 - i * 120 : TX + 900 + i * 120], [tComp - 0.6, i < 3 ? TX - 900 - i * 120 : TX + 900 + i * 120], [tComp + 0.5, i < 3 ? TX - 140 - i * 120 : TX + 160 + (i - 3) * 120]],
    corre: true,
    poses: [[0, golpeando(t, t > tComp + 0.3 && t < tSobre ? golpesC(i) : [], QUIETO)]],
    vueltas: undefined,
    cara: () => ({ enojo: 0.5, boca: 0.4 }),
    op: (tt) => 1 - suave(tt, tSobre, tSobre + 0.8),
    seed: 160 + i,
  }));
  // parte 2: diez en fila; la "suerte" (una ficha roja) salta entre ellos y cae en el décimo
  const fila: Actor[] = Array.from({ length: 10 }, (_, i) => ({
    look: { ...LEGIO_ESC, barba: i % 3 === 1 },
    ruta: [[0, -820 + i * 182]],
    poses: [[0, FIRME]],
    rot: i === 9 ? (tt) => -86 * seco(tt, tNueve + 0.5, tNueve + 1.0) : undefined,
    op: i === 9 ? (tt) => 1 - 0.7 * suave(tt, tNueve + 1.2, tNueve + 2) : undefined,
    cara: (tt) => ({ parpado: tt > tSuerte ? 0.3 : 0 }),
    seed: 180 + i,
  }));
  const salta = clamp((t - tSuerte) / 1.6, 0, 1);
  const idxSuerte = salta >= 1 ? 9 : Math.floor((salta * 23) % 10);
  const cam = !parte2
    ? camara(t, [[t0, TX - 300, -100, 200], [tDorm + 0.3, TX - 60, -40, 470], [tFus, TX - 20, -60, 420], [tTrib, TX + 60, -60, 330], [tComp + 0.6, TX, -60, 260], [tSobre, TX, -40, 330], [tCasa + 1, TX - 40, -30, 420]], 7)
    : camara(t, [[tDiez - 0.2, 0, -80, 120], [tDecimo, 0, -60, 160], [tNueve, 660, -60, 360], [t71, 300, -60, 160], [tJusto + 1, 200, -60, 120]], 6);
  const roja = parte2 ? suave(t, tNueve, tNueve + 0.8) * (1 - suave(t, tJusto, tJusto + 1)) : suave(t, tComp, tComp + 0.5) * (1 - suave(t, tSobre + 0.5, tCasa + 1));
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0d17" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("guardia", 0.8, parte2 ? -500 : 0)]} />
      <PisoCapas cam={cam} piso={PISOS.noche} />
      <Lam D={1000} cam={cam} sombra>
        {!parte2 && (
          <>
            <Llama x={TX + 520} y={SUELO - 170} t={t} palo={170} seed={6} />
            <Act t={t} a={tu} />
            <Act t={t} a={trib} />
            {comps.map((a, i) => (
              <Act key={i} t={t} a={a} />
            ))}
            {t > tPalos && t < tSobre &&
              [0, 1, 2, 3].map((k) => {
                const u = ((t - tPalos) * 1.6 + k * 0.25) % 1;
                return <circle key={k} cx={TX - 300 + k * 160 + 300 * u} cy={-100 + 200 * u + 300 * u * u} r={12} fill="#6b5e4c" />;
              })}
          </>
        )}
        {parte2 && (
          <>
            {fila.map((a, i) => (
              <Act key={i} t={t} a={a} />
            ))}
            {t > tSuerte - 0.1 && t < tNueve + 0.6 && (
              <g transform={`translate(${-820 + idxSuerte * 182},-90)`}>
                <path d="M-16,-30 L16,-30 L0,0 Z" fill="#a3241c" />
                <circle cx={0} cy={-46} r={18} fill="#a3241c" />
                <text x={0} y={-38} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={22} fill="#f3e6cf">
                  X
                </text>
              </g>
            )}
            {/* "uno de cada diez": números sobre las cabezas */}
            {Array.from({ length: 10 }, (_, i) => (
              <text key={i} x={-820 + i * 182} y={-150} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={40} fill={i === 9 ? "#ff8a6a" : "#f3e6cf"} opacity={seco(t, tDecimo + i * 0.08, tDecimo + 0.3 + i * 0.08) * (1 - suave(t, tSuerte, tSuerte + 0.3))}>
                {i + 1}
              </text>
            ))}
          </>
        )}
      </Lam>
      <Lam D={860} cam={cam}>
        <Cartel x={TX - 380} y={-390} texto="FUSTUARIUM" t={t} t0={tFus} t1={tSobre} fs={84} color="#f3e6cf" fondoC="#a3241c" />
        <Cartel x={TX - 380} y={-390} texto="NO WAY HOME" t={t} t0={tCasa} t1={tDiez - 0.2} fs={70} />
        <Cartel x={0} y={-430} texto="DECIMATION" sub="1 IN 10, BY LOT" t={t} t0={tDiez} t1={t71 - 0.2} fs={84} color="#f3e6cf" fondoC="#a3241c" />
        <Cartel x={-120} y={-430} texto="71 BC · CRASSUS" t={t} t0={tCras} t1={tJusto} fs={70} />
        <Cartel x={-120} y={-300} texto="VS SPARTACUS" t={t} t0={tEsp} t1={tJusto} fs={54} />
      </Lam>
      <AbsoluteFill style={{ background: `rgba(140,20,10,${0.25 * roja})`, mixBlendMode: "multiply" }} />
      <Linterna x={0} y={0} r={parte2 ? 980 : 640} osc={parte2 ? lerp(0.6, 0.35, suave(t, tJusto, tJusto + 1)) : 0.66} frio />
    </AbsoluteFill>
  );
};

// ================= 454,3 → 502,5 · la planilla de guardias: "al estiércol" — y los immunes =================
export const Planilla: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const tAbu = at("simply boring");
  const tLista = at("duty roster");
  const tGuard = at("Guard duty");
  const tPuerta = at("gate duty");
  const tBaño = at("bath duty");
  const tBotas = at("cleaning the");
  const tBosta = at("to the dung");
  const tGloria = at("for glory");
  const tPala = at("You crossed it to shovel");
  const tSalvo = at("you had a skill");
  const tImm = at("men called immunes");
  const tAgrim = at("surveyors");
  const tEscr = at("clerks");
  const tHerr = at("blacksmiths");
  const tArco = at("bow makers");
  const tHosp = at("hospital orderlies");
  const tAnim = at("sacrificial animals");
  const tRecu = at("Remember those questions");
  const tPorEso = at("This is why");
  const tVale = at("worth more alive");
  const parte2 = t > tSalvo - 0.3;
  const cam = !parte2
    ? camara(t, [[t0, -60, -40, 120], [tLista, -40, -120, 300], [tBotas, -40, 0, 360], [tBosta + 0.3, -20, 80, 520], [tPala + 1, 0, 40, 260]], 4)
    : camara(t, [[tSalvo - 0.3, 0, -60, 160], [tImm + 0.3, 0, -160, 330], [tHosp, 0, 20, 340], [tRecu, 0, -20, 200], [tVale + 2, 0, 0, 260]], 4);
  const palaU = seco(t, tPala - 0.1, tPala + 0.4);
  const sello = seco(t, tVale, tVale + 0.25);
  return (
    <AbsoluteFill style={{ backgroundColor: "#2a170b" }}>
      <MesaMadera cam={cam} seed={11} tono="#5d3c24" />
      <Lam D={1000} cam={cam} sombra>
        {!parte2 && (
          <>
            <Papiro
              x={0}
              y={-20}
              w={900}
              t={t}
              t0={tLista - 0.4}
              titulo="DUTY ROSTER · EGYPT"
              fs={52}
              lineas={[
                { txt: "guard duty", t: tGuard },
                { txt: "gate duty", t: tPuerta },
                { txt: "bath duty", t: tBaño },
                { txt: "the centurion's boots", t: tBotas },
                { txt: "TO THE DUNG", t: tBosta, rojo: true },
              ]}
            />
            {palaU > 0 && (
              <g transform={`translate(${lerp(700, 260, palaU)},${lerp(-700, 150, palaU)}) rotate(${lerp(-80, -32, palaU)})`}>
                <rect x={-8} y={-300} width={16} height={300} fill="#8a5a2e" />
                <path d="M-60,0 L60,0 L50,130 Q0,160 -50,130 Z" fill="#7d8288" />
                <path d="M-60,0 L60,0" stroke="#aab0b6" strokeWidth={6} />
              </g>
            )}
          </>
        )}
        {parte2 && (
          <>
            <Papiro
              x={-60}
              y={-30}
              w={860}
              t={t}
              t0={tImm - 0.4}
              titulo="IMMUNES · EXCUSED FROM CHORES"
              fs={46}
              lineas={[
                { txt: "surveyors", t: tAgrim },
                { txt: "clerks", t: tEscr },
                { txt: "blacksmiths", t: tHerr },
                { txt: "bow makers", t: tArco },
                { txt: "hospital orderlies", t: tHosp },
                { txt: "keeper of the sacrificial animals", t: tAnim },
              ]}
            />
            {sello > 0 && (
              <g transform={`translate(240,240) rotate(-8) scale(${lerp(1.8, 1, sello)})`} opacity={sello}>
                <rect x={-230} y={-50} width={460} height={92} rx={8} fill="none" stroke="#a3241c" strokeWidth={8} />
                <text x={0} y={20} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={50} fill="#a3241c" letterSpacing={3}>
                  WORTH MORE ALIVE
                </text>
              </g>
            )}
          </>
        )}
      </Lam>
      <Lam D={860} cam={cam}>
        <Cartel x={-420} y={-420} texto="MOST DAYS: BORING" t={t} t0={tAbu} t1={tLista} fs={66} />
        <Cartel x={-260} y={-430} texto="NOT FOR GLORY" t={t} t0={tGloria} t1={tSalvo - 0.3} fs={66} />
        <Cartel x={0} y={-430} texto="REMEMBER THE RECRUITING TABLE?" t={t} t0={tRecu} t1={tVale - 0.2} fs={54} />
        <Cartel x={0} y={-300} texto="THIS IS WHY" t={t} t0={tPorEso} t1={tVale - 0.2} fs={64} color="#f3e6cf" fondoC="#3f7a3a" />
      </Lam>
      <Linterna x={0} y={0} r={900} osc={0.5} />
    </AbsoluteFill>
  );
};

// tablilla de madera de Vindolanda, con su texto en tinta
const Tablilla: React.FC<{ x: number; y: number; t: number; t0: number; txt: string[]; rot?: number }> = ({ x, y, t, t0, txt, rot = 0 }) => {
  const u = seco(t, t0, t0 + 0.4);
  if (u <= 0) return null;
  return (
    <g transform={`translate(${x},${y + 200 * (1 - u)}) rotate(${rot})`} opacity={u}>
      <rect x={-260 + 10} y={-70 + 10} width={520} height={150} fill="#2a1206" opacity={0.3} />
      <rect x={-260} y={-70} width={520} height={150} fill="#c9a77a" />
      <line x1={0} y1={-70} x2={0} y2={80} stroke="#8a6a44" strokeWidth={3} />
      {txt.map((l, i) => (
        <text key={i} x={-240} y={-30 + i * 40} fontFamily={MANO} fontWeight={700} fontSize={32} fill="#2a1a10" clipPath="">
          {l}
        </text>
      ))}
    </g>
  );
};

// ================= 502,5 → 537,4 · Vindolanda: cartas de madera, medias y cerveza =================
export const Vindolanda: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const tSol = at("loneliness");
  const tVin = at("At Vindolanda");
  const tTab = at("wooden writing tablets");
  const tGloria = at("not about glory either");
  const tMedias = at("I have sent you socks");
  const tCalz = at("two pairs of underpants");
  const tCerv = at("more beer");
  const tSeAcab = at("have run out");
  const tInf = at("one report written");
  const tBrit = at("Brit unculé");
  const tTrad = at("wretched little Britons");
  const tu: Actor = { look: { ...LEGIO, casco: undefined }, ruta: [[0, -300]], poses: [[0, TRISTE], [tTab + 0.4, LEE, 0.5]], cara: (tt) => ({ sonrisa: tt > tMedias && tt < tCerv ? 0.4 : 0.05 }), seed: 6 };
  const cam = camara(t, [
    [t0, -420, -80, 160],
    [tVin, -360, -100, 220],
    [tTab + 0.3, -120, -120, 330],
    [tMedias, 120, -140, 360],
    [tCerv, 380, -120, 340],
    [tBrit, 160, -170, 300],
    [tTrad + 1.6, 140, -140, 260],
  ], 6);
  return (
    <AbsoluteFill style={{ backgroundColor: "#15181c" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("vindolanda", 0.8)]} />
      <PisoCapas cam={cam} piso={PISOS.barro} />
      <Lam D={1000} cam={cam} sombra fotos={[...(t > tMedias - 0.3 ? [util("paquete", 40, 1000, 200)] : []), ...(t > tCerv - 0.3 ? [util("cerveza", 420, 1000, 170)] : [])]}>
        <Act t={t} a={tu} />
      </Lam>
      <Lam D={860} cam={cam}>
        <Cartel x={-520} y={-400} texto="VINDOLANDA" sub="HADRIAN'S WALL · BRITAIN" t={t} t0={tVin} t1={tGloria} fs={74} />
        <Tablilla x={40} y={-300} t={t} t0={tMedias - 0.2} txt={["I have sent you socks,", "two pairs of sandals and", "two pairs of underpants"]} rot={-3} />
        <Tablilla x={460} y={-300} t={t} t0={tCerv - 0.2} txt={["My fellow soldiers", "have no beer.", "Please send some."]} rot={2} />
        <Cartel x={280} y={-440} texto="BRITTUNCULI" sub="«WRETCHED LITTLE BRITONS»" t={t} t0={tBrit} fs={72} color="#f3e6cf" fondoC="#3f5a7a" />
      </Lam>
      <Lam D={820} cam={cam}>
        <Lluvia t={t} n={110} viento={0.25} op={0.5} seed={7} />
      </Lam>
      <Linterna x={0} y={-40} r={800} osc={0.5} frio />
      {tSol < 0 && null}
      {tInf < 0 && tSeAcab < 0 && tCalz < 0 && null}
    </AbsoluteFill>
  );
};

// ================= 537,4 → 547,2 · "Imaginalo": 26 años, lluvia de costado, 2.000 km de casa, medias nuevas =================
export const Fortaleza: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const t26 = at("You are 26");
  const tLluv = at("raining sideways");
  const tKm = at("kilometers from the town");
  const tMedias = at("fresh pair of socks");
  const tu: Actor = {
    look: { ...LEGIO_ESC },
    ruta: [[0, -40]],
    poses: [[0, con(TRISTE, { torso: 14 })], [tMedias, con(QUIETO, { brazo: [80, -4], ante: [100, 4] }), 0.5]],
    cara: (tt) => ({ sonrisa: tt > tMedias + 0.3 ? 0.45 : 0, parpado: 0.25 }),
    seed: 7,
  };
  const cam = camara(t, [[t0, -60, -60, 200], [tLluv, -40, -60, 330], [tKm, -20, -80, 260], [tMedias + 0.4, 0, -60, 470], [tMedias + 3, 10, -60, 520]], 7);
  const medias = seco(t, tMedias, tMedias + 0.4);
  return (
    <AbsoluteFill style={{ backgroundColor: "#121519" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("fortaleza", 0.8)]} filtro="saturate(0.85)" />
      <PisoCapas cam={cam} piso={PISOS.barro} />
      <Lam D={1000} cam={cam} sombra>
        <Act t={t} a={tu} />
        {medias > 0 && (
          <g transform={`translate(70,${70 - 10 * medias})`} opacity={medias}>
            <path d="M0,0 L0,40 Q0,56 22,56 L34,56 L34,44 L14,40 L14,0 Z" fill="#d9cdb8" />
            <path d="M18,4 L18,44 Q18,60 40,60 L52,60 L52,48 L32,44 L32,4 Z" fill="#c4b49a" />
          </g>
        )}
      </Lam>
      <Lam D={860} cam={cam}>
        <Cartel x={-420} y={-400} texto="AGE 26" t={t} t0={t26} t1={tKm} fs={80} />
        <Numero x={-60} y={-330} t={t} t0={tKm - 0.2} t1={tMedias + 0.3} a={0} b={2000} dur={1} suf=" KM FROM HOME" fs={90} />
      </Lam>
      <Lam D={800} cam={cam}>
        <Lluvia t={t} n={160} viento={lerp(0.3, 1.1, suave(t, tLluv - 0.3, tLluv + 0.3))} op={0.6} seed={9} />
      </Lam>
      <Linterna x={0} y={-30} r={lerp(800, 560, suave(t, tMedias, tMedias + 1))} osc={0.55} frio />
    </AbsoluteFill>
  );
};

export const _t4 = { F, OFICIAL, Polvo, Palotes, CAVA_A, AGOTADO, PALOS, JURA, SEÑALA };
