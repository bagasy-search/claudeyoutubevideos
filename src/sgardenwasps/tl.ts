// sgardenwasps · LÍNEA DE TIEMPO del mundo (segundos de la locución, anclados a palabras con at()).
// CAM = la única cámara (sin cortes): cada encuadre se sostiene con un empuje lento y viaja al siguiente en ~1,2 s.
// ST(t) = el estado del patio en ese instante (estación, atardecer, el avispero, la bolsa, los clavos…).
import { at } from "./lib";
export type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };

export const F: Record<string, { p: number[]; l: number[]; fov: number }> = {
  wide: { p: [0.6, 2.1, 6.6], l: [0.2, 1.0, -1.6], fov: 46 },
  high: { p: [0.4, 6.2, 5.4], l: [0.2, 0.0, -0.8], fov: 50 },
  low: { p: [1.1, 0.35, 2.6], l: [2.6, 1.6, -1.0], fov: 50 },
  shed: { p: [1.2, 1.5, 2.6], l: [3.4, 1.4, -1.3], fov: 44 },
  eave: { p: [1.55, 1.35, 1.9], l: [3.1, 1.75, -1.0], fov: 46 },
  nest: { p: [2.85, 1.8, -0.05], l: [3.15, 2.02, -0.98], fov: 34 },
  porch: { p: [-0.9, 1.55, 1.2], l: [-1.0, 1.35, -2.7], fov: 46 },
  door: { p: [0.6, 1.75, -0.35], l: [0.08, 1.9, -2.1], fov: 38 },
  table: { p: [-0.15, 1.3, -0.25], l: [-0.85, 0.76, -1.3], fov: 36 },
  lemon: { p: [-0.55, 1.05, -0.8], l: [-0.82, 0.8, -1.25], fov: 32 },
  tub: { p: [2.0, 1.25, -0.35], l: [1.3, 0.35, -1.6], fov: 40 },
  bucket: { p: [2.3, 1.4, 0.7], l: [2.95, 1.0, -0.8], fov: 44 },
  tree: { p: [-1.4, 1.6, 3.4], l: [-3.4, 2.0, 0.8], fov: 44 },
  beds: { p: [1.4, 1.25, 4.3], l: [0.2, 0.25, 1.2], fov: 42 },
  hole: { p: [2.6, 0.7, 4.3], l: [1.85, 0.08, 2.9], fov: 36 },
  crack: { p: [-3.5, 1.35, -1.4], l: [-4.55, 1.2, -3.15], fov: 38 },
  sachet: { p: [-2.2, 1.55, -1.2], l: [-2.6, 1.5, -2.3], fov: 36 },
  football: { p: [-0.6, 1.6, 4.4], l: [-3.05, 2.05, 1.25], fov: 46 },
  wood: { p: [4.3, 1.0, 1.4], l: [5.2, 0.35, -0.7], fov: 40 },
  bike: { p: [1.2, 1.1, 0.7], l: [2.1, 0.6, -1.2], fov: 42 },
};
const K = (t: number, n: string, push = 0, arc?: number): Key => {
  const f = F[n]; const p = f.p.map((v, i) => v + (f.l[i] - v) * push);
  return { t, p, l: f.l, fov: f.fov - push * 6, arc };
};

