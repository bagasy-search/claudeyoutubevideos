// cues_valeriavaselina.gen.ts — GENERADO por build_valeriavaselina.mjs. NO editar a mano.
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
export const TOTAL_FRAMES_VV = 41777;
export const BEATS: Cue[] = [
  {
    "id": "talk_1",
    "start": 0,
    "kind": "talk",
    "title": "Un frasco de 2 €. Su piel, años más joven.",
    "hot": [
      "2 €"
    ],
    "kicker": "Dra. Valeria Alcázar · Belleza vintage",
    "dur": 11.66
  },
  {
    "id": "cut_amb1_4",
    "start": 4.2,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb1.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_2",
    "start": 11.66,
    "kind": "full",
    "ken": "in",
    "src": "broll/vv_full_2.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_2",
    "start": 16.66,
    "dur": 0.84,
    "kind": "talk"
  },
  {
    "id": "hero_3",
    "start": 17.5,
    "kind": "hero",
    "kicker": "El secreto de 2 euros",
    "title": "La vaselina de toda la vida",
    "hot": [
      "vaselina"
    ],
    "sub": "Sí, esa misma que ya tiene en el cajón del baño.",
    "image": "img/vv_ph_jar.jpg",
    "side": "right",
    "mood": "gold",
    "dur": 6.5
  },
  {
    "id": "fill_hero_3",
    "start": 24,
    "dur": 4.64,
    "kind": "talk"
  },
  {
    "id": "full_4",
    "start": 28.64,
    "kind": "full",
    "ken": "out",
    "src": "broll/vv_full_4.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_4",
    "start": 33.64,
    "dur": 11.14,
    "kind": "talk"
  },
  {
    "id": "cut_amb2_38",
    "start": 37.84,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb2.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_5",
    "start": 44.78,
    "kind": "full",
    "ken": "in",
    "src": "broll/vv_full_5.mp4",
    "video": true,
    "dur": 3.12
  },
  {
    "id": "full_6",
    "start": 47.9,
    "kind": "full",
    "ken": "left",
    "src": "broll/vv_full_6.mp4",
    "video": true,
    "dur": 2.44
  },
  {
    "id": "lowerthird_7",
    "start": 50.34,
    "kind": "lowerthird",
    "name": "Dra. Valeria Alcázar",
    "role": "Medicina estética · Belleza vintage",
    "topic": "Vaselina + vitamina E",
    "dur": 6.08
  },
  {
    "id": "talk_8",
    "start": 56.42,
    "kind": "talk",
    "title": "Quédese hasta el final: la receta y las 7 formas.",
    "hot": [
      "7 formas"
    ],
    "kicker": "No se lo pierda",
    "dur": 23.62
  },
  {
    "id": "cut_amb3_61",
    "start": 60.62,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb3.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb4_68",
    "start": 68.22,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb4.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb5_76",
    "start": 75.82,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb5.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "talk_9",
    "start": 80.04,
    "kind": "talk",
    "title": "Cuando entiende el porqué, deja de gastar de más.",
    "hot": [
      "porqué"
    ],
    "dur": 16.02
  },
  {
    "id": "cut_amb6_83",
    "start": 83.42,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb6.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb7_91",
    "start": 91.02,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb7.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "full_10",
    "start": 96.06,
    "kind": "full",
    "ken": "in",
    "src": "broll/vv_full_10.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_10",
    "start": 101.06,
    "dur": 8.58,
    "kind": "talk"
  },
  {
    "id": "cut_amb8_105",
    "start": 105.26,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb8.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "hero_11",
    "start": 109.64,
    "kind": "hero",
    "kicker": "Su función secreta",
    "title": "Sella el agua dentro de la piel",
    "hot": [
      "agua"
    ],
    "sub": "El ingrediente más eficaz del mundo para una sola cosa.",
    "image": "img/vv_ph_seal.jpg",
    "side": "left",
    "mood": "science",
    "dur": 6.5
  },
  {
    "id": "fill_hero_11",
    "start": 116.14,
    "dur": 13.52,
    "kind": "talk"
  },
  {
    "id": "cut_amb9_120",
    "start": 120.34,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb9.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "stat_12",
    "start": 129.66,
    "kind": "stat",
    "kicker": "Estudios dermatológicos",
    "value": 98,
    "suffix": "%",
    "label": "menos pérdida de agua en la piel",
    "sub": "El sellador más potente que existe. Ninguna crema se acerca.",
    "image": "img/vv_ph_waterdrop.jpg",
    "mood": "science",
    "dur": 6.5
  },
  {
    "id": "fill_stat_12",
    "start": 136.16,
    "dur": 6.86,
    "kind": "talk"
  },
  {
    "id": "beforeafter_13",
    "start": 143.02,
    "kind": "beforeafter",
    "kicker": "Vaselina vs. aceite de oliva",
    "title": "No hay comparación",
    "hot": [
      "comparación"
    ],
    "imageA": "img/vv_ph_oliveoil.jpg",
    "imageB": "img/vv_ph_vaselineseal.jpg",
    "labelA": "Oliva: 20-30 %",
    "labelB": "Vaselina: 98 %",
    "mood": "science",
    "dur": 6.5
  },
  {
    "id": "fill_beforeafter_13",
    "start": 149.52,
    "dur": 0.56,
    "kind": "talk"
  },
  {
    "id": "stat_14",
    "start": 150.08,
    "kind": "stat",
    "kicker": "Frente al aceite de oliva",
    "value": 170,
    "suffix": "×",
    "label": "más capacidad de frenar la evaporación",
    "sub": "Ciento setenta veces. No es una diferencia: es otro mundo.",
    "image": "img/vv_ph_vaselineseal.jpg",
    "mood": "cool",
    "dur": 6.5
  },
  {
    "id": "fill_stat_14",
    "start": 156.58,
    "dur": 13.88,
    "kind": "talk"
  },
  {
    "id": "cut_amb10_161",
    "start": 160.78,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb10.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_15",
    "start": 170.46,
    "kind": "full",
    "ken": "in",
    "src": "broll/vv_full_15.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_15",
    "start": 175.46,
    "dur": 18,
    "kind": "talk"
  },
  {
    "id": "cut_amb11_180",
    "start": 179.66,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb11.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb12_187",
    "start": 187.26,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb12.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "full_16",
    "start": 193.46,
    "kind": "full",
    "ken": "out",
    "src": "broll/vv_full_16.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_16",
    "start": 198.46,
    "dur": 12.76,
    "kind": "talk"
  },
  {
    "id": "cut_amb13_203",
    "start": 202.66,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb13.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb14_210",
    "start": 210.26,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb14.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "talk_17",
    "start": 211.22,
    "kind": "talk",
    "title": "Lo llaman \"slugging\". Su abuela ya lo hacía.",
    "hot": [
      "slugging"
    ],
    "accent": "#B08D3C",
    "dur": 32.3
  },
  {
    "id": "cut_amb15_218",
    "start": 217.86,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb15.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb16_225",
    "start": 225.46,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb16.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb17_233",
    "start": 233.06,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb17.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "stat_18",
    "start": 243.52,
    "kind": "stat",
    "kicker": "J. Allergy Clin. Immunol.",
    "value": 2016,
    "label": "el estudio que lo cambió todo",
    "sub": "Descubrieron que la vaselina NO es un ingrediente inerte.",
    "image": "img/vv_ph_study.jpg",
    "mood": "science",
    "decimals": 0,
    "dur": 6.5
  },
  {
    "id": "fill_stat_18",
    "start": 250.02,
    "dur": 7.86,
    "kind": "talk"
  },
  {
    "id": "cut_amb18_254",
    "start": 254.22,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb18.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "talk_19",
    "start": 257.88,
    "kind": "talk",
    "title": "No solo sella: le da una orden a su piel.",
    "hot": [
      "orden"
    ],
    "dur": 20.64
  },
  {
    "id": "cut_amb19_262",
    "start": 261.82,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb19.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb20_269",
    "start": 269.42,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb20.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "molecule_20",
    "start": 278.52,
    "kind": "molecule",
    "kicker": "Las proteínas de la piel joven",
    "title": "Filagrina y loricrina",
    "hot": [
      "juventud"
    ],
    "centerLabel": "Piel firme",
    "sub": "El ladrillo y el cemento de la muralla de su piel.",
    "nodes": [
      {
        "label": "Filagrina"
      },
      {
        "label": "Loricrina"
      },
      {
        "label": "Firmeza"
      }
    ],
    "image": "img/vv_ph_collagen.jpg",
    "mood": "science",
    "dur": 6.5
  },
  {
    "id": "fill_molecule_20",
    "start": 285.02,
    "dur": 42.88,
    "kind": "talk"
  },
  {
    "id": "cut_amb21_289",
    "start": 289.22,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb21.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb22_297",
    "start": 296.82,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb22.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb23_304",
    "start": 304.42,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb23.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb24_312",
    "start": 312.02,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb24.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb1_320",
    "start": 319.62,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb1.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_21",
    "start": 327.9,
    "kind": "full",
    "ken": "in",
    "src": "broll/vv_full_21.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_21",
    "start": 332.9,
    "dur": 6.12,
    "kind": "talk"
  },
  {
    "id": "hero_22",
    "start": 339.02,
    "kind": "hero",
    "kicker": "La piel se reconstruye sola",
    "title": "Lo que no hace una crema de 30 €",
    "hot": [
      "30 €"
    ],
    "sub": "Lo hace un frasco de menos de dos.",
    "image": "img/vv_ph_jar2.jpg",
    "side": "right",
    "mood": "gold",
    "dur": 3.72
  },
  {
    "id": "talk_23",
    "start": 342.74,
    "kind": "talk",
    "title": "El mito más grande sobre la vaselina.",
    "hot": [
      "mito"
    ],
    "kicker": "A desmontar",
    "accent": "#B5643C",
    "dur": 8.96
  },
  {
    "id": "cut_amb2_347",
    "start": 346.94,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb2.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "beforeafter_24",
    "start": 351.7,
    "kind": "beforeafter",
    "kicker": "Mito vs. verdad",
    "title": "¿Tapa los poros?",
    "hot": [
      "poros"
    ],
    "imageA": "img/vv_ph_pores.jpg",
    "imageB": "img/vv_ph_cleanskin.jpg",
    "labelA": "El mito",
    "labelB": "No comedogénico",
    "mood": "science",
    "dur": 6.5
  },
  {
    "id": "fill_beforeafter_24",
    "start": 358.2,
    "dur": 19.54,
    "kind": "talk"
  },
  {
    "id": "cut_amb3_362",
    "start": 362.4,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb3.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb4_370",
    "start": 370,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb4.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "hero_25",
    "start": 377.74,
    "kind": "hero",
    "kicker": "Lo que dice la ciencia",
    "title": "No tapona los poros",
    "hot": [
      "No"
    ],
    "sub": "Sus moléculas son demasiado grandes para meterse dentro del poro.",
    "image": "img/vv_ph_cleanskin.jpg",
    "side": "left",
    "mood": "science",
    "dur": 6.5
  },
  {
    "id": "fill_hero_25",
    "start": 384.24,
    "dur": 53.66,
    "kind": "talk"
  },
  {
    "id": "cut_amb5_388",
    "start": 388.44,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb5.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb6_396",
    "start": 396.04,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb6.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb7_404",
    "start": 403.64,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb7.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb8_411",
    "start": 411.24,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb8.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb9_419",
    "start": 418.84,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb9.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb10_426",
    "start": 426.44,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb10.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "hero_30",
    "start": 437.9,
    "kind": "hero",
    "kicker": "El error de usarla sola",
    "title": "El mejor candado del mundo",
    "hot": [
      "candado"
    ],
    "sub": "Pero un candado vacío: sella, pero no nutre.",
    "image": "img/vv_ph_lock.jpg",
    "side": "right",
    "mood": "warmdark",
    "dur": 6.5
  },
  {
    "id": "fill_hero_30",
    "start": 444.4,
    "dur": 28.18,
    "kind": "talk"
  },
  {
    "id": "cut_amb11_449",
    "start": 448.6,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb11.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb12_456",
    "start": 456.2,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb12.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb13_464",
    "start": 463.8,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb13.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_31",
    "start": 472.58,
    "kind": "full",
    "ken": "in",
    "src": "broll/vv_full_31.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_31",
    "start": 477.58,
    "dur": 21.88,
    "kind": "talk"
  },
  {
    "id": "cut_amb14_482",
    "start": 481.78,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb14.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb15_489",
    "start": 489.38,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb15.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "hero_32",
    "start": 499.46,
    "kind": "hero",
    "kicker": "Con qué se mezcla",
    "title": "Vaselina + aceite de vitamina E",
    "hot": [
      "vitamina E"
    ],
    "sub": "El antioxidante más estudiado para la piel, por muy poco dinero.",
    "image": "img/vv_ph_vite.jpg",
    "side": "left",
    "mood": "gold",
    "dur": 6.5
  },
  {
    "id": "fill_hero_32",
    "start": 505.96,
    "dur": 13.54,
    "kind": "talk"
  },
  {
    "id": "cut_amb16_510",
    "start": 510.16,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb16.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "molecule_33",
    "start": 519.5,
    "kind": "molecule",
    "kicker": "Qué envejece su piel",
    "title": "Los radicales libres",
    "hot": [
      "oxidan"
    ],
    "centerLabel": "Daño",
    "sub": "La chispa que oxida la piel: sol, contaminación, años.",
    "nodes": [
      {
        "label": "Manchas"
      },
      {
        "label": "Flacidez"
      },
      {
        "label": "Menos luz"
      }
    ],
    "image": "img/vv_ph_oxidation.jpg",
    "mood": "warmdark",
    "dur": 4.38
  },
  {
    "id": "full_34",
    "start": 523.88,
    "kind": "full",
    "ken": "in",
    "src": "broll/vv_full_34.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_34",
    "start": 528.88,
    "dur": 7.56,
    "kind": "talk"
  },
  {
    "id": "molecule_35",
    "start": 536.44,
    "kind": "molecule",
    "kicker": "Qué hace la vitamina E",
    "title": "El bombero de su piel",
    "hot": [
      "antioxidante"
    ],
    "centerLabel": "Vitamina E",
    "sub": "Neutraliza los radicales libres antes de que hagan daño.",
    "nodes": [
      {
        "label": "Protege del sol"
      },
      {
        "label": "Aclara manchas"
      },
      {
        "label": "Repara"
      }
    ],
    "image": "img/vv_ph_vite2.jpg",
    "mood": "science",
    "dur": 6.5
  },
  {
    "id": "fill_molecule_35",
    "start": 542.94,
    "dur": 14.28,
    "kind": "talk"
  },
  {
    "id": "cut_amb17_547",
    "start": 547.14,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb17.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "beforeafter_36",
    "start": 557.22,
    "kind": "beforeafter",
    "kicker": "Con constancia",
    "title": "Las manchas, más tenues",
    "hot": [
      "manchas"
    ],
    "imageA": "img/vv_ph_spots.jpg",
    "imageB": "img/vv_ph_clearskin.jpg",
    "labelA": "Con manchas",
    "labelB": "Más parejo",
    "mood": "science",
    "dur": 6.5
  },
  {
    "id": "fill_beforeafter_36",
    "start": 563.72,
    "dur": 30.72,
    "kind": "talk"
  },
  {
    "id": "cut_amb18_568",
    "start": 567.92,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb18.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb19_576",
    "start": 575.52,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb19.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb20_583",
    "start": 583.12,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb20.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "checklist_37",
    "start": 594.44,
    "kind": "checklist",
    "kicker": "Por qué funciona tan bien",
    "title": "Tres efectos en un solo gesto",
    "hot": [
      "Tres"
    ],
    "items": [
      "Sella su propia agua → piel rellena a la mañana",
      "Atrapa la vitamina E toda la noche → combate manchas",
      "Ordena a la piel fabricar proteínas de firmeza"
    ],
    "mood": "gold",
    "dur": 6.5
  },
  {
    "id": "fill_checklist_37",
    "start": 600.94,
    "dur": 49.92,
    "kind": "talk"
  },
  {
    "id": "cut_amb21_605",
    "start": 605.14,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb21.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb22_613",
    "start": 612.74,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb22.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb23_620",
    "start": 620.34,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb23.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb24_628",
    "start": 627.94,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb24.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb1_636",
    "start": 635.54,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb1.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb2_643",
    "start": 643.14,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb2.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb3_651",
    "start": 650.74,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb3.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "talk_26",
    "start": 650.86,
    "kind": "talk",
    "title": "Sea justa consigo misma. Le doy los tiempos.",
    "hot": [
      "tiempos"
    ],
    "kicker": "Nada de promesas infladas",
    "dur": 6.96
  },
  {
    "id": "stat_27",
    "start": 657.82,
    "kind": "stat",
    "kicker": "La primera mañana",
    "value": 1,
    "suffix": ".ª noche",
    "label": "ya la nota más rellena y suave",
    "sub": "El efecto inmediato del agua sellada. Por eso: al instante.",
    "image": "img/vv_ph_morningskin.jpg",
    "mood": "cool",
    "dur": 6.5
  },
  {
    "id": "fill_stat_27",
    "start": 664.32,
    "dur": 28.24,
    "kind": "talk"
  },
  {
    "id": "cut_amb4_669",
    "start": 668.52,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb4.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb5_676",
    "start": 676.12,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb5.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb6_684",
    "start": 683.72,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb6.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "stat_28",
    "start": 692.56,
    "kind": "stat",
    "kicker": "Lo que se queda",
    "value": 4,
    "suffix": " semanas",
    "label": "firmeza y manchas más tenues",
    "sub": "Compare una foto de hoy con una de dentro de un mes.",
    "image": "img/vv_ph_month.jpg",
    "mood": "gold",
    "dur": 6.5
  },
  {
    "id": "fill_stat_28",
    "start": 699.06,
    "dur": 5.66,
    "kind": "talk"
  },
  {
    "id": "quote_29",
    "start": 704.72,
    "kind": "quote",
    "kicker": "Recuérdelo",
    "quote": "Lo inmediato la engancha; lo constante la transforma.",
    "author": "Dra. Valeria Alcázar",
    "role": "Belleza vintage",
    "image": "img/vv_ph_calmwoman.jpg",
    "mood": "warmdark",
    "dur": 6.5
  },
  {
    "id": "fill_quote_29",
    "start": 711.22,
    "dur": 7.9,
    "kind": "talk"
  },
  {
    "id": "stat_38",
    "start": 719.12,
    "kind": "stat",
    "kicker": "No es un invento moderno",
    "value": 1872,
    "label": "el año en que se patentó la vaselina",
    "sub": "Más de 150 años ganándose la confianza de la gente.",
    "image": "img/vv_ph_vintage.jpg",
    "mood": "warmdark",
    "decimals": 0,
    "dur": 6.08
  },
  {
    "id": "full_39",
    "start": 725.2,
    "kind": "full",
    "ken": "out",
    "src": "broll/vv_full_39.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_39",
    "start": 730.2,
    "dur": 24.92,
    "kind": "talk"
  },
  {
    "id": "cut_amb7_734",
    "start": 734.4,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb7.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb8_742",
    "start": 742,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb8.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb9_750",
    "start": 749.6,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb9.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "stat_40",
    "start": 755.12,
    "kind": "stat",
    "kicker": "Estados Unidos, 1874",
    "value": 1,
    "suffix": " lata/min",
    "label": "se vendía en todo el país",
    "sub": "Apenas dos años después de su lanzamiento.",
    "image": "img/vv_ph_vintagejar.jpg",
    "mood": "gold",
    "dur": 6.5
  },
  {
    "id": "fill_stat_40",
    "start": 761.62,
    "dur": 1.5,
    "kind": "talk"
  },
  {
    "id": "talk_41",
    "start": 763.12,
    "kind": "talk",
    "title": "Su inventor la tomaba a diario. Vivió 96 años.",
    "hot": [
      "96"
    ],
    "kicker": "Anécdota",
    "dur": 21.24
  },
  {
    "id": "cut_amb10_766",
    "start": 765.82,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb10.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb11_773",
    "start": 773.42,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb11.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "full_42",
    "start": 784.36,
    "kind": "full",
    "ken": "in",
    "src": "broll/vv_full_42.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_42",
    "start": 789.36,
    "dur": 17.42,
    "kind": "talk"
  },
  {
    "id": "cut_amb12_794",
    "start": 793.56,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb12.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb13_801",
    "start": 801.16,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb13.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_43",
    "start": 806.78,
    "kind": "full",
    "ken": "left",
    "src": "broll/vv_full_43.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_43",
    "start": 811.78,
    "dur": 11.8,
    "kind": "talk"
  },
  {
    "id": "cut_amb14_816",
    "start": 815.98,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb14.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "talk_44",
    "start": 823.58,
    "kind": "talk",
    "title": "La receta, y las 7 formas de usarla.",
    "hot": [
      "receta"
    ],
    "kicker": "Tome nota",
    "dur": 24.5
  },
  {
    "id": "cut_amb15_824",
    "start": 823.58,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb15.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb16_831",
    "start": 831.18,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb16.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb17_839",
    "start": 838.78,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb17.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "step_45",
    "start": 848.08,
    "kind": "step",
    "step": 1,
    "total": 3,
    "title": "Vaselina pura y neutra",
    "hot": [
      "pura"
    ],
    "sub": "La blanca de siempre, sin perfumes ni colores.",
    "image": "img/vv_ph_vaselinepure.jpg",
    "mood": "gold",
    "dur": 6.5
  },
  {
    "id": "step_46",
    "start": 854.84,
    "kind": "step",
    "step": 2,
    "total": 3,
    "title": "Aceite de vitamina E",
    "hot": [
      "vitamina E"
    ],
    "sub": "En gotero de farmacia, o cápsulas pinchadas con un alfiler.",
    "image": "img/vv_ph_vitecaps.jpg",
    "mood": "science",
    "dur": 6.5
  },
  {
    "id": "fill_step_46",
    "start": 861.34,
    "dur": 18.04,
    "kind": "talk"
  },
  {
    "id": "cut_amb18_866",
    "start": 865.54,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb18.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb19_873",
    "start": 873.14,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb19.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "step_47",
    "start": 879.38,
    "kind": "step",
    "step": 3,
    "total": 3,
    "title": "Mezcle en un frasquito",
    "hot": [
      "frasquito"
    ],
    "sub": "Hasta una crema homogénea. Le dura semanas.",
    "image": "img/vv_ph_mixjar.jpg",
    "mood": "gold",
    "dur": 6.5
  },
  {
    "id": "fill_step_47",
    "start": 885.88,
    "dur": 1.7,
    "kind": "talk"
  },
  {
    "id": "talk_48",
    "start": 887.58,
    "kind": "talk",
    "title": "Las medidas exactas, apuntadas en la descripción.",
    "hot": [
      "descripción"
    ],
    "kicker": "Ahí abajo",
    "dur": 19.5
  },
  {
    "id": "cut_amb20_890",
    "start": 890.08,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb20.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb21_898",
    "start": 897.68,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb21.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_49",
    "start": 907.08,
    "kind": "full",
    "ken": "in",
    "src": "broll/vv_full_49.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_49",
    "start": 912.08,
    "dur": 10.08,
    "kind": "talk"
  },
  {
    "id": "cut_amb22_916",
    "start": 916.28,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb22.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_50",
    "start": 922.16,
    "kind": "full",
    "ken": "out",
    "src": "broll/vv_full_50.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_50",
    "start": 927.16,
    "dur": 28.46,
    "kind": "talk"
  },
  {
    "id": "cut_amb23_931",
    "start": 931.36,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb23.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb24_939",
    "start": 938.96,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb24.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb1_947",
    "start": 946.56,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb1.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "carousel_51",
    "start": 955.62,
    "kind": "carousel",
    "kicker": "Forma 1 · Contorno de ojos",
    "cards": [
      {
        "index": "N.º 01",
        "name": "Contorno de ojos",
        "tag": "Arrugas finas",
        "image": "img/vv_card_ojos.jpg"
      },
      {
        "index": "N.º 02",
        "name": "Manos",
        "tag": "Manchas de edad",
        "image": "img/vv_card_manos.jpg"
      },
      {
        "index": "N.º 03",
        "name": "Surcos y boca",
        "tag": "Líneas marcadas",
        "image": "img/vv_card_surcos.jpg"
      },
      {
        "index": "N.º 04",
        "name": "Cuello y escote",
        "tag": "Firmeza",
        "image": "img/vv_card_cuello.jpg"
      },
      {
        "index": "N.º 05",
        "name": "Labios",
        "tag": "Hidratación",
        "image": "img/vv_card_labios.jpg"
      },
      {
        "index": "N.º 06",
        "name": "Pestañas y cejas",
        "tag": "Cuidado",
        "image": "img/vv_card_cejas.jpg"
      },
      {
        "index": "N.º 07",
        "name": "Codos y talones",
        "tag": "Piel áspera",
        "image": "img/vv_card_pies.jpg"
      }
    ],
    "focus": 0,
    "intro": true,
    "accent": "#B08D3C",
    "dur": 5.5
  },
  {
    "id": "fill_carousel_51",
    "start": 961.12,
    "dur": 1.76,
    "kind": "talk"
  },
  {
    "id": "full_52",
    "start": 962.88,
    "kind": "full",
    "ken": "in",
    "src": "broll/vv_full_52.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_52",
    "start": 967.88,
    "dur": 11.28,
    "kind": "talk"
  },
  {
    "id": "cut_amb2_972",
    "start": 972.08,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb2.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_53",
    "start": 979.16,
    "kind": "full",
    "ken": "out",
    "src": "broll/vv_full_53.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_53",
    "start": 984.16,
    "dur": 14.62,
    "kind": "talk"
  },
  {
    "id": "cut_amb3_988",
    "start": 988.36,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb3.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "carousel_54",
    "start": 998.78,
    "kind": "carousel",
    "kicker": "Forma 2 · Manos",
    "cards": [
      {
        "index": "N.º 01",
        "name": "Contorno de ojos",
        "tag": "Arrugas finas",
        "image": "img/vv_card_ojos.jpg"
      },
      {
        "index": "N.º 02",
        "name": "Manos",
        "tag": "Manchas de edad",
        "image": "img/vv_card_manos.jpg"
      },
      {
        "index": "N.º 03",
        "name": "Surcos y boca",
        "tag": "Líneas marcadas",
        "image": "img/vv_card_surcos.jpg"
      },
      {
        "index": "N.º 04",
        "name": "Cuello y escote",
        "tag": "Firmeza",
        "image": "img/vv_card_cuello.jpg"
      },
      {
        "index": "N.º 05",
        "name": "Labios",
        "tag": "Hidratación",
        "image": "img/vv_card_labios.jpg"
      },
      {
        "index": "N.º 06",
        "name": "Pestañas y cejas",
        "tag": "Cuidado",
        "image": "img/vv_card_cejas.jpg"
      },
      {
        "index": "N.º 07",
        "name": "Codos y talones",
        "tag": "Piel áspera",
        "image": "img/vv_card_pies.jpg"
      }
    ],
    "focus": 1,
    "dur": 5.5
  },
  {
    "id": "fill_carousel_54",
    "start": 1004.28,
    "dur": 18.5,
    "kind": "talk"
  },
  {
    "id": "cut_amb4_1008",
    "start": 1008.48,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb4.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb5_1016",
    "start": 1016.08,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb5.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_55",
    "start": 1022.78,
    "kind": "full",
    "ken": "in",
    "src": "broll/vv_full_55.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_55",
    "start": 1027.78,
    "dur": 12,
    "kind": "talk"
  },
  {
    "id": "cut_amb6_1032",
    "start": 1031.98,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb6.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "carousel_56",
    "start": 1039.78,
    "kind": "carousel",
    "kicker": "Forma 3 · Surcos y boca",
    "cards": [
      {
        "index": "N.º 01",
        "name": "Contorno de ojos",
        "tag": "Arrugas finas",
        "image": "img/vv_card_ojos.jpg"
      },
      {
        "index": "N.º 02",
        "name": "Manos",
        "tag": "Manchas de edad",
        "image": "img/vv_card_manos.jpg"
      },
      {
        "index": "N.º 03",
        "name": "Surcos y boca",
        "tag": "Líneas marcadas",
        "image": "img/vv_card_surcos.jpg"
      },
      {
        "index": "N.º 04",
        "name": "Cuello y escote",
        "tag": "Firmeza",
        "image": "img/vv_card_cuello.jpg"
      },
      {
        "index": "N.º 05",
        "name": "Labios",
        "tag": "Hidratación",
        "image": "img/vv_card_labios.jpg"
      },
      {
        "index": "N.º 06",
        "name": "Pestañas y cejas",
        "tag": "Cuidado",
        "image": "img/vv_card_cejas.jpg"
      },
      {
        "index": "N.º 07",
        "name": "Codos y talones",
        "tag": "Piel áspera",
        "image": "img/vv_card_pies.jpg"
      }
    ],
    "focus": 2,
    "dur": 5.5
  },
  {
    "id": "fill_carousel_56",
    "start": 1045.28,
    "dur": 9.34,
    "kind": "talk"
  },
  {
    "id": "cut_amb7_1049",
    "start": 1049.48,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb7.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "full_57",
    "start": 1054.62,
    "kind": "full",
    "ken": "out",
    "src": "broll/vv_full_57.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_57",
    "start": 1059.62,
    "dur": 15.72,
    "kind": "talk"
  },
  {
    "id": "cut_amb8_1064",
    "start": 1063.82,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb8.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "carousel_58",
    "start": 1075.34,
    "kind": "carousel",
    "kicker": "Forma 4 · Cuello y escote",
    "cards": [
      {
        "index": "N.º 01",
        "name": "Contorno de ojos",
        "tag": "Arrugas finas",
        "image": "img/vv_card_ojos.jpg"
      },
      {
        "index": "N.º 02",
        "name": "Manos",
        "tag": "Manchas de edad",
        "image": "img/vv_card_manos.jpg"
      },
      {
        "index": "N.º 03",
        "name": "Surcos y boca",
        "tag": "Líneas marcadas",
        "image": "img/vv_card_surcos.jpg"
      },
      {
        "index": "N.º 04",
        "name": "Cuello y escote",
        "tag": "Firmeza",
        "image": "img/vv_card_cuello.jpg"
      },
      {
        "index": "N.º 05",
        "name": "Labios",
        "tag": "Hidratación",
        "image": "img/vv_card_labios.jpg"
      },
      {
        "index": "N.º 06",
        "name": "Pestañas y cejas",
        "tag": "Cuidado",
        "image": "img/vv_card_cejas.jpg"
      },
      {
        "index": "N.º 07",
        "name": "Codos y talones",
        "tag": "Piel áspera",
        "image": "img/vv_card_pies.jpg"
      }
    ],
    "focus": 3,
    "dur": 5.5
  },
  {
    "id": "fill_carousel_58",
    "start": 1080.84,
    "dur": 9.12,
    "kind": "talk"
  },
  {
    "id": "cut_amb9_1085",
    "start": 1085.04,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb9.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_59",
    "start": 1089.96,
    "kind": "full",
    "ken": "in",
    "src": "broll/vv_full_59.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_59",
    "start": 1094.96,
    "dur": 17.02,
    "kind": "talk"
  },
  {
    "id": "cut_amb10_1099",
    "start": 1099.16,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb10.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb11_1107",
    "start": 1106.76,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb11.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "carousel_60",
    "start": 1111.98,
    "kind": "carousel",
    "kicker": "Forma 5 · Labios",
    "cards": [
      {
        "index": "N.º 01",
        "name": "Contorno de ojos",
        "tag": "Arrugas finas",
        "image": "img/vv_card_ojos.jpg"
      },
      {
        "index": "N.º 02",
        "name": "Manos",
        "tag": "Manchas de edad",
        "image": "img/vv_card_manos.jpg"
      },
      {
        "index": "N.º 03",
        "name": "Surcos y boca",
        "tag": "Líneas marcadas",
        "image": "img/vv_card_surcos.jpg"
      },
      {
        "index": "N.º 04",
        "name": "Cuello y escote",
        "tag": "Firmeza",
        "image": "img/vv_card_cuello.jpg"
      },
      {
        "index": "N.º 05",
        "name": "Labios",
        "tag": "Hidratación",
        "image": "img/vv_card_labios.jpg"
      },
      {
        "index": "N.º 06",
        "name": "Pestañas y cejas",
        "tag": "Cuidado",
        "image": "img/vv_card_cejas.jpg"
      },
      {
        "index": "N.º 07",
        "name": "Codos y talones",
        "tag": "Piel áspera",
        "image": "img/vv_card_pies.jpg"
      }
    ],
    "focus": 4,
    "dur": 5.5
  },
  {
    "id": "fill_carousel_60",
    "start": 1117.48,
    "dur": 19.54,
    "kind": "talk"
  },
  {
    "id": "cut_amb12_1122",
    "start": 1121.68,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb12.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb13_1129",
    "start": 1129.28,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb13.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "carousel_61",
    "start": 1137.02,
    "kind": "carousel",
    "kicker": "Forma 6 · Pestañas y cejas",
    "cards": [
      {
        "index": "N.º 01",
        "name": "Contorno de ojos",
        "tag": "Arrugas finas",
        "image": "img/vv_card_ojos.jpg"
      },
      {
        "index": "N.º 02",
        "name": "Manos",
        "tag": "Manchas de edad",
        "image": "img/vv_card_manos.jpg"
      },
      {
        "index": "N.º 03",
        "name": "Surcos y boca",
        "tag": "Líneas marcadas",
        "image": "img/vv_card_surcos.jpg"
      },
      {
        "index": "N.º 04",
        "name": "Cuello y escote",
        "tag": "Firmeza",
        "image": "img/vv_card_cuello.jpg"
      },
      {
        "index": "N.º 05",
        "name": "Labios",
        "tag": "Hidratación",
        "image": "img/vv_card_labios.jpg"
      },
      {
        "index": "N.º 06",
        "name": "Pestañas y cejas",
        "tag": "Cuidado",
        "image": "img/vv_card_cejas.jpg"
      },
      {
        "index": "N.º 07",
        "name": "Codos y talones",
        "tag": "Piel áspera",
        "image": "img/vv_card_pies.jpg"
      }
    ],
    "focus": 5,
    "dur": 5.5
  },
  {
    "id": "fill_carousel_61",
    "start": 1142.52,
    "dur": 18.12,
    "kind": "talk"
  },
  {
    "id": "cut_amb14_1147",
    "start": 1146.72,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb14.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb15_1154",
    "start": 1154.32,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb15.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "carousel_62",
    "start": 1160.64,
    "kind": "carousel",
    "kicker": "Forma 7 · Codos y talones",
    "cards": [
      {
        "index": "N.º 01",
        "name": "Contorno de ojos",
        "tag": "Arrugas finas",
        "image": "img/vv_card_ojos.jpg"
      },
      {
        "index": "N.º 02",
        "name": "Manos",
        "tag": "Manchas de edad",
        "image": "img/vv_card_manos.jpg"
      },
      {
        "index": "N.º 03",
        "name": "Surcos y boca",
        "tag": "Líneas marcadas",
        "image": "img/vv_card_surcos.jpg"
      },
      {
        "index": "N.º 04",
        "name": "Cuello y escote",
        "tag": "Firmeza",
        "image": "img/vv_card_cuello.jpg"
      },
      {
        "index": "N.º 05",
        "name": "Labios",
        "tag": "Hidratación",
        "image": "img/vv_card_labios.jpg"
      },
      {
        "index": "N.º 06",
        "name": "Pestañas y cejas",
        "tag": "Cuidado",
        "image": "img/vv_card_cejas.jpg"
      },
      {
        "index": "N.º 07",
        "name": "Codos y talones",
        "tag": "Piel áspera",
        "image": "img/vv_card_pies.jpg"
      }
    ],
    "focus": 6,
    "dur": 5.5
  },
  {
    "id": "fill_carousel_62",
    "start": 1166.14,
    "dur": 6.86,
    "kind": "talk"
  },
  {
    "id": "full_63",
    "start": 1173,
    "kind": "full",
    "ken": "out",
    "src": "broll/vv_full_63.mp4",
    "video": true,
    "dur": 5
  },
  {
    "id": "fill_full_63",
    "start": 1178,
    "dur": 18.74,
    "kind": "talk"
  },
  {
    "id": "cut_amb16_1182",
    "start": 1182.2,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb16.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb17_1190",
    "start": 1189.8,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb17.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "talk_64",
    "start": 1196.74,
    "kind": "talk",
    "title": "Yo soy médica: no la dejo sin precauciones.",
    "hot": [
      "precauciones"
    ],
    "kicker": "Importante",
    "accent": "#B5643C",
    "dur": 4.46
  },
  {
    "id": "step_65",
    "start": 1201.2,
    "kind": "step",
    "step": 1,
    "total": 4,
    "title": "Prueba en el antebrazo",
    "hot": [
      "prueba"
    ],
    "sub": "Un poco en la cara interna del brazo. Espere 24 horas.",
    "image": "img/vv_ph_patchtest.jpg",
    "mood": "science",
    "dur": 6.5
  },
  {
    "id": "fill_step_65",
    "start": 1207.7,
    "dur": 8.08,
    "kind": "talk"
  },
  {
    "id": "step_66",
    "start": 1215.78,
    "kind": "step",
    "step": 2,
    "total": 4,
    "title": "Solo de noche",
    "hot": [
      "noche"
    ],
    "sub": "De día, su protector solar. Eso no se lo salta nadie.",
    "image": "img/vv_ph_night.jpg",
    "mood": "cool",
    "dur": 6.5
  },
  {
    "id": "fill_step_66",
    "start": 1222.28,
    "dur": 22.4,
    "kind": "talk"
  },
  {
    "id": "cut_amb18_1226",
    "start": 1226.48,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb18.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb19_1234",
    "start": 1234.08,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb19.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "step_67",
    "start": 1244.68,
    "kind": "step",
    "step": 3,
    "total": 4,
    "title": "Piel grasa o con acné",
    "hot": [
      "grasa"
    ],
    "sub": "En la cara, no. Resérvela para manos, cuello, codos y pies.",
    "image": "img/vv_ph_oilyskin.jpg",
    "mood": "warmdark",
    "dur": 6.5
  },
  {
    "id": "fill_step_67",
    "start": 1251.18,
    "dur": 23.34,
    "kind": "talk"
  },
  {
    "id": "cut_amb20_1255",
    "start": 1255.38,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb20.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "cut_amb21_1263",
    "start": 1262.98,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb21.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "step_68",
    "start": 1274.52,
    "kind": "step",
    "step": 4,
    "total": 4,
    "title": "Productos simples",
    "hot": [
      "simples"
    ],
    "sub": "Sin perfumes ni colorantes: son los que dan reacciones.",
    "image": "img/vv_ph_vaselinepure.jpg",
    "mood": "gold",
    "dur": 6.5
  },
  {
    "id": "fill_step_68",
    "start": 1281.02,
    "dur": 28.34,
    "kind": "talk"
  },
  {
    "id": "cut_amb22_1285",
    "start": 1285.22,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb22.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "cut_amb23_1293",
    "start": 1292.82,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb23.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb24_1300",
    "start": 1300.42,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb24.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "quote_69",
    "start": 1309.36,
    "kind": "quote",
    "kicker": "La verdad de fondo",
    "quote": "La piel no entiende de precios. Entiende de constancia.",
    "author": "Dra. Valeria Alcázar",
    "role": "Belleza vintage",
    "image": "img/vv_ph_calmwoman2.jpg",
    "mood": "warmdark",
    "dur": 6.5
  },
  {
    "id": "fill_quote_69",
    "start": 1315.86,
    "dur": 13.9,
    "kind": "talk"
  },
  {
    "id": "cut_amb1_1320",
    "start": 1320.06,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb1.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cut_amb2_1328",
    "start": 1327.66,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb2.mp4",
    "video": true,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "talk_71",
    "start": 1329.76,
    "kind": "talk",
    "title": "Esta misma noche: prepare su frasquito.",
    "hot": [
      "noche"
    ],
    "kicker": "Empiece hoy",
    "dur": 23.3
  },
  {
    "id": "cut_amb3_1335",
    "start": 1335.26,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb3.mp4",
    "video": true,
    "ken": "left",
    "variant": "whip"
  },
  {
    "id": "cut_amb4_1343",
    "start": 1342.86,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb4.mp4",
    "video": true,
    "ken": "right",
    "variant": "whip"
  },
  {
    "id": "hero_70",
    "start": 1353.06,
    "kind": "hero",
    "kicker": "No estaba en la crema cara",
    "title": "Estaba en el cajón de su baño",
    "hot": [
      "baño"
    ],
    "sub": "La juventud de la piel, por menos de dos euros.",
    "image": "img/vv_ph_jar3.jpg",
    "side": "right",
    "mood": "gold",
    "dur": 6.5
  },
  {
    "id": "fill_hero_70",
    "start": 1359.56,
    "dur": 4.62,
    "kind": "talk"
  },
  {
    "id": "cta_72",
    "start": 1364.18,
    "kind": "cta",
    "kicker": "Antes de irse",
    "title": "Guarde el video y suscríbase",
    "hot": [
      "Suscríbase"
    ],
    "sub": "Cada semana, otro secreto de belleza barato que sí funciona.",
    "buttonLabel": "Suscríbase al canal",
    "image": "img/vv_ph_calmwoman.jpg",
    "mood": "gold",
    "dur": 6.5
  },
  {
    "id": "fill_cta_72",
    "start": 1370.68,
    "dur": 10.44,
    "kind": "talk"
  },
  {
    "id": "cut_amb5_1375",
    "start": 1374.88,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vv_amb5.mp4",
    "video": true,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "talk_73",
    "start": 1381.12,
    "kind": "talk",
    "title": "Las medidas exactas están en la descripción.",
    "hot": [
      "descripción"
    ],
    "kicker": "Ahí abajo, gratis",
    "dur": 8.28
  },
  {
    "id": "talk_74",
    "start": 1389.4,
    "kind": "talk",
    "title": "Cuídese esa piel. Un abrazo, doctora Valeria.",
    "hot": [
      "abrazo"
    ],
    "kicker": "Nos vemos pronto",
    "dur": 3.18
  }
];
