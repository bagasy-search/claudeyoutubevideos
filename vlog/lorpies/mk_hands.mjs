// Detalles SIN cara (sólo manos de Loretta) para animar con agnes v2.0: reemplazan los kf del minuto 1 que no entraron
// y cubren la acción de cada momento vlog de los pies (plan intermedio del creador, 28-sep).
import fs from "node:fs";
import { BI } from "./dir_lib.mjs";
const H = "old woman's hands with age spots, veins and a thin gold wedding ring, lilac cardigan cuffs, the wrists and forearms entering the frame from the bottom edge, no face in the frame";
const K = "on the floury wooden table of a 1950s white farmhouse kitchen, a worn spiral recipe book and a glass jar of flour at the edge, daylight from a window with yellow checked curtains";
const S = "on the white enamel stove of a 1950s farmhouse kitchen, yellow checked curtains at the edge of the frame, daylight";
export const HANDS = {
  hd_chess: [`Close view of ${H} sliding a table knife into a golden chess pie with a shiny crackly top in a clear glass pie plate, ${K}.`, "the knife slides slowly down into the pie"],
  hd_sugar: [`Close view of ${H} grating a whole nutmeg on a small metal grater over a pale liquid sugar cream pie in a glass plate, brown specks landing, ${K}.`, "the nutmeg moves along the grater and brown specks fall"],
  hd_lemon: [`Close view of ${H} holding a rubber spatula pulling white meringue into tall curled peaks on a lemon pie with yellow filling in a glass plate, ${K}.`, "the spatula lifts a peak of meringue slowly"],
  hd_mock: [`Close view of ${H} breaking a round butter cracker into big pieces over an unbaked pie crust in a glass plate already holding some pieces, an unlabeled cracker box beside it, ${K}.`, "the cracker snaps and the pieces drop into the crust"],
  hd_book: [`Close view of ${H} opening a worn spiral recipe book with a faded red cloth cover to a yellowed handwritten page with grease spots, ${K}.`, "the page turns slowly and settles flat"],
  h_c_chess1: [`Close view of ${H} cracking a brown egg on the rim of a yellow mixing bowl of pale sugary filling, a wooden spoon in the bowl, ${K}.`, "the egg drops slowly into the bowl"],
  h_c_chess2: [`Close view of ${H} stirring pale yellow chess pie filling gently with a wooden spoon in a yellow mixing bowl, ${K}.`, "the wooden spoon stirs slowly through the filling"],
  h_c_chess3: [`Close view of ${H} pouring pale yellow filling from a yellow mixing bowl into an unbaked crimped pie crust in a glass plate, ${K}.`, "the filling pours slowly into the crust"],
  h_c_crust: [`Close view of ${H} spooning ice water from a tall glass with ice cubes onto crumbly pie dough in a big mixing bowl, ${K}.`, "a drop of ice water falls from the spoon onto the dough"],
  h_c_sugar1: [`Close view of ${H} pouring thick heavy cream from a glass measuring cup into an unbaked pie shell holding a layer of sugar and flour, ${K}.`, "the cream pours slowly into the pie shell"],
  h_c_sugar2: [`Close view of ${H} gently stirring cream in an unbaked pie shell with one index finger, the cream swirling with the sugar, ${K}.`, "the finger draws a slow circle in the cream"],
  h_c_sugar3: [`Close view of ${H} in quilted oven mitts sliding a glass pie plate of pale liquid sugar cream pie onto the rack of an open white enamel oven.`, "the pie slides slowly onto the oven rack"],
  h_c_shoo1: [`Close view of ${H} rubbing flour, brown sugar and cold butter between the fingertips over a yellow mixing bowl, crumbs falling back into the bowl, ${K}.`, "crumbs fall from the fingertips into the bowl"],
  h_c_shoo2: [`Close view of ${H} stirring baking soda into a glass measuring cup of steaming hot water, the water foaming and fizzing, a bowl of dark molasses beside it, ${K}.`, "the water fizzes and foams up in the cup"],
  h_c_bs1: [`Close view of ${H} stirring foaming melted butter and dark brown sugar with a wooden spoon in a black cast iron skillet ${S}.`, "the butter foams and the spoon stirs slowly"],
  h_c_bs2: [`Close view of ${H} stirring a dark amber bubbling butterscotch syrup with a wooden spoon in a black cast iron skillet ${S}.`, "the dark syrup bubbles around the spoon"],
  h_c_bs3: [`Close view of ${H} pouring warm milk from a small saucepan into a black skillet of dark butterscotch syrup, a big puff of steam, ${S}.`, "the milk pours in and steam rises"],
  h_c_lem1: [`Close view of ${H} spooning hot clear lemon mixture from a saucepan into a small bowl of beaten egg yolks, ${S}.`, "the hot mixture drips from the spoon into the yolks"],
  h_c_lem2: [`Close view of ${H} holding an old electric hand mixer beating egg whites into stiff glossy peaks in a big glass bowl, a cup of sugar beside it, ${K}.`, "the beaters spin in the glossy whites"],
  h_c_lem3: [`Close view of ${H} spreading white meringue with a spatula over a lemon pie and pushing it out to touch the crimped crust edge all the way around, ${K}.`, "the spatula pushes the meringue to the crust edge"],
  h_c_rai1: [`Close view of ${H} pouring a cup of dark raisins into a small saucepan of simmering water, steam rising, ${S}.`, "the raisins drop into the simmering water"],
  h_c_rai2: [`Close view of ${H} holding a spoonful of plump shiny raisins above a small metal sieve, steam rising, a white enamel sink behind.`, "steam rises from the plump raisins"],
  h_c_mock1: [`Close view of ${H} holding a round butter cracker broken into quarters above an unbaked pie crust half full of big cracker pieces, ${K}.`, "a cracker quarter drops into the crust"],
  h_c_mock2: [`Close view of ${H} dipping a fingertip into a saucepan of clear cooling syrup sitting on a kitchen windowsill with yellow checked curtains, an orchard outside.`, "the fingertip touches the syrup and ripples spread"],
  h_c_mock3: [`Close view of a young man's hand holding a fork taking a bite from a slice of golden double crust pie on a flowered plate, an old woman's hand resting on the table beside it, ${K}.`, "the fork lifts a bite of pie slowly"],
};
if (process.argv[2] === "write") {
  fs.writeFileSync("_v3/lorpies_hands_imgs.json", JSON.stringify(Object.entries(HANDS).map(([name, [p]]) => ({ name, prompt: BI(p) })), null, 1));
  fs.writeFileSync("_v3/lorpies_hands_i2v.json", JSON.stringify(Object.entries(HANDS).map(([nombre, [, motion]]) => ({ nombre, motion, gente: true })), null, 1));
  console.log(Object.keys(HANDS).length, "detalles");
}
