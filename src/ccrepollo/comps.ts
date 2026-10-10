// Componentes de ccrepollo (props). Los TIEMPOS los pone vlog/ccrepollo/mkov.py (frase del máster → re-mapeo tras el recorte).
const I = "img/ccrepollo/";
export const COMPS: Record<string, [string, any]> = {
  olor: ["ClSmellClock", { bed: I + "bed_reloj.jpg" }],
  ficha: ["ClRecipeCard", { title: "Repollo · 6 platos", rows: [
    { k: "Tocino picado", v: "150 g" }, { k: "Cebolla en tiras", v: "1" }, { k: "Repollo, tiras de 2 cm", v: "1 kg" },
    { k: "Sal", v: "1 cdta" }, { k: "Pimienta y chile de árbol", v: "½ + ½ cdta" },
    { k: "Mantequilla y vinagre", v: "1 + 1 cda" } ], mark: "sin agua y sin tapa", note: "en dos tandas" }],
  doce: ["ClTimer30", { minutes: 12, label: "10-12 min", text: "sin tapa y sin agua" }],
  antes: ["ClBeforeAfter", { before: I + "antes.jpg", after: I + "despues.jpg", a: "HERVIDO 30 MIN", b: "SARTÉN 12 MIN", note: "mismo repollo" }],
  resumen: ["ClCheck", { title: "El repollo de la fonda", items: ["Tocino dorado y fuera", "Cebolla, 4 minutos", "Repollo en dos tandas", "Fuego medio-alto, 10 a 12 min", "Sin tapa y sin agua", "Apagas: mantequilla, tocino y vinagre"] }],
  costo: ["ClReceipt", { head: "EL SARTÉN DE REPOLLO", lines: [["Repollo, 1 kg", "US$2.00"], ["Tocino, 150 g", "US$2.00"], ["Cebolla", "US$0.60"], ["Mantequilla, vinagre, especias", "US$0.30"], ["Todo el sartén · 6 platos", "US$4.90"]], total: ["Cada plato", "US$0.82"] }],
  pagina: ["ClBookPage", { page: I + "page47.jpg", pageNo: 47, stamp: "Esta receta, en la página" }],
  qr: ["ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "50 recetas · US$19", kicker: "EL RECETARIO DE LA FONDA" }],
  proximo: ["ClVideoRef", { thumb: I + "th_ccmuslos.jpg", title: "Los muslos de la fonda", next: true }],
};
