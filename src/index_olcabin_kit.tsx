// Banco de prueba del kit olcabin (stills de control antes del video). ENTRY=src/index_olcabin_kit.tsx
import React from "react";
import { registerRoot, Composition } from "remotion";
import { CabinCutaway3D } from "./olcabin/CabinCutaway3D";
import { TinRecipeBox3D } from "./olcabin/TinRecipeBox3D";
import { CabinRecipeBook3D } from "./olcabin/CabinRecipeBook3D";
import { RecipeCountdown, GrandmaCard, OriginMap, WhyTheyStopped } from "./olcabin/CabinCards";

const C = (id: string, component: React.FC, d = 300) => <Composition key={id} id={id} component={component} durationInFrames={d} fps={30} width={1920} height={1080} />;
const Root = () => (
  <>
    {C("KitCutaway", () => <CabinCutaway3D fill={[{ at: 0.5, n: 0 }, { at: 9, n: 25 }]} />, 300)}
    {C("KitBox", () => <TinRecipeBox3D cards={[["Grandma's box", "25 dishes", "north woods"]]} />, 150)}
    {C("KitBook", () => <CabinRecipeBook3D pages={[{ title: "Lefse", lines: ["5 lb russets", "riced while hot", "chill overnight"], note: "cold!" }, { title: "Pasty", lines: ["beef, potato", "rutabaga, onion", "lard crust"], note: "D shape" }, { title: "Booyah", lines: ["hen + shank", "3 hours slow"], note: "big kettle" }]} flips={2} />, 150)}
    {C("KitCountdown", () => <div style={{ width: 1920, height: 1080, background: "#B98C5A" }}><RecipeCountdown n={18} name="Rice porridge" /></div>, 90)}
    {C("KitCard", () => <div style={{ width: 1920, height: 1080, background: "#B98C5A" }}><GrandmaCard title="Fattigmann" lines={["yolks, cream, sugar", "a splash of brandy", "fry at 350 F"]} /></div>, 90)}
    {C("KitMap", () => <OriginMap origins={[{ id: "norway", label: "NORWAY", dishes: ["lefse", "krumkake"], at: 0.3 }, { id: "sweden", label: "SWEDEN", dishes: ["meatballs"], at: 0.9 }, { id: "finland", label: "FINLAND", dishes: ["pannukakku"], at: 1.5 }, { id: "denmark", label: "DENMARK", at: 2.1 }, { id: "belgium", label: "BELGIUM", at: 2.5 }, { id: "cornwall", label: "CORNWALL", at: 2.9 }]} />, 150)}
    {C("KitWhy", () => <WhyTheyStopped title="Why they faded" items={[{ kind: "iron", caption: "a special iron", offAt: 1 }, { kind: "kettle", caption: "a big kettle", offAt: 2 }, { kind: "table", caption: "a crew", offAt: 3 }]} />, 150)}
  </>
);
registerRoot(Root);
