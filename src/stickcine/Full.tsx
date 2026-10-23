import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as oswald } from "@remotion/google-fonts/Oswald";
import { loadFont as caveat } from "@remotion/google-fonts/Caveat";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { FPS, suave } from "./lib";
import { Exterior } from "./Exterior";
import { Cafe } from "./Cafe";
import { Ring } from "./Ring";

oswald("normal", { weights: ["700"], subsets: ["latin"] });
caveat("normal", { weights: ["400"], subsets: ["latin"] });

export const DUR = 1873; // 62,43 s = la voz entera

// tramos con fundido cruzado (cada escena sólo se dibuja mientras se ve)
const EXT_FIN = [7.35, 7.8] as const;
const RING_IN = [36.9, 37.5] as const;
const RING_OUT = [42.7, 43.1] as const;

export const Full: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const opCafe = suave(t, EXT_FIN[0], EXT_FIN[1]);
  const opRing = suave(t, RING_IN[0], RING_IN[1]) * (1 - suave(t, RING_OUT[0], RING_OUT[1]));
  const fin = 1 - suave(t, 61.6, 62.4);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ opacity: fin }}>
        <CamaraMano intensidad={1.1} seed={3}>
          {t < EXT_FIN[1] && <Exterior t={t} />}
          {opCafe > 0.001 && opRing < 0.999 && (
            <AbsoluteFill style={{ opacity: Math.min(1, opCafe) }}>
              <Cafe t={t} />
            </AbsoluteFill>
          )}
          {opRing > 0.001 && (
            <AbsoluteFill style={{ opacity: opRing }}>
              {/* recuerdo: un poco más frío y contrastado */}
              <AbsoluteFill style={{ filter: "saturate(0.75) contrast(1.08)" }}>
                <Ring t={t} />
              </AbsoluteFill>
            </AbsoluteFill>
          )}
        </CamaraMano>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
