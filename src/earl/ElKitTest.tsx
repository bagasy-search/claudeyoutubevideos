// Prueba del kit Earl (cada componente, incluidos los dos 3D) antes del video entero. Sin assets externos.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ElBag3D } from "./ElBag3D";
import { ElCO3D } from "./ElCO3D";
import { ElCoolerBoard, ElIngredients, ElClipping, ElNineOfTen, ElCountSize, ElBoatLog, ElSeason, ElLabelLine, ElNameTag, ElAsk, ElSubscribe } from "./ElBoards";

const D = 150;
const ITEMS: React.ReactNode[] = [
  <ElBag3D lines={["Ingredients: shrimp, water, salt,", "sodium tripolyphosphate (to retain moisture).", "Contains: shellfish (shrimp).", "Packed for Coastal Catch, Gulfport, MS", "Product of India · Farm Raised"]} hi={[4]} zoom="Product of India · Farm Raised" verdict="not Gulf" flipAt={20} />,
  <ElCO3D cAt={10} oAt={80} />,
  <ElCoolerBoard title="this summer · per pound" rows={[{ item: "at the dock, heads on", price: "$3–4" }, { item: "at the store, peeled", price: "$12–16", hi: true }]} every={30} stamp="that's it" />,
  <ElIngredients items={["Shrimp", "water", "salt", "sodium tripolyphosphate (to retain moisture)"]} bad={3} />,
  <ElClipping kicker="GULF COAST · SHRIMP TESTING" headline="Restaurants tested in Biloxi:" big="8 of 10" sub="were serving imported farm-raised shrimp" />,
  <ElNineOfTen />,
  <ElCountSize counts={[{ c: "16/20", note: "16 to 20 shrimp in a pound" }, { c: "21/25", note: "21 to 25 · smaller number, bigger shrimp" }]} every={20} />,
  <ElBoatLog rows={[{ t: "3:30 pm", what: "leave the harbor" }, { t: "6:00 pm", what: "past the islands, nets down" }, { t: "10:00 pm", what: "first pull · sort on deck" }, { t: "6:30 am", what: "headed home on ice" }]} every={15} />,
  <ElSeason seasons={[{ name: "brown shrimp", from: 4, to: 6, color: "#8C5A36" }, { name: "white shrimp", from: 7, to: 11, color: "#7FA9BD" }, { name: "pink shrimp (Florida)", from: 0, to: 2, color: "#E07A8A" }]} now={9} />,
  <ElLabelLine n="1" line="Product of India" means="the country" />,
];
export const KIT_TEST_FRAMES = ITEMS.length * D;
export const ElKitTest: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#1E3A5F" }}>
    {ITEMS.map((el, i) => <Sequence key={i} from={i * D} durationInFrames={D}>{el}</Sequence>)}
    <Sequence from={2 * D} durationInFrames={D}><ElNameTag /></Sequence>
    <Sequence from={3 * D} durationInFrames={D}><ElAsk question="What does the bag in YOUR freezer say?" /></Sequence>
    <Sequence from={4 * D} durationInFrames={D}><ElSubscribe /></Sequence>
  </AbsoluteFill>
);
