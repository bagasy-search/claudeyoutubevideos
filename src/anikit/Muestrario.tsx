// Muestrario del kit: poses, expresiones y estilos (para revisar el personaje con stills)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EXPRESIONES, LOOKS, Look, Personaje, caminar, pose, POSES } from "./personaje";
import { Halo } from "./luz";
import { Walkie } from "./props";
import { Contador, EtiquetaFlotante, RelojDia } from "./pantalla";

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

// Muestrario de looks pedidos por los canales (A zombi / B What If) + etiqueta flotante y reloj del día
export const MuestrarioLooks: React.FC = () => {
  const luz = { lado: 1 as const, color: "#ffc982" };
  const looks: [Look, string, number?][] = [
    [{ estilo: "palo", camisa: "#f2c230", manga: "larga", pantalon: "#3a4a5a", zapatos: "#e2483a", alto: 0.74, accesorios: [{ t: "capucha", color: "#e6b422" }, { t: "trenzas", color: "#3a2416" }] }, "neutral"],
    [{ estilo: "palo", camisa: "#4f7fb0", manga: "larga", pantalon: "#3a3550", accesorios: [{ t: "parche", color: "#e2483a" }, { t: "pelo", forma: "corto", color: "#17100d" }] }, "cansado"],
    [{ estilo: "palo", camisa: "#e9e3d6", pantalon: "#3a3550", accesorios: [{ t: "delantal", color: "#3f9a55" }, { t: "gorroPapel", color: "#f4f1ea" }, { t: "auriculares", color: "#2a2622" }] }, "feliz"],
    [{ estilo: "palo", camisa: "#ff8fb8", pantalon: "#5a4a6a", accesorios: [{ t: "pelo", forma: "bob", color: "#d9d4cb" }, { t: "lentes", forma: "gato", color: "#ff3fa4" }] }, "picaro"],
    [{ estilo: "palo", camisa: "#2c3e6a", manga: "larga", pantalon: "#2c3e6a", accesorios: [{ t: "corbata", color: "#c23a2e", suelta: true }, { t: "pelo", forma: "corto", color: "#3a2a1e" }] }, "duda"],
    [{ estilo: "zombi", camisa: "#4f7fb0", manga: "larga", pantalon: "#3b4250", accesorios: [{ t: "parche", color: "#e2483a" }] }, "zombi"],
    [{ estilo: "palo", camisa: "#a8d4f0", pantalon: "#2a3448", accesorios: [{ t: "chaleco", color: "#22305a" }, { t: "gorra", color: "#22305a", placa: "#e8c24a" }] }, "determinado"],
    [{ estilo: "frijol", camisa: "#a8743c", piel: "#c8945a", alto: 0.7, accesorios: [{ t: "orejas", color: "#7a4a24" }] }, "triste"],
  ];
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#2a3040, #4a3a3a)" }}>
      <svg width={1920} height={1080} style={{ overflow: "visible" }}>
        <Halo x={960} y={400} r={900} color="#ffb060" fuerza={0.25} />
        {looks.map(([l, e], i) => (
          <Personaje key={i} x={150 + i * 230} y={900} escala={1.1} p={l.estilo === "zombi" ? pose("zombi") : pose("parado")} e={e} look={l} luz={luz}
            enManoD={i === 0 ? <Walkie s={1.3} luz /> : undefined} />
        ))}
      </svg>
      <EtiquetaFlotante x={1530} y={470} rotulo="REAL AGE" claves={[{ f: 0, v: 52 }, { f: 10, v: 38, d: 30 }]} />
      <Contador lineas={[{ etiqueta: "PARTICIPANTS", claves: "47/47", color: "#7dff6a" }]} />
      <RelojDia min={5 * 60 + 12} />
    </AbsoluteFill>
  );
};
