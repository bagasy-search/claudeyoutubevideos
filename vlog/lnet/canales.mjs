// Red Loretta 3x5 — configuración por canal y por video (lo que el director, los componentes y la entrega necesitan).
// Fuente de la cadena: D:/claude-brain/canales/loretta-red/cadena_3x5.md (privado). Acá sólo títulos públicos y links.
export const CANAL = {
  ck: { row: 242, key: "https://www.youtube.com/channel/UC1Mo7nWsj5bHD3dcPuyOw7A", name: "Church Kitchen", full: "Loretta's Church Kitchen",
    book: "Loretta's Church Supper Cookbook", tag: "CHURCH SUPPER COOKBOOK", pdf: "Lorettas-Church-Supper-Cookbook.pdf", bk: "ck",
    url: (s) => `https://cookbook.lorettaschurch.com/?src=${s}`, safety: "temps",
    hashtags: "#churchsupper #oldrecipes #grandmacooking #thanksgiving #churchladyway" },
  fo: { row: 313, key: "draft:lorettaforone", name: "Cooks for One", full: "Loretta Cooks for One",
    book: "Supper for One", tag: "SUPPER FOR ONE", pdf: "Supper-for-One.pdf", bk: "fo",
    url: (s) => `https://lorettaschurch.com/one?src=${s}`, safety: "temps",
    hashtags: "#cookingforone #seniorslivingalone #easysuppers #churchladyway #widowlife" },
  cl: { row: 315, key: "draft:lorettaclean", name: "Clean Home", full: "Loretta's Clean Home",
    book: "The Best Way to Clean It", tag: "THE BEST WAY TO CLEAN IT", pdf: "The-Best-Way-to-Clean-It.pdf", bk: "cl",
    url: (s) => `https://lorettaschurch.com/clean?src=${s}`, safety: "mix",
    hashtags: "#cleaninghacks #oldfashionedcleaning #cleaningtips #churchladyway #grandmatips" },
  fh: { row: 316, key: "draft:lorettafarmhouse", name: "Farmhouse", full: "Loretta's Farmhouse",
    book: "The Bug-Free Farmhouse", tag: "THE BUG-FREE FARMHOUSE", pdf: "The-Bug-Free-Farmhouse.pdf", bk: "fh",
    url: (s) => `https://lorettaschurch.com/farm?src=${s}`, safety: "care",
    hashtags: "#farmhouse #oldfarmtricks #pestcontrol #homesteading #churchladyway" },
  su: { row: 317, key: "draft:lorettasunday", name: "Sunday Morning", full: "Loretta's Sunday Morning",
    book: "52 Sunday Mornings with Loretta", tag: "52 SUNDAY MORNINGS", pdf: "52-Sunday-Mornings-with-Loretta.pdf", bk: "su",
    url: (s) => `https://lorettaschurch.com/sunday?src=${s}`, safety: "none",
    hashtags: "#faith #biblewisdom #churchlady #christianwomen #sundaymorning" },
};
// slug → canal, siguiente del canal y video de la red que nombra (cadena_3x5.md)
export const VIDEO = {
  ckroast: { ch: "ck", prev: "lorroast", next: "ckmash", net: "fodump" },
  ckmash: { ch: "ck", prev: "ckroast", next: "ckgravy", net: "foloaf" },
  ckgravy: { ch: "ck", prev: "ckmash", next: "ckgreenbean", net: "clwasher" },
  fopan: { ch: "fo", prev: null, next: "foloaf", net: "ckroast" },
  foloaf: { ch: "fo", prev: "fopan", next: "fodump", net: "ckmash" },
  fodump: { ch: "fo", prev: "foloaf", next: "focasse", net: "ckgravy" },
  clshower: { ch: "cl", prev: null, next: "cltablet", net: "fhperox" },
  cltablet: { ch: "cl", prev: "clshower", next: "clwasher", net: "ckgravy" },
  clwasher: { ch: "cl", prev: "cltablet", next: "cloven", net: "sufuneral" },
  fhperox: { ch: "fh", prev: null, next: "fhnever", net: "clshower" },
  fhnever: { ch: "fh", prev: "fhperox", next: "fhbug", net: "fopan" },
  fhbug: { ch: "fh", prev: "fhnever", next: "fhfruitfly", net: "suhouse" },
  suhouse: { ch: "su", prev: null, next: "sufuneral", net: "fhbug" },
  sufuneral: { ch: "su", prev: "suhouse", next: "sufamily", net: "ckmash" },
  sufamily: { ch: "su", prev: "sufuneral", next: "suchurch", net: "fopan" },
};
export const SLUGS = Object.keys(VIDEO);
export const chOf = (slug) => CANAL[VIDEO[slug].ch];
// títulos de las tarjetas (incluye las tarjetas 4 que se anuncian) — se completan desde Bagasy en _v3/lnet_cards.json
