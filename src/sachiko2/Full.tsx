// sachiko2 · el video entero (EDL de src/sachiko2/edl.json, ventanas de avatar de src/sachiko2/avwin.json)
import { configure } from "../sachiko/Base";
import AV from "./avwin.json";
import EDL from "./edl.json";
configure({ slug: "sachiko2", av: AV as any });
import { makeFull } from "../sachiko/Full";
import { MINE } from "./Mine";
export const { Full, TOTAL_S } = makeFull(EDL, MINE);
