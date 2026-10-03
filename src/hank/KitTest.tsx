// Banco de pruebas del kit Hank Out Back.
import React from "react";
import { Composition } from "remotion";
import { BayouMap3D } from "./BayouMap3D";
import { SpeciesFile, TailCounter, DamageChart, TrailCam, FieldNote } from "./FieldKit";

const S = [{ year: 1999, acres: 97000 }, { year: 2003, acres: 80000 }, { year: 2008, acres: 30000 }, { year: 2013, acres: 12000 }, { year: 2019, acres: 14652 }, { year: 2025, acres: 3854 }];
export const tests: { id: string; dur: number; el: React.FC }[] = [
  { id: "H-Map", dur: 300, el: () => <BayouMap3D series={S} title="COASTAL LOUISIANA · NASA MODIS" pins={[{ name: "CAMERON", lon: -93.3, lat: 29.8 }, { name: "TERREBONNE", lon: -90.8, lat: 29.35 }, { name: "PLAQUEMINES", lon: -89.6, lat: 29.4 }]} /> },
  { id: "H-Species", dur: 180, el: () => <SpeciesFile photo="test/nut.png" common="Nutria" latin="Myocastor coypus" facts={[{ k: "WEIGHT", v: "up to 20 lb" }, { k: "LITTERS / YEAR", v: "up to 3" }, { k: "TEETH", v: "bright orange" }, { k: "FROM", v: "South America" }]} bed="test/nut.png" /> },
  { id: "H-Tails", dur: 210, el: () => <TailCounter to={63118} label="ONE TRAPPER · ONE SEASON" bed="test/nut.png" /> },
  { id: "H-Chart", dur: 240, el: () => <DamageChart title="MARSH DAMAGED BY NUTRIA" unit="ACRES" series={S.map((x) => ({ year: x.year, v: x.acres }))} marks={[{ year: 2019, label: "RAISED TO $6" }]} /> },
  { id: "H-Cam", dur: 120, el: () => <TrailCam src="test/nut.png" /> },
  { id: "H-Note", dur: 200, el: () => <FieldNote lines={["63,118 tails", "x $6", "= $378,708", "one season!"]} bed="test/hank.png" /> },
];
export const KitRoot: React.FC = () => <>{tests.map((t) => <Composition key={t.id} id={t.id} component={t.el} durationInFrames={t.dur} fps={30} width={1920} height={1080} />)}</>;
