// Componentes de ccfrijoles (props). Los TIEMPOS los pone vlog/ccfrijoles/mkov.py (frase del máster → re-mapeo tras el recorte).
const I = "img/ccfrijoles/";
export const COMPS: Record<string, [string, any]> = {
  ficha: ["ClRecipeCard", { title: "La olla · 8 a 10 platos", rows: [
    { k: "Frijol pinto o bayo", v: "1 kg" }, { k: "Agua", v: "3 litros" }, { k: "Cebolla blanca", v: "½" }, { k: "Ajo", v: "3 dientes" },
    { k: "Manteca de cerdo", v: "2 cdas" }, { k: "Sal", v: "2 cditas" }, { k: "Epazote", v: "1 rama" } ], mark: "o 2 hojas de laurel", note: "sin remojar" }],
  dosmin: ["ClTimer30", { minutes: 2, label: "2 min", text: "hervor fuerte" }],
  unahora: ["ClTimer30", { minutes: 60, label: "1 hora", text: "apagado y tapado", fast: true }],
  fuego: ["ClChip", { text: "Fuego bajo · tapa entreabierta", corner: "tl" }],
  cinco: ["ClChip", { text: "Prueba 5 frijoles, no 1", corner: "tl" }],
  resumen: ["ClCheck", { title: "La olla de la fonda", items: ["Hervor fuerte, 2 minutos", "Apagas, tapas: 1 hora", "El agua no se tira", "Sazón y sal en ese momento", "Fuego bajo, 1½ a 2 horas", "Pruebas 5, no 1"] }],
  refritos: ["ClRecipeCard", { title: "Refritos", rows: [
    { k: "Frijoles cocidos, escurridos", v: "4 tazas" }, { k: "Su caldo", v: "1½ taza" }, { k: "Manteca", v: "4 cdas" },
    { k: "Cebolla picada finita", v: "¼" }, { k: "Sal y queso fresco", v: "al gusto" } ], mark: "machacados, no licuados" }],
  costo: ["ClReceipt", { head: "LA OLLA DE FRIJOLES", lines: [["Frijol pinto, 1 kg", "US$3.00"], ["Cebolla y ajo", "US$0.50"], ["Manteca, 2 cdas", "US$0.15"], ["Epazote o laurel", "US$0.50"], ["Toda la olla · 9 platos", "US$4.15"]], total: ["Cada plato", "US$0.46"] }],
  pagina: ["ClBookPage", { page: I + "page12.jpg", pageNo: 12, stamp: "Esta receta, en la página" }],
  qr: ["ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "50 recetas · US$19", kicker: "EL RECETARIO DE LA FONDA" }],
  proximo: ["ClVideoRef", { thumb: I + "th_cccostillas.jpg", title: "Costillas en la olla de barro", next: true }],
  corte: ["ClBeanCut", { bed: I + "bed_corte.jpg" }],
  antes: ["ClBeforeAfter", { before: I + "antes.jpg", after: I + "despues.jpg", a: "LA BOLSA", b: "3 HORAS DESPUÉS", note: "sin remojo" }],
};
