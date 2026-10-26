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
  // placas de dato (OJO v3: el molde cambia de paleta en cada dato; acá cortaban 40 s del mismo set)
  { a: 70.5, b: 71.9, l1: "PRISON WAS", l2: "A BUSINESS", fondo: "#7a4a0a", rayo: "#e8a23a", ico: "moneda", c1: C.crema, c2: C.oro },
  { a: 76.7, b: 78.1, l1: "BOUGHT. RENTED.", l2: "INHERITED.", fondo: "#14606a", rayo: "#3fa7a0", ico: "llave", c1: C.crema, c2: C.oro },
  { a: 190.3, b: 191.7, l1: "20 POUNDS", l2: "OF IRON", fondo: "#2c2f3a", rayo: "#6a7080", ico: "pesa", c1: C.crema, c2: C.rojo },
  { a: 271.85, b: 273.25, l1: "6 MONTHS", l2: "IN THE DARK", fondo: "#0e1838", rayo: "#2a3a7a", ico: "vela", c1: C.crema, c2: C.oro },
  { a: 299.1, b: 300.4, l1: "WESTMINSTER", l2: "1275", fondo: C.rojo, rayo: "#ff8a7a", ico: "pergamino", c1: C.crema, c2: C.oro },
  { a: 336.5, b: 337.9, l1: "MANY", l2: "CHOSE IT", fondo: "#4a0e1e", rayo: "#a8243f", ico: "pesa", c1: C.crema, c2: C.oro },
  { a: 462.15, b: 463.55, l1: "BUT THIS", l2: "WAS REAL", fondo: "#2a1460", rayo: "#7a5bd1", ico: "balde", c1: C.crema, c2: C.oro },
  { a: 517.0, b: 518.4, l1: "JAIL FEVER", fondo: "#2f5a12", rayo: "#8ac43a", ico: "piojo", c1: C.crema },
  { a: 552.45, b: 553.85, l1: "OXFORD", l2: "1577", fondo: "#8a6a3a", rayo: "#e8c88a", ico: "libro", c1: C.crema, c2: C.oro },
  { a: 639.95, b: 641.35, l1: "THE VICIOUS", l2: "CIRCLE", fondo: "#6a1030", rayo: "#c8344a", ico: "cadena", c1: C.crema, c2: C.oro },
  { a: 690.3, b: 691.7, l1: "LUDGATE", l2: "PAY = UPSTAIRS", fondo: "#14606a", rayo: "#3fa7a0", ico: "moneda", c1: C.crema, c2: C.oro },
  { a: 827.15, b: 829.0, l1: "3,000,000", l2: "CROWNS OF GOLD", fondo: "#7a4a0a", rayo: "#ffd24a", ico: "corona", c1: C.oro, c2: C.crema },
  { a: 857.8, b: 859.2, l1: "150,000", l2: "MARKS", fondo: "#7a4a0a", rayo: "#e8a23a", ico: "leon", c1: C.oro, c2: C.crema },
  { a: 871.0, b: 872.4, l1: "NOT EVEN", l2: "4 PENNIES", fondo: C.rojo, rayo: "#ff8a7a", ico: "moneda", c1: C.crema, c2: C.oro },
  { a: 909.35, b: 912.25, l1: "NEXT TIME:", l2: "ONE NIGHT IN A MEDIEVAL CASTLE", fondo: "#14606a", rayo: "#3fa7a0", ico: "vela", c1: C.crema, c2: C.oro },
];
// tamaño que entra en 1600 px (ancho medido de la letra ≈ 0,74 em + contorno)
const cabe = (txt: string, max: number) => Math.min(max, 1600 / (txt.length * 0.74));
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
      <Grande t={t} t0={g.a + 0.05} text={g.l1} y={largo ? 520 : 560} size={cabe(g.l1, largo ? 120 : 170)} color={g.c1} />
      {g.l2 && <Grande t={t} t0={g.a + 0.35} text={g.l2} y={largo ? 700 : 770} size={cabe(g.l2, largo ? 92 : 130)} color={g.c2} />}
    </AbsoluteFill>
  );
};
