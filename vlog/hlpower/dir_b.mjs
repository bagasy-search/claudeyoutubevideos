// DIRECTOR B — sé tu propio liniero (qué ves = cuánto tarda), el cable a tu casa, cuánto dura cada tormenta, el
// campo, la casa del final, los equipos de otros estados, el budín de banana (p16-35)
import { S, BI, HZP, GARAGE, KITCH, HOUSE, STORM } from "./dir_lib.mjs";
export const SHOTS = [
  S(16, "", "av", "av"),
  S(16, "Treat every wire like it's live", "c", "ElLabelLine", { props: { line: "any wire on the ground", means: "treat it like it's live", good: false, bed: "b_wiredown" } }),
  S(17, "", "c", "HlDamageScale", { props: { title: "look out your window", items: [{ label: "nothing broken", time: "soon", w: 0.15 }, { label: "limb on the line", time: "1-2 hours", w: 0.25 }, { label: "wire down", time: "a few hours", w: 0.4 }, { label: "broken pole", time: "most of a day", w: 0.65 }, { label: "many poles down", time: "days", w: 1 }], every: 40 } }),
  S(19, "", "bi", "b_limb", { p: BI(`A big ice-covered tree limb resting on a power line between two standing wooden poles along a snowy street, the line sagging under it.`), anim: "the limb bounces slightly on the line" }),
  S(19, "A crew can cut the limb away", "st", "st_chainsaw.1"),
  S(20, "", "bi", "b_wiredown", { p: BI(`A power line lying in the snow along a rural road under a standing wooden pole, orange safety cones and a strip of caution tape near it.`), anim: "snow falls on the wire" }),
  S(21, "", "bi", "b_newpole", { p: BI(`A line crew setting a new wooden utility pole with a digger derrick truck on a snowy roadside, three linemen in hard hats guiding it into the hole.`), anim: "the pole swings slowly upright" }),
  S(21, "they have to climb and do a lot of it by hand", "hz", "h_climb", { p: HZP("He climbs a wooden utility pole with climbing hooks and a leather belt in a snowy backyard, looking down at the camera with a grin.", "a snowy backyard behind an older house during a winter outage") }),
  S(22, "", "st", "st_storm.1"),
  S(23, "", "bi", "b_transformer", { p: BI(`A gray pole transformer lying on its side in the snow at the base of a broken pole, a lineman in a hard hat kneeling to look at it.`), anim: "the lineman brushes snow off the transformer" }),
  // ── EL CABLE A TU CASA
  S(24, "", "c", "HlServiceDrop", { props: { title: "the wire to your house", theirs: "power company", yours: "YOURS · call an electrician", parts: ["weatherhead", "mast", "meter box"], note: "damaged? call an electrician first" } }),
  S(25, "", "bi", "b_mast", { p: BI(`The side of an older house after an ice storm: the metal electrical mast pipe bent and pulled away from the wall, the meter box hanging crooked, the service wire drooping to the ground.`), anim: "the drooping wire sways in the wind" }),
  S(25, "call an electrician right away", "hz", "h_mast", { p: HZP("He stands beside a house in the snow pointing up at a bent electrical mast pipe and a crooked meter box, explaining with his other hand.", HOUSE) }),
  // ── CUÁNTO DURA
  S(26, "", "av", "av"),
  S(27, "", "c", "ElCoolerBoard", { props: { title: "how long, roughly", rows: [{ item: "thunderstorm", price: "hours · next day" }, { item: "windstorm / small tornado", price: "1-2 days" }, { item: "big ice storm", price: "3 days to a week+" }, { item: "big hurricane", price: "1-2 weeks", hi: true }], every: 40, bed: "st_storm.2" } }),
  S(29, "", "bi", "b_icelimb", { p: BI(`${STORM.split(":")[0]} at dawn: a freshly repaired power line with a new ice-covered limb just fallen across it, a bucket truck parked nearby.`), anim: "ice glitters on the fallen limb" }),
  S(29, "sometimes more out in the country", "av", "av"),
  S(30, "", "st", "st_hurricane.1"),
  S(30, "roads are blocked and crews can't get in", "st", "st_hurricane.2"),
  S(31, "", "bi", "b_longline", { p: BI("A long rural power line running on wooden poles through miles of snowy woods to a single small farmhouse at the end of a dirt road, seen from a hill."), anim: "snow drifts across the long line" }),
  S(32, "", "bi", "b_farmhouse", { p: BI(`An old white farmhouse at the end of a long dirt road in snowy woods, smoke rising from the chimney, an old man in a heavy coat standing on the porch waving at two bucket trucks pulling in.`), anim: "the old man waves from the porch" }),
  S(32, "I knew you boys would come", "av", "av"),
  // ── LOS EQUIPOS
  S(33, "", "bi", "b_convoy", { p: BI("A long line of white utility bucket trucks with license plates from different states driving down a highway after a storm, amber lights flashing, a flooded field beside the road."), anim: "the trucks roll down the highway" }),
  S(33, "sleeping in motels or trucks or church fellowship halls", "bi", "b_cots", { p: BI("Rows of cots in a small-town church fellowship hall at night, tired linemen in work clothes sleeping, hard hats and boots on the floor beside the cots."), anim: "one lineman turns over on his cot" }),
  S(34, "", "av", "av"),
  S(34, "She brought us a whole pan of banana pudding", "bi", "b_pudding", { p: BI(`An older African American woman in a cardigan holding out a big glass pan of banana pudding with vanilla wafers to three tired linemen in hard hats beside their bucket truck in her driveway, her porch light on.`), anim: "the linemen smile and take the pan" }),
  S(35, "", "av", "av"),
  S(35, "A wave or a bottle of water goes a long way", "av", "av"),
];
export const BEDS = [];
