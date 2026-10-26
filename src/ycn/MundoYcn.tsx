// Prueba de los sets de Hollis Lanes: un plano general por set (props: set, x, y, zoom, extra = props del set)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CapaSVG, Plano, mira } from "../anikit/camara";
import { PAL } from "./elenco";
import { Pistas } from "./sets/pistas";
import { CocinaYcn } from "./sets/cocina";
import { Freezer } from "./sets/freezer";
import { SalaPinsetters } from "./sets/pinsetters";
import { Fachada } from "./sets/fachada";
import { Personaje, pose } from "../anikit/personaje";
import { Biscuit } from "./perro";
import { NELL, CAL, DOT, RAFI, MARLON, ANA, GUS, RIM, zombi } from "./elenco";

export const SETS_YCN: Record<string, React.FC<any>> = { pistas: Pistas, cocina: CocinaYcn, freezer: Freezer, pinsetters: SalaPinsetters, fachada: Fachada };
export const MundoYcn: React.FC<{ set: string; x: number; y: number; zoom: number; extra?: Record<string, unknown> }> = ({ set, x, y, zoom, extra = {} }) => {
  const f = useCurrentFrame();
  const S = SETS_YCN[set];
  const sp = { f, pal: PAL, ...extra };
  return (
    <AbsoluteFill>
      <Plano claves={[mira(0, x, y, zoom)]} mano={0} fondo="#000">
        <CapaSVG z={0.25} desenfoqueMax={3}><S capa="lejos" {...sp} /></CapaSVG>
        <CapaSVG z={1}><S capa="medio" {...sp} />{extra.elenco ? <Elenco f={f} x0={x - 860} /> : null}{extra.perros ? <Perros f={f} x={x} /> : null}</CapaSVG>
        <CapaSVG z={1.4} desenfoqueMax={6}><S capa="frente" {...sp} /></CapaSVG>
      </Plano>
    </AbsoluteFill>
  );
};

// hoja del elenco parado en fila (para revisar looks): Nell, Rafi, Cal, Dot, Marlon, Ana, Gus, Gus zombi y Biscuit
const Elenco: React.FC<{ f: number; x0: number }> = ({ f, x0 }) => {
  const fila = [NELL, RAFI, CAL, DOT, MARLON, ANA, GUS, zombi(GUS)];
  const es = ["feliz", "neutral", "determinado", "risa", "picaro", "cansado", "triste", "zombi"];
  return (
    <g>
      {fila.map((l, i) => <Personaje key={i} x={x0 + 120 + i * 190} y={900} p={pose(i === 7 ? "zombi" : "parado")} e={es[i]} look={l} luz={RIM.liga} />)}
      <Biscuit f={f} ruta={[{ f: 0, x: x0 + 1600 }]} pose="sentado" luz={RIM.liga} />
    </g>
  );
};

// las 5 poses de Biscuit en fila + uno caminando (revisión)
const Perros: React.FC<{ f: number; x: number }> = ({ f, x }) => (
  <g>
    {(["parado", "sentado", "acostado", "olfatea", "aulla"] as const).map((p, i) => <Biscuit key={p} f={f} ruta={[{ f: 0, x: x - 700 + i * 300 }]} pose={p} luz={RIM.liga} />)}
    <Biscuit f={f} ruta={[{ f: 0, x: x - 700 }, { f: 300, x: x + 1500 }]} y={1040} luz={RIM.liga} />
  </g>
);
