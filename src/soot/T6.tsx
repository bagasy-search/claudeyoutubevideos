import React from "react";
import { AbsoluteFill } from "remotion";
import { SUELO, at as atG, clamp, lerp, seco, suave } from "./lib";
import { LEGIO_ESC, GERMANO, CENTURION, LETRA, MANO, Lam, Linterna, Cartel, Numero, Trazo, fondo, util, PISOS, PisoCapas, Polvo, Lluvia, Palotes, CANTO_FRIO } from "./kit";
import { Act, Actor, camara, sacudon, QUIETO, ESCUDO_FRENTE, ESTOCADA, GOLPE_BAJO, LANZA_CARGA, LANZA_SUELTA, AGOTADO, CUBRE, TRISTE } from "./actor";
import { con, mezclar } from "./rig";
import { MesaMadera } from "./comun";

// ================= 662 → 706 · la línea: esperar, dos jabalinas, gladius bajo desde el escudo, rotar =================
export const Colina: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const tLlega = at("Eventually it comes");
  const tColina = at("enemy is on the hill");
  const tLinea = at("standing in a line");
  const tEscudo = at("shield touching shield");
  const tDentro = at("from the inside");
  const tEsp = at("First the waiting");
  const tHoras = at("Sometimes for hours");
  const tCarga = at("Then the enemy charges");
  const tJab = at("throw your two javelins");
  const tGlad = at("the gladius");
  const tApr = at("step into the crush");
  const tPeli = at("like in the movies");
  const tBajo = at("You stab low");
  const tAtras = at("stabs back");
  const tCansa = at("exhausted in minutes");
  const tRota = at("the Romans rotate");
  const tPaso = at("step back to breathe");
  const tGana = at("won Rome a lot of battles");
  const tFalla = at("it failed completely");
  // línea romana: 7 en primera fila (vos = el del medio) + 7 detrás
  const choque = t > tApr;
  const avance = suave(t, tCarga, tApr); // los germanos bajan de la colina
  const rota = suave(t, tRota + 0.6, tPaso + 0.8); // la primera fila se cambia con la segunda
  const linea: Actor[] = [];
  for (let f = 0; f < 2; f++)
    for (let i = 0; i < 7; i++) {
      const yo = f === 0 && i === 3;
      const frente = f === 0;
      // al rotar, la fila 0 retrocede 90 px y la 1 avanza 90 px (se cruzan por los huecos)
      const dx = (frente ? -1 : 1) * 90 * rota;
      const x0 = -760 + i * 120 + (frente ? 0 : -90) + dx;
      const pose =
        t < tJab
          ? ESCUDO_FRENTE
          : t < tGlad
            ? mezclar(LANZA_CARGA, LANZA_SUELTA, seco(t, tJab + (frente ? 0 : 0.3) + i * 0.04, tJab + 0.4 + (frente ? 0 : 0.3) + i * 0.04))
            : choque && (f === 0 ? rota < 0.5 : rota >= 0.5)
              ? mezclar(ESCUDO_FRENTE, ESTOCADA, (Math.sin(t * 6 + i * 1.7) + 1) / 2)
              : t > tCansa && f === 0 && rota < 0.5
                ? AGOTADO
                : ESCUDO_FRENTE;
      linea.push({
        look: { ...LEGIO_ESC, arma: t < tGlad ? "pilum" : "gladio", barba: (i + f) % 3 === 0 },
        ruta: [[0, x0]],
        poses: [[0, pose]],
        cara: () => ({ enojo: t > tCarga ? 0.6 : 0, boca: t > tApr ? 0.5 : 0.12, giro: yo ? 0.75 : 0.55 }),
        bordes: CANTO_FRIO,
        seed: 300 + f * 10 + i,
        lenta: !yo,
      });
    }
  const germ: Actor[] = Array.from({ length: 9 }, (_, i) => ({
    look: { ...GERMANO, barba: true },
    ruta: [[0, 1300 + i * 140], [tCarga, 1300 + i * 140], [tApr, -100 + i * 90]],
    corre: true,
    mira: -1,
    poses: [[0, QUIETO], [tApr, mezclar(QUIETO, con(QUIETO, { brazo: [150, -4], ante: [160, 4] }), (Math.sin(t * 5 + i) + 1) / 2), 0.3]],
    cara: () => ({ enojo: 0.9, boca: 0.8 }),
    dy: (tt) => -120 * (1 - avance) * (tt < tApr ? 1 : 0),
    seed: 330 + i,
  }));
  const cam0 = camara(t, [
    [t0, -300, -120, 160],
    [tColina, 300, -200, 200],
    [tLinea, -340, -60, 220],
    [tEscudo, -360, -50, 420],
    [tEsp, -300, -60, 280],
    [tHoras + 1, -320, -60, 330],
    [tCarga, 100, -110, 200],
    [tJab + 0.3, -100, -120, 180],
    [tGlad, -360, -70, 460],
    [tApr + 0.4, -300, -60, 380],
    [tBajo, -380, -20, 520],
    [tCansa, -340, -60, 330],
    [tRota, -360, -60, 260],
    [tGana, -200, -80, 120],
    [tFalla + 1.5, -200, -80, 160],
  ], 7);
  const cam = { ...cam0, cy: cam0.cy + (choque && t < tCansa ? sacudon(t, tApr, 10) + 2 * Math.sin(t * 23) : 0) };
  // las jabalinas en el aire
  const jab = (k: number) => {
    const ta = tJab + 0.35 + (k % 2) * 0.3 + (k % 7) * 0.04;
    const u = clamp((t - ta) / 1.1, 0, 1);
    if (u <= 0 || u >= 1) return null;
    const x = lerp(-760 + (k % 7) * 120, 300 + (k % 7) * 120, u);
    const y = -160 - 380 * Math.sin(Math.PI * u);
    const ang = lerp(-35, 35, u);
    return <rect key={k} x={x - 60} y={y} width={120} height={5} fill="#3a2a1a" transform={`rotate(${ang} ${x} ${y})`} />;
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1712" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("colina", 0.8, 300)]} />
      <PisoCapas cam={cam} piso={PISOS.pasto} />
      <Lam D={1000} cam={cam} sombra>
        {germ.map((a, i) => (
          <Act key={i} t={t} a={a} />
        ))}
        {linea.map((a, i) => (
          <Act key={i} t={t} a={a} />
        ))}
        {t > tJab && t < tGlad + 0.6 && Array.from({ length: 14 }, (_, k) => jab(k))}
      </Lam>
      <Lam D={860} cam={cam}>
        <Cartel x={-380} y={-400} texto="SHIELD TO SHIELD" t={t} t0={tEscudo} t1={tDentro} fs={60} />
        <Cartel x={-380} y={-400} texto="1 · THE WAIT" t={t} t0={tEsp} t1={tCarga - 0.1} fs={66} />
        <Numero x={-380} y={-280} t={t} t0={tHoras} t1={tCarga - 0.1} a={0} b={3} dur={1.2} suf=" HOURS" fs={70} />
        <Cartel x={-380} y={-400} texto="2 · TWO JAVELINS" t={t} t0={tJab - 0.2} t1={tGlad - 0.1} fs={64} />
        <Cartel x={-380} y={-400} texto="3 · GLADIUS" sub="STAB LOW · FROM BEHIND THE SHIELD" t={t} t0={tGlad} t1={tCansa - 0.1} fs={64} />
        <Cartel x={-380} y={-400} texto="4 · ROTATE" t={t} t0={tRota} t1={tGana} fs={66} color="#f3e6cf" fondoC="#3f7a3a" />
        <Cartel x={0} y={-430} texto="WHEN IT FAILED…" t={t} t0={tFalla} fs={72} color="#f3e6cf" fondoC="#a3241c" />
      </Lam>
      <Lam D={820} cam={cam}>
        <Polvo t={t} n={choque ? 60 : 24} seed={60} color="#e6d6b0" />
      </Lam>
      <Linterna x={-200} y={0} r={lerp(1000, 760, suave(t, tFalla, tFalla + 1))} osc={0.45} />
      {tPeli < 0 && tAtras < 0 && null}
    </AbsoluteFill>
  );
};

