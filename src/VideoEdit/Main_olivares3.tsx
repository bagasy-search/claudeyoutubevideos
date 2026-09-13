// Main_olivares3.tsx — GENERADO por build_olivares3.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Img, Loop, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS, TOTAL_FRAMES_OLIVARES3, AVATAR_FRAMES_OLIVARES3 } from "./cues_olivares3.gen";
import { OlivAvatar } from "../olivares3/Piezas";

export const MainOlivares3: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0C1412" }}>
    {/* L0 · avatar PARCIAL en bucle: 1a iteracion = tramo1 (lipsync real, 0..673s);
        luego se repite para el tramo2. Es el fondo garantizado (nunca negro).
        OffthreadVideo SIEMPRE (dentro de OlivAvatar). */}
    <Loop durationInFrames={AVATAR_FRAMES_OLIVARES3}>
      <OlivAvatar src="olivares3_opt.mp4" />
    </Loop>

    {/* L1 · b-roll opaco encima */}
    {CUES.map((c) => (
      <Sequence key={c.key} from={c.from} durationInFrames={c.dur} layout="none">
        <AbsoluteFill>{c.el()}</AbsoluteFill>
      </Sequence>
    ))}

    {/* L2 · componentes del kit con su CAMA de foto debajo */}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={o.from} durationInFrames={o.dur} layout="none">
        <AbsoluteFill>
          <Img src={staticFile(o.cama)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {o.el(o.dur)}
        </AbsoluteFill>
      </Sequence>
    ))}

    <Audio src={staticFile("olivares3.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_OLIVARES3 };
