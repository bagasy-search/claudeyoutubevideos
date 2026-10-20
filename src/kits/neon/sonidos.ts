// Sonido del kit neon: UN sonido por micro-elemento, siempre BAJO la voz (la mezcla los baja a la mitad mientras se
// habla). Nada de música ni ambientes. Archivos relativos a public/ (viajan al farm con ASSETS_COMPARTIDOS=sfx).
// neon_on_* y slot_spin = sintéticos del kit (los genera src/kits/neon/scripts/synth_neon.py); el resto, de sfx/lib.
//
// Uso: const s = pista();  s.objeto({t0, colgado: true});  s.fichas({items});  …  → s.eventos  (lista [t, archivo, vol, dur])
// Preview en Remotion: <SfxTrack eventos={s.eventos} hablando={tiempo.speaking} />. Final: mezcla_neon.py (fuera de
// Remotion, como cgordie1) → 0 desfase.

export type Sfx = [number, string, number, number]; // [segundo, archivo en public/, volumen, duración]
const serie = (base: string, n: number, ext = "mp3") => Array.from({ length: n }, (_, i) => `${base}_${i + 1}.${ext}`);

// micro-elemento → variantes (rotan para que el mismo sonido nunca suene dos veces seguidas), volumen y largo
export const SONIDOS = {
  neonOn:      { archivos: serie("sfx/neon/neon_on", 3, "wav"), vol: 0.55, dur: 1.05, nota: "tubo de neón que parpadea y queda zumbando (objeto, bucle, camino verde)" },
  hilo:        { archivos: serie("sfx/lib/light_pass", 7), vol: 0.5, dur: 0.3, nota: "hilo de luz que se tiende hasta el objeto nuevo" },
  vuelo:       { archivos: serie("sfx/lib/whoosh_soft", 8), vol: 0.32, dur: 1.4, nota: "whoosh corto en cada vuelo de cámara" },
  vueloLargo:  { archivos: serie("sfx/lib/whoosh_glass", 3), vol: 0.4, dur: 1.2, nota: "vuelo largo por el bucle hasta el capítulo" },
  capitulo:    { archivos: serie("sfx/lib/impact_soft", 8), vol: 0.6, dur: 0.4, nota: "golpe suave cuando cae el número del capítulo" },
  palabraTit:  { archivos: serie("sfx/lib/tick", 8), vol: 0.22, dur: 0.12, nota: "tic finito por palabra del título" },
  baldosa:     { archivos: serie("sfx/lib/tap", 8), vol: 0.3, dur: 0.35, nota: "cada imagen del collage que cae" },
  tinteRojo:   { archivos: serie("sfx/lib/glitch_soft", 8), vol: 0.22, dur: 0.6, nota: "el collage se tiñe de rojo" },
  colapso:     { archivos: serie("sfx/lib/whoosh_reverse", 8), vol: 0.4, dur: 1.0, nota: "el collage se chupa hacia el bucle" },
  fichaLanza:  { archivos: serie("sfx/lib/swish", 8), vol: 0.32, dur: 0.4, nota: "la ficha sale volando girando" },
  fichaCae:    { archivos: serie("sfx/lib/coin_soft", 8), vol: 0.6, dur: 0.3, nota: "clic de ficha de casino al aterrizar" },
  palanca:     { archivos: serie("sfx/lib/key_soft", 8), vol: 0.45, dur: 0.4, nota: "palanca de la tragamonedas" },
  rodillos:    { archivos: ["sfx/neon/slot_spin.wav"], vol: 0.42, dur: 1.6, nota: "trinquete de los rodillos girando" },
  rodilloFrena:{ archivos: serie("sfx/lib/click_soft", 8), vol: 0.5, dur: 0.25, nota: "cada rodillo que frena" },
  premio:      { archivos: serie("sfx/lib/bell_soft", 8), vol: 0.45, dur: 0.7, nota: "campanita de tragamonedas (777)" },
  vidrio:      { archivos: serie("sfx/lib/glass_ting", 8), vol: 0.4, dur: 0.25, nota: "aparece un panel de vidrio (hoja, vitrina, tarjeta)" },
  tecla:       { archivos: serie("sfx/lib/type_key", 8), vol: 0.16, dur: 0.12, nota: "tecla mientras se escribe la hoja (1 cada ~3 letras)" },
  resaltador:  { archivos: ["sfx/marker_drive.mp3"], vol: 0.35, dur: 0.45, nota: "pasada del resaltador verde" },
  carta:       { archivos: serie("sfx/lib/card_slide", 8), vol: 0.5, dur: 0.3, nota: "naipe que cae / se abre en abanico" },
  giro:        { archivos: serie("sfx/lib/swish", 8), vol: 0.4, dur: 0.4, nota: "la carta se da vuelta" },
  revela:      { archivos: serie("sfx/lib/sparkle", 8), vol: 0.3, dur: 1.0, nota: "brillo al revelar la pregunta" },
  traza:       { archivos: ["sfx/line_draw.mp3"], vol: 0.3, dur: 1.2, nota: "línea que se dibuja (ruta, curva del gráfico)" },
  llegaLinea:  { archivos: ["sfx/line_arrive.mp3"], vol: 0.35, dur: 0.6, nota: "la curva llega al final" },
  luz:         { archivos: serie("sfx/lib/light_pass", 7), vol: 0.45, dur: 0.3, nota: "la luz arranca a correr" },
  desvio:      { archivos: serie("sfx/lib/whoosh_glass", 3), vol: 0.45, dur: 1.1, nota: "la luz dobla por el camino B" },
  acierto:     { archivos: serie("sfx/lib/success", 8), vol: 0.35, dur: 0.9, nota: "llega a B / cierre positivo" },
  aparece:     { archivos: serie("sfx/lib/pop_soft", 8), vol: 0.4, dur: 0.5, nota: "pop de algo que nace (celular, ficha del creador)" },
  toque:       { archivos: serie("sfx/lib/tap", 8), vol: 0.35, dur: 0.3, nota: "dedo que toca la pantalla" },
  desliza:     { archivos: serie("sfx/lib/swish", 8), vol: 0.25, dur: 0.4, nota: "feed que se desliza" },
  aviso:       { archivos: serie("sfx/lib/ding_soft", 8), vol: 0.35, dur: 0.8, nota: "notificación que baja" },
  latido:      { archivos: serie("sfx/lib/sub_drop", 8), vol: 0.4, dur: 0.5, nota: "el disco rojo late" },
  cuenta:      { archivos: ["sfx/counter_up.mp3"], vol: 0.3, dur: 1.0, nota: "cifra que cuenta sola" },
  cifraFin:    { archivos: serie("sfx/lib/confirm", 8), vol: 0.35, dur: 0.6, nota: "la cifra llega y se resalta" },
  repaso:      { archivos: serie("sfx/lib/chime", 8), vol: 0.45, dur: 0.3, nota: "cada palabra del resumen sobre el bucle" },
  sinapsis:    { archivos: serie("sfx/lib/shimmer", 8), vol: 0.25, dur: 0.6, nota: "chispa del cerebro de cristal" },
} as const;
export type Elemento = keyof typeof SONIDOS;
export const ARCHIVOS_SFX = [...new Set(Object.values(SONIDOS).flatMap((s) => [...s.archivos]))];

