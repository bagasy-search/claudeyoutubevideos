// stub (lo pisa vlog/tfbcola/montaje.mjs)
import type { CamEvent } from "../tfb/TfbCamera";
import type { LamStop } from "../tfb/TfbLamina";
export const TOTAL_FRAMES_TFBCOLA = 300;
export const VOICE = "tfbcola/tfbcola_voz.m4a";
export const AMB: { src: string; vol: number } | null = null;
export const SEGS: { key: string; kind: "video" | "lamina"; src: string; from: number; dur: number; startFrom: number; stops?: LamStop[] }[] = [];
export const CAM: CamEvent[] = [];
export const CUES: { key: string; kind: string; from: number; dur: number; props: Record<string, unknown> }[] = [];
export const SFX: { key: string; from: number; dur: number; src: string; vol: number }[] = [];
export const MUSIC: { key: string; src: string; from: number; dur: number; vol: number; fadeIn: number; fadeOut: number; startFrom?: number }[] = [];
