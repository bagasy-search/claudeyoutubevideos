// Banco de prueba del kit de carnicería: un componente cada 90 cuadros (stills en el farm). No entra al video.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import * as K from "./Kit";
import * as S from "./Carne";

const g = (n: string) => `stan12a/g/${n}.png`;
const D = 90;
const items: React.ReactNode[] = [
  <S.ChapS n={7} N={10} title="Basted / enhanced" src={g("d7")} dur={D} />,
  <S.ChapS n={10} N={10} title="Pre-stuffed" src={g("d10")} dur={D} />,
  <S.CarruselS head="10 turkeys · an honest ranking" bg={g("kit")} dur={D * 3} cards={[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => ({ n, title: ["", "The plain bird", "Fresh, small farm", "Organic", "Kosher", "Heritage", "Bone-in breast", "Basted / enhanced", "Smoked, fully cooked", "Boneless turkey roll", "Pre-stuffed"][n], src: g("d" + n) }))} />,
  <S.LabelS head="FROZEN YOUNG TURKEY · THE SMALLEST LETTERS" lines={[{ txt: "Young Turkey", small: true }, { txt: "Contains up to 8% of a solution", hl: true }, { txt: "of turkey broth, salt, sugar, sodium phosphate", small: true }]} note="salt water" bg={g("d7")} mark={20} dur={D} />,
  <S.TicketS n={8} title="Smoked, fully cooked" rows={[["LABEL", "Find the words “fully cooked”"], ["BUY", "1 to 1½ lb per person"], ["THAW", "1 day per 4–5 lb"], ["MISTAKE", "Roasting it twice. Just warm it to 165°F"]]} score="5" scoreNote="8 ON FRIDAY, ON RYE" bg={g("d8")} markScore={34} dur={D} />,
  <S.TicketS n={6} title="Bone-in breast" rows={[["LABEL", "“Bone-in” and “skin-on”"], ["BUY", "1 to 1¼ lb per person"], ["THAW", "2 days for a 6 lb breast"], ["MISTAKE", "Overcooking it · no wings for the gravy"]]} score="6½" bg={g("d6")} markScore={34} dur={D} />,
  <S.BoardS title="Where I shop" rows={[{ name: "Heritage", price: "$8 – $12+", f: 10 }]} dur={D} />,
  <S.BoardS title="Per pound · where I shop" rows={[["Basted, frozen", "$1 – $2"], ["Plain, frozen", "$1.50 – $2.50"], ["Bone-in breast", "$2.50 – $5"], ["Kosher", "$3.50 – $5"], ["Organic", "$3.50 – $5"], ["Boneless turkey roast", "$4 – $7"], ["Smoked, fully cooked", "$4 – $7"], ["Small-farm, fresh", "$5 – $9"], ["Heritage", "$8 – $12+"]].map(([name, price], i) => ({ name, price, f: 8 + i * 5, hl: i === 1 }))} dur={D} />,
  <S.ScaleS a={1} b={1.5} big="1 to 1½ lb" sub="per person · 1½ if you want sandwiches" bg={g("d7")} dur={D} />,
  <S.WeekS head="Count backward from Thursday" days={[{ d: "SUN", note: "out of the freezer", on: true }, { d: "MON", on: true }, { d: "TUE", on: true }, { d: "WED", note: "thawed", on: true }, { d: "THU", note: "in the oven", star: true }]} foot="16 pounds = 4 days · 20 pounds = 5" bg={g("d7")} dur={D} />,
  <S.WeekS head="A 24-pound turkey" days={["FRI", "SAT", "SUN", "MON", "TUE", "WED", "THU"].map((d, i) => ({ d, on: i < 6, star: i === 6, note: i === 0 ? "out" : i === 6 ? "oven" : "" }))} foot="6 days in the refrigerator" bg={g("d7")} dur={D} />,
  <S.WordS word="“No hormones added”" means="Federal regulations prohibit the use of hormones in poultry." verdict="NOBODY IS ALLOWED TO" bg={g("d3")} markV={30} dur={D} />,
  <S.WordS word="USDA Organic" means="Organic feed · no antibiotics · real outdoor access · inspected." verdict="THIS ONE HAS TEETH" good bg={g("d3")} markV={30} dur={D} />,
  <S.SlipS q="“Twenty people coming. One giant bird, or two small ones?”" n={5} bg={g("kit")} dur={D} />,
  <S.SumS parts={[{ txt: "16 lb", f: 8 }, { txt: "×", f: 14 }, { txt: "8%", f: 20 }, { txt: "=", f: 28 }, { txt: "1¼ lb", f: 36, big: true }]} foot="of salt water, at turkey price" bg={g("d7")} dur={D} />,
  <S.ListaS head="FOR EVERY BIRD" title="Four things" rows={[["1", "What to look for on the label"], ["2", "Pounds per person"], ["3", "Days in the refrigerator"], ["4", "The mistake everybody makes"]].map(([a, txt], i) => ({ a, txt, f: 10 + i * 10 }))} sello bg={g("kit")} dur={D} />,
  <S.ListaS head="TAKE THIS TO THE STORE" title="10 turkeys, worst to first" dense sello rows={[[10, "Pre-stuffed", "never fresh · frozen ones cook from frozen · stuffing 165°F"], [9, "Boneless roll", "½ lb a person · leave the net on"], [8, "Smoked, fully cooked", "warm it under foil · don’t roast it twice"], [7, "Basted / enhanced", "already brined · don’t salt it"], [6, "Bone-in breast", "1 lb a person · buy wings for gravy"], [5, "Heritage", "best flavor, biggest bill · check it early"], [4, "Kosher", "already salted · tweezers handy"], [3, "Organic", "the seal means something · salt it yourself"], [2, "Small-farm fresh", "order in October · cook within 2 days"], [1, "The plain bird", "thaw 4 days · salt 1 day · 325°F · rest 30 min"]].map(([n, txt, sub], i) => ({ a: "#" + n, txt: String(txt), sub: String(sub), f: 4 + i * 5 }))} bg={g("kit")} dur={D} />,
  <S.DiaS day="Wednesday" what="Unwrap · pat dry · salt · back in, uncovered" n={2} N={3} bg={g("d1")} dur={D} />,
  <S.BarrasS head="From egg to your table" max={8} unit="months" foot="ruler marks = months" rows={[{ name: "Broad Breasted White", val: 4, label: "about 4 months", f: 10 }, { name: "Heritage breeds", val: 7, label: "closer to 7", f: 30 }]} bg={g("d5")} dur={D} />,
  <S.FreshS fA={20} fB={40} bg={g("d1")} dur={D} />,
  <S.PasosS head="A brine with no bucket" steps={[{ txt: "Salt pulls moisture out", f: 8 }, { txt: "The moisture dissolves the salt", f: 26 }, { txt: "The bird drinks it back in", f: 44 }]} foot="24 hours, uncovered, on a rack" bg={g("d4")} dur={D} />,
  <S.RazasS names={[{ txt: "Bourbon Red", f: 8 }, { txt: "Narragansett", f: 24 }, { txt: "Standard Bronze", f: 40 }]} bg={g("d5")} dur={D} />,
  <S.NextS title="Pork chops: 52 years I cooked them wrong" src={g("d1")} dur={D} />,
  <K.Stat head="THAWING" title="Never on the kitchen counter." lines={["In the refrigerator, on a tray", "Or in cold water, changed every 30 minutes"]} foot="USDA FSIS, “The Big Thaw”" bg={g("d7")} dur={D} />,
  <K.Thermo deg={165} label="Breast · thigh · wing" sub="All three places" foot="USDA FSIS safe minimum internal temperature" bg={g("d1")} dur={D} />,
  <K.OvenDial deg={325} note="never lower" bg={g("d1")} dur={D} />,
  <K.Clock2h head="30 minutes" sub="A loose tent of foil. Don’t carve it hot." sweep={180} bg={g("d1")} dur={D} />,
  <K.Album src={g("alb1961")} seed={3} dur={D} caption="Archer Avenue · 1961" />,
  <K.PolaroidShot src={g("albmother")} caption="Ma carving · nobody helps" bg={g("kit")} seed={5} dur={D} />,
  <K.RecipeCard n={0} N={0} title="The dry brine" meta={["Wednesday morning", "24 hours", "No rinsing"]} items={[["1 tablespoon kosher salt per 5 lb of bird", 8], ["15 lb bird = 3 tablespoons", 20], ["Some in the cavity, most on breast & legs", 32], ["A little under the breast skin", 44]].map(([txt, f]) => ({ txt: String(txt), f: Number(f) }))} steps={["Thawed bird, patted dry. Don’t wash it.", "Salt it all over.", "On a rack, uncovered, in the refrigerator.", "Thursday: don’t rinse. Butter and pepper."]} keeps="skip this on basted or kosher birds" bg={g("d4")} dur={D} />,
  <K.MapIowa map={g("mapa")} town={[40, 68]} label="past Joliet" sub="Illinois · 1968" dur={D} />,
];
let a = 0;
const seq = items.map((el, i) => { const d = i === 2 ? D * 3 : D; const s = <Sequence key={i} from={a} durationInFrames={d}>{el}<S.ProgS n={7} N={10} title="Basted / enhanced" dur={d} /></Sequence>; a += d; return s; });
export const KIT_TOTAL = a;
export const KitTest: React.FC = () => <AbsoluteFill style={{ background: "#111" }}>{seq}</AbsoluteFill>;
