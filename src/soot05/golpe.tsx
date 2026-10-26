import React from "react";
import { AbsoluteFill } from "remotion";
import { C, ent, prog, Rayos, Grande } from "./kit";
import { Ico, IcoK } from "./iconos";

// Golpes a pantalla llena (OJO director vuelta 1: «sin los golpes de color del video 1»): fondo plano con rayos,
// texto enorme y un ícono que rebota. Entra y sale en 0,15 s para no romper el plano continuo.
type Golpe = { a: number; b: number; l1: string; l2?: string; fondo: string; rayo: string; ico?: IcoK; c1?: string; c2?: string };
const G: Golpe[] = [
  { a: 32.3, b: 33.85, l1: "INNOCENT.", l2: "STILL PAYING.", fondo: C.rojo, rayo: "#ff8a7a", ico: "moneda", c1: C.crema, c2: C.oro },
  { a: 45.95, b: 47.2, l1: "7 TRAPS", l2: "BEHIND ONE DOOR", fondo: "#2a1460", rayo: "#7a5bd1", ico: "llave", c1: C.oro, c2: C.crema },
  { a: 909.35, b: 912.25, l1: "NEXT TIME:", l2: "ONE NIGHT IN A MEDIEVAL CASTLE", fondo: "#14606a", rayo: "#3fa7a0", ico: "vela", c1: C.crema, c2: C.oro },
];
export const Golpes: React.FC<{ t: number }> = ({ t }) => {
  const g = G.find((x) => t >= x.a && t < x.b + 0.15);
  if (!g) return null;
  const op = Math.min(prog(t, g.a, g.a + 0.12), 1 - prog(t, g.b, g.b + 0.15));
  const zoom = 1.08 - 0.08 * ent(t, g.a, 0, { damping: 14, stiffness: 160 }) + (t - g.a) * 0.02;
  const largo = (g.l2 ?? "").length > 18;
  return (
    <AbsoluteFill style={{ opacity: op, background: g.fondo, transform: `scale(${zoom})` }}>
      <Rayos t={t} x={960} y={560} color={g.rayo} n={18} op={0.45} largo={1500} />
      {g.ico && (
        <div style={{ position: "absolute", left: 960 - 130, top: 120 + Math.sin((t - g.a) * 7) * 10, width: 260, transform: `scale(${ent(t, g.a + 0.1)}) rotate(${Math.sin((t - g.a) * 5) * 8}deg)` }}>
          <Ico k={g.ico} s={260} />
        </div>
      )}
      <Grande t={t} t0={g.a + 0.05} text={g.l1} y={largo ? 520 : 560} size={largo ? 120 : 170} color={g.c1} />
      {g.l2 && <Grande t={t} t0={g.a + 0.35} text={g.l2} y={largo ? 700 : 770} size={largo ? 92 : 130} color={g.c2} />}
    </AbsoluteFill>
  );
};
