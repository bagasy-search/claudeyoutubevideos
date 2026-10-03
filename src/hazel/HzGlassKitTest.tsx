// Prueba local de los componentes nuevos del video del cristal (Hazel #2).
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { HzBowl3D } from "./HzBowl3D";
import { HzRingWave, HzEdgeCompare, HzEraStrip } from "./HzGlassTests";
const D = 150;
const ITEMS: React.ReactNode[] = [<HzBowl3D sign="Libbey" signAt={60} verdict="signed" />, <HzRingWave />, <HzEdgeCompare />, <HzEraStrip />];
export const GLASS_TEST_FRAMES = ITEMS.length * D;
export const HzGlassKitTest: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#E9D4A0" }}>{ITEMS.map((el, i) => <Sequence key={i} from={i * D} durationInFrames={D}>{el}</Sequence>)}</AbsoluteFill>;
