import React from "react";
import { clamp } from "../soot/lib";
import { C, Chip, Emote, fontFamily } from "./kit";
import { Persona, CIVIL, Ropa } from "./persona";
import { SUELO, Llave, G, interp, TextoMundo, Ventana, Vent, enV, Espada } from "./mundo";
import { Franz, Gente, CartelTrampa, Sello, Titulo, BurbujaM, vig } from "./actores";

// P5 · Trampa 5 "Who you marry" (445,8-537,8 s). Franz con flores → la puerta que se cierra en la orilla → la
// cámara se mete en el MAPA de la pared (mundo anidado): bodas entre verdugos de pueblo en pueblo, dinastías →
// los hijos aprenden el oficio → salto por el cielo a París: seis generaciones Sanson, "Monsieur de Paris".
const CASA = 6620;
export const V_MAPA: Vent = { x: 6470, y: 360, w: 230 };
const PUERTA = 5440;
const SANSON: Ropa = { tunica: "#1d1430", tunica2: "#0f0a1c", cinto: "#a3202f", piel: "#f0b88e", piel2: "#d3966c", pelo: "#2a1a10" };
const GEN = [30850, 31090, 31330, 31570, 31810, 32050];

export const P5K: Llave[] = [
  [446.6, CASA, 600, 1.4, 0.8],
  [447.8, CASA, 600, 1.9, 0.6],
  [451.3, CASA, 620, 2.3, 0.5],
  [454.9, 5600, 600, 1.2, 1.4],
  [456.4, PUERTA, 600, 1.7, 0.6],
  [458.75, 5000, 600, 1.4, 0.7],
  [461.2, 5050, 600, 1.2, 1.2],
  [462.85, CASA - 40, 540, 2.2, 1.0],
  enV(V_MAPA, 465.0, 960, 540, 1.0, 1.4),
  enV(V_MAPA, 467.2, 1060, 280, 1.6, 0.8),
  enV(V_MAPA, 470.2, 980, 540, 1.0, 0.9),
  enV(V_MAPA, 474.9, 960, 540, 0.95, 0.7),
  enV(V_MAPA, 482.0, 960, 540, 0.97, 4.0),
  [488.4, CASA - 40, 640, 1.6, 1.3],
  [491.8, CASA - 80, 700, 2.2, 0.6],
  [494.5, CASA - 40, 640, 1.5, 0.6],
  [499.0, CASA + 120, 680, 2.1, 0.7],
  [502.8, CASA + 40, 620, 1.3, 0.6],
  [505.85, CASA, 560, 3.0, 0.6],
  [507.7, CASA, 250, 0.95, 1.0],
  [509.0, 31450, 250, 0.95, 1.1],
  [510.3, 31450, 560, 0.85, 1.0],
  [514.9, 31450, 470, 0.7, 0.8],
  [518.35, GEN[3], 600, 1.6, 0.8],
  [520.7, GEN[3] + 120, 600, 1.4, 0.6],
  [525.45, GEN[3] + 60, 560, 2.0, 0.6],
  [527.3, GEN[0] - 110, 600, 1.5, 0.9],
  [531.6, 31450, 560, 0.75, 1.0],
  [534.0, 31450, 520, 0.6, 3.0],
];
export const P5H: [number, number][] = [[445.8, 0], [447.3, 0.5], [500.0, 0.5], [501.5, 0.15], [531.5, 0.15], [535.5, 1], [537.8, 1]];

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>{children}</svg>;
const Flores: React.FC = () => <g><line x1={0} y1={0} x2={0} y2={-70} stroke="#3a7a1a" strokeWidth={6} />{[[-18, -80, C.rosa], [14, -88, C.ambar], [0, -100, C.rojo]].map(([x, y, c], i) => <circle key={i} cx={x as number} cy={y as number} r={16} fill={c as string} />)}</g>;
const Corazon: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = C.rojo }) => <G x={x} y={y} s={s}><path d="M 0 30 C -60 -10 -40 -60 0 -30 C 40 -60 60 -10 0 30 Z" fill={color} stroke="#fff" strokeWidth={6} /></G>;

