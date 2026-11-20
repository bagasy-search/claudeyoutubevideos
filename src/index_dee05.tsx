import React from "react";
import { Composition, registerRoot } from "remotion";
import data from "./deeS/d/dee05.json";
import { setData } from "./deeS/lib";
import { Body } from "./deeS/Body";
import "./deeS/esc_dee05";
setData(data);
const Root = () => <Composition id="Dee05" component={Body} durationInFrames={Math.round((data as any).end * 30)} fps={30} width={1920} height={1080} />;
registerRoot(Root);
