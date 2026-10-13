// fhoct · Full: lkit Player con el EDL + avwin + héroes de este video
import { setKit } from "../lkit";
import { makePlayer } from "../lkit/Player";
import EDL from "./edl.json";
import AV from "./avwin.json";
import * as H from "./heroes";
setKit({ imgDir: "img/fhoct", grain: "img/fhoct/grain.png", qr: "qr.jpg", cover: "book_cover.png", av: (AV as any).win });
export const TOTAL_S = (EDL as any).end as number;
export const Full = makePlayer(EDL as any, H as any);
