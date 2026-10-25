import React from "react";
import { AbsoluteFill } from "remotion";
import { SUELO, at as atG, clamp, lerp, seco, suave } from "./lib";
import { VETERANO, ESPOSA, CIVIL, LEGIO, CENTURION, LETRA, MANO, Lam, Linterna, Papiro, Cartel, Numero, fondo, util, PISOS, PisoCapas, Polvo, Palotes } from "./kit";
import { Act, Actor, camara, QUIETO, TRISTE, AGOTADO, ABRAZO, MANOS_CADERA, SEÑALA, JURA, RODILLA } from "./actor";
import { con } from "./rig";

// ================= 795 → 825,7 · la colonia: 43 años, rodillas rotas — y 3.000 denarios (o tierra) =================
export const Colonia: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string, d = t0 - 2) => atG(s, d);
  const tLogr = at("you made it");
  const tMarcha = at("survived the march");
  const tCent = at("the centurion");
  const tFieb = at("the fever");
  const tBosq = at("and the forest");
  const tFin = at("years are over");
  const t43 = at("You are");
  const tRod = at("bad knees");
  const tEsp = at("a bad back");
  const tDien = at("teeth missing");
  const tDa = at("What does Rome give you");
  const tPapel = at("On paper");
  const tAug = at("Under Augustus");
  const tPaga = at("more than 10 years of pay");
  const tTierra = at("a plot of land");
  const tCambio = at("Honestly");
  const tu: Actor = {
    look: { ...VETERANO, barba: true, pelo: false },
    ruta: [[0, -900], [tLogr - 0.2, -900], [tFin, -160]],
    vel: 140,
    poses: [[0, AGOTADO], [tRod, con(AGOTADO, { torso: 30 }), 0.5], [tDa, QUIETO, 0.6], [tAug + 0.6, con(QUIETO, { brazo: [80, -4], ante: [96, 4] }), 0.5], [tTierra, QUIETO, 0.5]],
    cara: (tt) => ({ sonrisa: tt > tAug + 0.6 ? 0.6 : 0.05, boca: tt > tDien ? 0.2 : 0.12, parpado: tt < tDa ? 0.35 : 0 }),
    seed: 50,
  };
  const cam = camara(t, [
    [t0, -700, -60, 160],
    [tMarcha, -500, -80, 220],
    [tFin, -200, -60, 300],
    [t43, -170, -100, 470],
    [tDien + 0.3, -150, -150, 560],
    [tDa, -60, -60, 260],
    [tAug, 40, -80, 380],
    [tPaga + 0.4, 100, -60, 300],
    [tTierra, 400, -60, 160],
    [tCambio + 2, 200, -60, 220],
  ], 7);
  // los 4 sellos de lo que sobreviviste, uno tras otro
  const sob: [number, string][] = [
    [tMarcha, "THE MARCH"],
    [tCent, "THE CENTURION"],
    [tFieb, "THE FEVER"],
    [tBosq, "THE FOREST"],
  ];
  const cofre = seco(t, tAug + 0.4, tAug + 0.9);
  return (
    <AbsoluteFill style={{ backgroundColor: "#24170d" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("colonia", 0.8, 200)]} />
      <PisoCapas cam={cam} piso={PISOS.tierra} />
      <Lam D={1000} cam={cam} sombra fotos={t > tAug + 0.4 ? [util("cofre", 140, 1000, 220, 40 * (1 - cofre))] : []}>
        <Act t={t} a={tu} />
        {/* bastón de veterano */}
        {/* parcela: estacas y cuerda que se marcan cuando habla de tierra */}
        {t > tTierra - 0.2 &&
          [0, 1, 2, 3].map((k) => {
            const u = seco(t, tTierra + k * 0.15, tTierra + 0.3 + k * 0.15);
            const x = 360 + (k % 2) * 380;
            const y = SUELO - 10 - Math.floor(k / 2) * 60;
            return <rect key={k} x={x - 5} y={y - 70 * u} width={10} height={70 * u} fill="#8a5a2e" />;
          })}
        {t > tTierra + 0.6 && <path d={`M360,${SUELO - 80} L740,${SUELO - 80} L740,${SUELO - 140} L360,${SUELO - 140} Z`} fill="none" stroke="#efe3cc" strokeWidth={3} strokeDasharray="10 8" opacity={seco(t, tTierra + 0.6, tTierra + 1)} />}
        {/* palitos: 25 años de servicio */}
        <Palotes x={-560} y={-260} n={25} u={seco(t, tFin - 0.3, tFin + 1)} color="#efe3cc" h={44} />
      </Lam>
      <Lam D={860} cam={cam}>
        {sob.map(([tc, n], i) => {
          const u = seco(t, tc, tc + 0.3);
          if (u <= 0 || t > tFin) return null;
          return (
            <g key={n} transform={`translate(${-640 + i * 330},-380) rotate(${-6 + i * 4}) scale(${lerp(1.6, 1, u)})`} opacity={u}>
              <rect x={-150} y={-36} width={300} height={66} rx={6} fill="none" stroke="#3f7a3a" strokeWidth={6} />
              <text y={14} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={36} fill="#3f7a3a">
                ✓ {n}
              </text>
            </g>
          );
        })}
        <Cartel x={-200} y={-420} texto="AGE 43" t={t} t0={t43} t1={tDa - 0.1} fs={84} />
        <Papiro
          x={260}
          y={-220}
          w={440}
          t={t}
          t0={tRod - 0.3}
          t1={tDa - 0.3}
          titulo="VETERAN"
          fs={40}
          lineas={[
            { txt: "bad knees", t: tRod },
            { txt: "bad back", t: tEsp },
            { txt: "teeth: some", t: tDien },
          ]}
        />
        <Cartel x={-80} y={-420} texto="WHAT DOES ROME GIVE YOU?" t={t} t0={tDa} t1={tAug - 0.1} fs={58} />
        <Numero x={60} y={-380} t={t} t0={tAug + 0.4} t1={tTierra - 0.1} a={0} b={3000} dur={1.2} suf=" DENARII" fs={100} color="#e8c55a" />
        <Cartel x={60} y={-250} texto="= 10+ YEARS OF PAY" t={t} t0={tPaga} t1={tTierra - 0.1} fs={56} color="#f3e6cf" fondoC="#3f7a3a" />
        <Cartel x={500} y={-420} texto="OR: LAND IN A COLONY" t={t} t0={tTierra} t1={tCambio + 2.6} fs={58} />
        <Cartel x={500} y={-300} texto="LIFE-CHANGING" t={t} t0={tCambio} t1={tCambio + 2.6} fs={56} color="#f3e6cf" fondoC="#3f7a3a" />
      </Lam>
      <Lam D={820} cam={cam}>
        <Polvo t={t} n={30} seed={50} />
      </Lam>
      <Linterna x={lerp(-500, 100, suave(t, tLogr, tAug))} y={0} r={lerp(700, 1000, suave(t, tDa, tAug + 1))} osc={lerp(0.55, 0.32, suave(t, tDa, tAug + 1))} />
      {tPapel < 0 && null}
    </AbsoluteFill>
  );
};

