import React from "react";
import { AbsoluteFill } from "remotion";
import * as A from "./u8a";
import * as B from "./u8b";
const MAP: Record<string, React.FC<{ d: number; p: any }>> = { ...(A as any), ...(B as any),  };
export const Uniq: React.FC<{ n: string; d: number; p: any; o?: any }> = ({ n, d, p }) => {
  const X = MAP[n];
  if (!X) return <AbsoluteFill style={{ background: "#300" }} />;
  return <X d={d} p={p} />;
};
