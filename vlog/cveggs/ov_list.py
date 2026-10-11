# Componentes de cveggs (≈5 s, LIMPIO gana a denso). Anclados a la frase exacta del guion.
OV = [
 ("ClDoDont", at("Here's how most people fry an egg."), 5.0, {"yes": {"label": "Medium pan, water + lid"}, "no": {"label": "Hot oil, high heat"}}),
 ("ClCheck", at("Let me show you. Two eggs, for one plate."), 9.0, {"title": "WHAT YOU NEED", "items": ["2 fresh eggs", "10-inch cast iron or nonstick skillet", "A lid that fits (or a sheet pan, a plate)", "2 tablespoons of water", "No oil"]}),
 ("ClChip", at("Step one. The empty pan on medium heat."), 4.5, {"text": "Empty pan · MEDIUM · 2 full minutes", "corner": "tl"}),
 ("ClChip", at("Step two. Test it."), 4.5, {"text": "Water drops DANCE = ready", "corner": "tl"}),
 ("ClChip", at("Step four. Two tablespoons of water."), 4.5, {"text": "2 tbsp water AROUND the eggs · not on top", "alert": True, "corner": "tl"}),
 ("ClCheck", at("Step five. Now you wait."), 9.0, {"title": "LID ON · HOW LONG", "items": ["90 seconds · runny yolk", "2½ minutes · jammy yolk", "3½ to 4 minutes · firm yolk"]}),
 ("ClChip", at("So for a crowd, here's how. Twelve eggs."), 4.5, {"text": "Crowd: hot sheet pan · 400°F · 6–8 min", "corner": "tl"}),
 ("ClChip", at("Put it in a glass of water."), 4.5, {"text": "Sinks flat = fresh · floats = toss it", "corner": "tl"}),
 ("ClChip", at("But the USDA says for little kids"), 5.0, {"text": "Kids, elders, pregnant: firm yolk (USDA)", "alert": True, "corner": "tl"}),
 ("ClReceipt", at("What it costs. A dozen large eggs"), 13.0, {"head": "WHAT IT COSTS", "lines": [["2 large eggs", "$0.67"], ["2 corn tortillas", "$0.15"], ["Spoon of salsa", "$0.10"], ["Oil", "$0.00"]], "total": ["Per plate", "$0.92"]}),
 ("ClBookPage", at("These eggs are on page fifty-five."), 7.0, {"page": I + "page55.jpg", "pageNo": 55, "pageLabel": "PAGE", "stamp": "This recipe, page 55"}),
 ("ClQRCard", at("The link is right below this video"), 6.0, {"qr": I + "qr.png", "cover": I + "cover.jpg", "kicker": "THE VAQUERO'S COOKBOOK · $27", "text": "point your phone here"}),
]
