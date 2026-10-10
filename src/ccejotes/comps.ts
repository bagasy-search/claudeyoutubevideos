// Componentes de ccejotes (props). Los TIEMPOS los pone vlog/ccejotes/mkov.py (frase del máster → re-mapeo tras el recorte).
const I = "img/ccejotes/";
export const COMPS: Record<string, [string, any]> = {
  reloj: ["ClGreenClock", { bed: I + "bed_reloj.jpg" }],
  ficha: ["ClRecipeCard", { title: "Ejotes con tocino · 6 platos", rows: [
    { k: "Ejotes, en trozos de 5 cm", v: "1 kg" }, { k: "Tocino picado", v: "150 g" }, { k: "Cebolla en tiras", v: "½" },
    { k: "Jitomates picados", v: "2" }, { k: "Ajo / chile serrano", v: "2 dientes / 1" }, { k: "Agua", v: "¼ de taza" },
    { k: "Sal", v: "1 cdita" } ], mark: "la tapa: 4 minutos, ni uno más", note: "sin olla" }],
  tapa: ["ClTimer30", { minutes: 4, label: "4 min", text: "tapados, ni uno más" }],
  antes: ["ClBeforeAfter", { before: I + "antes.jpg", after: I + "despues.jpg", a: "HERVIDOS 15 MIN", b: "TAPADOS 4 MIN", note: "mismo ejote" }],
  resumen: ["ClCheck", { title: "Los ejotes de la fonda", items: ["Tocino casi dorado", "Cebolla 3 minutos", "Ejotes y sal", "¼ de taza de agua", "Tapa 4 minutos", "Destapas: jitomate, ajo, chile, hasta secar"] }],
  costo: ["ClReceipt", { head: "EL SARTÉN DE EJOTES", lines: [["Ejotes, 1 kg", "US$5.00"], ["Tocino, 150 g", "US$2.00"], ["Cebolla y 2 jitomates", "US$1.10"], ["Ajo y chile", "US$0.25"], ["Todo el sartén · 6 platos", "US$8.35"]], total: ["Cada plato", "US$1.40"] }],
  pagina: ["ClBookPage", { page: I + "page46.jpg", pageNo: 46, stamp: "Esta receta, en la página" }],
  qr: ["ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "50 recetas · US$19", kicker: "EL RECETARIO DE LA FONDA" }],
  proximo: ["ClVideoRef", { thumb: I + "th_cccafe.jpg", title: "El café de olla de la fonda", next: true }],
};
