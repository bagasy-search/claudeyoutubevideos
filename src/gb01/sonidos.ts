// gb01 · sonido Freesound CC0 (pedido del creador 20-oct: "freesound para todos los efectos de cada micro-acción,
// impresionante, super clean y adictivo, que no opaquen la voz"). Archivos en public/gb01/sfx/ (los baja y limpia
// scratchpad bajar.mjs: sin silencio inicial, 90 Hz-12 kHz, fundido 40 ms, pico -3 dBFS; fuentes en _sfx_fuentes.json).
// Volúmenes bajos a propósito: la mezcla además los baja 10 dB mientras habla el monje (DUCK_DB=10 en mezcla_neon.py).
import type { Sfx } from "../kits/neon/sonidos";

const v = (id: string, n: number) => Array.from({ length: n }, (_, i) => `gb01/sfx/${id}${i ? `_${i + 1}` : ""}.wav`);
export const SONIDOS_GB = {
  neonOn: { archivos: v("neon_on", 3), vol: 0.32, dur: 1.0 },
  hilo: { archivos: v("hilo", 3), vol: 0.22, dur: 0.4 },
  luz: { archivos: v("luz_corre", 2), vol: 0.22, dur: 0.6 },
  vuelo: { archivos: v("vuelo", 3), vol: 0.3, dur: 0.6 },
  vueloLargo: { archivos: v("vuelo_largo", 2), vol: 0.3, dur: 1.2 },
  palanca: { archivos: v("palanca", 3), vol: 0.42, dur: 0.6 },
  rodillos: { archivos: v("rodillos", 2), vol: 0.34, dur: 1.15 },
  rodilloFrena: { archivos: v("rodillo_frena", 3), vol: 0.3, dur: 0.2 },
  premio: { archivos: v("premio", 2), vol: 0.4, dur: 1.8 },
  toque: { archivos: v("toque", 2), vol: 0.35, dur: 0.25 },
  tiron: { archivos: v("pull_refresh", 2), vol: 0.25, dur: 0.45 },
  vacio: { archivos: v("refresco_vacio", 2), vol: 0.22, dur: 0.35 },
  aviso: { archivos: v("aviso", 3), vol: 0.34, dur: 0.8 },
  like: { archivos: v("like", 2), vol: 0.38, dur: 0.2 },
  aparece: { archivos: v("aparece", 3), vol: 0.3, dur: 0.3 },
  vidrio: { archivos: v("vidrio", 1), vol: 0.3, dur: 0.3 },
  digito: { archivos: v("digito", 2), vol: 0.26, dur: 0.12 },
  sinapsis: { archivos: v("sinapsis", 3), vol: 0.26, dur: 1.0 },
  latido: { archivos: v("latido", 1), vol: 0.32, dur: 0.2 },
  traza: { archivos: v("traza", 2), vol: 0.2, dur: 1.0 },
  tic: { archivos: v("tic", 2), vol: 0.18, dur: 0.1 },
  grieta: { archivos: v("grieta", 2), vol: 0.3, dur: 0.7 },
  golpe: { archivos: v("golpe_suave", 2), vol: 0.34, dur: 0.4 },
  engranaje: { archivos: v("engranaje", 3), vol: 0.28, dur: 0.45 },
  maquinaGira: { archivos: v("maquina_gira", 1), vol: 0.14, dur: 4.0 },
  maquinaFrena: { archivos: v("maquina_frena", 2), vol: 0.24, dur: 2.0 },
  ola: { archivos: v("ola", 2), vol: 0.24, dur: 2.3 },
  cierre: { archivos: v("cierre", 2), vol: 0.26, dur: 4.5 },
} as const;
export type ElementoGb = keyof typeof SONIDOS_GB;
export const ARCHIVOS_GB = [...new Set(Object.values(SONIDOS_GB).flatMap((s) => [...s.archivos]))];

// las variantes rotan: el mismo archivo nunca suena dos veces seguidas
export const pistaGb = () => {
  const eventos: Sfx[] = [];
  const giro: Partial<Record<ElementoGb, number>> = {};
  const add = (el: ElementoGb, t: number, vol = 1, dur?: number) => {
    const s = SONIDOS_GB[el], i = (giro[el] = (giro[el] ?? -1) + 1);
    if (t >= 0) eventos.push([+t.toFixed(3), s.archivos[i % s.archivos.length], +(s.vol * vol).toFixed(3), dur ?? s.dur]);
  };
  return { eventos, add };
};
