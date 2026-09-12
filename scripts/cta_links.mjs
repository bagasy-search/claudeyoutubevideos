// A qué página manda cada video, según su título.
//
// POR QUÉ EXISTE: una auditoría de los 15 canales encontró 119 videos públicos
// sin ningún link (~336K vistas tiradas), 6 apuntando a un dominio de un TERCERO
// y varios con el dominio escrito sin `https://` — que YouTube no convierte en
// link. Esto hace que la descripción salga bien sin que nadie se acuerde.
//
// REGLAS DE ORO, aprendidas a los golpes:
//   1. SIEMPRE `https://`. Sin el protocolo, el link no es clickeable.
//   2. SIEMPRE `?src=` para que Hotmart diga qué video vendió.
//   3. Los videos de ALERTA (cáncer, síntoma, coágulo) van a la guía de salud
//      aunque el título diga "piel": mandar a alguien asustado a una página de
//      liftings caseros es sordo y no vende.

const ALERTA = /\b(c[aá]ncer|cancer|alerta|s[ií]ntoma|symptom|advertencia|warning|te grita|aviso|co[aá]gulo|clot|stroke|trombo|danger)\b/i;

/** channel_key (o su sufijo) → destino. `rutas` se evalúa en orden. */
export const CANALES = [
  {
    // Los dos canales Federer en español + Consejos Salud
    match: /@Federer-CanalOficial|@FedererArchivos|UCzOD86VimYIf7fUmU6SH7JQ/i,
    base: "https://drfederer.com",
    src: "yt",
    alerta: "despues-de-60",
    rutas: [
      { slug: "canas", re: /\bcanas?\b|tinte natural|cabello|\bpelo\b|minoxidil|encanec/i,
        linea: "Las canas explicadas: los 3 tipos y qué hacer con cada uno" },
      { slug: "manchas", re: /manchas|melasma|manos envejecid|manos arrugad|guante de romero|edad en las manos/i,
        linea: "El protocolo de noche para las manchas de manos y cara" },
      { slug: "firmeza", re: /firmeza|fl[aá]cid|papada|cuello de pavo|[oó]valo|col[aá]geno|reafirma|\btensa\b|botox verde|piel firme|belleza/i,
        linea: "Firmeza, óvalo y cuello: qué funciona de verdad" },
      { slug: "botox", re: /arrugas|p[aá]rpados|fascia|rostro|lifting|\bcara\b|facial|botox|\bpiel\b/i,
        linea: "Liftings caseros zona por zona, sin agujas" },
      { slug: "despues-de-60", re: /.*/,
        linea: "La guía completa de la salud después de los 60" },
    ],
    pie: "Guía del Dr. Federer — PDF, pago único, garantía de 7 días.",
  },
  {
    // Canal en inglés (The Nightly Remedy / Holistic Health)
    match: /TheNightlyRemedy|Dr\.FedererHolisticHealth|UCoAWQNmh8NrOd3Ug_6XwPLg/i,
    base: "https://docfederer.com",
    src: "yt",
    alerta: "after-60",
    rutas: [
      { slug: "gray-hair", re: /\b(gray|grey|white hair|dye|henna|indigo|roots|shedding|melanin|hair)\b/i,
        linea: "The gray hair method: the 3 kinds and what to do about each" },
      { slug: "age-spots", re: /\b(age spot|dark spot|spots|melasma|pigment|blotch|hands?|liver spot)\b/i,
        linea: "The night protocol for age spots on hands and face" },
      { slug: "botox", re: /\b(botox|lift|lifting|wrinkle|forehead|eyes|jawline|crow)\b/i,
        linea: "At-home lifts, area by area, no needles" },
      { slug: "firm-skin", re: /\b(firm|sagging|sag|jowl|neck|collagen|crepe|crepey|turkey neck|elastic|skin|creams?|beauty|younger|glow|complexion|anti-aging)\b/i,
        linea: "Firmness, jawline and neck: what actually works" },
      { slug: "after-60", re: /.*/,
        linea: "The complete guide to health after 60" },
    ],
    pie: "Dr. Federer's guide — PDF, one-time payment, 7-day guarantee.",
  },
  {
    match: /El Constructor Libre|UC-Xn4lJ35qOcf2px1BkHvEQ/i,
    base: "https://www.constructorlibre.com",
    src: "yt",
    rutas: [
      { slug: "", re: /.*/, linea: "El manual de reparaciones caseras" },
    ],
    pie: "Guía de El Constructor Libre — PDF, pago único, garantía de 7 días.",
  },
];

export function canalDe(channelKey = "") {
  return CANALES.find((c) => c.match.test(channelKey)) || null;
}

/** Devuelve { url, linea, pie } o null si el canal no está configurado. */
export function ctaPara(channelKey, titulo = "") {
  const c = canalDe(channelKey);
  if (!c) return null;
  const slug = (c.alerta && ALERTA.test(titulo))
    ? c.alerta
    : c.rutas.find((r) => r.re.test(titulo)).slug;
  const ruta = c.rutas.find((r) => r.slug === slug) || c.rutas[c.rutas.length - 1];
  const url = `${c.base}${slug ? "/" + slug : "/"}?src=${c.src}`;
  return { url, linea: ruta.linea, pie: c.pie, slug };
}

/** Pega el bloque de CTA al final de una descripción que no tenga link propio. */
export function conCta(descripcion, channelKey, titulo) {
  const cta = ctaPara(channelKey, titulo);
  if (!cta) return { texto: descripcion, cta: null, motivo: "canal sin configurar" };
  if (/https?:\/\/(?!(?:www\.)?youtu)/i.test(descripcion || "")) {
    return { texto: descripcion, cta, motivo: "ya tenía un link, no lo piso" };
  }
  const bloque = `\n\n👉 ${cta.linea}\n${cta.url}\n\n${cta.pie}`;
  return { texto: (descripcion || "").trimEnd() + bloque, cta, motivo: "agregado" };
}
