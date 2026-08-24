// cues_valeriapresion.gen.ts — GENERADO por build_valeriapresion.mjs. NO editar a mano.
export type Cue = {
  id: string; start: number; dur: number;
  kind: 'talk'|'full'|'chapter'|'hero'|'stat'|'quote'|'molecule'|'step'|'beforeafter'|'checklist'|'cta'|'carousel'|'lowerthird'|'qr';
  title?: string; kicker?: string; sub?: string; hot?: string[]; accent?: string; mood?: string; variant?: string;
  index?: string; side?: 'left'|'right';
  image?: string; imageA?: string; imageB?: string; labelA?: string; labelB?: string;
  src?: string; video?: boolean; caption?: string; ken?: 'in'|'out'|'left'|'right';
  value?: number; suffix?: string; prefix?: string; decimals?: number; label?: string;
  quote?: string; author?: string; role?: string; centerLabel?: string; nodes?: {label: string}[];
  step?: number; total?: number; items?: string[]; buttonLabel?: string;
  name?: string; topic?: string; cards?: {image: string; index: string; name: string; tag?: string}[]; focus?: number; intro?: boolean;
};
export const TOTAL_FRAMES_VP = 56418;
export const AVATAR_END_F = 17536;
export const BEATS: Cue[] = [
  {
    "id": "talk_1",
    "start": 0,
    "dur": 4.5,
    "kind": "talk",
    "title": "Nunca tome la pastilla de la tensión a esta hora",
    "hot": [
      "a esta hora"
    ],
    "kicker": "Dra. Valeria Alcázar"
  },
  {
    "id": "tr_t00",
    "start": 0,
    "dur": 2.2,
    "kind": "full",
    "src": "broll/vp_t00.mp4",
    "video": true,
    "ken": "in",
    "variant": "none"
  },
  {
    "id": "tr_t01",
    "start": 2.2,
    "dur": 1.3,
    "kind": "full",
    "src": "broll/vp_t01.mp4",
    "video": true,
    "ken": "out",
    "variant": "none"
  },
  {
    "id": "tr_t02",
    "start": 3.5,
    "dur": 1.2,
    "kind": "full",
    "src": "broll/vp_t02.mp4",
    "video": true,
    "ken": "in",
    "variant": "none"
  },
  {
    "id": "tr_t03",
    "start": 4.7,
    "dur": 1.1,
    "kind": "full",
    "src": "broll/vp_t03.mp4",
    "video": true,
    "ken": "out",
    "variant": "none"
  },
  {
    "id": "tr_t04",
    "start": 5.8,
    "dur": 1.1,
    "kind": "full",
    "src": "broll/vp_t04.mp4",
    "video": true,
    "ken": "in",
    "variant": "none"
  },
  {
    "id": "tr_b001",
    "start": 6.9,
    "dur": 1.1,
    "kind": "full",
    "src": "broll/vp_b001.mp4",
    "video": true,
    "ken": "out",
    "variant": "none"
  },
  {
    "id": "tr_t05",
    "start": 8,
    "dur": 1.1,
    "kind": "full",
    "src": "broll/vp_t05.mp4",
    "video": true,
    "ken": "in",
    "variant": "none"
  },
  {
    "id": "tr_t06",
    "start": 9.1,
    "dur": 3,
    "kind": "full",
    "src": "broll/vp_t06.mp4",
    "video": true,
    "ken": "out",
    "variant": "none"
  },
  {
    "id": "tr_t07",
    "start": 12.1,
    "dur": 2.2,
    "kind": "full",
    "src": "broll/vp_t07.mp4",
    "video": true,
    "ken": "in",
    "variant": "none"
  },
  {
    "id": "tr_t08",
    "start": 14.3,
    "dur": 1.3,
    "kind": "full",
    "src": "broll/vp_t08.mp4",
    "video": true,
    "ken": "out",
    "variant": "none"
  },
  {
    "id": "tr_t09",
    "start": 15.6,
    "dur": 2.5,
    "kind": "full",
    "src": "broll/vp_t09.mp4",
    "video": true,
    "ken": "in",
    "variant": "none"
  },
  {
    "id": "tr_t10",
    "start": 18.1,
    "dur": 1.5,
    "kind": "full",
    "src": "broll/vp_t10.mp4",
    "video": true,
    "ken": "out",
    "variant": "none"
  },
  {
    "id": "lowerthird_2",
    "start": 18.12,
    "dur": 5,
    "kind": "lowerthird",
    "title": "7:12 de la mañana",
    "sub": "Elena se toma su pastilla, como cada día desde hace nueve años"
  },
  {
    "id": "tr_t11",
    "start": 19.6,
    "dur": 1.6,
    "kind": "full",
    "src": "broll/vp_t11.mp4",
    "video": true,
    "ken": "in",
    "variant": "none"
  },
  {
    "id": "tr_t12",
    "start": 21.2,
    "dur": 1.6,
    "kind": "full",
    "src": "broll/vp_t12.mp4",
    "video": true,
    "ken": "out",
    "variant": "none"
  },
  {
    "id": "tr_t13",
    "start": 22.8,
    "dur": 1.8,
    "kind": "full",
    "src": "broll/vp_t13.mp4",
    "video": true,
    "ken": "in",
    "variant": "none"
  },
  {
    "id": "tr_t14",
    "start": 24.6,
    "dur": 2,
    "kind": "full",
    "src": "broll/vp_t14.mp4",
    "video": true,
    "ken": "out",
    "variant": "none"
  },
  {
    "id": "tr_t15",
    "start": 26.6,
    "dur": 1.6,
    "kind": "full",
    "src": "broll/vp_t15.mp4",
    "video": true,
    "ken": "in",
    "variant": "none"
  },
  {
    "id": "tr_t16",
    "start": 28.2,
    "dur": 1.8,
    "kind": "full",
    "src": "broll/vp_t16.mp4",
    "video": true,
    "ken": "out",
    "variant": "none"
  },
  {
    "id": "tr_t17",
    "start": 30,
    "dur": 1.9,
    "kind": "full",
    "src": "broll/vp_t17.mp4",
    "video": true,
    "ken": "in",
    "variant": "none"
  },
  {
    "id": "tr_t18",
    "start": 31.9,
    "dur": 1.1,
    "kind": "full",
    "src": "broll/vp_t18.mp4",
    "video": true,
    "ken": "out",
    "variant": "none"
  },
  {
    "id": "tr_t19",
    "start": 33,
    "dur": 1.2,
    "kind": "full",
    "src": "broll/vp_t19.mp4",
    "video": true,
    "ken": "in",
    "variant": "none"
  },
  {
    "id": "tr_t20",
    "start": 34.2,
    "dur": 1.5,
    "kind": "full",
    "src": "broll/vp_t20.mp4",
    "video": true,
    "ken": "out",
    "variant": "none"
  },
  {
    "id": "tr_t21",
    "start": 35.7,
    "dur": 1.6,
    "kind": "full",
    "src": "broll/vp_t21.mp4",
    "video": true,
    "ken": "in",
    "variant": "none"
  },
  {
    "id": "tr_t22",
    "start": 37.3,
    "dur": 2.3,
    "kind": "full",
    "src": "broll/vp_t22.mp4",
    "video": true,
    "ken": "out",
    "variant": "none"
  },
  {
    "id": "tr_t23",
    "start": 39.6,
    "dur": 2,
    "kind": "full",
    "src": "broll/vp_t23.mp4",
    "video": true,
    "ken": "in",
    "variant": "none"
  },
  {
    "id": "tr_t24",
    "start": 41.6,
    "dur": 2.9,
    "kind": "full",
    "src": "broll/vp_t24.mp4",
    "video": true,
    "ken": "out",
    "variant": "none"
  },
  {
    "id": "tr_t25",
    "start": 44.5,
    "dur": 2.3,
    "kind": "full",
    "src": "broll/vp_t25.mp4",
    "video": true,
    "ken": "in",
    "variant": "none"
  },
  {
    "id": "tr_t26",
    "start": 46.8,
    "dur": 1.6,
    "kind": "full",
    "src": "broll/vp_t26.mp4",
    "video": true,
    "ken": "out",
    "variant": "none"
  },
  {
    "id": "tr_t27",
    "start": 48.4,
    "dur": 1.7,
    "kind": "full",
    "src": "broll/vp_t27.mp4",
    "video": true,
    "ken": "in",
    "variant": "none"
  },
  {
    "id": "tr_t28",
    "start": 50.1,
    "dur": 2.7,
    "kind": "full",
    "src": "broll/vp_t28.mp4",
    "video": true,
    "ken": "out",
    "variant": "none"
  },
  {
    "id": "tr_t29",
    "start": 52.8,
    "dur": 2.2,
    "kind": "full",
    "src": "broll/vp_t29.mp4",
    "video": true,
    "ken": "in",
    "variant": "none"
  },
  {
    "id": "tr_t30",
    "start": 55,
    "dur": 1.8,
    "kind": "full",
    "src": "broll/vp_t30.mp4",
    "video": true,
    "ken": "out",
    "variant": "none"
  },
  {
    "id": "tr_t31",
    "start": 56.8,
    "dur": 1.6,
    "kind": "full",
    "src": "broll/vp_t31.mp4",
    "video": true,
    "ken": "in",
    "variant": "none"
  },
  {
    "id": "tr_t32",
    "start": 58.4,
    "dur": 1.6,
    "kind": "full",
    "src": "broll/vp_t32.mp4",
    "video": true,
    "ken": "out",
    "variant": "none"
  },
  {
    "id": "tr_t33",
    "start": 60,
    "dur": 1.8,
    "kind": "full",
    "src": "broll/vp_t33.mp4",
    "video": true,
    "ken": "in",
    "variant": "none"
  },
  {
    "id": "tr_t34",
    "start": 61.8,
    "dur": 2.2,
    "kind": "full",
    "src": "broll/vp_t34.mp4",
    "video": true,
    "ken": "out",
    "variant": "none"
  },
  {
    "id": "tr_t35",
    "start": 64,
    "dur": 3,
    "kind": "full",
    "src": "broll/vp_t35.mp4",
    "video": true,
    "ken": "in",
    "variant": "none"
  },
  {
    "id": "tr_t36",
    "start": 67,
    "dur": 1.4,
    "kind": "full",
    "src": "broll/vp_t36.mp4",
    "video": true,
    "ken": "out",
    "variant": "none"
  },
  {
    "id": "tr_t37",
    "start": 68.4,
    "dur": 0.6,
    "kind": "full",
    "src": "broll/vp_t37.mp4",
    "video": true,
    "ken": "in",
    "variant": "none"
  },
  {
    "id": "tr_t38",
    "start": 69,
    "dur": 2.5,
    "kind": "full",
    "src": "broll/vp_t38.mp4",
    "video": true,
    "ken": "out",
    "variant": "none"
  },
  {
    "id": "tr_t39",
    "start": 71.5,
    "dur": 4,
    "kind": "full",
    "src": "broll/vp_t39.mp4",
    "video": true,
    "ken": "in",
    "variant": "none"
  },
  {
    "id": "full_b015",
    "start": 81.96,
    "dur": 2.67,
    "kind": "full",
    "src": "broll/vp_b015.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "xtra_b015",
    "start": 84.63,
    "dur": 2.67,
    "kind": "full",
    "src": "broll/vp_x15.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b016",
    "start": 87.3,
    "dur": 1.79,
    "kind": "full",
    "src": "broll/vp_b016.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "xtra_b016",
    "start": 89.09,
    "dur": 1.79,
    "kind": "full",
    "src": "broll/vp_x16.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b017",
    "start": 90.88,
    "dur": 2.81,
    "kind": "full",
    "src": "broll/vp_b017.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "xtra_b017",
    "start": 93.69,
    "dur": 2.81,
    "kind": "full",
    "src": "broll/vp_x17.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b018",
    "start": 96.5,
    "dur": 2.64,
    "kind": "full",
    "src": "broll/vp_b018.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "xtra_b018",
    "start": 99.14,
    "dur": 2.64,
    "kind": "full",
    "src": "broll/vp_x18.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b019",
    "start": 101.78,
    "dur": 2.42,
    "kind": "full",
    "src": "broll/vp_b019.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "xtra_b019",
    "start": 104.2,
    "dur": 2.42,
    "kind": "full",
    "src": "broll/vp_x19.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b020",
    "start": 106.62,
    "dur": 3.03,
    "kind": "full",
    "src": "broll/vp_b020.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "xtra_b020",
    "start": 109.65,
    "dur": 3.03,
    "kind": "full",
    "src": "broll/vp_x20.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b021",
    "start": 112.68,
    "dur": 2.71,
    "kind": "full",
    "src": "broll/vp_b021.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "xtra_b021",
    "start": 115.39,
    "dur": 2.71,
    "kind": "full",
    "src": "broll/vp_x21.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "checklist_3",
    "start": 118.1,
    "dur": 6.5,
    "kind": "checklist",
    "title": "Lo que nadie le preguntó en dos años",
    "items": [
      "A qué hora se toma la pastilla",
      "Con qué se la traga",
      "Qué hace su tensión mientras duerme"
    ],
    "mood": "terracotta"
  },
  {
    "id": "full_b023",
    "start": 124.6,
    "dur": 1.24,
    "kind": "full",
    "src": "broll/vp_b023.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "xtra_b023",
    "start": 125.84,
    "dur": 1.24,
    "kind": "full",
    "src": "broll/vp_x23.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b024",
    "start": 127.08,
    "dur": 1.64,
    "kind": "full",
    "src": "broll/vp_b024.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "xtra_b024",
    "start": 128.72,
    "dur": 1.64,
    "kind": "full",
    "src": "broll/vp_x24.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b025",
    "start": 130.36,
    "dur": 1.36,
    "kind": "full",
    "src": "broll/vp_b025.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "xtra_b025",
    "start": 131.72,
    "dur": 1.36,
    "kind": "full",
    "src": "broll/vp_x25.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "stat_4",
    "start": 133.08,
    "dur": 6,
    "kind": "stat",
    "value": 7,
    "suffix": " min",
    "label": "Por paciente, con la sala llena",
    "sub": "En siete minutos se mira un número, y el número miente",
    "mood": "terracotta"
  },
  {
    "id": "full_b027",
    "start": 139.08,
    "dur": 1.8,
    "kind": "full",
    "src": "broll/vp_b027.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "xtra_b027",
    "start": 140.88,
    "dur": 1.8,
    "kind": "full",
    "src": "broll/vp_x27.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b028",
    "start": 142.68,
    "dur": 1.59,
    "kind": "full",
    "src": "broll/vp_b028.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "xtra_b028",
    "start": 144.27,
    "dur": 1.59,
    "kind": "full",
    "src": "broll/vp_x28.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b029",
    "start": 145.86,
    "dur": 3.71,
    "kind": "full",
    "src": "broll/vp_b029.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "xtra_b029",
    "start": 149.57,
    "dur": 3.71,
    "kind": "full",
    "src": "broll/vp_x29.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b030",
    "start": 153.28,
    "dur": 1.48,
    "kind": "full",
    "src": "broll/vp_b030.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "xtra_b030",
    "start": 154.76,
    "dur": 1.48,
    "kind": "full",
    "src": "broll/vp_x30.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b031",
    "start": 156.24,
    "dur": 2.29,
    "kind": "full",
    "src": "broll/vp_b031.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "xtra_b031",
    "start": 158.53,
    "dur": 2.29,
    "kind": "full",
    "src": "broll/vp_x31.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b032",
    "start": 160.82,
    "dur": 1.97,
    "kind": "full",
    "src": "broll/vp_b032.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "xtra_b032",
    "start": 162.79,
    "dur": 1.97,
    "kind": "full",
    "src": "broll/vp_x32.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b033",
    "start": 164.76,
    "dur": 1.46,
    "kind": "full",
    "src": "broll/vp_b033.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "xtra_b033",
    "start": 166.22,
    "dur": 1.46,
    "kind": "full",
    "src": "broll/vp_x33.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b034",
    "start": 167.68,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b034.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b034",
    "start": 171.72,
    "dur": 2.02,
    "kind": "full",
    "src": "img/vp_b034.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b036",
    "start": 179.28,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b036.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b036",
    "start": 183.32,
    "dur": 1.32,
    "kind": "full",
    "src": "img/vp_b036.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b037",
    "start": 184.64,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b037.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "tail_b037",
    "start": 188.68,
    "dur": 3.18,
    "kind": "full",
    "src": "img/vp_b037.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b038",
    "start": 191.86,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b038.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b038",
    "start": 195.9,
    "dur": 0.84,
    "kind": "full",
    "src": "img/vp_b038.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b040",
    "start": 205.86,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b040.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b040",
    "start": 209.9,
    "dur": 3.7,
    "kind": "full",
    "src": "img/vp_b040.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b041",
    "start": 213.6,
    "dur": 3.86,
    "kind": "full",
    "src": "broll/vp_b041.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b042",
    "start": 217.46,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b042.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b042",
    "start": 221.5,
    "dur": 1.5,
    "kind": "full",
    "src": "img/vp_b042.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b044",
    "start": 228.16,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b044.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b044",
    "start": 232.2,
    "dur": 1.64,
    "kind": "full",
    "src": "img/vp_b044.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b045",
    "start": 233.84,
    "dur": 3.54,
    "kind": "full",
    "src": "broll/vp_b045.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b046",
    "start": 237.38,
    "dur": 3.18,
    "kind": "full",
    "src": "broll/vp_b046.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b048",
    "start": 247.96,
    "dur": 2.52,
    "kind": "full",
    "src": "broll/vp_b048.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "beforeafter_5",
    "start": 250.48,
    "dur": 6.5,
    "kind": "beforeafter",
    "title": "Lo que le miden y lo que pasa de verdad",
    "labelA": "Una fotografía",
    "labelB": "Una película de 24 horas",
    "imageA": "img/vp_b051.jpg",
    "imageB": "img/vp_b053.jpg"
  },
  {
    "id": "full_b050",
    "start": 256.98,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b050.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b050",
    "start": 261.02,
    "dur": 0.78,
    "kind": "full",
    "src": "img/vp_b050.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b052",
    "start": 264.54,
    "dur": 2.5,
    "kind": "full",
    "src": "broll/vp_b052.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b053",
    "start": 267.04,
    "dur": 3.94,
    "kind": "full",
    "src": "broll/vp_b053.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b054",
    "start": 270.98,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b054.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "stat_6",
    "start": 276.52,
    "dur": 6,
    "kind": "stat",
    "value": 20,
    "suffix": "%",
    "label": "Lo que debe BAJAR su tensión mientras duerme",
    "sub": "A eso se le llama ser descendedor",
    "mood": "sage"
  },
  {
    "id": "stat_7",
    "start": 284.98,
    "dur": 6,
    "kind": "stat",
    "value": 100000,
    "label": "Latidos al día, todos los días",
    "sub": "El corazón no se jubila",
    "mood": "gold"
  },
  {
    "id": "full_b058",
    "start": 290.98,
    "dur": 2.64,
    "kind": "full",
    "src": "broll/vp_b058.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b060",
    "start": 298.66,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b060.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b061",
    "start": 303.4,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b061.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "molecule_8",
    "start": 308.1,
    "dur": 6.5,
    "kind": "molecule",
    "centerLabel": "Ascenso matutino",
    "nodes": [
      {
        "label": "Cortisol"
      },
      {
        "label": "Adrenalina"
      },
      {
        "label": "Vasos estrechos"
      },
      {
        "label": "Sangre espesa"
      }
    ],
    "sub": "Su cuerpo se prepara para despertarse desde las cuatro"
  },
  {
    "id": "full_b064",
    "start": 317.72,
    "dur": 2.46,
    "kind": "full",
    "src": "broll/vp_b064.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b065",
    "start": 320.18,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b065.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b066",
    "start": 324.22,
    "dur": 3.74,
    "kind": "full",
    "src": "broll/vp_b066.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b068",
    "start": 332.82,
    "dur": 2.66,
    "kind": "full",
    "src": "broll/vp_b068.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "stat_9",
    "start": 335.48,
    "dur": 6.5,
    "kind": "stat",
    "value": 40,
    "suffix": "%",
    "prefix": "+",
    "label": "Más infartos entre las 6 y las 12 de la mañana",
    "sub": "La franja más peligrosa del día",
    "mood": "terracotta"
  },
  {
    "id": "full_b070",
    "start": 341.98,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b070.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b072",
    "start": 350.86,
    "dur": 2.42,
    "kind": "full",
    "src": "broll/vp_b072.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b073",
    "start": 353.28,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b073.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "tail_b073",
    "start": 357.32,
    "dur": 1.14,
    "kind": "full",
    "src": "img/vp_b073.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b074",
    "start": 358.46,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b074.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b074",
    "start": 362.5,
    "dur": 1.1,
    "kind": "full",
    "src": "img/vp_b074.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "chapter_10",
    "start": 366.84,
    "dur": 6.5,
    "kind": "chapter",
    "index": "Pista 1",
    "title": "El blíster encima del microondas",
    "sub": "La hora que no era una hora"
  },
  {
    "id": "full_b078",
    "start": 373.72,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b078.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b078",
    "start": 377.76,
    "dur": 1.26,
    "kind": "full",
    "src": "img/vp_b078.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b080",
    "start": 383.78,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b080.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b080",
    "start": 387.82,
    "dur": 1.18,
    "kind": "full",
    "src": "img/vp_b080.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b081",
    "start": 389,
    "dur": 2.68,
    "kind": "full",
    "src": "broll/vp_b081.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b082",
    "start": 391.68,
    "dur": 2.92,
    "kind": "full",
    "src": "broll/vp_b082.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "hero_11",
    "start": 399.3,
    "dur": 6,
    "kind": "hero",
    "kicker": "Error 1",
    "title": "No tener una hora. Tener un rato.",
    "sub": "El valle del medicamento se mueve con usted",
    "mood": "terracotta"
  },
  {
    "id": "full_b086",
    "start": 405.7,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b086.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b086",
    "start": 409.74,
    "dur": 1.4,
    "kind": "full",
    "src": "img/vp_b086.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "molecule_12",
    "start": 415.36,
    "dur": 6.5,
    "kind": "molecule",
    "centerLabel": "El valle",
    "nodes": [
      {
        "label": "Sube"
      },
      {
        "label": "Máximo"
      },
      {
        "label": "Baja"
      },
      {
        "label": "Valle"
      }
    ],
    "title": "Toda pastilla tiene un punto flojo",
    "sub": "Usted no lo puede eliminar: sólo decidir dónde cae"
  },
  {
    "id": "full_b089",
    "start": 421.86,
    "dur": 3.44,
    "kind": "full",
    "src": "broll/vp_b089.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b090",
    "start": 425.3,
    "dur": 3.62,
    "kind": "full",
    "src": "broll/vp_b090.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b092",
    "start": 431.92,
    "dur": 3.12,
    "kind": "full",
    "src": "broll/vp_b092.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b093",
    "start": 435.04,
    "dur": 3.72,
    "kind": "full",
    "src": "broll/vp_b093.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b094",
    "start": 438.76,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b094.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b094",
    "start": 442.8,
    "dur": 2.56,
    "kind": "full",
    "src": "img/vp_b094.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "quote_13",
    "start": 449.84,
    "dur": 6,
    "kind": "quote",
    "quote": "Nueve años entrando en la franja más peligrosa del día con el paraguas cerrado.",
    "author": "El caso de Elena"
  },
  {
    "id": "full_b096",
    "start": 455.84,
    "dur": 3.28,
    "kind": "full",
    "src": "broll/vp_b096.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b097",
    "start": 459.12,
    "dur": 3.68,
    "kind": "full",
    "src": "broll/vp_b097.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b098",
    "start": 462.8,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b098.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b098",
    "start": 466.84,
    "dur": 1.3,
    "kind": "full",
    "src": "img/vp_b098.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b100",
    "start": 472.92,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b100.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b100",
    "start": 476.96,
    "dur": 1.12,
    "kind": "full",
    "src": "img/vp_b100.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b101",
    "start": 478.08,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b101.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "tail_b101",
    "start": 482.12,
    "dur": 2.74,
    "kind": "full",
    "src": "img/vp_b101.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b102",
    "start": 484.86,
    "dur": 1.82,
    "kind": "full",
    "src": "broll/vp_b102.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "lowerthird_14",
    "start": 486.68,
    "dur": 5.5,
    "kind": "lowerthird",
    "title": "Diuréticos: SIEMPRE por la mañana",
    "sub": "Nunca después de la merienda"
  },
  {
    "id": "full_b104",
    "start": 492.84,
    "dur": 3.86,
    "kind": "full",
    "src": "broll/vp_b104.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b105",
    "start": 496.7,
    "dur": 2.68,
    "kind": "full",
    "src": "broll/vp_b105.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b106",
    "start": 499.38,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b106.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b106",
    "start": 503.42,
    "dur": 1.94,
    "kind": "full",
    "src": "img/vp_b106.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b108",
    "start": 508.78,
    "dur": 2.8,
    "kind": "full",
    "src": "broll/vp_b108.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b109",
    "start": 511.58,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b109.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "tail_b109",
    "start": 515.62,
    "dur": 3.3,
    "kind": "full",
    "src": "img/vp_b109.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b110",
    "start": 518.92,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b110.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b110",
    "start": 522.96,
    "dur": 1.4,
    "kind": "full",
    "src": "img/vp_b110.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "chapter_15",
    "start": 525.98,
    "dur": 6.5,
    "kind": "chapter",
    "index": "Pista 5",
    "title": "La caída de febrero",
    "sub": "Lo que no le contó a nadie"
  },
  {
    "id": "full_b112",
    "start": 532.48,
    "dur": 2.88,
    "kind": "full",
    "src": "broll/vp_b112.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b113",
    "start": 535.36,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b113.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "tail_b113",
    "start": 539.4,
    "dur": 0.88,
    "kind": "full",
    "src": "img/vp_b113.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b114",
    "start": 540.28,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b114.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b114",
    "start": 544.32,
    "dur": 3.62,
    "kind": "full",
    "src": "img/vp_b114.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b116",
    "start": 554.74,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b116.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b116",
    "start": 558.78,
    "dur": 1.74,
    "kind": "full",
    "src": "img/vp_b116.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "quote_16",
    "start": 560.52,
    "dur": 6.5,
    "kind": "quote",
    "quote": "La mejor hora es la que usted puede repetir los 365 días del año.",
    "author": "Dra. Valeria Alcázar"
  },
  {
    "id": "full_b118",
    "start": 567.02,
    "dur": 3.8,
    "kind": "full",
    "src": "broll/vp_b118.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b120",
    "start": 575.6,
    "dur": 3.04,
    "kind": "full",
    "src": "broll/vp_b120.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b121",
    "start": 578.64,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b121.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "tail_b121",
    "start": 582.68,
    "dur": 2.1,
    "kind": "full",
    "src": "img/vp_b121.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "chapter_17",
    "start": 584.78,
    "dur": 6.5,
    "kind": "chapter",
    "index": "Pista 2",
    "title": "El vaso de zumo",
    "sub": "Un desayuno que peleaba contra la pastilla"
  },
  {
    "id": "full_b123",
    "start": 591.28,
    "dur": 2.88,
    "kind": "full",
    "src": "broll/vp_b123.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b124",
    "start": 594.16,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b124.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b124",
    "start": 598.2,
    "dur": 2.78,
    "kind": "full",
    "src": "img/vp_b124.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b125",
    "start": 600.98,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b125.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "tail_b125",
    "start": 605.02,
    "dur": 2.34,
    "kind": "full",
    "src": "img/vp_b125.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b126",
    "start": 607.36,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b126.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b126",
    "start": 611.4,
    "dur": 0.92,
    "kind": "full",
    "src": "img/vp_b126.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b127",
    "start": 612.32,
    "dur": 3.88,
    "kind": "full",
    "src": "broll/vp_b127.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b128",
    "start": 616.2,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b128.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b128",
    "start": 620.24,
    "dur": 1.62,
    "kind": "full",
    "src": "img/vp_b128.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b129",
    "start": 621.86,
    "dur": 2.86,
    "kind": "full",
    "src": "broll/vp_b129.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b130",
    "start": 624.72,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b130.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "gap_b131_629",
    "start": 628.76,
    "dur": 0.64,
    "kind": "full",
    "src": "img/vp_b131.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b131",
    "start": 629.4,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b131.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "tail_b131",
    "start": 633.44,
    "dur": 0.98,
    "kind": "full",
    "src": "img/vp_b131.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "carousel_18",
    "start": 634.42,
    "dur": 6.5,
    "kind": "carousel",
    "cards": [
      {
        "index": "N.º 01",
        "name": "Pomelo",
        "tag": "Bloquea la enzima",
        "image": "img/vp_b132.jpg"
      },
      {
        "index": "N.º 02",
        "name": "Sal de potasio",
        "tag": "El bote azul",
        "image": "img/vp_b143.jpg"
      },
      {
        "index": "N.º 03",
        "name": "Regaliz",
        "tag": "La infusión de la noche",
        "image": "img/vp_b159.jpg"
      },
      {
        "index": "N.º 04",
        "name": "Antiinflamatorio",
        "tag": "El de todos los días",
        "image": "img/vp_b168.jpg"
      }
    ],
    "focus": 0,
    "intro": true,
    "title": "Lo que pelea contra su pastilla"
  },
  {
    "id": "molecule_19",
    "start": 639.38,
    "dur": 6.5,
    "kind": "molecule",
    "centerLabel": "Enzima bloqueada",
    "nodes": [
      {
        "label": "Pomelo"
      },
      {
        "label": "Intestino"
      },
      {
        "label": "Hígado"
      },
      {
        "label": "Se acumula"
      }
    ],
    "title": "Por qué la misma pastilla pasa a ser una dosis mayor",
    "sub": "Amlodipino, felodipino, nifedipino"
  },
  {
    "id": "full_b133",
    "start": 640.92,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b133.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "tail_b133",
    "start": 644.96,
    "dur": 0.76,
    "kind": "full",
    "src": "img/vp_b133.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b134",
    "start": 645.88,
    "dur": 3.86,
    "kind": "full",
    "src": "broll/vp_b134.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b135",
    "start": 649.74,
    "dur": 3.4,
    "kind": "full",
    "src": "broll/vp_b135.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b136",
    "start": 653.14,
    "dur": 2.56,
    "kind": "full",
    "src": "broll/vp_b136.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b137",
    "start": 655.7,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b137.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "tail_b137",
    "start": 659.74,
    "dur": 2.76,
    "kind": "full",
    "src": "img/vp_b137.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b138",
    "start": 662.5,
    "dur": 3.26,
    "kind": "full",
    "src": "img/vp_b138.jpg",
    "video": false,
    "ken": "left"
  },
  {
    "id": "full_b139",
    "start": 665.76,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b139.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "tail_b139",
    "start": 669.8,
    "dur": 3,
    "kind": "full",
    "src": "img/vp_b139.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b140",
    "start": 672.8,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b140.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b140",
    "start": 676.84,
    "dur": 2.4,
    "kind": "full",
    "src": "img/vp_b140.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b141",
    "start": 679.24,
    "dur": 2.6,
    "kind": "full",
    "src": "broll/vp_b141.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b142",
    "start": 681.84,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b142.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b142",
    "start": 685.88,
    "dur": 0.74,
    "kind": "full",
    "src": "img/vp_b142.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b143",
    "start": 686.62,
    "dur": 1.54,
    "kind": "full",
    "src": "broll/vp_b143.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "carousel_20",
    "start": 688.16,
    "dur": 6,
    "kind": "carousel",
    "cards": [
      {
        "index": "N.º 01",
        "name": "Pomelo",
        "tag": "Bloquea la enzima",
        "image": "img/vp_b132.jpg"
      },
      {
        "index": "N.º 02",
        "name": "Sal de potasio",
        "tag": "El bote azul",
        "image": "img/vp_b143.jpg"
      },
      {
        "index": "N.º 03",
        "name": "Regaliz",
        "tag": "La infusión de la noche",
        "image": "img/vp_b159.jpg"
      },
      {
        "index": "N.º 04",
        "name": "Antiinflamatorio",
        "tag": "El de todos los días",
        "image": "img/vp_b168.jpg"
      }
    ],
    "focus": 1,
    "intro": false,
    "title": "Lo que pelea contra su pastilla"
  },
  {
    "id": "full_b144",
    "start": 694.16,
    "dur": 2.96,
    "kind": "full",
    "src": "broll/vp_b144.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b145",
    "start": 697.12,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b145.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "tail_b145",
    "start": 701.16,
    "dur": 1.08,
    "kind": "full",
    "src": "img/vp_b145.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b146",
    "start": 702.24,
    "dur": 2.6,
    "kind": "full",
    "src": "broll/vp_b146.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "beforeafter_21",
    "start": 704.84,
    "dur": 6,
    "kind": "beforeafter",
    "title": "La sal que se compra para cuidarse",
    "labelA": "Dice: bajo en sodio",
    "labelB": "Trae: potasio",
    "imageA": "img/vp_b143.jpg",
    "imageB": "img/vp_b146.jpg"
  },
  {
    "id": "gap_b148_711",
    "start": 710.84,
    "dur": 0.54,
    "kind": "full",
    "src": "img/vp_b148.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b148",
    "start": 711.38,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b148.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b148",
    "start": 715.42,
    "dur": 3.26,
    "kind": "full",
    "src": "img/vp_b148.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b149",
    "start": 718.68,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b149.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "tail_b149",
    "start": 722.72,
    "dur": 2.76,
    "kind": "full",
    "src": "img/vp_b149.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b150",
    "start": 725.48,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b150.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b150",
    "start": 729.52,
    "dur": 1.22,
    "kind": "full",
    "src": "img/vp_b150.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b151",
    "start": 730.74,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b151.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "tail_b151",
    "start": 734.78,
    "dur": 1.44,
    "kind": "full",
    "src": "img/vp_b151.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b152",
    "start": 736.22,
    "dur": 0.94,
    "kind": "full",
    "src": "broll/vp_b152.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "checklist_22",
    "start": 737.16,
    "dur": 6,
    "kind": "checklist",
    "title": "Para bajar la sal sin bote azul",
    "items": [
      "Limón",
      "Ajo",
      "Pimentón",
      "Comino",
      "Orégano",
      "Vinagre y hierbas frescas"
    ],
    "mood": "sage"
  },
  {
    "id": "full_b153",
    "start": 743.16,
    "dur": 3.78,
    "kind": "full",
    "src": "broll/vp_b153.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b154",
    "start": 746.94,
    "dur": 2.28,
    "kind": "full",
    "src": "broll/vp_b154.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "stat_23",
    "start": 749.22,
    "dur": 6,
    "kind": "stat",
    "value": 5,
    "suffix": " g",
    "label": "Sal al día como máximo",
    "sub": "Una cucharadita rasa, contando la que ya viene escondida",
    "mood": "gold"
  },
  {
    "id": "full_b155",
    "start": 755.22,
    "dur": 3.38,
    "kind": "full",
    "src": "broll/vp_b155.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b156",
    "start": 758.6,
    "dur": 2.4,
    "kind": "full",
    "src": "broll/vp_b156.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b157",
    "start": 761,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b157.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "tail_b157",
    "start": 765.04,
    "dur": 1.02,
    "kind": "full",
    "src": "img/vp_b157.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "carousel_24",
    "start": 766.06,
    "dur": 6,
    "kind": "carousel",
    "cards": [
      {
        "index": "N.º 01",
        "name": "Pomelo",
        "tag": "Bloquea la enzima",
        "image": "img/vp_b132.jpg"
      },
      {
        "index": "N.º 02",
        "name": "Sal de potasio",
        "tag": "El bote azul",
        "image": "img/vp_b143.jpg"
      },
      {
        "index": "N.º 03",
        "name": "Regaliz",
        "tag": "La infusión de la noche",
        "image": "img/vp_b159.jpg"
      },
      {
        "index": "N.º 04",
        "name": "Antiinflamatorio",
        "tag": "El de todos los días",
        "image": "img/vp_b168.jpg"
      }
    ],
    "focus": 2,
    "intro": false,
    "title": "Lo que pelea contra su pastilla"
  },
  {
    "id": "full_b160",
    "start": 772.06,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b160.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b161",
    "start": 776.1,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b161.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "gap_b162_780",
    "start": 780.14,
    "dur": 0.6,
    "kind": "full",
    "src": "img/vp_b162.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b162",
    "start": 780.74,
    "dur": 2.22,
    "kind": "full",
    "src": "broll/vp_b162.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "molecule_25",
    "start": 782.96,
    "dur": 6,
    "kind": "molecule",
    "centerLabel": "Regaliz",
    "nodes": [
      {
        "label": "Retiene sodio"
      },
      {
        "label": "Pierde potasio"
      },
      {
        "label": "Sube la tensión"
      }
    ],
    "title": "La tacita de la noche",
    "sub": "Dele la vuelta a la caja y lea los ingredientes"
  },
  {
    "id": "full_b164",
    "start": 788.96,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b164.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b164",
    "start": 793,
    "dur": 1.72,
    "kind": "full",
    "src": "img/vp_b164.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b165",
    "start": 794.72,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b165.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "tail_b165",
    "start": 798.76,
    "dur": 1.78,
    "kind": "full",
    "src": "img/vp_b165.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b166",
    "start": 800.54,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b166.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "gap_b167_805",
    "start": 804.58,
    "dur": 0.24,
    "kind": "full",
    "src": "img/vp_b167.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b167",
    "start": 804.82,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b167.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "gap_b168_809",
    "start": 808.86,
    "dur": 0.54,
    "kind": "full",
    "src": "img/vp_b168.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "carousel_26",
    "start": 809.4,
    "dur": 6,
    "kind": "carousel",
    "cards": [
      {
        "index": "N.º 01",
        "name": "Pomelo",
        "tag": "Bloquea la enzima",
        "image": "img/vp_b132.jpg"
      },
      {
        "index": "N.º 02",
        "name": "Sal de potasio",
        "tag": "El bote azul",
        "image": "img/vp_b143.jpg"
      },
      {
        "index": "N.º 03",
        "name": "Regaliz",
        "tag": "La infusión de la noche",
        "image": "img/vp_b159.jpg"
      },
      {
        "index": "N.º 04",
        "name": "Antiinflamatorio",
        "tag": "El de todos los días",
        "image": "img/vp_b168.jpg"
      }
    ],
    "focus": 3,
    "intro": false,
    "title": "Lo que pelea contra su pastilla"
  },
  {
    "id": "full_b169",
    "start": 815.4,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b169.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "tail_b169",
    "start": 819.44,
    "dur": 0.92,
    "kind": "full",
    "src": "img/vp_b169.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b170",
    "start": 820.36,
    "dur": 3.44,
    "kind": "full",
    "src": "broll/vp_b170.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "hero_27",
    "start": 823.8,
    "dur": 6,
    "kind": "hero",
    "kicker": "El más frecuente",
    "title": "El antiinflamatorio de cada mañana",
    "sub": "Retiene líquido y sal, y le quita fuerza a casi toda la medicación",
    "mood": "terracotta"
  },
  {
    "id": "full_b171",
    "start": 829.8,
    "dur": 1.42,
    "kind": "full",
    "src": "broll/vp_b171.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b172",
    "start": 831.22,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b172.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b172",
    "start": 835.26,
    "dur": 1.1,
    "kind": "full",
    "src": "img/vp_b172.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b173",
    "start": 836.36,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b173.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "tail_b173",
    "start": 840.4,
    "dur": 2.74,
    "kind": "full",
    "src": "img/vp_b173.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b174",
    "start": 843.14,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b174.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b174",
    "start": 847.18,
    "dur": 2.94,
    "kind": "full",
    "src": "img/vp_b174.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b175",
    "start": 850.12,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b175.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "tail_b175",
    "start": 854.16,
    "dur": 2.1,
    "kind": "full",
    "src": "img/vp_b175.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b176",
    "start": 856.26,
    "dur": 2.76,
    "kind": "full",
    "src": "broll/vp_b176.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b177",
    "start": 859.02,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b177.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "tail_b177",
    "start": 863.06,
    "dur": 1.62,
    "kind": "full",
    "src": "img/vp_b177.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b178",
    "start": 864.68,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b178.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "gap_b179_869",
    "start": 868.72,
    "dur": 0.1,
    "kind": "full",
    "src": "img/vp_b179.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b179",
    "start": 868.82,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b179.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "gap_b180_873",
    "start": 872.86,
    "dur": 0.14,
    "kind": "full",
    "src": "img/vp_b180.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b180",
    "start": 873,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b180.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "gap_b181_877",
    "start": 877.04,
    "dur": 0.64,
    "kind": "full",
    "src": "img/vp_b181.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b181",
    "start": 877.68,
    "dur": 2.66,
    "kind": "full",
    "src": "broll/vp_b181.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "gap_b182_880",
    "start": 880.34,
    "dur": 0.54,
    "kind": "full",
    "src": "img/vp_b182.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "quote_28",
    "start": 880.88,
    "dur": 6,
    "kind": "quote",
    "quote": "Muchas veces el problema no está en la pastilla: está en lo que la rodea.",
    "author": "Dra. Valeria Alcázar"
  },
  {
    "id": "full_b183",
    "start": 886.88,
    "dur": 0.82,
    "kind": "full",
    "src": "broll/vp_b183.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b184",
    "start": 887.7,
    "dur": 1.88,
    "kind": "full",
    "src": "broll/vp_b184.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "chapter_29",
    "start": 889.58,
    "dur": 6.5,
    "kind": "chapter",
    "index": "Pista 3",
    "title": "La libreta",
    "sub": "Dos años de números falsos"
  },
  {
    "id": "full_b185",
    "start": 896.08,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vp_b185.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b186",
    "start": 899.78,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b186.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b186",
    "start": 903.82,
    "dur": 2.06,
    "kind": "full",
    "src": "img/vp_b186.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b187",
    "start": 905.88,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b187.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "tail_b187",
    "start": 909.92,
    "dur": 1.24,
    "kind": "full",
    "src": "img/vp_b187.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b188",
    "start": 911.16,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b188.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b188",
    "start": 915.2,
    "dur": 0.94,
    "kind": "full",
    "src": "img/vp_b188.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b189",
    "start": 916.14,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b189.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "tail_b189",
    "start": 920.18,
    "dur": 2.36,
    "kind": "full",
    "src": "img/vp_b189.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b190",
    "start": 922.54,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b190.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "gap_b191_927",
    "start": 926.58,
    "dur": 0.64,
    "kind": "full",
    "src": "img/vp_b191.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b191",
    "start": 927.22,
    "dur": 3.44,
    "kind": "full",
    "src": "broll/vp_b191.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b192",
    "start": 930.66,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b192.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "gap_b193_935",
    "start": 934.7,
    "dur": 0.2,
    "kind": "full",
    "src": "img/vp_b193.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b193",
    "start": 934.9,
    "dur": 2.7,
    "kind": "full",
    "src": "broll/vp_b193.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b194",
    "start": 937.6,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b194.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b194",
    "start": 941.64,
    "dur": 1.02,
    "kind": "full",
    "src": "img/vp_b194.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b195",
    "start": 942.66,
    "dur": 3.06,
    "kind": "full",
    "src": "broll/vp_b195.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "stat_30",
    "start": 945.72,
    "dur": 6,
    "kind": "stat",
    "value": 10,
    "prefix": "+",
    "label": "Puntos que sube una medición mal hecha",
    "sub": "La vejiga llena, hablar, el brazo colgando",
    "mood": "terracotta"
  },
  {
    "id": "full_b197",
    "start": 951.72,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b197.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b198",
    "start": 955.76,
    "dur": 2.72,
    "kind": "full",
    "src": "broll/vp_b198.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "checklist_31",
    "start": 958.48,
    "dur": 6.5,
    "kind": "checklist",
    "title": "Lo que le falsea la medición",
    "items": [
      "La vejiga llena",
      "El brazo colgando",
      "Las piernas cruzadas",
      "Sin la espalda apoyada",
      "Hablando mientras mide",
      "El manguito sobre el jersey"
    ],
    "mood": "terracotta"
  },
  {
    "id": "full_b200",
    "start": 964.98,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b200.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "gap_b201_969",
    "start": 969.02,
    "dur": 0.06,
    "kind": "full",
    "src": "img/vp_b201.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b201",
    "start": 969.08,
    "dur": 2.88,
    "kind": "full",
    "src": "broll/vp_b201.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b202",
    "start": 971.96,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b202.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b202",
    "start": 976,
    "dur": 1.22,
    "kind": "full",
    "src": "img/vp_b202.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b203",
    "start": 977.22,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b203.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "gap_b204_981",
    "start": 981.26,
    "dur": 0.52,
    "kind": "full",
    "src": "img/vp_b204.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b204",
    "start": 981.78,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b204.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b204",
    "start": 985.82,
    "dur": 2,
    "kind": "full",
    "src": "img/vp_b204.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b205",
    "start": 987.82,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b205.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "tail_b205",
    "start": 991.86,
    "dur": 1.46,
    "kind": "full",
    "src": "img/vp_b205.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b206",
    "start": 993.32,
    "dur": 2.8,
    "kind": "full",
    "src": "broll/vp_b206.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "checklist_32",
    "start": 996.12,
    "dur": 6.5,
    "kind": "checklist",
    "title": "Cómo se mide de verdad",
    "items": [
      "Al baño primero",
      "Silla con respaldo, pies planos",
      "Brazo desnudo a la altura del corazón",
      "Cinco minutos quieto y callado",
      "Dos mediciones y la media"
    ],
    "mood": "sage"
  },
  {
    "id": "gap_b209_1003",
    "start": 1002.62,
    "dur": 0.64,
    "kind": "full",
    "src": "img/vp_b209.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b209",
    "start": 1003.26,
    "dur": 3.54,
    "kind": "full",
    "src": "broll/vp_b209.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b210",
    "start": 1006.8,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b210.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b210",
    "start": 1010.84,
    "dur": 0.88,
    "kind": "full",
    "src": "img/vp_b210.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b211",
    "start": 1011.72,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b211.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "tail_b211",
    "start": 1015.76,
    "dur": 0.8,
    "kind": "full",
    "src": "img/vp_b211.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b212",
    "start": 1016.56,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b212.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "gap_b213_1021",
    "start": 1020.6,
    "dur": 0.38,
    "kind": "full",
    "src": "img/vp_b213.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b213",
    "start": 1020.98,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b213.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "tail_b213",
    "start": 1025.02,
    "dur": 0.9,
    "kind": "full",
    "src": "img/vp_b213.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b214",
    "start": 1025.92,
    "dur": 2.5,
    "kind": "full",
    "src": "broll/vp_b214.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b215",
    "start": 1028.42,
    "dur": 2.62,
    "kind": "full",
    "src": "broll/vp_b215.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b216",
    "start": 1031.04,
    "dur": 2.78,
    "kind": "full",
    "src": "broll/vp_b216.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b217",
    "start": 1033.82,
    "dur": 2.96,
    "kind": "full",
    "src": "broll/vp_b217.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b218",
    "start": 1036.78,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b218.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "gap_b219_1041",
    "start": 1040.82,
    "dur": 0.08,
    "kind": "full",
    "src": "img/vp_b219.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b219",
    "start": 1040.9,
    "dur": 0.98,
    "kind": "full",
    "src": "broll/vp_b219.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "lowerthird_33",
    "start": 1041.88,
    "dur": 5.5,
    "kind": "lowerthird",
    "title": "La primera vez: los dos brazos",
    "sub": "Desde ahí, siempre el que dio el número más alto"
  },
  {
    "id": "full_b220",
    "start": 1047.38,
    "dur": 2.16,
    "kind": "full",
    "src": "broll/vp_b220.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b221",
    "start": 1049.54,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b221.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "tail_b221",
    "start": 1053.58,
    "dur": 1.88,
    "kind": "full",
    "src": "img/vp_b221.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b222",
    "start": 1055.46,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b222.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b222",
    "start": 1059.5,
    "dur": 1.16,
    "kind": "full",
    "src": "img/vp_b222.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b223",
    "start": 1060.66,
    "dur": 3.74,
    "kind": "full",
    "src": "broll/vp_b223.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b224",
    "start": 1064.4,
    "dur": 2.38,
    "kind": "full",
    "src": "broll/vp_b224.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b225",
    "start": 1066.78,
    "dur": 3.38,
    "kind": "full",
    "src": "broll/vp_b225.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "checklist_34",
    "start": 1070.16,
    "dur": 6,
    "kind": "checklist",
    "title": "La semana que sí le sirve a su médico",
    "items": [
      "Dos por la mañana, antes de la pastilla",
      "Dos por la noche, antes de cenar",
      "Con su fecha y su hora"
    ],
    "mood": "sage"
  },
  {
    "id": "full_b227",
    "start": 1076.16,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b227.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "gap_b228_1080",
    "start": 1080.2,
    "dur": 0.08,
    "kind": "full",
    "src": "img/vp_b228.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b228",
    "start": 1080.28,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b228.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b228",
    "start": 1084.32,
    "dur": 2.04,
    "kind": "full",
    "src": "img/vp_b228.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b229",
    "start": 1086.36,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b229.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "tail_b229",
    "start": 1090.4,
    "dur": 1.88,
    "kind": "full",
    "src": "img/vp_b229.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "beforeafter_35",
    "start": 1092.28,
    "dur": 6.5,
    "kind": "beforeafter",
    "title": "La misma señora, el mismo día",
    "labelA": "Su libreta decía",
    "labelB": "Su cuerpo decía",
    "imageA": "img/vp_b186.jpg",
    "imageB": "img/vp_b230.jpg"
  },
  {
    "id": "chapter_36",
    "start": 1096.76,
    "dur": 6.5,
    "kind": "chapter",
    "index": "Pista 4",
    "title": "Los huecos en el blíster",
    "sub": "Las dosis que faltaban"
  },
  {
    "id": "full_b231",
    "start": 1098.78,
    "dur": 1.08,
    "kind": "full",
    "src": "broll/vp_b231.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b232",
    "start": 1103.26,
    "dur": 1.32,
    "kind": "full",
    "src": "broll/vp_b232.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b233",
    "start": 1104.58,
    "dur": 3.96,
    "kind": "full",
    "src": "broll/vp_b233.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b234",
    "start": 1108.54,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b234.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "gap_b235_1113",
    "start": 1112.58,
    "dur": 0.4,
    "kind": "full",
    "src": "img/vp_b235.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b235",
    "start": 1112.98,
    "dur": 3.02,
    "kind": "full",
    "src": "broll/vp_b235.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b236",
    "start": 1116,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b236.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b236",
    "start": 1120.04,
    "dur": 1.9,
    "kind": "full",
    "src": "img/vp_b236.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b237",
    "start": 1121.94,
    "dur": 4.5,
    "kind": "full",
    "src": "img/vp_b237.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b238",
    "start": 1126.44,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b238.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b238",
    "start": 1130.48,
    "dur": 0.72,
    "kind": "full",
    "src": "img/vp_b238.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b239",
    "start": 1131.2,
    "dur": 3.64,
    "kind": "full",
    "src": "broll/vp_b239.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "stat_37",
    "start": 1134.84,
    "dur": 6.5,
    "kind": "stat",
    "value": 50,
    "suffix": "%",
    "label": "No toman su medicación como se la recetaron",
    "sub": "No es descuido: es lo normal sin un sistema",
    "mood": "terracotta"
  },
  {
    "id": "gap_b241_1141",
    "start": 1141.34,
    "dur": 0.1,
    "kind": "full",
    "src": "img/vp_b241.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b241",
    "start": 1141.44,
    "dur": 3.32,
    "kind": "full",
    "src": "broll/vp_b241.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "hero_38",
    "start": 1144.76,
    "dur": 6,
    "kind": "hero",
    "kicker": "Por qué es peligroso",
    "title": "No duele. No avisa.",
    "sub": "Encontrarse bien no es una prueba de nada",
    "mood": "terracotta"
  },
  {
    "id": "full_b243",
    "start": 1150.76,
    "dur": 3.28,
    "kind": "full",
    "src": "broll/vp_b243.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b244",
    "start": 1154.04,
    "dur": 2.3,
    "kind": "full",
    "src": "broll/vp_b244.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b245",
    "start": 1156.34,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b245.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "tail_b245",
    "start": 1160.38,
    "dur": 3.58,
    "kind": "full",
    "src": "img/vp_b245.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b246",
    "start": 1163.96,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b246.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b246",
    "start": 1168,
    "dur": 2.12,
    "kind": "full",
    "src": "img/vp_b246.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b247",
    "start": 1170.12,
    "dur": 3.3,
    "kind": "full",
    "src": "broll/vp_b247.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b248",
    "start": 1173.42,
    "dur": 1.62,
    "kind": "full",
    "src": "broll/vp_b248.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "lowerthird_39",
    "start": 1175.04,
    "dur": 5.5,
    "kind": "lowerthird",
    "title": "Si olvidó una dosis: NUNCA dos juntas",
    "sub": "Mareo, visión borrosa y caída"
  },
  {
    "id": "full_b249",
    "start": 1180.54,
    "dur": 1.82,
    "kind": "full",
    "src": "broll/vp_b249.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b250",
    "start": 1182.36,
    "dur": 3.3,
    "kind": "full",
    "src": "broll/vp_b250.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b251",
    "start": 1185.66,
    "dur": 2.76,
    "kind": "full",
    "src": "broll/vp_b251.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b252",
    "start": 1188.42,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b252.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b252",
    "start": 1192.46,
    "dur": 1.8,
    "kind": "full",
    "src": "img/vp_b252.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b253",
    "start": 1194.26,
    "dur": 3.68,
    "kind": "full",
    "src": "broll/vp_b253.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b254",
    "start": 1197.94,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b254.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b254",
    "start": 1201.98,
    "dur": 0.76,
    "kind": "full",
    "src": "img/vp_b254.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "checklist_40",
    "start": 1202.74,
    "dur": 6,
    "kind": "checklist",
    "title": "Sistemas, no fuerza de voluntad",
    "items": [
      "Pastillero semanal de siete",
      "Alarma en el teléfono",
      "La caja siempre en el mismo sitio"
    ],
    "mood": "sage"
  },
  {
    "id": "full_b256",
    "start": 1208.74,
    "dur": 3.06,
    "kind": "full",
    "src": "broll/vp_b256.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b257",
    "start": 1211.8,
    "dur": 2.52,
    "kind": "full",
    "src": "broll/vp_b257.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b258",
    "start": 1214.32,
    "dur": 3.92,
    "kind": "full",
    "src": "broll/vp_b258.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b259",
    "start": 1218.24,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b259.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "tail_b259",
    "start": 1222.28,
    "dur": 1.1,
    "kind": "full",
    "src": "img/vp_b259.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b260",
    "start": 1223.38,
    "dur": 2.86,
    "kind": "full",
    "src": "broll/vp_b260.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b261",
    "start": 1226.24,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b261.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "tail_b261",
    "start": 1230.28,
    "dur": 1.68,
    "kind": "full",
    "src": "img/vp_b261.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b262",
    "start": 1231.96,
    "dur": 2.36,
    "kind": "full",
    "src": "broll/vp_b262.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b263",
    "start": 1234.32,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b263.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "tail_b263",
    "start": 1238.36,
    "dur": 0.74,
    "kind": "full",
    "src": "img/vp_b263.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b264",
    "start": 1239.1,
    "dur": 3.28,
    "kind": "full",
    "src": "broll/vp_b264.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b265",
    "start": 1242.38,
    "dur": 3.46,
    "kind": "full",
    "src": "broll/vp_b265.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "lowerthird_41",
    "start": 1245.84,
    "dur": 5.5,
    "kind": "lowerthird",
    "title": "Betabloqueantes: jamás dejarlos de golpe",
    "sub": "Se retiran con el médico y poco a poco"
  },
  {
    "id": "full_b267",
    "start": 1251.34,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b267.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "tail_b267",
    "start": 1255.38,
    "dur": 0.72,
    "kind": "full",
    "src": "img/vp_b267.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b268",
    "start": 1256.1,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b268.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b268",
    "start": 1260.14,
    "dur": 1.78,
    "kind": "full",
    "src": "img/vp_b268.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b269",
    "start": 1261.92,
    "dur": 3.88,
    "kind": "full",
    "src": "broll/vp_b269.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b270",
    "start": 1265.8,
    "dur": 3.6,
    "kind": "full",
    "src": "broll/vp_b270.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b271",
    "start": 1269.4,
    "dur": 2.62,
    "kind": "full",
    "src": "broll/vp_b271.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b272",
    "start": 1272.02,
    "dur": 2.4,
    "kind": "full",
    "src": "broll/vp_b272.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "cta_42",
    "start": 1274.42,
    "dur": 6.5,
    "kind": "cta",
    "title": "Guarde este video",
    "sub": "Las tres hojas para su médico están escritas en la descripción",
    "buttonLabel": "Guardar · Suscribirse",
    "items": [
      "Hoja para medirse en casa",
      "Alimentos y medicamentos que interfieren",
      "Registro semanal para la consulta"
    ]
  },
  {
    "id": "full_b274",
    "start": 1280.92,
    "dur": 0.94,
    "kind": "full",
    "src": "broll/vp_b274.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b275",
    "start": 1281.86,
    "dur": 2.5,
    "kind": "full",
    "src": "broll/vp_b275.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b276",
    "start": 1284.36,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b276.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "gap_b277_1288",
    "start": 1288.4,
    "dur": 0.52,
    "kind": "full",
    "src": "img/vp_b277.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b277",
    "start": 1288.92,
    "dur": 3,
    "kind": "full",
    "src": "broll/vp_b277.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b278",
    "start": 1291.92,
    "dur": 2.86,
    "kind": "full",
    "src": "broll/vp_b278.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b279",
    "start": 1294.78,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vp_b279.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b280",
    "start": 1298.48,
    "dur": 3.1,
    "kind": "full",
    "src": "broll/vp_b280.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b281",
    "start": 1301.58,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b281.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "gap_b282_1306",
    "start": 1305.62,
    "dur": 0.18,
    "kind": "full",
    "src": "img/vp_b282.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b282",
    "start": 1305.8,
    "dur": 4.02,
    "kind": "full",
    "src": "broll/vp_b282.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b283",
    "start": 1309.82,
    "dur": 3.28,
    "kind": "full",
    "src": "broll/vp_b283.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b284",
    "start": 1313.1,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b284.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b284",
    "start": 1317.14,
    "dur": 0.98,
    "kind": "full",
    "src": "img/vp_b284.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b285",
    "start": 1318.12,
    "dur": 2.52,
    "kind": "full",
    "src": "broll/vp_b285.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b286",
    "start": 1320.64,
    "dur": 3.38,
    "kind": "full",
    "src": "broll/vp_b286.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b287",
    "start": 1324.02,
    "dur": 3.92,
    "kind": "full",
    "src": "broll/vp_b287.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b288",
    "start": 1327.94,
    "dur": 3.14,
    "kind": "full",
    "src": "broll/vp_b288.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b289",
    "start": 1331.08,
    "dur": 3.88,
    "kind": "full",
    "src": "broll/vp_b289.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b290",
    "start": 1334.96,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b290.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b290",
    "start": 1339,
    "dur": 2.06,
    "kind": "full",
    "src": "img/vp_b290.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b291",
    "start": 1341.06,
    "dur": 3.48,
    "kind": "full",
    "src": "broll/vp_b291.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b292",
    "start": 1344.54,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b292.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "gap_b293_1349",
    "start": 1348.58,
    "dur": 0.68,
    "kind": "full",
    "src": "img/vp_b293.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b293",
    "start": 1349.26,
    "dur": 2.8,
    "kind": "full",
    "src": "broll/vp_b293.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b294",
    "start": 1352.06,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b294.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b294",
    "start": 1356.1,
    "dur": 1.94,
    "kind": "full",
    "src": "img/vp_b294.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b295",
    "start": 1358.04,
    "dur": 3.88,
    "kind": "full",
    "src": "broll/vp_b295.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b296",
    "start": 1361.92,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b296.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "gap_b297_1366",
    "start": 1365.96,
    "dur": 0.08,
    "kind": "full",
    "src": "img/vp_b297.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b297",
    "start": 1366.04,
    "dur": 3.84,
    "kind": "full",
    "src": "broll/vp_b297.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "stat_43",
    "start": 1369.88,
    "dur": 5.5,
    "kind": "stat",
    "value": 3,
    "label": "Pasos antes de ponerse de pie",
    "sub": "Tumbado, sentado, de pie",
    "mood": "gold"
  },
  {
    "id": "full_b299",
    "start": 1375.38,
    "dur": 3.62,
    "kind": "full",
    "src": "broll/vp_b299.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b300",
    "start": 1379,
    "dur": 3.56,
    "kind": "full",
    "src": "broll/vp_b300.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b301",
    "start": 1382.56,
    "dur": 2.56,
    "kind": "full",
    "src": "broll/vp_b301.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "step_44",
    "start": 1385.12,
    "dur": 5,
    "kind": "step",
    "step": 1,
    "total": 3,
    "title": "Tumbado",
    "sub": "Unos segundos con los ojos abiertos"
  },
  {
    "id": "step_45",
    "start": 1388.6,
    "dur": 5,
    "kind": "step",
    "step": 2,
    "total": 3,
    "title": "Sentado",
    "sub": "Cuente hasta treinta moviendo los tobillos"
  },
  {
    "id": "full_b303",
    "start": 1390.12,
    "dur": 1.26,
    "kind": "full",
    "src": "broll/vp_b303.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b304",
    "start": 1393.6,
    "dur": 1.72,
    "kind": "full",
    "src": "broll/vp_b304.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b305",
    "start": 1395.32,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b305.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "gap_b306_1399",
    "start": 1399.36,
    "dur": 0.14,
    "kind": "full",
    "src": "img/vp_b306.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "step_46",
    "start": 1399.5,
    "dur": 5,
    "kind": "step",
    "step": 3,
    "total": 3,
    "title": "De pie",
    "sub": "Una mano apoyada en algo firme"
  },
  {
    "id": "gap_b307_1405",
    "start": 1404.5,
    "dur": 0.56,
    "kind": "full",
    "src": "img/vp_b307.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b307",
    "start": 1405.06,
    "dur": 2.74,
    "kind": "full",
    "src": "broll/vp_b307.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b308",
    "start": 1407.8,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b308.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b308",
    "start": 1411.84,
    "dur": 1.06,
    "kind": "full",
    "src": "img/vp_b308.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b309",
    "start": 1412.9,
    "dur": 2.4,
    "kind": "full",
    "src": "broll/vp_b309.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b310",
    "start": 1415.3,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b310.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b310",
    "start": 1419.34,
    "dur": 2.16,
    "kind": "full",
    "src": "img/vp_b310.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b311",
    "start": 1421.5,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b311.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "gap_b312_1426",
    "start": 1425.54,
    "dur": 0.6,
    "kind": "full",
    "src": "img/vp_b312.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b312",
    "start": 1426.14,
    "dur": 3.8,
    "kind": "full",
    "src": "broll/vp_b312.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b313",
    "start": 1429.94,
    "dur": 2.6,
    "kind": "full",
    "src": "broll/vp_b313.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b314",
    "start": 1432.54,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b314.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b314",
    "start": 1436.58,
    "dur": 2.14,
    "kind": "full",
    "src": "img/vp_b314.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b315",
    "start": 1438.72,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b315.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "tail_b315",
    "start": 1442.76,
    "dur": 1.1,
    "kind": "full",
    "src": "img/vp_b315.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b316",
    "start": 1443.86,
    "dur": 0.96,
    "kind": "full",
    "src": "broll/vp_b316.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "beforeafter_47",
    "start": 1444.82,
    "dur": 6,
    "kind": "beforeafter",
    "title": "La misma dosis, distinta estación",
    "labelA": "En enero, perfecta",
    "labelB": "En agosto, demasiado baja",
    "imageA": "img/vp_b321.jpg",
    "imageB": "img/vp_b316.jpg"
  },
  {
    "id": "full_b317",
    "start": 1450.82,
    "dur": 0.84,
    "kind": "full",
    "src": "broll/vp_b317.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b318",
    "start": 1451.66,
    "dur": 2.74,
    "kind": "full",
    "src": "broll/vp_b318.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b319",
    "start": 1454.4,
    "dur": 3.54,
    "kind": "full",
    "src": "broll/vp_b319.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b320",
    "start": 1457.94,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b320.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b320",
    "start": 1461.98,
    "dur": 1.64,
    "kind": "full",
    "src": "img/vp_b320.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b321",
    "start": 1463.62,
    "dur": 2.52,
    "kind": "full",
    "src": "broll/vp_b321.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b322",
    "start": 1466.14,
    "dur": 2.96,
    "kind": "full",
    "src": "broll/vp_b322.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b323",
    "start": 1469.1,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b323.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "tail_b323",
    "start": 1473.14,
    "dur": 1.48,
    "kind": "full",
    "src": "img/vp_b323.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b324",
    "start": 1474.62,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b324.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "gap_b325_1479",
    "start": 1478.66,
    "dur": 0.08,
    "kind": "full",
    "src": "img/vp_b325.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b325",
    "start": 1478.74,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b325.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "gap_b326_1483",
    "start": 1482.78,
    "dur": 0.06,
    "kind": "full",
    "src": "img/vp_b326.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b326",
    "start": 1482.84,
    "dur": 3.12,
    "kind": "full",
    "src": "broll/vp_b326.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b327",
    "start": 1485.96,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b327.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "tail_b327",
    "start": 1490,
    "dur": 2.46,
    "kind": "full",
    "src": "img/vp_b327.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b328",
    "start": 1492.46,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b328.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "gap_b329_1497",
    "start": 1496.5,
    "dur": 0.46,
    "kind": "full",
    "src": "img/vp_b329.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b329",
    "start": 1496.96,
    "dur": 3.04,
    "kind": "full",
    "src": "broll/vp_b329.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "stat_48",
    "start": 1500,
    "dur": 6,
    "kind": "stat",
    "value": 20000,
    "label": "Pacientes · estudio español de 2019",
    "sub": "A favor de tomarla de noche",
    "mood": "sage"
  },
  {
    "id": "full_b331",
    "start": 1506,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b331.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "gap_b332_1510",
    "start": 1510.04,
    "dur": 0.12,
    "kind": "full",
    "src": "img/vp_b332.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b332",
    "start": 1510.16,
    "dur": 2.46,
    "kind": "full",
    "src": "broll/vp_b332.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b333",
    "start": 1512.62,
    "dur": 3.64,
    "kind": "full",
    "src": "broll/vp_b333.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b334",
    "start": 1516.26,
    "dur": 2.98,
    "kind": "full",
    "src": "broll/vp_b334.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b335",
    "start": 1519.24,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b335.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "tail_b335",
    "start": 1523.28,
    "dur": 1.34,
    "kind": "full",
    "src": "img/vp_b335.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b336",
    "start": 1524.62,
    "dur": 1.94,
    "kind": "full",
    "src": "broll/vp_b336.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "stat_49",
    "start": 1526.56,
    "dur": 6.5,
    "kind": "stat",
    "value": 21000,
    "label": "Pacientes · estudio británico de 2022",
    "sub": "No encontró diferencia — pero confirmó que de noche no es peligroso",
    "mood": "gold"
  },
  {
    "id": "full_b338",
    "start": 1533.06,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b338.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b338",
    "start": 1537.1,
    "dur": 1.72,
    "kind": "full",
    "src": "img/vp_b338.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b339",
    "start": 1538.82,
    "dur": 3.3,
    "kind": "full",
    "src": "broll/vp_b339.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b340",
    "start": 1542.12,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vp_b340.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b341",
    "start": 1545.82,
    "dur": 3.12,
    "kind": "full",
    "src": "broll/vp_b341.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b342",
    "start": 1548.94,
    "dur": 3.02,
    "kind": "full",
    "src": "broll/vp_b342.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b343",
    "start": 1551.96,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b343.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "tail_b343",
    "start": 1556,
    "dur": 0.98,
    "kind": "full",
    "src": "img/vp_b343.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b344",
    "start": 1556.98,
    "dur": 3.82,
    "kind": "full",
    "src": "broll/vp_b344.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b345",
    "start": 1560.8,
    "dur": 2.34,
    "kind": "full",
    "src": "broll/vp_b345.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b346",
    "start": 1563.14,
    "dur": 2.68,
    "kind": "full",
    "src": "broll/vp_b346.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b347",
    "start": 1565.82,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b347.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "gap_b348_1570",
    "start": 1569.86,
    "dur": 0.14,
    "kind": "full",
    "src": "img/vp_b348.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b348",
    "start": 1570,
    "dur": 3.98,
    "kind": "full",
    "src": "broll/vp_b348.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b349",
    "start": 1573.98,
    "dur": 1.9,
    "kind": "full",
    "src": "broll/vp_b349.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "hero_50",
    "start": 1575.88,
    "dur": 6.5,
    "kind": "hero",
    "kicker": "El sexto error",
    "title": "Monitorización de 24 horas",
    "sub": "El aparato que mide su tensión mientras usted duerme",
    "image": "img/vp_b349.jpg",
    "side": "right",
    "mood": "gold"
  },
  {
    "id": "full_b350",
    "start": 1582.38,
    "dur": 1.26,
    "kind": "full",
    "src": "broll/vp_b350.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b351",
    "start": 1583.64,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b351.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "gap_b352_1588",
    "start": 1587.68,
    "dur": 0.6,
    "kind": "full",
    "src": "img/vp_b352.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b352",
    "start": 1588.28,
    "dur": 3.52,
    "kind": "full",
    "src": "broll/vp_b352.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b353",
    "start": 1591.8,
    "dur": 3.6,
    "kind": "full",
    "src": "broll/vp_b353.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b354",
    "start": 1595.4,
    "dur": 3.24,
    "kind": "full",
    "src": "broll/vp_b354.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b355",
    "start": 1598.64,
    "dur": 2.52,
    "kind": "full",
    "src": "broll/vp_b355.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b356",
    "start": 1601.16,
    "dur": 3.06,
    "kind": "full",
    "src": "broll/vp_b356.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b357",
    "start": 1604.22,
    "dur": 3.34,
    "kind": "full",
    "src": "broll/vp_b357.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b358",
    "start": 1607.56,
    "dur": 3.02,
    "kind": "full",
    "src": "broll/vp_b358.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b359",
    "start": 1610.58,
    "dur": 3.12,
    "kind": "full",
    "src": "broll/vp_b359.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b360",
    "start": 1613.7,
    "dur": 1.14,
    "kind": "full",
    "src": "broll/vp_b360.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "stat_51",
    "start": 1614.84,
    "dur": 6.5,
    "kind": "stat",
    "value": 4,
    "suffix": " AM",
    "label": "Su tensión, más alta que a mediodía",
    "sub": "Mientras dormía. Todas las noches, durante nueve años",
    "mood": "terracotta"
  },
  {
    "id": "gap_b363_1621",
    "start": 1621.34,
    "dur": 0.44,
    "kind": "full",
    "src": "img/vp_b363.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b363",
    "start": 1621.78,
    "dur": 3.54,
    "kind": "full",
    "src": "broll/vp_b363.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b364",
    "start": 1625.32,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b364.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b364",
    "start": 1629.36,
    "dur": 0.86,
    "kind": "full",
    "src": "img/vp_b364.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b365",
    "start": 1630.22,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b365.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "gap_b366_1634",
    "start": 1634.26,
    "dur": 0.44,
    "kind": "full",
    "src": "img/vp_b366.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b366",
    "start": 1634.7,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b366.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b366",
    "start": 1638.74,
    "dur": 0.72,
    "kind": "full",
    "src": "img/vp_b366.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b367",
    "start": 1639.46,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b367.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "gap_b368_1644",
    "start": 1643.5,
    "dur": 0.34,
    "kind": "full",
    "src": "img/vp_b368.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "hero_52",
    "start": 1643.84,
    "dur": 6,
    "kind": "hero",
    "kicker": "Error 6",
    "title": "Decidir todo esto a ciegas",
    "sub": "Como buscar una gotera mirando el techo a mediodía",
    "mood": "terracotta"
  },
  {
    "id": "full_b369",
    "start": 1649.84,
    "dur": 0.98,
    "kind": "full",
    "src": "broll/vp_b369.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b370",
    "start": 1650.82,
    "dur": 3.72,
    "kind": "full",
    "src": "broll/vp_b370.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b371",
    "start": 1654.54,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b371.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "tail_b371",
    "start": 1658.58,
    "dur": 1,
    "kind": "full",
    "src": "img/vp_b371.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b372",
    "start": 1659.58,
    "dur": 3.96,
    "kind": "full",
    "src": "broll/vp_b372.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b373",
    "start": 1663.54,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b373.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "gap_b374_1668",
    "start": 1667.58,
    "dur": 1.06,
    "kind": "full",
    "src": "img/vp_b374.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "quote_53",
    "start": 1668.64,
    "dur": 7,
    "kind": "quote",
    "quote": "Doctor, ¿sería posible hacerme una monitorización de 24 horas para ver cómo tengo la tensión por la noche?",
    "author": "La frase que hay que llevar a la consulta"
  },
  {
    "id": "full_b376",
    "start": 1675.64,
    "dur": 2.94,
    "kind": "full",
    "src": "broll/vp_b376.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b377",
    "start": 1678.58,
    "dur": 2.5,
    "kind": "full",
    "src": "broll/vp_b377.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b378",
    "start": 1681.08,
    "dur": 2.8,
    "kind": "full",
    "src": "broll/vp_b378.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b379",
    "start": 1683.88,
    "dur": 2.52,
    "kind": "full",
    "src": "broll/vp_b379.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b380",
    "start": 1686.4,
    "dur": 2.8,
    "kind": "full",
    "src": "broll/vp_b380.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b381",
    "start": 1689.2,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b381.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "gap_b382_1693",
    "start": 1693.24,
    "dur": 0.38,
    "kind": "full",
    "src": "img/vp_b382.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b382",
    "start": 1693.62,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b382.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b382",
    "start": 1697.66,
    "dur": 1.82,
    "kind": "full",
    "src": "img/vp_b382.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b383",
    "start": 1699.48,
    "dur": 3.44,
    "kind": "full",
    "src": "broll/vp_b383.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b384",
    "start": 1702.92,
    "dur": 3.4,
    "kind": "full",
    "src": "broll/vp_b384.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b385",
    "start": 1706.32,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b385.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "gap_b386_1710",
    "start": 1710.36,
    "dur": 0.38,
    "kind": "full",
    "src": "img/vp_b386.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "beforeafter_54",
    "start": 1710.74,
    "dur": 6.5,
    "kind": "beforeafter",
    "title": "Las dos trampas que destapa la hoja",
    "labelA": "Bata blanca: alta sólo en la consulta",
    "labelB": "Enmascarada: buena en la consulta, mala en casa",
    "imageA": "img/vp_b386.jpg",
    "imageB": "img/vp_b388.jpg"
  },
  {
    "id": "full_b387",
    "start": 1717.24,
    "dur": 1.3,
    "kind": "full",
    "src": "broll/vp_b387.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b388",
    "start": 1718.54,
    "dur": 2.86,
    "kind": "full",
    "src": "broll/vp_b388.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b389",
    "start": 1721.4,
    "dur": 3.56,
    "kind": "full",
    "src": "broll/vp_b389.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b390",
    "start": 1724.96,
    "dur": 3.78,
    "kind": "full",
    "src": "broll/vp_b390.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "checklist_55",
    "start": 1728.74,
    "dur": 6.5,
    "kind": "checklist",
    "title": "Lo que cambió en casa de Elena",
    "items": [
      "Dos pastillas pasaron a la noche",
      "El diurético, con el desayuno",
      "Una luz pequeña en el pasillo",
      "El blíster, junto al cepillo de dientes"
    ],
    "mood": "sage"
  },
  {
    "id": "full_b393",
    "start": 1735.24,
    "dur": 3.64,
    "kind": "full",
    "src": "broll/vp_b393.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b394",
    "start": 1738.88,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b394.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b394",
    "start": 1742.92,
    "dur": 3.36,
    "kind": "full",
    "src": "img/vp_b394.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b395",
    "start": 1746.28,
    "dur": 3.44,
    "kind": "full",
    "src": "broll/vp_b395.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b396",
    "start": 1749.72,
    "dur": 2.9,
    "kind": "full",
    "src": "broll/vp_b396.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b397",
    "start": 1752.62,
    "dur": 2.58,
    "kind": "full",
    "src": "broll/vp_b397.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b398",
    "start": 1755.2,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b398.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "gap_b399_1759",
    "start": 1759.24,
    "dur": 0.48,
    "kind": "full",
    "src": "img/vp_b399.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b399",
    "start": 1759.72,
    "dur": 3.76,
    "kind": "full",
    "src": "broll/vp_b399.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b400",
    "start": 1763.48,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b400.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "gap_b401_1768",
    "start": 1767.52,
    "dur": 0.38,
    "kind": "full",
    "src": "img/vp_b401.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "checklist_56",
    "start": 1767.9,
    "dur": 7,
    "kind": "checklist",
    "title": "Los cinco, para llevarse",
    "items": [
      "Una hora fija — diuréticos por la mañana",
      "Cuidado con lo que la acompaña",
      "Mídase bien: sentado, callado, dos veces",
      "Ni saltarse ni doblar la dosis",
      "Levántese en tres pasos"
    ],
    "mood": "sage"
  },
  {
    "id": "full_b403",
    "start": 1774.9,
    "dur": 0.96,
    "kind": "full",
    "src": "broll/vp_b403.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b404",
    "start": 1775.86,
    "dur": 3.08,
    "kind": "full",
    "src": "broll/vp_b404.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b405",
    "start": 1778.94,
    "dur": 2.44,
    "kind": "full",
    "src": "broll/vp_b405.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b406",
    "start": 1781.38,
    "dur": 3.16,
    "kind": "full",
    "src": "broll/vp_b406.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b407",
    "start": 1784.54,
    "dur": 2.94,
    "kind": "full",
    "src": "broll/vp_b407.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b408",
    "start": 1787.48,
    "dur": 2.46,
    "kind": "full",
    "src": "broll/vp_b408.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "full_b409",
    "start": 1789.94,
    "dur": 3.66,
    "kind": "full",
    "src": "broll/vp_b409.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b410",
    "start": 1793.6,
    "dur": 3.86,
    "kind": "full",
    "src": "broll/vp_b410.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b411",
    "start": 1797.46,
    "dur": 3,
    "kind": "full",
    "src": "broll/vp_b411.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b412",
    "start": 1800.46,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b412.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b412",
    "start": 1804.5,
    "dur": 1.3,
    "kind": "full",
    "src": "img/vp_b412.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b413",
    "start": 1805.8,
    "dur": 2.94,
    "kind": "full",
    "src": "broll/vp_b413.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b414",
    "start": 1808.74,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b414.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "tail_b414",
    "start": 1812.78,
    "dur": 0.88,
    "kind": "full",
    "src": "img/vp_b414.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b415",
    "start": 1813.66,
    "dur": 2.42,
    "kind": "full",
    "src": "broll/vp_b415.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "full_b416",
    "start": 1816.08,
    "dur": 1.86,
    "kind": "full",
    "src": "broll/vp_b416.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "quote_57",
    "start": 1817.94,
    "dur": 6,
    "kind": "quote",
    "quote": "Su tensión de noche es la que manda.",
    "author": "Dra. Valeria Alcázar"
  },
  {
    "id": "gap_b418_1824",
    "start": 1823.94,
    "dur": 0.18,
    "kind": "full",
    "src": "img/vp_b418.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b418",
    "start": 1824.12,
    "dur": 3.54,
    "kind": "full",
    "src": "broll/vp_b418.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b419",
    "start": 1827.66,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b419.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "gap_b420_1832",
    "start": 1831.7,
    "dur": 0.14,
    "kind": "full",
    "src": "img/vp_b420.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b420",
    "start": 1831.84,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b420.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b420",
    "start": 1835.88,
    "dur": 1.54,
    "kind": "full",
    "src": "img/vp_b420.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b421",
    "start": 1837.42,
    "dur": 3.5,
    "kind": "full",
    "src": "broll/vp_b421.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b422",
    "start": 1840.92,
    "dur": 3.48,
    "kind": "full",
    "src": "broll/vp_b422.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b423",
    "start": 1844.4,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b423.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "tail_b423",
    "start": 1848.44,
    "dur": 1.38,
    "kind": "full",
    "src": "img/vp_b423.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b424",
    "start": 1849.82,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b424.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "gap_b425_1854",
    "start": 1853.86,
    "dur": 0.6,
    "kind": "full",
    "src": "img/vp_b425.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b425",
    "start": 1854.46,
    "dur": 3.58,
    "kind": "full",
    "src": "broll/vp_b425.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b426",
    "start": 1858.04,
    "dur": 3.1,
    "kind": "full",
    "src": "broll/vp_b426.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "full_b427",
    "start": 1861.14,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b427.mp4",
    "video": true,
    "ken": "right"
  },
  {
    "id": "gap_b428_1865",
    "start": 1865.18,
    "dur": 0.14,
    "kind": "full",
    "src": "img/vp_b428.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b428",
    "start": 1865.32,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b428.mp4",
    "video": true,
    "ken": "in"
  },
  {
    "id": "tail_b428",
    "start": 1869.36,
    "dur": 1.92,
    "kind": "full",
    "src": "img/vp_b428.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b429",
    "start": 1871.28,
    "dur": 2.92,
    "kind": "full",
    "src": "broll/vp_b429.mp4",
    "video": true,
    "ken": "out"
  },
  {
    "id": "full_b430",
    "start": 1874.2,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vp_b430.mp4",
    "video": true,
    "ken": "left"
  },
  {
    "id": "gap_b431_1878",
    "start": 1878.24,
    "dur": 0.62,
    "kind": "full",
    "src": "img/vp_b431.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b431",
    "start": 1878.86,
    "dur": 1.75,
    "kind": "full",
    "src": "broll/vp_b431.mp4",
    "video": true,
    "ken": "right"
  }
];
