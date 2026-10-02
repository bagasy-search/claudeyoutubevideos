// Plan agnes 2.5-flash de los MOMENTOS VLOG de los 7 pies (20 clips hablados). node vlog/lordeviled/mkplan_pies.mjs
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { R, WHO, KIT, A, act, plan } from "./lib.mjs";
const { vl } = JSON.parse(fs.readFileSync(R + "_v3/lordeviled_shots.json", "utf8"));
const T = R + "vlog/lordeviled/tramos/";
const text = (s, e) => JSON.parse(fs.readFileSync(R + "_v3/lordeviled_wordms.json", "utf8")).filter((w) => w.s >= s - 0.05 && w.s < e - 0.05).map((w) => w.w).join(" ");
const base = (scene) => `Same kitchen, same moment of the day. ${WHO}, in ${KIT}. ${scene}`;
const anchors = [
  A("CA0", ["k0"], base("She sits at the floury table cracking a brown egg on the rim of a yellow mixing bowl full of pale sugary filling, a wooden spoon in the bowl, two broken eggshells beside it, looking at the camera mid-sentence.")),
  A("CA1", ["CA0"], "Same place a few seconds later: she stirs the filling slowly with the wooden spoon, gently, the egg disappearing into it, looking at the camera while she talks."),
  A("CA2", ["CA1"], "Same place a few seconds later: she holds the wooden spoon up and wags it at the camera like a stern but amused teacher, the yellow bowl in front of her."),
  A("CB0", ["k0"], base("She stands at the floury table pouring pale yellow chess pie filling from the yellow mixing bowl into an unbaked crimped pie crust in a clear glass pie plate, talking to the camera.")),
  A("CB1", ["CB0"], "Same place a few seconds later: the crust is full of filling and she scrapes the last of it from the bowl with a rubber spatula, glancing up at the camera."),
  A("CC0", ["k0"], base("She sits at the floury table spooning ice water from a tall glass of ice water onto crumbly flour and fat in a big mixing bowl, a tablespoon in her hand, concentrating.")),
  A("CC1", ["CC0"], "Same place a few seconds later: she squeezes a handful of pie dough in her fist and opens her hand to show the camera that it holds together, satisfied."),
  A("CS0", ["k0"], base("She sits at the floury table pouring heavy cream from a glass measuring cup into an unbaked pie shell in a glass plate that has a layer of sugar and flour in the bottom, a carton of cream beside her.")),
  A("CS1", ["CS0"], "Same place a few seconds later: she stirs the cream in the pie shell gently with one index finger, laughing at the camera."),
  A("CS2", ["CS1"], "Same place a few seconds later: she holds her creamy index finger up toward the camera with a mischievous grin, the pale liquid pie in front of her."),
  A("CS3", ["k0"], base("She stands next to the white enamel stove holding a full glass pie plate of pale liquid sugar cream pie with both hands in quilted oven mitts, walking carefully, eyes on the pie, the oven door open.")),
  A("CS4", ["CS3"], "Same place a few seconds later: she bends and slides the pie onto the rack inside the open white enamel oven, careful, the pie still level."),
  A("CH0", ["k0"], base("She sits at the floury table rubbing flour, brown sugar and cold butter together between her fingertips over a yellow mixing bowl, crumbs falling back into the bowl, looking at the camera.")),
  A("CH1", ["CH0"], "Same place a few seconds later: she lifts both floury hands and lets the last crumbs fall into the bowl, showing the coarse crumbs, pleased."),
  A("CH2", ["k0"], base("She sits at the floury table stirring baking soda into a glass measuring cup of steaming hot water with a spoon, the water fizzing and foaming up, a bowl of dark molasses beside it.")),
  A("CH3", ["CH2"], "Same place a few seconds later: she pours the foamy water from the measuring cup into the bowl of dark molasses and stirs, the molasses turning lighter brown."),
  A("CT0", ["k0"], base("She stands at the white enamel stove stirring foaming melted butter in a black cast iron skillet with a wooden spoon, a cup of dark brown sugar in her other hand, talking to the camera.")),
  A("CT1", ["CT0"], "Same place a few seconds later: she tips the dark brown sugar from the cup into the foaming butter in the skillet, stirring."),
  A("CT2", ["CT1"], "Same place a few seconds later: the syrup in the skillet is dark amber and bubbling; she holds the wooden spoon up and raises one eyebrow at the camera knowingly."),
  A("CT3", ["k0"], base("She stands at the white enamel stove pouring warm milk from a small saucepan into the black skillet of dark butterscotch syrup, a big puff of steam rising.")),
  A("CT4", ["CT3"], "Same place a few seconds later: she stirs the skillet and the mixture has become smooth light brown milk, the steam settling."),
  A("CL0", ["k0"], base("She stands at the white enamel stove spooning a little hot clear lemon mixture from a saucepan into a small bowl of beaten egg yolks, careful, lemons on the counter.")),
  A("CL1", ["CL0"], "Same place a few seconds later: she whisks the small bowl of warmed yolks briskly with a fork, the saucepan steaming beside her."),
  A("CL2", ["k0"], base("She stands at the floury table holding a big glass bowl against her body and beating egg whites with an old electric hand mixer, the whites foamy, a cup of sugar beside the bowl.")),
  A("CL3", ["CL2"], "Same place a few seconds later: the whites are stiff and glossy and she lifts the beaters to show a tall stiff peak to the camera, proud."),
  A("CL4", ["k0"], base("She sits at the floury table spreading white meringue with a spatula over a lemon pie with bright yellow filling in a glass plate, pushing it out to touch the crimped crust edge.")),
  A("CL5", ["CL4"], "Same place a few seconds later: the meringue covers the whole pie sealed to the crust, and she pulls up curled peaks with the spatula, glancing at the camera."),
  A("CR0", ["k0"], base("She stands at the white enamel stove pouring a cup of dark raisins into a small saucepan of water, steam rising, a wooden spoon resting on the stove.")),
  A("CR1", ["CR0"], "Same place a few seconds later: she stands at the white enamel sink draining the steaming plump raisins in a small metal sieve, a puff of steam."),
  A("CR2", ["CR1"], "Same place a few seconds later: she holds up a spoonful of plump shiny raisins toward the camera with a delighted smile."),
  A("CM0", ["k0"], base("She sits at the floury table holding a round butter cracker above an unbaked pie crust in a glass plate and breaking it into quarters with her fingers, a box of crackers without any label beside her.")),
  A("CM1", ["CM0"], "Same place a few seconds later: the crust is half full of big cracker pieces and she holds one quarter up to the camera like a slice of apple, smiling."),
  A("CM2", ["k0"], base("She stands at the kitchen window with the yellow checked curtains, a saucepan of clear syrup cooling on the windowsill, dipping the tip of one finger into the syrup to test it.")),
  A("CM3", ["CM2"], "Same place a few seconds later: she holds up her fingertip, thoughtful, then nods at the camera, the saucepan still on the windowsill."),
  A("CM4", ["k0"], base("She sits at the table beside a golden double crust pie with one slice cut and served on a flowered plate; from the edge of the frame a young man's hand holds a fork taking a bite from the slice; she watches, amused.")),
  A("CM5", ["CM4"], "Same place a few seconds later: she laughs and points at the young man at the edge of the frame, the forkful gone from the plate."),
];
const C = (id, a, b, action) => ({ id, a, b, audio: T + id + ".wav", text: text(vl[id].s, vl[id].e), action: act(action) });
const clips = [
  C("c_chess1", "CA0", "CA1", "She cracks the egg into the bowl and stirs it in gently with the wooden spoon while she explains to her grandson."),
  C("c_chess2", "CA1", "CA2", "She keeps stirring gently, then lifts the wooden spoon and wags it at the camera, amused."),
  C("c_chess3", "CB0", "CB1", "She pours the filling into the crust and scrapes the bowl with the spatula."),
  C("c_crust", "CC0", "CC1", "She spoons ice water onto the dough a little at a time, then squeezes a handful to show it holds."),
  C("c_sugar1", "CS0", "CS1", "She pours the cream into the pie shell and stirs it gently with her finger, laughing."),
  C("c_sugar2", "CS1", "CS2", "She finishes stirring with her finger and holds it up to the camera, joking."),
  C("c_sugar3", "CS3", "CS4", "She carries the runny pie very carefully to the oven and slides it in."),
  C("c_shoo1", "CH0", "CH1", "She rubs the butter into the flour and sugar with her fingertips and lets the crumbs fall."),
  C("c_shoo2", "CH2", "CH3", "She stirs the soda into the hot water, it fizzes, then she pours it into the molasses and stirs."),
  C("c_bs1", "CT0", "CT1", "She stirs the foaming butter in the iron skillet and tips in the brown sugar."),
  C("c_bs2", "CT1", "CT2", "She keeps stirring the darkening syrup, then raises the spoon and an eyebrow at the camera."),
  C("c_bs3", "CT3", "CT4", "She pours the warm milk into the skillet, it hisses and steams, and she keeps stirring."),
  C("c_lem1", "CL0", "CL1", "She spoons hot mixture into the yolks and whisks them."),
  C("c_lem2", "CL2", "CL3", "She beats the whites with the hand mixer until they stand in stiff shiny peaks, then lifts the beaters."),
  C("c_lem3", "CL4", "CL5", "She pushes the meringue out to the crust edge all the way around and pulls up peaks."),
  C("c_rai1", "CR0", "CR1", "She pours the raisins into the simmering water, then drains them at the sink."),
  C("c_rai2", "CR1", "CR2", "She shakes the sieve and shows a spoonful of plump raisins to the camera."),
  C("c_mock1", "CM0", "CM1", "She breaks the crackers by hand into big pieces into the crust and shows one piece."),
  C("c_mock2", "CM2", "CM3", "She tests the cooling syrup with her fingertip at the window, telling the secret."),
  C("c_mock3", "CM4", "CM5", "She watches her grandson's hand take a bite of the pie and laughs at him."),
];
execFileSync("python", [R + "vlog/lordeviled/tramos.py", ...clips.map((c) => `${c.id}:${(vl[c.id].s - 0.03).toFixed(3)}:${(vl[c.id].e + 0.05).toFixed(3)}`)], { cwd: R, stdio: "inherit" });
fs.mkdirSync(R + "vlog/lordeviled/PIES", { recursive: true });
fs.writeFileSync(R + "vlog/lordeviled/PIES/plan.json", JSON.stringify(plan("vlog/lordeviled/PIES", anchors, clips), null, 1));
console.log("plan PIES:", anchors.length, "anclas,", clips.length, "clips");
