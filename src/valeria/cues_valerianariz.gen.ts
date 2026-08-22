// cues_valerianariz.gen.ts — GENERADO por build_valerianariz.mjs. NO editar a mano.
export type Cue = {
  id: string; start: number; dur: number;
  kind: 'talk'|'full'|'chapter'|'hero'|'stat'|'quote'|'molecule'|'step'|'beforeafter'|'checklist'|'cta'|'carousel'|'lowerthird'|'qr';
  title?: string; kicker?: string; sub?: string; hot?: string[]; accent?: string; mood?: string; variant?: string;
  index?: string; side?: 'left'|'right';
  image?: string; imageA?: string; imageB?: string; labelA?: string; labelB?: string;
  src?: string; video?: boolean; caption?: string; ken?: 'in'|'out'|'left'|'right'; noSplit?: boolean;
  value?: number; suffix?: string; prefix?: string; decimals?: number; label?: string;
  quote?: string; author?: string; role?: string; centerLabel?: string; nodes?: {label: string}[];
  step?: number; total?: number; items?: string[]; buttonLabel?: string;
  name?: string; topic?: string; cards?: {image: string; index: string; name: string; tag?: string}[]; focus?: number; intro?: boolean;
};
export const TOTAL_FRAMES_VN = 57357;
export const AVATAR_END_F = 14554;
export const BEATS: Cue[] = [
  {
    "id": "talk_1",
    "start": 0,
    "dur": 6,
    "kind": "talk",
    "title": "Su nariz avisa años antes que su memoria",
    "hot": [
      "años antes"
    ],
    "kicker": "Dra. Valeria Alcázar"
  },
  {
    "id": "full_b001",
    "start": 7.66,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b001.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "tail_b001",
    "start": 11.7,
    "dur": 3.44,
    "kind": "full",
    "src": "img/vn_b001.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b003",
    "start": 19.38,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b003.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b003",
    "start": 23.42,
    "dur": 3.34,
    "kind": "full",
    "src": "img/vn_b003.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b004",
    "start": 26.76,
    "dur": 3.76,
    "kind": "full",
    "src": "img/vn_b004.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b006",
    "start": 37.5,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b006.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b006",
    "start": 41.54,
    "dur": 1.64,
    "kind": "full",
    "src": "img/vn_b006.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b007",
    "start": 43.18,
    "dur": 3.24,
    "kind": "full",
    "src": "broll/vn_b007.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "full_b009",
    "start": 53.84,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b009.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "full_b010",
    "start": 58.5,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b010.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b010",
    "start": 62.54,
    "dur": 3.54,
    "kind": "full",
    "src": "img/vn_b010.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b012",
    "start": 71.6,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b012.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "hero_2",
    "start": 78.96,
    "dur": 6.5,
    "kind": "hero",
    "kicker": "Lo importante",
    "title": "Lo que falló esa mañana no fue la cabeza",
    "sub": "Se acordaba del paquete, del laurel y del fuego al dos",
    "image": "img/vn_b014.jpg",
    "mood": "terracotta"
  },
  {
    "id": "full_b015",
    "start": 86.2,
    "dur": 5.56,
    "kind": "full",
    "src": "img/vn_b015.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "full_b016",
    "start": 91.76,
    "dur": 5.86,
    "kind": "full",
    "src": "img/vn_b016.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "hero_3",
    "start": 102.78,
    "dur": 6,
    "kind": "hero",
    "kicker": "El fallo",
    "title": "Era su nariz",
    "hot": [
      "nariz"
    ],
    "sub": "Cuarenta minutos a cuatro metros del humo",
    "image": "img/vn_b010.jpg",
    "side": "right",
    "mood": "terracotta"
  },
  {
    "id": "full_b021",
    "start": 120.02,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b021.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "tail_b021",
    "start": 124.06,
    "dur": 0.86,
    "kind": "full",
    "src": "img/vn_b021.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b022",
    "start": 124.92,
    "dur": 3.3,
    "kind": "full",
    "src": "broll/vn_b022.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "quote_4",
    "start": 131.1,
    "dur": 6.5,
    "kind": "quote",
    "quote": "Un silencio al otro lado del teléfono que vale más que un análisis entero.",
    "author": "La llamada de su hija"
  },
  {
    "id": "full_b025",
    "start": 139.3,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b025.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "full_b027",
    "start": 148.16,
    "dur": 3.54,
    "kind": "full",
    "src": "broll/vn_b027.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "hero_5",
    "start": 154.52,
    "dur": 6.5,
    "kind": "hero",
    "kicker": "El detalle",
    "title": "La familia sabe la fecha exacta",
    "sub": "Está grabada en un vídeo del móvil",
    "image": "img/vn_b029.jpg",
    "mood": "gold"
  },
  {
    "id": "chapter_6",
    "start": 163.72,
    "dur": 6.5,
    "kind": "chapter",
    "kicker": "Tres años antes",
    "index": "La escena",
    "title": "Una comida de Navidad",
    "sub": "Lo vieron once personas y no lo entendió ninguna"
  },
  {
    "id": "full_b033",
    "start": 174.76,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b033.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "full_b034",
    "start": 179.48,
    "dur": 3.1,
    "kind": "full",
    "src": "broll/vn_b034.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "lowerthird_7",
    "start": 182.58,
    "dur": 6,
    "kind": "lowerthird",
    "name": "Dra. Valeria Alcázar",
    "role": "Medicina estética · el cuerpo a partir de los 50",
    "topic": "La nariz y la memoria"
  },
  {
    "id": "full_b036",
    "start": 190.36,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b036.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "tail_b036",
    "start": 194.4,
    "dur": 2.28,
    "kind": "full",
    "src": "img/vn_b036.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b037",
    "start": 196.68,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b037.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "tail_b037",
    "start": 200.72,
    "dur": 0.76,
    "kind": "full",
    "src": "img/vn_b037.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b039",
    "start": 204.74,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vn_b039.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "full_b040",
    "start": 208.44,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b040.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "tail_b040",
    "start": 212.48,
    "dur": 3.16,
    "kind": "full",
    "src": "img/vn_b040.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "chapter_8",
    "start": 216.66,
    "dur": 6.5,
    "kind": "chapter",
    "kicker": "Lo que viene",
    "index": "Las 5",
    "title": "Las cinco señales que da la nariz",
    "sub": "Y una sexta que decide si las otras sirven"
  },
  {
    "id": "full_b043",
    "start": 224.44,
    "dur": 2.86,
    "kind": "full",
    "src": "broll/vn_b043.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "full_b045",
    "start": 232.08,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b045.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "tail_b045",
    "start": 236.12,
    "dur": 2.62,
    "kind": "full",
    "src": "img/vn_b045.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b046",
    "start": 238.74,
    "dur": 3.98,
    "kind": "full",
    "src": "broll/vn_b046.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "full_b048",
    "start": 248.2,
    "dur": 2.72,
    "kind": "full",
    "src": "img/vn_b048.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "quote_9",
    "start": 250.92,
    "dur": 7,
    "kind": "quote",
    "quote": "Lo que avisa no es cuánto huele usted. Es la distancia entre lo que cree que huele y lo que huele de verdad.",
    "author": "Dra. Valeria Alcázar"
  },
  {
    "id": "stat_10",
    "start": 258.86,
    "dur": 6,
    "kind": "stat",
    "value": 2,
    "label": "Números en un papel",
    "sub": "Y lo único que importa es la resta entre los dos",
    "mood": "gold",
    "image": "img/vn_b050.jpg"
  },
  {
    "id": "full_b054",
    "start": 274.1,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b054.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b054",
    "start": 278.14,
    "dur": 3.22,
    "kind": "full",
    "src": "img/vn_b054.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b055",
    "start": 281.36,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b055.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b055",
    "start": 285.4,
    "dur": 3.2,
    "kind": "full",
    "src": "img/vn_b055.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "beforeafter_11",
    "start": 295.44,
    "dur": 6.5,
    "kind": "beforeafter",
    "kicker": "Por qué la nariz",
    "title": "El único sentido que no hace escala",
    "labelA": "Vista, oído y tacto pasan por la centralita",
    "labelB": "El olfato entra directo",
    "imageA": "img/vn_b059.jpg",
    "imageB": "img/vn_b060.jpg"
  },
  {
    "id": "full_b060",
    "start": 306.14,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b060.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "tail_b060",
    "start": 310.18,
    "dur": 3.48,
    "kind": "full",
    "src": "img/vn_b060.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "molecule_12",
    "start": 313.66,
    "dur": 7,
    "kind": "molecule",
    "centerLabel": "Bulbo olfatorio",
    "nodes": [
      {
        "label": "Amígdala"
      },
      {
        "label": "Hipocampo"
      },
      {
        "label": "Corteza"
      },
      {
        "label": "Emoción"
      }
    ],
    "title": "Aterriza en la zona más antigua del cerebro",
    "sub": "Pegado a donde se fabrica la memoria"
  },
  {
    "id": "full_b063",
    "start": 327.9,
    "dur": 3.64,
    "kind": "full",
    "src": "broll/vn_b063.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "quote_13",
    "start": 331.54,
    "dur": 6,
    "kind": "quote",
    "quote": "Eso no es sentimentalismo. Es fontanería: están cableados juntos.",
    "author": "Dra. Valeria Alcázar"
  },
  {
    "id": "full_b066",
    "start": 338.42,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b066.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b066",
    "start": 342.46,
    "dur": 1.84,
    "kind": "full",
    "src": "img/vn_b066.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b067",
    "start": 344.3,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b067.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b067",
    "start": 348.34,
    "dur": 3.56,
    "kind": "full",
    "src": "img/vn_b067.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "hero_14",
    "start": 362.02,
    "dur": 6.5,
    "kind": "hero",
    "kicker": "El orden",
    "title": "El incendio empieza en el cuarto de al lado",
    "hot": [
      "al lado"
    ],
    "sub": "Por eso la nariz se entera antes que la memoria",
    "image": "img/vn_b069.jpg",
    "mood": "terracotta"
  },
  {
    "id": "full_b072",
    "start": 380.98,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b072.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "stat_15",
    "start": 388.48,
    "dur": 6.5,
    "kind": "stat",
    "value": 10,
    "suffix": " años",
    "label": "Antes de que aparezca ningún problema de memoria",
    "sub": "Es lo que ven algunos estudios de seguimiento",
    "mood": "gold",
    "image": "img/vn_b073.jpg"
  },
  {
    "id": "full_b075",
    "start": 396.04,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b075.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b075",
    "start": 400.08,
    "dur": 3.44,
    "kind": "full",
    "src": "img/vn_b075.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b076",
    "start": 403.52,
    "dur": 2.62,
    "kind": "full",
    "src": "broll/vn_b076.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "hero_16",
    "start": 406.14,
    "dur": 7,
    "kind": "hero",
    "kicker": "Léalo antes de seguir",
    "title": "Perder olfato no significa tener alzhéimer",
    "hot": [
      "no significa"
    ],
    "sub": "La inmensa mayoría no lo va a desarrollar jamás",
    "image": "img/vn_b078.jpg",
    "mood": "sage"
  },
  {
    "id": "checklist_17",
    "start": 414.42,
    "dur": 6.5,
    "kind": "checklist",
    "kicker": "Antes de asustarse",
    "title": "Esto no es un diagnóstico",
    "items": [
      "Es un aviso para ir a que la miren",
      "La mayoría de las causas son otras",
      "Y muchas de ellas se arreglan"
    ],
    "mood": "sage"
  },
  {
    "id": "full_b081",
    "start": 423.38,
    "dur": 3.6,
    "kind": "full",
    "src": "broll/vn_b081.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "full_b082",
    "start": 426.98,
    "dur": 3.7,
    "kind": "full",
    "src": "broll/vn_b082.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "full_b084",
    "start": 435.7,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b084.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "tail_b084",
    "start": 439.74,
    "dur": 3.76,
    "kind": "full",
    "src": "img/vn_b084.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "chapter_18",
    "start": 445.78,
    "dur": 6.5,
    "kind": "chapter",
    "kicker": "Señal",
    "index": "01",
    "title": "No huele menos: confunde",
    "sub": "La que todo el mundo conoce es la que menos vale"
  },
  {
    "id": "beforeafter_19",
    "start": 454.8,
    "dur": 6.5,
    "kind": "beforeafter",
    "kicker": "Dos cosas distintas",
    "title": "Detectar no es identificar",
    "labelA": "Detectar: saber que hay algo",
    "labelB": "Identificar: saber qué es",
    "imageA": "img/vn_b089.jpg",
    "imageB": "img/vn_b090.jpg"
  },
  {
    "id": "full_b090",
    "start": 465.32,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b090.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b090",
    "start": 469.36,
    "dur": 1.72,
    "kind": "full",
    "src": "img/vn_b090.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "molecule_20",
    "start": 473.08,
    "dur": 7,
    "kind": "molecule",
    "centerLabel": "Identificar",
    "nodes": [
      {
        "label": "Nariz"
      },
      {
        "label": "Archivo"
      },
      {
        "label": "Corteza"
      },
      {
        "label": "La palabra"
      }
    ],
    "title": "Detectar es la nariz. Identificar es el cerebro.",
    "sub": "Quien abre el archivo y devuelve la palabra es la corteza"
  },
  {
    "id": "full_b093",
    "start": 483.84,
    "dur": 1.28,
    "kind": "full",
    "src": "broll/vn_b093.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "full_b093_seam",
    "start": 485.12,
    "dur": 2.76,
    "kind": "full",
    "src": "broll/vn_b093.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "tail_b093",
    "start": 487.88,
    "dur": 1.14,
    "kind": "full",
    "src": "img/vn_b093.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b094",
    "start": 489.02,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b094.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b094",
    "start": 493.06,
    "dur": 0.82,
    "kind": "full",
    "src": "img/vn_b094.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b095",
    "start": 493.88,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b095.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b095",
    "start": 497.92,
    "dur": 2.54,
    "kind": "full",
    "src": "img/vn_b095.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b096",
    "start": 500.46,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b096.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "tail_b096",
    "start": 504.5,
    "dur": 2.52,
    "kind": "full",
    "src": "img/vn_b096.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b097",
    "start": 507.02,
    "dur": 3.06,
    "kind": "full",
    "src": "broll/vn_b097.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "full_b098",
    "start": 510.08,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b098.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b098",
    "start": 514.12,
    "dur": 3.44,
    "kind": "full",
    "src": "img/vn_b098.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "gap_b099_518",
    "start": 517.56,
    "dur": 4.2,
    "kind": "full",
    "src": "img/vn_b099.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "gap_b100_522",
    "start": 521.76,
    "dur": 0.44,
    "kind": "full",
    "src": "img/vn_b100.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "beforeafter_21",
    "start": 522.2,
    "dur": 6.5,
    "kind": "beforeafter",
    "kicker": "El caso",
    "title": "Lo que había y lo que dijo",
    "labelA": "En el frasco: café molido",
    "labelB": "Ella dijo: chocolate",
    "imageA": "img/vn_b099.jpg",
    "imageB": "img/vn_b100.jpg"
  },
  {
    "id": "gap_b101_529",
    "start": 528.7,
    "dur": 0.74,
    "kind": "full",
    "src": "img/vn_b101.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b101",
    "start": 529.44,
    "dur": 3.68,
    "kind": "full",
    "src": "broll/vn_b101.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "full_b102",
    "start": 533.12,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b102.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b102",
    "start": 537.16,
    "dur": 2.68,
    "kind": "full",
    "src": "img/vn_b102.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b103",
    "start": 539.84,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b103.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "gap_b104_544",
    "start": 543.88,
    "dur": 2.58,
    "kind": "full",
    "src": "img/vn_b104.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "quote_22",
    "start": 546.46,
    "dur": 6,
    "kind": "quote",
    "quote": "No se pregunte cuánto huele. Pregúntese si acierta.",
    "author": "La regla de la señal 1"
  },
  {
    "id": "chapter_23",
    "start": 548.06,
    "dur": 6.5,
    "kind": "chapter",
    "kicker": "Señal",
    "index": "02",
    "title": "La comida ha dejado de saber",
    "sub": "Y en la mesa aparecen la sal y el azúcar"
  },
  {
    "id": "gap_b106_555",
    "start": 554.56,
    "dur": 2.66,
    "kind": "full",
    "src": "img/vn_b106.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b107",
    "start": 557.22,
    "dur": 3.88,
    "kind": "full",
    "src": "broll/vn_b107.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "full_b108",
    "start": 561.1,
    "dur": 3,
    "kind": "full",
    "src": "img/vn_b108.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "checklist_24",
    "start": 564.1,
    "dur": 6.5,
    "kind": "checklist",
    "kicker": "La lengua",
    "title": "Su lengua solo distingue cinco cosas",
    "items": [
      "Dulce",
      "Salado",
      "Ácido",
      "Amargo",
      "El fondo sabroso del caldo"
    ],
    "mood": "gold"
  },
  {
    "id": "gap_b110_571",
    "start": 570.6,
    "dur": 2,
    "kind": "full",
    "src": "img/vn_b110.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b111",
    "start": 572.6,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b111.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b111",
    "start": 576.64,
    "dur": 1.08,
    "kind": "full",
    "src": "img/vn_b111.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b112",
    "start": 577.72,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b112.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "tail_b112",
    "start": 581.76,
    "dur": 1.16,
    "kind": "full",
    "src": "img/vn_b112.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b113",
    "start": 582.92,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b113.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "gap_b114_587",
    "start": 586.96,
    "dur": 0.38,
    "kind": "full",
    "src": "img/vn_b114.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b114",
    "start": 587.34,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b114.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b114",
    "start": 591.38,
    "dur": 0.96,
    "kind": "full",
    "src": "img/vn_b114.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "gap_b115_592",
    "start": 592.34,
    "dur": 1.32,
    "kind": "full",
    "src": "img/vn_b115.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "checklist_25",
    "start": 593.66,
    "dur": 7,
    "kind": "checklist",
    "kicker": "Lo que dice en su lugar",
    "title": "Nadie dice “he perdido el olfato”",
    "items": [
      "La fruta ya no sabe como antes",
      "La carne está sosa",
      "El tomate no sabe a tomate",
      "Tú no cocinas como cocinaba yo"
    ],
    "mood": "terracotta"
  },
  {
    "id": "gap_b117_601",
    "start": 600.66,
    "dur": 2.76,
    "kind": "full",
    "src": "img/vn_b117.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b117",
    "start": 603.42,
    "dur": 3.48,
    "kind": "full",
    "src": "broll/vn_b117.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "full_b118",
    "start": 606.9,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b118.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b118",
    "start": 610.94,
    "dur": 0.72,
    "kind": "full",
    "src": "img/vn_b118.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b119",
    "start": 611.66,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b119.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b119",
    "start": 615.7,
    "dur": 1.08,
    "kind": "full",
    "src": "img/vn_b119.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b120",
    "start": 616.78,
    "dur": 2.84,
    "kind": "full",
    "src": "broll/vn_b120.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "gap_b121_620",
    "start": 619.62,
    "dur": 2.5,
    "kind": "full",
    "src": "img/vn_b121.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "hero_26",
    "start": 622.12,
    "dur": 6.5,
    "kind": "hero",
    "kicker": "Lo peligroso",
    "title": "No pierde el apetito: pierde el placer",
    "hot": [
      "el placer"
    ],
    "sub": "Y lo sustituye por sal y por azúcar",
    "image": "img/vn_b118.jpg",
    "mood": "terracotta"
  },
  {
    "id": "gap_b123_629",
    "start": 628.62,
    "dur": 4.2,
    "kind": "full",
    "src": "img/vn_b123.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "gap_b123_633",
    "start": 632.82,
    "dur": 0.8,
    "kind": "full",
    "src": "img/vn_b123.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "chapter_27",
    "start": 633.62,
    "dur": 6.5,
    "kind": "chapter",
    "kicker": "La escena",
    "index": "Navidad",
    "title": "El asado que era su firma",
    "sub": "Once personas lo esperaban todo el año"
  },
  {
    "id": "gap_b125_640",
    "start": 640.12,
    "dur": 2,
    "kind": "full",
    "src": "img/vn_b125.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b125",
    "start": 642.12,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b125.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "tail_b125",
    "start": 646.16,
    "dur": 1.68,
    "kind": "full",
    "src": "img/vn_b125.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b126",
    "start": 647.84,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b126.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b126",
    "start": 651.88,
    "dur": 1.98,
    "kind": "full",
    "src": "img/vn_b126.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b127",
    "start": 653.86,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b127.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b127",
    "start": 657.9,
    "dur": 1.86,
    "kind": "full",
    "src": "img/vn_b127.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "gap_b128_660",
    "start": 659.76,
    "dur": 0.24,
    "kind": "full",
    "src": "img/vn_b128.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "stat_28",
    "start": 660,
    "dur": 6.5,
    "kind": "stat",
    "value": 3,
    "prefix": "×",
    "label": "La sal que acabó echándole al asado",
    "sub": "Ella lo probó y dijo, en voz alta, que estaba soso",
    "mood": "terracotta",
    "image": "img/vn_b127.jpg"
  },
  {
    "id": "quote_29",
    "start": 666.32,
    "dur": 7,
    "kind": "quote",
    "quote": "Estaban oyendo el aviso más temprano que existe, y sonaba como una anécdota de abuela.",
    "author": "La mesa de Navidad"
  },
  {
    "id": "gap_b130_673",
    "start": 673.32,
    "dur": 2.78,
    "kind": "full",
    "src": "img/vn_b130.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b131",
    "start": 676.1,
    "dur": 3.3,
    "kind": "full",
    "src": "broll/vn_b131.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "full_b132",
    "start": 679.4,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b132.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "gap_b133_683",
    "start": 683.44,
    "dur": 0.7,
    "kind": "full",
    "src": "img/vn_b133.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b133",
    "start": 684.14,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b133.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "gap_b134_688",
    "start": 688.18,
    "dur": 0.6,
    "kind": "full",
    "src": "img/vn_b134.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b134",
    "start": 688.78,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b134.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b134",
    "start": 692.82,
    "dur": 1.86,
    "kind": "full",
    "src": "img/vn_b134.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b135",
    "start": 694.68,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b135.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "gap_b136_699",
    "start": 698.72,
    "dur": 0.48,
    "kind": "full",
    "src": "img/vn_b136.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b136",
    "start": 699.2,
    "dur": 3.5,
    "kind": "full",
    "src": "broll/vn_b136.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "full_b137",
    "start": 702.7,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b137.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "gap_b138_707",
    "start": 706.74,
    "dur": 0.42,
    "kind": "full",
    "src": "img/vn_b138.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b138",
    "start": 707.16,
    "dur": 3.1,
    "kind": "full",
    "src": "broll/vn_b138.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "hero_30",
    "start": 710.26,
    "dur": 7,
    "kind": "hero",
    "kicker": "La explicación fácil",
    "title": "Todos pensaron que era la pena",
    "sub": "El marido había muerto tres meses antes. Nadie pensó en la nariz.",
    "image": "img/vn_b134.jpg",
    "side": "right",
    "mood": "terracotta"
  },
  {
    "id": "gap_b141_717",
    "start": 717.26,
    "dur": 1.2,
    "kind": "full",
    "src": "img/vn_b141.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b141",
    "start": 718.46,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b141.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "gap_b142_723",
    "start": 722.5,
    "dur": 0.46,
    "kind": "full",
    "src": "img/vn_b142.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b142",
    "start": 722.96,
    "dur": 3.92,
    "kind": "full",
    "src": "broll/vn_b142.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "checklist_31",
    "start": 726.88,
    "dur": 6.5,
    "kind": "checklist",
    "kicker": "En su familia",
    "title": "Las dos preguntas que sí sirven",
    "items": [
      "¿Hace cuánto que no te gusta una comida?",
      "¿Le estás echando más sal que antes?"
    ],
    "mood": "sage"
  },
  {
    "id": "gap_b145_733",
    "start": 733.38,
    "dur": 0.66,
    "kind": "full",
    "src": "img/vn_b145.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b145",
    "start": 734.04,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b145.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "tail_b145",
    "start": 738.08,
    "dur": 1.8,
    "kind": "full",
    "src": "img/vn_b145.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "gap_b146_740",
    "start": 739.88,
    "dur": 1.74,
    "kind": "full",
    "src": "img/vn_b146.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "chapter_32",
    "start": 741.62,
    "dur": 6.5,
    "kind": "chapter",
    "kicker": "Señal",
    "index": "03",
    "title": "Olores que no están",
    "sub": "O los que están, deformados"
  },
  {
    "id": "gap_b148_748",
    "start": 748.12,
    "dur": 2.6,
    "kind": "full",
    "src": "img/vn_b148.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b149",
    "start": 750.72,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b149.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "gap_b150_755",
    "start": 754.76,
    "dur": 0.36,
    "kind": "full",
    "src": "img/vn_b150.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b150",
    "start": 755.12,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b150.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b150",
    "start": 759.16,
    "dur": 3.22,
    "kind": "full",
    "src": "img/vn_b150.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b151",
    "start": 762.38,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b151.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b151",
    "start": 766.42,
    "dur": 1.52,
    "kind": "full",
    "src": "img/vn_b151.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "hero_33",
    "start": 767.94,
    "dur": 6.5,
    "kind": "hero",
    "kicker": "El primero",
    "title": "Un olor fantasma",
    "sub": "Busca de dónde viene por toda la casa y no viene de ningún sitio",
    "image": "img/vn_b151.jpg",
    "mood": "terracotta"
  },
  {
    "id": "gap_b153_774",
    "start": 774.44,
    "dur": 0.8,
    "kind": "full",
    "src": "img/vn_b153.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b153",
    "start": 775.24,
    "dur": 3.74,
    "kind": "full",
    "src": "broll/vn_b153.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "full_b154",
    "start": 778.98,
    "dur": 3.56,
    "kind": "full",
    "src": "broll/vn_b154.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "beforeafter_34",
    "start": 782.54,
    "dur": 6.5,
    "kind": "beforeafter",
    "kicker": "El segundo",
    "title": "El olor llega deformado",
    "labelA": "El café huele a gasolina",
    "labelB": "La colonia de siempre da asco",
    "imageA": "img/vn_b154.jpg",
    "imageB": "img/vn_b156.jpg"
  },
  {
    "id": "gap_b157_789",
    "start": 789.04,
    "dur": 1.64,
    "kind": "full",
    "src": "img/vn_b157.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b157",
    "start": 790.68,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b157.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "tail_b157",
    "start": 794.72,
    "dur": 3.32,
    "kind": "full",
    "src": "img/vn_b157.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b158",
    "start": 798.04,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b158.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b158",
    "start": 802.08,
    "dur": 3.32,
    "kind": "full",
    "src": "img/vn_b158.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "gap_b159_805",
    "start": 805.4,
    "dur": 3.44,
    "kind": "full",
    "src": "img/vn_b159.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "molecule_35",
    "start": 808.84,
    "dur": 6.5,
    "kind": "molecule",
    "centerLabel": "Se regenera",
    "nodes": [
      {
        "label": "Virus"
      },
      {
        "label": "Neuronas"
      },
      {
        "label": "Mal conectadas"
      },
      {
        "label": "Mejora"
      }
    ],
    "title": "Después de un virus suele ser buena señal",
    "sub": "Como un teléfono que se repara y cruza las líneas"
  },
  {
    "id": "gap_b161_815",
    "start": 815.34,
    "dur": 0.3,
    "kind": "full",
    "src": "img/vn_b161.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b161",
    "start": 815.64,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b161.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "tail_b161",
    "start": 819.68,
    "dur": 2.86,
    "kind": "full",
    "src": "img/vn_b161.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b162",
    "start": 822.54,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b162.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "gap_b163_827",
    "start": 826.58,
    "dur": 0.24,
    "kind": "full",
    "src": "img/vn_b163.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "hero_36",
    "start": 826.82,
    "dur": 7,
    "kind": "hero",
    "kicker": "Esto sí, pronto",
    "title": "De golpe, siempre el mismo, en episodios cortos",
    "sub": "Sobre todo si además pierde el hilo unos segundos: consúltelo pronto",
    "image": "img/vn_b164.jpg",
    "mood": "terracotta"
  },
  {
    "id": "gap_b164_834",
    "start": 833.82,
    "dur": 3.86,
    "kind": "full",
    "src": "img/vn_b164.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b165",
    "start": 837.68,
    "dur": 3.22,
    "kind": "full",
    "src": "broll/vn_b165.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "full_b166",
    "start": 840.9,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b166.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b166",
    "start": 844.94,
    "dur": 1.84,
    "kind": "full",
    "src": "img/vn_b166.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b167",
    "start": 846.78,
    "dur": 3.78,
    "kind": "full",
    "src": "broll/vn_b167.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "chapter_37",
    "start": 850.56,
    "dur": 6.5,
    "kind": "chapter",
    "kicker": "Señal",
    "index": "04",
    "title": "No lo sabe",
    "sub": "Se lo tienen que decir los demás"
  },
  {
    "id": "gap_b169_857",
    "start": 857.06,
    "dur": 2.24,
    "kind": "full",
    "src": "img/vn_b169.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b170",
    "start": 859.3,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b170.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "full_b171",
    "start": 863.44,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b171.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b171",
    "start": 867.48,
    "dur": 3.56,
    "kind": "full",
    "src": "img/vn_b171.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b172",
    "start": 871.04,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b172.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "tail_b172",
    "start": 875.08,
    "dur": 1.48,
    "kind": "full",
    "src": "img/vn_b172.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b173",
    "start": 876.56,
    "dur": 3.8,
    "kind": "full",
    "src": "broll/vn_b173.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "quote_38",
    "start": 880.36,
    "dur": 6,
    "kind": "quote",
    "quote": "Bien, doctora. Normal. Yo huelo bien.",
    "author": "Carmen, semanas después del incendio"
  },
  {
    "id": "gap_b175_886",
    "start": 886.36,
    "dur": 4.2,
    "kind": "full",
    "src": "img/vn_b175.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "gap_b176_891",
    "start": 890.56,
    "dur": 2,
    "kind": "full",
    "src": "img/vn_b176.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "hero_39",
    "start": 892.56,
    "dur": 6.5,
    "kind": "hero",
    "kicker": "Por qué no se nota",
    "title": "Se apaga como la luz al atardecer",
    "hot": [
      "al atardecer"
    ],
    "sub": "Sin un momento concreto, y el cerebro baja el listón cada día",
    "image": "img/vn_b177.jpg",
    "mood": "gold"
  },
  {
    "id": "gap_b178_899",
    "start": 899.06,
    "dur": 2.6,
    "kind": "full",
    "src": "img/vn_b178.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b178",
    "start": 901.66,
    "dur": 3.82,
    "kind": "full",
    "src": "broll/vn_b178.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "full_b179",
    "start": 905.48,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b179.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b179",
    "start": 909.52,
    "dur": 3.04,
    "kind": "full",
    "src": "img/vn_b179.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "gap_b180_913",
    "start": 912.56,
    "dur": 4.16,
    "kind": "full",
    "src": "img/vn_b180.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "molecule_40",
    "start": 916.72,
    "dur": 7,
    "kind": "molecule",
    "centerLabel": "El cerebro rellena",
    "nodes": [
      {
        "label": "Los ojos"
      },
      {
        "label": "La memoria"
      },
      {
        "label": "Lo esperado"
      },
      {
        "label": "La respuesta"
      }
    ],
    "title": "Ve una naranja y “huele” naranja",
    "sub": "Aunque la nariz esté transmitiendo poquísimo"
  },
  {
    "id": "gap_b182_924",
    "start": 923.72,
    "dur": 1.9,
    "kind": "full",
    "src": "img/vn_b182.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b183",
    "start": 925.62,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b183.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b183",
    "start": 929.66,
    "dur": 3.16,
    "kind": "full",
    "src": "img/vn_b183.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b184",
    "start": 932.82,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b184.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "tail_b184",
    "start": 936.86,
    "dur": 1.98,
    "kind": "full",
    "src": "img/vn_b184.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b185",
    "start": 938.84,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b185.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "gap_b186_943",
    "start": 942.88,
    "dur": 1.52,
    "kind": "full",
    "src": "img/vn_b186.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "quote_41",
    "start": 944.4,
    "dur": 6,
    "kind": "quote",
    "quote": "No mintió. Le mintieron a ella desde dentro.",
    "author": "El frasco de perfume"
  },
  {
    "id": "gap_b188_950",
    "start": 950.4,
    "dur": 2.46,
    "kind": "full",
    "src": "img/vn_b188.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b188",
    "start": 952.86,
    "dur": 3.04,
    "kind": "full",
    "src": "broll/vn_b188.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "full_b189",
    "start": 955.9,
    "dur": 7.24,
    "kind": "full",
    "src": "img/vn_b189.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b190",
    "start": 963.14,
    "dur": 3.62,
    "kind": "full",
    "src": "broll/vn_b190.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "gap_b191_967",
    "start": 966.76,
    "dur": 2.48,
    "kind": "full",
    "src": "img/vn_b191.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "checklist_42",
    "start": 969.24,
    "dur": 6.5,
    "kind": "checklist",
    "kicker": "Si vive sola",
    "title": "Tres cosas que hay que sacar de la nariz",
    "items": [
      "El detector de humo",
      "El detector de gas",
      "La fecha de caducidad"
    ],
    "mood": "terracotta"
  },
  {
    "id": "gap_b193_976",
    "start": 975.74,
    "dur": 3.52,
    "kind": "full",
    "src": "img/vn_b193.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "step_43",
    "start": 979.26,
    "dur": 5.5,
    "kind": "step",
    "step": 1,
    "total": 3,
    "title": "Un detector con pila en el pasillo",
    "sub": "Y comprobarlo de vez en cuando",
    "image": "img/vn_b191.jpg"
  },
  {
    "id": "step_44",
    "start": 981.92,
    "dur": 5.5,
    "kind": "step",
    "step": 2,
    "total": 3,
    "title": "Mirar la fecha, no olfatear el táper",
    "sub": "La vista decide, no la nariz",
    "image": "img/vn_b193.jpg"
  },
  {
    "id": "step_45",
    "start": 985.38,
    "dur": 5.5,
    "kind": "step",
    "step": 3,
    "total": 3,
    "title": "Revisión al día y nunca el fuego solo",
    "sub": "La cocina no se deja sola ni un momento",
    "image": "img/vn_b195.jpg"
  },
  {
    "id": "gap_b196_991",
    "start": 990.88,
    "dur": 3.98,
    "kind": "full",
    "src": "img/vn_b196.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b197",
    "start": 994.86,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b197.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "tail_b197",
    "start": 998.9,
    "dur": 1.04,
    "kind": "full",
    "src": "img/vn_b197.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b198",
    "start": 999.94,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b198.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "gap_b199_1004",
    "start": 1003.98,
    "dur": 0.14,
    "kind": "full",
    "src": "img/vn_b199.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "chapter_46",
    "start": 1004.12,
    "dur": 6.5,
    "kind": "chapter",
    "kicker": "Señal",
    "index": "05",
    "title": "Años, y sin resfriado",
    "sub": "La que separa el ruido de la información"
  },
  {
    "id": "gap_b200_1011",
    "start": 1010.62,
    "dur": 3.88,
    "kind": "full",
    "src": "img/vn_b200.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b201",
    "start": 1014.5,
    "dur": 3.32,
    "kind": "full",
    "src": "broll/vn_b201.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "beforeafter_47",
    "start": 1017.82,
    "dur": 6.5,
    "kind": "beforeafter",
    "kicker": "Dos dibujos",
    "title": "El que no preocupa y el que sí",
    "labelA": "Va y viene con el catarro y la alergia",
    "labelB": "Cuesta abajo, años, sin excusa",
    "imageA": "img/vn_b203.jpg",
    "imageB": "img/vn_b205.jpg"
  },
  {
    "id": "gap_b203_1024",
    "start": 1024.32,
    "dur": 1.82,
    "kind": "full",
    "src": "img/vn_b203.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b204",
    "start": 1026.14,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b204.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "tail_b204",
    "start": 1030.18,
    "dur": 0.82,
    "kind": "full",
    "src": "img/vn_b204.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b205",
    "start": 1031,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b205.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "tail_b205",
    "start": 1035.04,
    "dur": 1.22,
    "kind": "full",
    "src": "img/vn_b205.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b206",
    "start": 1036.26,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b206.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b206",
    "start": 1040.3,
    "dur": 1.22,
    "kind": "full",
    "src": "img/vn_b206.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b207",
    "start": 1041.52,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b207.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "gap_b208_1046",
    "start": 1045.56,
    "dur": 0.52,
    "kind": "full",
    "src": "img/vn_b208.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b208",
    "start": 1046.08,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b208.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "tail_b208",
    "start": 1050.12,
    "dur": 0.78,
    "kind": "full",
    "src": "img/vn_b208.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "stat_48",
    "start": 1050.9,
    "dur": 6.5,
    "kind": "stat",
    "value": 5,
    "suffix": " años",
    "label": "Bajando un poco cada año, sin altibajos",
    "sub": "Ese dibujo es el que se parece al de los estudios",
    "mood": "terracotta",
    "image": "img/vn_b209.jpg"
  },
  {
    "id": "gap_b210_1057",
    "start": 1057.4,
    "dur": 3.96,
    "kind": "full",
    "src": "img/vn_b210.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b211",
    "start": 1061.36,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b211.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b211",
    "start": 1065.4,
    "dur": 1.44,
    "kind": "full",
    "src": "img/vn_b211.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "gap_b212_1067",
    "start": 1066.84,
    "dur": 2.14,
    "kind": "full",
    "src": "img/vn_b212.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "beforeafter_49",
    "start": 1068.98,
    "dur": 6.5,
    "kind": "beforeafter",
    "kicker": "Un detalle útil",
    "title": "Una fosa o las dos",
    "labelA": "Sólo una peor: problema de esa fosa",
    "labelB": "Las dos por igual: viene de más adentro",
    "imageA": "img/vn_b213.jpg",
    "imageB": "img/vn_b215.jpg"
  },
  {
    "id": "full_b214",
    "start": 1075.56,
    "dur": 2.52,
    "kind": "full",
    "src": "broll/vn_b214.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "full_b215",
    "start": 1078.08,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b215.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "gap_b216_1082",
    "start": 1082.12,
    "dur": 0.28,
    "kind": "full",
    "src": "img/vn_b216.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b216",
    "start": 1082.4,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b216.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "tail_b216",
    "start": 1086.44,
    "dur": 3.4,
    "kind": "full",
    "src": "img/vn_b216.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b217",
    "start": 1089.84,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b217.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "tail_b217",
    "start": 1093.88,
    "dur": 2.72,
    "kind": "full",
    "src": "img/vn_b217.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b218",
    "start": 1096.6,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b218.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "gap_b219_1101",
    "start": 1100.64,
    "dur": 0.5,
    "kind": "full",
    "src": "img/vn_b219.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "hero_50",
    "start": 1101.14,
    "dur": 6.5,
    "kind": "hero",
    "kicker": "La otra historia",
    "title": "Pilar acertó dos de seis",
    "sub": "Y se pasó una semana entera sin dormir",
    "image": "img/vn_b219.jpg",
    "mood": "terracotta"
  },
  {
    "id": "gap_b220_1108",
    "start": 1107.64,
    "dur": 4,
    "kind": "full",
    "src": "img/vn_b220.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b221",
    "start": 1111.64,
    "dur": 5.16,
    "kind": "full",
    "src": "img/vn_b221.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b222",
    "start": 1116.8,
    "dur": 3.76,
    "kind": "full",
    "src": "broll/vn_b222.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "full_b223",
    "start": 1120.56,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b223.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "gap_b224_1125",
    "start": 1124.6,
    "dur": 0.68,
    "kind": "full",
    "src": "img/vn_b224.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "stat_51",
    "start": 1125.28,
    "dur": 6.5,
    "kind": "stat",
    "value": 6,
    "suffix": " min",
    "label": "Lo que tardaron en mirarle la nariz por dentro",
    "sub": "Tenía las dos fosas llenas de pólipos",
    "mood": "gold",
    "image": "img/vn_b224.jpg"
  },
  {
    "id": "gap_b226_1132",
    "start": 1131.78,
    "dur": 1.66,
    "kind": "full",
    "src": "img/vn_b226.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b226",
    "start": 1133.44,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b226.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b226",
    "start": 1137.48,
    "dur": 2.08,
    "kind": "full",
    "src": "img/vn_b226.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "gap_b227_1140",
    "start": 1139.56,
    "dur": 1.46,
    "kind": "full",
    "src": "img/vn_b227.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "quote_52",
    "start": 1141.02,
    "dur": 7,
    "kind": "quote",
    "quote": "Se echó a llorar de alegría por oler lejía. Eso no le pasa a nadie que tenga el olfato bien.",
    "author": "Pilar, después de la operación"
  },
  {
    "id": "chapter_53",
    "start": 1147.28,
    "dur": 6.5,
    "kind": "chapter",
    "kicker": "Antes de asustarse",
    "index": "La lista",
    "title": "Lo que apaga el olfato",
    "sub": "Y casi nunca es la memoria"
  },
  {
    "id": "checklist_54",
    "start": 1152.1,
    "dur": 8,
    "kind": "checklist",
    "kicker": "Por orden de frecuencia",
    "title": "Los siete sospechosos",
    "items": [
      "La nariz: pólipos, sinusitis, tabique",
      "Un virus fuerte",
      "Un golpe en la cabeza",
      "El tabaco",
      "Medicamentos y carencias",
      "La edad, sin más",
      "Otras enfermedades neurológicas"
    ],
    "mood": "gold"
  },
  {
    "id": "gap_b231_1160",
    "start": 1160.1,
    "dur": 2.94,
    "kind": "full",
    "src": "img/vn_b231.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b231",
    "start": 1163.04,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b231.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b231",
    "start": 1167.08,
    "dur": 2.58,
    "kind": "full",
    "src": "img/vn_b231.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b232",
    "start": 1169.66,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b232.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "tail_b232",
    "start": 1173.7,
    "dur": 1.64,
    "kind": "full",
    "src": "img/vn_b232.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "gap_b233_1175",
    "start": 1175.34,
    "dur": 2.1,
    "kind": "full",
    "src": "img/vn_b233.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "hero_55",
    "start": 1177.44,
    "dur": 6.5,
    "kind": "hero",
    "kicker": "Los virus",
    "title": "Si puede señalar la semana, es otra historia",
    "sub": "De golpe y justo después de estar mala: otro pronóstico",
    "image": "img/vn_b233.jpg",
    "mood": "sage"
  },
  {
    "id": "gap_b235_1184",
    "start": 1183.94,
    "dur": 1.26,
    "kind": "full",
    "src": "img/vn_b235.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b235",
    "start": 1185.2,
    "dur": 3.04,
    "kind": "full",
    "src": "broll/vn_b235.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "full_b236",
    "start": 1188.24,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b236.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "tail_b236",
    "start": 1192.28,
    "dur": 1.44,
    "kind": "full",
    "src": "img/vn_b236.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b237",
    "start": 1193.72,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b237.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "tail_b237",
    "start": 1197.76,
    "dur": 0.88,
    "kind": "full",
    "src": "img/vn_b237.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "gap_b238_1199",
    "start": 1198.64,
    "dur": 1.8,
    "kind": "full",
    "src": "img/vn_b238.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "hero_56",
    "start": 1200.44,
    "dur": 6,
    "kind": "hero",
    "kicker": "El tabaco",
    "title": "Apaga el olfato de forma muy notable",
    "sub": "Y mejora bastante al dejarlo, aunque tarde su tiempo",
    "image": "img/vn_b238.jpg",
    "side": "right",
    "mood": "terracotta"
  },
  {
    "id": "gap_b239_1206",
    "start": 1206.44,
    "dur": 2.22,
    "kind": "full",
    "src": "img/vn_b239.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b240",
    "start": 1208.66,
    "dur": 4.04,
    "kind": "full",
    "src": "img/vn_b240.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "checklist_57",
    "start": 1212.7,
    "dur": 6.5,
    "kind": "checklist",
    "kicker": "Lo que se pasa por alto",
    "title": "Se ven en un análisis normal",
    "items": [
      "Falta de zinc",
      "Falta de vitamina B12",
      "Un tiroides bajo",
      "Fármacos de uso común"
    ],
    "mood": "sage"
  },
  {
    "id": "gap_b242_1219",
    "start": 1219.2,
    "dur": 1.46,
    "kind": "full",
    "src": "img/vn_b242.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "checklist_58",
    "start": 1220.66,
    "dur": 7.5,
    "kind": "checklist",
    "kicker": "Se confunden con esto",
    "title": "Cosas que se arreglan",
    "items": [
      "Un tiroides bajo",
      "Falta de vitamina B12",
      "Una depresión",
      "Una apnea del sueño",
      "Unos audífonos que hacían falta",
      "Pastillas que juntas hacen daño"
    ],
    "mood": "sage"
  },
  {
    "id": "gap_b243_1228",
    "start": 1228.16,
    "dur": 1.06,
    "kind": "full",
    "src": "img/vn_b243.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "stat_59",
    "start": 1229.22,
    "dur": 6,
    "kind": "stat",
    "value": 4,
    "suffix": " €",
    "label": "Al mes",
    "sub": "Hay olfatos que vuelven con eso. Por eso se mira primero.",
    "mood": "sage",
    "image": "img/vn_b243.jpg"
  },
  {
    "id": "gap_b244_1235",
    "start": 1235.22,
    "dur": 3.22,
    "kind": "full",
    "src": "img/vn_b244.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b245",
    "start": 1238.44,
    "dur": 2.82,
    "kind": "full",
    "src": "broll/vn_b245.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "full_b246",
    "start": 1241.26,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b246.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "gap_b247_1245",
    "start": 1245.3,
    "dur": 0.2,
    "kind": "full",
    "src": "img/vn_b247.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "hero_60",
    "start": 1245.5,
    "dur": 6.5,
    "kind": "hero",
    "kicker": "Honestidad",
    "title": "En el párkinson es aún más precoz",
    "sub": "La pérdida de olfato es de las señales más constantes que existen",
    "image": "img/vn_b247.jpg",
    "mood": "gold"
  },
  {
    "id": "gap_b248_1252",
    "start": 1252,
    "dur": 2.8,
    "kind": "full",
    "src": "img/vn_b248.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b249",
    "start": 1254.8,
    "dur": 6.8,
    "kind": "full",
    "src": "img/vn_b249.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b250",
    "start": 1261.6,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b250.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b250",
    "start": 1265.64,
    "dur": 1.08,
    "kind": "full",
    "src": "img/vn_b250.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b251",
    "start": 1266.72,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b251.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b251",
    "start": 1270.76,
    "dur": 0.74,
    "kind": "full",
    "src": "img/vn_b251.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b252",
    "start": 1271.5,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b252.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "tail_b252",
    "start": 1275.54,
    "dur": 2.42,
    "kind": "full",
    "src": "img/vn_b252.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b253",
    "start": 1277.96,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b253.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "gap_b254_1282",
    "start": 1282,
    "dur": 0.3,
    "kind": "full",
    "src": "img/vn_b254.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "chapter_61",
    "start": 1282.3,
    "dur": 6.5,
    "kind": "chapter",
    "kicker": "Hágala esta tarde",
    "index": "La prueba",
    "title": "Los seis frascos",
    "sub": "Hecha mal no vale nada y encima asusta"
  },
  {
    "id": "gap_b255_1289",
    "start": 1288.8,
    "dur": 3.72,
    "kind": "full",
    "src": "img/vn_b255.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b256",
    "start": 1292.52,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b256.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "tail_b256",
    "start": 1296.56,
    "dur": 1.02,
    "kind": "full",
    "src": "img/vn_b256.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "checklist_62",
    "start": 1297.58,
    "dur": 7,
    "kind": "checklist",
    "kicker": "De su despensa",
    "title": "Los seis frascos",
    "items": [
      "Café molido",
      "Canela",
      "Un limón cortado",
      "Vinagre",
      "Un jabón perfumado",
      "Ajo crudo"
    ],
    "mood": "gold"
  },
  {
    "id": "gap_b258_1305",
    "start": 1304.58,
    "dur": 1.76,
    "kind": "full",
    "src": "img/vn_b258.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b259",
    "start": 1306.34,
    "dur": 3.94,
    "kind": "full",
    "src": "broll/vn_b259.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "full_b260",
    "start": 1310.28,
    "dur": 3.86,
    "kind": "full",
    "src": "img/vn_b260.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "step_63",
    "start": 1314.14,
    "dur": 6,
    "kind": "step",
    "step": 1,
    "total": 5,
    "title": "No lo haga usted sola",
    "sub": "Si mira lo que huele, está midiendo sus ojos",
    "image": "img/vn_b262.jpg"
  },
  {
    "id": "gap_b262_1320",
    "start": 1320.14,
    "dur": 3.38,
    "kind": "full",
    "src": "img/vn_b262.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b263",
    "start": 1323.52,
    "dur": 3.72,
    "kind": "full",
    "src": "broll/vn_b263.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "gap_b264_1327",
    "start": 1327.24,
    "dur": 2.6,
    "kind": "full",
    "src": "img/vn_b264.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "step_64",
    "start": 1329.84,
    "dur": 6,
    "kind": "step",
    "step": 2,
    "total": 5,
    "title": "Con los ojos tapados y una fosa cada vez",
    "sub": "Primero las seis por la derecha, después por la izquierda",
    "image": "img/vn_b265.jpg"
  },
  {
    "id": "gap_b266_1336",
    "start": 1335.84,
    "dur": 1.08,
    "kind": "full",
    "src": "img/vn_b266.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b266",
    "start": 1336.92,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b266.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b266",
    "start": 1340.96,
    "dur": 1.72,
    "kind": "full",
    "src": "img/vn_b266.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "step_65",
    "start": 1342.68,
    "dur": 6.5,
    "kind": "step",
    "step": 3,
    "total": 5,
    "title": "Con OPCIONES, nunca “¿hueles algo?”",
    "hot": [
      "OPCIONES"
    ],
    "sub": "¿Es café, es canela o es ajo? Así se mide identificación",
    "image": "img/vn_b270.jpg"
  },
  {
    "id": "gap_b269_1349",
    "start": 1349.18,
    "dur": 2.5,
    "kind": "full",
    "src": "img/vn_b269.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b269",
    "start": 1351.68,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b269.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "tail_b269",
    "start": 1355.72,
    "dur": 1.28,
    "kind": "full",
    "src": "img/vn_b269.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b270",
    "start": 1357,
    "dur": 3.76,
    "kind": "full",
    "src": "broll/vn_b270.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "full_b271",
    "start": 1360.76,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b271.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b271",
    "start": 1364.8,
    "dur": 0.94,
    "kind": "full",
    "src": "img/vn_b271.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b272",
    "start": 1365.74,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b272.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "gap_b273_1370",
    "start": 1369.78,
    "dur": 0.66,
    "kind": "full",
    "src": "img/vn_b273.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "step_66",
    "start": 1370.44,
    "dur": 6.5,
    "kind": "step",
    "step": 4,
    "total": 5,
    "title": "Diga antes cuántas cree que va a acertar",
    "sub": "Ese número se apunta en el papel antes de oler nada",
    "image": "img/vn_b274.jpg"
  },
  {
    "id": "gap_b274_1377",
    "start": 1376.94,
    "dur": 4.2,
    "kind": "full",
    "src": "img/vn_b274.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "gap_b275_1381",
    "start": 1381.14,
    "dur": 0.98,
    "kind": "full",
    "src": "img/vn_b275.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b275",
    "start": 1382.12,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b275.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b275",
    "start": 1386.16,
    "dur": 1.16,
    "kind": "full",
    "src": "img/vn_b275.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "step_67",
    "start": 1387.32,
    "dur": 6,
    "kind": "step",
    "step": 5,
    "total": 5,
    "title": "Ni resfriada, ni recién comida",
    "sub": "Y no huela el mismo frasco cinco veces: la nariz se cansa",
    "image": "img/vn_b277.jpg"
  },
  {
    "id": "gap_b278_1393",
    "start": 1393.32,
    "dur": 2.06,
    "kind": "full",
    "src": "img/vn_b278.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b278",
    "start": 1395.38,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b278.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b278",
    "start": 1399.42,
    "dur": 2.52,
    "kind": "full",
    "src": "img/vn_b278.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b279",
    "start": 1401.94,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b279.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b279",
    "start": 1405.98,
    "dur": 2.54,
    "kind": "full",
    "src": "img/vn_b279.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "gap_b280_1409",
    "start": 1408.52,
    "dur": 1.96,
    "kind": "full",
    "src": "img/vn_b280.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "checklist_68",
    "start": 1410.48,
    "dur": 6,
    "kind": "checklist",
    "kicker": "Apunte también",
    "title": "Dos preguntas que valen tanto como la prueba",
    "items": [
      "¿Desde cuándo?",
      "¿Fue de golpe o poco a poco?"
    ],
    "mood": "sage"
  },
  {
    "id": "gap_b282_1416",
    "start": 1416.48,
    "dur": 4.2,
    "kind": "full",
    "src": "img/vn_b282.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "gap_b283_1421",
    "start": 1420.68,
    "dur": 0.36,
    "kind": "full",
    "src": "img/vn_b283.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "chapter_69",
    "start": 1421.04,
    "dur": 6.5,
    "kind": "chapter",
    "kicker": "Lo prometido",
    "index": "La 6ª",
    "title": "La resta",
    "sub": "Lo que hace que las otras cinco sirvan"
  },
  {
    "id": "gap_b284_1428",
    "start": 1427.54,
    "dur": 4.2,
    "kind": "full",
    "src": "img/vn_b284.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "gap_b285_1432",
    "start": 1431.74,
    "dur": 0.54,
    "kind": "full",
    "src": "img/vn_b285.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "checklist_70",
    "start": 1432.28,
    "dur": 7,
    "kind": "checklist",
    "kicker": "Los tres resultados",
    "title": "Mire los dos números",
    "items": [
      "Dijo cinco y sacó cinco: nada que hablar",
      "Dijo dos y sacó dos: flojo, pero informado",
      "Dijo seis y sacó dos: ahí miro dos veces"
    ],
    "mood": "gold"
  },
  {
    "id": "gap_b287_1439",
    "start": 1439.28,
    "dur": 4.2,
    "kind": "full",
    "src": "img/vn_b287.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "gap_b288_1443",
    "start": 1443.48,
    "dur": 0.58,
    "kind": "full",
    "src": "img/vn_b288.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b288",
    "start": 1444.06,
    "dur": 3.46,
    "kind": "full",
    "src": "broll/vn_b288.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "full_b289",
    "start": 1447.52,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b289.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "tail_b289",
    "start": 1451.56,
    "dur": 1.18,
    "kind": "full",
    "src": "img/vn_b289.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b290",
    "start": 1452.74,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b290.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b290",
    "start": 1456.78,
    "dur": 1.7,
    "kind": "full",
    "src": "img/vn_b290.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "beforeafter_71",
    "start": 1458.48,
    "dur": 6.5,
    "kind": "beforeafter",
    "kicker": "La señal fina",
    "title": "Lo que cree y lo que le pasa",
    "labelA": "Lo que usted dijo: seis",
    "labelB": "Lo que sacó: dos",
    "imageA": "img/vn_b284.jpg",
    "imageB": "img/vn_b291.jpg"
  },
  {
    "id": "hero_72",
    "start": 1461.08,
    "dur": 7,
    "kind": "hero",
    "kicker": "Por qué importa",
    "title": "No sólo falla la nariz: falla el darse cuenta",
    "hot": [
      "darse cuenta"
    ],
    "sub": "Y el darse cuenta vive en las zonas de las que llevamos hablando",
    "image": "img/vn_b293.jpg",
    "mood": "terracotta"
  },
  {
    "id": "gap_b293_1468",
    "start": 1468.08,
    "dur": 4.2,
    "kind": "full",
    "src": "img/vn_b293.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "gap_b294_1472",
    "start": 1472.28,
    "dur": 0.94,
    "kind": "full",
    "src": "img/vn_b294.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b294",
    "start": 1473.22,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b294.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b294",
    "start": 1477.26,
    "dur": 3.3,
    "kind": "full",
    "src": "img/vn_b294.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b295",
    "start": 1480.56,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b295.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "gap_b296_1485",
    "start": 1484.6,
    "dur": 0.14,
    "kind": "full",
    "src": "img/vn_b296.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b296",
    "start": 1484.74,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b296.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "tail_b296",
    "start": 1488.78,
    "dur": 1.14,
    "kind": "full",
    "src": "img/vn_b296.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b297",
    "start": 1489.92,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b297.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "tail_b297",
    "start": 1493.96,
    "dur": 1.58,
    "kind": "full",
    "src": "img/vn_b297.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b298",
    "start": 1495.54,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b298.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b298",
    "start": 1499.58,
    "dur": 1.1,
    "kind": "full",
    "src": "img/vn_b298.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "quote_73",
    "start": 1500.68,
    "dur": 7,
    "kind": "quote",
    "quote": "Quédese con la resta. Es gratis, se hace en diez minutos, y no hay aparato que se la dé mejor.",
    "author": "Dra. Valeria Alcázar"
  },
  {
    "id": "gap_b300_1508",
    "start": 1507.68,
    "dur": 4.2,
    "kind": "full",
    "src": "img/vn_b300.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b301",
    "start": 1512,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b301.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "gap_b302_1516",
    "start": 1516.04,
    "dur": 0.2,
    "kind": "full",
    "src": "img/vn_b302.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b302",
    "start": 1516.24,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b302.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b302",
    "start": 1520.28,
    "dur": 1.34,
    "kind": "full",
    "src": "img/vn_b302.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b303",
    "start": 1521.62,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b303.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b303",
    "start": 1525.66,
    "dur": 0.8,
    "kind": "full",
    "src": "img/vn_b303.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b304",
    "start": 1526.46,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b304.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "tail_b304",
    "start": 1530.5,
    "dur": 1.32,
    "kind": "full",
    "src": "img/vn_b304.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "gap_b305_1532",
    "start": 1531.82,
    "dur": 3.38,
    "kind": "full",
    "src": "img/vn_b305.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "step_74",
    "start": 1535.2,
    "dur": 6.5,
    "kind": "step",
    "step": 1,
    "total": 3,
    "title": "Al otorrino, y a nadie más primero",
    "sub": "Que le miren la nariz por dentro con la cámara",
    "image": "img/vn_b306.jpg"
  },
  {
    "id": "gap_b307_1542",
    "start": 1541.7,
    "dur": 4.2,
    "kind": "full",
    "src": "img/vn_b307.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b308",
    "start": 1546.02,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b308.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "tail_b308",
    "start": 1550.06,
    "dur": 3.3,
    "kind": "full",
    "src": "img/vn_b308.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "step_75",
    "start": 1553.36,
    "dur": 6.5,
    "kind": "step",
    "step": 2,
    "total": 3,
    "title": "Análisis y la lista de todo lo que toma",
    "sub": "Hierro, zinc, B12 y tiroides. Y el herbolario también.",
    "image": "img/vn_b309.jpg"
  },
  {
    "id": "gap_b310_1560",
    "start": 1559.86,
    "dur": 0.74,
    "kind": "full",
    "src": "img/vn_b310.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b310",
    "start": 1560.6,
    "dur": 3.6,
    "kind": "full",
    "src": "broll/vn_b310.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "step_76",
    "start": 1564.2,
    "dur": 6,
    "kind": "step",
    "step": 3,
    "total": 3,
    "title": "La frase exacta para la consulta",
    "sub": "Escríbala y llévela en el bolso",
    "image": "img/vn_b311.jpg"
  },
  {
    "id": "full_b312",
    "start": 1570.32,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b312.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "gap_b313_1574",
    "start": 1574.36,
    "dur": 0.36,
    "kind": "full",
    "src": "img/vn_b313.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "quote_77",
    "start": 1574.72,
    "dur": 7,
    "kind": "quote",
    "quote": "Doctor, ¿me pueden hacer una prueba de identificación de olores?",
    "author": "La frase que hay que llevar a la consulta"
  },
  {
    "id": "gap_b315_1582",
    "start": 1581.72,
    "dur": 2.3,
    "kind": "full",
    "src": "img/vn_b315.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b315",
    "start": 1584.02,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b315.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b315",
    "start": 1588.06,
    "dur": 1.2,
    "kind": "full",
    "src": "img/vn_b315.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b316",
    "start": 1589.26,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b316.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "tail_b316",
    "start": 1593.3,
    "dur": 1.46,
    "kind": "full",
    "src": "img/vn_b316.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b317",
    "start": 1594.76,
    "dur": 3.38,
    "kind": "full",
    "src": "broll/vn_b317.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "chapter_78",
    "start": 1598.14,
    "dur": 6.5,
    "kind": "chapter",
    "kicker": "Mientras espera",
    "index": "Extra",
    "title": "El olfato se entrena",
    "sub": "Cuesta cero y se hace en tres minutos"
  },
  {
    "id": "gap_b319_1605",
    "start": 1604.64,
    "dur": 1.58,
    "kind": "full",
    "src": "img/vn_b319.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "checklist_79",
    "start": 1606.22,
    "dur": 6.5,
    "kind": "checklist",
    "kicker": "Dos veces al día",
    "title": "Los cuatro olores",
    "items": [
      "Rosa",
      "Limón",
      "Clavo",
      "Eucalipto"
    ],
    "mood": "gold"
  },
  {
    "id": "gap_b321_1613",
    "start": 1612.72,
    "dur": 4.1,
    "kind": "full",
    "src": "img/vn_b321.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "stat_80",
    "start": 1616.82,
    "dur": 7,
    "kind": "stat",
    "value": 20,
    "suffix": " s",
    "label": "Cada olor, dos veces al día",
    "sub": "Y mientras huele el limón, piense en un limón: eso es lo que reconstruye el camino",
    "mood": "sage",
    "image": "img/vn_b321.jpg"
  },
  {
    "id": "gap_b323_1624",
    "start": 1623.82,
    "dur": 1.3,
    "kind": "full",
    "src": "img/vn_b323.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b323",
    "start": 1625.12,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b323.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b323",
    "start": 1629.16,
    "dur": 1.34,
    "kind": "full",
    "src": "img/vn_b323.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b324",
    "start": 1630.5,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b324.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "gap_b325_1635",
    "start": 1634.54,
    "dur": 0.5,
    "kind": "full",
    "src": "img/vn_b325.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b325",
    "start": 1635.04,
    "dur": 3.32,
    "kind": "full",
    "src": "broll/vn_b325.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "full_b326",
    "start": 1638.36,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b326.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b326",
    "start": 1642.4,
    "dur": 1.48,
    "kind": "full",
    "src": "img/vn_b326.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "gap_b327_1644",
    "start": 1643.88,
    "dur": 2.58,
    "kind": "full",
    "src": "img/vn_b327.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "hero_81",
    "start": 1646.46,
    "dur": 7,
    "kind": "hero",
    "kicker": "La letra pequeña",
    "title": "No previene el alzhéimer, y no se lo voy a vender así",
    "sub": "Está estudiado sobre todo tras un virus o un golpe. Pero cuesta cero.",
    "image": "img/vn_b327.jpg",
    "mood": "terracotta"
  },
  {
    "id": "gap_b329_1653",
    "start": 1653.46,
    "dur": 2.5,
    "kind": "full",
    "src": "img/vn_b329.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b329",
    "start": 1655.96,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b329.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "tail_b329",
    "start": 1660,
    "dur": 2.7,
    "kind": "full",
    "src": "img/vn_b329.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b330",
    "start": 1662.7,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b330.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b330",
    "start": 1666.74,
    "dur": 1.42,
    "kind": "full",
    "src": "img/vn_b330.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b331",
    "start": 1668.16,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b331.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b331",
    "start": 1672.2,
    "dur": 0.72,
    "kind": "full",
    "src": "img/vn_b331.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "gap_b332_1673",
    "start": 1672.92,
    "dur": 3.2,
    "kind": "full",
    "src": "img/vn_b332.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "hero_82",
    "start": 1676.12,
    "dur": 6.5,
    "kind": "hero",
    "kicker": "Lo que de verdad importa",
    "title": "Llegar antes sí sirve",
    "hot": [
      "sí sirve"
    ],
    "sub": "Para descartar todo lo que se arregla y se confunde con esto",
    "image": "img/vn_b333.jpg",
    "mood": "sage"
  },
  {
    "id": "gap_b334_1683",
    "start": 1682.62,
    "dur": 2.6,
    "kind": "full",
    "src": "img/vn_b334.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b334",
    "start": 1685.22,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b334.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b334",
    "start": 1689.26,
    "dur": 2.12,
    "kind": "full",
    "src": "img/vn_b334.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b335",
    "start": 1691.38,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b335.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b335",
    "start": 1695.42,
    "dur": 1.78,
    "kind": "full",
    "src": "img/vn_b335.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b336",
    "start": 1697.2,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b336.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "tail_b336",
    "start": 1701.24,
    "dur": 2.92,
    "kind": "full",
    "src": "img/vn_b336.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "checklist_83",
    "start": 1704.16,
    "dur": 7.5,
    "kind": "checklist",
    "kicker": "Lo que sí protege",
    "title": "Y funciona mejor cuanto antes se empieza",
    "items": [
      "La tensión bien llevada",
      "El azúcar bien llevado",
      "El oído corregido",
      "El sueño",
      "Moverse",
      "No quedarse sola"
    ],
    "mood": "gold"
  },
  {
    "id": "gap_b338_1712",
    "start": 1711.66,
    "dur": 4.2,
    "kind": "full",
    "src": "img/vn_b338.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "gap_b339_1716",
    "start": 1715.86,
    "dur": 0.18,
    "kind": "full",
    "src": "img/vn_b339.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "quote_84",
    "start": 1716.04,
    "dur": 6.5,
    "kind": "quote",
    "quote": "Todo eso es tiempo. Y el tiempo es lo único que aquí no se compra.",
    "author": "Dra. Valeria Alcázar"
  },
  {
    "id": "gap_b341_1723",
    "start": 1722.54,
    "dur": 3.76,
    "kind": "full",
    "src": "img/vn_b341.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b341",
    "start": 1726.3,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b341.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "tail_b341",
    "start": 1730.34,
    "dur": 3.16,
    "kind": "full",
    "src": "img/vn_b341.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b342",
    "start": 1733.5,
    "dur": 3.88,
    "kind": "full",
    "src": "broll/vn_b342.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "checklist_85",
    "start": 1737.38,
    "dur": 7,
    "kind": "checklist",
    "kicker": "Carmen, hoy",
    "title": "Lo que cambió en su casa",
    "items": [
      "Un detector de humo en el pasillo",
      "Un temporizador que suena como una bomba",
      "El entrenamiento de los cuatro olores",
      "Y sigue empezando por las verticales"
    ],
    "mood": "sage"
  },
  {
    "id": "gap_b344_1744",
    "start": 1744.38,
    "dur": 4.2,
    "kind": "full",
    "src": "img/vn_b344.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "gap_b345_1749",
    "start": 1748.58,
    "dur": 0.3,
    "kind": "full",
    "src": "img/vn_b345.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b345",
    "start": 1748.88,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b345.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "tail_b345",
    "start": 1752.92,
    "dur": 2.28,
    "kind": "full",
    "src": "img/vn_b345.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "hero_86",
    "start": 1755.2,
    "dur": 7,
    "kind": "hero",
    "kicker": "Y una cosa más",
    "title": "Cada Navidad sacan seis frascos a la mesa",
    "sub": "Se la hacen los once, por turnos, con una venda y muchas risas",
    "image": "img/vn_b346.jpg",
    "mood": "gold"
  },
  {
    "id": "gap_b347_1762",
    "start": 1762.2,
    "dur": 3.48,
    "kind": "full",
    "src": "img/vn_b347.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b348",
    "start": 1765.68,
    "dur": 3.14,
    "kind": "full",
    "src": "broll/vn_b348.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "gap_b349_1769",
    "start": 1768.82,
    "dur": 2.6,
    "kind": "full",
    "src": "img/vn_b349.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "quote_87",
    "start": 1771.42,
    "dur": 7,
    "kind": "quote",
    "quote": "Nos reímos igual que aquel año, doctora. Pero ahora sabemos de qué nos estamos riendo.",
    "author": "La hija de Carmen"
  },
  {
    "id": "checklist_88",
    "start": 1774.38,
    "dur": 8.5,
    "kind": "checklist",
    "kicker": "Guárdese estas cinco",
    "title": "Las cinco señales",
    "items": [
      "No es oler menos: es confundir",
      "La comida no sabe, y aparece la sal",
      "Olores fantasma o deformados sin virus",
      "No se ha dado cuenta: se lo dicen los demás",
      "Años cuesta abajo, sin resfriado, las dos fosas"
    ],
    "mood": "gold"
  },
  {
    "id": "gap_b351_1783",
    "start": 1782.88,
    "dur": 2.98,
    "kind": "full",
    "src": "img/vn_b351.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b352",
    "start": 1785.86,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b352.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "tail_b352",
    "start": 1789.9,
    "dur": 1.54,
    "kind": "full",
    "src": "img/vn_b352.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b353",
    "start": 1791.44,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b353.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "gap_b354_1795",
    "start": 1795.48,
    "dur": 0.7,
    "kind": "full",
    "src": "img/vn_b354.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b354",
    "start": 1796.18,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b354.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b354",
    "start": 1800.22,
    "dur": 3.36,
    "kind": "full",
    "src": "img/vn_b354.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "gap_b355_1804",
    "start": 1803.58,
    "dur": 3.32,
    "kind": "full",
    "src": "img/vn_b355.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "stat_89",
    "start": 1806.9,
    "dur": 6.5,
    "kind": "stat",
    "value": 6,
    "label": "Y por encima de las cinco, la sexta",
    "sub": "La resta entre lo que cree que huele y lo que huele de verdad",
    "mood": "terracotta",
    "image": "img/vn_b355.jpg"
  },
  {
    "id": "gap_b357_1813",
    "start": 1813.4,
    "dur": 1.56,
    "kind": "full",
    "src": "img/vn_b357.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "cta_90",
    "start": 1814.96,
    "dur": 8,
    "kind": "cta",
    "kicker": "Antes de irse",
    "title": "Guarde este vídeo y suscríbase",
    "hot": [
      "Guarde"
    ],
    "sub": "La prueba de los seis frascos paso a paso, la hoja de los dos números y las frases para pedir cita están escritas en la descripción.",
    "buttonLabel": "Guardar · Suscribirse",
    "image": "img/vn_b357.jpg"
  },
  {
    "id": "gap_b358_1823",
    "start": 1822.96,
    "dur": 3.06,
    "kind": "full",
    "src": "img/vn_b358.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b359",
    "start": 1826.02,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b359.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b359",
    "start": 1830.06,
    "dur": 2.56,
    "kind": "full",
    "src": "img/vn_b359.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b360",
    "start": 1832.62,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b360.mp4",
    "video": true,
    "ken": "in",
    "noSplit": true
  },
  {
    "id": "tail_b360",
    "start": 1836.66,
    "dur": 2.78,
    "kind": "full",
    "src": "img/vn_b360.jpg",
    "video": false,
    "ken": "out"
  },
  {
    "id": "full_b361",
    "start": 1839.44,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b361.mp4",
    "video": true,
    "ken": "out",
    "noSplit": true
  },
  {
    "id": "tail_b361",
    "start": 1843.48,
    "dur": 3.96,
    "kind": "full",
    "src": "img/vn_b361.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b362",
    "start": 1847.44,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b362.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "full_b363",
    "start": 1851.5,
    "dur": 3.82,
    "kind": "full",
    "src": "img/vn_b363.jpg",
    "video": false,
    "ken": "right"
  },
  {
    "id": "hero_91",
    "start": 1855.32,
    "dur": 7,
    "kind": "hero",
    "kicker": "En los comentarios",
    "title": "¿Cuál fue el último olor que la emocionó?",
    "sub": "El pan recién hecho, la lluvia sobre la tierra seca, la colonia de su madre",
    "image": "img/vn_b365.jpg",
    "mood": "gold"
  },
  {
    "id": "gap_b366_1862",
    "start": 1862.32,
    "dur": 0.94,
    "kind": "full",
    "src": "img/vn_b366.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "full_b366",
    "start": 1863.26,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b366.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b366",
    "start": 1867.3,
    "dur": 3.7,
    "kind": "full",
    "src": "img/vn_b366.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "full_b367",
    "start": 1871,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b367.mp4",
    "video": true,
    "ken": "right",
    "noSplit": true
  },
  {
    "id": "tail_b367",
    "start": 1875.04,
    "dur": 1.74,
    "kind": "full",
    "src": "img/vn_b367.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "gap_b368_1877",
    "start": 1876.78,
    "dur": 3.1,
    "kind": "full",
    "src": "img/vn_b368.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "hero_92",
    "start": 1879.88,
    "dur": 7,
    "kind": "hero",
    "kicker": "Si vive sola alguien cerca",
    "title": "Vaya un día con seis frascos",
    "sub": "Diez minutos de mesa de cocina hacen más que un año preocupándose de lejos",
    "image": "img/vn_b369.jpg",
    "mood": "sage"
  },
  {
    "id": "gap_b369_1887",
    "start": 1886.88,
    "dur": 4.2,
    "kind": "full",
    "src": "img/vn_b369.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "gap_b370_1891",
    "start": 1891.08,
    "dur": 1.18,
    "kind": "full",
    "src": "img/vn_b370.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "full_b370",
    "start": 1892.26,
    "dur": 4.04,
    "kind": "full",
    "src": "broll/vn_b370.mp4",
    "video": true,
    "ken": "left",
    "noSplit": true
  },
  {
    "id": "tail_b370",
    "start": 1896.3,
    "dur": 3.16,
    "kind": "full",
    "src": "img/vn_b370.jpg",
    "video": false,
    "ken": "in"
  },
  {
    "id": "gap_b371_1899",
    "start": 1899.46,
    "dur": 4.2,
    "kind": "full",
    "src": "img/vn_b371.jpg",
    "video": false,
    "ken": "in",
    "variant": "whip"
  },
  {
    "id": "gap_b372_1904",
    "start": 1903.66,
    "dur": 1.7,
    "kind": "full",
    "src": "img/vn_b372.jpg",
    "video": false,
    "ken": "out",
    "variant": "whip"
  },
  {
    "id": "hero_93",
    "start": 1905.36,
    "dur": 7.5,
    "kind": "hero",
    "kicker": "Hasta la semana que viene",
    "title": "Cuide esa cabeza suya",
    "sub": "Lleva toda la vida guardándolo todo por usted",
    "image": "img/vn_b372.jpg",
    "mood": "gold"
  },
  {
    "id": "talk_1",
    "start": 9.32,
    "dur": 8.6,
    "kind": "talk",
    "title": "El detalle no aparece hasta la última frase",
    "hot": [
      "última frase"
    ]
  },
  {
    "id": "talk_2",
    "start": 30.52,
    "dur": 8.6,
    "kind": "talk",
    "title": "Puso las lentejas y se fue al salón",
    "hot": [
      "lentejas"
    ]
  },
  {
    "id": "talk_3",
    "start": 46.42,
    "dur": 8.6,
    "kind": "talk",
    "title": "En la escalera no se podía respirar",
    "hot": [
      "no se podía respirar"
    ]
  },
  {
    "id": "talk_4",
    "start": 66.08,
    "dur": 8.6,
    "kind": "talk",
    "title": "Cuarenta minutos. Cuatro metros. Nada.",
    "hot": [
      "Nada"
    ]
  },
  {
    "id": "talk_5",
    "start": 91.76,
    "dur": 8.6,
    "kind": "talk",
    "title": "La memoria funcionaba perfectamente",
    "hot": [
      "funcionaba"
    ]
  },
  {
    "id": "talk_6",
    "start": 114.78,
    "dur": 8.6,
    "kind": "talk",
    "title": "¿Y a qué olía aquel perfume?",
    "hot": [
      "a qué olía"
    ]
  },
  {
    "id": "talk_7",
    "start": 139.3,
    "dur": 8.6,
    "kind": "talk",
    "title": "Dijo “qué rico huele”. Y no olió nada.",
    "hot": [
      "nada"
    ]
  },
  {
    "id": "talk_8",
    "start": 190.36,
    "dur": 8.6,
    "kind": "talk",
    "title": "Vienen por las manos. Me entero de esto de casualidad.",
    "hot": [
      "de casualidad"
    ]
  },
  {
    "id": "talk_9",
    "start": 232.08,
    "dur": 8.6,
    "kind": "talk",
    "title": "Se distingue en su propia cocina, esta tarde",
    "hot": [
      "esta tarde"
    ]
  },
  {
    "id": "talk_10",
    "start": 274.1,
    "dur": 8.6,
    "kind": "talk",
    "title": "Del limón a la memoria, sin escalas",
    "hot": [
      "sin escalas"
    ]
  },
  {
    "id": "talk_11",
    "start": 322.38,
    "dur": 8.6,
    "kind": "talk",
    "title": "Una colonia la devuelve a un portal de 1978",
    "hot": [
      "1978"
    ]
  },
  {
    "id": "talk_12",
    "start": 344.3,
    "dur": 8.6,
    "kind": "talk",
    "title": "Las primeras zonas son siempre las mismas",
    "hot": [
      "las mismas"
    ]
  },
  {
    "id": "talk_13",
    "start": 430.68,
    "dur": 8.6,
    "kind": "talk",
    "title": "Un aviso barato, temprano, y tirado a la basura",
    "hot": [
      "a la basura"
    ]
  },
  {
    "id": "talk_14",
    "start": 510.08,
    "dur": 8.6,
    "kind": "talk",
    "title": "Le doy café. Dice chocolate.",
    "hot": [
      "chocolate"
    ]
  },
  {
    "id": "talk_15",
    "start": 606.9,
    "dur": 8.6,
    "kind": "talk",
    "title": "Empieza a compensar con sal",
    "hot": [
      "sal"
    ]
  },
  {
    "id": "talk_16",
    "start": 642.12,
    "dur": 8.6,
    "kind": "talk",
    "title": "Probó su propio asado y dijo: está soso",
    "hot": [
      "está soso"
    ]
  },
  {
    "id": "talk_17",
    "start": 688.78,
    "dur": 8.6,
    "kind": "talk",
    "title": "Su marido había muerto en septiembre",
    "hot": [
      "septiembre"
    ]
  },
  {
    "id": "talk_18",
    "start": 755.12,
    "dur": 8.6,
    "kind": "talk",
    "title": "Busca de dónde viene y no viene de ningún sitio",
    "hot": [
      "ningún sitio"
    ]
  },
  {
    "id": "talk_19",
    "start": 792.44,
    "dur": 8.6,
    "kind": "talk",
    "title": "Después de un virus suele ser buena señal",
    "hot": [
      "buena señal"
    ]
  },
  {
    "id": "talk_20",
    "start": 861.18,
    "dur": 8.6,
    "kind": "talk",
    "title": "Volvamos a aquella cocina",
    "hot": [
      "aquella cocina"
    ]
  },
  {
    "id": "talk_21",
    "start": 955.9,
    "dur": 8.6,
    "kind": "talk",
    "title": "Juran que huelen bien y suspenden la prueba",
    "hot": [
      "suspenden"
    ]
  },
  {
    "id": "talk_22",
    "start": 1111.64,
    "dur": 8.6,
    "kind": "talk",
    "title": "Una semana entera sin dormir",
    "hot": [
      "sin dormir"
    ]
  },
  {
    "id": "talk_23",
    "start": 1188.24,
    "dur": 8.6,
    "kind": "talk",
    "title": "Un golpe de hace años, aunque pareciera menor",
    "hot": [
      "hace años"
    ]
  },
  {
    "id": "talk_24",
    "start": 1351.68,
    "dur": 8.6,
    "kind": "talk",
    "title": "Con opciones. Nunca “¿hueles algo?”",
    "hot": [
      "Con opciones"
    ]
  },
  {
    "id": "talk_25",
    "start": 1480.56,
    "dur": 8.6,
    "kind": "talk",
    "title": "“Yo huelo bien, doctora”",
    "hot": [
      "huelo bien"
    ]
  },
  {
    "id": "talk_26",
    "start": 1521.62,
    "dur": 8.6,
    "kind": "talk",
    "title": "Si sale bien, olvídese del asunto",
    "hot": [
      "olvídese"
    ]
  },
  {
    "id": "talk_27",
    "start": 224.44,
    "dur": 8.6,
    "kind": "talk",
    "title": "“Si huele menos, preocúpese” no sirve para nada",
    "hot": [
      "no sirve"
    ]
  },
  {
    "id": "talk_28",
    "start": 426.98,
    "dur": 8.6,
    "kind": "talk",
    "title": "Un aviso. Ni más ni menos.",
    "hot": [
      "Un aviso"
    ]
  },
  {
    "id": "talk_29",
    "start": 489.02,
    "dur": 8.6,
    "kind": "talk",
    "title": "Envejecer es oler más flojo. Nada más.",
    "hot": [
      "Nada más"
    ]
  },
  {
    "id": "talk_30",
    "start": 577.72,
    "dur": 8.6,
    "kind": "talk",
    "title": "El sabor de un guiso entra por la nariz",
    "hot": [
      "por la nariz"
    ]
  },
  {
    "id": "talk_31",
    "start": 679.4,
    "dur": 8.6,
    "kind": "talk",
    "title": "Tres años antes de las lentejas",
    "hot": [
      "Tres años antes"
    ]
  },
  {
    "id": "talk_32",
    "start": 790.68,
    "dur": 8.6,
    "kind": "talk",
    "title": "La colonia de treinta años, de repente, da asco",
    "hot": [
      "da asco"
    ]
  },
  {
    "id": "talk_33",
    "start": 901.66,
    "dur": 8.6,
    "kind": "talk",
    "title": "El cerebro baja el listón cada día un milímetro",
    "hot": [
      "un milímetro"
    ]
  },
  {
    "id": "talk_34",
    "start": 1271.5,
    "dur": 8.6,
    "kind": "talk",
    "title": "Sólo entonces es otra conversación",
    "hot": [
      "otra conversación"
    ]
  },
  {
    "id": "talk_35",
    "start": 1395.38,
    "dur": 8.6,
    "kind": "talk",
    "title": "La nariz se cansa muy rápido",
    "hot": [
      "se cansa"
    ]
  },
  {
    "id": "talk_36",
    "start": 1447.52,
    "dur": 8.6,
    "kind": "talk",
    "title": "Su olfato está peor. Su cerebro, informado.",
    "hot": [
      "informado"
    ]
  },
  {
    "id": "talk_37",
    "start": 1516.24,
    "dur": 8.6,
    "kind": "talk",
    "title": "No la dejo con el susto y sin salida",
    "hot": [
      "sin salida"
    ]
  },
  {
    "id": "talk_38",
    "start": 1726.3,
    "dur": 8.6,
    "kind": "talk",
    "title": "Carmen, por cierto, está bien",
    "hot": [
      "está bien"
    ]
  },
  {
    "id": "talk_39",
    "start": 1832.62,
    "dur": 8.6,
    "kind": "talk",
    "title": "Todo escrito, ahí abajo",
    "hot": [
      "Todo escrito"
    ]
  }
];
