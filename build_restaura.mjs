// build_restaura.mjs — DOCUMENTAL "RESTAURAR MADERA VIEJA/GRIS" (Constructor Libre).
// Tema: la madera gris NO está arruinada — es solo una cáscara muerta de <1mm; se
// recupera con percarbonato de sodio + vinagre + aceite. Historia de Donaldo y el
// juego de madera de sus nietos como hilo conductor.
// PIVOTE: por decisión de producción, los 195 beats son TODOS IMAGEN (no hay clips).
// Cada beat de `_v3/restaura_beats.json` (name con prefijo rst_, ms/phrase reales del
// guión) tiene su foto ya generada en public/img/<name>.png. Anclado al ms EXACTO de
// public/captions_restaura.json (regla dura: nunca por matemática).
// Componentes: KIT PREMIUM themeable (THEME_EARTH) — 66 beats vienen con sugerencia
// `component` en el beats.json; acá se mapean al nombre REAL del kit/premium y se
// llenan con contenido real del guión (proporciones, pasos 1-5, los 5 trucos, los 4
// errores, antes/después). overlays en zona segura (PremiumOverlay), b-roll contiguo
// debajo, avatar PiP abajo-derecha.
// Salida: beatsheet/restaura.json → node beatsheet.mjs beatsheet/restaura.json
import fs from "fs";

const SLUG = "restaura";
const AVATAR = `${SLUG}_opt.mp4`;

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const Wc = caps.map((c) => ({ n: norm(c.text), ms: c.startMs, e: c.endMs }));
// ancla por PREFIJO de hasta 8 tokens del `phrase` real de cada beat (mismo método
// que build_techocalor: nunca matemática, siempre contra el Whisper real).
const at = (phrase, maxTok = 8) => {
  const words = norm(phrase).split(" ").filter(Boolean);
  const t = words.slice(0, Math.min(maxTok, words.length));
  for (let i = 0; i <= Wc.length - t.length; i++) {
    let ok = 1;
    for (let j = 0; j < t.length; j++) if (Wc[i + j].n !== t[j]) { ok = 0; break; }
    if (ok) return Wc[i].ms / 1000;
  }
  return null;
};
const atc = (phrase, maxTok) => { const v = at(phrase, maxTok); if (v == null) console.warn("⚠ anchor missing:", phrase); return v; };
const TOTAL = +((Wc[Wc.length - 1].e) / 1000 + 1.5).toFixed(2);

// ── 0) beats fuente (195, TODOS imagen — pivote de producción) ──────────────────
const srcBeats = JSON.parse(fs.readFileSync(`_v3/${SLUG}_beats.json`, "utf8"));

// ── 1) B-ROLL — 1 imagen por beat, anclada a su `phrase` real, contigua ──────────
const rawBeats = [];
for (const b of srcBeats) {
  const t = atc(b.phrase);
  if (t == null) continue;
  rawBeats.push({ id: b.name, start: +t.toFixed(2), kind: "raw", src: `img/${b.name}.png`, hue: "amber", darken: 0 });
}
rawBeats.sort((x, y) => x.start - y.start);
// B-ROLL CONTIGUO — 0 huecos: cada dur llega hasta el próximo start (+overlap chico anti-flash)
for (let i = 0; i < rawBeats.length; i++) {
  const next = i + 1 < rawBeats.length ? rawBeats[i + 1].start : TOTAL;
  rawBeats[i].dur = +Math.max(0.8, next - rawBeats[i].start + 0.3).toFixed(2);
}

// ── 2) COMPONENTES PREMIUM (THEME_EARTH) — 66 beats con sugerencia `component` ──
// overlay:true → beatsheet.mjs los emite en OVERLAYS por encima del b-roll+avatar.
// `zone` fijo por tipo de componente (mismo criterio de forma que usó techocalor):
// NumberedSteps/VsDuel → "left" (listas/columnas altas), BeforeAfter/HighlightSweep
// → "top" (formato ancho), el resto → "topLeft".
const P = (comp, atPhrase, dur, zone, props = {}, maxTok) => ({ comp, at: atPhrase, dur, zone, props, maxTok });

