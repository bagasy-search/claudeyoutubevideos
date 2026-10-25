import React from "react";
import { AbsoluteFill } from "remotion";
import { SUELO, at as atG, lerp, seco, suave } from "./lib";
import { VETERANO, CIVIL, LEGIO_ESC, LETRA, MANO, Lam, Linterna, Cartel, fondo, PISOS, PisoCapas, Polvo, Palotes } from "./kit";
import { Act, Actor, camara, QUIETO, AGOTADO, TRISTE, SEÑALA } from "./actor";
import { con } from "./rig";
import { MesaMadera, TRAMPAS } from "./comun";

// ================= 884,5 → 911,9 · el giro: una balanza — la legión pesa menos mal que todo lo demás =================
const AFUERA = ["FAMINE", "BANDITS", "PLAGUE", "DEBT", "NO DOCTOR"];
export const Giro: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string, d = t0 - 2) => atG(s, d);
  const tPreg = at("a death trap");
  const tGiro = at("Here is the twist");
  const tMiles = at("Hundreds of thousands");
  const tAfuera = at("outside the Legion");
  const tPeor = at("even more dangerous");
  const tPobre = at("much more poor");
  const tComida = at("fed you every single day");
  const tDoc = at("a doctor", tComida);
  const tBaño = at("a bath", tComida);
  const tSal = at("a salary", tComida);
  const tChance = at("a real chance");
  const tPadre = at("your father never had");
  const tMal = at("a terrible deal");
  const tMejor = at("a better deal than everything else");
  const LEGION: [string, number][] = [
    ["FOOD", tComida],
    ["A DOCTOR", tDoc],
    ["A BATH", tBaño],
    ["A SALARY", tSal],
    ["LAND & MONEY", tChance],
  ];
  // pesos: la legión es mala (pesa hacia "malo"), pero lo de afuera pesa más
  const nAf = AFUERA.filter((_, i) => t > tAfuera + 0.3 + i * 0.35).length;
  const nLe = LEGION.filter(([, tc]) => t > tc).length;
  const inc = t < tAfuera ? 0 : lerp(0, 1, Math.min(1, nAf / 5)) * 14 - nLe * 1.2;
  const cam = camara(t, [
    [t0, 0, -60, 120],
    [tGiro, 0, -80, 220],
    [tMiles, 0, -40, 100],
    [tAfuera, 90, -70, 130],
    [tComida, -90, -70, 130],
    [tPadre, -60, -60, 120],
    [tMal, 0, -60, 160],
    [tMejor + 2, 0, -60, 220],
  ], 5);
  const plato = (x: number, y: number, items: string[], cuantos: number, color: string, titulo: string) => (
    <g transform={`translate(${x},${y})`}>
      <line x1={0} y1={-240} x2={0} y2={0} stroke="#5a3a22" strokeWidth={4} />
      <path d="M-200,0 Q0,60 200,0 Z" fill="#b0844a" stroke="#6b4e30" strokeWidth={5} />
      <text y={100} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={44} fill="#f3e6cf">
        {titulo}
      </text>
      {items.slice(0, cuantos).map((n, i) => (
        <g key={n} transform={`translate(${-120 + (i % 3) * 120},${-30 - Math.floor(i / 3) * 56})`}>
          <rect x={-58} y={-24} width={116} height={46} rx={6} fill={color} stroke="#2a1a10" strokeWidth={3} />
          <text y={9} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={20} fill="#f3e6cf">
            {n}
          </text>
        </g>
      ))}
    </g>
  );
  const marea = suave(t, tMiles, tMiles + 2);
  return (
    <AbsoluteFill style={{ backgroundColor: "#2a170b" }}>
      <MesaMadera cam={cam} seed={31} tono="#56391f" />
      <Lam D={1000} cam={cam} sombra>
        {/* la balanza: brazo que se inclina */}
        <rect x={-12} y={-220} width={24} height={500} fill="#6b4e30" />
        <path d="M-120,280 L120,280 L60,240 L-60,240 Z" fill="#5a3a22" />
        <g transform={`translate(0,-220) rotate(${-inc})`}>
          <rect x={-560} y={-10} width={1120} height={20} rx={8} fill="#8a5a2e" />
          {plato(-520, 240 + 0, LEGION.map(([n]) => n), nLe, "#a3241c", "THE LEGION")}
          {plato(520, 240, AFUERA, nAf, "#4a4438", "EVERYTHING ELSE")}
        </g>
        {/* los voluntarios que igual se anotan: una marea de muñequitos en la mesa */}
        <g opacity={marea * (1 - suave(t, tAfuera, tAfuera + 0.6))}>
          {Array.from({ length: 60 }, (_, i) => (
            <g key={i} transform={`translate(${-700 + (i % 20) * 72},${360 + Math.floor(i / 20) * 40}) scale(0.22)`}>
              <circle cx={0} cy={-200} r={26} fill="#17130f" />
              <path d="M0,-180 L0,-90 M0,-160 L-26,-110 M0,-160 L26,-110 M0,-90 L-20,0 M0,-90 L20,0" stroke="#17130f" strokeWidth={14} strokeLinecap="round" />
            </g>
          ))}
        </g>
      </Lam>
      <Lam D={860} cam={cam}>
        <Cartel x={0} y={-460} texto="A DEATH TRAP?" t={t} t0={tPreg} t1={tGiro} fs={84} />
        <Cartel x={0} y={-460} texto="THE TWIST" t={t} t0={tGiro} t1={tMiles} fs={84} color="#f3e6cf" fondoC="#a3241c" />
        <Cartel x={0} y={-460} texto="THEY STILL SIGNED UP" t={t} t0={tMiles} t1={tAfuera} fs={66} />
        <Cartel x={460} y={-460} texto="MORE DANGEROUS · MORE POOR" t={t} t0={tPeor} t1={tComida} fs={50} />
        <Cartel x={0} y={-460} texto="A TERRIBLE DEAL…" t={t} t0={tMal} t1={tMejor - 0.05} fs={72} />
        <Cartel x={0} y={-460} texto="…BETTER THAN EVERYTHING ELSE" t={t} t0={tMejor} fs={62} color="#f3e6cf" fondoC="#3f7a3a" />
      </Lam>
      <Linterna x={0} y={0} r={950} osc={0.45} />
      {tPobre < 0 && null}
    </AbsoluteFill>
  );
};

