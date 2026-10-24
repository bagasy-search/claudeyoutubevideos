# mkmeta.py — título + descripción (CTA en el renglón 1, capítulos del plan) → public/plo30olor_meta.json
import json
W = "D:/wt/plo30olor"
plan = json.load(open(f"{W}/src/plo30olor/plan.json", encoding="utf8"))
NOM = {"HOOK": "El olor que vuelve aunque limpies", "CAUSA": "De dónde sale de verdad el olor a cloaca", "RECETA": "La receta de la taza (cantidades y orden)",
       "DIAGNOSTICO": "Cómo saber qué desagüe es (3 pruebas)", "D1": "1. Fregadero de la cocina", "D2": "2. Lavabo y tapón automático", "D3": "3. Regadera",
       "D4": "4. Tina y rebosadero", "D5": "5. Coladera del piso", "D6": "6. Coladera del patio", "D7": "7. Lavadora", "D8": "8. Lavavajillas",
       "D9": "9. Inodoro: ¿adentro o en la base?", "D10": "10. El baño que nadie usa", "ERRORES": "Los errores que empeoran el olor",
       "MAESTRO": "El truco del plomero viejo", "D11": "11. El rebosadero que nadie limpia", "RUTINA": "La rutina para que no vuelva nunca",
       "PREGUNTAS": "Preguntas frecuentes", "CIERRE": "Resumen final"}
fmt = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
caps, vistos = ["0:00 El olor que vuelve aunque limpies"], {"HOOK"}
for s in plan["secs"]:
    k = s["k"]
    if k in NOM and k not in vistos and s["a"] > 5:
        vistos.add(k); caps.append(f"{fmt(s['a'])} {NOM[k]}")
desc = "\n".join([
    "🚰 El olor a cloaca de cada desagüe + 50 arreglos más por menos que UNA visita del plomero 👉 https://guia-desague-claudio.vercel.app",
    "",
    "Ese olor a huevo podrido que vuelve aunque limpies con cloro no sale del piso ni del inodoro: sale de adentro del desagüe, donde el cloro no llega. "
    "En este video te enseño a usar UNA taza de bicarbonato en cada desagüe de tu casa, uno por uno (cocina, lavabo, regadera, tina, coladeras, lavadora, "
    "lavavajillas, inodoro, el baño que nadie usa y el rebosadero), con cantidades, tiempos y el orden correcto, y la rutina para que el olor no vuelva nunca.",
    "",
    "⚠️ Nunca mezcles productos de limpieza entre sí, y menos cloro con vinagre. Usa guantes.",
    "",
    "CAPÍTULOS",
    *caps,
    "",
    "👉 Suscríbete y activa la campanita: cada semana un arreglo de plomería que te ahorra la visita.",
    "💬 Cuéntame en los comentarios: ¿de qué desagüe sale el olor en tu casa?",
    "",
    "#plomería #olorAcloaca #desagüe #bicarbonato #trucosdeplomero",
])
assert "<" not in desc and ">" not in desc and len(desc) <= 5000, len(desc)
json.dump({"title": "1 taza de esto quita el olor a cloaca de cualquier desagüe para siempre", "description": desc},
          open(f"{W}/public/plo30olor_meta.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
print(len(desc), "caracteres ·", len(caps), "capítulos"); print("\n".join(caps))
