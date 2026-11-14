// enca01 · Full: Player de Chief Aurelio con el EDL de este video.
import { makePlayer } from "./Player";
import EDL from "./edl.json";
export const TOTAL_S = (EDL as any).end as number;
export const Full = makePlayer(EDL as any);