// ================= 911,9 → 928,8 · las ciudades que nacieron de los fuertes: Colonia, York, Viena =================
export const Ciudad: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string, d = t0 - 2) => atG(s, d);
  const tRet = at("finally retired");
  const tPueb = at("towns that grew up around the old forts");
  const tSig = at("still there");
  const tCol = at("Cologne");
  const tYork = at("York");
  const tVie = at("Vienna");
  const tHoy = at("exist today");
  const tRod = at("with bad knees");
  const tBast = at("walked far enough");
  const tu: Actor = {
    look: { ...VETERANO, barba: true },
    ruta: [[0, -900], [tRet, -900], [tPueb + 1.5, -380], [tBast - 0.6, -380], [tBast + 0.4, -330]],
    vel: 120,
    poses: [[0, AGOTADO], [tPueb + 1.6, con(QUIETO, { torso: 8 }), 0.5], [tBast, con(QUIETO, { torso: 4 }), 0.6]],
    cara: (tt) => ({ sonrisa: tt > tBast ? 0.6 : 0.2, parpado: tt > tBast + 0.3 ? 0.5 : 0 }),
    seed: 70,
  };
  const veci: Actor[] = Array.from({ length: 4 }, (_, i) => ({
    look: { ...CIVIL, barba: i % 2 === 0, tunica: ["#c9a26a", "#a97a4e", "#d1b07a", "#b8875a"][i] },
    ruta: [[0, 200 + i * 180], [tPueb, 200 + i * 180], [tPueb + 6, 300 + i * 160]],
    poses: [[0, QUIETO]],
    op: (tt) => suave(tt, tPueb, tPueb + 0.6),
    lenta: true,
    seed: 700 + i,
  }));
  const cam = camara(t, [
    [t0, -700, -60, 160],
    [tPueb, -300, -80, 160],
    [tSig, 0, -100, 100],
    [tCol, 0, -120, 140],
    [tHoy, -200, -60, 220],
    [tRod, -350, -80, 420],
    [tBast + 1.5, -340, -80, 470],
  ], 7);
  const ciudades: [string, string, number][] = [
    ["COLOGNE", "COLONIA AGRIPPINA", tCol],
    ["YORK", "EBORACUM", tYork],
    ["VIENNA", "VINDOBONA", tVie],
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: "#1d140c" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("ciudad", 0.8)]} />
      <PisoCapas cam={cam} piso={PISOS.piedra} />
      <Lam D={1000} cam={cam} sombra>
        {veci.map((a, i) => (
          <Act key={i} t={t} a={a} />
        ))}
        <Act t={t} a={tu} />
      </Lam>
      <Lam D={860} cam={cam}>
        <Cartel x={-200} y={-430} texto="TOWNS AROUND THE OLD FORTS" t={t} t0={tPueb} t1={tCol - 0.1} fs={56} />
        {ciudades.map(([n, lat, tc], i) => (
          <Cartel key={n} x={-420 + i * 420} y={-420 + (i % 2) * 40} texto={n} sub={lat} t={t} t0={tc} t1={tRod} fs={70} color="#f3e6cf" fondoC="#3f5a7a" />
        ))}
        <Cartel x={-300} y={-430} texto="FAR ENOUGH." t={t} t0={tBast} fs={70} />
      </Lam>
      <Lam D={820} cam={cam}>
        <Polvo t={t} n={30} seed={70} />
      </Lam>
      <Linterna x={lerp(-500, -340, suave(t, tRet, tPueb + 2))} y={0} r={lerp(900, 640, suave(t, tRod, tBast + 1))} osc={lerp(0.35, 0.55, suave(t, tRod, tBast + 1))} />
    </AbsoluteFill>
  );
};

