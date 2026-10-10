// Componentes de cccafe (props). Los TIEMPOS los pone vlog/cccafe/mkov.py (frase del máster → re-mapeo tras el recorte).
const I = "img/cccafe/";
export const COMPS: Record<string, [string, any]> = {
  termo: ["ClCoffeeThermo", { bed: I + "bed_termo.jpg" }],
  ficha: ["ClRecipeCard", { title: "Café de olla · 6 tazas", rows: [
    { k: "Agua", v: "6 tazas" }, { k: "Piloncillo", v: "120 g" }, { k: "Canela en raja", v: "2 rajas" },
    { k: "Clavos de olor", v: "2" }, { k: "Cáscara de naranja (sin lo blanco)", v: "1 tira" },
    { k: "Café molido grueso, tostado oscuro", v: "½ taza" } ], mark: "lo duro hierve, el café no", note: "molido grueso" }],
  siete: ["ClTimer30", { minutes: 7, label: "7 min", text: "hasta que se derrita el piloncillo" }],
  cinco: ["ClTimer30", { minutes: 5, label: "5 min", text: "tapado, con la lumbre apagada" }],
  antes: ["ClBeforeAfter", { before: I + "antes.jpg", after: I + "despues.jpg", a: "HERVIDO 10 MIN", b: "APAGADO + 5 DE REPOSO", note: "mismo grano" }],
  resumen: ["ClCheck", { title: "El café de olla de la fonda", items: ["Agua, piloncillo, canela, clavo y naranja", "7 minutos hirviendo", "Apagas la lumbre", "Café, una vuelta y tapa", "5 minutos de reposo", "Cuelas. Nunca vuelve a hervir"] }],
  costo: ["ClReceipt", { head: "LA OLLA DE CAFÉ", lines: [["Café molido, 45 g", "US$1.10"], ["Piloncillo, 120 g", "US$0.60"], ["Canela", "US$0.30"], ["Clavos y naranja", "US$0.20"], ["Toda la olla · 6 tazas", "US$2.20"]], total: ["Cada taza", "US$0.37"] }],
  pagina: ["ClBookPage", { page: I + "page63.jpg", pageNo: 63, stamp: "Esta receta, en la página" }],
  qr: ["ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "50 recetas · US$19", kicker: "EL RECETARIO DE LA FONDA" }],
  proximo: ["ClVideoRef", { thumb: I + "th_ccrepollo.jpg", title: "El repollo de la fonda", next: true }],
};
