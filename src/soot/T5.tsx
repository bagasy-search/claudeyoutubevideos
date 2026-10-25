import React from "react";
import { AbsoluteFill } from "remotion";
import { SUELO, at as atG, clamp, lerp, seco, suave } from "./lib";
import { LEGIO, LEGIO_ESC, MEDICO, CIVIL, LETRA, MANO, Lam, Linterna, Papiro, Cartel, Numero, Trazo, fondo, util, PISOS, PisoCapas, Polvo, Llama } from "./kit";
import { Act, Actor, camara, QUIETO, TRISTE, AGOTADO, SENTADO_SUELO, DORMIDO, BEBE, CUBRE, RODILLA, CAVA_A, CAVA_B, PALOS } from "./actor";
import { SENTADO, con, mezclar } from "./rig";
import { MesaMadera } from "./comun";

// ================= 549,5 → 585,1 · el campamento: lo más letal no era la espada, era la fiebre =================
export const Letrina: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const tPeli = at("movies never show you");
  const tEsp = at("was not a sword");
  const tFieb = at("it was a fever");
  const tMiles = at("packed into one fort");
  const tAgua = at("sharing water");
  const tLetr = at("sharing latrines");
  const tMula = at("tents with a mule");
  const tCab = at("cavalry charge");
  const tBanco = at("long stone benches");
  const tSin = at("no walls in between");
  const tDebajo = at("Water ran underneath");
  const tEsponja = at("sponge on a stick");
  const tComp = at("shared");
  const tNo = at("You do not want to know");
  const parte2 = t > tBanco - 0.3;
  // parte 1: la espada se cae del cartel y la reemplaza un termómetro de fiebre; el campamento se llena
  const tu: Actor = {
    look: LEGIO,
    ruta: [[0, -60]],
    poses: [[0, QUIETO], [tFieb + 0.2, con(TRISTE, { torso: 16 }), 0.6], [tCab, AGOTADO, 0.6]],
    cara: (tt) => ({ parpado: tt > tFieb ? 0.45 : 0, boca: tt > tFieb ? 0.3 : 0.12 }),
    seed: 21,
  };
  const multitud: Actor[] = Array.from({ length: 14 }, (_, i) => ({
    look: { ...LEGIO, armadura: undefined, casco: i % 3 === 0 ? undefined : LEGIO.casco, barba: i % 2 === 0 },
    ruta: [[0, i % 2 ? 1300 + i * 60 : -1300 - i * 60], [tMiles - 0.4, i % 2 ? 1300 + i * 60 : -1300 - i * 60], [tMiles + 1.2, -720 + i * 105]],
    poses: [[0, QUIETO], [tCab - 0.4, i % 3 === 1 ? AGOTADO : TRISTE, 0.6]],
    seed: 200 + i,
  }));
  // parte 2: la letrina: banco de piedra con agujeros, 5 sentados de lado a lado, sin paredes
  const banco: Actor[] = Array.from({ length: 5 }, (_, i) => ({
    look: { ...LEGIO, armadura: undefined, casco: undefined, barba: i % 2 === 1 },
    ruta: [[0, -480 + i * 240]],
    poses: [[0, con(SENTADO, { brazo: [20, 0], ante: [40, 0] })], [tNo, con(SENTADO, { brazo: [20, 0], ante: [40, 0], cabeza: i % 2 ? 12 : -12 }), 0.4]],
    cara: (tt) => ({ giro: tt > tSin ? 0.9 : 0.6, sonrisa: i === 2 ? 0.4 : 0.05, parpado: 0 }),
    sinSombra: true,
    seed: 220 + i,
  }));
  const cam = !parte2
    ? camara(t, [[t0, -60, -80, 300], [tEsp, -40, -120, 400], [tMiles, 0, -60, 60], [tCab, 0, -50, 140], [tBanco - 0.3, 0, -40, 220]], 7)
    : camara(t, [[tBanco - 0.3, 0, -10, 120], [tSin, 0, -20, 200], [tDebajo, 0, 120, 330], [tEsponja + 0.3, 160, 100, 460], [tComp + 0.3, 140, 60, 420], [tNo + 1.5, 0, 0, 220]], 6);
  // agua que corre por el canal (rayitas que se mueven)
  const agua = (y: number) =>
    Array.from({ length: 24 }, (_, k) => {
      const x = (((k * 113 + t * 220) % 1500) - 750) | 0;
      return <path key={k} d={`M${x},${y + (k % 3) * 8} l40,0`} stroke="#9fc3d4" strokeWidth={4} strokeLinecap="round" opacity={0.7} />;
    });
  const espU = seco(t, tEsponja - 0.2, tEsponja + 0.4);
  const caeEsp = seco(t, tEsp, tEsp + 0.6);
  return (
    <AbsoluteFill style={{ backgroundColor: "#1c140d" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("letrina", 0.8, parte2 ? 0 : 700)]} filtro={parte2 ? undefined : "saturate(0.8) brightness(0.85)"} />
      <PisoCapas cam={cam} piso={parte2 ? PISOS.piedra : PISOS.tierra} />
      <Lam D={1000} cam={cam} sombra>
        {!parte2 && (
          <>
            {multitud.map((a, i) => (
              <Act key={i} t={t} a={a} />
            ))}
            <Act t={t} a={tu} />
            {/* moscas de la fiebre */}
            {t > tFieb &&
              Array.from({ length: 9 }, (_, k) => (
                <circle key={k} cx={-60 + 60 * Math.sin(t * 3 + k * 2.1)} cy={-230 + 40 * Math.cos(t * 4.3 + k)} r={4} fill="#1a120a" opacity={suave(t, tFieb, tFieb + 0.6)} />
              ))}
          </>
        )}
        {parte2 && (
          <>
            {/* el banco de piedra y el canal */}
            <rect x={-700} y={SUELO - 150} width={1400} height={34} fill="#a59a88" stroke="#6b6254" strokeWidth={4} />
            <rect x={-700} y={SUELO - 116} width={1400} height={116} fill="#8d8273" />
            {[-480, -240, 0, 240, 480].map((x) => (
              <ellipse key={x} cx={x + 30} cy={SUELO - 134} rx={34} ry={9} fill="#2a2018" />
            ))}
            <rect x={-760} y={SUELO + 10} width={1520} height={40} fill="#3f5a66" opacity={suave(t, tDebajo - 0.3, tDebajo + 0.3)} />
            <g opacity={suave(t, tDebajo - 0.3, tDebajo + 0.3)}>{agua(SUELO + 22)}</g>
            {banco.map((a, i) => (
              <Act key={i} t={t} a={{ ...a, dy: () => -112 }} />
            ))}
            {/* el tersorium: esponja en un palo, apoyada en el canal */}
            {espU > 0 && (
              <g transform={`translate(${lerp(900, 420, espU)},${SUELO + 30}) rotate(${-38 + 4 * Math.sin(t * 2)})`}>
                <rect x={-5} y={-260} width={10} height={260} fill="#8a5a2e" />
                <ellipse cx={0} cy={-270} rx={34} ry={26} fill="#d8c58a" />
                {[0, 1, 2, 3, 4].map((k) => (
                  <circle key={k} cx={-16 + k * 8} cy={-276 + (k % 2) * 10} r={3.5} fill="#9a8550" />
                ))}
              </g>
            )}
          </>
        )}
      </Lam>
      <Lam D={860} cam={cam}>
        <Cartel x={-420} y={-410} texto="THE MOVIES NEVER SHOW THIS" t={t} t0={tPeli} t1={tEsp} fs={54} />
        {/* NOT A SWORD → A FEVER: la espada se cae del cartel */}
        <Cartel x={-60} y={-420} texto={t < tFieb ? "THE DEADLIEST THING:" : "THE DEADLIEST THING: FEVER"} t={t} t0={tEsp - 0.3} t1={tMiles} fs={58} color={t < tFieb ? "#1a120a" : "#f3e6cf"} fondoC={t < tFieb ? undefined : "#a3241c"} />
        {t > tEsp && t < tFieb + 0.8 && (
          <g transform={`translate(${-60 + 300},${-420 + 40 + 600 * caeEsp * caeEsp}) rotate(${90 * caeEsp})`} opacity={1 - suave(t, tFieb + 0.3, tFieb + 0.8)}>
            <path d="M-80,0 L60,0 L80,-6 L60,-12 L-80,-12 Z" fill="#c7ccd1" />
            <rect x={-110} y={-18} width={30} height={24} fill="#7a4a24" />
          </g>
        )}
        <Cartel x={-460} y={-400} texto="SHARING WATER" t={t} t0={tAgua} t1={tCab} fs={50} />
        <Cartel x={-80} y={-400} texto="SHARING LATRINES" t={t} t0={tLetr} t1={tCab} fs={50} />
        <Cartel x={320} y={-400} texto="SHARING A TENT · WITH A MULE" t={t} t0={tMula} t1={tCab} fs={46} />
        <Cartel x={0} y={-420} texto="NO WALLS" t={t} t0={tSin} t1={tDebajo} fs={80} />
        <Cartel x={-360} y={-420} texto="TERSORIUM" sub="ONE SPONGE · SHARED" t={t} t0={tEsponja + 0.2} fs={70} color="#f3e6cf" fondoC="#5a6e3a" />
      </Lam>
      {!parte2 && t > tMula - 0.2 && (
        <Lam D={1000} cam={cam} sombra opacidad={seco(t, tMula - 0.2, tMula + 0.3) * (1 - suave(t, tCab, tCab + 0.6))}>
          {/* la mula de la carpa: recorte de cartulina a código (la foto de la mula ya salió en la trampa 3) */}
          <g transform={`translate(700,${SUELO})`}>
            <path d="M-150,-120 Q-150,-180 -60,-182 L90,-180 Q130,-180 150,-210 L176,-268 L190,-300 L204,-262 L214,-296 L224,-252 Q262,-226 270,-196 Q274,-176 252,-172 L190,-178 Q170,-150 160,-118 L150,0 L126,0 L122,-96 L-96,-100 L-110,0 L-134,0 Z" fill="#6b5a48" stroke="#3a2e22" strokeWidth={5} />
            <path d="M-150,-150 Q-190,-120 -176,-60" fill="none" stroke="#3a2e22" strokeWidth={8} strokeLinecap="round" />
            <circle cx={232} cy={-214} r={6} fill="#1a120a" />
            <path d="M-40,-182 L-30,-150 L60,-150 L70,-180" fill="#8a3a22" opacity={0.85} />
          </g>
        </Lam>
      )}
      <Lam D={820} cam={cam}>
        <Polvo t={t} n={24} seed={21} color="#d8e0b0" />
      </Lam>
      <Linterna x={0} y={0} r={parte2 ? 880 : lerp(820, 1100, suave(t, tMiles, tMiles + 1))} osc={0.46} />
    </AbsoluteFill>
  );
};

