import React from "react";
import { AbsoluteFill } from "remotion";
import { F, SUELO, at as atG, clamp, lerp, seco, suave } from "./lib";
import { CIVIL, RECLUTA, OFICIAL, ESPOSA, LEGIO, LETRA, MANO, Lam, Linterna, Papiro, Cartel, Numero, fondo, util, PISOS, PisoCapas, Polvo, Palotes } from "./kit";
import { Act, Actor, camara, QUIETO, FIRME, JURA, TRISTE, SEÑALA, MANOS_CADERA, ABRAZO, LEE } from "./actor";
import { SENTADO, con } from "./rig";

// ================= 53,6 → 63,5 · la granja: año 110, 18 años, dos hermanos y una granja chica =================
export const Granja: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const tAño = at("year 110");
  const tEdad = at("18 years old");
  const tHerm = at("two brothers");
  const tVa = at("you walk to the recruiting");
  const cam = camara(t, [
    [t0, -260, -40, 120],
    [tEdad, -140, -40, 300],
    [tHerm + 0.4, -60, -30, 320],
    [tVa + 0.5, 120, -40, 260],
    [tVa + 3, 420, -40, 300],
  ], 7);
  const tu: Actor = { look: CIVIL, ruta: [[t0, -200], [tVa, -200], [tVa + 3.2, 760]], poses: [[t0, TRISTE], [tEdad, QUIETO, 0.5]], seed: 3 };
  const hermano: Actor = {
    look: { ...CIVIL, tunica: "#a97a4e", barba: true },
    ruta: [[t0, 40]],
    mira: -1,
    poses: [[t0, con(QUIETO, { torso: 22, brazo: [70, 40], ante: [110, 80], cabeza: 18 })], [tHerm - 0.2, QUIETO, 0.4], [tVa + 0.8, con(QUIETO, { brazo: [160, -4], ante: [150 + 25 * Math.sin(t * 9), 4] }), 0.4]],
    vueltas: [[tVa + 0.6, 1]],
    seed: 5,
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#24170e" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("granja", 0.8)]} />
      <PisoCapas cam={cam} piso={PISOS.pasto} />
      <Lam D={1000} cam={cam} sombra>
        {/* el cuenco de los dos hermanos: una sola porción */}
        <g opacity={suave(t, tHerm - 0.5, tHerm)}>
          <path d={`M-110,${SUELO - 2} Q-80,${SUELO - 34} -50,${SUELO - 2} Z`} fill="#8a5a2e" />
          <ellipse cx={-80} cy={SUELO - 20} rx={26} ry={6} fill="#d8b04a" />
        </g>
        <Act t={t} a={hermano} />
        <Act t={t} a={tu} />
      </Lam>
      <Lam D={900} cam={cam}>
        <Cartel x={-420} y={-320} texto="AD 110" t={t} t0={tAño} t1={tHerm} fs={84} />
        <Cartel x={60} y={-320} texto="AGE 18" t={t} t0={tEdad} t1={tVa} fs={84} />
      </Lam>
      <Linterna x={lerp(-140, 140, suave(t, tVa, tVa + 2))} y={60} r={760} osc={0.38} />
    </AbsoluteFill>
  );
};

// cartelito de oficio que se levanta sobre la cabeza (✓ verde / ✗ rojo)
const Oficio: React.FC<{ x: number; t: number; t0: number; txt: string; ok: boolean; t1?: number; alto?: number }> = ({ x, t, t0, txt, ok, t1 = 1e9, alto = 0 }) => {
  const u = seco(t, t0, t0 + 0.3);
  const v = suave(t, t1, t1 + 0.3);
  if (u <= 0 || v >= 1) return null;
  // los carteles van a dos alturas alternadas: a 140 px de distancia no entran todos en una sola fila
  const w = txt.length * 16 + 64;
  return (
    <g transform={`translate(${x},${lerp(-40, -150 - alto, u)})`} opacity={u * (1 - v)}>
      <line x1={0} y1={0} x2={0} y2={60 + alto} stroke="#5a4024" strokeWidth={5} />
      <rect x={-w / 2} y={-52} width={w} height={56} fill="#e9d6a8" />
      <text x={-w / 2 + 16} y={-14} fontFamily={LETRA} fontWeight={700} fontSize={26} fill="#3a2414">
        {txt}
      </text>
      <circle cx={w / 2 - 26} cy={-24} r={18} fill={ok ? "#3f7a3a" : "#a3241c"} />
      <path d={ok ? `M${w / 2 - 35},-24 l7,8 l12,-15` : `M${w / 2 - 33},-31 l14,14 M${w / 2 - 19},-31 l-14,14`} stroke="#f3e6cf" strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>
  );
};