// ── el mapa de Franconia adentro del cuadro de la pared
const PUEBLOS: Record<string, [number, number]> = {
  NUREMBERG: [960, 560], BAMBERG: [800, 290], BAYREUTH: [1300, 330], HOF: [1520, 280], ANSBACH: [640, 740],
  "WÜRZBURG": [440, 380], REGENSBURG: [1400, 760], AUGSBURG: [880, 790],
};
const Mapa: React.FC<{ t: number }> = ({ t }) => {
  const linea = (a: string, b: string, t0: number, color = C.rojo) => {
    const [x1, y1] = PUEBLOS[a], [x2, y2] = PUEBLOS[b];
    const u = clamp((t - t0) / 0.8, 0, 1);
    if (u <= 0) return null;
    const mx = x1 + (x2 - x1) * u, my = y1 + (y2 - y1) * u;
    return <g key={a + b}><line x1={x1} y1={y1} x2={mx} y2={my} stroke={color} strokeWidth={10} strokeDasharray="22 14" strokeLinecap="round" />{u < 1 && <path transform={`translate(${mx} ${my}) scale(0.8)`} d="M 0 30 C -60 -10 -40 -60 0 -30 C 40 -60 60 -10 0 30 Z" fill={color} />}</g>;
  };
  const dinastia = clamp((t - 474.9) / 2.5, 0, 1);
  return (
    <>
      <Svg>
        <rect x={0} y={0} width={1920} height={1080} fill="#f3dcae" />
        <rect x={30} y={30} width={1860} height={1020} fill="none" stroke="#7a3d14" strokeWidth={14} />
        <path d="M 60 600 Q 400 520 700 640 Q 1000 760 1300 600 Q 1600 450 1880 520" stroke="#7fb8d8" strokeWidth={22} fill="none" />
        <path d="M 600 60 Q 700 300 820 420 Q 940 520 960 560" stroke="#7fb8d8" strokeWidth={14} fill="none" />
        {[[300, 200], [1700, 400], [500, 900], [1200, 980], [1650, 700]].map(([x, y], i) => <path key={i} d={`M ${x - 60} ${y} L ${x} ${y - 70} L ${x + 60} ${y} Z`} fill="#c9a36a" />)}
        {/* manchas de las dinastías */}
        {dinastia > 0 && ["BAMBERG", "BAYREUTH", "REGENSBURG", "ANSBACH", "NUREMBERG"].map((n, i) => { const [x, y] = PUEBLOS[n]; return <circle key={i} cx={x} cy={y} r={150 * clamp(dinastia * 1.5 - i * 0.12, 0, 1)} fill="rgba(232,52,74,.18)" stroke="#a3202f" strokeWidth={6} strokeDasharray="18 10" />; })}
        {linea("BAMBERG", "BAYREUTH", 465.4)}
        {linea("BAYREUTH", "REGENSBURG", 470.4)}
        {linea("NUREMBERG", "ANSBACH", 475.2, "#a3202f")}
        {linea("ANSBACH", "AUGSBURG", 476.0, "#a3202f")}
        {linea("NUREMBERG", "BAMBERG", 476.8, "#a3202f")}
        {linea("BAMBERG", "WÜRZBURG", 477.6, "#a3202f")}
        {linea("BAYREUTH", "HOF", 478.4, "#a3202f")}
        {linea("NUREMBERG", "REGENSBURG", 479.2, "#a3202f")}
        {Object.entries(PUEBLOS).map(([n, [x, y]]) => (
          <g key={n}>
            <circle cx={x} cy={y} r={22} fill="#7a3d14" />
            <path transform={`translate(${x} ${y - 30}) scale(0.9)`} d="M -40 0 Q -40 -46 0 -48 Q 40 -46 40 0 Z" fill="#7a1f3d" />
            <path transform={`translate(${x} ${y - 30}) scale(0.9)`} d="M 20 -40 Q 50 -80 70 -50" stroke={C.rojo} strokeWidth={8} fill="none" />
            <text x={x} y={y + 64} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={48} fill="#5a2a10" stroke="#f3dcae" strokeWidth={8} paintOrder="stroke">{n}</text>
          </g>
        ))}
        {/* lo que viaja por las líneas: el oficio, la espada, el saber */}
        {vig(t, 482.9, 487.3) && [["NUREMBERG", "ANSBACH"], ["BAMBERG", "WÜRZBURG"], ["BAYREUTH", "HOF"], ["NUREMBERG", "REGENSBURG"]].map(([a, b], i) => {
          const [x1, y1] = PUEBLOS[a], [x2, y2] = PUEBLOS[b];
          const u = ((t - 482.9) * 0.6 + i * 0.25) % 1;
          return <g key={i} transform={`translate(${x1 + (x2 - x1) * u} ${y1 + (y2 - y1) * u}) rotate(-30)`}><rect x={-6} y={-60} width={12} height={80} fill="#dfe6ee" stroke="#2b2140" strokeWidth={3} /><rect x={-24} y={16} width={48} height={10} fill="#8a5414" /></g>;
        })}
      </Svg>
      {(t < 462.7 || t > 465.1) && (t < 474.7 || t > 478.4) && <TextoMundo x={960} y={150} text="FRANCONIA" size={70} color="#7a3d14" borde="#f3dcae" />}
    </>
  );
};