// [segundo, encuadre]: lo que la cámara mira mientras se dice ESO
const CAM: [number, string][] = [
  [0, "porch"], [at("you hear it"), "eave"], [at("you look up"), "nest"], [at("you back away slowly"), "wide"],
  [at("last summer my neighbor"), "wide"], [at("my mother kept wasps"), "shed"], [at("she used three things"), "table"],
  [at("come sit with me"), "porch"],
  [at("it is not because"), "high"], [at("she chooses it because"), "eave"], [at("costs less than"), "table"],
  [at("so today i will show"), "wide"], [at("where the cloves go"), "sachet"], [at("how to fold the paper"), "door"], [at("the five mistakes"), "low"], [at("the whole year of"), "high"], [at("the honest part"), "hole"],
  [at("quick while i have you"), "table"], [at("this is my garden channel"), "wide"],
  [at("behind our small wooden house"), "high"], [at("a persimmon tree"), "tree"], [at("three rows of daikon"), "beds"], [at("a little wooden shed"), "bike"], [at("the shed had a deep roof"), "eave"],
  [at("in japanese we have a name"), "nest"], [at("hanging in the air"), "eave"], [at("so my mother respected wasps"), "shed"],
  [at("she said a wasp"), "beds"], [at("she wanted them at the back"), "high"], [at("not over the door"), "door"], [at("far from the door"), "wide"],
  [at("a wasp nest lives for one year"), "nest"], [at("the queens leave in the fall"), "crack"], [at("in the woodpile"), "wood"], [at("in the folds of the porch umbrella"), "porch"],
  [at("then in spring"), "wide"], [at("she flies around your house"), "eave"], [at("she builds a tiny nest"), "nest"],
  [at("by june her first daughters"), "eave"], [at("they stop hunting caterpillars"), "table"], [at("so remember this picture"), "nest"],
  [at("number one soapy water"), "tub"], [at("i use plain dish soap"), "table"], [at("a wasp does not breathe"), "nest"],
  [at("the measure two tablespoons"), "table"], [at("use a spray bottle"), "lemon"], [at("if the nest is a little higher"), "shed"],
  [at("now the most important part"), "wide"], [at("my mother waited for the evening"), "eave"], [at("cold wasps cannot fly well"), "nest"],
  [at("she did it like this"), "porch"], [at("a flashlight but not white"), "eave"], [at("you stand to the side"), "shed"], [at("and you spray the whole nest"), "nest"], [at("then walk away calmly"), "wide"],
  [at("the next evening look again"), "eave"], [at("knock the nest down into a bucket"), "bucket"], [at("wash the spot where the nest hung"), "shed"], [at("now the room is not for rent"), "shed"],
  [at("and be honest about the size"), "nest"], [at("under the porch roof on the shed door frame"), "porch"], [at("if the nest is bigger than your fist"), "high"],
  [at("so that is number one"), "wide"], [at("she wanted the queen to fly past"), "eave"], [at("from the little spice drawer"), "table"],
  [at("number two cloves"), "table"], [at("my grandfather had a little bottle"), "porch"],
  [at("here is why a wasp lives"), "eave"], [at("some years ago scientists"), "wide"], [at("my mother did not need a scientist"), "beds"],
  [at("the first way is the little bag"), "table"], [at("hang one in each corner"), "sachet"], [at("every two weeks squeeze"), "sachet"],
  [at("the second way is the clove water"), "table"], [at("your kitchen will smell"), "lemon"], [at("in spring once a week spray"), "door"], [at("keep it in the refrigerator"), "table"],
  [at("and one more the one my mother did"), "table"], [at("she put the two halves"), "lemon"], [at("it is not magic"), "wide"],
  [at("now the honest part about cloves"), "nest"], [at("the clove is for the spring"), "sachet"], [at("my mother said soap is for this year"), "porch"],
  [at("before i show you number three"), "wide"], [at("the mailbox the grill"), "bike"], [at("i read every comment"), "porch"],
  [at("number three a brown paper bag"), "door"], [at("my mother used the paper bag the rice came in"), "shed"], [at("a fake nest"), "eave"],
  [at("here is the idea"), "high"], [at("so when the queen is flying alone"), "eave"], [at("she looks for an empty room"), "door"],
  [at("now i want to be honest"), "porch"], [at("it only works if you hang it"), "door"],
  [at("how to make it"), "table"], [at("then crumple the whole bag"), "lemon"], [at("she said the wasp is not an art teacher"), "door"],
  [at("where and when"), "porch"], [at("under the shed roof"), "eave"], [at("it must hang in the shade"), "door"], [at("and the month is everything"), "beds"],
  [at("and keep it dry"), "door"], [at("at the end of the fall"), "wide"], [at("the store sells a plastic one"), "door"],
  [at("so now you have all three"), "wide"], [at("because of five little mistakes"), "low"],
  [at("mistake number one attacking"), "nest"], [at("in the evening everybody is home"), "eave"],
  [at("mistake number two swatting"), "table"], [at("you do not hit a guest"), "lemon"],
  [at("mistake number three the one"), "door"], [at("it catches wasps yes"), "porch"], [at("put it far away"), "high"],
  [at("mistake number four fire"), "shed"], [at("never pour gasoline"), "hole"], [at("a hole in the ground is not"), "hole"],
  [at("mistake number five the ladder"), "shed"], [at("keep both feet on the ground"), "eave"],
  [at("and while we talk about mistakes"), "porch"], [at("she never left a can of soda"), "table"], [at("she never left fallen persimmons"), "tree"], [at("and she never wore bright yellow"), "beds"],
  [at("now let me give you my mother's whole year"), "high"],
  [at("early spring march and april"), "wide"], [at("make your paper bags and hang them"), "door"], [at("make your clove water"), "sachet"], [at("and walk around the house once a week"), "eave"], [at("if you find one it is easy"), "nest"],
  [at("may june and july"), "wide"], [at("under the lid of the grill", 1330), "bike"], [at("a paper wasp nest found in june"), "nest"],
  [at("august and september"), "tree"], [at("instead close the restaurant"), "table"], [at("pick up fallen fruit"), "tree"],
  [at("october and november"), "nest"], [at("now finally you can take down"), "eave"], [at("this is also the time to remember"), "door"],
  [at("and winter december to february"), "wide"], [at("so in winter my mother fixed the cracks"), "crack"], [at("she kept the firewood away"), "wood"],
  [at("so that is the whole year"), "high"], [at("just a little hole in your lawn"), "hole"],
  [at("first the nest in the ground"), "hole"], [at("mark it with a stick"), "hole"], [at("or if it is far from where people walk"), "wide"],
  [at("second the closed grey nest"), "football"], [at("third wasps going in and out"), "crack"], [at("call a professional", 1540), "wide"],
  [at("and fourth you"), "porch"], [at("my mother was brave"), "shed"],
  [at("and if you get stung"), "porch"], [at("my mother put a slice"), "table"], [at("but if the face or the throat"), "porch"],
  [at("now some of you asked me"), "wide"], [at("will the soapy water hurt my plants"), "beds"], [at("and keep it away from the fish pond"), "beds"],
  [at("someone else asked"), "nest"], [at("that is why my mother washed the spot"), "door"],
  [at("and dorothy asked"), "beds"], [at("if you see a ball of bees"), "tree"],
  [at("i remember one evening in osaka"), "wide"], [at("right over the door where my father"), "bike"], [at("she waited until the sun was gone"), "eave"], [at("one cup two cups"), "nest"],
  [at("the next morning she knocked it down"), "bucket"], [at("then she took the paper bag from the rice"), "eave"], [at("that is the landlord"), "eave"], [at("and in all those years"), "shed"],
  [at("now let me do the arithmetic"), "wide"], [at("my mother's way"), "table"], [at("and something better than the money"), "porch"],
  [at("so here is everything one more time"), "wide"], [at("soapy water", 1820), "tub"], [at("cloves a tablespoon", 1820), "sachet"], [at("and a lemon with cloves"), "lemon"], [at("number three the paper bag"), "door"],
  [at("and the rules around them"), "high"], [at("and the ground nests"), "hole"],
  [at("your homework this week"), "eave"], [at("and tell me in the comments"), "porch"],
  [at("and next time"), "tree"], [at("thank you for sitting with me"), "porch"], [at("let the wasps be good farmers"), "wide"],
];
export const KEYS: Key[] = (() => {
  const out: Key[] = [];
  CAM.forEach(([t, n], i) => {
    const nx = i + 1 < CAM.length ? CAM[i + 1][0] : t + 30;
    out.push(K(t + (i ? 0.05 : 0), n, 0, i % 3 === 1 ? 0.04 : undefined));
    out.push(K(Math.max(t + 0.4, nx - 1.1), n, 0.1));
  });
  out.push({ t: 99999, ...F.wide });
  return out.sort((a, b) => a.t - b.t);
})();

