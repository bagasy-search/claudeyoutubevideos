// GENERADO. NO editar a mano.
export type AvatarWindow = { start: number; mode: "full" | "hidden" };
export const TOTAL_FEDVETMEMORIA = 1369.55;
export const TOTAL_FRAMES_FEDVETMEMORIA = 41087;
// frames REALES del mp4 del avatar (9:25). De ahí al final se reproduce EN BUCLE, muteado.
export const AVATAR_FRAMES_FEDVETMEMORIA = 16949;
// El avatar es el PISO GARANTIZADO: base FULL siempre. Cada cue lo tapa mientras dura y ni un
// instante queda sin fondo (la regla anti-hueco: base hidden + tope de duración deja ver el fondo
// muerto cuando la narración dwellea).
export const AVATAR_WINDOWS: AvatarWindow[] = [{ start: 0, mode: "full" }];