// ================= 928,8 → fin · CTA: suscribirse + campanita + la próxima: un barco + UNA pregunta =================
export const Cierre: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string, d = t0 - 2) => atG(s, d);
  const tSus = at("subscribe");
  const tCamp = at("hit the bell");
  const tBarco = at("joining a ship");
  const tCom = at("tell me in the comments");
  const tSiete = at("which one of these seven traps");
  const tPrim = at("got you first");
  const cam = camara(t, [[t0, 0, -60, 120], [tSus, 0, -60, 200], [tBarco, 380, -80, 300], [tCom, 0, -40, 120], [tPrim + 1, 0, -40, 160]], 5);
  const tu: Actor = {
    look: LEGIO_ESC,
    ruta: [[0, -520]],
    poses: [[0, QUIETO], [tSus, con(SEÑALA, {}), 0.4], [tCamp + 1, QUIETO, 0.4], [tCom, con(QUIETO, { brazo: [60, -4], ante: [120, 4], cabeza: -8 }), 0.4]],
    cara: () => ({ sonrisa: 0.6, giro: 0.85 }),
    seed: 80,
  };
  const sus = seco(t, tSus - 0.1, tSus + 0.3);
  const camp = seco(t, tCamp, tCamp + 0.3);
  const barco = seco(t, tBarco, tBarco + 0.5);
  const preg = suave(t, tCom, tCom + 0.4);
  const fueraCta = suave(t, tCom - 0.3, tCom + 0.2);
  return (
    <AbsoluteFill style={{ backgroundColor: "#2a170b" }}>
      <MesaMadera cam={cam} seed={41} tono="#5b3c22" />
      <Lam D={1000} cam={cam} sombra>
        <g transform={`translate(0,${SUELO - 300})`}>
          <Act t={t} a={{ ...tu, op: () => 1 - fueraCta }} />
        </g>
        {/* botón de suscribirse de cartón + campanita */}
        {sus > 0 && (
          <g transform={`translate(-80,-80) scale(${lerp(1.5, 1, sus)}) rotate(-3)`} opacity={sus * (1 - fueraCta)}>
            <rect x={-230 + 10} y={-56 + 10} width={460} height={112} rx={18} fill="#2a1206" opacity={0.35} />
            <rect x={-230} y={-56} width={460} height={112} rx={18} fill="#c2261c" stroke="#5a1a14" strokeWidth={6} />
            <text y={18} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={56} fill="#f3e6cf" letterSpacing={3}>
              SUBSCRIBE
            </text>
          </g>
        )}
        {camp > 0 && (
          <g transform={`translate(250,-90) rotate(${22 * Math.sin((t - tCamp) * 9) * Math.exp(-(t - tCamp) * 1.4)}) scale(${camp})`} opacity={1 - fueraCta}>
            <path d="M-40,20 Q-40,-50 0,-56 Q40,-50 40,20 L52,34 L-52,34 Z" fill="#e8b400" stroke="#7a5a00" strokeWidth={5} />
            <circle cx={0} cy={44} r={10} fill="#e8b400" stroke="#7a5a00" strokeWidth={4} />
          </g>
        )}
        {/* adelanto: un barco de papel que entra navegando */}
        {barco > 0 && (
          <g transform={`translate(${lerp(1000, 500, barco)},${120 + 8 * Math.sin(t * 2)})`} opacity={1 - fueraCta}>
            <path d="M-150,0 L150,0 L110,60 L-110,60 Z" fill="#7a4a24" stroke="#3a2414" strokeWidth={5} />
            <line x1={0} y1={0} x2={0} y2={-200} stroke="#3a2414" strokeWidth={6} />
            <path d="M6,-190 L120,-40 L6,-40 Z" fill="#efe3cc" stroke="#8a7a5a" strokeWidth={4} />
            {[-90, -50, -10, 30, 70].map((x) => (
              <line key={x} x1={x} y1={30} x2={x - 30} y2={90} stroke="#5a3a22" strokeWidth={5} />
            ))}
            <text x={0} y={140} textAnchor="middle" fontFamily={MANO} fontWeight={700} fontSize={48} fill="#f3e6cf">
              next: a Roman ship
            </text>
          </g>
        )}
        {/* la pregunta: los 7 mojones, uno se ilumina por turno */}
        {preg > 0 && (
          <g opacity={preg}>
            <text x={0} y={-230} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={64} fill="#f3e6cf" stroke="#2a1a10" strokeWidth={6} paintOrder="stroke">
              WHICH TRAP GETS YOU FIRST?
            </text>
            {TRAMPAS.map((n: string, i: number) => {
              const x = -720 + i * 240;
              const u = seco(t, tSiete + i * 0.12, tSiete + 0.3 + i * 0.12);
              const luz = Math.floor((t - tPrim) * 2.5) % 7 === i && t > tPrim;
              return (
                <g key={n} transform={`translate(${x},20) scale(${u}) rotate(${(i % 2 ? 1 : -1) * 2})`}>
                  <rect x={-108} y={-60} width={216} height={130} rx={10} fill={luz ? "#a3241c" : "#efe3cc"} stroke="#3a2414" strokeWidth={5} />
                  <text y={-16} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={36} fill={luz ? "#f3e6cf" : "#a3241c"}>
                    {["I", "II", "III", "IV", "V", "VI", "VII"][i]}
                  </text>
                  <text y={38} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={24} fill={luz ? "#f3e6cf" : "#3a2414"}>
                    {n}
                  </text>
                </g>
              );
            })}
            <text x={0} y={240} textAnchor="middle" fontFamily={MANO} fontWeight={700} fontSize={52} fill="#e8c55a">
              tell me in the comments
            </text>
          </g>
        )}
      </Lam>
      <Linterna x={0} y={0} r={1000} osc={0.38} />
    </AbsoluteFill>
  );
};

export const _fin = { fondo, PISOS, PisoCapas, CIVIL, AGOTADO, TRISTE, Palotes };
