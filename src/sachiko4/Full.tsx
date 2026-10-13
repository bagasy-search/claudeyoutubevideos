// sachiko4 · Rice (11 things, #4 saves $300). Kit compartido + componentes propios + EDL del video.
import { configure } from "../sachiko/Base";
import AV from "./avwin.json";
import EDL from "./edl.json";
import { MINE } from "./Mine";
configure({ slug: "sachiko4", av: AV as any });
import { makeFull } from "../sachiko/Full";
export const { Full, TOTAL_S } = makeFull(EDL as any, MINE);
