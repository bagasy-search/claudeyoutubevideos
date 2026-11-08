// ap6na — despachador de las piezas únicas (u6a/u6b/u6c). Ninguna se repite en el video, con la tanda ni con apex01-07.
import React from "react";
import { AbsoluteFill } from "remotion";
import * as A from "./u6a";
import * as B from "./u6b";
import * as C from "./u6c";
const MAP: Record<string, React.FC<{ d: number; p: any }>> = { ...(A as any), ...(B as any), ...(C as any) };
export const Uniq: React.FC<{ n: string; d: number; p: any; o?: any }> = ({ n, d, p }) => {
  const X = MAP[n];
  if (!X) return <AbsoluteFill style={{ background: "#300" }} />;
  return <X d={d} p={p} />;
};