// ruta de la peste sobre un mapa dibujado a código (mesa + pergamino)
const CAMPS: [number, number, string][] = [
  [520, -40, "SELEUCIA"],
  [340, 30, "ANTIOCH"],
  [130, -60, "EPHESUS"],
  [-60, 10, "ATHENS"],
  [-200, -90, "AQUILEIA"],
  [-260, 40, "ROME"],
  [-420, -170, "DANUBE"],
  [-560, -60, "GAUL"],
];
// ================= 585,1 → 610,8 · la peste antonina viaja por los caminos que el ejército construyó =================
export const Peste: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const t165 = at("the year 165");
  const tEste = at("fighting in the east");
  const tPlaga = at("a plague");
  const tAnt = at("Antonine Plague");
  const tViru = at("smallpox");
  const tRutas = at("same roads the army had built");
  const tCamp = at("from camp to camp");
  const tHombro = at("shoulder to shoulder");
  const tPrim = at("among the first to fall");
  const tGlad = at("recruit gladiators");
  const tEsc = at("even slaves");
  const cam = camara(t, [
    [t0, 380, 0, 220],
    [tEste, 420, -20, 360],
    [tRutas, 160, -30, 240],
    [tCamp + 1.5, -100, -40, 220],
    [tHombro, -200, -40, 160],
    [tGlad, 0, -10, 120],
    [tEsc + 2, 0, 0, 160],
  ], 4);
  const paso = 0.55;
  const tIni = tRutas - 0.2;
  return (
    <AbsoluteFill style={{ backgroundColor: "#2a170b" }}>
      <MesaMadera cam={cam} seed={19} tono="#4f321d" />
      <Lam D={1000} cam={cam} sombra>
        {/* pergamino del imperio */}
        <path d="M-760,-300 Q-740,-330 -700,-320 L720,-330 Q760,-320 760,-280 L770,280 Q740,320 700,310 L-720,320 Q-770,310 -760,270 Z" fill="#e4d2ac" />
        <path d="M-700,-200 Q-500,-260 -300,-180 Q-150,-120 0,-150 Q200,-190 400,-110 Q560,-40 680,-80" fill="none" stroke="#b49a6c" strokeWidth={5} />
        <path d="M-640,120 Q-420,60 -220,140 Q0,220 180,120 Q380,40 640,150" fill="none" stroke="#b49a6c" strokeWidth={5} />
        <text x={0} y={250} textAnchor="middle" fontFamily={MANO} fontSize={60} fill="#7a5a34" opacity={0.55}>
          MARE NOSTRUM
        </text>
        {/* rutas */}
        {CAMPS.slice(1).map(([x, y], i) => {
          const [px, py] = CAMPS[i];
          return <Trazo key={i} d={`M${px},${py} L${x},${y}`} u={1} w={6} color="#8a6a44" largo={600} guiones />;
        })}
        {/* el contagio avanza por las rutas */}
        {CAMPS.slice(1).map(([x, y], i) => {
          const [px, py] = CAMPS[i];
          const u = seco(t, tIni + i * paso, tIni + (i + 1) * paso);
          return <Trazo key={"r" + i} d={`M${px},${py} L${x},${y}`} u={u} w={10} color="#a3241c" largo={600} />;
        })}
        {CAMPS.map(([x, y, n], i) => {
          const llega = i === 0 ? tEste : tIni + i * paso;
          const u = seco(t, llega, llega + 0.35);
          const pulso = u > 0 ? 1 + 0.12 * Math.sin((t - llega) * 6) : 1;
          return (
            <g key={n} transform={`translate(${x},${y})`}>
              <rect x={-20} y={-20} width={40} height={40} fill="none" stroke="#5a3a22" strokeWidth={5} />
              <circle r={36 * u * pulso} fill="#a3241c" opacity={0.55} />
              <text y={66} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={28} fill="#3a2414">
                {n}
              </text>
            </g>
          );
        })}
      </Lam>
      <Lam D={860} cam={cam}>
        <Cartel x={420} y={-380} texto="AD 165" t={t} t0={t165} t1={tAnt - 0.2} fs={84} />
        <Cartel x={420} y={-380} texto="THE ANTONINE PLAGUE" sub="LIKELY SMALLPOX" t={t} t0={tAnt} t1={tRutas} fs={64} color="#f3e6cf" fondoC="#a3241c" />
        <Cartel x={-100} y={-400} texto="IT TRAVELED THE ARMY'S ROADS" t={t} t0={tRutas + 0.3} t1={tGlad - 0.2} fs={54} />
        <Cartel x={-120} y={-400} texto="REFILL THE RANKS:" t={t} t0={tGlad} fs={60} />
        <Cartel x={-260} y={-270} texto="GLADIATORS" t={t} t0={tGlad + 0.4} fs={56} color="#f3e6cf" fondoC="#5a3a22" />
        <Cartel x={120} y={-270} texto="SLAVES" t={t} t0={tEsc} fs={56} color="#f3e6cf" fondoC="#5a3a22" />
      </Lam>
      <Linterna x={0} y={0} r={900} osc={0.5} />
      {tViru < 0 && tPlaga < 0 && tPrim < 0 && null}
    </AbsoluteFill>
  );
};

