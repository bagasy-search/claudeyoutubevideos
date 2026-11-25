import React from "react";
import { Composition } from "remotion";
import { Bea, FPS, OFF, Plan } from "./Bea";
import planes from "../public/planes.json";
const P = planes as unknown as Record<string, Plan>;
export const Root: React.FC = () => (
  <>
    {Object.keys(P).map((slug) => (
      <Composition key={slug} id={slug} component={Bea as any} durationInFrames={Math.round((P[slug].T - OFF) * FPS)} fps={FPS} width={720} height={1280} defaultProps={{ plan: P[slug], slug }} />
    ))}
  </>
);
