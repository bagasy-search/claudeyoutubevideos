import React from "react";
import { clamp } from "../soot/lib";
import { C, Chip, Particulas, fontFamily } from "./kit";
import { Persona, CIVIL } from "./persona";
import { SUELO, Llave, G, interp, TextoMundo, Saco } from "./mundo";
import { Franz, Gente, CartelTrampa, Sello, Titulo, Cuenta, vig } from "./actores";

// P4 · Trampa 4 "Your address" (375,3-445,8 s). Bajamos del cielo al borde del pueblo: la muralla, la choza del
// verdugo, el desolladero y la basura → látigo a Núremberg 1578: la casa SOBRE el puente, ni de una orilla ni de la
// otra → amanece: los dos lados del pueblo se despiertan y nadie mira para arriba → "en la ciudad, no DE la ciudad".
const CHOZA = 10470, BASURA = 10350, CASA = 6620;

export const P4K: Llave[] = [
  [375.8, 10300, 560, 0.8, 1.3],
  [379.45, 9900, 560, 0.9, 0.7],
  [383.85, 10400, 600, 1.15, 0.6],
  [387.45, 10880, 640, 1.35, 0.7],
  [389.1, 10500, 560, 0.72, 0.8],
  [394.3, CASA, 400, 0.42, 1.0, 0.25],
  [398.95, 6000, 600, 1.0, 1.0],
  [402.2, CASA, 450, 0.5, 1.0],
  [406.0, 5750, 600, 0.9, 0.6],
  [407.3, 7480, 600, 0.9, 0.6],
  [408.55, CASA, 560, 1.15, 0.5],
  [409.5, CASA, 420, 0.45, 0.9],
  [412.0, CASA, 560, 1.15, 0.8],
  [415.0, CASA, 600, 1.4, 0.6],
  [418.1, CASA, 600, 1.0, 0.6],
  [421.3, CASA + 30, 600, 1.7, 0.7],
  [425.4, 5200, 600, 1.0, 0.9],
  [428.0, 7820, 300, 1.05, 1.0],
  [429.85, CASA, 450, 0.55, 0.9],
  [433.0, CASA, 450, 0.6, 2.2],
  [434.2, CASA + 20, 600, 1.9, 0.7],
  [435.45, CASA, 400, 0.38, 1.0],
  [441.9, CASA, 580, 1.4, 0.9],
];
export const P4H: [number, number][] = [[375.3, 0], [420.9, 0], [421.8, 1.6], [423.6, 1.6], [425.3, 0], [445.8, 0]];

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>{children}</svg>;
const Mosca: React.FC<{ t: number; x: number; y: number; i: number }> = ({ t, x, y, i }) => <circle cx={x + Math.sin(t * (5 + i) + i) * 40} cy={y + Math.cos(t * (6 + i) + i * 2) * 26} r={6} fill="#1d1430" />;

