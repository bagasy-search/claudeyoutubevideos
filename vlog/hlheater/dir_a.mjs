// DIRECTOR A — minuto 1 (el incendio de las 3 de la mañana) + Harlan + la regla (zapatilla/alargue) + el enchufe
// + un circuito por estufa (p0-16)
import { S, BI, HZP, GARAGE, KITCH } from "./dir_lib.mjs";
export const FIRE = "a small one-story house on a rural Kentucky county road on a freezing winter night: the back half on fire, fire trucks with red lights, firefighters in turnout gear, a utility bucket truck with amber lights at the road";
export const BEDROOM = "an ordinary small back bedroom of an older American house in winter: a bed with a quilt, curtains, a rug on a wood floor, a small space heater on the floor";
export const LIVING = "an ordinary older American living room in winter: a couch with a throw blanket, a rug, a lamp, a television, a window with curtains";
export const SHOTS = [
  // ── MINUTO 1 (abre con Harlan)
  S(0, "", "av", "av"),
  S(0, "A house fire out on a county road", "bi", "b_fire", { p: BI(`${FIRE}, seen from the road.`), anim: "the flames flicker and smoke rises" }),
  S(0, "cut the power to the house", "hz", "h_cutpower", { p: HZP("At night beside a utility pole on a rural road, he looks up at the line, in his hard hat and canvas jacket, the orange glow of a house fire lighting one side of his face, a bucket truck behind him.", "a rural Kentucky county road on a freezing winter night") }),
  S(0, "the whole back half of that little house", "st", "st_fire.1"),
  S(1, "", "av", "av"),
  S(1, "plugged into a cheap power strip", "bi", "b_chain", { p: BI(`On the wood floor of ${BEDROOM.split(":")[0]}: a small space heater plugged into a cheap white power strip, plugged into a thin extension cord that disappears under the edge of a rug.`), anim: "the heater's orange glow pulses softly" }),
  S(1, "because a smoke alarm went off", "bi", "b_alarm", { p: BI("A white round smoke alarm on a hallway ceiling of an older house, its little red light blinking, a thin haze of smoke drifting past it."), anim: "the red light blinks as smoke drifts by" }),
  S(1, "three weeks before Christmas", "bi", "b_family", { p: BI(`A family wrapped in blankets standing at the edge of a rural road on a freezing night, a mother holding a little girl, a firefighter beside them, red lights reflecting on them.`), anim: "the mother pulls the blanket tighter around the girl" }),
  S(2, "", "av", "av"),
  S(2, "And I've seen it many times since", "st", "st_firetruck.1"),
  S(3, "", "av", "av"),
  S(3, "the one thing you should never plug a space heater into", "c", "ElLabelLine", { props: { line: "space heater", means: "never into a strip or a cord", good: false, bed: "b_chain" } }),
  S(3, "It takes ten minutes to learn", "c", "ElCoolerBoard", { props: { title: "today", rows: [{ item: "the one thing never to plug it into" }, { item: "the outlet test" }, { item: "one heater per circuit" }, { item: "3 feet + off at night" }, { item: "the warning signs", hi: true }], every: 24, bed: "st_heater.1" } }),
  // ── HARLAN
  S(4, "", "av", "av", { ov: { c: "ElNameTag", props: { name: "Harlan", line: "40 years climbing poles · Kentucky" } } }),
  S(4, "I climbed utility poles and restored power", "st", "st_lineman.1"),
  S(4, "a real healthy respect for heat and wire", "hz", "h_wire", { p: HZP("He holds up a short piece of melted, blackened extension cord between his gloved fingers and looks at it, then at the camera, serious.") }),
  S(4, "Too much heat, in the wrong place", "av", "av"),
  // ── LA REGLA
  S(5, "", "av", "av"),
  S(5, "Plug it straight into a wall outlet, by itself", "bi", "b_wall", { p: BI(`Close view: the plug of a small oil-filled space heater pushed straight into a white wall outlet near the floor of ${LIVING.split(":")[0]}, nothing else plugged in, the cord running clear on a wood floor.`), anim: "a hand pushes the plug in firmly" }),
  S(6, "", "av", "av"),
  S(7, "", "c", "HlStripHeat", { props: { title: "where you plug it in", amps: "1,500 watts · 12.5 amps · for hours", bed: "b_chain" } }),
  S(7, "Your toaster pulls a lot for a couple of minutes", "bi", "b_toaster", { p: BI(`On a counter in ${KITCH.split(":")[0]}: an old chrome toaster with two slices popping up, a coffee maker beside it.`), anim: "the toast pops up" }),
  S(7, "Your space heater pulls that much for hours", "av", "av"),
  S(8, "", "bi", "b_strip", { p: BI("Close view on a carpet: a cheap thin white power strip with a lamp, a phone charger and a TV plugged in, a little red switch light on."), anim: "the red switch light glows" }),
  S(8, "those thin parts get hot", "c", "ElLabelLine", { props: { line: "thin wires · thin contacts", means: "hot · hotter · melts", good: false, bed: "b_strip" } }),
  S(8, "until the plastic melts and catches fire", "bi", "b_melted", { p: BI("A melted, scorched white power strip lying on a burned patch of carpet, the plastic bubbled and blackened around one outlet, a plug fused into it."), anim: "a thin wisp of smoke curls up" }),
  S(9, "", "bi", "b_xmascord", { p: BI(`A thin green extension cord with Christmas lights plugged in, running across the floor of ${LIVING.split(":")[0]} toward the window.`), anim: "the Christmas lights twinkle" }),
  S(9, "if that cord is running under a rug", "bi", "b_rugcord", { p: BI(`A thin extension cord disappearing under the edge of a braided rug on the wood floor of ${LIVING.split(":")[0]}, a space heater's plug at the other end.`), anim: "a hand lifts the edge of the rug, showing the cord" }),
  S(9, "I've pulled melted extension cords out from under carpet", "hz", "h_rug", { p: HZP(`He kneels on a wood floor and pulls a scorched extension cord out from under a lifted rug, shaking his head.`, LIVING) }),
  S(10, "", "av", "av"),
  // ── EL ENCHUFE
  S(11, "", "bi", "b_badoutlet", { p: BI("Close view of a worn old wall outlet with a cracked cover plate and brown scorch discoloring around one set of holes, a plug hanging loosely half out of it."), anim: "the loose plug wiggles" }),
  S(11, "Is it loose? Does the plug wiggle", "c", "ElCoolerBoard", { props: { title: "check the outlet first", rows: [{ item: "loose? plug wiggles or falls out" }, { item: "cracked cover?" }, { item: "brown or black around the holes?", hi: true }], every: 26, stamp: "don't use it", bed: "b_badoutlet" } }),
  S(11, "a loose connection makes heat", "av", "av"),
  S(12, "", "av", "av"),
  S(12, "Put your hand on the plug where it goes into the wall", "hz", "h_plughand", { p: HZP(`He crouches by a wall outlet and rests the back of his fingers on a space heater's plug, frowning as he feels the heat.`, LIVING) }),
  S(12, "If it's hot, too hot to keep your hand on", "c", "ElLabelLine", { props: { line: "the plug test", means: "warm = OK · hot = unplug now", good: false, bed: "b_wall" } }),
  S(12, "until an electrician checks it", "st", "st_electrician.1"),
  // ── UN CIRCUITO POR ESTUFA
  S(13, "", "av", "av"),
  S(13, "each circuit has a breaker in your electrical panel", "bi", "b_panel", { p: BI("An open grey electrical breaker panel on a basement wall of an older house, rows of black breakers with handwritten labels on a paper card, a flashlight beam on it."), anim: "the flashlight beam moves across the breakers" }),
  S(14, "", "c", "HlCircuitLoad", { props: { title: "one heater per circuit", items: [{ label: "space heater", amps: 12.5 }, { label: "hair dryer", amps: 10 }], trip: "the breaker trips", bed: "b_panel" } }),
  S(14, "That's the breaker doing its job", "av", "av"),
  S(14, "Move the heater to a different room's outlet", "st", "st_heater.2"),
  S(15, "", "av", "av"),
  S(15, "a fire you can't see", "bi", "b_wall_wires", { p: BI("Inside an opened section of drywall in an older house: old electrical wires stapled to a wooden stud, one section of insulation browned and scorched near a junction box."), anim: "a flashlight beam finds the scorched wire" }),
];
export const BEDS = [];
