// GENERADO por vlog/tfbpiso/mktimeline.mjs — no editar a mano (stub hasta el primer armado)
export const TOTAL_FRAMES_TFBPISO = 30;
export const VOICE = "sfx/_silence.mp3";
export type Cue = { kind: "vid" | "lam"; src?: string; from: number; dur: number; startFrom?: number; rate?: number; punch?: { f: number; s: number; x?: number; y?: number }[]; shakes?: number[]; whipIn?: number; whipOut?: number; push?: number; keys?: [number, number, number, number][]; marks?: { from: number; to: number; x: number; y: number; w: number; h: number }[] };
export type Ov = { c: string; from: number; dur: number; props: Record<string, unknown> };
export type Snd = { src: string; from: number; dur: number; startFrom?: number; vol: number; fadeIn?: number; fadeOut?: number };
export const TL: Cue[] = [];
export const OV: Ov[] = [];
export const SFX: Snd[] = [];
export const FOLEY: Snd[] = [];
export const MUSIC: Snd[] = [];
