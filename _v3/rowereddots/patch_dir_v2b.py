p = "D:/Proyectos/video2-wt/rowereddots/_v3/rowereddots/v2_director.mjs"
s = open(p, encoding="utf-8").read()
extra = '''  ["checklist", "It is not a blood clot."],
  ["datoimpacto", "the majority of us have at least some"],
  ["carrusel", "Hormones can play a part"],
  ["freezezoom", "a little cluster of round red or purple pockets"],
  ["datoimpacto", "over just a few weeks or months, mention it at your next visit"],
  ["callout", "What gives them away is behavior."],
  ["checklist", "That can happen with low platelets"],
];'''
a = '''  ["splitcompare", "That is not the same thing as a round cherry dot."],
];'''
assert a in s; s = s.replace(a, '  ["splitcompare", "That is not the same thing as a round cherry dot."],\n' + extra)
a = '''{ text: "A sore that won't heal", atP: "open sore that doesn't heal." }, { text: "The ugly duckling", atP: "the one spot that looks different" }], stamp: "See your doctor", stampAtP: "Dermatologists call that the ugly duckling sign", endP: "most useful rules you can learn." }'''
b = '''{ text: "A sore that won't heal", atP: "open sore that doesn't heal." }], stamp: "Or: the ugly duckling", stampAtP: "the one spot that looks different", endP: "looks different from all the others." }'''
assert a in s; s = s.replace(a, b)
a = '''{ name: "Not cancer", img: I("rd_dr_benign") }, { name: "Respect the glass test", img: I("rd_glass_shin") }], revealP: ["They're not your liver", "they're not contagious", "they don't turn into cancer", "respect the glass test"], endP: "a doctor hasn't looked at."'''
b = '''{ name: "Not cancer", img: I("rd_dr_benign") }], revealP: ["They're not your liver", "they're not contagious", "they don't turn into cancer"], endP: "a few spots that are serious."'''
assert a in s; s = s.replace(a, b)
open(p, "w", encoding="utf-8").write(s)
g = "D:/Proyectos/video2-wt/rowereddots/_v3/rowereddots/gen.mjs"
t = open(g, encoding="utf-8").read()
t = t.replace("myth2: 20, redflags: 30,", "myth2: 18, redflags: 20,").replace("carouselrecap: 24,", "carouselrecap: 20,")
open(g, "w", encoding="utf-8").write(t)
print("ok")