// ================= 63,5 → 135,2 · el foro: te miden, te eligen, te marcan, jurás… y te quitan la esposa =================
const MESA_X = 0;
const TU_X = -220;
export const Foro: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const tMide = at("they measure you");
  const tIdeal = at("The ideal recruit");
  const tOjos = at("alert eyes");
  const tPecho = at("broad chest");
  const tHomb = at("muscular shoulders");
  const tDedos = at("long fingers");
  const tPanza = at("small belly");
  const tDientes = at("check your teeth");
  const tVivir = at("did for a living");
  const tHerr = at("Blacksmiths");
  const tCarp = at("carpenters");
  const tCarn = at("butchers");
  const tJab = at("hunters of wild boar");
  const tPesc = at("Fishermen");
  const tPast = at("pastry cooks");
  const tTej = at("linen weavers");
  const tMuj = at("quarters");
  const tCasa = at("asked to go home");
  const tPasa = at("You pass");
  const tPlomo = at("small lead tag");
  const tMarca = at("tattooed on your hand");
  const tHuye = at("run away");
  const tJura = at("the oath");
  const tSac = at("sacramentum");
  const tCuerpo = at("your body belongs to Rome");
  const tCuarto = at("quarter of a century");
  const tClaus = at("clause nobody reads");
  const tCasar = at("allowed to marry");
  const t25 = at("Not for 25 years");
  const tEsposa = at("already have a wife");
  const tDeja = at("stops counting");
  const tFam = at("kept families");
  const tHijos = at("children did not exist");
  const AG = 1080; // el águila (el juramento)
  const camKs: [number, number, number, number][] = [
    [t0, -360, -40, 160],
    [tMide + 0.3, -260, -60, 420],
    [tOjos, -250, -130, 600],
    [tPanza + 0.4, -240, -40, 560],
    [tDientes + 0.3, -120, -60, 380],
    [tHerr + 0.2, 330, -60, 300],
    [tJab + 0.6, 470, -60, 280],
    [tMuj + 0.4, 820, -60, 300],
    [tPasa, 120, -60, 330],
    [tPlomo + 0.4, -60, -110, 560],
    [tMarca + 0.6, -40, -20, 600],
    [tHuye + 0.4, -40, -60, 380],
    [tJura + 0.6, AG - 300, -90, 300],
    [tCuerpo + 0.4, AG - 260, -130, 360],
    [tCuarto + 1.2, AG - 240, -90, 200],
    [tEsposa, AG - 520, -50, 330],
    [tDeja + 0.6, AG - 520, -60, 420],
    [tHijos + 1.4, AG - 600, -50, 260],
  ];
  const cam = camara(t, camKs, 7);
  // el recluta: lo miden en la mesa, cruza al águila a jurar, y ahí aparece su mujer
  const tu: Actor = {
    look: t < tSac ? CIVIL : RECLUTA,
    ruta: [[t0, -900], [tMide - 0.3, TU_X], [tJura - 0.6, TU_X], [tJura + 1.6, AG - 260]],
    poses: [
      [t0, QUIETO],
      [tMide, FIRME, 0.4],
      [tDientes + 0.1, con(FIRME, { cabeza: -16 }), 0.3],
      [tVivir, FIRME, 0.3],
      [tPasa + 0.2, con(QUIETO, { brazo: [40, 40], ante: [-50, -50] }), 0.3],
      [tMarca, con(QUIETO, { brazo: [60, -4], ante: [100, 4], cabeza: 14 }), 0.4],
      [tHuye + 0.4, QUIETO, 0.4],
      [tSac + 0.1, JURA, 0.45],
      [tCuarto + 0.8, FIRME, 0.5],
      [tEsposa + 0.3, con(QUIETO, { brazo: [60, -4], ante: [80, 4] }), 0.5],
      [tDeja + 0.25, TRISTE, 0.4],
    ],
    vueltas: [[tJura + 1.8, 1], [tEsposa - 0.2, -1]],
    cara: (tt) => ({ sonrisa: tt > tPasa && tt < tMarca ? 0.5 : 0.1, boca: tt > tDientes && tt < tVivir ? 0.8 : 0.12 }),
    seed: 4,
  };
  const oficial: Actor = {
    look: OFICIAL,
    ruta: [[0, MESA_X + 110]],
    mira: -1,
    poses: [[0, con(SENTADO, { brazo: [40, 20], ante: [80, 60] })], [tOjos, con(SENTADO, { brazo: [96, 20], ante: [96, 60] }), 0.3], [tPasa + 0.1, con(SENTADO, { brazo: [150, 20], ante: [150, 60] }), 0.25], [tPasa + 0.8, con(SENTADO, { brazo: [40, 20], ante: [80, 60] }), 0.4]],
    sinSombra: true,
    seed: 8,
  };
  // la fila de oficios
  const oficios = [
    { x: 300, t: tHerr, txt: "BLACKSMITH", ok: true },
    { x: 440, t: tCarp, txt: "CARPENTER", ok: true },
    { x: 580, t: tCarn, txt: "BUTCHER", ok: true },
    { x: 720, t: tJab, txt: "BOAR HUNTER", ok: true },
    { x: 860, t: tPesc, txt: "FISHERMAN", ok: false },
    { x: 1000, t: tPast, txt: "PASTRY COOK", ok: false },
    { x: 1140, t: tTej, txt: "LINEN WEAVER", ok: false },
    { x: 1280, t: tMuj, txt: "WOMEN'S QUARTERS", ok: false },
  ];
  const fila: Actor[] = oficios.map((o, i) => ({
    look: { ...CIVIL, tunica: ["#b8875a", "#a97a4e", "#c7a575", "#8a5a3a", "#6f8a8a", "#d9b08a", "#cdbb93", "#b07a8a"][i], barba: i % 2 === 0, pelo: true },
    ruta: o.ok ? [[0, o.x]] : [[0, o.x], [tCasa + 0.2 + i * 0.1, o.x], [tCasa + 3.5 + i * 0.1, o.x + 1300]],
    mira: -1,
    poses: [[0, QUIETO]],
    vueltas: o.ok ? undefined : [[tCasa + 0.1 + i * 0.1, 1]],
    cara: (tt) => ({ sonrisa: o.ok && tt > o.t ? 0.6 : 0.1, enojo: !o.ok && tt > o.t ? 0.4 : 0 }),
    seed: 20 + i,
  }));
  const reclutas: Actor[] = [0, 1, 2].map((i) => ({
    look: { ...RECLUTA, barba: i === 1 },
    ruta: [[0, AG - 80 + i * 150]],
    mira: -1,
    poses: [[0, FIRME], [tSac + 0.25 + i * 0.1, JURA, 0.45], [tCuarto + 0.9, FIRME, 0.5]],
    op: (tt) => 1 - suave(tt, tClaus, tClaus + 0.6),
    seed: 40 + i,
  }));
  const esposa: Actor = {
    look: ESPOSA,
    ruta: [[0, AG - 1200], [tEsposa - 0.4, AG - 1200], [tEsposa + 1.4, AG - 560]],
    poses: [[0, QUIETO], [tEsposa + 1.5, con(QUIETO, { brazo: [60, -4], ante: [80, 4] }), 0.4], [tDeja + 0.25, con(TRISTE, { brazo: [40, 40], ante: [120, 120] }), 0.4]],
    seed: 50,
  };
  const hijos: Actor[] = [0, 1].map((i) => ({
    look: { ...CIVIL, escala: 0.55 + i * 0.07, tunica: i ? "#c7a575" : "#b8875a", ancho: 9 },
    ruta: [[0, AG - 1320 - i * 80], [tFam - 0.6, AG - 1320 - i * 80], [tFam + 1.2, AG - 720 - i * 90]],
    poses: [[0, QUIETO]],
    op: (tt) => 1 - 0.78 * suave(tt, tHijos + 0.3, tHijos + 1.3),
    seed: 60 + i,
  }));
  // el certificado de matrimonio entre los dos: se parte en dos
  const corte = seco(t, tDeja, tDeja + 0.6);
  const cert = suave(t, tEsposa + 1.2, tEsposa + 1.7);
  const cx = AG - 410;
  // círculos de tiza sobre el cuerpo del recluta (lo que dice Vegecio)
  const marcas = [
    { t: tOjos, x: TU_X + 10, y: 22, rx: 30, ry: 22 },
    { t: tPecho, x: TU_X, y: 112, rx: 40, ry: 34 },
    { t: tHomb, x: TU_X, y: 80, rx: 60, ry: 16 },
    { t: tDedos, x: TU_X + 4, y: 182, rx: 30, ry: 22 },
    { t: tPanza, x: TU_X + 4, y: 150, rx: 30, ry: 22 },
  ];
  // la vara de medir junto a él
  const mide = suave(t, tMide - 0.2, tMide + 0.6) * (1 - suave(t, tVivir, tVivir + 0.5));
  const cursor = seco(t, tMide + 0.4, tMide + 1.3);
  return (
    <AbsoluteFill style={{ backgroundColor: "#24170e" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("forum", 0.8, 300)]} />
      <PisoCapas cam={cam} piso={PISOS.piedra} />
      <Lam D={1000} cam={cam} sombra fotos={[util("mesa", MESA_X, 1000, 300), util("aguila", AG + 140, 1000, 190)]}>
        {mide > 0 && (
          <g opacity={mide}>
            <rect x={TU_X - 86} y={-4} width={14} height={SUELO + 4} fill="#c99a5e" />
            {Array.from({ length: 15 }, (_, i) => (
              <line key={i} x1={TU_X - 86} x2={TU_X - 76} y1={SUELO - i * 20} y2={SUELO - i * 20} stroke="#5a3a22" strokeWidth={3} />
            ))}
            <rect x={TU_X - 100} y={lerp(-30, 6, cursor)} width={50} height={8} fill="#5a3a22" />
          </g>
        )}
        <Act t={t} a={oficial} />
        {fila.map((a, i) => (
          <Act key={i} t={t} a={a} />
        ))}
        {oficios.map((o, i) => (
          <Oficio key={i} x={o.x + (o.ok ? 0 : 1300 * suave(t, tCasa + 0.2 + i * 0.1, tCasa + 3.5 + i * 0.1))} t={t} t0={o.t} txt={o.txt} ok={o.ok} t1={tPasa + 1} alto={i % 2 ? 90 : 0} />
        ))}
        {reclutas.map((a, i) => (
          <Act key={i} t={t} a={a} />
        ))}
        {hijos.map((a, i) => (
          <Act key={i} t={t} a={a} />
        ))}
        <Act t={t} a={esposa} />
        <Act t={t} a={tu} />
        {marcas.map((m, i) => {
          const u = seco(t, m.t, m.t + 0.4);
          const fuera = suave(t, tDientes, tDientes + 0.4);
          if (u <= 0 || fuera >= 1) return null;
          const L = 2 * Math.PI * Math.max(m.rx, m.ry);
          return <ellipse key={i} cx={m.x} cy={m.y} rx={m.rx} ry={m.ry} fill="none" stroke="#f3ead8" strokeWidth={5} strokeDasharray={`${L * u} ${L}`} opacity={1 - fuera} transform={`rotate(-8 ${m.x} ${m.y})`} />;
        })}
        {/* la chapa de plomo (signaculum) y la marca en la mano */}
        {t > tPlomo && t < tClaus && (
          <g opacity={suave(t, tPlomo, tPlomo + 0.4)}>
            <path d={`M${TU_X - 10},64 Q${TU_X},96 ${TU_X + 10},64`} stroke="#3a3430" strokeWidth={2.4} fill="none" />
            <circle cx={TU_X} cy={100} r={9 + 3 * Math.exp(-(t - tPlomo) * 3)} fill="#8d9197" stroke="#3a3430" strokeWidth={2} />
            <circle cx={TU_X - 3} cy={97} r={3} fill="#e8ecef" opacity={0.6 + 0.4 * Math.sin(t * 3)} />
          </g>
        )}
        {cert > 0 && (
          <g opacity={cert * (1 - suave(t, tFam + 1, tFam + 1.6))}>
            <g transform={`translate(${-60 * corte},${30 * corte}) rotate(${-14 * corte} ${cx} -20)`}>
              <path d={`M${cx - 80},-60 L${cx},-60 L${cx + 6},-30 L${cx - 4},0 L${cx + 4},20 L${cx - 80},20 Z`} fill="#e9d6a8" />
              <text x={cx - 70} y={-28} fontFamily={MANO} fontWeight={700} fontSize={26} fill="#3a2414">
                Matrim
              </text>
            </g>
            <g transform={`translate(${60 * corte},${36 * corte}) rotate(${12 * corte} ${cx} -20)`}>
              <path d={`M${cx},-60 L${cx + 80},-60 L${cx + 80},20 L${cx + 4},20 L${cx - 4},0 L${cx + 6},-30 Z`} fill="#e9d6a8" />
              <text x={cx + 8} y={-28} fontFamily={MANO} fontWeight={700} fontSize={26} fill="#3a2414">
                onium
              </text>
            </g>
          </g>
        )}
      </Lam>
      <Lam D={850} cam={cam}>
        <Papiro
          x={-660}
          y={-330}
          w={520}
          t={t}
          t0={tIdeal - 0.2}
          t1={tHerr - 0.3}
          titulo="VEGETIUS · THE IDEAL RECRUIT"
          fs={34}
          lineas={[
            { txt: "alert eyes", t: tOjos },
            { txt: "a broad chest", t: tPecho },
            { txt: "muscular shoulders", t: tHomb },
            { txt: "long fingers", t: tDedos },
            { txt: "a small belly", t: tPanza },
          ]}
        />
        <Cartel x={-60} y={-330} texto="PASSED" t={t} t0={tPasa} t1={tPlomo + 1.5} color="#f3e6cf" fondoC="#3f7a3a" fs={80} />
        <Cartel x={AG - 280} y={-360} texto="SACRAMENTUM" sub="THE OATH" t={t} t0={tSac} t1={tCuerpo + 1} fs={70} />
        <Cartel x={AG - 520} y={-360} texto="NO MARRIAGE" sub="FOR 25 YEARS" t={t} t0={tCasar} t1={tFam} color="#f3e6cf" fondoC="#a3241c" fs={70} />
      </Lam>
      <Lam D={1000} cam={cam}>
        {t > tCuerpo - 0.2 && t < tClaus + 0.4 && <Palotes x={AG - 520} y={-250} n={25} u={seco(t, tCuerpo, tCuarto + 0.6)} h={54} />}
        {t > tCuerpo && t < tClaus + 0.4 && (
          <text x={AG - 40} y={-210} fontFamily={LETRA} fontWeight={700} fontSize={50} fill="#f3e6cf" opacity={suave(t, tCuarto, tCuarto + 0.4)}>
            = 25 YEARS
          </text>
        )}
        {t25 > 0 && null}
      </Lam>
      <Lam D={780} cam={cam}>
        <Polvo t={t} n={26} seed={12} />
      </Lam>
      <Linterna
        x={lerp(-80, 80, suave(t, tHerr, tMuj)) * (t < tPasa ? 1 : 0)}
        y={30}
        r={t < tHerr ? 640 : t < tPasa ? 980 : t < tJura ? 600 : t < tEsposa ? 760 : 820}
        osc={t < tHijos ? 0.45 : lerp(0.45, 0.62, suave(t, tHijos, tHijos + 1))}
      />
    </AbsoluteFill>
  );
};

