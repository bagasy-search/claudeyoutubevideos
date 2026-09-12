import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  FedBeforeAfter,
  FedHero,
  FedLowerThird,
  FedMolecule,
  FedQuote,
  FedStat,
  FedStep,
} from "../FedererKit";

export const TOTAL_FRAMES_VXNEE2W76SQI = 47494;

const AVATAR_RANGES: ReadonlyArray<readonly [number, number]> = [
  [0, 124],
  [569, 934],
  [1183, 1362],
  [1934, 2063],
  [2396, 2481],
  [3040, 3164],
  [3389, 3611],
  [5000, 5272],
  [5359, 5508],
  [5798, 6034],
  [6302, 6422],
  [6831, 6925],
  [7892, 7965],
  [8700, 8859],
  [9458, 9799],
  [11019, 11276],
  [11564, 11659],
  [12056, 12197],
  [12288, 12472],
  [13408, 13525],
  [14470, 14813],
  [15519, 15706],
  [16086, 16172],
  [17648, 17728],
  [18097, 18194],
  [18752, 18857],
  [19212, 19396],
  [20584, 21145],
  [21480, 21637],
  [22260, 22380],
  [22975, 23143],
  [23843, 23956],
  [25037, 25135],
  [25463, 25726],
  [26808, 26975],
  [27089, 27208],
  [27377, 27553],
  [27653, 27779],
  [28258, 28761],
  [29545, 29727],
  [30231, 30354],
  [31722, 31822],
  [32089, 32338],
  [33045, 33236],
  [33551, 33932],
  [34048, 34307],
  [35494, 35763],
  [36328, 36409],
  [37057, 37129],
  [37540, 37714],
  [38926, 39214],
  [39593, 39689],
  [40381, 41264],
  [41792, 42407],
  [42915, 43037],
  [43255, 43411],
  [45394, 45610],
  [45774, 46075],
  [47153, 47494],
];

const FALLBACK_CHAPTERS: ReadonlyArray<readonly [number, string]> = [
  [0, "img/vxnee2w76sqi/vxnee2w76sqi_i005_rosemary_wrinkles_spots_theme.png"],
  [6000, "img/vxnee2w76sqi/vxnee2w76sqi_i031_three_products_table.png"],
  [12000, "img/vxnee2w76sqi/vxnee2w76sqi_i054_forearm_patch_application.png"],
  [18000, "img/vxnee2w76sqi/vxnee2w76sqi_i068_fine_lines_less_visible.png"],
  [24000, "img/vxnee2w76sqi/vxnee2w76sqi_i078_tinted_sunscreen_iron_oxides.png"],
  [30000, "img/vxnee2w76sqi/vxnee2w76sqi_i098_rosmarinic_carnosic_molecules.png"],
  [36000, "img/vxnee2w76sqi/vxnee2w76sqi_i123_final_family_gathering.png"],
  [42000, "img/vxnee2w76sqi/vxnee2w76sqi_i127_rinse_and_protect_safety.png"],
  [46000, "img/vxnee2w76sqi/vxnee2w76sqi_i128_three_kitchen_dangers_teaser.png"],
];

const BLACK_COVER_RANGES: ReadonlyArray<readonly [number, number]> = [
  [2617, 2718],
  [2991, 3056],
  [3300, 3405],
  [10219, 10323],
  [12731, 12830],
  [14131, 14232],
  [14956, 15075],
  [16879, 16972],
  [17497, 17583],
  [19150, 19238],
  [19541, 19642],
  [24104, 24211],
  [25410, 25491],
  [26570, 26634],
  [26752, 26838],
  [28201, 28287],
  [31182, 31283],
  [33485, 33585],
  [36294, 36363],
  [38305, 38378],
  [39844, 39946],
  [41730, 41829],
  [43570, 43639],
  [44041, 44117],
  [45333, 45434],
];

type MediaBeatProps = {
  durationInFrames: number;
  beat: number;
  kind: "image" | "video";
  src: string;
  secondaryImage?: string;
};

const AvatarStageVxnee2w76sqi: React.FC = () => {
  const frame = useCurrentFrame();
  const full = AVATAR_RANGES.some(([start, end]) => frame >= start && frame < end);
  const cycle = frame % 720;
  const reverse = Math.floor(frame / 720) % 2 === 1;
  const scale = interpolate(cycle, [0, 720], reverse ? [1.034, 1.006] : [1.006, 1.034], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x = Math.sin(frame / 260) * 0.18;
  const y = Math.cos(frame / 310) * 0.12;

  return (
    <AbsoluteFill style={{opacity: full ? 1 : 0, backgroundColor: "#061013", overflow: "hidden"}}>
      <OffthreadVideo
        src={staticFile("vxnee2w76sqi_opt.mp4")}
        volume={1}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 48%",
          transformOrigin: "50% 38%",
          scale,
          translate: `${x}% ${y}%`,
        }}
      />
    </AbsoluteFill>
  );
};

const StoryFallbackBedVxnee2w76sqi: React.FC = () => {
  const frame = useCurrentFrame();
  const active = BLACK_COVER_RANGES.some(([start, end]) => frame >= start && frame < end);
  const chapter =
    [...FALLBACK_CHAPTERS].reverse().find(([start]) => frame >= start) ??
    FALLBACK_CHAPTERS[0];
  const scale = interpolate(frame % 600, [0, 599], [1.025, 1.07], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{backgroundColor: "#172326", overflow: "hidden", opacity: active ? 1 : 0}}>
      <Img
        src={staticFile(chapter[1])}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale,
          filter: "brightness(0.76) saturate(0.9)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(110deg, rgba(4,13,15,0.3), rgba(4,13,15,0.05) 52%, rgba(4,13,15,0.36))",
        }}
      />
    </AbsoluteFill>
  );
};

const VisualSurface: React.FC<{
  durationInFrames: number;
  beat: number;
  children: React.ReactNode;
}> = ({durationInFrames, beat, children}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], beat % 2 ? [1.01, 1.075] : [1.065, 1.01], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], beat % 2 ? [-0.7, 0.7] : [0.7, -0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{backgroundColor: "#061013", overflow: "hidden"}}>
      <AbsoluteFill style={{scale, translate: `${x}% 0%`}}>{children}</AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(3,10,12,0.05) 0%, rgba(3,10,12,0) 55%, rgba(3,10,12,0.28) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const MediaBeat: React.FC<MediaBeatProps> = ({durationInFrames, beat, kind, src, secondaryImage}) => {
  const half = Math.max(1, Math.floor(durationInFrames / 2));
  const primary = (
    <VisualSurface durationInFrames={secondaryImage ? half : durationInFrames} beat={beat}>
      {kind === "video" ? (
        <OffthreadVideo
          src={staticFile(src)}
          muted
          style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 50%"}}
        />
      ) : (
        <Img
          src={staticFile(src)}
          style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: beat % 2 ? "48% 46%" : "52% 48%"}}
        />
      )}
    </VisualSurface>
  );

  if (!secondaryImage) return primary;

  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={half}>{primary}</Sequence>
      <Sequence from={half} durationInFrames={Math.max(1, durationInFrames - half)}>
        <VisualSurface durationInFrames={Math.max(1, durationInFrames - half)} beat={beat + 1}>
          <Img src={staticFile(secondaryImage)} style={{width: "100%", height: "100%", objectFit: "cover"}} />
        </VisualSurface>
      </Sequence>
    </AbsoluteFill>
  );
};

const MomentMarker: React.FC<{beat: number; kind: string}> = ({beat, kind}) => (
  <span data-beat={beat} data-kind={kind} style={{display: "none"}} />
);

const MicroLowerThird: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{clipPath: "inset(54% 42% 0 0 round 0 28px 0 0)", pointerEvents: "none"}}>
    {children}
  </AbsoluteFill>
);

const DensityManifestVxnee2w76sqi: React.FC = () => (
  <div style={{display: "none"}}>
        <span data-density-asset="img/vxnee2w76sqi_i001_amber_bottle_sink.png" />
        <span data-density-asset="img/vxnee2w76sqi_i002_elena_1017_night.png" />
        <span data-density-asset="img/vxnee2w76sqi_i003_phone_rosemary_promise.png" />
        <span data-density-asset="img/vxnee2w76sqi_i004_eleven_year_cheek_spot.png" />
        <span data-density-asset="img/vxnee2w76sqi_i005_rosemary_wrinkles_spots_theme.png" />
        <span data-density-asset="img/vxnee2w76sqi_i007_rosemary_science_molecules.png" />
        <span data-density-asset="img/vxnee2w76sqi_i008_three_forms_rosemary.png" />
        <span data-density-asset="img/vxnee2w76sqi_i009_osaka_dermatology_research.png" />
        <span data-density-asset="img/vxnee2w76sqi_i010_young_woman_contact_dermatitis.png" />
        <span data-density-asset="img/vxnee2w76sqi_i011_urgent_medical_attention.png" />
        <span data-density-asset="img/vxnee2w76sqi_i012_expensive_antiaging_creams.png" />
        <span data-density-asset="img/vxnee2w76sqi_i014_twelve_week_photo_calendar.png" />
        <span data-density-asset="img/vxnee2w76sqi_i015_envelope_key_photo.png" />
        <span data-density-asset="img/vxnee2w76sqi_i017_fake_before_after_phone.png" />
        <span data-density-asset="img/vxnee2w76sqi_i018_elena_drawer_envelope.png" />
        <span data-density-asset="img/vxnee2w76sqi_i019_birthday_photos_circle.png" />
        <span data-density-asset="img/vxnee2w76sqi_i020_elena_mirror_shame.png" />
        <span data-density-asset="img/vxnee2w76sqi_i021_four_drops_cotton.png" />
        <span data-density-asset="img/vxnee2w76sqi_i022_cheek_heat_redness.png" />
        <span data-density-asset="img/vxnee2w76sqi_i023_phone_false_promise.png" />
        <span data-density-asset="img/vxnee2w76sqi_i024_morning_red_border.png" />
        <span data-density-asset="img/vxnee2w76sqi_i025_covering_with_makeup.png" />
        <span data-density-asset="img/vxnee2w76sqi_i026_bottle_beside_breakfast.png" />
        <span data-density-asset="img/vxnee2w76sqi_i027_daughter_questions_bottle.png" />
        <span data-density-asset="img/vxnee2w76sqi_i028_rosemary_sprig_water_glass.png" />
        <span data-density-asset="img/vxnee2w76sqi_i029_homemade_rosemary_tonic.png" />
        <span data-density-asset="img/vxnee2w76sqi_i030_read_label_recap.png" />
        <span data-density-asset="img/vxnee2w76sqi_i031_three_products_table.png" />
        <span data-density-asset="img/vxnee2w76sqi_i032_tonic_contamination_microscope.png" />
        <span data-density-asset="img/vxnee2w76sqi_i033_aromatic_molecules_irritate.png" />
        <span data-density-asset="img/vxnee2w76sqi_i034_fair_purchase.png" />
        <span data-density-asset="img/vxnee2w76sqi_i036_grandson_watches_phone.png" />
        <span data-density-asset="img/vxnee2w76sqi_i038_manipulation_machine.png" />
        <span data-density-asset="img/vxnee2w76sqi_i039_patch_test_recap.png" />
        <span data-density-asset="img/vxnee2w76sqi_i040_honest_tradition_choice.png" />
        <span data-density-asset="img/vxnee2w76sqi_i041_photo_by_window.png" />
        <span data-density-asset="img/vxnee2w76sqi_i043_osaka_case_file.png" />
        <span data-density-asset="img/vxnee2w76sqi_i044_positive_patch_test.png" />
        <span data-density-asset="img/vxnee2w76sqi_i045_delayed_allergy_exposure.png" />
        <span data-density-asset="img/vxnee2w76sqi_i046_inflamed_skin_barrier.png" />
        <span data-density-asset="img/vxnee2w76sqi_i048_all_skin_tones_pigment.png" />
        <span data-density-asset="img/vxnee2w76sqi_i050_pain_not_efficacy.png" />
        <span data-density-asset="img/vxnee2w76sqi_i052_formulated_sealed_product.png" />
        <span data-density-asset="img/vxnee2w76sqi_i054_forearm_patch_application.png" />
        <span data-density-asset="img/vxnee2w76sqi_i055_four_day_patch_calendar.png" />
        <span data-density-asset="img/vxnee2w76sqi_i056_allergy_warning_symptoms.png" />
        <span data-density-asset="img/vxnee2w76sqi_i058_sunscreen_recap.png" />
        <span data-density-asset="img/vxnee2w76sqi_i059_elena_checks_forearm.png" />
        <span data-density-asset="img/vxnee2w76sqi_i060_hot_water_sponge_error.png" />
        <span data-density-asset="img/vxnee2w76sqi_i061_exfoliant_overload.png" />
        <span data-density-asset="img/vxnee2w76sqi_i062_too_many_steps_shelf.png" />
        <span data-density-asset="img/vxnee2w76sqi_i063_single_moisturizer_table.png" />
        <span data-density-asset="img/vxnee2w76sqi_i064_gentle_cleansing.png" />
        <span data-density-asset="img/vxnee2w76sqi_i065_pea_sized_moisturizer.png" />
        <span data-density-asset="img/vxnee2w76sqi_i066_elena_sleeping_calm.png" />
        <span data-density-asset="img/vxnee2w76sqi_i067_opening_drawer_photo.png" />
        <span data-density-asset="img/vxnee2w76sqi_i068_fine_lines_less_visible.png" />
        <span data-density-asset="img/vxnee2w76sqi_i069_water_trapped_skin_barrier.png" />
        <span data-density-asset="img/vxnee2w76sqi_i071_standardized_photo_recap.png" />
        <span data-density-asset="img/vxnee2w76sqi_i072_family_dinner_sunday.png" />
        <span data-density-asset="img/vxnee2w76sqi_i073_sister_notices_skin.png" />
        <span data-density-asset="img/vxnee2w76sqi_i074_family_silent_after_truth.png" />
        <span data-density-asset="img/vxnee2w76sqi_i075_ageism_beauty_marketing.png" />
        <span data-density-asset="img/vxnee2w76sqi_i076_balcony_without_sunscreen.png" />
        <span data-density-asset="img/vxnee2w76sqi_i077_doorway_sunscreen_decision.png" />
        <span data-density-asset="img/vxnee2w76sqi_i078_tinted_sunscreen_iron_oxides.png" />
        <span data-density-asset="img/vxnee2w76sqi_i079_bathtub_faucet_metaphor.png" />
        <span data-density-asset="img/vxnee2w76sqi_i080_sunscreen_beside_keys.png" />
        <span data-density-asset="img/vxnee2w76sqi_i081_printing_second_photo.png" />
        <span data-density-asset="img/vxnee2w76sqi_i082_compare_same_light_photos.png" />
        <span data-density-asset="img/vxnee2w76sqi_i083_elena_disappointed_photos.png" />
        <span data-density-asset="img/vxnee2w76sqi_i084_suspicious_spot_recap.png" />
        <span data-density-asset="img/vxnee2w76sqi_i085_study_ninety_women.png" />
        <span data-density-asset="img/vxnee2w76sqi_i086_rosemary_grapefruit_capsule.png" />
        <span data-density-asset="img/vxnee2w76sqi_i087_uv_wrinkle_elasticity_lab.png" />
        <span data-density-asset="img/vxnee2w76sqi_i088_dose_comparison_capsules.png" />
        <span data-density-asset="img/vxnee2w76sqi_i089_misleading_science_ad.png" />
        <span data-density-asset="img/vxnee2w76sqi_i090_downloadable_safety_sheet.png" />
        <span data-density-asset="img/vxnee2w76sqi_i091_randomized_placebo_trial.png" />
        <span data-density-asset="img/vxnee2w76sqi_i092_study_104_women.png" />
        <span data-density-asset="img/vxnee2w76sqi_i093_twelve_week_placebo.png" />
        <span data-density-asset="img/vxnee2w76sqi_i094_no_pigment_difference.png" />
        <span data-density-asset="img/vxnee2w76sqi_i095_corporate_study_link.png" />
        <span data-density-asset="img/vxnee2w76sqi_i097_antioxidant_rosemary.png" />
        <span data-density-asset="img/vxnee2w76sqi_i098_rosmarinic_carnosic_molecules.png" />
        <span data-density-asset="img/vxnee2w76sqi_i099_cells_oxidation_inflammation.png" />
        <span data-density-asset="img/vxnee2w76sqi_i100_cell_dish_not_cheek.png" />
        <span data-density-asset="img/vxnee2w76sqi_i101_tolerated_night_ritual.png" />
        <span data-density-asset="img/vxnee2w76sqi_i102_comment_recipe_source.png" />
        <span data-density-asset="img/vxnee2w76sqi_i103_retinoid_acid_rosemary_separate.png" />
        <span data-density-asset="img/vxnee2w76sqi_i104_pregnancy_rosacea_eczema_warning.png" />
        <span data-density-asset="img/vxnee2w76sqi_i105_accumulated_irritation.png" />
        <span data-density-asset="img/vxnee2w76sqi_i106_dangerous_kitchen_mixture.png" />
        <span data-density-asset="img/vxnee2w76sqi_i107_lemon_uv_phototoxicity.png" />
        <span data-density-asset="img/vxnee2w76sqi_i108_phototoxic_blisters.png" />
        <span data-density-asset="img/vxnee2w76sqi_i109_bicarbonate_ph_barrier.png" />
        <span data-density-asset="img/vxnee2w76sqi_i110_sugar_microabrasions.png" />
        <span data-density-asset="img/vxnee2w76sqi_i111_four_aggressions_storm.png" />
        <span data-density-asset="img/vxnee2w76sqi_i112_elena_inspects_spot_light.png" />
        <span data-density-asset="img/vxnee2w76sqi_i113_types_of_dark_spots.png" />
        <span data-density-asset="img/vxnee2w76sqi_i114_dermatologist_exam.png" />
        <span data-density-asset="img/vxnee2w76sqi_i115_elena_consultation_relief.png" />
        <span data-density-asset="img/vxnee2w76sqi_i116_four_week_photos_row.png" />
        <span data-density-asset="img/vxnee2w76sqi_i117_makeup_no_longer_cracks.png" />
        <span data-density-asset="img/vxnee2w76sqi_i118_money_saved_receipts.png" />
        <span data-density-asset="img/vxnee2w76sqi_i119_confident_by_window.png" />
        <span data-density-asset="img/vxnee2w76sqi_i120_months_not_hours.png" />
        <span data-density-asset="img/vxnee2w76sqi_i121_mirror_anxiety_close.png" />
        <span data-density-asset="img/vxnee2w76sqi_i122_blank_progress_template.png" />
        <span data-density-asset="img/vxnee2w76sqi_i123_final_family_gathering.png" />
        <span data-density-asset="img/vxnee2w76sqi_i124_three_products_final_table.png" />
        <span data-density-asset="img/vxnee2w76sqi_i125_envelope_full_of_receipts.png" />
        <span data-density-asset="img/vxnee2w76sqi_i126_night_irritation_day_radiation.png" />
        <span data-density-asset="img/vxnee2w76sqi_i127_rinse_and_protect_safety.png" />
        <span data-density-asset="img/vxnee2w76sqi_i128_three_kitchen_dangers_teaser.png" />
        <span data-density-asset="img/vxnee2w76sqi_i129_elena_closes_envelope.png" />
        <span data-density-asset="img/vxnee2w76sqi_i130_final_window_portrait.png" />
        <span data-density-asset="broll/vxnee2w76sqi_d000.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d001.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d002.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d003.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d004.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d006.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d007.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d008.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d009.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d011.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d012.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d013.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d014.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d015.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d016.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d017.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d018.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d019.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d020.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d021.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d022.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d024.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d025.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d026.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d027.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d028.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d029.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d030.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d031.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d032.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d033.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d036.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d037.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d038.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d042.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d043.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d044.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d045.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d046.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d048.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d050.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d052.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d053.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d054.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d055.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d056.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d057.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d058.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d059.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d060.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d061.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d062.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d063.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d066.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d067.mp4" />
        <span data-density-asset="broll/vxnee2w76sqi_d069.mp4" />
  </div>
);

