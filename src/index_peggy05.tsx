import React from "react";
import { Composition, registerRoot } from "remotion";
import data from "./peggyS/d/peggy05.json";
import { setData } from "./peggyS/lib";
import { Body } from "./peggyS/Body";
setData(data);
const Root = () => <Composition id="Peggy05" component={Body} durationInFrames={Math.round((data as any).end * 30)} fps={30} width={1920} height={1080} />;
registerRoot(Root);