export const P5Mundo: React.FC<{ t: number }> = ({ t }) => {
  const enCasa = t < 453.4 || (t > 462.5 && t < 507.5);
  const camina = vig(t, 453.4, 455.4);
  const fx = t < 453.4 ? CASA : t < 458.7 ? interp(t, [453.4, 455.4], [CASA, PUERTA - 170]) : CASA;
  const flores = t > 451.2 && t < 458.0;
  const portazo = clamp((t - 457.4) / 0.25, 0, 1);
  const muestra = vig(t, 494.5, 498.9);
  return (
    <>
      {/* el cuadro del mapa en la pared (y adentro, el mapa vivo) */}
      <Svg><rect x={V_MAPA.x - 10} y={V_MAPA.y - 10} width={V_MAPA.w + 20} height={V_MAPA.w * 0.5625 + 20} rx={6} fill="#7a3d14" /></Svg>
      <Ventana v={V_MAPA}><Mapa t={t} /></Ventana>
      {(enCasa || t < 458.8) && <Franz x={fx} y={SUELO - 10} t={t} camina={camina ? 1.5 : 0} flip={vig(t, 453.4, 458.8)}
        expr={t > 457.5 && t < 462.5 ? "triste" : flores ? "feliz" : vig(t, 505.8, 507.5) ? "neutro" : "neutro"} mira={vig(t, 505.8, 507.5) ? 0 : 0}
        bD={flores ? 100 : muestra ? interp(t % 1.2, [0, 0.6, 1.2], [40, 160, 40]) : 8} cD={flores ? 70 : 10}
        manoD={flores ? <Flores /> : muestra ? <g><rect x={-8} y={-180} width={16} height={180} fill="#c9a36a" /><rect x={-30} y={-10} width={60} height={12} fill="#8a5414" /></g> : undefined} />}
      {vig(t, 451.3, 453.3) && <Emote t={t} t0={451.4} tipo="brillos" x={CASA + 40} y={SUELO - 360} s={0.6} />}
      {/* la puerta que se cierra */}
      {vig(t, 453.4, 458.8) && (
        <>
          <G x={PUERTA} y={SUELO}><rect x={-60} y={-200} width={120} height={200} fill="#3b2614" /></G>
          {t > 456.0 && t < 457.6 && <Persona x={PUERTA} y={SUELO - 10} h={290} t={t} seed={640} ropa={CIVIL(50)} gorro="noble" barba="#6a4a2a" flip expr={t > 456.5 ? "enojado" : "sorpresa"} bD={t > 456.6 ? 90 : 10} />}
          {t > 456.3 && t < 457.5 && <Persona x={PUERTA + 40} y={SUELO - 10} h={240} t={t} seed={641} ropa={{ ...CIVIL(51), tunica: "#e86a9a", tunica2: "#b54a74" }} gorro="toca" flip expr="sorpresa" />}
          <G x={PUERTA - 60} y={SUELO}><g transform={`scale(${t > 456.0 ? Math.max(0.05, 1 - (t > 457.4 ? 1 - portazo : clamp((t - 456.0) / 0.3, 0, 1))) : 1} 1)`}><rect x={0} y={-200} width={120} height={200} fill="#8a5a2a" stroke="#5a3418" strokeWidth={6} /><circle cx={100} cy={-100} r={8} fill={C.oro} /></g></G>
          {vig(t, 457.4, 458.6) && <TextoMundo x={PUERTA} y={SUELO - 300} text="SLAM!" size={90} color={C.rojo} borde="#fff" rot={-8} />}
        </>
      )}
      {/* al revés: la hija de un verdugo y el hijo "respetable" que huye */}
      {vig(t, 458.6, 462.9) && (
        <>
          <Persona x={4900} y={SUELO - 10} h={250} t={t} seed={650} ropa={{ tunica: "#7a1f3d", tunica2: "#4a0f26", cinto: "#1d1410", piel: "#f2b48a", piel2: "#d98d66", pelo: "#3a2414" }} gorro="toca" expr={t > 460 ? "triste" : "feliz"} bD={t < 460 ? 90 : 10} manoD={t < 460 ? <Flores /> : undefined} />
          <Persona x={t < 459.8 ? 5120 : interp(t, [459.8, 461.5], [5120, 5800])} y={SUELO - 10} h={280} t={t} seed={651} ropa={CIVIL(52)} gorro="campesino" camina={t > 459.8 ? 2.2 : 0} flip={t < 459.8} expr={t > 459.5 ? "miedo" : "neutro"} salta={459.5} />
          <BurbujaM t={t} t0={459.6} t1={461.6} x={5250} y={SUELO - 400} text="NOPE!" size={44} />
        </>
      )}
      {/* los hijos: el varón practica con una espada de madera, la nena aprende a llevar la casa */}
      {vig(t, 487.3, 507.6) && (
        <>
          <Persona x={CASA - 150} y={SUELO - 10} h={170} t={t} seed={660} ropa={{ tunica: "#7a1f3d", tunica2: "#4a0f26", cinto: "#1d1410", piel: "#f2b48a", piel2: "#d98d66", pelo: "#3a2414" }} gorro="verdugo"
            expr={vig(t, 491.8, 494.4) ? "triste" : "orgullo"} bD={muestra ? interp((t + 0.25) % 1.2, [0, 0.6, 1.2], [40, 160, 40]) : 100} cD={20}
            manoD={<g><rect x={-6} y={-120} width={12} height={120} fill="#c9a36a" /><rect x={-20} y={-8} width={40} height={10} fill="#8a5414" /></g>} />
          <Persona x={CASA + 230} y={SUELO - 10} h={180} t={t} seed={661} ropa={{ tunica: "#a3202f", tunica2: "#5e0f1d", cinto: "#1d1410", piel: "#f2b48a", piel2: "#d98d66", pelo: "#3a2414" }} gorro="toca"
            expr={vig(t, 502.7, 505.8) ? "triste" : "neutro"} bD={60 + Math.sin(t * 6) * 20} cD={30} inclina={Math.sin(t * 6) * 4}
            manoD={<g><rect x={-5} y={-20} width={10} height={160} fill="#8a5a2a" /><path d="M -30 140 L 30 140 L 20 190 L -20 190 Z" fill="#d9b77a" /></g>} />
          {vig(t, 502.7, 505.8) && <Corazon x={CASA + 400} y={SUELO - 340 + Math.sin(t * 4) * 10} s={0.8} color="#a3202f" />}
        </>
      )}
      {/* ── París: los Sanson, seis generaciones */}
      {t > 508.5 && (
        <>
          {/* la línea de tiempo y la espada que pasa de mano en mano, generación por generación */}
          <G x={0} y={0}><rect x={GEN[0]} y={SUELO + 18} width={(GEN[5] - GEN[0]) * clamp((t - 511) / 3.4, 0, 1)} height={8} rx={4} fill={C.oro} /></G>
          {(() => {
            const k = clamp((t - 511.3) / 3.4, 0, 1) * 5;
            const sx = interp(k, [0, 1, 2, 3, 4, 5], GEN);
            return t > 511.3 && t < 518.3 ? <Espada x={sx + 70} y={SUELO - 60 - Math.abs(Math.sin(k * Math.PI)) * 60} s={0.24} rot={-15} brillo={1} /> : null;
          })()}
          {GEN.map((gx, i) => {
            const t0 = 509.3 + i * 0.55;
            if (t < t0) return null;
            const adelante = i === 3 && vig(t, 518.3, 527.3) ? 1 : 0;
            const tieneEspada = (j: number) => t > 511.3 && t < 518.3 && Math.round(clamp((t - 511.3) / 3.4, 0, 1) * 5) === j;
            return (
              <React.Fragment key={gx}>
                <Persona x={gx} y={SUELO - 10 + adelante * 30} h={[300, 320, 290, 330, 305, 270][i]} t={t} seed={670 + i} ropa={{ ...SANSON, tunica: ["#1d1430", "#5a2a6a", "#2a4a7a", "#7a2a2a", "#2a5a4a", "#6a4a1a"][i], tunica2: ["#0f0a1c", "#3a1a46", "#1a2e50", "#4e1a1a", "#1a3a30", "#4a3210"][i], cinto: ["#a3202f", "#c98f2a", "#1d1410", "#c98f2a", "#a3202f", "#1d1410"][i] }} gorro={(["verdugo", "noble", "verdugo", "capucha", "noble", "verdugo"] as const)[i]} capa={["#a3202f", "#2b0a14", "#c98f2a", "#1b2440", "#7a1f3d", "#3a2a1a"][i]}
                  barba={[ "#d8d2cc", "#9c958f", "#2a1a10", undefined, "#6a3a1a", undefined][i]} viejo={i < 2} aparece={t0} inclina={i < 2 ? 5 : 0}
                  bD={tieneEspada(i) ? 70 : i === 1 ? 40 + Math.sin(t * 2) * 10 : 15} cD={tieneEspada(i) ? 60 : 10} bI={i === 5 ? 120 : 15} habla={i === 4 && vig(t, 511, 514.8)} mira={i < 3 ? 1 : -1}
                  expr={i === 3 && vig(t, 520.7, 527.3) ? "miedo" : i === 0 && vig(t, 527.3, 531.6) ? "feliz" : i === 5 ? "sorpresa" : "orgullo"} flip={i === 0 && vig(t, 527.3, 531.6)} />
                {(t < 514.9 || t > 527.3) && <TextoMundo x={gx} y={SUELO - 480} text={["I", "II", "III", "IV", "V", "VI"][i]} size={56} color={C.ambar} borde="#2b1c14" />}
                {(t < 514.9 || t > 527.3) && <TextoMundo x={gx} y={SUELO - 425} text={["1688", "1707", "1726", "1754", "1795", "1840"][i]} size={30} color="#fff3d6" borde="#2b1c14" />}
              </React.Fragment>
            );
          })}
          {vig(t, 514.9, 518.4) && (
            <G x={31450} y={SUELO - 560}>
              <rect x={-470} y={-70} width={940} height={130} rx={18} fill="#2a4ab5" stroke={C.oro} strokeWidth={10} />
              <text x={0} y={22} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={84} fill="#fff3d6">MONSIEUR DE PARIS</text>
            </G>
          )}
          {/* la corona que se tambalea (1793) */}
          {vig(t, 520.6, 527.4) && (() => {
            const cae = clamp((t - 523.6) / 0.8, 0, 1);
            return (
              <>
                <G x={GEN[3] + 260} y={SUELO}><rect x={-50} y={-200} width={100} height={200} fill="#c9bca4" /><rect x={-70} y={-220} width={140} height={24} fill="#e0d4bc" /></G>
                <G x={GEN[3] + 260 + cae * 160} y={SUELO - 280 + cae * 250} rot={Math.sin(t * 14) * (cae ? 0 : 6) + cae * 120}><path d="M -60 0 L -70 -70 L -35 -35 L 0 -85 L 35 -35 L 70 -70 L 60 0 Z" fill={C.oro} stroke="#8a5414" strokeWidth={6} /></G>
              </>
            );
          })()}
          {/* el bisabuelo y "la chica equivocada" */}
          {vig(t, 527.3, 531.7) && (
            <>
              <Persona x={GEN[0] - 220} y={SUELO - 10} h={260} t={t} seed={680} ropa={{ tunica: "#7a1f3d", tunica2: "#4a0f26", cinto: "#1d1410", piel: "#f2b48a", piel2: "#d98d66", pelo: "#a8642a" }} gorro="toca" expr="feliz" aparece={527.3} />
              <Corazon x={GEN[0] - 110} y={SUELO - 380 + Math.sin(t * 5) * 10} />
            </>
          )}
          {/* el público que mira */}
          {t > 531.5 && <Gente t={t} x0={30300} x1={32600} n={11} y={SUELO + 560} h={720} seed={91} mira={0} expr="neutro" />}
        </>
      )}
    </>
  );
};