// ================= 706 → 734,8 · Cannas: la mesa de los generales, la tenaza de Aníbal =================
export const Cannas: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const tDuro = at("the hard way");
  const t216 = at("216 before Christ");
  const tCan = at("called Cannae");
  const tAni = at("Hannibal");
  const tRodea = at("surrounded a huge Roman army");
  const tAprieta = at("squeezed it");
  const tMedio = at("men in the middle");
  const tEspadas = at("raise their swords");
  const tMuertos = at("By the ancient accounts");
  const tTarde = at("single afternoon");
  const tSang = at("bloodiest days");
  const tNombre = at("knew the name");
  const tLec = at("lesson was simple");
  const tNunca = at("Never let them surround you");
  const apr = suave(t, tAprieta, tMedio + 1.5);
  const rod = suave(t, tRodea, tAprieta);
  const cam = camara(t, [
    [t0, 0, -40, 120],
    [tCan, 0, -40, 260],
    [tRodea, 0, -20, 220],
    [tMedio, 0, 0, 470],
    [tMuertos, 0, -20, 200],
    [tNombre, 0, -60, 140],
    [tNunca + 2, 0, -60, 220],
  ], 4);
  // fichas: bloque romano (rojo) en el centro, cartaginés (azul) en media luna que se cierra
  const romanos: [number, number][] = [];
  for (let f = 0; f < 6; f++) for (let c = 0; c < 10; c++) romanos.push([-240 + c * 52, -110 + f * 46]);
  const carta: [number, number][] = Array.from({ length: 34 }, (_, i) => {
    const a = (i / 33) * Math.PI * 2;
    const r0 = lerp(560, 360, rod);
    const ang = lerp(Math.PI * 0.62, Math.PI, rod);
    const aa = -Math.PI / 2 + (a - Math.PI) * (ang / Math.PI);
    const r = r0 - 60 * apr;
    return [Math.cos(aa) * r * 1.2, 10 + Math.sin(aa) * r * 0.62];
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#2a170b" }}>
      <MesaMadera cam={cam} seed={23} tono="#523620" />
      <Lam D={1000} cam={cam} sombra>
        <ellipse cx={0} cy={10} rx={780} ry={360} fill="#cbb98e" />
        <path d="M-780,-60 Q-300,-140 0,-90 Q300,-40 780,-120" fill="none" stroke="#7aa0b0" strokeWidth={22} opacity={0.6} />
        <text x={560} y={-150} fontFamily={MANO} fontSize={44} fill="#4a6a7a">
          Aufidus
        </text>
        {romanos.map(([x, y], i) => {
          const cx = x * (1 - 0.32 * apr);
          const cy = 30 + (y - 30) * (1 - 0.32 * apr);
          const muere = t > tMuertos && i % 9 !== 0 ? seco(t, tMuertos + (i % 13) * 0.08, tMuertos + 0.4 + (i % 13) * 0.08) : 0;
          return (
            <g key={i} transform={`translate(${cx + 4 * Math.sin(t * 9 + i) * apr},${cy}) rotate(${80 * muere})`}>
              <rect x={-18} y={-14} width={36} height={28} rx={4} fill={muere > 0.5 ? "#5a1a14" : "#a3241c"} stroke="#5a1a14" strokeWidth={3} />
            </g>
          );
        })}
        {carta.map(([x, y], i) => (
          <g key={"c" + i} transform={`translate(${x},${y})`} opacity={seco(t, tAni + i * 0.02, tAni + 0.3 + i * 0.02)}>
            <rect x={-18} y={-14} width={36} height={28} rx={4} fill="#2f4f78" stroke="#1a2e48" strokeWidth={3} />
          </g>
        ))}
        {/* flechas de la tenaza */}
        <Trazo d="M-640,40 Q-560,-260 -120,-230" u={seco(t, tRodea, tRodea + 1)} w={12} color="#2f4f78" largo={900} />
        <Trazo d="M640,40 Q560,-260 120,-230" u={seco(t, tRodea, tRodea + 1)} w={12} color="#2f4f78" largo={900} />
        <Trazo d="M-640,140 Q-480,300 -60,290" u={seco(t, tRodea + 0.4, tRodea + 1.4)} w={12} color="#2f4f78" largo={900} />
        <Trazo d="M640,140 Q480,300 60,290" u={seco(t, tRodea + 0.4, tRodea + 1.4)} w={12} color="#2f4f78" largo={900} />
      </Lam>
      <Lam D={860} cam={cam}>
        <Cartel x={0} y={-430} texto="CANNAE · 216 BC" t={t} t0={t216} t1={tAni - 0.6} fs={78} />
        <Cartel x={0} y={-430} texto="HANNIBAL" t={t} t0={tAni} t1={tMedio} fs={84} color="#f3e6cf" fondoC="#2f4f78" />
        <Cartel x={0} y={-430} texto="NO ROOM TO RAISE A SWORD" t={t} t0={tMedio + 0.2} t1={tMuertos - 0.1} fs={58} />
        <Numero x={0} y={-380} t={t} t0={tMuertos} t1={tNombre - 0.2} a={0} b={50000} dur={1.6} pre="~" suf=" DEAD" fs={96} color="#f3e6cf" />
        <Cartel x={0} y={-250} texto="ONE AFTERNOON" t={t} t0={tTarde} t1={tNombre - 0.2} fs={56} color="#f3e6cf" fondoC="#a3241c" />
        <Cartel x={0} y={-430} texto="THE LESSON:" t={t} t0={tLec} t1={tNunca - 0.1} fs={70} />
        <Cartel x={0} y={-430} texto="NEVER GET SURROUNDED" t={t} t0={tNunca} fs={72} color="#f3e6cf" fondoC="#a3241c" />
      </Lam>
      <Linterna x={0} y={0} r={lerp(1000, 760, apr)} osc={0.5} />
      {tDuro < 0 && tEspadas < 0 && tSang < 0 && null}
    </AbsoluteFill>
  );
};

