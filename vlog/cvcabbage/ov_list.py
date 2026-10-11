# Componentes de cvcabbage (≈5 s, LIMPIO gana a denso). Anclados a la frase exacta del guion.
OV = [
 ("CvPromise", at("Last time it was the steak"), 7.0, {"title": "Fried cabbage they fight over", "lines": ["No boiled-cabbage smell", "Browned and sweet in bacon fat", "A whole head for under $3"]}),
 ("CvOldPhoto", at("I'm Claudio. I cooked for a cattle crew"), 7.5, {"img": I + "joven.jpg", "caption": "Winter supply run, 1987", "date": "'87 01 22", "stamp": "40 years · 14 men"}),
 ("ClDoDont", at("They hate boiled cabbage"), 5.0, {"yes": {"label": "Fried, open pan"}, "no": {"label": "Boiled, lid on"}}),
 ("ClCheck", at("Here's what you need. Six strips of bacon"), 10.0, {"title": "WHAT YOU NEED", "items": ["6 strips bacon", "1 onion, sliced", "1 head green cabbage (2½ lb)", "1 tsp salt · ½ tsp pepper", "½ tsp red chile flakes", "1 tbsp butter + 1 tbsp cider vinegar"]}),
 ("ClChip", at("cut it across into ribbons about an inch wide"), 4.0, {"text": "Ribbons · one inch wide", "corner": "tl"}),
 ("ClChip", at("Step one. The bacon goes in the pot, cold"), 4.5, {"text": "Bacon in COLD · then medium", "corner": "tl"}),
 ("ClTimer30", at("Step four. Now ten to twelve minutes"), 4.5, {"minutes": 12, "text": "10-12 minutes", "label": "No lid · no water"}),
 ("ClChip", at("Step five. Turn the heat off"), 4.0, {"text": "Heat OFF · then the finish", "corner": "tl"}),
 ("ClChip", at("And a tablespoon of apple cider vinegar. Right over the top."), 4.5, {"text": "1 tbsp cider vinegar · at the very end", "alert": True, "corner": "tl"}),
 ("ClChip", at("It should feel heavy for its size"), 4.0, {"text": "Heavy for its size · tight shiny leaves", "corner": "tl"}),
 ("ClReceipt", at("What it costs. One head of cabbage"), 14.0, {"head": "WHAT IT COSTS", "lines": [["1 head green cabbage", "$2.20"], ["6 strips bacon", "$2.40"], ["1 onion", "$1.30"], ["Butter, vinegar, salt, chile", "$0.60"]], "total": ["Per plate (÷6)", "$1.10"]}),
 ("ClBookPage", at("This cabbage is on page forty-seven"), 7.0, {"page": I + "page47.jpg", "pageNo": 47, "pageLabel": "PAGE", "stamp": "This recipe, page 47"}),
 ("ClQRCard", at("The link is right below this video"), 6.0, {"qr": I + "qr.png", "cover": I + "cover.jpg", "kicker": "THE VAQUERO'S COOKBOOK · $27", "text": "point your phone here"}),
]
