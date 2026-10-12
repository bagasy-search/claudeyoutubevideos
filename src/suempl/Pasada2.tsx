// suempl · PASADA 2 = Full (tal cual, commit 1af33df) + capa de fotos de Claudio en tiempos absolutos.
import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { fr } from "../repkit/Rk";
import { Full } from "./Full";
import fotos from "./fotos_pasada2.json";

type Foto = { t_ini: number; t_fin: number; file: string; cara: boolean };
const FOTOS = fotos as unknown as Foto[];

export const Pasada2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Full />
    {FOTOS.map((f) => (
      <Sequence key={f.file} from={fr(f.t_ini)} durationInFrames={fr(f.t_fin - f.t_ini)}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)" }}>
          <Img src={staticFile(f.file)} style={{ width: "75%", transform: "rotate(-1deg)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }} />
        </AbsoluteFill>
      </Sequence>
    ))}
  </AbsoluteFill>
);
