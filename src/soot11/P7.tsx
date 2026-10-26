import React from "react";
import { clamp } from "../soot/lib";
import { C, Chip, Emote, Particulas, fontFamily } from "./kit";
import { Persona, CIVIL, Ropa } from "./persona";
import { SUELO, Llave, G, interp, TextoMundo } from "./mundo";
import { Franz, Gente, CartelTrampa, Sello, Titulo, BurbujaM, Pin, vig } from "./actores";

// P7 · Trampa 7 "The other jobs" (645,1-729,2 s). La lista de tareas que nadie quiere: el perro muerto en la calle,
// el caballo en la plaza (dibujos con ojos en X, sin nada feo), el desollador con su carro, perros, letrinas,
// mendigos, la casa del farol rojo (guiño) → todo tiene precio: el "menú" de la taberna donde no te dejan entrar →
// los negocios de costado: soga de la suerte para el jugador, ungüentos "no preguntes" → solitario, sucio, peligroso →
// las 7 trampas en el mapa → de noche, los mismos que no te dan la mano golpean la puerta de atrás.
const CASA = 6620, PERRO = 7960, CABALLO = 4800, PUESTO = 4520, FAROL = 8225, ATRAS = 7120;
const MERCADER: Ropa = { tunica: "#2a6a8a", tunica2: "#18485e", cinto: C.oro, piel: "#f0c09a", piel2: "#d09a76", pelo: "#5a3a20" };
const DESOLLADOR: Ropa = { tunica: "#6a6050", tunica2: "#4a4236", cinto: "#2b2016", piel: "#e0a882", piel2: "#c08a66", pelo: "#3a3026" };

export const P7K: Llave[] = [
  [646.0, CASA + 100, 560, 1.0, 0.8],
  [651.1, CASA + 100, 500, 0.75, 1.0],
  [654.7, PERRO, 640, 1.35, 1.0, 0.3],
  [657.5, CABALLO, 620, 1.2, 1.0, 0.35],
  [660.1, CABALLO + 150, 580, 0.95, 0.7],
  [663.4, CABALLO + 450, 600, 1.0, 1.6],
  [665.3, 5450, 600, 1.1, 0.8],
  [666.8, 5800, 600, 1.2, 0.7],
  [669.9, 6050, 560, 1.0, 0.8],
  [672.7, FAROL, 560, 1.15, 1.0, 0.25],
  [675.9, FAROL, 500, 1.6, 1.0],
  [678.8, CASA + 300, 580, 0.95, 1.0, 0.25],
  [682.3, CASA + 450, 620, 1.4, 0.8],
  [684.2, 3400, 560, 0.95, 1.0, 0.35],
  [690.7, 3500, 560, 1.05, 2.5],
  [694.1, PUESTO, 600, 1.15, 1.0, 0.3],
  [700.8, PUESTO + 100, 600, 1.55, 0.8],
  [704.9, PUESTO - 60, 600, 1.75, 0.8],
  [707.6, PUESTO - 60, 560, 2.3, 0.8],
  [711.5, PUESTO, 560, 0.9, 0.9],
  [715.0, 5800, 420, 0.5, 1.2],
  [718.6, 6000, 360, 0.16, 1.4],
  [721.2, 6000, 360, 0.16, 1.0],
  [723.3, 7300, 600, 1.2, 1.2],
  [726.3, ATRAS, 620, 1.35, 0.9],
  [728.0, ATRAS - 40, 600, 1.7, 0.7],
];
export const P7H: [number, number][] = [[645.1, 0], [646.6, 0.6], [721.0, 0.6], [722.2, 1], [725.6, 1], [726.4, 2], [729.3, 2]];

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>{children}</svg>;
const Mosca: React.FC<{ t: number; x: number; y: number; i: number }> = ({ t, x, y, i }) => <circle cx={x + Math.sin(t * (5 + i) + i) * 40} cy={y + Math.cos(t * (6 + i) + i * 2) * 26} r={6} fill="#1d1430" />;
const OjoX: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 9 }) => <path d={`M ${x - r} ${y - r} L ${x + r} ${y + r} M ${x + r} ${y - r} L ${x - r} ${y + r}`} stroke="#2b1c14" strokeWidth={5} strokeLinecap="round" />;
const Moneda: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 16 }) => <g><circle cx={x} cy={y} r={r} fill={C.oro} stroke="#8a5414" strokeWidth={4} /><circle cx={x} cy={y} r={r * 0.5} fill="none" stroke="#8a5414" strokeWidth={3} /></g>;

