import { configure } from "../sachiko/Base";
import AV from "./avwin.json";
import EDL from "./edl.json";
configure({ slug: "sachiko3", av: AV as any });
import { makeFull } from "../sachiko/Full";
import { MINE } from "./Mine";
export const { Full, TOTAL_S } = makeFull(EDL, MINE);
