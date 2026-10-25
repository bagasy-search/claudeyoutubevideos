import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Escena, Particulas, Emote } from "./kit";
import { Lapida } from "./kit2";
import { Mundo, camEn, Key, PastoAlto, SAJON, SENOR, VIK, barbaDe, gy } from "./mundo";
import { G, Ch, Cartel, Cuenta, Sello, Flash, LanzaMano, MapaN } from "./comun";
import { PlanoRepton, Cita } from "./escenas";
import { Corona, Tienda, Empalizada, Iglesia, Cruz } from "./vik";

// 186,8-295,1 s · TRAMPA 2: LA ZANJA. Bajás gateando la loma con 200 hombres, el suelo se hunde, el D de Repton desde
// arriba, la iglesia convertida en portón, el corte de la zanja con el barro y el vikingo a la altura justa, y Reading 870.
export const CAM2: Key[] = [
  [186.78, 3600, 520, 0.6], [189.02, 1900, 520, 1.0], [194.12, 2350, 600, 1.35], [196.16, 3150, 760, 1.6], [199.22, 3470, 940, 2.3],
  [208.64, 3700, 720, 1.25], [212.9, 3820, 660, 1.1], [215.22, 4080, 560, 1.6], [219.4, 4060, 590, 1.45], [222.48, 3950, 600, 1.0],
  [231.09, 3480, 880, 1.9], [238.4, 3520, 900, 2.15], [242.0, 3660, 700, 1.45], [247.68, 3620, 740, 1.35],
  [289.19, 3000, 700, 0.8], [292.0, 3480, 880, 1.55], [295.06, 3560, 880, 1.8],
];

// los que bajan gateando con vos (coordenadas de mundo)
const Gatean: React.FC<{ t: number }> = ({ t }) => {
  const u = prog(t, 189.4, 199.0);
  return (
    <>
      {Array.from({ length: 14 }, (_, i) => {
        const x = 1250 + (i % 7) * 70 - Math.floor(i / 7) * 160 + u * 1650 - (i % 3) * 30;
        return <Persona key={i} x={x} y={gy(x) + 26} h={180} t={t} seed={300 + i} ropa={i % 4 === 0 ? SENOR : SAJON} expr="miedo" inclina={38} camina={0.5} opacity={0.88} />;
      })}
      {(() => { const x = 1700 + u * 1720; return <Persona x={x} y={gy(x) + 30} h={250} t={t} seed={3} ropa={SAJON} expr={t > 196.2 ? "sorpresa" : "miedo"} inclina={t > 196.2 ? 10 : 36} camina={t < 196.2 ? 0.6 : 0} manoD={<LanzaMano a={60} inclina={-30} largo={420} />} />; })()}
    </>
  );
};

const Yo: React.FC<{ t: number; x: number; y: number; expr?: "miedo" | "sorpresa" | "triste" | "enojado" | "neutro" }> = ({ t, x, y, expr = "miedo" }) => (
  <Persona x={x} y={y} h={260} t={t} seed={3} ropa={SAJON} expr={expr} bD={30} cD={20} manoD={<LanzaMano a={50} inclina={-14} largo={420} />} />
);

// el barro: llena el fondo de la zanja por debajo de y=975, siguiendo las paredes
const XB = (() => { let a = 3350, b = 3650; for (let x = 3350; x < 3650; x++) if (gy(x) >= 975) { a = x; break; } for (let x = 3650; x > 3350; x--) if (gy(x) >= 975) { b = x; break; } return [a, b]; })();
const BARRO = Array.from({ length: 31 }, (_, i) => { const x = XB[1] - (i / 30) * (XB[1] - XB[0]); return `L ${x.toFixed(0)} ${(gy(x) + 4).toFixed(0)} `; }).join("");

