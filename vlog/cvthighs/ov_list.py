# Componentes de cvthighs (≈5 s, LIMPIO gana a denso). Anclados a la frase exacta del guion.
OV = [
 ("ClDoDont", at("Here's what usually happens. You heat up a pan"), 5.0, {"yes": {"label": "Cold pan, no oil"}, "no": {"label": "Hot pan, pour of oil"}}),
 ("ClCheck", at("Step one. Eight bone-in, skin-on chicken thighs"), 10.0, {"title": "WHAT YOU NEED", "items": ["8 bone-in, skin-on thighs (3 lb)", "Salt and pepper", "½ onion, sliced", "1½ cups red chile sauce", "¼ cup chopped cilantro", "12-inch cast-iron skillet"]}),
 ("ClChip", at("Step two. Lay the thighs skin side down in the cold skillet"), 4.5, {"text": "Skin down · COLD pan · no oil", "corner": "tl"}),
 ("ClTimer30", at("Step three. And now you leave them alone"), 4.5, {"minutes": 20, "text": "18-22 minutes", "label": "Medium heat · don't touch"}),
 ("ClChip", at("Step four. Flip them all, skin side up"), 4.0, {"text": "Flip · 5 min meat side", "corner": "tl"}),
 ("ClChip", at("Pour the sauce around the chicken. Around. Not over it."), 4.5, {"text": "AROUND the chicken · never over", "alert": True, "corner": "tl"}),
 ("ClChip", at("Step six. Turn the heat down to medium-low"), 4.0, {"text": "Medium-low · 8-10 min · no lid", "corner": "tl"}),
 ("ClChip", at("Chicken is safe at one hundred and sixty-five degrees"), 5.0, {"text": "USDA: 165°F · thighs best at 175°F", "corner": "tl"}),
 ("ClReceipt", at("What it costs. Eight bone-in thighs"), 14.0, {"head": "WHAT IT COSTS", "lines": [["8 bone-in thighs (3 lb)", "$6.00"], ["1 can red sauce", "$2.00"], ["Onion, cilantro, salt, pepper", "$1.30"]], "total": ["Per plate (÷4)", "$2.30"]}),
 ("ClBookPage", at("These thighs are on page thirty-one"), 7.0, {"page": I + "page31.jpg", "pageNo": 31, "pageLabel": "PAGE", "stamp": "This recipe, page 31"}),
 ("ClQRCard", at("The link is right below this video"), 6.0, {"qr": I + "qr.png", "cover": I + "cover.jpg", "kicker": "THE VAQUERO'S COOKBOOK · $27", "text": "point your phone here"}),
]
