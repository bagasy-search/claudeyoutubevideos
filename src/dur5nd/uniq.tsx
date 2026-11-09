// dur5nd — despachador de las piezas únicas (d8a/d8b/d8c). Ninguna se repite en el video ni con los dur29.
import React from "react";
import { AbsoluteFill } from "remotion";
import * as A from "./d8a";
import * as B from "./d8b";
import * as C from "./d8c";
const MAP: Record<string, React.FC<{ d: number; p: any }>> = { ...(A as any), ...(B as any), ...(C as any) };
export const Uniq: React.FC<{ n: string; d: number; p: any; o?: any }> = ({ n, d, p }) => {
  const X = MAP[n];
  if (!X) return <AbsoluteFill style={{ background: "#300" }} />;
  return <X d={d} p={p} />;
};
