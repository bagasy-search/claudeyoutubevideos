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
export const TOTAL_FRAMES_AL60 = 39789;
export const BEATS: Cue[] = [
  {
    "id": "talk_1",
    "start": 0,
    "kind": "talk",
    "title": "Tres alimentos. Tu piel más joven desde el plato.",
    "hot": [
      "Tres"
    ],
    "kicker": "Dra. Valeria Alcázar · Belleza natural",
    "dur": 2.8
  },
  {
    "id": "full_2",
    "start": 2.8,
    "kind": "full",
    "ken": "in",
    "src": "broll/al_full_2.mp4",
    "video": true,
    "dur": 3.68
  },
  {
    "id": "full_3",
    "start": 6.48,
    "kind": "full",
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
    "ken": "in",
    "src": "broll/al_full_6.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_6",
    "start": 44.82,
    "dur": 13.62,
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
    "start": 58.44,
    "kind": "talk",
    "title": "Tu piel es tu boletín de calificaciones.",
    "hot": [
      "boletín"
    ],
    "accent": "#B08D3C",
    "dur": 15.52
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
    "dur": 20.76
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
    "start": 109.72,
    "kind": "talk",
    "title": "Tu piel se renueva a cualquier edad.",
    "hot": [
      "cualquier"
    ],
    "dur": 14.9
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
    "start": 124.62,
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
    "dur": 4.5
  },
  {
    "id": "full_12",
    "start": 129.12,
    "kind": "full",
    "ken": "out",
    "src": "broll/al_full_12.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_12",
    "start": 134.12,
    "dur": 13.76,
    "kind": "talk"
  },
  {
    "id": "cut_amb13_138",
    "start": 138.12,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb13.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "lowerthird_13",
    "start": 147.88,
    "kind": "lowerthird",
    "name": "Dra. Valeria Alcázar",
    "role": "Medicina estética · Belleza natural",
    "topic": "3 alimentos para la piel +60",
    "dur": 6.5
  },
  {
    "id": "fill_lowerthird_13",
    "start": 154.38,
    "dur": 23.36,
    "kind": "talk"
  },
  {
    "id": "cut_amb14_158",
    "start": 158.38,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb14.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb15_165",
    "start": 164.98,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb15.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb16_172",
    "start": 171.58,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb16.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "talk_14",
    "start": 177.74,
    "kind": "talk",
    "title": "No una crema. Tres alimentos.",
    "hot": [
      "Tres"
    ],
    "dur": 10.88
  },
  {
    "id": "cut_amb17_178",
    "start": 178.18,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb17.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb18_185",
    "start": 184.78,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb18.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "talk_15",
    "start": 188.62,
    "kind": "talk",
    "title": "El tercero hace que los otros dos funcionen.",
    "hot": [
      "tercero"
    ],
    "kicker": "Quédese hasta el final",
    "dur": 19.46
  },
  {
    "id": "cut_amb19_191",
    "start": 191.38,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb19.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb20_198",
    "start": 197.98,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb20.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "full_16",
    "start": 208.08,
    "kind": "full",
    "ken": "in",
    "src": "broll/al_full_16.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_16",
    "start": 213.08,
    "dur": 2.28,
    "kind": "talk"
  },
  {
    "id": "molecule_17",
    "start": 215.36,
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
    "start": 221.86,
    "dur": 0.44,
    "kind": "talk"
  },
  {
    "id": "full_18",
    "start": 222.3,
    "kind": "full",
    "ken": "out",
    "src": "broll/al_full_18.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_18",
    "start": 227.3,
    "dur": 14.64,
    "kind": "talk"
  },
  {
    "id": "cut_amb21_231",
    "start": 231.3,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb21.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb22_238",
    "start": 237.9,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb22.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "stat_19",
    "start": 241.94,
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
    "start": 248.44,
    "dur": 2.38,
    "kind": "talk"
  },
  {
    "id": "full_20",
    "start": 250.82,
    "kind": "full",
    "ken": "in",
    "src": "broll/al_full_20.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_20",
    "start": 255.82,
    "dur": 13,
    "kind": "talk"
  },
  {
    "id": "cut_amb23_260",
    "start": 259.82,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb23.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb24_266",
    "start": 266.42,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb24.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "talk_21",
    "start": 268.82,
    "kind": "talk",
    "title": "El estrógeno era la capataz de la fábrica.",
    "hot": [
      "capataz"
    ],
    "dur": 31.28
  },
  {
    "id": "cut_amb1_273",
    "start": 273.02,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb1.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb2_280",
    "start": 279.62,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb2.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb3_286",
    "start": 286.22,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb3.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb4_293",
    "start": 292.82,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb4.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb5_299",
    "start": 299.42,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb5.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "talk_22",
    "start": 300.1,
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
    "start": 307.06,
    "kind": "full",
    "ken": "left",
    "src": "broll/al_full_23.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_23",
    "start": 312.06,
    "dur": 1.4,
    "kind": "talk"
  },
  {
    "id": "hero_24",
    "start": 313.46,
    "kind": "hero",
    "kicker": "El enemigo #1 del colágeno",
    "title": "El azúcar",
    "hot": [
      "azúcar"
    ],
    "sub": "Se pega a tus fibras y las endurece como caramelo.",
    "image": "img/al_ph_sugar.jpg",
    "side": "right",
    "mood": "warmdark",
    "dur": 6.5
  },
  {
    "id": "fill_hero_24",
    "start": 319.96,
    "dur": 5.54,
    "kind": "talk"
  },
  {
    "id": "molecule_25",
    "start": 325.5,
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
    "image": "img/al_ph_sugar.jpg",
    "dur": 6.5
  },
  {
    "id": "fill_molecule_25",
    "start": 332,
    "dur": 8.68,
    "kind": "talk"
  },
  {
    "id": "cut_amb6_336",
    "start": 336,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb6.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "talk_26",
    "start": 340.68,
    "kind": "talk",
    "title": "Baja el azúcar. Es la mitad de la batalla.",
    "hot": [
      "mitad"
    ],
    "accent": "#7A8B5A",
    "dur": 10.6
  },
  {
    "id": "cut_amb7_343",
    "start": 342.6,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb7.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb8_349",
    "start": 349.2,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb8.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "talk_27",
    "start": 351.28,
    "kind": "talk",
    "title": "Tu cuerpo sabe fabricar colágeno nuevo.",
    "hot": [
      "nuevo"
    ],
    "kicker": "La buena noticia",
    "dur": 15.04
  },
  {
    "id": "cut_amb9_356",
    "start": 355.8,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb9.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb10_362",
    "start": 362.4,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb10.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "talk_28",
    "start": 366.32,
    "kind": "talk",
    "title": "Solo le faltan los materiales. Vienen del plato.",
    "hot": [
      "materiales"
    ],
    "dur": 3.54
  },
  {
    "id": "chapter_29",
    "start": 369.86,
    "kind": "chapter",
    "index": "01",
    "kicker": "Alimento 1 de 3",
    "title": "El Huevo",
    "sub": "Los ladrillos del colágeno",
    "mood": "gold",
    "dur": 6.5
  },
  {
    "id": "fill_chapter_29",
    "start": 376.36,
    "dur": 3.08,
    "kind": "talk"
  },
  {
    "id": "hero_30",
    "start": 379.44,
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
    "dur": 1.38
  },
  {
    "id": "full_31",
    "start": 380.82,
    "kind": "full",
    "ken": "in",
    "src": "broll/al_full_31.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_31",
    "start": 385.82,
    "dur": 10.26,
    "kind": "talk"
  },
  {
    "id": "cut_amb11_390",
    "start": 389.82,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb11.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "stat_32",
    "start": 396.08,
    "kind": "stat",
    "kicker": "Estudio · +250.000 personas",
    "value": 1,
    "suffix": "/día",
    "label": "un huevo al día NO daña el corazón",
    "sub": "Cuarenta años de miedo, desmentidos.",
    "image": "img/al_ph_egg.jpg",
    "mood": "science",
    "dur": 6.5
  },
  {
    "id": "fill_stat_32",
    "start": 402.58,
    "dur": 9.52,
    "kind": "talk"
  },
  {
    "id": "cut_amb12_407",
    "start": 406.58,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb12.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "checklist_33",
    "start": 412.1,
    "kind": "checklist",
    "kicker": "Lo que el huevo le da a tu piel",
    "title": "Una farmacia de belleza",
    "hot": [
      "belleza"
    ],
    "items": [
      "Proteína completa → los ladrillos del colágeno",
      "Biotina → cabello con cuerpo y uñas firmes",
      "Luteína → escudo natural contra el sol",
      "Zinc y selenio → reparan y protegen la piel"
    ],
    "mood": "gold",
    "dur": 6.5
  },
  {
    "id": "fill_checklist_33",
    "start": 418.6,
    "dur": 10.4,
    "kind": "talk"
  },
  {
    "id": "cut_amb13_423",
    "start": 422.6,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb13.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "stat_34",
    "start": 429,
    "kind": "stat",
    "kicker": "Proteína patrón oro",
    "prefix": "#",
    "value": 1,
    "label": "la proteína contra la que se miden todas",
    "sub": "La más completa… y la más barata.",
    "image": "img/al_ph_eggyolk.jpg",
    "mood": "science",
    "dur": 6.5
  },
  {
    "id": "fill_stat_34",
    "start": 435.5,
    "dur": 5.74,
    "kind": "talk"
  },
  {
    "id": "cut_amb14_440",
    "start": 439.5,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb14.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "talk_35",
    "start": 441.24,
    "kind": "talk",
    "title": "Sin ladrillos no hay obra. Sin proteína, no hay colágeno.",
    "hot": [
      "obra"
    ],
    "dur": 12.82
  },
  {
    "id": "cut_amb15_446",
    "start": 446.1,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb15.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "quote_36",
    "start": 454.06,
    "kind": "quote",
    "kicker": "En la yema",
    "quote": "La biotina es la vitamina de la belleza: cabello, uñas y piel.",
    "author": "Dra. Valeria Alcázar",
    "role": "Belleza natural",
    "image": "img/al_ph_eggyolk.jpg",
    "mood": "gold",
    "dur": 3.32
  },
  {
    "id": "full_37",
    "start": 457.38,
    "kind": "full",
    "ken": "out",
    "src": "broll/al_full_37.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_37",
    "start": 462.38,
    "dur": 0.44,
    "kind": "talk"
  },
  {
    "id": "full_38",
    "start": 462.82,
    "kind": "full",
    "ken": "in",
    "src": "broll/al_full_38.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_38",
    "start": 467.82,
    "dur": 32.24,
    "kind": "talk"
  },
  {
    "id": "cut_amb16_472",
    "start": 471.82,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb16.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb17_478",
    "start": 478.42,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb17.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb18_485",
    "start": 485.02,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb18.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb19_492",
    "start": 491.62,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb19.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb20_498",
    "start": 498.22,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb20.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "talk_39",
    "start": 500.06,
    "kind": "talk",
    "title": "Déjame contarte de una paciente.",
    "hot": [
      "paciente"
    ],
    "kicker": "Caso real",
    "dur": 4.9
  },
  {
    "id": "beforeafter_40",
    "start": 504.96,
    "kind": "beforeafter",
    "kicker": "Doña Elvira · 72 años",
    "title": "Tres meses, dos huevos al día",
    "hot": [
      "huevos"
    ],
    "imageA": "img/al_ph_grape.jpg",
    "imageB": "img/al_ph_grape.jpg",
    "labelA": "Antes: uñas y cabello frágiles",
    "labelB": "Después: firmes y con cuerpo",
    "mood": "warmdark",
    "dur": 6.5
  },
  {
    "id": "fill_beforeafter_40",
    "start": 511.46,
    "dur": 19.92,
    "kind": "talk"
  },
  {
    "id": "cut_amb21_515",
    "start": 515.46,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb21.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb22_522",
    "start": 522.06,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb22.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb23_529",
    "start": 528.66,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb23.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "talk_41",
    "start": 531.38,
    "kind": "talk",
    "title": "No le di una pastilla. Le di el material que le faltaba.",
    "hot": [
      "material"
    ],
    "dur": 43.6
  },
  {
    "id": "cut_amb24_535",
    "start": 535.26,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb24.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb1_542",
    "start": 541.86,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb1.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb2_548",
    "start": 548.46,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb2.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb3_555",
    "start": 555.06,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb3.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb4_562",
    "start": 561.66,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb4.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb5_568",
    "start": 568.26,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb5.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "step_42",
    "start": 574.98,
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
    "id": "step_43",
    "start": 581.56,
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
    "id": "fill_step_43",
    "start": 588.06,
    "dur": 26.88,
    "kind": "talk"
  },
  {
    "id": "cut_amb6_592",
    "start": 592.06,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb6.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb7_599",
    "start": 598.66,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb7.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb8_605",
    "start": 605.26,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb8.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb9_612",
    "start": 611.86,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb9.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "talk_44",
    "start": 614.94,
    "kind": "talk",
    "title": "Las cantidades exactas, ordenadas para ti.",
    "hot": [
      "exactas"
    ],
    "dur": 8.7
  },
  {
    "id": "cut_amb10_618",
    "start": 618.46,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb10.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "qr_45",
    "start": 623.64,
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
    "id": "fill_qr_45",
    "start": 630.14,
    "dur": 15.24,
    "kind": "talk"
  },
  {
    "id": "cut_amb11_634",
    "start": 634.14,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb11.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb12_641",
    "start": 640.74,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb12.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "full_46",
    "start": 645.38,
    "kind": "full",
    "ken": "in",
    "src": "img/al_ph_grape.jpg",
    "video": false,
    "dur": 5
  },
  {
    "id": "fill_full_46",
    "start": 650.38,
    "dur": 13.6,
    "kind": "talk"
  },
  {
    "id": "cut_amb13_654",
    "start": 654.38,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb13.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "chapter_47",
    "start": 663.98,
    "kind": "chapter",
    "index": "02",
    "kicker": "Alimento 2 de 3",
    "title": "La Sardina",
    "sub": "La humedad que rellena la piel",
    "mood": "cool",
    "dur": 6.5
  },
  {
    "id": "fill_chapter_47",
    "start": 670.48,
    "dur": 6.5,
    "kind": "talk"
  },
  {
    "id": "hero_48",
    "start": 676.98,
    "kind": "hero",
    "kicker": "Alimento 2 · La humedad",
    "title": "La sardina",
    "hot": [
      "sardina"
    ],
    "sub": "Humilde, baratísima, y más poderosa que un suero caro.",
    "image": "img/al_sardina.jpg",
    "side": "right",
    "mood": "cool",
    "dur": 6.5
  },
  {
    "id": "fill_hero_48",
    "start": 683.48,
    "dur": 8.64,
    "kind": "talk"
  },
  {
    "id": "cut_amb14_687",
    "start": 687.48,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb14.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_49",
    "start": 692.12,
    "kind": "full",
    "ken": "in",
    "src": "img/al_ph_grape.jpg",
    "video": false,
    "dur": 5
  },
  {
    "id": "fill_full_49",
    "start": 697.12,
    "dur": 2.18,
    "kind": "talk"
  },
  {
    "id": "full_50",
    "start": 699.3,
    "kind": "full",
    "ken": "in",
    "src": "img/al_ph_grape.jpg",
    "video": false,
    "dur": 5
  },
  {
    "id": "fill_full_50",
    "start": 704.3,
    "dur": 5.18,
    "kind": "talk"
  },
  {
    "id": "checklist_51",
    "start": 709.48,
    "kind": "checklist",
    "kicker": "Lo que la sardina le da a tu piel",
    "title": "Todo esto, en una latita",
    "hot": [
      "latita"
    ],
    "items": [
      "Omega-3 → hidrata y rellena desde adentro",
      "Omega-3 → apaga la inflamación que quema el colágeno",
      "Calcio y vitamina D → huesos fuertes",
      "Vitamina B12 → color vivo, adiós piel apagada"
    ],
    "mood": "cool",
    "dur": 6.5
  },
  {
    "id": "fill_checklist_51",
    "start": 715.98,
    "dur": 8.64,
    "kind": "talk"
  },
  {
    "id": "cut_amb15_720",
    "start": 719.98,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb15.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "full_52",
    "start": 724.62,
    "kind": "full",
    "ken": "out",
    "src": "broll/al_full_52.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_52",
    "start": 729.62,
    "dur": 25.2,
    "kind": "talk"
  },
  {
    "id": "cut_amb16_734",
    "start": 733.62,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb16.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb17_740",
    "start": 740.22,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb17.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb18_747",
    "start": 746.82,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb18.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb19_753",
    "start": 753.42,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb19.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "talk_53",
    "start": 754.82,
    "kind": "talk",
    "title": "El omega-3 apaga el fuego que quema tu colágeno.",
    "hot": [
      "apaga"
    ],
    "kicker": "El fuego escondido",
    "dur": 36.98
  },
  {
    "id": "cut_amb20_760",
    "start": 760.02,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb20.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb21_767",
    "start": 766.62,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb21.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb22_773",
    "start": 773.22,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb22.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb23_780",
    "start": 779.82,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb23.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb24_786",
    "start": 786.42,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb24.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "beforeafter_54",
    "start": 791.8,
    "kind": "beforeafter",
    "kicker": "La prueba del espejo",
    "title": "Uva o pasa: es el agua",
    "hot": [
      "agua"
    ],
    "imageA": "img/al_ph_grape.jpg",
    "imageB": "img/al_ph_raisin.jpg",
    "labelA": "Piel hidratada",
    "labelB": "Piel seca",
    "mood": "cool",
    "dur": 6.5
  },
  {
    "id": "fill_beforeafter_54",
    "start": 798.3,
    "dur": 40.72,
    "kind": "talk"
  },
  {
    "id": "cut_amb1_802",
    "start": 802.3,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb1.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb2_809",
    "start": 808.9,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb2.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb3_816",
    "start": 815.5,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb3.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb4_822",
    "start": 822.1,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb4.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb5_829",
    "start": 828.7,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb5.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb6_835",
    "start": 835.3,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb6.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_55",
    "start": 839.02,
    "kind": "full",
    "ken": "in",
    "src": "broll/al_full_55.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_55",
    "start": 844.02,
    "dur": 25.28,
    "kind": "talk"
  },
  {
    "id": "cut_amb7_848",
    "start": 848.02,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb7.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb8_855",
    "start": 854.62,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb8.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb9_861",
    "start": 861.22,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb9.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "step_56",
    "start": 869.3,
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
    "id": "fill_step_56",
    "start": 875.8,
    "dur": 38.34,
    "kind": "talk"
  },
  {
    "id": "cut_amb10_880",
    "start": 879.8,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb10.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb11_886",
    "start": 886.4,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb11.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb12_893",
    "start": 893,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb12.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb13_900",
    "start": 899.6,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb13.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb14_906",
    "start": 906.2,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb14.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb15_913",
    "start": 912.8,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb15.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "talk_57",
    "start": 914.14,
    "kind": "talk",
    "title": "No lo dejes solo en la cabeza. Guárdalo.",
    "hot": [
      "Guárdalo"
    ],
    "dur": 3.5
  },
  {
    "id": "qr_58",
    "start": 917.64,
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
    "id": "fill_qr_58",
    "start": 924.14,
    "dur": 7.96,
    "kind": "talk"
  },
  {
    "id": "cut_amb16_928",
    "start": 928.14,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb16.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "full_59",
    "start": 932.1,
    "kind": "full",
    "ken": "out",
    "src": "img/al_ph_grape.jpg",
    "video": false,
    "dur": 5
  },
  {
    "id": "fill_full_59",
    "start": 937.1,
    "dur": 27.92,
    "kind": "talk"
  },
  {
    "id": "cut_amb17_941",
    "start": 941.1,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb17.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb18_948",
    "start": 947.7,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb18.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb19_954",
    "start": 954.3,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb19.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb20_961",
    "start": 960.9,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb20.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "talk_60",
    "start": 965.02,
    "kind": "talk",
    "title": "Sin este ingrediente, nada se arma.",
    "hot": [
      "nada"
    ],
    "kicker": "El secreto que lo une todo",
    "dur": 19.48
  },
  {
    "id": "cut_amb21_968",
    "start": 967.5,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb21.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb22_974",
    "start": 974.1,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb22.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb23_981",
    "start": 980.7,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb23.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "chapter_61",
    "start": 984.5,
    "kind": "chapter",
    "index": "03",
    "kicker": "Alimento 3 de 3",
    "title": "La Vitamina C",
    "sub": "El cemento que une los ladrillos",
    "mood": "science",
    "dur": 2.5
  },
  {
    "id": "hero_62",
    "start": 987,
    "kind": "hero",
    "kicker": "Alimento 3 · El cemento",
    "title": "La vitamina C",
    "hot": [
      "vitamina"
    ],
    "sub": "Pimiento rojo, guayaba, cítricos… el que tengas a mano.",
    "image": "img/al_vitc.jpg",
    "side": "left",
    "mood": "science",
    "dur": 4.12
  },
  {
    "id": "stat_63",
    "start": 991.12,
    "kind": "stat",
    "kicker": "Dato que sorprende",
    "prefix": ">",
    "value": 100,
    "suffix": "%",
    "label": "el pimiento rojo tiene MÁS vitamina C que una naranja",
    "sub": "Y la guayaba, todavía más.",
    "image": "img/al_ph_pepper2.jpg",
    "mood": "science",
    "dur": 4.16
  },
  {
    "id": "full_64",
    "start": 995.28,
    "kind": "full",
    "ken": "out",
    "src": "img/al_ph_grape.jpg",
    "video": false,
    "dur": 2.88
  },
  {
    "id": "full_65",
    "start": 998.16,
    "kind": "full",
    "ken": "left",
    "src": "img/al_ph_grape.jpg",
    "video": false,
    "dur": 5
  },
  {
    "id": "fill_full_65",
    "start": 1003.16,
    "dur": 6.66,
    "kind": "talk"
  },
  {
    "id": "molecule_66",
    "start": 1009.82,
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
    "id": "fill_molecule_66",
    "start": 1016.32,
    "dur": 10.16,
    "kind": "talk"
  },
  {
    "id": "cut_amb24_1020",
    "start": 1020.32,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb24.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "talk_67",
    "start": 1026.48,
    "kind": "talk",
    "title": "Sin vitamina C, los ladrillos nunca son piel firme.",
    "hot": [
      "nunca"
    ],
    "dur": 17.92
  },
  {
    "id": "cut_amb1_1027",
    "start": 1026.92,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb1.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb2_1034",
    "start": 1033.52,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb2.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb3_1040",
    "start": 1040.12,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb3.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "full_68",
    "start": 1044.4,
    "kind": "full",
    "ken": "in",
    "src": "broll/al_full_68.mp4",
    "video": true,
    "dur": 3.1
  },
  {
    "id": "beforeafter_69",
    "start": 1047.5,
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
    "id": "fill_beforeafter_69",
    "start": 1054,
    "dur": 60.92,
    "kind": "talk"
  },
  {
    "id": "cut_amb4_1058",
    "start": 1058,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb4.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb5_1065",
    "start": 1064.6,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb5.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb6_1071",
    "start": 1071.2,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb6.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb7_1078",
    "start": 1077.8,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb7.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb8_1084",
    "start": 1084.4,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb8.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb9_1091",
    "start": 1091,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb9.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb10_1098",
    "start": 1097.6,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb10.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb11_1104",
    "start": 1104.2,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb11.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb12_1111",
    "start": 1110.8,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb12.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "talk_70",
    "start": 1114.92,
    "kind": "talk",
    "title": "Vitamina C + huevo: se potencian entre sí.",
    "hot": [
      "potencian"
    ],
    "dur": 25.06
  },
  {
    "id": "cut_amb13_1117",
    "start": 1117.4,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb13.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb14_1124",
    "start": 1124,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb14.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb15_1131",
    "start": 1130.6,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb15.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "step_71",
    "start": 1139.98,
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
    "id": "fill_step_71",
    "start": 1146.48,
    "dur": 22.22,
    "kind": "talk"
  },
  {
    "id": "cut_amb16_1150",
    "start": 1150.48,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb16.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb17_1157",
    "start": 1157.08,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb17.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb18_1164",
    "start": 1163.68,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb18.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "chapter_72",
    "start": 1168.7,
    "kind": "chapter",
    "index": "04",
    "kicker": "Para que no se te escape",
    "title": "El Resumen",
    "sub": "Ladrillos, humedad y cemento",
    "mood": "gold",
    "dur": 6.5
  },
  {
    "id": "fill_chapter_72",
    "start": 1175.2,
    "dur": 4.44,
    "kind": "talk"
  },
  {
    "id": "checklist_73",
    "start": 1179.64,
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
    "id": "fill_checklist_73",
    "start": 1186.14,
    "dur": 37.16,
    "kind": "talk"
  },
  {
    "id": "cut_amb19_1190",
    "start": 1190.14,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb19.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb20_1197",
    "start": 1196.74,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb20.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb21_1203",
    "start": 1203.34,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb21.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb22_1210",
    "start": 1209.94,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb22.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb23_1217",
    "start": 1216.54,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb23.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb24_1223",
    "start": 1223.14,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb24.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "talk_74",
    "start": 1223.3,
    "kind": "talk",
    "title": "No los tres perfectos. Empieza con uno.",
    "hot": [
      "uno"
    ],
    "dur": 21.52
  },
  {
    "id": "cut_amb1_1230",
    "start": 1229.74,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb1.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb2_1236",
    "start": 1236.34,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb2.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "quote_75",
    "start": 1244.82,
    "kind": "quote",
    "kicker": "Recuérdalo",
    "quote": "La belleza no estaba en el pomo caro. Estaba en tu cocina.",
    "author": "Dra. Valeria Alcázar",
    "role": "Belleza natural",
    "image": "img/al_ph_kitchen.jpg",
    "mood": "warmdark",
    "dur": 6.5
  },
  {
    "id": "fill_quote_75",
    "start": 1251.32,
    "dur": 22.04,
    "kind": "talk"
  },
  {
    "id": "cut_amb3_1255",
    "start": 1255.32,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb3.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb4_1262",
    "start": 1261.92,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb4.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb5_1269",
    "start": 1268.52,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb5.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cta_76",
    "start": 1273.36,
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
    "id": "fill_cta_76",
    "start": 1279.86,
    "dur": 6.86,
    "kind": "talk"
  },
  {
    "id": "qr_77",
    "start": 1286.72,
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
    "id": "fill_qr_77",
    "start": 1293.22,
    "dur": 7.76,
    "kind": "talk"
  },
  {
    "id": "cut_amb6_1297",
    "start": 1297.22,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb6.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_78",
    "start": 1300.98,
    "kind": "full",
    "ken": "in",
    "src": "img/al_ph_grape.jpg",
    "video": false,
    "dur": 5
  },
  {
    "id": "fill_full_78",
    "start": 1305.98,
    "dur": 4.98,
    "kind": "talk"
  },
  {
    "id": "cut_amb7_1310",
    "start": 1309.98,
    "dur": 3.2,
    "kind": "full",
    "src": "broll/al_amb7.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "talk_79",
    "start": 1310.96,
    "kind": "talk",
    "title": "Cuídate. Te quiero bella, sana y radiante.",
    "hot": [
      "radiante"
    ],
    "kicker": "Nos vemos pronto",
    "dur": 15.34
  }
];
