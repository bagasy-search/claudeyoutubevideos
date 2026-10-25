// enhc02 · "NEVER Answer These Questions on a Car Lot". El video usa el mundo y las piezas compartidas del canal
// (src/hector, ver D:/rtmp/hector/MUNDO.md); acá sólo van sus JSON, armados por vlog/enhc02/plan.py con at() sobre la voz.
import React from "react";
import { HectorVideo, Data } from "../hector/Video";
import { setP } from "../hector/lib";
import SEGS from "./segs.json";
import OV from "./ov.json";
import CAM from "./cam.json";
import EV from "./ev.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
setP("enhc02/");
const D = { segs: SEGS, ov: OV, cam: (CAM as { keys: unknown }).keys, ev: EV, win: (AVW as { win: Data["win"] }).win, av: AVAIL } as unknown as Data;
export const FULL_END = D.av.end;
export const Main: React.FC = () => <HectorVideo d={D} />;
