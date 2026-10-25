// Prueba de sets: un plano general por set (props: set, x, y, zoom, paleta, variante)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CapaSVG, Plano } from "./camara";
import { PALETAS } from "./paletas";
import { CalleNoche } from "./sets/calle";
import { Cocina } from "./sets/cocina";
import { Supermercado } from "./sets/super";
import { Aula } from "./sets/aula";
import { Atardecer } from "./sets/atardecer";
import { Lab } from "./sets/lab";

const SETS: Record<string, React.FC<any>> = { calle: CalleNoche, cocina: Cocina, super: Supermercado, aula: Aula, atardecer: Atardecer, lab: Lab };
export const PruebaSets: React.FC<{ set: string; x: number; y: number; zoom: number; paleta: keyof typeof PALETAS; variante?: string }> = ({ set, x, y, zoom, paleta, variante }) => {
  const f = useCurrentFrame();
  const S = SETS[set];
  const pal = PALETAS[paleta];
  return (
    <AbsoluteFill>
      <Plano claves={[{ f: 0, x, y, zoom, foco: 1 }]} mano={0}>
        <CapaSVG z={set === "cocina" ? 0.85 : 0.25} desenfoqueMax={3}><S capa="lejos" f={f} pal={pal} variante={variante} /></CapaSVG>
        <CapaSVG z={1}><S capa="medio" f={f} pal={pal} variante={variante} /></CapaSVG>
        <CapaSVG z={1.4} desenfoqueMax={6}><S capa="frente" f={f} pal={pal} variante={variante} /></CapaSVG>
      </Plano>
    </AbsoluteFill>
  );
};
