// ampa01 · Full: el video armado con el kit del canal Amparo (src/amparo)
import { makeVideo } from "../amparo/Video";
import EDL from "./edl.json";
import AV from "./avwin.json";
import REEL from "./reel.json";
export const TOTAL_S = (EDL as any).end as number;
export const Full = makeVideo(EDL as any, (AV as any).win, { slug: "ampa01", still: "img/ampa01/amparo_ph.jpg", reel: (REEL as any).reel, chip: "Amparo Ríos · psicóloga clínica", chipWin: 3 });
