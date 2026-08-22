// cues_valeriabocaseca.gen.ts — GENERADO por build_valeriabocaseca.mjs. NO editar a mano.
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
export const TOTAL_FRAMES_VBS = 50642;
export const BEATS: Cue[] = [
  {
    "id": "talk_1",
    "start": 0,
    "kind": "talk",
    "title": "Las cuatro de la mañana. Otra vez el vaso de agua.",
    "kicker": "Dra. Valeria Alcázar · Belleza y salud",
    "dur": 0.6
  },
  {
    "id": "clip_v001",
    "start": 0,
    "kind": "full",
    "src": "broll/vbs_v001.mp4",
    "video": true,
    "ken": "in",
    "dur": 1.96
  },
  {
    "id": "clip_v002",
    "start": 1.96,
    "kind": "full",
    "src": "broll/vbs_v002.mp4",
    "video": true,
    "ken": "out",
    "dur": 4
  },
  {
    "id": "ph_clip_v002",
    "start": 5.96,
    "dur": 1.78,
    "kind": "full",
    "src": "img/vbs_v002.jpg",
    "video": false,
    "ken": "left"
  },
  {
    "id": "clip_v004",
    "start": 7.74,
    "kind": "full",
    "src": "broll/vbs_v004.mp4",
    "video": true,
    "ken": "right",
    "dur": 4
  },
  {
    "id": "ph_clip_v004",
    "start": 11.74,
    "dur": 6.4,
    "kind": "full",
    "src": "img/vbs_v004.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "fill_clip_v004",
    "start": 18.14,
    "dur": 0.62,
    "kind": "talk"
  },
  {
    "id": "clip_v006",
    "start": 18.76,
    "kind": "full",
    "src": "broll/vbs_v006.mp4",
    "video": true,
    "ken": "out",
    "dur": 3
  },
  {
    "id": "clip_v007",
    "start": 21.76,
    "kind": "full",
    "src": "broll/vbs_v007.mp4",
    "video": true,
    "ken": "left",
    "dur": 2.24
  },
  {
    "id": "clip_v008",
    "start": 24,
    "kind": "full",
    "src": "broll/vbs_v008.mp4",
    "video": true,
    "ken": "right",
    "dur": 4
  },
  {
    "id": "ph_clip_v008",
    "start": 28,
    "dur": 2.96,
    "kind": "full",
    "src": "img/vbs_v008.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "clip_v010",
    "start": 30.96,
    "kind": "full",
    "src": "broll/vbs_v010.mp4",
    "video": true,
    "ken": "out",
    "dur": 4
  },
  {
    "id": "ph_clip_v010",
    "start": 34.96,
    "dur": 3,
    "kind": "full",
    "src": "img/vbs_v010.jpg",
    "video": false,
    "ken": "left"
  },
  {
    "id": "hero_2",
    "start": 37.96,
    "kind": "hero",
    "kicker": "El aviso más antiguo del mundo",
    "title": "Su boca le está avisando",
    "hot": [
      "avisando"
    ],
    "sub": "No es la calefacción. No es la edad.",
    "image": "img/vbs_h_mirror.jpg",
    "side": "right",
    "mood": "gold",
    "dur": 6
  },
  {
    "id": "fill_hero_2",
    "start": 43.96,
    "dur": 2.34,
    "kind": "talk"
  },
  {
    "id": "clip_v012",
    "start": 46.3,
    "kind": "full",
    "src": "broll/vbs_v012.mp4",
    "video": true,
    "ken": "right",
    "dur": 3.44
  },
  {
    "id": "chapter_3",
    "start": 49.74,
    "kind": "chapter",
    "kicker": "India antigua",
    "index": "La prueba del arroz",
    "title": "El primer detector de mentiras",
    "sub": "Sin médicos, sin aparatos: solo un puñado de arroz seco.",
    "dur": 5
  },
  {
    "id": "fill_chapter_3",
    "start": 54.74,
    "dur": 0.44,
    "kind": "talk"
  },
  {
    "id": "clip_v014",
    "start": 55.18,
    "kind": "full",
    "src": "broll/vbs_v014.mp4",
    "video": true,
    "ken": "in",
    "dur": 2.08
  },
  {
    "id": "clip_v015",
    "start": 57.26,
    "kind": "full",
    "src": "broll/vbs_v015.mp4",
    "video": true,
    "ken": "out",
    "dur": 4
  },
  {
    "id": "ph_clip_v015",
    "start": 61.26,
    "dur": 2.38,
    "kind": "full",
    "src": "img/vbs_v015.jpg",
    "video": false,
    "ken": "left"
  },
  {
    "id": "clip_v016",
    "start": 63.64,
    "kind": "full",
    "src": "broll/vbs_v016.mp4",
    "video": true,
    "ken": "right",
    "dur": 2.86
  },
  {
    "id": "clip_v017",
    "start": 66.5,
    "kind": "full",
    "src": "broll/vbs_v017.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v017",
    "start": 70.5,
    "dur": 2.88,
    "kind": "full",
    "src": "img/vbs_v017.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "clip_v019",
    "start": 73.38,
    "kind": "full",
    "src": "broll/vbs_v019.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v019",
    "start": 77.38,
    "dur": 3.22,
    "kind": "full",
    "src": "img/vbs_v019.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "clip_v021",
    "start": 80.6,
    "kind": "full",
    "src": "broll/vbs_v021.mp4",
    "video": true,
    "ken": "in",
    "dur": 2.72
  },
  {
    "id": "quote_4",
    "start": 83.32,
    "kind": "quote",
    "kicker": "La ordalía del arroz",
    "quote": "El que escupía el arroz seco era el culpable.",
    "author": "Ordalía del arroz",
    "role": "India antigua",
    "image": "img/vbs_v021.jpg",
    "mood": "gold",
    "dur": 6.8
  },
  {
    "id": "fill_quote_4",
    "start": 90.12,
    "dur": 5.38,
    "kind": "talk"
  },
  {
    "id": "molecule_5",
    "start": 95.5,
    "kind": "molecule",
    "kicker": "Lo que la ciencia tardó siglos en explicar",
    "title": "El miedo cierra el grifo",
    "hot": [
      "miedo"
    ],
    "centerLabel": "Sin saliva",
    "sub": "El sistema de alarma decide que salivar no es prioritario.",
    "nodes": [
      {
        "label": "Alarma"
      },
      {
        "label": "Glándulas"
      },
      {
        "label": "Boca seca"
      }
    ],
    "image": "img/vbs_v025.jpg",
    "mood": "science",
    "dur": 7
  },
  {
    "id": "fill_molecule_5",
    "start": 102.5,
    "dur": 1.8,
    "kind": "talk"
  },
  {
    "id": "clip_v025",
    "start": 104.3,
    "kind": "full",
    "src": "broll/vbs_v025.mp4",
    "video": true,
    "ken": "out",
    "dur": 4
  },
  {
    "id": "ph_clip_v025",
    "start": 108.3,
    "dur": 2.92,
    "kind": "full",
    "src": "img/vbs_v025.jpg",
    "video": false,
    "ken": "left"
  },
  {
    "id": "clip_v026",
    "start": 111.22,
    "kind": "full",
    "src": "broll/vbs_v026.mp4",
    "video": true,
    "ken": "right",
    "dur": 2.08
  },
  {
    "id": "lowerthird_6",
    "start": 113.3,
    "kind": "lowerthird",
    "name": "Dra. Valeria Alcázar",
    "role": "Medicina estética · Belleza vintage",
    "topic": "Boca seca: 7 señales después de los 60",
    "dur": 4.5
  },
  {
    "id": "fill_lowerthird_6",
    "start": 117.8,
    "dur": 12.58,
    "kind": "talk"
  },
  {
    "id": "hero_7",
    "start": 130.38,
    "kind": "hero",
    "kicker": "La idea que cambia todo",
    "title": "Su boca es el salpicadero",
    "hot": [
      "salpicadero"
    ],
    "sub": "Las lucecitas se encienden por lo que pasa debajo del capó.",
    "image": "img/vbs_v027.jpg",
    "side": "left",
    "mood": "science",
    "dur": 6
  },
  {
    "id": "fill_hero_7",
    "start": 136.38,
    "dur": 6.8,
    "kind": "talk"
  },
  {
    "id": "clip_v029",
    "start": 143.18,
    "kind": "full",
    "src": "broll/vbs_v029.mp4",
    "video": true,
    "ken": "in",
    "dur": 3.44
  },
  {
    "id": "clip_v030",
    "start": 146.62,
    "kind": "full",
    "src": "broll/vbs_v030.mp4",
    "video": true,
    "ken": "out",
    "dur": 4
  },
  {
    "id": "fill_clip_v030",
    "start": 150.62,
    "dur": 10.94,
    "kind": "talk"
  },
  {
    "id": "chapter_8",
    "start": 161.56,
    "kind": "chapter",
    "kicker": "Lo que vamos a ver",
    "index": "7 señales",
    "title": "Lo que su cuerpo le avisa",
    "sub": "De menos a más importante. La séptima se ve en el espejo.",
    "dur": 5
  },
  {
    "id": "fill_chapter_8",
    "start": 166.56,
    "dur": 19.24,
    "kind": "talk"
  },
  {
    "id": "hero_9",
    "start": 185.8,
    "kind": "hero",
    "kicker": "Una paciente real",
    "title": "Carmen, 68 años",
    "hot": [
      "68"
    ],
    "sub": "Vino por un motivo estético. Salió con otra cosa.",
    "image": "img/vbs_h_carmen.jpg",
    "side": "right",
    "mood": "gold",
    "dur": 6
  },
  {
    "id": "fill_hero_9",
    "start": 191.8,
    "dur": 4.88,
    "kind": "talk"
  },
  {
    "id": "clip_v031",
    "start": 196.68,
    "kind": "full",
    "src": "broll/vbs_v031.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v031",
    "start": 200.68,
    "dur": 2.88,
    "kind": "full",
    "src": "img/vbs_v031.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "clip_v032",
    "start": 203.56,
    "kind": "full",
    "src": "broll/vbs_v032.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v032",
    "start": 207.56,
    "dur": 6.4,
    "kind": "full",
    "src": "img/vbs_v032.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "fill_clip_v032",
    "start": 213.96,
    "dur": 0.72,
    "kind": "talk"
  },
  {
    "id": "clip_v033",
    "start": 214.68,
    "kind": "full",
    "src": "broll/vbs_v033.mp4",
    "video": true,
    "ken": "left",
    "dur": 3.44
  },
  {
    "id": "clip_v034",
    "start": 218.12,
    "kind": "full",
    "src": "broll/vbs_v034.mp4",
    "video": true,
    "ken": "right",
    "dur": 4
  },
  {
    "id": "ph_clip_v034",
    "start": 222.12,
    "dur": 6.4,
    "kind": "full",
    "src": "img/vbs_v034.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "clip_v036",
    "start": 228.86,
    "kind": "full",
    "src": "broll/vbs_v036.mp4",
    "video": true,
    "ken": "out",
    "dur": 4
  },
  {
    "id": "ph_clip_v036",
    "start": 232.86,
    "dur": 6.4,
    "kind": "full",
    "src": "img/vbs_v036.jpg",
    "video": false,
    "ken": "left"
  },
  {
    "id": "fill_clip_v036",
    "start": 239.26,
    "dur": 7,
    "kind": "talk"
  },
  {
    "id": "clip_v038",
    "start": 246.26,
    "kind": "full",
    "src": "broll/vbs_v038.mp4",
    "video": true,
    "ken": "right",
    "dur": 4
  },
  {
    "id": "ph_clip_v038",
    "start": 250.26,
    "dur": 6.4,
    "kind": "full",
    "src": "img/vbs_v038.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "fill_clip_v038",
    "start": 256.66,
    "dur": 4.14,
    "kind": "talk"
  },
  {
    "id": "clip_v039",
    "start": 260.8,
    "kind": "full",
    "src": "broll/vbs_v039.mp4",
    "video": true,
    "ken": "out",
    "dur": 4
  },
  {
    "id": "ph_clip_v039",
    "start": 264.8,
    "dur": 6.4,
    "kind": "full",
    "src": "img/vbs_v039.jpg",
    "video": false,
    "ken": "left"
  },
  {
    "id": "fill_clip_v039",
    "start": 271.2,
    "dur": 16.6,
    "kind": "talk"
  },
  {
    "id": "checklist_10",
    "start": 287.8,
    "kind": "checklist",
    "kicker": "Lo que hace su saliva cada noche",
    "title": "El líquido más inteligente del cuerpo",
    "hot": [
      "inteligente"
    ],
    "items": [
      "Repara el esmalte con calcio y fosfato",
      "Frena a millones de bacterias",
      "Lubrica y protege la mucosa",
      "Empieza la digestión antes del estómago"
    ],
    "mood": "science",
    "dur": 8.5
  },
  {
    "id": "fill_checklist_10",
    "start": 296.3,
    "dur": 11.04,
    "kind": "talk"
  },
  {
    "id": "clip_v042",
    "start": 307.34,
    "kind": "full",
    "src": "broll/vbs_v042.mp4",
    "video": true,
    "ken": "right",
    "dur": 3.82
  },
  {
    "id": "clip_v043",
    "start": 311.16,
    "kind": "full",
    "src": "broll/vbs_v043.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v043",
    "start": 315.16,
    "dur": 6.4,
    "kind": "full",
    "src": "img/vbs_v043.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "fill_clip_v043",
    "start": 321.56,
    "dur": 8.72,
    "kind": "talk"
  },
  {
    "id": "seam_328",
    "start": 326.29,
    "dur": 3,
    "kind": "full",
    "src": "img/vbs_v045.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "checklist_11",
    "start": 330.28,
    "kind": "checklist",
    "kicker": "Por qué justo ahora",
    "title": "Cuatro cosas pasan a la vez",
    "hot": [
      "Cuatro"
    ],
    "items": [
      "Las glándulas producen menos y más espeso",
      "Casi todas tomamos alguna pastilla",
      "La sed llega tarde: el aviso se apaga",
      "La menopausia reseca las mucosas"
    ],
    "mood": "gold",
    "dur": 8.5
  },
  {
    "id": "fill_checklist_11",
    "start": 338.78,
    "dur": 1.04,
    "kind": "talk"
  },
  {
    "id": "clip_v046",
    "start": 339.82,
    "kind": "full",
    "src": "broll/vbs_v046.mp4",
    "video": true,
    "ken": "left",
    "dur": 2.66
  },
  {
    "id": "clip_v047",
    "start": 342.48,
    "kind": "full",
    "src": "broll/vbs_v047.mp4",
    "video": true,
    "ken": "right",
    "dur": 4
  },
  {
    "id": "ph_clip_v047",
    "start": 346.48,
    "dur": 4.58,
    "kind": "full",
    "src": "img/vbs_v047.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "clip_v049",
    "start": 351.06,
    "kind": "full",
    "src": "broll/vbs_v049.mp4",
    "video": true,
    "ken": "out",
    "dur": 4
  },
  {
    "id": "ph_clip_v049",
    "start": 355.06,
    "dur": 4,
    "kind": "full",
    "src": "img/vbs_v049.jpg",
    "video": false,
    "ken": "left"
  },
  {
    "id": "hero_12",
    "start": 359.16,
    "kind": "hero",
    "kicker": "El dato que casi nadie sabe",
    "title": "A esta edad la sed llega tarde",
    "hot": [
      "tarde"
    ],
    "sub": "Puede estar deshidratada de verdad y no sentir nada.",
    "image": "img/vbs_h_agua.jpg",
    "side": "left",
    "mood": "cool",
    "dur": 6
  },
  {
    "id": "fill_hero_12",
    "start": 365.16,
    "dur": 4.4,
    "kind": "talk"
  },
  {
    "id": "clip_v052",
    "start": 369.56,
    "kind": "full",
    "src": "broll/vbs_v052.mp4",
    "video": true,
    "ken": "right",
    "dur": 3.34
  },
  {
    "id": "clip_v053",
    "start": 372.9,
    "kind": "full",
    "src": "broll/vbs_v053.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v053",
    "start": 376.9,
    "dur": 6.4,
    "kind": "full",
    "src": "img/vbs_v053.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "fill_clip_v053",
    "start": 383.3,
    "dur": 4.8,
    "kind": "talk"
  },
  {
    "id": "stat_13",
    "start": 388.1,
    "kind": "stat",
    "kicker": "Mayores de 65 años",
    "value": 1,
    "label": "de cada 4 convive con la boca seca",
    "sub": "Y entre quienes toman varias pastillas, muchísimos más.",
    "image": "img/vbs_v054.jpg",
    "mood": "science",
    "decimals": 0,
    "dur": 6.5
  },
  {
    "id": "fill_stat_13",
    "start": 394.6,
    "dur": 3.36,
    "kind": "talk"
  },
  {
    "id": "clip_v055",
    "start": 397.96,
    "kind": "full",
    "src": "broll/vbs_v055.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v055",
    "start": 401.96,
    "dur": 5.52,
    "kind": "full",
    "src": "img/vbs_v055.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "quote_14",
    "start": 407.48,
    "kind": "quote",
    "kicker": "La frase más importante del vídeo",
    "quote": "Frecuente y normal no son la misma cosa.",
    "author": "Dra. Valeria Alcázar",
    "role": "Medicina estética",
    "image": "img/vbs_h_consulta.jpg",
    "mood": "gold",
    "dur": 6.8
  },
  {
    "id": "fill_quote_14",
    "start": 414.28,
    "dur": 8.74,
    "kind": "talk"
  },
  {
    "id": "clip_v057",
    "start": 423.02,
    "kind": "full",
    "src": "broll/vbs_v057.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v057",
    "start": 427.02,
    "dur": 3.8,
    "kind": "full",
    "src": "img/vbs_v057.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "chapter_15",
    "start": 430.82,
    "kind": "chapter",
    "kicker": "Señal",
    "index": "N.º 01",
    "title": "Seca al despertar, bien de día",
    "sub": "Está durmiendo con la boca abierta.",
    "dur": 5
  },
  {
    "id": "fill_chapter_15",
    "start": 435.82,
    "dur": 0.38,
    "kind": "talk"
  },
  {
    "id": "clip_v059",
    "start": 436.2,
    "kind": "full",
    "src": "broll/vbs_v059.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v059",
    "start": 440.2,
    "dur": 6.4,
    "kind": "full",
    "src": "img/vbs_v059.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "clip_v060",
    "start": 446.92,
    "kind": "full",
    "src": "broll/vbs_v060.mp4",
    "video": true,
    "ken": "in",
    "dur": 0.6
  },
  {
    "id": "hero_16",
    "start": 447.18,
    "kind": "hero",
    "kicker": "Ocho horas de aire por la boca",
    "title": "Como la ropa al viento",
    "hot": [
      "viento"
    ],
    "sub": "La mucosa se seca igual que una sábana tendida.",
    "image": "img/vbs_v062.jpg",
    "side": "right",
    "mood": "cool",
    "dur": 6
  },
  {
    "id": "clip_v062",
    "start": 453.42,
    "kind": "full",
    "src": "broll/vbs_v062.mp4",
    "video": true,
    "ken": "out",
    "dur": 1.84
  },
  {
    "id": "clip_v063",
    "start": 455.26,
    "kind": "full",
    "src": "broll/vbs_v063.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v063",
    "start": 459.26,
    "dur": 4.18,
    "kind": "full",
    "src": "img/vbs_v063.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "clip_v065",
    "start": 463.44,
    "kind": "full",
    "src": "broll/vbs_v065.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v065",
    "start": 467.44,
    "dur": 5.7,
    "kind": "full",
    "src": "img/vbs_v065.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "clip_v067",
    "start": 473.14,
    "kind": "full",
    "src": "broll/vbs_v067.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v067",
    "start": 477.14,
    "dur": 6.4,
    "kind": "full",
    "src": "img/vbs_v067.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "fill_clip_v067",
    "start": 483.54,
    "dur": 0.64,
    "kind": "talk"
  },
  {
    "id": "clip_v069",
    "start": 484.18,
    "kind": "full",
    "src": "broll/vbs_v069.mp4",
    "video": true,
    "ken": "in",
    "dur": 2.58
  },
  {
    "id": "clip_v070",
    "start": 486.76,
    "kind": "full",
    "src": "broll/vbs_v070.mp4",
    "video": true,
    "ken": "out",
    "dur": 4
  },
  {
    "id": "fill_clip_v070",
    "start": 490.76,
    "dur": 1.12,
    "kind": "talk"
  },
  {
    "id": "clip_v072",
    "start": 491.88,
    "kind": "full",
    "src": "broll/vbs_v072.mp4",
    "video": true,
    "ken": "left",
    "dur": 2.3
  },
  {
    "id": "checklist_17",
    "start": 494.18,
    "kind": "checklist",
    "kicker": "Si se junta con esto, consulte",
    "title": "Los tres rastros de la apnea",
    "hot": [
      "apnea"
    ],
    "items": [
      "Ronca o le han dicho que ronca",
      "Se levanta cansada tras ocho horas",
      "Dolor de cabeza al despertar",
      "Cabezadas por la tarde sin querer"
    ],
    "mood": "science",
    "dur": 8.5
  },
  {
    "id": "fill_checklist_17",
    "start": 502.68,
    "dur": 4.3,
    "kind": "talk"
  },
  {
    "id": "clip_v075",
    "start": 506.98,
    "kind": "full",
    "src": "broll/vbs_v075.mp4",
    "video": true,
    "ken": "right",
    "dur": 4
  },
  {
    "id": "ph_clip_v075",
    "start": 510.98,
    "dur": 4.68,
    "kind": "full",
    "src": "img/vbs_v075.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "quote_18",
    "start": 515.66,
    "kind": "quote",
    "kicker": "Quince años pensando que era la edad",
    "quote": "Se duerme mal porque hay algo que arreglar.",
    "author": "Dra. Valeria Alcázar",
    "role": "Medicina estética",
    "image": "img/vbs_v076.jpg",
    "mood": "gold",
    "dur": 3.48
  },
  {
    "id": "chapter_19",
    "start": 519.34,
    "kind": "chapter",
    "kicker": "Señal",
    "index": "N.º 02",
    "title": "Bebe y la sed no se calma",
    "sub": "Cuando el agua no apaga la sed, hay que mirar el azúcar.",
    "dur": 5
  },
  {
    "id": "fill_chapter_19",
    "start": 524.34,
    "dur": 1.16,
    "kind": "talk"
  },
  {
    "id": "clip_v078",
    "start": 525.5,
    "kind": "full",
    "src": "broll/vbs_v078.mp4",
    "video": true,
    "ken": "out",
    "dur": 2.46
  },
  {
    "id": "clip_v079",
    "start": 527.96,
    "kind": "full",
    "src": "broll/vbs_v079.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v079",
    "start": 531.96,
    "dur": 4.14,
    "kind": "full",
    "src": "img/vbs_v079.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "clip_v081",
    "start": 536.1,
    "kind": "full",
    "src": "broll/vbs_v081.mp4",
    "video": true,
    "ken": "in",
    "dur": 3.78
  },
  {
    "id": "beforeafter_20",
    "start": 539.88,
    "kind": "beforeafter",
    "kicker": "La jarra de Marisa",
    "title": "Eso no era hidratarse",
    "hot": [
      "hidratarse"
    ],
    "imageA": "img/vbs_v080.jpg",
    "imageB": "img/vbs_v081.jpg",
    "labelA": "Al acostarse: llena",
    "labelB": "Al despertar: vacía",
    "mood": "cool",
    "dur": 7
  },
  {
    "id": "fill_beforeafter_20",
    "start": 546.88,
    "dur": 1.84,
    "kind": "talk"
  },
  {
    "id": "clip_v084",
    "start": 548.72,
    "kind": "full",
    "src": "broll/vbs_v084.mp4",
    "video": true,
    "ken": "out",
    "dur": 4
  },
  {
    "id": "ph_clip_v084",
    "start": 552.72,
    "dur": 6.4,
    "kind": "full",
    "src": "img/vbs_v084.jpg",
    "video": false,
    "ken": "left"
  },
  {
    "id": "clip_v085",
    "start": 559.3,
    "kind": "full",
    "src": "broll/vbs_v085.mp4",
    "video": true,
    "ken": "right",
    "dur": 2.2
  },
  {
    "id": "checklist_21",
    "start": 561.5,
    "kind": "checklist",
    "kicker": "Pida un análisis si se junta",
    "title": "Sed + baño + estos avisos",
    "hot": [
      "análisis"
    ],
    "items": [
      "Sed que no se calma por más que beba",
      "Se levanta varias veces al baño",
      "Ha perdido peso sin proponérselo",
      "Una herida que tarda en cerrar"
    ],
    "mood": "science",
    "dur": 8.5
  },
  {
    "id": "fill_checklist_21",
    "start": 570,
    "dur": 1.88,
    "kind": "talk"
  },
  {
    "id": "clip_v087",
    "start": 571.88,
    "kind": "full",
    "src": "broll/vbs_v087.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v087",
    "start": 575.88,
    "dur": 2.24,
    "kind": "full",
    "src": "img/vbs_v087.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "clip_v088",
    "start": 578.12,
    "kind": "full",
    "src": "broll/vbs_v088.mp4",
    "video": true,
    "ken": "left",
    "dur": 2.02
  },
  {
    "id": "hero_22",
    "start": 580.14,
    "kind": "hero",
    "kicker": "No mate al mensajero",
    "title": "La boca seca solo avisa",
    "hot": [
      "avisa"
    ],
    "sub": "Beber agua y no hacer nada más es lo peor que podemos hacer.",
    "image": "img/vbs_v088.jpg",
    "side": "left",
    "mood": "gold",
    "dur": 6
  },
  {
    "id": "fill_hero_22",
    "start": 586.14,
    "dur": 0.64,
    "kind": "talk"
  },
  {
    "id": "chapter_23",
    "start": 586.78,
    "kind": "chapter",
    "kicker": "Señal",
    "index": "N.º 03",
    "title": "Su lista de medicamentos",
    "sub": "La causa número uno a esta edad. Probablemente la suya.",
    "dur": 5
  },
  {
    "id": "fill_chapter_23",
    "start": 591.78,
    "dur": 10.76,
    "kind": "talk"
  },
  {
    "id": "clip_v089",
    "start": 602.54,
    "kind": "full",
    "src": "broll/vbs_v089.mp4",
    "video": true,
    "ken": "right",
    "dur": 4
  },
  {
    "id": "ph_clip_v089",
    "start": 606.54,
    "dur": 1.22,
    "kind": "full",
    "src": "img/vbs_v089.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "clip_v090",
    "start": 607.76,
    "kind": "full",
    "src": "broll/vbs_v090.mp4",
    "video": true,
    "ken": "out",
    "dur": 2.52
  },
  {
    "id": "stat_24",
    "start": 610.28,
    "kind": "stat",
    "kicker": "El pastillero de Carmen",
    "value": 4,
    "label": "pastillas cada mañana",
    "sub": "Tensión, diurético, antihistamínico y una para dormir.",
    "image": "img/vbs_h_pastillero.jpg",
    "mood": "gold",
    "decimals": 0,
    "dur": 6.5
  },
  {
    "id": "fill_stat_24",
    "start": 616.78,
    "dur": 3.36,
    "kind": "talk"
  },
  {
    "id": "clip_v095",
    "start": 620.14,
    "kind": "full",
    "src": "broll/vbs_v095.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v095",
    "start": 624.14,
    "dur": 1.88,
    "kind": "full",
    "src": "img/vbs_v095.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "clip_v096",
    "start": 626.02,
    "kind": "full",
    "src": "broll/vbs_v096.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "fill_clip_v096",
    "start": 630.02,
    "dur": 0.52,
    "kind": "talk"
  },
  {
    "id": "stat_25",
    "start": 630.54,
    "kind": "stat",
    "kicker": "Efecto secundario",
    "value": 400,
    "prefix": "+",
    "label": "medicamentos corrientes resecan la boca",
    "sub": "No son medicinas raras: son las de todos los días.",
    "image": "img/vbs_v097.jpg",
    "mood": "science",
    "decimals": 0,
    "dur": 6.5
  },
  {
    "id": "fill_stat_25",
    "start": 637.04,
    "dur": 1,
    "kind": "talk"
  },
  {
    "id": "checklist_26",
    "start": 638.04,
    "kind": "checklist",
    "kicker": "Las que están en casi todos los pastilleros",
    "title": "Las de todos los días",
    "hot": [
      "días"
    ],
    "items": [
      "Tensión, y sobre todo los diuréticos",
      "Antihistamínicos de la alergia",
      "Antidepresivos y ansiolíticos",
      "Pastillas para dormir",
      "Vejiga, mareo y dolor"
    ],
    "mood": "science",
    "dur": 8.5
  },
  {
    "id": "fill_checklist_26",
    "start": 646.54,
    "dur": 3.08,
    "kind": "talk"
  },
  {
    "id": "clip_v102",
    "start": 649.62,
    "kind": "full",
    "src": "broll/vbs_v102.mp4",
    "video": true,
    "ken": "out",
    "dur": 4
  },
  {
    "id": "ph_clip_v102",
    "start": 653.62,
    "dur": 3.14,
    "kind": "full",
    "src": "img/vbs_v102.jpg",
    "video": false,
    "ken": "left"
  },
  {
    "id": "clip_v104",
    "start": 656.76,
    "kind": "full",
    "src": "broll/vbs_v104.mp4",
    "video": true,
    "ken": "right",
    "dur": 4
  },
  {
    "id": "fill_clip_v104",
    "start": 660.76,
    "dur": 0.44,
    "kind": "talk"
  },
  {
    "id": "clip_v105",
    "start": 661.2,
    "kind": "full",
    "src": "broll/vbs_v105.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v105",
    "start": 665.2,
    "dur": 2.14,
    "kind": "full",
    "src": "img/vbs_v105.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "hero_27",
    "start": 667.34,
    "kind": "hero",
    "kicker": "Orden médica",
    "title": "No suspenda nada por su cuenta",
    "hot": [
      "nada"
    ],
    "sub": "Jamás. Lo que hay que hacer es otra cosa, mucho más inteligente.",
    "image": "img/vbs_h_receta.jpg",
    "side": "right",
    "mood": "alert",
    "dur": 6
  },
  {
    "id": "fill_hero_27",
    "start": 673.34,
    "dur": 3.42,
    "kind": "talk"
  },
  {
    "id": "clip_v107",
    "start": 676.76,
    "kind": "full",
    "src": "broll/vbs_v107.mp4",
    "video": true,
    "ken": "left",
    "dur": 2.44
  },
  {
    "id": "clip_v108",
    "start": 679.2,
    "kind": "full",
    "src": "broll/vbs_v108.mp4",
    "video": true,
    "ken": "right",
    "dur": 1.2
  },
  {
    "id": "quote_28",
    "start": 680.4,
    "kind": "quote",
    "kicker": "Dígalo con estas palabras",
    "quote": "Doctor, tengo la boca muy seca por las noches: ¿alguno de estos medicamentos me la puede estar resecando?",
    "author": "La frase que abre la conversación",
    "role": "Llévela apuntada",
    "image": "img/vbs_v109.jpg",
    "mood": "gold",
    "dur": 6.8
  },
  {
    "id": "fill_quote_28",
    "start": 687.2,
    "dur": 3.52,
    "kind": "talk"
  },
  {
    "id": "clip_v110",
    "start": 690.72,
    "kind": "full",
    "src": "broll/vbs_v110.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v110",
    "start": 694.72,
    "dur": 3.06,
    "kind": "full",
    "src": "img/vbs_v110.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "clip_v111",
    "start": 697.78,
    "kind": "full",
    "src": "broll/vbs_v111.mp4",
    "video": true,
    "ken": "left",
    "dur": 3.74
  },
  {
    "id": "step_29",
    "start": 701.52,
    "kind": "step",
    "step": 3,
    "total": 7,
    "title": "A veces se arregla con la hora",
    "hot": [
      "hora"
    ],
    "sub": "Mover una toma de la noche a la mañana puede cambiarle el descanso.",
    "image": "img/vbs_v110.jpg",
    "mood": "science",
    "dur": 7
  },
  {
    "id": "fill_step_29",
    "start": 708.52,
    "dur": 0.88,
    "kind": "talk"
  },
  {
    "id": "chapter_30",
    "start": 709.4,
    "kind": "chapter",
    "kicker": "Señal",
    "index": "N.º 04",
    "title": "Boca seca y ojos secos",
    "sub": "Juntas son una pareja que los médicos conocemos bien.",
    "dur": 5
  },
  {
    "id": "fill_chapter_30",
    "start": 714.4,
    "dur": 4.58,
    "kind": "talk"
  },
  {
    "id": "clip_v115",
    "start": 718.98,
    "kind": "full",
    "src": "broll/vbs_v115.mp4",
    "video": true,
    "ken": "right",
    "dur": 4
  },
  {
    "id": "fill_clip_v115",
    "start": 722.98,
    "dur": 0.82,
    "kind": "talk"
  },
  {
    "id": "clip_v116",
    "start": 723.8,
    "kind": "full",
    "src": "broll/vbs_v116.mp4",
    "video": true,
    "ken": "in",
    "dur": 2.32
  },
  {
    "id": "clip_v114",
    "start": 726.12,
    "kind": "full",
    "src": "broll/vbs_v114.mp4",
    "video": true,
    "ken": "out",
    "dur": 4
  },
  {
    "id": "ph_clip_v114",
    "start": 730.12,
    "dur": 4,
    "kind": "full",
    "src": "img/vbs_v114.jpg",
    "video": false,
    "ken": "left"
  },
  {
    "id": "clip_v119",
    "start": 734.36,
    "kind": "full",
    "src": "broll/vbs_v119.mp4",
    "video": true,
    "ken": "right",
    "dur": 3.62
  },
  {
    "id": "molecule_31",
    "start": 737.98,
    "kind": "molecule",
    "kicker": "Los siete años de Pilar",
    "title": "Tres piezas que nadie juntó",
    "hot": [
      "juntó"
    ],
    "centerLabel": "Un solo cuadro",
    "sub": "Cada médico miraba su trozo. Júntelas usted.",
    "nodes": [
      {
        "label": "Ojos secos"
      },
      {
        "label": "Boca seca"
      },
      {
        "label": "Articulaciones"
      }
    ],
    "image": "img/vbs_v120.jpg",
    "mood": "science",
    "dur": 7
  },
  {
    "id": "fill_molecule_31",
    "start": 744.98,
    "dur": 7.52,
    "kind": "talk"
  },
  {
    "id": "clip_v122",
    "start": 752.5,
    "kind": "full",
    "src": "broll/vbs_v122.mp4",
    "video": true,
    "ken": "in",
    "dur": 2.5
  },
  {
    "id": "clip_v123",
    "start": 755,
    "kind": "full",
    "src": "broll/vbs_v123.mp4",
    "video": true,
    "ken": "out",
    "dur": 4
  },
  {
    "id": "ph_clip_v123",
    "start": 759,
    "dur": 1.7,
    "kind": "full",
    "src": "img/vbs_v123.jpg",
    "video": false,
    "ken": "left"
  },
  {
    "id": "hero_32",
    "start": 760.7,
    "kind": "hero",
    "kicker": "Por qué se lo cuento a usted",
    "title": "Sobre todo a mujeres",
    "hot": [
      "mujeres"
    ],
    "sub": "Y suele dar la cara en los años que siguen a la menopausia.",
    "image": "img/vbs_v124.jpg",
    "side": "left",
    "mood": "gold",
    "dur": 6
  },
  {
    "id": "fill_hero_32",
    "start": 766.7,
    "dur": 4.88,
    "kind": "talk"
  },
  {
    "id": "clip_v125",
    "start": 771.58,
    "kind": "full",
    "src": "broll/vbs_v125.mp4",
    "video": true,
    "ken": "right",
    "dur": 1.5
  },
  {
    "id": "quote_33",
    "start": 773.08,
    "kind": "quote",
    "kicker": "Dígalo entero, en la misma frase",
    "quote": "Tengo la boca seca, los ojos secos y me duelen las articulaciones.",
    "author": "Las tres piezas, juntas",
    "role": "Con un análisis se empieza a estudiar",
    "image": "img/vbs_v126.jpg",
    "mood": "science",
    "dur": 6.8
  },
  {
    "id": "fill_quote_33",
    "start": 779.88,
    "dur": 0.9,
    "kind": "talk"
  },
  {
    "id": "clip_v126",
    "start": 780.78,
    "kind": "full",
    "src": "img/vbs_v126.jpg",
    "video": false,
    "ken": "in",
    "dur": 3.36
  },
  {
    "id": "clip_v127",
    "start": 784.14,
    "kind": "full",
    "src": "broll/vbs_v127.mp4",
    "video": true,
    "ken": "out",
    "dur": 3.9
  },
  {
    "id": "chapter_34",
    "start": 788.04,
    "kind": "chapter",
    "kicker": "Señal",
    "index": "N.º 05",
    "title": "Mal aliento y lengua que arde",
    "sub": "No es falta de higiene: es falta de riego.",
    "dur": 5
  },
  {
    "id": "fill_chapter_34",
    "start": 793.04,
    "dur": 6.86,
    "kind": "talk"
  },
  {
    "id": "clip_v129",
    "start": 799.9,
    "kind": "full",
    "src": "broll/vbs_v129.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "fill_clip_v129",
    "start": 803.9,
    "dur": 0.52,
    "kind": "talk"
  },
  {
    "id": "hero_35",
    "start": 804.42,
    "kind": "hero",
    "kicker": "La saliva es el riego",
    "title": "Sin riego, las bacterias trabajan",
    "hot": [
      "bacterias"
    ],
    "sub": "Por eso no mejora por más que se cepille.",
    "image": "img/vbs_v131.jpg",
    "side": "right",
    "mood": "science",
    "dur": 6
  },
  {
    "id": "fill_hero_35",
    "start": 810.42,
    "dur": 0.44,
    "kind": "talk"
  },
  {
    "id": "clip_v131",
    "start": 810.86,
    "kind": "full",
    "src": "broll/vbs_v131.mp4",
    "video": true,
    "ken": "right",
    "dur": 4
  },
  {
    "id": "fill_clip_v131",
    "start": 814.86,
    "dur": 1.14,
    "kind": "talk"
  },
  {
    "id": "clip_v132",
    "start": 816,
    "kind": "full",
    "src": "broll/vbs_v132.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "clip_v134",
    "start": 820.06,
    "kind": "full",
    "src": "broll/vbs_v134.mp4",
    "video": true,
    "ken": "out",
    "dur": 4
  },
  {
    "id": "ph_clip_v134",
    "start": 824.06,
    "dur": 2.72,
    "kind": "full",
    "src": "img/vbs_v134.jpg",
    "video": false,
    "ken": "left"
  },
  {
    "id": "clip_v135",
    "start": 826.78,
    "kind": "full",
    "src": "broll/vbs_v135.mp4",
    "video": true,
    "ken": "right",
    "dur": 1.88
  },
  {
    "id": "clip_v136",
    "start": 828.66,
    "kind": "full",
    "src": "broll/vbs_v136.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v136",
    "start": 832.66,
    "dur": 2.48,
    "kind": "full",
    "src": "img/vbs_v136.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "checklist_36",
    "start": 835.14,
    "kind": "checklist",
    "kicker": "Qué puede haber detrás",
    "title": "La lengua que arde",
    "hot": [
      "arde"
    ],
    "items": [
      "Falta de hierro",
      "Falta de vitamina B12",
      "Falta de zinc",
      "Un hongo aprovechando la sequedad",
      "Un efecto de la medicación"
    ],
    "mood": "science",
    "dur": 8.5
  },
  {
    "id": "fill_checklist_36",
    "start": 843.64,
    "dur": 1.66,
    "kind": "talk"
  },
  {
    "id": "clip_v139",
    "start": 845.3,
    "kind": "full",
    "src": "broll/vbs_v139.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v139",
    "start": 849.3,
    "dur": 2.08,
    "kind": "full",
    "src": "img/vbs_v139.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "clip_v140",
    "start": 851.38,
    "kind": "full",
    "src": "broll/vbs_v140.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v140",
    "start": 855.38,
    "dur": 4.24,
    "kind": "full",
    "src": "img/vbs_v140.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "clip_v142",
    "start": 859.62,
    "kind": "full",
    "src": "broll/vbs_v142.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v142",
    "start": 863.62,
    "dur": 1.6,
    "kind": "full",
    "src": "img/vbs_v142.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "quote_37",
    "start": 865.22,
    "kind": "quote",
    "kicker": "Se ve, se trata y se acaba",
    "quote": "No lo aguante callada.",
    "author": "Dra. Valeria Alcázar",
    "role": "Medicina estética",
    "image": "img/vbs_h_consulta2.jpg",
    "mood": "gold",
    "dur": 1.34
  },
  {
    "id": "chapter_38",
    "start": 866.56,
    "kind": "chapter",
    "kicker": "Señal",
    "index": "N.º 06",
    "title": "Encías que sangran y caries nuevas",
    "sub": "A una edad en la que ya no debería tenerlas.",
    "dur": 5
  },
  {
    "id": "fill_chapter_38",
    "start": 871.56,
    "dur": 5.4,
    "kind": "talk"
  },
  {
    "id": "clip_v145",
    "start": 876.96,
    "kind": "full",
    "src": "broll/vbs_v145.mp4",
    "video": true,
    "ken": "in",
    "dur": 1.78
  },
  {
    "id": "stat_39",
    "start": 878.74,
    "kind": "stat",
    "kicker": "Veinte años sin una caries",
    "value": 5,
    "label": "caries en una sola revisión",
    "sub": "No fue mala suerte: se le había secado la boca.",
    "image": "img/vbs_v145.jpg",
    "mood": "alert",
    "decimals": 0,
    "dur": 6.5
  },
  {
    "id": "fill_stat_39",
    "start": 885.24,
    "dur": 4.74,
    "kind": "talk"
  },
  {
    "id": "clip_v146",
    "start": 889.98,
    "kind": "full",
    "src": "broll/vbs_v146.mp4",
    "video": true,
    "ken": "out",
    "dur": 3.62
  },
  {
    "id": "clip_v147",
    "start": 893.6,
    "kind": "full",
    "src": "broll/vbs_v147.mp4",
    "video": true,
    "ken": "left",
    "dur": 3.34
  },
  {
    "id": "beforeafter_40",
    "start": 896.94,
    "kind": "beforeafter",
    "kicker": "La reparación que ocurre mientras duerme",
    "title": "Con saliva y sin saliva",
    "hot": [
      "saliva"
    ],
    "imageA": "img/vbs_v148.jpg",
    "imageB": "img/vbs_v254.jpg",
    "labelA": "Con saliva: el esmalte se repara",
    "labelB": "Sin saliva: el esmalte se pica",
    "mood": "science",
    "dur": 7
  },
  {
    "id": "fill_beforeafter_40",
    "start": 903.94,
    "dur": 9,
    "kind": "talk"
  },
  {
    "id": "clip_v149",
    "start": 912.94,
    "kind": "full",
    "src": "broll/vbs_v149.mp4",
    "video": true,
    "ken": "right",
    "dur": 1.84
  },
  {
    "id": "clip_v150",
    "start": 914.78,
    "kind": "full",
    "src": "broll/vbs_v150.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v150",
    "start": 918.78,
    "dur": 3.2,
    "kind": "full",
    "src": "img/vbs_v150.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "clip_v151",
    "start": 921.98,
    "kind": "full",
    "src": "broll/vbs_v151.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v151",
    "start": 925.98,
    "dur": 3.52,
    "kind": "full",
    "src": "img/vbs_v151.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "clip_v152",
    "start": 929.5,
    "kind": "full",
    "src": "broll/vbs_v152.mp4",
    "video": true,
    "ken": "in",
    "dur": 1.44
  },
  {
    "id": "clip_v153",
    "start": 930.94,
    "kind": "full",
    "src": "broll/vbs_v153.mp4",
    "video": true,
    "ken": "out",
    "dur": 4
  },
  {
    "id": "fill_clip_v153",
    "start": 934.94,
    "dur": 0.68,
    "kind": "talk"
  },
  {
    "id": "clip_v155",
    "start": 935.62,
    "kind": "full",
    "src": "broll/vbs_v155.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v155",
    "start": 939.62,
    "dur": 3.06,
    "kind": "full",
    "src": "img/vbs_v155.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "clip_v156",
    "start": 942.68,
    "kind": "full",
    "src": "broll/vbs_v156.mp4",
    "video": true,
    "ken": "in",
    "dur": 3.64
  },
  {
    "id": "quote_41",
    "start": 946.32,
    "kind": "quote",
    "kicker": "Cuatro palabras que cambian la revisión",
    "quote": "Tengo la boca seca.",
    "author": "Dígaselo a su dentista",
    "role": "Le cambia el plan entero",
    "image": "img/vbs_v118.jpg",
    "mood": "gold",
    "dur": 6.8
  },
  {
    "id": "fill_quote_41",
    "start": 953.12,
    "dur": 0.9,
    "kind": "talk"
  },
  {
    "id": "clip_v157",
    "start": 954.02,
    "kind": "full",
    "src": "broll/vbs_v157.mp4",
    "video": true,
    "ken": "out",
    "dur": 2
  },
  {
    "id": "clip_v158",
    "start": 956.02,
    "kind": "full",
    "src": "broll/vbs_v158.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v158",
    "start": 960.02,
    "dur": 1.64,
    "kind": "full",
    "src": "img/vbs_v158.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "chapter_42",
    "start": 961.66,
    "kind": "chapter",
    "kicker": "Señal",
    "index": "N.º 07",
    "title": "Lo que confunde con una arruga",
    "sub": "La única que se mira cada mañana en el espejo.",
    "dur": 5
  },
  {
    "id": "fill_chapter_42",
    "start": 966.66,
    "dur": 3.1,
    "kind": "talk"
  },
  {
    "id": "clip_v161",
    "start": 969.76,
    "kind": "full",
    "src": "broll/vbs_v161.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v161",
    "start": 973.76,
    "dur": 2.68,
    "kind": "full",
    "src": "img/vbs_v161.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "clip_v162",
    "start": 976.44,
    "kind": "full",
    "src": "broll/vbs_v162.mp4",
    "video": true,
    "ken": "left",
    "dur": 2.94
  },
  {
    "id": "clip_v163",
    "start": 979.38,
    "kind": "full",
    "src": "broll/vbs_v163.mp4",
    "video": true,
    "ken": "right",
    "dur": 4
  },
  {
    "id": "seam_983",
    "start": 981.86,
    "dur": 3,
    "kind": "full",
    "src": "img/vbs_v164.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "fill_clip_v163",
    "start": 983.38,
    "dur": 1,
    "kind": "talk"
  },
  {
    "id": "hero_43",
    "start": 984.38,
    "kind": "hero",
    "kicker": "Queilitis angular",
    "title": "Las boqueras de toda la vida",
    "hot": [
      "boqueras"
    ],
    "sub": "Y no salen porque sí.",
    "image": "img/vbs_v161.jpg",
    "side": "right",
    "mood": "alert",
    "dur": 6
  },
  {
    "id": "fill_hero_43",
    "start": 990.38,
    "dur": 1.84,
    "kind": "talk"
  },
  {
    "id": "clip_v165",
    "start": 992.22,
    "kind": "full",
    "src": "broll/vbs_v165.mp4",
    "video": true,
    "ken": "in",
    "dur": 2.94
  },
  {
    "id": "clip_v166",
    "start": 995.16,
    "kind": "full",
    "src": "broll/vbs_v166.mp4",
    "video": true,
    "ken": "out",
    "dur": 4
  },
  {
    "id": "ph_clip_v166",
    "start": 999.16,
    "dur": 1.84,
    "kind": "full",
    "src": "img/vbs_v166.jpg",
    "video": false,
    "ken": "left"
  },
  {
    "id": "clip_v168",
    "start": 1001,
    "kind": "full",
    "src": "broll/vbs_v168.mp4",
    "video": true,
    "ken": "right",
    "dur": 4
  },
  {
    "id": "ph_clip_v168",
    "start": 1005,
    "dur": 6.4,
    "kind": "full",
    "src": "img/vbs_v168.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "fill_clip_v168",
    "start": 1011.4,
    "dur": 7.6,
    "kind": "talk"
  },
  {
    "id": "molecule_44",
    "start": 1019,
    "kind": "molecule",
    "kicker": "El gesto que agrieta",
    "title": "El círculo del labio",
    "hot": [
      "círculo"
    ],
    "centerLabel": "Más seco",
    "sub": "La saliva se evapora y se lleva la grasa que protegía el labio.",
    "nodes": [
      {
        "label": "Se lame"
      },
      {
        "label": "Se evapora"
      },
      {
        "label": "Se agrieta"
      }
    ],
    "image": "img/vbs_v170.jpg",
    "mood": "alert",
    "dur": 7
  },
  {
    "id": "clip_v171",
    "start": 1026.02,
    "kind": "full",
    "src": "broll/vbs_v171.mp4",
    "video": true,
    "ken": "out",
    "dur": 4
  },
  {
    "id": "ph_clip_v171",
    "start": 1030.02,
    "dur": 5.1,
    "kind": "full",
    "src": "img/vbs_v171.jpg",
    "video": false,
    "ken": "left"
  },
  {
    "id": "clip_v172",
    "start": 1035.12,
    "kind": "full",
    "src": "broll/vbs_v172.mp4",
    "video": true,
    "ken": "right",
    "dur": 4
  },
  {
    "id": "ph_clip_v172",
    "start": 1039.12,
    "dur": 3.2,
    "kind": "full",
    "src": "img/vbs_v172.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "fill_clip_v172",
    "start": 1042.32,
    "dur": 1,
    "kind": "talk"
  },
  {
    "id": "clip_v173",
    "start": 1043.32,
    "kind": "full",
    "src": "broll/vbs_v173.mp4",
    "video": true,
    "ken": "out",
    "dur": 1.6
  },
  {
    "id": "beforeafter_45",
    "start": 1044.92,
    "kind": "beforeafter",
    "kicker": "El código de barras",
    "title": "El mismo labio, con agua y sin agua",
    "hot": [
      "agua"
    ],
    "imageA": "img/vbs_v173.jpg",
    "imageB": "img/vbs_v174.jpg",
    "labelA": "Deshidratado: se marca",
    "labelB": "Hidratado: se difumina",
    "mood": "gold",
    "dur": 7
  },
  {
    "id": "fill_beforeafter_45",
    "start": 1051.92,
    "dur": 5.24,
    "kind": "talk"
  },
  {
    "id": "quote_46",
    "start": 1057.16,
    "kind": "quote",
    "kicker": "Lo que de verdad rejuvenece esa zona",
    "quote": "No empieza en un tarro caro. Empieza en la saliva.",
    "author": "Dra. Valeria Alcázar",
    "role": "Medicina estética",
    "image": "img/vbs_h_labios.jpg",
    "mood": "gold",
    "dur": 6.8
  },
  {
    "id": "fill_quote_46",
    "start": 1063.96,
    "dur": 2.84,
    "kind": "talk"
  },
  {
    "id": "clip_v178",
    "start": 1066.8,
    "kind": "full",
    "src": "broll/vbs_v178.mp4",
    "video": true,
    "ken": "left",
    "dur": 1.66
  },
  {
    "id": "chapter_47",
    "start": 1068.46,
    "kind": "chapter",
    "kicker": "El papel que le escribí a Carmen",
    "index": "El ritual",
    "title": "Siete cosas para esta noche",
    "sub": "Las medidas exactas, apuntadas en la descripción.",
    "dur": 5
  },
  {
    "id": "fill_chapter_47",
    "start": 1073.46,
    "dur": 12.94,
    "kind": "talk"
  },
  {
    "id": "step_48",
    "start": 1086.4,
    "kind": "step",
    "step": 1,
    "total": 7,
    "title": "Beba repartido, no de golpe",
    "hot": [
      "repartido"
    ],
    "sub": "Sorbos pequeños todo el día. Un vaso enorme de noche solo llena la vejiga.",
    "image": "img/vbs_h_vaso.jpg",
    "mood": "cool",
    "dur": 7
  },
  {
    "id": "fill_step_48",
    "start": 1093.4,
    "dur": 2.38,
    "kind": "talk"
  },
  {
    "id": "clip_v181",
    "start": 1095.78,
    "kind": "full",
    "src": "broll/vbs_v181.mp4",
    "video": true,
    "ken": "right",
    "dur": 4
  },
  {
    "id": "ph_clip_v181",
    "start": 1099.78,
    "dur": 3.2,
    "kind": "full",
    "src": "img/vbs_v181.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "fill_clip_v181",
    "start": 1102.98,
    "dur": 0.5,
    "kind": "talk"
  },
  {
    "id": "clip_v182",
    "start": 1103.48,
    "kind": "full",
    "src": "broll/vbs_v182.mp4",
    "video": true,
    "ken": "out",
    "dur": 3.44
  },
  {
    "id": "clip_v183",
    "start": 1106.92,
    "kind": "full",
    "src": "broll/vbs_v183.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v183",
    "start": 1110.92,
    "dur": 3.1,
    "kind": "full",
    "src": "img/vbs_v183.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "clip_v185",
    "start": 1114.02,
    "kind": "full",
    "src": "broll/vbs_v185.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v185",
    "start": 1118.02,
    "dur": 3.64,
    "kind": "full",
    "src": "img/vbs_v185.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "clip_v186",
    "start": 1121.66,
    "kind": "full",
    "src": "broll/vbs_v186.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v186",
    "start": 1125.66,
    "dur": 1.36,
    "kind": "full",
    "src": "img/vbs_v186.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "step_49",
    "start": 1127.02,
    "kind": "step",
    "step": 2,
    "total": 7,
    "title": "Enjuague de bicarbonato y sal",
    "hot": [
      "bicarbonato"
    ],
    "sub": "Agua templada. Las cantidades exactas, en la descripción.",
    "image": "img/vbs_h_bicarbonato.jpg",
    "mood": "science",
    "dur": 7
  },
  {
    "id": "fill_step_49",
    "start": 1134.02,
    "dur": 1.84,
    "kind": "talk"
  },
  {
    "id": "clip_v190",
    "start": 1135.86,
    "kind": "full",
    "src": "broll/vbs_v190.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v190",
    "start": 1139.86,
    "dur": 3.9,
    "kind": "full",
    "src": "img/vbs_v190.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "clip_v191",
    "start": 1143.76,
    "kind": "full",
    "src": "broll/vbs_v191.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "fill_clip_v191",
    "start": 1147.76,
    "dur": 0.64,
    "kind": "talk"
  },
  {
    "id": "clip_v192",
    "start": 1148.4,
    "kind": "full",
    "src": "broll/vbs_v192.mp4",
    "video": true,
    "ken": "right",
    "dur": 4
  },
  {
    "id": "ph_clip_v192",
    "start": 1152.4,
    "dur": 5.2,
    "kind": "full",
    "src": "img/vbs_v192.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "clip_v194",
    "start": 1157.6,
    "kind": "full",
    "src": "broll/vbs_v194.mp4",
    "video": true,
    "ken": "out",
    "dur": 4
  },
  {
    "id": "ph_clip_v194",
    "start": 1161.6,
    "dur": 3.9,
    "kind": "full",
    "src": "img/vbs_v194.jpg",
    "video": false,
    "ken": "left"
  },
  {
    "id": "clip_v196",
    "start": 1165.5,
    "kind": "full",
    "src": "broll/vbs_v196.mp4",
    "video": true,
    "ken": "right",
    "dur": 4
  },
  {
    "id": "ph_clip_v196",
    "start": 1169.5,
    "dur": 6.4,
    "kind": "full",
    "src": "img/vbs_v196.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "fill_clip_v196",
    "start": 1175.9,
    "dur": 8.22,
    "kind": "talk"
  },
  {
    "id": "step_50",
    "start": 1184.12,
    "kind": "step",
    "step": 3,
    "total": 7,
    "title": "Fuera lo que reseca",
    "hot": [
      "reseca"
    ],
    "sub": "Tabaco, alcohol de la cena, café de después y caramelos con azúcar.",
    "image": "img/vbs_v197.jpg",
    "mood": "alert",
    "dur": 7
  },
  {
    "id": "fill_step_50",
    "start": 1191.12,
    "dur": 4.38,
    "kind": "talk"
  },
  {
    "id": "clip_v199",
    "start": 1195.5,
    "kind": "full",
    "src": "broll/vbs_v199.mp4",
    "video": true,
    "ken": "out",
    "dur": 1.8
  },
  {
    "id": "clip_v200",
    "start": 1197.3,
    "kind": "full",
    "src": "broll/vbs_v200.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v200",
    "start": 1201.3,
    "dur": 6.4,
    "kind": "full",
    "src": "img/vbs_v200.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "fill_clip_v200",
    "start": 1207.7,
    "dur": 1.94,
    "kind": "talk"
  },
  {
    "id": "clip_v202",
    "start": 1209.64,
    "kind": "full",
    "src": "broll/vbs_v202.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "fill_clip_v202",
    "start": 1213.64,
    "dur": 0.78,
    "kind": "talk"
  },
  {
    "id": "step_51",
    "start": 1214.42,
    "kind": "step",
    "step": 4,
    "total": 7,
    "title": "Despierte las glándulas",
    "hot": [
      "glándulas"
    ],
    "sub": "Chicle sin azúcar con xilitol y medio minuto de masaje por cada lado.",
    "image": "img/vbs_h_masaje.jpg",
    "mood": "gold",
    "dur": 7
  },
  {
    "id": "fill_step_51",
    "start": 1221.42,
    "dur": 4.36,
    "kind": "talk"
  },
  {
    "id": "clip_v205",
    "start": 1225.78,
    "kind": "full",
    "src": "broll/vbs_v205.mp4",
    "video": true,
    "ken": "out",
    "dur": 4
  },
  {
    "id": "ph_clip_v205",
    "start": 1229.78,
    "dur": 6.4,
    "kind": "full",
    "src": "img/vbs_v205.jpg",
    "video": false,
    "ken": "left"
  },
  {
    "id": "fill_clip_v205",
    "start": 1236.18,
    "dur": 3.48,
    "kind": "talk"
  },
  {
    "id": "clip_v206",
    "start": 1239.66,
    "kind": "full",
    "src": "broll/vbs_v206.mp4",
    "video": true,
    "ken": "right",
    "dur": 3.66
  },
  {
    "id": "clip_v207",
    "start": 1243.32,
    "kind": "full",
    "src": "broll/vbs_v207.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v207",
    "start": 1247.32,
    "dur": 1.58,
    "kind": "full",
    "src": "img/vbs_v207.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "clip_v209",
    "start": 1248.9,
    "kind": "full",
    "src": "broll/vbs_v209.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v209",
    "start": 1252.9,
    "dur": 6.4,
    "kind": "full",
    "src": "img/vbs_v209.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "fill_clip_v209",
    "start": 1259.3,
    "dur": 2.74,
    "kind": "talk"
  },
  {
    "id": "clip_v211",
    "start": 1262.04,
    "kind": "full",
    "src": "broll/vbs_v211.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v211",
    "start": 1266.04,
    "dur": 5.98,
    "kind": "full",
    "src": "img/vbs_v211.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "clip_v212",
    "start": 1272.02,
    "kind": "full",
    "src": "broll/vbs_v212.mp4",
    "video": true,
    "ken": "left",
    "dur": 2.24
  },
  {
    "id": "step_52",
    "start": 1274.26,
    "kind": "step",
    "step": 5,
    "total": 7,
    "title": "Infusión de malva templada",
    "hot": [
      "malva"
    ],
    "sub": "Los mucílagos tapizan la mucosa y calman la aspereza.",
    "image": "img/vbs_h_malva.jpg",
    "mood": "science",
    "dur": 7
  },
  {
    "id": "clip_v214",
    "start": 1281.46,
    "kind": "full",
    "src": "broll/vbs_v214.mp4",
    "video": true,
    "ken": "right",
    "dur": 3.16
  },
  {
    "id": "clip_v215",
    "start": 1284.62,
    "kind": "full",
    "src": "broll/vbs_v215.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v215",
    "start": 1288.62,
    "dur": 2.42,
    "kind": "full",
    "src": "img/vbs_v215.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "clip_v217",
    "start": 1291.04,
    "kind": "full",
    "src": "broll/vbs_v217.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v217",
    "start": 1295.04,
    "dur": 6.14,
    "kind": "full",
    "src": "img/vbs_v217.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "clip_v219",
    "start": 1301.18,
    "kind": "full",
    "src": "broll/vbs_v219.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v219",
    "start": 1305.18,
    "dur": 6.4,
    "kind": "full",
    "src": "img/vbs_v219.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "fill_clip_v219",
    "start": 1311.58,
    "dur": 1.06,
    "kind": "talk"
  },
  {
    "id": "clip_v220",
    "start": 1312.64,
    "kind": "full",
    "src": "broll/vbs_v220.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v220",
    "start": 1316.64,
    "dur": 2.24,
    "kind": "full",
    "src": "img/vbs_v220.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "step_53",
    "start": 1318.88,
    "kind": "step",
    "step": 6,
    "total": 7,
    "title": "Humedad en la habitación",
    "hot": [
      "Humedad"
    ],
    "sub": "Y trabaje la nariz: el objetivo es dormir con la boca cerrada.",
    "image": "img/vbs_v222.jpg",
    "mood": "cool",
    "dur": 7
  },
  {
    "id": "fill_step_53",
    "start": 1325.88,
    "dur": 3.96,
    "kind": "talk"
  },
  {
    "id": "clip_v223",
    "start": 1329.84,
    "kind": "full",
    "src": "broll/vbs_v223.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v223",
    "start": 1333.84,
    "dur": 2.2,
    "kind": "full",
    "src": "img/vbs_v223.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "clip_v224",
    "start": 1336.04,
    "kind": "full",
    "src": "broll/vbs_v224.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v224",
    "start": 1340.04,
    "dur": 6.4,
    "kind": "full",
    "src": "img/vbs_v224.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "clip_v225",
    "start": 1346.58,
    "kind": "full",
    "src": "broll/vbs_v225.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v225",
    "start": 1350.58,
    "dur": 5.02,
    "kind": "full",
    "src": "img/vbs_v225.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "clip_v226",
    "start": 1355.6,
    "kind": "full",
    "src": "broll/vbs_v226.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v226",
    "start": 1359.6,
    "dur": 6.36,
    "kind": "full",
    "src": "img/vbs_v226.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "step_54",
    "start": 1365.96,
    "kind": "step",
    "step": 7,
    "total": 7,
    "title": "Bálsamo espeso en los labios",
    "hot": [
      "Bálsamo"
    ],
    "sub": "Y no se los lama durante el día, por mucho que le tire la piel.",
    "image": "img/vbs_h_balsamo.jpg",
    "mood": "gold",
    "dur": 7
  },
  {
    "id": "fill_step_54",
    "start": 1372.96,
    "dur": 1.32,
    "kind": "talk"
  },
  {
    "id": "clip_v228",
    "start": 1374.28,
    "kind": "full",
    "src": "broll/vbs_v228.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v228",
    "start": 1378.28,
    "dur": 6.36,
    "kind": "full",
    "src": "img/vbs_v228.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "clip_v229",
    "start": 1384.64,
    "kind": "full",
    "src": "broll/vbs_v229.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v229",
    "start": 1388.64,
    "dur": 3.5,
    "kind": "full",
    "src": "img/vbs_v229.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "checklist_55",
    "start": 1392.14,
    "kind": "checklist",
    "kicker": "Si tiene las boqueras abiertas",
    "title": "Qué hacer con las comisuras",
    "hot": [
      "comisuras"
    ],
    "items": [
      "Zona seca y limpia durante el día",
      "No taparlas con maquillaje",
      "Si en diez días no cierran, al médico",
      "Que le miren si la mordida ha bajado"
    ],
    "mood": "alert",
    "dur": 8.5
  },
  {
    "id": "fill_checklist_55",
    "start": 1400.64,
    "dur": 10.34,
    "kind": "talk"
  },
  {
    "id": "chapter_56",
    "start": 1410.98,
    "kind": "chapter",
    "kicker": "Tres meses después",
    "index": "Carmen",
    "title": "Y no le pusimos ni una inyección",
    "sub": "Solo el papel que se llevó aquel martes.",
    "dur": 5
  },
  {
    "id": "fill_chapter_56",
    "start": 1415.98,
    "dur": 0.64,
    "kind": "talk"
  },
  {
    "id": "clip_v232",
    "start": 1416.62,
    "kind": "full",
    "src": "broll/vbs_v232.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "fill_clip_v232",
    "start": 1420.62,
    "dur": 0.52,
    "kind": "talk"
  },
  {
    "id": "clip_v233",
    "start": 1421.14,
    "kind": "full",
    "src": "broll/vbs_v233.mp4",
    "video": true,
    "ken": "out",
    "dur": 4
  },
  {
    "id": "ph_clip_v233",
    "start": 1425.14,
    "dur": 2.62,
    "kind": "full",
    "src": "img/vbs_v233.jpg",
    "video": false,
    "ken": "left"
  },
  {
    "id": "clip_v234",
    "start": 1427.76,
    "kind": "full",
    "src": "broll/vbs_v234.mp4",
    "video": true,
    "ken": "right",
    "dur": 4
  },
  {
    "id": "ph_clip_v234",
    "start": 1431.76,
    "dur": 4.54,
    "kind": "full",
    "src": "img/vbs_v234.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "beforeafter_57",
    "start": 1436.3,
    "kind": "beforeafter",
    "kicker": "El mismo espejito, tres meses después",
    "title": "Carmen, antes y después",
    "hot": [
      "después"
    ],
    "imageA": "img/vbs_h_carmen.jpg",
    "imageB": "img/vbs_h_carmen2.jpg",
    "labelA": "Comisuras agrietadas",
    "labelB": "Labio liso y cerrado",
    "mood": "gold",
    "dur": 7
  },
  {
    "id": "fill_beforeafter_57",
    "start": 1443.3,
    "dur": 18.74,
    "kind": "talk"
  },
  {
    "id": "quote_58",
    "start": 1462.04,
    "kind": "quote",
    "kicker": "Lo que dijo al salir",
    "quote": "Si llego a saber que era eso, me habría ahorrado dos años.",
    "author": "Carmen",
    "role": "68 años",
    "image": "img/vbs_v237.jpg",
    "mood": "gold",
    "dur": 6.8
  },
  {
    "id": "fill_quote_58",
    "start": 1468.84,
    "dur": 6.66,
    "kind": "talk"
  },
  {
    "id": "checklist_59",
    "start": 1475.5,
    "kind": "checklist",
    "kicker": "Pida cita sin dejarlo para el mes que viene",
    "title": "Cinco avisos que no se tratan en casa",
    "hot": [
      "Cinco"
    ],
    "items": [
      "Sed intensa con orina abundante y pérdida de peso",
      "Un bulto delante de la oreja o bajo la mandíbula",
      "Una llaga que no cura en dos semanas",
      "Dificultad para tragar",
      "Fiebre, dolor o cara hinchada"
    ],
    "mood": "alert",
    "dur": 8.5
  },
  {
    "id": "fill_checklist_59",
    "start": 1484,
    "dur": 7,
    "kind": "talk"
  },
  {
    "id": "clip_v240",
    "start": 1491,
    "kind": "full",
    "src": "broll/vbs_v240.mp4",
    "video": true,
    "ken": "out",
    "dur": 3.36
  },
  {
    "id": "clip_v241",
    "start": 1494.36,
    "kind": "full",
    "src": "broll/vbs_v241.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v241",
    "start": 1498.36,
    "dur": 4.46,
    "kind": "full",
    "src": "img/vbs_v241.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "clip_v242",
    "start": 1502.82,
    "kind": "full",
    "src": "broll/vbs_v242.mp4",
    "video": true,
    "ken": "in",
    "dur": 2.6
  },
  {
    "id": "clip_v243",
    "start": 1505.42,
    "kind": "full",
    "src": "broll/vbs_v243.mp4",
    "video": true,
    "ken": "out",
    "dur": 4
  },
  {
    "id": "ph_clip_v243",
    "start": 1509.42,
    "dur": 2.42,
    "kind": "full",
    "src": "img/vbs_v243.jpg",
    "video": false,
    "ken": "left"
  },
  {
    "id": "clip_v244",
    "start": 1511.84,
    "kind": "full",
    "src": "broll/vbs_v244.mp4",
    "video": true,
    "ken": "right",
    "dur": 4
  },
  {
    "id": "ph_clip_v244",
    "start": 1515.84,
    "dur": 6.4,
    "kind": "full",
    "src": "img/vbs_v244.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "fill_clip_v244",
    "start": 1522.24,
    "dur": 5.6,
    "kind": "talk"
  },
  {
    "id": "step_60",
    "start": 1527.84,
    "kind": "step",
    "step": 1,
    "total": 1,
    "title": "Al dentista, con la lista en la mano",
    "hot": [
      "lista"
    ],
    "sub": "Dígale: tengo la boca seca por las noches y tomo estos medicamentos.",
    "image": "img/vbs_v245.jpg",
    "mood": "science",
    "dur": 7
  },
  {
    "id": "fill_step_60",
    "start": 1534.84,
    "dur": 21.84,
    "kind": "talk"
  },
  {
    "id": "quote_61",
    "start": 1556.68,
    "kind": "quote",
    "kicker": "La frase que lo tapa todo",
    "quote": "Es la edad: una manta que echamos por encima de cosas que tienen arreglo.",
    "author": "Dra. Valeria Alcázar",
    "role": "Medicina estética",
    "image": "img/vbs_h_cierre.jpg",
    "mood": "gold",
    "dur": 6.8
  },
  {
    "id": "fill_quote_61",
    "start": 1563.48,
    "dur": 2.26,
    "kind": "talk"
  },
  {
    "id": "clip_v249",
    "start": 1565.74,
    "kind": "full",
    "src": "broll/vbs_v249.mp4",
    "video": true,
    "ken": "out",
    "dur": 4
  },
  {
    "id": "ph_clip_v249",
    "start": 1569.74,
    "dur": 3.86,
    "kind": "full",
    "src": "img/vbs_v249.jpg",
    "video": false,
    "ken": "left"
  },
  {
    "id": "clip_v250",
    "start": 1573.6,
    "kind": "full",
    "src": "broll/vbs_v250.mp4",
    "video": true,
    "ken": "right",
    "dur": 1.86
  },
  {
    "id": "checklist_62",
    "start": 1575.46,
    "kind": "checklist",
    "kicker": "Las siete señales, en una",
    "title": "Guarde esto",
    "hot": [
      "Guarde"
    ],
    "items": [
      "Seca al despertar + ronquido: descarte apnea",
      "Sed que no se calma: análisis de azúcar",
      "Revise el pastillero con su médico",
      "Boca y ojos secos: que se lo estudien",
      "Lengua que arde: hierro, B12 o zinc",
      "Caries en el cuello del diente",
      "Boqueras y código de barras"
    ],
    "mood": "science",
    "dur": 8.5
  },
  {
    "id": "fill_checklist_62",
    "start": 1583.96,
    "dur": 5.38,
    "kind": "talk"
  },
  {
    "id": "clip_v252",
    "start": 1589.34,
    "kind": "full",
    "src": "broll/vbs_v252.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v252",
    "start": 1593.34,
    "dur": 4.64,
    "kind": "full",
    "src": "img/vbs_v252.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "clip_v253",
    "start": 1597.98,
    "kind": "full",
    "src": "broll/vbs_v253.mp4",
    "video": true,
    "ken": "left",
    "dur": 4
  },
  {
    "id": "ph_clip_v253",
    "start": 1601.98,
    "dur": 6.4,
    "kind": "full",
    "src": "img/vbs_v253.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "fill_clip_v253",
    "start": 1608.38,
    "dur": 2.54,
    "kind": "talk"
  },
  {
    "id": "clip_v254",
    "start": 1610.92,
    "kind": "full",
    "src": "broll/vbs_v254.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v254",
    "start": 1614.92,
    "dur": 3.72,
    "kind": "full",
    "src": "img/vbs_v254.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "clip_v255",
    "start": 1618.64,
    "kind": "full",
    "src": "broll/vbs_v255.mp4",
    "video": true,
    "ken": "left",
    "dur": 1.84
  },
  {
    "id": "checklist_63",
    "start": 1620.48,
    "kind": "checklist",
    "kicker": "Esta misma noche",
    "title": "El ritual, en siete gestos",
    "hot": [
      "siete"
    ],
    "items": [
      "Sorbos repartidos durante el día",
      "Enjuague de bicarbonato con una pizca de sal",
      "Nada de alcohol ni colutorios que piquen",
      "Chicle sin azúcar y masaje de glándulas",
      "Infusión de malva templada",
      "Humedad en el cuarto y respirar por la nariz",
      "Bálsamo en los labios antes de dormir"
    ],
    "mood": "gold",
    "dur": 8.5
  },
  {
    "id": "fill_checklist_63",
    "start": 1628.98,
    "dur": 16.46,
    "kind": "talk"
  },
  {
    "id": "seam_1639",
    "start": 1637.43,
    "dur": 3,
    "kind": "full",
    "src": "img/vbs_v256.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "cta_64",
    "start": 1645.44,
    "kind": "cta",
    "kicker": "Si le ha servido",
    "title": "Guarde el vídeo y suscríbase",
    "hot": [
      "suscríbase"
    ],
    "sub": "Las medidas exactas del enjuague y de la infusión están apuntadas en la descripción, con las siete señales por escrito.",
    "buttonLabel": "Medidas en la descripción",
    "image": "img/vbs_h_cierre.jpg",
    "mood": "gold",
    "dur": 8
  },
  {
    "id": "fill_cta_64",
    "start": 1653.44,
    "dur": 23.82,
    "kind": "talk"
  },
  {
    "id": "clip_v258",
    "start": 1677.26,
    "kind": "full",
    "src": "broll/vbs_v258.mp4",
    "video": true,
    "ken": "right",
    "dur": 4
  },
  {
    "id": "clip_v259",
    "start": 1681.5,
    "kind": "full",
    "src": "broll/vbs_v259.mp4",
    "video": true,
    "ken": "in",
    "dur": 4
  },
  {
    "id": "ph_clip_v259",
    "start": 1685.5,
    "dur": 1.91,
    "kind": "full",
    "src": "img/vbs_v259.jpg",
    "video": false,
    "ken": "out"
  }
];
