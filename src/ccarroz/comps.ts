// Componentes de ccarroz (props). Los TIEMPOS los pone vlog/ccarroz/mkov.py (frase del máster → re-mapeo tras el recorte).
const I = "img/ccarroz/";
export const COMPS: Record<string, [string, any]> = {
  medida: ["ClRiceRatio", { bed: I + "bed_medida.jpg" }],
  ficha: ["ClRecipeCard", { title: "Arroz rojo · 6 platos", rows: [
    { k: "Arroz de grano largo", v: "1½ taza" }, { k: "Aceite", v: "3 cdas" }, { k: "Jitomate, cebolla, ajo (licuados)", v: "2 + ¼ + 1" },
    { k: "Caldo caliente", v: "2½ tazas" }, { k: "Zanahoria y chícharos", v: "1 + ½ taza" }, { k: "Chile serrano entero", v: "1" }, { k: "Sal", v: "1 cdita" } ], mark: "lavado y escurrido", note: "una sola vuelta" }],
  ocho: ["ClTimer30", { minutes: 8, label: "8 min", text: "hasta que huela a nuez" }],
  tres: ["ClTimer30", { minutes: 3, label: "3 min", text: "freír el jitomate" }],
  diecio: ["ClTimer30", { minutes: 18, label: "18 min", text: "tapado, sin destapar", fast: true }],
  reposo: ["ClChip", { text: "Apagado y tapado · 5 min de reposo", corner: "tl" }],
  antes: ["ClBeforeAfter", { before: I + "antes.jpg", after: I + "despues.jpg", a: "SIN LAS REGLAS", b: "CON LAS TRES REGLAS", note: "el mismo arroz" }],
  resumen: ["ClCheck", { title: "El arroz de la fonda", items: ["Lavar y escurrir", "Freír 8 min, que huela a nuez", "Jitomate licuado, 3 min", "Caldo caliente + verduras, una vuelta", "Tapa, fuego mínimo, 18 min", "5 de reposo, esponjar con tenedor"] }],
  refritos: ["ClRecipeCard", { title: "Frijoles refritos · 8 platos", rows: [
    { k: "Frijoles de olla", v: "4 tazas" }, { k: "Su caldo", v: "1½ taza" }, { k: "Manteca", v: "4 cdas" }, { k: "Cebolla picada", v: "¼" }, { k: "Queso fresco", v: "al final" } ], mark: "un minuto sin moverlos" }],
  diez: ["ClTimer30", { minutes: 10, label: "10 min", text: "machacando y moviendo", fast: true }],
  costo: ["ClReceipt", { head: "LA COMIDA CORRIDA", lines: [["Arroz rojo, un plato", "US$0.50"], ["Frijoles refritos", "US$0.40"], ["Un muslo en salsa", "US$1.00"], ["Tortillas", "US$0.20"], ["Agua de jamaica", "US$0.20"]], total: ["El plato completo", "US$2.30"] }],
  pagina: ["ClBookPage", { page: I + "page48.jpg", pageNo: 48, stamp: "Esta receta, en la página" }],
  qr: ["ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "50 recetas · US$19", kicker: "EL RECETARIO DE LA FONDA" }],
  proximo: ["ClVideoRef", { thumb: I + "th_ccchuletas.jpg", title: "Chuletas de cerdo jugosas", next: true }],
};