export const P2: React.FC<{ t: number }> = ({ t }) => {
  const cam = camEn(t, CAM2);
  // en la zanja: te deslizás hasta el fondo y el barro te llega a las rodillas
  const xz = interpolate(t, [233.4, 235.6], [3370, 3480], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const yz = gy(xz) + 10;
  const sube = prog(t, 238.4, 240.4);
  return (
    <AbsoluteFill>
      {/* 0 · TRAMPA 2 · la señal: bajás gateando con 200 hombres */}
      <Escena t={t} t0={186.78} t1={199.22} zoom={0} entra="corte" golpes={[196.3]}>
        <Mundo t={t} cam={cam}>
          <Gatean t={t} />
          {/* el señor da la señal desde la loma */}
          <Persona x={1290} y={gy(1290) + 30} h={300} t={t} seed={4} ropa={SENOR} expr="enojado" bD={t > 189 && t < 191 ? 150 : 20} cD={20} />
        </Mundo>
        <Cartel t={t} t0={186.8} t1={189.0} n={2} nombre="THE DITCH" />
        <Ch t={t} t0={189.4} t1={194.0} text="THE SIGNAL" color={C.violeta} x={120} y={140} size={60} />
        <Ch t={t} t0={190.6} t1={194.0} text="SLOWLY · QUIETLY" color={C.teal} tinta={C.noche} x={120} y={250} size={52} />
        <Cuenta t={t} t0={194.2} t1={196.1} de={0} a={200} dur={0.9} x={960} y={210} size={180} sufijo=" MEN" />
        <Ch t={t} t0={194.9} t1={196.1} text="TRYING NOT TO COUGH 🤫" color={C.ambar} tinta={C.noche} x={960} y={340} centro size={50} />
        <G t={t} t0={196.3} text="THE GROUND DROPS AWAY" y={220} size={100} color={C.crema} />
        <Flash t={t} t0={196.3} dur={0.18} />
      </Escena>
      {/* 1 · lo que encontraron los arqueólogos: un D gigante con las puntas en el río */}
      <Escena t={t} t0={199.22} t1={208.64} entra="iris" ix={960} iy={760} golpes={[203.6, 206.2]}>
        <PlanoRepton t={t} zanja={203.6} iglesia={206.4} />
        <Ch t={t} t0={199.5} text="REPTON · ARCHAEOLOGISTS FOUND IT" color={C.violeta} x={120} y={130} size={52} />
        <G t={t} t0={203.6} text="A GIANT “D”" x={1380} y={300} size={110} color={C.ambar} />
        <Ch t={t} t0={205.4} text="BOTH ENDS → INTO THE RIVER" color={C.teal} tinta={C.noche} x={1420} y={450} centro size={50} />
      </Escena>
      {/* 2 · detrás, el terraplén con la empalizada · y la iglesia, que no tiraron: la hicieron portón */}
      <Escena t={t} t0={208.64} t1={222.48} zoom={0} entra="zoom" golpes={[217.7, 219.5]}>
        <Mundo t={t} cam={cam}>
          {t > 208.8 && t < 213 && (
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
              <path d={`M 3650 860 L 3720 770 L 3840 770 L 3920 860`} fill="none" stroke={C.ambar} strokeWidth={14} strokeDasharray="30 14" opacity={ent(t, 208.9)} />
            </svg>
          )}
          {t > 217.6 && (
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
              <rect x={3700} y={540} width={560} height={240} rx={30} fill="none" stroke={C.rojo} strokeWidth={14} opacity={ent(t, 217.7)} />
            </svg>
          )}
        </Mundo>
        <Ch t={t} t0={208.9} t1={212.9} text="A BANK OF EARTH" color={C.ambar} tinta={C.noche} x={120} y={140} size={58} />
        <Ch t={t} t0={210.6} t1={212.9} text="+ A WOODEN FENCE" color={C.violeta} x={120} y={250} size={54} />
        <Ch t={t} t0={213.0} t1={215.2} text="NOW THE WORRYING PART…" color={C.rojo} x={960} y={130} centro size={58} />
        <Ch t={t} t0={215.3} t1={217.6} text="THE OLD STONE CHURCH? NOT KNOCKED DOWN" color={C.teal} tinta={C.noche} x={960} y={130} centro size={52} />
        <G t={t} t0={217.7} t1={219.4} text="PART OF THE WALL" y={180} size={110} color={C.crema} />
        <Sello t={t} t0={219.5} text="VIKING GATEHOUSE" x={960} y={200} size={86} rot={-5} />
        <Ch t={t} t0={220.2} text="A MERCIAN SAINT'S CHURCH ✝" color={C.violeta} x={960} y={330} centro size={46} />
      </Escena>
      {/* 3 · no atacás un montón de carpas: atacás un fuerte, hecho en semanas, por gente que ya lo hizo */}
      <Escena t={t} t0={222.48} t1={231.09} entra="diag" golpes={[223.6, 225.6, 228.0]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%, #33227a, #120e36 80%)" }} />
        {t < 225.5 && [600, 960, 1320].map((x, i) => <Tienda key={i} x={x} y={640} s={0.62} k={i} t={t} t0={222.6 + i * 0.15} />)}
        {t > 223.6 && t < 225.5 && (
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            <path d="M 420 360 L 1500 860 M 1500 360 L 420 860" stroke={C.rojo} strokeWidth={34} strokeLinecap="round" pathLength={1} style={{ strokeDasharray: `${prog(t, 223.6, 224.0)} 1` }} />
          </svg>
        )}
        {t < 225.5 && <Ch t={t} t0={222.6} text="A PILE OF TENTS?" color={C.violeta} x={960} y={140} centro size={64} />}
        {t > 225.5 && (
          <div style={{ position: "absolute", left: 960, top: 640, transform: `translate(-50%,-50%) scale(${ent(t, 225.5)})` }}>
            <svg width={1300} height={460} viewBox="-650 -300 1300 460">
              <path d="M -650 140 L -560 -40 L 560 -40 L 650 140 Z" fill="#5e4a36" stroke="#2a1530" strokeWidth={8} />
              {Array.from({ length: 26 }, (_, i) => <path key={i} d={`M ${-540 + i * 42} -40 L ${-540 + i * 42} -190 L ${-524 + i * 42} -214 L ${-508 + i * 42} -190 L ${-508 + i * 42} -40 Z`} fill={i % 2 ? "#a8794a" : "#946a3e"} stroke="#2a1530" strokeWidth={5} />)}
              <rect x={-90} y={-260} width={180} height={220} fill="#9a9aa8" stroke="#2a1530" strokeWidth={8} />
              <path d="M -110 -260 L 0 -330 L 110 -260 Z" fill="#6a6a7a" stroke="#2a1530" strokeWidth={8} />
              <path d="M -40 -40 L -40 -130 Q 0 -170 40 -130 L 40 -40 Z" fill="#2a1530" />
            </svg>
          </div>
        )}
        <G t={t} t0={225.6} text="A FORT" y={200} size={170} color={C.crema} />
        <Ch t={t} t0={227.0} text="BUILT IN A FEW WEEKS" color={C.ambar} tinta={C.noche} x={960} y={340} centro size={54} />
        {["THANET", "SHEPPEY", "READING", "TORKSEY"].map((n, i) => (
          <Ch key={n} t={t} t0={228.0 + i * 0.5} text={`${n} ✓`} color={C.teal} tinta={C.noche} x={250 + i * 470} y={990} centro size={44} />
        ))}
        <Ch t={t} t0={229.4} text="DONE IT MANY TIMES" color={C.rojo} x={960} y={880} centro size={50} />
      </Escena>
      {/* 4 · cruzar la zanja de noche: barro a las rodillas, la pared resbala, el que sale queda recortado contra el cielo */}
      <Escena t={t} t0={231.09} t1={247.68} zoom={0} entra="corte" golpes={[233.5, 238.5, 242.0]}>
        <Mundo t={t} cam={cam}>
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
            {/* estacas en el fondo que no ves */}
            {t > 245.5 && [3420, 3500, 3580].map((x, i) => <path key={i} d={`M ${x - 14} 1032 L ${x} ${980 - (i % 2) * 14} L ${x + 14} 1032 Z`} fill="#5e3a1e" stroke="#2a1530" strokeWidth={4} opacity={ent(t, 245.5 + i * 0.12) * 0.85} />)}
          </svg>
          <Yo t={t} x={xz} y={yz + (t > 235.8 ? 6 : 0)} expr={t > 238 ? "sorpresa" : "miedo"} />
          {/* el barro, encima de las piernas */}
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
            <path d={`M ${XB[0]} 975 Q 3500 ${966 + Math.sin(t * 2) * 4} ${XB[1]} 975 ${BARRO}Z`} fill="#4a3220" opacity={0.96} />
            {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={3400 + i * 40} cy={984 + (i % 2) * 10} rx={10} ry={4} fill="#6a4a2e" />)}
          </svg>
          {/* el que sale, recortado contra el cielo */}
          {t > 238.4 && (
            <>
              <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
                <ellipse cx={3680} cy={700} rx={180} ry={140} fill="#6a5ac8" opacity={0.35 * ent(t, 238.6)} />
              </svg>
              <Persona x={3600 + sube * 70} y={940 - sube * 150} h={240} t={t} seed={312} ropa={SAJON} sombra="#06051a" inclina={30 - sube * 20} bI={140} bD={150} />
            </>
          )}
          {/* el vikingo en el terraplén, lanza a la altura justa */}
          <Persona x={3800} y={772} h={300} t={t} seed={205} ropa={VIK(5)} casco="vikingo" barba={barbaDe(5)} expr="enojado" flip aparece={238.9} manoD={<LanzaMano a={90} inclina={-82} largo={520} />} />
        </Mundo>
        <Ch t={t} t0={231.3} t1={233.4} text="NOW CROSS IT. AT NIGHT." color={C.violeta} x={960} y={130} centro size={60} />
        <Ch t={t} t0={233.6} t1={238.3} text="MUD UP TO YOUR KNEES" color={C.ambar} tinta={C.noche} x={120} y={140} size={56} />
        <Ch t={t} t0={235.9} t1={238.3} text="STEEP · SLIPPERY" color={C.teal} tinta={C.noche} x={120} y={250} size={52} />
        <Ch t={t} t0={238.6} t1={247.6} text="LIT UP AGAINST THE SKY" color={C.rojo} x={120} y={140} size={56} />
        <Ch t={t} t0={242.2} t1={247.6} text="EXACTLY SPEAR HEIGHT" color={C.ambar} tinta={C.noche} x={120} y={250} size={52} />
        <Emote t={t} t0={245.4} tipo="preg" x={760} y={760} s={1.4} />
        <Ch t={t} t0={245.6} text="AND THE BOTTOM? YOU CAN'T SEE IT" color={C.violeta} x={960} y={1000} centro size={46} />
      </Escena>
      {/* 5 · preguntale a los de Wessex: Reading, invierno del 870, entre dos ríos */}
      <Escena t={t} t0={247.68} t1={254.6} zoom={0} entra="zoom">
        <MapaN t={t} cam={[[247.68, 690, 720, 1.8], [250.6, 700, 767, 3.2], [254.6, 700, 767, 3.8]]} desde="NORWAY"
          pulsa={[{ n: "READING", t0: 251.0, color: C.rojo, label: "READING", lado: "der" }]} />
        <Ch t={t} t0={247.9} text="ASK THE MEN OF WESSEX" color={C.ambar} tinta={C.noche} x={120} y={140} size={60} />
        <G t={t} t0={251.5} text="WINTER 870" y={260} size={150} color={C.crema} />
        <Ch t={t} t0={253.0} text="THE SAME KIND OF CAMP" color={C.violeta} x={960} y={400} centro size={52} />
      </Escena>
      <Escena t={t} t0={254.6} t1={259.69} entra="iris" ix={960} iy={540} golpes={[256.0, 257.2]}>
        <AbsoluteFill style={{ background: "#3a6a3e" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 211) % 1920} cy={(i * 137) % 1080} r={30} fill="#336036" />)}
          <path d="M -50 300 Q 600 360 1050 620 Q 1400 820 1980 840" stroke="#3a7ac8" strokeWidth={90} fill="none" pathLength={1} style={{ strokeDasharray: `${prog(t, 254.8, 255.8)} 1` }} />
          <path d="M 300 1130 Q 700 900 1050 620" stroke="#4a8ad8" strokeWidth={70} fill="none" pathLength={1} style={{ strokeDasharray: `${prog(t, 255.6, 256.6)} 1` }} />
          {t > 257.2 && <path d="M 470 410 Q 560 760 760 900" stroke="#7a5a3a" strokeWidth={34} fill="none" strokeLinecap="round" pathLength={1} style={{ strokeDasharray: `${prog(t, 257.2, 258.0)} 1` }} />}
        </svg>
        {t > 257.6 && [[760, 600], [860, 700], [700, 720]].map(([x, y], i) => <Tienda key={i} x={x} y={y} s={0.32} k={i} t={t} t0={257.7 + i * 0.12} />)}
        <Ch t={t} t0={256.0} text="THAMES" color={C.teal} tinta={C.noche} x={1500} y={700} centro size={52} />
        <Ch t={t} t0={256.8} text="KENNET" color={C.teal} tinta={C.noche} x={400} y={980} centro size={52} />
        <Ch t={t} t0={257.4} text="A BANK OF EARTH BETWEEN TWO RIVERS" color={C.ambar} tinta={C.noche} x={960} y={110} centro size={54} />
      </Escena>
      {/* 6 · Æthelwulf caza un grupo vikingo en campo abierto y gana · todos festejan */}
      <Escena t={t} t0={259.69} t1={268.44} entra="barrido" banda={C.lima} golpes={[263.4, 267.0]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #8ad0f0, #d8f0f8 60%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 760 Q 960 700 1920 760 L 1920 1080 L 0 1080 Z" fill="#6aaa4a" /><path d="M 0 840 Q 960 790 1920 840 L 1920 1080 L 0 1080 Z" fill="#5a9a3e" /></svg>
        {Array.from({ length: 7 }, (_, i) => {
          const x = interpolate(t, [260, 263.4], [200 + i * 90, 700 + i * 90], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <Persona key={i} x={x} y={900 + (i % 2) * 40} h={i === 0 ? 300 : 240} t={t} seed={330 + i} ropa={i === 0 ? SENOR : SAJON} casco="saxon" expr={t > 266.9 ? "feliz" : "enojado"} camina={t < 263.4 ? 1.8 : 0} salta={t > 266.9 ? 1 : 0} bD={30} cD={20} manoD={<LanzaMano a={50} inclina={-14} largo={360} />} />;
        })}
        {Array.from({ length: 5 }, (_, i) => {
          const x = 1300 + i * 110 + Math.max(0, t - 262) * 220;
          return <Persona key={i} x={x} y={900 + (i % 2) * 30} h={230} t={t} seed={340 + i} ropa={VIK(i)} casco="vikingo" barba={barbaDe(i)} expr="miedo" flip camina={t > 262 ? 2 : 0} />;
        })}
        {t > 266.95 && <Particulas t={t} tipo="destellos" n={50} seed={8} />}
        <Ch t={t} t0={259.9} t1={266.9} text="A FEW DAYS LATER" color={C.violeta} x={120} y={130} size={56} />
        <Ch t={t} t0={260.6} t1={266.9} text="ÆTHELWULF · ENGLISH NOBLEMAN" color={C.ambar} tinta={C.noche} x={120} y={240} size={50} />
        <Ch t={t} t0={262.0} t1={266.9} text="VIKING RAIDERS · OPEN FIELDS" color={C.rojo} x={1200} y={130} size={48} />
        <Sello t={t} t0={263.4} t1={266.9} text="BEATEN!" x={1500} y={420} size={110} color={C.lima} rot={-8} />
        <G t={t} t0={267.0} text="EVERYONE CELEBRATED" y={300} size={110} color={C.crema} />
      </Escena>
      {/* 7 · el rey de Wessex y su hermano Alfredo marchan con todo el ejército a Reading */}
      <Escena t={t} t0={268.44} t1={275.81} entra="zoom" golpes={[271.0]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #f2b07a, #ffe0a8 60%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 800 Q 960 720 1920 800 L 1920 1080 L 0 1080 Z" fill="#7aa04a" /></svg>
        {Array.from({ length: 22 }, (_, i) => {
          const x = ((i * 120 + (t - 268.4) * 160) % 2400) - 300;
          return <Persona key={i} x={x} y={860 + (i % 3) * 22} h={170} t={t} seed={360 + i} ropa={SAJON} casco="saxon" camina={1.4} sombra="#5a4a3a" opacity={0.7} />;
        })}
        {[[760, 0], [1160, 1]].map(([x0, k]) => {
          const x = x0 + (t - 268.4) * 30;
          return (
            <React.Fragment key={k}>
              <Persona x={x} y={980} h={k ? 400 : 440} t={t} seed={370 + k} ropa={k ? { ...SENOR, tunica: "#c8a23a", tunica2: "#8a6a1a" } : { ...SENOR, tunica: "#a8283a", tunica2: "#6a1a2a" }} barba={k ? undefined : "#6b3a1f"} expr="enojado" camina={1.3} />
              <Corona x={x} y={980 - (k ? 400 : 440) * 1.02} s={k ? 0.42 : 0.5} t={t} t0={268.6 + k * 0.3} />
            </React.Fragment>
          );
        })}
        <Ch t={t} t0={268.7} text="THE KING OF WESSEX" color={C.rojo} x={560} y={180} centro size={56} />
        <Ch t={t} t0={269.6} text="+ HIS BROTHER ALFRED" color={C.ambar} tinta={C.noche} x={1360} y={180} centro size={56} />
        <G t={t} t0={271.0} text="THE WHOLE ARMY" y={340} size={110} color={C.crema} />
        <Ch t={t} t0={273.4} text="→ READING · FINISH THE JOB" color={C.violeta} x={960} y={470} centro size={50} />
      </Escena>
      {/* 8 · los vikingos salen por todas las puertas a la vez */}
      <Escena t={t} t0={275.81} t1={281.89} entra="corte" golpes={[275.9, 278.2]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #5a4a8a, #c87a6a 70%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 700 L 1920 700 L 1920 1080 L 0 1080 Z" fill="#4a6a3a" /><path d="M 0 700 L 1920 700 L 1920 560 L 0 560 Z" fill="#6a5038" /></svg>
        <div style={{ position: "absolute", left: 0, top: 0 }}><Empalizada x={0} y={560} n={42} h={190} /></div>
        {[380, 960, 1540].map((gx, g) => (
          <React.Fragment key={g}>
            <div style={{ position: "absolute", left: gx - 70, top: 400, width: 140, height: 170, background: "#1a0e14" }} />
            {Array.from({ length: 4 }, (_, i) => {
              const u = Math.max(0, t - 275.85 - i * 0.18);
              const x = gx + (i % 2 ? 1 : -1) * u * 120 * (1 + i * 0.2);
              const y = 580 + u * 260 + i * 6;
              return <Persona key={i} x={x} y={Math.min(1060, y)} h={160 + Math.min(220, u * 140)} t={t} seed={380 + g * 4 + i} ropa={VIK(g + i)} casco="vikingo" barba={barbaDe(g + i)} expr="enojado" camina={2.2} flip={i % 2 === 0} />;
            })}
          </React.Fragment>
        ))}
        <Flash t={t} t0={275.9} dur={0.2} />
        <G t={t} t0={276.0} t1={278.1} text="EVERY GATE AT ONCE" y={200} size={110} color={C.crema} />
        {t > 278.13 && <AbsoluteFill style={{ background: "rgba(20,10,30,.72)" }} />}
        {t > 278.13 && <Cita t={t} t0={278.2} texto="There was great slaughter on both sides." autor="ANGLO-SAXON CHRONICLE" y={540} size={64} />}
      </Escena>
      {/* 9 · Æthelwulf, el héroe de cuatro días antes, muerto · los vikingos «dueños del lugar de la matanza» */}
      <Escena t={t} t0={281.89} t1={289.19} entra="iris" ix={960} iy={600} golpes={[282.2, 285.0]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #4a3a7a, #120e36 80%)" }} />
        <Lapida x={620} y={640} s={1.15} t={t} t0={282.0} lineas={["ÆTHELWULF", "THE HERO", "OF THE WEEK"]} />
        <Cruz x={620} y={300} s={0.7} t={t} t0={282.4} />
        <Ch t={t} t0={282.2} text="KILLED" color={C.rojo} x={620} y={950} centro size={70} />
        <Cita t={t} t0={285.0} texto="…and the Vikings held the place of slaughter." autor="THE CHRONICLE" x={1340} y={520} w={900} size={56} />
      </Escena>
      {/* 10 · la zanja no está para frenarte: está para demorarte justo donde ellos quieren */}
      <Escena t={t} t0={289.19} t1={295.4} zoom={0} entra="barrido" golpes={[291.3, 293.0]}>
        <Mundo t={t} cam={cam}>
          {t > 291.3 && (
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
              {[0, 1, 2].map((i) => <circle key={i} cx={3500} cy={950} r={(60 + i * 70) * ent(t, 291.3 + i * 0.12)} fill="none" stroke={C.rojo} strokeWidth={12} opacity={0.9 - i * 0.2} />)}
              <circle cx={3500} cy={950} r={22} fill={C.rojo} />
            </svg>
          )}
        </Mundo>
        <Ch t={t} t0={289.4} text="NOT THERE TO STOP YOU" color={C.violeta} x={960} y={130} centro size={60} />
        <G t={t} t0={291.3} text="TO SLOW YOU DOWN" y={260} size={110} color={C.crema} />
        <Sello t={t} t0={293.0} text="RIGHT HERE" x={1350} y={560} size={80} rot={-8} />
      </Escena>
    </AbsoluteFill>
  );
};

void PastoAlto; void Iglesia; void Sello;
