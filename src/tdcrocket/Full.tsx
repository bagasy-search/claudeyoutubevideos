// tdcrocket · Full: lkit Player con el EDL + avwin de este video (sin héroes: no hay escenas héroe)
import { setKit } from "../lkit";
import { makePlayer } from "../lkit/Player";
import EDL from "./edl.json";
import AV from "./avwin.json";
setKit({ imgDir: "img/tdcrocket", ext: "png", clipDir: "clips/tdcrocket", grain: "img/tdcrocket/grain.png", qr: "img/tdcrocket/th_card.jpg", cover: "img/tdcrocket/th_card.jpg", av: (AV as any).win });
export const TOTAL_S = (EDL as any).end as number;
export const Full = makePlayer(EDL as any);
