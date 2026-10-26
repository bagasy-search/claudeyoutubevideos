// Comp de revisión de los sets de lc-c (stills): props { set, x, y, zoom, sp }
import React from "react";
import { mira, useF } from "../../anikit/camara";
import { Escena } from "../../anikit/escena";
import { PAL } from "../elenco";
import { Farmacia, GranjaLiving, RadioGus, Granero, Mural } from "./sets5";

const SETS: Record<string, React.FC<any>> = { farmacia: Farmacia, living: GranjaLiving, radio: RadioGus, granero: Granero, mural: Mural };
export const PruebaLcc: React.FC<{ set: string; x: number; y: number; zoom: number; sp: Record<string, unknown> }> = ({ set, x, y, zoom, sp }) => (
  <Escena Set={SETS[set]} pal={PAL} setProps={sp} claves={[mira(0, x, y, zoom)]} mano={0} />
);