type P = { t: number; texto?: string }[];
// Constructor de la pista: un método por componente con LOS MISMOS tiempos que le pasás al componente.
export const pista = () => {
  const eventos: Sfx[] = [];
  const giro: Partial<Record<Elemento, number>> = {};
  const add = (el: Elemento, t: number, vol = 1) => {
    const s = SONIDOS[el], i = (giro[el] = (giro[el] ?? -1) + 1);
    if (t >= 0) eventos.push([+t.toFixed(3), s.archivos[i % s.archivos.length], +(s.vol * vol).toFixed(3), s.dur]);
  };
  return {
    eventos, add,
    // nx-objeto-neon (+ tragamonedas / cerebro)
    objeto: (o: { t0: number; colgado?: boolean; forma?: string; activo?: number }) => {
      if (o.colgado) add("hilo", o.t0 - 0.42);
      add("neonOn", o.t0);
      if (o.forma === "tragamonedas") {
        const ta = o.activo ?? o.t0 + 0.5;
        add("palanca", ta - 0.05); add("rodillos", ta);
        [1.0, 1.25, 1.5].forEach((d) => add("rodilloFrena", ta + d));
        add("premio", ta + 1.52);
      }
      if (o.forma === "cerebro" && o.activo !== undefined) add("sinapsis", o.activo);
    },
    bucle: (b: { t0: number }) => { add("neonOn", b.t0, 0.8); add("traza", b.t0, 0.6); },
    // nx-capitulo-bucle: vuelo a lo largo del tubo + número
    capitulo: (c: { tVuelo: number; tNumero: number }) => { add("vueloLargo", c.tVuelo); add("capitulo", c.tNumero); },
    vuelo: (t: number, largo = false) => add(largo ? "vueloLargo" : "vuelo", t),
    titulo: (t0: number, palabras: number, paso = 0.09) => { for (let i = 0; i < palabras; i++) add("palabraTit", t0 + i * paso); },
    // nx-collage-titulo (mismo orden centro→afuera del componente)
    collage: (c: { t0: number; tRojo?: number; tColapso?: number; n?: number }) => {
      for (let o = 0; o < (c.n ?? 9); o++) add("baldosa", c.t0 + o * 0.075, 0.8 + 0.2 * Math.sin(o));
      if (c.tRojo !== undefined) add("tinteRojo", c.tRojo);
      if (c.tColapso !== undefined) add("colapso", c.tColapso);
    },
    // nx-fichas-casino: vuela en it.t (0,55 s) y aterriza con clic
    fichas: (f: { items: P }) => f.items.forEach((it) => { add("fichaLanza", it.t); add("fichaCae", it.t + 0.55); }),
    // nx-hoja-guion: vidrio al entrar, teclas mientras escribe, resaltador
    hoja: (h: { t0: number; renglones: { t: number; texto: string; dur?: number; resaltar?: string; tResaltar?: number }[] }) => {
      add("vidrio", h.t0);
      for (const r of h.renglones) {
        const dur = r.dur ?? Math.max(0.5, r.texto.length / 22);
        const n = Math.max(2, Math.round(r.texto.length / 3));
        for (let i = 0; i < n; i++) add("tecla", r.t + (i / n) * dur, 0.7 + 0.3 * Math.abs(Math.sin(i * 1.7)));
        if (r.resaltar) add("resaltador", r.tResaltar ?? r.t + dur + 0.1);
      }
    },
    // nx-carta-gira
    carta: (c: { t0: number; tGiro: number; abanico?: number }) => {
      add("carta", c.t0 + 0.15); add("giro", c.tGiro); add("revela", c.tGiro + 0.25);
      for (let i = 0; i < (c.abanico ?? 0); i++) add("carta", c.tGiro + 0.35 + i * 0.1, 0.7);
    },
    // nx-camino-ab
    camino: (c: { t0: number; tB: number; tLuz: number; tDesvio: number }) => {
      add("traza", c.t0); add("neonOn", c.tB, 0.7); add("luz", c.tLuz); add("desvio", c.tDesvio); add("acierto", c.tDesvio + 1.2);
    },
    // nx-grafico-linea
    grafico: (g: { paneles: { t: number; dur?: number }[] }) => g.paneles.forEach((p) => { add("vidrio", p.t - 0.4); add("traza", p.t); add("llegaLinea", p.t + (p.dur ?? 1.6) - 0.1); }),
    // nx-celular-ui
    celular: (c: { t0: number; colgado?: boolean; toques?: number[]; aviso?: { t: number }; pulsos?: number[] }) => {
      if (c.colgado) add("hilo", c.t0 - 0.42);
      add("aparece", c.t0);
      (c.toques ?? []).forEach((tq) => { add("toque", tq); add("desliza", tq + 0.12); });
      if (c.aviso) add("aviso", c.aviso.t);
      (c.pulsos ?? []).forEach((p) => add("latido", p));
    },
    // nx-clip-tarjeta
    clip: (c: { t0: number; colgado?: boolean; resaltar?: { t: number }[]; cifra?: { t: number; dur?: number } }) => {
      if (c.colgado) add("hilo", c.t0 - 0.42);
      add("vidrio", c.t0);
      (c.resaltar ?? []).forEach((r) => add("resaltador", r.t));
      if (c.cifra) { add("cuenta", c.cifra.t); add("cifraFin", c.cifra.t + (c.cifra.dur ?? 1.1)); }
    },
    // nx-resumen-bucle: la luz corre por el tubo y suena cada palabra
    resumen: (r: { palabras: P }) => r.palabras.forEach((p) => { add("luz", p.t - 0.45, 0.6); add("repaso", p.t); }),
  };
};