// ── paso a paso (5 pasos, revelado progresivo — cada beat agrega el paso que
// el guión acaba de narrar, sin repetir la tarjeta completa 5 veces igual) ──
const PASOS = [
  { title: "Limpiar con percarbonato", sub: "levanta el gris de la superficie" },
  { title: "Enjuagar con agua limpia", sub: "manguera o balde y un trapo" },
  { title: "Neutralizar con vinagre", sub: "el secreto que casi nadie hace" },
  { title: "Dejar secar bien", sub: "nunca aceites madera húmeda" },
  { title: "Nutrir con aceite", sub: "una mano generosa, revive el color" },
];
// ── los 5 trucos de los que saben (mismo criterio progresivo) ──
const TRUCOS = [
  { title: "Trabajá a la sombra", sub: "nunca con el sol pegando directo" },
  { title: "Manchas negras: más tiempo", sub: "dejá actuar más rato en esas zonas" },
  { title: "Zonas apenas blandas se salvan", sub: "solo lo podrido de verdad se pierde" },
  { title: "Mantenimiento fácil", sub: "una manito de aceite, una vez por año" },
  { title: "Probá ahora mismo", sub: "raspá un rincón y mirá qué aparece" },
];

const PREMIUM = [
  // ══ BeforeAfter (12) — zone "top" (formato ancho, divisor antes/después) ══
  P("BeforeAfter", "la superficie gris y abajo de ese gris feo aparecio la madera sana con su color con su beta", 6.4, "top", {
    eyebrow: "La prueba rápida", beforeLabel: "Superficie gris", afterLabel: "Madera sana debajo", caption: "Rascás un poco y aparece",
  }),
  P("BeforeAfter", "ese juego gris y feo que iba a terminar en la basura volvio a la vida volvio a tener el color de la madera nueva la superficie", 6.6, "top", {
    eyebrow: "El juego de los nietos", beforeLabel: "Gris, a punto de tirar", afterLabel: "Vivo otra vez",
    beforeImage: "img/rst_s_04.png", afterImage: "img/rst_s_18.png", caption: "De la basura a como nuevo",
  }),
  P("BeforeAfter", "pero ojo eso es solo la cascara es una capa muerta de nada de espesor abajo de ese gris la madera esta", 6.2, "top", {
    eyebrow: "Otra vez la prueba", beforeLabel: "Cáscara muerta", afterLabel: "Madera sana", caption: "Menos de un milímetro de espesor",
  }),
  P("BeforeAfter", "esa capa gris muerta esa fibra degradada sin que vos tengas que lijar la madera literalmente suelta el gris y vuelve", 6.4, "top", {
    eyebrow: "El percarbonato en acción", beforeLabel: "Antes de aplicar", afterLabel: "El gris se suelta solo", caption: "Sin lijar nada",
  }),
  P("BeforeAfter", "una mano generosa de aceite y vas a ver como la madera lo chupa lo toma y de golpe revive el color se hace profundo", 6.6, "top", {
    eyebrow: "El aceite hace su magia", beforeLabel: "Recién limpia", afterLabel: "Color profundo", caption: "La madera lo chupa y revive",
  }),
  P("BeforeAfter", "una madera limpia en una madera como nueva limpiar saca lo muerto el aceite trae la vida de vuelta", 6.8, "top", {
    eyebrow: "El resultado final", beforeLabel: "Gris y opaca", afterLabel: "Como nueva",
    beforeImage: "img/rst_s_02.png", afterImage: "img/rst_s_94.png", caption: "Limpiar saca lo muerto, el aceite trae la vida",
  }),
  P("BeforeAfter", "el sol que pensas que hay que cambiar no hay que cambiarla se limpia se alimenta y vuelve a verse imponente con toda su madera a", 6.4, "top", {
    eyebrow: "La puerta del fondo", beforeLabel: "Gris y apagada", afterLabel: "Imponente otra vez", caption: "No hay que cambiarla, hay que tratarla",
  }),
  P("BeforeAfter", "descalzo se recuperan vuelven a tener color se ponen suaves y con el aceite repelen el agua de nuevo", 6.4, "top", {
    eyebrow: "El deck o la galería", beforeLabel: "Reseca, sin color", afterLabel: "Suave y repele el agua", caption: "Se puede caminar descalzo otra vez",
  }),
  P("BeforeAfter", "los cabos de madera resecos y grises una manito de este tratamiento y vuelven a estar sanos firmes con ese tacto suave", 6.2, "top", {
    eyebrow: "Los mangos de las herramientas", beforeLabel: "Reseco y gris", afterLabel: "Firme y suave", caption: "Una manito de tratamiento alcanza",
  }),
  P("BeforeAfter", "le rompe las fibras y encima el color que deja es un blanco muerto feo artificial nada que ver con el color natural", 6.4, "top", {
    eyebrow: "Cuidado con esto", beforeLabel: "Blanqueada con lavandina", afterLabel: "Color natural sano", caption: "Nada que ver una con la otra",
  }),
  P("BeforeAfter", "zonas deja actuar mas tiempo y se van las medidas para las manchas estan en la descripcion tambien tercer truco y este es de oro para", 6.2, "top", {
    eyebrow: "Las manchas negras", beforeLabel: "Mancha oscura", afterLabel: "Se va con más tiempo", caption: "Solo hay que dejar actuar más",
  }),
  P("BeforeAfter", "te vas a encontrar con la madera sana con su color escondido esperando esa sorpresa esa a mira abajo esta buena", 6.4, "top", {
    eyebrow: "La sorpresa de siempre", beforeLabel: "Gris por fuera", afterLabel: "Color sano escondido", caption: "Casi siempre está ahí, esperando",
  }),

  // ══ BigStatReveal (8) — zone "topLeft" ══
  P("BigStatReveal", "que tiene muerto es la cascara de afuera un milimetro de nada abajo esta perfecto en una tarde te lo dejo como nuevo", 6.0, "topLeft", {
    eyebrow: "Lo único que está muerto", value: 1, prefix: "", suffix: "mm", support: "la cáscara de afuera; abajo está perfecta y en una tarde queda como nueva",
  }),
  P("BigStatReveal", "el que hace que la gente tire toneladas de madera perfectamente buena todos los dias la gente ve una madera gris opaca", 6.0, "topLeft", {
    eyebrow: "Lo que se tira sin necesidad", value: 1, prefix: "", suffix: " tonelada/día", support: "de madera perfectamente buena que termina en el volquete, solo por estar gris",
  }),
  P("BigStatReveal", "primero no es la madera es solo la superficie una capa finita de menos de un milimetro los rayos del sol los ultravioletas", 6.0, "topLeft", {
    eyebrow: "El problema real", value: 1, prefix: "", suffix: "mm", support: "una capa finita — no es la madera, es la superficie que quemó el sol",
  }),
  P("BigStatReveal", "que cuando alguien te dice que una madera gris esta para tirar en el 90% de los casos te esta diciendo", 6.2, "topLeft", {
    eyebrow: "Cuando te dicen “esa madera ya fue”", value: 90, prefix: "", suffix: "%", support: "de las veces están equivocados: solo está gris por fuera",
  }),
  P("BigStatReveal", "neutralizar con vinagre alimentar con aceite cuesta monedas el percarbonato es baratisimo el vinagre lo tenes", 6.0, "topLeft", {
    eyebrow: "Todo el tratamiento", value: 3, prefix: "$", suffix: "", support: "percarbonato, vinagre y aceite — monedas comparado con un mueble nuevo",
  }),
  P("BigStatReveal", "todo con las medidas y los pasos como te gusta lo dividi asi en 40 para que tengas la coleccion completa a mano el dia", 5.8, "topLeft", {
    eyebrow: "Manual de reparaciones caseras", value: 40, prefix: "", suffix: "", support: "arreglos con medidas y pasos, listos para cuando los necesites",
  }),
  P("BigStatReveal", "esa madera no se te vuelve a poner gris si cada tanto una vez por año o cada dos le pasas otra manito de aceite 10", 6.0, "topLeft", {
    eyebrow: "El mantenimiento que la mantiene sana", value: 10, prefix: "", suffix: " min/año", support: "una manito de aceite una vez por año (o cada dos) y no se pone gris nunca más",
  }),
  P("BigStatReveal", "es el momento en que dejas de ver un trasto viejo y empezas a ver una cosa que se puede salvar hacerlo es gratis lleva 10 segundos y", 6.0, "topLeft", {
    eyebrow: "La prueba que te dice todo", value: 10, prefix: "", suffix: "s", support: "gratis, 10 segundos, y sabés si esa madera se salva o no",
  }),

  // ══ ChecklistReveal (7) — zone "topLeft" ══
  P("ChecklistReveal", "a estar como nueva sin lijar durante horas sin cambiar tablas sin gastar una fortuna con cosas que tenes", 7.6, "topLeft", {
    title: "Lo que necesitás (y ya tenés)",
    items: ["Bicarbonato de sodio (o percarbonato)", "Vinagre blanco", "Aceite de lino o de cocina", "Un trapo, una esponja y un balde"],
    stamp: "CERO HERRAMIENTAS RARAS",
  }, 6),
  P("ChecklistReveal", "agua cuanto tiempo dejarlo actuar segun lo castigada que este la madera y las tres recetas que tengo una suave", 7.4, "topLeft", {
    title: "Las 3 recetas (según qué tan castigada esté)",
    items: ["Suave: madera apenas gris", "Media: gris marcado, varios años", "Fuerte: muy castigada o con manchas"],
    stamp: "MEDIDAS EN LA DESCRIPCIÓN",
  }, 5),
  P("ChecklistReveal", "y fijate lo lindo de esto porque aca esta el tema de por que la gente no lo sabe todo este proceso limpiar el gris con percarbonato", 7.2, "topLeft", {
    title: "Los 3 pasos del secreto completo",
    items: ["Limpiar el gris con percarbonato", "Neutralizar con vinagre", "Alimentar con aceite"],
    stamp: "ASÍ DE SIMPLE",
  }, 6),
  P("ChecklistReveal", "cada una de estas te ahorra una fortuna madera oxido humedad goteras plagas caños hasta cosas del auto", 7.6, "topLeft", {
    title: "Lo que cubre el manual completo",
    items: ["Madera", "Óxido", "Humedad y goteras", "Plagas", "Caños", "Hasta cosas del auto"],
    stamp: "40 ARREGLOS",
  }),
  P("ChecklistReveal", "capaz ahora mismo tenes arrumbadas o a punto de tirar dejame que te tiente los muebles de jardin sillas mesas", 7.4, "topLeft", {
    title: "Lo que seguro tenés arrumbado",
    items: ["Sillas de jardín grises", "Una mesa que perdió el color", "La puerta vieja del fondo", "El deck o la galería"],
    stamp: "TODO SE SALVA",
  }, 6),
  P("ChecklistReveal", "esta arruinada tiene una capa muerta de menos de un milimetro arriba y abajo esta sana la prueba del estornillador te dice que esta", 7.4, "topLeft", {
    title: "Repasemos lo importante",
    items: ["No está arruinada: capa muerta de <1mm", "Abajo, la madera está sana", "La prueba del destornillador lo confirma"],
    stamp: "RESUMEN",
  }, 6),
  P("ChecklistReveal", "tres recetas segun lo castigada que este la madera todo numerado y ordenado para que no te confundas abrir la descripcion empezar por", 7.2, "topLeft", {
    title: "Las 3 recetas, numeradas y listas",
    items: ["Suave", "Media", "Fuerte"],
    stamp: "SIN CONFUSIÓN",
  }, 6),

  // ══ CtaCard (7 reales; 3 son el Manual con manual:true) — zone "topLeft" ══
  P("CtaCard", "o muy fuerte asi que abrir la descripcion ahi esta la formula con las medidas justas pero primero seguime que te explico", 7.0, "topLeft", {
    eyebrow: "Las 3 recetas, con medidas exactas", title: "Fórmula del percarbonato",
    bullet: "suave / media / fuerte — todo en la descripción", price: 0, cta: "ABRÍ LA DESCRIPCIÓN",
  }, 6),
  P("CtaCard", "hoy el tema de recuperar madera vieja es uno de los 40 arreglos que junte a lo largo de los años en un manual lo arme", 7.2, "topLeft", {
    eyebrow: "40 arreglos y secretos de los viejos", title: "Manual del Constructor Libre",
    bullet: "madera, óxido, humedad, plagas, caños — con medidas exactas", price: 0, cta: "LINK EN LA DESCRIPCIÓN",
    image: "img/rst_s_65.png",
  }, 6),
  P("CtaCard", "junta y ordenada el enlace esta arriba de todo en la descripcion sigamos que falta lo mejor ahora si el paso a", 7.0, "topLeft", {
    eyebrow: "Recetas + manual completo", title: "Manual del Constructor Libre",
    bullet: "proporciones exactas de percarbonato, vinagre y aceite", price: 0, cta: "LINK ARRIBA DE TODO",
  }, 6),
  P("CtaCard", "tengo reunido junto con otras decenas de arreglos en el manual de reparaciones caseras son 40 soluciones como esta cosas que", 7.2, "topLeft", {
    eyebrow: "40 arreglos y secretos de los viejos", title: "Manual del Constructor Libre",
    bullet: "40 soluciones caseras, con medidas y pasos, para cuando las necesites", price: 0, cta: "LINK EN LA DESCRIPCIÓN",
    image: "img/rst_s_102.png",
  }, 6),
  P("CtaCard", "que la necesites el enlace lo tenes arriba de todo en la descripcion y tambien en el comentario fijado cuesta menos que un mueble nuevo", 7.2, "topLeft", {
    eyebrow: "Cuesta menos que un mueble nuevo", title: "Manual de Reparaciones Caseras",
    bullet: "enlace arriba de todo y en el comentario fijado", price: 0, cta: "LINK EN LA DESCRIPCIÓN",
  }, 6),
  P("CtaCard", "tuyo gratis es el video entero pero si quieres hacer bien las cosas anda la descripcion ahi abajo vas a encontrar dos", 7.0, "topLeft", {
    eyebrow: "Dos cosas te esperan ahí abajo", title: "Las recetas exactas + el manual completo",
    bullet: "todo lo que viste hoy, con medidas", price: 0, cta: "ABRÍ LA DESCRIPCIÓN",
  }, 6),
  P("CtaCard", "cosas arriba de todo el enlace al manual de reparaciones caseras con los 40 reglos completos medidas y pasos por si quieres tener", 7.2, "topLeft", {
    eyebrow: "40 arreglos y secretos de los viejos", title: "Manual del Constructor Libre",
    bullet: "40 arreglos completos, medidas y pasos, todo en un solo lugar", price: 0, cta: "LINK EN LA DESCRIPCIÓN",
    image: "img/rst_s_182.png",
  }, 6),

  // ══ NumberedSteps (12) — zone "left", 5 pasos + 5 trucos revelados progresivo + 2 sueltos ══
  P("NumberedSteps", "paso que es donde se juega todo presta atencion porque cada paso tiene su secreto paso uno la limpieza y el levantado", 6.4, "left", {
    eyebrow: "Paso 1 de 5", title: "El paso a paso completo", steps: PASOS.slice(0, 1),
  }, 6),
  P("NumberedSteps", "se desprenda lo que ya el producto aflojo paso 2 el enjuague con agua limpia con una manguera o con un balde y una", 7.0, "left", {
    eyebrow: "Paso 2 de 5", title: "El paso a paso completo", steps: PASOS.slice(0, 2),
  }, 6),
  P("NumberedSteps", "con su color de vuelta ya en este punto te vas a sorprender de como cambio paso 3 y este es un secreto que casi nadie", 7.4, "left", {
    eyebrow: "Paso 3 de 5", title: "El paso a paso completo", steps: PASOS.slice(0, 3),
  }, 6),
  P("NumberedSteps", "paso 4 dejas secar y aca paciencia esto es fundamental la madera quedo mojada de toda la limpieza y ahora tiene", 7.6, "left", {
    eyebrow: "Paso 4 de 5", title: "El paso a paso completo", steps: PASOS.slice(0, 4),
  }, 6),
  P("NumberedSteps", "nunca nunca selles o aceites madera humeda y paso 5 el que le devuelve la vida de verdad el que hace que la", 8.0, "left", {
    eyebrow: "Paso 5 de 5", title: "El paso a paso completo", steps: PASOS.slice(0, 5),
  }, 6),
  P("NumberedSteps", "que da gusto a agarrar ahora antes de los trucos finales quiero que hablemos de los errores porque hay cuatro que comete", 7.6, "left", {
    eyebrow: "Antes de los trucos", title: "4 errores que arruinan el trabajo",
    steps: [{ title: "Lijar de más" }, { title: "Usar lavandina" }, { title: "No neutralizar y apurar el secado" }, { title: "Mezcla demasiado fuerte" }],
  }, 6),
  P("NumberedSteps", "de los que saben para que te salga perfecto primer truco trabaja la sombra o en un dia nublado nunca con el sol pegando", 6.4, "left", {
    eyebrow: "Truco 1 de 5", title: "Los 5 trucos de los que saben", steps: TRUCOS.slice(0, 1),
  }, 6),
  P("NumberedSteps", "a la sombra con calma trabaja mejor segundo truco para las zonas con manchas negras esas manchitas oscuras que a veces tiene", 7.0, "left", {
    eyebrow: "Truco 2 de 5", title: "Los 5 trucos de los que saben", steps: TRUCOS.slice(0, 2),
  }, 6),
  P("NumberedSteps", "las partes que si estan un poco blandas si al hacer la prueba del destornillador encontraste una zona apenas blanda no podrida", 7.4, "left", {
    eyebrow: "Truco 3 de 5", title: "Los 5 trucos de los que saben", steps: TRUCOS.slice(0, 3),
  }, 6),
  P("NumberedSteps", "de la madera que la gente tira se salva cuarto truco el que le da el mantenimiento facil una vez recuperada y aceitada", 7.6, "left", {
    eyebrow: "Truco 4 de 5", title: "Los 5 trucos de los que saben", steps: TRUCOS.slice(0, 4),
  }, 6),
  P("NumberedSteps", "para siempre y un quinto truco para que te convenzas antes de empezar cualquier trabajo grande anda ahora a cualquier madera", 8.0, "left", {
    eyebrow: "Truco 5 de 5", title: "Los 5 trucos de los que saben", steps: TRUCOS.slice(0, 5),
  }, 6),
  P("NumberedSteps", "te deja las manos vacias la otra te deja algo que vale asi que resumiendo para que te lleves lo importante la madera gris no", 7.6, "left", {
    eyebrow: "Antes de cerrar", title: "Para llevarte lo importante",
    steps: [
      { title: "La madera gris no está arruinada" },
      { title: "Es solo una capa muerta de menos de 1mm" },
      { title: "Se recupera con percarbonato, vinagre y aceite" },
      { title: "Una madera recuperada tiene historia" },
    ],
  }, 6),

  // ══ PullQuote (3: 2 originales + 1 reemplaza el CtaCard del cierre emotivo) — zone "topLeft" ══
  P("PullQuote", "no estan rotas estan cansadas estan sucias estan descuidadas y descuidado no es lo mismo que arruinado el", 5.8, "topLeft", {
    quote: "No están rotas. Están cansadas, están sucias, están descuidadas — y descuidado no es lo mismo que arruinado.",
  }, 6),
  P("PullQuote", "tardes que pasaron alrededor de ella la gente que ya no esta pero que dejo eso una madera nueva no tiene historia una madera recuperada", 6.0, "topLeft", {
    quote: "Una madera nueva no tiene historia. Una madera recuperada te deja algo que vale.",
  }, 6),
  // NOTA DE SCHEMA: rst_s_194 venía sugerido "CtaCard", pero es el cierre emotivo del
  // video (sin venta, "un abrazo grande") — CtaCard fuerza un precio "$" en pantalla que
  // no aplica acá, así que se remapeó a PullQuote (moraleja de cierre, más honesto).
  P("PullQuote", "nadie te haga tirar lo que todavia tiene vida porque casi siempre todavia tiene vida nos vemos en el proximo un abrazo grande", 5.8, "topLeft", {
    quote: "Que nadie te haga tirar lo que todavía tiene vida — porque casi siempre, todavía la tiene.",
  }, 6),

  // ══ VsDuel (1, de los Callout) — zone "left" ══
  P("VsDuel", "lo muerto y respeta lo vivo parecen lo mismo pero son opuestos la bandina arruina per carbonato recupera error", 6.6, "left", {
    eyebrow: "Lo muerto vs. lo vivo", title: "Parecen lo mismo, son opuestos",
    left: { label: "Lavandina", sub: "rompe la fibra, deja un blanco muerto", good: false },
    right: { label: "Percarbonato", sub: "recupera el color natural de la madera", good: true },
  }, 6),

  // ══ MythTruth (4, los 4 errores puntuales) — zone "topLeft" ══
  P("MythTruth", "la diferencia entre un resultado que parece de profesional y uno queda lastima error numero uno el mas comun lijar", 6.2, "topLeft", {
    myth: "Lijar la madera vieja a máquina para sacar el gris",
    truth: "Le arrancás fibra sana; el gris se saca sin lijar nada",
  }, 6),
  P("MythTruth", "la madera de abajo guarda la lija para lo justo error numero 2 y este es grave usar la bandina", 6.2, "topLeft", {
    myth: "Usar lavandina para blanquear la madera gris",
    truth: "Le rompe las fibras y deja un blanco artificial, no el color natural",
  }, 6),
  P("MythTruth", "numero 3 no neutralizar y apurarse con el secado hay gente que limpia ve que quedo lindo y al toque le tira el", 6.2, "topLeft", {
    myth: "Limpiar y aplicar el aceite enseguida, apurando el secado",
    truth: "Hay que dejar secar bien antes de aceitar, o se arruina",
  }, 6),
  P("MythTruth", "aca vale oro error numero 4 mas sutil pero importante hacer la mezcla demasiado fuerte pensando que mas es", 6.2, "topLeft", {
    myth: "Hacer la mezcla bien fuerte pensando “más es mejor”",
    truth: "Una mezcla demasiado fuerte daña la madera en vez de ayudarla",
  }, 6),

  // ══ HighlightSweep (12: 11 de los Callout restantes + 1 reemplaza el CtaCard-teaser) ── zone "top" ══
  P("HighlightSweep", "van rompiendo una sustancia que se llama lignina que es la que le da color y le mantiene pegadas las fibras de la madera cuando la lignina", 5.8, "top", {
    pre: "Los rayos UV rompen la", highlight: "lignina", post: ", la sustancia que le da color y mantiene pegadas las fibras.", note: "por eso se pone gris",
  }, 6),
  P("HighlightSweep", "hago siempre agarras un destornillador o una llave y apretas la punta contra la madera en las zonas mas sospechosas sobre todo", 5.8, "top", {
    pre: "Para saber si se salva,", highlight: "apretá un destornillador contra la madera", post: "en las zonas más sospechosas.", note: "la prueba de los 10 segundos",
  }, 6),
  P("HighlightSweep", "esa madera esta sana es solo gris de superficie y la vas a recuperar perfecto pero si el destornillador se hunde como en un corcho", 5.8, "top", {
    pre: "Si el destornillador entra", highlight: "apenas, como en un corcho blando", post: ", ahí sí está podrida.", note: "el resto casi siempre se salva",
  }, 6),
  P("HighlightSweep", "el resto esta sano asi que la prueba del destornillador es lo primero te dice que esta sano y que no todo lo que esta firme", 5.8, "top", {
    pre: "Si la madera está", highlight: "firme al destornillador", post: ", está sana — solo gris por fuera.", note: "prueba del destornillador",
  }, 6),
  P("HighlightSweep", "largo y sufrido hay un camino mucho mas facil mas rapido y que llega a todos lados el secreto el ingrediente", 5.6, "top", {
    pre: "Hay un ingrediente", highlight: "más rápido, más fácil y más barato", post: "que casi nadie te cuenta.", note: "el percarbonato de sodio",
  }, 6),
  P("HighlightSweep", "gris de años hay una version todavia mas poderosa y mas barata que quiero que conozcas el percarbonato de sodio el percarbonato", 5.6, "top", {
    pre: "El", highlight: "percarbonato de sodio", post: "es más poderoso y más barato que cualquier producto de ferretería.", note: "el ingrediente estrella",
  }, 6),
  P("HighlightSweep", "a mostrar su color de abajo las proporciones exactas cuanto percarbonato o cuanto bicarbonato por litro de", 5.6, "top", {
    pre: "Las proporciones exactas —", highlight: "cuánto percarbonato por litro de agua", post: "— están en la descripción.", note: "medidas justas, sin adivinar",
  }, 6),
  P("HighlightSweep", "que hace la diferencia entre un trabajo bueno y un trabajo profesional las proporciones del vinagre tambien estan abajo en la descripcion", 5.8, "top", {
    pre: "Las proporciones del vinagre hacen la diferencia entre un trabajo", highlight: "bueno y uno profesional", post: ".", note: "medidas en la descripción",
  }, 6),
  P("HighlightSweep", "despacio en arboles que tardaron decadas con una fibra apretada densa dura la madera de hoy la que te venden nueva", 5.6, "top", {
    pre: "La madera de árboles que tardaron", highlight: "décadas en crecer", post: "tiene una fibra apretada y densa.", note: "madera vieja = madera mejor",
  }, 6),
  P("HighlightSweep", "y barata viene de arboles de cultivo rapido esponjosa blanda que se arruina en nada cuando recuperas un mueble viejo", 5.8, "top", {
    pre: "La madera nueva y barata viene de árboles de", highlight: "crecimiento rápido, esponjosa y blanda", post: "— se arruina en nada.", note: "por eso no se comparan",
  }, 6),
  P("HighlightSweep", "o una llave y raspa apenas un rinconcito con cuidado en el sentido de la veta y mira lo que aparece abajo de ese gris casi siempre", 6.0, "top", {
    pre: "Raspá apenas un rinconcito, en el sentido de la veta, y mirá", highlight: "lo que aparece abajo de ese gris", post: ".", note: "casi siempre, buenas noticias",
  }, 6),
  // NOTA DE SCHEMA: rst_s_189 venía sugerido "CtaCard", pero es un teaser del PRÓXIMO
  // video (no vende el manual) — CtaCard fuerza un precio "$" que no aplica; se
  // remapeó a HighlightSweep (frase-gancho, sin odómetro de precio).
  P("HighlightSweep", "que casi nadie te nombra porque cuesta monedas y no le deja ganancia a nadie te va a sorprender no te lo pierdas acordate", 5.8, "top", {
    pre: "Lo que se viene", highlight: "cuesta monedas y no le deja ganancia a nadie contarlo", post: "— no te lo pierdas.", note: "en el próximo video",
  }, 6),
];

