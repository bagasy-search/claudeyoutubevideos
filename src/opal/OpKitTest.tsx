// Prueba del kit Opal (un render corto con cada componente, incluidos los dos 3D) antes del video entero.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { OpCaseLog } from "./OpCaseLog";
import { OpDaylight } from "./OpDaylight";
import { OpChecklist } from "./OpChecklist";
import { OpLedger } from "./OpLedger";
import { OpSignCard } from "./OpSignCard";
import { OpWontBuy } from "./OpWontBuy";
import { OpMiteTest } from "./OpMiteTest";
import { OpFeedSack3D } from "./OpFeedSack3D";
import { OpEggFloat3D } from "./OpEggFloat3D";
import { OpNameTag, OpAsk, OpSubscribe, OpViewerQ } from "./OpOverlays";

const B = "img/opalnolay/b_floorfeathers.jpg", V = "broll/opalnolay_st/st_hens2_0.mp4";
const D = 150;
const CH = [{ t: "Count your daylight", cost: "free" }, { t: "Look for the molt", cost: "free" }, { t: "Read the feed bag", cost: "$24" }, { t: "Are the eggs really gone?", cost: "free" }, { t: "Mites, at night", cost: "a flashlight" }, { t: "Stress & predators", cost: "free" }, { t: "How old is she?", cost: "free" }];
const ITEMS: React.ReactNode[] = [
  <OpFeedSack3D a={{ name: "LAYER", pct: "16%", price: "$17", color: "#4F7A35" }} b={{ name: "ALL-FLOCK", pct: "20%", price: "$24", color: "#A8322D" }} moveAt={40} />,
  <OpEggFloat3D every={40} />,
  <OpCaseLog bed={B} title="Egg log · this week" rows={[{ day: "Mon", n: 9 }, { day: "Tue", n: 2 }, { day: "Wed", n: 3 }, { day: "Thu", n: 2 }, { day: "Fri", n: 1, note: "a pullet" }]} every={20} drop={1} />,
  <OpDaylight points={[{ m: "Jun", h: 15.2 }, { m: "Jul", h: 15.0 }, { m: "Aug", h: 14.1 }, { m: "Sep", h: 12.8 }, { m: "Oct", h: 11.5 }, { m: "Nov", h: 10.2 }, { m: "Dec", h: 9.4 }]} mark={4} title="Hours of daylight · Indiana" />,
  <OpChecklist bed={V} items={CH} active={2} done={2} every={4} />,
  <OpLedger bed={B} title="What that week cost me" rows={[{ item: "All-flock 20%, 50 lb", price: "$24" }, { item: "Oyster shell", price: "already had" }, { item: "Paper towel & flashlight", price: "in the house" }]} total="$24" every={20} stamp="that's it" />,
  <OpSignCard bed={B} see="little quills, like straws" means="the molt" circle={{ x: 980, y: 520, rx: 300, ry: 200 }} />,
  <OpWontBuy bed={B} n="2" item="A heat lamp" price="$12" why="it gets knocked down, and it's a fire" />,
  <OpMiteTest bed={B} found />,
  <OpViewerQ bed={V} name="Marlene" place="Kentucky" hens="8 hens" question="Should I put a heat lamp in the coop this winter?" />,
];
export const KIT_TEST_FRAMES = ITEMS.length * D;
export const OpKitTest: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#C9A574" }}>
    {ITEMS.map((el, i) => <Sequence key={i} from={i * D} durationInFrames={D}>{el}</Sequence>)}
    <Sequence from={2 * D} durationInFrames={D}><OpNameTag /></Sequence>
    <Sequence from={3 * D} durationInFrames={D}><OpAsk question="Where are you watching from — and how many hens?" /></Sequence>
    <Sequence from={4 * D} durationInFrames={D}><OpSubscribe /></Sequence>
  </AbsoluteFill>
);
