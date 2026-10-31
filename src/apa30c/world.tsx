// apa30 · el MUNDO del canal: la granja del almanaque en 3D (farm3d: huerta, granero, gallinero) con cámaras con nombre.
// world.json = {cams: [[t, "nombre"]...]} anclado a frases; entre paradas la cámara vuela en arco y dentro de cada parada deriva.
import React from "react";
import { FarmWorld, CAMS, camOf, camSpeed as cs } from "./farm3d";
import WJ from "./world.json";

type Stop = [number, string];
const ST = ((WJ as unknown as { cams: Stop[] }).cams ?? [[0, "g_wide"]]).filter((s) => CAMS[s[1]]) as Stop[];
export const camSpeed = (t: number) => cs(t, ST);
export const World: React.FC<{ t: number }> = ({ t }) => <FarmWorld t={t} cam={camOf(t, ST)} zone={0} />;
