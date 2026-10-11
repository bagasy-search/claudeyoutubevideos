# Componentes de cvcheapmeat (≈5 s, LIMPIO gana a denso). Anclados a la frase exacta del guion.
OV = [
 ("ClDoDont", at("They cook it like a steak"), 5.0, {"yes": {"label": "Low oven, 3 hours, lid on"}, "no": {"label": "Hard boil for an hour"}}),
 ("ClChip", at("Tough means it's not done yet."), 4.5, {"text": "Tough = NOT done yet", "alert": True, "corner": "tl"}),
 ("ClCheck", at("Three pounds of boneless chuck roast"), 10.0, {"title": "WHAT YOU NEED", "items": ["3 lb chuck roast or beef shank", "1 bottle dark beer + 1 tbsp cider vinegar", "1 onion · 4 garlic cloves", "2 dried ancho chiles", "1 lb small potatoes · 3 carrots", "Dutch oven with a tight lid"]}),
 ("ClChip", at("Step two. Brown it."), 4.5, {"text": "Brown in 2 batches · don't crowd", "corner": "tl"}),
 ("ClChip", at("It should come about halfway up the meat."), 4.5, {"text": "Liquid HALFWAY up the meat", "corner": "tl"}),
 ("ClTimer30", at("Lid on, tight. Into the oven at three hundred degrees."), 4.5, {"minutes": 60, "text": "300°F · 2 hours", "label": "Don't open the lid"}),
 ("ClChip", at("One more hour. You're almost there."), 4.0, {"text": "Potatoes + carrots · 1 more hour", "corner": "tl"}),
 ("ClChip", at("Push a fork into a chunk of meat and twist it."), 4.5, {"text": "Fork twist test · falls apart = done", "corner": "tl"}),
 ("ClReceipt", at("What it costs. Three pounds of chuck roast"), 14.0, {"head": "WHAT IT COSTS", "lines": [["3 lb chuck roast", "$21.00"], ["1 bottle dark beer", "$2.00"], ["Onion, chiles, garlic, vinegar, lard", "$2.60"], ["Potatoes + carrots", "$2.00"]], "total": ["Per plate (÷6)", "$4.60"]}),
 ("ClChip", at("Get the leftovers in the fridge within two hours."), 4.5, {"text": "Fridge within 2 hours · reheat to 165°F", "alert": True, "corner": "tl"}),
 ("ClBookPage", at("This beef is on page twenty."), 7.0, {"page": I + "page20.jpg", "pageNo": 20, "pageLabel": "PAGE", "stamp": "This recipe, page 20"}),
 ("ClQRCard", at("The link is right below this video"), 6.0, {"qr": I + "qr.png", "cover": I + "cover.jpg", "kicker": "THE VAQUERO'S COOKBOOK · $27", "text": "point your phone here"}),
]
