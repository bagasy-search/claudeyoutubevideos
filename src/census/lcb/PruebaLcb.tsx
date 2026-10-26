// Comp de revisión de los sets de lc-b (stills): set + encuadre + props del set por defaultProps.
import React from "react";
import { AbsoluteFill } from "remotion";
import { mira } from "../../anikit/camara";
import { Escena } from "../../anikit/escena";
import { PAL } from "../elenco";
import { Granja } from "./granja";
import { Lakewood } from "./lakewood";
import { Represa } from "./represa";
import { Cuesta, Subsuelo } from "./subsuelo";
import { Visitantes } from "./visitantes";
import { Barrio, Living } from "../mundo/casa";
import { Lobby, StMarys } from "../mundo/hospital";
import { Panorama } from "../mundo/panorama";
import { CanalPark, Puente } from "../mundo/puente";
import { Superior } from "../mundo/superior";

const SETS: Record<string, React.FC<any>> = { granja: Granja, visitantes: Visitantes, lakewood: Lakewood, represa: Represa, subsuelo: Subsuelo, cuesta: Cuesta, panorama: Panorama, superior: Superior, puente: Puente, canal: CanalPark, stmarys: StMarys, lobby: Lobby, barrio: Barrio, living: Living };

export const PruebaLcb: React.FC<{ set: string; x: number; y: number; zoom: number; sp?: Record<string, unknown> }> = ({ set, x, y, zoom, sp = {} }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Escena Set={SETS[set]} pal={PAL} setProps={sp} claves={[mira(0, x, y, zoom)]} mano={0} />
  </AbsoluteFill>
);