// ================= 610,8 → 636,1 · el hospital del fuerte: médicos buenos, cero analgésicos, cero idea de infección =================
const HERR = ["FORCEPS", "SCALPEL", "ARROW EXTRACTOR"];
export const Hospital: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const tHerido = at("if you get hurt");
  const tMed = at("the medici");
  const tHosp = at("hospitals inside the forts");
  const tFor = at("had forceps");
  const tBis = at("had scalpels");
  const tFlecha = at("pulling arrowheads");
  const tNoT = at("What they did not have");
  const tDolor = at("painkiller");
  const tInf = at("what an infection was");
  const tCorte = at("a small cut");
  const tAfri = at("hot day in Africa");
  const tMata = at("just as surely as a battle");
  const herido: Actor = {
    look: { ...LEGIO, armadura: undefined, casco: undefined },
    ruta: [[0, -80]],
    rot: (tt) => -90 * (tt < tCorte - 0.3 ? 1 : 1 - suave(tt, tCorte - 0.3, tCorte + 0.2)),
    dy: (tt) => (tt < tCorte - 0.3 ? -120 : 0),
    poses: [[0, con(DORMIDO, {})], [tCorte, con(QUIETO, { brazo: [60, -4], ante: [80, 20] }), 0.3], [tAfri + 0.4, AGOTADO, 0.6]],
    cara: (tt) => ({ parpado: tt < tFor ? 0.6 : 0.1, boca: tt > tFlecha && tt < tNoT + 1 ? 0.95 : 0.2 }),
    sinSombra: true,
    seed: 30,
  };
  const medico: Actor = {
    look: MEDICO,
    ruta: [[0, 900], [tMed - 1.1, 900], [tMed + 0.2, 230]],
    mira: -1,
    poses: [[0, QUIETO], [tFor, con(QUIETO, { brazo: [100, -4], ante: [120, 4] }), 0.4], [tNoT + 0.4, con(QUIETO, { brazo: [10, -4], ante: [90, 4] }), 0.5], [tCorte - 0.4, QUIETO, 0.4]],
    op: (tt) => 1 - suave(tt, tCorte - 0.6, tCorte - 0.1),
    seed: 31,
  };
  // la herramienta activa sobre la mano del médico
  let iH = -1;
  [tFor, tBis, tFlecha].forEach((h, i) => {
    if (t > h - 0.2) iH = i;
  });
  const cam = camara(t, [
    [t0, -80, -60, 220],
    [tHosp, 0, -60, 160],
    [tFor + 0.3, 150, -100, 460],
    [tFlecha + 0.6, 110, -90, 480],
    [tNoT, 40, -60, 300],
    [tCorte, -60, -60, 360],
    [tAfri + 1, -80, -60, 300],
    [tMata + 1.5, -60, -50, 240],
  ], 7);
  const sol = suave(t, tAfri - 0.3, tAfri + 0.6);
  return (
    <AbsoluteFill style={{ backgroundColor: "#1d140c" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("hospital", 0.8)]} filtro={sol > 0 ? `sepia(${0.3 * sol}) saturate(${1 + 0.4 * sol}) brightness(${1 + 0.15 * sol})` : undefined} />
      <PisoCapas cam={cam} piso={PISOS.piedra} />
      <Lam D={1000} cam={cam} sombra>
        {/* la cama */}
        <g opacity={1 - suave(t, tCorte - 0.4, tCorte)}>
          <rect x={-330} y={SUELO - 120} width={480} height={26} fill="#8a6a44" />
          <rect x={-320} y={SUELO - 94} width={18} height={94} fill="#6b4e30" />
          <rect x={130} y={SUELO - 94} width={18} height={94} fill="#6b4e30" />
          <rect x={-326} y={SUELO - 136} width={470} height={18} fill="#e9dccb" />
        </g>
        <Act t={t} a={herido} />
        <Act t={t} a={medico} />
        {/* el pedazo de flecha que sale */}
        {t > tFlecha && t < tNoT + 0.6 && (
          <g transform={`translate(${-40 + 120 * seco(t, tFlecha + 0.3, tFlecha + 1.2)},${SUELO - 160 - 80 * seco(t, tFlecha + 0.3, tFlecha + 1.2)})`}>
            <path d="M0,0 L50,-6 L50,6 Z" fill="#5d5f63" />
            <rect x={-60} y={-3} width={60} height={6} fill="#7a4a24" />
          </g>
        )}
        {/* el corte de la espada de práctica: una rayita roja en el brazo */}
        {t > tCorte && <path d="M-118,-10 l26,-8" stroke="#a3241c" strokeWidth={5} strokeLinecap="round" opacity={lerp(0.5, 1, Math.sin(t * 3) * 0.5 + 0.5)} />}
      </Lam>
      <Lam D={860} cam={cam}>
        <Cartel x={-380} y={-410} texto="IF YOU GET HURT" t={t} t0={tHerido} t1={tMed - 0.1} fs={64} />
        <Cartel x={-380} y={-410} texto="MEDICI · REAL DOCTORS" t={t} t0={tMed} t1={tFor - 0.2} fs={60} color="#f3e6cf" fondoC="#3f7a3a" />
        {iH >= 0 && t < tNoT && <Cartel x={360} y={-400} texto={HERR[iH]} t={t} t0={[tFor, tBis, tFlecha][iH] - 0.2} fs={60} />}
        <Papiro
          x={380}
          y={-180}
          w={520}
          t={t}
          t0={tNoT - 0.2}
          titulo="DID NOT HAVE"
          fs={44}
          lineas={[
            { txt: "painkillers", t: tDolor, tachar: tDolor + 0.6 },
            { txt: "germ theory", t: tInf, tachar: tInf + 0.6 },
          ]}
        />
        <Cartel x={-360} y={-420} texto="ONE SMALL CUT" t={t} t0={tCorte + 0.2} t1={tMata} fs={66} />
        <Cartel x={-360} y={-420} texto="= A BATTLE" t={t} t0={tMata} fs={80} color="#f3e6cf" fondoC="#a3241c" />
      </Lam>
      <Linterna x={-20} y={0} r={lerp(780, 1000, sol)} osc={lerp(0.5, 0.3, sol)} />
    </AbsoluteFill>
  );
};

