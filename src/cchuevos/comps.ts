// Componentes de cchuevos (props). Los TIEMPOS los pone vlog/cchuevos/mkov.py (frase del máster → re-mapeo tras el recorte).
const I = "img/cchuevos/";
export const COMPS: Record<string, [string, any]> = {
  termo: ["ClEggThermo", { bed: I + "bed_termo.jpg" }],
  ficha: ["ClRecipeCard", { title: "Huevos de la fonda · 2 platos", rows: [
    { k: "Huevos", v: "4" }, { k: "Agua", v: "2 cdas" }, { k: "Sal y pimienta", v: "al gusto" }, { k: "Tortillas", v: "4" },
    { k: "Salsa roja", v: "½ taza" }, { k: "Manteca (opcional)", v: "1 cdita" } ], mark: "sin aceite", note: "agua + tapa" }],
  dosmin: ["ClTimer30", { minutes: 2, label: "2 min", text: "fuego medio" }],
  treinta: ["ClTimer30", { minutes: 1, label: "30 seg", text: "sin tocarlos", fast: true }],
  noventa: ["ClTimer30", { minutes: 2, label: "90 seg", text: "yema líquida" }],
  antes: ["ClBeforeAfter", { before: I + "antes.jpg", after: I + "despues.jpg", a: "EN MUCHO ACEITE", b: "AGUA Y TAPA", note: "sin una gota de aceite" }],
  resumen: ["ClCheck", { title: "Los huevos de la fonda", items: ["Sartén a fuego medio, 2 min", "La gota tiene que bailar", "Huevos juntitos", "30 segundos sin tocar", "2 cdas de agua alrededor + tapa", "90 seg líquida · 2½ min cremosa"] }],
  costo: ["ClReceipt", { head: "HUEVOS RANCHEROS", lines: [["Huevos, 4", "US$1.20"], ["Tortillas, 4", "US$0.30"], ["Salsa roja, ½ taza", "US$0.50"], ["Manteca (si la usas)", "US$0.10"], ["Los dos platos", "US$2.10"]], total: ["Cada plato", "US$1.05"] }],
  pagina: ["ClBookPage", { page: I + "page55.jpg", pageNo: 55, stamp: "Esta receta, en la página" }],
  qr: ["ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "50 recetas · US$19", kicker: "EL RECETARIO DE LA FONDA" }],
  proximo: ["ClVideoRef", { thumb: I + "th_ccarroz.jpg", title: "Arroz rojo y frijoles refritos", next: true }],
};
