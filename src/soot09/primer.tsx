import React from "react";
import { Persona } from "./persona";
import { ent, prog } from "./kit";
import { GENT, COLONO, SMITH, POW } from "./kitj";

// PRIMER PLANO: en los tramos donde el mundo queda en plano general, un personaje grande entra desde abajo
// y actúa lo que dice la voz en ese segundo (el mundo queda de fondo). Coordenadas de pantalla.
type P = React.ComponentProps<typeof Persona>;
type E = [number, number, "I" | "D", Omit<P, "x" | "y" | "h" | "t">];

const CIENT = { ...COLONO(0), tunica: "#f4f4f4", tunica2: "#c8cfd8" };
const cuenco = <ellipse cx={0} cy={18} rx={44} ry={24} fill="#a0683a" stroke="#5a3418" strokeWidth={6} />;
const choclo = <g><ellipse cx={0} cy={-30} rx={22} ry={52} fill="#f0c43a" stroke="#a07a1a" strokeWidth={5} /><path d="M -20 10 Q -40 -40 -10 -80 M 20 10 Q 40 -40 10 -80" stroke="#5a9a3a" strokeWidth={8} fill="none" /></g>;
const pluma = <path d="M 0 0 L 70 -110 Q 90 -100 70 -80 Z" fill="#f4ecd8" stroke="#6a5a4a" strokeWidth={4} />;
const balde = <path d="M -36 -30 L 36 -30 L 28 40 L -28 40 Z" fill="#8a5a2e" stroke="#4e2a12" strokeWidth={6} />;
const pepita = <circle cx={10} cy={-10} r={18} fill="#ffd34a" stroke="#c89a1a" strokeWidth={5} />;
const bolsa = <path d="M -40 40 Q -50 -20 0 -30 Q 50 -20 40 40 Z" fill="#c8a868" stroke="#6a4a2a" strokeWidth={6} />;
const azada = <g><rect x={-5} y={-150} width={10} height={200} fill="#6a4a2a" /><path d="M -5 -150 L -60 -130 L -5 -120 Z" fill="#6a6a74" /></g>;
const pala = <g><rect x={-5} y={-170} width={10} height={180} fill="#6a4a2a" /><path d="M -26 10 L 26 10 L 20 70 Q 0 86 -20 70 Z" fill="#7a7a84" /></g>;
const hatillo = <circle cx={0} cy={20} r={40} fill="#b0905a" stroke="#5a3a1a" strokeWidth={6} />;
const panfleto = <g><rect x={-40} y={-90} width={90} height={110} fill="#f4ecd8" stroke="#6a5a4a" strokeWidth={4} />{[0, 1, 2, 3].map((k) => <line key={k} x1={-28} y1={-70 + k * 22} x2={36} y2={-70 + k * 22} stroke="#8a7a6a" strokeWidth={4} />)}</g>;

