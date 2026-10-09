// Banco de prueba del kit 2D de Ole (olsup). Textos/numeros de ejemplo SOLO de prueba.
import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { OleCountdown, OleCountdownCard } from "./OleCountdown";
import { OleSupperCard, OleTrick, OleFact, OleTwoCards, OleArchivePhoto } from "./OleCards";
import { OleCalorieMeter, OleDayClock } from "./OleGauges";
import { OleBookPage, OleCTA } from "./OleBook";
import { OleNameTag, OleNote, OleArrow, OleComments, OleAsk, OleSubscribe, OleWipe } from "./OleOverlays";

const IMG = "ref_olsup.png";
const Photo: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill><Img src={staticFile(IMG)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />{children}</AbsoluteFill>
);

// [nombre, duracion, elemento]
export const KIT2D_ITEMS: [string, number, React.ReactNode][] = [
  ["countdown", 90, <Photo><OleCountdown n={17} name="Ham hock & navy bean soup" sub="in the big kettle" book={51} /></Photo>],
  ["countdownhero", 90, <Photo><OleCountdown n={3} name="Salt pork & potatoes" sub="in cream gravy" hero book={26} /></Photo>],
  ["countdowncard", 75, <OleCountdownCard n={12} name="Test Dish Name" sub="short test line" bed={IMG} />],
  ["supper", 180, <OleSupperCard n={7} title="Test Dish Name" items={["first test item", "second test item", "third test item", "fourth test item"]} why="a short test reason" note="test note in pencil" bed={IMG} />],
  ["calorie", 120, <OleCalorieMeter label="Test label a day" to={5000} unit="calories a day" source="Test Source, 1900" />],
  ["dayclock", 210, <OleDayClock marks={[{ h: 4, label: "first mark" }, { h: 8, label: "second mark" }, { h: 12, label: "third mark" }, { h: 15, label: "fourth mark" }, { h: 18, label: "supper bell" }]} startH={4} endH={18} bed={IMG} />],
  ["bookpage", 210, <OleBookPage page="img/olsup/book_p12.jpg" pageNo={12} keys={[[0, 0.5, 0.5, 1], [2, 0.5, 0.5, 1], [3.2, 0.5, 0.2, 1.7], [5, 0.5, 0.2, 1.7], [6, 0.5, 0.6, 1.7]]} caption="test caption line" />],
  ["cta", 180, <OleCTA cover="img/olsup/portada.png" qr="qr_ole_suppers.png" line1="Point your phone at this code" line2="or tap the link in the description" url="test-url.example" />],
  ["trick", 120, <OleTrick title="Test Title" text="Always test the *keyword* before serving" bed={IMG} />],
  ["fact", 120, <OleFact big="5,000" unit="calories a day" text="test line of text" source="Test Source, 1900" bed={IMG} />],
  ["archive", 150, <OleArchivePhoto src={IMG} caption="Test caption for archive photo" credit="Library of Congress" seed={4} />],
  ["twocards", 120, <OleTwoCards a={{ title: "Test A", lines: ["test line one", "test line two"], mark: "yes" }} b={{ title: "Test B", lines: ["test line one", "test line two"], mark: "no" }} bed={IMG} />],
  ["nametag", 90, <Photo><OleNameTag name="Test Name" sub="test subtitle" /></Photo>],
  ["note", 90, <Photo><OleNote text="test note here" /></Photo>],
  ["arrow", 90, <Photo><OleArrow text="test arrow text" /></Photo>],
  ["comments", 150, <Photo><OleComments items={[{ at: 0.3, text: "First test comment goes here" }, { at: 1.5, text: "Second test comment here" }, { at: 2.7, text: "Third test comment" }]} /></Photo>],
  ["ask", 90, <Photo><OleAsk text="Test question for you?" /></Photo>],
  ["subscribe", 90, <Photo><OleSubscribe sub="test sub line" /></Photo>],
  ["wipe", 14, <Photo><OleWipe dir="r" /></Photo>],
];
export const KIT2D_FRAMES = KIT2D_ITEMS.reduce((a, [, d]) => a + d, 0);
export const KIT2D_STARTS = KIT2D_ITEMS.reduce<number[]>((a, [, d], i) => { a.push(i ? a[i - 1] + KIT2D_ITEMS[i - 1][1] : 0); return a; }, []);

export const OleKitTest2D: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#1E140D" }}>
    {KIT2D_ITEMS.map(([n, d, el], i) => <Sequence key={n} from={KIT2D_STARTS[i]} durationInFrames={d}>{el}</Sequence>)}
  </AbsoluteFill>
);
