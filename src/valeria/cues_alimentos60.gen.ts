// cues_alimentos60.gen.ts — GENERADO por build_alimentos60.mjs. NO editar a mano.
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
export const TOTAL_FRAMES_AL60 = 39850;
export const BEATS: Cue[] = [
  {
    "id": "talk_1",
    "start": 0,
    "kind": "talk",
    "title": "Tres alimentos. Tu piel más joven desde el plato.",
    "hot": [
      "Tres"
    ],
    "kicker": "Dr. Bastida · Belleza natural +60",
    "dur": 2.8
  },
  {
    "id": "full_2",
    "start": 2.8,
    "kind": "full",
    "caption": "No en un frasco caro.",
    "ken": "in",
    "src": "broll/al_full_2.mp4",
    "video": true,
    "dur": 3.68
  },
  {
    "id": "full_3",
    "start": 6.48,
    "kind": "full",
    "caption": "La piel más envidiada del mundo.",
    "ken": "out",
    "src": "broll/al_full_3.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_3",
    "start": 11.48,
    "dur": 9.14,
    "kind": "talk"
  },
  {
    "id": "cut_amb1_15",
    "start": 15.48,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb1.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_4",
    "start": 20.62,
    "kind": "full",
    "caption": "Cremas que prometen y no cumplen.",
    "ken": "left",
    "src": "broll/al_full_4.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_4",
    "start": 25.62,
    "dur": 3.6,
    "kind": "talk"
  },
  {
    "id": "full_5",
    "start": 29.22,
    "kind": "full",
    "caption": "Esta mañana, frente al espejo.",
    "ken": "in",
    "src": "broll/al_full_5.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_5",
    "start": 34.22,
    "dur": 5.6,
    "kind": "talk"
  },
  {
    "id": "full_6",
    "start": 39.82,
    "kind": "full",
    "caption": "Líneas nuevas. Un tono apagado.",
    "ken": "in",
    "src": "broll/al_full_6.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_6",
    "start": 44.82,
    "dur": 13.6,
    "kind": "talk"
  },
  {
    "id": "cut_amb2_49",
    "start": 48.82,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb2.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb3_55",
    "start": 55.42,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb3.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "talk_7",
    "start": 58.42,
    "kind": "talk",
    "title": "Tu piel es tu boletín de calificaciones.",
    "hot": [
      "boletín"
    ],
    "accent": "#B08D3C",
    "dur": 15.54
  },
  {
    "id": "cut_amb4_62",
    "start": 62.02,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb4.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb5_69",
    "start": 68.62,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb5.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "talk_8",
    "start": 73.96,
    "kind": "talk",
    "title": "Va en contra de todo lo que te vendieron.",
    "hot": [
      "todo"
    ],
    "accent": "#B5643C",
    "dur": 15
  },
  {
    "id": "cut_amb6_75",
    "start": 75.22,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb6.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb7_82",
    "start": 81.82,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb7.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb8_88",
    "start": 88.42,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb8.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "talk_9",
    "start": 88.96,
    "kind": "talk",
    "title": "La piel firme se construye por dentro.",
    "hot": [
      "dentro"
    ],
    "dur": 20.58
  },
  {
    "id": "cut_amb9_95",
    "start": 95.02,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb9.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb10_102",
    "start": 101.62,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb10.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb11_108",
    "start": 108.22,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb11.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "talk_10",
    "start": 109.54,
    "kind": "talk",
    "title": "Tu piel se renueva a cualquier edad.",
    "hot": [
      "cualquier"
    ],
    "dur": 15.1
  },
  {
    "id": "cut_amb12_115",
    "start": 114.82,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb12.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "hero_11",
    "start": 124.64,
    "kind": "hero",
    "kicker": "Los 3 alimentos",
    "title": "Huevo, sardina y vitamina C",
    "hot": [
      "Huevo"
    ],
    "sub": "Baratos, de toda la vida, y con respaldo de la ciencia.",
    "image": "img/al_huevo.jpg",
    "side": "right",
    "mood": "gold",
    "dur": 4.46
  },
  {
    "id": "full_12",
    "start": 129.1,
    "kind": "full",
    "caption": "La piel que tenían nuestras abuelas.",
    "ken": "out",
    "src": "broll/al_full_12.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_12",
    "start": 134.1,
    "dur": 13.88,
    "kind": "talk"
  },
  {
    "id": "cut_amb13_138",
    "start": 138.1,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb13.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "lowerthird_13",
    "start": 147.98,
    "kind": "lowerthird",
    "name": "Dr. Bastida",
    "role": "Salud y belleza natural",
    "topic": "3 alimentos para la piel +60",
    "dur": 6.5
  },
  {
    "id": "fill_lowerthird_13",
    "start": 154.48,
    "dur": 25.22,
    "kind": "talk"
  },
  {
    "id": "cut_amb14_158",
    "start": 158.48,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb14.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb15_165",
    "start": 165.08,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb15.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb16_172",
    "start": 171.68,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb16.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb17_178",
    "start": 178.28,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb17.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "talk_14",
    "start": 179.7,
    "kind": "talk",
    "title": "No una crema. Tres alimentos.",
    "hot": [
      "Tres"
    ],
    "dur": 10.9
  },
  {
    "id": "cut_amb18_185",
    "start": 184.88,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb18.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "talk_15",
    "start": 190.6,
    "kind": "talk",
    "title": "El tercero hace que los otros dos funcionen.",
    "hot": [
      "tercero"
    ],
    "kicker": "Quédese hasta el final",
    "dur": 19.5
  },
  {
    "id": "cut_amb19_191",
    "start": 191.48,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb19.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb20_198",
    "start": 198.08,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb20.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb21_205",
    "start": 204.68,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb21.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_16",
    "start": 210.1,
    "kind": "full",
    "caption": "Bajo tu piel: una malla que la sostiene.",
    "ken": "in",
    "src": "broll/al_full_16.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_16",
    "start": 215.1,
    "dur": 2.3,
    "kind": "talk"
  },
  {
    "id": "molecule_17",
    "start": 217.4,
    "kind": "molecule",
    "kicker": "La malla de la piel",
    "title": "Colágeno",
    "hot": [
      "Colágeno"
    ],
    "centerLabel": "Colágeno",
    "sub": "La proteína que mantiene tu piel firme, tensa y rellena.",
    "nodes": [
      {
        "label": "Firmeza"
      },
      {
        "label": "Elasticidad"
      },
      {
        "label": "Relleno"
      }
    ],
    "image": "med/colageno.png",
    "mood": "science",
    "dur": 6.5
  },
  {
    "id": "fill_molecule_17",
    "start": 223.9,
    "dur": 0.44,
    "kind": "talk"
  },
  {
    "id": "full_18",
    "start": 224.34,
    "kind": "full",
    "caption": "Piel joven: la malla rebota.",
    "ken": "out",
    "src": "broll/al_full_18.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_18",
    "start": 229.34,
    "dur": 14.64,
    "kind": "talk"
  },
  {
    "id": "cut_amb22_233",
    "start": 233.34,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb22.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb23_240",
    "start": 239.94,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb23.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "stat_19",
    "start": 243.98,
    "kind": "stat",
    "kicker": "Tras la menopausia · 5 años",
    "value": 30,
    "suffix": "%",
    "label": "del colágeno de la piel se pierde",
    "sub": "Por eso la piel se afloja casi de un año a otro.",
    "image": "img/al_ph_menopause.jpg",
    "mood": "cool",
    "dur": 6.5
  },
  {
    "id": "fill_stat_19",
    "start": 250.48,
    "dur": 2.4,
    "kind": "talk"
  },
  {
    "id": "full_20",
    "start": 252.88,
    "kind": "full",
    "caption": "Se afloja la malla: arrugas y flacidez.",
    "ken": "in",
    "src": "broll/al_full_20.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_20",
    "start": 257.88,
    "dur": 12.98,
    "kind": "talk"
  },
  {
    "id": "cut_amb24_262",
    "start": 261.88,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb24.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb1_268",
    "start": 268.48,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb1.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "talk_21",
    "start": 270.86,
    "kind": "talk",
    "title": "El estrógeno era la capataz de la fábrica.",
    "hot": [
      "capataz"
    ],
    "dur": 31.26
  },
  {
    "id": "cut_amb2_275",
    "start": 275.08,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb2.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb3_282",
    "start": 281.68,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb3.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb4_288",
    "start": 288.28,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb4.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb5_295",
    "start": 294.88,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb5.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb6_301",
    "start": 301.48,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb6.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "talk_22",
    "start": 302.12,
    "kind": "talk",
    "title": "Alerta: algo en tu plato destruye tu colágeno.",
    "hot": [
      "Alerta"
    ],
    "accent": "#B5643C",
    "kicker": "Atención",
    "dur": 6.96
  },
  {
    "id": "full_23",
    "start": 309.08,
    "kind": "full",
    "caption": "El enemigo escondido.",
    "ken": "left",
    "src": "broll/al_full_23.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_23",
    "start": 314.08,
    "dur": 1.6,
    "kind": "talk"
  },
  {
    "id": "hero_24",
    "start": 315.68,
    "kind": "hero",
    "kicker": "El enemigo #1 del colágeno",
    "title": "El azúcar",
    "hot": [
      "azúcar"
    ],
    "sub": "Se pega a tus fibras y las endurece como caramelo.",
    "image": "med/cubito.png",
    "side": "right",
    "mood": "warmdark",
    "dur": 6.5
  },
  {
    "id": "fill_hero_24",
    "start": 322.18,
    "dur": 5.32,
    "kind": "talk"
  },
  {
    "id": "molecule_25",
    "start": 327.5,
    "kind": "molecule",
    "kicker": "El nombre técnico",
    "title": "Glicación",
    "hot": [
      "Glicación"
    ],
    "centerLabel": "Azúcar",
    "sub": "La reacción que \"caramela\" tu piel por dentro.",
    "nodes": [
      {
        "label": "Fibras rígidas"
      },
      {
        "label": "Se quiebran"
      },
      {
        "label": "Más arrugas"
      }
    ],
    "mood": "warmdark",
    "image": "med/cubito.png",
    "dur": 6.5
  },
  {
    "id": "fill_molecule_25",
    "start": 334,
    "dur": 8.72,
    "kind": "talk"
  },
  {
    "id": "cut_amb7_338",
    "start": 338,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb7.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "talk_26",
    "start": 342.72,
    "kind": "talk",
    "title": "Baja el azúcar. Es la mitad de la batalla.",
    "hot": [
      "mitad"
    ],
    "accent": "#7A8B5A",
    "dur": 10.52
  },
  {
    "id": "cut_amb8_345",
    "start": 344.6,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb8.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb9_351",
    "start": 351.2,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb9.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "talk_27",
    "start": 353.24,
    "kind": "talk",
    "title": "Tu cuerpo sabe fabricar colágeno nuevo.",
    "hot": [
      "nuevo"
    ],
    "kicker": "La buena noticia",
    "dur": 15.12
  },
  {
    "id": "cut_amb10_358",
    "start": 357.8,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb10.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb11_364",
    "start": 364.4,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb11.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "talk_28",
    "start": 368.36,
    "kind": "talk",
    "title": "Solo le faltan los materiales. Vienen del plato.",
    "hot": [
      "materiales"
    ],
    "dur": 3.74
  },
  {
    "id": "cut_amb12_371",
    "start": 371,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb12.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "talk_29",
    "start": 372.1,
    "kind": "talk",
    "title": "El primero: los ladrillos del colágeno.",
    "hot": [
      "ladrillos"
    ],
    "kicker": "Alimento 1 de 3",
    "dur": 9.38
  },
  {
    "id": "cut_amb13_378",
    "start": 377.6,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb13.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "hero_30",
    "start": 381.48,
    "kind": "hero",
    "kicker": "Alimento 1 · Los ladrillos",
    "title": "El huevo",
    "hot": [
      "huevo"
    ],
    "sub": "La proteína completa que reconstruye tu colágeno.",
    "image": "img/al_huevo.jpg",
    "side": "left",
    "mood": "gold",
    "dur": 1.34
  },
  {
    "id": "full_31",
    "start": 382.82,
    "kind": "full",
    "caption": "40 años de miedo… para nada.",
    "ken": "in",
    "src": "broll/al_full_31.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_31",
    "start": 387.82,
    "dur": 10.32,
    "kind": "talk"
  },
  {
    "id": "cut_amb14_392",
    "start": 391.82,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb14.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "stat_32",
    "start": 398.14,
    "kind": "stat",
    "kicker": "Estudio · +250.000 personas",
    "value": 1,
    "suffix": "/día",
    "label": "un huevo al día no daña el corazón",
    "sub": "Cuarenta años de miedo desmentidos.",
    "image": "img/al_ph_egg.jpg",
    "mood": "science",
    "dur": 6.5
  },
  {
    "id": "fill_stat_32",
    "start": 404.64,
    "dur": 9.5,
    "kind": "talk"
  },
  {
    "id": "cut_amb15_409",
    "start": 408.64,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb15.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "molecule_33",
    "start": 414.14,
    "kind": "molecule",
    "kicker": "De qué está hecho",
    "title": "Aminoácidos = ladrillos",
    "hot": [
      "ladrillos"
    ],
    "centerLabel": "Colágeno",
    "sub": "Tres ladrillos que tu piel necesita para armar colágeno.",
    "nodes": [
      {
        "label": "Glicina"
      },
      {
        "label": "Prolina"
      },
      {
        "label": "Del huevo"
      }
    ],
    "mood": "science",
    "image": "img/al_ph_egg.jpg",
    "dur": 6.5
  },
  {
    "id": "fill_molecule_33",
    "start": 420.64,
    "dur": 10.42,
    "kind": "talk"
  },
  {
    "id": "cut_amb16_425",
    "start": 424.64,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb16.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "hero_34",
    "start": 431.06,
    "kind": "hero",
    "kicker": "Proteína patrón oro",
    "title": "La mejor proteína, la más barata",
    "hot": [
      "mejor"
    ],
    "sub": "Los científicos miden todas las demás contra el huevo.",
    "image": "img/al_ph_eggyolk.jpg",
    "side": "left",
    "mood": "gold",
    "dur": 6.5
  },
  {
    "id": "fill_hero_34",
    "start": 437.56,
    "dur": 5.76,
    "kind": "talk"
  },
  {
    "id": "cut_amb17_442",
    "start": 441.56,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb17.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "talk_35",
    "start": 443.32,
    "kind": "talk",
    "title": "Sin ladrillos no hay obra. Sin proteína, no hay colágeno.",
    "hot": [
      "obra"
    ],
    "dur": 12.72
  },
  {
    "id": "cut_amb18_448",
    "start": 448.16,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb18.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "molecule_36",
    "start": 456.04,
    "kind": "molecule",
    "kicker": "La vitamina de la belleza",
    "title": "Biotina",
    "hot": [
      "Biotina"
    ],
    "centerLabel": "Yema",
    "sub": "En la yema que te dijeron que tiraras.",
    "nodes": [
      {
        "label": "Cabello"
      },
      {
        "label": "Uñas"
      },
      {
        "label": "Piel"
      }
    ],
    "mood": "gold",
    "image": "img/al_ph_eggyolk.jpg",
    "dur": 3.38
  },
  {
    "id": "full_37",
    "start": 459.42,
    "kind": "full",
    "caption": "Cabello con cuerpo, uñas fuertes.",
    "ken": "out",
    "src": "broll/al_full_37.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_37",
    "start": 464.42,
    "dur": 0.44,
    "kind": "talk"
  },
  {
    "id": "full_38",
    "start": 464.86,
    "kind": "full",
    "caption": "Uñas que dejan de quebrarse.",
    "ken": "in",
    "src": "broll/al_full_38.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_38",
    "start": 469.86,
    "dur": 8.24,
    "kind": "talk"
  },
  {
    "id": "cut_amb19_474",
    "start": 473.86,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb19.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "molecule_39",
    "start": 478.1,
    "kind": "molecule",
    "kicker": "Escudo contra el sol",
    "title": "Luteína y zeaxantina",
    "hot": [
      "sol"
    ],
    "centerLabel": "Piel",
    "sub": "Un escudo natural contra el enemigo #1: el sol.",
    "nodes": [
      {
        "label": "Anti-manchas"
      },
      {
        "label": "Anti-arrugas"
      },
      {
        "label": "Protege"
      }
    ],
    "mood": "science",
    "image": "img/al_ph_sun.jpg",
    "dur": 6.5
  },
  {
    "id": "fill_molecule_39",
    "start": 484.6,
    "dur": 17.56,
    "kind": "talk"
  },
  {
    "id": "cut_amb20_489",
    "start": 488.6,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb20.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb21_495",
    "start": 495.2,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb21.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb22_502",
    "start": 501.8,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb22.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "talk_40",
    "start": 502.16,
    "kind": "talk",
    "title": "Déjame contarte de una paciente.",
    "hot": [
      "paciente"
    ],
    "kicker": "Caso real",
    "dur": 4.84
  },
  {
    "id": "full_41",
    "start": 507,
    "kind": "full",
    "caption": "Doña Elvira, 72 · cabello y uñas frágiles.",
    "ken": "in",
    "src": "img/al_full_41.jpg",
    "video": false,
    "dur": 5
  },
  {
    "id": "fill_full_41",
    "start": 512,
    "dur": 12.1,
    "kind": "talk"
  },
  {
    "id": "cut_amb23_516",
    "start": 516,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb23.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "full_42",
    "start": 524.1,
    "kind": "full",
    "caption": "Tres meses después: uñas firmes, cabello con cuerpo.",
    "ken": "out",
    "src": "img/al_full_42.jpg",
    "video": false,
    "dur": 5
  },
  {
    "id": "fill_full_42",
    "start": 529.1,
    "dur": 17.36,
    "kind": "talk"
  },
  {
    "id": "cut_amb24_533",
    "start": 533.1,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb24.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb1_540",
    "start": 539.7,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb1.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "molecule_43",
    "start": 546.46,
    "kind": "molecule",
    "kicker": "Dos minerales más",
    "title": "Zinc y selenio",
    "hot": [
      "Zinc"
    ],
    "centerLabel": "Huevo",
    "sub": "Reparan y protegen la piel del desgaste.",
    "nodes": [
      {
        "label": "Cicatriza"
      },
      {
        "label": "Antioxidante"
      },
      {
        "label": "Repara"
      }
    ],
    "mood": "science",
    "image": "img/al_ph_egg.jpg",
    "dur": 6.5
  },
  {
    "id": "fill_molecule_43",
    "start": 552.96,
    "dur": 16.28,
    "kind": "talk"
  },
  {
    "id": "cut_amb2_557",
    "start": 556.96,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb2.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb3_564",
    "start": 563.56,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb3.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "hero_44",
    "start": 569.24,
    "kind": "hero",
    "kicker": "Todo en uno",
    "title": "Una farmacia de belleza por centavos",
    "hot": [
      "centavos"
    ],
    "sub": "Más barato que un solo día de crema.",
    "image": "img/al_ph_eggs2.jpg",
    "side": "right",
    "mood": "gold",
    "dur": 6.5
  },
  {
    "id": "fill_hero_44",
    "start": 575.74,
    "dur": 1.22,
    "kind": "talk"
  },
  {
    "id": "step_45",
    "start": 576.96,
    "kind": "step",
    "step": 1,
    "total": 2,
    "title": "Cómo comerlo",
    "hot": [
      "comerlo"
    ],
    "sub": "Hervido, tibio o revuelto suave. Nunca frito en aceite requemado.",
    "image": "img/al_ph_boiledegg.jpg",
    "mood": "warmdark",
    "dur": 6.5
  },
  {
    "id": "step_46",
    "start": 583.54,
    "kind": "step",
    "step": 2,
    "total": 2,
    "title": "Dos huevos al desayuno",
    "hot": [
      "Dos"
    ],
    "sub": "La mayoría de los días de la semana.",
    "image": "img/al_ph_breakfast.jpg",
    "mood": "gold",
    "dur": 6.5
  },
  {
    "id": "fill_step_46",
    "start": 590.04,
    "dur": 26.94,
    "kind": "talk"
  },
  {
    "id": "cut_amb4_594",
    "start": 594.04,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb4.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb5_601",
    "start": 600.64,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb5.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb6_607",
    "start": 607.24,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb6.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb7_614",
    "start": 613.84,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb7.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "talk_47",
    "start": 616.98,
    "kind": "talk",
    "title": "Las cantidades exactas, ordenadas para ti.",
    "hot": [
      "exactas"
    ],
    "dur": 8.68
  },
  {
    "id": "cut_amb8_620",
    "start": 620.44,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb8.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "qr_48",
    "start": 625.66,
    "kind": "qr",
    "kicker": "Su guía, gratis",
    "title": "Apunte su cámara al código",
    "hot": [
      "código"
    ],
    "sub": "Abra la cámara del teléfono y apúntela al recuadro. Es gratis.",
    "dur": 6.5
  },
  {
    "id": "fill_qr_48",
    "start": 632.16,
    "dur": 15.3,
    "kind": "talk"
  },
  {
    "id": "cut_amb9_636",
    "start": 636.16,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb9.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb10_643",
    "start": 642.76,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb10.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_49",
    "start": 647.46,
    "kind": "full",
    "caption": "Rosa · Guadalajara · ya va por su 3.er día",
    "kicker": "Historias reales",
    "ken": "in",
    "src": "img/al_full_49.jpg",
    "video": false,
    "dur": 5
  },
  {
    "id": "fill_full_49",
    "start": 652.46,
    "dur": 13.72,
    "kind": "talk"
  },
  {
    "id": "cut_amb11_656",
    "start": 656.46,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb11.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "hero_50",
    "start": 666.18,
    "kind": "hero",
    "kicker": "Alimento 2 · La humedad",
    "title": "La sardina",
    "hot": [
      "sardina"
    ],
    "sub": "Omega-3 que rellena e hidrata la piel desde adentro.",
    "image": "img/al_sardina.jpg",
    "side": "right",
    "mood": "cool",
    "dur": 6.5
  },
  {
    "id": "fill_hero_50",
    "start": 672.68,
    "dur": 6.32,
    "kind": "talk"
  },
  {
    "id": "full_51",
    "start": 679,
    "kind": "full",
    "caption": "La sardina. Humilde y poderosa.",
    "ken": "out",
    "src": "broll/al_full_51.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_51",
    "start": 684,
    "dur": 10.16,
    "kind": "talk"
  },
  {
    "id": "cut_amb12_688",
    "start": 688,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb12.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "full_52",
    "start": 694.16,
    "kind": "full",
    "caption": "Piel joven = humedad retenida por dentro.",
    "ken": "in",
    "src": "broll/al_full_52.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_52",
    "start": 699.16,
    "dur": 2.18,
    "kind": "talk"
  },
  {
    "id": "full_53",
    "start": 701.34,
    "kind": "full",
    "caption": "Piel seca: las líneas se marcan más.",
    "ken": "in",
    "src": "broll/al_full_53.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_53",
    "start": 706.34,
    "dur": 5.2,
    "kind": "talk"
  },
  {
    "id": "molecule_54",
    "start": 711.54,
    "kind": "molecule",
    "kicker": "La grasa buena",
    "title": "Omega-3",
    "hot": [
      "Omega-3"
    ],
    "centerLabel": "Sardina",
    "sub": "El material con el que tu piel retiene el agua por dentro.",
    "nodes": [
      {
        "label": "Hidrata"
      },
      {
        "label": "Rellena"
      },
      {
        "label": "Calma"
      }
    ],
    "mood": "cool",
    "image": "img/al_ph_sardines2.jpg",
    "dur": 6.5
  },
  {
    "id": "fill_molecule_54",
    "start": 718.04,
    "dur": 8.6,
    "kind": "talk"
  },
  {
    "id": "cut_amb13_722",
    "start": 722.04,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb13.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_55",
    "start": 726.64,
    "kind": "full",
    "caption": "Piel jugosa, rellena, desde adentro.",
    "ken": "out",
    "src": "broll/al_full_55.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_55",
    "start": 731.64,
    "dur": 25.22,
    "kind": "talk"
  },
  {
    "id": "cut_amb14_736",
    "start": 735.64,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb14.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb15_742",
    "start": 742.24,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb15.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb16_749",
    "start": 748.84,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb16.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "hero_56",
    "start": 756.86,
    "kind": "hero",
    "kicker": "El fuego escondido",
    "title": "Envejecimiento por inflamación",
    "hot": [
      "inflamación"
    ],
    "sub": "Un fueguito que quema tu colágeno. El omega-3 lo apaga.",
    "image": "img/al_ph_calmskin.jpg",
    "side": "left",
    "mood": "warmdark",
    "dur": 6.5
  },
  {
    "id": "fill_hero_56",
    "start": 763.36,
    "dur": 5.74,
    "kind": "talk"
  },
  {
    "id": "molecule_57",
    "start": 769.1,
    "kind": "molecule",
    "kicker": "Y hay más adentro",
    "title": "Calcio, vitamina D y B12",
    "hot": [
      "Calcio"
    ],
    "centerLabel": "Sardina",
    "sub": "Huesos, renovación de la piel y color vivo.",
    "nodes": [
      {
        "label": "Calcio"
      },
      {
        "label": "Vitamina D"
      },
      {
        "label": "B12"
      }
    ],
    "mood": "science",
    "image": "img/al_ph_sardines2.jpg",
    "dur": 6.5
  },
  {
    "id": "fill_molecule_57",
    "start": 775.6,
    "dur": 18.28,
    "kind": "talk"
  },
  {
    "id": "cut_amb17_780",
    "start": 779.6,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb17.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb18_786",
    "start": 786.2,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb18.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "beforeafter_58",
    "start": 793.88,
    "kind": "beforeafter",
    "kicker": "La prueba del espejo",
    "title": "Uva o pasa: es el agua",
    "hot": [
      "agua"
    ],
    "imageA": "img/al_ph_grape.jpg",
    "imageB": "img/al_ph_raisin.jpg",
    "labelA": "Hidratada",
    "labelB": "Seca",
    "mood": "cool",
    "dur": 6.5
  },
  {
    "id": "fill_beforeafter_58",
    "start": 800.38,
    "dur": 40.68,
    "kind": "talk"
  },
  {
    "id": "cut_amb19_804",
    "start": 804.38,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb19.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb20_811",
    "start": 810.98,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb20.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb21_818",
    "start": 817.58,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb21.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb22_824",
    "start": 824.18,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb22.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb23_831",
    "start": 830.78,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb23.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "full_59",
    "start": 841.06,
    "kind": "full",
    "caption": "El contorno de ojos delata la edad.",
    "ken": "in",
    "src": "broll/al_full_59.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_59",
    "start": 846.06,
    "dur": 25.22,
    "kind": "talk"
  },
  {
    "id": "cut_amb24_850",
    "start": 850.06,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb24.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb1_857",
    "start": 856.66,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb1.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb2_863",
    "start": 863.26,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb2.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "step_60",
    "start": 871.28,
    "kind": "step",
    "step": 1,
    "total": 1,
    "title": "Cómo comerla",
    "hot": [
      "comerla"
    ],
    "sub": "Sobre tostada integral, con limón y aceite de oliva. 2-3 veces por semana, con sus huesitos.",
    "image": "img/al_ph_sardinetoast.jpg",
    "mood": "gold",
    "dur": 6.5
  },
  {
    "id": "fill_step_60",
    "start": 877.78,
    "dur": 38.64,
    "kind": "talk"
  },
  {
    "id": "cut_amb3_882",
    "start": 881.78,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb3.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb4_888",
    "start": 888.38,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb4.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb5_895",
    "start": 894.98,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb5.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb6_902",
    "start": 901.58,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb6.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb7_908",
    "start": 908.18,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb7.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb8_915",
    "start": 914.78,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb8.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "talk_61",
    "start": 916.42,
    "kind": "talk",
    "title": "No lo dejes solo en la cabeza. Guárdalo.",
    "hot": [
      "Guárdalo"
    ],
    "dur": 3.18
  },
  {
    "id": "qr_62",
    "start": 919.6,
    "kind": "qr",
    "kicker": "Su guía, gratis",
    "title": "Escanee ahora, toma 10 segundos",
    "hot": [
      "ahora"
    ],
    "sub": "Abra la cámara, apunte al recuadro, y listo.",
    "dur": 6.5
  },
  {
    "id": "fill_qr_62",
    "start": 926.1,
    "dur": 8.04,
    "kind": "talk"
  },
  {
    "id": "cut_amb9_930",
    "start": 930.1,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb9.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_63",
    "start": 934.14,
    "kind": "full",
    "caption": "Alfonsina · Monterrey · 79 años",
    "kicker": "Historias reales",
    "ken": "out",
    "src": "img/al_full_63.jpg",
    "video": false,
    "dur": 5
  },
  {
    "id": "fill_full_63",
    "start": 939.14,
    "dur": 27.98,
    "kind": "talk"
  },
  {
    "id": "cut_amb10_943",
    "start": 943.14,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb10.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb11_950",
    "start": 949.74,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb11.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb12_956",
    "start": 956.34,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb12.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb13_963",
    "start": 962.94,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb13.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "talk_64",
    "start": 967.12,
    "kind": "talk",
    "title": "Sin este ingrediente, nada se arma.",
    "hot": [
      "nada"
    ],
    "kicker": "El secreto que lo une todo",
    "dur": 19.44
  },
  {
    "id": "cut_amb14_970",
    "start": 969.54,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb14.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb15_976",
    "start": 976.14,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb15.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb16_983",
    "start": 982.74,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb16.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "hero_65",
    "start": 986.56,
    "kind": "hero",
    "kicker": "Alimento 3 · El cemento",
    "title": "La vitamina C",
    "hot": [
      "vitamina"
    ],
    "sub": "Sin ella, los ladrillos nunca se vuelven piel firme.",
    "image": "img/al_vitc.jpg",
    "side": "left",
    "mood": "science",
    "dur": 6.5
  },
  {
    "id": "full_66",
    "start": 993.22,
    "kind": "full",
    "caption": "Pimiento rojo: más vitamina C que una naranja.",
    "ken": "in",
    "src": "broll/al_full_66.mp4",
    "video": true,
    "dur": 4.04
  },
  {
    "id": "full_67",
    "start": 997.26,
    "kind": "full",
    "caption": "Guayaba: revienta de vitamina C.",
    "ken": "out",
    "src": "broll/al_full_67.mp4",
    "video": true,
    "dur": 2.94
  },
  {
    "id": "full_68",
    "start": 1000.2,
    "kind": "full",
    "caption": "Naranja, mandarina, limón, kiwi, fresa.",
    "ken": "left",
    "src": "broll/al_full_68.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_68",
    "start": 1005.2,
    "dur": 6.66,
    "kind": "talk"
  },
  {
    "id": "molecule_69",
    "start": 1011.86,
    "kind": "molecule",
    "kicker": "El cemento del colágeno",
    "title": "Vitamina C = cofactor",
    "hot": [
      "cofactor"
    ],
    "centerLabel": "Vitamina C",
    "sub": "Pega los ladrillos y los convierte en colágeno firme.",
    "nodes": [
      {
        "label": "Une aminoácidos"
      },
      {
        "label": "Forma fibras"
      },
      {
        "label": "Piel firme"
      }
    ],
    "mood": "science",
    "image": "img/al_ph_pepper2.jpg",
    "dur": 6.5
  },
  {
    "id": "fill_molecule_69",
    "start": 1018.36,
    "dur": 10.18,
    "kind": "talk"
  },
  {
    "id": "cut_amb17_1022",
    "start": 1022.36,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb17.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "talk_70",
    "start": 1028.54,
    "kind": "talk",
    "title": "Sin vitamina C, los ladrillos nunca son piel firme.",
    "hot": [
      "nunca"
    ],
    "dur": 17.82
  },
  {
    "id": "cut_amb18_1029",
    "start": 1028.96,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb18.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb19_1036",
    "start": 1035.56,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb19.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb20_1042",
    "start": 1042.16,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb20.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "full_71",
    "start": 1046.36,
    "kind": "full",
    "caption": "El sol te llena de manchas y arrugas finas.",
    "ken": "in",
    "src": "broll/al_full_71.mp4",
    "video": true,
    "dur": 3.3
  },
  {
    "id": "beforeafter_72",
    "start": 1049.66,
    "kind": "beforeafter",
    "kicker": "Con constancia",
    "title": "Empareja el tono, aclara manchas",
    "hot": [
      "manchas"
    ],
    "imageA": "img/al_ph_spots.jpg",
    "imageB": "img/al_ph_clearskin.jpg",
    "labelA": "Con manchas",
    "labelB": "Más parejo",
    "mood": "science",
    "dur": 6.5
  },
  {
    "id": "fill_beforeafter_72",
    "start": 1056.16,
    "dur": 60.9,
    "kind": "talk"
  },
  {
    "id": "cut_amb21_1060",
    "start": 1060.16,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb21.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb22_1067",
    "start": 1066.76,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb22.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb23_1073",
    "start": 1073.36,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb23.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb24_1080",
    "start": 1079.96,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb24.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb1_1087",
    "start": 1086.56,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb1.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb2_1093",
    "start": 1093.16,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb2.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb3_1100",
    "start": 1099.76,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb3.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb4_1106",
    "start": 1106.36,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb4.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb5_1113",
    "start": 1112.96,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb5.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "talk_73",
    "start": 1117.06,
    "kind": "talk",
    "title": "Vitamina C + huevo: se potencian entre sí.",
    "hot": [
      "potencian"
    ],
    "dur": 24.94
  },
  {
    "id": "cut_amb6_1120",
    "start": 1119.56,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb6.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb7_1126",
    "start": 1126.16,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb7.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb8_1133",
    "start": 1132.76,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb8.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "step_74",
    "start": 1142,
    "kind": "step",
    "step": 1,
    "total": 1,
    "title": "Cómo comerla",
    "hot": [
      "comerla"
    ],
    "sub": "Fresca y cruda: el calor la destruye. Media naranja junto a tus huevos.",
    "image": "img/al_ph_salad.jpg",
    "mood": "gold",
    "dur": 6.5
  },
  {
    "id": "fill_step_74",
    "start": 1148.5,
    "dur": 22.28,
    "kind": "talk"
  },
  {
    "id": "cut_amb9_1153",
    "start": 1152.5,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb9.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb10_1159",
    "start": 1159.1,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb10.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb11_1166",
    "start": 1165.7,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb11.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "talk_75",
    "start": 1170.78,
    "kind": "talk",
    "title": "Juntémoslo todo.",
    "hot": [
      "todo"
    ],
    "kicker": "El resumen",
    "dur": 10.88
  },
  {
    "id": "cut_amb12_1172",
    "start": 1172.3,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb12.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "checklist_76",
    "start": 1181.66,
    "kind": "checklist",
    "kicker": "Tu piel joven, en 3",
    "title": "Ladrillos, humedad y cemento",
    "hot": [
      "tres"
    ],
    "items": [
      "Huevo → los ladrillos (proteína + biotina)",
      "Sardina → la humedad (omega-3, calcio, B12)",
      "Vitamina C → el cemento (pega el colágeno)"
    ],
    "mood": "gold",
    "dur": 6.5
  },
  {
    "id": "fill_checklist_76",
    "start": 1188.16,
    "dur": 37.1,
    "kind": "talk"
  },
  {
    "id": "cut_amb13_1192",
    "start": 1192.16,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb13.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb14_1199",
    "start": 1198.76,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb14.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb15_1205",
    "start": 1205.36,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb15.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb16_1212",
    "start": 1211.96,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb16.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb17_1219",
    "start": 1218.56,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb17.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb18_1225",
    "start": 1225.16,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb18.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "talk_77",
    "start": 1225.26,
    "kind": "talk",
    "title": "No los tres perfectos. Empieza con uno.",
    "hot": [
      "uno"
    ],
    "dur": 21.54
  },
  {
    "id": "cut_amb19_1232",
    "start": 1231.76,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb19.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb20_1238",
    "start": 1238.36,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb20.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "quote_78",
    "start": 1246.8,
    "kind": "quote",
    "kicker": "Recuérdalo",
    "quote": "La belleza no estaba en el pomo caro. Estaba en tu cocina.",
    "author": "Dr. Bastida",
    "role": "Belleza natural +60",
    "image": "img/al_ph_kitchen.jpg",
    "mood": "warmdark",
    "dur": 6.5
  },
  {
    "id": "fill_quote_78",
    "start": 1253.3,
    "dur": 22.08,
    "kind": "talk"
  },
  {
    "id": "cut_amb21_1257",
    "start": 1257.3,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb21.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb22_1264",
    "start": 1263.9,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb22.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb23_1271",
    "start": 1270.5,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb23.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cta_79",
    "start": 1275.38,
    "kind": "cta",
    "kicker": "Antes de irte",
    "title": "Suscríbete y guarda el video",
    "hot": [
      "Suscríbete"
    ],
    "sub": "Cada semana, otro secreto de belleza barato que sí funciona.",
    "buttonLabel": "Suscríbete al canal",
    "image": "img/al_ph_kitchen.jpg",
    "mood": "gold",
    "dur": 6.5
  },
  {
    "id": "fill_cta_79",
    "start": 1281.88,
    "dur": 6.88,
    "kind": "talk"
  },
  {
    "id": "qr_80",
    "start": 1288.76,
    "kind": "qr",
    "kicker": "Su guía, gratis",
    "title": "Una última vez: escanee el código",
    "hot": [
      "código"
    ],
    "sub": "Abra la cámara, apunte al recuadro, y guárdelo. Toma 10 segundos.",
    "dur": 6.5
  },
  {
    "id": "fill_qr_80",
    "start": 1295.26,
    "dur": 7.72,
    "kind": "talk"
  },
  {
    "id": "cut_amb24_1299",
    "start": 1299.26,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb24.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "full_81",
    "start": 1302.98,
    "kind": "full",
    "caption": "Carmen · Puebla · 68 · \"Gracias\"",
    "kicker": "Historias reales",
    "ken": "in",
    "src": "img/al_full_81.jpg",
    "video": false,
    "dur": 5
  },
  {
    "id": "fill_full_81",
    "start": 1307.98,
    "dur": 5.02,
    "kind": "talk"
  },
  {
    "id": "cut_amb1_1312",
    "start": 1311.98,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb1.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "talk_82",
    "start": 1313,
    "kind": "talk",
    "title": "Cuídate. Te quiero bella, sana y radiante.",
    "hot": [
      "radiante"
    ],
    "kicker": "Nos vemos pronto",
    "dur": 15.34
  }
];