const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
/** sube de 0 a 1 entre a y b */
export const up = (t: number, a: number, b: number) => sm((t - a) / (b - a));
/** 1 entre a y b (con rampas de r segundos) */
export const win = (t: number, a: number, b: number, r = 0.5) => up(t, a - r, a) * (1 - up(t, b, b + r));
// tramos con un valor que se va interpolando: [[t, v], …]
const path = (t: number, pts: [number, number][], r = 1.2) => {
  let v = pts[0][1];
  for (let i = 1; i < pts.length; i++) v = v + (pts[i][1] - v) * up(t, pts[i][0], pts[i][0] + r);
  return v;
};

// ---- anclas ----
const A = {
  youngMan: at("last summer my neighbor"), three: at("she used three things"), notYou: at("it is not because"), promise: at("so today i will show"),
  intro: at("you know me"), year: at("a wasp nest lives for one year"), spring1: at("then in spring when the days"), june: at("by june her first daughters"),
  late: at("by late august"), picture: at("so remember this picture"), one: at("number one soapy water"), evening: at("my mother waited for the evening"),
  red: at("my mother put a piece of red"), spray: at("and you spray the whole nest"), walk: at("then walk away calmly"), next: at("the next evening look again"),
  knock: at("knock the nest down into a bucket"), wash: at("wash the spot where the nest hung"), size: at("and be honest about the size"), rehook1: at("so that is number one"),
  two: at("number two cloves"), bagC: at("the first way is the little bag"), hang: at("hang one in each corner"), water: at("the second way is the clove water"),
  boil: at("bring it to a boil"), pour: at("pour it in a spray bottle"), lemon: at("cut a lemon in half"), honestC: at("now the honest part about cloves"),
  three3: at("number three a brown paper bag"), hungShed: at("hung it under the roof of the shed"), make: at("how to make it"), hangIt: at("hang it from the string"),
  wet: at("when the paper bag gets wet"), rehook2: at("so now you have all three"), m1: at("mistake number one attacking"), m3: at("mistake number three the one"),
  m4: at("mistake number four fire"), m4hole: at("if you see wasps going in and out of a hole"), m5: at("mistake number five the ladder"), never: at("and while we talk about mistakes"),
  persim: at("she never left fallen persimmons"), routine: at("now let me give you my mother's whole year"), rSpring: at("early spring march and april"), rSummer: at("may june and july"),
  rLate: at("august and september"), rFall: at("october and november"), rWinter: at("and winter december to february"), rehook3: at("so that is the whole year"),
  safety: at("first the nest in the ground"), stick: at("mark it with a stick"), football: at("second the closed grey nest"), crack: at("third wasps going in and out"),
  fourth: at("and fourth you"), questions: at("now some of you asked me"), memory: at("i remember one evening in osaka"), cupNest: at("the size of a small cup"),
  sunGone: at("she waited until the sun was gone"), threw: at("she threw the water up"), morning: at("the next morning she knocked it down"), landlord: at("then she took the paper bag from the rice"),
  money: at("now let me do the arithmetic"), recap: at("so here is everything one more time"), comment: at("your homework this week"), next2: at("and next time"), close: at("thank you for sitting with me"),
};
export { A };

