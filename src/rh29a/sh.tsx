// rh29a · registro de los componentes únicos (heroes.json → k): todos en modo «solo» (foto real a cuadro completo + palabra héroe, hkit).
import React from "react";
import { H, Stage } from "./hkit";

const Solo: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{() => null}</Stage>;
export const HC: Record<string, React.FC<{ t: number; h: H }>> = new Proxy({}, { get: () => Solo });
export const COMMENTS: { n: string; from: string; txt: string }[] = [];
