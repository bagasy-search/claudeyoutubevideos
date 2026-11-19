import React from "react";
import { Composition, registerRoot } from "remotion";
import data from "./linS/d/lin18a.json";
import { setData } from "./linS/lib";
import { Body } from "./linS/Body";
setData(data);
const Root = () => <Composition id="Linlin18a" component={Body} durationInFrames={Math.round((data as any).end * 30)} fps={30} width={1920} height={1080} />;
registerRoot(Root);
