import React from "react";
import { Composition, staticFile } from "remotion";
import { EpicAvatar } from "./EpicAvatar";

// Root MÍNIMO — test del componente épico generado por Kimi K3. Aislado.
export const RootEpic: React.FC = () => (
  <>
    <Composition
      id="EpicAvatar"
      component={EpicAvatar}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        bgSrc: staticFile("epic/bg.png"),
        avatarSrc: staticFile("epic/avatar.png"),
        logoSrc: staticFile("epic/logo.png"),
        posterSrc: staticFile("epic/poster.png"),
        title: "LEYENDA",
        kicker: "TEMPORADA 01 — EL DESPERTAR",
        subtitle: "EL JUEGO EMPIEZA AHORA",
        accent: "#FFB84D",
        accent2: "#38E1FF",
      }}
    />
  </>
);