// ================= 734,8 → 792,7 · Teutoburgo: 3 días de lluvia, XVII · XVIII · XIX borradas, los huesos =================
export const Bosque: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const tAño = at("In the year 9");
  const tVaro = at("the governor Verus");
  const tTeu = at("Teutoburg Forest");
  const tLluv = at("It rained");
  const tSend = at("narrow muddy trail");
  const tGer = at("German warriors");
  const tArm = at("trained by Rome itself");
  const tLados = at("from every side");
  const tDias = at("for three days");
  const tSinL = at("no room to form a line");
  const tSinC = at("no camp to retreat to");
  const tTres = at("Three entire legions");
  const t17 = at("The 17th");
  const tDesap = at("disappeared");
  const tEntre = at("Somewhere between");
  const tVaroM = at("killed himself");
  const tNum = at("never used again");
  const tSeis = at("Six years later");
  const tTac = at("Tacitus describes");
  const tHuesos = at("Bones lying in the open");
  const tArmas = at("broken weapons");
  const tCraneos = at("human skulls");
  const tArb = at("trunks of the trees");
  const tGloria = at("not glory");
  const tGuardo = at("kept your bones");
  const parte = t < tTres - 0.2 ? 0 : t < tSeis - 0.2 ? 1 : 2;
  // parte 0: la columna en el sendero, emboscada desde los dos lados
  const col: Actor[] = Array.from({ length: 8 }, (_, i) => ({
    look: { ...LEGIO_ESC, barba: i % 3 === 0 },
    ruta: [[0, -1100 + i * 150], [tLluv, -900 + i * 150], [tGer, -700 + i * 150]],
    poses: [[0, QUIETO], [tGer + 0.4 + i * 0.1, ESCUDO_FRENTE, 0.3], [tSinL + 0.3, i % 2 ? CUBRE : AGOTADO, 0.5]],
    mira: i % 2 === 0 ? 1 : -1,
    rot: i % 3 === 1 ? (tt) => -86 * seco(tt, tSinC + i * 0.2, tSinC + 0.5 + i * 0.2) : undefined,
    op: i % 3 === 1 ? (tt) => 1 - 0.7 * suave(tt, tSinC + 1, tTres) : undefined,
    bordes: CANTO_FRIO,
    lenta: true,
    seed: 400 + i,
  }));
  const emb: Actor[] = Array.from({ length: 8 }, (_, i) => ({
    look: GERMANO,
    ruta: [[0, i < 4 ? -1700 - i * 100 : 1300 + i * 100], [tLados - 0.3, i < 4 ? -1700 - i * 100 : 1300 + i * 100], [tLados + 1.5, i < 4 ? -1000 + i * 150 : 600 - (i - 4) * 150]],
    corre: true,
    poses: [[0, con(QUIETO, { brazo: [150, -4], ante: [160, 4] })]],
    cara: () => ({ enojo: 0.9, boca: 0.8 }),
    seed: 420 + i,
  }));
  const cam =
    parte === 0
      ? camara(t, [[t0, -500, -100, 120], [tTeu, -400, -120, 200], [tLluv, -300, -80, 260], [tSend, -200, -40, 340], [tGer, -150, -80, 220], [tLados + 1, -200, -60, 300], [tSinL, -250, -40, 380], [tSinC + 1.4, -250, -50, 300]], 7)
      : parte === 1
        ? camara(t, [[tTres - 0.2, 0, -60, 140], [t17, 0, -60, 260], [tEntre, 0, -60, 200], [tNum, 0, -60, 300], [tSeis, 0, -40, 220]], 4)
        : camara(t, [[tSeis - 0.2, -500, -60, 120], [tTac, -400, -80, 180], [tHuesos, -200, 40, 380], [tArmas, 0, 60, 430], [tCraneos, 300, -220, 480], [tGloria, 200, -100, 260], [tGuardo + 2, 100, -80, 160]], 6);
  const lluvia = parte === 0 ? suave(t, tLluv - 0.3, tLluv + 0.5) : 0;
  const tab = (n: string, i: number, tc: number) => {
    const x = (i - 1) * 420;
    const u = seco(t, tc, tc + 0.3);
    const tach = seco(t, tDesap + i * 0.25, tDesap + 0.4 + i * 0.25);
    return (
      <g key={n} transform={`translate(${x},-60) scale(${u})`} opacity={1 - 0.5 * suave(t, tNum + 1.5, tSeis)}>
        <path d="M-150,-120 L150,-120 L150,120 Q0,170 -150,120 Z" fill="#a3241c" stroke="#5a1a14" strokeWidth={8} />
        <text y={40} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={120} fill="#f3e6cf">
          {n}
        </text>
        <path d={`M-170,-110 L${-170 + 340 * tach},${-110 + 240 * tach}`} stroke="#1a120a" strokeWidth={22} strokeLinecap="round" />
        <path d={`M170,-110 L${170 - 340 * tach},${-110 + 240 * tach}`} stroke="#1a120a" strokeWidth={22} strokeLinecap="round" />
      </g>
    );
  };
  const huesos = [
    [-620, 0], [-420, 1], [-200, 2], [40, 3], [260, 4], [520, 5],
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f130e" }}>
      {parte !== 1 && <Lam D={1400} cam={cam} fotos={[fondo("bosque", 0.8, parte === 2 ? 500 : -300)]} filtro={parte === 2 ? "saturate(0.6) brightness(1.05)" : "saturate(0.8) brightness(0.8)"} />}
      {parte !== 1 && <PisoCapas cam={cam} piso={PISOS.barro} />}
      {parte === 1 && <MesaMadera cam={cam} seed={29} tono="#3f2a1a" />}
      <Lam D={1000} cam={cam} sombra fotos={parte === 2 ? [util("calavera", 420, 1000, 120, -300)] : []}>
        {parte === 0 && (
          <>
            {col.map((a, i) => (
              <Act key={i} t={t} a={a} />
            ))}
            {emb.map((a, i) => (
              <Act key={"e" + i} t={t} a={a} />
            ))}
          </>
        )}
        {parte === 1 && (
          <>
            {tab("XVII", 0, t17)}
            {tab("XVIII", 1, t17 + 0.45)}
            {tab("XIX", 2, t17 + 0.9)}
          </>
        )}
        {parte === 2 && (
          <>
            {huesos.map(([x, k]) => {
              const u = seco(t, tHuesos + k * 0.18, tHuesos + 0.4 + k * 0.18);
              return (
                <g key={x} transform={`translate(${x},${SUELO - 14}) rotate(${(k * 37) % 60 - 30})`} opacity={u}>
                  <rect x={-50} y={-6} width={100} height={12} rx={6} fill="#ece4d0" />
                  <circle cx={-52} cy={-6} r={9} fill="#ece4d0" />
                  <circle cx={-52} cy={6} r={9} fill="#ece4d0" />
                  <circle cx={52} cy={-6} r={9} fill="#ece4d0" />
                  <circle cx={52} cy={6} r={9} fill="#ece4d0" />
                </g>
              );
            })}
            {/* espadas y escudos rotos */}
            <g opacity={seco(t, tArmas, tArmas + 0.4)}>
              <path d="M-100,280 L20,258 L26,268 L-96,292 Z" fill="#8a8f95" />
              <path d="M150,300 Q200,230 260,300 Z" fill="#7a2a1c" stroke="#3a1a10" strokeWidth={4} />
            </g>
            {/* el clavo en el tronco */}
            <circle cx={420} cy={-300} r={6} fill="#5d5f63" opacity={seco(t, tCraneos, tCraneos + 0.3)} />
          </>
        )}
      </Lam>
      <Lam D={860} cam={cam}>
        <Cartel x={-420} y={-410} texto="AD 9 · TEUTOBURG FOREST" t={t} t0={tAño} t1={tLluv} fs={60} />
        <Cartel x={-420} y={-290} texto="VARUS · 3 LEGIONS" t={t} t0={tVaro} t1={tLluv} fs={54} />
        <Cartel x={-420} y={-410} texto="ARMINIUS" sub="TRAINED BY ROME" t={t} t0={tArm} t1={tDias} fs={70} color="#f3e6cf" fondoC="#55603a" />
        <Cartel x={-420} y={-410} texto="3 DAYS" t={t} t0={tDias} t1={tSinL} fs={84} />
        <Cartel x={-420} y={-410} texto="NO LINE · NO ROTATION · NO CAMP" t={t} t0={tSinL} t1={tTres - 0.2} fs={50} color="#f3e6cf" fondoC="#a3241c" />
        <Cartel x={0} y={-440} texto="15,000–20,000 MEN" t={t} t0={tEntre} t1={tNum - 0.2} fs={66} />
        <Cartel x={0} y={250} texto="VARUS: SUICIDE" t={t} t0={tVaroM} t1={tNum - 0.2} fs={50} />
        <Cartel x={0} y={-440} texto="NUMBERS NEVER USED AGAIN" t={t} t0={tNum} t1={tSeis - 0.2} fs={58} color="#f3e6cf" fondoC="#1a120a" />
        <Cartel x={-420} y={-410} texto="AD 15 · SIX YEARS LATER" t={t} t0={tSeis} t1={tHuesos} fs={58} />
        <Cartel x={-420} y={-290} texto="TACITUS" t={t} t0={tTac} t1={tHuesos} fs={54} />
        <Cartel x={-60} y={-430} texto="NOT GLORY" t={t} t0={tGloria} t1={tGuardo} fs={80} />
        <Cartel x={-60} y={-430} texto="6 YEARS IN THE FOREST" t={t} t0={tGuardo} fs={66} color="#f3e6cf" fondoC="#1a120a" />
      </Lam>
      {lluvia > 0 && (
        <Lam D={800} cam={cam} opacidad={lluvia}>
          <Lluvia t={t} n={190} viento={0.5} op={0.65} seed={77} />
        </Lam>
      )}
      <Linterna x={0} y={0} r={parte === 1 ? 980 : lerp(760, 600, suave(t, tLados, tSinC))} osc={parte === 2 ? 0.55 : 0.6} frio />
      {tArb < 0 && null}
    </AbsoluteFill>
  );
};

export const _t6 = { CENTURION, Palotes, GOLPE_BAJO, TRISTE };