export const P4Mundo: React.FC<{ t: number }> = ({ t }) => {
  const afuera = t < 394.5;
  const llega = interp(t, [397.5, 401.5], [5700, CASA]);
  const saluda = vig(t, 431.4, 435.4);
  return (
    <>
      {afuera && (
        <>
          {/* la choza del verdugo, pegada a la basura y al desolladero */}
          <G x={CHOZA} y={SUELO}>
            <rect x={-100} y={-200} width={200} height={200} fill="#b5946e" />
            <path d="M -125 -200 L 0 -290 L 125 -200 Z" fill="#6a4a3a" />
            <rect x={-30} y={-120} width={60} height={120} rx={6} fill="#4a2810" />
            <rect x={44} y={-170} width={40} height={40} fill="#3b2614" />
          </G>
          <Franz x={CHOZA + 10} y={SUELO - 10} t={t} expr="triste" mira={-1} />
          {/* basura */}
          <Svg>
            <path d={`M ${BASURA - 90} ${SUELO} Q ${BASURA - 60} ${SUELO - 120} ${BASURA} ${SUELO - 130} Q ${BASURA + 70} ${SUELO - 110} ${BASURA + 90} ${SUELO} Z`} fill="#6a5a3a" />
            <rect x={BASURA - 40} y={SUELO - 150} width={40} height={30} rx={6} fill="#8a7a5a" transform={`rotate(-20 ${BASURA} ${SUELO})`} />
            <circle cx={BASURA + 40} cy={SUELO - 90} r={18} fill="#9a8a4a" />
            {[0, 1, 2, 3].map((i) => <Mosca key={i} t={t} x={BASURA} y={SUELO - 190} i={i} />)}
          </Svg>
          {/* el desollador con su carro (la vaca vieja, dormida, con moscas) */}
          {t > 386.5 && (
            <>
              <Persona x={10980} y={SUELO - 10} h={290} t={t} seed={601} ropa={{ tunica: "#6a6050", tunica2: "#4a4236", cinto: "#2b2016", piel: "#e0a882", piel2: "#c08a66", pelo: "#3a3026" }} gorro="capucha" flip expr="neutro" bD={60} cD={40} />
              <G x={11180} y={SUELO - 120}>
                <ellipse cx={0} cy={-30} rx={110} ry={46} fill="#f6efe6" />
                <circle cx={-40} cy={-40} r={16} fill="#3a3026" /><circle cx={30} cy={-24} r={20} fill="#3a3026" />
                <ellipse cx={-120} cy={-46} rx={40} ry={30} fill="#f6efe6" />
                <path d="M -136 -52 l 10 10 M -126 -52 l -10 10" stroke="#2b1c14" strokeWidth={5} />
                <ellipse cx={-150} cy={-36} rx={14} ry={10} fill="#f2b8b0" />
              </G>
              <Svg>{[0, 1, 2].map((i) => <Mosca key={i} t={t} x={11160} y={SUELO - 230} i={i} />)}</Svg>
            </>
          )}
          {vig(t, 389.1, 394.3) && (
            <>
              <TextoMundo x={9900} y={SUELO - 640} text="THE WALL" size={70} color="#fff3d6" borde="#2b1c14" />
              <TextoMundo x={CHOZA} y={SUELO - 360} text="YOU" size={90} color={C.rojo} borde="#fff" />
              <TextoMundo x={BASURA - 30} y={SUELO - 260} text="RUBBISH" size={56} color="#fff3d6" borde="#2b1c14" />
              <TextoMundo x={11000} y={SUELO - 440} text="DEAD ANIMALS" size={56} color="#fff3d6" borde="#2b1c14" />
            </>
          )}
        </>
      )}
      {/* ── Núremberg: Franz llega con su atado y se instala en la casa del puente */}
      {t > 394 && (
        <>
          {t > 397.4 && <Franz x={t < 401.5 ? llega : CASA} y={SUELO - 10} t={t} camina={vig(t, 397.5, 401.5) ? 1.4 : 0} flip={t > 421 && t < 435.4}
            expr={vig(t, 412, 418.1) ? "feliz" : saluda ? "feliz" : t > 435.4 ? "triste" : "neutro"}
            bD={saluda ? 150 + Math.sin(t * 9) * 18 : vig(t, 397.5, 401.5) ? 140 : 8} cD={saluda ? 30 : 60}
            manoD={vig(t, 397.5, 401.5) ? <g><line x1={0} y1={0} x2={60} y2={-80} stroke="#6b3a1f" strokeWidth={8} /><circle cx={70} cy={-96} r={34} fill="#c9a36a" /></g> : undefined} />}
          {/* orillas: "this bank / that bank / the middle" */}
          {vig(t, 405.9, 411.9) && (
            <>
              <Svg>
                <path d={`M 5700 ${SUELO - 300} l 0 -120`} stroke="#fff" strokeWidth={12} />
                <path d={`M 7500 ${SUELO - 300} l 0 -120`} stroke="#fff" strokeWidth={12} />
                {t > 408.5 && <path d={`M ${CASA} ${SUELO - 760} l 0 -100 M ${CASA - 30} ${SUELO - 790} l 30 30 l 30 -30`} stroke={C.ambar} strokeWidth={14} fill="none" />}
              </Svg>
              <TextoMundo x={5700} y={SUELO - 440} text="THIS BANK ✗" size={70} color="#fff3d6" borde="#2b1c14" />
              {t > 407.2 && <TextoMundo x={7500} y={SUELO - 440} text="THAT BANK ✗" size={70} color="#fff3d6" borde="#2b1c14" />}
              {t > 408.5 && <TextoMundo x={CASA} y={SUELO - 880} text="THE MIDDLE ✓" size={110} color={C.ambar} borde="#2b1c14" />}
            </>
          )}
          {vig(t, 412, 418) && <div style={{ position: "absolute", left: CASA - 960, top: SUELO - 900 }}><Particulas t={t} tipo="destellos" n={22} seed={14} /></div>}
          {/* turistas de hoy sacando fotos */}
          {vig(t, 418.0, 421.3) && [6140, 7120].map((tx, i) => (
            <React.Fragment key={tx}>
              <Persona x={tx} y={SUELO - 30} h={260} t={t} seed={610 + i} ropa={{ tunica: i ? "#f27a3d" : "#3ab5a5", tunica2: i ? "#c25a2a" : "#2a857a", cinto: "#2b2140", piel: "#f2c09a", piel2: "#d99872", pelo: "#5a3a2a" }} flip={i === 1} bD={120} cD={70}
                manoD={<g><rect x={-30} y={-40} width={60} height={42} rx={8} fill="#2b2140" /><circle cx={0} cy={-19} r={12} fill="#8ad0ff" /></g>} />
              {Math.sin((t - 418) * 9 + i * 2) > 0.85 && <Svg><circle cx={tx + (i ? -60 : 60)} cy={SUELO - 190} r={60} fill="#fff" opacity={0.8} /></Svg>}
            </React.Fragment>
          ))}
          {/* amanece: los comerciantes abren en una orilla… */}
          {vig(t, 423, 436) && (
            <>
              <Gente t={t} x0={4900} x1={5400} n={3} seed={81} habla expr="feliz" mira={-1} />
              {[4600, 4700].map((sx, i) => <Saco key={sx} x={sx} y={SUELO - 118} s={interp(t, [425.4 + i * 0.4, 425.8 + i * 0.4], [0, 0.55])} color="#e8c890" />)}
            </>
          )}
          {/* …y las campanas suenan en la otra */}
          {vig(t, 426.5, 436) && (
            <>
              <G x={7865} y={SUELO - 770}>
                <rect x={-70} y={-170} width={140} height={170} fill="#d9c9ae" stroke="#8a7660" strokeWidth={8} />
                <path d="M -90 -170 L 0 -260 L 90 -170 Z" fill="#5a6a8a" />
                <g transform={`rotate(${Math.sin(t * 5) * 22} 0 -150)`}><path d="M -40 -40 Q -46 -120 0 -124 Q 46 -120 40 -40 Z" fill={C.oro} /><circle cx={0} cy={-30} r={12} fill="#8a5414" /></g>
              </G>
              {Math.sin(t * 5) > 0.6 && <TextoMundo x={7865 + 160} y={SUELO - 900} text="DONG" size={70} color={C.ambar} borde="#2b1c14" />}
            </>
          )}
          {/* todos pasan por el puente sin mirar para arriba */}
          {vig(t, 429.6, 436) && [0, 1, 2, 3].map((i) => {
            const t0 = 429.7 + i * 0.6;
            const va = i % 2 === 0;
            const xx = va ? interp(t, [t0, t0 + 5], [5650, 6180]) : interp(t, [t0, t0 + 5], [7550, 7080]);
            return <Persona key={i} x={xx} y={SUELO - 20} h={260} t={t} seed={620 + i} ropa={CIVIL(40 + i)} gorro={i === 1 ? "toca" : i === 2 ? "campesino" : undefined} flip={!va} camina={1.5} miraY={1} expr="neutro" />;
          })}
          {vig(t, 435.4, 441.9) && (
            <>
              <TextoMundo x={CASA} y={SUELO - 1000} text={t < 440.5 ? "IN THE CITY ✓" : "OF THE CITY ✗"} size={380} color={t < 440.5 ? C.lima : C.rojo} borde="#2b1c14" />
            </>
          )}
        </>
      )}
    </>
  );
};

