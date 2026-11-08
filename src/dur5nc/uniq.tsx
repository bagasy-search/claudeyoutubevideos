// dur5nc — despachador de las piezas únicas (u7a/u7b/u7c). Ninguna se repite en el video ni con los dur29/dur5na.
import React from "react";
import { AbsoluteFill } from "remotion";
import * as A from "./u7a";
import * as B from "./u7b";
import * as C from "./u7c";
const MAP: Record<string, React.FC<{ d: number; p: any }>> = { ...(A as any), ...(B as any), ...(C as any) };
export const Uniq: React.FC<{ n: string; d: number; p: any; o?: any }> = ({ n, d, p }) => {
  const X = MAP[n];
  if (!X) return <AbsoluteFill style={{ background: "#300" }} />;
  return <X d={d} p={p} />;
};
