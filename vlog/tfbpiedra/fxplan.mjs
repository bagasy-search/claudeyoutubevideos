// tfbpiedra — capa de motion graphics, anclada a la PALABRA (at: [línea, palabra, n-ésima, offset s]).
// ≤12 palabras en pantalla, sin subtítulos corridos. Un "wow" por minuto (marcado ⭐).
// kinds → src/tfb: label · scribble · zoom · step · dial · layer · wipe · prop · errors · qr · freeze
const QR = { qr: "img/tfbpiedra/qr_tfbpiedra.png", cover: "img/tfbpiedra/portada-coleccion.jpg", line1: "La colección del canal", line2: "Escanea con tu teléfono" };
const STEPS = ["La base", "La mezcla", "El colado", "La prueba", "El lavado", "El curado", "El sellado"];
export const FXPLAN = [
  // ---- TRÁILER (0-60 s)
  { kind: "zoom", at: ["t_01", "mira"], until: ["t_02", null, 0, -0.05], p: { path: [[0, 760, 760], [60, 800, 740]], r: 230, zoom: 1.8, label: "¡Apareció esto!", labelDx: 300, labelDy: -260 } }, // ⭐ la lupa de la miniatura
  { kind: "wipe", at: ["t_03", "casas"], until: ["t_04", null, 0, -0.03], p: { beforeSrc: "img/tfbpiedra/wipe_a.png", afterSrc: "img/tfbpiedra/wipe_b.png", beforeLabel: "ANTES", afterLabel: "DESPUÉS", from: 2, to: 26 } }, // ⭐
  { kind: "label", at: ["t_04", "agarre"], dur: 2.6, p: { text: "No resbala como el cemento liso", variant: "yellow", x: 110, y: 800 } },
  { kind: "label", at: ["t_05", "paso"], dur: 2.8, p: { kicker: "Hoy, completo", text: "Base · mezcla · colado · lavado", variant: "white", x: 110, y: 820, size: 58 } },
  { kind: "dial", at: ["t_06", "momento"], until: ["t_07", "ese"], p: { title: "EL MOMENTO EXACTO", needle: [[0, 0.5], [20, 0.5], [55, 0.12], [95, 0.12], [125, 0.9], [170, 0.9], [200, 0.5]], x: 1480, y: 560 }, sfx: "riser" }, // ⭐ loop
  // ---- RECETA (contador de pasos)
  ...["r_02", "r_03", "r_04", "r_05", "r_06", "r_07", "r_08"].map((id, i) => ({ kind: "step", at: [id, null, 0, 0.05], dur: 3.4, p: { n: i + 1, total: 7, title: STEPS[i] } })),
  // ---- S2 base
  { kind: "errors", at: ["s2_05", null, 0, 0], until: ["s2_05b", null, 0, -0.05], p: { title: "LAS 3 PREGUNTAS", icon: "q", items: ["¿Cuándo se lava?", "¿Resbala?", "¿Sin hidrolavadora?"], ats: [8, 42, 80] } },
  { kind: "label", at: ["s2_06", "si"], dur: 2.6, p: { text: "Manguera + cepillo alcanzan", variant: "yellow" } },
  { kind: "layer", at: ["s2_09", null, 0, 0.2], until: ["s2_10", null, 0, 5.5], p: { title: "EL CORTE DEL PISO", slopeLabel: "1 cm por metro", layers: [{ label: "Tierra firme", kind: "soil", h: 80 }, { label: "Grava compactada", dim: "unos 10 cm", kind: "gravel", h: 110 }, { label: "Concreto con piedra", dim: "8 a 10 cm", kind: "concrete", h: 120 }] } }, // ⭐ min 3
  { kind: "label", at: ["s2_11", "centimetro"], dur: 3, p: { kicker: "Pendiente", text: "1 cm por cada metro", variant: "yellow", x: 1180, y: 160 } },
  { kind: "label", at: ["s2_16", "panos"], dur: 3, p: { text: "Paños chicos: llegas a tiempo", variant: "yellow" } },
  // ---- S3 mezcla
  { kind: "errors", at: ["s3_01", "guantes"], until: ["s3_02", null, 0, 0], p: { title: "CEMENTO FRESCO = CÁUSTICO", icon: "check", items: ["Guantes de goma", "Botas", "Gafas"], ats: [2, 22, 40] } },
  { kind: "label", at: ["s3_03", "canto"], dur: 3, p: { kicker: "Canto rodado", text: "Piedra de río de 1 a 2 cm", variant: "yellow", x: 110, y: 120 } },
  { kind: "prop", at: ["s3_07", "una"], until: ["s3_08", "seco"], p: { title: "CON EL MISMO BALDE", note: "primero en seco", items: [{ n: 1, label: "Cemento", color: "#9a9a95" }, { n: 2, label: "Arena", color: "#d8c089" }, { n: 3, label: "Piedra", color: "#a4553a" }], x: 1330, y: 560 } }, // ⭐ min 5
  { kind: "label", at: ["s3_11", "fondo"], dur: 3.2, p: { kicker: "El error", text: "Mucha agua: no aparece nada", variant: "red" } },
  { kind: "label", at: ["s3_12b", "ciento"], dur: 3.6, p: { kicker: "1 m × 2 m × 8 cm", text: "≈ 160 litros de mezcla", variant: "yellow", x: 110, y: 130 } },
  { kind: "qr", at: ["s3_17", null, 0, -0.2], until: ["s3_17", null, 0, 6.2], p: QR },
  // ---- S4 colado
  { kind: "scribble", at: ["s4_03", "zigzag"], dur: 2.6, p: { kind: "underline", from: [520, 900], to: [1400, 880], label: "en zigzag", labelAt: [960, 820] } },
  { kind: "label", at: ["s4_06", "apenas"], dur: 3, p: { text: "Apenas tapadas por la pasta", variant: "yellow" } },
  { kind: "label", at: ["s4_07", "aprietas"], dur: 2.4, p: { text: "Aprietas y lo dejas", variant: "white" } },
  // ---- S5 taller
  { kind: "label", at: ["s5_a4", "irregular"], dur: 3.2, p: { kicker: "Azúcar casera", text: "Resultado irregular", variant: "red", x: 1180, y: 160 } },
  { kind: "label", at: ["s5_a5", "comercial"], dur: 3.2, p: { kicker: "Retardante de superficie", text: "Más parejo, más margen", variant: "yellow", x: 1180, y: 160 } },
  { kind: "label", at: ["s5_06", "ruben"], dur: 3.4, p: { kicker: "Le pasó a un lector", text: "Rubén · Mendoza, Argentina", variant: "white" } },
  { kind: "dial", at: ["s5_09", "calor"], until: ["s5_10", null, 0, 0], p: { title: "LA MISMA MEZCLA", zones: [{ label: "CALOR", to: 0.34, color: "#E0342A" }, { label: "", to: 0.66, color: "#999999" }, { label: "FRÍO", to: 1, color: "#4DA3FF" }], needle: [[0, 0.5], [12, 0.12], [70, 0.12], [95, 0.88], [150, 0.88]], x: 1450, y: 560 } },
  { kind: "label", at: ["s5_10", "adivina"], dur: 3, p: { text: "No se adivina: se prueba", variant: "yellow" } },
  { kind: "qr", at: ["s5_10bx", null, 0, 0], until: ["s5_10bx", null, 0, 5.2], p: QR },
  // ---- S6 la prueba y el lavado
  { kind: "freeze", at: ["s6_02", "suelta"], dur: 2.8, p: { at: 0, tag: "TODAVÍA NO", scribble: { kind: "circle", box: [760, 560, 420, 300], color: "#E0342A" } } },
  { kind: "dial", at: ["s6_04", "firme"], until: ["s6_05", null, 0, 5], p: { title: "EL PUNTO DE LAVADO", needle: [[0, 0.15], [25, 0.15], [60, 0.5]], x: 1480, y: 520 } }, // ⭐ min 11
  { kind: "label", at: ["s6_06", "probando"], dur: 2.6, p: { text: "Probando, no mirando el reloj", variant: "yellow" } },
  { kind: "label", at: ["s6_07", "lluvia"], dur: 2.6, p: { text: "Lluvia fina, no chorro", variant: "yellow" } },
  { kind: "layer", at: ["s6_12", "hasta", 1], until: ["s6_12", null, 0, 9], p: { title: "¿HASTA DÓNDE?", washAt: 40, washLabel: "Un tercio de la piedra", layers: [{ label: "Grava", kind: "gravel", h: 90 }, { label: "Concreto con piedra", kind: "concrete", h: 140 }] } }, // ⭐ min 12
  { kind: "label", at: ["s6_14", "desague"], dur: 3, p: { kicker: "Ojo", text: "La lechada no va al desagüe", variant: "red" } },
  { kind: "errors", at: ["s6_16", "alambre"], until: ["s6_16", null, 0, 5.4], p: { title: "NO USES", items: ["Cepillo de alambre", "Hidrolavadora a fondo"], ats: [0, 45] } },
  // ---- S7 curado
  { kind: "label", at: ["s7_05", "seca"], dur: 3.2, p: { text: "No se seca: se cura", variant: "yellow" } },
  { kind: "label", at: ["s7_06", "siete"], dur: 3, p: { kicker: "Curado", text: "7 días húmedo y tapado", variant: "yellow", x: 110, y: 130 } },
  // ---- S8 terminado + el pago del loop
  { kind: "label", at: ["s8_02", "agarre"], dur: 2.6, p: { text: "Cada piedra da agarre", variant: "yellow" } },
  { kind: "label", at: ["s8_04", "escaleras"], dur: 3.2, p: { kicker: "Escaleras y rampas", text: "Piedra chica, sin brillo", variant: "white" } },
  { kind: "label", at: ["s8_07", "exterior"], dur: 3, p: { kicker: "Etiqueta", text: "Para exterior · piedra o concreto", variant: "yellow", size: 56 } },
  { kind: "dial", at: ["s8_12", "sol"], until: ["s8_13", null, 0, 0], p: { title: "UN MISMO PISO", zones: [{ label: "SOL", to: 0.34, color: "#E0342A" }, { label: "BORDES", to: 0.66, color: "#FFD21F" }, { label: "SOMBRA", to: 1, color: "#4DA3FF" }], needle: [[0, 0.5], [10, 0.15], [60, 0.15], [90, 0.85], [150, 0.5]], x: 1460, y: 540 } },
  { kind: "errors", at: ["s8_14", "secreto"], until: ["s8_15", null, 0, 0], p: { title: "EL SECRETO", icon: "check", items: ["Lava por paños", "Empieza donde fragua primero", "La prueba en cada paño"], ats: [15, 60, 120] } }, // ⭐ pago del loop
  { kind: "qr", at: ["s8_16x", null, 0, -0.3], until: ["s8_17", null, 0, 2], p: QR },
];
