// Componentes de ccmuslos (props). Los TIEMPOS los pone vlog/ccmuslos/mkov.py (frase del máster → re-mapeo tras el recorte).
const I = "img/ccmuslos/";
export const COMPS: Record<string, [string, any]> = {
  piel: ["ClSkinLayers", { bed: I + "bed_piel.jpg" }],
  ficha: ["ClRecipeCard", { title: "Muslos · 4 platos", rows: [
    { k: "Muslos con piel y hueso", v: "8" }, { k: "Sal", v: "2 cdtas" }, { k: "Pimienta", v: "1 cdta" },
    { k: "Salsa de guajillo", v: "1 ½ tazas" }, { k: "Cebolla en tiras", v: "½" }, { k: "Cilantro picado", v: "al final" } ], mark: "sartén frío, sin aceite", note: "piel abajo" }],
  veinte: ["ClTimer30", { minutes: 20, label: "18-22 min", text: "sin tocarlos" }],
  cinco: ["ClTimer30", { minutes: 5, label: "5 min", text: "del otro lado" }],
  diez: ["ClTimer30", { minutes: 10, label: "8-10 min", text: "salsa alrededor, sin tapa" }],
  antes: ["ClBeforeAfter", { before: I + "antes.jpg", after: I + "despues.jpg", a: "EN ACEITE + SALSA ENCIMA", b: "SU PROPIA GRASA", note: "mismo pollo" }],
  resumen: ["ClCheck", { title: "Los muslos de la fonda", items: ["Secar y salar", "Piel abajo, sartén frío", "Fuego medio, 18-22 min sin tocar", "Voltear, 5 minutos", "Salsa alrededor, nunca encima", "Sin tapa, hasta 80 °C"] }],
  costo: ["ClReceipt", { head: "EL SARTÉN DE MUSLOS", lines: [["8 muslos, 1.5 kg", "US$6.00"], ["Salsa de guajillo", "US$1.20"], ["Cebolla", "US$0.30"], ["Cilantro", "US$0.50"], ["Todo el sartén · 4 platos", "US$8.00"]], total: ["Cada plato", "US$2.00"] }],
  pagina: ["ClBookPage", { page: I + "page30.jpg", pageNo: 30, stamp: "Esta receta, en la página" }],
  qr: ["ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "50 recetas · US$19", kicker: "EL RECETARIO DE LA FONDA" }],
  proximo: ["ClVideoRef", { thumb: I + "th_cccarne.jpg", title: "La carne de la fonda", next: true }],
};
