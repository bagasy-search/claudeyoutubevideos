# Componentes de cvbeans (≈5 s, LIMPIO gana a denso). Anclados a la frase exacta del guion.
OV = [
 ("ClTimer30", at("set a timer. Two minutes."), 4.5, {"minutes": 2, "text": "2 minutes", "label": "The only hard boil"}),
 ("ClTimer30", at("And walk away. One hour."), 4.5, {"minutes": 59.5, "text": "1 hour", "label": "Heat off · lid on"}),
 ("ClChip", at("Two minutes of hard boiling, then one hour"), 4.0, {"text": "Boil 2 min · Lid on 1 hour", "corner": "tl"}),
 ("ClCheck", at("One smoked ham hock."), 10.0, {"title": "INTO THE POT", "items": ["1 smoked ham hock", "1 white onion, halved", "4 garlic cloves, smashed", "2 dried ancho chiles", "2 tbsp lard", "2 tsp kosher salt"]}),
 ("ClDoDont", at("Then turn it down until you get what I call a lazy bubble"), 5.5, {"yes": {"label": "Lazy bubble, lid cracked"}, "no": {"label": "Hard rolling boil"}}),
 ("ClChip", at("So you take five beans."), 4.0, {"text": "The 5-bean test", "corner": "tl"}),
 ("ClChip", at("those you must boil hard for a full ten minutes"), 4.5, {"text": "Kidney beans: hard boil 10 min", "alert": True, "corner": "tl"}),
 ("ClReceipt", at("What it costs. Two pounds of dry pintos"), 14.0, {"head": "WHAT IT COSTS", "lines": [["2 lb dry pinto beans", "$3.40"], ["Smoked ham hock", "$4.00"], ["1 white onion", "$1.30"], ["Garlic, chiles, lard, salt", "$1.50"]], "total": ["Per plate (÷10)", "$1.02"]}),
 ("ClChip", at("Within two hours, split the beans"), 4.5, {"text": "Cool it within 2 hours", "alert": True, "corner": "tl"}),
 ("ClBookPage", at("These beans are on page twelve"), 7.0, {"page": I + "page12.jpg", "pageNo": 12, "pageLabel": "PAGE", "stamp": "This recipe, page 12"}),
 ("ClQRCard", at("Or point your phone at this code"), 6.0, {"qr": I + "qr.png", "cover": I + "cover.jpg", "kicker": "THE VAQUERO'S COOKBOOK · $27", "text": "point your phone here"}),
 ("ClChip", at("That's it. Two minutes of boiling"), 4.0, {"text": "2 min boil · 1 hr rest · salt first", "corner": "tl"}),
]
