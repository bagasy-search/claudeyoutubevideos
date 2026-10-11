# Componentes de cvsteak (≈5 s, LIMPIO gana a denso). Anclados a la frase exacta del guion.
OV = [
 ("ClChip", at("The cooks in fancy restaurants call it a reverse sear"), 4.5, {"text": "Slow oven first · smoking pan last", "corner": "tl"}),
 ("ClCheck", at("Step one is the steak itself"), 8.0, {"title": "THE STEAK", "items": ["Ribeye, 1½ inches thick", "About 1½ lb · feeds 2-3", "1½ tsp kosher salt", "Salt the night before"]}),
 ("ClChip", at("It's not the fire. It's a dry steak."), 4.0, {"text": "The secret: a dry steak", "corner": "tl"}),
 ("ClChip", at("Step three. Heat the oven to two hundred and fifty degrees"), 4.5, {"text": "Oven 250°F · wire rack", "corner": "tl"}),
 ("CvMeatThermo", at("You're looking for one hundred and fifteen degrees in the middle"), 6.0, {"from": 40, "to": 115, "mark": 115, "over": 145, "label": "Pull from the oven", "sub": "Medium-rare · it rises ~15°"}),
 ("CvMeatThermo", at("The USDA says whole cuts of beef should be cooked"), 6.5, {"from": 70, "to": 145, "mark": 145, "over": 160, "label": "USDA: whole cuts of beef", "sub": "+ 3 min rest"}),
 ("ClTimer30", at("Step five. Steak in. Listen to that. Ninety seconds."), 4.5, {"minutes": 1.5, "text": "90 seconds", "label": "Don't move it"}),
 ("ClCheck", at("Step six. Turn the heat down to medium."), 7.0, {"title": "THE BASTE", "items": ["Heat down to medium", "2 tbsp butter", "3 garlic cloves, smashed", "Rosemary or thyme · 30 seconds"]}),
 ("ClChip", at("Rest it five minutes"), 4.0, {"text": "Rest 5 minutes", "corner": "tl"}),
 ("ClDoDont", at("Now cut it. Across the grain."), 5.5, {"yes": {"label": "Across the grain"}, "no": {"label": "Along the grain"}}),
 ("ClCheck", at("Let me give you the numbers, so you can write them down"), 10.0, {"title": "PULL FROM THE OVEN AT", "items": ["Rare · 105°F", "Medium-rare · 115°F", "Medium · 130°F (lands ~145°F)", "Medium-well · 140°F"]}),
 ("ClReceipt", at("What it costs. A pound-and-a-half ribeye"), 14.0, {"head": "WHAT IT COSTS", "lines": [["1½ lb ribeye", "$22.50"], ["Butter, garlic, rosemary", "$1.00"], ["Lard, salt, pepper", "$0.50"]], "total": ["Per plate (÷3)", "$8.00"]}),
 ("ClBookPage", at("This ribeye is on page thirty"), 7.0, {"page": I + "page30.jpg", "pageNo": 30, "pageLabel": "PAGE", "stamp": "This recipe, page 30"}),
 ("ClQRCard", at("Or point your phone at this code"), 6.0, {"qr": I + "qr.png", "cover": I + "cover.jpg", "kicker": "THE VAQUERO'S COOKBOOK · $27", "text": "point your phone here"}),
]
