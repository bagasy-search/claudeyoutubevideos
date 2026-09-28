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
import { Projector3D, LawnDart3D } from "./Hero3D";

const W: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: "#000" }}>{children}<Grade /></AbsoluteFill>
);

export const tests: { id: string; dur: number; el: React.FC }[] = [
  { id: "T-Number20", dur: 150, el: () => <W><NumberCard3D n={20} title="Play on a playground that could actually hurt you" bed="test/bed1.png" /></W> },
  { id: "T-Number7", dur: 150, el: () => <W><NumberCard3D n={7} title="Swim in the creek all day" bed="test/bed2.png" side="right" /></W> },
  { id: "T-Timeline", dur: 330, el: () => <W><Timeline3D kicker="HOW THE PLAYGROUND CHANGED" events={[
    { year: "1963", label: "Steel slides twelve feet tall", src: "test/bed1.png" },
    { year: "1981", label: "First federal playground safety handbook", src: "test/bed3.png" },
    { year: "1990s", label: "Merry-go-rounds start coming down", src: "test/bed4.png" },
    { year: "TODAY", label: "Rubber mulch and half-size slides", src: "test/bed2.png", now: true },
  ]} /></W> },
  { id: "T-ThenNow", dur: 150, el: () => <W><ThenNow then={{ src: "test/bed1.png", year: "1963" }} now={{ src: "test/bed2.png" }} caption="The slide was scary. That was the point." /></W> },
  { id: "T-Kinetic", dur: 150, el: () => <W><Kinetic text="Nobody called it neglect. They called it Saturday." keys={["neglect", "saturday"]} bed="test/bed3.png" /></W> },
  { id: "T-Ban", dur: 120, el: () => <W><Media src="test/bed1.png" /><BanStamp big="BANNED" date="DECEMBER 1988" /></W> },
  { id: "T-Clip", dur: 150, el: () => <W><Clipping date="OVERTON, TEXAS · 2015" headline="Police close sisters' lemonade stand over $150 permit" photo="test/bed3.png" /></W> },
  { id: "T-Map", dur: 180, el: () => <W><MapRoute from="HOME" to="THEATER" distance="2 MILES" title="Dayton, Ohio · 1963" /></W> },
  { id: "T-Film", dur: 150, el: () => <W><FilmStrip srcs={[{ src: "test/bed1.png" }, { src: "test/bed3.png" }, { src: "test/bed4.png" }]} label="16 mm · threaded by hand" /></W> },
  { id: "T-Ticket", dur: 150, el: () => <W><Ticket price="25¢" line1="Saturday Matinee" line2="Cartoons · Newsreel · Two Westerns" bed="test/bed4.png" /></W> },
  { id: "T-Bars", dur: 150, el: () => <W><ChalkBars title="1962, in dollars" bars={[{ label: "SOUND FILM PROJECTOR", value: 520, display: "$500+", hot: true }, { label: "TEACHER'S MONTHLY PAY", value: 420, display: "≈ $420" }]} /></W> },
  { id: "T-Place", dur: 120, el: () => <W><Media src="test/bed2.png" /><PlaceTag place="DAYTON, OHIO" date="1963" /></W> },
  { id: "T-Count", dur: 120, el: () => <W><Media src="test/bed2.png" /><BigCount to={50} suffix=" MILES" label="in twenty hours, on foot" /></W> },
  { id: "T-Print", dur: 90, el: () => <W><PrintPush src="test/bed3.png" others={["test/bed1.png", "test/bed2.png", "test/bed4.png"]} /></W> },
  { id: "T-Dio", dur: 240, el: () => <W><Diorama3D mode="route" place="DAYTON, OHIO · 1963" distance="2" title="home to the Saturday matinee" /></W> },
  { id: "T-DioNight", dur: 240, el: () => <W><Diorama3D mode="streetlights" title="When the streetlights came on, you went home." /></W> },
  { id: "T-Proj", dur: 210, el: () => <W><Projector3D screen="test/bed3.png" bed="test/bed4.png" caption="Threaded by hand. Run by a twelve-year-old." /></W> },
  { id: "T-Dart", dur: 150, el: () => <W><LawnDart3D caption="Underhand, high into the air." /></W> },
];

export const KitRoot: React.FC = () => (
  <>
    {tests.map((t) => <Composition key={t.id} id={t.id} component={t.el} durationInFrames={t.dur} fps={30} width={1920} height={1080} />)}
  </>
);
