// GENERADO por vlog/tfbpiedra/mktimeline.mjs — no editar a mano (stub inicial)
export type Media = { src: string; startFrom: number; rate?: number };
export type Cue = { kind: "vid" | "still" | "lam"; src: string; from: number; dur: number; startFrom?: number; rate?: number; cam?: any };
export type Fx = { kind: string; from: number; dur: number; p: Record<string, unknown>; media?: Media };
export const TOTAL_FRAMES_TFBPIEDRA = 300;
export const AUDIO = "sfx/_silence.mp3";
export const TL: Cue[] = [];
export const FX: Fx[] = [];
export const LAM_KEYS: [number, number, number, number][] = [[0, 0.5, 0.5, 1]];
