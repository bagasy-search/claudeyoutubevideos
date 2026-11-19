import React from "react";
import { Composition, registerRoot } from "remotion";
import data from "./tdp16/d/tdp16c.json";
import { setData } from "./tdp16/lib";
import { Body } from "./tdp16/Body";
setData(data);
const Root = () => <Composition id="Tdp16c" component={Body} durationInFrames={Math.round((data as any).end * 30)} fps={30} width={1920} height={1080} />;
registerRoot(Root);