// ================= 636,1 → 659,6 · el granero: trigo molido a mano, pan, gachas, tocino, posca =================
export const Granero: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const tReg = at("food was regular");
  const tTrigo = at("lived on wheat");
  const tMano = at("by hand");
  const tMolino = at("stone mill shared by his tent");
  const tPan = at("baked it into bread");
  const tGachas = at("boiled it into porridge");
  const tToc = at("some bacon");
  const tQueso = at("some cheese");
  const tLent = at("lentils");
  const tPosca = at("called Posca");
  const tVin = at("sour wine mixed with water");
  const tGla = at("Not glamorous");
  const tDia = at("every single day");
  const tGranj = at("most farmers could say");
  const gira = (tt: number) => (tt > tMano && tt < tPan ? Math.sin((tt - tMano) * 5) : 0);
  const tu: Actor = {
    look: { ...LEGIO, armadura: undefined },
    ruta: [[0, -240]],
    poses: [[0, QUIETO], [tMano - 0.2, mezclar(CAVA_A, CAVA_B, (gira(t) + 1) / 2), 0.4], [tPan, QUIETO, 0.4], [tPosca + 0.4, BEBE, 0.5], [tVin + 1.4, QUIETO, 0.5]],
    cara: (tt) => ({ sonrisa: tt > tDia ? 0.55 : tt > tVin ? 0 : 0.15, enojo: tt > tVin && tt < tGla ? 0.3 : 0 }),
    seed: 40,
  };
  const comp: Actor = { look: { ...LEGIO, armadura: undefined, barba: true }, ruta: [[0, 380]], mira: -1, poses: [[0, con(SENTADO_SUELO, {})], [tGachas, con(SENTADO_SUELO, { brazo: [80, 0], ante: [120, 0] }), 0.4]], seed: 41 };
  const cam = camara(t, [
    [t0, -100, -60, 200],
    [tTrigo, -160, -40, 330],
    [tMolino, -120, 20, 440],
    [tPan, 60, -20, 360],
    [tToc, 160, -10, 420],
    [tLent + 0.4, 220, -10, 420],
    [tPosca, -140, -100, 420],
    [tGla, 0, -60, 260],
    [tGranj + 1.5, 0, -60, 140],
  ], 7);
  const cosas: [number, string, number][] = [
    [tPan, "BREAD", 0],
    [tGachas, "PORRIDGE", 1],
    [tToc, "BACON", 2],
    [tQueso, "CHEESE", 3],
    [tLent, "LENTILS", 4],
  ];
  const piedra = t > tMano && t < tPan ? (t - tMano) * 260 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#22160c" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("granero", 0.8)]} />
      <PisoCapas cam={cam} piso={PISOS.tierra} />
      <Lam D={1000} cam={cam} sombra fotos={[util("molino", -120, 1000, 230, 0, Math.sin(piedra / 40) * 1.5)]}>
        <Act t={t} a={tu} />
        <Act t={t} a={comp} />
        {/* harina que cae del molino */}
        {t > tMano && t < tPan + 0.5 &&
          Array.from({ length: 14 }, (_, k) => {
            const u = ((t - tMano) * 1.3 + k / 14) % 1;
            return <circle key={k} cx={-160 + 80 * Math.sin(k * 7.3)} cy={SUELO - 130 + 130 * u} r={4} fill="#f1e8d6" opacity={1 - u} />;
          })}
        {/* la mesa de la comida: cada cosa cae cuando la nombra */}
        <rect x={40} y={SUELO - 110} width={520} height={20} fill="#7a5a34" />
        <rect x={60} y={SUELO - 90} width={14} height={90} fill="#5a3a22" />
        <rect x={526} y={SUELO - 90} width={14} height={90} fill="#5a3a22" />
        {cosas.map(([tc, n, i]) => {
          const u = seco(t, tc - 0.1, tc + 0.3);
          if (u <= 0) return null;
          const x = 90 + i * 100;
          const y = SUELO - 110 - 400 * (1 - u) * (1 - u);
          return (
            <g key={n} transform={`translate(${x},${y})`}>
              {i === 0 && <ellipse cx={0} cy={-26} rx={44} ry={28} fill="#b07a3a" stroke="#7a4a24" strokeWidth={4} />}
              {i === 1 && <path d="M-40,-30 Q0,10 40,-30 Z" fill="#d6c7a0" stroke="#7a5a34" strokeWidth={4} />}
              {i === 2 && <rect x={-40} y={-26} width={80} height={24} rx={6} fill="#c9705a" stroke="#7a3a2a" strokeWidth={4} />}
              {i === 3 && <path d="M-36,0 L36,0 L0,-46 Z" fill="#e8c55a" stroke="#a0832c" strokeWidth={4} />}
              {i === 4 && [0, 1, 2, 3, 4, 5].map((k) => <circle key={k} cx={-20 + (k % 3) * 20} cy={-10 - Math.floor(k / 3) * 14} r={9} fill="#9a6a3a" />)}
              <text y={46} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={26} fill="#f3e6cf">
                {n}
              </text>
            </g>
          );
        })}
      </Lam>
      <Lam D={860} cam={cam}>
        <Cartel x={-380} y={-410} texto="AT LEAST THE FOOD WAS REGULAR" t={t} t0={tReg} t1={tTrigo + 0.4} fs={52} />
        <Cartel x={-380} y={-410} texto="WHEAT · GROUND BY HAND" t={t} t0={tMano - 0.2} t1={tPan - 0.2} fs={58} />
        <Cartel x={-380} y={-410} texto="POSCA" sub="SOUR WINE + WATER" t={t} t0={tPosca} t1={tGla - 0.2} fs={80} color="#f3e6cf" fondoC="#6e1a16" />
        <Cartel x={0} y={-430} texto="NOT GLAMOROUS" t={t} t0={tGla} t1={tDia - 0.1} fs={66} />
        <Cartel x={0} y={-430} texto="BUT EVERY. SINGLE. DAY." t={t} t0={tDia} fs={66} color="#f3e6cf" fondoC="#3f7a3a" />
      </Lam>
      <Lam D={820} cam={cam}>
        <Polvo t={t} n={34} seed={40} />
      </Lam>
      <Linterna x={0} y={0} r={900} osc={0.42} />
      {tMolino < 0 && tGranj < 0 && null}
    </AbsoluteFill>
  );
};

export const _t5 = { LEGIO_ESC, CIVIL, Papiro, Numero, Llama, CUBRE, RODILLA, PALOS, clamp };
