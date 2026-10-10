# Componentes de cvporkchops (≈5 s, LIMPIO gana a denso). Anclados a la frase exacta del guion.
OV = [
 ("CvMeatThermo", at("Whole cuts of pork, chops, roasts"), 6.0, {"from": 70, "to": 145, "label": "USDA: whole cuts of pork", "sub": "+ 3 min rest"}),
 ("ClChip", at("I call it brine, sear, splash, lid"), 4.0, {"text": "Brine · Sear · Splash · Lid", "corner": "tl"}),
 ("ClCheck", at("Step one. The brine."), 8.0, {"title": "THE BRINE", "items": ["4 cups water", "¼ cup kosher salt", "2 tbsp brown sugar", "Stir until dissolved"]}),
 ("ClTimer30", at("Thirty minutes. Set a timer."), 4.5, {"minutes": 30, "text": "30 minutes", "label": "Not overnight"}),
 ("CvMeatThermo", at("You're looking for one hundred and forty-five degrees"), 6.0, {"from": 110, "to": 145, "label": "Thickest part, off the bone", "sub": "Off the heat"}),
 ("ClReceipt", at("Four thick bone-in chops, about three pounds"), 14.0, {"head": "WHAT IT COSTS", "lines": [["4 thick bone-in chops", "$13.00"], ["1 onion", "$1.30"], ["Can of green chiles", "$1.50"], ["Broth, butter, brine, grease", "$1.00"]], "total": ["Per plate (÷4)", "$4.20"]}),
 ("CvMeatThermo", at("His came out at one-sixty-eight"), 5.0, {"from": 120, "to": 168, "label": "His: open pan, flipping", "sub": "Gray · dry"}),
 ("ClDoDont", at("Same chop. Same price."), 5.5, {"yes": {"label": "Brine, sear, splash, lid"}, "no": {"label": "Open pan, flipping"}}),
 ("ClBookPage", at("This pork chop is on page twenty-nine"), 7.0, {"page": I + "page29.jpg", "pageNo": 29, "pageLabel": "PAGE", "stamp": "This recipe, page 29"}),
 ("ClQRCard", at("Or point your phone at this code"), 6.0, {"qr": I + "qr.png", "cover": I + "cover.jpg", "kicker": "THE VAQUERO'S COOKBOOK · $27", "text": "point your phone here"}),
 ("ClChip", at("That's it. Brine, sear, splash, lid."), 4.0, {"text": "Pull it at 145°F", "corner": "tl"}),
]
