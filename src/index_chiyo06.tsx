import React from "react";
import { Composition, registerRoot } from "remotion";
import data from "./chiyoS/d/chiyo06.json";
import { setData } from "./chiyoS/lib";
import { Body } from "./chiyoS/Body";
setData(data);
const Root = () => <Composition id="Chiyo06" component={Body} durationInFrames={Math.round((data as any).end * 30)} fps={30} width={1920} height={1080} />;
registerRoot(Root);