// ── ensamblar beats final: raw + premium overlays anclados a su phrase real ──
const beats = [...rawBeats];
let nOv = 0;
const compCount = {};
for (const p of PREMIUM) {
  const s = atc(p.at, p.maxTok);
  if (s == null) continue;
  beats.push({
    id: `ov_${p.comp.toLowerCase()}_${Math.round(s)}`,
    start: +s.toFixed(2),
    dur: p.dur,
    kind: "premium",
    overlay: true,
    comp: p.comp,
    theme: "earth",
    zone: p.zone,
    ...p.props,
  });
  nOv++;
  compCount[p.comp] = (compCount[p.comp] || 0) + 1;
}
beats.sort((a, b) => a.start - b.start);

// ── SEGURIDAD: 1 uso por asset raw — abortar si se repite ──
{
  const used = new Map();
  for (const b of beats) { if (b.kind !== "raw") continue; used.set(b.id, (used.get(b.id) || 0) + 1); }
  const dups = [...used.entries()].filter(([, c]) => c > 1);
  if (dups.length) { console.error("✖ ASSETS REPETIDOS:", dups.map(([n, c]) => `${n}×${c}`).join(", ")); process.exit(1); }
}

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, beats }, null, 1));

// ── AVATAR WINDOWS — regla full-o-full (feedback_video_avatar_full_or_fullvisual):
// NADA de PiP en esquina. El avatar va O a pantalla completa (`full`) O fuera de vista
// (`hidden`, el b-roll/componente manda full). Alterna: full en el hook + slots de ~6s
// cada ~55s ubicados en huecos SIN componente (para no tapar overlays), snapeados al
// inicio de palabra real. `hidden` el resto.
const HOOK_END = 9, PERIOD = 55, SLOT = 6, SEARCH = 26;
const comps = beats.filter((b) => b.kind === "premium").map((b) => [b.start, b.start + (b.dur || 3)]);
const overlapsComp = (a, b) => comps.some(([s, e]) => a < e && b > s);
const snapWord = (tt) => { for (const c of caps) if (c.startMs / 1000 >= tt - 0.05) return c.startMs / 1000; return tt; };
const fulls = [[0, snapWord(HOOK_END)]];
for (let target = HOOK_END + PERIOD; target < TOTAL - 12; target += PERIOD) {
  for (let t = target; t < target + SEARCH; t += 0.5) {
    const s = snapWord(t), e = snapWord(s + SLOT);
    if (e - s >= 4 && e - s <= 9 && !overlapsComp(s, e)) { fulls.push([s, e]); break; }
  }
}
const csw = snapWord(TOTAL - 8);
if (!overlapsComp(csw, TOTAL)) fulls.push([csw, TOTAL - 0.05]);
fulls.sort((a, b) => a[0] - b[0]);
const windows = [];
let cursor = 0;
for (const [s, e] of fulls) {
  if (s > cursor + 0.2) windows.push({ start: +cursor.toFixed(2), mode: "hidden" });
  windows.push({ start: +s.toFixed(2), mode: "full" });
  cursor = e;
}
if (cursor < TOTAL - 0.1) windows.push({ start: +cursor.toFixed(2), mode: "hidden" });
if (windows[0].start !== 0) windows.unshift({ start: 0, mode: windows[0].mode });
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync(
  `src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`
);

// ── resumen ──────────────────────────────────────────────────────────────────
const rawN = beats.filter((b) => b.kind === "raw").length;
const dur = beats.length ? Math.max(...beats.map((b) => b.start + b.dur)) : 0;
console.log(`=== build_restaura BUILD ===`);
console.log(`beats totales ${beats.length} (raw/imagen ${rawN} de ${srcBeats.length} beats fuente) · premium overlays ${nOv} · dur ${(dur / 60).toFixed(1)}min`);
console.log(`overlays por tipo:`, compCount);
console.log(`avatar windows ${windows.length}`);
console.log(`→ beatsheet/${SLUG}.json`);
console.log(`→ src/VideoEdit/avatar_${SLUG}.gen.ts`);
