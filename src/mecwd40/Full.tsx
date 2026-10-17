// mecwd40 · Full: lkit Player con el EDL + avwin de este video
import { setKit } from "../lkit";
import { makePlayer } from "../lkit/Player";
import EDL from "./edl.json";
import AV from "./avwin.json";
setKit({ imgDir: "img/mecwd40", grain: "img/mecwd40/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/mecwd40", av: (AV as any).win });
export const TOTAL_S = (EDL as any).end as number;
export const Full = makePlayer(EDL as any);
