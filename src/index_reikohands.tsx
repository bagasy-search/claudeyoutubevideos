import React from "react";
import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from "remotion";
import { HandsWorld, sceneOf } from "./reikohands/hands3d";
import { Img, staticFile } from "remotion";
import { Polaroids, Notes, RedRing } from "./reikohands/papel";
import { Full, FULL_FRAMES } from "./reikohands/Full";
// prueba del mundo: una escena por props (sólo stills locales)
const WorldTest: React.FC<{ name: string; u: number }> = ({ name, u }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000" }}><HandsWorld t={u + f / 30} sc={sceneOf(name, u + f / 30)} /></AbsoluteFill>;
};
const PapelTest: React.FC<{ k: number }> = ({ k }) => {
  const t = 3 + useCurrentFrame() / 30;
  const L = ["Lukewarm water", "Cotton under rubber", "Pat, never rub", "One pearl of cream", "Sunscreen on the backs", "Never cut cuticles", "Hot oshibori", "Night gloves"];
  return <AbsoluteFill><Img src={staticFile("reikohands/_test_bg.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    {k === 0 && <Polaroids t={t} items={L.map((l, i) => ({ at: 0.2 * i, img: `reikohands/pol_${i + 1}.jpg`, label: l }))} out={99} hi={3} />}
    {k === 1 && <><Notes t={t} title="THE ONE-MINUTE RULE" rows={[{ at: 0, txt: "Pat the backs dry" }, { at: 0.5, txt: "Between the fingers" }, { at: 1, txt: "Cream within 60 seconds" }]} out={99} />
      <RedRing t={t} at={0} out={99} x={760} y={560} note="the backs dry first" /></>}
  </AbsoluteFill>;
};
const Root = () => (
  <>
    <Composition id="PapelTest" component={PapelTest} durationInFrames={30} fps={30} width={1920} height={1080} defaultProps={{ k: 0 }} />
    <Composition id="HandsWorld" component={WorldTest} durationInFrames={30} fps={30} width={1920} height={1080} defaultProps={{ name: "wide", u: 3 }} />
    <Composition id="ReikohandsFull" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