const Lista: React.FC<{ t: number }> = ({ t }) => {
  if (t < 447.8 || t > 453.5) return null;
  const it: [string, number, boolean][] = [["STEADY JOB", 448.6, true], ["HOUSE ON A BRIDGE", 449.6, true], ["A WIFE", 451.3, false]];
  return (
    <div style={{ position: "absolute", left: 1450, top: 540, transform: `translate(-50%,-50%) rotate(3deg) scale(${clamp((t - 447.8) / 0.3, 0, 1) * clamp((453.5 - t) / 0.3, 0, 1)})`, background: "#fbecc8", border: "8px solid #7a3d14", borderRadius: 22, padding: "22px 40px", fontFamily, fontWeight: 700, boxShadow: "0 12px 0 rgba(20,10,50,.35)" }}>
      {it.map(([x, t0, ok]) => <div key={x} style={{ fontSize: 56, color: "#5a2a10", opacity: t > t0 ? 1 : 0 }}><span style={{ color: ok ? "#2a8a3a" : C.rojo }}>{ok ? "✓" : "?"}</span> {x}</div>)}
    </div>
  );
};

export const P5Pant: React.FC<{ t: number }> = ({ t }) => (
  <>
    <CartelTrampa t={t} t0={445.9} t1={447.6} n={5} titulo="WHO YOU MARRY" />
    <Lista t={t} />
    <Chip t={t} t0={453.4} t1={454.8} text="ONE PROBLEM..." color={C.rojo} x={960} y={150} centro size={62} />
    <Chip t={t} t0={454.9} t1={458.6} text="NO FAMILY WANTS THEIR DAUGHTER MARRYING YOU" color={C.noche} x={960} y={150} centro size={48} />
    <Chip t={t} t0={458.7} t1={462.7} text="...OR THEIR SON MARRYING YOURS" color={C.noche} x={960} y={150} centro size={54} />
    <Titulo t={t} t0={462.85} t1={464.9} text="SO THEY MARRIED EACH OTHER" y={90} size={70} color={C.crema} />
    <Chip t={t} t0={465.0} t1={470.0} text="SON OF ONE TOWN ♥ DAUGHTER OF THE NEXT" color={C.rojo} x={960} y={1012} centro size={44} />
    <Chip t={t} t0={470.2} t1={474.7} text="THEIR KIDS: THREE TOWNS AWAY" color={C.violeta} x={960} y={1012} centro size={44} />
    <Titulo t={t} t0={474.9} t1={478.2} text="DYNASTIES" y={200} size={150} color={C.rojo} borde="#2b0a14" />
    <Chip t={t} t0={478.4} t1={482.9} text="WHOLE REGIONS · ALL RELATED" color={C.violeta} x={960} y={1012} centro size={44} />
    <Chip t={t} t0={483.0} t1={487.2} text="THE JOB · THE SWORDS · THE KNOWLEDGE" color={C.noche} x={960} y={1012} centro size={44} />
    <Chip t={t} t0={487.4} t1={489.4} text="AND YOUR CHILDREN?" color={C.violeta} x={960} y={150} centro size={60} />
    <Chip t={t} t0={489.5} t1={491.7} text="AGE 5: THEY ALREADY KNEW" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={58} />
    <Sello t={t} t0={491.8} t1={494.4} text="NO GUILD" x={1480} y={860} size={100} />
    <Chip t={t} t0={494.5} t1={498.8} text="LIKE A BAKER'S SON LEARNS TO KNEAD" color={C.teal} tinta={C.noche} x={960} y={150} centro size={54} />
    <Chip t={t} t0={498.95} t1={502.6} text="SHE LEARNS TO RUN AN EXECUTIONER'S HOUSE" color={C.violeta} x={960} y={150} centro size={50} />
    <Chip t={t} t0={502.7} t1={504.6} text="...SHE WILL MARRY INTO ONE" color={C.rojo} x={960} y={150} centro size={58} />
    <Sello t={t} t0={504.65} t1={505.8} text="NOBODY ASKED THEM" x={960} y={900} size={84} rot={-6} />
    <Titulo t={t} t0={505.9} t1={507.4} text="NOBODY ASKED YOU EITHER" y={190} size={90} color={C.crema} />
    <Titulo t={t} t0={509.0} t1={510.8} text="PARIS" y={540} size={170} color={C.crema} />
    <Chip t={t} t0={510.95} t1={514.8} text="THE SANSON FAMILY · 6 GENERATIONS" color={C.rojo} x={960} y={150} centro size={56} />
    <Chip t={t} t0={514.9} t1={518.2} text="AN OFFICIAL TITLE" color={C.violeta} x={960} y={150} centro size={60} />
    <Chip t={t} t0={518.4} t1={520.6} text="CHARLES-HENRI SANSON" color={C.noche} x={960} y={150} centro size={60} />
    <Chip t={t} t0={520.7} t1={525.3} text="ON THE SCAFFOLD FOR KING LOUIS XVI" color={C.rojo} x={960} y={150} centro size={54} />
    <Sello t={t} t0={522.0} t1={525.3} text="1793" x={1500} y={330} size={110} color={C.violeta} />
    <Chip t={t} t0={525.5} t1={527.2} text="HE DIDN'T CHOOSE IT EITHER" color={C.violeta} x={960} y={150} centro size={58} />
    <Sello t={t} t0={529.8} t1={531.6} text="THE WRONG GIRL" x={960} y={330} size={90} rot={-8} />
    <Chip t={t} t0={527.35} t1={529.7} text="HIS GREAT-GRANDFATHER MARRIED..." color={C.noche} x={960} y={150} centro size={56} />
    <Chip t={t} t0={531.7} t1={535.2} text="NOT JUST YOURS: A FAMILY BUSINESS" color={C.violeta} x={960} y={150} centro size={54} />
    <Titulo t={t} t0={535.3} t1={537.7} text="...WITH CUSTOMERS WATCHING" y={200} size={96} color={C.ambar} />
  </>
);
