// GENERADO. NO editar a mano.
export type AvatarWindow = { start: number; mode: "full" | "hidden" };
export const TOTAL_FEDVET1 = 1396.297;
export const TOTAL_FRAMES_FEDVET1 = 41889;
export const AVATAR_FRAMES_FEDVET1 = 20305;
// El avatar es el PISO GARANTIZADO de todo el video: base FULL, siempre. Cada cue lo tapa mientras
// dura y ni un instante queda sin fondo. (La regla anti-hueco: base hidden + tope de duración deja
// ver el fondo muerto cuando la narración dwellea.)
export const AVATAR_WINDOWS: AvatarWindow[] = [{ start: 0, mode: "full" }];