export type Estado = {
  season: number; dusk: number; snow: number; nest: number; wasps: number; wet: number; drop: number; spray: number; red: number;
  bag: number; bag2: number; sachet: number; lemon: number; bottle: number; cloveWater: number; pot: number; steam: number; cloves: number;
  suds: number; bucket: number; trap: number; ladder: number; crack: number; football: number; hole: number; ribbon: number; shade: number;
};
export const ST = (t: number): Estado => ({
  // 0 primavera · 1 verano · 2 fin de verano · 3 otoño · 4 invierno
  season: path(t, [[0, 1.4], [A.notYou, 0.1], [A.promise, 1.0], [A.intro, 0.3], [A.year, 1.2], [A.year + 6, 3.0], [A.year + 14, 4], [A.spring1, 0.1], [A.june, 1.0], [A.late, 2.0], [A.one, 1.1],
    [A.two, 0.2], [A.lemon - 1, 1.0], [A.honestC, 0.3], [A.three3, 0.1], [A.rehook2, 1.1], [A.persim, 2.4], [A.routine, 1.0], [A.rSpring, 0.1], [A.rSummer, 1.0], [A.rLate, 2.1], [A.rFall, 3.1],
    [A.rWinter, 4], [A.rehook3, 1.2], [A.memory, 1.1], [A.money, 1.0], [A.comment, 1.0]], 2.0),
  dusk: Math.max(win(t, A.evening + 2, A.knock - 1, 2), win(t, A.m1 + 12, A.m1 + 26, 2), win(t, A.sunGone, A.morning, 2), up(t, A.comment, A.comment + 3) * (1 - up(t, A.next2, A.next2 + 2)) + up(t, A.close, A.close + 4) * 0.8),
  snow: win(t, A.year + 13, A.spring1 - 1, 1.5) + win(t, A.rWinter + 1, A.rehook3, 1.5),
  // el avispero: lemon (hook) → nada (abril) → dedal → taza → puño → grande → mojado → al balde → nada
  nest: path(t, [[0, 0.75], [A.notYou, 0.0], [A.promise, 0.7], [A.intro, 0.0], [A.year, 0.9], [A.year + 14, 0.0], [A.spring1 + 12, 0.22], [A.june, 0.5], [A.late, 1.2], [A.one, 0.75],
    [A.wash + 1, 0], [A.size, 0.7], [A.rehook1 + 3, 0], [A.honestC, 0.8], [A.honestC + 18, 0], [A.m1, 0.7], [A.m1 + 30, 0], [A.rSpring + 30, 0.22], [A.rSummer + 26, 0.45], [A.rLate, 1.1],
    [A.rFall + 20, 0], [A.memory + 5, 0.5], [A.morning + 1.5, 0]], 1.0),
  wasps: path(t, [[0, 10], [A.notYou, 1], [A.promise, 8], [A.year, 12], [A.spring1 + 12, 1], [A.june, 6], [A.late, 18], [A.one, 10], [A.rFall, 0], [A.memory + 5, 6]], 1.0) * (1 - 0.8 * up(t, A.spray + 2, A.spray + 5) * (1 - up(t, A.size, A.size + 1))),
  wet: win(t, A.spray + 0.5, A.knock + 1.5, 1.2) + win(t, A.threw + 0.5, A.morning + 1.5, 1.0),
  drop: up(t, A.knock + 0.4, A.knock + 1.3) * (1 - up(t, A.wash, A.wash + 0.1)) + up(t, A.morning + 0.3, A.morning + 1.2) * (1 - up(t, A.morning + 1.8, A.morning + 1.9)),
  spray: win(t, A.spray, A.spray + 7, 0.4) + win(t, A.threw, A.threw + 5, 0.4),
  red: win(t, A.red + 1, A.walk + 1, 1),
  bag: Math.max(up(t, A.three3, A.three3 + 1.2) * (1 - up(t, A.rehook2 + 4, A.rehook2 + 5)), up(t, A.rSpring + 8, A.rSpring + 9), up(t, A.recap, A.recap + 1) * 0) + (t < A.three3 ? win(t, A.promise + 16, A.promise + 24, 0.8) : 0) + (t > A.rehook3 ? up(t, A.money, A.money + 1) : 0) * 0,
  bag2: Math.max(win(t, A.hungShed, A.make, 1), win(t, A.landlord + 6, A.money, 1), up(t, A.money, A.money + 1)),
  sachet: Math.max(win(t, A.hang, A.three3, 0.8), win(t, A.rSpring + 18, A.rSummer, 0.8), up(t, A.recap, A.recap + 1)),
  lemon: Math.max(win(t, A.lemon, A.three3, 0.6), win(t, A.recap + 20, A.comment, 0.6)),
  bottle: Math.max(win(t, A.three - 0.4, A.notYou, 0.5), win(t, A.one + 20, A.rehook1, 0.5), win(t, A.water, A.three3, 0.5), win(t, A.money, A.comment, 0.5)),
  cloveWater: up(t, A.pour, A.pour + 0.6) * (1 - up(t, A.money - 1, A.money)),
  pot: win(t, A.water + 3, A.lemon - 2, 0.6),
  steam: up(t, A.boil, A.boil + 0.8),
  cloves: Math.max(win(t, A.three, A.notYou, 0.5), win(t, A.two, A.three3, 0.6), win(t, A.money, A.comment, 0.6)),
  suds: Math.max(win(t, A.three, A.notYou, 0.5), win(t, A.one, A.rehook1, 0.8), win(t, A.memory, A.money, 0.8), win(t, A.money, A.comment, 0.8)),
  bucket: Math.max(win(t, A.next - 1, A.size, 0.6), win(t, A.memory + 20, A.landlord + 5, 0.6)),
  trap: win(t, A.m3, A.m4, 0.6),
  ladder: win(t, A.m5, A.never, 0.6),
  crack: Math.max(win(t, A.year + 6, A.spring1, 0.6), win(t, A.rWinter + 6, A.rehook3, 0.6), win(t, A.crack, A.fourth, 0.6)),
  football: win(t, A.football, A.crack + 4, 0.6),
  hole: Math.max(win(t, A.m4hole, A.m5, 0.6), win(t, A.rehook3 + 8, A.football, 0.6), win(t, A.recap + 50, A.comment, 0.6)),
  ribbon: up(t, A.stick, A.stick + 0.8),
  shade: 0,
});
