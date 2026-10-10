// Componentes de cccarne (props). Los TIEMPOS los pone vlog/cccarne/mkov.py (frase del máster → re-mapeo tras el recorte).
const I = "img/cccarne/";
export const COMPS: Record<string, [string, any]> = {
  reloj: ["ClMeatClock", { bed: I + "bed_reloj.jpg" }],
  ficha: ["ClRecipeCard", { title: "Carne de olla · 6 platos", rows: [
    { k: "Chambarete, trozos de 7 cm", v: "1.5 kg" }, { k: "Sal y pimienta", v: "2 + 1 cdtas" }, { k: "Manteca", v: "2 cdas" },
    { k: "Cebolla, 4 ajos, 2 chiles", v: "1" }, { k: "Jitomate y vinagre", v: "2 + 2 cdas" },
    { k: "Cerveza oscura o caldo", v: "1 taza" } ], mark: "líquido a la mitad", note: "+ papas y zanahorias" }],
  dos: ["ClTimer30", { minutes: 30, label: "2 horas", text: "sin destapar" }],
  una: ["ClTimer30", { minutes: 30, label: "+1 hora", text: "tapado, fuego mínimo" }],
  antes: ["ClBeforeAfter", { before: I + "antes.jpg", after: I + "despues.jpg", a: "BISTEC AL SARTÉN", b: "3 HORAS EN LA OLLA", note: "mismo corte" }],
  resumen: ["ClCheck", { title: "La carne de la fonda", items: ["Sal 20 minutos antes", "Dorar en dos tandas", "Cebolla, ajo y chile raspando", "Jitomate, vinagre y cerveza", "Líquido a la mitad, tapa", "Fuego mínimo, 3 horas"] }],
  costo: ["ClReceipt", { head: "LA OLLA DE CARNE", lines: [["Chambarete, 1.5 kg", "US$18.00"], ["Cerveza", "US$1.00"], ["Jitomate, cebolla, ajo, chiles", "US$2.00"], ["Papas, zanahorias, manteca", "US$1.70"], ["Toda la olla · 6 platos", "US$22.70"]], total: ["Cada plato", "US$3.80"] }],
  pagina: ["ClBookPage", { page: I + "page20.jpg", pageNo: 20, stamp: "Esta receta, en la página" }],
  qr: ["ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "50 recetas · US$19", kicker: "EL RECETARIO DE LA FONDA" }],
  proximo: ["ClVideoRef", { thumb: I + "th_cchuevos.jpg", title: "Los huevos de la fonda", next: true }],
};
