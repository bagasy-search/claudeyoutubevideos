import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CUES } from "./cues_moho2.gen";
import { AVATAR_WINDOWS } from "./avatar_moho2.gen";

// GENERADO por build_moho.mjs — no editar a mano.
export const FPS = 30;
export const TOTAL_MOHO2 = 55854;
const XF = 12;

/** Foto fija de Tomás: el piso de la capa base. Nunca queda fondo muerto. */
const StillBase: React.FC = () => {
  const f = useCurrentFrame();
  const push = interpolate(f % 900, [0, 900], [1.03, 1.08]);
  return (
    <AbsoluteFill style={{ background: "#171310", overflow: "hidden" }}>
      <Img src={staticFile("ref_moho.png")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${push})` }} />
    </AbsoluteFill>
  );
};

/** Capa base garantizada: el avatar hablando. Cada ventana monta su propio clip en
 *  su Sequence, así el video arranca en su frame 0 y queda sincronizado con el tramo
 *  de audio del que se generó. Si el clip todavía no existe, abajo está la foto. */
const AvatarBase: React.FC = () => (
  <AbsoluteFill style={{ background: "#171310", overflow: "hidden" }}>
    <StillBase />
    {AVATAR_WINDOWS.map((w, i) =>
      w.clip ? (
        <Sequence key={`av${i}`} from={w.fromF} durationInFrames={w.durF} layout="none">
          <AbsoluteFill style={{ overflow: "hidden" }}>
            <OffthreadVideo src={staticFile(w.clip)} muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
        </Sequence>
      ) : null,
    )}
  </AbsoluteFill>
);

const Layer: React.FC<{ fade: boolean; z: number; children: React.ReactNode }> = ({ fade, z, children }) => {
  const f = useCurrentFrame();
  const op = fade ? interpolate(f, [0, XF], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  return <AbsoluteFill style={{ opacity: op, zIndex: z }}>{children}</AbsoluteFill>;
};

export const Main_moho2: React.FC = () => (
  <AbsoluteFill style={{ background: "#171310" }}>
    <Audio src={staticFile("moho2.wav")} volume={1} />
    <AvatarBase />
    {CUES.map((c) => (
      <Sequence key={c.key} from={Math.round(c.start * FPS)} durationInFrames={Math.round(c.dur * FPS)} layout="none">
        <Layer fade={c.fade} z={c.z}>{c.el(Math.round(c.dur * FPS))}</Layer>
        {c.sfx ? (
          <Sequence from={0} durationInFrames={40} layout="none">
            <Audio src={staticFile(c.sfx)} volume={0.3} />
          </Sequence>
        ) : null}
      </Sequence>
    ))}
  </AbsoluteFill>
);
