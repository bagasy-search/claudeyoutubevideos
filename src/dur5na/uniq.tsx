// dur5na — despachador de las piezas únicas (u5a/u5b/u5c). Ninguna se repite en el video ni con los dur29.
import React from "react";
import { AbsoluteFill } from "remotion";
import * as A from "./u5a";
import * as B from "./u5b";
import * as C from "./u5c";
const MAP: Record<string, React.FC<{ d: number; p: any }>> = { ...(A as any), ...(B as any), ...(C as any) };
export const Uniq: React.FC<{ n: string; d: number; p: any; o?: any }> = ({ n, d, p }) => {
  const X = MAP[n];
  if (!X) return <AbsoluteFill style={{ background: "#300" }} />;
  return <X d={d} p={p} />;
};