// ================= 825,7 → 845,3 · el problema es la palabra "si": 30-40 años, y tierra = pantanos =================
export const Pantano: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string, d = t0 - 2) => atG(s, d);
  const tSi = at("the word if");
  const tMot = at("mutiny of the year 14");
  const tGrit = at("shouted about it");
  const t30 = at("held in service for 30");
  const t40 = at("even 40 years");
  const tContr = at("past their contract");
  const tTierra = at("the land they were promised");
  const tPerc = at("a soldier named");
  const tBog = at("swampy bogs");
  const tMont = at("bare sides of mountains");
  const parte2 = t > tTierra - 0.3;
  const tu: Actor = {
    look: { ...VETERANO, barba: true },
    ruta: [[0, parte2 ? -180 : -300]],
    poses: [[0, QUIETO], [tGrit, con(JURA, { brazo: [150, -4] }), 0.3], [tContr + 0.4, MANOS_CADERA, 0.5], [tBog - 0.2, TRISTE, 0.5]],
    cara: (tt) => ({ enojo: tt > tGrit && tt < tTierra ? 0.8 : 0.2, boca: tt > tGrit && tt < tContr ? 0.9 : 0.15 }),
    dy: (tt) => (parte2 ? 46 * suave(tt, tBog, tBog + 1.4) : 0), // se hunde en el barro
    seed: 52,
  };
  const grupo: Actor[] = parte2
    ? []
    : Array.from({ length: 6 }, (_, i) => ({
        look: { ...LEGIO, barba: i % 2 === 0, casco: i % 3 === 0 ? undefined : LEGIO.casco },
        ruta: [[0, -660 + i * 130 + (i > 1 ? 260 : 0)]],
        poses: [[0, QUIETO], [tGrit + i * 0.1, con(JURA, { brazo: [140 + i * 4, -4] }), 0.3], [tContr + 0.6, QUIETO, 0.5]],
        cara: () => ({ enojo: 0.7, boca: t > tGrit && t < tContr ? 0.85 : 0.2 }),
        seed: 510 + i,
      }));
  const gen: Actor = { look: CENTURION, ruta: [[0, 560]], mira: -1, poses: [[0, MANOS_CADERA], [tGrit + 0.3, con(QUIETO, { brazo: [100, -4], ante: [110, 4] }), 0.4]], seed: 520 };
  const cam = !parte2
    ? camara(t, [[t0, -120, -80, 240], [tSi, -200, -120, 420], [tMot, 0, -60, 140], [tGrit, -60, -60, 240], [t30, -60, -70, 280], [tContr, 0, -60, 220]], 7)
    : camara(t, [[tTierra - 0.3, 0, -60, 140], [tPerc, -100, -80, 260], [tBog, -160, 0, 430], [tMont + 2, 0, -80, 180]], 6);
  // el "IF" gigante con su signo de pregunta
  const siU = seco(t, tSi - 0.1, tSi + 0.3);
  return (
    <AbsoluteFill style={{ backgroundColor: "#141810" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("pantano", 0.8, parte2 ? 0 : -600)]} filtro={parte2 ? undefined : "brightness(0.7) saturate(0.8)"} />
      <PisoCapas cam={cam} piso={PISOS.barro} />
      <Lam D={1000} cam={cam} sombra>
        {grupo.map((a, i) => (
          <Act key={i} t={t} a={a} />
        ))}
        {!parte2 && <Act t={t} a={gen} />}
        <Act t={t} a={tu} />
        {parte2 && <rect x={-1200} y={SUELO - 4} width={2400} height={60} fill="#3a3a22" opacity={0.85 * suave(t, tBog, tBog + 0.8)} />}
        {parte2 &&
          t > tBog &&
          Array.from({ length: 6 }, (_, k) => {
            const u = ((t - tBog) * 0.6 + k / 6) % 1;
            return <circle key={k} cx={-500 + k * 200} cy={SUELO - 6} r={6 + 10 * u} fill="none" stroke="#6a6a44" strokeWidth={3} opacity={1 - u} />;
          })}
      </Lam>
      <Lam D={860} cam={cam}>
        {siU > 0 && t < tMot && (
          <g transform={`translate(-200,-300) scale(${lerp(2, 1, siU)}) rotate(-4)`} opacity={siU}>
            <text textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={260} fill="#f3e6cf" stroke="#2a1a10" strokeWidth={8} paintOrder="stroke">
              «IF»
            </text>
          </g>
        )}
        <Cartel x={-300} y={-420} texto="MUTINY · AD 14" t={t} t0={tMot} t1={t30 - 0.1} fs={70} color="#f3e6cf" fondoC="#a3241c" />
        <Numero x={-200} y={-360} t={t} t0={t30} t1={t40 - 0.05} a={25} b={30} dur={0.6} suf=" YEARS" fs={110} />
        <Numero x={-200} y={-360} t={t} t0={t40} t1={tTierra - 0.3} a={30} b={40} dur={0.8} suf=" YEARS" fs={110} color="#ff8a6a" />
        <Cartel x={-200} y={-230} texto="CONTRACT: 25" t={t} t0={tContr} t1={tTierra - 0.3} fs={50} />
        <Cartel x={-300} y={-420} texto="PERCENNIUS" sub="«SWAMPY BOGS AND BARE MOUNTAINSIDES»" t={t} t0={tPerc} fs={66} />
      </Lam>
      <Linterna x={0} y={0} r={parte2 ? 760 : 820} osc={0.55} frio={!parte2} />
    </AbsoluteFill>
  );
};

