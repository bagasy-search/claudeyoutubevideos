# Componentes de cvribs (≈5 s, LIMPIO gana a denso). Anclados a la frase exacta del guion.
OV = [
 ("ClChip", at("Fifteen to twenty seconds a side, pressing"), 4.0, {"text": "Toast 15-20 s a side · never black", "corner": "tl"}),
 ("ClCheck", at("Step two. Everything goes in the blender."), 10.0, {"title": "INTO THE BLENDER", "items": ["6 guajillo chiles, toasted & soaked", "1 cup orange juice", "Zest of 1 orange", "5 garlic cloves", "2 tbsp cider vinegar", "2 tbsp brown sugar"]}),
 ("ClDoDont", at("It should come about halfway up the ribs"), 5.5, {"yes": {"label": "Sauce halfway up"}, "no": {"label": "Ribs drowned"}}),
 ("ClTimer30", at("Lid on, tight. Into the oven"), 4.5, {"minutes": 119.5, "text": "2 hours", "label": "Lid on · 300°F"}),
 ("ClChip", at("Three hundred. Not three-fifty."), 4.0, {"text": "300°F · low, slow, covered", "corner": "tl"}),
 ("ClChip", at("Grab a bone with your tongs and give it a little twist"), 4.5, {"text": "The twist test", "corner": "tl"}),
 ("ClChip", at("Under the broiler. Rack about six inches"), 5.0, {"text": "Broiler: 3-4 min · 6 in · stand there", "alert": True, "corner": "tl"}),
 ("CvMeatThermo", at("The USDA says pork is safe at a hundred and forty-five"), 6.0, {"from": 70, "to": 145, "label": "USDA: pork is safe", "sub": "+ 3 min rest"}),
 ("CvMeatThermo", at("you want the meat to get up to around a hundred and ninety-five"), 6.0, {"from": 145, "to": 195, "label": "Ribs: cook for tender", "sub": "Collagen melts"}),
 ("ClChip", at("within two hours, put them in the fridge"), 4.5, {"text": "Fridge within 2 hours", "alert": True, "corner": "tl"}),
 ("ClReceipt", at("What it costs. Four pounds of pork spare ribs"), 14.0, {"head": "WHAT IT COSTS", "lines": [["4 lb pork spare ribs", "$14.00"], ["6 guajillo chiles", "$2.40"], ["Orange + 1 cup juice", "$2.00"], ["Garlic, vinegar, sugar, salt, cumin", "$1.00"]], "total": ["Per plate (÷5)", "$3.90"]}),
 ("ClBookPage", at("These ribs are on page thirty-eight"), 7.0, {"page": I + "page38.jpg", "pageNo": 38, "pageLabel": "PAGE", "stamp": "This recipe, page 38"}),
 ("ClQRCard", at("Or point your phone at this code"), 6.0, {"qr": I + "qr.png", "cover": I + "cover.jpg", "kicker": "THE VAQUERO'S COOKBOOK · $27", "text": "point your phone here"}),
 ("ClChip", at("That's it. Melt them first in the pot"), 4.0, {"text": "Melt first · glaze · fire last", "corner": "tl"}),
]