// pilas de monedas de plata: cada pila se va volando cuando la voz nombra su descuento
const Monedas: React.FC<{ x: number; y: number; t: number; pilas: number; sale: number[]; aparece: number }> = ({ x, y, t, pilas, sale, aparece }) => (
  <g>
    {Array.from({ length: pilas }, (_, k) => {
      const ap = seco(t, aparece + k * 0.12, aparece + k * 0.12 + 0.3);
      const s = sale[k] ?? 1e9;
      const v = seco(t, s, s + 0.7);
      if (ap <= 0 || v >= 1) return null;
      const px = x + k * 74 + v * 900;
      const py = y - v * 420 + v * v * 200;
      return (
        <g key={k} transform={`translate(${px},${py}) rotate(${v * 260})`} opacity={1 - v}>
          {Array.from({ length: 8 }, (_, j) => (
            <g key={j}>
              <ellipse cx={0} cy={-j * 11 * ap} rx={30} ry={9} fill="#9aa0a6" />
              <ellipse cx={0} cy={-j * 11 * ap - 3} rx={30} ry={9} fill="#d4d8dc" />
            </g>
          ))}
        </g>
      );
    })}
  </g>
);

// ================= 135,2 → 163,3 · Egipto: 300 denarios… y los descuentos =================
export const Egipto: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const at = (s: string) => atG(s, t0 - 2);
  const tDom = at("Emperor Domitian");
  const t300 = at("300 silver denarii");
  const tDec = at("Sounds decent");
  const tDesc = at("deductions arrive");
  const tReg = at("pay record");
  const tHeno = at("for hay");
  const tComida = at("for food");
  const tBotas = at("for boots");
  const tSat = at("Saturnalia");
  const tEnt = at("burial club");
  const tFun = at("your own funeral");
  const tPapel = at("saves you the paperwork");
  const cam = camara(t, [
    [t0, -120, -60, 200],
    [t300 + 0.3, -60, -80, 380],
    [tDec + 0.5, -40, -70, 420],
    [tReg + 0.5, 140, -110, 300],
    [tSat, 180, -120, 330],
    [tFun + 0.6, 60, -80, 380],
    [tPapel + 2.4, 0, -60, 260],
  ], 6);
  const tu: Actor = {
    look: LEGIO,
    ruta: [[0, -480]],
    poses: [[0, QUIETO], [t300, con(QUIETO, { brazo: [60, -4], ante: [90, 4] }), 0.4], [tDec + 0.2, MANOS_CADERA, 0.4], [tDesc + 0.3, con(QUIETO, { brazo: [70, 60], ante: [100, 90] }), 0.3], [tFun, TRISTE, 0.5], [tPapel + 0.4, con(TRISTE, { cabeza: 30 }), 0.5]],
    cara: (tt) => ({ sonrisa: tt > t300 + 0.3 && tt < tDesc ? 0.7 : 0.05, boca: tt > tDesc && tt < tDesc + 1 ? 0.9 : 0.12 }),
    seed: 6,
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#2a1a0c" }}>
      <Lam D={1400} cam={cam} fotos={[fondo("egipto", 0.8)]} />
      <PisoCapas cam={cam} piso={PISOS.arena} />
      <Lam D={1000} cam={cam} sombra>
        <Monedas x={-330} y={SUELO - 6} t={t} pilas={6} sale={[tHeno, tComida, tBotas, tSat, tEnt, tPapel + 0.3]} aparece={t300 + 0.1} />
        <Act t={t} a={tu} />
      </Lam>
      <Lam D={880} cam={cam}>
        <Cartel x={-560} y={-340} texto="DOMITIAN" sub="EMPEROR · AD 81–96" t={t} t0={tDom} t1={t300 + 0.2} fs={70} />
        <Numero x={-150} y={-280} t={t} t0={t300} t1={tReg} a={0} b={300} dur={1.2} suf=" DENARII" fs={110} />
        <Papiro
          x={420}
          y={-200}
          w={560}
          t={t}
          t0={tReg - 0.3}
          titulo="PAY RECORD · EGYPT"
          fs={38}
          lineas={[
            { txt: "– hay", t: tHeno, rojo: true },
            { txt: "– food", t: tComida, rojo: true },
            { txt: "– boots and straps", t: tBotas, rojo: true },
            { txt: "– Saturnalia dinner", t: tSat, rojo: true },
            { txt: "– burial club", t: tEnt, rojo: true },
          ]}
        />
        <Cartel x={420} y={-500} texto="FUNERAL: PREPAID" t={t} t0={tFun + 0.2} color="#f3e6cf" fondoC="#2a2420" fs={62} />
      </Lam>
      <Linterna x={lerp(-160, 120, suave(t, tReg, tReg + 0.8))} y={0} r={820} osc={lerp(0.36, 0.55, suave(t, tFun, tPapel + 1))} />
    </AbsoluteFill>
  );
};

export const _t1 = { F, clamp, LEE, SEÑALA, ABRAZO };
