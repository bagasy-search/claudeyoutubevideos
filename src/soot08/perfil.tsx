import React from "react";
import { C } from "./kit";
import { V } from "./kit3";
import { Pelusa } from "./kit3";

// ── LA MULA DE COSTADO (corte lateral): cabezal fijo a la izquierda, el carro sale a la derecha (u=1) y vuelve (u=0).
// Sirve para ver lo que la vista de frente esconde: los hilos que se estiran y el hueco BAJO el carro que se cierra.
export const MULA_X0 = -1050; // borde del cabezal
export const carroX = (u: number) => -880 + 1500 * u; // borde izquierdo del carro
export const MulaPerfil: React.FC<{ t: number; u: number; peligro?: number; children?: React.ReactNode }> = ({ t, u, peligro = 0, children }) => {
  const cx = carroX(u);
  return (
    <>
      <div style={{ position: "absolute", left: -2200, top: -1300, width: 4400, height: 1300, background: "linear-gradient(180deg, #e3c49c, #c9a27a)" }} />
      {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: -2000 + i * 720, top: -1150, width: 170, height: 480, borderRadius: 85, background: "#bfe0f2", opacity: 0.55, boxShadow: "inset 0 0 0 12px #c9a274" }} />)}
      {/* eje del techo con correa al cabezal */}
      <div style={{ position: "absolute", left: -2200, top: -1240, width: 4400, height: 30, background: V.hierro2 }} />
      <svg style={{ position: "absolute", left: -1300, top: -1240, overflow: "visible" }} width={10} height={10}>
        {[0, 60].map((dx, i) => <line key={i} x1={dx} y1={0} x2={dx + 40} y2={560} stroke="#6b3a1f" strokeWidth={18} strokeDasharray="30 18" strokeDashoffset={(i ? 1 : -1) * t * 300} />)}
      </svg>
      {/* pelusa acumulada en el piso, bajo el recorrido del carro */}
      <svg style={{ position: "absolute", left: -1000, top: -60, overflow: "visible" }} width={1700} height={60}>
        {Array.from({ length: 22 }, (_, i) => <ellipse key={i} cx={40 + i * 75} cy={52 - (i % 3) * 4} rx={46} ry={16 + (i % 4) * 4} fill={V.algodon} opacity={0.9} />)}
      </svg>
      {/* rieles */}
      <div style={{ position: "absolute", left: -1100, top: -24, width: 2900, height: 24, background: V.hierro2 }} />
      {/* cabezal */}
      <svg style={{ position: "absolute", left: -1450, top: -760, overflow: "visible" }} width={400} height={760}>
        <rect x={0} y={160} width={400} height={600} rx={16} fill={V.madera} />
        <rect x={0} y={160} width={400} height={40} rx={14} fill="#b27a42" />
        {[0, 1, 2].map((i) => <g key={i}><rect x={60 + i * 110} y={40} width={70} height={120} rx={24} fill={V.algodon} /><rect x={82 + i * 110} y={70} width={26} height={90} fill="#e3d9c4" /></g>)}
        {[0, 1, 2].map((i) => <circle key={`r${i}`} cx={380} cy={260 + i * 50} r={22} fill={V.hierro} />)}
      </svg>
      {/* hilos: del cabezal a la punta de los husos */}
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
        {Array.from({ length: 7 }, (_, i) => <line key={i} x1={MULA_X0} y1={-500 + i * 18} x2={cx + 30} y2={-470 + i * 4} stroke="#fffaf0" strokeWidth={5} opacity={0.95} />)}
      </svg>
      {/* carro */}
      <svg style={{ position: "absolute", left: cx, top: -520, overflow: "visible" }} width={300} height={520}>
        {Array.from({ length: 5 }, (_, i) => <g key={i}><rect x={20 + i * 50} y={0} width={12} height={120} fill={V.acero} /><ellipse cx={26 + i * 50} cy={70} rx={20} ry={44} fill={V.algodon} /></g>)}
        <rect x={0} y={110} width={300} height={110} rx={16} fill={V.madera} />
        <rect x={0} y={110} width={300} height={24} rx={12} fill="#c48a4c" />
        <rect x={20} y={220} width={30} height={250} fill={V.hierro2} />
        <rect x={250} y={220} width={30} height={250} fill={V.hierro2} />
        <circle cx={35} cy={478} r={34} fill={V.hierro} /><circle cx={265} cy={478} r={34} fill={V.hierro} />
      </svg>
      {/* la franja de peligro: el hueco entre cabezal y carro */}
      {peligro > 0 && (
        <div style={{ position: "absolute", left: MULA_X0, top: -300, width: Math.max(0, cx - MULA_X0), height: 300, background: `repeating-linear-gradient(45deg, rgba(232,59,74,${0.12 * peligro}) 0 30px, rgba(255,214,90,${0.08 * peligro}) 30px 60px)` }} />
      )}
      {children}
      <Pelusa t={t} x={-1400} y={-900} w={2800} h={850} n={50} seed={9} dens={0.7} />
      <div style={{ position: "absolute", left: -2200, top: 0, width: 4400, height: 500, background: V.piso2 }} />
      <div style={{ position: "absolute", left: -2200, top: 0, width: 4400, height: 24, background: V.piso }} />
      {/* nada ajeno: el color de alarma sólo cuando hay peligro */}
      {peligro > 0.5 && <div style={{ position: "absolute", left: -2200, top: -1300, width: 4400, height: 1800, background: C.rojo, opacity: (peligro - 0.5) * 0.12, pointerEvents: "none" }} />}
    </>
  );
};
