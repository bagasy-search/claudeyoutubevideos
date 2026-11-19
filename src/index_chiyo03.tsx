import React from "react";
import { Composition, registerRoot } from "remotion";
import data from "./chiyoS/d/chiyo03.json";
import { setData } from "./chiyoS/lib";
import { Body } from "./chiyoS/Body";
setData(data);
const Root = () => <Composition id="Chiyo03" component={Body} durationInFrames={Math.round((data as any).end * 30)} fps={30} width={1920} height={1080} />;
registerRoot(Root);
