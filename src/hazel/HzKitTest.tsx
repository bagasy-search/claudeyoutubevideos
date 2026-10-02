// Prueba del kit Hazel en el farm (un render corto con cada componente, incluidos los dos 3D) antes del video entero.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { HzPriceTag } from "./HzPriceTag";
import { HzSoldListings } from "./HzSoldListings";
import { HzWhereToSell } from "./HzWhereToSell";
import { HzDealerClock } from "./HzDealerClock";
import { HzMagnetTest } from "./HzMagnetTest";
import { HzWorthNothing } from "./HzWorthNothing";
import { HzLotVsPiece } from "./HzLotVsPiece";
import { HzLotCard } from "./HzLotCard";
import { HzRecap } from "./HzRecap";
import { HzRuleCard } from "./HzRuleCard";
import { HzHallmark3D } from "./HzHallmark3D";
import { HzRing3D } from "./HzRing3D";
import { HzNameTag, HzAsk, HzSubscribe } from "./HzOverlays";

const B = "img/hazeldealers/kf_sticker.jpg", V = "broll/hazeldealers_st/st_porch_1.mp4";
const D = 150;
const ITEMS: React.ReactNode[] = [
  <HzHallmark3D stamp="STERLING" sub="925" verdict="solid silver" good />,
  <HzRing3D />,
  <HzPriceTag bed={B} front="$2" frontNote="the sticker on it" sold="$150 – $300" item="plain sterling creamer" />,
  <HzSoldListings bed={B} title="Sold — costume jewelry" rows={[{ item: "Trifari leaf pin, signed", price: "$34" }, { item: "Weiss rhinestone pin", price: "$58" }, { item: "Haskell beaded necklace", price: "$185" }]} range="$20 – $300" every={10} />,
  <HzWhereToSell bed={V} item="Scrap gold, by weight" routes={[{ name: "Pawn shop", take: "often half or less" }, { name: "Local jeweler", take: "ask: what % of spot?" }, { name: "Refiner", take: "good buyers: 80–90%" }]} best={2} stamp="ask the %" />,
  <HzDealerClock bed={V} from="6:57" to="7:00" label="Saturday" />,
  <HzMagnetTest bed={B} left={{ label: "14K chain", sticks: false, verdict: "gold" }} right={{ label: "plated chain", sticks: true, verdict: "not gold" }} />,
  <HzWorthNothing bed={B} img={B} title="collector plates" price="a few dollars" note="the certificate doesn't change it" />,
  <HzLotVsPiece bed={B} lotLabel="the whole jewelry box" lotPrice="$20" pieces={[{ label: "Trifari pin", price: "$34" }, { label: "Weiss brooch", price: "$58" }, { label: "Haskell necklace", price: "$185" }]} total="sort it first" every={8} />,
  <HzLotCard bed={B} n={4} title="Sterling silver" where="the china cabinet" />,
  <HzRecap bed={B} items={["Fountain pens", "Signed jewelry", "Gold in the junk", "Sterling silver", "Old watches", "The paper", "Old Pyrex", "Basement tools"]} every={12} start={4} title="what they grab first" />,
  <HzRuleCard bed={B} rule="Never sell on day one." lines={["Take it off the table."]} every={40} />,
];
export const KIT_TEST_FRAMES = ITEMS.length * D;
export const HzKitTest: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#E9D4A0" }}>
    {ITEMS.map((el, i) => <Sequence key={i} from={i * D} durationInFrames={D}>{el}</Sequence>)}
    <Sequence from={2 * D} durationInFrames={D}><HzNameTag /></Sequence>
    <Sequence from={3 * D} durationInFrames={D}><HzAsk question="What's the oldest thing in your china cabinet?" /></Sequence>
    <Sequence from={4 * D} durationInFrames={D}><HzSubscribe /></Sequence>
  </AbsoluteFill>
);
