import React from "react";
import { Composition, staticFile } from "remotion";
import { LayeredDepthScene } from "./LayeredHero";

export const RootLayers: React.FC = () => (
  <>
    <Composition
      id="DepthScene"
      component={LayeredDepthScene}
      durationInFrames={240}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        heroSrc: staticFile("epic/hero_house.png"),
        title: "IF YOU BOUGHT THAT HOUSE FOR $50,000",
        subtitle: "The math nobody showed you",
        accent: "#F2B33D",
        durationInFrames: 240,
      }}
    />
  </>
);
