// Componentes de cccostillas (props). Los TIEMPOS los pone vlog/cccostillas/mkov.py (frase del máster → re-mapeo tras el recorte).
const I = "img/cccostillas/";
export const COMPS: Record<string, [string, any]> = {
  tejido: ["ClRibCut", { bed: I + "bed_tejido.jpg" }],
  ficha: ["ClRecipeCard", { title: "Costillas · 4 a 6 personas", rows: [
    { k: "Costilla de cerdo, trozos de 3 huesos", v: "2 kg" }, { k: "Sal / comino", v: "2 cditas / 1" }, { k: "Chile guajillo", v: "6" },
    { k: "Ajo", v: "5 dientes" }, { k: "Jugo de naranja + ralladura", v: "1 taza" }, { k: "Vinagre de manzana", v: "2 cdas" },
    { k: "Piloncillo rallado", v: "2 cdas" } ], mark: "la ralladura ANTES de exprimir", note: "olla tapada" }],
  remojo: ["ClTimer30", { minutes: 15, label: "15 min", text: "chiles en agua caliente", fast: true }],
  doshoras: ["ClChip", { text: "Tapadas · fuego bajo · 2 horas", corner: "tl" }],
  tapa: ["ClChip", { text: "Cada destapada: +10 minutos", corner: "tl" }],
  comal: ["ClTimer30", { minutes: 4, label: "3 a 4 min", text: "comal bien caliente" }],
  antes: ["ClBeforeAfter", { before: I + "antes.jpg", after: I + "despues.jpg", a: "CRUDA", b: "2½ HORAS DESPUÉS", note: "sin parrilla" }],
  resumen: ["ClCheck", { title: "Las costillas de la fonda", items: ["Sal y comino", "Salsa de guajillo y naranja", "Líquido a la mitad", "Tapadas, fuego bajo, 2 horas", "Hasta que el hueso gire", "Reduces, barnizas, 3-4 min al comal"] }],
  costo: ["ClReceipt", { head: "LA OLLA DE COSTILLAS", lines: [["Costilla, 2 kg", "US$13.00"], ["6 chiles guajillo", "US$0.75"], ["3 naranjas", "US$1.50"], ["Ajo, vinagre, piloncillo, sal", "US$0.65"], ["Toda la olla · 5 platos", "US$15.90"]], total: ["Cada plato", "US$3.20"] }],
  pagina: ["ClBookPage", { page: I + "page38.jpg", pageNo: 38, stamp: "Esta receta, en la página" }],
  qr: ["ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "50 recetas · US$19", kicker: "EL RECETARIO DE LA FONDA" }],
  proximo: ["ClVideoRef", { thumb: I + "th_ccejotes.jpg", title: "Ejotes con ¼ de taza de agua", next: true }],
};