export const P4Pant: React.FC<{ t: number }> = ({ t }) => (
  <>
    <CartelTrampa t={t} t0={375.35} t1={377.7} n={4} titulo="YOUR ADDRESS" />
    <Chip t={t} t0={377.9} t1={382.2} text="THE VERY EDGE OF TOWN" color={C.violeta} x={960} y={150} centro size={58} />
    <Chip t={t} t0={382.3} t1={383.8} text="CLOSE TO THE WALL" color={C.noche} x={960} y={150} centro size={60} />
    <Chip t={t} t0={383.85} t1={387.4} text="SOMETIMES OUTSIDE IT" color={C.rojo} x={960} y={150} centro size={60} />
    <Chip t={t} t0={387.45} t1={389.0} text="NEXT DOOR: THE KNACKER" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={58} />
    {vig(t, 389.1, 394.2) && (
      <div style={{ position: "absolute", left: 960, top: 980, transform: `translate(-50%,-50%) scale(${clamp((t - 389.1) / 0.3, 0, 1)})`, background: "#fbecc8", border: "8px solid #7a3d14", borderRadius: 18, padding: "14px 40px", fontFamily, fontWeight: 700, fontSize: 52, color: "#5a2a10", whiteSpace: "nowrap", boxShadow: "0 10px 0 rgba(20,10,50,.35)" }}>
        FILED UNDER: <span style={{ color: C.rojo }}>BETWEEN THE WALLS & THE RUBBISH</span>
      </div>
    )}
    <Titulo t={t} t0={394.4} t1={398.8} text="NUREMBERG · 1578" y={200} size={120} color={C.crema} />
    <Chip t={t} t0={399.0} t1={402.1} text="ALMOST POETIC" color={C.violeta} x={960} y={150} centro size={62} />
    <Chip t={t} t0={402.25} t1={405.9} text="A HOUSE ON A BRIDGE · OVER THE RIVER" color={C.teal} tinta={C.noche} x={960} y={150} centro size={54} />
    <Titulo t={t} t0={409.55} t1={411.9} text="NEITHER SIDE OF TOWN" y={200} size={100} color={C.ambar} />
    <Chip t={t} t0={412.0} t1={414.9} text="...AND HONESTLY? BEAUTIFUL" color={C.lima} tinta={C.noche} x={960} y={150} centro size={60} />
    <Cuenta t={t} t0={415.0} t1={418.0} de={0} a={40} dur={1.6} x={960} y={220} size={150} suf=" YEARS · RENT-FREE" color={C.ambar} />
    <Chip t={t} t0={418.1} t1={421.2} text="★ IT STILL STANDS · YOU CAN VISIT ★" color={C.teal} tinta={C.noche} x={960} y={150} centro size={56} />
    <Chip t={t} t0={421.3} t1={425.3} text="FROM YOUR WINDOW..." color={C.violeta} x={960} y={150} centro size={60} />
    <Chip t={t} t0={425.4} t1={427.9} text="ONE BANK: MERCHANTS OPEN" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={58} />
    <Chip t={t} t0={428.0} t1={429.8} text="THE OTHER: CHURCH BELLS" color={C.teal} tinta={C.noche} x={960} y={150} centro size={58} />
    <Chip t={t} t0={431.4} t1={435.3} text="NOBODY EVER LOOKS UP" color={C.rojo} x={960} y={150} centro size={64} />
    <Chip t={t} t0={435.5} t1={439.1} text="WHAT THE HOUSE SAYS EVERY MORNING:" color={C.violeta} x={960} y={150} centro size={52} />
    <Sello t={t} t0={441.95} t1={445.7} text="YOUR FAMILY'S FUTURE?" x={960} y={300} size={80} color={C.violeta} rot={-4} />
  </>
);
