// mechabitos · Full: lkit Player con el EDL + avwin de este video
import { setKit } from "../lkit";
import { makePlayer } from "../lkit/Player";
import EDL from "./edl.json";
import AV from "./avwin.json";
setKit({ imgDir: "img/mechabitos", grain: "img/mechabitos/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/mechabitos", av: (AV as any).win });
export const TOTAL_S = (EDL as any).end as number;
export const Full = makePlayer(EDL as any);
