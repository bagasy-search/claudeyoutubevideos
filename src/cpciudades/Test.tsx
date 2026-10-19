// cpciudades · banco de prueba: muestra un componente de dis.tsx solo (para stills de revisión).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import * as D from "./dis";
import { GeoFly } from "./GeoFly";
export const Test: React.FC<{ n: string; p: Record<string, any> }> = ({ n, p }) => {
  const t = useCurrentFrame() / FPS;
  if (n === "GeoFly") return <GeoFly t={t} {...(p as any)} />;
  const C = (D as any)[n] as React.FC<any>;
  return <AbsoluteFill style={{ background: "#334" }}><C t={t} a={0} b={8} {...p} /></AbsoluteFill>;
};
