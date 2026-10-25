// Muestrario del kit: poses, expresiones y estilos (para revisar el personaje con stills)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EXPRESIONES, LOOKS, Look, Personaje, caminar, pose, POSES } from "./personaje";
import { Halo } from "./luz";

const fila = (y: number, items: React.ReactNode[]) => items.map((it, i) => <g key={i}>{it}</g>);
export const Muestrario: React.FC = () => {
  const f = useCurrentFrame();
  const luz = { lado: 1 as const, color: "#ffc982" };
  const exprs = Object.keys(EXPRESIONES);
  const poses = ["parado", "caminar", "correr", "sentado", "arrodillado", "agacharse", "señalar", "celebrar", "celular", "empujar", "tirarCarga", "brazosCruzados"];
  const looks: Look[] = [
    LOOKS.awakenBlanco, LOOKS.awakenNaranja, LOOKS.awakenGorra, LOOKS.monk, LOOKS.demonio,
    { estilo: "zombi", camisa: "#5b6b5e", pantalon: "#3b4250" },
    { estilo: "palo", camisa: "#2f9e6b", accesorios: [{ t: "pelo", forma: "punta", color: "#17100d" }] },
    { estilo: "frijol", camisa: "#3f5b45", accesorios: [{ t: "pelo", forma: "bob", color: "#201a18" }, { t: "bufanda", color: "#e9a92c" }] },
    { estilo: "frijol", camisa: "#7a5a3c", accesorios: [{ t: "barba", color: "#d9d4cb" }, { t: "pelo", forma: "calvo", color: "#000" }] },
    { estilo: "palo", camisa: "#f4f1ea", manga: "larga", accesorios: [{ t: "bata", color: "#fff" }, { t: "lentes" }] },
  ];
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#3a2a2a, #6b3f2a)" }}>
      <svg width={1920} height={1080} style={{ overflow: "visible" }}>
        <Halo x={960} y={300} r={900} color="#ffb060" fuerza={0.3} />
        {fila(0, exprs.map((e, i) => <Personaje key={e} x={80 + i * 150} y={330} escala={0.62} p={pose("parado")} e={e} look={i % 2 ? LOOKS.monk : LOOKS.awakenBlanco} luz={luz} />))}
        {fila(1, poses.map((n, i) => {
          const p = n === "caminar" ? caminar(0.15) : n === "correr" ? caminar(0.2, 1) : pose(n);
          return <Personaje key={n} x={80 + i * 150} y={680} escala={0.62} p={p} e="neutral" asiento={n === "sentado" ? 60 : undefined} look={LOOKS.awakenNaranja} luz={luz} />;
        }))}
        {fila(2, looks.map((l, i) => <Personaje key={i} x={110 + i * 180} y={1040} escala={0.7} p={i === 5 ? pose("zombi") : pose("parado")} e={i === 5 ? "zombi" : ["feliz", "sorpresa", "picaro", "cansado", "picaro", "zombi", "determinado", "triste", "neutral", "duda"][i]} look={l} luz={luz} />))}
      </svg>
    </AbsoluteFill>
  );
};
