// Banco de pruebas del kit Yesterday's Classroom (stills/previews con --public-dir liviano).
import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { NumberCard3D } from "./NumberCard3D";
import { Grade } from "./Grade";
import { Timeline3D } from "./Timeline3D";
import { ThenNow, Kinetic, BanStamp, Clipping, MapRoute, FilmStrip, Ticket, ChalkBars, PlaceTag, BigCount } from "./Cards";
import { Media } from "./Media";
import { PrintPush } from "./PrintPush";
import { Diorama3D } from "./Diorama3D";
import { Projector3D } from "./Hero3D";
import { ExamRoom3D } from "./ExamRoom3D";
import { ReportCard3D } from "./ReportCard3D";

const W: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: "#000" }}>{children}<Grade /></AbsoluteFill>
);

export const tests: { id: string; dur: number; el: React.FC }[] = [
  { id: "T-Number20", dur: 150, el: () => <W><NumberCard3D n={20} title="Play on a playground that could actually hurt you" bed="test/bed1.png" /></W> },
  { id: "T-Timeline", dur: 330, el: () => <W><Timeline3D kicker="HOW THE PLAYGROUND CHANGED" events={[
    { year: "1963", label: "Steel slides twelve feet tall", src: "test/bed1.png" },
    { year: "1981", label: "First federal playground safety handbook", src: "test/bed3.png" },
    { year: "TODAY", label: "Rubber ground, half-size slides", src: "test/bed2.png", now: true },
  ]} /></W> },
  { id: "T-ThenNow", dur: 150, el: () => <W><ThenNow then={{ src: "test/bed1.png", year: "1963" }} now={{ src: "test/bed2.png" }} caption="The slide was scary." /></W> },
  { id: "T-Kinetic", dur: 150, el: () => <W><Kinetic text="Nobody called it neglect. They called it Saturday." keys={["neglect", "saturday"]} bed="test/bed3.png" /></W> },
  { id: "T-Ban", dur: 120, el: () => <W><Media src="test/bed1.png" /><BanStamp big="BANNED" date="DECEMBER 1988" /></W> },
  { id: "T-Clip", dur: 150, el: () => <W><Clipping date="OVERTON, TEXAS · 2015" headline="Police close sisters' lemonade stand over $150 permit" photo="test/bed3.png" /></W> },
  { id: "T-Map", dur: 180, el: () => <W><MapRoute from="HOME" to="THEATER" distance="2 MILES" /></W> },
  { id: "T-Film", dur: 150, el: () => <W><FilmStrip srcs={["test/bed1.png", "test/bed3.png"]} label="16 mm" /></W> },
  { id: "T-Ticket", dur: 150, el: () => <W><Ticket price="25¢" line1="Saturday Matinee" bed="test/bed4.png" /></W> },
  { id: "T-Bars", dur: 150, el: () => <W><ChalkBars title="1962, in dollars" bars={[{ label: "PROJECTOR", value: 520, display: "$500+", hot: true }, { label: "TEACHER / MONTH", value: 420, display: "≈ $420" }]} /></W> },
  { id: "T-Place", dur: 120, el: () => <W><Media src="test/bed2.png" /><PlaceTag place="DAYTON, OHIO" date="1963" /></W> },
  { id: "T-Count", dur: 120, el: () => <W><Media src="test/bed2.png" /><BigCount to={50} suffix=" MILES" /></W> },
  { id: "T-Print", dur: 90, el: () => <W><PrintPush src="test/bed3.png" others={["test/bed1.png", "test/bed2.png"]} /></W> },
  { id: "T-Dio", dur: 240, el: () => <W><Diorama3D mode="route" place="DAYTON, OHIO · 1963" distance="2" title="home to the Saturday matinee" /></W> },
  { id: "T-Proj", dur: 210, el: () => <W><Projector3D screen="test/bed3.png" bed="test/bed4.png" caption="Threaded by hand." /></W> },
  { id: "T-Exam", dur: 420, el: () => <W><ExamRoom3D n={7} angle={0} answer="B" countFrom={260} revealAt={410} lines={[
    { text: "How many pecks are in a bushel?", from: 20, to: 120, kind: "q" },
    { text: "A. Two", from: 140, to: 170, kind: "opt" }, { text: "B. Four", from: 180, to: 210, kind: "opt" }, { text: "C. Eight", from: 220, to: 250, kind: "opt" },
  ]} /></W> },
  { id: "T-Exam1", dur: 420, el: () => <W><ExamRoom3D n={12} angle={1} answer="C" countFrom={260} revealAt={330} lines={[
    { text: "Which river forms most of the border between Ohio and Kentucky?", from: 20, to: 120, kind: "q" },
    { text: "A. The Missouri", from: 140, to: 170, kind: "opt" }, { text: "B. The Wabash", from: 180, to: 210, kind: "opt" }, { text: "C. The Ohio", from: 220, to: 250, kind: "opt" },
  ]} /></W> },
  { id: "T-Report", dur: 200, el: () => <W><ReportCard3D bed="test/bed3.png" rows={[{ label: "23 – 25 correct", grade: "A" }, { label: "18 – 22 correct", grade: "B" }, { label: "12 – 17 correct", grade: "C" }, { label: "under 12", grade: "See me" }]} note="Keep count!" /></W> },
];

export const KitRoot: React.FC = () => (
  <>
    {tests.map((t) => <Composition key={t.id} id={t.id} component={t.el} durationInFrames={t.dur} fps={30} width={1920} height={1080} />)}
  </>
);
