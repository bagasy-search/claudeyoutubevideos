import React from "react";
import { Composition, registerRoot } from "remotion";
import data from "./salS/d/sal02.json";
import { setData } from "./salS/lib";
import { Body } from "./salS/Body";
setData(data);
const Root = () => <Composition id="Sal02" component={Body} durationInFrames={Math.round((data as any).end * 30)} fps={30} width={1920} height={1080} />;
registerRoot(Root);
