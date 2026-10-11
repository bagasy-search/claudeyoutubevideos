// Componentes de ccchuletas (props). Los TIEMPOS los pone vlog/ccchuletas/mkov.py (frase del máster → re-mapeo tras el recorte).
const I = "img/ccchuletas/";
export const COMPS: Record<string, [string, any]> = {
  temp: ["ClPorkTemp", { bed: I + "bed_temp.jpg" }],
  ficha: ["ClRecipeCard", { title: "Chuletas en rajas · 4 platos", rows: [
    { k: "Chuletas con hueso, 2½ cm", v: "4" }, { k: "Salmuera: agua fría", v: "1 litro" }, { k: "Sal + azúcar", v: "4 + 2 cdas" },
    { k: "Pimienta y chile ancho", v: "1 cdita" }, { k: "Manteca", v: "2 cdas" }, { k: "Cebolla + poblanos en rajas", v: "1 + 2" },
    { k: "Caldo", v: "½ taza" }, { k: "Mantequilla", v: "1 cda" } ], mark: "gruesas, como un pulgar acostado", note: "sin sal al sazonar" }],
  treinta: ["ClTimer30", { minutes: 30, label: "30 min", text: "en la salmuera, no más", fast: true }],
  diez: ["ClTimer30", { minutes: 10, label: "10 min", text: "los poblanos sudan", fast: true }],
  tres: ["ClTimer30", { minutes: 3, label: "3 min", text: "por lado, sin moverlas" }],
  rajas: ["ClTimer30", { minutes: 3, label: "3 min", text: "cebolla y rajas" }],
  seis: ["ClTimer30", { minutes: 8, label: "6-8 min", text: "tapado, fuego bajo", fast: true }],
  sesenta: ["ClChip", { text: "63 °C · 145 °F · ahí la saco", corner: "tl" }],
  reposo: ["ClChip", { text: "Destapado · 5 min de reposo", corner: "tl" }],
  antes: ["ClBeforeAfter", { before: I + "antes.jpg", after: I + "despues.jpg", a: "DELGADA Y APLASTADA", b: "GRUESA, SALMUERA Y 63°", note: "el mismo cerdo" }],
  resumen: ["ClCheck", { title: "Las chuletas del viernes", items: ["Gruesas, 2½ cm", "Salmuera 30 min, no más", "Secar bien · pimienta y chile, sin sal", "3 min por lado, sin moverlas", "Rajas, caldo, tapar a fuego bajo", "Sacar a 63 °C · mantequilla · 5 de reposo"] }],
  costo: ["ClReceipt", { head: "EL PLATO DEL VIERNES", lines: [["4 chuletas gruesas", "US$8.00"], ["Poblanos y cebolla", "US$1.50"], ["Manteca, mantequilla, chile, sal", "US$1.00"], ["Caldo de huesos", "centavos"]], total: ["Cada chuleta con sus rajas", "US$2.60"] }],
  temporada: ["ClCheck", { title: "La temporada de la fonda", fast: true, items: ["Frijoles de olla", "Costillas", "Ejotes", "Café de olla", "Repollo", "Muslos en salsa", "Carne que se deshace", "Huevos del desayuno", "Arroz y refritos", "Chuletas en rajas"] }],
  pagina: ["ClBookPage", { page: I + "page29.jpg", pageNo: 29, stamp: "Esta receta, en la página" }],
  qr: ["ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "50 recetas · US$19", kicker: "EL RECETARIO DE LA FONDA" }],
};
