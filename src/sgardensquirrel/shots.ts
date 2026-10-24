// sgardensquirrel · las 131 fotos (cada una UNA vez), ancladas a la frase que se dice en ese segundo.
// Se buscan en orden (cada frase después de la anterior). Sólo se ven en los tramos sin avatar; duran hasta la próxima foto (máx 3,6 s).
import { at } from "./lib";
import { WIN } from "./ink";

const L: [string, string][] = [
  ["f_coffee_stop", "with your coffee"], ["n_dug_bed", "looks like somebody dug it"], ["n_bitten_bulb", "one bulb with a bite"], ["f_kneel_holes", "like a half-eaten apple"], ["n_squirrel_fence", "a gray squirrel"],
  ["f_bed_ceiling", "you lie in bed"], ["n_exterminator_van", "so you call a man"], ["n_invoice", "and he says"], ["f_linda", "my neighbor linda paid"],
  ["f_sit_garden", "come sit with me"], ["n_osaka_house", "behind our little wooden house"],
  ["n_tanuki", "a raccoon dog"], ["n_oak_rental", "a little rented house"], ["n_young_tomatoes", "i planted tomatoes"], ["n_bitten_tomatoes", "had one bite in it"],
  ["n_airmail", "so i wrote a letter"], ["f_letter_tin", "in a tin box"], ["n_mother_letter", "thin blue paper"],
  ["n_squirrel_bury", "to bury food for the winter"], ["n_attic_nest", "a hotel with no price"], ["f_listen_ceiling", "listen to the clock"], ["n_roof_corner", "look at the edge of the roof"],
  ["n_squirrel_hole", "chews a round hole"], ["n_wood_crumbs", "wood crumbs"], ["n_green_tomato_fence", "half-eaten green tomatoes"], ["f_notebook", "a small notebook for the garden"],
  ["f_cayenne_jar", "any hot red pepper"], ["n_flakes_jar", "you put on pizza"], ["n_chili_strings", "long red strings"], ["n_pestle", "wooden pestle"],
  ["n_quart_water", "one quart of water"], ["f_pot_simmer", "put the water in an old pot"], ["n_simmer_close", "very small bubbles"], ["n_overnight", "let it sit"], ["n_orange_water", "the water is orange-red"],
  ["f_strain_filter", "a coffee filter in a funnel"], ["n_clogged_nozzle", "it blocks the nozzle"],
  ["n_gloves_bottle", "wear gloves"], ["f_label_bottle", "write chili on it"],
  ["n_bulbs_tray", "put your bulbs in a paper bag"], ["f_bag_shake", "shake it gently"], ["f_red_bulbs", "plant them the normal way"], ["f_salt_line", "salting a big plate of rice"],
  ["f_chicken_wire", "a piece of chicken wire"], ["n_wire_bed", "with a few stones on the corners"], ["n_tulips_through", "the tulips grow right up"],
  ["f_seed_bowl", "four cups of bird seed"], ["n_shiny_seed", "every seed is a little shiny"], ["f_fill_feeder", "fill the feeder"], ["n_cardinal_feeder", "the cardinals and the chickadees"],
  ["n_squirrel_rub", "rubs its face"], ["f_laugh_squirrel", "it is a little funny"],
  ["f_after_rain", "it rains"], ["n_washed_gutter", "it is in the gutter now"],
  ["f_dish_soap", "the one next to your sink"], ["f_soap_bar", "plain white laundry soap"], ["n_soap_plain", "here we have it already liquid"], ["n_drops_leaf", "it makes little drops"], ["n_spread_leaf", "spread flat on the leaf"],
  ["f_teaspoon", "and one teaspoon of dish soap"], ["n_bubbles_bottle", "a bottle full of bubbles"], ["f_turn_bottle", "upside down slowly"], ["f_test_leaf", "spray one leaf"],
  ["f_spray_morning", "in the morning or in the evening"], ["f_fridge_door", "in the refrigerator door"],
  ["n_squirrel_pot", "squirrels love to dig in flower pots"], ["f_clay_pot", "her clay pots with soapy water"],
  ["n_brown_spots", "brown spots"], ["n_cheap_soap", "the cheapest one"],
  ["n_hokkaido_mint", "from hokkaido"], ["n_mint_drawer", "in the kitchen drawer"], ["f_mint_bottle", "in any pharmacy"], ["f_drops_cotton", "10 to 15 drops"], ["n_cotton_lids", "a little open jar lid"],
  ["f_attic_place", "then place them in the attic"], ["n_attic_lids", "where the roof meets the floor"], ["n_calendar_3days", "every three or four days"], ["n_squirrel_babies", "a mother does not leave her babies"],
  ["f_cat_mochi", "i have a cat mochi"], ["f_mint_pot", "a pot of mint next to the door"], ["n_mint_border", "a row of mint"], ["f_crush_mint", "crushed mint leaves"],
  ["f_daffodils", "plant some bulbs the squirrels do not like"], ["n_daffodil_ring", "like a fence of guards"], ["n_alliums", "the tall purple balls"],
  ["f_water_dish", "put a shallow dish of water"], ["f_pick_tomato", "pick the tomatoes early"], ["f_windowsill", "the kitchen windowsill"], ["n_hoshigaki", "dried persimmons"], ["n_tomato_table", "out of maybe a hundred"],
  ["n_feeder_pole", "hang the feeder on a metal pole"], ["n_rice_sacks", "the rice sacks in the shed"],
  ["f_look_roof", "and look up"], ["n_stain_hole", "a dark stain around it"], ["f_tea_watch", "sit and watch it in the morning"], ["n_squirrel_exit", "if a squirrel goes in or comes out"],
  ["f_radio_attic", "leave a small radio"],
  ["n_oneway_door", "a small tube of wire mesh"], ["n_foam_chewed", "chews foam like candy"], ["f_hardware_cloth", "you use hardware cloth"], ["n_mesh_screwed", "with screws and washers"],
  ["n_painted_patch", "painted the same color"], ["f_chili_paste", "a little chili paste around the edges"], ["n_hollow_tree", "a hollow tree"],
  ["n_branch_roof", "from a tree branch"], ["f_ladder_help", "ask a young neighbor"],
  ["n_chimney_cap", "put a cap with a mesh"], ["n_vent_mesh", "check the vents"], ["n_gutter_gap", "the gaps where the gutter"],
  ["n_catfood_porch", "a bowl of cat food"], ["f_clean_feeder", "clean under the feeder"], ["n_compost", "cover the compost"], ["n_fallen_apples", "pick up the fallen apples"],
  ["n_soffit_hole", "right through the soffit"], ["n_wall_open", "he had to open the wall"],
  ["n_hawk", "eaten by a hawk"], ["n_owl", "the owl is the best worker"],
  ["f_comments", "some of you asked me questions"], ["n_dog_sniff", "if your dog sniffs"], ["n_chickadee", "the chickadees eat my red seed"],
  ["n_september_leaves", "in the fall september"], ["n_frost_roof", "in winter december"], ["n_spring_garden", "in spring march"], ["n_summer_tomatoes", "in summer june"],
  ["f_december_walk", "every year in december"], ["n_oak_squirrels", "back to the oak tree"],
  ["n_recap_table", "so one more time"], ["n_osaka_1990s", "the last time i visited"], ["f_tin_close", "i still have her letter"], ["f_wave_bye", "thank you for sitting with me"],
];

export type Shot = { a: number; b: number; img: string };
const avAt = (t: number) => WIN.find((w) => t >= w.ms - 0.45 && t < w.me + 0.05);
export const SHOTS: Shot[] = (() => {
  const raw: { a: number; img: string }[] = [];
  let prev = 0;
  for (const [img, ph] of L) { prev = at(ph, prev); raw.push({ a: prev, img }); }
  const out: Shot[] = [];
  raw.forEach((r, i) => {
    let a = r.a;
    const w = avAt(a); if (w) a = w.me + 0.05;           // cae en el avatar: entra apenas termina la ventana
    let b = Math.min(a + 3.6, i + 1 < raw.length ? raw[i + 1].a : a + 3.6);
    const nx = WIN.find((x) => x.ms > a); if (nx) b = Math.min(b, nx.ms - 0.45);
    if (out.length && a < out[out.length - 1].b) a = out[out.length - 1].b;
    if (b - a >= 1.2) out.push({ a, b, img: r.img });
  });
  return out;
})();
export const SHOT_NAMES = L.map((x) => x[0]);
