import json
S={s["sec"]:s for s in json.load(open("C:/Users/bauti/tswwater_tmp/w/secs.json",encoding="utf8"))}
CH=[("HOOK","Water + waste oil = a blue flame"),("MATERIALS","Everything from the scrap pile"),("STEP1","Step 1 · The brake drum burn pot"),("STEP2","Step 2 · The splash plate (the secret)"),
("STEP3","Step 3 · The burner tube, 40 holes"),("STEP4","Step 4 · The lid and the chimney"),("STEP5","Step 5 · The oil line"),("STEP6","Step 6 · The water line"),("STEP7","Step 7 · Settling and straining the oil"),
("STEP8","Step 8 · Dry run and drip rates"),("FIRE","First fire: oil only"),("WATER","Adding the water drip"),("WHY","Why water makes it burn cleaner"),("OILS","What oils you can burn"),
("TEST","My test: hours per liter"),("MISTAKES","5 mistakes to avoid"),("CLEAN","Cleaning it"),("COOK","Bonus: cooking on the lid"),("CLOSE","Recap")]
ts=lambda t:f"{int(t//60)}:{int(t%60):02d}"
chap="\n".join(f"{'0:00' if i==0 else ts(S[k]['a'])} {n}" for i,(k,n) in enumerate(CH))
desc=f"""🔥 A brake drum stove that burns used motor oil with a few drops of WATER — full build with every measurement, the blue flame test and my real numbers (hours per liter, garage temperature). Everything is in the video and below 👇

The same liter of oil went from 3 h 10 min to 5 h 40 min. Water does not burn: dripped onto a red hot splash plate it flashes to steam, blows the oil into a fine mist, and the fire burns clean and blue — so you can turn the oil down and keep the same heat.

WHAT YOU NEED (all scrap):
• 1 old truck brake drum (about 12 in) + 3 bricks
• 3 in steel pipe, 16 in long (burner tube) — 5 rings × 8 holes of 1/4 in = 40 holes
• 1/4 in steel plate (7×7 in square for the bottom + a round lid)
• Small thick steel disc, about 5 in (splash plate), raised 1/2 in on 3 bolts
• 2 plastic jugs, 2 brass needle valves, ~6 ft of 1/4 in copper line, short 1/2 in pipe (feed tube)
• Bolts, stove cement, 5 in stove pipe (chimney at least 10 ft, above the roof line)

DRIP RATES:
• Oil: 1 drop per second (about 2 while heating up)
• Water: 1 drop every 3–4 seconds, ONLY after the splash plate glows dull red (roughly 1 part water to 8–10 parts oil)
• Shut down: water first, let the oil burn 2 more minutes, then close the oil

⚠️ SAFETY: chimney always outside, never in a bedroom or a closed room, carbon monoxide alarm on the wall, fire extinguisher by the door. Never pour water into hot oil — the water only drips onto hot steel on its own line. Never burn gasoline, thinner, antifreeze or brake fluid.

CHAPTERS
{chap}

❓ How cold does your garage get in January? Tell me in the comments.

The presenter is a character. This video uses AI-generated visuals and voice. Results depend on your build, your oil and your weather."""
tags=["waste oil stove","waste oil heater","water drip waste oil burner","used oil stove","brake drum stove","diy heater","garage heater","blue flame burner","waste oil burner","homemade stove","winter heating","scrap metal projects","diy stove no welding","oil drip stove"]
m={"title":"Add WATER to Waste Oil and It Burns Twice as Long! The Old Mechanic's Stove Secret","description":desc,"tags":tags}
json.dump(m,open("public/tswwater_meta.json","w",encoding="utf8"),ensure_ascii=False,indent=1)
print(chap)
