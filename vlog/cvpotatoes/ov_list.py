# Componentes de cvpotatoes (≈5 s, LIMPIO gana a denso). Anclados a la frase exacta del guion.
OV = [
 ("ClDoDont", at("Then you pour the water down the drain"), 5.0, {"yes": {"label": "Raw into the iron"}, "no": {"label": "Boiled, then fried"}}),
 ("ClChip", at("Try to make all the pieces about the same size"), 4.5, {"text": "Same size pieces", "corner": "tl"}),
 ("ClCheck", at("Step one. Three tablespoons of fat"), 9.0, {"title": "INTO THE SKILLET", "items": ["2 lb small potatoes, halved", "3 tbsp lard or bacon fat", "1 tsp kosher salt", "2 tbsp water", "1/2 onion + 2 green chiles", "3 garlic cloves, last 2 min"]}),
 ("ClChip", at("Every one of them, flat side against the pan"), 4.0, {"text": "Cut side down · one layer", "corner": "tl"}),
 ("ClTimer30", at("And the lid goes on right away. Twelve minutes."), 4.5, {"minutes": 12, "text": "12 minutes", "label": "Lid on · don't lift it"}),
 ("ClTimer30", at("Now the lid stays off. And you don't touch them. Eight minutes."), 4.5, {"minutes": 8, "text": "8 minutes", "label": "Lid off · hands off"}),
 ("ClChip", at("And the garlic goes in for the last two minutes"), 4.0, {"text": "Garlic: last 2 minutes", "alert": True, "corner": "tl"}),
 ("ClChip", at("Not the fridge, the cold turns the starch to sugar"), 4.5, {"text": "Store dark & cool · not the fridge", "corner": "tl"}),
 ("ClChip", at("If the potato is green all over"), 4.5, {"text": "Green potato: cut it away or toss it", "alert": True, "corner": "tl"}),
 ("ClReceipt", at("What it costs. Two pounds of small potatoes"), 14.0, {"head": "WHAT IT COSTS", "lines": [["2 lb small potatoes", "$2.60"], ["1/2 onion", "$0.60"], ["2 green chiles", "$1.00"], ["Garlic, fat, salt, herbs", "$0.70"]], "total": ["Per plate (÷6)", "$0.80"]}),
 ("ClBookPage", at("These potatoes are on page forty-six"), 7.0, {"page": I + "page46.jpg", "pageNo": 46, "pageLabel": "PAGE", "stamp": "This recipe, page 46"}),
 ("ClQRCard", at("Or point your phone at this code"), 6.0, {"qr": I + "qr.png", "cover": I + "cover.jpg", "kicker": "THE VAQUERO'S COOKBOOK · $27", "text": "point your phone here"}),
 ("ClChip", at("That's it. Raw into the iron."), 4.0, {"text": "Raw · 2 spoons of water · lid 12 · off 8", "corner": "tl"}),
]