// ================= 845,3 → 884,5 · los afortunados: honesta missio, la boda, las lápidas que cuentan años =================
export const Tumbas: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string, d = t0 - 2) => atG(s, d);
  const tSuerte = at("did get lucky");
  const tHon = at("honorable discharge");
  const tCasa = at("settled down");
  const tCasó = at("finally married");
  const tHijos = at("children made legal");
  const tLap = at("tombstones still survive");
  const tImp = at("all over the empire");
  const tOrgu = at("proud of one thing");
  const tNoB = at("Not the battles");
  const tAños = at("The number of years they served");
  const t25 = at("25", tAños);
  const t26 = at("26", tAños);
  const tMas = at("Sometimes more");
  const tPiedra = at("carved it into stone");
  const tSolo = at("only goes to the ones still standing");
  const tEnf = at("Between disease");
  const tMitad = at("roughly half", tEnf);
  const tNunca = at("never reached the end");
  const parte2 = t > tLap - 0.3;
  const tu: Actor = {
    look: { ...VETERANO, barba: true },
    ruta: [[0, -120]],
    poses: [[0, QUIETO], [tHon, con(QUIETO, { brazo: [80, -4], ante: [96, 4] }), 0.4], [tCasó, ABRAZO, 0.5]],
    cara: (tt) => ({ sonrisa: tt > tCasó ? 0.75 : 0.4 }),
    seed: 60,
  };
  const esposa: Actor = { look: ESPOSA, ruta: [[0, 700], [tCasa, 700], [tCasó, 40]], mira: -1, poses: [[0, QUIETO], [tCasó, ABRAZO, 0.5]], cara: () => ({ sonrisa: 0.7 }), seed: 61 };
  const hijos: Actor[] = [0, 1].map((i) => ({
    look: { ...CIVIL, escala: 0.62, tunica: i ? "#c7a575" : "#a97a4e" },
    ruta: [[0, 900 + i * 120], [tHijos - 1, 900 + i * 120], [tHijos + 0.4, 200 + i * 120]],
    corre: true,
    mira: -1,
    poses: [[0, QUIETO]],
    cara: () => ({ sonrisa: 0.8 }),
    seed: 62 + i,
  }));
  // parte 2: tres lápidas; en la del medio se talla el número de años
  const cuenta = t < t25 ? 0 : t < t26 ? 25 : 26;
  const cam = !parte2
    ? camara(t, [[t0, -60, -60, 200], [tHon, -80, -80, 330], [tCasó, 0, -60, 300], [tHijos + 0.6, 120, -60, 240]], 7)
    : camara(t, [[tLap - 0.3, 0, -80, 120], [tOrgu, 0, -120, 260], [tAños, 0, -160, 420], [t26 + 0.6, 0, -160, 470], [tSolo, 0, -60, 180], [tMitad, 0, -60, 120], [tNunca + 2, 0, -40, 160]], 6);
  // la lápida del medio se ve como foto (p_lapida) y el número va tallado encima
  const tallado = seco(t, t25 - 0.1, t25 + 0.4);
  // al final: 10 lápidas; 5 se oscurecen ("nunca llegaron")
  const fila = suave(t, tSolo, tSolo + 0.8);
  return (
    <AbsoluteFill style={{ backgroundColor: "#1d1810" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("tumbas", 0.8, parte2 ? 0 : -700)]} filtro={parte2 ? undefined : "brightness(1.08)"} />
      <PisoCapas cam={cam} piso={PISOS.pasto} />
      <Lam D={1000} cam={cam} sombra fotos={parte2 && fila < 1 ? [util("lapida", 0, 1000, 330)] : []} opacidad={1}>
        {!parte2 && (
          <>
            <Act t={t} a={tu} />
            <Act t={t} a={esposa} />
            {hijos.map((a, i) => (
              <Act key={i} t={t} a={a} />
            ))}
            {/* el diploma de bronce: honesta missio */}
            {t > tHon - 0.2 && t < tCasó && (
              <g transform={`translate(-30,${-40 - 20 * seco(t, tHon - 0.2, tHon + 0.3)})`} opacity={seco(t, tHon - 0.2, tHon + 0.3)}>
                <rect x={-50} y={-36} width={100} height={70} rx={4} fill="#b0844a" stroke="#6b4e30" strokeWidth={4} />
                {[0, 1, 2, 3].map((k) => (
                  <line key={k} x1={-36} y1={-20 + k * 14} x2={36} y2={-20 + k * 14} stroke="#6b4e30" strokeWidth={3} />
                ))}
              </g>
            )}
          </>
        )}
        {parte2 && fila < 1 && tallado > 0 && (
          <g opacity={1 - fila}>
            <text x={0} y={-30} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={120} fill="#5a5448" opacity={tallado}>
              {cuenta > 0 ? `STIP ${cuenta === 25 ? "XXV" : "XXVI"}` : ""}
            </text>
            {/* las esquirlas del cincel */}
            {t < t26 + 0.6 &&
              Array.from({ length: 8 }, (_, k) => {
                const u = ((t - t25) * 2 + k / 8) % 1;
                return <circle key={k} cx={60 + 120 * u * Math.cos(k)} cy={-60 - 80 * u + 200 * u * u} r={4} fill="#c9c2b0" opacity={1 - u} />;
              })}
          </g>
        )}
        {parte2 &&
          fila > 0 &&
          Array.from({ length: 10 }, (_, i) => {
            const x = -810 + i * 180;
            const u = seco(t, tSolo + i * 0.05, tSolo + 0.4 + i * 0.05);
            const nunca = i % 2 === 1 ? suave(t, tMitad + 0.2 + i * 0.06, tMitad + 0.8 + i * 0.06) : 0;
            return (
              <g key={i} transform={`translate(${x},${SUELO}) scale(${u})`}>
                <path d="M-60,0 L-60,-170 Q0,-230 60,-170 L60,0 Z" fill={nunca > 0.5 ? "#4a4438" : "#b9b09c"} stroke="#5a5448" strokeWidth={5} />
                <text y={-90} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={40} fill="#5a5448">
                  {nunca > 0.5 ? "—" : "XXV"}
                </text>
              </g>
            );
          })}
      </Lam>
      <Lam D={860} cam={cam}>
        <Cartel x={-400} y={-410} texto="HONESTA MISSIO" sub="HONORABLE DISCHARGE" t={t} t0={tHon} t1={tCasó - 0.1} fs={68} color="#f3e6cf" fondoC="#3f7a3a" />
        <Cartel x={-400} y={-410} texto="FINALLY: MARRIED" t={t} t0={tCasó} t1={tHijos - 0.1} fs={66} />
        <Cartel x={-400} y={-410} texto="CHILDREN: LEGAL" t={t} t0={tHijos} t1={tLap - 0.3} fs={66} color="#f3e6cf" fondoC="#3f7a3a" />
        <Cartel x={0} y={-440} texto="ALL OVER THE EMPIRE" t={t} t0={tImp} t1={tNoB} fs={60} />
        <Cartel x={0} y={-440} texto="NOT THE BATTLES" t={t} t0={tNoB} t1={tAños} fs={66} />
        <Cartel x={0} y={-440} texto="THE YEARS. LIKE A SCORE." t={t} t0={tPiedra} t1={tSolo - 0.1} fs={62} color="#f3e6cf" fondoC="#5a5448" />
        <Cartel x={0} y={-430} texto="ONLY THE ONES STILL STANDING" t={t} t0={tSolo + 0.4} t1={tMitad - 0.1} fs={56} />
        <Cartel x={0} y={-430} texto="1 IN 2 NEVER MADE IT" t={t} t0={tMitad} fs={74} color="#f3e6cf" fondoC="#a3241c" />
      </Lam>
      <Linterna x={0} y={0} r={parte2 ? lerp(900, 1100, fila) : 900} osc={0.42} />
      {tSuerte < 0 && tMas < 0 && tEnf < 0 && null}
    </AbsoluteFill>
  );
};

export const _t7 = { clamp, MANO, Papiro, SEÑALA, RODILLA, AGOTADO };