export const MainVxnee2w76sqi: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: "#061013"}}>
      <DensityManifestVxnee2w76sqi />
      <StoryFallbackBedVxnee2w76sqi />
      <Sequence from={0} durationInFrames={124} premountFor={15}><MomentMarker beat={1} kind="avatar" /></Sequence>
      <Sequence from={124} durationInFrames={130} premountFor={15}><MediaBeat durationInFrames={130} beat={2} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i001_amber_bottle_sink.png" /></Sequence>
      <Sequence from={254} durationInFrames={224} premountFor={15}><MediaBeat durationInFrames={224} beat={3} kind="video" src="broll/vxnee2w76sqi/d000.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i002_elena_1017_night.png" /></Sequence>
      <Sequence from={478} durationInFrames={91} premountFor={15}><MediaBeat durationInFrames={91} beat={4} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i003_phone_rosemary_promise.png" /></Sequence>
      <Sequence from={569} durationInFrames={153} premountFor={15}><MomentMarker beat={5} kind="avatar" /></Sequence>
      <Sequence from={722} durationInFrames={100} premountFor={15}><MomentMarker beat={6} kind="avatar" /></Sequence>
      <Sequence from={822} durationInFrames={112} premountFor={15}><MomentMarker beat={7} kind="avatar" /></Sequence>
      <Sequence from={934} durationInFrames={90} premountFor={15}><MediaBeat durationInFrames={90} beat={8} kind="video" src="broll/vxnee2w76sqi/d001.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i004_eleven_year_cheek_spot.png" /></Sequence>
      <Sequence from={1024} durationInFrames={159} premountFor={15}><FedHero kicker="EL FRASCO ÁMBAR" title="Pero una hoja, un extracto cosmético y un aceite…" hot={["aceite"]} sub="Pero una hoja, un extracto cosmético y un aceite esencial no son la misma…" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i005_rosemary_wrinkles_spots_theme.png")} accent="#C9A45E" mood="warmdark" side="left" framed /></Sequence>
      <Sequence from={1183} durationInFrames={179} premountFor={15}><MomentMarker beat={10} kind="avatar" /></Sequence>
      <Sequence from={1362} durationInFrames={168} premountFor={15}><FedQuote kicker="EL FRASCO ÁMBAR" quote="Hay una prueba difícil de ignorar" author="Evidencia y prudencia" role="Principio editorial" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i007_rosemary_science_molecules.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={1530} durationInFrames={219} premountFor={15}><MediaBeat durationInFrames={219} beat={12} kind="video" src="broll/vxnee2w76sqi/d002.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i008_three_forms_rosemary.png" /></Sequence>
      <Sequence from={1749} durationInFrames={89} premountFor={15}><FedStat kicker="EL FRASCO ÁMBAR" value={1} prefix="" suffix="%" label="Su piel reaccionó al gel diluido al 1%" sub="Su piel reaccionó al gel diluido al 1%." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i009_osaka_dermatology_research.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={1838} durationInFrames={96} premountFor={15}><FedStat kicker="EL FRASCO ÁMBAR" value={0.1} prefix="" suffix="%" label="También al extracto de romero al 0,1%" sub="También al extracto de romero al 0,1%." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i010_young_woman_contact_dermatitis.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={1934} durationInFrames={129} premountFor={15}><MomentMarker beat={15} kind="avatar" /></Sequence>
      <Sequence from={2063} durationInFrames={174} premountFor={15}><MediaBeat durationInFrames={174} beat={16} kind="video" src="broll/vxnee2w76sqi/d003.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i012_expensive_antiaging_creams.png" /></Sequence>
      <Sequence from={2237} durationInFrames={159} premountFor={15}><MediaBeat durationInFrames={159} beat={17} kind="video" src="broll/vxnee2w76sqi/d004.mp4" /></Sequence>
      <Sequence from={2396} durationInFrames={85} premountFor={15}><MomentMarker beat={18} kind="avatar" /></Sequence>
      <Sequence from={2481} durationInFrames={219} premountFor={15}><FedHero kicker="LA PROMESA VIRAL" title="Voy a mostrarle la diferencia exacta entre la rama,…" hot={["entre"]} sub="Voy a mostrarle la diferencia exacta entre la rama, el tónico casero, el…" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i009_osaka_dermatology_research.png")} accent="#C9A45E" mood="warmdark" side="left" framed /></Sequence>
      <Sequence from={2700} durationInFrames={155} premountFor={15}><FedStep step={6} total={7} title="Vamos a seguir durante 12 semanas qué ocurrió con…" hot={["ocurrió"]} sub="Vamos a seguir durante 12 semanas qué ocurrió con la textura de Elena, qué…" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i014_twelve_week_photo_calendar.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={2855} durationInFrames={185} premountFor={15}><FedHero kicker="LA FOTO CLAVE" title="La imagen más importante no fue la que esperaba" hot={["importante"]} sub="El sobre guardaba la pista que cambió la historia de Elena." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i015_envelope_key_photo.png")} accent="#C9A45E" mood="warmdark" side="left" framed /></Sequence>
      <Sequence from={3040} durationInFrames={124} premountFor={15}><MomentMarker beat={22} kind="avatar" /></Sequence>
      <Sequence from={3164} durationInFrames={225} premountFor={15}><FedStep step={2} total={7} title="Tendrá la rutina de mañana y noche, las cantidades…" hot={["cantidades"]} sub="Tendrá la rutina de mañana y noche, las cantidades orientativas, el…" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i018_elena_drawer_envelope.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={3389} durationInFrames={222} premountFor={15}><MomentMarker beat={24} kind="avatar" /></Sequence>
      <Sequence from={3611} durationInFrames={152} premountFor={15}><MediaBeat durationInFrames={152} beat={25} kind="video" src="broll/vxnee2w76sqi/d006.mp4" /></Sequence>
      <Sequence from={3763} durationInFrames={161} premountFor={15}><FedBeforeAfter kicker="LA PROMESA VIRAL" title="A la izquierda, una cara cansada" hot={["cansada"]} imageA={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i017_fake_before_after_phone.png")} imageB={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i018_elena_drawer_envelope.png")} labelA="Promesa" labelB="Evidencia" accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={3924} durationInFrames={79} premountFor={15}><MediaBeat durationInFrames={79} beat={27} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i019_birthday_photos_circle.png" /></Sequence>
      <Sequence from={4003} durationInFrames={121} premountFor={15}><FedBeforeAfter kicker="LA PROMESA VIRAL" title="Los médicos conocen este secreto, pero no quieren…" hot={["quieren"]} imageA={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i020_elena_mirror_shame.png")} imageB={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i017_fake_before_after_phone.png")} labelA="Promesa" labelB="Evidencia" accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={4124} durationInFrames={143} premountFor={15}><MediaBeat durationInFrames={143} beat={29} kind="video" src="broll/vxnee2w76sqi/d007.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i018_elena_drawer_envelope.png" /></Sequence>
      <Sequence from={4267} durationInFrames={94} premountFor={15}><MediaBeat durationInFrames={94} beat={30} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i019_birthday_photos_circle.png" /></Sequence>
      <Sequence from={4361} durationInFrames={114} premountFor={15}><FedHero kicker="LA PROMESA VIRAL" title="En cada una había marcado la misma mancha con un…" hot={["mancha"]} sub="En cada una había marcado la misma mancha con un círculo de lápiz." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i019_birthday_photos_circle.png")} accent="#C9A45E" mood="warmdark" side="left" framed /></Sequence>
      <Sequence from={4475} durationInFrames={185} premountFor={15}><MediaBeat durationInFrames={185} beat={32} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i020_elena_mirror_shame.png" /></Sequence>
      <Sequence from={4660} durationInFrames={81} premountFor={15}><MediaBeat durationInFrames={81} beat={33} kind="video" src="broll/vxnee2w76sqi/d008.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i021_four_drops_cotton.png" /></Sequence>
      <Sequence from={4741} durationInFrames={147} premountFor={15}><MediaBeat durationInFrames={147} beat={34} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i022_cheek_heat_redness.png" /></Sequence>
      <Sequence from={4888} durationInFrames={112} premountFor={15}><FedQuote kicker="LA PROMESA VIRAL" quote="recordó otra frase del video" author="Evidencia y prudencia" role="Principio editorial" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i023_phone_false_promise.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={5000} durationInFrames={100} premountFor={15}><MomentMarker beat={36} kind="avatar" /></Sequence>
      <Sequence from={5100} durationInFrames={172} premountFor={15}><MomentMarker beat={37} kind="avatar" /></Sequence>
      <Sequence from={5272} durationInFrames={87} premountFor={15}><MediaBeat durationInFrames={87} beat={38} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i022_cheek_heat_redness.png" /></Sequence>
      <Sequence from={5359} durationInFrames={149} premountFor={15}><MomentMarker beat={39} kind="avatar" /></Sequence>
      <Sequence from={5508} durationInFrames={136} premountFor={15}><MediaBeat durationInFrames={136} beat={40} kind="video" src="broll/vxnee2w76sqi/d009.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i024_morning_red_border.png" /></Sequence>
      <Sequence from={5644} durationInFrames={84} premountFor={15}><MediaBeat durationInFrames={84} beat={41} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i025_covering_with_makeup.png" /></Sequence>
      <Sequence from={5728} durationInFrames={70} premountFor={15}><MediaBeat durationInFrames={70} beat={42} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i026_bottle_beside_breakfast.png" /></Sequence>
      <Sequence from={5798} durationInFrames={108} premountFor={15}><MomentMarker beat={43} kind="avatar" /></Sequence>
      <Sequence from={5906} durationInFrames={128} premountFor={15}><MomentMarker beat={44} kind="avatar" /></Sequence>
      <Sequence from={6034} durationInFrames={99} premountFor={15}><MediaBeat durationInFrames={99} beat={45} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i026_bottle_beside_breakfast.png" /></Sequence>
      <Sequence from={6133} durationInFrames={81} premountFor={15}><MediaBeat durationInFrames={81} beat={46} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i026_bottle_beside_breakfast.png" /></Sequence>
      <Sequence from={6214} durationInFrames={88} premountFor={15}><MediaBeat durationInFrames={88} beat={47} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i027_daughter_questions_bottle.png" /></Sequence>
      <Sequence from={6302} durationInFrames={120} premountFor={15}><MomentMarker beat={48} kind="avatar" /></Sequence>
      <Sequence from={6422} durationInFrames={99} premountFor={15}><MediaBeat durationInFrames={99} beat={49} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i028_rosemary_sprig_water_glass.png" /></Sequence>
      <Sequence from={6521} durationInFrames={84} premountFor={15}><MediaBeat durationInFrames={84} beat={50} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i029_homemade_rosemary_tonic.png" /></Sequence>
      <Sequence from={6605} durationInFrames={114} premountFor={15}><MediaBeat durationInFrames={114} beat={51} kind="video" src="broll/vxnee2w76sqi/d011.mp4" /></Sequence>
      <Sequence from={6719} durationInFrames={112} premountFor={15}><FedHero kicker="TRES FORMAS DISTINTAS" title="Los tres olían parecido" hot={["parecido"]} sub="Los tres se llamaban romero" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i028_rosemary_sprig_water_glass.png")} accent="#C9A45E" mood="warmdark" side="right" framed /></Sequence>
      <Sequence from={6831} durationInFrames={94} premountFor={15}><MomentMarker beat={53} kind="avatar" /></Sequence>
      <Sequence from={6925} durationInFrames={127} premountFor={15}><FedMolecule kicker="TRES FORMAS DISTINTAS" title="La rama libera una mezcla variable de sustancias…" hot={["sustancias"]} sub="La rama libera una mezcla variable de sustancias cuando se coloca en agua." centerLabel="PIEL" nodes={[{"label":"Barrera"},{"label":"Irritación"},{"label":"Respuesta"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i031_three_products_table.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={7052} durationInFrames={159} premountFor={15}><FedMolecule kicker="TRES FORMAS DISTINTAS" title="La concentración depende de la planta, de la…" hot={["planta"]} sub="La concentración depende de la planta, de la cantidad, de la temperatura y…" centerLabel="PIEL" nodes={[{"label":"Barrera"},{"label":"Irritación"},{"label":"Respuesta"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i032_tonic_contamination_microscope.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={7211} durationInFrames={146} premountFor={15}><FedStat kicker="TRES FORMAS DISTINTAS" value={3} prefix="" suffix="" label="El tónico casero añade otro problema" sub="No tiene un sistema de conservación validado" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i032_tonic_contamination_microscope.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={7357} durationInFrames={73} premountFor={15}><MediaBeat durationInFrames={73} beat={57} kind="video" src="broll/vxnee2w76sqi/d012.mp4" /></Sequence>
      <Sequence from={7430} durationInFrames={84} premountFor={15}><MediaBeat durationInFrames={84} beat={58} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i031_three_products_table.png" /></Sequence>
      <Sequence from={7514} durationInFrames={134} premountFor={15}><MediaBeat durationInFrames={134} beat={59} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i029_homemade_rosemary_tonic.png" /></Sequence>
      <Sequence from={7648} durationInFrames={151} premountFor={15}><FedMolecule kicker="TRES FORMAS DISTINTAS" title="Está concentrado" hot={["concentrado"]} sub="Contiene moléculas aromáticas capaces de irritar o sensibilizar" centerLabel="PIEL" nodes={[{"label":"Barrera"},{"label":"Irritación"},{"label":"Respuesta"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i033_aromatic_molecules_irritate.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={7799} durationInFrames={93} premountFor={15}><FedBeforeAfter kicker="TRES FORMAS DISTINTAS" title="No es una infusión más fuerte" hot={["fuerte"]} imageA={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i034_fair_purchase.png")} imageB={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i034_fair_purchase.png")} labelA="Promesa" labelB="Evidencia" accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={7892} durationInFrames={73} premountFor={15}><MomentMarker beat={62} kind="avatar" /></Sequence>
      <Sequence from={7965} durationInFrames={79} premountFor={15}><MediaBeat durationInFrames={79} beat={63} kind="video" src="broll/vxnee2w76sqi/d013.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i034_fair_purchase.png" /></Sequence>
      <Sequence from={8044} durationInFrames={123} premountFor={15}><MediaBeat durationInFrames={123} beat={64} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i038_manipulation_machine.png" /></Sequence>
      <Sequence from={8167} durationInFrames={124} premountFor={15}><MediaBeat durationInFrames={124} beat={65} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i034_fair_purchase.png" /></Sequence>
      <Sequence from={8291} durationInFrames={118} premountFor={15}><FedQuote kicker="TRES FORMAS DISTINTAS" quote="Romero puro" author="Evidencia y prudencia" role="Principio editorial" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i034_fair_purchase.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={8409} durationInFrames={121} premountFor={15}><MediaBeat durationInFrames={121} beat={67} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i038_manipulation_machine.png" /></Sequence>
      <Sequence from={8530} durationInFrames={82} premountFor={15}><MediaBeat durationInFrames={82} beat={68} kind="video" src="broll/vxnee2w76sqi/d014.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i036_grandson_watches_phone.png" /></Sequence>
      <Sequence from={8612} durationInFrames={88} premountFor={15}><MediaBeat durationInFrames={88} beat={69} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i041_photo_by_window.png" /></Sequence>
      <Sequence from={8700} durationInFrames={159} premountFor={15}><MomentMarker beat={70} kind="avatar" /></Sequence>
      <Sequence from={8859} durationInFrames={153} premountFor={15}><MediaBeat durationInFrames={153} beat={71} kind="video" src="broll/vxnee2w76sqi/d015.mp4" /></Sequence>
      <Sequence from={9012} durationInFrames={154} premountFor={15}><FedMolecule kicker="TRES FORMAS DISTINTAS" title="No del mecanismo que la manipuló" hot={["manipuló"]} sub="Pero esos anuncios están diseñados con precisión" centerLabel="PIEL" nodes={[{"label":"Barrera"},{"label":"Irritación"},{"label":"Respuesta"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i041_photo_by_window.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={9166} durationInFrames={106} premountFor={15}><MediaBeat durationInFrames={106} beat={73} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i038_manipulation_machine.png" /></Sequence>
      <Sequence from={9272} durationInFrames={87} premountFor={15}><MediaBeat durationInFrames={87} beat={74} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i034_fair_purchase.png" /></Sequence>
      <Sequence from={9359} durationInFrames={99} premountFor={15}><FedHero kicker="TRES FORMAS DISTINTAS" title="Y colocan un reloj imaginario sobre el miedo a…" hot={["miedo"]} sub="Y colocan un reloj imaginario sobre el miedo a envejecer." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i038_manipulation_machine.png")} accent="#C9A45E" mood="warmdark" side="left" framed /></Sequence>
      <Sequence from={9458} durationInFrames={101} premountFor={15}><MomentMarker beat={76} kind="avatar" /></Sequence>
      <Sequence from={9559} durationInFrames={90} premountFor={15}><MomentMarker beat={77} kind="avatar" /></Sequence>
      <Sequence from={9649} durationInFrames={150} premountFor={15}><MomentMarker beat={78} kind="avatar" /></Sequence>
      <Sequence from={9799} durationInFrames={97} premountFor={15}><MediaBeat durationInFrames={97} beat={79} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i036_grandson_watches_phone.png" /></Sequence>
      <Sequence from={9896} durationInFrames={75} premountFor={15}><MediaBeat durationInFrames={75} beat={80} kind="video" src="broll/vxnee2w76sqi/d016.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i041_photo_by_window.png" /></Sequence>
      <Sequence from={9971} durationInFrames={108} premountFor={15}><FedHero kicker="TRES FORMAS DISTINTAS" title="La imprimió" hot={["imprimió"]} sub="Escribió la fecha detrás" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i043_osaka_case_file.png")} accent="#C9A45E" mood="warmdark" side="left" framed /></Sequence>
      <Sequence from={10079} durationInFrames={224} premountFor={15}><FedStep step={5} total={7} title="Esa foto iba a apagar el primer loop" hot={["primer"]} sub="En 2005, dermatólogos de la Universidad de Osaka publicaron un caso que ayuda…" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i044_positive_patch_test.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={10303} durationInFrames={216} premountFor={15}><MediaBeat durationInFrames={216} beat={83} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i043_osaka_case_file.png" /></Sequence>
      <Sequence from={10519} durationInFrames={111} premountFor={15}><MediaBeat durationInFrames={111} beat={84} kind="video" src="broll/vxnee2w76sqi/d017.mp4" /></Sequence>
      <Sequence from={10630} durationInFrames={120} premountFor={15}><FedStat kicker="EVIDENCIA CLÍNICA" value={1} prefix="" suffix="%" label="Las pruebas de parche fueron positivas al gel…" sub="Las pruebas de parche fueron positivas al gel diluido al 1%." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i044_positive_patch_test.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={10750} durationInFrames={99} premountFor={15}><FedStat kicker="EVIDENCIA CLÍNICA" value={0.1} prefix="" suffix="%" label="También al extracto de romero al 0,1%" sub="También al extracto de romero al 0,1%." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i043_osaka_case_file.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={10849} durationInFrames={96} premountFor={15}><FedBeforeAfter kicker="EVIDENCIA CLÍNICA" title="No era aceite esencial puro" hot={["esencial"]} imageA={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i043_osaka_case_file.png")} imageB={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i045_delayed_allergy_exposure.png")} labelA="Promesa" labelB="Evidencia" accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={10945} durationInFrames={74} premountFor={15}><MediaBeat durationInFrames={74} beat={88} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i046_inflamed_skin_barrier.png" /></Sequence>
      <Sequence from={11019} durationInFrames={117} premountFor={15}><MomentMarker beat={89} kind="avatar" /></Sequence>
      <Sequence from={11136} durationInFrames={140} premountFor={15}><MomentMarker beat={90} kind="avatar" /></Sequence>
      <Sequence from={11276} durationInFrames={89} premountFor={15}><MediaBeat durationInFrames={89} beat={91} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i045_delayed_allergy_exposure.png" /></Sequence>
      <Sequence from={11365} durationInFrames={81} premountFor={15}><MediaBeat durationInFrames={81} beat={92} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i024_morning_red_border.png" /></Sequence>
      <Sequence from={11446} durationInFrames={118} premountFor={15}><MediaBeat durationInFrames={118} beat={93} kind="video" src="broll/vxnee2w76sqi/d018.mp4" /></Sequence>
      <Sequence from={11564} durationInFrames={95} premountFor={15}><MomentMarker beat={94} kind="avatar" /></Sequence>
      <Sequence from={11659} durationInFrames={109} premountFor={15}><FedMolecule kicker="EVIDENCIA CLÍNICA" title="Cuando la barrera se inflama, puede producir más…" hot={["producir"]} sub="Cuando la barrera se inflama, puede producir más pigmento después." centerLabel="PIEL" nodes={[{"label":"Inflamación"},{"label":"Pigmento"},{"label":"Luz"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i046_inflamed_skin_barrier.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={11768} durationInFrames={115} premountFor={15}><MediaBeat durationInFrames={115} beat={96} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i024_morning_red_border.png" /></Sequence>
      <Sequence from={11883} durationInFrames={173} premountFor={15}><FedMolecule kicker="EVIDENCIA CLÍNICA" title="Puede ocurrir en cualquier tono de piel" hot={["cualquier"]} sub="Y merece especial cuidado en las pieles que pigmentan con facilidad" centerLabel="PIEL" nodes={[{"label":"Inflamación"},{"label":"Pigmento"},{"label":"Luz"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i048_all_skin_tones_pigment.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={12056} durationInFrames={141} premountFor={15}><MomentMarker beat={98} kind="avatar" /></Sequence>
      <Sequence from={12197} durationInFrames={91} premountFor={15}><MediaBeat durationInFrames={91} beat={99} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i046_inflamed_skin_barrier.png" /></Sequence>
      <Sequence from={12288} durationInFrames={106} premountFor={15}><MomentMarker beat={100} kind="avatar" /></Sequence>
      <Sequence from={12394} durationInFrames={78} premountFor={15}><MomentMarker beat={101} kind="avatar" /></Sequence>
      <Sequence from={12472} durationInFrames={117} premountFor={15}><MediaBeat durationInFrames={117} beat={102} kind="video" src="broll/vxnee2w76sqi/d019.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i050_pain_not_efficacy.png" /></Sequence>
      <Sequence from={12589} durationInFrames={219} premountFor={15}><FedHero kicker="EVIDENCIA CLÍNICA" title="Al día siguiente, entró en una farmacia y encontró…" hot={["encontró"]} sub="Al día siguiente, entró en una farmacia y encontró una crema terminada que…" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i040_honest_tradition_choice.png")} accent="#C9A45E" mood="warmdark" side="left" framed /></Sequence>
      <Sequence from={12808} durationInFrames={217} premountFor={15}><MediaBeat durationInFrames={217} beat={104} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i052_formulated_sealed_product.png" /></Sequence>
      <Sequence from={13025} durationInFrames={135} premountFor={15}><MediaBeat durationInFrames={135} beat={105} kind="video" src="broll/vxnee2w76sqi/d020.mp4" /></Sequence>
      <Sequence from={13160} durationInFrames={146} premountFor={15}><FedBeforeAfter kicker="EVIDENCIA CLÍNICA" title="La promesa era mucho más modesta" hot={["modesta"]} imageA={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i054_forearm_patch_application.png")} imageB={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i054_forearm_patch_application.png")} labelA="Promesa" labelB="Evidencia" accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={13306} durationInFrames={102} premountFor={15}><MediaBeat durationInFrames={102} beat={107} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i055_four_day_patch_calendar.png" /></Sequence>
      <Sequence from={13408} durationInFrames={117} premountFor={15}><MomentMarker beat={108} kind="avatar" /></Sequence>
      <Sequence from={13525} durationInFrames={201} premountFor={15}><MediaBeat durationInFrames={201} beat={109} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i040_honest_tradition_choice.png" /></Sequence>
      <Sequence from={13726} durationInFrames={100} premountFor={15}><FedHero kicker="BARRERA Y TOLERANCIA" title="Colocó una pequeña cantidad en la cara interna del…" hot={["interna"]} sub="Colocó una pequeña cantidad en la cara interna del antebrazo." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i054_forearm_patch_application.png")} accent="#C9A45E" mood="warmdark" side="right" framed /></Sequence>
      <Sequence from={13826} durationInFrames={164} premountFor={15}><MediaBeat durationInFrames={164} beat={111} kind="video" src="broll/vxnee2w76sqi/d021.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i055_four_day_patch_calendar.png" /></Sequence>
      <Sequence from={13990} durationInFrames={218} premountFor={15}><FedStep step={7} total={7} title="La recomendación general es probar el producto dos…" hot={["producto"]} sub="La recomendación general es probar el producto dos veces al día durante…" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i054_forearm_patch_application.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={14208} durationInFrames={155} premountFor={15}><FedStep step={1} total={7} title="zona extensa" hot={["extensa"]} sub="Hay que observar picazón, ardor persistente, hinchazón," image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i056_allergy_warning_symptoms.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={14363} durationInFrames={107} premountFor={15}><MediaBeat durationInFrames={107} beat={114} kind="video" src="broll/vxnee2w76sqi/d022.mp4" /></Sequence>
      <Sequence from={14470} durationInFrames={98} premountFor={15}><MomentMarker beat={115} kind="avatar" /></Sequence>
      <Sequence from={14568} durationInFrames={76} premountFor={15}><MomentMarker beat={116} kind="avatar" /></Sequence>
      <Sequence from={14644} durationInFrames={80} premountFor={15}><MomentMarker beat={117} kind="avatar" /></Sequence>
      <Sequence from={14724} durationInFrames={89} premountFor={15}><MomentMarker beat={118} kind="avatar" /></Sequence>
      <Sequence from={14813} durationInFrames={239} premountFor={15}><FedMolecule kicker="BARRERA Y TOLERANCIA" title="El rostro y el contorno de ojos pueden ser más…" hot={["pueden"]} sub="El rostro y el contorno de ojos pueden ser más sensibles, pero evita…" centerLabel="PIEL" nodes={[{"label":"Barrera"},{"label":"Irritación"},{"label":"Respuesta"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i061_exfoliant_overload.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={15052} durationInFrames={140} premountFor={15}><MediaBeat durationInFrames={140} beat={120} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i059_elena_checks_forearm.png" /></Sequence>
      <Sequence from={15192} durationInFrames={163} premountFor={15}><FedStep step={2} total={2} title="Mañana y noche, por escrito" hot={["escrito"]} sub="Marcar cada aplicación y anotar síntomas evita depender de la memoria." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i059_elena_checks_forearm.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={15355} durationInFrames={79} premountFor={15}><MediaBeat durationInFrames={79} beat={122} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i059_elena_checks_forearm.png" /></Sequence>
      <Sequence from={15434} durationInFrames={85} premountFor={15}><MediaBeat durationInFrames={85} beat={123} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i062_too_many_steps_shelf.png" /></Sequence>
      <Sequence from={15519} durationInFrames={187} premountFor={15}><MomentMarker beat={124} kind="avatar" /></Sequence>
      <Sequence from={15706} durationInFrames={134} premountFor={15}><FedBeforeAfter kicker="BARRERA Y TOLERANCIA" title="Se lavó el rostro con agua muy caliente" hot={["caliente"]} imageA={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i060_hot_water_sponge_error.png")} imageB={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i061_exfoliant_overload.png")} labelA="Promesa" labelB="Evidencia" accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={15840} durationInFrames={169} premountFor={15}><MediaBeat durationInFrames={169} beat={126} kind="video" src="broll/vxnee2w76sqi/d024.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i061_exfoliant_overload.png" /></Sequence>
      <Sequence from={16009} durationInFrames={77} premountFor={15}><MediaBeat durationInFrames={77} beat={127} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i060_hot_water_sponge_error.png" /></Sequence>
      <Sequence from={16086} durationInFrames={86} premountFor={15}><MomentMarker beat={128} kind="avatar" /></Sequence>
      <Sequence from={16172} durationInFrames={158} premountFor={15}><FedStep step={3} total={7} title="La industria le había enseñado que una rutina…" hot={["rutina"]} sub="La industria le había enseñado que una rutina poderosa debía tener muchos…" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i062_too_many_steps_shelf.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={16330} durationInFrames={153} premountFor={15}><MediaBeat durationInFrames={153} beat={130} kind="video" src="broll/vxnee2w76sqi/d025.mp4" /></Sequence>
      <Sequence from={16483} durationInFrames={91} premountFor={15}><MediaBeat durationInFrames={91} beat={131} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i064_gentle_cleansing.png" /></Sequence>
      <Sequence from={16574} durationInFrames={161} premountFor={15}><MediaBeat durationInFrames={161} beat={132} kind="video" src="broll/vxnee2w76sqi/d026.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i063_single_moisturizer_table.png" /></Sequence>
      <Sequence from={16735} durationInFrames={213} premountFor={15}><FedStep step={7} total={7} title="Nada más" hot={["más"]} sub="Usó agua tibia" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i064_gentle_cleansing.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={16948} durationInFrames={155} premountFor={15}><MediaBeat durationInFrames={155} beat={134} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i066_elena_sleeping_calm.png" /></Sequence>
      <Sequence from={17103} durationInFrames={147} premountFor={15}><FedStep step={2} total={7} title="Evitó párpados, labios, heridas y el borde todavía…" hot={["todavía"]} sub="Evitó párpados, labios, heridas y el borde todavía irritado de la mancha." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i065_pea_sized_moisturizer.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={17250} durationInFrames={103} premountFor={15}><MediaBeat durationInFrames={103} beat={136} kind="video" src="broll/vxnee2w76sqi/d027.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i065_pea_sized_moisturizer.png" /></Sequence>
      <Sequence from={17353} durationInFrames={206} premountFor={15}><FedHero kicker="BARRERA Y TOLERANCIA" title="Aproximadamente una o dos arvejas para cubrir el…" hot={["cubrir"]} sub="Aproximadamente una o dos arvejas para cubrir el rostro, ajustando según la…" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i067_opening_drawer_photo.png")} accent="#C9A45E" mood="warmdark" side="left" framed /></Sequence>
      <Sequence from={17559} durationInFrames={89} premountFor={15}><MediaBeat durationInFrames={89} beat={138} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i068_fine_lines_less_visible.png" /></Sequence>
      <Sequence from={17648} durationInFrames={80} premountFor={15}><MomentMarker beat={139} kind="avatar" /></Sequence>
      <Sequence from={17728} durationInFrames={97} premountFor={15}><MediaBeat durationInFrames={97} beat={140} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i066_elena_sleeping_calm.png" /></Sequence>
      <Sequence from={17825} durationInFrames={108} premountFor={15}><MediaBeat durationInFrames={108} beat={141} kind="video" src="broll/vxnee2w76sqi/d028.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i067_opening_drawer_photo.png" /></Sequence>
      <Sequence from={17933} durationInFrames={164} premountFor={15}><MediaBeat durationInFrames={164} beat={142} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i068_fine_lines_less_visible.png" /></Sequence>
      <Sequence from={18097} durationInFrames={97} premountFor={15}><MomentMarker beat={143} kind="avatar" /></Sequence>
      <Sequence from={18194} durationInFrames={107} premountFor={15}><FedStat kicker="BARRERA Y TOLERANCIA" value={72} prefix="" suffix="" label="El romero no había reconstruido el colágeno en 72…" sub="El romero no había reconstruido el colágeno en 72 horas." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i130_final_window_portrait.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={18301} durationInFrames={126} premountFor={15}><FedMolecule kicker="BARRERA Y TOLERANCIA" title="La hidratante había atrapado agua en las capas…" hot={["capas"]} sub="La hidratante había atrapado agua en las capas superficiales." centerLabel="PIEL" nodes={[{"label":"Barrera"},{"label":"Irritación"},{"label":"Respuesta"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i069_water_trapped_skin_barrier.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={18427} durationInFrames={172} premountFor={15}><FedBeforeAfter kicker="BARRERA Y TOLERANCIA" title="La piel estaba más flexible" hot={["flexible"]} imageA={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i130_final_window_portrait.png")} imageB={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i073_sister_notices_skin.png")} labelA="Promesa" labelB="Evidencia" accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={18599} durationInFrames={153} premountFor={15}><MediaBeat durationInFrames={153} beat={147} kind="video" src="broll/vxnee2w76sqi/d029.mp4" /></Sequence>
      <Sequence from={18752} durationInFrames={105} premountFor={15}><MomentMarker beat={148} kind="avatar" /></Sequence>
      <Sequence from={18857} durationInFrames={147} premountFor={15}><FedMolecule kicker="BARRERA Y TOLERANCIA" title="Una arruga profunda involucra cambios en colágeno,…" hot={["colágeno"]} sub="Una arruga profunda involucra cambios en colágeno, elastina, grasa," centerLabel="PIEL" nodes={[{"label":"Barrera"},{"label":"Irritación"},{"label":"Respuesta"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i130_final_window_portrait.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={19004} durationInFrames={208} premountFor={15}><FedMolecule kicker="BARRERA Y TOLERANCIA" title="músculo y soporte óseo" hot={["soporte"]} sub="Ninguna rama, crema o aceite reconstruye todo eso durante una noche" centerLabel="PIEL" nodes={[{"label":"Barrera"},{"label":"Irritación"},{"label":"Respuesta"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i130_final_window_portrait.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={19212} durationInFrames={184} premountFor={15}><MomentMarker beat={151} kind="avatar" /></Sequence>
      <Sequence from={19396} durationInFrames={220} premountFor={15}><FedBeforeAfter kicker="BARRERA Y TOLERANCIA" title="Y ese fue el primer giro" hot={["primer"]} imageA={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i130_final_window_portrait.png")} imageB={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i073_sister_notices_skin.png")} labelA="Promesa" labelB="Evidencia" accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={19616} durationInFrames={171} premountFor={15}><MediaBeat durationInFrames={171} beat={153} kind="video" src="broll/vxnee2w76sqi/d030.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i072_family_dinner_sunday.png" /></Sequence>
      <Sequence from={19787} durationInFrames={109} premountFor={15}><MediaBeat durationInFrames={109} beat={154} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i130_final_window_portrait.png" /></Sequence>
      <Sequence from={19896} durationInFrames={95} premountFor={15}><MediaBeat durationInFrames={95} beat={155} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i073_sister_notices_skin.png" /></Sequence>
      <Sequence from={19991} durationInFrames={110} premountFor={15}><MediaBeat durationInFrames={110} beat={156} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i072_family_dinner_sunday.png" /></Sequence>
      <Sequence from={20101} durationInFrames={93} premountFor={15}><MediaBeat durationInFrames={93} beat={157} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i072_family_dinner_sunday.png" /></Sequence>
      <Sequence from={20194} durationInFrames={85} premountFor={15}><MediaBeat durationInFrames={85} beat={158} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i072_family_dinner_sunday.png" /></Sequence>
      <Sequence from={20279} durationInFrames={101} premountFor={15}><MediaBeat durationInFrames={101} beat={159} kind="video" src="broll/vxnee2w76sqi/d031.mp4" /></Sequence>
      <Sequence from={20380} durationInFrames={80} premountFor={15}><MediaBeat durationInFrames={80} beat={160} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i075_ageism_beauty_marketing.png" /></Sequence>
      <Sequence from={20460} durationInFrames={124} premountFor={15}><MediaBeat durationInFrames={124} beat={161} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i074_family_silent_after_truth.png" /></Sequence>
      <Sequence from={20584} durationInFrames={102} premountFor={15}><MomentMarker beat={162} kind="avatar" /></Sequence>
      <Sequence from={20686} durationInFrames={221} premountFor={15}><MomentMarker beat={163} kind="avatar" /></Sequence>
      <Sequence from={20907} durationInFrames={124} premountFor={15}><MomentMarker beat={164} kind="avatar" /></Sequence>
      <Sequence from={21031} durationInFrames={114} premountFor={15}><MomentMarker beat={165} kind="avatar" /></Sequence>
      <Sequence from={21145} durationInFrames={82} premountFor={15}><MediaBeat durationInFrames={82} beat={166} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i075_ageism_beauty_marketing.png" /></Sequence>
      <Sequence from={21227} durationInFrames={114} premountFor={15}><MediaBeat durationInFrames={114} beat={167} kind="video" src="broll/vxnee2w76sqi/d032.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i076_balcony_without_sunscreen.png" /></Sequence>
      <Sequence from={21341} durationInFrames={139} premountFor={15}><FedStat kicker="EL PASO DIURNO" value={15} prefix="" suffix=" DÍAS" label="15 minutos parecían poco" sub="El estímulo se repetía todos los días" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i075_ageism_beauty_marketing.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={21480} durationInFrames={157} premountFor={15}><MomentMarker beat={169} kind="avatar" /></Sequence>
      <Sequence from={21637} durationInFrames={128} premountFor={15}><MediaBeat durationInFrames={128} beat={170} kind="video" src="broll/vxnee2w76sqi/d033.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i077_doorway_sunscreen_decision.png" /></Sequence>
      <Sequence from={21765} durationInFrames={86} premountFor={15}><FedStat kicker="EL PASO DIURNO" value={30} prefix="" suffix="" label="Factor 30 o más" sub="Cantidad generosa" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i078_tinted_sunscreen_iron_oxides.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={21851} durationInFrames={144} premountFor={15}><MediaBeat durationInFrames={144} beat={172} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i079_bathtub_faucet_metaphor.png" /></Sequence>
      <Sequence from={21995} durationInFrames={86} premountFor={15}><MediaBeat durationInFrames={86} beat={173} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i078_tinted_sunscreen_iron_oxides.png" /></Sequence>
      <Sequence from={22081} durationInFrames={179} premountFor={15}><FedMolecule kicker="EL PASO DIURNO" title="Puede aportar protección frente a la luz visible" hot={["visible"]} sub="Esa luz también puede favorecer pigmentación en algunas personas" centerLabel="PIEL" nodes={[{"label":"Inflamación"},{"label":"Pigmento"},{"label":"Luz"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i076_balcony_without_sunscreen.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={22260} durationInFrames={120} premountFor={15}><MomentMarker beat={175} kind="avatar" /></Sequence>
      <Sequence from={22380} durationInFrames={111} premountFor={15}><FedMolecule kicker="EL PASO DIURNO" title="Elena intentaba vaciar una bañera mientras dejaba…" hot={["dejaba"]} sub="Elena intentaba vaciar una bañera mientras dejaba la canilla abierta." centerLabel="PIEL" nodes={[{"label":"Barrera"},{"label":"Irritación"},{"label":"Respuesta"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i079_bathtub_faucet_metaphor.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={22491} durationInFrames={142} premountFor={15}><FedHero kicker="LA CAUSA DIURNA" title="La rutina nocturna no compensa la radiación de la mañana" hot={["radiación"]} sub="Sin protección diaria, la mancha conserva el estímulo que la mantiene visible." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i079_bathtub_faucet_metaphor.png")} accent="#C9A45E" mood="warmdark" side="left" framed /></Sequence>
      <Sequence from={22633} durationInFrames={163} premountFor={15}><MediaBeat durationInFrames={163} beat={178} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i080_sunscreen_beside_keys.png" /></Sequence>
      <Sequence from={22796} durationInFrames={100} premountFor={15}><MediaBeat durationInFrames={100} beat={179} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i083_elena_disappointed_photos.png" /></Sequence>
      <Sequence from={22896} durationInFrames={79} premountFor={15}><MediaBeat durationInFrames={79} beat={180} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i081_printing_second_photo.png" /></Sequence>
      <Sequence from={22975} durationInFrames={84} premountFor={15}><MomentMarker beat={181} kind="avatar" /></Sequence>
      <Sequence from={23059} durationInFrames={84} premountFor={15}><MomentMarker beat={182} kind="avatar" /></Sequence>
      <Sequence from={23143} durationInFrames={98} premountFor={15}><MediaBeat durationInFrames={98} beat={183} kind="video" src="broll/vxnee2w76sqi/d036.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i081_printing_second_photo.png" /></Sequence>
      <Sequence from={23241} durationInFrames={90} premountFor={15}><MediaBeat durationInFrames={90} beat={184} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i085_study_ninety_women.png" /></Sequence>
      <Sequence from={23331} durationInFrames={136} premountFor={15}><FedBeforeAfter kicker="EL PASO DIURNO" title="Sin filtro" hot={["filtro"]} imageA={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i082_compare_same_light_photos.png")} imageB={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i081_printing_second_photo.png")} labelA="Promesa" labelB="Evidencia" accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={23467} durationInFrames={120} premountFor={15}><MediaBeat durationInFrames={120} beat={186} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i082_compare_same_light_photos.png" /></Sequence>
      <Sequence from={23587} durationInFrames={161} premountFor={15}><MediaBeat durationInFrames={161} beat={187} kind="video" src="broll/vxnee2w76sqi/d037.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i083_elena_disappointed_photos.png" /></Sequence>
      <Sequence from={23748} durationInFrames={95} premountFor={15}><MediaBeat durationInFrames={95} beat={188} kind="video" src="broll/vxnee2w76sqi/d038.mp4" /></Sequence>
      <Sequence from={23843} durationInFrames={113} premountFor={15}><MomentMarker beat={189} kind="avatar" /></Sequence>
      <Sequence from={23956} durationInFrames={225} premountFor={15}><FedStat kicker="LO QUE SÍ DICEN LOS DATOS" value={2016} prefix="" suffix="" label="En 2016 se publicó un estudio con 90 mujeres que…" sub="En 2016 se publicó un estudio con 90 mujeres que presentaban signos leves o…" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i085_study_ninety_women.png")} accent="#7FC0BA" mood="science" /></Sequence>
      <Sequence from={24181} durationInFrames={124} premountFor={15}><FedMolecule kicker="LO QUE SÍ DICEN LOS DATOS" title="Recibieron una combinación oral de polifenoles de…" hot={["polifenoles"]} sub="Recibieron una combinación oral de polifenoles de romero y pomelo." centerLabel="ROMERO" nodes={[{"label":"Rosmarínico"},{"label":"Carnósico"},{"label":"Evidencia"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i086_rosemary_grapefruit_capsule.png")} accent="#7FC0BA" mood="science" /></Sequence>
      <Sequence from={24305} durationInFrames={164} premountFor={15}><FedStat kicker="LO QUE SÍ DICEN LOS DATOS" value={4} prefix="" suffix="" label="Los investigadores evaluaron respuesta a radiación…" sub="Los investigadores evaluaron respuesta a radiación ultravioleta, oxidación de…" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i087_uv_wrinkle_elasticity_lab.png")} accent="#7FC0BA" mood="science" /></Sequence>
      <Sequence from={24469} durationInFrames={142} premountFor={15}><MediaBeat durationInFrames={142} beat={193} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i089_misleading_science_ad.png" /></Sequence>
      <Sequence from={24611} durationInFrames={80} premountFor={15}><MediaBeat durationInFrames={80} beat={194} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i085_study_ninety_women.png" /></Sequence>
      <Sequence from={24691} durationInFrames={161} premountFor={15}><FedBeforeAfter kicker="LO QUE SÍ DICEN LOS DATOS" title="No encontraron una diferencia clara entre 100 y 250…" hot={["entre"]} imageA={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i088_dose_comparison_capsules.png")} imageB={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i089_misleading_science_ad.png")} labelA="Promesa" labelB="Evidencia" accent="#7FC0BA" mood="science" /></Sequence>
      <Sequence from={24852} durationInFrames={100} premountFor={15}><MediaBeat durationInFrames={100} beat={196} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i088_dose_comparison_capsules.png" /></Sequence>
      <Sequence from={24952} durationInFrames={85} premountFor={15}><FedBeforeAfter kicker="LO QUE SÍ DICEN LOS DATOS" title="El romero reduce arrugas desde la segunda semana" hot={["semana"]} imageA={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i089_misleading_science_ad.png")} imageB={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i088_dose_comparison_capsules.png")} labelA="Promesa" labelB="Evidencia" accent="#7FC0BA" mood="science" /></Sequence>
      <Sequence from={25037} durationInFrames={98} premountFor={15}><MomentMarker beat={198} kind="avatar" /></Sequence>
      <Sequence from={25135} durationInFrames={127} premountFor={15}><FedHero kicker="QUÉ SE ESTUDIÓ" title="No fue una infusión casera sobre el rostro" hot={["No"]} sub="La forma, la dosis y el control importan antes de atribuir resultados al romero." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i089_misleading_science_ad.png")} accent="#C9A45E" mood="warmdark" side="left" framed /></Sequence>
      <Sequence from={25262} durationInFrames={201} premountFor={15}><FedMolecule kicker="LO QUE SÍ DICEN LOS DATOS" title="No usaron aceite esencial puro" hot={["esencial"]} sub="Tomaron un productoral estandarizado que combinaba romero con pomelo" centerLabel="ROMERO" nodes={[{"label":"Rosmarínico"},{"label":"Carnósico"},{"label":"Evidencia"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i089_misleading_science_ad.png")} accent="#7FC0BA" mood="science" /></Sequence>
      <Sequence from={25463} durationInFrames={107} premountFor={15}><MomentMarker beat={201} kind="avatar" /></Sequence>
      <Sequence from={25570} durationInFrames={156} premountFor={15}><MomentMarker beat={202} kind="avatar" /></Sequence>
      <Sequence from={25726} durationInFrames={105} premountFor={15}><FedStat kicker="EL NÚMERO DEL SOBRE" value={90} prefix="" suffix="" label="Elena escribió 90 detrás de la foto" sub="Un número concreto reemplazó la promesa vaga." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i091_randomized_placebo_trial.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={25831} durationInFrames={127} premountFor={15}><FedStat kicker="LO QUE SÍ DICEN LOS DATOS" value={90} prefix="" suffix="" label="Luego agregó una pregunta" sub="¿90 mujeres probaron lo mismo que yo?" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i094_no_pigment_difference.png")} accent="#7FC0BA" mood="science" /></Sequence>
      <Sequence from={25958} durationInFrames={162} premountFor={15}><MediaBeat durationInFrames={162} beat={205} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i091_randomized_placebo_trial.png" /></Sequence>
      <Sequence from={26120} durationInFrames={161} premountFor={15}><FedStep step={3} total={7} title="En 2025 apareció un ensayo aleatorizado y…" hot={["aleatorizado"]} sub="En 2025 apareció un ensayo aleatorizado y controlado con placebo." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i091_randomized_placebo_trial.png")} accent="#7FC0BA" mood="science" /></Sequence>
      <Sequence from={26281} durationInFrames={140} premountFor={15}><FedStat kicker="LO QUE SÍ DICEN LOS DATOS" value={104} prefix="" suffix="" label="Participaron 104 mujeres de entre 40 y 65 años" sub="Participaron 104 mujeres de entre 40 y 65 años." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i092_study_104_women.png")} accent="#7FC0BA" mood="science" /></Sequence>
      <Sequence from={26421} durationInFrames={182} premountFor={15}><FedStat kicker="DURACIÓN DEL ESTUDIO" value={12} prefix="" suffix=" semanas" label="Extracto oral con cofactores naturales" sub="Ese diseño no equivale a aplicar una receta casera sobre la piel." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i093_twelve_week_placebo.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={26603} durationInFrames={205} premountFor={15}><FedStat kicker="LO QUE SÍ DICEN LOS DATOS" value={3} prefix="" suffix="" label="O un placebo" sub="Hubo mejoras en opacidad, textura áspera, enrojecimiento y apariencia de los…" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i095_corporate_study_link.png")} accent="#7FC0BA" mood="science" /></Sequence>
      <Sequence from={26808} durationInFrames={167} premountFor={15}><MomentMarker beat={210} kind="avatar" /></Sequence>
      <Sequence from={26975} durationInFrames={114} premountFor={15}><FedStat kicker="LO QUE SÍ DICEN LOS DATOS" value={104} prefix="" suffix=" SEM" label="104 mujeres" sub="Dulce semanas" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i094_no_pigment_difference.png")} accent="#7FC0BA" mood="science" /></Sequence>
      <Sequence from={27089} durationInFrames={119} premountFor={15}><MomentMarker beat={212} kind="avatar" /></Sequence>
      <Sequence from={27208} durationInFrames={169} premountFor={15}><FedQuote kicker="LO QUE SÍ DICEN LOS DATOS" quote="Además, el estudio contó con participación de…" author="Evidencia y prudencia" role="Principio editorial" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i095_corporate_study_link.png")} accent="#7FC0BA" mood="science" /></Sequence>
      <Sequence from={27377} durationInFrames={176} premountFor={15}><MomentMarker beat={214} kind="avatar" /></Sequence>
      <Sequence from={27553} durationInFrames={100} premountFor={15}><MediaBeat durationInFrames={100} beat={215} kind="video" src="broll/vxnee2w76sqi/d042.mp4" /></Sequence>
      <Sequence from={27653} durationInFrames={126} premountFor={15}><MomentMarker beat={216} kind="avatar" /></Sequence>
      <Sequence from={27779} durationInFrames={118} premountFor={15}><FedMolecule kicker="LO QUE SÍ DICEN LOS DATOS" title="El romero contiene moléculas estudiadas por su…" hot={["estudiadas"]} sub="El romero contiene moléculas estudiadas por su actividad antioxidante." centerLabel="ROMERO" nodes={[{"label":"Rosmarínico"},{"label":"Carnósico"},{"label":"Evidencia"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i097_antioxidant_rosemary.png")} accent="#7FC0BA" mood="science" /></Sequence>
      <Sequence from={27897} durationInFrames={155} premountFor={15}><FedMolecule kicker="LO QUE SÍ DICEN LOS DATOS" title="Entre ellas se encuentran el ácido rosmarínico y…" hot={["rosmarínico"]} sub="Entre ellas se encuentran el ácido rosmarínico y diterpenos, como el ácido…" centerLabel="ROMERO" nodes={[{"label":"Rosmarínico"},{"label":"Carnósico"},{"label":"Evidencia"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i098_rosmarinic_carnosic_molecules.png")} accent="#7FC0BA" mood="science" /></Sequence>
      <Sequence from={28052} durationInFrames={206} premountFor={15}><FedMolecule kicker="LO QUE SÍ DICEN LOS DATOS" title="En modelos celulares y de laboratorio pueden…" hot={["pueden"]} sub="En modelos celulares y de laboratorio pueden influir sobre procesos…" centerLabel="PIEL" nodes={[{"label":"Barrera"},{"label":"Irritación"},{"label":"Respuesta"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i099_cells_oxidation_inflammation.png")} accent="#7FC0BA" mood="science" /></Sequence>
      <Sequence from={28258} durationInFrames={189} premountFor={15}><MomentMarker beat={220} kind="avatar" /></Sequence>
      <Sequence from={28447} durationInFrames={89} premountFor={15}><MomentMarker beat={221} kind="avatar" /></Sequence>
      <Sequence from={28536} durationInFrames={112} premountFor={15}><MomentMarker beat={222} kind="avatar" /></Sequence>
      <Sequence from={28648} durationInFrames={113} premountFor={15}><MomentMarker beat={223} kind="avatar" /></Sequence>
      <Sequence from={28761} durationInFrames={157} premountFor={15}><MediaBeat durationInFrames={157} beat={224} kind="video" src="broll/vxnee2w76sqi/d043.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i100_cell_dish_not_cheek.png" /></Sequence>
      <Sequence from={28918} durationInFrames={90} premountFor={15}><FedStep step={1} total={7} title="Lo usó dos o tres noches por semana al comienzo" hot={["comienzo"]} sub="Lo usó dos o tres noches por semana al comienzo." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i101_tolerated_night_ritual.png")} accent="#D06A58" mood="cool" /></Sequence>
      <Sequence from={29008} durationInFrames={91} premountFor={15}><MediaBeat durationInFrames={91} beat={226} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i103_retinoid_acid_rosemary_separate.png" /></Sequence>
      <Sequence from={29099} durationInFrames={221} premountFor={15}><MediaBeat durationInFrames={221} beat={227} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i100_cell_dish_not_cheek.png" /></Sequence>
      <Sequence from={29320} durationInFrames={225} premountFor={15}><MediaBeat durationInFrames={225} beat={228} kind="video" src="broll/vxnee2w76sqi/d044.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i103_retinoid_acid_rosemary_separate.png" /></Sequence>
      <Sequence from={29545} durationInFrames={101} premountFor={15}><MomentMarker beat={229} kind="avatar" /></Sequence>
      <Sequence from={29646} durationInFrames={81} premountFor={15}><MomentMarker beat={230} kind="avatar" /></Sequence>
      <Sequence from={29727} durationInFrames={158} premountFor={15}><FedHero kicker="LÍMITES HONESTOS" title="Los retinoides tienen mejor respaldo para líneas…" hot={["líneas"]} sub="Los retinoides tienen mejor respaldo para líneas finas, textura y…" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i103_retinoid_acid_rosemary_separate.png")} accent="#D06A58" mood="cool" side="left" framed /></Sequence>
      <Sequence from={29885} durationInFrames={177} premountFor={15}><MediaBeat durationInFrames={177} beat={232} kind="video" src="broll/vxnee2w76sqi/d045.mp4" /></Sequence>
      <Sequence from={30062} durationInFrames={169} premountFor={15}><FedStep step={2} total={7} title="Deben evitarse durante el embarazo" hot={["embarazo"]} sub="Si hay rosacia activa, excema o mucha sensibilidad," image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i104_pregnancy_rosacea_eczema_warning.png")} accent="#D06A58" mood="cool" /></Sequence>
      <Sequence from={30231} durationInFrames={123} premountFor={15}><MomentMarker beat={234} kind="avatar" /></Sequence>
      <Sequence from={30354} durationInFrames={147} premountFor={15}><MediaBeat durationInFrames={147} beat={235} kind="video" src="broll/vxnee2w76sqi/d046.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i105_accumulated_irritation.png" /></Sequence>
      <Sequence from={30501} durationInFrames={160} premountFor={15}><FedHero kicker="LÍMITES HONESTOS" title="Una amiga le envió otra receta" hot={["receta"]} sub="Romero hervido, jugo de limón, bicarbonato," image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i106_dangerous_kitchen_mixture.png")} accent="#D06A58" mood="cool" side="right" framed /></Sequence>
      <Sequence from={30661} durationInFrames={130} premountFor={15}><FedStat kicker="LÍMITES HONESTOS" value={4} prefix="" suffix="" label="azúcar para arrastrar la mancha" sub="El video tenía millones de reproducciones" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i107_lemon_uv_phototoxicity.png")} accent="#D06A58" mood="cool" /></Sequence>
      <Sequence from={30791} durationInFrames={102} premountFor={15}><FedQuote kicker="LÍMITES HONESTOS" quote="Los comentarios decían, arde, pero funciona" author="Evidencia y prudencia" role="Principio editorial" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i108_phototoxic_blisters.png")} accent="#D06A58" mood="cool" /></Sequence>
      <Sequence from={30893} durationInFrames={137} premountFor={15}><FedHero kicker="EL PRIMER CAPÍTULO" title="El teléfono volvió a prometer una solución rápida" hot={["rápida"]} sub="Elena ya sabía que la mezcla natural también podía irritar o quemar." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i107_lemon_uv_phototoxicity.png")} accent="#C9A45E" mood="warmdark" side="left" framed /></Sequence>
      <Sequence from={31030} durationInFrames={218} premountFor={15}><FedMolecule kicker="LÍMITES HONESTOS" title="El limón puede aportar compuestos capaces de…" hot={["capaces"]} sub="El limón puede aportar compuestos capaces de producir una reacción fototóxica…" centerLabel="PIEL" nodes={[{"label":"Barrera"},{"label":"Irritación"},{"label":"Respuesta"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i107_lemon_uv_phototoxicity.png")} accent="#D06A58" mood="cool" /></Sequence>
      <Sequence from={31248} durationInFrames={143} premountFor={15}><FedMolecule kicker="LÍMITES HONESTOS" title="Puede haber enrojecimiento intenso, ampollas y…" hot={["ampollas"]} sub="Puede haber enrojecimiento intenso, ampollas y manchas de formas extrañas." centerLabel="PIEL" nodes={[{"label":"Inflamación"},{"label":"Pigmento"},{"label":"Luz"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i108_phototoxic_blisters.png")} accent="#D06A58" mood="cool" /></Sequence>
      <Sequence from={31391} durationInFrames={131} premountFor={15}><FedStat kicker="LÍMITES HONESTOS" value={9} prefix="" suffix="" label="El bicarbonato altera el entorno ácido natural de…" sub="El bicarbonato altera el entorno ácido natural de la superficie cutánea." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i109_bicarbonate_ph_barrier.png")} accent="#D06A58" mood="cool" /></Sequence>
      <Sequence from={31522} durationInFrames={88} premountFor={15}><MediaBeat durationInFrames={88} beat={243} kind="video" src="broll/vxnee2w76sqi/d048.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i110_sugar_microabrasions.png" /></Sequence>
      <Sequence from={31610} durationInFrames={112} premountFor={15}><MediaBeat durationInFrames={112} beat={244} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i107_lemon_uv_phototoxicity.png" /></Sequence>
      <Sequence from={31722} durationInFrames={100} premountFor={15}><MomentMarker beat={245} kind="avatar" /></Sequence>
      <Sequence from={31822} durationInFrames={139} premountFor={15}><FedMolecule kicker="LÍMITES HONESTOS" title="Forman una tormenta" hot={["tormenta"]} sub="Si una preparación quema, no está expulsando la mancha" centerLabel="PIEL" nodes={[{"label":"Inflamación"},{"label":"Pigmento"},{"label":"Luz"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i111_four_aggressions_storm.png")} accent="#D06A58" mood="cool" /></Sequence>
      <Sequence from={31961} durationInFrames={128} premountFor={15}><MediaBeat durationInFrames={128} beat={247} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i112_elena_inspects_spot_light.png" /></Sequence>
      <Sequence from={32089} durationInFrames={152} premountFor={15}><MomentMarker beat={248} kind="avatar" /></Sequence>
      <Sequence from={32241} durationInFrames={97} premountFor={15}><MomentMarker beat={249} kind="avatar" /></Sequence>
      <Sequence from={32338} durationInFrames={100} premountFor={15}><MediaBeat durationInFrames={100} beat={250} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i112_elena_inspects_spot_light.png" /></Sequence>
      <Sequence from={32438} durationInFrames={117} premountFor={15}><FedHero kicker="LÍMITES HONESTOS" title="Revisó la mancha bajo buena luz" hot={["buena"]} sub="No todas las manchas son iguales" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i112_elena_inspects_spot_light.png")} accent="#D06A58" mood="cool" side="left" framed /></Sequence>
      <Sequence from={32555} durationInFrames={169} premountFor={15}><FedMolecule kicker="LÍMITES HONESTOS" title="Una marca después de una inflamación puede ser…" hot={["puede"]} sub="Una marca después de una inflamación puede ser hiperpigmentación…" centerLabel="PIEL" nodes={[{"label":"Inflamación"},{"label":"Pigmento"},{"label":"Luz"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i113_types_of_dark_spots.png")} accent="#D06A58" mood="cool" /></Sequence>
      <Sequence from={32724} durationInFrames={128} premountFor={15}><FedMolecule kicker="LÍMITES HONESTOS" title="Una placa simétrica sobre mejillas o frente puede…" hot={["puede"]} sub="Una placa simétrica sobre mejillas o frente puede corresponder a melasma." centerLabel="PIEL" nodes={[{"label":"Inflamación"},{"label":"Pigmento"},{"label":"Luz"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i114_dermatologist_exam.png")} accent="#D06A58" mood="cool" /></Sequence>
      <Sequence from={32852} durationInFrames={96} premountFor={15}><FedMolecule kicker="LÍMITES HONESTOS" title="Una mancha marrón uniforme puede ser un léntigo…" hot={["léntigo"]} sub="Una mancha marrón uniforme puede ser un léntigo solar." centerLabel="PIEL" nodes={[{"label":"Inflamación"},{"label":"Pigmento"},{"label":"Luz"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i115_elena_consultation_relief.png")} accent="#D06A58" mood="cool" /></Sequence>
      <Sequence from={32948} durationInFrames={97} premountFor={15}><FedMolecule kicker="LÍMITES HONESTOS" title="Una zona áspera puede ser una keratosis actínica" hot={["actínica"]} sub="Una zona áspera puede ser una keratosis actínica." centerLabel="PIEL" nodes={[{"label":"Barrera"},{"label":"Irritación"},{"label":"Respuesta"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i113_types_of_dark_spots.png")} accent="#D06A58" mood="cool" /></Sequence>
      <Sequence from={33045} durationInFrames={104} premountFor={15}><MomentMarker beat={256} kind="avatar" /></Sequence>
      <Sequence from={33149} durationInFrames={87} premountFor={15}><MomentMarker beat={257} kind="avatar" /></Sequence>
      <Sequence from={33236} durationInFrames={96} premountFor={15}><MediaBeat durationInFrames={96} beat={258} kind="video" src="broll/vxnee2w76sqi/d050.mp4" /></Sequence>
      <Sequence from={33332} durationInFrames={219} premountFor={15}><FedStep step={7} total={7} title="Un borde irregular merece atención" hot={["atención"]} sub="Sangrado, costra persistente, dolor o picazón nueva no son una invitación" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i116_four_week_photos_row.png")} accent="#D06A58" mood="cool" /></Sequence>
      <Sequence from={33551} durationInFrames={143} premountFor={15}><MomentMarker beat={260} kind="avatar" /></Sequence>
      <Sequence from={33694} durationInFrames={238} premountFor={15}><MomentMarker beat={261} kind="avatar" /></Sequence>
      <Sequence from={33932} durationInFrames={116} premountFor={15}><FedHero kicker="ANTES DE ACLARAR" title="Primero pidió que revisaran la mancha" hot={["revisaran"]} sub="Diagnosticar una lesión persistente es más importante que seguir probando mezclas." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i115_elena_consultation_relief.png")} accent="#C9A45E" mood="warmdark" side="left" framed /></Sequence>
      <Sequence from={34048} durationInFrames={84} premountFor={15}><MomentMarker beat={263} kind="avatar" /></Sequence>
      <Sequence from={34132} durationInFrames={175} premountFor={15}><MomentMarker beat={264} kind="avatar" /></Sequence>
      <Sequence from={34307} durationInFrames={107} premountFor={15}><FedStep step={6} total={7} title="Saber cuándo dejar de probar" hot={["probar"]} sub="La historia llegó a la semana 8" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i115_elena_consultation_relief.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={34414} durationInFrames={81} premountFor={15}><FedStat kicker="EL SOBRE DE FOTOS" value={4} prefix="" suffix="" label="El sobre ya contenía 4 fotografías" sub="El sobre ya contenía 4 fotografías." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i116_four_week_photos_row.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={34495} durationInFrames={153} premountFor={15}><FedHero kicker="EL SOBRE DE FOTOS" title="Elena las colocó en fila sobre la mesa" hot={["sobre"]} sub="La primera mostraba el borde rojo después del aceite" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i117_makeup_no_longer_cracks.png")} accent="#C9A45E" mood="warmdark" side="left" framed /></Sequence>
      <Sequence from={34648} durationInFrames={76} premountFor={15}><MediaBeat durationInFrames={76} beat={268} kind="video" src="broll/vxnee2w76sqi/d052.mp4" /></Sequence>
      <Sequence from={34724} durationInFrames={98} premountFor={15}><MediaBeat durationInFrames={98} beat={269} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i115_elena_consultation_relief.png" /></Sequence>
      <Sequence from={34822} durationInFrames={76} premountFor={15}><FedHero kicker="EL SOBRE DE FOTOS" title="La cuarta parecía casi igual que la tercera" hot={["tercera"]} sub="La cuarta parecía casi igual que la tercera." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i117_makeup_no_longer_cracks.png")} accent="#C9A45E" mood="warmdark" side="right" framed /></Sequence>
      <Sequence from={34898} durationInFrames={157} premountFor={15}><MediaBeat durationInFrames={157} beat={271} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i118_money_saved_receipts.png" /></Sequence>
      <Sequence from={35055} durationInFrames={110} premountFor={15}><FedStat kicker="EL SOBRE DE FOTOS" value={8} prefix="" suffix=" SEM" label="Durante 8 semanas no había aparecido una nueva zona…" sub="Durante 8 semanas no había aparecido una nueva zona irritada." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i119_confident_by_window.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={35165} durationInFrames={86} premountFor={15}><MediaBeat durationInFrames={86} beat={273} kind="video" src="broll/vxnee2w76sqi/d053.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i117_makeup_no_longer_cracks.png" /></Sequence>
      <Sequence from={35251} durationInFrames={98} premountFor={15}><MediaBeat durationInFrames={98} beat={274} kind="video" src="broll/vxnee2w76sqi/d054.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i118_money_saved_receipts.png" /></Sequence>
      <Sequence from={35349} durationInFrames={145} premountFor={15}><MediaBeat durationInFrames={145} beat={275} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i119_confident_by_window.png" /></Sequence>
      <Sequence from={35494} durationInFrames={130} premountFor={15}><MomentMarker beat={276} kind="avatar" /></Sequence>
      <Sequence from={35624} durationInFrames={139} premountFor={15}><MomentMarker beat={277} kind="avatar" /></Sequence>
      <Sequence from={35763} durationInFrames={131} premountFor={15}><FedStep step={5} total={7} title="Si el objetivo es hidratación, puede haber cambios…" hot={["cambios"]} sub="Si el objetivo es hidratación, puede haber cambios de comodidad en días." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i117_makeup_no_longer_cracks.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={35894} durationInFrames={81} premountFor={15}><MediaBeat durationInFrames={81} beat={279} kind="video" src="broll/vxnee2w76sqi/d055.mp4" /></Sequence>
      <Sequence from={35975} durationInFrames={164} premountFor={15}><FedStep step={7} total={7} title="Si el objetivo es pigmentación o líneas finas…" hot={["finas"]} sub="Si el objetivo es pigmentación o líneas finas verdaderas, piense en meses." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i120_months_not_hours.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={36139} durationInFrames={189} premountFor={15}><FedStat kicker="EL SOBRE DE FOTOS" value={6} prefix="" suffix="" label="Algunas manchas superficiales tardan entre 6 y 12…" sub="Algunas manchas superficiales tardan entre 6 y 12 meses en aclararse después…" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i120_months_not_hours.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={36328} durationInFrames={81} premountFor={15}><MomentMarker beat={282} kind="avatar" /></Sequence>
      <Sequence from={36409} durationInFrames={119} premountFor={15}><MediaBeat durationInFrames={119} beat={283} kind="video" src="broll/vxnee2w76sqi/d056.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i121_mirror_anxiety_close.png" /></Sequence>
      <Sequence from={36528} durationInFrames={116} premountFor={15}><FedStep step={4} total={7} title="Eso solo mide ansiedad" hot={["ansiedad"]} sub="Se fotografía cada 4 semanas" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i123_final_family_gathering.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={36644} durationInFrames={101} premountFor={15}><MediaBeat durationInFrames={101} beat={285} kind="video" src="broll/vxnee2w76sqi/d057.mp4" /></Sequence>
      <Sequence from={36745} durationInFrames={101} premountFor={15}><MediaBeat durationInFrames={101} beat={286} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i122_blank_progress_template.png" /></Sequence>
      <Sequence from={36846} durationInFrames={85} premountFor={15}><MediaBeat durationInFrames={85} beat={287} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i120_months_not_hours.png" /></Sequence>
      <Sequence from={36931} durationInFrames={126} premountFor={15}><MediaBeat durationInFrames={126} beat={288} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i120_months_not_hours.png" /></Sequence>
      <Sequence from={37057} durationInFrames={72} premountFor={15}><MomentMarker beat={289} kind="avatar" /></Sequence>
      <Sequence from={37129} durationInFrames={144} premountFor={15}><FedHero kicker="EL SOBRE DE FOTOS" title="En la descripción voy a dejarle la plantilla exacta…" hot={["exacta"]} sub="En la descripción voy a dejarle la plantilla exacta que utilizó Elena en la…" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i122_blank_progress_template.png")} accent="#C9A45E" mood="warmdark" side="right" framed /></Sequence>
      <Sequence from={37273} durationInFrames={156} premountFor={15}><MediaBeat durationInFrames={156} beat={291} kind="video" src="broll/vxnee2w76sqi/d058.mp4" /></Sequence>
      <Sequence from={37429} durationInFrames={111} premountFor={15}><MediaBeat durationInFrames={111} beat={292} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i124_three_products_final_table.png" /></Sequence>
      <Sequence from={37540} durationInFrames={174} premountFor={15}><MomentMarker beat={293} kind="avatar" /></Sequence>
      <Sequence from={37714} durationInFrames={96} premountFor={15}><FedStep step={7} total={7} title="En la semana 12 llegó la última reunión familiar" hot={["familiar"]} sub="En la semana 12 llegó la última reunión familiar." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i123_final_family_gathering.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={37810} durationInFrames={84} premountFor={15}><MediaBeat durationInFrames={84} beat={295} kind="video" src="broll/vxnee2w76sqi/d059.mp4" /></Sequence>
      <Sequence from={37894} durationInFrames={135} premountFor={15}><MediaBeat durationInFrames={135} beat={296} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i123_final_family_gathering.png" /></Sequence>
      <Sequence from={38029} durationInFrames={120} premountFor={15}><MediaBeat durationInFrames={120} beat={297} kind="video" src="broll/vxnee2w76sqi/d060.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i124_three_products_final_table.png" /></Sequence>
      <Sequence from={38149} durationInFrames={191} premountFor={15}><FedHero kicker="EL SOBRE DE FOTOS" title="Lo dejó sobre la mesa" hot={["sobre"]} sub="Después colocó al lado el protector solar, la hidratante y el producto…" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i125_envelope_full_of_receipts.png")} accent="#C9A45E" mood="warmdark" side="right" framed /></Sequence>
      <Sequence from={38340} durationInFrames={123} premountFor={15}><FedStat kicker="EL SOBRE DE FOTOS" value={11} prefix="" suffix="" label="Este frasco me prometió borrar 11 años en 7 noches" sub="Este frasco me prometió borrar 11 años en 7 noches." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i126_night_irritation_day_radiation.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={38463} durationInFrames={218} premountFor={15}><MediaBeat durationInFrames={218} beat={300} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i124_three_products_final_table.png" /></Sequence>
      <Sequence from={38681} durationInFrames={95} premountFor={15}><MediaBeat durationInFrames={95} beat={301} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i125_envelope_full_of_receipts.png" /></Sequence>
      <Sequence from={38776} durationInFrames={150} premountFor={15}><MediaBeat durationInFrames={150} beat={302} kind="video" src="broll/vxnee2w76sqi/d061.mp4" /></Sequence>
      <Sequence from={38926} durationInFrames={116} premountFor={15}><MomentMarker beat={303} kind="avatar" /></Sequence>
      <Sequence from={39042} durationInFrames={172} premountFor={15}><MomentMarker beat={304} kind="avatar" /></Sequence>
      <Sequence from={39214} durationInFrames={170} premountFor={15}><MediaBeat durationInFrames={170} beat={305} kind="video" src="broll/vxnee2w76sqi/d062.mp4" /></Sequence>
      <Sequence from={39384} durationInFrames={123} premountFor={15}><FedStat kicker="EL SOBRE DE FOTOS" value={1} prefix="" suffix="" label="Ella abrió otro compartimento del sobre" sub="Allí estaban los recibos" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i125_envelope_full_of_receipts.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={39507} durationInFrames={86} premountFor={15}><FedStat kicker="EL SOBRE DE FOTOS" value={2} prefix="" suffix="" label="La suma equivalía a varias semanas de compras" sub="La suma equivalía a varias semanas de compras." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i124_three_products_final_table.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={39593} durationInFrames={96} premountFor={15}><MomentMarker beat={308} kind="avatar" /></Sequence>
      <Sequence from={39689} durationInFrames={219} premountFor={15}><FedQuote kicker="EL ERROR COMPLETO" quote="Aquí se paga el gran loop" author="Evidencia y prudencia" role="Principio editorial" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i123_final_family_gathering.png")} accent="#D06A58" mood="warmdark" /></Sequence>
      <Sequence from={39908} durationInFrames={85} premountFor={15}><FedMolecule kicker="EL ERROR COMPLETO" title="actuando" hot={["actuando"]} sub="Porque el ardor era inflamación" centerLabel="PIEL" nodes={[{"label":"Barrera"},{"label":"Irritación"},{"label":"Respuesta"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i126_night_irritation_day_radiation.png")} accent="#D06A58" mood="warmdark" /></Sequence>
      <Sequence from={39993} durationInFrames={79} premountFor={15}><MediaBeat durationInFrames={79} beat={311} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i125_envelope_full_of_receipts.png" /></Sequence>
      <Sequence from={40072} durationInFrames={104} premountFor={15}><MediaBeat durationInFrames={104} beat={312} kind="video" src="broll/vxnee2w76sqi/d063.mp4" /></Sequence>
      <Sequence from={40176} durationInFrames={81} premountFor={15}><FedBeforeAfter kicker="EL ERROR COMPLETO" title="Irritación de noche" hot={["noche"]} imageA={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i126_night_irritation_day_radiation.png")} imageB={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i125_envelope_full_of_receipts.png")} labelA="Promesa" labelB="Evidencia" accent="#D06A58" mood="warmdark" /></Sequence>
      <Sequence from={40257} durationInFrames={124} premountFor={15}><FedMolecule kicker="EL ERROR COMPLETO" title="Esa era la máquina que alimentaba la mancha" hot={["mancha"]} sub="No faltaba una quinta gota" centerLabel="PIEL" nodes={[{"label":"Inflamación"},{"label":"Pigmento"},{"label":"Luz"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i124_three_products_final_table.png")} accent="#D06A58" mood="warmdark" /></Sequence>
      <Sequence from={40381} durationInFrames={147} premountFor={15}><MomentMarker beat={315} kind="avatar" /></Sequence>
      <Sequence from={40528} durationInFrames={127} premountFor={15}><MomentMarker beat={316} kind="avatar" /></Sequence>
      <Sequence from={40655} durationInFrames={101} premountFor={15}><MomentMarker beat={317} kind="avatar" /></Sequence>
      <Sequence from={40756} durationInFrames={110} premountFor={15}><MomentMarker beat={318} kind="avatar" /></Sequence>
      <Sequence from={40866} durationInFrames={163} premountFor={15}><MomentMarker beat={319} kind="avatar" /></Sequence>
      <Sequence from={41029} durationInFrames={83} premountFor={15}><MomentMarker beat={320} kind="avatar" /></Sequence>
      <Sequence from={41112} durationInFrames={152} premountFor={15}><MomentMarker beat={321} kind="avatar" /></Sequence>
      <Sequence from={41264} durationInFrames={111} premountFor={15}><MediaBeat durationInFrames={111} beat={322} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i040_honest_tradition_choice.png" /></Sequence>
      <Sequence from={41375} durationInFrames={115} premountFor={15}><FedStep step={1} total={7} title="Pero descarta el aceite puro" hot={["aceite"]} sub="Descarta la mezcla sin conservar" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i011_urgent_medical_attention.png")} accent="#D06A58" mood="warmdark" /></Sequence>
      <Sequence from={41490} durationInFrames={83} premountFor={15}><MediaBeat durationInFrames={83} beat={324} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i030_read_label_recap.png" /></Sequence>
      <Sequence from={41573} durationInFrames={219} premountFor={15}><FedStep step={3} total={7} title="Descarta la promesa de borrar la edad" hot={["borrar"]} sub="Si usted disfruta un cosmético terminado con extracto de romero lo tolera y…" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i040_honest_tradition_choice.png")} accent="#D06A58" mood="warmdark" /></Sequence>
      <Sequence from={41792} durationInFrames={116} premountFor={15}><MomentMarker beat={326} kind="avatar" /></Sequence>
      <Sequence from={41908} durationInFrames={77} premountFor={15}><MomentMarker beat={327} kind="avatar" /></Sequence>
      <Sequence from={41985} durationInFrames={199} premountFor={15}><MomentMarker beat={328} kind="avatar" /></Sequence>
      <Sequence from={42184} durationInFrames={223} premountFor={15}><MomentMarker beat={329} kind="avatar" /></Sequence>
      <Sequence from={42407} durationInFrames={95} premountFor={15}><FedStep step={1} total={7} title="tibia" hot={["tibia"]} sub="No frote" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i127_rinse_and_protect_safety.png")} accent="#D06A58" mood="warmdark" /></Sequence>
      <Sequence from={42502} durationInFrames={93} premountFor={15}><FedStep step={2} total={2} title="Hidrate con algo que ya tolera" hot={["tolera"]} sub="Después de enjuagar, use una hidratante sencilla y conocida." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i127_rinse_and_protect_safety.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={42595} durationInFrames={151} premountFor={15}><FedStep step={3} total={7} title="Evite el sol directo y protégase" hot={["protégase"]} sub="Si aparecen ampollas, hinchazón importante," image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i030_read_label_recap.png")} accent="#D06A58" mood="warmdark" /></Sequence>
      <Sequence from={42746} durationInFrames={169} premountFor={15}><MediaBeat durationInFrames={169} beat={333} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i039_patch_test_recap.png" /></Sequence>
      <Sequence from={42915} durationInFrames={122} premountFor={15}><MomentMarker beat={334} kind="avatar" /></Sequence>
      <Sequence from={43037} durationInFrames={88} premountFor={15}><FedBeforeAfter kicker="EL ERROR COMPLETO" title="No pongas vinagre sobre el bicarbonato de sodio" hot={["sodio"]} imageA={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i011_urgent_medical_attention.png")} imageB={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i030_read_label_recap.png")} labelA="Promesa" labelB="Evidencia" accent="#D06A58" mood="warmdark" /></Sequence>
      <Sequence from={43125} durationInFrames={130} premountFor={15}><MediaBeat durationInFrames={130} beat={336} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i030_read_label_recap.png" /></Sequence>
      <Sequence from={43255} durationInFrames={77} premountFor={15}><MomentMarker beat={337} kind="avatar" /></Sequence>
      <Sequence from={43332} durationInFrames={79} premountFor={15}><MomentMarker beat={338} kind="avatar" /></Sequence>
      <Sequence from={43411} durationInFrames={189} premountFor={15}><FedStep step={3} total={7} title="Primero, mire la etiqueta" hot={["etiqueta"]} sub="Si no declara ingredientes, concentración, fabricante y vencimiento," image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i030_read_label_recap.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={43600} durationInFrames={117} premountFor={15}><MediaBeat durationInFrames={117} beat={340} kind="video" src="broll/vxnee2w76sqi/d066.mp4" /></Sequence>
      <Sequence from={43717} durationInFrames={165} premountFor={15}><FedStep step={5} total={7} title="Si desea incorporar romero, elija un producto…" hot={["producto"]} sub="Si desea incorporar romero, elija un producto cosmético terminado y siga su…" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i030_read_label_recap.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={43882} durationInFrames={196} premountFor={15}><FedStep step={6} total={7} title="Tercero, pruebe una pequeña cantidad en el…" hot={["cantidad"]} sub="Tercero, pruebe una pequeña cantidad en el antebrazo dos veces al día durante…" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i039_patch_test_recap.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={44078} durationInFrames={112} premountFor={15}><MediaBeat durationInFrames={112} beat={343} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i071_standardized_photo_recap.png" /></Sequence>
      <Sequence from={44190} durationInFrames={87} premountFor={15}><FedStep step={1} total={7} title="Cuarto, introduzca un solo producto nuevo" hot={["nuevo"]} sub="Cuarto, introduzca un solo producto nuevo." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i084_suspicious_spot_recap.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={44277} durationInFrames={118} premountFor={15}><MediaBeat durationInFrames={118} beat={345} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i058_sunscreen_recap.png" /></Sequence>
      <Sequence from={44395} durationInFrames={75} premountFor={15}><MediaBeat durationInFrames={75} beat={346} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i071_standardized_photo_recap.png" /></Sequence>
      <Sequence from={44470} durationInFrames={138} premountFor={15}><FedStep step={4} total={7} title="Quinto, use protector de amplio espectro con factor…" hot={["factor"]} sub="Quinto, use protector de amplio espectro con factor 30 o más cada mañana." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i058_sunscreen_recap.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={44608} durationInFrames={160} premountFor={15}><MediaBeat durationInFrames={160} beat={348} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i090_downloadable_safety_sheet.png" /></Sequence>
      <Sequence from={44768} durationInFrames={114} premountFor={15}><FedStep step={6} total={7} title="Sexto, fotografíe cada cuatro semanas bajo la misma…" hot={["misma"]} sub="Sexto, fotografíe cada cuatro semanas bajo la misma luz." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i071_standardized_photo_recap.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={44882} durationInFrames={154} premountFor={15}><MediaBeat durationInFrames={154} beat={350} kind="video" src="broll/vxnee2w76sqi/d067.mp4" /></Sequence>
      <Sequence from={45036} durationInFrames={137} premountFor={15}><FedStep step={1} total={7} title="presenta varios colores o tiene un borde irregular,…" hot={["irregular"]} sub="presenta varios colores o tiene un borde irregular, no experimente,…" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i084_suspicious_spot_recap.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={45173} durationInFrames={221} premountFor={15}><FedStep step={2} total={7} title="La ficha completa con cantidades orientativas,…" hot={["orientativas"]} sub="La ficha completa con cantidades orientativas, calendario de tolerancia,…" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i090_downloadable_safety_sheet.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={45394} durationInFrames={90} premountFor={15}><MomentMarker beat={353} kind="avatar" /></Sequence>
      <Sequence from={45484} durationInFrames={126} premountFor={15}><MomentMarker beat={354} kind="avatar" /></Sequence>
      <Sequence from={45610} durationInFrames={81} premountFor={15}><MediaBeat durationInFrames={81} beat={355} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i102_comment_recipe_source.png" /></Sequence>
      <Sequence from={45691} durationInFrames={83} premountFor={15}><MediaBeat durationInFrames={83} beat={356} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i128_three_kitchen_dangers_teaser.png" /></Sequence>
      <Sequence from={45774} durationInFrames={91} premountFor={15}><MomentMarker beat={357} kind="avatar" /></Sequence>
      <Sequence from={45865} durationInFrames={210} premountFor={15}><MomentMarker beat={358} kind="avatar" /></Sequence>
      <Sequence from={46075} durationInFrames={136} premountFor={15}><FedHero kicker="PARA RECORDAR" title="En el próximo video voy a abrir tres frascos que…" hot={["frascos"]} sub="En el próximo video voy a abrir tres frascos que suelen esconderse en la…" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i128_three_kitchen_dangers_teaser.png")} accent="#C9A45E" mood="warmdark" side="left" framed /></Sequence>
      <Sequence from={46211} durationInFrames={90} premountFor={15}><FedHero kicker="PARA RECORDAR" title="Limón, bicarbonato, aceites esenciales" hot={["esenciales"]} sub="Limón, bicarbonato, aceites esenciales." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i128_three_kitchen_dangers_teaser.png")} accent="#C9A45E" mood="warmdark" side="right" framed /></Sequence>
      <Sequence from={46301} durationInFrames={86} premountFor={15}><FedMolecule kicker="PARA RECORDAR" title="Le mostraré qué reacción puede provocar cada uno" hot={["provocar"]} sub="Le mostraré qué reacción puede provocar cada uno." centerLabel="PIEL" nodes={[{"label":"Barrera"},{"label":"Irritación"},{"label":"Respuesta"}]} image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i129_elena_closes_envelope.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={46387} durationInFrames={76} premountFor={15}><FedHero kicker="PRÓXIMO EPISODIO" title="Cómo reconocer una quemadura fototóxica" hot={["fototóxica"]} sub="Y qué tres mezclas de cocina conviene mantener lejos de la piel." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i128_three_kitchen_dangers_teaser.png")} accent="#C9A45E" mood="warmdark" side="left" framed /></Sequence>
      <Sequence from={46463} durationInFrames={136} premountFor={15}><FedStep step={6} total={7} title="Y qué debe hacer durante las primeras 24 horas si…" hot={["horas"]} sub="Y qué debe hacer durante las primeras 24 horas si ya se aplicó la mezcla." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i102_comment_recipe_source.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={46599} durationInFrames={79} premountFor={15}><FedStep step={7} total={7} title="Elena cerró el sobre después de 12 semanas" hot={["semanas"]} sub="Elena cerró el sobre después de 12 semanas." image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i129_elena_closes_envelope.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={46678} durationInFrames={103} premountFor={15}><FedBeforeAfter kicker="PARA RECORDAR" title="La última foto no mostraba una cara 20 años más…" hot={["mostraba"]} imageA={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i129_elena_closes_envelope.png")} imageB={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i130_final_window_portrait.png")} labelA="Promesa" labelB="Evidencia" accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={46781} durationInFrames={131} premountFor={15}><MediaBeat durationInFrames={131} beat={366} kind="video" src="broll/vxnee2w76sqi/d069.mp4" secondaryImage="img/vxnee2w76sqi/vxnee2w76sqi_i130_final_window_portrait.png" /></Sequence>
      <Sequence from={46912} durationInFrames={121} premountFor={15}><FedQuote kicker="PARA RECORDAR" quote="Detrás escribió una sola frase" author="Evidencia y prudencia" role="Principio editorial" image={staticFile("img/vxnee2w76sqi/vxnee2w76sqi_i128_three_kitchen_dangers_teaser.png")} accent="#C9A45E" mood="warmdark" /></Sequence>
      <Sequence from={47033} durationInFrames={120} premountFor={15}><MediaBeat durationInFrames={120} beat={368} kind="image" src="img/vxnee2w76sqi/vxnee2w76sqi_i102_comment_recipe_source.png" /></Sequence>
      <Sequence from={47153} durationInFrames={89} premountFor={15}><MomentMarker beat={369} kind="avatar" /></Sequence>
      <Sequence from={47242} durationInFrames={113} premountFor={15}><MomentMarker beat={370} kind="avatar" /></Sequence>
      <Sequence from={47355} durationInFrames={139} premountFor={15}><MomentMarker beat={371} kind="avatar" /></Sequence>
      <AvatarStageVxnee2w76sqi />
      <Sequence from={569} durationInFrames={105} premountFor={15}><MicroLowerThird><FedLowerThird name="Dr. Valler" role="Piel madura · evidencia" topic="Este es el tema principal" accent="#C9A45E" avatarSrc={null} /></MicroLowerThird></Sequence>
      <Sequence from={1183} durationInFrames={105} premountFor={15}><MicroLowerThird><FedLowerThird name="Dr. Valler" role="Piel madura · evidencia" topic="Uno de ellos puede acompañar una rutina" accent="#C9A45E" avatarSrc={null} /></MicroLowerThird></Sequence>
      <Sequence from={2396} durationInFrames={85} premountFor={15}><MicroLowerThird><FedLowerThird name="Dr. Valler" role="Piel madura · evidencia" topic="cosmética y concentración" accent="#C9A45E" avatarSrc={null} /></MicroLowerThird></Sequence>
      <Sequence from={5000} durationInFrames={100} premountFor={15}><MicroLowerThird><FedLowerThird name="Dr. Valler" role="Piel madura · evidencia" topic="Esa fue la mentira que cambió toda la historia" accent="#C9A45E" avatarSrc={null} /></MicroLowerThird></Sequence>
      <Sequence from={6302} durationInFrames={105} premountFor={15}><MicroLowerThird><FedLowerThird name="Dr. Valler" role="Piel madura · evidencia" topic="Romero, respondió Elena" accent="#C9A45E" avatarSrc={null} /></MicroLowerThird></Sequence>
      <Sequence from={7892} durationInFrames={73} premountFor={15}><MicroLowerThird><FedLowerThird name="Dr. Valler" role="Piel madura · evidencia" topic="Y no debe aplicarse puro sobre el rostro" accent="#C9A45E" avatarSrc={null} /></MicroLowerThird></Sequence>
      <Sequence from={8700} durationInFrames={105} premountFor={15}><MicroLowerThird><FedLowerThird name="Dr. Valler" role="Piel madura · evidencia" topic="Elena guardó el teléfono sin contestar" accent="#C9A45E" avatarSrc={null} /></MicroLowerThird></Sequence>
      <Sequence from={9649} durationInFrames={105} premountFor={15}><MicroLowerThird><FedLowerThird name="Dr. Valler" role="Piel madura · evidencia" topic="El enemigo es la exageración que convierte la…" accent="#C9A45E" avatarSrc={null} /></MicroLowerThird></Sequence>
      <Sequence from={11136} durationInFrames={105} premountFor={15}><MicroLowerThird><FedLowerThird name="Dr. Valler" role="Piel madura · evidencia" topic="Demuestra algo mucho más útil" accent="#C9A45E" avatarSrc={null} /></MicroLowerThird></Sequence>
      <Sequence from={12394} durationInFrames={78} premountFor={15}><MicroLowerThird><FedLowerThird name="Dr. Valler" role="Piel madura · evidencia" topic="Aprender a no confundir dolor con eficacia" accent="#C9A45E" avatarSrc={null} /></MicroLowerThird></Sequence>
      <Sequence from={13408} durationInFrames={105} premountFor={15}><MicroLowerThird><FedLowerThird name="Dr. Valler" role="Piel madura · evidencia" topic="Esa diferencia parece aburrida hasta que usted…" accent="#C9A45E" avatarSrc={null} /></MicroLowerThird></Sequence>
      <Sequence from={14644} durationInFrames={80} premountFor={15}><MicroLowerThird><FedLowerThird name="Dr. Valler" role="Piel madura · evidencia" topic="Una alergia no se entrena con más producto" accent="#C9A45E" avatarSrc={null} /></MicroLowerThird></Sequence>
      <Sequence from={15519} durationInFrames={105} premountFor={15}><MicroLowerThird><FedLowerThird name="Dr. Valler" role="Piel madura · evidencia" topic="El producto había superado la primera compuerta y…" accent="#C9A45E" avatarSrc={null} /></MicroLowerThird></Sequence>
      <Sequence from={18097} durationInFrames={97} premountFor={15}><MicroLowerThird><FedLowerThird name="Dr. Valler" role="Piel madura · evidencia" topic="Por primera vez, la historia le entregó un…" accent="#C9A45E" avatarSrc={null} /></MicroLowerThird></Sequence>
      <Sequence from={21031} durationInFrames={105} premountFor={15}><MicroLowerThird><FedLowerThird name="Dr. Valler" role="Piel madura · evidencia" topic="Pero quedaba la mancha" accent="#C9A45E" avatarSrc={null} /></MicroLowerThird></Sequence>
      <Sequence from={22975} durationInFrames={84} premountFor={15}><MicroLowerThird><FedLowerThird name="Dr. Valler" role="Piel madura · evidencia" topic="El beneficio ya no era una promesa dentro de un…" accent="#C9A45E" avatarSrc={null} /></MicroLowerThird></Sequence>
      <Sequence from={28258} durationInFrames={105} premountFor={15}><MicroLowerThird><FedLowerThird name="Dr. Valler" role="Piel madura · evidencia" topic="Eso merece investigación" accent="#C9A45E" avatarSrc={null} /></MicroLowerThird></Sequence>
      <Sequence from={34132} durationInFrames={105} premountFor={15}><MicroLowerThird><FedLowerThird name="Dr. Valler" role="Piel madura · evidencia" topic="Produjo tranquilidad" accent="#C9A45E" avatarSrc={null} /></MicroLowerThird></Sequence>
      <Sequence from={41029} durationInFrames={83} premountFor={15}><MicroLowerThird><FedLowerThird name="Dr. Valler" role="Piel madura · evidencia" topic="No existe una conspiración para esconder el romero" accent="#C9A45E" avatarSrc={null} /></MicroLowerThird></Sequence>
      <Sequence from={47153} durationInFrames={89} premountFor={15}><MicroLowerThird><FedLowerThird name="Dr. Valler" role="Piel madura · evidencia" topic="La constancia protege más que la concentración" accent="#C9A45E" avatarSrc={null} /></MicroLowerThird></Sequence>
    </AbsoluteFill>
  );
};