// perro de dibujo, panza arriba, ojos en X (gracioso, nada feo)
const PerroMuerto: React.FC<{ x: number; t: number; op?: number }> = ({ x, t, op = 1 }) => (
  <G x={x} y={SUELO - 6} op={op}>
    <ellipse cx={0} cy={-40} rx={80} ry={36} fill="#b98a5a" />
    {[-50, -20, 20, 50].map((lx) => <rect key={lx} x={lx - 7} y={-120} width={14} height={60} rx={7} fill="#b98a5a" />)}
    <circle cx={-96} cy={-48} r={36} fill="#b98a5a" />
    <ellipse cx={-110} cy={-80} rx={14} ry={24} fill="#8a5a3a" />
    <svg style={{ overflow: "visible" }}><OjoX x={-104} y={-52} r={8} /></svg>
    <path d="M 78 -46 q 30 -20 40 -50" stroke="#b98a5a" strokeWidth={12} fill="none" strokeLinecap="round" />
    <svg style={{ overflow: "visible" }}>{[0, 1, 2].map((i) => <Mosca key={i} t={t} x={0} y={-170} i={i} />)}</svg>
  </G>
);
// caballo muerto de costado, patas tiesas para arriba (lectura de dibujo animado), con crin, oreja, lengua y cola
const CaballoMuerto: React.FC<{ x: number; t: number }> = ({ x, t }) => {
  const L = "#4a2a18";
  const pata = (bx: number, ang: number, k: number) => (
    <g key={k} transform={`rotate(${ang} ${bx} -130)`}>
      <path d={`M ${bx - 20} -120 L ${bx - 16} -230 L ${bx + 16} -230 L ${bx + 20} -120 Z`} fill="#a8703f" stroke={L} strokeWidth={6} strokeLinejoin="round" />
      <path d={`M ${bx - 14} -232 L ${bx - 12} -320 L ${bx + 12} -320 L ${bx + 14} -232 Z`} fill="#9a6436" stroke={L} strokeWidth={6} strokeLinejoin="round" />
      <path d={`M ${bx - 18} -320 L ${bx - 20} -352 L ${bx + 20} -352 L ${bx + 18} -320 Z`} fill="#2b1c14" />
    </g>
  );
  return (
    <G x={x} y={SUELO - 6}>
      <ellipse cx={0} cy={4} rx={300} ry={22} fill="rgba(30,20,10,.28)" />
      {[pata(-120, -24, 0), pata(-70, -8, 1), pata(80, 10, 2), pata(130, 26, 3)]}
      {/* cola */}
      {[0, 1, 2].map((i) => <path key={i} d={`M 190 -80 q ${50 + i * 8} ${-10 + i * 14} ${70 + i * 6} ${50 + i * 8}`} stroke="#3a2414" strokeWidth={14} fill="none" strokeLinecap="round" />)}
      {/* cuerpo */}
      <ellipse cx={0} cy={-85} rx={200} ry={84} fill="#a8703f" stroke={L} strokeWidth={7} />
      <ellipse cx={10} cy={-60} rx={150} ry={40} fill="#c48a52" />
      {/* cuello y cabeza apoyada en el piso */}
      <path d="M -170 -120 Q -230 -120 -260 -80 L -360 -60 Q -400 -50 -400 -24 Q -398 2 -360 2 L -200 2 Q -170 -30 -150 -50 Z" fill="#a8703f" stroke={L} strokeWidth={7} strokeLinejoin="round" />
      <ellipse cx={-385} cy={-22} rx={20} ry={14} fill="#7a4c30" />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${-175 - i * 22} ${-122 + i * 9} l -18 -30 l 16 4 Z`} fill="#3a2414" />)}
      <path d="M -255 -86 L -246 -132 L -228 -92 Z" fill="#9a6436" stroke={L} strokeWidth={5} strokeLinejoin="round" />
      <svg style={{ overflow: "visible" }}><OjoX x={-300} y={-52} r={12} /></svg>
      <path d="M -370 2 q 6 26 26 22" fill="#e2706a" stroke="#8a2a2a" strokeWidth={4} />
      <svg style={{ overflow: "visible" }}>{[0, 1, 2, 3].map((i) => <Mosca key={i} t={t} x={0} y={-230} i={i} />)}</svg>
    </G>
  );
};
const Carro: React.FC<{ x: number }> = ({ x }) => (
  <G x={x} y={SUELO}>
    <rect x={-160} y={-170} width={320} height={90} rx={8} fill="#7d4a24" stroke="#4a2810" strokeWidth={6} />
    {[-100, 100].map((cx) => <g key={cx}><circle cx={cx} cy={-50} r={50} fill="#5a3418" stroke="#2b1c14" strokeWidth={8} /><circle cx={cx} cy={-50} r={10} fill="#2b1c14" /></g>)}
    <rect x={-260} y={-140} width={110} height={10} rx={5} fill="#4a2810" />
  </G>
);
const Perro: React.FC<{ x: number; t: number; i: number }> = ({ x, t, i }) => (
  <G x={x} y={SUELO - 6 - Math.abs(Math.sin(t * 12 + i)) * 20}>
    <ellipse cx={0} cy={-50} rx={50} ry={24} fill={["#9a7a5a", "#5a4a3a", "#c9a27a"][i % 3]} />
    {[-30, 30].map((lx) => <rect key={lx} x={lx - 6} y={-40} width={12} height={40} rx={6} fill="#5a4a3a" transform={`rotate(${Math.sin(t * 20 + lx) * 30} ${lx} -40)`} />)}
    <circle cx={56} cy={-70} r={24} fill={["#9a7a5a", "#5a4a3a", "#c9a27a"][i % 3]} /><circle cx={64} cy={-76} r={5} fill="#111" />
    <path d="M -48 -60 q -30 -20 -30 -50" stroke="#5a4a3a" strokeWidth={8} fill="none" />
  </G>
);
const Letrina: React.FC<{ x: number; t: number }> = ({ x, t }) => (
  <G x={x} y={SUELO}>
    <rect x={-80} y={-280} width={160} height={280} fill="#8a5a2a" stroke="#4a2810" strokeWidth={6} />
    <path d="M -100 -280 L 0 -340 L 100 -280 Z" fill="#6b3a1f" />
    <path d="M -10 -230 a 20 20 0 1 0 20 0" fill="none" stroke="#f3dcb0" strokeWidth={8} />
    {[0, 1, 2].map((i) => <path key={i} d={`M ${-40 + i * 40} ${-360 - ((t * 60 + i * 30) % 90)} q 16 -20 0 -40 q -16 -20 0 -40`} stroke="#8ab04a" strokeWidth={7} fill="none" opacity={0.8} />)}
  </G>
);
const Soga: React.FC = () => <g><circle cx={0} cy={0} r={28} fill="none" stroke="#c9a060" strokeWidth={12} /><circle cx={0} cy={0} r={14} fill="none" stroke="#a8803a" strokeWidth={8} /></g>;
const Frasco: React.FC<{ color: string }> = ({ color }) => <g><rect x={-22} y={-60} width={44} height={60} rx={10} fill={color} stroke="#2b1c14" strokeWidth={4} /><rect x={-16} y={-74} width={32} height={16} rx={4} fill="#7d4a24" /></g>;

export const P7Mundo: React.FC<{ t: number }> = ({ t }) => {
  const golpe = vig(t, 726.4, 728.0) ? Math.abs(Math.sin(t * 14)) : 0;
  return (
    <>
      {/* ── la casa: la gente trae las tareas (y monedas) */}
      {t < 654.5 && (
        <>
          <Franz x={CASA + 100} y={SUELO - 10} t={t} viejoF={false} expr={t > 651 ? "sorpresa" : "neutro"} flip />
          {t > 651 && [0, 1, 2, 3].map((i) => <Persona key={i} x={interp(t, [651.1 + i * 0.3, 652.5 + i * 0.3], [7700, 7250 + i * 110])} y={SUELO - 20} h={270} t={t} seed={700 + i} ropa={CIVIL(80 + i)} flip camina={t < 652.6 + i * 0.3 ? 1.6 : 0} expr="neutro" bD={110} cD={30}
            manoD={<g><rect x={-30} y={-22} width={60} height={44} rx={4} fill="#fff6e0" stroke="#7a3d14" strokeWidth={4} /></g>} />)}
        </>
      )}
      {/* ── perro muerto en la calle */}
      {vig(t, 653, 657.4) && (
        <>
          <PerroMuerto x={PERRO} t={t} />
          <Persona x={PERRO + 260} y={SUELO - 10} h={290} t={t} seed={710} ropa={CIVIL(84)} gorro="toca" flip expr="miedo" habla bD={130} cD={20} />
          <Emote t={t} t0={655} tipo="excl" x={PERRO + 260} y={SUELO - 380} s={0.7} />
          <BurbujaM t={t} t0={656.1} t1={657.3} x={PERRO + 180} y={SUELO - 440} text="CALL THE EXECUTIONER!" size={40} />
        </>
      )}
      {/* ── caballo en la plaza → el desollador lo carga en el carro */}
      {vig(t, 656.4, 664.4) && (
        <>
          {t < 662.0 && <CaballoMuerto x={CABALLO} t={t} />}
          {t >= 662.0 && <G x={interp(t, [662.0, 664.3], [CABALLO + 120, CABALLO + 800])} y={SUELO - 140} s={0.8}><ellipse cx={0} cy={-40} rx={150} ry={50} fill="#8a5a3a" /><svg style={{ overflow: "visible" }}><OjoX x={-130} y={-50} r={9} /></svg></G>}
          {t > 660 && <Carro x={interp(t, [660, 661.6, 662.0, 664.3], [CABALLO + 900, CABALLO + 480, CABALLO + 420, CABALLO + 1000])} />}
          {t > 660 && <Persona x={interp(t, [660, 661.6, 662.0, 664.3], [CABALLO + 960, CABALLO + 460, CABALLO + 380, CABALLO + 1060])} y={SUELO - 10} h={290} t={t} seed={601} ropa={DESOLLADOR} gorro="capucha" flip={t < 662} camina={t < 661.6 || t > 662 ? 1.6 : 0} expr="neutro" bD={130} cD={30} />}
          {t < 660.1 && [CABALLO - 360, CABALLO - 250, CABALLO + 300].map((cx, i) => <Persona key={cx} x={cx} y={SUELO - 10} h={280} t={t} seed={720 + i} ropa={CIVIL(90 + i)} flip={cx > CABALLO} expr="sorpresa" habla={i === 0} bD={i === 0 ? 150 : 20} cD={10} />)}
          <BurbujaM t={t} t0={658.9} t1={660.1} x={CABALLO - 360} y={SUELO - 420} text="EXECUTIONER!" size={44} />
        </>
      )}
      {/* ── perros callejeros: Franz los corre con la escoba */}
      {vig(t, 664.4, 667.4) && (
        <>
          {[0, 1, 2].map((i) => <Perro key={i} x={interp(t, [664.8, 667.2], [5300 + i * 90, 6000 + i * 110])} t={t} i={i} />)}
          <Franz x={interp(t, [665.0, 667.3], [5150, 5750])} y={SUELO - 10} t={t} camina={1.8} expr="enojado" bD={150 + Math.sin(t * 10) * 20} cD={20}
            manoD={<g><rect x={-5} y={-200} width={10} height={260} fill="#8a5a2a" /><path d="M -40 60 L 40 60 L 20 0 L -20 0 Z" fill="#d9b77a" /></g>} />
        </>
      )}
      {/* ── las letrinas */}
      {vig(t, 666.4, 670.0) && (
        <>
          <Letrina x={5840} t={t} />
          <Franz x={5640} y={SUELO - 10} t={t} expr="triste" bD={150} cD={150} manoI={<rect x={-5} y={-180} width={10} height={240} fill="#8a5a2a" />} />
          <Emote t={t} t0={667.2} tipo="sudor" x={5640} y={SUELO - 380} s={0.7} />
        </>
      )}
      {/* ── mendigos en el puente, Franz pone orden */}
      {vig(t, 668.0, 673.6) && (
        <>
          {[5930, 6030, 6130, 6230].map((cx, i) => <Persona key={cx} x={cx} y={SUELO - 30} h={250} t={t} seed={730 + i} ropa={{ ...CIVIL(95 + i), tunica: "#8a8070", tunica2: "#6a6050" }} expr={i % 2 ? "triste" : "neutro"} bD={i === 1 ? 120 : 20} cD={i === 1 ? 70 : 10} flip />)}
          <Franz x={5780} y={SUELO - 10} t={t} expr="orgullo" bD={100} cD={0} manoD={<g><rect x={-30} y={-40} width={60} height={70} rx={6} fill="#fff6e0" stroke="#7a3d14" strokeWidth={4} /></g>} />
          <TextoMundo x={6080} y={SUELO - 400} text="ONE LINE, PLEASE" size={70} color="#fff3d6" borde="#2b1c14" />
        </>
      )}
      {/* ── la casa del farol rojo (guiño) */}
      {vig(t, 671.8, 679.4) && (
        <>
          <Svg>
            <path d={`M ${FAROL + 40} ${SUELO - 520} L ${FAROL + 40} ${SUELO - 470}`} stroke="#2b1c14" strokeWidth={6} />
            <rect x={FAROL + 14} y={SUELO - 470} width={52} height={70} rx={14} fill={C.rojo} stroke="#5e0f1d" strokeWidth={6} />
            <circle cx={FAROL + 40} cy={SUELO - 435} r={90} fill="#ff3a4a" opacity={0.18 + 0.08 * Math.sin(t * 6)} />
          </Svg>
          <Persona x={FAROL - 30} y={SUELO - 10} h={280} t={t} seed={740} ropa={{ ...CIVIL(100), tunica: "#c8447a", tunica2: "#8a2a54" }} gorro="toca" expr="feliz" bD={110} cD={120} ladea={8} />
          {t > 675.9 && <Franz x={FAROL - 230} y={SUELO - 10} t={t} expr="neutro" bD={90} cD={0} manoD={<g><rect x={-30} y={-40} width={60} height={70} rx={6} fill="#fff6e0" stroke="#7a3d14" strokeWidth={4} /></g>} />}
          <Emote t={t} t0={676.4} tipo="brillos" x={FAROL - 30} y={SUELO - 380} s={0.7} />
        </>
      )}
      {/* ── todo llega a tu puerta, y todo tiene precio */}
      {vig(t, 678.0, 684.6) && (
        <>
          <Franz x={CASA + 300} y={SUELO - 10} t={t} expr="sorpresa" bD={120} cD={60} />
          {Array.from({ length: 7 }, (_, i) => <Persona key={i} x={interp(t, [678.8 + i * 0.25, 680.5 + i * 0.25], [8100 + i * 120, 7000 + i * 120])} y={SUELO - 20} h={260} t={t} seed={750 + i} ropa={CIVIL(110 + i)} flip camina={1.5} expr="neutro" bD={100} cD={40}
            manoD={i % 2 ? <Svg><Moneda x={0} y={0} /></Svg> : <g><rect x={-30} y={-22} width={60} height={44} rx={4} fill="#fff6e0" stroke="#7a3d14" strokeWidth={4} /></g>} />)}
          {t > 682.3 && Array.from({ length: 8 }, (_, i) => {
            const u = clamp((t - 682.3 - i * 0.12) / 0.5, 0, 1);
            return <Svg key={i}><Moneda x={CASA + 380 + (i % 4) * 30} y={SUELO - 400 + u * (380 - Math.floor(i / 4) * 30)} r={18} /></Svg>;
          })}
        </>
      )}
      {/* ── la taberna: Franz mira el menú desde afuera */}
      {vig(t, 683.4, 694.6) && (
        <>
          <Gente t={t} x0={3150} x1={3700} n={5} y={SUELO - 20} h={260} seed={760} expr="feliz" habla mira={0} />
          <Franz x={3950} y={SUELO - 10} t={t} flip expr={t > 692 ? "triste" : "neutro"} mira={-1} />
        </>
      )}
      {/* ── el puesto: soga de la suerte y ungüentos "no preguntes" */}
      {vig(t, 693.3, 715.6) && (
        <>
          <Svg>
            <rect x={PUESTO - 200} y={SUELO - 200} width={400} height={190} fill="#7d4a24" stroke="#4a2810" strokeWidth={6} />
            <path d={`M ${PUESTO - 230} ${SUELO - 420} L ${PUESTO + 230} ${SUELO - 420} L ${PUESTO + 200} ${SUELO - 360} L ${PUESTO - 200} ${SUELO - 360} Z`} fill={C.violeta} />
            {[-1, 1].map((d) => <rect key={d} x={PUESTO + d * 190 - 6} y={SUELO - 420} width={12} height={220} fill="#4a2810" />)}
          </Svg>
          <Franz x={PUESTO - 60} y={SUELO - 140} t={t} expr="orgullo" habla={vig(t, 696.6, 700.8)} bD={vig(t, 700.8, 704.9) ? 110 : 40} cD={20} manoD={vig(t, 700.8, 704.9) ? <Soga /> : undefined} />
          <G x={PUESTO - 140} y={SUELO - 200}><Soga /></G>
          {["#7ac07a", "#c0a07a", "#9a7ac0"].map((col, i) => <G key={i} x={PUESTO + 60 + i * 56} y={SUELO - 200}><Frasco color={col} /></G>)}
          <TextoMundo x={PUESTO} y={SUELO - 150} text="GALLOWS GOODS" size={46} color={C.ambar} borde="#2b1c14" />
          {vig(t, 704.9, 707.5) && <TextoMundo x={PUESTO + 116} y={SUELO - 290} text="DON'T ASK" size={30} color="#fff3d6" borde="#2b1c14" rot={-6} />}
          {/* el jugador con los dados */}
          {vig(t, 700.0, 705.0) && (
            <>
              <Persona x={PUESTO + 330} y={SUELO - 10} h={290} t={t} seed={770} ropa={{ ...CIVIL(120), tunica: "#2a7a4a", tunica2: "#1a5030" }} flip expr={t > 703.2 ? "feliz" : "neutro"} bD={110} cD={60} salta={t > 703.2 ? 1 : 0}
                manoD={<g>{[0, 1].map((i) => <rect key={i} x={-26 + i * 30} y={-14} width={24} height={24} rx={5} fill="#fff" stroke="#2b1c14" strokeWidth={3} />)}</g>} />
              <TextoMundo x={PUESTO + 330} y={SUELO - 400} text="+LUCK?" size={56} color={C.lima} borde="#1b2a10" />
            </>
          )}
          {/* el cliente que mira el frasco y se arrepiente de haber preguntado */}
          {vig(t, 705.0, 711.6) && (
            <>
              <Persona x={PUESTO + 300} y={SUELO - 10} h={290} t={t} seed={771} ropa={CIVIL(122)} gorro="campesino" flip expr={t > 708.4 ? "miedo" : "neutro"} inclina={t > 708.4 ? -8 : 4} bD={100} cD={60} />
              {t > 708.4 && <Emote t={t} t0={708.5} tipo="susto" x={PUESTO + 300} y={SUELO - 380} s={0.7} />}
            </>
          )}
          {/* la fila: único proveedor */}
          {t > 711.5 && (
            <>
              <Gente t={t} x0={PUESTO + 260} x1={PUESTO + 1000} n={7} y={SUELO - 10} h={270} seed={780} flipDe={0} expr="neutro" />
              <Particulas t={t} tipo="lluviaoro" n={30} seed={7} />
            </>
          )}
        </>
      )}
      {/* ── el mapa con las 7 trampas */}
      {vig(t, 717.8, 722.2) && (
        <>
          {["BLOOD", "TOUCH", "CHURCH", "ADDRESS", "MARRIAGE", "STAGE", "JOBS"].map((l, i) => (
            <Pin key={i} t={t} t0={718.7 + i * 0.22} x={1700 + i * 1430} y={SUELO - 100 - (i % 2) * 220} n={i + 1} s={3.4} label={l} />
          ))}
        </>
      )}
      {/* ── de día no te dan la mano... */}
      {vig(t, 721.0, 726.4) && (
        <>
          <Franz x={7180} y={SUELO - 10} t={t} expr={t > 724.5 ? "triste" : "feliz"} bD={t > 723.5 ? 90 : 10} cD={0} />
          <Persona x={interp(t, [724.2, 725.0], [7400, 7520])} y={SUELO - 20} h={300} t={t} seed={790} ropa={MERCADER} gorro="noble" flip expr={t > 723.8 ? "enojado" : "neutro"} inclina={t > 724.2 ? 10 : 0} bD={t > 724 ? 40 : 10} cD={t > 724 ? 150 : 10} />
        </>
      )}
      {/* ── ...de noche golpean la puerta de atrás */}
      {t > 726.0 && (
        <>
          <Persona x={ATRAS + 120} y={SUELO - 20} h={300} t={t} seed={790} ropa={MERCADER} gorro="capucha" capa="#1b2440" flip expr="miedo" mira={-1} bD={130 + golpe * 20} cD={40 - golpe * 30} />
          {[0, 1].map((i) => <Persona key={i} x={ATRAS + 260 + i * 120} y={SUELO - 20} h={280} t={t} seed={791 + i} ropa={CIVIL(130 + i)} gorro="capucha" capa="#1b2440" flip expr="miedo" bD={i ? 140 : 20} cD={i ? 140 : 10} />)}
          {vig(t, 726.5, 728.2) && <TextoMundo x={ATRAS + 40} y={SUELO - 420 - golpe * 10} text="KNOCK KNOCK" size={60} color={C.ambar} borde="#2b1c14" rot={-6} />}
        </>
      )}
    </>
  );
};

// la lista de tareas que se desenrolla
const Rollo: React.FC<{ t: number }> = ({ t }) => {
  if (t < 647.4 || t > 654.6) return null;
  const items = ["EXECUTIONS", "DEAD ANIMALS", "STRAY DOGS", "LATRINES", "BEGGARS", "...", "EVERYTHING ELSE"];
  const u = clamp((t - 647.6) / 2.6, 0, 1);
  const e = clamp((t - 647.4) / 0.3, 0, 1) * clamp((654.6 - t) / 0.3, 0, 1);
  return (
    <div style={{ position: "absolute", left: 1420, top: 120, transform: `scale(${e * 0.82})`, transformOrigin: "50% 0", width: 560, marginLeft: -280, fontFamily, fontWeight: 700 }}>
      <div style={{ height: 40, background: "#a8805a", borderRadius: 20 }} />
      <div style={{ background: "#fbecc8", borderLeft: "8px solid #7a3d14", borderRight: "8px solid #7a3d14", height: 40 + u * 640, overflow: "hidden", padding: "0 30px" }}>
        <div style={{ fontSize: 40, color: "#7a3d14", paddingTop: 14 }}>TO DO:</div>
        {items.map((x, i) => <div key={x} style={{ fontSize: 46, color: i === items.length - 1 ? C.rojo : "#5a2a10", marginTop: 14 }}><span style={{ color: t > 650.6 + i * 0.45 ? "#2f8a3a" : undefined }}>{t > 650.6 + i * 0.45 ? "☑" : "☐"}</span> {x}</div>)}
      </div>
      <div style={{ height: 40, background: "#a8805a", borderRadius: 20 }} />
    </div>
  );
};

// la lista oficial de precios, como el menú de una taberna (con monedas, sin cifras)
const Menu: React.FC<{ t: number }> = ({ t }) => {
  if (t < 684.3 || t > 694.1) return null;
  const items: [string, number][] = [["AN EXECUTION", 4], ["A FLOGGING", 2], ["REMOVE A DEAD HORSE", 2], ["REMOVE A DEAD DOG", 1], ["CLEAN THE LATRINE", 3]];
  const e = clamp((t - 684.3) / 0.35, 0, 1) * clamp((694.1 - t) / 0.3, 0, 1);
  return (
    <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) scale(${e}) rotate(-2deg)`, background: "#fbecc8", border: "10px solid #7a3d14", borderRadius: 24, padding: "24px 50px", fontFamily, fontWeight: 700, boxShadow: "0 14px 0 rgba(20,10,50,.35)", minWidth: 760 }}>
      <div style={{ fontSize: 52, color: "#7a3d14", textAlign: "center" }}>OFFICIAL FEE LIST</div>
      <div style={{ fontSize: 28, color: "#a8805a", textAlign: "center", marginBottom: 10 }}>~ THE EXECUTIONER ~</div>
      {items.map(([x, n], i) => (
        <div key={x} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 40, color: "#5a2a10", marginTop: 10, opacity: t > 685.2 + i * 0.6 ? 1 : 0 }}>
          <span>{x}</span>
          <span style={{ display: "flex", gap: 6, marginLeft: 30 }}>{Array.from({ length: n }, (_, k) => <span key={k} style={{ width: 30, height: 30, borderRadius: 15, background: C.oro, border: "4px solid #8a5414", display: "inline-block" }} />)}</span>
        </div>
      ))}
    </div>
  );
};

