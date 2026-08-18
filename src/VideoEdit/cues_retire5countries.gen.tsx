// cues_retire5countries.gen.tsx — GENERADO por beatsheet.mjs desde retire5countries.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/retire5countries.json
import { ReactNode } from "react";
import { COLORS } from "./theme";
import { RawShot } from "./scenes/RawShot";
import { SplitList } from "./scenes/SplitList";
import { Checklist } from "./scenes/Checklist";
import { RuleNumberScene } from "./scenes/RuleNumberScene";
import { CalloutMark } from "./scenes/CalloutMark";
import { MistakeCard } from "./scenes/MistakeCard";
import { SignaturePhrase } from "./scenes/SignaturePhrase";
import { MedicareVsMedicaid } from "./scenes/MedicareVsMedicaid";
import { ActionStepCard } from "./scenes/ActionStepCard";
import { NextVideoEndcard } from "./scenes/NextVideoEndcard";
import { KeyPhrase } from "./scenes/KeyPhrase";
import { StatPills } from "./scenes/StatPills";
import { FloatingProp } from "./scenes/FloatingProp";

const A = COLORS.accent;

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "hook_1", start: 8.6, dur: 5.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/ra_beach_porch.png" hue="amber" /> },
  { key: "fill_0", start: 14.35, dur: 4.26, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_cr_beach.mp4" hue="amber" /> },
  { key: "hook_2", start: 21.61, dur: 4.26, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_beach_ocean.mp4" hue="good" clipDur={19.52} /> },
  { key: "hook_3", start: 25.87, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="My total spending this month? About *$1,300*" src="img/ra_beach_porch.png" /> },
  { key: "hook_4", start: 31.36, dur: 3.83, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_beach_town.mp4" hue="amber" clipDur={8.76} /> },
  { key: "hook_5", start: 35.19, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="My Social Security check makes me feel *rich*" src="broll/rac_beach_ocean.mp4" /> },
  { key: "hook_6", start: 41.41, dur: 5, kind: "statpills", el: (d) => <StatPills durationInFrames={d} pills={["Rent ~$400","Dinner ~$5","Beach 2 min"]} accent="amber" slider={false} /> },
  { key: "hook_7", start: 51.91, dur: 4.73, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_cafe_table.mp4" hue="amber" clipDur={27.84} /> },
  { key: "ohio_0", start: 56.64, dur: 5.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/ra_ohio_night.png" hue="amber" kicker="Ohio, two years ago" /> },
  { key: "ohio_1", start: 67.41, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Worked *40 years*. Paid the house down." src="img/ra_ohio_night.png" times={[9,18,28,55,63,67,77]} /> },
  { key: "ohio_2", start: 77.45, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="By the time everything's paid... *nothing left*" src="img/ra_ohio_night.png" /> },
  { key: "ohio_3", start: 87.5, dur: 4.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/ra_empty_chair.png" hue="amber" kicker="Her chair, still there" /> },
  { key: "ray_0", start: 98.16, dur: 5.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/ra_phone_call.png" hue="good" kicker="11 o'clock, a phone call" /> },
  { key: "fill_1", start: 103.91, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_cr_market.mp4" hue="amber" /> },
  { key: "fill_2", start: 111.51, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_cr_coffee.mp4" hue="amber" /> },
  { key: "ray_1", start: 122.17, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_phone_night.mp4" hue="amber" clipDur={10.94} /> },
  { key: "ray_2", start: 129.24, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="*You're doing the math in the wrong country*" src="img/ra_phone_call.png" /> },
  { key: "fill_3", start: 134.09, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_co_street.mp4" hue="amber" /> },
  { key: "ray_3", start: 142.93, dur: 5, kind: "floatprop", el: (d) => <FloatingProp durationInFrames={d} src="img/ra_plane_ticket.png" bg="broll/rac_beach_ocean.mp4" caption="One ticket. *Round trip.*" accent="amber" scale={0.8} /> },
  { key: "fill_4", start: 148.18, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_co_food.mp4" hue="amber" /> },
  { key: "promise_0", start: 159.23, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_redcarpet.mp4" hue="amber" clipDur={14.38} /> },
  { key: "fill_5", start: 164.48, dur: 4.79, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_co_cablecar.mp4" hue="amber" /> },
  { key: "promise_1", start: 172.27, dur: 2.15, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="They are *begging* Americans to come" src="broll/rac_redcarpet.mp4" /> },
  { key: "promise_2", start: 174.42, dur: 1.28, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_law_book.mp4" hue="good" clipDur={6.96} /> },
  { key: "promise_3", start: 175.7, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Cutting your bills in half — *by law*" src="broll/rac_law_book.mp4" times={[9,18,23,35,41,56,62]} /> },
  { key: "promise_4", start: 185.48, dur: 6.5, kind: "mistake", el: (d) => <MistakeCard durationInFrames={d} number="!" title="One mistake" desc="It can turn this whole dream into the most expensive lesson of your life. I almost made it." eyebrow="STAY FOR THIS" /> },
  { key: "fill_6", start: 192.23, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_pt_tram.mp4" hue="amber" /> },
  { key: "roadmap_0", start: 202.94, dur: 5, kind: "statpills", el: (d) => <StatPills durationInFrames={d} pills={["Avg check ~$1,900/mo","Just the check"]} accent="good" /> },
  { key: "fill_7", start: 208.19, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_pt_castle.mp4" hue="amber" /> },
  { key: "roadmap_1", start: 217.56, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Not a pension. Not investments. *Just the check.*" src="broll/rac_money_count.mp4" /> },
  { key: "fill_8", start: 222.41, dur: 3.55, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_pt_coast.mp4" hue="amber" /> },
  { key: "roadmap_2", start: 228.96, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_money_count.mp4" hue="amber" clipDur={10.84} /> },
  { key: "roadmap_3", start: 236.89, dur: 6, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="The 5 countries" items={["Costa Rica","Colombia","Portugal","Ecuador","Panama"]} accent={A} /> },
  { key: "fill_9", start: 243.14, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_ec_plaza.mp4" hue="amber" /> },
  { key: "costarica_0", start: 255.88, dur: 3.2, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="05" title="Costa Rica" hue="good" /> },
  { key: "costarica_1", start: 262.14, dur: 7.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_cr_rainforest.mp4" hue="amber" clipDur={30.86} /> },
  { key: "costarica_2", start: 269.75, dur: 4.07, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_cr_town.mp4" hue="amber" clipDur={31.13} /> },
  { key: "costarica_3", start: 273.82, dur: 5, kind: "statpills", el: (d) => <StatPills durationInFrames={d} pills={["Pensionado visa","$1,000/mo income"]} accent="amber" slider={false} /> },
  { key: "costarica_4", start: 281.96, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="If your check clears *$1,000*, you qualify" src="broll/rac_cr_town.mp4" /> },
  { key: "fill_10", start: 286.81, dur: 3.47, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_ec_andes.mp4" hue="amber" /> },
  { key: "costarica_5", start: 293.28, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_cr_toucan.mp4" hue="amber" clipDur={24.52} /> },
  { key: "costarica_6", start: 301.17, dur: 8.5, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="Public healthcare (the Caja)" items={[{"text":"Legal resident pays in by income","state":"done"},{"text":"~$60–$130 a month","state":"done"},{"text":"Doctor visits · prescriptions · surgery","state":"done"}]} accent="good" hue="good" /> },
  { key: "fill_11", start: 309.92, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_ec_llama.mp4" hue="amber" /> },
  { key: "fill_12", start: 317.52, dur: 3.57, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_pa_canal.mp4" hue="amber" /> },
  { key: "costarica_7", start: 324.09, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="But the public system *has waits* — be honest" src="broll/rac_doctor_clinic.mp4" accent="amber" /> },
  { key: "fill_13", start: 328.94, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_pa_beach.mp4" hue="amber" /> },
  { key: "costarica_8", start: 341.38, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_doctor_clinic.mp4" hue="amber" clipDur={6.38} /> },
  { key: "fill_14", start: 346.63, dur: 3.79, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_pa_oldtown.mp4" hue="amber" /> },
  { key: "costarica_9", start: 353.42, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="*Pura vida* — a slower way through the day" src="broll/rac_cr_rainforest.mp4" /> },
  { key: "fill_15", start: 358.27, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_older_couple_walk.mp4" hue="amber" /> },
  { key: "fill_16", start: 365.87, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_airport.mp4" hue="amber" /> },
  { key: "costarica_10", start: 375.96, dur: 5, kind: "statpills", el: (d) => <StatPills durationInFrames={d} pills={["Couple ~$2,000–2,500","Rent $500–$700"]} accent="amber" /> },
  { key: "fill_17", start: 381.21, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_suitcase.mp4" hue="amber" /> },
  { key: "fill_18", start: 388.81, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_passport_book.mp4" hue="amber" /> },
  { key: "fill_19", start: 396.41, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_market_fish.mp4" hue="amber" /> },
  { key: "fill_20", start: 404.01, dur: 3.83, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_coffee_pour.mp4" hue="amber" /> },
  { key: "colombia_0", start: 410.84, dur: 3.2, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="04" title="Colombia" hue="amber" /> },
  { key: "colombia_1", start: 417.81, dur: 7.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_co_medellin.mp4" hue="amber" clipDur={9.04} /> },
  { key: "colombia_2", start: 426.27, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="The picture in your head is *30 years* out of date" src="broll/rac_co_medellin.mp4" accent="amber" /> },
  { key: "colombia_3", start: 433.64, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_co_flowers.mp4" hue="amber" clipDur={7.07} /> },
  { key: "colombia_4", start: 438.78, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="The *City of Eternal Spring* — 72°, every day" src="broll/rac_co_flowers.mp4" /> },
  { key: "fill_21", start: 443.63, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_apartment_interior.mp4" hue="amber" /> },
  { key: "fill_22", start: 451.23, dur: 4.39, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_pharmacy.mp4" hue="amber" /> },
  { key: "colombia_5", start: 458.62, dur: 5, kind: "statpills", el: (d) => <StatPills durationInFrames={d} pills={["Pensioner visa","~$900–$1,000/mo"]} accent="amber" slider={false} /> },
  { key: "fill_23", start: 463.87, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_doctor_talk.mp4" hue="amber" /> },
  { key: "fill_24", start: 471.47, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_house_for_sale.mp4" hue="amber" /> },
  { key: "fill_25", start: 479.07, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_moving_boxes.mp4" hue="amber" /> },
  { key: "colombia_6", start: 489.32, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_co_apartment.mp4" hue="amber" clipDur={10.13} /> },
  { key: "fill_26", start: 494.57, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_video_call.mp4" hue="amber" /> },
  { key: "colombia_7", start: 503.13, dur: 5, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="$1,200" image="img/ra_co_apartment_c.png" caption="Linda's all-in monthly spend — everything" accent="good" hue="amber" /> },
  { key: "fill_27", start: 508.38, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_beach_sunset.mp4" hue="amber" /> },
  { key: "fill_28", start: 515.98, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_town_square.mp4" hue="amber" /> },
  { key: "fill_29", start: 523.58, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_hands_coffee_talk.mp4" hue="amber" /> },
  { key: "colombia_8", start: 533.83, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Learn some *Spanish* — you'll really need it" src="broll/rac_co_medellin.mp4" accent="amber" /> },
  { key: "fill_30", start: 538.68, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_palm_road.mp4" hue="amber" /> },
  { key: "portugal_0", start: 552.02, dur: 2.68, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="03" title="Portugal" hue="amber" /> },
  { key: "portugal_1", start: 554.7, dur: 3.26, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_pt_algarve.mp4" hue="good" clipDur={10.68} /> },
  { key: "portugal_2", start: 557.96, dur: 1.74, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_pt_cobblestone.mp4" hue="amber" clipDur={6.04} /> },
  { key: "portugal_3", start: 559.7, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="This is *Europe*. On a Social Security check." src="broll/rac_pt_cobblestone.mp4" /> },
  { key: "fill_31", start: 564.55, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_fruit_hands.mp4" hue="amber" /> },
  { key: "fill_32", start: 572.15, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_boat_harbor.mp4" hue="amber" /> },
  { key: "portugal_4", start: 582.49, dur: 5, kind: "statpills", el: (d) => <StatPills durationInFrames={d} pills={["D7 visa","~€870/mo floor"]} accent="amber" slider={false} /> },
  { key: "fill_33", start: 587.74, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_cathedral.mp4" hue="amber" /> },
  { key: "fill_34", start: 595.34, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_mountain_town.mp4" hue="amber" /> },
  { key: "fill_35", start: 602.94, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_cafe_people.mp4" hue="amber" /> },
  { key: "portugal_5", start: 612.72, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="The average check qualifies you for the *European Union*" src="broll/rac_pt_algarve.mp4" accent="good" /> },
  { key: "fill_36", start: 617.57, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_hammock.mp4" hue="amber" /> },
  { key: "fill_37", start: 625.17, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_street_food.mp4" hue="amber" /> },
  { key: "fill_38", start: 632.77, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_sunrise_sea.mp4" hue="amber" /> },
  { key: "portugal_6", start: 641.05, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_pt_market.mp4" hue="amber" clipDur={24.27} /> },
  { key: "fill_39", start: 646.3, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_old_couple_cook.mp4" hue="amber" /> },
  { key: "portugal_7", start: 657.96, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Portugal got *popular* — look inland to save" src="broll/rac_pt_cobblestone.mp4" accent="amber" /> },
  { key: "fill_40", start: 662.81, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_bank_desk.mp4" hue="amber" /> },
  { key: "portugal_8", start: 672.95, dur: 5, kind: "floatprop", el: (d) => <FloatingProp durationInFrames={d} src="img/ra_wine_bottle.png" bg="broll/rac_market_produce.mp4" caption="Good wine, a few *dollars* a bottle" accent="good" scale={0.7} /> },
  { key: "fill_41", start: 678.2, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_calendar_plan.mp4" hue="amber" /> },
  { key: "fill_42", start: 685.8, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_window_view.mp4" hue="amber" /> },
  { key: "ecuador_0", start: 699.72, dur: 3.2, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="02" title="Ecuador" hue="good" /> },
  { key: "ecuador_1", start: 704.86, dur: 6.24, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_ec_cuenca.mp4" hue="amber" clipDur={35.44} /> },
  { key: "ecuador_2", start: 711.1, dur: 5, kind: "floatprop", el: (d) => <FloatingProp durationInFrames={d} src="img/ra_us_dollar.png" bg="broll/rac_passport_stamp.mp4" caption="Ecuador uses the *US dollar*" accent="good" scale={0.7} /> },
  { key: "ecuador_3", start: 718.81, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="No exchange rate. *What you see is what you get.*" src="broll/rac_ec_cuenca.mp4" /> },
  { key: "fill_43", start: 723.66, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_dog_beach.mp4" hue="amber" /> },
  { key: "ecuador_4", start: 735.5, dur: 5, kind: "statpills", el: (d) => <StatPills durationInFrames={d} pills={["Pensioner visa","~$1,400/mo"]} accent="amber" slider={false} /> },
  { key: "ecuador_5", start: 759.34, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="This is where Ecuador starts *begging*" src="broll/rac_ec_market.mp4" /> },
  { key: "ecuador_6", start: 776.13, dur: 8.5, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="Senior discounts — by law (65+)" items={[{"text":"50% off airline tickets","state":"done"},{"text":"50% off public transportation","state":"done"},{"text":"50% off cultural & sporting events","state":"done"},{"text":"Sales tax refunded to you","state":"done"}]} accent="good" hue="good" /> },
  { key: "ecuador_7", start: 810.1, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_ec_market.mp4" hue="amber" clipDur={6.72} /> },
  { key: "ecuador_8", start: 821.79, dur: 5, kind: "statpills", el: (d) => <StatPills durationInFrames={d} pills={["Single ~$1,200–1,300","Rent $300–$500"]} accent="amber" /> },
  { key: "ecuador_9", start: 847.78, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Roads and paperwork need *patience* — honest" src="broll/rac_ec_market.mp4" accent="amber" /> },
  { key: "panama_0", start: 861.76, dur: 3.2, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="01" title="Panama" hue="amber" /> },
  { key: "panama_1", start: 866.67, dur: 5.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_pa_skyline.mp4" hue="amber" clipDur={36.7} /> },
  { key: "panama_2", start: 872.63, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="The *most generous* retirement program I've ever seen" src="broll/rac_pa_skyline.mp4" /> },
  { key: "panama_3", start: 891.81, dur: 5, kind: "statpills", el: (d) => <StatPills durationInFrames={d} pills={["Pensionado visa","$1,000/mo","US dollar"]} accent="amber" slider={false} /> },
  { key: "panama_4", start: 917.24, dur: 8.5, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="Pensioner discounts — by law" items={[{"text":"25% off airline tickets","state":"done"},{"text":"25% off restaurants","state":"done"},{"text":"20% off doctor visits & medicine","state":"done"},{"text":"25% off electric & phone bills","state":"done"},{"text":"50% off movies & shows","state":"done"}]} accent="good" hue="amber" /> },
  { key: "panama_5", start: 950.5, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="They wrote *we want you* right into the law" src="broll/rac_pa_skyline.mp4" accent="good" /> },
  { key: "panama_6", start: 973.37, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_pa_boquete.mp4" hue="amber" clipDur={40.71} /> },
  { key: "panama_7", start: 989.71, dur: 4.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/ra_marisol.png" hue="amber" kicker="Marisol, at the fruit stand" /> },
  { key: "panama_8", start: 1015.86, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="A little house, *one street back* from the water" src="img/ra_little_house.png" times={[0,0,0,9,13,22,29,34,38]} /> },
  { key: "panama_9", start: 1027.86, dur: 4.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/ra_little_house.png" hue="amber" /> },
  { key: "panama_10", start: 1043.78, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_pa_hospital.mp4" hue="amber" clipDur={4.74} /> },
  { key: "panama_11", start: 1050.15, dur: 5, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="$40–50k" image="img/ra_pa_hospital.png" caption="What that surgery would've cost back home" accent="amber" hue="good" /> },
  { key: "recap_0", start: 1066.08, dur: 3.21, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="The door is wide open" items={["Costa Rica","Colombia","Portugal","Ecuador","Panama"]} accent={A} /> },
  { key: "recap_1", start: 1069.29, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Set at a number your check can *actually clear*" src="broll/rac_beach_ocean.mp4" accent="good" /> },
  { key: "warnings_0", start: 1085.42, dur: 5.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/ra_host_serious.png" hue="good" kicker="Now the honest part" /> },
  { key: "warnings_1", start: 1091.55, dur: 4.44, kind: "vsmed", el: (d) => <MedicareVsMedicaid durationInFrames={d} leftTitle="MEDICARE in the US" leftItems={[{"text":"Covers you","ok":true}]} rightTitle="MEDICARE abroad" rightItems={[{"text":"Does NOT come with you","ok":false},{"text":"Does not work overseas","ok":false}]} eyebrow="The #1 mistake" /> },
  { key: "warnings_2", start: 1095.99, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Medicare *does not* work outside the US" src="broll/rac_doctor_clinic.mp4" accent="danger" /> },
  { key: "warnings_3", start: 1107.85, dur: 8.5, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="So instead" items={[{"text":"Get onto the local system","state":"done"},{"text":"Or buy international health insurance","state":"done"},{"text":"Keep Medicare Part A for big stuff back home","state":"done"},{"text":"Have a plan — don't wing it","state":"done"}]} accent="good" hue="good" /> },
  { key: "taxes_0", start: 1128.43, dur: 7.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_tax_form.mp4" hue="amber" clipDur={11.8} /> },
  { key: "taxes_1", start: 1141.26, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="The US taxes your *worldwide income* — you always file" src="broll/rac_tax_form.mp4" accent="danger" /> },
  { key: "taxes_2", start: 1152.64, dur: 5, kind: "floatprop", el: (d) => <FloatingProp durationInFrames={d} src="img/ra_fbar_form.png" bg="broll/rac_cafe_table.mp4" caption="Over $10k in a bank? *File the FBAR*" accent="danger" scale={0.8} /> },
  { key: "taxes_3", start: 1170.06, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Call an accountant who *knows expat taxes*" src="broll/rac_money_count.mp4" accent="amber" /> },
  { key: "house_0", start: 1182.42, dur: 6.5, kind: "mistake", el: (d) => <MistakeCard durationInFrames={d} number="3" title="Don't sell everything on trip one" desc="Rent for a year before you buy. Keep your exit door open. Keep a cushion back home." eyebrow="THE BIG ONE" /> },
  { key: "house_1", start: 1212.99, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Paradise for two weeks is *different* on a Tuesday" src="broll/rac_beach_town.mp4" accent="amber" /> },
  { key: "house_2", start: 1231.54, dur: 4.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/ra_welder_condo.png" hue="amber" kicker="A man I knew" /> },
  { key: "house_3", start: 1252.74, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="His money was just... *gone*. An ocean away." src="img/ra_welder_condo.png" accent="danger" /> },
  { key: "house_4", start: 1272.71, dur: 6.5, kind: "action", el: (d) => <ActionStepCard durationInFrames={d} step="Rent before you buy — for a year" question="If you wanted to come home in six months, could you?" eyebrow="The rule" /> },
  { key: "mexico_0", start: 1303.28, dur: 3.06, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Rules *change* — confirm with the consulate" src="broll/rac_passport_stamp.mp4" accent="amber" /> },
  { key: "mexico_1", start: 1306.34, dur: 2.13, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_passport_stamp.mp4" hue="amber" clipDur={14.81} /> },
  { key: "mexico_2", start: 1308.47, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Mexico *quietly raised* the income bar" src="broll/rac_beach_town.mp4" accent="amber" /> },
  { key: "mexico_3", start: 1324.1, dur: 5, kind: "statpills", el: (d) => <StatPills durationInFrames={d} pills={["Mexico income","now > avg check"]} accent="amber" slider={false} /> },
  { key: "close_0", start: 1348.3, dur: 4.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/ra_beach_walk.png" hue="amber" kicker="For the first time in years" /> },
  { key: "close_1", start: 1353.26, dur: 2.2, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="It was never that I didn't have *enough money*" src="img/ra_beach_walk.png" /> },
  { key: "close_2", start: 1355.46, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="The moment I moved the check... *everything changed*" src="broll/rac_beach_ocean.mp4" accent="good" /> },
  { key: "close_3", start: 1365.02, dur: 5, kind: "statpills", el: (d) => <StatPills durationInFrames={d} pills={["No alarm","Real food","Money left over"]} accent="good" slider={false} /> },
  { key: "cta_0", start: 1377.69, dur: 6.5, kind: "action", el: (d) => <ActionStepCard durationInFrames={d} step="Grab the free step-by-step guide" question="Exact income numbers, visa paperwork, real budgets, and a scouting-trip checklist." eyebrow="Free — in the description" /> },
  { key: "cta_1", start: 1392.05, dur: 4.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="It's *completely free* — link in the description" src="broll/rac_cafe_table.mp4" accent="good" /> },
  { key: "outro_0", start: 1400.1, dur: 6, kind: "nextvideo", el: (d) => <NextVideoEndcard durationInFrames={d} title="Inside each country" kicker="Coming up" sub="The actual neighborhoods, the actual apartments, the actual grocery bills." /> },
  { key: "outro_1", start: 1407.43, dur: 6.5, kind: "signature", el: (d) => <SignaturePhrase durationInFrames={d} lines={[{"text":"I was doing the math"},{"text":"in the wrong country."},{"text":"Come do the math down here.","gold":true}]} eyebrow="Ray was right" /> },
  { key: "outro_2", start: 1416.34, dur: 5.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/ra_outro_smile.png" hue="amber" kicker="The water's warm" /> },
  { key: "tail", start: 1421.84, dur: 5.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rac_beach_sunset.mp4" hue="amber" /> },
];

export const REFRAME: { start: number; end: number }[] = [];

export const OVERLAYS: Cue[] = [

];

// cama de música (AudioBed) — null si el beatsheet no define "music"
export const AUDIO_BED: { src: string; activity: [number, number][]; base: number; duck: number; totalSec: number; loop: boolean } | null = null;

// riel de SFX suaves (SfxRail) — [] si "sfx": false
export const SFX_CUES: { at: number; role: string; vol?: number }[] = [{"at":25.87,"role":"popUp","vol":0.32},{"at":35.19,"role":"popUp","vol":0.32},{"at":41.41,"role":"popUp","vol":0.32},{"at":67.41,"role":"popUp","vol":0.32},{"at":77.45,"role":"popUp","vol":0.32},{"at":129.24,"role":"popUp","vol":0.32},{"at":142.93,"role":"popUp","vol":0.32},{"at":172.27,"role":"popUp","vol":0.32},{"at":175.7,"role":"popUp","vol":0.32},{"at":185.48,"role":"popUp","vol":0.32},{"at":202.94,"role":"popUp","vol":0.32},{"at":217.56,"role":"popUp","vol":0.32},{"at":236.89,"role":"popUp","vol":0.32},{"at":255.88,"role":"popUp","vol":0.32},{"at":273.82,"role":"popUp","vol":0.32},{"at":281.96,"role":"popUp","vol":0.32},{"at":301.17,"role":"popUp","vol":0.32},{"at":324.09,"role":"popUp","vol":0.32},{"at":353.42,"role":"popUp","vol":0.32},{"at":375.96,"role":"popUp","vol":0.32},{"at":410.84,"role":"popUp","vol":0.32},{"at":426.27,"role":"popUp","vol":0.32},{"at":438.78,"role":"popUp","vol":0.32},{"at":458.62,"role":"popUp","vol":0.32},{"at":503.13,"role":"popUp","vol":0.32},{"at":533.83,"role":"popUp","vol":0.32},{"at":552.02,"role":"popUp","vol":0.32},{"at":559.7,"role":"popUp","vol":0.32},{"at":582.49,"role":"popUp","vol":0.32},{"at":612.72,"role":"popUp","vol":0.32},{"at":657.96,"role":"popUp","vol":0.32},{"at":672.95,"role":"popUp","vol":0.32},{"at":699.72,"role":"popUp","vol":0.32},{"at":711.1,"role":"popUp","vol":0.32},{"at":718.81,"role":"popUp","vol":0.32},{"at":735.5,"role":"popUp","vol":0.32},{"at":759.34,"role":"popUp","vol":0.32},{"at":776.13,"role":"popUp","vol":0.32},{"at":821.79,"role":"popUp","vol":0.32},{"at":847.78,"role":"popUp","vol":0.32},{"at":861.76,"role":"popUp","vol":0.32},{"at":872.63,"role":"popUp","vol":0.32},{"at":891.81,"role":"popUp","vol":0.32},{"at":917.24,"role":"popUp","vol":0.32},{"at":950.5,"role":"popUp","vol":0.32},{"at":1015.86,"role":"popUp","vol":0.32},{"at":1050.15,"role":"popUp","vol":0.32},{"at":1066.08,"role":"popUp","vol":0.32},{"at":1069.29,"role":"popUp","vol":0.32},{"at":1091.55,"role":"popUp","vol":0.32},{"at":1095.99,"role":"popUp","vol":0.32},{"at":1107.85,"role":"popUp","vol":0.32},{"at":1141.26,"role":"popUp","vol":0.32},{"at":1152.64,"role":"popUp","vol":0.32},{"at":1170.06,"role":"popUp","vol":0.32},{"at":1182.42,"role":"popUp","vol":0.32},{"at":1212.99,"role":"popUp","vol":0.32},{"at":1252.74,"role":"popUp","vol":0.32},{"at":1272.71,"role":"popUp","vol":0.32},{"at":1303.28,"role":"popUp","vol":0.32},{"at":1308.47,"role":"popUp","vol":0.32},{"at":1324.1,"role":"popUp","vol":0.32},{"at":1353.26,"role":"popUp","vol":0.32},{"at":1355.46,"role":"popUp","vol":0.32},{"at":1365.02,"role":"popUp","vol":0.32},{"at":1377.69,"role":"popUp","vol":0.32},{"at":1392.05,"role":"popUp","vol":0.32},{"at":1400.1,"role":"popUp","vol":0.32},{"at":1407.43,"role":"popUp","vol":0.32}];
