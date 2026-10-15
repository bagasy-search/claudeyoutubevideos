// index_wbkit.tsx — PREVIEW del kit backfire (canal Walt Brennecke) con material REAL de muestra.
// Sólo para stills de control: `node scripts/kit_stills.mjs src/index_wbkit.tsx <out> <Ids> <fracs>`.
// Los `at` acá son RELATIVOS (sin t0), en segundos desde el arranque de cada composición.
import "./index.css";
import React from "react";
import { Composition, registerRoot } from "remotion";
import { ArchiveFilm } from "./backfire/ArchiveFilm";
import { MapPin } from "./backfire/MapPin";
import { YearCounter } from "./backfire/YearCounter";
import { DocumentPage } from "./backfire/DocumentPage";
import { BigStat } from "./backfire/BigStat";
import { SplitVs } from "./backfire/SplitVs";
import { PullQuote } from "./backfire/PullQuote";
import { SceneCallout } from "./backfire/SceneCallout";
import { FileStamp } from "./backfire/FileStamp";
import { ActChip } from "./backfire/ActChip";
import { ColdOpen } from "./backfire/ColdOpen";

const C = (id: string, el: React.FC<any>, sec: number, props: any) => (
  <Composition key={id} id={id} component={el} durationInFrames={Math.round(sec * 30)} fps={30} width={1920} height={1080} defaultProps={props} />
);

const Root: React.FC = () => (
  <>
    {C("KArchive", ArchiveFilm, 6, { src: "broll/wbkit_real/wbkit_toad.mp4", credit: "Alex Popovkin · CC BY 2.0", caption: "Bahia, Brazil · native range" })}
    {C("KMap", MapPin, 10, { map: "img/wbkit_map.jpg", credit: "Map: Wikimedia Commons · public domain", kicker: "MAP · QUEENSLAND",
      pins: [{ x: 1715, y: 600, label: "Brisbane, Queensland", year: 1935, at: 0.6 }],
      route: { pts: [[1715, 600], [1560, 330], [1400, 160], [1160, 120], [960, 90]], years: [1935, 1960, 1980, 2001, 2025], from: 4.2, to: 9.2, label: "the toad front" } })}
    {C("KYear", YearCounter, 8, { photo: "img/wbkit_toad.jpg", yearFrom: 1935, yearTo: 2025, popFrom: 102, popTo: 200000000, unit: "cane toads", label: "AUSTRALIA · CANE TOADS", from: 0.8, to: 6.2,
      marks: [{ year: 1940, note: "New South Wales" }, { year: 1984, note: "Northern Territory" }, { year: 2009, note: "Western Australia" }], source: "Source: Australian Govt DCCEEW" })}
    {C("KDoc", DocumentPage, 9, { page: "img/wbkit_doc.png", aspect: 1241 / 1630, chip: "SCIENTIFIC PAPER · 2021", source: "Komine, Koike & Schwarzkopf · CC BY 4.0", bed: "img/wb_folder_blur.jpg",
      highlights: [{ x: 21, y: 13.2, w: 60, h: 4.6, at: 1.8 }, { x: 7, y: 38, w: 86, h: 3.2, at: 5.0 }], note: { text: "lights = free buffet", at: 7.0 } })}
    {C("KStat", BigStat, 6, { value: 200000000, unit: "", label: "CANE TOADS IN AUSTRALIA TODAY", compare: "More toads than people in Brazil.", source: "Source: Australian Govt DCCEEW", photo: "img/wbkit_toad.jpg", at: 1.0, compareAt: 2.8 })}
    {C("KSplit", SplitVs, 7, { leftImg: "img/wb_folder.jpg", rightImg: "img/wbkit_toad.jpg", leftText: "Toads eat the cane beetles", rightText: "Toads ate everything else", leftAt: 0.4, rightAt: 2.6 })}
    {C("KQuote", PullQuote, 8, { quote: "The toad is as great a pest in its native home as the beetle it is meant to destroy.", who: "Walter Froggatt, entomologist", year: 1935, source: "Sample text for kit preview only", at: 0.6, until: 5.0, highlight: "pest", bed: "img/wbkit_toad_blur.jpg" })}
    {C("KCallout", SceneCallout, 6, { photo: "img/wbkit_toad.jpg", x: 900, y: 430, r: 150, note: "poison glands, right here", circleAt: 1.0, noteAt: 2.0, credit: "Alex Popovkin · CC BY 2.0" })}
    {C("KFile", FileStamp, 6, { fileNo: 5, title: "THE CANE TOAD", sub: "Queensland, Australia · 1935", stamp: "OPEN", typeAt: 0.3, stampAt: 2.6 })}
    {C("KFilePart", FileStamp, 5, { fileNo: 5, title: "THE CANE TOAD", part: "PART 3 · THE RELEASE", stamp: "", typeAt: 0.2 })}
    {C("KAct", ActChip, 5, { fileNo: 5, part: "PART 3 — THE RELEASE" })}
    {C("KOpen", ColdOpen, 2.8, { thumb: "img/wbkit_map.jpg", trans: "broll/wbkit_real/wbkit_toad.mp4", hold: 0.8 })}
  </>
);
registerRoot(Root);