export const P7Pant: React.FC<{ t: number }> = ({ t }) => (
  <>
    <CartelTrampa t={t} t0={645.2} t1={647.4} n={7} titulo="THE OTHER JOBS" />
    <Chip t={t} t0={647.5} t1={651.0} text="RARELY JUST ONE JOB" color={C.violeta} x={500} y={150} centro size={58} />
    <Chip t={t} t0={651.1} t1={654.6} text="ALL THE TASKS NOBODY WOULD TOUCH" color={C.noche} x={560} y={150} centro size={50} />
    <Rollo t={t} />
    <Chip t={t} t0={654.75} t1={657.4} text="DEAD DOG IN THE STREET?" color={C.rojo} x={960} y={150} centro size={60} />
    <Chip t={t} t0={657.55} t1={660.1} text="DEAD HORSE IN THE SQUARE?" color={C.rojo} x={960} y={150} centro size={60} />
    <Chip t={t} t0={660.2} t1={665.2} text="HE (OR HIS KNACKER) CLEARED IT AWAY" color={C.noche} x={960} y={150} centro size={54} />
    <Chip t={t} t0={665.35} t1={666.7} text="STRAY DOGS" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={64} />
    <Chip t={t} t0={666.85} t1={668.7} text="THE PUBLIC LATRINES" color={C.lima} tinta={C.noche} x={960} y={150} centro size={62} />
    <Chip t={t} t0={669.4} t1={672.6} text="KEEPER OF THE BEGGARS" color={C.teal} tinta={C.noche} x={960} y={150} centro size={60} />
    <Chip t={t} t0={672.7} t1={675.8} text="SUPERVISOR OF CERTAIN HOUSES..." color={C.rosa} tinta={C.noche} x={960} y={150} centro size={56} />
    <Titulo t={t} t0={675.95} t1={678.6} text="QUESTIONABLE REPUTATION" y={220} size={90} color={C.rosa} borde="#2b0a14" />
    <Chip t={t} t0={678.85} t1={682.2} text="EVERY MISERABLE JOB FOUND YOUR DOOR" color={C.violeta} x={960} y={150} centro size={52} />
    <Titulo t={t} t0={682.35} t1={684.1} text="...WITH A PRICE" y={200} size={120} color={C.oro} borde="#5a3a10" />
    <Menu t={t} />
    <Sello t={t} t0={691.4} t1={694.0} text="YOU'RE NOT WELCOME" x={620} y={330} size={70} rot={-10} />
    <Chip t={t} t0={694.15} t1={696.5} text="AND ON THE SIDE..." color={C.violeta} x={960} y={150} centro size={60} />
    <Chip t={t} t0={696.65} t1={700.7} text="ANYTHING FROM THE GALLOWS = MAGIC (SUPPOSEDLY)" color={C.noche} x={960} y={150} centro size={48} />
    <Chip t={t} t0={700.85} t1={704.8} text="HANGMAN'S ROPE = LUCK FOR GAMBLERS" color={C.lima} tinta={C.noche} x={960} y={150} centro size={54} />
    <Chip t={t} t0={704.95} t1={707.5} text="HEALING SALVES MADE FROM..." color={C.teal} tinta={C.noche} x={960} y={150} centro size={58} />
    <Chip t={t} t0={707.6} t1={711.4} text="DON'T ASK." color={C.rojo} x={520} y={330} centro size={80} />
    <Chip t={t} t0={711.55} t1={715.0} text="THE ONLY SUPPLIER IN TOWN" color={C.oro} tinta={C.noche} x={960} y={150} centro size={60} />
    <Sello t={t} t0={715.1} t1={718.5} text="LONELY" x={520} y={560} size={110} rot={-10} color={C.violeta} />
    <Sello t={t} t0={717.35} t1={718.5} text="DIRTY" x={960} y={760} size={110} rot={6} color="#8a6a3a" />
    <Sello t={t} t0={717.95} t1={718.5} text="DANGEROUS" x={1400} y={560} size={110} rot={-6} />
    <Titulo t={t} t0={718.65} t1={721.1} text="7 TRAPS" y={950} size={140} color={C.ambar} borde="#2b0a14" />
    <Chip t={t} t0={721.25} t1={723.3} text="REMEMBER THE PROMISE?" color={C.violeta} x={960} y={150} centro size={60} />
    <Chip t={t} t0={723.4} t1={726.2} text="BY DAY: NO HANDSHAKE" color={C.noche} x={960} y={150} centro size={60} />
    <Chip t={t} t0={726.35} t1={728.0} text="BY NIGHT: AT YOUR BACK DOOR" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={60} />
    <Titulo t={t} t0={728.05} t1={729.2} text="HERE'S WHY." y={200} size={130} color={C.crema} />
  </>
);