const E_: E[] = [
  [35.5, 36.95, "D", { seed: 1101, ropa: COLONO(0), expr: "neutro", habla: true }],
  [99.7, 104.8, "I", { seed: 1103, ropa: COLONO(2), expr: "triste", manoD: cuenco }],
  [135.5, 139.6, "D", { seed: 1104, ropa: GENT(2), gola: true, gorro: "copa", expr: "sorpresa", manoD: choclo }],
  [208.4, 213.5, "I", { seed: 1140, ropa: COLONO(1), expr: "triste", manoD: <g transform="scale(.55)">{choclo}</g> }],
  [219.9, 226.2, "D", { seed: 1141, ropa: GENT(2), gola: true, gorro: "copa", expr: "neutro", habla: true, manoD: panfleto }],
  [278.6, 284.0, "D", { seed: 1105, ropa: GENT(1), gola: true, gorro: "pluma", expr: "triste", flaco: 0.3, manoD: pluma }],
  [287.7, 290.6, "I", { seed: 1106, ropa: COLONO(3), expr: "miedo", flaco: 0.45 }],
  [291.0, 300.4, "I", { seed: 1107, ropa: CIENT, expr: "sorpresa", habla: true, bD: 80, cD: 60, manoD: <g><rect x={-6} y={-20} width={12} height={150} fill="#8a8a94" /><rect x={-40} y={-30} width={80} height={16} rx={6} fill="#6a4a2a" /></g> }],
  [314.6, 319.1, "I", { seed: 1143, ropa: COLONO(3), expr: "triste", flaco: 0.45 }],
  [345.6, 350.4, "I", { seed: 1108, ropa: COLONO(0), expr: "miedo" }],
  [350.6, 355.0, "D", { seed: 1109, ropa: COLONO(2), expr: "triste", manoD: balde }],
  [355.4, 360.4, "D", { seed: 1110, ropa: GENT(0), gola: true, gorro: "copa", expr: "neutro" }],
  [379.7, 386.0, "I", { seed: 1111, ropa: COLONO(1), expr: "sorpresa", manoD: pepita }],
  [394.0, 400.0, "D", { seed: 1112, ropa: GENT(3), gola: true, gorro: "copa", expr: "orgullo", manoD: bolsa }],
  [415.6, 420.4, "I", { seed: 1113, ropa: SMITH, barba: "#8a4a1a", gorro: "morion", gola: true, expr: "enojado", habla: true, bD: 140, cD: 20 }],
  [420.6, 425.0, "I", { seed: 1114, ropa: GENT(1), gola: true, gorro: "copa", expr: "enojado" }],
  [435.6, 441.0, "I", { seed: 1115, ropa: COLONO(0), expr: "feliz", manoD: azada }],
  [459.6, 465.0, "D", { seed: 1116, ropa: COLONO(3), expr: "neutro", flaco: 0.2, manoD: cuenco }],
  [487.7, 494.3, "D", { seed: 1144, ropa: POW(2), viejo: true, plumaPelo: true, capa: "#6a3a1a", expr: "enojado", habla: true, bD: 140, cD: 30 }],
  [529.6, 535.0, "I", { seed: 1117, ropa: SMITH, barba: "#8a4a1a", gorro: "morion", gola: true, expr: "orgullo", habla: true }],
  [589.6, 596.2, "I", { seed: 1119, ropa: GENT(2), gola: true, gorro: "morion", expr: "triste", flaco: 0.2 }],
  [596.5, 600.6, "D", { seed: 1120, ropa: GENT(2), gola: true, gorro: "morion", expr: "sorpresa", bD: 150, cD: 40 }],
  [645.6, 649.4, "I", { seed: 1121, ropa: COLONO(1), expr: "triste", flaco: 0.3 }],
  [664.0, 669.5, "D", { seed: 1122, ropa: COLONO(0), expr: "miedo", flaco: 0.5 }],
  [674.1, 677.0, "I", { seed: 1123, ropa: GENT(3), gola: true, expr: "triste", flaco: 0.55 }],
  [695.7, 700.5, "I", { seed: 1124, ropa: COLONO(2), expr: "triste", flaco: 0.6, manoD: hatillo }],
  [700.7, 703.2, "D", { seed: 1125, ropa: COLONO(3), expr: "miedo", flaco: 0.6, manoD: pala }],
  [779.0, 784.0, "I", { seed: 1127, ropa: COLONO(1), expr: "triste", flaco: 0.5, manoD: hatillo }],
  [789.6, 795.2, "D", { seed: 1128, ropa: COLONO(0), expr: "triste", flaco: 0.5 }],
  [815.6, 819.3, "I", { seed: 1129, ropa: COLONO(2), expr: "feliz", flaco: 0.4, bD: 150, cD: 30 }],
  [860.6, 864.2, "D", { seed: 1131, ropa: COLONO(3), expr: "triste", flaco: 0.3 }],
];

export const Primer: React.FC<{ t: number }> = ({ t }) => {
  const e = E_.find(([a, b]) => t >= a && t < b);
  if (!e) return null;
  const [a, b, lado, p] = e;
  const sube = ent(t, a) * (1 - prog(t, b - 0.35, b));
  const x = lado === "I" ? 250 : 1670;
  const y = 1400 + (1 - sube) * 700 + Math.sin(t * 1.3) * 6;
  return <Persona {...p} x={x} y={y} h={1060} t={t} flip={lado === "D"} mira={lado === "I" ? 0.4 : -0.4} />;
};
