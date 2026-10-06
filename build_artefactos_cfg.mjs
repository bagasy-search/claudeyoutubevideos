// Config de "7 Artefactos Antiguos Que No Deberían Existir" para build_dense.mjs
// Imágenes vía spImg → fetch_bing (reales, SIN gpt-image/OpenAI).
export default {
  headlineAt: "hoy vamos a ver siete",
  headline: { tokens: [["7", "hl"], "artefactos", "que", "no", "deberían", ["existir", "hl"]], img: "art_hero", q: "Antikythera mechanism ancient bronze artifact museum", hue: "amber", size: 84 },
  cierreAt: "siete objetos. siete piezas",
  timelineAt: "cada uno, por separado",
  proximoAt: "en el próximo video de crónicas",
  timeline: { eyebrow: "Aparecieron sin previo aviso", title: "Cuándo los desenterramos", events: [
    { year: "1850", label: "Lente de Nimrud" }, { year: "1898", label: "Pájaro de Saqqara" }, { year: "1900", label: "Antikythera" }, { year: "1938", label: "Batería de Bagdad" }, { year: "s. XX", label: "Esferas de Klerksdorp" },
  ] },
  teaser: { tokens: ["Señales", "del", "espacio", "que", "nadie", ["puede explicar", "hl"]], img: "art_space", q: "radio telescope night sky deep space signal", hue: "blue", size: 84 },
  DATA: [
    { at: "numero siete el pilar", n: "07", name: "El pilar de hierro de Delhi", loc: "Delhi, India", age: "≈ 400 d.C.", img: "dl_pillar", imgq: "iron pillar of Delhi India ancient rustless", imgc: "the ancient rustless iron pillar of Delhi", m: 1600, unit: "años", scl: "1.600 años a la intemperie y no se oxida", hue: "amber", stat: { value: 0, prefix: "0", suffix: " óxido", label: "un metal que se cura solo", eyebrow: "Química imposible del s. IV" } },
    { at: "numero seis la batería", n: "06", name: "La batería de Bagdad", loc: "Bagdad, Irak", age: "≈ 2.000 años", img: "bg_battery", imgq: "Baghdad battery ancient clay jar copper cylinder", imgc: "the Baghdad battery clay jar with copper cylinder", m: 1000, unit: "años antes", scl: "electricidad mil años antes de Volta", hue: "blue", stat: { value: 2000, suffix: " años", label: "una pila eléctrica en la antigüedad", eyebrow: "¿Electricidad antes de tiempo?" } },
    { at: "numero cinco la copa", n: "05", name: "La copa de Licurgo", loc: "Imperio Romano", age: "≈ 1.600 años", img: "lc_cup", imgq: "Lycurgus cup Roman dichroic glass green red", imgc: "the Roman Lycurgus cup that changes color", m: 50, unit: "nanómetros", scl: "oro y plata molidos a escala nano", hue: "amber", stat: { value: 50, suffix: " nm", label: "nanotecnología en el año 400", eyebrow: "Cambia de verde a rojo" } },
    { at: "numero cuatro el ojo", n: "04", name: "La lente de Nimrud", loc: "Nimrud (Irak)", age: "≈ 3.000 años", img: "nm_lens", imgq: "Nimrud lens rock crystal ancient Assyrian optical", imgc: "the Nimrud rock-crystal lens", m: 3000, unit: "años", scl: "óptica mil años antes del telescopio", hue: "blue", stat: { value: 3000, suffix: " años", label: "una lente antes de que existieran las lentes", eyebrow: "¿Veían lo invisible?" } },
    { at: "numero tres el pájaro", n: "03", name: "El pájaro de Saqqara", loc: "Saqqara, Egipto", age: "≈ 2.200 años", img: "sq_bird", imgq: "Saqqara bird ancient Egyptian wooden glider model", imgc: "the wooden Saqqara bird with a vertical tail", m: 2200, unit: "años", scl: "una cola vertical como la de un avión", hue: "amber", stat: { value: 1, suffix: " cola vertical", label: "aerodinámica dentro de una tumba", eyebrow: "¿Un planeador egipcio?" } },
    { at: "numero dos las esferas", n: "02", name: "Las esferas de Klerksdorp", loc: "Sudáfrica", age: "2.800 M de años", img: "kl_sphere", imgq: "Klerksdorp spheres grooved metallic South Africa pyrophyllite", imgc: "the grooved metallic Klerksdorp spheres", m: 2800, unit: "M años", scl: "surcos perfectos en roca más vieja que la vida", hue: "red", stat: { value: 3, suffix: " surcos", label: "parecen fabricadas, y son pre-vida", eyebrow: "Dentro de roca de 2.800 M de años" } },
    { at: "el número uno aquello por lo que", n: "01", name: "El mecanismo de Antikythera", loc: "Mar Egeo, Grecia", age: "≈ 2.000 años", img: "an_mech", imgq: "Antikythera mechanism bronze gears ancient analog computer", imgc: "the corroded bronze Antikythera mechanism with gears", m: 2000, unit: "años", scl: "una computadora de bronce, sola en su época", hue: "red", stat: { value: 30, prefix: "+", suffix: " engranajes", label: "1.400 años adelantada a su tiempo", eyebrow: "La computadora imposible" } },
  ],
  // ── COMPONENTES ESTRUCTURADOS EXTRA (variedad, sin depender de gpt-image) ──
  EXTRA: [
    { at: "objetos fuera de lugar", dur: 12.0, kind: "journey", eyebrow: "Objetos fuera de su tiempo", title: "Siete piezas imposibles", accent: "amber", worldImage: "real/pue_worldmap.jpg", waypoints: [
      { x: 0.69, y: 0.53, label: "India", dwell: 1.3, travel: 0.7 }, { x: 0.61, y: 0.47, label: "Irak", dwell: 1.3, travel: 0.7 }, { x: 0.51, y: 0.42, label: "Roma", dwell: 1.3, travel: 0.7 }, { x: 0.55, y: 0.50, label: "Egipto", dwell: 1.3, travel: 0.7 }, { x: 0.55, y: 0.72, label: "Sudáfrica", dwell: 1.3, travel: 0.7 }, { x: 0.55, y: 0.44, label: "Grecia", dwell: 1.3, travel: 0.7 },
    ] },
    { at: "no se oxida", dur: 7.0, kind: "annotated", image: "real/dl_pillar.jpg", eyebrow: "El metal que no envejece", caption: "Pilar de Delhi · 1.600 años sin corrosión", hue: "amber", annotations: [
      { kind: "circle", x: 0.5, y: 0.5, w: 0.14, label: "Superficie intacta bajo el monzón" }, { kind: "underline", x: 0.5, y: 0.82, w: 0.24, label: "Una película que se regenera sola" },
    ] },
    { at: "es una pila", dur: 6.5, kind: "aged", heading: "Una pila, dos mil años antes", eyebrow: "La batería de Bagdad", accent: "accent", hue: "blue", lines: [
      { text: "Cobre, hierro y un ácido adentro." }, { text: "La forma exacta de una batería,", mark: true }, { text: "mil años antes de que", }, { text: "se inventara la electricidad.", mark: true },
    ] },
    { at: "cincuenta nanómetros", dur: 6.0, kind: "callout", figure: "50nm", image: "real/lc_cup.jpg", eyebrow: "Copa de Licurgo", caption: "oro y plata molidos a 50 millonésimas de milímetro — nanotecnología romana", accent: "accent", hue: "amber" },
    { at: "es una lente", dur: 6.0, kind: "annotated", image: "real/nm_lens.jpg", eyebrow: "Óptica imposible", caption: "Lente de Nimrud · cristal pulido hace 3.000 años", hue: "blue", annotations: [
      { kind: "circle", x: 0.5, y: 0.5, w: 0.16, label: "Curvatura pulida a mano" },
    ] },
    { at: "una cola vertical", dur: 6.5, kind: "annotated", image: "real/sq_bird.jpg", eyebrow: "No es un pájaro cualquiera", caption: "Pájaro de Saqqara · la cola vertical solo existe en los aviones", hue: "amber", annotations: [
      { kind: "arrow", x: 0.5, y: 0.35, fromX: 0.75, fromY: 0.2, label: "Cola vertical = estabilizador de vuelo" },
    ] },
    { at: "dos mil ochocientos millones", dur: 6.5, kind: "splitlist", title: "Lo que hace imposible a las esferas", cross: true, palette: "B", items: ["Surcos paralelos perfectos", "Metal, no roca blanda", "En piedra pre-vida (2.800 M años)"] },
    { at: "giraba lentamente", dur: 6.0, kind: "callout", figure: "?", image: "real/kl_sphere.jpg", eyebrow: "Esferas de Klerksdorp", caption: "una giraba sola dentro de su vitrina, sin que nadie la tocara", accent: "danger", hue: "red" },
    { at: "más de treinta engranajes", dur: 7.0, kind: "cross", eyebrow: "Lo que ocultaba el bronce", title: "Dentro de Antikythera", hue: "red", layers: [
      { label: "Carcasa de bronce corroída", depth: "lo que se veía", color: "#7d8a6a", weight: 1.0 }, { label: "+30 engranajes encastrados", depth: "sistema mecánico", color: "#b08d57", weight: 1.3 }, { label: "Dientes de <1 mm", depth: "precisión imposible", color: "#6b4f2a", weight: 1.1 }, { label: "Cálculo del cosmos", depth: "Sol, Luna, eclipses", color: "#9aa6b2", weight: 0.9 },
    ] },
    { at: "un motor a reacción", dur: 6.5, kind: "aged", heading: "Simplemente, no debería estar ahí", eyebrow: "Derek de Solla Price", accent: "danger", hue: "red", lines: [
      { text: "Es como abrir la tumba de un faraón" }, { text: "y encontrar adentro", }, { text: "un motor a reacción.", mark: true },
    ] },
    { at: "no fuimos los primeros", dur: 7.0, kind: "bars", eyebrow: "Cuánto se adelantaron a su época", title: "Siglos antes de tiempo", unit: " años", accent: "accent", hue: "amber", bars: [
      { label: "Antikythera", value: 1400, display: "~1.400" }, { label: "Batería Bagdad", value: 1000, display: "~1.000" }, { label: "Lente Nimrud", value: 1000, display: "~1.000" }, { label: "Copa Licurgo", value: 1500, display: "~1.500" },
    ] },
    { at: "empieza a asomar una idea", dur: 7.0, kind: "checklist", eyebrow: "Una misma sospecha", title: "Lo que comparten los 7", accent: "accent", hue: "amber", items: [
      { text: "Demasiado avanzados para su época", state: "done" }, { text: "Sin antecesores ni herederos conocidos", state: "done" }, { text: "Un saber que se encendió y se apagó", state: "doing" }, { text: "¿Y si no fuimos los primeros?", state: "todo" },
    ] },
  ],
};
