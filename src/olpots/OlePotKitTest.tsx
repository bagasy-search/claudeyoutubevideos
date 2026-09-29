import React from "react";
import { AbsoluteFill } from "remotion";
import { OlePotShelf3D } from "./OlePotShelf3D";
import { OleCoalOven3D } from "./OleCoalOven3D";
import { OleHeatSpreadMap } from "./OleHeatSpreadMap";
export const POT_KIT_FRAMES = 300;
export const HEAT_KIT_FRAMES = 240;
export const COAL_KIT_FRAMES = 300;
export const OleCoalKitTest: React.FC = () => <OleCoalOven3D labels={{ top: "on the lid", bottom: "underneath", temp: "≈ 350°F", turn: "quarter turn every 15 minutes", rule: "12-INCH OVEN · 24 BRIQUETTES" }} />;
export const OleHeatKitTest: React.FC = () => (
  <OleHeatSpreadMap kicker="WHERE THE FLAME GOES" footer="ILLUSTRATION · relative heat, not measured" pots={[
    { label: "Thin aluminum", sub: "hot spot", layers: [{ name: "al", color: "#b8bcc2", thick: 0.06 }], spread: 0.55, peak: 0.95, slow: 2.5, verdict: "bad", note: "scorches over the flame" },
    { label: "Thin stainless", sub: "hot spot", layers: [{ name: "ss", color: "#8f959b", thick: 0.05 }], spread: 0.38, peak: 1.0, slow: 5, verdict: "bad", note: "burns in one spot" },
    { label: "Thick-base stainless", sub: "aluminum core", layers: [{ name: "ss", color: "#9aa1a8", thick: 0.05 }, { name: "al", color: "#d4d8dc", thick: 0.22 }, { name: "ss", color: "#9aa1a8", thick: 0.05 }], spread: 1.6, peak: 0.1, slow: 2.6, verdict: "ok", note: "spreads it out" },
    { label: "Cast iron", sub: "holds it", layers: [{ name: "fe", color: "#6a655e", thick: 0.32 }], spread: 1.7, peak: 0.05, slow: 4.5, verdict: "ok", note: "slow to start, steady" },
  ]} />
);
export const OlePotKitTest: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#E9D9B8" }}>
    <OlePotShelf3D tags={["1","2","3","4","5"]}
      focus={[{ at: 3.2, pot: 2 }]}
      specs={[{ pot: 2, kicker: "POT 3", title: "Enamel stockpot", lines: ["Steel with glass fused on", "12 qt or bigger", "The pot for a crowd"] }]}
      stamps={[{ at: 6, pot: 2, kind: "buy" }, { at: 7, pot: 4, kind: "skip" }]} />
  </AbsoluteFill>
);
