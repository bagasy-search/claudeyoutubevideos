import React from "react";
import { Composition, registerRoot } from "remotion";
import data from "./ingridS/d/ingrid03.json";
import { setData } from "./ingridS/lib";
import { Body } from "./ingridS/Body";
setData(data);
const Root = () => <Composition id="Ingrid03" component={Body} durationInFrames={Math.round((data as any).end * 30)} fps={30} width={1920} height={1080} />;
registerRoot(Root);
