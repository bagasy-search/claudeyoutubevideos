export const FPS = 30;
export const TOTAL = 1800;
export const BPM = 120; // tu música debe ser 120 BPM (o ajustá BEAT)
export const BEAT = (FPS * 60) / BPM; // 15 frames exactos

export const S = {S1: 90, S2: 180, S3: 360, S4: 360, S5: 390, S6: 240, S7: 180} as const;
export const CUT = {C1: 90, C2: 270, C3: 630, C4: 990, C5: 1380, C6: 1620} as const;

export const COLORS = {
  bg: '#06060a',
  ink: '#f4f4f6',
  dim: '#8a8a99',
  red: '#ff2d55',
  cyan: '#2ee6ff',
  violet: '#7c5cff',
};

// ⚑ FLAGS para renderizar sin assets:
export const ENABLE_AUDIO = false;   // true cuando tengas los mp3 en public/audio
export const USE_IMAGE_AVATAR = false; // true cuando tengas public/avatar/*.png
